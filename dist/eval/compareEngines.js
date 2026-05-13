/**
 * Bayesian vs. averaging engine comparison runner.
 *
 * For each active archetype, runs simulateCompared (from harnessAvg.ts) across
 * a small set of noise seeds. Produces:
 *   - Per-archetype agreement stats (top-1 / top-3 / top-5 agreement rate)
 *   - Aggregate top-1 accuracy for each engine
 *   - A table of archetypes where the two engines disagree on top-1
 *
 * Writes:
 *   - results/architecture/bayesian-vs-averaging-runs.jsonl
 *   - results/architecture/bayesian-vs-averaging-comparison.md
 *
 * Usage:
 *   npx tsx src/eval/compareEngines.ts          # full (118 archetypes × noise levels × reps)
 *   npx tsx src/eval/compareEngines.ts --smoke  # 10 archetypes × 1 rep each
 */
import * as fs from "fs";
import * as path from "path";
import { ARCHETYPES } from "../config/archetypes.js";
import { REPRESENTATIVE_QUESTIONS } from "../config/questions.representative.js";
import { simulateCompared } from "./harnessAvg.js";
const SMOKE = process.argv.includes("--smoke");
const NOISE_LEVELS = SMOKE ? [0, 0.15] : [0, 0.15, 0.5];
const REPS_PER_NOISE = SMOKE ? 1 : 10;
const OUT_DIR = path.resolve(process.cwd(), "results", "architecture");
fs.mkdirSync(OUT_DIR, { recursive: true });
const JSONL_OUT = path.join(OUT_DIR, "bayesian-vs-averaging-runs.jsonl");
const MD_OUT = path.join(OUT_DIR, "bayesian-vs-averaging-comparison.md");
const active = ARCHETYPES.filter((a) => a.active !== false);
const targets = SMOKE ? active.slice(0, 10) : active;
const startTime = Date.now();
console.log(`Running ${targets.length} archetypes × ${NOISE_LEVELS.length} noise × ${REPS_PER_NOISE} reps = ${targets.length * NOISE_LEVELS.length * REPS_PER_NOISE} runs`);
const runs = [];
const jsonlStream = fs.createWriteStream(JSONL_OUT);
let runCount = 0;
for (const target of targets) {
    for (const sigma of NOISE_LEVELS) {
        const repsHere = sigma === 0 ? 1 : REPS_PER_NOISE;
        for (let r = 0; r < repsHere; r++) {
            const seed = r * 9973 + Math.floor(sigma * 1000);
            const run = simulateCompared(target, ARCHETYPES, REPRESENTATIVE_QUESTIONS, {
                noiseSigma: sigma,
                seed,
            });
            runs.push(run);
            jsonlStream.write(JSON.stringify(run) + "\n");
            runCount++;
            if (runCount % 50 === 0) {
                const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
                console.log(`  ${runCount} runs done (${elapsed}s)`);
            }
        }
    }
}
jsonlStream.end();
const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
console.log(`Done: ${runs.length} runs in ${elapsed}s`);
// ---------------------------------------------------------------------------
// Aggregate
// ---------------------------------------------------------------------------
const n = runs.length;
const bayesTop1 = runs.filter(r => r.bayes.correct1).length;
const bayesTop3 = runs.filter(r => r.bayes.correct3).length;
const bayesTop5 = runs.filter(r => r.bayes.correct5).length;
const avgTop1 = runs.filter(r => r.avg.correct1).length;
const avgTop3 = runs.filter(r => r.avg.correct3).length;
const avgTop5 = runs.filter(r => r.avg.correct5).length;
const agree1Count = runs.filter(r => r.agree1).length;
const agree3Count = runs.filter(r => r.agree3).length;
const agree5Count = runs.filter(r => r.agree5).length;
// When engines disagree on top-1, which side is correct more often?
const disagreeRuns = runs.filter(r => !r.agree1);
const disBayesRight = disagreeRuns.filter(r => r.bayes.correct1 && !r.avg.correct1).length;
const disAvgRight = disagreeRuns.filter(r => r.avg.correct1 && !r.bayes.correct1).length;
const disBothWrong = disagreeRuns.filter(r => !r.bayes.correct1 && !r.avg.correct1).length;
// Per-archetype breakdown (clean noiseSigma=0 runs only)
const cleanRuns = runs.filter(r => r.noiseSigma === 0);
const cleanDisagreements = cleanRuns.filter(r => !r.agree1);
// Distribution of target rank
function percentile(arr, p) {
    if (arr.length === 0)
        return NaN;
    const s = [...arr].sort((a, b) => a - b);
    const idx = Math.min(s.length - 1, Math.floor(p * s.length / 100));
    return s[idx];
}
const bayesRanks = runs.map(r => r.bayes.targetRank);
const avgRanks = runs.map(r => r.avg.targetRank);
// ---------------------------------------------------------------------------
// Write markdown
// ---------------------------------------------------------------------------
let md = "";
md += "# Bayesian vs. averaging engine — comparison\n\n";
md += `Generated: ${new Date().toISOString()}\n\n`;
md += `**Inputs:** ${targets.length} active archetypes × ${NOISE_LEVELS.length} noise levels × ${REPS_PER_NOISE} reps (σ=0 deterministic, 1 rep). Total **${n} runs**. Elapsed ${elapsed}s.\n\n`;
md += `**Setup:** Both engines ingest the identical archetype-optimal answer sequence. Bayesian selector + stop rule drive question order; each answer is applied in lockstep to a Bayesian state (posDist / salDist / catDist) and an averaging state (running sum/count on integer codes). Final scorers: \`archetypeDistance\` for Bayesian, \`archetypeDistanceAvg\` for averaging (same mean-difference formula, drops the prob-at-target term since averaging has no distribution).\n\n`;
md += "## Headline accuracy\n\n";
md += "| Metric | Bayesian | Averaging | Δ |\n";
md += "|--------|---------:|----------:|---:|\n";
md += `| Top-1 | ${bayesTop1}/${n} (${(bayesTop1 / n * 100).toFixed(1)}%) | ${avgTop1}/${n} (${(avgTop1 / n * 100).toFixed(1)}%) | ${(avgTop1 - bayesTop1 >= 0 ? "+" : "")}${avgTop1 - bayesTop1} |\n`;
md += `| Top-3 | ${bayesTop3}/${n} (${(bayesTop3 / n * 100).toFixed(1)}%) | ${avgTop3}/${n} (${(avgTop3 / n * 100).toFixed(1)}%) | ${(avgTop3 - bayesTop3 >= 0 ? "+" : "")}${avgTop3 - bayesTop3} |\n`;
md += `| Top-5 | ${bayesTop5}/${n} (${(bayesTop5 / n * 100).toFixed(1)}%) | ${avgTop5}/${n} (${(avgTop5 / n * 100).toFixed(1)}%) | ${(avgTop5 - bayesTop5 >= 0 ? "+" : "")}${avgTop5 - bayesTop5} |\n`;
md += "\n";
md += "## Engine agreement\n\n";
md += `On the *same* answer sequences:\n\n`;
md += `- **Top-1 agreement**: ${agree1Count}/${n} = **${(agree1Count / n * 100).toFixed(1)}%**\n`;
md += `- **Top-3 agreement (exact order)**: ${agree3Count}/${n} = ${(agree3Count / n * 100).toFixed(1)}%\n`;
md += `- **Top-5 agreement (exact order)**: ${agree5Count}/${n} = ${(agree5Count / n * 100).toFixed(1)}%\n\n`;
md += "## When engines disagree on top-1, who's right?\n\n";
if (disagreeRuns.length === 0) {
    md += "No disagreements.\n\n";
}
else {
    md += `Of ${disagreeRuns.length} disagreement runs:\n\n`;
    md += `- Bayesian correct, averaging wrong: ${disBayesRight} (${(disBayesRight / disagreeRuns.length * 100).toFixed(1)}%)\n`;
    md += `- Averaging correct, Bayesian wrong: ${disAvgRight} (${(disAvgRight / disagreeRuns.length * 100).toFixed(1)}%)\n`;
    md += `- Both wrong (but picked different wrong archetype): ${disBothWrong} (${(disBothWrong / disagreeRuns.length * 100).toFixed(1)}%)\n\n`;
}
md += "## Target-rank distribution\n\n";
md += "Where does the true archetype land in each engine's ranking? (rank 1 = top)\n\n";
md += "| Percentile | Bayesian | Averaging |\n";
md += "|-----------:|---------:|----------:|\n";
md += `| p5 | ${percentile(bayesRanks, 5)} | ${percentile(avgRanks, 5)} |\n`;
md += `| p50 | ${percentile(bayesRanks, 50)} | ${percentile(avgRanks, 50)} |\n`;
md += `| p95 | ${percentile(bayesRanks, 95)} | ${percentile(avgRanks, 95)} |\n`;
md += `| p99 | ${percentile(bayesRanks, 99)} | ${percentile(avgRanks, 99)} |\n`;
md += "\n";
md += "## Clean-run disagreements (σ=0)\n\n";
md += `${cleanDisagreements.length} of ${cleanRuns.length} clean runs disagree on top-1.\n\n`;
if (cleanDisagreements.length > 0) {
    md += "| Target | Bayesian top-1 | Averaging top-1 | Bayes✓ | Avg✓ |\n";
    md += "|--------|----------------|-----------------|:---:|:---:|\n";
    const nameOf = (id) => {
        const a = ARCHETYPES.find(x => x.id === id);
        return a ? `${id} ${a.name}` : id;
    };
    for (const r of cleanDisagreements.slice(0, 40)) {
        md += `| ${r.archetypeId} ${r.archetypeName} | ${nameOf(r.bayes.top1)} | ${nameOf(r.avg.top1)} | ${r.bayes.correct1 ? "✓" : ""} | ${r.avg.correct1 ? "✓" : ""} |\n`;
    }
    if (cleanDisagreements.length > 40) {
        md += `\n*(${cleanDisagreements.length - 40} more disagreements — see JSONL.)*\n`;
    }
}
md += "\n## Reading the verdict\n\n";
md += "- **If averaging top-1 is within ~2pp of Bayesian and >90% of top-1 picks agree**: the Bayesian apparatus isn't load-bearing. The quiz's decisions are governed by mean-difference, not by the probability-at-target fine structure. Averaging is the simpler defensible default.\n";
md += "- **If averaging top-1 drops materially (>3pp) or top-1 agreement <85%**: the distribution shape is load-bearing somewhere. Candidates: narrow salience peaks on target-sal=3 archetypes, or a few question batteries (best-worst, priority-sort) that depend on the likelihood vectors' tails. Fork stays as an experiment; Bayesian remains authoritative.\n";
md += "- **Disagreement cases**: inspect the table above. If one engine is systematically right on a class of archetypes the other misses, that's a signal about what the signatures + evidence maps are actually encoding.\n";
md += "\n## Mechanism — why the gap\n\n";
md += "From `inspectAvgState` on archetype 001 Rawlsian Reformer (MAT=pos1, CD=pos1, MOR=pos5, PRO=pos5):\n\n";
md += "| Node | target pos | averaged pos | Bayesian mean pos |\n";
md += "|------|-----------:|-------------:|------------------:|\n";
md += "| MAT | 1 | 2.35 (11 touches) | 1.16 |\n";
md += "| CD  | 1 | 1.93 (11 touches) | 1.10 |\n";
md += "| MOR | 5 | 3.67 (8 touches)  | 4.69 |\n";
md += "| PRO | 5 | 3.78 (12 touches) | 4.65 |\n\n";
md += "**Bayesian compounds evidence; averaging regresses toward the mean.** A likelihood vector like `[0.5, 0.3, 0.15, 0.05, 0]` has expected value 1.75. Each touch moves the running mean by (1.75 - prior_mean)/count, which can't reach 1 without a chain of touches all pegged at 1. Bayesian instead multiplies probability mass — two touches leaning low compound into a narrow peak at 1.\n\n";
md += "The quiz's archetypes span the full 1-5 range; half have pos=1 or pos=5 on at least one node. The averaging engine systematically underestimates these extremes, which pulls every archetype's state toward the middle of the signature space. Archetypes whose signature IS near the middle (e.g. 008 Procedural Redistributionist, 060 Hinge Citizen, 074 Responsible Conservative, 042 Localist Progressive) become universal attractors — they show up as averaging's top-1 for dozens of distinct targets.\n\n";
md += "This is not a tuning failure of `archetypeDistanceAvg`: the mean-difference geometry is the same as Bayesian's, and both see the identical answer sequence. It is a limit of running-mean accumulation on evidence authored as likelihood-vector \"leans\" rather than hard integer codes.\n";
fs.writeFileSync(MD_OUT, md);
console.log(`Wrote ${MD_OUT}`);
console.log(`Wrote ${JSONL_OUT}`);
//# sourceMappingURL=compareEngines.js.map