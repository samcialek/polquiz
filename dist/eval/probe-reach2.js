import { ARCHETYPES } from "../config/archetypes.js";
import { REPRESENTATIVE_QUESTIONS } from "../config/questions.representative.js";
import { CONTINUOUS_NODES, CATEGORICAL_NODES } from "../config/nodes.js";
import { applySingleChoiceAnswer, applySliderAnswer, applyAllocationAnswer, applyRankingAnswer, applyPairwiseAnswer, applyDualAxisAnswer, } from "../engine/update.js";
import { selectNextQuestion, isQuestionEligible } from "../engine/nextQuestion.js";
import { shouldStop, resetSimilarityCache } from "../engine/stopRule.js";
import { archetypeDistance } from "../engine/archetypeDistance.js";
import { createRng } from "./rng.js";
function createInitialState() {
    const continuous = {};
    for (const nodeId of CONTINUOUS_NODES) {
        continuous[nodeId] = { posDist: [0.2, 0.2, 0.2, 0.2, 0.2], salDist: [0.25, 0.25, 0.25, 0.25], touches: 0, touchTypes: new Set(), status: "unknown" };
    }
    const categorical = {};
    for (const nodeId of CATEGORICAL_NODES) {
        categorical[nodeId] = { catDist: [1 / 6, 1 / 6, 1 / 6, 1 / 6, 1 / 6, 1 / 6], salDist: [0.25, 0.25, 0.25, 0.25], touches: 0, touchTypes: new Set(), status: "unknown" };
    }
    return { answers: {}, continuous, categorical, trbAnchor: { dist: Array(9).fill(1 / 9), touches: 0 }, archetypeDistances: {}, currentLeader: undefined, consecutiveLeadCount: 0 };
}
function pickRandom(arr, rng) { return arr[Math.floor(rng() * arr.length)]; }
function shuffle(arr, rng) { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
} return a; }
function randomAllocation(names, rng) {
    const raw = names.map(() => -Math.log(Math.max(1e-9, rng())));
    const sum = raw.reduce((a, b) => a + b, 0);
    const alloc = {};
    for (let i = 0; i < names.length; i++)
        alloc[names[i]] = Math.round((raw[i] / sum) * 100);
    const total = Object.values(alloc).reduce((a, b) => a + b, 0);
    if (total !== 100) {
        const keys = Object.keys(alloc);
        alloc[keys[0]] = alloc[keys[0]] + (100 - total);
    }
    return alloc;
}
function applyRandomAnswer(q, s, rng) {
    switch (q.uiType) {
        case "single_choice":
        case "multi":
        case "conjoint": {
            if (!q.optionEvidence)
                return false;
            const keys = Object.keys(q.optionEvidence);
            if (!keys.length)
                return false;
            applySingleChoiceAnswer(s, q, pickRandom(keys, rng));
            return true;
        }
        case "slider": {
            if (!q.sliderMap)
                return false;
            const buckets = Object.keys(q.sliderMap);
            if (!buckets.length)
                return false;
            const bucket = pickRandom(buckets, rng);
            const parts = bucket.split("-").map(Number);
            const lo = parts[0] ?? 0, hi = parts[1] ?? 100;
            applySliderAnswer(s, q, Math.round(lo + rng() * (hi - lo)));
            return true;
        }
        case "allocation": {
            if (!q.allocationMap)
                return false;
            const names = Object.keys(q.allocationMap);
            if (!names.length)
                return false;
            applyAllocationAnswer(s, q, randomAllocation(names, rng));
            return true;
        }
        case "ranking":
        case "best_worst":
        case "priority_sort": {
            if (!q.rankingMap)
                return false;
            const items = Object.keys(q.rankingMap);
            if (!items.length)
                return false;
            applyRankingAnswer(s, q, shuffle(items, rng));
            return true;
        }
        case "pairwise": {
            if (!q.pairMaps)
                return false;
            const answers = {};
            for (const [pairId, options] of Object.entries(q.pairMaps)) {
                const choices = Object.keys(options);
                if (!choices.length)
                    continue;
                answers[pairId] = pickRandom(choices, rng);
            }
            if (!Object.keys(answers).length)
                return false;
            applyPairwiseAnswer(s, q, answers);
            return true;
        }
        case "dual_axis": {
            if (!q.dualAxisMap)
                return false;
            applyDualAxisAnswer(s, q, { x: rng(), y: rng() });
            return true;
        }
    }
    return false;
}
// Probe one run
const rng = createRng(1);
const active = ARCHETYPES.filter(a => a.active !== false);
const s = createInitialState();
const answered = new Set();
let qa = 0;
resetSimilarityCache();
const watchNode = "MAT";
let matTouches = 0;
console.log(`Initial MAT posDist: ${s.continuous[watchNode].posDist.map(v => v.toFixed(3)).join(",")}`);
for (let i = 0; i < 65; i++) {
    const avail = REPRESENTATIVE_QUESTIONS.filter(q => !answered.has(q.id) && q.touchProfile.length > 0 && isQuestionEligible(s, q));
    const nextQ = selectNextQuestion(s, avail, active);
    if (!nextQ)
        break;
    const touchesMat = nextQ.touchProfile.some(t => t.kind === "continuous" && t.node === watchNode && t.role !== "salience");
    const applied = applyRandomAnswer(nextQ, s, rng);
    answered.add(nextQ.id);
    if (!applied)
        continue;
    qa++;
    if (touchesMat) {
        matTouches++;
        const pd = s.continuous[watchNode].posDist;
        console.log(`Q${nextQ.id} [${nextQ.uiType}] MAT.posDist = [${pd.map(v => v.toFixed(3)).join(",")}]  Σ=${pd.reduce((a, b) => a + b, 0).toFixed(3)}`);
    }
    for (const a of active)
        s.archetypeDistances[a.id] = archetypeDistance(s, a);
    if (qa >= 25 && shouldStop(s, active))
        break;
}
console.log(`\nFinal qa=${qa}, MAT touches=${matTouches}`);
console.log(`Final MAT posDist: ${s.continuous[watchNode].posDist.map(v => v.toFixed(4)).join(",")}`);
const expPos = s.continuous[watchNode].posDist.reduce((sum, p, i) => sum + (i + 1) * p, 0) / s.continuous[watchNode].posDist.reduce((a, b) => a + b, 0);
console.log(`E[MAT.pos] = ${expPos.toFixed(4)}`);
//# sourceMappingURL=probe-reach2.js.map