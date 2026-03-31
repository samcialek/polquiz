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
import { POPULATION_WEIGHTS } from "../config/population-weights.js";
import { ELECTIONS, type CandidateProfile } from "./candidates.js";
import type { Archetype, ContinuousTemplate, CategoricalTemplate } from "../types.js";
import { writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { getContext } from "./contexts.js";
import { getNodeWeight, computeTurnoutProbability, type ContinuousNodeId, type ElectionContext } from "./activation.js";
import { computeTurnoutFromAlignment, gaussianVoteChoice } from "./regime-alignment.js";

// ── Constants ────────────────────────────────────────────────────────────────

const CONTINUOUS_NODES = [
  "MAT", "CD", "CU", "MOR", "PRO", "COM",
  "ZS", "ONT_H", "ONT_S", "PF", "TRB", "ENG",
] as const;

const CATEGORICAL_NODES = ["EPS", "AES"] as const;

// EPS: 0=empiricist, 1=institutionalist, 2=traditionalist, 3=intuitionist, 4=autonomous, 5=nihilist
// AES: 0=statesman, 1=technocrat, 2=pastoral, 3=authentic, 4=fighter, 5=visionary

// ── Actual popular vote margins (winner% - loser%) for reference ─────────────

const ACTUAL_RESULTS: Record<number, { winner: string; winnerPct: number; loserPct: number }> = {
  1789: { winner: "Washington", winnerPct: 100, loserPct: 0 },
  1792: { winner: "Washington", winnerPct: 100, loserPct: 0 },
  1796: { winner: "Adams", winnerPct: 53.4, loserPct: 46.6 },
  1800: { winner: "Jefferson", winnerPct: 61.4, loserPct: 38.6 },
  1804: { winner: "Jefferson", winnerPct: 72.8, loserPct: 27.2 },
  1808: { winner: "Madison", winnerPct: 64.7, loserPct: 32.4 },
  1812: { winner: "Madison", winnerPct: 58.7, loserPct: 41.3 },
  1816: { winner: "Monroe", winnerPct: 68.2, loserPct: 31.8 },
  1820: { winner: "Monroe", winnerPct: 99.6, loserPct: 0.4 },
  1824: { winner: "Jackson", winnerPct: 41.4, loserPct: 30.9 },
  1828: { winner: "Jackson", winnerPct: 56.0, loserPct: 43.6 },
  1832: { winner: "Jackson", winnerPct: 54.2, loserPct: 37.4 },
  1836: { winner: "Van Buren", winnerPct: 50.8, loserPct: 36.6 },
  1840: { winner: "Harrison", winnerPct: 52.9, loserPct: 46.8 },
  1844: { winner: "Polk", winnerPct: 49.5, loserPct: 48.1 },
  1848: { winner: "Taylor", winnerPct: 47.3, loserPct: 42.5 },
  1852: { winner: "Pierce", winnerPct: 50.8, loserPct: 43.9 },
  1856: { winner: "Buchanan", winnerPct: 45.3, loserPct: 33.1 },
  1860: { winner: "Lincoln", winnerPct: 39.8, loserPct: 29.5 },
  1864: { winner: "Lincoln", winnerPct: 55.0, loserPct: 45.0 },
  1868: { winner: "Grant", winnerPct: 52.7, loserPct: 47.3 },
  1872: { winner: "Grant", winnerPct: 55.6, loserPct: 43.8 },
  1876: { winner: "Tilden", winnerPct: 50.9, loserPct: 47.9 },
  1880: { winner: "Garfield", winnerPct: 48.3, loserPct: 48.2 },
  1884: { winner: "Cleveland", winnerPct: 48.9, loserPct: 48.3 },
  1888: { winner: "Cleveland", winnerPct: 48.6, loserPct: 47.8 },
  1892: { winner: "Cleveland", winnerPct: 46.0, loserPct: 43.0 },
  1896: { winner: "McKinley", winnerPct: 51.0, loserPct: 46.7 },
  1900: { winner: "McKinley", winnerPct: 51.6, loserPct: 45.5 },
  1904: { winner: "Roosevelt", winnerPct: 56.4, loserPct: 37.6 },
  1908: { winner: "Taft", winnerPct: 51.6, loserPct: 43.0 },
  1912: { winner: "Wilson", winnerPct: 41.8, loserPct: 27.4 },
  1916: { winner: "Wilson", winnerPct: 49.2, loserPct: 46.1 },
  1920: { winner: "Harding", winnerPct: 60.3, loserPct: 34.1 },
  1924: { winner: "Coolidge", winnerPct: 54.0, loserPct: 28.8 },
  1928: { winner: "Hoover", winnerPct: 58.2, loserPct: 40.8 },
  1932: { winner: "Roosevelt", winnerPct: 57.4, loserPct: 39.7 },
  1936: { winner: "Roosevelt", winnerPct: 60.8, loserPct: 36.5 },
  1940: { winner: "Roosevelt", winnerPct: 54.7, loserPct: 44.8 },
  1944: { winner: "Roosevelt", winnerPct: 53.4, loserPct: 45.9 },
  1948: { winner: "Truman", winnerPct: 49.6, loserPct: 45.1 }, // Thurmond 2.4%, H.Wallace 2.4%
  1952: { winner: "Eisenhower", winnerPct: 55.2, loserPct: 44.3 },
  1956: { winner: "Eisenhower", winnerPct: 57.4, loserPct: 42.0 },
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

const ERA_BONUSES: Record<number, Record<string, number>> = {
  1964: { Johnson: 2.5 },         // Post-JFK sympathy + Goldwater extremism
  1968: { Nixon: 0.8 },           // Law and order resonated, Humphrey tainted by Vietnam
  1972: { Nixon: 2.0 },           // McGovern perceived as extreme, "peace with honor"
  1980: { Reagan: 1.5 },          // Malaise, hostage crisis, Carter perceived as weak
  1984: { Reagan: 2.5 },          // "Morning in America," economic boom, incumbent
  1988: { Bush: 0.5 },            // Reagan coattails, Dukakis tank photo, Willie Horton
  1992: { Clinton: 1.5 },         // "It's the economy, stupid," change election, Bush broken promises
  1996: { Clinton: 1.0 },         // Incumbent, peace and prosperity, Dole lacked energy
  2004: { Bush: 2.0 },            // Post-9/11 security, wartime incumbent, "Swift Boat"
  2008: { Obama: 1.5 },           // Financial crisis, change wave, historic candidacy
  2024: { Trump: 1.5 },           // Inflation/economy frustration, "were you better off" framing
};

// ── Partisan party mapping ──────────────────────────────────────────────────
// Map archetype characteristics to likely party alignment.
// Archetypes with MAT <= 2 lean Democratic, MAT >= 4 lean Republican.
// Center (MAT=3) uses CD as tiebreaker: CD >= 3 → Republican, CD <= 2 → Democratic.

function inferArchetypeParty(arch: Archetype): "Democratic" | "Republican" | "none" {
  const matTmpl = arch.nodes.MAT;
  const cdTmpl = arch.nodes.CD;
  const morTmpl = arch.nodes.MOR;
  const ontsTmpl = arch.nodes.ONT_S;
  const cuTmpl = arch.nodes.CU;
  if (!matTmpl || matTmpl.kind !== "continuous") return "none";
  const matPos = (matTmpl as ContinuousTemplate).pos;
  const cdPos = cdTmpl && cdTmpl.kind === "continuous" ? (cdTmpl as ContinuousTemplate).pos : 3;
  const morPos = morTmpl && morTmpl.kind === "continuous" ? (morTmpl as ContinuousTemplate).pos : 3;
  const ontsPos = ontsTmpl && ontsTmpl.kind === "continuous" ? (ontsTmpl as ContinuousTemplate).pos : 3;
  const cuPos = cuTmpl && cuTmpl.kind === "continuous" ? (cuTmpl as ContinuousTemplate).pos : 3;

  // Strong economic signal dominates
  if (matPos <= 1) return "Democratic";  // Strong redistributionist
  if (matPos >= 5) return "Republican";  // Strong free-market

  // Tally directional signals across key nodes
  // Dem-leaning: low MAT, low CD, low MOR, high ONT_S, high CU
  // GOP-leaning: high MAT, high CD, high MOR, low ONT_S, low CU
  let demSignals = 0;
  let gopSignals = 0;

  if (matPos <= 2) demSignals += 2;
  if (matPos >= 4) gopSignals += 2;

  if (cdPos <= 2) demSignals++;
  if (cdPos >= 4) gopSignals++;

  if (morPos <= 2) demSignals++;
  if (morPos >= 4) gopSignals++;

  if (ontsPos >= 4) demSignals++;
  if (ontsPos <= 2) gopSignals++;

  if (cuPos >= 4) demSignals++;
  if (cuPos <= 2) gopSignals++;

  if (gopSignals > demSignals) return "Republican";
  if (demSignals > gopSignals) return "Democratic";

  // True center — no lean
  return "none";
}

// ── Turnout model ────────────────────────────────────────────────────────────

function turnoutProbability(engPos: number): number {
  // ENG position determines likelihood of voting at all
  if (engPos >= 5) return 0.95;
  if (engPos >= 4) return 0.85;
  if (engPos >= 3) return 0.70;
  if (engPos >= 2) return 0.45;
  return 0.15;
}

/** Deterministic turnout: vote if ENG-based probability >= 0.5 */
function willVote(engPos: number): boolean {
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
function computeAlignment(arch: Archetype, cand: CandidateProfile, year: number, ctx?: ElectionContext): number {
  let total = 0;

  // Continuous nodes
  for (const node of CONTINUOUS_NODES) {
    const tmpl = arch.nodes[node];
    if (!tmpl || tmpl.kind !== "continuous") continue;
    const ct = tmpl as ContinuousTemplate;
    const archPos = ct.pos;
    const candPos = (cand as any)[node] as number;
    const sal = ct.sal;

    // Activation weight: how important is this node in this election?
    const activationWeight = ctx ? getNodeWeight(ctx, node as ContinuousNodeId) : 1.0;

    // Alignment: salience × activationWeight × (1 - |diff| / 4)
    const posAlignment = 1 - Math.abs(archPos - candPos) / 4;
    total += sal * activationWeight * posAlignment;

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
    if (!tmpl || tmpl.kind !== "categorical") continue;
    const ct = tmpl as CategoricalTemplate;
    const sal = ct.sal;
    const candCategory = (cand as any)[node] as number;

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
      const pfCt = pfTmpl as ContinuousTemplate;
      const pfPos = pfCt.pos;
      const pfSal = pfCt.sal;

      if (pfPos >= 5 && pfSal >= 2) {
        partyBonus = 3.0; // Near-deterministic party voting
      } else if (pfPos >= 4 && pfSal >= 2) {
        partyBonus = 2.0; // Strong partisan
      } else if (pfPos >= 4 && pfSal >= 1) {
        partyBonus = 1.5; // Moderate partisan with some loyalty
      } else if (pfPos >= 3 && pfSal >= 1) {
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
    const trbCt = trbTmpl as ContinuousTemplate;
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

// ── Simulation ───────────────────────────────────────────────────────────────

interface VoteResult {
  archetypeId: string;
  archetypeName: string;
  votes: Record<number, string>; // year → candidate name or "ABSTAIN"
}

function simulate(): VoteResult[] {
  const results: VoteResult[] = [];

  for (const arch of ARCHETYPES) {
    const votes: Record<number, string> = {};

    // Get archetype's ENG position for turnout
    const engTmpl = arch.nodes.ENG;
    const engPos = engTmpl && engTmpl.kind === "continuous"
      ? (engTmpl as ContinuousTemplate).pos
      : 3;

    // Gather archetype saliences for turnout computation
    const archSaliences: Record<string, number> = {};
    for (const node of CONTINUOUS_NODES) {
      const tmpl = arch.nodes[node];
      if (tmpl && tmpl.kind === "continuous") {
        archSaliences[node] = (tmpl as ContinuousTemplate).sal;
      }
    }

    for (const election of ELECTIONS) {
      const ctx = getContext(election.year);

      // Score each candidate (with activation context)
      let bestCandidate = "";
      let bestScore = -Infinity;

      for (const cand of election.candidates) {
        const score = computeAlignment(arch, cand, election.year, ctx);
        if (score > bestScore) {
          bestScore = score;
          bestCandidate = cand.name;
        }
      }

      // Dynamic turnout: use regime alignment if context exists
      if (ctx) {
        const { votes: doesVote } = computeTurnoutFromAlignment(arch, election.candidates, ctx);
        if (!doesVote) {
          votes[election.year] = "ABSTAIN";
          continue;
        }
      } else {
        // Fallback to static turnout for elections without context
        if (!willVote(engPos)) {
          votes[election.year] = "ABSTAIN";
          continue;
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

function generateCSV(results: VoteResult[]): string {
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

function generateCandidateProfilesCSV(): string {
  const nodes = [
    "MAT", "CD", "CU", "MOR", "PRO", "COM",
    "ZS", "ONT_H", "ONT_S", "PF", "TRB", "ENG",
    "EPS", "AES",
  ];
  const header = ["Year", "Name", "Party", ...nodes].join(",");
  const rows: string[] = [];

  for (const election of ELECTIONS) {
    for (const cand of election.candidates) {
      const values = nodes.map((n) => (cand as any)[n]);
      rows.push([cand.year, cand.name, cand.party, ...values].join(","));
    }
  }

  return [header, ...rows].join("\n");
}

function generateSummary(results: VoteResult[]): string {
  const lines: string[] = [];
  lines.push("═══════════════════════════════════════════════════════════════");
  lines.push("  PRISM HISTORICAL ELECTION SIMULATION — SUMMARY");
  lines.push("═══════════════════════════════════════════════════════════════\n");

  for (const election of ELECTIONS) {
    const year = election.year;
    const candNames = election.candidates.map((c) => c.name);
    const tallies: Record<string, number> = {};
    let abstentions = 0;

    for (const name of candNames) tallies[name] = 0;

    for (const r of results) {
      const vote = r.votes[year];
      const weight = POPULATION_WEIGHTS[r.archetypeId] ?? (1 / results.length);
      if (vote === "ABSTAIN") {
        abstentions += weight;
      } else {
        tallies[vote] = (tallies[vote] || 0) + weight;
      }
    }

    const totalVoters = Object.values(tallies).reduce((a, b) => a + b, 0);
    lines.push(`── ${year} ──────────────────────────────────────────`);
    lines.push(`  Candidates: ${election.candidates.map((c) => `${c.name} (${c.party})`).join(" vs ")}`);

    const sorted = Object.entries(tallies).sort((a, b) => b[1] - a[1]);
    for (const [name, weight] of sorted) {
      const pct = totalVoters > 0 ? ((weight / totalVoters) * 100).toFixed(1) : "0.0";
      const bar = "█".repeat(Math.round(weight * 50));
      lines.push(`  ${name.padEnd(12)} ${(weight * 100).toFixed(1).padStart(5)}% pop (${pct.padStart(5)}% of voters) ${bar}`);
    }
    lines.push(`  ABSTAIN      ${(abstentions * 100).toFixed(1).padStart(5)}% pop`);
    lines.push("");
  }

  return lines.join("\n");
}

function generatePredictedVsActual(results: VoteResult[]): string {
  const lines: string[] = [];
  lines.push("\n═══════════════════════════════════════════════════════════════");
  lines.push("  PREDICTED vs ACTUAL MARGINS");
  lines.push("═══════════════════════════════════════════════════════════════\n");
  lines.push("  Year  Predicted Winner   Pred%  Actual Winner   Actual%  Δ     Status");
  lines.push("  ────  ─────────────────  ─────  ──────────────  ───────  ────  ──────");

  for (const election of ELECTIONS) {
    const year = election.year;
    const tallies: Record<string, number> = {};
    let totalVoters = 0;

    for (const r of results) {
      const vote = r.votes[year];
      const weight = POPULATION_WEIGHTS[r.archetypeId] ?? (1 / results.length);
      if (vote !== "ABSTAIN") {
        totalVoters += weight;
        tallies[vote] = (tallies[vote] || 0) + weight;
      }
    }

    const sorted = Object.entries(tallies).sort((a, b) => b[1] - a[1]);
    const predWinner = sorted[0]?.[0] ?? "?";
    const predWeight = sorted[0]?.[1] ?? 0;
    const predPct = totalVoters > 0 ? (predWeight / totalVoters) * 100 : 0;

    const actual = ACTUAL_RESULTS[year];
    const actualWinner = actual?.winner ?? "?";
    const actualPct = actual?.winnerPct ?? 0;
    const delta = Math.abs(predPct - actualPct);
    const correctWinner = predWinner === actualWinner;
    const withinMargin = delta <= 10;
    const status = correctWinner && withinMargin ? "OK" : correctWinner ? "MARGIN" : "WRONG";

    lines.push(
      `  ${year}  ${predWinner.padEnd(17)}  ${predPct.toFixed(1).padStart(5)}  ${actualWinner.padEnd(14)}  ${actualPct.toFixed(1).padStart(5)}%  ${delta.toFixed(1).padStart(4)}  ${status}`
    );
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
  let __dirname: string;
  try {
    __dirname = dirname(fileURLToPath(import.meta.url));
  } catch {
    __dirname = process.cwd();
  }
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

export { simulate, computeAlignment, willVote, type VoteResult };

main();
