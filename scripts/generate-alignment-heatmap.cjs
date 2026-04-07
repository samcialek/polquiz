/**
 * Generate a world alignment heatmap: archetypes (rows) x regime periods (columns),
 * colored by alignment score on a diverging red-white-green scale.
 *
 * Usage: node scripts/generate-alignment-heatmap.cjs
 */

const { readFileSync, writeFileSync } = require("fs");
const { join } = require("path");

const alignments = JSON.parse(readFileSync(join(__dirname, "../output/live-data/alignments.json"), "utf8"));
const archetypesArr = JSON.parse(readFileSync(join(__dirname, "../output/live-data/archetypes.json"), "utf8"));

// ── Build archetype lookup ────────────────────────────────────────────────

const archNames = {};
const archDescs = {};
for (const a of archetypesArr) {
  archNames[String(a.id)] = a.name;
  archDescs[String(a.id)] = a.description || '';
}
const archIds = Object.keys(alignments).sort((a, b) => parseInt(a) - parseInt(b));

// ── Build column list: jurisdiction | regime ordered by jurisdiction then startYear ──

const columns = []; // { jurisdiction, regime, startYear, endYear, key }
const sample = alignments[archIds[0]];
for (const [jur, regimes] of Object.entries(sample)) {
  for (const r of regimes) {
    columns.push({
      jurisdiction: jur,
      regime: r.r,
      startYear: r.s,
      endYear: r.e,
      key: `${jur}|${r.r}`,
    });
  }
}

// Group columns by jurisdiction for header spans
const jurisdictionGroups = [];
let currentJur = null;
let currentCount = 0;
for (const col of columns) {
  if (col.jurisdiction !== currentJur) {
    if (currentJur) jurisdictionGroups.push({ name: currentJur, count: currentCount });
    currentJur = col.jurisdiction;
    currentCount = 1;
  } else {
    currentCount++;
  }
}
if (currentJur) jurisdictionGroups.push({ name: currentJur, count: currentCount });

// ── Color scale: diverging red → white → green ───────────────────────────

function alignmentColor(score) {
  // Score range: approximately -2.5 to +3.0
  // Clamp to -2.5 ... +2.5 for color mapping
  const clamped = Math.max(-2.5, Math.min(2.5, score));

  if (clamped >= 0) {
    // White → Green
    const t = clamped / 2.5;
    const r = Math.round(255 - t * 200);
    const g = Math.round(255 - t * 60);
    const b = Math.round(255 - t * 210);
    return `rgb(${r},${g},${b})`;
  } else {
    // White → Red
    const t = -clamped / 2.5;
    const r = Math.round(255 - t * 40);
    const g = Math.round(255 - t * 200);
    const b = Math.round(255 - t * 200);
    return `rgb(${r},${g},${b})`;
  }
}

function textColor(score) {
  return Math.abs(score) > 1.5 ? "#fff" : "#333";
}

// ── Build alignment lookup per archetype ──────────────────────────────────

function getScore(archId, jurisdiction, regime) {
  const arch = alignments[archId];
  if (!arch || !arch[jurisdiction]) return null;
  for (const r of arch[jurisdiction]) {
    if (r.r === regime) return r.v;
  }
  return null;
}

// ── HTML ──────────────────────────────────────────────────────────────────

