/**
 * PRISM Quiz Engine — Full Diagnostic Simulation
 *
 * Two diagnostic modes:
 *
 * 1. ARCHETYPE SIMULATIONS: For each archetype, run N simulated quiz sessions
 *    with temperature-based noisy answer selection (softmax over option scores).
 *    Tracks top-1, top-3, top-5 accuracy, avg questions, margin, posterior.
 *
 * 2. RANDOM WALK SIMULATIONS: Completely random responses to test pipeline
 *    robustness. Tracks archetype distribution, entropy, question counts.
 *
 * Usage:
 *   npx tsx src/test/full-diagnostic.ts                    # Full run (all archetypes × 100 + 10k random)
 *   npx tsx src/test/full-diagnostic.ts --archetype-only   # Archetype sims only
 *   npx tsx src/test/full-diagnostic.ts --random-only      # Random walks only
 *   npx tsx src/test/full-diagnostic.ts --runs 10          # Override runs per archetype
 *   npx tsx src/test/full-diagnostic.ts --random-runs 1000 # Override random walk count
 *   npx tsx src/test/full-diagnostic.ts --temp 0.4         # Override temperature (default 0.35)
 */
import * as fs from "node:fs";
import * as path from "node:path";
import { ARCHETYPES } from "../config/archetypes.js";
import { REPRESENTATIVE_QUESTIONS } from "../config/questions.representative.js";
import { CONTINUOUS_NODES, CATEGORICAL_NODES } from "../config/nodes.js";
import { applySingleChoiceAnswer, applySliderAnswer, applyAllocationAnswer, applyRankingAnswer, applyPairwiseAnswer, } from "../engine/update.js";
import { selectNextQuestion } from "../engine/nextQuestion.js";
import { shouldStop, resetSimilarityCache } from "../engine/stopRule.js";
import { archetypeDistance } from "../engine/archetypeDistance.js";
import { resetConfig } from "../optimize/runtimeConfig.js";
// ---------------------------------------------------------------------------
// CLI argument parsing
// ---------------------------------------------------------------------------
const args = process.argv.slice(2);
function getFlag(name) {
    return args.includes(`--${name}`);
}
function getArg(name, fallback) {
    const idx = args.indexOf(`--${name}`);
    if (idx >= 0 && idx + 1 < args.length) {
        const val = Number(args[idx + 1]);
        if (!isNaN(val))
            return val;
    }
    return fallback;
}
const ARCHETYPE_ONLY = getFlag("archetype-only");
const RANDOM_ONLY = getFlag("random-only");
const RUNS_PER_ARCHETYPE = getArg("runs", 100);
const RANDOM_WALK_COUNT = getArg("random-runs", 10000);
const TEMPERATURE = getArg("temp", 0.35);
const MAX_QUESTIONS = 65;
// ---------------------------------------------------------------------------
// State initialization (same as simulation.ts)
// ---------------------------------------------------------------------------
function createInitialState(archetypes) {
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
    const archetypePosterior = {};
    for (const a of archetypes) {
        archetypePosterior[a.id] = a.prior;
    }
    return {
        answers: {},
        continuous,
        categorical,
        trbAnchor: {
            dist: [1 / 7, 1 / 7, 1 / 7, 1 / 7, 1 / 7, 1 / 7, 1 / 7],
            touches: 0,
        },
        archetypePosterior,
        currentLeader: undefined,
        consecutiveLeadCount: 0,
    };
}
// ---------------------------------------------------------------------------
// Posterior update (same as simulation.ts)
// ---------------------------------------------------------------------------
function updatePosteriors(state, archetypes) {
    const nAnswered = Object.keys(state.answers).length;
    const distances = {};
    let minDist = Infinity;
    for (const a of archetypes) {
        const dist = archetypeDistance(state, a);
        distances[a.id] = dist;
        if (dist < minDist)
            minDist = dist;
    }
    const baseTemp = 0.12;
    const minTemp = 0.04;
    const coolRate = Math.min(1.0, nAnswered / 40);
    const temperature = baseTemp - (baseTemp - minTemp) * coolRate;
    let totalLikelihood = 0;
    const likelihoods = {};
    for (const a of archetypes) {
        const likelihood = Math.exp(-(distances[a.id] - minDist) / temperature);
        likelihoods[a.id] = likelihood * a.prior;
        totalLikelihood += likelihoods[a.id];
    }
    for (const a of archetypes) {
        state.archetypePosterior[a.id] = totalLikelihood > 0
            ? likelihoods[a.id] / totalLikelihood
            : a.prior;
    }
    const entries = Object.entries(state.archetypePosterior)
        .sort((a, b) => b[1] - a[1]);
    const newLeader = entries[0]?.[0];
    if (newLeader === state.currentLeader) {
        state.consecutiveLeadCount = (state.consecutiveLeadCount ?? 0) + 1;
    }
    else {
        state.currentLeader = newLeader;
        state.consecutiveLeadCount = 1;
    }
}
// ---------------------------------------------------------------------------
// Scoring functions (copied from simulation.ts)
// ---------------------------------------------------------------------------
function scoreOptionEvidence(archetype, evidence) {
    if (!evidence)
        return 1;
    let score = 0;
    let count = 0;
    if (evidence.continuous) {
        for (const [nodeId, upd] of Object.entries(evidence.continuous)) {
            const template = archetype.nodes[nodeId];
            if (!template || template.kind !== "continuous")
                continue;
            if (upd?.pos) {
                const posIdx = template.pos - 1;
                score += upd.pos[posIdx] ?? 0;
                count++;
            }
            if (upd?.sal) {
                const salIdx = template.sal;
                score += (upd.sal[salIdx] ?? 0) * 0.5;
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
                for (let i = 0; i < 6; i++) {
                    dot += (template.probs[i] ?? 0) * (upd.cat[i] ?? 0);
                }
                score += dot;
                count++;
            }
            if (upd?.sal) {
                const salIdx = template.sal;
                score += (upd.sal[salIdx] ?? 0) * 0.5;
                count += 0.5;
            }
        }
    }
    if (evidence.trbAnchor && archetype.trbAnchorPrior) {
        for (const [anchor, weight] of Object.entries(evidence.trbAnchor)) {
            const archWeight = archetype.trbAnchorPrior[anchor] ?? 0;
            score += archWeight * (weight ?? 0) > 0 ? 0.3 : 0;
            count += 0.3;
        }
    }
    return count > 0 ? score / count : 0;
}
function scoreAllocationBucket(archetype, bucket) {
    let score = 0;
    let count = 0;
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
            for (let i = 0; i < 6; i++) {
                dot += (template.probs[i] ?? 0) * (catDist[i] ?? 0);
            }
            score += dot;
            count++;
        }
    }
    return count > 0 ? score / count : 0;
}
function scoreRankingItem(archetype, item) {
    let score = 0;
    let count = 0;
    if (item.continuous) {
        for (const [nodeId, signal] of Object.entries(item.continuous)) {
            const template = archetype.nodes[nodeId];
            if (!template || template.kind !== "continuous")
                continue;
            const desiredDirection = (template.pos - 3) / 2;
            score += desiredDirection * (signal ?? 0);
            count++;
        }
    }
    if (item.categorical) {
        for (const [nodeId, catDist] of Object.entries(item.categorical)) {
            const template = archetype.nodes[nodeId];
            if (!template || template.kind !== "categorical")
                continue;
            let dot = 0;
            for (let i = 0; i < 6; i++) {
                dot += (template.probs[i] ?? 0) * (catDist[i] ?? 0);
            }
            score += dot;
            count++;
        }
    }
    if (item.trbAnchor && archetype.trbAnchorPrior) {
        for (const [anchor, weight] of Object.entries(item.trbAnchor)) {
            const archWeight = archetype.trbAnchorPrior[anchor] ?? 0;
            score += archWeight * (weight ?? 0);
            count++;
        }
    }
    return count > 0 ? score / count : 0;
}
function scorePairOption(archetype, map) {
    let score = 0;
    let count = 0;
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
            for (let i = 0; i < 6; i++) {
                dot += (template.probs[i] ?? 0) * (catDist[i] ?? 0);
            }
            score += dot;
            count++;
        }
    }
    return count > 0 ? score / count : 0;
}
// ---------------------------------------------------------------------------
// Softmax-based noisy selection
// ---------------------------------------------------------------------------
/**
 * Given an array of { key, score } pairs and a temperature, select one
 * using softmax probabilities. Lower temperature → more deterministic,
 * higher → more random. At temp=0 always picks best.
 */
