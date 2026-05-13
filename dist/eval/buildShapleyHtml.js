// Build a self-contained HTML heatmap of per-(question, node) Shapley values.
// Reads results/question-audit/shap-per-node.json + the representative question
// bank, emits results/question-audit/shap-heatmap.html.
//
// Produces two heatmaps:
//   - Position Shapley (posMean for continuous, catL1Mean for categorical)
//   - Salience Shapley (salMean for all nodes)
//
// Usage: npx tsx src/eval/buildShapleyHtml.ts
import fs from "node:fs";
import path from "node:path";
import { REPRESENTATIVE_QUESTIONS } from "../config/questions.representative.js";
import { CATEGORICAL_NODES } from "../config/nodes.js";
const OUT_DIR = "results/question-audit";
const IN_JSON = path.join(OUT_DIR, "shap-per-node.json");
const OUT_HTML = path.join(OUT_DIR, "shap-heatmap.html");
const raw = JSON.parse(fs.readFileSync(IN_JSON, "utf8"));
const NODE_ORDER = [
    "MAT", "CD", "CU", "MOR",
    "PRO", "EPS", "AES", "COM",
    "ZS", "ONT_H", "ONT_S",
    "PF", "TRB", "ENG",
];
const CLUSTER = {
    MAT: "ENDS", CD: "ENDS", CU: "ENDS", MOR: "ENDS",
    PRO: "MEANS", EPS: "MEANS", AES: "MEANS", COM: "MEANS",
    ZS: "REALITY", ONT_H: "REALITY", ONT_S: "REALITY",
    PF: "SELF", TRB: "SELF", ENG: "SELF",
};
const CATEGORICAL_SET = new Set(CATEGORICAL_NODES);
const qids = REPRESENTATIVE_QUESTIONS.map(q => q.id).sort((a, b) => a - b);
const qById = new Map(REPRESENTATIVE_QUESTIONS.map(q => [q.id, q]));
const cells = {};
for (const qid of qids)
    cells[qid] = {};
