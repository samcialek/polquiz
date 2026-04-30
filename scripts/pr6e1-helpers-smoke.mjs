// Smoke test for PR 6.E.1 morBoundaries engine helpers.
// Exercises every new helper at least once and asserts basic invariants.

import {
  MOR_BOUNDARY_ORDER,
  morBoundariesToVector,
  morBoundariesFromVector,
  mkInitialMorBoundaries,
  addToMorBoundary,
  bumpMorIntensity,
  boundaryLoad,
  universalismScore,
  boundednessScore,
  morModuleDistance,
  morTargetVectorDistance,
  validateMorBoundaries,
  validateMorBoundariesNodeState,
} from "../dist/engine/math.js";

let failures = 0;
function assert(name, cond, info = "") {
  if (cond) {
    console.log(`  ✓ ${name}`);
  } else {
    failures++;
    console.log(`  ✗ ${name} ${info}`);
  }
}

console.log("=== MOR_BOUNDARY_ORDER ===");
assert("has 7 entries", MOR_BOUNDARY_ORDER.length === 7);
assert("political_tribe present", MOR_BOUNDARY_ORDER.includes("political_tribe"));
assert("national first", MOR_BOUNDARY_ORDER[0] === "national");

console.log("\n=== mkInitialMorBoundaries ===");
const init = mkInitialMorBoundaries();
assert("intensity = 0", init.intensity === 0);
assert("all boundaries = 0.5", MOR_BOUNDARY_ORDER.every(k => init.boundaries[k] === 0.5));
assert("status unknown", init.status === "unknown");
assert("touchTypes is Set", init.touchTypes instanceof Set);

console.log("\n=== morBoundariesToVector / fromVector ===");
const sample = { national: 0.1, ethnic_racial: 0.2, religious: 0.3, class: 0.4, ideological: 0.5, gender: 0.6, political_tribe: 0.7 };
const vec = morBoundariesToVector(sample);
assert("vector length 7", vec.length === 7);
assert("vector[0] = national", vec[0] === 0.1);
assert("vector[6] = political_tribe", vec[6] === 0.7);
const back = morBoundariesFromVector(vec);
assert("roundtrip preserves national", back.national === 0.1);
assert("roundtrip preserves political_tribe", back.political_tribe === 0.7);

console.log("\n=== addToMorBoundary ===");
assert("convex mix midway: 0.0 + target 1.0 mix 0.5 → 0.5", addToMorBoundary(0.0, 1.0, 0.5) === 0.5);
assert("clamps to [0,1] above", addToMorBoundary(0.9, 2.0, 0.5) === 0.95);
assert("clamps to [0,1] below", addToMorBoundary(0.1, -1.0, 0.5) === 0.05);
assert("zero mix preserves", addToMorBoundary(0.7, 0.0, 0.0) === 0.7);

console.log("\n=== bumpMorIntensity ===");
assert("convex mix 0 → 3 mix 0.5 = 1.5", bumpMorIntensity(0, 3, 0.5) === 1.5);
// Function clamps target to [0,3] BEFORE the mix, so target=5 effectively becomes 3.
// Expected: 2.5 * 0.5 + 3 * 0.5 = 2.75
assert("clamps target to [0,3] then mixes", bumpMorIntensity(2.5, 5, 0.5) === 2.75);

console.log("\n=== boundaryLoad ===");
assert("max of all boundaries", boundaryLoad(sample) === 0.7);
const allLow = { national: 0, ethnic_racial: 0, religious: 0, class: 0, ideological: 0, gender: 0, political_tribe: 0 };
assert("all-zero load = 0", boundaryLoad(allLow) === 0);

console.log("\n=== universalismScore / boundednessScore ===");
assert("intensity 3 + load 0 → universalism 3", universalismScore(3, allLow) === 3);
assert("intensity 3 + load 0 → boundedness 0", boundednessScore(3, allLow) === 0);
const oneHigh = { ...allLow, ethnic_racial: 0.9 };
assert("intensity 3 + ethnic 0.9 → boundedness 2.7", Math.abs(boundednessScore(3, oneHigh) - 2.7) < 1e-9);
assert("intensity 3 + ethnic 0.9 → universalism 0.3", Math.abs(universalismScore(3, oneHigh) - 0.3) < 1e-9);

console.log("\n=== morModuleDistance ===");
const respState = { boundaries: sample, intensity: 2.0, touches: {}, touchTypes: new Set(), status: "live" };
const archIdentical = { boundaries: sample, intensity: 2.0 };
assert("identical → distance 0", morModuleDistance(respState, archIdentical) === 0);

const archMaxDiff = { boundaries: { national: 0.9, ethnic_racial: 0.8, religious: 0.7, class: 0.6, ideological: 0.5, gender: 0.4, political_tribe: 0.3 }, intensity: 0 };
const dist = morModuleDistance(respState, archMaxDiff);
assert("nonzero distance for different vectors", dist > 0);
assert("missing both sides → 0.5", morModuleDistance(undefined, undefined) === 0.5);

console.log("\n=== morTargetVectorDistance ===");
assert("identical boundaries → 0", morTargetVectorDistance(sample, sample) === 0);
assert("missing both → 0.5", morTargetVectorDistance(undefined, undefined) === 0.5);

console.log("\n=== validateMorBoundaries ===");
assert("valid sample → null", validateMorBoundaries(sample) === null);
assert("missing key → error", validateMorBoundaries({ national: 0.5 }) !== null);
assert("out of range → error", validateMorBoundaries({ ...sample, national: 1.5 }) !== null);
assert("non-object → error", validateMorBoundaries(null) !== null);

console.log("\n=== validateMorBoundariesNodeState ===");
assert("valid state → null", validateMorBoundariesNodeState({ boundaries: sample, intensity: 1.5 }) === null);
assert("intensity out of range → error", validateMorBoundariesNodeState({ boundaries: sample, intensity: 5 }) !== null);
assert("missing intensity → error", validateMorBoundariesNodeState({ boundaries: sample }) !== null);

console.log(`\n${failures === 0 ? "✅ ALL PASS" : `❌ ${failures} FAILURES`}`);
process.exit(failures === 0 ? 0 : 1);
