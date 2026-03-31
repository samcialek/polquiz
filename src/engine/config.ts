/**
 * Fixed first 16 question IDs — these are always asked first in order.
 * They establish baseline coverage across all major nodes.
 */
export const FIXED_16: readonly number[] = [
  1, 2, 3, 4, 11, 15, 20, 21, 23, 31, 40, 47,
  // The last 4 ensure we touch remaining SELF/REALITY nodes
  // that aren't well-covered by the first 12
  8, 56, 60, 63,
] as const;
