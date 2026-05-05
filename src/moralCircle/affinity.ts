/**
 * ADR-007 — Moral Circle Affinity (additive scaffolding).
 *
 * Pure helpers for the explicit moral-circle affinity model. Engine,
 * selector, mapper, archetype, candidate-distance, identity-primary,
 * era-activation, and electorate code do NOT call into this module yet.
 * Stage B per `results/architecture/moral-circle-terminal2-work-order.md`.
 *
 * All numeric inputs are 0..100; null scoped affinities mean
 * "not meaningful to me" (collapse to zero excess).
 */

import type {
  MoralCircleScope,
  MoralCircleScopedAffinities,
  MoralCircleExcessAffinities,
  MoralCircleAffinityInput,
  MoralCircleAffinity,
} from "../types.js";

/** Canonical scope ordering. The 8 scoped affinities. */
export const MORAL_CIRCLE_SCOPES: readonly MoralCircleScope[] = [
  "national",
  "religious",
  "ethnic_racial",
  "class",
  "gender",
  "sexual",
  "ideological",
  "political_camp",
] as const;

/** Practical activation threshold (points of excess) for UI/reporting/resolver gating. */
export const MORAL_CIRCLE_REPORT_ACTIVE_THRESHOLD = 5;

export function isMoralCircleScope(value: unknown): value is MoralCircleScope {
  return typeof value === "string" && (MORAL_CIRCLE_SCOPES as readonly string[]).includes(value);
}

/** Clamp a number to [0, 100]; non-finite → 0. */
export function clampAffinity100(value: number): number {
  if (!Number.isFinite(value)) return 0;
  if (value < 0) return 0;
  if (value > 100) return 100;
  return value;
}

/**
 * For legacy numeric surfaces that cannot accept null. Per ADR-007 §"Raw
 * Storage vs Active Signal": null scoped → universalAffinity, NOT zero.
 * Numeric scoped values pass through clamped.
 */
export function coerceScopedAffinityForLegacy(
  scoped: number | null,
  universalAffinity: number,
): number {
  if (scoped === null || scoped === undefined) return clampAffinity100(universalAffinity);
  return clampAffinity100(scoped);
}

/**
 * Per-scope excess: max(0, scoped - universal). null scoped → 0 excess.
 * Universal is clamped before subtraction; scoped values likewise.
 */
export function computeExcessAffinities(
  universalAffinity: number,
  scopedAffinities: MoralCircleScopedAffinities,
): MoralCircleExcessAffinities {
  const u = clampAffinity100(universalAffinity);
  const out = {} as MoralCircleExcessAffinities;
  for (const scope of MORAL_CIRCLE_SCOPES) {
    const raw = scopedAffinities[scope];
    if (raw === null || raw === undefined) {
      out[scope] = 0;
      continue;
    }
    const s = clampAffinity100(raw);
    out[scope] = Math.max(0, s - u);
  }
  return out;
}

/**
 * Reporting helper. Returns scopes whose excess passes both the mathematical
 * activation rule (excess > 0) and the supplied reporting threshold.
 *
 *   threshold = 0 → mathematical activation set (any positive excess)
 *   threshold = 5 → reporting / resolver activation set (ADR-007 default)
 */
export function getActiveMoralCircleBoundaries(
  excessAffinities: MoralCircleExcessAffinities,
  threshold: number = MORAL_CIRCLE_REPORT_ACTIVE_THRESHOLD,
): MoralCircleScope[] {
  const out: MoralCircleScope[] = [];
  for (const scope of MORAL_CIRCLE_SCOPES) {
    const e = excessAffinities[scope];
    if (e > 0 && e >= threshold) out.push(scope);
  }
  return out;
}

export interface MoralCircleIntensity {
  /** Raw L2 norm of excess vector, in 0..100 (saturates higher with multi-loaded). */
  l2: number;
  /** L2 norm normalized to [0, 1]; saturates at one fully-loaded boundary. */
  intensity01: number;
  /** intensity01 × 3, for compatibility with 0..3 salience surfaces. */
  intensity03: number;
}

/**
 * Moral-circle intensity per ADR-007 §"Intensity Formula": L2 norm of the
 * excess-affinity vector, divided by 100 and clamped to 1.
 *
 *   l2          = sqrt(Σ excess[g]^2)
 *   intensity01 = min(1, l2 / 100)
 *   intensity03 = 3 × intensity01
 *
 * The /100 divisor saturates at "one boundary fully maxed" — multi-loaded
 * profiles cluster at ceiling. This is deliberate per ADR-007.
 */
