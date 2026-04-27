# Question-Rewrite Experiment — Results

**Date:** 2026-04-27
**Branch:** self-cluster-collapse (changes reverted, not committed)
**Baseline tag:** `baseline-pre-question-rewrite` (commit `e8e6710`)

## Verdict

**Reverted.** The rewrite as drafted dropped persona-replay top-1 by 4.2pp
and pushed cross-profile divergence overlap up (less divergent), opposite the
intent. Below the user's pre-set "within -2pp or improves" criterion.

## What was tried

Replaced six abstract salience sliders / omnibus questions with concrete
tradeoff questions per `drafts-revised.md`:

| Retired | Replacement | Format |
|---|---|---|
| Q19 (ONT_H sal slider) | — (retired, signal recovered via Q219) | — |
| Q49 (ONT_H+ONT_S sal slider) | Q219 progress_mechanism_tradeoff | best_worst (6 items) |
| Q51 (CU+CD sal slider, TRB anchor) | Q220 priority_domain_tradeoff | best_worst (5 items) |
| Q69 (COM sal slider) | Q221 bargain_tradeoff | single_choice (4 options) |
| Q38 (PRO sal slider) | Q222 procedure_outcome_tradeoff | best_worst (5 items) |
| Q101 (CD dual-axis omnibus) | Q223 abortion_position_grid + Q224 lgbtq_position_grid | single_choice + single_choice |

Plus a `scoreBucketMap` patch in persona-replay.ts to handle `{ pos }` and
empty `{}` signal shapes (best_worst items use `{ pos }`, salience-only items
use `{}`; the existing scorer treated both as 0).

## Results vs control

| Metric | Baseline | Experiment | Delta | Criterion | Pass? |
|---|---|---|---|---|---|
| Persona-replay top-1 | 57.9% (70/121) | 53.7% (65/121) | **-4.2pp** | within -2pp or improves | ❌ |
| Persona-replay top-3 | 76.0% (92/121) | 74.4% (90/121) | -1.6pp | within -2pp or improves | ✓ |
| Cross-profile overlap | 71.4% | 73.1% | **+1.7pp** | meaningfully below 71.4% | ❌ |
| Adaptive shifts off old | n/a | partial | — | shifts away from old Q | ⚠️ |

Adaptive pool detail (3-profile diagnostic):
- religious-right: Q219 fires (replaces Q49 signal)
- libertarian: Q220 fires (replaces Q51 signal)
- hard-left: no new questions in adaptive — engine still preferred old pool members

## Suspected causes (not investigated to root)

1. **Persona-replay scorer + pos-distribution items.** The deterministic
   answer-picker compresses a 5-bin distribution to a single mean-pos scalar.
   For best_worst items where two items target the same node from opposite
   poles (Q220 immigration_restriction vs cultural_pluralism), this works. For
   items where most items target *different* nodes (Q219, Q222), the picker
   ranks items by how strongly their target pos matches the persona's pos —
   not by which dimension matters most to the persona. A persona that should
   pick `material_now` BEST might pick `inherited_tradition` instead because
   their CD position aligns more strongly with the item's pos signal than
   their MAT salience aligns with the empty `{}` signal.
2. **Salience-only signal shape ambiguity.** For items declared
   `{ MAT: {} }`, my scorer fix scored them by persona's MAT salience. But
   persona salience is noisy in archetype templates (most archetypes set sal
   integer 0-3) and the conversion `(sal - 1.5) / 1.5` produces a narrow
   range relative to position-driven items in the same question.
3. **bestWorstSalience doesn't honor TRB anchor.** Q220 declares trbAnchor
   evidence in touchProfile but applyBestWorstSalience ignores it
   (handles only continuous + categorical). The TRB-anchor signal Q51 used to
   carry was simply not reproduced in Q220 evidence application.
4. **CD overload.** Q219 inherited_tradition + Q224 lgbtq_position_grid both
   carry CD pos-high signals. If both fire in the same run, CD position gets
   over-concentrated relative to the old single Q101 dual-axis gesture.
5. **Engine still preferred old questions for hard-left.** Suggests the EIG
   selector did not see the new questions as more informative for that
   profile — possibly because the new questions' touchProfile weights spread
   more thinly across nodes than the focused old sliders.

## What's safe to keep (separate experiments)

- The `scoreBucketMap` patch in persona-replay.ts is a real bug fix for the
  `{ pos }` shape (Q93 priority_sort items also use this shape and were
  silently scoring 0 under the old scorer). Worth landing **as its own
  isolated experiment** to measure whether the fix alone moves the baseline.
- `bestWorstLabels` schema field on `QuestionDef` already in `src/types.ts`
  from the infrastructure commit; ready to use whenever a future best_worst
  question wants per-question label overrides.

## Recommended next pass (if/when the user wants to retry)

1. **Land the scoreBucketMap fix in isolation** to re-measure the baseline
   without the question changes. The current 57.9% baseline is computed with
   the broken scorer; the "true" baseline could be slightly different.
2. **Add trbAnchor support to applyBestWorstSalience** before retrying Q220,
   so the TRB anchor side-channel signal Q51 carried isn't dropped.
3. **Reconsider Q219/Q222 design.** Multi-node best_worst with most items
   pointing at distinct nodes is structurally harder for the deterministic
   picker than two opposite-pole items per node (Q93 / Q220 pattern). Could
   reframe Q219 as a 2-item-per-node tradeoff (material_high/low,
   institutions_high/low, etc.) instead of 6 single-direction items.
4. **Drop CD redundancy across Q219/Q224.** Either Q219 inherited_tradition
   or Q224 lgbtq carries CD position; not both. Q224 has the cleaner
   per-option CD distributions.
5. **Stage the rewrite by dimension, not by file.** Replace the COM slider
   (Q69→Q221) and re-measure. Then the PRO slider (Q38→Q222). Etc. A 6-at-a-
   time swap mixes confounds.

## Files reverted

- `src/config/questions.representative.ts` — `git checkout HEAD --`
- `src/test/persona-replay.ts` — manually restored `scoreBucketMap` to the
  pre-experiment two-line scalar-or-zero scorer

The drafts (`drafts.md`, `drafts-revised.md`) and the new
`experiment-results.md` (this file) are kept for reference. No source-tree
changes were committed.
