// PR 5.F sweep — read-only. No changes to live scorer.
//
// Tests 9 variants on the 3 retake archetypes × ~19 test regimes:
//   1. current — 9 continuous nodes (MAT/CD/CU/MOR/PRO/COM/ZS/ONT_H/ONT_S),
//      σ=2.0, asymmetric dysfunction, no AES
//   2-9. new — 7 continuous nodes (MAT/CD/CU/MOR/PRO/COM/ONT_S, drops ZS+ONT_H),
//        AES lock-and-key (1 - respondentProb[regimeAES], scale 2 or 3),
//        σ ∈ {2.0, 1.75, 1.5, 1.3}, asymmetric dysfunction
//
// Acceptance criteria per Sam:
//   AC1. C × Orban > +0.5   (fascist play stays clearly positive on Orbán)
//   AC2. C × Nazi > 0       (positive after dysfunction cap)
//   AC3. C × Fascist Italy > +0.5
//   AC4. A × Orbán < -0.5    (institutional leftist clearly opposes Orbán)
//   AC5. B × Orbán < -0.5    (tankie play clearly opposes Orbán)
//   AC6. A × {Folkhem Peak, Attlee, New Deal/WWII} all > +0.5
//        (substance-matched social-democratic regimes don't get tanked by AES)
//   AC7. A × fighter regimes average < 0
//        (fighter regimes don't become attractive to A solely via continuous nodes)
//
// Output: per-archetype variant matrix + acceptance summary.

import { EUROPE_PART1 } from "../dist/global/jurisdictions-europe1.js";
import { EUROPE_PART2 } from "../dist/global/jurisdictions-europe2.js";
import { AMERICAS } from "../dist/global/jurisdictions-americas.js";
import { ASIA } from "../dist/global/jurisdictions-asia.js";
import { MENA_AFRICA } from "../dist/global/jurisdictions-mena.js";
import { JURISDICTION_DYSFUNCTION, dysfunctionFactor } from "../dist/global/jurisdictions-dysfunction.js";
import { writeFileSync, readFileSync } from "node:fs";

const ALL_9 = ["MAT","CD","CU","MOR","PRO","COM","ZS","ONT_H","ONT_S"];
const NEW_7 = ["MAT","CD","CU","MOR","PRO","COM","ONT_S"];
const AES_NAMES = ["statesman","technocrat","pastoral","authentic","fighter","visionary"];
const SAL_FLOOR = 0.5;

const VARIANTS = [
  { label: "current",     nodes: ALL_9, sigma: 2.0,  includeAES: false, aesScale: 0 },
  { label: "new σ2.0 s2", nodes: NEW_7, sigma: 2.0,  includeAES: true,  aesScale: 2 },
  { label: "new σ2.0 s3", nodes: NEW_7, sigma: 2.0,  includeAES: true,  aesScale: 3 },
  { label: "new σ1.75 s2",nodes: NEW_7, sigma: 1.75, includeAES: true,  aesScale: 2 },
  { label: "new σ1.75 s3",nodes: NEW_7, sigma: 1.75, includeAES: true,  aesScale: 3 },
  { label: "new σ1.5 s2", nodes: NEW_7, sigma: 1.5,  includeAES: true,  aesScale: 2 },
  { label: "new σ1.5 s3", nodes: NEW_7, sigma: 1.5,  includeAES: true,  aesScale: 3 },
  { label: "new σ1.3 s2", nodes: NEW_7, sigma: 1.3,  includeAES: true,  aesScale: 2 },
  { label: "new σ1.3 s3", nodes: NEW_7, sigma: 1.3,  includeAES: true,  aesScale: 3 },
];

const DUMPS = [
  { code: "A", label: "A — Inst Leftist (authentic)",       file: "prism-dump-0cb89086-1777477274433.json" },
  { code: "B", label: "B — Progressive Civic Nat (tankie)", file: "prism-dump-720f5027-1777477277728.json" },
  { code: "C", label: "C — Customary Localist (fascist)",   file: "prism-dump-4901f789-1777477283013.json" },
];

