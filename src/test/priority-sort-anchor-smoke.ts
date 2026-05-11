/**
 * Priority-sort identity-anchor + moral-circle evidence smoke (2026-05-09).
 *
 * Asserts FIX 1 (engine patch): when applyPrioritySort runs against Q60 with
 * `national_identity` placed in supportHigh, the handler must:
 *   1. shift state.trbAnchor.dist toward the `national` slot
 *   2. increment state.trbAnchor.touches at least once
 *   3. materialize state.moralCircle.affinity (was null at init)
 *   4. raise state.moralCircle.affinity.scopedAffinities.national above the
 *      universal baseline (50)
 *
 * Run with: npx tsx src/test/priority-sort-anchor-smoke.ts
 *
 * Pre-fix this would fail on every assertion — applyPrioritySort silently
 * dropped both trbAnchor and moralCircle evidence.
 */

import { REPRESENTATIVE_QUESTIONS } from "../config/questions.representative.js";
import { applyPrioritySort } from "../engine/update.js";
import type {
  RespondentState,
  ContinuousNodeId,
  CategoricalNodeId,
  SalienceDist,
  TrbAnchor,
} from "../types.js";

const CONTINUOUS_NODES: ContinuousNodeId[] = [
  "MAT", "CD", "CU", "MOR", "PRO", "COM", "ZS", "ONT_H", "ONT_S", "PF", "TRB", "ENG",
];
const CATEGORICAL_NODES: CategoricalNodeId[] = ["EPS", "AES"];

const UNIFORM_SAL: SalienceDist = [0.25, 0.25, 0.25, 0.25];
const UNIFORM_POS = [0.2, 0.2, 0.2, 0.2, 0.2] as const;
const UNIFORM_CAT = [1 / 6, 1 / 6, 1 / 6, 1 / 6, 1 / 6, 1 / 6] as const;
const TRB_ANCHOR_ORDER: TrbAnchor[] = [
  "national", "ideological", "religious", "class", "ethnic_racial",
  "gender", "sexual", "global", "mixed_none",
];

function makeEmptyState(): RespondentState {
  const state: RespondentState = {
    answers: {},
    continuous: {} as any,
    categorical: {} as any,
    trbAnchor: { dist: [1/9, 1/9, 1/9, 1/9, 1/9, 1/9, 1/9, 1/9, 1/9], touches: 0 },
    archetypeDistances: {},
    moralCircle: {
      accumulator: {
        universalSum: 0,
        universalCount: 0,
        scopedSums: {},
        scopedCounts: {},
      },
      touchCount: 0,
      affinity: null,
    },
  };
  for (const n of CONTINUOUS_NODES) {
    state.continuous[n] = {
      posDist: [...UNIFORM_POS] as any,
      salDist: [...UNIFORM_SAL] as SalienceDist,
      touches: 0,
      touchTypes: new Set(),
      status: "live_unresolved",
    };
  }
  for (const n of CATEGORICAL_NODES) {
    state.categorical[n] = {
      catDist: [...UNIFORM_CAT] as any,
      salDist: [...UNIFORM_SAL] as SalienceDist,
      touches: 0,
      touchTypes: new Set(),
      status: "live_unresolved",
    };
  }
  return state;
}

interface CheckResult { name: string; passed: boolean; detail: string; }
const results: CheckResult[] = [];
function check(name: string, passed: boolean, detail: string): void {
  results.push({ name, passed, detail });
  const tag = passed ? "PASS" : "FAIL";
  console.log(`[${tag}] ${name} — ${detail}`);
}

const q60 = REPRESENTATIVE_QUESTIONS.find(q => q.id === 60);
if (!q60) {
  console.error("Q60 not in REPRESENTATIVE_QUESTIONS — cannot run smoke");
  process.exit(2);
}

const allItems = Object.keys(q60.rankingMap ?? {});
console.log(`Q60 items: ${allItems.join(", ")}`);
console.log("");

// ---- Case 1: national_identity in supportHigh, ideological_identity in supportMid ----
const state = makeEmptyState();
const placements = {
  supportHigh: ["national_identity"],
  supportMid: ["ideological_identity"],
  neutral: ["religious_identity", "class_identity", "ethnic_racial_identity", "gender_identity", "global_citizen"],
  opposeHigh: [],
};

console.log("Case 1: supportHigh=[national], supportMid=[ideological], rest=neutral");
console.log("Pre-state:");
console.log(`  trbAnchor.touches = ${state.trbAnchor.touches}`);
console.log(`  trbAnchor.dist (national) = ${state.trbAnchor.dist[0]?.toFixed(4)}`);
console.log(`  moralCircle.affinity = ${state.moralCircle?.affinity === null ? "null" : "non-null"}`);
console.log("");

applyPrioritySort(state, q60, placements, allItems);

console.log("Post-state:");
console.log(`  trbAnchor.touches = ${state.trbAnchor.touches}`);
const nationalIdx = TRB_ANCHOR_ORDER.indexOf("national");
const ideologicalIdx = TRB_ANCHOR_ORDER.indexOf("ideological");
const dNational = state.trbAnchor.dist[nationalIdx] ?? 0;
const dIdeological = state.trbAnchor.dist[ideologicalIdx] ?? 0;
console.log(`  trbAnchor.dist[national]    = ${dNational.toFixed(4)}`);
console.log(`  trbAnchor.dist[ideological] = ${dIdeological.toFixed(4)}`);
const aff = state.moralCircle?.affinity;
console.log(`  moralCircle.affinity = ${aff === null || aff === undefined ? "null" : "materialized"}`);
if (aff) {
  console.log(`  moralCircle.universal = ${aff.universalAffinity}`);
  console.log(`  moralCircle.scopedAffinities.national = ${aff.scopedAffinities.national}`);
  console.log(`  moralCircle.scopedAffinities.ideological = ${aff.scopedAffinities.ideological}`);
  console.log(`  moralCircle.scopedAffinities.religious = ${aff.scopedAffinities.religious}`);
}
console.log("");

