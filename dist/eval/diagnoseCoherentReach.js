// Coherent-respondent reachability diagnostic.
//
// Unlike diagnoseReachability.ts (random answers, 5000 runs), this simulates
// the full quiz for each active archetype using the harness's archetype-
// optimal answer generator. A small amount of jitter (noiseSigma > 0) produces
// distinct runs per archetype so we can measure the spread under realistic
// "this respondent fits this worldview" answering.
//
// Per (archetype, node) we record the final E[pos] and E[sal] and compare to
// the archetype's signature target. Per node, we aggregate reachability across
// all coherent runs.
//
// The question: can a coherent "I don't care about X" respondent actually drive
// E[sal] near 0? If yes, the Bayesian posterior is fine and random-walk
// compression was measuring the wrong thing. If no, the updater itself is
// compressing and we should switch to averaging.
//
// Usage:
//   npx tsx src/eval/diagnoseCoherentReach.ts [runsPerArchetype] [noiseSigma]
//   default: 42 runs per archetype (~5000 total), noiseSigma 0.15
import fs from "node:fs";
import path from "node:path";
import { ARCHETYPES } from "../config/archetypes.js";
import { REPRESENTATIVE_QUESTIONS } from "../config/questions.representative.js";
import { CONTINUOUS_NODES, CATEGORICAL_NODES } from "../config/nodes.js";
import { simulateOne } from "./harness.js";
const OUT_DIR = "results/question-audit";
function stats(xs) {
    if (!xs.length)
        return { min: 0, max: 0, p5: 0, p95: 0, mean: 0, n: 0 };
    const sorted = [...xs].sort((a, b) => a - b);
    const mean = xs.reduce((s, x) => s + x, 0) / xs.length;
    const p = (q) => sorted[Math.min(sorted.length - 1, Math.max(0, Math.floor(q * sorted.length)))];
    return { min: sorted[0], max: sorted[sorted.length - 1], p5: p(0.05), p95: p(0.95), mean, n: xs.length };
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
const runsPerArch = Number(process.argv[2] ?? 42);
const noiseSigma = Number(process.argv[3] ?? 0.15);
const activeArchetypes = ARCHETYPES.filter(a => a.active !== false);
const total = activeArchetypes.length * runsPerArch;
console.log(`Coherent reachability — ${activeArchetypes.length} archetypes × ${runsPerArch} runs = ${total} total. noiseSigma=${noiseSigma}.`);
const tStart = Date.now();
// ---------------------------------------------------------------------------
// Data structures
// ---------------------------------------------------------------------------
// Per node (across all runs): observed E[pos], E[sal]
const nodeObservedPos = {};
const nodeObservedSal = {};
for (const n of CONTINUOUS_NODES) {
    nodeObservedPos[n] = [];
    nodeObservedSal[n] = [];
}
for (const n of CATEGORICAL_NODES) {
    nodeObservedSal[n] = [];
}
const archNode = {};
function keyAN(archId, node) { return `${archId}|${node}`; }
// Per archetype: questions answered count
const questionsAnsweredByArch = [];
let runIdx = 0;
for (const arch of activeArchetypes) {
    // Seed target values for each node
    for (const n of CONTINUOUS_NODES) {
        const t = arch.nodes[n];
        const k = keyAN(arch.id, n);
        archNode[k] = {
            archId: arch.id, archName: arch.name, node: n, isCategorical: false,
            targetPos: (t && t.kind === "continuous") ? t.pos : undefined,
            targetSal: t?.sal,
            observedPos: [], observedSal: [],
        };
    }
    for (const n of CATEGORICAL_NODES) {
        const t = arch.nodes[n];
        const k = keyAN(arch.id, n);
        archNode[k] = {
            archId: arch.id, archName: arch.name, node: n, isCategorical: true,
            targetPos: undefined,
            targetSal: t?.sal,
            observedPos: [], observedSal: [],
        };
    }
    for (let r = 0; r < runsPerArch; r++) {
        const sigma = r === 0 ? 0 : noiseSigma; // first run is exact-archetype; rest are jittered
        const run = simulateOne(arch, activeArchetypes, REPRESENTATIVE_QUESTIONS, {
            seed: 1000 * arch.id.charCodeAt(0) + r,
            noiseSigma: sigma,
            captureNodeStates: true,
        });
        questionsAnsweredByArch.push(run.questionsAnswered);
        const finalState = run.nodeFinalState;
        if (!finalState)
            continue;
        for (const n of CONTINUOUS_NODES) {
            const s = finalState.continuous[n];
            if (!s)
                continue;
            const ep = expectedPos(s.posDist);
            const es = expectedSal(s.salDist);
            nodeObservedPos[n].push(ep);
            nodeObservedSal[n].push(es);
            archNode[keyAN(arch.id, n)].observedPos.push(ep);
            archNode[keyAN(arch.id, n)].observedSal.push(es);
        }
        for (const n of CATEGORICAL_NODES) {
            const s = finalState.categorical[n];
            if (!s)
                continue;
            const es = expectedSal(s.salDist);
            nodeObservedSal[n].push(es);
            archNode[keyAN(arch.id, n)].observedSal.push(es);
        }
        runIdx++;
        if (runIdx % 500 === 0 || runIdx === total) {
            const elapsed = (Date.now() - tStart) / 1000;
            const rate = runIdx / elapsed;
            const eta = (total - runIdx) / rate;
            console.log(`  ${runIdx}/${total} runs (${rate.toFixed(0)}/s, ETA ${eta.toFixed(0)}s)`);
        }
    }
}
const elapsed = (Date.now() - tStart) / 1000;
console.log(`Done — ${elapsed.toFixed(1)}s.`);
// ---------------------------------------------------------------------------
// Aggregate & report
// ---------------------------------------------------------------------------
const qStats = stats(questionsAnsweredByArch);
const perNode = {};
for (const n of CONTINUOUS_NODES) {
    perNode[n] = { pos: stats(nodeObservedPos[n]), sal: stats(nodeObservedSal[n]) };
}
for (const n of CATEGORICAL_NODES) {
    perNode[n] = { sal: stats(nodeObservedSal[n]) };
}
// Per-archetype comparison: for each (archetype, node), observed vs target
// Specifically for salience: bucket targets into {0, 1, 2, 3} and report
// the observed mean E[sal] distribution within each bucket. If Bayesian
// is compressed, target=0 archetypes will still show observed E[sal] > 0.5.
const salByTarget = { 0: [], 1: [], 2: [], 3: [] };
const posByTarget = { 1: [], 2: [], 3: [], 4: [], 5: [] };
for (const rec of Object.values(archNode)) {
    if (rec.observedSal.length && rec.targetSal !== undefined) {
        const meanObs = rec.observedSal.reduce((s, x) => s + x, 0) / rec.observedSal.length;
        salByTarget[rec.targetSal].push({ node: rec.node, obs: meanObs });
    }
    if (!rec.isCategorical && rec.observedPos.length && rec.targetPos !== undefined) {
        const meanObs = rec.observedPos.reduce((s, x) => s + x, 0) / rec.observedPos.length;
        posByTarget[rec.targetPos].push({ node: rec.node, obs: meanObs });
    }
}
// ---- Write JSON ----
fs.mkdirSync(OUT_DIR, { recursive: true });
const jsonPath = path.join(OUT_DIR, "coherent-reachability.json");
fs.writeFileSync(jsonPath, JSON.stringify({
    meta: {
        runsPerArchetype: runsPerArch,
        noiseSigma,
        totalRuns: runIdx,
        elapsedSeconds: elapsed,
        questionsAnswered: qStats,
    },
    perNode,
    perArchetypeNode: archNode,
}, null, 2));
console.log(`Wrote ${jsonPath}`);
// ---- Write Markdown ----
const md = [];
md.push(`# Coherent-respondent reachability — ${runIdx} simulated runs\n`);
md.push(`Archetype-optimal answers with noiseSigma=${noiseSigma} jitter. For each active archetype (${activeArchetypes.length}), ${runsPerArch} runs: one clean + ${runsPerArch - 1} jittered. Answers are generated by the harness's archetype-optimal answer generator, not random.\n`);
md.push(`- **Runs**: ${runIdx}`);
md.push(`- **Elapsed**: ${elapsed.toFixed(1)}s`);
md.push(`- **Questions answered**: mean ${qStats.mean.toFixed(1)}, range [${qStats.min}, ${qStats.max}], p5/p95 [${qStats.p5}, ${qStats.p95}]\n`);
md.push(`## Per-node reachability under coherent answering\n`);
md.push(`Compare to \`reachability-range.md\` (random answers). A coherent respondent SHOULD reach both extremes (E[sal] near 0 and 3); if they don't, the Bayesian updater is compressing regardless of evidence.\n`);
md.push(`### Continuous — E[position]\n`);
md.push(`| Node | min | p5 | mean | p95 | max |`);
md.push(`|------|----:|---:|-----:|----:|----:|`);
for (const n of CONTINUOUS_NODES) {
    const s = perNode[n].pos;
    md.push(`| **${n}** | ${s.min.toFixed(2)} | ${s.p5.toFixed(2)} | ${s.mean.toFixed(2)} | ${s.p95.toFixed(2)} | ${s.max.toFixed(2)} |`);
}
md.push("");
md.push(`### Continuous — E[salience]\n`);
md.push(`| Node | min | p5 | mean | p95 | max |`);
md.push(`|------|----:|---:|-----:|----:|----:|`);
for (const n of CONTINUOUS_NODES) {
    const s = perNode[n].sal;
    md.push(`| **${n}** | ${s.min.toFixed(2)} | ${s.p5.toFixed(2)} | ${s.mean.toFixed(2)} | ${s.p95.toFixed(2)} | ${s.max.toFixed(2)} |`);
}
md.push("");
md.push(`### Categorical — E[salience]\n`);
md.push(`| Node | min | p5 | mean | p95 | max |`);
md.push(`|------|----:|---:|-----:|----:|----:|`);
for (const n of CATEGORICAL_NODES) {
    const s = perNode[n].sal;
    md.push(`| **${n}** | ${s.min.toFixed(2)} | ${s.p5.toFixed(2)} | ${s.mean.toFixed(2)} | ${s.p95.toFixed(2)} | ${s.max.toFixed(2)} |`);
}
md.push("");
md.push(`## Observed vs. target — does the posterior track the signature?\n`);
md.push(`For each (archetype, node), take the mean observed E[sal] across runs and group by the archetype's target sal (0–3). Ideal system: target=0 archetypes cluster their observed mean near 0; target=3 near 3. **Compression** shows up as target=0 archetypes with observed means well above 0.5.\n`);
md.push(`### Salience — observed distribution by target bucket\n`);
md.push(`| Target | n (arch×node) | min | p5 | mean | p95 | max |`);
md.push(`|-------:|--------------:|----:|---:|-----:|----:|----:|`);
for (const bkt of [0, 1, 2, 3]) {
    const vals = salByTarget[bkt].map(x => x.obs);
    const s = stats(vals);
    md.push(`| **sal=${bkt}** | ${s.n} | ${s.min.toFixed(2)} | ${s.p5.toFixed(2)} | ${s.mean.toFixed(2)} | ${s.p95.toFixed(2)} | ${s.max.toFixed(2)} |`);
}
md.push("");
md.push(`### Position — observed distribution by target bucket\n`);
md.push(`| Target | n (arch×node) | min | p5 | mean | p95 | max |`);
md.push(`|-------:|--------------:|----:|---:|-----:|----:|----:|`);
for (const bkt of [1, 2, 3, 4, 5]) {
    const vals = posByTarget[bkt].map(x => x.obs);
    const s = stats(vals);
    md.push(`| **pos=${bkt}** | ${s.n} | ${s.min.toFixed(2)} | ${s.p5.toFixed(2)} | ${s.mean.toFixed(2)} | ${s.p95.toFixed(2)} | ${s.max.toFixed(2)} |`);
}
md.push("");
md.push(`## Worst 20 compression pairs — (archetype, node) with target sal=0 but observed mean sal ≥ 1.0\n`);
md.push(`If Bayesian is compressing low salience, this table lists the worst offenders. These are archetypes whose signature says "doesn't care about X" but the posterior refuses to drop below 1.0.\n`);
const worst = salByTarget[0].filter(x => x.obs >= 1.0).sort((a, b) => b.obs - a.obs);
md.push(`Total target=0 (archetype, node) pairs where observed E[sal] ≥ 1.0: **${worst.length} / ${salByTarget[0].length}** (${(100 * worst.length / Math.max(1, salByTarget[0].length)).toFixed(1)}%)\n`);
md.push(`| Rank | Archetype | Node | observed mean E[sal] |`);
md.push(`|-----:|-----------|------|---------------------:|`);
// Need archId for each — rebuild by looking up
const targetZeroList = [];
for (const rec of Object.values(archNode)) {
    if (rec.targetSal === 0 && rec.observedSal.length) {
        const obs = rec.observedSal.reduce((s, x) => s + x, 0) / rec.observedSal.length;
        if (obs >= 1.0)
            targetZeroList.push({ archId: rec.archId, archName: rec.archName, node: rec.node, obs });
    }
}
targetZeroList.sort((a, b) => b.obs - a.obs);
for (let i = 0; i < Math.min(20, targetZeroList.length); i++) {
    const x = targetZeroList[i];
    md.push(`| ${i + 1} | ${x.archId} ${x.archName} | ${x.node} | ${x.obs.toFixed(2)} |`);
}
md.push("");
md.push(`## Worst 20 compression pairs — target sal=3 but observed mean sal ≤ 2.0\n`);
md.push(`Mirror diagnosis — archetypes that say "this is central" but the posterior refuses to reach 2.0+.\n`);
const targetThreeList = [];
for (const rec of Object.values(archNode)) {
    if (rec.targetSal === 3 && rec.observedSal.length) {
        const obs = rec.observedSal.reduce((s, x) => s + x, 0) / rec.observedSal.length;
        if (obs <= 2.0)
            targetThreeList.push({ archId: rec.archId, archName: rec.archName, node: rec.node, obs });
    }
}
targetThreeList.sort((a, b) => a.obs - b.obs);
md.push(`Total target=3 (archetype, node) pairs where observed E[sal] ≤ 2.0: **${targetThreeList.length} / ${salByTarget[3].length}** (${(100 * targetThreeList.length / Math.max(1, salByTarget[3].length)).toFixed(1)}%)\n`);
md.push(`| Rank | Archetype | Node | observed mean E[sal] |`);
md.push(`|-----:|-----------|------|---------------------:|`);
for (let i = 0; i < Math.min(20, targetThreeList.length); i++) {
    const x = targetThreeList[i];
    md.push(`| ${i + 1} | ${x.archId} ${x.archName} | ${x.node} | ${x.obs.toFixed(2)} |`);
}
md.push("");
md.push(`## How to read the verdict\n`);
md.push(`- **If target=0 archetypes cluster near 0** (mean < 0.5): Bayesian works. Random-walk diagnostic was misleading. Keep Bayesian.`);
md.push(`- **If target=0 archetypes stuck ≥ 1.0**: Updater is compressing beyond what evidence explains. Switch to averaging.`);
md.push(`- **If target=3 archetypes stuck ≤ 2.0**: Symmetric compression at the top. Same remedy.`);
md.push(`- **Intermediate cases** (means 0.5–1.0 for target=0): evidence gap — fix authoring, keep Bayesian OR switch to averaging.\n`);
const mdPath = path.join(OUT_DIR, "coherent-reachability.md");
fs.writeFileSync(mdPath, md.join("\n") + "\n");
console.log(`Wrote ${mdPath}`);
//# sourceMappingURL=diagnoseCoherentReach.js.map