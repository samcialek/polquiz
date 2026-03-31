/**
 * PRISM Quiz Engine — Full Diagnostic Simulation
 *
 * Two diagnostic modes:
 *
 * 1. ARCHETYPE SIMULATIONS: For each archetype, run N simulated quiz sessions
 *    with temperature-based noisy answer selection (softmax over option scores).
 *    Tracks top-1, top-3, top-5 accuracy, avg questions, margin, posterior.
 *
 * 2. RANDOM WALK SIMULATIONS: Completely random responses to test pipeline
 *    robustness. Tracks archetype distribution, entropy, question counts.
 *
 * Usage:
 *   npx tsx src/test/full-diagnostic.ts                    # Full run (all archetypes × 100 + 10k random)
 *   npx tsx src/test/full-diagnostic.ts --archetype-only   # Archetype sims only
 *   npx tsx src/test/full-diagnostic.ts --random-only      # Random walks only
 *   npx tsx src/test/full-diagnostic.ts --runs 10          # Override runs per archetype
 *   npx tsx src/test/full-diagnostic.ts --random-runs 1000 # Override random walk count
 *   npx tsx src/test/full-diagnostic.ts --temp 0.4         # Override temperature (default 0.35)
 */
export {};
