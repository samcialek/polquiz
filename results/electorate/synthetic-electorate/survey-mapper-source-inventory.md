# Survey-to-PRISM Mapper Source Inventory (Phase 2.7.8)

**Run at:** 2026-05-04T15:11:40.733Z
**Status:** Read-only diagnostic. **The mapper is NOT modified by this inventory.**

## What this answers

Cross-references actual column-header lists from each year's CCES/CES file against a curated candidate-source dictionary for the targets currently blocked by the v0 mapper (per Phase 2.7.7's coverage audit). Per blocked target: which columns are present in which years, with strength labels (strong / proxy / weak / not_usable), why each maps, and what directionality must be verified before wiring. Plus a v0.1 implementation priority list of the 3-5 safest targets to map first.

**Forbidden columns** (presidential / House / Senate vote choice, candidate thermometers, validated-vote-turnout for position-node inputs, pid7 / pid3 for non-political_camp targets) are inventoried separately so the next mapper PR knows what NOT to pull in.

**Not in scope**: actual mapper changes, vote prediction, candidate distance, abstention calibration, scorer wiring.

## Year header scan

| Year | File | Columns | CC{Y2}_* count | pew_* count | CL_* count | File present |
|---|---|---:|---:|---:|---:|:--:|
| 2008 | `data/cces2008/cces_2008_common.tab` | 477 | 0 | 0 | 0 | ✓ |
| 2012 | `data/cces2012/CCES12_Common_VV.tab` | 490 | 0 | 4 | 0 | ✓ |
| 2016 | `data/cces2016/CCES16_Common_OUTPUT_Feb2018_VV.tab` | 563 | 269 | 4 | 9 | ✓ |
| 2020 | `data/cces2020/CES20_Common_OUTPUT_vv.csv` | 717 | 328 | 4 | 8 | ✓ |
| 2024 | `data/cces2024/CCES24_Common_OUTPUT_vv_topost_final.csv` | 694 | 318 | 4 | 0 | ✓ |

## Per-target inventory

### MAT (currently blocked)

| Candidate column | Strength | Years present | Rationale | Directionality |
|---|---|---|---|---|
| `economy_retro` | proxy | (none) | Retrospective economic evaluation; correlates with material orientation but also tracks partisan thermometer | Worse-economy answer roughly co-moves with redistributionist position; verify per cycle (sign can flip during incumbent-out years). |
| `faminc` | weak | 2012, 2016 | Family income — weak correlate of material preferences | Lower income → MAT 1-2 (redistributionist). Effect is small; not load-bearing alone. |
| `faminc_new` | weak | 2020, 2024 | Renamed family-income column in some 2020+ releases | Same as `faminc`. |
| `investor` | proxy | 2012, 2016, 2020, 2024 | Stock ownership; correlates with free-market lean | Owns stocks → MAT 4-5 (free-market). |
| `no_healthins` | proxy | (none) | Uninsured; correlates with healthcare-expansion preference | Uninsured → MAT 1-2 (expand gov role). |
| `union` | proxy | 2012, 2016, 2020, 2024 | Union household; left-economic correlate (also feeds moralBoundaries.class) | Union member → MAT 1-2. |
| `CC{Y2}_337_1` | strong | 2016 | Federal-spending battery item 1 (per A2 spec) | Support cuts → MAT 4-5. |
| `CC{Y2}_337_2` | strong | 2016 | Federal-spending battery item 2 | Support cuts → MAT 4-5. |
| `CC{Y2}_337_3` | strong | 2016 | Federal-spending battery item 3 | Support cuts → MAT 4-5. |
| `CC{Y2}_337_4` | strong | (none) | Federal-spending battery item 4 | Support cuts → MAT 4-5. |
| `CC{Y2}_337_5` | strong | (none) | Federal-spending battery item 5 | Support cuts → MAT 4-5. |
| `CC{Y2}_415r` | strong | 2016 | Deficit-reduction means (cuts vs taxes vs both) | Prefer cuts → MAT 4-5; prefer taxes → MAT 1-2. |
| `CC{Y2}_416r` | strong | 2016 | Tax-type preference | Verify codebook. |
| `CC{Y2}_350a` | strong | 2020 | ACA-related issue item (year-specific position) | Repeal → MAT 4-5. |
| `CC{Y2}_351I` | strong | 2016 | ACA repeal | Repeal → MAT 4-5. |
| `CC{Y2}_351K` | strong | 2016 | Minimum wage increase | Raise → MAT 1-2. |

