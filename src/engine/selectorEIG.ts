/**
 * EIG (Expected Information Gain) selector — post-ADR-003.
 *
 * Archetypes are now just labels for the respondent's final node signature.
 * The selector optimizes for *signature precision* rather than archetype
 * discrimination. Concretely:
 *
 *   1. Active-node filter. A continuous node is "active" when the respondent's
 *      expected salience E[sal] is ≥ 2.0. We only drill position on active
 *      nodes — there's no point pinning down someone's redistribution stance
 *      when they don't care about economics.
 *
 *   2. Per-node convergence. Once a node's position posterior has a dominant
 *      mode (max prob ≥ 0.45) after at least two position touches, or we've
 *      spent the per-node touch budget (3), we stop probing its position.
 *
 *   3. Information-gain scoring. A candidate question's score is the sum over
 *      its touchProfile of weight × entropy(relevant posterior), filtering out
 *      touches on already-converged or inactive targets.
 *
 *   4. Stop rule. Answered questions cap at MAX_QUESTIONS; below MIN_QUESTIONS
 *      we always continue. In the 20–40 band we stop when every active node
 *      has converged (position for continuous, category for categorical) and
 *      the TRB anchor is settled.
 */

import type {
  CategoricalNodeId,
  ContinuousNodeId,
  NodeId,
  QuestionDef,
  QuestionUiType,
  RespondentState,
  SalienceDist,
  TouchTarget,
} from "../types.js";
import { CONTINUOUS_NODES, CATEGORICAL_NODES } from "../config/nodes.js";
import { isQuestionEligible } from "./nextQuestion.js";
import {
  MEANINGFUL_POSITION_WEIGHT,
  POSITION_DRILL_SAL_FLOOR,
  MAX_POSITION_TOUCHES_TOP_K,
  MAX_POSITION_TOUCHES_NON_TOP_K,
} from "./config.js";
import {
  expectedSalience,
  getTopSalientNodes,
  meaningfulPositionTouchCount,
} from "./topKDrill.js";

// ─── Tunables ──────────────────────────────────────────────────────────────
const ACTIVE_SAL_THRESHOLD = 2.0;
const POS_CONVERGED_MAX_PROB = 0.45;
const SAL_CONVERGED_MAX_PROB = 0.55;
const CAT_CONVERGED_MAX_PROB = 0.55;
// AES is archetype-label flavor (post-ADR-003), not load-bearing for election
// alignment — converge earlier so the selector stops spending budget on it.
// EPS keeps the stricter 0.55 because epistemic style feeds reasoning-style labels.
const AES_CAT_CONVERGED_MAX_PROB = 0.40;
const TRB_CONVERGED_MAX_PROB = 0.45;
const POS_MIN_TOUCHES_TO_LOCK = 2;
const MAX_POSITION_TOUCHES = 3;
const MIN_QUESTIONS = 20;
const MAX_QUESTIONS = 40;

// ─── Primitives ────────────────────────────────────────────────────────────
function entropy(dist: readonly number[]): number {
  let h = 0;
  for (const p of dist) if (p > 1e-12) h -= p * Math.log(p);
  return h;
}

function expectedSal(dist: SalienceDist): number {
  return dist[0] * 0 + dist[1] * 1 + dist[2] * 2 + dist[3] * 3;
}

function isActive(state: RespondentState, nodeId: NodeId): boolean {
  if (nodeId in state.continuous) {
    return expectedSal(state.continuous[nodeId as ContinuousNodeId].salDist) >= ACTIVE_SAL_THRESHOLD;
  }
  if (nodeId in state.categorical) {
    return expectedSal(state.categorical[nodeId as CategoricalNodeId].salDist) >= ACTIVE_SAL_THRESHOLD;
  }
  return false;
}

