/**
 * Build consolidated LLM-review reference.
 *
 * Emits a single Markdown file and a single JSON file to
 * `results/llm-review/` containing every input another LLM would need
 * to independently audit the PRISM election + regime-alignment outputs:
 *
 *   - 14-node system (cluster, polarity legend, category definitions)
 *   - All 121 archetypes (id, name, tier, node signature, semantic description)
 *   - 60 US presidential elections with candidate node profiles (1789–2024)
 *   - 47 jurisdictions × ~368 regime periods with node profiles (1789–2026)
 *   - PRISM's computed election votes per archetype × year
 *   - PRISM's computed regime alignment scores per archetype × regime
 *   - Scoring-formula notes (enough to reproduce, not the full code)
 *
 * Usage:
 *   npx tsx src/eval/buildLLMReference.ts
 */
export {};
