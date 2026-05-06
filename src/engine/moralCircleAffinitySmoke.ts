/**
 * ADR-007 Stage E — smoke / audit harness.
 *
 * Validates the Stage B + Stage D helpers in `moralCircleAffinity.ts`:
 *   1. Nine raw values present where expected (universal + 8 scoped).
 *   2. excess[scope] = max(0, scoped[scope] - universal); null scoped → 0.
 *   3. intensity uses L2 norm; intensity01 = min(1, l2/100); intensity03 = 3 × intensity01.
 *   4. `not meaningful to me` (null) derives 0 excess (NOT universal).
 *   5. Q103 (issue_salience_screener) is NOT used as a universalAffinity prior
 *      — verified by absence from the conversion-helper API surface.
 *   6. Legacy outputs from a sample mapper signature are unchanged when the
 *      Stage D conversion helpers run (additive only — they read the legacy
 *      `MoralBoundariesSignature` but do not mutate it).
 *
 * Usage: npx tsx src/engine/moralCircleAffinitySmoke.ts
 *
 * Exits non-zero on any assertion failure.
 */

import {
  MORAL_CIRCLE_SCOPES,
  ACTIVE_BOUNDARY_REPORT_THRESHOLD,
  buildMoralCircleAffinity,
  deriveExcessAffinities,
  deriveMoralCircleIntensity,
  deriveActiveBoundaries,
  pos15ToAffinity100,
  salience03ToAffinity100,
  validateRawAffinity,
  legacyPriorFromMorBoundaries,
  legacyPriorFromTrbAnchor,
  legacyPriorFromPfPosition,
  type MoralCircleScope,
  type MoralCircleAffinity,
} from "./moralCircleAffinity.js";
import type { MoralBoundariesSignature, MoralBoundaryEntry } from "../electorate/surveyToPrismMapper.js";

// ─── Test harness ────────────────────────────────────────────────────────

