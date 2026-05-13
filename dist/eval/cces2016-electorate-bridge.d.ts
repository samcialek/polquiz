/**
 * CCES 2016 -> PRISM electorate bridge.
 *
 * This is a diagnostic/evaluation pipeline, not a production scorer:
 *  1. stream the CCES 2016 Common Content file,
 *  2. map survey items into PRISM node posterior means + uncertainty proxies,
 *  3. validate against reported/validated presidential vote,
 *  4. run Clinton -> Sanders candidate swaps on the same weighted voters.
 *
 * Usage:
 *   npx tsx src/eval/cces2016-electorate-bridge.ts
 *
 * Optional:
 *   PRISM_NONIDEO=0 npx tsx src/eval/cces2016-electorate-bridge.ts
 */
export {};
