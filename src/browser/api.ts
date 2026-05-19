/**
 * PRISM Quiz Engine — Browser API
 *
 * Self-contained browser-facing API that wraps the engine.
 * Bundled as an IIFE and exposed as window.PrismEngine.
 */

import type {
  ContinuousNodeId,
  CategoricalNodeId,
  ContinuousPosDist,
  SalienceDist,
  CategoricalDist,
  QuestionDef,
  RespondentState,
  TrbAnchorDist,
} from "../types.js";

import { REPRESENTATIVE_QUESTIONS } from "../config/questions.representative.js";
import { CONTINUOUS_NODES, CATEGORICAL_NODES } from "../config/nodes.js";
import {
  applySingleChoiceAnswer,
  applyMultiAnswer,
  applySliderAnswer,
  applyAllocationAnswer,
  applyRankingAnswer,
  applyPairwiseAnswer,
  applyBestWorstSalience,
  applyPrioritySort,
  applyDualAxisAnswer,
  mirrorMorSalToIntensity,
} from "../engine/update.js";
import { multiplyAndNormalize, mkInitialMorBoundaries, MOR_BOUNDARY_ORDER } from "../engine/math.js";
import { selectNextQuestion, isQuestionEligible } from "../engine/nextQuestion.js";
import { selectNextQuestionEIG, shouldStopEIG } from "../engine/selectorEIG.js";
// NOTE: the live browser quiz uses shouldStopEIG (entropy-based, MAX=35).
// `shouldStop` from stopRule.ts is the distance-native rule used by the eval
// harness and simulation suites — intentionally NOT imported here. See the
// "Stop rule" note in CLAUDE.md for the eval-vs-live split.
import { resetSimilarityCache } from "../engine/stopRule.js";
import { SALIENCE_ROUTER_FIXED } from "../engine/config.js";
import {
  getTopSalientNodes,
  selectTopKDrillQuestion,
} from "../engine/topKDrill.js";
import { resolveIdentityPrimary } from "../identity/resolveIdentityPrimary.js";
import type { IdentityPrimaryDemographics, IdentityPrimaryResult } from "../identity/resolveIdentityPrimary.js";
import { computeEngagementLabel, type EngagementLabel } from "../engine/engagementLabel.js";
import { respondentSignatureFromState } from "../engine/respondentSignature.js";
import { archetypeDistance } from "../engine/archetypeDistance.js";
import { ARCHETYPES } from "../config/archetypes.js";
import { ELECTIONS } from "../historical/candidates.js";
import { getContext } from "../historical/contexts.js";
import { predictVote, type ElectionPrediction } from "../historical/respondentVoteChoice.js";

// ---------------------------------------------------------------------------
// Bundle version marker (PR 1 — trace reliability). Stamped onto every dump
// so older dumps can be flagged stale relative to engine fixes (Q200/Q211/Q212
// metadata hooks, applyBestWorstSalience trbAnchor, top5 in results, etc.).
// Bump whenever the engine changes meaningfully — keep in sync with the
// quiz-v2-live.html cache-buster string.
// ---------------------------------------------------------------------------
export const BUNDLE_VERSION = "20260514-polling-derived-charisma";
export { composeArchetypeLabel, tokenizeRespondent } from "../identity/archetypeLabeler.js";
export { composeArchetypeDescription, composeAtomFallback, LABEL_DESCRIPTIONS } from "../identity/labelDescriptions.js";

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
  /** Best-worst picks per side (top-N / bottom-N). Default 1. */
  bwMaxPicks?: number;
  /** Dual-axis map (node + x-axis endpoint posteriors) for `dual_axis` uiType. */
  dualAxisMap?: { node: string; xLow: number[]; xHigh: number[] };
  /** Strength/ratio follow-up metadata rendered after the primary answer. */
  strengthFollowUp?: { kind: "strength" | "ratio"; prompt: string; labels?: Record<string, string> };
}

export interface QuizProgress {
  questionsAnswered: number;
  estimatedTotal: number;
  phase: "salience" | "discriminate" | "converge";
}

