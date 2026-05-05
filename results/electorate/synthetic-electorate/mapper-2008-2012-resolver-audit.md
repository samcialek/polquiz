# Mapper 2008/2012 resolver audit

**Date:** 2026-05-05 (Terminal-3, read-only)
**Status:** Documentation only. **No mapper code touched. No engine, selector, browser, dist, output, or generated-smoke edits.**
**Companion file:** `mapper-2008-2012-resolver-audit.json`
**Source completion-contract:** `mapper-v01-completion-contract.{md,json}` — flagged 2008/2012 as "resolver carry-over, out of v0.1 scope."
**Codebooks consulted (read-only):**
- `data/cces2012/cces_guide_2012.pdf` (extracted via `pdftotext`)
- `data/cces2012/CCES12_Common_VV.tab` header (column-name verification)
- `data/cces2008/codebook-extracted.txt` (locally pre-extracted)
- `data/cces2008/cces_2008_common.tab` header (column-name verification)

## Purpose

The current mapper resolver tables target modern CCES standard column
names (`pid7`, `ideo5`, `pew_churatd`, `CC16_*`, `CC20_*`, `CC24_*`).
2008 and 2012 use different column-naming conventions that the
resolver does not yet decode, so the coverage audit shows 2008 and
2012 at 0% real-signal across every issue-item-driven node (MAT, CD,
CU, mB.national).

