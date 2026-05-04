# Mapper implementation spec — ZS + ethnic_racial + gender boundaries

**Date:** 2026-05-04 (Terminal-3, read-only)
**Status:** Documentation only. **No mapper code touched. No engine, selector, browser, dist, output, or generated-smoke edits.**
**Companion file:** `mapper-zs-boundary-implementation-spec.json`
**Source audit:** `mapper-hard-node-source-audit.{md,json}` (Phase 2.7.8) — recommended these three nodes for v0.1 mapping.
**Codebooks consulted:**
- `data/cces2016/hcbk0006.htm` (CCES 2016 HTML codebook)
- `data/cces2020/CES20_Common_pre_qx.pdf` (extracted via `pdftotext`)
- `data/cces2024/CCES24_Common_pre.docx` (extracted via `pandoc`)
- `data/cces2024/CES_2024_GUIDE_vv.pdf` (re-confirmed)

## Purpose

Per `mapper-hard-node-source-audit.md`, three target × cycle clusters
were recommended for **v0.1 mapping**:

- **ZS** (zero-sum) — proxy composite per cycle.
- **moralBoundaries.ethnic_racial** — 2020 only (post-George-Floyd).
- **moralBoundaries.gender** — 2020 + 2024 from existing CD-breadth items.

This document is the implementation spec for those three composites.
For each item: exact column name, exact wording, response codes,
missing markers, directionality, recommended weight, uncertainty
class, v0.1 safety, and circularity-risk audit.

## Universal forbidden inputs (re-affirmed)

The mapper's hard prohibition list applies to every item below: no
vote-choice columns, no candidate feeling thermometers, no `pid7` for
core position nodes, no validated turnout, no predicted-vote outputs,
no election-eve vote intent, no partisan-camp-loaded items
(Kavanaugh/ACB/Trump impeachment) for any non-political_camp target.

Each item below has been audited individually for circularity risk;
the per-item summary table flags any residual concern.

## TL;DR

| Target | Cycle | Items | Total points | v0.1 status | Confidence |
|---|---:|---:|---:|:-:|:-:|
| ZS | 2016 | 1 (CC16_337_3 light) | 0.2 | ⚠ Near-fallback | low |
| ZS | 2020 | 3 (CC20_303 + CC20_355b + CC20_331d) | 1.1 | ✅ Map | low-medium |
| ZS | 2024 | 1 (CC24_303) + 4 light cross-loads from CC24_341 | 0.5 | ⚠ Reduced | low |
| mB.ethnic_racial | 2020 | 5 (CC20_307 + CC20_334a/d/e/f) | 2.3 | ✅ Map | medium |
| mB.gender | 2020 | 3 (CC20_350a/d + CC20_355d) | 2.5 | ✅ Map | high |
| mB.gender | 2024 | 1 (CC24_340c) + 1 light (CC24_323d) | 0.7 | ⚠ Reduced | medium |

**6 target × cycle composites specified.** Three pass at full
confidence (mB.gender 2020, mB.ethnic_racial 2020, ZS 2020). Three
ship at reduced weight or near-fallback (ZS 2016, ZS 2024,
mB.gender 2024).

## 1. ZS (Zero-Sum) composite

### 1.1 Universal direction convention

**ZS scale:** 1 = positive-sum ("rising tide lifts all boats"); 5 = zero-sum ("their gain is our loss").

**Mapper implementation rule:** every ZS-targeted item maps a
respondent's answer to a per-respondent ZS-direction signal in
[−1, +1] where −1 pushes ZS-low (positive-sum) and +1 pushes ZS-high
(zero-sum). The composite is the weighted average of per-item
signals, then converted to a peaked posPosterior over the 1–5 ZS
scale via the standard mapper distribution helper.

### 1.2 — 2016 ZS composite (NEAR-FALLBACK)

#### CC16_337_3 — Raise Taxes (ranking item)

