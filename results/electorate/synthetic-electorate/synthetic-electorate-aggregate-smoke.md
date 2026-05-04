# Synthetic Electorate Aggregate — Smoke (Phase 2.7.6)

**Run at:** 2026-05-04T16:15:17.166Z
**Aggregator schema:** `v0.1`
**Mock universe version:** `v0.1-mock`
**Pipeline:** sampleRowLimitPerYear=5000, numDraws=5, randomSeed=20260504

> **MOCK CONTRACT-TEST CELLS — not real population data; do not aggregate or interpret demographically.**

## What this verifies

Builds `SyntheticElectorateRow[]` through the existing v1 hot-deck bridge against the mock universe (no raw JSON dependency), then runs `runSyntheticElectorateAggregate` on the stack and verifies smoke invariants. The aggregator surfaces per-year position-node marginals (mean / sd / p10/p50/p90), categorical distributions for EPS / AES, moral-boundary mean salience + intensity, engagement mean / sd, and three low-order joints (MAT × CD, CD × CU, MOR × PRO). The plan's fourth joint, ENG × abstention-proxy, is **explicitly omitted** because the synthetic-electorate row contract carries no abstention proxy — vote choice, abstention, candidate distance, and counterfactual outputs are downstream projections, not source fields on the row.

**Not in scope**: real PUMS universe, vote prediction, candidate distance, abstention calibration, scorer.

## Pipeline per year

| Year | File present | Donors | Mock cells | Output rows | Per-row errors |
|---|:--:|---:|---:|---:|---:|
| 2008 | yes | 5000 | 7 | 35 | 0 |
| 2012 | yes | 5000 | 7 | 35 | 0 |
| 2016 | yes | 5000 | 7 | 35 | 0 |
| 2020 | yes | 5000 | 7 | 35 | 0 |
| 2024 | yes | 5000 | 7 | 35 | 0 |

## Smoke invariants

| # | Check | Pass | Detail |
|---|---|:--:|---|
| 1 | All 5 mock years loaded into the pipeline | ✓ | loaded=[2008,2012,2016,2020,2024] |
| 2 | Every input SyntheticElectorateRow validates per validateSyntheticElectorateRow | ✓ | total per-row errors = 0 |
| 3 | All input row weights are finite and > 0 | ✓ | min=760 max=1880 n=175 |
| 4 | Aggregate output present for every loaded year | ✓ | aggregate years=[2008,2012,2016,2020,2024] expected=[2008,2012,2016,2020,2024] |
| 5 | Aggregate output carries the mock-universe disclaimer | ✓ | mock_disclaimer="MOCK CONTRACT-TEST CELLS — not real population data; do not ..." |
| 6 | No vote-prediction / candidate-distance / abstention-calibration keys in aggregate output | ✓ | forbidden keys checked = [predictedVote, candidateDistance, voteProbability, abstainProbability, alpha_year, predictedAbstainCount, stageBResult]; none present |
| 7 | Aggregate schema_version matches canonical | ✓ | schema_version="v0.1" |
| 8 | Every year's 9 position-node marginals are finite | ✓ | all years × 9 nodes pass finite check |
| 9 | Every year's MAT×CD / CD×CU / MOR×PRO joints are 5×5 and sum to 1 | ✓ | all 3 joints × all years sum to 1 |
| 10 | engagement_x_turnout_proxy is explicitly omitted with documented reason in every year | ✓ | all years carry omission status + reason |

**Overall: 10/10 ALL PASS**

## 2008

- Rows: **35**; total weight: **46100** (range 940.00 → 1880.00)
- Engagement: mean 6.286, sd 0.839
- Moral-boundary intensity mean: 1.000

### Position-node marginals (1..5 scale)

