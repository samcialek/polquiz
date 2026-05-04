/**
 * Survey-to-PRISM mapper v0 (Phase 2.6).
 *
 * Turns a `WeightedSurveyRespondent` (from cesBacktestLoader) into a
 * `SurveyPrismSignature` per the spec at
 * `results/electorate/mapping/survey-to-prism-v0.{md,json}`.
 *
 * v0 is deterministic, transparent, and conservative:
 *   - Uses direct CCES standard columns when present (pid7, ideo5,
 *     pew_churatd, pew_bornagain, newsint, union, faminc, demographics).
 *   - Falls back to uniform priors with `uncertainty: "high"` everywhere
 *     a real signal is unavailable (most ideological nodes in v0).
 *   - Records per-node provenance (`real_signal` vs `fallback`) so the
 *     smoke can compute coverage by year.
 *
 * Strict prohibitions enforced in code:
 *   - `voteChoiceObserved` is NEVER read by the mapper. The mapper has
 *     access to the field only because the typed input carries it; it
 *     is treated as forbidden for ideological / engagement / boundary
 *     inputs. The smoke asserts this with a contractual check.
 *   - `pid7` is used ONLY for `moralBoundaries.political_camp` salience
 *     and is FLAGGED in the per-node provenance as a party-ID-derived
 *     signal so any downstream analysis can exclude political_camp from
 *     vote prediction if it wants to avoid circularity.
 *   - `ideo5` likewise only contributes to `moralBoundaries.ideological`
 *     salience. It does NOT inform MAT/CD/CU/MOR positions in v0 —
 *     those collapse to uniform priors (the modern CCES per-year file
 *     does not carry issue-attitude items in the standard column set
 *     audited for v0).
 *
 * What this mapper is NOT:
 *   - Not a candidate scorer. The mapper output is consumed by a
 *     downstream backtest scorer (Phase 2.7+); the mapper itself
 *     never compares respondent → candidate.
 *   - Not an ANES mapper. ANES coverage in the spec is documented for
 *     future sources but the loader currently only ships CCES/CES.
 *   - Not an issue-attitude decoder. Year-specific items like
 *     CC16_337_* (MAT) or CC16_331_* (CU) require per-year column
 *     resolvers and are deliberately deferred to v1.
 */

import type { WeightedSurveyRespondent } from "./surveyBacktestTypes.js";

// ─── Output shapes ─────────────────────────────────────────────────────────

/** 5-bin position posterior over the 1..5 PRISM scale. Sums to 1. */
export type PosDist5 = readonly [number, number, number, number, number];
/** 4-bin salience posterior over salience buckets 0..3. Sums to 1. */
export type SalDist4 = readonly [number, number, number, number];
/** 6-bin categorical posterior (EPS or AES). Sums to 1. */
export type CatDist6 = readonly [number, number, number, number, number, number];

export type Uncertainty = "low" | "medium" | "high";

/** Provenance for a single mapped target. */
export interface NodeProvenance {
  /** "real_signal" iff at least one real survey column contributed; otherwise "fallback". */
  source: "real_signal" | "fallback";
  /** Raw column names actually consumed for this node (empty when fallback). */
  vars: string[];
  /** True iff any input was party-ID-derived (only for political_camp in v0). */
  partyIdDerived: boolean;
  uncertainty: Uncertainty;
  notes?: string;
}

/** Continuous-node mapper output (MAT, CD, CU, MOR, PRO, COM, ZS, ONT_H, ONT_S). */
export interface ContinuousNodeSignature {
  posPosterior: PosDist5;
  salPosterior: SalDist4;
  provenance: NodeProvenance;
}

/** Categorical-node mapper output (EPS, AES). */
export interface CategoricalNodeSignature {
  catDistribution: CatDist6;
  salPosterior: SalDist4;
  provenance: NodeProvenance;
}

/** Per-boundary loading inside `moralBoundaries`. */
export interface MoralBoundaryEntry {
  /** Real-valued salience in [0, 3]. 0 = absent; 3 = highly active. */
  salience: number;
  provenance: NodeProvenance;
}

/** Compound moral-circle module per ADR-006. */
export interface MoralBoundariesSignature {
  national: MoralBoundaryEntry;
  ethnic_racial: MoralBoundaryEntry;
  religious: MoralBoundaryEntry;
  class: MoralBoundaryEntry;
  ideological: MoralBoundaryEntry;
  gender: MoralBoundaryEntry;
  political_camp: MoralBoundaryEntry;
  /** Aggregate intensity scalar 0..3 derived from the seven boundaries. */
  intensity: number;
  intensityProvenance: NodeProvenance;
}

/** Full per-respondent mapper output. */
export interface SurveyPrismSignature {
  respondentId: string;
  year: number;
  /** Survey weight passed through from the loader. */
  weight: number;
  /**
   * OBSERVED outcomes carried for downstream backtest evaluation only.
   * The mapper itself never reads these to fill any node.
   */
  voteChoiceObserved: WeightedSurveyRespondent["voteChoiceObserved"];
  turnoutObserved: WeightedSurveyRespondent["turnoutObserved"];
  /** Continuous PRISM nodes. */
  MAT: ContinuousNodeSignature;
  CD: ContinuousNodeSignature;
  CU: ContinuousNodeSignature;
  MOR: ContinuousNodeSignature;
  PRO: ContinuousNodeSignature;
  COM: ContinuousNodeSignature;
  ZS: ContinuousNodeSignature;
  ONT_H: ContinuousNodeSignature;
  ONT_S: ContinuousNodeSignature;
  /** Categorical PRISM nodes. */
  EPS: CategoricalNodeSignature;
  AES: CategoricalNodeSignature;
  /** Engagement scalar 0..10 — separate 1D continuous variable per ADR canon. */
  engagement: { value: number; provenance: NodeProvenance };
  /** Compound moral-circle module. */
  moralBoundaries: MoralBoundariesSignature;
  /** Coverage summary: count of `real_signal` vs `fallback` across all targets. */
  coverage: { realSignalCount: number; fallbackCount: number; totalTargets: number };
}

// ─── Distribution helpers ──────────────────────────────────────────────────

const UNIFORM_POS5: PosDist5 = [0.2, 0.2, 0.2, 0.2, 0.2];
const SAL_LOW: SalDist4 = [0.65, 0.25, 0.08, 0.02];      // E ≈ 0.47
const SAL_LOW_MED: SalDist4 = [0.30, 0.45, 0.20, 0.05];  // E ≈ 1.0
const SAL_MED: SalDist4 = [0.20, 0.30, 0.30, 0.20];      // E ≈ 1.5
const SAL_MED_HIGH: SalDist4 = [0.10, 0.25, 0.35, 0.30]; // E ≈ 1.85
const SAL_HIGH: SalDist4 = [0.05, 0.20, 0.40, 0.35];     // E ≈ 2.05
const SAL_VERY_HIGH: SalDist4 = [0.02, 0.10, 0.30, 0.58];// E ≈ 2.44
const EPS_FALLBACK: CatDist6 = [0.20, 0.30, 0.10, 0.15, 0.15, 0.10];
const AES_UNIFORM: CatDist6 = [1/6, 1/6, 1/6, 1/6, 1/6, 1/6];

/** Map a real salience score in [0, 3] to a peaked SalDist4. */
function salienceToDist(score: number): SalDist4 {
  const s = Math.max(0, Math.min(3, score));
  if (s < 0.5) return SAL_LOW;
  if (s < 1.2) return SAL_LOW_MED;
  if (s < 1.8) return SAL_MED;
  if (s < 2.3) return SAL_MED_HIGH;
  if (s < 2.7) return SAL_HIGH;
  return SAL_VERY_HIGH;
}

