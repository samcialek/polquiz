// Tier-B persona #13 (HARNESS-HANDOFF §3.2.13): Tech-progressive / Yang-curious.
//
// Suburban college Democrat. Cost-of-living focused, climate-priority,
// immigration moderate. Empiricist EPS (data-driven), technocrat AES.
// Votes D 2008-2024 but with cross-pressure on cost questions (would
// vote for a Yang-style centrist Democrat over a Bernie-style progressive).
//
// Per-node sketch (1-5):
//   MAT  3 (mixed — some redistributive but market-friendly tech bias;
//            UBI-curious without strong-redistributive commitment)
//   CD   2 (progressive on social issues)
//   CU   4 (pluralist — multicultural urban tech-worker norm)
//   MOR  4 (universalist on climate / global issues)
//   PRO  4 (rules and procedure matter)
//   COM  4 (deal-making, pragmatic)
//   ZS   2 (positive-sum — tech growth lifts all)
//   ONT_H 4 (env / education shapes people)
//   ONT_S 4 (institutions matter, especially for modernization)
//   ENG   3 (engaged — follows politics, votes every cycle)
//
// Moral circle: universal 75 (high — global-thinker), no scope above
// baseline. No IDP overlay expected.
// EPS: empiricist (data, peer-reviewed research, expert consensus);
// AES: technocrat (precise, analytical, comfortable with detail).

import type { Persona } from "../answerEngine.js";

export const techProgressivePersona: Persona = {
  id: "tech-progressive",
  name: "Tech-Progressive / Yang-curious Democrat",
  demographics: {
    age: "25-34",
    gender: "female",
    race: "asian",
    lgbtq: "no",
    religion: "none",
  },
  partyID: "dem",
  positions: {
    MAT: 3,
    CD: 2,
    CU: 4,
    MOR: 4,
    PRO: 4,
    COM: 4,
    ZS: 2,
    ONT_H: 4,
    ONT_S: 4,
    PF: 3,
    TRB: 2,
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
    ONT_H: 2,
    ONT_S: 3,
    PF: 1,
    TRB: 1,
    ENG: 3,
    EPS: 3,
    AES: 3,
  },
  moralCircle: {
    universal: 75,
    scopedAffinities: {
      national: 50,
      religious: 30,
      ethnic_racial: 55,
      class: 55,
      gender: 60,
      ideological: 60,
    },
  },
  eps: "empiricist",
  aes: "technocrat",
  engagement: "engaged",
  strategicVoting: "depends_on_stakes",
  negativePartisanship: "never_rep",
  expected: {
    archetypeFamily: "tech-progressive / modernizing institutional liberal",
    // Observed top-1 #039 Data-Driven Moderate (top-5: 039, 036
    // Institutional Optimizer, 032 Hamiltonian Technocrat, 056
    // Institutional Leftist, 057 Temperate Pluralist). The cluster fits
    // the persona's empiricist-technocrat-modernizer signature cleanly —
    // distinguished from urban-progressive-democrat's pure-redistributive
    // cluster (#056 Institutional Leftist family) by MAT=3 mixed vs MAT=2
    // redistributive.
    archetypeIds: ["039", "036", "032", "056", "057"],
    // Composed label "Empiricist Reformer" — EPS:empiricist (lexicon) +
    // reformer institutional tilt. Empiricist is the EPS-categorical
    // token; Reformer reflects MAT=3 mixed + ONT_S=4 institutional.
    archetypeLabelContains: ["Empiricist"],
    identityPrimaryState: "none",
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
