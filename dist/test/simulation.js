/**
 * PRISM Quiz Engine — Simulation Diagnostic
 *
 * For each of the 124 archetypes, simulates a respondent who answers
 * as that archetype would, runs the full scoring pipeline, and checks
 * if the top-scoring archetype matches the simulated one.
 *
 * Usage:
 *   npx tsx src/test/simulation.ts          # Full run (124 archetypes)
 *   npx tsx src/test/simulation.ts --quick   # Quick run (first 20)
 */
import { ARCHETYPES } from "../config/archetypes.js";
import { REPRESENTATIVE_QUESTIONS } from "../config/questions.representative.js";
import { CONTINUOUS_NODES, CATEGORICAL_NODES } from "../config/nodes.js";
import { applySingleChoiceAnswer, applySliderAnswer, applyAllocationAnswer, applyRankingAnswer, applyPairwiseAnswer, } from "../engine/update.js";
import { selectNextQuestion } from "../engine/nextQuestion.js";
import { shouldStop } from "../engine/stopRule.js";
import { archetypeDistance, archetypeDistanceV1, archetypeDistanceV2 } from "../engine/archetypeDistance.js";
import { resetConfig } from "../optimize/runtimeConfig.js";
import { resetSimilarityCache } from "../engine/stopRule.js";
// ---------------------------------------------------------------------------
// State initialization
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
// Archetype-based answer generation
// ---------------------------------------------------------------------------
/**
 * For a given archetype and question, generate the response that best
 * matches what that archetype would answer.
 */
function generateAnswer(archetype, question, state) {
    switch (question.uiType) {
        case "single_choice":
            return generateSingleChoice(archetype, question, state);
        case "slider":
            return generateSlider(archetype, question, state);
        case "allocation":
            return generateAllocation(archetype, question, state);
        case "ranking":
            return generateRanking(archetype, question, state);
        case "pairwise":
            return generatePairwise(archetype, question, state);
        case "best_worst":
            return generateBestWorst(archetype, question, state);
        case "multi":
            return generateMulti(archetype, question, state);
        default:
            return null;
    }
}
/**
 * Score how well an option's evidence aligns with the archetype.
 * Lower score = better alignment.
 */
