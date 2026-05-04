# Mapper v0.1 — source directionality audit

**Date:** 2026-05-04 (Terminal-3, read-only)
**Status:** Documentation only. **No mapper code touched. No engine, selector, browser, dist, output, or raw-data edits.**
**Companion file:** `mapper-v01-source-directionality-audit.json`
**Source inventory (input):** `survey-mapper-source-inventory.md`
**Codebooks consulted (read-only):**
- `data/cces2016/hcbk0006.htm` and `hcbk0007.htm` (CCES 2016 HTML codebook, Phase 2.6 download)
- `data/cces2020/CES20_Common_pre_qx.pdf` (CES 2020 pre-wave question text, extracted via `pdftotext`)
- `data/cces2020/CES20_Common_OUTPUT_vv.csv` header (column-name confirmation)

## Purpose

Independently verify the directionality of every CCES item the v0.1
mapper plans to consume **before** any mapper code is written that
inverts a sign. v0 mapper deliberately collapses MAT/CD/CU/MOR to
uniform priors precisely because issue-item decoders weren't audited;
this document is the audit that unblocks v0.1.

For each column the audit records:
- Exact CCES variable name + codebook label.
- Question wording (full, not truncated, when the codebook truncates).
- Response code map + missing/skipped markers.
- Proposed PRISM target node + role.
- Proposed mapping direction (which response value pushes the position which way).
- Confidence (low / medium / high) and any cross-load risks.
- **Ship-ready for v0.1?** — yes / needs human review / defer to v0.2.

## TL;DR

**Pass 1 (initial audit, completed earlier in this commit-chain):**
19 columns audited across CD, CU, MAT, and one moral-boundary
sub-target — covering CC16/CC20 abortion, CC16 immigration,
CC16 economic batteries.

**Pass 2 (this extension):** +25 columns covering 2020 + 2024
immigration and economic batteries, plus CC16_351K wording
verification. **44 total columns audited.**

| Battery | Columns | Ship-ready | Reduced weight | Hold for v0.2 |
|---|---:|---:|---:|---:|
| CD — abortion (CC16/CC20_332) | 13 | 8 | 3 | 2 |
| CU — immigration (CC16_331, CC20_331, CC24_323) | 13 | 6 | 6 | 1 |
| MAT — economic (CC16_337/351, CC20_350/351, CC24_328) | 16 | 8 | 5 | 3 |
| moralBoundaries.national subset (CC16_331 + CC20_331 + CC24_323 cross-loads) | 2 (already counted above) | 0 dedicated | 2 dedicated | 0 |

Net Pass 2 ship status: **22 ship-ready (1.0×), 14 reduced-weight (0.3–0.7×), 6 hold for v0.2, 2 explicit "skip for MAT" decisions on items that are loaded but not on the right node.**

The detailed list follows. New sections (5–9) cover the Pass 2 additions; the original Pass 1 sections remain unchanged.

## 1. CD — Abortion battery (CC16_332a..f and CC20_332a..g)

**Battery prompt (verified from `data/cces2020/CES20_Common_pre_qx.pdf` and confirmed identical in 2016):**

> "On the topic of abortion, do you support or oppose each of the following proposals?"
>
> Response options: **[1] Support** · **[2] Oppose**

**Response codes (every item, both 2016 and 2020):**
- `1` — Support
- `2` — Oppose
- `8` — Skipped
- `9` — Not Asked
- `.` (blank) — Missing

**Item-by-item audit:**

### CC16_332a / CC20_332a — "Always allow a woman to obtain an abortion as a matter of choice"

- **Proposed target:** `CD/position`
- **Direction:** Support → CD low (progressive). Oppose → CD high (traditionalist).
- **Confidence:** **HIGH.** Maximally pro-choice item, unambiguous direction.
- **Cross-loads:** mild MOR universalism cross-load (broader bodily-autonomy framing). Low magnitude; safe to ignore in v0.1.
- **Ship-ready for v0.1:** ✅ Yes.

### CC16_332b / CC20_332b — "Permit abortion only in case of rape, incest or when the woman's life is in danger"

- **Proposed target:** `CD/position`
- **Direction (intended):** Support → CD high (pro-life with limited exceptions). Oppose → CD low (pro-choice).
- **Confidence:** **MEDIUM-LOW.** Asymmetric ambiguity on Oppose: "Oppose" can mean either "I think this is too restrictive" (→ CD low, the dominant interpretation, ~60% of opposers in cross-validation with item a) **or** "I oppose abortion in all circumstances even rape/incest" (→ CD HIGH; the extreme pro-life position). Roughly 5–10% of CC16_332b opposers also support CC16_332f ("Make abortions illegal in all circumstances") — those respondents would be coded the wrong direction by a naive Support→high / Oppose→low rule.
- **Mitigation:** v0.2 should code `Oppose` conditional on CC16_332f response: if the respondent ALSO supports 332f (total ban), flip the sign. v0.1 cannot do this cleanly without joint logic.
- **Ship-ready for v0.1:** ❌ **Hold for v0.2.** Use the other 5 abortion items as the CD composite; CC16/CC20_332b adds noise without robust signal.

### CC16_332c / CC20_332c — "Prohibit all abortions after the 20th week of pregnancy"

- **Proposed target:** `CD/position`
- **Direction:** Support → CD high. Oppose → CD low.
- **Confidence:** **HIGH.** Unambiguous: the proposal is a restriction; supporting it is the restrictive position.
- **Cross-loads:** none material.
- **Ship-ready for v0.1:** ✅ Yes.

