# Coalition Gate Smoke

Run at 2026-05-02T23:02:25.185Z. Year: 2020. Synthetic benchmarks only.

Three test cases verify gate behavior under: a benchmarks-mirror-predictions baseline, a single-subgroup perturbation, and a mismatched-coverage scenario.

## Invariant checks

| # | Check | Pass | Detail |
|---|---|:--:|---|
| 1 | A: all-pass gate passes overall | ✓ | passed=true failedCount=0 |
| 2 | A: zero metric-checked subgroups fail | ✓ | failedSubgroups=(none) |
| 3 | A: max |delta| across all metrics is ~0 | ✓ | maxAbsDelta=0.00e+0pp |
| 4 | F: one-fail gate fails overall | ✓ | passed=false |
| 5 | F: exactly one subgroup fails (white-college) | ✓ | failedSubgroups=white-college |
| 6 | F: white-college D delta is ~+20pp | ✓ | D delta=+20.0pp |
| 7 | F: all subgroups other than white-college still pass | ✓ | otherFails=(none) |
| 8 | M: missing-prediction subgroup flagged | ✓ | inMissingPredictions=true passed=false reason=no_prediction |
| 9 | M: missing-benchmark subgroups flagged but pass (default) | ✓ | Black missingBench=true pass=true; Latino missingBench=true pass=true |
| 10 | M: overall gate fails because missing prediction is required | ✓ | passed=false |

**Overall: ✓ ALL PASS** (10/10)

### Test A — all-pass mirror benchmarks

**Overall: ✓ PASS** — 12 passed, 0 failed across 12 subgroups (12 actually metric-checked).

| Subgroup | Pass | Status | Metrics |
|---|:--:|---|---|
| age:18-29 | ✓ | OK | D pred=62.5% bench=62.5% Δ=+0.0pp (tol ±7pp) ✓<br>R pred=37.5% bench=37.5% Δ=+0.0pp (tol ±7pp) ✓ |
| age:30-44 | ✓ | OK | D pred=69.2% bench=69.2% Δ=+0.0pp (tol ±7pp) ✓<br>R pred=30.8% bench=30.8% Δ=+0.0pp (tol ±7pp) ✓ |
| age:45-64 | ✓ | OK | D pred=60.0% bench=60.0% Δ=+0.0pp (tol ±7pp) ✓<br>R pred=40.0% bench=40.0% Δ=+0.0pp (tol ±7pp) ✓ |
| age:65+ | ✓ | OK | D pred=57.1% bench=57.1% Δ=+0.0pp (tol ±7pp) ✓<br>R pred=42.9% bench=42.9% Δ=+0.0pp (tol ±7pp) ✓ |
| edu:college | ✓ | OK | D pred=60.0% bench=60.0% Δ=+0.0pp (tol ±7pp) ✓<br>R pred=40.0% bench=40.0% Δ=+0.0pp (tol ±7pp) ✓ |
| edu:non-college | ✓ | OK | D pred=63.9% bench=63.9% Δ=+0.0pp (tol ±7pp) ✓<br>R pred=36.1% bench=36.1% Δ=+0.0pp (tol ±7pp) ✓ |
| race:Asian | ✓ | OK | D pred=44.4% bench=44.4% Δ=+0.0pp (tol ±7pp) ✓<br>R pred=55.6% bench=55.6% Δ=+0.0pp (tol ±7pp) ✓ |
| race:Black | ✓ | OK | D pred=80.0% bench=80.0% Δ=+0.0pp (tol ±7pp) ✓<br>R pred=20.0% bench=20.0% Δ=+0.0pp (tol ±7pp) ✓ |
| race:Latino | ✓ | OK | D pred=57.9% bench=57.9% Δ=+0.0pp (tol ±7pp) ✓<br>R pred=42.1% bench=42.1% Δ=+0.0pp (tol ±7pp) ✓ |
| race:white | ✓ | OK | D pred=63.5% bench=63.5% Δ=+0.0pp (tol ±7pp) ✓<br>R pred=36.5% bench=36.5% Δ=+0.0pp (tol ±7pp) ✓ |
| white-college | ✓ | OK | D pred=61.3% bench=61.3% Δ=+0.0pp (tol ±7pp) ✓<br>R pred=38.7% bench=38.7% Δ=+0.0pp (tol ±7pp) ✓ |
| white-non-college | ✓ | OK | D pred=65.6% bench=65.6% Δ=+0.0pp (tol ±7pp) ✓<br>R pred=34.4% bench=34.4% Δ=+0.0pp (tol ±7pp) ✓ |

### Test F — white-college D pushed +20pp

**Overall: ✗ FAIL** — 11 passed, 1 failed across 12 subgroups (12 actually metric-checked).

