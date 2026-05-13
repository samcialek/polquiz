/**
 * PRISM Archetype-Entity Alignment Audit
 *
 * For each entity (US presidential candidate × year, global regime period),
 * compute the 118-active-archetype distance vector using the `archetypeDistance`
 * baseline from the quiz, convert to posterior via softmax (T=0.04 — same as
 * quiz at termination), and record:
 *
 *   - Top-5 archetypes with scores + posterior probabilities
 *   - Top-3 node drivers (nodes contributing MOST to low distance = support)
 *   - Top-3 node tensions (nodes contributing MOST to high distance = misfit)
 *   - Family-pair flag (margin between rank 1 and 2 < 0.03)
 *   - Signature-distance family-pair flag (rank-1/rank-2 archetype pair is
 *     in the 10th-percentile tail of pairwise archetype-archetype distance)
 *
 * Operates on fully-observed entity profiles (position + categorical are
 * one-hot; salience is uniform since entity profiles don't encode salience
 * independently of position).
 *
 * Usage:
 *   npx tsx src/eval/runAudit.ts
 *
 * Outputs (under results/audit/):
 *   - entity-scores.jsonl        one line per entity with full top-5 + drivers
 *   - face-validity.csv          flat CSV for spot-checking
 *   - manifest.json              provenance + summary stats
 */
export {};