| Node | Mean | SD | p10 | p50 | p90 | Mean salience |
|---|---:|---:|---:|---:|---:|---:|
| MAT | 3.000 | 0.000 | 3.000 | 3.000 | 3.000 | 1.000 |
| CD | 3.000 | 0.000 | 3.000 | 3.000 | 3.000 | 1.000 |
| CU | 3.000 | 0.000 | 3.000 | 3.000 | 3.000 | 1.000 |
| MOR | 3.000 | 0.000 | 3.000 | 3.000 | 3.000 | 1.000 |
| PRO | 3.000 | 0.000 | 3.000 | 3.000 | 3.000 | 1.000 |
| COM | 3.000 | 0.000 | 3.000 | 3.000 | 3.000 | 1.000 |
| ZS | 3.000 | 0.000 | 3.000 | 3.000 | 3.000 | 1.000 |
| ONT_H | 3.000 | 0.000 | 3.000 | 3.000 | 3.000 | 1.000 |
| ONT_S | 3.000 | 0.000 | 3.000 | 3.000 | 3.000 | 1.000 |

### Categorical-node distributions (6-bin)

| Node | Distribution | Mean salience |
|---|---|---:|
| EPS | [0.200, 0.300, 0.100, 0.150, 0.150, 0.100] | 1.000 |
| AES | [0.167, 0.167, 0.167, 0.167, 0.167, 0.167] | 0.470 |

### Moral-boundary mean salience (0..3 scale)

| Boundary | Mean salience |
|---|---:|
| national | 1.000 |
| ethnic_racial | 1.000 |
| religious | 1.000 |
| class | 1.000 |
| ideological | 1.000 |
| gender | 1.000 |
| political_camp | 1.000 |

### Low-order joints (5×5 weighted outer-product, normalized)

**MAT × CD** — `[0.040, 0.040, 0.040, 0.040, 0.040], [0.040, 0.040, 0.040, 0.040, 0.040], [0.040, 0.040, 0.040, 0.040, 0.040], [0.040, 0.040, 0.040, 0.040, 0.040], [0.040, 0.040, 0.040, 0.040, 0.040]`

**CD × CU** — `[0.040, 0.040, 0.040, 0.040, 0.040], [0.040, 0.040, 0.040, 0.040, 0.040], [0.040, 0.040, 0.040, 0.040, 0.040], [0.040, 0.040, 0.040, 0.040, 0.040], [0.040, 0.040, 0.040, 0.040, 0.040]`

**MOR × PRO** — `[0.040, 0.040, 0.040, 0.040, 0.040], [0.040, 0.040, 0.040, 0.040, 0.040], [0.040, 0.040, 0.040, 0.040, 0.040], [0.040, 0.040, 0.040, 0.040, 0.040], [0.040, 0.040, 0.040, 0.040, 0.040]`

**ENG × turnout-proxy** — `omitted`. Reason: SyntheticElectorateRow carries no turnout / abstention field — vote choice, abstention, candidate distance, and counterfactual outputs are downstream projections of the synthetic electorate, not source fields on the row contract. This joint will be filled when the downstream simulator publishes a per-row turnout / abstention projection.

### Breakouts

**by_state**

| Group | n | Total weight | MAT mean | CD mean | MOR mean | Engagement mean |
|---|---:|---:|---:|---:|---:|---:|
| CA | 5 | 6250 | 3.000 | 3.000 | 3.000 | 6.500 |
| FL | 5 | 8050 | 3.000 | 3.000 | 3.000 | 6.500 |
| GA | 5 | 5200 | 3.000 | 3.000 | 3.000 | 6.500 |
| NY | 5 | 4700 | 3.000 | 3.000 | 3.000 | 4.400 |
| OH | 5 | 5900 | 3.000 | 3.000 | 3.000 | 6.500 |
| PA | 5 | 6600 | 3.000 | 3.000 | 3.000 | 6.500 |
| TX | 5 | 9400 | 3.000 | 3.000 | 3.000 | 6.500 |

**by_ageBucket**

| Group | n | Total weight | MAT mean | CD mean | MOR mean | Engagement mean |
|---|---:|---:|---:|---:|---:|---:|
| 18-24 | 5 | 4700 | 3.000 | 3.000 | 3.000 | 4.400 |
| 35-44 | 15 | 17350 | 3.000 | 3.000 | 3.000 | 6.500 |
| 55-64 | 10 | 16000 | 3.000 | 3.000 | 3.000 | 6.500 |
| 65-74 | 5 | 8050 | 3.000 | 3.000 | 3.000 | 6.500 |

