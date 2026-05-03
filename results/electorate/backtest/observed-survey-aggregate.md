# Observed Survey Aggregate — Multi-Year Sanity Check

**Run at:** 2026-05-03T15:29:55.730Z
**Benchmark source:** `results/electorate/backtest/benchmarks-2008-2024.json` (schema v0.3)
**Years targeted:** 2008, 2012, 2016, 2020, 2024

**Scope.** Read-only. Loads CCES/CES microdata, computes weighted observed vote-choice shares, compares to FEC + USEP/UF benchmarks. **No prediction, no scorer, no mapper, no tuning.** Unknown bucket is retained as its own share — never redistributed.

## Cross-year roll-up — share-of-VEP gaps (survey − benchmark, pp)

| Year | n | Survey D | Bench D | D gap | Survey R | Bench R | R gap | Survey Abstain | Bench Abstain | Abstain gap | Survey Unknown | abs(D)+abs(R)+abs(O)+abs(Abst) |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 2008 | 32,800 | 27.30% | 32.58% | -5.28pp | 24.20% | 28.10% | -3.90pp | 38.11% | 38.44% | -0.33pp | 9.52% | 9.52pp |
| 2012 | 54,535 | 37.30% | 29.63% | +7.67pp | 33.95% | 27.39% | +6.56pp | 0.10% | 41.97% | -41.87pp | 27.38% | 56.37pp |
| 2016 | 64,600 | 31.81% | 28.54% | +3.27pp | 33.54% | 27.29% | +6.25pp | 0.11% | 40.78% | -40.67pp | 30.49% | 50.84pp |
| 2020 | 61,000 | 34.32% | 33.57% | +0.75pp | 30.50% | 30.66% | -0.16pp | 0.19% | 34.57% | -34.38pp | 33.49% | 35.60pp |
| 2024 | 60,000 | 33.98% | 30.77% | +3.21pp | 35.62% | 31.71% | +3.91pp | 0.54% | 36.33% | -35.79pp | 29.03% | 43.28pp |

## Cross-year roll-up — known-voter conditional shares (survey vs FEC % of total)

Denominator for survey side is **D + R + Other weight** (excludes Unknown and Abstain). Benchmark side is FEC's published share of total presidential vote.

| Year | Survey D | FEC D | D gap | Survey R | FEC R | R gap | Survey Other | FEC Other | Other gap |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 2008 | 52.13% | 52.93% | -0.80pp | 46.21% | 45.65% | +0.56pp | 1.66% | 1.42% | +0.24pp |
| 2012 | 51.43% | 51.06% | +0.37pp | 46.81% | 47.20% | -0.39pp | 1.76% | 1.73% | +0.03pp |
| 2016 | 45.85% | 48.18% | -2.33pp | 48.33% | 46.09% | +2.24pp | 5.82% | 5.73% | +0.09pp |
| 2020 | 51.75% | 51.31% | +0.44pp | 45.98% | 46.86% | -0.88pp | 2.27% | 1.83% | +0.44pp |
| 2024 | 48.25% | 48.32% | -0.07pp | 50.57% | 49.80% | +0.77pp | 1.18% | 1.88% | -0.69pp |

## Per-year detail

### 2008

- Source file: `data/cces2008/cces_2008_common.tab`
- Duration: 0.8s
- Respondents loaded: **32,800**
- Total weight: 32800 (range 0.2989 → 6.4919)

**Weighted observed counts**: D=8954, R=7938, Other=285, Abstain=12501, Unknown=3121

**Survey-implied shares of total weight**: D=27.30%, R=24.20%, Other=0.87%, Abstain=38.11%, Unknown=9.52%

**Survey-implied turnout (D+R+Other)/total**: 52.37%; abstain 38.11%; unknown 9.52%

**Known-voter conditional (denom excludes Unknown + Abstain)**: D=52.13%, R=46.21%, Other=1.66%

**Benchmark (FEC + USEP/UF)**: VEP=213,313,508; D=69,498,516 (32.58% VEP); R=59,948,323 (28.10% VEP); Other=1,866,981 (0.88% VEP); Abstain=81,999,688 (38.44% VEP); turnout=61.56%

**Gaps vs benchmark (pp, survey − benchmark)**:
- D share of VEP: -5.28pp
- R share of VEP: -3.90pp
- Other share of VEP: -0.01pp
- Abstain share of VEP: -0.33pp
- Turnout share of VEP: -9.19pp
- abs-gap-sum (D+R+Other+Abstain): 9.52pp

**Known-voter conditional gaps (vs FEC % of total presidential vote)**:
- D: -0.80pp
- R: +0.56pp
- Other: +0.24pp
- abs-gap-sum: 1.60pp

