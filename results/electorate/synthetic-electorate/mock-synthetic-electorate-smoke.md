# Mocked Synthetic-Electorate Bridge Smoke (Phase 2.7c)

**Run at:** 2026-05-03T21:02:29.203Z
**Mock universe version:** `v0.1-mock`
**Contract schema:** `v0.1`
**Sample row limit per year:** 500

> **MOCK CONTRACT-TEST CELLS — not real population data; do not aggregate or interpret demographically.**

## What this is, and is not

**Is**: a bridge harness proving the survey-mapper pipeline can produce rows conforming to `syntheticElectorateContract.ts`. Loads a small CCES/CES sample per year, maps each row to a PRISM signature via `surveyToPrismMapper`, then for each hand-authored mock VEP cell picks a same-year donor signature (deterministic round-robin) and emits a contract-valid `SyntheticElectorateRow` with `signatureSource = "imputed_from_cell"`.

**Is not**: the real VEP universe; a vote prediction; abstention calibration; a candidate-distance computation; or a claim that the mock cells aggregate to anything resembling true population totals. The real PUMS-driven loader is tracked separately in `vep-universe-loader-plan.md`.

## Cross-year roll-up

| Year | Source file present | Donors mapped (≤500) | Mock cells | Rows built | Rows validated | Total mock weight |
|---|:--:|---:|---:|---:|---:|---:|
| 2008 | yes | ≤500 | 7 | 7 | 7 | 9220 |
| 2012 | yes | ≤500 | 7 | 7 | 7 | 8520 |
| 2016 | yes | ≤500 | 7 | 7 | 7 | 8310 |
| 2020 | yes | ≤500 | 7 | 7 | 7 | 8840 |
| 2024 | yes | ≤500 | 7 | 7 | 7 | 8010 |

## Per-year invariants

### 2008

- Cells: 7; rows built: 7; rows validated: 7
- Total mock weight: 9220
- Per-row validation errors: 0

| # | Check | Pass | Detail |
|---|---|:--:|---|
| 1 | 2008: ≥ 5 rows produced | ✓ | rows=7 |
| 2 | 2008: every row validates per validateSyntheticElectorateRow | ✓ | 0 row errors |
| 3 | 2008: every row carries all 9 position + 2 categorical + 7 moral-boundary + engagement nodes | ✓ | position=9 categorical=2 boundaries=7 |
| 4 | 2008: every row has finite, positive cellWeight | ✓ | min=940 max=1880 |
| 5 | 2008: every row explicitly marked as mock / contract-test in coverage notes | ✓ | all rows carry mock-disclaimer note |
| 6 | 2008: total mock weight finite and positive | ✓ | total=9220 |
| 7 | 2008: no vote-prediction / abstention-calibration / candidate-distance / real-VEP-claim keys present | ✓ | forbidden keys checked = [predictedVote, candidateDistance, voteProbability, abstainProbability, alpha_year, predictedAbstainCount, stageBResult, vepUniverseClaim]; none present |
| 8 | 2008: populationSource is 'survey_weighted' (not acs_pums / ipums_pums) | ✓ | populationSource samples: [survey_weighted] |

**Year 2008 overall: ✓ ALL PASS** (8/8)

### 2012

- Cells: 7; rows built: 7; rows validated: 7
- Total mock weight: 8520
- Per-row validation errors: 0

| # | Check | Pass | Detail |
|---|---|:--:|---|
| 1 | 2012: ≥ 5 rows produced | ✓ | rows=7 |
| 2 | 2012: every row validates per validateSyntheticElectorateRow | ✓ | 0 row errors |
| 3 | 2012: every row carries all 9 position + 2 categorical + 7 moral-boundary + engagement nodes | ✓ | position=9 categorical=2 boundaries=7 |
| 4 | 2012: every row has finite, positive cellWeight | ✓ | min=870 max=1730 |
| 5 | 2012: every row explicitly marked as mock / contract-test in coverage notes | ✓ | all rows carry mock-disclaimer note |
| 6 | 2012: total mock weight finite and positive | ✓ | total=8520 |
| 7 | 2012: no vote-prediction / abstention-calibration / candidate-distance / real-VEP-claim keys present | ✓ | forbidden keys checked = [predictedVote, candidateDistance, voteProbability, abstainProbability, alpha_year, predictedAbstainCount, stageBResult, vepUniverseClaim]; none present |
| 8 | 2012: populationSource is 'survey_weighted' (not acs_pums / ipums_pums) | ✓ | populationSource samples: [survey_weighted] |

**Year 2012 overall: ✓ ALL PASS** (8/8)

### 2016

- Cells: 7; rows built: 7; rows validated: 7
- Total mock weight: 8310
- Per-row validation errors: 0

