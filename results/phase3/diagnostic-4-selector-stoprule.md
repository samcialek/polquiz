# Diagnostic 4 — selector / stop-rule cadence under the new engine

**Purpose.** Decide whether Phase 3's selector + stop-rule rework should be
preserved or partially reverted as part of the ADR-003 rollback. Diagnostic 1
already isolated the selector/stop-rule contribution at ~6 pp (86.8% → 81.0%
under the old scorer with the new selector). D4 looks at **how** that cost
shows up — question-count distribution, stop-rule firing mass, win rate
stratified by Q bucket — to tell preserve from revert.

**Sources.**
- `results/phase3/scoring-baseline-post-3b.json` — pre-Phase-3 selector + old scorer.
- `results/phase3/scoring-baseline-phase3.json` — current selector + WTA scorer.
- `results/phase3/diagnostic-artifacts/diagnostic-1-results.json` — old scorer
  re-evaluated against Phase-3's final states.
- `results/phase3/diagnostic-artifacts/analyze-selector-stoprule.py`.

## Headline cadence shift

| metric | post-3b | phase-3 | Δ |
|---|---|---|---|
| top-1 | **105 / 121 (86.8%)** | **55 / 121 (45.5%)** | -41.3 pp |
| avg questions / run | **40.3** | **28.4** | **-11.9 Q** |
| min Q | 25 | 25 | — |
| max Q (hard cap) | 55 | 55 | — |

The new stop rule answers ~30% fewer questions per run. The accuracy drop is
dominated by the scorer change (per D1), but the selector contribution is
real and has a distinctive shape.

## Q-count distribution — where each regime lives

| Q bucket | post-3b | phase-3 |
|---|---|---|
| **= 25 (min)**      |  **1 / 121 (0.8%)** | **53 / 121 (43.8%)** |
| 26–30               | 10 / 121 (8.3%)    | 41 / 121 (33.9%) |
| 31–35               | 23 / 121 (19.0%)   | 17 / 121 (14.0%) |
| 36–45               | **64 / 121 (52.9%)** |  8 / 121 (6.6%) |
| 46–54               | 13 / 121 (10.7%)   |  1 / 121 (0.8%) |
| **= 55 (hard cap)** | **10 / 121 (8.3%)** |  **1 / 121 (0.8%)** |

Post-3b's mode is 36–45 Q. Phase-3's mode is **exactly Q=25**, the minimum.
Taken together, **77.7%** of phase-3 runs stop at Q ≤ 30 versus 9.1% post-3b.
The stop rule is firing at the minimum threshold for nearly half of all runs.

Phase-3 also loses the hard-cap tail. Only 1 / 121 runs reaches Q=55 versus
10 / 121 under post-3b. The hard-cap bucket under post-3b is the "unresolvable"
tail (40% win rate — see below); phase-3 stops those runs early instead of
letting them grind, which is cadence-positive.

## Win rate stratified by Q bucket

| Q bucket | post-3b correct / n (%) | phase-3 correct / n (%) |
|---|---|---|
| = min (25) | 1 / 1 (100.0%) | 26 / 53 (**49.1%**) |
| 26–30      | 10 / 10 (100.0%) | 17 / 41 (**41.5%**) |
| 31–35      | 23 / 23 (100.0%) | 7 / 17 (41.2%) |
| 36–45      | 56 / 64 (87.5%) | 5 / 8 (62.5%) |
| 46–54      | 11 / 13 (84.6%) | 0 / 1 (0.0%) |
| = 55 (cap) | 4 / 10 (40.0%)  | 0 / 1 (0.0%) |

Post-3b had **100% win rate through Q=35** — the short-Q runs under the old
regime were the runs that resolved confidently and early. Phase-3's short-Q
runs are the opposite: the stop rule fires at min-Q despite the scorer not
having resolved the target. 49% win rate at Q=25 says the new stop rule is
**not using archetype-posterior concentration** as a gate.

This is consistent with what Phase 3 actually changed: the selector and stop
rule moved from posterior-driven to distance-driven signals when the
archetype posterior was eliminated. The new stop rule appears to be
triggering on node-posterior concentration rather than archetype-level
discrimination, so it declares itself done before the archetype field has
been narrowed.

## Decomposition of the 86.8% → 45.5% drop

| contributor | shift | magnitude |
|---|---|---|
| Selector + stop-rule (post-3b → phase-3, held-constant scorer) | 86.8% → 81.0% | **-5.8 pp** |
| Scorer (old scalar → new WTA, held-constant phase-3 states)    | 81.0% → 45.5% | **-35.5 pp** |
| Combined                                                        | 86.8% → 45.5% | -41.3 pp |

The selector change is **14%** of the observed drop; the scorer change is
**86%**. Rolling back the scorer alone is the load-bearing move.

## Interaction with the rollback — what to do

The selector rework sits alongside several other Phase-3 changes the rollback
**preserves** (hollow-touch drops, ENG migration, engagementLabel module,
reconciliation tool, signature-distance family detection). Ripping the
selector out and restoring the old posterior-driven selector would:

- Re-introduce ~500 lines of old coverage-inflation code that depends on the
  archetype posterior being a live signal.
- Re-add the hollow-touch coverage overcounting problem (TRB evidence maps
  counted 5× under the old regime — documented in `results/trb-fix/diagnosis.md`).
- Cost ~12 extra questions / run at 81% top-1 (post-3b baseline headline).

**Recommendation: preserve the new selector and stop rule in the rollback.**
The 5.8 pp cost is documented and small relative to the ~36 pp the scorer
rollback is expected to recover. The aggressive min-Q stopping is a
calibration problem, not a structural one.

**Stage-4 follow-up (flagged, not part of ADR-003).** The min-Q=25 mode at
49% win rate says the stop rule's concentration metric is not load-bearing
for archetype discrimination under the new engine. Two candidate tunings:

1. Raise min Q from 25 to ~32–35. This captures where post-3b's top-1 was
   still 100% and phase-3's mass already lives.
2. Add an archetype-distance-concentration gate to the stop rule: require
   that the top-1 WTA distance be clearly separated from top-2 before
   allowing early termination. This re-introduces archetype-layer signal
   to the stop rule without resurrecting softmax.

Both are calibration work to be done after the scorer is restored, not as
part of the rollback itself.

## Verdict

1. **Scorer change is 86% of the observed drop.** Selector change is 14%.
2. **Phase-3 selector saves ~12 Q / run at a 5.8 pp accuracy cost** against
   the best-case old scorer. Net trade-off in the UX direction.
3. **Phase-3 stop rule is firing at min-Q for 44% of runs with a 49% win
   rate** at that bucket — the early termination is not calibrated against
   archetype-layer resolution. Stage-4 tuning target.
4. **Preserve selector + stop rule in ADR-003 rollback.** Reverting would
   cost ~500 LOC of coverage-inflation code, re-introduce hollow-touch
   overcounting, and produce 1.7 pp headline improvement in exchange — not
   worth it.

Rollback applies to the scorer layer only. The selector/stop-rule is
documented as Stage-4 calibration territory in the updated roadmap.

## Artifacts

- `results/phase3/diagnostic-artifacts/analyze-selector-stoprule.py` —
  stratified Q-bucket analysis.
- `results/phase3/diagnostic-artifacts/diagnostic-1-results.json` — the
  joint variant comparison (A=new WTA, B=old scorer, both against the
  Phase-3 selector's final states).
