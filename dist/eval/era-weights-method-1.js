/**
 * Phase 1 — Method 1: Candidate-spread variance.
 *
 * For each of 60 US presidential elections, compute per-node variance across
 * candidates in that election. A node where candidates vary widely is a node
 * the election is "about"; a node where they all cluster is a non-issue.
 *
 * Nodes covered: 13 (all PRISM nodes except ENG, which is excluded per
 * ADR-002 from alignment scoring). EPS and AES are categorical — variance
 * is computed over the integer category indices with the caveat noted in
 * the output file.
 *
 * Output:
 *   results/era-weights/method-1-candidate-spread.json
 *
 *   npx tsx src/eval/era-weights-method-1.ts
 */
import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { ELECTIONS } from "../historical/candidates.js";
const NODES = [
    "MAT", "CD", "CU", "MOR",
    "PRO", "COM", "ZS",
    "ONT_H", "ONT_S",
    "PF", "TRB",
    "EPS", "AES",
];
const CATEGORICAL = new Set(["EPS", "AES"]);
function variance(values) {
    if (values.length < 2)
        return 0;
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const sq = values.reduce((a, v) => a + (v - mean) * (v - mean), 0);
    return sq / values.length; // population variance
}
const outDir = "results/era-weights";
if (!existsSync(outDir))
    mkdirSync(outDir, { recursive: true });
const entries = [];
for (const election of ELECTIONS) {
    const candidates = election.candidates;
    const variances = {};
    for (const node of NODES) {
        const values = candidates
            .map(c => c[node])
            .filter((v) => typeof v === "number");
        variances[node] = variance(values);
    }
    const total = Object.values(variances).reduce((a, b) => a + b, 0);
    const variances_normalized = {};
    for (const node of NODES) {
        variances_normalized[node] = total > 0 ? variances[node] / total : 0;
    }
    const meanVar = total / NODES.length;
    const high_spread = NODES.filter(n => variances[n] > meanVar);
    const low_spread = NODES.filter(n => variances[n] <= meanVar);
    const notes = [];
    if (candidates.length < 2) {
        notes.push("fewer than 2 candidates — variance is 0 or undefined");
    }
    if (CATEGORICAL.size > 0) {
        notes.push("EPS/AES variance is computed on integer category indices (0-5); interpret as dispersion across category space, not ordinal distance");
    }
    entries.push({
        year: election.year,
        n_candidates: candidates.length,
        variances,
        variances_normalized,
        high_spread,
        low_spread,
        notes,
    });
}
const header = {
    method: "Method 1 — candidate-spread variance",
    generated: new Date().toISOString(),
    n_elections: entries.length,
    nodes: NODES,
    variance_type: "population",
    normalization: "variances_normalized sums to 1 across 13 nodes per election",
    high_spread_rule: "variance > mean of the 13-node variance vector for this election",
    caveats: [
        "EPS and AES are categorical — variance on integer indices is dispersion in category space, not a true ordinal spread. Treat those two entries as weak signal.",
        "Two-candidate elections (most pre-modern ones) have n_candidates=2 and therefore only a single variance value per node; variance is still meaningful (it's the squared half-gap) but rankings are more fragile than 3+ candidate elections.",
        "This method measures what candidates DIFFER ON, which is an indirect proxy for what voters find salient. An election can be 'about' a node where candidates agree (consensus suppresses variance). Method 2 and Method 5 exist to catch those cases.",
    ],
};
writeFileSync(`${outDir}/method-1-candidate-spread.json`, JSON.stringify({ ...header, elections: entries }, null, 2));
// Quick-summary console output
console.log(`Method 1 complete — ${entries.length} elections × ${NODES.length} nodes`);
console.log(`Output: ${outDir}/method-1-candidate-spread.json`);
console.log("");
console.log("Top-3 high-spread nodes per decade (sanity check):");
const decades = new Map();
for (const e of entries) {
    const dec = Math.floor(e.year / 10) * 10;
    if (!decades.has(dec))
        decades.set(dec, []);
    decades.get(dec).push(e);
}
for (const [dec, list] of [...decades.entries()].sort((a, b) => a[0] - b[0])) {
    const avg = {};
    for (const n of NODES)
        avg[n] = 0;
    for (const e of list)
        for (const n of NODES)
            avg[n] += e.variances[n];
    for (const n of NODES)
        avg[n] /= list.length;
    const top3 = [...NODES].sort((a, b) => avg[b] - avg[a]).slice(0, 3);
    console.log(`  ${dec}s (n=${list.length}): ${top3.map(n => `${n}(${avg[n].toFixed(2)})`).join(", ")}`);
}
//# sourceMappingURL=era-weights-method-1.js.map