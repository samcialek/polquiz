/**
 * Layer 3 — Synthetic Progressive Counterfactual
 *
 * Hand-build a "canonical progressive Democrat" RespondentState with peaked
 * distributions and run it through:
 *   1. archetypeDistance → print top 10 nearest archetypes
 *   2. predictVote → print predicted winner in each of the 60 elections
 *
 * If the stack is working, top archetypes should be Bread-and-Butter Progressive,
 * Jacobin Egalitarian, Class-War Leftist, Activist Progressive, etc. Elections
 * should be heavily Democratic (Clinton, Obama, Biden, Harris, Kennedy, FDR).
 *
 * If this test shows the WRONG winner, the bug is downstream of the quiz —
 * either the archetype scorer, the archetype library encoding, or the election
 * prediction module. If this test shows the RIGHT winner, the bug is in the
 * quiz-side signature construction (question evidence maps, etc.).
 */
export {};
