// PR 6.E.2b focused unit tests for the two bridge fixes Sam flagged on review:
//
//   1. mirrorMorSalToIntensity — MOR salience evidence must bump intensity
//      (was previously dropped on the floor; only MOR position bridged).
//   2. mirrorAnchorToBoundaries with `global` — must encode universalist
//      activation (LOW boundaries + HIGH intensity), not silently no-op.
//
// Tests the exported helpers directly against synthetic state. The
// quizwalk smoke (pr6e2b-quizwalk-smoke.mjs) covers end-to-end behavior;
// this one isolates the two specific fixes so future regressions on either
// helper produce a sharp localized failure.

import { mirrorMorSalToIntensity, mirrorAnchorToBoundaries } from "../dist/engine/update.js";
import { mkInitialMorBoundaries } from "../dist/engine/math.js";

let failures = 0;
function assert(name, cond, info = "") {
  if (cond) {
    console.log(`  ✓ ${name}`);
  } else {
    failures++;
    console.log(`  ✗ ${name} ${info}`);
  }
}

function mkBareState() {
  // Minimal RespondentState shell — just enough that the bridge helpers can
  // mutate state.morBoundaries. Other fields are unused by the helpers under test.
  return {
    answers: {},
    continuous: {},
    categorical: {},
    trbAnchor: { dist: [1/9, 1/9, 1/9, 1/9, 1/9, 1/9, 1/9, 1/9, 1/9], touches: 0 },
    morBoundaries: mkInitialMorBoundaries(),
    archetypeDistances: {},
  };
}

// ─── Test 1: mirrorMorSalToIntensity ───────────────────────────────────
console.log("=== Test 1: mirrorMorSalToIntensity bumps intensity from MOR salDist ===");

// SAL_IF_BEST = [0.05, 0.15, 0.30, 0.50] → expectedSal ≈ 2.25
const SAL_IF_BEST = [0.05, 0.15, 0.30, 0.50];
const SAL_IF_LOW  = [0.50, 0.30, 0.15, 0.05]; // expectedSal ≈ 0.75

{
  const s = mkBareState();
  assert("init intensity = 0", s.morBoundaries.intensity === 0);
  mirrorMorSalToIntensity(s, SAL_IF_BEST, 1.0);
  console.log(`  after 1× SAL_IF_BEST: intensity=${s.morBoundaries.intensity.toFixed(4)}`);
  assert("intensity > 0 after high-sal evidence", s.morBoundaries.intensity > 0);
  // BRIDGE_MOR_SAL_MIX = 0.10, target ≈ 2.25 → expected ≈ 0.10 * 2.25 = 0.225
  assert("intensity within expected band [0.15, 0.30]",
    s.morBoundaries.intensity > 0.15 && s.morBoundaries.intensity < 0.30,
    `got ${s.morBoundaries.intensity.toFixed(4)}`);
}

{
  const s = mkBareState();
  // Repeated high-sal evidence should approach the target asymptotically.
  // Convex-mix arithmetic: new_n = T - T·(1-m)^n. With T=2.25, m=0.10:
  //   n=10 → 1.466;  n=30 → 2.144.
  for (let i = 0; i < 10; i++) mirrorMorSalToIntensity(s, SAL_IF_BEST, 1.0);
  console.log(`  after 10× SAL_IF_BEST: intensity=${s.morBoundaries.intensity.toFixed(4)}`);
  assert("intensity approaches target ~2.25 (n=10 expected ~1.47)",
    s.morBoundaries.intensity > 1.30 && s.morBoundaries.intensity < 1.80);
}

{
  const s = mkBareState();
  mirrorMorSalToIntensity(s, SAL_IF_LOW, 1.0);
  console.log(`  after 1× SAL_IF_LOW: intensity=${s.morBoundaries.intensity.toFixed(4)}`);
  // Target ≈ 0.75, mix 0.10 → small bump toward 0.075
  assert("low-sal evidence produces small intensity bump",
    s.morBoundaries.intensity > 0.04 && s.morBoundaries.intensity < 0.12);
}

{
  const s = mkBareState();
  mirrorMorSalToIntensity(s, SAL_IF_BEST, 0.0);
  assert("weight=0 produces no change", s.morBoundaries.intensity === 0);
}

