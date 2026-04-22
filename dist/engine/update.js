import { multiplyAndNormalize, normalize, addToAnchorDist } from "./math.js";
import { NODE_NORM_FACTORS } from "../config/normalization.js";
// Salience likelihood ratios keyed by rank position (6-item ranking).
// Rank 1 = most important → high salience; Rank 6 = least → low salience.
const RANK_SAL = [
    [0.05, 0.15, 0.30, 0.50], // rank 1 (most important)
    [0.10, 0.20, 0.30, 0.40], // rank 2
    [0.18, 0.25, 0.30, 0.27], // rank 3
    [0.27, 0.30, 0.25, 0.18], // rank 4
    [0.40, 0.30, 0.20, 0.10], // rank 5
    [0.50, 0.30, 0.15, 0.05], // rank 6 (least important)
];
// Salience likelihoods for the pure-salience best-worst battery (top-N / bottom-N).
// Applied per item based on whether it was picked as best, worst, or left in the middle.
const SAL_IF_BEST = [0.05, 0.15, 0.30, 0.50];
const SAL_IF_WORST = [0.50, 0.30, 0.15, 0.05];
const SAL_IF_MIDDLE = [0.25, 0.30, 0.25, 0.20];
// Near-flat salience likelihoods for "category-pick" best_worst questions,
// where every item touches the same node (e.g. Q89 EPS). The user is forced to
// pick among 6 phrasings of one categorical node; that pick reveals their
// category strongly but carries essentially no salience information (they had
// to pick something no matter how much they care). Any salience signal on that
// node must come from other questions whose likelihood actually depends on the
// respondent's answer content (e.g. Q22 allocation HHI, Q79 option choice).
// For node-salience batteries (Q86/Q88) each item maps to a distinct node, so
// a "best" pick is genuine relative-importance signal — keep the strong form.
const SAL_IF_BEST_FORCED = [0.23, 0.25, 0.27, 0.25];
const SAL_IF_WORST_FORCED = [0.27, 0.25, 0.25, 0.23];
// Category-mix weights when a best_worst item carries categorical evidence
// (e.g. EPS / AES style picks). Best is a stronger signal than worst —
// people more reliably name what they prefer than what they reject.
const BW_BEST_CAT_MIX = 0.50;
const BW_WORST_CAT_MIX = 0.30;
// Continuous-position mix weights for pole-battery best_worst items (Q93-Q96).
// Lighter than category because priority picks only weakly pin exact position —
// picking "economic fairness" as top priority doesn't mean position=1 exactly,
// just a redistributionist lean. Worst pick pulls away from the pole similarly
// but more gently (people are more certain of what they want than what they don't).
const BW_BEST_POS_MIX = 0.35;
const BW_WORST_POS_MIX = 0.22;
function invertCatDist(d) {
    const inv = d.map((p) => 1 - p);
    const total = inv.reduce((a, b) => a + b, 0);
    if (total <= 0)
        return d;
    return inv.map((p) => p / total);
}
// Extremity → salience. When a respondent lands at an extreme on a position
// scale, it's a signal the node is cognitively active for them (you don't
// hold extreme opinions on things you don't care about). This likelihood is
// milder than SAL_IF_BEST because the position itself — not an explicit
// "rank this as most important" — is doing the signaling.
const EXTREMITY_SAL = [0.10, 0.20, 0.30, 0.40];
function isExtremePosEvidence(pos) {
    if (!pos || pos.length !== 5)
        return false;
    const max = Math.max(...pos);
    if (max < 0.40)
        return false;
    const maxIdx = pos.indexOf(max);
    return maxIdx === 0 || maxIdx === 4;
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
            const node = state.continuous[touch.node];
            node.salDist = multiplyAndNormalize(node.salDist, EXTREMITY_SAL);
        }
        else if (touch.kind === "categorical" && touch.node in state.categorical) {
            const node = state.categorical[touch.node];
            node.salDist = multiplyAndNormalize(node.salDist, EXTREMITY_SAL);
        }
    }
}
function registerTouches(state, q) {
    for (const touch of q.touchProfile) {
        if (touch.node === "TRB_ANCHOR")
            continue;
        if (touch.kind === "continuous" && touch.node in state.continuous) {
            const node = state.continuous[touch.node];
            node.touches += 1;
            node.touchTypes.add(touch.touchType);
        }
        else if (touch.kind === "categorical" && touch.node in state.categorical) {
            const node = state.categorical[touch.node];
            node.touches += 1;
            node.touchTypes.add(touch.touchType);
        }
    }
}
// TODO: applyOptionEvidence uses pre-computed likelihood ratios, so NODE_NORM_FACTORS
// should be applied when the evidence is constructed (in question authoring), not here
// at runtime. Future work: bake norm factors into the optionEvidence generation pipeline.
function applyOptionEvidence(state, evidence) {
    if (!evidence)
        return;
    if (evidence.continuous) {
        for (const [nodeId, upd] of Object.entries(evidence.continuous)) {
            const node = state.continuous[nodeId];
            if (upd?.pos)
                node.posDist = multiplyAndNormalize(node.posDist, upd.pos);
            if (upd?.sal)
                node.salDist = multiplyAndNormalize(node.salDist, upd.sal);
        }
    }
    if (evidence.categorical) {
        for (const [nodeId, upd] of Object.entries(evidence.categorical)) {
            const node = state.categorical[nodeId];
            if (upd?.cat)
                node.catDist = multiplyAndNormalize(node.catDist, upd.cat);
            if (upd?.sal)
                node.salDist = multiplyAndNormalize(node.salDist, upd.sal);
        }
    }
    if (evidence.trbAnchor) {
        state.trbAnchor.dist = addToAnchorDist(state.trbAnchor.dist, evidence.trbAnchor);
        state.trbAnchor.touches += 1;
    }
}
export function applySingleChoiceAnswer(state, q, optionKey) {
    state.answers[q.id] = optionKey;
    registerTouches(state, q);
    const ev = q.optionEvidence?.[optionKey];
    applyOptionEvidence(state, ev);
    // Extremity → salience: if the chosen option's pos evidence concentrates
    // on pos 1 or pos 5 for a node, bump that node's salience.
    if (ev?.continuous) {
        const extremeNodes = new Set();
        for (const [nodeId, upd] of Object.entries(ev.continuous)) {
            if (isExtremePosEvidence(upd?.pos))
                extremeNodes.add(nodeId);
        }
        boostExtremitySalience(state, q, extremeNodes);
    }
}
export function applySliderAnswer(state, q, rawValue) {
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
    // Extremity → salience: landing at either end of the slider (≤20 or ≥80)
    // is a behavioral signal that the node is active. Boost salience on every
    // position-touched node this question declares.
    if (rawValue <= 20 || rawValue >= 80) {
        const posNodes = new Set(q.touchProfile.filter((t) => t.role === "position").map((t) => t.node));
        boostExtremitySalience(state, q, posNodes);
    }
}
export function applyAllocationAnswer(state, q, allocation) {
    state.answers[q.id] = allocation;
    registerTouches(state, q);
    if (!q.allocationMap)
        return;
    const total = Math.max(1, Object.values(allocation).reduce((a, b) => a + b, 0));
    const shares = Object.values(allocation).map(weight => weight / total);
    for (const [bucket, weight] of Object.entries(allocation)) {
        const share = weight / total;
        const map = q.allocationMap[bucket];
        if (!map)
            continue;
        if (map.continuous) {
            for (const [nodeId, signal] of Object.entries(map.continuous)) {
                const node = state.continuous[nodeId];
                const normFactor = NODE_NORM_FACTORS[nodeId] ?? 1;
                const current = node.posDist;
                const bump = current.map((p, i) => p * Math.exp((signal ?? 0) * normFactor * share * ((i + 1) - 3)));
                node.posDist = normalize(bump);
            }
        }
        if (map.categorical) {
            for (const [nodeId, catDist] of Object.entries(map.categorical)) {
                const node = state.categorical[nodeId];
                const normFactor = NODE_NORM_FACTORS[nodeId] ?? 1;
                const mixWeight = 0.35 * share * normFactor;
                const mixed = node.catDist.map((v, i) => v * (1 - mixWeight) + (catDist[i] ?? 0) * mixWeight);
                node.catDist = normalize(mixed);
            }
        }
        if (map.trbAnchor) {
            const scaled = {};
            for (const [k, v] of Object.entries(map.trbAnchor)) {
                scaled[k] = v * share;
            }
            state.trbAnchor.dist = addToAnchorDist(state.trbAnchor.dist, scaled);
            state.trbAnchor.touches += 1;
        }
    }
    const salienceTouches = q.touchProfile.filter(t => t.role === "salience");
    if (!salienceTouches.length)
        return;
    const hhi = shares.reduce((sum, s) => sum + s * s, 0);
    const concentration = Math.max(0, Math.min(1, (hhi - 0.25) / 0.75));
    const salLikelihood = concentration >= 0.75 ? [0.03, 0.08, 0.24, 0.65] :
        concentration >= 0.5 ? [0.06, 0.14, 0.32, 0.48] :
            concentration >= 0.25 ? [0.12, 0.22, 0.34, 0.32] :
                [0.22, 0.30, 0.28, 0.20];
    for (const touch of salienceTouches) {
        if (touch.kind === "continuous") {
            const node = state.continuous[touch.node];
            node.salDist = multiplyAndNormalize(node.salDist, salLikelihood);
        }
        else if (touch.kind === "categorical") {
            const node = state.categorical[touch.node];
            node.salDist = multiplyAndNormalize(node.salDist, salLikelihood);
        }
    }
}
export function applyRankingAnswer(state, q, ranking) {
    state.answers[q.id] = ranking;
    registerTouches(state, q);
    if (!q.rankingMap)
        return;
    const weights = [1.0, 0.8, 0.55, 0.35, 0.2, 0.0];
    // Check if this question declares salience in its touchProfile
    const hasSalience = q.touchProfile.some(t => t.role === "salience");
    ranking.forEach((item, idx) => {
        const rankWeight = weights[idx] ?? 0;
        const map = q.rankingMap?.[item];
        if (!map)
            return;
        // Rank-based salience likelihood for this position
        const salLikelihood = hasSalience && idx < RANK_SAL.length ? RANK_SAL[idx] : null;
        if (map.continuous) {
            for (const [nodeId, signal] of Object.entries(map.continuous)) {
                const node = state.continuous[nodeId];
                const normFactor = NODE_NORM_FACTORS[nodeId] ?? 1;
                const bump = node.posDist.map((p, i) => p * Math.exp((signal ?? 0) * normFactor * rankWeight * ((i + 1) - 3)));
                node.posDist = normalize(bump);
                if (salLikelihood) {
                    node.salDist = multiplyAndNormalize(node.salDist, salLikelihood);
                }
            }
        }
        if (map.categorical) {
            for (const [nodeId, catDist] of Object.entries(map.categorical)) {
                const node = state.categorical[nodeId];
                const normFactor = NODE_NORM_FACTORS[nodeId] ?? 1;
                const mixWeight = 0.4 * rankWeight * normFactor;
                const mixed = node.catDist.map((v, i) => v * (1 - mixWeight) + (catDist[i] ?? 0) * mixWeight);
                node.catDist = normalize(mixed);
                if (salLikelihood) {
                    node.salDist = multiplyAndNormalize(node.salDist, salLikelihood);
                }
            }
        }
        if (map.trbAnchor) {
            const scaled = {};
            for (const [k, v] of Object.entries(map.trbAnchor)) {
                scaled[k] = v * rankWeight;
            }
            state.trbAnchor.dist = addToAnchorDist(state.trbAnchor.dist, scaled);
            state.trbAnchor.touches += 1;
        }
    });
}
/**
 * Apply a top-N / bottom-N best-worst answer as a per-item salience update.
 *
 * Unlike applyRankingAnswer, which weights evidence by rank position within a flat
 * ordering, this routine treats every item independently: items picked as "best"
 * receive SAL_IF_BEST; items picked as "worst" receive SAL_IF_WORST; everything
 * else receives SAL_IF_MIDDLE. The rankingMap entry for each item identifies which
 * nodes that item's salience evidence applies to; the rankingMap's scalar values
 * are intentionally ignored here (this is a salience-only question).
 */
