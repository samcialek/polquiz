/**
 * Error reporter smoke test.
 *
 * Three test cases verify reporter behavior with synthetic CoalitionGateResult
 * inputs (constructed inline; no dependency on the C2/C3 stack at runtime so
 * C4 is tested in isolation):
 *
 *   Test 1 — One subgroup share miss (white-college D +20pp).
 *     Expects: 1 failure row, severity=moderate (20pp / 7pp = 2.86x → moderate),
 *     diagnoses include mapper_error + candidate_signature_error +
 *     vote_formula_error (realignment cell), top-level hypotheses noting the
 *     realignment-cell concentration.
 *
 *   Test 2 — Missing prediction.
 *     Expects: 1 failure row, isMissingData=true, single diagnosis
 *     benchmark_or_coverage_issue (high confidence).
 *
 *   Test 3 — Severe multi-subgroup failure.
 *     Expects: 6 failure rows, severities sorted severe → moderate → minor,
 *     top-level hypotheses naming systematic D over-prediction AND
 *     realignment-cell concentration.
 *
 * No CES/ANES, no real exit-poll data — synthetic inputs only.
 *
 * Usage: npx tsx src/electorate/errorReporterSmoke.ts
 *
 * Outputs:
 *   results/electorate/feedback/test-1-single-miss.json
 *   results/electorate/feedback/test-2-missing-prediction.json
 *   results/electorate/feedback/test-3-severe-multi.json
 *   results/electorate/feedback/summary.md
 */

import * as fs from "fs";
import * as path from "path";
import { buildErrorReport, type ErrorReport, type DiagnosisCategory } from "./errorReporter.js";
import type { CoalitionGateResult, SubgroupCheck } from "./coalitionGate.js";

function pct(x: number): string { return (x * 100).toFixed(1) + "%"; }
function ppSign(x: number): string { return (x >= 0 ? "+" : "") + x.toFixed(1) + "pp"; }

/** Build a passed-metric subgroup check (for filler in the gate input). */
function passedSubgroup(
  name: string,
  predicted: { D: number; R: number },
  benchmark: { D: number; R: number },
): SubgroupCheck {
  return {
    subgroup: name,
    hasBenchmark: true,
    hasPrediction: true,
    passed: true,
    benchmarkSource: "synthetic-mirror",
    shareOfElectorate: 0.1,
    metrics: [
      {
        metric: "D",
        predicted: predicted.D, benchmark: benchmark.D,
        deltaPp: (predicted.D - benchmark.D) * 100,
        tolerancePp: 7, passed: true,
      },
      {
        metric: "R",
        predicted: predicted.R, benchmark: benchmark.R,
        deltaPp: (predicted.R - benchmark.R) * 100,
        tolerancePp: 7, passed: true,
      },
    ],
  };
}

/** Build a metric-failed subgroup check at a specified delta. */
function failingSubgroup(
  name: string,
  metric: "D" | "R",
  predicted: number,
  benchmark: number,
  tolerancePp = 7,
): SubgroupCheck {
  const deltaPp = (predicted - benchmark) * 100;
  return {
    subgroup: name,
    hasBenchmark: true,
    hasPrediction: true,
    passed: false,
    benchmarkSource: "synthetic-perturbed",
    shareOfElectorate: 0.1,
    metrics: [
      {
        metric, predicted, benchmark, deltaPp, tolerancePp,
        passed: Math.abs(deltaPp) <= tolerancePp,
      },
    ],
  };
}

/** Build a missing-prediction subgroup check (benchmark exists, simulator produced nothing). */
function missingPredictionSubgroup(name: string): SubgroupCheck {
  return {
    subgroup: name,
    hasBenchmark: true,
    hasPrediction: false,
    passed: false,
    metrics: [],
    missingReason: "no_prediction",
    benchmarkSource: "synthetic-orphan",
  };
}

function syntheticGate(year: number, subs: SubgroupCheck[]): CoalitionGateResult {
  const totalChecked = subs.filter(s => s.metrics.length > 0).length;
  const passedCount = subs.filter(s => s.passed).length;
  return {
    year,
    passed: subs.every(s => s.passed),
    subgroups: subs,
    overall: {
      totalChecked,
      passedCount,
      failedCount: subs.length - passedCount,
      missingBenchmarks: [],
      missingPredictions: subs.filter(s => s.missingReason === "no_prediction").map(s => s.subgroup),
    },
    config: {
      metrics: ["D", "R"],
      defaultTolerancePp: 7,
      requireFullBenchmarkCoverage: false,
      requireFullPredictionCoverage: true,
    },
    meta: { runAt: new Date().toISOString() },
  };
}

