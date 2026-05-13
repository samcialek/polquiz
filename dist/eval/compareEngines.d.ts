/**
 * Bayesian vs. averaging engine comparison runner.
 *
 * For each active archetype, runs simulateCompared (from harnessAvg.ts) across
 * a small set of noise seeds. Produces:
 *   - Per-archetype agreement stats (top-1 / top-3 / top-5 agreement rate)
 *   - Aggregate top-1 accuracy for each engine
 *   - A table of archetypes where the two engines disagree on top-1
 *
 * Writes:
 *   - results/architecture/bayesian-vs-averaging-runs.jsonl
 *   - results/architecture/bayesian-vs-averaging-comparison.md
 *
 * Usage:
 *   npx tsx src/eval/compareEngines.ts          # full (118 archetypes × noise levels × reps)
 *   npx tsx src/eval/compareEngines.ts --smoke  # 10 archetypes × 1 rep each
 */
export {};