**by_raceEthnicity**

| Group | n | Total weight | MAT mean | CD mean | MOR mean | Engagement mean |
|---|---:|---:|---:|---:|---:|---:|
| black | 10 | 9900 | 3.000 | 3.000 | 3.000 | 5.503 |
| hispanic | 5 | 6250 | 3.000 | 3.000 | 3.000 | 6.500 |
| white | 20 | 29950 | 3.000 | 3.000 | 3.000 | 6.500 |

**by_sex**

| Group | n | Total weight | MAT mean | CD mean | MOR mean | Engagement mean |
|---|---:|---:|---:|---:|---:|---:|
| female | 20 | 26100 | 3.000 | 3.000 | 3.000 | 6.500 |
| male | 15 | 20000 | 3.000 | 3.000 | 3.000 | 6.006 |

## 2012

- Rows: **35**; total weight: **42600** (range 870.00 → 1730.00)
- Engagement: mean 7.479, sd 1.482
- Moral-boundary intensity mean: 1.703

### Position-node marginals (1..5 scale)

| Node | Mean | SD | p10 | p50 | p90 | Mean salience |
|---|---:|---:|---:|---:|---:|---:|
| MAT | 3.000 | 0.000 | 3.000 | 3.000 | 3.000 | 1.000 |
| CD | 3.000 | 0.000 | 3.000 | 3.000 | 3.000 | 1.000 |
| CU | 3.000 | 0.000 | 3.000 | 3.000 | 3.000 | 1.000 |
| MOR | 3.000 | 0.000 | 3.000 | 3.000 | 3.000 | 1.000 |
| PRO | 3.000 | 0.000 | 3.000 | 3.000 | 3.000 | 1.000 |
| COM | 3.000 | 0.000 | 3.000 | 3.000 | 3.000 | 1.000 |
| ZS | 3.000 | 0.000 | 3.000 | 3.000 | 3.000 | 1.000 |
| ONT_H | 3.000 | 0.000 | 3.000 | 3.000 | 3.000 | 1.000 |
| ONT_S | 3.000 | 0.000 | 3.000 | 3.000 | 3.000 | 1.000 |

### Categorical-node distributions (6-bin)

| Node | Distribution | Mean salience |
|---|---|---:|
| EPS | [0.200, 0.300, 0.100, 0.150, 0.150, 0.100] | 1.000 |
| AES | [0.167, 0.167, 0.167, 0.167, 0.167, 0.167] | 0.470 |

### Moral-boundary mean salience (0..3 scale)

| Boundary | Mean salience |
|---|---:|
| national | 1.000 |
| ethnic_racial | 1.000 |
| religious | 1.478 |
| class | 0.970 |
| ideological | 1.227 |
| gender | 1.000 |
| political_camp | 1.658 |

### Low-order joints (5×5 weighted outer-product, normalized)

**MAT × CD** — `[0.040, 0.040, 0.040, 0.040, 0.040], [0.040, 0.040, 0.040, 0.040, 0.040], [0.040, 0.040, 0.040, 0.040, 0.040], [0.040, 0.040, 0.040, 0.040, 0.040], [0.040, 0.040, 0.040, 0.040, 0.040]`

**CD × CU** — `[0.040, 0.040, 0.040, 0.040, 0.040], [0.040, 0.040, 0.040, 0.040, 0.040], [0.040, 0.040, 0.040, 0.040, 0.040], [0.040, 0.040, 0.040, 0.040, 0.040], [0.040, 0.040, 0.040, 0.040, 0.040]`

**MOR × PRO** — `[0.040, 0.040, 0.040, 0.040, 0.040], [0.040, 0.040, 0.040, 0.040, 0.040], [0.040, 0.040, 0.040, 0.040, 0.040], [0.040, 0.040, 0.040, 0.040, 0.040], [0.040, 0.040, 0.040, 0.040, 0.040]`

