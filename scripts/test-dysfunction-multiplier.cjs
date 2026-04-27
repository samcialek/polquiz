// Test dysfunction multiplier by computing personal alignment for Sam's
// quiz NodeSignature against all regime eras, both raw and dampened.
// Reports top dysfunction-attenuated regimes, top still-aligned regimes,
// and specific landmark cases (Weimar, Peru collapse, etc).

const fs = require("node:fs");
const path = require("node:path");

const regimes = JSON.parse(fs.readFileSync(
  path.resolve(__dirname, "../output/live-data/regimes.json"), "utf8"));

// Sam's NodeSignature from live quiz session.
const SAM = {
  MAT: { pos: 1.61, sal: 2.91 },
  CD: { pos: 2.30, sal: 1.67 },
  CU: { pos: 3.00, sal: 2.88 },
  MOR: { pos: 4.04, sal: 2.08 },
  PRO: { pos: 3.56, sal: 2.21 },
  COM: { pos: 3.44, sal: 1.92 },
  ZS: { pos: 1.94, sal: 1.62 },
  ONT_H: { pos: 4.00, sal: 1.58 },
  ONT_S: { pos: 4.18, sal: 2.95 },
};

const NODES = ["MAT","CD","CU","MOR","PRO","COM","ZS","ONT_H","ONT_S"];
const SIGMA = 2.0;
const SAL_FLOOR = 0.5;

function dysfunctionFactor(d) {
  if (d == null || d <= 1) return 1.00;
  if (d <= 2) return 0.92;
  if (d <= 3) return 0.80;
  if (d <= 4) return 0.60;
  return 0.35;
}

function alignment(eraNodes, dysfunction) {
  let sumSq = 0, totalW = 0;
  for (const n of NODES) {
    const sig = SAM[n];
    if (!sig) continue;
    const sal = Math.max(sig.sal ?? 0, SAL_FLOOR);
    const regimePos = eraNodes[n];
    if (regimePos == null) continue;
    const diff = Math.abs(sig.pos - regimePos);
    sumSq += sal * diff * diff;
    totalW += sal;
  }
  const distance = totalW > 0 ? Math.sqrt(sumSq / totalW) : 4;
  const support = 100 * Math.exp(-Math.pow(distance / SIGMA, 2));
  const raw = (support / 50 - 1) * 3;
  const factor = dysfunctionFactor(dysfunction);
  const dampened = raw * factor;
  return {
    raw: Math.max(-3, Math.min(3, +raw.toFixed(3))),
    dampened: Math.max(-3, Math.min(3, +dampened.toFixed(3))),
    factor,
  };
}

// Collect every era entry with raw + dampened alignment.
const all = [];
for (const [country, c] of Object.entries(regimes)) {
  for (const era of c.eras || []) {
    const a = alignment(era.nodes || {}, era.dysfunction);
    all.push({
      country,
      regime: era.regime_name,
      start: era.start,
      end: era.end,
      d: era.dysfunction ?? null,
      raw: a.raw,
      dampened: a.dampened,
      delta: +(a.dampened - a.raw).toFixed(3),
      factor: a.factor,
    });
  }
}

// Top dysfunction-attenuated (largest negative delta on positive raws).
const attenuated = all
  .filter(x => x.raw > 0.5 && x.delta < -0.2)
  .sort((a, b) => a.delta - b.delta);

console.log("=== Top 20 high-alignment regimes attenuated by dysfunction ===\n");
console.log("country / regime (years) | dys | raw → dampened | delta");
console.log("-".repeat(80));
for (const x of attenuated.slice(0, 20)) {
  const tag = `${x.country} / ${x.regime} (${x.start}-${x.end})`;
  console.log(`${tag.slice(0, 48).padEnd(48)} | d${x.d} | ${x.raw.toFixed(2).padStart(5)} → ${x.dampened.toFixed(2).padStart(5)} | ${x.delta.toFixed(2)}`);
}

// Top STILL-aligned regimes after dysfunction (high dampened).
const stillAligned = all.sort((a, b) => b.dampened - a.dampened);
console.log("\n\n=== Top 15 regimes Sam most aligns with AFTER dysfunction multiplier ===\n");
console.log("country / regime (years) | dys | raw → dampened");
console.log("-".repeat(75));
for (const x of stillAligned.slice(0, 15)) {
  const tag = `${x.country} / ${x.regime} (${x.start}-${x.end})`;
  console.log(`${tag.slice(0, 48).padEnd(48)} | d${x.d} | ${x.raw.toFixed(2).padStart(5)} → ${x.dampened.toFixed(2).padStart(5)}`);
}

// Specific landmark checks the user called out.
console.log("\n\n=== Landmark cases user specifically flagged ===\n");
const landmarks = [
  ["Germany", "Weimar"],
  ["Peru", ""],
  ["Norway", ""],
  ["Singapore", ""],
];
for (const [country, regimeFilter] of landmarks) {
  console.log(`\n${country}:`);
  const eras = all.filter(x =>
    x.country === country &&
    (!regimeFilter || x.regime.toLowerCase().includes(regimeFilter.toLowerCase()))
  );
  for (const x of eras) {
    console.log(`  ${x.regime} (${x.start}-${x.end})  d${x.d}  raw=${x.raw.toFixed(2)}  dampened=${x.dampened.toFixed(2)}`);
  }
}
