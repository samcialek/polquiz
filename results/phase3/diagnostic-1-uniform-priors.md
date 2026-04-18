# Diagnostic 1 — old softmax-of-distance scorer with uniform priors

**Purpose.** Test ADR-001's hypothesis that the post-3b → Phase-3 top-1 drop
(86.8% → 45.5%) is explained by the elimination of per-archetype priors.
Under the hypothesis, replacing the old scorer's actual priors with uniform
1/n priors should collapse top-1 to the same ~45% level.

**Method.** Non-destructive shadow harness at `src/eval/diagnostic1-shadow.ts`.
Runs the current harness (current selector, stop-rule, answer generation,
questions.representative, archetypes) for all 121 archetypes at σ=0 seed=0.
At each run's final state, re-scores four ways and compares winners:

| variant | scorer |
|---|---|
| **A** | new Euclidean WTA (argmin)                         — current production |
| **B** | OLD scalar distance, argmin (no softmax, no priors) — `5ab3a04:src/engine/archetypeDistance.ts` verbatim |
| **C** | OLD scalar distance + softmax (adaptive T 0.12→0.04) with **uniform** priors 1/118 |
| **D** | OLD scalar distance + softmax with **actual** codebase priors |

## Results

| variant | top-1 | top-1% | top-5 | top-5% |
|---|---|---|---|---|
| A — new WTA argmin                  | 55  | 45.5% | 84  | 69.4% |
| B — OLD distance argmin             | 98  | 81.0% | 110 | 90.9% |
| C — OLD + softmax + uniform priors  | 98  | 81.0% | 110 | 90.9% |
| D — OLD + softmax + actual priors   | 98  | 81.0% | 110 | 90.9% |

**B = C = D identically.** No archetype flipped between these three variants.

## Verdict: ADR-001 hypothesis REJECTED

The headline ADR-001 claim — "the 86.8% → 45.5% top-1 drop is the expected and
intended consequence of eliminating per-archetype priors" — does not survive the
diagnostic. Priors contributed **zero** to ranking in the old regime:

1. **Codebase-native priors were already uniform.** `src/config/archetypes.ts`
   across its entire git history assigns `prior: 1/N` to every active archetype
   (N rolling 112 → 115 → 118) and `prior: 0` to three deactivated IDs.
   Similarly, the `trbAnchorPrior` field referenced by old code paths was
   never populated (CLAUDE.md "H3 confirmed" — zero `trbAnchorPrior` entries).

2. **Uniform priors cancel under softmax normalization.** `likelihood_a =
   exp(-(d_a - d_min)/T) · prior`. When `prior` is a constant `k` for all
   active archetypes, `k` factors out of the `sum`, so `posterior_a =
   exp(-(d_a - d_min)/T) / Σ exp(...)` — the prior drops entirely.

3. **The arithmetic confirms it.** Variants C (uniform 1/118) and D (actual
   codebase priors, which are themselves uniform 1/118) produce byte-identical
   rankings, and both match B (plain argmin of the same distance, no softmax)
   because softmax is a monotone transform that preserves argmax/argmin of the
   underlying distance. B, C, D agree on 98 of 98 top-1 picks.

The 86.8% → 45.5% drop is therefore **not** a priors-elimination story. The
material change is the scoring function itself: weighted scalar distance →
Euclidean WTA with anti-penalty.

## What the numbers actually say

**Scoring-function isolation (B vs A).** Holding the selector, stop-rule,
answer sequences, final state, and archetype signatures identical, swapping
the argmin-scoring function from old (scalar distance) to new (Euclidean WTA)
loses **43 top-1 picks** — from 98 (81.0%) to 55 (45.5%). The new scoring
function is the dominant driver of the level shift.

**Selector/stop-rule effect (B = 81.0% vs post-3b = 86.8%).** The old scorer,
re-scored against final states the **new** selector/stop-rule produced, lands
at 81.0% — not 86.8%. The 5.8-point gap is attributable to the selector/stop-
rule changes between post-3b (coverage-inflation present, posterior-driven
selection) and Phase-3g (hollow-touch drops, distance-driven selection). The
new selector produces shorter, leaner answer sequences (28.4 avg Q vs 40.3)
but at a modest accuracy cost when feeding the old scorer.

**Top-5 collapse (B=90.9% vs A=69.4%).** The new WTA loses 21.5 pp at top-5.
Top-5 is an easier target than top-1 — losing that many even when we get
five chances says the new scoring function is degrading neighborhood
structure, not just the tiebreaker.

## Implications for Phase 3

- The Phase-3h summary statement `"The top-1 level drop from 86.8% → 45.5%
  under the new WTA scorer is the expected and intended consequence of
  eliminating per-archetype priors"` is **mechanically incorrect**. This line
  should be retracted from `phase-3h-summary.md` once we understand what is
  actually causing the drop.

- ADR-001's "priors eliminated" framing for the level shift is wrong in this
  codebase. Priors elimination on its own was a ranking no-op. The scoring-
  function swap from scalar-blend to Euclidean-WTA is the material change and
  needs to be evaluated on its own merits, not defended as a downstream
  consequence of priors removal.

- The 81% figure matters: it is the top-1 recall of the **old scoring math**
  against the **new engine's selection behavior**. It is a plausible lower
  bound on what a re-tuned scorer could reach under the new selector/stop-
  rule. The gap from 81% → 55% is recoverable ceiling, not a physical limit
  of the node-discrimination signal.

## Artifacts

- `src/eval/diagnostic1-shadow.ts` — the shadow harness (no mutations to
  main codebase).
- `results/phase3/diagnostic-artifacts/diagnostic-1-results.json` — 121-row
  per-archetype output: winners under each variant, target rank under each,
  leader distance/posterior.
- `results/phase3/diagnostic-artifacts/arch-snap.ts` — `git show
  5ab3a04:src/config/archetypes.ts` (prior reference used to confirm uniform
  priors across history).
- `results/phase3/diagnostic-artifacts/old-priors.json` — extracted priors
  dump confirming all 130 entries are `prior: 1/130` in the snapshot.

## Next steps

Per the diagnostic plan, proceed to Diagnostics 2-4 to localize **where** the
new scorer is failing — the hypothesis is rejected but the level shift still
needs to be explained mechanically.

- Diagnostic 2 — check which categorical distance formulation shipped
  (argmax per the original 3a plan vs. soft preferred-term ≥0.30 amended
  later) and quantify impact.
- Diagnostic 3 — per-archetype failure profile on the 66 misses: confounder
  identity, anti-flag incidence, salience breadth, categorical share of
  distance.
- Diagnostic 4 — selector/stop-rule cadence: avg Q, stop-rule firing
  distribution, question-selection frequency under the new vs old scoring
  signals.
