# Phase A — Turnout Calibration Audit

Read-only diagnostic on CCES validated-turnout subset for 2008 / 2016 / 2020.
Tests four signals available to the model against actual turnout:
(1) mapper engagement value, (2) mapper engagement bucket, (3) `predictVote`
nearest-candidate distance, (4) demographics (age / education / race).
Plus the existing predict-vote confusion matrix vs validated turnout.

## CRITICAL DATA-AVAILABILITY CAVEAT

**Only CCES 2008 has clean turnout ground truth across the full sample.** The
`vote_gen08` column carries explicit voted/nonvoted codes for both voters AND
nonvoters; the loader treats both as `turnoutValidated=true`. 2008 turnout rate
on the validated subset matches FEC within ±0.5pp.

**CCES 2016 / 2020 use asymmetric encoding** — non-empty `CL_*GVM` means
"matched voter file as voter"; empty means "unmatched OR nonvoter" (the column
does not distinguish the two). Self-reported turnout in these cycles is
severely biased: of ~60k respondents, only ~75–118 self-report as nonvoters
(real-world rate is ~40%). Most nonvoters skip the post-wave survey entirely
and end up with `turnoutObserved=null`.

**Practical consequence:** all calibration curves (engagement → turnout,
distance → turnout, demographics → turnout) are derived from **2008 only**.
2016/2020 sections in this report show the engagement-distribution and the
predict-vote confusion matrix on the validated-voter subset, but the implied
99%+ turnout rate is a sample-encoding artefact, not a finding. Real-world
calibration of 2016/2020 abstention requires re-linking CCES to the voter
file at the row level (not in scope for this phase).

**Decision criterion:** if a signal's turnout-rate difference between top and
bottom buckets is < 5pp, it has no calibration value. If 5–15pp, weak signal.
If > 15pp, useful signal worth wiring into a turnout-prediction layer.

## 2008

**Validated-turnout subset:** 32,800 respondents.
**Weighted turnout rate (validated subset):** 61.9%.
**FEC actual turnout rate (% of VEP):** 61.6%.
**Predicted abstain rate (current model):** 0.0%.
**Actual abstain rate (validated):** 38.1%.

### Confusion matrix vs validated turnout

|   | Actually voted | Actually abstained |
|---|---:|---:|
| Predicted vote      | 61.9% (20.3k) | 38.1% (12.5k) |
| Predicted abstain   | 0.0% (0.0k) | 0.0% (0.0k) |

### Engagement bucket → turnout rate

| Bucket | n | weighted-N | Turnout rate |
| --- | --- | --- | --- |
| apolitical | 0 | 0 | 0.0% |
| casual | 10565 | 12501 | 0.0% |
| engaged | 22235 | 20299 | 100.0% |
| highly-engaged | 0 | 0 | 0.0% |

### Engagement value bands → turnout rate

| Band (engagement value) | n | Turnout rate |
| --- | --- | --- |
| [0, 2) | 0 | 0.0% |
| [2, 4) | 10565 | 0.0% |
| [4, 6) | 0 | 0.0% |
| [6, 8) | 22235 | 100.0% |
| [8, 10) | 0 | 0.0% |

### Nearest-candidate distance quintile → turnout rate

| Quintile | Distance range | n | Turnout rate |
| --- | --- | --- | --- |
| Q1 (closest) | [0.000, 1.012) | 0 | 0.0% |
| Q2 | [1.012, 1.012) | 0 | 0.0% |
| Q3 | [1.012, 1.012) | 0 | 0.0% |
| Q4 | [1.012, 1.012) | 0 | 0.0% |
| Q5 (farthest) | [1.012, ∞) | 32800 | 61.9% |

### Age → turnout rate

| Age | n | weighted-N | Turnout rate |
| --- | --- | --- | --- |
| 18-29 | 5761 | 8003 | 48.4% |
| 30-44 | 8278 | 8337 | 60.6% |
| 45-64 | 13264 | 11666 | 66.2% |
| 65+ | 5497 | 4794 | 76.0% |
| Unknown | 0 | 0 | 0.0% |

### Education → turnout rate

| Education | n | weighted-N | Turnout rate |
| --- | --- | --- | --- |
| HS or less | 12571 | 14715 | 53.5% |
| Some college | 10168 | 9995 | 66.5% |
| College | 6799 | 5303 | 71.2% |
| Post-grad | 3262 | 2787 | 72.0% |
| Unknown | 0 | 0 | 0.0% |

