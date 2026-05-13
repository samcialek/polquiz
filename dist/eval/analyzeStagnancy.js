/**
 * Proper post-2000 stagnancy analysis: for each archetype, compute the full
 * archetypeDistance vector against EVERY candidate in every post-2000 election
 * (not just top-5). Determine argmin per year → the candidate that best matches
 * the archetype. Then measure how often the party switches across 2000-2024.
 *
 * Also: per-archetype inverse coherence — rank candidates across all years for
 * each archetype and surface top-3 candidate matches overall.
 *
 * User's hypothesis: "since 2000 single-party voting for 75% of the electorate".
 * If our data shows most archetypes switching parties across 2000-2024, the
 * archetype-candidate distance pipeline is too diffuse.
 */
import * as fs from "fs";
import * as path from "path";
import { ARCHETYPES } from "../config/archetypes.js";
import { CONTINUOUS_NODES, CATEGORICAL_NODES } from "../config/nodes.js";
import { archetypeDistance } from "../engine/archetypeDistance.js";
import { ELECTIONS } from "../historical/candidates.js";
const DEACTIVATED = new Set(["019", "023", "025"]);
const UNIFORM_SAL = [0.25, 0.25, 0.25, 0.25];
const POST2000 = [2000, 2004, 2008, 2012, 2016, 2020, 2024];
const SOFTMAX_T = 0.04;
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
function main() {
    const outDir = path.join(process.cwd(), "results", "audit");
    fs.mkdirSync(outDir, { recursive: true });
    const activeArch = ARCHETYPES.filter(a => a.active !== false && !DEACTIVATED.has(a.id));
    const electionMap = new Map();
    for (const el of ELECTIONS)
        electionMap.set(el.year, el.candidates);
    // Precompute candidate states per year for post-2000 elections
    const candStatesByYear = new Map();
    for (const y of POST2000) {
        const cands = electionMap.get(y) ?? [];
        candStatesByYear.set(y, cands.map(c => ({ cand: c, state: candToState(c) })));
    }
    const results = [];
    for (const a of activeArch) {
        const rec = { archId: a.id, archName: a.name, byYear: {} };
        for (const y of POST2000) {
            const cands = candStatesByYear.get(y) ?? [];
            if (cands.length === 0)
                continue;
            const dists = cands.map(({ state }) => archetypeDistance(state, a));
            let minIdx = 0;
            for (let i = 1; i < dists.length; i++) {
                if (dists[i] < dists[minIdx])
                    minIdx = i;
            }
            const minD = dists[minIdx];
            // Softmax-normalized margin between top-1 and top-2 candidate for this archetype-year
            const sorted = [...dists].sort((a, b) => a - b);
            const marginDist = (sorted[1] ?? sorted[0]) - sorted[0];
            rec.byYear[y] = {
                cand: cands[minIdx].cand.name,
                party: cands[minIdx].cand.party,
                dist: +minD.toFixed(4),
                postMargin: +marginDist.toFixed(4),
            };
        }
        results.push(rec);
    }
    // Tally: per archetype, how many distinct parties across post-2000 years?
    const DEM = "Democratic", REP = "Republican";
    const summaries = [];
    for (const rec of results) {
        let dem = 0, rep = 0, oth = 0;
        const seqParts = [];
        for (const y of POST2000) {
            const r = rec.byYear[y];
            if (!r) {
                seqParts.push(`${y}:—`);
                continue;
            }
            if (r.party === DEM)
                dem++;
            else if (r.party === REP)
                rep++;
            else
                oth++;
            seqParts.push(`${y}:${r.cand}(${r.party[0]})`);
        }
        const total = dem + rep + oth;
        const [modalParty, modalCount] = (() => {
            const p = [["D", dem], ["R", rep], ["O", oth]];
            p.sort((a, b) => b[1] - a[1]);
            return p[0];
        })();
        summaries.push({
            archId: rec.archId, archName: rec.archName,
            demYears: dem, repYears: rep, otherYears: oth, totalYears: total,
            modalParty, modalCount,
            allSameParty: total > 0 && modalCount === total,
            seq: seqParts.join(" "),
        });
    }
    // Print summary stats
    const totalArch = summaries.length;
    const allSame = summaries.filter(s => s.allSameParty).length;
    const mostlyDem = summaries.filter(s => s.demYears >= 6).length;
    const mostlyRep = summaries.filter(s => s.repYears >= 6).length;
    const splitters = summaries.filter(s => !s.allSameParty && s.totalYears === 7).length;
    console.log(`Post-2000 stagnancy (${POST2000.length} elections, ${totalArch} archetypes):`);
    console.log(`  - All-same-party across 7/7: ${allSame} (${(100 * allSame / totalArch).toFixed(1)}%)`);
    console.log(`  - Dem 6/7 or 7/7: ${mostlyDem} (${(100 * mostlyDem / totalArch).toFixed(1)}%)`);
    console.log(`  - Rep 6/7 or 7/7: ${mostlyRep} (${(100 * mostlyRep / totalArch).toFixed(1)}%)`);
    console.log(`  - Ticket-splitters (party changed ≥ once): ${splitters} (${(100 * splitters / totalArch).toFixed(1)}%)`);
    // Write CSV
    const header = [
        "archId", "archName", "demYears", "repYears", "otherYears", "modalParty",
        "modalCount", "allSameParty", "seq",
    ].join(",");
    const rows = summaries.map(s => [
        s.archId, csvQ(s.archName), s.demYears, s.repYears, s.otherYears,
        s.modalParty, s.modalCount, s.allSameParty, csvQ(s.seq),
    ].join(","));
    fs.writeFileSync(path.join(outDir, "stagnancy-proper.csv"), [header, ...rows].join("\n"));
    // Ticket-splitters detail (archetypes that switched parties at least once)
    const splitRows = summaries.filter(s => s.totalYears === 7 && !s.allSameParty)
        .sort((a, b) => Math.min(a.demYears, a.repYears) - Math.min(b.demYears, b.repYears));
    const report = [];
    report.push("# Post-2000 Stagnancy — Proper Analysis");
    report.push(`*Generated ${new Date().toISOString()}*`);
    report.push("");
    report.push(`Per-archetype preferred candidate per election, computed by argmin of archetypeDistance`);
    report.push(`across all candidates in each election year. No softmax posterior, no top-5 filtering —`);
    report.push(`pure best-fit candidate per (archetype, year).`);
    report.push("");
    report.push("## Summary (118 active archetypes, 7 elections 2000-2024)");
    report.push("");
    report.push(`- **All-same-party 7/7**: ${allSame} (${(100 * allSame / totalArch).toFixed(1)}%)`);
    report.push(`- **Dem-leaning (≥6 dem years)**: ${mostlyDem} (${(100 * mostlyDem / totalArch).toFixed(1)}%)`);
    report.push(`- **Rep-leaning (≥6 rep years)**: ${mostlyRep} (${(100 * mostlyRep / totalArch).toFixed(1)}%)`);
    report.push(`- **Ticket-splitters (party changed ≥1×)**: ${splitters} (${(100 * splitters / totalArch).toFixed(1)}%)`);
    report.push("");
    report.push(`**User hypothesis**: 75% should vote single-party. **Result**: ${(100 * allSame / totalArch).toFixed(1)}% actually do.`);
    if (100 * allSame / totalArch >= 75) {
        report.push(`✓ Hypothesis holds — archetype-candidate pipeline shows expected stability.`);
    }
    else {
        report.push(`✗ Hypothesis fails — ${splitters} archetypes (${(100 * splitters / totalArch).toFixed(1)}%) switch parties.`);
        report.push(`This is consistent with the Step 4 finding that the archetypeDistance function produces`);
        report.push(`diffuse posteriors. If the quiz engine gives ticket-splitting archetypes in simulation,`);
        report.push(`the distance function is too lenient on candidate-archetype disagreement.`);
    }
    report.push("");
    report.push("## Ticket-splitters (in order of how split they are)");
    report.push("");
    report.push(`${splitRows.length} archetypes switched preferred party at least once across 2000-2024.`);
    report.push("");
    report.push("| archId | archetype | Dem | Rep | Other | sequence |");
    report.push("|---|---|---|---|---|---|");
    for (const s of splitRows) {
        report.push(`| ${s.archId} | ${s.archName} | ${s.demYears} | ${s.repYears} | ${s.otherYears} | ${s.seq} |`);
    }
    report.push("");
    // Most-suspect pairs: archetype-candidate pairs where archetype is mapped
    // to a candidate whose party differs from the archetype's apparent partisan lean
    // AS INFERRED from its top-5-regime modal_party.
    // Simpler flag: archetypes that lean Dem (>=4 dem years) but vote Rep in any year,
    // and vice versa.
    const suspectSwitches = [];
    for (const s of summaries) {
        if (s.totalYears === 7) {
            if (s.demYears >= 4 && s.repYears >= 1) {
                for (const y of POST2000) {
                    const rec = results.find(r => r.archId === s.archId).byYear[y];
                    if (rec?.party === "Republican") {
                        suspectSwitches.push(`${s.archId} ${s.archName} → ${rec.cand} (${y}, R) [dem-leaning, ${s.demYears}D/${s.repYears}R]`);
                    }
                }
            }
            else if (s.repYears >= 4 && s.demYears >= 1) {
                for (const y of POST2000) {
                    const rec = results.find(r => r.archId === s.archId).byYear[y];
                    if (rec?.party === "Democratic") {
                        suspectSwitches.push(`${s.archId} ${s.archName} → ${rec.cand} (${y}, D) [rep-leaning, ${s.demYears}D/${s.repYears}R]`);
                    }
                }
            }
        }
    }
    report.push("## Most suspect crossover pairs (archetype mostly-one-party, briefly switches)");
    report.push("");
    report.push(`${suspectSwitches.length} (archetype, crossover-candidate) pairs:`);
    report.push("");
    for (const s of suspectSwitches)
        report.push(`- ${s}`);
    report.push("");
    fs.writeFileSync(path.join(outDir, "stagnancy-proper.md"), report.join("\n"));
    console.log(`Wrote stagnancy-proper.md and stagnancy-proper.csv`);
}
function csvQ(s) {
    if (s.includes(",") || s.includes('"') || s.includes("\n")) {
        return `"${s.replace(/"/g, '""')}"`;
    }
    return s;
}
main();
//# sourceMappingURL=analyzeStagnancy.js.map