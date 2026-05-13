/**
 * PRISM non-ideological modifier layer.
 *
 * Canonical data lives in non-ideological-data.json. This module:
 *   - declares the NonIdeologicalModifier type,
 *   - loads + validates the JSON at module-load time,
 *   - exports getNonIdeologicalModifier(year, candidateKey) returning the
 *     three components + their weighted-and-clipped total,
 *   - exports historicalToCanonical(name, year) — resolves candidate names
 *     used in src/historical/candidates.ts (bare last names like "Roosevelt")
 *     to the disambiguated keys used in consensus-final.json + this data file
 *     (e.g., "Roosevelt_1932" → "RooseveltFranklin_1932"). This is the
 *     crosswalk used at the integration point in respondentVoteChoice.ts.
 *
 * Composition (see data file _meta.formula):
 *   non_ideo = 0.60 * economic + 0.20 * incumbency + 0.20 * charisma,
 *   clipped to [-0.30, +0.30].
 *
 * Application at call site:
 *   final_distance = ideological_distance - non_ideo
 * (positive total helps the candidate — pulls distance down).
 *
 * Third-party candidates get economic_component = 0 (neither rewarded nor
 * punished for the incumbent party's record).
 */
export interface NonIdeologicalModifier {
    economic: number;
    incumbency: number;
    charisma: number;
    total: number;
}
/**
 * Resolve a "<name>_<year>" key from candidates.ts to the data-file key.
 * Falls back to the raw concatenation for names that don't need disambiguation.
 */
export declare function historicalToCanonical(name: string, year: number): string;
/**
 * Look up (year, candidateKey) in the non-ideological data file and return
 * the three modifier components plus the weighted-and-capped total.
 *
 * candidateKey must be a data-file key (e.g., "Roosevelt_1932"), not a
 * candidates.ts bare-name key. Call historicalToCanonical() first if
 * going from the respondent-vote-choice integration point.
 *
 * Returns an all-zero modifier if the year or candidate key is unknown.
 * (Unknown inputs must not crash the alignment pipeline; they just
 * contribute no nudge.)
 */
export declare function getNonIdeologicalModifier(year: number, candidateKey: string): NonIdeologicalModifier;
