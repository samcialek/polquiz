# Coalition Decomposition Smoke

Run at 2026-05-02T22:39:52.491Z. Year: 2020. Synthetic agents only.

Three test cases verify that subgroup aggregation is correct under: a realistic mixed electorate, a degenerate uniform-white electorate (test for absence of unrelated subgroups), and a partial-demographics electorate (test for coverage flagging).

## Invariant checks

| # | Check | Pass | Detail |
|---|---|:--:|---|
| 1 | Mixed: race subgroups partition total weight | ✓ | sum=121.00 total=121.00 |
| 2 | Mixed: white-college + white-non-college == race:white | ✓ | 34.00 + 39.00 = 73.00 vs whites=73.00 |
| 3 | Mixed: race:white D+R+T+O+abstain shares sum to 1.0 | ✓ | sum=1.000000 |
| 4 | Mixed: race:Black D+R+T+O+abstain shares sum to 1.0 | ✓ | sum=1.000000 |
| 5 | Mixed: race:Latino D+R+T+O+abstain shares sum to 1.0 | ✓ | sum=1.000000 |
| 6 | Mixed: race:Asian D+R+T+O+abstain shares sum to 1.0 | ✓ | sum=1.000000 |
| 7 | Mixed: age subgroups partition total weight | ✓ | sum=121.00 total=121.00 |
| 8 | Uniform-white: race:white = 100% of total weight | ✓ | white=121.00 total=121.00 |
| 9 | Uniform-white: no race:Black / race:Latino subgroups exist | ✓ | Black=absent Latino=absent |
| 10 | Uniform-white: white-college = 100% of total weight | ✓ | whiteCol=121.00 |
| 11 | Partial-demos: total electorate weight matches agent count | ✓ | total=121.00 agents=121 |
| 12 | Partial-demos: coverage notes mention missing demographics | ✓ | 61 of 121 agents (50.4%) had no demographics — excluded from all subgroups. |
| 13 | Partial-demos: race subgroups sum to ~half the total weight | ✓ | raceSum=60.00 expected≈60.50 |

**Overall: ✓ ALL PASS** (13/13)

### Test M — mixed demographics across 121 archetypes

Total electorate weight: 121.00. Subgroups: 31.

