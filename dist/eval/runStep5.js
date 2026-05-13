// @ts-nocheck
// PENDING PHASE-3 PORT — Step-5 node-state capture writes pre-Phase-3 SimRun
// fields. Phase 3g rebuilds against the distance-native SimRun shape.
/**
 * Step 5: node-state capture run.
 *
 * Supplementary to Step 3. Captures per-question node-state deltas
 * (posDist/salDist/catDist before+after for each touched node) and the final
 * node snapshot, so we can compute per-dimension and per-UI-type × per-
 * dimension variance reduction metrics.
 *
 * Grid: σ=0 at N=1 (jitterArchetype short-circuits at σ=0 and no other RNG
 * consumer fires, so all 200 reps are byte-identical — N=1 is sufficient),
 * σ=0.5 and σ=1.5 at N=200 each. Total = 121 + 24,200 + 24,200 = 48,521 runs.
 *
 * This preserves the statistical power the user asked for on the noisy σ
 * levels (where variance reduction per dimension is discriminated) while
 * cutting ~30 min from what would otherwise be wasted σ=0 compute.
 *
 * Usage:
 *   npx tsx src/eval/runStep5.ts            # full
 *   npx tsx src/eval/runStep5.ts --smoke    # 5 archetypes × 2 reps × 3 σ = 30 runs
 */
