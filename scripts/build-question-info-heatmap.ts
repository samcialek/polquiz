/**
 * Build a static HTML heatmap of declared signal weight (position vs salience)
 * for each fixed-front-door question × node pair.
 *
 * Reads source-of-truth: REPRESENTATIVE_QUESTIONS + CORE_OPENER + UNIVERSAL_SCREENERS.
 * Aggregates touchProfile entries by (node, role) using SUM (intentional —
 * total declared signal landing on each axis, not max).
 *
 * Output: question-info-heatmap.html (sibling to quiz-v2-live.html, opens via file://).
 *
 * No engine code is touched. Pure presentation.
 *
 * Usage: npx tsx scripts/build-question-info-heatmap.ts
 */

import { promises as fs } from "node:fs";
import * as path from "node:path";

import type { QuestionDef, NodeId, TouchTarget } from "../src/types.js";
import { REPRESENTATIVE_QUESTIONS } from "../src/config/questions.representative.js";
import { CORE_OPENER, UNIVERSAL_SCREENERS } from "../src/engine/config.js";

const CONTINUOUS_NODES = ["MAT", "CD", "CU", "MOR", "PRO", "COM", "ZS", "ONT_H", "ONT_S", "PF", "TRB", "ENG"] as const;
const CATEGORICAL_NODES = ["EPS", "AES"] as const;
const ANCHOR_KEY = "TRB_ANCHOR";

const CLUSTER_OF: Record<string, string> = {
  MAT: "ENDS", CD: "ENDS", CU: "ENDS", MOR: "ENDS",
  PRO: "MEANS", AES: "MEANS", COM: "MEANS",
  ZS: "REALITY", ONT_H: "REALITY", ONT_S: "REALITY", EPS: "REALITY",
  PF: "SELF", TRB: "SELF", ENG: "SELF",
  TRB_ANCHOR: "ANCHOR",
};

// Column order — matches CLAUDE.md cluster ordering.
const COLUMN_ORDER: { node: string; isCategorical: boolean; isAnchor: boolean }[] = [
  ...CONTINUOUS_NODES.slice(0, 4).map(n => ({ node: n as string, isCategorical: false, isAnchor: false })),     // ENDS
  { node: "PRO", isCategorical: false, isAnchor: false },
  { node: "EPS", isCategorical: true,  isAnchor: false },
  { node: "AES", isCategorical: true,  isAnchor: false },
  { node: "COM", isCategorical: false, isAnchor: false },                                                       // MEANS
  { node: "ZS",    isCategorical: false, isAnchor: false },
  { node: "ONT_H", isCategorical: false, isAnchor: false },
  { node: "ONT_S", isCategorical: false, isAnchor: false },                                                     // REALITY
  { node: "PF",  isCategorical: false, isAnchor: false },
  { node: "TRB", isCategorical: false, isAnchor: false },
  { node: "ENG", isCategorical: false, isAnchor: false },                                                       // SELF
  { node: "TRB_ANCHOR", isCategorical: false, isAnchor: true },
];

interface Cell {
  pos: number;       // continuous position OR categorical category weight
  sal: number;
  anchor: number;
  touches: TouchTarget[];
}

interface Row {
  id: number;
  promptShort: string;
  uiType: string;
  stage: string;
  band: "CORE_OPENER" | "UNIVERSAL_SCREENERS";
  bandIndex: number;
  cells: Record<string, Cell>;       // keyed by node id (or "TRB_ANCHOR")
  totalWeight: number;
  breadth: number;                   // distinct nodes touched
  touchCount: number;
}

function aggregate(q: QuestionDef): Record<string, Cell> {
  const cells: Record<string, Cell> = {};
  for (const t of q.touchProfile) {
    const key = t.node;
    if (!cells[key]) cells[key] = { pos: 0, sal: 0, anchor: 0, touches: [] };
    cells[key].touches.push(t);
    if (t.role === "position" || t.role === "category") cells[key].pos += t.weight;
    else if (t.role === "salience") cells[key].sal += t.weight;
    else if (t.role === "anchor") cells[key].anchor += t.weight;
  }
  return cells;
}

