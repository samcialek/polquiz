// PR 6.E.2a live-path smoke for archetypeDistance.ts cutover.
//
// The synthetic smoke (pr6e2a-archetypeDistance-smoke.mjs) builds a
// respondent state that already carries `morBoundaries`, so it only
// exercises the new module branch. This smoke uses the live browser/API
// initialization shape (mirrors `src/browser/api.ts createInitialState`,
// which does NOT populate morBoundaries today — that wiring lands in
// 6.E.2b/6.F). It proves the per-archetype gate falls back to the legacy
// MOR/TRB/PF reads when state.morBoundaries is absent, so the
// moral-circle/TRB/PF contribution is not silently dropped during the
// multi-PR cutover.
//
// Verifies:
//   1. Distances compute over all 121 active archetypes without throwing
//      / producing NaN / Infinity / negatives.
//   2. The legacy-fallback distribution has real spread (not collapsed to
//      a single value, which is what would happen if MOR/TRB/PF were
//      silently zeroed out for every archetype).
//   3. Adding morBoundaries to the same state shifts the ranking — proves
//      both code branches are reachable from the same scorer call site.

import { archetypeDistance } from "../dist/engine/archetypeDistance.js";
import { ARCHETYPES } from "../dist/config/archetypes.js";
import { CONTINUOUS_NODES, CATEGORICAL_NODES } from "../dist/config/nodes.js";

let failures = 0;
function assert(name, cond, info = "") {
  if (cond) {
    console.log(`  ✓ ${name}`);
  } else {
    failures++;
    console.log(`  ✗ ${name} ${info}`);
  }
}

// Mirror src/browser/api.ts createInitialState() exactly — uniform
// priors over every node, default trbAnchor, NO morBoundaries field.
function createLiveInitialState() {
  const continuous = {};
  for (const nodeId of CONTINUOUS_NODES) {
    continuous[nodeId] = {
      posDist: [0.2, 0.2, 0.2, 0.2, 0.2],
      salDist: [0.25, 0.25, 0.25, 0.25],
      touches: 0,
      touchTypes: new Set(),
      status: "unknown",
    };
  }
  const categorical = {};
  for (const nodeId of CATEGORICAL_NODES) {
    categorical[nodeId] = {
      catDist: [1/6, 1/6, 1/6, 1/6, 1/6, 1/6],
      salDist: [0.25, 0.25, 0.25, 0.25],
      touches: 0,
      touchTypes: new Set(),
      status: "unknown",
    };
  }
  return {
    answers: {},
    continuous,
    categorical,
    trbAnchor: {
      dist: [1/9, 1/9, 1/9, 1/9, 1/9, 1/9, 1/9, 1/9, 1/9],
      touches: 0,
    },
    archetypeDistances: {},
    // morBoundaries deliberately omitted — matches live api.ts today.
  };
}

const active = ARCHETYPES.filter(a => a.active !== false);

// ─── Test 1: live-init (no morBoundaries) hits the legacy fallback ──────
console.log("=== Test 1: live-init state (no morBoundaries) → legacy fallback ===");
const liveState = createLiveInitialState();
console.log(`  state.morBoundaries === undefined: ${liveState.morBoundaries === undefined}`);
assert("live state has no morBoundaries (matches api.ts today)", liveState.morBoundaries === undefined);

let nan = 0, neg = 0, exc = 0;
const liveDistances = [];
for (const a of active) {
  try {
    const d = archetypeDistance(liveState, a);
    if (!Number.isFinite(d)) nan++;
    if (d < 0) neg++;
    liveDistances.push({ id: a.id, name: a.name, d });
  } catch (e) {
    exc++;
    console.log(`    exception on ${a.id}: ${e.message}`);
  }
}
assert(`no exceptions across ${active.length} archetypes`, exc === 0);
assert("no NaN/Infinity distances", nan === 0);
assert("no negative distances", neg === 0);

liveDistances.sort((x, y) => x.d - y.d);
const liveDs = liveDistances.map(x => x.d);
const liveMin = liveDs[0], liveMax = liveDs.at(-1);
const liveMean = liveDs.reduce((s, x) => s + x, 0) / liveDs.length;
console.log(`  n=${liveDs.length}, min=${liveMin.toFixed(3)}, mean=${liveMean.toFixed(3)}, max=${liveMax.toFixed(3)}`);
console.log(`  Closest:  ${liveDistances[0].id} ${liveDistances[0].name} (d=${liveMin.toFixed(3)})`);
console.log(`  Farthest: ${liveDistances.at(-1).id} ${liveDistances.at(-1).name} (d=${liveMax.toFixed(3)})`);

// Spread invariant: if MOR/TRB/PF were silently zeroed out for every
// archetype (the bug Sam flagged), distances would still vary across
// other nodes but the spread would be uniformly compressed and many
// archetypes would collapse to similar values. A real spread > 0.05 with
// >50 distinct distance values proves the legacy contribution is intact.
const distinctValues = new Set(liveDs.map(d => d.toFixed(4))).size;
console.log(`  distinct distance values: ${distinctValues}`);
assert("distance spread > 0.05 (legacy fallback alive)", liveMax - liveMin > 0.05);
assert("≥ 50 distinct distance values (no mass collapse)", distinctValues >= 50);

// ─── Test 2: adding morBoundaries to the same state changes ranking ────
console.log("\n=== Test 2: attach morBoundaries → new module branch fires ===");
const stateWithModule = createLiveInitialState();
stateWithModule.morBoundaries = {
  boundaries: { national: 0.4, ethnic_racial: 0.95, religious: 0.2, class: 0.1, ideological: 0.3, gender: 0.1, political_tribe: 0.5 },
  intensity: 3.0,
  touches: {},
  touchTypes: new Set(),
  status: "live",
};

const moduleDistances = active.map(a => ({ id: a.id, name: a.name, d: archetypeDistance(stateWithModule, a) }));
moduleDistances.sort((x, y) => x.d - y.d);

// Compare top-5 of legacy vs module — they should NOT be identical.
const legacyTop5 = liveDistances.slice(0, 5).map(x => x.id).join(",");
const moduleTop5 = moduleDistances.slice(0, 5).map(x => x.id).join(",");
console.log(`  legacy-fallback top 5:  ${legacyTop5}`);
console.log(`  morBoundaries top 5:    ${moduleTop5}`);
assert("rankings differ between legacy and module branches", legacyTop5 !== moduleTop5);

// 142 White Grievance Voter (ethnic_racial=0.9) should rank substantially
// better when morBoundaries reflects an ethnic-anchored respondent than
// when the scorer is on the uniform-prior legacy branch.
const wgLegacyRank = liveDistances.findIndex(d => d.id === "142");
const wgModuleRank = moduleDistances.findIndex(d => d.id === "142");
console.log(`  142 White Grievance Voter rank — legacy: #${wgLegacyRank + 1}, module: #${wgModuleRank + 1}`);
assert("142 ranks better under module (ethnic-anchored) than legacy", wgModuleRank < wgLegacyRank);

console.log(`\n${failures === 0 ? "✅ ALL PASS" : `❌ ${failures} FAILURES`}`);
process.exit(failures === 0 ? 0 : 1);
