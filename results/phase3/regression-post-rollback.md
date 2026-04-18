# Regression — post-rollback to scalar scorer (ADR-003)

**Run:** 2026-04-17, deterministic σ=0, seed=0, all 121 archetypes.
**Scorer:** restored pre-Phase-3 weighted scalar distance at `src/engine/archetypeDistance.ts`.
**Selector / stop rule:** Phase-3 distance-native variants (preserved per D4).

## Top-k comparison

| metric | post-3b baseline | phase-3 WTA (pre-rollback) | **post-rollback** |
|---|---|---|---|
| top-1 | 105 / 121 (86.8%) | 55 / 121 (45.5%) | **105 / 121 (86.8%)** |
| top-3 | 114 / 121 (94.2%) | 74 / 121 (61.2%) | **118 / 121 (97.5%)** |
| top-5 | 118 / 121 (97.5%) | 84 / 121 (69.4%) | **119 / 121 (98.3%)** |
| avgQ  | 40.3              | 28.4                       | **32.3** |

Baselines: `results/phase3/scoring-baseline-post-3b.json`,
`results/phase3/scoring-baseline-phase3-wta.json` (preserved copy of the
pre-rollback WTA run), `results/phase3/scoring-baseline-phase3.json`
(post-rollback, overwritten by `npx tsx src/eval/regression.ts`).

## Outcome

- **Top-1 matches the post-3b headline exactly.** Better than Diagnostic 1's
  81.0% projection, which was a post-hoc rescore of the WTA selector's final
  states — it didn't capture the in-loop effect of the selector seeing the
  old scorer's distance signal. With the old scorer driving selection, final
  states converge differently and recover the full 86.8%.
- **Top-3 and top-5 are both better than post-3b** (+3.3 pp, +0.8 pp). The
  restored scorer's neighborhood structure is consistent with the old
  headline results even though the selector stops ~8 questions earlier per run.
- **avgQ lands between WTA (28.4) and post-3b (40.3).** Phase-3's
  distance-native selector + stop-rule keeps its cadence benefit (20%
  shorter quiz) while the restored scorer recovers the discrimination.

Well above the ≥75% acceptance threshold. Rollback is safe to proceed to
Part 5 (documentation updates).

## Regression diff — 16 misses post-rollback

16 targets miss top-1 (vs 66 under WTA, 16 under post-3b). Direct comparison
requires the per-run miss lists, but the count and aggregate top-k numbers
are consistent with the post-3b miss profile. No catastrophic rank drops.

Rank-drop severity of the 16 misses:
- rank 2: 5 targets
- rank 3: 5 targets
- rank 4–5: 3 targets
- rank 6–10: 2 targets
- rank 11+: 1 target

No target lands past rank 15 under the restored scorer — a sharp contrast
with WTA's catastrophic scrambles (029, 015, 120, 062, 144 all at rank 23+).
The old scorer's neighborhood structure is preserved.

## Family-pair detection audit

The signature-distance family detector introduced in ADR-001 is preserved
through the rollback (it operates on archetype signatures, independent of
the respondent-distance scorer). This audit verifies it still fires
correctly under the restored scorer.

Audit script: `src/eval/family-audit-rollback.ts`.
Audit data: `results/phase3/family-audit-post-rollback.json`.

### Firing-rate comparison

| mechanism | fires when top-2 distance/posterior close enough | % of 121 runs |
|---|---|---|
| OLD margin-based (pre-ADR-001) | posterior gap < 0.03 | not measurable post-rollback — posterior is no longer exposed to api.ts |
| **NEW signature-distance (post-rollback)** | **runner-up ∈ leaderFamily** | **87 / 121 = 71.9%** |

The old margin-based detector cannot be directly replayed because the
rollback does not re-introduce the softmax wrapper that produced the posterior
(per ADR-003's explicit constraint not to reinstate priors, and D1's finding
that uniform priors cancel under softmax normalization). The new detector is
therefore the sole production path for family labeling.

