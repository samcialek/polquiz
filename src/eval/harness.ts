// Extended simulation harness.
//
// The deterministic path (noiseSigma=0) is intentionally byte-identical to
// src/test/simulation.ts so the existing file serves as a regression baseline.
// The generate* helpers below are copied verbatim from simulation.ts rather
// than imported, because simulation.ts keeps them local. simulation.ts is
// not modified.

import type {
  Archetype,
  ContinuousNodeId,
  CategoricalNodeId,
  ContinuousPosDist,
  SalienceDist,
  CategoricalDist,
  QuestionDef,
  QuestionUiType,
  RespondentState,
  OptionEvidence,
  AllocationBucketMap,
  RankingItemMap,
  PairOptionMap,
  TrbAnchorDist,
} from "../types.js";
import { CONTINUOUS_NODES, CATEGORICAL_NODES } from "../config/nodes.js";
import {
  applySingleChoiceAnswer,
  applySliderAnswer,
  applyAllocationAnswer,
  applyRankingAnswer,
  applyPairwiseAnswer,
} from "../engine/update.js";
import { selectNextQuestion, isQuestionEligible } from "../engine/nextQuestion.js";
import { shouldStop, resetSimilarityCache } from "../engine/stopRule.js";
import { archetypeDistance } from "../engine/archetypeDistance.js";
import { buildArchetypeFamilies, type ArchetypeFamilyIndex } from "../engine/archetypeFamilies.js";

import { createRng } from "./rng.js";
import { jitterArchetype } from "./noise.js";

// ---------------------------------------------------------------------------
// State init — Phase 3 distance-based variant
// ---------------------------------------------------------------------------
function createInitialState(): RespondentState {
  const continuous = {} as RespondentState["continuous"];
  for (const nodeId of CONTINUOUS_NODES) {
    continuous[nodeId] = {
      posDist: [0.2, 0.2, 0.2, 0.2, 0.2] as ContinuousPosDist,
      salDist: [0.25, 0.25, 0.25, 0.25] as SalienceDist,
      touches: 0,
      touchTypes: new Set<string>(),
      status: "unknown",
    };
  }
  const categorical = {} as RespondentState["categorical"];
  for (const nodeId of CATEGORICAL_NODES) {
    categorical[nodeId] = {
      catDist: [1 / 6, 1 / 6, 1 / 6, 1 / 6, 1 / 6, 1 / 6] as CategoricalDist,
      salDist: [0.25, 0.25, 0.25, 0.25] as SalienceDist,
      touches: 0,
      touchTypes: new Set<string>(),
      status: "unknown",
    };
  }
  return {
    answers: {},
    continuous,
    categorical,
    trbAnchor: {
      dist: [1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9] as TrbAnchorDist,
      touches: 0,
    },
    archetypeDistances: {},
    currentLeader: undefined,
    consecutiveLeadCount: 0,
  };
}

// ---------------------------------------------------------------------------
// Answer generation — copy of simulation.ts:generate* + score* helpers
// ---------------------------------------------------------------------------
function scoreOptionEvidence(archetype: Archetype, evidence: OptionEvidence | undefined): number {
  if (!evidence) return 1;
  let score = 0, count = 0;
  if (evidence.continuous) {
    for (const [nodeId, upd] of Object.entries(evidence.continuous)) {
      const template = archetype.nodes[nodeId as ContinuousNodeId];
      if (!template || template.kind !== "continuous") continue;
      if (upd?.pos) { score += upd.pos[template.pos - 1] ?? 0; count++; }
      if (upd?.sal) { score += (upd.sal[template.sal] ?? 0) * 0.5; count += 0.5; }
    }
  }
  if (evidence.categorical) {
    for (const [nodeId, upd] of Object.entries(evidence.categorical)) {
      const template = archetype.nodes[nodeId as CategoricalNodeId];
      if (!template || template.kind !== "categorical") continue;
      if (upd?.cat) {
        let dot = 0;
        for (let i = 0; i < 6; i++) dot += (template.probs[i] ?? 0) * (upd.cat[i] ?? 0);
        score += dot; count++;
      }
      if (upd?.sal) { score += (upd.sal[template.sal] ?? 0) * 0.5; count += 0.5; }
    }
  }
  return count > 0 ? score / count : 0;
}

