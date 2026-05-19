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
} from "../browser/api.js";

import { decideAnswer, type Persona } from "./answerEngine.js";
import { abstainToTrumpPersona } from "./personas/abstain-to-trump.js";

// Note: explicit top-K archetype ranking would need `archetypeDistance(state, a)`,
// which requires the internal RespondentState shape (posDist/salDist arrays).
// `getRespondentState()` returns a sanitized shape (expectedPos/salience scalars).
// For Phase 5 we report the composed archetype label (which is the user-facing
// identity, post-centroid-retirement) plus vote predictions. A top-K accessor
// is a follow-up if needed for the full battery (Phase 6).

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

interface RunResult {
  persona: Persona;
  trace: TraceEntry[];
  questionsAsked: number;
  finalState: Record<string, unknown> | null;
  composedLabel: string | null;
  identityPrimaryLabel: string | null;
  engagementLevel: string;
  votes: Record<number, string>;
  voteMatches: Record<number, { expected: string; actual: string; match: boolean }>;
  voteMatchCount: number;
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

  return {
    persona,
    trace,
    questionsAsked: idx,
    finalState: state,
    composedLabel,
    identityPrimaryLabel: results.identityPrimary?.label ?? null,
    engagementLevel: results.engagement.level,
    votes,
    voteMatches,
    voteMatchCount,
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
  lines.push("*Top-K archetype-id ranking is deferred — requires the internal RespondentState shape (posDist/salDist arrays) which `getRespondentState` does not expose. Composed label above is the canonical user-facing archetype identity (post-centroid-retirement).*");
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
  engagementLevel: result.engagementLevel,
  votes: result.votes,
  voteMatches: result.voteMatches,
}, null, 2));

console.log(`Persona: ${persona.name}`);
console.log(`Questions asked: ${result.questionsAsked}`);
console.log(`Composed label: ${result.composedLabel}`);
console.log(`Identity-primary: ${result.identityPrimaryLabel ?? "(none)"}`);
console.log(`Engagement: ${result.engagementLevel}`);
console.log(`Vote match: ${result.voteMatchCount}/${Object.keys(persona.expected.votes).length}`);
console.log(`\nReport: ${reportPath}`);
console.log(`Trace:  ${tracePath}`);
