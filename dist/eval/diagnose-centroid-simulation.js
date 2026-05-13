/**
 * Centroid-simulation diagnostic (2026-04-23).
 *
 * For each active archetype, run N simulations as if a respondent sits at the
 * archetype centroid plus a small amount of noise. Each simulation goes through
 * the actual quiz engine — FIXED_OPENER + adaptive selector + stop rule, via
 * harness.simulateOne() which uses the same update/nextQuestion/stopRule code
 * paths as the live browser quiz. After each simulated quiz completes, run
 * predictVote() for all 60 US presidential elections with era activation.
 *
 * Outputs (under results/centroid-sim/):
 *   - per-archetype-stats.json  — per-archetype node-signature stats (mean ±
 *                                 stddev over N reps) and per-election winner
 *                                 distributions for that archetype's centroid
 *   - candidate-frequencies.json — global per-election winner frequencies
 *                                  across every (archetype × rep) draw
 *   - signatures.jsonl          — one line per run with {archId, rep, sig}
 *
 * Usage:
 *   npx tsx src/eval/diagnose-centroid-simulation.ts            # full run
 *   npx tsx src/eval/diagnose-centroid-simulation.ts --smoke    # 10 arc × 5 reps
 *   npx tsx src/eval/diagnose-centroid-simulation.ts --reps=50
 *   npx tsx src/eval/diagnose-centroid-simulation.ts --noise=0.5
 */
import * as fs from "fs";
import * as path from "path";
import { ARCHETYPES } from "../config/archetypes.js";
import { REPRESENTATIVE_QUESTIONS } from "../config/questions.representative.js";
import { ELECTIONS } from "../historical/candidates.js";
import { getContext } from "../historical/contexts.js";
import { predictVote } from "../historical/respondentVoteChoice.js";
import { resetConfig } from "../optimize/runtimeConfig.js";
import { simulateOne } from "./harness.js";
import { isSelfNode } from "../config/nodes.js";
const DEACTIVATED = new Set(["019", "023", "025"]);
function getArg(name, def) {
    const match = process.argv.find((a) => a.startsWith(`--${name}=`));
    if (!match)
        return def;
    const val = match.split("=")[1];
    return (typeof def === "number" ? parseFloat(val ?? "") : val);
}
const isSmoke = process.argv.includes("--smoke");
const NUM_REPS = isSmoke ? 5 : getArg("reps", 10);
const NOISE_SIGMA = getArg("noise", 0.3);
const SMOKE_ARCH_COUNT = 10;
resetConfig();
const allActive = ARCHETYPES.filter((a) => !DEACTIVATED.has(a.id));
const targets = isSmoke ? allActive.slice(0, SMOKE_ARCH_COUNT) : allActive;
// ─── Utilities ─────────────────────────────────────────────────────────────
function signatureFromSnapshot(snap) {
    const sig = {};
    for (const [nodeId, node] of Object.entries(snap.continuous)) {
        const pos = node.posDist.reduce((e, p, i) => e + p * (i + 1), 0);
        const sal = isSelfNode(nodeId)
            ? ((pos - 1) / 4) * 3
            : node.salDist.reduce((e, s, i) => e + s * i, 0);
        sig[nodeId] = { pos, sal };
    }
    for (const [nodeId, node] of Object.entries(snap.categorical)) {
        const pos = node.catDist.reduce((e, p, i) => e + p * i, 0);
        const sal = node.salDist.reduce((e, s, i) => e + s * i, 0);
        sig[nodeId] = { pos, sal };
    }
    return sig;
}
function engagementLevelFromSnapshot(snap) {
    const posDist = snap.continuous.ENG?.posDist;
    if (!posDist)
        return "engaged";
    const pos = posDist.reduce((e, p, i) => e + p * (i + 1), 0);
    if (pos < 2.0)
        return "apolitical";
    if (pos < 3.0)
        return "casual";
    if (pos < 4.0)
        return "engaged";
    return "highly-engaged";
}
function round(n, d) {
    const f = 10 ** d;
    return Math.round(n * f) / f;
}
const perArchetypeStats = [];
const globalElectionWinners = {};
for (const e of ELECTIONS)
    globalElectionWinners[e.year] = {};
