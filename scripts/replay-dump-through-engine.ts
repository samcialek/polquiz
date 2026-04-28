/**
 * PR 1 — Trace reliability: dump replay against current engine.
 *
 * Take an existing prism-dump's trace, replay it through the current engine
 * bundle (initQuiz + submitAnswer for each trace entry), and compare the
 * resulting state to the dump's stored final state. Output: per-node deltas
 * and a re-evaluated archetype assignment.
 *
 * Use case: after engine fixes land, this answers "what would this user's
 * result be if they took the quiz today against the current engine, given
 * they answered exactly the same way?" Critical for assessing whether old
 * dumps' findings (Sam's three calibration targets) hold under PR 1+2+3
 * changes.
 *
 * Usage:
 *   npx tsx scripts/replay-dump-through-engine.ts <path/to/dump.json>
 */
import { promises as fs } from "node:fs";
import * as path from "node:path";
import {
  initQuiz,
  submitAnswer,
  getRespondentState,
  getResults,
} from "../src/browser/api.js";
import type { ContinuousNodeId, CategoricalNodeId } from "../src/types.js";

const CONTINUOUS_NODES: ContinuousNodeId[] = ["MAT","CD","CU","MOR","PRO","COM","ZS","ONT_H","ONT_S","PF","TRB","ENG"];
const CATEGORICAL_NODES: CategoricalNodeId[] = ["EPS","AES"];

function expectedPos(posDist: number[]): number {
  return posDist.reduce((s, p, i) => s + p * (i + 1), 0);
}
function expectedSal(salDist: number[]): number {
  return salDist.reduce((s, p, i) => s + p * i, 0);
}
function topCat(catDist: number[], names: string[]): { name: string; prob: number } {
  let best = 0; let bestProb = -1;
  for (let i = 0; i < catDist.length; i++) {
    if ((catDist[i] || 0) > bestProb) { bestProb = catDist[i] || 0; best = i; }
  }
  return { name: names[best] ?? "?", prob: bestProb };
}

const EPS_NAMES = ["empiricist","institutionalist","traditionalist","intuitionist","autonomous","nihilist"];
const AES_NAMES = ["statesman","technocrat","pastoral","plainspoken","fighter","visionary"];

