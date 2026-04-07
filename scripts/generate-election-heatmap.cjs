/**
 * Generate an election heatmap: all archetypes (rows) x all elections (columns),
 * colored by historical party.
 *
 * Usage: node scripts/generate-election-heatmap.cjs
 */

const { readFileSync, writeFileSync } = require("fs");
const { join } = require("path");

const elections = JSON.parse(readFileSync(join(__dirname, "../output/live-data/elections.json"), "utf8"));
const archetypes = JSON.parse(readFileSync(join(__dirname, "../output/live-data/archetypes.json"), "utf8"));

// ── Map candidates to real historical parties ─────────────────────────────

const HISTORICAL_PARTY = {
  // 1789-1820: Federalist vs Democratic-Republican
  "1789:Washington": "nonpartisan",
  "1792:Washington": "nonpartisan",
  "1796:Adams": "federalist", "1800:Adams": "federalist",
  "1796:Jefferson": "dem-rep", "1800:Jefferson": "dem-rep",
  "1804:Jefferson": "dem-rep", "1804:Pinckney": "federalist",
  "1808:Madison": "dem-rep", "1808:Pinckney": "federalist",
  "1812:Madison": "dem-rep", "1812:Clinton": "federalist",
  "1816:Monroe": "dem-rep", "1816:King": "federalist",
  "1820:Monroe": "dem-rep",

  // 1824-1828: Era of Good Feelings → Jacksonian split
  "1824:Jackson": "dem", "1824:Adams": "nat-rep",
  "1824:Crawford": "dem-rep", "1824:Clay": "nat-rep",
  "1828:Jackson": "dem", "1828:Adams": "nat-rep",

  // 1832-1852: Democrats vs Whigs
  "1832:Jackson": "dem", "1832:Clay": "whig",
  "1836:Van Buren": "dem", "1836:Harrison": "whig",
  "1840:Harrison": "whig", "1840:Van Buren": "dem",
  "1844:Polk": "dem", "1844:Clay": "whig",
  "1848:Taylor": "whig", "1848:Cass": "dem", "1848:Van Buren": "free-soil",
  "1852:Scott": "whig", "1852:Pierce": "dem",

  // 1856: Know-Nothing / American Party
  "1856:Fillmore": "know-nothing",
  "1856:Buchanan": "dem", "1856:Fremont": "rep",

  // 1860: Four-way split
  "1860:Lincoln": "rep", "1860:Douglas": "dem",
  "1860:Breckinridge": "south-dem", "1860:Bell": "const-union",

  // 1872: Liberal Republican crossover
  "1872:Greeley": "lib-rep",

  // 1832: Anti-Masonic
  "1832:Wirt": "anti-masonic",

  // 1892: Populist Party
  "1892:Weaver": "populist",

  // 1900-1920: Socialist Party
  "1900:Debs": "socialist", "1904:Debs": "socialist",
  "1908:Debs": "socialist", "1912:Debs": "socialist",
  "1916:Benson": "socialist", "1920:Debs": "socialist",

  // 1912: Bull Moose
  "1912:Roosevelt": "progressive",
  // 1924: La Follette Progressive
  "1924:La Follette": "progressive",

  // 1948: Dixiecrat + Progressive
  "1948:Thurmond": "dixiecrat",
  "1948:H. Wallace": "progressive",

  // 1968: American Independent
  "1968:Wallace": "am-indep",

  // 1980: Anderson independent
  "1980:Anderson": "independent",

  // 1992/1996: Perot
  "1992:Perot": "reform",
  "1996:Perot": "reform",

  // 2000: Nader Green
  "2000:Nader": "green",

  // 2016: Gary Johnson Libertarian
  "2016:Johnson": "libertarian",
};

function getHistoricalParty(year, candidate, simpleParty) {
  const key = year + ":" + candidate;
  if (HISTORICAL_PARTY[key]) return HISTORICAL_PARTY[key];
  if (candidate === "ABSTAIN") return "abstain";
  // Fall through to simple party for everything else
  return simpleParty;
}

// ── Party colors ──────────────────────────────────────────────────────────

