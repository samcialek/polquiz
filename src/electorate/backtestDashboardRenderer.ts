/**
 * Phase 3 — render the multi-cycle backtest result as a self-contained
 * HTML dashboard. Inline CSS + SVG; no external assets, no JS.
 *
 * Usage:
 *   npx tsx src/electorate/backtestDashboardRenderer.ts
 *
 * Reads:  results/electorate/backtest/multi-cycle-backtest.json
 * Writes: results/electorate/backtest/multi-cycle-backtest.html
 */

import * as fs from "node:fs";
import * as path from "node:path";
import type { CycleBacktestResult } from "./cces2BacktestRunner.js";

const IN_JSON = "results/electorate/backtest/multi-cycle-backtest.json";
const OUT_DIR = "results/electorate/backtest";
const OUT_HTML = path.join(OUT_DIR, "multi-cycle-backtest.html");

const CONTINUOUS = ["MAT", "CD", "CU", "MOR", "PRO", "COM", "ZS", "ONT_H", "ONT_S"] as const;
const CONTINUOUS_LABELS: Record<string, string> = {
  MAT: "Material",
  CD: "Cultural Direction",
  CU: "Cultural Uniformity",
  MOR: "Moral Circle",
  PRO: "Proceduralism",
  COM: "Compromise",
  ZS: "Zero-Sum",
  ONT_H: "Hierarchy",
  ONT_S: "System Ontology",
};
const EPS_LABELS = ["empiricist", "institutionalist", "traditionalist", "intuitionist", "autonomous", "nihilist"];
const AES_LABELS = ["statesman", "technocrat", "pastoral", "authentic", "fighter", "visionary"];
const BOUNDARIES = ["national", "ethnic_racial", "religious", "class", "ideological", "gender", "political_camp"] as const;
const BOUNDARY_LABELS: Record<string, string> = {
  national: "National",
  ethnic_racial: "Ethnic/Racial",
  religious: "Religious",
  class: "Class",
  ideological: "Ideological",
  gender: "Gender",
  political_camp: "Political",
};

