/**
 * PRISM Quiz Engine — 40K Massive Diagnostic
 *
 * Simulates 40,000 quiz completions with diverse answer profiles:
 *   - Targeted archetype simulations (with noise variants)
 *   - Random uniform answers
 *   - Correlated profiles (liberal, conservative, mixed)
 *   - Adversarial profiles (try to break the engine)
 *
 * Outputs:
 *   - Full HTML diagnostic report
 *   - Text summary
 *
 * Usage: npx tsx src/test/diagnostic-40k.ts
 */
import { ARCHETYPES } from "../config/archetypes.js";
import { REPRESENTATIVE_QUESTIONS } from "../config/questions.representative.js";
import { CONTINUOUS_NODES, CATEGORICAL_NODES } from "../config/nodes.js";
import { applySingleChoiceAnswer, applySliderAnswer, applyAllocationAnswer, applyRankingAnswer, applyPairwiseAnswer, } from "../engine/update.js";
import { selectNextQuestion } from "../engine/nextQuestion.js";
import { shouldStop } from "../engine/stopRule.js";
import { archetypeDistance } from "../engine/archetypeDistance.js";
import { resetConfig } from "../optimize/runtimeConfig.js";
import { resetSimilarityCache } from "../engine/stopRule.js";
import * as fs from "fs";
import * as path from "path";
// ===================================================================
// RNG with seed for reproducibility
// ===================================================================
class SeededRNG {
    state;
    constructor(seed) { this.state = seed; }
    next() {
        this.state = (this.state * 1664525 + 1013904223) & 0xFFFFFFFF;
        return (this.state >>> 0) / 0xFFFFFFFF;
    }
    choice(arr) { return arr[Math.floor(this.next() * arr.length)]; }
    shuffle(arr) {
        const a = [...arr];
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(this.next() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }
    gaussian(mean, std) {
        const u1 = this.next();
        const u2 = this.next();
        return mean + std * Math.sqrt(-2 * Math.log(u1 + 1e-10)) * Math.cos(2 * Math.PI * u2);
    }
}
// ===================================================================
// State initialization
// ===================================================================
function createInitialState(archetypes) {
    const continuous = {};
    for (const nodeId of CONTINUOUS_NODES) {
        continuous[nodeId] = {
            posDist: [0.2, 0.2, 0.2, 0.2, 0.2],
            salDist: [0.25, 0.25, 0.25, 0.25],
            touches: 0, touchTypes: new Set(), status: "unknown",
        };
    }
    const categorical = {};
    for (const nodeId of CATEGORICAL_NODES) {
        categorical[nodeId] = {
            catDist: [1 / 6, 1 / 6, 1 / 6, 1 / 6, 1 / 6, 1 / 6],
            salDist: [0.25, 0.25, 0.25, 0.25],
            touches: 0, touchTypes: new Set(), status: "unknown",
        };
    }
    const archetypePosterior = {};
    for (const a of archetypes)
        archetypePosterior[a.id] = a.prior;
    return {
        answers: {}, continuous, categorical,
        trbAnchor: { dist: [1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9], touches: 0 },
        archetypePosterior, currentLeader: undefined, consecutiveLeadCount: 0,
    };
}
// ===================================================================
// Answer generation helpers (from existing simulation.ts logic)
// ===================================================================
function scoreOptionEvidence(archetype, evidence) {
    if (!evidence)
        return 1;
    let score = 0, count = 0;
    if (evidence.continuous) {
        for (const [nodeId, upd] of Object.entries(evidence.continuous)) {
            const t = archetype.nodes[nodeId];
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
    }
    if (evidence.categorical) {
        for (const [nodeId, upd] of Object.entries(evidence.categorical)) {
            const t = archetype.nodes[nodeId];
            if (!t || t.kind !== "categorical")
                continue;
            if (upd?.cat) {
                let d = 0;
                for (let i = 0; i < 6; i++)
                    d += (t.probs[i] ?? 0) * (upd.cat[i] ?? 0);
                score += d;
                count++;
            }
            if (upd?.sal) {
                score += (upd.sal[t.sal] ?? 0) * 0.5;
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
            const t = archetype.nodes[nodeId];
            if (!t || t.kind !== "continuous")
                continue;
            score += ((t.pos - 3) / 2) * (signal ?? 0);
            count++;
        }
    }
    if (bucket.categorical) {
        for (const [nodeId, catDist] of Object.entries(bucket.categorical)) {
            const t = archetype.nodes[nodeId];
            if (!t || t.kind !== "categorical")
                continue;
            let d = 0;
            for (let i = 0; i < 6; i++)
                d += (t.probs[i] ?? 0) * (catDist[i] ?? 0);
            score += d;
            count++;
        }
    }
    return count > 0 ? score / count : 0;
}
function scoreRankingItem(archetype, item) {
    let score = 0, count = 0;
    if (item.continuous) {
        for (const [nodeId, signal] of Object.entries(item.continuous)) {
            const t = archetype.nodes[nodeId];
            if (!t || t.kind !== "continuous")
                continue;
            score += ((t.pos - 3) / 2) * (signal ?? 0);
            count++;
        }
    }
    if (item.categorical) {
        for (const [nodeId, catDist] of Object.entries(item.categorical)) {
            const t = archetype.nodes[nodeId];
            if (!t || t.kind !== "categorical")
                continue;
            let d = 0;
            for (let i = 0; i < 6; i++)
                d += (t.probs[i] ?? 0) * (catDist[i] ?? 0);
            score += d;
            count++;
        }
    }
    return count > 0 ? score / count : 0;
}
function scorePairOption(archetype, map) {
    let score = 0, count = 0;
    if (map.continuous) {
        for (const [nodeId, signal] of Object.entries(map.continuous)) {
            const t = archetype.nodes[nodeId];
            if (!t || t.kind !== "continuous")
                continue;
            score += ((t.pos - 3) / 2) * (signal ?? 0);
            count++;
        }
    }
    if (map.categorical) {
        for (const [nodeId, catDist] of Object.entries(map.categorical)) {
            const t = archetype.nodes[nodeId];
            if (!t || t.kind !== "categorical")
                continue;
            let d = 0;
            for (let i = 0; i < 6; i++)
                d += (t.probs[i] ?? 0) * (catDist[i] ?? 0);
            score += d;
            count++;
        }
    }
    return count > 0 ? score / count : 0;
}
// ===================================================================
// Answer generators
// ===================================================================
// Archetype-targeted answer generation (with optional noise)
function generateArchetypeAnswer(archetype, q, state, rng, noise = 0) {
    switch (q.uiType) {
        case "single_choice": return genSingleChoice(archetype, q, state, rng, noise);
        case "slider": return genSlider(archetype, q, state, rng, noise);
        case "allocation": return genAllocation(archetype, q, state, rng, noise);
        case "ranking": return genRanking(archetype, q, state, rng, noise);
        case "pairwise": return genPairwise(archetype, q, state, rng, noise);
        case "best_worst": return genBestWorst(archetype, q, state, rng, noise);
        case "multi": return genMulti(archetype, q, state, rng, noise);
        default: return null;
    }
}
function genSingleChoice(arch, q, state, rng, noise) {
    if (!q.optionEvidence)
        return null;
    const options = Object.keys(q.optionEvidence);
    if (!options.length)
        return null;
    // With noise probability, pick random option
    if (rng.next() < noise) {
        const opt = rng.choice(options);
        return () => applySingleChoiceAnswer(state, q, opt);
    }
    let best = options[0], bestScore = -Infinity;
    for (const opt of options) {
        const s = scoreOptionEvidence(arch, q.optionEvidence[opt]);
        if (s > bestScore) {
            bestScore = s;
            best = opt;
        }
    }
    return () => applySingleChoiceAnswer(state, q, best);
}
function genSlider(arch, q, state, rng, noise) {
    if (!q.sliderMap)
        return null;
    const buckets = Object.keys(q.sliderMap);
    if (!buckets.length)
        return null;
    if (rng.next() < noise) {
        const val = Math.round(rng.next() * 100);
        return () => applySliderAnswer(state, q, val);
    }
    let best = buckets[0], bestScore = -Infinity;
    for (const b of buckets) {
        const s = scoreOptionEvidence(arch, q.sliderMap[b]);
        if (s > bestScore) {
            bestScore = s;
            best = b;
        }
    }
    const parts = best.split("-").map(Number);
    const mid = Math.round(((parts[0] ?? 0) + (parts[1] ?? 100)) / 2);
    const jitter = Math.round(rng.gaussian(0, noise * 10));
    const val = Math.max(0, Math.min(100, mid + jitter));
    return () => applySliderAnswer(state, q, val);
}
function genAllocation(arch, q, state, rng, noise) {
    if (!q.allocationMap)
        return null;
    const bucketNames = Object.keys(q.allocationMap);
    if (!bucketNames.length)
        return null;
    const scores = {};
    for (const name of bucketNames) {
        scores[name] = scoreAllocationBucket(arch, q.allocationMap[name]) + rng.gaussian(0, noise);
    }
    const minS = Math.min(...Object.values(scores));
    const shifted = {};
    for (const name of bucketNames)
        shifted[name] = Math.exp((scores[name] - minS) * 2);
    const total = Object.values(shifted).reduce((a, b) => a + b, 0);
    const allocation = {};
    for (const name of bucketNames)
        allocation[name] = Math.round((shifted[name] / total) * 100);
    const allocTotal = Object.values(allocation).reduce((a, b) => a + b, 0);
    if (allocTotal !== 100) {
        const maxKey = bucketNames.reduce((a, b) => allocation[a] > allocation[b] ? a : b);
        allocation[maxKey] = allocation[maxKey] + (100 - allocTotal);
    }
    return () => applyAllocationAnswer(state, q, allocation);
}
function genRanking(arch, q, state, rng, noise) {
    if (!q.rankingMap)
        return null;
    const items = Object.keys(q.rankingMap);
    if (!items.length)
        return null;
    if (rng.next() < noise * 0.5) {
        const ranking = rng.shuffle(items);
        return () => applyRankingAnswer(state, q, ranking);
    }
    const scored = items.map(item => ({
        item, score: scoreRankingItem(arch, q.rankingMap[item]) + rng.gaussian(0, noise * 0.3)
    }));
    scored.sort((a, b) => b.score - a.score);
    const ranking = scored.map(s => s.item);
    return () => applyRankingAnswer(state, q, ranking);
}
function genPairwise(arch, q, state, rng, noise) {
    if (!q.pairMaps)
        return null;
    const answers = {};
    for (const [pairId, options] of Object.entries(q.pairMaps)) {
        let best = "", bestScore = -Infinity;
        for (const [choice, map] of Object.entries(options)) {
            const s = scorePairOption(arch, map) + rng.gaussian(0, noise * 0.3);
            if (s > bestScore) {
                bestScore = s;
                best = choice;
            }
        }
        if (best)
            answers[pairId] = best;
    }
    if (!Object.keys(answers).length)
        return null;
    return () => applyPairwiseAnswer(state, q, answers);
}
function genBestWorst(arch, q, state, rng, noise) {
    // best_worst stored as rankingMap
    return genRanking(arch, q, state, rng, noise);
}
function genMulti(arch, q, state, rng, noise) {
    if (!q.optionEvidence)
        return null;
    const options = Object.keys(q.optionEvidence);
    if (!options.length)
        return null;
    const scored = options.map(opt => ({ opt, score: scoreOptionEvidence(arch, q.optionEvidence[opt]) + rng.gaussian(0, noise) }));
    scored.sort((a, b) => b.score - a.score);
    const pick = scored[0].opt;
    return () => applySingleChoiceAnswer(state, q, pick);
}
// Random answer generation
function generateRandomAnswer(q, state, rng) {
    switch (q.uiType) {
        case "single_choice": {
            if (!q.optionEvidence)
                return null;
            const opts = Object.keys(q.optionEvidence);
            if (!opts.length)
                return null;
            const opt = rng.choice(opts);
            return () => applySingleChoiceAnswer(state, q, opt);
        }
        case "slider": {
            const val = Math.round(rng.next() * 100);
            return () => applySliderAnswer(state, q, val);
        }
        case "allocation": {
            if (!q.allocationMap)
                return null;
            const names = Object.keys(q.allocationMap);
            const alloc = {};
            let total = 0;
            for (const n of names) {
                alloc[n] = Math.round(rng.next() * 50) + 1;
                total += alloc[n];
            }
            for (const n of names)
                alloc[n] = Math.round((alloc[n] / total) * 100);
            const aTotal = Object.values(alloc).reduce((a, b) => a + b, 0);
            if (aTotal !== 100) {
                const k = names[0];
                alloc[k] = alloc[k] + (100 - aTotal);
            }
            return () => applyAllocationAnswer(state, q, alloc);
        }
        case "ranking": {
            if (!q.rankingMap)
                return null;
            const items = rng.shuffle(Object.keys(q.rankingMap));
            return () => applyRankingAnswer(state, q, items);
        }
        case "pairwise": {
            if (!q.pairMaps)
                return null;
            const answers = {};
            for (const [pairId, options] of Object.entries(q.pairMaps)) {
                const choices = Object.keys(options);
                if (choices.length)
                    answers[pairId] = rng.choice(choices);
            }
            return () => applyPairwiseAnswer(state, q, answers);
        }
        case "best_worst": {
            if (!q.rankingMap)
                return null;
            const items = rng.shuffle(Object.keys(q.rankingMap));
            return () => applyRankingAnswer(state, q, items);
        }
        case "multi": {
            if (!q.optionEvidence)
                return null;
            const opts = Object.keys(q.optionEvidence);
            if (!opts.length)
                return null;
            const opt = rng.choice(opts);
            return () => applySingleChoiceAnswer(state, q, opt);
        }
        default: return null;
    }
}
// Biased answer generation (liberal = low pos, conservative = high pos)
function generateBiasedAnswer(q, state, rng, bias, strength = 0.8) {
    // Create a synthetic archetype based on bias
    const targetPos = bias === "liberal" ? 1 : bias === "conservative" ? 5 : 3;
    const syntheticArch = {
        id: "synthetic", name: "Synthetic", tier: "T1", prior: 1 / 115,
        nodes: {}
    };
    for (const nodeId of CONTINUOUS_NODES) {
        syntheticArch.nodes[nodeId] = { kind: "continuous", pos: targetPos, sal: 2 };
    }
    // EPS/AES: liberal=empiricist/visionary, conservative=traditionalist/pastoral, centrist=institutionalist/statesman
    if (bias === "liberal") {
        syntheticArch.nodes.EPS = { kind: "categorical", probs: [0.5, 0.2, 0.05, 0.1, 0.1, 0.05], sal: 2 };
        syntheticArch.nodes.AES = { kind: "categorical", probs: [0.1, 0.2, 0.1, 0.1, 0.1, 0.4], sal: 2 };
    }
    else if (bias === "conservative") {
        syntheticArch.nodes.EPS = { kind: "categorical", probs: [0.05, 0.15, 0.5, 0.1, 0.15, 0.05], sal: 2 };
        syntheticArch.nodes.AES = { kind: "categorical", probs: [0.15, 0.1, 0.4, 0.15, 0.15, 0.05], sal: 2 };
    }
    else {
        syntheticArch.nodes.EPS = { kind: "categorical", probs: [0.2, 0.3, 0.1, 0.15, 0.15, 0.1], sal: 2 };
        syntheticArch.nodes.AES = { kind: "categorical", probs: [0.25, 0.25, 0.15, 0.1, 0.1, 0.15], sal: 2 };
    }
    return generateArchetypeAnswer(syntheticArch, q, state, rng, 1 - strength);
}
// ===================================================================
// Posterior update
// ===================================================================
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
        const l = Math.exp(-(distances[a.id] - minDist) / temperature);
        likelihoods[a.id] = l * a.prior;
        totalLikelihood += likelihoods[a.id];
    }
    for (const a of archetypes) {
        state.archetypePosterior[a.id] = totalLikelihood > 0 ? likelihoods[a.id] / totalLikelihood : a.prior;
    }
    const entries = Object.entries(state.archetypePosterior).sort((a, b) => b[1] - a[1]);
    const newLeader = entries[0]?.[0];
    if (newLeader === state.currentLeader) {
        state.consecutiveLeadCount = (state.consecutiveLeadCount ?? 0) + 1;
    }
    else {
        state.currentLeader = newLeader;
        state.consecutiveLeadCount = 1;
    }
}
function computeEntropy(posterior) {
    let h = 0;
    for (const p of Object.values(posterior)) {
        if (p > 1e-12)
            h -= p * Math.log2(p);
    }
    return h;
}
// FIXED_16 question ordering from engine config
import { FIXED_16 } from "../engine/config.js";
/**
 * Fast simulation: uses the full adaptive engine for question selection.
 * For "lite" mode, uses fixed16 + random remaining (much faster but less realistic).
 */
function runSimulation(archetypes, questions, answerFn, maxQ = 65, lite = false) {
    resetSimilarityCache();
    const state = createInitialState(archetypes);
    const asked = [];
    const answeredSet = new Set();
    if (lite) {
        // Lite mode: ask fixed16 first, then remaining in order of stage/quality
        const questionOrder = [];
        // Fixed16 first
        for (const qId of FIXED_16) {
            const q = questions.find(q => q.id === qId);
            if (q)
                questionOrder.push(q);
        }
        // Then remaining sorted by stage priority then quality
        const stagePriority = { fixed12: 0, screen20: 1, stage2: 2, stage3: 3 };
        const remaining = questions.filter(q => !FIXED_16.includes(q.id) && q.touchProfile.length > 0)
            .sort((a, b) => {
            const sa = stagePriority[a.stage] ?? 9;
            const sb = stagePriority[b.stage] ?? 9;
            if (sa !== sb)
                return sa - sb;
            return b.quality - a.quality;
        });
        questionOrder.push(...remaining);
        for (const q of questionOrder) {
            if (asked.length >= maxQ)
                break;
            if (answeredSet.has(q.id))
                continue;
            const applyFn = answerFn(q, state);
            if (applyFn) {
                applyFn();
                asked.push(q.id);
                answeredSet.add(q.id);
                // Update posteriors every 4 questions (batch-like) for speed
                if (asked.length % 4 === 0 || asked.length <= 16) {
                    updatePosteriors(state, archetypes);
                }
                // Simple stop: after 30 questions, if top posterior > 0.3
                if (asked.length >= 30) {
                    const entries = Object.entries(state.archetypePosterior).sort((a, b) => b[1] - a[1]);
                    if ((entries[0]?.[1] ?? 0) > 0.3 && (entries[0]?.[1] ?? 0) - (entries[1]?.[1] ?? 0) > 0.05)
                        break;
                }
                // Hard cap
                if (asked.length >= 55)
                    break;
            }
            else {
                state.answers[q.id] = "__skipped__";
                answeredSet.add(q.id);
            }
        }
    }
    else {
        // Full engine mode
        for (let i = 0; i < maxQ; i++) {
            const available = questions.filter(q => !answeredSet.has(q.id) && q.touchProfile.length > 0);
            const nextQ = selectNextQuestion(state, available, archetypes);
            if (!nextQ)
                break;
            const applyFn = answerFn(nextQ, state);
            if (applyFn) {
                applyFn();
                asked.push(nextQ.id);
                answeredSet.add(nextQ.id);
                updatePosteriors(state, archetypes);
                if (asked.length >= 25 && shouldStop(state, archetypes))
                    break;
            }
            else {
                state.answers[nextQ.id] = "__skipped__";
                answeredSet.add(nextQ.id);
            }
        }
    }
    updatePosteriors(state, archetypes);
    const sorted = Object.entries(state.archetypePosterior).sort((a, b) => b[1] - a[1]);
    const topId = sorted[0]?.[0] ?? "";
    const topP = sorted[0]?.[1] ?? 0;
    const secondP = sorted[1]?.[1] ?? 0;
    const topArch = archetypes.find(a => a.id === topId);
    return {
        winnerId: topId,
        winnerName: topArch?.name ?? "?",
        topPosterior: topP,
        secondPosterior: secondP,
        margin: topP - secondP,
        questionsAsked: asked,
        questionsCount: asked.length,
        entropy: computeEntropy(state.archetypePosterior),
        top3: sorted.slice(0, 3).map(([id]) => id),
        top3Probs: sorted.slice(0, 3).map(([, p]) => p),
        posteriorFull: state.archetypePosterior,
    };
}
// ===================================================================
// Main simulation
// ===================================================================
async function main() {
    resetConfig();
    const archetypes = ARCHETYPES;
    const questions = REPRESENTATIVE_QUESTIONS;
    const activeQuestions = questions.filter(q => q.touchProfile.length > 0);
    console.log(`PRISM 40K Diagnostic`);
    console.log(`Archetypes: ${archetypes.length}`);
    console.log(`Active questions: ${activeQuestions.length}`);
    console.log();
    const allResults = [];
    let simId = 0;
    const rng = new SeededRNG(42);
    const startTime = Date.now();
    // --- Phase 1: Targeted archetype simulations ---
    // Clean (full engine) + noise variants (lite mode for speed)
    console.log("Phase 1a: Clean targeted (full engine)...");
    for (const arch of archetypes) {
        const localRng = new SeededRNG(simId + 1000);
        const result = runSimulation(archetypes, activeQuestions, (q, state) => {
            return generateArchetypeAnswer(arch, q, state, localRng, 0);
        }, 65, false); // full engine
        const sorted = Object.entries(result.posteriorFull).sort((a, b) => b[1] - a[1]);
        const rank = sorted.findIndex(([id]) => id === arch.id) + 1;
        allResults.push({
            simId: simId++, profileType: "targeted_clean", targetArchId: arch.id,
            winnerId: result.winnerId, winnerName: result.winnerName,
            topPosterior: result.topPosterior, secondPosterior: result.secondPosterior,
            margin: result.margin, questionsAsked: result.questionsAsked,
            questionsCount: result.questionsCount, entropy: result.entropy,
            top3: result.top3, top3Probs: result.top3Probs,
            correct: result.winnerId === arch.id, rank,
        });
    }
    console.log(`  Phase 1a complete: ${allResults.length} sims (${((Date.now() - startTime) / 1000).toFixed(0)}s)`);
    console.log("Phase 1b: Noisy targeted (lite engine)...");
    const noiseLevels = [0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.4, 0.5, 0.6];
    for (const arch of archetypes) {
        for (const noise of noiseLevels) {
            const localRng = new SeededRNG(simId + 1000);
            const result = runSimulation(archetypes, activeQuestions, (q, state) => {
                return generateArchetypeAnswer(arch, q, state, localRng, noise);
            }, 65, true); // lite engine for speed
            const sorted = Object.entries(result.posteriorFull).sort((a, b) => b[1] - a[1]);
            const rank = sorted.findIndex(([id]) => id === arch.id) + 1;
            allResults.push({
                simId: simId++, profileType: `targeted_noise_${noise}`, targetArchId: arch.id,
                winnerId: result.winnerId, winnerName: result.winnerName,
                topPosterior: result.topPosterior, secondPosterior: result.secondPosterior,
                margin: result.margin, questionsAsked: result.questionsAsked,
                questionsCount: result.questionsCount, entropy: result.entropy,
                top3: result.top3, top3Probs: result.top3Probs,
                correct: result.winnerId === arch.id, rank,
            });
        }
        if ((allResults.length % 500) === 0) {
            console.log(`  ... ${allResults.length} simulations done (${((Date.now() - startTime) / 1000).toFixed(0)}s)`);
        }
    }
    console.log(`  Phase 1 complete: ${allResults.length} sims (${((Date.now() - startTime) / 1000).toFixed(0)}s)`);
    // --- Phase 2: Random uniform (10000) ---
    console.log("Phase 2: Random uniform answers...");
    for (let i = 0; i < 10000; i++) {
        const localRng = new SeededRNG(simId + 5000);
        const result = runSimulation(archetypes, activeQuestions, (q, state) => {
            return generateRandomAnswer(q, state, localRng);
        }, 65, true);
        allResults.push({
            simId: simId++,
            profileType: "random_uniform",
            winnerId: result.winnerId,
            winnerName: result.winnerName,
            topPosterior: result.topPosterior,
            secondPosterior: result.secondPosterior,
            margin: result.margin,
            questionsAsked: result.questionsAsked,
            questionsCount: result.questionsCount,
            entropy: result.entropy,
            top3: result.top3,
            top3Probs: result.top3Probs,
        });
        if ((allResults.length % 2000) === 0) {
            console.log(`  ... ${allResults.length} simulations done (${((Date.now() - startTime) / 1000).toFixed(0)}s)`);
        }
    }
    console.log(`  Phase 2 complete: ${allResults.length} total sims`);
    // --- Phase 3: Correlated profiles (18000) ---
    console.log("Phase 3: Correlated profiles...");
    const biasConfigs = [
        { type: "strong_liberal", bias: "liberal", strength: 0.9 },
        { type: "moderate_liberal", bias: "liberal", strength: 0.6 },
        { type: "strong_conservative", bias: "conservative", strength: 0.9 },
        { type: "moderate_conservative", bias: "conservative", strength: 0.6 },
        { type: "centrist_strong", bias: "centrist", strength: 0.8 },
        { type: "centrist_weak", bias: "centrist", strength: 0.4 },
    ];
    for (const cfg of biasConfigs) {
        for (let i = 0; i < 3000; i++) {
            const localRng = new SeededRNG(simId + 20000);
            const result = runSimulation(archetypes, activeQuestions, (q, state) => {
                return generateBiasedAnswer(q, state, localRng, cfg.bias, cfg.strength);
            }, 65, true);
            allResults.push({
                simId: simId++,
                profileType: cfg.type,
                winnerId: result.winnerId,
                winnerName: result.winnerName,
                topPosterior: result.topPosterior,
                secondPosterior: result.secondPosterior,
                margin: result.margin,
                questionsAsked: result.questionsAsked,
                questionsCount: result.questionsCount,
                entropy: result.entropy,
                top3: result.top3,
                top3Probs: result.top3Probs,
            });
        }
        console.log(`  ... ${allResults.length} simulations done (${cfg.type}, ${((Date.now() - startTime) / 1000).toFixed(0)}s)`);
    }
    console.log(`  Phase 3 complete: ${allResults.length} total sims`);
    // --- Phase 4: Adversarial profiles (remaining to get to ~40000) ---
    const remaining = 40000 - allResults.length;
    console.log(`Phase 4: Adversarial profiles (${remaining} sims)...`);
    // Adversarial: always pick the WORST option for the leading archetype
    const adversarialCount = Math.floor(remaining / 4);
    for (let i = 0; i < adversarialCount; i++) {
        const localRng = new SeededRNG(simId + 50000);
        const result = runSimulation(archetypes, activeQuestions, (q, state) => {
            // Find current leader
            const sorted = Object.entries(state.archetypePosterior).sort((a, b) => b[1] - a[1]);
            const leaderId = sorted[0]?.[0];
            const leader = archetypes.find(a => a.id === leaderId);
            if (!leader)
                return generateRandomAnswer(q, state, localRng);
            // Pick the WORST-aligned option for the leader
            if (q.optionEvidence) {
                const opts = Object.keys(q.optionEvidence);
                if (opts.length) {
                    let worst = opts[0], worstScore = Infinity;
                    for (const opt of opts) {
                        const s = scoreOptionEvidence(leader, q.optionEvidence[opt]);
                        if (s < worstScore) {
                            worstScore = s;
                            worst = opt;
                        }
                    }
                    return () => applySingleChoiceAnswer(state, q, worst);
                }
            }
            return generateRandomAnswer(q, state, localRng);
        }, 65, true);
        allResults.push({
            simId: simId++, profileType: "adversarial_anti_leader",
            winnerId: result.winnerId, winnerName: result.winnerName,
            topPosterior: result.topPosterior, secondPosterior: result.secondPosterior,
            margin: result.margin, questionsAsked: result.questionsAsked,
            questionsCount: result.questionsCount, entropy: result.entropy,
            top3: result.top3, top3Probs: result.top3Probs,
        });
        if ((allResults.length % 2000) === 0)
            console.log(`  ... ${allResults.length} sims (${((Date.now() - startTime) / 1000).toFixed(0)}s)`);
    }
    // Adversarial: always first option
    for (let i = 0; i < adversarialCount; i++) {
        const result = runSimulation(archetypes, activeQuestions, (q, state) => {
            if (q.optionEvidence) {
                const opts = Object.keys(q.optionEvidence);
                if (opts.length)
                    return () => applySingleChoiceAnswer(state, q, opts[0]);
            }
            if (q.sliderMap)
                return () => applySliderAnswer(state, q, 0);
            const localRng = new SeededRNG(simId + 70000);
            return generateRandomAnswer(q, state, localRng);
        }, 65, true);
        allResults.push({
            simId: simId++, profileType: "adversarial_always_first",
            winnerId: result.winnerId, winnerName: result.winnerName,
            topPosterior: result.topPosterior, secondPosterior: result.secondPosterior,
            margin: result.margin, questionsAsked: result.questionsAsked,
            questionsCount: result.questionsCount, entropy: result.entropy,
            top3: result.top3, top3Probs: result.top3Probs,
        });
    }
    console.log(`  ... ${allResults.length} sims`);
    // Adversarial: always last option
    for (let i = 0; i < adversarialCount; i++) {
        const result = runSimulation(archetypes, activeQuestions, (q, state) => {
            if (q.optionEvidence) {
                const opts = Object.keys(q.optionEvidence);
                if (opts.length)
                    return () => applySingleChoiceAnswer(state, q, opts[opts.length - 1]);
            }
            if (q.sliderMap)
                return () => applySliderAnswer(state, q, 100);
            const localRng = new SeededRNG(simId + 80000);
            return generateRandomAnswer(q, state, localRng);
        }, 65, true);
        allResults.push({
            simId: simId++, profileType: "adversarial_always_last",
            winnerId: result.winnerId, winnerName: result.winnerName,
            topPosterior: result.topPosterior, secondPosterior: result.secondPosterior,
            margin: result.margin, questionsAsked: result.questionsAsked,
            questionsCount: result.questionsCount, entropy: result.entropy,
            top3: result.top3, top3Probs: result.top3Probs,
        });
    }
    // Adversarial: oscillating answers
    const osciCount = remaining - 3 * adversarialCount;
    for (let i = 0; i < osciCount; i++) {
        let toggle = false;
        const result = runSimulation(archetypes, activeQuestions, (q, state) => {
            toggle = !toggle;
            if (q.optionEvidence) {
                const opts = Object.keys(q.optionEvidence);
                if (opts.length) {
                    const idx = toggle ? 0 : opts.length - 1;
                    return () => applySingleChoiceAnswer(state, q, opts[idx]);
                }
            }
            if (q.sliderMap) {
                const val = toggle ? 10 : 90;
                return () => applySliderAnswer(state, q, val);
            }
            const localRng = new SeededRNG(simId + 90000);
            return generateRandomAnswer(q, state, localRng);
        }, 65, true);
        allResults.push({
            simId: simId++, profileType: "adversarial_oscillating",
            winnerId: result.winnerId, winnerName: result.winnerName,
            topPosterior: result.topPosterior, secondPosterior: result.secondPosterior,
            margin: result.margin, questionsAsked: result.questionsAsked,
            questionsCount: result.questionsCount, entropy: result.entropy,
            top3: result.top3, top3Probs: result.top3Probs,
        });
    }
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`\nAll ${allResults.length} simulations complete in ${elapsed}s\n`);
    // ===================================================================
    // Analysis
    // ===================================================================
    console.log("Analyzing results...");
    // 1. Winner distribution
    const winnerCounts = {};
    for (const r of allResults)
        winnerCounts[r.winnerId] = (winnerCounts[r.winnerId] ?? 0) + 1;
    const sortedWinners = Object.entries(winnerCounts).sort((a, b) => b[1] - a[1]);
    // 2. Unreachable archetypes
    const reachedIds = new Set(Object.keys(winnerCounts));
    const unreachable = archetypes.filter(a => !reachedIds.has(a.id));
    // 3. Question frequency
    const questionFreq = {};
    for (const r of allResults)
        for (const qId of r.questionsAsked)
            questionFreq[qId] = (questionFreq[qId] ?? 0) + 1;
    const neverAsked = activeQuestions.filter(q => !questionFreq[q.id]);
    const sortedQuestions = Object.entries(questionFreq)
        .map(([id, count]) => ({ id: parseInt(id), count }))
        .sort((a, b) => b.count - a.count);
    // 4. Targeted accuracy
    const targetedClean = allResults.filter(r => r.profileType === "targeted_clean");
    const targetedCorrect = targetedClean.filter(r => r.correct).length;
    const targetedTop3 = targetedClean.filter(r => r.rank <= 3).length;
    const targetedTop5 = targetedClean.filter(r => r.rank <= 5).length;
    // 5. Entropy stats
    const allEntropies = allResults.map(r => r.entropy);
    const avgEntropy = allEntropies.reduce((a, b) => a + b, 0) / allEntropies.length;
    const minEntropy = Math.min(...allEntropies);
    const maxEntropy = Math.max(...allEntropies);
    // 6. Question count stats
    const allQCounts = allResults.map(r => r.questionsCount);
    const avgQCount = allQCounts.reduce((a, b) => a + b, 0) / allQCounts.length;
    // 7. Confused pairs (co-top-2)
    const pairCounts = {};
    for (const r of allResults) {
        if (r.top3.length >= 2) {
            const key = [r.top3[0], r.top3[1]].sort().join("+");
            pairCounts[key] = (pairCounts[key] ?? 0) + 1;
        }
    }
    const sortedPairs = Object.entries(pairCounts).sort((a, b) => b[1] - a[1]);
    // 8. Targeted misses
    const targetedMisses = targetedClean.filter(r => !r.correct);
    const confusionMatrix = {};
    for (const m of targetedMisses) {
        const key = m.targetArchId;
        if (!confusionMatrix[key])
            confusionMatrix[key] = [];
        confusionMatrix[key].push(m.winnerId);
    }
    // 9. Absorbing archetypes (win disproportionately)
    const totalSims = allResults.length;
    const expected = totalSims / archetypes.length;
    const absorbing = sortedWinners.filter(([, count]) => count > expected * 3);
    // 10. Per-profile-type stats
    const profileTypes = [...new Set(allResults.map(r => r.profileType))];
    const profileStats = {};
    for (const pt of profileTypes) {
        const subset = allResults.filter(r => r.profileType === pt);
        profileStats[pt] = {
            count: subset.length,
            avgEntropy: subset.reduce((s, r) => s + r.entropy, 0) / subset.length,
            avgQCount: subset.reduce((s, r) => s + r.questionsCount, 0) / subset.length,
            avgMargin: subset.reduce((s, r) => s + r.margin, 0) / subset.length,
            avgTopP: subset.reduce((s, r) => s + r.topPosterior, 0) / subset.length,
        };
    }
    // 11. Noise degradation curve
    const noiseAccuracy = {};
    for (const r of allResults) {
        if (r.profileType.startsWith("targeted_")) {
            if (!noiseAccuracy[r.profileType])
                noiseAccuracy[r.profileType] = { total: 0, correct: 0 };
            noiseAccuracy[r.profileType].total++;
            if (r.correct)
                noiseAccuracy[r.profileType].correct++;
        }
    }
    // 12. Node signature analysis
    const winnerNodeSignatures = {};
    for (const [winnerId] of sortedWinners.slice(0, 20)) {
        const arch = archetypes.find(a => a.id === winnerId);
        if (!arch)
            continue;
        const sig = {};
        for (const nodeId of CONTINUOUS_NODES) {
            const t = arch.nodes[nodeId];
            if (t && t.kind === "continuous")
                sig[nodeId] = t.pos;
        }
        winnerNodeSignatures[winnerId] = sig;
    }
    // ===================================================================
    // Generate reports
    // ===================================================================
    console.log("Generating reports...");
    const outputDir = path.join(process.cwd(), "output");
    fs.mkdirSync(outputDir, { recursive: true });
    // --- TEXT SUMMARY ---
    const textLines = [];
    const t = (s) => textLines.push(s);
    t("PRISM Quiz Engine — 40K Massive Diagnostic Report");
    t("=".repeat(60));
    t(`Total simulations: ${totalSims}`);
    t(`Archetypes: ${archetypes.length}`);
    t(`Active questions: ${activeQuestions.length}`);
    t(`Runtime: ${elapsed}s`);
    t("");
    t("TARGETED ACCURACY (clean archetype → self)");
    t("-".repeat(40));
    t(`Top-1 accuracy: ${targetedCorrect}/${targetedClean.length} = ${(targetedCorrect / targetedClean.length * 100).toFixed(1)}%`);
    t(`Top-3 accuracy: ${targetedTop3}/${targetedClean.length} = ${(targetedTop3 / targetedClean.length * 100).toFixed(1)}%`);
    t(`Top-5 accuracy: ${targetedTop5}/${targetedClean.length} = ${(targetedTop5 / targetedClean.length * 100).toFixed(1)}%`);
    t("");
    t("NOISE DEGRADATION CURVE");
    t("-".repeat(40));
    for (const [pt, stats] of Object.entries(noiseAccuracy).sort()) {
        t(`  ${pt.padEnd(25)} ${stats.correct}/${stats.total} = ${(stats.correct / stats.total * 100).toFixed(1)}%`);
    }
    t("");
    t("OVERALL STATISTICS");
    t("-".repeat(40));
    t(`Avg posterior entropy at completion: ${avgEntropy.toFixed(3)} bits`);
    t(`Min entropy: ${minEntropy.toFixed(3)}, Max: ${maxEntropy.toFixed(3)}`);
    t(`Avg questions asked: ${avgQCount.toFixed(1)}`);
    t(`Avg top-1 posterior: ${(allResults.reduce((s, r) => s + r.topPosterior, 0) / totalSims).toFixed(3)}`);
    t(`Avg margin (top1 - top2): ${(allResults.reduce((s, r) => s + r.margin, 0) / totalSims).toFixed(3)}`);
    t("");
    t("PER-PROFILE STATISTICS");
    t("-".repeat(40));
    for (const [pt, stats] of Object.entries(profileStats).sort()) {
        t(`  ${pt.padEnd(28)} n=${String(stats.count).padEnd(6)} avgH=${stats.avgEntropy.toFixed(2)} avgQ=${stats.avgQCount.toFixed(1)} avgM=${stats.avgMargin.toFixed(3)} avgP=${stats.avgTopP.toFixed(3)}`);
    }
    t("");
    t("UNREACHABLE ARCHETYPES (never won across 40K sims)");
    t("-".repeat(40));
    if (unreachable.length === 0) {
        t("  None! All archetypes reachable.");
    }
    else {
        for (const a of unreachable)
            t(`  ⚠ ${a.id} ${a.name}`);
    }
    t("");
    t("ABSORBING ARCHETYPES (win >3x expected rate)");
    t("-".repeat(40));
    t(`  Expected per archetype: ${expected.toFixed(0)}`);
    for (const [id, count] of absorbing) {
        const arch = archetypes.find(a => a.id === id);
        t(`  ⚠ ${id} ${(arch?.name ?? "?").padEnd(35)} won ${count} times (${(count / expected).toFixed(1)}x expected)`);
    }
    t("");
    t("TOP 20 WINNING ARCHETYPES");
    t("-".repeat(40));
    for (const [id, count] of sortedWinners.slice(0, 20)) {
        const arch = archetypes.find(a => a.id === id);
        t(`  ${id} ${(arch?.name ?? "?").padEnd(35)} ${count} wins (${(count / totalSims * 100).toFixed(2)}%)`);
    }
    t("");
    t("BOTTOM 20 WINNING ARCHETYPES (least wins)");
    t("-".repeat(40));
    for (const [id, count] of sortedWinners.slice(-20).reverse()) {
        const arch = archetypes.find(a => a.id === id);
        t(`  ${id} ${(arch?.name ?? "?").padEnd(35)} ${count} wins (${(count / totalSims * 100).toFixed(2)}%)`);
    }
    t("");
    t("QUESTION FREQUENCY (top 20 most asked)");
    t("-".repeat(40));
    for (const { id, count } of sortedQuestions.slice(0, 20)) {
        const q = activeQuestions.find(q => q.id === id);
        t(`  Q${String(id).padEnd(4)} ${(q?.promptShort ?? "?").padEnd(40)} asked ${count} times (${(count / totalSims * 100).toFixed(1)}%)`);
    }
    t("");
    t("NEVER-ASKED QUESTIONS");
    t("-".repeat(40));
    if (neverAsked.length === 0) {
        t("  None! All questions used.");
    }
    else {
        for (const q of neverAsked)
            t(`  ⚠ Q${q.id} ${q.promptShort} (stage: ${q.stage})`);
    }
    t("");
    t("LEAST-ASKED QUESTIONS (bottom 10)");
    t("-".repeat(40));
    for (const { id, count } of sortedQuestions.slice(-10).reverse()) {
        const q = activeQuestions.find(q => q.id === id);
        t(`  Q${String(id).padEnd(4)} ${(q?.promptShort ?? "?").padEnd(40)} asked ${count} times`);
    }
    t("");
    t("TOP 20 CONFUSED PAIRS (most frequent co-top-2)");
    t("-".repeat(40));
    for (const [pair, count] of sortedPairs.slice(0, 20)) {
        const [id1, id2] = pair.split("+");
        const a1 = archetypes.find(a => a.id === id1);
        const a2 = archetypes.find(a => a.id === id2);
        t(`  ${id1} ${(a1?.name ?? "?").padEnd(28)} ↔ ${id2} ${(a2?.name ?? "?").padEnd(28)} ${count} times`);
    }
    t("");
    t("TARGETED MISSES (clean archetype simulations that missed)");
    t("-".repeat(40));
    for (const m of targetedMisses) {
        const targetArch = archetypes.find(a => a.id === m.targetArchId);
        t(`  ${m.targetArchId} ${(targetArch?.name ?? "?").padEnd(30)} → got ${m.winnerId} ${m.winnerName} (rank=${m.rank})`);
    }
    t("");
    t("SCORING ANOMALIES");
    t("-".repeat(40));
    const lowMargin = allResults.filter(r => r.profileType === "targeted_clean" && r.margin < 0.01);
    t(`  Low-margin clean targeted: ${lowMargin.length}/${targetedClean.length}`);
    const highEntropyClean = targetedClean.filter(r => r.entropy > 4);
    t(`  High-entropy (>4 bits) clean targeted: ${highEntropyClean.length}/${targetedClean.length}`);
    const adversarialHighConf = allResults.filter(r => r.profileType.startsWith("adversarial") && r.topPosterior > 0.5);
    t(`  Adversarial with high confidence (>0.5): ${adversarialHighConf.length}/${allResults.filter(r => r.profileType.startsWith("adversarial")).length}`);
    const textSummary = textLines.join("\n");
    fs.writeFileSync(path.join(outputDir, "quiz-diagnostic-40k-summary.txt"), textSummary);
    console.log("Text summary written.");
    // --- HTML REPORT ---
    const html = generateHtmlReport({
        totalSims, elapsed, archetypes, activeQuestions,
        targetedClean, targetedCorrect, targetedTop3, targetedTop5, targetedMisses,
        noiseAccuracy, profileStats,
        avgEntropy, minEntropy, maxEntropy, avgQCount,
        unreachable, absorbing, expected,
        sortedWinners, sortedQuestions, neverAsked,
        sortedPairs, allResults, confusionMatrix, winnerNodeSignatures,
    });
    fs.writeFileSync(path.join(outputDir, "quiz-diagnostic-40k.html"), html);
    console.log("HTML report written.");
    // Print summary
    console.log("\n" + textSummary.split("\n").slice(0, 50).join("\n"));
    console.log(`\n... (full summary in output/quiz-diagnostic-40k-summary.txt)`);
}
// ===================================================================
// HTML Report Generator
// ===================================================================
function generateHtmlReport(data) {
    const { totalSims, elapsed, archetypes, activeQuestions, targetedClean, targetedCorrect, targetedTop3, targetedTop5, targetedMisses, noiseAccuracy, profileStats, avgEntropy, minEntropy, maxEntropy, avgQCount, unreachable, absorbing, expected, sortedWinners, sortedQuestions, neverAsked, sortedPairs, allResults, confusionMatrix } = data;
    const archMap = new Map(archetypes.map((a) => [a.id, a]));
    const getName = (id) => archMap.get(id)?.name ?? id;
    // Entropy histogram
    const entropyBuckets = {};
    for (const r of allResults) {
        const bucket = Math.floor(r.entropy).toString();
        entropyBuckets[bucket] = (entropyBuckets[bucket] ?? 0) + 1;
    }
    // Question count histogram
    const qCountBuckets = {};
    for (const r of allResults) {
        const bucket = Math.floor(r.questionsCount / 5) * 5;
        qCountBuckets[bucket.toString()] = (qCountBuckets[bucket.toString()] ?? 0) + 1;
    }
    // Winner distribution for chart
    const topWinners = sortedWinners.slice(0, 30);
    // Noise curve data
    const noiseCurve = Object.entries(noiseAccuracy)
        .sort()
        .map(([pt, stats]) => ({
        label: pt.replace("targeted_", "").replace("noise_", "n="),
        accuracy: stats.correct / stats.total * 100
    }));
    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>PRISM Quiz Diagnostic — 40K Simulations</title>
<style>
  :root { --bg: #0d1117; --fg: #c9d1d9; --accent: #58a6ff; --accent2: #f0883e; 
    --green: #3fb950; --red: #f85149; --yellow: #d29922; --border: #30363d; --card: #161b22; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: var(--bg); color: var(--fg); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; padding: 20px; max-width: 1400px; margin: 0 auto; }
  h1 { color: var(--accent); font-size: 2em; margin-bottom: 10px; border-bottom: 2px solid var(--accent); padding-bottom: 10px; }
  h2 { color: var(--accent2); margin-top: 30px; margin-bottom: 15px; font-size: 1.4em; }
  h3 { color: var(--accent); margin-top: 20px; margin-bottom: 10px; }
  .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px; margin: 20px 0; }
  .stat-card { background: var(--card); border: 1px solid var(--border); border-radius: 8px; padding: 15px; }
  .stat-card .label { font-size: 0.85em; color: #8b949e; }
  .stat-card .value { font-size: 1.8em; font-weight: bold; color: var(--accent); }
  .stat-card .sub { font-size: 0.8em; color: #8b949e; }
  table { width: 100%; border-collapse: collapse; margin: 15px 0; background: var(--card); border-radius: 8px; overflow: hidden; }
  th { background: #21262d; color: var(--accent); padding: 10px 12px; text-align: left; font-size: 0.85em; }
  td { padding: 8px 12px; border-top: 1px solid var(--border); font-size: 0.85em; }
  tr:hover { background: #1c2128; }
  .bar-container { display: flex; align-items: center; gap: 8px; }
  .bar { height: 16px; background: var(--accent); border-radius: 3px; min-width: 2px; }
  .bar.red { background: var(--red); }
  .bar.green { background: var(--green); }
  .bar.yellow { background: var(--yellow); }
  .badge { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 0.75em; font-weight: bold; }
  .badge.ok { background: #0d3321; color: var(--green); }
  .badge.warn { background: #3d2e00; color: var(--yellow); }
  .badge.err { background: #3d1418; color: var(--red); }
  .alert { background: #3d1418; border: 1px solid var(--red); border-radius: 8px; padding: 15px; margin: 10px 0; }
  .alert.warn { background: #3d2e00; border-color: var(--yellow); }
  .alert.ok { background: #0d3321; border-color: var(--green); }
  .chart-row { display: flex; align-items: center; gap: 8px; margin: 3px 0; }
  .chart-label { width: 200px; text-align: right; font-size: 0.8em; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .chart-bar { height: 18px; border-radius: 3px; transition: width 0.3s; }
  .chart-value { font-size: 0.75em; color: #8b949e; min-width: 50px; }
  .section { margin: 30px 0; }
  .meta { color: #8b949e; font-size: 0.9em; margin-bottom: 20px; }
  code { background: #21262d; padding: 2px 6px; border-radius: 4px; font-size: 0.85em; }
  .heatcell { display: inline-block; width: 20px; height: 20px; border-radius: 2px; }
</style>
</head>
<body>
<h1>🔬 PRISM Quiz Diagnostic — 40K Simulations</h1>
<p class="meta">Generated ${new Date().toISOString()} | ${totalSims.toLocaleString()} simulations | ${elapsed}s runtime | ${archetypes.length} archetypes | ${activeQuestions.length} questions</p>

<div class="stats-grid">
  <div class="stat-card">
    <div class="label">Clean Targeted Accuracy (Top-1)</div>
    <div class="value" style="color: ${targetedCorrect / targetedClean.length > 0.8 ? 'var(--green)' : targetedCorrect / targetedClean.length > 0.6 ? 'var(--yellow)' : 'var(--red)'}">${(targetedCorrect / targetedClean.length * 100).toFixed(1)}%</div>
    <div class="sub">${targetedCorrect}/${targetedClean.length} archetypes correctly identified</div>
  </div>
  <div class="stat-card">
    <div class="label">Top-3 / Top-5 Accuracy</div>
    <div class="value">${(targetedTop3 / targetedClean.length * 100).toFixed(0)}% / ${(targetedTop5 / targetedClean.length * 100).toFixed(0)}%</div>
    <div class="sub">${targetedTop3} top-3, ${targetedTop5} top-5</div>
  </div>
  <div class="stat-card">
    <div class="label">Avg Posterior Entropy</div>
    <div class="value">${avgEntropy.toFixed(2)}</div>
    <div class="sub">bits (min ${minEntropy.toFixed(2)}, max ${maxEntropy.toFixed(2)})</div>
  </div>
  <div class="stat-card">
    <div class="label">Avg Questions Asked</div>
    <div class="value">${avgQCount.toFixed(1)}</div>
    <div class="sub">out of ${activeQuestions.length} available</div>
  </div>
  <div class="stat-card">
    <div class="label">Unreachable Archetypes</div>
    <div class="value" style="color: ${unreachable.length === 0 ? 'var(--green)' : 'var(--red)'}">${unreachable.length}</div>
    <div class="sub">${unreachable.length === 0 ? 'All archetypes reachable ✓' : 'Some never win!'}</div>
  </div>
  <div class="stat-card">
    <div class="label">Never-Asked Questions</div>
    <div class="value" style="color: ${neverAsked.length === 0 ? 'var(--green)' : 'var(--yellow)'}">${neverAsked.length}</div>
    <div class="sub">${neverAsked.length === 0 ? 'All questions used ✓' : 'Dead questions detected'}</div>
  </div>
</div>

${unreachable.length > 0 ? `<div class="alert">
<strong>⚠ UNREACHABLE ARCHETYPES</strong> — These archetypes never won across ${totalSims.toLocaleString()} simulations:
<ul>${unreachable.map((a) => `<li><code>${a.id}</code> ${a.name}</li>`).join("")}</ul>
</div>` : `<div class="alert ok"><strong>✓ All ${archetypes.length} archetypes are reachable</strong></div>`}

${absorbing.length > 0 ? `<div class="alert warn">
<strong>⚠ ABSORBING ARCHETYPES</strong> — These win disproportionately (>3× expected):
<ul>${absorbing.map(([id, count]) => `<li><code>${id}</code> ${getName(id)} — ${count} wins (${(count / expected).toFixed(1)}× expected)</li>`).join("")}</ul>
</div>` : ''}

<div class="section">
<h2>📊 Noise Degradation Curve</h2>
<p>How accuracy degrades as answer noise increases (0 = perfect archetype answers, 0.6 = highly noisy):</p>
<table>
<tr><th>Profile</th><th>Accuracy</th><th></th></tr>
${noiseCurve.map((d) => `<tr>
<td><code>${d.label}</code></td>
<td>${d.accuracy.toFixed(1)}%</td>
<td><div class="bar-container"><div class="bar ${d.accuracy > 70 ? 'green' : d.accuracy > 40 ? 'yellow' : 'red'}" style="width: ${d.accuracy * 3}px"></div></div></td>
</tr>`).join("")}
</table>
</div>

<div class="section">
<h2>📈 Per-Profile Statistics</h2>
<table>
<tr><th>Profile Type</th><th>Count</th><th>Avg Entropy</th><th>Avg Questions</th><th>Avg Margin</th><th>Avg Top Posterior</th></tr>
${Object.entries(profileStats).sort().map(([pt, s]) => `<tr>
<td><code>${pt}</code></td>
<td>${s.count}</td>
<td>${s.avgEntropy.toFixed(2)}</td>
<td>${s.avgQCount.toFixed(1)}</td>
<td>${s.avgMargin.toFixed(3)}</td>
<td>${s.avgTopP.toFixed(3)}</td>
</tr>`).join("")}
</table>
</div>

<div class="section">
<h2>🏆 Winner Distribution (Top 30)</h2>
${topWinners.map(([id, count]) => {
        const pct = count / totalSims * 100;
        const maxPct = topWinners[0][1] / totalSims * 100;
        return `<div class="chart-row">
<span class="chart-label" title="${getName(id)}">${id} ${getName(id)}</span>
<div class="chart-bar" style="width: ${pct / maxPct * 300}px; background: var(--accent)"></div>
<span class="chart-value">${count} (${pct.toFixed(1)}%)</span>
</div>`;
    }).join("")}
</div>

<div class="section">
<h2>❌ Targeted Misses</h2>
${targetedMisses.length === 0 ? '<div class="alert ok">No misses! Perfect clean accuracy.</div>' : `
<table>
<tr><th>Target</th><th>Target Name</th><th>Got</th><th>Got Name</th><th>Rank</th><th>Top Posterior</th><th>Margin</th></tr>
${targetedMisses.sort((a, b) => (b.rank ?? 0) - (a.rank ?? 0)).map((m) => `<tr>
<td><code>${m.targetArchId}</code></td>
<td>${getName(m.targetArchId)}</td>
<td><code>${m.winnerId}</code></td>
<td>${m.winnerName}</td>
<td><span class="badge ${m.rank <= 3 ? 'warn' : 'err'}">${m.rank}</span></td>
<td>${m.topPosterior.toFixed(3)}</td>
<td>${m.margin.toFixed(3)}</td>
</tr>`).join("")}
</table>`}
</div>

<div class="section">
<h2>🔄 Top 25 Confused Pairs (co-top-2)</h2>
<table>
<tr><th>Archetype A</th><th>Archetype B</th><th>Co-occurrences</th><th></th></tr>
${sortedPairs.slice(0, 25).map(([pair, count]) => {
        const [id1, id2] = pair.split("+");
        return `<tr>
<td><code>${id1}</code> ${getName(id1)}</td>
<td><code>${id2}</code> ${getName(id2)}</td>
<td>${count}</td>
<td><div class="bar-container"><div class="bar yellow" style="width: ${count / sortedPairs[0][1] * 200}px"></div></div></td>
</tr>`;
    }).join("")}
</table>
</div>

<div class="section">
<h2>📋 Question Usage</h2>
<h3>Most Used (Top 20)</h3>
<table>
<tr><th>Q#</th><th>Prompt</th><th>Type</th><th>Stage</th><th>Quality</th><th>Times Asked</th><th>% of Sims</th></tr>
${sortedQuestions.slice(0, 20).map((sq) => {
        const q = activeQuestions.find(q => q.id === sq.id);
        return `<tr>
<td><code>${sq.id}</code></td>
<td>${q?.promptShort ?? "?"}</td>
<td>${q?.uiType ?? "?"}</td>
<td>${q?.stage ?? "?"}</td>
<td>${q?.quality.toFixed(2) ?? "?"}</td>
<td>${sq.count}</td>
<td>${(sq.count / totalSims * 100).toFixed(1)}%</td>
</tr>`;
    }).join("")}
</table>

<h3>Least Used (Bottom 15)</h3>
<table>
<tr><th>Q#</th><th>Prompt</th><th>Type</th><th>Stage</th><th>Quality</th><th>Times Asked</th></tr>
${sortedQuestions.slice(-15).reverse().map((sq) => {
        const q = activeQuestions.find(q => q.id === sq.id);
        return `<tr>
<td><code>${sq.id}</code></td>
<td>${q?.promptShort ?? "?"}</td>
<td>${q?.uiType ?? "?"}</td>
<td>${q?.stage ?? "?"}</td>
<td>${q?.quality.toFixed(2) ?? "?"}</td>
<td>${sq.count}</td>
</tr>`;
    }).join("")}
</table>

${neverAsked.length > 0 ? `<h3>⚠ Never Asked</h3>
<table>
<tr><th>Q#</th><th>Prompt</th><th>Type</th><th>Stage</th><th>Quality</th></tr>
${neverAsked.map((q) => `<tr>
<td><code>${q.id}</code></td>
<td>${q.promptShort}</td>
<td>${q.uiType}</td>
<td>${q.stage}</td>
<td>${q.quality.toFixed(2)}</td>
</tr>`).join("")}
</table>` : ''}
</div>

<div class="section">
<h2>📉 Entropy Distribution</h2>
<p>Posterior entropy at quiz completion (lower = more confident assignment):</p>
${Object.entries(entropyBuckets).sort(([a], [b]) => parseInt(a) - parseInt(b)).map(([bucket, count]) => {
        const maxCount = Math.max(...Object.values(entropyBuckets));
        return `<div class="chart-row">
<span class="chart-label">${bucket}-${parseInt(bucket) + 1} bits</span>
<div class="chart-bar" style="width: ${count / maxCount * 400}px; background: ${parseInt(bucket) <= 2 ? 'var(--green)' : parseInt(bucket) <= 4 ? 'var(--yellow)' : 'var(--red)'}"></div>
<span class="chart-value">${count} (${(count / totalSims * 100).toFixed(1)}%)</span>
</div>`;
    }).join("")}
</div>

<div class="section">
<h2>📊 Questions-per-Quiz Distribution</h2>
${Object.entries(qCountBuckets).sort(([a], [b]) => parseInt(a) - parseInt(b)).map(([bucket, count]) => {
        const maxCount = Math.max(...Object.values(qCountBuckets));
        return `<div class="chart-row">
<span class="chart-label">${bucket}-${parseInt(bucket) + 4} questions</span>
<div class="chart-bar" style="width: ${count / maxCount * 400}px; background: var(--accent)"></div>
<span class="chart-value">${count}</span>
</div>`;
    }).join("")}
</div>

<div class="section" style="color: #8b949e; font-size: 0.8em; margin-top: 40px; border-top: 1px solid var(--border); padding-top: 15px;">
  PRISM Quiz Engine Diagnostic | ${totalSims.toLocaleString()} simulations | Generated by OpenClaw automated audit
</div>

</body>
</html>`;
}
main().catch(console.error);
//# sourceMappingURL=diagnostic-40k.js.map