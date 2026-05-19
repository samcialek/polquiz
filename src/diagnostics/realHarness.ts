// PRISM real-quiz harness (HARNESS-HANDOFF.md §7.1 / §11.9).
//
// Drives the actual live engine end-to-end for each persona:
//   initQuiz → submitDemographics → (getNextQuestion → answer → submitAnswer)*
//   → getResults + getElectionPredictions + getRespondentState
//
// This is the validation-with-one-persona pass. Once Abstain→Trump runs clean
// (or with documented misroutings), expand to the full 15-persona battery.
//
// Run: npx tsx src/diagnostics/realHarness.ts

import * as fs from "node:fs";
import * as path from "node:path";

import {
  initQuiz,
  submitDemographics,
  getNextQuestion,
  submitAnswer,
  isComplete,
  getResults,
  getRespondentState,
  getElectionPredictions,
  getQuestionDef,
  composeArchetypeLabel,
  getTopArchetypesForDiagnostics,
} from "../browser/api.js";

import { decideAnswer, type Persona } from "./answerEngine.js";
import { ALL_PERSONAS, getPersonaById } from "./personas/index.js";

// Phase 5c (2026-05-19): top-K archetype ranking now provided by
// `getTopArchetypesForDiagnostics(k)` in browser/api.ts — a small accessor
// that computes archetypeDistance against the internal state without exposing
// the mutable state object itself. Returned objects are plain { id, name,
// distance }.

const OUT_DIR = path.join("results", "diagnostics");
const TRACE_DIR = path.join(OUT_DIR, "persona-traces");
fs.mkdirSync(TRACE_DIR, { recursive: true });

interface TraceEntry {
  idx: number;
  qId: number;
  promptShort: string;
  uiType: string;
  answer: unknown;
}

interface AssertionResult {
  name: string;
  pass: boolean;
  expected: string;
  actual: string;
}

interface RunResult {
  persona: Persona;
  trace: TraceEntry[];
  questionsAsked: number;
  finalState: Record<string, unknown> | null;
  composedLabel: string | null;
  identityPrimaryLabel: string | null;
  identityPrimaryState: string | null;
  engagementLevel: string;
  topArchetypes: Array<{ id: string; name: string; distance: number }>;
  votes: Record<number, string>;
  voteMatches: Record<number, { expected: string; actual: string; match: boolean }>;
  voteMatchCount: number;
  assertions: AssertionResult[];
}

/**
 * Q103 placement check: items the persona declared as highly salient
 * (sal >= 2.5) MUST land in supportHigh; items declared not salient
 * (sal < 1.5) MUST land in neutral. Q103 is load-bearing for the
 * salience-router phase that follows it — if the answer engine routes
 * Q103 wrong, the rest of the adaptive selection cascades wrong.
 */
function q103PlacementAssertions(persona: Persona, trace: TraceEntry[]): AssertionResult[] {
  const out: AssertionResult[] = [];
  const q103 = trace.find(t => t.qId === 103);
  if (!q103 || typeof q103.answer !== "object" || q103.answer == null) return out;
  const ans = q103.answer as { supportHigh: string[]; supportMid: string[]; neutral: string[]; opposeHigh: string[] };
  // Q103 item keys are lowercase node IDs (mat, cd, cu, mor, pro, com, zs, ont_h, ont_s, eps, aes)
  const itemToNode: Record<string, string> = {
    mat: "MAT", cd: "CD", cu: "CU", mor: "MOR", pro: "PRO", com: "COM",
    zs: "ZS", ont_h: "ONT_H", ont_s: "ONT_S", eps: "EPS", aes: "AES",
  };
  const missingHigh: string[] = [];
  const missingMid: string[] = [];
  const missingNeutral: string[] = [];
  for (const [item, node] of Object.entries(itemToNode)) {
    const sal = (persona.saliences as any)[node];
    if (sal == null) continue;
    if (sal >= 2.5 && !ans.supportHigh.includes(item)) missingHigh.push(`${item}(sal=${sal})`);
    else if (sal >= 1.5 && sal < 2.5 && !ans.supportMid.includes(item)) missingMid.push(`${item}(sal=${sal})`);
    else if (sal < 1.5 && !ans.neutral.includes(item)) missingNeutral.push(`${item}(sal=${sal})`);
  }
  out.push({
    name: "Q103: high-salience nodes in supportHigh",
    pass: missingHigh.length === 0,
    expected: "all nodes with sal≥2.5 in supportHigh",
    actual: missingHigh.length ? `missing: ${missingHigh.join(", ")}` : "all placed correctly",
  });
  out.push({
    name: "Q103: mid-salience nodes in supportMid",
    pass: missingMid.length === 0,
    expected: "all nodes with 1.5≤sal<2.5 in supportMid",
    actual: missingMid.length ? `missing: ${missingMid.join(", ")}` : "all placed correctly",
  });
  out.push({
    name: "Q103: low-salience nodes in neutral",
    pass: missingNeutral.length === 0,
    expected: "all nodes with sal<1.5 in neutral",
    actual: missingNeutral.length ? `missing: ${missingNeutral.join(", ")}` : "all placed correctly",
  });
  return out;
}