const TEST_REGIMES = [
  { jurisdiction: "Germany/Prussia", regime: "West Germany/Bonn Republic", startYear: 1949, bucket: "liberal-democracy" },
  { jurisdiction: "Sweden", regime: "Folkhem Peak", startYear: 1946, bucket: "liberal-democracy" },
  { jurisdiction: "Switzerland", regime: "Modern Switzerland", startYear: 2011, bucket: "liberal-democracy" },
  { jurisdiction: "United Kingdom", regime: "Attlee/Consensus", startYear: 1946, bucket: "liberal-democracy" },
  { jurisdiction: "Russia/USSR", regime: "Stalin", startYear: 1929, bucket: "totalitarian" },
  { jurisdiction: "China", regime: "Mao Radical", startYear: 1958, bucket: "totalitarian" },
  { jurisdiction: "Germany/Prussia", regime: "Nazi Germany", startYear: 1933, bucket: "totalitarian" },
  { jurisdiction: "Italy", regime: "Fascist Italy", startYear: 1922, bucket: "totalitarian" },
  { jurisdiction: "Hungary", regime: "Orban's Hungary", startYear: 2010, bucket: "modern-illiberal" },
  { jurisdiction: "Russia/USSR", regime: "Putin Era", startYear: 2000, bucket: "modern-illiberal" },
  { jurisdiction: "Ottoman Empire/Turkey", regime: "Erdogan Era", startYear: 2002, bucket: "modern-illiberal" },
  { jurisdiction: "Poland", regime: "PiS Poland", startYear: 1998, bucket: "modern-illiberal" },
  { jurisdiction: "India", regime: "Modi Era", startYear: 2014, bucket: "modern-illiberal" },
  { jurisdiction: "USA", regime: "New Deal/WWII", startYear: 1933, bucket: "us-eras" },
  { jurisdiction: "USA", regime: "Cold War Consensus", startYear: 1953, bucket: "us-eras" },
  { jurisdiction: "USA", regime: "Polarization Era", startYear: 2008, bucket: "us-eras" },
  { jurisdiction: "France", regime: "Fifth Republic Modern", startYear: 1981, bucket: "mid-functional" },
  { jurisdiction: "Israel", regime: "Netanyahu/Right Turn", startYear: 2001, bucket: "mid-functional" },
  { jurisdiction: "Russia/USSR", regime: "Yeltsin", startYear: 1992, bucket: "failed-chaotic" },
  { jurisdiction: "Venezuela", regime: "Maduro", startYear: 2013, bucket: "failed-chaotic" },
];

const ALL_REGIMES = [...EUROPE_PART1, ...EUROPE_PART2, ...AMERICAS, ...ASIA, ...MENA_AFRICA];
function findRegime(target) {
  return ALL_REGIMES.find(r =>
    r.jurisdiction === target.jurisdiction &&
    r.regime === target.regime &&
    r.startYear === target.startYear
  );
}

function score(rs, regime, variant) {
  let weightedSumSq = 0;
  let totalWeight = 0;

  for (const node of variant.nodes) {
    const respCont = rs.continuous[node];
    if (!respCont) continue;
    const respPos = respCont.expectedPos;
    const respSal = Math.max(respCont.salience ?? 0, SAL_FLOOR);
    const regimePos = regime[node];
    if (respPos == null || regimePos == null) continue;
    const posDiff = Math.abs(respPos - regimePos);
    weightedSumSq += respSal * posDiff * posDiff;
    totalWeight += respSal;
  }

  if (variant.includeAES) {
    const aesNode = rs.categorical?.AES;
    if (aesNode && regime.AES != null && Array.isArray(aesNode.catDist)) {
      const respProb = aesNode.catDist[regime.AES] ?? 0;
      const penalty = 1 - respProb;
      const aesSal = Math.max(aesNode.salience ?? 0, SAL_FLOOR);
      const diff = penalty * variant.aesScale;
      weightedSumSq += aesSal * diff * diff;
      totalWeight += aesSal;
    }
  }

  const distance = totalWeight > 0 ? Math.sqrt(weightedSumSq / totalWeight) : 4;
  const support = 100 * Math.exp(-Math.pow(distance / variant.sigma, 2));
  const dysKey = `${regime.jurisdiction}|${regime.regime}|${regime.startYear}`;
  const dys = JURISDICTION_DYSFUNCTION[dysKey];
  const dysFactor = dysfunctionFactor(dys);
  const rawAlignment = (support / 50 - 1) * 3;
  const finalAlignment = rawAlignment > 0 ? rawAlignment * dysFactor : rawAlignment;
  return Math.max(-3, Math.min(3, finalAlignment));
}