for (const n of NODE_ORDER) {
    if (CATEGORICAL_SET.has(n)) {
        const nodeRows = raw.global.categorical[n] ?? {};
        for (const [qidStr, row] of Object.entries(nodeRows)) {
            const qid = +qidStr;
            if (!cells[qid])
                cells[qid] = {};
            cells[qid][n] = { qid, node: n, primary: row.catL1Mean, salience: row.salMean, arches: row.arches };
        }
    }
    else {
        const nodeRows = raw.global.continuous[n] ?? {};
        for (const [qidStr, row] of Object.entries(nodeRows)) {
            const qid = +qidStr;
            if (!cells[qid])
                cells[qid] = {};
            cells[qid][n] = { qid, node: n, primary: row.posMean, salience: row.salMean, arches: row.arches };
        }
    }
}
// Per-column max
const colMaxPrimary = {};
const colMaxSalience = {};
for (const n of NODE_ORDER) {
    let mp = 0, ms = 0;
    for (const qid of qids) {
        const c = cells[qid]?.[n];
        if (!c)
            continue;
        if (c.primary > mp)
            mp = c.primary;
        if (c.salience > ms)
            ms = c.salience;
    }
    colMaxPrimary[n] = mp || 1;
    colMaxSalience[n] = ms || 1;
}
// Per-column top-3
function topNSet(field, n, k = 3) {
    const scored = qids.map(qid => ({ qid, v: cells[qid]?.[n]?.[field] ?? 0 }))
        .filter(x => x.v > 0).sort((a, b) => b.v - a.v).slice(0, k);
    return new Set(scored.map(x => x.qid));
}
const topPosByNode = {};
const topSalByNode = {};
for (const n of NODE_ORDER) {
    topPosByNode[n] = topNSet("primary", n);
    topSalByNode[n] = topNSet("salience", n);
}
function rowAgg(field) {
    const colMax = field === "primary" ? colMaxPrimary : colMaxSalience;
    const out = {};
    for (const qid of qids) {
        let s = 0;
        for (const n of NODE_ORDER) {
            const c = cells[qid]?.[n];
            if (!c)
                continue;
            s += (c[field] ?? 0) / (colMax[n] || 1);
        }
        out[qid] = s;
    }
    return out;
}
const rowAggPrimary = rowAgg("primary");
const rowAggSalience = rowAgg("salience");
// ---------------------------------------------------------------------------
// Build per-question option summary for the tooltip.
// ---------------------------------------------------------------------------
function optionSummary(q) {
    const lines = [];
    const labelFor = (key) => q.optionLabels?.[key] ?? key;
    if (q.optionEvidence) {
        const keys = Object.keys(q.optionEvidence);
        for (const k of keys.slice(0, 8)) {
            lines.push(`  • ${k}${q.optionLabels?.[k] ? ` — ${q.optionLabels[k]}` : ""}`);
        }
        if (keys.length > 8)
            lines.push(`  • … +${keys.length - 8} more options`);
    }
    else if (q.sliderMap) {
        const keys = Object.keys(q.sliderMap);
        lines.push(`  slider buckets: ${keys.join(", ")}`);
    }
    else if (q.allocationMap) {
        const keys = Object.keys(q.allocationMap);
        lines.push(`  allocation buckets: ${keys.map(labelFor).join(", ")}`);
    }
    else if (q.rankingMap) {
        const keys = Object.keys(q.rankingMap);
        for (const k of keys.slice(0, 8))
            lines.push(`  • ${k}${q.optionLabels?.[k] ? ` — ${q.optionLabels[k]}` : ""}`);
        if (keys.length > 8)
            lines.push(`  • … +${keys.length - 8} more items`);
    }
    else if (q.bestWorstMap) {
        const keys = Object.keys(q.bestWorstMap);
        for (const k of keys.slice(0, 8))
            lines.push(`  • ${k}${q.optionLabels?.[k] ? ` — ${q.optionLabels[k]}` : ""}`);
        if (keys.length > 8)
            lines.push(`  • … +${keys.length - 8} more items`);
    }
    else if (q.pairMaps) {
        const pairCount = Object.keys(q.pairMaps).length;
        lines.push(`  ${pairCount} pairwise prompts`);
    }
    else if (q.dualAxisMap) {
        lines.push(`  dual axis on ${q.dualAxisMap.node}: x=position, y=salience`);
    }
    return lines.join("\n");
}
// Emit HTML
function esc(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function fmt(v, p = 3) { return v.toFixed(p); }
const NODE_LABELS = {
    MAT: "Material", CD: "Cultural Dir", CU: "Cultural Unif", MOR: "Moral Circle",
    PRO: "Procedural", EPS: "Epistemic", AES: "Aesthetic", COM: "Compromise",
    ZS: "Zero-Sum", ONT_H: "Hierarchy", ONT_S: "System Ont",
    PF: "Pol Fusion", TRB: "Tribe", ENG: "Engagement",
};
const CLUSTER_COLOR = {
    ENDS: "#4a90e2", MEANS: "#7cb342", REALITY: "#e8a948", SELF: "#c77dbb",
};
const qInfo = {};
for (const q of REPRESENTATIVE_QUESTIONS) {
    qInfo[q.id] = {
        qid: q.id,
        promptShort: q.promptShort,
        promptFull: q.promptFull ?? q.promptShort,
        uiType: q.uiType,
        optionSummary: optionSummary(q),
    };
}
// ---------------------------------------------------------------------------
// Render one heatmap
// ---------------------------------------------------------------------------
function renderHeatmap(title, field, colMax, topByNode, rowAggMap, heatColor, cellTipMetricLabel) {
    const sorted = [...qids].sort((a, b) => (rowAggMap[b] ?? 0) - (rowAggMap[a] ?? 0));
    const rowsHtml = [];
    for (const qid of sorted) {
        const q = qById.get(qid);
        const promptShort = q?.promptShort ?? "?";
        const uiType = q?.uiType ?? "?";
        const agg = rowAggMap[qid] ?? 0;
        const cellsHtml = [];
        for (const n of NODE_ORDER) {
            const c = cells[qid]?.[n];
            if (!c) {
                cellsHtml.push(`<td class="cell empty"></td>`);
                continue;
            }
            const val = c[field] ?? 0;
            const norm = colMax[n] > 0 ? val / colMax[n] : 0;
            const alpha = Math.min(1, norm);
            const isTop = topByNode[n]?.has(qid);
            const ring = isTop ? " top3" : "";
            const hue = heatColor(n);
            const cellTip = `Q${qid} → ${n}\n${cellTipMetricLabel(CATEGORICAL_SET.has(n))}: ${fmt(val, 4)}\ncovered by ${c.arches}/${raw.numArchetypes} archetypes`;
            cellsHtml.push(`<td class="cell${ring}" style="background: ${hue}${Math.round(alpha * 255).toString(16).padStart(2, "0")};" data-cell="${esc(cellTip)}" data-qid="${qid}">${val > 0.02 ? fmt(val, 2).replace(/^0/, "") : ""}</td>`);
        }
        rowsHtml.push(`<tr data-qid="${qid}">
      <td class="qid" data-qid="${qid}">Q${qid}</td>
      <td class="prompt" data-qid="${qid}">${esc(promptShort)}</td>
      <td class="uitype">${esc(uiType)}</td>
      <td class="agg">${fmt(agg, 1)}</td>
      ${cellsHtml.join("")}
    </tr>`);
    }
    const clusterHeader = [];
    let prev = "";
    let span = 0;
    for (const n of NODE_ORDER) {
        const c = CLUSTER[n];
        if (c === prev) {
            span++;
            continue;
        }
        if (span)
            clusterHeader.push(`<th colspan="${span}" class="cluster" style="background: ${CLUSTER_COLOR[prev]}22; color: ${CLUSTER_COLOR[prev]};">${prev}</th>`);
        prev = c;
        span = 1;
    }
    if (span)
        clusterHeader.push(`<th colspan="${span}" class="cluster" style="background: ${CLUSTER_COLOR[prev]}22; color: ${CLUSTER_COLOR[prev]};">${prev}</th>`);
    const nodeHeader = NODE_ORDER.map(n => {
        const isCat = CATEGORICAL_SET.has(n);
        return `<th class="node" title="${n} — ${isCat ? "categorical" : "continuous"}"><div class="node-code">${n}</div><div class="node-name">${NODE_LABELS[n]}</div></th>`;
    }).join("");
    return `<h2>${title}</h2>
<table class="heatmap">
  <thead>
    <tr><th class="qid-h" rowspan="2">QID</th><th class="prompt-h" rowspan="2">Prompt (hover for full)</th><th class="uitype-h" rowspan="2">UI</th><th class="agg-h" rowspan="2" title="Sum of per-column normalized Shapley">∑norm</th>${clusterHeader.join("")}</tr>
    <tr>${nodeHeader}</tr>
  </thead>
  <tbody>
    ${rowsHtml.join("\n")}
  </tbody>
</table>`;
}
// ---------------------------------------------------------------------------
// Summary lines — top 5 questions per node
// ---------------------------------------------------------------------------
function summaryLines(field) {
    const lines = [];
    for (const n of NODE_ORDER) {
        const top = qids.map(qid => ({ qid, v: cells[qid]?.[n]?.[field] ?? 0 }))
            .filter(x => x.v > 0).sort((a, b) => b.v - a.v).slice(0, 5);
        if (!top.length)
            continue;
        const items = top.map(t => {
            const q = qById.get(t.qid);
            return `<span class="top-item"><b>Q${t.qid}</b> <span class="muted">${esc(q?.promptShort ?? "?")}</span> <span class="val">${fmt(t.v, 3)}</span></span>`;
        }).join(" · ");
        lines.push(`<div class="topline"><span class="topnode" style="color: ${CLUSTER_COLOR[CLUSTER[n]]};">${n}</span> ${items}</div>`);
    }
    return lines.join("\n");
}
const posHeatmap = renderHeatmap("Position Shapley (continuous: E[pos] shift · categorical: catDist L1 shift)", "primary", colMaxPrimary, topPosByNode, rowAggPrimary, (n) => CATEGORICAL_SET.has(n) ? "#c77dbb" : "#2fb3a5", (isCat) => isCat ? "catL1" : "posΔ");
const salHeatmap = renderHeatmap("Salience Shapley (E[sal] shift)", "salience", colMaxSalience, topSalByNode, rowAggSalience, () => "#f0a050", // orange for salience
() => "salΔ");
const html = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8">
<title>SHAP per-question per-node heatmap</title>
<style>
  :root {
    --bg: #0f1419;
    --panel: #1a1f26;
    --ink: #e8ecef;
    --muted: #8a9199;
    --border: #2a3036;
    --accent: #2fb3a5;
  }
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; background: var(--bg); color: var(--ink); font: 13px/1.4 -apple-system, system-ui, sans-serif; }
  .wrap { max-width: 1800px; margin: 0 auto; padding: 32px 24px 96px; }
  h1 { margin: 0 0 8px; font-size: 22px; font-weight: 600; }
  h2 { margin: 36px 0 12px; font-size: 16px; font-weight: 600; color: var(--accent); border-bottom: 1px solid var(--border); padding-bottom: 8px; }
  .sub { color: var(--muted); font-size: 13px; margin-bottom: 24px; }
  .meta { display: flex; gap: 32px; font-size: 12px; color: var(--muted); margin-bottom: 24px; }
  .meta b { color: var(--ink); font-weight: 500; }

  .explainer { background: var(--panel); border: 1px solid var(--border); border-radius: 8px; padding: 16px 20px; margin-bottom: 24px; }
  .explainer h3 { margin: 0 0 8px; font-size: 14px; color: var(--accent); }
  .explainer p { margin: 6px 0; font-size: 12.5px; }
  .explainer code { background: #0b0f14; padding: 1px 5px; border-radius: 3px; color: #9ad4cf; }

  .summary { background: var(--panel); border: 1px solid var(--border); border-radius: 8px; padding: 16px 20px; margin-bottom: 24px; }
  .summary h3 { margin: 0 0 10px; font-size: 14px; color: var(--accent); }
  .topline { padding: 4px 0; border-bottom: 1px solid #20262c; font-size: 12px; }
  .topline:last-child { border-bottom: none; }
  .topnode { display: inline-block; width: 52px; font-weight: 600; }
  .top-item { margin-right: 8px; }
  .top-item b { color: var(--ink); }
  .top-item .val { color: var(--accent); font-variant-numeric: tabular-nums; font-size: 11.5px; }
  .muted { color: var(--muted); font-size: 11.5px; }

  table.heatmap { border-collapse: collapse; width: 100%; font-size: 11px; font-variant-numeric: tabular-nums; }
  thead th { background: var(--panel); border-bottom: 1px solid var(--border); padding: 4px 6px; color: var(--muted); font-weight: 500; font-size: 11px; position: sticky; top: 0; z-index: 2; }
  th.cluster { text-align: center; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; padding: 6px 0; border-bottom: 2px solid #0f1419; }
  th.node { min-width: 54px; text-align: center; padding: 6px 2px; }
  th.node .node-code { font-weight: 600; color: var(--ink); font-size: 11.5px; }
  th.node .node-name { color: var(--muted); font-size: 9.5px; margin-top: 1px; }
  th.qid-h, th.prompt-h, th.uitype-h, th.agg-h { text-align: left; padding-left: 8px; }
  th.prompt-h { min-width: 250px; }

  tbody td { border-bottom: 1px solid #14181d; padding: 0; }
  td.qid { padding: 3px 8px; color: var(--muted); font-weight: 600; font-size: 11px; cursor: help; }
  td.prompt { padding: 3px 8px; color: var(--ink); max-width: 280px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 11px; cursor: help; }
  td.uitype { padding: 3px 6px; color: #9ad4cf; font-size: 10px; }
  td.agg { padding: 3px 8px; color: var(--muted); text-align: right; padding-right: 12px; font-size: 11px; }
  td.cell { min-width: 54px; height: 22px; text-align: center; color: #0b0f14; font-weight: 600; font-size: 10px; cursor: help; position: relative; }
  td.cell.empty { background: #0c1014; }
  td.cell.top3 { outline: 1.5px solid #ffd166; outline-offset: -1.5px; z-index: 1; }

  tbody tr:hover td { background: #171c22; }
  tbody tr:hover td.cell { filter: brightness(1.15); }

  /* Floating tooltip — populated by JS */
  #tip {
    position: fixed;
    display: none;
    background: #0a0d11;
    color: var(--ink);
    border: 1px solid var(--border);
    border-radius: 4px;
    padding: 10px 12px;
    font-size: 11.5px;
    max-width: 480px;
    z-index: 100;
    pointer-events: none;
    box-shadow: 0 6px 20px rgba(0,0,0,0.7);
    white-space: pre-wrap;
    line-height: 1.5;
  }
  #tip .tip-qid { color: var(--accent); font-weight: 700; }
  #tip .tip-short { color: var(--muted); font-size: 10.5px; margin-top: 2px; }
  #tip .tip-full { color: var(--ink); margin-top: 8px; font-size: 12px; font-style: italic; border-left: 2px solid var(--accent); padding-left: 8px; }
  #tip .tip-options { color: var(--ink); margin-top: 8px; font-size: 11px; font-family: ui-monospace, monospace; }
  #tip .tip-metric { margin-top: 8px; color: #ffd166; font-weight: 600; }

  .legend { margin: 24px 0 12px; display: flex; gap: 24px; align-items: center; color: var(--muted); font-size: 12px; flex-wrap: wrap; }
  .legend-chip { display: inline-block; width: 14px; height: 14px; border-radius: 3px; vertical-align: middle; margin-right: 6px; }
</style>
</head><body><div class="wrap">

<h1>SHAP per-question per-node heatmap</h1>
<div class="sub">Permutation-based Shapley values: how much each question moves each node's posterior, averaged across random question orderings and all active archetypes.</div>

<div class="meta">
  <span><b>K (permutations / archetype):</b> ${raw.K}</span>
  <span><b>Archetypes:</b> ${raw.numArchetypes}</span>
  <span><b>Questions:</b> ${qids.length}</span>
  <span><b>Elapsed:</b> ${raw.elapsedSeconds.toFixed(1)}s</span>
</div>

<div class="explainer">
  <h3>How to read this</h3>
  <p><b>Two heatmaps</b>: the first shows <i>position</i> Shapley (how much each question moves E[node.pos], or catDist for EPS/AES), the second shows <i>salience</i> Shapley (how much each question moves E[node.sal]). A question that looks empty in the first heatmap but lights up in the second is a salience-only question — it tells you whether a node matters, not where the respondent falls on it.</p>
  <p><b>Cell value</b> is the Shapley value: mean ΔE[metric] delivered by this question when inserted into a random ordering of the answered set. Higher = stronger causal lever.</p>
  <p><b>Shading</b> is per-column normalized within each heatmap. <b>Gold outline</b> marks the top 3 questions per node. Empty cells = that question's answer carried zero signal on that node across the run.</p>
  <p><b>Hover any QID, prompt, or cell</b> for the full prompt text, option list, and per-cell stats.</p>
</div>

<div class="summary">
  <h3>Top 5 questions per node — POSITION</h3>
  ${summaryLines("primary")}
</div>

<div class="summary">
  <h3>Top 5 questions per node — SALIENCE</h3>
  ${summaryLines("salience")}
</div>

<div class="legend">
  <span><span class="legend-chip" style="background: #2fb3a5;"></span>continuous (position)</span>
  <span><span class="legend-chip" style="background: #c77dbb;"></span>categorical (catDist L1)</span>
  <span><span class="legend-chip" style="background: #f0a050;"></span>salience</span>
  <span><span class="legend-chip" style="background: transparent; border: 1.5px solid #ffd166;"></span>top-3 for that node</span>
  <span style="margin-left: auto; color: var(--muted);">Per-column normalization · hover for detail</span>
</div>

${posHeatmap}

${salHeatmap}

<div id="tip"></div>

<script>
const QINFO = ${JSON.stringify(qInfo)};

const tip = document.getElementById("tip");

function renderTipHtml(qid, extraMetric) {
  const info = QINFO[qid];
  if (!info) return "";
  const parts = [];
  parts.push(\`<span class="tip-qid">Q\${qid}</span> <span style="color:#9ad4cf">\${info.uiType}</span>\`);
  parts.push(\`<div class="tip-short">\${info.promptShort}</div>\`);
  if (info.promptFull && info.promptFull !== info.promptShort) {
    parts.push(\`<div class="tip-full">\${info.promptFull.replace(/</g, "&lt;")}</div>\`);
  }
  if (info.optionSummary) {
    parts.push(\`<div class="tip-options">\${info.optionSummary.replace(/</g, "&lt;")}</div>\`);
  }
  if (extraMetric) {
    parts.push(\`<div class="tip-metric">\${extraMetric.replace(/</g, "&lt;")}</div>\`);
  }
  return parts.join("");
}

function position(e) {
  const rect = tip.getBoundingClientRect();
  let x = e.clientX + 14;
  let y = e.clientY + 14;
  if (x + rect.width > window.innerWidth - 8) x = e.clientX - rect.width - 10;
  if (y + rect.height > window.innerHeight - 8) y = e.clientY - rect.height - 10;
  tip.style.left = x + "px";
  tip.style.top = y + "px";
}

document.addEventListener("mousemove", e => {
  const el = e.target.closest("[data-qid]");
  if (!el) { tip.style.display = "none"; return; }
  const qid = +el.getAttribute("data-qid");
  const cellMetric = el.classList.contains("cell") ? el.getAttribute("data-cell") : null;
  tip.innerHTML = renderTipHtml(qid, cellMetric);
  tip.style.display = "block";
  position(e);
});

document.addEventListener("mouseleave", () => { tip.style.display = "none"; });
</script>

</div></body></html>
`;
fs.writeFileSync(OUT_HTML, html);
console.log(`Wrote ${OUT_HTML} (${(html.length / 1024).toFixed(1)} KB)`);
//# sourceMappingURL=buildShapleyHtml.js.map