/** Expected value of a SalDist4 (returns scalar 0..3). */
function expectedSalience(d: SalDist4): number {
  return d[0] * 0 + d[1] * 1 + d[2] * 2 + d[3] * 3;
}

/** Validate a finite, non-NaN, non-empty CCES coded value as a number; else null. */
function parseCodedNumber(raw: string | undefined): number | null {
  if (raw === undefined) return null;
  const s = raw.trim();
  if (s === "" || s === "NA" || s === "__NA__") return null;
  const n = Number(s);
  if (!Number.isFinite(n)) return null;
  return n;
}

// ─── Per-target derivation ─────────────────────────────────────────────────

/** Continuous fallback output (uniform pos + medium-low sal). */
function fallbackContinuous(notes?: string): ContinuousNodeSignature {
  return {
    posPosterior: UNIFORM_POS5,
    salPosterior: SAL_LOW_MED,
    provenance: { source: "fallback", vars: [], partyIdDerived: false, uncertainty: "high", notes },
  };
}

/**
 * Build a 5-bin position posterior peaked at `mean` (continuous in [1, 5])
 * with discrete-Gaussian shape and width `sigma` (in position units). Used
 * by the v0.1A+ issue-item decoders to translate a derived position
 * estimate into the canonical PosDist5 shape.
 */
function positionPosteriorFromMean(mean: number, sigma: number): PosDist5 {
  const w: number[] = [];
  for (let i = 1; i <= 5; i++) {
    const d = i - mean;
    w.push(Math.exp(-(d * d) / (2 * sigma * sigma)));
  }
  let s = 0;
  for (const v of w) s += v;
  return [w[0]! / s, w[1]! / s, w[2]! / s, w[3]! / s, w[4]! / s];
}

/** Boundary fallback (salience 1.0, high uncertainty per spec). */
function fallbackBoundary(notes?: string): MoralBoundaryEntry {
  return {
    salience: 1.0,
    provenance: { source: "fallback", vars: [], partyIdDerived: false, uncertainty: "high", notes },
  };
}

/**
 * Per-year items list for the CD (cultural direction) composite.
 * Polarity convention: each item declares whether `Support` (raw=1)
 * indicates progressive (`-1`) or traditionalist (`+1`) on CD. `Oppose`
 * (raw=2) inverts. 8 / 9 / "." / "" / "NA" are dropped.
 *
 * 2016 / 2020 items (Pass-1 audit, verified from
 * `data/cces2016/hcbk0006.htm` and `data/cces2020/CES20_Common_pre_qx.pdf`
 * — items a–f have byte-identical wording across both cycles):
 *   - 332a "Always allow abortion as a matter of choice" → progressive
 *   - 332b "Permit only in case of rape/incest/life"      → traditionalist
 *     (held for v0.2 elsewhere because of asymmetric ambiguity on Oppose;
 *     v0.1A still ships it for parity with the prior six-item composite)
 *   - 332c "Prohibit after 20th week"                     → traditionalist
 *   - 332d "Allow employers to decline coverage"          → traditionalist
 *   - 332e "Prohibit federal funding for abortion"        → traditionalist
 *   - 332f "Make abortions illegal in all circumstances"  → traditionalist
 *
 * **2020-only column `CC20_332g`** ("Prohibit states from requiring
 * abortions only at hospitals") has no 2016 counterpart and a more nuanced
 * polarity (anti-restriction = pro-availability). v0.1A excludes 332g to
 * keep the polarity table identical across both 2016 / 2020 cycles.
 *
 * 2024 items (Pass-2 + Pass-3 hold-items audit; battery is THINNER than
 * 2016/2020): the abortion-battery `CC24_324` covers only items a/b/c/d
 * (no Hyde / employer-conscience / 20-week / state-hospital items). v0.1H
 * ships the 3 ship-ready abortion items + 2 CD-breadth items from
 * `CC24_340grid`:
 *   - 324a "Always allow abortion as a matter of choice"  → progressive (1.0×)
 *   - 324b held for v0.2 (same Pass-1 ambiguity as 332b)
 *   - 324c "Make abortions illegal in all circumstances"  → traditionalist (1.0×)
 *   - 324d "Expand access to abortion..."                  → progressive (1.0×; NEW item not in earlier cycles)
 *   - 340a "Prohibit gov't restrictions on contraceptives" → progressive (1.0×; CD breadth)
 *   - 340b held — duplicates 324a/d (would over-weight the abortion axis)
 *   - 340c "Federal recognition of same-sex + interracial marriages" → progressive (1.0×; CD breadth)
 *
 * Universal coding (all four `CC24_*grid` batteries): `1` = Support, `2` =
 * Oppose, `8` = Skipped, `9` = Not Asked, `.` = missing.
 */
type CdItem = { col: string; supportIs: "progressive" | "traditionalist"; weight: number };

function cdItemsForYear(year: number): CdItem[] | null {
  if (year === 2016 || year === 2020) {
    const y2 = String(year).slice(-2);
    return [
      { col: `CC${y2}_332a`, supportIs: "progressive",   weight: 1.0 },
      { col: `CC${y2}_332b`, supportIs: "traditionalist", weight: 1.0 },
      { col: `CC${y2}_332c`, supportIs: "traditionalist", weight: 1.0 },
      { col: `CC${y2}_332d`, supportIs: "traditionalist", weight: 1.0 },
      { col: `CC${y2}_332e`, supportIs: "traditionalist", weight: 1.0 },
      { col: `CC${y2}_332f`, supportIs: "traditionalist", weight: 1.0 },
    ];
  }
  if (year === 2024) {
    return [
      { col: "CC24_324a", supportIs: "progressive",    weight: 1.0 },
      // CC24_324b held for v0.2 — same asymmetric-ambiguity hold as CC16/CC20_332b
      { col: "CC24_324c", supportIs: "traditionalist", weight: 1.0 },
      { col: "CC24_324d", supportIs: "progressive",    weight: 1.0 },
      // CC24_340a contraceptives → CD low (progressive)
      { col: "CC24_340a", supportIs: "progressive",    weight: 1.0 },
      // CC24_340b held — duplicates the abortion axis (CC24_324a/d), would over-weight
      // CC24_340c federal recognition of same-sex + interracial marriages → CD low
      { col: "CC24_340c", supportIs: "progressive",    weight: 1.0 },
    ];
  }
  return null;
}

/**
 * CD (cultural direction) — real-signal core-position target shipped in
 * mapper v0.1A (2016 + 2020) and extended in v0.1H (2024).
 *
 * Coding (CCES universal, all cycles): `1` = Support, `2` = Oppose,
 * `8` = Skipped, `9` = Not Asked, `.` = missing. Skipped / NotAsked /
 * missing are dropped from the running tally.
 *
 * Algorithm: weighted sum of signed direction votes (+1 = traditionalist,
 * −1 = progressive; per `cdItemsForYear`) divided by answered total weight
 * gives `net ∈ [−1, +1]`. Position = `3 + 2 × net` (progressive net=−1 →
 * CD 1; traditionalist net=+1 → CD 5). Posterior is a discrete-Gaussian
 * over {1..5} with σ inverse to total weight collected.
 *
 * Salience: intensity (|net|) + small bonus for answer breadth. Uncertainty
 * gates on total weight (≥ 4 → low; ≥ 2 → medium; otherwise high). With
 * weight 1.0 per item across all wired cycles, this preserves the
 * original v0.1A 2016/2020 thresholds (≥ 4 items → low; ≥ 2 → medium; 1 → high)
 * exactly. 2024's 5-item composite (max totalWeight = 5.0) can earn `low`
 * with all items answered.
 *
 * Forbidden inputs: no `voteChoiceObserved`, no candidate thermometers,
 * no `pid7`, no turnout fields. Only the year's `CC*_332*` /
 * `CC24_324{a,c,d}` / `CC24_340{a,c}` columns are read.
 */
