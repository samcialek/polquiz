/**
 * Runtime configuration for the quiz engine.
 * All tunable parameters are here so they can be adjusted
 * by the optimizer without modifying engine code.
 */

export interface RuntimeConfig {
  // 3-Phase question selection
  PHASE1_END: number;     // End of salience-first phase
  PHASE2_END: number;     // End of prune+discriminate phase

  // Legacy blend params (kept for compatibility)
  EXPLOIT_BLEND_START: number;
  EXPLOIT_BLEND_END: number;

  // Devil's advocate
  DEVILS_ADVOCATE_WEIGHT: number;

  // Batch selection
  BATCH_SIZE_MIN: number;
  BATCH_SIZE_MAX: number;
  BATCH_PRUNE_MIN_VIABLE: number;
  BATCH_SEARCH_DEPTH: number;
  NODE_OVERLAP_PENALTY: number;

  // Stop rule
  STOP_MIN_QUESTIONS: number;
  STOP_POSTERIOR_THRESHOLD: number;
  STOP_MARGIN_THRESHOLD: number;
  STOP_MIN_CONSECUTIVE_LEADS: number;
  STOP_AGREEMENT_K: number;

  // Secondary stop
  SECONDARY_MIN_Q: number;

  // High-confidence override
  HC_POSTERIOR: number;
  HC_MARGIN: number;
  HC_CONSECUTIVE: number;
  HC_COSINE_BLOCK: number;

  // Ultra-confidence stop
  UC_MIN_Q: number;
  UC_POSTERIOR: number;
  UC_MARGIN: number;
  UC_CONSECUTIVE: number;

  // Late game stop
  LATE_GAME_MIN_Q: number;
  LATE_GAME_POSTERIOR: number;
  LATE_GAME_MARGIN: number;
  LATE_GAME_CONSECUTIVE: number;
}

const DEFAULT_CONFIG: RuntimeConfig = {
  // 3-Phase question selection
  PHASE1_END: 16,         // First 16 questions: salience-first
  PHASE2_END: 28,         // Questions 17-28: prune + discriminate

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

let _config: RuntimeConfig = { ...DEFAULT_CONFIG };

export function getConfig(): RuntimeConfig {
  return _config;
}

export function setConfig(overrides: Partial<RuntimeConfig>): void {
  _config = { ..._config, ...overrides };
}

export function resetConfig(): void {
  _config = { ...DEFAULT_CONFIG };
}