### CD (currently blocked)

| Candidate column | Strength | Years present | Rationale | Directionality |
|---|---|---|---|---|
| `relig_imp` | weak | (none) | Religion importance; weak proxy (also feeds moralBoundaries.religious) | High imp → CD 4-5 (traditionalist). |
| `CC{Y2}_332a` | strong | 2016, 2020 | Abortion battery — always allow as matter of choice | Agree → CD 1-2 (progressive). |
| `CC{Y2}_332b` | strong | 2016, 2020 | Abortion battery — rape/incest exception | Agree → CD 1-2. |
| `CC{Y2}_332c` | strong | 2016, 2020 | Abortion battery — health-of-mother | Agree → CD 1-2. |
| `CC{Y2}_332d` | strong | 2016, 2020 | Abortion battery — restrict after 20 weeks | Agree → CD 4-5 (traditionalist). |
| `CC{Y2}_332e` | strong | 2016, 2020 | Abortion battery — federal funding | Allow funding → CD 1-2. |
| `CC{Y2}_332f` | strong | 2016, 2020 | Abortion battery — total ban | Agree → CD 4-5. |
| `CC{Y2}_335` | strong | 2016 | Gay-marriage / same-sex-couple item | Allow / support → CD 1-2. |
| `CC{Y2}_322a` | proxy | 2016 | LGBT-related items in 2018+ cycles | Pro-rights → CD 1-2. |
| `CC{Y2}_322b` | proxy | 2016 | LGBT-related items in 2018+ cycles | Pro-rights → CD 1-2. |
| `CC{Y2}_322c` | proxy | 2016 | LGBT-related items in 2018+ cycles | Pro-rights → CD 1-2. |

### CU (currently blocked)

| Candidate column | Strength | Years present | Rationale | Directionality |
|---|---|---|---|---|
| `CC{Y2}_331_1` | strong | 2016 | Immigration battery item 1 (per A2 spec) — DACA / pathway | Pluralist answer → CU 4-5; restrictionist → CU 1-2. |
| `CC{Y2}_331_2` | strong | 2016 | Immigration battery item 2 | Same; verify codebook polarity. |
| `CC{Y2}_331_3` | strong | 2016 | Immigration battery item 3 | Same. |
| `CC{Y2}_331_4` | strong | 2016 | Immigration battery item 4 | Same. |
| `CC{Y2}_331_5` | strong | 2016 | Immigration battery item 5 | Same. |
| `CC{Y2}_331_6` | strong | 2016 | Immigration battery item 6 | Same. |
| `CC{Y2}_331_7` | strong | 2016 | Immigration battery item 7 | Same. |
| `CC{Y2}_331_8` | strong | 2016 | Immigration battery item 8 (varies; e.g., English official language) | Same; one item may be `English-only` which inverts polarity. |

### MOR (currently blocked)

| Candidate column | Strength | Years present | Rationale | Directionality |
|---|---|---|---|---|
| `CC{Y2}_331_3` | proxy | 2016 | Refugee item inside immigration battery (where present) | Welcome refugees → MOR 4-5 (universal circle). |
| `CC{Y2}_331_5` | proxy | 2016 | Muslim-related item in some cycles' immigration battery | Anti-Muslim ban → MOR 4-5. |
| `foreign_aid_*` | weak | (none) | Sporadic foreign-aid items | Support aid → MOR 4-5. |

### PRO (currently blocked)

| Candidate column | Strength | Years present | Rationale | Directionality |
|---|---|---|---|---|
| `CC{Y2}_307` | weak | 2016, 2020 | Approve/disapprove of how Congress is doing — institutional-trust proxy | Reject institutions → PRO 1-2. |
| `CC{Y2}_322` | weak | (none) | Election-integrity items in 2020+ | Reject election legitimacy → PRO 1-2. |
| `CC{Y2}_421` | weak | (none) | Voter-ID / ballot-access items | Restrict → PRO 4-5 (rules-prefer). |
| `CC{Y2}_309a` | weak | (none) | Confidence-in-government items | High confidence → PRO 4-5. |

### COM (currently blocked)

