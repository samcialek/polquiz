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
export function archetypeDistance(state, archetype) {
    let totalDist = 0;
    let totalWeight = 0;
    for (const nodeId of CONTINUOUS_NODES) {
        const template = archetype.nodes[nodeId];
        if (!template || template.kind !== "continuous")
            continue;
        const nodeState = state.continuous[nodeId];
        // Expected position (1-indexed): weighted mean of posDist
        const expectedPos = nodeState.posDist[0] * 1 +
            nodeState.posDist[1] * 2 +
            nodeState.posDist[2] * 3 +
            nodeState.posDist[3] * 4 +
            nodeState.posDist[4] * 5;
        // Position probability at archetype's position
        const posProb = nodeState.posDist[template.pos - 1] ?? 0.2;
        // Expected salience (0-indexed): weighted mean of salDist
        const expectedSal = nodeState.salDist[0] * 0 +
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
        }
        else if (template.anti === "low" && expectedPos < 2.2) {
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
        if (!template || template.kind !== "categorical")
            continue;
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
        const expectedSal = nodeState.salDist[0] * 0 +
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
 * V1: Salience-Gated Accumulative scoring.
 * Instead of averaging across all nodes, only scores nodes where archetype
 * has sal >= 1 and accumulates log-likelihood (no division by total weight).
 * Niche archetypes with more salient nodes get MORE signal, not diluted signal.
 */
export function archetypeDistanceV1(state, archetype) {
    let logLikelihood = 0;
    for (const nodeId of CONTINUOUS_NODES) {
        const template = archetype.nodes[nodeId];
        if (!template || template.kind !== "continuous")
            continue;
        if (template.sal === 0)
            continue; // gate: skip sal=0 nodes entirely
        const nodeState = state.continuous[nodeId];
        // Position probability at archetype's position
        const posProb = nodeState.posDist[template.pos - 1] ?? 0.2;
        // Salience probability at archetype's salience level
        const salProb = nodeState.salDist[template.sal] ?? 0.25;
        // Weight by archetype salience (1, 2, or 3)
        const salWeight = template.sal;
        // Accumulate log-likelihood
        logLikelihood += salWeight * Math.log(posProb + 0.001);
        logLikelihood += 0.5 * salWeight * Math.log(salProb + 0.001);
        // Anti-position penalty
        const expectedPos = nodeState.posDist[0] * 1 +
            nodeState.posDist[1] * 2 +
            nodeState.posDist[2] * 3 +
            nodeState.posDist[3] * 4 +
            nodeState.posDist[4] * 5;
        if (template.anti === "high" && expectedPos > 3.8) {
            logLikelihood -= 2.0 * salWeight;
        }
        else if (template.anti === "low" && expectedPos < 2.2) {
            logLikelihood -= 2.0 * salWeight;
        }
    }
    for (const nodeId of CATEGORICAL_NODES) {
        const template = archetype.nodes[nodeId];
        if (!template || template.kind !== "categorical")
            continue;
        if (template.sal === 0)
            continue; // gate
        const nodeState = state.categorical[nodeId];
        // Dot product of respondent's catDist and archetype's probs
        let dot = 0;
        for (let i = 0; i < 6; i++) {
            dot += nodeState.catDist[i] * template.probs[i];
        }
        const salProb = nodeState.salDist[template.sal] ?? 0.25;
        const salWeight = template.sal;
        logLikelihood += salWeight * Math.log(dot + 0.001);
        logLikelihood += 0.5 * salWeight * Math.log(salProb + 0.001);
        // Anti-category penalty
        if (template.antiCats) {
            for (const antiIdx of template.antiCats) {
                if (antiIdx >= 0 && antiIdx < 6) {
                    logLikelihood -= nodeState.catDist[antiIdx] * 1.5 * salWeight;
                }
            }
        }
    }
    return -logLikelihood; // negate so lower = better
}
/**
 * V2: Touch-Weighted Sharpened scoring.
 * Same weighted-average structure as baseline but:
 * 1. Skips nodes with 0 touches (don't dilute with unmeasured nodes)
 * 2. Scales nodeWeight by log(1 + touches)
 * 3. Wider archSalWeight range: 0.25 + sal * 0.75
 */
export function archetypeDistanceV2(state, archetype) {
    let totalDist = 0;
    let totalWeight = 0;
    for (const nodeId of CONTINUOUS_NODES) {
        const template = archetype.nodes[nodeId];
        if (!template || template.kind !== "continuous")
            continue;
        const nodeState = state.continuous[nodeId];
        // Skip nodes with 0 touches
        if (nodeState.touches === 0)
            continue;
        const expectedPos = nodeState.posDist[0] * 1 +
            nodeState.posDist[1] * 2 +
            nodeState.posDist[2] * 3 +
            nodeState.posDist[3] * 4 +
            nodeState.posDist[4] * 5;
        const posProb = nodeState.posDist[template.pos - 1] ?? 0.2;
        const expectedSal = nodeState.salDist[0] * 0 +
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
        }
        else if (template.anti === "low" && expectedPos < 2.2) {
            antiPenalty = 0.8 * (2.2 - expectedPos) / 1.2;
        }
        // Wider archSalWeight range
        const archSalWeight = 0.25 + template.sal * 0.75; // 0.25 to 2.5
        const respondentSalWeight = 0.5 + expectedSal * 0.25;
        // Scale by touch count
        const touchWeight = Math.log(1 + nodeState.touches);
        const nodeWeight = archSalWeight * respondentSalWeight * touchWeight;
        const nodeDist = positionDist * 0.65 + salienceDist * 0.35 + antiPenalty;
        totalDist += nodeDist * nodeWeight;
        totalWeight += nodeWeight;
    }
    for (const nodeId of CATEGORICAL_NODES) {
        const template = archetype.nodes[nodeId];
        if (!template || template.kind !== "categorical")
            continue;
        const nodeState = state.categorical[nodeId];
        // Skip nodes with 0 touches
        if (nodeState.touches === 0)
            continue;
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
        const expectedSal = nodeState.salDist[0] * 0 +
            nodeState.salDist[1] * 1 +
            nodeState.salDist[2] * 2 +
            nodeState.salDist[3] * 3;
        const salDiff = Math.abs(expectedSal - template.sal) / 3;
        const archSalWeight = 0.25 + template.sal * 0.75;
        const respondentSalWeight = 0.5 + expectedSal * 0.25;
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
 * Return archetypes that are still "viable" — i.e. their posterior
 * is above a minimum threshold relative to the leader.
 */
export function viableArchetypes(state, archetypes, minRelative = 0.01) {
    const posteriors = state.archetypePosterior;
    const maxPosterior = Math.max(...Object.values(posteriors));
    if (maxPosterior <= 0)
        return archetypes;
    const threshold = maxPosterior * minRelative;
    return archetypes.filter((a) => (posteriors[a.id] ?? 0) >= threshold);
}
//# sourceMappingURL=archetypeDistance.js.map