This audit decodes the 2012 and 2008 codebooks, identifies safe
items per PRISM target, and produces resolver-table snippets ready
for mechanical wiring. **2012 first** (closer to modern CCES naming),
**2008 second** (CC*** + V### legacy archaeology).

## Forbidden / circular firewall (universal)

The same prohibitions apply as in the v0.1 contract:

- Vote-choice columns (`CC410a` 2012 / `CC403/CC410` 2008): never used.
- Candidate feeling thermometers: never used.
- Validated-turnout fields: never used for position nodes.
- `pid7` / `CC307a`: only as flagged signal for `moralBoundaries.political_camp`.
- Partisan-camp-loaded items: rejected per v0.1 contract.

Each item below has been audited individually; the per-item table
flags the circularity status.

## Sequencing recommendation

**Implement in this order:**

1. **2012 first.** Column-naming is closer to modern CCES (just
   different prefix conventions: `CC322_*`, `CC324`, `CC326`, `CC332*`).
   Most items have direct cross-cycle parallels with 2016+
   (CC322_1 ≡ CC16_331_1, CC332G ≡ CC16_351I, etc.).
2. **2008 second.** Uses CC3xx column names too but with different
   numbering (CC310 instead of CC332). Some items decode cleanly
   from `codebook-extracted.txt`. 2008 also has religious and
   ideology items (V215-V217, CC317a) that fill the
   `moralBoundaries.{religious, ideological}` blockers.

The 2008 cycle has **NO immigration items** in the common content —
CU/national for 2008 stays at fallback regardless of resolver work.

## TL;DR coverage projection

After this resolver work lands, the projected coverage state for the
35 currently-fallback (target × cycle) cells in 2008/2012:

| Cycle | Currently fallback (cells) | After resolver: covered | After resolver: reduced | Stays fallback |
|---:|---:|---:|---:|---:|
| 2012 | 8 | 7 | 1 | 0 |
| 2008 | 15 | 6 | 4 | 5 |

**12 of 23 cells** lift to covered. **5 cells** lift to reduced. **5
cells** stay at fallback for 2008 (CU/national/ethnic-racial-without-AA-cross-load/COM/PRO/ONT_H/ONT_S/EPS — all but ethnic_racial are ANES-only as documented in `mapper-hard-node-source-audit.md`; CU is unfillable for 2008).

## Universal code maps (2008/2012)

Most 2008 + 2012 items follow one of three response patterns:

| Pattern | Codes |
|---|---|
| **2-way Support/Oppose** (CC332*, CC316*, CC326) | `1` = Support / Favor, `2` = Oppose, `3` = Not Sure (2008 only), `8` = Skipped, `9` = Not Asked, `.` = Missing |
| **2-way Yes/No multi-select** (CC322_* immigration battery 2012) | `1` = Yes, `2` = No, `8` = Skipped, `9` = Not Asked, `.` = Missing |
| **4-point Likert** (CC310, CC312, CC313, CC324) | `1` = strongest pro-restriction / strongly support, `2` = somewhat, `3` = somewhat opposite, `4` = strongest pro-permission / strongly oppose, `8` = Skipped, `9` = Not Asked |

CC311 / CC325 (Jobs-Environment) use a 5-point Likert (1 = environment-strong, 5 = jobs-strong, 8/9/. = missing).

CC302 (national economy retro) uses 5-point (1 = much better, 5 = much worse).

CC304 (household income 4yr, 2012) uses 5-point (1 = increased a lot, 5 = decreased a lot).

Per-item tables below note any divergence from these conventions.

# Section A — 2012 cycle

## A.1 — CD (cultural direction)

### CC324 — Abortion (single 4-point Likert)

| Field | Value |
|---|---|
| Exact column | `CC324` |
| Battery | standalone single-choice (NOT a Support/Oppose battery like CC16_332a..f) |
| Wording | "Which one of the opinions on this page best agrees with your view on abortion?" |
| Codes | `1` = "By law, abortion should never be permitted"; `2` = "Permit abortion only in case of rape, incest or when the woman's life is in danger"; `3` = "Permit abortion for reasons other than rape/incest/life only after the need has been clearly established"; `4` = "By law, a woman should always be able to obtain an abortion as a matter of personal choice"; `8` = Skipped; `9` = Not Asked |
| Empirical distribution | 5,684 (1) / 14,146 (2) / 7,174 (3) / 27,111 (4) / 420 skipped |
| Target | `CD/position` |
| Polarity | `1` → CD high (most restrictive); `4` → CD low (most permissive). Linear monotonic. |
| Signal_fn | `cc324_abortion_likert_4pt`: signal = `(2.5 - response_value) / 1.5` clipped to `[-1, +1]` (so 1 → +1.0, 2.5 → 0, 4 → −1.0) |
| Weight | 1.5× (single high-quality item; bumped above 1.0× because the 4-point Likert carries more information than a 2-way binary) |
| Uncertainty | low |
| v0.1F safety | ✅ Ship |
| Circularity | none |

### CC326 — Gay Marriage

| Field | Value |
|---|---|
| Exact column | `CC326` |
| Wording | "Do you favor or oppose allowing gays and lesbians to marry legally?" |
| Codes | `1` = Favor, `2` = Oppose, `8` = Skipped, `9` = Not Asked |
| Target | `CD/position` (primary), `moralBoundaries.gender` (secondary cross-load) |
| Polarity | Favor → CD low (progressive); Oppose → CD high |
| Signal_fn | `support_to_cd_low` (1.0 / −1.0 / 0) for CD; `favor_one_sided` for gender salience |
| Weight | 1.0× (CD); 1.0× (gender salience cross-load) |
| Uncertainty | low |
| v0.1F safety | ✅ Ship |
| Circularity | none |

### CC332E — Roll Call: Birth Control Exemption (employer conscience)

| Field | Value |
|---|---|
| Exact column | `CC332E` |
| Wording | "Birth Control Exemption. A Bill to let employers and insurers refuse to cover birth control and other health services that violate their religious beliefs." |
| Codes | `1` = Support, `2` = Oppose, `8` = Skipped, `9` = Not Asked |
| Empirical distribution | 20,915 (1) / Oppose unknown count / 32,425 (Skipped) — extracted partial |
| Target | `CD/position` (primary) + light `moralBoundaries.religious` |
| Polarity | Support → CD high (employer-religious-conscience); Oppose → CD low |
| Signal_fn | `support_to_cd_high` |
| Weight | 0.5× (mirrors CC16_332d employer-conscience reduced-weight rationale: religious-liberty cross-load) |
| Uncertainty | medium |
| v0.1F safety | ⚠ Ship reduced |
| Circularity | none |

### CC332J — Roll Call: End Don't Ask, Don't Tell (LGBTQ rights)

| Field | Value |
|---|---|
| Exact column | `CC332J` |
| Wording | "End Don't Ask, Don't Tell. Would allow gays to serve openly in the armed services." |
| Codes | `1` = Support, `2` = Oppose, `8` = Skipped, `9` = Not Asked |
| Empirical distribution | 36,353 (1) / 17,336 (Skipped — and Oppose) / 780 (8) |
| Target | `CD/position` (primary), `moralBoundaries.gender` (secondary, direction-agnostic) |
| Polarity | Support → CD low; Oppose → CD high |
| Signal_fn | `support_to_cd_low` for CD; `any_response_direction_agnostic` for gender salience |
| Weight | 1.0× (CD); 1.0× (gender salience) |
| Uncertainty | low |
| v0.1F safety | ✅ Ship |
| Circularity | none |

## A.2 — CU (cultural uniformity) + moralBoundaries.national

### CC322_1..6 — Immigration battery (Yes/No multi-select)

Battery prompt (verified): "What do you think the U.S. government should do about immigration? Select all that apply."

Note: the codebook's end-of-document summary table mis-labels CC322_1 as "Climate"; the detailed question text earlier in the codebook (which is authoritative) shows immigration items at all six positions.

| Variable | Wording | Direction (Yes →) | CU weight | mB.national weight | v0.1F |
|---|---|---|:-:|:-:|:-:|
| `CC322_1` | "Grant legal status to all illegal immigrants who have held jobs and paid taxes for at least 3 years, and not been convicted of any felony crimes" | CU high | 0.5× | — (not national-loaded) | ✅ Ship |
| `CC322_2` | "Increase the number of border patrols on the US-Mexican border" | CU low + national.salience high | 0.5× | 0.5× | ✅ Ship |
| `CC322_3` | "Allow police to question anyone they think may be in the country illegally" | CU low + ethnic_racial light cross-load | 0.5× | — | ⚠ Ship reduced |
| `CC322_4` | "Fine US businesses that hire illegal immigrants" | CU low (mixed; some pro-business R's Oppose, some pro-labor D's Support) | 0.3× | — | ⚠ Reduced |
| `CC322_5` | "Prohibit illegal immigrants from using emergency hospital care and public schools" | CU low + national.salience high + MOR low | 0.7× | 0.7× | ✅ Ship |
| `CC322_6` | "Deny automatic citizenship to American-born children of illegal immigrants" | CU low + national.salience very high | 0.7× | 1.0× | ✅ Ship |

**Codes (every item):** `1` = Yes, `2` = No, `8` = Skipped, `9` = Not Asked.

**Signal_fn for all six:** `yes_no_to_cu_low_or_high` (Yes → +1.0 if direction=restrictionist OR −1.0 if direction=pluralist; No → −1.0 OR +1.0; missing → 0). The pluralist item (CC322_1) inverts.

**v0.1F CU composite for 2012:**
`cu_2012 = (0.5×CC322_1 + 0.5×CC322_2 + 0.5×CC322_3 + 0.3×CC322_4 + 0.7×CC322_5 + 0.7×CC322_6) / 3.2`

**v0.1F mB.national composite for 2012:**
`national_salience_2012 = (0.5×CC322_2 + 0.7×CC322_5 + 1.0×CC322_6) / 2.2`

This is structurally **richer than the 2016 immigration battery** because the 2012 set includes the deny-birthright-citizenship item (CC322_6) — the cleanest national-circle marker in any of the audited cycles.

## A.3 — MAT (material orientation)

### CC332A — Ryan Budget Bill (Medicare/Medicaid cuts)

| Field | Value |
|---|---|
| Wording | "2011 House Budget Plan. The Budget plan would cut Medicare and Medicaid by 42%. Would reduce debt by 16% by 2020." |
| Codes | `1` = Support, `2` = Oppose, `8` = Skipped, `9` = Not Asked |
| Polarity | Support → MAT high (small-government / cut social spending) |
| Signal_fn | `support_to_mat_high` |
| Weight | 1.0× |
| Uncertainty | low |
| v0.1F | ✅ Ship |

### CC332D — Tax Hike Prevention Act (extend Bush-era cuts for all)

| Field | Value |
|---|---|
| Wording | "The Tax Hike Prevention Act. Would extend Bush-era tax cuts for all individuals, regardless of income. Would increase the budget deficit by an estimated $405 billion." |
| Codes | `1` = Support, `2` = Oppose, `8` = Skipped, `9` = Not Asked |
| Polarity | Support → MAT high (preserve Bush tax cuts) |
| Signal_fn | `support_to_mat_high` |
| Weight | 1.0× |
| Uncertainty | low |
| v0.1F | ✅ Ship |

### CC332G — Repeal Affordable Care Act

| Field | Value |
|---|---|
| Wording | "Repeal Affordable Care Act. Would repeal the Affordable Care Act." |
| Codes | `1` = Support, `2` = Oppose, `8` = Skipped, `9` = Not Asked |
| Polarity | Support → MAT high (anti-government healthcare) |
| Signal_fn | `support_to_mat_high` |
| Weight | 1.0× |
| Uncertainty | low |
| v0.1F | ✅ Ship — direct verbatim equivalent of CC16_351I and CC24_328d |

### CC332I — Affordable Care Act of 2010 (PASSING the ACA — INVERSE signal)

| Field | Value |
|---|---|
| Wording | "Affordable Care Act of 2010. Requires all Americans to obtain health insurance. Allows people to keep current provider. Sets up health insurance option for those without coverage. Increases taxes on those making more than $280,000 a year." |
| Codes | `1` = Support, `2` = Oppose, `8` = Skipped, `9` = Not Asked |
| Polarity | **INVERSE of CC332G** — Support → MAT low (pro-government healthcare); Oppose → MAT high |
| Signal_fn | `support_to_mat_low` |
| Weight | 1.0× |
| Uncertainty | low |
| v0.1F | ✅ Ship |
| Implementation note | This item passes ACA; CC332G repeals it. Their composite contribution should be opposite-direction. v0.1F resolver must NOT route them with the same signal_fn. |

### CC332B — Simpson-Bowles Budget Plan

| Field | Value |
|---|---|
| Wording | "Simpson-Bowles Budget Plan. Plan would make 15% cuts across the board in Social Security, Medicare, Medicaid, and Defense, as well as other programs. Eliminate many tax breaks for individuals and corporations. Would reduce debt by 21% by 2020." |
| Polarity | Support → MAT high (cuts framing); BUT cross-cuts are also defense-cuts → mixed |
| Weight | 0.5× (mixed signal — austerity vs anti-defense progressives both Support) |
| v0.1F | ⚠ Reduced |

**v0.1F MAT composite for 2012:**
`mat_2012 = (1.0×CC332A + 1.0×CC332D + 1.0×CC332G − 1.0×CC332I + 0.5×CC332B) / 4.5`

(CC332I contributes with negative sign — `support_to_mat_low` signal_fn handles the inversion.)

## A.4 — ZS (zero-sum)

### CC325 — Jobs-Environment

| Field | Value |
|---|---|
| Wording | "Some people think it is important to protect the environment even if it costs some jobs or otherwise reduces our standard of living. Other people think that protecting the environment is not as important as maintaining jobs and our standard of living. Which is closer to the way you feel?" |
| Codes | `1` = "Much more important to protect environment even if we lose jobs"; `2` = "Environment somewhat more important"; `3` = "About the same"; `4` = "Economy somewhat more important"; `5` = "Much more important to protect jobs even if environment worse"; `8` = Skipped; `9` = Not Asked |
| Target | `ZS/position` + light `ONT_S` cross-load |
| Polarity | `1` → ZS low (positive-sum environmental view); `5` → ZS high (zero-sum tradeoff framing) |
| Signal_fn | `jobs_env_5pt_to_zs_high`: signal = `(response_value - 3) / 2` clipped to `[-1, +1]` |
| Weight | 0.5× |
| Uncertainty | medium |
| v0.1F | ✅ Ship |

### CC332F — US-Korea Free Trade Agreement

| Field | Value |
|---|---|
| Wording | "U.S.-Korea Free Trade Agreement. Would remove tariffs on imports and exports between South Korea and the U.S." |
| Codes | `1` = Support, `2` = Oppose, `8` = Skipped, `9` = Not Asked |
| Polarity | Support → ZS low (free-trade as positive-sum); Oppose → ZS high |
| Signal_fn | `support_to_zs_low` |
| Weight | 0.5× |
| v0.1F | ✅ Ship |

### CC302 — National Economy Retro

| Field | Value |
|---|---|
| Wording | "Would you say that OVER THE PAST YEAR the nation's economy has...?" |
| Codes | `1` = Gotten much better; `2` = Gotten better; `3` = Stayed about the same; `4` = Gotten worse; `5` = Gotten much worse |
| Target | `ZS/position` (light) |
| Polarity | `5` → ZS high; `1` → ZS low |
| Signal_fn | `econ_retro_5pt_to_zs_high`: `(response_value - 3) / 2` |
| Weight | 0.3× |
| v0.1F | ✅ Ship |

**v0.1F ZS composite for 2012:**
`zs_2012 = (0.5×CC325 + 0.5×CC332F + 0.3×CC302) / 1.3`

## A.5 — moralBoundaries.gender (2012)

Composite from CC326 (gay marriage Favor/Oppose) + CC332J (End DADT Support/Oppose). Both already counted as primary CD signals; gender-salience routing is parallel:

| Variable | gender salience signal_fn | weight |
|---|---|:-:|
| `CC326` | `favor_one_sided` | 1.0× |
| `CC332J` | `any_response_direction_agnostic` | 1.0× |

**Composite:** `gender_2012 = (1.0×CC326 + 1.0×CC332J) / 2.0`

## A.6 — Items considered and rejected (2012)

| Variable | Reason |
|---|---|
| CC332C (Middle Class Tax Cut Act extending Bush cuts < $200K) | Direction-ambiguous: progressives Support to preserve middle-class cuts; conservatives Support to extend cuts at all. Not a clean MAT discriminator. |
| CC332H (Keystone Pipeline) | Environment / ONT_S cross-load; not pure MAT or ZS |
| CC313 (Affirmative Action — only confirmed in 2008 codebook, not 2012; the 2012 PDF summary table mentions CC328 = Affirmative Action but the question detail did not surface it cleanly) | Defer to v0.1G: needs PDF re-check |
| CC305-CC306 (party majority), CC307-CC307a (party ID 3pt/7pt) | pid7-equivalent; usable only for `moralBoundaries.political_camp` (already wired via different column) |
| CC410a (post-wave president vote choice) | **Forbidden** — vote choice |

# Section B — 2008 cycle

The 2008 codebook uses CC*** numbering (CC301-CC320 series) plus V### demographic codes. Issue items decode cleanly from `codebook-extracted.txt`. **No immigration items exist** in the common content.

## B.1 — CD (cultural direction)

### CC310 — Abortion (single 4-point Likert — VERBATIM identical to CC324 in 2012)

| Field | Value |
|---|---|
| Exact column | `CC310` |
| Wording | "Which one of the opinions on this page best agrees with your view on abortion?" |
| Codes | Identical to CC324 in 2012: `1` = never permitted, `2` = rape/incest/life only, `3` = "for other reasons but only after need is established", `4` = personal choice |
| Empirical distribution | 4,796 (1) / 9,533 (2) / 4,710 (3) / 13,595 (4) / 166 skipped |
| Target | `CD/position` |
| Polarity | `1` → CD high; `4` → CD low |
| Signal_fn | `cc324_abortion_likert_4pt` (same fn as 2012; reusable) |
| Weight | 1.5× |
| v0.1F | ✅ Ship |
| Circularity | none |

### CC316c — Roll Call: Stem Cell Research

| Field | Value |
|---|---|
| Exact column | `CC316c` |
| Wording | "Stem Cell Research" (specific bill: federal funding expansion) |
| Codes | `1` = Support, `2` = Oppose, `3` = Not Sure, `8` = Skipped, `9` = Not Asked |
| Polarity | Support → CD low (progressive bioethics); Oppose → CD high |
| Signal_fn | `support_to_cd_low_with_not_sure_neutral`: Support → −1.0; Oppose → +1.0; Not Sure → 0; missing → 0 |
| Weight | 0.5× |
| Uncertainty | medium |
| v0.1F | ✅ Ship |
| Circularity | none |

### CC316f — Roll Call: Constitutional Amendment to Ban Gay Marriage

| Field | Value |
|---|---|
| Exact column | `CC316f` |
| Wording | "Constitutional Amendment banning Gay Marriage" |
| Codes | `1` = Support, `2` = Oppose, `3` = Not Sure, `8` = Skipped, `9` = Not Asked |
| Empirical | 13,946 (1) / 15,333 (2) / 3,435 (3) / 86 skipped |
| Target | `CD/position` (primary) + `moralBoundaries.gender` (secondary) |
| Polarity | **Support → CD high** (banning marriage = traditionalist); Oppose → CD low. **Direction is INVERTED relative to CC326 in 2012** (which asks "favor allowing" rather than "support banning"). |
| Signal_fn | `support_to_cd_high_with_not_sure_neutral`: Support → +1.0; Oppose → −1.0; Not Sure → 0 |
| Weight | 1.0× (CD); 1.0× (gender salience cross-load, direction-agnostic) |
| Uncertainty | low |
| v0.1F | ✅ Ship |
| Implementation note | **Critical: CC316f and CC326 have OPPOSITE direction signs** because the question framing differs (ban vs allow). Mapper resolver must not share a signal_fn between them. |

**v0.1F CD composite for 2008:**
`cd_2008 = (1.5×CC310 + 1.0×CC316f + 0.5×CC316c) / 3.0`

## B.2 — MAT

### CC312 — Privatize Social Security (4-point Likert)

| Field | Value |
|---|---|
| Wording | "A proposal has been made that would allow people to put a portion of their Social Security payroll taxes into personal retirement accounts that would be invested in private stocks and bonds. Do you favor or oppose this idea?" |
| Codes | `1` = Strongly support, `2` = Somewhat support, `3` = Somewhat oppose, `4` = Strongly oppose, `8` = Skipped, `9` = Not Asked |
| Polarity | `1` → MAT high (free-market privatization); `4` → MAT low |
| Signal_fn | `support_oppose_4pt_to_mat_high`: signal = `(2.5 - response_value) / 1.5` |
| Weight | 1.0× |
| v0.1F | ✅ Ship |

### CC316b — Roll Call: Increase Minimum Wage

| Field | Value |
|---|---|
| Wording | "Increase Minimum Wage from $5.15 to $7.25" |
| Codes | `1` = Support, `2` = Oppose, `3` = Not Sure, `8` = Skipped, `9` = Not Asked |
| Empirical | 23,613 (1) / 6,930 (2) / 2,174 (3) |
| Polarity | Support → MAT low; Oppose → MAT high |
| Signal_fn | `support_to_mat_low_with_not_sure_neutral` |
| Weight | 1.0× |
| v0.1F | ✅ Ship |
| Cross-cycle parallel | CC16_351K (with $10.10), CC20_350b (with $15) |

### CC316e — Roll Call: Health Insurance Program for Children (S-CHIP)

| Field | Value |
|---|---|
| Wording | "Health Insurance Program for Children" (S-CHIP expansion) |
| Codes | `1` = Support, `2` = Oppose, `3` = Not Sure, `8` = Skipped, `9` = Not Asked |
| Polarity | Support → MAT low (pro-government healthcare expansion) |
| Signal_fn | `support_to_mat_low_with_not_sure_neutral` |
| Weight | 1.0× |
| v0.1F | ✅ Ship |

### CC316g — Federal Assistance for Housing Crisis

| Field | Value |
|---|---|
| Wording | "Federal assistance for homeowners facing foreclosure and large lending institutions at risk of failing" |
| Codes | `1` = Support, `2` = Oppose, `3` = Not Sure, `8` = Skipped, `9` = Not Asked |
| Polarity | Support → MAT low (pro-intervention) |
| Signal_fn | `support_to_mat_low_with_not_sure_neutral` |
| Weight | 0.5× (mixed: some Support for institutional stability, not necessarily pro-redistribution) |
| v0.1F | ⚠ Reduced |

**v0.1F MAT composite for 2008:**
`mat_2008 = (1.0×CC312 − 1.0×CC316b − 1.0×CC316e − 0.5×CC316g) / 3.5` (signs reflect "MAT-high direction" — CC312 Support pushes MAT high; the other three Support pushes MAT low, so they enter with negative sign)

## B.3 — ZS

### CC311 — Jobs-Environment (5-point Likert — verbatim identical wording to CC325 in 2012)

| Field | Value |
|---|---|
| Wording | "Some people think it is important to protect the environment even if it costs some jobs or otherwise reduces our standard of living. Other people think that protecting the environment is not as important as maintaining jobs and our standard of living. Which is closer to the way you feel?" |
| Codes | Identical to CC325 in 2012 |
| Target | `ZS/position` + light `ONT_S` |
| Polarity | `1` → ZS low; `5` → ZS high |
| Signal_fn | `jobs_env_5pt_to_zs_high` (reusable from 2012) |
| Weight | 0.5× |
| v0.1F | ✅ Ship |

### CC316h — Roll Call: Extend NAFTA to Peru and Colombia

| Field | Value |
|---|---|
| Wording | "Extend the North American Free trade Agreement (NAFTA) to include Peru and Columbia" |
| Codes | `1` = Support, `2` = Oppose, `3` = Not Sure |
| Empirical | 10,096 (1) / 11,151 (2) / 11,479 (3) |
| Polarity | Support → ZS low; Oppose → ZS high |
| Signal_fn | `support_to_zs_low_with_not_sure_neutral` |
| Weight | 0.3× (high "Not Sure" share — ~30% — dilutes signal) |
| v0.1F | ⚠ Reduced |

### CC302 — National Economy Retro (2008)

Same wording / codes as 2012 CC302; same signal_fn and weight (`econ_retro_5pt_to_zs_high`, 0.3×).

**v0.1F ZS composite for 2008:**
`zs_2008 = (0.5×CC311 + 0.3×CC316h + 0.3×CC302) / 1.1`

## B.4 — moralBoundaries.gender

Single item: `CC316f` (gay marriage ban). Direction-agnostic for salience.

| Variable | gender salience signal_fn | weight |
|---|---|:-:|
| `CC316f` | `any_response_direction_agnostic_with_not_sure_neutral` | 1.0× |

**Composite:** `gender_2008 = 1.0×CC316f / 1.0` (single-item composite; mapper uncertainty `medium`)

## B.5 — moralBoundaries.ethnic_racial (2008 — light proxy)

### CC313 — Affirmative Action (4-point Likert)

| Field | Value |
|---|---|
| Wording | "Affirmative action programs give preference to racial minorities and to women in employment and college admissions in order to correct for discrimination. Do you support or oppose affirmative action?" |
| Codes | `1` = Strongly support, `2` = Somewhat support, `3` = Somewhat oppose, `4` = Strongly oppose, `8` = Skipped, `9` = Not Asked |
| Empirical | 3,791 (1) / 8,883 (2) / 8,123 (3) / 11,820 (4) / 183 skipped |
| Target | `moralBoundaries.ethnic_racial` (light, race-conditional) + `moralBoundaries.gender` (light) |
| Polarity | Strongly support → ethnic_racial high salience (one-sided; opposing AA doesn't push ethnic_racial low) |
| Signal_fn | `cc313_aa_one_sided`: signal = `max(0, (2.5 - response_value) / 1.5)` — only positive support contributes |
| Weight | 0.5× |
| Uncertainty | high |
| v0.1F | ⚠ Reduced (single-item proxy; ethnic_racial for 2008 stays mostly at fallback) |

This is a partial fix; 2008 ethnic_racial remains structurally weaker than 2020.

## B.6 — moralBoundaries.ideological (2008)

### CC317a — Ideology self-placement (0-100 scale)

| Field | Value |
|---|---|
| Wording | "The scales below represent the ideological spectrum from very liberal (0) to very conservative (100)." (Self-placement) |
| Codes | Numeric 0–100; 8/9 = missing |
| Target | `moralBoundaries.ideological` salience |
| Polarity | strength signal: `\|response - 50\| / 50` (distance from center) |
| Signal_fn | `ideo_strength_0_100`: salience = `0.5 + 2.0 × (\|response - 50\| / 50)` clipped to `[0.5, 2.5]` |
| Weight | 1.0× |
| Uncertainty | medium |
| v0.1F | ✅ Ship — direct 2008 equivalent of `ideo5` strength (already used in modern cycles for `moralBoundaries.ideological`) |

## B.7 — moralBoundaries.religious (2008 from V### items)

The 2008 V### codebook entries (per `codebook-extracted.txt` lines 1000-1090) include:

| Variable | Wording | Notes |
|---|---|---|
| `V215` | Born Again (Pew version) | Yes/No binary |
| `V216` | Importance of religion (Pew version) | 4-point: Very important → Not important |
| `V217` | Church attendance (Pew version) | 6-point ordinal: More than once a week → Never |

These are direct 2008 equivalents of the modern `pew_bornagain` + `relig_imp` + `pew_churatd` items. **Ship-ready** for a 2008-only `moralBoundaries.religious` composite using the same signal_fn pattern as the modern cycles' religious-boundary code path.

| Variable | Signal_fn (mirrors modern equivalent) | weight |
|---|---|:-:|
| `V215` | `pew_bornagain_to_relig_high` | 0.5× |
| `V216` | `relig_imp_4pt_to_high` | 0.7× |
| `V217` | `church_attend_6pt_to_high` | 0.7× |

**Composite:** `religious_2008 = (0.5×V215 + 0.7×V216 + 0.7×V217) / 1.9`

## B.8 — moralBoundaries.political_camp (2008 from CC307a)

### CC307a — Pre Election 7-point Party ID

Direct 2008 equivalent of `pid7` in modern cycles. The mapper's existing `pid7-strength` salience derivation can be reused with this column as the input alias. **Flagged `partyIdDerived: true`** in provenance.

## B.9 — Items considered and rejected (2008)

| Variable | Reason |
|---|---|
| CC316a (Withdraw Troops Iraq) | Foreign-policy / national-security framing; not a clean PRISM-target signal |
| CC316d (Eavesdrop overseas without court order) | PRO low on Support — clean PRO signal! BUT only one item, and PRO is structurally ANES-required per `mapper-hard-node-source-audit.md` §2 (every CCES PRO candidate cross-loads with political_camp). CC316d is closer to a clean PRO signal than the modern CCES candidates, BUT it's a single item from 2008 only — too thin to base a PRO composite on. Defer to v0.1G as a "PRO 2008-only experimental" addition. |
| CC316i (Bank Bailout) | Mixed (Support for stability vs Oppose for moral hazard); weak MAT/ZS |
| CC410 (post-wave vote choice) | **Forbidden** |
| CC317b-m (ideology placement of others — parties, candidates) | Same logic as candidate thermometers — implies revealed preference toward those candidates → potentially circular for vote prediction |
| V215-V217 used for non-religious targets | These are religious-boundary inputs ONLY |

# Section C — Resolver-table snippets (ready for mechanical wiring)

```ts
RESOLVER_TABLE_2008 = {
  CD_position: {
    items: [
      { var: "CC310", weight: 1.5, signal_fn: "cc324_abortion_likert_4pt" },  // reusable from 2012
      { var: "CC316f", weight: 1.0, signal_fn: "support_to_cd_high_with_not_sure_neutral" },
      { var: "CC316c", weight: 0.5, signal_fn: "support_to_cd_low_with_not_sure_neutral" }
    ],
    uncertainty: "low"
  },
  MAT_position: {
    items: [
      { var: "CC312",  weight: 1.0, signal_fn: "support_oppose_4pt_to_mat_high" },
      { var: "CC316b", weight: 1.0, signal_fn: "support_to_mat_low_with_not_sure_neutral" },
      { var: "CC316e", weight: 1.0, signal_fn: "support_to_mat_low_with_not_sure_neutral" },
      { var: "CC316g", weight: 0.5, signal_fn: "support_to_mat_low_with_not_sure_neutral" }
    ],
    uncertainty: "low"
  },
  ZS_proxy: {
    items: [
      { var: "CC311",  weight: 0.5, signal_fn: "jobs_env_5pt_to_zs_high" },
      { var: "CC316h", weight: 0.3, signal_fn: "support_to_zs_low_with_not_sure_neutral" },
      { var: "CC302",  weight: 0.3, signal_fn: "econ_retro_5pt_to_zs_high" }
    ],
    uncertainty: "medium"
  },
  gender_proxy: {
    items: [
      { var: "CC316f", weight: 1.0, signal_fn: "any_response_direction_agnostic_with_not_sure_neutral" }
    ],
    uncertainty: "medium"
  },
  ethnic_racial_proxy: {
    items: [
      { var: "CC313", weight: 0.5, signal_fn: "cc313_aa_one_sided" }
    ],
    uncertainty: "high"
  },
  ideological_salience: {
    items: [
      { var: "CC317a", weight: 1.0, signal_fn: "ideo_strength_0_100" }
    ],
    uncertainty: "medium"
  },
  religious_salience: {
    items: [
      { var: "V215",   weight: 0.5, signal_fn: "pew_bornagain_to_relig_high" },
      { var: "V216",   weight: 0.7, signal_fn: "relig_imp_4pt_to_high" },
      { var: "V217",   weight: 0.7, signal_fn: "church_attend_6pt_to_high" }
    ],
    uncertainty: "low"
  },
  political_camp_salience: {
    items: [
      { var: "CC307a", weight: 1.0, signal_fn: "pid7_strength_distance_from_center", partyIdDerived: true }
    ],
    uncertainty: "low"
  },
  CU_position:               null, // STAYS FALLBACK — no immigration items in 2008
  national_salience:         null, // stays fallback
  PRO_position:              null, // ANES-required
  COM_position:              null, // ANES-required
  ONT_H_position:            null, // ANES-required
  ONT_S_position:            null, // ANES-required
  EPS_distribution:          null, // ANES-required
  AES_distribution:          null, // inherent fallback
  MOR_position:              null  // v0.2 composite-promotion (cross-load on CC316c stem cell?? No — defer)
};

RESOLVER_TABLE_2012 = {
  CD_position: {
    items: [
      { var: "CC324",  weight: 1.5, signal_fn: "cc324_abortion_likert_4pt" },
      { var: "CC326",  weight: 1.0, signal_fn: "support_to_cd_low" },     // gay marriage Favor → CD low
      { var: "CC332E", weight: 0.5, signal_fn: "support_to_cd_high" },    // birth control exemption Support → CD high
      { var: "CC332J", weight: 1.0, signal_fn: "support_to_cd_low" }      // End DADT Support → CD low
    ],
    uncertainty: "low"
  },
  CU_position: {
    items: [
      { var: "CC322_1", weight: 0.5, signal_fn: "yes_to_cu_high" },        // grant legal status — pluralist
      { var: "CC322_2", weight: 0.5, signal_fn: "yes_to_cu_low" },         // border patrols
      { var: "CC322_3", weight: 0.5, signal_fn: "yes_to_cu_low" },
      { var: "CC322_4", weight: 0.3, signal_fn: "yes_to_cu_low" },
      { var: "CC322_5", weight: 0.7, signal_fn: "yes_to_cu_low" },
      { var: "CC322_6", weight: 0.7, signal_fn: "yes_to_cu_low" }
    ],
    uncertainty: "low"
  },
  national_salience: {
    items: [
      { var: "CC322_2", weight: 0.5, signal_fn: "yes_one_sided" },
      { var: "CC322_5", weight: 0.7, signal_fn: "yes_one_sided" },
      { var: "CC322_6", weight: 1.0, signal_fn: "yes_one_sided" }
    ],
    uncertainty: "medium"
  },
  MAT_position: {
    items: [
      { var: "CC332A", weight: 1.0, signal_fn: "support_to_mat_high" },   // Ryan Budget
      { var: "CC332B", weight: 0.5, signal_fn: "support_to_mat_high" },   // Simpson-Bowles (mixed)
      { var: "CC332D", weight: 1.0, signal_fn: "support_to_mat_high" },   // Tax Hike Prevention
      { var: "CC332G", weight: 1.0, signal_fn: "support_to_mat_high" },   // Repeal ACA
      { var: "CC332I", weight: 1.0, signal_fn: "support_to_mat_low" }     // Pass ACA — INVERSE
    ],
    uncertainty: "low"
  },
  ZS_proxy: {
    items: [
      { var: "CC325",  weight: 0.5, signal_fn: "jobs_env_5pt_to_zs_high" },
      { var: "CC332F", weight: 0.5, signal_fn: "support_to_zs_low" },
      { var: "CC302",  weight: 0.3, signal_fn: "econ_retro_5pt_to_zs_high" }
    ],
    uncertainty: "medium"
  },
  gender_proxy: {
    items: [
      { var: "CC326",  weight: 1.0, signal_fn: "favor_one_sided" },
      { var: "CC332J", weight: 1.0, signal_fn: "any_response_direction_agnostic" }
    ],
    uncertainty: "low"
  },
  ethnic_racial_proxy:       null, // ANES-required (no AA item in 2012 audited)
  PRO_position:              null, // ANES-required
  COM_position:              null, // ANES-required
  ONT_H_position:            null, // ANES-required
  ONT_S_position:            null, // ANES-required
  EPS_distribution:          null, // ANES-required
  AES_distribution:          null, // inherent fallback
  MOR_position:              null  // v0.2 composite-promotion — CC322_5 prohibit-services has light MOR cross-load
};
```

**Note:** modern engagement / religious / class / political_camp / ideological / political_camp / intensity composites ALREADY work for 2012 because the standard column names (`pid7`, `ideo5`, `pew_churatd`, `pew_bornagain`, `union`, `newsint`) exist in CCES12. The 2012 resolver only needs to ADD the issue-item bindings above; the boundary-salience composites stay unchanged.

For 2008, the religious / political_camp / ideological composites need explicit aliases (V215/V216/V217 → modern slots; CC307a → `pid7`-style position; CC317a → `ideo5`-style strength) because the 2008 column names don't match the modern resolver table.

# Section D — Required signal_fn additions

The resolver tables above reference 13 distinct signal_fn types. **6 are reusable from existing v0.1F spec** (per `mapper-zs-boundary-implementation-spec.json`):
- `support_to_zs_low` (alias of existing)
- `econ_retro_5pt_to_zs_high` (extension of existing income/price patterns)
- `favor_one_sided`, `any_response_direction_agnostic`, `yes_one_sided` (existing)
- `support_to_mat_high`, `support_to_mat_low` (extension of existing economic patterns)

**7 are new for the 2008/2012 resolver:**

| New signal_fn | Definition |
|---|---|
| `cc324_abortion_likert_4pt` | `(2.5 - response_value) / 1.5` clipped to `[-1, +1]`; missing → 0 |
| `support_to_cd_low_with_not_sure_neutral` | Support → −1.0; Oppose → +1.0; Not Sure (3) → 0; missing → 0 |
| `support_to_cd_high_with_not_sure_neutral` | mirror of above (sign-flipped) |
| `support_oppose_4pt_to_mat_high` | `(2.5 - response_value) / 1.5` for 4-pt Likert (1=strong support, 4=strong oppose) |
| `support_to_mat_low_with_not_sure_neutral` | Support → −1.0; Oppose → +1.0; Not Sure → 0 |
| `jobs_env_5pt_to_zs_high` | `(response_value - 3) / 2` for 5-pt Likert with 1=env, 5=jobs |
| `cc313_aa_one_sided` | `max(0, (2.5 - response_value) / 1.5)` — only AA-Support contributes; one-sided |
| `ideo_strength_0_100` | salience = `0.5 + 2.0 × (\|response - 50\| / 50)` clipped to `[0.5, 2.5]` (already mirrors modern `ideo_strength` for 0-100 scale instead of 1-5) |
| `pew_bornagain_to_relig_high`, `relig_imp_4pt_to_high`, `church_attend_6pt_to_high` | reuse modern equivalents; just bind to V215/V216/V217 column names |
| `pid7_strength_distance_from_center` | already exists for modern cycles; rebinds to CC307a |
| `yes_to_cu_high` / `yes_to_cu_low` | yes/no for immigration items (1.0 / −1.0 / 0); direction parameter encodes pluralist vs restrictionist |

The 7 new types are all simple linear transforms or one-sided
indicators; the implementer should add them to the same signal_fn
dispatch table as the v0.1F spec's 13 transforms.

# Section E — Coverage projection (the "gray cells turn green")

Current state (per `survey-to-prism-mapper-coverage-audit.json`,
HEAD `f1a4c90`): 2008 + 2012 cells at 0% real-signal except
engagement (already at 100% for both years).

**After this resolver lands:**

| Target | 2008 (current → projected) | 2012 (current → projected) |
|---|---|---|
| MAT | 0% → 70%+ | 0% → 90%+ |
| CD | 0% → 90%+ | 0% → 90%+ |
| CU | 0% → **stays 0% (no immigration items)** | 0% → 90%+ |
| MOR | 0% → 0% (v0.2 composite-promotion) | 0% → 0% (v0.2) |
| PRO | 0% → 0% (ANES-required) | 0% → 0% (ANES-required) |
| COM | 0% → 0% (ANES-required) | 0% → 0% (ANES-required) |
| ZS | 0% → 50%+ | 0% → 70%+ |
| ONT_H | 0% → 0% (ANES-required) | 0% → 0% (ANES-required) |
| ONT_S | 0% → 0% (ANES-required) | 0% → 0% (ANES-required) |
| EPS | 0% → 0% (ANES-required) | 0% → 0% (ANES-required) |
| AES | 0% → 0% (inherent fallback) | 0% → 0% (inherent fallback) |
| engagement | 100% (no change) | 100% (no change) |
| mB.national | 0% → **stays 0%** | 0% → 90%+ |
| mB.ethnic_racial | 0% → 50% (CC313 single item, reduced) | 0% → 0% (no AA item audited) |
| mB.religious | 0% → 90%+ (V215/V216/V217 alias) | (already 100% via pew_*) |
| mB.class | 0% → 0% (no `union` standard column verified for 2008) | (already 100% via union/union_hh) |
| mB.ideological | 0% → 90%+ (CC317a alias) | (already ~95% via ideo5) |
| mB.gender | 0% → 50% (CC316f single item) | 0% → 60% (CC326 + CC332J) |
| mB.political_camp | 0% → 90%+ (CC307a alias) | (already ~98% via pid7) |
| mB.intensity | 0% → derived | (already 100%) |

**Net new (target × cycle) cells lifted:**

- **2008**: 8 cells from blocker to covered/reduced (CD, MAT, ZS, mB.gender, mB.ideological, mB.religious, mB.political_camp, mB.intensity-derivation enabled by religious/ideological/political_camp lift).
- **2012**: 6 cells from blocker to covered (MAT, CD, CU, ZS, mB.national, mB.gender).

**Stays blocked:**

- **2008 CU + mB.national** (no immigration items in 2008 common content).
- **2008 mB.class** (no `union` standard column; would need CC301-series investigation).
- **PRO, COM, ONT_H, ONT_S, EPS** — ANES-required for all cycles.
- **AES** — inherent fallback.
- **MOR** — v0.2 composite-promotion deferred.

# Section F — Implementation order recommendation

For Terminal-2's mapper resolver wiring, ship in this order:

1. **2012 resolver block first** (~14 items across 6 composites; all column names align with the standard CCES naming scheme that the loader already reads). Expected smoke pass: MAT/CD/CU/national/gender/ZS for 2012 lift to 90%+ real-signal.
2. **2008 issue items second** (CC310/CC312/CC316b-i — 9 items across 4 composites). MAT/CD/ZS/gender lift.
3. **2008 boundary aliases third** (V215/V216/V217 → religious; CC307a → political_camp; CC317a → ideological). The mapper resolver layer needs to know "for cycle 2008, alias V215 → pew_bornagain semantics, etc." This is a column-name aliasing layer, not a new signal_fn.
4. **2008 ethnic_racial single-item proxy fourth** (CC313). Lower priority because ethnic_racial for 2008 is reduced-confidence even with the resolver.

Each step can ship and pass smoke independently — no dependency chain.

## What this audit deliberately does NOT do

- No mapper code modifications.
- No engine, selector, browser, dist, output, candidate, or era-context edits.
- No raw-data downloads.
- No edits to generated smoke outputs.

## Files

- `results/electorate/synthetic-electorate/mapper-2008-2012-resolver-audit.md` (this file)
- `results/electorate/synthetic-electorate/mapper-2008-2012-resolver-audit.json` (machine-readable mirror)

## Terminology check

`moralBoundaries.*` and `engagement` are canonical per ADR-006/ADR
canon. Engagement is referenced as a separate 1D continuous scalar.
Legacy code identifiers (`pid7`, `ideo5`, `CC*_*`, `V###`, `pew_*`)
appear only as CCES variable names.
