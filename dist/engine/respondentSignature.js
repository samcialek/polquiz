import { isSelfNode } from "../config/nodes.js";
function expectedContinuousPos(dist) {
    let e = 0;
    for (let i = 0; i < 5; i++)
        e += (dist[i] ?? 0) * (i + 1);
    return e;
}
function expectedCategoricalIndex(dist) {
    let e = 0;
    for (let i = 0; i < 6; i++)
        e += (dist[i] ?? 0) * i;
    return e;
}
function expectedSalience(dist) {
    let e = 0;
    for (let i = 0; i < 4; i++)
        e += (dist[i] ?? 0) * i;
    return e;
}
export function respondentSignatureFromState(state) {
    const sig = {};
    for (const [nodeId, node] of Object.entries(state.continuous)) {
        const pos = expectedContinuousPos(node.posDist);
        // SELF-cluster (PF/TRB/ENG) is activation-only per ADR-005. salDist is
        // initialized but never updated for these nodes, so reading it returns the
        // uniform E[sal]=1.5 fallback regardless of actual activation. Derive sal
        // from pos instead: pos 1 → sal 0, pos 5 → sal 3 (linear on the 0-3 scale).
        const sal = isSelfNode(nodeId)
            ? ((pos - 1) / 4) * 3
            : expectedSalience(node.salDist);
        sig[nodeId] = { pos, sal };
    }
    for (const [nodeId, node] of Object.entries(state.categorical)) {
        sig[nodeId] = {
            pos: expectedCategoricalIndex(node.catDist),
            sal: expectedSalience(node.salDist),
            catDist: [...node.catDist],
        };
    }
    return sig;
}
//# sourceMappingURL=respondentSignature.js.map