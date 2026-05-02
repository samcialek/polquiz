// PR 6.E.4a smoke for the morBoundaries hard validator.
//
// Two responsibilities:
//   1. Verify the silent 0.5 fallback is GONE — calling morModuleDistance /
//      morTargetVectorDistance with a missing side now throws (not silently
//      returns 0.5).
//   2. Verify the data corpus (ARCHETYPES + ELECTIONS candidates + all
//      regime arrays) is fully populated with well-formed morBoundaries.
//      This is the bridge invariant that 6.E.4 chunks 2-3 will rely on
//      before deleting legacy field reads.

import { morModuleDistance, morTargetVectorDistance, validateMorBoundariesPopulated, mkInitialMorBoundaries } from "../dist/engine/math.js";
import { ARCHETYPES } from "../dist/config/archetypes.js";
import { ELECTIONS } from "../dist/historical/candidates.js";
import { EUROPE_PART1 } from "../dist/global/jurisdictions-europe1.js";
import { EUROPE_PART2 } from "../dist/global/jurisdictions-europe2.js";
import { AMERICAS } from "../dist/global/jurisdictions-americas.js";
import { ASIA } from "../dist/global/jurisdictions-asia.js";
import { MENA_AFRICA } from "../dist/global/jurisdictions-mena.js";

let failures = 0;
function assert(name, cond, info = "") {
  if (cond) {
    console.log(`  ✓ ${name}`);
  } else {
    failures++;
    console.log(`  ✗ ${name} ${info}`);
  }
}

function assertThrows(name, fn, expectedSubstring) {
  try {
    fn();
    failures++;
    console.log(`  ✗ ${name} — expected throw, got success`);
  } catch (e) {
    if (expectedSubstring && !e.message.includes(expectedSubstring)) {
      failures++;
      console.log(`  ✗ ${name} — threw but wrong message: ${e.message}`);
    } else {
      console.log(`  ✓ ${name}`);
    }
  }
}

// ─── Test 1: missing-side throws (silent 0.5 fallback removed) ────────
console.log("=== Test 1: helpers throw on missing morBoundaries (no silent 0.5) ===");
const realModule = mkInitialMorBoundaries();
const realBoundaries = realModule.boundaries;

assertThrows(
  "morModuleDistance(undefined, target) throws",
  () => morModuleDistance(undefined, { boundaries: realBoundaries, intensity: 1.0 }),
  "respondent.morBoundaries is missing",
);
assertThrows(
  "morModuleDistance(respondent, undefined) throws",
  () => morModuleDistance(realModule, undefined),
  "target.morBoundaries is missing",
);
assertThrows(
  "morModuleDistance(undefined, undefined) throws",
  () => morModuleDistance(undefined, undefined),
  "respondent.morBoundaries is missing",
);
assertThrows(
  "morTargetVectorDistance(undefined, target) throws",
  () => morTargetVectorDistance(undefined, realBoundaries),
  "respondentBoundaries is missing",
);
assertThrows(
  "morTargetVectorDistance(respondent, undefined) throws",
  () => morTargetVectorDistance(realBoundaries, undefined),
  "targetBoundaries is missing",
);

// Sanity: with both sides present, no throw + finite result.
const dist = morModuleDistance(
  realModule,
  { boundaries: realBoundaries, intensity: 0 },
);
assert("with both sides present: finite distance returned", Number.isFinite(dist) && dist === 0);

// ─── Test 1b: per-boundary key validation (no ?? 0.5 fallback) ────────
console.log("\n=== Test 1b: helpers throw on missing/invalid individual boundary keys ===");
const respMissingNational = {
  ...realModule,
  // omit `national` from boundaries
  boundaries: { ethnic_racial: 0, religious: 0, class: 0, ideological: 0, gender: 0, political_tribe: 0 },
};
const targetMissingPoliticalTribe = {
  // omit `political_tribe`
  boundaries: { national: 0, ethnic_racial: 0, religious: 0, class: 0, ideological: 0, gender: 0 },
  intensity: 0,
};

assertThrows(
  "morModuleDistance: missing 'national' on respondent throws naming the key",
  () => morModuleDistance(respMissingNational, { boundaries: realBoundaries, intensity: 0 }),
  "morBoundaries.national",
);
assertThrows(
  "morModuleDistance: missing 'political_tribe' on target throws naming the key",
  () => morModuleDistance(realModule, targetMissingPoliticalTribe),
  "morBoundaries.political_tribe",
);
assertThrows(
  "morTargetVectorDistance: missing 'national' on respondent throws naming the key",
  () => morTargetVectorDistance(respMissingNational.boundaries, realBoundaries),
  "morBoundaries.national",
);
assertThrows(
  "morTargetVectorDistance: missing 'political_tribe' on target throws naming the key",
  () => morTargetVectorDistance(realBoundaries, targetMissingPoliticalTribe.boundaries),
  "morBoundaries.political_tribe",
);

