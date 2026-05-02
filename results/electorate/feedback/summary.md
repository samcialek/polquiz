# Error Reporter Smoke

Run at 2026-05-02T23:16:16.746Z. Synthetic gate inputs only.

Three test cases verify the reporter under: a single moderate miss, a missing-prediction coverage issue, and a severe multi-subgroup failure with cross-pattern hypotheses.

## Invariant checks

| # | Check | Pass | Detail |
|---|---|:--:|---|
| 1 | T1: exactly one failure row | ✓ | failures=1 |
| 2 | T1: failure subgroup is white-college on metric D | ✓ | white-college/D |
| 3 | T1: severity is moderate (20pp / 7pp = 2.86x) | ✓ | severity=moderate |
| 4 | T1: diagnoses include mapper_error + candidate_signature_error + vote_formula_error | ✓ | categories=mapper_error,candidate_signature_error,vote_formula_error |
| 5 | T1: at least one recommendation step is produced | ✓ | steps=5 |
| 6 | T2: exactly one failure row, isMissingData=true | ✓ | failures=1 missing=true |
| 7 | T2: missingDataKind is no_prediction | ✓ | kind=no_prediction |
| 8 | T2: only diagnosis is benchmark_or_coverage_issue (high) | ✓ | diagnoses=benchmark_or_coverage_issue/high |
| 9 | T2: coverageIssueCount is 1 | ✓ | coverage=1 |
| 10 | T3: 6 failure rows total | ✓ | failures=6 |
| 11 | T3: severities sort severe → moderate → minor | ✓ | order=severe,severe,severe,moderate,moderate,minor |
| 12 | T3: 3 severe + 2 moderate + 1 minor | ✓ | severe=3 mod=2 minor=1 |
| 13 | T3: top-level hypothesis names systematic D over-prediction | ✓ | hypotheses=2 |
| 14 | T3: top-level hypothesis names realignment-cell concentration | ✓ | hypotheses present: true |

**Overall: ✓ ALL PASS** (14/14)

### Test 1 — single subgroup share miss

**Failures: 1** — severe 0, moderate 1, minor 0, coverage 0.

**Top-level hypotheses:**
- No systematic cross-failure pattern detected. Each failure row stands on its own; treat per-row diagnoses as the working theory.

| Severity | Subgroup | Metric | Predicted | Benchmark | Δ | Top diagnosis | Confidence |
|---|---|---|---:|---:|---:|---|---|
| moderate | white-college | D | 71.0% | 51.0% | +20.0pp | mapper_error | medium |

### Test 2 — missing prediction

**Failures: 1** — severe 0, moderate 1, minor 0, coverage 1.

**Top-level hypotheses:**
- No systematic cross-failure pattern detected. Each failure row stands on its own; treat per-row diagnoses as the working theory.

| Severity | Subgroup | Metric | Predicted | Benchmark | Δ | Top diagnosis | Confidence |
|---|---|---|---:|---:|---:|---|---|
| moderate | race:Asian | (coverage) | — | — | — | benchmark_or_coverage_issue | high |

### Test 3 — severe multi-subgroup failure

**Failures: 6** — severe 3, moderate 2, minor 1, coverage 0.

**Top-level hypotheses:**
- Predicted D share exceeds benchmark in 6/6 D-failures — likely candidate_signature_error: the Democratic candidate is systematically over-attractive across subgroups.
- 4/6 failures are on coalition realignment cells (white-college / non-college / race-by-education) — likely mapper_error: survey-to-PRISM mapping may not capture the realignment axis. Inspect moral-boundary loadings for these cells.

| Severity | Subgroup | Metric | Predicted | Benchmark | Δ | Top diagnosis | Confidence |
|---|---|---|---:|---:|---:|---|---|
| severe | white-non-college | D | 55.0% | 30.0% | +25.0pp | mapper_error | high |
| severe | white-college | D | 75.0% | 51.0% | +24.0pp | mapper_error | high |
| severe | race:Latino | D | 78.0% | 55.0% | +23.0pp | mapper_error | high |
| moderate | race:Asian | D | 70.0% | 55.0% | +15.0pp | mapper_error | medium |
| moderate | age:18-29 | D | 74.0% | 62.0% | +12.0pp | mapper_error | medium |
| minor | age:65+ | D | 50.0% | 42.0% | +8.0pp | mapper_error | medium |