**ENG × turnout-proxy** — `omitted`. Reason: SyntheticElectorateRow carries no turnout / abstention field — vote choice, abstention, candidate distance, and counterfactual outputs are downstream projections of the synthetic electorate, not source fields on the row contract. This joint will be filled when the downstream simulator publishes a per-row turnout / abstention projection.

### Breakouts

**by_state**

| Group | n | Total weight | MAT mean | CD mean | MOR mean | Engagement mean |
|---|---:|---:|---:|---:|---:|---:|
| CA | 5 | 5550 | 3.000 | 3.000 | 3.000 | 7.420 |
| FL | 5 | 7250 | 3.000 | 3.000 | 3.000 | 8.700 |
| GA | 5 | 5450 | 3.000 | 3.000 | 3.000 | 7.560 |
| NY | 5 | 6400 | 3.000 | 3.000 | 3.000 | 7.800 |
| OH | 5 | 4950 | 3.000 | 3.000 | 3.000 | 7.260 |
| PA | 5 | 4350 | 3.000 | 3.000 | 3.000 | 8.100 |
| TX | 5 | 8650 | 3.000 | 3.000 | 3.000 | 6.020 |

**by_ageBucket**

| Group | n | Total weight | MAT mean | CD mean | MOR mean | Engagement mean |
|---|---:|---:|---:|---:|---:|---:|
| 18-24 | 5 | 4350 | 3.000 | 3.000 | 3.000 | 8.100 |
| 35-44 | 15 | 19650 | 3.000 | 3.000 | 3.000 | 6.843 |
| 55-64 | 10 | 11350 | 3.000 | 3.000 | 3.000 | 7.564 |
| 65-74 | 5 | 7250 | 3.000 | 3.000 | 3.000 | 8.700 |

**by_raceEthnicity**

| Group | n | Total weight | MAT mean | CD mean | MOR mean | Engagement mean |
|---|---:|---:|---:|---:|---:|---:|
| asian | 5 | 5550 | 3.000 | 3.000 | 3.000 | 7.420 |
| black | 5 | 4950 | 3.000 | 3.000 | 3.000 | 7.260 |
| hispanic | 5 | 8650 | 3.000 | 3.000 | 3.000 | 6.020 |
| white | 20 | 23450 | 3.000 | 3.000 | 3.000 | 8.078 |

**by_sex**

| Group | n | Total weight | MAT mean | CD mean | MOR mean | Engagement mean |
|---|---:|---:|---:|---:|---:|---:|
| female | 15 | 16300 | 3.000 | 3.000 | 3.000 | 7.751 |
| male | 20 | 26300 | 3.000 | 3.000 | 3.000 | 7.311 |

## 2016

- Rows: **35**; total weight: **41550** (range 760.00 → 1520.00)
- Engagement: mean 8.365, sd 1.670
- Moral-boundary intensity mean: 1.655

### Position-node marginals (1..5 scale)

| Node | Mean | SD | p10 | p50 | p90 | Mean salience |
|---|---:|---:|---:|---:|---:|---:|
| MAT | 2.808 | 1.301 | 1.205 | 2.427 | 4.625 | 1.695 |
| CD | 2.786 | 1.261 | 1.205 | 3.000 | 4.306 | 1.739 |
| CU | 3.604 | 1.381 | 1.205 | 4.306 | 4.795 | 1.876 |
| MOR | 3.000 | 0.000 | 3.000 | 3.000 | 3.000 | 1.000 |
| PRO | 3.000 | 0.000 | 3.000 | 3.000 | 3.000 | 1.000 |
| COM | 3.000 | 0.000 | 3.000 | 3.000 | 3.000 | 1.000 |
| ZS | 3.000 | 0.000 | 3.000 | 3.000 | 3.000 | 1.000 |
| ONT_H | 3.000 | 0.000 | 3.000 | 3.000 | 3.000 | 1.000 |
| ONT_S | 3.000 | 0.000 | 3.000 | 3.000 | 3.000 | 1.000 |

