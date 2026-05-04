# Survey-to-PRISM Mapper Coverage Audit (Phase 2.7.7)

**Run at:** 2026-05-04T14:45:14.573Z
**Sample row limit per year:** 5000
**Status:** Read-only diagnostic. The mapper is **NOT** modified by this audit.

## What this answers

By year and by PRISM target: how much of the synthetic-electorate signature is **real survey signal** (the mapper consumed at least one CCES column) versus **fallback** (the mapper emitted a uniform prior because no covered column was available). Where the target is a moral-boundary salience or engagement scalar, "near-fallback" means the weighted mean is near the mapper's documented fallback default.

Per target the audit reports:
- weighted % rows where provenance.source = "real_signal" vs "fallback"
- weighted % rows where provenance.partyIdDerived = true (only ever > 0 for `moralBoundaries.political_camp` per the mapper's pid7 wiring)
- weighted distribution of provenance.uncertainty (low / medium / high)
- top source columns actually consumed (by weighted use)
- weighted marginal summary (avg posterior or scalar mean) and a near-uniform / near-fallback flag
- **signature-blocker** labels: real-signal coverage < 25% OR weighted marginal indistinguishable from the mapper's fallback prior

**Not in scope**: vote prediction, candidate distance, abstention calibration, scorer fields, mapper revision. The audit's job is to *explain* coverage gaps so the next mapper version can be planned with priorities; it does not change anything.

## Vote-choice scrub spy

- Signatures checked: **25000**
- Byte-identical after scrubbing `voteChoiceObserved` to `"Unknown"`: **25000**
- Spy result: **✓ PASS** — mapper does not read voteChoiceObserved

(Comparison strips `voteChoiceObserved` + `turnoutObserved` from the fingerprint; those fields are intentionally carried through the mapper unchanged for downstream backtest evaluators and would be circular to compare.)

## Cross-year aggregate provenance (per-row, weighted)

| Year | Rows | Real-signal targets / 20 | Fallback targets / 20 | Party-ID-derived targets / 20 |
|---|---:|---:|---:|---:|
| 2008 | 5000 | 1.00 | 19.00 | 0.00 |
| 2012 | 5000 | 5.93 | 14.07 | 1.97 |
| 2016 | 5000 | 5.92 | 14.08 | 1.96 |
| 2020 | 5000 | 5.91 | 14.09 | 1.96 |
| 2024 | 5000 | 5.89 | 14.11 | 1.96 |

## Cross-year per-target real-signal coverage (weighted %)

| Target | Kind | 2008 | 2012 | 2016 | 2020 | 2024 | Mean | Blocker years |
|---|---|---:|---:|---:|---:|---:|---:|---|
| `MAT` | continuous | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 2008, 2012, 2016, 2020, 2024 |
| `CD` | continuous | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 2008, 2012, 2016, 2020, 2024 |
| `CU` | continuous | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 2008, 2012, 2016, 2020, 2024 |
| `MOR` | continuous | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 2008, 2012, 2016, 2020, 2024 |
| `PRO` | continuous | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 2008, 2012, 2016, 2020, 2024 |
| `COM` | continuous | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 2008, 2012, 2016, 2020, 2024 |
| `ZS` | continuous | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 2008, 2012, 2016, 2020, 2024 |
| `ONT_H` | continuous | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 2008, 2012, 2016, 2020, 2024 |
| `ONT_S` | continuous | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 2008, 2012, 2016, 2020, 2024 |
| `EPS` | categorical | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 2008, 2012, 2016, 2020, 2024 |
| `AES` | categorical | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 2008, 2012, 2016, 2020, 2024 |
| `engagement` | engagement | 100.0 | 99.7 | 99.9 | 99.3 | 98.9 | 99.6 | (none) |
| `moralBoundaries.national` | moral_boundary | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 2008, 2012, 2016, 2020, 2024 |
| `moralBoundaries.ethnic_racial` | moral_boundary | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 2008, 2012, 2016, 2020, 2024 |
| `moralBoundaries.religious` | moral_boundary | 0.0 | 99.9 | 100.0 | 100.0 | 100.0 | 80.0 | 2008 |
| `moralBoundaries.class` | moral_boundary | 0.0 | 99.5 | 99.9 | 100.0 | 100.0 | 79.9 | 2008 |
| `moralBoundaries.ideological` | moral_boundary | 0.0 | 96.2 | 95.4 | 94.9 | 93.1 | 75.9 | 2008 |
| `moralBoundaries.gender` | moral_boundary | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 2008, 2012, 2016, 2020, 2024 |
| `moralBoundaries.political_camp` | moral_boundary | 0.0 | 98.3 | 98.1 | 98.1 | 97.9 | 78.5 | 2008 |
| `moralBoundaries.intensity` | intensity | 0.0 | 99.5 | 99.1 | 98.8 | 98.9 | 79.3 | 2008 |

## 2008

- Rows mapped: **5000**; total weight: **4055**
- Per row (weighted mean): real-signal targets **1.00 / 20**; fallback **19.00 / 20**; party-ID-derived **0.00 / 20**
- Signature blockers: **19 / 20** (`MAT`, `CD`, `CU`, `MOR`, `PRO`, `COM`, `ZS`, `ONT_H`, `ONT_S`, `EPS`, `AES`, `moralBoundaries.national`, `moralBoundaries.ethnic_racial`, `moralBoundaries.religious`, `moralBoundaries.class`, `moralBoundaries.ideological`, `moralBoundaries.gender`, `moralBoundaries.political_camp`, `moralBoundaries.intensity`)

### Per-target coverage

| Target | Kind | Real-signal % | Fallback % | Party-ID % | Mean uncertainty | Top source fields | Marginal summary | Blocker |
|---|---|---:|---:|---:|---:|---|---|:--:|
| `MAT` | continuous | 0.0 | 100.0 | 0.0 | 3.00 | — | dist=[0.200, 0.200, 0.200, 0.200, 0.200], spread=0.00e+0, mean_pos=3.00 | ✗ |
| `CD` | continuous | 0.0 | 100.0 | 0.0 | 3.00 | — | dist=[0.200, 0.200, 0.200, 0.200, 0.200], spread=0.00e+0, mean_pos=3.00 | ✗ |
| `CU` | continuous | 0.0 | 100.0 | 0.0 | 3.00 | — | dist=[0.200, 0.200, 0.200, 0.200, 0.200], spread=0.00e+0, mean_pos=3.00 | ✗ |
| `MOR` | continuous | 0.0 | 100.0 | 0.0 | 3.00 | — | dist=[0.200, 0.200, 0.200, 0.200, 0.200], spread=0.00e+0, mean_pos=3.00 | ✗ |
| `PRO` | continuous | 0.0 | 100.0 | 0.0 | 3.00 | — | dist=[0.200, 0.200, 0.200, 0.200, 0.200], spread=0.00e+0, mean_pos=3.00 | ✗ |
| `COM` | continuous | 0.0 | 100.0 | 0.0 | 3.00 | — | dist=[0.200, 0.200, 0.200, 0.200, 0.200], spread=0.00e+0, mean_pos=3.00 | ✗ |
| `ZS` | continuous | 0.0 | 100.0 | 0.0 | 3.00 | — | dist=[0.200, 0.200, 0.200, 0.200, 0.200], spread=0.00e+0, mean_pos=3.00 | ✗ |
| `ONT_H` | continuous | 0.0 | 100.0 | 0.0 | 3.00 | — | dist=[0.200, 0.200, 0.200, 0.200, 0.200], spread=0.00e+0, mean_pos=3.00 | ✗ |
| `ONT_S` | continuous | 0.0 | 100.0 | 0.0 | 3.00 | — | dist=[0.200, 0.200, 0.200, 0.200, 0.200], spread=0.00e+0, mean_pos=3.00 | ✗ |
| `EPS` | categorical | 0.0 | 100.0 | 0.0 | 3.00 | — | dist=[0.200, 0.300, 0.100, 0.150, 0.150, 0.100], spread=2.00e-1 | ✗ |
| `AES` | categorical | 0.0 | 100.0 | 0.0 | 3.00 | — | dist=[0.167, 0.167, 0.167, 0.167, 0.167, 0.167], spread=0.00e+0 | ✗ |
| `engagement` | engagement | 100.0 | 0.0 | 0.0 | 1.00 | `turnoutValidated` (100%) | mean=5.64, sd=1.51, |mean−5|=0.64 | ✓ |
| `moralBoundaries.national` | moral_boundary | 0.0 | 100.0 | 0.0 | 3.00 | — | mean=1.000, sd=0.000, |mean−1|=0.000 | ✗ |
| `moralBoundaries.ethnic_racial` | moral_boundary | 0.0 | 100.0 | 0.0 | 3.00 | — | mean=1.000, sd=0.000, |mean−1|=0.000 | ✗ |
| `moralBoundaries.religious` | moral_boundary | 0.0 | 100.0 | 0.0 | 3.00 | — | mean=1.000, sd=0.000, |mean−1|=0.000 | ✗ |
| `moralBoundaries.class` | moral_boundary | 0.0 | 100.0 | 0.0 | 3.00 | — | mean=1.000, sd=0.000, |mean−1|=0.000 | ✗ |
| `moralBoundaries.ideological` | moral_boundary | 0.0 | 100.0 | 0.0 | 3.00 | — | mean=1.000, sd=0.000, |mean−1|=0.000 | ✗ |
| `moralBoundaries.gender` | moral_boundary | 0.0 | 100.0 | 0.0 | 3.00 | — | mean=1.000, sd=0.000, |mean−1|=0.000 | ✗ |
| `moralBoundaries.political_camp` | moral_boundary | 0.0 | 100.0 | 0.0 | 3.00 | — | mean=1.000, sd=0.000, |mean−1|=0.000 | ✗ |
| `moralBoundaries.intensity` | intensity | 0.0 | 100.0 | 0.0 | 3.00 | — | mean=1.000, sd=0.000, |mean−1|=0.000 | ✗ |

### Signature blockers detail

- **`MAT`** — real-signal coverage 0.0% < 25%; weighted marginal indistinguishable from uniform [0.2,0.2,0.2,0.2,0.2] (spread=0.00e+0)
- **`CD`** — real-signal coverage 0.0% < 25%; weighted marginal indistinguishable from uniform [0.2,0.2,0.2,0.2,0.2] (spread=0.00e+0)
- **`CU`** — real-signal coverage 0.0% < 25%; weighted marginal indistinguishable from uniform [0.2,0.2,0.2,0.2,0.2] (spread=0.00e+0)
- **`MOR`** — real-signal coverage 0.0% < 25%; weighted marginal indistinguishable from uniform [0.2,0.2,0.2,0.2,0.2] (spread=0.00e+0)
- **`PRO`** — real-signal coverage 0.0% < 25%; weighted marginal indistinguishable from uniform [0.2,0.2,0.2,0.2,0.2] (spread=0.00e+0)
- **`COM`** — real-signal coverage 0.0% < 25%; weighted marginal indistinguishable from uniform [0.2,0.2,0.2,0.2,0.2] (spread=0.00e+0)
- **`ZS`** — real-signal coverage 0.0% < 25%; weighted marginal indistinguishable from uniform [0.2,0.2,0.2,0.2,0.2] (spread=0.00e+0)
- **`ONT_H`** — real-signal coverage 0.0% < 25%; weighted marginal indistinguishable from uniform [0.2,0.2,0.2,0.2,0.2] (spread=0.00e+0)
- **`ONT_S`** — real-signal coverage 0.0% < 25%; weighted marginal indistinguishable from uniform [0.2,0.2,0.2,0.2,0.2] (spread=0.00e+0)
- **`EPS`** — real-signal coverage 0.0% < 25%
- **`AES`** — real-signal coverage 0.0% < 25%; weighted 6-bin distribution indistinguishable from uniform [1/6 × 6] (spread=0.00e+0)
- **`moralBoundaries.national`** — real-signal coverage 0.0% < 25%; weighted mean salience ≈ boundary fallback default 1 (mean=1.000, sd=0.000)
- **`moralBoundaries.ethnic_racial`** — real-signal coverage 0.0% < 25%; weighted mean salience ≈ boundary fallback default 1 (mean=1.000, sd=0.000)
- **`moralBoundaries.religious`** — real-signal coverage 0.0% < 25%; weighted mean salience ≈ boundary fallback default 1 (mean=1.000, sd=0.000)
- **`moralBoundaries.class`** — real-signal coverage 0.0% < 25%; weighted mean salience ≈ boundary fallback default 1 (mean=1.000, sd=0.000)
- **`moralBoundaries.ideological`** — real-signal coverage 0.0% < 25%; weighted mean salience ≈ boundary fallback default 1 (mean=1.000, sd=0.000)
- **`moralBoundaries.gender`** — real-signal coverage 0.0% < 25%; weighted mean salience ≈ boundary fallback default 1 (mean=1.000, sd=0.000)
- **`moralBoundaries.political_camp`** — real-signal coverage 0.0% < 25%; weighted mean salience ≈ boundary fallback default 1 (mean=1.000, sd=0.000)
- **`moralBoundaries.intensity`** — real-signal coverage 0.0% < 25%; weighted mean intensity ≈ fallback default 1 (mean=1.000)

## 2012

- Rows mapped: **5000**; total weight: **3476**
- Per row (weighted mean): real-signal targets **5.93 / 20**; fallback **14.07 / 20**; party-ID-derived **1.97 / 20**
- Signature blockers: **14 / 20** (`MAT`, `CD`, `CU`, `MOR`, `PRO`, `COM`, `ZS`, `ONT_H`, `ONT_S`, `EPS`, `AES`, `moralBoundaries.national`, `moralBoundaries.ethnic_racial`, `moralBoundaries.gender`)

### Per-target coverage

| Target | Kind | Real-signal % | Fallback % | Party-ID % | Mean uncertainty | Top source fields | Marginal summary | Blocker |
|---|---|---:|---:|---:|---:|---|---|:--:|
| `MAT` | continuous | 0.0 | 100.0 | 0.0 | 3.00 | — | dist=[0.200, 0.200, 0.200, 0.200, 0.200], spread=0.00e+0, mean_pos=3.00 | ✗ |
| `CD` | continuous | 0.0 | 100.0 | 0.0 | 3.00 | — | dist=[0.200, 0.200, 0.200, 0.200, 0.200], spread=0.00e+0, mean_pos=3.00 | ✗ |
| `CU` | continuous | 0.0 | 100.0 | 0.0 | 3.00 | — | dist=[0.200, 0.200, 0.200, 0.200, 0.200], spread=0.00e+0, mean_pos=3.00 | ✗ |
| `MOR` | continuous | 0.0 | 100.0 | 0.0 | 3.00 | — | dist=[0.200, 0.200, 0.200, 0.200, 0.200], spread=0.00e+0, mean_pos=3.00 | ✗ |
| `PRO` | continuous | 0.0 | 100.0 | 0.0 | 3.00 | — | dist=[0.200, 0.200, 0.200, 0.200, 0.200], spread=0.00e+0, mean_pos=3.00 | ✗ |
| `COM` | continuous | 0.0 | 100.0 | 0.0 | 3.00 | — | dist=[0.200, 0.200, 0.200, 0.200, 0.200], spread=0.00e+0, mean_pos=3.00 | ✗ |
| `ZS` | continuous | 0.0 | 100.0 | 0.0 | 3.00 | — | dist=[0.200, 0.200, 0.200, 0.200, 0.200], spread=0.00e+0, mean_pos=3.00 | ✗ |
| `ONT_H` | continuous | 0.0 | 100.0 | 0.0 | 3.00 | — | dist=[0.200, 0.200, 0.200, 0.200, 0.200], spread=0.00e+0, mean_pos=3.00 | ✗ |
| `ONT_S` | continuous | 0.0 | 100.0 | 0.0 | 3.00 | — | dist=[0.200, 0.200, 0.200, 0.200, 0.200], spread=0.00e+0, mean_pos=3.00 | ✗ |
| `EPS` | categorical | 0.0 | 100.0 | 0.0 | 3.00 | — | dist=[0.200, 0.300, 0.100, 0.150, 0.150, 0.100], spread=2.00e-1 | ✗ |
| `AES` | categorical | 0.0 | 100.0 | 0.0 | 3.00 | — | dist=[0.167, 0.167, 0.167, 0.167, 0.167, 0.167], spread=0.00e+0 | ✗ |
| `engagement` | engagement | 99.7 | 0.3 | 0.0 | 2.00 | `newsint` (99%), `turnoutObserved` (86%) | mean=7.81, sd=1.40, |mean−5|=2.81 | ✓ |
| `moralBoundaries.national` | moral_boundary | 0.0 | 100.0 | 0.0 | 3.00 | — | mean=1.000, sd=0.000, |mean−1|=0.000 | ✗ |
| `moralBoundaries.ethnic_racial` | moral_boundary | 0.0 | 100.0 | 0.0 | 3.00 | — | mean=1.000, sd=0.000, |mean−1|=0.000 | ✗ |
| `moralBoundaries.religious` | moral_boundary | 99.9 | 0.1 | 0.0 | 2.01 | `pew_bornagain` (100%), `pew_churatd` (99%) | mean=1.274, sd=0.729, |mean−1|=0.274 | ✓ |
| `moralBoundaries.class` | moral_boundary | 99.5 | 0.5 | 0.0 | 3.00 | `union` (100%) | mean=1.015, sd=0.319, |mean−1|=0.015 | ✓ |
| `moralBoundaries.ideological` | moral_boundary | 96.2 | 3.8 | 0.0 | 2.04 | `ideo5` (96%) | mean=1.312, sd=0.637, |mean−1|=0.312 | ✓ |
| `moralBoundaries.gender` | moral_boundary | 0.0 | 100.0 | 0.0 | 3.00 | — | mean=1.000, sd=0.000, |mean−1|=0.000 | ✗ |
| `moralBoundaries.political_camp` | moral_boundary | 98.3 | 1.7 | 98.3 | 2.02 | `pid7` (98%) | mean=1.748, sd=0.716, |mean−1|=0.748 | ✓ |
| `moralBoundaries.intensity` | intensity | 99.5 | 0.5 | 98.3 | 2.00 | — | mean=1.714, sd=0.372, |mean−1|=0.714 | ✓ |

### Signature blockers detail

- **`MAT`** — real-signal coverage 0.0% < 25%; weighted marginal indistinguishable from uniform [0.2,0.2,0.2,0.2,0.2] (spread=0.00e+0)
- **`CD`** — real-signal coverage 0.0% < 25%; weighted marginal indistinguishable from uniform [0.2,0.2,0.2,0.2,0.2] (spread=0.00e+0)
- **`CU`** — real-signal coverage 0.0% < 25%; weighted marginal indistinguishable from uniform [0.2,0.2,0.2,0.2,0.2] (spread=0.00e+0)
- **`MOR`** — real-signal coverage 0.0% < 25%; weighted marginal indistinguishable from uniform [0.2,0.2,0.2,0.2,0.2] (spread=0.00e+0)
- **`PRO`** — real-signal coverage 0.0% < 25%; weighted marginal indistinguishable from uniform [0.2,0.2,0.2,0.2,0.2] (spread=0.00e+0)
- **`COM`** — real-signal coverage 0.0% < 25%; weighted marginal indistinguishable from uniform [0.2,0.2,0.2,0.2,0.2] (spread=0.00e+0)
- **`ZS`** — real-signal coverage 0.0% < 25%; weighted marginal indistinguishable from uniform [0.2,0.2,0.2,0.2,0.2] (spread=0.00e+0)
- **`ONT_H`** — real-signal coverage 0.0% < 25%; weighted marginal indistinguishable from uniform [0.2,0.2,0.2,0.2,0.2] (spread=0.00e+0)
- **`ONT_S`** — real-signal coverage 0.0% < 25%; weighted marginal indistinguishable from uniform [0.2,0.2,0.2,0.2,0.2] (spread=0.00e+0)
- **`EPS`** — real-signal coverage 0.0% < 25%
- **`AES`** — real-signal coverage 0.0% < 25%; weighted 6-bin distribution indistinguishable from uniform [1/6 × 6] (spread=0.00e+0)
- **`moralBoundaries.national`** — real-signal coverage 0.0% < 25%; weighted mean salience ≈ boundary fallback default 1 (mean=1.000, sd=0.000)
- **`moralBoundaries.ethnic_racial`** — real-signal coverage 0.0% < 25%; weighted mean salience ≈ boundary fallback default 1 (mean=1.000, sd=0.000)
- **`moralBoundaries.gender`** — real-signal coverage 0.0% < 25%; weighted mean salience ≈ boundary fallback default 1 (mean=1.000, sd=0.000)

## 2016

- Rows mapped: **5000**; total weight: **4038**
- Per row (weighted mean): real-signal targets **5.92 / 20**; fallback **14.08 / 20**; party-ID-derived **1.96 / 20**
- Signature blockers: **14 / 20** (`MAT`, `CD`, `CU`, `MOR`, `PRO`, `COM`, `ZS`, `ONT_H`, `ONT_S`, `EPS`, `AES`, `moralBoundaries.national`, `moralBoundaries.ethnic_racial`, `moralBoundaries.gender`)

### Per-target coverage

| Target | Kind | Real-signal % | Fallback % | Party-ID % | Mean uncertainty | Top source fields | Marginal summary | Blocker |
|---|---|---:|---:|---:|---:|---|---|:--:|
| `MAT` | continuous | 0.0 | 100.0 | 0.0 | 3.00 | — | dist=[0.200, 0.200, 0.200, 0.200, 0.200], spread=0.00e+0, mean_pos=3.00 | ✗ |
| `CD` | continuous | 0.0 | 100.0 | 0.0 | 3.00 | — | dist=[0.200, 0.200, 0.200, 0.200, 0.200], spread=0.00e+0, mean_pos=3.00 | ✗ |
| `CU` | continuous | 0.0 | 100.0 | 0.0 | 3.00 | — | dist=[0.200, 0.200, 0.200, 0.200, 0.200], spread=0.00e+0, mean_pos=3.00 | ✗ |
| `MOR` | continuous | 0.0 | 100.0 | 0.0 | 3.00 | — | dist=[0.200, 0.200, 0.200, 0.200, 0.200], spread=0.00e+0, mean_pos=3.00 | ✗ |
| `PRO` | continuous | 0.0 | 100.0 | 0.0 | 3.00 | — | dist=[0.200, 0.200, 0.200, 0.200, 0.200], spread=0.00e+0, mean_pos=3.00 | ✗ |
| `COM` | continuous | 0.0 | 100.0 | 0.0 | 3.00 | — | dist=[0.200, 0.200, 0.200, 0.200, 0.200], spread=0.00e+0, mean_pos=3.00 | ✗ |
| `ZS` | continuous | 0.0 | 100.0 | 0.0 | 3.00 | — | dist=[0.200, 0.200, 0.200, 0.200, 0.200], spread=0.00e+0, mean_pos=3.00 | ✗ |
| `ONT_H` | continuous | 0.0 | 100.0 | 0.0 | 3.00 | — | dist=[0.200, 0.200, 0.200, 0.200, 0.200], spread=0.00e+0, mean_pos=3.00 | ✗ |
| `ONT_S` | continuous | 0.0 | 100.0 | 0.0 | 3.00 | — | dist=[0.200, 0.200, 0.200, 0.200, 0.200], spread=0.00e+0, mean_pos=3.00 | ✗ |
| `EPS` | categorical | 0.0 | 100.0 | 0.0 | 3.00 | — | dist=[0.200, 0.300, 0.100, 0.150, 0.150, 0.100], spread=2.00e-1 | ✗ |
| `AES` | categorical | 0.0 | 100.0 | 0.0 | 3.00 | — | dist=[0.167, 0.167, 0.167, 0.167, 0.167, 0.167], spread=0.00e+0 | ✗ |
| `engagement` | engagement | 99.9 | 0.1 | 0.0 | 1.36 | `newsint` (100%), `turnoutValidated` (64%), `turnoutObserved` (24%) | mean=8.38, sd=1.61, |mean−5|=3.38 | ✓ |
| `moralBoundaries.national` | moral_boundary | 0.0 | 100.0 | 0.0 | 3.00 | — | mean=1.000, sd=0.000, |mean−1|=0.000 | ✗ |
| `moralBoundaries.ethnic_racial` | moral_boundary | 0.0 | 100.0 | 0.0 | 3.00 | — | mean=1.000, sd=0.000, |mean−1|=0.000 | ✗ |
| `moralBoundaries.religious` | moral_boundary | 100.0 | 0.0 | 0.0 | 2.01 | `pew_bornagain` (100%), `pew_churatd` (99%) | mean=1.189, sd=0.704, |mean−1|=0.189 | ✓ |
| `moralBoundaries.class` | moral_boundary | 99.9 | 0.1 | 0.0 | 3.00 | `union` (100%) | mean=1.000, sd=0.315, |mean−1|=0.000 | ✓ |
| `moralBoundaries.ideological` | moral_boundary | 95.4 | 4.6 | 0.0 | 2.05 | `ideo5` (95%) | mean=1.253, sd=0.669, |mean−1|=0.253 | ✓ |
| `moralBoundaries.gender` | moral_boundary | 0.0 | 100.0 | 0.0 | 3.00 | — | mean=1.000, sd=0.000, |mean−1|=0.000 | ✗ |
| `moralBoundaries.political_camp` | moral_boundary | 98.1 | 1.9 | 98.1 | 2.02 | `pid7` (98%) | mean=1.711, sd=0.752, |mean−1|=0.711 | ✓ |
| `moralBoundaries.intensity` | intensity | 99.1 | 0.9 | 98.0 | 2.01 | — | mean=1.686, sd=0.379, |mean−1|=0.686 | ✓ |

### Signature blockers detail

- **`MAT`** — real-signal coverage 0.0% < 25%; weighted marginal indistinguishable from uniform [0.2,0.2,0.2,0.2,0.2] (spread=0.00e+0)
- **`CD`** — real-signal coverage 0.0% < 25%; weighted marginal indistinguishable from uniform [0.2,0.2,0.2,0.2,0.2] (spread=0.00e+0)
- **`CU`** — real-signal coverage 0.0% < 25%; weighted marginal indistinguishable from uniform [0.2,0.2,0.2,0.2,0.2] (spread=0.00e+0)
- **`MOR`** — real-signal coverage 0.0% < 25%; weighted marginal indistinguishable from uniform [0.2,0.2,0.2,0.2,0.2] (spread=0.00e+0)
- **`PRO`** — real-signal coverage 0.0% < 25%; weighted marginal indistinguishable from uniform [0.2,0.2,0.2,0.2,0.2] (spread=0.00e+0)
- **`COM`** — real-signal coverage 0.0% < 25%; weighted marginal indistinguishable from uniform [0.2,0.2,0.2,0.2,0.2] (spread=0.00e+0)
- **`ZS`** — real-signal coverage 0.0% < 25%; weighted marginal indistinguishable from uniform [0.2,0.2,0.2,0.2,0.2] (spread=0.00e+0)
- **`ONT_H`** — real-signal coverage 0.0% < 25%; weighted marginal indistinguishable from uniform [0.2,0.2,0.2,0.2,0.2] (spread=0.00e+0)
- **`ONT_S`** — real-signal coverage 0.0% < 25%; weighted marginal indistinguishable from uniform [0.2,0.2,0.2,0.2,0.2] (spread=0.00e+0)
- **`EPS`** — real-signal coverage 0.0% < 25%
- **`AES`** — real-signal coverage 0.0% < 25%; weighted 6-bin distribution indistinguishable from uniform [1/6 × 6] (spread=0.00e+0)
- **`moralBoundaries.national`** — real-signal coverage 0.0% < 25%; weighted mean salience ≈ boundary fallback default 1 (mean=1.000, sd=0.000)
- **`moralBoundaries.ethnic_racial`** — real-signal coverage 0.0% < 25%; weighted mean salience ≈ boundary fallback default 1 (mean=1.000, sd=0.000)
- **`moralBoundaries.gender`** — real-signal coverage 0.0% < 25%; weighted mean salience ≈ boundary fallback default 1 (mean=1.000, sd=0.000)

## 2020

- Rows mapped: **5000**; total weight: **4464**
- Per row (weighted mean): real-signal targets **5.91 / 20**; fallback **14.09 / 20**; party-ID-derived **1.96 / 20**
- Signature blockers: **14 / 20** (`MAT`, `CD`, `CU`, `MOR`, `PRO`, `COM`, `ZS`, `ONT_H`, `ONT_S`, `EPS`, `AES`, `moralBoundaries.national`, `moralBoundaries.ethnic_racial`, `moralBoundaries.gender`)

### Per-target coverage

| Target | Kind | Real-signal % | Fallback % | Party-ID % | Mean uncertainty | Top source fields | Marginal summary | Blocker |
|---|---|---:|---:|---:|---:|---|---|:--:|
| `MAT` | continuous | 0.0 | 100.0 | 0.0 | 3.00 | — | dist=[0.200, 0.200, 0.200, 0.200, 0.200], spread=0.00e+0, mean_pos=3.00 | ✗ |
| `CD` | continuous | 0.0 | 100.0 | 0.0 | 3.00 | — | dist=[0.200, 0.200, 0.200, 0.200, 0.200], spread=0.00e+0, mean_pos=3.00 | ✗ |
| `CU` | continuous | 0.0 | 100.0 | 0.0 | 3.00 | — | dist=[0.200, 0.200, 0.200, 0.200, 0.200], spread=0.00e+0, mean_pos=3.00 | ✗ |
| `MOR` | continuous | 0.0 | 100.0 | 0.0 | 3.00 | — | dist=[0.200, 0.200, 0.200, 0.200, 0.200], spread=0.00e+0, mean_pos=3.00 | ✗ |
| `PRO` | continuous | 0.0 | 100.0 | 0.0 | 3.00 | — | dist=[0.200, 0.200, 0.200, 0.200, 0.200], spread=0.00e+0, mean_pos=3.00 | ✗ |
| `COM` | continuous | 0.0 | 100.0 | 0.0 | 3.00 | — | dist=[0.200, 0.200, 0.200, 0.200, 0.200], spread=0.00e+0, mean_pos=3.00 | ✗ |
| `ZS` | continuous | 0.0 | 100.0 | 0.0 | 3.00 | — | dist=[0.200, 0.200, 0.200, 0.200, 0.200], spread=0.00e+0, mean_pos=3.00 | ✗ |
| `ONT_H` | continuous | 0.0 | 100.0 | 0.0 | 3.00 | — | dist=[0.200, 0.200, 0.200, 0.200, 0.200], spread=0.00e+0, mean_pos=3.00 | ✗ |
| `ONT_S` | continuous | 0.0 | 100.0 | 0.0 | 3.00 | — | dist=[0.200, 0.200, 0.200, 0.200, 0.200], spread=0.00e+0, mean_pos=3.00 | ✗ |
| `EPS` | categorical | 0.0 | 100.0 | 0.0 | 3.00 | — | dist=[0.200, 0.300, 0.100, 0.150, 0.150, 0.100], spread=2.00e-1 | ✗ |
| `AES` | categorical | 0.0 | 100.0 | 0.0 | 3.00 | — | dist=[0.167, 0.167, 0.167, 0.167, 0.167, 0.167], spread=0.00e+0 | ✗ |
| `engagement` | engagement | 99.3 | 0.7 | 0.0 | 1.26 | `newsint` (99%), `turnoutValidated` (75%), `turnoutObserved` (12%) | mean=8.24, sd=1.81, |mean−5|=3.24 | ✓ |
| `moralBoundaries.national` | moral_boundary | 0.0 | 100.0 | 0.0 | 3.00 | — | mean=1.000, sd=0.000, |mean−1|=0.000 | ✗ |
| `moralBoundaries.ethnic_racial` | moral_boundary | 0.0 | 100.0 | 0.0 | 3.00 | — | mean=1.000, sd=0.000, |mean−1|=0.000 | ✗ |
| `moralBoundaries.religious` | moral_boundary | 100.0 | 0.0 | 0.0 | 2.02 | `pew_bornagain` (100%), `pew_churatd` (98%) | mean=1.207, sd=0.731, |mean−1|=0.207 | ✓ |
| `moralBoundaries.class` | moral_boundary | 100.0 | 0.0 | 0.0 | 3.00 | `union` (100%) | mean=0.981, sd=0.304, |mean−1|=0.019 | ✓ |
| `moralBoundaries.ideological` | moral_boundary | 94.9 | 5.1 | 0.0 | 2.05 | `ideo5` (95%) | mean=1.472, sd=0.761, |mean−1|=0.472 | ✓ |
| `moralBoundaries.gender` | moral_boundary | 0.0 | 100.0 | 0.0 | 3.00 | — | mean=1.000, sd=0.000, |mean−1|=0.000 | ✗ |
| `moralBoundaries.political_camp` | moral_boundary | 98.1 | 1.9 | 98.1 | 2.02 | `pid7` (98%) | mean=1.816, sd=0.748, |mean−1|=0.816 | ✓ |
| `moralBoundaries.intensity` | intensity | 98.8 | 1.2 | 98.1 | 2.01 | — | mean=1.753, sd=0.387, |mean−1|=0.753 | ✓ |

### Signature blockers detail

- **`MAT`** — real-signal coverage 0.0% < 25%; weighted marginal indistinguishable from uniform [0.2,0.2,0.2,0.2,0.2] (spread=0.00e+0)
- **`CD`** — real-signal coverage 0.0% < 25%; weighted marginal indistinguishable from uniform [0.2,0.2,0.2,0.2,0.2] (spread=0.00e+0)
- **`CU`** — real-signal coverage 0.0% < 25%; weighted marginal indistinguishable from uniform [0.2,0.2,0.2,0.2,0.2] (spread=0.00e+0)
- **`MOR`** — real-signal coverage 0.0% < 25%; weighted marginal indistinguishable from uniform [0.2,0.2,0.2,0.2,0.2] (spread=0.00e+0)
- **`PRO`** — real-signal coverage 0.0% < 25%; weighted marginal indistinguishable from uniform [0.2,0.2,0.2,0.2,0.2] (spread=0.00e+0)
- **`COM`** — real-signal coverage 0.0% < 25%; weighted marginal indistinguishable from uniform [0.2,0.2,0.2,0.2,0.2] (spread=0.00e+0)
- **`ZS`** — real-signal coverage 0.0% < 25%; weighted marginal indistinguishable from uniform [0.2,0.2,0.2,0.2,0.2] (spread=0.00e+0)
- **`ONT_H`** — real-signal coverage 0.0% < 25%; weighted marginal indistinguishable from uniform [0.2,0.2,0.2,0.2,0.2] (spread=0.00e+0)
- **`ONT_S`** — real-signal coverage 0.0% < 25%; weighted marginal indistinguishable from uniform [0.2,0.2,0.2,0.2,0.2] (spread=0.00e+0)
- **`EPS`** — real-signal coverage 0.0% < 25%
- **`AES`** — real-signal coverage 0.0% < 25%; weighted 6-bin distribution indistinguishable from uniform [1/6 × 6] (spread=0.00e+0)
- **`moralBoundaries.national`** — real-signal coverage 0.0% < 25%; weighted mean salience ≈ boundary fallback default 1 (mean=1.000, sd=0.000)
- **`moralBoundaries.ethnic_racial`** — real-signal coverage 0.0% < 25%; weighted mean salience ≈ boundary fallback default 1 (mean=1.000, sd=0.000)
- **`moralBoundaries.gender`** — real-signal coverage 0.0% < 25%; weighted mean salience ≈ boundary fallback default 1 (mean=1.000, sd=0.000)

## 2024

- Rows mapped: **5000**; total weight: **5828**
- Per row (weighted mean): real-signal targets **5.89 / 20**; fallback **14.11 / 20**; party-ID-derived **1.96 / 20**
- Signature blockers: **14 / 20** (`MAT`, `CD`, `CU`, `MOR`, `PRO`, `COM`, `ZS`, `ONT_H`, `ONT_S`, `EPS`, `AES`, `moralBoundaries.national`, `moralBoundaries.ethnic_racial`, `moralBoundaries.gender`)

### Per-target coverage

| Target | Kind | Real-signal % | Fallback % | Party-ID % | Mean uncertainty | Top source fields | Marginal summary | Blocker |
|---|---|---:|---:|---:|---:|---|---|:--:|
| `MAT` | continuous | 0.0 | 100.0 | 0.0 | 3.00 | — | dist=[0.200, 0.200, 0.200, 0.200, 0.200], spread=0.00e+0, mean_pos=3.00 | ✗ |
| `CD` | continuous | 0.0 | 100.0 | 0.0 | 3.00 | — | dist=[0.200, 0.200, 0.200, 0.200, 0.200], spread=0.00e+0, mean_pos=3.00 | ✗ |
| `CU` | continuous | 0.0 | 100.0 | 0.0 | 3.00 | — | dist=[0.200, 0.200, 0.200, 0.200, 0.200], spread=0.00e+0, mean_pos=3.00 | ✗ |
| `MOR` | continuous | 0.0 | 100.0 | 0.0 | 3.00 | — | dist=[0.200, 0.200, 0.200, 0.200, 0.200], spread=0.00e+0, mean_pos=3.00 | ✗ |
| `PRO` | continuous | 0.0 | 100.0 | 0.0 | 3.00 | — | dist=[0.200, 0.200, 0.200, 0.200, 0.200], spread=0.00e+0, mean_pos=3.00 | ✗ |
| `COM` | continuous | 0.0 | 100.0 | 0.0 | 3.00 | — | dist=[0.200, 0.200, 0.200, 0.200, 0.200], spread=0.00e+0, mean_pos=3.00 | ✗ |
| `ZS` | continuous | 0.0 | 100.0 | 0.0 | 3.00 | — | dist=[0.200, 0.200, 0.200, 0.200, 0.200], spread=0.00e+0, mean_pos=3.00 | ✗ |
| `ONT_H` | continuous | 0.0 | 100.0 | 0.0 | 3.00 | — | dist=[0.200, 0.200, 0.200, 0.200, 0.200], spread=0.00e+0, mean_pos=3.00 | ✗ |
| `ONT_S` | continuous | 0.0 | 100.0 | 0.0 | 3.00 | — | dist=[0.200, 0.200, 0.200, 0.200, 0.200], spread=0.00e+0, mean_pos=3.00 | ✗ |
| `EPS` | categorical | 0.0 | 100.0 | 0.0 | 3.00 | — | dist=[0.200, 0.300, 0.100, 0.150, 0.150, 0.100], spread=2.00e-1 | ✗ |
| `AES` | categorical | 0.0 | 100.0 | 0.0 | 3.00 | — | dist=[0.167, 0.167, 0.167, 0.167, 0.167, 0.167], spread=0.00e+0 | ✗ |
| `engagement` | engagement | 98.9 | 1.1 | 0.0 | 2.01 | `newsint` (99%), `turnoutObserved` (79%) | mean=7.03, sd=1.87, |mean−5|=2.03 | ✓ |
| `moralBoundaries.national` | moral_boundary | 0.0 | 100.0 | 0.0 | 3.00 | — | mean=1.000, sd=0.000, |mean−1|=0.000 | ✗ |
| `moralBoundaries.ethnic_racial` | moral_boundary | 0.0 | 100.0 | 0.0 | 3.00 | — | mean=1.000, sd=0.000, |mean−1|=0.000 | ✗ |
| `moralBoundaries.religious` | moral_boundary | 100.0 | 0.0 | 0.0 | 2.02 | `pew_bornagain` (100%), `pew_churatd` (98%) | mean=1.159, sd=0.714, |mean−1|=0.159 | ✓ |
| `moralBoundaries.class` | moral_boundary | 100.0 | 0.0 | 0.0 | 3.00 | `union` (100%) | mean=0.926, sd=0.264, |mean−1|=0.074 | ✓ |
| `moralBoundaries.ideological` | moral_boundary | 93.1 | 6.9 | 0.0 | 2.07 | `ideo5` (93%) | mean=1.374, sd=0.765, |mean−1|=0.374 | ✓ |
| `moralBoundaries.gender` | moral_boundary | 0.0 | 100.0 | 0.0 | 3.00 | — | mean=1.000, sd=0.000, |mean−1|=0.000 | ✗ |
| `moralBoundaries.political_camp` | moral_boundary | 97.9 | 2.1 | 97.9 | 2.02 | `pid7` (98%) | mean=1.785, sd=0.741, |mean−1|=0.785 | ✓ |
| `moralBoundaries.intensity` | intensity | 98.9 | 1.1 | 97.9 | 2.01 | — | mean=1.718, sd=0.386, |mean−1|=0.718 | ✓ |

### Signature blockers detail

- **`MAT`** — real-signal coverage 0.0% < 25%; weighted marginal indistinguishable from uniform [0.2,0.2,0.2,0.2,0.2] (spread=0.00e+0)
- **`CD`** — real-signal coverage 0.0% < 25%; weighted marginal indistinguishable from uniform [0.2,0.2,0.2,0.2,0.2] (spread=0.00e+0)
- **`CU`** — real-signal coverage 0.0% < 25%; weighted marginal indistinguishable from uniform [0.2,0.2,0.2,0.2,0.2] (spread=0.00e+0)
- **`MOR`** — real-signal coverage 0.0% < 25%; weighted marginal indistinguishable from uniform [0.2,0.2,0.2,0.2,0.2] (spread=0.00e+0)
- **`PRO`** — real-signal coverage 0.0% < 25%; weighted marginal indistinguishable from uniform [0.2,0.2,0.2,0.2,0.2] (spread=0.00e+0)
- **`COM`** — real-signal coverage 0.0% < 25%; weighted marginal indistinguishable from uniform [0.2,0.2,0.2,0.2,0.2] (spread=0.00e+0)
- **`ZS`** — real-signal coverage 0.0% < 25%; weighted marginal indistinguishable from uniform [0.2,0.2,0.2,0.2,0.2] (spread=0.00e+0)
- **`ONT_H`** — real-signal coverage 0.0% < 25%; weighted marginal indistinguishable from uniform [0.2,0.2,0.2,0.2,0.2] (spread=0.00e+0)
- **`ONT_S`** — real-signal coverage 0.0% < 25%; weighted marginal indistinguishable from uniform [0.2,0.2,0.2,0.2,0.2] (spread=0.00e+0)
- **`EPS`** — real-signal coverage 0.0% < 25%
- **`AES`** — real-signal coverage 0.0% < 25%; weighted 6-bin distribution indistinguishable from uniform [1/6 × 6] (spread=0.00e+0)
- **`moralBoundaries.national`** — real-signal coverage 0.0% < 25%; weighted mean salience ≈ boundary fallback default 1 (mean=1.000, sd=0.000)
- **`moralBoundaries.ethnic_racial`** — real-signal coverage 0.0% < 25%; weighted mean salience ≈ boundary fallback default 1 (mean=1.000, sd=0.000)
- **`moralBoundaries.gender`** — real-signal coverage 0.0% < 25%; weighted mean salience ≈ boundary fallback default 1 (mean=1.000, sd=0.000)

## What "blocker" means here

A target is flagged as a **signature blocker** when either of these conditions holds:

1. **Real-signal coverage is < 25%** of weighted respondents — the mapper is producing a uniform / fallback prior for ≥ 75% of the electorate on that target.
2. **Weighted marginal is indistinguishable from the mapper's fallback prior** — for continuous nodes that's the uniform 5-bin position posterior; for categoricals it's the uniform 6-bin distribution; for engagement / moral-boundary / intensity scalars it's the mapper's documented default value.

Both conditions are diagnostics, not failures. They tell the next mapper-revision pass which targets the upcoming year-specific issue-item resolvers (CC*_337_*, CC*_415r, abortion battery, immigration battery, group-empathy thermometers, etc.) need to cover first.

## Cross-reference

- The mapper itself: `src/electorate/surveyToPrismMapper.ts` (do not edit from this audit).
- The synthetic-electorate aggregate (downstream consumer): `results/electorate/synthetic-electorate/synthetic-electorate-aggregate-smoke.{md,json}`. The aggregate's near-3.0 weighted means on most position nodes are **explained** by this audit's per-target real-signal coverage — they reflect the mapper's uniform-prior fallback being copied through verbatim, not a substantive electorate centrism finding.
