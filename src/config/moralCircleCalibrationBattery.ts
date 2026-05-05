/**
 * ADR-007 — Moral Circle Affinity Calibration Battery (spec only).
 *
 * Stage C per `results/architecture/moral-circle-terminal2-work-order.md`.
 *
 * This file is a SPEC artifact. It is NOT inserted into
 * `questions.full.ts` / `questions.representative.ts`, and is NOT consumed by
 * the live selector or quiz UI in this stage. Insertion into the live bank
 * requires explicit Terminal 1 approval in a later pass.
 *
 * Battery shape per ADR-007 §"Calibration Battery": split into two parts to
 * reduce satisficing relative to a single 9-row grid.
 */

import { MORAL_CIRCLE_SCOPES } from "../moralCircle/affinity.js";
import type { MoralCircleScope } from "../types.js";

export const MORAL_CIRCLE_BATTERY_VERSION = "v0";

export interface MoralCircleBatteryItemA {
  id: "moral_circle_universal_baseline";
  uiType: "slider";
  prompt: string;
  /** Inclusive 0..100 endpoints. */
  scaleMin: 0;
  scaleMax: 100;
  scaleAnchors: { value: number; label: string }[];
  /** Maps directly onto MoralCircleAffinityInput.universalAffinity. */
  target: "universalAffinity";
}

export interface MoralCircleBatteryRow {
  scope: MoralCircleScope;
  /** Respondent-facing description of the group. */
  rowLabel: string;
  /** Optional short label for grids that need a tighter wording. */
  shortLabel: string;
}

export interface MoralCircleBatteryItemB {
  id: "moral_circle_scoped_battery";
  /** Same 0..100 scale per row; "not meaningful to me" allowed per row. */
  uiType: "scoped_grid";
  prompt: string;
  scaleMin: 0;
  scaleMax: 100;
  scaleAnchors: { value: number; label: string }[];
  /**
   * Per-row "not meaningful to me" option. Encoded as null on the
   * MoralCircleAffinityInput.scopedAffinities map.
   */
  notMeaningfulOption: { id: "not_meaningful_to_me"; label: string };
  rows: MoralCircleBatteryRow[];
  /** Each row maps to MoralCircleAffinityInput.scopedAffinities[row.scope]. */
  target: "scopedAffinities";
}

export interface MoralCircleBatterySpec {
  version: typeof MORAL_CIRCLE_BATTERY_VERSION;
  itemA: MoralCircleBatteryItemA;
  itemB: MoralCircleBatteryItemB;
  /**
   * Recommended ordering: universal baseline first, then scoped grid. This is
   * a soft recommendation for question-bank insertion; the live selector
   * decides actual order.
   */
  recommendedOrder: ["itemA", "itemB"];
}

const SHARED_ANCHORS: { value: number; label: string }[] = [
  { value: 0,   label: "no concern" },
  { value: 25,  label: "a little" },
  { value: 50,  label: "moderate" },
  { value: 75,  label: "high" },
  { value: 100, label: "as much as anyone could give" },
];

const ITEM_A: MoralCircleBatteryItemA = {
  id: "moral_circle_universal_baseline",
  uiType: "slider",
  prompt:
    "How much moral concern should politics give to any human being, regardless of where they live or which group they belong to?",
  scaleMin: 0,
  scaleMax: 100,
  scaleAnchors: SHARED_ANCHORS,
  target: "universalAffinity",
};

const SCOPED_ROW_LABELS: Record<MoralCircleScope, { rowLabel: string; shortLabel: string }> = {
  national: {
    rowLabel: "People in my country.",
    shortLabel: "co-nationals",
  },
  religious: {
    rowLabel: "People who share my religious tradition or sacred worldview.",
    shortLabel: "co-religionists",
  },
  ethnic_racial: {
    rowLabel: "People who share my racial or ethnic background or status.",
    shortLabel: "ethnic/racial group",
  },
  class: {
    rowLabel: "People in my economic class or material situation.",
    shortLabel: "economic class",
  },
  gender: {
    rowLabel: "People who share my gender position or gender-linked identity.",
    shortLabel: "gender group",
  },
  sexual: {
    rowLabel: "People who share my sexuality or family-life orientation.",
    shortLabel: "sexuality / family-life",
  },
  ideological: {
    rowLabel: "People who share my core ideology or values.",
    shortLabel: "ideological cohort",
  },
  political_camp: {
    rowLabel: "People on my political side, party, movement, or camp.",
    shortLabel: "political camp",
  },
};

const ITEM_B: MoralCircleBatteryItemB = {
  id: "moral_circle_scoped_battery",
  uiType: "scoped_grid",
  prompt:
    "Using the same scale, how much extra moral concern should politics give to each group when decisions affect them?",
  scaleMin: 0,
  scaleMax: 100,
  scaleAnchors: SHARED_ANCHORS,
  notMeaningfulOption: {
    id: "not_meaningful_to_me",
    label: "Not meaningful to me",
  },
  rows: MORAL_CIRCLE_SCOPES.map((scope) => ({
    scope,
    rowLabel: SCOPED_ROW_LABELS[scope].rowLabel,
    shortLabel: SCOPED_ROW_LABELS[scope].shortLabel,
  })),
  target: "scopedAffinities",
};