function runAssertions(persona: Persona, r: Omit<RunResult, "assertions">): AssertionResult[] {
  const out: AssertionResult[] = [];

  // Q103 placement (always checked when Q103 was asked)
  out.push(...q103PlacementAssertions(persona, r.trace));

  // Top archetype must be in acceptable list (HARNESS-HANDOFF §4.1)
  if (persona.expected.archetypeIds && persona.expected.archetypeIds.length > 0) {
    const top1 = r.topArchetypes[0];
    const top1Id = top1?.id ?? "(none)";
    const top1Name = top1?.name ?? "(none)";
    const acceptable = persona.expected.archetypeIds;
    out.push({
      name: "top-1 archetype in acceptable list",
      pass: top1 != null && acceptable.includes(top1Id),
      expected: `one of [${acceptable.join(", ")}]`,
      actual: `${top1Id} ${top1Name}`,
    });
  }

  // Vote match
  const voteTotal = Object.keys(persona.expected.votes).length;
  const voteMatchMin = persona.expected.voteMatchMin ?? voteTotal;
  out.push({
    name: "vote match",
    pass: r.voteMatchCount >= voteMatchMin,
    expected: `≥${voteMatchMin}/${voteTotal}`,
    actual: `${r.voteMatchCount}/${voteTotal}`,
  });

  // Composed label contains tokens
  if (persona.expected.archetypeLabelContains) {
    const label = r.composedLabel ?? "";
    for (const token of persona.expected.archetypeLabelContains) {
      out.push({
        name: `composed label contains "${token}"`,
        pass: label.includes(token),
        expected: token,
        actual: label || "(none)",
      });
    }
  }

  // Identity-primary state.
  //
  // The resolver returns one of: "none" / "unresolved" / "latent" / "active"
  // / "dominant". Higher tiers subsume lower in the sense that "dominant"
  // implies "active" thresholds also passed. The assertion semantics:
  //   expected "none"     → actual must be "none" OR "unresolved"
  //   expected "latent"   → actual must be "latent" OR "active" OR "dominant"
  //   expected "active"   → actual must be "active" OR "dominant"
  //   expected "dominant" → actual must be exactly "dominant"
  if (persona.expected.identityPrimaryState !== undefined && persona.expected.identityPrimaryState !== null) {
    const expectedState = persona.expected.identityPrimaryState;
    const actualState = r.identityPrimaryState ?? "none";
    const ladder = ["none", "unresolved", "latent", "active", "dominant"];
    const expectedIdx = ladder.indexOf(expectedState);
    const actualIdx = ladder.indexOf(actualState);
    let pass: boolean;
    if (expectedState === "none") {
      pass = actualState === "none" || actualState === "unresolved";
    } else {
      pass = expectedIdx >= 0 && actualIdx >= expectedIdx;
    }
    out.push({
      name: "identity-primary state",
      pass,
      expected: `≥ ${expectedState}`,
      actual: actualState,
    });
  }

  // Identity-primary label (if specified)
  if (persona.expected.identityPrimaryLabel !== undefined) {
    const expected = persona.expected.identityPrimaryLabel;
    const actual = r.identityPrimaryLabel;
    out.push({
      name: "identity-primary label",
      pass: expected === actual,
      expected: expected ?? "(none)",
      actual: actual ?? "(none)",
    });
  }

  // Engagement level
  if (persona.expected.engagement) {
    out.push({
      name: "engagement level",
      pass: r.engagementLevel === persona.expected.engagement,
      expected: persona.expected.engagement,
      actual: r.engagementLevel,
    });
  }

  // Question-count range
  if (persona.expected.questionsInRange) {
    const [lo, hi] = persona.expected.questionsInRange;
    out.push({
      name: "questions asked in range",
      pass: r.questionsAsked >= lo && r.questionsAsked <= hi,
      expected: `[${lo}, ${hi}]`,
      actual: String(r.questionsAsked),
    });
  }

  return out;
}