function scoreAllocationBucket(archetype: Archetype, bucket: AllocationBucketMap): number {
  let score = 0, count = 0;
  if (bucket.continuous) {
    for (const [nodeId, signal] of Object.entries(bucket.continuous)) {
      const template = archetype.nodes[nodeId as ContinuousNodeId];
      if (!template || template.kind !== "continuous") continue;
      const desiredDirection = (template.pos - 3) / 2;
      score += desiredDirection * (signal ?? 0);
      count++;
    }
  }
  if (bucket.categorical) {
    for (const [nodeId, catDist] of Object.entries(bucket.categorical)) {
      const template = archetype.nodes[nodeId as CategoricalNodeId];
      if (!template || template.kind !== "categorical") continue;
      let dot = 0;
      for (let i = 0; i < 6; i++) dot += (template.probs[i] ?? 0) * (catDist[i] ?? 0);
      score += dot; count++;
    }
  }
  return count > 0 ? score / count : 0;
}

function scoreRankingItem(archetype: Archetype, item: RankingItemMap): number {
  let score = 0, count = 0;
  if (item.continuous) {
    for (const [nodeId, signal] of Object.entries(item.continuous)) {
      const template = archetype.nodes[nodeId as ContinuousNodeId];
      if (!template || template.kind !== "continuous") continue;
      const desiredDirection = (template.pos - 3) / 2;
      score += desiredDirection * (signal ?? 0);
      count++;
    }
  }
  if (item.categorical) {
    for (const [nodeId, catDist] of Object.entries(item.categorical)) {
      const template = archetype.nodes[nodeId as CategoricalNodeId];
      if (!template || template.kind !== "categorical") continue;
      let dot = 0;
      for (let i = 0; i < 6; i++) dot += (template.probs[i] ?? 0) * (catDist[i] ?? 0);
      score += dot; count++;
    }
  }
  return count > 0 ? score / count : 0;
}

function scorePairOption(archetype: Archetype, map: PairOptionMap): number {
  let score = 0, count = 0;
  if (map.continuous) {
    for (const [nodeId, signal] of Object.entries(map.continuous)) {
      const template = archetype.nodes[nodeId as ContinuousNodeId];
      if (!template || template.kind !== "continuous") continue;
      const desiredDirection = (template.pos - 3) / 2;
      score += desiredDirection * (signal ?? 0);
      count++;
    }
  }
  if (map.categorical) {
    for (const [nodeId, catDist] of Object.entries(map.categorical)) {
      const template = archetype.nodes[nodeId as CategoricalNodeId];
      if (!template || template.kind !== "categorical") continue;
      let dot = 0;
      for (let i = 0; i < 6; i++) dot += (template.probs[i] ?? 0) * (catDist[i] ?? 0);
      score += dot; count++;
    }
  }
  return count > 0 ? score / count : 0;
}

type Apply = { apply: () => void } | null;

function generateSingleChoice(a: Archetype, q: QuestionDef, s: RespondentState): Apply {
  if (!q.optionEvidence) return null;
  const options = Object.keys(q.optionEvidence);
  if (!options.length) return null;
  let best = options[0]!, bestScore = -Infinity;
  for (const opt of options) {
    const score = scoreOptionEvidence(a, q.optionEvidence[opt]);
    if (score > bestScore) { bestScore = score; best = opt; }
  }
  return { apply: () => applySingleChoiceAnswer(s, q, best) };
}

function generateSlider(a: Archetype, q: QuestionDef, s: RespondentState): Apply {
  if (!q.sliderMap) return null;
  const buckets = Object.keys(q.sliderMap);
  if (!buckets.length) return null;
  let best = buckets[0]!, bestScore = -Infinity;
  for (const b of buckets) {
    const score = scoreOptionEvidence(a, q.sliderMap[b]);
    if (score > bestScore) { bestScore = score; best = b; }
  }
  const parts = best.split("-").map(Number);
  const midpoint = Math.round(((parts[0] ?? 0) + (parts[1] ?? 100)) / 2);
  return { apply: () => applySliderAnswer(s, q, midpoint) };
}

