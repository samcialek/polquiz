/**
 * TRB anchor diagnostic: measure per-touch JSD on the trbAnchor dist, and
 * detect whether any touches write to bins the anchor dist treats as dead.
 *
 * Runs against results/step5/sigma-00.jsonl (121 deterministic runs — clean
 * signal, no noise).
 *
 * Outputs:
 *   results/trb-fix/per-touch-stats.json
 *     { count, median_jsd, mean_jsd, max_jsd, min_jsd, zero_touch_count,
 *       histogram_bins, by_archetype, per_touch_sample }
 *   results/trb-fix/per-archetype.csv
 *     archetype_id, arch_name, touches, final_H, final_max_bin, var_reduction_pct
 *   results/trb-fix/mass-conservation.txt
 *     Single-archetype trace: before/after each touch, dist, sum(dist), and
 *     whether gender (idx 5) and sexual (idx 6) ever receive non-trivial mass.
 */
export {};
