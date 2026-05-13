// Node-coverage analysis: run the 121-archetype simulation with node-state
// capture, then report (a) avg questions asked and (b) per-node posterior
// ranges across all archetype runs.
import { ARCHETYPES } from "../config/archetypes.js";
import { REPRESENTATIVE_QUESTIONS } from "../config/questions.representative.js";
import { simulateOne } from "./harness.js";
import { CONTINUOUS_NODES, CATEGORICAL_NODES } from "../config/nodes.js";
const EPS_CATS = ["empiricist", "institutionalist", "traditionalist", "intuitionist", "autonomous", "nihilist"];
const AES_CATS = ["statesman", "technocrat", "pastoral", "plainspoken", "fighter", "visionary"];
function meanPos(dist) {
    let s = 0;
    for (let i = 0; i < dist.length; i++)
        s += (i + 1) * (dist[i] ?? 0);
    return s;
}
function meanSal(salDist) {
    let s = 0;
    for (let i = 0; i < salDist.length; i++)
        s += i * (salDist[i] ?? 0);
    return s;
}
function argmax(dist) {
    let best = 0, bv = -Infinity;
    for (let i = 0; i < dist.length; i++)
        if ((dist[i] ?? 0) > bv) {
            bv = dist[i];
            best = i;
        }
    return best;
}
function fmt(n, d = 2) {
    return n.toFixed(d).padStart(d + 3);
}
function stats(arr) {
    const sorted = [...arr].sort((a, b) => a - b);
    const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
    return {
        min: sorted[0],
        max: sorted[sorted.length - 1],
        mean,
        p50: sorted[Math.floor(sorted.length / 2)],
    };
}
const active = ARCHETYPES.filter(a => a.active !== false);
console.log(`Running ${active.length} archetype simulations (noiseSigma=0, captureNodeStates=true)…\n`);
const runs = active.map(a => simulateOne(a, ARCHETYPES, REPRESENTATIVE_QUESTIONS, {
    noiseSigma: 0,
    captureNodeStates: true,
}));
const qAnswered = runs.map(r => r.questionsAnswered);
const qStats = stats(qAnswered);
console.log("=== Questions asked per respondent ===");
console.log(`  mean ${qStats.mean.toFixed(1)}  median ${qStats.p50}  min ${qStats.min}  max ${qStats.max}\n`);
console.log("=== Continuous nodes — posterior mean-position range across 121 archetypes ===");
console.log("  node    pos[min/mean/max]     sal[min/mean/max]     argmax-spread");
console.log("  ------  --------------------  --------------------  -------------");
const nonEngContinuous = CONTINUOUS_NODES.filter(n => n !== "ENG");
for (const nodeId of nonEngContinuous) {
    const posMeans = [];
    const salMeans = [];
    const argmaxes = [];
    for (const r of runs) {
        const state = r.nodeFinalState.continuous[nodeId];
        posMeans.push(meanPos(state.posDist));
        salMeans.push(meanSal(state.salDist));
        argmaxes.push(argmax(state.posDist) + 1);
    }
    const ps = stats(posMeans);
    const ss = stats(salMeans);
    const amMin = Math.min(...argmaxes), amMax = Math.max(...argmaxes);
    console.log(`  ${nodeId.padEnd(6)}  ${fmt(ps.min)}/${fmt(ps.mean)}/${fmt(ps.max)}   ` +
        `${fmt(ss.min)}/${fmt(ss.mean)}/${fmt(ss.max)}   ` +
        `pos ${amMin}–${amMax}`);
}
console.log("\n=== Categorical nodes — posterior argmax category range across 121 archetypes ===");
console.log("  node  cats-used  sal[min/mean/max]     argmax-categories");
console.log("  ----  ---------  --------------------  -----------------------------");
for (const nodeId of CATEGORICAL_NODES) {
    const salMeans = [];
    const argmaxes = new Set();
    for (const r of runs) {
        const state = r.nodeFinalState.categorical[nodeId];
        salMeans.push(meanSal(state.salDist));
        argmaxes.add(argmax(state.catDist));
    }
    const ss = stats(salMeans);
    const cats = nodeId === "EPS" ? EPS_CATS : AES_CATS;
    const used = [...argmaxes].sort((a, b) => a - b).map(i => cats[i]).join(", ");
    console.log(`  ${nodeId.padEnd(4)}  ${argmaxes.size}/6        ` +
        `${fmt(ss.min)}/${fmt(ss.mean)}/${fmt(ss.max)}   ` +
        `${used}`);
}
console.log("\n=== ENG (non-signature, engagement label layer) ===");
const engPos = [];
const engSal = [];
for (const r of runs) {
    const state = r.nodeFinalState.continuous.ENG;
    engPos.push(meanPos(state.posDist));
    engSal.push(meanSal(state.salDist));
}
const eps_ = stats(engPos);
const ess_ = stats(engSal);
console.log(`  ENG     ${fmt(eps_.min)}/${fmt(eps_.mean)}/${fmt(eps_.max)}   ${fmt(ess_.min)}/${fmt(ess_.mean)}/${fmt(ess_.max)}`);
console.log("\nNote: pos scale 1–5, sal scale 0–3. Range spans the full set of 121 archetype profiles.");
//# sourceMappingURL=nodeCoverage.js.map