/**
 * ADR-007 — Legacy PF / TRB / TRB_ANCHOR → moral-circle prior conversion.
 *
 * Stage D per `results/architecture/moral-circle-terminal2-work-order.md`.
 *
 * These helpers are PURE. They are NOT called by engine scoring, the mapper,
 * or selector code. They produce low-weight prior contributions intended to
 * be combined later with the calibration-battery posterior — once Terminal 1
 * approves the Stage F cutover.
 *
 * Rules enforced here, lifted from ADR-007:
 *   - Q103 universal prior weight is 0 (validation-only).
 *   - PF maps only to `political_camp`, capped at 0.25.
 *   - TRB anchor maps to scoped affinity only when the anchor is explicit.
 *   - `global` is weak universal evidence; no scoped excess.
 *   - `mixed_none` contributes universal/no-excess and suppresses scoped
 *     inference from that item.
 *   - TRB without anchor is generic intensity only — return null route,
 *     callers must NOT scope-assign it.
 */

import type { MoralCircleScope, TrbAnchor } from "../types.js";
import { isMoralCircleScope, clampAffinity100 } from "./affinity.js";

// ─── Scale helpers ─────────────────────────────────────────────────────────

/** Map continuous-pos expectation (1..5) to affinity (0..100). Clamped. */
export function pos15ToAffinity100(expectedPos: number): number {
  if (!Number.isFinite(expectedPos)) return 0;
  const raw = ((expectedPos - 1) / 4) * 100;
  return Math.round(clampAffinity100(raw));
}

/** Map salience expectation (0..3) to affinity (0..100). Clamped. */
export function salience03ToAffinity100(expectedSalience: number): number {
  if (!Number.isFinite(expectedSalience)) return 0;
  const raw = (expectedSalience / 3) * 100;
  return Math.round(clampAffinity100(raw));
}

// ─── Prior caps ────────────────────────────────────────────────────────────

/**
 * Maximum allowable prior weight per evidence source, lifted verbatim from
 * ADR-007 §"Existing Questions as Priors". Conversion helpers clamp to these;
 * callers must not exceed them.
 */
export const MORAL_CIRCLE_PRIOR_CAPS = {
  direct_battery: 1.0,
  q60_identity_ranking: 0.35,
  q102_membership_criteria: 0.25,
  legacy_pf: 0.25,
  legacy_trb_clear_scope: 0.25,
  legacy_trb_anchor_clear_scope: 0.30,
  policy_proxy: 0.10,
  q103_universal: 0.0,
} as const;

export type MoralCirclePriorSource = keyof typeof MORAL_CIRCLE_PRIOR_CAPS;

function applyCap(weight: number, source: MoralCirclePriorSource): number {
  if (!Number.isFinite(weight) || weight < 0) return 0;
  const cap = MORAL_CIRCLE_PRIOR_CAPS[source];
  return Math.min(weight, cap);
}

// ─── Output shape for prior contributions ──────────────────────────────────

export interface MoralCircleScopedPriorContribution {
  kind: "scoped";
  scope: MoralCircleScope;
  /** 0..100 affinity magnitude proposed as prior. */
  value: number;
  /** Effective weight after cap enforcement. */
  weight: number;
  /** Free-text note describing the routing decision (audit aid). */
  note: string;
}

export interface MoralCircleUniversalPriorContribution {
  kind: "universal";
  value: number;
  weight: number;
  note: string;
}

/**
 * Combined contribution for items that signal universal-affinity evidence
 * AND suppress scoped inference for the same item (e.g., legacy
 * `TRB_ANCHOR=mixed_none`). A future combiner should lift `universalValue`
 * into the universalAffinity prior pool while honoring
 * `suppressesScopedInference` to avoid creating scoped excess from the
 * same item.
 */
export interface MoralCircleUniversalAndNoExcessContribution {
  kind: "universal_no_excess";
  /** 0..100 universal-affinity magnitude proposed as prior. */
  universalValue: number;
  /** Effective weight for the universal prior portion, after cap enforcement. */
  weight: number;
  /** Always true; encoded as data to keep the suppression semantics first-class. */
  suppressesScopedInference: true;
  note: string;
}

/**
 * Returned when a legacy item carries no clear route (e.g., TRB salience
 * without anchor). Callers MUST NOT silently re-route — this requires
 * per-question review before any prior contribution lands.
 */
