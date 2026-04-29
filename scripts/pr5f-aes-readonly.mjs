// PR 5.F read-only diagnostic. AES lock-and-key for 3 retake archetypes
// against a broad regime test matrix (liberal democracies + totalitarian +
// modern illiberal + US eras + mid-functional + failed/chaotic). No code
// changes to scorer.
//
// For each archetype × regime, reports:
//   - top 2 AES probabilities for the respondent
//   - regime AES category
//   - lock-and-key penalty: 1 - respondentProb[regimeAES]
//   - estimated contribution at AES_SCALE = 2, 3, 4
// where contribution = salience × (penalty × scale)²

import { EUROPE_PART1 } from "../dist/global/jurisdictions-europe1.js";
import { EUROPE_PART2 } from "../dist/global/jurisdictions-europe2.js";
import { AMERICAS } from "../dist/global/jurisdictions-americas.js";
import { ASIA } from "../dist/global/jurisdictions-asia.js";
import { MENA_AFRICA } from "../dist/global/jurisdictions-mena.js";
import { writeFileSync, readFileSync } from "node:fs";

const AES_NAMES = ["statesman", "technocrat", "pastoral", "authentic", "fighter", "visionary"];

const DUMPS = [
  { label: "A — Inst Leftist (authentic)",       file: "prism-dump-0cb89086-1777477274433.json", arch: "056" },
  { label: "B — Progressive Civic Nat (tankie)", file: "prism-dump-720f5027-1777477277728.json", arch: "134" },
  { label: "C — Customary Localist (fascist)",   file: "prism-dump-4901f789-1777477283013.json", arch: "085" },
];

// Broader test set per Sam: ~19 regimes across all categories.
const TEST_REGIMES = [
  // Liberal democracies
  { jurisdiction: "Germany/Prussia", regime: "West Germany/Bonn Republic", startYear: 1949, bucket: "liberal-democracy" },
  { jurisdiction: "Sweden", regime: "Folkhem Peak", startYear: 1946, bucket: "liberal-democracy" },
  { jurisdiction: "Switzerland", regime: "Modern Switzerland", startYear: 2011, bucket: "liberal-democracy" },
  { jurisdiction: "United Kingdom", regime: "Attlee/Consensus", startYear: 1946, bucket: "liberal-democracy" },
  // Stable totalitarian
  { jurisdiction: "Russia/USSR", regime: "Stalin", startYear: 1929, bucket: "totalitarian" },
  { jurisdiction: "China", regime: "Mao Radical", startYear: 1958, bucket: "totalitarian" },
  { jurisdiction: "Germany/Prussia", regime: "Nazi Germany", startYear: 1933, bucket: "totalitarian" },
  // Modern illiberal
  { jurisdiction: "Hungary", regime: "Orban's Hungary", startYear: 2010, bucket: "modern-illiberal" },
  { jurisdiction: "Russia/USSR", regime: "Putin Era", startYear: 2000, bucket: "modern-illiberal" },
  { jurisdiction: "Ottoman Empire/Turkey", regime: "Erdogan Era", startYear: 2002, bucket: "modern-illiberal" },
  { jurisdiction: "Poland", regime: "PiS Poland", startYear: 1998, bucket: "modern-illiberal" },
  { jurisdiction: "India", regime: "Modi Era", startYear: 2014, bucket: "modern-illiberal" },
  // US eras
  { jurisdiction: "USA", regime: "New Deal/WWII", startYear: 1933, bucket: "us-eras" },
  { jurisdiction: "USA", regime: "Cold War Consensus", startYear: 1953, bucket: "us-eras" },
  { jurisdiction: "USA", regime: "Polarization Era", startYear: 2008, bucket: "us-eras" },
  // Mid-functional
  { jurisdiction: "France", regime: "Fifth Republic Modern", startYear: 1981, bucket: "mid-functional" },
  { jurisdiction: "Israel", regime: "Netanyahu/Right Turn", startYear: 2001, bucket: "mid-functional" },
  // Failed/chaotic
  { jurisdiction: "Russia/USSR", regime: "Yeltsin", startYear: 1992, bucket: "failed-chaotic" },
  { jurisdiction: "Venezuela", regime: "Maduro", startYear: 2013, bucket: "failed-chaotic" },
  // Libya|Post-Qaddafi Fragmentation only exists in dysfunction codes, not in regime data; dropped.
];

const ALL_REGIMES = [...EUROPE_PART1, ...EUROPE_PART2, ...AMERICAS, ...ASIA, ...MENA_AFRICA];

function findRegime(target) {
  return ALL_REGIMES.find(r =>
    r.jurisdiction === target.jurisdiction &&
    r.regime === target.regime &&
    r.startYear === target.startYear
  );
}

function topAesProbabilities(catDist, n = 3) {
  return catDist
    .map((p, i) => ({ name: AES_NAMES[i], p }))
    .sort((a, b) => b.p - a.p)
    .slice(0, n);
}

let out = "# PR 5.F read-only diagnostic — AES lock-and-key\n\n";
out += `Date: 2026-04-29\n\n`;
out += `Lock-and-key formula: \`AES penalty = 1 - respondentProbability[regimeAES]\`\n`;
out += `Estimated contribution at scale s: \`salience × (penalty × s)²\` for s ∈ {2, 3, 4}\n\n`;
out += `For comparison: a max-distance continuous node (diff=4) at salience 2.5 contributes 40.0.\n`;
out += `A typical strong-disagreement continuous node (diff=2.5, sal=2) contributes ~12.5.\n\n`;

