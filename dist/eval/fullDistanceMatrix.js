/**
 * Compute the full archetype->candidate distance matrix for a given year set,
 * bypassing the audit's top-5 cap. Writes results/reconciliation/full-distances.jsonl
 * so Python reconciliation can see PRISM's *implicit* vote for every archetype.
 *
 * Usage:
 *   npx tsx src/eval/fullDistanceMatrix.ts
 */
import * as fs from "fs";
import * as path from "path";
import { archetypeDistance } from "../engine/archetypeDistance.js";
import { ARCHETYPES } from "../config/archetypes.js";
import { CONTINUOUS_NODES, CATEGORICAL_NODES } from "../config/nodes.js";
import { ELECTIONS } from "../historical/candidates.js";
// Production scoring constants (mirror archetypeDistance.ts)
const CATEGORICAL_PREFERRED_THRESHOLD = 0.30;
const ANTI_PENALTY = 10.0;
const ANTI_HIGH_THRESHOLD = 3.8;
const ANTI_LOW_THRESHOLD = 2.2;
function expectedPos(posDist) {
    return ((posDist[0] ?? 0) * 1 + (posDist[1] ?? 0) * 2 + (posDist[2] ?? 0) * 3 +
        (posDist[3] ?? 0) * 4 + (posDist[4] ?? 0) * 5);
}
function expectedSal(salDist) {
    return ((salDist[0] ?? 0) * 0 + (salDist[1] ?? 0) * 1 +
        (salDist[2] ?? 0) * 2 + (salDist[3] ?? 0) * 3);
}
function perNodeBreakdown(state, archetype) {
    const out = [];
    for (const nodeId of CONTINUOUS_NODES) {
        const template = archetype.nodes[nodeId];
        if (!template || template.kind !== "continuous")
            continue;
        const nodeState = state.continuous[nodeId];
        const pR = expectedPos(nodeState.posDist);
        const pA = template.pos;
        const sR = expectedSal(nodeState.salDist);
        const sA = template.sal;
        const w = Math.max(sA, sR);
        const dp = pA - pR;
        let contribution = dp * dp * w;
        let antiFired = false;
        if (template.anti === "high" && pR > ANTI_HIGH_THRESHOLD) {
            contribution += ANTI_PENALTY;
            antiFired = true;
        }
        else if (template.anti === "low" && pR < ANTI_LOW_THRESHOLD) {
            contribution += ANTI_PENALTY;
            antiFired = true;
        }
        out.push({
            node: nodeId, kind: "continuous",
            pR, pA, sR, sA, w,
            posDelta: dp,
            anti: template.anti,
            antiFired,
            contribution,
        });
    }
    for (const nodeId of CATEGORICAL_NODES) {
        const template = archetype.nodes[nodeId];
        if (!template || template.kind !== "categorical")
            continue;
        const nodeState = state.categorical[nodeId];
        let preferredIdx = -1, preferredProb = 0;
        for (let i = 0; i < 6; i++) {
            const p = template.probs[i] ?? 0;
            if (p > preferredProb) {
                preferredProb = p;
                preferredIdx = i;
            }
        }
        let preferredTerm = 0;
        if (preferredProb >= CATEGORICAL_PREFERRED_THRESHOLD && preferredIdx >= 0) {
            preferredTerm = 1 - (nodeState.catDist[preferredIdx] ?? 0);
        }
        let antiTerm = 0;
        if (template.antiCats && template.antiCats.length > 0) {
            for (const antiIdx of template.antiCats) {
                if (antiIdx >= 0 && antiIdx < 6)
                    antiTerm += nodeState.catDist[antiIdx] ?? 0;
            }
        }
        const sR = expectedSal(nodeState.salDist);
        const sA = template.sal;
        const w = Math.max(sA, sR);
        const contribution = (preferredTerm + antiTerm) * w;
        out.push({
            node: nodeId, kind: "categorical",
            sR, sA, w,
            preferredIdx, preferredProb, preferredTerm, antiTerm,
            antiFired: false,
            contribution,
        });
    }
    return out;
}
const YEARS_IN_SCOPE = [1936, 1940, 1944, 1948, 1952, 1956, 1960];
const UNIFORM_SAL = [0.25, 0.25, 0.25, 0.25];
function oneHotPos(pos) {
    const out = [0, 0, 0, 0, 0];
    const idx = Math.max(0, Math.min(4, Math.round(pos) - 1));
    out[idx] = 1;
    return out;
}
function oneHotCat(idx) {
    const out = [0, 0, 0, 0, 0, 0];
    const i = Math.max(0, Math.min(5, Math.round(idx)));
    out[i] = 1;
    return out;
}
function profileToState(profile) {
    const state = {
        answers: {},
        continuous: {},
        categorical: {},
        trbAnchor: { dist: [0, 0, 0, 0, 0, 0, 0, 0, 0], touches: 0 },
        archetypeDistances: {},
    };
    for (const nodeId of CONTINUOUS_NODES) {
        const pos = profile[nodeId];
        state.continuous[nodeId] = {
            posDist: oneHotPos(pos ?? 3),
            salDist: [...UNIFORM_SAL],
            touches: 1,
            touchTypes: new Set(),
            status: "live_resolved",
        };
    }
    for (const nodeId of CATEGORICAL_NODES) {
        const catIdx = profile[nodeId];
        state.categorical[nodeId] = {
            catDist: oneHotCat(catIdx ?? 0),
            salDist: [...UNIFORM_SAL],
            touches: 1,
            touchTypes: new Set(),
            status: "live_resolved",
        };
    }
    return state;
}
const activeArchetypes = ARCHETYPES.filter(a => (a.prior ?? 0) > 0 || a.id === "019" || a.id === "023" || a.id === "025");
// Actually — include all 121 so deactivated ones are comparable (the LLM reviews covered them too)
const allArchetypes = ARCHETYPES;
const outDir = path.join("results", "reconciliation");
fs.mkdirSync(outDir, { recursive: true });
const outPath = path.join(outDir, "full-distances.jsonl");
const out = [];
// Second output: per-(year,archetype) breakdown by candidate — used for
// thorough adjudication. Key = `${year}:${archId}:${candidate}`.
const breakdownOut = [];
for (const election of ELECTIONS) {
    if (!YEARS_IN_SCOPE.includes(election.year))
        continue;
    for (const cand of election.candidates) {
        const state = profileToState(cand);
        const dists = [];
        for (const a of allArchetypes) {
            const d = archetypeDistance(state, a);
            dists.push({ archId: a.id, archName: a.name, dist: d });
            // Emit per-node breakdown for every (year, archetype, candidate)
            const bd = perNodeBreakdown(state, a);
            breakdownOut.push(JSON.stringify({
                year: election.year,
                archId: a.id,
                candidate: cand.name,
                dist: d,
                breakdown: bd.map(b => ({
                    node: b.node, kind: b.kind,
                    pR: b.pR !== undefined ? Math.round(b.pR * 1000) / 1000 : undefined,
                    pA: b.pA, sR: Math.round(b.sR * 1000) / 1000, sA: b.sA, w: Math.round(b.w * 1000) / 1000,
                    posDelta: b.posDelta !== undefined ? Math.round(b.posDelta * 1000) / 1000 : undefined,
                    anti: b.anti, antiFired: b.antiFired,
                    preferredIdx: b.preferredIdx, preferredProb: b.preferredProb,
                    preferredTerm: b.preferredTerm !== undefined ? Math.round(b.preferredTerm * 1000) / 1000 : undefined,
                    antiTerm: b.antiTerm !== undefined ? Math.round(b.antiTerm * 1000) / 1000 : undefined,
                    contribution: Math.round(b.contribution * 10000) / 10000,
                })),
            }));
        }
        dists.sort((x, y) => x.dist - y.dist);
        out.push(JSON.stringify({
            year: election.year,
            candidate: cand.name,
            party: cand.party ?? null,
            archetypeDistances: dists,
        }));
    }
}
fs.writeFileSync(outPath, out.join("\n") + "\n", "utf-8");
console.log(`Wrote ${out.length} rows to ${outPath}`);
const breakdownPath = path.join(outDir, "per-node-breakdown.jsonl");
fs.writeFileSync(breakdownPath, breakdownOut.join("\n") + "\n", "utf-8");
console.log(`Wrote ${breakdownOut.length} breakdown rows to ${breakdownPath}`);
//# sourceMappingURL=fullDistanceMatrix.js.map