// Centroid-era types (QuizResults.match/top3/top5/confidence/confidenceBand/
// family/diagnostics) removed 2026-05-13 — the 124-centroid Bayesian matcher
// is retired. The user-facing identity is now the composed label built from
// the respondent's top-3 salient tokens (composedArchetypeLabel) plus the
// engagement label and the identity-primary overlay. Elections + world map
// already consume respondentSignatureFromState / respondentState directly.

export interface QuizResults {
  questionsAnswered: number;
  /** Engagement label (ADR-002): standalone module derived from ENG state. */
  engagement: EngagementLabel;
  /**
   * Identity-primary overlay (ADR-006/ADR-007): null unless the respondent
   * passed the moral-circle excess + demographic + engagement gates. When
   * non-null, contains the identity-primary label, state, and reason codes.
   */
  identityPrimary: IdentityPrimaryResult | null;
}

export type { IdentityPrimaryDemographics, IdentityPrimaryResult };
export type { EngagementLabel };
export type { ElectionPrediction };

// ---------------------------------------------------------------------------
// Internal state
// ---------------------------------------------------------------------------

let _state: RespondentState | null = null;
let _questions: QuestionDef[] = [];
let _questionsById: Map<number, QuestionDef> = new Map();
const _ratioBoosts: Map<number, number> = new Map();
let _demographics: IdentityPrimaryDemographics | null = null;

