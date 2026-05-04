# IPUMS/PUMS extract preflight smoke

**Run at:** 2026-05-04T15:09:41.886Z
**Fixtures:** in-memory only. **No `data/` reads.** No raw downloads.

The preflight reads only the header + first N data rows of a CSV/TSV extract and reports whether it is suitable for streaming through `ipumsPumsUniverseFileLoader.ts`. `pass: true` requires all hard-required columns present, at least one REPWTP column present, and at least one sample row that parses cleanly.

## Scenario coverage

| # | Scenario | Pass | Description |
|---:|---|:-:|---|
| 1 | `complete_tsv` | ✅ | All required + recommended columns + 80 REPWTP → pass clean |
| 2 | `complete_csv` | ✅ | Same as complete_tsv but CSV format |
| 3 | `missing_required` | ✅ | Drop PERWT and AGE → fail with required_columns_missing |
| 4 | `sparse_repwtp` | ✅ | Only REPWTP1, REPWTP3, REPWTP10 → pass + sparse warning |
| 5 | `no_repwtp` | ✅ | Zero REPWTP columns → fail with no_repwtp_columns_present |
| 6 | `unknown_extra` | ✅ | Header carries an extra column → pass + unknown warning |
| 7 | `delimiter_sniff` | ✅ | TSV via in-memory content (no filePath/extension hint) → sniffed automatically |
| 8 | `bad_sample_row` | ✅ | Row with non-numeric AGE → parseFailure flagged |
| 9 | `empty_input` | ✅ | No header → pass=false with empty_or_unreadable_input |
| 10 | `recommended_only_missing` | ✅ | Drop RACED, EDUCD, GQ, MIGSP1 → pass + recommended warning |
| 11 | `zero_data_rows` | ✅ | Header only, no data rows → pass + no_data_rows_observed warning |

## Per-scenario detail

### `complete_tsv` — ✅

- All required + recommended columns + 80 REPWTP → pass clean
- pass=true, delimiter=TAB, delimiterDetected=false
- columns.requiredMissing: []
- columns.recommendedMissing: []
- columns.unknownColumns: []
- repwtp: countPresent=80, minIndex=1, maxIndex=80, gaps=0, isFull80=true
- sample: rowsSampled=2, parseSuccess=2, parseFailure=0
- custom assertions: 4/4 passed

### `complete_csv` — ✅

- Same as complete_tsv but CSV format
- pass=true, delimiter=,, delimiterDetected=false
- columns.requiredMissing: []
- columns.recommendedMissing: []
- columns.unknownColumns: []
- repwtp: countPresent=80, minIndex=1, maxIndex=80, gaps=0, isFull80=true
- sample: rowsSampled=2, parseSuccess=2, parseFailure=0
- custom assertions: 2/2 passed

### `missing_required` — ✅

- Drop PERWT and AGE → fail with required_columns_missing
- pass=false, delimiter=TAB, delimiterDetected=false
- errors: required_columns_missing: AGE,PERWT; no_sample_rows_parsed_cleanly
- warnings: repwtp_not_full_80: countPresent=4, minIndex=1, maxIndex=4, gaps=0
- columns.requiredMissing: [AGE, PERWT]
- columns.recommendedMissing: []
- columns.unknownColumns: []
- repwtp: countPresent=4, minIndex=1, maxIndex=4, gaps=0, isFull80=false
- sample: rowsSampled=1, parseSuccess=0, parseFailure=1
- custom assertions: 3/3 passed

### `sparse_repwtp` — ✅

- Only REPWTP1, REPWTP3, REPWTP10 → pass + sparse warning
- pass=true, delimiter=TAB, delimiterDetected=false
- warnings: repwtp_not_full_80: countPresent=3, minIndex=1, maxIndex=10, gaps=7
- columns.requiredMissing: []
- columns.recommendedMissing: []
- columns.unknownColumns: []
- repwtp: countPresent=3, minIndex=1, maxIndex=10, gaps=7, isFull80=false
- sample: rowsSampled=1, parseSuccess=1, parseFailure=0
- custom assertions: 5/5 passed

### `no_repwtp` — ✅

- Zero REPWTP columns → fail with no_repwtp_columns_present
- pass=false, delimiter=TAB, delimiterDetected=false
- errors: no_repwtp_columns_present
- columns.requiredMissing: []
- columns.recommendedMissing: []
- columns.unknownColumns: []
- repwtp: countPresent=0, minIndex=null, maxIndex=null, gaps=0, isFull80=false
- sample: rowsSampled=1, parseSuccess=1, parseFailure=0
- custom assertions: 2/2 passed

### `unknown_extra` — ✅

