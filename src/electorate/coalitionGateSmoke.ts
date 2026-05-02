/**
 * Coalition gate smoke test.
 *
 * Three test cases verify gate behavior with synthetic benchmarks:
 *
 *   Test A — All-pass: synthesize benchmarks that exactly match the predicted
 *   shares. Every subgroup should pass within ±7pp default tolerance.
 *
 *   Test F — One-fail: take Test A's benchmarks, push white-college's D
 *   share by +20pp. Gate should fail overall, with white-college flagged
 *   as the failing subgroup, other subgroups still passing.
 *
 *   Test M — Missing-data: provide benchmarks for some predicted subgroups
 *   PLUS benchmarks for subgroups not in the prediction. Gate should:
 *     - flag predicted-but-not-benchmarked as missingBenchmarks (passing
 *       by default since requireFullBenchmarkCoverage=false)
 *     - flag benchmarked-but-not-predicted as missingPredictions and FAIL
 *       them (since requireFullPredictionCoverage=true)
 *
 * No CES/ANES, no exit-poll data — synthetic benchmarks only.
 *
 * Usage: npx tsx src/electorate/coalitionGateSmoke.ts
 *
 * Outputs:
 *   results/electorate/gate/test-A-all-pass.json
 *   results/electorate/gate/test-F-one-fail.json
 *   results/electorate/gate/test-M-missing-data.json
 *   results/electorate/gate/summary.md
 */

import * as fs from "fs";
import * as path from "path";
import { ARCHETYPES } from "../config/archetypes.js";
import { simulateElectorate } from "./electorateSimulator.js";
import { agentFromArchetype } from "./syntheticAgents.js";
import { decomposeByCoalition, type CoalitionDecomposition } from "./coalitionDecomposition.js";
import { evaluateCoalitionGate, type SubgroupBenchmark, type CoalitionGateResult } from "./coalitionGate.js";
import type { WeightedAgent, AgentDemographics } from "./types.js";

const TARGET_YEAR = 2020;
const DEACTIVATED = new Set(["019", "023", "025"]);

function pct(x: number): string { return (x * 100).toFixed(1) + "%"; }
function ppSign(x: number): string { return (x >= 0 ? "+" : "") + x.toFixed(1) + "pp"; }

function syntheticDemographicsFor(archetypeId: string): AgentDemographics {
  const n = parseInt(archetypeId, 10) || 0;
  const races = ["white","white","white","white","white","white","Black","Latino","Latino","Asian"];
  const educations = ["college","college","non-college","non-college","non-college"];
  const ageGroups = ["18-29","30-44","30-44","45-64","45-64","45-64","65+"];
  return {
    race: races[n % races.length] as AgentDemographics["race"],
    education: educations[(n * 7) % educations.length] as AgentDemographics["education"],
    ageGroup: ageGroups[(n * 11) % ageGroups.length] as AgentDemographics["ageGroup"],
  };
}

function buildAgents(): WeightedAgent[] {
  return ARCHETYPES.filter(a => !DEACTIVATED.has(a.id)).map(arc => {
    const a = agentFromArchetype(arc, { electionYear: TARGET_YEAR, weight: 1, source: "SYNTHETIC-GATE" });
    return { ...a, demographics: syntheticDemographicsFor(arc.id) };
  });
}

/**
 * Build synthetic benchmarks that exactly mirror the predicted shares of
 * a given decomposition. Useful as the "all-pass" baseline.
 */
function benchmarksFromPredicted(decomp: CoalitionDecomposition): SubgroupBenchmark[] {
  return decomp.subgroups.map(s => ({
    subgroup: s.subgroup,
    byParty: {
      D: s.byParty.D.voteShareOfTurnout,
      R: s.byParty.R.voteShareOfTurnout,
    },
    source: "synthetic-mirror",
  }));
}

