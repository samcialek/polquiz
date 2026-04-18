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
import { buildArchetypeFamilies, type ArchetypeFamilyIndex } from "../engine/archetypeFamilies.js";
import { FIXED_16 } from "../engine/config.js";
import { resolveIdentityPrimary } from "../identity/resolveIdentityPrimary.js";
import type { IdentityPrimaryDemographics, IdentityPrimaryResult } from "../identity/resolveIdentityPrimary.js";
import { computeEngagementLabel, type EngagementLabel } from "../engine/engagementLabel.js";

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
  /** Pairwise sub-option keys per pair: { pairId: [optA, optB] } */
  pairOptions?: Record<string, string[]>;
  /** Best/worst items if applicable */
  bestWorstItems?: string[];
}

export interface QuizProgress {
  questionsAnswered: number;
  estimatedTotal: number;
  topArchetypes: Array<{ id: string; name: string; distance: number }>;
  /** Distance-based confidence proxy: gap_ratio = (d_second - d_leader) / d_leader, clamped [0, 1]. */
  confidence: number;
  phase: "salience" | "discriminate" | "converge";
}

export interface ArchetypeResult {
  id: string;
  name: string;
  tier: string;
  distance: number;
}

export interface FamilyResult {
  /** True when the runner-up is in the leader's pre-computed family set. */
  isFamily: boolean;
  /** ID of the runner-up family member. */
  partnerId?: string;
  /** Display name of the runner-up family member. */
  partnerName?: string;
}

export interface QuizResults {
  match: ArchetypeResult;
  top3: ArchetypeResult[];
  questionsAnswered: number;
  /** Distance-based confidence proxy: gap_ratio between leader and runner-up, clamped [0, 1]. */
  confidence: number;
  /** Family/subtype info when the runner-up is in the leader's family set. */
  family?: FamilyResult;
  /** Engagement label (ADR-002): standalone module derived from ENG state, independent of archetype match. */
  engagement: EngagementLabel;
}

export type { IdentityPrimaryDemographics, IdentityPrimaryResult };
export type { EngagementLabel };

// ---------------------------------------------------------------------------
// Internal state
// ---------------------------------------------------------------------------

let _state: RespondentState | null = null;
let _archetypes: Archetype[] = [];
let _activeArchetypes: Archetype[] = [];
let _familyIndex: ArchetypeFamilyIndex | null = null;
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
    archetypeDistances: { ...state.archetypeDistances },
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
// Distance update (Phase 3 Euclidean WTA scorer)
// ---------------------------------------------------------------------------

function updateDistances(state: RespondentState, archetypes: Archetype[]): void {
  let leaderId: string | undefined;
  let leaderDist = Infinity;
  for (const a of archetypes) {
    const dist = archetypeDistance(state, a);
    state.archetypeDistances[a.id] = dist;
    if (dist < leaderDist) {
      leaderDist = dist;
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
    out.pairOptions = {};
    for (const [pairId, sides] of Object.entries(q.pairMaps)) {
      out.pairOptions[pairId] = Object.keys(sides as Record<string, unknown>);
    }
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
  _activeArchetypes = ARCHETYPES.filter(a => a.active !== false);
  _familyIndex = buildArchetypeFamilies(_archetypes);
  _questions = REPRESENTATIVE_QUESTIONS.filter(q => q.touchProfile.length > 0);
  _questionsById = new Map(_questions.map(q => [q.id, q]));
  resetSimilarityCache();
  _state = createInitialState();
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
  const next = selectNextQuestion(_state, available, _activeArchetypes);
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

  // Update distances after each answer
  updateDistances(_state, _activeArchetypes);
}

/**
 * Get current quiz progress.
 */
export function getProgress(): QuizProgress {
  if (!_state) throw new Error("Call initQuiz() first");

  const nAnswered = Object.keys(_state.answers).length;

  const sorted = Object.entries(_state.archetypeDistances)
    .filter(([, d]) => Number.isFinite(d))
    .sort((a, b) => a[1] - b[1])
    .slice(0, 5);

  const dLeader = sorted[0]?.[1] ?? Infinity;
  const dSecond = sorted[1]?.[1] ?? Infinity;
  const gapRatio = Number.isFinite(dLeader) && dLeader > 0 && Number.isFinite(dSecond)
    ? Math.min(1, Math.max(0, (dSecond - dLeader) / dLeader))
    : 0;

  // Estimate total questions based on convergence (distance scale: see plan §4)
  let estimatedTotal: number;
  if (nAnswered < 16) {
    estimatedTotal = 40;
  } else if (dLeader <= 6) {
    estimatedTotal = Math.max(nAnswered + 3, 30);
  } else if (dLeader <= 10) {
    estimatedTotal = Math.max(nAnswered + 8, 35);
  } else {
    estimatedTotal = Math.max(nAnswered + 15, 45);
  }

  const topArchetypes = sorted.map(([id, distance]) => {
    const arch = _archetypes.find(a => a.id === id);
    return { id, name: arch?.name ?? "Unknown", distance };
  });

  let phase: QuizProgress["phase"];
  if (nAnswered < 16) phase = "salience";
  else if (nAnswered < 28) phase = "discriminate";
  else phase = "converge";

  return {
    questionsAnswered: nAnswered,
    estimatedTotal,
    topArchetypes,
    confidence: gapRatio,
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
  return shouldStop(_state, _activeArchetypes);
}

/**
 * Get final quiz results.
 * Can be called at any time, but results are most meaningful after isComplete() returns true.
 */
export function getResults(): QuizResults {
  if (!_state) throw new Error("Call initQuiz() first");

  const sorted = Object.entries(_state.archetypeDistances)
    .filter(([, d]) => Number.isFinite(d))
    .sort((a, b) => a[1] - b[1]);

  const top3: ArchetypeResult[] = sorted.slice(0, 3).map(([id, distance]) => {
    const arch = _archetypes.find(a => a.id === id)!;
    return {
      id,
      name: arch.name,
      tier: arch.tier,
      distance,
    };
  });

  // Family detection: runner-up ∈ leader's pre-computed family set
  let family: FamilyResult | undefined;
  if (top3.length >= 2 && _familyIndex) {
    const leaderId = top3[0]!.id;
    const runnerUpId = top3[1]!.id;
    const leaderFamily = _familyIndex.familyOf[leaderId];
    if (leaderFamily && leaderFamily.has(runnerUpId)) {
      family = {
        isFamily: true,
        partnerId: runnerUpId,
        partnerName: top3[1]!.name,
      };
    }
  }

  const dLeader = top3[0]?.distance ?? Infinity;
  const dSecond = top3[1]?.distance ?? Infinity;
  const confidence = Number.isFinite(dLeader) && dLeader > 0 && Number.isFinite(dSecond)
    ? Math.min(1, Math.max(0, (dSecond - dLeader) / dLeader))
    : 0;

  const engagement = computeEngagementLabel(_state);

  return {
    match: top3[0]!,
    top3,
    questionsAnswered: Object.keys(_state.answers).length,
    confidence,
    family,
    engagement,
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
  const engagement = computeEngagementLabel(_state);
  return resolveIdentityPrimary(_state, engagement, demographics ?? null);
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
