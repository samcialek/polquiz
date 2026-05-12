/**
 * Archetype labeler (2026-05-12).
 *
 * Generates a salience-driven label for a respondent (or archetype-as-respondent)
 * from their position + salience profile. Replaces the static archetype.name on
 * the v27 results page.
 *
 * Rules (per Sam, 2026-05-12):
 *   1. A node enters the label if its salience >= 2.5 / 3.
 *   2. The MOST salient node always emits a token, even if its position is in
 *      the mid bin (so "Mixed-Economy" can appear when MAT is the top-1).
 *   3. Top-2 and top-3 salient nodes emit tokens only if their position is in
 *      the low or high bin — mid drops out.
 *   4. Composition: try the merger-table lookup on the resulting token set
 *      (full, then 2-subset, then 1-subset); if a hit doesn't cover everything,
 *      prepend uncovered tokens. Else compose 1-3 lexicon fragments directly.
 *   5. Final label is capped at 3 words. Lower-salience tokens drop first.
 *
 * Categoricals (EPS / AES) emit their top category literally (Statesman,
 * Empiricist, etc.) — no mid bin. Moral circle emits "Universalist" when
 * universalAffinity is high with no scope excess, or a scope-tagged adjective
 * when one scope has clear excess.
 */
import type { Archetype } from "../types.js";
/**
 * Dump-shape respondent state — the structure stored in localStorage by
 * quiz-v2-live.html's finishResults(). The canonical RespondentState type
 * carries posDist/salDist arrays; the dump pre-computes expectedPos and
 * salience as scalars for downstream consumers. The labeler reads the dump
 * shape because that's what v27 has on hand.
 */
export interface LabelerRespondentState {
    continuous?: Record<string, {
        expectedPos?: number;
        salience?: number;
    } | undefined>;
    categorical?: Record<string, {
        catDist?: number[];
        salience?: number;
    } | undefined>;
    moralCircle?: {
        universalAffinity?: number;
        scopedAffinities?: Record<string, number | null>;
        intensity03?: number;
    } | null;
}
interface PoleTokens {
    low: string;
    mid: string;
    high: string;
}
/**
 * Continuous-node lexicon. Three bins per node:
 *   low  → position ≤ 2.5
 *   mid  → 2.5 < position < 3.5  (only contributes when top-1 salient)
 *   high → position ≥ 3.5
 */
export declare const POSITION_LEXICON: Record<string, PoleTokens>;
/** EPS categorical labels, indexed 0-5. */
export declare const EPS_LEXICON: readonly string[];
/** AES categorical labels, indexed 0-5. */
export declare const AES_LEXICON: readonly string[];
/** Moral-circle scope adjectives — when a single scope has clear excess. */
export declare const MORAL_CIRCLE_SCOPE_LEXICON: Record<string, string>;
export type Bin = "low" | "mid" | "high";
export interface TokenEntry {
    node: string;
    bin: Bin | string;
    token: string;
    salience: number;
    isCategorical: boolean;
}
export declare function tokenizeRespondent(state: LabelerRespondentState): TokenEntry[];
export declare function tokenizeArchetype(arch: Archetype): TokenEntry[];
export declare function selectLabelTokens(entries: TokenEntry[]): TokenEntry[];
export declare function signatureOf(tokens: TokenEntry[]): string;
export interface MergerTable {
    [signatureKey: string]: string;
}
export interface ComposeResult {
    label: string;
    source: "merger-full" | "merger-partial" | "compression" | "lexicon";
    signature: string;
    tokensUsed: TokenEntry[];
}
/**
 * Algorithm (revised 2026-05-12, per Sam):
 *   Lexicon composition is the DEFAULT. Merger lookup is a "save-a-word"
 *   overlay — it only fires when an exact 2-token or 3-token signature
 *   appears in the curated merger table. No partial / lossy / leftover-prefix
 *   matches; those produced output like "Dealmaker Tribal Insurgent" which
 *   sounded worse than the natural lexicon composition.
 *
 *   Flow:
 *     1. Compose lexicon directly from the tokens (top-N joined by space).
 *     2. If the full signature has a merger entry, swap to that.
 *     3. If a 2-subset (top-2) has a merger entry AND the 3rd token is
 *        meaningful, prepend the 3rd token to the merger name.
 *     4. Else use the lexicon composition.
 */
export declare function composeLabel(tokens: TokenEntry[], mergerTable: MergerTable): ComposeResult;
export declare function labelForRespondent(state: LabelerRespondentState, mergerTable: MergerTable): ComposeResult;
export declare function labelForArchetype(arch: Archetype, mergerTable: MergerTable): ComposeResult;
/**
 * Default merger table — embedded so the browser bundle works without a
 * separate fetch. Mirrors src/identity/mergerTable.json. When the JSON file
 * changes, re-paste here (or wire a build step).
 */
export declare const DEFAULT_MERGER_TABLE: MergerTable;
/**
 * Compression table — token PAIR → ONE word.
 *
 * Different from the merger table:
 *   merger:      signature → iconic multi-word name (preserves "Institutional Leftist")
 *   compression: signature → single-word semantic substitute (combines two ideas)
 *
 * Compression runs inside the lexicon path only. If the full signature has a
 * merger hit, the merger wins. Otherwise the composer scans the token list for
 * a compressible pair, substitutes with one word, and joins remaining tokens.
 *
 * Keep signatures sorted alphabetically (same format as merger table).
 */
export declare const COMPRESSION_TABLE: MergerTable;
export declare function posRank(token: string): number;
/**
 * Browser-friendly wrapper: takes a respondent state (dump shape) and returns
 * just the composed label string. Uses the embedded default merger table.
 */
export declare function composeArchetypeLabel(state: LabelerRespondentState): string;
export {};
