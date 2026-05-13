/**
 * Ad-hoc debug tool: for a given voter-year and target-election-year, show
 * the full distance breakdown for every candidate (ideological distance,
 * era-activation-adjusted, non-ideological modifier components, final).
 *
 * Usage:
 *   npx tsx src/eval/debug-voter-election.ts Trump 2016 2012
 *   npx tsx src/eval/debug-voter-election.ts Harris 2024 1828
 */
import { ELECTIONS } from "../historical/candidates.js";
import { getContext } from "../historical/contexts.js";
import { getActivationMultiplier } from "../historical/era-activations.js";
import { getNonIdeologicalModifier, historicalToCanonical } from "../historical/non-ideological-modifiers.js";
const SCORING_NODES = ["MAT", "CD", "CU", "MOR", "PRO", "COM", "ZS", "ONT_H", "ONT_S", "PF", "TRB"];
const [voterName, voterYearStr, targetYearStr] = process.argv.slice(2);
if (!voterName || !voterYearStr || !targetYearStr) {
    console.error("Usage: tsx debug-voter-election.ts <VoterName> <VoterYear> <TargetYear>");
    process.exit(1);
}
const voterYear = parseInt(voterYearStr);
const targetYear = parseInt(targetYearStr);
// Find the voter's profile
let voterProfile = null;
for (const e of ELECTIONS) {
    if (e.year === voterYear) {
        voterProfile = e.candidates.find(c => c.name === voterName) || null;
        if (voterProfile)
            break;
    }
}
if (!voterProfile) {
    console.error(`Voter not found: ${voterName}_${voterYear}`);
    process.exit(1);
}
const targetElection = ELECTIONS.find(e => e.year === targetYear);
if (!targetElection) {
    console.error(`Target election ${targetYear} not found`);
    process.exit(1);
}
const ctx = getContext(targetYear);
if (!ctx) {
    console.error(`Context for ${targetYear} not found`);
    process.exit(1);
}
// Build signature for voter (salience = 3, maximally engaged)
const sig = {};
for (const n of SCORING_NODES) {
    sig[n] = {
        pos: voterProfile[n],
        sal: 3,
    };
}
console.log(`\n=== ${voterName} (${voterYear}) voting in ${targetYear} ===\n`);
console.log("Voter signature (pos):");
for (const n of SCORING_NODES) {
    const p = voterProfile[n];
    console.log(`  ${n.padEnd(6)} ${p}`);
}
console.log();
console.log("Era activation multipliers (for", targetYear, "):");
for (const n of SCORING_NODES) {
    const m = getActivationMultiplier(targetYear, n);
    if (m !== 1)
        console.log(`  ${n.padEnd(6)} ${m}x`);
}
console.log();
console.log(`Candidates in ${targetYear}:`);
console.log();
for (const cand of targetElection.candidates) {
    console.log(`──────── ${cand.name} (${cand.party}) ────────`);
    console.log(`  Candidate signature (pos):`);
    for (const n of SCORING_NODES) {
        const candPos = cand[n];
        const voterPos = sig[n].pos;
        const diff = voterPos - candPos;
        const mult = getActivationMultiplier(targetYear, n);
        const effSal = 3 * mult;
        const contribution = effSal * diff * diff;
        console.log(`    ${n.padEnd(6)} cand=${candPos}  voter=${voterPos}  diff=${diff.toFixed(1)}  effSal=${effSal}  contrib=${contribution.toFixed(2)}`);
    }
    // Compute full weighted distance
    let sumSq = 0, totalW = 0;
    for (const n of SCORING_NODES) {
        const candPos = cand[n];
        const voterPos = sig[n].pos;
        const effSal = 3 * getActivationMultiplier(targetYear, n);
        const diff = voterPos - candPos;
        sumSq += effSal * diff * diff;
        totalW += effSal;
    }
    const ideological = Math.sqrt(sumSq / totalW);
    const modifier = getNonIdeologicalModifier(targetYear, historicalToCanonical(cand.name, cand.year));
    const final = ideological - modifier.total;
    console.log(`  → ideological distance: ${ideological.toFixed(3)}`);
    console.log(`  → non-ideo modifier: econ=${modifier.economic.toFixed(2)}  incumbency=${modifier.incumbency.toFixed(2)}  charisma=${modifier.charisma.toFixed(2)}  total=${modifier.total.toFixed(2)} (subtracted)`);
    console.log(`  → FINAL distance: ${final.toFixed(3)}`);
    console.log();
}
//# sourceMappingURL=debug-voter-election.js.map