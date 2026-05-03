# CCES 2016 Loader Smoke — Summary

**Run at:** 2026-05-03T13:13:51.327Z
**Source file:** `data/cces2016/CCES16_Common_OUTPUT_Feb2018_VV.tab` (128.5 MB)
**Year:** 2016
**Duration:** 1.69s

## Invariant checks

| # | Check | Pass | Detail |
|---|---|:--:|---|
| 1 | Loader produces > 0 rows from CCES 2016 | ✓ | rowsLoaded=64600, rowsSkipped=0 |
| 2 | All weights are finite and > 0 | ✓ | min=0.0001 max=15.0003 |
| 3 | Non-voters retained (not silently dropped) | ✓ | nonvoter=118, voted=49497, unknown=14985 |
| 4 | Validated-turnout count > 0 | ✓ | validatedTurnoutCount=35829 |
| 5 | Voter rows have voteChoiceObserved in {D,R,Other,Unknown} | ✓ | all voter rows have a non-Abstain choice |
| 6 | Non-voter rows have voteChoiceObserved == 'Abstain' | ✓ | all non-voter rows are 'Abstain' |
| 7 | D and R counts both > 0 (resolver code map sane) | ✓ | D=18755, R=22136, Other=3959, Abstain=118, Unknown=19632 |

**Overall: ✓ ALL PASS** (7/7)

## Loader stats

- Rows loaded: **64,600**
- Rows skipped (missing/invalid weight or ID): **0**
- Weight range: 0.0001 → 15.0003
- Sum of weights: 64317.21

## Turnout classification (raw row counts)

| Class | Count | Share of loaded |
|---|---:|---:|
| Voted (turnoutObserved=true) | 49,497 | 76.62% |
| Non-voter (turnoutObserved=false) | 118 | 0.18% |
| Unknown (turnoutObserved=null) | 14,985 | 23.20% |
| Validated turnout (CL_E2016GVM populated) | 35,829 | 55.46% |

## Vote-choice classification (raw row counts)

| Choice | Count | Share of loaded |
|---|---:|---:|
| D | 18,755 | 29.03% |
| R | 22,136 | 34.27% |
| Other | 3,959 | 6.13% |
| Abstain | 118 | 0.18% |
| Unknown | 19,632 | 30.39% |

## Weighted shares

_For diagnostic context only — these are NOT predicted vote shares; they are the survey's observed weighted distribution._

| Choice | Weighted total | Share of total weight | Share of voter+unknown weight |
|---|---:|---:|---:|
| D | 20462.26 | 31.81% | 31.85% |
| R | 21571.81 | 33.54% | 33.58% |
| Other | 2597.82 | 4.04% | 4.04% |
| Abstain | 72.53 | 0.11% | — |
| Unknown | 19612.79 | 30.49% | 30.53% |

**Note**: voter+unknown denominator excludes Abstain rows. The voter-conditional D-share above is comparable in spirit to the FEC D-share-of-total-presidential-votes once the predicted-vote layer is wired.

## What this smoke verifies

- The loader can read the CCES 2016 file end-to-end and produce typed respondent records.
- Weights are sane (finite, positive).
- Non-voters are retained (essential for abstention-share predictions in mode B).
- Validated-turnout signal flows through (mode A oracle path's gold-standard input).
- Vote-choice resolver maps codes correctly (D and R both populated).

## What this smoke does NOT do

- Does not run the survey-to-PRISM mapper.
- Does not produce predicted vote shares.
- Does not compare against benchmark FEC totals.
- Does not produce mode A or mode B output.

Those are downstream of the loader and require the mapper + engine integration to be wired.
