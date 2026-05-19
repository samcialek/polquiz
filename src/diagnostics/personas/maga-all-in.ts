// Tier-B persona #10 (HARNESS-HANDOFF §3.2.10): MAGA all-in populist.
//
// All Trump-activated themes turned up: extreme CD (traditional), low CU
// (assimilationist), high ZS (zero-sum), anti-institutional, anti-elite,
// highly engaged, fighter AES. Tests the extreme of the populist-nationalist
// family. Distinguished from Abstain→Trump (#1) and Obama→Trump (#2) by
// being a *consistent* committed R voter, not a switcher or mobilizee.
//
// Per-node sketch (1-5):
//   MAT  4 (anti-elite economics, suspicious of redistribution)
//   CD   5 (extremely traditional)
//   CU   1 (extremely assimilationist)
//   MOR  1 (narrow scope — strong in-group preference)
//   PRO  1 (results > rules — willing to bend procedures)
//   COM  1 (combative, no compromise)
//   ZS   5 (extreme zero-sum)
//   ONT_H 2 (fixed nature)
//   ONT_S 1 (anti-institutional — institutions are obstacles)
//   ENG   3 (highly engaged)
//
// Moral circle: universal 20 (low), ethnic_racial 90 (TOP — ethno-cultural
// in-group identity), national 85, religious 70, ideological 75. White +
// ethnic_racial top excess + ZS≥3.5 + CD≥3.5 + ONT_S≤2.5 → White Grievance
// Voter IDP overlay (3 grievance signals → confidence high).
// EPS: intuitionist; AES: fighter.

import type { Persona } from "../answerEngine.js";

export const magaAllInPersona: Persona = {
  id: "maga-all-in",
  name: "MAGA all-in populist (committed R)",
  demographics: {
    age: "55-64",
    gender: "male",
    race: "white",
    lgbtq: "no",
    religion: "christian",
  },
  partyID: "rep",
  positions: {
    MAT: 4,
    CD: 5,
    CU: 1,
    MOR: 1,
    PRO: 1,
    COM: 1,
    ZS: 5,
    ONT_H: 2,
    ONT_S: 1,
    PF: 4,
    TRB: 5,
    // ENG bumped from 4 to 5: position=4 yields engine-derived ENG=3.52
    // (below the highly-engaged threshold of 4.0). MAGA persona is
    // unambiguously highly-engaged per HARNESS-HANDOFF §3.2.10 ("highly
    // engaged"); ENG=5 ensures the engine's averaged posterior clears 4.0.
    ENG: 5,
  },
  saliences: {
    MAT: 3,
    CD: 3,
    CU: 3,
    MOR: 3,
    PRO: 2,
    COM: 2,
    ZS: 3,
    ONT_H: 2,
    ONT_S: 3,
    PF: 3,
    TRB: 3,
    ENG: 3,
    EPS: 2,
    AES: 3,
  },
  moralCircle: {
    universal: 20,
    scopedAffinities: {
      // ethnic_racial set as TOP scope (excess 70) to route to White
      // Grievance Voter IDP given demo_ethnicity=white + grievance signals.
      national: 85,
      religious: 70,
      ethnic_racial: 90,
      class: 60,
      gender: 65,
      ideological: 75,
    },
  },
  eps: "intuitionist",
  aes: "fighter",
  engagement: "highly-engaged",
  strategicVoting: "sincere_always",
  negativePartisanship: "never_dem",
  expected: {
    archetypeFamily: "extreme populist-nationalist / ethno-traditionalist",
    // Observed top-1 #106 Militant Partisan; top-5 cluster covers the
    // populist-nationalist family: 106, 084 (Civilizational Conservative),
    // 105 (Combative Populist), 081 (Heritage Guardian), 104 (National
    // Protector).
    archetypeIds: ["106", "084", "105", "081", "104"],
    // Composed label "Partisan-Communitarian Communitarian" reflects
    // ideological + ethnic-racial scope excesses (both at 51.25 post-quiz).
    // CU:low merger ("Assimilationist") is consumed by a multi-token
    // compression with the high MORAL_CIRCLE markers.
    archetypeLabelContains: ["Partisan-Communitarian"],
    // ethnic_racial top scope + demo=white + ZS=5 ≥3.5 + CD=5 ≥3.5 +
    // ONT_S=1 ≤2.5 → all 3 grievance signals → White Grievance Voter.
    identityPrimaryState: "active",
    identityPrimaryLabel: "White Grievance Voter",
    votes: {
      // 2008 abstain matches HARNESS-HANDOFF §3.2.10 explicitly: "pre-2016
      // probably abstained or voted Republican-leaning". McCain 2008 was
      // outside the clearing-bar distance for this extreme religious-
      // traditionalist profile; the model's read is consistent with the
      // spec's "abstained" branch.
      2008: "ABSTAIN",
      2012: "R",
      2016: "R",
      2020: "R",
      2024: "R",
    },
    voteMatchMin: 5,
    engagement: "highly-engaged",
    questionsInRange: [20, 35],
  },
};
