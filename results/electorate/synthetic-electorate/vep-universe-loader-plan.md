# Phase 2.7 — VEP Universe Loader: design plan + scaffold

**Date:** 2026-05-03 (Terminal-3, plan-only)
**Status:** Design + scaffold. **No code written. No raw data downloaded.** No mapper, vote formula, candidate, EIG/selector, browser/dist/output changes.
**Companion file:** `vep-universe-loader-plan.json` — machine-readable mirror.

## What this plan is for

The synthetic electorate the simulator scores against is **the
voting-eligible adult population**, not "every respondent in a
survey." The Phase 2.6 mapper turns each CES/CCES respondent into
a PRISM signature; that gives **node signatures** for the population
that the survey is sampling from. What the simulator additionally
needs is the **denominator** — the full eligible-adult universe at
the right marginal totals — onto which those signatures get imputed
by demographic cell.

Stated bluntly:

> **CES/CCES gives node signatures; ACS/PUMS gives the full
> eligible-adult population skeleton.**

Phase 2.7 designs how the population skeleton gets loaded. v0 is the
*plan*; v1 will be the loader implementation.

## What v0 explicitly does NOT do

- **No node signatures.** The mapper (Phase 2.6) already produces
  signatures from CES/CCES respondents; that work continues
  separately.
- **No vote prediction.** Vote formula + candidate distance are
  Phase 2.8+.
- **No raw-data downloads.** ACS PUMS files are large (~1–4 GB
  per 5-year vintage). Acquisition is gated behind explicit user
  approval and a separate intake commit.
- **No Esri Tapestry, no commercial voter files.** Per the geography
  intake (`acs-esri-geography-intake.md` §1.6 + §3.4): Esri is
  unavailable for pre-2020 backtest years (no retroactive vintage)
  and is downstream-of-ACS anyway; voter files require
  per-individual matching that's out of scope for v1. ACS/PUMS is
  the only essential source for the population skeleton.

## Two-layer architecture

| Layer | Role | Source | Produces |
|---|---|---|---|
| **Cell-level marginals** | Reproducible demographic totals at any geography (state, county, tract, block group) for raking / IPF | ACS 5-year **B-tables** via Census API | Cells of `(year, state, age_bucket, race, sex, education, income_bucket, citizenship)` with population counts |
| **Individual-like microdata** | Synthetic-respondent rows that can carry per-respondent uncertainty + survey-style weights for MRP-style poststratification | ACS 5-year **PUMS** via IPUMS USA | One row per PUMS-respondent × replicate-weight; person_weight carries population share |

For v0 we plan to ship **PUMS as the primary path** (matches
"one row per represented voting-eligible adult/cell" framing) and
**B-tables as the validation/raking-marginal path** (used to
verify PUMS aggregates match published Census totals to the
expected sampling-error tolerance).

## Target row schema (for the population-skeleton output)

The loader's typed output will be `VepUniverseRow` with fields:

| Field | Type | Source | Notes |
|---|---|---|---|
| `respondentId` | string | PUMS `SERIALNO` + `SPORDER` | "PUMS-2018-{STATE}-{SERIALNO}-{SPORDER}" |
| `year` | number | argument | Election cycle (2008/2012/2016/2020/2024). PUMS vintage selected per Phase 2.7 §2 below. |
| `state` | string (2-letter) | PUMS `STATE` (FIPS → abbrev) | 50 states + DC; territories excluded for v1 |
| `puma` | string | PUMS `PUMA` | 5-digit code for sub-state geography (~100K pop) |
| `age` | number | PUMS `AGEP` | Integer 0–95 (top-coded) |
| `age_bucket` | string | derived | "18-24", "25-34", "35-44", "45-54", "55-64", "65-74", "75+" |
| `sex` | string | PUMS `SEX` | "male" / "female" (PUMS does not include non-binary in 2008–2024 5-year files) |
| `race` | string | PUMS `RAC1P` | "white", "black", "amerindian", "asian", "nhpi", "other_single", "two_or_more" |
| `hispanic` | boolean | PUMS `HISP` | true if Hispanic/Latino origin (any race) |
| `education` | string | PUMS `SCHL` (collapsed) | "less_than_hs", "hs_grad", "some_college", "bachelor", "graduate" |
| `income_bucket` | string \| null | PUMS `HINCP` (household) | 6 buckets: "<25k", "25-50k", "50-75k", "75-100k", "100-150k", "150k+"; null when group-quarters |
| `citizenship` | enum | PUMS `CIT` | "us_born", "us_naturalized", "us_territory", "non_citizen" |
| **`vepEligible`** | boolean | **derived** | true iff `citizenship ∈ {us_born, us_naturalized}` AND `age >= 18` AND not in disqualifying state-level felon-disenfranchisement category (state-specific lookup) |
| `personWeight` | number | PUMS `PWGTP` | Population share carried by this row |
| `replicateWeights` | number[] | PUMS `PWGTP1..PWGTP80` | 80 replicate weights for variance estimation (carried but optional consumption) |
| `sourceDataset` | string | argument | e.g., "acs5_2014_2018" |
| `sourceVintage` | string | argument | "2014-2018" |
| `coverageNotes` | string[] | derived | "post_2020_disclosure_avoidance_applied" / "income_top_coded" / "PUMA_2010_boundaries" / etc. |
| `uncertainty` | "low" \| "medium" \| "high" | derived | "low" for state aggregates; "medium" at PUMA; "high" when small cells get IPF/raking smoothing |

