# Phase 2.7 — IPUMS USA PUMS extract manifest

**Date:** 2026-05-04 (Terminal-3, manifest-only)
**Status:** Plan / manifest only. **No raw data downloaded. No commits to `data/`.** No engine, mapper, bridge, selector, browser, dist, output, candidate, era-context, or raw-data edits.
**Companion file:** `ipums-pums-extract-manifest.json`
**Source plan:** `vep-universe-loader-plan.md` §"v1 acquisition plan"
**Target row schema:** `src/electorate/vepUniverseTypes.ts` — `VepUniverseRow`

## What this manifest is

The exact specification for five IPUMS USA extracts (one per backtest
cycle) that, when downloaded under user approval in a separate commit,
will populate `VepUniverseRow` instances via the (planned) PUMS-fed
loader. The manifest is structured so that an analyst opening IPUMS
USA's extract builder can configure each cycle's extract directly
from the table below.

This is a contract artifact, not a script. It does not retrieve data,
does not generate scripts, and does not commit any raw bytes.

## Five extracts, one per backtest cycle

The plan's vintage-per-backtest-year guidance is preserved here with one refinement: 2020 must use the 2016–2020 5-year file (the 2020 1-year ACS was not released because of COVID-driven nonresponse). For 2024, use the 2020–2024 5-year file when it ships; until then use 2019–2023 with a documented `vintage_lag: 1` flag in the loader's `coverageNotes`.

| Cycle | ACS vintage | IPUMS sample code | Approx file size | Notes |
|---:|---|---|---:|---|
| 2008 | 5-year 2005–2009 (+ 1-year 2008 supplement for state-level totals) | `us2005c, us2006a, us2007a, us2008a, us2009a` (combine for 5-yr) or `us2008a` (1-yr) | ~1.5 GB | 5-year ACS coverage starts 2009; for 2008 specifically, `2005-2009` 5-yr is the workhorse with the 1-yr 2008 file as a supplement for >65k geographies. |
| 2012 | 5-year 2008–2012 | `us2008a, us2009a, us2010a, us2011a, us2012a` | ~2.0 GB | Mature 5-year by then. |
| 2016 | 5-year 2012–2016 | `us2012a, us2013a, us2014a, us2015a, us2016a` | ~2.5 GB | Workhorse. |
| 2020 | 5-year 2016–2020 | `us2016a, us2017a, us2018a, us2019a, us2020a` | ~3.0 GB | **2020 1-year ACS not released** (COVID-driven response collapse). 5-yr is the only ACS option. |
| 2024 | 5-year 2020–2024 (when released; currently 2019–2023) | `us2020a..us2024a` (when shipped) or `us2019a..us2023a` interim | ~3.0 GB | If 2020–2024 not yet shipped, use 2019–2023 with documented `vintage_lag: 1` flag. |

**Total approx data volume across all five extracts: ~12 GB.**

## Required variables per extract

Every extract must include the following variables. Variable names below are IPUMS-USA harmonized names; PUMS native names appear in parentheses where they differ.

### Identifier + geography (all years)
| IPUMS var | PUMS native | Description | Used for `VepUniverseRow` field |
|---|---|---|---|
| `YEAR` | `YEAR` | ACS data year (2005–2024) | combined with `STATEFIP` and serial to form `respondentId` |
| `SAMPLE` | (IPUMS-only) | IPUMS sample code | `sourceDataset` value (e.g. `acs5_2014_2018`) |
| `SERIAL` | `SERIALNO` | Household serial | `respondentId` component |
| `PERNUM` | `SPORDER` | Person number within household | `respondentId` component |
| `STATEFIP` | `STATE` | 2-digit state FIPS | `state` (loader normalizes FIPS → 2-letter) |
| `PUMA` | `PUMA` | 5-digit PUMA code | `puma` |

