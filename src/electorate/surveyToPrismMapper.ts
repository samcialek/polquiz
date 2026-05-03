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

/** Boundary fallback (salience 1.0, high uncertainty per spec). */
function fallbackBoundary(notes?: string): MoralBoundaryEntry {
  return {
    salience: 1.0,
    provenance: { source: "fallback", vars: [], partyIdDerived: false, uncertainty: "high", notes },
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
  const national = fallbackBoundary("v0: no per-year national-pride / immigration-restrictiveness item parsed");
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

  // Continuous nodes (all fallback in v0 — issue-item decoders deferred to v1).
  const MAT   = fallbackContinuous("v0: ideological position from issue items deferred (CC*_337_*, CC*_415r etc.)");
  const CD    = fallbackContinuous("v0: ideological position from issue items deferred (abortion / LGBT / religion items)");
  const CU    = fallbackContinuous("v0: ideological position from issue items deferred (immigration battery)");
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
