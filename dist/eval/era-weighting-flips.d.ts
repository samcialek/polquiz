/**
 * Dump every archetype-election flip for a given set of years. A flip is an
 * archetype whose nearest candidate differs between flat-salience scoring and
 * era-weighted scoring (the blend `effectiveSal = 0.6·sigSal + 0.4·eraSal`).
 *
 * Output: flat JSON + human-readable markdown for
 *   results/alignment-stage-a/era-weighting-flips-raw.md
 *
 *   npx tsx src/eval/era-weighting-flips.ts
 */
export {};
