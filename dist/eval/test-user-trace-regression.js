/**
 * Regression test for the user's actual quiz trace (the staunch progressive
 * civic-nationalist Democrat who kept getting Hinge Citizen).
 *
 * Constructs their final-state signature from the trace, runs the engine
 * with the post-ADR-008 fixes (PCN re-encoded, party-ID multiplier,
 * centrist anti-gate, etc.), and reports:
 *   - Top-5 archetype matches
 *   - Election outcome Dem/Rep tally
 *
 * Expected (post-fix):
 *   - Top-1 archetype: Progressive Civic Nationalist (134) or close
 *   - Hinge Citizen (060): demoted by centrist anti-gate
 *   - Election count: ~80%+ Democratic post-1932 (vs pre-fix's mixed 60/40)
 */
import { ARCHETYPES } from "../config/archetypes.js";
import { archetypeDistance } from "../engine/archetypeDistance.js";
import { ELECTIONS } from "../historical/candidates.js";
import { getContext } from "../historical/contexts.js";
import { predictVote } from "../historical/respondentVoteChoice.js";
import { respondentSignatureFromState } from "../engine/respondentSignature.js";
function peakedPos(pos, sigma = 0.4) {
    const out = [0, 0, 0, 0, 0];
    for (let i = 0; i < 5; i++) {
        const d = i + 1 - pos;
        out[i] = Math.exp(-(d * d) / (2 * sigma * sigma));
    }
    const s = out.reduce((a, b) => a + b, 0);
    return out.map((p) => p / s);
}
function peakedSal(sal, sigma = 0.5) {
    const out = [0, 0, 0, 0];
    for (let i = 0; i < 4; i++) {
        const d = i - sal;
        out[i] = Math.exp(-(d * d) / (2 * sigma * sigma));
    }
    const s = out.reduce((a, b) => a + b, 0);
    return out.map((p) => p / s);
}
// User's final-state signature from the trace they provided
const userTrace = {
    MAT: { pos: 1.83, sal: 2.94 },
    CD: { pos: 1.99, sal: 1.77 },
    CU: { pos: 2.59, sal: 2.55 },
    MOR: { pos: 3.79, sal: 0.21 },
    PRO: { pos: 2.76, sal: 2.68 },
    COM: { pos: 3.64, sal: 1.92 },
    ZS: { pos: 1.76, sal: 0.11 },
    ONT_H: { pos: 4.21, sal: 0.30 },
    ONT_S: { pos: 1.93, sal: 2.83 },
    PF: { pos: 4.14, sal: 1.5 },
    TRB: { pos: 2.99, sal: 1.5 },
    ENG: { pos: 4.53, sal: 1.5 },
};
const epsCatDist = [0.75, 0.23, 0.01, 0.01, 0.006, 0.001]; // empiricist peak
const aesCatDist = [0.06, 0.07, 0.05, 0.07, 0.41, 0.33]; // fighter/visionary
// trbAnchor: national 0.30, ideological 0.22, rest evenly distributed
const trbAnchor = [0.30, 0.22, 0.07, 0.10, 0.07, 0.07, 0.07, 0.10, 0.04];
const state = {
    answers: {},
    continuous: {},
    categorical: {},
    trbAnchor: { dist: trbAnchor, touches: 1 },
    archetypeDistances: {},
    currentLeader: undefined,
    consecutiveLeadCount: 0,
    partyID: "D",
};
for (const [nid, v] of Object.entries(userTrace)) {
    state.continuous[nid] = {
        posDist: peakedPos(v.pos),
        salDist: peakedSal(v.sal),
        touches: 5,
        touchTypes: new Set(),
        status: "live_resolved",
    };
}
state.categorical.EPS = { catDist: epsCatDist, salDist: peakedSal(2.6), touches: 5, touchTypes: new Set(), status: "live_resolved" };
state.categorical.AES = { catDist: aesCatDist, salDist: peakedSal(2.78), touches: 5, touchTypes: new Set(), status: "live_resolved" };
// ── Run archetype matching (excluding 141-146 identity-primary) ──
const IDENTITY_PRIMARY = new Set(["141", "142", "143", "144", "145", "146"]);
const active = ARCHETYPES.filter((a) => a.active !== false && !IDENTITY_PRIMARY.has(a.id));
console.log("USER TRACE REGRESSION TEST (post ADR-008)");
console.log("=".repeat(70));
console.log("User signature:");
for (const [nid, v] of Object.entries(userTrace)) {
    console.log(`  ${nid.padEnd(6)} pos=${v.pos.toFixed(2)} sal=${v.sal.toFixed(2)}`);
}
console.log(`  trbAnchor: national=0.30 ideological=0.22 ...`);
console.log(`  partyID: D`);
console.log();
const ranked = active
    .map((a) => ({ id: a.id, name: a.name, dist: archetypeDistance(state, a), centristAnchor: a.centristAnchor || false }))
    .sort((a, b) => a.dist - b.dist);
console.log("--- Top 10 archetype matches ---");
for (const r of ranked.slice(0, 10)) {
    const flag = r.centristAnchor ? " [centrist-anchor]" : "";
    console.log(`  ${r.id}  ${r.name.padEnd(40)} dist=${r.dist.toFixed(4)}${flag}`);
}
console.log();
const pcnRank = ranked.findIndex((r) => r.id === "134");
const hingeRank = ranked.findIndex((r) => r.id === "060");
console.log(`Progressive Civic Nationalist (134) rank: #${pcnRank + 1}`);
console.log(`Hinge Citizen (060) rank: #${hingeRank + 1}${ranked[hingeRank]?.centristAnchor ? " (anti-gate applied)" : ""}`);
console.log();
// ── Run election prediction ──
const sig = respondentSignatureFromState(state);
const tally = {};
const electionList = [];
for (const election of ELECTIONS) {
    const ctx = getContext(election.year);
    if (!ctx)
        continue;
    const pred = predictVote(sig, election.candidates, ctx, "highly-engaged", state.partyID);
    const w = pred.decision === "vote" ? pred.nearest.party : "ABSTAIN";
    tally[w] = (tally[w] ?? 0) + 1;
    electionList.push({ year: election.year, winner: pred.nearest.name, party: pred.nearest.party, decision: pred.decision });
}
console.log("--- Election predictions (post-1932) ---");
for (const e of electionList.filter((e) => e.year >= 1932)) {
    console.log(`  ${e.year}  ${e.winner.padEnd(22)}  ${e.party.padEnd(14)} ${e.decision === "abstain" ? "(ABSTAIN)" : ""}`);
}
console.log();
console.log("--- Tally by party ---");
const sortedTally = Object.entries(tally).sort(([, a], [, b]) => b - a);
for (const [p, n] of sortedTally) {
    console.log(`  ${p.padEnd(25)}  ${n}/60`);
}
console.log();
// Expected post-fix:
//   - PCN should be in top 3, Hinge demoted significantly
//   - Post-1932 should be ~95%+ Democratic
const post1932 = electionList.filter((e) => e.year >= 1932);
const post1932Dem = post1932.filter((e) => e.party === "Democratic").length;
console.log(`Post-1932 Democratic vote rate: ${post1932Dem}/${post1932.length} (${(100 * post1932Dem / post1932.length).toFixed(0)}%)`);
//# sourceMappingURL=test-user-trace-regression.js.map