function roleTouches(
  state: RespondentState,
  nodeId: NodeId,
  role: TouchTarget["role"],
  questionsById: ReadonlyMap<number, QuestionDef>
): number {
  let n = 0;
  for (const qid of Object.keys(state.answers)) {
    const q = questionsById.get(Number(qid));
    if (!q) continue;
    for (const t of q.touchProfile) {
      if (t.node === nodeId && t.role === role) n++;
    }
  }
  return n;
}

function posConverged(
  state: RespondentState,
  nodeId: ContinuousNodeId,
  questionsById: ReadonlyMap<number, QuestionDef>
): boolean {
  const node = state.continuous[nodeId];
  if (!node) return false;
  const touches = roleTouches(state, nodeId, "position", questionsById);
  if (touches >= MAX_POSITION_TOUCHES) return true;
  if (touches >= POS_MIN_TOUCHES_TO_LOCK && Math.max(...node.posDist) >= POS_CONVERGED_MAX_PROB) {
    return true;
  }
  return false;
}

function salConverged(state: RespondentState, nodeId: NodeId): boolean {
  let dist: SalienceDist | undefined;
  if (nodeId in state.continuous) dist = state.continuous[nodeId as ContinuousNodeId].salDist;
  else if (nodeId in state.categorical) dist = state.categorical[nodeId as CategoricalNodeId].salDist;
  if (!dist) return false;
  return Math.max(...dist) >= SAL_CONVERGED_MAX_PROB;
}

function catConverged(state: RespondentState, nodeId: CategoricalNodeId): boolean {
  const node = state.categorical[nodeId];
  if (!node) return false;
  const threshold = nodeId === "AES" ? AES_CAT_CONVERGED_MAX_PROB : CAT_CONVERGED_MAX_PROB;
  return Math.max(...node.catDist) >= threshold;
}

function trbConverged(state: RespondentState): boolean {
  return Math.max(...state.trbAnchor.dist) >= TRB_CONVERGED_MAX_PROB;
}

// ─── Scoring ───────────────────────────────────────────────────────────────
function touchInfoGain(
  state: RespondentState,
  touch: TouchTarget,
  questionsById: ReadonlyMap<number, QuestionDef>
): number {
  const nodeId = touch.node;

  if (nodeId === "TRB_ANCHOR") {
    if (trbConverged(state)) return 0;
    return entropy(state.trbAnchor.dist);
  }

  if (touch.role === "position") {
    if (!isActive(state, nodeId)) return 0;
    if (nodeId in state.continuous) {
      if (posConverged(state, nodeId as ContinuousNodeId, questionsById)) return 0;
      return entropy(state.continuous[nodeId as ContinuousNodeId].posDist);
    }
    return 0;
  }

  if (touch.role === "salience") {
    if (salConverged(state, nodeId)) return 0;
    if (nodeId in state.continuous) {
      return entropy(state.continuous[nodeId as ContinuousNodeId].salDist);
    }
    if (nodeId in state.categorical) {
      return entropy(state.categorical[nodeId as CategoricalNodeId].salDist);
    }
    return 0;
  }

  if (touch.role === "category") {
    if (nodeId in state.categorical) {
      if (catConverged(state, nodeId as CategoricalNodeId)) return 0;
      return entropy(state.categorical[nodeId as CategoricalNodeId].catDist);
    }
    return 0;
  }

  if (touch.role === "anchor") {
    if (trbConverged(state)) return 0;
    return entropy(state.trbAnchor.dist);
  }

  return 0;
}

// ─── Coverage ratio ────────────────────────────────────────────────────────
// A touch can be hollow or thin if only some of a question's options/buckets/items
// actually reference it. Rather than editing each question, we discount the
// touch's contribution by the fraction of evidence blocks that support it.
type EvidenceBlock = {
  continuous?: Record<string, unknown>;
  categorical?: Record<string, unknown>;
  trbAnchor?: Record<string, number>;
};