function deriveCD(r: WeightedSurveyRespondent): ContinuousNodeSignature {
  const items = cdItemsForYear(r.year);
  if (!items) {
    return fallbackContinuous(`v0.1A/H CD: cultural-direction decoder gated to 2016/2020/2024 (codebook-verified); year ${r.year} deferred`);
  }

  let weightedDirectionSum = 0;
  let totalWeight = 0;
  let answered = 0;
  const usedVars: string[] = [];
  for (const it of items) {
    const raw = parseCodedNumber(r.rawVarPayload[it.col]);
    if (raw === null) continue;
    let sign = 0;
    if (raw === 1) sign = it.supportIs === "progressive" ? -1 : 1;
    else if (raw === 2) sign = it.supportIs === "progressive" ? 1 : -1;
    else continue; // 8 / 9 / "." / "" / "NA"
    weightedDirectionSum += sign * it.weight;
    totalWeight += it.weight;
    answered++;
    usedVars.push(it.col);
  }

  if (totalWeight === 0) {
    return fallbackContinuous(`v0.1A/H CD: respondent answered 0/${items.length} CD-battery items`);
  }

  // Net score in [-1, +1]: − = progressive, + = traditionalist.
  const net = weightedDirectionSum / totalWeight;
  const pos = 3 + 2 * net;
  // Width inverse to total weight: 1 item → ~1.25, 5–6 items → ~0.6.
  const sigma = Math.max(0.6, 1.4 - 0.15 * totalWeight);
  const posPosterior = positionPosteriorFromMean(pos, sigma);

  const intensity = Math.abs(net); // 0..1
  const salScore = Math.min(3, 0.5 + intensity * 1.5 + (answered - 1) * 0.1);
  const salPosterior = salienceToDist(salScore);

  const uncertainty: Uncertainty = totalWeight >= 4.0 ? "low" : totalWeight >= 2.0 ? "medium" : "high";

  return {
    posPosterior,
    salPosterior,
    provenance: {
      source: "real_signal",
      vars: usedVars,
      partyIdDerived: false,
      uncertainty,
      notes: `v0.1A/H CD (${r.year}): ${answered}/${items.length} CD-battery items, totalWeight=${totalWeight.toFixed(1)} (− progressive, + traditionalist); net=${net.toFixed(2)} → pos=${pos.toFixed(2)}, salience=${salScore.toFixed(2)}`,
    },
  };
}

/**
 * Per-year polarity table for the economic battery. Polarity convention:
 *   +1 = "rank-first / Favor / Support maps to MAT high (free-market)"
 *   −1 = "rank-first / Favor / Support maps to MAT low (redistributionist)"
 *
 * 2016 items (Pass-1 audit): CC16_337_{2,3} are 3-way ranking items; rank=1
 * = "ranked first / most preferred", rank=2 = "middle", rank=3 = "ranked
 * third / least preferred". CC16_351{I,K} are For/Against binaries.
 *
 * 2020 items (Pass-2 audit §6): CC20_350b + CC20_351{a,b} are all binary
 * Favor/Support vs Oppose/Against. The 2020 economic battery is structurally
 * weaker than 2016 — there is **no 2020 ACA-repeal direct question** and
 * no 2020 equivalent of CC16_337's budget-priority ranking. Total weight
 * across all 3 items is 1.8, which sits below the `low`-uncertainty
 * threshold of 2.0 — so even a respondent who answers all three lands at
 * `medium` confidence by construction, matching the audit's recommendation
 * to "treat MAT/position as **medium** confidence (vs `high` for 2016)".
 *
 * **Explicit exclusions (2020)**:
 *   - CC20_415c, CC20_415d are STATE LEGISLATURE vote-choice questions —
 *     not tax policy; cannot use for MAT (vote-prediction circularity).
 *   - CC20_416a..c are HOUSE RACE vote-choice questions — same reason.
 *   - CC20_350c (Kavanaugh), CC20_350f/g (impeachment) are partisan-camp
 *     signals; NOT safe MAT/CD signals (audit: ❌ Hold).
 */
type EconomicItem =
  | { col: string; kind: "rank";   polarity: 1 | -1; weight: number }
  | { col: string; kind: "binary"; polarity: 1 | -1; weight: number };

function economicItemsForYear(year: number): EconomicItem[] | null {
  if (year === 2016) {
    return [
      // CC16_337_2 "Cut Domestic Spending" — rank-first = MAT high (free-market)
      { col: "CC16_337_2", kind: "rank",   polarity:  1, weight: 0.5 },
      // CC16_337_3 "Raise Taxes" — rank-first = MAT low (redistributionist)
      { col: "CC16_337_3", kind: "rank",   polarity: -1, weight: 1.0 },
      // CC16_351I "Repeal Affordable Care Act" — For = MAT high
      { col: "CC16_351I",  kind: "binary", polarity:  1, weight: 1.0 },
      // CC16_351K "Raise the federal minimum wage to $10.10" — For = MAT low
      { col: "CC16_351K",  kind: "binary", polarity: -1, weight: 1.0 },
    ];
  }
  if (year === 2020) {
    return [
      // CC20_350b "Raise the minimum wage to $15 an hour" — Favor = MAT low
      // (2020 ↔ CC16_351K equivalent with $15 update; audit: ✅ Ship, High confidence)
      { col: "CC20_350b", kind: "binary", polarity: -1, weight: 1.0 },
      // CC20_351b "HEROES Act $3T incl. $1T state-and-local" — Support = MAT low
      // (audit: ⚠ Reduced; Medium-confidence — more partisan than CARES, but still cross-loaded
      // with COVID emergency framing)
      { col: "CC20_351b", kind: "binary", polarity: -1, weight: 0.5 },
      // CC20_351a "CARES Act $2T emergency relief" — Support = MAT low
      // (audit: ⚠ Heavy reduction; Medium-Low — broadly popular emergency relief, weak MAT
      // discriminator on its own)
      { col: "CC20_351a", kind: "binary", polarity: -1, weight: 0.3 },
    ];
  }
  if (year === 2024) {
    return [
      // CC24_328d "Repeal the Affordable Care Act" — Support = MAT high
      // (2024 ↔ CC16_351I direct equivalent; audit: ✅ Ship, High confidence)
      { col: "CC24_328d", kind: "binary", polarity:  1, weight: 1.0 },
      // CC24_328e "Expand Medicaid (<$25K individuals / <$40K families)" — Support = MAT low
      // (audit: ✅ Ship — cleanest 2024 redistribution signal)
      { col: "CC24_328e", kind: "binary", polarity: -1, weight: 1.0 },
      // CC24_328c "Medicaid work requirement (able-bodied <64, no dependents)" — Support = MAT high
      // (audit: ✅ Ship — clean welfare-restriction framing → free-market lean)
      { col: "CC24_328c", kind: "binary", polarity:  1, weight: 1.0 },
      // CC24_323f "Forgive up to $20,000 of student loan debt" — Support = MAT low
      // (Pass-3 hold-items audit §1 resolved: column name carries inherited
      // `_323f` suffix from upstream survey-design re-use, but the docx
      // layout proves it sits in the CC24_328 Tax-policies grid between
      // _328e and _330a. Routed to MAT here, NEVER to the immigration
      // composite. Weight 0.7× per audit's medium-high confidence rating
      // — heavily partisan since 2022, with some MAT-low respondents
      // opposing for fairness/precedent reasons rather than free-market
      // reasons.)
      { col: "CC24_323f", kind: "binary", polarity: -1, weight: 0.7 },
      // CC24_328b "Tax incentives for low-income housing developers" — Support = MAT low
      // (audit: ⚠ Reduced — housing-affordability framing crosses over
      // into supply-side / market-mechanism territory)
      { col: "CC24_328b", kind: "binary", polarity: -1, weight: 0.5 },
      // CC24_328a "Relax local zoning laws" is EXPLICITLY EXCLUDED — audit: ❌ Hold
      // (asymmetric direction: YIMBY progressives + free-market conservatives
      // both Support; signed direction ambiguous)
    ];
  }
  return null;
}

