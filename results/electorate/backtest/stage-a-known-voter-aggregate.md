# Stage A — Known-Voter Aggregate (Phase 2.5)

**Run at:** 2026-05-03T17:52:58.963Z
**Benchmark source:** `results/electorate/backtest/benchmarks-2008-2024.json` (schema v0.3)
**Years targeted:** 2008, 2012, 2016, 2020, 2024
**Plan reference:** `results/electorate/backtest/turnout-abstention-calibration-plan.md` §2 Q4 + Q5

## What this is, and is not

**Is**: the harness + baseline contract for Stage A. Restricts each year's CES/CCES sample to known voters (`voteChoiceObserved ∈ {D, R, Other}`), computes weighted observed D/R/Other shares, and compares to FEC's D/R/Other shares of total presidential vote.

**Is not**: a PRISM mapper-backed prediction. There is no signature, no scorer, no vote-formula in this run. The "predictions" are the *observed* survey shares — i.e., the **baseline that the future mapper-backed predictions must beat or match**. When the mapper ships (Phase 2.6+), the harness contract stays the same; only the source of vote choice changes from `voteChoiceObserved` to `mapperImpliedVote`.

**Stage B (abstention calibration) is NOT exercised here** — that is a separate harness scheduled for Phase 2.7.

## Acceptance bands (per plan §2 Q4)

| Label | max abs gap (pp) |
|---|---:|
| `ready_for_stage_b` | ≤ 2 |
| `good` | ≤ 3 |
| `baseline_pass` | ≤ 5 |
| `fail` | > 5 |

## Cross-year roll-up

| Year | n total | n known | Survey D | Bench D | D gap | Survey R | Bench R | R gap | Survey Other | Bench Other | Other gap | max abs gap | Label |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| 2008 | 32,800 | 19,114 | 52.13% | 52.93% | -0.80pp | 46.21% | 45.65% | +0.56pp | 1.66% | 1.42% | +0.24pp | +0.80pp | `ready_for_stage_b` |
| 2012 | 54,535 | 39,220 | 51.43% | 51.06% | +0.37pp | 46.81% | 47.20% | -0.39pp | 1.76% | 1.73% | +0.03pp | +0.39pp | `ready_for_stage_b` |
| 2016 | 64,600 | 44,850 | 45.85% | 48.18% | -2.33pp | 48.33% | 46.09% | +2.24pp | 5.82% | 5.73% | +0.09pp | +2.33pp | `good` |
| 2020 | 61,000 | 45,448 | 51.75% | 51.31% | +0.44pp | 45.98% | 46.86% | -0.88pp | 2.27% | 1.83% | +0.44pp | +0.88pp | `ready_for_stage_b` |
| 2024 | 60,000 | 42,978 | 48.25% | 48.32% | -0.07pp | 50.57% | 49.80% | +0.77pp | 1.18% | 1.88% | -0.69pp | +0.77pp | `ready_for_stage_b` |

## Label distribution

- `ready_for_stage_b`: 4 year(s)
- `good`: 1 year(s)
- `baseline_pass`: 0 year(s)
- `fail`: 0 year(s)

## Per-year detail

### 2008

- Source file: `data/cces2008/cces_2008_common.tab`
- Duration: 0.8s
- Sample: **19,114** known-voter respondents (of 32,800 total)
- Known-voter denominator (weight): 17177.46
- Excluded weight: Abstain=12501, Unknown=3121, total=15623

**Survey known-voter shares**: D=52.13%, R=46.21%, Other=1.66%

**Benchmark (FEC) known-voter shares**: D=52.93%, R=45.65%, Other=1.42%

**Gaps (survey − benchmark, pp)**:
- D: signed -0.80pp (abs 0.80)
- R: signed +0.56pp (abs 0.56)
- Other: signed +0.24pp (abs 0.24)
- max abs gap: **+0.80pp** → label `ready_for_stage_b`
- abs-gap-sum (D+R+Other): 1.60pp

