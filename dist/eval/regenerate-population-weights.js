/**
 * Regenerate output/live-data/population-weights.json from a heuristic
 * "typicality" score, replacing the near-uniform distribution that was there
 * (0.003–0.008 range, ~2.5× spread) with a realistic-shape distribution where
 * moderate archetypes carry most of the mass.
 *
 * Heuristic typicality score per archetype:
 *   - start at 0
 *   - + 1.0 per continuous node with pos == 1 or 5 (ideological extreme)
 *   - + 0.4 per continuous node with pos == 2 or 4 (off-center)
 *   - + 0.6 per node with sal == 3 (high salience on any axis)
 *   - + 1.0 per `anti` flag (explicit rejection of a pole)
 *   - + 1.5 per archetype.antiCats entry on categorical nodes
 *   - + 2.0 if archetype.id ∈ identity-primary set (141–146)
 *
 * Weight = exp(-score / T), T tuned to give ~12× spread (most-typical vs
 * least-typical). Renormalize to sum to 1.
 *
 * Writes: output/live-data/population-weights.json
 * Backs up old: output/live-data/population-weights-pre-realistic-BAK.json
 */
import * as fs from "fs";
import * as path from "path";
import { ARCHETYPES } from "../config/archetypes.js";
import { CONTINUOUS_NODES } from "../config/nodes.js";
const DEACTIVATED = new Set(["019", "023", "025"]);
const IDENTITY_PRIMARY = new Set(["141", "142", "143", "144", "145", "146"]);
const TEMP = 8.0; // softmax temperature — higher = tighter spread. T=8 gives ~20× ratio.
function typicalityScore(a) {
    let score = 0;
    for (const nodeId of CONTINUOUS_NODES) {
        const t = a.nodes[nodeId];
        if (!t || t.kind !== "continuous")
            continue;
        if (t.pos === 1 || t.pos === 5)
            score += 1.0;
        else if (t.pos === 2 || t.pos === 4)
            score += 0.4;
        if (t.sal === 3)
            score += 0.6;
        if (t.anti)
            score += 1.0;
    }
    for (const nodeId of ["EPS", "AES"]) {
        const t = a.nodes[nodeId];
        if (!t || t.kind !== "categorical")
            continue;
        // Peak probability in the categorical dist
        const peak = Math.max(...t.probs);
        if (peak >= 0.7)
            score += 0.6; // sharply committed to one category
        if (t.antiCats && t.antiCats.length > 0)
            score += 1.5 * t.antiCats.length;
    }
    if (IDENTITY_PRIMARY.has(a.id))
        score += 2.0;
    return score;
}
const active = ARCHETYPES.filter((a) => !DEACTIVATED.has(a.id));
const scores = active.map((a) => ({ id: a.id, name: a.name, tier: a.tier, score: typicalityScore(a) }));
// Softmax
const minScore = Math.min(...scores.map((s) => s.score));
const rawWeights = scores.map((s) => Math.exp(-(s.score - minScore) / TEMP));
const sumRaw = rawWeights.reduce((a, b) => a + b, 0);
const weights = rawWeights.map((w) => w / sumRaw);
// Build full weights dict (include deactivated at 0 for ID stability)
const out = {};
for (const a of ARCHETYPES)
    out[a.id] = 0;
for (let i = 0; i < active.length; i++) {
    out[active[i].id] = Math.round(weights[i] * 1e6) / 1e6;
}
// Back up old file
const outPath = path.join("output", "live-data", "population-weights.json");
const bakPath = path.join("output", "live-data", "population-weights-pre-realistic-BAK.json");
if (fs.existsSync(outPath) && !fs.existsSync(bakPath)) {
    fs.copyFileSync(outPath, bakPath);
    console.log(`Backed up old weights to ${bakPath}`);
}
fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
console.log(`Wrote ${outPath}`);
// Diagnostic report
const ranked = scores
    .map((s, i) => ({ ...s, weight: weights[i] }))
    .sort((a, b) => b.weight - a.weight);
console.log();
console.log(`Typicality-weighted archetypes (temperature T=${TEMP}):`);
console.log(`Total active: ${active.length}  |  Weight sum: ${weights.reduce((a, b) => a + b, 0).toFixed(6)}`);
const weightsSorted = weights.slice().sort((a, b) => b - a);
const ratio = weightsSorted[0] / weightsSorted[weightsSorted.length - 1];
console.log(`Spread: ${(weightsSorted[0] * 100).toFixed(2)}% (highest) vs ${(weightsSorted[weightsSorted.length - 1] * 100).toFixed(3)}% (lowest) — ${ratio.toFixed(1)}× ratio`);
console.log();
console.log(`Top 15 most-typical (highest weight):`);
console.log(`  ID   NAME                                     SCORE    WEIGHT`);
for (const r of ranked.slice(0, 15)) {
    console.log(`  ${r.id}  ${r.name.padEnd(38)}  ${r.score.toFixed(1).padStart(6)}   ${(r.weight * 100).toFixed(3)}%`);
}
console.log();
console.log(`Bottom 15 least-typical (lowest weight):`);
for (const r of ranked.slice(-15).reverse()) {
    console.log(`  ${r.id}  ${r.name.padEnd(38)}  ${r.score.toFixed(1).padStart(6)}   ${(r.weight * 100).toFixed(3)}%`);
}
//# sourceMappingURL=regenerate-population-weights.js.map