### Categorical-node distributions (6-bin)

| Node | Distribution | Mean salience |
|---|---|---:|
| EPS | [0.200, 0.300, 0.100, 0.150, 0.150, 0.100] | 1.000 |
| AES | [0.167, 0.167, 0.167, 0.167, 0.167, 0.167] | 0.470 |

### Moral-boundary mean salience (0..3 scale)

| Boundary | Mean salience |
|---|---:|
| national | 1.058 |
| ethnic_racial | 1.000 |
| religious | 1.050 |
| class | 0.954 |
| ideological | 1.173 |
| gender | 1.000 |
| political_camp | 1.406 |

### Low-order joints (5×5 weighted outer-product, normalized)

**MAT × CD** — `[0.085, 0.071, 0.060, 0.015, 0.001], [0.092, 0.076, 0.037, 0.030, 0.008], [0.047, 0.048, 0.029, 0.038, 0.014], [0.020, 0.023, 0.026, 0.073, 0.041], [0.001, 0.002, 0.011, 0.094, 0.059]`

**CD × CU** — `[0.001, 0.014, 0.023, 0.075, 0.131], [0.001, 0.007, 0.019, 0.070, 0.122], [0.009, 0.007, 0.010, 0.054, 0.083], [0.089, 0.050, 0.023, 0.045, 0.041], [0.056, 0.032, 0.013, 0.013, 0.009]`

**MOR × PRO** — `[0.040, 0.040, 0.040, 0.040, 0.040], [0.040, 0.040, 0.040, 0.040, 0.040], [0.040, 0.040, 0.040, 0.040, 0.040], [0.040, 0.040, 0.040, 0.040, 0.040], [0.040, 0.040, 0.040, 0.040, 0.040]`

**ENG × turnout-proxy** — `omitted`. Reason: SyntheticElectorateRow carries no turnout / abstention field — vote choice, abstention, candidate distance, and counterfactual outputs are downstream projections of the synthetic electorate, not source fields on the row contract. This joint will be filled when the downstream simulator publishes a per-row turnout / abstention projection.

### Breakouts

**by_state**

| Group | n | Total weight | MAT mean | CD mean | MOR mean | Engagement mean |
|---|---:|---:|---:|---:|---:|---:|
| CA | 5 | 6700 | 3.254 | 3.261 | 3.000 | 9.040 |
| FL | 5 | 5950 | 2.561 | 1.796 | 3.000 | 7.340 |
| GA | 5 | 5500 | 2.004 | 2.605 | 3.000 | 7.560 |
| NY | 5 | 5100 | 3.233 | 2.938 | 3.000 | 9.340 |
| OH | 5 | 3800 | 3.130 | 3.036 | 3.000 | 7.040 |
| PA | 5 | 6900 | 1.923 | 2.409 | 3.000 | 8.500 |
| TX | 5 | 7600 | 3.550 | 3.389 | 3.000 | 9.040 |

**by_ageBucket**

| Group | n | Total weight | MAT mean | CD mean | MOR mean | Engagement mean |
|---|---:|---:|---:|---:|---:|---:|
| 18-24 | 10 | 10500 | 3.209 | 3.180 | 3.000 | 8.316 |
| 35-44 | 5 | 5100 | 3.233 | 2.938 | 3.000 | 9.340 |
| 55-64 | 10 | 11450 | 2.293 | 2.184 | 3.000 | 7.446 |
| 65-74 | 10 | 14500 | 2.776 | 2.923 | 3.000 | 8.783 |

**by_raceEthnicity**

| Group | n | Total weight | MAT mean | CD mean | MOR mean | Engagement mean |
|---|---:|---:|---:|---:|---:|---:|
| black | 5 | 5500 | 2.004 | 2.605 | 3.000 | 7.560 |
| hispanic | 10 | 12650 | 2.928 | 2.572 | 3.000 | 8.240 |
| white | 20 | 23400 | 2.933 | 2.945 | 3.000 | 8.621 |

