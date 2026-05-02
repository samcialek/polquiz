# CES + ANES Codebook Intake — `survey_to_prism` v0

**Created**: 2026-05-02
**Status**: First-pass intake. Documentation only. No engine code touched.
**Scope**: Modern survey-era backtest window — 2008, 2012, 2016, 2020, 2024.
**Out of scope (this pass)**: ANES pre-2008 waves, GSS/Pew supplements, pre-1948 synthetic electorates.

This file is the source-of-truth catalog for the `survey_to_prism` mapper. It identifies which datasets to use per election cycle, lists the standard administrative/demographic/vote/party fields, and maps candidate variables to each PRISM node with a coverage-strength label.

A companion machine-readable catalog lives at `variable-catalog-v0.json` in this same directory.

---

## 1. Verification status legend

Each variable claim in this doc carries one of these provenance tags:

- **[verified-codebook]** — Variable name confirmed by direct read of the source codebook (cited inline).
- **[verified-search]** — Variable name surfaced by web search of the source codebook but full text not directly read.
- **[training-data — verify]** — Drawn from prior knowledge of long-standing variable conventions (especially ANES VCF series). High confidence but not directly re-verified in this pass; the mapper implementation should re-verify before relying on these.
- **[needs-codebook-pull]** — Variable likely exists but I have not located its exact code yet; flagged for follow-up.

The ANES PDF endpoint at `electionstudies.org` returned 403 to all WebFetch attempts in this intake pass; ANES variable codes below are largely [training-data — verify] or [verified-search] from result snippets, and should be confirmed against the actual codebooks before mapper coding.

---

## 2. Source inventory

### 2.1 CES / CCES per-year datasets (Harvard Dataverse)

The Cooperative Election Study (formerly Cooperative Congressional Election Study, renamed 2020). Run by Harvard with team modules. ~50K-65K respondents per cycle. Pre-election + post-election waves. Common Content variables prefixed `CC{year}_*` from 2018 onward; earlier years use `CC` + sequential number.

| Year | Dataset | Persistent ID (DOI) | N (Common Content) | Codebook |
|------|---------|---------------------|---------------------|----------|
| 2008 | CCES Common Content 2008 | `10.7910/DVN/YUYIVB` [verified-search] | 32,800 [verified-codebook] | Per-dataset on Dataverse landing page |
| 2012 | CCES Common Content 2012 | `10.7910/DVN/HQEVPK` [verified-search] | 54,535 [verified-codebook] | Per-dataset on Dataverse landing page |
| 2016 | CCES Common Content 2016 | `10.7910/DVN/GDF6Z0` [verified-search] | 64,600 [verified-codebook] | Berkeley SDA HTML at `sda.berkeley.edu/sdaweb/docs/cces2016/DOC/hcbk.htm` |
| 2020 | CES Common Content 2020 | `10.7910/DVN/E9N6PH` [verified-search] | 61,000 [verified-codebook] | Per-dataset on Dataverse landing page |
| 2024 | CES Common Content 2024 | `10.7910/DVN/X11EP6` [verified-search] | 60,000 [verified-codebook] | Per-dataset on Dataverse landing page |

**Dataverse hub**: https://dataverse.harvard.edu/dataverse/cces

### 2.2 CES Cumulative Common Content (the spine)

| Item | Value |
|------|-------|
| Title | Cumulative CES Common Content |
| Maintainer | Shiro Kuriwaki (Yale) |
| Persistent ID | `10.7910/DVN/II2DB6` [verified-codebook] |
| Coverage | 2006–2024, 19 years, 701,955 rows (cumulative) [verified-codebook] |
| Latest version | v10.0 released 2024-05-21 [verified-codebook] |
| Formats | `.dta` (Stata), `.rds` (R), `.feather` (arrow) [verified-codebook] |
| Codebook | https://csmweb-prod-02.ist.berkeley.edu/sdaweb/docs/ces-cumulative-2024-v10/DOC/guide_cumulative_2006-2024.pdf [verified-codebook] |
| GitHub source | https://github.com/kuriwaki/cces_cumulative |
| Crucial limitation | **Cumulative file does NOT include issue-attitude variables.** Only ID, weights, demographics, validated turnout, party ID, ideology, vote choice, news interest, approval, economy retrospective, and union/income. Issue items must be merged in from year-specific Common Content files using `(year, case_id)` as join key. |

