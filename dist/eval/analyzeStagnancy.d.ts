/**
 * Proper post-2000 stagnancy analysis: for each archetype, compute the full
 * archetypeDistance vector against EVERY candidate in every post-2000 election
 * (not just top-5). Determine argmin per year → the candidate that best matches
 * the archetype. Then measure how often the party switches across 2000-2024.
 *
 * Also: per-archetype inverse coherence — rank candidates across all years for
 * each archetype and surface top-3 candidate matches overall.
 *
 * User's hypothesis: "since 2000 single-party voting for 75% of the electorate".
 * If our data shows most archetypes switching parties across 2000-2024, the
 * archetype-candidate distance pipeline is too diffuse.
 */
export {};