| # | Check | Pass | Detail |
|---|---|:--:|---|
| 1 | 2016: ≥ 5 rows produced | ✓ | rows=7 |
| 2 | 2016: every row validates per validateSyntheticElectorateRow | ✓ | 0 row errors |
| 3 | 2016: every row carries all 9 position + 2 categorical + 7 moral-boundary + engagement nodes | ✓ | position=9 categorical=2 boundaries=7 |
| 4 | 2016: every row has finite, positive cellWeight | ✓ | min=760 max=1520 |
| 5 | 2016: every row explicitly marked as mock / contract-test in coverage notes | ✓ | all rows carry mock-disclaimer note |
| 6 | 2016: total mock weight finite and positive | ✓ | total=8310 |
| 7 | 2016: no vote-prediction / abstention-calibration / candidate-distance / real-VEP-claim keys present | ✓ | forbidden keys checked = [predictedVote, candidateDistance, voteProbability, abstainProbability, alpha_year, predictedAbstainCount, stageBResult, vepUniverseClaim]; none present |
| 8 | 2016: populationSource is 'survey_weighted' (not acs_pums / ipums_pums) | ✓ | populationSource samples: [survey_weighted] |

**Year 2016 overall: ✓ ALL PASS** (8/8)

### 2020

- Cells: 7; rows built: 7; rows validated: 7
- Total mock weight: 8840
- Per-row validation errors: 0

| # | Check | Pass | Detail |
|---|---|:--:|---|
| 1 | 2020: ≥ 5 rows produced | ✓ | rows=7 |
| 2 | 2020: every row validates per validateSyntheticElectorateRow | ✓ | 0 row errors |
| 3 | 2020: every row carries all 9 position + 2 categorical + 7 moral-boundary + engagement nodes | ✓ | position=9 categorical=2 boundaries=7 |
| 4 | 2020: every row has finite, positive cellWeight | ✓ | min=880 max=1480 |
| 5 | 2020: every row explicitly marked as mock / contract-test in coverage notes | ✓ | all rows carry mock-disclaimer note |
| 6 | 2020: total mock weight finite and positive | ✓ | total=8840 |
| 7 | 2020: no vote-prediction / abstention-calibration / candidate-distance / real-VEP-claim keys present | ✓ | forbidden keys checked = [predictedVote, candidateDistance, voteProbability, abstainProbability, alpha_year, predictedAbstainCount, stageBResult, vepUniverseClaim]; none present |
| 8 | 2020: populationSource is 'survey_weighted' (not acs_pums / ipums_pums) | ✓ | populationSource samples: [survey_weighted] |

**Year 2020 overall: ✓ ALL PASS** (8/8)

### 2024

- Cells: 7; rows built: 7; rows validated: 7
- Total mock weight: 8010
- Per-row validation errors: 0

| # | Check | Pass | Detail |
|---|---|:--:|---|
| 1 | 2024: ≥ 5 rows produced | ✓ | rows=7 |
| 2 | 2024: every row validates per validateSyntheticElectorateRow | ✓ | 0 row errors |
| 3 | 2024: every row carries all 9 position + 2 categorical + 7 moral-boundary + engagement nodes | ✓ | position=9 categorical=2 boundaries=7 |
| 4 | 2024: every row has finite, positive cellWeight | ✓ | min=850 max=1500 |
| 5 | 2024: every row explicitly marked as mock / contract-test in coverage notes | ✓ | all rows carry mock-disclaimer note |
| 6 | 2024: total mock weight finite and positive | ✓ | total=8010 |
| 7 | 2024: no vote-prediction / abstention-calibration / candidate-distance / real-VEP-claim keys present | ✓ | forbidden keys checked = [predictedVote, candidateDistance, voteProbability, abstainProbability, alpha_year, predictedAbstainCount, stageBResult, vepUniverseClaim]; none present |
| 8 | 2024: populationSource is 'survey_weighted' (not acs_pums / ipums_pums) | ✓ | populationSource samples: [survey_weighted] |

**Year 2024 overall: ✓ ALL PASS** (8/8)

## Aggregate invariants

- ✓ 0. All 5 mock years represented (file loaded for each) — years_present=[2008,2012,2016,2020,2024], years_skipped=[]

## Forbidden keys (verified absent on every row)

- `predictedVote`
- `candidateDistance`
- `voteProbability`
- `abstainProbability`
- `alpha_year`
- `predictedAbstainCount`
- `stageBResult`
- `vepUniverseClaim`

## What the future PUMS loader replaces

When the real PUMS loader ships (per `vep-universe-loader-plan.md` v1+):

- The hand-authored cells in `mockVepUniverse.ts` are replaced by streamed PUMS rows with real `personWeight` × replicate weights.
- The deterministic round-robin donor picker is replaced by demographic-cell donor matching (likely a poststratification step or a small-cell IPF/raking helper).
- `populationSource` shifts from `"survey_weighted"` to `"acs_pums"` or `"ipums_pums"`.
- The mapper, the contract, and the validation surface stay unchanged. The bridge that gets renamed at that point is **only** the population-skeleton lane.

## Aggregate

- Total invariant checks (incl. aggregate): **41/41**
- Years with file present: 5
- Years skipped (file not present): (none)
- Total contract-valid rows built across all years: **35**
