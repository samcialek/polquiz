// PR 6.E.3c audit smoke for the contexts-*.ts max-merge.
//
// Acceptance check (Sam, 2026-05-01): every legacy {MOR, TRB, PF} era-weight
// cluster becomes ONE morBoundaries slot keyed under "MOR" with value
// max(MOR ?? 0, TRB ?? 0, PF ?? 0). NO summing, NO unrelated node-weight drift.
//
// This smoke loads ALL_CONTEXTS post-merge and asserts:
//   1. No `TRB` or `PF` appears as a key in zeitgeist.nodeWeights, in any
//      candidateActivations[].activationNodes, or in any threatActivation.
//   2. No `TRB` or `PF` appears in any issueLandscape.{primaryAxis,
//      secondaryAxis, dormant} array.
//   3. Spot-check known elections preserve max-merge values:
//        1860 — was MOR=2.0, TRB=2.0 → should be MOR=2.0
//        1932 — MOR/TRB/PF were all in dormant only → MOR stays in dormant
//        2016 — was TRB=2.0, PF=1.4, no MOR → should be MOR=2.0 (max)
//   4. All 60 contexts loaded; no schema breakage.

import { ALL_CONTEXTS, getContext } from "../dist/historical/contexts.js";

let failures = 0;
function assert(name, cond, info = "") {
  if (cond) {
    console.log(`  ✓ ${name}`);
  } else {
    failures++;
    console.log(`  ✗ ${name} ${info}`);
  }
}

console.log("=== Test 1: all 60 election contexts load ===");
console.log(`  ALL_CONTEXTS.length = ${ALL_CONTEXTS.length}`);
assert("60 election contexts loaded", ALL_CONTEXTS.length === 60);

console.log("\n=== Test 2: no TRB / PF keys remain in numeric weight maps ===");
const offendingNumericKeys = [];
for (const ctx of ALL_CONTEXTS) {
  for (const k of Object.keys(ctx.zeitgeist.nodeWeights ?? {})) {
    if (k === "TRB" || k === "PF") {
      offendingNumericKeys.push(`${ctx.year} zeitgeist.nodeWeights.${k}`);
    }
  }
  for (const ca of ctx.candidateActivations ?? []) {
    for (const k of Object.keys(ca.activationNodes ?? {})) {
      if (k === "TRB" || k === "PF") {
        offendingNumericKeys.push(`${ctx.year} ${ca.candidateName} activationNodes.${k}`);
      }
    }
    for (const k of Object.keys(ca.threatActivation ?? {})) {
      if (k === "TRB" || k === "PF") {
        offendingNumericKeys.push(`${ctx.year} ${ca.candidateName} threatActivation.${k}`);
      }
    }
  }
}
console.log(`  ${offendingNumericKeys.length} offending TRB/PF keys remain in numeric maps`);
if (offendingNumericKeys.length > 0) {
  console.log(`  first 5: ${offendingNumericKeys.slice(0, 5).join(", ")}`);
}
assert("no TRB/PF in numeric weight maps", offendingNumericKeys.length === 0);

console.log("\n=== Test 3: no TRB / PF in tier arrays ===");
const offendingArrayMembers = [];
for (const ctx of ALL_CONTEXTS) {
  for (const tier of ["primaryAxis", "secondaryAxis", "dormant"]) {
    const arr = ctx.issueLandscape?.[tier] ?? [];
    for (const k of arr) {
      if (k === "TRB" || k === "PF") {
        offendingArrayMembers.push(`${ctx.year} issueLandscape.${tier}.${k}`);
      }
    }
  }
}
console.log(`  ${offendingArrayMembers.length} offending TRB/PF members remain in tier arrays`);
if (offendingArrayMembers.length > 0) {
  console.log(`  first 5: ${offendingArrayMembers.slice(0, 5).join(", ")}`);
}
assert("no TRB/PF in tier arrays", offendingArrayMembers.length === 0);

console.log("\n=== Test 4: spot checks on known elections ===");