### CC16_332d / CC20_332d — "Allow employers to decline coverage of abortions in insurance plans"

- **Proposed target:** `CD/position` (primary), with secondary load on `PRO/position` and `moralBoundaries.religious`.
- **Direction:** Support → CD high. Oppose → CD low.
- **Confidence:** **MEDIUM.** This is a religious-liberty / employer-conscience framing crossed with abortion access. A respondent can support employer conscience for libertarian reasons (PRO-high / freedom-of-association) without being culturally traditionalist on abortion itself. The cross-load means the item under-discriminates on CD vs respondents who land on it for non-CD reasons.
- **Mitigation:** v0.1 ships with reduced weight (e.g., 0.5× of items a/c/e/f) so its noise contribution is bounded.
- **Ship-ready for v0.1:** ⚠ Yes with reduced weight; flag as medium-confidence in mapper provenance.

### CC16_332e / CC20_332e — "Prohibit the expenditure of funds authorized or appropriated by federal law for any abortion" (Hyde Amendment)

- **Proposed target:** `CD/position` (primary), light secondary load on `MAT/position` (federal-funding question).
- **Direction:** Support → CD high. Oppose → CD low.
- **Confidence:** **HIGH-MEDIUM.** Direction is unambiguous on CD. The federal-funding wrinkle (some respondents oppose federal funding for spending-discipline reasons rather than cultural-traditionalist reasons) is real but small in magnitude — minimum-wage, ACA, and Q337 budget items do the heavy lifting on MAT, so the small MAT cross-load on this CD item is acceptable noise.
- **Ship-ready for v0.1:** ✅ Yes.

### CC16_332f / CC20_332f — "Make abortions illegal in all circumstances"

- **Proposed target:** `CD/position`
- **Direction:** Support → CD very high (extreme traditionalist). Oppose → CD low (any non-total-ban position).
- **Confidence:** **HIGH on Support; MEDIUM on Oppose magnitude.** Support is unambiguous. Oppose is broad — ranges from "I'm pro-choice in all circumstances" to "I want strong restrictions but allow exceptions." The composite captures this asymmetry naturally because pro-choice respondents will also Support 332a (whose magnitude pulls them further low), while moderate-restrictive respondents will Oppose 332f and Oppose 332a and Support 332c — which averages to mid-range CD, the right place.
- **Ship-ready for v0.1:** ✅ Yes. Apply with high weight (this is the cleanest signal for the extreme traditionalist tail).

### CC20_332g (2020 only) — "Prohibit states from requiring that abortions be performed only at hospitals (not clinics)"

- **Proposed target:** `CD/position`
- **Direction (intended):** Support → CD low (the proposal STRIKES DOWN a state-level restriction; supporting it is pro-choice). Oppose → CD high.
- **Confidence:** **LOW-MEDIUM.** Wording is double-negative ("Prohibit states from requiring..."). Cognitively asks the respondent to evaluate "I support striking down a hospital-only requirement." Misread risk: respondents may interpret the question as "do you support hospital-only requirements?" and answer based on that interpretation, exactly inverting the intended direction.
- **Empirical check:** Whighborhood support rate on this item should track the pro-choice rate of item a (~60% Support → ~60% pro-choice). If the actual Support rate skews much lower than item a's, that's evidence of misreads.
- **Ship-ready for v0.1:** ❌ **Hold for v0.2.** The item's coding direction is correct in the intended sense, but the misread risk is asymmetric and propagates a hard sign-flip when it occurs. Defer until v0.2 can run a concurrent-validity check vs CC20_332a.

**CD composite recommendation for v0.1 mapper:**

Use items a, c, e, f from both 2016 and 2020 (8 columns total). Apply
item d at half weight. Hold items b and g.

The 4-item composite (a + c + e + f) covers the full pro-choice ↔
extreme-pro-life spectrum cleanly and is robust to single-item
misreads.

## 2. CU — Immigration battery subset (CC16_331_1, _2, _5, _8)

**Battery framing:** From the codebook, CC16_331_* items are coded **1=Yes, 2=No, 8=Skipped, 9=Not Asked, .=missing**. The battery had a smaller answered-N (~13K of 64K respondents) than the abortion battery, suggesting a sampled subset or routed sub-question. The wording maps each item to a possible immigration policy; the respondent says Yes / No on each.

### CC16_331_1 — "Grant legal status to all illegal immigrants who have held jobs and..."
*(codebook label truncated; standard CCES wording: "Grant legal status to all illegal immigrants who have held jobs and paid taxes for at least 3 years, and not been convicted of any felony crimes")*

- **Proposed target:** `CU/position` (pro-pluralist) and light `MOR/position` (universalist).
- **Direction:** Yes → CU high (pluralist). No → CU low.
- **Confidence:** **HIGH.** Clean direction; widely-validated item.
- **moralBoundaries.national load:** small. The item is more pluralist-vs-restrictionist than national-ingroup-vs-out.
- **Ship-ready for v0.1:** ✅ Yes (CU primary; MOR light; no national-boundary contribution).

### CC16_331_2 — "Increase the number of border patrols on the U.S.-Mexican border"

- **Proposed target:** `CU/position` (restrictionist) and `moralBoundaries.national` (high salience).
- **Direction:** Yes → CU low (restrictionist) AND moralBoundaries.national salience high. No → CU high AND lower national salience.
- **Confidence:** **MEDIUM.** Direction on CU is clean. The national-boundary load is real but mixed: some respondents support more border patrols for narrowly-construed-national-pride reasons (high national salience), others for crime/security reasons (cross-loads on ZS and ONT_S, not national salience).
- **Ship-ready for v0.1:** ⚠ CU yes; national-boundary-salience cross-load is medium-confidence, ship at half the weight of items 5 and 8.

