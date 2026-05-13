/**
 * Run one archetype through the comparison harness and dump the averaged
 * state vs. target signature. Diagnostic for understanding why averaging
 * is under-performing.
 */
import { ARCHETYPES } from "../config/archetypes.js";
import { REPRESENTATIVE_QUESTIONS } from "../config/questions.representative.js";
import { CONTINUOUS_NODES } from "../config/nodes.js";
import { createInitialStateAvg, getPos, getSal } from "../engine/stateAvg.js";
import { archetypeDistanceAvg } from "../engine/archetypeDistanceAvg.js";
import { applySingleChoiceAnswerAvg, applySliderAnswerAvg, applyAllocationAnswerAvg, applyRankingAnswerAvg, applyPairwiseAnswerAvg, applyDualAxisAnswerAvg, } from "../engine/updateAvg.js";
import { applySingleChoiceAnswer, applySliderAnswer, applyAllocationAnswer, applyRankingAnswer, applyPairwiseAnswer, applyDualAxisAnswer, } from "../engine/update.js";
import { selectNextQuestion, isQuestionEligible } from "../engine/nextQuestion.js";
import { shouldStop, resetSimilarityCache } from "../engine/stopRule.js";
import { archetypeDistance } from "../engine/archetypeDistance.js";
import { CATEGORICAL_NODES } from "../config/nodes.js";
const targetId = process.argv[2] ?? "001";
const target = ARCHETYPES.find(a => a.id === targetId);
if (!target) {
    console.error(`Archetype ${targetId} not found`);
    process.exit(1);
}
// Minimal reimplementation of the scorer helpers and deriveAnswer for standalone use
function scoreOptionEvidence(a, e) {
    if (!e)
        return 1;
    let score = 0, count = 0;
    if (e.continuous)
        for (const [nodeId, upd] of Object.entries(e.continuous)) {
            const t = a.nodes[nodeId];
            if (!t || t.kind !== "continuous")
                continue;
            if (upd?.pos) {
                score += upd.pos[t.pos - 1] ?? 0;
                count++;
            }
            if (upd?.sal) {
                score += (upd.sal[t.sal] ?? 0) * 0.5;
                count += 0.5;
            }
        }
    if (e.categorical)
        for (const [nodeId, upd] of Object.entries(e.categorical)) {
            const t = a.nodes[nodeId];
            if (!t || t.kind !== "categorical")
                continue;
            if (upd?.cat) {
                let dot = 0;
                for (let i = 0; i < 6; i++)
                    dot += (t.probs[i] ?? 0) * (upd.cat[i] ?? 0);
                score += dot;
                count++;
            }
            if (upd?.sal) {
                score += (upd.sal[t.sal] ?? 0) * 0.5;
                count += 0.5;
            }
        }
    return count > 0 ? score / count : 0;
}
function scoreAllocationBucket(a, b) {
    let score = 0, count = 0;
    if (b.continuous)
        for (const [nodeId, s] of Object.entries(b.continuous)) {
            const t = a.nodes[nodeId];
            if (!t || t.kind !== "continuous")
                continue;
            score += ((t.pos - 3) / 2) * (s ?? 0);
            count++;
        }
    if (b.categorical)
        for (const [nodeId, cd] of Object.entries(b.categorical)) {
            const t = a.nodes[nodeId];
            if (!t || t.kind !== "categorical")
                continue;
            let dot = 0;
            for (let i = 0; i < 6; i++)
                dot += (t.probs[i] ?? 0) * (cd[i] ?? 0);
            score += dot;
            count++;
        }
    return count > 0 ? score / count : 0;
}
function scoreRankingItem(a, item) {
    let score = 0, count = 0;
    if (item.continuous)
        for (const [nodeId, s] of Object.entries(item.continuous)) {
            const t = a.nodes[nodeId];
            if (!t || t.kind !== "continuous")
                continue;
            score += ((t.pos - 3) / 2) * (s ?? 0);
            count++;
        }
    if (item.categorical)
        for (const [nodeId, cd] of Object.entries(item.categorical)) {
            const t = a.nodes[nodeId];
            if (!t || t.kind !== "categorical")
                continue;
            let dot = 0;
            for (let i = 0; i < 6; i++)
                dot += (t.probs[i] ?? 0) * (cd[i] ?? 0);
            score += dot;
            count++;
        }
    return count > 0 ? score / count : 0;
}
function scorePairOption(a, m) {
    let score = 0, count = 0;
    if (m.continuous)
        for (const [nodeId, s] of Object.entries(m.continuous)) {
            const t = a.nodes[nodeId];
            if (!t || t.kind !== "continuous")
                continue;
            score += ((t.pos - 3) / 2) * (s ?? 0);
            count++;
        }
    if (m.categorical)
        for (const [nodeId, cd] of Object.entries(m.categorical)) {
            const t = a.nodes[nodeId];
            if (!t || t.kind !== "categorical")
                continue;
            let dot = 0;
            for (let i = 0; i < 6; i++)
                dot += (t.probs[i] ?? 0) * (cd[i] ?? 0);
            score += dot;
            count++;
        }
    return count > 0 ? score / count : 0;
}
function createInitialState() {
    const continuous = {};
    for (const nodeId of CONTINUOUS_NODES)
        continuous[nodeId] = {
            posDist: [0.2, 0.2, 0.2, 0.2, 0.2],
            salDist: [0.25, 0.25, 0.25, 0.25],
            touches: 0, touchTypes: new Set(), status: "unknown",
        };
    const categorical = {};
    for (const nodeId of CATEGORICAL_NODES)
        categorical[nodeId] = {
            catDist: [1 / 6, 1 / 6, 1 / 6, 1 / 6, 1 / 6, 1 / 6],
            salDist: [0.25, 0.25, 0.25, 0.25],
            touches: 0, touchTypes: new Set(), status: "unknown",
        };
    return {
        answers: {}, continuous, categorical,
        trbAnchor: { dist: [1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9], touches: 0 },
        archetypeDistances: {}, currentLeader: undefined, consecutiveLeadCount: 0,
    };
}
resetSimilarityCache();
const active = ARCHETYPES.filter(a => a.active !== false);
const bayesState = createInitialState();
const avgState = createInitialStateAvg();
const answered = new Set();
for (let i = 0; i < 65; i++) {
    const available = REPRESENTATIVE_QUESTIONS.filter(q => !answered.has(q.id) && q.touchProfile.length > 0 && isQuestionEligible(bayesState, q));
    const nextQ = selectNextQuestion(bayesState, available, active);
    if (!nextQ)
        break;
    let applied = false;
    switch (nextQ.uiType) {
        case "single_choice":
        case "multi":
        case "conjoint": {
            if (!nextQ.optionEvidence)
                break;
            const opts = Object.keys(nextQ.optionEvidence);
            if (!opts.length)
                break;
            let best = opts[0], bs = -Infinity;
            for (const o of opts) {
                const s = scoreOptionEvidence(target, nextQ.optionEvidence[o]);
                if (s > bs) {
                    bs = s;
                    best = o;
                }
            }
            applySingleChoiceAnswer(bayesState, nextQ, best);
            applySingleChoiceAnswerAvg(avgState, nextQ, best);
            applied = true;
            break;
        }
        case "slider": {
            if (!nextQ.sliderMap)
                break;
            const bks = Object.keys(nextQ.sliderMap);
            if (!bks.length)
                break;
            let best = bks[0], bs = -Infinity;
            for (const b of bks) {
                const s = scoreOptionEvidence(target, nextQ.sliderMap[b]);
                if (s > bs) {
                    bs = s;
                    best = b;
                }
            }
            const p = best.split("-").map(Number);
            const mid = Math.round(((p[0] ?? 0) + (p[1] ?? 100)) / 2);
            applySliderAnswer(bayesState, nextQ, mid);
            applySliderAnswerAvg(avgState, nextQ, mid);
            applied = true;
            break;
        }
        case "allocation": {
            if (!nextQ.allocationMap)
                break;
            const names = Object.keys(nextQ.allocationMap);
            if (!names.length)
                break;
            const scores = {};
            for (const n of names)
                scores[n] = scoreAllocationBucket(target, nextQ.allocationMap[n]);
            const touched = new Set();
            for (const bucket of Object.values(nextQ.allocationMap)) {
                if (bucket.continuous)
                    for (const n of Object.keys(bucket.continuous))
                        touched.add(n);
                if (bucket.categorical)
                    for (const n of Object.keys(bucket.categorical))
                        touched.add(n);
            }
            let maxSal = 0;
            for (const n of touched) {
                const t = target.nodes[n];
                if (t && typeof t.sal === "number")
                    maxSal = Math.max(maxSal, t.sal);
            }
            const tempScale = 0.3 + (maxSal / 3) * 1.7;
            const minS = Math.min(...Object.values(scores));
            const shifted = {};
            for (const n of names)
                shifted[n] = Math.exp((scores[n] - minS) * tempScale);
            const total = Object.values(shifted).reduce((x, y) => x + y, 0);
            const alloc = {};
            for (const n of names)
                alloc[n] = Math.round((shifted[n] / total) * 100);
            const at = Object.values(alloc).reduce((x, y) => x + y, 0);
            if (at !== 100) {
                const mk = names.reduce((x, y) => alloc[x] > alloc[y] ? x : y);
                alloc[mk] = alloc[mk] + (100 - at);
            }
            applyAllocationAnswer(bayesState, nextQ, alloc);
            applyAllocationAnswerAvg(avgState, nextQ, alloc);
            applied = true;
            break;
        }
        case "ranking":
        case "best_worst": {
            const map = nextQ.rankingMap ?? nextQ.bestWorstMap;
            if (!map)
                break;
            const items = Object.keys(map);
            if (!items.length)
                break;
            const scored = items.map(i => ({ i, s: scoreRankingItem(target, map[i]) }));
            scored.sort((x, y) => y.s - x.s);
            const r = scored.map(x => x.i);
            applyRankingAnswer(bayesState, nextQ, r);
            applyRankingAnswerAvg(avgState, nextQ, r);
            applied = true;
            break;
        }
        case "pairwise": {
            if (!nextQ.pairMaps)
                break;
            const answers = {};
            for (const [pid, opts] of Object.entries(nextQ.pairMaps)) {
                let bc = "", bs = -Infinity;
                for (const [c, m] of Object.entries(opts)) {
                    const s = scorePairOption(target, m);
                    if (s > bs) {
                        bs = s;
                        bc = c;
                    }
                }
                if (bc)
                    answers[pid] = bc;
            }
            if (!Object.keys(answers).length)
                break;
            applyPairwiseAnswer(bayesState, nextQ, answers);
            applyPairwiseAnswerAvg(avgState, nextQ, answers);
            applied = true;
            break;
        }
        case "dual_axis": {
            if (!nextQ.dualAxisMap)
                break;
            const t = target.nodes[nextQ.dualAxisMap.node];
            if (!t || t.kind !== "continuous")
                break;
            applyDualAxisAnswer(bayesState, nextQ, { x: (t.pos - 1) / 4, y: t.sal / 3 });
            applyDualAxisAnswerAvg(avgState, nextQ, { x: (t.pos - 1) / 4, y: t.sal / 3 });
            applied = true;
            break;
        }
    }
    if (applied) {
        answered.add(nextQ.id);
        // update bayes distances so selector + stop work
        for (const a of active)
            bayesState.archetypeDistances[a.id] = archetypeDistance(bayesState, a);
        if (answered.size >= 25 && shouldStop(bayesState, active))
            break;
    }
    else {
        answered.add(nextQ.id);
    }
}
// ---------------------------------------------------------------------------
// Dump state
// ---------------------------------------------------------------------------
console.log(`\n== Archetype ${target.id} ${target.name} ==`);
console.log(`Questions answered: ${answered.size}`);
console.log(`\n== Per-node: target vs averaged vs bayes-mean ==`);
console.log(`Node   | tgtPos tgtSal | avgPos avgSal (touches) | bayesPos bayesSal`);
for (const nodeId of CONTINUOUS_NODES) {
    const t = target.nodes[nodeId];
    if (!t || t.kind !== "continuous")
        continue;
    const avgPos = getPos(avgState, nodeId);
    const avgSal = getSal(avgState, nodeId);
    const touches = avgState.continuous[nodeId].touches;
    const bn = bayesState.continuous[nodeId];
    const bayesPos = bn.posDist[0] * 1 + bn.posDist[1] * 2 + bn.posDist[2] * 3 + bn.posDist[3] * 4 + bn.posDist[4] * 5;
    const bayesSal = bn.salDist[0] * 0 + bn.salDist[1] * 1 + bn.salDist[2] * 2 + bn.salDist[3] * 3;
    console.log(`${nodeId.padEnd(6)} | ${t.pos}      ${t.sal}      | ${avgPos.toFixed(2)}   ${avgSal.toFixed(2)} (${touches.toString().padStart(2)})        | ${bayesPos.toFixed(2)}     ${bayesSal.toFixed(2)}`);
}
console.log(`\n== Top 10 by averaging distance ==`);
const avgDists = [];
for (const a of active)
    avgDists.push({ id: a.id, d: archetypeDistanceAvg(avgState, a) });
avgDists.sort((x, y) => x.d - y.d);
for (let i = 0; i < 10; i++) {
    const r = avgDists[i];
    const marker = r.id === target.id ? " <-- TARGET" : "";
    const name = ARCHETYPES.find(a => a.id === r.id)?.name ?? "?";
    console.log(`  #${(i + 1).toString().padStart(2)} ${r.id} ${name.padEnd(35)} dist=${r.d.toFixed(4)}${marker}`);
}
console.log(`\n== Top 10 by bayesian distance ==`);
const bayesDists = [];
for (const a of active)
    bayesDists.push({ id: a.id, d: archetypeDistance(bayesState, a) });
bayesDists.sort((x, y) => x.d - y.d);
for (let i = 0; i < 10; i++) {
    const r = bayesDists[i];
    const marker = r.id === target.id ? " <-- TARGET" : "";
    const name = ARCHETYPES.find(a => a.id === r.id)?.name ?? "?";
    console.log(`  #${(i + 1).toString().padStart(2)} ${r.id} ${name.padEnd(35)} dist=${r.d.toFixed(4)}${marker}`);
}
//# sourceMappingURL=inspectAvgState.js.map