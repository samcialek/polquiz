/**
 * Compute the full archetype->candidate distance matrix for a given year set,
 * bypassing the audit's top-5 cap. Writes results/reconciliation/full-distances.jsonl
 * so Python reconciliation can see PRISM's *implicit* vote for every archetype.
 *
 * Usage:
 *   npx tsx src/eval/fullDistanceMatrix.ts
 */
export {};
