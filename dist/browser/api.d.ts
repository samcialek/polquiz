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
export declare const BUNDLE_VERSION = "20260428-pr2-q102-escalation";
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
    topArchetypes: Array<{
        id: string;
        name: string;
        distance: number;
    }>;
    /** Distance-based confidence proxy: gap_ratio = (d_second - d_leader) / d_leader, clamped [0, 1]. */
    confidence: number;
    phase: "salience" | "discriminate" | "converge";
}
export interface ArchetypeResult {
    id: string;
    name: string;
    tier: string;
    distance: number;
}
export interface FamilyResult {
    /** True when the runner-up is in the leader's pre-computed family set. */
    isFamily: boolean;
    /** ID of the runner-up family member. */
    partnerId?: string;
    /** Display name of the runner-up family member. */
    partnerName?: string;
}
export interface QuizResults {
    /** Base archetype match from policy-based distance scoring (always populated). */
    match: ArchetypeResult;
    top3: ArchetypeResult[];
    /**
     * Top 5 closest archetypes (superset of top3). Used by the results page's
     * low-confidence cluster gate (ADR-008): when confidenceBand !== "confident",
     * the page picks neighbors within +0.05 of the leader's distance, capped at
     * 5 displayed, floored at the top 3.
     */
    top5: ArchetypeResult[];
    questionsAnswered: number;
    /** Distance-based confidence proxy: gap_ratio between leader and runner-up, clamped [0, 1]. */
    confidence: number;
    /**
     * Confidence band (added 2026-04-24 per ADR-008). The matcher should not
     * present a single archetype as definitive when the leader-runner-up margin
     * is tiny. Three bands:
     *   "confident"  — confidence >= 0.05 (5%+ margin); single archetype headline
     *   "cluster"    — 0.02 <= confidence < 0.05; show top-3 as a cluster
     *   "uncertain"  — confidence < 0.02; refuse single label, suggest more
     *                  questions or present blended top-3
     */
    confidenceBand: "confident" | "cluster" | "uncertain";
    /** Family/subtype info when the runner-up is in the leader's family set. */
    family?: FamilyResult;
    /** Engagement label (ADR-002): standalone module derived from ENG state, independent of archetype match. */
    engagement: EngagementLabel;
    /**
     * Identity-primary overlay (ADR-006): null unless the respondent passed all
     * four gates — TRB/PF, ideology-thinness, anchor dominance, and demographic
     * confirmation. When non-null, contains the identity-primary label, state,
     * and reason codes. The base `match` is always retained — UX layer decides
     * how to combine them.
     */
    identityPrimary: IdentityPrimaryResult | null;
    /**
     * Why-this-result diagnostics (ADR-008). Per-node contribution to the
     * winning archetype's distance score: nodes that pulled toward the winner
     * (negative contributions) vs nodes that pushed away (positive). Plus
     * margin to runner-up. Surfaced for the results page so the user can see
     * which dimensions drove the classification.
     */
    diagnostics: {
        /** Top 5 nodes whose contribution to the winner's distance was lowest
         *  (most-aligned). */
        pullingTowardWinner: Array<{
            node: string;
            contribution: number;
            userPos: number;
            archetypePos: number;
        }>;
        /** Top 5 nodes whose contribution was highest (most-divergent). */
        pushingAwayFromWinner: Array<{
            node: string;
            contribution: number;
            userPos: number;
            archetypePos: number;
        }>;
        /** Distance to runner-up minus distance to winner. */
        marginToRunnerUp: number;
    };
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
