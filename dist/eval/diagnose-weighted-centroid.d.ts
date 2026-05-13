/**
 * Population-weighted centroid diagnostic.
 *
 * Like diagnose-centroid-simulation but aggregates each archetype's predicted
 * votes by the archetype's empirical population weight (from
 * output/live-data/population-weights.json) rather than treating every
 * archetype as equally frequent. This lets us compare the simulation to real
 * popular-vote shares under a realistic population mix.
 *
 * For each archetype A:
 *   - run NUM_REPS quiz simulations with noise
 *   - for each run, compute predicted election winner per year
 *   - the archetype's "vote share" per year is the fraction of reps picking
 *     each candidate
 *   - aggregate across archetypes weighted by POP[A]
 *
 * Output: results/centroid-sim/weighted-frequencies.json (plus ON/OFF variants).
 *
 * Usage:
 *   npx tsx src/eval/diagnose-weighted-centroid.ts              # non-ideo ON
 *   PRISM_NONIDEO=0 npx tsx src/eval/diagnose-weighted-centroid.ts  # non-ideo OFF
 *   npx tsx src/eval/diagnose-weighted-centroid.ts --reps=10
 */
export {};
