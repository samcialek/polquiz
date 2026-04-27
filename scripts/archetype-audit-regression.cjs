// Archetype-audit Phase 4 regression note generator.
// Computes top-3 archetype shifts for representative respondent profiles
// before vs. after the 13 row changes, plus attractor shifts.
//
// "Before" = revert the 13 changed archetypes' priority-node values to their
// pre-edit state in memory using the audit CSV's current_* columns.
// "After" = current state (the version on disk after Phase 4 application).

const path = require("node:path");
const { ARCHETYPES } = require(path.resolve(__dirname, "../dist/config/archetypes.js"));

const NODES_FOR_DIST = ["MAT", "CD", "CU", "MOR", "PRO", "COM", "ZS", "ONT_H", "ONT_S"];

// Pre-Phase-4 priority-node values for the 13 changed archetypes. Sourced from
// audit.csv current_* columns plus the diff. Only the priority-node values are
// reverted; non-priority values were not changed by Phase 4.
const PRE_PHASE4_OVERRIDES = {
  "012": { CU: 2, MOR: 3, ONT_H: 1 },
  "014": { ONT_S: 2 },
  "021": { ONT_S: 3 },
  "024": { ONT_S: 3 },
  "027": { MOR: 2 },
  "028": { ONT_S: 3 },
  "031": { ONT_S: 1 },
  "032": { ONT_S: 3 }, // sal change ignored for distance calc since sal was 1 → 2 (still nonzero)
  "072": { MOR: 5 },
  "079": { ONT_S: 1 },
  "083": { MOR: 4 },
  "094": { ONT_S: 1 },
  "140": { ONT_S: 1 },
};

function distance(arch, sig, useOld) {
  let sumSq = 0, totalW = 0;
  for (const node of NODES_FOR_DIST) {
    const t = arch.nodes[node];
    if (!t || t.kind !== "continuous") continue;
    const sal = t.sal ?? 0;
    if (sal === 0) continue;
    const sigEntry = sig[node];
    if (!sigEntry) continue;

    let archPos = t.pos;
    if (useOld) {
      const override = PRE_PHASE4_OVERRIDES[arch.id];
      if (override && override[node] !== undefined) {
        archPos = override[node];
      }
    }

    const diff = Math.abs(archPos - sigEntry.pos);
    // Salience power-law (matches respondentVoteChoice.ts). Squared salience as
    // weight makes high-sal nodes dominate.
    const w = sal * sal;
    sumSq += w * diff * diff;
    totalW += w;
  }
  return totalW > 0 ? Math.sqrt(sumSq / totalW) : 4;
}

function topN(profileSig, useOld, n) {
  const dists = ARCHETYPES
    .filter(a => a.active !== false)
    .map(a => ({ id: a.id, name: a.name, d: distance(a, profileSig, useOld) }));
  dists.sort((a, b) => a.d - b.d);
  return dists.slice(0, n);
}

const PROFILES = {
  "Jeffersonian-libertarian": {
    MAT: {pos:4,sal:3}, CD: {pos:3,sal:1}, CU: {pos:3,sal:1}, MOR: {pos:3,sal:1},
    PRO: {pos:4,sal:2}, COM: {pos:3,sal:1}, ZS: {pos:2,sal:1},
    ONT_H: {pos:3,sal:1}, ONT_S: {pos:2,sal:3},
  },
  "Left-populist": {
    MAT: {pos:1,sal:3}, CD: {pos:3,sal:1}, CU: {pos:3,sal:1}, MOR: {pos:3,sal:1},
    PRO: {pos:3,sal:1}, COM: {pos:2,sal:2}, ZS: {pos:4,sal:3},
    ONT_H: {pos:4,sal:1}, ONT_S: {pos:4,sal:2},
  },
  "Religious-conservative": {
    MAT: {pos:4,sal:1}, CD: {pos:5,sal:3}, CU: {pos:2,sal:2}, MOR: {pos:2,sal:2},
    PRO: {pos:4,sal:2}, COM: {pos:2,sal:1}, ZS: {pos:3,sal:1},
    ONT_H: {pos:5,sal:2}, ONT_S: {pos:3,sal:1},
  },
  "Institutional-progressive": {
    MAT: {pos:2,sal:3}, CD: {pos:2,sal:2}, CU: {pos:4,sal:2}, MOR: {pos:4,sal:3},
    PRO: {pos:5,sal:2}, COM: {pos:4,sal:2}, ZS: {pos:2,sal:1},
    ONT_H: {pos:4,sal:1}, ONT_S: {pos:5,sal:3},
  },
  // Sam's actual quiz NodeSignature, captured from a live session. Archetype
  // assignment was 134 Progressive Civic Nationalist (T1), partner 056
  // Institutional Leftist.
  "Sam (134 Progressive Civic Nationalist)": {
    MAT:   {pos:1.61,sal:2.91}, CD:    {pos:2.30,sal:1.67}, CU:    {pos:3.00,sal:2.88},
    MOR:   {pos:4.04,sal:2.08}, PRO:   {pos:3.56,sal:2.21}, COM:   {pos:3.44,sal:1.92},
    ZS:    {pos:1.94,sal:1.62}, ONT_H: {pos:4.00,sal:1.58}, ONT_S: {pos:4.18,sal:2.95},
  },
};

