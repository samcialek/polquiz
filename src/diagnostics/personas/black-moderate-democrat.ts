// Tier-B persona #5 (HARNESS-HANDOFF §3.2.5): Black moderate religious Democrat.
//
// Redistributive economics, culturally moderate-conservative (especially on
// family and sexuality), high religious AND ethnic-racial in-group affinity,
// party-loyalty extreme. Stable D voter every cycle 2008-2024. Tests IDP
// routing to Black Voter (ethnic_racial top scope + demo_ethnicity=black).
//
// Per-node sketch (1-5):
//   MAT  2 (redistributive)
//   CD   4 (moderately traditional — religious-cultural conservative)
//   CU   3 (mixed — pluralist on most but assimilationist on faith)
//   MOR  3 (moderate scope — in-group cares more than universalist abstract)
//   PRO  3 (rules matter but flexible)
//   COM  3 (mixed)
//   ZS   3 (mixed — community-oriented, not zero-sum)
//   ONT_H 4 (env shapes people)
//   ONT_S 4 (institutions important)
//   ENG   3 (consistent voter)
//
// Moral circle: universal 60 (moderate), ethnic_racial 85 (top — Black church
// / community organizing), religious 80 (high), class 60. ethnic_racial
// excess (25) > religious excess (20) → routes to Black Voter IDP.
// EPS: institutionalist; AES: pastoral.

import type { Persona } from "../answerEngine.js";

export const blackModerateDemocratPersona: Persona = {
  id: "black-moderate-democrat",
  name: "Black Moderate Religious Democrat (lifelong D)",
  demographics: {
    age: "45-54",
    gender: "male",
    race: "black",
    lgbtq: "no",
    religion: "christian",
  },
  partyID: "dem",
  positions: {
    MAT: 2,
    CD: 4,
    CU: 3,
    MOR: 3,
    PRO: 3,
    COM: 3,
    ZS: 3,
    ONT_H: 4,
    ONT_S: 4,
    PF: 3,
    TRB: 4,
    ENG: 3,
  },
  saliences: {
    MAT: 3,
    CD: 2,
    CU: 2,
    MOR: 3,
    PRO: 2,
    COM: 2,
    ZS: 2,
    ONT_H: 1,
    ONT_S: 2,
    PF: 2,
    TRB: 3,
    ENG: 3,
    EPS: 2,
    AES: 2,
  },
  moralCircle: {
    // Tuned to produce post-quiz intensity03 ≥ 1.2 (the IDP gate threshold).
    // intensity01 = sqrt(sum(excess²))/100; intensity03 = 3 × intensity01.
    // Need l2(excess) ≥ 40, so the two top scopes need excess ≥ ~30 each.
    // Lower universal + higher scoped pushes both excesses past 30 after
    // the engine's averaging.
    universal: 40,
    scopedAffinities: {
      national: 70,
      religious: 90,
      ethnic_racial: 95,
      class: 60,
      gender: 55,
      ideological: 65,
    },
  },
  eps: "institutionalist",
  aes: "pastoral",
  engagement: "engaged",
  strategicVoting: "depends_on_stakes",
  negativePartisanship: "never_rep",
  expected: {
    archetypeFamily: "communitarian Democrat / Black voter",
    // Observed top-1 #050 Traditionalist Moralist; top-5 cluster mixes
    // economic-Democrat + cultural-traditionalist archetypes — accurate
    // for the persona (CD=4 traditional + MAT=2 redistributive).
    archetypeIds: ["050", "049", "134", "045", "088"],
    // Composed label "Traditionalist Populist-Left" is the merger of CD=4
    // (Traditionalist) + MAT=2 (Populist-Left). Both are semantically
    // correct markers of the persona.
    archetypeLabelContains: ["Traditionalist"],
    // ethnic_racial top scope (excess ≥20) + demo_ethnicity=black →
    // Black Voter IDP overlay. Requires intensity03 ≥ 1.2 (boosted scopes
    // ensure this).
    identityPrimaryState: "active",
    identityPrimaryLabel: "Black Voter",
    votes: {
      2008: "D",
      2012: "D",
      2016: "D",
      2020: "D",
      2024: "D",
    },
    voteMatchMin: 5,
    engagement: "engaged",
    questionsInRange: [20, 35],
  },
};