function runPersona(persona: Persona): RunResult {
  initQuiz();
  submitDemographics({
    demo_ethnicity: persona.demographics.race,
    demo_religion: persona.demographics.religion,
    demo_gender: persona.demographics.gender,
    demo_lgbtq: persona.demographics.lgbtq,
  } as any);

  const trace: TraceEntry[] = [];
  let idx = 0;
  while (!isComplete() && idx < 60) {
    const q = getNextQuestion();
    if (!q) break;
    idx++;
    const def = getQuestionDef(q.id);
    if (!def) {
      console.error(`Q${q.id}: no definition found`);
      break;
    }
    const answer = decideAnswer(persona, def);
    trace.push({ idx, qId: q.id, promptShort: q.promptShort, uiType: q.uiType, answer });
    submitAnswer(q.id, answer as any);
  }

  const state = getRespondentState();
  const results = getResults();

  // Compose archetype label via the labeler (consumers responsibility per
  // browser/api.ts:653 note — getResults() doesn't return composedLabel).
  let composedLabel: string | null = null;
  try {
    composedLabel = composeArchetypeLabel(state as any);
  } catch (e) {
    composedLabel = `(error: ${(e as Error).message})`;
  }

  const predictions = getElectionPredictions();
  const votes: Record<number, string> = {};
  for (const p of predictions) {
    if (p.year >= 2008 && p.year <= 2024) {
      if (p.decision === "abstain") {
        votes[p.year] = "ABSTAIN";
      } else {
        const party = p.nearest?.party ?? "?";
        votes[p.year] = party.startsWith("Rep") ? "R"
                     : party.startsWith("Dem") ? "D"
                     : party.startsWith("Ind") || party.startsWith("Lib") || party.startsWith("Green") ? "T"
                     : party;
      }
    }
  }

  const voteMatches: Record<number, { expected: string; actual: string; match: boolean }> = {};
  let voteMatchCount = 0;
  for (const [year, expected] of Object.entries(persona.expected.votes)) {
    const y = Number(year);
    const actual = votes[y] ?? "?";
    const match = expected === actual;
    voteMatches[y] = { expected, actual, match };
    if (match) voteMatchCount++;
  }

  const topArchetypes = getTopArchetypesForDiagnostics(5) ?? [];

  const partial = {
    persona,
    trace,
    questionsAsked: idx,
    finalState: state,
    composedLabel,
    identityPrimaryLabel: results.identityPrimary?.label ?? null,
    identityPrimaryState: results.identityPrimary?.state ?? null,
    engagementLevel: results.engagement.level,
    topArchetypes,
    votes,
    voteMatches,
    voteMatchCount,
  };

  return {
    ...partial,
    assertions: runAssertions(persona, partial),
  };
}

function renderReport(r: RunResult): string {
  const lines: string[] = [];
  lines.push(`# Harness Run — ${r.persona.name}`);
  lines.push("");
  lines.push(`**Persona ID:** \`${r.persona.id}\``);
  lines.push(`**Date:** ${new Date().toISOString().slice(0, 10)}`);
  lines.push(`**Questions asked:** ${r.questionsAsked}`);
  lines.push("");

  lines.push("## Reachability scorecard");
  lines.push("");
  lines.push(`- Composed archetype label: **${r.composedLabel ?? "(none)"}**`);
  lines.push(`- Identity-primary overlay: ${r.identityPrimaryLabel ?? "(none)"}`);
  lines.push(`- Engagement level: ${r.engagementLevel}`);
  lines.push("");
  lines.push("**Expected archetype family:** " + r.persona.expected.archetypeFamily);
  lines.push("");

  // Top-K archetype ranking (Phase 5c)
  lines.push("**Top-5 by archetype distance** (via `getTopArchetypesForDiagnostics`):");
  lines.push("");
  lines.push("| rank | id | name | distance |");
  lines.push("|---|---|---|---|");
  for (let i = 0; i < r.topArchetypes.length; i++) {
    const a = r.topArchetypes[i]!;
    lines.push(`| ${i + 1} | ${a.id} | ${a.name} | ${a.distance.toFixed(3)} |`);
  }
  lines.push("");

  // Assertions
  const failed = r.assertions.filter(a => !a.pass);
  lines.push(`## Assertions (${r.assertions.length - failed.length}/${r.assertions.length} pass)`);
  lines.push("");
  lines.push("| check | expected | actual | result |");
  lines.push("|---|---|---|---|");
  for (const a of r.assertions) {
    const result = a.pass ? "✓" : "❌";
    lines.push(`| ${a.name} | \`${a.expected}\` | \`${a.actual}\` | ${result} |`);
  }
  lines.push("");

  lines.push("## Vote-prediction scorecard");
  lines.push("");
  lines.push(`- Match: ${r.voteMatchCount}/${Object.keys(r.persona.expected.votes).length}`);
  lines.push("");
  lines.push("| year | expected | actual | match |");
  lines.push("|---|---|---|---|");
  for (const [year, m] of Object.entries(r.voteMatches).sort(([a], [b]) => Number(a) - Number(b))) {
    lines.push(`| ${year} | ${m.expected} | ${m.actual} | ${m.match ? "✓" : "❌"} |`);
  }
  lines.push("");

  lines.push("## Question trace");
  lines.push("");
  lines.push("| idx | qId | uiType | promptShort | answer |");
  lines.push("|---|---|---|---|---|");
  for (const t of r.trace) {
    const ans = JSON.stringify(t.answer);
    const truncatedAns = ans.length > 80 ? ans.slice(0, 77) + "..." : ans;
    lines.push(`| ${t.idx} | ${t.qId} | ${t.uiType} | ${t.promptShort} | \`${truncatedAns.replace(/\|/g, "\\|")}\` |`);
  }
  lines.push("");

  return lines.join("\n");
}

