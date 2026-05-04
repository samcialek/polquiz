# Mapper 2024 hold-items audit (resolution pass)

**Date:** 2026-05-04 (Terminal-3, read-only)
**Status:** Documentation only. **No mapper code touched. No engine, selector, browser, dist, output, or generated-smoke edits.**
**Companion file:** `mapper-2024-hold-items-audit.json`
**Sister audits:** `mapper-v01-source-directionality-audit.{md,json}`, `mapper-cd-breadth-source-audit.{md,json}`
**Codebooks consulted (read-only):**
- `data/cces2024/CCES24_Common_pre.docx` — extracted via `pandoc -f docx -t plain`
- `data/cces2024/CES_2024_GUIDE_vv.pdf` — re-confirmed via `pdftotext -layout`
- `data/cces2024/CCES24_Common_OUTPUT_vv_topost_final.csv` header — column-name verification

## Purpose

Resolve four 2024-specific items that were on hold or under-documented
in the prior audit passes:

1. **CC24_323f** — flagged "wording not exposed in guide PDF" in Pass 2, held until docx extraction.
2. **CC24_324** abortion battery directionality — verify all 4 items including the new "Expand access" item.
3. **CC24_340a/b/c** — confirm code maps and re-verify the CC24_340b hold (abortion-axis double-counting concern).
4. **CC24_328** MAT battery — confirm code maps for the 2024 economic battery.

## TL;DR

**Major correction surfaced**: `CC24_323f` is NOT a fifth 2024
immigration item. The docx layout proves it is the **student loan
forgiveness item** — a row inside the `CC24_328grid` (Tax policies)
battery whose variable name carries an inherited `_323f` suffix from
upstream survey-design re-use. The prior CC24_323f hold is therefore
**lifted with a documented correction**: the column belongs in the
2024 MAT composite, not the immigration composite.

| Item | Prior status | Pass-3 resolution |
|---|---|---|
| CC24_323f | Hold (wording unknown; assumed immigration item) | ✅ **Resolved as MAT item — student loan forgiveness; weight 0.7× in MAT composite, NOT in CU composite** |
| CC24_324 battery | Pass 2 noted; new "Expand access" item recommended | ✅ Confirmed all 4 items + directions; battery is THINNER than 2016/2020 (only a–d, missing the Hyde / employer / 20-week / total-ban-only items) |
| CC24_340a (contraceptives) | Ship-ready 1.0× per CD-breadth audit | ✅ Code map confirmed identical to abortion battery |
| CC24_340b (abortion access) | Hold for CD-breadth (duplicates abortion battery) | ✅ Hold confirmed; alternative use as confirmation item against CC24_324a/d |
| CC24_340c (same-sex + interracial marriage) | Ship-ready 1.0× per CD-breadth audit | ✅ Code map confirmed identical to abortion battery |
| CC24_328a..e | Pass 2 audited | ✅ Code maps confirmed identical (1=Support, 2=Oppose) |

## Universal code map (all four grids)

The docx confirms a single uniform coding scheme across `CC24_323grid`, `CC24_324grid`, `CC24_328grid`, and `CC24_340grid`:

| Value | Meaning |
|:-:|---|
| `1` | Support |
| `2` | Oppose |
| `8` | Skipped |
| `9` | Not Asked |
| `.` (blank) | Missing (CCES convention; not in docx but standard) |

Battery prompts:
- `CC24_323grid`: "What do you think the U.S. government should do about immigration? Do you support or oppose each of the following?"
- `CC24_324grid`: "On the topic of abortion, do you support or oppose each of the following proposals?"
- `CC24_328grid`: (Tax policies battery — implicit prompt; same Support/Oppose response set)
- `CC24_340grid`: "Do you support or oppose each of the following bills before Congress?"

## 1. CC24_323f — RESOLVED (NOT an immigration item)

