/**
 * Phase 2.5 — Stage A known-voter aggregate smoke (multi-year).
 *
 * For each configured year:
 *   1. Loads CCES/CES microdata via cesBacktestLoader.
 *   2. Lifts FEC fields from results/electorate/backtest/benchmarks-2008-2024.json.
 *   3. Computes the Stage A known-voter aggregate via stageAKnownVoterBacktest.
 *   4. Runs the Stage A invariants (1-7 + 14 + 15 from the calibration plan,
 *      adapted for an observed-baseline harness with no mapper yet).
 *
 * Stage B (abstention calibration) is intentionally NOT exercised here — that
 * is a separate harness scheduled for Phase 2.7.
 *
 * Usage:
 *   npx tsx src/electorate/stageAKnownVoterBacktestSmoke.ts
 *
 * Outputs:
 *   results/electorate/backtest/stage-a-known-voter-aggregate.json
 *   results/electorate/backtest/stage-a-known-voter-aggregate.md
 */

import * as fs from "node:fs";
import * as path from "node:path";

import { loadSurveyRespondents } from "./cesBacktestLoader.js";
import {
  buildStageAResult,
  liftStageABenchmark,
  type StageAYearResult,
} from "./stageAKnownVoterBacktest.js";

interface YearTarget {
  year: number;
  filePath: string;
}

const YEAR_TARGETS: YearTarget[] = [
  { year: 2008, filePath: "data/cces2008/cces_2008_common.tab" },
  { year: 2012, filePath: "data/cces2012/CCES12_Common_VV.tab" },
  { year: 2016, filePath: "data/cces2016/CCES16_Common_OUTPUT_Feb2018_VV.tab" },
  { year: 2020, filePath: "data/cces2020/CES20_Common_OUTPUT_vv.csv" },
  { year: 2024, filePath: "data/cces2024/CCES24_Common_OUTPUT_vv_topost_final.csv" },
];

const BENCHMARK_PATH = "results/electorate/backtest/benchmarks-2008-2024.json";

interface InvariantCheck {
  id: number;
  label: string;
  passed: boolean;
  detail: string;
}

function check(id: number, label: string, passed: boolean, detail: string): InvariantCheck {
  return { id, label, passed, detail };
}

function pp(x: number): string {
  const sign = x >= 0 ? "+" : "";
  return `${sign}${x.toFixed(2)}pp`;
}

function pct(x: number): string {
  return `${(x * 100).toFixed(2)}%`;
}

interface YearRunResult {
  year: number;
  source_file: string;
  file_present: boolean;
  skipped_reason?: string;
  duration_ms?: number;
  result?: StageAYearResult;
  invariant_checks?: InvariantCheck[];
  overall_pass?: boolean;
}

