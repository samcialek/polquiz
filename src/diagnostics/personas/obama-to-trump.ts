// Tier-A persona #2 (HARNESS-HANDOFF §3.1.2): Obama → Trump (2016 realignment).
//
// White working-class Rust Belt. Voted Obama 2008/2012 on economic populism +
// anti-Romney distrust; defected to Trump 2016 on cultural-grievance +
// anti-establishment + immigration; stayed Trump 2020/2024. Cross-pressured
// cultural-vs-economic voter: redistributive on MAT (Obama-compatible) but
// conservative on CD/CU (Trump-compatible). High national affinity, low
// universal.
//
// Per-node sketch (1-5):
//   MAT  2 (redistributive — works in / cares about wage-earner economics)
//   CD   4 (traditional culture)
//   CU   2 (assimilationist)
//   MOR  2 (narrow scope — national in-group)
//   PRO  2 (results > rules; comfortable with norm-breaking)
//   COM  2 (combative; not a deal-maker)
//   ZS   4 (zero-sum, especially in trade/immigration framing)
//   ONT_H 3 (mixed — not extreme on dispositional vs environmental)
//   ONT_S 3 (skeptical-but-not-rejecting of institutions — distinct from
//            Abstain→Trump's ONT_S=2)
//   ENG   3 (engaged — votes every cycle, follows politics)
//
// Moral circle: universal 40 (moderate-low), national 90 (loaded),
// religious 70, class 65.
// EPS: intuitionist; AES: pastoral (Rust Belt regional cadence resonates).

import type { Persona } from "../answerEngine.js";

export const obamaToTrumpPersona: Persona = {
  id: "obama-to-trump",
  name: "Obama → Trump (2016 realignment)",
  demographics: {
    age: "45-54",
    gender: "male",
    race: "white",
    lgbtq: "no",
    religion: "christian",
  },
  partyID: "ind_pure",
  positions: {
    MAT: 2,
    CD: 4,
    CU: 2,
    MOR: 2,
    PRO: 2,
    COM: 2,
    ZS: 4,
    ONT_H: 3,
    ONT_S: 3,
    PF: 3,
    TRB: 4,
    ENG: 3,
  },
  saliences: {
    MAT: 3,
    CD: 3,
    CU: 3,
    MOR: 2,
    PRO: 1,
    COM: 1,
    ZS: 3,
    ONT_H: 1,
    ONT_S: 2,
    PF: 2,
    TRB: 3,
    ENG: 3,
    EPS: 2,
    AES: 2,
  },
  moralCircle: {
    universal: 40,
    scopedAffinities: {
      // National is the dominant loaded scope (the "high national affinity"
      // signal from HARNESS-HANDOFF §3.1.2). Religious is mild — these
      // voters' Trump pull was cultural-nationalist, not Christian-right.
      // Set religious below the 70 IDP-gate threshold so the engine doesn't
      // route to Evangelical Voter (which would conflict with the
      // populist-nationalist family identity).
      national: 90,
      religious: 55,
      ethnic_racial: 55,
      class: 65,
      gender: 50,
      ideological: 60,
    },
  },
  eps: "intuitionist",
  aes: "pastoral",
  engagement: "engaged",
  strategicVoting: "depends_on_stakes",
  negativePartisanship: "consider_all",
  expected: {
    archetypeFamily: "cross-pressured populist-communitarian",
    // Cross-pressured conservative-nationalist cluster. Observed top-1 #084;
    // top-5: 084 Civilizational Conservative, 104 National Protector, 100
    // Tribal Insurgent, 088 Gentle Traditionalist, 083 Closed Traditionalist.
    archetypeIds: ["084", "104", "100", "088", "083"],
    // Cross-pressured persona: economically left-leaning, culturally
    // right-leaning. Expected label markers:
    //   Assimilationist — CU low (cultural uniformity preference)
    //   Combative or Fighter — ZS high + AES leans
    //   Communitarian variant — national scope excess
    archetypeLabelContains: ["Assimilationist"],
    // RESOLVED Phase 7 P3 (2026-05-19): Q244 religion-political-role
    // separator fixed the spurious Evangelical Voter routing. The persona
    // now picks religion_cultural_heritage on Q244 (religious=50,
    // universal=55), which corrects the religious=75 over-write from
    // Q102's supportMid placement. Religious posterior drops below the
    // IDP threshold; top excess scope becomes national again (no IDP
    // overlay defined for national → state stays unresolved → results
    // returns null per the active/dominant filter in api.ts:670).
    //
    // Previously this persona was force-routed to Evangelical Voter
    // because Q102's religion item placement in supportMid (driven by
    // an assimilationist CU=2 + moderate religious=55 alignment) wrote
    // religious=75 — enough to push religious excess above national.
    // Q244 corrects by giving culturally-Christian-but-pragmatic
    // respondents a way to declare "religion is heritage, not a
    // political organizer."
    identityPrimaryState: "none",
    votes: {
      2008: "D",
      2012: "D",
      2016: "R",
      2020: "R",
      2024: "R",
    },
    voteMatchMin: 4,
    engagement: "engaged",
    questionsInRange: [20, 35],
  },
};
