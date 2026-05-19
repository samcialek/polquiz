// Tier-B persona #4 (HARNESS-HANDOFF §3.2.4): Urban progressive Democrat.
//
// College-educated, redistributive on economics, universalist on moral scope,
// pro-institution, pluralist on culture. Empiricist EPS, technocrat AES.
// Votes D every cycle since 1992 — stable baseline persona for testing
// that the consistent-Democrat archetype family is reachable.
//
// Per-node sketch (1-5):
//   MAT  2 (redistributive)
//   CD   1 (progressive)
//   CU   4 (pluralist)
//   MOR  5 (wide universal scope)
//   PRO  4 (rules and process matter)
//   COM  4 (deal-making, coalition-building)
//   ZS   2 (positive-sum)
//   ONT_H 4 (people are shaped by environment/education)
//   ONT_S 5 (institutions foundational to flourishing)
//   ENG   3 (engaged — votes every cycle, follows politics)
//
// Moral circle: universal 85 (high — universalist), all scoped affinities
// low (no in-group above baseline). No IDP overlay expected.
// EPS: empiricist (data, expert opinion); AES: technocrat (precise,
// analytical, policy-detail-comfortable).

import type { Persona } from "../answerEngine.js";

export const urbanProgressiveDemocratPersona: Persona = {
  id: "urban-progressive-democrat",
  name: "Urban Progressive Democrat (lifelong D, college-educated)",
  demographics: {
    age: "35-44",
    gender: "female",
    race: "white",
    lgbtq: "no",
    religion: "none",
  },
  partyID: "dem",
  positions: {
    MAT: 2,
    CD: 1,
    CU: 4,
    MOR: 5,
    PRO: 4,
    COM: 4,
    ZS: 2,
    ONT_H: 4,
    ONT_S: 5,
    PF: 3,
    TRB: 2,
    ENG: 3,
  },
  saliences: {
    MAT: 3,
    CD: 3,
    CU: 3,
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
    AES: 2,
  },
  moralCircle: {
    universal: 85,
    scopedAffinities: {
      // Wide moral circle — no scope loaded above the universal baseline.
      national: 50,
      religious: 30,
      ethnic_racial: 45,
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
    archetypeFamily: "progressive technocrat / institutional liberal",
    // Observed top-1 #056 Institutional Leftist; top-5 cluster around the
    // institutional-progressive family: 056, 001 (Rawlsian Reformer), 057
    // (Temperate Pluralist), 021 (Principled Cosmopolitan), 033 (Systems
    // Modernizer).
    archetypeIds: ["056", "001", "057", "021", "033"],
    // Universalist universal=85 produces the "Cosmopolitan" token, which
    // wins over "Redistributionist" in the merger table. Both signal the
    // same family; the label is semantically richer.
    archetypeLabelContains: ["Cosmopolitan"],
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