### 2.3 ANES per-year time series studies

The American National Election Studies. Stanford/Michigan-led. Standalone pre-/post-election studies in major election years. ~1.2K-8.3K respondents per cycle.

| Year | Dataset | Status | N | Codebook URL |
|------|---------|--------|---|--------------|
| 2008 | ANES 2008 Time Series Study | Available | ~2,323 [training-data — verify] | electionstudies.org Data Center |
| 2012 | ANES 2012 Time Series Study | Available | ~5,914 [training-data — verify] | electionstudies.org Data Center |
| 2016 | ANES 2016 Time Series Study | Available | ~4,271 [training-data — verify] | electionstudies.org Data Center |
| 2020 | ANES 2020 Time Series Study | Full release | 8,280 (web 7,782 + video 359 + tel 139) [verified-codebook] | https://electionstudies.org/wp-content/uploads/2022/02/anes_timeseries_2020_userguidecodebook_20220210.pdf |
| 2024 | ANES 2024 Time Series Study | Full release 2025-08-08 | TBD [needs-codebook-pull] | https://electionstudies.org/wp-content/uploads/2025/08/anes_timeseries_2024_userguidecodebook_20250808.pdf [verified-search] |

**Variable naming**: Year-specific files use `V{yy}{nnnn}` codes — e.g., 2020 uses `V202xxx` for post-election items, `V201xxx` for pre-election items. 2024 uses `V241xxx` for pre, `V242xxx` for post (extrapolation; verify).

**Data Center**: https://electionstudies.org/data-center/

### 2.4 ANES Time Series Cumulative Data File (the cross-year spine)

| Item | Value |
|------|-------|
| Title | ANES Time Series Cumulative Data File |
| Coverage | 1948-2024 [verified-search] |
| Latest release | 2025-12-11, includes 2024 data [verified-search] |
| Variable scheme | `VCF{nnnn}` codes — harmonized across all included years. A question must appear in ≥3 Time Series studies to be eligible for cumulative inclusion. [verified-search] |
| Codebook | electionstudies.org Data Center; PDF at https://electionstudies.org/wp-content/uploads/2022/09/anes_timeseries_cdf_codebook_var_20220916.pdf (1948-2020 version) [verified-search] |
| Crucial caveat | Cumulative codebook can ONLY be used with the cumulative file, NOT with year-specific files. The two have different variable namespaces. [verified-search] |

---

## 3. Standard fields per source

For every (source × year), the mapper needs these eight categories.

### 3.1 CES Cumulative (2008-2024 — the spine)

All names below are **[verified-codebook]** from the v10 Cumulative guide unless noted.

**Identification & administration**
| Concept | Variable | Notes |
|---------|----------|-------|
| Year | `year` | int, 2006-2024 |
| Respondent ID | `case_id` | uniquely identifies row when joined with `year` |
| Took post-election wave | `tookpost` | binary; only even years |
| Pre-wave start time | `starttime` | UTC datetime |

**Survey weights**
| Concept | Variable | When to use |
|---------|----------|-------------|
| Pre-election weight (year-specific) | `weight` | analyses on pre-wave only, single year |
| Cumulative weight | `weight_cumulative` | multi-year pooled analyses |
| Post-election weight | `weight_post` | post-wave analyses (vote validation etc.) |
| Validated registered voter weight | `rvweight` | restricting to vv-confirmed registered voters |
| Validated registered voter post weight | `rvweight_post` | same, post-wave |

**Turnout & vote choice**
| Concept | Variable | Notes |
|---------|----------|-------|
| Validated registration status | `vv_regstatus` | from voter file match |
| Validated party (general) | `vv_party_gen` | |
| Validated party (primary) | `vv_party_prm` | |
| Validated turnout (general) | `vv_turnout_gvm` | gold-standard turnout measure |
| Validated turnout (primary congressional) | `vv_turnout_pvm` | |
| Self-reported turnout intent (pre) | `intent_turnout_self` | |
| Self-reported turnout (post) | `voted_turnout_self` | |
| Presidential vote intent (pre) | `intent_pres_08`, `intent_pres_12`, `intent_pres_16`, `intent_pres_20`, `intent_pres_24` | one variable per cycle |
| Presidential vote (post) | `voted_pres_08`, `voted_pres_12`, `voted_pres_16`, `voted_pres_20`, `voted_pres_24` | one variable per cycle |
| House/Senate/Gov vote | `voted_rep`, `voted_sen`, `voted_gov` + party variants `_party` | |

