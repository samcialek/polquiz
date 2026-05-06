/**
 * ADR-007 — Explicit Moral Circle Affinity Model.
 *
 * This file ships the Stage B (types + helpers) and Stage D (legacy
 * conversion helpers) of the staged migration. Both stages are PURE,
 * ADDITIVE, and explicitly NOT consumed by any scoring path. The engine
 * cutover (Stage F) is gated by the ADR until Terminal 1 review of
 * Stages B-E.
 *
 * Stage A — completed (the ADR + JSON mirror exist at
 * `results/architecture/ADR-007-explicit-moral-circle-affinity.{md,json}`).
 *
 * Stage B — exported below: `MoralCircleScope`, `MoralCircleAffinity`,
 * `deriveExcessAffinities`, `deriveMoralCircleIntensity`,
 * `pos15ToAffinity100`, `salience03ToAffinity100`, `validateRawAffinity`.
 *
 * Stage D — exported below: `legacyPriorFromMorBoundaries`,
 * `legacyPriorFromTrbAnchor`, `legacyPriorFromPfPosition`. Each is
 * capped per the ADR's prior-weight table and explicitly flagged as
 * "prior, not measurement" via the returned source-tag.
 *
 * Stage E lives in a separate smoke file at
 * `src/engine/moralCircleAffinitySmoke.ts`.
 *
 * Stage F — out of scope here. Do not import anything from this file
 * into `respondentVoteChoice.ts`, `archetypeDistance.ts`, or any other
 * scoring path until Terminal 1 has reviewed Stages B-E.
 */

import type { MoralBoundariesSignature } from "../electorate/surveyToPrismMapper.js";
import type { TrbAnchor } from "../types.js";

// ─── Stage B — Types ────────────────────────────────────────────────────

export type MoralCircleScope =
  | "national"
  | "religious"
  | "ethnic_racial"
  | "class"
  | "gender"
  | "sexual"
  | "ideological"
  | "political_camp";

export const MORAL_CIRCLE_SCOPES: readonly MoralCircleScope[] = [
  "national",
  "religious",
  "ethnic_racial",
  "class",
  "gender",
  "sexual",
  "ideological",
  "political_camp",
];

/**
 * Per the ADR: 9 stored values total (universal baseline + 8 scoped
 * scopes). Raw scoped affinities use 0..100 with `null` meaning "not
 * meaningful to me". Excess and active fields are derived; intensity is
 * an L2 norm of excess on [0, 1] with a [0, 3] compatibility scale.
 */
export interface MoralCircleAffinity {
  /** Concern for any human, regardless of group. 0..100. */
  universalAffinity: number;
  /** Per-scope raw affinity 0..100, or null = "not meaningful to me". */
  scopedAffinities: Record<MoralCircleScope, number | null>;
  /** Derived: max(0, scopedAffinities[scope] - universalAffinity), 0..100. */
  excessAffinities: Record<MoralCircleScope, number>;
  /** Derived: scopes with excess >= 5 (practical activation threshold). */
  activeBoundaries: MoralCircleScope[];
  /** Derived: L2 norm of excess vector / 100, clamped to [0, 1]. */
  intensity01: number;
  /** Derived: 3 × intensity01 — compatibility-only scale for legacy 0..3 surfaces. */
  intensity03: number;
}

/** Activation threshold for `activeBoundaries` reporting (ADR §"Active Boundary Rule"). */
export const ACTIVE_BOUNDARY_REPORT_THRESHOLD = 5;

// ─── Stage B — Pure helpers ─────────────────────────────────────────────

/**
 * Map a 1..5 expected position (e.g. legacy continuous-node `expectedPos`)
 * onto the 0..100 affinity scale. Output clamped to [0, 100].
 */
export function pos15ToAffinity100(expectedPos: number): number {
  if (!Number.isFinite(expectedPos)) return 0;
  return Math.max(0, Math.min(100, Math.round(((expectedPos - 1) / 4) * 100)));
}

/**
 * Map a 0..3 expected salience (e.g. legacy `morBoundaries[scope]` salience
 * once normalized to that scale) onto the 0..100 affinity scale. Output
 * clamped to [0, 100].
 */
export function salience03ToAffinity100(expectedSalience: number): number {
  if (!Number.isFinite(expectedSalience)) return 0;
  return Math.max(0, Math.min(100, Math.round((expectedSalience / 3) * 100)));
}

/**
 * Validate a single raw affinity value. Returns `null` if the input is
 * `null` (i.e., "not meaningful to me"). Returns the input clamped to
 * [0, 100] otherwise. Throws if the input is non-finite (NaN, Infinity)
 * or out of an unrecoverable range.
 */
export function validateRawAffinity(raw: number | null): number | null {
  if (raw === null) return null;
  if (!Number.isFinite(raw)) {
    throw new Error(`raw affinity must be finite or null, got ${raw}`);
  }
  return Math.max(0, Math.min(100, raw));
}