function summarizeGate(label: string, result: CoalitionGateResult): string {
  const lines: string[] = [];
  lines.push(`### ${label}`);
  lines.push("");
  lines.push(`**Overall: ${result.passed ? "✓ PASS" : "✗ FAIL"}** — ${result.overall.passedCount} passed, ${result.overall.failedCount} failed across ${result.subgroups.length} subgroups (${result.overall.totalChecked} actually metric-checked).`);
  if (result.overall.missingBenchmarks.length) {
    lines.push("");
    lines.push(`Missing benchmarks (predicted, no benchmark provided): ${result.overall.missingBenchmarks.length} — ${result.overall.missingBenchmarks.slice(0, 6).join(", ")}${result.overall.missingBenchmarks.length > 6 ? ", …" : ""}`);
  }
  if (result.overall.missingPredictions.length) {
    lines.push("");
    lines.push(`Missing predictions (benchmark exists, no subgroup in decomposition): ${result.overall.missingPredictions.length} — ${result.overall.missingPredictions.join(", ")}`);
  }
  lines.push("");
  lines.push("| Subgroup | Pass | Status | Metrics |");
  lines.push("|---|:--:|---|---|");
  for (const s of result.subgroups) {
    let status = "";
    let metricsCol = "";
    if (s.missingReason === "no_benchmark") status = "no benchmark";
    else if (s.missingReason === "no_prediction") status = "no prediction";
    else if (s.metrics.length === 0) status = "no metrics matched";
    else {
      status = s.passed ? "OK" : "delta exceeds tolerance";
      metricsCol = s.metrics.map(m => {
        const mark = m.passed ? "✓" : "✗";
        return `${m.metric} pred=${pct(m.predicted)} bench=${pct(m.benchmark)} Δ=${ppSign(m.deltaPp)} (tol ±${m.tolerancePp}pp) ${mark}`;
      }).join("<br>");
    }
    lines.push(`| ${s.subgroup} | ${s.passed ? "✓" : "✗"} | ${status} | ${metricsCol} |`);
  }
  lines.push("");
  return lines.join("\n");
}