const PARTY_COLORS = {
  "dem":         { bg: "#2166ac", fg: "#fff", label: "Democrat" },
  "rep":         { bg: "#b2182b", fg: "#fff", label: "Republican" },
  "federalist":  { bg: "#6a3d9a", fg: "#fff", label: "Federalist" },
  "dem-rep":     { bg: "#1a7a4c", fg: "#fff", label: "Dem-Republican" },
  "nat-rep":     { bg: "#8856a7", fg: "#fff", label: "National Republican" },
  "whig":        { bg: "#e6a800", fg: "#000", label: "Whig" },
  "free-soil":   { bg: "#33a02c", fg: "#fff", label: "Free Soil" },
  "know-nothing":{ bg: "#a65628", fg: "#fff", label: "Know-Nothing" },
  "south-dem":   { bg: "#1f4e79", fg: "#fff", label: "Southern Democrat" },
  "const-union": { bg: "#d4a574", fg: "#000", label: "Constitutional Union" },
  "lib-rep":     { bg: "#e08080", fg: "#000", label: "Liberal Republican" },
  "anti-masonic": { bg: "#8B6914", fg: "#fff", label: "Anti-Masonic" },
  "socialist":   { bg: "#DC143C", fg: "#fff", label: "Socialist" },
  "populist":    { bg: "#ff7f00", fg: "#000", label: "Populist" },
  "progressive": { bg: "#33a02c", fg: "#fff", label: "Progressive" },
  "dixiecrat":   { bg: "#4a6a8a", fg: "#fff", label: "Dixiecrat" },
  "am-indep":    { bg: "#984ea3", fg: "#fff", label: "Am. Independent" },
  "independent": { bg: "#999999", fg: "#fff", label: "Independent" },
  "reform":      { bg: "#ff7f00", fg: "#000", label: "Reform" },
  "green":       { bg: "#2ca02c", fg: "#fff", label: "Green" },
  "libertarian": { bg: "#ffd700", fg: "#000", label: "Libertarian" },
  "nonpartisan": { bg: "#c8b87c", fg: "#000", label: "Nonpartisan" },
  "abstain":     { bg: "#1a1a2e", fg: "#444", label: "Abstain" },
  "other":       { bg: "#666666", fg: "#fff", label: "Other" },
  "third":       { bg: "#ff7f00", fg: "#000", label: "Third Party" },
};

// ── Build data structures ─────────────────────────────────────────────────

// Get sorted years
const allYears = new Set();
for (const votes of Object.values(elections)) {
  for (const v of votes) allYears.add(v.y);
}
const years = [...allYears].sort((a, b) => a - b);

// Get archetype list sorted by ID
const archIds = Object.keys(elections).sort((a, b) => {
  const na = parseInt(a), nb = parseInt(b);
  return na - nb;
});

// Build archetype name + description lookup
const archNames = {};
const archDescs = {};
for (const a of archetypes) {
  archNames[String(a.id)] = a.name;
  archDescs[String(a.id)] = a.description || '';
}

// ── Generate HTML ─────────────────────────────────────────────────────────

