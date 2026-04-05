/**
 * PRISM Quiz Engine — Browser API
 *
 * Self-contained browser-facing API that wraps the engine.
 * Bundled as an IIFE and exposed as window.PrismEngine.
 */

import type {
  Archetype,
  ContinuousNodeId,
  CategoricalNodeId,
  ContinuousPosDist,
  SalienceDist,
  CategoricalDist,
  QuestionDef,
  RespondentState,
  TrbAnchorDist,
} from "../types.js";

import { ARCHETYPES } from "../config/archetypes.js";
import { REPRESENTATIVE_QUESTIONS } from "../config/questions.representative.js";
import { CONTINUOUS_NODES, CATEGORICAL_NODES } from "../config/nodes.js";
import {
  applySingleChoiceAnswer,
  applySliderAnswer,
  applyAllocationAnswer,
  applyRankingAnswer,
  applyPairwiseAnswer,
} from "../engine/update.js";
import { multiplyAndNormalize } from "../engine/math.js";
import { selectNextQuestion, isQuestionEligible } from "../engine/nextQuestion.js";
import { shouldStop } from "../engine/stopRule.js";
import { archetypeDistance } from "../engine/archetypeDistance.js";
import { resetSimilarityCache } from "../engine/stopRule.js";
import { FIXED_16 } from "../engine/config.js";
import { resolveIdentityPrimary } from "../identity/resolveIdentityPrimary.js";
import type { IdentityPrimaryDemographics, IdentityPrimaryResult } from "../identity/resolveIdentityPrimary.js";

// ---------------------------------------------------------------------------
// Types exposed to the browser consumer
// ---------------------------------------------------------------------------

export interface QuizQuestion {
  id: number;
  promptShort: string;
  promptFull?: string;
  uiType: string;
  section: string;
  /** Option keys for single_choice / multi questions */
  options?: string[];
  /** Human-readable labels for option keys */
  optionLabels?: Record<string, string>;
  /** Slider config if applicable */
  slider?: { min: number; max: number };
  /** Allocation buckets if applicable */
  allocationBuckets?: string[];
  /** Ranking items if applicable */
  rankingItems?: string[];
  /** Pairwise pair IDs if applicable */
  pairIds?: string[];
  /** Best/worst items if applicable */
  bestWorstItems?: string[];
}

export interface QuizProgress {
  questionsAnswered: number;
  estimatedTotal: number;
  topArchetypes: Array<{ id: string; name: string; posterior: number }>;
  confidence: number;
  phase: "salience" | "discriminate" | "converge";
}

export interface ArchetypeResult {
  id: string;
  name: string;
  tier: string;
  posterior: number;
  distance: number;
}

export interface FamilyResult {
  /** True when the top-2 archetypes are near-neighbors (gap < 3%) */
  isFamily: boolean;
  /** Family label (shared prefix or combined name) */
  familyLabel?: string;
  /** The two archetypes that form the family */
  members?: [ArchetypeResult, ArchetypeResult];
}

export interface QuizResults {
  match: ArchetypeResult;
  top5: ArchetypeResult[];
  questionsAnswered: number;
  confidence: number;
  /** Family/subtype info when top-2 are near-neighbors */
  family?: FamilyResult;
}

export type { IdentityPrimaryDemographics, IdentityPrimaryResult };

// ---------------------------------------------------------------------------
// Internal state
// ---------------------------------------------------------------------------

let _state: RespondentState | null = null;
let _archetypes: Archetype[] = [];
let _questions: QuestionDef[] = [];
let _questionsById: Map<number, QuestionDef> = new Map();
const _ratioBoosts: Map<number, number> = new Map();

function ratioToSalienceDist(ratio: number): SalienceDist {
  if (ratio >= 4) return [0.02, 0.08, 0.30, 0.60];
  if (ratio >= 3) return [0.04, 0.12, 0.34, 0.50];
  if (ratio >= 2) return [0.08, 0.18, 0.34, 0.40];
  return [0.18, 0.28, 0.30, 0.24];
}

