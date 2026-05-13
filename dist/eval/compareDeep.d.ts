/**
 * Deep diagnostic: per-step trajectory capture for Bayesian vs. averaging
 * on identical answer streams.
 *
 * For each of 118 active archetypes at noiseSigma=0, runs the lockstep
 * harness and records — at every question step — each engine's top-1,
 * target rank, leader distance, gap ratio, and consecutive-lead count.
 *
 * Analysis:
 *   (1) Convergence: first question k where top-1 == target and stays so
 *       to end.
 *   (2) Would-stop: first question k where a simplified stop criterion
 *       fires (k >= 25, gap_ratio >= 0.10, consec_lead >= 3). Same thresholds
 *       applied to both engines.
 *   (3) Top-1 stability: number of flips across the run.
 *   (4) Final-rank distribution for target.
 *   (5) Attractor frequency: which archetypes do averaging mis-pick most?
 *   (6) Drift by target pos: systematic regression toward mean?
 *
 * Outputs:
 *   results/architecture/bayesian-vs-averaging-deep.md
 *   results/architecture/bayesian-vs-averaging-deep-trajectories.jsonl
 */
export {};
