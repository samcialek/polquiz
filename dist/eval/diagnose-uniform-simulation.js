/**
 * Uniform-distribution election diagnostic.
 *
 * Instead of simulating the actual quiz from archetype centroids (which
 * concentrates the population at the 121 archetype positions), this sampler
 * imagines a respondent population distributed uniformly across the entire
 * 11-node continuous ideological space. For each hypothetical respondent,
 * run predictVote() against all 60 elections and aggregate winners.
 *
 * This is the "what if every combination of positions was equally likely"
 * counterfactual to the centroid simulation. Useful for seeing which candidates
 * would have broad natural appeal vs. which only win because they align with
 * specific archetype clusters.
 *
 * Sampling:
 *   - each of 11 scoring nodes: position ~ Uniform(1, 5), salience fixed at 2
 *     (matches the ~mean salience seen in centroid sim, so weight structure
 *     is comparable)
 *   - ENG: position ~ Uniform(1, 5) → engagement level bucketed as in
 *     engagementLabel.ts (<2 apolitical, <3 casual, <4 engaged, else highly-engaged)
 *   - categorical nodes (EPS/AES) excluded from distance compute already, so
 *     no sampling needed for them.
 *
 * Output: results/centroid-sim/uniform-frequencies.json, parallel shape to
 * candidate-frequencies.json so centroid-viz.html can toggle between modes.
 *
 * Usage:
 *   npx tsx src/eval/diagnose-uniform-simulation.ts           # default 10k samples
 *   npx tsx src/eval/diagnose-uniform-simulation.ts --samples=50000
 */
import * as fs from "fs";
import * as path from "path";
import { ELECTIONS } from "../historical/candidates.js";
import { getContext } from "../historical/contexts.js";
import { predictVote } from "../historical/respondentVoteChoice.js";
const SCORING_NODES = ["MAT", "CD", "CU", "MOR", "PRO", "COM", "ZS", "ONT_H", "ONT_S", "PF", "TRB"];
function getArg(name, def) {
    const match = process.argv.find((a) => a.startsWith(`--${name}=`));
    if (!match)
        return def;
    const val = match.split("=")[1];
    return (typeof def === "number" ? parseFloat(val ?? "") : val);
}
const NUM_SAMPLES = getArg("samples", 10000);
const FIXED_SAL = getArg("sal", 2); // matches centroid-sim mean
const SEED_OFFSET = getArg("seed", 0);
// Deterministic-ish PRNG so runs are reproducible
function mulberry32(seed) {
    let a = seed >>> 0;
    return function () {
        a = (a + 0x6d2b79f5) >>> 0;
        let t = a;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}
const rand = mulberry32(12345 + SEED_OFFSET);
const uniformPos = () => 1 + rand() * 4;
function engagementLevelFromPos(pos) {
    if (pos < 2.0)
        return "apolitical";
    if (pos < 3.0)
        return "casual";
    if (pos < 4.0)
        return "engaged";
    return "highly-engaged";
}
const globalElectionWinners = {};
for (const e of ELECTIONS)
    globalElectionWinners[e.year] = {};
console.log("=== Uniform-Distribution Election Diagnostic ===");
console.log(`Samples:         ${NUM_SAMPLES.toLocaleString()}`);
console.log(`Sal (fixed):     ${FIXED_SAL}`);
console.log(`Elections:       ${ELECTIONS.length}`);
console.log(`Total preds:     ${(NUM_SAMPLES * ELECTIONS.length).toLocaleString()}`);
console.log();
const t0 = Date.now();
for (let s = 0; s < NUM_SAMPLES; s++) {
    const sig = {};
    for (const node of SCORING_NODES) {
        sig[node] = {
            pos: uniformPos(),
            sal: FIXED_SAL,
        };
    }
    const engPos = uniformPos();
    const engLevel = engagementLevelFromPos(engPos);
    for (const election of ELECTIONS) {
        const ctx = getContext(election.year);
        if (!ctx)
            continue;
        const pred = predictVote(sig, election.candidates, ctx, engLevel);
        const winner = pred.decision === "vote" ? pred.nearest.name : "ABSTAIN";
        globalElectionWinners[election.year][winner] =
            (globalElectionWinners[election.year][winner] ?? 0) + 1;
    }
    if ((s + 1) % 1000 === 0) {
        const elapsed = (Date.now() - t0) / 1000;
        const rate = (s + 1) / elapsed;
        const eta = (NUM_SAMPLES - s - 1) / rate;
        console.log(`  ${s + 1}/${NUM_SAMPLES} samples — ${rate.toFixed(0)}/s, ETA ${Math.round(eta)}s`);
    }
}
// ─── Write output ─────────────────────────────────────────────────────────
const outDir = path.join("results", "centroid-sim");
fs.mkdirSync(outDir, { recursive: true });
const flat = [];
for (const [year, counts] of Object.entries(globalElectionWinners)) {
    for (const [cand, count] of Object.entries(counts)) {
        flat.push({
            year: parseInt(year),
            candidate: cand,
            count,
            pct: Math.round((count / NUM_SAMPLES) * 10000) / 100,
        });
    }
}
flat.sort((a, b) => a.year - b.year || b.count - a.count);
fs.writeFileSync(path.join(outDir, "uniform-frequencies.json"), JSON.stringify({
    meta: {
        mode: "uniform",
        totalRuns: NUM_SAMPLES,
        archetypes: 0,
        repsPerArchetype: 0,
        noiseSigma: 0,
        runsPerElection: NUM_SAMPLES,
        samplingNote: "Respondent positions drawn ~Uniform(1,5) across all 11 scoring nodes; " +
            `salience fixed at ${FIXED_SAL}; ENG position ~Uniform(1,5) for engagement bucket.`,
    },
    frequencies: flat,
}, null, 2));
// ─── Console summary ─────────────────────────────────────────────────────
console.log();
console.log(`=== Summary (${(Date.now() - t0) / 1000}s) ===`);
console.log(`Total samples: ${NUM_SAMPLES.toLocaleString()}`);
console.log(`Output: ${path.join(outDir, "uniform-frequencies.json")}`);
console.log();
console.log("Per-election top-3 winners under uniform-respondent hypothesis:");
for (const year of Object.keys(globalElectionWinners).sort()) {
    const counts = globalElectionWinners[parseInt(year)];
    const ranked = Object.entries(counts).sort(([, a], [, b]) => b - a);
    const top3 = ranked
        .slice(0, 3)
        .map(([c, n]) => `${c} ${((n / NUM_SAMPLES) * 100).toFixed(0)}%`)
        .join(", ");
    console.log(`  ${year}: ${top3}`);
}
//# sourceMappingURL=diagnose-uniform-simulation.js.map