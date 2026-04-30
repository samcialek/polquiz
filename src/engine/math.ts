import type {
  TrbAnchor,
  TrbAnchorDist,
  MorBoundaries,
  MorBoundaryId,
  MorBoundariesNodeState,
  ArchetypeMorBoundaries,
} from "../types.js";

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
  "gender",
  "sexual",
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

// ────────────────────────────────────────────────────────────────────────────
// MOR_BOUNDARIES — compound moral-circle module helpers (ADR-006, PR 6.E.1)
// ────────────────────────────────────────────────────────────────────────────

/**
 * Canonical 7-boundary order. MUST match `MorBoundaryId` in src/types.ts and
 * `MOR_BOUNDARIES` in src/config/categories.ts. Used by anything that needs
 * positional access to the boundaries object.
 */
export const MOR_BOUNDARY_ORDER: MorBoundaryId[] = [
  "national",
  "ethnic_racial",
  "religious",
  "class",
  "ideological",
  "gender",
  "political_tribe",
];

/** Convert a `MorBoundaries` object to a 7-tuple in canonical order. */
export function morBoundariesToVector(b: MorBoundaries): [number, number, number, number, number, number, number] {
  return [b.national, b.ethnic_racial, b.religious, b.class, b.ideological, b.gender, b.political_tribe];
}

/** Convert a 7-tuple back to a `MorBoundaries` object. */
export function morBoundariesFromVector(v: ArrayLike<number>): MorBoundaries {
  return {
    national:        v[0] ?? 0,
    ethnic_racial:   v[1] ?? 0,
    religious:       v[2] ?? 0,
    class:           v[3] ?? 0,
    ideological:     v[4] ?? 0,
    gender:          v[5] ?? 0,
    political_tribe: v[6] ?? 0,
  };
}

/**
 * Default initial MorBoundariesNodeState. Boundaries start at 0.5 — read this
 * as "unknown / no evidence yet," NOT as "moderately bounded." Per ADR-006
 * universalism is encoded as low boundaries + high intensity, so a 0.5 prior
 * is deliberately *not* on the universalist axis; it just means the engine
 * hasn't yet seen evidence to push the score toward 0 or 1. Convex-mix
 * updates from question evidence move boundaries toward their true value
 * over the course of the quiz.
 *
 * Intensity starts at 0 (no activation evidence yet) and is updated by
 * `bumpMorIntensity` via the same convex-mix rule as boundaries — it can
 * move both up (toward high-activation targets like 2.5..3) and down
 * (toward low-activation targets like 0..1) as evidence accumulates.
 */
export function mkInitialMorBoundaries(): MorBoundariesNodeState {
  return {
    boundaries: {
      national:        0.5,
      ethnic_racial:   0.5,
      religious:       0.5,
      class:           0.5,
      ideological:     0.5,
      gender:          0.5,
      political_tribe: 0.5,
    },
    intensity: 0,
    touches: {},
    touchTypes: new Set<string>(),
    status: "unknown",
  };
}

/**
 * Convex-mix update for a single boundary score.
 *
 *   new = old × (1 − mix) + target × mix
 *
 * `target` should be in [0, 1]; `mix` should be in [0, 1] (typically 0.1–0.4
 * per question, depending on signal strength). Result is clamped to [0, 1].
 */
export function addToMorBoundary(
  current: number,
  target: number,
  mix: number,
): number {
  const t = clamp01(target);
  const m = clamp01(mix);
  const updated = current * (1 - m) + t * m;
  return clamp01(updated);
}

/**
 * Convex-mix update for the intensity scalar (0..3 range).
 *
 *   new = old × (1 − mix) + target × mix
 *
 * `target` should be in [0, 3]; `mix` in [0, 1]. Result clamped to [0, 3].
 */
export function bumpMorIntensity(
  current: number,
  target: number,
  mix: number,
): number {
  const t = Math.max(0, Math.min(3, target));
  const m = clamp01(mix);
  const updated = current * (1 - m) + t * m;
  return Math.max(0, Math.min(3, updated));
}

/**
 * Derived measure: max boundary score. Per ADR-006 §"Engine math",
 * `boundaryLoad = max(boundaries)` is the v1 default; the cumulative
 * `min(1, sqrt(Σ b²))` is reserved for v2 if multi-anchor activation needs
 * sharper detection.
 */