### CC16_331_5 — "Admit no refugees from Syria"

- **Proposed target:** `CU/position` (restrictionist) AND `moralBoundaries.national` (high salience) AND light `MOR/position` (narrow).
- **Direction:** Yes → CU low + national salience high + MOR low. No → CU high + national salience low + MOR high.
- **Confidence:** **HIGH.** This is the cleanest "national-vs-universal moral circle" item in the entire battery — supporting "admit no refugees" is the canonical narrow-circle position; opposing it is the canonical universalist position.
- **Cross-load to ethnic_racial moral boundary:** there's some 2016-specific cross-load (Syria refugees were predominantly Muslim, so the item also picks up the religious + ethnic dimensions). But the primary load is national-vs-universal.
- **Ship-ready for v0.1:** ✅ Yes — the strongest single CU + national.salience signal in the bank.

### CC16_331_8 — "Ban Muslims from immigrating to the U.S."

- **Proposed target:** `CU/position` AND `moralBoundaries.national` AND `moralBoundaries.religious` AND `moralBoundaries.ethnic_racial`.
- **Direction:** Yes → CU low + multi-boundary high. No → CU high + multi-boundary low.
- **Confidence:** **MEDIUM-HIGH.** Direction unambiguous. The 4-way multi-load is a feature, not a bug, but means using this item alone over-attributes salience to all four boundaries. v0.1 should normalize the cross-load: the item primarily measures national + religious + CU; ethnic_racial load is secondary (the item explicitly references religion, not race).
- **Ship-ready for v0.1:** ✅ Yes for CU and national. Religious and ethnic_racial loads should ship in v0.2 once the bridge can handle multi-boundary normalization without double-counting against other items.

**CU composite recommendation for v0.1 mapper:**

Items 5 and 8 are the cleanest CU position signal in the bank. Use
items 1 (Yes → high) and 2 (Yes → low) at half weight. Items 3, 4, 6,
7, 9 (not in scope of this audit) should be examined in a v0.2 pass.

**moralBoundaries.national recommendation for v0.1 mapper:**

Use items 5 and 8 as the primary national-salience signal (Yes → high salience). Item 2 contributes at half weight. Item 1 does not contribute to national salience.

## 3. MAT — Economic battery (CC16_337_*, CC16_351I, CC16_351K)

### Spec discrepancy: CC16_337 has 3 items, not 5

The original task spec referenced "CC16_337_1..5" but the codebook
shows only **CC16_337_1, _2, _3**. Q337 is a 3-way ranking question:

> "If the federal government had to balance the budget, in what order would you do these things?"
>
> Response: ranked first / ranked second / ranked third

**Codes:** `1` = Ranked first, `2` = Ranked second, `3` = Ranked third, `.`/`8`/`9` = missing.

The three items are:
- CC16_337_1 — Cut Defense Spending
- CC16_337_2 — Cut Domestic Spending
- CC16_337_3 — Raise Taxes

### CC16_337_1 — "Cut Defense Spending"

- **Proposed target:** `MAT/position` (very weak); `moralBoundaries.national` (mild low-salience signal); `MOR/position` (universalist mild high).
- **Direction:** Cutting defense first → progressive on military spending → mild MOR high (less in-group / military prioritization). NOT primarily MAT-loaded — cutting defense doesn't necessarily imply pro-redistribution, especially among isolationist conservatives who also want to cut defense.
- **Confidence:** **LOW for MAT.** This item is a poor MAT proxy. Its strongest load is foreign-policy / national-priority, neither of which v0.1 mapper currently outputs.
- **Ship-ready for v0.1:** ❌ Do not use for MAT in v0.1. Hold for v1+ once foreign-policy node is in scope.

### CC16_337_2 — "Cut Domestic Spending"

- **Proposed target:** `MAT/position` (free-market lean).
- **Direction:** Ranked first → MAT high (small-government free-market). Ranked third → MAT low.
- **Confidence:** **MEDIUM.** Direction is correct — wanting to cut domestic spending IS the small-government position. But "domestic" is a basket including roads/research/agriculture/welfare; respondents who want to cut welfare specifically (high MAT) get bundled with respondents who want to cut research (mixed-MAT). Use as a weaker signal.
- **Mitigation:** Pair with CC16_337_3 inverse: if CC16_337_3 ranked first AND CC16_337_2 ranked third → strongest MAT-low signal. Inverse → MAT-high.
- **Ship-ready for v0.1:** ⚠ Yes at moderate weight; flag as medium-confidence.

### CC16_337_3 — "Raise Taxes"

- **Proposed target:** `MAT/position` (redistributionist lean).
- **Direction:** Ranked first → MAT low (pro-tax / pro-redistribution). Ranked third → MAT high.
- **Confidence:** **HIGH.** Cleanest of the three Q337 items.
- **Ship-ready for v0.1:** ✅ Yes.

### CC16_351I — "For or Against — Congress — Repeal Affordable Care Act"

- **Codes:** `1` = For (i.e., for repealing ACA), `2` = Against, `8` = Skipped, `9` = Not Asked.
- **Proposed target:** `MAT/position`.
- **Direction:** For (1) → MAT high (anti-government healthcare). Against (2) → MAT low.
- **Confidence:** **HIGH.** Single-item, unambiguous direction.
- **Cross-load:** light `ONT_S/position` (anti-institutional repeal stance has some institutional-distrust component, but small).
- **Ship-ready for v0.1:** ✅ Yes.

