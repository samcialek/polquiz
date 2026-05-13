/**
 * Candidate-signature audit.
 *
 * For each historical candidate in candidates.ts, compute pure ideological
 * distance (no era multipliers, no non-ideological modifier) to every active
 * archetype centroid. Identify:
 *   (a) the 5 closest archetypes per candidate, and
 *   (b) the 5 farthest archetypes per candidate.
 *
 * Flag candidates whose closest archetypes look structurally wrong — e.g.,
 * McGovern's closest should be universalist left-progressive archetypes, not
 * particularist conservatives.
 */
export {};