/**
 * MAT (material orientation) — real-signal core position target shipped
 * across 2016 (v0.1C), 2020 (v0.1E), and 2024 (v0.1G).
 *
 * Coding:
 *   - 337 ranks (2016): `1` = Ranked first (most preferred), `2` = Ranked
 *     second (middle), `3` = Ranked third (least preferred). `8` skipped,
 *     `9` not asked, `.` missing.
 *   - 351 binary (2016 / 2020): `1` = For / Favor / Support, `2` =
 *     Against / Oppose. Same skip codes.
 *   - 350 binary (2020 grid): `1` = Favor, `2` = Oppose. Same skip codes.
 *   - 328 binary (2024 grid): `1` = Support, `2` = Oppose. Same skip codes.
 *   - **`CC24_323f`** (binary, 2024 only) carries an inherited
 *     `_323f` column-name suffix from upstream survey-design re-use, but
 *     the Pass-3 docx-extraction audit confirmed it sits inside the
 *     `CC24_328grid` (Tax policies) battery as the student-loan-
 *     forgiveness item. Same coding as 328 binaries; routed to MAT here
 *     and NEVER to the immigration composite.
 *
 * Algorithm: each item produces a signal ∈ {−1, 0, +1} (rank 2 produces 0
 * — neutral middle), multiplied by item polarity. The weighted sum /
 * weighted total gives `net ∈ [−1, +1]` where + = free-market and
 * − = redistributionist. Position = 3 + 2 × net. Posterior is a discrete-
 * Gaussian over {1..5} with σ inverse to total weight collected.
 *
 * Uncertainty: ≥ 2.0 → low, ≥ 1.0 → medium, < 1.0 → high. Per-cycle
 * implications:
 *   - 2016 max weight = 3.5 → can earn `low`.
 *   - 2020 max weight = 1.8 → capped at `medium` by construction, matching
 *     the audit's explicit "medium confidence (vs `high` for 2016)".
 *   - 2024 max weight = 4.2 → can earn `low`; the audit notes 2024 MAT is
 *     "comparable to 2016 (3 high-confidence items per cycle)" with extra
 *     reduced-weight items pushing total weight even higher.
 *
 * **Runtime sanity check (audit §9 recommendation)**: this v0.1 mapper
 * does NOT auto-flip CC16_351K direction at runtime even if the For-share
 * looks anomalous — it relies on the codebook-verified wording. A future
 * For-share audit can flag the column upstream rather than silently
 * inverting downstream.
 *
 * Forbidden inputs: no `voteChoiceObserved`, no candidate thermometers,
 * no `pid7`, no turnout fields. Only the year's `CC16_337_*` /
 * `CC16_351{I,K}` / `CC20_350b` / `CC20_351{a,b}` / `CC24_328{c,d,e,b}` /
 * `CC24_323f` columns are read.
 *
 * **`CC24_328a` (zoning) is explicitly excluded** per audit §8 — direction
 * ambiguous: YIMBY progressives + free-market conservatives both Support.
 */
function deriveMAT(r: WeightedSurveyRespondent): ContinuousNodeSignature {
  const items = economicItemsForYear(r.year);
  if (!items) {
    return fallbackContinuous(`v0.1C/E/G MAT: economic-battery decoder gated to 2016/2020/2024 (audited); year ${r.year} deferred`);
  }

  let weightedDirectionSum = 0;
  let totalWeight = 0;
  let answered = 0;
  const usedVars: string[] = [];
  for (const it of items) {
    const raw = parseCodedNumber(r.rawVarPayload[it.col]);
    if (raw === null) continue;
    let signal = 0;
    if (it.kind === "rank") {
      if (raw === 1) signal = 1;
      else if (raw === 2) signal = 0;
      else if (raw === 3) signal = -1;
      else continue; // 8, 9, etc. → drop
    } else {
      if (raw === 1) signal = 1;       // For / Favor / Support
      else if (raw === 2) signal = -1; // Against / Oppose
      else continue;
    }
    weightedDirectionSum += it.polarity * signal * it.weight;
    totalWeight += it.weight;
    answered++;
    usedVars.push(it.col);
  }

  if (totalWeight === 0) {
    return fallbackContinuous(`v0.1C/E/G MAT: respondent answered 0/${items.length} economic-battery items`);
  }

  const net = weightedDirectionSum / totalWeight; // [-1, +1] (- = redistributionist, + = free-market)
  const pos = 3 + 2 * net;                         // MAT high (5) = free-market; MAT low (1) = redistributionist
  const sigma = Math.max(0.6, 1.4 - 0.25 * totalWeight); // narrows with more data

  const intensity = Math.abs(net); // 0..1
  const salScore = Math.min(3, 0.5 + intensity * 1.5 + (answered - 1) * 0.1);
  const salPosterior = salienceToDist(salScore);

  const uncertainty: Uncertainty = totalWeight >= 2.0 ? "low" : totalWeight >= 1.0 ? "medium" : "high";

  return {
    posPosterior: positionPosteriorFromMean(pos, sigma),
    salPosterior,
    provenance: {
      source: "real_signal",
      vars: usedVars,
      partyIdDerived: false,
      uncertainty,
      notes: `v0.1C/E/G MAT (${r.year}): ${answered}/${items.length} economic-battery items, totalWeight=${totalWeight.toFixed(1)} (− redistributionist, + free-market); net=${net.toFixed(2)} → pos=${pos.toFixed(2)}, salience=${salScore.toFixed(2)}${r.year === 2020 ? "; uncertainty capped at medium by construction (max weight=1.8 < 2.0; audit §6: 2020 lacks ACA-repeal item)" : ""}`,
    },
  };
}

