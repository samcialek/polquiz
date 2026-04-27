import type { Archetype, RespondentState } from "../types.js";
import { CONTINUOUS_NODES, CATEGORICAL_NODES } from "../config/nodes.js";

/**
 * Euclidean Winner-Take-All scorer — PRESERVED AS EVIDENCE per ADR-003.
 *
 * Shipped under ADR-001 (Phase 3) and rolled back on 2026-04-17 after
 * Diagnostic 1 rejected ADR-001's premise. Diagnostic 3 identified the
 * failure as structural to WTA-in-Euclidean-13D (centroid-absorption),
 * not parameter miscalibration. Kept here so future work can inspect
 * exactly what was tried. NOT called from production; not exported from
 * any barrel. See:
 *   - results/architecture/ADR-003-rollback-scoring.md
 *   - results/phase3/diagnostic-1-uniform-priors.md
 *   - results/phase3/diagnostic-3-failure-profile.md
 *
 * D(A, R) = sqrt( sum_i d_i ) where each node i contributes:
 *   - Continuous: d_i = (p^A - p^R)^2 * max(s^A, s^R)  + (10 if anti triggered)
 *   - Categorical: d_i = (preferred_term + anti_term) * max(s^A, s^R)
 *       preferred_term: max(template.probs) >= 0.30 → (1 - p_R[argmax(template.probs)])
 *       anti_term:      sum over template.antiCats of p_R[antiCat]
 *
 * Anti penalty (continuous only): fixed +10 pre-sqrt when triggered.
 *   anti=="high" fires when respondent expected pos > 3.8
 *   anti=="low"  fires when respondent expected pos < 2.2
 */

const CATEGORICAL_PREFERRED_THRESHOLD = 0.30;
const ANTI_PENALTY = 10.0;
const ANTI_HIGH_THRESHOLD = 3.8;
const ANTI_LOW_THRESHOLD = 2.2;

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

export function archetypeDistanceWTA(
  state: RespondentState,
  archetype: Archetype
): number {
  let sumSquared = 0;

  for (const nodeId of CONTINUOUS_NODES) {
    const template = archetype.nodes[nodeId];
    if (!template || template.kind !== "continuous") continue;
    const nodeState = state.continuous[nodeId];

    const pR = expectedPos(nodeState.posDist);
    const pA = template.pos;
    const sR = expectedSal(nodeState.salDist);
    const sA = template.sal ?? 0; // SELF-cluster archetypes have no sal (ADR-005)
    const w = Math.max(sA, sR);

    const dp = pA - pR;
    let nodeContribution = (dp * dp) * w;

    if (template.anti === "high" && pR > ANTI_HIGH_THRESHOLD) {
      nodeContribution += ANTI_PENALTY;
    } else if (template.anti === "low" && pR < ANTI_LOW_THRESHOLD) {
      nodeContribution += ANTI_PENALTY;
    }

    sumSquared += nodeContribution;
  }

  for (const nodeId of CATEGORICAL_NODES) {
    const template = archetype.nodes[nodeId];
    if (!template || template.kind !== "categorical") continue;
    const nodeState = state.categorical[nodeId];

    let preferredTerm = 0;
    let preferredIdx = -1;
    let preferredProb = 0;
    for (let i = 0; i < 6; i++) {
      const p = template.probs[i] ?? 0;
      if (p > preferredProb) {
        preferredProb = p;
        preferredIdx = i;
      }
    }
    if (preferredProb >= CATEGORICAL_PREFERRED_THRESHOLD && preferredIdx >= 0) {
      preferredTerm = 1 - (nodeState.catDist[preferredIdx] ?? 0);
    }

    let antiTerm = 0;
    if (template.antiCats && template.antiCats.length > 0) {
      for (const antiIdx of template.antiCats) {
        if (antiIdx >= 0 && antiIdx < 6) {
          antiTerm += nodeState.catDist[antiIdx] ?? 0;
        }
      }
    }

    const sR = expectedSal(nodeState.salDist);
    const sA = template.sal ?? 0; // SELF-cluster archetypes have no sal (ADR-005)
    const w = Math.max(sA, sR);

    sumSquared += (preferredTerm + antiTerm) * w;
  }

  return Math.sqrt(sumSquared);
}