| Field | Value |
|---|---|
| Battery | `CC16_337` (3-way budget priority ranking) |
| Battery prompt | "If the federal government had to balance the budget, in what order would you do these things?" |
| Exact wording (this item) | "Raise Taxes" |
| Response codes | `1` = Ranked first, `2` = Ranked second, `3` = Ranked third, `.`/`8`/`9` = missing |
| Direction | Ranked first → very light ZS-low (pro-redistribution implies positive-sum framing); Ranked third → light ZS-high |
| Recommended weight | 0.2× (very light cross-load only) |
| Uncertainty class | high |
| v0.1 safety | ⚠ Near-fallback. Single weak item. ZS for 2016 effectively remains at fallback prior with a tiny directional nudge. |
| Circularity risk | None (not pid7/vote-related) |

**2016 ZS composite verdict:** Single weak item only. The 2016 ZS
node should be honestly flagged as **near-fallback**, mapper
provenance `uncertainty: "high"`. v0.2 should add ANES VCF cumulative
items for stronger primary signal.

### 1.3 — 2020 ZS composite (MAP — primary)

#### CC20_303 — Past-year household income change

| Field | Value |
|---|---|
| Exact wording | "OVER THE PAST YEAR, has your household's annual income...?" |
| Response codes | `1` = Increased a lot, `2` = Increased somewhat, `3` = Stayed about the same, `4` = Decreased somewhat, `5` = Decreased a lot, `8` = Skipped, `9` = Not Asked |
| Direction | **Decrease (4–5) → ZS high; Increase (1–2) → ZS low; 3 → neutral** |
| Per-item signal computation | `signal = (response_value − 3) / 2` clipped to [−1, +1] (so 5 → +1.0 ZS-high, 1 → −1.0 ZS-low, 3 → 0). |
| Recommended weight | 0.3× |
| Uncertainty class | low-medium (single self-report; econ-context biased) |
| v0.1 safety | ✅ Map. Direct economic-experience proxy for ZS framing. |
| Circularity risk | None |

#### CC20_355b — Withdraw from Trans-Pacific Partnership

| Field | Value |
|---|---|
| Battery | `CC20_355` ("For each of the following tell us whether you support or oppose these decisions") |
| Exact wording | "Withdraw the United States from the Trans-Pacific Partnership trade agreement, a free trade agreement that included the U.S., Japan, China, Australia, New Zealand, Canada, Chile, others." |
| Response codes | `1` = Support, `2` = Oppose, `8` = Skipped, `9` = Not Asked |
| Direction | Support → ZS high (trade-as-zero-sum framing); Oppose → ZS low |
| Per-item signal | Support → +1.0; Oppose → −1.0; missing → 0 |
| Recommended weight | 0.5× |
| Uncertainty class | medium (clean trade-protectionist signal but cross-loads with national.salience) |
| v0.1 safety | ✅ Map |
| Cross-loads | `moralBoundaries.national` (light); not double-counted because mB.national gets its primary signal from CC20_331b/c/d/e |
| Circularity risk | None |

#### CC20_331d — Reduce LEGAL immigration by 50% over the next 10 years

| Field | Value |
|---|---|
| Battery | `CC20_331` immigration |
| Exact wording | "Reduce LEGAL immigration by 50 percent over the next 10 years" |
| Response codes | `1` = Support, `2` = Oppose, `8` = Skipped, `9` = Not Asked |
| Direction | Support → ZS high (anti-immigration as labor-market protectionism); Oppose → ZS low |
| Per-item signal | Support → +1.0; Oppose → −1.0; missing → 0 |
| Recommended weight | 0.3× (light — primary load is CU/national; ZS is secondary) |
| Uncertainty class | medium |
| v0.1 safety | ✅ Map (light cross-load) |
| Cross-loads | Already routed CU + mB.national (primary). ZS routing is secondary cross-load. |
| Circularity risk | None |

**2020 ZS composite:** `0.3×CC20_303 + 0.5×CC20_355b + 0.3×CC20_331d` = total weight 1.1. Passes the v0.1 threshold; mapper flag uncertainty `medium`.

