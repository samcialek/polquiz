import type { QuestionDef, RespondentState } from "../types.js";
export declare function applySingleChoiceAnswer(state: RespondentState, q: QuestionDef, optionKey: string): void;
export declare function applySliderAnswer(state: RespondentState, q: QuestionDef, rawValue: number): void;
export declare function applyAllocationAnswer(state: RespondentState, q: QuestionDef, allocation: Record<string, number>): void;
export declare function applyRankingAnswer(state: RespondentState, q: QuestionDef, ranking: string[]): void;
export declare function applyPairwiseAnswer(state: RespondentState, q: QuestionDef, answers: Record<string, string>): void;