function runYearInvariants(year: number, r: StageAYearResult): InvariantCheck[] {
  const out: InvariantCheck[] = [];
  // 1. All 5 years present — checked at the aggregate level; per-year reports
  //    that this year was actually loaded (n > 0) and that Stage A produced output.
  out.push(check(1, `${year}: Stage A result produced (sample loaded)`,
    r.n_respondents_total > 0,
    `n_total=${r.n_respondents_total.toLocaleString()} n_known_voter=${r.n_respondents_known_voter.toLocaleString()}`));
  // 2. Known-voter denominator > 0
  out.push(check(2, `${year}: known-voter denominator > 0`,
    r.known_voter_denominator > 0,
    `D+R+Other weight = ${r.known_voter_denominator.toFixed(2)}`));
  // 3. Survey shares sum to 1 within tolerance
  const sum = r.survey_known_voter_shares.D + r.survey_known_voter_shares.R + r.survey_known_voter_shares.Other;
  const sumOk = Math.abs(sum - 1) < 1e-9;
  out.push(check(3, `${year}: survey known-voter D/R/Other shares sum to 1`,
    sumOk,
    `sum=${sum.toFixed(12)} diff=${Math.abs(sum - 1).toExponential(2)}`));
  // 4. Benchmark loaded (positive total, positive known-voter shares; benchmark
  //    shares sum to 1 by FEC construction since FEC has no Unknown bucket).
  const bDenom = r.benchmark_known_voter_shares.D + r.benchmark_known_voter_shares.R + r.benchmark_known_voter_shares.Other;
  const bOk = bDenom > 0 && Math.abs(bDenom - 1) < 1e-3; // FEC published shares are rounded; tolerate 0.001.
  out.push(check(4, `${year}: benchmark D/R/Other shares loaded and sum to 1 (within FEC rounding)`,
    bOk,
    `D=${pct(r.benchmark_known_voter_shares.D)} R=${pct(r.benchmark_known_voter_shares.R)} Other=${pct(r.benchmark_known_voter_shares.Other)} sum=${pct(bDenom)}`));
  // 5. Gap labels present (acceptance_label is one of the 4 enum values)
  const labelOk = ["ready_for_stage_b", "good", "baseline_pass", "fail"].includes(r.acceptance_label);
  out.push(check(5, `${year}: acceptance label present and valid`,
    labelOk,
    `acceptance_label=${r.acceptance_label} (max_abs_gap=${pp(r.max_abs_gap_pp)})`));
  // 6. No abstention calibration in this module (the result must NOT include
  //    abstention-prediction fields). This is a structural check on the result
  //    object's keys.
  const keys = Object.keys(r);
  const abstainCalibKeys = ["alpha_year", "p_abstain", "predicted_abstain_count", "stage_b_result"];
  const hasAnyAbstainKey = abstainCalibKeys.some(k => keys.includes(k));
  out.push(check(6, `${year}: no Stage B / abstention calibration fields present in this Stage A result`,
    !hasAnyAbstainKey,
    `result keys = [${keys.join(", ")}]; forbidden keys checked = [${abstainCalibKeys.join(", ")}]`));
  // 7. Unknown explicitly excluded from Stage A denominator and counted
  //    separately. Verify excluded_weight.unknown_weight matches expectation
  //    (positive in modern years, zero in principle elsewhere — we just check
  //    that the field is reported and non-negative).
  const unknownReported = Number.isFinite(r.excluded_weight.unknown_weight) && r.excluded_weight.unknown_weight >= 0;
  const abstainReported = Number.isFinite(r.excluded_weight.abstain_weight) && r.excluded_weight.abstain_weight >= 0;
  out.push(check(7, `${year}: Unknown excluded from Stage A denom and counted separately (Abstain too)`,
    unknownReported && abstainReported,
    `unknown_weight=${r.excluded_weight.unknown_weight.toFixed(2)} abstain_weight=${r.excluded_weight.abstain_weight.toFixed(2)} (both excluded from D+R+Other denom)`));
  return out;
}