// Ratio → salience likelihood mapping. Replaced 2026-04-24 per ADR-008
// with log-scaled buckets and harder cap. Previous version mapped any
// ratio >= 4 to maximum salience (0.60 on sal=3), which meant a single
// error-tradeoff with ratio=100 produced the same salience push as ratio=4
// but the user's *intent* was very different. New mapping uses 4 discrete
// log-scale buckets: 1.5-2 (mild), 2-5 (moderate), 5-25 (strong), 25+
// (very strong). Caps the maximum sal-3 mass at 0.50 so a single ratio-
// follow-up cannot dominate a node's salience profile.
function ratioToSalienceDist(ratio: number): SalienceDist {
  if (ratio >= 25) return [0.04, 0.14, 0.32, 0.50];   // very strong (was 0.60)
  if (ratio >= 5)  return [0.08, 0.20, 0.36, 0.36];   // strong
  if (ratio >= 2)  return [0.14, 0.28, 0.36, 0.22];   // moderate
  return [0.22, 0.32, 0.30, 0.16];                     // mild
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
      // 6.E.2b bridge: ratio-boost MOR salience → intensity. This sits
      // outside update.ts (browser-only post-answer hook) so it imports
      // the bridge helper directly to keep the mirror coverage uniform.
      if (touch.node === "MOR") mirrorMorSalToIntensity(_state, salLikelihood, 1.0);
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
    // Centroid posterior fields (archetypeDistances/currentLeader/
    // consecutiveLeadCount) retained at the type level so RespondentState
    // contracts still typecheck across legacy eval scripts, but the live
    // engine no longer populates them (2026-05-13 centroid rip). Leave them
    // empty in deep copies so back-navigation doesn't fabricate stale state.
    archetypeDistances: {},
    // Metadata fields written by Q200/Q211/Q212 update hooks. Snapshot must
    // round-trip these or back-navigation will silently drop election-alignment
    // signals that the user already provided.
    partyID: state.partyID ?? null,
    strategicVoting: state.strategicVoting,
    dominantNode: state.dominantNode ?? null,
    negativeParties: state.negativeParties
      ? new Set(state.negativeParties)
      : undefined,
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
  // 6.E.2b: deep-copy morBoundaries (Set + nested objects). Snapshot must
  // round-trip the module so back-navigation restores the moral-circle
  // contribution to archetypeDistance correctly.
  if (state.morBoundaries) {
    copy.morBoundaries = {
      boundaries: { ...state.morBoundaries.boundaries },
      intensity: state.morBoundaries.intensity,
      touches: { ...state.morBoundaries.touches },
      touchTypes: new Set(state.morBoundaries.touchTypes),
      status: state.morBoundaries.status,
    };
  }
  // ADR-007 — deep-copy moralCircle state (T10). Affinity is a frozen
  // snapshot (immutable structure); accumulator must be deep-copied so
  // back-navigation doesn't share the running aggregate.
  if (state.moralCircle) {
    copy.moralCircle = {
      affinity: state.moralCircle.affinity
        ? {
            universalAffinity: state.moralCircle.affinity.universalAffinity,
            scopedAffinities: { ...state.moralCircle.affinity.scopedAffinities },
            excessAffinities: { ...state.moralCircle.affinity.excessAffinities },
            activeBoundaries: [...state.moralCircle.affinity.activeBoundaries],
            intensity01: state.moralCircle.affinity.intensity01,
            intensity03: state.moralCircle.affinity.intensity03,
          }
        : null,
      touchCount: state.moralCircle.touchCount,
      accumulator: {
        universalSum: state.moralCircle.accumulator.universalSum,
        universalCount: state.moralCircle.accumulator.universalCount,
        scopedSums: { ...state.moralCircle.accumulator.scopedSums },
        scopedCounts: { ...state.moralCircle.accumulator.scopedCounts },
      },
    };
  }
  if (state.membership) {
    copy.membership = { ...state.membership };
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
    // 6.E.2b: initialize the compound moral-circle module per ADR-006.
    // Triggers archetypeDistance.ts's per-archetype gate to switch to the
    // morModule branch — the bridge in update.ts (committed in this same PR)
    // mirrors every legacy MOR/TRB/PF/trbAnchor write into this field so the
    // module ends the quiz meaningfully shifted from {boundaries: 0.5,
    // intensity: 0} rather than near-neutral.
    morBoundaries: mkInitialMorBoundaries(),
    // ADR-007 — moralCircleAffinity initialization (T10).
    // affinity stays null until first moralCircle evidence; no zero-default
    // (universalAffinity=0 would be a positive moral claim). Accumulator
    // tracks per-component running totals.
    moralCircle: {
      affinity: null,
      touchCount: 0,
      accumulator: {
        universalSum: 0,
        universalCount: 0,
        scopedSums: {},
        scopedCounts: {},
      },
    },
    membership: {},
    // archetypeDistances kept as empty record for type-shape compatibility
    // with eval/simulation scripts that still read the field. Live engine no
    // longer populates after 2026-05-13 centroid rip.
    archetypeDistances: {},
  };
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

  if (q.dualAxisMap) {
    out.dualAxisMap = {
      node: q.dualAxisMap.node,
      xLow: [...q.dualAxisMap.xLow],
      xHigh: [...q.dualAxisMap.xHigh],
    };
  }

  if (q.strengthFollowUp) {
    out.strengthFollowUp = {
      kind: q.strengthFollowUp.kind,
      prompt: q.strengthFollowUp.prompt,
      labels: q.strengthFollowUp.labels ? { ...q.strengthFollowUp.labels } : undefined,
    };
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

  if (q.bwMaxPicks != null) {
    out.bwMaxPicks = q.bwMaxPicks;
  }

  return out;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Initialize a new quiz session.
 * Resets all state and loads the question bank.
 */
// Metadata-only opener questions. Their evidence is stored directly on
// state.partyID / strategicVoting / negativeParties via update.ts hooks rather
// than as touchProfile-driven Bayesian touches, so they have empty touchProfile
// arrays. They must still appear in _questionsById so getNextQuestion() can
// return them when the fixed-opener index reaches their slot.
const METADATA_QUESTION_IDS = new Set([200, 211, 212]);

export function initQuiz(): void {
  _questions = REPRESENTATIVE_QUESTIONS.filter(
    q => q.touchProfile.length > 0 || METADATA_QUESTION_IDS.has(q.id)
  );
  _questionsById = new Map(_questions.map(q => [q.id, q]));
  resetSimilarityCache();
  _state = createInitialState();
  _snapshots.length = 0; // Clear snapshot history on fresh quiz
  _ratioBoosts.clear();
  _demographics = null;
}

/**
 * Submit optional demographic answers for the identity-primary resolver.
 * Called once at end of quiz, only if the resolver has signaled that
 * demographic confirmation would refine the result.
 *
 * Recognized keys: demo_ethnicity, demo_gender, demo_religion, demo_lgbtq.
 * Other keys are stored but not consumed by the current resolver.
 */
export function submitDemographics(demographics: IdentityPrimaryDemographics | null): void {
  _demographics = demographics;
}

/**
 * Inspect the identity-primary resolver gate without committing demographics.
 * Used by the UI to decide whether the demographic mini-block should render.
 * Returns the resolver result with `state: 'unresolved'` and reason codes
 * indicating which gates passed/failed. If demographic confirmation is the
 * only missing piece, the UI prompts; otherwise it skips.
 */
export function previewIdentityPrimary(): IdentityPrimaryResult | null {
  if (!_state) return null;
  const engagement = computeEngagementLabel(_state);
  return resolveIdentityPrimary(_state, engagement, null);
}

/**
 * Get the next question the engine wants to ask.
 * Returns null if no more questions are available.
 */
export function getNextQuestion(): QuizQuestion | null {
  if (!_state) throw new Error("Call initQuiz() first");

  // Phase 1: Salience-Router fixed front door (CORE_OPENER + UNIVERSAL_SCREENERS).
  // 15 questions in fixed order. CORE establishes salience for every node
  // and captures party/strategic-voting metadata. UNIVERSAL_SCREENERS give
  // every major node ≥ 1 light position read regardless of salience, so
  // even nodes the respondent doesn't care about have ground truth for
  // archetype distance. See engine/config.ts:SALIENCE_ROUTER_FIXED.
  //
  // 2026-05-13: fixed loop now also honors exposeRules.eligibleIf so
  // conditional questions in the fixed router (e.g., Q228 which only fires
  // after Q8 = clearly_abroad) get skipped when their predicate is false.
  for (const nextId of SALIENCE_ROUTER_FIXED) {
    if (nextId in _state.answers) continue;
    const q = _questionsById.get(nextId);
    if (!q) continue;
    if (!isQuestionEligible(_state, q)) continue;
    return toQuizQuestion(q);
  }

  // Available pool for Phase 2-3 (already-answered + ineligible filtered out).
  const available = _questions.filter(
    q => !(q.id in _state!.answers) && isQuestionEligible(_state!, q)
  );

  // Phase 2: TOP_K_DRILL. Identify the respondent's most-salient nodes
  // (top 2, plus a 3rd if close to 2nd) and force minimum 2 meaningful
  // position-touch questions per top-K node before falling through to
  // EIG_FILL. Skipped if no node clears the salience floor (e.g., a
  // respondent who marked everything low-salience).
  const topK = getTopSalientNodes(_state);
  if (topK.length > 0) {
    const drill = selectTopKDrillQuestion(_state, available, _questionsById, topK);
    if (drill) return toQuizQuestion(drill);
  }

  // Phase 3: EIG_FILL. Salience-weighted EIG selector handles remaining
  // capacity. Per-node touch caps (4 for top-K, 3 elsewhere) and
  // expectedSal ≥ 1.5 eligibility gate land in selectorEIG.ts (Phase 3 PR).
  const next = selectNextQuestionEIG(_state, available, _questionsById);
  return next ? toQuizQuestion(next) : null;
}

// Retained so the legacy archetype-discrimination selector can still be used
// by diagnostic scripts that import selectNextQuestion from here.
void selectNextQuestion;

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
  answer:
    | string
    | number
    | string[]
    | Record<string, number>
    | Record<string, string>
    | { best: string; worst: string }
    | { best: string[]; worst: string[] }
    | { x: number; y: number }
    | { supportHigh: string[]; supportMid: string[]; neutral: string[]; opposeHigh: string[] }
): void {
  if (!_state) throw new Error("Call initQuiz() first");

  // Snapshot current state before applying answer (for back button)
  _snapshots.push({ state: deepCopyState(_state), questionId });

  const q = _questionsById.get(questionId);
  if (!q) throw new Error(`Unknown question ID: ${questionId}`);

  switch (q.uiType) {
    case "single_choice":
    case "conjoint":
      applySingleChoiceAnswer(_state, q, answer as string);
      applyStoredRatioBoost(q);
      break;

    case "multi":
      applyMultiAnswer(_state, q, Array.isArray(answer) ? answer : [answer as string]);
      applyStoredRatioBoost(q);
      break;

    case "dual_axis":
      applyDualAxisAnswer(_state, q, answer as { x: number; y: number });
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
      const bw = answer as { best: string | string[]; worst: string | string[] };
      const bwItems = q.bestWorstMap ? Object.keys(q.bestWorstMap)
                    : q.rankingMap   ? Object.keys(q.rankingMap)
                    : [];
      if (bwItems.length === 0) break;

      const best = Array.isArray(bw.best) ? bw.best : [bw.best];
      const worst = Array.isArray(bw.worst) ? bw.worst : [bw.worst];
      if (Array.isArray(bw.best) || Array.isArray(bw.worst) || q.bestWorstMap) {
        // Top-N / bottom-N and explicit max-diff maps: per-item update.
        // Middle items stay neutral; they should not inherit arbitrary rank
        // evidence from object-key order.
        applyBestWorstSalience(_state, q, best, worst, bwItems);
      } else {
        // Legacy top-1 / bottom-1: flattened ranking [best, ...middle, worst].
        const middle = bwItems.filter(i => i !== best[0] && i !== worst[0]);
        applyRankingAnswer(_state, q, [best[0]!, ...middle, worst[0]!]);
      }
      break;
    }

    case "priority_sort": {
      const placements = answer as unknown as {
        supportHigh: string[];
        supportMid:  string[];
        neutral:     string[];
        opposeHigh:  string[];
      };
      const items = q.rankingMap ? Object.keys(q.rankingMap) : [];
      if (items.length === 0) break;
      applyPrioritySort(_state, q, placements, items);
      break;
    }
  }
}