const outDir = path.join("results", "centroid-sim");
fs.mkdirSync(outDir, { recursive: true });
const sigStream = fs.createWriteStream(path.join(outDir, "signatures.jsonl"), {
    encoding: "utf-8",
});
const totalPlanned = targets.length * NUM_REPS;
let totalRuns = 0;
const t0 = Date.now();
console.log("=== Centroid Simulation Diagnostic ===");
console.log(`Mode:            ${isSmoke ? "SMOKE" : "FULL"}`);
console.log(`Archetypes:      ${targets.length}`);
console.log(`Reps/archetype:  ${NUM_REPS}`);
console.log(`Noise sigma:     ${NOISE_SIGMA}`);
console.log(`Total runs:      ${totalPlanned}`);
console.log(`Elections/run:   ${ELECTIONS.length}`);
console.log();
for (let a = 0; a < targets.length; a++) {
    const target = targets[a];
    const positions = {};
    const saliences = {};
    const electionCounts = {};
    for (const e of ELECTIONS)
        electionCounts[e.year] = {};
    for (let r = 0; r < NUM_REPS; r++) {
        const seed = a * 10000 + r * 7 + 1;
        const run = simulateOne(target, ARCHETYPES, REPRESENTATIVE_QUESTIONS, {
            noiseSigma: NOISE_SIGMA,
            seed,
            maxQuestions: 65,
            captureDistances: false,
            captureNodeStates: true,
        });
        if (!run.nodeFinalState)
            continue;
        const sig = signatureFromSnapshot(run.nodeFinalState);
        const eng = engagementLevelFromSnapshot(run.nodeFinalState);
        for (const [nodeId, entry] of Object.entries(sig)) {
            if (!entry)
                continue;
            (positions[nodeId] ??= []).push(entry.pos);
            (saliences[nodeId] ??= []).push(entry.sal);
        }
        const electionPicks = {};
        for (const election of ELECTIONS) {
            const ctx = getContext(election.year);
            if (!ctx)
                continue;
            const pred = predictVote(sig, election.candidates, ctx, eng);
            const winner = pred.decision === "vote" ? pred.nearest.name : "ABSTAIN";
            electionCounts[election.year][winner] =
                (electionCounts[election.year][winner] ?? 0) + 1;
            globalElectionWinners[election.year][winner] =
                (globalElectionWinners[election.year][winner] ?? 0) + 1;
            electionPicks[election.year] = winner;
        }
        // Write per-run signature line (sparse — just expected values per node)
        const sigSparse = {};
        for (const [nodeId, entry] of Object.entries(sig)) {
            if (entry)
                sigSparse[nodeId] = [round(entry.pos, 3), round(entry.sal, 3)];
        }
        sigStream.write(JSON.stringify({
            arc: target.id,
            rep: r,
            result: run.resultId,
            sig: sigSparse,
            eng,
            elections: electionPicks,
        }) + "\n");
        totalRuns++;
    }
    const nodeStats = {};
    for (const nodeId of Object.keys(positions)) {
        const posList = positions[nodeId];
        const salList = saliences[nodeId];
        const n = posList.length;
        const posMean = posList.reduce((s, v) => s + v, 0) / n;
        const salMean = salList.reduce((s, v) => s + v, 0) / n;
        const posVar = posList.reduce((s, v) => s + (v - posMean) ** 2, 0) / n;
        const salVar = salList.reduce((s, v) => s + (v - salMean) ** 2, 0) / n;
        nodeStats[nodeId] = {
            posMean: round(posMean, 3),
            salMean: round(salMean, 3),
            posStddev: round(Math.sqrt(posVar), 3),
            salStddev: round(Math.sqrt(salVar), 3),
        };
    }
    perArchetypeStats.push({
        id: target.id,
        name: target.name,
        runs: NUM_REPS,
        nodeStats,
        electionWinners: electionCounts,
    });
    if ((a + 1) % 10 === 0 || a === targets.length - 1) {
        const pct = (((a + 1) / targets.length) * 100).toFixed(1);
        const elapsed = (Date.now() - t0) / 1000;
        const rate = totalRuns / elapsed;
        const eta = (totalPlanned - totalRuns) / rate;
        console.log(`[${pct}%] ${a + 1}/${targets.length} archetypes — ${totalRuns} runs, ` +
            `${rate.toFixed(1)}/s, ETA ${Math.round(eta)}s`);
    }
}
sigStream.end();
// ─── Write output files ────────────────────────────────────────────────────
fs.writeFileSync(path.join(outDir, "per-archetype-stats.json"), JSON.stringify(perArchetypeStats, null, 2));
const runsPerYear = targets.length * NUM_REPS;
const globalFlat = [];
for (const [year, counts] of Object.entries(globalElectionWinners)) {
    for (const [cand, count] of Object.entries(counts)) {
        globalFlat.push({
            year: parseInt(year),
            candidate: cand,
            count,
            pct: round((count / runsPerYear) * 100, 2),
        });
    }
}
globalFlat.sort((a, b) => a.year - b.year || b.count - a.count);
fs.writeFileSync(path.join(outDir, "candidate-frequencies.json"), JSON.stringify({
    meta: {
        totalRuns,
        archetypes: targets.length,
        repsPerArchetype: NUM_REPS,
        noiseSigma: NOISE_SIGMA,
        runsPerElection: runsPerYear,
        smoke: isSmoke,
    },
    frequencies: globalFlat,
}, null, 2));
// ─── Console summary ───────────────────────────────────────────────────────
console.log();
console.log("=== Summary ===");
console.log(`Total runs:   ${totalRuns}`);
console.log(`Wall time:    ${((Date.now() - t0) / 1000).toFixed(1)}s`);
console.log(`Output dir:   ${outDir}`);
console.log();
console.log("Per-election top-3 candidates (across all runs):");
for (const year of Object.keys(globalElectionWinners).sort()) {
    const counts = globalElectionWinners[parseInt(year)];
    if (!counts || Object.keys(counts).length === 0)
        continue;
    const ranked = Object.entries(counts).sort(([, a], [, b]) => b - a);
    const top3 = ranked
        .slice(0, 3)
        .map(([c, n]) => `${c} ${((n / runsPerYear) * 100).toFixed(0)}%`)
        .join(", ");
    console.log(`  ${year}: ${top3}`);
}
console.log();
console.log("Global node-signature distribution (mean ± stddev across all runs):");
// Aggregate across all archetypes
const globalPos = {};
const globalSal = {};
for (const s of perArchetypeStats) {
    for (const [nodeId, ns] of Object.entries(s.nodeStats)) {
        (globalPos[nodeId] ??= []).push(ns.posMean);
        (globalSal[nodeId] ??= []).push(ns.salMean);
    }
}
for (const nodeId of Object.keys(globalPos).sort()) {
    const pos = globalPos[nodeId];
    const sal = globalSal[nodeId];
    const posMin = Math.min(...pos);
    const posMax = Math.max(...pos);
    const posMean = pos.reduce((a, b) => a + b, 0) / pos.length;
    const salMean = sal.reduce((a, b) => a + b, 0) / sal.length;
    console.log(`  ${nodeId.padEnd(6)}  pos ${posMean.toFixed(2)} [${posMin.toFixed(2)}–${posMax.toFixed(2)}]  sal ${salMean.toFixed(2)}`);
}
//# sourceMappingURL=diagnose-centroid-simulation.js.map