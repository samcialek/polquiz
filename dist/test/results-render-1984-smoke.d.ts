/**
 * Regression smoke for the 2026-04-25 results-live.html bug where the
 * elections grid was rendering archetype-level pre-computed votes
 * (electionsData[archetypeId]) instead of the user's actual respondent
 * predictions (localStorage["prism-election-raw"]).
 *
 * The archetype-side scorer at src/historical/regime-alignment.ts gives
 * Progressive Civic Nationalist a Reagan/Reagan/Bush sequence in
 * 1980-88 because it lacks the partisan-loyalty multiplier. The
 * user-side path at src/historical/respondentVoteChoice.ts (which
 * powers the tooltip and writes prism-election-raw at quiz finalization)
 * correctly returns Carter/Mondale/Dukakis for any user with partyID="D"
 * and high PF.
 *
 * This smoke seeds localStorage["prism-election-raw"] with a synthetic
 * 1984 vote of Mondale (Democratic, distance 1.13) beating Reagan
 * (Republican, distance 1.56), loads results-live.html, and asserts:
 *   - the 1984 cell shows "Mondale" not "Reagan"
 *   - the cell carries class "dem"
 *   - the hover tooltip ranks Mondale before Reagan
 *
 * If this fails, a future rewrite has reintroduced the archetype-level
 * fallback as primary.
 *
 * Usage: npx tsx src/test/results-render-1984-smoke.ts
 */
export {};
