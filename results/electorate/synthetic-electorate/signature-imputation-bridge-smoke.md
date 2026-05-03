# Signature Imputation Bridge v1 — Smoke (Phase 2.7.5)

**Run at:** 2026-05-03T22:46:05.608Z
**Mock universe version:** `v0.1-mock`
**Bridge options:** numDraws=5, randomSeed=20260503, sampleRowLimitPerYear=5000

> **MOCK CONTRACT-TEST CELLS — not real population data; do not aggregate or interpret demographically.**

## What this verifies

Promotes the v0 mock-bridge into v1 weighted hot-deck imputation per `signature-imputation-bridge-plan.md`. The smoke loads CCES/CES respondents per year, maps each to a PRISM signature, wraps with bucketed demographics, then runs `runSignatureImputationBridge` against the year's mock universe with a fixed seed. Verifies contract validation, the 8-step backoff machinery, donor-traceability provenance, the **vote-choice scrubbing spy**, and the forbidden-keys structural check.

**Not in scope**: real PUMS universe, vote prediction, abstention calibration, candidate distance, scorer.

## Cross-year roll-up

| Year | Donors loaded | Donors w/ full demo | Universe cells | Output rows | Mean donor pool | Mean ESS | Spy byte-identical |
|---|---:|---:|---:|---:|---:|---:|:--:|
| 2008 | 5000 | 5000 | 7 | 35 | 50.6 | 41.8 | ✓ |
| 2012 | 5000 | 5000 | 7 | 35 | 49.1 | 29.1 | ✓ |
| 2016 | 5000 | 5000 | 7 | 35 | 38.9 | 20.3 | ✓ |
| 2020 | 5000 | 5000 | 7 | 35 | 71.4 | 45.0 | ✓ |
| 2024 | 5000 | 5000 | 7 | 35 | 93.0 | 34.4 | ✓ |

## Backoff distribution per year (rows landed at step k)

| Year | s1 | s2 | s3 | s4 | s5 | s6 | s7 | s8 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| 2008 | 0 | 0 | 20 | 0 | 0 | 5 | 10 | 0 |
| 2012 | 0 | 0 | 15 | 0 | 0 | 10 | 10 | 0 |
| 2016 | 0 | 0 | 20 | 5 | 0 | 5 | 5 | 0 |
| 2020 | 0 | 0 | 20 | 0 | 0 | 0 | 15 | 0 |
| 2024 | 0 | 0 | 10 | 10 | 0 | 5 | 10 | 0 |

## Uncertainty distribution per year (rows)

| Year | low | medium | high |
|---|---:|---:|---:|
| 2008 | 0 | 20 | 15 |
| 2012 | 0 | 10 | 25 |
| 2016 | 0 | 15 | 20 |
| 2020 | 0 | 20 | 15 |
| 2024 | 0 | 10 | 25 |

## Per-year invariants

### 2008

- Mock universe rows: 7; output rows: 35
- Mean donor pool size: 50.6; mean ESS: 41.8
- Vote-choice scrubbing spy byte-identical: **yes**
- Per-row validation errors: 0
- Example provenance note (row 0): `hot-deck-step-6; cellKey=s6|2008|hispanic|female|30-44; donorPoolSize=29; effectiveSampleSize=25.22; donorWeightTotal=30.98; selectedDonorId=R6895468; uncertainty=high; donorWeightSource=raw; backoffPath=[step1: 0 donors at cellKey | step2: pool=4 weight=3.67 below thresholds | step3: pool=6 weight=5.21 below thresholds | step4: pool=16 weight=17.77 below thresholds | step5: pool=12 weight=10.53 below thresholds]`

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
- Mean donor pool size: 49.1; mean ESS: 29.1
- Vote-choice scrubbing spy byte-identical: **yes**
- Per-row validation errors: 0
- Example provenance note (row 0): `hot-deck-step-7; cellKey=s7|2012|asian|female; donorPoolSize=31; effectiveSampleSize=19.80; donorWeightTotal=27.14; selectedDonorId=R161776734; uncertainty=high; donorWeightSource=raw; backoffPath=[step1: pool=1 weight=1.39 below thresholds | step2: pool=2 weight=4.16 below thresholds | step3: pool=3 weight=4.45 below thresholds | step4: pool=5 weight=8.44 below thresholds | step5: pool=5 weight=7.00 below thresholds | step6: pool=7 weight=10.99 below thresholds]`

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
- Mean donor pool size: 38.9; mean ESS: 20.3
- Vote-choice scrubbing spy byte-identical: **yes**
- Per-row validation errors: 0
- Example provenance note (row 0): `hot-deck-step-7; cellKey=s7|2016|hispanic|male; donorPoolSize=72; effectiveSampleSize=27.97; donorWeightTotal=59.49; selectedDonorId=R301041731; uncertainty=high; donorWeightSource=raw; backoffPath=[step1: pool=1 weight=4.59 below thresholds | step2: pool=1 weight=4.59 below thresholds | step3: pool=1 weight=4.59 below thresholds | step4: pool=1 weight=4.59 below thresholds | step5: pool=4 weight=12.14 below thresholds | step6: pool=5 weight=12.33 below thresholds]`

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
- Mean donor pool size: 71.4; mean ESS: 45.0
- Vote-choice scrubbing spy byte-identical: **yes**
- Per-row validation errors: 0
- Example provenance note (row 0): `hot-deck-step-3; cellKey=s3|2020|west|white|female|45-64|ba_plus; donorPoolSize=72; effectiveSampleSize=59.99; donorWeightTotal=62.97; selectedDonorId=R1231253673; uncertainty=medium; donorWeightSource=raw; backoffPath=[step1: 0 donors at cellKey | step2: pool=21 weight=15.93 below thresholds]`

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
- Mean donor pool size: 93.0; mean ESS: 34.4
- Vote-choice scrubbing spy byte-identical: **yes**
- Per-row validation errors: 0
- Example provenance note (row 0): `hot-deck-step-6; cellKey=s6|2024|hispanic|male|30-44; donorPoolSize=49; effectiveSampleSize=14.31; donorWeightTotal=96.76; selectedDonorId=R1863206610; uncertainty=high; donorWeightSource=raw; backoffPath=[step1: 0 donors at cellKey | step2: pool=1 weight=1.82 below thresholds | step3: pool=7 weight=16.54 below thresholds | step4: pool=18 weight=44.69 below thresholds | step5: pool=12 weight=21.18 below thresholds]`

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