**Codebook variable name:** `CC24_323f`
**Battery membership:** `CC24_328grid` (Tax policies) — confirmed by docx layout where the row is listed between `CC24_328e` and the next page break:
```
CC24_328d   Repeal the Affordable Care Act
CC24_328e   Expand Medicaid to cover individuals making less than $25,000 and families making less than $40,000 a year.
CC24_323f   Forgive up to $20,000 of student loan debt for each person
```

**Exact wording:** "Forgive up to $20,000 of student loan debt for each person."

**Why the variable name says `323f`:** YouGov / Qualtrics survey-design carryover. The variable was originally placeholder-named during script authoring (potentially as a re-use of the immigration question's row prefix in a different battery layout) and never renamed when it was assigned to the tax-policies grid. The CSV column ordering also reflects this — `CC24_323f` appears *between* `CC24_328e` and `CC24_330a` in the header, not adjacent to `CC24_323a..d`.

**This corrects the prior Pass 2 + CD-breadth audits**, both of which held the column pending docx extraction under the assumption that it was a fifth immigration item.

| Field | Value |
|---|---|
| Exact column | `CC24_323f` |
| Exact wording | "Forgive up to $20,000 of student loan debt for each person." |
| Battery | `CC24_328grid` (Tax policies) — NOT `CC24_323grid` |
| Codes | 1=Support, 2=Oppose, 8=Skipped, 9=Not Asked, . = Missing |
| Proposed target | `MAT/position` |
| Direction | Support → MAT low (pro-redistribution); Oppose → MAT high |
| Cross-loads | Generational fairness frame; some MAT-low respondents oppose for fairness/precedent reasons |
| Confidence | Medium-high |
| Recommended weight | **0.7×** in 2024 MAT composite |
| CU composite | **Do not include.** Not an immigration item. |
| Implementation note | Mapper v0.1F/0.1G must read column `CC24_323f` (with the literal `323f` suffix) and route it into the MAT composite alongside `CC24_328a..e`. The variable-name pattern is the sole mapper-side gotcha; the value semantics are identical to the rest of the CC24_328 battery. |

## 2. CC24_324 abortion battery — full directionality confirmed

The 2024 abortion battery is structurally **thinner** than 2016/2020. Only 4 items:

| Variable | Wording | Direction (Support →) | Confidence | Weight | Status |
|---|---|---|:-:|:-:|:-:|
| CC24_324a | "Always allow a woman the right to obtain an abortion as a matter of choice" | CD low | High | 1.0× | ✅ Ship |
| CC24_324b | "Permit abortion only in case of rape, incest or when the woman's life is in danger" | CD high (with same Pass-1 ambiguity as CC16/CC20_332b) | Medium-Low | — | ❌ Hold for v0.2 |
| CC24_324c | "Make abortions illegal in all circumstances" | CD high (clean) | High | 1.0× | ✅ Ship |
| CC24_324d | "Expand access to abortion, including making it more affordable, broadening the types of providers who can offer care, and protecting access to abortion clinics" | CD low | High | 1.0× | ✅ Ship |

**What's missing in 2024 vs 2016/2020:**
- No 20-week prohibition item (CC16/CC20_332c).
- No employer-conscience item (CC16/CC20_332d).
- No Hyde Amendment / federal-funding item (CC16/CC20_332e).
- No state hospital-only restriction item (CC20_332g).

The 2024 abortion-battery CD signal therefore has 3 ship-ready items (a, c, d) vs the 4 ship-ready items from 2016/2020 (a, c, e, f). The CC24_340a (contraceptives) + CC24_340c (same-sex marriage) breadth items partially compensate, but the 2024 abortion-axis CD signal alone is structurally weaker than 2016/2020.

**v0.1 abortion CD composite for 2024:**
- `CC24_324a` (1.0×) + `CC24_324c` (1.0×) + `CC24_324d` (1.0×) = 3-item composite.
- `CC24_324b` held for v0.2 (asymmetric ambiguity on Oppose; needs joint-conditioning logic).

**Implementation note for v0.1F/0.1G:** Same Bayesian-update mechanic as 2016/2020 abortion items. Direction signs:
- Support on a or d → CD low.
- Support on c → CD high.
- Oppose flips each direction.

## 3. CC24_340a/b/c code maps + CC24_340b hold confirmation

All three items use the universal `CC24_340grid` coding (1=Support, 2=Oppose, 8=Skipped, 9=Not Asked).

| Variable | Wording (verified from docx) | Direction (Support →) | Weight | Status |
|---|---|---|:-:|:-:|
| CC24_340a | "Prohibit government restrictions on the provision of, and access to, contraceptives." | CD low | 1.0× | ✅ Ship |
| CC24_340b | "Prohibit government restrictions on the provision of, and access to, abortion services." | CD low | 0 (hold) | ❌ Hold confirmed |
| CC24_340c | "Require that all federal agencies recognize same-sex marriages and interracial marriages." | CD low | 1.0× | ✅ Ship |

**CC24_340b hold confirmation:** The wording explicitly mirrors the abortion-battery item CC24_324a ("Always allow a woman the right to obtain an abortion as a matter of choice"). Including CC24_340b alongside CC24_324a + CC24_324d in the v0.1 CD composite would over-weight the abortion axis vs. the contraceptive (340a) and same-sex marriage (340c) axes. **Hold confirmed.**

**Alternative use for CC24_340b** (sanity check, not composite contribution):
- Compute weighted For-share for CC24_340b across the loaded sample.
- Compare to the average For-share across CC24_324a + CC24_324d.
- If divergence > ~3pp, flag as potential routing/skip-pattern issue or respondent confusion. Would not affect mapper output but surfaces data-quality concerns to the v0.1F/0.1G implementer.

**Implementation note for v0.1F/0.1G:** Read CC24_340a and CC24_340c; route into 2024 CD composite at weight 1.0× each. Read CC24_340b but route OUT of the CD composite — keep only in a "data quality" stats block.

## 4. CC24_328 MAT battery — full code map

All items in `CC24_328grid` use the universal Support/Oppose coding. Per the prior Pass 2 audit, all five labeled items + the mis-named CC24_323f are in scope:

| Variable | Wording | Direction (Support →) | Weight | Status |
|---|---|---|:-:|:-:|
| CC24_328a | "Relax local zoning laws in your state to allow for construction of more apartments and condos." | ambiguous (YIMBY progressives + free-market conservatives both Support) | 0 (hold) | ❌ Hold for v0.2 |
| CC24_328b | "Expand federal tax incentives to encourage developers to build homes for people who make less than half of the average income in your area." | MAT low | 0.5× | ⚠ Reduced |
| CC24_328c | "Require able-bodied adults under 64 years of age who do not have dependents to have a job in order to receive Medicaid." | MAT high (welfare restriction) | 1.0× | ✅ Ship |
| CC24_328d | "Repeal the Affordable Care Act" | MAT high | 1.0× | ✅ Ship (verbatim equivalent to CC16_351I) |
| CC24_328e | "Expand Medicaid to cover individuals making less than $25,000 and families making less than $40,000 a year." | MAT low | 1.0× | ✅ Ship |
| **CC24_323f** | "Forgive up to $20,000 of student loan debt for each person" | MAT low | 0.7× | ⚠ Reduced (resolved Pass 3 — see §1) |

**v0.1 MAT composite for 2024 (revised):**
- `CC24_328c` (1.0×) + `CC24_328d` (1.0×) + `CC24_328e` (1.0×) — three high-confidence items.
- `CC24_323f` (0.7×) — resolved student-loan item.
- `CC24_328b` (0.5×) — reduced-confidence housing tax incentive.
- `CC24_328a` held.

3 full-weight + 1 medium-high (0.7×) + 1 reduced (0.5×) = 5-item MAT composite. Stronger than 2020 MAT (which lacks an ACA-repeal direct item), comparable to 2016 MAT.

**Implementation note for v0.1F/0.1G:** The MAT composite for 2024 reads from columns `CC24_328a..e` AND `CC24_323f` (the column-name carryover). All six columns share identical Support/Oppose coding so the batch parser can apply a single Yes/No → ±1 transform after loading.

## Cross-cycle MAT signal-strength updated (Pass 3)

Pass 2 reported: 2016 strong, 2020 weak, 2024 recovers via CC24_328 battery. Resolution of CC24_323f does not change the per-cycle ranking but clarifies that the 2024 MAT composite has **5 contributing items** (not 4 as the prior count assumed when CC24_323f was held). 2024 MAT signal is now structurally **at par with 2016 and stronger than 2020**, with full ACA-repeal + Medicaid-expansion + welfare-work-requirement coverage.

## What the docx confirms vs. the guide PDF

The `CES_2024_GUIDE_vv.pdf` summary that drove the prior audits exposed CC24_328a–e wording correctly but did NOT reveal that the student-loan item is column-named `CC24_323f` rather than `CC24_328f`. The summary PDF compresses the row labels and drops the variable-name suffix in the displayed text. The docx (`CCES24_Common_pre.docx` extracted via `pandoc`) preserves the exact variable-name → wording mapping in the survey scripting layout, which is why this audit could resolve the carryover.

This is a one-time correction; future audits should always cross-check guide-PDF wording against the docx for variable-name authoritative ground truth.

## Pass-3 ship status (2024 cycle)

After this audit pass, the 2024 mapper-v0.1 ship status is:

| Composite | Items contributing | Total weight points |
|---|---|---:|
| **CD/position (2024)** | CC24_324a/c/d (1.0× each) + CC24_340a (1.0×) + CC24_340c (1.0×) + (held: 324b, 340b) | 5.0 |
| **CU/position (2024)** | CC24_323a (0.5×) + CC24_323b (0.5×) + CC24_323c (1.0×) + CC24_323d (1.0×) | 3.0 |
| **moralBoundaries.national (2024)** | CC24_323b (0.5×) + CC24_323c (1.0×) | 1.5 |
| **MAT/position (2024)** | CC24_328c (1.0×) + CC24_328d (1.0×) + CC24_328e (1.0×) + CC24_323f (0.7×) + CC24_328b (0.5×) + (held: 328a) | 4.2 |

**No 2024 mapper item remains in the "wording unknown" hold state**
after this pass. Two genuine holds remain (CC24_324b for asymmetric
ambiguity, CC24_328a for direction ambiguity), both with documented
mitigation paths for v0.2.

## Implementation notes for mapper v0.1F / v0.1G

The mapper resolver layer for 2024 needs to know:

1. **Column `CC24_323f` belongs to the MAT composite, not CU.** This is a one-line resolver entry but a critical one — getting it wrong silently routes the student-loan item into the wrong node and inverts its direction (because student-loan progressives would be coded as immigration-restrictionists).
2. **CC24_340b is read but not routed.** The mapper consumes the column only for the data-quality consistency check; it does not contribute to any per-respondent posterior.
3. **CC24_324b is held entirely.** Same Pass-1 ambiguity as CC16/CC20_332b. Route to MAPPER_HOLD_LIST.
4. **CC24_328a is held entirely.** Direction ambiguity (zoning-relaxation Support spans both ideological poles).
5. All other CC24_3* items in scope have clean Support/Oppose semantics and the universal 1=Support, 2=Oppose, 8=Skipped, 9=Not Asked code map.

## What this audit deliberately does NOT do

- No mapper code modifications. Mapper composites continue to be defined in spec form only.
- No engine, selector, browser, dist, output, candidate, or era-context edits.
- No raw-data downloads. The docx was already cached locally in `data/cces2024/`.

## Files

- `results/electorate/synthetic-electorate/mapper-2024-hold-items-audit.md` (this file)
- `results/electorate/synthetic-electorate/mapper-2024-hold-items-audit.json` (machine-readable mirror)

## Terminology check

`moralBoundaries.national` is the canonical compound moral-circle
boundary per ADR-006. Engagement is referenced only as a downstream
concern — separate 1D continuous scalar per ADR canon — not surfaced
by any item audited here. Legacy code identifiers (`CC24_*`) appear
only as CCES variable names.