| Candidate column | Strength | Years present | Rationale | Directionality |
|---|---|---|---|---|
| `CC{Y2}_compromise` | weak | (none) | Sporadic 'politicians should compromise' items in 2016/2020 (column name varies) | Pro-compromise → COM 4-5. |
| `CC{Y2}_315` | weak | (none) | Where present, a fight-vs-compromise item | Pro-compromise → COM 4-5. |

### ZS (currently blocked)

| Candidate column | Strength | Years present | Rationale | Directionality |
|---|---|---|---|---|
| `economy_retro` | proxy | (none) | Pessimistic economic framing correlates with zero-sum lens (weak) | Worse-economy → ZS 4-5 (zero-sum). |
| `CC{Y2}_330a` | weak | 2016, 2020, 2024 | Trade items in some cycles ('other countries gain at our expense') | Trade-zero-sum answer → ZS 4-5. |
| `CC{Y2}_321` | weak | (none) | Immigration-takes-jobs framing where present | Takes-jobs → ZS 4-5. |

### ONT_H (currently blocked)

| Candidate column | Strength | Years present | Rationale | Directionality |
|---|---|---|---|---|
| `CC{Y2}_authoritarian_1` | weak | (none) | Feldman-Stenner child-rearing battery is rare in CCES; mostly ANES | Verify item exists; default ANES path. |
| `CC{Y2}_authoritarian_2` | weak | (none) | Same | Same. |
| `CC{Y2}_authoritarian_3` | weak | (none) | Same | Same. |
| `CC{Y2}_authoritarian_4` | weak | (none) | Same | Same. |
| `ONT_H_proxy_unavailable` | not_usable | (none) | CCES does not ship the Feldman-Stenner authoritarianism battery in standard form; mapping must wait for ANES integration | n/a |

### ONT_S (currently blocked)

| Candidate column | Strength | Years present | Rationale | Directionality |
|---|---|---|---|---|
| `pew_govrun` | proxy | (none) | 'Government for the few or for all' — system-trust proxy | For-all answer → ONT_S 4-5 (high systemic trust). |
| `CC{Y2}_309a` | weak | (none) | Trust-in-government items where present | Trust answer → ONT_S 4-5. |
| `trust_*` | weak | (none) | Various 'trust in [institution]' items — sporadic | High trust → ONT_S 4-5. |

### EPS (currently blocked)

| Candidate column | Strength | Years present | Rationale | Directionality |
|---|---|---|---|---|
| `newsint` | weak | 2012, 2016, 2020, 2024 | News-interest level — doesn't directly probe epistemic style but provides a weak engagement-adjacent prior | n/a — fallback prior near-uniform is appropriate. |
| `media_news_*` | weak | (none) | News-source items where present (which outlets respondent trusts) — partial signal | Source pattern → empiricist/intuitionist split; needs prototype calibration. |
| `CC{Y2}_300_1` | weak | 2016, 2020, 2024 | Where a 'science-of-X' or 'experts' item exists (rare in CCES standard) | Pro-science → empiricist. |
| `EPS_proxy_unavailable` | not_usable | (none) | CCES does not directly probe epistemic-style category; surveys would need an EPS-prototype battery to discriminate cleanly | n/a |

### AES (currently blocked)

| Candidate column | Strength | Years present | Rationale | Directionality |
|---|---|---|---|---|
| `AES_proxy_unavailable` | not_usable | (none) | Surveys do not directly probe aesthetic-style category. Acknowledged in the spec as inherently fallback for the v0/v1 mapper — would need a deliberately-designed AES battery (statesman vs technocrat vs pastoral vs authentic vs fighter vs visionary cues) that does not currently exist in CCES. | n/a |

### moralBoundaries.national (currently blocked)

| Candidate column | Strength | Years present | Rationale | Directionality |
|---|---|---|---|---|
| `CC{Y2}_331_1` | strong | 2016 | Immigration restrictiveness composite — direct national-boundary signal | Restrictive → high salience. |
| `CC{Y2}_331_2` | strong | 2016 | Immigration restrictiveness composite | Restrictive → high salience. |
| `CC{Y2}_331_5` | strong | 2016 | Anti-Muslim-ban → low salience; pro-ban → high salience | Restrictive → high salience. |
| `CC{Y2}_331_8` | proxy | 2016 | English-only-language item where present — national-identity signal | English-only → high salience. |
| `CC{Y2}_322_pride` | proxy | (none) | American-pride / national-identity items where present | Strong-pride → high salience. |

### moralBoundaries.ethnic_racial (currently blocked)

