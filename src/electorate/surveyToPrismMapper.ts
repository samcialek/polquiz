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
 * CD (cultural direction) — first real-signal core-position target shipped
 * in mapper v0.1A. Year-gated to 2016 and 2020 because those are the
 * cycles whose codebooks have been verified to use the CC{Y2}_332 stem
 * with identical wording for items a–f.
 *
 * Item polarity (verified from data/cces2016/hcbk0006.htm and
 * data/cces2020/CES20_Common_pre_qx.pdf):
 *   - 332a "Always allow abortion as a matter of choice"  → support = progressive (CD low)
 *   - 332b "Permit only in case of rape/incest/life"      → support = traditionalist (this is a *restriction*)
 *   - 332c "Prohibit after 20th week"                     → support = traditionalist
 *   - 332d "Allow employers to decline coverage"          → support = traditionalist
 *   - 332e "Prohibit federal funding for abortion"        → support = traditionalist
 *   - 332f "Make abortions illegal in all circumstances"  → support = traditionalist
 *
 * Coding (CCES standard, identical 2016/2020): `1` = Support, `2` = Oppose,
 * `8` = Skipped, `9` = Not Asked, `.` = missing. Skipped / NotAsked /
 * missing are dropped from the running tally.
 *
 * Algorithm: count traditionalist signals (T) and progressive signals (P)
 * across answered items. Net = (T − P) / answered, in [-1, +1]. Position =
 * 3 + 2 × net (linear map to [1, 5]). Posterior is a discrete-Gaussian over
 * positions {1..5} centered at `pos` with width inverse to answered count.
 *
 * Salience: intensity (|net|) + small bonus for answer breadth. Uncertainty
 * gates on answered count (≥ 4 → low; 2-3 → medium; 1 → high).
 *
 * **2020-only column CC20_332g** ("Prohibit states from requiring abortions
 * only at hospitals") has no 2016 counterpart and a more nuanced polarity
 * (anti-restriction = pro-availability). v0.1A excludes 332g to keep the
 * polarity table identical across both shipped cycles.
 *
 * Forbidden inputs (verified by inspection): no `voteChoiceObserved`, no
 * candidate thermometers, no `pid7`, no turnout fields. Only the six
 * `CC{Y2}_332*` columns are read.
 */
function deriveCD(r: WeightedSurveyRespondent): ContinuousNodeSignature {
  if (r.year !== 2016 && r.year !== 2020) {
    return fallbackContinuous(`v0.1A CD: abortion-battery decoder gated to 2016/2020 (codebook-verified); year ${r.year} deferred until per-cycle codebook verification`);
  }
  const y2 = String(r.year).slice(-2);
  const items: Array<{ col: string; supportIs: "progressive" | "traditionalist" }> = [
    { col: `CC${y2}_332a`, supportIs: "progressive" },
    { col: `CC${y2}_332b`, supportIs: "traditionalist" },
    { col: `CC${y2}_332c`, supportIs: "traditionalist" },
    { col: `CC${y2}_332d`, supportIs: "traditionalist" },
    { col: `CC${y2}_332e`, supportIs: "traditionalist" },
    { col: `CC${y2}_332f`, supportIs: "traditionalist" },
  ];

  let progressiveSignals = 0;
  let traditionalistSignals = 0;
  let answered = 0;
  const usedVars: string[] = [];
  for (const it of items) {
    const raw = parseCodedNumber(r.rawVarPayload[it.col]);
    if (raw === 1) {
      // Support
      if (it.supportIs === "progressive") progressiveSignals++;
      else traditionalistSignals++;
      answered++;
      usedVars.push(it.col);
    } else if (raw === 2) {
      // Oppose
      if (it.supportIs === "progressive") traditionalistSignals++;
      else progressiveSignals++;
      answered++;
      usedVars.push(it.col);
    }
    // 8 / 9 / "." / "" / "NA" → drop silently
  }

  if (answered === 0) {
    return fallbackContinuous("v0.1A CD: respondent answered 0/6 abortion-battery items");
  }

  // Net score in [-1, +1]: − = progressive, + = traditionalist.
  const net = (traditionalistSignals - progressiveSignals) / answered;
  // Linear map to PRISM CD position [1, 5].
  const pos = 3 + 2 * net;
  // Width inverse to answered count: 1 item → ~1.25, 6 items → ~0.6.
  const sigma = Math.max(0.6, 1.4 - 0.15 * answered);
  const posPosterior = positionPosteriorFromMean(pos, sigma);

  // Salience: intensity (|net|) is the primary signal. Add a small breadth
  // bonus so respondents engaging with more items get higher salience.
  const intensity = Math.abs(net); // 0..1
  const salScore = Math.min(3, 0.5 + intensity * 1.5 + (answered - 1) * 0.1);
  const salPosterior = salienceToDist(salScore);

  const uncertainty: Uncertainty = answered >= 4 ? "low" : answered >= 2 ? "medium" : "high";

  return {
    posPosterior,
    salPosterior,
    provenance: {
      source: "real_signal",
      vars: usedVars,
      partyIdDerived: false,
      uncertainty,
      notes: `v0.1A CD: ${answered}/6 abortion-battery items (− progressive, + traditionalist); net=${net.toFixed(2)} → pos=${pos.toFixed(2)}, salience=${salScore.toFixed(2)}`,
    },
  };
}

/**
 * MAT (material orientation) — third real-signal core position target
 * shipped in mapper v0.1C. Year-gated to 2016 only because the 2016
 * economic battery is the audited one; CC20_350* items (DACA / Kavanaugh /
 * impeachment / etc.) are a different question family and CC16_351I has
 * no direct 2020 equivalent (per the extended directionality audit).
 *
 * Items shipped (per the directionality audit's MAT table):
 *   - `CC16_337_2` "Cut Domestic Spending" (3-way ranking) → **rank-first
 *     = MAT high (free-market)**, **rank-third = MAT low**, weight 0.5×
 *     (audit: ⚠ Ship reduced — direction correct but the basket bundles
 *     welfare with research/agriculture).
 *   - `CC16_337_3` "Raise Taxes" (3-way ranking) → **rank-first = MAT low
 *     (redistributionist)**, **rank-third = MAT high**, weight 1.0×
 *     (audit: ✅ Ship — cleanest of the three Q337 items).
 *   - `CC16_351I` "Repeal Affordable Care Act" (For / Against) → **For = MAT
 *     high (cut-entitlement)**, **Against = MAT low**, weight 1.0× (audit:
 *     ✅ Ship — direction unambiguous).
 *   - `CC16_351K` "Raise the federal minimum wage" (For / Against;
 *     codebook-verified via cross-cycle inference per audit §9 — the
 *     CC16_351 series mirrors specific Congressional roll-calls and the
 *     2014–2016 minimum-wage debate centered on the $10.10 increase) →
 *     **For = MAT low (pro-redistribution)**, **Against = MAT high**,
 *     weight 1.0× (audit: ✅ Ship contingent on wording → confirmed).
 *
 * `CC16_337_1` ("Cut Defense Spending") is **explicitly excluded** per the
 * audit — its strongest load is foreign-policy / national-priority, not
 * MAT, and using it would attribute non-economic preferences to MAT.
 *
 * Coding:
 *   - 337 ranks: `1` = Ranked first (most preferred), `2` = Ranked second,
 *     `3` = Ranked third (least preferred). `8` skipped, `9` not asked,
 *     `.` missing.
 *   - 351 binary: `1` = For, `2` = Against. Same skip codes.
 *
 * Algorithm: each item produces a direction ∈ {−1, 0, +1} (rank 2 produces
 * 0 — neutral middle), multiplied by item polarity (the sign that maps
 * support / rank-first to "MAT high"). The weighted sum / weighted total
 * gives `net ∈ [−1, +1]` where + = free-market and − = redistributionist.
 * Position = 3 + 2 × net. Posterior is a discrete-Gaussian over {1..5}
 * with σ inverse to total weight collected.
 *
 * **Runtime sanity check (audit §9 recommendation)**: this v0.1 mapper
 * does NOT auto-flip CC16_351K direction at runtime even if the For-share
 * looks anomalous — it relies on the codebook-verified wording. A future
 * For-share audit can flag the column upstream rather than silently
 * inverting downstream.
 *
 * Forbidden inputs: no `voteChoiceObserved`, no candidate thermometers,
 * no `pid7`, no turnout fields. Only the four `CC16_337_2/_3 / CC16_351I/K`
 * columns are read.
 */
function deriveMAT(r: WeightedSurveyRespondent): ContinuousNodeSignature {
  if (r.year !== 2016) {
    return fallbackContinuous(`v0.1C MAT: economic-battery decoder gated to 2016 (audited); year ${r.year} deferred until per-cycle codebook verification`);
  }

  // For each item, polarity is the sign s such that "rank-first / Support"
  // maps to (s × +1). Direction is computed as polarity × item-signal,
  // where item-signal is +1 / 0 / −1 for ranks (rank-first / mid / rank-third)
  // or +1 / −1 for binary (Support / Oppose).
  type Item = { col: string; kind: "rank"; polarity: 1 | -1; weight: number }
            | { col: string; kind: "binary"; polarity: 1 | -1; weight: number };
  const items: Item[] = [
    { col: "CC16_337_2", kind: "rank",   polarity:  1, weight: 0.5 }, // rank-first cut-domestic = MAT high
    { col: "CC16_337_3", kind: "rank",   polarity: -1, weight: 1.0 }, // rank-first raise-taxes = MAT low
    { col: "CC16_351I", kind: "binary",  polarity:  1, weight: 1.0 }, // For repeal ACA = MAT high
    { col: "CC16_351K", kind: "binary",  polarity: -1, weight: 1.0 }, // For raise min wage = MAT low
  ];

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
      if (raw === 1) signal = 1;       // For / Support
      else if (raw === 2) signal = -1; // Against / Oppose
      else continue;
    }
    weightedDirectionSum += it.polarity * signal * it.weight;
    totalWeight += it.weight;
    answered++;
    usedVars.push(it.col);
  }

  if (totalWeight === 0) {
    return fallbackContinuous("v0.1C MAT: respondent answered 0/4 economic-battery items");
  }

  const net = weightedDirectionSum / totalWeight; // [-1, +1] (- = redistributionist, + = free-market)
  const pos = 3 + 2 * net;                         // MAT high (5) = free-market; MAT low (1) = redistributionist
  const sigma = Math.max(0.6, 1.4 - 0.25 * totalWeight); // 1.27 at weight=0.5; 0.6 at weight=3.2+

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
      notes: `v0.1C MAT: ${answered}/4 economic-battery items, totalWeight=${totalWeight.toFixed(1)} (− redistributionist, + free-market); net=${net.toFixed(2)} → pos=${pos.toFixed(2)}, salience=${salScore.toFixed(2)}`,
    },
  };
}

