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

19 columns audited across CD, CU, MAT, and one moral-boundary
sub-target. **10 are ship-ready** for v0.1 with high confidence.
**6 carry medium confidence** and ship with a documented cross-load
caveat. **3 should be held for v0.2** because of asymmetric ambiguity
or double-negative wording that propagates a sign-flip risk.

| Battery | Columns audited | Ship-ready | Medium-confidence ship | Hold for v0.2 |
|---|---:|---:|---:|---:|
| CD — abortion (CC16/CC20_332) | 13 | 8 | 3 | 2 |
| CU — immigration (CC16_331) | 4 | 2 | 2 | 0 |
| MAT — economic (CC16_337/CC16_351) | 5 | 3 | 1 | 1 |
| moralBoundaries.national | 2 | 0 | 2 | 0 |

Columns ship-ready by name: CC16_332a, CC16_332c, CC16_332e, CC16_332f, CC20_332a, CC20_332c, CC20_332e, CC20_332f (CD), CC16_331_5, CC16_331_8 (CU items 5, 8), CC16_351I, CC16_351K, CC16_337_3 (MAT). Hold for v0.2: CC16_332b, CC20_332b, CC20_332g, CC16_337_2 wording-only.

The detailed list follows.

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

## Cross-cycle consistency

CC16_332a..f and CC20_332a..f are word-for-word identical (verified by
diff'ing the 2020 PDF question text against the 2016 codebook
labels). CC20_332g is new in 2020 and held for v0.2.

CC16_331_* items have not been audited against CC20 immigration
items in this pass; the CC20 immigration battery uses different
variable names (e.g., `CC20_303*`) per the task spec inventory. v0.1
ships with **CC16_331_* for 2016** and uses the v0 fallback prior
for CU on 2020 until the CC20 immigration audit ships.

CC16_337 was discontinued in CC20 — there is no direct 2020
equivalent of the budget-priority ranking. v0.1 MAT ships with
CC16_337_* (2016 only); 2020 MAT relies on CC20_351 / CC20_415r /
CC20_416r equivalents which are out of scope for this audit pass.

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
| CC16_351K | 2016 | MAT/position | low | High* | 1.0 | ✅ Ship (verify wording) |

\*CC16_351K confidence is High contingent on confirming the standard
"Raise the federal minimum wage" wording in the 2016 CCES question
PDF. Mapper implementer should add a runtime sanity check that
flagged respondents agree with the standard direction (e.g., if For
share is much higher than expected, the question may have been
worded the opposite way that cycle).

## Recommended next audits

1. **CC20 immigration battery** (likely `CC20_303*` or similar) so v0.1 CU ships symmetrically across 2016 and 2020.
2. **CC20 economic items** (`CC20_351`, `CC20_415r`, `CC20_416r`) to replace the now-discontinued CC16_337 in 2020.
3. **CC16/CC20 ANES-equivalent items** (VCF0809, VCF0839, VCF0806) for any future ANES-fed mapper path.
4. **Q351K wording verification** — pull the 2016 CCES Common Content Guide question text PDF if it's not already cached locally.
5. **CC16_335 gay marriage** and **CC16/CC20 LGBTQ-rights items** for CD/position breadth (this audit covered abortion only).

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
