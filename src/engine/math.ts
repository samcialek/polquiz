import type { TrbAnchor, TrbAnchorDist } from "../types.js";

/**
 * Element-wise multiply two probability arrays and renormalize.
 * Used for Bayesian updates: posterior ∝ prior × likelihood.
 */
export function multiplyAndNormalize<T extends number[]>(prior: T, likelihood: T): T {
  const result = prior.map((p, i) => p * ((likelihood as number[])[i] ?? 0));
  return normalize(result as T);
}

/**
 * Normalize an array of non-negative numbers to sum to 1.
 * Guards against all-zero arrays by returning uniform distribution.
 */
export function normalize<T extends number[]>(arr: T): T {
  const sum = arr.reduce((a, b) => a + b, 0);
  if (sum <= 0) {
    const uniform = arr.map(() => 1 / arr.length);
    return uniform as T;
  }
  return arr.map((v) => v / sum) as T;
}

const TRB_ANCHOR_ORDER: TrbAnchor[] = [
  "national",
  "ideological",
  "religious",
  "class",
  "ethnic_racial",
  "global",
  "mixed_none",
];

/**
 * Add weighted signals to the TRB anchor distribution.
 * Positive signals increase that anchor's probability; negative decrease.
 * The result is renormalized.
 */
export function addToAnchorDist(
  current: TrbAnchorDist,
  signals: Partial<Record<TrbAnchor, number>>
): TrbAnchorDist {
  const updated = [...current] as TrbAnchorDist;
  for (const [anchor, weight] of Object.entries(signals)) {
    const idx = TRB_ANCHOR_ORDER.indexOf(anchor as TrbAnchor);
    if (idx >= 0 && weight !== undefined) {
      // Use exponential bump to keep things positive
      updated[idx] = updated[idx] * Math.exp(weight);
    }
  }
  return normalize(updated) as TrbAnchorDist;
}