### Race / ethnicity → turnout rate

| Race | n | weighted-N | Turnout rate |
| --- | --- | --- | --- |
| White | 26971 | 24190 | 64.4% |
| Black | 2000 | 3877 | 59.3% |
| Hispanic | 2000 | 2872 | 50.0% |
| Asian | 446 | 513 | 38.4% |
| Other | 1383 | 1348 | 58.2% |
| Unknown | 0 | 0 | 0.0% |

### Mapper engagement source (real_signal vs fallback) → turnout rate

| Source | n | weighted-N | Turnout rate |
| --- | --- | --- | --- |
| real_signal | 32800 | 32800 | 61.9% |
| fallback | 0 | 0 | 0.0% |

### Mapper coverage (% of nodes with real_signal) → turnout rate

| Coverage | n | weighted-N | Turnout rate |
| --- | --- | --- | --- |
| 0-25% | 32800 | 32800 | 61.9% |
| 25-50% | 0 | 0 | 0.0% |
| 50-75% | 0 | 0 | 0.0% |
| 75-100% | 0 | 0 | 0.0% |

## 2016

**Validated-turnout subset:** 49,615 respondents.
**Weighted turnout rate (validated subset):** 99.9%.
**FEC actual turnout rate (% of VEP):** 60.2%.
**Predicted abstain rate (current model):** 1.1%.
**Actual abstain rate (validated):** 0.1%.

### Confusion matrix vs validated turnout

|   | Actually voted | Actually abstained |
|---|---:|---:|
| Predicted vote      | 98.8% (48.3k) | 0.1% (0.1k) |
| Predicted abstain   | 1.1% (0.5k) | 0.0% (0.0k) |

### Engagement bucket → turnout rate

| Bucket | n | weighted-N | Turnout rate |
| --- | --- | --- | --- |
| apolitical | 7 | 3 | 0.0% |
| casual | 2001 | 2165 | 98.6% |
| engaged | 10665 | 10160 | 99.6% |
| highly-engaged | 36942 | 36538 | 100.0% |

### Engagement value bands → turnout rate

| Band (engagement value) | n | Turnout rate |
| --- | --- | --- |
| [0, 2) | 7 | 0.0% |
| [2, 4) | 609 | 95.8% |
| [4, 6) | 3430 | 99.2% |
| [6, 8) | 8627 | 99.8% |
| [8, 10) | 36942 | 100.0% |

### Nearest-candidate distance quintile → turnout rate

| Quintile | Distance range | n | Turnout rate |
| --- | --- | --- | --- |
| Q1 (closest) | [0.000, 0.993) | 9733 | 99.9% |
| Q2 | [0.993, 1.067) | 10863 | 100.0% |
| Q3 | [1.067, 1.213) | 10314 | 99.8% |
| Q4 | [1.213, 1.366) | 9307 | 99.8% |
| Q5 (farthest) | [1.366, ∞) | 9398 | 99.8% |

### Age → turnout rate

| Age | n | weighted-N | Turnout rate |
| --- | --- | --- | --- |
| 18-29 | 6153 | 9982 | 99.7% |
| 30-44 | 11693 | 11849 | 99.9% |
| 45-64 | 20967 | 17631 | 99.9% |
| 65+ | 10802 | 9404 | 99.9% |
| Unknown | 0 | 0 | 0.0% |

### Education → turnout rate

| Education | n | weighted-N | Turnout rate |
| --- | --- | --- | --- |
| HS or less | 11962 | 18983 | 99.8% |
| Some college | 18023 | 16357 | 99.9% |
| College | 12251 | 8747 | 99.9% |
| Post-grad | 7379 | 4779 | 99.9% |
| Unknown | 0 | 0 | 0.0% |

### Race / ethnicity → turnout rate

| Race | n | weighted-N | Turnout rate |
| --- | --- | --- | --- |
| White | 36260 | 35133 | 99.9% |
| Black | 5349 | 6242 | 99.9% |
| Hispanic | 4911 | 4559 | 99.4% |
| Asian | 1298 | 1214 | 99.8% |
| Other | 1797 | 1718 | 99.6% |
| Unknown | 0 | 0 | 0.0% |

### Mapper engagement source (real_signal vs fallback) → turnout rate

