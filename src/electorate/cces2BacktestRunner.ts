/**
 * CCES → mapper → predictVote backtest runner (single cycle).
 *
 * Loads one cycle's CCES microdata, maps each respondent through
 * `surveyToPrismMapper`, bridges the posterior signature into a
 * point-estimate `NodeSignature`, and runs each through `predictVote`
 * against the cycle's candidate set. Aggregates weighted predicted
 * D / R / T / O / Abstain shares; computes per-node weighted marginals;
 * computes nearest-archetype distribution.
 *
 * Architectural decisions (per the 5-cycle dashboard plan):
 *   1. Posterior point-estimate (not N-sample): each respondent contributes
 *      one vote/abstain decision. Deterministic, fast.
 *   2. Vote denominator: report both shares-of-voters and shares-of-electorate.
 *   3. Engagement: bucket the mapper's 0..10 value into the existing
 *      EngagementLevel categories.
 *   4. Archetype assignment: nearest-archetype by salience-weighted Euclidean
 *      distance on continuous nodes. Used only for the "top archetypes" panel,
 *      NOT for the vote prediction (which uses the raw respondent signature).
 *
 * Forbidden inputs: no `voteChoiceObserved`, no candidate thermometers,
 * no party-ID for vote prediction (mapper already scrubs these). Observed
 * vote-choice is carried through only for downstream comparison.
 */

import type { ContinuousNodeId, NodeStatus } from "../types.js";
import type {
  SurveyPrismSignature,
  ContinuousNodeSignature,
  CategoricalNodeSignature,
  PosDist5,
  SalDist4,
  CatDist6,
} from "./surveyToPrismMapper.js";
import { mapSurveyToPrism } from "./surveyToPrismMapper.js";
import { loadSurveyRespondents } from "./cesBacktestLoader.js";
import type { LoaderOptions } from "./surveyBacktestTypes.js";
import type { NodeSignature } from "../engine/respondentSignature.js";
import type { EngagementLevel } from "../engine/engagementLabel.js";
import type { MorBoundariesNodeState } from "../types.js";
import { ELECTIONS } from "../historical/candidates.js";
import { getContext } from "../historical/contexts.js";
import { predictVote } from "../historical/respondentVoteChoice.js";
import { ARCHETYPES } from "../config/archetypes.js";
import { loadTurnoutModel, predictTurnoutProbability, type TurnoutLookup } from "./turnoutModel.js";
import type { PartyID } from "../types.js";

// ─── Types ───────────────────────────────────────────────────────────────

export type Party = "D" | "R" | "T" | "O";
export type Bucket = Party | "Abstain";

export interface CycleBacktestOptions {
  /** Hard cap on rows processed; null = full dataset. */
  rowLimit?: number | null;
  /** Override the default file path for this cycle. */
  filePath?: string;
  /**
   * If supplied, gates each respondent's vote/abstain via the demographic
   * turnout model (Phase B' calibration). Each respondent contributes
   * `weight × p_turnout` to the nearest candidate's bucket and
   * `weight × (1 − p_turnout)` to Abstain. When omitted, falls back to
   * the engine's engagement-based clearing-bar abstain (legacy v0 path).
   */
  turnoutModel?: TurnoutLookup | null;
}

export interface CycleBacktestResult {
  year: number;
  rowsProcessed: number;
  totalWeight: number;

  predicted: {
    weightedCounts: Record<Bucket, number>;
    sharesOfElectorate: Record<Bucket, number>;
    sharesOfVoters: Record<Party, number>;
  };
  actual: {
    sharesOfElectorate: { D: number; R: number; Other: number; Abstain: number };
    sharesOfVoters: { D: number; R: number; Other: number };
    candidates: { d: string | null; r: string | null };
  };
  gaps: {
    sharesOfVoters: { D: number; R: number; Other: number; absMean: number };
    sharesOfElectorate: { D: number; R: number; Other: number; Abstain: number; absMean: number };
  };

  coverage: {
    perNode: Record<string, { realSignal: number; fallback: number; total: number }>;
    perBoundary: Record<string, { realSignal: number; fallback: number; total: number }>;
    engagement: { realSignal: number; fallback: number };
  };

