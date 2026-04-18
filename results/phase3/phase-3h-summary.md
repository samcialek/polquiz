# Phase 3h — Summary documentation for Phase 3

> **Retracted and superseded 2026-04-17.** ADR-001 was rolled back under ADR-003 after
> Diagnostic 1 rejected its premise. The scoring layer is the pre-Phase-3 weighted scalar
> scorer; priors were always uniform and cancelled under softmax normalization, so their
> elimination was a ranking no-op. The 86.8% → 45.5% drop was attributable to the scoring
> *function* swap, not priors removal. See `results/architecture/ADR-003-rollback-scoring.md`
> and `results/phase3/regression-post-rollback.md` (post-rollback baseline: 105/121 = 86.8%
> top-1). The text below is preserved for historical record; the "expected and intended
> consequence" claim in the Current Phase 3 baseline section is mechanically incorrect and
> should be read with the retraction in mind.

Phase 3 implemented ADR-001 (Euclidean winner-take-all scoring, priors eliminated) and ADR-002
(ENG migration: removed from archetype signatures, surfaced as dual label via
`src/engine/engagementLabel.ts`). It also incorporated a Stage-1 TRB evidence-map fix and a
Stage-4 pre-emptive attractor check against 021 Principled Cosmopolitan.

This note is the Phase 3h completion record. Baselines and diff reports referenced:

| stage | deliverable | file |
|-------|-------------|------|
| 3a | combined implementation plan | `results/phase3/plan.md` |
| 3b | ENG-removal regression | `results/phase3/regression-3b-eng-removed.md` |
| 3b | post-3b baseline | `results/phase3/scoring-baseline-post-3b.json` |
| 3c | Euclidean WTA scorer | in-code: `src/engine/archetypeDistance.ts` |
| 3d | selector + stop-rule rework | in-code: `src/engine/nextQuestion.ts`, `src/engine/stopRule.ts` |
| 3e | engagement label + IP integration | in-code: `src/engine/engagementLabel.ts`, `src/identity/resolveIdentityPrimary.ts` |
| 3f | duplicate archetype detection | `results/phase3/duplicate-archetypes.md` (PAUSED — Stage 4 territory) |
| 3g | hollow-touch audit + drop regression | `results/phase3/regression-3g-hollow-drops.md` |
| 3g | Phase 3 baseline under new scorer | `results/phase3/scoring-baseline-phase3.json` |
| Stage 4 | 021→001 attractor status | `results/phase3/attractor-021-resolved.md` |

## Current Phase 3 baseline

| metric | pre-3b (legacy scorer) | post-3b (legacy scorer, no ENG) | post-3g (new WTA scorer, no ENG, hollows dropped) |
|--------|------------------------|---------------------------------|---------------------------------------------------|
| top1   | 104 (86.0%)            | 105 (86.8%)                     | **55 (45.5%)**                                    |
| top3   | 113 (93.4%)            | 113 (93.4%)                     | **80 (66.1%)**                                    |
| top5   | 116 (95.9%)            | 116 (95.9%)                     | **87 (71.9%)**                                    |
| avg Q  | 39.1                   | 40.3                            | 28.4                                              |

<!-- RETRACTED 2026-04-17 per ADR-003. Diagnostic 1 established that per-archetype
priors were always uniform (1/N across every codebase version) and cancel under
softmax normalization, so their elimination was a ranking no-op. The 86.8% → 45.5%
drop was caused by the scoring-function swap (weighted scalar → Euclidean WTA
with +10 anti penalty), not priors removal — see `results/phase3/diagnostic-1-uniform-priors.md`
and `results/phase3/diagnostic-3-failure-profile.md`. The paragraph originally
here claimed the drop was "expected and intended"; that claim was mechanically
false. Post-rollback top-1 is 105/121 (86.8%) — `results/phase3/regression-post-rollback.md`. -->

~~The top-1 level drop from 86.8% → 45.5% under the new WTA scorer is the expected and intended
consequence of eliminating per-archetype priors.~~ **(Retracted — see ADR-003.)**

The avg-Q drop (40.3 → 28.4) is a clear win from the new selector / stop rule.

## Phase-3g hollow-touch drops — what it did

`src/diagnostics/questionInfo.ts` measures inter-variant JSD at every declared `touchProfile`
entry for both the representative and full question banks. 67 entries in the representative
bank had JSD < 1e-4 — the touch was declared but no evidence map wrote to that node:role. The
entries were still bumping the `touches` counter via `registerTouches()`, which the selector
and stop-rule use as coverage signal — so the selector was over-crediting coverage and, as a
result, under-picking questions that produced real posterior motion.

`results/question-info-audit/drop-hollow-touches.py` removed 68 hollow entries from 44
questions. Net regression delta: +5 top1, +5 top3, −1 top5, −5 total misses, avg-Q unchanged.

## Stage-4 021 attractor

Resolved as a side effect of 3g. 021 Principled Cosmopolitan now resolves to itself at rank 1.
The previous `021 → 001 Rawlsian Reformer` collapse was caused by the selector mis-crediting
TRB coverage on hollow-touching questions, flattening 021's final TRB anchor posterior. Details
in `results/phase3/attractor-021-resolved.md`.

## Known remaining weak questions (representative bank)

After the hollow-touch drops, the weakest representative-bank questions by inter-variant JSD
are ranking-format questions whose per-item signal is modest:

| Q  | prompt                              | uiType  | JSD    |
|----|-------------------------------------|---------|--------|
| 23 | who_should_shape_a_law              | ranking | 0.0071 |
| 50 | integration_expectations_rewrite    | ranking | 0.0167 |
| 60 | politically_important_identities    | ranking | 0.0310 |
| 54 | religion_in_upbringing              | single  | 0.0474 |

Q60 is relevant to H2 — its TRB_ANCHOR signal is the weakest discriminator in the bank. Not
critical for Phase 3; revisit in Stage 4 attractor sharpening.

## Full question bank

64/64 full-bank questions flagged as `no_variants_generable`. The full bank is a
specification document (evidence maps are only populated in the representative bank). This is
by design; no action needed.

## Carry-forward items

- Task #49 B — decision-ingestion scaffolding for elections-review. Not started.
- Task #47 Stage 4 attractor sharpening — closed as resolved-by-side-effect for 021. 001 now
  collapses to 005 Pluralist Structuralist (rank 20); not prioritized.
- The Phase-3 baseline at 55/121 top-1 is the honest signal level; whether it needs to be
  lifted is a product question, not a scoring-layer question.