The `vepEligible` flag is the join key for the simulator: the synthetic
electorate is the union of all rows where `vepEligible === true`,
weighted by `personWeight × replicateWeights[k]` (replicate `k` is
optional; v1 uses k=0 / no replicate by default).

## ACS / PUMS source files needed per election year

Following the geography intake's §1.2 vintage-per-backtest-year guidance, with one refinement: 2020 must use the 2016–2020 5-year file (not the 2018–2022) because the 5-year window must end no later than the election year for the universe to represent the *electorate at that moment*.

| Year | ACS 5-year vintage | PUMS file (IPUMS USA) | Approx file size | Notes |
|---:|---|---|---:|---|
| 2008 | 2005–2009 OR 2008 1-year | `usa_00001.dat.gz` (configured 2005–2009 5-yr selection) | ~1.5 GB | 5-year ACS coverage starts 2009. For 2008, prefer the 2008 1-year file for state-level totals (>65k geographies covered) and supplement sub-state with 2005–2009 5-year. |
| 2012 | 2008–2012 | configured IPUMS extract | ~2.0 GB | Mature 5-year by then. |
| 2016 | 2012–2016 | configured IPUMS extract | ~2.5 GB | Workhorse. |
| 2020 | 2016–2020 | configured IPUMS extract | ~3.0 GB | **2020 1-year ACS not released** (COVID nonresponse). 5-year is the only ACS option. |
| 2024 | 2020–2024 (when released) | configured IPUMS extract | ~3.0 GB | Currently most recent full 5-year is 2019–2023. For 2024 backtest before 2020–2024 5-year ships, use 2019–2023 with a documented `vintage_lag: 1` flag. |

**v1 acquisition plan** (Phase 2.7.A — separate commit, requires user approval):
1. Open IPUMS USA account (free; institutional or personal).
2. Configure five extracts (one per cycle), each containing:
   - All 50 states + DC, all PUMAs
   - Variables: `YEAR`, `STATEFIP`, `PUMA`, `SERIALNO`, `SPORDER`, `PWGTP`, `PWGTP1-80`, `AGEP`, `SEX`, `RAC1P`, `HISP`, `SCHL`, `HINCP`, `CIT`, `MIGSP1` (state of residence 1 year ago — for migration-model future use)
   - Sample: 5-year ACS for the chosen vintage; subset to age 18+ to halve file size
3. Download `.dat.gz` + `.xml` codebook to `data/acs-pums/{year}/`.
4. Write `data/acs-pums/.gitignore` to exclude all `.dat`, `.dat.gz`, `.xml` files (mirrors the existing `data/backtest-sources/` convention).

Until that commit lands, the Phase 2.7 v1 loader implementation will treat the data as absent and return a typed "no data available for year X" sentinel rather than throwing.

## Loader output contract

The loader will be implemented as `src/electorate/vepUniverseLoader.ts`
with this surface (mirrors the `cesBacktestLoader.ts` pattern):

```ts
export interface VepUniverseLoaderOptions {
  year: 2008 | 2012 | 2016 | 2020 | 2024;
  filePath: string;          // path to PUMS .dat / .dat.gz
  rowLimit?: number | null;  // smoke-test gate
  states?: string[];         // optional state filter (FIPS or 2-letter)
  ageMin?: number;           // default 18 (VEP universe assumption)
}
export async function* streamVepUniverse(opts): AsyncGenerator<VepUniverseRow, VepUniverseStats, void>;
export async function loadVepUniverse(opts): Promise<{ rows: VepUniverseRow[]; stats: VepUniverseStats; }>;
```