// Load posteriors
const dumps = DUMPS.map(d => ({ ...d, rs: JSON.parse(readFileSync(d.file, "utf8")).results.respondentState }));

// Compute scores: matrix[variantIdx][archCode][regimeKey] = score
const scores = {};
for (const variant of VARIANTS) {
  scores[variant.label] = {};
  for (const dump of dumps) {
    scores[variant.label][dump.code] = {};
    for (const tgt of TEST_REGIMES) {
      const regime = findRegime(tgt);
      if (!regime) continue;
      const key = `${tgt.regime}@${tgt.startYear}`;
      scores[variant.label][dump.code][key] = score(dump.rs, regime, variant);
    }
  }
}

// Acceptance criteria
function getScore(variantLabel, archCode, regimeName, startYear) {
  const key = `${regimeName}@${startYear}`;
  return scores[variantLabel][archCode][key];
}

function evaluateAcceptance(variantLabel) {
  const ac = {};
  ac.AC1_C_orban_pos = getScore(variantLabel, "C", "Orban's Hungary", 2010) > 0.5;
  ac.AC2_C_nazi_pos = getScore(variantLabel, "C", "Nazi Germany", 1933) > 0;
  ac.AC3_C_fasc_italy_pos = getScore(variantLabel, "C", "Fascist Italy", 1922) > 0.5;
  ac.AC4_A_orban_neg = getScore(variantLabel, "A", "Orban's Hungary", 2010) < -0.5;
  ac.AC5_B_orban_neg = getScore(variantLabel, "B", "Orban's Hungary", 2010) < -0.5;

  const a_libdem_pass = (
    getScore(variantLabel, "A", "Folkhem Peak", 1946) > 0.5 &&
    getScore(variantLabel, "A", "Attlee/Consensus", 1946) > 0.5 &&
    getScore(variantLabel, "A", "New Deal/WWII", 1933) > 0.5
  );
  ac.AC6_A_libdem_pos = a_libdem_pass;

  const a_fighter_regimes = ["Stalin", "Mao Radical", "Nazi Germany", "Orban's Hungary", "Putin Era", "Erdogan Era", "PiS Poland", "Modi Era", "Polarization Era", "Maduro"];
  const a_fighter_scores = TEST_REGIMES.filter(r => a_fighter_regimes.includes(r.regime)).map(r => getScore(variantLabel, "A", r.regime, r.startYear));
  const a_fighter_avg = a_fighter_scores.reduce((s, x) => s + x, 0) / a_fighter_scores.length;
  ac.AC7_A_fighter_avg_neg = a_fighter_avg < 0;
  ac.A_fighter_avg_value = a_fighter_avg;

  ac.passes = ac.AC1_C_orban_pos && ac.AC2_C_nazi_pos && ac.AC3_C_fasc_italy_pos && ac.AC4_A_orban_neg && ac.AC5_B_orban_neg && ac.AC6_A_libdem_pos && ac.AC7_A_fighter_avg_neg;
  return ac;
}

// Build markdown output
let out = "# PR 5.F sweep — variant matrix + acceptance criteria\n\n";
out += "Date: 2026-04-29\n\n";
out += "Read-only diagnostic. No changes to live scorer. Variant 1 (`current`) reproduces what's live today.\n\n";

out += "## Variant definitions\n\n";
out += "| label | nodes | σ | AES | AES scale |\n|---|---|---|---|---|\n";
for (const v of VARIANTS) {
  out += `| ${v.label} | ${v.nodes.join("/")} | ${v.sigma} | ${v.includeAES ? "yes" : "no"} | ${v.includeAES ? v.aesScale : "—"} |\n`;
}
out += "\n";

// Per-archetype variant matrices
for (const dump of dumps) {
  out += `\n---\n\n## ${dump.label}\n\n`;
  out += `| regime | bucket | ${VARIANTS.map(v => v.label).join(" | ")} |\n`;
  out += `|---|---|${VARIANTS.map(() => "---").join("|")}|\n`;
  for (const tgt of TEST_REGIMES) {
    const regime = findRegime(tgt);
    if (!regime) continue;
    const cells = VARIANTS.map(v => {
      const s = getScore(v.label, dump.code, tgt.regime, tgt.startYear);
      return s != null ? s.toFixed(2) : "—";
    });
    out += `| ${tgt.regime} (${tgt.startYear}) | ${tgt.bucket} | ${cells.join(" | ")} |\n`;
  }
  out += "\n";
}

