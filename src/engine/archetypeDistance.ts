import type {
  Archetype,
  RespondentState,
} from "../types.js";
import { CONTINUOUS_NODES, CATEGORICAL_NODES } from "../config/nodes.js";
import { CATEGORY_COST_MATRIX } from "../config/categories.js";

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

/**
 * Weighted scalar distance between a respondent's current state and an archetype.
 * Lower distance = better match. Writes into state.archetypeDistances via the
 * engine's update step; argmin over that map is the winner.
 *
 * Restored 2026-04-17 per ADR-003 after the Phase-3 Euclidean-WTA experiment
 * dropped top-1 from 86.8% → 45.5%. Diagnostic 1 showed this scorer recovers
 * 81.0% when fed Phase-3's selector's final states. The Phase-3 WTA is
 * preserved at archetypeDistanceWTA.ts as evidence. Prior / trbAnchorPrior
 * fields are NOT reinstated — D1 established they were always uniform and
 * cancelled under softmax normalization, so the softmax wrapper is gone too.
 *
 * Combines position mean-difference, position probability-at-target-pos,
 * salience mean-difference, and salience probability-at-target-sal. Weighted
 * by archetype-salience (high-sal nodes differentiate more) and respondent-
 * salience (nodes the respondent cares about weight more heavily). Anti flags
 * contribute a soft penalty scaled by how far past the threshold the expected
 * respondent position has drifted.
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

    const expectedPos =
      nodeState.posDist[0] * 1 +
      nodeState.posDist[1] * 2 +
      nodeState.posDist[2] * 3 +
      nodeState.posDist[3] * 4 +
      nodeState.posDist[4] * 5;

    const posProb = nodeState.posDist[template.pos - 1] ?? 0.2;

    const expectedSal =
      nodeState.salDist[0] * 0 +
      nodeState.salDist[1] * 1 +
      nodeState.salDist[2] * 2 +
      nodeState.salDist[3] * 3;

    const salProb = nodeState.salDist[template.sal] ?? 0.25;

    const posMeanDiff = Math.abs(expectedPos - template.pos) / 4;
    const posProbDist = 1 - posProb;

    const salMeanDiff = Math.abs(expectedSal - template.sal) / 3;
    const salProbDist = 1 - salProb;

    const positionDist = posMeanDiff * 0.6 + posProbDist * 0.4;
    const salienceDist = salMeanDiff * 0.6 + salProbDist * 0.4;

    let antiPenalty = 0;
    if (template.anti === "high" && expectedPos > 3.8) {
      antiPenalty = 0.8 * (expectedPos - 3.8) / 1.2;
    } else if (template.anti === "low" && expectedPos < 2.2) {
      antiPenalty = 0.8 * (2.2 - expectedPos) / 1.2;
    }

    const archSalWeight = 0.5 + template.sal * 0.5;
    const respondentSalWeight = 0.5 + expectedSal * 0.25;

    const nodeWeight = archSalWeight * respondentSalWeight;
    const nodeDist = positionDist * 0.65 + salienceDist * 0.35 + antiPenalty;

    totalDist += nodeDist * nodeWeight;
    totalWeight += nodeWeight;
  }

  for (const nodeId of CATEGORICAL_NODES) {
    const template = archetype.nodes[nodeId];
    if (!template || template.kind !== "categorical") continue;
    const nodeState = state.categorical[nodeId];

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

    let dot = 0;
    for (let i = 0; i < 6; i++) {
      dot += nodeState.catDist[i] * template.probs[i];
    }
    const dotDist = 1 - dot;

    let antiCatPenalty = 0;
    if (template.antiCats) {
      for (const antiIdx of template.antiCats) {
        if (antiIdx >= 0 && antiIdx < 6) {
          antiCatPenalty += nodeState.catDist[antiIdx] * 0.5;
        }
      }
    }

    const expectedSal =
      nodeState.salDist[0] * 0 +
      nodeState.salDist[1] * 1 +
      nodeState.salDist[2] * 2 +
      nodeState.salDist[3] * 3;
    const salDiff = Math.abs(expectedSal - template.sal) / 3;

    const archSalWeight = 0.5 + template.sal * 0.5;
    const respondentSalWeight = 0.5 + expectedSal * 0.25;
    const nodeWeight = archSalWeight * respondentSalWeight;

    const catDist = catCostDist * 0.5 + dotDist * 0.5;
    const nodeDist = catDist * 0.65 + salDiff * 0.35 + antiCatPenalty;

    totalDist += nodeDist * nodeWeight;
    totalWeight += nodeWeight;
  }

  return totalWeight > 0 ? totalDist / totalWeight : 0;
}

/**
 * V1: Salience-Gated Accumulative scoring (legacy, preserved for diagnostics).
 *
 * Skips sal=0 nodes; accumulates log-likelihood weighted by salience. Used by
 * the optimization sweep in src/optimize/. Not used in production scoring.
 */
