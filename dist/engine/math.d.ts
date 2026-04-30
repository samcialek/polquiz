import type { TrbAnchor, TrbAnchorDist, MorBoundaries, MorBoundaryId, MorBoundariesNodeState, ArchetypeMorBoundaries } from "../types.js";
/**
 * Element-wise multiply two probability arrays and renormalize.
 * Used for Bayesian updates: posterior ∝ prior × likelihood.
 */
export declare function multiplyAndNormalize<T extends number[]>(prior: T, likelihood: T): T;
/**
 * Normalize an array of non-negative numbers to sum to 1.
 * Guards against all-zero arrays by returning uniform distribution.
 */
export declare function normalize<T extends number[]>(arr: T): T;
/**
 * Add weighted signals to the TRB anchor distribution.
 * Positive signals increase that anchor's probability; negative decrease.
 * The result is renormalized.
 */
export declare function addToAnchorDist(current: TrbAnchorDist, signals: Partial<Record<TrbAnchor, number>>): TrbAnchorDist;
/**
 * Canonical 7-boundary order. MUST match `MorBoundaryId` in src/types.ts and
 * `MOR_BOUNDARIES` in src/config/categories.ts. Used by anything that needs
 * positional access to the boundaries object.
 */
export declare const MOR_BOUNDARY_ORDER: MorBoundaryId[];
/** Convert a `MorBoundaries` object to a 7-tuple in canonical order. */
export declare function morBoundariesToVector(b: MorBoundaries): [number, number, number, number, number, number, number];
/** Convert a 7-tuple back to a `MorBoundaries` object. */
export declare function morBoundariesFromVector(v: ArrayLike<number>): MorBoundaries;
/**
 * Default initial MorBoundariesNodeState. Boundaries start at 0.5 — read this
 * as "unknown / no evidence yet," NOT as "moderately bounded." Per ADR-006
 * universalism is encoded as low boundaries + high intensity, so a 0.5 prior
 * is deliberately *not* on the universalist axis; it just means the engine
 * hasn't yet seen evidence to push the score toward 0 or 1. Convex-mix
 * updates from question evidence move boundaries toward their true value
 * over the course of the quiz.
 *
 * Intensity starts at 0 (no activation evidence yet) and only ratchets
 * upward via `bumpMorIntensity` calls.
 */
export declare function mkInitialMorBoundaries(): MorBoundariesNodeState;
/**
 * Convex-mix update for a single boundary score.
 *
 *   new = old × (1 − mix) + target × mix
 *
 * `target` should be in [0, 1]; `mix` should be in [0, 1] (typically 0.1–0.4
 * per question, depending on signal strength). Result is clamped to [0, 1].
 */
export declare function addToMorBoundary(current: number, target: number, mix: number): number;
/**
 * Convex-mix update for the intensity scalar (0..3 range).
 *
 *   new = old × (1 − mix) + target × mix
 *
 * `target` should be in [0, 3]; `mix` in [0, 1]. Result clamped to [0, 3].
 */
export declare function bumpMorIntensity(current: number, target: number, mix: number): number;
/**
 * Derived measure: max boundary score. Per ADR-006 §"Engine math",
 * `boundaryLoad = max(boundaries)` is the v1 default; the cumulative
 * `min(1, sqrt(Σ b²))` is reserved for v2 if multi-anchor activation needs
 * sharper detection.
 */
export declare function boundaryLoad(b: MorBoundaries): number;
/** Derived display metric: how universalist (0..3 scale). */
export declare function universalismScore(intensity: number, b: MorBoundaries): number;
/** Derived display metric: how identity-bounded (0..3 scale). Replaces the
 * legacy "tribalism" term in v1 — see ADR-006 §"Derived measures".
 */
export declare function boundednessScore(intensity: number, b: MorBoundaries): number;
/**
 * Per-module distance for archetype matching: vector distance over the 7
 * boundaries (Euclidean / sqrt(7)) blended with the absolute intensity gap
 * (normalized to /3). 70/30 split; the outer scorer applies the standard
 * salience-weighted multiplier separately, so intensity is NOT double-counted
 * inside the boundary sum.
 *
 *   boundaryDist  = sqrt(Σ (resp.boundaries[i] − arch.boundaries[i])² / 7)
 *   intensityDist = |resp.intensity − arch.intensity| / 3
 *   morModuleDist = 0.7 × boundaryDist + 0.3 × intensityDist
 *
 * Returns a value in [0, 1].
 */
export declare function morModuleDistance(respondent: MorBoundariesNodeState | undefined, target: ArchetypeMorBoundaries | undefined, weights?: {
    boundary?: number;
    intensity?: number;
}): number;
/**
 * Per-target Layer 1 distance for candidate / regime matching: vector
 * distance over the 7 boundaries only. Used by `respondentVoteChoice.ts` and
 * `build-alignment.ts` after PR 6.E.3 cutover. No intensity term — intensity
 * differences for candidates/regimes are handled separately if at all.
 *
 *   politicalDist = sqrt(Σ (resp.boundaries[i] − target.boundaries[i])² / 7)
 *
 * Returns a value in [0, 1].
 */
export declare function morTargetVectorDistance(respondentBoundaries: MorBoundaries | undefined, targetBoundaries: MorBoundaries | undefined): number;
/**
 * Schema validator for a `MorBoundaries` object. Returns `null` if valid,
 * otherwise an error message naming the first invalid field. Useful for
 * loaders that ingest persisted state and need to fail fast on malformed
 * input.
 */
export declare function validateMorBoundaries(b: unknown): string | null;
/**
 * Schema validator for a `MorBoundariesNodeState`. Checks both the boundary
 * scores and the intensity scalar.
 */
export declare function validateMorBoundariesNodeState(s: unknown): string | null;
