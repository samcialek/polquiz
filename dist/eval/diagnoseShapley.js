// Shapley value analysis — per (question, node), measure the marginal
// contribution to the node's posterior, averaged across random orderings
// of the answered question set.
//
// Method:
//   1. For each active archetype, run a standard simulateOne to capture
//      the answered question set and the archetype-optimal answer per
//      question (deterministic given archetype signature).
//   2. Sample K permutations of that answered set. For each permutation:
//      a. Reset state to the uniform prior.
//      b. Apply answers in permutation order.
//      c. After each apply, record every node's E[pos]/E[sal] (continuous)
//         or category distribution (categorical).
//      d. Record per-question marginal change in each metric.
//   3. For each (archetype, question, node), average marginal changes
//      across the K permutations — this is the archetype-local Shapley.
//   4. Aggregate across archetypes: per (question, node), mean |Shapley|.
//      This is the "how much does this question move node n's posterior?"
//      importance score, independent of whether the movement is accurate.
//
// Output:
//   results/question-audit/shap-per-node.json
//   results/question-audit/shap-per-node.md
//
// Usage:
//   npx tsx src/eval/diagnoseShapley.ts [K]
//   default K = 100 permutations per archetype
import fs from "node:fs";
import path from "node:path";
import { ARCHETYPES } from "../config/archetypes.js";
import { REPRESENTATIVE_QUESTIONS } from "../config/questions.representative.js";
import { CONTINUOUS_NODES, CATEGORICAL_NODES } from "../config/nodes.js";
import { applySingleChoiceAnswer, applySliderAnswer, applyAllocationAnswer, applyRankingAnswer, applyPairwiseAnswer, applyDualAxisAnswer, applyPrioritySort, } from "../engine/update.js";
import { simulateOne } from "./harness.js";
import { createRng } from "./rng.js";
const OUT_DIR = "results/question-audit";
const DEFAULT_K = 100;
// ---------------------------------------------------------------------------
// State init and utils.
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
function shuffle(arr, rng) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}
function expectedPos(posDist) {
    let s = 0, m = 0;
    for (let i = 0; i < posDist.length; i++) {
        s += (i + 1) * (posDist[i] ?? 0);
        m += posDist[i] ?? 0;
    }
    return m > 0 ? s / m : 3;
}
function expectedSal(salDist) {
    let s = 0, m = 0;
    for (let i = 0; i < salDist.length; i++) {
        s += i * (salDist[i] ?? 0);
        m += salDist[i] ?? 0;
    }
    return m > 0 ? s / m : 1.5;
}
function l1(a, b) {
    let s = 0;
    for (let i = 0; i < a.length; i++)
        s += Math.abs((a[i] ?? 0) - (b[i] ?? 0));
    return s;
}
// ---------------------------------------------------------------------------
// Archetype-optimal answer computation (deterministic given archetype).
// Uses scoring helpers inlined from harness.ts to avoid coupling.
// ---------------------------------------------------------------------------
function scoreOpt(a, ev) {
    if (!ev)
        return 1;
    let score = 0, count = 0;
    if (ev.continuous) {
        for (const [nodeId, upd] of Object.entries(ev.continuous)) {
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
    }
    if (ev.categorical) {
        for (const [nodeId, upd] of Object.entries(ev.categorical)) {
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
    }
    return count > 0 ? score / count : 0;
}
function scoreAllocBucket(a, b) {
    let s = 0, n = 0;
    if (b.continuous) {
        for (const [nid, sig] of Object.entries(b.continuous)) {
            const t = a.nodes[nid];
            if (!t || t.kind !== "continuous")
                continue;
            s += ((t.pos - 3) / 2) * (sig ?? 0);
            n++;
        }
    }
    if (b.categorical) {
        for (const [nid, dist] of Object.entries(b.categorical)) {
            const t = a.nodes[nid];
            if (!t || t.kind !== "categorical")
                continue;
            let dot = 0;
            for (let i = 0; i < 6; i++)
                dot += (t.probs[i] ?? 0) * (dist[i] ?? 0);
            s += dot;
            n++;
        }
    }
    return n > 0 ? s / n : 0;
}
function scoreRankItem(a, m) {
    let s = 0, n = 0;
    if (m.continuous) {
        for (const [nid, sig] of Object.entries(m.continuous)) {
            const t = a.nodes[nid];
            if (!t || t.kind !== "continuous")
                continue;
            const num = typeof sig === "number" ? sig
                : (sig && typeof sig === "object" && "pos" in sig) ? 0
                    : 0;
            s += ((t.pos - 3) / 2) * num;
            n++;
        }
    }
    if (m.categorical) {
        for (const [nid, dist] of Object.entries(m.categorical)) {
            const t = a.nodes[nid];
            if (!t || t.kind !== "categorical")
                continue;
            let dot = 0;
            for (let i = 0; i < 6; i++)
                dot += (t.probs[i] ?? 0) * (dist[i] ?? 0);
            s += dot;
            n++;
        }
    }
    return n > 0 ? s / n : 0;
}
function scorePair(a, m) {
    let s = 0, n = 0;
    if (m.continuous) {
        for (const [nid, sig] of Object.entries(m.continuous)) {
            const t = a.nodes[nid];
            if (!t || t.kind !== "continuous")
                continue;
            s += ((t.pos - 3) / 2) * (sig ?? 0);
            n++;
        }
    }
    return n > 0 ? s / n : 0;
}
/** Archetype-optimal priority_sort: score each item, then bucket by quartile
 *  of score distribution. Top 25% → supportHigh, 25–50% → supportMid,
 *  50–75% → neutral, 75–100% → opposeHigh. Uses pos-evidence item shape. */
function priorityOptimal(a, q) {
    const result = { supportHigh: [], supportMid: [], neutral: [], opposeHigh: [] };
    if (!q.rankingMap)
        return result;
    const items = Object.keys(q.rankingMap);
    const scored = items.map(item => {
        let score = 0, count = 0;
        const m = q.rankingMap[item];
        if (m.continuous) {
            for (const [nid, ev] of Object.entries(m.continuous)) {
                const t = a.nodes[nid];
                if (!t || t.kind !== "continuous")
                    continue;
                if (ev && typeof ev === "object" && ev.pos) {
                    const pos = ev.pos;
                    // Dot product with archetype's pos indicator
                    score += pos[t.pos - 1] ?? 0;
                    count++;
                }
                else if (typeof ev === "number") {
                    score += ((t.pos - 3) / 2) * ev;
                    count++;
                }
            }
        }
        return { item, score: count > 0 ? score / count : 0 };
    });
    scored.sort((a, b) => b.score - a.score);
    const n = scored.length;
    const q1 = Math.floor(n * 0.25);
    const q2 = Math.floor(n * 0.50);
    const q3 = Math.floor(n * 0.75);
    for (let i = 0; i < n; i++) {
        const it = scored[i].item;
        if (i < q1)
            result.supportHigh.push(it);
        else if (i < q2)
            result.supportMid.push(it);
        else if (i < q3)
            result.neutral.push(it);
        else
            result.opposeHigh.push(it);
    }
    return result;
}
function computeAnswerPlan(a, q) {
    switch (q.uiType) {
        case "single_choice":
        case "multi":
        case "conjoint": {
            if (!q.optionEvidence)
                return null;
            const keys = Object.keys(q.optionEvidence);
            if (!keys.length)
                return null;
            let best = keys[0], bestScore = -Infinity;
            for (const k of keys) {
                const sc = scoreOpt(a, q.optionEvidence[k]);
                if (sc > bestScore) {
                    bestScore = sc;
                    best = k;
                }
            }
            return s => applySingleChoiceAnswer(s, q, best);
        }
        case "slider": {
            if (!q.sliderMap)
                return null;
            const buckets = Object.keys(q.sliderMap);
            if (!buckets.length)
                return null;
            let best = buckets[0], bestScore = -Infinity;
            for (const k of buckets) {
                const sc = scoreOpt(a, q.sliderMap[k]);
                if (sc > bestScore) {
                    bestScore = sc;
                    best = k;
                }
            }
            const parts = best.split("-").map(Number);
            const mid = Math.round(((parts[0] ?? 0) + (parts[1] ?? 100)) / 2);
            return s => applySliderAnswer(s, q, mid);
        }
        case "allocation": {
            if (!q.allocationMap)
                return null;
            const names = Object.keys(q.allocationMap);
            if (!names.length)
                return null;
            const scores = {};
            for (const n of names)
                scores[n] = scoreAllocBucket(a, q.allocationMap[n]);
            const minScore = Math.min(...Object.values(scores));
            const shifted = {};
            for (const n of names)
                shifted[n] = Math.exp((scores[n] - minScore) * 2);
            const total = Object.values(shifted).reduce((x, y) => x + y, 0);
            const alloc = {};
            for (const n of names)
                alloc[n] = Math.round((shifted[n] / total) * 100);
            const allocTotal = Object.values(alloc).reduce((x, y) => x + y, 0);
            if (allocTotal !== 100) {
                const maxKey = names.reduce((x, y) => alloc[x] > alloc[y] ? x : y);
                alloc[maxKey] = alloc[maxKey] + (100 - allocTotal);
            }
            return s => applyAllocationAnswer(s, q, alloc);
        }
        case "ranking": {
            if (!q.rankingMap)
                return null;
            const items = Object.keys(q.rankingMap);
            if (!items.length)
                return null;
            // Detect OptionEvidenceContinuous shape → route as priority_sort
            const poleShape = Object.values(q.rankingMap).some(m => {
                const c = m.continuous;
                if (!c)
                    return false;
                return Object.values(c).some(v => v && typeof v === "object" && "pos" in v);
            });
            if (poleShape) {
                const placements = priorityOptimal(a, q);
                return s => applyPrioritySort(s, q, placements, items);
            }
            const scored = items.map(i => ({ i, sc: scoreRankItem(a, q.rankingMap[i]) }));
            scored.sort((x, y) => y.sc - x.sc);
            const ranking = scored.map(x => x.i);
            return s => applyRankingAnswer(s, q, ranking);
        }
        case "best_worst":
        case "priority_sort": {
            if (!q.rankingMap)
                return null;
            const items = Object.keys(q.rankingMap);
            if (!items.length)
                return null;
            const placements = priorityOptimal(a, q);
            return s => applyPrioritySort(s, q, placements, items);
        }
        case "pairwise": {
            if (!q.pairMaps)
                return null;
            const answers = {};
            for (const [pairId, options] of Object.entries(q.pairMaps)) {
                let best = "", bestSc = -Infinity;
                for (const [c, m] of Object.entries(options)) {
                    const sc = scorePair(a, m);
                    if (sc > bestSc) {
                        bestSc = sc;
                        best = c;
                    }
                }
                if (best)
                    answers[pairId] = best;
            }
            if (!Object.keys(answers).length)
                return null;
            return s => applyPairwiseAnswer(s, q, answers);
        }
        case "dual_axis": {
            if (!q.dualAxisMap)
                return null;
            const t = a.nodes[q.dualAxisMap.node];
            if (!t || t.kind !== "continuous")
                return null;
            const x = (t.pos - 1) / 4;
            const y = t.sal / 3;
            return s => applyDualAxisAnswer(s, q, { x, y });
        }
        default: return null;
    }
}
function snapshot(s) {
    const continuous = {};
    for (const n of CONTINUOUS_NODES) {
        continuous[n] = {
            expPos: expectedPos(s.continuous[n].posDist),
            expSal: expectedSal(s.continuous[n].salDist),
        };
    }
    const categorical = {};
    for (const n of CATEGORICAL_NODES) {
        categorical[n] = {
            catDist: [...s.categorical[n].catDist],
            expSal: expectedSal(s.categorical[n].salDist),
        };
    }
    return continuous && categorical ? { continuous, categorical } : { continuous: {}, categorical: {} };
}
function computeArchetypeShapley(archetype, qIds, plans, K, rng) {
    const contAcc = {};
    const catAcc = {};
    for (const qid of qIds) {
        contAcc[qid] = {};
        catAcc[qid] = {};
        for (const n of CONTINUOUS_NODES)
            contAcc[qid][n] = { posSum: 0, salSum: 0, n: 0 };
        for (const n of CATEGORICAL_NODES)
            catAcc[qid][n] = { catL1Sum: 0, salSum: 0, n: 0 };
    }
    for (let k = 0; k < K; k++) {
        const order = shuffle(qIds, rng);
        const s = createInitialState();
        let prev = snapshot(s);
        for (const qid of order) {
            const plan = plans.get(qid);
            if (!plan)
                continue;
            plan(s);
            const cur = snapshot(s);
            // Marginal deltas.
            for (const n of CONTINUOUS_NODES) {
                const dp = Math.abs(cur.continuous[n].expPos - prev.continuous[n].expPos);
                const ds = Math.abs(cur.continuous[n].expSal - prev.continuous[n].expSal);
                const acc = contAcc[qid][n];
                acc.posSum += dp;
                acc.salSum += ds;
                acc.n++;
            }
            for (const n of CATEGORICAL_NODES) {
                const dc = l1(cur.categorical[n].catDist, prev.categorical[n].catDist);
                const ds = Math.abs(cur.categorical[n].expSal - prev.categorical[n].expSal);
                const acc = catAcc[qid][n];
                acc.catL1Sum += dc;
                acc.salSum += ds;
                acc.n++;
            }
            prev = cur;
        }
    }
    return {
        archId: archetype.id,
        archName: archetype.name,
        qIds,
        continuous: contAcc,
        categorical: catAcc,
    };
}
function main() {
    const K = Number(process.argv[2] ?? DEFAULT_K);
    if (!Number.isFinite(K) || K < 10) {
        console.error("K must be an integer ≥ 10. Got:", process.argv[2]);
        process.exit(1);
    }
    console.log(`Shapley analysis — ${K} permutations per archetype.`);
    const tStart = Date.now();
    const activeArchetypes = ARCHETYPES.filter(a => a.active !== false);
    const qById = new Map();
    for (const q of REPRESENTATIVE_QUESTIONS)
        qById.set(q.id, q);
    const global = { continuous: {}, categorical: {} };
    for (const n of CONTINUOUS_NODES)
        global.continuous[n] = {};
    for (const n of CATEGORICAL_NODES)
        global.categorical[n] = {};
    let archIdx = 0;
    for (const arch of activeArchetypes) {
        archIdx++;
        // 1. Run simulateOne to get answered-question set.
        const run = simulateOne(arch, activeArchetypes, REPRESENTATIVE_QUESTIONS, { noiseSigma: 0, captureNodeStates: true });
        const qIds = (run.nodeTrajectory ?? []).map(t => t.questionId);
        if (qIds.length < 5)
            continue; // skip pathological runs
        // 2. Build answer plans.
        const plans = new Map();
        for (const qid of qIds) {
            const q = qById.get(qid);
            if (!q)
                continue;
            const plan = computeAnswerPlan(arch, q);
            if (plan)
                plans.set(qid, plan);
        }
        // 3. Compute per-archetype Shapley.
        const rng = createRng(1000 + archIdx);
        const shap = computeArchetypeShapley(arch, [...plans.keys()], plans, K, rng);
        // 4. Aggregate into global.
        for (const [qidStr, nodes] of Object.entries(shap.continuous)) {
            const qid = +qidStr;
            for (const n of CONTINUOUS_NODES) {
                const acc = nodes[n];
                if (acc.n === 0)
                    continue;
                if (!global.continuous[n][qid]) {
                    global.continuous[n][qid] = { posMean: 0, salMean: 0, arches: 0 };
                }
                const g = global.continuous[n][qid];
                // Running mean across archetypes of the archetype-local mean delta.
                const localPosMean = acc.posSum / acc.n;
                const localSalMean = acc.salSum / acc.n;
                g.posMean = (g.posMean * g.arches + localPosMean) / (g.arches + 1);
                g.salMean = (g.salMean * g.arches + localSalMean) / (g.arches + 1);
                g.arches++;
            }
        }
        for (const [qidStr, nodes] of Object.entries(shap.categorical)) {
            const qid = +qidStr;
            for (const n of CATEGORICAL_NODES) {
                const acc = nodes[n];
                if (acc.n === 0)
                    continue;
                if (!global.categorical[n][qid]) {
                    global.categorical[n][qid] = { catL1Mean: 0, salMean: 0, arches: 0 };
                }
                const g = global.categorical[n][qid];
                const localCatMean = acc.catL1Sum / acc.n;
                const localSalMean = acc.salSum / acc.n;
                g.catL1Mean = (g.catL1Mean * g.arches + localCatMean) / (g.arches + 1);
                g.salMean = (g.salMean * g.arches + localSalMean) / (g.arches + 1);
                g.arches++;
            }
        }
        if (archIdx % 10 === 0 || archIdx === activeArchetypes.length) {
            const elapsed = (Date.now() - tStart) / 1000;
            const rate = archIdx / elapsed;
            const eta = (activeArchetypes.length - archIdx) / rate;
            console.log(`  ${archIdx}/${activeArchetypes.length} archetypes (${rate.toFixed(2)} arch/s, ETA ${eta.toFixed(0)}s)`);
        }
    }
    const elapsed = (Date.now() - tStart) / 1000;
    console.log(`Done — ${elapsed.toFixed(1)}s total.`);
    // ---- JSON output ----
    fs.mkdirSync(OUT_DIR, { recursive: true });
    const jsonPath = path.join(OUT_DIR, "shap-per-node.json");
    fs.writeFileSync(jsonPath, JSON.stringify({
        K,
        numArchetypes: activeArchetypes.length,
        elapsedSeconds: elapsed,
        global,
    }, null, 2));
    console.log(`Wrote ${jsonPath}`);
    // ---- Markdown summary: top N questions per node ----
    const lines = [];
    lines.push(`# SHAP per-node question importance — ${K} permutations × ${activeArchetypes.length} archetypes\n`);
    lines.push(`For every (question, node) pair, Shapley value = mean |ΔE[pos]| delivered by this question when inserted into a random ordering of the answered question set. Averaged across the ${K} permutations and all ${activeArchetypes.length} archetypes.\n`);
    lines.push(`Interpretation: posMean = average shift in E[node.pos] per appearance; higher = more influence on node position. salMean = average shift in E[node.sal]. For categorical nodes catL1Mean = L1 distance between catDist before and after.\n`);
    const TOP_N = 10;
    lines.push(`## Continuous nodes — top ${TOP_N} questions by E[pos] shift\n`);
    for (const n of CONTINUOUS_NODES) {
        const entries = Object.entries(global.continuous[n] ?? {})
            .map(([qidStr, stats]) => ({ qid: +qidStr, ...stats }))
            .filter(e => e.arches > 0)
            .sort((a, b) => b.posMean - a.posMean)
            .slice(0, TOP_N);
        if (!entries.length)
            continue;
        lines.push(`### ${n}\n`);
        lines.push(`| Rank | Qid | Prompt | uiType | posMean | salMean | archs |`);
        lines.push(`|-----:|----:|--------|--------|--------:|--------:|------:|`);
        for (let i = 0; i < entries.length; i++) {
            const e = entries[i];
            const q = qById.get(e.qid);
            lines.push(`| ${i + 1} | Q${e.qid} | \`${q?.promptShort ?? "?"}\` | ${q?.uiType ?? "?"} | ${e.posMean.toFixed(4)} | ${e.salMean.toFixed(4)} | ${e.arches} |`);
        }
        lines.push("");
    }
    lines.push(`## Categorical nodes — top ${TOP_N} questions by catDist L1 shift\n`);
    for (const n of CATEGORICAL_NODES) {
        const entries = Object.entries(global.categorical[n] ?? {})
            .map(([qidStr, stats]) => ({ qid: +qidStr, ...stats }))
            .filter(e => e.arches > 0)
            .sort((a, b) => b.catL1Mean - a.catL1Mean)
            .slice(0, TOP_N);
        if (!entries.length)
            continue;
        lines.push(`### ${n}\n`);
        lines.push(`| Rank | Qid | Prompt | uiType | catL1Mean | salMean | archs |`);
        lines.push(`|-----:|----:|--------|--------|----------:|--------:|------:|`);
        for (let i = 0; i < entries.length; i++) {
            const e = entries[i];
            const q = qById.get(e.qid);
            lines.push(`| ${i + 1} | Q${e.qid} | \`${q?.promptShort ?? "?"}\` | ${q?.uiType ?? "?"} | ${e.catL1Mean.toFixed(4)} | ${e.salMean.toFixed(4)} | ${e.arches} |`);
        }
        lines.push("");
    }
    const mdPath = path.join(OUT_DIR, "shap-per-node.md");
    fs.writeFileSync(mdPath, lines.join("\n") + "\n");
    console.log(`Wrote ${mdPath}`);
}
main();
//# sourceMappingURL=diagnoseShapley.js.map