// ─── Main ─────────────────────────────────────────────────────────────────
//
// Two modes:
//   `npx tsx src/diagnostics/realHarness.ts`                 → battery (all)
//   `npx tsx src/diagnostics/realHarness.ts --persona <id>`  → single persona

function parseArgs(): { personaId: string | null } {
  const args = process.argv.slice(2);
  let personaId: string | null = null;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--persona" && i + 1 < args.length) {
      personaId = args[i + 1]!;
      i++;
    }
  }
  return { personaId };
}

function writePersonaArtifacts(result: RunResult): { reportPath: string; tracePath: string } {
  const reportPath = path.join(OUT_DIR, `real-harness-${result.persona.id}.md`);
  const tracePath = path.join(TRACE_DIR, `${result.persona.id}.json`);
  fs.writeFileSync(reportPath, renderReport(result));
  fs.writeFileSync(tracePath, JSON.stringify({
    persona: result.persona,
    trace: result.trace,
    questionsAsked: result.questionsAsked,
    composedLabel: result.composedLabel,
    identityPrimaryLabel: result.identityPrimaryLabel,
    identityPrimaryState: result.identityPrimaryState,
    engagementLevel: result.engagementLevel,
    topArchetypes: result.topArchetypes,
    votes: result.votes,
    voteMatches: result.voteMatches,
    assertions: result.assertions,
  }, null, 2));
  return { reportPath, tracePath };
}

function summarizeSingle(result: RunResult, reportPath: string, tracePath: string): void {
  console.log(`Persona: ${result.persona.name}`);
  console.log(`Questions asked: ${result.questionsAsked}`);
  console.log(`Composed label: ${result.composedLabel}`);
  console.log(`Identity-primary: ${result.identityPrimaryLabel ?? "(none)"} [${result.identityPrimaryState ?? "n/a"}]`);
  console.log(`Engagement: ${result.engagementLevel}`);
  console.log(`Vote match: ${result.voteMatchCount}/${Object.keys(result.persona.expected.votes).length}`);
  if (result.topArchetypes.length) {
    const top = result.topArchetypes[0]!;
    console.log(`Top archetype: #${top.id} ${top.name} (d=${top.distance.toFixed(3)})`);
  }
  const passed = result.assertions.filter(a => a.pass);
  console.log(`\nAssertions: ${passed.length}/${result.assertions.length} pass`);
  for (const a of result.assertions) {
    const mark = a.pass ? "✓" : "❌";
    console.log(`  ${mark} ${a.name}: expected ${a.expected}, got ${a.actual}`);
  }
  console.log(`\nReport: ${reportPath}`);
  console.log(`Trace:  ${tracePath}`);
}

