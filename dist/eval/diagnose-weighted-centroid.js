/**
 * Population-weighted centroid diagnostic.
 *
 * Like diagnose-centroid-simulation but aggregates each archetype's predicted
 * votes by the archetype's empirical population weight (from
 * output/live-data/population-weights.json) rather than treating every
 * archetype as equally frequent. This lets us compare the simulation to real
 * popular-vote shares under a realistic population mix.
 *
 * For each archetype A:
 *   - run NUM_REPS quiz simulations with noise
 *   - for each run, compute predicted election winner per year
 *   - the archetype's "vote share" per year is the fraction of reps picking
 *     each candidate
 *   - aggregate across archetypes weighted by POP[A]
 *
 * Output: results/centroid-sim/weighted-frequencies.json (plus ON/OFF variants).
 *
 * Usage:
 *   npx tsx src/eval/diagnose-weighted-centroid.ts              # non-ideo ON
 *   PRISM_NONIDEO=0 npx tsx src/eval/diagnose-weighted-centroid.ts  # non-ideo OFF
 *   npx tsx src/eval/diagnose-weighted-centroid.ts --reps=10
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
    const m = process.argv.find((a) => a.startsWith(`--${name}=`));
    if (!m)
        return def;
    const v = m.split("=")[1];
    return (typeof def === "number" ? parseFloat(v ?? "") : v);
}
const NUM_REPS = getArg("reps", 10);
const NOISE_SIGMA = getArg("noise", 0.3);
const NONIDEO_ON = process.env.PRISM_NONIDEO !== "0";
resetConfig();
const active = ARCHETYPES.filter((a) => !DEACTIVATED.has(a.id));
// Load population weights; fall back to uniform if missing/zero
const rawWeights = JSON.parse(fs.readFileSync(path.join("output", "live-data", "population-weights.json"), "utf-8"));
const weights = {};
let totalMass = 0;
for (const a of active) {
    const w = rawWeights[a.id] ?? 0;
    weights[a.id] = w;
    totalMass += w;
}
// Renormalize over the 121 active archetypes (in case any weights reference
// deactivated IDs or missing entries exist).
for (const a of active)
    weights[a.id] = weights[a.id] / (totalMass || 1);
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
console.log("=== Weighted Centroid Diagnostic ===");
console.log(`Mode:         ${NONIDEO_ON ? "NON-IDEO ON" : "NON-IDEO OFF"}`);
console.log(`Archetypes:   ${active.length} (weighted)`);
console.log(`Reps/arch:    ${NUM_REPS}`);
console.log(`Noise sigma:  ${NOISE_SIGMA}`);
console.log();
// For each (year, candidate): accumulate weighted vote share
const winners = {};
for (const e of ELECTIONS)
    winners[e.year] = {};
const t0 = Date.now();
let totalRuns = 0;
for (let a = 0; a < active.length; a++) {
    const target = active[a];
    const w = weights[target.id] ?? 0;
    if (w === 0)
        continue; // zero-weight archetypes don't contribute
    // Tally this archetype's votes across N reps
    const archVotes = {};
    for (const e of ELECTIONS)
        archVotes[e.year] = {};
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
        for (const election of ELECTIONS) {
            const ctx = getContext(election.year);
            if (!ctx)
                continue;
            const pred = predictVote(sig, election.candidates, ctx, eng);
            const winner = pred.decision === "vote" ? pred.nearest.name : "ABSTAIN";
            archVotes[election.year][winner] = (archVotes[election.year][winner] ?? 0) + 1;
        }
        totalRuns++;
    }
    // Accumulate weighted shares
    for (const yr of Object.keys(archVotes)) {
        const yrNum = parseInt(yr);
        const totalArchRuns = Object.values(archVotes[yrNum]).reduce((s, v) => s + v, 0);
        if (totalArchRuns === 0)
            continue;
        for (const [cand, count] of Object.entries(archVotes[yrNum])) {
            const archShare = count / totalArchRuns;
            winners[yrNum][cand] = (winners[yrNum][cand] ?? 0) + archShare * w;
        }
    }
    if ((a + 1) % 20 === 0 || a === active.length - 1) {
        const elapsed = (Date.now() - t0) / 1000;
        console.log(`  ${a + 1}/${active.length} arch — ${totalRuns} runs, ${(totalRuns / elapsed).toFixed(0)}/s`);
    }
}
const outDir = path.join("results", "centroid-sim");
fs.mkdirSync(outDir, { recursive: true });
const flat = [];
for (const [year, counts] of Object.entries(winners)) {
    for (const [cand, share] of Object.entries(counts)) {
        flat.push({
            year: parseInt(year),
            candidate: cand,
            count: Math.round(share * 1000000),
            pct: Math.round(share * 10000) / 100,
        });
    }
}
flat.sort((a, b) => a.year - b.year || b.pct - a.pct);
fs.writeFileSync(path.join(outDir, `weighted-frequencies${NONIDEO_ON ? "-NONIDEO-ON" : "-NONIDEO-OFF"}.json`), JSON.stringify({
    meta: {
        mode: "weighted-centroid",
        nonIdeo: NONIDEO_ON,
        archetypes: active.length,
        repsPerArchetype: NUM_REPS,
        totalRuns,
        populationWeights: "output/live-data/population-weights.json",
        note: "Each archetype's vote share contributes to the aggregate weighted by its empirical population frequency.",
    },
    frequencies: flat,
}, null, 2));
console.log();
console.log(`Done in ${((Date.now() - t0) / 1000).toFixed(1)}s`);
console.log();
console.log("Per-election top-3 (weighted):");
for (const yr of Object.keys(winners).sort()) {
    const counts = winners[parseInt(yr)];
    const ranked = Object.entries(counts).sort(([, a], [, b]) => b - a);
    const top3 = ranked.slice(0, 3).map(([c, s]) => `${c} ${(s * 100).toFixed(0)}%`).join(", ");
    console.log(`  ${yr}: ${top3}`);
}
//# sourceMappingURL=diagnose-weighted-centroid.js.map