function summarizeReport(label: string, r: ErrorReport): string {
  const lines: string[] = [];
  lines.push(`### ${label}`);
  lines.push("");
  lines.push(`**Failures: ${r.summary.totalFailures}** — severe ${r.summary.severeCount}, moderate ${r.summary.moderateCount}, minor ${r.summary.minorCount}, coverage ${r.summary.coverageIssueCount}.`);
  lines.push("");
  if (r.topLevelHypotheses.length) {
    lines.push("**Top-level hypotheses:**");
    for (const h of r.topLevelHypotheses) lines.push(`- ${h}`);
    lines.push("");
  }
  lines.push("| Severity | Subgroup | Metric | Predicted | Benchmark | Δ | Top diagnosis | Confidence |");
  lines.push("|---|---|---|---:|---:|---:|---|---|");
  for (const f of r.failures) {
    const top = f.diagnoses[0];
    const pred = f.predicted == null ? "—" : pct(f.predicted);
    const bench = f.benchmark == null ? "—" : pct(f.benchmark);
    const delta = f.deltaPp == null ? "—" : ppSign(f.deltaPp);
    const metric = f.metric ?? (f.isMissingData ? "(coverage)" : "—");
    lines.push(`| ${f.severity} | ${f.subgroup} | ${metric} | ${pred} | ${bench} | ${delta} | ${top?.category ?? "—"} | ${top?.confidence ?? "—"} |`);
  }
  lines.push("");
  return lines.join("\n");
}

