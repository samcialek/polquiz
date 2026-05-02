/**
 * Simulator-scaffold smoke test.
 *
 * Three test cases that together prove the weighted-aggregation pipeline
 * works end-to-end with synthetic agents. Does NOT use any CES/ANES data.
 *
 * Test 1 — uniform-weight agents reproduce the original voteModelSmoke.
 *   Each archetype = one agent, weight=1, samples=1 (centroid only).
 *   Should match results/electorate/smoke/{2020,2024}-results.json within
 *   rounding (different code path, same population, same engine).
 *
 * Test 2 — biased weights move the result.
 *   Same agents but D-leaning archetypes (those whose nearest-2020 was
 *   Biden) get weight=1; R-leaning get weight=3. Republican share must
 *   rise vs Test 1; otherwise weighting is broken.
 *
 * Test 3 — multi-sample (N>1) jittered posteriors give a different but
 *   directionally consistent answer.
 *   Each archetype = one agent, weight=1, samples=10 with posSigma=0.4.
 *   Result should be close to Test 1 (jitter is noise around centroid)
 *   but not identical.
 *
 * Usage:
 *   npx tsx src/electorate/scaffoldSmoke.ts
 *
 * Outputs:
 *   results/electorate/scaffold/test{1,2,3}-{2020}.json
 *   results/electorate/scaffold/summary.md
 */

import * as fs from "fs";
import * as path from "path";
import { ARCHETYPES } from "../config/archetypes.js";
import { simulateElectorate } from "./electorateSimulator.js";
import { agentsFromArchetypes, agentFromArchetype, makeRng } from "./syntheticAgents.js";
import type { ElectorateSimulationResult } from "./types.js";

const TARGET_YEAR = 2020;
const DEACTIVATED = new Set(["019", "023", "025"]);

function pct(x: number): string { return (x * 100).toFixed(1) + "%"; }

function summarizeOne(label: string, r: ElectorateSimulationResult): string {
  const lines: string[] = [];
  lines.push(`### ${label}`);
  lines.push("");
  lines.push(`- Total agents: ${r.totalAgents}`);
  lines.push(`- Total samples evaluated: ${r.totalSamples}`);
  lines.push(`- Total weight: ${r.totalWeight.toFixed(2)}`);
  lines.push(`- Turnout rate: ${pct(r.turnoutRate)}`);
  lines.push(`- Avg samples per agent: ${r.meta.avgSamplesPerAgent.toFixed(2)}`);
  lines.push("");
  lines.push("| Bucket | Weighted | Share | Share of turnout |");
  lines.push("|---|---:|---:|---:|");
  for (const k of ["D", "R", "T", "O"] as const) {
    const b = r.byParty[k];
    lines.push(`| ${k} | ${b.weightedVotes.toFixed(2)} | ${pct(b.voteShare)} | ${pct(b.voteShareOfTurnout)} |`);
  }
  lines.push(`| Abstain | ${r.abstain.weightedAbstainers.toFixed(2)} | ${pct(r.abstain.abstainRate)} | — |`);
  lines.push("");
  lines.push("Per-candidate:");
  lines.push("");
  lines.push("| Candidate | Party | Weighted | Share of turnout |");
  lines.push("|---|---|---:|---:|");
  for (const c of r.byCandidate) {
    lines.push(`| ${c.name} | ${c.party} | ${c.weightedVotes.toFixed(2)} | ${pct(c.voteShareOfTurnout)} |`);
  }
  lines.push("");
  return lines.join("\n");
}

// Identify each archetype's "lean" by running it solo through 2020 and
// recording whether nearest-candidate is Democratic or Republican. Used by
// Test 2 to skew weights.
function archetypeLean(): Record<string, "D" | "R" | "T" | "O" | "abstain"> {
  const out: Record<string, "D" | "R" | "T" | "O" | "abstain"> = {};
  for (const arc of ARCHETYPES) {
    if (DEACTIVATED.has(arc.id)) continue;
    const agent = agentFromArchetype(arc, { electionYear: TARGET_YEAR });
    const r = simulateElectorate({ year: TARGET_YEAR, agents: [agent] });
    if (r.abstain.weightedAbstainers > 0.5) { out[arc.id] = "abstain"; continue; }
    let bestKey: "D" | "R" | "T" | "O" = "D";
    let bestVal = -1;
    for (const k of ["D", "R", "T", "O"] as const) {
      if (r.byParty[k].weightedVotes > bestVal) {
        bestVal = r.byParty[k].weightedVotes;
        bestKey = k;
      }
    }
    out[arc.id] = bestKey;
  }
  return out;
}