// Out-of-range boundary value (NaN, > 1, < 0) — same code path as missing.
const respBadBoundary = { ...realModule, boundaries: { ...realBoundaries, national: 1.5 } };
assertThrows(
  "morModuleDistance: out-of-range boundary throws (national=1.5)",
  () => morModuleDistance(respBadBoundary, { boundaries: realBoundaries, intensity: 0 }),
  "morBoundaries.national",
);
const respNaNBoundary = { ...realModule, boundaries: { ...realBoundaries, ethnic_racial: NaN } };
assertThrows(
  "morModuleDistance: NaN boundary throws",
  () => morModuleDistance(respNaNBoundary, { boundaries: realBoundaries, intensity: 0 }),
  "morBoundaries.ethnic_racial",
);

// ─── Test 1c: intensity validation ────────────────────────────────────
console.log("\n=== Test 1c: helpers throw on invalid intensity ===");

const respIntensityNegative = { ...realModule, intensity: -0.1 };
const respIntensityTooHigh  = { ...realModule, intensity: 3.5 };
const respIntensityNaN      = { ...realModule, intensity: NaN };
const targetIntensityNegative = { boundaries: realBoundaries, intensity: -0.1 };
const targetIntensityTooHigh  = { boundaries: realBoundaries, intensity: 3.5 };

assertThrows(
  "morModuleDistance: negative respondent intensity throws",
  () => morModuleDistance(respIntensityNegative, { boundaries: realBoundaries, intensity: 0 }),
  "intensity invalid",
);
assertThrows(
  "morModuleDistance: respondent intensity > 3 throws",
  () => morModuleDistance(respIntensityTooHigh, { boundaries: realBoundaries, intensity: 0 }),
  "intensity invalid",
);
assertThrows(
  "morModuleDistance: NaN respondent intensity throws",
  () => morModuleDistance(respIntensityNaN, { boundaries: realBoundaries, intensity: 0 }),
  "intensity invalid",
);
assertThrows(
  "morModuleDistance: negative target intensity throws",
  () => morModuleDistance(realModule, targetIntensityNegative),
  "intensity invalid",
);
assertThrows(
  "morModuleDistance: target intensity > 3 throws",
  () => morModuleDistance(realModule, targetIntensityTooHigh),
  "intensity invalid",
);
// morTargetVectorDistance does not consume intensity — it should NOT throw on
// intensity issues (only on boundary issues). Sanity-check no false positive.
const okBoundariesA = { ...realBoundaries };
const okBoundariesB = { ...realBoundaries };
const distOk = morTargetVectorDistance(okBoundariesA, okBoundariesB);
assert("morTargetVectorDistance ignores intensity (caller passes only boundaries)",
  Number.isFinite(distOk) && distOk === 0);

// ─── Test 2: validator catches missing morBoundaries on synthetic inputs ──
console.log("\n=== Test 2: validateMorBoundariesPopulated catches missing/invalid data ===");
const synthValid = [
  { id: "TEST_OK", morBoundaries: { boundaries: realBoundaries, intensity: 1.0 } },
];
const synthMissing = [
  { id: "TEST_MISSING", morBoundaries: undefined },
];
const synthBadIntensity = [
  { id: "TEST_BAD_I", morBoundaries: { boundaries: realBoundaries, intensity: 5 } },
];
const synthBadBoundary = [
  { id: "TEST_BAD_B", morBoundaries: { boundaries: { ...realBoundaries, national: 1.5 }, intensity: 1.0 } },
];
assert("validator passes well-formed entry", validateMorBoundariesPopulated(synthValid, "test").length === 0);
assert("validator catches missing morBoundaries",
  validateMorBoundariesPopulated(synthMissing, "test").some(s => s.includes("missing morBoundaries")));
assert("validator catches out-of-range intensity",
  validateMorBoundariesPopulated(synthBadIntensity, "test").some(s => s.includes("intensity invalid")));
assert("validator catches out-of-range boundary",
  validateMorBoundariesPopulated(synthBadBoundary, "test").some(s => s.includes("national: out of range")));

