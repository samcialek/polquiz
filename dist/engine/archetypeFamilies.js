import { CONTINUOUS_NODES, CATEGORICAL_NODES } from "../config/nodes.js";
const FAMILY_PERCENTILE = 0.10;
function pairwiseDistance(a, b) {
    let sumSquared = 0;
    for (const nodeId of CONTINUOUS_NODES) {
        const tA = a.nodes[nodeId];
        const tB = b.nodes[nodeId];
        if (!tA || tA.kind !== "continuous")
            continue;
        if (!tB || tB.kind !== "continuous")
            continue;
        const dp = tA.pos - tB.pos;
        const w = Math.max(tA.sal ?? 0, tB.sal ?? 0); // SELF-cluster has no sal (ADR-005)
        sumSquared += dp * dp * w;
    }
    for (const nodeId of CATEGORICAL_NODES) {
        const tA = a.nodes[nodeId];
        const tB = b.nodes[nodeId];
        if (!tA || tA.kind !== "categorical")
            continue;
        if (!tB || tB.kind !== "categorical")
            continue;
        let probDiffSq = 0;
        for (let k = 0; k < 6; k++) {
            const d = (tA.probs[k] ?? 0) - (tB.probs[k] ?? 0);
            probDiffSq += d * d;
        }
        const w = Math.max(tA.sal, tB.sal);
        sumSquared += probDiffSq * w;
    }
    return Math.sqrt(sumSquared);
}
function percentile(sortedAsc, p) {
    if (sortedAsc.length === 0)
        return 0;
    const idx = (sortedAsc.length - 1) * p;
    const lo = Math.floor(idx);
    const hi = Math.ceil(idx);
    if (lo === hi)
        return sortedAsc[lo];
    const w = idx - lo;
    return sortedAsc[lo] * (1 - w) + sortedAsc[hi] * w;
}
export function buildArchetypeFamilies(archetypes) {
    const pairwise = {};
    const allDistances = [];
    for (const a of archetypes) {
        pairwise[a.id] = {};
    }
    for (let i = 0; i < archetypes.length; i++) {
        for (let j = i + 1; j < archetypes.length; j++) {
            const a = archetypes[i];
            const b = archetypes[j];
            const d = pairwiseDistance(a, b);
            pairwise[a.id][b.id] = d;
            pairwise[b.id][a.id] = d;
            allDistances.push(d);
        }
    }
    allDistances.sort((x, y) => x - y);
    const threshold = percentile(allDistances, FAMILY_PERCENTILE);
    const familyOf = {};
    for (const a of archetypes) {
        const neighbours = new Set();
        for (const b of archetypes) {
            if (a.id === b.id)
                continue;
            const d = pairwise[a.id][b.id];
            if (d !== undefined && d <= threshold) {
                neighbours.add(b.id);
            }
        }
        familyOf[a.id] = neighbours;
    }
    return { pairwise, familyOf, threshold };
}
//# sourceMappingURL=archetypeFamilies.js.map