function generateAllocation(a: Archetype, q: QuestionDef, s: RespondentState): Apply {
  if (!q.allocationMap) return null;
  const names = Object.keys(q.allocationMap);
  if (!names.length) return null;
  const scores: Record<string, number> = {};
  for (const n of names) scores[n] = scoreAllocationBucket(a, q.allocationMap[n]!);
  const minScore = Math.min(...Object.values(scores));
  const shifted: Record<string, number> = {};
  for (const n of names) shifted[n] = Math.exp((scores[n]! - minScore) * 2);
  const total = Object.values(shifted).reduce((x, y) => x + y, 0);
  const allocation: Record<string, number> = {};
  for (const n of names) allocation[n] = Math.round((shifted[n]! / total) * 100);
  const allocTotal = Object.values(allocation).reduce((x, y) => x + y, 0);
  if (allocTotal !== 100) {
    const maxKey = names.reduce((x, y) => allocation[x]! > allocation[y]! ? x : y);
    allocation[maxKey] = allocation[maxKey]! + (100 - allocTotal);
  }
  return { apply: () => applyAllocationAnswer(s, q, allocation) };
}

function generateRanking(a: Archetype, q: QuestionDef, s: RespondentState): Apply {
  if (!q.rankingMap) return null;
  const items = Object.keys(q.rankingMap);
  if (!items.length) return null;
  const scored = items.map(i => ({ i, score: scoreRankingItem(a, q.rankingMap![i]!) }));
  scored.sort((x, y) => y.score - x.score);
  const ranking = scored.map(x => x.i);
  return { apply: () => applyRankingAnswer(s, q, ranking) };
}

function generatePairwise(a: Archetype, q: QuestionDef, s: RespondentState): Apply {
  if (!q.pairMaps) return null;
  const answers: Record<string, string> = {};
  for (const [pairId, options] of Object.entries(q.pairMaps)) {
    let bestChoice = "", bestScore = -Infinity;
    for (const [choice, map] of Object.entries(options)) {
      const score = scorePairOption(a, map);
      if (score > bestScore) { bestScore = score; bestChoice = choice; }
    }
    if (bestChoice) answers[pairId] = bestChoice;
  }
  if (!Object.keys(answers).length) return null;
  return { apply: () => applyPairwiseAnswer(s, q, answers) };
}

function generateBestWorst(a: Archetype, q: QuestionDef, s: RespondentState): Apply {
  if (!q.bestWorstMap) return generateRanking(a, q, s);
  const items = Object.keys(q.bestWorstMap);
  if (!items.length) return null;
  const scored = items.map(i => ({ i, score: scoreRankingItem(a, q.bestWorstMap![i]!) }));
  scored.sort((x, y) => y.score - x.score);
  const ranking = scored.map(x => x.i);
  return { apply: () => applyRankingAnswer(s, q, ranking) };
}

function generateMulti(a: Archetype, q: QuestionDef, s: RespondentState): Apply {
  if (!q.optionEvidence) return null;
  const options = Object.keys(q.optionEvidence);
  if (!options.length) return null;
  const scored = options.map(o => ({ o, score: scoreOptionEvidence(a, q.optionEvidence![o]) }));
  scored.sort((x, y) => y.score - x.score);
  return { apply: () => applySingleChoiceAnswer(s, q, scored[0]!.o) };
}

function generateAnswer(a: Archetype, q: QuestionDef, s: RespondentState): Apply {
  switch (q.uiType) {
    case "single_choice": return generateSingleChoice(a, q, s);
    case "slider": return generateSlider(a, q, s);
    case "allocation": return generateAllocation(a, q, s);
    case "ranking": return generateRanking(a, q, s);
    case "pairwise": return generatePairwise(a, q, s);
    case "best_worst": return generateBestWorst(a, q, s);
    case "multi": return generateMulti(a, q, s);
    default: return null;
  }
}

// ---------------------------------------------------------------------------
// Distance update — Phase 3 Euclidean WTA scorer (no temperature, no priors)
// ---------------------------------------------------------------------------
function updateDistances(state: RespondentState, archetypes: Archetype[]): void {
  let leaderId: string | undefined;
  let leaderDist = Infinity;
  for (const a of archetypes) {
    const d = archetypeDistance(state, a);
    state.archetypeDistances[a.id] = d;
    if (d < leaderDist) {
      leaderDist = d;
      leaderId = a.id;
    }
  }
  if (leaderId === state.currentLeader) {
    state.consecutiveLeadCount = (state.consecutiveLeadCount ?? 0) + 1;
  } else {
    state.currentLeader = leaderId;
    state.consecutiveLeadCount = 1;
  }
}