| # | Check | Pass | Detail |
|---|---|:--:|---|
| 1 | 2008: Stage A result produced (sample loaded) | ✓ | n_total=32,800 n_known_voter=19,114 |
| 2 | 2008: known-voter denominator > 0 | ✓ | D+R+Other weight = 17177.46 |
| 3 | 2008: survey known-voter D/R/Other shares sum to 1 | ✓ | sum=1.000000000000 diff=1.11e-16 |
| 4 | 2008: benchmark D/R/Other shares loaded and sum to 1 (within FEC rounding) | ✓ | D=52.93% R=45.65% Other=1.42% sum=100.00% |
| 5 | 2008: acceptance label present and valid | ✓ | acceptance_label=ready_for_stage_b (max_abs_gap=+0.80pp) |
| 6 | 2008: no Stage B / abstention calibration fields present in this Stage A result | ✓ | result keys = [year, n_respondents_total, n_respondents_known_voter, excluded_weight, known_voter_denominator, survey_known_voter_shares, benchmark_known_voter_shares, gaps_pp, max_abs_gap_pp, abs_gap_sum_pp, acceptance_label, prediction_source]; forbidden keys checked = [alpha_year, p_abstain, predicted_abstain_count, stage_b_result] |
| 7 | 2008: Unknown excluded from Stage A denom and counted separately (Abstain too) | ✓ | unknown_weight=3121.30 abstain_weight=12501.24 (both excluded from D+R+Other denom) |

**Year 2008 overall: ✓ ALL PASS** (7/7)

### 2012

- Source file: `data/cces2012/CCES12_Common_VV.tab`
- Duration: 1.8s
- Sample: **39,220** known-voter respondents (of 54,535 total)
- Known-voter denominator (weight): 38345.27
- Excluded weight: Abstain=51, Unknown=14474, total=14524

**Survey known-voter shares**: D=51.43%, R=46.81%, Other=1.76%

**Benchmark (FEC) known-voter shares**: D=51.06%, R=47.20%, Other=1.73%

**Gaps (survey − benchmark, pp)**:
- D: signed +0.37pp (abs 0.37)
- R: signed -0.39pp (abs 0.39)
- Other: signed +0.03pp (abs 0.03)
- max abs gap: **+0.39pp** → label `ready_for_stage_b`
- abs-gap-sum (D+R+Other): 0.79pp

| # | Check | Pass | Detail |
|---|---|:--:|---|
| 1 | 2012: Stage A result produced (sample loaded) | ✓ | n_total=54,535 n_known_voter=39,220 |
| 2 | 2012: known-voter denominator > 0 | ✓ | D+R+Other weight = 38345.27 |
| 3 | 2012: survey known-voter D/R/Other shares sum to 1 | ✓ | sum=1.000000000000 diff=1.11e-16 |
| 4 | 2012: benchmark D/R/Other shares loaded and sum to 1 (within FEC rounding) | ✓ | D=51.06% R=47.20% Other=1.73% sum=99.99% |
| 5 | 2012: acceptance label present and valid | ✓ | acceptance_label=ready_for_stage_b (max_abs_gap=+0.39pp) |
| 6 | 2012: no Stage B / abstention calibration fields present in this Stage A result | ✓ | result keys = [year, n_respondents_total, n_respondents_known_voter, excluded_weight, known_voter_denominator, survey_known_voter_shares, benchmark_known_voter_shares, gaps_pp, max_abs_gap_pp, abs_gap_sum_pp, acceptance_label, prediction_source]; forbidden keys checked = [alpha_year, p_abstain, predicted_abstain_count, stage_b_result] |
| 7 | 2012: Unknown excluded from Stage A denom and counted separately (Abstain too) | ✓ | unknown_weight=14473.70 abstain_weight=50.71 (both excluded from D+R+Other denom) |

**Year 2012 overall: ✓ ALL PASS** (7/7)

### 2016

