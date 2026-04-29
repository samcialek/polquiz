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
// Priority-sort (card-sort) salience likelihoods. Each item gets dropped into
// one of three buckets: "high" = super-important, "mid" = care but not central,
// "low" = not central. This is a richer signal than best-worst because many
// items can land in each bucket — we don't force a forced-choice artifact.
// Likelihoods are shaped strongly because a deliberate placement is genuine
// importance signal (cf. SAL_IF_BEST [0.05,0.15,0.30,0.50]).
const SAL_PRIORITY_HIGH = [0.03, 0.10, 0.27, 0.60];
const SAL_PRIORITY_MID = [0.20, 0.30, 0.30, 0.20];
const SAL_PRIORITY_LOW = [0.55, 0.30, 0.12, 0.03];
// Priority-sort position mix weights. High-bucket placement pulls the position
// posterior toward the pole harder than best-worst best (BW_BEST_POS_MIX=0.35)
// because the user could have placed the item in a weaker bucket — choosing
// "high" is a stronger signal. Mid bucket pulls gently; low bucket skips
// position entirely (placing something in "not central" tells us nothing about
// which pole the user falls on — only that the node is low-salience).
const PRIORITY_HIGH_POS_MIX = 0.40;
const PRIORITY_MID_POS_MIX = 0.20;
// Dual-axis convex mix weight for the position update. Slightly stronger than
// priority-sort high-bucket (0.40) because the user made a precise placement
// on a continuous axis rather than a coarse bucket pick.
const DUAL_AXIS_POS_MIX = 0.45;
// Dual-axis salience likelihoods keyed on y ∈ [0,1] (0 = "doesn't matter",
// 1 = "central"). Shaped similarly to SAL_PRIORITY_* but on a 5-band split.
function dualAxisYtoSal(y) {
    if (y >= 0.80)
        return [0.03, 0.10, 0.27, 0.60];
    if (y >= 0.60)
        return [0.10, 0.20, 0.32, 0.38];
    if (y >= 0.40)
        return [0.22, 0.30, 0.28, 0.20];
    if (y >= 0.20)
        return [0.40, 0.30, 0.20, 0.10];
    return [0.60, 0.25, 0.12, 0.03];
}
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
function partyIdFromAnswer(optionKey) {
    switch (optionKey) {
        case "dem":
            return "D";
        case "rep":
            return "R";
        case "ind":
            return "I";
        case "third":
            return "T";
        case "none":
            return "N";
        default:
            return null;
    }
}
function negativePartiesFromAnswers(optionKeys) {
    const out = new Set();
    for (const optionKey of optionKeys) {
        if (optionKey === "never_dem")
            out.add("D");
        if (optionKey === "never_rep")
            out.add("R");
        if (optionKey === "never_dem_or_rep") {
            out.add("D");
            out.add("R");
        }
    }
    return out.size > 0 ? out : null;
}
function applyMetadataAnswer(state, q, optionKeyOrKeys) {
    const optionKeys = Array.isArray(optionKeyOrKeys) ? optionKeyOrKeys : [optionKeyOrKeys];
    switch (q.id) {
        case 200:
            state.partyID = typeof optionKeyOrKeys === "string"
                ? partyIdFromAnswer(optionKeyOrKeys)
                : null;
            return;
        case 211:
            state.strategicVoting = optionKeys.includes("strategic_lesser_evil");
            return;
        case 212:
            state.negativeParties = negativePartiesFromAnswers(optionKeys);
            return;
        default:
            return;
    }
}
export function applySingleChoiceAnswer(state, q, optionKey) {
    state.answers[q.id] = optionKey;
    applyMetadataAnswer(state, q, optionKey);
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
/**
 * Multi-select answer: apply each selected option's evidence in turn. The
 * answer is recorded as the array of selected option keys; each option's
 * `optionEvidence` block is applied independently.
 */
export function applyMultiAnswer(state, q, optionKeys) {
    state.answers[q.id] = optionKeys.slice();
    applyMetadataAnswer(state, q, optionKeys);
    registerTouches(state, q);
    for (const optionKey of optionKeys) {
        const ev = q.optionEvidence?.[optionKey];
        applyOptionEvidence(state, ev);
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
                // Ranking-question signal is the scalar-number variant of the widened
                // RankingItemMap.continuous type — narrow off the {pos} object form.
                const sig = typeof signal === "number" ? signal : 0;
                const bump = node.posDist.map((p, i) => p * Math.exp(sig * normFactor * rankWeight * ((i + 1) - 3)));
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
            // Narrow off scalar-number variant from the widened RankingItemMap
            // (used by `ranking` questions); best_worst expects `{ pos }` shape.
            if (typeof evidence !== "object" || !evidence?.pos)
                continue;
            const pos = evidence.pos;
            const node = state.continuous[nodeId];
            if (!node)
                continue;
            const w = isBest ? BW_BEST_POS_MIX : BW_WORST_POS_MIX;
            const sum = pos.reduce((a, b) => a + b, 0) || 1;
            const target = isBest
                ? pos.map((p) => p / sum)
                : pos.map((p) => (1 - p / sum));
            const tSum = target.reduce((a, b) => a + b, 0) || 1;
            const tNorm = target.map((p) => p / tSum);
            const mixed = node.posDist.map((v, i) => v * (1 - w) + tNorm[i] * w);
            node.posDist = normalize(mixed);
        }
    }
    // TRB-anchor side-channel for best_worst maxdiff items (Q63 etc.). Best
    // items contribute their declared anchor evidence at full weight ("this is
    // what my tribal anchor looks like"). Worst items are skipped: "the anchor
    // I least identify with" doesn't cleanly invert into negative evidence
    // under addToAnchorDist's positive-contribution semantics. Middle items
    // contribute nothing. Touches increment once per question if ANY best item
    // carried trbAnchor evidence — matching the per-question philosophy used
    // for salience aggregation above.
    let anchorApplied = false;
    for (const item of allItems) {
        if (!bestSet.has(item))
            continue;
        const map = q.rankingMap[item];
        if (!map?.trbAnchor)
            continue;
        state.trbAnchor.dist = addToAnchorDist(state.trbAnchor.dist, map.trbAnchor);
        anchorApplied = true;
    }
    if (anchorApplied)
        state.trbAnchor.touches += 1;
}
/**
 * Apply a priority-sort (card-sort) answer with four buckets:
 *   supportHigh — "central to my politics" (care + agree, strong)
 *   supportMid  — "I support it, but it isn't central"       (care + agree, mild)
 *   neutral     — "not central to my politics"               (don't care)
 *   opposeHigh  — "opposing this is central to my politics"  (care + disagree, strong)
 *
 * Salience (aggregated per-node across items):
 *   supportHigh OR opposeHigh present → SAL_PRIORITY_HIGH
 *   supportMid present                → SAL_PRIORITY_MID
 *   neutral only                      → SAL_PRIORITY_LOW
 *
 * Position (per-item mixing):
 *   supportHigh → pull toward pole at PRIORITY_HIGH_POS_MIX
 *   supportMid  → pull toward pole at PRIORITY_MID_POS_MIX
 *   neutral     → skip
 *   opposeHigh  → pull toward INVERTED pole distribution at PRIORITY_HIGH_POS_MIX
 *                 (same inversion pattern as applyBestWorstSalience's worst case)
 */
