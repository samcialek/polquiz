// Tier-B persona #8 (HARNESS-HANDOFF §3.2.8): Triple-switcher.
//
// Trump 2016 (change vote) → Biden 2020 (chaos fatigue) → Trump 2024
// (inflation). Per spec: "Tests model's ability to handle non-monotonic
// voting — this is the structurally hardest case; document it explicitly
// as a stress test, not a calibration target."
//
// This persona is explicitly NOT a calibration target. The static-position
// model cannot represent the cycle-to-cycle salience shifts that drive
// real-world non-monotonic switching. The expected.votes field declares
// the historical pattern; voteMatchMin is set to the actually-achievable
// count, with the gap documented inline as the structural finding.
//
// Per-node sketch (1-5): centrist non-college, all near 3.
//   MAT  3 (mixed economic — protectionist on trade, mild redistributive)
//   CD   3 (centrist on culture)
//   CU   3 (mixed)
//   MOR  3 (moderate scope)
//   PRO  2 (results > rules — willing to vote for whoever promises change)
//   COM  3 (mixed)
//   ZS   4 (zero-sum economic anxiety — drives the change-vote pattern)
//   ONT_H 3 (mixed)
//   ONT_S 2 (anti-establishment — distrustful of the system)
//   ENG   2 (casual — low political attention is part of the switching
//            pattern; engaged voters tend to stay in their coalition)
//
// Moral circle: moderate universal, no scope strongly loaded. Engine
// reads as a centrist without a clear partisan home — exactly the kind
// of voter who can be moved by short-term salience cues.

import type { Persona } from "../answerEngine.js";

export const tripleSwitcherPersona: Persona = {
  id: "triple-switcher",
  name: "Triple-Switcher (Trump→Biden→Trump, 2016/2020/2024)",
  demographics: {
    age: "45-54",
    gender: "male",
    race: "white",
    lgbtq: "no",
    religion: "christian",
  },
  partyID: "ind_pure",
  positions: {
    MAT: 3,
    CD: 3,
    CU: 3,
    MOR: 3,
    PRO: 2,
    COM: 3,
    ZS: 4,
    ONT_H: 3,
    ONT_S: 2,
    PF: 2,
    TRB: 3,
    ENG: 2,
  },
  saliences: {
    MAT: 3,
    CD: 2,
    CU: 1,
    MOR: 1,
    PRO: 1,
    COM: 1,
    ZS: 3,
    ONT_H: 1,
    ONT_S: 2,
    PF: 1,
    TRB: 1,
    ENG: 2,
    EPS: 1,
    AES: 2,
  },
  moralCircle: {
    universal: 55,
    scopedAffinities: {
      national: 60,
      religious: 50,
      ethnic_racial: 55,
      class: 65,
      gender: 50,
      ideological: 55,
    },
  },
  eps: "intuitionist",
  aes: "authentic",
  engagement: "casual",
  strategicVoting: "not_sure",
  negativePartisanship: "consider_all",
  expected: {
    archetypeFamily: "centrist switcher / non-college voter",
    // Observed top-1 #124 Latent Alarmist (top-5: 124, 118, 106, 088, 137).
    // The model reads this persona as low-engagement cultural-conservative-
    // anxious — accurate for the demographic, even though it can't
    // capture the cycle-to-cycle switching.
    archetypeIds: ["124", "118", "106", "088", "137"],
    archetypeLabelContains: [],
    identityPrimaryState: "none",
    votes: {
      // Historical pattern per HARNESS-HANDOFF §3.2.8. The model is
      // STRUCTURALLY UNABLE to predict this pattern from static positions
      // — declared here for documentation. voteMatchMin set after
      // observation to whatever the model actually produces (typically
      // a single-direction prediction across all years).
      2008: "ABSTAIN",
      2012: "ABSTAIN",
      2016: "R",
      2020: "D",
      2024: "R",
    },
    // FINDING: NON-MONOTONIC VOTING IS STRUCTURALLY UNREPRESENTABLE.
    //
    // A static-position model maps positions → candidate distances →
    // vote. With positions fixed, the predicted vote is a deterministic
    // function of (positions, candidates, era weights). It cannot
    // produce R→D→R across consecutive cycles unless either the
    // candidate distances change radically (era weights) or the
    // positions themselves change (which this model architecture
    // explicitly disallows).
    //
    // OBSERVATION: the engine actually achieves 4/5 — it correctly
    // predicts 2008/2012 ABSTAIN, 2016 R, and 2024 R. The single miss
    // is 2020: engine predicts R (the persona's positions pull R
    // consistently), historical ground truth is D. That single year IS
    // the non-monotonic switch — exactly what the spec said the model
    // cannot capture. So the "structurally hardest case" turns out to
    // miss in exactly the predicted way, and only in that way. Good
    // confirmation that the limitation is localized to the switch year.
    //
    // voteMatchMin: 4 is the honest score — what the engine actually
    // produces, not contorted upward. The single 2020 miss remains the
    // documented finding.
    //
    // Route to address: introduce a salience-shock or era-context
    // mechanism that lets a single 1-D position vector produce
    // different votes in different elections based on contextual
    // weighting. Effectively: temporal extension to the engine.
    voteMatchMin: 4,
    engagement: "casual",
    questionsInRange: [20, 35],
  },
};
