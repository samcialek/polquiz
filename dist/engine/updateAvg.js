// Averaging-engine update functions. Parallel fork of update.ts.
//
// Each applyXxxAnswerAvg mirrors its Bayesian counterpart structurally but
// writes integer codes (pos 1-5, sal 0-3) into a running average rather than
// multiplying likelihood vectors into a posterior. Conversion from existing
// authoring (OptionEvidence.pos/sal, RankingItemMap, etc.) uses expected-value
// rounding via posCodeFromDist / salCodeFromDist.
//
// Constants below (RANK_SAL_CODE, SAL_IF_BEST_CODE, etc.) are the
// integer-code equivalents of update.ts's Bayesian likelihood vectors,
// derived by rounding each vector's expected value to the nearest integer.
import { addPos, addSal, addCat, posCodeFromDist, salCodeFromDist, registerTouchAvg, } from "./stateAvg.js";
import { addToAnchorDist } from "./math.js";
// Rank-position → sal code table. Real-valued E of update.ts RANK_SAL.
const RANK_SAL_CODE = [2.25, 2.00, 1.66, 1.34, 1.00, 0.75];
// Rank-position → position-signal weight. Same as update.ts ranking weights.
const RANK_POS_WEIGHT = [1.0, 0.8, 0.55, 0.35, 0.2, 0.0];
// Best-worst salience codes. Real-valued E of the Bayesian likelihood vectors.
const SAL_IF_BEST_CODE = 2.25;
const SAL_IF_WORST_CODE = 0.75;
const SAL_IF_MIDDLE_CODE = 1.40;
const SAL_IF_BEST_FORCED_CODE = 1.54;
const SAL_IF_WORST_FORCED_CODE = 1.44;
// Priority-sort salience codes (E of Bayesian SAL_PRIORITY_* vectors).
const SAL_PRIORITY_HIGH_CODE = 2.44;
const SAL_PRIORITY_MID_CODE = 1.50;
const SAL_PRIORITY_LOW_CODE = 0.63;
// Extremity boost: landing at pos=1 or pos=5 signals the node is active.
const EXTREMITY_SAL_CODE = 2.0;
// Best-worst category mix weights (reused from update.ts for target blending).
const BW_BEST_CAT_MIX = 0.50;
const BW_WORST_CAT_MIX = 0.30;
const BW_BEST_POS_MIX = 0.35;
const BW_WORST_POS_MIX = 0.22;
const DUAL_AXIS_POS_MIX = 0.45;
const PRIORITY_HIGH_POS_MIX = 0.40;
const PRIORITY_MID_POS_MIX = 0.20;
function isExtremePosEvidence(pos) {
    if (!pos || pos.length !== 5)
        return false;
    const max = Math.max(...pos);
    if (max < 0.4)
        return false;
    const maxIdx = pos.indexOf(max);
    return maxIdx === 0 || maxIdx === 4;
}
function invertCatDist(d) {
    const inv = d.map((p) => 1 - p);
    const total = inv.reduce((a, b) => a + b, 0);
    if (total <= 0)
        return d;
    return inv.map((p) => p / total);
}
function registerTouches(state, q) {
    for (const touch of q.touchProfile) {
        if (touch.node === "TRB_ANCHOR" || touch.node === "MORAL_CIRCLE")
            continue;
        if (touch.kind === "continuous" && touch.node in state.continuous) {
            registerTouchAvg(state, touch.node, touch.touchType);
        }
        else if (touch.kind === "categorical" && touch.node in state.categorical) {
            registerTouchAvg(state, touch.node, touch.touchType);
        }
    }
}
function boostExtremitySalience(state, q, nodesToBoost) {
    if (nodesToBoost.size === 0)
        return;
    for (const touch of q.touchProfile) {
        if (touch.role !== "position")
            continue;
        if (!nodesToBoost.has(touch.node))
            continue;
        if (touch.kind === "continuous" && touch.node in state.continuous) {
            addSal(state, touch.node, EXTREMITY_SAL_CODE);
        }
        else if (touch.kind === "categorical" && touch.node in state.categorical) {
            addSal(state, touch.node, EXTREMITY_SAL_CODE);
        }
    }
}
function applyOptionEvidence(state, evidence) {
    if (!evidence)
        return;
    if (evidence.continuous) {
        for (const [nodeId, upd] of Object.entries(evidence.continuous)) {
            if (upd?.pos) {
                const posCode = posCodeFromDist(upd.pos);
                if (posCode !== null)
                    addPos(state, nodeId, posCode);
            }
            if (upd?.sal) {
                const salCode = salCodeFromDist(upd.sal);
                if (salCode !== null)
                    addSal(state, nodeId, salCode);
            }
        }
    }
    if (evidence.categorical) {
        for (const [nodeId, upd] of Object.entries(evidence.categorical)) {
            if (upd?.cat)
                addCat(state, nodeId, upd.cat);
            if (upd?.sal) {
                const salCode = salCodeFromDist(upd.sal);
                if (salCode !== null)
                    addSal(state, nodeId, salCode);
            }
        }
    }
    if (evidence.trbAnchor) {
        state.trbAnchor.dist = addToAnchorDist(state.trbAnchor.dist, evidence.trbAnchor);
        state.trbAnchor.touches += 1;
    }
}
export function applySingleChoiceAnswerAvg(state, q, optionKey) {
    state.answers[q.id] = optionKey;
    registerTouches(state, q);
    const ev = q.optionEvidence?.[optionKey];
    applyOptionEvidence(state, ev);
    if (ev?.continuous) {
        const extremeNodes = new Set();
        for (const [nodeId, upd] of Object.entries(ev.continuous)) {
            if (isExtremePosEvidence(upd?.pos))
                extremeNodes.add(nodeId);
        }
        boostExtremitySalience(state, q, extremeNodes);
    }
}
export function applySliderAnswerAvg(state, q, rawValue) {
    state.answers[q.id] = rawValue;
    registerTouches(state, q);
    if (!q.sliderMap)
        return;
    const bucket = Object.keys(q.sliderMap).find((k) => {
        const parts = k.split("-").map(Number);
        const lo = parts[0] ?? 0;
        const hi = parts[1] ?? 100;
        return rawValue >= lo && rawValue <= hi;
    });
    if (!bucket)
        return;
    applyOptionEvidence(state, q.sliderMap[bucket]);
    if (rawValue <= 20 || rawValue >= 80) {
        const posNodes = new Set(q.touchProfile.filter((t) => t.role === "position").map((t) => t.node));
        boostExtremitySalience(state, q, posNodes);
    }
}
export function applyAllocationAnswerAvg(state, q, allocation) {
    state.answers[q.id] = allocation;
    registerTouches(state, q);
    if (!q.allocationMap)
        return;
    const total = Math.max(1, Object.values(allocation).reduce((a, b) => a + b, 0));
    const shares = Object.values(allocation).map((w) => w / total);
    for (const [bucket, weight] of Object.entries(allocation)) {
        const share = weight / total;
        if (share <= 0)
            continue;
        const map = q.allocationMap[bucket];
        if (!map)
            continue;
        if (map.continuous) {
            for (const [nodeId, signal] of Object.entries(map.continuous)) {
                // Allocation signal ∈ [-1, 1]; share ∈ [0, 1]. Map to pos code 1-5
                // via 3 + signal*share*2, clamped. Weighted by share via multiple
                // passes would over-count; single pass with code derived from signal
                // matches the Bayesian per-bucket bump geometry.
                const posCode = Math.max(1, Math.min(5, 3 + (signal ?? 0) * share * 2));
                addPos(state, nodeId, posCode);
            }
        }
        if (map.categorical) {
            for (const [nodeId, catDist] of Object.entries(map.categorical)) {
                if (!catDist)
                    continue;
                addCat(state, nodeId, catDist);
            }
        }
        if (map.trbAnchor) {
            const scaled = {};
            for (const [k, v] of Object.entries(map.trbAnchor))
                scaled[k] = (v ?? 0) * share;
            state.trbAnchor.dist = addToAnchorDist(state.trbAnchor.dist, scaled);
            state.trbAnchor.touches += 1;
        }
    }
    // Salience via HHI concentration. Mirrors the Bayesian tiered approach but
    // emits an integer code per touched salience node.
    const salienceTouches = q.touchProfile.filter((t) => t.role === "salience");
    if (!salienceTouches.length)
        return;
    const hhi = shares.reduce((sum, s) => sum + s * s, 0);
    const concentration = Math.max(0, Math.min(1, (hhi - 0.25) / 0.75));
    const salCode = concentration >= 0.75 ? 3 :
        concentration >= 0.5 ? 2 :
            concentration >= 0.25 ? 1 :
                0;
    for (const touch of salienceTouches) {
        if (touch.kind === "continuous") {
            addSal(state, touch.node, salCode);
        }
        else if (touch.kind === "categorical") {
            addSal(state, touch.node, salCode);
        }
    }
}
export function applyRankingAnswerAvg(state, q, ranking) {
    state.answers[q.id] = ranking;
    registerTouches(state, q);
    if (!q.rankingMap)
        return;
    const hasSalience = q.touchProfile.some((t) => t.role === "salience");
    ranking.forEach((item, idx) => {
        const rankWeight = RANK_POS_WEIGHT[idx] ?? 0;
        const map = q.rankingMap?.[item];
        if (!map)
            return;
        const salCode = hasSalience && idx < RANK_SAL_CODE.length ? RANK_SAL_CODE[idx] : null;
        if (map.continuous) {
            for (const [nodeId, signal] of Object.entries(map.continuous)) {
                if (typeof signal === "number") {
                    const posCode = Math.max(1, Math.min(5, 3 + signal * 2 * rankWeight));
                    addPos(state, nodeId, posCode);
                }
                else if (signal && "pos" in signal && signal.pos) {
                    const posCode = posCodeFromDist(signal.pos);
                    if (posCode !== null)
                        addPos(state, nodeId, posCode);
                }
                if (salCode !== null)
                    addSal(state, nodeId, salCode);
            }
        }
        if (map.categorical) {
            for (const [nodeId, catDist] of Object.entries(map.categorical)) {
                if (!catDist)
                    continue;
                addCat(state, nodeId, catDist);
                if (salCode !== null)
                    addSal(state, nodeId, salCode);
            }
        }
        if (map.trbAnchor) {
            const scaled = {};
            for (const [k, v] of Object.entries(map.trbAnchor))
                scaled[k] = (v ?? 0) * rankWeight;
            state.trbAnchor.dist = addToAnchorDist(state.trbAnchor.dist, scaled);
            state.trbAnchor.touches += 1;
        }
    });
}
export function applyBestWorstSalienceAvg(state, q, best, worst, allItems) {
    state.answers[q.id] = { best: best.slice(), worst: worst.slice() };
    registerTouches(state, q);
    if (!q.rankingMap)
        return;
    const bestSet = new Set(best);
    const worstSet = new Set(worst);
    const continuousBuckets = new Map();
    const categoricalBuckets = new Map();
    const bucketFor = (item) => bestSet.has(item) ? "best" : worstSet.has(item) ? "worst" : "middle";
    for (const item of allItems) {
        const map = q.rankingMap[item];
        if (!map)
            continue;
        const b = bucketFor(item);
        if (map.continuous) {
            for (const nodeId of Object.keys(map.continuous)) {
                if (!continuousBuckets.has(nodeId))
                    continuousBuckets.set(nodeId, new Set());
                continuousBuckets.get(nodeId).add(b);
            }
        }
        if (map.categorical) {
            for (const nodeId of Object.keys(map.categorical)) {
                if (!categoricalBuckets.has(nodeId))
                    categoricalBuckets.set(nodeId, new Set());
                categoricalBuckets.get(nodeId).add(b);
            }
        }
    }
    function resolveSalCode(buckets) {
        const forced = buckets.has("middle");
        if (buckets.has("best"))
            return forced ? SAL_IF_BEST_FORCED_CODE : SAL_IF_BEST_CODE;
        if (buckets.has("worst"))
            return forced ? SAL_IF_WORST_FORCED_CODE : SAL_IF_WORST_CODE;
        return SAL_IF_MIDDLE_CODE;
    }
    for (const [nodeId, buckets] of continuousBuckets) {
        if (nodeId in state.continuous) {
            addSal(state, nodeId, resolveSalCode(buckets));
        }
    }
    for (const [nodeId, buckets] of categoricalBuckets) {
        if (nodeId in state.categorical) {
            addSal(state, nodeId, resolveSalCode(buckets));
        }
    }
    // Category mixing via weighted addCat with target=catDist on best,
    // target=invert(catDist) on worst.
    for (const item of allItems) {
        const map = q.rankingMap[item];
        if (!map?.categorical)
            continue;
        const isBest = bestSet.has(item);
        const isWorst = worstSet.has(item);
        if (!isBest && !isWorst)
            continue;
        for (const [nodeId, catDist] of Object.entries(map.categorical)) {
            if (!catDist)
                continue;
            const target = isBest ? catDist : invertCatDist(catDist);
            // Mix weight determines how much of this target to add relative to a full
            // addCat (which adds 1.0 worth of mass). Scale the added counts.
            const w = isBest ? BW_BEST_CAT_MIX : BW_WORST_CAT_MIX;
            const scaled = target.map((v) => v * w * 2);
            addCat(state, nodeId, scaled);
        }
    }
    // Continuous position mixing for pole-battery items.
    for (const item of allItems) {
        const map = q.rankingMap[item];
        if (!map?.continuous)
            continue;
        const isBest = bestSet.has(item);
        const isWorst = worstSet.has(item);
        if (!isBest && !isWorst)
            continue;
        for (const [nodeId, evidence] of Object.entries(map.continuous)) {
            if (typeof evidence === "number" || !evidence?.pos)
                continue;
            const sum = evidence.pos.reduce((a, b) => a + b, 0) || 1;
            const norm = evidence.pos.map((p) => p / sum);
            const target = isBest ? norm : norm.map((p) => 1 - p);
            const tSum = target.reduce((a, b) => a + b, 0) || 1;
            const tNorm = target.map((p) => p / tSum);
            const posCode = posCodeFromDist(tNorm);
            if (posCode !== null) {
                // Mix weight scales how many virtual observations this contributes.
                const w = isBest ? BW_BEST_POS_MIX : BW_WORST_POS_MIX;
                for (let i = 0; i < Math.max(1, Math.round(w * 2)); i++) {
                    addPos(state, nodeId, posCode);
                }
            }
        }
    }
}
export function applyPrioritySortAvg(state, q, placements, allItems) {
    state.answers[q.id] = {
        supportHigh: placements.supportHigh.slice(),
        supportMid: placements.supportMid.slice(),
        neutral: placements.neutral.slice(),
        opposeHigh: placements.opposeHigh.slice(),
    };
    registerTouches(state, q);
    if (!q.rankingMap)
        return;
    const supportHighSet = new Set(placements.supportHigh);
    const supportMidSet = new Set(placements.supportMid);
    const opposeHighSet = new Set(placements.opposeHigh);
    const bucketFor = (item) => supportHighSet.has(item)
        ? "supportHigh"
        : opposeHighSet.has(item)
            ? "opposeHigh"
            : supportMidSet.has(item)
                ? "supportMid"
                : "neutral";
    const continuousBuckets = new Map();
    const categoricalBuckets = new Map();
    for (const item of allItems) {
        const map = q.rankingMap[item];
        if (!map)
            continue;
        const b = bucketFor(item);
        if (map.continuous) {
            for (const nodeId of Object.keys(map.continuous)) {
                if (!continuousBuckets.has(nodeId))
                    continuousBuckets.set(nodeId, new Set());
                continuousBuckets.get(nodeId).add(b);
            }
        }
        if (map.categorical) {
            for (const nodeId of Object.keys(map.categorical)) {
                if (!categoricalBuckets.has(nodeId))
                    categoricalBuckets.set(nodeId, new Set());
                categoricalBuckets.get(nodeId).add(b);
            }
        }
    }
    function resolveSalCode(buckets) {
        if (buckets.has("supportHigh") || buckets.has("opposeHigh"))
            return SAL_PRIORITY_HIGH_CODE;
        if (buckets.has("supportMid"))
            return SAL_PRIORITY_MID_CODE;
        return SAL_PRIORITY_LOW_CODE;
    }
    for (const [nodeId, buckets] of continuousBuckets) {
        if (nodeId in state.continuous) {
            addSal(state, nodeId, resolveSalCode(buckets));
        }
    }
    for (const [nodeId, buckets] of categoricalBuckets) {
        if (nodeId in state.categorical) {
            addSal(state, nodeId, resolveSalCode(buckets));
        }
    }
    // Position pulls per-item.
    for (const item of allItems) {
        const map = q.rankingMap[item];
        if (!map?.continuous)
            continue;
        const bucket = bucketFor(item);
        if (bucket === "neutral")
            continue;
        const mix = bucket === "supportMid" ? PRIORITY_MID_POS_MIX : PRIORITY_HIGH_POS_MIX;
        const invert = bucket === "opposeHigh";
        for (const [nodeId, evidence] of Object.entries(map.continuous)) {
            if (typeof evidence === "number" || !evidence?.pos)
                continue;
            const sum = evidence.pos.reduce((a, b) => a + b, 0) || 1;
            const norm = evidence.pos.map((p) => p / sum);
            const target = invert ? norm.map((p) => 1 - p) : norm;
            const tSum = target.reduce((a, b) => a + b, 0) || 1;
            const tNorm = target.map((p) => p / tSum);
            const posCode = posCodeFromDist(tNorm);
            if (posCode !== null) {
                for (let i = 0; i < Math.max(1, Math.round(mix * 2)); i++) {
                    addPos(state, nodeId, posCode);
                }
            }
        }
    }
}
export function applyDualAxisAnswerAvg(state, q, answer) {
    const x = Math.max(0, Math.min(1, answer.x));
    const y = Math.max(0, Math.min(1, answer.y));
    state.answers[q.id] = { x, y };
    registerTouches(state, q);
    if (!q.dualAxisMap)
        return;
    const node = q.dualAxisMap.node;
    if (!(node in state.continuous))
        return;
    const posCode = Math.max(1, Math.min(5, 1 + 4 * x));
    const salCode = Math.max(0, Math.min(3, 3 * y));
    // DUAL_AXIS_POS_MIX=0.45 in Bayesian implies a strong push; emit one pos
    // observation (the signal is precise — a single placement).
    addPos(state, node, posCode);
    addSal(state, node, salCode);
}
export function applyPairwiseAnswerAvg(state, q, answers) {
    state.answers[q.id] = answers;
    registerTouches(state, q);
    if (!q.pairMaps)
        return;
    for (const [pairId, choice] of Object.entries(answers)) {
        const pair = q.pairMaps[pairId];
        if (!pair)
            continue;
        const map = pair[choice];
        if (!map)
            continue;
        if (map.continuous) {
            for (const [nodeId, signal] of Object.entries(map.continuous)) {
                const posCode = Math.max(1, Math.min(5, 3 + (signal ?? 0) * 2));
                addPos(state, nodeId, posCode);
            }
        }
        if (map.categorical) {
            for (const [nodeId, catDist] of Object.entries(map.categorical)) {
                if (!catDist)
                    continue;
                addCat(state, nodeId, catDist);
            }
        }
    }
}
//# sourceMappingURL=updateAvg.js.map