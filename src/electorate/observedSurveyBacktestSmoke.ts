/**
 * Phase 2.3 — Observed survey-vote aggregate smoke (multi-year).
 *
 * For each configured year:
 *   1. Loads CCES/CES microdata via the existing cesBacktestLoader.
 *   2. Builds a weighted observed aggregate via observedSurveyBacktest.
 *   3. Reads the matching year-block from
 *      results/electorate/backtest/benchmarks-2008-2024.json.
 *   4. Compares survey-implied vs benchmark shares; writes JSON + Markdown.
 *
 * This is a SANITY CHECK only. There is no model, no scorer, no mapper,
 * no tuning. Predictions are out of scope. Gaps reported are evidence
 * about survey nonresponse, weight-frame mismatch, and self-report bias —
 * not "errors to close".
 *
 * Usage:
 *   npx tsx src/electorate/observedSurveyBacktestSmoke.ts
 *
 * Outputs:
 *   results/electorate/backtest/observed-survey-aggregate.json
 *   results/electorate/backtest/observed-survey-aggregate.md
 */

import * as fs from "node:fs";
import * as path from "node:path";

import { loadSurveyRespondents } from "./cesBacktestLoader.js";
import {
  buildYearAggregate,
  liftYearBenchmark,
  type ObservedYearAggregate,
} from "./observedSurveyBacktest.js";

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
  aggregate?: ObservedYearAggregate;
  invariant_checks?: InvariantCheck[];
  overall_pass?: boolean;
}

function runYearInvariants(year: number, agg: ObservedYearAggregate): InvariantCheck[] {
  const out: InvariantCheck[] = [];
  // (a) Loader produced rows
  out.push(check(1, `${year}: respondents loaded`,
    agg.n_respondents > 0,
    `n=${agg.n_respondents.toLocaleString()}`));
  // (b) All weighted counts finite
  const c = agg.weighted_counts;
  const allFinite = [c.D, c.R, c.Other, c.Abstain, c.Unknown, agg.total_weight].every(Number.isFinite);
  out.push(check(2, `${year}: all weighted counts and total_weight finite`,
    allFinite,
    `D=${c.D.toFixed(0)} R=${c.R.toFixed(0)} Other=${c.Other.toFixed(0)} Abstain=${c.Abstain.toFixed(0)} Unknown=${c.Unknown.toFixed(0)} total=${agg.total_weight.toFixed(0)}`));
  // (c) Bucket sum equals total_weight (within float tolerance)
  const bucketSum = c.D + c.R + c.Other + c.Abstain + c.Unknown;
  const sumDiff = Math.abs(bucketSum - agg.total_weight);
  const sumOk = sumDiff < 1e-6 * Math.max(1, agg.total_weight);
  out.push(check(3, `${year}: bucket weights sum to total_weight (no silent drops)`,
    sumOk,
    `bucketSum=${bucketSum.toFixed(2)} total=${agg.total_weight.toFixed(2)} diff=${sumDiff.toExponential(2)}`));
  // (d) D, R, Other, Abstain all > 0 (the years that have full vote data have
  //     non-zero in each candidate bucket; Unknown is allowed to be zero in
  //     principle but we report it explicitly).
  const fourPresent = c.D > 0 && c.R > 0 && c.Other > 0 && c.Abstain > 0;
  out.push(check(4, `${year}: D, R, Other, Abstain all weighted > 0`,
    fourPresent,
    `D>0=${c.D > 0} R>0=${c.R > 0} Other>0=${c.Other > 0} Abstain>0=${c.Abstain > 0} (Unknown=${c.Unknown.toFixed(0)})`));
  // (e) Benchmark loaded with positive VEP and positive total presidential votes
  const bm = agg.benchmark;
  const benchOk = Number.isFinite(bm.vep) && bm.vep > 0
    && Number.isFinite(bm.total_presidential_votes) && bm.total_presidential_votes > 0;
  out.push(check(5, `${year}: official benchmark loaded with positive VEP and pres-vote totals`,
    benchOk,
    `vep=${bm.vep.toLocaleString()} total_pres=${bm.total_presidential_votes.toLocaleString()}`));
  // (f) Unknown bucket explicitly tracked (not silently redistributed) — the
  //     unknown_handling_note must be the exact contract string.
  const noteOk = agg.unknown_handling_note.startsWith("Unknown share retained explicitly");
  out.push(check(6, `${year}: Unknown bucket retained explicitly`,
    noteOk,
    `unknown_share=${pct(agg.unknown_share_implied)} note="${agg.unknown_handling_note}"`));
  // (g) Survey-implied + benchmark share-of-VEP gaps are finite (sanity that
  //     benchmark fields are present and arithmetic is well-defined).
  const g = agg.gaps_pp_vs_vep_benchmark;
  const gapsFinite = [g.d_share_of_vep_gap_pp, g.r_share_of_vep_gap_pp, g.other_share_of_vep_gap_pp,
                      g.abstain_share_of_vep_gap_pp, g.turnout_share_of_vep_gap_pp, g.abs_gap_sum_pp]
    .every(Number.isFinite);
  out.push(check(7, `${year}: VEP-share gaps all finite`,
    gapsFinite,
    `D_gap=${pp(g.d_share_of_vep_gap_pp)} R_gap=${pp(g.r_share_of_vep_gap_pp)} O_gap=${pp(g.other_share_of_vep_gap_pp)} Abstain_gap=${pp(g.abstain_share_of_vep_gap_pp)} turnout_gap=${pp(g.turnout_share_of_vep_gap_pp)}`));
  return out;
}

