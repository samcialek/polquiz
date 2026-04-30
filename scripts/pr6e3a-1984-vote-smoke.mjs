// PR 6.E.3a smoke for respondentVoteChoice.ts cutover (Layer 1 only).
//
// 1984 Reagan vs Mondale — a clean test case: well-known partisan election,
// Reagan's morBoundaries encode a more national/political_tribe anchored
// profile (load=0.7, intensity=2.5), Mondale's encode a class-coalition
// universalist profile (max boundary=0.48, intensity=3).
//
// 6.E.3a ships Layer 1 (morTargetVectorDistance over the 7 boundaries +
// intensity-derived weight) only. Real Layer 2 (membership lock-and-key
// per ADR-006: respondent.morMembership vs candidate.morMembership, with
// match credit AND mismatch penalty) is deferred until the respondent
// side has morMembership threaded (lands with the membership question in
// 6.F or later). Layer 2 v1 applies only to `ethnic_racial`, `religious`,
// `class`, and `gender`. `political_tribe` remains Layer 1 only
// until/unless the existing partisan multiplier is migrated into Layer 2.
// `national` and `ideological` are explicitly excluded.
//
// Verifies:
//   1. Both legacy (no morBoundaries on respondent) and new (with
//      morBoundaries) paths produce finite, well-ordered scores.
//   2. A universalist-activated respondent ranks Mondale closer than
//      Reagan on both paths.
//   3. A national-anchored respondent ranks Reagan closer — and the win
//      comes from Layer 1 vector distance + the partisan-loyalty
//      multiplier, NOT from a same-boundary credit.
//   4. The moralFloorPenalty path doesn't fire in 1984 (not a rights-veto
//      year — sanity check on the gated translation).

import { predictVote } from "../dist/historical/respondentVoteChoice.js";
import { ELECTIONS } from "../dist/historical/candidates.js";
import { getContext } from "../dist/historical/contexts.js";

let failures = 0;
function assert(name, cond, info = "") {
  if (cond) {
    console.log(`  ✓ ${name}`);
  } else {
    failures++;
    console.log(`  ✗ ${name} ${info}`);
  }
}

const election = ELECTIONS.find(e => e.year === 1984);
const ctx = getContext(1984);

// Build NodeSignature shape from per-node {pos, sal} entries — no morBoundaries.
function mkSig(spec) {
  const sig = {};
  for (const [k, v] of Object.entries(spec)) sig[k] = v;
  return sig;
}

// Universalist-activated profile: low MAT, mid CD, low MOR boundaries (universalist),
// high MOR position (inclusive), high MOR salience.
const universalistSig = mkSig({
  MAT: { pos: 1.5, sal: 2.5 }, // strong redistributionist (matches Mondale MAT=1)
  CD:  { pos: 2.5, sal: 2.0 }, // mid-progressive
  CU:  { pos: 4.0, sal: 1.5 }, // internationalist
  MOR: { pos: 4.5, sal: 3.0 }, // wide moral circle, high salience
  PRO: { pos: 4.0, sal: 1.0 },
  COM: { pos: 4.0, sal: 1.0 },
  ZS:  { pos: 2.5, sal: 1.0 },
  ONT_H: { pos: 3.5, sal: 1.0 },
  ONT_S: { pos: 4.5, sal: 1.5 },
  PF:  { pos: 5.0, sal: 3.0 }, // strong Dem partisan (SELF-cluster: pos IS sal)
  TRB: { pos: 3.0, sal: 1.5 },
  ENG: { pos: 4.0, sal: 2.5 },
  EPS: { pos: 1.0, sal: 1.5, catDist: [0.5, 0.2, 0.1, 0.1, 0.05, 0.05] }, // institutionalist-leaning
  AES: { pos: 0.0, sal: 1.5, catDist: [0.5, 0.2, 0.1, 0.1, 0.05, 0.05] }, // statesman
});

// National-anchored profile: high CU (nationalist), high MOR position low (narrow),
// high political_tribe-equivalent partisanship (Republican-coded).
const nationalAnchoredSig = mkSig({
  MAT: { pos: 4.0, sal: 2.0 }, // pro-market (matches Reagan MAT=4)
  CD:  { pos: 4.0, sal: 2.0 }, // traditional culture
  CU:  { pos: 2.0, sal: 2.5 }, // American exceptionalist
  MOR: { pos: 2.0, sal: 2.5 }, // narrow moral circle, activated
  PRO: { pos: 4.0, sal: 1.0 },
  COM: { pos: 3.0, sal: 1.0 },
  ZS:  { pos: 1.5, sal: 1.0 },
  ONT_H: { pos: 4.0, sal: 1.0 },
  ONT_S: { pos: 4.0, sal: 1.5 },
  PF:  { pos: 5.0, sal: 3.0 }, // strong Rep partisan
  TRB: { pos: 4.0, sal: 2.5 },
  ENG: { pos: 4.0, sal: 2.5 },
  EPS: { pos: 3.0, sal: 1.5, catDist: [0.1, 0.1, 0.1, 0.5, 0.1, 0.1] }, // intuitionist
  AES: { pos: 5.0, sal: 1.5, catDist: [0.1, 0.05, 0.05, 0.1, 0.2, 0.5] }, // visionary
});

