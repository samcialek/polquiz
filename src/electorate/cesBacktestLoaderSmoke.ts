/**
 * Phase 2 Backtest V0 — CCES loader smoke test.
 *
 * Loads CCES 2016 Common Content from data/cces2016/ and runs invariant
 * checks on the normalized output. Does NOT modify or consume the
 * survey-to-PRISM mapper. Does NOT compute predicted vote shares — that's
 * the job of mode A / mode B once mapper + engine integration is wired.
 *
 * Invariants (per backtest-v0-architecture.md and surveyBacktestTypes.ts):
 *   1. Loader produces > 0 rows from CCES 2016
 *   2. All weights are finite (numeric, not NaN/Infinity) and > 0
 *   3. Non-voters are retained (turnoutCounts.nonvoter > 0)
 *   4. Validated-turnout count is > 0 (CCES 2016 has voter file matches)
 *   5. Voted respondents have voteChoiceObserved in {D, R, Other, Unknown}
 *   6. Non-voter respondents have voteChoiceObserved == "Abstain"
 *   7. D + R counts both > 0 (sanity that the resolver's code map works)
 *   8. JSON output validates
 *
 * Usage:
 *   npx tsx src/electorate/cesBacktestLoaderSmoke.ts
 *
 * Outputs:
 *   results/electorate/backtest/loader-smoke.json
 *   results/electorate/backtest/loader-smoke-summary.md
 */

import * as fs from "node:fs";
import * as path from "node:path";

import { loadSurveyRespondents } from "./cesBacktestLoader.js";
import type { LoaderInventoryStats, WeightedSurveyRespondent } from "./surveyBacktestTypes.js";

const TARGET_FILE = "data/cces2016/CCES16_Common_OUTPUT_Feb2018_VV.tab";
const TARGET_YEAR = 2016;

interface InvariantCheck {
  id: number;
  label: string;
  passed: boolean;
  detail: string;
}

function check(id: number, label: string, passed: boolean, detail: string): InvariantCheck {
  return { id, label, passed, detail };
}

function pct(num: number, denom: number): string {
  if (denom === 0) return "n/a";
  return ((num / denom) * 100).toFixed(2) + "%";
}

interface WeightedShares {
  byChoice: Record<string, number>;
  byTurnout: Record<string, number>;
  totalWeight: number;
  voterWeight: number;
  voterShareByChoice: Record<string, number>;
}

function weightedSharesOf(respondents: WeightedSurveyRespondent[]): WeightedShares {
  const byChoice: Record<string, number> = { D: 0, R: 0, Other: 0, Abstain: 0, Unknown: 0 };
  const byTurnout: Record<string, number> = { voted: 0, nonvoter: 0, unknown: 0 };
  let totalWeight = 0;
  for (const r of respondents) {
    totalWeight += r.weight;
    byChoice[r.voteChoiceObserved] = (byChoice[r.voteChoiceObserved] ?? 0) + r.weight;
    if (r.turnoutObserved === true) byTurnout.voted += r.weight;
    else if (r.turnoutObserved === false) byTurnout.nonvoter += r.weight;
    else byTurnout.unknown += r.weight;
  }
  // Voter-conditional D/R/Other shares (denom = D+R+Other+Unknown weights, NOT abstain).
  const voterWeight = byChoice.D + byChoice.R + byChoice.Other + byChoice.Unknown;
  const voterShareByChoice: Record<string, number> = {};
  if (voterWeight > 0) {
    voterShareByChoice.D = byChoice.D / voterWeight;
    voterShareByChoice.R = byChoice.R / voterWeight;
    voterShareByChoice.Other = byChoice.Other / voterWeight;
    voterShareByChoice.Unknown = byChoice.Unknown / voterWeight;
  }
  return { byChoice, byTurnout, totalWeight, voterWeight, voterShareByChoice };
}

