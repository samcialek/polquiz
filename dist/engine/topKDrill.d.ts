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
import type { ContinuousNodeId, QuestionDef, RespondentState } from "../types.js";
/**
 * Expected salience (E[salDist]) for a continuous scoring node.
 * SELF-cluster nodes (PF/TRB/ENG) excluded — they're activation-only per
 * ADR-005 and use pos as the activation scale, not salience.
 */
export declare function expectedSalience(state: RespondentState, nodeId: ContinuousNodeId): number;
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
export declare function getTopSalientNodes(state: RespondentState, base?: number, closeThreshold?: number, floor?: number): ContinuousNodeId[];
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
export declare function meaningfulPositionTouchCount(state: RespondentState, nodeId: ContinuousNodeId, questionsById: ReadonlyMap<number, QuestionDef>, threshold?: number): number;
/**
 * Which top-K nodes still need more meaningful position drilling
 * (count < MIN_POSITION_TOUCHES_PER_TOP_K).
 */
export declare function topKNodesStillNeedingDrill(state: RespondentState, topK: readonly ContinuousNodeId[], questionsById: ReadonlyMap<number, QuestionDef>): ContinuousNodeId[];
/**
 * True iff every top-K node has reached the minimum drill depth.
 */
export declare function topKDrillSatisfied(state: RespondentState, topK: readonly ContinuousNodeId[], questionsById: ReadonlyMap<number, QuestionDef>): boolean;
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
export declare function selectTopKDrillQuestion(state: RespondentState, available: QuestionDef[], questionsById: ReadonlyMap<number, QuestionDef>, topK: readonly ContinuousNodeId[]): QuestionDef | null;