- Header carries an extra column → pass + unknown warning
- pass=true, delimiter=TAB, delimiterDetected=false
- warnings: repwtp_not_full_80: countPresent=4, minIndex=1, maxIndex=4, gaps=0; unknown_columns_in_header: MYSTERY_FIELD
- columns.requiredMissing: []
- columns.recommendedMissing: []
- columns.unknownColumns: [MYSTERY_FIELD]
- repwtp: countPresent=4, minIndex=1, maxIndex=4, gaps=0, isFull80=false
- sample: rowsSampled=1, parseSuccess=1, parseFailure=0
- custom assertions: 1/1 passed

### `delimiter_sniff` — ✅

- TSV via in-memory content (no filePath/extension hint) → sniffed automatically
- pass=true, delimiter=TAB, delimiterDetected=true
- warnings: repwtp_not_full_80: countPresent=4, minIndex=1, maxIndex=4, gaps=0
- columns.requiredMissing: []
- columns.recommendedMissing: []
- columns.unknownColumns: []
- repwtp: countPresent=4, minIndex=1, maxIndex=4, gaps=0, isFull80=false
- sample: rowsSampled=1, parseSuccess=1, parseFailure=0
- custom assertions: 2/2 passed

### `bad_sample_row` — ✅

- Row with non-numeric AGE → parseFailure flagged
- pass=true, delimiter=TAB, delimiterDetected=false
- warnings: repwtp_not_full_80: countPresent=4, minIndex=1, maxIndex=4, gaps=0; some_sample_rows_failed_parse: 1/2
- columns.requiredMissing: []
- columns.recommendedMissing: []
- columns.unknownColumns: []
- repwtp: countPresent=4, minIndex=1, maxIndex=4, gaps=0, isFull80=false
- sample: rowsSampled=2, parseSuccess=1, parseFailure=1
- custom assertions: 6/6 passed

### `empty_input` — ✅

- No header → pass=false with empty_or_unreadable_input
- pass=false, delimiter=,, delimiterDetected=true
- errors: empty_or_unreadable_input
- columns.requiredMissing: [YEAR, SAMPLE, SERIAL, PERNUM, STATEFIP, PUMA, AGE, SEX, RACE, HISPAN, EDUC, HHINCOME, CITIZEN, PERWT]
- columns.recommendedMissing: [RACED, EDUCD, GQ, MIGSP1]
- columns.unknownColumns: []
- repwtp: countPresent=0, minIndex=null, maxIndex=null, gaps=0, isFull80=false
- sample: rowsSampled=0, parseSuccess=0, parseFailure=0
- custom assertions: 2/2 passed

### `recommended_only_missing` — ✅

- Drop RACED, EDUCD, GQ, MIGSP1 → pass + recommended warning
- pass=true, delimiter=TAB, delimiterDetected=false
- warnings: repwtp_not_full_80: countPresent=4, minIndex=1, maxIndex=4, gaps=0; recommended_columns_missing: RACED,EDUCD,GQ,MIGSP1
- columns.requiredMissing: []
- columns.recommendedMissing: [RACED, EDUCD, GQ, MIGSP1]
- columns.unknownColumns: []
- repwtp: countPresent=4, minIndex=1, maxIndex=4, gaps=0, isFull80=false
- sample: rowsSampled=1, parseSuccess=1, parseFailure=0
- custom assertions: 2/2 passed

### `zero_data_rows` — ✅

- Header only, no data rows → pass + no_data_rows_observed warning
- pass=true, delimiter=TAB, delimiterDetected=false
- warnings: no_data_rows_observed
- columns.requiredMissing: []
- columns.recommendedMissing: []
- columns.unknownColumns: []
- repwtp: countPresent=80, minIndex=1, maxIndex=80, gaps=0, isFull80=true
- sample: rowsSampled=0, parseSuccess=0, parseFailure=0
- custom assertions: 2/2 passed

## Disk vs in-memory equivalence

Round-tripping the `complete_tsv` fixture through OS-temp produces a report byte-identical to the in-memory variant (ignoring the `source` field): ✅

## Overall

- Scenarios passed: 11 / 11 (100.0%)
- Disk round-trip equivalence: ✅
- **Overall:** ✅ ALL PASS

## Terminology

Engagement is referenced only as a downstream concern — separate 1D continuous scalar per ADR canon, not surfaced by the preflight. Compound moral-circle terminology applies at the bridge step (already shipped at `d2c9e14`), not at extract preflight time. Legacy code identifiers (`PWGTP`, `RAC1P`, `SCHL`, `HHINCOME`, `STATEFIP`, `HISP` etc.) appear only as IPUMS / PUMS column names.