### Demographics (all years)
| IPUMS var | PUMS native | Description | `VepUniverseRow` field |
|---|---|---|---|
| `AGE` | `AGEP` | Person age (top-coded at 95) | `age` + derived `ageBucket` |
| `SEX` | `SEX` | 1=Male, 2=Female | `sex` |
| `RACE` | `RAC1P` (raw) / IPUMS-harmonized `RACE` | Race; collapsed to 7-cat | `race` |
| `RACED` | `RAC1P` | Detailed race (for collapsing) | (intermediate; not on row) |
| `HISPAN` | `HISP` | Hispanic/Latino origin | `hispanic` (derived: `HISPAN ≠ "not Hispanic"`) |
| `EDUC` | `SCHL` (raw) / IPUMS-harmonized `EDUC` | Educational attainment | `education` |
| `EDUCD` | `SCHL` | Detailed education (for collapsing) | (intermediate; not on row) |
| `HHINCOME` | `HINCP` | Household income (continuous, top-coded) | `incomeBucket` (loader bucketizes) |
| `CITIZEN` | `CIT` | Citizenship status | `citizenship` |

### Weights (all years)
| IPUMS var | PUMS native | Description | `VepUniverseRow` field |
|---|---|---|---|
| `PERWT` | `PWGTP` | Person weight | `personWeight` |
| `REPWTP1..REPWTP80` | `PWGTP1..PWGTP80` | 80 person replicate weights | `replicateWeights` (length-80 array) |

### Optional (carried for future use; not required by v1 row schema)
| IPUMS var | Description | Future use |
|---|---|
| `MIGSP1` (`MIGPUMA1` / `MIGPLAC1`) | State of residence 1 year ago | Migration model (Phase 4+) |
| `GQ` | Group-quarters status | Loader uses to set `incomeBucket = null` when respondent is in group quarters |

## Coding tables — IPUMS → `VepUniverseRow` collapsing

### `RACE` / `RACED` → `VepRace`
| Source value | `VepRace` |
|---|---|
| White alone | `white` |
| Black/African American alone | `black` |
| American Indian alone, Alaska Native alone, AI tribe specified | `amerindian` |
| Asian alone (incl. Chinese, Japanese, Korean, Filipino, Indian, Vietnamese, Other Asian) | `asian` |
| Native Hawaiian / Pacific Islander alone | `nhpi` |
| Some other race alone | `other_single` |
| Two or more races | `two_or_more` |

### `HISPAN` → `hispanic` (boolean)
| Source value | `hispanic` |
|---|---|
| Not Hispanic | `false` |
| Mexican / Puerto Rican / Cuban / Other Hispanic / Not reported but identified by surname | `true` |

### `EDUC` / `EDUCD` → `VepEducation`
| Source value | `VepEducation` |
|---|---|
| No school / Pre-K / Kindergarten / Grade 1–11 / 12th no diploma | `less_than_hs` |
| Regular HS diploma / GED / alternative HS credential | `hs_grad` |
| Some college (no degree) / Associate's degree | `some_college` |
| Bachelor's degree | `bachelor` |
| Master's / Professional / Doctoral degree | `graduate` |

### `CITIZEN` → `VepCitizenship`
| Source value | `VepCitizenship` |
|---|---|
| Born in US | `us_born` |
| Born in PR or US territories | `us_territory` |
| Born abroad of US parents | `us_born` (treated as native-born; constitutionally eligible) |
| US citizen by naturalization | `us_naturalized` |
| Not a citizen | `non_citizen` |

### `HHINCOME` → `VepIncomeBucket`
| HHINCOME range (USD, top-coded) | `VepIncomeBucket` |
|---|---|
| < 25,000 | `<25k` |
| 25,000 – 49,999 | `25-50k` |
| 50,000 – 74,999 | `50-75k` |
| 75,000 – 99,999 | `75-100k` |
| 100,000 – 149,999 | `100-150k` |
| ≥ 150,000 | `150k+` |
| Group quarters (`GQ != "households under 1990 def"`) | `null` |

### `STATEFIP` → `state` (2-letter abbrev)
Loader uses the canonical FIPS-to-abbrev table (50 states + DC = 51 codes; territories excluded for v1). The `STATE_TO_REGION` map in `vepUniverseTypes.ts` provides the 4-region collapse used by the bridge's step-3/4 backoff.

