import type { RespondentState, MorBoundaryId } from "../types.js";
import type { EngagementLabel } from "../engine/engagementLabel.js";
import { MOR_BOUNDARY_ORDER, boundaryLoad } from "../engine/math.js";

export type IdentityPrimaryLabel =
  | "Black Voter"
  | "White Grievance Voter"
  | "Evangelical Voter"
  | "LGBTQ Voter"
  | "Feminist Voter"
  | "Male Grievance Voter";

export type IdentityPrimaryState = "none" | "unresolved" | "latent" | "active" | "dominant";
export type IdentityPrimaryConfidence = "low" | "medium" | "high";

export interface IdentityPrimaryResult {
  state: IdentityPrimaryState;
  label?: IdentityPrimaryLabel;
  confidence?: IdentityPrimaryConfidence;
  /**
   * Top morBoundary by score (per ADR-006 PR 6.E.2b). Replaces the legacy
   * TrbAnchor field — boundary keys are a strict subset and `sexual` is
   * collapsed into `gender` (LGBTQ Voter routes via `demo_lgbtq` before
   * the gender split). Field name retained for downstream compatibility.
   */
  anchor?: MorBoundaryId;
  reasonCodes: string[];
  gate: {
    /** Compound moral-circle module intensity (0..3). */
    intensity: number;
    /** Compound moral-circle module load = max(boundaries) (0..1). */
    load: number;
    engagementLevel: EngagementLabel["level"];
    passedLatent: boolean;
    passedActive: boolean;
    passedDominant: boolean;
  };
}

export interface IdentityPrimaryDemographics {
  demo_ethnicity?: string;
  demo_religion?: string;
  demo_gender?: string;
  demo_lgbtq?: string;
  [key: string]: unknown;
}

// Activation thresholds locked in the 6.E preflight.
const LATENT_INTENSITY   = 1.5;
const LATENT_LOAD        = 0.45;
const ACTIVE_INTENSITY   = 2.25;
const ACTIVE_LOAD        = 0.65;

function expectedContinuous(state: RespondentState, nodeId: "ZS" | "CD" | "ONT_S" | "MOR"): number {
  const node = state.continuous[nodeId];
  if (!node) return 3;
  return node.posDist.reduce((sum, p, i) => sum + p * (i + 1), 0);
}

/**
 * Top boundary by score from the compound moral-circle module. Returns null
 * if the module is missing or all boundaries equal (init state). Ties are
 * resolved by `MOR_BOUNDARY_ORDER` precedence.
 */
function topBoundary(state: RespondentState): MorBoundaryId | null {
  const mb = state.morBoundaries;
  if (!mb) return null;
  let bestKey: MorBoundaryId = MOR_BOUNDARY_ORDER[0]!;
  let bestVal = mb.boundaries[bestKey];
  let allEqual = true;
  for (const k of MOR_BOUNDARY_ORDER) {
    const v = mb.boundaries[k];
    if (v !== bestVal) allEqual = false;
    if (v > bestVal) {
      bestVal = v;
      bestKey = k;
    }
  }
  return allEqual ? null : bestKey;
}

/**
 * Resolve the identity-primary overlay (ADR-006 PR 6.E.2b cutover). Reads
 * the compound moral-circle module instead of the legacy TRB / PF / trbAnchor
 * triad. Activation gates use intensity + boundary-load thresholds locked
 * in the 6.E preflight; the routing logic collapses the `sexual` anchor
 * into `gender` and dispatches LGBTQ Voter via `demo_lgbtq` before the
 * gender-split routing.
 */
