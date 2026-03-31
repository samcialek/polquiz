import type { Archetype, QuestionDef, RespondentState } from "../types.js";
/**
 * Evaluate a question's eligibleIf rules against the current respondent state.
 *
 * - If no eligibleIf array exists, the question is always eligible.
 * - If the array is present, at least one predicate must be true (OR semantics).
 */
export declare function isQuestionEligible(state: RespondentState, q: QuestionDef): boolean;
/**
 * Prune archetypes whose salience requirements conflict with the
 * respondent's established salience profile.
 */
export declare function pruneByRespondentSalience(state: RespondentState, archetypes: Archetype[], threshold?: number): Archetype[];
export declare function selectNextQuestion(state: RespondentState, available: QuestionDef[], archetypes: Archetype[]): QuestionDef | null;
export declare function scoreQuestionForExposure(state: RespondentState, q: QuestionDef, archetypes: Archetype[]): number;
export declare function selectNextBatch(state: RespondentState, available: QuestionDef[], archetypes: Archetype[]): QuestionDef[];
