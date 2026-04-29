// PR 5 read-only diagnostic. Per-node distance × salience contribution
// for the three retake archetypes (056 Inst Leftist, 085 Customary Localist,
// 134 Progressive Civic Nationalist) against five fascist/illiberal regimes.
// No code changes — just reports the current world-map alignment formula's
// per-node breakdown so we know whether the Orbán/Nazi miss comes from
// dysfunction math, regime data, or ONT_S architecture.

import { ARCHETYPES } from "../dist/config/archetypes.js";
import { EUROPE_PART1 } from "../dist/global/jurisdictions-europe1.js";
import { EUROPE_PART2 } from "../dist/global/jurisdictions-europe2.js";
import { JURISDICTION_DYSFUNCTION, dysfunctionFactor } from "../dist/global/jurisdictions-dysfunction.js";
import { writeFileSync, readFileSync } from "node:fs";

const DUMPS = [
  { label: "A — Inst Leftist (authentic)",         file: "prism-dump-0cb89086-1777477274433.json", expectedArch: "056" },
  { label: "B — Progressive Civic Nat (tankie)",   file: "prism-dump-720f5027-1777477277728.json", expectedArch: "134" },
  { label: "C — Customary Localist (fascist)",     file: "prism-dump-4901f789-1777477283013.json", expectedArch: "085" },
];

const GAUSSIAN_SIGMA = 2.0;
const CONTINUOUS_NODES = ["MAT","CD","CU","MOR","PRO","COM","ZS","ONT_H","ONT_S"];

const TARGET_ARCHETYPES = ["056","085","134"];
const TARGET_REGIMES = [
  { jurisdiction: "Germany/Prussia",        regime: "Nazi Germany",       startYear: 1933 },
  { jurisdiction: "Italy",                  regime: "Fascist Italy",      startYear: 1922 },
  { jurisdiction: "France",                 regime: "Vichy France",       startYear: 1940 },
  { jurisdiction: "Austria/Austria-Hungary",regime: "Austrofascism/Anschluss", startYear: 1934 },
  { jurisdiction: "Hungary",                regime: "Orban's Hungary",    startYear: 2010 },
];

const ALL_REGIMES = [...EUROPE_PART1, ...EUROPE_PART2];

function findRegime(target) {
  return ALL_REGIMES.find(r =>
    r.jurisdiction === target.jurisdiction &&
    r.regime === target.regime &&
    r.startYear === target.startYear
  );
}

// Archetype-template diagnostic with asymmetric dysfunction (matches PR5 fix).
function diagnose(arch, regime) {
  const rows = [];
  let weightedSumSq = 0;
  let totalWeight = 0;

  for (const node of CONTINUOUS_NODES) {
    const tmpl = arch.nodes[node];
    if (!tmpl || tmpl.kind !== "continuous") continue;
    const archPos = tmpl.pos;
    const archSal = Math.max(tmpl.sal ?? 0, 0.5);
    const regimePos = regime[node];
    if (regimePos == null) continue;

    let antiMultiplier = 1.0;
    if (tmpl.anti) {
      const diff = Math.abs(archPos - regimePos);
      if (diff >= 3) antiMultiplier = 1.3;
      else if (diff >= 2) antiMultiplier = 1.1;
    }
    const posDiff = Math.abs(archPos - regimePos) * antiMultiplier;
    const contribution = archSal * posDiff * posDiff;
    weightedSumSq += contribution;
    totalWeight += archSal;
    rows.push({ node, archPos, archSal: archSal.toFixed(2), regimePos, posDiff: posDiff.toFixed(2), contribution: contribution.toFixed(3) });
  }

  const distance = totalWeight > 0 ? Math.sqrt(weightedSumSq / totalWeight) : 4;
  const support = 100 * Math.exp(-Math.pow(distance / GAUSSIAN_SIGMA, 2));
  const dysKey = `${regime.jurisdiction}|${regime.regime}|${regime.startYear}`;
  const dys = JURISDICTION_DYSFUNCTION[dysKey];
  const dysFactor = dysfunctionFactor(dys);
  const rawAlignment = (support / 50 - 1) * 3;
  const finalAlignment = rawAlignment > 0 ? rawAlignment * dysFactor : rawAlignment;

  return { rows, distance, support, dys, dysFactor, rawAlignment, finalAlignment, totalWeight, weightedSumSq };
}