function buildRows(): Row[] {
  const rows: Row[] = [];
  const bands: { name: "CORE_OPENER" | "UNIVERSAL_SCREENERS"; ids: readonly number[] }[] = [
    { name: "CORE_OPENER", ids: CORE_OPENER },
    { name: "UNIVERSAL_SCREENERS", ids: UNIVERSAL_SCREENERS },
  ];
  for (const band of bands) {
    band.ids.forEach((id, idx) => {
      const q = REPRESENTATIVE_QUESTIONS.find(qq => qq.id === id);
      if (!q) {
        console.warn(`Fixed-front-door id ${id} not found in REPRESENTATIVE_QUESTIONS`);
        return;
      }
      const cells = aggregate(q);
      const totalWeight = q.touchProfile.reduce((s, t) => s + t.weight, 0);
      const breadth = new Set(q.touchProfile.map(t => t.node)).size;
      rows.push({
        id: q.id,
        promptShort: q.promptShort,
        uiType: q.uiType,
        stage: q.stage,
        band: band.name,
        bandIndex: idx,
        cells,
        totalWeight,
        breadth,
        touchCount: q.touchProfile.length,
      });
    });
  }
  return rows;
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
}

function buildHtml(rows: Row[]): string {
  const dataJson = JSON.stringify({ rows, columns: COLUMN_ORDER, clusters: CLUSTER_OF }, null, 2);
  // The HTML body: header, legend, controls, table; vanilla JS renders cells, tooltips, sort, expand.
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>Fixed Front-Door Question Information Heatmap</title>
<style>
  :root {
    --bg: #ffffff;
    --fg: #1a1a1a;
    --muted: #6b6b6b;
    --grid-line: #e0e0e0;
    --empty-cell: #f3f3f3;
    --core-band: #fafafa;
    --universal-band: #f5f5f5;
    --tooltip-bg: #1a1a1a;
    --tooltip-fg: #ffffff;
    --info-bar-fill: #4a4a4a;
  }
  * { box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif; margin: 0; padding: 24px; color: var(--fg); background: var(--bg); }
  h1 { font-size: 1.4rem; margin: 0 0 4px 0; }
  .subtitle { color: var(--muted); font-size: 0.85rem; margin-bottom: 20px; }
  .controls { display: flex; gap: 12px; align-items: center; margin-bottom: 16px; flex-wrap: wrap; }
  .controls button { padding: 6px 12px; font-size: 0.8rem; cursor: pointer; border: 1px solid #c0c0c0; background: #fafafa; border-radius: 4px; }
  .controls button.active { background: #1a1a1a; color: white; border-color: #1a1a1a; }
  .controls label { font-size: 0.8rem; color: var(--muted); }

  .legend { display: flex; gap: 24px; align-items: center; margin-bottom: 16px; font-size: 0.8rem; }
  .legend-row { display: flex; align-items: center; gap: 8px; }
  .legend-bar { display: flex; height: 14px; width: 140px; border: 1px solid #c0c0c0; }
  .legend-bar > div { flex: 1; }

  .summary { font-size: 0.8rem; color: var(--muted); margin-bottom: 12px; }

  .table-wrap { overflow: auto; border: 1px solid var(--grid-line); border-radius: 4px; max-height: calc(100vh - 240px); }
  table { border-collapse: collapse; font-size: 0.7rem; }
  th, td { padding: 0; text-align: center; border-right: 1px solid var(--grid-line); border-bottom: 1px solid var(--grid-line); }

  th.cluster { font-weight: 600; padding: 6px 8px; background: #f8f8f8; position: sticky; top: 0; z-index: 3; border-bottom: 1px solid #c0c0c0; }
  th.node { font-weight: 500; font-size: 0.75rem; padding: 4px 0; background: #f8f8f8; position: sticky; top: 24px; z-index: 3; min-width: 24px; }
  th.role { font-weight: 400; font-size: 0.65rem; color: var(--muted); padding: 3px 0 4px 0; background: #fcfcfc; position: sticky; top: 50px; z-index: 3; min-width: 24px; }

  th.qhead, td.qcell { text-align: left; position: sticky; left: 0; background: var(--bg); z-index: 2; padding: 6px 10px; min-width: 220px; max-width: 260px; border-right: 1px solid #c0c0c0; }
  th.qhead { background: #f8f8f8; z-index: 4; top: 0; height: 73px; }
  td.qcell { font-size: 0.78rem; cursor: pointer; }
  td.qcell .qid { font-weight: 600; font-family: ui-monospace, "SF Mono", monospace; }
  td.qcell .qprompt { display: block; color: #2a2a2a; font-size: 0.78rem; }
  td.qcell .qmeta { display: block; color: var(--muted); font-size: 0.7rem; margin-top: 2px; }

  td.cell { width: 24px; height: 24px; }
  td.cell.empty { background: var(--empty-cell); }
  td.cell-divider { border-right: 1px solid #b0b0b0; }
  td.cluster-divider { border-right: 2px solid #888; }

  tr.band-row td { background: #ececec; padding: 6px 10px; font-weight: 600; font-size: 0.75rem; color: #444; text-transform: uppercase; letter-spacing: 0.05em; }
  tr.detail-row td { background: #fafafa; padding: 10px 16px; font-size: 0.75rem; color: #333; border-top: none; }
  tr.detail-row pre { margin: 0; white-space: pre-wrap; font-family: ui-monospace, "SF Mono", monospace; font-size: 0.7rem; }

  td.info-bar-cell { width: 110px; padding: 0 8px; position: sticky; right: 0; background: var(--bg); border-left: 1px solid #c0c0c0; }
  th.info-bar-head { width: 110px; background: #f8f8f8; padding: 4px 8px; font-size: 0.7rem; text-align: left; position: sticky; right: 0; top: 0; z-index: 3; }
  .info-bar { height: 8px; background: var(--info-bar-fill); border-radius: 1px; }
  .info-bar-num { font-size: 0.65rem; color: var(--muted); margin-top: 2px; font-family: ui-monospace, monospace; }

  #tooltip { position: fixed; pointer-events: none; background: var(--tooltip-bg); color: var(--tooltip-fg); padding: 8px 12px; border-radius: 4px; font-size: 0.7rem; line-height: 1.5; z-index: 1000; opacity: 0; transition: opacity 0.1s; max-width: 320px; white-space: pre-wrap; font-family: ui-monospace, monospace; }
  #tooltip.visible { opacity: 1; }
</style>
</head>
<body>
<h1>Fixed Front-Door Question Information Heatmap</h1>
<div class="subtitle">15 fixed questions (10 CORE_OPENER + 5 UNIVERSAL_SCREENERS) — declared signal weight per node, summed over touchProfile by role.</div>

<div class="controls">
  <span>Sort:</span>
  <button id="sort-default" class="active" onclick="setSort('default')">Front-door order</button>
  <button id="sort-total" onclick="setSort('total')">Total weight ↓</button>
  <button id="sort-breadth" onclick="setSort('breadth')">Breadth ↓</button>
</div>

<div class="legend">
  <div class="legend-row"><span>Position / Category:</span><div class="legend-bar" id="legend-pos"></div><span>0 → 1.0</span></div>
  <div class="legend-row"><span>Salience:</span><div class="legend-bar" id="legend-sal"></div><span>0 → 1.0</span></div>
  <div class="legend-row"><span>Anchor:</span><div class="legend-bar" id="legend-anc"></div><span>0 → 1.0</span></div>
  <div class="legend-row" style="color: var(--muted);">Click any row to expand the full touchProfile.</div>
</div>

<div class="summary" id="summary"></div>

<div class="table-wrap">
  <table id="heatmap"></table>
</div>

<div id="tooltip"></div>

<script>
const HEATMAP_DATA = ${dataJson};

// Color palettes (sequential, light → dark) — d3-like cubehelix-ish gradients defined inline.
function palettePos(t) {
  // light blue (#f7fbff) → deep blue (#08306b)
  const stops = [[247,251,255],[222,235,247],[198,219,239],[158,202,225],[107,174,214],[66,146,198],[33,113,181],[8,81,156],[8,48,107]];
  return interp(stops, t);
}
function paletteSal(t) {
  // light orange (#fff5eb) → deep orange (#7f2704)
  const stops = [[255,245,235],[254,230,206],[253,208,162],[253,174,107],[253,141,60],[241,105,19],[217,72,1],[166,54,3],[127,39,4]];
  return interp(stops, t);
}
function paletteAnc(t) {
  // light purple → deep purple
  const stops = [[252,251,253],[239,237,245],[218,218,235],[188,189,220],[158,154,200],[128,125,186],[106,81,163],[84,39,143],[63,0,125]];
  return interp(stops, t);
}
function interp(stops, t) {
  if (t <= 0) return rgb(stops[0]);
  if (t >= 1) return rgb(stops[stops.length-1]);
  const x = t * (stops.length - 1);
  const i = Math.floor(x);
  const f = x - i;
  const a = stops[i], b = stops[i+1];
  return rgb([a[0]+(b[0]-a[0])*f, a[1]+(b[1]-a[1])*f, a[2]+(b[2]-a[2])*f]);
}
function rgb(c) { return 'rgb(' + Math.round(c[0]) + ',' + Math.round(c[1]) + ',' + Math.round(c[2]) + ')'; }

// Build legend gradients
function buildLegendGradient(elId, paletteFn) {
  const el = document.getElementById(elId);
  for (let i = 0; i < 20; i++) {
    const div = document.createElement('div');
    div.style.background = paletteFn(i / 19);
    el.appendChild(div);
  }
}
buildLegendGradient('legend-pos', palettePos);
buildLegendGradient('legend-sal', paletteSal);
buildLegendGradient('legend-anc', paletteAnc);

// Compute max info-bar reference value
const maxTotal = Math.max(...HEATMAP_DATA.rows.map(r => r.totalWeight));

let currentSort = 'default';
let expandedRows = new Set();

function setSort(s) {
  currentSort = s;
  document.querySelectorAll('.controls button').forEach(b => b.classList.remove('active'));
  document.getElementById('sort-' + s).classList.add('active');
  render();
}

function sortedRows() {
  const rows = [...HEATMAP_DATA.rows];
  if (currentSort === 'total') rows.sort((a,b) => b.totalWeight - a.totalWeight);
  else if (currentSort === 'breadth') rows.sort((a,b) => b.breadth - a.breadth);
  return rows;
}

function summary() {
  const rows = HEATMAP_DATA.rows;
  const total = rows.length;
  const grandTotal = rows.reduce((s,r) => s + r.totalWeight, 0).toFixed(2);
  const meanBreadth = (rows.reduce((s,r) => s + r.breadth, 0) / total).toFixed(1);
  return total + ' fixed questions · combined declared weight ' + grandTotal + ' · mean nodes-per-question ' + meanBreadth;
}

function renderHeader() {
  const cols = HEATMAP_DATA.columns;
  // Cluster row
  const clusterRow = document.createElement('tr');
  const qhead = document.createElement('th');
  qhead.className = 'qhead';
  qhead.rowSpan = 3;
  qhead.textContent = 'Question';
  clusterRow.appendChild(qhead);

  // Group cols by cluster, with cluster boundary markers
  let currentCluster = null;
  let currentClusterCount = 0;
  const clusterCells = [];
  cols.forEach((c, i) => {
    const cluster = HEATMAP_DATA.clusters[c.node];
    if (cluster !== currentCluster) {
      if (currentCluster) clusterCells.push({ cluster: currentCluster, span: currentClusterCount });
      currentCluster = cluster;
      currentClusterCount = 1;
    } else {
      currentClusterCount++;
    }
  });
  if (currentCluster) clusterCells.push({ cluster: currentCluster, span: currentClusterCount });
  clusterCells.forEach(cc => {
    const th = document.createElement('th');
    th.className = 'cluster';
    th.colSpan = cc.span * 2; // each node is 2 sub-cols
    th.textContent = cc.cluster;
    clusterRow.appendChild(th);
  });
  const ihead = document.createElement('th');
  ihead.className = 'info-bar-head';
  ihead.rowSpan = 3;
  ihead.textContent = 'Total signal';
  clusterRow.appendChild(ihead);

  // Node row
  const nodeRow = document.createElement('tr');
  cols.forEach((c, i) => {
    const th = document.createElement('th');
    th.className = 'node';
    th.colSpan = 2;
    th.textContent = c.node === 'TRB_ANCHOR' ? 'TRB·anc' : c.node;
    if (i+1 < cols.length && HEATMAP_DATA.clusters[cols[i+1].node] !== HEATMAP_DATA.clusters[c.node]) {
      th.style.borderRight = '2px solid #888';
    }
    nodeRow.appendChild(th);
  });

  // Role row
  const roleRow = document.createElement('tr');
  cols.forEach((c, i) => {
    const posTh = document.createElement('th');
    posTh.className = 'role';
    posTh.textContent = c.isCategorical ? 'cat' : (c.isAnchor ? 'anc' : 'pos');
    roleRow.appendChild(posTh);
    const salTh = document.createElement('th');
    salTh.className = 'role';
    salTh.textContent = c.isAnchor ? '' : 'sal';
    if (i+1 < cols.length && HEATMAP_DATA.clusters[cols[i+1].node] !== HEATMAP_DATA.clusters[c.node]) {
      salTh.style.borderRight = '2px solid #888';
    }
    roleRow.appendChild(salTh);
  });

  return [clusterRow, nodeRow, roleRow];
}

function renderRow(row) {
  const tr = document.createElement('tr');
  tr.dataset.qid = row.id;
  if (expandedRows.has(row.id)) tr.classList.add('expanded');

  const qcell = document.createElement('td');
  qcell.className = 'qcell';
  qcell.innerHTML = '<span class="qid">Q' + row.id + '</span> <span class="qprompt">' + escapeHtml(row.promptShort) + '</span><span class="qmeta">' + row.uiType + ' · ' + row.stage + ' · ' + row.touchCount + ' touches · ' + row.breadth + ' nodes</span>';
  qcell.onclick = () => toggleExpand(row.id);
  tr.appendChild(qcell);

  HEATMAP_DATA.columns.forEach((c, i) => {
    const cell = row.cells[c.node] || { pos: 0, sal: 0, anchor: 0, touches: [] };
    const isLastInCluster = (i+1 < HEATMAP_DATA.columns.length && HEATMAP_DATA.clusters[HEATMAP_DATA.columns[i+1].node] !== HEATMAP_DATA.clusters[c.node]);

    // Pos / Cat / Anc cell
    const posTd = document.createElement('td');
    posTd.className = 'cell';
    let posWeight = c.isAnchor ? cell.anchor : cell.pos;
    if (posWeight > 0) {
      const palette = c.isAnchor ? paletteAnc : palettePos;
      posTd.style.background = palette(Math.min(1, posWeight));
      posTd.dataset.tooltip = buildTooltip(row, c, 'pos', cell);
    } else {
      posTd.classList.add('empty');
    }
    tr.appendChild(posTd);

    // Sal cell (skip drawing for anchor since anchor has no salience axis)
    const salTd = document.createElement('td');
    salTd.className = 'cell';
    if (c.isAnchor) {
      salTd.classList.add('empty');
      salTd.style.background = '#e8e8e8';
    } else if (cell.sal > 0) {
      salTd.style.background = paletteSal(Math.min(1, cell.sal));
      salTd.dataset.tooltip = buildTooltip(row, c, 'sal', cell);
    } else {
      salTd.classList.add('empty');
    }
    if (isLastInCluster) salTd.classList.add('cluster-divider');
    tr.appendChild(salTd);
  });

  // Info bar cell
  const infoTd = document.createElement('td');
  infoTd.className = 'info-bar-cell';
  const barWidth = Math.round((row.totalWeight / maxTotal) * 100);
  infoTd.innerHTML = '<div class="info-bar" style="width: ' + barWidth + '%"></div><div class="info-bar-num">' + row.totalWeight.toFixed(2) + ' · ' + row.breadth + ' nodes</div>';
  tr.appendChild(infoTd);

  return tr;
}

function buildTooltip(row, col, role, cell) {
  const lines = ['Q' + row.id + ' · ' + row.promptShort];
  lines.push('Node: ' + col.node + (col.isCategorical ? ' (categorical)' : col.isAnchor ? ' (anchor)' : ''));
  lines.push('Role: ' + (role === 'pos' ? (col.isAnchor ? 'anchor' : col.isCategorical ? 'category' : 'position') : 'salience'));
  const w = role === 'pos' ? (col.isAnchor ? cell.anchor : cell.pos) : cell.sal;
  lines.push('Weight (sum): ' + w.toFixed(3));
  const matching = cell.touches.filter(t => {
    if (role === 'pos') {
      if (col.isAnchor) return t.role === 'anchor';
      if (col.isCategorical) return t.role === 'category';
      return t.role === 'position';
    }
    return t.role === 'salience';
  });
  if (matching.length > 0) {
    lines.push('---');
    matching.forEach(t => lines.push('· ' + t.weight.toFixed(2) + ' "' + t.touchType + '"'));
  }
  return lines.join('\\n');
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function renderDetailRow(row) {
  const tr = document.createElement('tr');
  tr.className = 'detail-row';
  const td = document.createElement('td');
  td.colSpan = HEATMAP_DATA.columns.length * 2 + 2;
  const lines = ['Q' + row.id + ' — ' + row.promptShort + ' (' + row.uiType + ', ' + row.stage + ')', '', 'touchProfile (full):'];
  HEATMAP_DATA.rows.find(r => r.id === row.id).cells; // ensure data presence
  Object.entries(row.cells).forEach(([nodeId, cell]) => {
    cell.touches.forEach(t => lines.push('  ' + nodeId.padEnd(12) + t.role.padEnd(11) + ' weight=' + t.weight.toFixed(2) + '  ' + t.touchType));
  });
  td.innerHTML = '<pre>' + escapeHtml(lines.join('\\n')) + '</pre>';
  tr.appendChild(td);
  return tr;
}

function toggleExpand(qid) {
  if (expandedRows.has(qid)) expandedRows.delete(qid);
  else expandedRows.add(qid);
  render();
}

function render() {
  const t = document.getElementById('heatmap');
  t.innerHTML = '';
  const thead = document.createElement('thead');
  renderHeader().forEach(r => thead.appendChild(r));
  t.appendChild(thead);

  const tbody = document.createElement('tbody');
  let lastBand = null;
  sortedRows().forEach(row => {
    if (currentSort === 'default' && row.band !== lastBand) {
      const br = document.createElement('tr');
      br.className = 'band-row';
      const bt = document.createElement('td');
      bt.colSpan = HEATMAP_DATA.columns.length * 2 + 2;
      bt.textContent = row.band === 'CORE_OPENER' ? 'CORE_OPENER (10 — establish salience for every node + capture metadata)' : 'UNIVERSAL_SCREENERS (5 — give every major node ≥ 1 light position read)';
      br.appendChild(bt);
      tbody.appendChild(br);
      lastBand = row.band;
    }
    tbody.appendChild(renderRow(row));
    if (expandedRows.has(row.id)) tbody.appendChild(renderDetailRow(row));
  });
  t.appendChild(tbody);

  document.getElementById('summary').textContent = summary();
}

// Tooltip handling
const tip = document.getElementById('tooltip');
document.addEventListener('mousemove', e => {
  const cell = e.target.closest('td.cell');
  if (cell && cell.dataset.tooltip) {
    tip.textContent = cell.dataset.tooltip;
    tip.classList.add('visible');
    const rect = cell.getBoundingClientRect();
    let left = rect.right + 8;
    let top = rect.top;
    if (left + 320 > window.innerWidth) left = rect.left - 328;
    if (top + tip.offsetHeight > window.innerHeight) top = window.innerHeight - tip.offsetHeight - 8;
    tip.style.left = Math.max(8, left) + 'px';
    tip.style.top = Math.max(8, top) + 'px';
  } else {
    tip.classList.remove('visible');
  }
});

render();
</script>
</body>
</html>
`;
}

async function main() {
  const rows = buildRows();
  const html = buildHtml(rows);
  const outPath = path.resolve(process.cwd(), "question-info-heatmap.html");
  await fs.writeFile(outPath, html, "utf8");
  console.log(`Wrote ${outPath} (${rows.length} rows, ${html.length} bytes)`);
  // Brief summary
  const cor = rows.filter(r => r.band === "CORE_OPENER").length;
  const uni = rows.filter(r => r.band === "UNIVERSAL_SCREENERS").length;
  const totalW = rows.reduce((s, r) => s + r.totalWeight, 0).toFixed(2);
  const meanBreadth = (rows.reduce((s, r) => s + r.breadth, 0) / rows.length).toFixed(1);
  console.log(`  CORE_OPENER: ${cor} · UNIVERSAL_SCREENERS: ${uni}`);
  console.log(`  Combined declared weight: ${totalW} · Mean nodes-per-question: ${meanBreadth}`);
}

main().catch(err => { console.error(err); process.exit(1); });