// ---------------------------------------------------------------------------
// Stop-rule diagnostic — distance-based attribution (mirrors plan §4 thresholds).
// Reports which OR-ed condition fired. Multiple may fire; returns "+"-joined list.
// Thresholds are placeholders pending Stage 4 calibration; harness is NOT
// authoritative for stop semantics — production gate is shouldStop(state, archetypes).
// ---------------------------------------------------------------------------
function determineStopFired(
  state: RespondentState,
  archetypes: Archetype[],
  questionsAnswered: number
): string {
  if (questionsAnswered >= 55) return "hardCap";
  if (!shouldStop(state, archetypes)) return "none";

  const entries = Object.entries(state.archetypeDistances)
    .filter(([, d]) => Number.isFinite(d))
    .sort((a, b) => a[1] - b[1]);
  const dLeader = entries[0]?.[1] ?? Infinity;
  const dSecond = entries[1]?.[1] ?? Infinity;
  const gapRatio = dLeader > 0 && Number.isFinite(dSecond) ? (dSecond - dLeader) / dLeader : 0;
  const cc = state.consecutiveLeadCount ?? 0;
  const fired: string[] = [];

  if (questionsAnswered >= 20 && dLeader <= 6.0 && gapRatio >= 0.25 && cc >= 8) fired.push("ultraConf");
  if (questionsAnswered >= 45 && dLeader <= 12.0 && gapRatio >= 0.03 && cc >= 4) fired.push("lateGame");
  if (questionsAnswered >= 35 && dLeader <= 10.0 && gapRatio >= 0.05 && cc >= 6) fired.push("secondary");
  if (questionsAnswered >= 25 && dLeader <= 8.0 && gapRatio >= 0.10 && cc >= 3) fired.push("primary");

  return fired.length ? fired.join("+") : "other";
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------
// Node-state trajectory capture (supplementary Step 5 run).
// All distribution arrays are rounded to 6 decimals at capture time.
export interface NodeFinalSnapshot {
  continuous: Record<string, { posDist: number[]; salDist: number[]; touches: number }>;
  categorical: Record<string, { catDist: number[]; salDist: number[]; touches: number }>;
  trbAnchor: { dist: number[]; touches: number };
}

export interface NodeDelta {
  nodeId: string;
  kind: "continuous" | "categorical" | "anchor";
  posBefore?: number[];
  posAfter?: number[];
  catBefore?: number[];
  catAfter?: number[];
  salBefore?: number[];
  salAfter?: number[];
  anchorBefore?: number[];
  anchorAfter?: number[];
}

export interface QuestionTrajectory {
  qIdx: number;
  questionId: number;
  uiType: QuestionUiType;
  touchedNodes: NodeDelta[];
}

export interface SimOpts {
  noiseSigma: number;
  seed: number;
  maxQuestions: number;
  captureDistances: boolean;
  captureNodeStates: boolean;
}

export interface SimRun {
  archetypeId: string;
  archetypeName: string;
  noiseSigma: number;
  seed: number;
  resultId: string;
  resultName: string;
  correct: boolean;
  questionsAnswered: number;
  /** Lower = better match. Replaces the pre-Phase-3 `topPosterior`. */
  leaderDistance: number;
  /** (d_second - d_leader) / d_leader. Replaces the pre-Phase-3 posterior `margin`. */
  gapRatio: number;
  rank: number;
  top5: string[];
  stopFired: string;
  /** Detected via the pre-computed family index (runner-up ∈ leader's family set). */
  familyPairDetected: { top1: string; top2: string } | null;
  distancesFinal?: Record<string, number>;
  nodeTrajectory?: QuestionTrajectory[];
  nodeFinalState?: NodeFinalSnapshot;
}

// ---------------------------------------------------------------------------
// Node-state snapshot/diff helpers (used only when captureNodeStates=true).
// Kept at module scope so they don't allocate unless invoked.
// ---------------------------------------------------------------------------
interface RawSnapshot {
  continuous: Record<string, { posDist: number[]; salDist: number[]; touches: number }>;
  categorical: Record<string, { catDist: number[]; salDist: number[]; touches: number }>;
  trbAnchor: { dist: number[]; touches: number };
}

function snapshotNodes(state: RespondentState): RawSnapshot {
  const cont: RawSnapshot["continuous"] = {};
  for (const nodeId of CONTINUOUS_NODES) {
    const n = state.continuous[nodeId];
    cont[nodeId] = {
      posDist: [...n.posDist],
      salDist: [...n.salDist],
      touches: n.touches,
    };
  }
  const cat: RawSnapshot["categorical"] = {};
  for (const nodeId of CATEGORICAL_NODES) {
    const n = state.categorical[nodeId];
    cat[nodeId] = {
      catDist: [...n.catDist],
      salDist: [...n.salDist],
      touches: n.touches,
    };
  }
  return {
    continuous: cont,
    categorical: cat,
    trbAnchor: { dist: [...state.trbAnchor.dist], touches: state.trbAnchor.touches },
  };
}

function round6(arr: number[]): number[] {
  return arr.map(x => Math.round(x * 1e6) / 1e6);
}

function arrChanged(a: number[], b: number[]): boolean {
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return true;
  return false;
}

function diffSnapshots(before: RawSnapshot, after: RawSnapshot): NodeDelta[] {
  const deltas: NodeDelta[] = [];
  for (const nodeId of CONTINUOUS_NODES) {
    const bf = before.continuous[nodeId]!;
    const af = after.continuous[nodeId]!;
    const posChanged = arrChanged(bf.posDist, af.posDist);
    const salChanged = arrChanged(bf.salDist, af.salDist);
    if (posChanged || salChanged) {
      const d: NodeDelta = { nodeId, kind: "continuous" };
      if (posChanged) { d.posBefore = round6(bf.posDist); d.posAfter = round6(af.posDist); }
      if (salChanged) { d.salBefore = round6(bf.salDist); d.salAfter = round6(af.salDist); }
      deltas.push(d);
    }
  }
  for (const nodeId of CATEGORICAL_NODES) {
    const bf = before.categorical[nodeId]!;
    const af = after.categorical[nodeId]!;
    const catChanged = arrChanged(bf.catDist, af.catDist);
    const salChanged = arrChanged(bf.salDist, af.salDist);
    if (catChanged || salChanged) {
      const d: NodeDelta = { nodeId, kind: "categorical" };
      if (catChanged) { d.catBefore = round6(bf.catDist); d.catAfter = round6(af.catDist); }
      if (salChanged) { d.salBefore = round6(bf.salDist); d.salAfter = round6(af.salDist); }
      deltas.push(d);
    }
  }
  if (arrChanged(before.trbAnchor.dist, after.trbAnchor.dist)) {
    deltas.push({
      nodeId: "TRB_ANCHOR",
      kind: "anchor",
      anchorBefore: round6(before.trbAnchor.dist),
      anchorAfter: round6(after.trbAnchor.dist),
    });
  }
  return deltas;
}

function finalSnapshot(state: RespondentState): NodeFinalSnapshot {
  const raw = snapshotNodes(state);
  const continuous: NodeFinalSnapshot["continuous"] = {};
  for (const [k, v] of Object.entries(raw.continuous)) {
    continuous[k] = { posDist: round6(v.posDist), salDist: round6(v.salDist), touches: v.touches };
  }
  const categorical: NodeFinalSnapshot["categorical"] = {};
  for (const [k, v] of Object.entries(raw.categorical)) {
    categorical[k] = { catDist: round6(v.catDist), salDist: round6(v.salDist), touches: v.touches };
  }
  return {
    continuous,
    categorical,
    trbAnchor: { dist: round6(raw.trbAnchor.dist), touches: raw.trbAnchor.touches },
  };
}

// Cached family-index keyed by archetype-array identity. Cheap to rebuild
// (~14k pair distances on 121 archetypes), but identity-keyed cache means
// repeated simulateOne calls with the same archetype array reuse it.
let _familyIndexCache: { archetypes: Archetype[]; index: ArchetypeFamilyIndex } | null = null;
function getFamilyIndex(archetypes: Archetype[]): ArchetypeFamilyIndex {
  if (_familyIndexCache && _familyIndexCache.archetypes === archetypes) {
    return _familyIndexCache.index;
  }
  const index = buildArchetypeFamilies(archetypes);
  _familyIndexCache = { archetypes, index };
  return index;
}

export function simulateOne(
  target: Archetype,
  archetypes: Archetype[],
  questions: QuestionDef[],
  opts: Partial<SimOpts> = {}
): SimRun {
  const noiseSigma = opts.noiseSigma ?? 0;
  const seed = opts.seed ?? 0;
  const maxQuestions = opts.maxQuestions ?? 65;
  const captureDistances = opts.captureDistances ?? false;
  const captureNodeStates = opts.captureNodeStates ?? false;

  resetSimilarityCache();
  const rng = createRng(seed);
  const simulatedProfile = noiseSigma > 0 ? jitterArchetype(target, noiseSigma, rng) : target;

  const activeArchetypes = archetypes.filter(a => a.active !== false);
  const familyIndex = getFamilyIndex(archetypes);

  const state = createInitialState();
  const answeredIds = new Set<number>();
  let questionsAnswered = 0;
  const trajectory: QuestionTrajectory[] = [];

  for (let i = 0; i < maxQuestions; i++) {
    const available = questions.filter(
      q => !answeredIds.has(q.id) && q.touchProfile.length > 0 && isQuestionEligible(state, q)
    );
    const nextQ = selectNextQuestion(state, available, activeArchetypes);
    if (!nextQ) break;
    const answer = generateAnswer(simulatedProfile, nextQ, state);
    if (answer) {
      const before = captureNodeStates ? snapshotNodes(state) : null;
      answer.apply();
      if (captureNodeStates && before) {
        const after = snapshotNodes(state);
        trajectory.push({
          qIdx: questionsAnswered,
          questionId: nextQ.id,
          uiType: nextQ.uiType,
          touchedNodes: diffSnapshots(before, after),
        });
      }
      answeredIds.add(nextQ.id);
      questionsAnswered++;
      updateDistances(state, activeArchetypes);
      if (questionsAnswered >= 25 && shouldStop(state, activeArchetypes)) break;
    } else {
      answeredIds.add(nextQ.id);
    }
  }
  updateDistances(state, activeArchetypes);

  const sorted = Object.entries(state.archetypeDistances)
    .filter(([, d]) => Number.isFinite(d))
    .sort((a, b) => a[1] - b[1]);
  const topId = sorted[0]?.[0] ?? "";
  const secondId = sorted[1]?.[0] ?? "";
  const leaderDistance = sorted[0]?.[1] ?? Infinity;
  const secondDistance = sorted[1]?.[1] ?? Infinity;
  const topArchetype = archetypes.find(a => a.id === topId);
  const rank = sorted.findIndex(([id]) => id === target.id) + 1;
  const top5 = sorted.slice(0, 5).map(([id]) => {
    const a = archetypes.find(x => x.id === id);
    return `${id}:${a?.name ?? "?"}`;
  });
  const gapRatio = Number.isFinite(leaderDistance) && leaderDistance > 0 && Number.isFinite(secondDistance)
    ? (secondDistance - leaderDistance) / leaderDistance
    : 0;
  const familyPairDetected = topId && secondId && familyIndex.familyOf[topId]?.has(secondId)
    ? { top1: topId, top2: secondId }
    : null;

  return {
    archetypeId: target.id,
    archetypeName: target.name,
    noiseSigma,
    seed,
    resultId: topId,
    resultName: topArchetype?.name ?? "?",
    correct: topId === target.id,
    questionsAnswered,
    leaderDistance,
    gapRatio,
    rank,
    top5,
    stopFired: determineStopFired(state, activeArchetypes, questionsAnswered),
    familyPairDetected,
    ...(captureDistances ? { distancesFinal: { ...state.archetypeDistances } } : {}),
    ...(captureNodeStates ? {
      nodeTrajectory: trajectory,
      nodeFinalState: finalSnapshot(state),
    } : {}),
  };
}
