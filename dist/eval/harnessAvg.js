// Parallel comparison harness: Bayesian vs. averaging engine on identical inputs.
//
// Design: the Bayesian engine drives question selection + stop rule (since
// those operate on posteriors and we don't have an averaging-aware selector
// yet). Each archetype-optimal answer is applied to BOTH a Bayesian
// RespondentState AND an averaging AvgRespondentState in lockstep. At the
// end we score both and report which archetype each engine picks.
//
// This isolates the only real difference: how state is accumulated and how
// the final scorer computes distance. Question order, stop timing, and the
// raw answer content are identical across engines.
import { CONTINUOUS_NODES, CATEGORICAL_NODES } from "../config/nodes.js";
import { applySingleChoiceAnswer, applySliderAnswer, applyAllocationAnswer, applyRankingAnswer, applyPairwiseAnswer, applyDualAxisAnswer, } from "../engine/update.js";
import { applySingleChoiceAnswerAvg, applySliderAnswerAvg, applyAllocationAnswerAvg, applyRankingAnswerAvg, applyPairwiseAnswerAvg, applyDualAxisAnswerAvg, } from "../engine/updateAvg.js";
import { selectNextQuestion, isQuestionEligible } from "../engine/nextQuestion.js";
import { shouldStop, resetSimilarityCache } from "../engine/stopRule.js";
import { archetypeDistance } from "../engine/archetypeDistance.js";
import { recomputeArchetypeDistancesAvg } from "../engine/archetypeDistanceAvg.js";
import { createInitialStateAvg } from "../engine/stateAvg.js";
import { createRng } from "./rng.js";
import { jitterArchetype } from "./noise.js";
// ---------------------------------------------------------------------------
// State init (Bayesian — same as harness.ts)
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
// Archetype-optimal answer scorers (copied from harness.ts — archetype-signature
// based, not state-based, so same logic works for both engines).
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
                score += (upd.sal[template.sal ?? 0] ?? 0) * 0.5;
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
                score += (upd.sal[template.sal ?? 0] ?? 0) * 0.5;
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
            const scalar = typeof signal === "number" ? signal : 0;
            score += desiredDirection * scalar;
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
            const scalar = typeof signal === "number" ? signal : 0;
            score += desiredDirection * scalar;
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
            const scalar = typeof signal === "number" ? signal : 0;
            score += desiredDirection * scalar;
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
function dualApply(bayesFn, avgFn) {
    return { apply: () => { bayesFn(); avgFn(); } };
}
function deriveAnswer(a, q, bayesState, avgState) {
    switch (q.uiType) {
        case "single_choice":
        case "multi":
        case "conjoint": {
            if (!q.optionEvidence)
                return null;
            const options = Object.keys(q.optionEvidence);
            if (!options.length)
                return null;
            let best = options[0], bestScore = -Infinity;
            for (const opt of options) {
                const score = scoreOptionEvidence(a, q.optionEvidence[opt]);
                if (score > bestScore) {
                    bestScore = score;
                    best = opt;
                }
            }
            return dualApply(() => applySingleChoiceAnswer(bayesState, q, best), () => applySingleChoiceAnswerAvg(avgState, q, best));
        }
        case "slider": {
            if (!q.sliderMap)
                return null;
            const buckets = Object.keys(q.sliderMap);
            if (!buckets.length)
                return null;
            let best = buckets[0], bestScore = -Infinity;
            for (const b of buckets) {
                const score = scoreOptionEvidence(a, q.sliderMap[b]);
                if (score > bestScore) {
                    bestScore = score;
                    best = b;
                }
            }
            const parts = best.split("-").map(Number);
            const midpoint = Math.round(((parts[0] ?? 0) + (parts[1] ?? 100)) / 2);
            return dualApply(() => applySliderAnswer(bayesState, q, midpoint), () => applySliderAnswerAvg(avgState, q, midpoint));
        }
        case "allocation": {
            if (!q.allocationMap)
                return null;
            const names = Object.keys(q.allocationMap);
            if (!names.length)
                return null;
            const scores = {};
            for (const n of names)
                scores[n] = scoreAllocationBucket(a, q.allocationMap[n]);
            const touched = new Set();
            for (const bucket of Object.values(q.allocationMap)) {
                if (bucket.continuous)
                    for (const n of Object.keys(bucket.continuous))
                        touched.add(n);
                if (bucket.categorical)
                    for (const n of Object.keys(bucket.categorical))
                        touched.add(n);
            }
            let maxSal = 0;
            for (const n of touched) {
                const tmpl = a.nodes[n];
                if (tmpl && typeof tmpl.sal === "number")
                    maxSal = Math.max(maxSal, tmpl.sal);
            }
            const tempScale = 0.3 + (maxSal / 3) * 1.7;
            const minScore = Math.min(...Object.values(scores));
            const shifted = {};
            for (const n of names)
                shifted[n] = Math.exp((scores[n] - minScore) * tempScale);
            const total = Object.values(shifted).reduce((x, y) => x + y, 0);
            const allocation = {};
            for (const n of names)
                allocation[n] = Math.round((shifted[n] / total) * 100);
            const allocTotal = Object.values(allocation).reduce((x, y) => x + y, 0);
            if (allocTotal !== 100) {
                const maxKey = names.reduce((x, y) => allocation[x] > allocation[y] ? x : y);
                allocation[maxKey] = allocation[maxKey] + (100 - allocTotal);
            }
            return dualApply(() => applyAllocationAnswer(bayesState, q, allocation), () => applyAllocationAnswerAvg(avgState, q, allocation));
        }
        case "ranking":
        case "best_worst": {
            const map = q.rankingMap ?? q.bestWorstMap;
            if (!map)
                return null;
            const items = Object.keys(map);
            if (!items.length)
                return null;
            const scored = items.map(i => ({ i, score: scoreRankingItem(a, map[i]) }));
            scored.sort((x, y) => y.score - x.score);
            const ranking = scored.map(x => x.i);
            return dualApply(() => applyRankingAnswer(bayesState, q, ranking), () => applyRankingAnswerAvg(avgState, q, ranking));
        }
        case "pairwise": {
            if (!q.pairMaps)
                return null;
            const answers = {};
            for (const [pairId, options] of Object.entries(q.pairMaps)) {
                let bestChoice = "", bestScore = -Infinity;
                for (const [choice, pm] of Object.entries(options)) {
                    const score = scorePairOption(a, pm);
                    if (score > bestScore) {
                        bestScore = score;
                        bestChoice = choice;
                    }
                }
                if (bestChoice)
                    answers[pairId] = bestChoice;
            }
            if (!Object.keys(answers).length)
                return null;
            return dualApply(() => applyPairwiseAnswer(bayesState, q, answers), () => applyPairwiseAnswerAvg(avgState, q, answers));
        }
        case "dual_axis": {
            if (!q.dualAxisMap)
                return null;
            const template = a.nodes[q.dualAxisMap.node];
            if (!template || template.kind !== "continuous")
                return null;
            const x = (template.pos - 1) / 4;
            const y = (template.sal ?? 0) / 3;
            return dualApply(() => applyDualAxisAnswer(bayesState, q, { x, y }), () => applyDualAxisAnswerAvg(avgState, q, { x, y }));
        }
        default:
            return null;
    }
}
// ---------------------------------------------------------------------------
// Bayesian scorer hook (used for selection + stop-rule, kept authoritative)
// ---------------------------------------------------------------------------
function updateBayesDistances(state, archetypes) {
    let leaderId;
    let leaderDist = Infinity;
    for (const a of archetypes) {
        const d = archetypeDistance(state, a);
        state.archetypeDistances[a.id] = d;
        if (d < leaderDist) {
            leaderDist = d;
            leaderId = a.id;
        }
    }
    if (leaderId === state.currentLeader) {
        state.consecutiveLeadCount = (state.consecutiveLeadCount ?? 0) + 1;
    }
    else {
        state.currentLeader = leaderId;
        state.consecutiveLeadCount = 1;
    }
}
export function simulateCompared(target, archetypes, questions, opts = {}) {
    const noiseSigma = opts.noiseSigma ?? 0;
    const seed = opts.seed ?? 0;
    const maxQuestions = opts.maxQuestions ?? 65;
    resetSimilarityCache();
    const rng = createRng(seed);
    const simulatedProfile = noiseSigma > 0 ? jitterArchetype(target, noiseSigma, rng) : target;
    const activeArchetypes = archetypes.filter(a => a.active !== false);
    const bayesState = createInitialState();
    const avgState = createInitialStateAvg();
    const answeredIds = new Set();
    let questionsAnswered = 0;
    for (let i = 0; i < maxQuestions; i++) {
        const available = questions.filter(q => !answeredIds.has(q.id) && q.touchProfile.length > 0 && isQuestionEligible(bayesState, q));
        const nextQ = selectNextQuestion(bayesState, available, activeArchetypes);
        if (!nextQ)
            break;
        const answer = deriveAnswer(simulatedProfile, nextQ, bayesState, avgState);
        if (answer) {
            answer.apply();
            answeredIds.add(nextQ.id);
            questionsAnswered++;
            updateBayesDistances(bayesState, activeArchetypes);
            if (questionsAnswered >= 25 && shouldStop(bayesState, activeArchetypes))
                break;
        }
        else {
            answeredIds.add(nextQ.id);
        }
    }
    updateBayesDistances(bayesState, activeArchetypes);
    recomputeArchetypeDistancesAvg(avgState, activeArchetypes);
    const rankFromDistances = (distances) => {
        const sorted = Object.entries(distances)
            .filter(([, d]) => Number.isFinite(d))
            .sort((a, b) => a[1] - b[1]);
        const top1 = sorted[0]?.[0] ?? "";
        const top3 = sorted.slice(0, 3).map(([id]) => id);
        const top5 = sorted.slice(0, 5).map(([id]) => id);
        const leaderDist = sorted[0]?.[1] ?? Infinity;
        const secondDist = sorted[1]?.[1] ?? Infinity;
        const gapRatio = Number.isFinite(leaderDist) && leaderDist > 0 && Number.isFinite(secondDist)
            ? (secondDist - leaderDist) / leaderDist
            : 0;
        const targetRank = sorted.findIndex(([id]) => id === target.id) + 1;
        return { top1, top3, top5, leaderDist, gapRatio, targetRank };
    };
    const b = rankFromDistances(bayesState.archetypeDistances);
    const v = rankFromDistances(avgState.archetypeDistances);
    return {
        archetypeId: target.id,
        archetypeName: target.name,
        noiseSigma,
        seed,
        questionsAnswered,
        bayes: {
            top1: b.top1,
            top3: b.top3,
            top5: b.top5,
            correct1: b.top1 === target.id,
            correct3: b.top3.includes(target.id),
            correct5: b.top5.includes(target.id),
            leaderDist: b.leaderDist,
            gapRatio: b.gapRatio,
            targetRank: b.targetRank,
        },
        avg: {
            top1: v.top1,
            top3: v.top3,
            top5: v.top5,
            correct1: v.top1 === target.id,
            correct3: v.top3.includes(target.id),
            correct5: v.top5.includes(target.id),
            leaderDist: v.leaderDist,
            gapRatio: v.gapRatio,
            targetRank: v.targetRank,
        },
        agree1: b.top1 === v.top1,
        agree3: b.top3[0] === v.top3[0] && b.top3[1] === v.top3[1] && b.top3[2] === v.top3[2],
        agree5: b.top5.every((id, idx) => v.top5[idx] === id),
    };
}
//# sourceMappingURL=harnessAvg.js.map