export function applyPrioritySort(state, q, placements, allItems) {
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
    const bucketFor = (item) => supportHighSet.has(item) ? "supportHigh"
        : opposeHighSet.has(item) ? "opposeHigh"
            : supportMidSet.has(item) ? "supportMid"
                : "neutral";
    // Per-node salience aggregation: record which buckets each node appears in,
    // then apply one salience update per node using the strongest signal.
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
    function resolveSal(buckets) {
        if (buckets.has("supportHigh") || buckets.has("opposeHigh"))
            return SAL_PRIORITY_HIGH;
        if (buckets.has("supportMid"))
            return SAL_PRIORITY_MID;
        return SAL_PRIORITY_LOW;
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
    // Pre-pass: detect contradictory-pole cases per node. PR 2 design D7 — if a
    // user places contradictory items (e.g., both `pro_low` and `pro_high` in
    // supportHigh) on the same node, the combined target distribution is near-
    // uniform. Treat as "high salience + uncertain position" rather than the
    // current order-dependent average. Salience update has already fired above;
    // here we just mark the node to skip position updates entirely.
    // Threshold: 95% of max entropy (log(5) ≈ 1.609) → 1.529. Below this the
    // combined target is concentrated enough to apply a meaningful pull.
    // Surfaced by Dump 1's Q93 where pro_low+pro_high in supportHigh produced
    // PRO=3.17 (near-neutral with order-bias toward pos=5) when Sam intended
    // PRO=low (rule-bender for fascist play).
    const UNIFORM_THRESHOLD_PSORT = 0.95 * Math.log(5);
    const perNodeTargetSum = new Map();
    const perNodeWeightSum = new Map();
    for (const item of allItems) {
        const map = q.rankingMap[item];
        if (!map?.continuous)
            continue;
        const bucket = bucketFor(item);
        if (bucket === "neutral")
            continue;
        const itemWeight = bucket === "supportMid" ? PRIORITY_MID_POS_MIX : PRIORITY_HIGH_POS_MIX;
        const invert = bucket === "opposeHigh";
        for (const [nodeId, evidence] of Object.entries(map.continuous)) {
            if (typeof evidence !== "object" || !evidence?.pos)
                continue;
            const pos = evidence.pos;
            const sum = pos.reduce((a, b) => a + b, 0) || 1;
            const raw = invert
                ? pos.map((p) => 1 - p / sum)
                : pos.map((p) => p / sum);
            const rawSum = raw.reduce((a, b) => a + b, 0) || 1;
            const itemTarget = raw.map((p) => p / rawSum);
            if (!perNodeTargetSum.has(nodeId)) {
                perNodeTargetSum.set(nodeId, [0, 0, 0, 0, 0]);
                perNodeWeightSum.set(nodeId, 0);
            }
            const acc = perNodeTargetSum.get(nodeId);
            for (let i = 0; i < 5; i++)
                acc[i] += itemTarget[i] * itemWeight;
            perNodeWeightSum.set(nodeId, (perNodeWeightSum.get(nodeId) ?? 0) + itemWeight);
        }
    }
    const skipPositionForNode = new Set();
    for (const [nodeId, sumArr] of perNodeTargetSum) {
        const totalW = perNodeWeightSum.get(nodeId) ?? 0;
        if (totalW <= 0)
            continue;
        const targetNorm = sumArr.map(v => v / totalW);
        let entropy = 0;
        for (const p of targetNorm)
            if (p > 0)
                entropy -= p * Math.log(p);
        if (entropy >= UNIFORM_THRESHOLD_PSORT)
            skipPositionForNode.add(nodeId);
    }
    // Q102 conditional escalation per PR 2 design D1.
    // The membership-criteria question (Q102) has its per-item evidence
    // distributions deliberately softened (per ADR-008) to avoid civic-
    // nationalist collapse when users mark a few criteria essential. But the
    // softening also suppresses the genuine MAX-extreme case where the user
    // marks ALL membership criteria as essential (= maximum-assimilationist
    // demand) or NONE (= maximum-pluralist anti-criterion). Override per-item
    // CU updates with a single concentrated pull when this extreme is detected.
    //
    // Surfaced by Dump 1 where Sam (fascist play) marked all 8 items in
    // supportHigh but engine landed CU=2.35 instead of Sam's target ≈1.4.
    // Predicted post-fix Dump 1 CU: from CU=2.636 going into Q102 → ≈1.40.
    if (q.id === 102) {
        const allInHigh = placements.supportHigh.length === allItems.length && allItems.length > 0;
        const allInOppose = placements.opposeHigh.length === allItems.length && allItems.length > 0;
        if (allInHigh || allInOppose) {
            const node = state.continuous["CU"];
            if (node) {
                // Max-extreme target: peaked sharply at pos=1 (assimilationist) for
                // all-supportHigh, peaked at pos=5 (pluralist) for all-opposeHigh.
                // Mix weight 0.85 — aggressive but justified for detected extreme.
                const target = (allInHigh
                    ? [0.90, 0.05, 0.03, 0.01, 0.01]
                    : [0.01, 0.01, 0.03, 0.05, 0.90]);
                const w = 0.85;
                const mixed = node.posDist.map((v, i) => v * (1 - w) + target[i] * w);
                node.posDist = normalize(mixed);
            }
            // Suppress the per-item CU position update — override has already fired.
            // Other nodes touched by Q102 (MOR, TRB, CD, MAT, ZS, PRO) get their
            // per-item updates as normal — those signals are item-specific.
            skipPositionForNode.add("CU");
        }
    }
    // Per-item continuous position mixing. Support buckets pull toward the pole;
    // oppose pulls toward the inverted pole (anti-pole); neutral skips. Nodes
    // flagged as contradictory (above) are skipped entirely — salience captured
    // their high-importance signal without committing to a position.
    for (const item of allItems) {
        const map = q.rankingMap[item];
        if (!map?.continuous)
            continue;
        const bucket = bucketFor(item);
        if (bucket === "neutral")
            continue;
        const w = (bucket === "supportMid") ? PRIORITY_MID_POS_MIX : PRIORITY_HIGH_POS_MIX;
        const invert = (bucket === "opposeHigh");
        for (const [nodeId, evidence] of Object.entries(map.continuous)) {
            if (skipPositionForNode.has(nodeId))
                continue;
            // Narrow off the scalar-number variant introduced in the widened
            // RankingItemMap type (used by `ranking` questions); priority-sort
            // expects the `{ pos }` shape.
            if (typeof evidence !== "object" || !evidence?.pos)
                continue;
            const pos = evidence.pos;
            const node = state.continuous[nodeId];
            if (!node)
                continue;
            const sum = pos.reduce((a, b) => a + b, 0) || 1;
            const raw = invert
                ? pos.map((p) => 1 - p / sum)
                : pos.map((p) => p / sum);
            const rawSum = raw.reduce((a, b) => a + b, 0) || 1;
            const target = raw.map((p) => p / rawSum);
            const mixed = node.posDist.map((v, i) => v * (1 - w) + target[i] * w);
            node.posDist = normalize(mixed);
        }
    }
}
/**
 * Dual-axis answer. A single grid tap produces (x, y) both in [0, 1]:
 *   x → position target via linear interp between `xLow` and `xHigh`,
 *       convex-mixed into posDist at DUAL_AXIS_POS_MIX.
 *   y → salience likelihood via `dualAxisYtoSal`, multiplied into salDist.
 *
 * Applies to the single node declared in q.dualAxisMap.node. Any additional
 * touchProfile entries are registered but not updated here — the gesture
 * directly signals only that node.
 */
export function applyDualAxisAnswer(state, q, answer) {
    const x = Math.max(0, Math.min(1, answer.x));
    const y = Math.max(0, Math.min(1, answer.y));
    state.answers[q.id] = { x, y };
    registerTouches(state, q);
    if (!q.dualAxisMap)
        return;
    const map = q.dualAxisMap;
    const node = state.continuous[map.node];
    if (!node)
        return;
    // Position: Gaussian target peaked at index 4*x (so x=0→pos1, x=0.5→pos3,
    // x=1→pos5), sigma=1.0 in index units. Replaces the earlier linear interp
    // between xLow and xHigh, which produced a bathtub at moderate x (x=0.5
    // returned a flat/valley distribution at pos=3, pulling moderate archetypes
    // off-position). xLow/xHigh are retained on the type for UI labeling only.
    const targetIdx = 4 * x;
    const sigma = 0.8;
    const raw = [0, 1, 2, 3, 4].map(i => {
        const d = i - targetIdx;
        return Math.exp(-0.5 * (d * d) / (sigma * sigma));
    });
    const rawSum = raw.reduce((a, b) => a + b, 0) || 1;
    const normTarget = raw.map(v => v / rawSum);
    const mixed = node.posDist.map((v, i) => v * (1 - DUAL_AXIS_POS_MIX) + (normTarget[i] ?? 0) * DUAL_AXIS_POS_MIX);
    node.posDist = normalize(mixed);
    // Salience: y bucket → likelihood ratio, multiply into salDist.
    node.salDist = multiplyAndNormalize(node.salDist, dualAxisYtoSal(y));
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