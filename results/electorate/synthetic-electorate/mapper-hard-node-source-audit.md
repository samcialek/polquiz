# Mapper hard-node source audit

**Date:** 2026-05-04 (Terminal-3, read-only)
**Status:** Documentation only. **No mapper code touched. No engine, selector, browser, dist, output, or generated-smoke edits.**
**Companion file:** `mapper-hard-node-source-audit.json`
**Coverage baseline:** `survey-to-prism-mapper-coverage-audit.{md,json}` (Phase 2.7.7) — confirms all 10 nodes audited here are at 0% real-signal coverage across all 5 cycles.

## Purpose

Determine which remaining blocked PRISM nodes can be responsibly
mapped from CCES alone, which require ANES, and which are inherent
fallbacks. Per the coverage audit, **10 targets are at 0%
real-signal coverage**:

`MOR`, `PRO`, `COM`, `ZS`, `ONT_H`, `ONT_S`, `EPS`, `AES`,
`moralBoundaries.ethnic_racial`, `moralBoundaries.gender`.

Every one of those is currently a signature blocker — the mapper
ships uniform priors (or in the case of moral-boundary salience, a
fallback default of 1.0). This audit identifies, per node, the best
available CCES source(s), assesses whether the source is
direct/proxy/too-weak/forbidden, and recommends one of four
trajectories: **map in v0.1**, **defer to v0.2**, **require ANES**,
or **inherent fallback**.

## Forbidden / circular fields (universal)

The following CCES fields are **never** allowed as inputs for any
node audited here, per the mapper's circularity contract:

- Vote-choice columns (`CC*_410*`)
- Candidate feeling thermometers (`CC*_320*` series)
- `pid7` for any core PRISM position node — *only* as the flagged signal for `moralBoundaries.political_camp` salience
- Validated turnout (`CL_*`, `vv_turnout_*`)
- Predicted-vote outputs from any model
- Self-reported election-eve vote intent

Items that have a "partisan-camp signal only" classification (e.g.,
CC20_350c Kavanaugh, CC20_350f/g Trump impeachment, CC24_356 ACB
confirmation) are similarly forbidden as PRO/ONT_S inputs because
they cross-load too heavily with `political_camp` and would inject
circular vote-prediction signal into PRO/ONT_S.

## TL;DR

| Node | CCES source quality | Recommendation |
|---|---|---|
| **MOR** | Light cross-load (already in CU composite) | Defer to v0.2 — promote cross-load to primary |
| **PRO** | Too weak (only partisan-camp items found) | Require ANES — VCF0604 + democracy-norms battery |
| **COM** | Forbidden (no clean CCES item) | Require ANES — direct compromise Likert |
| **ZS** | Light, derivable from existing items | Map in v0.1 (proxy from CC*_303 + economic items) |
| **ONT_H** | None (CCES has no item) | Require ANES — Feldman-Stenner battery |
| **ONT_S** | Weak proxy from police-trust items | Require ANES for primary; CCES weak proxy possible v0.2 |
| **EPS** | Insufficient (newsint only, no media-trust) | Require ANES — science/media trust battery |
| **AES** | None (no survey item exists) | **Inherent fallback** — uniform `[1/6 × 6]` is the honest answer |
| **mB.ethnic_racial** | Proxy in 2020 (post-George-Floyd police battery) | Map in v0.1 for 2020 only; defer 2008/2012/2016/2024 to v0.2 (need ANES) |
| **mB.gender** | Proxy from existing CD items | Map in v0.1 (promote gender salience cross-load on existing CD items) |

**v0.1 immediate gains: 3 nodes** (ZS, ethnic_racial-2020, gender — all via re-routing or proxy).
**v0.2 carry-over: 3 nodes** (MOR, PRO, ONT_S via composite work).
**ANES-required: 4 nodes** (COM, ONT_H, EPS + ONT_S/PRO/EPS at high quality).
**Inherent fallback: 1 node** (AES).

## Per-node analysis

### 1. MOR (Moral Circle)

