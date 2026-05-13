/**
 * Salience-separation diagnostic.
 *
 * The archetype-ID-match metric in earlier comparisons may be stricter than
 * the quiz's actual purpose. The user's stated objective is:
 *   1. Rule out sal=0 nodes (don't care about economics, etc.)
 *   2. Then estimate position on nodes where sal >= 1 (they DO care)
 *
 * This diagnostic measures directly whether either engine achieves that:
 *   - For each (archetype, node), bucket by target.sal ∈ {0, 1, 2, 3}
 *   - Observe each engine's final E[sal] for that bucket
 *   - Observe each engine's final E[pos] vs target.pos, weighted by target.sal
 *     (position accuracy should matter more on nodes the person cares about)
 *
 * Salience-classification test: if we threshold at observed_sal < 0.5 as
 * "rule this node out," how often is each engine right about target.sal=0?
 * How often does each engine correctly flag target.sal=3 as "cares a lot"?
 *
 * Output: results/architecture/salience-separation.md
 */
import * as fs from "fs";
import * as path from "path";
import { ARCHETYPES } from "../config/archetypes.js";
import { REPRESENTATIVE_QUESTIONS } from "../config/questions.representative.js";
import { CONTINUOUS_NODES, CATEGORICAL_NODES } from "../config/nodes.js";
import { applySingleChoiceAnswer, applySliderAnswer, applyAllocationAnswer, applyRankingAnswer, applyPairwiseAnswer, applyDualAxisAnswer, } from "../engine/update.js";
import { applySingleChoiceAnswerAvg, applySliderAnswerAvg, applyAllocationAnswerAvg, applyRankingAnswerAvg, applyPairwiseAnswerAvg, applyDualAxisAnswerAvg, } from "../engine/updateAvg.js";
import { selectNextQuestion, isQuestionEligible } from "../engine/nextQuestion.js";
import { resetSimilarityCache } from "../engine/stopRule.js";
import { archetypeDistance } from "../engine/archetypeDistance.js";
import { createInitialStateAvg, getPos, getSal } from "../engine/stateAvg.js";
// ---------------------------------------------------------------------------
// Score helpers + state init (same as compareDeep)
// ---------------------------------------------------------------------------
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
                score += (upd.sal[t.sal ?? 0] ?? 0) * 0.5;
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
                score += (upd.sal[t.sal ?? 0] ?? 0) * 0.5;
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
            const scalar = typeof s === "number" ? s : 0;
            score += ((t.pos - 3) / 2) * scalar;
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
function apply(a, q, bayes, avg) {
    switch (q.uiType) {
        case "single_choice":
        case "multi":
        case "conjoint": {
            if (!q.optionEvidence)
                return false;
            const opts = Object.keys(q.optionEvidence);
            if (!opts.length)
                return false;
            let best = opts[0], bs = -Infinity;
            for (const o of opts) {
                const s = scoreOptionEvidence(a, q.optionEvidence[o]);
                if (s > bs) {
                    bs = s;
                    best = o;
                }
            }
            applySingleChoiceAnswer(bayes, q, best);
            applySingleChoiceAnswerAvg(avg, q, best);
            return true;
        }
        case "slider": {
            if (!q.sliderMap)
                return false;
            const bks = Object.keys(q.sliderMap);
            if (!bks.length)
                return false;
            let best = bks[0], bs = -Infinity;
            for (const b of bks) {
                const s = scoreOptionEvidence(a, q.sliderMap[b]);
                if (s > bs) {
                    bs = s;
                    best = b;
                }
            }
            const p = best.split("-").map(Number);
            const mid = Math.round(((p[0] ?? 0) + (p[1] ?? 100)) / 2);
            applySliderAnswer(bayes, q, mid);
            applySliderAnswerAvg(avg, q, mid);
            return true;
        }
        case "allocation": {
            if (!q.allocationMap)
                return false;
            const names = Object.keys(q.allocationMap);
            if (!names.length)
                return false;
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
                const t = a.nodes[n];
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
            applyAllocationAnswer(bayes, q, alloc);
            applyAllocationAnswerAvg(avg, q, alloc);
            return true;
        }
        case "ranking":
        case "best_worst": {
            const map = q.rankingMap ?? q.bestWorstMap;
            if (!map)
                return false;
            const items = Object.keys(map);
            if (!items.length)
                return false;
            const scored = items.map(i => ({ i, s: scoreRankingItem(a, map[i]) }));
            scored.sort((x, y) => y.s - x.s);
            const r = scored.map(x => x.i);
            applyRankingAnswer(bayes, q, r);
            applyRankingAnswerAvg(avg, q, r);
            return true;
        }
        case "pairwise": {
            if (!q.pairMaps)
                return false;
            const answers = {};
            for (const [pid, opts] of Object.entries(q.pairMaps)) {
                let bc = "", bs = -Infinity;
                for (const [c, m] of Object.entries(opts)) {
                    const s = scorePairOption(a, m);
                    if (s > bs) {
                        bs = s;
                        bc = c;
                    }
                }
                if (bc)
                    answers[pid] = bc;
            }
            if (!Object.keys(answers).length)
                return false;
            applyPairwiseAnswer(bayes, q, answers);
            applyPairwiseAnswerAvg(avg, q, answers);
            return true;
        }
        case "dual_axis": {
            if (!q.dualAxisMap)
                return false;
            const t = a.nodes[q.dualAxisMap.node];
            if (!t || t.kind !== "continuous")
                return false;
            const x = (t.pos - 1) / 4, y = (t.sal ?? 0) / 3;
            applyDualAxisAnswer(bayes, q, { x, y });
            applyDualAxisAnswerAvg(avg, q, { x, y });
            return true;
        }
    }
    return false;
}
function bayesExpectedSal(state, nodeId) {
    const n = nodeId in state.continuous
        ? state.continuous[nodeId]
        : state.categorical[nodeId];
    return n.salDist[0] * 0 + n.salDist[1] * 1 + n.salDist[2] * 2 + n.salDist[3] * 3;
}
function bayesExpectedPos(state, nodeId) {
    const n = state.continuous[nodeId];
    return n.posDist[0] * 1 + n.posDist[1] * 2 + n.posDist[2] * 3 + n.posDist[3] * 4 + n.posDist[4] * 5;
}
// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
const active = ARCHETYPES.filter(a => a.active !== false);
console.log(`Running salience-separation diagnostic on ${active.length} archetypes`);
const obs = [];
for (const target of active) {
    resetSimilarityCache();
    const bayes = createInitialState();
    const avg = createInitialStateAvg();
    const answered = new Set();
    for (let i = 0; i < 55; i++) {
        const available = REPRESENTATIVE_QUESTIONS.filter(q => !answered.has(q.id) && q.touchProfile.length > 0 && isQuestionEligible(bayes, q));
        const nextQ = selectNextQuestion(bayes, available, active);
        if (!nextQ)
            break;
        apply(target, nextQ, bayes, avg);
        answered.add(nextQ.id);
        for (const a of active)
            bayes.archetypeDistances[a.id] = archetypeDistance(bayes, a);
        bayes.currentLeader = Object.entries(bayes.archetypeDistances)
            .filter(([, d]) => Number.isFinite(d))
            .sort((a, b) => a[1] - b[1])[0]?.[0];
    }
    // collect observations
    for (const nodeId of CONTINUOUS_NODES) {
        const t = target.nodes[nodeId];
        if (!t || t.kind !== "continuous")
            continue;
        obs.push({
            targetId: target.id, nodeId, kind: "continuous",
            targetSal: t.sal ?? 0, targetPos: t.pos,
            bayesSal: bayesExpectedSal(bayes, nodeId),
            avgSal: getSal(avg, nodeId),
            bayesPos: bayesExpectedPos(bayes, nodeId),
            avgPos: getPos(avg, nodeId),
            touches: avg.continuous[nodeId].touches,
        });
    }
    for (const nodeId of CATEGORICAL_NODES) {
        const t = target.nodes[nodeId];
        if (!t || t.kind !== "categorical")
            continue;
        obs.push({
            targetId: target.id, nodeId, kind: "categorical",
            targetSal: t.sal,
            bayesSal: bayesExpectedSal(bayes, nodeId),
            avgSal: getSal(avg, nodeId),
            touches: avg.categorical[nodeId].touches,
        });
    }
}
console.log(`Collected ${obs.length} (archetype × node) observations`);
function stats(xs) {
    if (xs.length === 0)
        return { min: NaN, p5: NaN, mean: NaN, p50: NaN, p95: NaN, max: NaN };
    const s = [...xs].sort((a, b) => a - b);
    const q = (p) => s[Math.min(s.length - 1, Math.floor(p * s.length / 100))];
    return {
        min: s[0], p5: q(5), mean: xs.reduce((a, b) => a + b, 0) / xs.length,
        p50: q(50), p95: q(95), max: s[s.length - 1],
    };
}
function fmt(x) { return Number.isFinite(x) ? x.toFixed(2) : "—"; }
// Salience separation by target bucket
let md = "# Salience-separation diagnostic — does either engine correctly rule out sal=0?\n\n";
md += `Generated: ${new Date().toISOString()}\n\n`;
md += "Setup: lockstep runs, archetype-optimal answers. At end of each run, extract observed E[sal] for each (archetype, node). Group by target.sal bucket. If an engine is doing the job Sam describes (\"rule out nodes where they don't care\"), target.sal=0 buckets should have observed sal near 0 and target.sal=3 near 3.\n\n";
md += "## Observed sal by target bucket — Bayesian\n\n";
md += "| target.sal | n | min | p5 | mean | p50 | p95 | max |\n";
md += "|-----------:|--:|----:|---:|-----:|----:|----:|----:|\n";
for (let b = 0; b <= 3; b++) {
    const xs = obs.filter(o => o.targetSal === b).map(o => o.bayesSal);
    const s = stats(xs);
    md += `| ${b} | ${xs.length} | ${fmt(s.min)} | ${fmt(s.p5)} | ${fmt(s.mean)} | ${fmt(s.p50)} | ${fmt(s.p95)} | ${fmt(s.max)} |\n`;
}
md += "\n";
md += "## Observed sal by target bucket — Averaging\n\n";
md += "| target.sal | n | min | p5 | mean | p50 | p95 | max |\n";
md += "|-----------:|--:|----:|---:|-----:|----:|----:|----:|\n";
for (let b = 0; b <= 3; b++) {
    const xs = obs.filter(o => o.targetSal === b).map(o => o.avgSal);
    const s = stats(xs);
    md += `| ${b} | ${xs.length} | ${fmt(s.min)} | ${fmt(s.p5)} | ${fmt(s.mean)} | ${fmt(s.p50)} | ${fmt(s.p95)} | ${fmt(s.max)} |\n`;
}
md += "\n";
// Separation ratio
const bayesSal0Mean = stats(obs.filter(o => o.targetSal === 0).map(o => o.bayesSal)).mean;
const bayesSal3Mean = stats(obs.filter(o => o.targetSal === 3).map(o => o.bayesSal)).mean;
const avgSal0Mean = stats(obs.filter(o => o.targetSal === 0).map(o => o.avgSal)).mean;
const avgSal3Mean = stats(obs.filter(o => o.targetSal === 3).map(o => o.avgSal)).mean;
md += "## Separation — mean observed sal when target is 0 vs 3\n\n";
md += `- **Bayesian:** target=0 bucket observed sal mean ${fmt(bayesSal0Mean)}, target=3 bucket observed sal mean ${fmt(bayesSal3Mean)}. Gap = ${fmt(bayesSal3Mean - bayesSal0Mean)}.\n`;
md += `- **Averaging:** target=0 bucket observed sal mean ${fmt(avgSal0Mean)}, target=3 bucket observed sal mean ${fmt(avgSal3Mean)}. Gap = ${fmt(avgSal3Mean - avgSal0Mean)}.\n\n`;
// Classification accuracy: threshold observed_sal at 0.5 and 2.0 to decide
// "doesn't care" vs "cares a lot"
function classify(salObs) {
    if (salObs < 0.5)
        return "none";
    if (salObs < 1.5)
        return "low";
    if (salObs < 2.5)
        return "mid";
    return "high";
}
function targetBucket(s) {
    if (s === 0)
        return "none";
    if (s === 1)
        return "low";
    if (s === 2)
        return "mid";
    return "high";
}
let bayesSalAgree = 0, avgSalAgree = 0;
let bayesSalNoneCorrect = 0, bayesSalNoneTotal = 0;
let avgSalNoneCorrect = 0, avgSalNoneTotal = 0;
let bayesSalHighCorrect = 0, bayesSalHighTotal = 0;
let avgSalHighCorrect = 0, avgSalHighTotal = 0;
for (const o of obs) {
    const tgt = targetBucket(o.targetSal);
    const bC = classify(o.bayesSal);
    const aC = classify(o.avgSal);
    if (tgt === bC)
        bayesSalAgree++;
    if (tgt === aC)
        avgSalAgree++;
    if (tgt === "none") {
        bayesSalNoneTotal++;
        avgSalNoneTotal++;
        if (bC === "none")
            bayesSalNoneCorrect++;
        if (aC === "none")
            avgSalNoneCorrect++;
    }
    if (tgt === "high") {
        bayesSalHighTotal++;
        avgSalHighTotal++;
        if (bC === "high")
            bayesSalHighCorrect++;
        if (aC === "high")
            avgSalHighCorrect++;
    }
}
md += "## Salience classification accuracy\n\n";
md += "Classifier bins observed sal into {none<0.5, low<1.5, mid<2.5, high}. Target bin = {0→none, 1→low, 2→mid, 3→high}.\n\n";
md += "| Engine | Exact-bucket agreement | \"Rule out\" target.sal=0 correct | \"Cares a lot\" target.sal=3 correct |\n";
md += "|--------|----------------------:|---------------------------------:|-----------------------------------:|\n";
md += `| Bayesian | ${bayesSalAgree}/${obs.length} (${(bayesSalAgree / obs.length * 100).toFixed(1)}%) | ${bayesSalNoneCorrect}/${bayesSalNoneTotal} (${bayesSalNoneTotal ? (bayesSalNoneCorrect / bayesSalNoneTotal * 100).toFixed(1) : 0}%) | ${bayesSalHighCorrect}/${bayesSalHighTotal} (${bayesSalHighTotal ? (bayesSalHighCorrect / bayesSalHighTotal * 100).toFixed(1) : 0}%) |\n`;
md += `| Averaging | ${avgSalAgree}/${obs.length} (${(avgSalAgree / obs.length * 100).toFixed(1)}%) | ${avgSalNoneCorrect}/${avgSalNoneTotal} (${avgSalNoneTotal ? (avgSalNoneCorrect / avgSalNoneTotal * 100).toFixed(1) : 0}%) | ${avgSalHighCorrect}/${avgSalHighTotal} (${avgSalHighTotal ? (avgSalHighCorrect / avgSalHighTotal * 100).toFixed(1) : 0}%) |\n`;
md += "\n";
// Position accuracy, weighted by target.sal (position on sal=0 nodes doesn't matter)
const contObs = obs.filter(o => o.kind === "continuous" && o.targetPos !== undefined && o.bayesPos !== undefined && o.avgPos !== undefined);
let bayesPosErrWeighted = 0, avgPosErrWeighted = 0, weightSum = 0;
for (const o of contObs) {
    const w = o.targetSal; // weight by target salience
    bayesPosErrWeighted += Math.abs(o.bayesPos - o.targetPos) * w;
    avgPosErrWeighted += Math.abs(o.avgPos - o.targetPos) * w;
    weightSum += w;
}
md += "## Position accuracy — weighted by target.sal (the nodes that matter)\n\n";
md += `Mean |observed_pos − target_pos|, weighted by target.sal (sal=0 nodes get zero weight — their position doesn't matter to the respondent).\n\n`;
md += `- **Bayesian:** weighted MAE = ${(bayesPosErrWeighted / weightSum).toFixed(2)} (pos scale 1-5)\n`;
md += `- **Averaging:** weighted MAE = ${(avgPosErrWeighted / weightSum).toFixed(2)}\n\n`;
// Extreme position (pos=1 or pos=5) handling
const extremeObs = contObs.filter(o => (o.targetPos === 1 || o.targetPos === 5) && o.targetSal >= 1);
let bayesExtremeErr = 0, avgExtremeErr = 0;
for (const o of extremeObs) {
    bayesExtremeErr += Math.abs(o.bayesPos - o.targetPos);
    avgExtremeErr += Math.abs(o.avgPos - o.targetPos);
}
md += "## Extreme-position nodes (target.pos ∈ {1, 5}, target.sal ≥ 1)\n\n";
md += `${extremeObs.length} (archetype, node) pairs. This is the regime where averaging is expected to underperform (regression toward mean).\n\n`;
md += `- **Bayesian:** MAE = ${(bayesExtremeErr / extremeObs.length).toFixed(2)}\n`;
md += `- **Averaging:** MAE = ${(avgExtremeErr / extremeObs.length).toFixed(2)}\n\n`;
md += "## Verdict\n\n";
md += "This is the *correct* diagnostic for Sam's stated objective: does each engine separate sal=0 from sal=3 nodes, and estimate position correctly on mattering nodes?\n\n";
md += "- If the \"rule out target.sal=0\" correctness is high for both, the engines are doing the ruling-out job regardless of archetype-ID match.\n";
md += "- If averaging's position accuracy on sal-weighted nodes is close to Bayesian's, the archetype-ID mismatch was just surface noise.\n";
md += "- If averaging's extreme-position MAE is materially higher, the regression-to-mean effect is real for high-salience extreme-pos nodes where position actually matters.\n";
const OUT = path.resolve(process.cwd(), "results", "architecture", "salience-separation.md");
fs.writeFileSync(OUT, md);
console.log(`Wrote ${OUT}`);
//# sourceMappingURL=compareSalienceSep.js.map