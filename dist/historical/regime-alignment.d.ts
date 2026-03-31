/**
 * Regime Alignment Score (-3 to +3)
 *
 * Based on Sam's original PRISM alignment formula:
 *   support = 100 × exp(-(distance / σ)²)      // Gaussian decay
 *   alignment = (support / 50 - 1) × 3          // Maps 0-100 → -3 to +3
 *
 * Key design:
 * - Refracted salience: era shifts what matters
 *     effectiveSal = (1 - α) × archetype_sal + α × era_sal
 *     where α = 0.4 (era influence on what you care about)
 * - ENG is NOT used — engagement is emergent from alignment, not a trait
 * - Gaussian decay — near-agreement = high support, far = ~zero
 * - Continuous output, converted to turnout probability via sigmoid
 */
import type { Archetype } from "../types.js";
import type { CandidateProfile } from "./candidates.js";
import type { ElectionContext } from "./activation.js";
/**
 * Compute regime alignment: best alignment across all candidates.
 * This is how aligned you are with the BEST option available.
 */
export declare function computeRegimeAlignment(arch: Archetype, candidates: CandidateProfile[], ctx: ElectionContext): {
    alignment: number;
    bestCandidate: string;
    bestScore: number;
};
/**
 * Convert regime alignment score to turnout probability.
 *
 * -3 → ~5%   (totally alienated, no point voting)
 * -2 → ~15%
 * -1 → ~30%
 *  0 → ~50%  (coin flip)
 * +1 → ~70%
 * +2 → ~85%
 * +3 → ~95%  (maximally motivated)
 */
export declare function alignmentToTurnout(alignment: number, intensity?: number): number;
/**
 * Full turnout decision for an archetype in an election.
 * ENG is NOT used — turnout emerges from alignment + context.
 */
export declare function computeTurnoutFromAlignment(arch: Archetype, candidates: CandidateProfile[], ctx: ElectionContext): {
    alignment: number;
    turnoutProbability: number;
    votes: boolean;
};
/**
 * Gaussian vote choice: pick the candidate with the best alignment score.
 * Uses the same Gaussian distance formula as turnout, ensuring consistency.
 * Returns the best candidate name and alignment score.
 */
export declare function gaussianVoteChoice(arch: Archetype, candidates: CandidateProfile[], ctx: ElectionContext): {
    bestCandidate: string;
    bestAlignment: number;
    scores: Record<string, number>;
};
