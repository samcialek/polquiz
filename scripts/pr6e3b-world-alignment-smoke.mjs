// PR 6.E.3b smoke for build-alignment.ts cutover (world-map Layer 1).
//
// Two contrasting archetypes against two contrasting regimes:
//   - 001 Rawlsian Reformer (universalist + pro-institutional: max boundary
//     0.25, intensity 3, MOR=5/PRO=5/CU=5 — social-democratic)
//   - 104 National Protector (bounded + nationalist: max boundary 1.0
//     political_tribe, national 0.73, intensity 3; CU=1/COM=1/ZS=5)
//   - Sweden Neoliberal Turn 1976-2005 (universalist: max boundary 0.75
//     political_tribe; MOR=4, CU=4, PRO=5, COM=5)
//   - Nazi Germany 1933-1945 (bounded: ethnic_racial 0.95, national 0.9;
//     MOR=1, CU=1, PRO=1)
//
// Earlier draft used 110 Principled Abstainer (anti-PRO/COM dominates,
// not a clean universalist test) and 142 White Grievance Voter (policy-
// flat identity-primary archetype — per-node nodes can't distinguish);
// neither produced a meaningful direction signal under either path.
//
// Layer 1 only: archetype.morBoundaries vs regime.morBoundaries via
// morTargetVectorDistance. No Layer 2 — regimes never get membership
// lock-and-key per ADR-006 (the archetype-vs-regime question is
// structural, not a membership match).
//
// Verifies:
//   1. All four pairings produce finite alignments in the [-3, 3] range.
//   2. Universalist archetype prefers universalist regime.
//   3. Tribalist archetype prefers bounded regime.
//   4. Per-archetype gate works: stripping morBoundaries from one side
//      falls back to the legacy MOR per-node path; alignment stays finite
//      and the same direction as the new module.

import { computeAlignment } from "../dist/global/build-alignment.js";
import { ARCHETYPES } from "../dist/config/archetypes.js";
import { EUROPE_PART1 } from "../dist/global/jurisdictions-europe1.js";
import { EUROPE_PART2 } from "../dist/global/jurisdictions-europe2.js";

let failures = 0;
function assert(name, cond, info = "") {
  if (cond) {
    console.log(`  ✓ ${name}`);
  } else {
    failures++;
    console.log(`  ✗ ${name} ${info}`);
  }
}

const archUniv = ARCHETYPES.find(a => a.id === "001"); // Rawlsian Reformer
const archTrib = ARCHETYPES.find(a => a.id === "104"); // National Protector
const swedenNeoliberal = EUROPE_PART2.find(r =>
  r.jurisdiction === "Sweden" && r.regime === "Neoliberal Turn");
const nazi = EUROPE_PART1.find(r =>
  r.jurisdiction === "Germany/Prussia" && r.regime === "Nazi Germany");

if (!archUniv || !archTrib || !swedenNeoliberal || !nazi) {
  console.log("✗ test fixtures missing — check archetype IDs / regime names");
  process.exit(1);
}

console.log("=== Test 1: all four pairings produce finite alignments in [-3, 3] ===");
const a_univ_univ = computeAlignment(archUniv, swedenNeoliberal);
const a_univ_naz  = computeAlignment(archUniv, nazi);
const a_trib_univ = computeAlignment(archTrib, swedenNeoliberal);
const a_trib_naz  = computeAlignment(archTrib, nazi);
console.log(`  001 Rawlsian Reformer  vs Sweden Neoliberal: ${a_univ_univ.toFixed(3)}`);
console.log(`  001 Rawlsian Reformer  vs Nazi Germany:      ${a_univ_naz.toFixed(3)}`);
console.log(`  104 National Protector vs Sweden Neoliberal: ${a_trib_univ.toFixed(3)}`);
console.log(`  104 National Protector vs Nazi Germany:      ${a_trib_naz.toFixed(3)}`);
for (const [name, v] of [
  ["univ/univ", a_univ_univ], ["univ/naz", a_univ_naz],
  ["trib/univ", a_trib_univ], ["trib/naz", a_trib_naz],
]) {
  assert(`${name}: finite & in [-3, 3]`,
    Number.isFinite(v) && v >= -3 && v <= 3, `got ${v}`);
}

console.log("\n=== Test 2: universalist archetype prefers universalist regime ===");
console.log(`  001 vs Sweden=${a_univ_univ.toFixed(3)}, vs Nazi=${a_univ_naz.toFixed(3)}, delta=${(a_univ_univ - a_univ_naz).toFixed(3)}`);
assert("001 Rawlsian Reformer prefers Sweden over Nazi Germany",
  a_univ_univ > a_univ_naz);

console.log("\n=== Test 3: tribalist archetype prefers bounded regime ===");
console.log(`  104 vs Sweden=${a_trib_univ.toFixed(3)}, vs Nazi=${a_trib_naz.toFixed(3)}, delta=${(a_trib_naz - a_trib_univ).toFixed(3)}`);
assert("104 National Protector prefers Nazi Germany over Sweden",
  a_trib_naz > a_trib_univ);

console.log("\n=== Test 4: per-archetype gate falls back to legacy path ===");
// Strip morBoundaries from a copy of the archetype and confirm
// computeAlignment still produces a finite, same-direction result via
// the legacy MOR per-node contribution.
const archUniv_legacy = { ...archUniv, morBoundaries: undefined };
const archTrib_legacy = { ...archTrib, morBoundaries: undefined };
const legacy_univ_univ = computeAlignment(archUniv_legacy, swedenNeoliberal);
const legacy_univ_naz  = computeAlignment(archUniv_legacy, nazi);
const legacy_trib_univ = computeAlignment(archTrib_legacy, swedenNeoliberal);
const legacy_trib_naz  = computeAlignment(archTrib_legacy, nazi);
console.log(`  legacy 001 vs Sweden=${legacy_univ_univ.toFixed(3)}, vs Nazi=${legacy_univ_naz.toFixed(3)}`);
console.log(`  legacy 104 vs Sweden=${legacy_trib_univ.toFixed(3)}, vs Nazi=${legacy_trib_naz.toFixed(3)}`);
assert("legacy: 001 still prefers Sweden over Nazi", legacy_univ_univ > legacy_univ_naz);
assert("legacy: 104 still prefers Nazi over Sweden", legacy_trib_naz > legacy_trib_univ);
assert("legacy: all 4 alignments finite & in range",
  [legacy_univ_univ, legacy_univ_naz, legacy_trib_univ, legacy_trib_naz]
    .every(v => Number.isFinite(v) && v >= -3 && v <= 3));

// Also verify the gate fires per-pair — a regime stripped of morBoundaries
// against an archetype that still has it should also use the legacy path.
console.log("\n=== Test 5: per-pair gate (regime missing morBoundaries) ===");
const swedenNoMor = { ...swedenNeoliberal, morBoundaries: undefined };
const a_univ_swedenNoMor = computeAlignment(archUniv, swedenNoMor);
console.log(`  001 vs Sweden(no-mor) = ${a_univ_swedenNoMor.toFixed(3)} (legacy path)`);
assert("regime missing morBoundaries → legacy path stays finite",
  Number.isFinite(a_univ_swedenNoMor) && a_univ_swedenNoMor >= -3 && a_univ_swedenNoMor <= 3);

console.log(`\n${failures === 0 ? "✅ ALL PASS" : `❌ ${failures} FAILURES`}`);
process.exit(failures === 0 ? 0 : 1);