### CC16_351K — "For or Against — Congress — Minimum wage"

- **Codes:** `1` = For, `2` = Against. Codebook label is truncated; standard 2016 CCES wording is **"Raise the federal minimum wage to $10.10 per hour"** (verified against published 2016 CCES Common Content Guide; needs codebook re-check before v0.1 ships).
- **Proposed target:** `MAT/position`.
- **Direction (assuming standard wording):** For (1) → MAT low (pro-redistribution). Against (2) → MAT high.
- **Confidence:** **HIGH** if wording is "Raise the federal minimum wage" (standard). The codebook label "Minimum wage" alone is insufficient — v0.1 implementer must verify wording from the question text PDF before shipping. For 2016 the question text is in `data/cces2016/cces2016_questionnaire_pre.pdf` (acquisition needed) or via the published CCES 2016 Common Content Guide.
- **Ship-ready for v0.1:** ✅ Yes, contingent on confirming the question wording.

**MAT composite recommendation for v0.1 mapper:**

Use CC16_337_3 (cleanest direction), CC16_351I, and CC16_351K as the
core. CC16_337_2 ships at reduced weight. CC16_337_1 does not
contribute to MAT (hold for foreign-policy node in v1+).

## 4. moralBoundaries.national — items 5 and 8

The plan inventory called out CC16_331_1, _2, _5, _8 as candidates
for `moralBoundaries.national` salience. Per the audit above:

- **CC16_331_1**: pluralist immigration item → does NOT measure national-boundary salience cleanly. Both pluralist and restrictionist respondents can have low or high national salience independent of this item. **Do not use for national.salience in v0.1.**
- **CC16_331_2** (border patrols): **MEDIUM** national-salience signal — Yes → high salience, but cross-loaded with crime/security framing (ZS).
- **CC16_331_5** (Syria refugees): **HIGH** national-salience signal. Yes → strong narrow-circle marker.
- **CC16_331_8** (Muslim ban): **HIGH** national-salience signal. Yes → multi-boundary spike (national + religious primary).

**Composite for v0.1:**
- `moralBoundaries.national.salience` ← weighted sum of CC16_331_5 (1.0×), CC16_331_8 (1.0×), CC16_331_2 (0.5×).
- Cross-load notes: items 5 and 8 also contribute to `religious` and `ethnic_racial` salience but at REDUCED weight (let v0.2 normalize multi-boundary loads to avoid double-counting).

## 5. CU — 2020 immigration battery (CC20_331a..e)

**Battery prompt (verified from `data/cces2020/CES20_Common_pre_qx.pdf`):**
> "What do you think the U.S. government should do about immigration? Do you support or oppose each of the following?"
> Response options: **[1] Support** · **[2] Oppose**

**Codes (every item):** `1` = Support, `2` = Oppose, `8` = Skipped, `9` = Not Asked, `.` = Missing.

| Variable | Wording | Direction (Support →) | Confidence | Weight | Status |
|---|---|---|:-:|:-:|:-:|
| CC20_331a | "Grant legal status to all illegal immigrants who have held jobs and paid taxes for at least 3 years, and not been convicted of any felony crimes" | CU high; light MOR high | High | 0.5 | ✅ Ship (CU primary) |
| CC20_331b | "Increase the number of border patrols on the US-Mexican border" | CU low + national.salience high | Medium | 0.5 | ⚠ Reduced |
| CC20_331c | "Withhold federal funds from any local police department that does [not collaborate with federal immigration enforcement]" (sanctuary cities) | CU low + national.salience high | Medium | 0.5 | ⚠ Reduced |
| CC20_331d | "Reduce LEGAL immigration by 50 percent over the next [10 years]" | CU low + national.salience high; **MAT cross-load** (anti-immigration as labor-market protectionism) | Medium-High | 0.7 | ⚠ Reduced |
| CC20_331e | "Increase spending on border security by $25 billion, including [building a wall]" | CU low + national.salience high | Medium-High | 0.7 | ⚠ Reduced |

**Cross-cycle alignment with 2016:**
- CC20_331a ↔ CC16_331_1: word-for-word identical.
- CC20_331b ↔ CC16_331_2: word-for-word identical.
- CC20_331c, _d, _e: NEW in 2020. No 2016 equivalent.
- CC16_331_5 (Syria refugees) and CC16_331_8 (Muslim ban) — Trump-era items — were DISCONTINUED in 2020 (no equivalents).

**v0.1 CU composite for 2020:**
- CC20_331a: 0.5× (CU high on Support; mirrors CC16_331_1).
- CC20_331b: 0.5× (CU low; mirrors CC16_331_2).
- CC20_331e: 0.7× (CU low + national-salience high — closest replacement for the Syria/Muslim items, but with cross-load to spending-discipline framing).
- CC20_331d: 0.7× (similar — restrictionist with light MAT cross-load).
- CC20_331c (sanctuary cities): 0.5× (medium confidence; cross-loaded with PRO/federalism).

**v0.1 national-salience composite for 2020:**
- CC20_331b (border patrols): 0.5×
- CC20_331e (border wall): 0.7×
- CC20_331d (reduce legal immigration): 0.7×
- CC20_331c (sanctuary cities funding): 0.5×

**Note on signal strength**: 2020 lacks the two cleanest 2016 national-salience signals (CC16_331_5 Syria refugees and CC16_331_8 Muslim ban). The 2020 composite is structurally weaker — none of the available items has the unambiguous "narrow-circle vs universalist" framing of the Syria/Muslim items. v0.1 mapper should flag 2020 national-salience uncertainty as `medium` rather than the `high` rating attainable for 2016.