/**
 * CU (cultural uniformity / pluralism) — second real-signal core position
 * target shipped in mapper v0.1B. Year-gated to 2016 only because the
 * directionality audit at `results/electorate/synthetic-electorate/
 * mapper-v01-source-directionality-audit.md` only verified the
 * `CC16_331_*` immigration battery; the analogous 2020 stem (`CC20_303*`)
 * is not yet audited.
 *
 * Items shipped (per the audit's confidence column):
 *   - `CC16_331_1` "Grant legal status to long-term illegal immigrants who
 *     paid taxes & no felony" → **Yes = pluralist (CU high)**, weight 0.5×
 *     (audit: ✅ Ship reduced — clean direction but the only progressive
 *     item, so reduced-weight to avoid over-flipping the polarity).
 *   - `CC16_331_2` "Increase border patrols" → **Yes = restrictionist
 *     (CU low)**, weight 0.5× (audit: ⚠ Ship reduced — direction clean but
 *     cross-loaded with security/crime framing).
 *   - `CC16_331_5` "Admit no refugees from Syria" → **Yes = restrictionist
 *     (CU low)**, weight 1.0× (audit: ✅ Ship — cleanest item).
 *   - `CC16_331_8` "Ban Muslims from immigrating" → **Yes = restrictionist
 *     (CU low)**, weight 1.0× (audit: ✅ Ship — direction unambiguous).
 *
 * Coding (CCES standard): `1` = Yes, `2` = No, `8` = Skipped, `9` = Not
 * Asked, `.` = missing. Skipped / NotAsked / missing are dropped.
 *
 * Algorithm: weighted sum of signed direction votes (+1 = restrictionist,
 * −1 = pluralist) divided by the answered total weight gives `net` ∈
 * [−1, +1]. Position = 3 − 2 × net (linear from net=−1 → CU 5 [pluralist]
 * to net=+1 → CU 1 [restrictionist]).
 *
 * Posterior is a discrete-Gaussian over {1..5} with `σ` inverse to total
 * weight collected. Salience = breadth-bonus + intensity. Uncertainty
 * gates on total weight (≥ 1.5 → low; ≥ 0.5 → medium; otherwise no signal,
 * fallback).
 *
 * Forbidden inputs: no `voteChoiceObserved`, no candidate thermometers,
 * no `pid7`, no turnout fields. Only the four `CC16_331_*` columns are
 * read.
 */