**Definition:** 1 = narrow / in-group; 5 = universal.

**CCES candidates:**
| Variable | Cycle | Status | Notes |
|---|---|---|---|
| CC16_331_5 (Syria refugees) | 2016 | already routed CU + light MOR | Strong narrow-circle marker |
| CC20_350e (Dreamers/DACA) | 2020 | already routed CU + MOR (light) | Universalist on Support |
| CC24_323d (Dreamers + pathway to citizenship) | 2024 | already routed CU + MOR (light) | Universalist on Support |
| Foreign aid items | all | not present in CCES per-year files | ANES has these |

**Pattern:** Every cycle has at least one CU-loaded immigration item that already carries an audited MOR cross-load. The mapper composites currently treat MOR as "light" cross-load only.

**Recommendation:** **Defer to v0.2**, where the existing items get a SECOND routing into a primary MOR composite (alongside the CU primary). This is signal-extraction, not new-source acquisition — the data is already in the mapper, just not being routed to MOR. Confidence: medium-high. v0.2 work is composite-design, not data-acquisition.

**ANES alternative for higher confidence:** VCF0830 (aid to Black Americans) + foreign-aid items + thermometer-differential signal.

---

### 2. PRO (Proceduralism)

**Definition:** 1 = results matter; 5 = rules bind every side.

**CCES candidates examined (and rejected as primary signals):**
- **CC20_350c (Kavanaugh)**, **CC20_350f/g (Trump impeachment)**, **CC20_356 (ACB confirmation)**: heavily partisan-camp-loaded. Including these in PRO would inject `political_camp` circularity directly into a core position node — forbidden.
- **CC20_355d (trans-military ban)**: light "executive overreach" cross-load with PRO. Currently routed to CD primary + gender secondary; lifting to PRO would over-share signal across nodes.
- **CC24_340e (renew 9/11 surveillance)**: PRO/civil-liberties cross-load, but a single item with strongly partisan-coded direction in 2024 (Republican right-civil-libertarians + Democratic left-civil-libertarians both Oppose, while moderate Democrats + Republicans Support).

**Verdict:** No clean CCES PRO signal exists in the per-year batteries audited. Every candidate cross-loads with political-camp partisanship.

**Recommendation:** **Require ANES** (VCF0604 trust in government — institutional rule-of-law proxy — plus the 2020+ democracy-norms battery). For v0.2, a **forced-low-prior** is acceptable — flag PRO as known-weak and let downstream consumers either weight it down or use the prior unchanged.

---

### 3. COM (Compromise Tolerance)

**Definition:** 1 = principled / no-deals; 5 = pro-compromise dealmaker.

**CCES candidates:** None found. The 2016/2020/2024 per-year files contain no compromise-Likert items.

**ANES has the canonical item:**
> "Do you think it is more important that political leaders compromise to get things done, or stand up for their principles?"
(2016, 2020 ANES).

**Recommendation:** **Require ANES.** v0.1 mapper continues to ship COM at uniform fallback prior. Document COM as known-weak in mapper provenance until the ANES path lands.

---

### 4. ZS (Zero-Sum)

**Definition:** 1 = positive-sum; 5 = zero-sum / "their gain is our loss."

**CCES candidates (proxy via existing items):**
| Variable | Cycle | Direction (Yes/Support →) | Confidence |
|---|---|---|---|
| CC20_303 (income change past year) | 2020 | "Decreased" → ZS high (mild) | Low-medium |
| CC24_303 (prices change past year) | 2024 | "Increased" → ZS high (mild) | Low-medium |
| CC20_355b (Withdraw TPP) | 2020 | Support → ZS high | Medium |
| CC20_331d (Reduce legal immigration 50%) | 2020 | Support → ZS high (light cross-load) | Medium |
| CC16_337_3 (Raise taxes ranked first) | 2016 | Light ZS-low cross-load | Low |

**Recommendation:** **Map in v0.1** as a low-weight composite. The signal is weak per item but multi-item averaging across 2-3 items per cycle is enough for a directionally correct posterior. Flag uncertainty as `medium` — ZS is a known-weak CCES node, full coverage requires ANES (V202233 immigration-takes-jobs in 2020).

