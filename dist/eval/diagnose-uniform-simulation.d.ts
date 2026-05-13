/**
 * Uniform-distribution election diagnostic.
 *
 * Instead of simulating the actual quiz from archetype centroids (which
 * concentrates the population at the 121 archetype positions), this sampler
 * imagines a respondent population distributed uniformly across the entire
 * 11-node continuous ideological space. For each hypothetical respondent,
 * run predictVote() against all 60 elections and aggregate winners.
 *
 * This is the "what if every combination of positions was equally likely"
 * counterfactual to the centroid simulation. Useful for seeing which candidates
 * would have broad natural appeal vs. which only win because they align with
 * specific archetype clusters.
 *
 * Sampling:
 *   - each of 11 scoring nodes: position ~ Uniform(1, 5), salience fixed at 2
 *     (matches the ~mean salience seen in centroid sim, so weight structure
 *     is comparable)
 *   - ENG: position ~ Uniform(1, 5) → engagement level bucketed as in
 *     engagementLabel.ts (<2 apolitical, <3 casual, <4 engaged, else highly-engaged)
 *   - categorical nodes (EPS/AES) excluded from distance compute already, so
 *     no sampling needed for them.
 *
 * Output: results/centroid-sim/uniform-frequencies.json, parallel shape to
 * candidate-frequencies.json so centroid-viz.html can toggle between modes.
 *
 * Usage:
 *   npx tsx src/eval/diagnose-uniform-simulation.ts           # default 10k samples
 *   npx tsx src/eval/diagnose-uniform-simulation.ts --samples=50000
 */
export {};
