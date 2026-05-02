# ACS / Census + Esri Tapestry Geography Intake — A1b

**Created**: 2026-05-02
**Status**: Documentation only. No engine code touched. No commits.
**Companion to**: `ces-anes-codebook-intake.md` (A1)
**Scope**: Geographic / poststratification / psychographic-enrichment sources for the `survey_to_prism` mapper and downstream electorate simulation.

This doc identifies *non-attitudinal* data sources that complement the survey-attitudinal sources (CES/ANES) catalogued in A1. Two roles:

1. **Poststratification weights** — projecting survey respondents onto the real US population distribution.
2. **Optional geographic / consumer enrichment** — adding location-aware structure to electorate slices (Phase 4 geography).

---

## 1. ACS / Census — the population scaffold

### 1.1 What ACS is good for

The American Community Survey is the primary source for **demographic poststratification cells** in any survey-to-population pipeline. It tells you what fraction of US adults are (e.g.) Black college-educated women aged 35-44 in households earning $50-75K, in any geography from the nation down to the census block group. That's the cell structure you weight survey respondents into.

ACS does **not** measure political attitudes, vote choice, party ID, or any of the constructs PRISM cares about. It's purely demographic, economic, and household structure. Its role in this project is the *denominator* for population estimates, not the *signal* for PRISM nodes.

### 1.2 Vintage products and what to use per backtest year

| Product | Granularity | Update cadence | Strength | Use for |
|---------|-------------|----------------|----------|---------|
| **ACS 1-year estimates** | Geographies ≥ 65,000 pop (states, large counties, large metros) | Annual | Most current | National + state demographic distributions; not for tract/BG |
| **ACS 5-year estimates** | All geographies, down to **block group** | Annual rolling | Geographic depth | Tract/block-group poststrat; the workhorse |
| **Decennial Census** | All geographies down to block | Every 10 years | Full-population counts (no sampling error on totals) | Anchoring totals; redistricting blocks |
| **PUMS (Public Use Microdata Sample)** | PUMA (~100K population areas) — individual-level records | Annual + 5-year | Microdata for raking / IPF | Per-respondent post-strat with full demographic interactions |

**Per backtest year:**

| Election year | ACS vintage to use | Notes |
|---------------|-------------------|-------|
| 2008 | ACS 5-year 2006-2010 (or 2008 1-year for large geographies) | 5-year coverage starts 2009; for 2008 specifically use 2005-2009 5-year or single 2008 1-year |
| 2012 | ACS 5-year 2010-2014 (preferred) | Mature 5-year by then |
| 2016 | ACS 5-year 2014-2018 | |
| 2020 | ACS 5-year 2016-2020 OR 2018-2022 | **2020 1-year not released** due to COVID-driven response collapse; use 5-year file |
| 2024 | ACS 5-year 2020-2024 (when released) — currently 2019-2023 is most recent full | 5-year always lags; for current vintage use latest available |

**2020 caveat is real**: the Census Bureau did not release standard 1-year ACS estimates for 2020. Standard practice for the 2020 election cycle is the 2016-2020 5-year file or the experimental 2020 1-year supplemental.

### 1.3 ACS variables for poststratification — the canonical table list

ACS data are organized into Subject Tables (S-prefix), Detailed Tables (B-prefix), and Data Profiles (DP-prefix). The B-tables are the reproducible, programmatically queryable backbone.

**Race / ethnicity**
- `B02001` — Race (alone or in combination)
- `B03002` — Hispanic or Latino origin by race (preferred for political analysis since it crosses race × ethnicity)
- `B03003` — Hispanic or Latino origin
- `B02009` — Black or African American alone or in combination
- `B02010` — American Indian or Alaska Native alone or in combination

**Age / sex**
- `B01001` — Sex by Age (the workhorse for adult-population scaffolds)
- `B01002` — Median age by sex
- `B01003` — Total population

**Education**
- `B15003` — Educational Attainment for the Population 25 Years and Over (the standard)
- `B15001` — Sex by Age by Educational Attainment (interaction breakdown)

**Income**
- `B19013` — Median Household Income (12 mo, inflation-adjusted)
- `B19001` — Household Income (16 brackets, the binned version for raking)
- `B19101` — Family income (smaller universe than household)
- `B19301` — Per Capita Income