/**
 * Per-year polarity table for the immigration battery. Polarity convention:
 *   +1 = "Yes / Support is restrictionist (CU low; high national-boundary
 *        salience)"
 *   −1 = "Yes / Support is pluralist (CU high; low national-boundary
 *        salience)"
 * Each item carries the audit-recommended weight.
 *
 * 2016 items (Pass-1 audit): CC16_331_{1,2,5,8} — items _5 (Syria refugees)
 * and _8 (Muslim ban) are the cleanest national-circle items the battery
 * has, hence weight 1.0×. _1 / _2 ship reduced at 0.5×.
 *
 * 2020 items (Pass-2 audit, §5): CC20_331a..e — _a/_b mirror CC16_331_1/_2
 * verbatim and ship at 0.5×. _c (sanctuary cities), _d (reduce legal
 * immigration), _e (border-wall spending) are NEW in 2020. The two
 * cleanest 2016 items (_5, _8) were discontinued in 2020, so the strongest
 * 2020 items (_d, _e) ship at 0.7× — strictly weaker than the 1.0× ceiling
 * the audit reserves for the 2016 _5/_8 pair. The audit explicitly notes:
 * "v0.1 mapper should flag 2020 national-salience uncertainty as `medium`
 * rather than the `high` rating attainable for 2016."
 *
 * 2024 items (Pass-2 audit, §7; Pass-3 docx-extraction audit lifted the
 * CC24_323f hold and resolved it as a MAT/student-loan item, NOT an
 * immigration item): CC24_323{a,b,c,d}. The wall item (_c) replaces the
 * narrow-circle role the Syria/Muslim items played in 2016 and ships at
 * 1.0×. The Dreamers item (_d) is the cleanest pluralist item the
 * battery has had to date and also ships at 1.0×. Per the audit, "2024 is
 * structurally as strong as 2016 for CU".
 *
 * **`CC24_323f` is explicitly excluded from the immigration composite** —
 * the codebook variable name carries an inherited `_323f` suffix from
 * upstream survey-design re-use, but the docx layout proves it is the
 * student-loan-forgiveness row of the `CC24_328grid` (Tax policies)
 * battery. It is wired into the 2024 MAT composite, not CU.
 */
type ImmigrationItem = { col: string; polarity: 1 | -1; weight: number };

function immigrationItemsForCU(year: number): ImmigrationItem[] | null {
  if (year === 2016) {
    return [
      // CC16_331_1 "Grant legal status to long-term illegal immigrants" → Yes = pluralist
      { col: "CC16_331_1", polarity: -1, weight: 0.5 },
      // CC16_331_2 "Increase border patrols" → Yes = restrictionist
      { col: "CC16_331_2", polarity:  1, weight: 0.5 },
      // CC16_331_5 "Admit no refugees from Syria" → Yes = restrictionist (audit: cleanest item)
      { col: "CC16_331_5", polarity:  1, weight: 1.0 },
      // CC16_331_8 "Ban Muslims from immigrating" → Yes = restrictionist
      { col: "CC16_331_8", polarity:  1, weight: 1.0 },
    ];
  }
  if (year === 2020) {
    return [
      // CC20_331a "Grant legal status..." (verbatim CC16_331_1) → Support = pluralist
      { col: "CC20_331a", polarity: -1, weight: 0.5 },
      // CC20_331b "Increase border patrols" (verbatim CC16_331_2) → Support = restrictionist
      { col: "CC20_331b", polarity:  1, weight: 0.5 },
      // CC20_331c "Withhold federal funds from sanctuary-cities police" → Support = restrictionist
      { col: "CC20_331c", polarity:  1, weight: 0.5 },
      // CC20_331d "Reduce LEGAL immigration by 50% over the next [10 years]" → Support = restrictionist
      { col: "CC20_331d", polarity:  1, weight: 0.7 },
      // CC20_331e "Increase spending on border security by $25B incl. building a wall" → Support = restrictionist
      { col: "CC20_331e", polarity:  1, weight: 0.7 },
    ];
  }
  if (year === 2024) {
    return [
      // CC24_323a "Grant legal status..." (verbatim CC16_331_1 / CC20_331a) → Support = pluralist
      { col: "CC24_323a", polarity: -1, weight: 0.5 },
      // CC24_323b "Increase border patrols" (verbatim CC16_331_2 / CC20_331b) → Support = restrictionist
      { col: "CC24_323b", polarity:  1, weight: 0.5 },
      // CC24_323c "Build a wall between the U.S. and Mexico" → Support = restrictionist
      // (audit: cleanest 2024 national-salience signal — explicit wall framing)
      { col: "CC24_323c", polarity:  1, weight: 1.0 },
      // CC24_323d "Provide permanent resident status to children of immigrants...
      // (Dreamers; pathway to citizenship)" → Support = pluralist (mirrors CC20_350e)
      { col: "CC24_323d", polarity: -1, weight: 1.0 },
      // CC24_323f is explicitly EXCLUDED — see helper docstring above
      // (resolved as MAT/student-loan item by Pass-3 audit; lives in
      // the 2024 economic battery, not the immigration battery).
    ];
  }
  return null;
}

/**
 * Items used for `moralBoundaries.national` salience. Item 1 / 1a / 23a
 * (legal status / Dreamers) is **excluded across all cycles** per the
 * Pass-1 audit (pluralist responses are compatible with high or low
 * national-boundary salience independent of that item).
 *
 * 2016 ships items {2, 5, 8}; 2020 ships items {b, c, d, e}; 2024 ships
 * items {b, c} per the Pass-2 audit's national-salience composite (§5,
 * §7). 2024 has only 2 items, but the wall item (_c) is rated High
 * confidence and structurally replaces the role the Syria/Muslim items
 * played in 2016.
 */
function immigrationItemsForNational(year: number): ImmigrationItem[] | null {
  if (year === 2016) {
    return [
      { col: "CC16_331_2", polarity: 1, weight: 0.5 },
      { col: "CC16_331_5", polarity: 1, weight: 1.0 },
      { col: "CC16_331_8", polarity: 1, weight: 1.0 },
    ];
  }
  if (year === 2020) {
    return [
      { col: "CC20_331b", polarity: 1, weight: 0.5 },
      { col: "CC20_331c", polarity: 1, weight: 0.5 },
      { col: "CC20_331d", polarity: 1, weight: 0.7 },
      { col: "CC20_331e", polarity: 1, weight: 0.7 },
    ];
  }
  if (year === 2024) {
    return [
      { col: "CC24_323b", polarity: 1, weight: 0.5 },
      { col: "CC24_323c", polarity: 1, weight: 1.0 },
    ];
  }
  return null;
}

/**
 * CU (cultural uniformity / pluralism) — real-signal core position target
 * for 2016 (mapper v0.1B), 2020 (v0.1D), and 2024 (v0.1F).
 *
 * Coding (CCES standard, identical across cycles): `1` = Yes / Support,
 * `2` = No / Oppose, `8` = Skipped, `9` = Not Asked, `.` = missing.
 *
 * Algorithm: weighted sum of signed direction votes (+1 = restrictionist,
 * −1 = pluralist; per `immigrationItemsForCU`) divided by answered total
 * weight gives `net ∈ [−1, +1]`. Position = `3 − 2 × net` (pluralist net=−1
 * → CU 5; restrictionist net=+1 → CU 1). Posterior is a discrete-Gaussian
 * over {1..5} with σ inverse to total weight collected. Salience =
 * breadth-bonus + intensity. Uncertainty gates on total weight (≥ 1.5 →
 * low; ≥ 0.5 → medium; otherwise no signal, fallback).
 *
 * Forbidden inputs: no `voteChoiceObserved`, no candidate thermometers,
 * no `pid7`, no turnout fields. Only the year's CC*_331* / CC24_323*
 * columns are read.
 *
 * **`CC24_323f` is explicitly NOT consumed for CU** — Pass-3 audit
 * resolved the column as a MAT/student-loan item that was misnamed by
 * upstream survey-design re-use; it lives in the 2024 economic composite,
 * not the immigration composite.
 */
