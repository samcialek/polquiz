# Simulator Scaffold Smoke

Run at 2026-05-02T21:30:57.658Z. Year: 2020.

Three test cases over **synthetic agents only** (no CES/ANES). The simulator runs each agent's signature samples through `respondentVoteChoice` and aggregates with population weights. This validates the pipeline plumbing before any real survey data lands.

## Aggregation invariant checks

| # | Check | Pass | Detail |
|---|---|:--:|---|
| 1 | test1: weighted sum equals total weight | ✓ | sum=121.000000 total=121.000000 diff=0.00e+0 |
| 2 | test2: weighted sum equals total weight | ✓ | sum=197.000000 total=197.000000 diff=0.00e+0 |
| 3 | test3: weighted sum equals total weight | ✓ | sum=121.000000 total=121.000000 diff=7.96e-13 |
| 4 | test2: R-bias raises R share vs uniform | ✓ | t1.R=37.6% t2.R=64.4% delta=26.8% |
| 5 | test1: totalSamples == totalAgents (N=1) | ✓ | samples=121 agents=121 |
| 6 | test3: totalSamples == totalAgents * 10 | ✓ | samples=1210 agents=121 |
| 7 | test3: jittered D share within 10pt of centroid result | ✓ | t1.D=62.4% t3.D=63.3% delta=0.9% |
| 8 | test3: jittered result differs from centroid (jitter actually applies) | ✓ | t1.D=62.4% t3.D=63.3% |

**Overall: ✓ ALL PASS**

### Test 1 — uniform weight, N=1 sample

- Total agents: 121
- Total samples evaluated: 121
- Total weight: 121.00
- Turnout rate: 83.5%
- Avg samples per agent: 1.00

| Bucket | Weighted | Share | Share of turnout |
|---|---:|---:|---:|
| D | 63.00 | 52.1% | 62.4% |
| R | 38.00 | 31.4% | 37.6% |
| T | 0.00 | 0.0% | 0.0% |
| O | 0.00 | 0.0% | 0.0% |
| Abstain | 20.00 | 16.5% | — |

Per-candidate:

| Candidate | Party | Weighted | Share of turnout |
|---|---|---:|---:|
| Biden | Democratic | 63.00 | 62.4% |
| Trump | Republican | 38.00 | 37.6% |

### Test 2 — R-leaning archetypes weighted 3×

- Total agents: 121
- Total samples evaluated: 121
- Total weight: 197.00
- Turnout rate: 89.8%
- Avg samples per agent: 1.00

| Bucket | Weighted | Share | Share of turnout |
|---|---:|---:|---:|
| D | 63.00 | 32.0% | 35.6% |
| R | 114.00 | 57.9% | 64.4% |
| T | 0.00 | 0.0% | 0.0% |
| O | 0.00 | 0.0% | 0.0% |
| Abstain | 20.00 | 10.2% | — |

Per-candidate:

| Candidate | Party | Weighted | Share of turnout |
|---|---|---:|---:|
| Biden | Democratic | 63.00 | 35.6% |
| Trump | Republican | 114.00 | 64.4% |

### Test 3 — jittered posteriors (N=10, σ=0.4)

- Total agents: 121
- Total samples evaluated: 1210
- Total weight: 121.00
- Turnout rate: 85.5%
- Avg samples per agent: 10.00

| Bucket | Weighted | Share | Share of turnout |
|---|---:|---:|---:|
| D | 65.50 | 54.1% | 63.3% |
| R | 38.00 | 31.4% | 36.7% |
| T | 0.00 | 0.0% | 0.0% |
| O | 0.00 | 0.0% | 0.0% |
| Abstain | 17.50 | 14.5% | — |

Per-candidate:

| Candidate | Party | Weighted | Share of turnout |
|---|---|---:|---:|
| Biden | Democratic | 65.50 | 63.3% |
| Trump | Republican | 38.00 | 36.7% |
