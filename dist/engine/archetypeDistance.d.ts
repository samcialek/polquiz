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
 * Return archetypes that are still "viable" — i.e. their posterior
 * is above a minimum threshold relative to the leader.
 */
export declare function viableArchetypes(state: RespondentState, archetypes: Archetype[], minRelative?: number): Archetype[];