| Source | n | weighted-N | Turnout rate |
| --- | --- | --- | --- |
| real_signal | 49615 | 48866 | 99.9% |
| fallback | 0 | 0 | 0.0% |

### Mapper coverage (% of nodes with real_signal) → turnout rate

| Coverage | n | weighted-N | Turnout rate |
| --- | --- | --- | --- |
| 0-25% | 3 | 4 | 100.0% |
| 25-50% | 49612 | 48862 | 99.9% |
| 50-75% | 0 | 0 | 0.0% |
| 75-100% | 0 | 0 | 0.0% |

## 2020

**Validated-turnout subset:** 48,864 respondents.
**Weighted turnout rate (validated subset):** 99.7%.
**FEC actual turnout rate (% of VEP):** 66.6%.
**Predicted abstain rate (current model):** 2.2%.
**Actual abstain rate (validated):** 0.3%.

### Confusion matrix vs validated turnout

|   | Actually voted | Actually abstained |
|---|---:|---:|
| Predicted vote      | 97.7% (47.3k) | 0.2% (0.1k) |
| Predicted abstain   | 2.1% (1.0k) | 0.1% (0.0k) |

### Engagement bucket → turnout rate

| Bucket | n | weighted-N | Turnout rate |
| --- | --- | --- | --- |
| apolitical | 9 | 6 | 0.0% |
| casual | 1973 | 2294 | 96.7% |
| engaged | 7848 | 9091 | 99.5% |
| highly-engaged | 39034 | 37056 | 100.0% |

### Engagement value bands → turnout rate

| Band (engagement value) | n | Turnout rate |
| --- | --- | --- |
| [0, 2) | 9 | 0.0% |
| [2, 4) | 472 | 88.4% |
| [4, 6) | 2859 | 99.4% |
| [6, 8) | 6490 | 99.6% |
| [8, 10) | 39034 | 100.0% |

### Nearest-candidate distance quintile → turnout rate

| Quintile | Distance range | n | Turnout rate |
| --- | --- | --- | --- |
| Q1 (closest) | [0.000, 1.168) | 11739 | 99.8% |
| Q2 | [1.168, 1.221) | 10770 | 99.7% |
| Q3 | [1.221, 1.311) | 9277 | 99.7% |
| Q4 | [1.311, 1.457) | 8687 | 99.7% |
| Q5 (farthest) | [1.457, ∞) | 8391 | 99.6% |

### Age → turnout rate

| Age | n | weighted-N | Turnout rate |
| --- | --- | --- | --- |
| 18-29 | 6381 | 9975 | 99.3% |
| 30-44 | 11548 | 11959 | 99.7% |
| 45-64 | 18706 | 15488 | 99.9% |
| 65+ | 12229 | 11025 | 99.9% |
| Unknown | 0 | 0 | 0.0% |

### Education → turnout rate

| Education | n | weighted-N | Turnout rate |
| --- | --- | --- | --- |
| HS or less | 12019 | 15129 | 99.7% |
| Some college | 16161 | 14669 | 99.8% |
| College | 12809 | 11918 | 99.7% |
| Post-grad | 7875 | 6731 | 99.8% |
| Unknown | 0 | 0 | 0.0% |

### Race / ethnicity → turnout rate

| Race | n | weighted-N | Turnout rate |
| --- | --- | --- | --- |
| White | 36203 | 33293 | 99.9% |
| Black | 4715 | 6098 | 99.8% |
| Hispanic | 4746 | 5875 | 99.3% |
| Asian | 1270 | 1874 | 99.7% |
| Other | 1930 | 1307 | 98.3% |
| Unknown | 0 | 0 | 0.0% |

### Mapper engagement source (real_signal vs fallback) → turnout rate

| Source | n | weighted-N | Turnout rate |
| --- | --- | --- | --- |
| real_signal | 48864 | 48447 | 99.7% |
| fallback | 0 | 0 | 0.0% |

### Mapper coverage (% of nodes with real_signal) → turnout rate

| Coverage | n | weighted-N | Turnout rate |
| --- | --- | --- | --- |
| 0-25% | 0 | 0 | 0.0% |
| 25-50% | 48864 | 48447 | 99.7% |
| 50-75% | 0 | 0 | 0.0% |
| 75-100% | 0 | 0 | 0.0% |
