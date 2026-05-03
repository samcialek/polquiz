# Signature Imputation Bridge v1 — Smoke (Phase 2.7.5)

**Run at:** 2026-05-03T22:50:27.799Z
**Mock universe version:** `v0.1-mock`
**Bridge options:** numDraws=5, randomSeed=20260503, sampleRowLimitPerYear=5000

> **MOCK CONTRACT-TEST CELLS — not real population data; do not aggregate or interpret demographically.**

## What this verifies

Promotes the v0 mock-bridge into v1 weighted hot-deck imputation per `signature-imputation-bridge-plan.md`. The smoke loads CCES/CES respondents per year, maps each to a PRISM signature, wraps with bucketed demographics, then runs `runSignatureImputationBridge` against the year's mock universe with a fixed seed. Verifies contract validation, the 8-step backoff machinery, donor-traceability provenance, the **vote-choice scrubbing spy**, and the forbidden-keys structural check.

**Not in scope**: real PUMS universe, vote prediction, abstention calibration, candidate distance, scorer.

## Cross-year roll-up

| Year | Donors loaded | Donors w/ full demo | Universe cells | Output rows | Mean donor pool | Mean ESS | Spy byte-identical |
|---|---:|---:|---:|---:|---:|---:|:--:|
| 2008 | 5000 | 5000 | 7 | 35 | 52.0 | 45.7 | ✓ |
| 2012 | 5000 | 5000 | 7 | 35 | 338.7 | 197.7 | ✓ |
| 2016 | 5000 | 5000 | 7 | 35 | 55.6 | 31.7 | ✓ |
| 2020 | 5000 | 5000 | 7 | 35 | 53.9 | 31.8 | ✓ |
| 2024 | 5000 | 5000 | 7 | 35 | 116.0 | 40.9 | ✓ |

## Backoff distribution per year (rows landed at step k)

| Year | s1 | s2 | s3 | s4 | s5 | s6 | s7 | s8 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| 2008 | 0 | 0 | 15 | 5 | 0 | 0 | 15 | 0 |
| 2012 | 0 | 0 | 0 | 15 | 0 | 5 | 15 | 0 |
| 2016 | 0 | 0 | 5 | 15 | 0 | 5 | 10 | 0 |
| 2020 | 0 | 0 | 20 | 0 | 0 | 0 | 15 | 0 |
| 2024 | 0 | 0 | 5 | 5 | 5 | 10 | 10 | 0 |

## Uncertainty distribution per year (rows)

| Year | low | medium | high |
|---|---:|---:|---:|
| 2008 | 0 | 20 | 15 |
| 2012 | 0 | 15 | 20 |
| 2016 | 0 | 15 | 20 |
| 2020 | 0 | 15 | 20 |
| 2024 | 0 | 10 | 25 |

## Per-year invariants

### 2008

- Mock universe rows: 7; output rows: 35
- Mean donor pool size: 52.0; mean ESS: 45.7
- Vote-choice scrubbing spy byte-identical: **yes**
- Per-row validation errors: 0
- Example provenance note (row 0): `hot-deck-step-7; cellKey=s7|2008|hispanic|female; donorPoolSize=80; effectiveSampleSize=71.29; donorWeightTotal=87.49; selectedDonorId=R6895468; uncertainty=high; donorWeightSource=raw; backoffPath=[step1: 0 donors at cellKey | step2: pool=2 weight=1.65 below thresholds | step3: pool=4 weight=3.19 below thresholds | step4: pool=10 weight=9.60 below thresholds | step5: pool=8 weight=6.49 below thresholds | step6: pool=17 weight=15.38 below thresholds]`

| # | Check | Pass | Detail |
|---|---|:--:|---|
| 1 | 2008: outputRows = inputUniverseRows × numDraws (no unmatched) | ✓ | outputRows=35 expected=35 unmatchable=0 |
| 2 | 2008: every row validates per validateSyntheticElectorateRow | ✓ | 0 row errors |
| 3 | 2008: every row has signatureSource = "imputed_from_cell" | ✓ | all rows tagged imputed_from_cell |
| 4 | 2008: populationSource = "survey_weighted" everywhere (mock universe) | ✓ | populationSource samples: [survey_weighted] |
| 5 | 2008: vote-choice scrubbing spy — bridge output byte-identical when donor voteChoiceObserved scrubbed | ✓ | byte-identical (vote choice not in matching/sampling/output path) |
| 6 | 2008: no forbidden vote-prediction / abstention-calibration keys present | ✓ | forbidden keys checked = [predictedVote, candidateDistance, voteProbability, abstainProbability, alpha_year, predictedAbstainCount, stageBResult]; none present |
| 7 | 2008: every row carries selectedDonorId provenance | ✓ | all rows reference a donor respondentId |
| 8 | 2008: perStepShare sums to 1 and uncertainty distribution accounts for all rows | ✓ | perStepShare sum=1.000000 uncertainty sum=35 outputRows=35 |
| 9 | 2008: donor pool has bucketed donors (≥ 100) | ✓ | donorCount=5000 |