{
  const s = mkBareState();
  mirrorMorSalToIntensity(s, undefined, 1.0);
  mirrorMorSalToIntensity(s, [0, 0, 0], 1.0); // wrong length
  assert("undefined / wrong-length salDist no-ops safely", s.morBoundaries.intensity === 0);
}

// ─── Test 2: global anchor encodes universalist activation ────────────
console.log("\n=== Test 2: mirrorAnchorToBoundaries — global anchor = LOW boundaries + HIGH intensity ===");

{
  const s = mkBareState();
  mirrorAnchorToBoundaries(s, { global: 2.0 }, 1.0);
  const bs = s.morBoundaries.boundaries;
  console.log(`  after global:2.0 — intensity=${s.morBoundaries.intensity.toFixed(3)}, ` +
              `boundaries: nat=${bs.national.toFixed(3)}, eth=${bs.ethnic_racial.toFixed(3)}, ` +
              `pt=${bs.political_tribe.toFixed(3)}`);
  assert("global anchor bumps intensity", s.morBoundaries.intensity > 0);
  // global pulls all 7 boundaries DOWN toward 0.15 — they should drop below 0.5.
  let allDecreased = true;
  for (const v of Object.values(bs)) {
    if (v >= 0.5) { allDecreased = false; break; }
  }
  assert("global anchor pulls ALL 7 boundaries downward (below 0.5)", allDecreased);
}

{
  // Repeat-fire: 10 global-anchor signals should drive a strongly universalist state.
  const s = mkBareState();
  for (let i = 0; i < 10; i++) mirrorAnchorToBoundaries(s, { global: 2.0 }, 1.0);
  const bs = s.morBoundaries.boundaries;
  const maxBoundary = Math.max(...Object.values(bs));
  console.log(`  after 10× global:2.0 — intensity=${s.morBoundaries.intensity.toFixed(3)}, ` +
              `max boundary=${maxBoundary.toFixed(3)}`);
  // Universalist signature: low load + high intensity.
  assert("repeated global drives intensity > 1.0", s.morBoundaries.intensity > 1.0);
  assert("repeated global drives all boundaries < 0.30", maxBoundary < 0.30);
  // universalismScore = intensity * (1 - load); for universalism we want this high.
  const u = s.morBoundaries.intensity * (1 - maxBoundary);
  console.log(`  universalismScore = ${u.toFixed(3)}`);
  assert("universalismScore > 1.0 (clear universalist activation)", u > 1.0);
}

{
  // Contrast: ethnic_racial anchor produces the opposite pattern (high load, lower
  // universalism). Sanity-check that the global-vs-named distinction holds.
  const sGlobal = mkBareState();
  const sEthnic = mkBareState();
  for (let i = 0; i < 10; i++) {
    mirrorAnchorToBoundaries(sGlobal, { global: 2.0 }, 1.0);
    mirrorAnchorToBoundaries(sEthnic, { ethnic_racial: 2.0 }, 1.0);
  }
  const globalLoad = Math.max(...Object.values(sGlobal.morBoundaries.boundaries));
  const ethnicLoad = Math.max(...Object.values(sEthnic.morBoundaries.boundaries));
  console.log(`  contrast: global load=${globalLoad.toFixed(3)} vs ethnic load=${ethnicLoad.toFixed(3)}`);
  assert("global-anchor load is much LOWER than ethnic-anchor load",
    globalLoad < 0.30 && ethnicLoad > 0.60);
}

{
  // mixed_none should still be inert (genuinely ambiguous, no signal direction).
  const s = mkBareState();
  mirrorAnchorToBoundaries(s, { mixed_none: 2.0 }, 1.0);
  const bs = s.morBoundaries.boundaries;
  const allUntouched = Object.values(bs).every(v => v === 0.5);
  console.log(`  mixed_none: intensity=${s.morBoundaries.intensity}, all boundaries 0.5? ${allUntouched}`);
  assert("mixed_none does not move intensity", s.morBoundaries.intensity === 0);
  assert("mixed_none does not move any boundary", allUntouched);
}

console.log(`\n${failures === 0 ? "✅ ALL PASS" : `❌ ${failures} FAILURES`}`);
process.exit(failures === 0 ? 0 : 1);
