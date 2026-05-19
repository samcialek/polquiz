// Tier-B persona #11 (HARNESS-HANDOFF §3.2.11): Bernie progressive / DSA-curious.
//
// Far-left on economics (MAT=1), universalist, high engagement, anti-
// corporate, distrust of mainstream-D establishment. Voted D in generals
// 2008-2024 but lukewarm — strategic lesser-evil voter who'd consider third
// party if not for stakes.
//
// Per-node sketch (1-5):
//   MAT  1 (far-left redistributive)
//   CD   1 (progressive on social issues)
//   CU   5 (pluralist)
//   MOR  5 (universalist)
//   PRO  3 (mixed — rules matter but radical change sometimes requires
//            breaking them)
//   COM  3 (mixed — not a deal-maker on principle)
//   ZS   4 (zero-sum critique of capitalism)
//   ONT_H 5 (env / structure shapes people)
//   ONT_S 3 (mixed — anti-corporate-institution but pro-civic-collective)
//   ENG   4 (highly engaged)
//
// Moral circle: universal 90 (highest among personas — explicit anti-
// nationalist universalism), class 70 (modest scoped — anti-corporate
// working-class affinity), other scopes at baseline. No IDP overlay
// expected (no scope above universal baseline).
// EPS: empiricist (data-driven leftism); AES: visionary.

import type { Persona } from "../answerEngine.js";

export const bernieProgressivePersona: Persona = {
  id: "bernie-progressive",
  name: "Bernie Progressive / DSA-curious",
  demographics: {
    age: "25-34",
    gender: "female",
    race: "white",
    lgbtq: "no",
    religion: "none",
  },
  partyID: "ind_lean_d",
  positions: {
    MAT: 1,
    CD: 1,
    CU: 5,
    MOR: 5,
    PRO: 3,
    COM: 3,
    ZS: 4,
    ONT_H: 5,
    ONT_S: 3,
    // PF=4 (was 3): the engine's Q97 dispatcher picks "constantly_worldview"
    // only when both PF and ENG point toward peak=5. PF=3 made it pick
    // "regularly_daily" (PF peak=3, ENG peak=4) which collapsed ENG to
    // 3.52 in the final state. A DSA-curious progressive with politics-
    // central identity is plausibly PF=4 anyway.
    PF: 4,
    TRB: 2,
    // ENG bumped from 4 to 5 to clear the highly-engaged threshold (pos≥4)
    // after Bayesian averaging brings it down ~0.5 across the quiz. Spec
    // §3.2.11 describes "high engagement".
    ENG: 5,
  },
  saliences: {
    MAT: 3,
    CD: 3,
    CU: 3,
    MOR: 3,
    PRO: 2,
    COM: 1,
    ZS: 3,
    ONT_H: 3,
    ONT_S: 2,
    PF: 2,
    TRB: 1,
    ENG: 3,
    EPS: 3,
    AES: 2,
  },
  moralCircle: {
    universal: 90,
    scopedAffinities: {
      national: 35,
      religious: 25,
      ethnic_racial: 50,
      class: 70,
      gender: 60,
      ideological: 65,
    },
  },
  eps: "empiricist",
  aes: "visionary",
  engagement: "highly-engaged",
  strategicVoting: "strategic_lesser_evil",
  negativePartisanship: "never_rep",
  expected: {
    archetypeFamily: "democratic-socialist / DSA progressive",
    // First-pass guess: far-left cluster. #011 looks like a likely
    // egalitarian-vanguard match; #001 Rawlsian Reformer is universalist
    // institutional left; #056 Institutional Leftist is the cousin.
    archetypeIds: ["011", "001", "056", "034", "057"],
    // MAT=1 + universalist universal=90 should surface
    // "Redistributionist" or "Cosmopolitan" tokens; MOR=5 also "Universalist".
    archetypeLabelContains: ["Cosmopolitan"],
    // Wide moral circle (universal=90, all scoped near or below it) →
    // no scope above baseline → no IDP overlay.
    identityPrimaryState: "none",
    votes: {
      2008: "D",
      2012: "D",
      2016: "D",
      2020: "D",
      2024: "D",
    },
    voteMatchMin: 5,
    engagement: "highly-engaged",
    questionsInRange: [20, 35],
  },
};