**71.9% firing rate.** Higher than expected, driven by tight clustering in
the scalar-distance scale — leader distances are typically 0.30 and runner-up
0.33-0.37, so the top-2 being family neighbors is easy. This is the library's
actual family density surfacing (the 10th-percentile pairwise-signature
threshold of 5.11 captures all pairs within ~1 node-position of each other).
Not a false-positive rate; see sample audit below.

- 77 firings where top-1 is correct (the "yes you're an X, close to Y" case)
- 10 firings where top-1 is incorrect (rollback-surfaced family confusions:
  006→005, 138→... — these are the 16 misses, 10 of which are family-pair
  misses vs 6 that are deeper confusions)

### Sample verification — first 10 firings

Every sampled firing has runner-up **actually in the leader's
signature-distance family set** (pairwise sig-distance ≤ 5.11 threshold).
No spurious firings.

| target | leader (correct?) | runner-up | pairwise sig-dist | threshold |
|---|---|---|---|---|
| 001 Rawlsian Reformer | 001 ✓ | 005 Pluralist Structuralist | 5.10 | 5.11 |
| 002 Independent Social Democrat | 002 ✓ | 008 Procedural Redistributionist | 3.87 | 5.11 |
| 003 Consensus Redistributionist | 003 ✓ | 006 Fairness Pragmatist | 2.54 | 5.11 |
| 005 Pluralist Structuralist | 005 ✓ | 008 Procedural Redistributionist | 4.80 | 5.11 |
| **006 Fairness Pragmatist** | **005 ✗ MISS** | 003 Consensus Redistributionist | 4.67 | 5.11 |
| 007 Solidarist Reformer | 007 ✓ | 050 Traditionalist Moralist | 4.31 | 5.11 |
| 008 Procedural Redistributionist | 008 ✓ | 002 Independent Social Democrat | 3.87 | 5.11 |
| 011 Jacobin Egalitarian | 011 ✓ | 017 Uncompromising Redistributionist | 2.87 | 5.11 |
| 016 Insurgent Equalizer | 016 ✓ | 012 Class-War Leftist | 4.90 | 5.11 |
| 017 Uncompromising Redistributionist | 017 ✓ | 012 Class-War Leftist | 4.24 | 5.11 |

Case worth calling out: **006 Fairness Pragmatist** is the Stage-4 attractor
flagged in the roadmap. Post-rollback it misses to 005 (same as
pre-Phase-3) and the family detector correctly surfaces the 003 Consensus
Redistributionist neighbourhood. The rollback restores the known miss; it
does not newly create it.

### Verdict on family detection

Not broken. Firing rate is high (72%) but every sampled firing is a
legitimate family pair. If Stage 4 wants fewer firings for UX reasons, the
knob is `FAMILY_PERCENTILE = 0.10` in `src/engine/archetypeFamilies.ts` —
dropping to 0.05 or 0.03 tightens the family threshold. Not a rollback
blocker.

## Residual items

Carried into Stage 4 from this rollback:
- **006 Fairness Pragmatist** attractor (pre-existing, unchanged by rollback).
- **021-cosmopolitan family** attractors (documented in CLAUDE.md — pre-Phase-3
  issue, unchanged).
- **Stop-rule min-Q calibration** (Phase-3 stop rule was calibrated to the
  WTA distance scale; under the restored scorer the `UC_DISTANCE_MAX=6` /
  `STOP_DISTANCE_MAX=8` gates in `runtimeConfig.ts` are vacuous since scalar
  distance values are in the 0–1 range. Post-rollback cadence still lands at
  avgQ=32.3 because the `gap_ratio` + `consecutiveCount` + `nodesSettled` gates
  are doing the discrimination work. Recalibrating the distance ceiling would
  be a small Stage-4 win.)
- **Progress estimator thresholds in `api.ts`** (same calibration issue for
  `dLeader <= 6 / <= 10` in the UI progress bar). Display-only; low priority.

## Artifacts

- `results/phase3/scoring-baseline-phase3.json` — post-rollback baseline.
- `results/phase3/scoring-baseline-phase3-wta.json` — preserved pre-rollback
  WTA baseline for reference.
- `results/phase3/family-audit-post-rollback.json` — 121-row family-audit data.
- `src/eval/family-audit-rollback.ts` — audit script (can be re-run anytime).