**Party ID**
| Concept | Variable | Scale |
|---------|----------|-------|
| Partisan ID 3-point | `pid3` | Dem / Rep / Indep / Other |
| Partisan ID 7-point | `pid7` | strong D ↔ strong R |
| Partisan ID 3-cat with leaners | `pid3_leaner` | |

**Ideology**
| Concept | Variable | Scale |
|---------|----------|-------|
| Self-placement ideology | `ideo5` | very lib ↔ very cons (5-point) |

**Demographics for coalition gates**
| Concept | Variable |
|---------|----------|
| Sex (standardized) | `gender` |
| Sexuality | `sexuality` |
| Year of birth | `birthyr` |
| Age | `age` |
| Education | `educ` |
| Race | `race`; `race_h` (any-part Hispanic) |
| Hispanic | `hispanic`; `hisp_origin` |
| Citizen | `citizen` |
| Religion | `religion` |
| Importance of religion | `relig_imp` |
| Born again | `relig_bornagain` |
| Protestant branch | `relig_protestant` |
| Church attendance | `relig_church` |
| Marital status | `marstat` |
| Home ownership | `ownhome` |
| Has child <18 | `has_child` |

**Behavior / context**
| Concept | Variable |
|---------|----------|
| Family income | `faminc` |
| Employment | `employ` |
| Uninsured | `no_healthins` |
| Union member | `union` |
| Union household | `union_hh` |
| Investor (stocks/bonds) | `investor` |
| Retrospective economy assessment | `economy_retro` |
| News interest | `newsint` |
| Approval (President / Reps / Senators / Governor) | `approval_pres`, `approval_rep`, `approval_sen1`, `approval_sen2`, `approval_gov` |

**Issue attitudes**: NOT in cumulative. See § 3.2 for year-specific.

### 3.2 CES year-specific Common Content — issue attitudes

The cumulative file is the spine; **issue items must be joined from year-specific files**. The CCES 2016 Common Content's actual variables, [verified-codebook] from Berkeley SDA HTML:

**Gun control (2016)** — `CC16_330a` background checks all sales / `CC16_330b` prohibit publishing gun-owner names / `CC16_330d` ban assault rifles / `CC16_330e` easier concealed-carry

**Abortion (2016)** — `CC16_332a` always allow / `CC16_332b` only rape/incest/health / `CC16_332c` prohibit after 20w / `CC16_332d` allow employer opt-out / `CC16_332e` prohibit federal funding / `CC16_332f` make illegal in all cases

**Immigration (2016)** — `CC16_331_1` legalize long-time workers / `_2` increase border patrol / `_3` legalize childhood arrivals (DACA) / `_4` fine businesses hiring undoc / `_5` no Syrian refugees / `_6` increase H-1B / `_7` identify-and-deport / `_8` ban Muslims

**Environment (2016)** — `CC16_333a` EPA carbon authority / `_b` raise CAFE / `_c` renewable fuels minimum / `_d` strengthen Clean Air/Water enforcement

**Criminal justice (2016)** — `CC16_334a` end mandatory minimums (drug) / `_b` police body cameras / `_c` +10% police presence / `_d` longer sentences for repeat felons

**Foreign / military (2016)** — `CC16_312_1-7` ISIS response options; `CC16_414_1-7` US military use scenarios

**Gay rights (2016)** — `CC16_335` support gay marriage

**Healthcare (2016)** — `CC16_351I` repeal ACA

**Budget / taxes (2016)** — `CC16_337_1` cut defense / `_2` cut domestic / `_3` raise taxes / `CC16_415r` deficit-reduction (cuts vs taxes) / `CC16_416r` tax type (income vs sales)

**Wages (2016)** — `CC16_351K` raise minimum wage

**Naming convention extrapolation**: 2008/2010/2012/2014 use `CC{year}_{nnn}` (e.g., `CC12_330` for 2012 gun-control battery); 2018+ use `CC{yy}_{nnn}` consistently. Each cycle re-uses many but not all topic numbers — battery wording can shift across cycles, so the mapper needs per-year question-wording diffs, not blind variable-name mapping.

### 3.3 ANES per-year — partial inventory

ANES 2020 weights and modes [verified-codebook] from Berkeley SDA intro page:

| Concept | Variable | Notes |
|---------|----------|-------|
| Mode (web/video/tel) | `V200002` | filter: 1=video, 2=tel, 3=web |
| Pre-election weight (full sample) | `V200010a` | default for pre-only |
| Post-election weight (full sample) | `V200010b` | for post-wave analyses |
| Pre weight (panel 2016-2020) | `V200011a` | |
| Post weight (panel 2016-2020) | `V200011b` | |
| Stratum | `V200010d` | for variance estimation |
| PSU | `V200010c` | |

ANES 2020 issue variables (partial, [verified-search]):
- `V202183` — Feeling thermometer: #MeToo
- `V202185` — Feeling thermometer: Planned Parenthood
- `V202232` — Immigration levels (increase/decrease)
- `V202233` — Immigration takes jobs
- `V202234` — Allow refugees

**Verification gap**: Full ANES 2020 / 2024 issue-variable lists not directly pulled this pass (PDF endpoints returned 403 to WebFetch). Mapper implementation needs to download codebooks locally and parse.

### 3.4 ANES Cumulative VCF — likely cross-year backbone

Standard VCF codes [training-data — verify] worth confirming against the 1948-2024 codebook before relying on them:

**ID & weights**
- `VCF0006` — case ID (within year)
- `VCF0006a` — (varies; case ID across study versions)
- `VCF0009` family — survey weights (specific names depend on cumulative version)
- `VCF0004` — year of study

**Vote / turnout**
- `VCF0702` — registered to vote
- `VCF0703` — voted (turnout)
- `VCF0704` — vote intent (pre)
- `VCF0705` — actual presidential vote
- `VCF0706` — vote choice (party)

**Party ID & ideology**
- `VCF0301` — party ID 7-point
- `VCF0303` — party ID 3-cat (with leaners as independents)
- `VCF0305` — strength of party ID
- `VCF0803` — liberal-conservative 7-point self-placement
- `VCF0810` — strength of ideological identification

**Issue position scales (7-point unless noted)**
- `VCF0809` — guaranteed jobs / standard of living
- `VCF0839` — government services & spending tradeoff
- `VCF0843` — defense spending
- `VCF0806` — government health insurance
- `VCF0830` — government aid to Black Americans
- `VCF0834` — women's role (equal role ↔ traditional)
- `VCF0837` — abortion (4-cat: never / rape-incest-health / clear need / always)
- `VCF0838` — abortion (alternative coding)
- `VCF0876` — gay rights / gay marriage (year-dependent)
- `VCF0877` — gays in military / employment discrimination
- `VCF0879` — immigration levels (1992+)

**Trust & efficacy**
- `VCF0604` — trust in government index
- `VCF0606` — gov benefits few vs many

**Demographics**
- `VCF0101` — age
- `VCF0102` — age group
- `VCF0104` — gender
- `VCF0105` / `VCF0106` — race (different codings)
- `VCF0110` — education
- `VCF0114` — income (5-cat percentiles)
- `VCF0128` — religion
- `VCF0151` — region

**Feeling thermometers** (typical VCF range):
- `VCF0201` Democratic Party / `VCF0202` Republican Party / `VCF0211` liberals / `VCF0212` conservatives / `VCF0207` poor people / `VCF0210` Blacks / `VCF0217` whites / `VCF0218` Hispanics / `VCF0224` police / etc. — exact codes vary by year availability.

---

## 4. Variable catalog by PRISM target

For each PRISM node, candidate survey variables are listed with a coverage label per source. Coverage labels:

- **STRONG-DIRECT** — Standard battery directly measures the construct (e.g., `VCF0809` jobs/standard of living for MAT)
- **PROXY** — Adjacent measure with reasonable inferential bridge
- **WEAK / MISSING** — No direct or strong proxy in the dataset; would require ad-hoc inference
- **DERIVED** — Construct must be computed from a combination of variables (factor analysis, demographic-issue interactions, etc.)

### 4.1 MAT — Material orientation (1=redistribution, 5=free-market)