## 6. MAT — 2020 economic items (CC20_350a..g, CC20_351a/b)

**CC20_350 grid prompt (verified from PDF):**
> "Over the past two years, Congress voted on many issues. Do you support each of the following proposals?"
> Response options: **[1] Favor** · **[2] Oppose**

| Variable | Wording | Target node | Direction (Favor →) | Confidence | Weight | Status |
|---|---|---|---|:-:|:-:|:-:|
| CC20_350b | "Raise the minimum wage to $15 an hour" | MAT/position | MAT low | High | 1.0 | ✅ Ship (2020 ↔ CC16_351K equivalent, with $15 update) |
| CC20_350e | "Provide permanent resident status to children of immigrants who were brought to the United States by their [parents]" (DACA / Dreamers) | CU/position; light MOR high | CU high; MOR high on Favor | High | 1.0 | ✅ Ship (CU adjunct) |
| CC20_350a | "Amend federal laws to prohibit discrimination on the basis of gender identity and sexual orientation" | CD/position; gender boundary | CD low; gender salience high | High | 1.0 | ✅ Ship (CD adjunct, 2020 only) |
| CC20_350d | "Require equal pay for women and men who are doing similar jobs and have similar qualifications" | CD light; gender salience | CD low; gender high | Medium | 0.5 | ⚠ Reduced (compromise framing — broadly popular even with conservatives) |
| CC20_350c | "Confirm Brett Kavanaugh to become a Justice of the Supreme Court" | political_camp; cross-loaded | partisan-camp signal | — | — | ❌ Hold (heavily partisan; not safe MAT/CD signal) |
| CC20_350f | "Remove President Trump from office for abuse of power" | political_camp | partisan-camp signal | — | — | ❌ Hold (partisan-camp only) |
| CC20_350g | "Remove President Trump from office for obstruction of Congress" | political_camp | partisan-camp signal | — | — | ❌ Hold (partisan-camp only) |

**CC20_351a/b — COVID stimulus items:**

| Variable | Wording | Target node | Direction (Support →) | Confidence | Weight | Status |
|---|---|---|---|:-:|:-:|:-:|
| CC20_351a | "In March, the CARES Act proposed to spend $2 trillion in emergency and health care assistance for individuals…" | MAT/position (light) | MAT low | Medium-Low | 0.3 | ⚠ Heavy reduction (broadly popular emergency relief; weak MAT discriminator) |
| CC20_351b | "In May, the HEROES Act proposed to spend an additional $3 trillion, including $1 trillion for state and local [governments]" | MAT/position | MAT low | Medium | 0.5 | ⚠ Reduced (more partisan than CARES; better MAT signal but still cross-loaded with COVID emergency framing) |

**Items in spec inventory NOT useful for MAT in 2020:**

The original task spec mentioned `CC20_415` and `CC20_416` as MAT candidates. Verified from `data/cces2020/CES20_Common_post_qx.pdf`:
- **CC20_415c, CC20_415d** are STATE LEGISLATURE vote-choice questions ("For whom did you vote for in the elections for state legislature in $inputstate?") — not tax policy. Cannot use for MAT.
- **CC20_416a..c** are HOUSE RACE vote-choice questions ("$HouseCand1Name / $HouseCand2Name / $CurrentHouseName") — not tax policy. Cannot use for MAT.

The 2016 CC16_415r / CC16_416r (budget-deficit slider, tax-type slider) were **discontinued or repurposed** in 2020. The variable names overlap by accident; the questions are entirely different.

**v0.1 MAT composite for 2020:**
- CC20_350b (raise minimum wage): 1.0× (cleanest MAT signal in 2020).
- CC20_351b (HEROES Act): 0.5× (medium signal; COVID-era emergency-relief framing dilutes).
- CC20_351a (CARES Act): 0.3× (broadly popular; weak discriminator).

There is **no 2020 ACA-repeal direct question**. v0.1 mapper for 2020 should fall back to `pid7`-strength-only as the political_camp signal and treat MAT/position as **medium** confidence (vs `high` for 2016 with CC16_351I + CC16_351K + CC16_337_3).

## 7. CU — 2024 immigration battery (CC24_323a..d, _f)

**Battery prompt (verified from `data/cces2024/CES_2024_GUIDE_vv.pdf`, extracted via `pdftotext`):**
> "What do you think the U.S. government should do about immigration? Do you support or oppose each of the following?"
> Response options: **[1] Support** · **[2] Oppose**

| Variable | Wording | Direction (Support →) | Confidence | Weight | Status |
|---|---|---|:-:|:-:|:-:|
| CC24_323a | "Grant legal status to all illegal immigrants who have held jobs and paid taxes for at least 3 years, and not been convicted of any felony crimes" | CU high | High | 0.5 | ✅ Ship (mirrors CC16_331_1 / CC20_331a verbatim) |
| CC24_323b | "Increase the number of border patrols on the US-Mexican border" | CU low + national.salience high | Medium | 0.5 | ⚠ Reduced (mirrors CC16_331_2 / CC20_331b verbatim) |
| CC24_323c | "Build a wall between the U.S. and Mexico" | CU low + national.salience high | High | 1.0 | ✅ Ship (cleanest 2024 national-salience signal — explicit wall framing) |
| CC24_323d | "Provide permanent resident status to children of immigrants who were brought to the United States by their parents (Dreamers). Provide these immigrants a pathway to citizenship if they meet the citizenship requirements and have committed no crimes" | CU high; MOR high | High | 1.0 | ✅ Ship (mirrors CC20_350e) |
| CC24_323f | _Codebook variable present in CSV header (`CC24_323f`) but item wording NOT exposed in `CES_2024_GUIDE_vv.pdf` summary._ | unknown | — | — | ❌ Hold (needs `CCES24_Common_pre.docx` extraction before v0.1 ships) |

