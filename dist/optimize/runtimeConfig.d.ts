/**
 * Runtime configuration for the quiz engine.
 * All tunable parameters are here so they can be adjusted
 * by the optimizer without modifying engine code.
 */
export interface RuntimeConfig {
    PHASE1_END: number;
    PHASE2_END: number;
    EXPLOIT_BLEND_START: number;
    EXPLOIT_BLEND_END: number;
    DEVILS_ADVOCATE_WEIGHT: number;
    BATCH_SIZE_MIN: number;
    BATCH_SIZE_MAX: number;
    BATCH_PRUNE_MIN_VIABLE: number;
    BATCH_SEARCH_DEPTH: number;
    NODE_OVERLAP_PENALTY: number;
    STOP_MIN_QUESTIONS: number;
    STOP_DISTANCE_MAX: number;
    STOP_GAP_RATIO_MIN: number;
    STOP_MIN_CONSECUTIVE_LEADS: number;
    STOP_AGREEMENT_K: number;
    UC_MIN_Q: number;
    UC_DISTANCE_MAX: number;
    UC_GAP_RATIO_MIN: number;
    UC_CONSECUTIVE: number;
    SECONDARY_MIN_Q: number;
    SECONDARY_DISTANCE_MAX: number;
    SECONDARY_GAP_RATIO_MIN: number;
    SECONDARY_CONSECUTIVE: number;
    LATE_GAME_MIN_Q: number;
    LATE_GAME_DISTANCE_MAX: number;
    LATE_GAME_GAP_RATIO_MIN: number;
    LATE_GAME_CONSECUTIVE: number;
    HARD_CAP_Q: number;
}
export declare function getConfig(): RuntimeConfig;
export declare function setConfig(overrides: Partial<RuntimeConfig>): void;
export declare function resetConfig(): void;
