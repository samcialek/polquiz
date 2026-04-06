import type { Archetype, RespondentState } from "../types.js";
/**
 * Compute the distance between a respondent's current state and an archetype.
 * Lower distance = better match.
 *
 * The distance considers both position and salience on each node,
 * weighted by the archetype's salience (high-sal nodes matter more
 * for differentiating that archetype) and the respondent's salience
 * (nodes the respondent cares about are weighted more heavily).
 */
export declare function archetypeDistance(state: RespondentState, archetype: Archetype): number;
/**
 * V1: Salience-Gated Accumulative scoring.
 * Instead of averaging across all nodes, only scores nodes where archetype
 * has sal >= 1 and accumulates log-likelihood (no division by total weight).
 * Niche archetypes with more salient nodes get MORE signal, not diluted signal.
 */
export declare function archetypeDistanceV1(state: RespondentState, archetype: Archetype): number;
/**
 * V2: Touch-Weighted Sharpened scoring.
 * Same weighted-average structure as baseline but:
 * 1. Skips nodes with 0 touches (don't dilute with unmeasured nodes)
 * 2. Scales nodeWeight by log(1 + touches)
 * 3. Wider archSalWeight range: 0.25 + sal * 0.75
 */
export declare function archetypeDistanceV2(state: RespondentState, archetype: Archetype): number;
/**
 * Return archetypes that are still "viable" — i.e. their posterior
 * is above a minimum threshold relative to the leader.
 */
export declare function viableArchetypes(state: RespondentState, archetypes: Archetype[], minRelative?: number): Archetype[];
