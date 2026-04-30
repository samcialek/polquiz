import { CONTINUOUS_NODES, CATEGORICAL_NODES, isSelfNode } from "../config/nodes.js";
import { CATEGORY_COST_MATRIX } from "../config/categories.js";
import { morModuleDistance } from "./math.js";
/**
 * Continuous nodes superseded by the compound MOR_BOUNDARIES module per
 * ADR-006 PR 6.E.2a. When BOTH respondent state and the archetype carry
 * `morBoundaries`, archetypeDistance drops these per-node terms and folds
 * their geometry into a single morModule contribution computed below.
 *
 * When either side lacks `morBoundaries` (e.g., live quiz state today —
 * `api.ts` initializer + `update.ts` writer don't populate it until
 * 6.E.2b/6.F), the scorer falls back to the legacy per-node reads so the
 * MOR/TRB/PF contribution is not silently dropped. The skip is therefore
 * per-archetype, not unconditional. The legacy data fields stay until
 * 6.E.4 cleanup.
 */
const MOR_MODULE_LEGACY = ["MOR", "TRB", "PF"];
function expectedPos(posDist) {
    return ((posDist[0] ?? 0) * 1 +
        (posDist[1] ?? 0) * 2 +
        (posDist[2] ?? 0) * 3 +
        (posDist[3] ?? 0) * 4 +
        (posDist[4] ?? 0) * 5);
}
function expectedSal(salDist) {
    return ((salDist[0] ?? 0) * 0 +
        (salDist[1] ?? 0) * 1 +
        (salDist[2] ?? 0) * 2 +
        (salDist[3] ?? 0) * 3);
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
export function archetypeDistance(state, archetype) {
    let totalDist = 0;
    let totalWeight = 0;
    // Per-archetype gate: only fold MOR/TRB/PF into the compound module when
    // BOTH sides have the new data. If either side lacks it (live quiz today
    // — see api.ts/update.ts), we keep reading the legacy per-node fields so
    // the moral-circle contribution is not silently dropped during the
    // multi-PR cutover. This collapses to "always use module" once 6.E.2b
    // wires morBoundaries into respondent state and 6.E.4 strips legacy.
    const useMorModule = !!state.morBoundaries && !!archetype.morBoundaries;
    for (const nodeId of CONTINUOUS_NODES) {
        if (useMorModule && MOR_MODULE_LEGACY.includes(nodeId))
            continue;
        const template = archetype.nodes[nodeId];
        if (!template || template.kind !== "continuous")
            continue;
        const nodeState = state.continuous[nodeId];
        const expectedPos = nodeState.posDist[0] * 1 +
            nodeState.posDist[1] * 2 +
            nodeState.posDist[2] * 3 +
            nodeState.posDist[3] * 4 +
            nodeState.posDist[4] * 5;
        const posProb = nodeState.posDist[template.pos - 1] ?? 0.2;
        const posMeanDiff = Math.abs(expectedPos - template.pos) / 4;
        const posProbDist = 1 - posProb;
        const positionDist = posMeanDiff * 0.6 + posProbDist * 0.4;
        let antiPenalty = 0;
        if (template.anti === "high" && expectedPos > 3.8) {
            antiPenalty = 0.8 * (expectedPos - 3.8) / 1.2;
        }
        else if (template.anti === "low" && expectedPos < 2.2) {
            antiPenalty = 0.8 * (2.2 - expectedPos) / 1.2;
        }
        let nodeDist;
        let nodeWeight;
        if (isSelfNode(nodeId)) {
            // SELF-cluster (PF/TRB/ENG): position IS activation. No separate salience
            // axis. Weight derived from template.pos (higher pos = more activated
            // archetype) and expectedPos (more activated respondent), calibrated to
            // match the sal=0..3 weight range used by non-SELF nodes.
            // archSalWeight: template.pos 1→0.5, 5→2.0 (matches sal 0→0.5, 3→2.0).
            const archSalWeight = 0.5 + (template.pos - 1) * 0.375;
            // respondentSalWeight: expectedPos 1→0.5, 5→1.25 (matches sal 0→0.5, 3→1.25).
            const respondentSalWeight = 0.5 + (expectedPos - 1) * 0.1875;
            nodeWeight = archSalWeight * respondentSalWeight;
            nodeDist = positionDist + antiPenalty;
        }
        else {
            const expectedSal = nodeState.salDist[0] * 0 +
                nodeState.salDist[1] * 1 +
                nodeState.salDist[2] * 2 +
                nodeState.salDist[3] * 3;
            const templateSal = template.sal ?? 0;
            const salProb = nodeState.salDist[templateSal] ?? 0.25;
            const salMeanDiff = Math.abs(expectedSal - templateSal) / 3;
            const salProbDist = 1 - salProb;
            const salienceDist = salMeanDiff * 0.6 + salProbDist * 0.4;
            const archSalWeight = 0.5 + templateSal * 0.5;
            const respondentSalWeight = 0.5 + expectedSal * 0.25;
            nodeWeight = archSalWeight * respondentSalWeight;
            nodeDist = positionDist * 0.65 + salienceDist * 0.35 + antiPenalty;
        }
        totalDist += nodeDist * nodeWeight;
        totalWeight += nodeWeight;
    }
    // ── MOR_BOUNDARIES module contribution (ADR-006 PR 6.E.2a cutover) ────
    // One contribution replacing the four legacy fields (MOR continuous +
    // TRB continuous + PF continuous + TRB_ANCHOR distribution). Weight uses
    // the standard salience-weighted multiplier pattern, derived from
    // intensity directly — NOT double-counting intensity inside the boundary
    // sum (per ADR-006 §"Engine math, archetype matching distance").
    if (useMorModule) {
        const archIntensity = archetype.morBoundaries.intensity;
        const respIntensity = state.morBoundaries.intensity;
        // archSalWeight: intensity 0→0.5, 3→2.0  (mirrors sal 0..3 → 0.5..2.0)
        const archSalWeight = 0.5 + archIntensity * 0.5;
        // respondentSalWeight: intensity 0→0.5, 3→1.25  (mirrors sal 0..3 → 0.5..1.25)
        const respondentSalWeight = 0.5 + respIntensity * 0.25;
        const nodeWeight = archSalWeight * respondentSalWeight;
        const nodeDist = morModuleDistance(state.morBoundaries, archetype.morBoundaries);
        totalDist += nodeDist * nodeWeight;
        totalWeight += nodeWeight;
    }
    for (const nodeId of CATEGORICAL_NODES) {
        const template = archetype.nodes[nodeId];
        if (!template || template.kind !== "categorical")
            continue;
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
        const expectedSal = nodeState.salDist[0] * 0 +
            nodeState.salDist[1] * 1 +
            nodeState.salDist[2] * 2 +
            nodeState.salDist[3] * 3;
        const sal = template.sal ?? 0;
        // ASYMMETRY NOTE 2026-04-26: continuous nodes blend salMeanDiff with a
        // probability-at-target term (salDist[template.sal]); categorical nodes
        // omit that term and use only mean-difference. Low impact (35% of node
        // weight, only 2 categorical nodes) but inconsistent. Equalizing would
        // require revalidation against regression suite — flagged as PR 5 candidate
        // per scorer-hygiene investigation; deferred until evidence asymmetry is
        // unintended.
        const salDiff = Math.abs(expectedSal - sal) / 3;
        const archSalWeight = 0.5 + sal * 0.5;
        const respondentSalWeight = 0.5 + expectedSal * 0.25;
        const nodeWeight = archSalWeight * respondentSalWeight;
        const catDist = catCostDist * 0.5 + dotDist * 0.5;
        const nodeDist = catDist * 0.65 + salDiff * 0.35 + antiCatPenalty;
        totalDist += nodeDist * nodeWeight;
        totalWeight += nodeWeight;
    }
    let finalDist = totalWeight > 0 ? totalDist / totalWeight : 0;
    // Centrist anti-gate (ADR-008). Archetypes with the centristAnchor flag
    // (Hinge Citizen, Quiet Middle, Civic Minimalist, Public-Minded Moderate)
    // are midpoint attractors — they win for any user with mixed signals just
    // because their flat encoding is "everyone-distance-equidistant". A user
    // with multiple high-salience policy commitments is by definition NOT a
    // centrist — they have politics. Penalize the match score so the centrist
    // archetype only wins when the user's posterior salience is genuinely low.
    //
    // Penalty: count user's non-SELF nodes with E[sal] >= 2.0. If 3 or more
    // such nodes, multiply distance by 1 + 0.10 × (count - 2) capped at 1.5.
    // So a user with 3 high-sal nodes gets +10%, 5 gets +30%, 7+ gets +50%.
    if (archetype.centristAnchor) {
        // Per-respondent gate (ADR-006 PR 6.E.2a): if the respondent carries the
        // morBoundaries module, drop MOR from the per-node sal sweep and use
        // intensity ≥ 2.0 instead. Otherwise (live quiz today) keep reading the
        // legacy MOR salience so this anti-attractor penalty is not weakened
        // mid-cutover.
        const nonSelfNodes = state.morBoundaries
            ? ["MAT", "CD", "CU", "PRO", "COM", "ZS", "ONT_H", "ONT_S"]
            : ["MAT", "CD", "CU", "MOR", "PRO", "COM", "ZS", "ONT_H", "ONT_S"];
        let highSalCount = 0;
        for (const nid of nonSelfNodes) {
            const ns = state.continuous[nid];
            if (!ns)
                continue;
            const userSal = ns.salDist.reduce((s, p, i) => s + p * i, 0);
            if (userSal >= 2.0)
                highSalCount++;
        }
        for (const nid of ["EPS", "AES"]) {
            const ns = state.categorical[nid];
            if (!ns)
                continue;
            const userSal = ns.salDist.reduce((s, p, i) => s + p * i, 0);
            if (userSal >= 2.0)
                highSalCount++;
        }
        // Compound moral-circle module high-activation check (ADR-006 PR 6.E.2a).
        // Substitutes for MOR's salience entry above when state.morBoundaries is
        // present. Intensity scale is 0..3, same as `userSal`, so threshold ≥ 2.0
        // transfers directly.
        if (state.morBoundaries && state.morBoundaries.intensity >= 2.0) {
            highSalCount++;
        }
        if (highSalCount >= 3) {
            const penaltyMult = Math.min(1.5, 1 + 0.10 * (highSalCount - 2));
            finalDist *= penaltyMult;
        }
    }
    return finalDist;
}
/**
 * V1: Salience-Gated Accumulative scoring (legacy, preserved for diagnostics).
 *
 * Skips sal=0 nodes; accumulates log-likelihood weighted by salience. Used by
 * the optimization sweep in src/optimize/. Not used in production scoring.
 */
export function archetypeDistanceV1(state, archetype) {
    let logLikelihood = 0;
    for (const nodeId of CONTINUOUS_NODES) {
        const template = archetype.nodes[nodeId];
        if (!template || template.kind !== "continuous")
            continue;
        const sal = template.sal ?? 0;
        if (sal === 0)
            continue;
        const nodeState = state.continuous[nodeId];
        const posProb = nodeState.posDist[template.pos - 1] ?? 0.2;
        const salProb = nodeState.salDist[sal] ?? 0.25;
        const salWeight = sal;
        logLikelihood += salWeight * Math.log(posProb + 0.001);
        logLikelihood += 0.5 * salWeight * Math.log(salProb + 0.001);
        const pR = expectedPos(nodeState.posDist);
        if (template.anti === "high" && pR > 3.8) {
            logLikelihood -= 2.0 * salWeight;
        }
        else if (template.anti === "low" && pR < 2.2) {
            logLikelihood -= 2.0 * salWeight;
        }
    }
    for (const nodeId of CATEGORICAL_NODES) {
        const template = archetype.nodes[nodeId];
        if (!template || template.kind !== "categorical")
            continue;
        const sal = template.sal ?? 0;
        if (sal === 0)
            continue;
        const nodeState = state.categorical[nodeId];
        let dot = 0;
        for (let i = 0; i < 6; i++) {
            dot += nodeState.catDist[i] * template.probs[i];
        }
        const salProb = nodeState.salDist[sal] ?? 0.25;
        const salWeight = sal;
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
export function archetypeDistanceV2(state, archetype) {
    let totalDist = 0;
    let totalWeight = 0;
    for (const nodeId of CONTINUOUS_NODES) {
        const template = archetype.nodes[nodeId];
        if (!template || template.kind !== "continuous")
            continue;
        const nodeState = state.continuous[nodeId];
        if (nodeState.touches === 0)
            continue;
        const pR = expectedPos(nodeState.posDist);
        const posProb = nodeState.posDist[template.pos - 1] ?? 0.2;
        const sR = expectedSal(nodeState.salDist);
        const sal = template.sal ?? 0;
        const salProb = nodeState.salDist[sal] ?? 0.25;
        const posMeanDiff = Math.abs(pR - template.pos) / 4;
        const posProbDist = 1 - posProb;
        const salMeanDiff = Math.abs(sR - sal) / 3;
        const salProbDist = 1 - salProb;
        const positionDist = posMeanDiff * 0.6 + posProbDist * 0.4;
        const salienceDist = salMeanDiff * 0.6 + salProbDist * 0.4;
        let antiPenalty = 0;
        if (template.anti === "high" && pR > 3.8) {
            antiPenalty = 0.8 * (pR - 3.8) / 1.2;
        }
        else if (template.anti === "low" && pR < 2.2) {
            antiPenalty = 0.8 * (2.2 - pR) / 1.2;
        }
        const archSalWeight = 0.25 + sal * 0.75;
        const respondentSalWeight = 0.5 + sR * 0.25;
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
        const sR = expectedSal(nodeState.salDist);
        const sal = template.sal ?? 0;
        const salDiff = Math.abs(sR - sal) / 3;
        const archSalWeight = 0.25 + sal * 0.75;
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
export function viableByDistance(state, archetypes, ratio = 1.0) {
    const distances = state.archetypeDistances;
    // Guard: distances may be undefined/null on a fresh state before any
    // question has been answered. Return all archetypes (no information yet).
    if (distances == null)
        return archetypes;
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
/**
 * Pre-computed rank-based weight distribution over the top-K archetypes
 * (by ascending distance), normalized to a probability distribution. Used by
 * adaptive selectors as the "concentration" proxy that posteriors used to play.
 *
 * w(a) = (d_max - d(a) + eps) / (d_max - d_min + eps), then normalize.
 */
export function topKDistanceWeights(state, archetypes, k = 8) {
    const distances = state.archetypeDistances;
    // Guard: distances may be undefined/null on a fresh state before any
    // question has been answered.
    if (distances == null)
        return [];
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
//# sourceMappingURL=archetypeDistance.js.map