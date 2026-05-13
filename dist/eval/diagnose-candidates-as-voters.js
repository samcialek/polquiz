/**
 * Candidates-as-voters election diagnostic.
 *
 * Take every historical candidate profile in candidates.ts (across all 60
 * elections) and treat each as a hypothetical voter. Have each candidate-voter
 * cast a vote in every one of the 60 elections. Aggregate winners per election.
 *
 * Each candidate-year entry is a distinct voter (Nixon 1960 and Nixon 1972
 * are separate voters because they're separately coded — different policy
 * positions, different post-Watergate paranoia, etc.). Total N = ~140.
 *
 * Sanity check: each candidate must pick themselves in their own election
 * (ideological distance = 0 at self-match). The non-ideological modifier
 * could in principle make another candidate closer via a large positive
 * bonus, but with modifier capped at ±0.30 and most cross-candidate distances
 * > 0.5, self-votes dominate.
 *
 * Output: results/centroid-sim/candidate-voter-frequencies.json.
 */
import * as fs from "fs";
import * as path from "path";
import { ELECTIONS } from "../historical/candidates.js";
import { getContext } from "../historical/contexts.js";
import { predictVote } from "../historical/respondentVoteChoice.js";
const SCORING_NODES = ["MAT", "CD", "CU", "MOR", "PRO", "COM", "ZS", "ONT_H", "ONT_S", "PF", "TRB"];
function engagementLevelFromPos(pos) {
    if (pos < 2.0)
        return "apolitical";
    if (pos < 3.0)
        return "casual";
    if (pos < 4.0)
        return "engaged";
    return "highly-engaged";
}
function candidateToSignature(cand) {
    const sig = {};
    for (const node of SCORING_NODES) {
        sig[node] = {
            pos: cand[node],
            sal: 3, // candidates are maximally salient — they built their careers on politics
        };
    }
    return sig;
}
// Flatten every candidate-year entry into a single voter list
const allVoters = [];
for (const e of ELECTIONS) {
    for (const c of e.candidates) {
        allVoters.push({
            voterLabel: `${c.name}_${e.year}`,
            profile: c,
        });
    }
}
console.log("=== Candidates-as-Voters Diagnostic ===");
console.log(`Voters (candidate-years): ${allVoters.length}`);
console.log(`Elections:                ${ELECTIONS.length}`);
console.log(`Total predictions:        ${(allVoters.length * ELECTIONS.length).toLocaleString()}`);
console.log();
const globalWinners = {};
for (const e of ELECTIONS)
    globalWinners[e.year] = {};
// Also track each voter's full ballot for a "who voted for whom" breakdown
const voterBallots = {};
const t0 = Date.now();
for (const voter of allVoters) {
    const sig = candidateToSignature(voter.profile);
    const engLevel = engagementLevelFromPos(voter.profile.ENG ?? 4);
    voterBallots[voter.voterLabel] = {};
    for (const election of ELECTIONS) {
        const ctx = getContext(election.year);
        if (!ctx)
            continue;
        const pred = predictVote(sig, election.candidates, ctx, engLevel);
        const winner = pred.decision === "vote" ? pred.nearest.name : "ABSTAIN";
        globalWinners[election.year][winner] = (globalWinners[election.year][winner] ?? 0) + 1;
        voterBallots[voter.voterLabel][election.year] = winner;
    }
}
// ─── Write outputs ─────────────────────────────────────────────────────────
const outDir = path.join("results", "centroid-sim");
fs.mkdirSync(outDir, { recursive: true });
const flat = [];
for (const [year, counts] of Object.entries(globalWinners)) {
    for (const [cand, count] of Object.entries(counts)) {
        flat.push({
            year: parseInt(year),
            candidate: cand,
            count,
            pct: Math.round((count / allVoters.length) * 10000) / 100,
        });
    }
}
flat.sort((a, b) => a.year - b.year || b.count - a.count);
fs.writeFileSync(path.join(outDir, "candidate-voter-frequencies.json"), JSON.stringify({
    meta: {
        mode: "candidate-voter",
        totalRuns: allVoters.length,
        archetypes: 0,
        repsPerArchetype: 0,
        noiseSigma: 0,
        runsPerElection: allVoters.length,
        samplingNote: `Each of ${allVoters.length} historical presidential-candidate profiles ` +
            `serves as a hypothetical voter with salience=3 across all scoring nodes. ` +
            `Each candidate-voter casts a ballot in all 60 elections.`,
    },
    frequencies: flat,
}, null, 2));
fs.writeFileSync(path.join(outDir, "candidate-voter-ballots.json"), JSON.stringify({ ballots: voterBallots }, null, 2));
// ─── Console summary ─────────────────────────────────────────────────────
console.log(`=== Summary (${((Date.now() - t0) / 1000).toFixed(1)}s) ===`);
console.log(`Total voter-elections: ${(allVoters.length * ELECTIONS.length).toLocaleString()}`);
console.log();
console.log("Per-election top-3 winners when presidential candidates vote:");
for (const year of Object.keys(globalWinners).sort()) {
    const counts = globalWinners[parseInt(year)];
    const ranked = Object.entries(counts).sort(([, a], [, b]) => b - a);
    const top3 = ranked
        .slice(0, 3)
        .map(([c, n]) => `${c} ${((n / allVoters.length) * 100).toFixed(0)}%`)
        .join(", ");
    console.log(`  ${year}: ${top3}`);
}
// Self-vote sanity check
let selfVotes = 0, crossVotes = 0;
for (const voter of allVoters) {
    const year = voter.profile.year;
    const actualWinner = voterBallots[voter.voterLabel][year];
    if (actualWinner === voter.profile.name)
        selfVotes++;
    else
        crossVotes++;
}
console.log();
console.log(`Self-vote sanity check: ${selfVotes}/${allVoters.length} candidates voted for themselves in their own election.`);
if (crossVotes > 0) {
    console.log(`  ${crossVotes} cross-votes (non-ideological modifier made a different candidate closer):`);
    for (const voter of allVoters) {
        const year = voter.profile.year;
        const actualWinner = voterBallots[voter.voterLabel][year];
        if (actualWinner !== voter.profile.name) {
            console.log(`    ${voter.voterLabel} picked ${actualWinner} in ${year}`);
        }
    }
}
//# sourceMappingURL=diagnose-candidates-as-voters.js.map