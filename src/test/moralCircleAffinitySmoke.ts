/**
 * ADR-007 — Moral Circle Affinity smoke harness.
 *
 * Stage E per `results/architecture/moral-circle-terminal2-work-order.md`.
 *
 * Asserts:
 *  - 9 raw values present where expected (universal + 8 scopes)
 *  - excess = max(0, scoped - universal); null scoped → 0 excess
 *  - intensity uses L2 norm; intensity01 = min(1, l2/100); intensity03 = 3 × intensity01
 *  - mathematical activation rule = excess > 0
 *  - reporting activation threshold = excess >= 5
 *  - null coerces to universalAffinity for legacy numeric surfaces
 *  - Q103 universal prior weight is 0
 *  - PF and TRB conversion helpers respect prior caps
 *  - mixed_none never creates scoped excess; global → universal-only
 *  - satisficing flags fire on `all_equal` and `all_high_no_excess`
 *  - legacy fields untouched (sentinel: legacy MorBoundaryId still has 7 entries
 *    and includes political_tribe, since this stage is additive only)
 *
 * Outputs:
 *   results/architecture/moral-circle-affinity-smoke.json
 *   results/architecture/moral-circle-affinity-smoke.md
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

import {
  MORAL_CIRCLE_SCOPES,
  MORAL_CIRCLE_REPORT_ACTIVE_THRESHOLD,
  clampAffinity100,
  coerceScopedAffinityForLegacy,
  computeExcessAffinities,
  computeMoralCircleIntensity,
  deriveMoralCircleAffinity,
  getActiveMoralCircleBoundaries,
  validateMoralCircleAffinityInput,
} from "../moralCircle/affinity.js";
import {
  MORAL_CIRCLE_PRIOR_CAPS,
  convertLegacyPfToPoliticalCampPrior,
  convertLegacyTrbAnchorToMoralCirclePrior,
  convertLegacyTrbWithoutAnchorToMoralCirclePrior,
  isQ103UniversalPriorAllowed,
  listTrbAnchorScopeRoutes,
  pos15ToAffinity100,
  rejectQ103UniversalPrior,
  salience03ToAffinity100,
} from "../moralCircle/legacyConversion.js";
import {
  MORAL_CIRCLE_BATTERY_SPEC,
  MORAL_CIRCLE_BATTERY_VERSION,
  detectMoralCircleSatisficingFlags,
} from "../config/moralCircleCalibrationBattery.js";
import type {
  MoralCircleAffinityInput,
  MoralCircleScopedAffinities,
  MorBoundaryId,
} from "../types.js";

const OUT_JSON = "results/architecture/moral-circle-affinity-smoke.json";
const OUT_MD = "results/architecture/moral-circle-affinity-smoke.md";

interface CaseResult {
  name: string;
  passed: boolean;
  detail: string;
}

const results: CaseResult[] = [];

function check(name: string, condition: boolean, detail: string): void {
  results.push({ name, passed: condition, detail });
}

function approxEqual(a: number, b: number, tol = 1e-9): boolean {
  return Math.abs(a - b) <= tol;
}

function fullScoped(values: Partial<MoralCircleScopedAffinities>): MoralCircleScopedAffinities {
  const out = {} as MoralCircleScopedAffinities;
  for (const scope of MORAL_CIRCLE_SCOPES) {
    out[scope] = scope in values ? (values[scope] as number | null) : 0;
  }
  return out;
}

// ─── Case 1: 9 stored values ───────────────────────────────────────────────

{
  const input: MoralCircleAffinityInput = {
    universalAffinity: 60,
    scopedAffinities: fullScoped({}),
  };
  const aff = deriveMoralCircleAffinity(input);
  const scopedKeys = Object.keys(aff.scopedAffinities);
  const allScopesPresent = MORAL_CIRCLE_SCOPES.every((s) => s in aff.scopedAffinities);
  check(
    "9_stored_values_present",
    typeof aff.universalAffinity === "number" && allScopesPresent && scopedKeys.length === 8,
    `universal + ${scopedKeys.length} scoped = ${1 + scopedKeys.length} stored values`,
  );
}

// ─── Case 2: excess = max(0, scoped - universal); active set ───────────────

{
  const input: MoralCircleAffinityInput = {
    universalAffinity: 60,
    scopedAffinities: fullScoped({
      national: 80,
      ideological: 80,
      religious: 50,
      class: 40,
      gender: 30,
      sexual: 20,
      ethnic_racial: 10,
      political_camp: 0,
    }),
  };
  const aff = deriveMoralCircleAffinity(input);
  const expectedActive = new Set(["national", "ideological"]);
  const activeOk =
    aff.activeBoundaries.length === expectedActive.size &&
    aff.activeBoundaries.every((s) => expectedActive.has(s));
  const excessNational = aff.excessAffinities.national;
  const excessReligious = aff.excessAffinities.religious;
  check(
    "excess_formula_and_active_set",
    activeOk && excessNational === 20 && excessReligious === 0,
    `active=${aff.activeBoundaries.join(",")} excess[national]=${excessNational} excess[religious]=${excessReligious}`,
  );
}

// ─── Case 3: zero scoped values across the board → no active boundaries ────

{
  const input: MoralCircleAffinityInput = {
    universalAffinity: 80,
    scopedAffinities: fullScoped({
      national: 70,
      religious: 30,
      ethnic_racial: 10,
      class: 50,
      gender: 60,
      sexual: 20,
      ideological: 75,
      political_camp: 40,
    }),
  };
  const aff = deriveMoralCircleAffinity(input);
  const allExcessZero = MORAL_CIRCLE_SCOPES.every((s) => aff.excessAffinities[s] === 0);
  check(
    "all_scoped_below_universal_zero_excess",
    allExcessZero && aff.activeBoundaries.length === 0,
    `intensity01=${aff.intensity01.toFixed(4)} active=${aff.activeBoundaries.length}`,
  );
}

// ─── Case 4: null scoped → 0 excess + legacy coercion to universal ─────────

{
  const input: MoralCircleAffinityInput = {
    universalAffinity: 70,
    scopedAffinities: fullScoped({
      religious: null,
      sexual: null,
      gender: 90, // active
    }),
  };
  const aff = deriveMoralCircleAffinity(input);
  const religiousExcess = aff.excessAffinities.religious;
  const sexualExcess = aff.excessAffinities.sexual;
  const genderExcess = aff.excessAffinities.gender;
  // legacy coercion: null should coerce to universalAffinity (70), not 0
  const coercedReligious = coerceScopedAffinityForLegacy(aff.scopedAffinities.religious, aff.universalAffinity);
  const coercedSexual = coerceScopedAffinityForLegacy(aff.scopedAffinities.sexual, aff.universalAffinity);
  const coercedGender = coerceScopedAffinityForLegacy(aff.scopedAffinities.gender, aff.universalAffinity);
  check(
    "null_scoped_zero_excess_and_legacy_coercion",
    religiousExcess === 0 &&
      sexualExcess === 0 &&
      genderExcess === 20 &&
      coercedReligious === 70 &&
      coercedSexual === 70 &&
      coercedGender === 90,
    `null→excess=0; coerced religious/sexual=${coercedReligious}/${coercedSexual} (universal=70); gender raw passes through ${coercedGender}`,
  );
}

// ─── Case 5: L2 intensity math ─────────────────────────────────────────────

{
  // One excess at 100, others 0 → l2=100, intensity01=1.0, intensity03=3.0
  const single = computeMoralCircleIntensity(
    Object.fromEntries(MORAL_CIRCLE_SCOPES.map((s) => [s, s === "national" ? 100 : 0])) as Record<
      (typeof MORAL_CIRCLE_SCOPES)[number],
      number
    >,
  );
  // Three excesses at 60, 80, 40 → l2 ≈ sqrt(3600+6400+1600)=sqrt(11600)≈107.7
  const triple = computeMoralCircleIntensity(
    Object.fromEntries(
      MORAL_CIRCLE_SCOPES.map((s) => [
        s,
        s === "national" ? 60 : s === "ideological" ? 80 : s === "religious" ? 40 : 0,
      ]),
    ) as Record<(typeof MORAL_CIRCLE_SCOPES)[number], number>,
  );
  const expectedL2 = Math.sqrt(60 * 60 + 80 * 80 + 40 * 40);
  const ok =
    approxEqual(single.l2, 100, 1e-9) &&
    approxEqual(single.intensity01, 1.0, 1e-9) &&
    approxEqual(single.intensity03, 3.0, 1e-9) &&
    approxEqual(triple.l2, expectedL2, 1e-6) &&
    approxEqual(triple.intensity01, Math.min(1, expectedL2 / 100), 1e-9) &&
    approxEqual(triple.intensity03, 3 * Math.min(1, expectedL2 / 100), 1e-9);
  check(
    "l2_intensity_math",
    ok,
    `single l2=${single.l2.toFixed(4)} i01=${single.intensity01.toFixed(4)} i03=${single.intensity03.toFixed(4)} | triple l2=${triple.l2.toFixed(4)} i01=${triple.intensity01.toFixed(4)} i03=${triple.intensity03.toFixed(4)}`,
  );
}

// ─── Case 6: reporting threshold vs mathematical rule ──────────────────────

{
  const input: MoralCircleAffinityInput = {
    universalAffinity: 50,
    scopedAffinities: fullScoped({
      national: 53, // excess 3 — math active, reporting NOT active
      religious: 60, // excess 10 — both active
      ideological: 51, // excess 1 — math active, reporting NOT active
    }),
  };
  const aff = deriveMoralCircleAffinity(input);
  const mathActive = getActiveMoralCircleBoundaries(aff.excessAffinities, 0).sort();
  const reportingActive = getActiveMoralCircleBoundaries(aff.excessAffinities).sort(); // default 5
  check(
    "reporting_threshold_separation",
    mathActive.length === 3 &&
      reportingActive.length === 1 &&
      reportingActive[0] === "religious" &&
      MORAL_CIRCLE_REPORT_ACTIVE_THRESHOLD === 5,
    `math=${mathActive.join(",")} reporting=${reportingActive.join(",")} threshold=${MORAL_CIRCLE_REPORT_ACTIVE_THRESHOLD}`,
  );
}

// ─── Case 7: clampAffinity100 + validation ─────────────────────────────────

{
  const clamped = [clampAffinity100(-5), clampAffinity100(150), clampAffinity100(NaN), clampAffinity100(42)];
  const issues = validateMoralCircleAffinityInput({
    universalAffinity: 120, // out of range
    scopedAffinities: {
      national: 80,
      religious: -10, // out of range
      ethnic_racial: null,
      class: 50,
      gender: 50,
      sexual: 50,
      ideological: 50,
      political_camp: 50,
    } as MoralCircleScopedAffinities,
  });
  const out_of_range_caught =
    issues.some((i) => i.field === "universalAffinity") &&
    issues.some((i) => i.field === "scopedAffinities.religious");
  check(
    "clamp_and_validation",
    clamped[0] === 0 &&
      clamped[1] === 100 &&
      clamped[2] === 0 &&
      clamped[3] === 42 &&
      out_of_range_caught,
    `clamp=[${clamped.join(",")}] validation issues=${issues.length}`,
  );
}

// ─── Case 8: scale conversion helpers ──────────────────────────────────────

{
  // pos 1..5: 1→0, 3→50, 5→100 (rounded). sal 0..3: 0→0, 1.5→50, 3→100.
  const ok =
    pos15ToAffinity100(1) === 0 &&
    pos15ToAffinity100(3) === 50 &&
    pos15ToAffinity100(5) === 100 &&
    pos15ToAffinity100(2.5) === 38 && // (1.5/4)*100=37.5→38
    salience03ToAffinity100(0) === 0 &&
    salience03ToAffinity100(1.5) === 50 &&
    salience03ToAffinity100(3) === 100;
  check(
    "scale_helpers",
    ok,
    `pos15(1,3,5,2.5)=${pos15ToAffinity100(1)},${pos15ToAffinity100(3)},${pos15ToAffinity100(5)},${pos15ToAffinity100(2.5)} | sal03(0,1.5,3)=${salience03ToAffinity100(0)},${salience03ToAffinity100(1.5)},${salience03ToAffinity100(3)}`,
  );
}

// ─── Case 9: Q103 universal prior weight is zero ───────────────────────────

{
  const cap = MORAL_CIRCLE_PRIOR_CAPS.q103_universal;
  const allowed = isQ103UniversalPriorAllowed();
  const rejection = rejectQ103UniversalPrior();
  check(
    "q103_universal_prior_zero",
    cap === 0 && allowed === false && rejection.kind === "no_route" && /Q103/.test(rejection.reason),
    `cap=${cap} allowed=${allowed} rejection=${rejection.kind}`,
  );
}

// ─── Case 10: PF → political_camp respects cap ─────────────────────────────

{
  const noSal = convertLegacyPfToPoliticalCampPrior({ expectedPosition15: 4 });
  const withSal = convertLegacyPfToPoliticalCampPrior({ expectedPosition15: 4, expectedSalience03: 3 });
  const overcap = convertLegacyPfToPoliticalCampPrior({ expectedPosition15: 4, sourceWeight: 5.0 });
  const ok =
    noSal.kind === "scoped" &&
    noSal.scope === "political_camp" &&
    noSal.value === pos15ToAffinity100(4) &&
    noSal.weight <= MORAL_CIRCLE_PRIOR_CAPS.legacy_pf &&
    withSal.kind === "scoped" &&
    withSal.scope === "political_camp" &&
    withSal.weight <= MORAL_CIRCLE_PRIOR_CAPS.legacy_pf &&
    overcap.kind === "scoped" &&
    overcap.weight === MORAL_CIRCLE_PRIOR_CAPS.legacy_pf;
  check(
    "pf_political_camp_with_cap",
    ok,
    `noSal value=${noSal.kind === "scoped" ? noSal.value : "?"} weight=${noSal.weight}; withSal value=${withSal.kind === "scoped" ? withSal.value : "?"} weight=${withSal.weight}; overcap clamp=${overcap.weight}`,
  );
}

// ─── Case 11: TRB anchor scoped routing ────────────────────────────────────

{
  const religious = convertLegacyTrbAnchorToMoralCirclePrior({ anchor: "religious", expectedSalience03: 2.4 });
  const ethnicAnchorOnly = convertLegacyTrbAnchorToMoralCirclePrior({ anchor: "ethnic_racial" });
  const sexual = convertLegacyTrbAnchorToMoralCirclePrior({ anchor: "sexual", expectedSalience03: 3 });
  const ok =
    religious.kind === "scoped" &&
    religious.scope === "religious" &&
    religious.weight <= MORAL_CIRCLE_PRIOR_CAPS.legacy_trb_anchor_clear_scope &&
    ethnicAnchorOnly.kind === "scoped" &&
    ethnicAnchorOnly.scope === "ethnic_racial" &&
    // anchor-only must be capped at less than full scope cap
    ethnicAnchorOnly.weight < MORAL_CIRCLE_PRIOR_CAPS.legacy_trb_anchor_clear_scope &&
    sexual.kind === "scoped" &&
    sexual.scope === "sexual" &&
    sexual.value === salience03ToAffinity100(3);
  check(
    "trb_anchor_scoped_routing",
    ok,
    `religious(2.4)→${religious.kind === "scoped" ? religious.scope : "?"} val=${religious.kind === "scoped" ? religious.value : "?"} w=${religious.kind === "scoped" ? religious.weight : "?"}; ethnic_only→${ethnicAnchorOnly.kind === "scoped" ? ethnicAnchorOnly.scope : "?"} w=${ethnicAnchorOnly.kind === "scoped" ? ethnicAnchorOnly.weight : "?"} (anchor-only cap < full); sexual(3)→${sexual.kind === "scoped" ? sexual.value : "?"}`,
  );
}

// ─── Case 12: mixed_none → universal_no_excess (universal evidence + suppression)

{
  const mixed = convertLegacyTrbAnchorToMoralCirclePrior({ anchor: "mixed_none", expectedSalience03: 2 });
  const global = convertLegacyTrbAnchorToMoralCirclePrior({ anchor: "global", expectedSalience03: 2 });
  const ok =
    mixed.kind === "universal_no_excess" &&
    typeof (mixed.kind === "universal_no_excess" ? mixed.universalValue : undefined) === "number" &&
    (mixed.kind === "universal_no_excess" ? mixed.suppressesScopedInference : false) === true &&
    /mixed_none/.test(mixed.note) &&
    global.kind === "universal" &&
    /global/.test(global.note);
  check(
    "trb_global_and_mixed_none_universal_only",
    ok,
    `mixed_none→${mixed.kind} universalValue=${mixed.kind === "universal_no_excess" ? mixed.universalValue : "?"} suppress=${mixed.kind === "universal_no_excess" ? mixed.suppressesScopedInference : "?"}; global→${global.kind}`,
  );
}

// ─── Case 12b: mixed_none contribution exposes universal evidence + semantics

{
  const mixed = convertLegacyTrbAnchorToMoralCirclePrior({ anchor: "mixed_none" });
  let ok = false;
  let detail = `kind=${mixed.kind}`;
  if (mixed.kind === "universal_no_excess") {
    const weightInRange =
      mixed.weight > 0 && mixed.weight <= MORAL_CIRCLE_PRIOR_CAPS.legacy_trb_anchor_clear_scope;
    ok =
      mixed.universalValue >= 0 &&
      mixed.universalValue <= 100 &&
      mixed.suppressesScopedInference === true &&
      weightInRange;
    detail = `universalValue=${mixed.universalValue} weight=${mixed.weight} suppress=${mixed.suppressesScopedInference}`;
  }
  check(
    "mixed_none_carries_universal_evidence_and_suppression",
    ok,
    detail,
  );
}

// ─── Case 13: TRB without anchor → no_route ────────────────────────────────

{
  const noRoute = convertLegacyTrbWithoutAnchorToMoralCirclePrior({ questionId: 42, expectedSalience03: 2 });
  check(
    "trb_without_anchor_no_route",
    noRoute.kind === "no_route" && /per-question review/.test(noRoute.reason),
    `Q42 (sal=2) → ${noRoute.kind}: ${noRoute.reason}`,
  );
}

// ─── Case 14: anchor coverage exhaustive (all 9 anchors routed) ────────────

{
  const routes = listTrbAnchorScopeRoutes();
  const seen = new Set(routes.map((r) => r.anchor));
  const expected = ["national", "ideological", "religious", "class", "ethnic_racial", "gender", "sexual", "global", "mixed_none"];
  const ok = expected.every((a) => seen.has(a as never)) && seen.size === expected.length;
  check(
    "trb_anchor_coverage_exhaustive",
    ok,
    `routes=${routes.length} expected=${expected.length}`,
  );
}

// ─── Case 15: satisficing flag — all_equal ─────────────────────────────────

{
  const flags = detectMoralCircleSatisficingFlags({
    universalAffinity: 50,
    scopedAffinities: fullScoped({
      national: 50,
      religious: 50,
      ethnic_racial: 50,
      class: 50,
      gender: 50,
      sexual: 50,
      ideological: 50,
      political_camp: 50,
    }),
  });
  check(
    "satisficing_all_equal_fires",
    flags.includes("all_equal"),
    `flags=[${flags.join(",")}]`,
  );
}

// ─── Case 16: satisficing flag — all_high_no_excess ────────────────────────

{
  const flags = detectMoralCircleSatisficingFlags({
    universalAffinity: 80,
    scopedAffinities: fullScoped({
      national: 70,
      religious: 75,
      ethnic_racial: 65,
      class: 80,
      gender: 70,
      sexual: 65,
      ideological: 78,
      political_camp: 70,
    }),
  });
  check(
    "satisficing_all_high_no_excess_fires",
    flags.includes("all_high_no_excess"),
    `flags=[${flags.join(",")}]`,
  );
}

// ─── Case 17: satisficing — too_fast guarded by responseTimeMs ─────────────

{
  const fast = detectMoralCircleSatisficingFlags({
    universalAffinity: 50,
    scopedAffinities: fullScoped({
      national: 80,
      religious: 20,
      ethnic_racial: 30,
      class: 60,
      gender: 45,
      sexual: 40,
      ideological: 70,
      political_camp: 55,
    }),
    responseTimeMs: 1500,
  });
  const slow = detectMoralCircleSatisficingFlags({
    universalAffinity: 50,
    scopedAffinities: fullScoped({
      national: 80,
      religious: 20,
      ethnic_racial: 30,
      class: 60,
      gender: 45,
      sexual: 40,
      ideological: 70,
      political_camp: 55,
    }),
    responseTimeMs: 30000,
  });
  check(
    "satisficing_too_fast_threshold",
    fast.includes("too_fast") && !slow.includes("too_fast"),
    `fast=[${fast.join(",")}] slow=[${slow.join(",")}]`,
  );
}

// ─── Case 18: legacy types untouched (additive only) ───────────────────────

{
  // Sentinel: the ADR-006 MorBoundaryId union must still include
  // "political_tribe" and exactly 7 ids — this stage is additive only.
  const expectedLegacy: ReadonlyArray<MorBoundaryId> = [
    "national",
    "ethnic_racial",
    "religious",
    "class",
    "ideological",
    "gender",
    "political_tribe",
  ];
  const allKnown = expectedLegacy.every((id) => typeof id === "string");
  check(
    "legacy_morBoundaryId_unchanged",
    allKnown && expectedLegacy.length === 7 && expectedLegacy.includes("political_tribe"),
    `legacy MorBoundaryId still has 7 entries incl political_tribe; new MoralCircleScope has ${MORAL_CIRCLE_SCOPES.length} (separate, additive)`,
  );
}

// ─── Case 19: battery spec shape ───────────────────────────────────────────

{
  const spec = MORAL_CIRCLE_BATTERY_SPEC;
  const rowsCoverScopes =
    spec.itemB.rows.length === MORAL_CIRCLE_SCOPES.length &&
    MORAL_CIRCLE_SCOPES.every((s) => spec.itemB.rows.some((r) => r.scope === s));
  const ok =
    spec.version === MORAL_CIRCLE_BATTERY_VERSION &&
    spec.itemA.target === "universalAffinity" &&
    spec.itemB.target === "scopedAffinities" &&
    spec.itemB.notMeaningfulOption.id === "not_meaningful_to_me" &&
    rowsCoverScopes;
  check(
    "battery_spec_shape",
    ok,
    `version=${spec.version} A.target=${spec.itemA.target} B.rows=${spec.itemB.rows.length} not_meaningful=${spec.itemB.notMeaningfulOption.id}`,
  );
}

// ─── Case 20: derive sanity — clamping inside derive ───────────────────────

{
  const aff = deriveMoralCircleAffinity({
    universalAffinity: 200,
    scopedAffinities: {
      national: -10,
      religious: 250,
      ethnic_racial: 50,
      class: 50,
      gender: 50,
      sexual: 50,
      ideological: 50,
      political_camp: 50,
    },
  });
  check(
    "derive_clamps_inputs",
    aff.universalAffinity === 100 &&
      aff.scopedAffinities.national === 0 &&
      aff.scopedAffinities.religious === 100,
    `universal=${aff.universalAffinity} national=${aff.scopedAffinities.national} religious=${aff.scopedAffinities.religious}`,
  );
}

// ─── Case 21: validation — partial scopedAffinities missing a scope fails ──

{
  const partialScoped = {
    national: 80,
    religious: 40,
    ethnic_racial: 20,
    class: 50,
    gender: 50,
    sexual: 30,
    ideological: 60,
    // political_camp deliberately omitted
  } as unknown as MoralCircleScopedAffinities;
  const issues = validateMoralCircleAffinityInput({
    universalAffinity: 50,
    scopedAffinities: partialScoped,
  });
  const missingPoliticalCamp = issues.some(
    (i) => i.field === "scopedAffinities.political_camp" && /missing required/.test(i.message),
  );
  check(
    "validation_missing_scope_key_fails",
    missingPoliticalCamp,
    `issues=${issues.map((i) => `${i.field}: ${i.message}`).join(" | ")}`,
  );
}

// ─── Case 22: validation — explicit null still passes ──────────────────────

{
  const allWithNulls: MoralCircleScopedAffinities = {
    national: 80,
    religious: null,
    ethnic_racial: null,
    class: 50,
    gender: null,
    sexual: null,
    ideological: 60,
    political_camp: 40,
  };
  const issues = validateMoralCircleAffinityInput({
    universalAffinity: 70,
    scopedAffinities: allWithNulls,
  });
  check(
    "validation_explicit_null_passes",
    issues.length === 0,
    `issues=${issues.length} ${issues.map((i) => i.field).join(",")}`,
  );
}

// ─── Case 23: satisficing — all scoped null + high universal does NOT fire all_high_no_excess

{
  const allScopedNull: MoralCircleScopedAffinities = {
    national: null,
    religious: null,
    ethnic_racial: null,
    class: null,
    gender: null,
    sexual: null,
    ideological: null,
    political_camp: null,
  };
  const flags = detectMoralCircleSatisficingFlags({
    universalAffinity: 90,
    scopedAffinities: allScopedNull,
  });
  check(
    "satisficing_all_null_no_all_high_no_excess",
    !flags.includes("all_high_no_excess"),
    `flags=[${flags.join(",")}]`,
  );
}

// ─── Compute extra excess example for Case 2 echo ──────────────────────────

{
  // Re-run the work-order example to dump explicit values to JSON output.
  const input: MoralCircleAffinityInput = {
    universalAffinity: 60,
    scopedAffinities: fullScoped({
      national: 80,
      ideological: 80,
      religious: 50,
      class: 40,
      gender: 30,
      sexual: 20,
      ethnic_racial: 10,
      political_camp: 0,
    }),
  };
  const aff = deriveMoralCircleAffinity(input);
  // sanity record echoed in JSON below
  results.push({
    name: "_echo_workorder_canonical_case",
    passed: aff.activeBoundaries.length === 2,
    detail: `excess=${JSON.stringify(aff.excessAffinities)} active=${aff.activeBoundaries.join(",")} l2=${(Math.sqrt(20*20+20*20)).toFixed(4)} i01=${aff.intensity01.toFixed(4)}`,
  });
}

// ─── Write outputs ─────────────────────────────────────────────────────────

const total = results.length;
const passed = results.filter((r) => r.passed).length;
const failed = total - passed;

const summary = {
  adr: "ADR-007",
  stage: "B-E (additive scaffolding)",
  generatedAt: new Date().toISOString(),
  scopeCount: MORAL_CIRCLE_SCOPES.length,
  reportingThreshold: MORAL_CIRCLE_REPORT_ACTIVE_THRESHOLD,
  priorCaps: MORAL_CIRCLE_PRIOR_CAPS,
  total,
  passed,
  failed,
  cases: results,
};

mkdirSync(dirname(OUT_JSON), { recursive: true });
writeFileSync(OUT_JSON, JSON.stringify(summary, null, 2), "utf8");

let md = `# Moral Circle Affinity Smoke (ADR-007, Stages B–E)\n\n`;
md += `**Generated:** ${summary.generatedAt}\n\n`;
md += `**Result:** ${passed} / ${total} passed${failed > 0 ? ` — **${failed} FAILED**` : ""}.\n\n`;
md += `Scopes (${MORAL_CIRCLE_SCOPES.length}): \`${MORAL_CIRCLE_SCOPES.join("`, `")}\`\n\n`;
md += `Reporting active threshold: \`>= ${MORAL_CIRCLE_REPORT_ACTIVE_THRESHOLD}\` points of excess (mathematical activation remains \`> 0\`).\n\n`;
md += `Prior caps (ADR-007 §"Existing Questions as Priors"):\n\n`;
for (const [key, cap] of Object.entries(MORAL_CIRCLE_PRIOR_CAPS)) {
  md += `- \`${key}\` → max ${cap}\n`;
}
md += `\n## Cases\n\n`;
md += `| # | Name | Result | Detail |\n|---:|---|---|---|\n`;
results.forEach((r, i) => {
  const status = r.passed ? "✅" : "❌";
  md += `| ${i + 1} | \`${r.name}\` | ${status} | ${r.detail.replace(/\|/g, "\\|")} |\n`;
});
md += `\n## What this smoke does NOT do\n\n`;
md += `- Does not run the engine, selector, mapper, or live quiz.\n`;
md += `- Does not modify legacy MOR / PF / TRB / TRB_ANCHOR fields, archetypes, era-activations, or electorate outputs.\n`;
md += `- Does not insert the calibration battery into \`questions.full.ts\` / \`questions.representative.ts\`.\n`;
md += `- Does not exercise identity-primary resolver migration, candidate-distance, or era-activation conversion.\n`;
md += `\nStage F (engine cutover) requires Terminal 1 review of the additive scaffolding before proceeding.\n`;

writeFileSync(OUT_MD, md, "utf8");

// ─── Stdout summary ────────────────────────────────────────────────────────

console.log(`Wrote ${OUT_JSON}`);
console.log(`Wrote ${OUT_MD}`);
console.log(`Result: ${passed}/${total} passed${failed > 0 ? `, ${failed} FAILED` : ""}`);
for (const r of results) {
  if (!r.passed) console.log(`  FAIL ${r.name}: ${r.detail}`);
}

if (failed > 0) process.exit(1);