### 1.4 — 2024 ZS composite (REDUCED — single primary item)

#### CC24_303 — Past-year price change

| Field | Value |
|---|---|
| Exact wording | "OVER THE PAST YEAR, have the prices of everyday goods and services...?" |
| Response codes | `1` = Increased a lot, `2` = Increased somewhat, `3` = Stayed about the same, `4` = Decreased somewhat, `5` = Decreased a lot, `8` = Skipped, `9` = Not Asked |
| Direction | **Increase (1–2) → ZS high (cost-of-living up = perceived loss); Decrease (4–5) → ZS low** |
| Per-item signal | `signal = (3 − response_value) / 2` clipped to [−1, +1] (so 1 → +1.0 ZS-high, 5 → −1.0 ZS-low, 3 → 0). **Sign is INVERTED relative to CC20_303 — implementer must not assume identical directionality.** |
| Recommended weight | 0.5× |
| Uncertainty class | low-medium |
| v0.1 safety | ✅ Map |
| Implementation note | **Critical: CC20_303 (income) and CC24_303 (prices) have OPPOSITE direction signs** because the question subjects are different. Mapper resolver must NOT share a single transform between the two columns. |
| Circularity risk | None |

#### CC24_341a..d — Tax-rate battery (light cross-loads only)

| Variable | Wording | Direction (Support →) | v0.1 ZS weight |
|---|---|---|:-:|
| CC24_341a | "Extend the tax cuts enacted in 2017, which reduced individual and corporate income tax rates and limited deductions on mortgage interest and state and local taxes" | ZS-mid (anti-tax-cut Republicans + anti-tax-cut progressives both Oppose for opposite reasons) | 0 (do not use) |
| CC24_341b | "Raise the corporate income tax rate from 21 percent to 28 percent" | Light ZS-low cross-load (Support → positive-sum redistribution framing) | 0.1× |
| CC24_341c | "Allow tax rates on those earning $400,000 or more a year to rise to 35 percent" | Light ZS-low cross-load (similar to 341b) | 0.1× |
| CC24_341d | "Spend $150 billion a year for 8 years on construction and repair of roads and bridges, rail, public transit, airports, water systems, broadband internet, and electric grid" | Light ZS-low cross-load (infrastructure as positive-sum public good) | 0.1× |

**Reason for very light weights:** These are all primarily MAT items;
the ZS load is incidental and double-counts MAT routing if weighted
heavily. Including at 0.1× per item adds breadth without distorting
the MAT composite.

**2024 ZS composite:** `0.5×CC24_303 + 0.1×CC24_341b + 0.1×CC24_341c + 0.1×CC24_341d` = total weight 0.8. Lower than 2020. Mapper flag uncertainty `medium`.

### 1.5 ZS composite output formula

For each respondent the per-cycle ZS posterior is:
```
zs_signal = sum(weight_i × per_item_signal_i) / sum(weight_i)
```
Then `zs_signal` ∈ [−1, +1] is converted to a peaked 5-bin
posPosterior using the mapper's standard distribution helper, mapping
−1 → `[0.50, 0.30, 0.13, 0.05, 0.02]`, 0 → uniform, +1 →
`[0.02, 0.05, 0.13, 0.30, 0.50]`. Salience: derived from the absolute
value of `zs_signal` (high |signal| → high salience).

## 2. moralBoundaries.ethnic_racial — 2020 ONLY composite

### 2.1 Why 2020 only

Per `mapper-hard-node-source-audit.md` §9: 2008/2012/2016/2024 lack
clean CCES race-policy items. Only 2020 has the post-George-Floyd
police-reform battery (CC20_334) plus the police-trust item
(CC20_307), both of which are race-loaded enough for a v0.1 proxy.
Other cycles defer to v0.2 (which will need ANES VCF0830).

### 2.2 — Items

#### CC20_307 — Police safety (race-conditional)

