import type { RespondentState } from "../types.js";
/**
 * Phase 3 engagement module (ADR-002).
 *
 * ENG is removed from archetype signatures but still tracked as a continuous
 * node in respondent state. This module derives a standalone engagement label
 * from the ENG posterior so the final result can surface a dual label like
 * "Civic Liberal, engaged (medium salience)" without ENG influencing the
 * archetype match.
 *
 * Thresholds below are plan-§5 placeholders pending Stage 4 calibration.
 */
export type EngagementLevel = "apolitical" | "casual" | "engaged" | "highly-engaged";
export type EngagementSalience = "low" | "medium" | "high";
export interface EngagementLabel {
    level: EngagementLevel;
    salience: EngagementSalience;
    /** Expected position on the 1-5 scale. */
    position: number;
    /** Expected salience on the 0-3 scale. */
    saliencePosition: number;
}
export declare function computeEngagementLabel(state: RespondentState): EngagementLabel;