**Year 2008 overall: ✓ ALL PASS**

### 2012

- Mock universe rows: 7; output rows: 35
- Mean donor pool size: 338.7; mean ESS: 197.7
- Vote-choice scrubbing spy byte-identical: **yes**
- Per-row validation errors: 0
- Example provenance note (row 0): `hot-deck-step-7; cellKey=s7|2012|asian|female; donorPoolSize=31; effectiveSampleSize=19.80; donorWeightTotal=27.14; selectedDonorId=R161776734; uncertainty=high; donorWeightSource=raw; backoffPath=[step1: 0 donors at cellKey | step2: 0 donors at cellKey | step3: 0 donors at cellKey | step4: pool=2 weight=3.99 below thresholds | step5: 0 donors at cellKey | step6: pool=2 weight=3.99 below thresholds]`

| # | Check | Pass | Detail |
|---|---|:--:|---|
| 1 | 2012: outputRows = inputUniverseRows × numDraws (no unmatched) | ✓ | outputRows=35 expected=35 unmatchable=0 |
| 2 | 2012: every row validates per validateSyntheticElectorateRow | ✓ | 0 row errors |
| 3 | 2012: every row has signatureSource = "imputed_from_cell" | ✓ | all rows tagged imputed_from_cell |
| 4 | 2012: populationSource = "survey_weighted" everywhere (mock universe) | ✓ | populationSource samples: [survey_weighted] |
| 5 | 2012: vote-choice scrubbing spy — bridge output byte-identical when donor voteChoiceObserved scrubbed | ✓ | byte-identical (vote choice not in matching/sampling/output path) |
| 6 | 2012: no forbidden vote-prediction / abstention-calibration keys present | ✓ | forbidden keys checked = [predictedVote, candidateDistance, voteProbability, abstainProbability, alpha_year, predictedAbstainCount, stageBResult]; none present |
| 7 | 2012: every row carries selectedDonorId provenance | ✓ | all rows reference a donor respondentId |
| 8 | 2012: perStepShare sums to 1 and uncertainty distribution accounts for all rows | ✓ | perStepShare sum=1.000000 uncertainty sum=35 outputRows=35 |
| 9 | 2012: donor pool has bucketed donors (≥ 100) | ✓ | donorCount=5000 |

**Year 2012 overall: ✓ ALL PASS**

### 2016

- Mock universe rows: 7; output rows: 35
- Mean donor pool size: 55.6; mean ESS: 31.7
- Vote-choice scrubbing spy byte-identical: **yes**
- Per-row validation errors: 0
- Example provenance note (row 0): `hot-deck-step-7; cellKey=s7|2016|hispanic|male; donorPoolSize=72; effectiveSampleSize=27.97; donorWeightTotal=59.49; selectedDonorId=R301041731; uncertainty=high; donorWeightSource=raw; backoffPath=[step1: 0 donors at cellKey | step2: 0 donors at cellKey | step3: 0 donors at cellKey | step4: 0 donors at cellKey | step5: pool=1 weight=2.06 below thresholds | step6: pool=1 weight=2.06 below thresholds]`

| # | Check | Pass | Detail |
|---|---|:--:|---|
| 1 | 2016: outputRows = inputUniverseRows × numDraws (no unmatched) | ✓ | outputRows=35 expected=35 unmatchable=0 |
| 2 | 2016: every row validates per validateSyntheticElectorateRow | ✓ | 0 row errors |
| 3 | 2016: every row has signatureSource = "imputed_from_cell" | ✓ | all rows tagged imputed_from_cell |
| 4 | 2016: populationSource = "survey_weighted" everywhere (mock universe) | ✓ | populationSource samples: [survey_weighted] |
| 5 | 2016: vote-choice scrubbing spy — bridge output byte-identical when donor voteChoiceObserved scrubbed | ✓ | byte-identical (vote choice not in matching/sampling/output path) |
| 6 | 2016: no forbidden vote-prediction / abstention-calibration keys present | ✓ | forbidden keys checked = [predictedVote, candidateDistance, voteProbability, abstainProbability, alpha_year, predictedAbstainCount, stageBResult]; none present |
| 7 | 2016: every row carries selectedDonorId provenance | ✓ | all rows reference a donor respondentId |
| 8 | 2016: perStepShare sums to 1 and uncertainty distribution accounts for all rows | ✓ | perStepShare sum=1.000000 uncertainty sum=35 outputRows=35 |
| 9 | 2016: donor pool has bucketed donors (≥ 100) | ✓ | donorCount=5000 |

