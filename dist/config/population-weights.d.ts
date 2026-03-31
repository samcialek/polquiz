/**
 * Population weights for 130 PRISM archetypes.
 *
 * Each value is the estimated fraction of the US adult population that falls
 * into that archetype. Weights sum to 1.0 (within rounding tolerance).
 *
 * Design constraints:
 *   - Conservative + moderate archetypes ≈ 55-60% of total
 *   - Progressive / left archetypes ≈ 35-40%
 *   - Fringe / extreme types ≈ 5-10%
 *   - Produces approximately Biden 51% / Trump 47% under equal-turnout
 *   - Reflects US demographics: rural/urban split, education, income, religion
 */
export declare const POPULATION_WEIGHTS: Record<string, number>;
