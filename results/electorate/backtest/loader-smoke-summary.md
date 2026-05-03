# CES Loader Smoke — Multi-Year Summary

**Run at:** 2026-05-03T14:19:24.540Z
**Years targeted:** 2008, 2012, 2016, 2020, 2024

## Per-year invariant checks

### 2008

- Source file: `data/cces2008/cces_2008_common.tab` (57.2 MB)
- Duration: 0.7s
- Rows loaded: **32,800** (skipped 0)
- Weight range: 0.2989 → 6.4919
- Turnout: voted=22,235, non-voter=10,565, unknown=0, validated=32,800
- Vote choice: D=9,087, R=9,727, Other=300, Abstain=10,565, Unknown=3,121

| # | Check | Pass | Detail |
|---|---|:--:|---|
| 1 | Loader produces > 0 rows from CES 2008 | ✓ | rowsLoaded=32800, rowsSkipped=0 |
| 2 | All weights are finite and > 0 | ✓ | min=0.2989 max=6.4919 |
| 3 | Non-voters retained (not silently dropped) | ✓ | nonvoter=10565, voted=22235, unknown=0 |
| 4 | Validated-turnout count > 0 | ✓ | validatedTurnoutCount=32800 |
| 5 | Voter rows have voteChoiceObserved in {D,R,Other,Unknown} | ✓ | all voter rows have a non-Abstain choice |
| 6 | Non-voter rows have voteChoiceObserved == 'Abstain' | ✓ | all non-voter rows are 'Abstain' |
| 7 | D and R counts both > 0 (resolver code map sane) | ✓ | D=9087, R=9727, Other=300, Abstain=10565, Unknown=3121 |

**Year 2008 overall: ✓ ALL PASS** (7/7)

**Voter-conditional share (voter+unknown denominator)**: D=44.11%, R=39.11%, Other=1.41%, Unknown=15.38%

### 2012

- Source file: `data/cces2012/CCES12_Common_VV.tab` (111.2 MB)
- Duration: 1.7s
- Rows loaded: **54,535** (skipped 0)
- Weight range: 0.0000 → 15.0023
- Turnout: voted=39,220, non-voter=196, unknown=15,119, validated=0
- Vote choice: D=19,048, R=18,741, Other=1,431, Abstain=196, Unknown=15,119

| # | Check | Pass | Detail |
|---|---|:--:|---|
| 1 | Loader produces > 0 rows from CES 2012 | ✓ | rowsLoaded=54535, rowsSkipped=0 |
| 2 | All weights are finite and > 0 | ✓ | min=0.0000 max=15.0023 |
| 3 | Non-voters retained (not silently dropped) | ✓ | nonvoter=196, voted=39220, unknown=15119 |
| 4 | Validated-turnout column not present in this release (n/a, treated as pass) | ✓ | expectsValidatedTurnout=false; validatedTurnoutCount=0 |
| 5 | Voter rows have voteChoiceObserved in {D,R,Other,Unknown} | ✓ | all voter rows have a non-Abstain choice |
| 6 | Non-voter rows have voteChoiceObserved == 'Abstain' | ✓ | all non-voter rows are 'Abstain' |
| 7 | D and R counts both > 0 (resolver code map sane) | ✓ | D=19048, R=18741, Other=1431, Abstain=196, Unknown=15119 |

**Year 2012 overall: ✓ ALL PASS** (7/7)

**Voter-conditional share (voter+unknown denominator)**: D=37.34%, R=33.98%, Other=1.28%, Unknown=27.40%

### 2016

- Source file: `data/cces2016/CCES16_Common_OUTPUT_Feb2018_VV.tab` (128.5 MB)
- Duration: 2.2s
- Rows loaded: **64,600** (skipped 0)
- Weight range: 0.0001 → 15.0003
- Turnout: voted=49,497, non-voter=118, unknown=14,985, validated=35,829
- Vote choice: D=18,755, R=22,136, Other=3,959, Abstain=118, Unknown=19,632

| # | Check | Pass | Detail |
|---|---|:--:|---|
| 1 | Loader produces > 0 rows from CES 2016 | ✓ | rowsLoaded=64600, rowsSkipped=0 |
| 2 | All weights are finite and > 0 | ✓ | min=0.0001 max=15.0003 |
| 3 | Non-voters retained (not silently dropped) | ✓ | nonvoter=118, voted=49497, unknown=14985 |
| 4 | Validated-turnout count > 0 | ✓ | validatedTurnoutCount=35829 |
| 5 | Voter rows have voteChoiceObserved in {D,R,Other,Unknown} | ✓ | all voter rows have a non-Abstain choice |
| 6 | Non-voter rows have voteChoiceObserved == 'Abstain' | ✓ | all non-voter rows are 'Abstain' |
| 7 | D and R counts both > 0 (resolver code map sane) | ✓ | D=18755, R=22136, Other=3959, Abstain=118, Unknown=19632 |