**by_sex**

| Group | n | Total weight | MAT mean | CD mean | MOR mean | Engagement mean |
|---|---:|---:|---:|---:|---:|---:|
| female | 20 | 22850 | 2.850 | 2.727 | 3.000 | 7.908 |
| male | 15 | 18700 | 2.757 | 2.859 | 3.000 | 8.923 |

## 2020

- Rows: **35**; total weight: **44200** (range 880.00 → 1480.00)
- Engagement: mean 8.129, sd 1.917
- Moral-boundary intensity mean: 1.636

### Position-node marginals (1..5 scale)

| Node | Mean | SD | p10 | p50 | p90 | Mean salience |
|---|---:|---:|---:|---:|---:|---:|
| MAT | 3.000 | 0.000 | 3.000 | 3.000 | 3.000 | 1.000 |
| CD | 2.462 | 1.237 | 1.205 | 2.331 | 4.306 | 1.786 |
| CU | 3.000 | 0.000 | 3.000 | 3.000 | 3.000 | 1.000 |
| MOR | 3.000 | 0.000 | 3.000 | 3.000 | 3.000 | 1.000 |
| PRO | 3.000 | 0.000 | 3.000 | 3.000 | 3.000 | 1.000 |
| COM | 3.000 | 0.000 | 3.000 | 3.000 | 3.000 | 1.000 |
| ZS | 3.000 | 0.000 | 3.000 | 3.000 | 3.000 | 1.000 |
| ONT_H | 3.000 | 0.000 | 3.000 | 3.000 | 3.000 | 1.000 |
| ONT_S | 3.000 | 0.000 | 3.000 | 3.000 | 3.000 | 1.000 |

### Categorical-node distributions (6-bin)

| Node | Distribution | Mean salience |
|---|---|---:|
| EPS | [0.200, 0.300, 0.100, 0.150, 0.150, 0.100] | 1.000 |
| AES | [0.167, 0.167, 0.167, 0.167, 0.167, 0.167] | 0.470 |

### Moral-boundary mean salience (0..3 scale)

| Boundary | Mean salience |
|---|---:|
| national | 1.000 |
| ethnic_racial | 1.000 |
| religious | 1.119 |
| class | 1.037 |
| ideological | 1.228 |
| gender | 1.000 |
| political_camp | 1.594 |

### Low-order joints (5×5 weighted outer-product, normalized)

**MAT × CD** — `[0.065, 0.051, 0.028, 0.037, 0.018], [0.065, 0.051, 0.028, 0.037, 0.018], [0.065, 0.051, 0.028, 0.037, 0.018], [0.065, 0.051, 0.028, 0.037, 0.018], [0.065, 0.051, 0.028, 0.037, 0.018]`

**CD × CU** — `[0.065, 0.065, 0.065, 0.065, 0.065], [0.051, 0.051, 0.051, 0.051, 0.051], [0.028, 0.028, 0.028, 0.028, 0.028], [0.037, 0.037, 0.037, 0.037, 0.037], [0.018, 0.018, 0.018, 0.018, 0.018]`

**MOR × PRO** — `[0.040, 0.040, 0.040, 0.040, 0.040], [0.040, 0.040, 0.040, 0.040, 0.040], [0.040, 0.040, 0.040, 0.040, 0.040], [0.040, 0.040, 0.040, 0.040, 0.040], [0.040, 0.040, 0.040, 0.040, 0.040]`

**ENG × turnout-proxy** — `omitted`. Reason: SyntheticElectorateRow carries no turnout / abstention field — vote choice, abstention, candidate distance, and counterfactual outputs are downstream projections of the synthetic electorate, not source fields on the row contract. This joint will be filled when the downstream simulator publishes a per-row turnout / abstention projection.

### Breakouts

**by_state**