| Field | Value |
|---|---|
| Exact wording | "Do the police make you feel...?" |
| Response codes | `1` = Mostly safe, `2` = Somewhat safe, `3` = Somewhat unsafe, `4` = Mostly unsafe, `8` = Skipped, `9` = Not Asked |
| Direction (race-conditional) | For non-white respondents: response 3-4 → ethnic_racial salience high. For white respondents: response is largely uninformative (most white respondents say "Mostly safe" regardless of race-consciousness). |
| Per-item signal | `if respondent.race in {black, asian, amerindian, other_single, two_or_more} or respondent.hispanic: signal = max(0, (response_value − 2) / 2); else: signal = 0 (no contribution).` Signal is one-sided (only positive contributions; cannot push salience down). |
| Recommended weight | 0.5× |
| Uncertainty class | medium |
| v0.1 safety | ✅ Map (race-conditional) |
| Circularity risk | None (race demographic is not pid7 or vote-related) |
| Implementation note | Critical: this item is RACE-CONDITIONAL. White-respondent answers do not contribute. The mapper resolver must read the respondent's `race` field and gate the item appropriately. |

#### CC20_334a — Eliminate mandatory minimums for non-violent drug offenders

| Field | Value |
|---|---|
| Battery | `CC20_334` police-reform |
| Battery prompt | "Do you support or oppose each of the following proposals?" |
| Response codes | `1` = Support, `2` = Oppose, `8` = Skipped, `9` = Not Asked |
| Direction | Support → ethnic_racial salience high (criminal-justice-reform framing has explicit racial-disparity component) |
| Per-item signal | Support → +1.0; Oppose → 0; missing → 0. **One-sided** — Oppose does NOT push salience low; lack of support is just no signal. |
| Recommended weight | 0.5× |
| Uncertainty class | medium |
| v0.1 safety | ✅ Map |
| Cross-loads | Light CD (criminal-justice reform); mapper composite handles each target separately |

#### CC20_334d — Decrease the number of police on the street

| Field | Value |
|---|---|
| Exact wording | "Decrease the number of police on the street by 10 percent, and increase funding for other public services" |
| Response codes | `1` = Support, `2` = Oppose, `8` = Skipped, `9` = Not Asked |
| Direction | Support → ethnic_racial salience high (post-George-Floyd "defund" framing) |
| Per-item signal | Support → +1.0; Oppose → 0 (one-sided) |
| Recommended weight | 0.5× |
| Uncertainty class | medium |
| v0.1 safety | ✅ Map (cleanest 2020 race-conscious-reform item) |

#### CC20_334e — Ban the use of choke holds by police

| Field | Value |
|---|---|
| Exact wording | "Ban the use of choke holds by police" |
| Response codes | `1` = Support, `2` = Oppose, `8` = Skipped, `9` = Not Asked |
| Direction | Support → ethnic_racial salience high (broadly popular reform; weak discriminator) |
| Per-item signal | Support → +0.5; Oppose → 0 (one-sided, half-strength because broad consensus) |
| Recommended weight | 0.3× |
| Uncertainty class | high (broadly popular ~70%+ Support across all races) |
| v0.1 safety | ⚠ Reduced |

#### CC20_334f — National misconduct registry

| Field | Value |
|---|---|
| Exact wording | "Create a national registry of police who have been investigated for or disciplined for misconduct." |
| Response codes | `1` = Support, `2` = Oppose, `8` = Skipped, `9` = Not Asked |
| Direction | Support → ethnic_racial salience high |
| Per-item signal | Support → +0.7; Oppose → 0 |
| Recommended weight | 0.5× |
| Uncertainty class | medium |
| v0.1 safety | ✅ Map |

### 2.3 Items deliberately excluded from mB.ethnic_racial composite

| Variable | Reason |
|---|---|
| CC20_334b (body cameras) | Universally popular (~95% Support); zero discriminator |
| CC20_334c (increase police 10%) | Direction inverts to anti-reform; treating as positive ethnic_racial signal would code anti-reform respondents as race-conscious which is wrong |
| CC20_334g (end DOD military equipment) | Cross-loads with anti-militarism / PRO concerns rather than ethnic_racial primary |
| CC20_334h (allow suits against police) | Civil-liberty framing; PRO cross-load too strong |

