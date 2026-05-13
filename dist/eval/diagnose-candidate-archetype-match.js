/**
 * Candidate-to-archetype matching diagnostic.
 *
 * For each presidential candidate in candidates.ts, compute the engine's
 * archetypeDistance against all 121 active archetypes and rank them. Output:
 * top-3 archetype matches per candidate. Uses the same archetypeDistance
 * function the live quiz uses for scoring — so a candidate's "archetype" is
 * literally the archetype a PRISM respondent with that candidate's signature
 * would be classified as.
 *
 * The candidate profile is converted to a synthetic RespondentState with
 * posDist peaked at the candidate's coded position, salDist peaked at sal=2
 * (moderate caring, a reasonable default for political figures), and catDist
 * peaked at the coded categorical index.
 *
 * Output: results/centroid-sim/candidate-archetype-matches.json
 */
import * as fs from "fs";
import * as path from "path";
import { ARCHETYPES } from "../config/archetypes.js";
import { ELECTIONS } from "../historical/candidates.js";
import { CONTINUOUS_NODES, CATEGORICAL_NODES } from "../config/nodes.js";
import { archetypeDistance } from "../engine/archetypeDistance.js";
const DEACTIVATED = new Set(["019", "023", "025"]);
const DEFAULT_SAL = 2;
function peakedPosDist(pos) {
    const d = [0, 0, 0, 0, 0];
    const idx = Math.max(0, Math.min(4, Math.round(pos) - 1));
    d[idx] = 1;
    return d;
}
function peakedSalDist(sal) {
    const d = [0, 0, 0, 0];
    const idx = Math.max(0, Math.min(3, Math.round(sal)));
    d[idx] = 1;
    return d;
}
function peakedCatDist(catIdx) {
    const d = [0, 0, 0, 0, 0, 0];
    const idx = Math.max(0, Math.min(5, Math.round(catIdx)));
    d[idx] = 1;
    return d;
}
function candidateToState(cand) {
    const continuous = {};
    for (const nodeId of CONTINUOUS_NODES) {
        const p = cand[nodeId];
        continuous[nodeId] = {
            posDist: peakedPosDist(p),
            salDist: peakedSalDist(DEFAULT_SAL),
            touches: 1,
            touchTypes: new Set(),
            status: "live_resolved",
        };
    }
    const categorical = {};
    for (const nodeId of CATEGORICAL_NODES) {
        const idx = cand[nodeId];
        categorical[nodeId] = {
            catDist: peakedCatDist(idx),
            salDist: peakedSalDist(DEFAULT_SAL),
            touches: 1,
            touchTypes: new Set(),
            status: "live_resolved",
        };
    }
    return {
        answers: {},
        continuous,
        categorical,
        trbAnchor: {
            dist: [1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9],
            touches: 0,
        },
        archetypePosterior: {},
        archetypeDistances: {},
        currentLeader: undefined,
        consecutiveLeadCount: 0,
    };
}
const activeArchetypes = ARCHETYPES.filter((a) => !DEACTIVATED.has(a.id));
const matches = [];
console.log("=== Candidate → Archetype Matching ===");
console.log(`Candidates:  ${ELECTIONS.reduce((sum, e) => sum + e.candidates.length, 0)}`);
console.log(`Archetypes:  ${activeArchetypes.length}`);
console.log();
for (const election of ELECTIONS) {
    for (const cand of election.candidates) {
        const state = candidateToState(cand);
        const dists = activeArchetypes.map((a) => ({
            id: a.id,
            name: a.name,
            tier: a.tier,
            distance: archetypeDistance(state, a),
        }));
        dists.sort((a, b) => a.distance - b.distance);
        matches.push({
            candidateYear: cand.year,
            candidateName: cand.name,
            candidateParty: cand.party,
            top3: dists.slice(0, 3).map((d) => ({ ...d, distance: Math.round(d.distance * 1000) / 1000 })),
        });
    }
}
const outDir = path.join("results", "centroid-sim");
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "candidate-archetype-matches.json"), JSON.stringify({
    meta: {
        candidates: matches.length,
        archetypes: activeArchetypes.length,
        defaultSal: DEFAULT_SAL,
        note: "Candidate profile → synthetic RespondentState (posDist peaked at coded pos, sal=2 default) → archetypeDistance ranked against 121 active archetypes.",
    },
    matches,
}, null, 2));
// ─── Console preview: a handful of candidates ─────────────────────────────
console.log("Sample matches:");
const samples = ["Washington_1789", "Lincoln_1860", "Roosevelt_1932", "Nixon_1972",
    "McGovern_1972", "Reagan_1984", "Obama_2008", "Trump_2016", "Biden_2020", "Harris_2024"];
for (const key of samples) {
    const [name, yr] = key.split("_");
    const m = matches.find((x) => x.candidateName === name && x.candidateYear === parseInt(yr));
    if (!m)
        continue;
    console.log(`  ${m.candidateYear}  ${m.candidateName.padEnd(14)} (${m.candidateParty})`);
    for (const a of m.top3) {
        console.log(`      #${a.id}  ${a.name.padEnd(36)}  dist=${a.distance.toFixed(3)}  [${a.tier}]`);
    }
}
console.log();
console.log(`Wrote ${path.join(outDir, "candidate-archetype-matches.json")}`);
//# sourceMappingURL=diagnose-candidate-archetype-match.js.map