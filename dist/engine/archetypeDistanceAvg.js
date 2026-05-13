import { getPos, getSal, getCat } from "./stateAvg.js";
import { CONTINUOUS_NODES, CATEGORICAL_NODES } from "../config/nodes.js";
import { CATEGORY_COST_MATRIX } from "../config/categories.js";
export function archetypeDistanceAvg(state, archetype) {
    let totalDist = 0;
    let totalWeight = 0;
    for (const nodeId of CONTINUOUS_NODES) {
        const template = archetype.nodes[nodeId];
        if (!template || template.kind !== "continuous")
            continue;
        const pR = getPos(state, nodeId);
        const sR = getSal(state, nodeId);
        const sal = template.sal ?? 0;
        const posMeanDiff = Math.abs(pR - template.pos) / 4;
        const salMeanDiff = Math.abs(sR - sal) / 3;
        let antiPenalty = 0;
        if (template.anti === "high" && pR > 3.8) {
            antiPenalty = 0.8 * (pR - 3.8) / 1.2;
        }
        else if (template.anti === "low" && pR < 2.2) {
            antiPenalty = 0.8 * (2.2 - pR) / 1.2;
        }
        const archSalWeight = 0.5 + sal * 0.5;
        const respondentSalWeight = 0.5 + sR * 0.25;
        const nodeWeight = archSalWeight * respondentSalWeight;
        const nodeDist = posMeanDiff * 0.65 + salMeanDiff * 0.35 + antiPenalty;
        totalDist += nodeDist * nodeWeight;
        totalWeight += nodeWeight;
    }
    for (const nodeId of CATEGORICAL_NODES) {
        const template = archetype.nodes[nodeId];
        if (!template || template.kind !== "categorical")
            continue;
        const catDist = getCat(state, nodeId);
        const sR = getSal(state, nodeId);
        const costMatrix = CATEGORY_COST_MATRIX[nodeId];
        let catCostDist = 0;
        for (let i = 0; i < 6; i++) {
            for (let j = 0; j < 6; j++) {
                catCostDist +=
                    (catDist[i] ?? 0) *
                        (template.probs[j] ?? 0) *
                        (costMatrix[i]?.[j] ?? 0);
            }
        }
        let dot = 0;
        for (let i = 0; i < 6; i++) {
            dot += (catDist[i] ?? 0) * (template.probs[i] ?? 0);
        }
        const dotDist = 1 - dot;
        let antiCatPenalty = 0;
        if (template.antiCats) {
            for (const antiIdx of template.antiCats) {
                if (antiIdx >= 0 && antiIdx < 6) {
                    antiCatPenalty += (catDist[antiIdx] ?? 0) * 0.5;
                }
            }
        }
        const salDiff = Math.abs(sR - template.sal) / 3;
        const archSalWeight = 0.5 + template.sal * 0.5;
        const respondentSalWeight = 0.5 + sR * 0.25;
        const nodeWeight = archSalWeight * respondentSalWeight;
        const catBlend = catCostDist * 0.5 + dotDist * 0.5;
        const nodeDist = catBlend * 0.65 + salDiff * 0.35 + antiCatPenalty;
        totalDist += nodeDist * nodeWeight;
        totalWeight += nodeWeight;
    }
    return totalWeight > 0 ? totalDist / totalWeight : 0;
}
export function viableByDistanceAvg(state, archetypes, ratio = 1.0) {
    const distances = state.archetypeDistances;
    const values = Object.values(distances).filter((v) => Number.isFinite(v));
    if (values.length === 0)
        return archetypes;
    const dMin = Math.min(...values);
    if (!Number.isFinite(dMin) || dMin < 0)
        return archetypes;
    const cutoff = dMin * (1 + ratio);
    return archetypes.filter((a) => {
        const d = distances[a.id];
        if (d === undefined)
            return true;
        return d <= cutoff;
    });
}
export function topKDistanceWeightsAvg(state, archetypes, k = 8) {
    const distances = state.archetypeDistances;
    const ranked = [...archetypes]
        .map((a) => ({ archetype: a, distance: distances[a.id] ?? Infinity }))
        .filter((r) => Number.isFinite(r.distance))
        .sort((a, b) => a.distance - b.distance)
        .slice(0, k);
    if (ranked.length === 0)
        return [];
    if (ranked.length === 1)
        return [{ ...ranked[0], weight: 1 }];
    const eps = 1e-6;
    const dMin = ranked[0].distance;
    const dMax = ranked[ranked.length - 1].distance;
    const span = dMax - dMin + eps;
    const raw = ranked.map((r) => ({
        ...r,
        weight: (dMax - r.distance + eps) / span,
    }));
    const total = raw.reduce((s, r) => s + r.weight, 0);
    return raw.map((r) => ({ ...r, weight: total > 0 ? r.weight / total : 1 / raw.length }));
}
export function recomputeArchetypeDistancesAvg(state, archetypes) {
    for (const a of archetypes) {
        if (a.active === false)
            continue;
        state.archetypeDistances[a.id] = archetypeDistanceAvg(state, a);
    }
}
//# sourceMappingURL=archetypeDistanceAvg.js.map