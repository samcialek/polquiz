/**
 * Layer 3 — Synthetic Progressive Counterfactual
 *
 * Hand-build a "canonical progressive Democrat" RespondentState with peaked
 * distributions and run it through:
 *   1. archetypeDistance → print top 10 nearest archetypes
 *   2. predictVote → print predicted winner in each of the 60 elections
 *
 * If the stack is working, top archetypes should be Bread-and-Butter Progressive,
 * Jacobin Egalitarian, Class-War Leftist, Activist Progressive, etc. Elections
 * should be heavily Democratic (Clinton, Obama, Biden, Harris, Kennedy, FDR).
 *
 * If this test shows the WRONG winner, the bug is downstream of the quiz —
 * either the archetype scorer, the archetype library encoding, or the election
 * prediction module. If this test shows the RIGHT winner, the bug is in the
 * quiz-side signature construction (question evidence maps, etc.).
 */
import { ARCHETYPES } from "../config/archetypes.js";
import { archetypeDistance } from "../engine/archetypeDistance.js";
import { ELECTIONS } from "../historical/candidates.js";
import { getContext } from "../historical/contexts.js";
import { predictVote } from "../historical/respondentVoteChoice.js";
import { respondentSignatureFromState } from "../engine/respondentSignature.js";
const DEACTIVATED = new Set(["019", "023", "025"]);
function peakedPos(pos) {
    // Build a posDist peaked at pos (1-5), with Gaussian-ish spread.
    const out = [0, 0, 0, 0, 0];
    for (let i = 0; i < 5; i++) {
        const d = i + 1 - pos;
        out[i] = Math.exp(-(d * d) / 0.4);
    }
    const s = out.reduce((a, b) => a + b, 0);
    for (let i = 0; i < 5; i++)
        out[i] /= s;
    return out;
}
function peakedSal(sal) {
    const out = [0, 0, 0, 0];
    for (let i = 0; i < 4; i++) {
        const d = i - sal;
        out[i] = Math.exp(-(d * d) / 0.3);
    }
    const s = out.reduce((a, b) => a + b, 0);
    for (let i = 0; i < 4; i++)
        out[i] /= s;
    return out;
}
function peakedCat(idx) {
    const out = [0, 0, 0, 0, 0, 0];
    for (let i = 0; i < 6; i++) {
        const d = i - idx;
        out[i] = Math.exp(-(d * d) / 0.5);
    }
    const s = out.reduce((a, b) => a + b, 0);
    for (let i = 0; i < 6; i++)
        out[i] /= s;
    return out;
}
// Canonical progressive Democrat signature (user's self-reported profile):
//   MAT share-wealth, CU pluralist, MOR wide, CD change-with-times,
//   ONT_S system-broken, ZS not-zero-sum, ONT_H egalitarian,
//   TRB not-tribal, PRO moderate, COM cut-a-deal, PF moderate, ENG high
const TARGET_POS = {
    MAT: 1.4, // share the wealth
    CU: 4.5, // pluralist (NOTE: user says they got ~1. Expected ~4.5)
    MOR: 4, // wide moral circle
    CD: 1.5, // change with the times
    PRO: 3, // middle
    COM: 2, // cut a deal
    ZS: 2, // not zero-sum
    ONT_H: 2, // egalitarian
    ONT_S: 2, // system somewhat broken
    PF: 3, // moderate partisan
    TRB: 2, // not tribal
    ENG: 4, // engaged
};
const TARGET_SAL = {
    MAT: 3, CU: 2, MOR: 2, CD: 1, PRO: 1,
    COM: 2, ZS: 2, ONT_H: 2, ONT_S: 3,
};
// EPS: empiricist (idx 0) for a rationalist progressive; or institutionalist (1)
const EPS_IDX = 1; // institutionalist-leaning progressive
const EPS_SAL = 2;
// AES: visionary (idx 5) for a progressive; or fighter (4)
const AES_IDX = 5;
const AES_SAL = 2;
function buildSyntheticState() {
    const state = {
        answers: {},
        continuous: {},
        categorical: {},
        trbAnchor: {
            dist: [1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9],
            touches: 0,
        },
        archetypeDistances: {},
        currentLeader: undefined,
        consecutiveLeadCount: 0,
    };
    for (const [nodeId, pos] of Object.entries(TARGET_POS)) {
        state.continuous[nodeId] = {
            posDist: peakedPos(pos),
            salDist: peakedSal(TARGET_SAL[nodeId] ?? 1),
            touches: 5,
            touchTypes: new Set(),
            status: "active",
        };
    }
    state.categorical.EPS = {
        catDist: peakedCat(EPS_IDX),
        salDist: peakedSal(EPS_SAL),
        touches: 5,
        touchTypes: new Set(),
        status: "active",
    };
    state.categorical.AES = {
        catDist: peakedCat(AES_IDX),
        salDist: peakedSal(AES_SAL),
        touches: 5,
        touchTypes: new Set(),
        status: "active",
    };
    return state;
}
const state = buildSyntheticState();
console.log("=== Layer 3: Synthetic Progressive Counterfactual ===");
console.log();
console.log("Target signature (hand-built canonical progressive Democrat):");
console.log("  MAT pos=1.4  sal=3  (share wealth, highest salience)");
console.log("  CU  pos=4.5  sal=2  (pluralist)");
console.log("  MOR pos=4    sal=2  (wide moral circle)");
console.log("  CD  pos=1.5  sal=1  (change with times)");
console.log("  PRO pos=3    sal=1  (middle)");
console.log("  COM pos=2    sal=2  (cut a deal)");
console.log("  ZS  pos=2    sal=2  (not zero-sum)");
console.log("  ONT_H pos=2  sal=2  (egalitarian)");
console.log("  ONT_S pos=2  sal=3  (system somewhat broken)");
console.log("  PF  pos=3            (moderate fusion)");
console.log("  TRB pos=2            (not tribal)");
console.log("  ENG pos=4            (engaged)");
console.log("  EPS institutionalist (idx 1) sal=2");
console.log("  AES visionary        (idx 5) sal=2");
console.log();
// ── 3a: Archetype matching ─────────────────────────────────────────────────
const active = ARCHETYPES.filter((a) => !DEACTIVATED.has(a.id));
const ranked = active
    .map((a) => ({ id: a.id, name: a.name, dist: archetypeDistance(state, a) }))
    .sort((a, b) => a.dist - b.dist);
