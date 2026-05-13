/**
 * Step 5 analyzer — per-dimension and per-UI-type × per-dimension variance
 * reduction, derived from the Step 5 node-state capture.
 *
 * Streams sigma-{00,05,15}.jsonl (three files, ~1GB total) without loading
 * full JSONL into memory. Uses the *final* node state snapshot per run for
 * entropy/variance-reduction stats; uses the per-question touch deltas for
 * per-UI-type × per-dimension metrics.
 *
 * Outputs in results/step5/:
 *   per-node-variance-reduction.csv
 *   per-archetype-per-node.csv
 *   per-ui-type-per-node.csv
 *   ui-type-counts.csv
 *   report.md
 */
export {};