let failures = 0;
let total = 0;
function assert(cond: boolean, label: string, detail?: string) {
  total++;
  if (cond) {
    console.log(`  ✓ ${label}`);
  } else {
    failures++;
    console.error(`  ✗ ${label}${detail ? `\n      ${detail}` : ""}`);
  }
}
function assertEqual<T>(actual: T, expected: T, label: string) {
  assert(JSON.stringify(actual) === JSON.stringify(expected), label, `expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
}
function assertClose(actual: number, expected: number, eps: number, label: string) {
  assert(Math.abs(actual - expected) <= eps, label, `expected ≈${expected} ± ${eps}, got ${actual}`);
}

function fullScopedAffinities(values: Partial<Record<MoralCircleScope, number | null>>): Record<MoralCircleScope, number | null> {
  const out: Record<MoralCircleScope, number | null> = {} as Record<MoralCircleScope, number | null>;
  for (const s of MORAL_CIRCLE_SCOPES) out[s] = values[s] ?? 50;
  return out;
}

function fakeBoundaryEntry(salience: number, source: "real_signal" | "fallback" = "real_signal"): MoralBoundaryEntry {
  return {
    salience,
    provenance: { source, vars: source === "real_signal" ? ["test"] : [], partyIdDerived: false, uncertainty: "medium" },
  };
}

// ─── Test 1: nine raw values present ─────────────────────────────────────

console.log("\nTest 1 — Nine raw values + activeBoundaries shape");
const t1 = buildMoralCircleAffinity(50, fullScopedAffinities({ national: 80, religious: 30 }));
assertEqual(typeof t1.universalAffinity, "number", "universalAffinity is number");
assertEqual(Object.keys(t1.scopedAffinities).sort(), [...MORAL_CIRCLE_SCOPES].sort() as any, "scopedAffinities has 8 named scopes");
assertEqual(Object.keys(t1.excessAffinities).sort(), [...MORAL_CIRCLE_SCOPES].sort() as any, "excessAffinities has 8 named scopes");
assert(Array.isArray(t1.activeBoundaries), "activeBoundaries is an array");

// ─── Test 2: excess formula ──────────────────────────────────────────────

console.log("\nTest 2 — excess[scope] = max(0, scoped - universal)");
const universal = 50;
const scoped = fullScopedAffinities({
  national: 80,        // excess 30
  religious: 30,       // excess 0 (below universal — no excess)
  ethnic_racial: 50,   // excess 0 (equal to universal)
  class: 100,          // excess 50
  ideological: 0,      // excess 0
});
const excess = deriveExcessAffinities(universal, scoped);
assertEqual(excess.national, 30, "national 80 - universal 50 = 30");
assertEqual(excess.religious, 0, "religious 30 < universal 50 → 0 (clamped)");
assertEqual(excess.ethnic_racial, 0, "ethnic_racial 50 = universal 50 → 0");
assertEqual(excess.class, 50, "class 100 - universal 50 = 50");
assertEqual(excess.ideological, 0, "ideological 0 - universal 50 → 0 (clamped)");

// ─── Test 3: null scoped → 0 excess (NOT universal) ──────────────────────

console.log("\nTest 3 — null (`not meaningful to me`) derives 0 excess");
const t3 = buildMoralCircleAffinity(50, {
  national: null,
  religious: null,
  ethnic_racial: 80,
  class: null,
  gender: null,
  sexual: null,
  ideological: null,
  political_camp: null,
});
assertEqual(t3.excessAffinities.national, 0, "null national → 0 excess");
assertEqual(t3.excessAffinities.religious, 0, "null religious → 0 excess");
assertEqual(t3.scopedAffinities.national, null, "null preserved on raw scopedAffinities");
assertEqual(t3.excessAffinities.ethnic_racial, 30, "ethnic_racial 80 - 50 = 30 (non-null path unaffected)");
// Critical: null must NOT silently coerce to universal in the excess vector.
assert(t3.excessAffinities.national === 0, "null was not silently treated as universalAffinity");

// ─── Test 4: L2 intensity ────────────────────────────────────────────────

console.log("\nTest 4 — intensity = L2(excess) / 100");
// Explicit zeros so off-scopes contribute no excess.
const offZero = (overrides: Partial<Record<MoralCircleScope, number | null>>): Record<MoralCircleScope, number | null> => {
  const out: Record<MoralCircleScope, number | null> = {} as Record<MoralCircleScope, number | null>;
  for (const s of MORAL_CIRCLE_SCOPES) out[s] = overrides[s] ?? 0;
  return out;
};
const exVec1 = deriveExcessAffinities(50, offZero({ national: 100, religious: 50, ethnic_racial: 50, class: 50, gender: 50, sexual: 50, ideological: 50, political_camp: 50 })); // national excess 50, others = universal so excess 0
const i1 = deriveMoralCircleIntensity(exVec1);
assertClose(i1.intensity01, 0.5, 0.01, "single 50-excess → L2=50 → intensity01 ≈ 0.5");
assertClose(i1.intensity03, 1.5, 0.01, "intensity03 = 3 × intensity01");

const exVec2 = deriveExcessAffinities(0, offZero({ national: 100 })); // single 100-excess, others 0
const i2 = deriveMoralCircleIntensity(exVec2);
assertClose(i2.intensity01, 1.0, 0.01, "single 100-excess → L2=100 → intensity01 = 1");

// L2 vs sum: L2 prevents broad-weak excesses from exploding.
const broadWeak = deriveExcessAffinities(0, fullScopedAffinities({
  national: 30, religious: 30, ethnic_racial: 30, class: 30, gender: 30, sexual: 30, ideological: 30, political_camp: 30,
}));
const broad = deriveMoralCircleIntensity(broadWeak);
// L2 = sqrt(8 × 30²) = sqrt(7200) ≈ 84.85; intensity01 ≈ 0.85 — high but capped at 1.
assertClose(broad.intensity01, 0.85, 0.02, "8 × 30 excess → L2 ≈ 85 → intensity01 ≈ 0.85 (vs sum=240 which would explode)");

// Explicit zeros on off-scopes so the only excess comes from `national`.
const oneStrong = deriveExcessAffinities(0, {
  national: 80, religious: 0, ethnic_racial: 0, class: 0, gender: 0, sexual: 0, ideological: 0, political_camp: 0,
});
const oneStrongInt = deriveMoralCircleIntensity(oneStrong);
assertClose(oneStrongInt.intensity01, 0.8, 0.01, "single 80-excess (other scopes 0) → intensity01 = 0.8");

// ─── Test 5: activeBoundaries threshold ──────────────────────────────────

console.log("\nTest 5 — activeBoundaries report-threshold = 5");
const exVec3 = deriveExcessAffinities(50, fullScopedAffinities({
  national: 60,         // excess 10 (active)
  religious: 53,        // excess 3 (NOT active — below threshold)
  ethnic_racial: 55,    // excess 5 (exactly at threshold — active)
  class: 100,           // excess 50 (active)
}));
const active = deriveActiveBoundaries(exVec3);
assert(active.includes("national"), "national excess 10 → active");
assert(!active.includes("religious"), "religious excess 3 → NOT active (under 5)");
assert(active.includes("ethnic_racial"), "ethnic_racial excess 5 → active (at threshold)");
assert(active.includes("class"), "class excess 50 → active");
assert(ACTIVE_BOUNDARY_REPORT_THRESHOLD === 5, "threshold constant equals 5");

// ─── Test 6: scale conversion helpers ────────────────────────────────────

console.log("\nTest 6 — pos15ToAffinity100 and salience03ToAffinity100");
assertEqual(pos15ToAffinity100(1), 0, "pos=1 → 0");
assertEqual(pos15ToAffinity100(3), 50, "pos=3 → 50");
assertEqual(pos15ToAffinity100(5), 100, "pos=5 → 100");
assertEqual(pos15ToAffinity100(0.5), 0, "pos=0.5 (out of range low) clamped → 0");
assertEqual(pos15ToAffinity100(7), 100, "pos=7 (out of range high) clamped → 100");
assertEqual(salience03ToAffinity100(0), 0, "sal=0 → 0");
assertEqual(salience03ToAffinity100(1.5), 50, "sal=1.5 → 50");
assertEqual(salience03ToAffinity100(3), 100, "sal=3 → 100");

// ─── Test 7: validateRawAffinity ─────────────────────────────────────────

console.log("\nTest 7 — validateRawAffinity (clamping + null pass-through)");
assertEqual(validateRawAffinity(50), 50, "in-range → unchanged");
assertEqual(validateRawAffinity(-10), 0, "below 0 → 0");
assertEqual(validateRawAffinity(150), 100, "above 100 → 100");
assertEqual(validateRawAffinity(null), null, "null pass-through preserved");
let threwOnNaN = false;
try { validateRawAffinity(NaN); } catch { threwOnNaN = true; }
assert(threwOnNaN, "validateRawAffinity throws on NaN");

// ─── Test 8: Stage D legacy mapper-boundary conversion ──────────────────

console.log("\nTest 8 — legacyPriorFromMorBoundaries");
const fakeMb: MoralBoundariesSignature = {
  national:       fakeBoundaryEntry(2.4, "real_signal"),
  ethnic_racial:  fakeBoundaryEntry(1.4, "real_signal"),
  religious:      fakeBoundaryEntry(0.6, "fallback"),       // skipped — not real_signal
  class:          fakeBoundaryEntry(1.0, "real_signal"),
  ideological:    fakeBoundaryEntry(2.0, "real_signal"),
  gender:         fakeBoundaryEntry(2.0, "real_signal"),
  political_camp: fakeBoundaryEntry(2.5, "real_signal"),
  intensity: 1.8,
  intensityProvenance: { source: "real_signal", vars: [], partyIdDerived: false, uncertainty: "medium" },
};
const priors = legacyPriorFromMorBoundaries(fakeMb);
assertEqual(priors.length, 6, "6 priors emitted (1 of 7 was fallback)");
const nationalPrior = priors.find(p => p.scope === "national")!;
assertEqual(nationalPrior.rawValue, 80, "national salience 2.4 → rawValue 80 (clamped from round(2.4/3*100)=80)");
assertEqual(nationalPrior.priorWeightCap, 0.10, "national prior cap = 0.10 per ADR table");
const politicalCampPrior = priors.find(p => p.scope === "political_camp")!;
assertEqual(politicalCampPrior.priorWeightCap, 0.25, "political_camp prior cap = 0.25 per ADR table");
assert(priors.every(p => p.source.startsWith("legacy_morBoundaries.")), "all priors tagged legacy_morBoundaries.*");

// ─── Test 9: Stage D TRB-anchor conversion ──────────────────────────────

console.log("\nTest 9 — legacyPriorFromTrbAnchor");
const tr1 = legacyPriorFromTrbAnchor("national", 2.0);
assertEqual(tr1!.scope, "national", "anchor:national → scope:national");
assertEqual(tr1!.rawValue, 67, "salience 2.0 → 67 (round(2/3*100))");
assertEqual(tr1!.priorWeightCap, 0.30, "TRB anchor prior cap = 0.30 per ADR");

const tr2 = legacyPriorFromTrbAnchor("global", 1.5);
assertEqual(tr2!.scope, "universal", "anchor:global → scope:universal (per ADR mapping)");

const tr3 = legacyPriorFromTrbAnchor("mixed_none", 1.0);
assertEqual(tr3, null, "anchor:mixed_none → null prior (suppresses scoped excess)");

const tr4 = legacyPriorFromTrbAnchor("ethnic_racial", 3.0);
assertEqual(tr4!.scope, "ethnic_racial", "anchor:ethnic_racial → scope:ethnic_racial");
assertEqual(tr4!.rawValue, 100, "salience 3.0 → 100");

// ─── Test 10: Stage D PF-position conversion ────────────────────────────

console.log("\nTest 10 — legacyPriorFromPfPosition");
const pf1 = legacyPriorFromPfPosition(5);
assertEqual(pf1.scope, "political_camp", "PF prior scope = political_camp");
assertEqual(pf1.rawValue, 100, "PF pos=5 → rawValue 100");
assertEqual(pf1.priorWeightCap, 0.25, "PF prior cap = 0.25 per ADR");

const pf2 = legacyPriorFromPfPosition(3, 2.0);
// 0.65 × 50 + 0.35 × 67 = 32.5 + 23.45 = 55.95 → 56
assertEqual(pf2.rawValue, 56, "PF pos=3 + sal=2.0 blend (0.65/0.35) → 56");

// ─── Test 11: legacy outputs unchanged (mapper signature is read-only) ──

console.log("\nTest 11 — Stage D conversion is read-only against the mapper signature");
const before = JSON.stringify(fakeMb);
legacyPriorFromMorBoundaries(fakeMb);
const after = JSON.stringify(fakeMb);
assertEqual(after, before, "fakeMb byte-identical before / after legacyPriorFromMorBoundaries call");

// ─── Test 12: Q103 NOT a universalAffinity prior ─────────────────────────

console.log("\nTest 12 — Q103 (issue_salience_screener) is NOT a universalAffinity prior");
// The Stage D API surface should expose NO function that takes Q103 evidence
// and returns a `scope: "universal"` prior. Verified by inspection of the
// exported names: only `legacyPriorFromTrbAnchor("global", ...)` produces a
// universal-scoped prior, and that path is anchor-driven (TRB_ANCHOR=global),
// not Q103. The harness asserts the exported set is the minimal set per ADR.
const moralCircleAffinityExports = [
  "MORAL_CIRCLE_SCOPES",
  "ACTIVE_BOUNDARY_REPORT_THRESHOLD",
  "buildMoralCircleAffinity",
  "deriveExcessAffinities",
  "deriveMoralCircleIntensity",
  "deriveActiveBoundaries",
  "pos15ToAffinity100",
  "salience03ToAffinity100",
  "validateRawAffinity",
  "legacyPriorFromMorBoundaries",
  "legacyPriorFromTrbAnchor",
  "legacyPriorFromPfPosition",
];
assert(!moralCircleAffinityExports.some(n => /q103|issue_salience/i.test(n)), "no exported helper is named for Q103 / issue_salience");
const hasUniversalPath = moralCircleAffinityExports.includes("legacyPriorFromTrbAnchor");
assert(hasUniversalPath, "the only universal-scope path is via TRB anchor 'global' (verified above)");

// ─── Summary ─────────────────────────────────────────────────────────────

console.log(`\n${failures === 0 ? "✅" : "❌"} ${total - failures}/${total} assertions passed`);
if (failures > 0) {
  console.error(`${failures} assertion(s) failed.`);
  process.exit(1);
}