| Source | Coverage | Variables |
|--------|----------|-----------|
| CES Cumulative | PROXY | `economy_retro`, `faminc`, `union`, `investor`, `no_healthins` (composite signal; not direct ideology) |
| CES year-specific | STRONG-DIRECT | `CC16_337_1` (cut defense), `_2` (cut domestic), `_3` (raise taxes), `CC16_415r` (deficit cuts vs taxes), `CC16_416r` (income vs sales tax), `CC16_351I` (repeal ACA), `CC16_351K` (raise min wage). 2008/2012/2020/2024 have analogous batteries. |
| ANES Cumulative VCF | STRONG-DIRECT | `VCF0809` jobs/standard-of-living 7-pt, `VCF0839` gov services/spending 7-pt, `VCF0806` gov health insurance 7-pt |
| ANES per-year | STRONG-DIRECT | Year-specific V202xxx items on healthcare, taxes, jobs guarantee, minimum wage |

**Mapper note**: MAT has the cleanest survey-to-PRISM bridge of any node. Use `VCF0809` + `VCF0839` together as the spine; refine direction with year-specific tax/spending items.

### 4.2 CD — Cultural direction (1=progressive, 5=traditionalist)

| Source | Coverage | Variables |
|--------|----------|-----------|
| CES Cumulative | WEAK | (no direct social-issue items in cumulative; only `relig_imp`, `relig_church` as crude proxies) |
| CES year-specific | STRONG-DIRECT | `CC16_332a-f` abortion battery (6 items); `CC16_335` gay marriage; gender-identity items in 2018+ |
| ANES Cumulative VCF | STRONG-DIRECT | `VCF0837/0838` abortion; `VCF0834` women's role; `VCF0876/0877` gay rights |
| ANES per-year | STRONG-DIRECT | Recent waves include trans rights, gender-identity, religious-accommodation items |

**Mapper note**: Abortion + women's role + gay marriage gives a 3-item index that loads cleanly on CD. Recent waves add gender-identity items that are CD-loaded for 2020/2024 but absent earlier — mapper needs era-specific variable selection.

### 4.3 CU — Cultural uniformity / pluralism (1=one shared way, 5=different ways side-by-side)

| Source | Coverage | Variables |
|--------|----------|-----------|
| CES Cumulative | WEAK | (no direct items) |
| CES year-specific | STRONG-DIRECT | `CC16_331` immigration battery 8 items (Muslim ban, deportation, DACA, refugees, English/civic) carries CU signal alongside MOR |
| ANES Cumulative VCF | PROXY | `VCF0879` immigration levels — single item, less rich than the CES battery |
| ANES per-year | STRONG-DIRECT | 2020/2024 V202xxx immigration items (V202232 levels, V202233 jobs, V202234 refugees); also national pride / language-policy items |

**Mapper note**: CU and CD often co-vary in survey data. Best to fit them jointly via factor analysis on the combined immigration + multiculturalism + religious-accommodation item pool, rather than forcing single-variable mapping.

### 4.4 MOR — Moral circle (1=narrow/in-group, 5=universalist) AND morBoundaries

| Source | Coverage | Variables |
|--------|----------|-----------|
| CES Cumulative | WEAK | (`relig_*` items inform religious boundary weight only) |
| CES year-specific | DERIVED | `CC16_331_5` Syrian refugees + `CC16_331_8` Muslim ban → universalism direction; `CC16_312_*` ISIS responses → in-group/out-group framing |
| ANES Cumulative VCF | DERIVED | `VCF0830` aid to Black Americans + immigration items; feeling thermometer differentials between in-group and out-group thermometers (e.g., own race vs other race) |
| ANES per-year | DERIVED | Group-empathy battery (new 2020), refugee items, foreign-aid items |

**Mapper note for morBoundaries**: This is the hardest single mapping in the project. The compound module (ADR-006) requires a 7-boundary vector (national, ethnic_racial, religious, class, ideological, gender, political_tribe) plus an intensity scalar. Approach:
- **boundaries[national]**: weight = importance of national identity (relevant ANES VCF item) + immigration restrictiveness
- **boundaries[ethnic_racial]**: weight = thermometer gap between own race and other racial groups + position on race-conscious policy (`VCF0830`)
- **boundaries[religious]**: weight = `relig_imp` × `relig_church` × thermometer for own-religion vs others
- **boundaries[class]**: weight = thermometer gap rich vs poor + economic-conflict items
- **boundaries[ideological]**: weight = thermometer gap liberals vs conservatives (`VCF0211/0212`) + strength of ideology
- **boundaries[gender]**: weight = `VCF0834` women's role + thermometer gap men vs women
- **boundaries[political_tribe]**: weight = thermometer gap Dems vs Reps (`VCF0201/0202`) × `pid7` strength
- **intensity**: composite scalar from PF/TRB/MOR salience proxies

