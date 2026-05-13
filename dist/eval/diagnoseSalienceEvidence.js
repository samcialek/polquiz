// Audit salience evidence across the full question bank.
//
// For every (question, option/bucket/item, node) triple that produces a
// salience-likelihood vector, record the vector, compute its expected
// salience, and log how often bucket 0 gets meaningful mass. The question
// we're answering: is there enough "this node doesn't matter" evidence in
// the bank for the posterior to ever reach low values, or is the evidence
// itself the bottleneck?
//
// Emits:
//   results/question-audit/salience-evidence-audit.md
//   results/question-audit/salience-evidence-audit.json
//
// Usage: npx tsx src/eval/diagnoseSalienceEvidence.ts
import fs from "node:fs";
import path from "node:path";
import { REPRESENTATIVE_QUESTIONS } from "../config/questions.representative.js";
const OUT_DIR = "results/question-audit";
// Canonical constants lifted from src/engine/update.ts — if those change,
// update here too.
const RANK_SAL = [
    [0.05, 0.15, 0.30, 0.50],
    [0.10, 0.20, 0.30, 0.40],
    [0.18, 0.25, 0.30, 0.27],
    [0.27, 0.30, 0.25, 0.18],
    [0.40, 0.30, 0.20, 0.10],
    [0.50, 0.30, 0.15, 0.05],
];
const SAL_IF_BEST = [0.05, 0.15, 0.30, 0.50];
const SAL_IF_WORST = [0.50, 0.30, 0.15, 0.05];
const SAL_IF_MIDDLE = [0.25, 0.30, 0.25, 0.20];
const SAL_IF_BEST_FORCED = [0.23, 0.25, 0.27, 0.25];
const SAL_IF_WORST_FORCED = [0.27, 0.25, 0.25, 0.23];
const SAL_PRIORITY_HIGH = [0.03, 0.10, 0.27, 0.60];
const SAL_PRIORITY_MID = [0.20, 0.30, 0.30, 0.20];
const SAL_PRIORITY_LOW = [0.55, 0.30, 0.12, 0.03];
function expSal(v) {
    let s = 0, m = 0;
    for (let i = 0; i < v.length; i++) {
        s += i * v[i];
        m += v[i];
    }
    return m > 0 ? s / m : 1.5;
}
function b0(v) {
    const m = v.reduce((a, b) => a + b, 0);
    return m > 0 ? v[0] / m : 0;
}
function sig(qid, uiType, source, node, sal) {
    return { qid, uiType, source, node, sal, expectedSal: expSal(sal), bucket0Mass: b0(sal) };
}
function extractOptionEvidenceSignals(q, mapName, map) {
    const out = [];
    for (const [key, ev] of Object.entries(map)) {
        if (!ev)
            continue;
        const cont = ev.continuous ?? {};
        for (const [nid, target] of Object.entries(cont)) {
            const sal = target?.sal;
            if (sal)
                out.push(sig(q.id, q.uiType, `${mapName}:${key}`, nid, sal));
        }
        const cat = ev.categorical ?? {};
        for (const [nid, target] of Object.entries(cat)) {
            const sal = target?.sal;
            if (sal)
                out.push(sig(q.id, q.uiType, `${mapName}:${key}`, nid, sal));
        }
    }
    return out;
}
function extractRankingSignals(q) {
    const out = [];
    if (!q.rankingMap)
        return out;
    const items = Object.keys(q.rankingMap);
    // A ranking signal exists for every (item, rank) pair — rank drives the salience
    // likelihood via RANK_SAL. We record all 6 ranks as potential signals per touched node.
    for (const item of items) {
        const map = q.rankingMap[item];
        const touchedNodes = new Set();
        if (map.continuous)
            for (const k of Object.keys(map.continuous))
                touchedNodes.add(k);
        if (map.categorical)
            for (const k of Object.keys(map.categorical))
                touchedNodes.add(k);
        for (const n of touchedNodes) {
            for (let r = 0; r < RANK_SAL.length; r++) {
                out.push(sig(q.id, q.uiType, `rankingMap:${item}@rank${r + 1}`, n, RANK_SAL[r]));
            }
        }
    }
    return out;
}
function extractBestWorstSignals(q) {
    const out = [];
    const map = q.bestWorstMap ?? q.rankingMap;
    if (!map)
        return out;
    const items = Object.keys(map);
    // Node→items map to detect "forced category" (all items touch same node).
    const nodeToItems = {};
    for (const item of items) {
        const m = map[item];
        const touched = new Set();
        if (m.continuous)
            for (const k of Object.keys(m.continuous))
                touched.add(k);
        if (m.categorical)
            for (const k of Object.keys(m.categorical))
                touched.add(k);
        for (const n of touched) {
            if (!nodeToItems[n])
                nodeToItems[n] = [];
            nodeToItems[n].push(item);
        }
    }
    for (const item of items) {
        const m = map[item];
        const touched = new Set();
        if (m.continuous)
            for (const k of Object.keys(m.continuous))
                touched.add(k);
        if (m.categorical)
            for (const k of Object.keys(m.categorical))
                touched.add(k);
        for (const n of touched) {
            const forced = (nodeToItems[n]?.length ?? 0) >= items.length;
            const bestVec = forced ? SAL_IF_BEST_FORCED : SAL_IF_BEST;
            const worstVec = forced ? SAL_IF_WORST_FORCED : SAL_IF_WORST;
            out.push(sig(q.id, q.uiType, `bestWorstMap:${item}@best`, n, bestVec));
            out.push(sig(q.id, q.uiType, `bestWorstMap:${item}@worst`, n, worstVec));
            out.push(sig(q.id, q.uiType, `bestWorstMap:${item}@middle`, n, SAL_IF_MIDDLE));
        }
    }
    return out;
}
function extractPrioritySortSignals(q) {
    const out = [];
    if (!q.rankingMap)
        return out;
    const items = Object.keys(q.rankingMap);
    for (const item of items) {
        const m = q.rankingMap[item];
        const touched = new Set();
        if (m.continuous)
            for (const k of Object.keys(m.continuous))
                touched.add(k);
        if (m.categorical)
            for (const k of Object.keys(m.categorical))
                touched.add(k);
        for (const n of touched) {
            out.push(sig(q.id, q.uiType, `prioritySort:${item}@high`, n, SAL_PRIORITY_HIGH));
            out.push(sig(q.id, q.uiType, `prioritySort:${item}@mid`, n, SAL_PRIORITY_MID));
            out.push(sig(q.id, q.uiType, `prioritySort:${item}@low`, n, SAL_PRIORITY_LOW));
        }
    }
    return out;
}
const signals = [];
for (const q of REPRESENTATIVE_QUESTIONS) {
    switch (q.uiType) {
        case "single_choice":
        case "multi":
        case "conjoint":
            if (q.optionEvidence)
                signals.push(...extractOptionEvidenceSignals(q, "optionEvidence", q.optionEvidence));
            break;
        case "slider":
            if (q.sliderMap)
                signals.push(...extractOptionEvidenceSignals(q, "sliderMap", q.sliderMap));
            break;
        case "allocation":
            // allocation does not carry explicit sal vectors in the option map; it
            // contributes indirectly via HHI-based salience elsewhere. Skip here.
            break;
        case "ranking":
            signals.push(...extractRankingSignals(q));
            break;
        case "best_worst":
            signals.push(...extractBestWorstSignals(q));
            break;
        case "priority_sort":
            signals.push(...extractPrioritySortSignals(q));
            break;
        case "pairwise":
            // pairwise does not carry explicit sal vectors.
            break;
        case "dual_axis":
            // dual_axis drives salience via y-axis continuous mapping, not per-option vectors.
            break;
    }
}
const agg = {};
const questionsByNode = {};
for (const s of signals) {
    if (!agg[s.node]) {
        agg[s.node] = {
            node: s.node,
            totalSignals: 0,
            distinctQuestions: 0,
            distinctLowering: 0,
            distinctRaising: 0,
            anyBucket0Dominant: 0,
            minExpectedSal: Infinity,
            maxExpectedSal: -Infinity,
            meanExpectedSal: 0,
            meanBucket0: 0,
            examples: { lowest: null, highest: null },
        };
        questionsByNode[s.node] = new Set();
    }
    const a = agg[s.node];
    a.totalSignals++;
    questionsByNode[s.node].add(s.qid);
    if (s.expectedSal < 1.0)
        a.distinctLowering++;
    if (s.expectedSal > 2.0)
        a.distinctRaising++;
    if (s.bucket0Mass > 0.5)
        a.anyBucket0Dominant++;
    if (s.expectedSal < a.minExpectedSal) {
        a.minExpectedSal = s.expectedSal;
        a.examples.lowest = s;
    }
    if (s.expectedSal > a.maxExpectedSal) {
        a.maxExpectedSal = s.expectedSal;
        a.examples.highest = s;
    }
    a.meanExpectedSal += s.expectedSal;
    a.meanBucket0 += s.bucket0Mass;
}
for (const a of Object.values(agg)) {
    a.distinctQuestions = questionsByNode[a.node].size;
    a.meanExpectedSal /= Math.max(1, a.totalSignals);
    a.meanBucket0 /= Math.max(1, a.totalSignals);
}
const qnRows = [];
const byQN = new Map();
for (const s of signals) {
    const k = `${s.qid}|${s.node}`;
    if (!byQN.has(k))
        byQN.set(k, []);
    byQN.get(k).push(s);
}
for (const [k, sigs] of byQN) {
    const [qidStr, node] = k.split("|");
    const qid = +qidStr;
    const q = REPRESENTATIVE_QUESTIONS.find(x => x.id === qid);
    if (!q)
        continue;
    const exps = sigs.map(s => s.expectedSal);
    qnRows.push({
        qid, uiType: q.uiType, promptShort: q.promptShort, node: node,
        nSignals: sigs.length,
        minExpectedSal: Math.min(...exps),
        maxExpectedSal: Math.max(...exps),
        reach: Math.max(...exps) - Math.min(...exps),
    });
}
// ---------------------------------------------------------------------------
// Write outputs.
// ---------------------------------------------------------------------------
fs.mkdirSync(OUT_DIR, { recursive: true });
const jsonPath = path.join(OUT_DIR, "salience-evidence-audit.json");
fs.writeFileSync(jsonPath, JSON.stringify({
    totalSignals: signals.length,
    perNode: agg,
    perQuestionNode: qnRows,
}, null, 2));
console.log(`Wrote ${jsonPath}`);
// ---- Markdown report ----
const md = [];
md.push(`# Salience evidence audit\n`);
md.push(`**Question**: does the question bank carry enough "low salience" evidence for the posterior to ever reach the floor of the scale (E[sal] near 0)?\n`);
md.push(`**Method**: enumerate every (question, answer, node) triple that produces a salience-likelihood vector. For each, compute the expected bucket (0–3). Aggregate per node.\n`);
md.push(`**Corpus**: ${REPRESENTATIVE_QUESTIONS.length} representative questions, ${signals.length} total salience signals enumerated.\n`);
md.push(`## Per-node aggregate\n`);
md.push(`- **distinctQuestions** = number of questions in the bank that can touch this node's salience.`);
md.push(`- **distinctLowering** = signals with E[sal] < 1.0 (push posterior down).`);
md.push(`- **distinctRaising** = signals with E[sal] > 2.0 (push posterior up).`);
md.push(`- **anyBucket0Dominant** = signals where sal[0] > 0.5 (strongly argue for "not salient").`);
md.push(`- **minExpectedSal / maxExpectedSal** = the softest-possible / strongest-possible salience claim the bank can make per touch.\n`);
md.push(`| Node | qs | signals | lowering | raising | b0>0.5 | min E[sal] | mean E[sal] | max E[sal] |`);
md.push(`|------|---:|--------:|---------:|--------:|-------:|-----------:|------------:|-----------:|`);
const nodeOrder = Object.keys(agg).sort((a, b) => agg[a].minExpectedSal - agg[b].minExpectedSal);
for (const n of nodeOrder) {
    const a = agg[n];
    md.push(`| **${n}** | ${a.distinctQuestions} | ${a.totalSignals} | ${a.distinctLowering} | ${a.distinctRaising} | ${a.anyBucket0Dominant} | ${a.minExpectedSal.toFixed(2)} | ${a.meanExpectedSal.toFixed(2)} | ${a.maxExpectedSal.toFixed(2)} |`);
}
md.push("");
md.push(`## Interpretation\n`);
md.push(`Signals with E[sal] < 1.0 can push the salience posterior down toward 0. If a node has **few** such signals, or they live only in rarely-asked questions, the floor of the reachable salience is bounded by the prior plus residual average evidence — explaining the reachability finding that most nodes cannot get below ~1 in 95% of random-answer runs.\n`);
md.push(`Mechanical sources of low-salience signals in the bank:`);
md.push(`- **priority_sort low bucket** (sal = [0.55, 0.30, 0.12, 0.03], E ≈ 0.63)`);
md.push(`- **best_worst worst** (sal = [0.50, 0.30, 0.15, 0.05], E ≈ 0.75) for non-forced-category batteries`);
md.push(`- **ranking rank-6 / rank-5** (E ≈ 0.75 / 1.00)`);
md.push(`- **Authored optionEvidence/sliderMap sal vectors** that the question designer explicitly wrote with bucket-0 weight.\n`);
md.push(`The last category is what we can most directly control. If few single_choice / slider options produce low-E[sal] vectors, we need to add them — or accept that for that node salience is essentially only knockable-down via ranking-family questions.\n`);
md.push(`## Per-question-node salience lever surface\n`);
md.push(`Ordered by reach (max − min attainable E[sal]) — questions with a wide reach are the ones that actually give respondents a way to claim both "I care a lot" and "I don't care at all" about a node.\n`);
md.push(`| Qid | Prompt | uiType | Node | #signals | min E[sal] | max E[sal] | reach |`);
md.push(`|----:|--------|--------|------|---------:|-----------:|-----------:|------:|`);
qnRows.sort((a, b) => b.reach - a.reach);
for (const r of qnRows.slice(0, 60)) {
    md.push(`| Q${r.qid} | \`${r.promptShort}\` | ${r.uiType} | ${r.node} | ${r.nSignals} | ${r.minExpectedSal.toFixed(2)} | ${r.maxExpectedSal.toFixed(2)} | ${r.reach.toFixed(2)} |`);
}
md.push("\n*(top 60 of ${qnRows.length} — full list in JSON)*\n");
md.push(`## Low-reach node×question diagnostic\n`);
md.push(`Pairs where no available answer produces E[sal] < 1.0 (every answer argues the node is salient). These are the places where the posterior cannot be pushed down.\n`);
const stuckHigh = qnRows.filter(r => r.minExpectedSal >= 1.0).sort((a, b) => a.minExpectedSal - b.minExpectedSal);
md.push(`| Qid | Prompt | uiType | Node | min E[sal] | max E[sal] |`);
md.push(`|----:|--------|--------|------|-----------:|-----------:|`);
for (const r of stuckHigh.slice(0, 40)) {
    md.push(`| Q${r.qid} | \`${r.promptShort}\` | ${r.uiType} | ${r.node} | ${r.minExpectedSal.toFixed(2)} | ${r.maxExpectedSal.toFixed(2)} |`);
}
md.push(`\nTotal stuck-high pairs: ${stuckHigh.length} / ${qnRows.length}.\n`);
md.push(`## Recommendation\n`);
md.push(`1. **For salience, switch from Bayesian to weighted-mean**: given the evidence distribution above, per-node salience = weighted mean of expectedSal across all signals received. This reaches 0 if all answers argue "not salient" and 3 if all argue "very salient", symmetric behavior the Bayesian posterior does not deliver.`);
md.push(`2. **Audit the "stuck-high" pairs above** — if you want to retain the option of posterior machinery, these are the authored sal vectors you'd need to widen (add bucket-0 mass to the "neutral/skip/don't know" option of each).`);
md.push(`3. **Priority_sort and best_worst are already well-balanced** — their low-bucket vectors already reach E[sal] ≈ 0.6–0.75. The compression is coming from the single_choice / slider evidence authored for specific questions.`);
const mdPath = path.join(OUT_DIR, "salience-evidence-audit.md");
fs.writeFileSync(mdPath, md.join("\n") + "\n");
console.log(`Wrote ${mdPath}`);
//# sourceMappingURL=diagnoseSalienceEvidence.js.map