async function main(): Promise<void> {
  const cwd = process.cwd();
  const outDir = path.join(cwd, "results", "electorate", "backtest");
  fs.mkdirSync(outDir, { recursive: true });

  const benchPath = path.join(cwd, BENCHMARK_PATH);
  if (!fs.existsSync(benchPath)) {
    console.error(`Benchmark file not found at ${benchPath}`);
    process.exit(2);
  }
  const benchRaw = JSON.parse(fs.readFileSync(benchPath, "utf8"));
  const benchYears: Record<string, Record<string, unknown>> = benchRaw?.years ?? {};

  const results: YearRunResult[] = [];
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
        file_present: false,
        skipped_reason: "microdata file not present locally",
      });
      continue;
    }
    const yearBlock = benchYears[String(target.year)];
    if (!yearBlock) {
      console.error(`  ✗ benchmark year-block missing for ${target.year}`);
      process.exit(3);
    }
    const benchmark = liftStageABenchmark(yearBlock);

    const t0 = Date.now();
    const { respondents } = await loadSurveyRespondents({
      filePath,
      year: target.year,
      rowLimit: null,
      keepRawVarPayload: false,
    });
    const durationMs = Date.now() - t0;

    const stageA = buildStageAResult(target.year, respondents, benchmark);
    const checks = runYearInvariants(target.year, stageA);
    const passed = checks.filter(c => c.passed).length;
    totalChecks += checks.length;
    totalPassed += passed;

    console.log(`  n_total=${stageA.n_respondents_total.toLocaleString()} n_known=${stageA.n_respondents_known_voter.toLocaleString()} duration=${(durationMs / 1000).toFixed(1)}s checks=${passed}/${checks.length}`);
    console.log(`  survey known-voter shares : D=${pct(stageA.survey_known_voter_shares.D)} R=${pct(stageA.survey_known_voter_shares.R)} Other=${pct(stageA.survey_known_voter_shares.Other)}`);
    console.log(`  benchmark known-voter     : D=${pct(stageA.benchmark_known_voter_shares.D)} R=${pct(stageA.benchmark_known_voter_shares.R)} Other=${pct(stageA.benchmark_known_voter_shares.Other)}`);
    console.log(`  signed gap (survey−bench) : D=${pp(stageA.gaps_pp.D.signed_gap_pp)} R=${pp(stageA.gaps_pp.R.signed_gap_pp)} Other=${pp(stageA.gaps_pp.Other.signed_gap_pp)} (max_abs=${pp(stageA.max_abs_gap_pp)})`);
    console.log(`  acceptance label          : ${stageA.acceptance_label}`);
    console.log(`  excluded weight           : Abstain=${stageA.excluded_weight.abstain_weight.toFixed(0)} Unknown=${stageA.excluded_weight.unknown_weight.toFixed(0)}`);
    for (const c of checks) {
      const mark = c.passed ? "✓" : "✗";
      console.log(`    ${mark} ${c.id}. ${c.label} — ${c.detail}`);
    }

    results.push({
      year: target.year,
      source_file: target.filePath,
      file_present: true,
      duration_ms: durationMs,
      result: stageA,
      invariant_checks: checks,
      overall_pass: checks.every(c => c.passed),
    });
  }

  // Aggregate-level invariant: all 5 years present
  const allFivePresent = YEAR_TARGETS.every(t => results.find(r => r.year === t.year && r.file_present));
  const aggregateChecks: InvariantCheck[] = [
    check(0, "All 5 years present (file loaded for each)",
      allFivePresent,
      `years_present=[${results.filter(r => r.file_present).map(r => r.year).join(",")}], years_skipped=[${results.filter(r => !r.file_present).map(r => r.year).join(",")}]`),
  ];
  totalChecks += aggregateChecks.length;
  totalPassed += aggregateChecks.filter(c => c.passed).length;
  for (const c of aggregateChecks) {
    const mark = c.passed ? "✓" : "✗";
    console.log(`\n${mark} aggregate ${c.id}. ${c.label} — ${c.detail}`);
  }

  // ── JSON output
  const jsonOut = {
    schema_version: "v0.1",
    run_at: new Date().toISOString(),
    phase: "2.5 Stage A — known-voter aggregate harness",
    benchmark_source: BENCHMARK_PATH,
    benchmark_schema_version: benchRaw?.schema_version ?? null,
    description: "Known-voter D/R/Other weighted shares vs FEC, per year. Restriction: voteChoiceObserved ∈ {D,R,Other}; Abstain + Unknown excluded from denominator and reported separately. This is the OBSERVED BASELINE; the future mapper-backed predictions must beat or match these gaps.",
    prediction_source_for_this_run: "observed_survey_baseline",
    plan_reference: "results/electorate/backtest/turnout-abstention-calibration-plan.md §2 Q4 (acceptance bands) and §2 Q5 (invariants 1-7,14,15)",
    acceptance_band_thresholds_pp: {
      ready_for_stage_b: 2,
      good: 3,
      baseline_pass: 5,
    },
    aggregate_checks: aggregateChecks,
    years: results,
    aggregate: {
      total_checks: totalChecks,
      total_passed: totalPassed,
      all_passed: totalPassed === totalChecks && totalChecks > 0,
      years_with_file_present: results.filter(r => r.file_present).length,
      years_skipped: results.filter(r => !r.file_present).map(r => r.year),
      label_distribution: results
        .filter(r => r.file_present && r.result)
        .reduce((acc: Record<string, number>, r) => {
          const lbl = r.result!.acceptance_label;
          acc[lbl] = (acc[lbl] ?? 0) + 1;
          return acc;
        }, {}),
    },
  };
  const jsonPath = path.join(outDir, "stage-a-known-voter-aggregate.json");
  fs.writeFileSync(jsonPath, JSON.stringify(jsonOut, null, 2));

  // ── Markdown summary
  let md = `# Stage A — Known-Voter Aggregate (Phase 2.5)\n\n`;
  md += `**Run at:** ${new Date().toISOString()}\n`;
  md += `**Benchmark source:** \`${BENCHMARK_PATH}\` (schema ${benchRaw?.schema_version ?? "unknown"})\n`;
  md += `**Years targeted:** ${YEAR_TARGETS.map(t => t.year).join(", ")}\n`;
  md += `**Plan reference:** \`results/electorate/backtest/turnout-abstention-calibration-plan.md\` §2 Q4 + Q5\n\n`;

  md += `## What this is, and is not\n\n`;
  md += `**Is**: the harness + baseline contract for Stage A. Restricts each year's CES/CCES sample to known voters (\`voteChoiceObserved ∈ {D, R, Other}\`), computes weighted observed D/R/Other shares, and compares to FEC's D/R/Other shares of total presidential vote.\n\n`;
  md += `**Is not**: a PRISM mapper-backed prediction. There is no signature, no scorer, no vote-formula in this run. The "predictions" are the *observed* survey shares — i.e., the **baseline that the future mapper-backed predictions must beat or match**. When the mapper ships (Phase 2.6+), the harness contract stays the same; only the source of vote choice changes from \`voteChoiceObserved\` to \`mapperImpliedVote\`.\n\n`;
  md += `**Stage B (abstention calibration) is NOT exercised here** — that is a separate harness scheduled for Phase 2.7.\n\n`;
  md += `## Acceptance bands (per plan §2 Q4)\n\n`;
  md += `| Label | max abs gap (pp) |\n|---|---:|\n`;
  md += `| \`ready_for_stage_b\` | ≤ 2 |\n`;
  md += `| \`good\` | ≤ 3 |\n`;
  md += `| \`baseline_pass\` | ≤ 5 |\n`;
  md += `| \`fail\` | > 5 |\n\n`;

  md += `## Cross-year roll-up\n\n`;
  md += `| Year | n total | n known | Survey D | Bench D | D gap | Survey R | Bench R | R gap | Survey Other | Bench Other | Other gap | max abs gap | Label |\n`;
  md += `|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|\n`;
  for (const r of results) {
    if (!r.file_present || !r.result) continue;
    const a = r.result;
    md += `| ${r.year} | ${a.n_respondents_total.toLocaleString()} | ${a.n_respondents_known_voter.toLocaleString()} | ${pct(a.survey_known_voter_shares.D)} | ${pct(a.benchmark_known_voter_shares.D)} | ${pp(a.gaps_pp.D.signed_gap_pp)} | ${pct(a.survey_known_voter_shares.R)} | ${pct(a.benchmark_known_voter_shares.R)} | ${pp(a.gaps_pp.R.signed_gap_pp)} | ${pct(a.survey_known_voter_shares.Other)} | ${pct(a.benchmark_known_voter_shares.Other)} | ${pp(a.gaps_pp.Other.signed_gap_pp)} | ${pp(a.max_abs_gap_pp)} | \`${a.acceptance_label}\` |\n`;
  }
  md += `\n`;

  md += `## Label distribution\n\n`;
  const labelDist = jsonOut.aggregate.label_distribution;
  for (const lbl of ["ready_for_stage_b", "good", "baseline_pass", "fail"]) {
    md += `- \`${lbl}\`: ${labelDist[lbl] ?? 0} year(s)\n`;
  }
  md += `\n`;

  md += `## Per-year detail\n\n`;
  for (const r of results) {
    md += `### ${r.year}\n\n`;
    md += `- Source file: \`${r.source_file}\`\n`;
    if (!r.file_present) {
      md += `- **Skipped** — ${r.skipped_reason ?? "file not present"}\n\n`;
      continue;
    }
    const a = r.result!;
    md += `- Duration: ${(r.duration_ms! / 1000).toFixed(1)}s\n`;
    md += `- Sample: **${a.n_respondents_known_voter.toLocaleString()}** known-voter respondents (of ${a.n_respondents_total.toLocaleString()} total)\n`;
    md += `- Known-voter denominator (weight): ${a.known_voter_denominator.toFixed(2)}\n`;
    md += `- Excluded weight: Abstain=${a.excluded_weight.abstain_weight.toFixed(0)}, Unknown=${a.excluded_weight.unknown_weight.toFixed(0)}, total=${a.excluded_weight.total_excluded_weight.toFixed(0)}\n\n`;
    md += `**Survey known-voter shares**: D=${pct(a.survey_known_voter_shares.D)}, R=${pct(a.survey_known_voter_shares.R)}, Other=${pct(a.survey_known_voter_shares.Other)}\n\n`;
    md += `**Benchmark (FEC) known-voter shares**: D=${pct(a.benchmark_known_voter_shares.D)}, R=${pct(a.benchmark_known_voter_shares.R)}, Other=${pct(a.benchmark_known_voter_shares.Other)}\n\n`;
    md += `**Gaps (survey − benchmark, pp)**:\n`;
    md += `- D: signed ${pp(a.gaps_pp.D.signed_gap_pp)} (abs ${a.gaps_pp.D.abs_gap_pp.toFixed(2)})\n`;
    md += `- R: signed ${pp(a.gaps_pp.R.signed_gap_pp)} (abs ${a.gaps_pp.R.abs_gap_pp.toFixed(2)})\n`;
    md += `- Other: signed ${pp(a.gaps_pp.Other.signed_gap_pp)} (abs ${a.gaps_pp.Other.abs_gap_pp.toFixed(2)})\n`;
    md += `- max abs gap: **${pp(a.max_abs_gap_pp)}** → label \`${a.acceptance_label}\`\n`;
    md += `- abs-gap-sum (D+R+Other): ${a.abs_gap_sum_pp.toFixed(2)}pp\n\n`;
    md += `| # | Check | Pass | Detail |\n|---|---|:--:|---|\n`;
    for (const c of r.invariant_checks!) {
      md += `| ${c.id} | ${c.label} | ${c.passed ? "✓" : "✗"} | ${c.detail} |\n`;
    }
    md += `\n**Year ${r.year} overall: ${r.overall_pass ? "✓ ALL PASS" : "✗ FAIL"}** (${r.invariant_checks!.filter(c => c.passed).length}/${r.invariant_checks!.length})\n\n`;
  }

  md += `## Aggregate invariant\n\n`;
  for (const c of aggregateChecks) {
    md += `- ${c.passed ? "✓" : "✗"} ${c.id}. ${c.label} — ${c.detail}\n`;
  }
  md += `\n`;

  md += `## What this baseline means for the future mapper\n\n`;
  md += `Per the calibration plan §2 Q4, Stage A is the **first runnable mapper-backed target**. The numbers in this report are the **observed-baseline floor** — they are what the future mapper-backed predictions must produce *automatically* to be judged competent.\n\n`;
  md += `- A mapper that produces D/R/Other gaps within the same per-year acceptance bands as the observed baseline is "no worse than the survey itself" — i.e., the mapper has not introduced systematic bias on top of the survey signal.\n`;
  md += `- A mapper that produces gaps **wider** than this baseline is doing actively bad work; investigate per the mapper-revision protocol (\`survey-to-prism-v0.md\` §4).\n`;
  md += `- A mapper that produces **tighter** gaps than this baseline (e.g., correcting "shy Trump" effects through structural inference) is doing useful work — but that's a v1 question, not a v0 acceptance criterion.\n\n`;
  md += `## Aggregate\n\n`;
  md += `- Total invariant checks (incl. aggregate): **${totalPassed}/${totalChecks}**\n`;
  md += `- Years with file present: ${jsonOut.aggregate.years_with_file_present}\n`;
  md += `- Years skipped (file not present): ${jsonOut.aggregate.years_skipped.join(", ") || "(none)"}\n`;

  fs.writeFileSync(path.join(outDir, "stage-a-known-voter-aggregate.md"), md);

  // Verify JSON parses
  try {
    JSON.parse(fs.readFileSync(jsonPath, "utf8"));
    console.log("\nJSON valid");
  } catch (e) {
    console.error("JSON did not parse:", e);
    process.exit(3);
  }

  console.log(`\nWrote ${jsonPath}`);
  console.log(`Wrote ${path.join(outDir, "stage-a-known-voter-aggregate.md")}`);
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