This is a v0 sketch; expect to iterate after fitting on 2020 data first.

### 4.5 PRO — Proceduralism (1=results, 5=rules)

| Source | Coverage | Variables |
|--------|----------|-----------|
| CES Cumulative | MISSING | (none) |
| CES year-specific | WEAK | Indirect via 2020/2024 election-integrity items; willingness to break norms questions |
| ANES Cumulative VCF | PROXY | `VCF0604` trust in government, `VCF0606` who gov benefits — captures procedural confidence indirectly |
| ANES per-year | WEAK / DERIVED | 2020+ has democracy-norms battery and election-legitimacy items |

**Mapper note**: PRO has weak survey coverage. May need DERIVED inference from democracy-norms questions × partisan-asymmetry adjustment.

### 4.6 COM — Compromise tolerance (1=principled, 5=dealmaker)

| Source | Coverage | Variables |
|--------|----------|-----------|
| CES Cumulative | MISSING | (none) |
| CES year-specific | MISSING | Surveys rarely ask "do you prefer compromise" directly |
| ANES Cumulative VCF | WEAK | Some indirect items on partisan-conflict tolerance |
| ANES per-year | WEAK / DERIVED | "Politicians should compromise" Likert items appear sporadically (2016, 2020) |

**Mapper note**: COM is the weakest-covered node. v0 mapper should treat COM as essentially uniform-prior with light derivation from `pid7` strength (strong partisans tend low-COM) and ideological strength.

### 4.7 ZS — Zero-sum orientation (1=positive-sum, 5=zero-sum)

