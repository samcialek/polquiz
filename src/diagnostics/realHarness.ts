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
import { abstainToTrumpPersona } from "./personas/abstain-to-trump.js";

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
  const missingNeutral: string[] = [];
  for (const [item, node] of Object.entries(itemToNode)) {
    const sal = (persona.saliences as any)[node];
    if (sal == null) continue;
    if (sal >= 2.5 && !ans.supportHigh.includes(item)) missingHigh.push(`${item}(sal=${sal})`);
    if (sal < 1.5 && !ans.neutral.includes(item)) missingNeutral.push(`${item}(sal=${sal})`);
  }
  out.push({
    name: "Q103: high-salience nodes in supportHigh",
    pass: missingHigh.length === 0,
    expected: "all nodes with sal≥2.5 in supportHigh",
    actual: missingHigh.length ? `missing: ${missingHigh.join(", ")}` : "all placed correctly",
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

  // Identity-primary state
  if (persona.expected.identityPrimaryState !== undefined && persona.expected.identityPrimaryState !== null) {
    const expectedState = persona.expected.identityPrimaryState;
    // "none" persona-expectation maps to API returning either null or
    // identityPrimary.state === "none" / "unresolved".
    const actualState = r.identityPrimaryState ?? "none";
    const pass = expectedState === "none"
      ? (actualState === "none" || actualState === "unresolved")
      : actualState === expectedState;
    out.push({
      name: "identity-primary state",
      pass,
      expected: expectedState,
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

const persona = abstainToTrumpPersona;
const result = runPersona(persona);

const reportPath = path.join(OUT_DIR, `real-harness-${persona.id}.md`);
const tracePath = path.join(TRACE_DIR, `${persona.id}.json`);
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

console.log(`Persona: ${persona.name}`);
console.log(`Questions asked: ${result.questionsAsked}`);
console.log(`Composed label: ${result.composedLabel}`);
console.log(`Identity-primary: ${result.identityPrimaryLabel ?? "(none)"} [${result.identityPrimaryState ?? "n/a"}]`);
console.log(`Engagement: ${result.engagementLevel}`);
console.log(`Vote match: ${result.voteMatchCount}/${Object.keys(persona.expected.votes).length}`);
if (result.topArchetypes.length) {
  const top = result.topArchetypes[0]!;
  console.log(`Top archetype: #${top.id} ${top.name} (d=${top.distance.toFixed(3)})`);
}

const failedAssertions = result.assertions.filter(a => !a.pass);
const passedAssertions = result.assertions.filter(a => a.pass);
console.log(`\nAssertions: ${passedAssertions.length}/${result.assertions.length} pass`);
for (const a of result.assertions) {
  const mark = a.pass ? "✓" : "❌";
  console.log(`  ${mark} ${a.name}: expected ${a.expected}, got ${a.actual}`);
}
console.log(`\nReport: ${reportPath}`);
console.log(`Trace:  ${tracePath}`);

if (failedAssertions.length > 0) {
  console.error(`\n${failedAssertions.length} assertion(s) failed — exiting nonzero.`);
  process.exit(1);
}