function softmaxSelect(items, temp) {
    if (items.length === 0)
        throw new Error("softmaxSelect: empty items");
    if (items.length === 1)
        return items[0];
    if (temp <= 0) {
        // Deterministic: pick max
        let best = items[0];
        for (const item of items) {
            if (item.score > best.score)
                best = item;
        }
        return best;
    }
    // Compute softmax weights
    const maxScore = Math.max(...items.map((i) => i.score));
    const weights = items.map((item) => Math.exp((item.score - maxScore) / temp));
    const totalWeight = weights.reduce((a, b) => a + b, 0);
    // Sample
    let r = Math.random() * totalWeight;
    for (let i = 0; i < items.length; i++) {
        r -= weights[i];
        if (r <= 0)
            return items[i];
    }
    return items[items.length - 1];
}
// ---------------------------------------------------------------------------
// Noisy archetype-based answer generation (wraps deterministic scoring)
// ---------------------------------------------------------------------------
function generateNoisyAnswer(archetype, question, state, temp) {
    switch (question.uiType) {
        case "single_choice":
            return generateNoisySingleChoice(archetype, question, state, temp);
        case "slider":
            return generateNoisySlider(archetype, question, state, temp);
        case "allocation":
            return generateNoisyAllocation(archetype, question, state, temp);
        case "ranking":
            return generateNoisyRanking(archetype, question, state, temp);
        case "pairwise":
            return generateNoisyPairwise(archetype, question, state, temp);
        case "best_worst":
            return generateNoisyBestWorst(archetype, question, state, temp);
        case "multi":
            return generateNoisyMulti(archetype, question, state, temp);
        default:
            return null;
    }
}
function generateNoisySingleChoice(archetype, question, state, temp) {
    if (!question.optionEvidence)
        return null;
    const options = Object.keys(question.optionEvidence);
    if (options.length === 0)
        return null;
    const scored = options.map((opt) => ({
        opt,
        score: scoreOptionEvidence(archetype, question.optionEvidence[opt]),
    }));
    const selected = softmaxSelect(scored, temp);
    return {
        apply: () => applySingleChoiceAnswer(state, question, selected.opt),
    };
}
function generateNoisySlider(archetype, question, state, temp) {
    if (!question.sliderMap)
        return null;
    const buckets = Object.keys(question.sliderMap);
    if (buckets.length === 0)
        return null;
    const scored = buckets.map((bucket) => ({
        bucket,
        score: scoreOptionEvidence(archetype, question.sliderMap[bucket]),
    }));
    const selected = softmaxSelect(scored, temp);
    // Convert bucket to a value with some noise within the bucket range
    const parts = selected.bucket.split("-").map(Number);
    const lo = parts[0] ?? 0;
    const hi = parts[1] ?? 100;
    // Add noise within the bucket range instead of always picking midpoint
    const value = Math.round(lo + Math.random() * (hi - lo));
    return {
        apply: () => applySliderAnswer(state, question, value),
    };
}
function generateNoisyAllocation(archetype, question, state, temp) {
    if (!question.allocationMap)
        return null;
    const bucketNames = Object.keys(question.allocationMap);
    if (bucketNames.length === 0)
        return null;
    const scores = {};
    for (const name of bucketNames) {
        const bucket = question.allocationMap[name];
        scores[name] = scoreAllocationBucket(archetype, bucket);
    }
    // Softmax with noise temperature applied to the allocation temperature
    const minScore = Math.min(...Object.values(scores));
    // Use inverse of temp for allocation softmax (higher temp = more uniform allocation)
    const allocTemp = 0.5 + temp * 2; // base 0.5 + noise
    const shifted = {};
    for (const name of bucketNames) {
        shifted[name] = Math.exp((scores[name] - minScore) / allocTemp);
    }
    const total = Object.values(shifted).reduce((a, b) => a + b, 0);
    const allocation = {};
    for (const name of bucketNames) {
        allocation[name] = Math.round((shifted[name] / total) * 100);
    }
    // Ensure total = 100
    const allocTotal = Object.values(allocation).reduce((a, b) => a + b, 0);
    if (allocTotal !== 100) {
        const maxKey = bucketNames.reduce((a, b) => allocation[a] > allocation[b] ? a : b);
        allocation[maxKey] = allocation[maxKey] + (100 - allocTotal);
    }
    return {
        apply: () => applyAllocationAnswer(state, question, allocation),
    };
}
function generateNoisyRanking(archetype, question, state, temp) {
    if (!question.rankingMap)
        return null;
    const items = Object.keys(question.rankingMap);
    if (items.length === 0)
        return null;
    // Score items and build a noisy ranking via repeated softmax draws (without replacement)
    const scored = items.map((item) => ({
        item,
        score: scoreRankingItem(archetype, question.rankingMap[item]),
    }));
    const ranking = [];
    const remaining = [...scored];
    while (remaining.length > 0) {
        const selected = softmaxSelect(remaining, temp);
        ranking.push(selected.item);
        const idx = remaining.indexOf(selected);
        remaining.splice(idx, 1);
    }
    return {
        apply: () => applyRankingAnswer(state, question, ranking),
    };
}
function generateNoisyPairwise(archetype, question, state, temp) {
    if (!question.pairMaps)
        return null;
    const answers = {};
    for (const [pairId, options] of Object.entries(question.pairMaps)) {
        const scored = Object.entries(options).map(([choice, map]) => ({
            choice,
            score: scorePairOption(archetype, map),
        }));
        if (scored.length === 0)
            continue;
        const selected = softmaxSelect(scored, temp);
        answers[pairId] = selected.choice;
    }
    if (Object.keys(answers).length === 0)
        return null;
    return {
        apply: () => applyPairwiseAnswer(state, question, answers),
    };
}
function generateNoisyBestWorst(archetype, question, state, temp) {
    if (!question.bestWorstMap) {
        return generateNoisyRanking(archetype, question, state, temp);
    }
    const items = Object.keys(question.bestWorstMap);
    if (items.length === 0)
        return null;
    const scored = items.map((item) => ({
        item,
        score: scoreRankingItem(archetype, question.bestWorstMap[item]),
    }));
    const ranking = [];
    const remaining = [...scored];
    while (remaining.length > 0) {
        const selected = softmaxSelect(remaining, temp);
        ranking.push(selected.item);
        const idx = remaining.indexOf(selected);
        remaining.splice(idx, 1);
    }
    return {
        apply: () => applyRankingAnswer(state, question, ranking),
    };
}
function generateNoisyMulti(archetype, question, state, temp) {
    if (!question.optionEvidence)
        return null;
    const options = Object.keys(question.optionEvidence);
    if (options.length === 0)
        return null;
    const scored = options.map((opt) => ({
        opt,
        score: scoreOptionEvidence(archetype, question.optionEvidence[opt]),
    }));
    const selected = softmaxSelect(scored, temp);
    return {
        apply: () => applySingleChoiceAnswer(state, question, selected.opt),
    };
}
// ---------------------------------------------------------------------------
// Random answer generation (for random walks)
// ---------------------------------------------------------------------------
function generateRandomAnswer(question, state) {
    switch (question.uiType) {
        case "single_choice":
        case "multi":
            return generateRandomSingleChoice(question, state);
        case "slider":
            return generateRandomSlider(question, state);
        case "allocation":
            return generateRandomAllocation(question, state);
        case "ranking":
        case "best_worst":
            return generateRandomRanking(question, state);
        case "pairwise":
            return generateRandomPairwise(question, state);
        default:
            return null;
    }
}
function generateRandomSingleChoice(question, state) {
    if (!question.optionEvidence)
        return null;
    const options = Object.keys(question.optionEvidence);
    if (options.length === 0)
        return null;
    const pick = options[Math.floor(Math.random() * options.length)];
    return {
        apply: () => applySingleChoiceAnswer(state, question, pick),
    };
}
function generateRandomSlider(question, state) {
    if (!question.sliderMap)
        return null;
    // Random value 0-100
    const value = Math.round(Math.random() * 100);
    return {
        apply: () => applySliderAnswer(state, question, value),
    };
}
function generateRandomAllocation(question, state) {
    if (!question.allocationMap)
        return null;
    const bucketNames = Object.keys(question.allocationMap);
    if (bucketNames.length === 0)
        return null;
    // Random Dirichlet-ish allocation: generate random weights, normalize to 100
    const rawWeights = bucketNames.map(() => Math.random());
    const totalWeight = rawWeights.reduce((a, b) => a + b, 0);
    const allocation = {};
    for (let i = 0; i < bucketNames.length; i++) {
        allocation[bucketNames[i]] = Math.round((rawWeights[i] / totalWeight) * 100);
    }
    // Fix rounding to ensure total = 100
    const allocTotal = Object.values(allocation).reduce((a, b) => a + b, 0);
    if (allocTotal !== 100) {
        const maxKey = bucketNames.reduce((a, b) => allocation[a] > allocation[b] ? a : b);
        allocation[maxKey] = allocation[maxKey] + (100 - allocTotal);
    }
    return {
        apply: () => applyAllocationAnswer(state, question, allocation),
    };
}
function generateRandomRanking(question, state) {
    const map = question.rankingMap ?? question.bestWorstMap;
    if (!map)
        return null;
    const items = Object.keys(map);
    if (items.length === 0)
        return null;
    // Fisher-Yates shuffle
    const ranking = [...items];
    for (let i = ranking.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [ranking[i], ranking[j]] = [ranking[j], ranking[i]];
    }
    return {
        apply: () => applyRankingAnswer(state, question, ranking),
    };
}
function generateRandomPairwise(question, state) {
    if (!question.pairMaps)
        return null;
    const answers = {};
    for (const [pairId, options] of Object.entries(question.pairMaps)) {
        const choices = Object.keys(options);
        if (choices.length === 0)
            continue;
        answers[pairId] = choices[Math.floor(Math.random() * choices.length)];
    }
    if (Object.keys(answers).length === 0)
        return null;
    return {
        apply: () => applyPairwiseAnswer(state, question, answers),
    };
}
/**
 * Run a single quiz simulation for an archetype with noisy answers.
 */