/**
 * Derive excess affinity per scope: `excess = max(0, scoped - universal)`.
 * `null` scoped values (i.e., "not meaningful to me") yield 0 excess —
 * NOT `universal − universal = 0` via coercion, but a deliberate 0 because
 * the respondent declined to load that scope at all. The ADR is explicit:
 * "if a respondent marks a scoped group as `not meaningful`, store `null`
 * for the raw scoped affinity and derive excess as 0."
 */
export function deriveExcessAffinities(
  universalAffinity: number,
  scopedAffinities: Record<MoralCircleScope, number | null>,
): Record<MoralCircleScope, number> {
  const out = {} as Record<MoralCircleScope, number>;
  for (const scope of MORAL_CIRCLE_SCOPES) {
    const scoped = scopedAffinities[scope];
    if (scoped === null) {
      out[scope] = 0;
    } else {
      out[scope] = Math.max(0, scoped - universalAffinity);
    }
  }
  return out;
}

/**
 * Compute moral-circle intensity as the L2 norm of the excess-affinity
 * vector, normalized so a single max excess (100) gives `intensity01 = 1`.
 * `intensity03` is `3 × intensity01` for compatibility with legacy 0..3
 * salience surfaces.
 *
 * The L2 norm is preferred over a sum: it captures both single-strong and
 * several-moderate excess profiles without making a broad field of weak
 * excesses explode (per the ADR's intensity formula spec).
 */
export function deriveMoralCircleIntensity(
  excessAffinities: Record<MoralCircleScope, number>,
): { intensity01: number; intensity03: number } {
  let sumSq = 0;
  for (const scope of MORAL_CIRCLE_SCOPES) {
    const v = excessAffinities[scope];
    sumSq += v * v;
  }
  const l2 = Math.sqrt(sumSq);
  const intensity01 = Math.min(1, l2 / 100);
  return { intensity01, intensity03: 3 * intensity01 };
}

/**
 * Derive `activeBoundaries`: scopes whose excess passes the 5-point
 * report threshold.
 */
export function deriveActiveBoundaries(
  excessAffinities: Record<MoralCircleScope, number>,
): MoralCircleScope[] {
  return MORAL_CIRCLE_SCOPES.filter(s => excessAffinities[s] >= ACTIVE_BOUNDARY_REPORT_THRESHOLD);
}

/**
 * Build a complete `MoralCircleAffinity` from a universal baseline and a
 * scoped-affinity record. All derived fields (excess, active, intensity)
 * are computed. Convenience for callers that have raw values in hand.
 */
export function buildMoralCircleAffinity(
  universalAffinity: number,
  scopedAffinities: Record<MoralCircleScope, number | null>,
): MoralCircleAffinity {
  const u = Math.max(0, Math.min(100, universalAffinity));
  const scoped: Record<MoralCircleScope, number | null> = {} as Record<MoralCircleScope, number | null>;
  for (const s of MORAL_CIRCLE_SCOPES) {
    scoped[s] = validateRawAffinity(scopedAffinities[s]);
  }
  const excess = deriveExcessAffinities(u, scoped);
  const intensity = deriveMoralCircleIntensity(excess);
  const active = deriveActiveBoundaries(excess);
  return {
    universalAffinity: u,
    scopedAffinities: scoped,
    excessAffinities: excess,
    activeBoundaries: active,
    ...intensity,
  };
}

// ─── Stage D — Legacy conversion helpers ────────────────────────────────

/**
 * Source tag returned by every legacy conversion below. Allows downstream
 * audits to verify a value came from a prior-weight legacy source (NOT
 * from a direct calibration battery). The ADR caps each source's prior
 * weight; the cap is encoded in `priorWeightCap`.
 */
export interface LegacyAffinityPrior {
  scope: MoralCircleScope | "universal";
  /** 0..100 affinity contribution (before applying prior weight). */
  rawValue: number;
  /** Maximum prior weight permitted by ADR-007 §"Existing Questions as Priors". */
  priorWeightCap: number;
  /** Source label for provenance. */
  source: string;
  /** Notes for the audit log. */
  notes: string;
}

/**
 * Legacy `morBoundaries.<scope>.salience` (0..3) → scoped affinity prior.
 *
 * Per ADR §"Legacy Conversion Rules" this is treated as a low-to-medium
 * prior. The mapper's `political_camp` is renamed to the engine's
 * `political_camp` ADR scope (same semantics; ADR uses `political_camp`
 * as the scope name). Cap: 0.10–0.25 depending on the scope per the
 * ADR's prior-weight table. Mapper's intensity field is NOT used here —
 * intensity is derived from the new excess vector, not borrowed from
 * the legacy aggregate.
 *
 * Returns one LegacyAffinityPrior per scope where the mapper has a
 * usable real_signal (provenance.source !== "fallback").
 */