export interface MoralCircleNoRouteContribution {
  kind: "no_route";
  reason: string;
}

export type MoralCircleLegacyPriorContribution =
  | MoralCircleScopedPriorContribution
  | MoralCircleUniversalPriorContribution
  | MoralCircleUniversalAndNoExcessContribution
  | MoralCircleNoRouteContribution;

// ─── TRB_ANCHOR → moral-circle prior ───────────────────────────────────────

const TRB_ANCHOR_TO_SCOPE: Partial<Record<TrbAnchor, MoralCircleScope>> = {
  national: "national",
  religious: "religious",
  ethnic_racial: "ethnic_racial",
  class: "class",
  gender: "gender",
  sexual: "sexual",
  ideological: "ideological",
};

export interface ConvertTrbAnchorInput {
  anchor: TrbAnchor;
  /** Optional expected salience (0..3) attached to the anchor evidence. */
  expectedSalience03?: number;
  /**
   * Override the default cap — must still be ≤ the ADR cap. Pass the source
   * key the caller intends to charge against (e.g., legacy_trb_anchor_clear_scope).
   */
  sourceWeight?: number;
  /** Defaults to `legacy_trb_anchor_clear_scope`. */
  source?: MoralCirclePriorSource;
}

/**
 * Convert a legacy TRB_ANCHOR + (optional) salience signal to a low-weight
 * moral-circle prior contribution. Anchor-only evidence (no salience)
 * returns a low-magnitude scoped prior — never a high magnitude.
 */
export function convertLegacyTrbAnchorToMoralCirclePrior(
  input: ConvertTrbAnchorInput,
): MoralCircleLegacyPriorContribution {
  const source: MoralCirclePriorSource = input.source ?? "legacy_trb_anchor_clear_scope";
  const requestedWeight = input.sourceWeight ?? MORAL_CIRCLE_PRIOR_CAPS[source];
  const effectiveWeight = applyCap(requestedWeight, source);

  // global → universal-only
  if (input.anchor === "global") {
    return {
      kind: "universal",
      value: 100,
      weight: applyCap(effectiveWeight * 0.5, source),
      note: "TRB anchor=global → weak universalAffinity prior; no scoped excess (ADR-007)",
    };
  }

  // mixed_none → universal-affinity evidence + scoped-suppression flag
  if (input.anchor === "mixed_none") {
    return {
      kind: "universal_no_excess",
      universalValue: 100,
      weight: effectiveWeight,
      suppressesScopedInference: true,
      note: "TRB anchor=mixed_none → universal/no-excess prior; suppresses scoped excess for this item (ADR-007)",
    };
  }

  const scope = TRB_ANCHOR_TO_SCOPE[input.anchor];
  if (!scope) {
    return {
      kind: "no_route",
      reason: `unknown TRB anchor: ${input.anchor}`,
    };
  }

  const hasSalience =
    typeof input.expectedSalience03 === "number" && Number.isFinite(input.expectedSalience03);

  if (!hasSalience) {
    // Anchor-only: low magnitude per ADR-007 ("Anchor-only evidence without
    // salience is weak. It can identify which scoped group is plausible, but
    // it should not create a high magnitude by itself.")
    return {
      kind: "scoped",
      scope,
      value: 50, // mid-scale plausibility, NOT a strong loading
      weight: applyCap(effectiveWeight * 0.4, source),
      note: `TRB anchor=${input.anchor} (no salience) → weak scoped prior on ${scope}`,
    };
  }

  const value = salience03ToAffinity100(input.expectedSalience03 as number);
  return {
    kind: "scoped",
    scope,
    value,
    weight: effectiveWeight,
    note: `TRB anchor=${input.anchor} + salience=${input.expectedSalience03} → scoped prior on ${scope}`,
  };
}

// ─── TRB without anchor (no scope route) ───────────────────────────────────

export interface ConvertTrbWithoutAnchorInput {
  /** Free-text identifier of the question for the audit trail. */
  questionId?: string | number;
  /** Expected salience attached to the TRB evidence, if any. */
  expectedSalience03?: number;
}

/**
 * TRB salience evidence with no anchor. ADR-007 forbids silent scope routing.
 * Always returns `no_route`; per-question review must assign a scope or
 * universal target before any prior contribution is recorded.
 */
