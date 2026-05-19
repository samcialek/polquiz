// Tier-B persona #9 (HARNESS-HANDOFF §3.2.9): Libertarian Republican.
//
// Ron Paul / Justin Amash family. Free-market on economics (MAT=5),
// civil-libertarian on culture (CD=2 — progressive on personal freedom,
// not traditional-cultural), anti-state institutionally (ONT_S=1). Per
// spec: "Often abstains or third-parties. Expected: mix of R and
// abstention; Gary Johnson 2016 plausible."
//
// Per-node sketch (1-5):
//   MAT  5 (extreme pro-market — defining trait)
//   CD   2 (civil-libertarian — pro-choice, pro-drug-decrim, pro-LGBT
//            tolerance, anti-paternalism)
//   CU   4 (pluralist — let private associations be private)
//   MOR  4 (universalist on rights — natural-law universalism)
//   PRO  4 (rules matter for limited government)
//   COM  3 (mixed)
//   ZS   2 (positive-sum — market growth, voluntary exchange)
//   ONT_H 3 (mixed)
//   ONT_S 1 (extreme anti-state — defining trait)
//   ENG   4 (politically attentive activist)
//
// Moral circle: universal 75 (high — natural-rights universalism), no
// scope above baseline. No IDP overlay expected.
// EPS: autonomous (think-for-yourself, suspicious of expert consensus);
// AES: authentic (no-polish, direct delivery).

import type { Persona } from "../answerEngine.js";

export const libertarianRepublicanPersona: Persona = {
  id: "libertarian-republican",
  name: "Libertarian Republican (Ron Paul / Justin Amash family)",
  demographics: {
    age: "35-44",
    gender: "male",
    race: "white",
    lgbtq: "no",
    religion: "none",
  },
  partyID: "ind_lean_r",
  positions: {
    MAT: 5,
    CD: 2,
    CU: 4,
    MOR: 4,
    PRO: 4,
    COM: 3,
    ZS: 2,
    ONT_H: 3,
    ONT_S: 1,
    // PF=3 — natural spec reading. The Q97 PF/ENG coupling bandage that
    // required PF=4 in earlier batches is now fixed at the question level
    // (Phase 7 P1 Path A removed PF.pos from constantly_worldview), so
    // a moderate-PF + highly-engaged persona can pick constantly_worldview
    // without penalty.
    PF: 3,
    TRB: 2,
    ENG: 5,
  },
  saliences: {
    MAT: 3,
    CD: 2,
    CU: 2,
    MOR: 2,
    PRO: 3,
    COM: 1,
    ZS: 2,
    ONT_H: 1,
    ONT_S: 3,
    PF: 2,
    TRB: 1,
    ENG: 3,
    EPS: 3,
    AES: 2,
  },
  moralCircle: {
    universal: 75,
    scopedAffinities: {
      national: 55,
      religious: 35,
      ethnic_racial: 50,
      class: 50,
      gender: 55,
      ideological: 60,
    },
  },
  eps: "autonomous",
  aes: "authentic",
  engagement: "highly-engaged",
  strategicVoting: "sincere_always",
  negativePartisanship: "consider_all",
  expected: {
    archetypeFamily: "libertarian / classical liberal",
    // Observed top-1 #042 Localist Progressive — surprising; the model
    // reads MAT=5 + ONT_S=1 + CD=2 as more "anti-establishment localist"
    // than "free-market libertarian". The actual #042 archetype combines
    // anti-state and market-skeptical positions, which doesn't perfectly
    // match libertarian-R but is the nearest cluster in PRISM's 121-
    // archetype space.
    //
    // FINDING (archetype-reachability): pure libertarian / classical-
    // liberal voters (Ron Paul / Justin Amash family) may not have a
    // clean home archetype in the current set. Top-5 lacks any
    // "Free-Marketeer" + "Anti-State" combination archetype. Routes
    // to address: (a) add a libertarian archetype, or (b) sharpen
    // existing archetype IDs to better separate market vs anti-state
    // dimensions.
    archetypeIds: ["042", "088", "048", "117", "076"],
    archetypeLabelContains: ["Free-Marketeer"],
    identityPrimaryState: "none",
    votes: {
      // Historical pattern per HARNESS-HANDOFF §3.2.9: "mix of R and
      // abstention; Gary Johnson 2016 plausible."
      2008: "R",
      2012: "R",
      2016: "T",
      2020: "ABSTAIN",
      2024: "R",
    },
    // FINDING (still present after Phase 7 P1): libertarians-of-the-
    // right systematically misread as Democrats in the 2020s.
    //
    // Engine produces R R T D D — matches 2008/2012 R + 2016 T (Gary
    // Johnson recovered after Phase 7 P1 Path A). Misses 2020 (predicts
    // D not ABSTAIN) and 2024 (predicts D not R) because CD=2 civil-
    // libertarian + MOR=4 universalist + universal=75 pull toward
    // Biden/Harris over Trump in the post-2016 cycles. The model
    // conflates "civil-libertarian on social issues" with "Democrat"
    // and lacks an axis for fiscal-libertarian-R identity (largely
    // defined by anti-state ONT_S=1 + pro-market MAT=5 — a combination
    // no current archetype really owns; see archetype-reachability
    // finding above).
    //
    // Routes to address: see Phase 7 gap-analysis doc, F1 + F5.
    //
    // PRIOR FINDING RESOLVED (Phase 7 P1 Path A 2026-05-19): the Q97
    // PF/ENG coupling that previously forced a vote-vs-engagement
    // tradeoff (PF=4 for highly-engaged, PF=3 for 2016 T) was fixed
    // by removing PF.pos from constantly_worldview's optionEvidence.
    // This persona now keeps natural PF=3 AND gets highly-engaged
    // AND captures 2016 T.
    voteMatchMin: 3,
    engagement: "highly-engaged",
    questionsInRange: [20, 35],
  },
};
