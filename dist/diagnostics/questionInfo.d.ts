/**
 * Per-question information-gain audit.
 *
 * For every question in the representative + full banks, simulate each
 * reasonable answer, measure the Jensen-Shannon divergence between the
 * uniform prior and the resulting posterior on every node the question
 * declares it touches (and every node the evidence actually writes to).
 *
 * Outputs:
 *   results/question-info-audit/by-question.jsonl
 *     One row per question with per-node mean/max/min JSD on pos, sal, cat.
 *   results/question-info-audit/weak-spots.md
 *     Human-readable diagnosis of the weakest touches + hollow declarations.
 *
 * Usage:
 *   npx tsx src/diagnostics/questionInfo.ts
 */
export {};