let out = "# PR 5 baseline diagnostic — pre-fix\n\n";
out += `Date: 2026-04-29\n\n`;
out += `Formula in current code (src/global/build-alignment.ts):\n`;
out += `  distance = sqrt(Σ(sal × diff²) / Σ(sal))\n`;
out += `  support  = 100 × exp(-(distance / ${GAUSSIAN_SIGMA})²)\n`;
out += `  align    = (support / 50 - 1) × 3 × dysFactor   (symmetric — bug under fix in 5.D)\n\n`;

for (const archId of TARGET_ARCHETYPES) {
  const arch = ARCHETYPES.find(a => a.id === archId);
  if (!arch) { out += `\n## ${archId} not found\n`; continue; }
  out += `\n---\n\n## ${arch.id} ${arch.name}\n\n`;

  for (const tgt of TARGET_REGIMES) {
    const regime = findRegime(tgt);
    if (!regime) { out += `\n### ${tgt.regime} not found\n`; continue; }
    const d = diagnose(arch, regime);
    out += `### vs ${regime.jurisdiction} | ${regime.regime} (${regime.startYear}-${regime.endYear})\n\n`;
    out += `Regime values: MAT=${regime.MAT} CD=${regime.CD} CU=${regime.CU} MOR=${regime.MOR} PRO=${regime.PRO} COM=${regime.COM} ZS=${regime.ZS} ONT_H=${regime.ONT_H} ONT_S=${regime.ONT_S}\n\n`;
    out += `| node | archPos | archSal | regimePos | posDiff | sal × diff² |\n`;
    out += `|---|---|---|---|---|---|\n`;
    for (const r of d.rows) {
      out += `| ${r.node} | ${r.archPos} | ${r.archSal} | ${r.regimePos} | ${r.posDiff} | ${r.contribution} |\n`;
    }
    out += `\n**Total weighted sum-sq:** ${d.weightedSumSq.toFixed(3)} · **total sal:** ${d.totalWeight.toFixed(2)}\n`;
    out += `**Distance:** ${d.distance.toFixed(3)} · **support:** ${d.support.toFixed(2)} · **dys tier:** ${d.dys ?? '—'} (factor ${d.dysFactor.toFixed(2)})\n`;
    out += `**Raw alignment (pre-dys):** ${d.rawAlignment.toFixed(3)} · **Final alignment:** ${d.finalAlignment.toFixed(3)}\n\n`;
  }
}

// ── Live-map (respondent posterior) diagnostic ─────────────────────────────
// Uses the same formula as buildPersonalAlignments() in results-live.html:
// no anti-multiplier, respondent's expectedPos + salience (floor 0.5).

// Asymmetric dysfunction: compress positive only (matches PR5 fix).
function diagnoseLive(rs, regime) {
  const rows = [];
  let weightedSumSq = 0;
  let totalWeight = 0;
  for (const node of CONTINUOUS_NODES) {
    const respCont = rs.continuous[node];
    if (!respCont) continue;
    const respPos = respCont.expectedPos;
    const respSal = Math.max(respCont.salience ?? 0, 0.5);
    const regimePos = regime[node];
    if (respPos == null || regimePos == null) continue;
    const posDiff = Math.abs(respPos - regimePos);
    const contribution = respSal * posDiff * posDiff;
    weightedSumSq += contribution;
    totalWeight += respSal;
    rows.push({ node, respPos: respPos.toFixed(2), respSal: respSal.toFixed(2), regimePos, posDiff: posDiff.toFixed(2), contribution: contribution.toFixed(3) });
  }
  const distance = totalWeight > 0 ? Math.sqrt(weightedSumSq / totalWeight) : 4;
  const support = 100 * Math.exp(-Math.pow(distance / GAUSSIAN_SIGMA, 2));
  const dysKey = `${regime.jurisdiction}|${regime.regime}|${regime.startYear}`;
  const dys = JURISDICTION_DYSFUNCTION[dysKey];
  const dysFactor = dysfunctionFactor(dys);
  const rawAlignment = (support / 50 - 1) * 3;
  const finalAlignment = rawAlignment > 0 ? rawAlignment * dysFactor : rawAlignment;
  return { rows, distance, support, dys, dysFactor, rawAlignment, finalAlignment, totalWeight, weightedSumSq };
}

