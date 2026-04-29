// PR 5.F broad regression — all archetypes × all regimes, current vs Option D.
//
// Reports:
//   1. Top-match drift (top-1, top-3, top-5 overlap per archetype)
//   2. Score distribution (mean, median, p5, p95, sign-flips, threshold-crossings)
//   3. Sanity cases (known archetype-regime pairings)
//
// Current scorer:  9 continuous nodes (MAT/CD/CU/MOR/PRO/COM/ZS/ONT_H/ONT_S),
//                  σ=2.0, asymmetric dysfunction, anti-multiplier, no AES.
// Option D scorer: 7 continuous (drops ZS/ONT_H), AES lock-and-key,
//                  σ=1.765, AES_SCALE=2, asymmetric dysfunction, anti-multiplier.

import { ARCHETYPES } from "../dist/config/archetypes.js";
import { EUROPE_PART1 } from "../dist/global/jurisdictions-europe1.js";
import { EUROPE_PART2 } from "../dist/global/jurisdictions-europe2.js";
import { AMERICAS } from "../dist/global/jurisdictions-americas.js";
import { ASIA } from "../dist/global/jurisdictions-asia.js";
import { MENA_AFRICA } from "../dist/global/jurisdictions-mena.js";
import { JURISDICTION_DYSFUNCTION, dysfunctionFactor } from "../dist/global/jurisdictions-dysfunction.js";
import { writeFileSync } from "node:fs";

const ALL_REGIMES = [...EUROPE_PART1, ...EUROPE_PART2, ...AMERICAS, ...ASIA, ...MENA_AFRICA];
const ALL_9 = ["MAT","CD","CU","MOR","PRO","COM","ZS","ONT_H","ONT_S"];
const NEW_7 = ["MAT","CD","CU","MOR","PRO","COM","ONT_S"];
const SAL_FLOOR = 0.5;

function score(arch, regime, opts) {
  let weightedSumSq = 0;
  let totalWeight = 0;

  for (const node of opts.nodes) {
    const tmpl = arch.nodes[node];
    if (!tmpl || tmpl.kind !== "continuous") continue;
    const archPos = tmpl.pos;
    const archSal = Math.max(tmpl.sal ?? 0, SAL_FLOOR);
    const regimePos = regime[node];
    if (regimePos == null) continue;

    let antiMultiplier = 1.0;
    if (tmpl.anti) {
      const diff = Math.abs(archPos - regimePos);
      if (diff >= 3) antiMultiplier = 1.3;
      else if (diff >= 2) antiMultiplier = 1.1;
    }
    const posDiff = Math.abs(archPos - regimePos) * antiMultiplier;
    weightedSumSq += archSal * posDiff * posDiff;
    totalWeight += archSal;
  }

  if (opts.includeAES) {
    const aesNode = arch.nodes.AES;
    if (aesNode && aesNode.kind === "categorical" && Array.isArray(aesNode.probs) && regime.AES != null) {
      const archProb = aesNode.probs[regime.AES] ?? 0;
      const penalty = 1 - archProb;
      const aesSal = Math.max(aesNode.sal ?? 0, SAL_FLOOR);
      const diff = penalty * opts.aesScale;
      weightedSumSq += aesSal * diff * diff;
      totalWeight += aesSal;
    }
  }

  const distance = totalWeight > 0 ? Math.sqrt(weightedSumSq / totalWeight) : 4;
  const support = 100 * Math.exp(-Math.pow(distance / opts.sigma, 2));
  const dysKey = `${regime.jurisdiction}|${regime.regime}|${regime.startYear}`;
  const dys = JURISDICTION_DYSFUNCTION[dysKey];
  const dysFactor = dysfunctionFactor(dys);
  const rawAlignment = (support / 50 - 1) * 3;
  const finalAlignment = rawAlignment > 0 ? rawAlignment * dysFactor : rawAlignment;
  return Math.max(-3, Math.min(3, +finalAlignment.toFixed(3)));
}

const CURRENT = { nodes: ALL_9, sigma: 2.0, includeAES: false, aesScale: 0 };
const OPTION_D = { nodes: NEW_7, sigma: 1.765, includeAES: true, aesScale: 2 };

// 1. Compute all scores
console.log(`Computing ${ARCHETYPES.length} × ${ALL_REGIMES.length} = ${ARCHETYPES.length * ALL_REGIMES.length} cells × 2 variants...`);