// Matching morBoundaries states.
function mkMor(boundaries, intensity) {
  return { boundaries, intensity, touches: {}, touchTypes: new Set(), status: "live_resolved" };
}
const universalistMor = mkMor({
  national: 0.10, ethnic_racial: 0.05, religious: 0.05, class: 0.40,
  ideological: 0.30, gender: 0.05, political_tribe: 1.0,
}, 3.0);
const nationalAnchoredMor = mkMor({
  national: 0.85, ethnic_racial: 0.30, religious: 0.50, class: 0.10,
  ideological: 0.45, gender: 0.10, political_tribe: 0.65,
}, 2.5);

function findCand(prediction, name) {
  return prediction.candidates.find(c => c.name === name);
}

// ── Test 1: legacy path (no morBoundaries) still works ────────────────
console.log("=== Test 1: legacy path — no morBoundaries on respondent ===");
{
  const pred = predictVote(universalistSig, election.candidates, ctx, "engaged",
    "D", null, null, false, null, null);
  const r = findCand(pred, "Reagan");
  const m = findCand(pred, "Mondale");
  console.log(`  Universalist+Dem: Reagan d=${r.distance.toFixed(3)}, Mondale d=${m.distance.toFixed(3)}, decision=${pred.decision}`);
  assert("Reagan distance is finite", Number.isFinite(r.distance));
  assert("Mondale distance is finite", Number.isFinite(m.distance));
  assert("Mondale closer than Reagan for universalist Dem", m.distance < r.distance);
}

// ── Test 2: new module fires — same respondent + morBoundaries ────────
console.log("\n=== Test 2: new module path — morBoundaries attached ===");
{
  const pred = predictVote(universalistSig, election.candidates, ctx, "engaged",
    "D", null, null, false, null, universalistMor);
  const r = findCand(pred, "Reagan");
  const m = findCand(pred, "Mondale");
  console.log(`  Universalist+Dem +mor: Reagan d=${r.distance.toFixed(3)}, Mondale d=${m.distance.toFixed(3)}, decision=${pred.decision}`);
  assert("Reagan distance is finite", Number.isFinite(r.distance));
  assert("Mondale closer than Reagan with morBoundaries", m.distance < r.distance);
}

// ── Test 3: national-anchored respondent prefers Reagan ───────────────
// Win must come from Layer 1 vector distance + partisan multiplier, NOT
// from a same-boundary credit (the bug Sam blocked on initial review).
console.log("\n=== Test 3: national-anchored Republican prefers Reagan ===");
{
  const predLegacy = predictVote(nationalAnchoredSig, election.candidates, ctx, "engaged",
    "R", null, null, false, null, null);
  const predNew = predictVote(nationalAnchoredSig, election.candidates, ctx, "engaged",
    "R", null, null, false, null, nationalAnchoredMor);
  const rL = findCand(predLegacy, "Reagan"), mL = findCand(predLegacy, "Mondale");
  const rN = findCand(predNew, "Reagan"),    mN = findCand(predNew, "Mondale");
  console.log(`  legacy:  Reagan d=${rL.distance.toFixed(3)}, Mondale d=${mL.distance.toFixed(3)}`);
  console.log(`  +mor:    Reagan d=${rN.distance.toFixed(3)}, Mondale d=${mN.distance.toFixed(3)}`);
  console.log(`  +mor partisanMult: Reagan ${rN.partisanMultiplier.toFixed(3)}, Mondale ${mN.partisanMultiplier.toFixed(3)}`);
  assert("legacy: Reagan closer", rL.distance < mL.distance);
  assert("new module: Reagan closer", rN.distance < mN.distance);
  // The win must come from Layer 1 vector + partisan multiplier, not from
  // a same-boundary credit. Verified structurally by Test 6 below; here
  // we just confirm the partisan multiplier is doing real work (Reagan
  // = same party, Mondale = out-party penalty).
  assert("Reagan partisanMultiplier == 1.0 (same party as respondent)",
    rN.partisanMultiplier === 1.0);
  assert("Mondale partisanMultiplier > 1.0 (out-party penalty fires)",
    mN.partisanMultiplier > 1.0);
}

