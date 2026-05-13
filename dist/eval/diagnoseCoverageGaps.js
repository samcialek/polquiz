// Coverage-gap diagnostic for MOR=1, ONT_S=4, ONT_S=5 cells.
//
// Three passes:
//   1. Static evidence audit — for every touching question, enumerate every
//      slot (option / bucket / item / pair-choice / dual-axis cell) and score
//      how strongly that slot would push the target node's posterior toward
//      the target pos. Answers: "is there a reachable slot at all?"
//   2. Dynamic pick audit — run simulateOne on every archetype that has the
//      target template value. Inspect which slot the scorer actually picks
//      for each touching question, and what its target-pos signal is.
//      Answers: "do the archetypes with this template value actually pick
//      slots that push toward target pos?"
//   3. Counterfactual oracle — override the answer generator so that, for
//      the touching questions, the respondent always picks the slot that
//      maximises push toward target pos. Re-run, and measure whether the
//      target-node posterior now resolves.
//      Answers: "if we force target-optimal picks, does the posterior move?"
//
// Outputs:
//   results/question-audit/gap-diagnosis-MOR-1.md
//   results/question-audit/gap-diagnosis-ONT_S-4.md
//   results/question-audit/gap-diagnosis-ONT_S-5.md
//   results/question-audit/gap-diagnosis-summary.md
import fs from "node:fs";
import path from "node:path";
import { ARCHETYPES } from "../config/archetypes.js";
import { REPRESENTATIVE_QUESTIONS } from "../config/questions.representative.js";
import { CONTINUOUS_NODES, CATEGORICAL_NODES } from "../config/nodes.js";
import { applySingleChoiceAnswer, applySliderAnswer, applyAllocationAnswer, applyRankingAnswer, applyPairwiseAnswer, applyDualAxisAnswer, } from "../engine/update.js";
import { selectNextQuestion, isQuestionEligible } from "../engine/nextQuestion.js";
import { shouldStop, resetSimilarityCache } from "../engine/stopRule.js";
import { archetypeDistance } from "../engine/archetypeDistance.js";
const OUT_DIR = "results/question-audit";
const TARGETS = [
    { node: "MOR", pos: 1 },
    { node: "ONT_S", pos: 4 },
    { node: "ONT_S", pos: 5 },
];
// ---------------------------------------------------------------------------
// State init (copy of harness.createInitialState to avoid exposing it).
// ---------------------------------------------------------------------------
function createInitialState() {
    const continuous = {};
    for (const nodeId of CONTINUOUS_NODES) {
        continuous[nodeId] = {
            posDist: [0.2, 0.2, 0.2, 0.2, 0.2],
            salDist: [0.25, 0.25, 0.25, 0.25],
            touches: 0,
            touchTypes: new Set(),
            status: "unknown",
        };
    }
    const categorical = {};
    for (const nodeId of CATEGORICAL_NODES) {
        categorical[nodeId] = {
            catDist: [1 / 6, 1 / 6, 1 / 6, 1 / 6, 1 / 6, 1 / 6],
            salDist: [0.25, 0.25, 0.25, 0.25],
            touches: 0,
            touchTypes: new Set(),
            status: "unknown",
        };
    }
    return {
        answers: {},
        continuous,
        categorical,
        trbAnchor: {
            dist: [1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9],
            touches: 0,
        },
        archetypeDistances: {},
        currentLeader: undefined,
        consecutiveLeadCount: 0,
    };
}
// ---------------------------------------------------------------------------
// Pass 1 — static evidence audit.
//
// For each evidence slot, extract the "target-push likelihood" — a scalar in
// [-1, 1] where +1 = strong push toward target pos and -1 = strong push away.
//
// Shapes vary per UI type:
//   single_choice, slider, best_worst-with-pos, priority_sort-with-pos → 5-vec `pos`
//   dual_axis → x maps to the 5-vec via Gaussian at 4*x (peak)
//   allocation → scalar `signal` on node (positive = pos 5, negative = pos 1)
//   ranking → same scalar convention, modulated by rank weights
//   pairwise → scalar per choice
// ---------------------------------------------------------------------------
/** Posterior-push score: mass at target pos in a normalised 5-vector, relative
 *  to the uniform baseline (0.20). */
