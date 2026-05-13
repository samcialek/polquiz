/**
 * Diagnostic report for the respondent-signature election prediction pipeline.
 *
 * Runs five tests against every active archetype × every US election:
 *   A. Distance distribution — histogram of nearest-candidate distances, to
 *      sanity-check clearing-bar thresholds
 *   B. Era-transformation impact — how often the era-weighted salience blend
 *      flips the nearest candidate vs. archetype-salience only
 *   C. Engagement-threshold turnout — vote rate by engagement level
 *   D. Per-election candidate separation — which elections are landslides vs
 *      close calls in signature distance units
 *   E. Historical sanity check — known archetypes land on plausible candidates
 *
 * Writes results/election-pipeline-diagnostic.md.
 *
 *   npx tsx src/eval/diagnose-election-pipeline.ts
 */
export {};
