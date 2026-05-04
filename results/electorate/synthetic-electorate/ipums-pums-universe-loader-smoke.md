# IPUMS/PUMS fixture loader smoke

**Run at:** 2026-05-04T14:37:07.278Z
**Cycles exercised:** 2008, 2012, 2016, 2020, 2024

Pure converter from parsed IPUMS rows (`RawIpumsRow`) to `VepUniverseRow`. **No raw downloads, no file I/O, no network.** Eight hand-authored raw rows per cycle, structured to exercise: eligible adults across race/sex/age/education/state, an adult non-citizen (emitted with `vepEligible=false`), an under-18 row (skipped), a non-state STATEFIP (skipped), and a group-quarters row (emitted with `incomeBucket=null`). One cycle additionally exercises the RACE=6 → NHPI refinement via `RACED=685`.

## Per-cycle overview

| Cycle | Input rows | Emitted | Eligible | Σ weight | Σ VEP weight | VEP share | Validation errors |
|---:|---:|---:|---:|---:|---:|---:|---:|
| 2008 | 8 | 6 | 5 | 868.8 | 701.8 | 80.8% | 0 |
| 2012 | 8 | 6 | 5 | 809.0 | 713.6 | 88.2% | 0 |
| 2016 | 9 | 7 | 6 | 994.7 | 838.2 | 84.3% | 0 |
| 2020 | 9 | 7 | 6 | 930.6 | 779.3 | 83.7% | 0 |
| 2024 | 8 | 6 | 5 | 827.4 | 735.5 | 88.9% | 0 |

## Skip breakdown by cycle

| Cycle | age_below_18 | non_state_statefip | weight_missing_or_nonpositive | missing_required_field | validation_failed |
|---:|---|---|---|---|---|
| 2008 | 1 | 1 | 0 | 0 | 0 |
| 2012 | 1 | 1 | 0 | 0 | 0 |
| 2016 | 1 | 1 | 0 | 0 | 0 |
| 2020 | 1 | 1 | 0 | 0 | 0 |
| 2024 | 1 | 1 | 0 | 0 | 0 |

## Coverage flag exercises

| Cycle | Group-quarters rows | NHPI-refined rows |
|---:|---:|---:|
| 2008 | 1 | 0 |
| 2012 | 0 | 0 |
| 2016 | 1 | 1 |
| 2020 | 1 | 0 |
| 2024 | 0 | 0 |

## Coding-table spot checks

Passed: **41/41**

| Input | Expected | Actual | Pass |
|---|---|---|:-:|
| RACE=1 | white | white | ✅ |
| RACE=2 | black | black | ✅ |
| RACE=3 | amerindian | amerindian | ✅ |
| RACE=4 | asian | asian | ✅ |
| RACE=5 | asian | asian | ✅ |
| RACE=6 | asian | asian | ✅ |
| RACE=7 | other_single | other_single | ✅ |
| RACE=8 | two_or_more | two_or_more | ✅ |
| RACE=9 | two_or_more | two_or_more | ✅ |
| RACE=6, RACED=685 | nhpi | nhpi | ✅ |
| HISPAN=0 | false | false | ✅ |
| HISPAN=1 | true | true | ✅ |
| HISPAN=4 | true | true | ✅ |
| EDUC=0 | less_than_hs | less_than_hs | ✅ |
| EDUC=3 | less_than_hs | less_than_hs | ✅ |
| EDUC=5 | less_than_hs | less_than_hs | ✅ |
| EDUC=6 | hs_grad | hs_grad | ✅ |
| EDUC=7 | some_college | some_college | ✅ |
| EDUC=8 | some_college | some_college | ✅ |
| EDUC=9 | bachelor | bachelor | ✅ |
| EDUC=10 | graduate | graduate | ✅ |
| EDUC=11 | graduate | graduate | ✅ |
| EDUC=6, EDUCD=60 | less_than_hs | less_than_hs | ✅ |
| EDUC=6, EDUCD=63 | hs_grad | hs_grad | ✅ |
| CITIZEN=1 | us_born | us_born | ✅ |
| CITIZEN=2 | us_territory | us_territory | ✅ |
| CITIZEN=3 | us_born | us_born | ✅ |
| CITIZEN=4 | us_naturalized | us_naturalized | ✅ |
| CITIZEN=5 | non_citizen | non_citizen | ✅ |
| HHINCOME=0 | <25k | <25k | ✅ |
| HHINCOME=24999 | <25k | <25k | ✅ |
| HHINCOME=25000 | 25-50k | 25-50k | ✅ |
| HHINCOME=49999 | 25-50k | 25-50k | ✅ |
| HHINCOME=50000 | 50-75k | 50-75k | ✅ |
| HHINCOME=75000 | 75-100k | 75-100k | ✅ |
| HHINCOME=100000 | 100-150k | 100-150k | ✅ |
| HHINCOME=150000 | 150k+ | 150k+ | ✅ |
| HHINCOME=9999999 | null | null | ✅ |
| HHINCOME=60000, GQ=3 | null | null | ✅ |
| SEX=1 | male | male | ✅ |
| SEX=2 | female | female | ✅ |

## Acceptance summary

- All emitted rows pass `validateVepUniverseRow`: ✅
- Eligible / ineligible mix exercised every cycle: ✅
- Under-18 skip path exercised every cycle: ✅
- Non-state STATEFIP skip path exercised every cycle: ✅
- All coding-table spot checks pass: ✅
- **Overall**: ✅ ALL PASS

## Notes

- v0 `vepEligible` derivation = `age >= 18 AND citizenship ∈ {us_born, us_naturalized}`. State-level felon-disenfranchisement adjustment is deferred to v1 (will read from a Sentencing Project tracker table); every emitted row carries `vep_eligible_pre_felon_disenfranchisement_v0` in `coverageNotes` so the pre-adjustment status is auditable.
- v0 RACE=6 (Asian + Pacific Islander conflated in IPUMS-harmonized RACE) collapses to `asian` by default. RACED=680..699 refines to `nhpi` when present. Without RACED, NHPI rows arrive as `asian` (flagged `race_asian_nhpi_unsplit_v0`).
- v0 EDUC=6 (Grade 12) defaults to `hs_grad`. EDUCD < 63 reclassifies to `less_than_hs` (Grade 12 non-graduates).

## Terminology

`vepEligible` is the population-skeleton invariant. Engagement is referenced only as a downstream concern — separate 1D continuous scalar per ADR canon, not introduced by this loader. Compound moral-circle terminology applies at the bridge step (already shipped at `d2c9e14`), not at the universe layer. Legacy code identifiers (`PWGTP`, `RAC1P`, `SCHL`, `HHINCOME`, `STATEFIP`, `CITIZEN` etc.) appear only as IPUMS / PUMS column names.