/**
 * Get current quiz progress. estimatedTotal is the *typical* run length, not
 * a hard cap — the actual stop rule lives in selectorEIG.ts (hard cap 35).
 * Display layer should render this with a tilde ("~32 questions") so the
 * counter reads naturally when a heavier respondent runs to 33-35.
 */
export function getProgress(): QuizProgress {
  if (!_state) throw new Error("Call initQuiz() first");

  const nAnswered = Object.keys(_state.answers).length;

  let phase: QuizProgress["phase"];
  if (nAnswered < 16) phase = "salience";
  else if (nAnswered < 28) phase = "discriminate";
  else phase = "converge";

  return {
    questionsAnswered: nAnswered,
    estimatedTotal: 32,
    phase,
  };
}

/**
 * Check whether the engine has enough data to produce a result.
 */
export function isComplete(): boolean {
  if (!_state) return false;
  return shouldStopEIG(_state, _questionsById);
}

/**
 * Get final quiz results. The 124-centroid Bayesian matcher was retired
 * 2026-05-13 — `match`, `top3`, `top5`, `confidence`, `confidenceBand`,
 * `family`, and `diagnostics` are gone. The user-facing identity is the
 * composed label (consumers call composeArchetypeLabel + the description
 * helper on respondentState directly). Engagement and the identity-primary
 * overlay still resolve here.
 */
