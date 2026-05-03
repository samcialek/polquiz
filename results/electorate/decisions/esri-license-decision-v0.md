# Esri / ArcGIS Tapestry — License Decision Memo (v0)

**Created**: 2026-05-03
**Status**: Decision memo. Documentation only. No engine code, mapper specs, candidate data, era-context data, EIG files, or browser/dist/output/live-data files modified.
**Inputs read**:
- `results/electorate/intake/acs-esri-geography-intake.md` (A1b)
- `results/electorate/intake/ces-anes-codebook-intake.md` (A1)
- `results/electorate/intake/variable-catalog-v0.json` (A1 + A1b)
- `results/electorate/mapping/survey-to-prism-v0.md` (A2)
- `results/electorate/mapping/coverage-gap-report-v0.md` (Terminal-1 coverage rollup)

**Terminology** (canonical): moral-boundary salience / moral-boundary loading throughout. Engagement is a one-dimensional continuous scalar. Legacy implementation shims are irrelevant to this procurement decision.

---

## 0. Decision in one paragraph

**Defer Esri Tapestry purchase.** The PRISM simulator's blocking constraints for Phase 1 and Phase 2 are upstream of geography (survey→PRISM mapping coverage gaps, candidate signature audits, vote-formula validation). For those phases, ACS — particularly ACS 5-year + IPUMS PUMS + NHGIS for cross-vintage geography — is sufficient and reproducible. Esri Tapestry becomes worth re-evaluating only at Phase 4, and only if state/county-level projections show geographically patterned residuals that ACS covariates fail to explain. Until then, paid licensing, vintage-mismatch for pre-2020 backtests, and ACS-derivative circularity argue against acquisition.

---

## 1. Phase-by-phase need analysis

### 1.1 Phase 1 — single-year MVP backtest (2008-2024)

**Need for Esri: no.**

Phase 1 is per-respondent: take a CES/ANES respondent, infer their PRISM signature via the v0 mapper, run `respondentVoteChoice` against coded candidates, compare aggregated weighted vote to actual popular vote. This is a *survey-attitudinal* exercise. The blocking constraints are:

- **Mapper coverage gaps** (per `coverage-gap-report-v0.md`): AES absent, COM near-absent, ONT_H near-absent, PRO weak. None of these are addressable by Esri.
- **Candidate signature accuracy** (per existing `audit/2024-candidate-and-activation-review.md`).
- **Vote-formula sensitivity to high-uncertainty mapper outputs** — does the engine handle a flat AES posterior gracefully?

Esri Tapestry contributes nothing to any of these. ACS is sufficient for the poststratification step (weighting respondents up to a population estimate); see § 4 for the comparison.

### 1.2 Phase 2 — historical extension across modern survey-era

**Need for Esri: no.**

Phase 2 repeats Phase 1 across 2008, 2012, 2016, 2020, 2024 to test whether the engine degrades systematically with cycle age. Same constraints as Phase 1; same answer.

Worse: Esri Tapestry's current vintage is 2024 + 2025 only. Using current Tapestry to characterize 2008/2012/2016 neighborhoods introduces a 10-15-year temporal mismatch that materially distorts segment assignments. So even if Esri *were* informative for Phase 1, Phase 2's pre-2020 cycles would receive degraded Tapestry signal.

### 1.3 Phase 4 — geography projection (state / county / forward-forecast)

**Need for Esri: maybe — as optional MRP covariate or narrative coloring.**

Phase 4 introduces sub-national geographic resolution. The new constraint is not survey coverage but *spatial scaffolding*: how do you project per-respondent posteriors to county- or state-level populations when the survey's per-state subsample is thin?

The honest answer: ACS 5-year at tract / block-group + per-state vote returns + cohort-replacement projections is the *first* thing to try. If those produce geographically patterned residuals — i.e., the model under-predicts D in suburbs or over-predicts R in rural exurbs in ways that cluster geographically and aren't captured by the demographic cells — Esri Tapestry's neighborhood psychographic segments are a candidate covariate to add to MRP.

But this is a *secondary* question, and the right time to ask it is after Phase 4 begins and produces a residual map that's hard to explain with ACS alone.

---

## 2. What Esri Tapestry adds beyond ACS

