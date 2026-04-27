// Merge dysfunction codes into regimes.json. Idempotent — running twice
// produces the same result. The dysfunction field is added to each era
// entry that has a matching {country, regime_name, start} in the codes.

const fs = require("node:fs");
const path = require("node:path");

const codesPath = path.resolve(__dirname, "../results/dysfunction-coding/dysfunction-codes.json");
const regimesPath = path.resolve(__dirname, "../output/live-data/regimes.json");

const codes = JSON.parse(fs.readFileSync(codesPath, "utf8"));
const regimes = JSON.parse(fs.readFileSync(regimesPath, "utf8"));

// Build a lookup: country -> regime_name -> start -> dysfunction.
const lookup = new Map();
for (const c of codes) {
  if (!lookup.has(c.country)) lookup.set(c.country, new Map());
  const inner = lookup.get(c.country);
  const key = `${c.regime_name}@${c.start}`;
  inner.set(key, c.dysfunction);
}

let matched = 0;
let unmatched = 0;
const unmatchedEntries = [];

for (const [country, countryData] of Object.entries(regimes)) {
  if (!countryData?.eras) continue;
  for (const era of countryData.eras) {
    const inner = lookup.get(country);
    const key = `${era.regime_name}@${era.start}`;
    if (inner && inner.has(key)) {
      era.dysfunction = inner.get(key);
      matched++;
    } else {
      unmatched++;
      unmatchedEntries.push(`${country} | ${era.regime_name} (${era.start})`);
    }
  }
}

fs.writeFileSync(regimesPath, JSON.stringify(regimes), "utf8");

console.log(`Matched ${matched} era entries.`);
console.log(`Unmatched ${unmatched} entries.`);
if (unmatched > 0 && unmatched <= 30) {
  console.log("\nUnmatched entries:");
  unmatchedEntries.forEach(e => console.log("  " + e));
} else if (unmatched > 30) {
  console.log("\nFirst 30 unmatched:");
  unmatchedEntries.slice(0, 30).forEach(e => console.log("  " + e));
}

const distribution = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0};
for (const c of codes) distribution[c.dysfunction]++;
console.log("\nDysfunction distribution applied:");
for (const [score, count] of Object.entries(distribution)) {
  const pct = (count / codes.length * 100).toFixed(1);
  console.log(`  ${score}: ${count} (${pct}%)`);
}