**Employment**
- `B23025` — Employment Status for the Population 16+
- `C24010` — Sex by Occupation (collapsed)

**Homeownership / housing**
- `B25003` — Tenure (owner vs renter, the standard)
- `B25001` — Total Housing Units
- `B25024` — Units in Structure
- `B25040` — House Heating Fuel (urban/rural proxy)

**Household type**
- `B11001` — Household Type (family / non-family / single)
- `B11003` — Family Type by Presence and Age of Own Children
- `B11016` — Household Type by Household Size

**Nativity / citizenship / language**
- `B05002` — Place of Birth by Nativity and Citizenship Status
- `B05003` — Sex by Age by Nativity and Citizenship
- `B16001` — Language Spoken at Home by Ability to Speak English
- `B16004` — Age by Language Spoken at Home (smaller universes)

**Note**: B16001/B16004 (language) are NOT released at block-group level due to disclosure-avoidance rules. Census tract is the most granular for language.

### 1.4 Geography levels and political units

| Level | Number | Granularity | ACS coverage | Use for PRISM electorate |
|-------|--------|-------------|--------------|---------------------------|
| Nation | 1 | — | All products | National popular vote target |
| State | 51 (incl DC) | — | All products | Electoral College / state-level slices |
| Congressional district | 435 | Re-drawn each cycle | 1-year + 5-year | Congressional-race scenarios |
| County | ~3,143 | Most stable politically | All products | County-level vote returns matching |
| Census tract | ~73,000 | ~4,000 pop | 5-year | High-resolution geography for MRP |
| Block group | ~240,000 | ~600-3,000 pop | 5-year (limited) | Finest-grain ACS poststratification |
| Census block | ~8,000,000 | tens of pop | Decennial only | Redistricting; not for ACS-based work |

**Political-unit complications**:
- **Congressional districts** redraw after each decennial; need to use the right vintage (e.g., 2012 election uses 2012 districts, not 2010 districts)
- **Counties** are the most stable cross-time geography for electoral analysis
- **Tract boundaries** change at decennial reboundaring (2010 vs 2020 are different); need crosswalks for cross-cycle analysis
- **Block groups** suffer disclosure suppression on rarer combinations (small-N cells get coarsened or suppressed)

### 1.5 Access paths

| Path | Use case |
|------|----------|
| `data.census.gov` | Web-based exploration; bulk downloads via "Tables" |
| **Census API** (`api.census.gov/data`) | Programmatic; needs free API key; supports B-tables, S-tables, DP, PUMS |
| `tidycensus` (R) | Wraps Census API; standard tool for analysis |
| `cenpy` (Python) | Wraps Census API; less mature than tidycensus |
| **IPUMS USA** | Cleaned harmonized PUMS across years; preferred for time-series demographic analysis |
| **NHGIS** (IPUMS) | Aggregate ACS data with consistent geography across vintages | 

**Recommended for this project**: Use `tidycensus` for table extraction, IPUMS USA for cross-year PUMS, NHGIS for tract-level consistent boundaries.

### 1.6 What ACS can and cannot measure (for PRISM purposes)

**Can measure (and so can poststratify on):**
- Race/ethnicity composition of any geography
- Age/sex distribution
- Educational attainment distribution
- Income distribution
- Employment / labor force participation
- Homeownership and household structure
- Nativity / citizenship / language at home
- Commute patterns
- Health insurance coverage (B27001-series)
- Internet/computer access

**Cannot measure:**
- Political attitudes (none)
- Vote choice (none)
- Party ID (none)
- Religion (asked-but-not-published constraint; Census Bureau is statutorily prohibited from publishing religion data even if collected)
- Religious observance, congregation, etc.
- Sexual orientation (very limited — only same-sex households via household-type tables; partial in 2020+ but suppressed at fine geographies)
- Gun ownership
- Military veteran status (covered via B21001 — actually IS available, scratch that)

**For PRISM signature mapping**: ACS contributes nothing directly. Its role is creating the cell structure (race × age × education × income × geography) that survey respondents are weighted into so the simulator's electorate matches real population proportions.

---

## 2. Esri / ArcGIS Tapestry — optional psychographic enrichment

### 2.1 Vocabulary status (verified 2026-05-02)

Sam's framing is correct. Two systems exist in parallel right now during the migration window:

| System | Status | Segments | LifeMode groups | Built on |
|--------|--------|----------|-----------------|----------|
| **Esri Tapestry Segmentation** (2024 legacy) | Retiring **June 2026** | 67 distinct + 1 unclassified = 68 | 14 distinct + 1 unclassified = 15 | Census 2020 + ACS 2018-2022 + Esri Updated Demographics 2024 |
| **ArcGIS Tapestry** (2025 new) | Current | 60 distinct + 1 unclassified = 61 | 12 distinct (A-L) + 1 unclassified = 13 | Census 2020 + ACS 2019-2023 + Esri Updated Demographics 2025 |

Source: Esri's official "What's new in Tapestry" page and the [June 2025 transition technical paper](https://content.esri.com/support/techarticles/technical-paper-arcgis-tapestry-june-2025.pdf).

**The migration math**:
- 33 segments persist with the same name across both systems (but with potentially different geographic footprints)
- 27 segments are new in 2025
- ~7 legacy segments collapsed into others or were retired
- LifeMode groups went from 14 → 12 (consolidated)

**This means there is no clean one-to-one mapping** between 2024 and 2025 Tapestry — Esri explicitly says no crosswalk exists.

### 2.2 Vintage comparability for backtest years

This is the biggest Esri-specific risk for the project:

| Backtest year | Closest contemporaneous Tapestry vintage | Comparability problem |
|---------------|------------------------------------------|------------------------|
| 2008 | Tapestry circa 2010 (no longer accessible) | **No retroactive vintage** — current Esri products only ship 2024 + 2025 vintages. 2010-era Tapestry data not generally available. |
| 2012 | Tapestry circa 2012 (no longer accessible) | Same as above |
| 2016 | Tapestry circa 2016 (limited archive access) | Some commercial archives may exist; Esri does not maintain |
| 2020 | Tapestry 2024 vintage (close fit) | Acceptable proxy; demographic shifts 2020→2024 are modest |
| 2024 | Tapestry 2024 vintage (legacy) OR 2025 ArcGIS Tapestry | Direct match |

