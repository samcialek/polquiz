/**
 * Dynamic Election Activation System
 *
 * Three-layer activation model for historical election simulation:
 * 1. Zeitgeist — macro background conditions affecting all voters
 * 2. Issue Landscape — what the election is actually about
 * 3. Candidate Activation — who's pulling new voters in or repelling them
 *
 * These layers combine to:
 * - Modify which nodes matter most in each election's distance calculation
 * - Determine dynamic turnout (who votes vs abstains per election)
 * - Fix margin accuracy, third-party bloat, and landslide compression
 */
export type ContinuousNodeId = "MAT" | "CD" | "CU" | "MOR" | "PRO" | "COM" | "ZS" | "ONT_H" | "ONT_S" | "PF" | "TRB" | "ENG";
export type NodeId = ContinuousNodeId | "EPS" | "AES";
export type Era = "founding" | "good-feelings" | "jacksonian" | "sectional" | "civil-war" | "reconstruction" | "gilded" | "progressive" | "normalcy" | "new-deal" | "consensus" | "upheaval" | "reagan" | "third-way" | "polarization";
export interface Zeitgeist {
    /** Which era this election belongs to */
    era: Era;
    /**
     * Node salience multipliers (default 1.0 for unspecified nodes).
     * These modify how much each node matters in the distance calculation.
     * e.g., {MAT: 2.0} means economic concerns are twice as important.
     */
    nodeWeights: Partial<Record<ContinuousNodeId, number>>;
    /**
     * Base turnout pressure: how "important" does this election feel?
     * 1.0 = normal, 1.3 = high-stakes/crisis, 0.7 = low-interest/fatigue
     * Affects the overall probability that any archetype votes.
     */
    intensity: number;
    /** Brief description of what's driving the zeitgeist */
    description: string;
}
export interface IssueLandscape {
    /**
     * Primary axis of conflict — the 2-3 nodes that define what this
     * election is "about." Gets 1.5× weight in distance calculation.
     */
    primaryAxis: ContinuousNodeId[];
    /**
     * Secondary issues — present in the campaign but not dominant.
     * Gets 1.0× weight (no modification).
     */
    secondaryAxis: ContinuousNodeId[];
    /**
     * Dormant nodes — bipartisan consensus, irrelevant, or actively
     * suppressed. Gets 0.5× weight.
     */
    dormant: ContinuousNodeId[];
    /** Brief description of the issue landscape */
    description: string;
}
export interface CandidateActivation {
    /** Must match a candidate name in the election */
    candidateName: string;
    /**
     * Which archetype traits does this candidate uniquely energize?
     * Archetypes with high salience on these nodes get a turnout boost.
     * Values > 1.0 = activating, < 1.0 = suppressing.
     */
    activationNodes: Partial<Record<ContinuousNodeId, number>>;
    /**
     * Novelty factor — how "new" or transformational does this candidate feel?
     * 1.0 = conventional politician, 1.5 = fresh face, 1.8 = once-in-a-generation
     * High novelty = can pull in disengaged voters who normally abstain.
     */
    novelty: number;
    /**
     * Negative activation — does this candidate repel people into voting AGAINST?
     * e.g., Goldwater 1964 activated Democratic turnout through fear.
     * Archetypes with high salience on these nodes get a turnout boost
     * to vote for the OTHER candidate.
     */
    threatActivation?: Partial<Record<ContinuousNodeId, number>>;
}
export interface ElectionContext {
    year: number;
    zeitgeist: Zeitgeist;
    issueLandscape: IssueLandscape;
    candidateActivations: CandidateActivation[];
}
/**
 * Compute the combined node weight for a given node in a given election.
 * = zeitgeist.nodeWeights[node] × issueLandscapeMultiplier[node]
 */
export declare function getNodeWeight(ctx: ElectionContext, node: ContinuousNodeId): number;
/**
 * Get all node weights as a record for an election.
 */
export declare function getAllNodeWeights(ctx: ElectionContext): Record<ContinuousNodeId, number>;
/**
 * Compute turnout probability for an archetype in a given election.
 *
 * Formula:
 *   baseENG = sigmoid(ENG_position)  → 0.1 to 0.95
 *   activationOverlap = how much the election's hot nodes match archetype's high-salience nodes
 *   candidateResonance = max alignment score across candidates (modified by activation)
 *   noveltyBoost = best candidate's novelty factor for matching archetypes
 *
 *   turnoutScore = baseENG × intensity × (1 + activationOverlap) × (1 + noveltyBoost)
 *   turnoutProbability = clamp(turnoutScore, 0, 1)
 */
export declare function computeTurnoutProbability(engPos: number, archSaliences: Record<string, number>, ctx: ElectionContext, bestCandidateResonance: number): number;
