// Phase 5C spot-check: compute weighted Euclidean distance from each anchor
// archetype to each of the 19 Phase-4-corrected candidates.
// No era multipliers (this is the BASE distance test — distance independent of era).
// No anti-position penalty (mirrors regime-alignment.ts but stripped).

const path = require("node:path");
const { ARCHETYPES } = require(path.resolve(__dirname, "../dist/config/archetypes.js"));
const { ELECTIONS } = require(path.resolve(__dirname, "../dist/historical/candidates.js"));

const NODES = ["MAT", "CD", "CU", "MOR", "PRO", "COM", "ZS", "ONT_H", "ONT_S", "PF", "TRB"];

function distance(arch, cand) {
  let sumSq = 0, totalW = 0;
  for (const node of NODES) {
    const t = arch.nodes[node];
    if (!t || t.kind !== "continuous") continue;
    const archPos = t.pos;
    const sal = t.sal ?? 0;
    const candPos = cand[node];
    if (candPos == null) continue;
    const diff = Math.abs(archPos - candPos);
    sumSq += sal * diff * diff;
    totalW += sal;
  }
  return totalW > 0 ? Math.sqrt(sumSq / totalW) : 4;
}

const ANCHORS = [
  { id: "001", label: "Rawlsian Reformer" },
  { id: "012", label: "Class-War Leftist" },
  { id: "032", label: "Hamiltonian Technocrat" },
  { id: "046", label: "Pastoral Leftist" },
  { id: "056", label: "Institutional Leftist" },
  { id: "069", label: "Bleeding-Heart Libertarian" },
  { id: "070", label: "Burkean Steward" },
  { id: "071", label: "Constitutional Conservative" },
  { id: "083", label: "Closed Traditionalist" },
  { id: "098", label: "Anti-Elite Populist" },
];

const CORRECTED = [
  ["1808", "Madison"], ["1812", "Madison"], ["1816", "Monroe"], ["1820", "Monroe"],
  ["1864", "Lincoln"], ["1880", "Hancock"],
  ["1892", "Weaver"], ["1896", "Bryan"], ["1900", "Bryan"], ["1908", "Bryan"], ["1912", "Roosevelt"],
  ["1920", "Cox"], ["1924", "Davis"],
  ["1948", "H. Wallace"], ["1968", "Wallace"],
  ["1984", "Mondale"], ["1988", "Dukakis"], ["2012", "Obama"], ["2016", "H. Clinton"],
];

// Build header
const HEADER = ["candidate".padEnd(18)].concat(ANCHORS.map(a => `${a.id} ${a.label.slice(0, 11).padEnd(11)}`));
console.log(HEADER.join("  "));
console.log("-".repeat(HEADER.join("  ").length));

const archMap = new Map(ARCHETYPES.map(a => [a.id, a]));

for (const [year, name] of CORRECTED) {
  const e = ELECTIONS.find(el => el.year === parseInt(year));
  const c = e ? e.candidates.find(x => x.name === name) : null;
  if (!c) { console.log(`MISSING: ${year} ${name}`); continue; }
  const row = [`${name.slice(0, 12)} ${year}`.padEnd(18)];
  for (const a of ANCHORS) {
    const arch = archMap.get(a.id);
    if (!arch) { row.push("???".padStart(13)); continue; }
    const d = distance(arch, c);
    row.push(d.toFixed(3).padStart(13));
  }
  console.log(row.join("  "));
}

console.log("\n--- Closest archetype per corrected candidate ---");
for (const [year, name] of CORRECTED) {
  const e = ELECTIONS.find(el => el.year === parseInt(year));
  const c = e ? e.candidates.find(x => x.name === name) : null;
  if (!c) continue;
  let best = { d: Infinity, label: "" };
  for (const a of ANCHORS) {
    const arch = archMap.get(a.id);
    if (!arch) continue;
    const d = distance(arch, c);
    if (d < best.d) best = { d, label: a.label };
  }
  console.log(`${name.padEnd(12)} ${year} -> closest of these 10 anchors: ${best.label} (${best.d.toFixed(3)})`);
}
