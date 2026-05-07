/**
 * Builds an HTML visualization showing which questions in the live bank
 * touch which moral-circle scopes (universal + 8 scoped).
 *
 * Reads optionEvidence / sliderMap / rankingMap from each question, looks
 * for moralCircle contributions, and produces a matrix:
 *
 *   rows    = questions that emit any moralCircle evidence
 *   columns = universal + 8 scopes
 *   cell    = highest contribution magnitude across all options/buckets
 *
 * Output: output/moral-circle-question-map.html
 *
 * Run with: npx tsx scripts/build-moral-circle-question-map.ts
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

import { REPRESENTATIVE_QUESTIONS } from "../src/config/questions.representative.js";
import type { QuestionDef } from "../src/types.js";

const OUT_PATH = "output/moral-circle-question-map.html";

const SCOPE_KEYS = [
  "universal",
  "national",
  "religious",
  "ethnic_racial",
  "class",
  "gender",
  "sexual",
  "ideological",
  "political_camp",
] as const;
type ScopeKey = typeof SCOPE_KEYS[number];

const SCOPE_LABELS: Record<ScopeKey, string> = {
  universal: "Universal",
  national: "National",
  religious: "Religious",
  ethnic_racial: "Ethnic / Racial",
  class: "Class",
  gender: "Gender",
  sexual: "Sexual",
  ideological: "Ideological",
  political_camp: "Political Camp",
};

interface ScopeContribution {
  /** Highest magnitude (0..100) emitted to this scope across all options/buckets/items. */
  maxValue: number;
  /** Number of distinct options/buckets/items that emit to this scope. */
  optionCount: number;
}

interface QuestionMapping {
  qid: number;
  promptShort: string;
  promptFull: string | null;
  uiType: string;
  stage: string;
  scopes: Partial<Record<ScopeKey, ScopeContribution>>;
}

function recordContribution(
  out: Partial<Record<ScopeKey, ScopeContribution>>,
  scope: ScopeKey,
  value: number | null | undefined,
): void {
  if (value === null || value === undefined) return;
  if (typeof value !== "number" || !Number.isFinite(value)) return;
  const existing = out[scope] ?? { maxValue: 0, optionCount: 0 };
  if (value > existing.maxValue) existing.maxValue = value;
  existing.optionCount += 1;
  out[scope] = existing;
}

function harvestMoralCircle(ev: any, out: Partial<Record<ScopeKey, ScopeContribution>>): void {
  if (!ev || typeof ev !== "object") return;
  const mc = ev.moralCircle;
  if (!mc || typeof mc !== "object") return;
  if (typeof mc.universal === "number") {
    recordContribution(out, "universal", mc.universal);
  }
  if (mc.scopedAffinities && typeof mc.scopedAffinities === "object") {
    for (const key of Object.keys(mc.scopedAffinities)) {
      if ((SCOPE_KEYS as readonly string[]).includes(key) && key !== "universal") {
        recordContribution(out, key as ScopeKey, mc.scopedAffinities[key]);
      }
    }
  }
}

function harvestQuestion(q: QuestionDef): QuestionMapping | null {
  const out: Partial<Record<ScopeKey, ScopeContribution>> = {};

  // optionEvidence: per-option OptionEvidence
  if ((q as any).optionEvidence) {
    for (const ev of Object.values((q as any).optionEvidence as Record<string, any>)) {
      harvestMoralCircle(ev, out);
    }
  }
  // sliderMap: per-bucket OptionEvidence
  if ((q as any).sliderMap) {
    for (const ev of Object.values((q as any).sliderMap as Record<string, any>)) {
      harvestMoralCircle(ev, out);
    }
  }
  // rankingMap: per-item RankingItemMap (which itself can carry moralCircle)
  if ((q as any).rankingMap) {
    for (const ev of Object.values((q as any).rankingMap as Record<string, any>)) {
      harvestMoralCircle(ev, out);
    }
  }
  // bestWorstMap: per-item RankingItemMap
  if ((q as any).bestWorstMap) {
    for (const ev of Object.values((q as any).bestWorstMap as Record<string, any>)) {
      harvestMoralCircle(ev, out);
    }
  }
  // allocationMap: per-bucket AllocationBucketMap
  if ((q as any).allocationMap) {
    for (const ev of Object.values((q as any).allocationMap as Record<string, any>)) {
      harvestMoralCircle(ev, out);
    }
  }
  // pairMaps: per-pair PairOptionMap
  if ((q as any).pairMaps) {
    for (const ev of Object.values((q as any).pairMaps as Record<string, any>)) {
      harvestMoralCircle(ev, out);
    }
  }

  if (Object.keys(out).length === 0) return null;

  return {
    qid: q.id,
    promptShort: q.promptShort,
    promptFull: (q as any).promptFull ?? null,
    uiType: q.uiType,
    stage: q.stage,
    scopes: out,
  };
}

