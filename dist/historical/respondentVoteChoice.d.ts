/**
 * Respondent-signature election prediction.
 *
 * Distance formula: weighted Euclidean against each candidate's node profile,
 * where each node's weight is the respondent's archetype salience multiplied
 * by an era-activation multiplier from era-activations.json (1x / 2x / 3x per
 * year × node). See era-activations.ts for the canonical activation map and
 * the multiplier semantics. The prior dense-vector eraWeight + 60/40 blend
 * has been removed; activation-multiplier is the sole era mechanism.
 *
 * Output: per-candidate distances + an engagement-driven clearing bar that
 * decides vote vs abstain.
 *
 * Anti-position branch is intentionally skipped: respondents don't carry
 * anti markers. The archetype classification layer still uses anti.
 */
import type { NodeSignature } from "../engine/respondentSignature.js";
import type { CandidateProfile } from "./candidates.js";
import type { ElectionContext } from "./activation.js";
import type { EngagementLevel } from "../engine/engagementLabel.js";
import type { PartyID, TrbAnchorDist, MorBoundariesNodeState } from "../types.js";
export interface CandidateScore {
    name: string;
    party: string;
    /** Values-only distance before moral-floor disqualification penalty. */
    baseIdeologicalDistance: number;
    /** Equal-citizenship incompatibility penalty added in rights-veto contexts. */
    moralFloorPenalty: number;
    /** Short reason when moralFloorPenalty > 0. */
    moralFloorReason?: string;
    /** Values-only distance before non-ideological, party-loyalty, and negative-party modifiers. */
    ideologicalDistance: number;
    /** Economic/incumbency/charisma modifier total subtracted from ideologicalDistance. */
    nonIdeologicalModifier: number;
    /** Distance after non-ideological modifier, before party/negative multipliers. */
    nonIdeologicalAdjustedDistance: number;
    /** Post-1932 out-party multiplier from party ID and PF. */
    partisanMultiplier: number;
    /** Negative-partisanship multiplier for never-vote parties. */
    negativePartisanshipMultiplier: number;
    /** Final predicted-vote distance after all modifiers. */
    distance: number;
}
export interface ElectionPrediction {
    year: number;
    candidates: CandidateScore[];
    clearingBar: number;
    /** Candidate closest on values alone, before non-ideological and party modifiers. */
    nearestByValues: CandidateScore;
    nearest: CandidateScore;
    valuesDecision: "vote" | "abstain";
    decision: "vote" | "abstain";
}
export declare function predictVote(sig: NodeSignature, candidates: CandidateProfile[], ctx: ElectionContext, engagement: EngagementLevel, partyID?: PartyID | null, anchorDist?: TrbAnchorDist | null, negativeParties?: Set<string> | null, strategicVoting?: boolean, dominantNode?: string | null, morBoundariesState?: MorBoundariesNodeState | null): ElectionPrediction;