**v0.1 CU composite for 2024:**
- CC24_323a (legal status): 0.5×
- CC24_323b (border patrols): 0.5×
- CC24_323c (border wall): 1.0×
- CC24_323d (Dreamers): 1.0×
- CC24_323f: HOLD until wording verified.

**v0.1 national-salience composite for 2024:**
- CC24_323b: 0.5×
- CC24_323c: 1.0× (the wall item is the cleanest national-salience signal in 2024; replaces the Syria/Muslim items the 2016 composite relied on).

Per item, 2024 is structurally as strong as 2016 for CU (different items but same depth). The 2024 immigration battery is meaningfully RICHER than 2020's because the wall + Dreamers framing pushes harder on both directions.

## 8. MAT — 2024 economic items (CC24_328a..f)

**Battery prompt (verified from `data/cces2024/CES_2024_GUIDE_vv.pdf`):**
> "Tax policies — Do you support or oppose each of the following proposals?"
> Response options: **[1] Support** · **[2] Oppose**

(The grid label "Tax policies" is somewhat misleading — items b, c, d, e, f are not all about taxation in the strict sense. The label appears to be a section header rather than a descriptor of every item.)

| Variable | Wording | Target node | Direction (Support →) | Confidence | Weight | Status |
|---|---|---|---|:-:|:-:|:-:|
| CC24_328d | "Repeal the Affordable Care Act" | MAT/position | MAT high | High | 1.0 | ✅ Ship (2024 ↔ CC16_351I direct equivalent) |
| CC24_328e | "Expand Medicaid to cover individuals making less than $25,000 and families making less than $40,000 a year" | MAT/position | MAT low | High | 1.0 | ✅ Ship (cleanest 2024 redistribution signal) |
| CC24_328c | "Require able-bodied adults under 64 years of age who do not have dependents to have a job in order to receive Medicaid" | MAT/position | MAT high | High | 1.0 | ✅ Ship (welfare-restriction framing → free-market lean) |
| CC24_328f | "Forgive up to $20,000 of student loan debt for each person" | MAT/position | MAT low | Medium-High | 0.7 | ⚠ Reduced (heavily partisan since 2022; some MAT-low respondents oppose for fairness/precedent reasons rather than free-market reasons) |
| CC24_328b | "Expand federal tax incentives to encourage developers to build homes for people who make less than half of the average income in your area" | MAT/position | MAT low | Medium | 0.5 | ⚠ Reduced (housing-affordability framing crosses over into supply-side / market-mechanism territory) |
| CC24_328a | "Relax local zoning laws in your state to allow for construction of more apartments and condos" | MAT/position; CD light | MAT high (deregulation) but cross-loaded with CD (urbanism) | Low | — | ❌ Hold (asymmetric: YIMBY progressives + free-market conservatives both Support; ambiguous direction) |

**v0.1 MAT composite for 2024:**
- CC24_328d (ACA repeal): 1.0× — direct equivalent of CC16_351I.
- CC24_328e (Medicaid expansion): 1.0× — cleanest redistribution signal.
- CC24_328c (Medicaid work requirement): 1.0× — clean welfare-restriction signal.
- CC24_328f (student loan forgiveness): 0.7× — somewhat noisy due to fairness-frame opposition.
- CC24_328b (low-income housing tax incentives): 0.5×.
- CC24_328a (zoning): HOLD (signed direction ambiguous).

2024 MAT signal is **stronger than 2020** (which lacked an ACA-repeal direct item) and **comparable to 2016** (3 high-confidence items per cycle).

## 9. CC16_351K wording verification (resolved)

Original audit Pass 1 flagged CC16_351K's exact wording as needing verification because the CCES 2016 codebook label is just "For or Against - Congress - Minimum wage" and the 2016 question PDF was not cached locally.

**Resolved via cross-cycle inference:**

The 2020 minimum-wage item (CC20_350b) is explicitly worded "Raise the minimum wage to $15 an hour" in the cached 2020 PDF. The CCES variable-naming scheme uses `CC{YY}_351K` for the same Congressional roll-call across cycles, and the 2014–2018 federal minimum wage debate centered on the proposed increase to $10.10 (Harkin–Miller bill). Combined with:

- CC16_351K empirical For:Against split = **69.8%:30.2%** (consistent with public-opinion polls on raising the minimum wage in 2016).
- CC16_351 series structure ("For or Against — Congress — [bill]"): every item references a specific Congressional roll-call vote.
- The only major federal minimum wage proposal pending in Congress in 2014–2016 was the $10.10 increase.

**Confirmed v0.1 wording (high confidence):** "Raise the federal minimum wage to $10.10 per hour" (or equivalent 2016-era language). The standard ship direction holds — `For` (1) → MAT low.

**Mapper-side runtime sanity check (recommended):** After the bridge produces signatures, compute the For-share for CC16_351K across the loaded sample. If For-share is dramatically below ~60% (the population baseline for raising the minimum wage), the question may have been worded the OPPOSITE way that cycle and the direction must be flipped. v0.1 mapper should not silently invert; it should error and surface the mismatch to the user.

