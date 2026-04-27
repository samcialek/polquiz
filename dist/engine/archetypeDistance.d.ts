import type { Archetype, RespondentState } from "../types.js";
/**
 * Weighted scalar distance between a respondent's current state and an archetype.
 * Lower distance = better match. Writes into state.archetypeDistances via the
 * engine's update step; argmin over that map is the winner.
 *
 * Restored 2026-04-17 per ADR-003 after the Phase-3 Euclidean-WTA experiment
 * dropped top-1 from 86.8% → 45.5%. Diagnostic 1 showed this scorer recovers
 * 81.0% when fed Phase-3's selector's final states. The Phase-3 WTA is
 * preserved at archetypeDistanceWTA.ts as evidence. Prior / trbAnchorPrior
 * fields are NOT reinstated — D1 established they were always uniform and
 * cancelled under softmax normalization, so the softmax wrapper is gone too.
 *
 * Combines position mean-difference, position probability-at-target-pos,
 * salience mean-difference, and salience probability-at-target-sal. Weighted
 * by archetype-salience (high-sal nodes differentiate more) and respondent-
 * salience (nodes the respondent cares about weight more heavily). Anti flags
 * contribute a soft penalty scaled by how far past the threshold the expected
 * respondent position has drifted.
 */
export declare function archetypeDistance(state: RespondentState, archetype: Archetype): number;
/**
 * V1: Salience-Gated Accumulative scoring (legacy, preserved for diagnostics).
 *
 * Skips sal=0 nodes; accumulates log-likelihood weighted by salience. Used by
 * the optimization sweep in src/optimize/. Not used in production scoring.
 */
export declare function archetypeDistanceV1(state: RespondentState, archetype: Archetype): number;
/**
 * V2: Touch-Weighted Sharpened scoring (legacy, preserved for diagnostics).
 * Skips 0-touch nodes and scales node weight by log(1 + touches).
 */
export declare function archetypeDistanceV2(state: RespondentState, archetype: Archetype): number;
/**
 * Filter archetypes by relative distance to the leader. Returns archetypes
 * within (1 + ratio) * d_min. Replaces viableArchetypes which read posteriors.
 */
export declare function viableByDistance(state: RespondentState, archetypes: Archetype[], ratio?: number): Archetype[];
/**
 * Pre-computed rank-based weight distribution over the top-K archetypes
 * (by ascending distance), normalized to a probability distribution. Used by
 * adaptive selectors as the "concentration" proxy that posteriors used to play.
 *
 * w(a) = (d_max - d(a) + eps) / (d_max - d_min + eps), then normalize.
 */
export declare function topKDistanceWeights(state: RespondentState, archetypes: Archetype[], k?: number): {
    archetype: Archetype;
    distance: number;
    weight: number;
}[];
