/**
 * Candidate-to-archetype matching diagnostic.
 *
 * For each presidential candidate in candidates.ts, compute the engine's
 * archetypeDistance against all 121 active archetypes and rank them. Output:
 * top-3 archetype matches per candidate. Uses the same archetypeDistance
 * function the live quiz uses for scoring — so a candidate's "archetype" is
 * literally the archetype a PRISM respondent with that candidate's signature
 * would be classified as.
 *
 * The candidate profile is converted to a synthetic RespondentState with
 * posDist peaked at the candidate's coded position, salDist peaked at sal=2
 * (moderate caring, a reasonable default for political figures), and catDist
 * peaked at the coded categorical index.
 *
 * Output: results/centroid-sim/candidate-archetype-matches.json
 */
export {};
