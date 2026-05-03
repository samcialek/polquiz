# Q3 routed in `selectTopKDrillQuestion` — validation report

**Date:** 2026-05-02 (Terminal-3 autonomous block)
**HEAD at validation:** `6d46e8a`
**Patch:** `src/engine/topKDrill.ts` — preferred clean-CD-probe override
inside `selectTopKDrillQuestion`. When CD is in `needsDrill` and Q3 is
available with a meaningful CD position touch, return Q3 ahead of the
default multi-hit/quality sort. Scope strictly CD/Q3.
**Status:** all gates pass. Code patch retained for commit.

## What the patch does

Before the existing multi-hit candidate sort (which would pick Q82 over
Q3 because Q82 hits CD AND CU while Q3 hits CD only), check:
1. `needsDrillSet.has("CD")` — CD is among the top-K nodes still
   needing position drill.
2. `available.find(q => q.id === 3)` — Q3 is in the eligible pool
   (already pre-filtered by api.ts to exclude answered + ineligible).
3. Q3 has a meaningful CD position touch (`weight ≥
   MEANINGFUL_POSITION_WEIGHT`).

If all three hold, return Q3. Otherwise fall through to the standard
multi-hit sort.

Comments mark this as "Cultural direction coverage" / "clean CD position
probe" — no retired model prose.

## Targeted validation (D1/D2/D3 dump-replay)

| Dump | Q3 slot before | Q3 slot after | Q82 slot before | Q82 slot after | Final match before | Final match after | Target rank before | Target rank after |
|---|---|---|---|---|---|---|---|---|
| **D1** (target 088) | NOT ASKED | **#16** (synthesized) | NOT ASKED | NOT ASKED | 090 d=0.384 | 090 d=0.384 | −1 | −1 |
| **D2** (target 056) | NOT ASKED | NOT ASKED | #18 (recorded) | #18 (recorded) | 056 d=0.374 | 056 d=0.374 | 1 | 1 |
| **D3** (target 011) | NOT ASKED | **#16** (synthesized) | #16 (recorded) | #18 (recorded) | 011 d=0.387 | 011 d=0.386 | 1 | 1 |

Q3 fires in D1 and D3 (where CD is in top-K). Correctly does NOT fire
in D2 — D2's CD salience is 1.60 (below the top-K threshold), so CD
isn't among the nodes needing drill. Q82 still fires in D2 (its
recorded slot) and D3 (now at #18 instead of #16, because Q3 and Q213
fire ahead of it).

Q82's evidence map is unchanged.

### Per-node estimate deltas

| Dump | Node | Baseline | Patched | Δ | Sam's target direction | Pass? |
|---|---|---|---|---|---|---|
| D1 | CD | 4.38 | **4.46** | +0.08 | ↑ (Sam wanted > 4.5) | ✅ closer |
| D1 | CU | 1.40 | 1.40 | 0 | not get materially worse | ✅ unchanged |
| D1 | MOR | 1.40 | 1.40 | 0 | (no spec) | — |
| D2 | CD | 2.87 | 2.87 | 0 | ↓ (Sam wanted < 3) | ✅ not further wrong |
| D2 | CU | 3.23 | 3.23 | 0 | (no spec) | — |
| D3 | CD | 1.64 | **1.53** | −0.11 | ↓ (Sam wanted < 1.5) | ✅ closer |
| D3 | CU | 4.27 | 4.27 | 0 | ↑ (Sam wanted > 4.5) | unchanged (no regression) |

### Question-count deltas

| Dump | Baseline Q | Patched Q | Δ |
|---|---|---|---|
| D1 | 28 | 29 | +1 |
| D2 | 33 | 33 | 0 |
| D3 | 31 | 32 | +1 |

Average +0.67 Q per dump (within Sam's "+1 envelope" gate).

## Targeted gates

| Gate | Result |
|---|---|
| D3 must remain 011 top-1 | ✅ rank 1, d 0.387 → 0.386 |
| D2 must remain 056 top-1 | ✅ rank 1, d 0.374 unchanged |
| D1 must not get worse than baseline; ideally CD moves closer to Sam's target | ✅ CD 4.38 → 4.46 (closer to 4.5+) |
| Q3 must actually fire in at least one relevant dump | ✅ fires in D1 and D3 |

All targeted gates pass.

## Broader validation (persona-replay, 121 archetypes)

| Metric | Baseline | Patched | Δ |
|---|---|---|---|
| Top-1 | 66 / 121 (54.5%) | 66 / 121 (54.5%) | 0pp |
| Top-3 | 85 / 121 (70.2%) | 85 / 121 (70.2%) | 0pp |
| Avg Q answered | 28.55 | 28.55 | 0.00 |

Aggregate metrics unchanged. The override fires only when CD is in
top-K — for centroid-based personas with high salience across all
nodes, this is most personas, but Q3 firing earlier just shifts the
order without changing the final classification (the centroids already
have plenty of CD/CU signal regardless of which probe order delivers
it).

## Acceptance gates

| Gate | Threshold | Result |
|---|---|---|
| Top-1 ≤ −2pp regression | ≥ 52.5% | ✅ 54.5% |
| Top-3 ≤ −2pp regression | ≥ 68.2% | ✅ 70.2% |
| Avg Q ≤ +1.0 increase | ≤ 29.55 | ✅ 28.55 |
| D2 remains top-1 | rank 1 | ✅ |
| D3 remains top-1 | rank 1 | ✅ |

## Terminology check

- Code comments: "Cultural direction coverage", "clean CD position
  probe". No retired model prose.
- Doc prose: no "partisan fusion", "tribalism", "engagement
  activation".
- Legacy code identifiers (`CD` as a node ID; `Q82`, `Q93` as legacy
  question references) appear only as implementation labels.

## Files staged for commit

- `src/engine/topKDrill.ts` (the patch)
- `results/eig-selector/q3-experiment-baseline-notes.md`
- `results/eig-selector/q3-selectorEIG-noop-finding.md`
- `results/eig-selector/q3-topk-drill-validation-report.md` (this file)

NOT staged: dist/, output/, browser/, question configs, selectorEIG.
