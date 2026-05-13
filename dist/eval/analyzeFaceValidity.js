/**
 * Face-validity spot-check: surface pairs (archetype, entity) that are
 * semantically implausible. Uses structured rules:
 *
 *   - Identity-primary archetypes (141-146) should vote same-side as their identity
 *     suggests: LGBTQ Voter shouldn't top-1 McCain/Romney/Trump; White Grievance
 *     shouldn't top-1 progressive-era Dems; Black Voter shouldn't top-1 Segregationists.
 *   - Radical-left archetypes (011-017 Jacobin/Class-War/Redistributionist) shouldn't
 *     have Republican preference post-1960.
 *   - Traditionalist-right archetypes (086, 088, 089, 137) shouldn't have Democratic
 *     preference post-1964 (post-civil-rights realignment).
 *   - Archetype-regime: cosmopolitan/universalist archetypes paired with fascist/
 *     authoritarian regimes suggests distance function aligned on wrong dimensions.
 *
 * Also: list pre-registered pair {098↔102} and {070↔075} exact distances to show
 * why they never surface as top-1/top-2.
 */
import * as fs from "fs";
import * as path from "path";
import { ARCHETYPES } from "../config/archetypes.js";
import { CONTINUOUS_NODES, CATEGORICAL_NODES } from "../config/nodes.js";
import { archetypeDistance } from "../engine/archetypeDistance.js";
import { ELECTIONS } from "../historical/candidates.js";
import { EUROPE_PART1 } from "../global/jurisdictions-europe1.js";
import { EUROPE_PART2 } from "../global/jurisdictions-europe2.js";
import { AMERICAS } from "../global/jurisdictions-americas.js";
import { ASIA } from "../global/jurisdictions-asia.js";
import { MENA_AFRICA } from "../global/jurisdictions-mena.js";
const DEACTIVATED = new Set(["019", "023", "025"]);
const UNIFORM_SAL = [0.25, 0.25, 0.25, 0.25];
function oneHotPos(pos) {
    const out = [0, 0, 0, 0, 0];
    out[Math.max(1, Math.min(5, Math.round(pos))) - 1] = 1;
    return out;
}
function oneHotCat(catIdx) {
    const out = [0, 0, 0, 0, 0, 0];
    out[Math.max(0, Math.min(5, Math.round(catIdx)))] = 1;
    return out;
}
function candToState(c) {
    const state = {
        answers: {}, continuous: {}, categorical: {},
        trbAnchor: { dist: [0, 0, 0, 0, 0, 0, 0, 0, 0], touches: 0 },
        archetypeDistances: {},
    };
    for (const n of CONTINUOUS_NODES) {
        state.continuous[n] = {
            posDist: oneHotPos(c[n]),
            salDist: [...UNIFORM_SAL],
            touches: 1, touchTypes: new Set(), status: "live_resolved",
        };
    }
    for (const n of CATEGORICAL_NODES) {
        state.categorical[n] = {
            catDist: oneHotCat(c[n]),
            salDist: [...UNIFORM_SAL],
            touches: 1, touchTypes: new Set(), status: "live_resolved",
        };
    }
    return state;
}
function regimeToState(r) {
    const state = {
        answers: {}, continuous: {}, categorical: {},
        trbAnchor: { dist: [0, 0, 0, 0, 0, 0, 0, 0, 0], touches: 0 },
        archetypeDistances: {},
    };
    for (const n of CONTINUOUS_NODES) {
        state.continuous[n] = {
            posDist: oneHotPos(r[n]),
            salDist: [...UNIFORM_SAL],
            touches: 1, touchTypes: new Set(), status: "live_resolved",
        };
    }
    for (const n of CATEGORICAL_NODES) {
        state.categorical[n] = {
            catDist: oneHotCat(r[n]),
            salDist: [...UNIFORM_SAL],
            touches: 1, touchTypes: new Set(), status: "live_resolved",
        };
    }
    return state;
}
function archetypeToState(arch) {
    const state = {
        answers: {}, continuous: {}, categorical: {},
        trbAnchor: { dist: [0, 0, 0, 0, 0, 0, 0, 0, 0], touches: 0 },
        archetypeDistances: {},
    };
    for (const n of CONTINUOUS_NODES) {
        const tmpl = arch.nodes[n];
        if (tmpl && tmpl.kind === "continuous") {
            const ct = tmpl;
            const posDist = [0, 0, 0, 0, 0];
            posDist[ct.pos - 1] = 1;
            const salDist = [0, 0, 0, 0];
            salDist[ct.sal] = 1;
            state.continuous[n] = {
                posDist, salDist, touches: 1, touchTypes: new Set(), status: "live_resolved",
            };
        }
        else {
            state.continuous[n] = {
                posDist: [0.2, 0.2, 0.2, 0.2, 0.2], salDist: [...UNIFORM_SAL],
                touches: 0, touchTypes: new Set(), status: "unknown",
            };
        }
    }
    for (const n of CATEGORICAL_NODES) {
        const tmpl = arch.nodes[n];
        if (tmpl && tmpl.kind === "categorical") {
            const ct = tmpl;
            const salDist = [0, 0, 0, 0];
            salDist[ct.sal] = 1;
            state.categorical[n] = {
                catDist: [...ct.probs],
                salDist, touches: 1, touchTypes: new Set(), status: "live_resolved",
            };
        }
        else {
            state.categorical[n] = {
                catDist: [1 / 6, 1 / 6, 1 / 6, 1 / 6, 1 / 6, 1 / 6],
                salDist: [...UNIFORM_SAL],
                touches: 0, touchTypes: new Set(), status: "unknown",
            };
        }
    }
    return state;
}
function main() {
    const outDir = path.join(process.cwd(), "results", "audit");
    const activeArch = ARCHETYPES.filter(a => a.active !== false && !DEACTIVATED.has(a.id));
    const archById = new Map(activeArch.map(a => [a.id, a]));
    const ALL_REGIMES = [...EUROPE_PART1, ...EUROPE_PART2, ...AMERICAS, ...ASIA, ...MENA_AFRICA];
    // ── Identity-primary archetype spot checks (141-146)
    // For each identity-primary archetype, find their top-1 candidate in each
    // post-1960 election and flag obvious mismatches.
    const identityArch = ["141", "142", "143", "144", "145", "146"];
    const postModernYears = [1964, 1968, 1972, 1976, 1980, 1984, 1988, 1992, 1996, 2000, 2004, 2008, 2012, 2016, 2020, 2024];
    const identityAnalysis = [];
    identityAnalysis.push("## Identity-primary archetype candidate preferences (post-1964)");
    identityAnalysis.push("");
    identityAnalysis.push("For each identity-primary archetype (141-146), best-fit candidate per year.");
    identityAnalysis.push("Face-invalid flag for: LGBTQ→anti-LGBT Republican; Black Voter→Segregationist; etc.");
    identityAnalysis.push("");
    for (const aid of identityArch) {
        const a = archById.get(aid);
        if (!a)
            continue;
        identityAnalysis.push(`### ${a.id} ${a.name}`);
        identityAnalysis.push("");
        identityAnalysis.push("| year | best candidate | party | dist | margin to #2 |");
        identityAnalysis.push("|---|---|---|---|---|");
        for (const y of postModernYears) {
            const el = ELECTIONS.find(e => e.year === y);
            if (!el)
                continue;
            const dists = el.candidates.map(c => ({ c, d: archetypeDistance(candToState(c), a) }));
            dists.sort((a, b) => a.d - b.d);
            const top1 = dists[0];
            const margin = (dists[1]?.d ?? top1.d) - top1.d;
            identityAnalysis.push(`| ${y} | ${top1.c.name} | ${top1.c.party} | ${top1.d.toFixed(3)} | ${margin.toFixed(3)} |`);
        }
        identityAnalysis.push("");
    }
    // ── Pre-registered pair forensics
    const preReg = [["098", "102"], ["070", "075"]];
    const preRegForensics = [];
    preRegForensics.push("## Pre-registered family-pair forensics");
    preRegForensics.push("");
    for (const [a, b] of preReg) {
        const A = archById.get(a), B = archById.get(b);
        if (!A || !B)
            continue;
        const stateA = archetypeToState(A);
        const stateB = archetypeToState(B);
        const dAB = archetypeDistance(stateA, B);
        const dBA = archetypeDistance(stateB, A);
        preRegForensics.push(`### Pair {${a} ${A.name}, ${b} ${B.name}}`);
        preRegForensics.push(`- distance A→B: ${dAB.toFixed(4)}`);
        preRegForensics.push(`- distance B→A: ${dBA.toFixed(4)}`);
        preRegForensics.push(`- symmetric distance: ${((dAB + dBA) / 2).toFixed(4)}`);
        // What are the ACTUAL nearest neighbors of each?
        const neighborsA = [];
        for (const other of activeArch) {
            if (other.id === a)
                continue;
            const d = archetypeDistance(stateA, other);
            neighborsA.push({ id: other.id, name: other.name, d });
        }
        neighborsA.sort((x, y) => x.d - y.d);
        preRegForensics.push(`- Actual top-5 nearest neighbors of ${a}:`);
        for (const n of neighborsA.slice(0, 5)) {
            preRegForensics.push(`    - ${n.id} ${n.name} (d=${n.d.toFixed(4)})`);
        }
        const neighborsB = [];
        for (const other of activeArch) {
            if (other.id === b)
                continue;
            const d = archetypeDistance(stateB, other);
            neighborsB.push({ id: other.id, name: other.name, d });
        }
        neighborsB.sort((x, y) => x.d - y.d);
        preRegForensics.push(`- Actual top-5 nearest neighbors of ${b}:`);
        for (const n of neighborsB.slice(0, 5)) {
            preRegForensics.push(`    - ${n.id} ${n.name} (d=${n.d.toFixed(4)})`);
        }
        preRegForensics.push("");
    }
    // ── Semantic-implausibility spot-check on regimes
    // For each regime, archetypeDistance top-1. Flag:
    //   - Cosmopolitan/Pluralist archetypes (MOR=5, CU=5) paired with fascist/
    //     totalitarian regimes (Nazi, Stalin, Mao, Khmer Rouge, etc.)
    //   - Universalist/Pluralist archetypes paired with colonial/apartheid regimes
    const concerningRegimes = [
        { name: "Nazi Germany", look: "Nazi Germany" },
        { name: "Stalin", look: "Stalin" },
        { name: "Mao Early", look: "Mao Early" },
        { name: "Cultural Revolution", look: "Cultural Revolution" },
        { name: "Khmer Rouge", look: "Khmer Rouge" },
        { name: "Vichy France", look: "Vichy France" },
        { name: "Rwanda|Genocide", look: "Genocide" },
        { name: "Franco", look: "Franco" },
        { name: "Apartheid", look: "Apartheid" },
        { name: "Myanmar", look: "Myanmar" },
        { name: "Milošević", look: "Milošević" },
    ];
    const regimeSpot = [];
    regimeSpot.push("## Authoritarian-regime archetype matches (face-validity check)");
    regimeSpot.push("");
    regimeSpot.push("For each obviously authoritarian regime, top-3 best-matching archetypes.");
    regimeSpot.push("Cosmopolitan/egalitarian/universalist archetypes surfacing here are face-invalid.");
    regimeSpot.push("");
    for (const cr of concerningRegimes) {
        const regime = ALL_REGIMES.find(r => r.regime.includes(cr.look) || r.jurisdiction.includes(cr.look));
        if (!regime)
            continue;
        const state = regimeToState(regime);
        const dists = activeArch.map(a => ({ a, d: archetypeDistance(state, a) }));
        dists.sort((x, y) => x.d - y.d);
        regimeSpot.push(`### ${regime.jurisdiction} | ${regime.regime} (${regime.startYear}-${regime.endYear})`);
        regimeSpot.push(`Profile: MAT=${regime.MAT} CD=${regime.CD} CU=${regime.CU} MOR=${regime.MOR} PRO=${regime.PRO} ZS=${regime.ZS} ONT_H=${regime.ONT_H} PF=${regime.PF} TRB=${regime.TRB}`);
        regimeSpot.push("");
        regimeSpot.push("| rank | archId | archetype | dist |");
        regimeSpot.push("|---|---|---|---|");
        for (let i = 0; i < 5; i++) {
            const x = dists[i];
            regimeSpot.push(`| ${i + 1} | ${x.a.id} | ${x.a.name} | ${x.d.toFixed(3)} |`);
        }
        regimeSpot.push("");
    }
    // ── Write face-validity report
    const lines = [];
    lines.push("# Face-Validity Spot Check");
    lines.push(`*Generated ${new Date().toISOString()}*`);
    lines.push("");
    lines.push(...identityAnalysis);
    lines.push(...preRegForensics);
    lines.push(...regimeSpot);
    fs.writeFileSync(path.join(outDir, "face-validity-spot.md"), lines.join("\n"));
    console.log(`Wrote ${outDir}/face-validity-spot.md`);
}
main();
//# sourceMappingURL=analyzeFaceValidity.js.map