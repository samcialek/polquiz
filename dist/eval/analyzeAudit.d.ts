/**
 * Audit secondary analysis: reads results/audit/entity-scores.jsonl and produces:
 *   - Reproducibility: compare our top-1 candidate-per-year to stored election_results_60.csv
 *   - Coverage: non-identifiability overlap, deactivated sanity, pre-registered pair presence
 *   - Internal consistency:
 *       * Cross-ref-set coherence (archetype's top-1 candidate vs top-1 regime — semantic spot-check)
 *       * Within-ref-set spread (mean pairwise distance of entities per archetype)
 *   - Post-2000 stagnancy hypothesis: per archetype, are all 2000-2024 top-1 candidates the same party?
 *
 * Writes: results/audit/report.md + supporting CSVs
 */
export {};
