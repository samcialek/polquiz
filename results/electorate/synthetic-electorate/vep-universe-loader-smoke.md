# VEP universe row scaffold smoke

**Run at:** 2026-05-03T22:43:07.895Z
**Years exercised:** 2008, 2012, 2016, 2020, 2024

Hand-authored fixture exercising the `VepUniverseRow` contract from `src/electorate/vepUniverseTypes.ts`. **No raw data downloaded.** No IPUMS / Census network calls. The fixture is six rows per backtest year, varied across state / race / sex / age / education / citizenship, including deliberate ineligible rows (non-citizen, under-voting-age) to exercise the `vepEligible=false` branch.

When the (planned) PUMS-fed loader lands, the per-year smoke output will have the same shape with real population marginals.

## Per-year overview

| Year | Rows | Valid | Eligible rows | Σ personWeight | Σ vepEligible weight | Eligible share |
|---:|---:|---:|---:|---:|---:|---:|
| 2008 | 6 | 6 | 4 | 875.9 | 606.4 | 69.2% |
| 2012 | 6 | 6 | 5 | 809.0 | 713.6 | 88.2% |
| 2016 | 6 | 6 | 4 | 843.6 | 598.2 | 70.9% |
| 2020 | 6 | 6 | 5 | 830.6 | 679.3 | 81.8% |
| 2024 | 6 | 6 | 5 | 827.4 | 735.5 | 88.9% |

## Validation errors

_(none — all fixture rows pass)_

## Weighted state marginals (across all rows, regardless of eligibility)

| state | region | 2008 | 2012 | 2016 | 2020 | 2024 |
|---|---|---|---|---|---|---|
| AZ | West | 0.0 | 128.3 | 0.0 | 145.0 | 0.0 |
| CA | West | 188.2 | 0.0 | 198.0 | 0.0 | 167.4 |
| FL | South | 121.7 | 0.0 | 88.9 | 0.0 | 130.1 |
| GA | South | 0.0 | 109.8 | 0.0 | 138.6 | 0.0 |
| IL | Midwest | 0.0 | 95.4 | 0.0 | 0.0 | 0.0 |
| MA | Northeast | 0.0 | 0.0 | 0.0 | 109.2 | 0.0 |
| MI | Midwest | 0.0 | 159.0 | 0.0 | 0.0 | 156.8 |
| NC | South | 0.0 | 0.0 | 148.7 | 0.0 | 0.0 |
| NJ | Northeast | 0.0 | 141.9 | 0.0 | 0.0 | 0.0 |
| NV | West | 0.0 | 0.0 | 156.5 | 0.0 | 0.0 |
| NY | Northeast | 102.5 | 0.0 | 0.0 | 0.0 | 91.9 |
| OH | Midwest | 152.4 | 0.0 | 0.0 | 0.0 | 138.7 |
| PA | Northeast | 144.1 | 0.0 | 0.0 | 162.4 | 142.5 |
| TX | South | 167.0 | 0.0 | 117.3 | 151.3 | 0.0 |
| WA | West | 0.0 | 174.6 | 0.0 | 124.1 | 0.0 |
| WI | Midwest | 0.0 | 0.0 | 134.2 | 0.0 | 0.0 |

## Weighted age-bucket marginals

| bucket | 2008 | 2012 | 2016 | 2020 | 2024 |
|---|---|---|---|---|---|
| 18-24 | 102.5 | 0.0 | 206.2 | 124.1 | 259.3 |
| 25-34 | 188.2 | 475.5 | 156.5 | 145.0 | 0.0 |
| 35-44 | 319.4 | 95.4 | 148.7 | 313.7 | 142.5 |
| 45-54 | 0.0 | 128.3 | 134.2 | 0.0 | 295.5 |
| 55-64 | 144.1 | 0.0 | 198.0 | 138.6 | 0.0 |
| 65-74 | 121.7 | 109.8 | 0.0 | 0.0 | 130.1 |
| 75+ | 0.0 | 0.0 | 0.0 | 109.2 | 0.0 |

## Weighted race marginals

| race | 2008 | 2012 | 2016 | 2020 | 2024 |
|---|---|---|---|---|---|
| white | 274.1 | 300.9 | 340.4 | 416.6 | 286.9 |
| black | 246.6 | 109.8 | 148.7 | 138.6 | 234.4 |
| amerindian | 0.0 | 128.3 | 0.0 | 0.0 | 0.0 |
| asian | 188.2 | 174.6 | 198.0 | 124.1 | 167.4 |
| nhpi | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 |
| other_single | 167.0 | 0.0 | 156.5 | 151.3 | 0.0 |
| two_or_more | 0.0 | 95.4 | 0.0 | 0.0 | 138.7 |

## Weighted citizenship marginals (eligibility surface)

| citizenship | 2008 | 2012 | 2016 | 2020 | 2024 |
|---|---|---|---|---|---|
| us_born | 520.7 | 397.1 | 489.1 | 555.2 | 660.0 |
| us_naturalized | 188.2 | 316.5 | 198.0 | 124.1 | 167.4 |
| us_territory | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 |
| non_citizen | 167.0 | 95.4 | 156.5 | 151.3 | 0.0 |

## Acceptance summary

- All five backtest years produce rows: ✅ (5/5)
- All fixture rows pass `validateVepUniverseRow`: ✅
- Eligible / ineligible mix exercised in every year: ✅

## Terminology

`vepEligible` is the population-skeleton invariant. Engagement is referenced only as a downstream concern (Phase 2.4 calibration consumes universe rows) — separate 1D continuous scalar per ADR canon, not introduced in this scaffold. Compound moral-circle terminology applies at the bridge step (Phase 2.7.5), not here. Legacy code identifiers (`PWGTP`, `RAC1P`, `SCHL` etc.) are referenced only as PUMS column names in comments.