| Capability | ACS | Esri Tapestry | Marginal value |
|---|---|---|---|
| Race / age / sex / education distributions per geography | ✓ | ✓ (downstream) | none — Tapestry is built FROM these |
| Income / employment / housing distributions | ✓ | ✓ (downstream) | none — same |
| Household structure / family type | ✓ | ✓ (downstream) | none — same |
| Consumer behavior + media consumption clusters | ✗ | ✓ | **moderate** — this is genuinely additive |
| Lifestyle segment narrative labels ("Set to Impress") | ✗ | ✓ | low — useful for reports, not models |
| Lifestyle gradients tied to political behavior | ✗ | indirectly | low — correlations are well-known but circular for vote prediction |
| Reproducibility by external readers using free tools | ✓ | ✗ | negative for Esri |

**Net**: Esri adds consumer-behavior + media-consumption variance that ACS doesn't capture. The question is whether *that specific* variance materially improves vote-share predictions beyond what ACS demographic cells already explain. Empirically: in published MRP literature, neighborhood lifestyle covariates add small but real signal — usually 1-3% improvement in subgroup RMSE, occasionally more for hard-to-classify suburbs. For PRISM, the same signal would manifest most strongly in Phase 4 county-level projections.

---

## 3. What Esri Tapestry does NOT solve

- **Mapper coverage gaps**: AES, COM, ONT_H, PRO are missing/weak in survey data and remain so under any geographic enrichment. Tapestry has no political attitude content.
- **Moral-boundary salience inference**: each per-boundary loading (national / ethnic_racial / religious / class / ideological / gender / political_camp) is derived from individual-level survey responses. Tapestry contributes no individual-level signal here.
- **Candidate signature accuracy**: candidate PRISM coding lives in `src/historical/candidates.ts` and is independent of any geographic data.
- **Era-context calibration**: era-context calls are at the election level, not the geographic level.
- **Engagement scalar inference**: `engagement` is per-respondent from survey items (news interest, validated turnout, past-vote history). No geographic enrichment improves it.
- **Vote-formula validation**: the engine's distance / weighting / clearing-bar logic is invariant to geographic enrichment.

In short: Esri does not solve any of the *structural* limitations of the simulator. It only addresses an optional Phase-4 enrichment opportunity.

---

## 4. Risks of acquiring Esri Tapestry now

### 4.1 No political attitude content

Tapestry segments correlate with political behavior — but they don't *measure* it. A risk is that downstream consumers (or even modeling code) start treating "this tract is segment X, segment X tends Republican" as direct political signal. That's correlation-as-causation. The mapper plan deliberately keeps PRISM signature inference at the individual level from survey responses; using Tapestry as a primary political signal would violate that design choice.

### 4.2 Paid / closed licensing

ArcGIS Business Analyst, GeoEnrichment service credits, or institutional ArcGIS Online subscription required. Reproducibility is constrained: anyone replicating the analysis needs the same Esri license tier. Open-data alternatives (raw ACS) are reproducible by anyone with a free Census API key.

This is also a budget question. **Pricing caveat**: Esri sells through quote-based plans, institutional / academic licensing tiers, and credit-based GeoEnrichment usage rather than a fixed price list. Any specific dollar figure requires a current quote from Esri at the project's institutional posture, not a published retail number. The cost should be **verified directly with Esri before procurement**; this memo intentionally does not anchor to a numeric range. See the references section at the bottom for official Esri pages on Business Analyst purchasing and Tapestry licensing/migration.

### 4.3 Current-vintage mismatch for 2008 / 2012 / 2016 backtests

Esri ships current Tapestry at 2024 + 2025 vintages only. Pre-2020 historical Tapestry is not generally available. Using 2024-vintage segments to characterize a 2010-era tract introduces gross temporal mismatch — many tracts have completely different segment assignments now than they did 15 years ago (e.g., gentrified urban tracts, exurban developments). For Phase 1 / Phase 2 backtests on 2008 / 2012 / 2016 cycles, Esri is effectively unavailable.

### 4.4 2024 → 2025 Tapestry vocabulary discontinuity

The June 2025 release of ArcGIS Tapestry replaced the legacy Esri Tapestry Segmentation system. From verified A1b intake:
- Legacy 2024: 67 distinct + 1 unclassified segments / 14 + 1 LifeMode groups
- Current 2025: 60 distinct + 1 unclassified / 12 + 1 LifeMode (A-L)
- 33 segments persist by name (with potentially shifted footprints); 27 are new
- **No official 2024 ↔ 2025 crosswalk exists**
- Legacy 2024 retires June 2026

