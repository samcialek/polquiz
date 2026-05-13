import type { RespondentState, MorBoundaryId, MoralCircleScope } from "../types.js";
import type { EngagementLabel } from "../engine/engagementLabel.js";
export type IdentityPrimaryLabel = "Black Voter" | "White Grievance Voter" | "Evangelical Voter" | "LGBTQ Voter" | "Feminist Voter" | "Male Grievance Voter";
export type IdentityPrimaryState = "none" | "unresolved" | "latent" | "active" | "dominant";
export type IdentityPrimaryConfidence = "low" | "medium" | "high";
export interface IdentityPrimaryResult {
    state: IdentityPrimaryState;
    label?: IdentityPrimaryLabel;
    confidence?: IdentityPrimaryConfidence;
    /**
     * Top scoped affinity (post-ADR-007). Stored as `MorBoundaryId` for legacy
     * downstream compatibility — the new `MoralCircleScope` strict superset
     * adds `sexual` and renames `political_tribe` → `political_camp`. When a
     * MoralCircleScope value is reported here, `sexual` is mapped to `gender`
     * for callers that still expect the legacy 7-key shape; full path uses
     * the new scope label via the `scopedAnchor` field.
     */
    anchor?: MorBoundaryId;
    /** ADR-007 scoped anchor (post-T6). Distinct from legacy `anchor` field. */
    scopedAnchor?: MoralCircleScope;
    reasonCodes: string[];
    gate: {
        /** Moral-circle intensity (0..3). */
        intensity: number;
        /** Moral-circle load — derived from max(scopedAffinity / 100) under ADR-007 path; legacy max(boundaries) under fallback. */
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
 * Resolve the identity-primary overlay (ADR-007 §"Identity-Primary Resolver
 * Migration", T6 cutover).
 *
 * ADR-007 path (preferred): when `state.moralCircle.affinity` is materialized,
 * gate on excess affinity per ADR-007 seed thresholds:
 *   excess[g] >= 20  AND  scoped[g] >= 70  AND  universal <= 75  AND  intensity03 >= 1.2
 * Top scoped excess scope drives routing. `sexual` excess routes LGBTQ Voter
 * directly (no more sexual→gender collapse + demo_lgbtq override).
 *
 * ADR-006 fallback: when `state.moralCircle.affinity` is null (pre-T3
 * question rewire), use legacy morBoundaries gate. This fallback path is
 * removed in T12.
 *
 * Engagement gates from ADR-002 unchanged in either path.
 */
export declare function resolveIdentityPrimary(state: RespondentState, engagementLabel: EngagementLabel, demographics?: IdentityPrimaryDemographics | null): IdentityPrimaryResult;
