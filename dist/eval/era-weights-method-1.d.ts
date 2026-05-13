/**
 * Phase 1 — Method 1: Candidate-spread variance.
 *
 * For each of 60 US presidential elections, compute per-node variance across
 * candidates in that election. A node where candidates vary widely is a node
 * the election is "about"; a node where they all cluster is a non-issue.
 *
 * Nodes covered: 13 (all PRISM nodes except ENG, which is excluded per
 * ADR-002 from alignment scoring). EPS and AES are categorical — variance
 * is computed over the integer category indices with the caveat noted in
 * the output file.
 *
 * Output:
 *   results/era-weights/method-1-candidate-spread.json
 *
 *   npx tsx src/eval/era-weights-method-1.ts
 */
export {};
