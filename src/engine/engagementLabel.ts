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

const APOLITICAL_MAX = 2.0;
const CASUAL_MAX = 3.0;
const ENGAGED_MAX = 4.0;

const SALIENCE_LOW_MAX = 1.0;
const SALIENCE_MEDIUM_MAX = 2.0;

function expectedPos(posDist: ArrayLike<number>): number {
  return (
    (posDist[0] ?? 0) * 1 +
    (posDist[1] ?? 0) * 2 +
    (posDist[2] ?? 0) * 3 +
    (posDist[3] ?? 0) * 4 +
    (posDist[4] ?? 0) * 5
  );
}

function expectedSal(salDist: ArrayLike<number>): number {
  return (
    (salDist[0] ?? 0) * 0 +
    (salDist[1] ?? 0) * 1 +
    (salDist[2] ?? 0) * 2 +
    (salDist[3] ?? 0) * 3
  );
}

function levelForPosition(pos: number): EngagementLevel {
  if (pos < APOLITICAL_MAX) return "apolitical";
  if (pos < CASUAL_MAX) return "casual";
  if (pos < ENGAGED_MAX) return "engaged";
  return "highly-engaged";
}

function salienceForPosition(sal: number): EngagementSalience {
  if (sal < SALIENCE_LOW_MAX) return "low";
  if (sal < SALIENCE_MEDIUM_MAX) return "medium";
  return "high";
}

export function computeEngagementLabel(state: RespondentState): EngagementLabel {
  const eng = state.continuous.ENG;
  const position = eng ? expectedPos(eng.posDist) : 3.0;
  const saliencePosition = eng ? expectedSal(eng.salDist) : 1.5;
  return {
    level: levelForPosition(position),
    salience: salienceForPosition(saliencePosition),
    position,
    saliencePosition,
  };
}