check(
  "trbAnchor.touches incremented",
  state.trbAnchor.touches >= 1,
  `expected >=1, got ${state.trbAnchor.touches}`,
);
check(
  "trbAnchor.dist[national] is the largest slot",
  dNational > Math.max(...state.trbAnchor.dist.filter((_, i) => i !== nationalIdx)),
  `national=${dNational.toFixed(4)} vs others max=${Math.max(...state.trbAnchor.dist.filter((_, i) => i !== nationalIdx)).toFixed(4)}`,
);
check(
  "trbAnchor.dist[national] > trbAnchor.dist[ideological] (supportHigh > supportMid)",
  dNational > dIdeological,
  `national=${dNational.toFixed(4)} vs ideological=${dIdeological.toFixed(4)}`,
);
check(
  "moralCircle.affinity materialized",
  aff !== null && aff !== undefined,
  aff === null || aff === undefined ? "still null" : "non-null",
);
if (aff) {
  check(
    "moralCircle.scopedAffinities.national raised above 50",
    (aff.scopedAffinities.national ?? 0) > 50,
    `national=${aff.scopedAffinities.national}`,
  );
  check(
    "moralCircle.scopedAffinities.religious not touched (stays null)",
    aff.scopedAffinities.religious === null,
    `religious=${aff.scopedAffinities.religious}`,
  );
  // P1 weighting: supportHigh national should produce a stronger signal than
  // supportMid ideological. Pre-fix both came out at 70 (raw value passed
  // through). Post-fix: national stays at 70, ideological blends to 60.
  check(
    "supportHigh national > supportMid ideological (P1 weighting)",
    (aff.scopedAffinities.national ?? 0) > (aff.scopedAffinities.ideological ?? 0),
    `national=${aff.scopedAffinities.national} vs ideological=${aff.scopedAffinities.ideological}`,
  );
  check(
    "supportHigh national stays at declared value (~70)",
    Math.abs((aff.scopedAffinities.national ?? 0) - 70) < 0.5,
    `national=${aff.scopedAffinities.national}, expected ~70`,
  );
  check(
    "supportMid ideological is half-blended toward neutral (~60)",
    Math.abs((aff.scopedAffinities.ideological ?? 0) - 60) < 0.5,
    `ideological=${aff.scopedAffinities.ideological}, expected ~60`,
  );
}

// ---- Case 2: global_citizen in supportHigh boosts universalAffinity, no scoped touched ----
const state2 = makeEmptyState();
const placements2 = {
  supportHigh: ["global_citizen"],
  supportMid: [],
  neutral: ["national_identity", "ideological_identity", "religious_identity", "class_identity", "ethnic_racial_identity", "gender_identity"],
  opposeHigh: [],
};

console.log("");
console.log("Case 2: supportHigh=[global_citizen], rest=neutral");
applyPrioritySort(state2, q60, placements2, allItems);
const aff2 = state2.moralCircle?.affinity;
if (aff2) {
  console.log(`  moralCircle.universal = ${aff2.universalAffinity}`);
  console.log(`  moralCircle.scopedAffinities.national = ${aff2.scopedAffinities.national}`);
  check(
    "global_citizen raises universalAffinity above default 50",
    aff2.universalAffinity > 50,
    `universal=${aff2.universalAffinity}`,
  );
  check(
    "global_citizen does NOT touch national scope",
    aff2.scopedAffinities.national === null,
    `national=${aff2.scopedAffinities.national}`,
  );
}

// ---- Case 3: opposeHigh + neutral only → no anchor evidence (skip semantics) ----
const state3 = makeEmptyState();
const placements3 = {
  supportHigh: [],
  supportMid: [],
  neutral: ["national_identity", "religious_identity", "class_identity", "ethnic_racial_identity", "gender_identity", "global_citizen"],
  opposeHigh: ["ideological_identity"],
};

console.log("");
console.log("Case 3: opposeHigh=[ideological], rest=neutral (should NOT produce anchor evidence)");
applyPrioritySort(state3, q60, placements3, allItems);
console.log(`  trbAnchor.touches = ${state3.trbAnchor.touches}`);
console.log(`  moralCircle.affinity = ${state3.moralCircle?.affinity === null ? "null" : "materialized"}`);

check(
  "opposeHigh-only run: no trbAnchor touches",
  state3.trbAnchor.touches === 0,
  `expected 0, got ${state3.trbAnchor.touches}`,
);
check(
  "opposeHigh-only run: moralCircle.affinity stays null",
  state3.moralCircle?.affinity === null,
  state3.moralCircle?.affinity === null ? "null" : "materialized (unexpected)",
);

console.log("");
const failed = results.filter(r => !r.passed);
if (failed.length === 0) {
  console.log(`ALL ${results.length} CHECKS PASSED`);
  process.exit(0);
} else {
  console.log(`${failed.length} of ${results.length} CHECKS FAILED:`);
  for (const f of failed) console.log(`  - ${f.name}: ${f.detail}`);
  process.exit(1);
}