const summary = []; // For final compact summary table

for (const dump of DUMPS) {
  const j = JSON.parse(readFileSync(dump.file, "utf8"));
  const aesNode = j.results.respondentState.categorical.AES;
  const aesDist = aesNode.catDist;
  const aesSal = aesNode.salience;
  const top3 = topAesProbabilities(aesDist, 3);

  out += `\n---\n\n## ${dump.label}\n\n`;
  out += `**Respondent AES posterior** — salience ${aesSal.toFixed(2)}, touches ${aesNode.touches}\n\n`;
  out += `Top probabilities: `;
  out += top3.map(t => `${t.name} ${(t.p * 100).toFixed(0)}%`).join(" · ");
  out += `\n\nFull distribution: `;
  out += AES_NAMES.map((n, i) => `${n} ${(aesDist[i] * 100).toFixed(1)}%`).join(" · ");
  out += `\n\n`;

  // Group by bucket for readability
  const buckets = [...new Set(TEST_REGIMES.map(r => r.bucket))];
  for (const bucket of buckets) {
    out += `### ${bucket}\n\n`;
    out += `| regime | regime AES | respondent prob[regime AES] | penalty | contrib s=2 | s=3 | s=4 |\n`;
    out += `|---|---|---|---|---|---|---|\n`;

    for (const tgt of TEST_REGIMES.filter(r => r.bucket === bucket)) {
      const regime = findRegime(tgt);
      if (!regime) {
        out += `| ${tgt.regime} (${tgt.startYear}) | NOT FOUND | — | — | — | — | — |\n`;
        continue;
      }
      const regimeAesIdx = regime.AES;
      const regimeAesName = AES_NAMES[regimeAesIdx] ?? "?";
      const respProb = aesDist[regimeAesIdx] ?? 0;
      const penalty = 1 - respProb;
      const contribs = [2, 3, 4].map(s => aesSal * Math.pow(penalty * s, 2));

      out += `| ${regime.regime} (${regime.startYear}) | ${regimeAesName} (${regimeAesIdx}) | ${(respProb * 100).toFixed(1)}% | ${penalty.toFixed(3)} | ${contribs[0].toFixed(2)} | ${contribs[1].toFixed(2)} | ${contribs[2].toFixed(2)} |\n`;

      summary.push({
        dump: dump.label.split(" — ")[0],
        bucket,
        regime: regime.regime,
        startYear: regime.startYear,
        regimeAesName,
        respProb,
        penalty,
        contrib2: contribs[0],
        contrib3: contribs[1],
        contrib4: contribs[2],
      });
    }
    out += `\n`;
  }
}

// Compact cross-archetype summary at end
out += `\n---\n\n## Compact cross-archetype summary\n\n`;
out += `For each regime, AES penalty for each archetype, contribution at scale=3:\n\n`;
out += `| regime | bucket | regime AES | A penalty | A s=3 | B penalty | B s=3 | C penalty | C s=3 |\n`;
out += `|---|---|---|---|---|---|---|---|---|\n`;

const byRegime = new Map();
for (const row of summary) {
  const key = `${row.regime}@${row.startYear}`;
  if (!byRegime.has(key)) byRegime.set(key, { regime: row.regime, startYear: row.startYear, bucket: row.bucket, regimeAesName: row.regimeAesName });
  byRegime.get(key)[row.dump] = { penalty: row.penalty, c3: row.contrib3 };
}

for (const [, r] of byRegime) {
  const a = r.A || {}, b = r.B || {}, c = r.C || {};
  const fmt = (x) => (x == null ? "—" : (typeof x === "number" ? x.toFixed(2) : x));
  out += `| ${r.regime} (${r.startYear}) | ${r.bucket} | ${r.regimeAesName} | ${fmt(a.penalty)} | ${fmt(a.c3)} | ${fmt(b.penalty)} | ${fmt(b.c3)} | ${fmt(c.penalty)} | ${fmt(c.c3)} |\n`;
}

writeFileSync("results/calibration-exceptions/pr5f-aes-readonly.md", out);
console.log("Wrote results/calibration-exceptions/pr5f-aes-readonly.md");

// Console: short summary for triage
console.log("\n=== Console summary ===");
for (const dump of DUMPS) {
  const j = JSON.parse(readFileSync(dump.file, "utf8"));
  const aesNode = j.results.respondentState.categorical.AES;
  const top = topAesProbabilities(aesNode.catDist, 2);
  console.log(`\n${dump.label}: top AES = ${top.map(t => `${t.name} ${(t.p*100).toFixed(0)}%`).join(", ")} (sal ${aesNode.salience.toFixed(2)})`);
}

console.log("\nPenalties s=3 contribution per archetype × regime:");
for (const [, r] of byRegime) {
  const a = r.A?.c3 ?? 0, b = r.B?.c3 ?? 0, c = r.C?.c3 ?? 0;
  console.log(`  ${r.regime.padEnd(40)} ${r.regimeAesName.padEnd(11)} A=${a.toFixed(1).padStart(5)} B=${b.toFixed(1).padStart(5)} C=${c.toFixed(1).padStart(5)}`);
}