export function getResults(): QuizResults {
  if (!_state) throw new Error("Call initQuiz() first");

  const engagement = computeEngagementLabel(_state);

  // Single-issue dominance detection (P3.6, ADR-009). If any non-SELF node's
  // E[sal] is both >= 2.7 AND > 2× the mean of others, flag as dominant.
  // Used by predictVote to amplify that node's contribution 2x — captures
  // voters whose politics is dominated by one issue.
  detectAndStoreDominantNode(_state);

  // Identity-primary overlay (ADR-006/ADR-007). Resolver gates on moral-circle
  // excess + demographics + engagement. Returns null unless gates pass.
  const identityResult = resolveIdentityPrimary(_state, engagement, _demographics);
  const identityPrimary: IdentityPrimaryResult | null =
    identityResult.state === "active" || identityResult.state === "dominant"
      ? identityResult
      : null;

  return {
    questionsAnswered: Object.keys(_state.answers).length,
    engagement,
    identityPrimary,
  };
}

// Single-issue dominance detector (P3.6, ADR-009). Sets state.dominantNode
// if one non-SELF node's E[sal] is >= 2.7 AND > 2× the mean of others.
function detectAndStoreDominantNode(state: RespondentState): void {
  const nonSelfNodes: ContinuousNodeId[] = [
    "MAT", "CD", "CU", "MOR", "PRO", "COM", "ZS", "ONT_H", "ONT_S",
  ];
  const sals: Array<{ nid: string; sal: number }> = [];
  for (const nid of nonSelfNodes) {
    const node = state.continuous[nid];
    if (!node) continue;
    sals.push({ nid, sal: node.salDist.reduce((s, p, i) => s + p * i, 0) });
  }
  for (const nid of ["EPS", "AES"] as CategoricalNodeId[]) {
    const node = state.categorical[nid];
    if (!node) continue;
    sals.push({ nid, sal: node.salDist.reduce((s, p, i) => s + p * i, 0) });
  }
  if (sals.length === 0) { state.dominantNode = null; return; }
  const top = sals.reduce((a, b) => a.sal > b.sal ? a : b);
  const others = sals.filter(s => s.nid !== top.nid);
  const othersMean = others.reduce((s, e) => s + e.sal, 0) / Math.max(1, others.length);
  state.dominantNode = (top.sal >= 2.7 && top.sal > 2 * othersMean) ? top.nid : null;
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
 * Get the respondent's current node state for results display.
 * Returns continuous node expected values and categorical distributions.
 */
export function getRespondentState(): Record<string, unknown> | null {
  if (!_state) return null;

  const continuous: Record<string, { expectedPos: number; salience: number; touches: number; posDist: number[] }> = {};
  for (const [nodeId, node] of Object.entries(_state.continuous)) {
    const expectedPos = node.posDist.reduce((sum, p, i) => sum + p * (i + 1), 0);
    const salience = node.salDist.reduce((sum, p, i) => sum + p * i, 0);
    continuous[nodeId] = { expectedPos, salience, touches: node.touches, posDist: [...node.posDist] };
  }

  const categorical: Record<string, { catDist: number[]; salience: number; touches: number }> = {};
  for (const [nodeId, node] of Object.entries(_state.categorical)) {
    const salience = node.salDist.reduce((sum, p, i) => sum + p * i, 0);
    categorical[nodeId] = { catDist: [...node.catDist], salience, touches: node.touches };
  }

  // 6.E.2b: expose morBoundaries in the debug view (compound moral-circle
  // module per ADR-006). Includes derived measures so dumps + smokes can
  // verify the bridge actually moved the module away from its init.
  const mb = _state.morBoundaries;
  let boundaryLoad = 0;
  if (mb) {
    for (const k of MOR_BOUNDARY_ORDER) {
      if (mb.boundaries[k] > boundaryLoad) boundaryLoad = mb.boundaries[k];
    }
  }
  const morBoundaries = mb
    ? {
        boundaries: { ...mb.boundaries },
        intensity: mb.intensity,
        boundaryLoad,
        universalismScore: mb.intensity * (1 - boundaryLoad),
        boundednessScore: mb.intensity * boundaryLoad,
        touches: { ...mb.touches },
        touchTypeCount: mb.touchTypes.size,
        status: mb.status,
      }
    : null;

  // ADR-007 — moral-circle module exposure. When affinity is materialized
  // (after at least one moralCircle evidence touch), expose universal,
  // scoped, excess, active boundaries, and intensity so the results page
  // can render the new module display.
  const mc = _state.moralCircle?.affinity ?? null;
  const moralCircle = mc
    ? {
        universalAffinity: mc.universalAffinity,
        scopedAffinities: { ...mc.scopedAffinities },
        excessAffinities: { ...mc.excessAffinities },
        activeBoundaries: [...mc.activeBoundaries],
        intensity01: mc.intensity01,
        intensity03: mc.intensity03,
        touchCount: _state.moralCircle?.touchCount ?? 0,
      }
    : null;

  return {
    continuous,
    categorical,
    trbAnchor: {
      dist: [..._state.trbAnchor.dist],
      touches: _state.trbAnchor.touches,
    },
    morBoundaries,
    moralCircle,
    membership: _state.membership ? { ..._state.membership } : null,
    partyID: _state.partyID ?? null,
    strategicVoting: _state.strategicVoting ?? false,
    negativeParties: _state.negativeParties ? [..._state.negativeParties] : [],
    dominantNode: _state.dominantNode ?? null,
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
 * Per-election vote prediction from the respondent's signature.
 * Runs era-weighted Euclidean distance against each election's candidates and
 * applies an engagement-driven clearing bar to decide vote vs abstain.
 * Independent of archetype classification — archetype is a label only.
 */
export function getElectionPredictions(): ElectionPrediction[] {
  if (!_state) throw new Error("Call initQuiz() first");
  const sig = respondentSignatureFromState(_state);
  const engagement = computeEngagementLabel(_state);
  const out: ElectionPrediction[] = [];
  for (const election of ELECTIONS) {
    const ctx = getContext(election.year);
    if (!ctx) continue;
    out.push(predictVote(
      sig,
      election.candidates,
      ctx,
      engagement.level,
      _state.partyID ?? null,
      _state.trbAnchor.dist,
      _state.negativeParties ?? null,
      _state.strategicVoting ?? false,
      _state.dominantNode ?? null,
      _state.morBoundaries ?? null,
    ));
  }
  return out;
}

const IDENTITY_PRIMARY_IDS = new Set(["141", "142", "143", "144", "145", "146"]);

/**
 * Diagnostic-only: rank archetypes by `archetypeDistance` over the current
 * internal state, returning the top-K with their distances. Intended for
 * harness reporting (HARNESS-HANDOFF §4.1) — NOT for production UI, which
 * uses the composed archetype label post-centroid-retirement.
 *
 * Returns null if no quiz is active. The function reads the internal raw
 * state without exposing it (so callers can't mutate); the returned objects
 * are plain data.
 *
 * Identity-primary archetypes (IDs 141-146) are excluded by default per
 * CLAUDE.md: "Do NOT conflate Identity Primary overlays with base archetypes
 * — they are a separate layer applied *after* archetype assignment." When
 * the IDP overlay fires, it's surfaced via `getResults().identityPrimary`,
 * not via this base-archetype ranking. Including them here was producing
 * false top-1 results for personas like disengaged-centrist where the IDP
 * overlay correctly returned `none` but #145 Feminist Voter was the
 * nearest archetype by raw distance.
 *
 * Pass `includeIdentityPrimary: true` to opt back into the unfiltered
 * ranking for debugging.
 */
export function getTopArchetypesForDiagnostics(
  k: number = 5,
  options?: { includeIdentityPrimary?: boolean },
): Array<{ id: string; name: string; distance: number }> | null {
  if (!_state) return null;
  const includeIdp = options?.includeIdentityPrimary === true;
  const ranked = ARCHETYPES
    .filter(a => a.active !== false)
    .filter(a => includeIdp || !IDENTITY_PRIMARY_IDS.has(a.id))
    .map(a => ({ id: a.id, name: a.name, distance: archetypeDistance(_state!, a) }))
    .filter(r => Number.isFinite(r.distance))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, k);
  return ranked;
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