function evidenceEntries(q: QuestionDef): EvidenceBlock[] {
  if (q.uiType === "single_choice" || q.uiType === "multi") {
    return Object.values(q.optionEvidence ?? {}) as EvidenceBlock[];
  }
  if (q.uiType === "slider") {
    return Object.values(q.sliderMap ?? {}) as EvidenceBlock[];
  }
  if (q.uiType === "ranking" || q.uiType === "best_worst") {
    const map = q.rankingMap ?? q.bestWorstMap ?? {};
    return Object.values(map) as EvidenceBlock[];
  }
  if (q.uiType === "allocation") {
    return Object.values(q.allocationMap ?? {}) as EvidenceBlock[];
  }
  if (q.uiType === "pairwise") {
    const pm = (q.pairMaps ?? {}) as Record<string, Record<string, EvidenceBlock>>;
    const flat: EvidenceBlock[] = [];
    for (const inner of Object.values(pm)) for (const ev of Object.values(inner)) flat.push(ev);
    return flat;
  }
  return [];
}

function hasEvidenceFor(ev: EvidenceBlock | undefined, t: TouchTarget, uiType: QuestionUiType): boolean {
  if (!ev) return false;
  if (t.node === "TRB_ANCHOR") {
    const anchors = ev.trbAnchor;
    return !!anchors && Object.keys(anchors).length > 0;
  }
  // Plain-number evidence shapes (ranking/best_worst/allocation/pairwise):
  // a touch is "covered" if the node appears at all — these uiTypes don't
  // distinguish pos/sal on the map; salience is derived from rank/share.
  if (uiType === "ranking" || uiType === "best_worst") {
    if (t.kind === "continuous" || t.role === "position" || t.role === "salience") {
      if (ev.continuous && t.node in ev.continuous) return true;
    }
    if (t.role === "category" || t.kind === "categorical") {
      if (ev.categorical && t.node in ev.categorical) return true;
    }
    return false;
  }
  if (uiType === "allocation" || uiType === "pairwise") {
    if (ev.continuous && t.node in ev.continuous) return true;
    if (ev.categorical && t.node in ev.categorical) return true;
    return false;
  }
  // OptionEvidence (single_choice / multi / slider) — distinguishes pos/sal.
  if (t.role === "position") {
    const n = ev.continuous?.[t.node as string] as { pos?: unknown } | undefined;
    return !!n && n.pos !== undefined;
  }
  if (t.role === "salience") {
    const c = ev.continuous?.[t.node as string] as { sal?: unknown } | undefined;
    const cat = ev.categorical?.[t.node as string] as { sal?: unknown } | undefined;
    return (!!c && c.sal !== undefined) || (!!cat && cat.sal !== undefined);
  }
  if (t.role === "category") {
    const n = ev.categorical?.[t.node as string] as { cat?: unknown } | undefined;
    return !!n && n.cat !== undefined;
  }
  if (t.role === "anchor") {
    const anchors = ev.trbAnchor;
    return !!anchors && Object.keys(anchors).length > 0;
  }
  return false;
}

const coverageCache = new WeakMap<QuestionDef, Map<string, number>>();

function touchCoverage(q: QuestionDef, t: TouchTarget): number {
  let cache = coverageCache.get(q);
  if (!cache) {
    cache = new Map();
    coverageCache.set(q, cache);
  }
  const key = `${t.node}:${t.role}:${t.kind}`;
  const hit = cache.get(key);
  if (hit !== undefined) return hit;
  const entries = evidenceEntries(q);
  if (!entries.length) {
    cache.set(key, 0);
    return 0;
  }
  let hits = 0;
  for (const ev of entries) if (hasEvidenceFor(ev, t, q.uiType)) hits++;
  const ratio = hits / entries.length;
  cache.set(key, ratio);
  return ratio;
}