function applyStoredRatioBoost(q: QuestionDef): void {
  if (!_state) return;
  const ratio = _ratioBoosts.get(q.id);
  if (!ratio) return;
  const salLikelihood = ratioToSalienceDist(ratio);
  for (const touch of q.touchProfile) {
    if (touch.role !== "salience") continue;
    if (touch.kind === "continuous" && touch.node in _state.continuous) {
      const node = _state.continuous[touch.node as ContinuousNodeId];
      node.salDist = multiplyAndNormalize(node.salDist, salLikelihood);
    } else if (touch.kind === "categorical" && touch.node in _state.categorical) {
      const node = _state.categorical[touch.node as CategoricalNodeId];
      node.salDist = multiplyAndNormalize(node.salDist, salLikelihood);
    }
  }
}

// Snapshot stack for back button (deep copies of state before each answer)
interface Snapshot {
  state: RespondentState;
  questionId: number;
}
const _snapshots: Snapshot[] = [];

function deepCopyState(state: RespondentState): RespondentState {
  const copy: any = {
    answers: { ...state.answers },
    continuous: {} as any,
    categorical: {} as any,
    trbAnchor: {
      dist: [...state.trbAnchor.dist] as TrbAnchorDist,
      touches: state.trbAnchor.touches,
    },
    archetypePosterior: { ...state.archetypePosterior },
    currentLeader: state.currentLeader,
    consecutiveLeadCount: state.consecutiveLeadCount,
  };
  for (const nodeId of CONTINUOUS_NODES) {
    const src = state.continuous[nodeId];
    copy.continuous[nodeId] = {
      posDist: [...src.posDist] as ContinuousPosDist,
      salDist: [...src.salDist] as SalienceDist,
      touches: src.touches,
      touchTypes: new Set(src.touchTypes),
      status: src.status,
    };
  }
  for (const nodeId of CATEGORICAL_NODES) {
    const src = state.categorical[nodeId];
    copy.categorical[nodeId] = {
      catDist: [...src.catDist] as CategoricalDist,
      salDist: [...src.salDist] as SalienceDist,
      touches: src.touches,
      touchTypes: new Set(src.touchTypes),
      status: src.status,
    };
  }
  return copy as RespondentState;
}

// ---------------------------------------------------------------------------
// State initialization (mirrors simulation.ts createInitialState)
// ---------------------------------------------------------------------------

function createInitialState(archetypes: Archetype[]): RespondentState {
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

  const archetypePosterior: Record<string, number> = {};
  for (const a of archetypes) {
    archetypePosterior[a.id] = a.prior;
  }

  return {
    answers: {},
    continuous,
    categorical,
    trbAnchor: {
      dist: [1 / 7, 1 / 7, 1 / 7, 1 / 7, 1 / 7, 1 / 7, 1 / 7] as TrbAnchorDist,
      touches: 0,
    },
    archetypePosterior,
    currentLeader: undefined,
    consecutiveLeadCount: 0,
  };
}

// ---------------------------------------------------------------------------
// Posterior update (mirrors simulation.ts updatePosteriors)
// ---------------------------------------------------------------------------

function updatePosteriors(state: RespondentState, archetypes: Archetype[]): void {
  const nAnswered = Object.keys(state.answers).length;

  const distances: Record<string, number> = {};
  let minDist = Infinity;
  for (const a of archetypes) {
    const dist = archetypeDistance(state, a);
    distances[a.id] = dist;
    if (dist < minDist) minDist = dist;
  }

  // Adaptive temperature: starts warm (0.12), cools to 0.04 by question 40
  const baseTemp = 0.12;
  const minTemp = 0.04;
  const coolRate = Math.min(1.0, nAnswered / 40);
  const temperature = baseTemp - (baseTemp - minTemp) * coolRate;

  let totalLikelihood = 0;
  const likelihoods: Record<string, number> = {};
  for (const a of archetypes) {
    const likelihood = Math.exp(-(distances[a.id]! - minDist) / temperature);
    likelihoods[a.id] = likelihood * a.prior;
    totalLikelihood += likelihoods[a.id]!;
  }

  for (const a of archetypes) {
    state.archetypePosterior[a.id] = totalLikelihood > 0
      ? likelihoods[a.id]! / totalLikelihood
      : a.prior;
  }

  // Update leader tracking
  const entries = Object.entries(state.archetypePosterior)
    .sort((a, b) => b[1] - a[1]);
  const newLeader = entries[0]?.[0];
  if (newLeader === state.currentLeader) {
    state.consecutiveLeadCount = (state.consecutiveLeadCount ?? 0) + 1;
  } else {
    state.currentLeader = newLeader;
    state.consecutiveLeadCount = 1;
  }
}