const cellsByArch = new Map(); // archId -> [{regimeKey, current, optD, regime}]
for (const arch of ARCHETYPES) {
  const cells = ALL_REGIMES.map(regime => ({
    regimeKey: `${regime.jurisdiction}|${regime.regime}|${regime.startYear}`,
    regime,
    current: score(arch, regime, CURRENT),
    optD: score(arch, regime, OPTION_D),
  }));
  cellsByArch.set(arch.id, cells);
}

// 2. Top-match drift
function topN(cells, n, key) {
  return [...cells].sort((a, b) => b[key] - a[key]).slice(0, n);
}

let top1Same = 0, top1Diff = 0;
let top3Overlap3 = 0, top3Overlap2 = 0, top3Overlap1 = 0, top3Overlap0 = 0;
let top5Overlap5 = 0, top5Overlap4plus = 0, top5Overlap3 = 0, top5OverlapLT3 = 0;
const top1ChangeArchetypes = [];

for (const arch of ARCHETYPES) {
  const cells = cellsByArch.get(arch.id);
  const cur1 = topN(cells, 1, "current")[0];
  const optD1 = topN(cells, 1, "optD")[0];
  if (cur1.regimeKey === optD1.regimeKey) top1Same++;
  else {
    top1Diff++;
    top1ChangeArchetypes.push({
      archId: arch.id,
      archName: arch.name,
      curBest: cur1.regime.regime,
      curBestScore: cur1.current,
      optDBest: optD1.regime.regime,
      optDBestScore: optD1.optD,
    });
  }

  const cur3keys = new Set(topN(cells, 3, "current").map(c => c.regimeKey));
  const optD3keys = new Set(topN(cells, 3, "optD").map(c => c.regimeKey));
  const overlap3 = [...cur3keys].filter(k => optD3keys.has(k)).length;
  if (overlap3 === 3) top3Overlap3++;
  else if (overlap3 === 2) top3Overlap2++;
  else if (overlap3 === 1) top3Overlap1++;
  else top3Overlap0++;

  const cur5keys = new Set(topN(cells, 5, "current").map(c => c.regimeKey));
  const optD5keys = new Set(topN(cells, 5, "optD").map(c => c.regimeKey));
  const overlap5 = [...cur5keys].filter(k => optD5keys.has(k)).length;
  if (overlap5 === 5) top5Overlap5++;
  else if (overlap5 === 4) top5Overlap4plus++;
  else if (overlap5 === 3) top5Overlap3++;
  else top5OverlapLT3++;
}

// 3. Score distribution
function distStats(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const n = sorted.length;
  const mean = values.reduce((s, x) => s + x, 0) / n;
  const median = sorted[Math.floor(n / 2)];
  const p5 = sorted[Math.floor(n * 0.05)];
  const p95 = sorted[Math.floor(n * 0.95)];
  const min = sorted[0];
  const max = sorted[n - 1];
  return { n, mean, median, p5, p95, min, max };
}

const allCurrent = [];
const allOptD = [];
let signFlipPositive = 0;   // current<0, optD>0 (became positive)
let signFlipNegative = 0;   // current>0, optD<0 (became negative)
let bigShifts = 0;          // |delta| > 1.0
for (const arch of ARCHETYPES) {
  for (const cell of cellsByArch.get(arch.id)) {
    allCurrent.push(cell.current);
    allOptD.push(cell.optD);
    if (cell.current < -0.05 && cell.optD > 0.05) signFlipPositive++;
    if (cell.current > 0.05 && cell.optD < -0.05) signFlipNegative++;
    if (Math.abs(cell.optD - cell.current) > 1.0) bigShifts++;
  }
}

const curStats = distStats(allCurrent);
const optDStats = distStats(allOptD);