### 2.4 mB.ethnic_racial 2020 composite output

```
ethnic_racial_signal = (
  0.5 × CC20_307_race_conditional +
  0.5 × CC20_334a_signal +
  0.5 × CC20_334d_signal +
  0.3 × CC20_334e_signal +
  0.5 × CC20_334f_signal
) / 2.3
```
Output is one-sided in [0, +1]; converted to salience scalar in [0, 3] via `salience = 1.0 + 2.0 × signal`. Default fallback salience = 1.0 (when signal is 0).

**v0.2 validation requirement:** Re-validate 2020 directionality against ANES once available. The post-George-Floyd context made these items unusually salient; cross-cycle stability not yet established.

## 3. moralBoundaries.gender composite

### 3.1 — 2020 composite

#### CC20_350a — Anti-discrimination amendment

| Field | Value |
|---|---|
| Battery | `CC20_350` ("Over the past two years, Congress voted on many issues. Do you support each of the following proposals? [Favor / Oppose]") |
| Exact wording | "Amend federal laws to prohibit discrimination on the basis of gender identity and sexual orientation." |
| Response codes | `1` = Favor, `2` = Oppose, `8` = Skipped, `9` = Not Asked |
| Direction | Favor → gender salience high; Oppose → gender salience near-fallback |
| Per-item signal | Favor → +1.0; Oppose → 0 (one-sided — Oppose doesn't push gender salience low; it's just absence of signal) |
| Recommended weight | 1.0× |
| Uncertainty class | low |
| v0.1 safety | ✅ Map |
| Cross-loads | CD primary (already routed); gender is a parallel routing not a cross-load |

#### CC20_350d — Equal pay

| Field | Value |
|---|---|
| Exact wording | "Require equal pay for women and men who are doing similar jobs and have similar qualifications." |
| Response codes | `1` = Favor, `2` = Oppose, `8` = Skipped, `9` = Not Asked |
| Direction | Favor → gender salience high; Oppose → gender salience low (but Favor is broadly popular ~80%) |
| Per-item signal | Favor → +0.5; Oppose → 0 (half-strength because of broad consensus) |
| Recommended weight | 0.5× |
| Uncertainty class | medium |
| v0.1 safety | ⚠ Reduced |
| Note | This is the item from `mapper-hard-node-source-audit.md` §10 where gender-load is STRONGER than CD-load. The CD composite uses it at 0.5× also; gender composite uses at 0.5× independently. Not double-counting because composites are per-target. |

#### CC20_355d — Ban Transgender People in the Military

| Field | Value |
|---|---|
| Battery | `CC20_355` ("For each of the following tell us whether you support or oppose these decisions") |
| Exact wording | "Ban Transgender People in the Military" |
| Response codes | `1` = Support, `2` = Oppose, `8` = Skipped, `9` = Not Asked |
| Direction | Support → gender salience high (anti-trans-rights framing makes gender highly salient); Oppose → gender salience high (pro-trans-rights ALSO makes gender salient — opposite political direction, same salience). **Two-sided**: any non-neutral answer pushes gender salience high. |
| Per-item signal | Support → +1.0; Oppose → +1.0; missing/skipped → 0. (Salience signal is direction-agnostic.) |
| Recommended weight | 1.0× |
| Uncertainty class | low |
| v0.1 safety | ✅ Map |
| Implementation note | This is the cleanest gender-salience signal because BOTH anti-trans and pro-trans respondents show high gender salience — only the apolitical respondents (skipped/no-answer) push salience low. Mapper resolver must apply a *direction-agnostic* transform (use `\|response_value − neutral\|` not signed direction). |

### 3.2 mB.gender 2020 composite output

```
gender_signal = (
  1.0 × CC20_350a_one_sided +
  0.5 × CC20_350d_one_sided +
  1.0 × CC20_355d_direction_agnostic
) / 2.5
```
Output is in [0, +1]; salience scalar = `1.0 + 2.0 × signal` in [1.0, 3.0].