function escHtml(s: string): string {
  return String(s).replace(/[&<>"']/g, c =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!)
  );
}

function cellShade(value: number): string {
  // 0..100 magnitude → opacity 0..1 of the scope's color.
  const a = Math.max(0, Math.min(1, value / 100));
  return `rgba(91, 154, 160, ${(0.2 + a * 0.65).toFixed(3)})`;
}

function renderHtml(mappings: QuestionMapping[]): string {
  // Aggregate stats
  const scopeQuestionCount: Record<ScopeKey, number> = Object.fromEntries(
    SCOPE_KEYS.map(k => [k, 0]),
  ) as any;
  for (const m of mappings) {
    for (const s of SCOPE_KEYS) {
      if (m.scopes[s]) scopeQuestionCount[s]++;
    }
  }

  const headerCols = SCOPE_KEYS.map(s => {
    const cls = s === "universal" ? "scope-universal" : "scope-scoped";
    return `<th class="${cls}"><div class="scope-name">${SCOPE_LABELS[s]}</div><div class="scope-count">${scopeQuestionCount[s]}</div></th>`;
  }).join("");

  const sorted = [...mappings].sort((a, b) => a.qid - b.qid);
  const rows = sorted.map(m => {
    const cells = SCOPE_KEYS.map(s => {
      const c = m.scopes[s];
      if (!c) return `<td class="cell empty"></td>`;
      const bg = cellShade(c.maxValue);
      const optHint = c.optionCount > 1 ? ` (${c.optionCount} options)` : "";
      const tip = `max ${Math.round(c.maxValue)} / 100${optHint}`;
      return `<td class="cell" style="background:${bg};" title="${tip}">${Math.round(c.maxValue)}</td>`;
    }).join("");
    return `<tr>
      <td class="row-label">
        <div class="qid">Q${m.qid}</div>
        <div class="prompt">${escHtml(m.promptShort)}</div>
        <div class="meta">${escHtml(m.uiType)} · ${escHtml(m.stage)}</div>
        ${m.promptFull ? `<div class="prompt-full">${escHtml(m.promptFull)}</div>` : ""}
      </td>
      ${cells}
    </tr>`;
  }).join("\n");

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Moral Circle — Question Coverage Map</title>
<style>
  body { font: 13px -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif; margin: 24px; color: #222; background: #fafbfc; }
  h1 { margin: 0 0 4px 0; font-size: 20px; }
  .subtitle { color: #666; margin: 0 0 20px 0; font-size: 13px; max-width: 900px; line-height: 1.5; }
  .legend { display: flex; gap: 16px; margin: 14px 0 22px 0; align-items: center; font-size: 12px; }
  .legend-grad { width: 200px; height: 14px; border: 1px solid #aaa; background: linear-gradient(to right, rgba(91, 154, 160, 0.2), rgba(91, 154, 160, 0.85)); }
  table { border-collapse: separate; border-spacing: 0; font-size: 12px; }
  th, td { padding: 6px 8px; border: 1px solid #d4dde4; vertical-align: middle; }
  thead th { background: #f3f6f9; text-align: center; font-weight: 600; }
  th.scope-universal { background: #e6f0ff; min-width: 90px; }
  th.scope-scoped { background: #f8f1ff; min-width: 90px; }
  .scope-count { font-size: 10px; color: #666; font-weight: 400; margin-top: 2px; }
  td.row-label { text-align: left; max-width: 380px; background: #fff; }
  td.row-label .qid { font-size: 12px; font-weight: 700; color: #1a4480; display: inline-block; margin-right: 6px; }
  td.row-label .prompt { display: inline; font-size: 12px; color: #333; font-weight: 600; }
  td.row-label .meta { font-size: 10px; color: #777; margin-top: 2px; }
  td.row-label .prompt-full { font-size: 11px; color: #555; margin-top: 4px; line-height: 1.45; font-style: italic; }
  td.cell { text-align: center; font-size: 11px; font-weight: 600; color: #1a3a3d; }
  td.cell.empty { background: #fff; color: #ccc; }
  .summary { margin-top: 28px; max-width: 900px; }
  .summary h2 { font-size: 15px; margin: 0 0 8px 0; }
  .summary p { line-height: 1.5; color: #333; }
</style>
</head>
<body>

<h1>Moral Circle — Question Coverage Map</h1>
<p class="subtitle">
  Maps each question in the live representative bank to the moral-circle scopes it emits evidence for.
  Cell value = the highest magnitude (0–100) any option/bucket/item in that question pushes onto the scope.
  Empty cell = the question doesn't touch that scope. The scope <strong>universal</strong> is the baseline;
  the eight scoped affinities are <strong>active</strong> only when a respondent's value exceeds their universal baseline.
</p>

<div class="legend">
  <span>Magnitude:</span>
  <div class="legend-grad"></div>
  <span>0 → 100</span>
</div>

<table>
  <thead>
    <tr>
      <th class="row-label" style="text-align:left; min-width: 320px;">Question</th>
      ${headerCols}
    </tr>
  </thead>
  <tbody>
    ${rows}
  </tbody>
</table>

<div class="summary">
  <h2>Reading the map</h2>
  <p>
    Battery A (Q230, Q231) is the primary source for <strong>universal</strong>: each slider bucket emits a single universal value.
    Battery B (Q232–Q239) gives one column its own dedicated probe — each scoped question emits magnitudes 30/50/70/90 on its target scope per option.
    A few legacy questions (Q60 identity ranking, Q102 membership criteria, Q8 domestic-vs-abroad, Q213 equal-standing) emit lighter signal across multiple scopes.
  </p>
</div>

</body>
</html>`;
}

function main(): void {
  const mappings: QuestionMapping[] = [];
  for (const q of REPRESENTATIVE_QUESTIONS) {
    const m = harvestQuestion(q);
    if (m) mappings.push(m);
  }

  const html = renderHtml(mappings);
  mkdirSync(dirname(OUT_PATH), { recursive: true });
  writeFileSync(OUT_PATH, html, "utf8");
  console.log(`Wrote ${OUT_PATH}`);
  console.log(`Questions emitting moralCircle evidence: ${mappings.length}`);
  for (const s of SCOPE_KEYS) {
    const n = mappings.filter(m => m.scopes[s]).length;
    console.log(`  ${SCOPE_LABELS[s]}: ${n} question${n === 1 ? "" : "s"}`);
  }
}

main();