### `vepEligible` derivation (loader-side, post-extract)
```
vepEligible = (age >= 18)
           AND (citizenship ∈ {us_born, us_naturalized})
           AND NOT state_disenfranchised(state, demographic_cell)
```
The `state_disenfranchised` adjustment is a static per-state percentage from the Sentencing Project's tracker (v1 default per `vep-universe-loader-plan.md` §"Felon disenfranchisement"). Surfaces in `coverageNotes` as a flag when applied.

## Subset filters at extract time

Every extract should be configured with the following IPUMS extract-builder filters to halve file size (the loader does its own filtering as a backup, but pre-filtering at extract time saves bandwidth and storage):

| Filter | Value |
|---|---|
| `AGE` | ≥ 18 |
| `STATEFIP` | 1–56 (50 states + DC; excludes Puerto Rico (72) and minor territories) |

US territories are excluded for v1 because they do not vote in presidential elections. The signature imputation bridge does not have a template signature for non-state populations.

## Local placement convention

Downloaded files go under `data/acs-pums/{year}/`:

```
data/acs-pums/
├── .gitignore               # excludes *.dat, *.dat.gz, *.xml, *.csv
├── 2008/
│   ├── usa_00001.dat.gz     # IPUMS data file
│   ├── usa_00001.xml        # codebook (DDI / data dictionary)
│   └── README.md            # human-readable extract metadata (committable)
├── 2012/
├── 2016/
├── 2020/
└── 2024/
```

The `.gitignore` mirrors the convention already used for `data/backtest-sources/` (FEC PDFs, Election Lab CSVs are similarly untracked). Per-cycle `README.md` files document extract IDs, query parameters, file checksums (sha256), and download date — those are committable; the actual data bytes are not.

**Acquisition gate:** the download step is a separate commit. The user must explicitly approve before any IPUMS USA login / extract / download happens. This manifest is the spec; the gate is upstream of the spec.

## Post-download validation suite

Once an extract is downloaded and the loader streams it into `VepUniverseRow[]`, the loader's smoke runs the following checks. These echo `vep-universe-loader-plan.md` §"Validation invariants" with concrete numeric tolerances.

### V1 — Aggregate VEP totals
- Compute `Σ personWeight where vepEligible = true` per year.
- Compare to the McDonald / UF Election Lab benchmark VEP from `results/electorate/backtest/benchmarks-2008-2024.json`.
- **Pass criterion**: `|PUMS_VEP − benchmark_VEP| / benchmark_VEP < 0.015` (1.5% tolerance — covers small differences in felon-disenfranchisement methodology).

### V2 — State-level VEP totals
- Compute `Σ personWeight where vepEligible = true` per (year, state).
- Compare to McDonald / UF state breakdowns.
- **Pass criterion**: max per-state gap `< 0.02` (2%); flag any state that exceeds for follow-up. Small states (DC, VT, WY, etc.) may approach the bound due to PUMS sampling variance — that's acceptable as long as the 90% CI from replicate weights covers the benchmark.

### V3 — Age-by-citizenship marginals
- Compute weighted age-bucket × citizenship cross-tab.
- Compare to ACS B05003 published cells via the Census API.
- **Pass criterion**: 90% CI from replicate weights overlaps published B05003 cell value for every (age_bucket, citizenship) pair.

### V4 — Replicate-weight integrity
- For every row: `replicateWeights.length === 80`.
- For every weight `w[i]`: `Number.isFinite(w[i])` and `w[i] >= 0` (replicate weights can be 0 but never negative by IPUMS contract).
- **Variance sanity**: per (state, year), compute Kish design effect `(Σw)² / Σw²` and compare to the standard ACS design effect; alert if outside expected band [1.5, 5.0].

### V5 — Eligibility invariant
- For every row with `vepEligible = true`: `age >= 18` AND `citizenship ∈ {us_born, us_naturalized}`.
- Already enforced by `validateVepUniverseRow` in `vepUniverseTypes.ts`; the loader smoke re-verifies on the full corpus.

