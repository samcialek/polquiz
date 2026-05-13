// Quick regression: 1 deterministic run per archetype, σ=0. Prints top-1 / top-3.
// Used to check engine edits (tempering, archetype additions, evidence expansions).
import { ARCHETYPES } from "../config/archetypes.js";
import { REPRESENTATIVE_QUESTIONS } from "../config/questions.representative.js";
import { resetConfig } from "../optimize/runtimeConfig.js";
import { simulateOne } from "./harness.js";
const DEACTIVATED = new Set(["019", "023", "025"]);
resetConfig();
const archetypes = ARCHETYPES;
const questions = REPRESENTATIVE_QUESTIONS;
const active = archetypes.filter((a) => !DEACTIVATED.has(a.id));
let top1 = 0;
let top3 = 0;
let top5 = 0;
let totalQ = 0;
const misses = [];
for (const target of active) {
    const run = simulateOne(target, archetypes, questions, {
        noiseSigma: 0,
        seed: 42,
        maxQuestions: 65,
        capturePosterior: true,
    });
    const correct = run.resultId === target.id;
    if (correct)
        top1++;
    // Determine top-3/top-5 via ranked posterior (fallback: just check resultId)
    const ranked = run.posteriorFinal
        ? Object.entries(run.posteriorFinal).sort((a, b) => b[1] - a[1]).map(([id]) => id)
        : [run.resultId];
    const rank = ranked.indexOf(target.id);
    if (rank >= 0 && rank < 3)
        top3++;
    if (rank >= 0 && rank < 5)
        top5++;
    totalQ += run.questionsAnswered;
    if (!correct) {
        misses.push({ id: target.id, name: target.name, rank: rank + 1, result: run.resultId });
    }
}
const n = active.length;
console.log(`=== Quick Regression (σ=0, 1 rep/archetype) ===`);
console.log(`Active archetypes: ${n}`);
console.log(`Questions in bank: ${questions.length}`);
console.log();
console.log(`Top-1: ${top1}/${n} = ${((top1 / n) * 100).toFixed(1)}%`);
console.log(`Top-3: ${top3}/${n} = ${((top3 / n) * 100).toFixed(1)}%`);
console.log(`Top-5: ${top5}/${n} = ${((top5 / n) * 100).toFixed(1)}%`);
console.log(`Avg questions: ${(totalQ / n).toFixed(1)}`);
console.log();
console.log(`Misses (${misses.length}):`);
for (const m of misses.slice(0, 20)) {
    console.log(`  ${m.id} ${m.name} → matched ${m.result} (rank ${m.rank})`);
}
if (misses.length > 20)
    console.log(`  ... and ${misses.length - 20} more`);
//# sourceMappingURL=regression-quick.js.map