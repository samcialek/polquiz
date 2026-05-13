/**
 * Centroid-simulation diagnostic (2026-04-23).
 *
 * For each active archetype, run N simulations as if a respondent sits at the
 * archetype centroid plus a small amount of noise. Each simulation goes through
 * the actual quiz engine — FIXED_OPENER + adaptive selector + stop rule, via
 * harness.simulateOne() which uses the same update/nextQuestion/stopRule code
 * paths as the live browser quiz. After each simulated quiz completes, run
 * predictVote() for all 60 US presidential elections with era activation.
 *
 * Outputs (under results/centroid-sim/):
 *   - per-archetype-stats.json  — per-archetype node-signature stats (mean ±
 *                                 stddev over N reps) and per-election winner
 *                                 distributions for that archetype's centroid
 *   - candidate-frequencies.json — global per-election winner frequencies
 *                                  across every (archetype × rep) draw
 *   - signatures.jsonl          — one line per run with {archId, rep, sig}
 *
 * Usage:
 *   npx tsx src/eval/diagnose-centroid-simulation.ts            # full run
 *   npx tsx src/eval/diagnose-centroid-simulation.ts --smoke    # 10 arc × 5 reps
 *   npx tsx src/eval/diagnose-centroid-simulation.ts --reps=50
 *   npx tsx src/eval/diagnose-centroid-simulation.ts --noise=0.5
 */
export {};