function deriveCU(r: WeightedSurveyRespondent): ContinuousNodeSignature {
  if (r.year !== 2016) {
    return fallbackContinuous(`v0.1B CU: immigration-battery decoder gated to 2016 (audited); year ${r.year} deferred`);
  }
  // polarity: +1 = "Yes is restrictionist (CU low)"; -1 = "Yes is pluralist (CU high)".
  const items: Array<{ col: string; polarity: 1 | -1; weight: number }> = [
    { col: "CC16_331_1", polarity: -1, weight: 0.5 },
    { col: "CC16_331_2", polarity:  1, weight: 0.5 },
    { col: "CC16_331_5", polarity:  1, weight: 1.0 },
    { col: "CC16_331_8", polarity:  1, weight: 1.0 },
  ];
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
    return fallbackContinuous("v0.1B CU: respondent answered 0/4 immigration-battery items");
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
      notes: `v0.1B CU: ${answered}/4 immigration-battery items, totalWeight=${totalWeight.toFixed(1)} (− pluralist, + restrictionist); net=${net.toFixed(2)} → pos=${pos.toFixed(2)}, salience=${salScore.toFixed(2)}`,
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
 * `moralBoundaries.national` salience from the CC16_331 immigration
 * battery — shipped together with CU in mapper v0.1B.
 *
 * Per the directionality audit, the 4 immigration items load on the
 * national boundary asymmetrically: a "Yes" answer to a restrictionist
 * item signals high engagement with the national-identity frame; a "No"
 * signals the respondent is NOT gating policy through that frame
 * (universalist or other consideration). The audit's explicit
 * recommendation: ship the salience composite from items 5, 8 (1.0×) and
 * 2 (0.5×). **Item 1 (legal-status pluralist) is excluded** — both
 * pluralist and restrictionist responses are compatible with high or
 * low national salience independently of that item.
 *
 * Coding: 1=Yes, 2=No, 8=Skipped, 9=Not Asked, "."=missing.
 *
 * Algorithm: yes_share = (Σ weight where answer = Yes) / (Σ weight
 * answered). Salience = 0.3 + 2.2 × yes_share (range [0.3, 2.5]). Cross-
 * loads on `religious` / `ethnic_racial` from items 5 / 8 are NOT applied
 * in v0.1B per the audit's "v0.2 normalize multi-boundary loads to avoid
 * double-counting" deferral.
 *
 * Year-gated to 2016 only — the analogous 2020 immigration battery is not
 * yet audited.
 */
function deriveNationalBoundary(r: WeightedSurveyRespondent): MoralBoundaryEntry {
  if (r.year !== 2016) {
    return fallbackBoundary(`v0.1B national: immigration-battery decoder gated to 2016 (audited); year ${r.year} deferred`);
  }
  const items: Array<{ col: string; weight: number }> = [
    { col: "CC16_331_2", weight: 0.5 },
    { col: "CC16_331_5", weight: 1.0 },
    { col: "CC16_331_8", weight: 1.0 },
  ];
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
    return fallbackBoundary("v0.1B national: respondent answered 0/3 immigration-battery items");
  }
  const yesShare = yesWeight / totalWeight; // [0, 1]
  const salience = 0.3 + 2.2 * yesShare;     // [0.3, 2.5]
  const uncertainty: Uncertainty = totalWeight >= 1.5 ? "low" : totalWeight >= 0.5 ? "medium" : "high";
  return {
    salience,
    provenance: {
      source: "real_signal",
      vars: usedVars,
      partyIdDerived: false,
      uncertainty,
      notes: `v0.1B national: ${answered}/3 items (CC16_331_{2,5,8}); yes_share=${yesShare.toFixed(2)} → salience=${salience.toFixed(2)}; cross-loads on religious/ethnic_racial deferred to v0.2 per audit`,
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
