/**
 * Build a compact "sample-pack" file for the biased LLM instance.
 *
 * The full prism-reference.md is too large for some LLM document parsers.
 * This produces a ~20 KB file containing only:
 *   - Reminder of the 9 sample archetype signatures + descriptions
 *   - Section 4 regime profiles for the 20 sampled regimes (covers the
 *     jurisdictions that may have truncated in the full upload — Iran,
 *     Saudi Arabia, South Africa in particular).
 *   - Section 5 filtered to 9 archetypes × 8 elections = 72 rows.
 *   - Section 6 filtered to 9 archetypes × 20 regimes = 180 rows.
 *
 * Usage:
 *   npx tsx src/eval/buildLLMSamplePack.ts
 *
 * Output:
 *   results/llm-review/prism-sample-pack.md
 */
export {};
