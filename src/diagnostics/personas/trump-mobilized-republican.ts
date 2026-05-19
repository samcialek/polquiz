// Tier-A persona #3 (HARNESS-HANDOFF §3.1.3): Trump-mobilized Republican.
//
// Cultural-traditionalist Republican who never voted D but also wasn't a
// strong Bush/McCain partisan — Trump genuinely activated him. Voted R every
// cycle but engagement and salience on CD/MOR/CU went from low to high after
// 2016. All-in by 2024. Distinguished from Abstain→Trump (Persona #1) by
// being a *consistent voter* throughout — not a non-voter mobilized in 2016.
//
// Per-node sketch (1-5):
//   MAT  3 (mixed — economic-conservative on principle but Trump on policy)
//   CD   5 (very traditional, religious-cultural)
//   CU   1 (very assimilationist)
//   MOR  1 (very narrow scope — religious / national in-group)
//   PRO  3 (mixed; rule of law matters but Trump's exceptionalism is OK)
//   COM  2 (combative; party is the in-group)
//   ZS   4 (zero-sum, especially cultural)
//   ONT_H 2 (fixed nature; institutions can't change people fundamentally)
//   ONT_S 3 (institutions matter but compromised)
//   ENG   3 (consistent voter; high by 2024)
//
// Moral circle: universal 25 (low), national 85, religious 90 (highest),
// class 55, ideological 65. Religious-scope-loaded → routes to Evangelical
// Voter IDP overlay given demo_religion=christian.
// EPS: traditionalist; AES: fighter (post-2016 activation).

import type { Persona } from "../answerEngine.js";

export const trumpMobilizedRepublicanPersona: Persona = {
  id: "trump-mobilized-republican",
  name: "Trump-mobilized Republican (cultural-traditionalist)",
  demographics: {
    age: "55-64",
    gender: "male",
    race: "white",
    lgbtq: "no",
    religion: "christian",
  },
  partyID: "rep",
  positions: {
    MAT: 3,
    CD: 5,
    CU: 1,
    MOR: 1,
    PRO: 3,
    COM: 2,
    ZS: 4,
    ONT_H: 2,
    ONT_S: 3,
    PF: 3,
    TRB: 4,
    ENG: 3,
  },
  saliences: {
    MAT: 2,
    CD: 3,
    CU: 3,
    MOR: 3,
    PRO: 1,
    COM: 1,
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
    universal: 25,
    scopedAffinities: {
      national: 85,
      religious: 90,
      ethnic_racial: 60,
      class: 55,
      gender: 60,
      ideological: 65,
    },
  },
  eps: "traditionalist",
  aes: "fighter",
  engagement: "engaged",
  strategicVoting: "sincere_always",
  negativePartisanship: "never_dem",
  expected: {
    archetypeFamily: "religious traditionalist / Christian-right",
    // CD:high + CU:low + MORAL_CIRCLE:religious is a merger entry in
    // archetypeLabeler.ts:549 producing the single token "Integralist".
    // Semantically richer than the underlying tokens — captures the
    // religious-political fusion specific to this persona.
    archetypeLabelContains: ["Integralist"],
    // Religious scope at 90 with universal at 25 should clear IDP gates:
    //   excess[religious] = 90 - 25 = 65 (≥ 20 ✓)
    //   scoped[religious] = 90 (≥ 70 ✓)
    //   universal = 25 (≤ 75 ✓)
    //   intensity03 ≥ 1.2 (✓ given multiple loaded scopes)
    // Top scope = religious → Evangelical Voter (with demo_religion=christian).
    identityPrimaryState: "active",
    identityPrimaryLabel: "Evangelical Voter",
    votes: {
      2008: "R",
      2012: "R",
      2016: "R",
      2020: "R",
      2024: "R",
    },
    // 2008 known edge case: the engine predicts ABSTAIN for this persona
    // because the persona's extreme religious-traditionalist profile (CD=5,
    // CU=1, MOR=1, religious=90) puts McCain (relatively moderate R)
    // outside the clearing-bar distance. HARNESS-HANDOFF §3.1.3 describes
    // this voter as "wasn't a strong Bush/McCain partisan" — so the
    // model's read is arguably correct (low engagement pre-Trump). Allow
    // 4/5 match.
    voteMatchMin: 4,
    engagement: "engaged",
    questionsInRange: [20, 35],
  },
};