function deriveCU(r: WeightedSurveyRespondent): ContinuousNodeSignature {
  const items = immigrationItemsForCU(r.year);
  if (!items) {
    return fallbackContinuous(`v0.1B/D/F CU: immigration-battery decoder gated to 2016/2020/2024 (audited); year ${r.year} deferred`);
  }
  let signedSum = 0;
  let totalWeight = 0;
  let answered = 0;
  const usedVars: string[] = [];
  for (const it of items) {
    const raw = parseCodedNumber(r.rawVarPayload[it.col]);
    if (raw === 1) {
      signedSum += it.polarity * it.weight;
      totalWeight += it.weight;
      answered++;
      usedVars.push(it.col);
    } else if (raw === 2) {
      signedSum -= it.polarity * it.weight;
      totalWeight += it.weight;
      answered++;
      usedVars.push(it.col);
    }
  }
  if (totalWeight === 0) {
    return fallbackContinuous(`v0.1B/D/F CU: respondent answered 0/${items.length} immigration-battery items`);
  }
  const net = signedSum / totalWeight; // [-1, +1]
  const pos = 3 - 2 * net;              // pluralist (net=-1) → CU 5; restrictionist (net=+1) → CU 1
  const sigma = Math.max(0.6, 1.4 - 0.3 * totalWeight); // 1.25 at weight=0.5; ~0.6 at weight=2.5+

  const intensity = Math.abs(net); // 0..1
  const salScore = Math.min(3, 0.5 + intensity * 1.5 + (answered - 1) * 0.1);
  const salPosterior = salienceToDist(salScore);

  const uncertainty: Uncertainty = totalWeight >= 1.5 ? "low" : totalWeight >= 0.5 ? "medium" : "high";

  return {
    posPosterior: positionPosteriorFromMean(pos, sigma),
    salPosterior,
    provenance: {
      source: "real_signal",
      vars: usedVars,
      partyIdDerived: false,
      uncertainty,
      notes: `v0.1B/D/F CU (${r.year}): ${answered}/${items.length} immigration-battery items, totalWeight=${totalWeight.toFixed(1)} (− pluralist, + restrictionist); net=${net.toFixed(2)} → pos=${pos.toFixed(2)}, salience=${salScore.toFixed(2)}`,
    },
  };
}

/**
 * Religious salience from CCES `pew_churatd` (church attendance: 1=more than
 * once a week, 2=once a week, 3=once or twice a month, 4=a few times a year,
 * 5=seldom, 6=never, 7=don't know) + `pew_bornagain` (1=yes, 2=no, 8/9=other).
 *
 * 8/9/skipped values are treated as missing for that variable; if neither
 * variable is usable, fall back to salience 1.0 with high uncertainty.
 */
function deriveReligiousBoundary(payload: Record<string, string>): MoralBoundaryEntry {
  const ch = parseCodedNumber(payload["pew_churatd"]);
  const ba = parseCodedNumber(payload["pew_bornagain"]);
  const usableCh = ch !== null && ch >= 1 && ch <= 6;
  const usableBa = ba === 1 || ba === 2;
  if (!usableCh && !usableBa) return fallbackBoundary("pew_churatd / pew_bornagain missing");
  // Map church attendance to salience component in [0, 2.5].
  let score = 0;
  let weight = 0;
  if (usableCh) {
    // 1 (weekly+) → 2.5; 2 (weekly) → 2.2; 3 (monthly) → 1.6; 4 (few/yr) → 1.0; 5 (seldom) → 0.5; 6 (never) → 0.2
    const churchScore = ch === 1 ? 2.5 : ch === 2 ? 2.2 : ch === 3 ? 1.6 : ch === 4 ? 1.0 : ch === 5 ? 0.5 : 0.2;
    score += churchScore;
    weight += 1;
  }
  if (usableBa) {
    // bornagain=1 (yes) → +0.6 boost; bornagain=2 (no) → −0.2 dampening
    score += ba === 1 ? 2.6 : 0.8;
    weight += 1;
  }
  const salience = Math.max(0, Math.min(3, weight > 0 ? score / weight : 1.0));
  const vars: string[] = [];
  if (usableCh) vars.push("pew_churatd");
  if (usableBa) vars.push("pew_bornagain");
  const uncertainty: Uncertainty = vars.length >= 2 ? "medium" : "high";
  return {
    salience,
    provenance: { source: "real_signal", vars, partyIdDerived: false, uncertainty },
  };
}

/**
 * Ideological salience from `ideo5` (1=very liberal … 5=very conservative,
 * 3=middle, 8=not sure, 9=skipped). Uses distance from center as the
 * salience proxy.
 *
 * IMPORTANT: ideo5 is NOT used to fill MAT/CD position in v0 — that would
 * require deliberate position calibration we have not validated. ideo5
 * here is purely a salience signal: respondents who self-place strongly
 * are by construction more ideologically engaged.
 */
function deriveIdeologicalBoundary(payload: Record<string, string>): MoralBoundaryEntry {
  const ideo = parseCodedNumber(payload["ideo5"]);
  if (ideo === null || ideo < 1 || ideo > 5) return fallbackBoundary("ideo5 missing or skipped");
  const strength = Math.abs(ideo - 3) / 2;       // 0..1
  const salience = 0.5 + strength * 2.0;          // 0.5..2.5
  return {
    salience,
    provenance: {
      source: "real_signal",
      vars: ["ideo5"],
      partyIdDerived: false,
      uncertainty: "medium",
      notes: "salience-only; does not inform position",
    },
  };
}

/**
 * Political-camp salience from `pid7` (1=strong D … 7=strong R, 4=independent,
 * 8=not sure, 9=skipped). Uses distance from center.
 *
 * FLAGGED `partyIdDerived: true` so downstream code can exclude this
 * boundary from vote-prediction inputs to avoid circularity.
 */
function derivePoliticalCampBoundary(payload: Record<string, string>): MoralBoundaryEntry {
  const pid = parseCodedNumber(payload["pid7"]);
  if (pid === null || pid < 1 || pid > 7) return fallbackBoundary("pid7 missing or skipped");
  const strength = Math.abs(pid - 4) / 3;         // 0..1
  const salience = 0.5 + strength * 2.0;          // 0.5..2.5
  return {
    salience,
    provenance: {
      source: "real_signal",
      vars: ["pid7"],
      partyIdDerived: true,
      uncertainty: "medium",
      notes: "party-ID derived; flagged for circularity exclusion in vote-prediction",
    },
  };
}

/**
 * `moralBoundaries.national` salience from the immigration battery —
 * shipped together with CU in mapper v0.1B (2016), v0.1D (2020), and
 * v0.1F (2024).
 *
 * Per the directionality audit, the immigration items load on the
 * national boundary asymmetrically: a "Yes / Support" answer to a
 * restrictionist item signals high engagement with the national-identity
 * frame; a "No / Oppose" signals the respondent is NOT gating policy
 * through that frame (universalist or other consideration). Per the
 * audit's national-salience composite (Pass 1 §4 / Pass 2 §5, §7), the
 * legal-status / Dreamers items are **excluded across all cycles** —
 * pluralist responses are compatible with high or low national salience
 * independently of those items.
 *
 * Items per cycle (see `immigrationItemsForNational`):
 *   - 2016: CC16_331_{2, 5, 8} at weights 0.5 / 1.0 / 1.0.
 *   - 2020: CC20_331{b, c, d, e} at weights 0.5 / 0.5 / 0.7 / 0.7. The
 *     two cleanest 2016 narrow-circle items (Syria refugees, Muslim ban)
 *     were discontinued; the audit explicitly downgrades 2020 national
 *     salience uncertainty to **`medium`** as a ceiling — even with
 *     full data the structurally weaker items don't earn a `low`
 *     uncertainty rating. v0.1D enforces this cap.
 *   - 2024: CC24_323{b, c} at weights 0.5 / 1.0. The wall item (_c) is
 *     the cleanest 2024 narrow-circle signal and replaces the structural
 *     role the Syria/Muslim items played in 2016. With only 2 items,
 *     2024 reaches max total weight 1.5 — exactly the `low`-uncertainty
 *     threshold, so a respondent who answered both items earns `low`
 *     uncertainty. v0.1F uses the 2016 thresholds for 2024 (the audit
 *     does NOT downgrade 2024 national-salience confidence the way it
 *     does for 2020).
 *
 * Coding: 1=Yes/Support, 2=No/Oppose, 8=Skipped, 9=Not Asked, "."=missing.
 *
 * Algorithm: yes_share = (Σ weight where answer = Yes/Support) / (Σ weight
 * answered). Salience = 0.3 + 2.2 × yes_share (range [0.3, 2.5]). Cross-
 * loads on `religious` / `ethnic_racial` from CC16_331_5/8 are NOT applied
 * per the audit's "v0.2 normalize multi-boundary loads to avoid
 * double-counting" deferral.
 */
