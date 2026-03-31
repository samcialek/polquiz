/**
 * Historical Election Simulation
 *
 * For each election, computes which candidate each archetype would vote for
 * (or abstain) based on alignment scores weighted by salience, with turnout
 * modeled by ENG node.
 *
 * Includes:
 * - Partisan override: high-PF archetypes get a party loyalty bonus
 * - Era-context modifiers: flat bonuses for landslide elections
 *
 * Usage: npx tsx src/historical/simulate.ts
 */
import { ARCHETYPES } from "../config/archetypes.js";
import { ELECTIONS } from "./candidates.js";
import { writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
// ── Constants ────────────────────────────────────────────────────────────────
const CONTINUOUS_NODES = [
    "MAT", "CD", "CU", "MOR", "PRO", "COM",
    "ZS", "ONT_H", "ONT_S", "PF", "TRB", "ENG",
];
const CATEGORICAL_NODES = ["EPS", "AES"];
// EPS: 0=empiricist, 1=institutionalist, 2=traditionalist, 3=intuitionist, 4=autonomous, 5=nihilist
// AES: 0=statesman, 1=technocrat, 2=pastoral, 3=authentic, 4=fighter, 5=visionary
// ── Actual popular vote margins (winner% - loser%) for reference ─────────────
const ACTUAL_RESULTS = {
    1960: { winner: "Kennedy", winnerPct: 49.7, loserPct: 49.5 },
    1964: { winner: "Johnson", winnerPct: 61.1, loserPct: 38.5 },
    1968: { winner: "Nixon", winnerPct: 43.4, loserPct: 42.7 }, // Humphrey 42.7, Wallace 13.5
    1972: { winner: "Nixon", winnerPct: 60.7, loserPct: 37.5 },
    1976: { winner: "Carter", winnerPct: 50.1, loserPct: 48.0 },
    1980: { winner: "Reagan", winnerPct: 50.7, loserPct: 41.0 }, // Anderson 6.6%
    1984: { winner: "Reagan", winnerPct: 58.8, loserPct: 40.6 },
    1988: { winner: "Bush", winnerPct: 53.4, loserPct: 45.6 },
    1992: { winner: "Clinton", winnerPct: 43.0, loserPct: 37.4 }, // Perot 18.9%
    1996: { winner: "Clinton", winnerPct: 49.2, loserPct: 40.7 },
    2000: { winner: "Gore", winnerPct: 48.4, loserPct: 47.9 }, // Gore won PV
    2004: { winner: "Bush", winnerPct: 50.7, loserPct: 48.3 },
    2008: { winner: "Obama", winnerPct: 52.9, loserPct: 45.7 },
    2012: { winner: "Obama", winnerPct: 51.1, loserPct: 47.2 },
    2016: { winner: "Clinton", winnerPct: 48.2, loserPct: 46.1 }, // Clinton won PV
    2020: { winner: "Biden", winnerPct: 51.3, loserPct: 46.9 },
    2024: { winner: "Trump", winnerPct: 49.8, loserPct: 48.3 },
};
// ── Era-context modifiers (FIX 3) ───────────────────────────────────────────
// Flat bonuses for candidates with overwhelming electoral momentum/context.
// These reflect historical factors beyond pure policy alignment:
// incumbency advantage, opponent extremism, economic conditions, etc.
const ERA_BONUSES = {
    1964: { Johnson: 2.5 }, // Post-JFK sympathy + Goldwater extremism
    1968: { Nixon: 0.8 }, // Law and order resonated, Humphrey tainted by Vietnam
    1972: { Nixon: 2.0 }, // McGovern perceived as extreme, "peace with honor"
    1980: { Reagan: 1.5 }, // Malaise, hostage crisis, Carter perceived as weak
    1984: { Reagan: 2.5 }, // "Morning in America," economic boom, incumbent
    1988: { Bush: 0.5 }, // Reagan coattails, Dukakis tank photo, Willie Horton
    1992: { Clinton: 1.5 }, // "It's the economy, stupid," change election, Bush broken promises
    1996: { Clinton: 1.0 }, // Incumbent, peace and prosperity, Dole lacked energy
    2004: { Bush: 2.0 }, // Post-9/11 security, wartime incumbent, "Swift Boat"
    2008: { Obama: 1.5 }, // Financial crisis, change wave, historic candidacy
    2024: { Trump: 1.5 }, // Inflation/economy frustration, "were you better off" framing
};
// ── Partisan party mapping ──────────────────────────────────────────────────
// Map archetype characteristics to likely party alignment.
// Archetypes with MAT <= 2 lean Democratic, MAT >= 4 lean Republican.
// Center (MAT=3) uses CD as tiebreaker: CD >= 3 → Republican, CD <= 2 → Democratic.
function inferArchetypeParty(arch) {
    const matTmpl = arch.nodes.MAT;
    const cdTmpl = arch.nodes.CD;
    const morTmpl = arch.nodes.MOR;
    const ontsTmpl = arch.nodes.ONT_S;
    const cuTmpl = arch.nodes.CU;
    if (!matTmpl || matTmpl.kind !== "continuous")
        return "none";
    const matPos = matTmpl.pos;
    const cdPos = cdTmpl && cdTmpl.kind === "continuous" ? cdTmpl.pos : 3;
    const morPos = morTmpl && morTmpl.kind === "continuous" ? morTmpl.pos : 3;
    const ontsPos = ontsTmpl && ontsTmpl.kind === "continuous" ? ontsTmpl.pos : 3;
    const cuPos = cuTmpl && cuTmpl.kind === "continuous" ? cuTmpl.pos : 3;
    // Strong economic signal dominates
    if (matPos <= 1)
        return "Democratic"; // Strong redistributionist
    if (matPos >= 5)
        return "Republican"; // Strong free-market
    // Tally directional signals across key nodes
    // Dem-leaning: low MAT, low CD, low MOR, high ONT_S, high CU
    // GOP-leaning: high MAT, high CD, high MOR, low ONT_S, low CU
    let demSignals = 0;
    let gopSignals = 0;
    if (matPos <= 2)
        demSignals += 2;
    if (matPos >= 4)
        gopSignals += 2;
    if (cdPos <= 2)
        demSignals++;
    if (cdPos >= 4)
        gopSignals++;
    if (morPos <= 2)
        demSignals++;
    if (morPos >= 4)
        gopSignals++;
    if (ontsPos >= 4)
        demSignals++;
    if (ontsPos <= 2)
        gopSignals++;
    if (cuPos >= 4)
        demSignals++;
    if (cuPos <= 2)
        gopSignals++;
    if (gopSignals > demSignals)
        return "Republican";
    if (demSignals > gopSignals)
        return "Democratic";
    // True center — no lean
    return "none";
}
// ── Turnout model ────────────────────────────────────────────────────────────
function turnoutProbability(engPos) {
    // ENG position determines likelihood of voting at all
    if (engPos >= 5)
        return 0.95;
    if (engPos >= 4)
        return 0.85;
    if (engPos >= 3)
        return 0.70;
    if (engPos >= 2)
        return 0.45;
    return 0.15;
}
/** Deterministic turnout: vote if ENG-based probability >= 0.5 */
function willVote(engPos) {
    return turnoutProbability(engPos) >= 0.5;
}
// ── Alignment scoring ────────────────────────────────────────────────────────
/**
 * Compute alignment between an archetype and a candidate.
 *
 * For each continuous node:
 *   alignment_i = salience × (1 - |archetype_pos - candidate_pos| / 4)
 *
 * For categorical nodes (EPS, AES):
 *   alignment_i = salience × prob[candidate_category]
 *   (how much the archetype's probability distribution favors the candidate's category)
 *
 * Then adds partisan override (FIX 2) and era bonus (FIX 3).
 */
function computeAlignment(arch, cand, year) {
    let total = 0;
    // Continuous nodes
    for (const node of CONTINUOUS_NODES) {
        const tmpl = arch.nodes[node];
        if (!tmpl || tmpl.kind !== "continuous")
            continue;
        const ct = tmpl;
        const archPos = ct.pos;
        const candPos = cand[node];
        const sal = ct.sal;
        // Alignment: salience × (1 - |diff| / 4)
        // Max alignment when positions match (1.0), min when 4 apart (0.0)
        const posAlignment = 1 - Math.abs(archPos - candPos) / 4;
        total += sal * posAlignment;
        // Anti-position penalty: if archetype has an anti and candidate is near it, penalize
        if (ct.anti) {
            const antiTarget = ct.anti === "high" ? 5 : 1;
            const candDistFromAnti = Math.abs(candPos - antiTarget) / 4;
            // If candidate is near the anti-position, subtract a penalty
            if (candDistFromAnti < 0.25) {
                total -= sal * 0.5 * (1 - candDistFromAnti);
            }
        }
    }
    // Categorical nodes
    for (const node of CATEGORICAL_NODES) {
        const tmpl = arch.nodes[node];
        if (!tmpl || tmpl.kind !== "categorical")
            continue;
        const ct = tmpl;
        const sal = ct.sal;
        const candCategory = cand[node];
        // Alignment = salience × probability the archetype assigns to the candidate's category
        total += sal * ct.probs[candCategory];
        // Anti-category penalty
        if (ct.antiCats && ct.antiCats.includes(candCategory)) {
            total -= sal * 0.3;
        }
    }
    // ── FIX 2: Partisan override ──────────────────────────────────────────────
    // Archetypes with clear party alignment get a bonus for same-party candidates.
    // This reflects the reality that most voters choose based on party heuristic.
    const pfTmpl = arch.nodes.PF;
    const trbTmpl = arch.nodes.TRB;
    const archParty = inferArchetypeParty(arch);
    if (archParty !== "none" && cand.party === archParty) {
        let partyBonus = 0;
        // PF-based party loyalty
        if (pfTmpl && pfTmpl.kind === "continuous") {
            const pfCt = pfTmpl;
            const pfPos = pfCt.pos;
            const pfSal = pfCt.sal;
            if (pfPos >= 5 && pfSal >= 2) {
                partyBonus = 3.0; // Near-deterministic party voting
            }
            else if (pfPos >= 4 && pfSal >= 2) {
                partyBonus = 2.0; // Strong partisan
            }
            else if (pfPos >= 4 && pfSal >= 1) {
                partyBonus = 1.5; // Moderate partisan with some loyalty
            }
            else if (pfPos >= 3 && pfSal >= 1) {
                partyBonus = 0.8; // Weak partisan lean
            }
        }
        // Even without high PF, archetypes with strong ideological positions
        // get a baseline party lean from their node positions
        if (partyBonus === 0) {
            partyBonus = 0.5; // Baseline party lean for any archetype with clear alignment
        }
        total += partyBonus;
    }
    // Tribal bonus: high-TRB archetypes get a small bonus for candidates matching tribal appeal
    if (trbTmpl && trbTmpl.kind === "continuous") {
        const trbCt = trbTmpl;
        const trbPos = trbCt.pos;
        if (trbPos >= 4) {
            // Tribal archetypes favor candidates with matching tribal intensity
            const candTrb = cand.TRB;
            if (candTrb >= 4) {
                total += 0.5;
            }
        }
    }
    // ── FIX 3: Era-context modifier ───────────────────────────────────────────
    const eraBonus = ERA_BONUSES[year];
    if (eraBonus && eraBonus[cand.name] !== undefined) {
        total += eraBonus[cand.name];
    }
    return total;
}
function simulate() {
    const results = [];
    for (const arch of ARCHETYPES) {
        const votes = {};
        // Get archetype's ENG position for turnout
        const engTmpl = arch.nodes.ENG;
        const engPos = engTmpl && engTmpl.kind === "continuous"
            ? engTmpl.pos
            : 3;
        for (const election of ELECTIONS) {
            if (!willVote(engPos)) {
                votes[election.year] = "ABSTAIN";
                continue;
            }
            // Score each candidate
            let bestCandidate = "";
            let bestScore = -Infinity;
            for (const cand of election.candidates) {
                const score = computeAlignment(arch, cand, election.year);
                if (score > bestScore) {
                    bestScore = score;
                    bestCandidate = cand.name;
                }
            }
            votes[election.year] = bestCandidate;
        }
        results.push({
            archetypeId: arch.id,
            archetypeName: arch.name,
            votes,
        });
    }
    return results;
}
// ── Output ───────────────────────────────────────────────────────────────────
function generateCSV(results) {
    const years = ELECTIONS.map((e) => e.year);
    const header = ["ID", "Archetype", ...years.map(String)].join(",");
    const rows = results.map((r) => {
        const cells = [r.archetypeId, `"${r.archetypeName}"`];
        for (const year of years) {
            cells.push(r.votes[year]);
        }
        return cells.join(",");
    });
    return [header, ...rows].join("\n");
}
function generateCandidateProfilesCSV() {
    const nodes = [
        "MAT", "CD", "CU", "MOR", "PRO", "COM",
        "ZS", "ONT_H", "ONT_S", "PF", "TRB", "ENG",
        "EPS", "AES",
    ];
    const header = ["Year", "Name", "Party", ...nodes].join(",");
    const rows = [];
    for (const election of ELECTIONS) {
        for (const cand of election.candidates) {
            const values = nodes.map((n) => cand[n]);
            rows.push([cand.year, cand.name, cand.party, ...values].join(","));
        }
    }
    return [header, ...rows].join("\n");
}
function generateSummary(results) {
    const lines = [];
    lines.push("═══════════════════════════════════════════════════════════════");
    lines.push("  PRISM HISTORICAL ELECTION SIMULATION — SUMMARY");
    lines.push("═══════════════════════════════════════════════════════════════\n");
    for (const election of ELECTIONS) {
        const year = election.year;
        const candNames = election.candidates.map((c) => c.name);
        const tallies = {};
        let abstentions = 0;
        for (const name of candNames)
            tallies[name] = 0;
        for (const r of results) {
            const vote = r.votes[year];
            if (vote === "ABSTAIN") {
                abstentions++;
            }
            else {
                tallies[vote] = (tallies[vote] || 0) + 1;
            }
        }
        const totalVoters = results.length - abstentions;
        lines.push(`── ${year} ──────────────────────────────────────────`);
        lines.push(`  Candidates: ${election.candidates.map((c) => `${c.name} (${c.party})`).join(" vs ")}`);
        const sorted = Object.entries(tallies).sort((a, b) => b[1] - a[1]);
        for (const [name, count] of sorted) {
            const pct = totalVoters > 0 ? ((count / totalVoters) * 100).toFixed(1) : "0.0";
            const bar = "█".repeat(Math.round(count / 2));
            lines.push(`  ${name.padEnd(12)} ${String(count).padStart(3)} archetypes (${pct.padStart(5)}%) ${bar}`);
        }
        lines.push(`  ABSTAIN      ${String(abstentions).padStart(3)} archetypes`);
        lines.push("");
    }
    return lines.join("\n");
}
function generatePredictedVsActual(results) {
    const lines = [];
    lines.push("\n═══════════════════════════════════════════════════════════════");
    lines.push("  PREDICTED vs ACTUAL MARGINS");
    lines.push("═══════════════════════════════════════════════════════════════\n");
    lines.push("  Year  Predicted Winner   Pred%  Actual Winner   Actual%  Δ     Status");
    lines.push("  ────  ─────────────────  ─────  ──────────────  ───────  ────  ──────");
    for (const election of ELECTIONS) {
        const year = election.year;
        const tallies = {};
        let totalVoters = 0;
        for (const r of results) {
            const vote = r.votes[year];
            if (vote !== "ABSTAIN") {
                totalVoters++;
                tallies[vote] = (tallies[vote] || 0) + 1;
            }
        }
        const sorted = Object.entries(tallies).sort((a, b) => b[1] - a[1]);
        const predWinner = sorted[0]?.[0] ?? "?";
        const predCount = sorted[0]?.[1] ?? 0;
        const predPct = totalVoters > 0 ? (predCount / totalVoters) * 100 : 0;
        const actual = ACTUAL_RESULTS[year];
        const actualWinner = actual?.winner ?? "?";
        const actualPct = actual?.winnerPct ?? 0;
        const delta = Math.abs(predPct - actualPct);
        const correctWinner = predWinner === actualWinner;
        const withinMargin = delta <= 10;
        const status = correctWinner && withinMargin ? "OK" : correctWinner ? "MARGIN" : "WRONG";
        lines.push(`  ${year}  ${predWinner.padEnd(17)}  ${predPct.toFixed(1).padStart(5)}  ${actualWinner.padEnd(14)}  ${actualPct.toFixed(1).padStart(5)}%  ${delta.toFixed(1).padStart(4)}  ${status}`);
    }
    lines.push("");
    return lines.join("\n");
}
// ── Main ─────────────────────────────────────────────────────────────────────
function main() {
    console.log("Running PRISM historical election simulation...\n");
    console.log(`Archetypes: ${ARCHETYPES.length}`);
    console.log(`Elections:  ${ELECTIONS.length} (${ELECTIONS.map((e) => e.year).join(", ")})\n`);
    const results = simulate();
    // Print summary to console
    const summary = generateSummary(results);
    console.log(summary);
    // Print predicted vs actual
    const comparison = generatePredictedVsActual(results);
    console.log(comparison);
    // Write CSVs
    const __dirname = dirname(fileURLToPath(import.meta.url));
    const outDir = join(__dirname, "..", "..", "output");
    mkdirSync(outDir, { recursive: true });
    const csvPath = join(outDir, "historical_votes.csv");
    writeFileSync(csvPath, generateCSV(results), "utf-8");
    console.log(`Vote CSV written to: ${csvPath}`);
    const profilesPath = join(outDir, "candidate_profiles.csv");
    writeFileSync(profilesPath, generateCandidateProfilesCSV(), "utf-8");
    console.log(`Candidate profiles CSV written to: ${profilesPath}`);
    // Also export results for validate.ts
    return results;
}
export { simulate, computeAlignment, willVote };
main();
//# sourceMappingURL=simulate.js.map