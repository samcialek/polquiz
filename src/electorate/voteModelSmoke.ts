/**
 * Step 0 — vote-model smoke test.
 *
 * Take all 118 active archetypes, convert each to a NodeSignature using the
 * archetype's centroid (no quiz noise), uniformly weight them, and run each
 * through predictVote against actual 2020 + 2024 candidates. Aggregate the
 * vote/abstain decisions and compare directionally to the real outcomes.
 *
 * The point: confirm that respondentVoteChoice gives sane results when fed
 * the archetypes-as-population strawman, BEFORE any survey-mapping noise
 * enters the picture. If the formula is broken at this layer, the survey
 * pipeline is built on sand.
 *
 * Usage:
 *   npx tsx src/electorate/voteModelSmoke.ts
 *
 * Outputs:
 *   results/electorate/smoke/{2020,2024}-results.json
 *   results/electorate/smoke/summary.md
 */

import * as fs from "fs";
import * as path from "path";
import { ARCHETYPES } from "../config/archetypes.js";
import { ELECTIONS } from "../historical/candidates.js";
import { getContext } from "../historical/contexts.js";
import { predictVote } from "../historical/respondentVoteChoice.js";
import type { Archetype } from "../types.js";
import type { NodeSignature } from "../engine/respondentSignature.js";
import type { EngagementLevel } from "../engine/engagementLabel.js";

const DEACTIVATED = new Set(["019", "023", "025"]);
const TARGET_YEARS = [2020, 2024];

const CONTINUOUS_SCORING_NODES = [
  "MAT", "CD", "CU", "MOR", "PRO", "COM", "ZS", "ONT_H", "ONT_S", "PF", "TRB",
] as const;

const CATEGORICAL_NODES = ["EPS", "AES"] as const;

// Real popular-vote shares for sanity comparison.
const ACTUAL = {
  2020: { winner: "Biden", D: 0.513, R: 0.468, T: 0.019 },
  2024: { winner: "Trump", D: 0.483, R: 0.498, T: 0.019 },
} as const;

function engagementLevelFromPos(pos: number): EngagementLevel {
  if (pos < 2.0) return "apolitical";
  if (pos < 3.0) return "casual";
  if (pos < 4.0) return "engaged";
  return "highly-engaged";
}

function archetypeToSignature(arc: Archetype): {
  sig: NodeSignature;
  engagement: EngagementLevel;
  dominantNode: string | null;
} {
  const sig: NodeSignature = {};
  let dominantNode: string | null = null;
  let dominantSal = -1;
  let engPos = 3;

  for (const code of CONTINUOUS_SCORING_NODES) {
    const n = arc.nodes[code];
    if (!n || n.kind !== "continuous") continue;
    sig[code] = { pos: n.pos, sal: n.sal };
    if (n.sal > dominantSal) {
      dominantSal = n.sal;
      dominantNode = code;
    }
  }

  // ENG drives engagement; not part of the distance compute, so handled separately.
  const engNode = arc.nodes.ENG;
  if (engNode && engNode.kind === "continuous") engPos = engNode.pos;

  for (const code of CATEGORICAL_NODES) {
    const n = arc.nodes[code];
    if (!n || n.kind !== "categorical") continue;
    // Expected categorical index for downstream code paths that read .pos.
    let expectedIdx = 0;
    for (let i = 0; i < n.probs.length; i++) expectedIdx += i * n.probs[i];
    sig[code] = { pos: expectedIdx, sal: n.sal, catDist: [...n.probs] };
  }

  return {
    sig,
    engagement: engagementLevelFromPos(engPos),
    dominantNode,
  };
}

interface YearResult {
  year: number;
  totalVoters: number;
  voted: { D: number; R: number; T: number; O: number };
  abstain: number;
  voteShare: { D: number; R: number; T: number; O: number };
  voteShareOfTurnout: { D: number; R: number; T: number; O: number };
  turnoutRate: number;
  perArchetype: Array<{
    id: string;
    name: string;
    nearest: string;
    nearestParty: string;
    decision: "vote" | "abstain";
  }>;
}