// 4. Sanity cases
const SANITY_CASES = [
  { archId: "056", archName: "Institutional Leftist", regime: "New Deal/WWII", year: 1933, expected: "very positive" },
  { archId: "056", archName: "Institutional Leftist", regime: "Folkhem Peak", year: 1946, expected: "very positive" },
  { archId: "056", archName: "Institutional Leftist", regime: "Nazi Germany", year: 1933, expected: "very negative" },
  { archId: "056", archName: "Institutional Leftist", regime: "Orban's Hungary", year: 2010, expected: "negative" },
  { archId: "011", archName: "Jacobin Egalitarian", regime: "Stalin", year: 1929, expected: "positive (revolutionary leftist with Stalin)" },
  { archId: "011", archName: "Jacobin Egalitarian", regime: "Mao Radical", year: 1958, expected: "positive" },
  { archId: "085", archName: "Customary Localist", regime: "Orban's Hungary", year: 2010, expected: "very positive" },
  { archId: "085", archName: "Customary Localist", regime: "Fascist Italy", year: 1922, expected: "positive" },
  { archId: "085", archName: "Customary Localist", regime: "Folkhem Peak", year: 1946, expected: "very negative" },
  { archId: "088", archName: "Gentle Traditionalist", regime: "Bonn Republic", year: 1949, expected: "moderate positive (postwar conservative-friendly)", regimeNameSubstring: "Bonn" },
  { archId: "089", archName: "Integral Traditionalist", regime: "Vichy France", year: 1940, expected: "positive (catholic traditionalist with Vichy)" },
  { archId: "022", archName: "Pluralist Universalist", regime: "Folkhem Peak", year: 1946, expected: "positive" },
  { archId: "022", archName: "Pluralist Universalist", regime: "Nazi Germany", year: 1933, expected: "very negative" },
  { archId: "110", archName: "Principled Abstainer", regime: "Bonn Republic", year: 1949, expected: "positive", regimeNameSubstring: "Bonn" },
  { archId: "134", archName: "Progressive Civic Nationalist", regime: "Stalin", year: 1929, expected: "negative (tankie name doesn't match Stalin geometry)" },
];

function findRegime(name, year) {
  return ALL_REGIMES.find(r => r.regime === name && r.startYear === year);
}
function findRegimeBySubstring(sub) {
  return ALL_REGIMES.find(r => r.regime.includes(sub));
}

const sanityResults = SANITY_CASES.map(sc => {
  const regime = sc.regimeNameSubstring ? findRegimeBySubstring(sc.regimeNameSubstring) : findRegime(sc.regime, sc.year);
  if (!regime) return { ...sc, status: "REGIME NOT FOUND" };
  const arch = ARCHETYPES.find(a => a.id === sc.archId);
  if (!arch) return { ...sc, status: "ARCHETYPE NOT FOUND" };
  const cur = score(arch, regime, CURRENT);
  const optD = score(arch, regime, OPTION_D);
  return { ...sc, regime: regime.regime, year: regime.startYear, current: cur, optD, delta: optD - cur };
});

// === Build markdown output ===

let out = "# PR 5.F broad regression — current vs Option D\n\n";
out += `Date: 2026-04-29\n\n`;
out += `Cells: ${ARCHETYPES.length} archetypes × ${ALL_REGIMES.length} regimes = ${ARCHETYPES.length * ALL_REGIMES.length}\n\n`;
out += `**Current**: 9 continuous nodes (MAT/CD/CU/MOR/PRO/COM/ZS/ONT_H/ONT_S), σ=2.0, asymmetric dysfunction, anti-multiplier.\n`;
out += `**Option D**: 7 continuous (drops ZS/ONT_H) + AES lock-and-key, σ=1.765, AES_SCALE=2, asymmetric dysfunction, anti-multiplier.\n\n`;

out += "## 1. Top-match drift\n\n";
out += `**Top-1 stability**: ${top1Same}/${ARCHETYPES.length} archetypes keep same top regime (${(100*top1Same/ARCHETYPES.length).toFixed(1)}%); ${top1Diff} change.\n\n`;
out += `**Top-3 overlap**: 3-overlap=${top3Overlap3}, 2-overlap=${top3Overlap2}, 1-overlap=${top3Overlap1}, 0-overlap=${top3Overlap0}.\n\n`;
out += `**Top-5 overlap**: 5-overlap=${top5Overlap5}, 4-overlap=${top5Overlap4plus}, 3-overlap=${top5Overlap3}, <3=${top5OverlapLT3}.\n\n`;

if (top1ChangeArchetypes.length > 0) {
  out += `### Top-1 changes (${top1ChangeArchetypes.length})\n\n`;
  out += `| arch | name | current best | (cur score) | Option D best | (D score) |\n`;
  out += `|---|---|---|---|---|---|\n`;
  for (const c of top1ChangeArchetypes) {
    out += `| ${c.archId} | ${c.archName} | ${c.curBest} | ${c.curBestScore.toFixed(2)} | ${c.optDBest} | ${c.optDBestScore.toFixed(2)} |\n`;
  }
}