// Acceptance summary
out += "\n---\n\n## Acceptance criteria summary\n\n";
out += "Definitions:\n";
out += "- **AC1**: C × Orban's Hungary > +0.5 (fascist play stays clearly positive)\n";
out += "- **AC2**: C × Nazi Germany > 0 (positive after dys cap)\n";
out += "- **AC3**: C × Fascist Italy > +0.5\n";
out += "- **AC4**: A × Orban's Hungary < -0.5 (Inst Leftist clearly opposes)\n";
out += "- **AC5**: B × Orban's Hungary < -0.5 (tankie play clearly opposes)\n";
out += "- **AC6**: A × {Folkhem Peak, Attlee, New Deal/WWII} all > +0.5\n";
out += "- **AC7**: A × fighter regimes average < 0\n\n";

out += "| variant | AC1 | AC2 | AC3 | AC4 | AC5 | AC6 | AC7 (avg) | passes? |\n";
out += "|---|---|---|---|---|---|---|---|---|\n";
const passResults = [];
for (const v of VARIANTS) {
  const ac = evaluateAcceptance(v.label);
  passResults.push({ label: v.label, ac });
  const fmt = b => b ? "✓" : "✗";
  out += `| ${v.label} | ${fmt(ac.AC1_C_orban_pos)} | ${fmt(ac.AC2_C_nazi_pos)} | ${fmt(ac.AC3_C_fasc_italy_pos)} | ${fmt(ac.AC4_A_orban_neg)} | ${fmt(ac.AC5_B_orban_neg)} | ${fmt(ac.AC6_A_libdem_pos)} | ${fmt(ac.AC7_A_fighter_avg_neg)} (${ac.A_fighter_avg_value.toFixed(2)}) | ${ac.passes ? "**PASS**" : "fail"} |\n`;
}

// Recommendation
out += "\n---\n\n## Recommendation\n\n";
const passing = passResults.filter(r => r.ac.passes);
if (passing.length === 0) {
  out += "**No variant passes all 7 acceptance criteria.** Need to reconsider node set or thresholds.\n";
} else {
  out += `${passing.length} variant(s) pass all 7 acceptance criteria: ${passing.map(p => "`"+p.label+"`").join(", ")}.\n\n`;
  out += "Simplest passing variant (least change from current): preference order σ=2.0 → σ=1.75 → σ=1.5 → σ=1.3, then AES_SCALE 2 → 3.\n";
  const order = ["new σ2.0 s2","new σ2.0 s3","new σ1.75 s2","new σ1.75 s3","new σ1.5 s2","new σ1.5 s3","new σ1.3 s2","new σ1.3 s3"];
  const simplest = order.find(label => passing.some(p => p.label === label));
  if (simplest) {
    out += `\n**Recommended variant: \`${simplest}\`**\n`;
  }
}

writeFileSync("results/calibration-exceptions/pr5f-sweep.md", out);
console.log("Wrote results/calibration-exceptions/pr5f-sweep.md");

// Console: compact pass/fail table
console.log("\n=== Acceptance criteria pass/fail ===");
console.log("variant".padEnd(15), "AC1 AC2 AC3 AC4 AC5 AC6 AC7  fight_avg  passes");
for (const r of passResults) {
  const ac = r.ac;
  const f = b => b ? "✓" : "✗";
  console.log(
    r.label.padEnd(15),
    ` ${f(ac.AC1_C_orban_pos)}   ${f(ac.AC2_C_nazi_pos)}   ${f(ac.AC3_C_fasc_italy_pos)}   ${f(ac.AC4_A_orban_neg)}   ${f(ac.AC5_B_orban_neg)}   ${f(ac.AC6_A_libdem_pos)}   ${f(ac.AC7_A_fighter_avg_neg)}    ${ac.A_fighter_avg_value.toFixed(2).padStart(5)}     ${ac.passes ? "PASS" : "fail"}`
  );
}
