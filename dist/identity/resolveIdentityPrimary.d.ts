import type { RespondentState, MorBoundaryId } from "../types.js";
import type { EngagementLabel } from "../engine/engagementLabel.js";
export type IdentityPrimaryLabel = "Black Voter" | "White Grievance Voter" | "Evangelical Voter" | "LGBTQ Voter" | "Feminist Voter" | "Male Grievance Voter";
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
/**
 * Resolve the identity-primary overlay (ADR-006 PR 6.E.2b cutover). Reads
 * the compound moral-circle module instead of the legacy TRB / PF / trbAnchor
 * triad. Activation gates use intensity + boundary-load thresholds locked
 * in the 6.E preflight; the routing logic collapses the `sexual` anchor
 * into `gender` and dispatches LGBTQ Voter via `demo_lgbtq` before the
 * gender-split routing.
 */
export declare function resolveIdentityPrimary(state: RespondentState, engagementLabel: EngagementLabel, demographics?: IdentityPrimaryDemographics | null): IdentityPrimaryResult;
