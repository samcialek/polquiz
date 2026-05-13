/**
 * Phase 3f — duplicate archetype detection.
 *
 * Runs `buildArchetypeFamilies` over all 121 archetypes (active + deactivated)
 * and reports the lowest pairwise Euclidean distances using the same scoring
 * metric the production family index uses. The goal: surface archetype pairs
 * that became indistinguishable (or near-indistinguishable) after ENG was
 * removed from signatures in 3b. Candidates for consolidation or signature
 * sharpening show up at the top of the list.
 *
 * Usage:
 *   npx tsx src/eval/detectDuplicates.ts
 *
 * Output:
 *   results/phase3/duplicate-archetypes.md
 */
export {};
