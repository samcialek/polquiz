/**
 * Phase 3 regression baseline emitter.
 *
 * Runs simulateOne(noiseSigma=0, seed=0) over every archetype in array order
 * under the new Euclidean WTA scorer, aggregates into the canonical baseline
 * JSON shape, and writes it to results/phase3/scoring-baseline-phase3.json.
 *
 * The pre-Phase-3 byte-compare against scoring-baseline-fresh.json is dropped
 * because the scorer change makes that comparison meaningless. The Phase-2
 * baseline at results/phase3/scoring-baseline-pre-3b.json remains on disk for
 * historical reference.
 *
 * Usage:
 *   npx tsx src/eval/regression.ts
 */
export {};