| Subgroup | Agents | Weight | Share | Turnout | D | R | T | O |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| edu:non-college | 77 | 77.0 | 63.6% | 79.2% | 63.9% | 36.1% | 0.0% | 0.0% |
| race:white | 73 | 73.0 | 60.3% | 86.3% | 63.5% | 36.5% | 0.0% | 0.0% |
| gender:F | 62 | 62.0 | 51.2% | 79.0% | 59.2% | 40.8% | 0.0% | 0.0% |
| gender:M | 59 | 59.0 | 48.8% | 88.1% | 65.4% | 34.6% | 0.0% | 0.0% |
| geo:suburban | 59 | 59.0 | 48.8% | 84.7% | 62.0% | 38.0% | 0.0% | 0.0% |
| age:45-64 | 55 | 55.0 | 45.5% | 81.8% | 60.0% | 40.0% | 0.0% | 0.0% |
| edu:college | 44 | 44.0 | 36.4% | 90.9% | 60.0% | 40.0% | 0.0% | 0.0% |
| white-non-college | 39 | 39.0 | 32.2% | 82.1% | 65.6% | 34.4% | 0.0% | 0.0% |
| white-college | 34 | 34.0 | 28.1% | 91.2% | 61.3% | 38.7% | 0.0% | 0.0% |
| geo:rural | 32 | 32.0 | 26.4% | 81.3% | 57.7% | 42.3% | 0.0% | 0.0% |
| region:Midwest | 32 | 32.0 | 26.4% | 81.3% | 57.7% | 42.3% | 0.0% | 0.0% |
| age:30-44 | 31 | 31.0 | 25.6% | 83.9% | 69.2% | 30.8% | 0.0% | 0.0% |
| evangelical | 30 | 30.0 | 24.8% | 83.3% | 68.0% | 32.0% | 0.0% | 0.0% |
| geo:urban | 30 | 30.0 | 24.8% | 83.3% | 68.0% | 32.0% | 0.0% | 0.0% |
| region:Northeast | 30 | 30.0 | 24.8% | 83.3% | 68.0% | 32.0% | 0.0% | 0.0% |
| region:West | 30 | 30.0 | 24.8% | 76.7% | 60.9% | 39.1% | 0.0% | 0.0% |
| region:South | 29 | 29.0 | 24.0% | 93.1% | 63.0% | 37.0% | 0.0% | 0.0% |
| race:Latino | 23 | 23.0 | 19.0% | 82.6% | 57.9% | 42.1% | 0.0% | 0.0% |
| age:18-29 | 19 | 19.0 | 15.7% | 84.2% | 62.5% | 37.5% | 0.0% | 0.0% |
| age:65+ | 16 | 16.0 | 13.2% | 87.5% | 57.1% | 42.9% | 0.0% | 0.0% |
| state:AZ | 16 | 16.0 | 13.2% | 93.8% | 46.7% | 53.3% | 0.0% | 0.0% |
| state:NY | 16 | 16.0 | 13.2% | 68.8% | 72.7% | 27.3% | 0.0% | 0.0% |
| state:CA | 15 | 15.0 | 12.4% | 86.7% | 92.3% | 7.7% | 0.0% | 0.0% |
| state:FL | 15 | 15.0 | 12.4% | 86.7% | 69.2% | 30.8% | 0.0% | 0.0% |
| state:OH | 15 | 15.0 | 12.4% | 73.3% | 54.5% | 45.5% | 0.0% | 0.0% |
| state:PA | 15 | 15.0 | 12.4% | 80.0% | 41.7% | 58.3% | 0.0% | 0.0% |
| state:TX | 15 | 15.0 | 12.4% | 80.0% | 66.7% | 33.3% | 0.0% | 0.0% |
| state:GA | 14 | 14.0 | 11.6% | 100.0% | 57.1% | 42.9% | 0.0% | 0.0% |
| union | 14 | 14.0 | 11.6% | 92.9% | 61.5% | 38.5% | 0.0% | 0.0% |
| race:Black | 13 | 13.0 | 10.7% | 76.9% | 80.0% | 20.0% | 0.0% | 0.0% |
| race:Asian | 12 | 12.0 | 9.9% | 75.0% | 44.4% | 55.6% | 0.0% | 0.0% |

### Test W — uniform white-college 30-44 F across 121 archetypes

Total electorate weight: 121.00. Subgroups: 5.

| Subgroup | Agents | Weight | Share | Turnout | D | R | T | O |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| age:30-44 | 121 | 121.0 | 100.0% | 83.5% | 62.4% | 37.6% | 0.0% | 0.0% |
| edu:college | 121 | 121.0 | 100.0% | 83.5% | 62.4% | 37.6% | 0.0% | 0.0% |
| gender:F | 121 | 121.0 | 100.0% | 83.5% | 62.4% | 37.6% | 0.0% | 0.0% |
| race:white | 121 | 121.0 | 100.0% | 83.5% | 62.4% | 37.6% | 0.0% | 0.0% |
| white-college | 121 | 121.0 | 100.0% | 83.5% | 62.4% | 37.6% | 0.0% | 0.0% |

### Test P — half the agents missing demographics

Total electorate weight: 121.00. Subgroups: 31.

Coverage notes:
- 61 of 121 agents (50.4%) had no demographics — excluded from all subgroups.

