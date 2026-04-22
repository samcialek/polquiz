import type { QuestionDef, RespondentState } from "../types.js";
export declare function applySingleChoiceAnswer(state: RespondentState, q: QuestionDef, optionKey: string): void;
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
export declare function applyPairwiseAnswer(state: RespondentState, q: QuestionDef, answers: Record<string, string>): void;