export function archetypeDistanceV1(
  state: RespondentState,
  archetype: Archetype
): number {
  let logLikelihood = 0;

  for (const nodeId of CONTINUOUS_NODES) {
    const template = archetype.nodes[nodeId];
    if (!template || template.kind !== "continuous") continue;
    if (template.sal === 0) continue;

    const nodeState = state.continuous[nodeId];
    const posProb = nodeState.posDist[template.pos - 1] ?? 0.2;
    const salProb = nodeState.salDist[template.sal] ?? 0.25;
    const salWeight = template.sal;

    logLikelihood += salWeight * Math.log(posProb + 0.001);
    logLikelihood += 0.5 * salWeight * Math.log(salProb + 0.001);

    const pR = expectedPos(nodeState.posDist);
    if (template.anti === "high" && pR > 3.8) {
      logLikelihood -= 2.0 * salWeight;
    } else if (template.anti === "low" && pR < 2.2) {
      logLikelihood -= 2.0 * salWeight;
    }
  }

  for (const nodeId of CATEGORICAL_NODES) {
    const template = archetype.nodes[nodeId];
    if (!template || template.kind !== "categorical") continue;
    if (template.sal === 0) continue;

    const nodeState = state.categorical[nodeId];
    let dot = 0;
    for (let i = 0; i < 6; i++) {
      dot += nodeState.catDist[i] * template.probs[i];
    }
    const salProb = nodeState.salDist[template.sal] ?? 0.25;
    const salWeight = template.sal;

    logLikelihood += salWeight * Math.log(dot + 0.001);
    logLikelihood += 0.5 * salWeight * Math.log(salProb + 0.001);

    if (template.antiCats) {
      for (const antiIdx of template.antiCats) {
        if (antiIdx >= 0 && antiIdx < 6) {
          logLikelihood -= nodeState.catDist[antiIdx] * 1.5 * salWeight;
        }
      }
    }
  }

  return -logLikelihood;
}

/**
 * V2: Touch-Weighted Sharpened scoring (legacy, preserved for diagnostics).
 * Skips 0-touch nodes and scales node weight by log(1 + touches).
 */