/**
 * Salience-weighted EIG score (Phase 3, 2026-04-27).
 *
 * Core formula unchanged: sum over touchProfile of
 *   coverage × weight × touchInfoGain(state, touch)
 *
 * Phase 3 modification: position-role touches are additionally weighted by
 * the target node's expectedSal, mapped from [0, 3] → [0.3, 1.5]. So a
 * position touch on a high-salience node (sal=3) gets 1.5× the weight of
 * an info-gain-equivalent touch on a barely-active node (sal=1). Salience-
 * role touches are NOT weighted by salience (we want to discover salience,
 * not bootstrap-favor it). Categorical and SELF-cluster touches unchanged.
 *
 * Quality and rewrite penalties applied at the end as before.
 */
function scoreQuestionEIG(
  state: RespondentState,
  q: QuestionDef,
  questionsById: ReadonlyMap<number, QuestionDef>
): number {
  let total = 0;
  for (const t of q.touchProfile) {
    const coverage = touchCoverage(q, t);
    if (coverage === 0) continue;
    let salWeight = 1.0;
    if (t.role === "position" && (CONTINUOUS_NODES as readonly string[]).includes(t.node)) {
      // Map expectedSal [0, 3] → [0.3, 1.5]. Floor at 0.3 so universal-screener
      // multi-touch questions (Q102, Q93) can still contribute on low-sal
      // nodes, but high-sal nodes get a 5× preference over zero-sal nodes.
      const sal = expectedSalience(state, t.node as ContinuousNodeId);
      salWeight = 0.3 + (sal / 3) * 1.2;
    }
    total += coverage * t.weight * salWeight * touchInfoGain(state, t, questionsById);
  }
  return total * q.quality * (q.rewriteNeeded ? 0.7 : 1.0);
}

/**
 * Per-node touch-cap filter (Phase 3, 2026-04-27).
 *
 * Returns false if the question would push a node past its meaningful-
 * position-touch cap. Top-K nodes get cap MAX_POSITION_TOUCHES_TOP_K (4),
 * non-top-K nodes get cap MAX_POSITION_TOUCHES_NON_TOP_K (3).
 *
 * Only counts position touches with weight ≥ MEANINGFUL_POSITION_WEIGHT —
 * weak side-touches don't count toward the cap or against it.
 */
function passesTouchCapFilter(
  state: RespondentState,
  q: QuestionDef,
  questionsById: ReadonlyMap<number, QuestionDef>,
  topK: ReadonlySet<string>,
): boolean {
  const positionTouches = q.touchProfile.filter(
    t => t.role === "position" && t.weight >= MEANINGFUL_POSITION_WEIGHT
  );
  if (positionTouches.length === 0) return true;
  // If at least one meaningful position-touched node is below cap, allow.
  for (const t of positionTouches) {
    if (!(CONTINUOUS_NODES as readonly string[]).includes(t.node)) continue;
    const cap = topK.has(t.node)
      ? MAX_POSITION_TOUCHES_TOP_K
      : MAX_POSITION_TOUCHES_NON_TOP_K;
    const touches = meaningfulPositionTouchCount(
      state, t.node as ContinuousNodeId, questionsById
    );
    if (touches < cap) return true;
  }
  return false;
}

/**
 * Position-question eligibility gate (Phase 3, 2026-04-27).
 *
 * A question is eligible for EIG_FILL only if either:
 *   (a) it has no meaningful position touches (it's a screener / metadata /
 *       salience-only question), or
 *   (b) at least one meaningful position-touched node has expectedSal ≥
 *       POSITION_DRILL_SAL_FLOOR (the node is active enough to drill).
 *
 * This prevents EIG from drilling positions on nodes the respondent doesn't
 * care about, which was the core issue with the pre-restructure architecture.
 */
function passesSalienceFloorGate(
  state: RespondentState,
  q: QuestionDef,
): boolean {
  const positionTouches = q.touchProfile.filter(
    t => t.role === "position" && t.weight >= MEANINGFUL_POSITION_WEIGHT
  );
  if (positionTouches.length === 0) return true; // not a position question
  for (const t of positionTouches) {
    if (!(CONTINUOUS_NODES as readonly string[]).includes(t.node)) continue;
    const sal = expectedSalience(state, t.node as ContinuousNodeId);
    if (sal >= POSITION_DRILL_SAL_FLOOR) return true;
  }
  return false;
}