function main() {
  const outDir = path.resolve("results/electorate/scaffold");
  fs.mkdirSync(outDir, { recursive: true });

  // ── Test 1 — uniform weight, N=1 sample ──────────────────────────────────
  const test1Agents = agentsFromArchetypes({ electionYear: TARGET_YEAR, weight: 1 });
  const test1 = simulateElectorate({ year: TARGET_YEAR, agents: test1Agents });
  fs.writeFileSync(
    path.join(outDir, `test1-uniform-${TARGET_YEAR}.json`),
    JSON.stringify(test1, null, 2),
  );

  // ── Test 2 — bias R-leaning archetypes 3x ────────────────────────────────
  const lean = archetypeLean();
  const test2Agents = agentsFromArchetypes({
    electionYear: TARGET_YEAR,
    weight: arc => (lean[arc.id] === "R" ? 3 : 1),
  });
  const test2 = simulateElectorate({ year: TARGET_YEAR, agents: test2Agents });
  fs.writeFileSync(
    path.join(outDir, `test2-r-biased-${TARGET_YEAR}.json`),
    JSON.stringify(test2, null, 2),
  );

  // ── Test 3 — N=10 jittered samples per agent, uniform weight ─────────────
  const sharedRng = makeRng(20200101);
  const test3Agents = agentsFromArchetypes({
    electionYear: TARGET_YEAR,
    weight: 1,
    samples: 10,
    posSigma: 0.4,
    rng: sharedRng,
  });
  const test3 = simulateElectorate({ year: TARGET_YEAR, agents: test3Agents });
  fs.writeFileSync(
    path.join(outDir, `test3-jittered-${TARGET_YEAR}.json`),
    JSON.stringify(test3, null, 2),
  );

  // ── Aggregation invariants (programmatic sanity) ─────────────────────────
  const checks: { name: string; pass: boolean; detail: string }[] = [];

  // Each test: weighted votes (D+R+T+O+abstain) ≈ totalWeight
  for (const [name, r] of [["test1", test1], ["test2", test2], ["test3", test3]] as const) {
    const sum =
      r.byParty.D.weightedVotes + r.byParty.R.weightedVotes +
      r.byParty.T.weightedVotes + r.byParty.O.weightedVotes +
      r.abstain.weightedAbstainers;
    const diff = Math.abs(sum - r.totalWeight);
    checks.push({
      name: `${name}: weighted sum equals total weight`,
      pass: diff < 1e-6,
      detail: `sum=${sum.toFixed(6)} total=${r.totalWeight.toFixed(6)} diff=${diff.toExponential(2)}`,
    });
  }

  // Test 2: R share must be strictly higher than Test 1 (weighting effect)
  const t1R = test1.byParty.R.voteShareOfTurnout;
  const t2R = test2.byParty.R.voteShareOfTurnout;
  checks.push({
    name: "test2: R-bias raises R share vs uniform",
    pass: t2R > t1R + 0.01,
    detail: `t1.R=${pct(t1R)} t2.R=${pct(t2R)} delta=${pct(t2R - t1R)}`,
  });

  // Test 1: total samples should equal total agents (N=1 each)
  checks.push({
    name: "test1: totalSamples == totalAgents (N=1)",
    pass: test1.totalSamples === test1.totalAgents,
    detail: `samples=${test1.totalSamples} agents=${test1.totalAgents}`,
  });

  // Test 3: total samples should be 10x agents
  checks.push({
    name: "test3: totalSamples == totalAgents * 10",
    pass: test3.totalSamples === test3.totalAgents * 10,
    detail: `samples=${test3.totalSamples} agents=${test3.totalAgents}`,
  });

  // Test 3 vs Test 1: jittered result should be CLOSE but not identical
  const t1D = test1.byParty.D.voteShareOfTurnout;
  const t3D = test3.byParty.D.voteShareOfTurnout;
  const closeEnough = Math.abs(t1D - t3D) < 0.10;
  const notIdentical = Math.abs(t1D - t3D) > 1e-6;
  checks.push({
    name: "test3: jittered D share within 10pt of centroid result",
    pass: closeEnough,
    detail: `t1.D=${pct(t1D)} t3.D=${pct(t3D)} delta=${pct(Math.abs(t1D - t3D))}`,
  });
  checks.push({
    name: "test3: jittered result differs from centroid (jitter actually applies)",
    pass: notIdentical,
    detail: `t1.D=${pct(t1D)} t3.D=${pct(t3D)}`,
  });

  // ── Markdown summary ─────────────────────────────────────────────────────
  const mdLines: string[] = [];
  mdLines.push("# Simulator Scaffold Smoke");
  mdLines.push("");
  mdLines.push(`Run at ${new Date().toISOString()}. Year: ${TARGET_YEAR}.`);
  mdLines.push("");
  mdLines.push("Three test cases over **synthetic agents only** (no CES/ANES). The simulator runs each agent's signature samples through `respondentVoteChoice` and aggregates with population weights. This validates the pipeline plumbing before any real survey data lands.");
  mdLines.push("");
  mdLines.push("## Aggregation invariant checks");
  mdLines.push("");
  mdLines.push("| # | Check | Pass | Detail |");
  mdLines.push("|---|---|:--:|---|");
  checks.forEach((c, i) => {
    mdLines.push(`| ${i + 1} | ${c.name} | ${c.pass ? "✓" : "✗"} | ${c.detail} |`);
  });
  mdLines.push("");
  const allPass = checks.every(c => c.pass);
  mdLines.push(`**Overall: ${allPass ? "✓ ALL PASS" : "✗ SOME FAILED"}**`);
  mdLines.push("");
  mdLines.push(summarizeOne("Test 1 — uniform weight, N=1 sample", test1));
  mdLines.push(summarizeOne("Test 2 — R-leaning archetypes weighted 3×", test2));
  mdLines.push(summarizeOne("Test 3 — jittered posteriors (N=10, σ=0.4)", test3));

  const summaryPath = path.join(outDir, "summary.md");
  fs.writeFileSync(summaryPath, mdLines.join("\n"));

  // Console output
  console.log(mdLines.join("\n"));
  console.log(`\nWrote: ${path.join(outDir, `test1-uniform-${TARGET_YEAR}.json`)}`);
  console.log(`Wrote: ${path.join(outDir, `test2-r-biased-${TARGET_YEAR}.json`)}`);
  console.log(`Wrote: ${path.join(outDir, `test3-jittered-${TARGET_YEAR}.json`)}`);
  console.log(`Wrote: ${summaryPath}`);

  if (!allPass) process.exit(1);
}

main();
