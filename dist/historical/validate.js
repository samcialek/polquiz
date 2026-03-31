/**
 * Historical Validation: Compare simulation predictions against known
 * voting coalition patterns in American political history.
 *
 * Usage: npx tsx src/historical/validate.ts
 */
import { ARCHETYPES } from "../config/archetypes.js";
import { ELECTIONS } from "./candidates.js";
import { simulate } from "./simulate.js";
// ── Helpers ──────────────────────────────────────────────────────────────────
function getPos(arch, node) {
    const tmpl = arch.nodes[node];
    if (!tmpl || tmpl.kind !== "continuous")
        return 3;
    return tmpl.pos;
}
function getSal(arch, node) {
    const tmpl = arch.nodes[node];
    if (!tmpl)
        return 0;
    return tmpl.sal;
}
function getCatPeak(arch, node) {
    const tmpl = arch.nodes[node];
    if (!tmpl || tmpl.kind !== "categorical")
        return 0;
    const probs = tmpl.probs;
    return probs.indexOf(Math.max(...probs));
}
function getVote(results, archId, year) {
    const r = results.find((r) => r.archetypeId === archId);
    return r ? r.votes[year] : "UNKNOWN";
}
function getVoteByName(results, name, year) {
    const r = results.find((r) => r.archetypeName === name);
    return r ? r.votes[year] : "UNKNOWN";
}
// ── Coalition Filters ────────────────────────────────────────────────────────
/** Archetypes representing union/labor workers: high MAT salience, low MAT (redistributive) */
function isLaborArchetype(arch) {
    const matPos = getPos(arch, "MAT");
    const matSal = getSal(arch, "MAT");
    const trbSal = getSal(arch, "TRB");
    return matPos <= 2 && matSal >= 2 && trbSal >= 1;
}
/** Archetypes with strong traditional morality and religiosity */
function isEvangelicalArchetype(arch) {
    const morPos = getPos(arch, "MOR");
    const morSal = getSal(arch, "MOR");
    const cdPos = getPos(arch, "CD");
    return morPos >= 4 && morSal >= 2 && cdPos >= 3;
}
/** College-educated suburbanites: moderate, proceduralist, institutionalist */
function isSuburbanEducatedArchetype(arch) {
    const proPos = getPos(arch, "PRO");
    const comPos = getPos(arch, "COM");
    const matPos = getPos(arch, "MAT");
    const epsPeak = getCatPeak(arch, "EPS");
    // Moderate economics (2-4), high proceduralism, willing to compromise, empiricist or institutionalist
    return matPos >= 2 && matPos <= 4 && proPos >= 4 && comPos >= 3 && (epsPeak === 0 || epsPeak === 1);
}
/** High cultural universalism, low MAT → progressive but not economic radical */
function isBlackCoalitionArchetype(arch) {
    // Archetypes with strong tribal attachment, structural view, and Democratic lean
    // Using structural orientation + low MAT + community-oriented as proxy
    const matPos = getPos(arch, "MAT");
    const ontSPos = getPos(arch, "ONT_S");
    const trbPos = getPos(arch, "TRB");
    const trbSal = getSal(arch, "TRB");
    return matPos <= 2 && ontSPos >= 4 && trbPos >= 3 && trbSal >= 2;
}
/** High MOR + high CD: social conservatives */
function isSocialConservativeArchetype(arch) {
    const morPos = getPos(arch, "MOR");
    const cdPos = getPos(arch, "CD");
    return morPos >= 4 && cdPos >= 4;
}
/** High MAT (free-market): economic conservatives */
function isFreeMarketArchetype(arch) {
    const matPos = getPos(arch, "MAT");
    const matSal = getSal(arch, "MAT");
    return matPos >= 4 && matSal >= 2;
}
/** Populist archetype: high ZS, high TRB, low PRO */
function isPopulistArchetype(arch) {
    const zsPos = getPos(arch, "ZS");
    const trbPos = getPos(arch, "TRB");
    const proPos = getPos(arch, "PRO");
    return zsPos >= 4 && trbPos >= 4 && proPos <= 2;
}
// ── Validation checks ───────────────────────────────────────────────────────
function runValidation(results) {
    const checks = [];
    // ── 1. Union/Labor → Democrat pre-1980, split after Reagan ──
    {
        const laborArchs = ARCHETYPES.filter(isLaborArchetype);
        const laborIds = laborArchs.map((a) => a.id);
        // Pre-1980: should mostly favor Democrats
        const preDemYears = [1960, 1964, 1968, 1972, 1976];
        let preDemCount = 0;
        let preTotalVotes = 0;
        for (const year of preDemYears) {
            const demCandidate = ELECTIONS.find((e) => e.year === year)
                ?.candidates.find((c) => c.party === "Democratic")?.name;
            for (const id of laborIds) {
                const vote = getVote(results, id, year);
                if (vote !== "ABSTAIN") {
                    preTotalVotes++;
                    if (vote === demCandidate)
                        preDemCount++;
                }
            }
        }
        const prePct = preTotalVotes > 0 ? (preDemCount / preTotalVotes * 100) : 0;
        // Post-Reagan: should be more split
        const postYears = [1984, 1988, 1992, 1996, 2000, 2004, 2008, 2012, 2016, 2020, 2024];
        let postDemCount = 0;
        let postTotalVotes = 0;
        for (const year of postYears) {
            const demCandidate = ELECTIONS.find((e) => e.year === year)
                ?.candidates.find((c) => c.party === "Democratic")?.name;
            for (const id of laborIds) {
                const vote = getVote(results, id, year);
                if (vote !== "ABSTAIN") {
                    postTotalVotes++;
                    if (vote === demCandidate)
                        postDemCount++;
                }
            }
        }
        const postPct = postTotalVotes > 0 ? (postDemCount / postTotalVotes * 100) : 0;
        checks.push({
            name: "Labor Coalition",
            description: "Union/labor archetypes should favor Democrats pre-1980, become more split after Reagan",
            pass: prePct > 60 && postPct < prePct,
            details: `Found ${laborArchs.length} labor archetypes.\n` +
                `  Pre-1980 Democrat vote: ${prePct.toFixed(1)}% (${preDemCount}/${preTotalVotes})\n` +
                `  Post-1980 Democrat vote: ${postPct.toFixed(1)}% (${postDemCount}/${postTotalVotes})\n` +
                `  Expected: pre-1980 > 60% Dem, post-1980 < pre-1980`,
        });
    }
    // ── 2. Evangelicals → Republican after 1976 ──
    {
        const evangArchs = ARCHETYPES.filter(isEvangelicalArchetype);
        const evangIds = evangArchs.map((a) => a.id);
        // 1976: Carter was evangelical — should be mixed
        let carterVotes1976 = 0;
        let total1976 = 0;
        for (const id of evangIds) {
            const vote = getVote(results, id, 1976);
            if (vote !== "ABSTAIN") {
                total1976++;
                if (vote === "Carter")
                    carterVotes1976++;
            }
        }
        // Post-1980: should be solidly Republican
        const postYears = [1980, 1984, 1988, 1992, 1996, 2000, 2004, 2008, 2012, 2016, 2020, 2024];
        let repCount = 0;
        let totalVotes = 0;
        for (const year of postYears) {
            const repCandidate = ELECTIONS.find((e) => e.year === year)
                ?.candidates.find((c) => c.party === "Republican")?.name;
            for (const id of evangIds) {
                const vote = getVote(results, id, year);
                if (vote !== "ABSTAIN") {
                    totalVotes++;
                    if (vote === repCandidate)
                        repCount++;
                }
            }
        }
        const repPct = totalVotes > 0 ? (repCount / totalVotes * 100) : 0;
        checks.push({
            name: "Evangelical Shift",
            description: "Evangelical archetypes should shift Republican after 1976",
            pass: repPct > 65,
            details: `Found ${evangArchs.length} evangelical archetypes.\n` +
                `  1976 Carter vote: ${total1976 > 0 ? (carterVotes1976 / total1976 * 100).toFixed(1) : "N/A"}% (${carterVotes1976}/${total1976})\n` +
                `  Post-1980 Republican vote: ${repPct.toFixed(1)}% (${repCount}/${totalVotes})\n` +
                `  Expected: >65% Republican after 1980`,
        });
    }
    // ── 3. College-educated suburbanites → shift Democratic after 2016 ──
    {
        const suburbArchs = ARCHETYPES.filter(isSuburbanEducatedArchetype);
        const suburbIds = suburbArchs.map((a) => a.id);
        // Pre-2016 Republican vote rate
        const preYears = [2000, 2004, 2008, 2012];
        let preRepCount = 0;
        let preTotal = 0;
        for (const year of preYears) {
            const repCandidate = ELECTIONS.find((e) => e.year === year)
                ?.candidates.find((c) => c.party === "Republican")?.name;
            for (const id of suburbIds) {
                const vote = getVote(results, id, year);
                if (vote !== "ABSTAIN") {
                    preTotal++;
                    if (vote === repCandidate)
                        preRepCount++;
                }
            }
        }
        const prePct = preTotal > 0 ? (preRepCount / preTotal * 100) : 0;
        // Post-2016 Democratic vote rate
        const postYears = [2016, 2020, 2024];
        let postDemCount = 0;
        let postTotal = 0;
        for (const year of postYears) {
            const demCandidate = ELECTIONS.find((e) => e.year === year)
                ?.candidates.find((c) => c.party === "Democratic")?.name;
            for (const id of suburbIds) {
                const vote = getVote(results, id, year);
                if (vote !== "ABSTAIN") {
                    postTotal++;
                    if (vote === demCandidate)
                        postDemCount++;
                }
            }
        }
        const postPct = postTotal > 0 ? (postDemCount / postTotal * 100) : 0;
        checks.push({
            name: "Suburban Realignment",
            description: "College-educated suburbanites should shift Democratic after 2016",
            pass: postPct > 50,
            details: `Found ${suburbArchs.length} suburban educated archetypes.\n` +
                `  Pre-2016 Republican vote: ${prePct.toFixed(1)}% (${preRepCount}/${preTotal})\n` +
                `  Post-2016 Democratic vote: ${postPct.toFixed(1)}% (${postDemCount}/${postTotal})\n` +
                `  Expected: >50% Democratic post-2016`,
        });
    }
    // ── 4. Black coalition → solidly Democratic post-1964 ──
    {
        const blackArchs = ARCHETYPES.filter(isBlackCoalitionArchetype);
        const blackIds = blackArchs.map((a) => a.id);
        const postYears = [1968, 1972, 1976, 1980, 1984, 1988, 1992, 1996, 2000, 2004, 2008, 2012, 2016, 2020, 2024];
        let demCount = 0;
        let totalVotes = 0;
        for (const year of postYears) {
            const demCandidate = ELECTIONS.find((e) => e.year === year)
                ?.candidates.find((c) => c.party === "Democratic")?.name;
            for (const id of blackIds) {
                const vote = getVote(results, id, year);
                if (vote !== "ABSTAIN") {
                    totalVotes++;
                    if (vote === demCandidate)
                        demCount++;
                }
            }
        }
        const pct = totalVotes > 0 ? (demCount / totalVotes * 100) : 0;
        checks.push({
            name: "Black Coalition",
            description: "Structuralist, redistributive, tribal archetypes should be solidly Democratic post-1964",
            pass: pct > 80,
            details: `Found ${blackArchs.length} Black coalition-proxy archetypes.\n` +
                `  Post-1964 Democratic vote: ${pct.toFixed(1)}% (${demCount}/${totalVotes})\n` +
                `  Expected: >80% Democratic`,
        });
    }
    // ── 5. High MOR+CD → Republican post-1980 ──
    {
        const socConArchs = ARCHETYPES.filter(isSocialConservativeArchetype);
        const socConIds = socConArchs.map((a) => a.id);
        const postYears = [1980, 1984, 1988, 1992, 1996, 2000, 2004, 2008, 2012, 2016, 2020, 2024];
        let repCount = 0;
        let totalVotes = 0;
        for (const year of postYears) {
            const repCandidate = ELECTIONS.find((e) => e.year === year)
                ?.candidates.find((c) => c.party === "Republican")?.name;
            for (const id of socConIds) {
                const vote = getVote(results, id, year);
                if (vote !== "ABSTAIN") {
                    totalVotes++;
                    if (vote === repCandidate)
                        repCount++;
                }
            }
        }
        const pct = totalVotes > 0 ? (repCount / totalVotes * 100) : 0;
        checks.push({
            name: "Social Conservative → GOP",
            description: "High MOR + high CD archetypes should favor Republican post-1980",
            pass: pct > 65,
            details: `Found ${socConArchs.length} social conservative archetypes.\n` +
                `  Post-1980 Republican vote: ${pct.toFixed(1)}% (${repCount}/${totalVotes})\n` +
                `  Expected: >65% Republican`,
        });
    }
    // ── 6. High MAT (free-market) → Republican consistently ──
    {
        const fmArchs = ARCHETYPES.filter(isFreeMarketArchetype);
        const fmIds = fmArchs.map((a) => a.id);
        const allYears = ELECTIONS.map((e) => e.year);
        let repCount = 0;
        let totalVotes = 0;
        for (const year of allYears) {
            const repCandidate = ELECTIONS.find((e) => e.year === year)
                ?.candidates.find((c) => c.party === "Republican")?.name;
            for (const id of fmIds) {
                const vote = getVote(results, id, year);
                if (vote !== "ABSTAIN") {
                    totalVotes++;
                    if (vote === repCandidate)
                        repCount++;
                }
            }
        }
        const pct = totalVotes > 0 ? (repCount / totalVotes * 100) : 0;
        checks.push({
            name: "Free-Market → GOP",
            description: "High MAT (market) archetypes should favor Republican consistently",
            pass: pct > 60,
            details: `Found ${fmArchs.length} free-market archetypes.\n` +
                `  Overall Republican vote: ${pct.toFixed(1)}% (${repCount}/${totalVotes})\n` +
                `  Expected: >60% Republican`,
        });
    }
    // ── 7. Populist archetypes → Wallace 1968, Trump 2016/2020/2024 ──
    {
        const popArchs = ARCHETYPES.filter(isPopulistArchetype);
        const popIds = popArchs.map((a) => a.id);
        let wallace1968 = 0;
        let total1968 = 0;
        for (const id of popIds) {
            const vote = getVote(results, id, 1968);
            if (vote !== "ABSTAIN") {
                total1968++;
                if (vote === "Wallace")
                    wallace1968++;
            }
        }
        let trump2016 = 0;
        let total2016 = 0;
        for (const id of popIds) {
            const vote = getVote(results, id, 2016);
            if (vote !== "ABSTAIN") {
                total2016++;
                if (vote === "Trump")
                    trump2016++;
            }
        }
        let trump2024 = 0;
        let total2024 = 0;
        for (const id of popIds) {
            const vote = getVote(results, id, 2024);
            if (vote !== "ABSTAIN") {
                total2024++;
                if (vote === "Trump")
                    trump2024++;
            }
        }
        checks.push({
            name: "Populist Alignment",
            description: "Populist archetypes should favor Wallace (1968), Trump (2016, 2024)",
            pass: (total1968 > 0 ? wallace1968 / total1968 > 0.3 : true) &&
                (total2016 > 0 ? trump2016 / total2016 > 0.5 : true) &&
                (total2024 > 0 ? trump2024 / total2024 > 0.5 : true),
            details: `Found ${popArchs.length} populist archetypes.\n` +
                `  1968 Wallace: ${total1968 > 0 ? (wallace1968 / total1968 * 100).toFixed(1) : "N/A"}% (${wallace1968}/${total1968})\n` +
                `  2016 Trump: ${total2016 > 0 ? (trump2016 / total2016 * 100).toFixed(1) : "N/A"}% (${trump2016}/${total2016})\n` +
                `  2024 Trump: ${total2024 > 0 ? (trump2024 / total2024 * 100).toFixed(1) : "N/A"}% (${trump2024}/${total2024})`,
        });
    }
    // ── 8. Specific archetype spot checks ──
    {
        const spotChecks = [
            // Loyal Democrat should always vote D
            { archName: "Loyal Democrat", year: 2016, expected: "Clinton" },
            { archName: "Loyal Democrat", year: 2020, expected: "Biden" },
            // Loyal Republican should always vote R
            { archName: "Loyal Republican", year: 2016, expected: "Trump" },
            { archName: "Loyal Republican", year: 2020, expected: "Trump" },
            // Rawlsian Reformer should vote Obama
            { archName: "Rawlsian Reformer", year: 2008, expected: "Obama" },
            // Burkean Steward should favor establishment Republicans
            { archName: "Burkean Steward", year: 2008, expected: "McCain" },
        ];
        let passed = 0;
        const details = [];
        for (const check of spotChecks) {
            const actual = getVoteByName(results, check.archName, check.year);
            const ok = actual === check.expected;
            if (ok)
                passed++;
            details.push(`  ${ok ? "✓" : "✗"} ${check.archName} ${check.year}: expected ${check.expected}, got ${actual}`);
        }
        checks.push({
            name: "Spot Checks",
            description: "Specific archetype-election predictions",
            pass: passed >= spotChecks.length * 0.7,
            details: `${passed}/${spotChecks.length} spot checks passed:\n${details.join("\n")}`,
        });
    }
    return checks;
}
// ── Report ───────────────────────────────────────────────────────────────────
function printReport(checks) {
    console.log("\n═══════════════════════════════════════════════════════════════");
    console.log("  PRISM HISTORICAL VALIDATION REPORT");
    console.log("═══════════════════════════════════════════════════════════════\n");
    let passCount = 0;
    for (const check of checks) {
        const status = check.pass ? "PASS ✓" : "FAIL ✗";
        if (check.pass)
            passCount++;
        console.log(`── ${check.name} [${status}] ──`);
        console.log(`  ${check.description}`);
        console.log(check.details.split("\n").map((l) => `  ${l}`).join("\n"));
        console.log("");
    }
    console.log("───────────────────────────────────────────────────────────────");
    console.log(`  OVERALL: ${passCount}/${checks.length} checks passed`);
    if (passCount === checks.length) {
        console.log("  All coalition patterns validated successfully.");
    }
    else {
        console.log(`  ${checks.length - passCount} check(s) need attention.`);
    }
    console.log("═══════════════════════════════════════════════════════════════\n");
}
// ── Per-election breakdown ───────────────────────────────────────────────────
function printCoalitionBreakdown(results) {
    console.log("\n═══════════════════════════════════════════════════════════════");
    console.log("  COALITION BREAKDOWN BY ELECTION");
    console.log("═══════════════════════════════════════════════════════════════\n");
    const coalitions = [
        { name: "Labor/Union", filter: isLaborArchetype },
        { name: "Evangelical", filter: isEvangelicalArchetype },
        { name: "Suburban Educated", filter: isSuburbanEducatedArchetype },
        { name: "Social Conservative", filter: isSocialConservativeArchetype },
        { name: "Free Market", filter: isFreeMarketArchetype },
        { name: "Populist", filter: isPopulistArchetype },
    ];
    for (const coalition of coalitions) {
        const archs = ARCHETYPES.filter(coalition.filter);
        const ids = archs.map((a) => a.id);
        console.log(`── ${coalition.name} (${archs.length} archetypes) ──`);
        for (const election of ELECTIONS) {
            const tallies = {};
            let abstentions = 0;
            for (const id of ids) {
                const vote = getVote(results, id, election.year);
                if (vote === "ABSTAIN") {
                    abstentions++;
                }
                else {
                    tallies[vote] = (tallies[vote] || 0) + 1;
                }
            }
            const parts = Object.entries(tallies)
                .sort((a, b) => b[1] - a[1])
                .map(([name, count]) => `${name}:${count}`)
                .join(", ");
            console.log(`  ${election.year}: ${parts}${abstentions > 0 ? `, ABSTAIN:${abstentions}` : ""}`);
        }
        console.log("");
    }
}
// ── Main ─────────────────────────────────────────────────────────────────────
function writeCSVs(results) {
    const fs = require("fs");
    const years = ELECTIONS.map(e => e.year).sort((a, b) => a - b);
    // historical_votes.csv: 130 archetypes × N elections
    const header = ["id", "name", ...years.map(String)].join(",");
    const rows = [header];
    for (const r of results) {
        const cols = [r.archetypeId, `"${r.archetypeName}"`];
        for (const y of years) {
            cols.push(r.votes[y] || "");
        }
        rows.push(cols.join(","));
    }
    fs.writeFileSync("output/historical_votes.csv", rows.join("\n"));
    console.log(`Wrote historical_votes.csv: ${results.length} archetypes × ${years.length} elections`);
}
function main() {
    console.log("Running PRISM historical election simulation for validation...\n");
    const results = simulate();
    const checks = runValidation(results);
    printReport(checks);
    printCoalitionBreakdown(results);
    writeCSVs(results);
}
main();
//# sourceMappingURL=validate.js.map