export function resolveIdentityPrimary(
  state: RespondentState,
  engagementLabel: EngagementLabel,
  demographics?: IdentityPrimaryDemographics | null,
): IdentityPrimaryResult {
  const mb = state.morBoundaries;
  const intensity = mb?.intensity ?? 0;
  const load = mb ? boundaryLoad(mb.boundaries) : 0;
  const anchorTop = topBoundary(state);

  // ENG leaves archetype signatures under ADR-002; engagement gating runs on
  // the standalone EngagementLabel the caller computed from state.
  const engagementActive =
    engagementLabel.level === "engaged" ||
    engagementLabel.level === "highly-engaged";
  const engagementDominant = engagementLabel.level === "highly-engaged";

  const passedLatent   = intensity >= LATENT_INTENSITY && load >= LATENT_LOAD;
  const passedActive   = intensity >= ACTIVE_INTENSITY && load >= ACTIVE_LOAD && engagementActive;
  const passedDominant = intensity >= ACTIVE_INTENSITY && load >= ACTIVE_LOAD && engagementDominant;

  const gate = {
    intensity,
    load,
    engagementLevel: engagementLabel.level,
    passedLatent,
    passedActive,
    passedDominant,
  };

  if (!passedLatent || !anchorTop) {
    return {
      state: "none",
      anchor: anchorTop ?? undefined,
      reasonCodes: anchorTop ? ["gate_not_met"] : ["module_uninitialized_or_uniform"],
      gate,
    };
  }

  const stateLabel: IdentityPrimaryState = passedDominant
    ? "dominant"
    : passedActive
      ? "active"
      : "latent";

  // ── Pre-gender LGBTQ check (replaces the legacy `sexual` anchor case) ──
  // The 6.E.2b design collapses `sexual` into the `gender` boundary. To keep
  // LGBTQ Voter resolvable, we route it via `demo_lgbtq` BEFORE the gender
  // split: if the respondent's top boundary is `gender` AND demo_lgbtq is
  // confirmed, classify as LGBTQ Voter regardless of demo_gender.
  if (anchorTop === "gender") {
    const lgbtq = typeof demographics?.demo_lgbtq === "string" ? demographics.demo_lgbtq : "";
    if (lgbtq === "yes") {
      return {
        state: stateLabel,
        label: "LGBTQ Voter",
        confidence: passedActive ? "high" : "medium",
        anchor: anchorTop,
        reasonCodes: ["gender_anchor", "lgbtq_demographic_match"],
        gate,
      };
    }
  }

  if (anchorTop === "ethnic_racial") {
    const race = typeof demographics?.demo_ethnicity === "string" ? demographics.demo_ethnicity : "";
    if (race === "black") {
      return {
        state: stateLabel,
        label: "Black Voter",
        confidence: passedActive ? "high" : "medium",
        anchor: anchorTop,
        reasonCodes: ["racial_anchor", "black_demographic_match"],
        gate,
      };
    }
    if (race === "white") {
      const zs = expectedContinuous(state, "ZS");
      const cd = expectedContinuous(state, "CD");
      const onts = expectedContinuous(state, "ONT_S");
      const grievanceSignals = Number(zs >= 3.5) + Number(cd >= 3.5) + Number(onts <= 2.5);
      if (grievanceSignals >= 2) {
        return {
          state: stateLabel,
          label: "White Grievance Voter",
          confidence: grievanceSignals === 3 ? "high" : "medium",
          anchor: anchorTop,
          reasonCodes: ["racial_anchor", "white_demographic_match", "status_threat_pattern"],
          gate,
        };
      }
      return {
        state: "unresolved",
        confidence: "low",
        anchor: anchorTop,
        reasonCodes: ["racial_anchor", "white_demographic_match", "insufficient_grievance_signal"],
        gate,
      };
    }
    return {
      state: "unresolved",
      confidence: "low",
      anchor: anchorTop,
      reasonCodes: ["racial_anchor", "missing_or_nonresolving_race_demographic"],
      gate,
    };
  }

  if (anchorTop === "religious") {
    const religion = typeof demographics?.demo_religion === "string" ? demographics.demo_religion : "";
    if (religion === "christian") {
      return {
        state: stateLabel,
        label: "Evangelical Voter",
        confidence: passedActive ? "medium" : "low",
        anchor: anchorTop,
        reasonCodes: ["religious_anchor", "christian_demographic_match"],
        gate,
      };
    }
    return {
      state: "unresolved",
      confidence: "low",
      anchor: anchorTop,
      reasonCodes: ["religious_anchor", "missing_or_non_evangelical_religion_detail"],
      gate,
    };
  }

  if (anchorTop === "gender") {
    const gender = typeof demographics?.demo_gender === "string" ? demographics.demo_gender : "";
    const cd = expectedContinuous(state, "CD");
    const mor = expectedContinuous(state, "MOR");
    const onts = expectedContinuous(state, "ONT_S");
    const zs = expectedContinuous(state, "ZS");
    if (gender === "female") {
      const feministSignals = Number(cd <= 2.5) + Number(mor >= 3.5) + Number(onts >= 3.5);
      if (feministSignals >= 2) {
        return {
          state: stateLabel,
          label: "Feminist Voter",
          confidence: feministSignals === 3 ? "high" : "medium",
          anchor: anchorTop,
          reasonCodes: ["gender_anchor", "female_demographic_match", "progressive_gender_pattern"],
          gate,
        };
      }
      return {
        state: "unresolved",
        confidence: "low",
        anchor: anchorTop,
        reasonCodes: ["gender_anchor", "female_demographic_match", "insufficient_feminist_signal"],
        gate,
      };
    }
    if (gender === "male") {
      const grievanceSignals = Number(zs >= 3.5) + Number(cd >= 3.5) + Number(onts <= 2.5);
      if (grievanceSignals >= 2) {
        return {
          state: stateLabel,
          label: "Male Grievance Voter",
          confidence: grievanceSignals === 3 ? "high" : "medium",
          anchor: anchorTop,
          reasonCodes: ["gender_anchor", "male_demographic_match", "status_threat_pattern"],
          gate,
        };
      }
      return {
        state: "unresolved",
        confidence: "low",
        anchor: anchorTop,
        reasonCodes: ["gender_anchor", "male_demographic_match", "insufficient_grievance_signal"],
        gate,
      };
    }
    return {
      state: "unresolved",
      confidence: "low",
      anchor: anchorTop,
      reasonCodes: ["gender_anchor", "missing_or_nonresolving_gender_demographic"],
      gate,
    };
  }

  // Top boundary is national / class / ideological / political_tribe — none
  // of these route to an identity-primary archetype. Pass through to base.
  return {
    state: "unresolved",
    confidence: "low",
    anchor: anchorTop,
    reasonCodes: ["identity_pattern_detected_but_anchor_not_yet_resolvable"],
    gate,
  };
}