import * as fs from "fs";
import * as path from "path";
import * as crypto from "crypto";
import { execSync } from "child_process";
import { ARCHETYPES } from "../config/archetypes.js";
import { REPRESENTATIVE_QUESTIONS } from "../config/questions.representative.js";
import { resetConfig } from "../optimize/runtimeConfig.js";
import { simulateOne } from "./harness.js";
const NOISE_LEVELS = [
    { sigma: 0, reps: 1 },
    { sigma: 0.5, reps: 200 },
    { sigma: 1.5, reps: 200 },
];
const POSTERIOR_THRESHOLD = 1e-6;
const POSTERIOR_DECIMALS = 6;
const DEACTIVATED_IDS = new Set(["019", "023", "025"]);
const ENGINE_FILES = [
    "src/types.ts",
    "src/config/archetypes.ts",
    "src/config/questions.representative.ts",
    "src/config/normalization.ts",
    "src/config/categories.ts",
    "src/config/nodes.ts",
    "src/engine/update.ts",
    "src/engine/nextQuestion.ts",
    "src/engine/stopRule.ts",
    "src/engine/archetypeDistance.ts",
    "src/optimize/runtimeConfig.ts",
    "src/eval/harness.ts",
    "src/eval/noise.ts",
    "src/eval/rng.ts",
];
function sigmaToTag(sigma) {
    return String(Math.round(sigma * 10)).padStart(2, "0");
}
function makeSeed(sigmaIdx, archetypeIdx, rep) {
    return sigmaIdx * 1_000_000 + archetypeIdx * 1000 + rep;
}
function sparsifyPosterior(p) {
    const out = {};
    const factor = Math.pow(10, POSTERIOR_DECIMALS);
    for (const [k, v] of Object.entries(p)) {
        if (v >= POSTERIOR_THRESHOLD)
            out[k] = Math.round(v * factor) / factor;
    }
    return out;
}
function fileSha256(absPath) {
    return crypto.createHash("sha256").update(fs.readFileSync(absPath)).digest("hex");
}
function gitInfo() {
    try {
        const sha = execSync("git rev-parse HEAD", { encoding: "utf-8" }).trim();
        const branch = execSync("git rev-parse --abbrev-ref HEAD", { encoding: "utf-8" }).trim();
        const status = execSync("git status --porcelain", { encoding: "utf-8" });
        const dirty = status
            .split("\n")
            .some(l => l.trim() && !l.includes("results/") && !l.includes(".claude/"));
        return { sha, branch, dirty };
    }
    catch {
        return { sha: "unknown", branch: "unknown", dirty: false };
    }
}
function runToRow(run, archetypePrior, sigmaIdx, archetypeIdx, rep) {
    return {
        archetypeId: run.archetypeId,
        archetypeName: run.archetypeName,
        archetypePrior,
        noiseSigma: run.noiseSigma,
        sigmaIdx,
        archetypeIdx,
        rep,
        seed: run.seed,
        resultId: run.resultId,
        resultName: run.resultName,
        correct: run.correct,
        questionsAsked: run.questionsAnswered,
        topPosterior: run.topPosterior,
        margin: run.margin,
        rank: run.rank,
        top5: run.top5,
        stopFired: run.stopFired,
        familyPairDetected: run.familyPairDetected,
        posteriorFinal: sparsifyPosterior(run.posteriorFinal ?? {}),
        nodeTrajectory: run.nodeTrajectory ?? [],
        nodeFinalState: run.nodeFinalState ?? null,
    };
}
async function main() {
    const args = process.argv.slice(2);
    const isSmoke = args.includes("--smoke");
    resetConfig();
    const archetypes = ARCHETYPES;
    const questions = REPRESENTATIVE_QUESTIONS;
    const archetypeCount = isSmoke ? 5 : archetypes.length;
    const targets = archetypes.slice(0, archetypeCount);
    const levels = isSmoke
        ? [
            { sigma: 0, reps: 2 },
            { sigma: 0.5, reps: 2 },
            { sigma: 1.5, reps: 2 },
        ]
        : NOISE_LEVELS;
    const totalRuns = levels.reduce((s, l) => s + l.reps * archetypeCount, 0);
    const outDir = path.join(process.cwd(), "results", isSmoke ? "step5-smoke" : "step5");
    fs.mkdirSync(outDir, { recursive: true });
    console.log("=== Step 5: node-state capture run ===");
    console.log(`Mode:        ${isSmoke ? "SMOKE" : "FULL"}`);
    console.log(`Archetypes:  ${archetypeCount}`);
    console.log(`Grid:`);
    for (const l of levels)
        console.log(`  σ=${l.sigma}: N=${l.reps} (${l.reps * archetypeCount} runs)`);
    console.log(`Total runs:  ${totalRuns}`);
    console.log(`Output:      ${outDir}`);
    console.log();
    const engineHashes = {};
    for (const f of ENGINE_FILES) {
        const abs = path.join(process.cwd(), f);
        if (fs.existsSync(abs))
            engineHashes[f] = fileSha256(abs);
    }
    const git = gitInfo();
    const startedAt = new Date().toISOString();
    const t0 = Date.now();
    let runsCompleted = 0;
    let deactivatedWins = 0;
    const deactivatedWinSamples = [];
    const fileStats = [];
    for (let sigmaIdx = 0; sigmaIdx < levels.length; sigmaIdx++) {
        const { sigma, reps } = levels[sigmaIdx];
        const filePath = path.join(outDir, `sigma-${sigmaToTag(sigma)}.jsonl`);
        const ws = fs.createWriteStream(filePath, { encoding: "utf-8" });
        console.log(`[σ=${sigma}] writing ${filePath} (N=${reps})`);
        const sigmaT0 = Date.now();
        for (let aIdx = 0; aIdx < targets.length; aIdx++) {
            const target = targets[aIdx];
            for (let rep = 0; rep < reps; rep++) {
                const seed = makeSeed(sigmaIdx, aIdx, rep);
                const run = simulateOne(target, archetypes, questions, {
                    noiseSigma: sigma,
                    seed,
                    maxQuestions: 65,
                    capturePosterior: true,
                    captureNodeStates: true,
                });
                const row = runToRow(run, target.prior, sigmaIdx, aIdx, rep);
                ws.write(JSON.stringify(row) + "\n");
                if (DEACTIVATED_IDS.has(run.resultId)) {
                    deactivatedWins++;
                    if (deactivatedWinSamples.length < 20) {
                        deactivatedWinSamples.push({ sigma, seed, archetypeId: run.archetypeId, resultId: run.resultId });
                    }
                }
                runsCompleted++;
            }
            if ((aIdx + 1) % 10 === 0 || aIdx === targets.length - 1) {
                const pct = ((runsCompleted / totalRuns) * 100).toFixed(1);
                const elapsedMin = ((Date.now() - t0) / 60000).toFixed(1);
                const ratePerSec = (runsCompleted / ((Date.now() - t0) / 1000)).toFixed(1);
                const remaining = totalRuns - runsCompleted;
                const etaMin = (remaining / parseFloat(ratePerSec) / 60).toFixed(1);
                console.log(`  [σ=${sigma}] ${aIdx + 1}/${targets.length} archetypes — ` +
                    `${runsCompleted}/${totalRuns} (${pct}%) ` +
                    `elapsed ${elapsedMin}m, ${ratePerSec}/s, ETA ${etaMin}m`);
            }
        }
        ws.end();
        await new Promise(r => ws.on("close", () => r()));
        const sigmaSec = ((Date.now() - sigmaT0) / 1000).toFixed(1);
        const stat = fs.statSync(filePath);
        fileStats.push({ sigma, reps, file: path.basename(filePath), runs: reps * targets.length, bytes: stat.size });
        console.log(`  [σ=${sigma}] done in ${sigmaSec}s. Size: ${(stat.size / 1e6).toFixed(1)} MB`);
    }
    const elapsedSec = ((Date.now() - t0) / 1000).toFixed(1);
    const finishedAt = new Date().toISOString();
    const manifest = {
        startedAt,
        finishedAt,
        elapsedSec: +elapsedSec,
        git,
        engineHashes,
        config: {
            archetypeCount: targets.length,
            activeArchetypeCount: targets.filter(a => !DEACTIVATED_IDS.has(a.id)).length,
            deactivatedIds: [...DEACTIVATED_IDS],
            questionCount: questions.length,
            noiseLevels: levels,
            maxQuestions: 65,
            captureNodeStates: true,
            sigmaZeroDedupNote: "σ=0 run at N=1 because jitterArchetype short-circuits at σ=0 and no other RNG consumer fires — all reps of the same archetype at σ=0 are byte-identical, so N=1 is statistically equivalent to N=200 without the compute cost.",
        },
        seedScheme: "seed = sigmaIdx * 1_000_000 + archetypeIdx * 1000 + rep",
        posteriorEncoding: { sparsityThreshold: POSTERIOR_THRESHOLD, decimals: POSTERIOR_DECIMALS },
        nodeStateEncoding: { decimals: 6, format: "per-question deltas (only changed dists) + final snapshot" },
        files: fileStats,
        sanity: {
            deactivatedIds: [...DEACTIVATED_IDS],
            deactivatedAsMapWinCount: deactivatedWins,
            deactivatedWinSamples,
            pass: deactivatedWins === 0,
        },
        totalRuns: runsCompleted,
    };
    const manifestPath = path.join(outDir, "manifest.json");
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
    console.log();
    console.log("=== Done ===");
    console.log(`Total runs:           ${runsCompleted}`);
    console.log(`Wall time:            ${elapsedSec}s (${(parseFloat(elapsedSec) / 60).toFixed(1)}m)`);
    console.log(`Manifest:             ${manifestPath}`);
    console.log(`Sanity check pass:    ${manifest.sanity.pass}`);
}
// Top-level await workaround for the ws.end() promise.
(async () => { await main(); })().catch(e => { console.error(e); process.exit(1); });
//# sourceMappingURL=runStep5.js.map