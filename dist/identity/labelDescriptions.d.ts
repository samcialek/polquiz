/**
 * Label descriptions (2026-05-12).
 *
 * Three-sentence prose descriptions keyed by the iconic label strings the
 * composer can emit. Two tiers:
 *
 *   1. LABEL_DESCRIPTIONS — hand-written entries for the 234 unique labels
 *      that appear in DEFAULT_MERGER_TABLE and COMPRESSION_TABLE.
 *   2. composeAtomFallback() — a one-line "you emphasize X, Y, and Z"
 *      generated from per-token fragments when the label is pure lexicon
 *      composition (no merger or compression fired).
 *
 * Lookup: try the exact composed label first; if missing, peel off a
 * leading "Anti-Institutional " / "Anti-Capitalist " prefix and retry on
 * the iconic tail; if still missing, fall back to per-atom synthesis.
 */
import type { TokenEntry } from "./archetypeLabeler.js";
export declare const LABEL_DESCRIPTIONS: Record<string, string>;
export declare function composeAtomFallback(tokens: TokenEntry[]): string;
/**
 * Top-level composer. Returns a 3-sentence iconic description when one
 * matches the label; otherwise returns a 1-sentence atom-fallback summary.
 */
export declare function composeArchetypeDescription(label: string, tokens: TokenEntry[]): string;