| Subgroup | Agents | Weight | Share | Turnout | D | R | T | O |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| edu:non-college | 40 | 40.0 | 33.1% | 82.5% | 60.6% | 39.4% | 0.0% | 0.0% |
| age:45-64 | 36 | 36.0 | 29.8% | 80.6% | 55.2% | 44.8% | 0.0% | 0.0% |
| race:white | 36 | 36.0 | 29.8% | 86.1% | 67.7% | 32.3% | 0.0% | 0.0% |
| gender:F | 35 | 35.0 | 28.9% | 74.3% | 53.8% | 46.2% | 0.0% | 0.0% |
| geo:suburban | 27 | 27.0 | 22.3% | 81.5% | 63.6% | 36.4% | 0.0% | 0.0% |
| gender:M | 25 | 25.0 | 20.7% | 96.0% | 70.8% | 29.2% | 0.0% | 0.0% |
| edu:college | 20 | 20.0 | 16.5% | 85.0% | 64.7% | 35.3% | 0.0% | 0.0% |
| geo:rural | 20 | 20.0 | 16.5% | 80.0% | 50.0% | 50.0% | 0.0% | 0.0% |
| region:Midwest | 20 | 20.0 | 16.5% | 80.0% | 50.0% | 50.0% | 0.0% | 0.0% |
| white-non-college | 20 | 20.0 | 16.5% | 90.0% | 66.7% | 33.3% | 0.0% | 0.0% |
| white-college | 16 | 16.0 | 13.2% | 81.3% | 69.2% | 30.8% | 0.0% | 0.0% |
| region:West | 15 | 15.0 | 12.4% | 66.7% | 60.0% | 40.0% | 0.0% | 0.0% |
| age:30-44 | 14 | 14.0 | 11.6% | 78.6% | 72.7% | 27.3% | 0.0% | 0.0% |
| evangelical | 13 | 13.0 | 10.7% | 92.3% | 75.0% | 25.0% | 0.0% | 0.0% |
| geo:urban | 13 | 13.0 | 10.7% | 92.3% | 75.0% | 25.0% | 0.0% | 0.0% |
| region:Northeast | 13 | 13.0 | 10.7% | 92.3% | 75.0% | 25.0% | 0.0% | 0.0% |
| race:Latino | 12 | 12.0 | 9.9% | 91.7% | 54.5% | 45.5% | 0.0% | 0.0% |
| region:South | 12 | 12.0 | 9.9% | 100.0% | 66.7% | 33.3% | 0.0% | 0.0% |
| state:AZ | 11 | 11.0 | 9.1% | 90.9% | 40.0% | 60.0% | 0.0% | 0.0% |
| state:NY | 9 | 9.0 | 7.4% | 66.7% | 66.7% | 33.3% | 0.0% | 0.0% |
| state:OH | 9 | 9.0 | 7.4% | 66.7% | 50.0% | 50.0% | 0.0% | 0.0% |
| state:FL | 8 | 8.0 | 6.6% | 100.0% | 75.0% | 25.0% | 0.0% | 0.0% |
| race:Asian | 7 | 7.0 | 5.8% | 57.1% | 25.0% | 75.0% | 0.0% | 0.0% |
| state:CA | 7 | 7.0 | 5.8% | 100.0% | 85.7% | 14.3% | 0.0% | 0.0% |
| state:PA | 6 | 6.0 | 5.0% | 83.3% | 60.0% | 40.0% | 0.0% | 0.0% |
| state:TX | 6 | 6.0 | 5.0% | 66.7% | 75.0% | 25.0% | 0.0% | 0.0% |
| union | 6 | 6.0 | 5.0% | 83.3% | 40.0% | 60.0% | 0.0% | 0.0% |
| age:18-29 | 5 | 5.0 | 4.1% | 100.0% | 80.0% | 20.0% | 0.0% | 0.0% |
| age:65+ | 5 | 5.0 | 4.1% | 100.0% | 60.0% | 40.0% | 0.0% | 0.0% |
| race:Black | 5 | 5.0 | 4.1% | 80.0% | 75.0% | 25.0% | 0.0% | 0.0% |
| state:GA | 4 | 4.0 | 3.3% | 100.0% | 50.0% | 50.0% | 0.0% | 0.0% |