// ─── Test 3: real data corpus is fully populated ──────────────────────
console.log("\n=== Test 3: data corpus passes the validator ===");

// Cardinality assertions (PR 6.E.4c, Sam 2026-05-02): canonical counts
// are 124 archetypes total / 121 active, 141 candidates, 401 regimes.
// Drift here means an unintended add/remove and should fail the smoke.
const activeArchetypes = ARCHETYPES.filter(a => a.active !== false);
console.log(`  archetypes: ${ARCHETYPES.length} total / ${activeArchetypes.length} active (cardinality check)`);
assert("ARCHETYPES.length === 124 (no entries added/removed)",
  ARCHETYPES.length === 124);
assert("active archetype count === 121 (3 deactivated kept for ID stability)",
  activeArchetypes.length === 121);

const archResults = validateMorBoundariesPopulated(ARCHETYPES, "archetype");
console.log(`  archetype morBoundaries failures: ${archResults.length}`);
if (archResults.length > 0) console.log(`    first: ${archResults[0]}`);
assert("ARCHETYPES all have valid morBoundaries", archResults.length === 0);

// 6.E.4c data-deletion proof: legacy nodes.MOR/TRB/PF template entries
// stripped from every archetype. Active runtime path was already gated
// off these via useMorModule (PR 6.E.2a); deletion makes that gate
// implicit (template undefined → loop skips automatically).
let archesWithLegacyMOR = 0;
let archesWithLegacyTRB = 0;
let archesWithLegacyPF = 0;
for (const a of ARCHETYPES) {
  if (a.nodes.MOR !== undefined) archesWithLegacyMOR++;
  if (a.nodes.TRB !== undefined) archesWithLegacyTRB++;
  if (a.nodes.PF !== undefined)  archesWithLegacyPF++;
}
console.log(`  archetypes still carrying nodes.MOR: ${archesWithLegacyMOR}`);
console.log(`  archetypes still carrying nodes.TRB: ${archesWithLegacyTRB}`);
console.log(`  archetypes still carrying nodes.PF:  ${archesWithLegacyPF}`);
assert("no archetype carries nodes.MOR (6.E.4c deletion landed)",
  archesWithLegacyMOR === 0);
assert("no archetype carries nodes.TRB (6.E.4c deletion landed)",
  archesWithLegacyTRB === 0);
assert("no archetype carries nodes.PF (6.E.4c deletion landed)",
  archesWithLegacyPF === 0);

const allCandidates = ELECTIONS.flatMap(e => e.candidates);
console.log(`  candidates: ${allCandidates.length} entries (cardinality check)`);
assert("candidate count === 141 (no entries added/removed)",
  allCandidates.length === 141);
const candResults = validateMorBoundariesPopulated(allCandidates, "candidate");
console.log(`  candidate morBoundaries failures: ${candResults.length}`);
if (candResults.length > 0) console.log(`    first: ${candResults[0]}`);
assert("ELECTIONS candidates all have valid morBoundaries", candResults.length === 0);

const allRegimes = [
  ...EUROPE_PART1, ...EUROPE_PART2, ...AMERICAS, ...ASIA, ...MENA_AFRICA,
];
console.log(`  regimes: ${allRegimes.length} entries (cardinality check)`);

// Cardinality check (PR 6.E.4a, Sam 2026-05-02): the regime corpus is 401
// on origin/self-cluster-collapse. 6.E.4a does not add or remove regime
// entries. Any drift here means an unintended cardinality change and
// should fail the smoke.
assert("regime corpus cardinality === 401 (no entries added/removed)",
  allRegimes.length === 401);

const missingRegimes = allRegimes
  .filter(r => !r.morBoundaries)
  .map(r => `${r.jurisdiction} | ${r.regime} | ${r.startYear}`);
if (missingRegimes.length > 0) {
  console.log(`  ${missingRegimes.length} regimes missing morBoundaries:`);
  for (const m of missingRegimes) console.log(`    - ${m}`);
}
assert("all 401 regimes have morBoundaries (no missing entries)",
  missingRegimes.length === 0);

const regResults = validateMorBoundariesPopulated(allRegimes, "regime");
console.log(`  validator failures on regime corpus: ${regResults.length}`);
if (regResults.length > 0) console.log(`    first: ${regResults[0]}`);
assert("regime arrays all pass validator", regResults.length === 0);

console.log(`\n${failures === 0 ? "✅ ALL PASS" : `❌ ${failures} FAILURES`}`);
process.exit(failures === 0 ? 0 : 1);