Anything built against the 2024 system needs migration to 2025 within ~13 months. Investing in 2024 vocabulary now is a known dead-end. If we acquire, it would be against 2025 directly — but 2025 is a fresh release with limited published validation against US political behavior. Either timing point carries discontinuity risk.

### 4.5 ACS-derivative circularity

ArcGIS Tapestry is constructed from Census 2020 + ACS 2019-2023 + Esri Updated Demographics 2025 (verified A1b intake). If the modeling pipeline already uses ACS for poststratification, layering Tapestry on top is partial double-counting on the demographic axis. The defensible additive content (consumer behavior, media consumption) is a fraction of the total Tapestry feature set; the rest is re-packaged ACS.

This is not a fatal flaw — careful MRP design can use Tapestry segments as covariates orthogonal to the ACS poststratification cells — but it requires explicit modeling discipline.

---

## 5. Alternatives compared

### 5.1 ACS only (Census API)

**Description**: Census API directly via `tidycensus` or `cenpy`. ACS 5-year tables for the matching cycle of each backtest year. Standard B-tables for race / age / sex / education / income / employment / housing / nativity / language.

**Pros**: Free, reproducible, well-documented, matches every backtest year (5-year vintages cover 2008-2024). Sufficient for poststratification and Phase 1/2 weighting.

**Cons**: No consumer-behavior or lifestyle-segment variance. State / county MRP at coarser resolution than block-group enrichment would allow.

**Verdict**: **Sufficient baseline for Phase 1, Phase 2, and the first attempt at Phase 4.** If Phase 4 fails geographically, this is the baseline against which Esri's marginal contribution should be measured.

### 5.2 ACS + PUMS / IPUMS / NHGIS

**Description**: Add IPUMS USA harmonized PUMS for cross-year individual-level demographic records, and NHGIS for boundary-consistent tract / block-group geography across decennial reboundaring (2010 / 2020).

**Pros**: Same free / reproducible posture as raw ACS but with cross-year consistency. PUMS at PUMA level (~100K population) supports proper raking / iterative-proportional-fitting at the individual level. NHGIS solves the tract-boundary-shift problem for Phase 2 cross-cycle analyses.

**Cons**: Slightly more data engineering than raw ACS. PUMA is coarser than block-group for fine geography (but better than tract for cross-year work).

**Verdict**: **Recommended addition for Phase 2 cross-year work and Phase 4 geography.** Same data lineage as ACS, no new vendor relationship, addresses real cross-cycle harmonization needs.

### 5.3 Esri Tapestry

**Description**: see § 2-4. Optional additive enrichment for Phase 4 only.

**Verdict**: **Defer.** Re-evaluate after Phase 4 produces a geographic residual map that ACS covariates fail to explain.

### 5.4 L2 / Catalist / TargetSmart / voter files

**Description**: Per-individual voter records with vote history, party registration (where collected), demographic appends, and contact data. ~210M-256M records depending on vendor.

**Pros**: Individual-level vote history, party registration, validated turnout. Useful for state-level Electoral-College-style projections that need subgroup turnout modeling per state.

**Cons**: Commercial licensing similar to Esri. Vote-history fields are dirty across years (people move, records get cleaned). Catalist is restricted to Democratic / progressive clients; i360 to Republican; L2 / TargetSmart / Aristotle are bipartisan but pricey.

**Verdict**: **Defer alongside Esri.** Voter files solve a different problem (individual-level turnout / contactability) than Esri (neighborhood psychographic enrichment). Neither is needed for Phase 1 / Phase 2. If Phase 4 expands to per-state Electoral College forecasting with subgroup turnout modeling, voter files become more valuable than Esri at that point — but that's a separate decision.

### 5.5 Comparison table

| Dimension | ACS only | ACS + PUMS/IPUMS/NHGIS | Esri Tapestry | Voter files |
|---|---|---|---|---|
| Cost | free | free | quote / plan / credits — verify with Esri before procurement | quote / commercial — verify with vendor |
| Reproducibility | high | high | low (license-gated) | low (license-gated) |
| Phase 1 sufficient | yes | yes | overkill | overkill |
| Phase 2 cross-year | acceptable | best | mismatched pre-2020 | acceptable post-2008 |
| Phase 4 geography baseline | yes | best | optional add-on | for state-level only |
| Adds non-demographic variance | no | no | consumer / lifestyle | individual vote history |
| Vintage stability | excellent | excellent | poor (2024→2025 discontinuity) | mixed |
| Political attitude content | none | none | none | partial (party reg, vote hx) |
| Risk of double-counting | n/a | n/a | yes (ACS-derived) | partial (modeled fields) |

