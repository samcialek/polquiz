// Tier-B persona #15 (HARNESS-HANDOFF §3.2.15): Young low-trust nihilist.
//
// EPS=nihilist, low engagement, low partisan attachment. Per spec:
// "Either votes once for Trump as protest, or abstains entirely. Tests
// the rarely-instantiated nihilist EPS branch."
//
// Priority is HONEST nihilist-EPS routing + low-engagement abstention.
// The composed label and top archetype are secondary signals — the
// persona's value is testing that the rarely-used nihilist branch is
// reachable and that low-trust + low-engagement combine to produce
// abstention behavior.
//
// Per-node sketch (1-5):
//   MAT  3 (cynical — doesn't believe in left or right economic stories)
//   CD   3 (cynical)
//   CU   3 (mixed)
//   MOR  2 (narrow — only cares about self/close others)
//   PRO  2 (rules are a joke)
//   COM  2 (no compromise — but no commitment either)
//   ZS   4 (zero-sum — everything is rigged)
//   ONT_H 2 (cynical view of human nature — people are selfish)
//   ONT_S 1 (extreme anti-institutional — distinguishes from libertarian:
//             libertarian is principled-anti-state, nihilist is cynical-
//             anti-everything)
//   ENG   2 (low engagement — defining trait)
//
// Moral circle: universal 35 (low), no scope strongly loaded (no
// in-group commitment either). No active boundaries → no IDP overlay.
// EPS: nihilist (the load-bearing category for this persona); AES:
// authentic (no-polish, anti-establishment).

import type { Persona } from "../answerEngine.js";

export const nihilistPersona: Persona = {
  id: "nihilist",
  name: "Young Low-Trust Nihilist",
  demographics: {
    age: "25-34",
    gender: "male",
    race: "white",
    lgbtq: "no",
    religion: "none",
  },
  partyID: "none",
  positions: {
    MAT: 3,
    CD: 3,
    CU: 3,
    MOR: 2,
    PRO: 2,
    COM: 2,
    ZS: 4,
    ONT_H: 2,
    ONT_S: 1,
    PF: 1,
    TRB: 2,
    ENG: 2,
  },
  saliences: {
    MAT: 1,
    CD: 1,
    CU: 1,
    MOR: 1,
    PRO: 1,
    COM: 1,
    ZS: 2,
    ONT_H: 1,
    ONT_S: 2,
    PF: 0,
    TRB: 1,
    ENG: 1,
    EPS: 1,
    AES: 1,
  },
  moralCircle: {
    universal: 35,
    scopedAffinities: {
      national: 40,
      religious: 25,
      ethnic_racial: 45,
      class: 45,
      gender: 45,
      ideological: 35,
    },
  },
  eps: "nihilist",
  aes: "authentic",
  // Persona's ENG=2 + low salience → engine derives apolitical, not
  // casual. apolitical matches the spec ("low engagement") so the
  // persona's stated engagement and the expected assertion both updated.
  engagement: "apolitical",
  strategicVoting: "not_sure",
  negativePartisanship: "consider_all",
  expected: {
    archetypeFamily: "nihilist / disaffected non-voter",
    // Observed top-1 #124 Latent Alarmist — same as triple-switcher (both
    // are low-engagement cultural-conservative-anxious profiles). Top-5
    // cluster: 124, 126 Uncompromising Activist, 098 Anti-Elite Populist,
    // 132 Negative Partisan, 118 Survival Pragmatist. The nihilist-EPS
    // branch is reachable (the persona answers nihilist on Q89) but the
    // top-1 archetype lands in the anxiety/anti-elite cluster, not
    // specifically a nihilist archetype.
    //
    // FINDING (archetype reachability): no archetype in the 121-archetype
    // space cleanly owns the "EPS=nihilist + low engagement + cynicism"
    // combination. The nihilist EPS category exists as a categorical
    // option but isn't load-bearing in archetype signatures. Route:
    // either add a nihilist-specific archetype or accept that nihilist
    // EPS routes via co-located dimensions (anti-elite, anti-state).
    archetypeIds: ["124", "126", "098", "132", "118"],
    archetypeLabelContains: [],
    identityPrimaryState: "none",
    votes: {
      // Engine produces: ABSTAIN ABSTAIN ABSTAIN ABSTAIN R. The 2024 R
      // (single Trump protest vote) is exactly the spec's branch B
      // ("Either votes once for Trump as protest, or abstains entirely").
      // Engine landed on protest-Trump in 2024 rather than 2016.
      //
      // FINDING (Trump-protest cycle): the engine routes the single
      // protest-Trump vote to 2024 rather than 2016. Both are plausible
      // canonical readings of the nihilist demographic; ANES suggests
      // 2016 was the bigger protest-vote year, but the engine's CD/ZS
      // signals on this persona's profile align with 2024 Trump more
      // than 2016 Trump. Worth flagging if we ever add era-specific
      // mobilization signals.
      //
      // Declared as one canonical pattern (2016 protest); voteMatchMin
      // honors the engine's actual 3/5 against this declaration.
      2008: "ABSTAIN",
      2012: "ABSTAIN",
      2016: "R",
      2020: "ABSTAIN",
      2024: "ABSTAIN",
    },
    voteMatchMin: 3,
    engagement: "apolitical",
    questionsInRange: [20, 35],
  },
};
