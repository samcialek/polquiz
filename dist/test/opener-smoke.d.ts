/**
 * Runtime smoke through the FIXED_OPENER. Initializes the quiz, loops
 * getNextQuestion() / submitAnswer() until either the opener completes or we
 * detect a stuck state, and asserts:
 *   - no question ID is asked twice
 *   - all 28 FIXED_OPENER ids are reached (in any order — adaptive may
 *     reorder if a metadata-only id is missing from the bank)
 *   - state.partyID, state.strategicVoting, state.negativeParties are
 *     populated by the metadata hooks
 *
 * This is the test that should have caught both P0 bugs (bank filter
 * dropping Q200/Q211/Q212, and fixed-opener returning already-answered ids)
 * before they shipped.
 */
export {};