out += `\n\n=================================================================\n`;
out += `# Live-map diagnostic — respondent posterior (this is what Sam saw)\n`;
out += `=================================================================\n\n`;

for (const dump of DUMPS) {
  const j = JSON.parse(readFileSync(dump.file, "utf8"));
  const rs = j.results.respondentState;
  out += `\n---\n\n## ${dump.label}\n\nrunId: ${j.results.runId}\n\n`;
  out += `Posterior: `;
  out += CONTINUOUS_NODES.map(n => `${n}=${rs.continuous[n].expectedPos.toFixed(2)}(sal ${rs.continuous[n].salience.toFixed(2)})`).join(", ");
  out += `\n\n`;
  for (const tgt of TARGET_REGIMES) {
    const regime = findRegime(tgt);
    if (!regime) continue;
    const d = diagnoseLive(rs, regime);
    out += `### vs ${regime.regime}\n\n`;
    out += `| node | respPos | respSal | regimePos | posDiff | sal × diff² |\n`;
    out += `|---|---|---|---|---|---|\n`;
    for (const r of d.rows) {
      out += `| ${r.node} | ${r.respPos} | ${r.respSal} | ${r.regimePos} | ${r.posDiff} | ${r.contribution} |\n`;
    }
    out += `\n**Total weighted sum-sq:** ${d.weightedSumSq.toFixed(3)} · **total sal:** ${d.totalWeight.toFixed(2)}\n`;
    out += `**Distance:** ${d.distance.toFixed(3)} · **support:** ${d.support.toFixed(2)} · **dys tier:** ${d.dys ?? '—'} (factor ${d.dysFactor.toFixed(2)})\n`;
    out += `**Raw alignment (pre-dys):** ${d.rawAlignment.toFixed(3)} · **Final alignment:** ${d.finalAlignment.toFixed(3)}\n\n`;
  }
}

const outFile = process.env.PR5_DIAG_OUT || "results/calibration-exceptions/pr5-diagnostic-baseline.md";
writeFileSync(outFile, out);
console.log("Wrote " + outFile);

console.log("\n=== ARCHETYPE-TEMPLATE quick summary ===");
for (const archId of TARGET_ARCHETYPES) {
  const arch = ARCHETYPES.find(a => a.id === archId);
  if (!arch) continue;
  console.log(`\n${arch.id} ${arch.name}:`);
  for (const tgt of TARGET_REGIMES) {
    const regime = findRegime(tgt);
    if (!regime) continue;
    const d = diagnose(arch, regime);
    console.log(`  ${regime.regime.padEnd(28)} → align=${d.finalAlignment.toFixed(3).padStart(7)}  (raw=${d.rawAlignment.toFixed(3).padStart(7)}, dys=${d.dysFactor.toFixed(2)}, dist=${d.distance.toFixed(2)})`);
  }
}

console.log("\n=== LIVE-MAP (respondent posterior) quick summary ===");
for (const dump of DUMPS) {
  const j = JSON.parse(readFileSync(dump.file, "utf8"));
  const rs = j.results.respondentState;
  console.log(`\n${dump.label}:`);
  for (const tgt of TARGET_REGIMES) {
    const regime = findRegime(tgt);
    if (!regime) continue;
    const d = diagnoseLive(rs, regime);
    console.log(`  ${regime.regime.padEnd(28)} → align=${d.finalAlignment.toFixed(3).padStart(7)}  (raw=${d.rawAlignment.toFixed(3).padStart(7)}, dys=${d.dysFactor.toFixed(2)}, dist=${d.distance.toFixed(2)})`);
  }
}
