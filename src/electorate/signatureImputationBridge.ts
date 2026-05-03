/**
 * Phase 2.7.5 v1 — Signature imputation bridge (weighted hot-deck).
 *
 * Promotes the v0 mock bridge into the real production bridge per
 * `results/electorate/synthetic-electorate/signature-imputation-bridge-plan.md`.
 *
 * The bridge takes:
 *   - Donor PRISM signatures (mapper output for one election year), each
 *     wrapped with the donor's demographic bucketing.
 *   - A universe of voting-eligible adult/cell rows for the same year
 *     (currently a mock fixture; later the real PUMS-derived loader).
 *   - Options (numDraws, randomSeed, MIN_DONORS, etc.).
 *
 * For each universe row × draw, it picks one donor by weighted multinomial
 * sampling within the smallest cell that has enough donors, copies the
 * donor's full PRISM signature verbatim into the output row, and records
 * structured provenance (backoff step, donor-pool size, ESS, donor weight
 * total, selected donor ID, row-level uncertainty, backoff path).
 *
 * Strict invariants (enforced by code shape, verified by smoke):
 *   - voteChoiceObserved is NEVER read for matching, sampling, or output.
 *     The bridge's output never contains a vote-choice field. A smoke spy
 *     re-runs the bridge with donor vote-choice scrubbed and verifies
 *     byte-identical output.
 *   - pid7 is NEVER read for matching. (It is used inside the donor's
 *     signature for moralBoundaries.political_camp salience with the
 *     `partyIdDerived: true` flag preserved — but matching uses
 *     demographics only.)
 *   - No vote prediction, abstention calibration, candidate distance,
 *     or scorer output enters the bridge.
 *   - Bridge is pure: same (donors, universe, opts) → byte-identical
 *     output. No global state, no IO.
 */

import {
  SYNTHETIC_ELECTORATE_SCHEMA_VERSION,
  type SyntheticElectorateRow,
  type SyntheticElectorateSignature,
} from "./syntheticElectorateContract.js";
import type { SurveyPrismSignature } from "./surveyToPrismMapper.js";

// ─── Public types ──────────────────────────────────────────────────────────

/** Demographic bucket strings used for hot-deck matching. */
export interface BridgeDemographicBuckets {
  /** 2-letter state postal code (e.g., "CA", "TX"). */
  state: string;
  /** Age bucket label (e.g., "18-29", "30-44", "45-64", "65+"). */
  ageBucket: string;
  /** Race / ethnicity bucket label (e.g., "white", "black", "hispanic"). */
  raceEthnicity: string;
  /** Sex (e.g., "male", "female"). */
  sex: string;
  /** Education bucket (e.g., "hs_or_less", "some_college", "ba_plus"). */
  education: string;
  /** Income bucket (e.g., "low", "middle", "high"); null = absent. */
  incomeBucket: string | null;
}

/**
 * Donor row supplied to the bridge — pairs a mapper signature with the
 * donor's demographic buckets and the donor's CES survey weight.
 *
 * Note: signature.voteChoiceObserved exists on `SurveyPrismSignature` so
 * downstream backtest evaluators can read it; the bridge itself never
 * touches it.
 */
export interface BridgeDonorSignature {
  signature: SurveyPrismSignature;
  demographics: BridgeDemographicBuckets;
  /**
   * CES survey weight (per the loader's pickWeight selection: validated
   * voter post-wave preferred). Drives multinomial donor sampling.
   */
  weight: number;
}

/** Universe row supplied to the bridge — one represented eligible adult/cell. */
export interface BridgeUniverseRow {
  /** Stable unique identifier for this universe row across draws. */
  universeRowId: string;
  year: 2008 | 2012 | 2016 | 2020 | 2024;
  /** Demographic buckets used as the matching key. */
  demographics: BridgeDemographicBuckets;
  /**
   * Population share carried by this row (eventually PUMS PWGTP × replicate
   * weight; for the mock fixture it is the cell weight). Becomes
   * `cellWeight` on the output row.
   */
  personWeight: number;
  /** Optional pass-through demographics propagated to the output row. */
  age?: number | null;
  countyFips?: string | null;
  congressionalDistrict?: string | null;
  metroStatus?: string | null;
  densityBucket?: string | null;
}

