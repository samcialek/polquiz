/**
 * PRISM Quiz Engine — Browser API
 *
 * Self-contained browser-facing API that wraps the engine.
 * Bundled as an IIFE and exposed as window.PrismEngine.
 */
import { ARCHETYPES } from "../config/archetypes.js";
import { REPRESENTATIVE_QUESTIONS } from "../config/questions.representative.js";
import { CONTINUOUS_NODES, CATEGORICAL_NODES } from "../config/nodes.js";
import { applySingleChoiceAnswer, applySliderAnswer, applyAllocationAnswer, applyRankingAnswer, applyPairwiseAnswer, } from "../engine/update.js";
import { selectNextQuestion, isQuestionEligible } from "../engine/nextQuestion.js";
import { shouldStop } from "../engine/stopRule.js";
import { archetypeDistance } from "../engine/archetypeDistance.js";
import { resetSimilarityCache } from "../engine/stopRule.js";
import { FIXED_16 } from "../engine/config.js";
// ---------------------------------------------------------------------------
// Internal state
// ---------------------------------------------------------------------------
let _state = null;
let _archetypes = [];
let _questions = [];
let _questionsById = new Map();
// ---------------------------------------------------------------------------
// State initialization (mirrors simulation.ts createInitialState)
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
// Posterior update (mirrors simulation.ts updatePosteriors)
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
    // Adaptive temperature: starts warm (0.12), cools to 0.04 by question 40
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
// ---------------------------------------------------------------------------
// Convert internal QuestionDef to browser-friendly QuizQuestion
// ---------------------------------------------------------------------------
function toQuizQuestion(q) {
    const out = {
        id: q.id,
        promptShort: q.promptShort,
        promptFull: q.promptFull,
        uiType: q.uiType,
        section: q.section,
    };
    if (q.optionLabels) {
        out.optionLabels = q.optionLabels;
    }
    if (q.optionEvidence) {
        out.options = Object.keys(q.optionEvidence);
    }
    if (q.uiType === "slider") {
        out.slider = { min: 0, max: 100 };
        if (q.sliderMap) {
            const keys = Object.keys(q.sliderMap);
            if (keys.length > 0) {
                const ranges = keys.map(k => k.split("-").map(Number));
                const allMin = Math.min(...ranges.map(r => r[0] ?? 0));
                const allMax = Math.max(...ranges.map(r => r[1] ?? 100));
                out.slider = { min: allMin, max: allMax };
            }
        }
    }
    if (q.allocationMap) {
        out.allocationBuckets = Object.keys(q.allocationMap);
    }
    if (q.rankingMap) {
        out.rankingItems = Object.keys(q.rankingMap);
    }
    if (q.pairMaps) {
        out.pairIds = Object.keys(q.pairMaps);
    }
    if (q.bestWorstMap) {
        out.bestWorstItems = Object.keys(q.bestWorstMap);
    }
    return out;
}
// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------
/**
 * Initialize a new quiz session.
 * Resets all state and loads archetypes + questions.
 */
export function initQuiz() {
    _archetypes = ARCHETYPES;
    _questions = REPRESENTATIVE_QUESTIONS.filter(q => q.touchProfile.length > 0);
    _questionsById = new Map(_questions.map(q => [q.id, q]));
    resetSimilarityCache();
    _state = createInitialState(_archetypes);
}
/**
 * Get the next question the engine wants to ask.
 * Returns null if no more questions are available.
 */
export function getNextQuestion() {
    if (!_state)
        throw new Error("Call initQuiz() first");
    const nAnswered = Object.keys(_state.answers).length;
    // Phase 1: ask FIXED_16 in order
    if (nAnswered < FIXED_16.length) {
        const nextId = FIXED_16[nAnswered];
        const q = _questionsById.get(nextId);
        if (q)
            return toQuizQuestion(q);
    }
    // Adaptive selection
    const available = _questions.filter(q => !(q.id in _state.answers) && isQuestionEligible(_state, q));
    const next = selectNextQuestion(_state, available, _archetypes);
    return next ? toQuizQuestion(next) : null;
}
/**
 * Submit an answer for a question.
 *
 * @param questionId - The numeric question ID
 * @param answer - The answer value. Type depends on uiType:
 *   - single_choice / multi: string (option key)
 *   - slider: number (raw value)
 *   - allocation: Record<string, number> (bucket → amount)
 *   - ranking: string[] (ordered items, best first)
 *   - pairwise: Record<string, string> (pairId → chosen option)
 *   - best_worst: { best: string; worst: string }
 */
