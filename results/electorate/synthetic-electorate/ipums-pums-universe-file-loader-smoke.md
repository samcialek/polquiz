# IPUMS/PUMS file streamer smoke

**Run at:** 2026-05-04T15:01:19.352Z
**Fixture:** 10 hand-authored rows, written to OS-temp as both TSV and CSV. **No `data/` reads.** No raw downloads.

## Stats (from TSV run)

| Metric | Value |
|---|---:|
| rowsRead | 10 |
| rowsEmitted | 6 |
| rowsSkipped | 4 |
| Σ personWeight emitted | 854.7 |
| Σ vepEligible weight | 687.7 |

## Skip breakdown

| Reason | Expected | Actual |
|---|---:|---:|
| age_below_18 | 1 | 1 |
| non_state_statefip | 1 | 1 |
| weight_missing_or_nonpositive | 1 | 1 |
| missing_required_field | 1 | 1 |
| validation_failed | 0 | 0 |

## Invariants

- tsvDeterministic: ✅
- csvMatchesTsv: ✅
- skipBreakdownMatches: ✅
- replicateWeightAssemblyCorrect: ✅
- nhpiRefinement: ✅
- groupQuartersIncomeNull: ✅
- nonCitizenEmittedIneligible: ✅
- csvQuotingRoundTrips: ✅
- streamYieldCountMatches: ✅
- inMemoryMatchesDisk: ✅
- revalidationClean: ✅
- headerResolverHandlesUnrecognizedAndSparseRepwtp: ✅

## Notes

- Fixture covers every emit / skip path in `convertIpumsRow`: eligible adults, adult non-citizen (emit with vepEligible=false), under-18 (skip), non-state STATEFIP=72 (skip), group-quarters (emit with incomeBucket=null), NHPI refinement via RACED=685, missing required field (blank STATEFIP), and zero personWeight.
- Replicate weights: row 1 carries REPWTP1..REPWTP4 = 148, 150, 154, 156; assembled into a length-4 `replicateWeights` array. Other rows have blank replicate columns and emit `replicateWeights: undefined`.
- The fixture header includes an `EXTRA_COL` that the loader silently ignores (header resolver dropped it). One row's `EXTRA_COL` value contains a literal comma, exercising CSV quoted-field handling.
- Cross-format determinism: identical content in TSV vs CSV produces byte-identical `VepUniverseRow` output, so downstream consumers can use either format interchangeably.
- In-memory parsing (`{ content: "..." }`) matches disk parsing (`{ filePath: "..." }`) — useful for tests that don't want to round-trip through disk.

## Terminology

Engagement is referenced only as a downstream concern — separate 1D continuous scalar per ADR canon, not surfaced by the file loader. Compound moral-circle terminology applies at the bridge step (already shipped at `d2c9e14`), not at file-streaming time. Legacy code identifiers (`PWGTP`, `RAC1P`, `SCHL`, `HHINCOME`, `STATEFIP` etc.) appear only as IPUMS / PUMS column names.