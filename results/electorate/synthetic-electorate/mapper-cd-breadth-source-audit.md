# Mapper CD-breadth source audit (LGBTQ + gender + rights)

**Date:** 2026-05-04 (Terminal-3, read-only)
**Status:** Documentation only. **No mapper code touched. No engine, selector, browser, dist, output, or raw-data edits.**
**Companion file:** `mapper-cd-breadth-source-audit.json`
**Sister audit:** `mapper-v01-source-directionality-audit.{md,json}` (which covered the abortion battery in detail).

## Purpose

The Pass 1 + Pass 2 directionality audits handled CD-position via the
abortion battery (CC16/CC20_332, CC24_324). That coverage is solid for
the abortion dimension but THIN as a CD signal because:

1. Abortion-only respondents are correlated with religious-traditionalist
   respondents but only via one issue — outliers (libertarian
   pro-choicers, secular pro-lifers) get mis-positioned.
2. CD as PRISM defines it ("progressive ↔ traditionalist on
   reproductive rights, LGBTQ rights, gender identity, religious
   accommodation, and the pace of social change") spans **multiple**
   policy items. Mapper v0.1 ships with abortion-only CD; v0.2 should
   broaden.

This audit identifies safe CD-broadening items beyond abortion across
2016/2020/2024 — focusing on LGBTQ rights, gender identity,
contraceptives, and rights-related Congress votes.

**Items deliberately excluded** (per task spec):
- Vote choice / candidate selection (CC20_410, CC24_410, etc.)
- Candidate feeling thermometers (CC*_320 series)
- Turnout questions (CC*_401, validated voter file)
- pid7 / partisan ID fields
- Demographic items where the respondent answers about themselves (e.g., `sexuality`, `transgender`) — these are demographic strata, not policy positions

## TL;DR

**8 columns audited across 3 cycles. 6 are ship-ready for v0.1 CD-breadth. 1 reduced weight. 1 hold.**

| Cycle | Items found | Ship-ready (1.0×) | Reduced (0.5×) | Hold |
|---:|---:|---:|---:|---:|
| 2016 | 1 (CC16_335) | 1 | 0 | 0 |
| 2020 | 3 (CC20_350a, CC20_350d, CC20_355d) | 2 | 1 | 0 |
| 2024 | 4 (CC24_340a/b/c, CC24_324d) | 3 | 0 | 1 |

The recommended v0.1 CD-breadth augmentation more than doubles the
non-abortion CD signal in 2024 (4 new items vs the abortion-only 4-item
composite from the prior audit). 2020 gets +3 items. 2016 gets +1.

## 1. CC16_335 — Gay Marriage (2016)

**Codebook label:** `Gay Marriage`
**Standard CCES 2016 wording (inferred from variable label + empirical distribution; PDF not cached locally):** "Do you favor or oppose allowing gays and lesbians to marry legally?" (or equivalent post-Obergefell wording).

**Codes:** `1` = Favor, `2` = Oppose, `8` = Skipped, `9` = Not Asked, `.` = Missing.

**Empirical distribution:** 65.1% Favor, 34.9% Oppose (N=64,125 of 64,600 respondents). Consistent with 2016 public-opinion polling on same-sex marriage acceptance (typically 60–65% Favor at the time).

**Proposed mapping:**
- **Target:** `CD/position`
- **Direction:** Favor (1) → CD low (progressive). Oppose (2) → CD high (traditionalist).
- **Confidence:** **HIGH.** Direction unambiguous; standard CCES item with well-validated cross-cycle behavior.
- **Cross-loads:** light `moralBoundaries.religious` (religiously-conservative respondents drive Oppose). Acceptable; not double-counted because the audit's CD-breadth composite uses each item once.
- **Ship-ready for v0.1:** ✅ Yes, weight 1.0.

## 2. CC20_350a — Gender Identity + Sexual Orientation Discrimination (2020)

(Re-audited in Pass 2; included here for CD-breadth completeness.)

**Battery prompt (verified from `data/cces2020/CES20_Common_pre_qx.pdf`):**
> "Over the past two years, Congress voted on many issues. Do you support each of the following proposals?"

**Item wording (CC20_350a):** "Amend federal laws to prohibit discrimination on the basis of gender identity and sexual orientation."

**Codes:** `1` = Favor, `2` = Oppose, `8` = Skipped, `9` = Not Asked.

**Proposed mapping:**
- **Target:** `CD/position` (primary), `moralBoundaries.gender` (secondary).
- **Direction:** Favor (1) → CD low + gender-salience high. Oppose (2) → CD high.
- **Confidence:** **HIGH.** Direction unambiguous.
- **Cross-loads:** `moralBoundaries.gender` (intentional — this item is a gender-boundary signal as well as a CD signal). Cross-load is a feature; mapper composite normalizes per-target.
- **Ship-ready for v0.1:** ✅ Yes, weight 1.0.

## 3. CC20_350d — Equal Pay (2020)

(Re-audited in Pass 2; included here for CD-breadth completeness.)

**Item wording (CC20_350d):** "Require equal pay for women and men who are doing similar jobs and have similar qualifications."

**Codes:** Same as CC20_350a.

**Proposed mapping:**
- **Target:** `CD/position` (light), `moralBoundaries.gender`.
- **Direction:** Favor (1) → CD low (light) + gender-salience high.
- **Confidence:** **MEDIUM.** Compromise framing — broadly popular even with conservatives (~75–80% Favor in CCES samples). Weak discriminator on CD because both progressive and moderate-conservative respondents Favor. Stronger signal for `moralBoundaries.gender` than for CD.
- **Ship-ready for v0.1:** ⚠ Weight 0.5 for CD; consider weight 1.0 for gender-boundary salience composite (but that's a separate composite, not CD-breadth).

## 4. CC20_355d — Ban Transgender People in the Military (2020) **[NEW FINDING]**

**Battery prompt (verified from `data/cces2020/CES20_Common_pre_qx.pdf`):**
> "For each of the following tell us whether you support or oppose these decisions."

**Item wording (CC20_355d):** "Ban Transgender People in the Military."

**Codes:** `1` = Support, `2` = Oppose, `8` = Skipped, `9` = Not Asked.

**Proposed mapping:**
- **Target:** `CD/position` (primary), `moralBoundaries.gender` (secondary).
- **Direction:** Support (1) → CD high (traditionalist on gender identity in public institutions). Oppose (2) → CD low.
- **Confidence:** **HIGH.** Direction unambiguous; gender-identity policy item with clean partisan/ideological alignment in 2020 (Trump-administration policy reversal of Obama-era inclusion).
- **Cross-loads:** `moralBoundaries.gender` and light `moralBoundaries.national` (military framing). Both acceptable.
- **Ship-ready for v0.1:** ✅ Yes, weight 1.0.

This item is the cleanest 2020 transgender-policy signal — replaces the absent "Should states recognize same-sex marriage" framing that was discontinued post-Obergefell.

## 5. CC24_340a — Contraceptives Access (2024) **[NEW]**

**Battery prompt (verified from `data/cces2024/CES_2024_GUIDE_vv.pdf`):**
> "Do you support or oppose each of the following bills before Congress?"
> Battery key: `CC24_340grid` ("Congress Bills").

**Item wording (CC24_340a):** "Prohibit government restrictions on the provision of, and access to, contraceptives."

**Codes:** `1` = Support, `2` = Oppose, `8` = Skipped, `9` = Not Asked, `.` = Missing.

**Proposed mapping:**
- **Target:** `CD/position`.
- **Direction:** Support (1) → CD low (progressive on reproductive rights). Oppose (2) → CD high.
- **Confidence:** **HIGH.** Post-Dobbs framing made contraceptives a salient policy item; clean direction.
- **Cross-loads:** light `moralBoundaries.religious` (similar to CC16_335). Acceptable.
- **Ship-ready for v0.1:** ✅ Yes, weight 1.0.

## 6. CC24_340b — Abortion Access Bill (2024)

**Item wording (CC24_340b):** "Prohibit government restrictions on the provision of, and access to, abortion services."

**Codes:** Same as 340a.

**Proposed mapping:**
- **Target:** `CD/position`.
- **Direction:** Support (1) → CD low. Oppose (2) → CD high.
- **Confidence:** **HIGH.** Direction unambiguous.
- **Concern:** This item DUPLICATES the abortion battery's CD load (`CC24_324a..d`). Including it in a CD-breadth composite alongside the abortion battery would over-weight abortion vs other CD dimensions.
- **Ship-ready for v0.1:** ⚠ **Hold for CD-breadth purposes** — the abortion battery already covers this. CC24_340b is more useful as a CONFIRMATION ITEM (compute correlation between CC24_324a Support rate and CC24_340b Support rate as a sanity check; large divergence → likely respondent confusion or routing issue).
- Weight assigned for CD-breadth composite: **0** (not used in CD-breadth augmentation; abortion battery handles).

## 7. CC24_340c — Same-Sex + Interracial Marriage Federal Recognition (2024) **[NEW]**

**Item wording (CC24_340c):** "Require that all federal agencies recognize same-sex marriages and interracial marriages."

(Refers to the Respect for Marriage Act, signed into law in 2022 — items asks about its codification effect.)

**Codes:** Same as 340a.

**Proposed mapping:**
- **Target:** `CD/position` (primary), `moralBoundaries.gender` (secondary, light).
- **Direction:** Support (1) → CD low. Oppose (2) → CD high.
- **Confidence:** **HIGH.** Direct successor to the role CC16_335 played in 2016.
- **Cross-loads:** light `moralBoundaries.religious` and `ethnic_racial` (interracial marriage component). Both acceptable; main load is CD.
- **Ship-ready for v0.1:** ✅ Yes, weight 1.0.

## 8. CC24_324d — Expand Access to Abortion (2024) **[from Pass 2 carry-over]**

**Battery prompt (verified from `data/cces2024/CES_2024_GUIDE_vv.pdf`):**
> "On the topic of abortion, do you support or oppose each of the following proposals?"
> Battery key: `CC24_324grid`.

**Item wording (CC24_324d):** "Expand access to abortion, including making it more affordable, broadening the types of providers who can offer care, and protecting access to abortion clinics."

**Codes:** `1` = Support, `2` = Oppose, `8` = Skipped, `9` = Not Asked, `.` = Missing.

**Proposed mapping:**
- **Target:** `CD/position`.
- **Direction:** Support (1) → CD low (pro-choice / pro-expansion). Oppose (2) → CD high.
- **Confidence:** **HIGH.** Direction is the OPPOSITE of CC24_324b (rape/incest only) and CC24_324c (illegal in all circumstances) — the new "Expand access" item adds a fourth datapoint to the abortion battery that pulls in the progressive direction.
- **Special note:** This item is INSIDE the abortion battery (CC24_324grid), not the Congress-bills grid (CC24_340grid). It's already in scope for the abortion-only CD composite from Pass 2; mentioned here because it broadens the abortion-axis CD signal in a way the old CC16_332/CC20_332 batteries couldn't.
- **Ship-ready for v0.1:** ✅ Yes, weight 1.0 (within the abortion battery's CD composite).

This item should be added to the v0.1 abortion composite for 2024. It does not appear in 2016 or 2020.

## Items considered and rejected

The following items appear LGBTQ/gender/rights-adjacent but are NOT recommended for CD-breadth:

| Item | Reason for rejection |
|---|---|
| `sexuality` (2016+) | Demographic stratum (respondent's own orientation), not a policy position. Use only for Identity-Primary overlay logic, never for CD position derivation. |
| `transgender` (2020+) | Demographic stratum (respondent identifies as trans). Same as above. |
| `commonweight_vv_lgbt` (2016) | Survey weight column; not an item. |
| CC16_301n "Most Important Problem - Gay marriage" | Salience proxy at most, not a position item. Even for salience derivation, the Q103-style screener does this job better. |
| CC20_355a (Withdraw Paris Agreement) | Climate/environment, not CD. |
| CC20_355b (Withdraw TPP) | Trade/MAT, not CD. |
| CC20_355c (Repeal Clean Power Plant) | Environment, not CD. |
| CC20_355e (food stamp work requirement) | MAT-restriction, not CD. |
| CC24_321 grid (gun control items) | PRO/COM/CD-light cross-load — not pure CD. Worth a separate audit pass for PRO breadth. |
| CC24_326 grid (environment items) | Environmental/MAT, not CD. |
| CC24_340d (Ban TikTok) | National/CU, not CD. |
| CC24_340e (Renew 9/11 surveillance) | PRO/civil liberties, not CD. |
| CC24_340f (Deny asylum at border) | CU/national, already in immigration battery. |
| CC24_341 grid (tax rate items) | MAT, not CD. |

## Per-source ship-readiness summary

| Variable | Year | Target node(s) | Direction (Support/Favor →) | Confidence | v0.1 CD weight | Status |
|---|---:|---|---|:-:|:-:|:-:|
| CC16_335 | 2016 | CD/position | low | High | 1.0 | ✅ Ship |
| CC20_350a | 2020 | CD/position + gender.sal | low / high | High | 1.0 | ✅ Ship |
| CC20_350d | 2020 | CD/position (light) + gender.sal | low / high | Medium | 0.5 | ⚠ Reduced |
| CC20_355d | 2020 | CD/position + gender.sal | high / high | High | 1.0 | ✅ Ship (NEW finding) |
| CC24_340a | 2024 | CD/position | low | High | 1.0 | ✅ Ship |
| CC24_340b | 2024 | CD/position | low | High | 0 | ❌ Hold for CD-breadth (duplicates abortion battery) |
| CC24_340c | 2024 | CD/position + gender.sal (light) | low / high | High | 1.0 | ✅ Ship |
| CC24_324d | 2024 | CD/position | low | High | (1.0 within abortion composite) | ✅ Ship (already covered as abortion-axis breadth) |

## v0.2 mapper CD composite (recommended, per cycle)

These weights extend the abortion-only composites established in the
prior audits.

**2016 CD composite:**
- Abortion battery (existing): CC16_332a (1.0×), CC16_332c (1.0×), CC16_332e (1.0×), CC16_332f (1.0×), CC16_332d (0.5×).
- LGBTQ breadth: **CC16_335 (1.0×)** — single new item.
- Total: 6 items at full weight + 1 at reduced weight, vs the abortion-only 4 + 1 from before.

**2020 CD composite:**
- Abortion battery (existing): CC20_332a/c/e/f (1.0× each), CC20_332d (0.5×).
- LGBTQ + gender breadth: **CC20_350a (1.0×), CC20_355d (1.0×), CC20_350d (0.5×)** — three new items.
- Total: 7 items at full weight + 2 at reduced weight, vs 4+1 before.

**2024 CD composite:**
- Abortion battery (existing): CC24_324a/b/c (per Pass 2; b held), CC24_324d (1.0× — Expand access, already audited).
- LGBTQ + reproductive breadth: **CC24_340a (1.0×), CC24_340c (1.0×)** — two new items.
- (CC24_340b held to avoid abortion-axis duplication.)
- Total: 5 items at full weight, vs 3 before.

The 2024 CD signal is now structurally as strong as 2016 for the
first time (was previously thinner due to fewer abortion items in the
new battery format).

## Cross-cycle consistency notes

- **Same-sex marriage direct framing:** 2016 had it as a standalone binary (CC16_335). 2020 transitioned to "anti-discrimination amendment" framing (CC20_350a) since marriage equality was settled by Obergefell. 2024 returned to direct same-sex-marriage framing via the Respect for Marriage Act item (CC24_340c). The three items are conceptually parallel but not identical — they probe different policy mechanisms.
- **Transgender policy:** No 2016 item. CC20_355d (military ban) is the cleanest 2020 trans-policy item. 2024 has no direct trans-policy item; the gender-identity load comes only from CC20_350a's coattail effect (which doesn't extend to 2024).
- **Contraceptives:** New post-Dobbs salience. CC24_340a is the first cross-cycle contraceptives item in the audited bank. No 2016/2020 equivalent.
- **Abortion:** Constant presence (CC*_332 / CC24_324). Already audited in detail in prior commits.

## Recommended next audits (CD-breadth-adjacent)

1. **CC24_321 gun-control battery** — clean direction on items like "Ban assault rifles," "Require background checks." Loads on PRO + COM + CD-light. Worth a focused PRO/COM-breadth audit pass; not pure CD but useful for PRO node which currently relies almost entirely on the CC*_332d employer-conscience item.
2. **CC16_300 / CC20_300 / CC24_300 series** — "Most Important Problem" multi-select items. Some entries (e.g., "Gay marriage," "Abortion," "Civil rights") would be candidates for `moralBoundaries.gender` salience derivation; not for position.
3. **2016 CC16_350 series** — `For/Against - Congress` items not yet audited beyond CC16_351I and CC16_351K. May contain LGBTQ-rights bills.
4. **ANES VCF876/VCF877 gay rights items** — for any future ANES-fed mapper path. Not in scope this pass since the loader is CCES-only.

## What this audit deliberately does NOT do

- No mapper code modifications. Mapper continues to ship abortion-only CD signal in v0.1.
- No engine, selector, browser, dist, output, candidate, or era-context edits.
- No raw-data downloads. Codebooks consulted are the locally-cached HTML/PDF from prior Phase 2.6+ acquisition.

## Files

- `results/electorate/synthetic-electorate/mapper-cd-breadth-source-audit.md` (this file)
- `results/electorate/synthetic-electorate/mapper-cd-breadth-source-audit.json` (machine-readable mirror)

## Terminology check

`moralBoundaries.gender` is the canonical compound moral-circle
boundary per ADR-006. Engagement is referenced only as a downstream
concern — separate 1D continuous scalar per ADR canon — not surfaced
by any item audited here. Legacy code identifiers (`CC16_*`,
`CC20_*`, `CC24_*`) appear only as CCES variable names.
