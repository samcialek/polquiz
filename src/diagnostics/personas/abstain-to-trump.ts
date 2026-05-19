// Tier-A persona #1 (HARNESS-HANDOFF §3): Abstain → Trump (2016 mobilizer).
//
// Non-college white male, low-trust, did not vote 2008/2012, mobilized by
// Trump on anti-establishment + cultural-grievance framing. Stayed Trump in
// 2020 and 2024.
//
// Per-node sketch:
//   MAT  3 (mixed; anti-elite economics but not redistributive)
//   CD   4 (traditional)
//   CU   2 (assimilationist, low pluralism)
//   MOR  2 (narrow scope; in-group salient)
//   PRO  2 (results > rules; willing to break norms for desired outcome)
//   COM  2 (combative; not a deal-maker)
//   ZS   4 (zero-sum world)
//   ONT_H 2 (people are mostly who they are)
//   ONT_S 2 (anti-institutional)
//   ENG   2 (casual → engaged after 2016 mobilization)
//   EPS  intuitionist (gut-feeling reasoning)
//   AES  fighter
//
// Moral circle: low universal (30) + high national/religious scoped affinity.
// Engagement: casual at baseline; the 2008/2012 abstain pattern is the
// dis-engaged pre-mobilization state.
//
// Expected outcomes:
//   archetype family: populist-nationalist
//   votes: ABSTAIN 2008/2012, R 2016/2020/2024

import type { Persona } from "../answerEngine.js";

export const abstainToTrumpPersona: Persona = {
  id: "abstain-to-trump",
  name: "Abstain → Trump (2016 mobilizer)",
  demographics: {
    age: "45-54",
    gender: "male",
    race: "white",
    lgbtq: "no",
    religion: "christian",
  },
  partyID: "ind_lean_r",
  positions: {
    MAT: 3,
    CD: 4,
    CU: 2,
    MOR: 2,
    PRO: 2,
    COM: 2,
    ZS: 4,
    ONT_H: 2,
    ONT_S: 2,
    PF: 3,
    TRB: 4,
    ENG: 2,
  },
  saliences: {
    MAT: 2,
    CD: 3,
    CU: 3,
    MOR: 2,
    PRO: 1,
    COM: 1,
    ZS: 3,
    ONT_H: 1,
    ONT_S: 3,
    PF: 2,
    TRB: 3,
    ENG: 2,
    EPS: 2,
    AES: 2,
  },
  moralCircle: {
    universal: 30,
    scopedAffinities: {
      national: 90,
      religious: 80,
      ethnic_racial: 60,
      class: 50,
      gender: 50,
      ideological: 70,
    },
  },
  eps: "intuitionist",
  aes: "fighter",
  engagement: "casual",
  strategicVoting: "sincere_always",
  negativePartisanship: "consider_all",
  expected: {
    archetypeFamily: "populist-nationalist",
    votes: {
      2008: "ABSTAIN",
      2012: "ABSTAIN",
      2016: "R",
      2020: "R",
      2024: "R",
    },
  },
};