function renderBatteryAggregate(results: RunResult[], date: string): string {
  const lines: string[] = [];
  lines.push(`# Harness Battery — Aggregate Report`);
  lines.push("");
  lines.push(`**Date:** ${date}`);
  lines.push(`**Personas run:** ${results.length}`);
  lines.push("");

  // Aggregate scorecard
  const totalAssertions = results.reduce((s, r) => s + r.assertions.length, 0);
  const passedAssertions = results.reduce((s, r) => s + r.assertions.filter(a => a.pass).length, 0);
  const personasClean = results.filter(r => r.assertions.every(a => a.pass)).length;
  lines.push("## Aggregate scorecard");
  lines.push("");
  lines.push(`- Personas with all assertions passing: **${personasClean}/${results.length}**`);
  lines.push(`- Total assertions: **${passedAssertions}/${totalAssertions}** pass`);
  lines.push("");

  // Per-persona summary table
  lines.push("## Per-persona summary");
  lines.push("");
  lines.push("| persona | questions | composed label | top archetype | IDP | vote match | assertions |");
  lines.push("|---|---|---|---|---|---|---|");
  for (const r of results) {
    const top = r.topArchetypes[0];
    const topStr = top ? `#${top.id} ${top.name}` : "—";
    const ipStr = r.identityPrimaryLabel ?? `(${r.identityPrimaryState ?? "none"})`;
    const passedN = r.assertions.filter(a => a.pass).length;
    const status = passedN === r.assertions.length ? "✓" : "❌";
    lines.push(
      `| ${r.persona.id} | ${r.questionsAsked} | ${r.composedLabel ?? "—"} | ${topStr} | ${ipStr} | ${r.voteMatchCount}/${Object.keys(r.persona.expected.votes).length} | ${status} ${passedN}/${r.assertions.length} |`
    );
  }
  lines.push("");

  // Failures detail
  const failedPersonas = results.filter(r => r.assertions.some(a => !a.pass));
  if (failedPersonas.length) {
    lines.push("## Failing assertions");
    lines.push("");
    for (const r of failedPersonas) {
      lines.push(`### ${r.persona.id}`);
      lines.push("");
      for (const a of r.assertions.filter(x => !x.pass)) {
        lines.push(`- ❌ \`${a.name}\` — expected \`${a.expected}\`, got \`${a.actual}\``);
      }
      lines.push("");
    }
  }

  // Vote-pattern coverage matrix per HARNESS-HANDOFF §4.5
  lines.push("## Vote-pattern coverage matrix");
  lines.push("");
  const years = [2008, 2012, 2016, 2020, 2024];
  lines.push(`| persona | ${years.join(" | ")} |`);
  lines.push(`|---|${years.map(() => "---").join("|")}|`);
  for (const r of results) {
    const row = years.map(y => {
      const m = r.voteMatches[y];
      if (!m) return "—";
      return `${m.actual}${m.match ? "" : ` (exp ${m.expected})`}`;
    });
    lines.push(`| ${r.persona.id} | ${row.join(" | ")} |`);
  }
  lines.push("");

  return lines.join("\n");
}

const { personaId } = parseArgs();

if (personaId) {
  const persona = getPersonaById(personaId);
  if (!persona) {
    console.error(`Unknown persona id: ${personaId}`);
    console.error(`Known: ${ALL_PERSONAS.map(p => p.id).join(", ")}`);
    process.exit(1);
  }
  const result = runPersona(persona);
  const { reportPath, tracePath } = writePersonaArtifacts(result);
  summarizeSingle(result, reportPath, tracePath);
  const failed = result.assertions.filter(a => !a.pass);
  if (failed.length > 0) {
    console.error(`\n${failed.length} assertion(s) failed — exiting nonzero.`);
    process.exit(1);
  }
} else {
  // Battery mode
  const date = new Date().toISOString().slice(0, 10);
  const results: RunResult[] = [];
  console.log(`Running battery of ${ALL_PERSONAS.length} persona(s)...\n`);
  for (const persona of ALL_PERSONAS) {
    process.stdout.write(`  ${persona.id} ... `);
    const result = runPersona(persona);
    writePersonaArtifacts(result);
    results.push(result);
    const passedN = result.assertions.filter(a => a.pass).length;
    const status = passedN === result.assertions.length ? "✓" : "❌";
    console.log(`${status} ${passedN}/${result.assertions.length} assertions, ${result.voteMatchCount}/${Object.keys(persona.expected.votes).length} vote, top: #${result.topArchetypes[0]?.id ?? "—"}`);
  }
  const aggregatePath = path.join(OUT_DIR, `real-harness-battery-${date}.md`);
  fs.writeFileSync(aggregatePath, renderBatteryAggregate(results, date));
  const totalAssertions = results.reduce((s, r) => s + r.assertions.length, 0);
  const passedAssertions = results.reduce((s, r) => s + r.assertions.filter(a => a.pass).length, 0);
  const failedPersonas = results.filter(r => r.assertions.some(a => !a.pass));
  console.log(`\nBattery: ${passedAssertions}/${totalAssertions} assertions pass; ${results.length - failedPersonas.length}/${results.length} personas clean.`);
  console.log(`Aggregate report: ${aggregatePath}`);
  if (failedPersonas.length > 0) {
    console.error(`\n${failedPersonas.length} persona(s) had failing assertions — exiting nonzero.`);
    process.exit(1);
  }
}