export const MORAL_CIRCLE_BATTERY_SPEC: MoralCircleBatterySpec = {
  version: MORAL_CIRCLE_BATTERY_VERSION,
  itemA: ITEM_A,
  itemB: ITEM_B,
  recommendedOrder: ["itemA", "itemB"],
};

// ─── Satisficing flags ─────────────────────────────────────────────────────
// Per ADR-007 §"Satisficing Flags". Recorded for diagnostics; responses are
// not auto-discarded based on flags.

export type MoralCircleSatisficingFlag =
  | "all_equal"
  | "low_variance"
  | "round_number_straightline"
  | "all_high_no_excess"
  | "too_fast";

export interface MoralCircleSatisficingDetectorInput {
  universalAffinity: number;
  scopedAffinities: Record<MoralCircleScope, number | null>;
  /** Optional response time in milliseconds for `too_fast` detection. */
  responseTimeMs?: number;
  /** Threshold below which a response counts as too_fast. UI-instrumentation tunable. */
  tooFastThresholdMs?: number;
}

const DEFAULT_TOO_FAST_THRESHOLD_MS = 4000;
const LOW_VARIANCE_STDDEV_THRESHOLD = 5;
const ROUND_NUMBER_VARIANCE_THRESHOLD = 10;
const ALL_HIGH_THRESHOLD = 60;
const ROUND_NUMBER_VALUES = new Set([0, 25, 50, 75, 100]);

function numericVector(input: MoralCircleSatisficingDetectorInput): number[] {
  // Numeric vector of all 9 values; null scopes coerce to universal for
  // straightlining detection (since the respondent didn't write a number,
  // they aren't straightlining at a value — but for "all_equal" / variance
  // checks we treat null as "no data" via skipping).
  const out: number[] = [input.universalAffinity];
  for (const scope of MORAL_CIRCLE_SCOPES) {
    const v = input.scopedAffinities[scope];
    if (v !== null && v !== undefined) out.push(v);
  }
  return out;
}

function stddev(values: number[]): number {
  if (values.length === 0) return 0;
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((a, b) => a + (b - mean) * (b - mean), 0) / values.length;
  return Math.sqrt(variance);
}

/**
 * Returns the firing satisficing flags for a battery response. Empty array
 * means clean response. Multiple flags can fire simultaneously.
 */
export function detectMoralCircleSatisficingFlags(
  input: MoralCircleSatisficingDetectorInput,
): MoralCircleSatisficingFlag[] {
  const flags: MoralCircleSatisficingFlag[] = [];
  const vec = numericVector(input);

  if (vec.length >= 2 && vec.every((v) => v === vec[0])) {
    flags.push("all_equal");
  }

  const sd = stddev(vec);
  if (vec.length >= 2 && sd < LOW_VARIANCE_STDDEV_THRESHOLD && !flags.includes("all_equal")) {
    flags.push("low_variance");
  }

  if (vec.length >= 2 && vec.every((v) => ROUND_NUMBER_VALUES.has(v)) && sd < ROUND_NUMBER_VARIANCE_THRESHOLD) {
    flags.push("round_number_straightline");
  }

  // all_high_no_excess: requires ALL eight scoped rows answered numerically
  // (no null/missing) with every value high AND every scoped <= universal.
  // Catches "park everything at 80" — produces zero excess everywhere.
  // Skipped scopes do not count as "high" — null/missing means the
  // respondent declined to engage that row, not that they parked it.
  const u = input.universalAffinity;
  const scopedNumericValues: number[] = [];
  let allScopedNumeric = true;
  let scopedAtOrBelowUniversal = true;
  for (const scope of MORAL_CIRCLE_SCOPES) {
    const v = input.scopedAffinities[scope];
    if (v === null || v === undefined) {
      allScopedNumeric = false;
      break;
    }
    scopedNumericValues.push(v);
    if (v > u) scopedAtOrBelowUniversal = false;
  }
  if (allScopedNumeric && scopedNumericValues.length === MORAL_CIRCLE_SCOPES.length) {
    const universalHigh = u >= ALL_HIGH_THRESHOLD;
    const allScopedHigh = scopedNumericValues.every((v) => v >= ALL_HIGH_THRESHOLD);
    if (universalHigh && allScopedHigh && scopedAtOrBelowUniversal) {
      flags.push("all_high_no_excess");
    }
  }

  if (typeof input.responseTimeMs === "number" && Number.isFinite(input.responseTimeMs)) {
    const threshold = input.tooFastThresholdMs ?? DEFAULT_TOO_FAST_THRESHOLD_MS;
    if (input.responseTimeMs < threshold) flags.push("too_fast");
  }

  return flags;
}