// 1860 — was nodeWeights: { MOR: 2.0, TRB: 2.0, ONT_S: 4.0, CD: 1.8, CU: 1.5, ZS: 1.5 }
//        primaryAxis: ["MOR", "TRB", "ONT_S"] → MOR in primary
const c1860 = getContext(1860);
console.log(`  1860 nodeWeights: ${JSON.stringify(c1860.zeitgeist.nodeWeights)}`);
console.log(`  1860 primaryAxis: ${JSON.stringify(c1860.issueLandscape.primaryAxis)}`);
assert("1860: MOR=2.0 (max of MOR=2.0, TRB=2.0)", c1860.zeitgeist.nodeWeights.MOR === 2.0);
assert("1860: ONT_S unchanged at 4.0 (no drift)", c1860.zeitgeist.nodeWeights.ONT_S === 4.0);
assert("1860: MOR in primaryAxis", c1860.issueLandscape.primaryAxis.includes("MOR"));
assert("1860: ONT_S still in primaryAxis (no drift)", c1860.issueLandscape.primaryAxis.includes("ONT_S"));

// 1932 — nodeWeights: no MOR/TRB/PF keys; dormant: ["CD", "CU", "MOR", "PF", "TRB"]
//        → MOR stays in dormant (highest tier MOR/TRB/PF appeared in)
const c1932 = getContext(1932);
console.log(`  1932 nodeWeights: ${JSON.stringify(c1932.zeitgeist.nodeWeights)}`);
console.log(`  1932 dormant:     ${JSON.stringify(c1932.issueLandscape.dormant)}`);
assert("1932: no MOR added to nodeWeights (no MOR/TRB/PF in original)",
  !("MOR" in c1932.zeitgeist.nodeWeights) ||
  c1932.zeitgeist.nodeWeights.MOR === undefined);
assert("1932: MAT unchanged at 2.5 (no drift)", c1932.zeitgeist.nodeWeights.MAT === 2.5);
assert("1932: MOR in dormant tier (only place it could be)",
  c1932.issueLandscape.dormant.includes("MOR"));
assert("1932: MAT still in primaryAxis", c1932.issueLandscape.primaryAxis.includes("MAT"));

// 2016 — was nodeWeights: { CD: 2.0, TRB: 2.0, ONT_S: 5.8, ZS: 1.6, PF: 1.4, ENG: 1.4 }
//        primaryAxis: ["CD", "TRB", "ONT_S"] → MOR placed where TRB was
const c2016 = getContext(2016);
console.log(`  2016 nodeWeights: ${JSON.stringify(c2016.zeitgeist.nodeWeights)}`);
console.log(`  2016 primaryAxis: ${JSON.stringify(c2016.issueLandscape.primaryAxis)}`);
assert("2016: MOR=2.0 (max of TRB=2.0, PF=1.4)", c2016.zeitgeist.nodeWeights.MOR === 2.0);
assert("2016: CD unchanged at 2.0 (no drift)", c2016.zeitgeist.nodeWeights.CD === 2.0);
assert("2016: ONT_S unchanged at 5.8", c2016.zeitgeist.nodeWeights.ONT_S === 5.8);
assert("2016: MOR in primaryAxis", c2016.issueLandscape.primaryAxis.includes("MOR"));
assert("2016: CD still in primaryAxis (no drift)", c2016.issueLandscape.primaryAxis.includes("CD"));

console.log("\n=== Test 5: structural integrity — no NaN, no negative weights ===");
let invalidWeights = 0;
for (const ctx of ALL_CONTEXTS) {
  for (const [k, v] of Object.entries(ctx.zeitgeist.nodeWeights ?? {})) {
    if (!Number.isFinite(v) || v < 0) {
      invalidWeights++;
      console.log(`  ✗ ${ctx.year} nodeWeights.${k} = ${v}`);
    }
  }
  for (const ca of ctx.candidateActivations ?? []) {
    for (const [k, v] of Object.entries(ca.activationNodes ?? {})) {
      if (!Number.isFinite(v) || v < 0) {
        invalidWeights++;
        console.log(`  ✗ ${ctx.year} ${ca.candidateName} activationNodes.${k} = ${v}`);
      }
    }
  }
}
assert("all weights finite & non-negative", invalidWeights === 0);

console.log(`\n${failures === 0 ? "✅ ALL PASS" : `❌ ${failures} FAILURES`}`);
process.exit(failures === 0 ? 0 : 1);