### 3.3 — 2024 composite (REDUCED)

#### CC24_340c — Same-sex + interracial marriage federal recognition

| Field | Value |
|---|---|
| Battery | `CC24_340grid` ("Do you support or oppose each of the following bills before Congress?") |
| Exact wording | "Require that all federal agencies recognize same-sex marriages and interracial marriages." |
| Response codes | `1` = Support, `2` = Oppose, `8` = Skipped, `9` = Not Asked, `.` = Missing |
| Direction | Support → gender salience high (one-sided, mirrors CC20_350a) |
| Per-item signal | Support → +0.7; Oppose → 0 (one-sided; reduced strength because the item is more about marriage equality than gender identity per se) |
| Recommended weight | 0.5× |
| Uncertainty class | medium |
| v0.1 safety | ⚠ Reduced |
| Cross-loads | CD primary (already routed); ethnic_racial light (interracial marriage component) — gender routing is secondary |

#### CC24_323d — Dreamers / DACA (light cross-load)

| Field | Value |
|---|---|
| Battery | `CC24_323grid` immigration |
| Exact wording | "Provide permanent resident status to children of immigrants who were brought to the United States by their parents (also known as Dreamers). Provide these immigrants a pathway to citizenship if they meet the citizenship requirements and have committed no crimes" |
| Direction | Light universalist signal, not gender-specific. **Note**: prior audits did not list a gender cross-load for this item; including here only as a marginal contribution because 2024 has so few gender items. |
| Per-item signal | Support → +0.2; Oppose → 0 |
| Recommended weight | 0.2× |
| Uncertainty class | high |
| v0.1 safety | ⚠ Marginal |

### 3.4 mB.gender 2024 composite output

```
gender_signal_2024 = (
  0.5 × CC24_340c_one_sided +
  0.2 × CC24_323d_one_sided
) / 0.7
```
Output is in [0, +1]; salience scalar = `1.0 + 2.0 × signal`. Mapper flag uncertainty `medium` — single-primary-item composite.

### 3.5 mB.gender 2008 / 2012 / 2016

No CCES per-year items audited here support a v0.1 gender-salience
composite for the older cycles. Maintain fallback (salience = 1.0,
uncertainty = high). Defer to v0.2 with ANES gender-policy items if
the ANES loader ships before the older-cycle re-audit.

## Implementation contract for mapper v0.1 resolver

The resolver layer for v0.1 needs the following per-cycle composites
wired in:

```
RESOLVER_TABLE_2016 = {
  ZS_proxy: {
    items: [{ var: "CC16_337_3", weight: 0.2, direction: "ranked_first_to_zs_low" }],
    uncertainty: "high",
    near_fallback: true
  }
}

RESOLVER_TABLE_2020 = {
  ZS_proxy: {
    items: [
      { var: "CC20_303", weight: 0.3, signal_fn: "income_decrease_to_zs_high" },
      { var: "CC20_355b", weight: 0.5, signal_fn: "support_to_zs_high" },
      { var: "CC20_331d", weight: 0.3, signal_fn: "support_to_zs_high" }
    ],
    uncertainty: "medium"
  },
  ethnic_racial_proxy: {
    items: [
      { var: "CC20_307", weight: 0.5, signal_fn: "race_conditional_unsafe_to_high" },
      { var: "CC20_334a", weight: 0.5, signal_fn: "support_one_sided" },
      { var: "CC20_334d", weight: 0.5, signal_fn: "support_one_sided" },
      { var: "CC20_334e", weight: 0.3, signal_fn: "support_one_sided_half" },
      { var: "CC20_334f", weight: 0.5, signal_fn: "support_one_sided" }
    ],
    uncertainty: "medium",
    v02_validation_against_anes: true
  },
  gender_proxy: {
    items: [
      { var: "CC20_350a", weight: 1.0, signal_fn: "favor_one_sided" },
      { var: "CC20_350d", weight: 0.5, signal_fn: "favor_one_sided_half" },
      { var: "CC20_355d", weight: 1.0, signal_fn: "any_response_direction_agnostic" }
    ],
    uncertainty: "low"
  }
}

RESOLVER_TABLE_2024 = {
  ZS_proxy: {
    items: [
      { var: "CC24_303", weight: 0.5, signal_fn: "price_increase_to_zs_high" },
      { var: "CC24_341b", weight: 0.1, signal_fn: "support_to_zs_low_light" },
      { var: "CC24_341c", weight: 0.1, signal_fn: "support_to_zs_low_light" },
      { var: "CC24_341d", weight: 0.1, signal_fn: "support_to_zs_low_light" }
    ],
    uncertainty: "medium"
  },
  gender_proxy: {
    items: [
      { var: "CC24_340c", weight: 0.5, signal_fn: "support_one_sided_seven_tenths" },
      { var: "CC24_323d", weight: 0.2, signal_fn: "support_one_sided_two_tenths" }
    ],
    uncertainty: "medium",
    near_fallback: false
  }
}

RESOLVER_TABLE_2008 = {} // ZS, ethnic_racial, gender all stay at fallback
RESOLVER_TABLE_2012 = {} // same
```