out += "\n## 2. Score distribution\n\n";
out += `| stat | current | Option D | delta |\n|---|---|---|---|\n`;
out += `| mean | ${curStats.mean.toFixed(3)} | ${optDStats.mean.toFixed(3)} | ${(optDStats.mean - curStats.mean).toFixed(3)} |\n`;
out += `| median | ${curStats.median.toFixed(3)} | ${optDStats.median.toFixed(3)} | ${(optDStats.median - curStats.median).toFixed(3)} |\n`;
out += `| p5 | ${curStats.p5.toFixed(3)} | ${optDStats.p5.toFixed(3)} | ${(optDStats.p5 - curStats.p5).toFixed(3)} |\n`;
out += `| p95 | ${curStats.p95.toFixed(3)} | ${optDStats.p95.toFixed(3)} | ${(optDStats.p95 - curStats.p95).toFixed(3)} |\n`;
out += `| min | ${curStats.min.toFixed(3)} | ${optDStats.min.toFixed(3)} | — |\n`;
out += `| max | ${curStats.max.toFixed(3)} | ${optDStats.max.toFixed(3)} | — |\n\n`;
out += `**Sign-flips:**\n`;
out += `- Negative→Positive: ${signFlipPositive} cells (${(100*signFlipPositive/allCurrent.length).toFixed(2)}%)\n`;
out += `- Positive→Negative: ${signFlipNegative} cells (${(100*signFlipNegative/allCurrent.length).toFixed(2)}%)\n`;
out += `- |Δ| > 1.0: ${bigShifts} cells (${(100*bigShifts/allCurrent.length).toFixed(2)}%)\n\n`;

out += "## 3. Sanity cases\n\n";
out += `| arch | regime | expected | current | Option D | Δ |\n|---|---|---|---|---|---|\n`;
for (const r of sanityResults) {
  if (r.status) {
    out += `| ${r.archId} ${r.archName} | ${r.regime} | ${r.expected} | ${r.status} | — | — |\n`;
  } else {
    out += `| ${r.archId} ${r.archName} | ${r.regime} (${r.year}) | ${r.expected} | ${r.current.toFixed(2)} | ${r.optD.toFixed(2)} | ${r.delta.toFixed(2)} |\n`;
  }
}

writeFileSync("results/calibration-exceptions/pr5f-regression.md", out);
console.log("Wrote results/calibration-exceptions/pr5f-regression.md");

// Console summary
console.log("\n=== SUMMARY ===");
console.log(`Top-1 stability: ${top1Same}/${ARCHETYPES.length} (${(100*top1Same/ARCHETYPES.length).toFixed(1)}%)`);
console.log(`Top-3 overlap: 3-overlap=${top3Overlap3}, 2-overlap=${top3Overlap2}, 1-overlap=${top3Overlap1}, 0-overlap=${top3Overlap0}`);
console.log(`Top-5 overlap: 5-overlap=${top5Overlap5}, 4-overlap=${top5Overlap4plus}, 3-overlap=${top5Overlap3}, <3=${top5OverlapLT3}`);
console.log(`\nMean: ${curStats.mean.toFixed(3)} → ${optDStats.mean.toFixed(3)}  (Δ ${(optDStats.mean - curStats.mean).toFixed(3)})`);
console.log(`Median: ${curStats.median.toFixed(3)} → ${optDStats.median.toFixed(3)}`);
console.log(`p5/p95: [${curStats.p5.toFixed(2)}, ${curStats.p95.toFixed(2)}] → [${optDStats.p5.toFixed(2)}, ${optDStats.p95.toFixed(2)}]`);
console.log(`Sign-flips: neg→pos ${signFlipPositive} (${(100*signFlipPositive/allCurrent.length).toFixed(2)}%), pos→neg ${signFlipNegative} (${(100*signFlipNegative/allCurrent.length).toFixed(2)}%)`);
console.log(`|Δ| > 1.0: ${bigShifts} cells (${(100*bigShifts/allCurrent.length).toFixed(2)}%)`);

console.log("\n=== SANITY CASES ===");
for (const r of sanityResults) {
  if (r.status) console.log(`  ${r.archId} ${r.archName.padEnd(30)} × ${r.regime.padEnd(28)} STATUS=${r.status}`);
  else console.log(`  ${r.archId} ${r.archName.padEnd(30)} × ${r.regime.substring(0,28).padEnd(28)} cur=${r.current.toFixed(2).padStart(5)}  D=${r.optD.toFixed(2).padStart(5)}  Δ=${r.delta.toFixed(2).padStart(5)}  expected: ${r.expected}`);
}