  continuousMarginals: Record<string, {
    posMean: number;
    posSd: number;
    posP10: number; posP25: number; posP50: number; posP75: number; posP90: number;
    salMean: number;
  }>;
  categoricalMarginals: Record<string, {
    distribution: number[];
    salMean: number;
  }>;
  boundaryMarginals: Record<string, { salMean: number }>;
  intensityMean: number;

  engagement: {
    apolitical: number; casual: number; engaged: number; highly_engaged: number;
    mean: number;
  };

  topArchetypes: Array<{ id: string; name: string; weight: number; share: number }>;
}

// ─── Helpers ─────────────────────────────────────────────────────────────

const CONTINUOUS_NODES = ["MAT", "CD", "CU", "MOR", "PRO", "COM", "ZS", "ONT_H", "ONT_S"] as const;
const CATEGORICAL_NODES = ["EPS", "AES"] as const;
const BOUNDARIES = ["national", "ethnic_racial", "religious", "class", "ideological", "gender", "political_camp"] as const;

const DEFAULT_FILE_PATHS: Record<number, string> = {
  2008: "data/cces2008/cces_2008_common.tab",
  2012: "data/cces2012/CCES12_Common_VV.tab",
  2016: "data/cces2016/CCES16_Common_OUTPUT_Feb2018_VV.tab",
  2020: "data/cces2020/CES20_Common_OUTPUT_vv.csv",
  2024: "data/cces2024/CCES24_Common_OUTPUT_vv_topost_final.csv",
};

function expectedPos5(d: PosDist5 | ArrayLike<number>): number {
  let e = 0;
  for (let i = 0; i < 5; i++) e += (d[i] ?? 0) * (i + 1);
  return e;
}
function expectedSal4(d: SalDist4 | ArrayLike<number>): number {
  return (d[0] ?? 0) * 0 + (d[1] ?? 0) * 1 + (d[2] ?? 0) * 2 + (d[3] ?? 0) * 3;
}
function expectedCatIdx6(d: CatDist6 | ArrayLike<number>): number {
  let e = 0;
  for (let i = 0; i < 6; i++) e += (d[i] ?? 0) * i;
  return e;
}

/** Bridge: SurveyPrismSignature → NodeSignature (point estimate per node). */
function signatureToNodeSig(s: SurveyPrismSignature): NodeSignature {
  const sig: NodeSignature = {};
  for (const id of CONTINUOUS_NODES) {
    const ns: ContinuousNodeSignature = s[id];
    sig[id as ContinuousNodeId] = {
      pos: expectedPos5(ns.posPosterior),
      sal: expectedSal4(ns.salPosterior),
    };
  }
  for (const id of CATEGORICAL_NODES) {
    const ns: CategoricalNodeSignature = s[id];
    sig[id] = {
      pos: expectedCatIdx6(ns.catDistribution),
      sal: expectedSal4(ns.salPosterior),
      catDist: [...ns.catDistribution],
    };
  }
  return sig;
}

/** Mapper engagement (0..10) → EngagementLevel. */
function engagementLevelFromValue(v: number): EngagementLevel {
  if (v < 2.5) return "apolitical";
  if (v < 5.0) return "casual";
  if (v < 7.5) return "engaged";
  return "highly-engaged";
}

/** Mapper boundaries → MorBoundariesNodeState (engine field-name shim). */
function morStateFromMapper(s: SurveyPrismSignature): MorBoundariesNodeState {
  const mb = s.moralBoundaries;
  // Engine boundaries are 0..1; mapper salience is 0..3. Normalize.
  return {
    boundaries: {
      national: mb.national.salience / 3,
      ethnic_racial: mb.ethnic_racial.salience / 3,
      religious: mb.religious.salience / 3,
      class: mb.class.salience / 3,
      ideological: mb.ideological.salience / 3,
      gender: mb.gender.salience / 3,
      political_tribe: mb.political_camp.salience / 3,
    },
    intensity: mb.intensity,
    touches: {},
    touchTypes: new Set(),
    status: "live_resolved" as NodeStatus,
  };
}