function deriveNationalBoundary(r: WeightedSurveyRespondent): MoralBoundaryEntry {
  const items = immigrationItemsForNational(r.year);
  if (!items) {
    return fallbackBoundary(`v0.1B/D/F national: immigration-battery decoder gated to 2016/2020/2024 (audited); year ${r.year} deferred`);
  }
  let yesWeight = 0;
  let totalWeight = 0;
  let answered = 0;
  const usedVars: string[] = [];
  for (const it of items) {
    const raw = parseCodedNumber(r.rawVarPayload[it.col]);
    if (raw === 1) {
      yesWeight += it.weight;
      totalWeight += it.weight;
      answered++;
      usedVars.push(it.col);
    } else if (raw === 2) {
      totalWeight += it.weight;
      answered++;
      usedVars.push(it.col);
    }
  }
  if (totalWeight === 0) {
    return fallbackBoundary(`v0.1B/D/F national: respondent answered 0/${items.length} immigration-battery items`);
  }
  const yesShare = yesWeight / totalWeight; // [0, 1]
  const salience = 0.3 + 2.2 * yesShare;     // [0.3, 2.5]

  // Uncertainty thresholds. 2016 / 2024 can earn `low` with the cleanest
  // items (Syria + Muslim ban for 2016; wall + border-patrol for 2024);
  // 2020 is capped at `medium` per the audit's explicit downgrade.
  let uncertainty: Uncertainty;
  if (r.year === 2020) {
    uncertainty = totalWeight >= 0.5 ? "medium" : "high";
  } else {
    // 2016 / 2024
    uncertainty = totalWeight >= 1.5 ? "low" : totalWeight >= 0.5 ? "medium" : "high";
  }
  return {
    salience,
    provenance: {
      source: "real_signal",
      vars: usedVars,
      partyIdDerived: false,
      uncertainty,
      notes: `v0.1B/D/F national (${r.year}): ${answered}/${items.length} items; yes_share=${yesShare.toFixed(2)} → salience=${salience.toFixed(2)}${r.year === 2020 ? "; uncertainty capped at medium (audit §5: 2020 lacks Syria/Muslim narrow-circle items)" : ""}; multi-boundary cross-loads deferred to v0.2 per audit`,
    },
  };
}

/**
 * Class salience from `union` (1=yes member or HH, 2=no, 8=skipped).
 * Light proxy — surfaces at most a mild class boundary; spec rates this
 * as "medium" coverage at best.
 */
function deriveClassBoundary(payload: Record<string, string>): MoralBoundaryEntry {
  const u = parseCodedNumber(payload["union"]);
  if (u !== 1 && u !== 2 && u !== 3) return fallbackBoundary("union missing or skipped");
  // 1 = yes, 2 = HH (at least one HH member), 3 = no
  const salience = u === 1 ? 1.7 : u === 2 ? 1.4 : 0.8;
  return {
    salience,
    provenance: {
      source: "real_signal",
      vars: ["union"],
      partyIdDerived: false,
      uncertainty: "high",
      notes: "single-item proxy; class identification largely implicit in US surveys",
    },
  };
}

/**
 * Engagement scalar 0..10 from validated turnout + self-report turnout +
 * `newsint` (1=most of time, 2=some of time, 3=now and then, 4=hardly,
 * 7=don't know, 8/9=skipped).
 *
 * Validated turnout dominates when present (turnoutValidated === true).
 * Self-reported turnout contributes a smaller bump. newsint provides the
 * always-on scalar component.
 */
function deriveEngagement(r: WeightedSurveyRespondent): { value: number; provenance: NodeProvenance } {
  const ni = parseCodedNumber(r.rawVarPayload["newsint"]);
  const usableNi = ni !== null && ni >= 1 && ni <= 4;
  const vars: string[] = [];
  let base = 5.0;
  let uncertainty: Uncertainty = "high";

  if (usableNi) {
    // 1→8.0, 2→6.5, 3→4.5, 4→2.5
    base = ni === 1 ? 8.0 : ni === 2 ? 6.5 : ni === 3 ? 4.5 : 2.5;
    vars.push("newsint");
    uncertainty = "medium";
  }
  if (r.turnoutValidated && r.turnoutObserved === true) {
    base += 1.5;
    vars.push("turnoutValidated");
    uncertainty = "low";
  } else if (r.turnoutValidated && r.turnoutObserved === false) {
    base -= 2.0;
    vars.push("turnoutValidated");
    uncertainty = "low";
  } else if (r.turnoutObserved === true) {
    base += 0.7;
    vars.push("turnoutObserved");
    if (uncertainty === "high") uncertainty = "medium";
  } else if (r.turnoutObserved === false) {
    base -= 1.2;
    vars.push("turnoutObserved");
    if (uncertainty === "high") uncertainty = "medium";
  }

  const value = Math.max(0, Math.min(10, base));
  return {
    value,
    provenance: vars.length === 0
      ? { source: "fallback", vars: [], partyIdDerived: false, uncertainty: "high", notes: "no newsint or turnout signal" }
      : { source: "real_signal", vars, partyIdDerived: false, uncertainty },
  };
}

/** Categorical fallback (uniform AES, broad EPS prior). */
function fallbackEPS(): CategoricalNodeSignature {
  return {
    catDistribution: EPS_FALLBACK,
    salPosterior: SAL_LOW_MED,
    provenance: {
      source: "fallback",
      vars: [],
      partyIdDerived: false,
      uncertainty: "high",
      notes: "v0 uses spec broad EPS prior; year-specific issue items deferred to v1",
    },
  };
}

function fallbackAES(): CategoricalNodeSignature {
  return {
    catDistribution: AES_UNIFORM,
    salPosterior: SAL_LOW,
    provenance: {
      source: "fallback",
      vars: [],
      partyIdDerived: false,
      uncertainty: "high",
      notes: "v0 outputs uniform AES — surveys do not directly probe aesthetic preference",
    },
  };
}

// ─── Mapper entry point ────────────────────────────────────────────────────

/**
 * Map one weighted survey respondent to a PRISM signature.
 *
 * Determinism: same input → same output (no randomness, no IO).
 * Forbidden inputs: voteChoiceObserved, candidate thermometers, party ID
 * (except as a flagged metadata signal for political_camp).
 */