function main() {
  const outDir = path.resolve("results/electorate/gate");
  fs.mkdirSync(outDir, { recursive: true });

  // Build a single decomposition the three tests share.
  const agents = buildAgents();
  const sim = simulateElectorate({ year: TARGET_YEAR, agents });
  const decomp = decomposeByCoalition(sim, agents);

  // ── Test A — all-pass benchmarks (mirror predicted) ──────────────────────
  const benchA = benchmarksFromPredicted(decomp);
  const gateA = evaluateCoalitionGate(decomp, benchA);
  fs.writeFileSync(path.join(outDir, "test-A-all-pass.json"), JSON.stringify(gateA, null, 2));

  // ── Test F — one fail (push white-college D by +20pp out of tolerance) ───
  const benchF: SubgroupBenchmark[] = benchA.map(b => ({ ...b, byParty: { ...b.byParty } }));
  const wcIdx = benchF.findIndex(b => b.subgroup === "white-college");
  if (wcIdx === -1) throw new Error("white-college subgroup missing from synthetic decomposition");
  const wc = benchF[wcIdx];
  const wcD = wc.byParty?.D ?? 0;
  const wcR = wc.byParty?.R ?? 0;
  // Push D down by 20pp (so prediction is 20pp HIGHER than benchmark) — clearly out of ±7.
  benchF[wcIdx] = { ...wc, byParty: { D: Math.max(0, wcD - 0.20), R: Math.min(1, wcR + 0.20) }, source: "synthetic-perturbed-white-college" };
  const gateF = evaluateCoalitionGate(decomp, benchF);
  fs.writeFileSync(path.join(outDir, "test-F-one-fail.json"), JSON.stringify(gateF, null, 2));

  // ── Test M — missing-data: drop some benchmarks, add a fake one ──────────
  // Take the all-pass benchmarks but drop "race:Black" and "race:Latino";
  // also add "race:NotARealRace" with arbitrary numbers (not in the decomposition).
  const benchM: SubgroupBenchmark[] = benchA
    .filter(b => b.subgroup !== "race:Black" && b.subgroup !== "race:Latino")
    .concat([{
      subgroup: "race:NotARealRace",
      byParty: { D: 0.55, R: 0.45 },
      source: "synthetic-fake-subgroup",
    }]);
  const gateM = evaluateCoalitionGate(decomp, benchM);
  fs.writeFileSync(path.join(outDir, "test-M-missing-data.json"), JSON.stringify(gateM, null, 2));

  // ── Invariant checks ────────────────────────────────────────────────────
  type Check = { name: string; pass: boolean; detail: string };
  const checks: Check[] = [];

  // A1. All-pass gate passes overall.
  checks.push({
    name: "A: all-pass gate passes overall",
    pass: gateA.passed,
    detail: `passed=${gateA.passed} failedCount=${gateA.overall.failedCount}`,
  });
  // A2. All metric-checked subgroups in test A pass.
  const aFails = gateA.subgroups.filter(s => s.metrics.length > 0 && !s.passed);
  checks.push({
    name: "A: zero metric-checked subgroups fail",
    pass: aFails.length === 0,
    detail: `failedSubgroups=${aFails.map(s => s.subgroup).join(",") || "(none)"}`,
  });
  // A3. All metric-check deltas are 0 (mirror benchmarks).
  const aMaxAbsDelta = Math.max(0, ...gateA.subgroups.flatMap(s => s.metrics.map(m => Math.abs(m.deltaPp))));
  checks.push({
    name: "A: max |delta| across all metrics is ~0",
    pass: aMaxAbsDelta < 1e-6,
    detail: `maxAbsDelta=${aMaxAbsDelta.toExponential(2)}pp`,
  });

  // F1. One-fail gate fails overall.
  checks.push({
    name: "F: one-fail gate fails overall",
    pass: !gateF.passed,
    detail: `passed=${gateF.passed}`,
  });
  // F2. Exactly one subgroup is the failure (white-college), and it fails on D and R.
  const fFails = gateF.subgroups.filter(s => s.metrics.length > 0 && !s.passed);
  checks.push({
    name: "F: exactly one subgroup fails (white-college)",
    pass: fFails.length === 1 && fFails[0].subgroup === "white-college",
    detail: `failedSubgroups=${fFails.map(s => s.subgroup).join(",")}`,
  });
  // F3. The white-college D delta is +20pp (predicted higher than benchmark).
  const fwc = gateF.subgroups.find(s => s.subgroup === "white-college");
  const fwcD = fwc?.metrics.find(m => m.metric === "D");
  checks.push({
    name: "F: white-college D delta is ~+20pp",
    pass: fwcD != null && Math.abs(fwcD.deltaPp - 20) < 0.01,
    detail: `D delta=${fwcD ? ppSign(fwcD.deltaPp) : "missing"}`,
  });
  // F4. All other subgroups still pass (the perturbation was scoped to white-college).
  const fOtherFails = gateF.subgroups.filter(s => s.subgroup !== "white-college" && s.metrics.length > 0 && !s.passed);
  checks.push({
    name: "F: all subgroups other than white-college still pass",
    pass: fOtherFails.length === 0,
    detail: `otherFails=${fOtherFails.map(s => s.subgroup).join(",") || "(none)"}`,
  });

  // M1. Missing-data: race:NotARealRace is in missingPredictions and fails (default coverage requirement).
  const mFakeFlagged = gateM.overall.missingPredictions.includes("race:NotARealRace");
  const mFakeRow = gateM.subgroups.find(s => s.subgroup === "race:NotARealRace");
  checks.push({
    name: "M: missing-prediction subgroup flagged",
    pass: mFakeFlagged && mFakeRow?.passed === false && mFakeRow?.missingReason === "no_prediction",
    detail: `inMissingPredictions=${mFakeFlagged} passed=${mFakeRow?.passed} reason=${mFakeRow?.missingReason}`,
  });
  // M2. Missing-data: race:Black and race:Latino are in missingBenchmarks and pass (default coverage requirement off).
  const mBlackFlagged = gateM.overall.missingBenchmarks.includes("race:Black");
  const mLatinoFlagged = gateM.overall.missingBenchmarks.includes("race:Latino");
  const mBlackRow = gateM.subgroups.find(s => s.subgroup === "race:Black");
  const mLatinoRow = gateM.subgroups.find(s => s.subgroup === "race:Latino");
  checks.push({
    name: "M: missing-benchmark subgroups flagged but pass (default)",
    pass: mBlackFlagged && mLatinoFlagged
      && mBlackRow?.passed === true && mBlackRow?.missingReason === "no_benchmark"
      && mLatinoRow?.passed === true && mLatinoRow?.missingReason === "no_benchmark",
    detail: `Black missingBench=${mBlackFlagged} pass=${mBlackRow?.passed}; Latino missingBench=${mLatinoFlagged} pass=${mLatinoRow?.passed}`,
  });
  // M3. Overall gate fails because of the missing prediction.
  checks.push({
    name: "M: overall gate fails because missing prediction is required",
    pass: !gateM.passed,
    detail: `passed=${gateM.passed}`,
  });

  // ── Summary markdown ────────────────────────────────────────────────────
  const md: string[] = [];
  md.push("# Coalition Gate Smoke");
  md.push("");
  md.push(`Run at ${new Date().toISOString()}. Year: ${TARGET_YEAR}. Synthetic benchmarks only.`);
  md.push("");
  md.push("Three test cases verify gate behavior under: a benchmarks-mirror-predictions baseline, a single-subgroup perturbation, and a mismatched-coverage scenario.");
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
  md.push(summarizeGate("Test A — all-pass mirror benchmarks", gateA));
  md.push(summarizeGate("Test F — white-college D pushed +20pp", gateF));
  md.push(summarizeGate("Test M — partial benchmark coverage", gateM));

  const summaryPath = path.join(outDir, "summary.md");
  fs.writeFileSync(summaryPath, md.join("\n"));

  console.log(md.join("\n"));
  console.log(`\nWrote: ${path.join(outDir, "test-A-all-pass.json")}`);
  console.log(`Wrote: ${path.join(outDir, "test-F-one-fail.json")}`);
  console.log(`Wrote: ${path.join(outDir, "test-M-missing-data.json")}`);
  console.log(`Wrote: ${summaryPath}`);

  if (!allPass) process.exit(1);
}

main();
