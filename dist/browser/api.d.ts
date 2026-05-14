/**
 * PRISM Quiz Engine — Browser API
 *
 * Self-contained browser-facing API that wraps the engine.
 * Bundled as an IIFE and exposed as window.PrismEngine.
 */
import type { QuestionDef } from "../types.js";
import type { IdentityPrimaryDemographics, IdentityPrimaryResult } from "../identity/resolveIdentityPrimary.js";
import { type EngagementLabel } from "../engine/engagementLabel.js";
import { type ElectionPrediction } from "../historical/respondentVoteChoice.js";
export declare const BUNDLE_VERSION = "20260513-untruncate-labels";
export { composeArchetypeLabel, tokenizeRespondent } from "../identity/archetypeLabeler.js";
export { composeArchetypeDescription, composeAtomFallback, LABEL_DESCRIPTIONS } from "../identity/labelDescriptions.js";
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
    /** Pairwise sub-option keys per pair: { pairId: [optA, optB] } */
    pairOptions?: Record<string, string[]>;
    /** Best/worst items if applicable */
    bestWorstItems?: string[];
    /** Best-worst picks per side (top-N / bottom-N). Default 1. */
    bwMaxPicks?: number;
    /** Dual-axis map (node + x-axis endpoint posteriors) for `dual_axis` uiType. */
    dualAxisMap?: {
        node: string;
        xLow: number[];
        xHigh: number[];
    };
    /** Strength/ratio follow-up metadata rendered after the primary answer. */
    strengthFollowUp?: {
        kind: "strength" | "ratio";
        prompt: string;
        labels?: Record<string, string>;
    };
}
export interface QuizProgress {
    questionsAnswered: number;
    estimatedTotal: number;
    phase: "salience" | "discriminate" | "converge";
}
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
export declare function initQuiz(): void;
/**
 * Submit optional demographic answers for the identity-primary resolver.
 * Called once at end of quiz, only if the resolver has signaled that
 * demographic confirmation would refine the result.
 *
 * Recognized keys: demo_ethnicity, demo_gender, demo_religion, demo_lgbtq.
 * Other keys are stored but not consumed by the current resolver.
 */
export declare function submitDemographics(demographics: IdentityPrimaryDemographics | null): void;
/**
 * Inspect the identity-primary resolver gate without committing demographics.
 * Used by the UI to decide whether the demographic mini-block should render.
 * Returns the resolver result with `state: 'unresolved'` and reason codes
 * indicating which gates passed/failed. If demographic confirmation is the
 * only missing piece, the UI prompts; otherwise it skips.
 */
export declare function previewIdentityPrimary(): IdentityPrimaryResult | null;
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
} | {
    best: string[];
    worst: string[];
} | {
    x: number;
    y: number;
} | {
    supportHigh: string[];
    supportMid: string[];
    neutral: string[];
    opposeHigh: string[];
}): void;
/**
 * Get current quiz progress. estimatedTotal is the *typical* run length, not
 * a hard cap — the actual stop rule lives in selectorEIG.ts (hard cap 35).
 * Display layer should render this with a tilde ("~32 questions") so the
 * counter reads naturally when a heavier respondent runs to 33-35.
 */
export declare function getProgress(): QuizProgress;
/**
 * Check whether the engine has enough data to produce a result.
 */
export declare function isComplete(): boolean;
/**
 * Get final quiz results. The 124-centroid Bayesian matcher was retired
 * 2026-05-13 — `match`, `top3`, `top5`, `confidence`, `confidenceBand`,
 * `family`, and `diagnostics` are gone. The user-facing identity is the
 * composed label (consumers call composeArchetypeLabel + the description
 * helper on respondentState directly). Engagement and the identity-primary
 * overlay still resolve here.
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
 * Get the respondent's current node state for results display.
 * Returns continuous node expected values and categorical distributions.
 */
export declare function getRespondentState(): Record<string, unknown> | null;
export declare function getIdentityPrimaryResult(demographics?: IdentityPrimaryDemographics | null): IdentityPrimaryResult | null;
export declare function applyRatioBoost(questionId: number, ratio: number): void;
/**
 * Per-election vote prediction from the respondent's signature.
 * Runs era-weighted Euclidean distance against each election's candidates and
 * applies an engagement-driven clearing bar to decide vote vs abstain.
 * Independent of archetype classification — archetype is a label only.
 */
export declare function getElectionPredictions(): ElectionPrediction[];
/**
 * Check if the user can go back to the previous question.
 */
export declare function canGoBack(): boolean;
/**
 * Go back to the previous question by restoring the snapshot.
 * Returns the question ID that was undone (so UI can re-render that question).
 */
export declare function goBack(): number | null;
