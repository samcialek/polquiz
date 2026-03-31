/**
 * PRISM Quiz Engine — Browser API
 *
 * Self-contained browser-facing API that wraps the engine.
 * Bundled as an IIFE and exposed as window.PrismEngine.
 */
import type { QuestionDef } from "../types.js";
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
    slider?: {
        min: number;
        max: number;
    };
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
    topArchetypes: Array<{
        id: string;
        name: string;
        posterior: number;
    }>;
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
/**
 * Initialize a new quiz session.
 * Resets all state and loads archetypes + questions.
 */
export declare function initQuiz(): void;
/**
 * Get the next question the engine wants to ask.
 * Returns null if no more questions are available.
 */
export declare function getNextQuestion(): QuizQuestion | null;
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
export declare function submitAnswer(questionId: number, answer: string | number | string[] | Record<string, number> | Record<string, string> | {
    best: string;
    worst: string;
}): void;
/**
 * Get current quiz progress.
 */
export declare function getProgress(): QuizProgress;
/**
 * Check whether the engine has enough data to produce a result.
 */
export declare function isComplete(): boolean;
/**
 * Get final quiz results.
 * Can be called at any time, but results are most meaningful after isComplete() returns true.
 */
export declare function getResults(): QuizResults;
/**
 * Get the full list of question IDs available in the engine.
 */
export declare function getQuestionIds(): number[];
/**
 * Get the raw internal QuestionDef for a given ID (for advanced use).
 */
export declare function getQuestionDef(questionId: number): QuestionDef | undefined;
/**
 * Get the number of archetypes.
 */
export declare function getArchetypeCount(): number;
/**
 * Get the respondent's current node state for results display.
 * Returns continuous node expected values and categorical distributions.
 */
export declare function getRespondentState(): Record<string, unknown> | null;