function esc(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function buildHtml() {
  // Jurisdiction header row
  let jurHeaderCells = `<th class="corner sticky-col sticky-top" rowspan="2">Archetype</th>`;
  for (const jg of jurisdictionGroups) {
    jurHeaderCells += `<th class="jur-header sticky-top" colspan="${jg.count}">${esc(jg.name)}</th>`;
  }

  // Regime header row
  let regimeHeaderCells = "";
  for (const col of columns) {
    const label = `${col.regime}`;
    const title = `${col.jurisdiction}: ${col.regime} (${col.startYear}-${col.endYear})`;
    regimeHeaderCells += `<th class="regime-header sticky-top2" title="${esc(title)}">${esc(label)}</th>`;
  }

  // Data rows
  let rows = "";
  for (const id of archIds) {
    const name = archNames[id] || id;
    const desc = archDescs[id] || '';
    const rowTitle = desc ? `${name}\n\n${desc}` : name;
    let cells = `<td class="row-header sticky-col" title="${esc(rowTitle)}"><span class="arch-id">${id}</span>${esc(name)}</td>`;

    for (const col of columns) {
      const score = getScore(id, col.jurisdiction, col.regime);
      if (score == null) {
        cells += `<td class="cell empty"></td>`;
      } else {
        const bg = alignmentColor(score);
        const fg = textColor(score);
        const title = `${name} × ${col.jurisdiction}: ${col.regime} (${col.startYear}-${col.endYear})\nAlignment: ${score.toFixed(3)}`;
        cells += `<td class="cell" style="background:${bg};color:${fg}" title="${esc(title)}"></td>`;
      }
    }
    rows += `<tr>${cells}</tr>\n`;
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>PRISM &mdash; World Alignment Heatmap</title>
<style>
  :root {
    --bg: #0d1117; --card: #161b22; --border: #21262d;
    --text: #c9d1d9; --muted: #8b949e; --accent: #58a6ff;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
    background: var(--bg); color: var(--text); padding: 20px;
  }
  h1 { font-size: 24px; font-weight: 600; margin-bottom: 4px; }
  .subtitle { color: var(--muted); font-size: 14px; margin-bottom: 16px; }

  .legend {
    display: flex; gap: 16px; align-items: center; margin-bottom: 20px;
    padding: 12px 16px; background: var(--card); border: 1px solid var(--border);
    border-radius: 8px; font-size: 12px; flex-wrap: wrap;
  }
  .legend-bar {
    display: flex; height: 18px; border-radius: 3px; overflow: hidden; width: 300px;
  }
  .legend-bar div { flex: 1; }
  .legend-labels { display: flex; justify-content: space-between; width: 300px; font-size: 10px; color: var(--muted); }

  .table-wrap {
    overflow: auto; max-height: 90vh;
    border: 1px solid var(--border); border-radius: 8px; background: var(--card);
    position: relative;
  }
  table { border-collapse: collapse; font-size: 10px; white-space: nowrap; }

  /* Jurisdiction header */
  th.corner {
    position: sticky; left: 0; top: 0; z-index: 10;
    background: #1c2128; padding: 4px 10px;
    border-bottom: 1px solid var(--border); border-right: 1px solid var(--border);
  }
  th.jur-header {
    position: sticky; top: 0; z-index: 5;
    background: #1c2128; color: var(--accent); font-weight: 600;
    padding: 4px 2px; text-align: center; font-size: 10px;
    border-bottom: 1px solid var(--border);
    border-left: 2px solid var(--accent);
  }
  th.jur-header:first-of-type { border-left: none; }
  th.sticky-top { position: sticky; top: 0; z-index: 5; }
  th.sticky-top2 { position: sticky; top: 24px; z-index: 4; }

  /* Regime header */
  th.regime-header {
    background: #1c2128; color: var(--muted); font-weight: 400;
    padding: 2px 1px; text-align: center; font-size: 8px;
    border-bottom: 2px solid var(--border);
    writing-mode: vertical-rl; text-orientation: mixed;
    height: 100px; max-width: 14px; min-width: 14px;
  }

  /* Row header */
  td.row-header {
    position: sticky; left: 0; z-index: 3;
    background: #1c2128; padding: 1px 8px;
    border-right: 1px solid var(--border);
    font-size: 10px; white-space: nowrap;
  }
  .arch-id { font-family: monospace; color: var(--muted); font-size: 9px; margin-right: 4px; }

  /* Data cells */
  td.cell {
    width: 14px; min-width: 14px; max-width: 14px;
    height: 16px; text-align: center; font-size: 0;
    border: 0.5px solid rgba(0,0,0,0.2); cursor: default; padding: 0;
  }
  td.cell.empty { background: #0d1117; }

  /* Hover */
  tr:hover td.row-header { background: #272d35 !important; }
  td.cell:hover { outline: 2px solid var(--accent); outline-offset: -1px; z-index: 2; position: relative; }

  /* Zebra */
  tr:nth-child(even) td.row-header { background: #171d25; }
  tr:nth-child(even):hover td.row-header { background: #272d35 !important; }

  footer { text-align: center; color: var(--muted); font-size: 11px; padding: 16px 0; }
</style>
</head>
<body>
<h1>PRISM World Alignment Heatmap</h1>
<p class="subtitle">${archIds.length} archetypes &times; ${columns.length} regime periods across ${jurisdictionGroups.length} jurisdictions. Hover cells for details.</p>

<div class="legend">
  <span>Alignment:</span>
  <div>
    <div class="legend-bar">
      ${[-2.5,-2,-1.5,-1,-0.5,0,0.5,1,1.5,2,2.5].map(v => `<div style="background:${alignmentColor(v)}"></div>`).join("")}
    </div>
    <div class="legend-labels">
      <span>&minus;2.5 (opposed)</span>
      <span>0</span>
      <span>+2.5 (aligned)</span>
    </div>
  </div>
</div>

<div class="table-wrap">
<table>
<thead>
  <tr>${jurHeaderCells}</tr>
  <tr>${regimeHeaderCells}</tr>
</thead>
<tbody>
${rows}
</tbody>
</table>
</div>

<footer>Generated ${new Date().toISOString().slice(0, 10)} &mdash; ${archIds.length} &times; ${columns.length} = ${(archIds.length * columns.length).toLocaleString()} alignment scores</footer>
</body>
</html>`;
}

const html = buildHtml();
const outPath = join(__dirname, "../output/alignment-heatmap.html");
writeFileSync(outPath, html);
console.log(`Wrote ${outPath}`);
console.log(`${archIds.length} archetypes x ${columns.length} regimes = ${archIds.length * columns.length} cells`);