function simulateArchetypeRun(target, archetypes, questions, temp) {
    resetSimilarityCache();
    const state = createInitialState(archetypes);
    let questionsAnswered = 0;
    const answeredIds = new Set();
    for (let i = 0; i < MAX_QUESTIONS; i++) {
        const available = questions.filter((q) => !answeredIds.has(q.id) && q.touchProfile.length > 0);
        const nextQ = selectNextQuestion(state, available, archetypes);
        if (!nextQ)
            break;
        const answer = generateNoisyAnswer(target, nextQ, state, temp);
        if (answer) {
            answer.apply();
            answeredIds.add(nextQ.id);
            questionsAnswered++;
            updatePosteriors(state, archetypes);
            if (questionsAnswered >= 25 && shouldStop(state, archetypes)) {
                break;
            }
        }
        else {
            answeredIds.add(nextQ.id);
        }
    }
    updatePosteriors(state, archetypes);
    const sorted = Object.entries(state.archetypePosterior)
        .sort((a, b) => b[1] - a[1]);
    const topId = sorted[0]?.[0] ?? "";
    const topPosterior = sorted[0]?.[1] ?? 0;
    const secondPosterior = sorted[1]?.[1] ?? 0;
    const topArchetype = archetypes.find((a) => a.id === topId);
    const rank = sorted.findIndex(([id]) => id === target.id) + 1;
    const top5 = sorted.slice(0, 5).map(([id]) => {
        const a = archetypes.find((a) => a.id === id);
        return `${id}:${a?.name ?? "?"}`;
    });
    return {
        runIndex: 0,
        resultId: topId,
        resultName: topArchetype?.name ?? "?",
        correct: topId === target.id,
        rank,
        questionsAnswered,
        topPosterior,
        margin: topPosterior - secondPosterior,
        top5,
    };
}
/**
 * Run a single random walk through the quiz pipeline.
 */
