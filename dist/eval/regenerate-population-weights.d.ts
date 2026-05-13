/**
 * Regenerate output/live-data/population-weights.json from a heuristic
 * "typicality" score, replacing the near-uniform distribution that was there
 * (0.003–0.008 range, ~2.5× spread) with a realistic-shape distribution where
 * moderate archetypes carry most of the mass.
 *
 * Heuristic typicality score per archetype:
 *   - start at 0
 *   - + 1.0 per continuous node with pos == 1 or 5 (ideological extreme)
 *   - + 0.4 per continuous node with pos == 2 or 4 (off-center)
 *   - + 0.6 per node with sal == 3 (high salience on any axis)
 *   - + 1.0 per `anti` flag (explicit rejection of a pole)
 *   - + 1.5 per archetype.antiCats entry on categorical nodes
 *   - + 2.0 if archetype.id ∈ identity-primary set (141–146)
 *
 * Weight = exp(-score / T), T tuned to give ~12× spread (most-typical vs
 * least-typical). Renormalize to sum to 1.
 *
 * Writes: output/live-data/population-weights.json
 * Backs up old: output/live-data/population-weights-pre-realistic-BAK.json
 */
export {};
