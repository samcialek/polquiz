/**
 * Sanity check for the respondent-signature election prediction pipeline.
 *
 * Two passes:
 *   1. Build a NodeSignature directly from an archetype template and run
 *      predictVote across all 60 elections for each engagement level.
 *   2. Build a RespondentState with hand-set posteriors concentrated on the
 *      target archetype's node values, then confirm derivation → predictVote
 *      produces comparable output.
 */
export {};
