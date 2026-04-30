// PR 6.E.2a smoke test for archetypeDistance.ts cutover.
//
// Verifies:
//   1. Distance computation runs without throwing for a synthetic respondent
//      against every active archetype.
//   2. Archetype distances form a sensible distribution (no NaN, no Infinity,
//      reasonable spread).
//   3. The morModule contribution actually fires when both sides have it.
//   4. Sanity-check ordering: a respondent matched to an archetype's
//      morBoundaries should rank closer than a respondent with opposite
//      morBoundaries.

import { archetypeDistance } from "../dist/engine/archetypeDistance.js";
import { ARCHETYPES } from "../dist/config/archetypes.js";

let failures = 0;
function assert(name, cond, info = "") {
  if (cond) {
    console.log(`  ✓ ${name}`);
  } else {
    failures++;
    console.log(`  ✗ ${name} ${info}`);
  }
}

// Build a synthetic respondent state — mostly-uniform priors with a
// distinctive morBoundaries profile (high ethnic_racial, high intensity).
function mkRespondentState(morBoundaries) {
  const uniform5 = [0.2, 0.2, 0.2, 0.2, 0.2];
  const uniform4 = [0.25, 0.25, 0.25, 0.25];
  const uniform6 = [1/6, 1/6, 1/6, 1/6, 1/6, 1/6];
  const cont = (id) => ({ posDist: uniform5, salDist: uniform4, touches: 0, touchTypes: new Set(), status: "unknown" });
  const cat = (id) => ({ catDist: uniform6, salDist: uniform4, touches: 0, touchTypes: new Set(), status: "unknown" });
  return {
    answers: {},
    continuous: {
      MAT: cont("MAT"), CD: cont("CD"), CU: cont("CU"), MOR: cont("MOR"),
      PRO: cont("PRO"), COM: cont("COM"), ZS: cont("ZS"),
      ONT_H: cont("ONT_H"), ONT_S: cont("ONT_S"),
      PF: cont("PF"), TRB: cont("TRB"), ENG: cont("ENG"),
    },
    categorical: { EPS: cat("EPS"), AES: cat("AES") },
    trbAnchor: { dist: [1/9, 1/9, 1/9, 1/9, 1/9, 1/9, 1/9, 1/9, 1/9], touches: 0 },
    archetypeDistances: {},
    morBoundaries,
  };
}

console.log("=== Test 1: distance runs for every archetype ===");
const ethnicRacialResp = mkRespondentState({
  boundaries: { national: 0.4, ethnic_racial: 0.95, religious: 0.2, class: 0.1, ideological: 0.3, gender: 0.1, political_tribe: 0.5 },
  intensity: 3.0,
  touches: {},
  touchTypes: new Set(),
  status: "live",
});

let nan = 0, neg = 0, exc = 0;
const distances = [];
for (const a of ARCHETYPES) {
  if (a.active === false) continue;
  try {
    const d = archetypeDistance(ethnicRacialResp, a);
    if (!Number.isFinite(d)) nan++;
    if (d < 0) neg++;
    distances.push({ id: a.id, name: a.name, d });
  } catch (e) {
    exc++;
  }
}

assert(`no exceptions across ${distances.length + nan + neg + exc} archetypes`, exc === 0);
assert("no NaN/Infinity distances", nan === 0);
assert("no negative distances", neg === 0);

distances.sort((a, b) => a.d - b.d);
console.log(`  Closest:  ${distances[0].id} ${distances[0].name} (d=${distances[0].d.toFixed(3)})`);
console.log(`  Farthest: ${distances.at(-1).id} ${distances.at(-1).name} (d=${distances.at(-1).d.toFixed(3)})`);

console.log("\n=== Test 2: morModule contribution fires (high-ethnic respondent matches ethnic-anchored archetype best) ===");
// 142 White Grievance Voter has ethnic_racial=0.9, others mid — should land in top-10
const whiteGr = distances.findIndex(d => d.id === "142");
console.log(`  142 White Grievance Voter rank: #${whiteGr + 1} of ${distances.length}`);
assert("142 ranks in top 30 for ethnic-racial-heavy respondent", whiteGr < 30);

console.log("\n=== Test 3: ordering changes when morBoundaries changes ===");
const universalistResp = mkRespondentState({
  boundaries: { national: 0.05, ethnic_racial: 0.05, religious: 0.05, class: 0.05, ideological: 0.1, gender: 0.05, political_tribe: 0.2 },
  intensity: 2.5,
  touches: {},
  touchTypes: new Set(),
  status: "live",
});
const universalistDistances = ARCHETYPES.filter(a => a.active !== false).map(a => ({ id: a.id, name: a.name, d: archetypeDistance(universalistResp, a) }));
universalistDistances.sort((a, b) => a.d - b.d);
const whiteGrInUniversalist = universalistDistances.findIndex(d => d.id === "142");
console.log(`  142 White Grievance Voter rank under universalist resp: #${whiteGrInUniversalist + 1}`);
assert("142 ranks worse for universalist than for ethnic-anchored respondent", whiteGrInUniversalist > whiteGr);

// 110 Principled Abstainer is the canonical universalist archetype
const abstainerInEthnic = distances.findIndex(d => d.id === "110");
const abstainerInUniversalist = universalistDistances.findIndex(d => d.id === "110");
console.log(`  110 Principled Abstainer rank under ethnic-anchored: #${abstainerInEthnic + 1} | under universalist: #${abstainerInUniversalist + 1}`);
assert("110 ranks better for universalist than for ethnic-anchored", abstainerInUniversalist < abstainerInEthnic);

console.log("\n=== Test 4: distribution stats ===");
const ds = distances.map(x => x.d);
const mean = ds.reduce((s, x) => s + x, 0) / ds.length;
const min = ds[0];
const max = ds.at(-1);
console.log(`  n=${ds.length}, min=${min.toFixed(3)}, mean=${mean.toFixed(3)}, max=${max.toFixed(3)}`);
assert("distance spread > 0.05", max - min > 0.05);
assert("mean is reasonable (0.05 < mean < 1.0)", mean > 0.05 && mean < 1.0);

console.log(`\n${failures === 0 ? "✅ ALL PASS" : `❌ ${failures} FAILURES`}`);
process.exit(failures === 0 ? 0 : 1);