function runInvariants(
  respondents: WeightedSurveyRespondent[],
  stats: LoaderInventoryStats,
  shares: WeightedShares,
): InvariantCheck[] {
  const out: InvariantCheck[] = [];
  // 1
  out.push(check(1, "Loader produces > 0 rows from CCES 2016",
    stats.rowsLoaded > 0,
    `rowsLoaded=${stats.rowsLoaded}, rowsSkipped=${stats.rowsSkipped}`));
  // 2
  let allFinitePositive = true;
  let badIdx = -1;
  for (let i = 0; i < respondents.length; i++) {
    const w = respondents[i]!.weight;
    if (!Number.isFinite(w) || w <= 0) { allFinitePositive = false; badIdx = i; break; }
  }
  out.push(check(2, "All weights are finite and > 0",
    allFinitePositive,
    allFinitePositive
      ? `min=${stats.weightMin.toFixed(4)} max=${stats.weightMax.toFixed(4)}`
      : `bad row index ${badIdx} weight=${respondents[badIdx]?.weight}`));
  // 3
  out.push(check(3, "Non-voters retained (not silently dropped)",
    stats.turnoutCounts.nonvoter > 0,
    `nonvoter=${stats.turnoutCounts.nonvoter}, voted=${stats.turnoutCounts.voted}, unknown=${stats.turnoutCounts.unknown}`));
  // 4
  out.push(check(4, "Validated-turnout count > 0",
    stats.validatedTurnoutCount > 0,
    `validatedTurnoutCount=${stats.validatedTurnoutCount}`));
  // 5
  // For each voter row, voteChoiceObserved must be in D/R/Other/Unknown (not Abstain).
  let voterChoiceOk = true;
  for (const r of respondents) {
    if (r.turnoutObserved === true && r.voteChoiceObserved === "Abstain") {
      voterChoiceOk = false;
      break;
    }
  }
  out.push(check(5, "Voter rows have voteChoiceObserved in {D,R,Other,Unknown}",
    voterChoiceOk,
    voterChoiceOk ? "all voter rows have a non-Abstain choice" : "found voter row classified as Abstain"));
  // 6
  let nonvoterChoiceOk = true;
  for (const r of respondents) {
    if (r.turnoutObserved === false && r.voteChoiceObserved !== "Abstain") {
      nonvoterChoiceOk = false;
      break;
    }
  }
  out.push(check(6, "Non-voter rows have voteChoiceObserved == 'Abstain'",
    nonvoterChoiceOk,
    nonvoterChoiceOk ? "all non-voter rows are 'Abstain'" : "found non-voter row with non-Abstain choice"));
  // 7
  out.push(check(7, "D and R counts both > 0 (resolver code map sane)",
    stats.voteChoiceCounts.D > 0 && stats.voteChoiceCounts.R > 0,
    `D=${stats.voteChoiceCounts.D}, R=${stats.voteChoiceCounts.R}, Other=${stats.voteChoiceCounts.Other}, Abstain=${stats.voteChoiceCounts.Abstain}, Unknown=${stats.voteChoiceCounts.Unknown}`));
  // 8 — JSON validation done after write
  return out;
}

function writeMarkdownSummary(
  outDir: string,
  stats: LoaderInventoryStats,
  shares: WeightedShares,
  checks: InvariantCheck[],
  fileSizeBytes: number,
  durationMs: number,
): void {
  const passed = checks.filter(c => c.passed).length;
  let md = `# CCES 2016 Loader Smoke — Summary\n\n`;
  md += `**Run at:** ${new Date().toISOString()}\n`;
  md += `**Source file:** \`${TARGET_FILE}\` (${(fileSizeBytes / 1024 / 1024).toFixed(1)} MB)\n`;
  md += `**Year:** ${TARGET_YEAR}\n`;
  md += `**Duration:** ${(durationMs / 1000).toFixed(2)}s\n\n`;
  md += `## Invariant checks\n\n`;
  md += `| # | Check | Pass | Detail |\n|---|---|:--:|---|\n`;
  for (const c of checks) {
    md += `| ${c.id} | ${c.label} | ${c.passed ? "✓" : "✗"} | ${c.detail} |\n`;
  }
  md += `\n**Overall: ${passed === checks.length ? "✓ ALL PASS" : "✗ FAIL"}** (${passed}/${checks.length})\n\n`;
  md += `## Loader stats\n\n`;
  md += `- Rows loaded: **${stats.rowsLoaded.toLocaleString()}**\n`;
  md += `- Rows skipped (missing/invalid weight or ID): **${stats.rowsSkipped.toLocaleString()}**\n`;
  md += `- Weight range: ${stats.weightMin.toFixed(4)} → ${stats.weightMax.toFixed(4)}\n`;
  md += `- Sum of weights: ${stats.totalWeight.toFixed(2)}\n\n`;
  md += `## Turnout classification (raw row counts)\n\n`;
  md += `| Class | Count | Share of loaded |\n|---|---:|---:|\n`;
  md += `| Voted (turnoutObserved=true) | ${stats.turnoutCounts.voted.toLocaleString()} | ${pct(stats.turnoutCounts.voted, stats.rowsLoaded)} |\n`;
  md += `| Non-voter (turnoutObserved=false) | ${stats.turnoutCounts.nonvoter.toLocaleString()} | ${pct(stats.turnoutCounts.nonvoter, stats.rowsLoaded)} |\n`;
  md += `| Unknown (turnoutObserved=null) | ${stats.turnoutCounts.unknown.toLocaleString()} | ${pct(stats.turnoutCounts.unknown, stats.rowsLoaded)} |\n`;
  md += `| Validated turnout (CL_E2016GVM populated) | ${stats.validatedTurnoutCount.toLocaleString()} | ${pct(stats.validatedTurnoutCount, stats.rowsLoaded)} |\n\n`;
  md += `## Vote-choice classification (raw row counts)\n\n`;
  md += `| Choice | Count | Share of loaded |\n|---|---:|---:|\n`;
  for (const choice of ["D", "R", "Other", "Abstain", "Unknown"] as const) {
    md += `| ${choice} | ${stats.voteChoiceCounts[choice].toLocaleString()} | ${pct(stats.voteChoiceCounts[choice], stats.rowsLoaded)} |\n`;
  }
  md += `\n## Weighted shares\n\n`;
  md += `_For diagnostic context only — these are NOT predicted vote shares; they are the survey's observed weighted distribution._\n\n`;
  md += `| Choice | Weighted total | Share of total weight | Share of voter+unknown weight |\n|---|---:|---:|---:|\n`;
  for (const choice of ["D", "R", "Other", "Abstain", "Unknown"] as const) {
    const wt = shares.byChoice[choice];
    const shareOfAll = shares.totalWeight > 0 ? wt / shares.totalWeight : 0;
    const shareOfVoter = shares.voterShareByChoice[choice] ?? null;
    md += `| ${choice} | ${wt.toFixed(2)} | ${(shareOfAll * 100).toFixed(2)}% | ${shareOfVoter == null ? "—" : (shareOfVoter * 100).toFixed(2) + "%"} |\n`;
  }
  md += `\n**Note**: voter+unknown denominator excludes Abstain rows. The voter-conditional D-share above is comparable in spirit to the FEC D-share-of-total-presidential-votes once the predicted-vote layer is wired.\n\n`;
  md += `## What this smoke verifies\n\n`;
  md += `- The loader can read the CCES 2016 file end-to-end and produce typed respondent records.\n`;
  md += `- Weights are sane (finite, positive).\n`;
  md += `- Non-voters are retained (essential for abstention-share predictions in mode B).\n`;
  md += `- Validated-turnout signal flows through (mode A oracle path's gold-standard input).\n`;
  md += `- Vote-choice resolver maps codes correctly (D and R both populated).\n\n`;
  md += `## What this smoke does NOT do\n\n`;
  md += `- Does not run the survey-to-PRISM mapper.\n`;
  md += `- Does not produce predicted vote shares.\n`;
  md += `- Does not compare against benchmark FEC totals.\n`;
  md += `- Does not produce mode A or mode B output.\n\n`;
  md += `Those are downstream of the loader and require the mapper + engine integration to be wired.\n`;
  fs.writeFileSync(path.join(outDir, "loader-smoke-summary.md"), md);
}

