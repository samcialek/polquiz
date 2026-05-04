# Survey-to-PRISM mapper v0 — smoke summary

**Run at:** 2026-05-04T22:40:27.755Z
**Years:** 2008, 2012, 2016, 2020, 2024
**Sample size per year:** up to 200 respondents

Each respondent's mapper output was verified against `validateSignature` (every distribution finite + normalized, salience values in [0, 3], engagement in [0, 10], provenance present per target). A scrubbing spy verified the mapper does NOT read `voteChoiceObserved` for any node.

## Per-year overview

| Year | Rows mapped | Validation errors | Mean real-signal coverage | voteChoice contract |
|---:|---:|---:|---:|:-:|
| 2008 | 200 | 0 | 5.0% | ✅ |
| 2012 | 200 | 0 | 29.3% | ✅ |
| 2016 | 200 | 0 | 54.5% | ✅ |
| 2020 | 200 | 0 | 64.6% | ✅ |
| 2024 | 200 | 0 | 59.6% | ✅ |

## Per-target real-signal coverage by year

Coverage = share of mapped respondents whose target came from a real survey column (vs. fallback prior).

| target | 2008 | 2012 | 2016 | 2020 | 2024 |
|---|---|---|---|---|---|
| MAT | 0.0% | 0.0% | 100.0% | 100.0% | 99.5% |
| CD | 0.0% | 0.0% | 100.0% | 100.0% | 100.0% |
| CU | 0.0% | 0.0% | 100.0% | 100.0% | 100.0% |
| MOR | 0.0% | 0.0% | 0.0% | 0.0% | 0.0% |
| PRO | 0.0% | 0.0% | 0.0% | 0.0% | 0.0% |
| COM | 0.0% | 0.0% | 0.0% | 0.0% | 0.0% |
| ZS | 0.0% | 0.0% | 98.5% | 100.0% | 100.0% |
| ONT_H | 0.0% | 0.0% | 0.0% | 0.0% | 0.0% |
| ONT_S | 0.0% | 0.0% | 0.0% | 0.0% | 0.0% |
| EPS | 0.0% | 0.0% | 0.0% | 0.0% | 0.0% |
| AES | 0.0% | 0.0% | 0.0% | 0.0% | 0.0% |
| mb.national | 0.0% | 0.0% | 100.0% | 100.0% | 100.0% |
| mb.ethnic_racial | 0.0% | 0.0% | 0.0% | 100.0% | 0.0% |
| mb.religious | 0.0% | 99.5% | 99.5% | 100.0% | 100.0% |
| mb.class | 0.0% | 100.0% | 100.0% | 100.0% | 100.0% |
| mb.ideological | 0.0% | 90.5% | 93.5% | 96.0% | 95.0% |
| mb.gender | 0.0% | 0.0% | 0.0% | 100.0% | 100.0% |
| mb.political_camp | 0.0% | 97.5% | 99.5% | 98.5% | 98.0% |
| engagement | 100.0% | 100.0% | 98.5% | 98.5% | 100.0% |

## Validation errors (first 20 per year)

_(none)_

## Sample signature (first respondent of first year with data)

Year: 2008, respondentId: 46, weight: 0.5526, voteChoiceObserved: D

Coverage: 1 real / 19 fallback (out of 20 targets)

Engagement: 6.50 (real_signal, vars=turnoutValidated)

Moral boundaries:
- national: salience=1.00 (fallback)
- ethnic_racial: salience=1.00 (fallback)
- religious: salience=1.00 (fallback)
- class: salience=1.00 (fallback)
- ideological: salience=1.00 (fallback)
- gender: salience=1.00 (fallback)
- political_camp: salience=1.00 (fallback)
- intensity: 1.00 (fallback)

## Terminology

Engagement is a 1D continuous scalar per ADR canon. Compound moral-circle terminology used throughout. Legacy code identifiers appear only as implementation labels.