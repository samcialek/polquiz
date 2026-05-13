/**
 * Stochastic-retake (MCMC-style) regression for the user-trace profile.
 *
 * Centers a synthetic respondent on the user's recovered signature
 * (Progressive Civic Nationalist, ID 134), jitters their per-question answer
 * choice with softmax-temperature noise, and replays the engine N times.
 * Reports:
 *   - Top-1 archetype rate (should be ~95%+ for the trace user)
 *   - Top-3 inclusion rate
 *   - Whether identity-primary 141-146 ever fires (should be 0; gate blocks)
 *   - Distribution of alternates when target is missed
 *   - Average questions answered
 *   - Sampled post-1932 Democratic vote rate
 *
 * Run: `npx tsx src/eval/mcmc-retake.ts [iterations] [seed]`. Default 1000 iters.
 *
 * Use this as a regression check after engine changes — if PCN top-1 falls
 * below 92% or identity-primary fires for this profile, the change broke
 * something load-bearing for civic-nationalist progressives.
 */
export {};
