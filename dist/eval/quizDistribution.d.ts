/**
 * Quiz distribution diagnostic.
 *
 * Exercises the real browser API (initQuiz → getNextQuestion → submitAnswer
 * → getResults) with three answer-generation strategies:
 *   1. Self-recovery — each archetype answers as itself. Lower bound on
 *      recoverable fraction under the live EIG selector + stop rule.
 *   2. Pole-grid — 48 patterns (ENDS 8 × REALITY 6) built as minimal
 *      "pseudo-archetype" profiles. Shows archetype-space coverage under a
 *      coarse persona generator.
 *   3. Monte Carlo — N random personas drawn as pseudo-archetypes with
 *      uniform pos/sal/cat. Organic reachability distribution.
 *
 * Respondent model is a copy of src/eval/harness.ts:generateAnswer, which
 * scores each option/bucket/ranking item against the archetype template and
 * picks the best. For non-archetype personas we synthesize an archetype-shaped
 * object so the same scorers apply.
 *
 * Answer formats follow src/browser/api.ts:submitAnswer — notably:
 *   - slider: numeric value (midpoint of best-scoring "a-b" bucket)
 *   - best_worst: { best: string[], worst: string[] } (top/bottom N)
 *   - allocation: softmax(score * 2) × 100 with rounding repair
 */
export {};