function pp(n: number, digits = 1): string {
  return (n * 100).toFixed(digits) + "%";
}
function ppSigned(n: number): string {
  const v = n * 100;
  const sign = v >= 0 ? "+" : "";
  return `${sign}${v.toFixed(1)}pp`;
}
function fixed(n: number, d = 2): string { return n.toFixed(d); }
function escape(s: string): string {
  return s.replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

// ─── SVG renderers ───────────────────────────────────────────────────────

/** Coverage bar — single horizontal bar showing real_signal %. */
function coverageBar(realSignal: number, total: number, width = 80, height = 12): string {
  const pct = total > 0 ? realSignal / total : 0;
  const fill = Math.round(pct * width);
  return `<svg width="${width}" height="${height}" class="cov-svg"><rect width="${width}" height="${height}" fill="#e8eae3" rx="2"/><rect width="${fill}" height="${height}" fill="#227c70" rx="2"/></svg>`;
}

/** Mini violin / box for a continuous node — pos on 1-5 scale. */
function miniViolin(stats: { posMean: number; posSd: number; posP10: number; posP25: number; posP50: number; posP75: number; posP90: number; salMean: number }, w = 110, h = 60): string {
  const padL = 18, padR = 6, padT = 6, padB = 14;
  const inner = w - padL - padR;
  const pi = (v: number) => padL + ((v - 1) / 4) * inner;
  // box
  const x10 = pi(stats.posP10), x25 = pi(stats.posP25), x50 = pi(stats.posP50), x75 = pi(stats.posP75), x90 = pi(stats.posP90);
  const cy = padT + 14;
  const boxH = 18;
  // axis labels
  const tick1 = pi(1), tick3 = pi(3), tick5 = pi(5);
  const sal = stats.salMean;
  const salColor = sal > 1.6 ? "#bd5742" : sal > 1.0 ? "#b7791f" : "#5f6862";
  return `<svg width="${w}" height="${h}" class="vio">
    <line x1="${tick1}" y1="${cy}" x2="${tick5}" y2="${cy}" stroke="#d9ddd6" stroke-width="1"/>
    <line x1="${tick1}" y1="${cy-2}" x2="${tick1}" y2="${cy+2}" stroke="#5f6862"/>
    <line x1="${tick3}" y1="${cy-2}" x2="${tick3}" y2="${cy+2}" stroke="#b6beb5" stroke-dasharray="2,2"/>
    <line x1="${tick5}" y1="${cy-2}" x2="${tick5}" y2="${cy+2}" stroke="#5f6862"/>
    <line x1="${x10}" y1="${cy}" x2="${x90}" y2="${cy}" stroke="#5f6862" stroke-width="1"/>
    <rect x="${x25}" y="${cy - boxH/2}" width="${x75-x25}" height="${boxH}" fill="#dcefeb" stroke="#227c70" stroke-width="1"/>
    <line x1="${x50}" y1="${cy - boxH/2}" x2="${x50}" y2="${cy + boxH/2}" stroke="#227c70" stroke-width="2"/>
    <text x="${padL}" y="${h-3}" font-size="9" fill="#5f6862">1</text>
    <text x="${tick3-2}" y="${h-3}" font-size="9" fill="#5f6862">3</text>
    <text x="${tick5-3}" y="${h-3}" font-size="9" fill="#5f6862">5</text>
    <text x="${w-padR}" y="11" font-size="9" fill="${salColor}" text-anchor="end">sal ${fixed(sal)}</text>
  </svg>`;
}

/** 6-bin categorical bar chart. */
function categoricalBars(dist: number[], labels: string[], w = 240, h = 80): string {
  const padL = 4, padR = 4, padT = 6, padB = 18;
  const innerW = w - padL - padR;
  const innerH = h - padT - padB;
  const barW = innerW / dist.length - 2;
  const max = Math.max(...dist, 0.01);
  let bars = "";
  for (let i = 0; i < dist.length; i++) {
    const x = padL + i * (innerW / dist.length) + 1;
    const bh = (dist[i]! / max) * innerH;
    const y = padT + innerH - bh;
    bars += `<rect x="${x}" y="${y}" width="${barW}" height="${bh}" fill="#6a5b8f" rx="1"/>`;
    bars += `<text x="${x + barW/2}" y="${h - 6}" font-size="8" fill="#5f6862" text-anchor="middle">${labels[i]!.slice(0,4)}</text>`;
    bars += `<text x="${x + barW/2}" y="${y - 2}" font-size="8" fill="#202422" text-anchor="middle">${(dist[i]!*100).toFixed(0)}</text>`;
  }
  return `<svg width="${w}" height="${h}" class="cats">${bars}</svg>`;
}

/** Boundary salience strip — 7 bars on a 0-3 scale. */
function boundaryStrip(boundaryMarginals: Record<string, { salMean: number }>, w = 360, h = 60): string {
  const padL = 8, padR = 8, padT = 6, padB = 18;
  const innerW = w - padL - padR;
  const innerH = h - padT - padB;
  const items = BOUNDARIES;
  const barW = innerW / items.length - 4;
  let out = "";
  for (let i = 0; i < items.length; i++) {
    const sal = boundaryMarginals[items[i]!]?.salMean ?? 0;
    const x = padL + i * (innerW / items.length) + 2;
    const bh = (Math.min(3, sal) / 3) * innerH;
    const y = padT + innerH - bh;
    const color = sal > 1.6 ? "#bd5742" : sal > 1.0 ? "#b7791f" : "#227c70";
    out += `<rect x="${x}" y="${y}" width="${barW}" height="${bh}" fill="${color}" rx="2"/>`;
    out += `<text x="${x + barW/2}" y="${h - 4}" font-size="9" fill="#5f6862" text-anchor="middle">${BOUNDARY_LABELS[items[i]!]!.slice(0,8)}</text>`;
    out += `<text x="${x + barW/2}" y="${y - 2}" font-size="8" fill="#202422" text-anchor="middle">${fixed(sal)}</text>`;
  }
  return `<svg width="${w}" height="${h}" class="bnd">${out}</svg>`;
}

/** Predicted vs Actual horizontal bars. */
function predVsActualBars(pred: { D: number; R: number; Other: number }, actual: { D: number; R: number; Other: number }, w = 340, h = 90): string {
  const padL = 56, padR = 60, padT = 6, padB = 6;
  const innerW = w - padL - padR;
  const rowH = 14;
  const cells = [
    { label: "D", pred: pred.D, actual: actual.D, color: "#3057a3" },
    { label: "R", pred: pred.R, actual: actual.R, color: "#bd5742" },
    { label: "Other", pred: pred.Other, actual: actual.Other, color: "#6a5b8f" },
  ];
  let out = "";
  let y = padT;
  for (const c of cells) {
    const wp = c.pred * innerW;
    const wa = c.actual * innerW;
    out += `<text x="${padL - 4}" y="${y + rowH * 1.5}" font-size="11" fill="#202422" text-anchor="end">${c.label}</text>`;
    out += `<rect x="${padL}" y="${y}" width="${wp}" height="${rowH - 2}" fill="${c.color}" opacity="0.45"/>`;
    out += `<text x="${padL + wp + 3}" y="${y + rowH - 4}" font-size="10" fill="#5f6862">${pp(c.pred)} pred</text>`;
    out += `<rect x="${padL}" y="${y + rowH}" width="${wa}" height="${rowH - 2}" fill="${c.color}"/>`;
    out += `<text x="${padL + wa + 3}" y="${y + rowH + rowH - 4}" font-size="10" fill="#5f6862">${pp(c.actual)} actual</text>`;
    y += rowH * 2 + 4;
  }
  return `<svg width="${w}" height="${h}" class="pa">${out}</svg>`;
}

// ─── Page ────────────────────────────────────────────────────────────────

function renderCycle(c: CycleBacktestResult): string {
  const realSignalNodes = Object.values(c.coverage.perNode).reduce((sum, v) => sum + v.realSignal, 0);
  const totalNodes = Object.values(c.coverage.perNode).reduce((sum, v) => sum + v.total, 0);
  const realSignalPct = totalNodes > 0 ? realSignalNodes / totalNodes : 0;

  const winnerPred = c.predicted.sharesOfVoters.D > c.predicted.sharesOfVoters.R ? "D" : "R";
  const winnerActual = c.actual.sharesOfVoters.D > c.actual.sharesOfVoters.R ? "D" : "R";
  const directional = winnerPred === winnerActual ? "✓ correct winner" : "✗ wrong winner";
  const directionalCls = winnerPred === winnerActual ? "ok" : "warn";

  let coverageBanner = "";
  if (realSignalPct < 0.15) {
    coverageBanner = `<div class="banner warn"><strong>Coverage caveat:</strong> &lt;15% of node-targets carry real CCES signal for ${c.year}. Predictions are dominated by fallback priors and reflect the population center, not modelled vote choice. The gap below is a coverage-gap demonstration, not a model-accuracy result.</div>`;
  } else if (realSignalPct < 0.40) {
    coverageBanner = `<div class="banner mid"><strong>Reduced-coverage caveat:</strong> ${(realSignalPct*100).toFixed(0)}% of node-targets carry real CCES signal for ${c.year}. Expect rough directional accuracy at best; magnitude predictions are unreliable.</div>`;
  }

  // Coverage strip (per node)
  const covRows = [...CONTINUOUS, "EPS", "AES"].map(id => {
    const cov = c.coverage.perNode[id]!;
    const pct = cov.total > 0 ? cov.realSignal / cov.total : 0;
    return `<tr><td>${id}</td><td>${coverageBar(cov.realSignal, cov.total)}</td><td class="num">${(pct*100).toFixed(0)}%</td></tr>`;
  }).join("");

  // Continuous mini-violins
  const violinRows = CONTINUOUS.map(id => {
    const stats = c.continuousMarginals[id]!;
    return `<div class="vio-cell"><div class="vio-label">${id} <span class="vio-sub">${escape(CONTINUOUS_LABELS[id]!)}</span></div>${miniViolin(stats)}<div class="vio-num">μ ${fixed(stats.posMean)} ± ${fixed(stats.posSd)}</div></div>`;
  }).join("");

  // Categorical bars
  const epsBars = categoricalBars(c.categoricalMarginals.EPS!.distribution, EPS_LABELS);
  const aesBars = categoricalBars(c.categoricalMarginals.AES!.distribution, AES_LABELS);

  // Boundary strip
  const boundaryBars = boundaryStrip(c.boundaryMarginals);

  // Engagement
  const engRows = `
    <tr><td>apolitical</td><td class="num">${pp(c.engagement.apolitical)}</td></tr>
    <tr><td>casual</td><td class="num">${pp(c.engagement.casual)}</td></tr>
    <tr><td>engaged</td><td class="num">${pp(c.engagement.engaged)}</td></tr>
    <tr><td>highly engaged</td><td class="num">${pp(c.engagement.highly_engaged)}</td></tr>
  `;

  // Top archetypes
  const arcRows = c.topArchetypes.map((a, i) =>
    `<tr><td class="rank">${i+1}</td><td><strong>${escape(a.id)}</strong> ${escape(a.name)}</td><td class="num">${pp(a.share)}</td></tr>`
  ).join("");

  // Pred vs actual chart
  const predVsActual = predVsActualBars(
    { D: c.predicted.sharesOfVoters.D, R: c.predicted.sharesOfVoters.R, Other: c.predicted.sharesOfVoters.T + c.predicted.sharesOfVoters.O },
    { D: c.actual.sharesOfVoters.D, R: c.actual.sharesOfVoters.R, Other: c.actual.sharesOfVoters.Other }
  );

  return `
  <section class="cycle">
    <h2>${c.year} — ${escape(c.actual.candidates.d ?? "?")} (D) vs ${escape(c.actual.candidates.r ?? "?")} (R)</h2>
    <div class="cycle-meta"><span>n = ${c.rowsProcessed.toLocaleString()} respondents</span><span class="dot">•</span><span>real-signal coverage ${(realSignalPct*100).toFixed(1)}%</span><span class="dot">•</span><span class="dir ${directionalCls}">${directional}</span><span class="dot">•</span><span>|gap voters| ${(c.gaps.sharesOfVoters.absMean*100).toFixed(2)}pp</span></div>
    ${coverageBanner}

    <div class="grid-2">
      <div class="panel">
        <h3>Predicted vs Actual (shares of voters)</h3>
        ${predVsActual}
        <table class="kv">
          <tr><th></th><th>Pred</th><th>Actual</th><th>Gap</th></tr>
          <tr><td>D</td><td>${pp(c.predicted.sharesOfVoters.D)}</td><td>${pp(c.actual.sharesOfVoters.D)}</td><td class="gap">${ppSigned(c.gaps.sharesOfVoters.D)}</td></tr>
          <tr><td>R</td><td>${pp(c.predicted.sharesOfVoters.R)}</td><td>${pp(c.actual.sharesOfVoters.R)}</td><td class="gap">${ppSigned(c.gaps.sharesOfVoters.R)}</td></tr>
          <tr><td>Other</td><td>${pp(c.predicted.sharesOfVoters.T + c.predicted.sharesOfVoters.O)}</td><td>${pp(c.actual.sharesOfVoters.Other)}</td><td class="gap">${ppSigned(c.gaps.sharesOfVoters.Other)}</td></tr>
        </table>
        <table class="kv">
          <tr><th colspan="4">Shares of electorate (incl. abstain)</th></tr>
          <tr><td>D</td><td>${pp(c.predicted.sharesOfElectorate.D)}</td><td>${pp(c.actual.sharesOfElectorate.D)}</td><td class="gap">${ppSigned(c.gaps.sharesOfElectorate.D)}</td></tr>
          <tr><td>R</td><td>${pp(c.predicted.sharesOfElectorate.R)}</td><td>${pp(c.actual.sharesOfElectorate.R)}</td><td class="gap">${ppSigned(c.gaps.sharesOfElectorate.R)}</td></tr>
          <tr><td>Abstain</td><td>${pp(c.predicted.sharesOfElectorate.Abstain)}</td><td>${pp(c.actual.sharesOfElectorate.Abstain)}</td><td class="gap">${ppSigned(c.gaps.sharesOfElectorate.Abstain)}</td></tr>
        </table>
      </div>

      <div class="panel">
        <h3>Mapper coverage (real_signal % per target)</h3>
        <table class="cov">
          <thead><tr><th>Target</th><th>Coverage</th><th class="num">%</th></tr></thead>
          <tbody>${covRows}</tbody>
        </table>
      </div>
    </div>

    <div class="panel">
      <h3>Continuous node distributions (weighted, 1–5 scale)</h3>
      <div class="vio-grid">${violinRows}</div>
    </div>

    <div class="grid-2">
      <div class="panel">
        <h3>EPS (Epistemic style, weighted distribution)</h3>
        ${epsBars}
        <div class="muted">Mean salience ${fixed(c.categoricalMarginals.EPS!.salMean)}</div>
      </div>
      <div class="panel">
        <h3>AES (Aesthetic style, weighted distribution)</h3>
        ${aesBars}
        <div class="muted">Mean salience ${fixed(c.categoricalMarginals.AES!.salMean)}</div>
      </div>
    </div>

    <div class="panel">
      <h3>Moral-boundary salience (weighted means, 0–3 scale)</h3>
      ${boundaryBars}
      <div class="muted">Aggregate intensity mean ${fixed(c.intensityMean)}</div>
    </div>

    <div class="grid-2">
      <div class="panel">
        <h3>Engagement distribution</h3>
        <table class="kv">
          <thead><tr><th>Bucket</th><th>Share</th></tr></thead>
          <tbody>${engRows}</tbody>
        </table>
        <div class="muted">Mean engagement ${fixed(c.engagement.mean)} (0–10 scale)</div>
      </div>
      <div class="panel">
        <h3>Top archetypes by weight (nearest-archetype assignment)</h3>
        <table class="arc">
          <thead><tr><th></th><th>Archetype</th><th class="num">Share</th></tr></thead>
          <tbody>${arcRows}</tbody>
        </table>
      </div>
    </div>
  </section>`;
}

function renderSummary(cycles: CycleBacktestResult[], generatedAt: string, elapsedMs: number): string {
  const rows = cycles.map(c => {
    const pv = c.predicted.sharesOfVoters;
    const av = c.actual.sharesOfVoters;
    const realSignal = Object.values(c.coverage.perNode).reduce((s, v) => s + v.realSignal, 0);
    const total = Object.values(c.coverage.perNode).reduce((s, v) => s + v.total, 0);
    const cov = total > 0 ? realSignal / total : 0;
    const winnerPred = pv.D > pv.R ? "D" : "R";
    const winnerActual = av.D > av.R ? "D" : "R";
    const cls = winnerPred === winnerActual ? "win-ok" : "win-bad";
    return `<tr>
      <td><a href="#y${c.year}">${c.year}</a></td>
      <td class="num">${(c.totalWeight/1e6).toFixed(2)}M</td>
      <td class="num">${(cov*100).toFixed(0)}%</td>
      <td class="num">${pp(pv.D)}</td>
      <td class="num">${pp(av.D)}</td>
      <td class="num">${pp(pv.R)}</td>
      <td class="num">${pp(av.R)}</td>
      <td class="num gap">${ppSigned(c.gaps.sharesOfVoters.D)}</td>
      <td class="num gap">${ppSigned(c.gaps.sharesOfVoters.R)}</td>
      <td class="num">${(c.gaps.sharesOfVoters.absMean*100).toFixed(2)}pp</td>
      <td class="${cls}">${winnerPred === winnerActual ? "✓" : "✗"}</td>
    </tr>`;
  }).join("");

  return `
  <section class="summary">
    <h2>Summary — predicted vs actual, all 5 cycles</h2>
    <table class="sumtable">
      <thead><tr>
        <th>Year</th><th>n (wt)</th><th>Coverage</th>
        <th>Pred D</th><th>Actual D</th>
        <th>Pred R</th><th>Actual R</th>
        <th>Gap D</th><th>Gap R</th>
        <th>|avg|</th>
        <th>Winner</th>
      </tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <div class="muted">Generated ${escape(generatedAt)} • ${(elapsedMs/1000).toFixed(1)}s pipeline runtime</div>
  </section>`;
}

function renderHTML(data: { cycles: CycleBacktestResult[]; generated_at: string; elapsed_ms: number; decisions: any }): string {
  const summary = renderSummary(data.cycles, data.generated_at, data.elapsed_ms);
  const cycleSections = data.cycles.map(c => `<a id="y${c.year}"></a>` + renderCycle(c)).join("\n");

  return `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>PRISM 5-Cycle Backtest Dashboard</title>
<style>
:root {
  --bg: #f7f7f4;
  --paper: #ffffff;
  --ink: #202422;
  --muted: #5f6862;
  --line: #d9ddd6;
  --line-strong: #b6beb5;
  --teal: #227c70;
  --coral: #bd5742;
  --gold: #b7791f;
  --violet: #6a5b8f;
  --shadow: 0 12px 32px rgba(32, 36, 34, 0.06);
  --radius: 8px;
}
* { box-sizing: border-box; }
body { margin: 0; font-family: 'Inter', -apple-system, system-ui, sans-serif; background: var(--bg); color: var(--ink); line-height: 1.5; padding: 24px; }
h1 { margin: 0 0 8px 0; font-size: 28px; font-weight: 600; }
h2 { margin: 0 0 12px 0; font-size: 20px; font-weight: 600; }
h3 { margin: 0 0 8px 0; font-size: 14px; font-weight: 600; color: var(--muted); text-transform: uppercase; letter-spacing: 0.05em; }
.container { max-width: 1280px; margin: 0 auto; }
.subtitle { color: var(--muted); margin-bottom: 24px; font-size: 14px; }
.muted { color: var(--muted); font-size: 12px; margin-top: 6px; }
.summary, .cycle { background: var(--paper); border: 1px solid var(--line); border-radius: var(--radius); padding: 20px; box-shadow: var(--shadow); margin-bottom: 24px; }
.cycle h2 { color: var(--teal); }
.cycle-meta { color: var(--muted); font-size: 13px; margin-bottom: 12px; }
.cycle-meta .dot { margin: 0 8px; color: var(--line-strong); }
.dir.ok { color: var(--teal); font-weight: 600; }
.dir.warn { color: var(--coral); font-weight: 600; }
.banner { padding: 10px 14px; border-radius: 6px; margin-bottom: 12px; font-size: 13px; line-height: 1.45; }
.banner.warn { background: #f4ded9; color: #7a3027; border-left: 3px solid var(--coral); }
.banner.mid { background: #f4e6c8; color: #5f4810; border-left: 3px solid var(--gold); }
.grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
.panel { background: #fafaf7; border: 1px solid var(--line); border-radius: 6px; padding: 14px; }
table { border-collapse: collapse; width: 100%; font-size: 13px; }
th { text-align: left; font-weight: 500; color: var(--muted); border-bottom: 1px solid var(--line); padding: 6px 4px; }
td { padding: 4px; border-bottom: 1px solid var(--line); }
td.num, th.num { text-align: right; font-variant-numeric: tabular-nums; }
.sumtable td.gap { font-variant-numeric: tabular-nums; color: var(--muted); }
.sumtable .win-ok { color: var(--teal); font-weight: 600; text-align: center; }
.sumtable .win-bad { color: var(--coral); font-weight: 600; text-align: center; }
.kv { margin-bottom: 8px; }
.kv .gap { font-variant-numeric: tabular-nums; color: var(--muted); }
.cov-svg { vertical-align: middle; }
.vio-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
.vio-cell { padding: 6px; border: 1px solid var(--line); border-radius: 4px; background: white; }
.vio-label { font-size: 12px; font-weight: 600; }
.vio-sub { font-weight: 400; color: var(--muted); margin-left: 4px; font-size: 11px; }
.vio-num { font-size: 11px; color: var(--muted); margin-top: 2px; font-variant-numeric: tabular-nums; }
.arc .rank { color: var(--muted); width: 22px; text-align: right; }
.arc { font-size: 12px; }
.caveats { background: #f4e6c8; border-left: 3px solid var(--gold); padding: 14px 16px; border-radius: 6px; margin: 16px 0; font-size: 13px; line-height: 1.55; }
.caveats h3 { color: #5f4810; margin-bottom: 6px; }
.caveats li { margin-bottom: 4px; }
nav.toc { font-size: 13px; padding: 8px 12px; background: #ecefeb; border-radius: 6px; display: inline-block; margin-bottom: 16px; }
nav.toc a { color: var(--teal); margin-right: 12px; text-decoration: none; }
nav.toc a:hover { text-decoration: underline; }
</style>
</head><body>
<div class="container">
  <h1>PRISM 5-Cycle Backtest Dashboard</h1>
  <div class="subtitle">CCES microdata → surveyToPrismMapper (point estimate) → predictVote → weighted aggregate. Compared against FEC popular-vote totals.</div>

  <nav class="toc">Jump to: ${data.cycles.map(c => `<a href="#y${c.year}">${c.year}</a>`).join(" ")}</nav>

  ${summary}

  <div class="caveats">
    <h3>How to read these gaps</h3>
    <ul>
      <li><strong>2008 (~5% mapper coverage):</strong> all node positions fall back to uniform priors. Predictions reflect the population center distance to each candidate, not modelled vote choice. The 31pp gap is a coverage-gap demonstration.</li>
      <li><strong>2012 (~20% mapper coverage, MAT only):</strong> economic-axis signal only; cultural / moral / system axes are fallback. Directional read at best.</li>
      <li><strong>2016 / 2020 / 2024:</strong> meaningful coverage. Two systematic biases visible at the model layer (separable from coverage):
        <ul style="margin-top: 4px;">
          <li>Pre-existing model D-bias of ~11pp on 2020 archetype-centroid baseline (<code>voteModelSmoke</code>): centrist policy positions sit closer to D candidate profiles than to recent R candidates (especially Trump's CD/CU/MOR positioning).</li>
          <li>Thin-coverage shrinkage adds another ~10pp: respondents with mostly-fallback signatures land at the population center, which is closer to D issue positions.</li>
          <li><strong>partyID is not passed to the predictor</strong> in this run — <code>partisanLoyaltyMultiplier</code> (post-1932 modifier) defaults to 1.0×, removing the partisan-loyalty pull that would route many cross-pressured voters to vote with their party despite issue-distance.</li>
        </ul>
      </li>
      <li><strong>Directionality:</strong> the model gets 4/5 winners right. 2024 (Trump win) is incorrectly predicted as D — same finding as the archetype-centroid baseline.</li>
    </ul>
  </div>

  ${cycleSections}

  <div class="muted" style="margin-top: 32px; text-align: center;">
    Pipeline: <code>multiCycleBacktest.ts</code> → <code>cces2BacktestRunner.ts</code> → <code>backtestDashboardRenderer.ts</code><br>
    Decisions: signature representation = ${escape(data.decisions.signature_representation)}; partyID passed = ${data.decisions.partyID_passed_to_predictor}; anchorDist passed = ${data.decisions.anchorDist_passed_to_predictor}.
  </div>
</div>
</body></html>`;
}

async function main() {
  const data = JSON.parse(fs.readFileSync(IN_JSON, "utf8"));
  const html = renderHTML(data);
  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(OUT_HTML, html);
  console.log(`Wrote ${OUT_HTML} (${(html.length / 1024).toFixed(1)} KB)`);
}

main().catch(err => { console.error(err); process.exit(1); });
