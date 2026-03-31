/**
 * Runtime configuration for the quiz engine.
 * All tunable parameters are here so they can be adjusted
 * by the optimizer without modifying engine code.
 */
const DEFAULT_CONFIG = {
    // 3-Phase question selection
    PHASE1_END: 16, // First 16 questions: salience-first
    PHASE2_END: 28, // Questions 17-28: prune + discriminate
    // Legacy blend (kept for compatibility)
    EXPLOIT_BLEND_START: 12,
    EXPLOIT_BLEND_END: 30,
    // Devil's advocate weight during exploitation
    DEVILS_ADVOCATE_WEIGHT: 0.3,
    // Batch selection
    BATCH_SIZE_MIN: 2,
    BATCH_SIZE_MAX: 4,
    BATCH_PRUNE_MIN_VIABLE: 5,
    BATCH_SEARCH_DEPTH: 10,
    NODE_OVERLAP_PENALTY: 0.5,
    // Stop rule
    STOP_MIN_QUESTIONS: 25,
    STOP_POSTERIOR_THRESHOLD: 0.25,
    STOP_MARGIN_THRESHOLD: 0.04,
    STOP_MIN_CONSECUTIVE_LEADS: 3,
    STOP_AGREEMENT_K: 3,
    // Secondary stop
    SECONDARY_MIN_Q: 35,
    // High-confidence override
    HC_POSTERIOR: 0.45,
    HC_MARGIN: 0.15,
    HC_CONSECUTIVE: 5,
    HC_COSINE_BLOCK: 0.96,
    // Ultra-confidence stop
    UC_MIN_Q: 20,
    UC_POSTERIOR: 0.90,
    UC_MARGIN: 0.30,
    UC_CONSECUTIVE: 8,
    // Late game stop
    LATE_GAME_MIN_Q: 45,
    LATE_GAME_POSTERIOR: 0.15,
    LATE_GAME_MARGIN: 0.03,
    LATE_GAME_CONSECUTIVE: 4,
};
let _config = { ...DEFAULT_CONFIG };
export function getConfig() {
    return _config;
}
export function setConfig(overrides) {
    _config = { ..._config, ...overrides };
}
export function resetConfig() {
    _config = { ...DEFAULT_CONFIG };
}
//# sourceMappingURL=runtimeConfig.js.map