// ── Test 4: ranking direction matches between legacy and new module ───
console.log("\n=== Test 4: cross-call ranking sanity ===");
{
  const predU_legacy = predictVote(universalistSig, election.candidates, ctx, "engaged",
    "D", null, null, false, null, null);
  const predU_new    = predictVote(universalistSig, election.candidates, ctx, "engaged",
    "D", null, null, false, null, universalistMor);
  const predN_legacy = predictVote(nationalAnchoredSig, election.candidates, ctx, "engaged",
    "R", null, null, false, null, null);
  const predN_new    = predictVote(nationalAnchoredSig, election.candidates, ctx, "engaged",
    "R", null, null, false, null, nationalAnchoredMor);
  const u_legacyWinner = predU_legacy.nearest.name;
  const u_newWinner    = predU_new.nearest.name;
  const n_legacyWinner = predN_legacy.nearest.name;
  const n_newWinner    = predN_new.nearest.name;
  console.log(`  Universalist:   legacy→${u_legacyWinner}, new→${u_newWinner}`);
  console.log(`  Nat-anchored:   legacy→${n_legacyWinner}, new→${n_newWinner}`);
  assert("universalist winner is Mondale on both paths",
    u_legacyWinner === "Mondale" && u_newWinner === "Mondale");
  assert("national-anchored winner is Reagan on both paths",
    n_legacyWinner === "Reagan" && n_newWinner === "Reagan");
}

// ── Test 5: 1984 is NOT a rights-veto year — moralFloorPenalty stays 0
console.log("\n=== Test 5: moralFloorPenalty does not fire in 1984 ===");
{
  const pred = predictVote(universalistSig, election.candidates, ctx, "engaged",
    "D", null, null, false, null, universalistMor);
  for (const c of pred.candidates) {
    if (c.moralFloorPenalty !== 0) {
      failures++;
      console.log(`  ✗ ${c.name} got moralFloorPenalty=${c.moralFloorPenalty} (expected 0)`);
    }
  }
  assert("no candidate received moralFloorPenalty in 1984",
    pred.candidates.every(c => c.moralFloorPenalty === 0));
}

// ── Test 6: no fake same-boundary credit on national anchor (2016) ────
// Direct test of the bug Sam blocked: 1984 candidates have ideological
// (Reagan) and class (Mondale) anchors, neither of which exercise the
// national-boundary case. 2016 has Trump_2016 with national anchor — a
// national-anchored respondent here would have triggered the buggy
// "same-boundary credit" (national_resp + national_cand → fake match,
// no membership check, no mismatch penalty). Layer 2 deferred per ADR-006
// → Trump's distance to a national-anchored respondent is purely Layer 1
// + partisan multiplier; the fake-credit code path is gone.
console.log("\n=== Test 6: 2016 national-anchored respondent — no fake credit ===");
{
  const election2016 = ELECTIONS.find(e => e.year === 2016);
  const ctx2016 = getContext(2016);
  const trump = election2016?.candidates.find(c => c.name === "Trump");
  if (!election2016 || !ctx2016 || !trump) {
    console.log(`  ✗ 2016 election or Trump not found`);
    failures++;
  } else {
    // Identical respondent to Test 3, but as an Independent so partisan
    // multiplier is uniformly 1.0 — isolates the Layer 1 contribution.
    const pred = predictVote(nationalAnchoredSig, election2016.candidates, ctx2016,
      "engaged", "I", null, null, false, null, nationalAnchoredMor);
    const t = findCand(pred, "Trump");
    const c = findCand(pred, "H. Clinton");
    console.log(`  Trump_2016: anchor=national, d=${t.distance.toFixed(3)}, partisanMult=${t.partisanMultiplier.toFixed(3)}`);
    console.log(`  Clinton_2016: anchor=ideological, d=${c.distance.toFixed(3)}, partisanMult=${c.partisanMultiplier.toFixed(3)}`);
    // With the old buggy credit, Trump's distance would have been
    // dragged DOWN to near zero (national anchor + national resp boundary
    // 0.85 + intensity 2.5 → max credit fires). Without the credit,
    // Trump's distance reflects honest Layer 1 + per-node alignment.
    assert("Trump distance is finite and > 0",
      Number.isFinite(t.distance) && t.distance > 0);
    // Independent → both candidates get partisan mult = 1.0 (isolates
    // Layer 1 from out-party effects).
    assert("Trump partisanMultiplier == 1.0 (Independent respondent)",
      t.partisanMultiplier === 1.0);
    assert("Clinton partisanMultiplier == 1.0 (Independent respondent)",
      c.partisanMultiplier === 1.0);
    // The actual ranking between Trump and Clinton for this profile is
    // not the assertion — both are reasonable outcomes given the synthetic
    // profile. The point is structural: Trump distance is not artificially
    // floored by a fake same-boundary credit. Sanity floor: the smallest
    // legitimate Layer 1 distance for a 7-D vector with non-trivial
    // per-node nodes mixed in would be ~0.05; an artificial credit would
    // have driven it to ~0.001 or 0 by zeroing out weightedSumSq.
    assert("Trump distance > 0.05 (no fake-credit floor)", t.distance > 0.05);
  }
}

console.log(`\n${failures === 0 ? "✅ ALL PASS" : `❌ ${failures} FAILURES`}`);
process.exit(failures === 0 ? 0 : 1);
