/**
 * Historical Election Simulation
 *
 * For each election, computes which candidate each archetype would vote for
 * (or abstain) based on alignment scores weighted by salience, with turnout
 * modeled by ENG node.
 *
 * Includes:
 * - Partisan override: high-PF archetypes get a party loyalty bonus
 * - Era-context modifiers: flat bonuses for landslide elections
 *
 * Usage: npx tsx src/historical/simulate.ts
 */
import { type CandidateProfile } from "./candidates.js";
import type { Archetype } from "../types.js";
import { type ElectionContext } from "./activation.js";
/** Deterministic turnout: vote if ENG-based probability >= 0.5 */
declare function willVote(engPos: number): boolean;
/**
 * Compute alignment between an archetype and a candidate.
 *
 * For each continuous node:
 *   alignment_i = salience × (1 - |archetype_pos - candidate_pos| / 4)
 *
 * For categorical nodes (EPS, AES):
 *   alignment_i = salience × prob[candidate_category]
 *   (how much the archetype's probability distribution favors the candidate's category)
 *
 * Then adds partisan override (FIX 2) and era bonus (FIX 3).
 */
declare function computeAlignment(arch: Archetype, cand: CandidateProfile, year: number, ctx?: ElectionContext): number;
interface VoteResult {
    archetypeId: string;
    archetypeName: string;
    votes: Record<number, string>;
}
declare function simulate(): VoteResult[];
export { simulate, computeAlignment, willVote, type VoteResult };