console.log("--- Top 15 nearest archetypes ---");
for (const r of ranked.slice(0, 15)) {
    console.log(`  ${r.id}  ${r.name.padEnd(40)}  dist=${r.dist.toFixed(4)}`);
}
console.log();
console.log("--- Where known progressive archetypes ranked ---");
const expectedNames = [
    "Bread-and-Butter Progressive",
    "Activist Progressive",
    "Liberationist Progressive",
    "Localist Progressive",
    "Progressive Civic Nationalist",
    "Jacobin Egalitarian",
    "Class-War Leftist",
    "Rawlsian Reformer",
    "Hinge Citizen",
];
for (const name of expectedNames) {
    const r = ranked.findIndex((x) => x.name === name);
    if (r < 0)
        continue;
    const entry = ranked[r];
    console.log(`  rank #${(r + 1).toString().padStart(3)}  ${entry.id}  ${entry.name.padEnd(40)}  dist=${entry.dist.toFixed(4)}`);
}
console.log();
// ── 3b: Election prediction ────────────────────────────────────────────────
const sig = respondentSignatureFromState(state);
console.log("--- Election predictions (engagement=engaged) ---");
const wins = {};
for (const election of ELECTIONS) {
    const ctx = getContext(election.year);
    if (!ctx)
        continue;
    const pred = predictVote(sig, election.candidates, ctx, "engaged");
    const winner = pred.decision === "vote" ? pred.nearest.name : "ABSTAIN";
    const party = pred.decision === "vote" ? pred.nearest.party : "-";
    wins[party] = (wins[party] ?? 0) + 1;
    const bar = " ".repeat(4 - Math.min(4, winner.length / 4));
    console.log(`  ${election.year}  ${winner.padEnd(22)}  ${party.padEnd(14)}  dist=${pred.nearest.distance.toFixed(3)}  clear=${pred.clearingBar}${bar}  ${pred.decision}`);
}
console.log();
console.log("--- Vote tally by party ---");
const tally = Object.entries(wins).sort(([, a], [, b]) => b - a);
for (const [party, n] of tally) {
    console.log(`  ${party.padEnd(25)}  ${n}/60`);
}
//# sourceMappingURL=diagnose-synthetic-progressive.js.map