export function mapSurveyToPrism(r: WeightedSurveyRespondent): SurveyPrismSignature {
  const payload = r.rawVarPayload;

  // Compound moral-circle module.
  const religious = deriveReligiousBoundary(payload);
  const ideological = deriveIdeologicalBoundary(payload);
  const political_camp = derivePoliticalCampBoundary(payload);
  const class_ = deriveClassBoundary(payload);
  const national = deriveNationalBoundary(r);
  const ethnic_racial = fallbackBoundary("v0: no per-year race-policy / thermometer items parsed");
  const gender = fallbackBoundary("v0: no per-year gender-policy / thermometer items parsed");

  // Intensity = max(per_boundary) * 0.6 + mean(per_boundary) * 0.4 (per spec).
  const sals = [
    religious.salience,
    ideological.salience,
    political_camp.salience,
    class_.salience,
    national.salience,
    ethnic_racial.salience,
    gender.salience,
  ];
  const maxS = Math.max(...sals);
  const meanS = sals.reduce((a, b) => a + b, 0) / sals.length;
  const intensity = Math.min(3, maxS * 0.6 + meanS * 0.4);
  // Intensity inherits the worst uncertainty among contributing boundaries.
  const allBoundaries = [religious, ideological, political_camp, class_, national, ethnic_racial, gender];
  const fallbackBoundaryCount = allBoundaries.filter(b => b.provenance.source === "fallback").length;
  const intensityUncertainty: Uncertainty = fallbackBoundaryCount >= 5 ? "high" : fallbackBoundaryCount >= 3 ? "medium" : "low";
  const intensityProvenance: NodeProvenance = {
    source: fallbackBoundaryCount >= 5 ? "fallback" : "real_signal",
    vars: ["__derived_from_boundaries__"],
    partyIdDerived: political_camp.provenance.partyIdDerived && fallbackBoundaryCount < 5,
    uncertainty: intensityUncertainty,
    notes: `${7 - fallbackBoundaryCount}/7 boundaries from real signal`,
  };

  // Engagement.
  const engagement = deriveEngagement(r);

  // Continuous nodes. CD ships in v0.1A as the first real-signal core
  // position decoder (CC{Y2}_332a-f abortion battery, year-gated to
  // 2016/2020). Other continuous nodes remain fallback pending per-cycle
  // codebook verification of their candidate batteries.
  const MAT   = deriveMAT(r);
  const CD    = deriveCD(r);
  const CU    = deriveCU(r);
  const MOR   = fallbackContinuous("v0: universal-moral-circle position from issue items deferred (refugees, foreign aid)");
  const PRO   = fallbackContinuous("v0: PRO low survey coverage; fallback per spec");
  const COM   = fallbackContinuous("v0: COM weakest-covered continuous node; fallback per spec");
  const ZS    = fallbackContinuous("v0: ZS from issue items deferred (trade, immigration takes jobs)");
  const ONT_H = fallbackContinuous("v0: ONT_H requires Feldman-Stenner battery (ANES-only); CCES has no signal");
  const ONT_S = fallbackContinuous("v0: ONT_S from trust-in-institutions battery deferred (V162310 etc.)");

  // Categorical nodes.
  const EPS = fallbackEPS();
  const AES = fallbackAES();

  // Coverage summary: count real_signal vs fallback across all targets.
  // Targets counted: 9 continuous + 2 categorical + engagement + 7 boundaries + intensity = 20.
  const provenances: NodeProvenance[] = [
    MAT.provenance, CD.provenance, CU.provenance, MOR.provenance,
    PRO.provenance, COM.provenance, ZS.provenance, ONT_H.provenance, ONT_S.provenance,
    EPS.provenance, AES.provenance,
    engagement.provenance,
    religious.provenance, ideological.provenance, political_camp.provenance, class_.provenance,
    national.provenance, ethnic_racial.provenance, gender.provenance,
    intensityProvenance,
  ];
  const realSignalCount = provenances.filter(p => p.source === "real_signal").length;
  const fallbackCount = provenances.length - realSignalCount;

  return {
    respondentId: r.respondentId,
    year: r.year,
    weight: r.weight,
    voteChoiceObserved: r.voteChoiceObserved,
    turnoutObserved: r.turnoutObserved,
    MAT, CD, CU, MOR, PRO, COM, ZS, ONT_H, ONT_S,
    EPS, AES,
    engagement,
    moralBoundaries: {
      national, ethnic_racial, religious, class: class_, ideological, gender, political_camp,
      intensity,
      intensityProvenance,
    },
    coverage: { realSignalCount, fallbackCount, totalTargets: provenances.length },
  };
}

/**
 * Validate a SurveyPrismSignature: every distribution finite, normalized,
 * uncertainties present, salience values in [0, 3], engagement in [0, 10].
 * Returns null if valid; otherwise a list of validation errors.
 */
export function validateSignature(sig: SurveyPrismSignature): string[] | null {
  const errors: string[] = [];
  const SUM_TOL = 1e-6;

  function checkDist(label: string, d: readonly number[], expectedLen: number): void {
    if (d.length !== expectedLen) errors.push(`${label}: length ${d.length} != ${expectedLen}`);
    let sum = 0;
    for (let i = 0; i < d.length; i++) {
      const v = d[i];
      if (v === undefined) { errors.push(`${label}[${i}]: undefined`); return; }
      if (!Number.isFinite(v)) { errors.push(`${label}[${i}]: not finite (${v})`); return; }
      if (v < -SUM_TOL || v > 1 + SUM_TOL) errors.push(`${label}[${i}]: out of [0,1] (${v})`);
      sum += v;
    }
    if (Math.abs(sum - 1) > SUM_TOL * d.length) errors.push(`${label}: sum ${sum} != 1`);
  }

  function checkContinuous(label: string, n: ContinuousNodeSignature): void {
    checkDist(`${label}.posPosterior`, n.posPosterior, 5);
    checkDist(`${label}.salPosterior`, n.salPosterior, 4);
    if (!n.provenance) errors.push(`${label}: missing provenance`);
    else if (!["low", "medium", "high"].includes(n.provenance.uncertainty)) {
      errors.push(`${label}: uncertainty invalid (${n.provenance.uncertainty})`);
    }
  }

  function checkCategorical(label: string, n: CategoricalNodeSignature): void {
    checkDist(`${label}.catDistribution`, n.catDistribution, 6);
    checkDist(`${label}.salPosterior`, n.salPosterior, 4);
    if (!n.provenance) errors.push(`${label}: missing provenance`);
  }

  for (const k of ["MAT","CD","CU","MOR","PRO","COM","ZS","ONT_H","ONT_S"] as const) {
    checkContinuous(k, sig[k]);
  }
  checkCategorical("EPS", sig.EPS);
  checkCategorical("AES", sig.AES);

  if (!Number.isFinite(sig.engagement.value) || sig.engagement.value < 0 || sig.engagement.value > 10) {
    errors.push(`engagement.value out of [0,10]: ${sig.engagement.value}`);
  }
  if (!sig.engagement.provenance) errors.push(`engagement missing provenance`);

  for (const b of ["national","ethnic_racial","religious","class","ideological","gender","political_camp"] as const) {
    const entry = sig.moralBoundaries[b];
    if (!Number.isFinite(entry.salience) || entry.salience < 0 || entry.salience > 3) {
      errors.push(`moralBoundaries.${b}.salience out of [0,3]: ${entry.salience}`);
    }
    if (!entry.provenance) errors.push(`moralBoundaries.${b}: missing provenance`);
  }
  if (!Number.isFinite(sig.moralBoundaries.intensity) || sig.moralBoundaries.intensity < 0 || sig.moralBoundaries.intensity > 3) {
    errors.push(`moralBoundaries.intensity out of [0,3]: ${sig.moralBoundaries.intensity}`);
  }

  return errors.length ? errors : null;
}

// Exposed for smoke / debugging.
export const _internals = {
  UNIFORM_POS5, SAL_LOW, SAL_LOW_MED, SAL_MED, SAL_MED_HIGH, SAL_HIGH, SAL_VERY_HIGH,
  EPS_FALLBACK, AES_UNIFORM,
  salienceToDist, expectedSalience, parseCodedNumber,
};