export function archetypeDistanceV2(
  state: RespondentState,
  archetype: Archetype
): number {
  let totalDist = 0;
  let totalWeight = 0;

  for (const nodeId of CONTINUOUS_NODES) {
    const template = archetype.nodes[nodeId];
    if (!template || template.kind !== "continuous") continue;
    const nodeState = state.continuous[nodeId];
    if (nodeState.touches === 0) continue;

    const pR = expectedPos(nodeState.posDist);
    const posProb = nodeState.posDist[template.pos - 1] ?? 0.2;
    const sR = expectedSal(nodeState.salDist);
    const salProb = nodeState.salDist[template.sal] ?? 0.25;

    const posMeanDiff = Math.abs(pR - template.pos) / 4;
    const posProbDist = 1 - posProb;
    const salMeanDiff = Math.abs(sR - template.sal) / 3;
    const salProbDist = 1 - salProb;

    const positionDist = posMeanDiff * 0.6 + posProbDist * 0.4;
    const salienceDist = salMeanDiff * 0.6 + salProbDist * 0.4;

    let antiPenalty = 0;
    if (template.anti === "high" && pR > 3.8) {
      antiPenalty = 0.8 * (pR - 3.8) / 1.2;
    } else if (template.anti === "low" && pR < 2.2) {
      antiPenalty = 0.8 * (2.2 - pR) / 1.2;
    }

    const archSalWeight = 0.25 + template.sal * 0.75;
    const respondentSalWeight = 0.5 + sR * 0.25;
    const touchWeight = Math.log(1 + nodeState.touches);
    const nodeWeight = archSalWeight * respondentSalWeight * touchWeight;
    const nodeDist = positionDist * 0.65 + salienceDist * 0.35 + antiPenalty;

    totalDist += nodeDist * nodeWeight;
    totalWeight += nodeWeight;
  }

  for (const nodeId of CATEGORICAL_NODES) {
    const template = archetype.nodes[nodeId];
    if (!template || template.kind !== "categorical") continue;
    const nodeState = state.categorical[nodeId];
    if (nodeState.touches === 0) continue;

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
    let dot = 0;
    for (let i = 0; i < 6; i++) {
      dot += nodeState.catDist[i] * template.probs[i];
    }
    const dotDist = 1 - dot;

    let antiCatPenalty = 0;
    if (template.antiCats) {
      for (const antiIdx of template.antiCats) {
        if (antiIdx >= 0 && antiIdx < 6) {
          antiCatPenalty += nodeState.catDist[antiIdx] * 0.5;
        }
      }
    }

    const sR = expectedSal(nodeState.salDist);
    const salDiff = Math.abs(sR - template.sal) / 3;

    const archSalWeight = 0.25 + template.sal * 0.75;
    const respondentSalWeight = 0.5 + sR * 0.25;
    const touchWeight = Math.log(1 + nodeState.touches);
    const nodeWeight = archSalWeight * respondentSalWeight * touchWeight;

    const catDist = catCostDist * 0.5 + dotDist * 0.5;
    const nodeDist = catDist * 0.65 + salDiff * 0.35 + antiCatPenalty;

    totalDist += nodeDist * nodeWeight;
    totalWeight += nodeWeight;
  }

  return totalWeight > 0 ? totalDist / totalWeight : 0;
}

/**
 * Filter archetypes by relative distance to the leader. Returns archetypes
 * within (1 + ratio) * d_min. Replaces viableArchetypes which read posteriors.
 */
export function viableByDistance(
  state: RespondentState,
  archetypes: Archetype[],
  ratio = 1.0
): Archetype[] {
  const distances = state.archetypeDistances;
  const values = Object.values(distances).filter((v) => Number.isFinite(v));
  if (values.length === 0) return archetypes;
  const dMin = Math.min(...values);
  if (!Number.isFinite(dMin) || dMin < 0) return archetypes;
  const cutoff = dMin * (1 + ratio);
  return archetypes.filter((a) => {
    const d = distances[a.id];
    if (d === undefined) return true;
    return d <= cutoff;
  });
}

/**
 * Pre-computed rank-based weight distribution over the top-K archetypes
 * (by ascending distance), normalized to a probability distribution. Used by
 * adaptive selectors as the "concentration" proxy that posteriors used to play.
 *
 * w(a) = (d_max - d(a) + eps) / (d_max - d_min + eps), then normalize.
 */
export function topKDistanceWeights(
  state: RespondentState,
  archetypes: Archetype[],
  k = 8
): { archetype: Archetype; distance: number; weight: number }[] {
  const distances = state.archetypeDistances;
  const ranked = [...archetypes]
    .map((a) => ({ archetype: a, distance: distances[a.id] ?? Infinity }))
    .filter((r) => Number.isFinite(r.distance))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, k);

  if (ranked.length === 0) return [];
  if (ranked.length === 1) return [{ ...ranked[0]!, weight: 1 }];

  const eps = 1e-6;
  const dMin = ranked[0]!.distance;
  const dMax = ranked[ranked.length - 1]!.distance;
  const span = dMax - dMin + eps;

  const raw = ranked.map((r) => ({
    ...r,
    weight: (dMax - r.distance + eps) / span,
  }));
  const total = raw.reduce((s, r) => s + r.weight, 0);
  return raw.map((r) => ({ ...r, weight: total > 0 ? r.weight / total : 1 / raw.length }));
}