export function applyBestWorstSalience(state, q, best, worst, allItems) {
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
    // Pick the strongest signal observed: best > worst > middle. Engaging with
    // a node at either pole signals salience; otherwise it gets the mild
    // "didn't pick this" pull toward low-salience.
    //
    // Forced-pick detection: if the same node is also referenced by a "middle"
    // item, the question is a category-pick battery (Q89 EPS) where every item
    // touches the same node — the respondent was forced to choose, so the best/
    // worst signal is weaker evidence of genuine importance. Use milder FORCED
    // variants. Otherwise it's a node-salience battery (Q86/Q88) where each item
    // maps to a distinct node — middle items reference different nodes, and the
    // best/worst signal is real relative importance.
    function resolveSal(buckets) {
        const forced = buckets.has("middle");
        if (buckets.has("best"))
            return forced ? SAL_IF_BEST_FORCED : SAL_IF_BEST;
        if (buckets.has("worst"))
            return forced ? SAL_IF_WORST_FORCED : SAL_IF_WORST;
        return SAL_IF_MIDDLE;
    }
    for (const [nodeId, buckets] of continuousBuckets) {
        const node = state.continuous[nodeId];
        if (!node)
            continue;
        node.salDist = multiplyAndNormalize(node.salDist, resolveSal(buckets));
    }
    for (const [nodeId, buckets] of categoricalBuckets) {
        const node = state.categorical[nodeId];
        if (!node)
            continue;
        node.salDist = multiplyAndNormalize(node.salDist, resolveSal(buckets));
    }
    // Category mixing: separate per-item pass over best/worst items only.
    // Best pulls the categorical posterior toward the item's prototype; worst
    // pushes it toward the prototype's inverse. Middle items contribute nothing
    // to category — only to salience above.
    for (const item of allItems) {
        const map = q.rankingMap[item];
        if (!map?.categorical)
            continue;
        const isBest = bestSet.has(item);
        const isWorst = worstSet.has(item);
        if (!isBest && !isWorst)
            continue;
        for (const [nodeId, catDist] of Object.entries(map.categorical)) {
            const node = state.categorical[nodeId];
            if (!node || !catDist)
                continue;
            const w = isBest ? BW_BEST_CAT_MIX : BW_WORST_CAT_MIX;
            const target = isBest ? catDist : invertCatDist(catDist);
            const mixed = node.catDist.map((v, i) => v * (1 - w) + target[i] * w);
            node.catDist = normalize(mixed);
        }
    }
    // Continuous position mixing: for pole-battery questions (Q93-Q96), each
    // item carries a `pos` distribution that encodes which pole it represents.
    // Best pulls the position posterior toward the pole; worst pushes it toward
    // the inverted distribution. Lighter mix than category (position from a
    // priority pick is informative but noisy).
    for (const item of allItems) {
        const map = q.rankingMap[item];
        if (!map?.continuous)
            continue;
        const isBest = bestSet.has(item);
        const isWorst = worstSet.has(item);
        if (!isBest && !isWorst)
            continue;
        for (const [nodeId, evidence] of Object.entries(map.continuous)) {
            if (!evidence?.pos)
                continue;
            const node = state.continuous[nodeId];
            if (!node)
                continue;
            const w = isBest ? BW_BEST_POS_MIX : BW_WORST_POS_MIX;
            const sum = evidence.pos.reduce((a, b) => a + b, 0) || 1;
            const target = isBest
                ? evidence.pos.map((p) => p / sum)
                : evidence.pos.map((p) => (1 - p / sum));
            const tSum = target.reduce((a, b) => a + b, 0) || 1;
            const tNorm = target.map((p) => p / tSum);
            const mixed = node.posDist.map((v, i) => v * (1 - w) + tNorm[i] * w);
            node.posDist = normalize(mixed);
        }
    }
}
export function applyPairwiseAnswer(state, q, answers) {
    state.answers[q.id] = answers;
    registerTouches(state, q);
    if (!q.pairMaps)
        return;
    for (const [pairId, chosen] of Object.entries(answers)) {
        const map = q.pairMaps[pairId]?.[chosen];
        if (!map)
            continue;
        if (map.continuous) {
            for (const [nodeId, signal] of Object.entries(map.continuous)) {
                const node = state.continuous[nodeId];
                const normFactor = NODE_NORM_FACTORS[nodeId] ?? 1;
                const bump = node.posDist.map((p, i) => p * Math.exp((signal ?? 0) * normFactor * ((i + 1) - 3)));
                node.posDist = normalize(bump);
            }
        }
        if (map.categorical) {
            for (const [nodeId, catDist] of Object.entries(map.categorical)) {
                const node = state.categorical[nodeId];
                const normFactor = NODE_NORM_FACTORS[nodeId] ?? 1;
                const mixWeight = 0.4 * normFactor;
                const mixed = node.catDist.map((v, i) => v * (1 - mixWeight) + (catDist[i] ?? 0) * mixWeight);
                node.catDist = normalize(mixed);
            }
        }
    }
}
//# sourceMappingURL=update.js.map