function simulateRandomWalk(archetypes, questions, walkIndex) {
    resetSimilarityCache();
    const state = createInitialState(archetypes);
    let questionsAnswered = 0;
    const answeredIds = new Set();
    for (let i = 0; i < MAX_QUESTIONS; i++) {
        const available = questions.filter((q) => !answeredIds.has(q.id) && q.touchProfile.length > 0);
        const nextQ = selectNextQuestion(state, available, archetypes);
        if (!nextQ)
            break;
        const answer = generateRandomAnswer(nextQ, state);
        if (answer) {
            answer.apply();
            answeredIds.add(nextQ.id);
            questionsAnswered++;
            updatePosteriors(state, archetypes);
            if (questionsAnswered >= 25 && shouldStop(state, archetypes)) {
                break;
            }
        }
        else {
            answeredIds.add(nextQ.id);
        }
    }
    updatePosteriors(state, archetypes);
    const sorted = Object.entries(state.archetypePosterior)
        .sort((a, b) => b[1] - a[1]);
    const topId = sorted[0]?.[0] ?? "";
    const topPosterior = sorted[0]?.[1] ?? 0;
    const secondPosterior = sorted[1]?.[1] ?? 0;
    const topArchetype = archetypes.find((a) => a.id === topId);
    // Compute Shannon entropy of final posterior
    let entropy = 0;
    for (const [, p] of sorted) {
        if (p > 0)
            entropy -= p * Math.log2(p);
    }
    return {
        walkIndex,
        resultId: topId,
        resultName: topArchetype?.name ?? "?",
        questionsAnswered,
        topPosterior,
        margin: topPosterior - secondPosterior,
        finalEntropy: entropy,
    };
}
// ---------------------------------------------------------------------------
// Shannon entropy helper
// ---------------------------------------------------------------------------
function shannonEntropy(probs) {
    let h = 0;
    for (const p of probs) {
        if (p > 0)
            h -= p * Math.log2(p);
    }
    return h;
}
// ---------------------------------------------------------------------------
// Progress display
// ---------------------------------------------------------------------------
function progressBar(current, total, width = 30) {
    const ratio = Math.min(current / total, 1);
    const filled = Math.round(ratio * width);
    const empty = width - filled;
    const bar = "#".repeat(filled) + "-".repeat(empty);
    const pct = (ratio * 100).toFixed(1);
    return `[${bar}] ${pct}% (${current}/${total})`;
}
// ---------------------------------------------------------------------------
// Main: Archetype simulations
// ---------------------------------------------------------------------------
function runArchetypeSimulations(archetypes, questions) {
    const totalRuns = archetypes.length * RUNS_PER_ARCHETYPE;
    console.log(`\n=== ARCHETYPE SIMULATIONS ===`);
    console.log(`Archetypes: ${archetypes.length}`);
    console.log(`Runs per archetype: ${RUNS_PER_ARCHETYPE}`);
    console.log(`Total runs: ${totalRuns}`);
    console.log(`Temperature: ${TEMPERATURE}`);
    console.log();
    const results = [];
    let globalRunCount = 0;
    for (let ai = 0; ai < archetypes.length; ai++) {
        const target = archetypes[ai];
        const runs = [];
        let top1 = 0;
        let top3 = 0;
        let top5 = 0;
        let totalQ = 0;
        let totalMargin = 0;
        let totalPosterior = 0;
        let totalRank = 0;
        const confusionTargets = {};
        for (let r = 0; r < RUNS_PER_ARCHETYPE; r++) {
            const result = simulateArchetypeRun(target, archetypes, questions, TEMPERATURE);
            result.runIndex = r;
            runs.push(result);
            if (result.correct)
                top1++;
            if (result.rank <= 3)
                top3++;
            if (result.rank <= 5)
                top5++;
            totalQ += result.questionsAnswered;
            totalMargin += result.margin;
            totalPosterior += result.topPosterior;
            totalRank += result.rank;
            if (!result.correct) {
                confusionTargets[result.resultId] = (confusionTargets[result.resultId] ?? 0) + 1;
            }
            globalRunCount++;
        }
        const simResult = {
            archetypeId: target.id,
            archetypeName: target.name,
            tier: target.tier,
            runs: RUNS_PER_ARCHETYPE,
            top1Correct: top1,
            top3Correct: top3,
            top5Correct: top5,
            top1Accuracy: top1 / RUNS_PER_ARCHETYPE,
            top3Accuracy: top3 / RUNS_PER_ARCHETYPE,
            top5Accuracy: top5 / RUNS_PER_ARCHETYPE,
            avgQuestions: totalQ / RUNS_PER_ARCHETYPE,
            avgMargin: totalMargin / RUNS_PER_ARCHETYPE,
            avgTopPosterior: totalPosterior / RUNS_PER_ARCHETYPE,
            avgRank: totalRank / RUNS_PER_ARCHETYPE,
            confusionTargets,
            runDetails: runs,
        };
        results.push(simResult);
        // Console progress
        const accStr = `top1=${(simResult.top1Accuracy * 100).toFixed(0)}%`;
        const top3Str = `top3=${(simResult.top3Accuracy * 100).toFixed(0)}%`;
        const qStr = `avgQ=${simResult.avgQuestions.toFixed(1)}`;
        process.stdout.write(`\r${progressBar(globalRunCount, totalRuns)}  ` +
            `${target.id} ${target.name.substring(0, 28).padEnd(28)} ${accStr} ${top3Str} ${qStr}   `);
    }
    process.stdout.write("\r" + " ".repeat(120) + "\r");
    console.log(`Archetype simulations complete: ${globalRunCount} runs\n`);
    // Print summary table
    const overallTop1 = results.reduce((s, r) => s + r.top1Correct, 0);
    const overallTop3 = results.reduce((s, r) => s + r.top3Correct, 0);
    const overallTop5 = results.reduce((s, r) => s + r.top5Correct, 0);
    const overallRuns = results.reduce((s, r) => s + r.runs, 0);
    const overallAvgQ = results.reduce((s, r) => s + r.avgQuestions * r.runs, 0) / overallRuns;
    const overallAvgMargin = results.reduce((s, r) => s + r.avgMargin * r.runs, 0) / overallRuns;
    const overallAvgPosterior = results.reduce((s, r) => s + r.avgTopPosterior * r.runs, 0) / overallRuns;
    console.log("=== ARCHETYPE SIMULATION SUMMARY ===");
    console.log(`Top-1 accuracy: ${overallTop1}/${overallRuns} = ${(overallTop1 / overallRuns * 100).toFixed(2)}%`);
    console.log(`Top-3 accuracy: ${overallTop3}/${overallRuns} = ${(overallTop3 / overallRuns * 100).toFixed(2)}%`);
    console.log(`Top-5 accuracy: ${overallTop5}/${overallRuns} = ${(overallTop5 / overallRuns * 100).toFixed(2)}%`);
    console.log(`Avg questions:  ${overallAvgQ.toFixed(2)}`);
    console.log(`Avg margin:     ${overallAvgMargin.toFixed(4)}`);
    console.log(`Avg posterior:  ${overallAvgPosterior.toFixed(4)}`);
    console.log();
    // Tier breakdown
    console.log("=== ACCURACY BY TIER ===");
    const tiers = ["T1", "T2", "MEANS", "GATE", "REALITY"];
    for (const tier of tiers) {
        const tierResults = results.filter((r) => r.tier === tier);
        if (tierResults.length === 0)
            continue;
        const tierTop1 = tierResults.reduce((s, r) => s + r.top1Correct, 0);
        const tierRuns = tierResults.reduce((s, r) => s + r.runs, 0);
        const tierTop3 = tierResults.reduce((s, r) => s + r.top3Correct, 0);
        console.log(`  ${tier.padEnd(8)} top1=${(tierTop1 / tierRuns * 100).toFixed(1)}%  ` +
            `top3=${(tierTop3 / tierRuns * 100).toFixed(1)}%  ` +
            `(${tierResults.length} archetypes, ${tierRuns} runs)`);
    }
    console.log();
    // Worst performers (lowest top-1 accuracy)
    console.log("=== WORST PERFORMERS (lowest top-1 accuracy) ===");
    const worstByAcc = [...results]
        .sort((a, b) => a.top1Accuracy - b.top1Accuracy)
        .slice(0, 15);
    for (const r of worstByAcc) {
        const confTop = Object.entries(r.confusionTargets)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([id, cnt]) => {
            const a = archetypes.find((a) => a.id === id);
            return `${id}:${a?.name?.substring(0, 20) ?? "?"}(${cnt})`;
        })
            .join(", ");
        console.log(`  ${r.archetypeId} ${r.archetypeName.padEnd(35)} ` +
            `top1=${(r.top1Accuracy * 100).toFixed(0)}% ` +
            `top3=${(r.top3Accuracy * 100).toFixed(0)}% ` +
            `avgRank=${r.avgRank.toFixed(1)} ` +
            `confused→ ${confTop}`);
    }
    console.log();
    // Top attractors across all runs
    console.log("=== TOP ATTRACTORS (most misclassifications toward) ===");
    const globalAttractors = {};
    for (const r of results) {
        for (const [id, cnt] of Object.entries(r.confusionTargets)) {
            globalAttractors[id] = (globalAttractors[id] ?? 0) + cnt;
        }
    }
    const sortedAttractors = Object.entries(globalAttractors)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 15);
    for (const [id, cnt] of sortedAttractors) {
        const a = archetypes.find((a) => a.id === id);
        console.log(`  ${id} ${(a?.name ?? "?").padEnd(35)} attracted ${cnt} misclassifications`);
    }
    console.log();
    // Questions distribution
    const allQ = results.flatMap((r) => r.runDetails.map((d) => d.questionsAnswered));
    allQ.sort((a, b) => a - b);
    console.log("=== QUESTIONS DISTRIBUTION ===");
    console.log(`  Min: ${allQ[0]}, P25: ${allQ[Math.floor(allQ.length * 0.25)]}, ` +
        `Median: ${allQ[Math.floor(allQ.length * 0.5)]}, P75: ${allQ[Math.floor(allQ.length * 0.75)]}, ` +
        `Max: ${allQ[allQ.length - 1]}`);
    console.log();
    return results;
}
// ---------------------------------------------------------------------------
// Main: Random walks
// ---------------------------------------------------------------------------
function runRandomWalks(archetypes, questions) {
    console.log(`\n=== RANDOM WALK SIMULATIONS ===`);
    console.log(`Total walks: ${RANDOM_WALK_COUNT}`);
    console.log();
    const results = [];
    for (let i = 0; i < RANDOM_WALK_COUNT; i++) {
        const result = simulateRandomWalk(archetypes, questions, i);
        results.push(result);
        if ((i + 1) % 100 === 0 || i === RANDOM_WALK_COUNT - 1) {
            process.stdout.write(`\r${progressBar(i + 1, RANDOM_WALK_COUNT)}   `);
        }
    }
    process.stdout.write("\r" + " ".repeat(80) + "\r");
    console.log(`Random walks complete: ${results.length} walks\n`);
    // Summary stats
    const avgQ = results.reduce((s, r) => s + r.questionsAnswered, 0) / results.length;
    const avgPosterior = results.reduce((s, r) => s + r.topPosterior, 0) / results.length;
    const avgMargin = results.reduce((s, r) => s + r.margin, 0) / results.length;
    const avgEntropy = results.reduce((s, r) => s + r.finalEntropy, 0) / results.length;
    const maxEntropy = Math.log2(archetypes.length);
    const qCounts = results.map((r) => r.questionsAnswered).sort((a, b) => a - b);
    console.log("=== RANDOM WALK SUMMARY ===");
    console.log(`Avg questions:  ${avgQ.toFixed(2)}`);
    console.log(`  Min: ${qCounts[0]}, Median: ${qCounts[Math.floor(qCounts.length / 2)]}, ` +
        `Max: ${qCounts[qCounts.length - 1]}`);
    console.log(`Avg top posterior: ${avgPosterior.toFixed(4)}`);
    console.log(`Avg margin:        ${avgMargin.toFixed(4)}`);
    console.log(`Avg entropy:       ${avgEntropy.toFixed(4)} (max possible: ${maxEntropy.toFixed(2)})`);
    console.log(`Entropy ratio:     ${(avgEntropy / maxEntropy * 100).toFixed(1)}% of max`);
    console.log();
    // Distribution of assigned archetypes
    const assignCounts = {};
    for (const r of results) {
        assignCounts[r.resultId] = (assignCounts[r.resultId] ?? 0) + 1;
    }
    const uniqueAssigned = Object.keys(assignCounts).length;
    const sortedAssign = Object.entries(assignCounts)
        .sort((a, b) => b[1] - a[1]);
    console.log(`Unique archetypes assigned: ${uniqueAssigned}/${archetypes.length}`);
    console.log();
    // Top 20 most-assigned archetypes
    console.log("=== TOP 20 MOST-ASSIGNED (random walkers) ===");
    for (const [id, cnt] of sortedAssign.slice(0, 20)) {
        const a = archetypes.find((a) => a.id === id);
        const pct = (cnt / results.length * 100).toFixed(2);
        const expectedPct = (100 / archetypes.length).toFixed(2);
        const ratio = (cnt / results.length * archetypes.length).toFixed(2);
        console.log(`  ${id} ${(a?.name ?? "?").padEnd(35)} ${cnt} (${pct}%) [${ratio}x expected ${expectedPct}%]`);
    }
    console.log();
    // Bottom 10 (least-assigned / never-assigned)
    const neverAssigned = archetypes.filter((a) => !assignCounts[a.id]);
    if (neverAssigned.length > 0) {
        console.log(`=== NEVER ASSIGNED (${neverAssigned.length} archetypes) ===`);
        for (const a of neverAssigned.slice(0, 20)) {
            console.log(`  ${a.id} ${a.name}`);
        }
        if (neverAssigned.length > 20) {
            console.log(`  ... and ${neverAssigned.length - 20} more`);
        }
        console.log();
    }
    // Concentration check: does any archetype dominate?
    const topAssignPct = (sortedAssign[0]?.[1] ?? 0) / results.length * 100;
    const topAssignId = sortedAssign[0]?.[0] ?? "";
    const topAssignName = archetypes.find((a) => a.id === topAssignId)?.name ?? "?";
    if (topAssignPct > 5) {
        console.log(`WARNING: ${topAssignId} "${topAssignName}" dominates random walkers at ${topAssignPct.toFixed(1)}%`);
        console.log();
    }
    // Entropy distribution
    const entropies = results.map((r) => r.finalEntropy).sort((a, b) => a - b);
    console.log("=== ENTROPY DISTRIBUTION ===");
    console.log(`  Min: ${entropies[0]?.toFixed(3)}, P25: ${entropies[Math.floor(entropies.length * 0.25)]?.toFixed(3)}, ` +
        `Median: ${entropies[Math.floor(entropies.length / 2)]?.toFixed(3)}, ` +
        `P75: ${entropies[Math.floor(entropies.length * 0.75)]?.toFixed(3)}, ` +
        `Max: ${entropies[entropies.length - 1]?.toFixed(3)}`);
    console.log();
    return results;
}
// ---------------------------------------------------------------------------
// JSON output
// ---------------------------------------------------------------------------
function writeResults(archetypeResults, randomResults, archetypes) {
    const outDir = path.resolve("diagnostics");
    if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir, { recursive: true });
    }
    if (archetypeResults) {
        // Write per-archetype breakdown (strip runDetails for the summary, keep for detail file)
        const archetypeSummary = archetypeResults.map((r) => ({
            archetypeId: r.archetypeId,
            archetypeName: r.archetypeName,
            tier: r.tier,
            runs: r.runs,
            top1Accuracy: r.top1Accuracy,
            top3Accuracy: r.top3Accuracy,
            top5Accuracy: r.top5Accuracy,
            avgQuestions: r.avgQuestions,
            avgMargin: r.avgMargin,
            avgTopPosterior: r.avgTopPosterior,
            avgRank: r.avgRank,
            confusionTargets: r.confusionTargets,
        }));
        fs.writeFileSync(path.join(outDir, "archetype-sims.json"), JSON.stringify({
            config: {
                runsPerArchetype: RUNS_PER_ARCHETYPE,
                temperature: TEMPERATURE,
                maxQuestions: MAX_QUESTIONS,
                archetypeCount: archetypes.length,
            },
            archetypes: archetypeSummary,
        }, null, 2));
        console.log(`Wrote ${path.join(outDir, "archetype-sims.json")}`);
    }
    if (randomResults) {
        // Aggregate stats for random walks
        const avgQ = randomResults.reduce((s, r) => s + r.questionsAnswered, 0) / randomResults.length;
        const avgPosterior = randomResults.reduce((s, r) => s + r.topPosterior, 0) / randomResults.length;
        const avgMargin = randomResults.reduce((s, r) => s + r.margin, 0) / randomResults.length;
        const avgEntropy = randomResults.reduce((s, r) => s + r.finalEntropy, 0) / randomResults.length;
        const assignCounts = {};
        for (const r of randomResults) {
            assignCounts[r.resultId] = (assignCounts[r.resultId] ?? 0) + 1;
        }
        fs.writeFileSync(path.join(outDir, "random-walks.json"), JSON.stringify({
            config: {
                totalWalks: RANDOM_WALK_COUNT,
                maxQuestions: MAX_QUESTIONS,
                archetypeCount: archetypes.length,
            },
            aggregate: {
                avgQuestions: avgQ,
                avgTopPosterior: avgPosterior,
                avgMargin: avgMargin,
                avgEntropy: avgEntropy,
                maxPossibleEntropy: Math.log2(archetypes.length),
                uniqueAssigned: Object.keys(assignCounts).length,
                archetypeDistribution: Object.entries(assignCounts)
                    .sort((a, b) => b[1] - a[1])
                    .map(([id, count]) => ({
                    id,
                    name: archetypes.find((a) => a.id === id)?.name ?? "?",
                    count,
                    pct: count / randomResults.length,
                })),
            },
            walks: randomResults.map((r) => ({
                resultId: r.resultId,
                questionsAnswered: r.questionsAnswered,
                topPosterior: r.topPosterior,
                margin: r.margin,
                finalEntropy: r.finalEntropy,
            })),
        }, null, 2));
        console.log(`Wrote ${path.join(outDir, "random-walks.json")}`);
    }
    // Summary file
    const summary = {
        timestamp: new Date().toISOString(),
        config: {
            temperature: TEMPERATURE,
            runsPerArchetype: ARCHETYPE_ONLY || !RANDOM_ONLY ? RUNS_PER_ARCHETYPE : null,
            randomWalkCount: RANDOM_ONLY || !ARCHETYPE_ONLY ? RANDOM_WALK_COUNT : null,
            maxQuestions: MAX_QUESTIONS,
            archetypeCount: archetypes.length,
        },
    };
    if (archetypeResults) {
        const overallRuns = archetypeResults.reduce((s, r) => s + r.runs, 0);
        const overallTop1 = archetypeResults.reduce((s, r) => s + r.top1Correct, 0);
        const overallTop3 = archetypeResults.reduce((s, r) => s + r.top3Correct, 0);
        const overallTop5 = archetypeResults.reduce((s, r) => s + r.top5Correct, 0);
        summary.archetypeSimulation = {
            totalRuns: overallRuns,
            top1Accuracy: overallTop1 / overallRuns,
            top3Accuracy: overallTop3 / overallRuns,
            top5Accuracy: overallTop5 / overallRuns,
            avgQuestions: archetypeResults.reduce((s, r) => s + r.avgQuestions * r.runs, 0) / overallRuns,
            avgMargin: archetypeResults.reduce((s, r) => s + r.avgMargin * r.runs, 0) / overallRuns,
            avgTopPosterior: archetypeResults.reduce((s, r) => s + r.avgTopPosterior * r.runs, 0) / overallRuns,
            tierBreakdown: ["T1", "T2", "MEANS", "GATE", "REALITY"].map((tier) => {
                const tierResults = archetypeResults.filter((r) => r.tier === tier);
                const tierRuns = tierResults.reduce((s, r) => s + r.runs, 0);
                const tierTop1 = tierResults.reduce((s, r) => s + r.top1Correct, 0);
                return {
                    tier,
                    archetypeCount: tierResults.length,
                    runs: tierRuns,
                    top1Accuracy: tierRuns > 0 ? tierTop1 / tierRuns : 0,
                };
            }).filter((t) => t.runs > 0),
        };
    }
    if (randomResults) {
        const assignCounts = {};
        for (const r of randomResults) {
            assignCounts[r.resultId] = (assignCounts[r.resultId] ?? 0) + 1;
        }
        const sortedAssign = Object.entries(assignCounts).sort((a, b) => b[1] - a[1]);
        summary.randomWalks = {
            totalWalks: randomResults.length,
            avgQuestions: randomResults.reduce((s, r) => s + r.questionsAnswered, 0) / randomResults.length,
            avgTopPosterior: randomResults.reduce((s, r) => s + r.topPosterior, 0) / randomResults.length,
            avgMargin: randomResults.reduce((s, r) => s + r.margin, 0) / randomResults.length,
            avgEntropy: randomResults.reduce((s, r) => s + r.finalEntropy, 0) / randomResults.length,
            uniqueAssigned: Object.keys(assignCounts).length,
            topAttractor: {
                id: sortedAssign[0]?.[0] ?? "",
                name: archetypes.find((a) => a.id === sortedAssign[0]?.[0])?.name ?? "?",
                count: sortedAssign[0]?.[1] ?? 0,
                pct: (sortedAssign[0]?.[1] ?? 0) / randomResults.length,
            },
        };
    }
    fs.writeFileSync(path.join(outDir, "summary.json"), JSON.stringify(summary, null, 2));
    console.log(`Wrote ${path.join(outDir, "summary.json")}`);
}
// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
function main() {
    resetConfig();
    const archetypes = ARCHETYPES;
    const questions = REPRESENTATIVE_QUESTIONS;
    console.log("=== PRISM Quiz Engine — Full Diagnostic ===");
    console.log(`Archetypes: ${archetypes.length}`);
    console.log(`Questions available: ${questions.length}`);
    console.log(`Questions with evidence: ${questions.filter((q) => q.touchProfile.length > 0).length}`);
    console.log(`Mode: ${ARCHETYPE_ONLY ? "archetype-only" : RANDOM_ONLY ? "random-only" : "full"}`);
    let archetypeResults = null;
    let randomResults = null;
    if (!RANDOM_ONLY) {
        archetypeResults = runArchetypeSimulations(archetypes, questions);
    }
    if (!ARCHETYPE_ONLY) {
        randomResults = runRandomWalks(archetypes, questions);
    }
    // Write JSON output
    writeResults(archetypeResults, randomResults, archetypes);
    console.log("\nDiagnostic complete.");
}
main();
//# sourceMappingURL=full-diagnostic.js.map