| Candidate column | Strength | Years present | Rationale | Directionality |
|---|---|---|---|---|
| `CC{Y2}_440a` | proxy | 2020, 2024 | Race-policy / race-relations items in 2020+ cycles (BLM-era) | Race-conscious → high salience. |
| `CC{Y2}_440b` | proxy | 2020, 2024 | Race-policy items | Same. |
| `CC{Y2}_440c` | proxy | 2020, 2024 | Race-policy items | Same. |
| `CC{Y2}_aff_action` | weak | (none) | Affirmative-action items where present (column name varies by cycle) | Pro-AA → high salience for race-conscious respondents. |

### moralBoundaries.gender (currently blocked)

| Candidate column | Strength | Years present | Rationale | Directionality |
|---|---|---|---|---|
| `CC{Y2}_335` | weak | 2016 | Gay-marriage / same-sex item — gender-adjacent | Salience proxy via opinion intensity. |
| `CC{Y2}_322a` | weak | 2016 | LGBTQ items in 2018+ | Same. |
| `CC{Y2}_metoo` | weak | (none) | Sporadic Me Too / sexual-harassment items in 2018+ (column name varies) | Engaged → high salience. |
| `CC{Y2}_337_g` | weak | (none) | Equal-pay / women-in-workforce items where present | Engaged → high salience. |

## Forbidden columns (must NOT enter matching, sampling, scoring, or position-mapping)