Stats include weighted total population, weighted VEP-eligible
population, weighted age/race/education marginals, and a
`benchmarkComparison` field that cross-references each year's totals
against:
- The ACS API B-table totals (`B05003` for citizenship × age, `B01001`
  for sex × age) — should match within sampling error.
- The benchmark VEP from `results/electorate/backtest/benchmarks-2008-2024.json`
  — PUMS-derived VEP should be within ~1% of the McDonald/UF
  Election Lab number (small differences come from felon
  disenfranchisement model differences).

## Where v0 deliberately stops

v0 ships:
- This design plan (`vep-universe-loader-plan.md` + `.json`).
- No code. No types. No raw downloads.
- No PUMS variable resolver. (v1 lands resolver alongside loader.)

v1 (separate commit, gated by user approval to acquire data):
- IPUMS extract acquisition (per §"v1 acquisition plan" above).
- `src/electorate/vepUniverseTypes.ts` (typed shapes).
- `src/electorate/vepUniverseLoader.ts` (PUMS streamer + raking helpers).
- `src/electorate/vepUniverseLoaderSmoke.ts` (per-year invariant checks).

v2 (later):
- Tract / block-group raking via ACS B-tables for sub-state granularity.
- Felon-disenfranchisement state lookup table (currently hard-coded
  defaults; v2 imports a per-state policy table from the Sentencing
  Project's tracker).
- Migration-model integration via `MIGSP1` for forward-looking
  electorate projections.

## Felon disenfranchisement note

The `vepEligible` derivation needs a state-level felon-disenfranchisement
adjustment because PUMS does not include conviction history. The
McDonald/UF Election Lab VEP number already applies this adjustment.
v0 plan recommends:

1. v1 loader applies a static per-state percentage derived from the
   Sentencing Project's most recent tracker. `vepEligible` becomes a
   probabilistic flag (e.g., 97% true, 3% false) for affected
   demographic cells (Black males in Florida, etc.).
2. v2 replaces the static per-state percentages with a year-specific
   tracker table.
3. The loader's `benchmarkComparison.vepGap` field surfaces any
   residual mismatch between PUMS-derived VEP and McDonald/UF VEP so
   the disenfranchisement adjustment can be tuned.

## Why not voter files for the universe?

Per geography intake §3.3–3.4: voter files cover *registered voters*
(~70% of adults), not all eligible adults. The simulator needs the
~30% of eligible adults who are not registered, because abstention
calibration (Phase 2.4 Stage B) integrates over the full eligible
universe. ACS/PUMS is the only source that gives both registered and
unregistered eligible adults at consistent demographic granularity.

Voter files remain useful for cross-validating turnout subgroup
behavior at v3+, but they are not the universe definition.

## Why not Esri for the universe?

Per geography intake §2.5: Esri Tapestry is a *segment classification
of ACS-derived demographic data*, not a separate population source.
Using Esri for the universe would be Census-derivative circularity.
Tapestry's correct role (if it ever enters the pipeline) is as an
optional MRP covariate or as narrative coloring at reporting time.
Not as the population skeleton.

## Validation

When v1 lands, the loader's smoke must verify:

1. **Total weighted VEP per year matches benchmark** within 1.5% (the
   benchmark allowance covers small differences in felon-disenfranchisement
   methodology).
2. **State-level VEP totals match McDonald/UF state breakdowns** within
   2% per state.
3. **Age-by-citizenship marginals match ACS B05003** within ACS sampling
   error (90% CI overlap).
4. **All `vepEligible: true` rows have age ≥ 18 and citizenship ∈
   {us_born, us_naturalized}** — invariant.
5. **Replicate weights are present and finite** for every row.
6. **No row has weight ≤ 0** — invariant (PUMS guarantees this).

## Files in this plan

- `results/electorate/synthetic-electorate/vep-universe-loader-plan.md` (this file)
- `results/electorate/synthetic-electorate/vep-universe-loader-plan.json` (machine-readable mirror)

No source code, no raw data files. Acquisition gated to a separate
commit pending user approval.

## Terminology check

`vepEligible` is the population-skeleton invariant; engagement and
turnout are downstream concerns (Phase 2.4 calibration, Phase 2.8
implementation). Engagement is described as a separate 1D continuous
variable per ADR canon — referenced here only as the input to Stage B
abstention calibration once the universe is loaded. Compound moral-
circle terminology used where applicable. Legacy code identifiers
(`PWGTP`, `RAC1P`, `SCHL` etc.) appear only as PUMS column names.