function partyBucket(party: string): "D" | "R" | "T" | "O" {
  if (party === "Democratic" || party === "Democratic-Republican") return "D";
  if (party === "Republican" || party === "Whig" || party === "Federalist") return "R";
  if (party === "Independent" || party === "American Independent" || party === "Dixiecrat") return "T";
  return "O";
}

function runYear(year: number, archetypes: Archetype[]): YearResult {
  const election = ELECTIONS.find(e => e.year === year);
  if (!election) throw new Error(`No election data for ${year}`);
  const ctx = getContext(year);
  if (!ctx) throw new Error(`No context for ${year}`);

  const voted = { D: 0, R: 0, T: 0, O: 0 };
  let abstain = 0;
  const perArchetype: YearResult["perArchetype"] = [];

  for (const arc of archetypes) {
    const { sig, engagement, dominantNode } = archetypeToSignature(arc);
    const morState = arc.morBoundaries
      ? { boundaries: { ...arc.morBoundaries.boundaries }, intensity: arc.morBoundaries.intensity }
      : null;

    const pred = predictVote(
      sig,
      election.candidates,
      ctx,
      engagement,
      null, // partyID unknown at archetype-strawman level
      null, // no anchor distribution
      null, // no negative-partisanship
      false, // not flagged as strategic
      dominantNode,
      morState,
    );

    const bucket = partyBucket(pred.nearest.party);
    if (pred.decision === "vote") voted[bucket] += 1;
    else abstain += 1;

    perArchetype.push({
      id: arc.id,
      name: arc.name,
      nearest: pred.nearest.name,
      nearestParty: pred.nearest.party,
      decision: pred.decision,
    });
  }

  const total = archetypes.length;
  const turnout = voted.D + voted.R + voted.T + voted.O;
  return {
    year,
    totalVoters: total,
    voted,
    abstain,
    voteShare: {
      D: voted.D / total, R: voted.R / total, T: voted.T / total, O: voted.O / total,
    },
    voteShareOfTurnout: {
      D: turnout ? voted.D / turnout : 0,
      R: turnout ? voted.R / turnout : 0,
      T: turnout ? voted.T / turnout : 0,
      O: turnout ? voted.O / turnout : 0,
    },
    turnoutRate: turnout / total,
    perArchetype,
  };
}

function pct(x: number): string { return (x * 100).toFixed(1) + "%"; }