async function main() {
  const dumpPath = process.argv[2];
  if (!dumpPath) {
    console.error("Usage: npx tsx scripts/replay-dump-through-engine.ts <path/to/dump.json>");
    process.exit(2);
  }
  const dump = JSON.parse(await fs.readFile(dumpPath, "utf8"));
  const trace = dump.trace || [];
  const stored = dump.results || {};
  const storedState = stored.respondentState || {};

  if (trace.length === 0) {
    console.error("Dump has no trace.");
    process.exit(1);
  }

  console.log(`════════════════════════════════════════════════════════════════════`);
  console.log(`Replay: ${dumpPath}`);
  console.log(`runId: ${dump.runId || "(none)"}`);
  console.log(`stored bundleVersion: ${stored.bundleVersion || "(none — pre-PR-1 dump)"}`);
  console.log(`stored archetype: ${stored.archetypeId} ${stored.archetypeName} (confidence ${(stored.confidence * 100).toFixed(2)}%)`);
  console.log(`────────────────────────────────────────────────────────────────────`);

  // Replay through current engine
  initQuiz();
  let appliedCount = 0;
  let skippedCount = 0;
  for (const entry of trace) {
    try {
      submitAnswer(entry.qId, entry.answer);
      appliedCount++;
    } catch (e: any) {
      console.error(`[replay] Q${entry.qId} threw: ${e.message}`);
      skippedCount++;
    }
  }
  console.log(`Replayed ${appliedCount} answers (${skippedCount} skipped due to errors)`);

  const replayed = getRespondentState();
  const replayedResults = getResults();

  console.log();
  console.log(`────── Archetype assignment delta ──────`);
  console.log(`stored:   ${stored.archetypeId} ${stored.archetypeName} · confidence ${(stored.confidence * 100).toFixed(2)}% · band ${stored.confidenceBand || "(none)"}`);
  console.log(`replayed: ${replayedResults.match.id} ${replayedResults.match.name} · confidence ${(replayedResults.confidence * 100).toFixed(2)}% · band ${replayedResults.confidenceBand}`);
  if (stored.archetypeId !== replayedResults.match.id) {
    console.log(`*** ARCHETYPE FLIPPED ***`);
  }

  console.log();
  console.log(`────── Per-node deltas (continuous) ──────`);
  console.log(`node    | stored pos | replay pos | Δpos    | stored sal | replay sal | Δsal`);
  console.log(`────────┼────────────┼────────────┼─────────┼────────────┼────────────┼───────`);
  for (const nid of CONTINUOUS_NODES) {
    const s = storedState.continuous?.[nid];
    const rNode = replayed.continuous?.[nid];
    if (!s || !rNode) continue;
    const sPos = typeof s.expectedPos === "number" ? s.expectedPos : expectedPos(s.posDist || []);
    const rPos = expectedPos(rNode.posDist as unknown as number[]);
    // SELF-cluster nodes (PF/TRB/ENG) drop salDist per ADR-005. Guard for both
    // missing-from-stored and missing-from-replay state.
    const sSal = typeof s.salience === "number"
      ? s.salience
      : (Array.isArray(s.salDist) ? expectedSal(s.salDist) : NaN);
    const rSal = Array.isArray(rNode.salDist) ? expectedSal(rNode.salDist as unknown as number[]) : NaN;
    const dPos = rPos - sPos;
    const dSal = (isNaN(sSal) || isNaN(rSal)) ? NaN : rSal - sSal;
    const flag = Math.abs(dPos) > 0.3 ? " ←" : "";
    const sSalStr = isNaN(sSal) ? "n/a " : sSal.toFixed(2);
    const rSalStr = isNaN(rSal) ? "n/a " : rSal.toFixed(2);
    const dSalStr = isNaN(dSal) ? "n/a" : (dSal >= 0 ? "+" : "") + dSal.toFixed(2);
    console.log(`${nid.padEnd(7)} |    ${sPos.toFixed(2)}    |    ${rPos.toFixed(2)}    | ${(dPos >= 0 ? "+" : "") + dPos.toFixed(2).padStart(6)} |    ${sSalStr}    |    ${rSalStr}    | ${dSalStr}${flag}`);
  }

  console.log();
  console.log(`────── Per-node deltas (categorical) ──────`);
  for (const nid of CATEGORICAL_NODES) {
    const s = storedState.categorical?.[nid];
    const rNode = replayed.categorical?.[nid];
    if (!s || !rNode) continue;
    const names = nid === "EPS" ? EPS_NAMES : AES_NAMES;
    const sTop = topCat(s.catDist || [0,0,0,0,0,0], names);
    const rTop = topCat(rNode.catDist as unknown as number[], names);
    const flipped = sTop.name !== rTop.name ? " ← FLIPPED" : "";
    console.log(`${nid.padEnd(7)}: stored top=${sTop.name} ${(sTop.prob*100).toFixed(0)}% · replayed top=${rTop.name} ${(rTop.prob*100).toFixed(0)}%${flipped}`);
  }

  console.log();
  console.log(`────── TRB anchor distribution ──────`);
  const labels = ["national","ideological","religious","class","ethnic_racial","gender","sexual","global","mixed_none"];
  const sAnchor = storedState.trbAnchor?.dist || new Array(9).fill(1/9);
  const rAnchor = replayed.trbAnchor?.dist || new Array(9).fill(1/9);
  console.log(`anchor          | stored | replay | Δ`);
  for (let i = 0; i < 9; i++) {
    const ds = sAnchor[i]; const dr = rAnchor[i];
    if (ds < 0.03 && dr < 0.03) continue;
    console.log(`${labels[i].padEnd(15)} | ${(ds * 100).toFixed(1).padStart(5)}% | ${(dr * 100).toFixed(1).padStart(5)}% | ${((dr - ds) * 100 >= 0 ? "+" : "") + ((dr - ds) * 100).toFixed(1)}pp`);
  }
  console.log(`(stored touches: ${storedState.trbAnchor?.touches ?? 0}, replay touches: ${replayed.trbAnchor?.touches ?? 0})`);

  console.log();
  console.log(`────── State metadata (Q200/Q211/Q212) ──────`);
  console.log(`partyID:         stored=${storedState.partyID ?? "(unset)"} replay=${(replayed as any).partyID ?? "(unset)"}`);
  console.log(`strategicVoting: stored=${storedState.strategicVoting ?? "(unset)"} replay=${(replayed as any).strategicVoting ?? "(unset)"}`);
  const sNeg = storedState.negativeParties; const rNeg = (replayed as any).negativeParties;
  console.log(`negativeParties: stored=${sNeg ? JSON.stringify(Array.isArray(sNeg) ? sNeg : Array.from(sNeg)) : "(unset)"} replay=${rNeg ? JSON.stringify(Array.from(rNeg)) : "(unset)"}`);
}

main().catch(e => { console.error(e); process.exit(1); });