**Unknown handling**: Unknown share retained explicitly; not redistributed across D/R/Other/Abstain.

| # | Check | Pass | Detail |
|---|---|:--:|---|
| 1 | 2008: respondents loaded | ✓ | n=32,800 |
| 2 | 2008: all weighted counts and total_weight finite | ✓ | D=8954 R=7938 Other=285 Abstain=12501 Unknown=3121 total=32800 |
| 3 | 2008: bucket weights sum to total_weight (no silent drops) | ✓ | bucketSum=32800.00 total=32800.00 diff=1.98e-9 |
| 4 | 2008: D, R, Other, Abstain all weighted > 0 | ✓ | D>0=true R>0=true Other>0=true Abstain>0=true (Unknown=3121) |
| 5 | 2008: official benchmark loaded with positive VEP and pres-vote totals | ✓ | vep=213,313,508 total_pres=131,313,820 |
| 6 | 2008: Unknown bucket retained explicitly | ✓ | unknown_share=9.52% note="Unknown share retained explicitly; not redistributed across D/R/Other/Abstain." |
| 7 | 2008: VEP-share gaps all finite | ✓ | D_gap=-5.28pp R_gap=-3.90pp O_gap=-0.01pp Abstain_gap=-0.33pp turnout_gap=-9.19pp |

**Year 2008 overall: ✓ ALL PASS** (7/7)

### 2012

- Source file: `data/cces2012/CCES12_Common_VV.tab`
- Duration: 1.7s
- Respondents loaded: **54,535**
- Total weight: 52870 (range 0.0000 → 15.0023)

**Weighted observed counts**: D=19722, R=17949, Other=674, Abstain=51, Unknown=14474

**Survey-implied shares of total weight**: D=37.30%, R=33.95%, Other=1.27%, Abstain=0.10%, Unknown=27.38%

**Survey-implied turnout (D+R+Other)/total**: 72.53%; abstain 0.10%; unknown 27.38%

**Known-voter conditional (denom excludes Unknown + Abstain)**: D=51.43%, R=46.81%, Other=1.76%

**Benchmark (FEC + USEP/UF)**: VEP=222,437,494; D=65,915,795 (29.63% VEP); R=60,933,504 (27.39% VEP); Other=2,236,111 (1.01% VEP); Abstain=93,352,084 (41.97% VEP); turnout=58.03%

**Gaps vs benchmark (pp, survey − benchmark)**:
- D share of VEP: +7.67pp
- R share of VEP: +6.56pp
- Other share of VEP: +0.26pp
- Abstain share of VEP: -41.87pp
- Turnout share of VEP: +14.50pp
- abs-gap-sum (D+R+Other+Abstain): 56.37pp

**Known-voter conditional gaps (vs FEC % of total presidential vote)**:
- D: +0.37pp
- R: -0.39pp
- Other: +0.03pp
- abs-gap-sum: 0.79pp

**Unknown handling**: Unknown share retained explicitly; not redistributed across D/R/Other/Abstain.

| # | Check | Pass | Detail |
|---|---|:--:|---|
| 1 | 2012: respondents loaded | ✓ | n=54,535 |
| 2 | 2012: all weighted counts and total_weight finite | ✓ | D=19722 R=17949 Other=674 Abstain=51 Unknown=14474 total=52870 |
| 3 | 2012: bucket weights sum to total_weight (no silent drops) | ✓ | bucketSum=52869.68 total=52869.68 diff=1.60e-10 |
| 4 | 2012: D, R, Other, Abstain all weighted > 0 | ✓ | D>0=true R>0=true Other>0=true Abstain>0=true (Unknown=14474) |
| 5 | 2012: official benchmark loaded with positive VEP and pres-vote totals | ✓ | vep=222,437,494 total_pres=129,085,410 |
| 6 | 2012: Unknown bucket retained explicitly | ✓ | unknown_share=27.38% note="Unknown share retained explicitly; not redistributed across D/R/Other/Abstain." |
| 7 | 2012: VEP-share gaps all finite | ✓ | D_gap=+7.67pp R_gap=+6.56pp O_gap=+0.26pp Abstain_gap=-41.87pp turnout_gap=+14.50pp |

**Year 2012 overall: ✓ ALL PASS** (7/7)

### 2016

- Source file: `data/cces2016/CCES16_Common_OUTPUT_Feb2018_VV.tab`
- Duration: 2.2s
- Respondents loaded: **64,600**
- Total weight: 64317 (range 0.0001 → 15.0003)