- Source file: `data/cces2016/CCES16_Common_OUTPUT_Feb2018_VV.tab`
- Duration: 2.3s
- Sample: **44,850** known-voter respondents (of 64,600 total)
- Known-voter denominator (weight): 44631.89
- Excluded weight: Abstain=73, Unknown=19613, total=19685

**Survey known-voter shares**: D=45.85%, R=48.33%, Other=5.82%

**Benchmark (FEC) known-voter shares**: D=48.18%, R=46.09%, Other=5.73%

**Gaps (survey − benchmark, pp)**:
- D: signed -2.33pp (abs 2.33)
- R: signed +2.24pp (abs 2.24)
- Other: signed +0.09pp (abs 0.09)
- max abs gap: **+2.33pp** → label `good`
- abs-gap-sum (D+R+Other): 4.67pp

| # | Check | Pass | Detail |
|---|---|:--:|---|
| 1 | 2016: Stage A result produced (sample loaded) | ✓ | n_total=64,600 n_known_voter=44,850 |
| 2 | 2016: known-voter denominator > 0 | ✓ | D+R+Other weight = 44631.89 |
| 3 | 2016: survey known-voter D/R/Other shares sum to 1 | ✓ | sum=1.000000000000 diff=0.00e+0 |
| 4 | 2016: benchmark D/R/Other shares loaded and sum to 1 (within FEC rounding) | ✓ | D=48.18% R=46.09% Other=5.73% sum=100.00% |
| 5 | 2016: acceptance label present and valid | ✓ | acceptance_label=good (max_abs_gap=+2.33pp) |
| 6 | 2016: no Stage B / abstention calibration fields present in this Stage A result | ✓ | result keys = [year, n_respondents_total, n_respondents_known_voter, excluded_weight, known_voter_denominator, survey_known_voter_shares, benchmark_known_voter_shares, gaps_pp, max_abs_gap_pp, abs_gap_sum_pp, acceptance_label, prediction_source]; forbidden keys checked = [alpha_year, p_abstain, predicted_abstain_count, stage_b_result] |
| 7 | 2016: Unknown excluded from Stage A denom and counted separately (Abstain too) | ✓ | unknown_weight=19612.79 abstain_weight=72.53 (both excluded from D+R+Other denom) |

**Year 2016 overall: ✓ ALL PASS** (7/7)

### 2020

- Source file: `data/cces2020/CES20_Common_OUTPUT_vv.csv`
- Duration: 5.2s
- Sample: **45,448** known-voter respondents (of 61,000 total)
- Known-voter denominator (weight): 45129.75
- Excluded weight: Abstain=129, Unknown=22784, total=22913

**Survey known-voter shares**: D=51.75%, R=45.98%, Other=2.27%

**Benchmark (FEC) known-voter shares**: D=51.31%, R=46.86%, Other=1.83%

**Gaps (survey − benchmark, pp)**:
- D: signed +0.44pp (abs 0.44)
- R: signed -0.88pp (abs 0.88)
- Other: signed +0.44pp (abs 0.44)
- max abs gap: **+0.88pp** → label `ready_for_stage_b`
- abs-gap-sum (D+R+Other): 1.76pp

| # | Check | Pass | Detail |
|---|---|:--:|---|
| 1 | 2020: Stage A result produced (sample loaded) | ✓ | n_total=61,000 n_known_voter=45,448 |
| 2 | 2020: known-voter denominator > 0 | ✓ | D+R+Other weight = 45129.75 |
| 3 | 2020: survey known-voter D/R/Other shares sum to 1 | ✓ | sum=1.000000000000 diff=0.00e+0 |
| 4 | 2020: benchmark D/R/Other shares loaded and sum to 1 (within FEC rounding) | ✓ | D=51.31% R=46.86% Other=1.83% sum=100.00% |
| 5 | 2020: acceptance label present and valid | ✓ | acceptance_label=ready_for_stage_b (max_abs_gap=+0.88pp) |
| 6 | 2020: no Stage B / abstention calibration fields present in this Stage A result | ✓ | result keys = [year, n_respondents_total, n_respondents_known_voter, excluded_weight, known_voter_denominator, survey_known_voter_shares, benchmark_known_voter_shares, gaps_pp, max_abs_gap_pp, abs_gap_sum_pp, acceptance_label, prediction_source]; forbidden keys checked = [alpha_year, p_abstain, predicted_abstain_count, stage_b_result] |
| 7 | 2020: Unknown excluded from Stage A denom and counted separately (Abstain too) | ✓ | unknown_weight=22784.19 abstain_weight=128.93 (both excluded from D+R+Other denom) |