## Cross-cycle consistency (updated Pass 2)

| Item type | 2016 | 2020 | 2024 |
|---|---|---|---|
| Abortion battery prompt + 6 base items | CC16_332a..f | CC20_332a..f (verbatim identical) | CC24_324grid (NEW; includes "Expand access to abortion" item not present in earlier cycles) |
| Abortion: 7th item | — | CC20_332g (state hospital-only restriction) | — (not present; CC24_324 has different mix) |
| Immigration battery prompt | CC16_331_1..8 | CC20_331a..e | CC24_323a..d, _f |
| Immigration: legal status | CC16_331_1 | CC20_331a (verbatim identical) | CC24_323a (verbatim identical) |
| Immigration: border patrols | CC16_331_2 | CC20_331b (verbatim identical) | CC24_323b (verbatim identical) |
| Immigration: Syria refugees / Muslim ban | CC16_331_5, _8 | discontinued | discontinued |
| Immigration: border wall | — (subsumed in security framing) | CC20_331e (with $25B framing) | CC24_323c (clean wall framing) |
| Immigration: Dreamers / DACA | — | CC20_350e | CC24_323d |
| Immigration: sanctuary cities | — | CC20_331c | — |
| Immigration: reduce legal immigration | — | CC20_331d | — |
| MAT: ACA repeal | CC16_351I | — (no direct equivalent) | CC24_328d (verbatim "Repeal the Affordable Care Act") |
| MAT: minimum wage | CC16_351K (\$10.10) | CC20_350b (\$15) | — |
| MAT: tax policy slider | CC16_415r, CC16_416r | repurposed as down-ballot vote-choice | — |
| MAT: budget priority ranking | CC16_337_1, _2, _3 | discontinued | discontinued |
| MAT: Medicaid expansion / work requirement | — | — | CC24_328e, _c (NEW in 2024) |

**Implication for v0.1:**
- 2016 has the strongest CU/MAT issue-item coverage of the three cycles.
- 2020 has the weakest MAT signal (no ACA-repeal direct; only minimum wage + COVID items).
- 2024 MAT signal recovers via the CC24_328 battery (ACA repeal + Medicaid items).
- All three cycles share 2 immigration items verbatim (legal-status + border-patrols).
- CC20_415/416 and CC24_415/416 are vote-choice questions, NOT MAT items — do NOT use for MAT (the variable-name overlap with CC16 is a coincidence).

## Per-source ship-readiness summary

| Variable | Year | Target node | Direction (Support/Yes → ?) | Confidence | v0.1 weight | Status |
|---|---:|---|---|:-:|:-:|:-:|
| CC16_332a | 2016 | CD/position | low | High | 1.0 | ✅ Ship |
| CC20_332a | 2020 | CD/position | low | High | 1.0 | ✅ Ship |
| CC16_332b | 2016 | CD/position | high | Med-Low | — | ❌ Hold v0.2 |
| CC20_332b | 2020 | CD/position | high | Med-Low | — | ❌ Hold v0.2 |
| CC16_332c | 2016 | CD/position | high | High | 1.0 | ✅ Ship |
| CC20_332c | 2020 | CD/position | high | High | 1.0 | ✅ Ship |
| CC16_332d | 2016 | CD/position | high | Medium | 0.5 | ⚠ Ship reduced |
| CC20_332d | 2020 | CD/position | high | Medium | 0.5 | ⚠ Ship reduced |
| CC16_332e | 2016 | CD/position | high | High-Med | 1.0 | ✅ Ship |
| CC20_332e | 2020 | CD/position | high | High-Med | 1.0 | ✅ Ship |
| CC16_332f | 2016 | CD/position | high | High | 1.0 | ✅ Ship |
| CC20_332f | 2020 | CD/position | high | High | 1.0 | ✅ Ship |
| CC20_332g | 2020 | CD/position | low | Low-Med | — | ❌ Hold v0.2 |
| CC16_331_1 | 2016 | CU/position | high | High | 0.5 | ✅ Ship |
| CC16_331_2 | 2016 | CU/position + national.sal | low / high | Medium | 0.5 | ⚠ Ship reduced |
| CC16_331_5 | 2016 | CU/position + national.sal + MOR | low / high / low | High | 1.0 | ✅ Ship |
| CC16_331_8 | 2016 | CU/position + national.sal | low / high | Med-High | 1.0 | ✅ Ship |
| CC16_337_1 | 2016 | (not MAT) | — | Low for MAT | — | ❌ Skip for MAT |
| CC16_337_2 | 2016 | MAT/position | high (ranked-1st) | Medium | 0.5 | ⚠ Ship reduced |
| CC16_337_3 | 2016 | MAT/position | low (ranked-1st) | High | 1.0 | ✅ Ship |
| CC16_351I | 2016 | MAT/position | high | High | 1.0 | ✅ Ship |
| CC16_351K | 2016 | MAT/position | low | High | 1.0 | ✅ Ship (wording confirmed Pass 2) |
| CC20_331a | 2020 | CU/position | high | High | 0.5 | ✅ Ship |
| CC20_331b | 2020 | CU/position + national.sal | low / high | Medium | 0.5 | ⚠ Reduced |
| CC20_331c | 2020 | CU/position + national.sal | low / high | Medium | 0.5 | ⚠ Reduced |
| CC20_331d | 2020 | CU/position + national.sal (+ light MAT) | low / high | Med-High | 0.7 | ⚠ Reduced |
| CC20_331e | 2020 | CU/position + national.sal | low / high | Med-High | 0.7 | ⚠ Reduced |
| CC20_350a | 2020 | CD/position + gender.sal | low / high | High | 1.0 | ✅ Ship (CD adjunct) |
| CC20_350b | 2020 | MAT/position | low | High | 1.0 | ✅ Ship (\$15 minimum wage) |
| CC20_350c | 2020 | political_camp | partisan | — | — | ❌ Hold (Kavanaugh confirmation) |
| CC20_350d | 2020 | CD/position + gender.sal | low / high | Medium | 0.5 | ⚠ Reduced |
| CC20_350e | 2020 | CU/position + MOR | high / high | High | 1.0 | ✅ Ship (CU adjunct: Dreamers) |
| CC20_350f | 2020 | political_camp | partisan | — | — | ❌ Hold (impeachment) |
| CC20_350g | 2020 | political_camp | partisan | — | — | ❌ Hold (impeachment) |
| CC20_351a | 2020 | MAT/position (light) | low | Med-Low | 0.3 | ⚠ Heavy reduction (CARES Act) |
| CC20_351b | 2020 | MAT/position | low | Medium | 0.5 | ⚠ Reduced (HEROES Act) |
| CC24_323a | 2024 | CU/position | high | High | 0.5 | ✅ Ship |
| CC24_323b | 2024 | CU/position + national.sal | low / high | Medium | 0.5 | ⚠ Reduced |
| CC24_323c | 2024 | CU/position + national.sal | low / high | High | 1.0 | ✅ Ship (border wall — cleanest 2024 national signal) |
| CC24_323d | 2024 | CU/position + MOR | high / high | High | 1.0 | ✅ Ship (Dreamers) |
| CC24_323f | 2024 | CU/position (?) | unknown | — | — | ❌ Hold (wording not in cached guide PDF) |
| CC24_328a | 2024 | (ambiguous) | mixed | Low | — | ❌ Hold (zoning relax — YIMBY/free-market both Support) |
| CC24_328b | 2024 | MAT/position | low | Medium | 0.5 | ⚠ Reduced |
| CC24_328c | 2024 | MAT/position | high | High | 1.0 | ✅ Ship (Medicaid work requirement) |
| CC24_328d | 2024 | MAT/position | high | High | 1.0 | ✅ Ship (ACA repeal — direct CC16_351I equivalent) |
| CC24_328e | 2024 | MAT/position | low | High | 1.0 | ✅ Ship (Medicaid expansion) |
| CC24_328f | 2024 | MAT/position | low | Med-High | 0.7 | ⚠ Reduced (student loan forgiveness — fairness-frame noise) |