export interface BridgeOptions {
  year: 2008 | 2012 | 2016 | 2020 | 2024;
  /** Number of independent draws per universe row. Default 5. */
  numDraws?: number;
  /** Deterministic seed; same seed → byte-identical output. Default 0. */
  randomSeed?: number;
  /** Minimum donor count required to sample at a step. Default 25. */
  minDonors?: number;
  /** Minimum combined donor weight required to sample at a step. Default 5.0. */
  minDonorWeight?: number;
  /** Allow step 8 (year-only) fallback. Default false. */
  allowNationalFallback?: boolean;
  /** Provenance flag echoed into output notes. Default "raw". */
  donorWeightSource?: "raw" | "raked";
}

export type BackoffStep = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export type RowImputationUncertainty = "low" | "medium" | "high";

export interface BridgeStats {
  inputUniverseRows: number;
  outputRows: number;
  perStepRowCount: Record<BackoffStep, number>;
  perStepShare: Record<BackoffStep, number>;
  meanDonorPoolSize: number;
  meanEffectiveSampleSize: number;
  uncertaintyDistribution: Record<RowImputationUncertainty, number>;
  /** Universe rows that no allowed step could match (zero when fallback enabled). */
  unmatchableUniverseRows: number;
  /** Per-step (1–8) counts of unique universe rows whose draws all landed at step k. */
  perStepUniverseRowCount: Record<BackoffStep, number>;
}

// ─── Internal helpers ──────────────────────────────────────────────────────

const STATE_TO_REGION: Record<string, "northeast" | "midwest" | "south" | "west"> = {
  CT: "northeast", ME: "northeast", MA: "northeast", NH: "northeast", NJ: "northeast",
  NY: "northeast", PA: "northeast", RI: "northeast", VT: "northeast",
  IL: "midwest", IN: "midwest", IA: "midwest", KS: "midwest", MI: "midwest",
  MN: "midwest", MO: "midwest", NE: "midwest", ND: "midwest", OH: "midwest",
  SD: "midwest", WI: "midwest",
  AL: "south", AR: "south", DE: "south", DC: "south", FL: "south", GA: "south",
  KY: "south", LA: "south", MD: "south", MS: "south", NC: "south", OK: "south",
  SC: "south", TN: "south", TX: "south", VA: "south", WV: "south",
  AK: "west", AZ: "west", CA: "west", CO: "west", HI: "west", ID: "west",
  MT: "west", NV: "west", NM: "west", OR: "west", UT: "west", WA: "west", WY: "west",
};

function regionOf(state: string): string {
  return STATE_TO_REGION[state] ?? "unknown_region";
}

