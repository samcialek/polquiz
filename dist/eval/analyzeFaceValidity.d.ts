/**
 * Face-validity spot-check: surface pairs (archetype, entity) that are
 * semantically implausible. Uses structured rules:
 *
 *   - Identity-primary archetypes (141-146) should vote same-side as their identity
 *     suggests: LGBTQ Voter shouldn't top-1 McCain/Romney/Trump; White Grievance
 *     shouldn't top-1 progressive-era Dems; Black Voter shouldn't top-1 Segregationists.
 *   - Radical-left archetypes (011-017 Jacobin/Class-War/Redistributionist) shouldn't
 *     have Republican preference post-1960.
 *   - Traditionalist-right archetypes (086, 088, 089, 137) shouldn't have Democratic
 *     preference post-1964 (post-civil-rights realignment).
 *   - Archetype-regime: cosmopolitan/universalist archetypes paired with fascist/
 *     authoritarian regimes suggests distance function aligned on wrong dimensions.
 *
 * Also: list pre-registered pair {098↔102} and {070↔075} exact distances to show
 * why they never surface as top-1/top-2.
 */
export {};
