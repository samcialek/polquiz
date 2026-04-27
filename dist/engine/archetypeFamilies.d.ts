import type { Archetype } from "../types.js";
/**
 * Phase 3 family-detection module.
 *
 * Pre-computes the pairwise archetype-to-archetype Euclidean distance matrix
 * and derives the family-membership set per archetype.
 *
 * Per node distance (no respondent state involved, so no anti penalty):
 *   - Continuous:  (p^A - p^B)² * max(s^A, s^B)
 *   - Categorical: Σ_k (probs^A[k] - probs^B[k])² * max(s^A, s^B)
 *
 * If either archetype lacks a template for the node, the node is skipped — so
 * ENG (no signature on any archetype as of 3b) drops out automatically.
 *
 * The pairwise distance is sqrt(Σ d_i). Over all non-self pairs, the 10th
 * percentile defines the family threshold. familyOf[A] = {B ≠ A : pairwise[A][B] ≤ threshold}.
 *
 * Deactivated archetypes are still included — they cannot win MAP, so their
 * presence as neighbours of a winning archetype is harmless and keeps the
 * lookup symmetric.
 */
export interface ArchetypeFamilyIndex {
    pairwise: Record<string, Record<string, number>>;
    familyOf: Record<string, ReadonlySet<string>>;
    threshold: number;
}
export declare function buildArchetypeFamilies(archetypes: Archetype[]): ArchetypeFamilyIndex;