// ─── Public API ────────────────────────────────────────────────────────────
export function selectNextQuestionEIG(
  state: RespondentState,
  available: QuestionDef[],
  questionsById: ReadonlyMap<number, QuestionDef>
): QuestionDef | null {
  const baseEligible = available.filter(
    (q) => !(q.id in state.answers) && isQuestionEligible(state, q)
  );
  if (!baseEligible.length) return null;

  // Phase 3 filters (2026-04-27):
  //   - Position-question salience floor: questions whose only meaningful
  //     position touches are on barely-active (E[sal] < 1.5) nodes are
  //     skipped — drilling unsalient nodes wastes question budget.
  //   - Per-node touch cap: questions whose meaningful position touches
  //     all hit nodes that have already reached their cap are skipped.
  const topK = new Set<string>(getTopSalientNodes(state));
  const eligible = baseEligible.filter(q =>
    passesSalienceFloorGate(state, q) &&
    passesTouchCapFilter(state, q, questionsById, topK)
  );
  if (!eligible.length) return null;

  // Priority batteries (Q93/Q102/Q103 anchor the front door — these were
  // already served as part of the fixed front door before EIG runs, so
  // typically nothing reaches this branch. Q99/Q101 had this flag pre-
  // restructure; removed in Phase 3 so they don't auto-fire.
  const priority = eligible.filter((q) => q.priorityBattery);
  if (priority.length) {
    const scoredPriority = priority
      .map((q) => ({ q, score: scoreQuestionEIG(state, q, questionsById) }))
      .sort((a, b) => b.score - a.score);
    return scoredPriority[0]!.q;
  }

  const scored = eligible
    .map((q) => ({ q, score: scoreQuestionEIG(state, q, questionsById) }))
    .filter((s) => s.score > 0);

  if (!scored.length) {
    // Fallback: no question offers info gain. Pick the highest-quality eligible
    // question so the quiz still progresses gracefully toward the stop.
    const byQuality = [...eligible].sort((a, b) => b.quality - a.quality);
    return byQuality[0] ?? null;
  }
  scored.sort((a, b) => b.score - a.score);
  return scored[0]!.q;
}

export function shouldStopEIG(
  state: RespondentState,
  questionsById: ReadonlyMap<number, QuestionDef>
): boolean {
  const nAnswered = Object.keys(state.answers).length;
  if (nAnswered >= MAX_QUESTIONS) return true;
  if (nAnswered < MIN_QUESTIONS) return false;

  for (const nodeId of CONTINUOUS_NODES) {
    if (!isActive(state, nodeId)) continue;
    if (!posConverged(state, nodeId, questionsById)) return false;
  }
  for (const nodeId of CATEGORICAL_NODES) {
    // AES is archetype-label flavor post-ADR-003; do not block stop on it.
    // EPS stays gating — epistemic style affects reasoning-style labeling.
    if (nodeId === "AES") continue;
    if (!isActive(state, nodeId)) continue;
    if (!catConverged(state, nodeId)) return false;
  }
  if (!trbConverged(state) && state.trbAnchor.touches < 2) return false;

  return true;
}

// Exported for instrumentation / diagnostics.
export const EIG_INTERNALS = {
  ACTIVE_SAL_THRESHOLD,
  POS_CONVERGED_MAX_PROB,
  SAL_CONVERGED_MAX_PROB,
  CAT_CONVERGED_MAX_PROB,
  AES_CAT_CONVERGED_MAX_PROB,
  TRB_CONVERGED_MAX_PROB,
  POS_MIN_TOUCHES_TO_LOCK,
  MAX_POSITION_TOUCHES,
  MIN_QUESTIONS,
  MAX_QUESTIONS,
  isActive,
  roleTouches,
  posConverged,
  salConverged,
  catConverged,
  trbConverged,
  entropy,
  expectedSal,
};