export function convertLegacyTrbWithoutAnchorToMoralCirclePrior(
  input: ConvertTrbWithoutAnchorInput,
): MoralCircleNoRouteContribution {
  const qLabel = input.questionId !== undefined ? `Q${input.questionId}` : "(unknown)";
  return {
    kind: "no_route",
    reason: `TRB salience without anchor on ${qLabel} → per-question review required before scope routing (ADR-007)`,
  };
}

// ─── PF → political_camp prior ─────────────────────────────────────────────

export interface ConvertPfInput {
  /** Expected continuous-pos value (1..5) for PF. */
  expectedPosition15: number;
  /** Optional expected salience (0..3) — engages the conservative blend. */
  expectedSalience03?: number;
  /** Override default cap; clamped to legacy_pf. */
  sourceWeight?: number;
}

/**
 * Convert legacy PF (continuous position 1..5, optional salience 0..3) to a
 * `political_camp` scoped prior. ADR-007 §"PF to political_camp":
 *   politicalCampPrior = pos15ToAffinity100(pos)
 *   if salience known:  0.65 × pos-mapped + 0.35 × sal-mapped
 *
 * Cap at MORAL_CIRCLE_PRIOR_CAPS.legacy_pf (0.25).
 */
export function convertLegacyPfToPoliticalCampPrior(
  input: ConvertPfInput,
): MoralCircleScopedPriorContribution {
  const requestedWeight = input.sourceWeight ?? MORAL_CIRCLE_PRIOR_CAPS.legacy_pf;
  const effectiveWeight = applyCap(requestedWeight, "legacy_pf");

  const posPart = pos15ToAffinity100(input.expectedPosition15);
  let value = posPart;
  let note = `PF pos=${input.expectedPosition15} → political_camp prior (pos-only)`;

  if (
    typeof input.expectedSalience03 === "number" &&
    Number.isFinite(input.expectedSalience03)
  ) {
    const salPart = salience03ToAffinity100(input.expectedSalience03);
    value = Math.round(0.65 * posPart + 0.35 * salPart);
    note = `PF pos=${input.expectedPosition15} sal=${input.expectedSalience03} → political_camp prior (0.65 pos / 0.35 sal blend)`;
  }

  return {
    kind: "scoped",
    scope: "political_camp",
    value: clampAffinity100(value),
    weight: effectiveWeight,
    note,
  };
}

// ─── Q103 guard ────────────────────────────────────────────────────────────

/**
 * Q103 (`issue_salience_screener`) is explicitly banned from
 * universalAffinity priors per ADR-007. This helper is provided so callers
 * can encode the guard as data rather than a magic number.
 */
export function isQ103UniversalPriorAllowed(): boolean {
  return MORAL_CIRCLE_PRIOR_CAPS.q103_universal > 0;
}

/**
 * Convenience — returns `no_route` for any caller attempting a Q103 →
 * universalAffinity prior, with the audit-trail reason.
 */
export function rejectQ103UniversalPrior(): MoralCircleNoRouteContribution {
  return {
    kind: "no_route",
    reason:
      "Q103 (issue_salience_screener) measures political topic salience, not baseline moral concern. Universal prior weight is 0 per ADR-007; validation-only.",
  };
}

// ─── Sanity helper for callers wiring up the conversion ────────────────────

/**
 * Anchor-set membership check on the TRB→moral-circle map. Useful in tests
 * to assert no anchor was silently dropped. Semantic labels mirror the
 * `kind` field on contributions returned by
 * `convertLegacyTrbAnchorToMoralCirclePrior`.
 */
export function listTrbAnchorScopeRoutes(): Array<{ anchor: TrbAnchor; scope: MoralCircleScope | null; semantic: "scoped" | "universal" | "universal_no_excess" }> {
  return [
    { anchor: "national", scope: "national", semantic: "scoped" },
    { anchor: "religious", scope: "religious", semantic: "scoped" },
    { anchor: "ethnic_racial", scope: "ethnic_racial", semantic: "scoped" },
    { anchor: "class", scope: "class", semantic: "scoped" },
    { anchor: "gender", scope: "gender", semantic: "scoped" },
    { anchor: "sexual", scope: "sexual", semantic: "scoped" },
    { anchor: "ideological", scope: "ideological", semantic: "scoped" },
    { anchor: "global", scope: null, semantic: "universal" },
    { anchor: "mixed_none", scope: null, semantic: "universal_no_excess" },
  ];
}

// Export for tests / smoke harness consumption.
export { isMoralCircleScope };
