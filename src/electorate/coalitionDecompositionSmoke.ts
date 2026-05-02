/**
 * Coalition decomposition smoke test.
 *
 * Synthesizes WeightedAgents from archetypes with deterministic demographic
 * tags, runs the simulator, then runs decomposeByCoalition. Verifies:
 *   - subgroup weight totals partition correctly along race/age axes
 *   - white-college / white-non-college sub-cells sum to total whites
 *   - vote shares within a subgroup sum to 1
 *   - sweeping a single tag (race=white) onto every agent makes that
 *     subgroup carry 100% of weight
 *   - coverage notes correctly flag missing demographics
 *
 * NO CES/ANES data. NO candidate signature edits. Synthetic only.
 *
 * Usage: npx tsx src/electorate/coalitionDecompositionSmoke.ts
 *
 * Outputs:
 *   results/electorate/coalition/test-mixed-2020.json
 *   results/electorate/coalition/test-uniform-white-2020.json
 *   results/electorate/coalition/test-missing-demos-2020.json
 *   results/electorate/coalition/summary.md
 */

import * as fs from "fs";
import * as path from "path";
import { ARCHETYPES } from "../config/archetypes.js";
import { simulateElectorate } from "./electorateSimulator.js";
import { agentFromArchetype } from "./syntheticAgents.js";
import { decomposeByCoalition, type CoalitionDecomposition } from "./coalitionDecomposition.js";
import type { WeightedAgent, AgentDemographics } from "./types.js";

const TARGET_YEAR = 2020;
const DEACTIVATED = new Set(["019", "023", "025"]);

function pct(x: number): string { return (x * 100).toFixed(1) + "%"; }

/**
 * Synthesize a deterministic demographic profile for an archetype using its
 * numeric ID as a hash seed. Distribution roughly mirrors US adult electorate:
 *   60% white, 13% Black, 18% Latino, 7% Asian, 2% other
 *   45% college, 55% non-college
 *   18-29 22%, 30-44 26%, 45-64 33%, 65+ 19%
 *   gender: 49% M / 51% F
 *   evangelical: 25%, union: 11%
 *   region 4-way split, geography 3-way urban/suburban/rural
 *   state: cycles through 8 representative states
 */
function syntheticDemographicsFor(archetypeId: string): AgentDemographics {
  const n = parseInt(archetypeId, 10) || 0;
  const races = ["white","white","white","white","white","white","Black","Latino","Latino","Asian"]; // 6/10/2/1
  const educations = ["college","college","non-college","non-college","non-college"];
  const ageGroups = ["18-29","30-44","30-44","45-64","45-64","45-64","65+"];
  const genders = ["M","F"];
  const regions = ["Northeast","Midwest","South","West"];
  const geographies = ["urban","suburban","suburban","rural"];
  const states = ["CA","TX","FL","NY","PA","OH","GA","AZ"];

  return {
    race: races[n % races.length] as AgentDemographics["race"],
    education: educations[(n * 7) % educations.length] as AgentDemographics["education"],
    ageGroup: ageGroups[(n * 11) % ageGroups.length] as AgentDemographics["ageGroup"],
    gender: genders[(n * 3) % genders.length] as AgentDemographics["gender"],
    evangelical: ((n * 13) % 4) === 0,
    union: ((n * 17) % 9) === 0,
    region: regions[(n * 5) % regions.length] as AgentDemographics["region"],
    geography: geographies[(n * 19) % geographies.length] as AgentDemographics["geography"],
    state: states[(n * 23) % states.length],
  };
}

function activeArchetypes() {
  return ARCHETYPES.filter(a => !DEACTIVATED.has(a.id));
}

function buildMixedAgents(): WeightedAgent[] {
  return activeArchetypes().map(arc =>
    agentFromArchetype(arc, {
      electionYear: TARGET_YEAR,
      weight: 1,
      source: "SYNTHETIC-MIXED",
    }),
  ).map((a, i) => ({
    ...a,
    demographics: syntheticDemographicsFor(activeArchetypes()[i].id),
  }));
}