function pushFrom5Vec(vec, targetPos) {
    const sum = vec.reduce((a, b) => a + b, 0) || 1;
    const p = (vec[targetPos - 1] ?? 0) / sum;
    // Ranges from -0.25 (no mass at target) to +0.80 (all mass at target).
    return p - 0.20;
}
/** Scalar signal push: +signal → pos 5, -signal → pos 1. */
function pushFromScalar(signal, targetPos) {
    // Target-pos location on [-1, +1]: pos 1 → -1, pos 3 → 0, pos 5 → +1.
    const targetLoc = (targetPos - 3) / 2;
    // Same sign → positive push; opposite sign → negative push.
    return signal * targetLoc;
}
function auditQuestion(q, target) {
    const slots = [];
    const tn = target.node;
    const tp = target.pos;
    // single_choice / multi / conjoint use optionEvidence
    if (q.optionEvidence) {
        for (const [key, ev] of Object.entries(q.optionEvidence)) {
            const pos = ev?.continuous?.[tn]?.pos;
            if (!pos)
                continue;
            slots.push({
                qid: q.id,
                qPrompt: q.promptShort,
                uiType: q.uiType,
                slotKey: key,
                shape: "5vec",
                pushScore: pushFrom5Vec(pos, tp),
                detail: `[${pos.map(v => v.toFixed(2)).join(",")}]`,
            });
        }
    }
    if (q.sliderMap) {
        for (const [bucket, ev] of Object.entries(q.sliderMap)) {
            const pos = ev?.continuous?.[tn]?.pos;
            if (!pos)
                continue;
            slots.push({
                qid: q.id,
                qPrompt: q.promptShort,
                uiType: q.uiType,
                slotKey: bucket,
                shape: "5vec",
                pushScore: pushFrom5Vec(pos, tp),
                detail: `[${pos.map(v => v.toFixed(2)).join(",")}]`,
            });
        }
    }
    if (q.allocationMap) {
        for (const [bucket, map] of Object.entries(q.allocationMap)) {
            const signal = map.continuous?.[tn];
            if (signal === undefined)
                continue;
            slots.push({
                qid: q.id,
                qPrompt: q.promptShort,
                uiType: q.uiType,
                slotKey: bucket,
                shape: "scalar",
                pushScore: pushFromScalar(signal, tp),
                detail: `signal=${signal.toFixed(2)}`,
            });
        }
    }
    if (q.rankingMap) {
        for (const [item, map] of Object.entries(q.rankingMap)) {
            const rmap = map;
            const ev = rmap.continuous?.[tn];
            if (ev === undefined)
                continue;
            // RankingItemMap.continuous typed as OptionEvidenceContinuous, but
            // applyRankingAnswer reads it as scalar. Both shapes appear in the
            // data depending on question — best_worst/priority_sort uses {pos}
            // and ranking uses scalar. Probe dynamically.
            if (typeof ev === "number") {
                slots.push({
                    qid: q.id,
                    qPrompt: q.promptShort,
                    uiType: q.uiType,
                    slotKey: item,
                    shape: "scalar",
                    pushScore: pushFromScalar(ev, tp),
                    detail: `signal=${ev.toFixed(2)}`,
                });
            }
            else if (ev.pos) {
                const pos = ev.pos;
                slots.push({
                    qid: q.id,
                    qPrompt: q.promptShort,
                    uiType: q.uiType,
                    slotKey: item,
                    shape: "5vec",
                    pushScore: pushFrom5Vec(pos, tp),
                    detail: `[${pos.map(v => v.toFixed(2)).join(",")}]`,
                });
            }
        }
    }
    if (q.pairMaps) {
        for (const [pairId, options] of Object.entries(q.pairMaps)) {
            for (const [choice, map] of Object.entries(options)) {
                const signal = map.continuous?.[tn];
                if (signal === undefined)
                    continue;
                slots.push({
                    qid: q.id,
                    qPrompt: q.promptShort,
                    uiType: q.uiType,
                    slotKey: `${pairId}:${choice}`,
                    shape: "scalar",
                    pushScore: pushFromScalar(signal, tp),
                    detail: `signal=${signal.toFixed(2)}`,
                });
            }
        }
    }
    if (q.dualAxisMap?.node === tn) {
        // x=0→pos1, x=1→pos5 via Gaussian at index 4*x, sigma=0.8 (matches update.ts).
        // Report two extremes + midpoint.
        for (const x of [0, 0.25, 0.5, 0.75, 1]) {
            const targetIdx = 4 * x;
            const sigma = 0.8;
            const raw = [0, 1, 2, 3, 4].map(i => {
                const d = i - targetIdx;
                return Math.exp(-0.5 * (d * d) / (sigma * sigma));
            });
            const s = raw.reduce((a, b) => a + b, 0) || 1;
            const norm = raw.map(v => v / s);
            slots.push({
                qid: q.id,
                qPrompt: q.promptShort,
                uiType: q.uiType,
                slotKey: `x=${x.toFixed(2)}`,
                shape: "dual_axis",
                pushScore: pushFrom5Vec(norm, tp),
                detail: `[${norm.map(v => v.toFixed(2)).join(",")}]`,
            });
        }
    }
    return slots;
}
// ---------------------------------------------------------------------------
// Pass 2 — dynamic trace. Run simulateOne-equivalent but keep direct handle
// on the archetype's per-question pick and the target node's evolving
// posterior.
// ---------------------------------------------------------------------------
function scoreOptionEvidence(archetype, evidence) {
    if (!evidence)
        return 1;
    let score = 0, count = 0;
    if (evidence.continuous) {
        for (const [nodeId, upd] of Object.entries(evidence.continuous)) {
            const template = archetype.nodes[nodeId];
            if (!template || template.kind !== "continuous")
                continue;
            if (upd?.pos) {
                score += upd.pos[template.pos - 1] ?? 0;
                count++;
            }
            if (upd?.sal) {
                score += (upd.sal[template.sal] ?? 0) * 0.5;
                count += 0.5;
            }
        }
    }
    if (evidence.categorical) {
        for (const [nodeId, upd] of Object.entries(evidence.categorical)) {
            const template = archetype.nodes[nodeId];
            if (!template || template.kind !== "categorical")
                continue;
            if (upd?.cat) {
                let dot = 0;
                for (let i = 0; i < 6; i++)
                    dot += (template.probs[i] ?? 0) * (upd.cat[i] ?? 0);
                score += dot;
                count++;
            }
            if (upd?.sal) {
                score += (upd.sal[template.sal] ?? 0) * 0.5;
                count += 0.5;
            }
        }
    }
    return count > 0 ? score / count : 0;
}
function scoreAllocationBucket(archetype, bucket) {
    let score = 0, count = 0;
    if (bucket.continuous) {
        for (const [nodeId, signal] of Object.entries(bucket.continuous)) {
            const template = archetype.nodes[nodeId];
            if (!template || template.kind !== "continuous")
                continue;
            const desiredDirection = (template.pos - 3) / 2;
            score += desiredDirection * (signal ?? 0);
            count++;
        }
    }
    if (bucket.categorical) {
        for (const [nodeId, catDist] of Object.entries(bucket.categorical)) {
            const template = archetype.nodes[nodeId];
            if (!template || template.kind !== "categorical")
                continue;
            let dot = 0;
            for (let i = 0; i < 6; i++)
                dot += (template.probs[i] ?? 0) * (catDist[i] ?? 0);
            score += dot;
            count++;
        }
    }
    return count > 0 ? score / count : 0;
}
function scoreRankingItem(archetype, item) {
    let score = 0, count = 0;
    if (item.continuous) {
        for (const [nodeId, signal] of Object.entries(item.continuous)) {
            const template = archetype.nodes[nodeId];
            if (!template || template.kind !== "continuous")
                continue;
            const desiredDirection = (template.pos - 3) / 2;
            // signal is typed as OptionEvidenceContinuous but the engine treats it
            // as scalar for ranking uiType — same dynamic probing as pass 1.
            const sigNum = typeof signal === "number" ? signal : 0;
            score += desiredDirection * sigNum;
            count++;
        }
    }
    if (item.categorical) {
        for (const [nodeId, catDist] of Object.entries(item.categorical)) {
            const template = archetype.nodes[nodeId];
            if (!template || template.kind !== "categorical")
                continue;
            let dot = 0;
            for (let i = 0; i < 6; i++)
                dot += (template.probs[i] ?? 0) * (catDist[i] ?? 0);
            score += dot;
            count++;
        }
    }
    return count > 0 ? score / count : 0;
}
function scorePairOption(archetype, map) {
    let score = 0, count = 0;
    if (map.continuous) {
        for (const [nodeId, signal] of Object.entries(map.continuous)) {
            const template = archetype.nodes[nodeId];
            if (!template || template.kind !== "continuous")
                continue;
            const desiredDirection = (template.pos - 3) / 2;
            score += desiredDirection * (signal ?? 0);
            count++;
        }
    }
    if (map.categorical) {
        for (const [nodeId, catDist] of Object.entries(map.categorical)) {
            const template = archetype.nodes[nodeId];
            if (!template || template.kind !== "categorical")
                continue;
            let dot = 0;
            for (let i = 0; i < 6; i++)
                dot += (template.probs[i] ?? 0) * (catDist[i] ?? 0);
            score += dot;
            count++;
        }
    }
    return count > 0 ? score / count : 0;
}
function pickAndApply(mode, q, s) {
    const tn = mode.kind === "oracle" ? mode.target.node : null;
    const tp = mode.kind === "oracle" ? mode.target.pos : 0;
    const useOracle = mode.kind === "oracle" && mode.touchingQids.has(q.id);
    // Helper: for oracle, find the slot that maximises target-pos push.
    const bestBySlotScore = (items, scoreArch, scoreOracle) => {
        if (!items.length)
            return { item: null, pushScore: 0 };
        let best = items[0], bestScore = -Infinity;
        for (const x of items) {
            const sc = useOracle ? scoreOracle(x) : scoreArch(x);
            if (sc > bestScore) {
                bestScore = sc;
                best = x;
            }
        }
        return { item: best, pushScore: useOracle ? bestScore : 0 };
    };
    switch (q.uiType) {
        case "single_choice":
        case "multi":
        case "conjoint": {
            if (!q.optionEvidence)
                return { applied: false, slotKey: "", pushScore: 0 };
            const keys = Object.keys(q.optionEvidence);
            if (!keys.length)
                return { applied: false, slotKey: "", pushScore: 0 };
            const pick = bestBySlotScore(keys, k => scoreOptionEvidence(mode.kind === "archetype" ? mode.archetype : mode.archetype, q.optionEvidence[k]), k => {
                if (!tn)
                    return 0;
                const pos = q.optionEvidence[k]?.continuous?.[tn]?.pos;
                return pos ? pushFrom5Vec(pos, tp) : -1;
            });
            if (pick.item) {
                applySingleChoiceAnswer(s, q, pick.item);
                return { applied: true, slotKey: pick.item, pushScore: pick.pushScore };
            }
            return { applied: false, slotKey: "", pushScore: 0 };
        }
        case "slider": {
            if (!q.sliderMap)
                return { applied: false, slotKey: "", pushScore: 0 };
            const keys = Object.keys(q.sliderMap);
            if (!keys.length)
                return { applied: false, slotKey: "", pushScore: 0 };
            const pick = bestBySlotScore(keys, k => scoreOptionEvidence(mode.kind === "archetype" ? mode.archetype : mode.archetype, q.sliderMap[k]), k => {
                if (!tn)
                    return 0;
                const pos = q.sliderMap[k]?.continuous?.[tn]?.pos;
                return pos ? pushFrom5Vec(pos, tp) : -1;
            });
            if (pick.item) {
                const parts = pick.item.split("-").map(Number);
                const midpoint = Math.round(((parts[0] ?? 0) + (parts[1] ?? 100)) / 2);
                applySliderAnswer(s, q, midpoint);
                return { applied: true, slotKey: pick.item, pushScore: pick.pushScore };
            }
            return { applied: false, slotKey: "", pushScore: 0 };
        }
        case "allocation": {
            if (!q.allocationMap)
                return { applied: false, slotKey: "", pushScore: 0 };
            const names = Object.keys(q.allocationMap);
            if (!names.length)
                return { applied: false, slotKey: "", pushScore: 0 };
            if (useOracle && tn) {
                // Dump all mass into the bucket with maximal target-pos push.
                const pick = bestBySlotScore(names, n => scoreAllocationBucket(mode.kind === "archetype" ? mode.archetype : mode.archetype, q.allocationMap[n]), n => {
                    const signal = q.allocationMap[n].continuous?.[tn];
                    return signal !== undefined ? pushFromScalar(signal, tp) : -1;
                });
                if (!pick.item)
                    return { applied: false, slotKey: "", pushScore: 0 };
                const allocation = {};
                for (const n of names)
                    allocation[n] = 0;
                allocation[pick.item] = 100;
                applyAllocationAnswer(s, q, allocation);
                return { applied: true, slotKey: `${pick.item}=100`, pushScore: pick.pushScore };
            }
            // Archetype mode: harness's softmax alloc.
            const scores = {};
            for (const n of names)
                scores[n] = scoreAllocationBucket(mode.archetype, q.allocationMap[n]);
            const minScore = Math.min(...Object.values(scores));
            const shifted = {};
            for (const n of names)
                shifted[n] = Math.exp((scores[n] - minScore) * 2);
            const total = Object.values(shifted).reduce((x, y) => x + y, 0);
            const allocation = {};
            for (const n of names)
                allocation[n] = Math.round((shifted[n] / total) * 100);
            const allocTotal = Object.values(allocation).reduce((x, y) => x + y, 0);
            if (allocTotal !== 100) {
                const maxKey = names.reduce((x, y) => allocation[x] > allocation[y] ? x : y);
                allocation[maxKey] = allocation[maxKey] + (100 - allocTotal);
            }
            applyAllocationAnswer(s, q, allocation);
            return { applied: true, slotKey: JSON.stringify(allocation), pushScore: 0 };
        }
        case "ranking": {
            if (!q.rankingMap)
                return { applied: false, slotKey: "", pushScore: 0 };
            const items = Object.keys(q.rankingMap);
            if (!items.length)
                return { applied: false, slotKey: "", pushScore: 0 };
            if (useOracle && tn) {
                // Rank target-pushing items first; others last.
                const scored = items.map(i => {
                    const ev = q.rankingMap[i].continuous?.[tn];
                    const sc = ev === undefined ? -Infinity
                        : typeof ev === "number" ? pushFromScalar(ev, tp)
                            : ev.pos ? pushFrom5Vec(ev.pos, tp)
                                : -Infinity;
                    return { i, sc };
                });
                scored.sort((a, b) => b.sc - a.sc);
                const ranking = scored.map(x => x.i);
                applyRankingAnswer(s, q, ranking);
                return { applied: true, slotKey: `oracle:${ranking[0]}`, pushScore: scored[0]?.sc ?? 0 };
            }
            const scored = items.map(i => ({ i, score: scoreRankingItem(mode.archetype, q.rankingMap[i]) }));
            scored.sort((x, y) => y.score - x.score);
            const ranking = scored.map(x => x.i);
            applyRankingAnswer(s, q, ranking);
            return { applied: true, slotKey: `arch:${ranking[0]}`, pushScore: 0 };
        }
        case "pairwise": {
            if (!q.pairMaps)
                return { applied: false, slotKey: "", pushScore: 0 };
            const answers = {};
            let maxPush = 0;
            let pickedKey = "";
            for (const [pairId, options] of Object.entries(q.pairMaps)) {
                const choices = Object.keys(options);
                if (!choices.length)
                    continue;
                if (useOracle && tn) {
                    let best = choices[0], bestSc = -Infinity;
                    for (const c of choices) {
                        const signal = options[c].continuous?.[tn];
                        const sc = signal !== undefined ? pushFromScalar(signal, tp) : -1;
                        if (sc > bestSc) {
                            bestSc = sc;
                            best = c;
                        }
                    }
                    answers[pairId] = best;
                    if (bestSc > maxPush) {
                        maxPush = bestSc;
                        pickedKey = `${pairId}:${best}`;
                    }
                }
                else {
                    let best = choices[0], bestSc = -Infinity;
                    for (const c of choices) {
                        const sc = scorePairOption(mode.archetype, options[c]);
                        if (sc > bestSc) {
                            bestSc = sc;
                            best = c;
                        }
                    }
                    answers[pairId] = best;
                }
            }
            applyPairwiseAnswer(s, q, answers);
            return { applied: true, slotKey: pickedKey || "pairwise", pushScore: maxPush };
        }
        case "dual_axis": {
            if (!q.dualAxisMap)
                return { applied: false, slotKey: "", pushScore: 0 };
            if (useOracle && q.dualAxisMap.node === tn) {
                // Pick x so that 4*x == tp-1.
                const x = Math.max(0, Math.min(1, (tp - 1) / 4));
                const y = 1.0;
                applyDualAxisAnswer(s, q, { x, y });
                return { applied: true, slotKey: `x=${x.toFixed(2)},y=${y.toFixed(2)}`, pushScore: 1 };
            }
            const archetype = mode.archetype;
            const template = archetype.nodes[q.dualAxisMap.node];
            if (!template || template.kind !== "continuous")
                return { applied: false, slotKey: "", pushScore: 0 };
            const x = (template.pos - 1) / 4;
            const y = template.sal / 3;
            applyDualAxisAnswer(s, q, { x, y });
            return { applied: true, slotKey: `x=${x.toFixed(2)},y=${y.toFixed(2)}`, pushScore: 0 };
        }
        case "best_worst": {
            // Treat as ranking (harness fallback).
            if (!q.rankingMap)
                return { applied: false, slotKey: "", pushScore: 0 };
            const items = Object.keys(q.rankingMap);
            if (!items.length)
                return { applied: false, slotKey: "", pushScore: 0 };
            if (useOracle && tn) {
                const scored = items.map(i => {
                    const ev = q.rankingMap[i].continuous?.[tn];
                    const sc = ev === undefined ? -Infinity
                        : typeof ev === "number" ? pushFromScalar(ev, tp)
                            : ev.pos ? pushFrom5Vec(ev.pos, tp)
                                : -Infinity;
                    return { i, sc };
                });
                scored.sort((a, b) => b.sc - a.sc);
                const ranking = scored.map(x => x.i);
                applyRankingAnswer(s, q, ranking);
                return { applied: true, slotKey: `oracle:${ranking[0]}`, pushScore: scored[0]?.sc ?? 0 };
            }
            const scored = items.map(i => ({ i, score: scoreRankingItem(mode.archetype, q.rankingMap[i]) }));
            scored.sort((x, y) => y.score - x.score);
            const ranking = scored.map(x => x.i);
            applyRankingAnswer(s, q, ranking);
            return { applied: true, slotKey: `arch:${ranking[0]}`, pushScore: 0 };
        }
        default:
            return { applied: false, slotKey: "", pushScore: 0 };
    }
}
function runSimulation(target, mode, node, touchingQids) {
    resetSimilarityCache();
    const activeArchetypes = ARCHETYPES.filter(a => a.active !== false);
    const s = createInitialState();
    const answeredIds = new Set();
    let qa = 0;
    const touchingQs = [];
    for (let i = 0; i < 65; i++) {
        const available = REPRESENTATIVE_QUESTIONS.filter(q => !answeredIds.has(q.id) && q.touchProfile.length > 0 && isQuestionEligible(s, q));
        const nextQ = selectNextQuestion(s, available, activeArchetypes);
        if (!nextQ)
            break;
        const pick = pickAndApply(mode, nextQ, s);
        if (pick.applied) {
            if (touchingQids.has(nextQ.id)) {
                touchingQs.push({
                    qid: nextQ.id,
                    prompt: nextQ.promptShort,
                    slotKey: pick.slotKey,
                    pushScore: pick.pushScore,
                    posAfter: [...s.continuous[node].posDist],
                });
            }
            answeredIds.add(nextQ.id);
            qa++;
            // Update distances inline.
            let best, bestD = Infinity;
            for (const a of activeArchetypes) {
                const d = archetypeDistance(s, a);
                s.archetypeDistances[a.id] = d;
                if (d < bestD) {
                    bestD = d;
                    best = a.id;
                }
            }
            if (best === s.currentLeader)
                s.consecutiveLeadCount = (s.consecutiveLeadCount ?? 0) + 1;
            else {
                s.currentLeader = best;
                s.consecutiveLeadCount = 1;
            }
            if (qa >= 25 && shouldStop(s, activeArchetypes))
                break;
        }
        else {
            answeredIds.add(nextQ.id);
        }
    }
    const sorted = Object.entries(s.archetypeDistances).sort((a, b) => a[1] - b[1]);
    const topId = sorted[0]?.[0] ?? "";
    const posDist = s.continuous[node].posDist;
    const tp = mode.kind === "oracle" ? mode.target.pos : 0;
    const argmax = posDist.indexOf(Math.max(...posDist)) + 1;
    return {
        archetypeId: target.id,
        archetypeName: target.name,
        questionsAnswered: qa,
        finalPosDist: [...posDist],
        finalSalDist: [...s.continuous[node].salDist],
        targetMass: tp > 0 ? posDist[tp - 1] ?? 0 : 0,
        targetArgmax: argmax,
        correct: topId === target.id,
        touchingQs,
    };
}
// ---------------------------------------------------------------------------
// Assembly.
// ---------------------------------------------------------------------------
function fmt(n, d = 3) { return n.toFixed(d); }
function fmtPct(n, d = 1) { return (n * 100).toFixed(d) + "%"; }
function diagnoseOne(target) {
    const { node, pos } = target;
    const lines = [];
    lines.push(`# Coverage Gap Diagnosis — ${node} pos=${pos}\n`);
    lines.push(`Target: posterior argmax at pos=${pos} on node ${node}.\n`);
    // ---- Archetype roster ----
    const gapArchetypes = ARCHETYPES.filter(a => {
        if (a.active === false)
            return false;
        const t = a.nodes[node];
        return t && t.kind === "continuous" && t.pos === pos;
    });
    lines.push(`Archetypes with ${node}.pos=${pos}: **${gapArchetypes.length}** `
        + `(${gapArchetypes.map(a => a.id).join(", ")})\n`);
    // ---- Questions touching node ----
    const touchingQs = REPRESENTATIVE_QUESTIONS.filter(q => q.touchProfile.some(t => t.kind === "continuous" && t.node === node && t.role !== "salience"));
    const touchingQids = new Set(touchingQs.map(q => q.id));
    lines.push(`Questions touching ${node} on position: **${touchingQs.length}**\n`);
    // ---- Pass 1: static audit ----
    lines.push(`## Pass 1 — Static evidence reachability\n`);
    lines.push(`For every evidence slot on every touching question, compute the \`pushScore\``);
    lines.push(`for this target cell. Push is defined as:\n`);
    lines.push(`- 5-vec slots: \`mass_at_target - 0.20\` (uniform baseline).`);
    lines.push(`  Range: -0.20 (no mass) to +0.80 (all mass at target).`);
    lines.push(`- scalar slots: \`signal * (target-3)/2\`, so +signal pushes toward pos=5`);
    lines.push(`  and -signal pushes toward pos=1.\n`);
    lines.push(`| Qid | Prompt | uiType | #slots | max push | mean push | best slot |`);
    lines.push(`|-----|--------|--------|--------|----------|-----------|-----------|`);
    const q1Rows = [];
    for (const q of touchingQs) {
        const slots = auditQuestion(q, target);
        if (!slots.length) {
            q1Rows.push({ q, slots, max: 0, mean: 0 });
            continue;
        }
        const scores = slots.map(s => s.pushScore);
        const max = Math.max(...scores);
        const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
        const best = slots.reduce((a, b) => a.pushScore > b.pushScore ? a : b);
        q1Rows.push({ q, slots, max, mean, best });
    }
    q1Rows.sort((a, b) => b.max - a.max);
    for (const r of q1Rows) {
        const bestStr = r.best ? `\`${r.best.slotKey}\` ${r.best.detail}` : "—";
        lines.push(`| Q${r.q.id} | \`${r.q.promptShort}\` | ${r.q.uiType} | ${r.slots.length} | `
            + `${fmt(r.max)} | ${fmt(r.mean)} | ${bestStr} |`);
    }
    lines.push("");
    // Flag structural failures
    const noReachable = q1Rows.filter(r => r.max < 0.10);
    const strongReachable = q1Rows.filter(r => r.max >= 0.30);
    lines.push(`**Structural summary.** ${strongReachable.length}/${q1Rows.length} questions have at least`);
    lines.push(`one slot with strong target push (≥0.30). ${noReachable.length}/${q1Rows.length} have **no**`);
    lines.push(`slot that pushes meaningfully toward target (max <0.10) — these questions`);
    lines.push(`cannot resolve this cell on their own, even under oracle picks.\n`);
    // ---- Pass 2: dynamic trace ----
    lines.push(`## Pass 2 — Dynamic pick trace (archetype scorer)\n`);
    lines.push(`For each gap archetype, run the simulation and record which slot the`);
    lines.push(`archetype scorer picks on each touching question, and what push that slot`);
    lines.push(`delivers toward the target cell.\n`);
    const archRuns = [];
    for (const a of gapArchetypes) {
        const res = runSimulation(a, { kind: "archetype", archetype: a }, node, touchingQids);
        archRuns.push({ archId: a.id, res });
    }
    // Summary of final posteriors
    lines.push(`### Final ${node} posterior per gap archetype (archetype mode)\n`);
    lines.push(`| Arch | Name | qA | correct | argmax | mass@target | posDist |`);
    lines.push(`|------|------|----|---------|--------|-------------|---------|`);
    for (const { archId, res } of archRuns) {
        lines.push(`| ${archId} | ${res.archetypeName} | ${res.questionsAnswered} | ${res.correct ? "✓" : "✗"} | `
            + `${res.targetArgmax} | ${fmt(res.targetMass)} | [${res.finalPosDist.map(v => fmt(v, 2)).join(",")}] |`);
    }
    lines.push("");
    // Aggregate: which touching questions get picked, what push they deliver
    const pickCounts = new Map();
    for (const { res } of archRuns) {
        for (const t of res.touchingQs) {
            const bucket = pickCounts.get(t.qid) ?? { picks: [], pushes: [] };
            bucket.picks.push(t.slotKey);
            bucket.pushes.push(t.pushScore);
            pickCounts.set(t.qid, bucket);
        }
    }
    // Also, what's the *static* pushScore the scorer effectively delivers
    // (lookup: pass-1 row for that qid, for the picked slot)?
    lines.push(`### Per-question scorer behavior (archetype mode)\n`);
    lines.push(`Which slots do the ${gapArchetypes.length} gap archetypes actually pick? And`);
    lines.push(`what static push does that slot deliver toward the target?\n`);
    lines.push(`| Qid | Prompt | picks (unique) | mean push | max push across gap cohort |`);
    lines.push(`|-----|--------|----------------|-----------|------------------------------|`);
    const pass1ByQid = new Map();
    for (const r of q1Rows)
        pass1ByQid.set(r.q.id, r);
    const rowsPass2 = [];
    for (const qid of touchingQids) {
        const bucket = pickCounts.get(qid);
        if (!bucket) {
            rowsPass2.push({
                qid, prompt: touchingQs.find(q => q.id === qid)?.promptShort ?? "?",
                uniquePicks: "(not asked)",
                meanStaticPush: 0, maxStaticPush: 0, asked: 0,
            });
            continue;
        }
        const unique = Array.from(new Set(bucket.picks));
        // Map each picked slotKey back to pass-1 static score.
        const pass1 = pass1ByQid.get(qid);
        const staticPushes = [];
        if (pass1) {
            for (const slotKey of bucket.picks) {
                const slot = pass1.slots.find(s => s.slotKey === slotKey);
                if (slot)
                    staticPushes.push(slot.pushScore);
            }
        }
        const mean = staticPushes.length ? staticPushes.reduce((a, b) => a + b, 0) / staticPushes.length : 0;
        const max = staticPushes.length ? Math.max(...staticPushes) : 0;
        rowsPass2.push({
            qid, prompt: touchingQs.find(q => q.id === qid)?.promptShort ?? "?",
            uniquePicks: unique.slice(0, 4).join(", ") + (unique.length > 4 ? ` (+${unique.length - 4} more)` : ""),
            meanStaticPush: mean, maxStaticPush: max,
            asked: bucket.picks.length,
        });
    }
    rowsPass2.sort((a, b) => b.maxStaticPush - a.maxStaticPush);
    for (const r of rowsPass2) {
        lines.push(`| Q${r.qid} | \`${r.prompt}\` | ${r.uniquePicks} (asked ${r.asked}/${gapArchetypes.length}) | `
            + `${fmt(r.meanStaticPush)} | ${fmt(r.maxStaticPush)} |`);
    }
    lines.push("");
    // ---- Pass 3: oracle counterfactual ----
    lines.push(`## Pass 3 — Oracle counterfactual\n`);
    lines.push(`Override the answer generator: for every touching question, pick the slot`);
    lines.push(`that maximises push toward the target cell. This is the theoretical ceiling`);
    lines.push(`given the current evidence maps — if oracle picks **still** don't resolve`);
    lines.push(`the posterior, the gap is structural (evidence maps themselves).\n`);
    const oracleRuns = [];
    for (const a of gapArchetypes) {
        const res = runSimulation(a, { kind: "oracle", archetype: a, target, touchingQids }, node, touchingQids);
        oracleRuns.push({ archId: a.id, res });
    }
    const oracleResolved = oracleRuns.filter(r => r.res.targetArgmax === pos).length;
    const oracleMeanMass = oracleRuns.reduce((s, r) => s + r.res.targetMass, 0) / oracleRuns.length;
    const archResolved = archRuns.filter(r => r.res.targetArgmax === pos).length;
    const archMeanMass = archRuns.reduce((s, r) => s + r.res.targetMass, 0) / archRuns.length;
    lines.push(`### Resolution comparison (archetype mode vs. oracle mode)\n`);
    lines.push(`| Mode | resolved (argmax=${pos}) | mean mass@target |`);
    lines.push(`|------|---------------------------|-------------------|`);
    lines.push(`| archetype scorer | ${archResolved}/${archRuns.length} | ${fmt(archMeanMass)} |`);
    lines.push(`| oracle (target-optimal picks) | ${oracleResolved}/${oracleRuns.length} | ${fmt(oracleMeanMass)} |`);
    lines.push("");
    lines.push(`### Final ${node} posterior per gap archetype (oracle mode)\n`);
    lines.push(`| Arch | Name | argmax | mass@target | posDist |`);
    lines.push(`|------|------|--------|-------------|---------|`);
    for (const { archId, res } of oracleRuns) {
        lines.push(`| ${archId} | ${res.archetypeName} | ${res.targetArgmax} | ${fmt(res.targetMass)} | `
            + `[${res.finalPosDist.map(v => fmt(v, 2)).join(",")}] |`);
    }
    lines.push("");
    // ---- Diagnosis ----
    lines.push(`## Diagnosis\n`);
    const anyReachable = q1Rows.some(r => r.max >= 0.30);
    const oraclePulls = oracleMeanMass > archMeanMass + 0.05;
    if (oracleResolved >= Math.ceil(oracleRuns.length * 0.5)) {
        lines.push(`**Picker mismatch.** Oracle picks resolve the majority of gap archetypes`);
        lines.push(`(${oracleResolved}/${oracleRuns.length}). Evidence maps are sufficient; the`);
        lines.push(`archetype scorer is not steering gap archetypes toward target-pushing slots.`);
        lines.push(`Root cause is in the archetype signatures OR in how the scorer weights`);
        lines.push(`position vs. salience vs. other nodes.\n`);
    }
    else if (!anyReachable) {
        lines.push(`**Structural evidence gap.** No touching question has any slot that`);
        lines.push(`pushes pos=${pos} hard enough (max push across all slots <0.30). Even oracle`);
        lines.push(`picks cannot produce a target-pos posterior, because the evidence maps`);
        lines.push(`simply do not place mass at pos=${pos}. Fix: author new evidence for the`);
        lines.push(`top touching questions to include pos=${pos} target distributions.\n`);
    }
    else if (oraclePulls && oracleResolved < oracleRuns.length / 2) {
        lines.push(`**Dilution.** Evidence maps have target-push slots (${strongReachable.length} questions`);
        lines.push(`with max push ≥0.30), but per-question push strength is insufficient to`);
        lines.push(`overcome the opposing signal from other touching questions or from the`);
        lines.push(`adaptive selector weighting away from this cell. Fix: strengthen the`);
        lines.push(`target-side slots on the top-leverage questions, or re-weight selector.\n`);
    }
    else {
        lines.push(`**Mixed.** Some reachability exists (${strongReachable.length} strong-push questions)`);
        lines.push(`but oracle resolution is weak (${oracleResolved}/${oracleRuns.length}). Likely`);
        lines.push(`combination of dilution + scorer weighting. Inspect the per-question`);
        lines.push(`pass-2 table for picks where push is negative or near-zero.\n`);
    }
    // Identify the top-3 highest-leverage questions to reshape
    const topLeverage = q1Rows.slice(0, 3);
    lines.push(`### Top-3 leverage questions for intervention\n`);
    for (const r of topLeverage) {
        lines.push(`- **Q${r.q.id}** \`${r.q.promptShort}\` (${r.q.uiType}, ${r.slots.length} slots). `
            + `Max push ${fmt(r.max)}, best slot \`${r.best?.slotKey ?? "—"}\` ${r.best?.detail ?? ""}.`);
        // Briefly sketch what would help
        if (r.max < 0.30) {
            lines.push(`  - *Gap*: no slot concentrates mass on pos=${pos}. Authoring work: `
                + `add an option/bucket/item whose ${node} mass peaks at index ${pos - 1}.`);
        }
    }
    lines.push("");
    // Write to file
    fs.mkdirSync(OUT_DIR, { recursive: true });
    const fname = path.join(OUT_DIR, `gap-diagnosis-${node}-${pos}.md`);
    fs.writeFileSync(fname, lines.join("\n"));
    console.log(`  wrote ${fname}`);
    // Return summary data for cross-target summary file
    globalThis.__gap_summary ??= [];
    globalThis.__gap_summary.push({
        node, pos,
        nArch: gapArchetypes.length,
        nQuestions: touchingQs.length,
        strongReachable: strongReachable.length,
        archResolved,
        archMeanMass,
        oracleResolved,
        oracleMeanMass,
        topLeverage: topLeverage.map(r => ({ qid: r.q.id, prompt: r.q.promptShort, maxPush: r.max })),
    });
}
function writeSummary() {
    const summary = globalThis.__gap_summary ?? [];
    const lines = [];
    lines.push(`# Coverage Gap Diagnosis — Summary\n`);
    lines.push(`One-line diagnostic per target cell. Details in per-cell files.\n`);
    lines.push(`| Cell | #arch | #Q | strong-reach | arch resolved | arch mass | oracle resolved | oracle mass | verdict |`);
    lines.push(`|------|-------|----|--------------|----------------|-----------|------------------|--------------|---------|`);
    for (const s of summary) {
        const archMeanMass = Number(s.archMeanMass) || 0;
        const oracleMeanMass = Number(s.oracleMeanMass) || 0;
        const archResolved = s.archResolved;
        const oracleResolved = s.oracleResolved;
        const nArch = s.nArch;
        const strongReach = s.strongReachable;
        const verdict = Number(oracleResolved) >= Math.ceil(Number(nArch) * 0.5) ? "picker mismatch"
            : Number(strongReach) <= 1 ? "structural gap"
                : oracleMeanMass > archMeanMass + 0.05 ? "dilution"
                    : "mixed";
        lines.push(`| **${s.node} pos=${s.pos}** | ${nArch} | ${s.nQuestions} | ${strongReach} | `
            + `${archResolved}/${nArch} | ${archMeanMass.toFixed(3)} | ${oracleResolved}/${nArch} | `
            + `${oracleMeanMass.toFixed(3)} | ${verdict} |`);
    }
    lines.push("");
    lines.push(`## Next-step menu\n`);
    for (const s of summary) {
        const top = s.topLeverage;
        lines.push(`### ${s.node} pos=${s.pos}`);
        for (const t of top) {
            lines.push(`- Q${t.qid} \`${t.prompt}\` — current max push ${t.maxPush.toFixed(3)}`);
        }
        lines.push("");
    }
    fs.mkdirSync(OUT_DIR, { recursive: true });
    const fname = path.join(OUT_DIR, `gap-diagnosis-summary.md`);
    fs.writeFileSync(fname, lines.join("\n"));
    console.log(`  wrote ${fname}`);
}
// ---------------------------------------------------------------------------
// Run
// ---------------------------------------------------------------------------
console.log(`Diagnosing ${TARGETS.length} coverage gap cells...`);
for (const t of TARGETS) {
    console.log(`  ${t.node} pos=${t.pos}`);
    diagnoseOne(t);
}
writeSummary();
console.log(`Done.`);
//# sourceMappingURL=diagnoseCoverageGaps.js.map