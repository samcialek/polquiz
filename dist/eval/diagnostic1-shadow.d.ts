/**
 * Diagnostic 1 — old softmax-of-distance scorer vs current Euclidean WTA.
 *
 * Runs the current harness (current selector, current stop-rule, current
 * answer generation) over all archetypes at σ=0 seed=0, then at each run's
 * final state re-scores with THREE variants and compares winners to the
 * current WTA pick:
 *
 *   (A) new Euclidean WTA  — current production scorer, argmin(distance)
 *   (B) old scalar distance, argmin                 (no softmax, no priors)
 *   (C) old scalar distance, softmax with uniform prior (1/n_active)
 *   (D) old scalar distance, softmax with a.prior   (codebase-native priors;
 *       these happen to be uniform 1/118 for actives and 0 for deactivates,
 *       so C and D should be effectively equivalent — but we run both to
 *       verify arithmetically.)
 *
 * Usage:
 *   npx tsx src/eval/diagnostic1-shadow.ts
 *
 * Emits: results/phase3/diagnostic-artifacts/diagnostic-1-results.json
 */
export {};