function esc(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// Era markers for column grouping
const ERA_BREAKS = [
  { year: 1789, label: "Founding" },
  { year: 1828, label: "Jacksonian" },
  { year: 1860, label: "Civil War" },
  { year: 1896, label: "Gilded/Prog" },
  { year: 1932, label: "New Deal" },
  { year: 1968, label: "Realignment" },
  { year: 2000, label: "Modern" },
];

function buildHtml() {
  // Build legend from parties actually used
  const usedParties = new Set();
  for (const id of archIds) {
    for (const v of elections[id]) {
      usedParties.add(getHistoricalParty(v.y, v.c, v.p));
    }
  }

  const legendItems = Object.entries(PARTY_COLORS)
    .filter(([key]) => usedParties.has(key))
    .map(([key, { bg, fg, label }]) =>
      `<span class="legend-item"><span class="legend-swatch" style="background:${bg};color:${fg}"></span>${esc(label)}</span>`
    ).join("\n");

  // Build header row
  let headerCells = `<th class="row-header sticky-col">Archetype</th>`;
  for (const y of years) {
    const eraBreak = ERA_BREAKS.find(e => e.year === y);
    const cls = eraBreak ? ' class="era-start"' : '';
    headerCells += `<th${cls}>${y}</th>`;
  }

  // Build data rows
  let rows = "";
  for (const id of archIds) {
    const name = archNames[id] || id;
    const votes = elections[id];
    const voteMap = {};
    for (const v of votes) {
      voteMap[v.y] = v;
    }

    const desc = archDescs[id] || '';
    const rowTitle = desc ? `${name}\n\n${desc}` : name;
    let cells = `<td class="row-header sticky-col" title="${esc(rowTitle)}"><span class="arch-id">${id}</span> ${esc(name)}</td>`;
    for (const y of years) {
      const v = voteMap[y];
      if (!v) {
        cells += `<td class="cell empty"></td>`;
        continue;
      }
      const party = getHistoricalParty(v.y, v.c, v.p);
      const color = PARTY_COLORS[party] || PARTY_COLORS.other;
      const tooltip = `${v.y}: ${v.c} (${PARTY_COLORS[party]?.label || party})`;
      const candInitial = v.c === "ABSTAIN" ? "" : v.c.charAt(0);
      cells += `<td class="cell" style="background:${color.bg};color:${color.fg}" title="${esc(tooltip)}">${candInitial}</td>`;
    }
    rows += `<tr>${cells}</tr>\n`;
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>PRISM &mdash; Election Heatmap (All Archetypes &times; All Elections)</title>
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
    display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 20px;
    padding: 12px 16px; background: var(--card); border: 1px solid var(--border);
    border-radius: 8px; font-size: 12px;
  }
  .legend-item { display: flex; align-items: center; gap: 5px; }
  .legend-swatch { display: inline-block; width: 14px; height: 14px; border-radius: 2px; border: 1px solid rgba(255,255,255,0.15); }

  .table-wrap {
    overflow-x: auto; overflow-y: auto; max-height: 90vh;
    border: 1px solid var(--border); border-radius: 8px; background: var(--card);
  }
  table { border-collapse: collapse; font-size: 11px; white-space: nowrap; }

  th {
    position: sticky; top: 0; z-index: 2;
    background: #1c2128; color: var(--muted); font-weight: 600;
    padding: 4px 2px; text-align: center; font-size: 10px;
    border-bottom: 2px solid var(--border);
    writing-mode: vertical-rl; text-orientation: mixed;
    height: 60px; min-width: 18px;
  }
  th.sticky-col {
    position: sticky; left: 0; top: 0; z-index: 3;
    writing-mode: horizontal-tb; text-align: left;
    padding: 4px 10px; width: 230px; min-width: 230px;
    font-size: 11px; height: auto;
  }
  th.era-start { border-left: 2px solid var(--accent); }

  td.row-header {
    position: sticky; left: 0; z-index: 1;
    background: #1c2128; padding: 2px 10px;
    border-right: 1px solid var(--border);
    font-size: 11px; white-space: nowrap;
  }
  td.row-header:hover { background: #22272e; }
  .arch-id { font-family: monospace; color: var(--muted); font-size: 10px; margin-right: 4px; }

  td.cell {
    width: 18px; min-width: 18px; max-width: 18px;
    height: 18px; text-align: center; font-size: 9px; font-weight: 700;
    border: 1px solid rgba(0,0,0,0.3); cursor: default;
    padding: 0; line-height: 18px;
  }
  td.cell.empty { background: #0d1117; }

  tr:hover td.row-header { background: #272d35 !important; }
  tr:hover td.cell { outline: 1px solid rgba(255,255,255,0.1); }

  /* Zebra striping */
  tr:nth-child(even) td.row-header { background: #171d25; }
  tr:nth-child(even):hover td.row-header { background: #272d35 !important; }

  footer { text-align: center; color: var(--muted); font-size: 11px; padding: 16px 0; }
</style>
</head>
<body>
<h1>PRISM Election Heatmap</h1>
<p class="subtitle">${archIds.length} archetypes &times; ${years.length} elections (${years[0]}&ndash;${years[years.length-1]}). Each cell shows the candidate initial; color = historical party.</p>

<div class="legend">${legendItems}</div>

<div class="table-wrap">
<table>
<thead><tr>${headerCells}</tr></thead>
<tbody>
${rows}
</tbody>
</table>
</div>

<footer>Generated ${new Date().toISOString().slice(0, 10)} by PRISM Engine</footer>
</body>
</html>`;
}

const html = buildHtml();
const outPath = join(__dirname, "../output/election-heatmap.html");
writeFileSync(outPath, html);
console.log(`Wrote ${outPath}`);
console.log(`${archIds.length} archetypes x ${years.length} elections = ${archIds.length * years.length} cells`);
