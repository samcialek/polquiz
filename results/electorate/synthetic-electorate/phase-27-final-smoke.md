# Phase 2.7 Final Pipeline Smoke

**Run at:** 2026-05-04T22:45:34.568Z
**Cycle:** 2016
**CCES file:** `data/cces2016/CCES16_Common_OUTPUT_Feb2018_VV.tab` (rowLimit=5000)
**PUMS fixture:** 15 hand-authored rows (loaded via real `ipumsPumsUniverseFileLoader`)
**Bridge config:** numDraws=5, randomSeed=20260504

## Pipeline

```
PUMS fixture file ──▶ ipumsPumsUniverseFileLoader ──▶ VepUniverseRow[]  (Stage 1)
CCES 2016 microdata ─▶ cesBacktestLoader ─▶ surveyToPrismMapper ──▶ SurveyPrismSignature[]  (Stage 2)
                                          ─▶ donor demographic bucketing ──▶ BridgeDonorSignature[]  (Stage 3)
                                          ─▶ runSignatureImputationBridge ──▶ SyntheticElectorateRow[]  (Stage 4)
                                          ─▶ runSyntheticElectorateAggregate ──▶ coverage report  (Stage 5)
```

## Stage results

| # | Stage | Pass | Detail | Duration |
|---|---|:--:|---|---:|
| 1 | 1. PUMS fixture file loader → VepUniverseRow[] | ✓ | rowsRead=15 rowsEmitted=15 rowsSkipped=0 rowsValid=15 rowsInvalid=0 weightedTotal=2260.0 weightedVepEligible=2140.0 | 3ms |
| 2 | 2. CCES loader + mapper → SurveyPrismSignature[] | ✓ | respondents=5000 signatures=5000 mean_real_signal_targets=10.91/20 | 283ms |
| 3 | 3. Donor demographic bucketing → BridgeDonorSignature[] | ✓ | donors_with_full_demographics=5000 of 5000 | 246ms |
| 4 | 4. Bridge (hot-deck imputation) → SyntheticElectorateRow[] | ✓ | rows=75 expected=75 unmatched=0 mean_donor_pool=83.5 mean_ess=41.7 validation_failures=0 | 17ms |
| 5 | 5. Aggregate → coverage report | ✓ | total_rows=75 year_keys=[2016] row_count_2016=75 | 8ms |

**Overall: ✓ ALL PASS** (5/5 stages)

## 2016 aggregate (from PUMS-derived universe)

- Rows: 75; total weight: 11300
- Engagement: mean 7.907, sd 2.068
- Moral-boundary intensity mean: 1.756

### Position-node marginals (mean, sd, mean_salience)

| Node | Mean | SD | Mean salience |
|---|---:|---:|---:|
| MAT | 2.848 | 1.219 | 1.640 |
| CD | 2.916 | 1.299 | 1.757 |
| CU | 3.293 | 1.207 | 1.698 |
| MOR | 3.000 | 0.000 | 1.000 |
| PRO | 3.000 | 0.000 | 1.000 |
| COM | 3.000 | 0.000 | 1.000 |
| ZS | 3.067 | 0.512 | 1.306 |
| ONT_H | 3.000 | 0.000 | 1.000 |
| ONT_S | 3.000 | 0.000 | 1.000 |

### Moral-boundary mean salience

| Boundary | Mean salience |
|---|---:|
| national | 1.136 |
| ethnic_racial | 1.000 |
| religious | 1.221 |
| class | 0.978 |
| ideological | 1.288 |
| gender | 1.000 |
| political_camp | 1.764 |

## What this verifies

- Real `ipumsPumsUniverseFileLoader` reads a PUMS-format fixture and emits valid `VepUniverseRow` objects.
- The full mapper-and-bridge stack consumes those rows together with real CCES microdata to produce contract-valid `SyntheticElectorateRow` instances.
- The aggregator runs end-to-end on the bridge output and produces structured per-year marginals + boundary salience values.

## What this does NOT do

- Loads no real ACS / PUMS data file. The 15 PUMS rows are hand-authored.
- Does not produce vote predictions, candidate distances, or abstention calibration outputs.
- Does not duplicate the vote-choice scrub spy (already covered by `signatureImputationBridgeSmoke`).