---

## 6. Recommendation

**Defer Esri Tapestry purchase.** Specifically:

1. **Phase 1 (2020 single-year MVP)**: ACS 5-year (2016-2020 vintage) for poststratification cells. Census API access via `tidycensus` or `cenpy`. Free, reproducible, sufficient.

2. **Phase 2 (2008-2024 modern-era backtest)**: ACS 5-year per cycle plus IPUMS PUMS for cross-year harmonization plus NHGIS for boundary-consistent tract geography. Still free and reproducible.

3. **Phase 4 (geography projection — first pass)**: Same ACS + PUMS/IPUMS/NHGIS stack, plus county-level vote returns for validation. Attempt state / county MRP using ACS-derived covariates only.

4. **Phase 4 (geography projection — Esri re-evaluation)**: Only if § 7 revisit criteria are met after the ACS-only Phase 4 attempt.

5. **Voter files**: Same defer / revisit posture. If Phase 4 expands to per-state Electoral College forecasting with explicit subgroup turnout modeling, re-evaluate voter files separately from Esri.

This recommendation costs the project nothing in the near term, preserves reproducibility, and avoids both the 2024→2025 vocabulary discontinuity and the pre-2020 vintage mismatch that would degrade Esri value for the bulk of the backtest window.

---

## 7. Revisit criteria

Re-evaluate Esri Tapestry acquisition only when **all four** of the following hold:

1. **National backtest passes** at the agreed accuracy bar (per the success metrics defined in `00-PLAN.md` — currently weighted popular vote within ±3-5pp and correct major-party ordering for the modern era).

2. **State / county projection fails in geographically patterned ways** — i.e., residuals cluster geographically (suburban ring around major metros, exurban Sun Belt, Appalachian counties, etc.) rather than scattering randomly. Random-residual error is *not* a Tapestry-addressable problem; geographically-clustered error potentially is.

3. **ACS covariates are demonstrably insufficient** — the residual pattern survives a proper MRP fit using ACS demographic cells (race × age × education × income × density) at tract / block-group resolution. This means actually *running* the MRP with ACS covariates and inspecting the geographic residual map; not assuming Esri is needed before checking.

4. **Licensing terms allow reproducible internal artifacts** — the Esri license at the project's tier permits storing derived segment-by-geography lookups internally for reproducibility of past analyses. If license-encumbered derivations cannot be persisted, the reproducibility cost is too high regardless of the model gain.

If 1-3 hold but 4 fails: consider open-data alternatives (county-level census of agriculture for rural cells, urban-rural classification schemes from USDA, NCHS density tiers, public Pew typology data) before paid commercial enrichment.

If only 1 + 2 hold but 3 hasn't been tested: do not acquire. Test ACS-only MRP first.

If 2 holds but 1 doesn't: the geographic residuals are not the bottleneck — focus on national-backtest blockers (mapper coverage, candidate signatures, vote formula).

---

## 8. References (official Esri pages for verification)

- ArcGIS Business Analyst purchasing — https://www.esri.com/en-us/arcgis/products/arcgis-business-analyst/buy
- Esri Tapestry Segmentation deprecation knowledge-base entry — https://support.esri.com/en-us/knowledge-base/esri-tapestry-segmentation-data-000039874
- Migration from Esri Tapestry Segmentation to ArcGIS Tapestry (via ArcGIS Business Analyst) — https://www.esri.com/arcgis-blog/products/bus-analyst/announcements/migrate-from-esri-tapestry-segmentation-to-arcgis-tapestry-using-arcgis-business-analyst

These are pointers for verifying current pricing, deprecation timelines, and segment vocabulary at the time of any future re-evaluation. Pricing on the buy page is dynamic / quote-based; do not treat any number cited in this memo as authoritative.

---

## 9. Files in this memo

- `esri-license-decision-v0.md` (this file)
- `esri-license-decision-v0.json` — machine-readable mirror

No engine code, mapper specs, candidate data, era-context data, EIG files, or browser/dist/output/live-data files modified. No commits made.