**v0.1 recommended composite per cycle:**
- 2016: CC16_337_3 (very light), backstopped by economy_retro (cumulative file). Fallback-near.
- 2020: CC20_303 (0.3×) + CC20_355b (0.5×) + CC20_331d-light (0.3×).
- 2024: CC24_303 (0.3×) + CC24_341 tax items (light cross-load only).

Composite is honest about being weak; v0.2 should add ANES VCF cumulative items for stronger primary signal.

---

### 5. ONT_H (Human Malleability)

**Definition:** 1 = humans are fixed by nature; 5 = humans are shaped by environment.

**CCES candidates:** Effectively none. The CCES per-year batteries do not contain Feldman-Stenner authoritarian-parenting items, child-rearing values items, or any direct nature-vs-nurture probe.

**ANES is the only viable source:** Feldman-Stenner authoritarian-parenting battery (V162267-V162272 in 2016; equivalent in 2020). Asks respondents which trait is more important in children: independence vs respect for elders, curiosity vs good manners, etc.

**Recommendation:** **Require ANES.** v0.1 mapper continues to ship ONT_H at uniform fallback prior. ONT_H is the cleanest "ANES-only" node in the audit — the mapper's ONT_H signal will remain blocked until the ANES loader is implemented.

---

### 6. ONT_S (System Ontology / Institutional Trust)

**Definition:** 1 = system is rigged; 5 = institutions can produce good change.

**CCES candidates examined:**
| Variable | Cycle | Status | Reason |
|---|---|---|---|
| CC20_307 ("Do the police make you feel...?") | 2020 | weak proxy | Police-trust only; primary load is `moralBoundaries.ethnic_racial`, secondary on ONT_S |
| CC20_334 police-reform battery | 2020 | weak proxy | Same as above; primary load is racial/justice-reform |
| approval_pres / approval_court (cumulative file) | all | **partisan situational confound** — co-partisan administration boosts in-party trust artificially |
| CCES per-year approval items | all | not exposed in per-year file column set (only in cumulative) |

**Verdict:** CCES has weak indirect proxies; ANES has the cleaner item (VCF0604 "How much of the time do you trust the government in Washington to do what is right?").

**Recommendation:** **Require ANES** for primary signal. v0.2 can ship a CCES-only proxy from CC20_307 + CC20_334 (2020-only) at very low weight, but the primary path is ANES.

**v0.1 stays at fallback** for ONT_S across all cycles.

---

### 7. EPS (Epistemic Style)

**Definition:** Categorical 6-cat distribution: empiricist / institutionalist / traditionalist / intuitionist / autonomous / nihilist.

**CCES candidates:**
| Variable | Cycle | Status |
|---|---|---|
| `newsint` (news interest) | all | Already used for engagement; salience proxy at most, not category |
| Media-trust items (`science_trust`, `media_trust`) | all | NOT present in CCES per-year files |

**ANES has the canonical battery:** science-trust + media-trust + journalism-trust + religious-authority-trust items. Allows respondents to be assigned a probability distribution over the 6 EPS categories rather than a hard single-category assignment.

**Recommendation:** **Require ANES.** v0.1 mapper continues to ship the EPS broad prior `[0.20, 0.30, 0.10, 0.15, 0.15, 0.10]` (institutionalist + empiricist weighted) per spec. EPS is by-design unfillable from CCES alone.

---

### 8. AES (Aesthetic Style)

**Definition:** Categorical 6-cat distribution: statesman / technocrat / pastoral / authentic / fighter / visionary.

**CCES candidates:** None — surveys do not directly probe aesthetic preference. The only adjacent-feeling items are candidate feeling thermometers, which are **forbidden** for vote-prediction circularity.

**Recommendation:** **Inherent fallback.** Per ADR-003, AES is archetype-label flavor and not load-bearing for vote prediction. The mapper's uniform `[1/6 × 6]` distribution is the honest answer; do not change in v0.1, v0.2, or any future version unless a non-circular AES proxy is identified.

