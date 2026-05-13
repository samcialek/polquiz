import type { QuestionDef } from "../types.js";
import { AvgRespondentState } from "./stateAvg.js";
export declare function applySingleChoiceAnswerAvg(state: AvgRespondentState, q: QuestionDef, optionKey: string): void;
export declare function applySliderAnswerAvg(state: AvgRespondentState, q: QuestionDef, rawValue: number): void;
export declare function applyAllocationAnswerAvg(state: AvgRespondentState, q: QuestionDef, allocation: Record<string, number>): void;
export declare function applyRankingAnswerAvg(state: AvgRespondentState, q: QuestionDef, ranking: string[]): void;
export declare function applyBestWorstSalienceAvg(state: AvgRespondentState, q: QuestionDef, best: string[], worst: string[], allItems: string[]): void;
export declare function applyPrioritySortAvg(state: AvgRespondentState, q: QuestionDef, placements: {
    supportHigh: string[];
    supportMid: string[];
    neutral: string[];
    opposeHigh: string[];
}, allItems: string[]): void;
export declare function applyDualAxisAnswerAvg(state: AvgRespondentState, q: QuestionDef, answer: {
    x: number;
    y: number;
}): void;
export declare function applyPairwiseAnswerAvg(state: AvgRespondentState, q: QuestionDef, answers: Record<string, string>): void;