| Subgroup | Pass | Status | Metrics |
|---|:--:|---|---|
| white-college | ✗ | delta exceeds tolerance | D pred=61.3% bench=41.3% Δ=+20.0pp (tol ±7pp) ✗<br>R pred=38.7% bench=58.7% Δ=-20.0pp (tol ±7pp) ✗ |
| age:18-29 | ✓ | OK | D pred=62.5% bench=62.5% Δ=+0.0pp (tol ±7pp) ✓<br>R pred=37.5% bench=37.5% Δ=+0.0pp (tol ±7pp) ✓ |
| age:30-44 | ✓ | OK | D pred=69.2% bench=69.2% Δ=+0.0pp (tol ±7pp) ✓<br>R pred=30.8% bench=30.8% Δ=+0.0pp (tol ±7pp) ✓ |
| age:45-64 | ✓ | OK | D pred=60.0% bench=60.0% Δ=+0.0pp (tol ±7pp) ✓<br>R pred=40.0% bench=40.0% Δ=+0.0pp (tol ±7pp) ✓ |
| age:65+ | ✓ | OK | D pred=57.1% bench=57.1% Δ=+0.0pp (tol ±7pp) ✓<br>R pred=42.9% bench=42.9% Δ=+0.0pp (tol ±7pp) ✓ |
| edu:college | ✓ | OK | D pred=60.0% bench=60.0% Δ=+0.0pp (tol ±7pp) ✓<br>R pred=40.0% bench=40.0% Δ=+0.0pp (tol ±7pp) ✓ |
| edu:non-college | ✓ | OK | D pred=63.9% bench=63.9% Δ=+0.0pp (tol ±7pp) ✓<br>R pred=36.1% bench=36.1% Δ=+0.0pp (tol ±7pp) ✓ |
| race:Asian | ✓ | OK | D pred=44.4% bench=44.4% Δ=+0.0pp (tol ±7pp) ✓<br>R pred=55.6% bench=55.6% Δ=+0.0pp (tol ±7pp) ✓ |
| race:Black | ✓ | OK | D pred=80.0% bench=80.0% Δ=+0.0pp (tol ±7pp) ✓<br>R pred=20.0% bench=20.0% Δ=+0.0pp (tol ±7pp) ✓ |
| race:Latino | ✓ | OK | D pred=57.9% bench=57.9% Δ=+0.0pp (tol ±7pp) ✓<br>R pred=42.1% bench=42.1% Δ=+0.0pp (tol ±7pp) ✓ |
| race:white | ✓ | OK | D pred=63.5% bench=63.5% Δ=+0.0pp (tol ±7pp) ✓<br>R pred=36.5% bench=36.5% Δ=+0.0pp (tol ±7pp) ✓ |
| white-non-college | ✓ | OK | D pred=65.6% bench=65.6% Δ=+0.0pp (tol ±7pp) ✓<br>R pred=34.4% bench=34.4% Δ=+0.0pp (tol ±7pp) ✓ |

### Test M — partial benchmark coverage

**Overall: ✗ FAIL** — 12 passed, 1 failed across 13 subgroups (10 actually metric-checked).

Missing benchmarks (predicted, no benchmark provided): 2 — race:Latino, race:Black

Missing predictions (benchmark exists, no subgroup in decomposition): 1 — race:NotARealRace

| Subgroup | Pass | Status | Metrics |
|---|:--:|---|---|
| race:Black | ✓ | no benchmark |  |
| race:Latino | ✓ | no benchmark |  |
| race:NotARealRace | ✗ | no prediction |  |
| age:18-29 | ✓ | OK | D pred=62.5% bench=62.5% Δ=+0.0pp (tol ±7pp) ✓<br>R pred=37.5% bench=37.5% Δ=+0.0pp (tol ±7pp) ✓ |
| age:30-44 | ✓ | OK | D pred=69.2% bench=69.2% Δ=+0.0pp (tol ±7pp) ✓<br>R pred=30.8% bench=30.8% Δ=+0.0pp (tol ±7pp) ✓ |
| age:45-64 | ✓ | OK | D pred=60.0% bench=60.0% Δ=+0.0pp (tol ±7pp) ✓<br>R pred=40.0% bench=40.0% Δ=+0.0pp (tol ±7pp) ✓ |
| age:65+ | ✓ | OK | D pred=57.1% bench=57.1% Δ=+0.0pp (tol ±7pp) ✓<br>R pred=42.9% bench=42.9% Δ=+0.0pp (tol ±7pp) ✓ |
| edu:college | ✓ | OK | D pred=60.0% bench=60.0% Δ=+0.0pp (tol ±7pp) ✓<br>R pred=40.0% bench=40.0% Δ=+0.0pp (tol ±7pp) ✓ |
| edu:non-college | ✓ | OK | D pred=63.9% bench=63.9% Δ=+0.0pp (tol ±7pp) ✓<br>R pred=36.1% bench=36.1% Δ=+0.0pp (tol ±7pp) ✓ |
| race:Asian | ✓ | OK | D pred=44.4% bench=44.4% Δ=+0.0pp (tol ±7pp) ✓<br>R pred=55.6% bench=55.6% Δ=+0.0pp (tol ±7pp) ✓ |
| race:white | ✓ | OK | D pred=63.5% bench=63.5% Δ=+0.0pp (tol ±7pp) ✓<br>R pred=36.5% bench=36.5% Δ=+0.0pp (tol ±7pp) ✓ |
| white-college | ✓ | OK | D pred=61.3% bench=61.3% Δ=+0.0pp (tol ±7pp) ✓<br>R pred=38.7% bench=38.7% Δ=+0.0pp (tol ±7pp) ✓ |
| white-non-college | ✓ | OK | D pred=65.6% bench=65.6% Δ=+0.0pp (tol ±7pp) ✓<br>R pred=34.4% bench=34.4% Δ=+0.0pp (tol ±7pp) ✓ |