### V6 — Weight non-negativity invariant
- For every row: `personWeight > 0` and finite.
- Loader contract guarantees skip-on-bad-weight; smoke counts skipped rows and flags if `rowsSkipped / rowsLoaded > 0.001` (0.1% threshold for systematic loader-data mismatch).

### V7 — Coverage cross-check vs Phase 2.6 mapper donor pool
- For every (year, state, race × sex × age_bucket × education) cell in the universe, count CES/CCES donors at that cell.
- Flag cells with `donorCount < 5` so the bridge knows to back off (this is the bridge's `MIN_DONORS = 25` threshold's first warning shot).
- Output: `cellSparsityReport.{year}.json` listing thinnest cells.

## What the manifest does NOT include

- **No file checksums.** Those get recorded per-extract in `data/acs-pums/{year}/README.md` once an extract is actually downloaded. Pre-download checksums would be invented values.
- **No download URLs.** IPUMS USA requires authenticated extract builds — there is no static URL pattern. Each extract gets a unique extract ID and download URL after the user constructs it.
- **No script.** A Node/Python downloader for IPUMS USA would require credentials handling and is out of scope for a manifest.
- **No raw data.** Zero bytes of ACS / PUMS data are committed by this manifest.

## Phase dependencies

| Depends on | Status |
|---|---|
| `vep-universe-loader-plan.md` | ✅ shipped |
| `vepUniverseTypes.ts` (target row schema) | ✅ shipped (`b3fa12a`) |
| Sentencing Project felon-disenfranchisement tracker URL | open issue (loader v1 imports a static table; tracker URL recorded in v1's loader header comment) |

| Blocks | Why |
|---|---|
| Phase 2.7 v1 loader (`vepUniverseLoader.ts`) | Cannot stream what hasn't been downloaded |
| Phase 2.8 mapper-backed Stage A backtest | Universe rows are the denominator |
| Phase 2.4 Stage B abstention calibration | Integrates over the full universe |

## Acquisition checklist (for the gated v1 acquisition commit)

When the user approves acquisition:

1. ☐ Open IPUMS USA account (https://usa.ipums.org/usa/, free institutional or personal).
2. ☐ Configure five extracts per the §"Five extracts" table; for each: select the listed samples, the listed variables (§"Required variables"), and apply the `AGE >= 18` + `STATEFIP 1..56` filters (§"Subset filters").
3. ☐ Submit each extract; record the IPUMS-assigned extract ID (e.g., `usa_00007`) in the per-cycle `README.md`.
4. ☐ Wait for IPUMS to email the download link (typically minutes to hours).
5. ☐ Download `.dat.gz` + `.xml` codebook to `data/acs-pums/{year}/`.
6. ☐ Compute sha256 of each `.dat.gz`; record in the per-cycle `README.md`.
7. ☐ Commit only `data/acs-pums/.gitignore` + `data/acs-pums/{year}/README.md` files per cycle. Never commit `.dat`, `.dat.gz`, or `.xml`.
8. ☐ Run `vepUniverseLoader.ts` smoke (Phase 2.7 v1, separate commit) against each downloaded extract; verify all 7 validation checks pass before the universe is considered ready for the bridge.

## Files in this manifest

- `results/electorate/synthetic-electorate/ipums-pums-extract-manifest.md` (this file)
- `results/electorate/synthetic-electorate/ipums-pums-extract-manifest.json` (machine-readable mirror)

## Terminology check

`vepEligible` is the population-skeleton invariant. Engagement is referenced only as a downstream-of-universe concern — separate 1D continuous scalar per ADR canon, not surfaced by PUMS or this manifest. Compound moral-circle terminology applies at the bridge step (already shipped at `d2c9e14`), not at extract time. Legacy code identifiers (`PWGTP`, `RAC1P`, `SCHL`, `HINCP`, `STATEFIP` etc.) appear only as PUMS / IPUMS column names in mapping tables.
