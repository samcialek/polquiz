/**
 * Layer 1 — Question Discrimination Audit.
 *
 * For each question Q and each meaningful answer-signal O in Q, apply that
 * answer to a fresh uniform state and measure how much the archetype posterior
 * shifts from uniform. A question that doesn't move the posterior (low KL
 * across all its options) is not discriminating between archetypes.
 *
 * Output:
 *   - output/question-discrimination.json : per-Q, per-option metrics
 *   - console summary + ranked table of weakest questions
 */
export {};