export function boundaryLoad(b: MorBoundaries): number {
  return Math.max(
    b.national, b.ethnic_racial, b.religious, b.class,
    b.ideological, b.gender, b.political_tribe,
  );
}

/** Derived display metric: how universalist (0..3 scale). */
export function universalismScore(intensity: number, b: MorBoundaries): number {
  return intensity * (1 - boundaryLoad(b));
}

/** Derived display metric: how identity-bounded (0..3 scale). Replaces the
 * legacy "tribalism" term in v1 — see ADR-006 §"Derived measures".
 */
export function boundednessScore(intensity: number, b: MorBoundaries): number {
  return intensity * boundaryLoad(b);
}

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
export function morModuleDistance(
  respondent: MorBoundariesNodeState | undefined,
  target: ArchetypeMorBoundaries | undefined,
  weights: { boundary?: number; intensity?: number } = {},
): number {
  // Graceful fallback: if either side lacks the module (legacy data during
  // the additive transition), return the median midpoint distance 0.5 so
  // the term contributes neutrally rather than wildly.
  // TODO(6.E.4): replace this fallback with a hard validator/throw once all
  //   archetype/respondent state guarantees morBoundaries is present. Silent
  //   neutral-distance hides bugs after the cutover completes.
  if (!respondent || !target) return 0.5;
  const wB = weights.boundary ?? 0.7;
  const wI = weights.intensity ?? 0.3;
  const rb = respondent.boundaries;
  const tb = target.boundaries;
  let sumSq = 0;
  for (const key of MOR_BOUNDARY_ORDER) {
    const d = (rb[key] ?? 0.5) - (tb[key] ?? 0.5);
    sumSq += d * d;
  }
  const boundaryDist = Math.sqrt(sumSq / MOR_BOUNDARY_ORDER.length);
  const intensityDist = Math.abs((respondent.intensity ?? 0) - (target.intensity ?? 0)) / 3;
  return wB * boundaryDist + wI * intensityDist;
}

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
export function morTargetVectorDistance(
  respondentBoundaries: MorBoundaries | undefined,
  targetBoundaries: MorBoundaries | undefined,
): number {
  // TODO(6.E.4): same as morModuleDistance — replace silent 0.5 fallback
  //   with a hard check once all candidate/regime data guarantees
  //   morBoundaries is present.
  if (!respondentBoundaries || !targetBoundaries) return 0.5;
  let sumSq = 0;
  for (const key of MOR_BOUNDARY_ORDER) {
    const d = (respondentBoundaries[key] ?? 0.5) - (targetBoundaries[key] ?? 0.5);
    sumSq += d * d;
  }
  return Math.sqrt(sumSq / MOR_BOUNDARY_ORDER.length);
}

/**
 * Schema validator for a `MorBoundaries` object. Returns `null` if valid,
 * otherwise an error message naming the first invalid field. Useful for
 * loaders that ingest persisted state and need to fail fast on malformed
 * input.
 */
export function validateMorBoundaries(b: unknown): string | null {
  if (!b || typeof b !== "object") return "morBoundaries: not an object";
  const obj = b as Record<string, unknown>;
  for (const key of MOR_BOUNDARY_ORDER) {
    const v = obj[key];
    if (typeof v !== "number" || !Number.isFinite(v)) return `morBoundaries.${key}: not a finite number`;
    if (v < 0 || v > 1) return `morBoundaries.${key}: out of range [0,1] (${v})`;
  }
  return null;
}

/**
 * Schema validator for a `MorBoundariesNodeState`. Checks both the boundary
 * scores and the intensity scalar.
 */
export function validateMorBoundariesNodeState(s: unknown): string | null {
  if (!s || typeof s !== "object") return "morBoundariesNodeState: not an object";
  const obj = s as Record<string, unknown>;
  const bErr = validateMorBoundaries(obj.boundaries);
  if (bErr) return bErr;
  const i = obj.intensity;
  if (typeof i !== "number" || !Number.isFinite(i)) return "morIntensity: not a finite number";
  if (i < 0 || i > 3) return `morIntensity: out of range [0,3] (${i})`;
  return null;
}

function clamp01(x: number): number {
  if (x < 0) return 0;
  if (x > 1) return 1;
  return x;
}