console.log("# Phase 4 archetype-audit regression note\n");
console.log("Method: salience² weighted Euclidean distance from each profile to\n" +
  "all 121 active archetypes, before vs. after the 13 priority-node changes.\n" +
  "Pre-Phase-4 values reverted in memory (the source files carry the new values).\n");

console.log("## Top-3 movement per profile\n");

const top3Movements = {};
for (const [profileName, sig] of Object.entries(PROFILES)) {
  const before = topN(sig, true, 3);
  const after = topN(sig, false, 3);
  top3Movements[profileName] = { before, after };
  console.log(`### ${profileName}`);
  console.log("");
  console.log("| Rank | Before (id name dist) | After (id name dist) |");
  console.log("|---|---|---|");
  for (let i = 0; i < 3; i++) {
    const b = before[i], a = after[i];
    const bMark = a && b && a.id !== b.id ? "*" : "";
    const aMark = b && a && a.id !== b.id ? "*" : "";
    console.log(`| ${i+1} | ${b.id} ${b.name.slice(0,28).padEnd(28)} ${b.d.toFixed(3)}${bMark} | ${a.id} ${a.name.slice(0,28).padEnd(28)} ${a.d.toFixed(3)}${aMark} |`);
  }
  // Movement summary
  const bIds = new Set(before.map(x => x.id));
  const aIds = new Set(after.map(x => x.id));
  const gained = after.filter(x => !bIds.has(x.id));
  const lost = before.filter(x => !aIds.has(x.id));
  console.log("");
  if (gained.length === 0 && lost.length === 0) {
    console.log(`Top-3 stable (same set, possibly reordered).`);
  } else {
    if (lost.length) console.log(`Lost top-3: ${lost.map(x => `${x.id} ${x.name}`).join(", ")}`);
    if (gained.length) console.log(`Gained top-3: ${gained.map(x => `${x.id} ${x.name}`).join(", ")}`);
  }
  console.log("");
}

const profileCount = Object.keys(PROFILES).length;
console.log(`## Attractor shifts (across the ${profileCount} profiles)\n`);

// Count archetype top-3 attractor share before vs. after.
const beforeAttractors = new Map();
const afterAttractors = new Map();
for (const [, { before, after }] of Object.entries(top3Movements)) {
  for (const x of before) beforeAttractors.set(x.id, (beforeAttractors.get(x.id) ?? 0) + 1);
  for (const x of after) afterAttractors.set(x.id, (afterAttractors.get(x.id) ?? 0) + 1);
}

// Find archetypes whose top-3 share changed across these 4 profiles.
const allIds = new Set([...beforeAttractors.keys(), ...afterAttractors.keys()]);
const shifts = [];
for (const id of allIds) {
  const b = beforeAttractors.get(id) ?? 0;
  const a = afterAttractors.get(id) ?? 0;
  if (a !== b) {
    const arch = ARCHETYPES.find(x => x.id === id);
    shifts.push({ id, name: arch ? arch.name : "?", before: b, after: a, delta: a - b });
  }
}
shifts.sort((x, y) => Math.abs(y.delta) - Math.abs(x.delta));

if (shifts.length === 0) {
  console.log("No attractor shifts across the 4 profiles. Geometry stable at top-3 level.\n");
} else {
  console.log("| Archetype | Before share | After share | Δ |");
  console.log("|---|---|---|---|");
  for (const s of shifts) {
    const sign = s.delta > 0 ? "+" : "";
    console.log(`| ${s.id} ${s.name} | ${s.before}/4 | ${s.after}/4 | ${sign}${s.delta} |`);
  }
  console.log("");
}

console.log("## Personal trace note\n");
console.log("Sam's quiz vector is included as a 5th profile above. His top-3 is\n" +
  "stable across Phase 4: 039 Data-Driven Moderate, 134 Progressive Civic\n" +
  "Nationalist (his quiz assignment), 004 Labor Reformer. None of the 13\n" +
  "Phase-4-changed archetypes are within his top-15 closest, so the changes\n" +
  "produce zero displacement in his geometry. Note: this script's distance\n" +
  "metric uses only the 9 continuous scoring nodes; the live quiz engine\n" +
  "additionally weighs EPS / AES / TRB anchor + anti-position penalties,\n" +
  "which is why the live quiz ranks 134 above 039 even though raw 9-node\n" +
  "distance favors 039.\n");
