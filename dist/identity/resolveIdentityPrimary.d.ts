import type { RespondentState, TrbAnchor } from "../types.js";
export type IdentityPrimaryLabel = "Black Voter" | "White Grievance Voter" | "Evangelical Voter" | "LGBTQ Voter" | "Feminist Voter" | "Male Grievance Voter";
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
    demo_lgbtq?: string;
    [key: string]: unknown;
}
export declare function resolveIdentityPrimary(state: RespondentState, demographics?: IdentityPrimaryDemographics | null): IdentityPrimaryResult;