**Year 2020 overall: ✓ ALL PASS** (7/7)

### 2024

- Source file: `data/cces2024/CCES24_Common_OUTPUT_vv_topost_final.csv`
- Duration: 4.7s
- Sample: **42,978** known-voter respondents (of 60,000 total)
- Known-voter denominator (weight): 46207.85
- Excluded weight: Abstain=352, Unknown=19041, total=19393

**Survey known-voter shares**: D=48.25%, R=50.57%, Other=1.18%

**Benchmark (FEC) known-voter shares**: D=48.32%, R=49.80%, Other=1.88%

**Gaps (survey − benchmark, pp)**:
- D: signed -0.07pp (abs 0.07)
- R: signed +0.77pp (abs 0.77)
- Other: signed -0.69pp (abs 0.69)
- max abs gap: **+0.77pp** → label `ready_for_stage_b`
- abs-gap-sum (D+R+Other): 1.54pp

| # | Check | Pass | Detail |
|---|---|:--:|---|
| 1 | 2024: Stage A result produced (sample loaded) | ✓ | n_total=60,000 n_known_voter=42,978 |
| 2 | 2024: known-voter denominator > 0 | ✓ | D+R+Other weight = 46207.85 |
| 3 | 2024: survey known-voter D/R/Other shares sum to 1 | ✓ | sum=1.000000000000 diff=0.00e+0 |
| 4 | 2024: benchmark D/R/Other shares loaded and sum to 1 (within FEC rounding) | ✓ | D=48.32% R=49.80% Other=1.88% sum=100.00% |
| 5 | 2024: acceptance label present and valid | ✓ | acceptance_label=ready_for_stage_b (max_abs_gap=+0.77pp) |
| 6 | 2024: no Stage B / abstention calibration fields present in this Stage A result | ✓ | result keys = [year, n_respondents_total, n_respondents_known_voter, excluded_weight, known_voter_denominator, survey_known_voter_shares, benchmark_known_voter_shares, gaps_pp, max_abs_gap_pp, abs_gap_sum_pp, acceptance_label, prediction_source]; forbidden keys checked = [alpha_year, p_abstain, predicted_abstain_count, stage_b_result] |
| 7 | 2024: Unknown excluded from Stage A denom and counted separately (Abstain too) | ✓ | unknown_weight=19040.59 abstain_weight=352.13 (both excluded from D+R+Other denom) |

**Year 2024 overall: ✓ ALL PASS** (7/7)

## Aggregate invariant

- ✓ 0. All 5 years present (file loaded for each) — years_present=[2008,2012,2016,2020,2024], years_skipped=[]

## What this baseline means for the future mapper

Per the calibration plan §2 Q4, Stage A is the **first runnable mapper-backed target**. The numbers in this report are the **observed-baseline floor** — they are what the future mapper-backed predictions must produce *automatically* to be judged competent.

- A mapper that produces D/R/Other gaps within the same per-year acceptance bands as the observed baseline is "no worse than the survey itself" — i.e., the mapper has not introduced systematic bias on top of the survey signal.
- A mapper that produces gaps **wider** than this baseline is doing actively bad work; investigate per the mapper-revision protocol (`survey-to-prism-v0.md` §4).
- A mapper that produces **tighter** gaps than this baseline (e.g., correcting "shy Trump" effects through structural inference) is doing useful work — but that's a v1 question, not a v0 acceptance criterion.

## Aggregate

- Total invariant checks (incl. aggregate): **36/36**
- Years with file present: 5
- Years skipped (file not present): (none)