| Source | Coverage | Variables |
|--------|----------|-----------|
| CES Cumulative | WEAK | `economy_retro` only |
| CES year-specific | DERIVED | Trade items (other countries' gain = our loss); inter-group economic competition items |
| ANES Cumulative VCF | DERIVED | Race-aid + immigration-takes-jobs items signal economic ZS; pre-2008 limited |
| ANES per-year | STRONG-DIRECT | 2020 V202233 (immigration takes jobs) is direct ZS signal; 2024 likely similar |

**Mapper note**: ZS is moderately covered through trade + immigration-jobs items. Build a 3-4 item ZS index from these.

### 4.8 ONT_H — Human malleability (1=fixed, 5=shaped by environment)

| Source | Coverage | Variables |
|--------|----------|-----------|
| CES Cumulative | MISSING | (none) |
| CES year-specific | MISSING | Not standard survey content |
| ANES Cumulative VCF | DERIVED | Authoritarian-parenting battery (Feldman-Stenner items) when present |
| ANES per-year | PROXY | 2008+ ANES has Feldman-Stenner authoritarianism items (V162267-V162272 in 2016) |

**Mapper note**: Feldman-Stenner is the closest available proxy — measures preference for "obedience" vs "self-reliance" etc. Maps inversely to ONT_H (high authoritarianism → low malleability belief).

### 4.9 ONT_S — System ontology (1=rigged, 5=institutions can produce good change)

| Source | Coverage | Variables |
|--------|----------|-----------|
| CES Cumulative | WEAK | `approval_pres`, `approval_rep` are situational not structural |
| CES year-specific | DERIVED | "System rigged" items appear in 2016+ |
| ANES Cumulative VCF | STRONG-DIRECT | `VCF0604` trust in government (always/some/never), `VCF0606` benefits few/many |
| ANES per-year | STRONG-DIRECT | Trust-in-institutions battery (gov, courts, media, science) — V162310-series in 2016 |

**Mapper note**: ONT_S has strong ANES coverage via long-running trust items. CES-only mapper will lean on year-specific institutional-trust questions.

### 4.10 EPS — Epistemic style (categorical: empiricist, institutionalist, traditionalist, intuitionist, autonomous, nihilist)

| Source | Coverage | Variables |
|--------|----------|-----------|
| CES Cumulative | MISSING | (none) |
| CES year-specific | DERIVED | `newsint` + 2018+ media-trust items |
| ANES Cumulative VCF | DERIVED | Trust-in-media + science-trust items |
| ANES per-year | PROXY | 2020 includes "faith in experts/science" battery; 2024 likely similar |

**Mapper note**: EPS is a 6-category latent — surveys give 2-3 dimensions of evidence (media trust, science trust, religious authority). v0 mapper should output a probability distribution over the 6 categories with substantial uncertainty rather than a hard assignment.

### 4.11 AES — Aesthetic style (categorical: statesman, technocrat, pastoral, authentic, fighter, visionary)

| Source | Coverage | Variables |
|--------|----------|-----------|
| All sources | MISSING | Surveys do not directly probe aesthetic preference |

**Mapper note**: AES has zero survey coverage. Per ADR-003 it's archetype-label flavor and not load-bearing for vote prediction. v0 mapper should set AES to uniform prior across all 6 categories, or infer weakly from candidate-feeling-thermometer differentials (someone who warms to fighter-style candidates probably has fighter AES).

### 4.12 PF — Political fusion (1=independent, 5=strong partisan)

| Source | Coverage | Variables |
|--------|----------|-----------|
| CES Cumulative | STRONG-DIRECT | `pid7` (7-point), `pid3_leaner` |
| CES year-specific | STRONG-DIRECT | Same as cumulative |
| ANES Cumulative VCF | STRONG-DIRECT | `VCF0301` (7-pt PID), `VCF0305` (strength) |
| ANES per-year | STRONG-DIRECT | Standard V20xx04 PID items |

**Mapper note**: PF maps cleanly. `pid7` ∈ {1..7} → PF position ∈ {5,4,3,3,3,4,5} (strength-based, not direction-based since PF is partisan-strength not partisan-side).

### 4.13 TRB — Tribal pull (1=universalist, 5=tribal in-group)

| Source | Coverage | Variables |
|--------|----------|-----------|
| CES Cumulative | PROXY | `pid7` strength + race/religion demographics give a starting point |
| CES year-specific | DERIVED | Out-party-thermometer gap (where available); group-membership items |
| ANES Cumulative VCF | STRONG-DIRECT | Feeling-thermometer-gap measures: own-party - other-party (`VCF0201` - `VCF0202`); own-race - other-race; own-religion - other-religion. This IS the "affective polarization" measure that has been heavily studied. |
| ANES per-year | STRONG-DIRECT | All thermometers present each cycle |

**Mapper note**: TRB is well-covered in ANES via affective-polarization style differentials. CES-only mapper has weaker coverage; would need to fall back to demographic-strength × partisan-strength interaction.

### 4.14 ENG — Engagement (1=apolitical, 5=highly engaged)

| Source | Coverage | Variables |
|--------|----------|-----------|
| CES Cumulative | STRONG-DIRECT | `newsint` (news interest), `intent_turnout_self`, `voted_turnout_self`, `vv_turnout_gvm` (validated) |
| CES year-specific | STRONG-DIRECT | Plus political-discussion-with-others items in some years |
| ANES Cumulative VCF | STRONG-DIRECT | Interest in campaign, follow politics, voted in past elections — multiple VCF items |
| ANES per-year | STRONG-DIRECT | Same plus social-media political activity (2016+) |

**Mapper note**: ENG maps cleanly. Validated turnout (`vv_turnout_gvm`) is the gold-standard component; combine with `newsint` for the position estimate.

---

## 5. Coverage matrix summary

| Node | CES Cumulative | CES year | ANES VCF | ANES year |
|------|----------------|----------|----------|-----------|
| MAT | proxy | strong | strong | strong |
| CD | weak | strong | strong | strong |
| CU | weak | strong | proxy | strong |
| MOR | weak | derived | derived | derived |
| morBoundaries | derived | derived | derived | derived |
| PRO | missing | weak | proxy | weak/derived |
| COM | missing | missing | weak | weak/derived |
| ZS | weak | derived | derived | strong |
| ONT_H | missing | missing | derived | proxy |
| ONT_S | weak | derived | strong | strong |
| EPS | missing | derived | derived | proxy |
| AES | missing | missing | missing | missing |
| PF | strong | strong | strong | strong |
| TRB | proxy | derived | strong | strong |
| ENG | strong | strong | strong | strong |

**Best-covered**: MAT, CD, PF, ENG, ONT_S, TRB (when ANES is included)
**Weakest-covered**: AES, COM, ONT_H, PRO

---

## 6. Top 10 mapper-risk gaps

Ranked by combined severity (impact on PRISM signature accuracy × difficulty of inference):

1. **AES has zero survey coverage anywhere.** No item probes "fighter vs statesman vs visionary" preference. Mapper has to either set AES to uniform prior (loses information) or infer from candidate-feeling-thermometers (circular for vote prediction). Per ADR-003, AES is archetype-label flavor — uniform prior may be acceptable but **the simulator's coalition reports won't differentiate AES**.

2. **morBoundaries 7-vector × intensity is the highest-stakes derived inference.** No survey carries this construct natively. Must be assembled from 5-7 separate item families (national-identity, race-thermometer-gap, religious salience, class-thermometer-gap, ideological-thermometer-gap, gender items, partisan-thermometer-gap). Risk: fitting decisions baked in here propagate through every vote-prediction call. **Prototype the morBoundaries derivation on 2020 ANES first** before rolling forward to other years — it's the most error-prone component.

3. **ONT_H requires Feldman-Stenner authoritarianism battery — only present in ANES, not CES.** CES-only modeling cannot estimate ONT_H beyond uniform prior. If the simulator must run on CES (because of sample-size needs), ONT_H is effectively missing for the CES path. Decision needed: drop ONT_H from CES electorates or impute from demographics (risky).

4. **COM is essentially unmeasurable from survey data.** Direct items rare; even derived inference (partisan strength × ideological strength) is weak. Mapper output for COM will be near-uniform-prior across the electorate. **This may matter more than expected** because COM is one of two MEANS-cluster nodes. Consider whether engine vote-prediction is sensitive to COM uncertainty.

5. **CES Cumulative has zero issue-attitude variables.** Every issue mapping requires merging year-specific Common Content. This is a per-year manual mapping task — same `CC16_*` pattern doesn't auto-translate to `CC20_*` because question wording, response options, and topic numbers shift between cycles. **Budget for ~40-60 hours of variable-mapping work per cycle**.

6. **ANES year-specific variable codes are not stable across cycles.** The 2020 codebook uses `V202xxx`; 2016 used `V162xxx`; 2012 used `V120xxx`. Cross-year mapping requires either using the cumulative VCF (limited content) or per-year variable-name translations.

7. **PRO and COM together cover the entire MEANS cluster weakly.** With AES also missing, the MEANS cluster of PRISM is the worst-served by survey data. Vote predictions will be more accurate on ENDS (MAT/CD/CU/MOR) than on MEANS-driven differences. **This may bias which kinds of candidate matchups the simulator handles well** (issue-divergent matchups: handled; style-divergent matchups: poor).

8. **TRB requires feeling-thermometer differentials that aren't in CES.** CES carries `pid7` and demographics but not the partisan/racial/religious thermometers needed for affective-polarization style TRB scoring. CES-only TRB will be a crude proxy; ANES is needed for high-fidelity TRB.

9. **2024 ANES variable codes not yet directly verified.** Full release dropped 2025-08-08 but the PDF endpoint returned 403 to WebFetch in this pass. Mapper implementation needs to manually pull and parse the 2024 codebook before coding 2024 mappings. Same for 2024 CES — verified existence and N=60K, but no per-variable verification yet.

10. **VCF item availability is year-restricted.** ANES Cumulative drops items that don't appear in ≥3 studies; some long-running items (women's role `VCF0834`, abortion `VCF0837`) have coverage gaps in early waves; gay-rights items only appear from 1988+; immigration items only from 1992+. Mapper needs per-(node × year) availability matrix, not assumption that VCF spine works uniformly across 1948-2024.

---

## 7. Open questions for follow-up

- Does the simulator need ANES for backtesting validation, or is CES enough? (CES has 5× the sample size; ANES has 5× the issue-attitude richness.)
- For pre-2008 backtesting (if it expands), do we use CCES 2006 + ANES alone, or sub in GSS/Pew?
- For the morBoundaries module: prototype derivation on which dump first — 2020 ANES (most data) or 2016 ANES (matches existing PRISM candidate signatures already calibrated to 2016)?
- Two-stage mapping vs joint factor model? Two-stage = compute each node's posterior independently; joint = factor-analyze all issue items jointly and project onto 14-dim. Joint is statistically cleaner but harder to debug.

---

## 8. Files in this intake

- `ces-anes-codebook-intake.md` (this file)
- `variable-catalog-v0.json` — machine-readable companion (per-PRISM-node variable lists with coverage labels)

No engine code modified. No commits made.
