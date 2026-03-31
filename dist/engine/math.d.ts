import type { TrbAnchor, TrbAnchorDist } from "../types.js";
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
