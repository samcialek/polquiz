import type { QuestionDef, RespondentState, TrbAnchor } from "../types.js";
/**
 * Mirror a MOR salience update into morBoundaries.intensity. Salience evidence
 * directly signals "how cognitively active is the moral-circle dimension for
 * this respondent" — exactly what intensity captures. `salDist` should be a
 * 4-band salience likelihood ([P(sal=0..3)] from the per-question likelihood
 * tables); we convert to expected sal on the 0..3 scale and bump intensity
 * toward it.
 *
 * Exported so `api.ts applyStoredRatioBoost` (which mutates salDist outside
 * update.ts) can call this directly. Removed in 6.E.4 cleanup along with the
 * rest of the bridge.
 */
export declare function mirrorMorSalToIntensity(state: RespondentState, salDist: readonly number[] | undefined, weight?: number): void;
/**
 * Mirror trbAnchor evidence into morBoundaries. Each positive anchor signal
 * lifts the corresponding named boundary AND bumps intensity (except
 * universalist anchors, which lift nothing). `weight` scales mix to match
 * the legacy write's strength.
 */
export declare function mirrorAnchorToBoundaries(state: RespondentState, signals: Partial<Record<TrbAnchor, number>> | undefined, weight?: number): void;
export declare function applySingleChoiceAnswer(state: RespondentState, q: QuestionDef, optionKey: string): void;
/**
 * Multi-select answer: apply each selected option's evidence in turn. The
 * answer is recorded as the array of selected option keys; each option's
 * `optionEvidence` block is applied independently.
 */
export declare function applyMultiAnswer(state: RespondentState, q: QuestionDef, optionKeys: string[]): void;
export declare function applySliderAnswer(state: RespondentState, q: QuestionDef, rawValue: number): void;
export declare function applyAllocationAnswer(state: RespondentState, q: QuestionDef, allocation: Record<string, number>): void;
export declare function applyRankingAnswer(state: RespondentState, q: QuestionDef, ranking: string[]): void;
/**
 * Apply a top-N / bottom-N best-worst answer as a per-item salience update.
 *
 * Unlike applyRankingAnswer, which weights evidence by rank position within a flat
 * ordering, this routine treats every item independently: items picked as "best"
 * receive SAL_IF_BEST; items picked as "worst" receive SAL_IF_WORST; everything
 * else receives SAL_IF_MIDDLE. The rankingMap entry for each item identifies which
 * nodes that item's salience evidence applies to; the rankingMap's scalar values
 * are intentionally ignored here (this is a salience-only question).
 */
export declare function applyBestWorstSalience(state: RespondentState, q: QuestionDef, best: string[], worst: string[], allItems: string[]): void;
/**
 * Apply a priority-sort (card-sort) answer with four buckets:
 *   supportHigh — "central to my politics" (care + agree, strong)
 *   supportMid  — "I support it, but it isn't central"       (care + agree, mild)
 *   neutral     — "not central to my politics"               (don't care)
 *   opposeHigh  — "opposing this is central to my politics"  (care + disagree, strong)
 *
 * Salience (aggregated per-node across items):
 *   supportHigh OR opposeHigh present → SAL_PRIORITY_HIGH
 *   supportMid present                → SAL_PRIORITY_MID
 *   neutral only                      → SAL_PRIORITY_LOW
 *
 * Position (per-item mixing):
 *   supportHigh → pull toward pole at PRIORITY_HIGH_POS_MIX
 *   supportMid  → pull toward pole at PRIORITY_MID_POS_MIX
 *   neutral     → skip
 *   opposeHigh  → pull toward INVERTED pole distribution at PRIORITY_HIGH_POS_MIX
 *                 (same inversion pattern as applyBestWorstSalience's worst case)
 */
export declare function applyPrioritySort(state: RespondentState, q: QuestionDef, placements: {
    supportHigh: string[];
    supportMid: string[];
    neutral: string[];
    opposeHigh: string[];
}, allItems: string[]): void;
/**
 * Dual-axis answer. A single grid tap produces (x, y) both in [0, 1]:
 *   x → position target via linear interp between `xLow` and `xHigh`,
 *       convex-mixed into posDist at DUAL_AXIS_POS_MIX.
 *   y → salience likelihood via `dualAxisYtoSal`, multiplied into salDist.
 *
 * Applies to the single node declared in q.dualAxisMap.node. Any additional
 * touchProfile entries are registered but not updated here — the gesture
 * directly signals only that node.
 */
export declare function applyDualAxisAnswer(state: RespondentState, q: QuestionDef, answer: {
    x: number;
    y: number;
}): void;
export declare function applyPairwiseAnswer(state: RespondentState, q: QuestionDef, answers: Record<string, string>): void;