---

### 9. moralBoundaries.ethnic_racial

**Definition:** 0–3 salience scalar; "to what extent does ethnic/racial identity structure the respondent's political reasoning?"

**CCES candidates:**
| Variable | Cycle | Direction (Yes/Support →) | Confidence |
|---|---|---|---|
| CC20_307 (police safety) | 2020 | "Mostly unsafe" → ethnic_racial high (for non-white respondents) | Medium |
| CC20_334a-h (police-reform battery) | 2020 | Reform Support → race-conscious framing high | Medium |
| race + race-policy interactions | all | Demographic stratum × policy answers; needs joint modeling | Medium |
| CC24_340c (interracial marriage component) | 2024 | already routed CD; light ethnic_racial cross-load | Low |

**Verdict:** 2020 has the strongest CCES signal (post-George-Floyd police reform battery makes race-policy items unusually salient). Other cycles have only proxy signal via interactions with respondent demographics.

**Recommendation:** **Map in v0.1 for 2020 only**, using a CC20_334 composite (items a, c, d, f, g, h — reform-direction items at low weight). For 2008/2012/2016/2024, **defer to v0.2** with ANES VCF0830 (aid to Black Americans) + Black Lives Matter thermometer differentials.

**v0.1 2020 composite (recommended):**
- CC20_334d (Decrease police 10%): 0.5× (Support → race-conscious-reform high)
- CC20_334a (Eliminate mandatory minimums for non-violent drug offenders): 0.5×
- CC20_334e (Ban chokeholds): 0.3× (broadly popular; weak discriminator)
- CC20_307 (Do the police make you feel safe): 0.5× (race-conditional — interaction with respondent's race needed)

**Confidence: medium.** The proxy works for 2020 because the post-George-Floyd context made race-policy items unusually salient; v0.2 should re-validate 2020 directionality against ANES once available.

---

### 10. moralBoundaries.gender

**Definition:** 0–3 salience scalar; "to what extent does gender identity structure the respondent's political reasoning?"

**CCES candidates already in mapper as cross-loads:**
| Variable | Cycle | Current routing | Promotion candidate |
|---|---|---|---|
| CC20_350a (gender-id/sexual-orient anti-discrimination) | 2020 | CD primary + gender cross-load | YES (lift cross-load → primary) |
| CC20_350d (equal pay) | 2020 | CD light + gender cross-load | YES (lift cross-load → primary; gender-load is stronger than CD-load) |
| CC20_355d (trans-military ban) | 2020 | CD primary + gender + national | YES (lift cross-load → primary) |
| CC24_340c (same-sex + interracial marriage) | 2024 | CD primary + gender (light) | YES (lift cross-load → primary) |

**Recommendation:** **Map in v0.1.** The data is already in the mapper — just not being routed to a primary `moralBoundaries.gender` salience composite. Promotion is composite-design work, not data acquisition.

**v0.1 gender-salience composite per cycle:**
- 2020: CC20_350a (1.0×) + CC20_355d (1.0×) + CC20_350d (0.5×).
- 2024: CC24_340c (0.5×) — single weak item; gender-salience for 2024 is low.
- 2008/2012/2016: no direct items in audited batteries; use fallback at salience 1.0.

**Confidence:** High for 2020 (3 items), medium for 2024 (1 item), low for 2008/2012/2016 (no items).

---

## Summary by recommendation

### Map in v0.1 (3 nodes)

- **ZS** — composite from CC*_303 + economic items (low confidence; honest about weakness).
- **moralBoundaries.ethnic_racial (2020 only)** — CC20_334 police-reform battery proxy.
- **moralBoundaries.gender (2020/2024)** — promote existing CD-item cross-loads.

### Defer to v0.2 (3 nodes)

- **MOR** — composite-design work to promote existing CU-item cross-loads (CC16_331_5, CC20_350e, CC24_323d) to a primary MOR composite.
- **PRO** — needs custom non-circular composite design; the only available CCES items are politically-camp-loaded.
- **moralBoundaries.ethnic_racial (2008/2012/2016/2024)** — needs ANES VCF0830 for primary signal in non-2020 cycles.

### Require ANES (4 nodes)

- **COM** — direct "politicians should compromise" Likert.
- **ONT_H** — Feldman-Stenner authoritarian-parenting battery.
- **ONT_S** — VCF0604 trust in government (CCES proxies are partisan-confounded).
- **EPS** — science/media-trust battery for category-distribution assignment.

### Inherent fallback (1 node)

- **AES** — uniform Dist6; no survey item exists, no proxy is non-circular. Per ADR-003, AES is archetype-label flavor and not load-bearing for vote prediction.

## Cross-cycle viability summary

| Node | 2008 | 2012 | 2016 | 2020 | 2024 |
|---|:-:|:-:|:-:|:-:|:-:|
| MOR | v0.2 | v0.2 | v0.2 (CC16_331_5) | v0.2 (CC20_350e) | v0.2 (CC24_323d) |
| PRO | ANES | ANES | ANES | ANES | ANES |
| COM | ANES | ANES | ANES | ANES | ANES |
| ZS | v0.1 (cumul.) | v0.1 (cumul.) | v0.1 (low) | **v0.1** | v0.1 (low) |
| ONT_H | ANES | ANES | ANES | ANES | ANES |
| ONT_S | ANES | ANES | ANES | v0.2 (proxy) | ANES |
| EPS | ANES | ANES | ANES | ANES | ANES |
| AES | fallback | fallback | fallback | fallback | fallback |
| mB.ethnic_racial | v0.2/ANES | v0.2/ANES | v0.2/ANES | **v0.1** (CC20_334) | v0.2/ANES |
| mB.gender | fallback | fallback | fallback | **v0.1** (CC20_350+CC20_355d) | v0.1 (CC24_340c, weak) |

## Concrete v0.1 implementation impact

If v0.1 mapper composite work proceeds on the three "map in v0.1"
recommendations, expected coverage lift per the Phase 2.7.7 baseline:

| Target | Current real-signal % | Projected v0.1 % | Delta |
|---|---:|---:|---:|
| ZS (2020) | 0.0 | 90+ | +90pp |
| ZS (2016) | 0.0 | ~60 | +60pp |
| ZS (2024) | 0.0 | ~60 | +60pp |
| moralBoundaries.ethnic_racial (2020) | 0.0 | 90+ | +90pp |
| moralBoundaries.gender (2020) | 0.0 | 90+ | +90pp |
| moralBoundaries.gender (2024) | 0.0 | ~50 | +50pp (single-item composite) |

That's **6 (target × cycle) cells** that move from blocker to
covered in v0.1, plus weaker-but-non-blocker coverage on cells like
ZS-2008/2012 if cumulative-file items are added.

The remaining 4 nodes (PRO/COM/ONT_H/EPS) are structurally
ANES-blocked. Until the ANES loader ships, no amount of CCES
composite work can move them off fallback.

## What this audit deliberately does NOT do

- No mapper code modifications. Composite recommendations are spec-only.
- No ANES loader implementation — that's a separate phase.
- No engine, selector, browser, dist, output, candidate, or era-context edits.
- No raw-data downloads. CCES codebooks consulted are locally cached; ANES path mentioned but not invoked.

## Files

- `results/electorate/synthetic-electorate/mapper-hard-node-source-audit.md` (this file)
- `results/electorate/synthetic-electorate/mapper-hard-node-source-audit.json` (machine-readable mirror)

## Terminology check

`moralBoundaries.ethnic_racial`, `moralBoundaries.gender`,
`moralBoundaries.political_camp` are the canonical compound
moral-circle boundaries per ADR-006. Engagement is referenced only
as a downstream concern — separate 1D continuous scalar per ADR
canon — not surfaced by any item audited here. Legacy code
identifiers (`pid7`, `ideo5`, `CC*_*`, `VCF0604` etc.) appear only
as CCES / ANES variable names.