/** Map candidate party string to a canonical bucket. */
function partyBucket(party: string): Party {
  if (party === "Democratic" || party === "Democratic-Republican") return "D";
  if (party === "Republican" || party === "Whig" || party === "Federalist") return "R";
  if (party === "Independent" || party === "American Independent" || party === "Dixiecrat") return "T";
  return "O";
}

/**
 * CCES `pid7` → engine `PartyID`. Standard mapping used across all cycles
 * (CCES has used the same 7-point + skip coding since 2008):
 *   1 strong D / 2 not-very D / 3 lean D       → "D"
 *   4 independent / no lean                    → "I"
 *   5 lean R / 6 not-very R / 7 strong R       → "R"
 *   8 not sure, missing, blank                 → null (pass nothing)
 *
 * Treating leaners as their leaning party is the political-science
 * standard (leaners vote like partisans). Returning null skips the
 * partisan-loyalty multiplier in `predictVote` for that respondent.
 */
function partyIDFromPid7(rawPid7: string | undefined): PartyID | null {
  if (rawPid7 === undefined) return null;
  const trimmed = rawPid7.trim();
  if (trimmed === "" || trimmed === "." || trimmed === "NA") return null;
  const n = Number(trimmed);
  if (!Number.isFinite(n)) return null;
  if (n >= 1 && n <= 3) return "D";
  if (n === 4) return "I";
  if (n >= 5 && n <= 7) return "R";
  return null;
}

/** Pick the dominant continuous node (by salience) — for predictVote weighting. */
function dominantContinuousNode(sig: NodeSignature): string | null {
  let best: string | null = null;
  let bestSal = -Infinity;
  for (const id of CONTINUOUS_NODES) {
    const e = sig[id as ContinuousNodeId];
    if (!e) continue;
    if (e.sal > bestSal) { bestSal = e.sal; best = id; }
  }
  return best;
}

/** Salience-weighted Euclidean distance between respondent sig and an archetype. */
function nearestArchetypeId(sig: NodeSignature): string | null {
  let bestId: string | null = null;
  let bestDist = Infinity;
  for (const arc of ARCHETYPES) {
    let totalDist = 0;
    let totalW = 0;
    for (const id of CONTINUOUS_NODES) {
      const tmpl = arc.nodes[id];
      if (!tmpl || tmpl.kind !== "continuous") continue;
      const respondent = sig[id as ContinuousNodeId];
      if (!respondent) continue;
      const w = (tmpl.sal ?? 1) + 0.1; // floor so sal=0 archetypes don't disappear
      const dPos = (tmpl.pos - respondent.pos);
      totalDist += w * dPos * dPos;
      totalW += w;
    }
    const d = totalW > 0 ? Math.sqrt(totalDist / totalW) : Infinity;
    if (d < bestDist) { bestDist = d; bestId = arc.id; }
  }
  return bestId;
}

/** Weighted percentiles on a sorted (value, weight) array; weights cumulative. */
function weightedPercentile(sorted: { value: number; w: number }[], totalW: number, p: number): number {
  if (sorted.length === 0 || totalW === 0) return 0;
  const target = p * totalW;
  let acc = 0;
  for (const item of sorted) {
    acc += item.w;
    if (acc >= target) return item.value;
  }
  return sorted[sorted.length - 1]!.value;
}

interface RunningStats {
  sumW: number;
  sumWX: number;
  sumWX2: number;
  values: { value: number; w: number }[];
}

