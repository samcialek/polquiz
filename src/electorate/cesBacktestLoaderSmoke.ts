/**
 * Phase 2 Backtest V0 — CCES loader smoke test (multi-year).
 *
 * Loads each configured year's microdata from `data/cces{YEAR}/` and runs
 * invariant checks per year. Does NOT modify or consume the survey-to-PRISM
 * mapper. Does NOT compute predicted vote shares — that's the job of mode
 * A / mode B once mapper + engine integration is wired.
 *
 * Invariants (per backtest-v0-architecture.md and surveyBacktestTypes.ts):
 *   1. Loader produces > 0 rows
 *   2. All weights are finite (numeric, not NaN/Infinity) and > 0
 *   3. Non-voters are retained (turnoutCounts.nonvoter > 0)
 *   4. Validated-turnout count > 0 IF the year's resolver declares a
 *      validated-turnout column; otherwise this check is "n/a (no validation
 *      column in this release)" and is treated as passing
 *   5. Voted respondents have voteChoiceObserved in {D, R, Other, Unknown}
 *   6. Non-voter respondents have voteChoiceObserved == "Abstain"
 *   7. D + R counts both > 0 (sanity that the resolver's code map works)
 *
 * Plus aggregate JSON output validates.
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

interface YearTarget {
  year: number;
  filePath: string;
  /** True if the year's resolver declares a validated-turnout column. */
  expectsValidatedTurnout: boolean;
}