**Weighted observed counts**: D=20462, R=21572, Other=2598, Abstain=73, Unknown=19613

**Survey-implied shares of total weight**: D=31.81%, R=33.54%, Other=4.04%, Abstain=0.11%, Unknown=30.49%

**Survey-implied turnout (D+R+Other)/total**: 69.39%; abstain 0.11%; unknown 30.49%

**Known-voter conditional (denom excludes Unknown + Abstain)**: D=45.85%, R=48.33%, Other=5.82%

**Benchmark (FEC + USEP/UF)**: VEP=230,780,798; D=65,853,514 (28.54% VEP); R=62,984,828 (27.29% VEP); Other=7,830,934 (3.39% VEP); Abstain=94,111,522 (40.78% VEP); turnout=59.22%

**Gaps vs benchmark (pp, survey − benchmark)**:
- D share of VEP: +3.27pp
- R share of VEP: +6.25pp
- Other share of VEP: +0.65pp
- Abstain share of VEP: -40.67pp
- Turnout share of VEP: +10.17pp
- abs-gap-sum (D+R+Other+Abstain): 50.84pp

**Known-voter conditional gaps (vs FEC % of total presidential vote)**:
- D: -2.33pp
- R: +2.24pp
- Other: +0.09pp
- abs-gap-sum: 4.67pp

**Unknown handling**: Unknown share retained explicitly; not redistributed across D/R/Other/Abstain.

| # | Check | Pass | Detail |
|---|---|:--:|---|
| 1 | 2016: respondents loaded | ✓ | n=64,600 |
| 2 | 2016: all weighted counts and total_weight finite | ✓ | D=20462 R=21572 Other=2598 Abstain=73 Unknown=19613 total=64317 |
| 3 | 2016: bucket weights sum to total_weight (no silent drops) | ✓ | bucketSum=64317.21 total=64317.21 diff=6.55e-11 |
| 4 | 2016: D, R, Other, Abstain all weighted > 0 | ✓ | D>0=true R>0=true Other>0=true Abstain>0=true (Unknown=19613) |
| 5 | 2016: official benchmark loaded with positive VEP and pres-vote totals | ✓ | vep=230,780,798 total_pres=136,669,276 |
| 6 | 2016: Unknown bucket retained explicitly | ✓ | unknown_share=30.49% note="Unknown share retained explicitly; not redistributed across D/R/Other/Abstain." |
| 7 | 2016: VEP-share gaps all finite | ✓ | D_gap=+3.27pp R_gap=+6.25pp O_gap=+0.65pp Abstain_gap=-40.67pp turnout_gap=+10.17pp |

**Year 2016 overall: ✓ ALL PASS** (7/7)

### 2020

- Source file: `data/cces2020/CES20_Common_OUTPUT_vv.csv`
- Duration: 4.3s
- Respondents loaded: **61,000**
- Total weight: 68043 (range 0.0001 → 16.3113)

**Weighted observed counts**: D=23354, R=20750, Other=1025, Abstain=129, Unknown=22784

**Survey-implied shares of total weight**: D=34.32%, R=30.50%, Other=1.51%, Abstain=0.19%, Unknown=33.49%

**Survey-implied turnout (D+R+Other)/total**: 66.33%; abstain 0.19%; unknown 33.49%

**Known-voter conditional (denom excludes Unknown + Abstain)**: D=51.75%, R=45.98%, Other=2.27%

**Benchmark (FEC + USEP/UF)**: VEP=242,077,783; D=81,268,924 (33.57% VEP); R=74,216,154 (30.66% VEP); Other=2,898,325 (1.20% VEP); Abstain=83,694,380 (34.57% VEP); turnout=65.43%

**Gaps vs benchmark (pp, survey − benchmark)**:
- D share of VEP: +0.75pp
- R share of VEP: -0.16pp
- Other share of VEP: +0.31pp
- Abstain share of VEP: -34.38pp
- Turnout share of VEP: +0.90pp
- abs-gap-sum (D+R+Other+Abstain): 35.60pp

**Known-voter conditional gaps (vs FEC % of total presidential vote)**:
- D: +0.44pp
- R: -0.88pp
- Other: +0.44pp
- abs-gap-sum: 1.76pp

**Unknown handling**: Unknown share retained explicitly; not redistributed across D/R/Other/Abstain.

