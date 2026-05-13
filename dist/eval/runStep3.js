// @ts-nocheck
// PENDING PHASE-3 PORT — Step-3 noise rep harness writes the pre-Phase-3 SimRun
// shape (topPosterior/margin/posteriorFinal). Phase 3g will rebuild this against
// the new distance-native shape (leaderDistance/gapRatio/distancesFinal).
/**
 * Step 3: 200 reps × 121 archetypes × 3 noise levels = 72,600 runs.
 *
 * - Targets all 121 archetypes; metrics in Step 4 will exclude deactivated
 *   {019, 023, 025} (prior=0). Running them lets us inspect what the engine
 *   converges to when answers come from a deactivated archetype, and gives
 *   us the explicit "deactivated never wins MAP" sanity check.
 * - σ=0 reps are deterministic (jitterArchetype not called when sigma=0,
 *   nothing else consumes the RNG), so all 200 σ=0 reps of an archetype are
 *   byte-identical. That's intentional — keeps the schema uniform and gives a
 *   trivial reproducibility check.
 * - Posteriors persisted as sparse {id: prob} dicts (drop < 1e-6, 6 decimals).
 *
 * Usage:
 *   npx tsx src/eval/runStep3.ts            # full run
 *   npx tsx src/eval/runStep3.ts --smoke    # 5 archetypes × 2 reps × 3 σ
 */
import * as fs from "fs";
import * as path from "path";
import * as crypto from "crypto";
import { execSync } from "child_process";
import { ARCHETYPES } from "../config/archetypes.js";
import { REPRESENTATIVE_QUESTIONS } from "../config/questions.representative.js";
import { resetConfig } from "../optimize/runtimeConfig.js";
import { simulateOne } from "./harness.js";
const NOISE_LEVELS = [0, 0.5, 1.5];
const REPS_PER_ARCHETYPE = 200;
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
        if (v >= POSTERIOR_THRESHOLD) {
            out[k] = Math.round(v * factor) / factor;
        }
    }
    return out;
}
function fileSha256(absPath) {
    const buf = fs.readFileSync(absPath);
    return crypto.createHash("sha256").update(buf).digest("hex");
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
    };
}
function main() {
    const args = process.argv.slice(2);
    const isSmoke = args.includes("--smoke");
    resetConfig();
    const archetypes = ARCHETYPES;
    const questions = REPRESENTATIVE_QUESTIONS;
    const archetypeCount = isSmoke ? 5 : archetypes.length;
    const reps = isSmoke ? 2 : REPS_PER_ARCHETYPE;
    const targets = archetypes.slice(0, archetypeCount);
    const totalRuns = NOISE_LEVELS.length * archetypeCount * reps;
    const outDir = path.join(process.cwd(), "results", isSmoke ? "step3-smoke" : "step3");
    fs.mkdirSync(outDir, { recursive: true });
    console.log("=== Step 3: simulation grid ===");
    console.log(`Mode:           ${isSmoke ? "SMOKE" : "FULL"}`);
    console.log(`Archetypes:     ${archetypeCount}`);
    console.log(`Reps/archetype: ${reps}`);
    console.log(`Noise levels:   ${NOISE_LEVELS.join(", ")}`);
    console.log(`Total runs:     ${totalRuns}`);
    console.log(`Output:         ${outDir}`);
    console.log();
    // Engine file hashes for the manifest.
    const engineHashes = {};
    for (const f of ENGINE_FILES) {
        const abs = path.join(process.cwd(), f);
        if (fs.existsSync(abs))
            engineHashes[f] = fileSha256(abs);
    }
    const git = gitInfo();
    const startedAt = new Date().toISOString();
    const t0 = Date.now();
    // Stats accumulators (cheap; full data goes to disk).
    let runsCompleted = 0;
    let deactivatedWins = 0;
    const deactivatedWinDetails = [];
    const perSigma = {};
    for (const s of NOISE_LEVELS)
        perSigma[s] = { runs: 0, correctActive: 0, activeRuns: 0 };
    for (let sigmaIdx = 0; sigmaIdx < NOISE_LEVELS.length; sigmaIdx++) {
        const sigma = NOISE_LEVELS[sigmaIdx];
        const filePath = path.join(outDir, `sigma-${sigmaToTag(sigma)}.jsonl`);
        const ws = fs.createWriteStream(filePath, { encoding: "utf-8" });
        console.log(`[σ=${sigma}] writing ${filePath}`);
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
                });
                const row = runToRow(run, target.prior, sigmaIdx, aIdx, rep);
                ws.write(JSON.stringify(row) + "\n");
                // Sanity: deactivated archetypes (prior=0) must never win as MAP.
                if (DEACTIVATED_IDS.has(run.resultId)) {
                    deactivatedWins++;
                    if (deactivatedWinDetails.length < 20) {
                        deactivatedWinDetails.push({
                            sigma,
                            seed,
                            archetypeId: run.archetypeId,
                            resultId: run.resultId,
                        });
                    }
                }
                const isActive = !DEACTIVATED_IDS.has(target.id);
                perSigma[sigma].runs++;
                if (isActive) {
                    perSigma[sigma].activeRuns++;
                    if (run.correct)
                        perSigma[sigma].correctActive++;
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
        const sigmaSec = ((Date.now() - sigmaT0) / 1000).toFixed(1);
        const top1Pct = perSigma[sigma].activeRuns > 0
            ? ((perSigma[sigma].correctActive / perSigma[sigma].activeRuns) * 100).toFixed(1)
            : "n/a";
        console.log(`  [σ=${sigma}] done in ${sigmaSec}s. ` +
            `Active top-1: ${perSigma[sigma].correctActive}/${perSigma[sigma].activeRuns} (${top1Pct}%)`);
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
            repsPerArchetype: reps,
            noiseLevels: NOISE_LEVELS,
            maxQuestions: 65,
        },
        seedScheme: "seed = sigmaIdx * 1_000_000 + archetypeIdx * 1000 + rep",
        posteriorEncoding: {
            sparsityThreshold: POSTERIOR_THRESHOLD,
            decimals: POSTERIOR_DECIMALS,
        },
        files: NOISE_LEVELS.map(s => ({
            sigma: s,
            sigmaIdx: NOISE_LEVELS.indexOf(s),
            file: `sigma-${sigmaToTag(s)}.jsonl`,
            runs: perSigma[s].runs,
        })),
        sanity: {
            deactivatedIds: [...DEACTIVATED_IDS],
            deactivatedAsMapWinCount: deactivatedWins,
            deactivatedWinSamples: deactivatedWinDetails,
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
    if (!manifest.sanity.pass) {
        console.log(`  Deactivated IDs won MAP ${deactivatedWins} times — see manifest.sanity`);
    }
}
main();
//# sourceMappingURL=runStep3.js.map