async function main(): Promise<void> {
  const cwd = process.cwd();
  const outDir = path.join(cwd, "results", "electorate", "backtest");
  fs.mkdirSync(outDir, { recursive: true });

  // Load the canonical benchmark file.
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
    const benchmark = liftYearBenchmark(yearBlock);

    const t0 = Date.now();
    const { respondents } = await loadSurveyRespondents({
      filePath,
      year: target.year,
      rowLimit: null,
      keepRawVarPayload: false,
    });
    const durationMs = Date.now() - t0;

    const aggregate = buildYearAggregate(target.year, respondents, benchmark);
    const checks = runYearInvariants(target.year, aggregate);
    const passed = checks.filter(c => c.passed).length;
    totalChecks += checks.length;
    totalPassed += passed;

    console.log(`  n=${aggregate.n_respondents.toLocaleString()} duration=${(durationMs / 1000).toFixed(1)}s checks=${passed}/${checks.length}`);
    console.log(`  weighted shares (of total weight): D=${pct(aggregate.shares_of_total_weight.D)} R=${pct(aggregate.shares_of_total_weight.R)} Other=${pct(aggregate.shares_of_total_weight.Other)} Abstain=${pct(aggregate.shares_of_total_weight.Abstain)} Unknown=${pct(aggregate.shares_of_total_weight.Unknown)}`);
    console.log(`  benchmark VEP shares          : D=${pct(benchmark.d_share_of_vep)} R=${pct(benchmark.r_share_of_vep)} Other=${pct(benchmark.other_share_of_vep)} Abstain=${pct(benchmark.abstain_share_of_vep)}`);
    console.log(`  VEP-share gap (survey−bench)   : D=${pp(aggregate.gaps_pp_vs_vep_benchmark.d_share_of_vep_gap_pp)} R=${pp(aggregate.gaps_pp_vs_vep_benchmark.r_share_of_vep_gap_pp)} Other=${pp(aggregate.gaps_pp_vs_vep_benchmark.other_share_of_vep_gap_pp)} Abstain=${pp(aggregate.gaps_pp_vs_vep_benchmark.abstain_share_of_vep_gap_pp)} turnout=${pp(aggregate.gaps_pp_vs_vep_benchmark.turnout_share_of_vep_gap_pp)}`);
    if (aggregate.gaps_pp_vs_known_voter_benchmark) {
      const k = aggregate.gaps_pp_vs_known_voter_benchmark;
      console.log(`  known-voter share gap (vs FEC %): D=${pp(k.d_share_known_voter_gap_pp)} R=${pp(k.r_share_known_voter_gap_pp)} Other=${pp(k.other_share_known_voter_gap_pp)}`);
    }
    for (const c of checks) {
      const mark = c.passed ? "✓" : "✗";
      console.log(`    ${mark} ${c.id}. ${c.label} — ${c.detail}`);
    }

    results.push({
      year: target.year,
      source_file: target.filePath,
      file_present: true,
      duration_ms: durationMs,
      aggregate,
      invariant_checks: checks,
      overall_pass: checks.every(c => c.passed),
    });
  }

  // ── JSON output
  const jsonOut = {
    schema_version: "v0.1",
    run_at: new Date().toISOString(),
    benchmark_source: BENCHMARK_PATH,
    benchmark_schema_version: benchRaw?.schema_version ?? null,
    description: "Observed weighted survey-vote aggregates per year, vs official FEC + USEP/UF benchmarks. Sanity-check only; no prediction, no tuning, no mapper. Unknown bucket retained explicitly.",
    years: results,
    aggregate: {
      total_checks: totalChecks,
      total_passed: totalPassed,
      all_passed: totalPassed === totalChecks && totalChecks > 0,
      years_with_file_present: results.filter(r => r.file_present).length,
      years_skipped: results.filter(r => !r.file_present).map(r => r.year),
    },
  };
  const jsonPath = path.join(outDir, "observed-survey-aggregate.json");
  fs.writeFileSync(jsonPath, JSON.stringify(jsonOut, null, 2));

  // ── Markdown summary
  let md = `# Observed Survey Aggregate — Multi-Year Sanity Check\n\n`;
  md += `**Run at:** ${new Date().toISOString()}\n`;
  md += `**Benchmark source:** \`${BENCHMARK_PATH}\` (schema ${benchRaw?.schema_version ?? "unknown"})\n`;
  md += `**Years targeted:** ${YEAR_TARGETS.map(t => t.year).join(", ")}\n\n`;
  md += `**Scope.** Read-only. Loads CCES/CES microdata, computes weighted observed vote-choice shares, compares to FEC + USEP/UF benchmarks. **No prediction, no scorer, no mapper, no tuning.** Unknown bucket is retained as its own share — never redistributed.\n\n`;

  md += `## Cross-year roll-up — share-of-VEP gaps (survey − benchmark, pp)\n\n`;
  md += `| Year | n | Survey D | Bench D | D gap | Survey R | Bench R | R gap | Survey Abstain | Bench Abstain | Abstain gap | Survey Unknown | abs(D)+abs(R)+abs(O)+abs(Abst) |\n`;
  md += `|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|\n`;
  for (const r of results) {
    if (!r.file_present || !r.aggregate) continue;
    const a = r.aggregate;
    const g = a.gaps_pp_vs_vep_benchmark;
    md += `| ${r.year} | ${a.n_respondents.toLocaleString()} | ${pct(a.shares_of_total_weight.D)} | ${pct(a.benchmark.d_share_of_vep)} | ${pp(g.d_share_of_vep_gap_pp)} | ${pct(a.shares_of_total_weight.R)} | ${pct(a.benchmark.r_share_of_vep)} | ${pp(g.r_share_of_vep_gap_pp)} | ${pct(a.shares_of_total_weight.Abstain)} | ${pct(a.benchmark.abstain_share_of_vep)} | ${pp(g.abstain_share_of_vep_gap_pp)} | ${pct(a.shares_of_total_weight.Unknown)} | ${g.abs_gap_sum_pp.toFixed(2)}pp |\n`;
  }
  md += `\n`;

  md += `## Cross-year roll-up — known-voter conditional shares (survey vs FEC % of total)\n\n`;
  md += `Denominator for survey side is **D + R + Other weight** (excludes Unknown and Abstain). Benchmark side is FEC's published share of total presidential vote.\n\n`;
  md += `| Year | Survey D | FEC D | D gap | Survey R | FEC R | R gap | Survey Other | FEC Other | Other gap |\n`;
  md += `|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|\n`;
  for (const r of results) {
    if (!r.file_present || !r.aggregate || !r.aggregate.known_voter_shares || !r.aggregate.gaps_pp_vs_known_voter_benchmark) continue;
    const a = r.aggregate;
    const k = a.known_voter_shares!;
    const kg = a.gaps_pp_vs_known_voter_benchmark!;
    md += `| ${r.year} | ${pct(k.D)} | ${pct(a.benchmark.d_share_of_total)} | ${pp(kg.d_share_known_voter_gap_pp)} | ${pct(k.R)} | ${pct(a.benchmark.r_share_of_total)} | ${pp(kg.r_share_known_voter_gap_pp)} | ${pct(k.Other)} | ${pct(a.benchmark.other_share_of_total)} | ${pp(kg.other_share_known_voter_gap_pp)} |\n`;
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
    const a = r.aggregate!;
    md += `- Duration: ${(r.duration_ms! / 1000).toFixed(1)}s\n`;
    md += `- Respondents loaded: **${a.n_respondents.toLocaleString()}**\n`;
    md += `- Total weight: ${a.total_weight.toFixed(0)} (range ${a.weight_min.toFixed(4)} → ${a.weight_max.toFixed(4)})\n\n`;
    md += `**Weighted observed counts**: D=${a.weighted_counts.D.toFixed(0)}, R=${a.weighted_counts.R.toFixed(0)}, Other=${a.weighted_counts.Other.toFixed(0)}, Abstain=${a.weighted_counts.Abstain.toFixed(0)}, Unknown=${a.weighted_counts.Unknown.toFixed(0)}\n\n`;
    md += `**Survey-implied shares of total weight**: D=${pct(a.shares_of_total_weight.D)}, R=${pct(a.shares_of_total_weight.R)}, Other=${pct(a.shares_of_total_weight.Other)}, Abstain=${pct(a.shares_of_total_weight.Abstain)}, Unknown=${pct(a.shares_of_total_weight.Unknown)}\n\n`;
    md += `**Survey-implied turnout (D+R+Other)/total**: ${pct(a.turnout_share_implied)}; abstain ${pct(a.abstain_share_implied)}; unknown ${pct(a.unknown_share_implied)}\n\n`;
    if (a.known_voter_shares) {
      md += `**Known-voter conditional (denom excludes Unknown + Abstain)**: D=${pct(a.known_voter_shares.D)}, R=${pct(a.known_voter_shares.R)}, Other=${pct(a.known_voter_shares.Other)}\n\n`;
    }
    md += `**Benchmark (FEC + USEP/UF)**: VEP=${a.benchmark.vep.toLocaleString()}; D=${a.benchmark.d_votes.toLocaleString()} (${pct(a.benchmark.d_share_of_vep)} VEP); R=${a.benchmark.r_votes.toLocaleString()} (${pct(a.benchmark.r_share_of_vep)} VEP); Other=${a.benchmark.other_votes.toLocaleString()} (${pct(a.benchmark.other_share_of_vep)} VEP); Abstain=${a.benchmark.abstentions_presidential.toLocaleString()} (${pct(a.benchmark.abstain_share_of_vep)} VEP); turnout=${pct(a.benchmark.turnout_share_of_vep_presidential)}\n\n`;
    md += `**Gaps vs benchmark (pp, survey − benchmark)**:\n`;
    md += `- D share of VEP: ${pp(a.gaps_pp_vs_vep_benchmark.d_share_of_vep_gap_pp)}\n`;
    md += `- R share of VEP: ${pp(a.gaps_pp_vs_vep_benchmark.r_share_of_vep_gap_pp)}\n`;
    md += `- Other share of VEP: ${pp(a.gaps_pp_vs_vep_benchmark.other_share_of_vep_gap_pp)}\n`;
    md += `- Abstain share of VEP: ${pp(a.gaps_pp_vs_vep_benchmark.abstain_share_of_vep_gap_pp)}\n`;
    md += `- Turnout share of VEP: ${pp(a.gaps_pp_vs_vep_benchmark.turnout_share_of_vep_gap_pp)}\n`;
    md += `- abs-gap-sum (D+R+Other+Abstain): ${a.gaps_pp_vs_vep_benchmark.abs_gap_sum_pp.toFixed(2)}pp\n\n`;
    if (a.gaps_pp_vs_known_voter_benchmark) {
      md += `**Known-voter conditional gaps (vs FEC % of total presidential vote)**:\n`;
      md += `- D: ${pp(a.gaps_pp_vs_known_voter_benchmark.d_share_known_voter_gap_pp)}\n`;
      md += `- R: ${pp(a.gaps_pp_vs_known_voter_benchmark.r_share_known_voter_gap_pp)}\n`;
      md += `- Other: ${pp(a.gaps_pp_vs_known_voter_benchmark.other_share_known_voter_gap_pp)}\n`;
      md += `- abs-gap-sum: ${a.gaps_pp_vs_known_voter_benchmark.abs_gap_sum_pp.toFixed(2)}pp\n\n`;
    }
    md += `**Unknown handling**: ${a.unknown_handling_note}\n\n`;
    md += `| # | Check | Pass | Detail |\n|---|---|:--:|---|\n`;
    for (const c of r.invariant_checks!) {
      md += `| ${c.id} | ${c.label} | ${c.passed ? "✓" : "✗"} | ${c.detail} |\n`;
    }
    md += `\n**Year ${r.year} overall: ${r.overall_pass ? "✓ ALL PASS" : "✗ FAIL"}** (${r.invariant_checks!.filter(c => c.passed).length}/${r.invariant_checks!.length})\n\n`;
  }

  md += `## Aggregate\n\n`;
  md += `- Total invariant checks across all years: **${totalPassed}/${totalChecks}**\n`;
  md += `- Years with file present (loaded): ${jsonOut.aggregate.years_with_file_present}\n`;
  md += `- Years skipped (file not present): ${jsonOut.aggregate.years_skipped.join(", ") || "(none)"}\n\n`;

  md += `## What this aggregate is, and is not\n\n`;
  md += `- ✓ Loads survey microdata via the existing loader; produces weighted observed shares\n`;
  md += `- ✓ Compares to official FEC + USEP/UF benchmark from \`benchmarks-2008-2024.json\`\n`;
  md += `- ✓ Retains the Unknown bucket as a first-class share (never redistributed)\n`;
  md += `- ✗ NOT a prediction — no model, no signature, no scorer, no mapper\n`;
  md += `- ✗ NOT a tuning loop — gaps are evidence (nonresponse, weight frame, self-report bias), not "errors to close"\n`;
  md += `- ✗ Does NOT modify benchmarks, candidate signatures, era-context, EIG/selector files, or browser/dist outputs\n`;

  fs.writeFileSync(path.join(outDir, "observed-survey-aggregate.md"), md);

  // Verify JSON parses
  try {
    JSON.parse(fs.readFileSync(jsonPath, "utf8"));
    console.log("\nJSON valid");
  } catch (e) {
    console.error("JSON did not parse:", e);
    process.exit(3);
  }

  console.log(`\nWrote ${jsonPath}`);
  console.log(`Wrote ${path.join(outDir, "observed-survey-aggregate.md")}`);
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