function main() {
  const outDir = path.resolve("results/electorate/feedback");
  fs.mkdirSync(outDir, { recursive: true });

  // ── Test 1 — single subgroup share miss ─────────────────────────────────
  const gate1 = syntheticGate(2020, [
    passedSubgroup("race:white", { D: 0.45, R: 0.55 }, { D: 0.45, R: 0.55 }),
    passedSubgroup("race:Black", { D: 0.85, R: 0.15 }, { D: 0.85, R: 0.15 }),
    passedSubgroup("white-non-college", { D: 0.40, R: 0.60 }, { D: 0.40, R: 0.60 }),
    failingSubgroup("white-college", "D", 0.71, 0.51), // +20pp delta
  ]);
  const report1 = buildErrorReport(gate1);
  fs.writeFileSync(path.join(outDir, "test-1-single-miss.json"), JSON.stringify(report1, null, 2));

  // ── Test 2 — missing prediction ─────────────────────────────────────────
  const gate2 = syntheticGate(2020, [
    passedSubgroup("race:white", { D: 0.42, R: 0.58 }, { D: 0.42, R: 0.58 }),
    missingPredictionSubgroup("race:Asian"),
  ]);
  const report2 = buildErrorReport(gate2);
  fs.writeFileSync(path.join(outDir, "test-2-missing-prediction.json"), JSON.stringify(report2, null, 2));

  // ── Test 3 — severe multi-subgroup failure ──────────────────────────────
  // Six failures, all with predicted D > benchmark D, multiple realignment cells.
  // Tolerance ±7pp; deltas chosen to hit each severity bucket cleanly.
  const gate3 = syntheticGate(2020, [
    failingSubgroup("white-college",     "D", 0.75, 0.51), // +24pp severe
    failingSubgroup("white-non-college", "D", 0.55, 0.30), // +25pp severe
    failingSubgroup("race:Latino",       "D", 0.78, 0.55), // +23pp severe
    failingSubgroup("race:Asian",        "D", 0.70, 0.55), // +15pp moderate
    failingSubgroup("age:18-29",         "D", 0.74, 0.62), // +12pp moderate (12pp/7pp = 1.71x > 1.5)
    failingSubgroup("age:65+",           "D", 0.50, 0.42), //  +8pp minor (8pp/7pp = 1.14x ≤ 1.5)
    passedSubgroup("evangelical", { D: 0.25, R: 0.75 }, { D: 0.25, R: 0.75 }),
  ]);
  const report3 = buildErrorReport(gate3);
  fs.writeFileSync(path.join(outDir, "test-3-severe-multi.json"), JSON.stringify(report3, null, 2));

  // ── Invariant checks ────────────────────────────────────────────────────
  type Check = { name: string; pass: boolean; detail: string };
  const checks: Check[] = [];
  const hasCategory = (r: ErrorReport, idx: number, cat: DiagnosisCategory) =>
    r.failures[idx]?.diagnoses.some(d => d.category === cat) ?? false;

  // Test 1 invariants
  checks.push({
    name: "T1: exactly one failure row",
    pass: report1.failures.length === 1,
    detail: `failures=${report1.failures.length}`,
  });
  checks.push({
    name: "T1: failure subgroup is white-college on metric D",
    pass: report1.failures[0]?.subgroup === "white-college" && report1.failures[0]?.metric === "D",
    detail: `${report1.failures[0]?.subgroup}/${report1.failures[0]?.metric}`,
  });
  // 20pp / 7pp = 2.857 → moderate (between 1.5 and 3)
  checks.push({
    name: "T1: severity is moderate (20pp / 7pp = 2.86x)",
    pass: report1.failures[0]?.severity === "moderate",
    detail: `severity=${report1.failures[0]?.severity}`,
  });
  checks.push({
    name: "T1: diagnoses include mapper_error + candidate_signature_error + vote_formula_error",
    pass: hasCategory(report1, 0, "mapper_error")
      && hasCategory(report1, 0, "candidate_signature_error")
      && hasCategory(report1, 0, "vote_formula_error"),
    detail: `categories=${report1.failures[0]?.diagnoses.map(d => d.category).join(",")}`,
  });
  checks.push({
    name: "T1: at least one recommendation step is produced",
    pass: (report1.failures[0]?.recommendedInspection.length ?? 0) > 0,
    detail: `steps=${report1.failures[0]?.recommendedInspection.length ?? 0}`,
  });

  // Test 2 invariants
  checks.push({
    name: "T2: exactly one failure row, isMissingData=true",
    pass: report2.failures.length === 1 && report2.failures[0]?.isMissingData === true,
    detail: `failures=${report2.failures.length} missing=${report2.failures[0]?.isMissingData}`,
  });
  checks.push({
    name: "T2: missingDataKind is no_prediction",
    pass: report2.failures[0]?.missingDataKind === "no_prediction",
    detail: `kind=${report2.failures[0]?.missingDataKind}`,
  });
  checks.push({
    name: "T2: only diagnosis is benchmark_or_coverage_issue (high)",
    pass: report2.failures[0]?.diagnoses.length === 1
      && report2.failures[0]?.diagnoses[0].category === "benchmark_or_coverage_issue"
      && report2.failures[0]?.diagnoses[0].confidence === "high",
    detail: `diagnoses=${report2.failures[0]?.diagnoses.map(d => `${d.category}/${d.confidence}`).join(",")}`,
  });
  checks.push({
    name: "T2: coverageIssueCount is 1",
    pass: report2.summary.coverageIssueCount === 1,
    detail: `coverage=${report2.summary.coverageIssueCount}`,
  });

  // Test 3 invariants
  checks.push({
    name: "T3: 6 failure rows total",
    pass: report3.failures.length === 6,
    detail: `failures=${report3.failures.length}`,
  });
  checks.push({
    name: "T3: severities sort severe → moderate → minor",
    pass: (() => {
      const order = report3.failures.map(f => ["severe","moderate","minor"].indexOf(f.severity));
      for (let i = 1; i < order.length; i++) if (order[i] < order[i-1]) return false;
      return true;
    })(),
    detail: `order=${report3.failures.map(f => f.severity).join(",")}`,
  });
  checks.push({
    name: "T3: 3 severe + 2 moderate + 1 minor",
    pass: report3.summary.severeCount === 3
      && report3.summary.moderateCount === 2
      && report3.summary.minorCount === 1,
    detail: `severe=${report3.summary.severeCount} mod=${report3.summary.moderateCount} minor=${report3.summary.minorCount}`,
  });
  checks.push({
    name: "T3: top-level hypothesis names systematic D over-prediction",
    pass: report3.topLevelHypotheses.some(h =>
      h.includes("Predicted D share exceeds benchmark") && h.includes("over-attractive"),
    ),
    detail: `hypotheses=${report3.topLevelHypotheses.length}`,
  });
  checks.push({
    name: "T3: top-level hypothesis names realignment-cell concentration",
    pass: report3.topLevelHypotheses.some(h =>
      h.includes("realignment cell") && h.includes("mapper_error"),
    ),
    detail: `hypotheses present: ${report3.topLevelHypotheses.length > 0}`,
  });

  // ── Summary markdown ────────────────────────────────────────────────────
  const md: string[] = [];
  md.push("# Error Reporter Smoke");
  md.push("");
  md.push(`Run at ${new Date().toISOString()}. Synthetic gate inputs only.`);
  md.push("");
  md.push("Three test cases verify the reporter under: a single moderate miss, a missing-prediction coverage issue, and a severe multi-subgroup failure with cross-pattern hypotheses.");
  md.push("");
  md.push("## Invariant checks");
  md.push("");
  md.push("| # | Check | Pass | Detail |");
  md.push("|---|---|:--:|---|");
  checks.forEach((c, i) => md.push(`| ${i + 1} | ${c.name} | ${c.pass ? "✓" : "✗"} | ${c.detail} |`));
  md.push("");
  const allPass = checks.every(c => c.pass);
  md.push(`**Overall: ${allPass ? "✓ ALL PASS" : "✗ SOME FAILED"}** (${checks.filter(c => c.pass).length}/${checks.length})`);
  md.push("");
  md.push(summarizeReport("Test 1 — single subgroup share miss", report1));
  md.push(summarizeReport("Test 2 — missing prediction", report2));
  md.push(summarizeReport("Test 3 — severe multi-subgroup failure", report3));

  const summaryPath = path.join(outDir, "summary.md");
  fs.writeFileSync(summaryPath, md.join("\n"));

  console.log(md.join("\n"));
  console.log(`\nWrote: ${path.join(outDir, "test-1-single-miss.json")}`);
  console.log(`Wrote: ${path.join(outDir, "test-2-missing-prediction.json")}`);
  console.log(`Wrote: ${path.join(outDir, "test-3-severe-multi.json")}`);
  console.log(`Wrote: ${summaryPath}`);

  if (!allPass) process.exit(1);
}

main();
