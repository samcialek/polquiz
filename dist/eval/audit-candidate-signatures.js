/**
 * Candidate-signature audit.
 *
 * For each historical candidate in candidates.ts, compute pure ideological
 * distance (no era multipliers, no non-ideological modifier) to every active
 * archetype centroid. Identify:
 *   (a) the 5 closest archetypes per candidate, and
 *   (b) the 5 farthest archetypes per candidate.
 *
 * Flag candidates whose closest archetypes look structurally wrong — e.g.,
 * McGovern's closest should be universalist left-progressive archetypes, not
 * particularist conservatives.
 */
import * as fs from "fs";
import * as path from "path";
import { ARCHETYPES } from "../config/archetypes.js";
import { ELECTIONS } from "../historical/candidates.js";
const DEACTIVATED = new Set(["019", "023", "025"]);
const SCORING_NODES = ["MAT", "CD", "CU", "MOR", "PRO", "COM", "ZS", "ONT_H", "ONT_S", "PF", "TRB"];
// Pure ideological distance: weighted Euclidean where weight = archetype's
// salience on that node. Mirrors respondentVoteChoice.weightedDistance but
// with NO era multiplier and NO non-ideological modifier.
function pureIdeologicalDistance(arch, cand) {
    let sumSq = 0, totalW = 0;
    for (const node of SCORING_NODES) {
        const t = arch.nodes[node];
        if (!t || t.kind !== "continuous")
            continue;
        const sal = t.sal;
        if (sal === undefined)
            continue; // SELF nodes post-ADR-005 — skip from this audit for simplicity
        const candPos = cand[node];
        if (candPos == null)
            continue;
        const diff = t.pos - candPos;
        sumSq += sal * diff * diff;
        totalW += sal;
    }
    return totalW > 0 ? Math.sqrt(sumSq / totalW) : 4;
}
const active = ARCHETYPES.filter((a) => !DEACTIVATED.has(a.id));
const audit = [];
for (const election of ELECTIONS) {
    for (const cand of election.candidates) {
        const dists = active.map((a) => ({
            id: a.id,
            name: a.name,
            dist: pureIdeologicalDistance(a, cand),
        }));
        dists.sort((a, b) => a.dist - b.dist);
        const sig = {};
        for (const node of SCORING_NODES) {
            sig[node] = cand[node];
        }
        audit.push({
            year: cand.year,
            name: cand.name,
            party: cand.party,
            signature: sig,
            closest5: dists.slice(0, 5),
            farthest5: dists.slice(-5).reverse(),
            avgDist: dists.reduce((s, d) => s + d.dist, 0) / dists.length,
        });
    }
}
// ---- Targeted output: McGovern + Nixon 1972 ----
const target = process.argv[2] || "McGovern_1972,Nixon_1972";
const wanted = new Set(target.split(","));
console.log("=== Candidate signature audit ===\n");
for (const a of audit) {
    const key = `${a.name}_${a.year}`;
    if (!wanted.has(key) && target !== "all")
        continue;
    console.log(`${a.year}  ${a.name}  (${a.party})`);
    console.log(`  avg ideological distance to 121 archetypes: ${a.avgDist.toFixed(3)}`);
    console.log(`  signature:`);
    const pairs = Object.entries(a.signature);
    for (let i = 0; i < pairs.length; i += 4) {
        const chunk = pairs.slice(i, i + 4).map(([n, v]) => `${n}=${v}`).join("  ");
        console.log(`    ${chunk}`);
    }
    console.log(`  CLOSEST 5 archetypes (should vote for this candidate):`);
    for (const c of a.closest5) {
        console.log(`    ${c.id}  ${c.name.padEnd(40)}  d=${c.dist.toFixed(3)}`);
    }
    console.log(`  FARTHEST 5 archetypes (should never vote for this candidate):`);
    for (const c of a.farthest5) {
        console.log(`    ${c.id}  ${c.name.padEnd(40)}  d=${c.dist.toFixed(3)}`);
    }
    console.log();
}
// ---- Ranked centrism/extremism report ----
if (target === "ranked" || target === "all") {
    const sorted = audit.slice().sort((a, b) => a.avgDist - b.avgDist);
    console.log("\n=== Candidates ranked by AVG ideological distance to archetypes ===");
    console.log("(Low avgDist = coded as 'moderate on everything' = wins by being centroid)\n");
    console.log("AVG-DIST   YEAR  CANDIDATE                PARTY");
    console.log("-----------------------------------------------------");
    console.log("SUSPICIOUSLY CLOSE (likely over-centered coding):");
    for (const c of sorted.slice(0, 15)) {
        console.log(`  ${c.avgDist.toFixed(3)}    ${c.year}  ${c.name.padEnd(24)}  ${c.party}`);
    }
    console.log("\nSUSPICIOUSLY FAR (likely over-extreme coding):");
    for (const c of sorted.slice(-15).reverse()) {
        console.log(`  ${c.avgDist.toFixed(3)}    ${c.year}  ${c.name.padEnd(24)}  ${c.party}`);
    }
    console.log("\nMEDIAN avg-dist across all candidates:", sorted[Math.floor(sorted.length / 2)]?.avgDist.toFixed(3));
}
// ---- Global audit output ----
if (target === "all") {
    fs.mkdirSync("results/candidate-audit", { recursive: true });
    fs.writeFileSync(path.join("results/candidate-audit", "all-candidates.json"), JSON.stringify(audit, null, 2));
    console.log(`\nWrote full audit to results/candidate-audit/all-candidates.json (${audit.length} candidates)`);
}
//# sourceMappingURL=audit-candidate-signatures.js.map