**Implication**: Esri Tapestry is essentially **a 2020s-only data source for our purposes**. Using current Tapestry to characterize 2008/2012/2016 neighborhoods introduces large temporal mismatch (a tract that's now "Set to Impress" might have been "Aging in Place" 15 years ago).

### 2.3 What Esri Tapestry can and cannot inform

**Can inform:**
- Lifestyle segment characterization at any geography (block group up)
- Cross-tabulation of consumer behavior, media consumption, household composition
- Density classification (urban / suburban / rural at the LifeMode level)
- Affluence and life-stage gradients
- Geographic clustering of similar neighborhoods nationwide

**Cannot directly inform:**
- Political attitudes (no item asks "do you support abortion rights")
- Vote choice or partisanship
- PRISM node signatures directly
- Issue salience

**Indirect inferential bridges** (these are the actual use cases for Esri in a PRISM simulator):
- Esri segments correlate with consumer-behavior bundles that *correlate* with political clusters (e.g., "Set to Impress" trends Republican; "Trendsetters" trends Democratic) — but these are statistical proxies, not direct measures
- A geography's Tapestry mix can serve as covariates in MRP (multilevel regression with poststratification) when fitting survey responses to population distributions
- Useful for narrative coloring of cluster reports ("your archetype is concentrated in Tapestry Group F neighborhoods") but should not be load-bearing for vote prediction

### 2.4 Access paths

| Path | License | Access mode | Use case |
|------|---------|-------------|----------|
| **ArcGIS Business Analyst** (desktop or web) | Commercial license | GUI + tables | Standard Tapestry workflows; segment lookup by ZIP/tract/BG |
| **ArcGIS GeoEnrichment** | Commercial; via API | Programmatic — REST API | Bulk attach Tapestry to geographies in pipelines |
| **Living Atlas of the World** | Free tier with ArcGIS account | Sample layers | Limited Tapestry samples for exploration; not full data |
| **Downloadable segment description tables** | Free | Static PDF/CSV | Segment names + LifeMode tables; not the actual geographic assignments |

Practical access for this project requires either:
- An **ArcGIS Online subscription with Business Analyst** (university institutional licenses often cover this)
- A **GeoEnrichment service credits** budget to attach Tapestry to specific geographies
- A **third-party reseller** that bundles Tapestry into a flat file (rare, expensive)

### 2.5 The deeper architectural question

Esri Tapestry is downstream of ACS. It segments neighborhoods using Census + ACS demographic and consumer variables. **If you're already poststratifying on ACS, layering Tapestry on top introduces partial circularity** — you're using a derived classification of the same source data you're already using directly.

The honest defense of Esri in this project: it provides a *coarsened, named* representation of joint demographic distributions that is more communicable than raw ACS (saying "this archetype clusters in 'Set to Impress' suburbs" is more vivid than "this archetype clusters in tracts where median income is $80K and education is bachelor's-plus"). For *reporting* and *narrative*, Tapestry is useful. For *modeling*, ACS-direct is cleaner.

---

## 3. Paid voter-file alternatives (L2, Catalist, others)

### 3.1 Vendor capsule

| Vendor | Records | Fields | Coverage | Access constraints |
|--------|---------|--------|----------|---------------------|
| **L2** | ~210M voter records | 600+ demographic, consumer, contact fields | All 50 states; bipartisan | Commercial license; common in academic libraries (UC Berkeley, WUSTL) |
| **Catalist** | ~256M voters | National database; modeled scores | All 50 states; **Democrats / progressives only** | Vendor restricts to left-of-center clients |
| **TargetSmart** | National voter file with appended commercial | 700+ fields | All 50 states; primarily Democratic-aligned | Commercial; common in academic political-science research |
| **Aristotle** | National voter file | Modest field count vs L2 | All 50 states | Bipartisan; older brand |
| **i360** | National voter file | Republican-aligned | All 50 states | Restricted to right-of-center clients |
| **Resonate** | 1,400+ voter-level attributes | AI-derived political/lifestyle | National | Commercial enterprise tier |

### 3.2 When voter files beat Esri Tapestry

- **You need individual-level data**, not just neighborhood aggregates. Voter files identify specific individuals; Tapestry classifies neighborhoods.
- **You need vote history**: voter files carry per-individual primary/general voting history back ~10 years; Tapestry has none of this.
- **You need party registration**: in states with party registration (about half), voter files have actual registration data; Tapestry doesn't.
- **You need direct contactability**: voter files include phone, email, address; Tapestry is purely descriptive.

### 3.3 When Esri beats voter files

- **You don't need individuals, only neighborhood characterizations**. Voter files require respondent-by-respondent matching.
- **You're working at sub-Census-block geography**: voter files don't cleanly tile geography (people move, addresses are unstandardized); Tapestry tiles cleanly to block group.
- **You want consumer-behavior context**: Tapestry has lifestyle/media-consumption tables; voter files emphasize political variables.
- **You don't need nationwide adult coverage**: voter files cover registered voters (~70% of adults); Tapestry covers all geography (and so all residents).

### 3.4 For the PRISM simulator context

The PRISM simulator's atom is the *survey respondent* (real adult with measured attitudes and projected PRISM signature), not the *registered voter* or the *neighborhood*. So:

- **Voter files** add value if the simulator goes individual-vote-history-aware (e.g., "voters who voted in 2016 R but stayed home 2020"). Not needed for v1.
- **Tapestry** adds value as MRP covariate or narrative coloring. Not needed for v1.
- **ACS** is the only essential geographic/demographic source for v1.

---

## 4. Recommended source stacks

### 4.1 Phase 1 stack (single-year MVP, 2008-2024 backtest)

**Required**:
- CES Cumulative Common Content (spine) + per-year Common Content (issue items) — from A1
- ANES Time Series per-year (where richer attitude items needed) — from A1
- ACS 5-year for the matching cycle (poststratification cells)

**Not needed in Phase 1**:
- Esri Tapestry (no Phase 1 geography requirement beyond state-level)
- Voter file vendors (no individual-vote-history requirement)
- ACS 1-year (5-year is more comprehensive per cycle)
- PUMS (raw poststratification weights from CES/ANES are sufficient)

### 4.2 Phase 4 geography stack (county/state-level forward projection)

**Required**:
- CES (large enough to give state-level subsamples)
- ACS 5-year (county-level demographic distributions)
- ACS PUMS via IPUMS USA (cross-year harmonized for trend extrapolation)
- County-level vote returns (Dave Leip / MIT Election Data Lab) to validate state-county-aggregated predictions

**Optional**:
- Esri ArcGIS Tapestry (current vintage only; useful for narrative coloring + MRP covariates; **not for pre-2020 backtest**)
- L2 voter file (if pursuing Electoral-College-level state forecasts with subgroup turnout modeling)
- NHGIS for consistent tract boundaries across decennial reboundaring

### 4.3 Phase 4 — what NOT to do

- Don't use 2025 ArcGIS Tapestry to characterize 2008/2012/2016 neighborhoods. The temporal mismatch is severe.
- Don't try to align voter files across 2008 → 2024 without significant cleaning effort; record longitudinality is messy.
- Don't add Esri to Phase 1 for "completeness" — it's a major licensing cost with no Phase 1 value.

---

## 5. Top 5 Esri-specific risks

1. **No retroactive vintage** for backtest years 2008/2012/2016. Current Tapestry products are 2024 + 2025 only. Using current Tapestry for 2008-era neighborhoods is a 15-year temporal mismatch — many tracts have completely different segment assignments now than they did then. **For pre-2020 backtest, treat Esri as effectively unavailable.**

2. **2024 → 2025 vocabulary discontinuity**. Tapestry just had its first overhaul in a decade (June 2025). 27 of 60 current segments are new; 33 are persistent-by-name but with shifted geographic footprints. **No official 2024↔2025 crosswalk exists.** Anything built against the 2024 system needs to be rewritten against 2025 before June 2026 retirement.

3. **Census-derivative circularity**. Tapestry is built from Census + ACS. If the modeling pipeline already uses ACS for poststratification, layering Tapestry on top is partial double-counting. Defensible only if Tapestry adds genuinely new variance (consumer behavior, media consumption) that ACS doesn't capture.

4. **Closed/paid licensing**. ArcGIS Business Analyst or GeoEnrichment access required. Reproducibility is constrained: anyone who wants to replicate the analysis needs the same Esri license tier. Open-data alternatives (raw ACS) are reproducible by anyone.

5. **No direct political attitude content**. Tapestry segments correlate with political behavior but don't measure it. Using Tapestry as a vote-prediction signal in itself (rather than as MRP covariates or narrative aggregation) risks treating consumer-behavior-correlation-with-politics as politics-itself. Spurious for fine-grained predictions.

---

## 6. Effect on mapper plan

**This adds geography hooks; it does not change the core mapper plan.**

The core `survey_to_prism` mapper from A1 still works as designed:
- Take a CES/ANES respondent record
- Map their answers to PRISM node posteriors
- Output a 14-node signature (+ morBoundaries vector)

The geography intake adds two adjacent pieces:

1. **Poststratification weighting** — once the mapper produces signatures for survey respondents, ACS gives the cell structure to weight those respondents up to a population estimate. This is a downstream step, not a mapper change.

2. **Optional geographic enrichment** — for Phase 4 forward forecasting at sub-national resolution, ACS (and possibly Tapestry / voter files) provides the geographic scaffold. Again, downstream of the mapper.

**Decisions still open** (don't need to resolve in this intake):
- Whether to do MRP (multilevel regression with poststratification) or simple raking. MRP is more accurate for thin geographic slices; raking is simpler to implement.
- Whether to weight to *adult population* (ACS) or *likely-voter population* (modeled). For popular-vote prediction, likely-voter weighting is closer to truth but adds a layer of modeled assumptions.
- Whether to use the Esri Tapestry covariate path for MRP. Useful but not essential. Defer until Phase 4 MRP design.

---

## 7. Files in this intake

- `acs-esri-geography-intake.md` (this file)
- `variable-catalog-v0.json` — extended with `geographic_sources` section (see § 8)

No engine code modified. No commits made.

---

## 8. JSON catalog extension

A `geographic_sources` section is appended to `variable-catalog-v0.json` with:
- ACS source descriptors (1-year, 5-year, PUMS, decennial), variable table list, geography levels, vintage-per-backtest-year
- Esri descriptors (2024 legacy + 2025 ArcGIS Tapestry) with structural counts and access paths
- Voter-file vendor capsules
- Phase 1 / Phase 4 recommended stacks
- Top-5 Esri risks (mirrored from § 5)

JSON validates after the addition (verified via `JSON.parse`).
