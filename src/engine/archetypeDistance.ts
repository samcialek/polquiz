import type {
  Archetype,
  ContinuousNodeId,
  CategoricalNodeId,
  RespondentState,
} from "../types.js";
import { CONTINUOUS_NODES, CATEGORICAL_NODES } from "../config/nodes.js";
import { CATEGORY_COST_MATRIX } from "../config/categories.js";

/**
 * Compute the distance between a respondent's current state and an archetype.
 * Lower distance = better match.
 *
 * The distance considers both position and salience on each node,
 * weighted by the archetype's salience (high-sal nodes matter more
 * for differentiating that archetype) and the respondent's salience
 * (nodes the respondent cares about are weighted more heavily).
 */
export function archetypeDistance(
  state: RespondentState,
  archetype: Archetype
): number {
  let totalDist = 0;
  let totalWeight = 0;

  for (const nodeId of CONTINUOUS_NODES) {
    const template = archetype.nodes[nodeId];
    if (!template || template.kind !== "continuous") continue;
    const nodeState = state.continuous[nodeId];

    // Expected position (1-indexed): weighted mean of posDist
    const expectedPos =
      nodeState.posDist[0] * 1 +
      nodeState.posDist[1] * 2 +
      nodeState.posDist[2] * 3 +
      nodeState.posDist[3] * 4 +
      nodeState.posDist[4] * 5;

    // Position probability at archetype's position
    const posProb = nodeState.posDist[template.pos - 1] ?? 0.2;

    // Expected salience (0-indexed): weighted mean of salDist
    const expectedSal =
      nodeState.salDist[0] * 0 +
      nodeState.salDist[1] * 1 +
      nodeState.salDist[2] * 2 +
      nodeState.salDist[3] * 3;

    // Salience probability at archetype's salience level
    const salProb = nodeState.salDist[template.sal] ?? 0.25;

    // Position distance: use both mean difference and probability
    const posMeanDiff = Math.abs(expectedPos - template.pos) / 4;
    const posProbDist = 1 - posProb; // low prob = high distance

    // Salience distance
    const salMeanDiff = Math.abs(expectedSal - template.sal) / 3;
    const salProbDist = 1 - salProb;

    // Combined position distance (mean + probabilistic)
    const positionDist = posMeanDiff * 0.6 + posProbDist * 0.4;
    const salienceDist = salMeanDiff * 0.6 + salProbDist * 0.4;

    // Anti-position penalty: heavy penalty if respondent is at archetype's anti
    let antiPenalty = 0;
    if (template.anti === "high" && expectedPos > 3.8) {
      antiPenalty = 0.8 * (expectedPos - 3.8) / 1.2;
    } else if (template.anti === "low" && expectedPos < 2.2) {
      antiPenalty = 0.8 * (2.2 - expectedPos) / 1.2;
    }

    // Weight by archetype salience (high-sal nodes differentiate more)
    // AND respondent's salience (caring about a node makes mismatches worse)
    const archSalWeight = 0.5 + template.sal * 0.5; // 0.5 to 2.0
    const respondentSalWeight = 0.5 + expectedSal * 0.25; // 0.5 to 1.25

    const nodeWeight = archSalWeight * respondentSalWeight;
    const nodeDist = positionDist * 0.65 + salienceDist * 0.35 + antiPenalty;

    totalDist += nodeDist * nodeWeight;
    totalWeight += nodeWeight;
  }

  for (const nodeId of CATEGORICAL_NODES) {
    const template = archetype.nodes[nodeId];
    if (!template || template.kind !== "categorical") continue;
    const nodeState = state.categorical[nodeId];

    // Category distance using cost matrix
    const costMatrix = CATEGORY_COST_MATRIX[nodeId];
    let catCostDist = 0;
    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 6; j++) {
        catCostDist +=
          nodeState.catDist[i] *
          template.probs[j] *
          (costMatrix[i]?.[j] ?? 0);
      }
    }

    // Also compute 1 - dot product (angular distance)
    let dot = 0;
    for (let i = 0; i < 6; i++) {
      dot += nodeState.catDist[i] * template.probs[i];
    }
    const dotDist = 1 - dot;

    // Anti-category penalty
    let antiCatPenalty = 0;
    if (template.antiCats) {
      for (const antiIdx of template.antiCats) {
        if (antiIdx >= 0 && antiIdx < 6) {
          antiCatPenalty += nodeState.catDist[antiIdx] * 0.5;
        }
      }
    }

    // Salience distance
    const expectedSal =
      nodeState.salDist[0] * 0 +
      nodeState.salDist[1] * 1 +
      nodeState.salDist[2] * 2 +
      nodeState.salDist[3] * 3;
    const salDiff = Math.abs(expectedSal - template.sal) / 3;

    const archSalWeight = 0.5 + template.sal * 0.5;
    const respondentSalWeight = 0.5 + expectedSal * 0.25;
    const nodeWeight = archSalWeight * respondentSalWeight;

    // Blend cost-matrix distance with dot-product distance
    const catDist = catCostDist * 0.5 + dotDist * 0.5;
    const nodeDist = catDist * 0.65 + salDiff * 0.35 + antiCatPenalty;

    totalDist += nodeDist * nodeWeight;
    totalWeight += nodeWeight;
  }

  return totalWeight > 0 ? totalDist / totalWeight : 0;
}

/**
 * Return archetypes that are still "viable" — i.e. their posterior
 * is above a minimum threshold relative to the leader.
 */
export function viableArchetypes(
  state: RespondentState,
  archetypes: Archetype[],
  minRelative = 0.01
): Archetype[] {
  const posteriors = state.archetypePosterior;
  const maxPosterior = Math.max(...Object.values(posteriors));
  if (maxPosterior <= 0) return archetypes;

  const threshold = maxPosterior * minRelative;
  return archetypes.filter((a) => (posteriors[a.id] ?? 0) >= threshold);
}