| Group | n | Total weight | MAT mean | CD mean | MOR mean | Engagement mean |
|---|---:|---:|---:|---:|---:|---:|
| CA | 5 | 7400 | 3.000 | 2.246 | 3.000 | 9.200 |
| FL | 5 | 6850 | 3.000 | 2.671 | 3.000 | 8.040 |
| GA | 5 | 5850 | 3.000 | 2.014 | 3.000 | 8.200 |
| NY | 5 | 4400 | 3.000 | 2.119 | 3.000 | 6.600 |
| OH | 5 | 6200 | 3.000 | 3.529 | 3.000 | 6.700 |
| PA | 5 | 7050 | 3.000 | 2.148 | 3.000 | 9.180 |
| TX | 5 | 6450 | 3.000 | 2.446 | 3.000 | 8.200 |

**by_ageBucket**

| Group | n | Total weight | MAT mean | CD mean | MOR mean | Engagement mean |
|---|---:|---:|---:|---:|---:|---:|
| 18-24 | 5 | 4400 | 3.000 | 2.119 | 3.000 | 6.600 |
| 35-44 | 10 | 12300 | 3.000 | 2.241 | 3.000 | 8.200 |
| 55-64 | 10 | 14450 | 3.000 | 2.198 | 3.000 | 9.190 |
| 65-74 | 10 | 13050 | 3.000 | 3.078 | 3.000 | 7.403 |

**by_raceEthnicity**

| Group | n | Total weight | MAT mean | CD mean | MOR mean | Engagement mean |
|---|---:|---:|---:|---:|---:|---:|
| asian | 5 | 4400 | 3.000 | 2.119 | 3.000 | 6.600 |
| black | 5 | 5850 | 3.000 | 2.014 | 3.000 | 8.200 |
| hispanic | 5 | 6850 | 3.000 | 2.671 | 3.000 | 8.040 |
| white | 20 | 27100 | 3.000 | 2.562 | 3.000 | 8.385 |

**by_sex**

| Group | n | Total weight | MAT mean | CD mean | MOR mean | Engagement mean |
|---|---:|---:|---:|---:|---:|---:|
| female | 20 | 24850 | 3.000 | 2.661 | 3.000 | 7.796 |
| male | 15 | 19350 | 3.000 | 2.207 | 3.000 | 8.557 |

## 2024

- Rows: **35**; total weight: **40050** (range 850.00 → 1500.00)
- Engagement: mean 7.263, sd 1.498
- Moral-boundary intensity mean: 1.796

### Position-node marginals (1..5 scale)

| Node | Mean | SD | p10 | p50 | p90 | Mean salience |
|---|---:|---:|---:|---:|---:|---:|
| MAT | 3.000 | 0.000 | 3.000 | 3.000 | 3.000 | 1.000 |
| CD | 3.000 | 0.000 | 3.000 | 3.000 | 3.000 | 1.000 |
| CU | 3.000 | 0.000 | 3.000 | 3.000 | 3.000 | 1.000 |
| MOR | 3.000 | 0.000 | 3.000 | 3.000 | 3.000 | 1.000 |
| PRO | 3.000 | 0.000 | 3.000 | 3.000 | 3.000 | 1.000 |
| COM | 3.000 | 0.000 | 3.000 | 3.000 | 3.000 | 1.000 |
| ZS | 3.000 | 0.000 | 3.000 | 3.000 | 3.000 | 1.000 |
| ONT_H | 3.000 | 0.000 | 3.000 | 3.000 | 3.000 | 1.000 |
| ONT_S | 3.000 | 0.000 | 3.000 | 3.000 | 3.000 | 1.000 |

### Categorical-node distributions (6-bin)

| Node | Distribution | Mean salience |
|---|---|---:|
| EPS | [0.200, 0.300, 0.100, 0.150, 0.150, 0.100] | 1.000 |
| AES | [0.167, 0.167, 0.167, 0.167, 0.167, 0.167] | 0.470 |

### Moral-boundary mean salience (0..3 scale)

| Boundary | Mean salience |
|---|---:|
| national | 1.000 |
| ethnic_racial | 1.000 |
| religious | 1.305 |
| class | 0.886 |
| ideological | 1.522 |
| gender | 1.000 |
| political_camp | 1.955 |