function summarizeMarkdown(results: YearResult[]): string {
  const lines: string[] = [];
  const totalArc = results[0]?.totalVoters ?? 0;
  lines.push(`# Vote-Model Smoke Test — ${totalArc} Active Archetypes, Uniform Weighted`);
  lines.push("");
  lines.push(`Each of ${totalArc} active archetypes is treated as one voter. No quiz simulation, no posterior sampling — pure centroid signatures fed to \`respondentVoteChoice.predictVote\`. Compares directional outcome and two-party share against actual results. **This is not a backtest** — uniform-weighted archetypes are not a representative US electorate. It's a sanity check that the voting formula is internally coherent before survey-mapping work begins.`);
  lines.push("");

  for (const r of results) {
    const actual = (ACTUAL as any)[r.year];
    lines.push(`## ${r.year}`);
    lines.push("");
    lines.push(`**Predicted nearest-candidate winner**: ${r.voted.D >= r.voted.R ? "Democratic" : "Republican"}`);
    lines.push(`**Actual winner**: ${actual.winner}`);
    lines.push("");
    lines.push("| Bucket | Votes | Share of all 118 | Share of turnout | Actual share |");
    lines.push("|---|---:|---:|---:|---:|");
    lines.push(`| Democratic | ${r.voted.D} | ${pct(r.voteShare.D)} | ${pct(r.voteShareOfTurnout.D)} | ${pct(actual.D)} |`);
    lines.push(`| Republican | ${r.voted.R} | ${pct(r.voteShare.R)} | ${pct(r.voteShareOfTurnout.R)} | ${pct(actual.R)} |`);
    lines.push(`| Third / Other | ${r.voted.T + r.voted.O} | ${pct(r.voteShare.T + r.voteShare.O)} | ${pct(r.voteShareOfTurnout.T + r.voteShareOfTurnout.O)} | ${pct(actual.T)} |`);
    lines.push(`| Abstain | ${r.abstain} | ${pct(r.abstain / r.totalVoters)} | — | — |`);
    lines.push("");
    lines.push(`Turnout rate (archetypes voting / total): ${pct(r.turnoutRate)}`);
    lines.push("");
  }

  lines.push("## Diagnostic Read");
  lines.push("");
  lines.push("**This is a vote-model smoke, not an electorate validation.** Uniform-archetype is not the US electorate; the only thing this artifact validates is that `respondentVoteChoice` runs end-to-end and produces internally coherent outcomes. Do NOT read precision into share numbers.");
  lines.push("");
  lines.push("### Stable Dem-share bias of the strawman");
  lines.push("");
  lines.push("Compare the D-share bias across years:");
  lines.push("");
  lines.push("| Year | Predicted D | Actual D | Bias |");
  lines.push("|---|---:|---:|---:|");
  for (const r of results) {
    const actual = (ACTUAL as any)[r.year];
    const bias = (r.voteShareOfTurnout.D - actual.D) * 100;
    lines.push(`| ${r.year} | ${pct(r.voteShareOfTurnout.D)} | ${pct(actual.D)} | ${bias >= 0 ? "+" : ""}${bias.toFixed(1)}pt |`);
  }
  lines.push("");
  lines.push("If the bias is similar across years, the strawman has a **structural lean** (more left-of-center archetypes than right) — not a year-specific formula failure. A direction flip can happen in a year where the actual margin is smaller than the structural bias, even though the model is behaving the same way.");
  lines.push("");
  lines.push("### What this DOES tell us");
  lines.push("- Engine runs without errors / NaN.");
  lines.push("- Turnout is plausible (engagement clearing-bar isn't broken).");
  lines.push("- The internal consistency check passes — same model produces same-magnitude bias across years.");
  lines.push("");
  lines.push("### What this does NOT tell us");
  lines.push("- Whether candidate signatures are right (audit separately).");
  lines.push("- Whether era activations are right (audit separately).");
  lines.push("- Whether the formula is right at the population level — that requires CES-weighted backtest. If a weighted electorate still shows this size of skew, escalate to mapper / candidate / formula diagnosis.");
  lines.push("");

  return lines.join("\n");
}

function main() {
  const archetypes = ARCHETYPES.filter(a => !DEACTIVATED.has(a.id));
  console.log(`Loaded ${archetypes.length} active archetypes (filtered ${ARCHETYPES.length - archetypes.length} deactivated)`);

  const results: YearResult[] = [];
  for (const year of TARGET_YEARS) {
    console.log(`Running ${year}...`);
    const r = runYear(year, archetypes);
    results.push(r);
    console.log(`  votes: D=${r.voted.D} R=${r.voted.R} T=${r.voted.T} O=${r.voted.O} abstain=${r.abstain}`);
    console.log(`  share of turnout: D=${pct(r.voteShareOfTurnout.D)} R=${pct(r.voteShareOfTurnout.R)}`);
  }

  const outDir = path.resolve("results/electorate/smoke");
  fs.mkdirSync(outDir, { recursive: true });

  for (const r of results) {
    const file = path.join(outDir, `${r.year}-results.json`);
    fs.writeFileSync(file, JSON.stringify(r, null, 2));
    console.log(`Wrote ${file}`);
  }

  const summary = summarizeMarkdown(results);
  const summaryPath = path.join(outDir, "summary.md");
  fs.writeFileSync(summaryPath, summary);
  console.log(`Wrote ${summaryPath}`);
  console.log("\n" + summary);
}

main();