function buildUniformWhiteAgents(): WeightedAgent[] {
  return activeArchetypes().map(arc =>
    agentFromArchetype(arc, {
      electionYear: TARGET_YEAR,
      weight: 1,
      source: "SYNTHETIC-WHITE",
    }),
  ).map(a => ({
    ...a,
    demographics: { race: "white", education: "college", ageGroup: "30-44", gender: "F" } as AgentDemographics,
  }));
}

function buildMissingDemosAgents(): WeightedAgent[] {
  // agentFromArchetype always populates demographics.extra with archetype meta.
  // To genuinely test "no demographics" we override to undefined on even
  // indices; odd indices get the full synthetic demographic profile.
  return activeArchetypes().map((arc, i) => {
    const base = agentFromArchetype(arc, {
      electionYear: TARGET_YEAR,
      weight: 1,
      source: "SYNTHETIC-PARTIAL",
    });
    return i % 2 === 0
      ? { ...base, demographics: undefined }
      : { ...base, demographics: syntheticDemographicsFor(arc.id) };
  });
}

function findSubgroup(decomp: CoalitionDecomposition, tag: string) {
  return decomp.subgroups.find(s => s.subgroup === tag);
}

function summarize(label: string, decomp: CoalitionDecomposition): string {
  const lines: string[] = [];
  lines.push(`### ${label}`);
  lines.push("");
  lines.push(`Total electorate weight: ${decomp.meta.totalElectorateWeight.toFixed(2)}. Subgroups: ${decomp.subgroups.length}.`);
  if (decomp.meta.coverageNotes.length) {
    lines.push("");
    lines.push("Coverage notes:");
    for (const n of decomp.meta.coverageNotes) lines.push(`- ${n}`);
  }
  lines.push("");
  lines.push("| Subgroup | Agents | Weight | Share | Turnout | D | R | T | O |");
  lines.push("|---|---:|---:|---:|---:|---:|---:|---:|---:|");
  for (const s of decomp.subgroups) {
    lines.push(
      `| ${s.subgroup} | ${s.agentCount} | ${s.weightedSize.toFixed(1)} | ${pct(s.shareOfElectorate)} | ${pct(s.turnoutRate)} | ${pct(s.byParty.D.voteShareOfTurnout)} | ${pct(s.byParty.R.voteShareOfTurnout)} | ${pct(s.byParty.T.voteShareOfTurnout)} | ${pct(s.byParty.O.voteShareOfTurnout)} |`,
    );
  }
  lines.push("");
  return lines.join("\n");
}