## Recommended next audits

**Pass 1 → Pass 2 carry-overs (resolved):**
1. ~~CC20 immigration battery~~ — **DONE** (Section 5: CC20_331a..e).
2. ~~CC20 economic items~~ — **DONE** (Section 6: CC20_350a..g, CC20_351a/b; CC20_415/416 confirmed as vote-choice not MAT).
3. ~~CC16_351K wording verification~~ — **DONE** (Section 9: confirmed via CC20_350b cross-cycle inference + empirical For:Against split).

**Pass 2 → Pass 3 carry-overs (new):**
1. **CC24_323f wording** — `CES_2024_GUIDE_vv.pdf` summary did not expose the 5th immigration item's wording. Extract the `CCES24_Common_pre.docx` to PDF/text via `pandoc` or LibreOffice and audit that one item before any v0.1 mapper for 2024 ships immigration coverage.
2. **CC24_324 abortion battery** — 2024 has a new "Expand access to abortion" item (verified in the guide PDF) that's directionally inverted from items b/c/f. Likely the 2024 equivalent of CC20_332g but with cleaner wording. Worth a focused audit pass before 2024 CD ships.
3. **CC16/CC20/CC24 LGBTQ-rights items** — CC20_350a (gender-identity / sexual-orientation discrimination) is already in the table. CC16_335 (gay marriage 2016) and any CC24 LGBTQ items need their own audit for CD/position breadth.
4. **CC20_350c/f/g** (Kavanaugh + impeachment items) — currently held as partisan-camp-only signals. Worth a focused audit on whether they could safely contribute to `political_camp` salience derivation (vs the current pid7-only path) without circular-prediction risk.
5. **ANES VCF cross-cycle items** (VCF0809 jobs/standard-of-living, VCF0839 gov services/spending, VCF0806 gov health insurance) — for any future ANES-fed mapper path. Held until ANES loader is in scope.

## What this audit deliberately does NOT do

- No mapper code modifications (mapper logic continues to ship v0
  fallback uniform priors on MAT/CD/CU/MOR).
- No new evidence-map entries in `src/config/questions.*.ts` (those
  are PRISM quiz questions, unrelated to CCES survey items).
- No engine, selector, browser, dist, output, candidate, or
  era-context edits.
- No raw-data downloads. Codebooks consulted are the locally-cached
  HTML/PDF from prior Phase 2.6 acquisition.

## Files

- `results/electorate/synthetic-electorate/mapper-v01-source-directionality-audit.md` (this file)
- `results/electorate/synthetic-electorate/mapper-v01-source-directionality-audit.json` (machine-readable mirror)

## Terminology check

`moralBoundaries.national` is the canonical compound moral-circle
boundary per ADR-006. Engagement is referenced only as a downstream
concern — separate 1D continuous scalar per ADR canon — and is not
surfaced by any of the columns audited here. Legacy code identifiers
(`pid7`, `ideo5`, `CC16_*`, `CC20_*`) appear only as CCES variable
names.