function newStats(): RunningStats { return { sumW: 0, sumWX: 0, sumWX2: 0, values: [] }; }
function addStat(s: RunningStats, x: number, w: number) {
  s.sumW += w;
  s.sumWX += w * x;
  s.sumWX2 += w * x * x;
  s.values.push({ value: x, w });
}
function statsSummary(s: RunningStats): { mean: number; sd: number; p10: number; p25: number; p50: number; p75: number; p90: number } {
  if (s.sumW === 0) return { mean: 0, sd: 0, p10: 0, p25: 0, p50: 0, p75: 0, p90: 0 };
  const mean = s.sumWX / s.sumW;
  const variance = Math.max(0, s.sumWX2 / s.sumW - mean * mean);
  const sd = Math.sqrt(variance);
  s.values.sort((a, b) => a.value - b.value);
  return {
    mean, sd,
    p10: weightedPercentile(s.values, s.sumW, 0.10),
    p25: weightedPercentile(s.values, s.sumW, 0.25),
    p50: weightedPercentile(s.values, s.sumW, 0.50),
    p75: weightedPercentile(s.values, s.sumW, 0.75),
    p90: weightedPercentile(s.values, s.sumW, 0.90),
  };
}

// ─── Main ────────────────────────────────────────────────────────────────

export async function runCycleBacktest(
  year: number,
  benchmarks: Record<string, any>,
  opts: CycleBacktestOptions = {}
): Promise<CycleBacktestResult> {
  const filePath = opts.filePath ?? DEFAULT_FILE_PATHS[year];
  if (!filePath) throw new Error(`No default file path for year ${year}`);

  const ctx = getContext(year);
  if (!ctx) throw new Error(`No election context for year ${year}`);
  const election = ELECTIONS.find(e => e.year === year);
  if (!election) throw new Error(`No election data for year ${year}`);
  const candidates = election.candidates;

  const loaderOpts: LoaderOptions = {
    filePath,
    year,
    keepRawVarPayload: true,
    ...(opts.rowLimit != null ? { rowLimit: opts.rowLimit } : {}),
  };

  const { respondents } = await loadSurveyRespondents(loaderOpts);

  // Aggregators.
  const weightedCounts: Record<Bucket, number> = { D: 0, R: 0, T: 0, O: 0, Abstain: 0 };
  let totalWeight = 0;

  const perNodeCov: Record<string, { realSignal: number; fallback: number; total: number }> = {};
  const perBoundaryCov: Record<string, { realSignal: number; fallback: number; total: number }> = {};
  const engagementCov = { realSignal: 0, fallback: 0 };

  const contStats: Record<string, { pos: RunningStats; sal: RunningStats }> = {};
  for (const id of CONTINUOUS_NODES) {
    contStats[id] = { pos: newStats(), sal: newStats() };
    perNodeCov[id] = { realSignal: 0, fallback: 0, total: 0 };
  }
  for (const id of CATEGORICAL_NODES) perNodeCov[id] = { realSignal: 0, fallback: 0, total: 0 };
  for (const b of BOUNDARIES) perBoundaryCov[b] = { realSignal: 0, fallback: 0, total: 0 };

  const catSums: Record<string, { dist: number[]; sal: RunningStats; sumW: number }> = {};
  for (const id of CATEGORICAL_NODES) catSums[id] = { dist: [0,0,0,0,0,0], sal: newStats(), sumW: 0 };

  const boundarySalSums: Record<string, RunningStats> = {};
  for (const b of BOUNDARIES) boundarySalSums[b] = newStats();
  const intensityStats = newStats();

  const engBuckets = { apolitical: 0, casual: 0, engaged: 0, "highly-engaged": 0 };
  const engStats = newStats();

  const archetypeWeights: Record<string, number> = {};

  for (const r of respondents) {
    const sig = mapSurveyToPrism(r);
    const nodeSig = signatureToNodeSig(sig);
    const morState = morStateFromMapper(sig);
    const engLevel = engagementLevelFromValue(sig.engagement.value);
    const dominant = dominantContinuousNode(nodeSig);

    const partyID = partyIDFromPid7(r.rawVarPayload["pid7"]);
    const prediction = predictVote(
      nodeSig,
      candidates,
      ctx,
      engLevel,
      partyID,                  // pid7 → PartyID; activates partisan-loyalty multiplier
      null,                     // anchorDist
      null,                     // negativeParties
      false,                    // strategicVoting
      dominant,
      morState,
    );

    const w = r.weight;
    totalWeight += w;
    if (opts.turnoutModel) {
      // Phase B' — demographic turnout model gates abstention via expected
      // value. predictVote.decision (engagement-based) is intentionally
      // overridden here; the engagement signal leaked validated turnout in
      // 2008 and was uncalibrated otherwise. See `turnout-calibration-audit`.
      const tp = predictTurnoutProbability(r.demographics, r.year, opts.turnoutModel);
      const bucket = partyBucket(prediction.nearest.party);
      weightedCounts[bucket] += w * tp.probability;
      weightedCounts.Abstain += w * (1 - tp.probability);
    } else if (prediction.decision === "abstain") {
      weightedCounts.Abstain += w;
    } else {
      const bucket = partyBucket(prediction.nearest.party);
      weightedCounts[bucket] += w;
    }

    // Coverage tallies.
    for (const id of CONTINUOUS_NODES) {
      const ns = sig[id];
      perNodeCov[id]!.total++;
      if (ns.provenance.source === "real_signal") perNodeCov[id]!.realSignal++;
      else perNodeCov[id]!.fallback++;
    }
    for (const id of CATEGORICAL_NODES) {
      const ns = sig[id];
      perNodeCov[id]!.total++;
      if (ns.provenance.source === "real_signal") perNodeCov[id]!.realSignal++;
      else perNodeCov[id]!.fallback++;
    }
    for (const b of BOUNDARIES) {
      const e = sig.moralBoundaries[b];
      perBoundaryCov[b]!.total++;
      if (e.provenance.source === "real_signal") perBoundaryCov[b]!.realSignal++;
      else perBoundaryCov[b]!.fallback++;
    }
    if (sig.engagement.provenance.source === "real_signal") engagementCov.realSignal++;
    else engagementCov.fallback++;

    // Per-node weighted stats.
    for (const id of CONTINUOUS_NODES) {
      const e = nodeSig[id as ContinuousNodeId]!;
      addStat(contStats[id]!.pos, e.pos, w);
      addStat(contStats[id]!.sal, e.sal, w);
    }
    for (const id of CATEGORICAL_NODES) {
      const ns = sig[id];
      const dist = ns.catDistribution;
      const acc = catSums[id]!;
      for (let i = 0; i < 6; i++) acc.dist[i] += dist[i] * w;
      acc.sumW += w;
      addStat(acc.sal, expectedSal4(ns.salPosterior), w);
    }
    for (const b of BOUNDARIES) {
      addStat(boundarySalSums[b]!, sig.moralBoundaries[b].salience, w);
    }
    addStat(intensityStats, sig.moralBoundaries.intensity, w);

    engBuckets[engLevel] += w;
    addStat(engStats, sig.engagement.value, w);

    // Nearest-archetype.
    const arcId = nearestArchetypeId(nodeSig);
    if (arcId) archetypeWeights[arcId] = (archetypeWeights[arcId] ?? 0) + w;
  }

  // Build result.
  const sharesElec: Record<Bucket, number> = { D: 0, R: 0, T: 0, O: 0, Abstain: 0 };
  if (totalWeight > 0) {
    for (const k of ["D","R","T","O","Abstain"] as Bucket[]) {
      sharesElec[k] = weightedCounts[k] / totalWeight;
    }
  }
  const voterW = weightedCounts.D + weightedCounts.R + weightedCounts.T + weightedCounts.O;
  const sharesVote: Record<Party, number> = { D: 0, R: 0, T: 0, O: 0 };
  if (voterW > 0) {
    for (const k of ["D","R","T","O"] as Party[]) {
      sharesVote[k] = weightedCounts[k] / voterW;
    }
  }

  const benchYear = benchmarks?.years?.[String(year)] ?? {};
  const actualSharesElec = {
    D: benchYear.d_share_of_vep ?? 0,
    R: benchYear.r_share_of_vep ?? 0,
    Other: benchYear.other_share_of_vep ?? 0,
    Abstain: benchYear.abstain_share_of_vep ?? 0,
  };
  const actualSharesVote = {
    D: benchYear.d_share_of_total ?? 0,
    R: benchYear.r_share_of_total ?? 0,
    Other: 1 - (benchYear.d_share_of_total ?? 0) - (benchYear.r_share_of_total ?? 0),
  };

  const predOtherVoters = sharesVote.T + sharesVote.O;
  const predOtherElec = sharesElec.T + sharesElec.O;
  const gapVoters = {
    D: sharesVote.D - actualSharesVote.D,
    R: sharesVote.R - actualSharesVote.R,
    Other: predOtherVoters - actualSharesVote.Other,
    absMean: 0,
  };
  gapVoters.absMean = (Math.abs(gapVoters.D) + Math.abs(gapVoters.R) + Math.abs(gapVoters.Other)) / 3;
  const gapElec = {
    D: sharesElec.D - actualSharesElec.D,
    R: sharesElec.R - actualSharesElec.R,
    Other: predOtherElec - actualSharesElec.Other,
    Abstain: sharesElec.Abstain - actualSharesElec.Abstain,
    absMean: 0,
  };
  gapElec.absMean = (Math.abs(gapElec.D) + Math.abs(gapElec.R) + Math.abs(gapElec.Other) + Math.abs(gapElec.Abstain)) / 4;

  // Continuous marginals.
  const continuousMarginals: CycleBacktestResult["continuousMarginals"] = {};
  for (const id of CONTINUOUS_NODES) {
    const sp = statsSummary(contStats[id]!.pos);
    const ss = statsSummary(contStats[id]!.sal);
    continuousMarginals[id] = {
      posMean: sp.mean,
      posSd: sp.sd,
      posP10: sp.p10, posP25: sp.p25, posP50: sp.p50, posP75: sp.p75, posP90: sp.p90,
      salMean: ss.mean,
    };
  }
  const categoricalMarginals: CycleBacktestResult["categoricalMarginals"] = {};
  for (const id of CATEGORICAL_NODES) {
    const acc = catSums[id]!;
    const dist = acc.sumW > 0 ? acc.dist.map(x => x / acc.sumW) : [0,0,0,0,0,0];
    const sal = statsSummary(acc.sal);
    categoricalMarginals[id] = { distribution: dist, salMean: sal.mean };
  }
  const boundaryMarginals: CycleBacktestResult["boundaryMarginals"] = {};
  for (const b of BOUNDARIES) {
    boundaryMarginals[b] = { salMean: statsSummary(boundarySalSums[b]!).mean };
  }

  // Top archetypes.
  const sortedArc = Object.entries(archetypeWeights).sort((a, b) => b[1] - a[1]).slice(0, 15);
  const topArchetypes = sortedArc.map(([id, w]) => {
    const arc = ARCHETYPES.find(a => a.id === id);
    return {
      id,
      name: arc?.name ?? id,
      weight: w,
      share: totalWeight > 0 ? w / totalWeight : 0,
    };
  });

  const dCand = candidates.find(c => partyBucket(c.party) === "D")?.name ?? null;
  const rCand = candidates.find(c => partyBucket(c.party) === "R")?.name ?? null;

  return {
    year,
    rowsProcessed: respondents.length,
    totalWeight,
    predicted: {
      weightedCounts,
      sharesOfElectorate: sharesElec,
      sharesOfVoters: sharesVote,
    },
    actual: {
      sharesOfElectorate: actualSharesElec,
      sharesOfVoters: actualSharesVote,
      candidates: { d: dCand, r: rCand },
    },
    gaps: {
      sharesOfVoters: gapVoters,
      sharesOfElectorate: gapElec,
    },
    coverage: {
      perNode: perNodeCov,
      perBoundary: perBoundaryCov,
      engagement: engagementCov,
    },
    continuousMarginals,
    categoricalMarginals,
    boundaryMarginals,
    intensityMean: statsSummary(intensityStats).mean,
    engagement: {
      apolitical: totalWeight > 0 ? engBuckets.apolitical / totalWeight : 0,
      casual: totalWeight > 0 ? engBuckets.casual / totalWeight : 0,
      engaged: totalWeight > 0 ? engBuckets.engaged / totalWeight : 0,
      highly_engaged: totalWeight > 0 ? engBuckets["highly-engaged"] / totalWeight : 0,
      mean: statsSummary(engStats).mean,
    },
    topArchetypes,
  };
}
