# Diagnostic 2 — categorical distance implementation check

**Purpose.** Verify which version of the categorical distance shipped: the
original 3a argmax draft, or the amended "soft" formulation (probs ≥ 0.30
threshold). Document the implementation as part of ADR-003's record of how
the Phase-3 failure happened. Not a fix — the scorer is being rolled back
regardless.

## Shipped code

`src/engine/archetypeDistance.ts:85-113`:

```ts
let preferredTerm = 0;
let preferredIdx = -1;
let preferredProb = 0;
for (let i = 0; i < 6; i++) {
  const p = template.probs[i] ?? 0;
  if (p > preferredProb) {
    preferredProb = p;
    preferredIdx = i;
  }
}
if (preferredProb >= CATEGORICAL_PREFERRED_THRESHOLD && preferredIdx >= 0) {
  preferredTerm = 1 - (nodeState.catDist[preferredIdx] ?? 0);
}

let antiTerm = 0;
if (template.antiCats && template.antiCats.length > 0) {
  for (const antiIdx of template.antiCats) {
    if (antiIdx >= 0 && antiIdx < 6) {
      antiTerm += nodeState.catDist[antiIdx] ?? 0;
    }
  }
}
// ... then multiplied by max(s^A, s^R) and added to the squared-distance sum.
```

`CATEGORICAL_PREFERRED_THRESHOLD = 0.30`.

## Comparison to spec

The 3a plan (`results/phase3/plan.md:40-47`) explicitly marks the
categorical formulation as **"FINAL — replaces earlier argmax draft"** and
defines:

> **Preferred-present:** `max(template.probs) ≥ 0.30` → `preferred =
> argmax(template.probs)`. Contributes `(1 - p_R[preferred])` to the
> unweighted distance.

The shipped code matches this exactly: it takes `argmax(template.probs)`,
gates with `≥ 0.30`, and contributes `1 - catDist[argmaxIdx]`. There is
**no drift between the 3a final spec and the shipped implementation**.

## What "soft" meant, and what shipped

The 3a plan's "soft" formulation is not fully-soft multi-category — it is
**argmax-on-template, soft-on-respondent**. The archetype's 6-cat prior is
collapsed to a single representative category (its argmax) before matching.
All non-argmax template mass is discarded.

A **genuinely** soft alternative would be, e.g., `preferredTerm = 1 -
sum_c template.probs[c] · catDist[c]` (correlation-based) or some
threshold-gated average over all categories with `template.probs[c] ≥ 0.30`.
The shipped scorer implements neither.

## How much template mass is discarded

Per `results/phase3/diagnostic-artifacts/analyze-categorical.py` against
`src/config/archetypes.ts` (118 active archetypes):

| measure | EPS | AES |
|---|---|---|
| argmax ≥ 0.30 (preferred-present) | 118 / 118 (100%) | 118 / 118 (100%) |
| argmax < 0.30 (silent — no preferred term) | 0 | 0 |
| **2nd-highest ≥ 0.30** (a true-soft formulation would weight it; shipped discards) | **2 (1.7%)** | **2 (1.7%)** |
| has antiCats | 97 (82%) | 47 (40%) |

Archetypes with 2nd-highest category mass ≥ 0.30:
- EPS: `045` Rooted Social Reformer (top-3 probs: 0.33, 0.33, 0.14), `060`
  (top-3: 0.38, 0.33, 0.14)
- AES: `020` Grassroots Autonomist (0.40, 0.38, 0.08), `142` White Grievance
  Voter (0.40, 0.30, 0.10)

**Interpretation.** A genuinely-soft multi-category formulation would have
changed the scoring of **4 archetypes** out of 118. For everyone else, the
shipped argmax-gated form produces numerically identical output to a soft
sum-over-cats-above-0.30. The implementation-vs-spec question is immaterial
to the failure.

## Peak-confidence distribution

| peak value | EPS count | AES count |
|---|---|---|
| 0.30–0.45 | 7  | 4 |
| 0.45–0.60 | 69 | 14 |
| 0.60–0.80 | 42 | 100 |
| ≥ 0.80    | 0  | 0 |

EPS templates cluster in the 0.45–0.60 range (moderate confidence); AES
templates are more peaked (0.60–0.80 dominant, from the 6-category
`[statesman, technocrat, pastoral, authentic, fighter, visionary]` design
where archetypes typically favor one style strongly). No archetype uses
templates so flat that the preferred term vanishes (argmax < 0.30).

## Salience distribution

| categorical template sal | EPS archetypes | AES archetypes |
|---|---|---|
| sal=0 | 0 | 0 |
| sal=1 | 90 | 78 |
| sal=2 | 23 | 33 |
| sal=3 | 5  | 7  |

The `max(s^A, s^R)` salience weight means the categorical contribution is
always at least `template.sal · (preferred_term + anti_term)`. With most
templates at sal=1 and respondent sal converging toward ~1 for quiet
categoricals, the weighted categorical contribution per archetype is
typically small.

## The actual categorical-related concern (for ADR-003's record)

The shipped categorical term is shaped correctly per spec, but the **term's
value is the problem**, not its structure. Consider a typical archetype
with `EPS: {probs: [0.25, 0.58, 0.05, 0.03, 0.06, 0.03], sal: 2,
antiCats: [5]}`:

- Respondent fully converged to category 1 (the argmax): `preferred_term =
  1 - 1.0 = 0`, `anti_term = 0` → node contribution 0.
- Respondent fully converged to category 0 (anti-adjacent): `preferred_term
  = 1 - 0 = 1`, `anti_term = 0` → node contribution `1 · max(2, s^R)` ≈ 2
  pre-sqrt.
- Respondent stuck at uniform `[0.167]×6`: `preferred_term = 1 - 0.167 =
  0.833` → node contribution `0.833 · max(2, s^R)` ≈ 1.67 pre-sqrt.

A respondent who hasn't converged gets almost the same categorical penalty
as a fully-wrong one. The spec's design intends this: `1 - p_R[preferred]`
is a monotone distance from "respondent has placed all mass on preferred
category" to "respondent has placed no mass there." But under the new scorer
**this bleeds into the Euclidean sum alongside anti penalties of +10** on
continuous nodes, and the categorical contribution is too small relative to
continuous anti penalties and too large relative to continuous near-match
contributions. The balance wasn't calibrated.

This is a Euclidean-WTA scaling problem, not a categorical-implementation
problem. ADR-003 rolls back the scorer; the categorical formulation is
moot going forward.

## Verdict

- Shipped categorical implementation matches the 3a final spec exactly.
  No argmax-draft regression.
- The "soft vs argmax" distinction is a 1.7% concern given the peaked
  template shapes in the archetype library.
- The categorical term is not the root cause of the 81% → 45.5% drop. The
  root cause is the overall Euclidean-WTA + anti-penalty scaling; see
  Diagnostic 3 for the failure profile.