export function computeMoralCircleIntensity(
  excessAffinities: MoralCircleExcessAffinities,
): MoralCircleIntensity {
  let sumSq = 0;
  for (const scope of MORAL_CIRCLE_SCOPES) {
    const e = excessAffinities[scope];
    sumSq += e * e;
  }
  const l2 = Math.sqrt(sumSq);
  const intensity01 = Math.min(1, l2 / 100);
  const intensity03 = 3 * intensity01;
  return { l2, intensity01, intensity03 };
}

/**
 * Full derivation pipeline: raw 9 numbers → MoralCircleAffinity object.
 * `activeBoundaries` uses the mathematical rule (excess > 0).
 */
export function deriveMoralCircleAffinity(
  input: MoralCircleAffinityInput,
): MoralCircleAffinity {
  const universalAffinity = clampAffinity100(input.universalAffinity);
  // Clamp scoped values but preserve null sentinel.
  const scopedAffinities = {} as MoralCircleScopedAffinities;
  for (const scope of MORAL_CIRCLE_SCOPES) {
    const raw = input.scopedAffinities[scope];
    scopedAffinities[scope] = raw === null || raw === undefined ? null : clampAffinity100(raw);
  }
  const excessAffinities = computeExcessAffinities(universalAffinity, scopedAffinities);
  const activeBoundaries = getActiveMoralCircleBoundaries(excessAffinities, 0);
  const { intensity01, intensity03 } = computeMoralCircleIntensity(excessAffinities);
  return {
    universalAffinity,
    scopedAffinities,
    excessAffinities,
    activeBoundaries,
    intensity01,
    intensity03,
  };
}

export interface MoralCircleValidationIssue {
  field: string;
  message: string;
}

/**
 * Light-touch validator for input shape. Distinguishes:
 *   - missing key (incomplete 9-value storage shape) — INVALID
 *   - explicit `null` ("not meaningful to me")        — VALID
 *   - explicit `undefined`                            — INVALID
 *   - finite number in [0, 100]                       — VALID
 *
 * Does NOT enforce satisficing rules — those live in the calibration-battery
 * module.
 */
export function validateMoralCircleAffinityInput(
  input: MoralCircleAffinityInput,
): MoralCircleValidationIssue[] {
  const issues: MoralCircleValidationIssue[] = [];
  if (typeof input.universalAffinity !== "number" || !Number.isFinite(input.universalAffinity)) {
    issues.push({ field: "universalAffinity", message: "must be a finite number" });
  } else if (input.universalAffinity < 0 || input.universalAffinity > 100) {
    issues.push({ field: "universalAffinity", message: "must be in [0, 100]" });
  }
  if (!input.scopedAffinities || typeof input.scopedAffinities !== "object") {
    issues.push({ field: "scopedAffinities", message: "must be an object keyed by scope" });
    return issues;
  }
  const sa = input.scopedAffinities as Record<string, unknown>;
  for (const scope of MORAL_CIRCLE_SCOPES) {
    if (!Object.prototype.hasOwnProperty.call(sa, scope)) {
      issues.push({
        field: `scopedAffinities.${scope}`,
        message: "missing required scope key (incomplete 9-value storage shape)",
      });
      continue;
    }
    const v = sa[scope];
    if (v === undefined) {
      issues.push({
        field: `scopedAffinities.${scope}`,
        message: "must be a finite number or null (got undefined)",
      });
      continue;
    }
    if (v === null) continue; // explicit null is valid "not meaningful to me"
    if (typeof v !== "number" || !Number.isFinite(v)) {
      issues.push({ field: `scopedAffinities.${scope}`, message: "must be a finite number or null" });
      continue;
    }
    if (v < 0 || v > 100) {
      issues.push({ field: `scopedAffinities.${scope}`, message: "must be in [0, 100]" });
    }
  }
  // Surface unknown keys for early detection of drift.
  for (const key of Object.keys(sa)) {
    if (!isMoralCircleScope(key)) {
      issues.push({ field: `scopedAffinities.${key}`, message: "unknown scope key" });
    }
  }
  return issues;
}
