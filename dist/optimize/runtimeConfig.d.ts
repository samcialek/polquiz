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
    STOP_POSTERIOR_THRESHOLD: number;
    STOP_MARGIN_THRESHOLD: number;
    STOP_MIN_CONSECUTIVE_LEADS: number;
    STOP_AGREEMENT_K: number;
    SECONDARY_MIN_Q: number;
    HC_POSTERIOR: number;
    HC_MARGIN: number;
    HC_CONSECUTIVE: number;
    HC_COSINE_BLOCK: number;
    UC_MIN_Q: number;
    UC_POSTERIOR: number;
    UC_MARGIN: number;
    UC_CONSECUTIVE: number;
    LATE_GAME_MIN_Q: number;
    LATE_GAME_POSTERIOR: number;
    LATE_GAME_MARGIN: number;
    LATE_GAME_CONSECUTIVE: number;
}
export declare function getConfig(): RuntimeConfig;
export declare function setConfig(overrides: Partial<RuntimeConfig>): void;
export declare function resetConfig(): void;