function main() {
  const outDir = path.resolve("results/electorate/coalition");
  fs.mkdirSync(outDir, { recursive: true });

  // ── Test M — Mixed demographics ────────────────────────────────────────
  const mixedAgents = buildMixedAgents();
  const mixedSim = simulateElectorate({ year: TARGET_YEAR, agents: mixedAgents });
  const mixedDecomp = decomposeByCoalition(mixedSim, mixedAgents);
  fs.writeFileSync(
    path.join(outDir, `test-mixed-${TARGET_YEAR}.json`),
    JSON.stringify(mixedDecomp, null, 2),
  );

  // ── Test W — Uniform white-college 30-44 F ─────────────────────────────
  const whiteAgents = buildUniformWhiteAgents();
  const whiteSim = simulateElectorate({ year: TARGET_YEAR, agents: whiteAgents });
  const whiteDecomp = decomposeByCoalition(whiteSim, whiteAgents);
  fs.writeFileSync(
    path.join(outDir, `test-uniform-white-${TARGET_YEAR}.json`),
    JSON.stringify(whiteDecomp, null, 2),
  );

  // ── Test P — Half the agents missing demographics ───────────────────────
  const partialAgents = buildMissingDemosAgents();
  const partialSim = simulateElectorate({ year: TARGET_YEAR, agents: partialAgents });
  const partialDecomp = decomposeByCoalition(partialSim, partialAgents);
  fs.writeFileSync(
    path.join(outDir, `test-missing-demos-${TARGET_YEAR}.json`),
    JSON.stringify(partialDecomp, null, 2),
  );

  // ── Invariant checks ────────────────────────────────────────────────────
  type Check = { name: string; pass: boolean; detail: string };
  const checks: Check[] = [];

  // M1. Race subgroups partition the total electorate weight.
  const races = ["race:white", "race:Black", "race:Latino", "race:Asian"];
  const raceWeightSum = races
    .map(r => findSubgroup(mixedDecomp, r)?.weightedSize ?? 0)
    .reduce((s, v) => s + v, 0);
  checks.push({
    name: "Mixed: race subgroups partition total weight",
    pass: Math.abs(raceWeightSum - mixedDecomp.meta.totalElectorateWeight) < 1e-6,
    detail: `sum=${raceWeightSum.toFixed(2)} total=${mixedDecomp.meta.totalElectorateWeight.toFixed(2)}`,
  });

  // M2. white-college + white-non-college equals race:white.
  const whiteSize = findSubgroup(mixedDecomp, "race:white")?.weightedSize ?? 0;
  const whiteCol = findSubgroup(mixedDecomp, "white-college")?.weightedSize ?? 0;
  const whiteNon = findSubgroup(mixedDecomp, "white-non-college")?.weightedSize ?? 0;
  checks.push({
    name: "Mixed: white-college + white-non-college == race:white",
    pass: Math.abs((whiteCol + whiteNon) - whiteSize) < 1e-6,
    detail: `${whiteCol.toFixed(2)} + ${whiteNon.toFixed(2)} = ${(whiteCol + whiteNon).toFixed(2)} vs whites=${whiteSize.toFixed(2)}`,
  });

  // M3. Within each race subgroup: D + R + T + O + abstain shares = 1.0
  for (const r of races) {
    const s = findSubgroup(mixedDecomp, r);
    if (!s) continue;
    const sum = s.byParty.D.voteShare + s.byParty.R.voteShare + s.byParty.T.voteShare + s.byParty.O.voteShare + s.abstainRate;
    checks.push({
      name: `Mixed: ${r} D+R+T+O+abstain shares sum to 1.0`,
      pass: Math.abs(sum - 1) < 1e-6,
      detail: `sum=${sum.toFixed(6)}`,
    });
  }

  // M4. Age subgroups partition the total electorate weight.
  const ageTags = ["age:18-29", "age:30-44", "age:45-64", "age:65+"];
  const ageWeightSum = ageTags
    .map(t => findSubgroup(mixedDecomp, t)?.weightedSize ?? 0)
    .reduce((s, v) => s + v, 0);
  checks.push({
    name: "Mixed: age subgroups partition total weight",
    pass: Math.abs(ageWeightSum - mixedDecomp.meta.totalElectorateWeight) < 1e-6,
    detail: `sum=${ageWeightSum.toFixed(2)} total=${mixedDecomp.meta.totalElectorateWeight.toFixed(2)}`,
  });

  // W1. Uniform-white: race:white carries 100% of weight, no other race tag exists.
  const wWhite = findSubgroup(whiteDecomp, "race:white");
  const wBlack = findSubgroup(whiteDecomp, "race:Black");
  const wLatino = findSubgroup(whiteDecomp, "race:Latino");
  checks.push({
    name: "Uniform-white: race:white = 100% of total weight",
    pass: !!wWhite && Math.abs(wWhite.weightedSize - whiteDecomp.meta.totalElectorateWeight) < 1e-6,
    detail: `white=${wWhite?.weightedSize.toFixed(2) ?? "missing"} total=${whiteDecomp.meta.totalElectorateWeight.toFixed(2)}`,
  });
  checks.push({
    name: "Uniform-white: no race:Black / race:Latino subgroups exist",
    pass: !wBlack && !wLatino,
    detail: `Black=${wBlack ? "present" : "absent"} Latino=${wLatino ? "present" : "absent"}`,
  });

  // W2. Uniform-white: white-college carries the full weight (everyone tagged college).
  const wWhiteCol = findSubgroup(whiteDecomp, "white-college");
  checks.push({
    name: "Uniform-white: white-college = 100% of total weight",
    pass: !!wWhiteCol && Math.abs(wWhiteCol.weightedSize - whiteDecomp.meta.totalElectorateWeight) < 1e-6,
    detail: `whiteCol=${wWhiteCol?.weightedSize.toFixed(2) ?? "missing"}`,
  });

  // P1. Partial-demos: total electorate weight equals all agents (decomposition still iterates everyone).
  checks.push({
    name: "Partial-demos: total electorate weight matches agent count",
    pass: Math.abs(partialDecomp.meta.totalElectorateWeight - partialAgents.length) < 1e-6,
    detail: `total=${partialDecomp.meta.totalElectorateWeight.toFixed(2)} agents=${partialAgents.length}`,
  });

  // P2. Partial-demos: coverage notes flag the missing-demographics agents.
  const flagsMissing = partialDecomp.meta.coverageNotes.some(n =>
    n.toLowerCase().includes("no demographics"),
  );
  checks.push({
    name: "Partial-demos: coverage notes mention missing demographics",
    pass: flagsMissing,
    detail: partialDecomp.meta.coverageNotes.length
      ? partialDecomp.meta.coverageNotes.join(" | ")
      : "(no notes)",
  });

  // P3. Partial-demos: race subgroups only sum to ~half the total weight (others have no demos).
  const partialRaceSum = races
    .map(r => findSubgroup(partialDecomp, r)?.weightedSize ?? 0)
    .reduce((s, v) => s + v, 0);
  // Half the agents have demographics; allow ±1 weight unit of slack.
  const expectedHalf = partialDecomp.meta.totalElectorateWeight / 2;
  checks.push({
    name: "Partial-demos: race subgroups sum to ~half the total weight",
    pass: Math.abs(partialRaceSum - expectedHalf) <= 1,
    detail: `raceSum=${partialRaceSum.toFixed(2)} expected≈${expectedHalf.toFixed(2)}`,
  });

  // ── Summary markdown ────────────────────────────────────────────────────
  const md: string[] = [];
  md.push("# Coalition Decomposition Smoke");
  md.push("");
  md.push(`Run at ${new Date().toISOString()}. Year: ${TARGET_YEAR}. Synthetic agents only.`);
  md.push("");
  md.push("Three test cases verify that subgroup aggregation is correct under: a realistic mixed electorate, a degenerate uniform-white electorate (test for absence of unrelated subgroups), and a partial-demographics electorate (test for coverage flagging).");
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

  md.push(summarize("Test M — mixed demographics across 121 archetypes", mixedDecomp));
  md.push(summarize("Test W — uniform white-college 30-44 F across 121 archetypes", whiteDecomp));
  md.push(summarize("Test P — half the agents missing demographics", partialDecomp));

  const summaryPath = path.join(outDir, "summary.md");
  fs.writeFileSync(summaryPath, md.join("\n"));

  console.log(md.join("\n"));
  console.log(`\nWrote: ${path.join(outDir, `test-mixed-${TARGET_YEAR}.json`)}`);
  console.log(`Wrote: ${path.join(outDir, `test-uniform-white-${TARGET_YEAR}.json`)}`);
  console.log(`Wrote: ${path.join(outDir, `test-missing-demos-${TARGET_YEAR}.json`)}`);
  console.log(`Wrote: ${summaryPath}`);

  if (!allPass) process.exit(1);
}

main();