export function legacyPriorFromMorBoundaries(
  mb: MoralBoundariesSignature,
): LegacyAffinityPrior[] {
  const out: LegacyAffinityPrior[] = [];
  // Mapping mapper-scope-name → ADR-scope-name.
  const mapping: Array<{ mapper: keyof Omit<MoralBoundariesSignature, "intensity" | "intensityProvenance">; adr: MoralCircleScope; cap: number }> = [
    { mapper: "national",       adr: "national",       cap: 0.10 },
    { mapper: "religious",      adr: "religious",      cap: 0.10 },
    { mapper: "ethnic_racial",  adr: "ethnic_racial",  cap: 0.10 },
    { mapper: "class",          adr: "class",          cap: 0.10 },
    { mapper: "ideological",    adr: "ideological",    cap: 0.10 },
    { mapper: "gender",         adr: "gender",         cap: 0.10 },
    // Mapper's `political_camp` salience is partyIdDerived; the ADR caps
    // it at the higher 0.25 prior-weight slot reserved for legacy PF.
    { mapper: "political_camp", adr: "political_camp", cap: 0.25 },
  ];
  for (const m of mapping) {
    const entry = mb[m.mapper];
    if (entry.provenance.source !== "real_signal") continue;
    const rawValue = salience03ToAffinity100(entry.salience);
    out.push({
      scope: m.adr,
      rawValue,
      priorWeightCap: m.cap,
      source: `legacy_morBoundaries.${m.mapper}`,
      notes: `salience ${entry.salience.toFixed(2)} (0..3) → ${rawValue} (0..100); ${entry.provenance.notes ?? "no notes"}`,
    });
  }
  return out;
}

/** Legacy TRB anchor → scoped affinity prior. Anchor mapping per ADR. */
const TRB_ANCHOR_TO_SCOPE: Record<TrbAnchor, MoralCircleScope | "universal" | "none"> = {
  national: "national",
  religious: "religious",
  ethnic_racial: "ethnic_racial",
  class: "class",
  gender: "gender",
  sexual: "sexual",
  ideological: "ideological",
  // Per ADR: `global` → weak universalAffinity prior, no scoped excess.
  global: "universal",
  // Per ADR: `mixed_none` → suppresses scoped excess; emits no prior here.
  mixed_none: "none",
};

/**
 * Legacy TRB anchor + salience evidence → scoped affinity prior.
 * Anchor-only evidence without salience is weak: it can identify which
 * scoped group is plausible, but should not produce a high magnitude by
 * itself. The ADR caps this evidence type at 0.30 prior weight.
 *
 * Returns `null` for `mixed_none` anchor (no scoped prior emitted).
 */
export function legacyPriorFromTrbAnchor(
  anchor: TrbAnchor,
  salience03: number,
): LegacyAffinityPrior | null {
  const target = TRB_ANCHOR_TO_SCOPE[anchor];
  if (target === "none") return null;
  const rawValue = salience03ToAffinity100(salience03);
  return {
    scope: target,
    rawValue,
    priorWeightCap: 0.30,
    source: `legacy_trb_anchor:${anchor}`,
    notes: `anchor=${anchor} salience=${salience03.toFixed(2)} → ${rawValue}`,
  };
}

/**
 * Legacy PF (Partisan Fusion) position + optional salience → political_camp
 * affinity prior. Per ADR §"PF to political_camp": initial conversion uses
 * position alone; with explicit salience evidence, blend 0.65 × position +
 * 0.35 × salience. Cap: 0.25 prior weight unless a later audit raises it.
 *
 * NOTE: PF was absorbed into the moralBoundaries module by ADR-006. This
 * helper exists for callers that still hold legacy PF position/salience
 * pairs (e.g., archived archetype data, historical state replay), NOT
 * for live mapper output. Live respondent state should use
 * `legacyPriorFromMorBoundaries` against the political_camp boundary.
 */
export function legacyPriorFromPfPosition(
  expectedPfPos: number,
  expectedPfSalience: number | null = null,
): LegacyAffinityPrior {
  const posPart = pos15ToAffinity100(expectedPfPos);
  let rawValue = posPart;
  let notes = `PF pos=${expectedPfPos.toFixed(2)} → ${posPart}`;
  if (expectedPfSalience !== null) {
    const salPart = salience03ToAffinity100(expectedPfSalience);
    rawValue = Math.round(0.65 * posPart + 0.35 * salPart);
    notes = `PF pos=${expectedPfPos.toFixed(2)} (→${posPart}) blended with salience ${expectedPfSalience.toFixed(2)} (→${salPart}) at 0.65/0.35 → ${rawValue}`;
  }
  return {
    scope: "political_camp",
    rawValue,
    priorWeightCap: 0.25,
    source: "legacy_PF_position",
    notes,
  };
}
