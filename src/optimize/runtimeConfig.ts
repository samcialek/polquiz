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

  // Stop rule (distance-native; gap_ratio = (d_second - d_leader) / d_leader)
  STOP_MIN_QUESTIONS: number;
  STOP_DISTANCE_MAX: number;
  STOP_GAP_RATIO_MIN: number;
  STOP_MIN_CONSECUTIVE_LEADS: number;
  STOP_AGREEMENT_K: number;

  // Ultra-confidence stop (earlier, tighter distance/gap)
  UC_MIN_Q: number;
  UC_DISTANCE_MAX: number;
  UC_GAP_RATIO_MIN: number;
  UC_CONSECUTIVE: number;

  // Secondary stop (later, relaxed)
  SECONDARY_MIN_Q: number;
  SECONDARY_DISTANCE_MAX: number;
  SECONDARY_GAP_RATIO_MIN: number;
  SECONDARY_CONSECUTIVE: number;

  // Late-game stop
  LATE_GAME_MIN_Q: number;
  LATE_GAME_DISTANCE_MAX: number;
  LATE_GAME_GAP_RATIO_MIN: number;
  LATE_GAME_CONSECUTIVE: number;

  // Hard cap on questions answered
  HARD_CAP_Q: number;
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

  // Stop rule (distance-native). Placeholders — calibrate in Stage 4.
  STOP_MIN_QUESTIONS: 25,
  STOP_DISTANCE_MAX: 8,
  STOP_GAP_RATIO_MIN: 0.10,
  STOP_MIN_CONSECUTIVE_LEADS: 3,
  STOP_AGREEMENT_K: 3,

  // Ultra-confidence stop (earlier, tighter)
  UC_MIN_Q: 20,
  UC_DISTANCE_MAX: 6,
  UC_GAP_RATIO_MIN: 0.25,
  UC_CONSECUTIVE: 8,

  // Secondary stop (later, relaxed)
  SECONDARY_MIN_Q: 35,
  SECONDARY_DISTANCE_MAX: 10,
  SECONDARY_GAP_RATIO_MIN: 0.05,
  SECONDARY_CONSECUTIVE: 6,

  // Late-game stop
  LATE_GAME_MIN_Q: 45,
  LATE_GAME_DISTANCE_MAX: 12,
  LATE_GAME_GAP_RATIO_MIN: 0.03,
  LATE_GAME_CONSECUTIVE: 4,

  // Hard cap on questions asked
  HARD_CAP_Q: 55,
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
