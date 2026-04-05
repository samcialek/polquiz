import type { RespondentState, TrbAnchor } from "../types.js";

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
  anchor?: TrbAnchor;
  reasonCodes: string[];
  gate: {
    trb: number;
    pf: number;
    eng: number;
    passedLatent: boolean;
    passedActive: boolean;
    passedDominant: boolean;
  };
}

export interface IdentityPrimaryDemographics {
  demo_ethnicity?: string;
  demo_religion?: string;
  demo_gender?: string;
  [key: string]: unknown;
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

function expectedContinuous(state: RespondentState, nodeId: "TRB" | "PF" | "ENG" | "ZS" | "CD" | "ONT_S"): number {
  const node = state.continuous[nodeId];
  if (!node) return 3;
  return node.posDist.reduce((sum, p, i) => sum + p * (i + 1), 0);
}

function topAnchor(state: RespondentState): TrbAnchor {
  const dist = state.trbAnchor?.dist;
  if (!dist || dist.length !== TRB_ANCHOR_ORDER.length) return "mixed_none";
  let bestIdx = 0;
  for (let i = 1; i < dist.length; i++) {
    if (dist[i]! > dist[bestIdx]!) bestIdx = i;
  }
  return TRB_ANCHOR_ORDER[bestIdx]!;
}

export function resolveIdentityPrimary(
  state: RespondentState,
  demographics?: IdentityPrimaryDemographics | null,
): IdentityPrimaryResult {
  const trb = expectedContinuous(state, "TRB");
  const pf = expectedContinuous(state, "PF");
  const eng = expectedContinuous(state, "ENG");
  const zs = expectedContinuous(state, "ZS");
  const cd = expectedContinuous(state, "CD");
  const onts = expectedContinuous(state, "ONT_S");
  const anchor = topAnchor(state);

  const passedLatent = trb >= 3 && pf >= 3;
  const passedActive = trb >= 4 && pf >= 4 && eng >= 3;
  const passedDominant = trb >= 4 && pf >= 4 && eng >= 4;

  const gate = { trb, pf, eng, passedLatent, passedActive, passedDominant };

  if (!passedLatent) {
    return { state: "none", anchor, reasonCodes: ["gate_not_met"], gate };
  }

  const stateLabel: IdentityPrimaryState = passedDominant
    ? "dominant"
    : passedActive
      ? "active"
      : "latent";

  if (anchor === "ethnic_racial") {
    const race = typeof demographics?.demo_ethnicity === "string" ? demographics.demo_ethnicity : "";
    if (race === "black") {
      return {
        state: stateLabel,
        label: "Black Voter",
        confidence: passedActive ? "high" : "medium",
        anchor,
        reasonCodes: ["racial_anchor", "black_demographic_match"],
        gate,
      };
    }
    if (race === "white") {
      const grievanceSignals = Number(zs >= 3.5) + Number(cd >= 3.5) + Number(onts <= 2.5);
      if (grievanceSignals >= 2) {
        return {
          state: stateLabel,
          label: "White Grievance Voter",
          confidence: grievanceSignals === 3 ? "high" : "medium",
          anchor,
          reasonCodes: ["racial_anchor", "white_demographic_match", "status_threat_pattern"],
          gate,
        };
      }
      return {
        state: "unresolved",
        confidence: "low",
        anchor,
        reasonCodes: ["racial_anchor", "white_demographic_match", "insufficient_grievance_signal"],
        gate,
      };
    }
    return {
      state: "unresolved",
      confidence: "low",
      anchor,
      reasonCodes: ["racial_anchor", "missing_or_nonresolving_race_demographic"],
      gate,
    };
  }

  if (anchor === "religious") {
    const religion = typeof demographics?.demo_religion === "string" ? demographics.demo_religion : "";
    if (religion === "christian") {
      return {
        state: stateLabel,
        label: "Evangelical Voter",
        confidence: passedActive ? "medium" : "low",
        anchor,
        reasonCodes: ["religious_anchor", "christian_demographic_match"],
        gate,
      };
    }
    return {
      state: "unresolved",
      confidence: "low",
      anchor,
      reasonCodes: ["religious_anchor", "missing_or_non_evangelical_religion_detail"],
      gate,
    };
  }

  return {
    state: "unresolved",
    confidence: "low",
    anchor,
    reasonCodes: ["identity_pattern_detected_but_anchor_not_yet_resolvable"],
    gate,
  };
}
