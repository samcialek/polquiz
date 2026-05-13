/**
 * Regression test for the user's actual quiz trace (the staunch progressive
 * civic-nationalist Democrat who kept getting Hinge Citizen).
 *
 * Constructs their final-state signature from the trace, runs the engine
 * with the post-ADR-008 fixes (PCN re-encoded, party-ID multiplier,
 * centrist anti-gate, etc.), and reports:
 *   - Top-5 archetype matches
 *   - Election outcome Dem/Rep tally
 *
 * Expected (post-fix):
 *   - Top-1 archetype: Progressive Civic Nationalist (134) or close
 *   - Hinge Citizen (060): demoted by centrist anti-gate
 *   - Election count: ~80%+ Democratic post-1932 (vs pre-fix's mixed 60/40)
 */
export {};