export function submitAnswer(questionId, answer) {
    if (!_state)
        throw new Error("Call initQuiz() first");
    const q = _questionsById.get(questionId);
    if (!q)
        throw new Error(`Unknown question ID: ${questionId}`);
    switch (q.uiType) {
        case "single_choice":
        case "multi":
            applySingleChoiceAnswer(_state, q, answer);
            break;
        case "slider":
            applySliderAnswer(_state, q, answer);
            break;
        case "allocation":
            applyAllocationAnswer(_state, q, answer);
            break;
        case "ranking":
            applyRankingAnswer(_state, q, answer);
            break;
        case "pairwise":
            applyPairwiseAnswer(_state, q, answer);
            break;
        case "best_worst": {
            // Best-worst is treated as a ranking: [best, ...middle, worst]
            const bw = answer;
            if (q.bestWorstMap) {
                const allItems = Object.keys(q.bestWorstMap);
                const middle = allItems.filter(i => i !== bw.best && i !== bw.worst);
                applyRankingAnswer(_state, q, [bw.best, ...middle, bw.worst]);
            }
            break;
        }
    }
    // Update posteriors after each answer
    updatePosteriors(_state, _archetypes);
}
/**
 * Get current quiz progress.
 */
export function getProgress() {
    if (!_state)
        throw new Error("Call initQuiz() first");
    const nAnswered = Object.keys(_state.answers).length;
    // Estimate total questions based on current phase
    let estimatedTotal;
    if (nAnswered < 16) {
        estimatedTotal = 40; // early estimate
    }
    else {
        // Refine based on convergence rate
        const topPosterior = Math.max(...Object.values(_state.archetypePosterior));
        if (topPosterior > 0.5)
            estimatedTotal = Math.max(nAnswered + 3, 30);
        else if (topPosterior > 0.3)
            estimatedTotal = Math.max(nAnswered + 8, 35);
        else
            estimatedTotal = Math.max(nAnswered + 15, 45);
    }
    // Top archetypes
    const sorted = Object.entries(_state.archetypePosterior)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);
    const topArchetypes = sorted.map(([id, posterior]) => {
        const arch = _archetypes.find(a => a.id === id);
        return { id, name: arch?.name ?? "Unknown", posterior };
    });
    // Phase
    let phase;
    if (nAnswered < 16)
        phase = "salience";
    else if (nAnswered < 28)
        phase = "discriminate";
    else
        phase = "converge";
    return {
        questionsAnswered: nAnswered,
        estimatedTotal,
        topArchetypes,
        confidence: sorted[0]?.[1] ?? 0,
        phase,
    };
}
/**
 * Check whether the engine has enough data to produce a result.
 */
export function isComplete() {
    if (!_state)
        return false;
    const nAnswered = Object.keys(_state.answers).length;
    if (nAnswered < 20)
        return false; // absolute minimum
    return shouldStop(_state, _archetypes);
}
/**
 * Get final quiz results.
 * Can be called at any time, but results are most meaningful after isComplete() returns true.
 */
export function getResults() {
    if (!_state)
        throw new Error("Call initQuiz() first");
    const sorted = Object.entries(_state.archetypePosterior)
        .sort((a, b) => b[1] - a[1]);
    const top5 = sorted.slice(0, 5).map(([id, posterior]) => {
        const arch = _archetypes.find(a => a.id === id);
        return {
            id,
            name: arch.name,
            tier: arch.tier,
            posterior,
            distance: archetypeDistance(_state, arch),
        };
    });
    // Detect family/subtype when top-2 are near-neighbors
    let family;
    if (top5.length >= 2) {
        const gap = top5[0].posterior - top5[1].posterior;
        if (gap < 0.03) {
            // Find shared words in names to create a family label
            const words1 = top5[0].name.split(/[\s-]+/);
            const words2 = top5[1].name.split(/[\s-]+/);
            const shared = words1.filter(w => words2.includes(w) && w.length > 2);
            const familyLabel = shared.length > 0
                ? shared.join(" ") + " Family"
                : `${top5[0].name} / ${top5[1].name}`;
            family = {
                isFamily: true,
                familyLabel,
                members: [top5[0], top5[1]],
            };
        }
    }
    return {
        match: top5[0],
        top5,
        questionsAnswered: Object.keys(_state.answers).length,
        confidence: top5[0]?.posterior ?? 0,
        family,
    };
}
/**
 * Get the full list of question IDs available in the engine.
 */
export function getQuestionIds() {
    return _questions.map(q => q.id);
}
/**
 * Get the raw internal QuestionDef for a given ID (for advanced use).
 */
export function getQuestionDef(questionId) {
    return _questionsById.get(questionId);
}
/**
 * Get the number of archetypes.
 */
export function getArchetypeCount() {
    return _archetypes.length;
}
/**
 * Get the respondent's current node state for results display.
 * Returns continuous node expected values and categorical distributions.
 */
export function getRespondentState() {
    if (!_state)
        return null;
    const continuous = {};
    for (const [nodeId, node] of Object.entries(_state.continuous)) {
        // Compute expected position (weighted mean of posDist)
        const expectedPos = node.posDist.reduce((sum, p, i) => sum + p * (i + 1), 0);
        // Compute expected salience
        const salience = node.salDist.reduce((sum, p, i) => sum + p * i, 0);
        continuous[nodeId] = { expectedPos, salience, touches: node.touches };
    }
    const categorical = {};
    for (const [nodeId, node] of Object.entries(_state.categorical)) {
        const salience = node.salDist.reduce((sum, p, i) => sum + p * i, 0);
        categorical[nodeId] = { catDist: [...node.catDist], salience, touches: node.touches };
    }
    return { continuous, categorical };
}
//# sourceMappingURL=api.js.map