| # | Check | Pass | Detail |
|---|---|:--:|---|
| 1 | 2020: respondents loaded | ✓ | n=61,000 |
| 2 | 2020: all weighted counts and total_weight finite | ✓ | D=23354 R=20750 Other=1025 Abstain=129 Unknown=22784 total=68043 |
| 3 | 2020: bucket weights sum to total_weight (no silent drops) | ✓ | bucketSum=68042.88 total=68042.88 diff=2.04e-10 |
| 4 | 2020: D, R, Other, Abstain all weighted > 0 | ✓ | D>0=true R>0=true Other>0=true Abstain>0=true (Unknown=22784) |
| 5 | 2020: official benchmark loaded with positive VEP and pres-vote totals | ✓ | vep=242,077,783 total_pres=158,383,403 |
| 6 | 2020: Unknown bucket retained explicitly | ✓ | unknown_share=33.49% note="Unknown share retained explicitly; not redistributed across D/R/Other/Abstain." |
| 7 | 2020: VEP-share gaps all finite | ✓ | D_gap=+0.75pp R_gap=-0.16pp O_gap=+0.31pp Abstain_gap=-34.38pp turnout_gap=+0.90pp |

**Year 2020 overall: ✓ ALL PASS** (7/7)

### 2024

- Source file: `data/cces2024/CCES24_Common_OUTPUT_vv_topost_final.csv`
- Duration: 4.3s
- Respondents loaded: **60,000**
- Total weight: 65601 (range 0.0001 → 15.1776)

**Weighted observed counts**: D=22294, R=23366, Other=547, Abstain=352, Unknown=19041

**Survey-implied shares of total weight**: D=33.98%, R=35.62%, Other=0.83%, Abstain=0.54%, Unknown=29.03%

**Survey-implied turnout (D+R+Other)/total**: 70.44%; abstain 0.54%; unknown 29.03%

**Known-voter conditional (denom excludes Unknown + Abstain)**: D=48.25%, R=50.57%, Other=1.18%

**Benchmark (FEC + USEP/UF)**: VEP=243,803,423; D=75,017,613 (30.77% VEP); R=77,302,580 (31.71% VEP); Other=2,918,109 (1.20% VEP); Abstain=88,565,121 (36.33% VEP); turnout=63.67%

**Gaps vs benchmark (pp, survey − benchmark)**:
- D share of VEP: +3.21pp
- R share of VEP: +3.91pp
- Other share of VEP: -0.37pp
- Abstain share of VEP: -35.79pp
- Turnout share of VEP: +6.77pp
- abs-gap-sum (D+R+Other+Abstain): 43.28pp

**Known-voter conditional gaps (vs FEC % of total presidential vote)**:
- D: -0.07pp
- R: +0.77pp
- Other: -0.69pp
- abs-gap-sum: 1.54pp

**Unknown handling**: Unknown share retained explicitly; not redistributed across D/R/Other/Abstain.

| # | Check | Pass | Detail |
|---|---|:--:|---|
| 1 | 2024: respondents loaded | ✓ | n=60,000 |
| 2 | 2024: all weighted counts and total_weight finite | ✓ | D=22294 R=23366 Other=547 Abstain=352 Unknown=19041 total=65601 |
| 3 | 2024: bucket weights sum to total_weight (no silent drops) | ✓ | bucketSum=65600.57 total=65600.57 diff=1.75e-10 |
| 4 | 2024: D, R, Other, Abstain all weighted > 0 | ✓ | D>0=true R>0=true Other>0=true Abstain>0=true (Unknown=19041) |
| 5 | 2024: official benchmark loaded with positive VEP and pres-vote totals | ✓ | vep=243,803,423 total_pres=155,238,302 |
| 6 | 2024: Unknown bucket retained explicitly | ✓ | unknown_share=29.03% note="Unknown share retained explicitly; not redistributed across D/R/Other/Abstain." |
| 7 | 2024: VEP-share gaps all finite | ✓ | D_gap=+3.21pp R_gap=+3.91pp O_gap=-0.37pp Abstain_gap=-35.79pp turnout_gap=+6.77pp |

**Year 2024 overall: ✓ ALL PASS** (7/7)

## Aggregate

- Total invariant checks across all years: **35/35**
- Years with file present (loaded): 5
- Years skipped (file not present): (none)

## What this aggregate is, and is not

- ✓ Loads survey microdata via the existing loader; produces weighted observed shares
- ✓ Compares to official FEC + USEP/UF benchmark from `benchmarks-2008-2024.json`
- ✓ Retains the Unknown bucket as a first-class share (never redistributed)
- ✗ NOT a prediction — no model, no signature, no scorer, no mapper
- ✗ NOT a tuning loop — gaps are evidence (nonresponse, weight frame, self-report bias), not "errors to close"
- ✗ Does NOT modify benchmarks, candidate signatures, era-context, EIG/selector files, or browser/dist outputs