function scoreOptionEvidence(archetype, evidence) {
    if (!evidence)
        return 1; // neutral — no evidence
    let score = 0;
    let count = 0;
    if (evidence.continuous) {
        for (const [nodeId, upd] of Object.entries(evidence.continuous)) {
            const template = archetype.nodes[nodeId];
            if (!template || template.kind !== "continuous")
                continue;
            if (upd?.pos) {
                // How well does this likelihood align with the archetype's position?
                // The archetype has position 1-5, so check likelihood at that position
                const posIdx = template.pos - 1; // 0-indexed
                score += upd.pos[posIdx] ?? 0;
                count++;
            }
            if (upd?.sal) {
                const salIdx = template.sal; // 0-3
                score += (upd.sal[salIdx] ?? 0) * 0.5; // salience matters less
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
                // Dot product between archetype's category probs and the evidence
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
/**
 * Score how well an allocation bucket's signal map aligns with the archetype.
 * Positive signal at pos=1 means "push toward 1"; archetype at pos=1 likes positive signals.
 */
function scoreAllocationBucket(archetype, bucket) {
    let score = 0;
    let count = 0;
    if (bucket.continuous) {
        for (const [nodeId, signal] of Object.entries(bucket.continuous)) {
            const template = archetype.nodes[nodeId];
            if (!template || template.kind !== "continuous")
                continue;
            // Signal > 0 pushes toward pos=5, signal < 0 pushes toward pos=1
            // Archetype at pos=1 wants negative signals, pos=5 wants positive
            const desiredDirection = (template.pos - 3) / 2; // normalize: -1 to +1
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
    // If no matching profile info, use a small base score
    return count > 0 ? score / count : 0;
}
function generateSingleChoice(archetype, question, state) {
    if (!question.optionEvidence)
        return null;
    const options = Object.keys(question.optionEvidence);
    if (options.length === 0)
        return null;
    let bestOption = options[0];
    let bestScore = -Infinity;
    for (const opt of options) {
        const evidence = question.optionEvidence[opt];
        const score = scoreOptionEvidence(archetype, evidence);
        if (score > bestScore) {
            bestScore = score;
            bestOption = opt;
        }
    }
    return {
        apply: () => applySingleChoiceAnswer(state, question, bestOption),
    };
}
function generateSlider(archetype, question, state) {
    if (!question.sliderMap)
        return null;
    const buckets = Object.keys(question.sliderMap);
    if (buckets.length === 0)
        return null;
    let bestBucket = buckets[0];
    let bestScore = -Infinity;
    for (const bucket of buckets) {
        const evidence = question.sliderMap[bucket];
        const score = scoreOptionEvidence(archetype, evidence);
        if (score > bestScore) {
            bestScore = score;
            bestBucket = bucket;
        }
    }
    // Convert bucket to midpoint value
    const parts = bestBucket.split("-").map(Number);
    const lo = parts[0] ?? 0;
    const hi = parts[1] ?? 100;
    const midpoint = Math.round((lo + hi) / 2);
    return {
        apply: () => applySliderAnswer(state, question, midpoint),
    };
}
function generateAllocation(archetype, question, state) {
    if (!question.allocationMap)
        return null;
    const bucketNames = Object.keys(question.allocationMap);
    if (bucketNames.length === 0)
        return null;
    // Score each bucket and allocate proportionally to alignment
    const scores = {};
    for (const name of bucketNames) {
        const bucket = question.allocationMap[name];
        scores[name] = scoreAllocationBucket(archetype, bucket);
    }
    // Convert scores to allocation: softmax-ish
    const minScore = Math.min(...Object.values(scores));
    const shifted = {};
    for (const name of bucketNames) {
        shifted[name] = Math.exp((scores[name] - minScore) * 2); // temperature=0.5
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
function generateRanking(archetype, question, state) {
    if (!question.rankingMap)
        return null;
    const items = Object.keys(question.rankingMap);
    if (items.length === 0)
        return null;
    // Score each item and sort descending
    const scored = items.map((item) => ({
        item,
        score: scoreRankingItem(archetype, question.rankingMap[item]),
    }));
    scored.sort((a, b) => b.score - a.score);
    const ranking = scored.map((s) => s.item);
    return {
        apply: () => applyRankingAnswer(state, question, ranking),
    };
}
function generatePairwise(archetype, question, state) {
    if (!question.pairMaps)
        return null;
    const answers = {};
    for (const [pairId, options] of Object.entries(question.pairMaps)) {
        let bestChoice = "";
        let bestScore = -Infinity;
        for (const [choice, map] of Object.entries(options)) {
            const score = scorePairOption(archetype, map);
            if (score > bestScore) {
                bestScore = score;
                bestChoice = choice;
            }
        }
        if (bestChoice) {
            answers[pairId] = bestChoice;
        }
    }
    if (Object.keys(answers).length === 0)
        return null;
    return {
        apply: () => applyPairwiseAnswer(state, question, answers),
    };
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
function generateBestWorst(archetype, question, state) {
    if (!question.bestWorstMap) {
        // best_worst without evidence map — treat as ranking
        return generateRanking(archetype, question, state);
    }
    const items = Object.keys(question.bestWorstMap);
    if (items.length === 0)
        return null;
    const scored = items.map((item) => ({
        item,
        score: scoreRankingItem(archetype, question.bestWorstMap[item]),
    }));
    scored.sort((a, b) => b.score - a.score);
    // Apply as ranking (best_worst is essentially a ranking)
    const ranking = scored.map((s) => s.item);
    return {
        apply: () => applyRankingAnswer(state, question, ranking),
    };
}
function generateMulti(archetype, question, state) {
    if (!question.optionEvidence)
        return null;
    const options = Object.keys(question.optionEvidence);
    if (options.length === 0)
        return null;
    // Pick the top 2 options
    const scored = options.map((opt) => ({
        opt,
        score: scoreOptionEvidence(archetype, question.optionEvidence[opt]),
    }));
    scored.sort((a, b) => b.score - a.score);
    const topPick = scored[0].opt;
    // Apply as single choice (multi questions apply evidence per selection)
    return {
        apply: () => applySingleChoiceAnswer(state, question, topPick),
    };
}
// Module-level scoring variant — set from CLI args in main()
let activeScoringVariant = "baseline";
function getDistanceFunction() {
    switch (activeScoringVariant) {
        case "v1": return archetypeDistanceV1;
        case "v2": return archetypeDistanceV2;
        default: return archetypeDistance;
    }
}
/**
 * Update archetype posteriors based on the current respondent state.
 * Uses distance-based likelihood: P(state | archetype) ∝ exp(-distance/temperature).
 *
 * Temperature decreases as more questions are answered, sharpening the
 * posterior as evidence accumulates. Early on, many archetypes remain
 * viable; later, the distribution concentrates on the best matches.
 */
function updatePosteriors(state, archetypes) {
    const nAnswered = Object.keys(state.answers).length;
    const distFn = getDistanceFunction();
    // Compute distances
    const distances = {};
    let minDist = Infinity;
    for (const a of archetypes) {
        const dist = distFn(state, a);
        distances[a.id] = dist;
        if (dist < minDist)
            minDist = dist;
    }
    // Adaptive temperature: starts warm (0.12), cools by question 40
    // V2 uses a sharper minimum temperature (0.02 instead of 0.04)
    const baseTemp = 0.12;
    const minTemp = activeScoringVariant === "v2" ? 0.02 : 0.04;
    const coolRate = Math.min(1.0, nAnswered / 40);
    const temperature = baseTemp - (baseTemp - minTemp) * coolRate;
    let totalLikelihood = 0;
    const likelihoods = {};
    for (const a of archetypes) {
        const likelihood = Math.exp(-(distances[a.id] - minDist) / temperature);
        likelihoods[a.id] = likelihood * a.prior;
        totalLikelihood += likelihoods[a.id];
    }
    // Normalize to posterior
    for (const a of archetypes) {
        state.archetypePosterior[a.id] = totalLikelihood > 0
            ? likelihoods[a.id] / totalLikelihood
            : a.prior;
    }
    // Update leader tracking
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
function simulateArchetype(target, archetypes, questions, maxQuestions = 65) {
    resetSimilarityCache();
    const state = createInitialState(archetypes);
    let questionsAnswered = 0;
    const answeredIds = new Set();
    // Run quiz loop
    for (let i = 0; i < maxQuestions; i++) {
        // Select next question
        const available = questions.filter((q) => !answeredIds.has(q.id) && q.touchProfile.length > 0);
        const nextQ = selectNextQuestion(state, available, archetypes);
        if (!nextQ)
            break;
        // Generate and apply answer
        const answer = generateAnswer(target, nextQ, state);
        if (answer) {
            answer.apply();
            answeredIds.add(nextQ.id);
            questionsAnswered++;
            // Update posteriors after each answer
            updatePosteriors(state, archetypes);
            // Check stop condition
            if (questionsAnswered >= 25 && shouldStop(state, archetypes)) {
                break;
            }
        }
        else {
            // Skip question if we can't generate an answer
            answeredIds.add(nextQ.id);
        }
    }
    // Final posterior update
    updatePosteriors(state, archetypes);
    // Get result
    const sorted = Object.entries(state.archetypePosterior)
        .sort((a, b) => b[1] - a[1]);
    const topId = sorted[0]?.[0] ?? "";
    const topPosterior = sorted[0]?.[1] ?? 0;
    const secondPosterior = sorted[1]?.[1] ?? 0;
    const topArchetype = archetypes.find((a) => a.id === topId);
    // Find rank of target
    const rank = sorted.findIndex(([id]) => id === target.id) + 1;
    // Top 5
    const top5 = sorted.slice(0, 5).map(([id]) => {
        const a = archetypes.find((a) => a.id === id);
        return `${id}:${a?.name ?? "?"}`;
    });
    return {
        archetypeId: target.id,
        archetypeName: target.name,
        resultId: topId,
        resultName: topArchetype?.name ?? "?",
        correct: topId === target.id,
        questionsAnswered,
        topPosterior,
        margin: topPosterior - secondPosterior,
        rank,
        top5,
    };
}
// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
    const args = process.argv.slice(2);
    const isQuick = args.includes("--quick");
    // Parse --scoring flag
    const scoringIdx = args.indexOf("--scoring");
    if (scoringIdx !== -1 && args[scoringIdx + 1]) {
        const variant = args[scoringIdx + 1];
        if (["baseline", "v1", "v2"].includes(variant)) {
            activeScoringVariant = variant;
        }
        else {
            console.error(`Unknown scoring variant: ${variant}. Use baseline, v1, or v2.`);
            process.exit(1);
        }
    }
    resetConfig();
    const archetypes = ARCHETYPES;
    const questions = REPRESENTATIVE_QUESTIONS;
    console.log("=== PRISM Quiz Engine — Simulation Diagnostic ===");
    console.log(`Scoring variant: ${activeScoringVariant}`);
    console.log(`Archetypes: ${archetypes.length}`);
    console.log(`Questions available: ${questions.length}`);
    console.log(`Questions with evidence: ${questions.filter(q => q.touchProfile.length > 0).length}`);
    console.log();
    const targets = isQuick ? archetypes.slice(0, 20) : archetypes;
    console.log(`Simulating ${targets.length} archetypes...`);
    console.log();
    const results = [];
    let correct = 0;
    let totalQuestions = 0;
    let top3Count = 0;
    let top5Count = 0;
    for (let i = 0; i < targets.length; i++) {
        const target = targets[i];
        const result = simulateArchetype(target, archetypes, questions);
        results.push(result);
        if (result.correct)
            correct++;
        if (result.rank <= 3)
            top3Count++;
        if (result.rank <= 5)
            top5Count++;
        totalQuestions += result.questionsAnswered;
        const status = result.correct ? "OK" : `MISS(rank=${result.rank})`;
        const progress = `[${i + 1}/${targets.length}]`;
        console.log(`${progress} ${target.id} ${target.name.padEnd(35)} → ${status.padEnd(15)} ` +
            `q=${result.questionsAnswered} p=${result.topPosterior.toFixed(3)} ` +
            `m=${result.margin.toFixed(3)}`);
        if (!result.correct) {
            console.log(`         Got: ${result.resultId} ${result.resultName}`);
            console.log(`         Top5: ${result.top5.join(", ")}`);
        }
    }
    // Summary
    console.log();
    console.log("=== SUMMARY ===");
    console.log(`Accuracy (top-1): ${correct}/${targets.length} = ${(correct / targets.length * 100).toFixed(1)}%`);
    console.log(`Top-3 accuracy:   ${top3Count}/${targets.length} = ${(top3Count / targets.length * 100).toFixed(1)}%`);
    console.log(`Top-5 accuracy:   ${top5Count}/${targets.length} = ${(top5Count / targets.length * 100).toFixed(1)}%`);
    console.log(`Avg questions:    ${(totalQuestions / targets.length).toFixed(1)}`);
    console.log();
    // Confusion analysis: which archetypes are most confused with each other
    const misses = results.filter((r) => !r.correct);
    if (misses.length > 0) {
        console.log("=== CONFUSION PAIRS ===");
        const confusionPairs = {};
        for (const miss of misses) {
            const key = `${miss.archetypeId}→${miss.resultId}`;
            confusionPairs[key] = (confusionPairs[key] ?? 0) + 1;
        }
        const sorted = Object.entries(confusionPairs).sort((a, b) => b[1] - a[1]);
        for (const [pair, count] of sorted.slice(0, 20)) {
            const [fromId, toId] = pair.split("→");
            const from = archetypes.find((a) => a.id === fromId);
            const to = archetypes.find((a) => a.id === toId);
            console.log(`  ${fromId} ${from?.name?.padEnd(30) ?? ""} → ${toId} ${to?.name?.padEnd(30) ?? ""} (×${count})`);
        }
        console.log();
        // Most-confused-to archetypes (attractors)
        console.log("=== TOP ATTRACTORS (mistakenly assigned) ===");
        const attractors = {};
        for (const miss of misses) {
            attractors[miss.resultId] = (attractors[miss.resultId] ?? 0) + 1;
        }
        const sortedAttractors = Object.entries(attractors).sort((a, b) => b[1] - a[1]);
        for (const [id, count] of sortedAttractors.slice(0, 10)) {
            const a = archetypes.find((a) => a.id === id);
            console.log(`  ${id} ${a?.name?.padEnd(35) ?? ""} attracted ${count} misclassifications`);
        }
        console.log();
        // Worst-performing archetypes by rank
        console.log("=== WORST PERFORMERS (highest rank) ===");
        const worstPerformers = [...results]
            .sort((a, b) => b.rank - a.rank)
            .slice(0, 10);
        for (const r of worstPerformers) {
            if (r.rank <= 1)
                continue;
            console.log(`  ${r.archetypeId} ${r.archetypeName.padEnd(35)} rank=${r.rank} (got ${r.resultId} ${r.resultName})`);
        }
    }
    // Tier breakdown
    console.log();
    console.log("=== ACCURACY BY TIER ===");
    const tiers = ["T1", "T2", "MEANS", "GATE", "REALITY"];
    for (const tier of tiers) {
        const tierResults = results.filter((r) => {
            const a = archetypes.find((a) => a.id === r.archetypeId);
            return a?.tier === tier;
        });
        if (tierResults.length === 0)
            continue;
        const tierCorrect = tierResults.filter((r) => r.correct).length;
        console.log(`  ${tier.padEnd(8)} ${tierCorrect}/${tierResults.length} = ${(tierCorrect / tierResults.length * 100).toFixed(1)}%`);
    }
    console.log();
    console.log("=== QUESTIONS DISTRIBUTION ===");
    const qCounts = results.map((r) => r.questionsAnswered);
    const minQ = Math.min(...qCounts);
    const maxQ = Math.max(...qCounts);
    const medianQ = qCounts.sort((a, b) => a - b)[Math.floor(qCounts.length / 2)];
    console.log(`  Min: ${minQ}, Median: ${medianQ}, Max: ${maxQ}`);
    // Write JSON results
    const fs = await import("fs");
    const path = await import("path");
    const outputDir = path.join(process.cwd(), "output");
    fs.mkdirSync(outputDir, { recursive: true });
    const jsonResult = {
        variant: activeScoringVariant,
        total: targets.length,
        top1: correct,
        top3: top3Count,
        top5: top5Count,
        top1Pct: +(correct / targets.length * 100).toFixed(1),
        top3Pct: +(top3Count / targets.length * 100).toFixed(1),
        top5Pct: +(top5Count / targets.length * 100).toFixed(1),
        avgQuestions: +(totalQuestions / targets.length).toFixed(1),
        misses: misses.map((m) => ({
            archetypeId: m.archetypeId,
            archetypeName: m.archetypeName,
            gotId: m.resultId,
            gotName: m.resultName,
            rank: m.rank,
        })),
        allResults: results.map((r) => ({
            archetypeId: r.archetypeId,
            correct: r.correct,
            rank: r.rank,
            questionsAnswered: r.questionsAnswered,
        })),
    };
    const outFile = path.join(outputDir, `scoring-${activeScoringVariant}.json`);
    fs.writeFileSync(outFile, JSON.stringify(jsonResult, null, 2));
    console.log(`\nResults written to ${outFile}`);
}
main();
//# sourceMappingURL=simulation.js.map