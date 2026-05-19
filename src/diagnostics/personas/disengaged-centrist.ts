// Tier-B persona #14 (HARNESS-HANDOFF §3.2.14): Disengaged centrist.
//
// Casual engagement. All positions near 3. Salience mostly low. Per spec:
// "Tests that low-engagement personas correctly trigger abstain and don't
// get force-routed to an archetype."
//
// Priority for this persona is HONEST ABSTENTION BEHAVIOR — the engine
// should predict abstain in most years given the persona's low ENG and
// low overall salience. Composed label and top-archetype are secondary;
// the harness shouldn't pressure the persona to look polished.
//
// Per-node sketch (1-5):
//   MAT  3 (centrist)
//   CD   3 (centrist)
//   CU   3 (centrist)
//   MOR  3 (centrist)
//   PRO  3 (centrist)
//   COM  3 (centrist)
//   ZS   3 (centrist)
//   ONT_H 3 (centrist)
//   ONT_S 3 (centrist)
//   ENG   1 (low engagement — defining trait; should pull engagement
//             level toward "apolitical" or "casual")
//
// Moral circle: universal 50, all scoped near baseline. No active
// boundaries → no IDP overlay.
// EPS: mid (no strong epistemic identity); AES: mid.

import type { Persona } from "../answerEngine.js";

export const disengagedCentristPersona: Persona = {
  id: "disengaged-centrist",
  name: "Disengaged Centrist (mostly abstains)",
  demographics: {
    age: "35-44",
    gender: "female",
    race: "white",
    lgbtq: "no",
    religion: "none",
  },
  partyID: "none",
  positions: {
    MAT: 3,
    CD: 3,
    CU: 3,
    MOR: 3,
    PRO: 3,
    COM: 3,
    ZS: 3,
    ONT_H: 3,
    ONT_S: 3,
    PF: 1,
    TRB: 1,
    ENG: 1,
  },
  saliences: {
    MAT: 0,
    CD: 0,
    CU: 0,
    MOR: 0,
    PRO: 0,
    COM: 0,
    ZS: 0,
    ONT_H: 0,
    ONT_S: 0,
    PF: 0,
    TRB: 0,
    ENG: 1,
    EPS: 0,
    AES: 0,
  },
  moralCircle: {
    universal: 50,
    scopedAffinities: {
      national: 50,
      religious: 40,
      ethnic_racial: 50,
      class: 50,
      gender: 50,
      ideological: 50,
    },
  },
  eps: "empiricist",
  aes: "statesman",
  engagement: "apolitical",
  strategicVoting: "not_sure",
  negativePartisanship: "consider_all",
  expected: {
    archetypeFamily: "disengaged / functionally apolitical",
    // RESOLVED (Phase 7 P2 2026-05-19): the original top-1 #145 Feminist
    // Voter was a diagnostic-ranking bug, not a force-routing bug.
    // `resolveIdentityPrimary` correctly returned `none` (engagement
    // gate not met, no scope above baseline). The harness's
    // `getTopArchetypesForDiagnostics` was ranking ALL archetypes by
    // raw distance, including IDP archetypes 141-146 which per
    // CLAUDE.md are a SEPARATE post-base-assignment layer.
    //
    // Fix: `getTopArchetypesForDiagnostics` now excludes IDs 141-146
    // by default (opt back in via `includeIdentityPrimary: true` for
    // debugging). Disengaged-centrist now reports top-1 #042 Localist
    // Progressive — still imperfect (the persona is centrist-apolitical
    // and #042 is mildly progressive-localist), but accurately reflects
    // the nearest BASE archetype.
    //
    // The remaining F5 archetype-space gap is real: the 121-archetype
    // space inherently lacks a "centrist apolitical" home. Documented
    // as F5; deferred per Phase 7 plan (CLAUDE.md anchor on count).
    archetypeIds: ["042", "050", "048", "002", "043"],
    archetypeLabelContains: [],
    identityPrimaryState: "none",
    votes: {
      // Spec says "mostly abstains". Engine produces: D D ABSTAIN
      // ABSTAIN ABSTAIN. Centrist positions + female demographic +
      // low engagement get the engine to pick Obama for 2008/2012 even
      // though ENG state should suppress voting. The 2016+ abstentions
      // work because the candidate distances widen in later cycles
      // (Trump-era candidates farther from centrist).
      //
      // FINDING: the engagement→abstain mechanism doesn't fully
      // suppress votes for centrist-D-friendly profiles in Obama-era
      // elections. Documented as 3/5.
      2008: "ABSTAIN",
      2012: "ABSTAIN",
      2016: "ABSTAIN",
      2020: "ABSTAIN",
      2024: "ABSTAIN",
    },
    voteMatchMin: 3,
    engagement: "apolitical",
    questionsInRange: [20, 35],
  },
};