// ---------------------------------------------------------------------------
// Convert internal QuestionDef to browser-friendly QuizQuestion
// ---------------------------------------------------------------------------

function toQuizQuestion(q: QuestionDef): QuizQuestion {
  const out: QuizQuestion = {
    id: q.id,
    promptShort: q.promptShort,
    promptFull: q.promptFull,
    uiType: q.uiType,
    section: q.section,
  };

  if (q.optionLabels) {
    out.optionLabels = q.optionLabels;
  }

  if (q.optionEvidence) {
    out.options = Object.keys(q.optionEvidence);
  }

  if (q.uiType === "slider") {
    out.slider = { min: 0, max: 100 };
    if (q.sliderMap) {
      const keys = Object.keys(q.sliderMap);
      if (keys.length > 0) {
        const ranges = keys.map(k => k.split("-").map(Number));
        const allMin = Math.min(...ranges.map(r => r[0] ?? 0));
        const allMax = Math.max(...ranges.map(r => r[1] ?? 100));
        out.slider = { min: allMin, max: allMax };
      }
    }
  }

  if (q.allocationMap) {
    out.allocationBuckets = Object.keys(q.allocationMap);
  }

  if (q.rankingMap) {
    out.rankingItems = Object.keys(q.rankingMap);
  }

  if (q.pairMaps) {
    out.pairIds = Object.keys(q.pairMaps);
  }

  if (q.bestWorstMap) {
    out.bestWorstItems = Object.keys(q.bestWorstMap);
  } else if (q.uiType === "best_worst" && q.rankingMap) {
    // Q63 etc. store best_worst items in rankingMap (for applyRankingAnswer)
    out.bestWorstItems = Object.keys(q.rankingMap);
  }

  return out;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Initialize a new quiz session.
 * Resets all state and loads archetypes + questions.
 */
export function initQuiz(): void {
  _archetypes = ARCHETYPES;
  _questions = REPRESENTATIVE_QUESTIONS.filter(q => q.touchProfile.length > 0);
  _questionsById = new Map(_questions.map(q => [q.id, q]));
  resetSimilarityCache();
  _state = createInitialState(_archetypes);
  _snapshots.length = 0; // Clear snapshot history on fresh quiz
  _ratioBoosts.clear();
}

/**
 * Get the next question the engine wants to ask.
 * Returns null if no more questions are available.
 */
export function getNextQuestion(): QuizQuestion | null {
  if (!_state) throw new Error("Call initQuiz() first");

  const nAnswered = Object.keys(_state.answers).length;

  // Phase 1: ask FIXED_16 in order
  if (nAnswered < FIXED_16.length) {
    const nextId = FIXED_16[nAnswered];
    const q = _questionsById.get(nextId!);
    if (q) return toQuizQuestion(q);
  }

  // Adaptive selection
  const available = _questions.filter(
    q => !(q.id in _state!.answers) && isQuestionEligible(_state!, q)
  );
  const next = selectNextQuestion(_state, available, _archetypes);
  return next ? toQuizQuestion(next) : null;
}

/**
 * Submit an answer for a question.
 *
 * @param questionId - The numeric question ID
 * @param answer - The answer value. Type depends on uiType:
 *   - single_choice / multi: string (option key)
 *   - slider: number (raw value)
 *   - allocation: Record<string, number> (bucket → amount)
 *   - ranking: string[] (ordered items, best first)
 *   - pairwise: Record<string, string> (pairId → chosen option)
 *   - best_worst: { best: string; worst: string }
 */
export function submitAnswer(
  questionId: number,
  answer: string | number | string[] | Record<string, number> | Record<string, string> | { best: string; worst: string }
): void {
  if (!_state) throw new Error("Call initQuiz() first");

  // Snapshot current state before applying answer (for back button)
  _snapshots.push({ state: deepCopyState(_state), questionId });

  const q = _questionsById.get(questionId);
  if (!q) throw new Error(`Unknown question ID: ${questionId}`);

  switch (q.uiType) {
    case "single_choice":
    case "multi":
      applySingleChoiceAnswer(_state, q, answer as string);
      applyStoredRatioBoost(q);
      break;

    case "slider":
      applySliderAnswer(_state, q, answer as number);
      break;

    case "allocation":
      applyAllocationAnswer(_state, q, answer as Record<string, number>);
      break;

    case "ranking":
      applyRankingAnswer(_state, q, answer as string[]);
      break;

    case "pairwise":
      applyPairwiseAnswer(_state, q, answer as Record<string, string>);
      break;

    case "best_worst": {
      // Best-worst is treated as a ranking: [best, ...middle, worst]
      const bw = answer as { best: string; worst: string };
      const bwItems = q.bestWorstMap ? Object.keys(q.bestWorstMap)
                    : q.rankingMap   ? Object.keys(q.rankingMap)
                    : [];
      if (bwItems.length > 0) {
        const middle = bwItems.filter(i => i !== bw.best && i !== bw.worst);
        applyRankingAnswer(_state, q, [bw.best, ...middle, bw.worst]);
      }
      break;
    }
  }

  // Update posteriors after each answer
  updatePosteriors(_state, _archetypes);
}

/**
 * Get current quiz progress.
 */
export function getProgress(): QuizProgress {
  if (!_state) throw new Error("Call initQuiz() first");

  const nAnswered = Object.keys(_state.answers).length;

  // Estimate total questions based on current phase
  let estimatedTotal: number;
  if (nAnswered < 16) {
    estimatedTotal = 40; // early estimate
  } else {
    // Refine based on convergence rate
    const topPosterior = Math.max(...Object.values(_state.archetypePosterior));
    if (topPosterior > 0.5) estimatedTotal = Math.max(nAnswered + 3, 30);
    else if (topPosterior > 0.3) estimatedTotal = Math.max(nAnswered + 8, 35);
    else estimatedTotal = Math.max(nAnswered + 15, 45);
  }

  // Top archetypes
  const sorted = Object.entries(_state.archetypePosterior)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const topArchetypes = sorted.map(([id, posterior]) => {
    const arch = _archetypes.find(a => a.id === id);
    return { id, name: arch?.name ?? "Unknown", posterior };
  });

  // Phase
  let phase: QuizProgress["phase"];
  if (nAnswered < 16) phase = "salience";
  else if (nAnswered < 28) phase = "discriminate";
  else phase = "converge";

  return {
    questionsAnswered: nAnswered,
    estimatedTotal,
    topArchetypes,
    confidence: sorted[0]?.[1] ?? 0,
    phase,
  };
}

/**
 * Check whether the engine has enough data to produce a result.
 */
export function isComplete(): boolean {
  if (!_state) return false;
  const nAnswered = Object.keys(_state.answers).length;
  if (nAnswered < 20) return false; // absolute minimum
  return shouldStop(_state, _archetypes);
}

/**
 * Get final quiz results.
 * Can be called at any time, but results are most meaningful after isComplete() returns true.
 */
export function getResults(): QuizResults {
  if (!_state) throw new Error("Call initQuiz() first");

  const sorted = Object.entries(_state.archetypePosterior)
    .sort((a, b) => b[1] - a[1]);

  const top5: ArchetypeResult[] = sorted.slice(0, 5).map(([id, posterior]) => {
    const arch = _archetypes.find(a => a.id === id)!;
    return {
      id,
      name: arch.name,
      tier: arch.tier,
      posterior,
      distance: archetypeDistance(_state!, arch),
    };
  });

  // Detect family/subtype when top-2 are near-neighbors
  let family: FamilyResult | undefined;
  if (top5.length >= 2) {
    const gap = top5[0]!.posterior - top5[1]!.posterior;
    if (gap < 0.03) {
      // Find shared words in names to create a family label
      const words1 = top5[0]!.name.split(/[\s-]+/);
      const words2 = top5[1]!.name.split(/[\s-]+/);
      const shared = words1.filter(w => words2.includes(w) && w.length > 2);
      const familyLabel = shared.length > 0
        ? shared.join(" ") + " Family"
        : `${top5[0]!.name} / ${top5[1]!.name}`;

      family = {
        isFamily: true,
        familyLabel,
        members: [top5[0]!, top5[1]!],
      };
    }
  }

  return {
    match: top5[0]!,
    top5,
    questionsAnswered: Object.keys(_state.answers).length,
    confidence: top5[0]?.posterior ?? 0,
    family,
  };
}

/**
 * Get the full list of question IDs available in the engine.
 */
export function getQuestionIds(): number[] {
  return _questions.map(q => q.id);
}

/**
 * Get the raw internal QuestionDef for a given ID (for advanced use).
 */
export function getQuestionDef(questionId: number): QuestionDef | undefined {
  return _questionsById.get(questionId);
}

/**
 * Get the number of archetypes.
 */
export function getArchetypeCount(): number {
  return _archetypes.length;
}

/**
 * Get the respondent's current node state for results display.
 * Returns continuous node expected values and categorical distributions.
 */
export function getRespondentState(): Record<string, unknown> | null {
  if (!_state) return null;

  const continuous: Record<string, { expectedPos: number; salience: number; touches: number }> = {};
  for (const [nodeId, node] of Object.entries(_state.continuous)) {
    // Compute expected position (weighted mean of posDist)
    const expectedPos = node.posDist.reduce((sum, p, i) => sum + p * (i + 1), 0);
    // Compute expected salience
    const salience = node.salDist.reduce((sum, p, i) => sum + p * i, 0);
    continuous[nodeId] = { expectedPos, salience, touches: node.touches };
  }

  const categorical: Record<string, { catDist: number[]; salience: number; touches: number }> = {};
  for (const [nodeId, node] of Object.entries(_state.categorical)) {
    const salience = node.salDist.reduce((sum, p, i) => sum + p * i, 0);
    categorical[nodeId] = { catDist: [...node.catDist], salience, touches: node.touches };
  }

  return {
    continuous,
    categorical,
    trbAnchor: {
      dist: [..._state.trbAnchor.dist],
      touches: _state.trbAnchor.touches,
    },
    ratioBoosts: Object.fromEntries(Array.from(_ratioBoosts.entries()).map(([k, v]) => [String(k), v]))
  };
}

export function getIdentityPrimaryResult(demographics?: IdentityPrimaryDemographics | null): IdentityPrimaryResult | null {
  if (!_state) return null;
  return resolveIdentityPrimary(_state, demographics ?? null);
}

export function applyRatioBoost(questionId: number, ratio: number): void {
  _ratioBoosts.set(questionId, ratio);
}

/**
 * Check if the user can go back to the previous question.
 */
export function canGoBack(): boolean {
  return _snapshots.length > 0;
}

/**
 * Go back to the previous question by restoring the snapshot.
 * Returns the question ID that was undone (so UI can re-render that question).
 */
export function goBack(): number | null {
  if (_snapshots.length === 0) return null;
  const snapshot = _snapshots.pop()!;
  _state = snapshot.state;
  return snapshot.questionId;
}
