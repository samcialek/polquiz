// Merge per-era node values from global/regime-profiles.csv into
// output/live-data/regimes.json. The live world-map (results-live.html
// buildPersonalAlignments) reads era.nodes to score the respondent's
// posterior against each regime, so this merge MUST run after build-alignment
// regenerates the CSVs and after build-regimes.cjs writes the basic
// regimes.json. Idempotent.
//
// Pipeline order:
//   1. npm run build
//   2. node scripts/build-global.mjs
//   3. node scripts/export-all-data.cjs
//   4. node build-regimes.cjs
//   5. node scripts/merge-dysfunction-codes.cjs
//   6. node scripts/merge-regime-nodes.cjs   <-- this script

const fs = require("node:fs");
const path = require("node:path");

const profilesPath = path.resolve(__dirname, "../global/regime-profiles.csv");
const regimesPath = path.resolve(__dirname, "../output/live-data/regimes.json");

const ALIGNMENT_NODES = ["MAT","CD","CU","MOR","PRO","COM","ZS","ONT_H","ONT_S"];

// Minimal RFC-ish CSV parser: handles quoted fields with embedded commas.
function parseCsvLine(line) {
  const out = [];
  let cur = "";
  let inQuote = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (inQuote) {
      if (c === '"' && line[i + 1] === '"') { cur += '"'; i++; }
      else if (c === '"') { inQuote = false; }
      else { cur += c; }
    } else {
      if (c === '"') inQuote = true;
      else if (c === ',') { out.push(cur); cur = ""; }
      else cur += c;
    }
  }
  out.push(cur);
  return out;
}

const csv = fs.readFileSync(profilesPath, "utf8");
const lines = csv.split(/\r?\n/).filter(Boolean);
const header = parseCsvLine(lines[0]);
const colIdx = Object.fromEntries(header.map((h, i) => [h, i]));

const profiles = new Map();
for (let i = 1; i < lines.length; i++) {
  const cells = parseCsvLine(lines[i]);
  const jurisdiction = cells[colIdx.jurisdiction];
  const regime = cells[colIdx.regime];
  const startYear = +cells[colIdx.startYear];
  const key = `${jurisdiction}@${regime}@${startYear}`;
  const nodes = {};
  for (const n of ALIGNMENT_NODES) nodes[n] = +cells[colIdx[n]];
  profiles.set(key, nodes);
}

const regimes = JSON.parse(fs.readFileSync(regimesPath, "utf8"));

let matched = 0;
let missed = 0;
const missList = [];
for (const [country, countryData] of Object.entries(regimes)) {
  if (!countryData?.eras) continue;
  for (const era of countryData.eras) {
    const key = `${country}@${era.regime_name}@${era.start}`;
    const nodes = profiles.get(key);
    if (nodes) {
      era.nodes = nodes;
      matched++;
    } else {
      missed++;
      missList.push(key);
    }
  }
}

fs.writeFileSync(regimesPath, JSON.stringify(regimes), "utf8");

console.log(`Matched ${matched} eras with node values.`);
console.log(`Missed ${missed} eras.`);
if (missed > 0 && missed <= 30) {
  console.log("Missed entries:");
  missList.forEach(k => console.log("  " + k));
} else if (missed > 30) {
  console.log("First 30 missed:");
  missList.slice(0, 30).forEach(k => console.log("  " + k));
}