### Low-order joints (5×5 weighted outer-product, normalized)

**MAT × CD** — `[0.040, 0.040, 0.040, 0.040, 0.040], [0.040, 0.040, 0.040, 0.040, 0.040], [0.040, 0.040, 0.040, 0.040, 0.040], [0.040, 0.040, 0.040, 0.040, 0.040], [0.040, 0.040, 0.040, 0.040, 0.040]`

**CD × CU** — `[0.040, 0.040, 0.040, 0.040, 0.040], [0.040, 0.040, 0.040, 0.040, 0.040], [0.040, 0.040, 0.040, 0.040, 0.040], [0.040, 0.040, 0.040, 0.040, 0.040], [0.040, 0.040, 0.040, 0.040, 0.040]`

**MOR × PRO** — `[0.040, 0.040, 0.040, 0.040, 0.040], [0.040, 0.040, 0.040, 0.040, 0.040], [0.040, 0.040, 0.040, 0.040, 0.040], [0.040, 0.040, 0.040, 0.040, 0.040], [0.040, 0.040, 0.040, 0.040, 0.040]`

**ENG × turnout-proxy** — `omitted`. Reason: SyntheticElectorateRow carries no turnout / abstention field — vote choice, abstention, candidate distance, and counterfactual outputs are downstream projections of the synthetic electorate, not source fields on the row contract. This joint will be filled when the downstream simulator publishes a per-row turnout / abstention projection.

### Breakouts

**by_state**

| Group | n | Total weight | MAT mean | CD mean | MOR mean | Engagement mean |
|---|---:|---:|---:|---:|---:|---:|
| CA | 5 | 6300 | 3.000 | 3.000 | 3.000 | 8.260 |
| FL | 5 | 7500 | 3.000 | 3.000 | 3.000 | 6.960 |
| GA | 5 | 4250 | 3.000 | 3.000 | 3.000 | 6.620 |
| NY | 5 | 5400 | 3.000 | 3.000 | 3.000 | 7.560 |
| OH | 5 | 6100 | 3.000 | 3.000 | 3.000 | 7.800 |
| PA | 5 | 5650 | 3.000 | 3.000 | 3.000 | 6.660 |
| TX | 5 | 4850 | 3.000 | 3.000 | 3.000 | 6.700 |

**by_ageBucket**

| Group | n | Total weight | MAT mean | CD mean | MOR mean | Engagement mean |
|---|---:|---:|---:|---:|---:|---:|
| 18-24 | 10 | 9100 | 3.000 | 3.000 | 3.000 | 6.663 |
| 35-44 | 10 | 11950 | 3.000 | 3.000 | 3.000 | 7.504 |
| 55-64 | 10 | 11500 | 3.000 | 3.000 | 3.000 | 7.687 |
| 65-74 | 5 | 7500 | 3.000 | 3.000 | 3.000 | 6.960 |

**by_raceEthnicity**

| Group | n | Total weight | MAT mean | CD mean | MOR mean | Engagement mean |
|---|---:|---:|---:|---:|---:|---:|
| black | 10 | 9650 | 3.000 | 3.000 | 3.000 | 7.146 |
| hispanic | 10 | 11150 | 3.000 | 3.000 | 3.000 | 7.581 |
| white | 15 | 19250 | 3.000 | 3.000 | 3.000 | 7.138 |

**by_sex**

| Group | n | Total weight | MAT mean | CD mean | MOR mean | Engagement mean |
|---|---:|---:|---:|---:|---:|---:|
| female | 15 | 16350 | 3.000 | 3.000 | 3.000 | 7.394 |
| male | 20 | 23700 | 3.000 | 3.000 | 3.000 | 7.173 |

## Forbidden keys (verified absent in aggregate output)

- `predictedVote`
- `candidateDistance`
- `voteProbability`
- `abstainProbability`
- `alpha_year`
- `predictedAbstainCount`
- `stageBResult`

## Aggregate

- Total invariant checks: **10/10**
- Total input rows: 175
- Years aggregated: 5