| Pattern | Reason | Matches per year |
|---|---|---|
| `/^CC\d{2}_410[a-z]?$/` | Presidential vote choice (modern cycle convention CC{Y2}_410[a]) — would create vote-prediction circularity | 2016: [`CC16_410a`, `CC16_410b`]; 2020: `CC20_410`; 2024: `CC24_410` |
| `CC410` | Presidential vote choice (2008 V###-era column) | 2008: `CC410` |
| `CC410a` | Presidential vote choice (legacy column) | 2012: `CC410a` |
| `/^CC\d{2}_41[1-3][a-z]?$/` | House / Senate vote choice (CC{Y2}_411 / 412 / 413) — same circularity | 2016: [`CC16_411`, `CC16_412`, `CC16_413a`, … +3 more]; 2020: [`CC20_411`, `CC20_411b`, `CC20_412`, … +1 more]; 2024: [`CC24_411`, `CC24_411b`, `CC24_412`, … +1 more] |
| `/^CC\d{2}_3(20|30)[a-z]?$/` | Candidate feeling thermometer batteries (CC{Y2}_320*, CC{Y2}_330*) — vote-affect circularity for position nodes | 2016: [`CC16_320a`, `CC16_320b`, `CC16_320c`, … +9 more]; 2020: [`CC20_320a`, `CC20_320b`, `CC20_320c`, … +8 more]; 2024: [`CC24_330a`, `CC24_330b`, `CC24_330c`, … +8 more] |
| `CC{Y2}_310` | Candidate evaluations / approval — vote-affect adjacent | _no matches in scanned headers_ |
| `intent_turnout_self` | Pre-election turnout intent — engagement-only input; forbidden as a position-node feature | _no matches in scanned headers_ |
| `voted_turnout_self` | Self-reported turnout — engagement-only input; forbidden for position nodes | _no matches in scanned headers_ |
| `CL_E2016GVM` | Validated turnout — engagement-only input; forbidden for position nodes (would cross-contaminate vote-prediction backtest) | 2016: `CL_E2016GVM` |
| `CL_2020gvm` | Validated turnout — engagement-only input; forbidden for position nodes | 2020: `CL_2020gvm` |
| `vote_gen08` | Validated turnout — engagement-only input; forbidden for position nodes | 2008: `vote_gen08` |
| `pid7` | Party ID 7-pt — allowed only as `partyIdDerived: true` input to `moralBoundaries.political_camp` salience per the mapper's design; FORBIDDEN as input to MAT/CD/CU/MOR/PRO/COM/ZS/ONT_H/ONT_S core position nodes (would make vote-prediction circular) | 2012: `pid7`; 2016: `pid7`; 2020: `pid7`; 2024: `pid7` |
| `pid3` | Party ID 3-pt — same restriction as pid7 | 2012: `pid3`; 2016: `pid3`; 2020: `pid3`; 2024: `pid3` |

## v0.1 implementation priority list (3-5 safest targets to map first)

### #1 — `CD`

- **Why first**: Abortion battery (CC{Y2}_332a-f) is well-covered in 2012/2016/2020/2024 with stable directionality across cycles. Direct issue-attitude alignment with PRISM cultural-direction. Low circularity risk.
- **Required column templates**: `CC{Y2}_332a`, `CC{Y2}_332b`, `CC{Y2}_332c`, `CC{Y2}_332d`, `CC{Y2}_332e`, `CC{Y2}_332f`
- **Cycles fully covered**: 2016, 2020
- **Sequencing**: Ship first because the abortion battery's polarity is the most stable across cycles. Will move CD off uniform-prior fallback to ~5-6 real-signal targets per row. Cross-cycle holdout possible (4 cycles × 6 items).

**Per-template column presence** (column template → year → present?):

| Template | 2008 | 2012 | 2016 | 2020 | 2024 |
|---|:--:|:--:|:--:|:--:|:--:|
| `CC{Y2}_332a` | ✗ | ✗ | ✓ | ✓ | ✗ |
| `CC{Y2}_332b` | ✗ | ✗ | ✓ | ✓ | ✗ |
| `CC{Y2}_332c` | ✗ | ✗ | ✓ | ✓ | ✗ |
| `CC{Y2}_332d` | ✗ | ✗ | ✓ | ✓ | ✗ |
| `CC{Y2}_332e` | ✗ | ✗ | ✓ | ✓ | ✗ |
| `CC{Y2}_332f` | ✗ | ✗ | ✓ | ✓ | ✗ |

### #2 — `CU`

- **Why first**: Immigration battery (CC{Y2}_331_1..8) is the next-most-covered standard battery. Direct issue-attitude alignment with cultural-uniformity. Mostly stable polarity (one English-only item may flip).
- **Required column templates**: `CC{Y2}_331_1`, `CC{Y2}_331_2`, `CC{Y2}_331_3`, `CC{Y2}_331_4`, `CC{Y2}_331_5`, `CC{Y2}_331_6`, `CC{Y2}_331_7`, `CC{Y2}_331_8`
- **Cycles fully covered**: 2016
- **Sequencing**: Ship together with target #4 (moralBoundaries.national) because both consume the same battery — saves one column-resolver pass.

**Per-template column presence** (column template → year → present?):

| Template | 2008 | 2012 | 2016 | 2020 | 2024 |
|---|:--:|:--:|:--:|:--:|:--:|
| `CC{Y2}_331_1` | ✗ | ✗ | ✓ | ✗ | ✗ |
| `CC{Y2}_331_2` | ✗ | ✗ | ✓ | ✗ | ✗ |
| `CC{Y2}_331_3` | ✗ | ✗ | ✓ | ✗ | ✗ |
| `CC{Y2}_331_4` | ✗ | ✗ | ✓ | ✗ | ✗ |
| `CC{Y2}_331_5` | ✗ | ✗ | ✓ | ✗ | ✗ |
| `CC{Y2}_331_6` | ✗ | ✗ | ✓ | ✗ | ✗ |
| `CC{Y2}_331_7` | ✗ | ✗ | ✓ | ✗ | ✗ |
| `CC{Y2}_331_8` | ✗ | ✗ | ✓ | ✗ | ✗ |

### #3 — `MAT`

- **Why first**: Federal-spending battery (CC{Y2}_337_*) + ACA item (CC{Y2}_351I) + minimum-wage item (CC{Y2}_351K) provide direct issue-attitude alignment with material orientation. Already-mapped weak proxies (faminc, union, investor, no_healthins) can be dropped to secondary support.
- **Required column templates**: `CC{Y2}_337_1`, `CC{Y2}_337_2`, `CC{Y2}_337_3`, `CC{Y2}_337_4`, `CC{Y2}_337_5`, `CC{Y2}_351I`, `CC{Y2}_351K`
- **Cycles fully covered**: _(none — verify column presence per cycle before wiring)_
- **Cycles partially covered**: 2016 _(some required columns present, some absent — document the per-cycle gap before merging)_
- **Sequencing**: Verify column presence per cycle — the spec lists 2016 as the canonical cycle; 2020 likely has a similar battery, 2012/2024 may use different stems. Expect partial coverage outside 2016/2020 and document the per-cycle gap.

**Per-template column presence** (column template → year → present?):

| Template | 2008 | 2012 | 2016 | 2020 | 2024 |
|---|:--:|:--:|:--:|:--:|:--:|
| `CC{Y2}_337_1` | ✗ | ✗ | ✓ | ✗ | ✗ |
| `CC{Y2}_337_2` | ✗ | ✗ | ✓ | ✗ | ✗ |
| `CC{Y2}_337_3` | ✗ | ✗ | ✓ | ✗ | ✗ |
| `CC{Y2}_337_4` | ✗ | ✗ | ✗ | ✗ | ✗ |
| `CC{Y2}_337_5` | ✗ | ✗ | ✗ | ✗ | ✗ |
| `CC{Y2}_351I` | ✗ | ✗ | ✓ | ✗ | ✗ |
| `CC{Y2}_351K` | ✗ | ✗ | ✓ | ✗ | ✗ |

### #4 — `moralBoundaries.national`

- **Why first**: Same immigration battery as CU but used as a salience composite rather than a position decoder. Co-shipping with CU is efficient. The political_camp boundary is already the only `partyIdDerived: true` channel; this fills another always-fallback boundary slot.
- **Required column templates**: `CC{Y2}_331_1`, `CC{Y2}_331_2`, `CC{Y2}_331_5`, `CC{Y2}_331_8`
- **Cycles fully covered**: 2016
- **Sequencing**: Ship with #2. Salience composite = `count of restrictionist answers + intensity`. Document that respondents at extreme-pluralist (CU 4-5) also get high national-boundary salience — the boundary measures *engagement with* the dimension, not direction on it.

**Per-template column presence** (column template → year → present?):

| Template | 2008 | 2012 | 2016 | 2020 | 2024 |
|---|:--:|:--:|:--:|:--:|:--:|
| `CC{Y2}_331_1` | ✗ | ✗ | ✓ | ✗ | ✗ |
| `CC{Y2}_331_2` | ✗ | ✗ | ✓ | ✗ | ✗ |
| `CC{Y2}_331_5` | ✗ | ✗ | ✓ | ✗ | ✗ |
| `CC{Y2}_331_8` | ✗ | ✗ | ✓ | ✗ | ✗ |

### #5 — `ZS`

- **Why first**: Trade items (CC{Y2}_330a where present) + immigration-takes-jobs items provide a narrow but unambiguous zero-sum signal in 2016/2020. Lower priority because items are sparser; ship as a stretch goal alongside #1-#4.
- **Required column templates**: `CC{Y2}_330a`, `CC{Y2}_321`
- **Cycles fully covered**: _(none — verify column presence per cycle before wiring)_
- **Cycles partially covered**: 2016, 2020, 2024 _(some required columns present, some absent — document the per-cycle gap before merging)_
- **Sequencing**: Optional in v0.1. If column presence checks fail in 2012/2024, document and skip those years rather than block the rollout.

**Per-template column presence** (column template → year → present?):

| Template | 2008 | 2012 | 2016 | 2020 | 2024 |
|---|:--:|:--:|:--:|:--:|:--:|
| `CC{Y2}_330a` | ✗ | ✗ | ✓ | ✓ | ✓ |
| `CC{Y2}_321` | ✗ | ✗ | ✗ | ✗ | ✗ |

## Caveats

- **2008**: 2008 uses opaque V### column naming (legacy YouGov scheme). The candidate dictionary's `CC{Y2}_*` patterns therefore expand to `CC08_*` which are absent. 2008 needs a separate per-year resolver pass driven by `data/cces2008/codebook-extracted.txt` to surface candidate columns.
- **AES**: moralBoundaries-adjacent / AES is documented in the survey-to-prism-v0 spec as inherently fallback (surveys do not directly probe aesthetic preference). v0.1 priority correctly omits AES.
- **EPS**: EPS would benefit from a deliberately-designed prototype battery; standard CCES news-source items provide only weak proxy signal.
- **ONT_H**: ONT_H requires the Feldman-Stenner authoritarianism child-rearing battery, which CCES does not ship in standard form. Mapping requires ANES integration (out of v0.1 scope).

## Cross-reference

- The mapper itself: `src/electorate/surveyToPrismMapper.ts` (do not edit from this inventory).
- Coverage audit (the source of the "blocked targets" list): `results/electorate/synthetic-electorate/survey-to-prism-mapper-coverage-audit.{md,json}`.
- Mapping spec: `results/electorate/mapping/survey-to-prism-v0.md` — the candidate dictionary in this audit is anchored to the spec's per-target rationales.