**Year 2016 overall: ✓ ALL PASS**

### 2020

- Mock universe rows: 7; output rows: 35
- Mean donor pool size: 53.9; mean ESS: 31.8
- Vote-choice scrubbing spy byte-identical: **yes**
- Per-row validation errors: 0
- Example provenance note (row 0): `hot-deck-step-3; cellKey=s3|2020|West|white|female|55-64|bachelor; donorPoolSize=28; effectiveSampleSize=24.15; donorWeightTotal=23.47; selectedDonorId=R1234958571; uncertainty=medium; donorWeightSource=raw; backoffPath=[step1: 0 donors at cellKey | step2: pool=10 weight=8.10 below thresholds]`

| # | Check | Pass | Detail |
|---|---|:--:|---|
| 1 | 2020: outputRows = inputUniverseRows × numDraws (no unmatched) | ✓ | outputRows=35 expected=35 unmatchable=0 |
| 2 | 2020: every row validates per validateSyntheticElectorateRow | ✓ | 0 row errors |
| 3 | 2020: every row has signatureSource = "imputed_from_cell" | ✓ | all rows tagged imputed_from_cell |
| 4 | 2020: populationSource = "survey_weighted" everywhere (mock universe) | ✓ | populationSource samples: [survey_weighted] |
| 5 | 2020: vote-choice scrubbing spy — bridge output byte-identical when donor voteChoiceObserved scrubbed | ✓ | byte-identical (vote choice not in matching/sampling/output path) |
| 6 | 2020: no forbidden vote-prediction / abstention-calibration keys present | ✓ | forbidden keys checked = [predictedVote, candidateDistance, voteProbability, abstainProbability, alpha_year, predictedAbstainCount, stageBResult]; none present |
| 7 | 2020: every row carries selectedDonorId provenance | ✓ | all rows reference a donor respondentId |
| 8 | 2020: perStepShare sums to 1 and uncertainty distribution accounts for all rows | ✓ | perStepShare sum=1.000000 uncertainty sum=35 outputRows=35 |
| 9 | 2020: donor pool has bucketed donors (≥ 100) | ✓ | donorCount=5000 |

**Year 2020 overall: ✓ ALL PASS**

### 2024

- Mock universe rows: 7; output rows: 35
- Mean donor pool size: 116.0; mean ESS: 40.9
- Vote-choice scrubbing spy byte-identical: **yes**
- Per-row validation errors: 0
- Example provenance note (row 0): `hot-deck-step-6; cellKey=s6|2024|hispanic|male|35-44; donorPoolSize=28; effectiveSampleSize=10.47; donorWeightTotal=41.01; selectedDonorId=R1860962060; uncertainty=high; donorWeightSource=raw; backoffPath=[step1: 0 donors at cellKey | step2: pool=1 weight=1.82 below thresholds | step3: pool=5 weight=12.40 below thresholds | step4: pool=11 weight=24.19 below thresholds | step5: pool=7 weight=15.72 below thresholds]`

| # | Check | Pass | Detail |
|---|---|:--:|---|
| 1 | 2024: outputRows = inputUniverseRows × numDraws (no unmatched) | ✓ | outputRows=35 expected=35 unmatchable=0 |
| 2 | 2024: every row validates per validateSyntheticElectorateRow | ✓ | 0 row errors |
| 3 | 2024: every row has signatureSource = "imputed_from_cell" | ✓ | all rows tagged imputed_from_cell |
| 4 | 2024: populationSource = "survey_weighted" everywhere (mock universe) | ✓ | populationSource samples: [survey_weighted] |
| 5 | 2024: vote-choice scrubbing spy — bridge output byte-identical when donor voteChoiceObserved scrubbed | ✓ | byte-identical (vote choice not in matching/sampling/output path) |
| 6 | 2024: no forbidden vote-prediction / abstention-calibration keys present | ✓ | forbidden keys checked = [predictedVote, candidateDistance, voteProbability, abstainProbability, alpha_year, predictedAbstainCount, stageBResult]; none present |
| 7 | 2024: every row carries selectedDonorId provenance | ✓ | all rows reference a donor respondentId |
| 8 | 2024: perStepShare sums to 1 and uncertainty distribution accounts for all rows | ✓ | perStepShare sum=1.000000 uncertainty sum=35 outputRows=35 |
| 9 | 2024: donor pool has bucketed donors (≥ 100) | ✓ | donorCount=5000 |

**Year 2024 overall: ✓ ALL PASS**

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

## Aggregate

- Total invariant checks (incl. aggregate): **46/46**
- Years with file present: 5
- Years skipped: (none)
- Total contract-valid rows built: **175**
