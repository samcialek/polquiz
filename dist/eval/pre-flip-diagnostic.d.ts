/**
 * Pre-flip diagnostic for PRISM_NONIDEO default-on decision.
 *
 * Runs the full 121 × 60 grid OFF and ON, plus top-3 tracking for L5
 * marquees (001, 019), plus a Founding Father alignment check over
 * 1789-1824, plus a structural verification that regime-alignment.ts does
 * not import the modifier.
 *
 * Writes four files under results/non-ideological-layer/:
 *   - per-archetype-deltas.csv
 *   - per-archetype-report.md
 *   - l5-stability-report.md
 *   - pre-flip-diagnostic-summary.md
 *
 * Reversal thresholds (pre-declared):
 *   - per-archetype delta ≤ -5 pp → STOP
 *   - any L5 archetype with top-3 membership change on any election → STOP
 *   - any Founding Father alignment change ≥ 0.5 distance-units → FLAG
 *   - regime-alignment must be byte-identical → structural check (imports)
 *
 *   npx tsx src/eval/pre-flip-diagnostic.ts
 */
export {};
