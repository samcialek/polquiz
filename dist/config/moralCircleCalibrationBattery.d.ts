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
import type { MoralCircleScope } from "../types.js";
export declare const MORAL_CIRCLE_BATTERY_VERSION = "v0";
export interface MoralCircleBatteryItemA {
    id: "moral_circle_universal_baseline";
    uiType: "slider";
    prompt: string;
    /** Inclusive 0..100 endpoints. */
    scaleMin: 0;
    scaleMax: 100;
    scaleAnchors: {
        value: number;
        label: string;
    }[];
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
    scaleAnchors: {
        value: number;
        label: string;
    }[];
    /**
     * Per-row "not meaningful to me" option. Encoded as null on the
     * MoralCircleAffinityInput.scopedAffinities map.
     */
    notMeaningfulOption: {
        id: "not_meaningful_to_me";
        label: string;
    };
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
export declare const MORAL_CIRCLE_BATTERY_SPEC: MoralCircleBatterySpec;
export type MoralCircleSatisficingFlag = "all_equal" | "low_variance" | "round_number_straightline" | "all_high_no_excess" | "too_fast";
export interface MoralCircleSatisficingDetectorInput {
    universalAffinity: number;
    scopedAffinities: Record<MoralCircleScope, number | null>;
    /** Optional response time in milliseconds for `too_fast` detection. */
    responseTimeMs?: number;
    /** Threshold below which a response counts as too_fast. UI-instrumentation tunable. */
    tooFastThresholdMs?: number;
}
/**
 * Returns the firing satisficing flags for a battery response. Empty array
 * means clean response. Multiple flags can fire simultaneously.
 */
export declare function detectMoralCircleSatisficingFlags(input: MoralCircleSatisficingDetectorInput): MoralCircleSatisficingFlag[];
