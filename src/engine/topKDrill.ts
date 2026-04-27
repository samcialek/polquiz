/**
 * Top-K salience drilling — Phase 2 of the Salience-Router architecture.
 *
 * After the 15 fixed front-door questions (CORE_OPENER + UNIVERSAL_SCREENERS),
 * we identify the respondent's most-salient nodes and require minimum
 * position-touch depth on them before falling through to general EIG-fill.
 *
 * Design principle (user direction, 2026-04-27):
 * "Every node gets one light read. Salient nodes get depth. Low-salience
 *  nodes do not get interrogated."
 *
 * Key correctness detail: the drill quota counts only MEANINGFUL position
 * touches (touchProfile entries with role=position AND weight ≥ threshold).
 * A weak side-touch like Q102's weight=0.10 MAT entry does NOT count toward
 * the drill quota — otherwise omnibus screeners trick the router into
 * thinking high-salience nodes have been drilled when they really haven't.
 */

import type {
  ContinuousNodeId,
  QuestionDef,
  RespondentState,
} from "../types.js";
import {
  MEANINGFUL_POSITION_WEIGHT,
  MIN_POSITION_TOUCHES_PER_TOP_K,
  POSITION_DRILL_SAL_FLOOR,
  TOP_K_BASE,
  TOP_K_CLOSE_THRESHOLD,
} from "./config.js";

const SCORING_NODES: ContinuousNodeId[] = [
  "MAT", "CD", "CU", "MOR", "PRO", "COM", "ZS", "ONT_H", "ONT_S",
];

/**
 * Expected salience (E[salDist]) for a continuous scoring node.
 * SELF-cluster nodes (PF/TRB/ENG) excluded — they're activation-only per
 * ADR-005 and use pos as the activation scale, not salience.
 */
export function expectedSalience(state: RespondentState, nodeId: ContinuousNodeId): number {
  const node = state.continuous[nodeId];
  if (!node) return 0;
  const d = node.salDist;
  return d[0] * 0 + d[1] * 1 + d[2] * 2 + d[3] * 3;
}

/**
 * Top-K salient scoring nodes, with floor + closeness rules.
 *
 * Base: top-2 by expectedSal. If the 3rd-place is within `closeThreshold`
 * of 2nd-place, include it as top-3. Nodes below `floor` are excluded
 * regardless of rank — drilling a barely-salient node is wasted budget.
 *
 * Returns [] if no node clears the floor (e.g., a respondent who marked
 * everything as low-salience). Caller should skip top-K drilling and go
 * straight to EIG-fill in that case.
 */
export function getTopSalientNodes(
  state: RespondentState,
  base: number = TOP_K_BASE,
  closeThreshold: number = TOP_K_CLOSE_THRESHOLD,
  floor: number = POSITION_DRILL_SAL_FLOOR,
): ContinuousNodeId[] {
  const sals = SCORING_NODES
    .map(n => ({ node: n, sal: expectedSalience(state, n) }))
    .filter(s => s.sal >= floor)
    .sort((a, b) => b.sal - a.sal);

  if (sals.length === 0) return [];
  const top = sals.slice(0, base);
  if (sals.length > base) {
    const lastTopSal = top[top.length - 1]!.sal;
    const next = sals[base]!.sal;
    if (next >= lastTopSal - closeThreshold) {
      top.push(sals[base]!);
    }
  }
  return top.map(s => s.node);
}

/**
 * Count the number of ALREADY-ANSWERED questions that gave this node a
 * MEANINGFUL position touch (role=position AND weight ≥ threshold).
 *
 * Meaningful threshold defaults to MEANINGFUL_POSITION_WEIGHT (0.4) which
 * excludes weak side-touches like Q102's weight=0.10 MAT entry from
 * counting toward the drill quota.
 *
 * A question with multiple position-role entries on the same node still
 * counts as one touch.
 */
export function meaningfulPositionTouchCount(
  state: RespondentState,
  nodeId: ContinuousNodeId,
  questionsById: ReadonlyMap<number, QuestionDef>,
  threshold: number = MEANINGFUL_POSITION_WEIGHT,
): number {
  let count = 0;
  for (const qIdStr of Object.keys(state.answers)) {
    const q = questionsById.get(parseInt(qIdStr, 10));
    if (!q) continue;
    const tps = q.touchProfile ?? [];
    for (const tp of tps) {
      if (tp.node === nodeId && tp.role === "position" && tp.weight >= threshold) {
        count++;
        break;
      }
    }
  }
  return count;
}

/**
 * Which top-K nodes still need more meaningful position drilling
 * (count < MIN_POSITION_TOUCHES_PER_TOP_K).
 */
export function topKNodesStillNeedingDrill(
  state: RespondentState,
  topK: readonly ContinuousNodeId[],
  questionsById: ReadonlyMap<number, QuestionDef>,
): ContinuousNodeId[] {
  return topK.filter(n =>
    meaningfulPositionTouchCount(state, n, questionsById) < MIN_POSITION_TOUCHES_PER_TOP_K
  );
}

/**
 * True iff every top-K node has reached the minimum drill depth.
 */
export function topKDrillSatisfied(
  state: RespondentState,
  topK: readonly ContinuousNodeId[],
  questionsById: ReadonlyMap<number, QuestionDef>,
): boolean {
  return topKNodesStillNeedingDrill(state, topK, questionsById).length === 0;
}

/**
 * Pick the next question for the TOP_K_DRILL phase.
 *
 * Returns null if all top-K nodes have reached MIN_POSITION_TOUCHES_PER_TOP_K
 * (caller falls through to EIG_FILL) or if no eligible question touches a
 * needs-drill node meaningfully.
 *
 * Selection:
 *   1. Restrict to questions that meaningfully touch (weight ≥ threshold)
 *      a needs-drill top-K node in role=position.
 *   2. Prefer questions that drill multiple needs-drill nodes (multi-hit).
 *   3. Tie-break by quality.
 *
 * EIG scoring is intentionally NOT applied here — Phase 3 will add salience-
 * weighted EIG to selectorEIG.ts. Phase 2 keeps top-K drill simple: get the
 * required depth on the right nodes, then hand off.
 */
export function selectTopKDrillQuestion(
  state: RespondentState,
  available: QuestionDef[],
  questionsById: ReadonlyMap<number, QuestionDef>,
  topK: readonly ContinuousNodeId[],
): QuestionDef | null {
  const needsDrill = topKNodesStillNeedingDrill(state, topK, questionsById);
  if (needsDrill.length === 0) return null;
  const needsDrillSet = new Set<string>(needsDrill);

  type Cand = { q: QuestionDef; multiHit: number; quality: number };
  const candidates: Cand[] = [];
  for (const q of available) {
    const tps = q.touchProfile ?? [];
    const meaningfulHits = new Set<string>();
    for (const tp of tps) {
      if (
        tp.role === "position" &&
        tp.weight >= MEANINGFUL_POSITION_WEIGHT &&
        needsDrillSet.has(tp.node)
      ) {
        meaningfulHits.add(tp.node);
      }
    }
    if (meaningfulHits.size > 0) {
      candidates.push({ q, multiHit: meaningfulHits.size, quality: q.quality ?? 0 });
    }
  }

  if (candidates.length === 0) return null;

  candidates.sort((a, b) => {
    if (b.multiHit !== a.multiHit) return b.multiHit - a.multiHit;
    return b.quality - a.quality;
  });

  return candidates[0]!.q;
}