**Year 2016 overall: ✓ ALL PASS** (7/7)

**Voter-conditional share (voter+unknown denominator)**: D=31.85%, R=33.58%, Other=4.04%, Unknown=30.53%

### 2020

- Source file: `data/cces2020/CES20_Common_OUTPUT_vv.csv` (179.6 MB)
- Duration: 4.3s
- Rows loaded: **61,000** (skipped 0)
- Weight range: 0.0001 → 16.3113
- Turnout: voted=48,789, non-voter=75, unknown=12,136, validated=39,198
- Vote choice: D=26,188, R=17,702, Other=1,558, Abstain=75, Unknown=15,477

| # | Check | Pass | Detail |
|---|---|:--:|---|
| 1 | Loader produces > 0 rows from CES 2020 | ✓ | rowsLoaded=61000, rowsSkipped=0 |
| 2 | All weights are finite and > 0 | ✓ | min=0.0001 max=16.3113 |
| 3 | Non-voters retained (not silently dropped) | ✓ | nonvoter=75, voted=48789, unknown=12136 |
| 4 | Validated-turnout count > 0 | ✓ | validatedTurnoutCount=39198 |
| 5 | Voter rows have voteChoiceObserved in {D,R,Other,Unknown} | ✓ | all voter rows have a non-Abstain choice |
| 6 | Non-voter rows have voteChoiceObserved == 'Abstain' | ✓ | all non-voter rows are 'Abstain' |
| 7 | D and R counts both > 0 (resolver code map sane) | ✓ | D=26188, R=17702, Other=1558, Abstain=75, Unknown=15477 |

**Year 2020 overall: ✓ ALL PASS** (7/7)

**Voter-conditional share (voter+unknown denominator)**: D=34.39%, R=30.55%, Other=1.51%, Unknown=33.55%

### 2024

- Source file: `data/cces2024/CCES24_Common_OUTPUT_vv_topost_final.csv` (175.2 MB)
- Duration: 4.6s
- Rows loaded: **60,000** (skipped 0)
- Weight range: 0.0001 → 15.1776
- Turnout: voted=42,978, non-voter=574, unknown=16,448, validated=0
- Vote choice: D=23,527, R=18,501, Other=950, Abstain=574, Unknown=16,448

| # | Check | Pass | Detail |
|---|---|:--:|---|
| 1 | Loader produces > 0 rows from CES 2024 | ✓ | rowsLoaded=60000, rowsSkipped=0 |
| 2 | All weights are finite and > 0 | ✓ | min=0.0001 max=15.1776 |
| 3 | Non-voters retained (not silently dropped) | ✓ | nonvoter=574, voted=42978, unknown=16448 |
| 4 | Validated-turnout column not present in this release (n/a, treated as pass) | ✓ | expectsValidatedTurnout=false; validatedTurnoutCount=0 |
| 5 | Voter rows have voteChoiceObserved in {D,R,Other,Unknown} | ✓ | all voter rows have a non-Abstain choice |
| 6 | Non-voter rows have voteChoiceObserved == 'Abstain' | ✓ | all non-voter rows are 'Abstain' |
| 7 | D and R counts both > 0 (resolver code map sane) | ✓ | D=23527, R=18501, Other=950, Abstain=574, Unknown=16448 |

**Year 2024 overall: ✓ ALL PASS** (7/7)

**Voter-conditional share (voter+unknown denominator)**: D=34.17%, R=35.81%, Other=0.84%, Unknown=29.18%

## Aggregate

- Total checks across all years: **35/35**
- Years with file present (loaded): 5
- Years skipped (file not present): (none)

## What this smoke verifies / does NOT do

- ✓ Each loaded year reads end-to-end and produces typed respondent records
- ✓ Weights sane (finite, positive)
- ✓ Non-voters retained (essential for mode-B abstention prediction)
- ✓ Validated-turnout signal flows where the year's release includes it
- ✓ Vote-choice resolver code map sane (D and R both populated)
- ✗ Does NOT run the survey-to-PRISM mapper
- ✗ Does NOT produce predicted vote shares
- ✗ Does NOT compare against benchmark FEC totals