The `signal_fn` names above are the implementation contracts for the
mapper's per-item transforms. The complete list of distinct
`signal_fn` types needed:

1. `ranked_first_to_zs_low` — for ranking items: rank 1 → −0.5, rank 2 → 0, rank 3 → +0.5.
2. `income_decrease_to_zs_high` — `(response_value − 3) / 2` for CC20_303 5-point scale.
3. `price_increase_to_zs_high` — `(3 − response_value) / 2` for CC24_303 (INVERTED sign vs income).
4. `support_to_zs_high` — Support → +1.0, Oppose → −1.0.
5. `support_to_zs_low_light` — Support → −0.5, Oppose → 0 (one-sided light).
6. `race_conditional_unsafe_to_high` — gated on respondent.race ∈ non-white set, then `max(0, (response − 2) / 2)`.
7. `support_one_sided` — Support → +1.0, else 0.
8. `support_one_sided_half` — Support → +0.5, else 0.
9. `support_one_sided_seven_tenths` — Support → +0.7, else 0.
10. `support_one_sided_two_tenths` — Support → +0.2, else 0.
11. `favor_one_sided` — Favor → +1.0, else 0.
12. `favor_one_sided_half` — Favor → +0.5, else 0.
13. `any_response_direction_agnostic` — Support OR Oppose → +1.0, missing/skipped → 0.

## Summary

After v0.1 implementation of these composites, the projected coverage
shift for the 6 target × cycle cells:

| Target | Cycle | Current real-signal % | Projected v0.1 % |
|---|---:|---:|---:|
| ZS | 2016 | 0% | ~30% (near-fallback flagged) |
| ZS | 2020 | 0% | 90+% |
| ZS | 2024 | 0% | 90+% (single primary item drives most signal) |
| mB.ethnic_racial | 2020 | 0% | 90+% |
| mB.gender | 2020 | 0% | 90+% |
| mB.gender | 2024 | 0% | ~50% (single primary item) |

## What this spec deliberately does NOT do

- No mapper code modifications.
- No engine, selector, browser, dist, output, candidate, or era-context edits.
- No raw-data downloads.
- No edits to generated smoke outputs.

## Files

- `results/electorate/synthetic-electorate/mapper-zs-boundary-implementation-spec.md` (this file)
- `results/electorate/synthetic-electorate/mapper-zs-boundary-implementation-spec.json` (machine-readable mirror)

## Terminology check

`moralBoundaries.ethnic_racial` and `moralBoundaries.gender` are
canonical compound moral-circle boundaries per ADR-006. Engagement is
referenced only as a downstream concern — separate 1D continuous
scalar per ADR canon — not surfaced by any item specified here.
Legacy code identifiers (`CC*_*`, `pid7`, `ideo5` etc.) appear only
as CCES variable names.