const YEAR_TARGETS: YearTarget[] = [
  { year: 2008, filePath: "data/cces2008/cces_2008_common.tab",                            expectsValidatedTurnout: true },
  { year: 2012, filePath: "data/cces2012/CCES12_Common_VV.tab",                            expectsValidatedTurnout: false },
  { year: 2016, filePath: "data/cces2016/CCES16_Common_OUTPUT_Feb2018_VV.tab",             expectsValidatedTurnout: true },
  { year: 2020, filePath: "data/cces2020/CES20_Common_OUTPUT_vv.csv",                      expectsValidatedTurnout: true },
  { year: 2024, filePath: "data/cces2024/CCES24_Common_OUTPUT_vv_topost_final.csv",        expectsValidatedTurnout: false },
];

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
  year: number,
  respondents: WeightedSurveyRespondent[],
  stats: LoaderInventoryStats,
  expectsValidatedTurnout: boolean,
): InvariantCheck[] {
  const out: InvariantCheck[] = [];
  // 1
  out.push(check(1, `Loader produces > 0 rows from CES ${year}`,
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
  // 4 — only required if the year's resolver declares a validated-turnout column.
  if (expectsValidatedTurnout) {
    out.push(check(4, "Validated-turnout count > 0",
      stats.validatedTurnoutCount > 0,
      `validatedTurnoutCount=${stats.validatedTurnoutCount}`));
  } else {
    out.push(check(4, "Validated-turnout column not present in this release (n/a, treated as pass)",
      true,
      `expectsValidatedTurnout=false; validatedTurnoutCount=${stats.validatedTurnoutCount}`));
  }
  // 5
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
  return out;
}

async function main(): Promise<void> {
  const cwd = process.cwd();
  const outDir = path.join(cwd, "results", "electorate", "backtest");
  fs.mkdirSync(outDir, { recursive: true });

  interface YearResult {
    year: number;
    source_file: string;
    source_file_size_bytes: number | null;
    duration_ms: number;
    file_present: boolean;
    skipped_reason?: string;
    stats?: LoaderInventoryStats;
    weighted_shares?: {
      total_weight: number;
      voter_weight: number;
      by_choice_weight: Record<string, number>;
      by_turnout_weight: Record<string, number>;
      voter_conditional_share: Record<string, number>;
    };
    invariant_checks?: Array<{ id: number; label: string; passed: boolean; detail: string }>;
    overall_pass?: boolean;
  }

  const results: YearResult[] = [];
  let totalChecks = 0;
  let totalPassed = 0;

  for (const target of YEAR_TARGETS) {
    const filePath = path.join(cwd, target.filePath);
    console.log(`\n=== ${target.year} (${target.filePath}) ===`);
    if (!fs.existsSync(filePath)) {
      console.log(`  ✗ file not present — skipping (data acquisition pending)`);
      results.push({
        year: target.year,
        source_file: target.filePath,
        source_file_size_bytes: null,
        duration_ms: 0,
        file_present: false,
        skipped_reason: "microdata file not present locally",
      });
      continue;
    }
    const fileSizeBytes = fs.statSync(filePath).size;
    const t0 = Date.now();
    const { respondents, stats } = await loadSurveyRespondents({
      filePath,
      year: target.year,
      rowLimit: null,
      keepRawVarPayload: false,
    });
    const durationMs = Date.now() - t0;
    const shares = weightedSharesOf(respondents);
    const checks = runInvariants(target.year, respondents, stats, target.expectsValidatedTurnout);
    const yearPassed = checks.filter(c => c.passed).length;
    totalChecks += checks.length;
    totalPassed += yearPassed;
    console.log(`  rows=${stats.rowsLoaded.toLocaleString()} skipped=${stats.rowsSkipped} duration=${(durationMs / 1000).toFixed(1)}s checks=${yearPassed}/${checks.length}`);
    for (const c of checks) {
      const mark = c.passed ? "✓" : "✗";
      console.log(`    ${mark} ${c.id}. ${c.label} — ${c.detail}`);
    }
    results.push({
      year: target.year,
      source_file: target.filePath,
      source_file_size_bytes: fileSizeBytes,
      duration_ms: durationMs,
      file_present: true,
      stats,
      weighted_shares: {
        total_weight: shares.totalWeight,
        voter_weight: shares.voterWeight,
        by_choice_weight: shares.byChoice,
        by_turnout_weight: shares.byTurnout,
        voter_conditional_share: shares.voterShareByChoice,
      },
      invariant_checks: checks.map(c => ({ id: c.id, label: c.label, passed: c.passed, detail: c.detail })),
      overall_pass: checks.every(c => c.passed),
    });
  }

  // ── JSON output
  const jsonOut = {
    schema_version: "v0.2-multiyear",
    run_at: new Date().toISOString(),
    years: results,
    aggregate: {
      total_checks: totalChecks,
      total_passed: totalPassed,
      all_passed: totalPassed === totalChecks && totalChecks > 0,
      years_with_file_present: results.filter(r => r.file_present).length,
      years_skipped: results.filter(r => !r.file_present).map(r => r.year),
    },
  };
  const jsonPath = path.join(outDir, "loader-smoke.json");
  fs.writeFileSync(jsonPath, JSON.stringify(jsonOut, null, 2));

  // ── Markdown summary
  let md = `# CES Loader Smoke — Multi-Year Summary\n\n`;
  md += `**Run at:** ${new Date().toISOString()}\n`;
  md += `**Years targeted:** ${YEAR_TARGETS.map(t => t.year).join(", ")}\n\n`;
  md += `## Per-year invariant checks\n\n`;
  for (const r of results) {
    md += `### ${r.year}\n\n`;
    md += `- Source file: \`${r.source_file}\` ${r.source_file_size_bytes != null ? `(${(r.source_file_size_bytes / 1024 / 1024).toFixed(1)} MB)` : ""}\n`;
    if (!r.file_present) {
      md += `- **Skipped** — ${r.skipped_reason ?? "file not present"}\n\n`;
      continue;
    }
    md += `- Duration: ${(r.duration_ms / 1000).toFixed(1)}s\n`;
    md += `- Rows loaded: **${r.stats!.rowsLoaded.toLocaleString()}** (skipped ${r.stats!.rowsSkipped.toLocaleString()})\n`;
    md += `- Weight range: ${r.stats!.weightMin.toFixed(4)} → ${r.stats!.weightMax.toFixed(4)}\n`;
    md += `- Turnout: voted=${r.stats!.turnoutCounts.voted.toLocaleString()}, non-voter=${r.stats!.turnoutCounts.nonvoter.toLocaleString()}, unknown=${r.stats!.turnoutCounts.unknown.toLocaleString()}, validated=${r.stats!.validatedTurnoutCount.toLocaleString()}\n`;
    md += `- Vote choice: D=${r.stats!.voteChoiceCounts.D.toLocaleString()}, R=${r.stats!.voteChoiceCounts.R.toLocaleString()}, Other=${r.stats!.voteChoiceCounts.Other.toLocaleString()}, Abstain=${r.stats!.voteChoiceCounts.Abstain.toLocaleString()}, Unknown=${r.stats!.voteChoiceCounts.Unknown.toLocaleString()}\n\n`;
    md += `| # | Check | Pass | Detail |\n|---|---|:--:|---|\n`;
    for (const c of r.invariant_checks!) {
      md += `| ${c.id} | ${c.label} | ${c.passed ? "✓" : "✗"} | ${c.detail} |\n`;
    }
    md += `\n**Year ${r.year} overall: ${r.overall_pass ? "✓ ALL PASS" : "✗ FAIL"}** (${r.invariant_checks!.filter(c => c.passed).length}/${r.invariant_checks!.length})\n\n`;
    md += `**Voter-conditional share (voter+unknown denominator)**: D=${(r.weighted_shares!.voter_conditional_share.D * 100).toFixed(2)}%, R=${(r.weighted_shares!.voter_conditional_share.R * 100).toFixed(2)}%, Other=${(r.weighted_shares!.voter_conditional_share.Other * 100).toFixed(2)}%, Unknown=${(r.weighted_shares!.voter_conditional_share.Unknown * 100).toFixed(2)}%\n\n`;
  }
  md += `## Aggregate\n\n`;
  md += `- Total checks across all years: **${totalPassed}/${totalChecks}**\n`;
  md += `- Years with file present (loaded): ${jsonOut.aggregate.years_with_file_present}\n`;
  md += `- Years skipped (file not present): ${jsonOut.aggregate.years_skipped.join(", ") || "(none)"}\n\n`;
  md += `## What this smoke verifies / does NOT do\n\n`;
  md += `- ✓ Each loaded year reads end-to-end and produces typed respondent records\n`;
  md += `- ✓ Weights sane (finite, positive)\n`;
  md += `- ✓ Non-voters retained (essential for mode-B abstention prediction)\n`;
  md += `- ✓ Validated-turnout signal flows where the year's release includes it\n`;
  md += `- ✓ Vote-choice resolver code map sane (D and R both populated)\n`;
  md += `- ✗ Does NOT run the survey-to-PRISM mapper\n`;
  md += `- ✗ Does NOT produce predicted vote shares\n`;
  md += `- ✗ Does NOT compare against benchmark FEC totals\n`;
  fs.writeFileSync(path.join(outDir, "loader-smoke-summary.md"), md);

  // Verify JSON parses
  try {
    JSON.parse(fs.readFileSync(jsonPath, "utf8"));
    console.log("\nJSON valid");
  } catch (e) {
    console.error("JSON did not parse:", e);
    process.exit(3);
  }

  console.log(`\nWrote ${jsonPath}`);
  console.log(`Wrote ${path.join(outDir, "loader-smoke-summary.md")}`);
  console.log(`\nAggregate: ${totalPassed}/${totalChecks} invariant checks passed across ${jsonOut.aggregate.years_with_file_present} year(s)`);
  if (totalPassed !== totalChecks) {
    console.error(`\nSMOKE FAILED: at least one invariant check did not pass`);
    process.exit(1);
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
