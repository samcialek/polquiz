// Tier-B persona #12 (HARNESS-HANDOFF §3.2.12): Christian-right traditionalist.
//
// Religious affinity dominant. CD=5, traditional MOR/CU framing. Votes R
// reliably. Per spec may have abstained when nominee was off-base (1996
// Dole, 2008 McCain — protest from the religious right). Distinguished
// from Trump-mobilized Republican (#3) and MAGA all-in (#10) by being
// orthodox-rules religious (PRO high) rather than populist-religious
// (PRO low).
//
// Per-node sketch (1-5):
//   MAT  3 (mixed — moral concerns dominate the economic axis)
//   CD   5 (very traditional)
//   CU   1 (very assimilationist)
//   MOR  1 (narrow scope — covenant community framing)
//   PRO  4 (rules / moral law matter — distinguishes from MAGA's PRO=1)
//   COM  2 (combative on values, no compromise on moral non-negotiables)
//   ZS   4 (zero-sum culture war)
//   ONT_H 1 (fallen-man theology — fixed sinful nature)
//   ONT_S 4 (institutions matter, especially religious ones)
//   ENG   3 (consistent voter)
//
// Moral circle: universal 25 (low), religious 95 (TOP — dominant religious
// in-group), national 70, ethnic_racial 60, class 55. Religious top
// excess (70) → Evangelical Voter IDP given demo_religion=christian.
// EPS: traditionalist; AES: pastoral (church-rooted oratory, not the
// MAGA fighter register).

import type { Persona } from "../answerEngine.js";

export const christianRightTraditionalistPersona: Persona = {
  id: "christian-right-traditionalist",
  name: "Christian-Right Traditionalist",
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
    PRO: 4,
    COM: 2,
    ZS: 4,
    ONT_H: 1,
    ONT_S: 4,
    PF: 3,
    TRB: 4,
    ENG: 3,
  },
  saliences: {
    MAT: 2,
    CD: 3,
    CU: 3,
    MOR: 3,
    PRO: 3,
    COM: 2,
    ZS: 2,
    ONT_H: 2,
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
      // religious TOP scope at 95 (dominant); excess = 70. Wide gap from
      // other scopes so religious is unambiguously top by excess.
      national: 70,
      religious: 95,
      ethnic_racial: 60,
      class: 55,
      gender: 60,
      ideological: 65,
    },
  },
  eps: "traditionalist",
  aes: "pastoral",
  engagement: "engaged",
  strategicVoting: "sincere_always",
  negativePartisanship: "never_dem",
  expected: {
    archetypeFamily: "religious-right / Christian conservative",
    // First-pass guess: religious-traditionalist cluster overlaps with
    // trump-mobilized-republican (#081 Heritage Guardian, #082 Altar-and-
    // Hearth Conservative, #083 Closed Traditionalist, #084).
    archetypeIds: ["082", "081", "083", "084", "106"],
    // Observed composed label "Communitarian Traditionalist" — the
    // religious scope produces "Religious-Communitarian" (per
    // MORAL_CIRCLE_SCOPE_LEXICON.religious in archetypeLabeler.ts:108) which
    // compresses to "Communitarian"; CD:high produces "Traditionalist".
    // The "Integralist" merger fires for trump-mobilized-republican (which
    // has slightly different scoping) but the labeler picks the
    // Communitarian compression path here. Both are correct semantically.
    archetypeLabelContains: ["Traditionalist"],
    // religious top excess (≥70) + demo_religion=christian → Evangelical
    // Voter IDP.
    identityPrimaryState: "active",
    identityPrimaryLabel: "Evangelical Voter",
    votes: {
      // 2008 abstain matches HARNESS-HANDOFF §3.2.12 explicit branch:
      // "may have abstained when nominee was off-base (... 2008 McCain
      // — protest from the right)". Extreme religious profile + McCain's
      // perceived moderate-on-values stance produces clearing-bar miss.
      2008: "ABSTAIN",
      2012: "R",
      2016: "R",
      2020: "R",
      2024: "R",
    },
    voteMatchMin: 5,
    engagement: "engaged",
    questionsInRange: [20, 35],
  },
};