async function main(): Promise<void> {
  const cwd = process.cwd();
  const filePath = path.join(cwd, TARGET_FILE);
  if (!fs.existsSync(filePath)) {
    console.error(`Source file not found: ${filePath}`);
    process.exit(2);
  }
  const fileSizeBytes = fs.statSync(filePath).size;

  const t0 = Date.now();
  const { respondents, stats } = await loadSurveyRespondents({
    filePath,
    year: TARGET_YEAR,
    rowLimit: null,
    keepRawVarPayload: false, // keep memory tight for smoke; full payload not needed for invariant checks
  });
  const durationMs = Date.now() - t0;

  const shares = weightedSharesOf(respondents);
  const checks = runInvariants(respondents, stats, shares);

  const outDir = path.join(cwd, "results", "electorate", "backtest");
  fs.mkdirSync(outDir, { recursive: true });

  // JSON output (light — does not include the full respondent array, only stats + checks).
  const jsonOut = {
    schema_version: "v0",
    run_at: new Date().toISOString(),
    source_file: TARGET_FILE,
    source_file_size_bytes: fileSizeBytes,
    target_year: TARGET_YEAR,
    duration_ms: durationMs,
    stats,
    weighted_shares: {
      total_weight: shares.totalWeight,
      voter_weight: shares.voterWeight,
      by_choice_weight: shares.byChoice,
      by_turnout_weight: shares.byTurnout,
      voter_conditional_share: shares.voterShareByChoice,
    },
    invariant_checks: checks.map(c => ({
      id: c.id,
      label: c.label,
      passed: c.passed,
      detail: c.detail,
    })),
    overall_pass: checks.every(c => c.passed),
  };
  const jsonPath = path.join(outDir, "loader-smoke.json");
  fs.writeFileSync(jsonPath, JSON.stringify(jsonOut, null, 2));

  writeMarkdownSummary(outDir, stats, shares, checks, fileSizeBytes, durationMs);

  // Verify JSON parses
  try {
    JSON.parse(fs.readFileSync(jsonPath, "utf8"));
    console.log("JSON valid");
  } catch (e) {
    console.error("JSON did not parse:", e);
    process.exit(3);
  }

  console.log(`\nWrote ${jsonPath}`);
  console.log(`Wrote ${path.join(outDir, "loader-smoke-summary.md")}`);
  console.log(`\nInvariant checks: ${checks.filter(c => c.passed).length}/${checks.length} passed`);
  for (const c of checks) {
    const mark = c.passed ? "✓" : "✗";
    console.log(`  ${mark} ${c.id.toString().padStart(2)}. ${c.label} — ${c.detail}`);
  }
  if (!checks.every(c => c.passed)) {
    console.error(`\nSMOKE FAILED: at least one invariant check did not pass`);
    process.exit(1);
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