/** FNV-1a 32-bit string hash. */
function fnv1a(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Mulberry32 deterministic PRNG. */
function mulberry32(seed: number): () => number {
  let s = seed >>> 0;
  return function () {
    s = (s + 0x6D2B79F5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Effective sample size (Kish): (Σw)² / Σw². */
function effectiveSampleSize(weights: number[]): number {
  let sum = 0;
  let sumSq = 0;
  for (const w of weights) { sum += w; sumSq += w * w; }
  if (sumSq === 0) return 0;
  return (sum * sum) / sumSq;
}

/** Weighted multinomial sample (with replacement). Returns the donor index. */
function sampleWeighted(weights: number[], rng: () => number): number {
  let total = 0;
  for (const w of weights) total += w;
  if (total <= 0) return 0;
  const target = rng() * total;
  let cum = 0;
  for (let i = 0; i < weights.length; i++) {
    cum += weights[i]!;
    if (target < cum) return i;
  }
  return weights.length - 1;
}

/** Build the cell-key string for a given step. Includes the year for safety. */
function cellKeyForStep(step: BackoffStep, d: BridgeDemographicBuckets, year: number): string | null {
  switch (step) {
    case 1:
      if (d.incomeBucket == null) return null;
      return `s1|${year}|${d.state}|${d.raceEthnicity}|${d.sex}|${d.ageBucket}|${d.education}|${d.incomeBucket}`;
    case 2:
      return `s2|${year}|${d.state}|${d.raceEthnicity}|${d.sex}|${d.ageBucket}|${d.education}`;
    case 3:
      return `s3|${year}|${regionOf(d.state)}|${d.raceEthnicity}|${d.sex}|${d.ageBucket}|${d.education}`;
    case 4:
      return `s4|${year}|${regionOf(d.state)}|${d.raceEthnicity}|${d.sex}|${d.ageBucket}`;
    case 5:
      return `s5|${year}|${d.raceEthnicity}|${d.sex}|${d.ageBucket}|${d.education}`;
    case 6:
      return `s6|${year}|${d.raceEthnicity}|${d.sex}|${d.ageBucket}`;
    case 7:
      return `s7|${year}|${d.raceEthnicity}|${d.sex}`;
    case 8:
      return `s8|${year}`;
  }
}

/** Index donors by all 8 step keys for O(1) lookup. */
function buildDonorIndex(donors: BridgeDonorSignature[], year: number): Map<string, number[]> {
  const idx = new Map<string, number[]>();
  for (let i = 0; i < donors.length; i++) {
    const d = donors[i]!.demographics;
    for (const step of [1, 2, 3, 4, 5, 6, 7, 8] as const) {
      const key = cellKeyForStep(step, d, year);
      if (key === null) continue;
      let bucket = idx.get(key);
      if (!bucket) { bucket = []; idx.set(key, bucket); }
      bucket.push(i);
    }
  }
  return idx;
}

/** Row-level imputation uncertainty per plan §"Imputation provenance contract". */
function classifyUncertainty(step: BackoffStep, poolSize: number, ess: number): RowImputationUncertainty {
  if (step >= 5 || poolSize < 25 || ess < 20) return "high";
  if (step <= 2 && poolSize >= 100 && ess >= 50) return "low";
  return "medium";
}

interface MatchedPool {
  step: BackoffStep;
  donorIndices: number[];
  donorWeights: number[];
  donorWeightTotal: number;
  ess: number;
  cellKey: string;
  backoffPath: string[];
}

/** Walk steps 1..maxStep until a pool of ≥minDonors and ≥minDonorWeight is found. */
function matchDonorPool(
  universeRow: BridgeUniverseRow,
  donors: BridgeDonorSignature[],
  index: Map<string, number[]>,
  opts: { minDonors: number; minDonorWeight: number; maxStep: BackoffStep; year: number },
): MatchedPool | null {
  const backoffPath: string[] = [];
  for (let step = 1; step <= opts.maxStep; step++) {
    const k = step as BackoffStep;
    const cellKey = cellKeyForStep(k, universeRow.demographics, opts.year);
    if (cellKey === null) {
      backoffPath.push(`step${step}: skipped (income missing on universe row)`);
      continue;
    }
    const candidateIdxs = index.get(cellKey) ?? [];
    if (candidateIdxs.length === 0) {
      backoffPath.push(`step${step}: 0 donors at cellKey`);
      continue;
    }
    const weights = candidateIdxs.map(i => donors[i]!.weight);
    let totalW = 0;
    for (const w of weights) totalW += w;
    if (candidateIdxs.length < opts.minDonors || totalW < opts.minDonorWeight) {
      backoffPath.push(`step${step}: pool=${candidateIdxs.length} weight=${totalW.toFixed(2)} below thresholds`);
      continue;
    }
    return {
      step: k,
      donorIndices: candidateIdxs,
      donorWeights: weights,
      donorWeightTotal: totalW,
      ess: effectiveSampleSize(weights),
      cellKey,
      backoffPath,
    };
  }
  return null;
}

/**
 * Convert a donor's mapper signature into the contract's
 * `SyntheticElectorateSignature` shape. Mirrors the v0 mock-bridge
 * accounting: under signatureSource = "imputed_from_cell", no target
 * was filled by this row's own data — donor real_signal counts become
 * "imputed targets" (the imputation carried real signal), donor
 * fallbacks remain fallbacks.
 */
function toContractSignature(
  donor: SurveyPrismSignature,
  provenanceNote: string,
): SyntheticElectorateSignature {
  return {
    positionNodes: {
      MAT: donor.MAT,
      CD: donor.CD,
      CU: donor.CU,
      MOR: donor.MOR,
      PRO: donor.PRO,
      COM: donor.COM,
      ZS: donor.ZS,
      ONT_H: donor.ONT_H,
      ONT_S: donor.ONT_S,
    },
    categoricalNodes: {
      EPS: donor.EPS,
      AES: donor.AES,
    },
    engagement: donor.engagement,
    moralBoundaries: donor.moralBoundaries,
    coverage: {
      realSignalTargets: 0,
      imputedTargets: donor.coverage.realSignalCount,
      fallbackTargets: donor.coverage.fallbackCount,
      totalTargets: donor.coverage.totalTargets,
      notes: [provenanceNote],
    },
  };
}

function formatProvenance(p: {
  step: BackoffStep;
  cellKey: string;
  donorPoolSize: number;
  ess: number;
  donorWeightTotal: number;
  selectedDonorId: string;
  uncertainty: RowImputationUncertainty;
  backoffPath: string[];
  donorWeightSource: "raw" | "raked";
}): string {
  return [
    `hot-deck-step-${p.step}`,
    `cellKey=${p.cellKey}`,
    `donorPoolSize=${p.donorPoolSize}`,
    `effectiveSampleSize=${p.ess.toFixed(2)}`,
    `donorWeightTotal=${p.donorWeightTotal.toFixed(2)}`,
    `selectedDonorId=R${p.selectedDonorId}`,
    `uncertainty=${p.uncertainty}`,
    `donorWeightSource=${p.donorWeightSource}`,
    `backoffPath=[${p.backoffPath.join(" | ")}]`,
  ].join("; ");
}

// ─── Bridge entry point ────────────────────────────────────────────────────

/**
 * Run weighted hot-deck imputation. Same (donors, universe, opts) →
 * byte-identical `rows` output; `stats` summarises the run.
 *
 * The order of `rows` is `(universeRow_i × drawId_j)` flattened with `i`
 * outer, `j` inner. `drawId` ranges `0..numDraws-1`.
 */
export function runSignatureImputationBridge(
  donors: BridgeDonorSignature[],
  universe: BridgeUniverseRow[],
  opts: BridgeOptions,
): { rows: SyntheticElectorateRow[]; stats: BridgeStats } {
  const numDraws = opts.numDraws ?? 5;
  const seed = opts.randomSeed ?? 0;
  const minDonors = opts.minDonors ?? 25;
  const minDonorWeight = opts.minDonorWeight ?? 5.0;
  const maxStep: BackoffStep = opts.allowNationalFallback ? 8 : 7;
  const donorWeightSource = opts.donorWeightSource ?? "raw";

  // Defensive year filter — bridge consumes one year at a time.
  const yearDonors = donors.filter(d => d.signature.year === opts.year);
  const yearUniverse = universe.filter(u => u.year === opts.year);
  const index = buildDonorIndex(yearDonors, opts.year);

  const rows: SyntheticElectorateRow[] = [];
  const perStepRowCount: Record<BackoffStep, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0 };
  const perStepUniverseRowCount: Record<BackoffStep, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0 };
  const uncertaintyDistribution: Record<RowImputationUncertainty, number> = { low: 0, medium: 0, high: 0 };
  let donorPoolSizeSum = 0;
  let essSum = 0;
  let unmatchable = 0;

  for (let i = 0; i < yearUniverse.length; i++) {
    const u = yearUniverse[i]!;
    const matched = matchDonorPool(u, yearDonors, index, {
      minDonors, minDonorWeight, maxStep, year: opts.year,
    });
    if (!matched) {
      unmatchable++;
      continue;
    }

    perStepUniverseRowCount[matched.step]++;
    donorPoolSizeSum += matched.donorIndices.length;
    essSum += matched.ess;

    for (let drawId = 0; drawId < numDraws; drawId++) {
      const seedComponent = fnv1a(`${seed}|${u.universeRowId}|${drawId}`);
      const rng = mulberry32(seedComponent);
      const localIdx = sampleWeighted(matched.donorWeights, rng);
      const donorIdxInArray = matched.donorIndices[localIdx]!;
      const donor = yearDonors[donorIdxInArray]!;

      const uncertainty = classifyUncertainty(matched.step, matched.donorIndices.length, matched.ess);
      const provenanceNote = formatProvenance({
        step: matched.step,
        cellKey: matched.cellKey,
        donorPoolSize: matched.donorIndices.length,
        ess: matched.ess,
        donorWeightTotal: matched.donorWeightTotal,
        selectedDonorId: donor.signature.respondentId,
        uncertainty,
        backoffPath: matched.backoffPath,
        donorWeightSource,
      });

      const signature = toContractSignature(donor.signature, provenanceNote);

      const row: SyntheticElectorateRow = {
        schemaVersion: SYNTHETIC_ELECTORATE_SCHEMA_VERSION,
        year: opts.year,
        drawId,
        rowKind: "weighted_cell",
        cellId: u.universeRowId,
        cellWeight: u.personWeight,
        populationSource: "survey_weighted",
        signatureSource: "imputed_from_cell",
        demographics: {
          state: u.demographics.state,
          age: u.age ?? null,
          ageBucket: u.demographics.ageBucket,
          raceEthnicity: u.demographics.raceEthnicity,
          sex: u.demographics.sex,
          education: u.demographics.education,
          incomeBucket: u.demographics.incomeBucket,
          citizenVotingEligible: true,
          geography: {
            countyFips: u.countyFips ?? null,
            congressionalDistrict: u.congressionalDistrict ?? null,
            metroStatus: u.metroStatus ?? null,
            densityBucket: u.densityBucket ?? null,
          },
        },
        signature,
        uncertainty: {
          // Demographic coverage is set by the universe loader's quality;
          // for the v1 bridge we mirror the row-level imputation uncertainty
          // for demographic coverage as a conservative default and let the
          // upstream loader override if it carries its own field.
          demographicCoverage: uncertainty,
          // Signature uncertainty is inherited from the donor — hot-deck
          // never lowers signature uncertainty. We use the donor's overall
          // coverage ratio as a coarse proxy: ≥75% real-signal targets →
          // medium, otherwise high. (Fine-grained per-target uncertainty
          // is preserved inside each NodeProvenance.)
          signatureCoverage: donor.signature.coverage.realSignalCount / Math.max(1, donor.signature.coverage.totalTargets) >= 0.75 ? "medium" : "high",
          imputation: uncertainty,
        },
      };
      rows.push(row);
      perStepRowCount[matched.step]++;
      uncertaintyDistribution[uncertainty]++;
    }
  }

  const outputRows = rows.length;
  const matchedUniverseRows = yearUniverse.length - unmatchable;
  const perStepShare: Record<BackoffStep, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0 };
  if (outputRows > 0) {
    for (const k of [1, 2, 3, 4, 5, 6, 7, 8] as const) {
      perStepShare[k] = perStepRowCount[k] / outputRows;
    }
  }
  const stats: BridgeStats = {
    inputUniverseRows: yearUniverse.length,
    outputRows,
    perStepRowCount,
    perStepShare,
    meanDonorPoolSize: matchedUniverseRows > 0 ? donorPoolSizeSum / matchedUniverseRows : 0,
    meanEffectiveSampleSize: matchedUniverseRows > 0 ? essSum / matchedUniverseRows : 0,
    uncertaintyDistribution,
    unmatchableUniverseRows: unmatchable,
    perStepUniverseRowCount,
  };
  return { rows, stats };
}

// Exposed for smoke / debugging.
export const _internals = {
  STATE_TO_REGION,
  regionOf,
  fnv1a,
  mulberry32,
  effectiveSampleSize,
  sampleWeighted,
  cellKeyForStep,
  buildDonorIndex,
  classifyUncertainty,
  toContractSignature,
  formatProvenance,
};
