/**
 * PRISM Quiz Engine — Browser API
 *
 * Self-contained browser-facing API that wraps the engine.
 * Bundled as an IIFE and exposed as window.PrismEngine.
 */
import { ARCHETYPES } from "../config/archetypes.js";
import { REPRESENTATIVE_QUESTIONS } from "../config/questions.representative.js";
import { CONTINUOUS_NODES, CATEGORICAL_NODES } from "../config/nodes.js";
import { applySingleChoiceAnswer, applyMultiAnswer, applySliderAnswer, applyAllocationAnswer, applyRankingAnswer, applyPairwiseAnswer, applyBestWorstSalience, applyPrioritySort, applyDualAxisAnswer, mirrorMorSalToIntensity, } from "../engine/update.js";
import { multiplyAndNormalize, mkInitialMorBoundaries, MOR_BOUNDARY_ORDER } from "../engine/math.js";
import { selectNextQuestion, isQuestionEligible } from "../engine/nextQuestion.js";
import { selectNextQuestionEIG, shouldStopEIG } from "../engine/selectorEIG.js";
import { shouldStop } from "../engine/stopRule.js";
import { archetypeDistance } from "../engine/archetypeDistance.js";
import { resetSimilarityCache } from "../engine/stopRule.js";
import { buildArchetypeFamilies } from "../engine/archetypeFamilies.js";
import { SALIENCE_ROUTER_FIXED } from "../engine/config.js";
import { getTopSalientNodes, selectTopKDrillQuestion, } from "../engine/topKDrill.js";
import { resolveIdentityPrimary } from "../identity/resolveIdentityPrimary.js";
import { computeEngagementLabel } from "../engine/engagementLabel.js";
import { respondentSignatureFromState } from "../engine/respondentSignature.js";
import { ELECTIONS } from "../historical/candidates.js";
import { getContext } from "../historical/contexts.js";
import { predictVote } from "../historical/respondentVoteChoice.js";
// ---------------------------------------------------------------------------
// Bundle version marker (PR 1 — trace reliability). Stamped onto every dump
// so older dumps can be flagged stale relative to engine fixes (Q200/Q211/Q212
// metadata hooks, applyBestWorstSalience trbAnchor, top5 in results, etc.).
// Bump whenever the engine changes meaningfully — keep in sync with the
// quiz-v2-live.html cache-buster string.
// ---------------------------------------------------------------------------
export const BUNDLE_VERSION = "20260429-pr3d-q207-pro";
// ---------------------------------------------------------------------------
// Internal state
// ---------------------------------------------------------------------------
let _state = null;
let _archetypes = [];
let _activeArchetypes = [];
let _familyIndex = null;
let _questions = [];
let _questionsById = new Map();
const _ratioBoosts = new Map();
let _demographics = null;
// Ratio → salience likelihood mapping. Replaced 2026-04-24 per ADR-008
// with log-scaled buckets and harder cap. Previous version mapped any
// ratio >= 4 to maximum salience (0.60 on sal=3), which meant a single
// error-tradeoff with ratio=100 produced the same salience push as ratio=4
// but the user's *intent* was very different. New mapping uses 4 discrete
// log-scale buckets: 1.5-2 (mild), 2-5 (moderate), 5-25 (strong), 25+
// (very strong). Caps the maximum sal-3 mass at 0.50 so a single ratio-
// follow-up cannot dominate a node's salience profile.
function ratioToSalienceDist(ratio) {
    if (ratio >= 25)
        return [0.04, 0.14, 0.32, 0.50]; // very strong (was 0.60)
    if (ratio >= 5)
        return [0.08, 0.20, 0.36, 0.36]; // strong
    if (ratio >= 2)
        return [0.14, 0.28, 0.36, 0.22]; // moderate
    return [0.22, 0.32, 0.30, 0.16]; // mild
}
function applyStoredRatioBoost(q) {
    if (!_state)
        return;
    const ratio = _ratioBoosts.get(q.id);
    if (!ratio)
        return;
    const salLikelihood = ratioToSalienceDist(ratio);
    for (const touch of q.touchProfile) {
        if (touch.role !== "salience")
            continue;
        if (touch.kind === "continuous" && touch.node in _state.continuous) {
            const node = _state.continuous[touch.node];
            node.salDist = multiplyAndNormalize(node.salDist, salLikelihood);
            // 6.E.2b bridge: ratio-boost MOR salience → intensity. This sits
            // outside update.ts (browser-only post-answer hook) so it imports
            // the bridge helper directly to keep the mirror coverage uniform.
            if (touch.node === "MOR")
                mirrorMorSalToIntensity(_state, salLikelihood, 1.0);
        }
        else if (touch.kind === "categorical" && touch.node in _state.categorical) {
            const node = _state.categorical[touch.node];
            node.salDist = multiplyAndNormalize(node.salDist, salLikelihood);
        }
    }
}
const _snapshots = [];
function deepCopyState(state) {
    const copy = {
        answers: { ...state.answers },
        continuous: {},
        categorical: {},
        trbAnchor: {
            dist: [...state.trbAnchor.dist],
            touches: state.trbAnchor.touches,
        },
        archetypeDistances: { ...state.archetypeDistances },
        currentLeader: state.currentLeader,
        consecutiveLeadCount: state.consecutiveLeadCount,
        // Metadata fields written by Q200/Q211/Q212 update hooks. Snapshot must
        // round-trip these or back-navigation will silently drop election-alignment
        // signals that the user already provided.
        partyID: state.partyID ?? null,
        strategicVoting: state.strategicVoting,
        dominantNode: state.dominantNode ?? null,
        negativeParties: state.negativeParties
            ? new Set(state.negativeParties)
            : undefined,
    };
    for (const nodeId of CONTINUOUS_NODES) {
        const src = state.continuous[nodeId];
        copy.continuous[nodeId] = {
            posDist: [...src.posDist],
            salDist: [...src.salDist],
            touches: src.touches,
            touchTypes: new Set(src.touchTypes),
            status: src.status,
        };
    }
    for (const nodeId of CATEGORICAL_NODES) {
        const src = state.categorical[nodeId];
        copy.categorical[nodeId] = {
            catDist: [...src.catDist],
            salDist: [...src.salDist],
            touches: src.touches,
            touchTypes: new Set(src.touchTypes),
            status: src.status,
        };
    }
    // 6.E.2b: deep-copy morBoundaries (Set + nested objects). Snapshot must
    // round-trip the module so back-navigation restores the moral-circle
    // contribution to archetypeDistance correctly.
    if (state.morBoundaries) {
        copy.morBoundaries = {
            boundaries: { ...state.morBoundaries.boundaries },
            intensity: state.morBoundaries.intensity,
            touches: { ...state.morBoundaries.touches },
            touchTypes: new Set(state.morBoundaries.touchTypes),
            status: state.morBoundaries.status,
        };
    }
    return copy;
}
// ---------------------------------------------------------------------------
// State initialization (mirrors simulation.ts createInitialState)
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
        // 6.E.2b: initialize the compound moral-circle module per ADR-006.
        // Triggers archetypeDistance.ts's per-archetype gate to switch to the
        // morModule branch — the bridge in update.ts (committed in this same PR)
        // mirrors every legacy MOR/TRB/PF/trbAnchor write into this field so the
        // module ends the quiz meaningfully shifted from {boundaries: 0.5,
        // intensity: 0} rather than near-neutral.
        morBoundaries: mkInitialMorBoundaries(),
        archetypeDistances: {},
        currentLeader: undefined,
        consecutiveLeadCount: 0,
    };
}
// ---------------------------------------------------------------------------
// Distance update (Phase 3 Euclidean WTA scorer)
// ---------------------------------------------------------------------------
function updateDistances(state, archetypes) {
    let leaderId;
    let leaderDist = Infinity;
    for (const a of archetypes) {
        const dist = archetypeDistance(state, a);
        state.archetypeDistances[a.id] = dist;
        if (dist < leaderDist) {
            leaderDist = dist;
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
    if (q.dualAxisMap) {
        out.dualAxisMap = {
            node: q.dualAxisMap.node,
            xLow: [...q.dualAxisMap.xLow],
            xHigh: [...q.dualAxisMap.xHigh],
        };
    }
    if (q.strengthFollowUp) {
        out.strengthFollowUp = {
            kind: q.strengthFollowUp.kind,
            prompt: q.strengthFollowUp.prompt,
            labels: q.strengthFollowUp.labels ? { ...q.strengthFollowUp.labels } : undefined,
        };
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
        out.pairOptions = {};
        for (const [pairId, sides] of Object.entries(q.pairMaps)) {
            out.pairOptions[pairId] = Object.keys(sides);
        }
    }
    if (q.bestWorstMap) {
        out.bestWorstItems = Object.keys(q.bestWorstMap);
    }
    else if (q.uiType === "best_worst" && q.rankingMap) {
        // Q63 etc. store best_worst items in rankingMap (for applyRankingAnswer)
        out.bestWorstItems = Object.keys(q.rankingMap);
    }
    if (q.bwMaxPicks != null) {
        out.bwMaxPicks = q.bwMaxPicks;
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
// Identity-primary archetype IDs (Black Voter, White Grievance Voter,
// Evangelical Voter, LGBTQ Voter, Feminist Voter, Male Grievance Voter).
// These are excluded from the base distance match pool so the regular
// archetype scorer cannot return them — they fire only via
// resolveIdentityPrimary() when anchor + demographic + tribal/fusion +
// ideology-thinness gates all pass. See resolveIdentityPrimary.ts.
const IDENTITY_PRIMARY_IDS = new Set(["141", "142", "143", "144", "145", "146"]);
// Metadata-only opener questions. Their evidence is stored directly on
// state.partyID / strategicVoting / negativeParties via update.ts hooks rather
// than as touchProfile-driven Bayesian touches, so they have empty touchProfile
// arrays. They must still appear in _questionsById so getNextQuestion() can
// return them when the fixed-opener index reaches their slot.
const METADATA_QUESTION_IDS = new Set([200, 211, 212]);
export function initQuiz() {
    _archetypes = ARCHETYPES;
    _activeArchetypes = ARCHETYPES.filter(a => a.active !== false && !IDENTITY_PRIMARY_IDS.has(a.id));
    _familyIndex = buildArchetypeFamilies(_archetypes);
    _questions = REPRESENTATIVE_QUESTIONS.filter(q => q.touchProfile.length > 0 || METADATA_QUESTION_IDS.has(q.id));
    _questionsById = new Map(_questions.map(q => [q.id, q]));
    resetSimilarityCache();
    _state = createInitialState();
    _snapshots.length = 0; // Clear snapshot history on fresh quiz
    _ratioBoosts.clear();
    _demographics = null;
}
/**
 * Submit optional demographic answers for the identity-primary resolver.
 * Called once at end of quiz, only if the resolver has signaled that
 * demographic confirmation would refine the result.
 *
 * Recognized keys: demo_ethnicity, demo_gender, demo_religion, demo_lgbtq.
 * Other keys are stored but not consumed by the current resolver.
 */
export function submitDemographics(demographics) {
    _demographics = demographics;
}
/**
 * Inspect the identity-primary resolver gate without committing demographics.
 * Used by the UI to decide whether the demographic mini-block should render.
 * Returns the resolver result with `state: 'unresolved'` and reason codes
 * indicating which gates passed/failed. If demographic confirmation is the
 * only missing piece, the UI prompts; otherwise it skips.
 */
export function previewIdentityPrimary() {
    if (!_state)
        return null;
    const engagement = computeEngagementLabel(_state);
    return resolveIdentityPrimary(_state, engagement, null);
}
/**
 * Get the next question the engine wants to ask.
 * Returns null if no more questions are available.
 */
export function getNextQuestion() {
    if (!_state)
        throw new Error("Call initQuiz() first");
    // Phase 1: Salience-Router fixed front door (CORE_OPENER + UNIVERSAL_SCREENERS).
    // 15 questions in fixed order. CORE establishes salience for every node
    // and captures party/strategic-voting metadata. UNIVERSAL_SCREENERS give
    // every major node ≥ 1 light position read regardless of salience, so
    // even nodes the respondent doesn't care about have ground truth for
    // archetype distance. See engine/config.ts:SALIENCE_ROUTER_FIXED.
    for (const nextId of SALIENCE_ROUTER_FIXED) {
        if (nextId in _state.answers)
            continue;
        const q = _questionsById.get(nextId);
        if (q)
            return toQuizQuestion(q);
    }
    // Available pool for Phase 2-3 (already-answered + ineligible filtered out).
    const available = _questions.filter(q => !(q.id in _state.answers) && isQuestionEligible(_state, q));
    // Phase 2: TOP_K_DRILL. Identify the respondent's most-salient nodes
    // (top 2, plus a 3rd if close to 2nd) and force minimum 2 meaningful
    // position-touch questions per top-K node before falling through to
    // EIG_FILL. Skipped if no node clears the salience floor (e.g., a
    // respondent who marked everything low-salience).
    const topK = getTopSalientNodes(_state);
    if (topK.length > 0) {
        const drill = selectTopKDrillQuestion(_state, available, _questionsById, topK);
        if (drill)
            return toQuizQuestion(drill);
    }
    // Phase 3: EIG_FILL. Salience-weighted EIG selector handles remaining
    // capacity. Per-node touch caps (4 for top-K, 3 elsewhere) and
    // expectedSal ≥ 1.5 eligibility gate land in selectorEIG.ts (Phase 3 PR).
    const next = selectNextQuestionEIG(_state, available, _questionsById);
    return next ? toQuizQuestion(next) : null;
}
// Retained so the legacy archetype-discrimination selector can still be used
// by diagnostic scripts that import selectNextQuestion from here.
void selectNextQuestion;
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
    // Snapshot current state before applying answer (for back button)
    _snapshots.push({ state: deepCopyState(_state), questionId });
    const q = _questionsById.get(questionId);
    if (!q)
        throw new Error(`Unknown question ID: ${questionId}`);
    switch (q.uiType) {
        case "single_choice":
        case "conjoint":
            applySingleChoiceAnswer(_state, q, answer);
            applyStoredRatioBoost(q);
            break;
        case "multi":
            applyMultiAnswer(_state, q, Array.isArray(answer) ? answer : [answer]);
            applyStoredRatioBoost(q);
            break;
        case "dual_axis":
            applyDualAxisAnswer(_state, q, answer);
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
            const bw = answer;
            const bwItems = q.bestWorstMap ? Object.keys(q.bestWorstMap)
                : q.rankingMap ? Object.keys(q.rankingMap)
                    : [];
            if (bwItems.length === 0)
                break;
            const best = Array.isArray(bw.best) ? bw.best : [bw.best];
            const worst = Array.isArray(bw.worst) ? bw.worst : [bw.worst];
            if (Array.isArray(bw.best) || Array.isArray(bw.worst) || q.bestWorstMap) {
                // Top-N / bottom-N and explicit max-diff maps: per-item update.
                // Middle items stay neutral; they should not inherit arbitrary rank
                // evidence from object-key order.
                applyBestWorstSalience(_state, q, best, worst, bwItems);
            }
            else {
                // Legacy top-1 / bottom-1: flattened ranking [best, ...middle, worst].
                const middle = bwItems.filter(i => i !== best[0] && i !== worst[0]);
                applyRankingAnswer(_state, q, [best[0], ...middle, worst[0]]);
            }
            break;
        }
        case "priority_sort": {
            const placements = answer;
            const items = q.rankingMap ? Object.keys(q.rankingMap) : [];
            if (items.length === 0)
                break;
            applyPrioritySort(_state, q, placements, items);
            break;
        }
    }
    // Update distances after each answer
    updateDistances(_state, _activeArchetypes);
}
/**
 * Get current quiz progress.
 */
export function getProgress() {
    if (!_state)
        throw new Error("Call initQuiz() first");
    const nAnswered = Object.keys(_state.answers).length;
    const sorted = Object.entries(_state.archetypeDistances)
        .filter(([, d]) => Number.isFinite(d))
        .sort((a, b) => a[1] - b[1])
        .slice(0, 5);
    const dLeader = sorted[0]?.[1] ?? Infinity;
    const dSecond = sorted[1]?.[1] ?? Infinity;
    const gapRatio = Number.isFinite(dLeader) && dLeader > 0 && Number.isFinite(dSecond)
        ? Math.min(1, Math.max(0, (dSecond - dLeader) / dLeader))
        : 0;
    // Estimate total questions for the progress UI. The actual stop rule lives
    // in selectorEIG.ts and caps the live quiz at 35 questions.
    let estimatedTotal;
    if (nAnswered < 20) {
        estimatedTotal = 27;
    }
    else if (dLeader <= 6) {
        estimatedTotal = Math.max(nAnswered + 2, 25);
    }
    else if (dLeader <= 10) {
        estimatedTotal = Math.max(nAnswered + 4, 28);
    }
    else {
        estimatedTotal = Math.min(35, Math.max(nAnswered + 8, 33));
    }
    estimatedTotal = Math.min(35, estimatedTotal);
    const topArchetypes = sorted.map(([id, distance]) => {
        const arch = _archetypes.find(a => a.id === id);
        return { id, name: arch?.name ?? "Unknown", distance };
    });
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
        confidence: gapRatio,
        phase,
    };
}
/**
 * Check whether the engine has enough data to produce a result.
 */
export function isComplete() {
    if (!_state)
        return false;
    return shouldStopEIG(_state, _questionsById);
}
// Retained so diagnostic scripts can still invoke the legacy archetype-gap stop rule.
void shouldStop;
/**
 * Get final quiz results.
 * Can be called at any time, but results are most meaningful after isComplete() returns true.
 */
export function getResults() {
    if (!_state)
        throw new Error("Call initQuiz() first");
    const sorted = Object.entries(_state.archetypeDistances)
        .filter(([, d]) => Number.isFinite(d))
        .sort((a, b) => a[1] - b[1]);
    const top5 = sorted.slice(0, 5).map(([id, distance]) => {
        const arch = _archetypes.find(a => a.id === id);
        return {
            id,
            name: arch.name,
            tier: arch.tier,
            distance,
        };
    });
    const top3 = top5.slice(0, 3);
    // Family detection: runner-up ∈ leader's pre-computed family set
    let family;
    if (top3.length >= 2 && _familyIndex) {
        const leaderId = top3[0].id;
        const runnerUpId = top3[1].id;
        const leaderFamily = _familyIndex.familyOf[leaderId];
        if (leaderFamily && leaderFamily.has(runnerUpId)) {
            family = {
                isFamily: true,
                partnerId: runnerUpId,
                partnerName: top3[1].name,
            };
        }
    }
    const dLeader = top3[0]?.distance ?? Infinity;
    const dSecond = top3[1]?.distance ?? Infinity;
    const confidence = Number.isFinite(dLeader) && dLeader > 0 && Number.isFinite(dSecond)
        ? Math.min(1, Math.max(0, (dSecond - dLeader) / dLeader))
        : 0;
    const marginToRunnerUp = Number.isFinite(dSecond) ? (dSecond - dLeader) : 0;
    // Confidence band (ADR-008). Refuse to commit when the matcher has barely
    // separated the leader from the runner-up.
    const confidenceBand = confidence >= 0.05 ? "confident" :
        confidence >= 0.02 ? "cluster" : "uncertain";
    // Why-this-result diagnostics. Compute per-node distance contributions to
    // the winning archetype so the results page can explain WHICH dimensions
    // drove the classification.
    const diagnostics = computeWinnerDiagnostics(_state, top3[0]?.id);
    const engagement = computeEngagementLabel(_state);
    // Single-issue dominance detection (P3.6, ADR-009). If any non-SELF node's
    // E[sal] is both >= 2.7 AND > 2× the mean of others, flag as dominant.
    // Used by predictVote to amplify that node's contribution 2x — captures
    // voters whose politics is dominated by one issue.
    detectAndStoreDominantNode(_state);
    // Identity-primary overlay (ADR-006). Resolver gates on TRB/PF, ideology-
    // thinness, anchor dominance, and demographic confirmation. Returns null
    // unless all four pass. Base `match` is always populated independently.
    const identityResult = resolveIdentityPrimary(_state, engagement, _demographics);
    const identityPrimary = identityResult.state === "active" || identityResult.state === "dominant"
        ? identityResult
        : null;
    return {
        match: top3[0],
        top3,
        top5,
        questionsAnswered: Object.keys(_state.answers).length,
        confidence,
        confidenceBand,
        family,
        engagement,
        identityPrimary,
        diagnostics: {
            ...diagnostics,
            marginToRunnerUp,
        },
    };
}
// Single-issue dominance detector (P3.6, ADR-009). Sets state.dominantNode
// if one non-SELF node's E[sal] is >= 2.7 AND > 2× the mean of others.
function detectAndStoreDominantNode(state) {
    const nonSelfNodes = [
        "MAT", "CD", "CU", "MOR", "PRO", "COM", "ZS", "ONT_H", "ONT_S",
    ];
    const sals = [];
    for (const nid of nonSelfNodes) {
        const node = state.continuous[nid];
        if (!node)
            continue;
        sals.push({ nid, sal: node.salDist.reduce((s, p, i) => s + p * i, 0) });
    }
    for (const nid of ["EPS", "AES"]) {
        const node = state.categorical[nid];
        if (!node)
            continue;
        sals.push({ nid, sal: node.salDist.reduce((s, p, i) => s + p * i, 0) });
    }
    if (sals.length === 0) {
        state.dominantNode = null;
        return;
    }
    const top = sals.reduce((a, b) => a.sal > b.sal ? a : b);
    const others = sals.filter(s => s.nid !== top.nid);
    const othersMean = others.reduce((s, e) => s + e.sal, 0) / Math.max(1, others.length);
    state.dominantNode = (top.sal >= 2.7 && top.sal > 2 * othersMean) ? top.nid : null;
}
// Per-node contribution analyzer for ADR-008 diagnostics. For each node where
// the winner archetype is encoded, compute how much that node contributed to
// the (low) distance score. Nodes with low contribution = pulled toward
// winner. Nodes with high contribution = pushed away (mismatch).
function computeWinnerDiagnostics(state, winnerId) {
    if (!winnerId)
        return { pullingTowardWinner: [], pushingAwayFromWinner: [] };
    const arch = _archetypes.find(a => a.id === winnerId);
    if (!arch)
        return { pullingTowardWinner: [], pushingAwayFromWinner: [] };
    const items = [];
    for (const [nodeId, template] of Object.entries(arch.nodes)) {
        if (template.kind === "continuous") {
            const ns = state.continuous[nodeId];
            if (!ns)
                continue;
            const userPos = ns.posDist.reduce((s, p, i) => s + p * (i + 1), 0);
            const diff = userPos - template.pos;
            const userSal = ns.salDist.reduce((s, p, i) => s + p * i, 0);
            const archSal = template.sal ?? 1;
            const weight = (0.5 + archSal * 0.5) * (0.5 + userSal * 0.25);
            const contribution = weight * Math.abs(diff);
            items.push({ node: nodeId, contribution, userPos, archetypePos: template.pos });
        }
    }
    items.sort((a, b) => a.contribution - b.contribution);
    return {
        pullingTowardWinner: items.slice(0, 5),
        pushingAwayFromWinner: items.slice(-5).reverse(),
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
        const expectedPos = node.posDist.reduce((sum, p, i) => sum + p * (i + 1), 0);
        const salience = node.salDist.reduce((sum, p, i) => sum + p * i, 0);
        continuous[nodeId] = { expectedPos, salience, touches: node.touches, posDist: [...node.posDist] };
    }
    const categorical = {};
    for (const [nodeId, node] of Object.entries(_state.categorical)) {
        const salience = node.salDist.reduce((sum, p, i) => sum + p * i, 0);
        categorical[nodeId] = { catDist: [...node.catDist], salience, touches: node.touches };
    }
    // 6.E.2b: expose morBoundaries in the debug view (compound moral-circle
    // module per ADR-006). Includes derived measures so dumps + smokes can
    // verify the bridge actually moved the module away from its init.
    const mb = _state.morBoundaries;
    let boundaryLoad = 0;
    if (mb) {
        for (const k of MOR_BOUNDARY_ORDER) {
            if (mb.boundaries[k] > boundaryLoad)
                boundaryLoad = mb.boundaries[k];
        }
    }
    const morBoundaries = mb
        ? {
            boundaries: { ...mb.boundaries },
            intensity: mb.intensity,
            boundaryLoad,
            universalismScore: mb.intensity * (1 - boundaryLoad),
            boundednessScore: mb.intensity * boundaryLoad,
            touches: { ...mb.touches },
            touchTypeCount: mb.touchTypes.size,
            status: mb.status,
        }
        : null;
    return {
        continuous,
        categorical,
        trbAnchor: {
            dist: [..._state.trbAnchor.dist],
            touches: _state.trbAnchor.touches,
        },
        morBoundaries,
        partyID: _state.partyID ?? null,
        strategicVoting: _state.strategicVoting ?? false,
        negativeParties: _state.negativeParties ? [..._state.negativeParties] : [],
        dominantNode: _state.dominantNode ?? null,
        ratioBoosts: Object.fromEntries(Array.from(_ratioBoosts.entries()).map(([k, v]) => [String(k), v]))
    };
}
export function getIdentityPrimaryResult(demographics) {
    if (!_state)
        return null;
    const engagement = computeEngagementLabel(_state);
    return resolveIdentityPrimary(_state, engagement, demographics ?? null);
}
export function applyRatioBoost(questionId, ratio) {
    _ratioBoosts.set(questionId, ratio);
}
/**
 * Per-election vote prediction from the respondent's signature.
 * Runs era-weighted Euclidean distance against each election's candidates and
 * applies an engagement-driven clearing bar to decide vote vs abstain.
 * Independent of archetype classification — archetype is a label only.
 */
export function getElectionPredictions() {
    if (!_state)
        throw new Error("Call initQuiz() first");
    const sig = respondentSignatureFromState(_state);
    const engagement = computeEngagementLabel(_state);
    const out = [];
    for (const election of ELECTIONS) {
        const ctx = getContext(election.year);
        if (!ctx)
            continue;
        out.push(predictVote(sig, election.candidates, ctx, engagement.level, _state.partyID ?? null, _state.trbAnchor.dist, _state.negativeParties ?? null, _state.strategicVoting ?? false, _state.dominantNode ?? null));
    }
    return out;
}
/**
 * Check if the user can go back to the previous question.
 */
export function canGoBack() {
    return _snapshots.length > 0;
}
/**
 * Go back to the previous question by restoring the snapshot.
 * Returns the question ID that was undone (so UI can re-render that question).
 */
export function goBack() {
    if (_snapshots.length === 0)
        return null;
    const snapshot = _snapshots.pop();
    _state = snapshot.state;
    return snapshot.questionId;
}
//# sourceMappingURL=api.js.map