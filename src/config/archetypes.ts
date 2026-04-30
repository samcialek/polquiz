import type { Archetype } from "../types.js";

// 121 active archetypes (+3 deactivated kept in array for ID stability: 019, 023, 025).
// Priors are uniform at 1/121 (active archetypes only).
// IDs 141-146: identity-primary archetypes (Black Voter, White Grievance, Evangelical, LGBTQ, Feminist, Male Grievance).
//
// Lineage: 132 → 124 → 122 → 115 → 118 → 121. The 2026-04-23 expansion added
// three nihilist-dominant EPS archetypes (108/113/114) to break the matcher-layer
// bottleneck: pre-expansion only 1 of 118 archetypes had nihilist as dominant EPS
// (#146 Male Grievance Voter), so nihilist posterior evidence had nowhere to route.
// IDs that no longer exist in the array were collapsed because their node
// signatures overlapped too heavily with neighbors within the quiz's 14-node
// instrument:
//
//   018  Social Avenger              — collapsed into 017 Uncompromising Redistributionist
//   019  Anarchist Mutualist         — merged into 020 Grassroots Autonomist (DEACTIVATED, prior=0)
//   023  Rights Cosmopolitan         — merged into 021 Principled Cosmopolitan (DEACTIVATED, prior=0)
//   025  World-Minded Reformer       — merged into 021 Principled Cosmopolitan (DEACTIVATED, prior=0)
//   034  Evidence Reformer           — collapsed (commented inline near id 035)
//   038  Abundance Planner           — collapsed into 037 Fabian Modernizer
//   044  Parish Steward              — collapsed into 045 Rooted Social Reformer
//   047  (removed)
//   064  (removed)
//   066  Entrepreneurial Reformer    — collapsed into 065 Opportunity Liberal
//   068  Inventive Libertarian       — collapsed into 069 Bleeding-Heart Libertarian
//   080  Chestertonian Traditionalist → merged into 091 Security Paternalist
//   108  Passive Cynic               — reinstated 2026-04-23 (EPS nihilist-dominant)
//   113  Disaffected Contrarian      — reinstated 2026-04-23 (EPS nihilist-dominant, formerly Expressive Libertine)
//   114  Political Nihilist          — reinstated 2026-04-23 (EPS nihilist-dominant)
//   123  Contented Householder       — collapsed into 122 Civic Minimalist
//   130  Habitual Partisan           — merged into 131 Duty Voter (2026-04-01)
//
// Numeric-ID gaps in the range 001–140 represent these collapsed archetypes.

export const ARCHETYPES: Archetype[] = [
  {
    id: "001",
    name: "Rawlsian Reformer",
    tier: "T1",
    nodes: {
      MAT: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      CD: { kind: "continuous", pos: 1, sal: 2 },
      CU: { kind: "continuous", pos: 5, sal: 3, anti: "low" },
      MOR: { kind: "continuous", pos: 5, sal: 3, anti: "low" },
      PRO: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      COM: { kind: "continuous", pos: 4, sal: 2 },
      ZS: { kind: "continuous", pos: 2, sal: 2, anti: "high" },
      ONT_H: { kind: "continuous", pos: 4, sal: 2 },
      ONT_S: { kind: "continuous", pos: 3, sal: 1 },
      PF: { kind: "continuous", pos: 2 },
      TRB: { kind: "continuous", pos: 2, anti: "high" },
      EPS: { kind: "categorical", probs: [0.25, 0.58, 0.05, 0.03, 0.06, 0.03], sal: 2, antiCats: [5] },
      AES: { kind: "categorical", probs: [0.60, 0.10, 0.14, 0.06, 0.04, 0.06], sal: 2, antiCats: [4] },
    },
    morBoundaries: { boundaries: { national: 0.05, ethnic_racial: 0.05, religious: 0.05, class: 0.19, ideological: 0.11, gender: 0.06, political_tribe: 0.25 }, intensity: 3 },
  },
  {
    id: "002",
    name: "Independent Social Democrat",
    tier: "T1",
    nodes: {
      MAT: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      CD: { kind: "continuous", pos: 2, sal: 1 },
      CU: { kind: "continuous", pos: 4, sal: 1 },
      MOR: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      PRO: { kind: "continuous", pos: 3, sal: 2 },
      COM: { kind: "continuous", pos: 4, sal: 1 },
      ZS: { kind: "continuous", pos: 2, sal: 1 },
      ONT_H: { kind: "continuous", pos: 4, sal: 1 },
      ONT_S: { kind: "continuous", pos: 3, sal: 1 },
      PF: { kind: "continuous", pos: 2 },
      TRB: { kind: "continuous", pos: 2 },
      EPS: { kind: "categorical", probs: [0.25, 0.58, 0.05, 0.03, 0.06, 0.03], sal: 1, antiCats: [5] },
      AES: { kind: "categorical", probs: [0.60, 0.10, 0.14, 0.06, 0.04, 0.06], sal: 1, antiCats: [4] },
    },
    morBoundaries: { boundaries: { national: 0.05, ethnic_racial: 0.05, religious: 0.05, class: 0.19, ideological: 0.07, gender: 0.06, political_tribe: 0.25 }, intensity: 2 },
  },
  {
    id: "003",
    name: "Consensus Redistributionist",
    tier: "T1",
    nodes: {
      MAT: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      CD: { kind: "continuous", pos: 3, sal: 1 },
      CU: { kind: "continuous", pos: 4, sal: 1 },
      MOR: { kind: "continuous", pos: 4, sal: 1 },
      PRO: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      COM: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      ZS: { kind: "continuous", pos: 2, sal: 1 },
      ONT_H: { kind: "continuous", pos: 4, sal: 1 },
      ONT_S: { kind: "continuous", pos: 3, sal: 1 },
      PF: { kind: "continuous", pos: 2 },
      TRB: { kind: "continuous", pos: 2 },
      EPS: { kind: "categorical", probs: [0.62, 0.24, 0.03, 0.04, 0.03, 0.04], sal: 1, antiCats: [2, 3, 5] },
      AES: { kind: "categorical", probs: [0.08, 0.64, 0.04, 0.04, 0.03, 0.17], sal: 1, antiCats: [4] },
    },
    morBoundaries: { boundaries: { national: 0.05, ethnic_racial: 0.05, religious: 0.05, class: 0.17, ideological: 0.07, gender: 0.06, political_tribe: 0.25 }, intensity: 1 },
  },
  {
    id: "004",
    name: "Labor Reformer",
    tier: "T1",
    // CU 2→3 (2026-04-26 broadened CU framing): civic-nationalist progressive
    // labor pattern; net mid under broader uniformity-vs-pluralism axis.
    nodes: {
      MAT: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      CD: { kind: "continuous", pos: 2, sal: 1 },
      CU: { kind: "continuous", pos: 3, sal: 1 },
      MOR: { kind: "continuous", pos: 4, sal: 1 },
      PRO: { kind: "continuous", pos: 4, sal: 2 },
      COM: { kind: "continuous", pos: 4, sal: 1 },
      ZS: { kind: "continuous", pos: 2, sal: 1 },
      ONT_H: { kind: "continuous", pos: 4, sal: 1 },
      ONT_S: { kind: "continuous", pos: 3, sal: 1 },
      PF: { kind: "continuous", pos: 3 },
      TRB: { kind: "continuous", pos: 4 },
      EPS: { kind: "categorical", probs: [0.25, 0.58, 0.05, 0.03, 0.06, 0.03], sal: 1, antiCats: [5] },
      AES: { kind: "categorical", probs: [0.04, 0.03, 0.04, 0.18, 0.63, 0.08], sal: 1, antiCats: [0, 1] },
    },
    morBoundaries: { boundaries: { national: 0.05, ethnic_racial: 0.05, religious: 0.05, class: 0.48, ideological: 0.12, gender: 0.09, political_tribe: 0.5 }, intensity: 2.25 },
  },
  {
    id: "005",
    name: "Pluralist Structuralist",
    tier: "T1",
    // ONT_S 1 → 4 per ADR-010 reframe (2026-04-26): structuralists who want to
    // reshape institutions to fix power imbalances believe well-designed
    // institutions CAN work. Old "system broken" reading at ONT_S=1 was wrong;
    // they're institutional reformers, not nihilists.
    nodes: {
      MAT: { kind: "continuous", pos: 2, sal: 2 },
      CD: { kind: "continuous", pos: 2, sal: 1 },
      CU: { kind: "continuous", pos: 4, sal: 2 },
      MOR: { kind: "continuous", pos: 4, sal: 2 },
      PRO: { kind: "continuous", pos: 5, sal: 2 },
      COM: { kind: "continuous", pos: 4, sal: 1 },
      ZS: { kind: "continuous", pos: 4, sal: 2 },
      ONT_H: { kind: "continuous", pos: 4, sal: 1 },
      ONT_S: { kind: "continuous", pos: 4, sal: 2 },
      PF: { kind: "continuous", pos: 2 },
      TRB: { kind: "continuous", pos: 2 },
      EPS: { kind: "categorical", probs: [0.25, 0.58, 0.05, 0.03, 0.06, 0.03], sal: 1 },
      AES: { kind: "categorical", probs: [0.60, 0.10, 0.14, 0.06, 0.04, 0.06], sal: 1 },
    
    },
    morBoundaries: { boundaries: { national: 0.05, ethnic_racial: 0.05, religious: 0.05, class: 0.19, ideological: 0.07, gender: 0.06, political_tribe: 0.25 }, intensity: 2 },
  },
  {
    id: "006",
    name: "Fairness Pragmatist",
    tier: "T1",
    nodes: {
      MAT: { kind: "continuous", pos: 2, sal: 2 },
      CD: { kind: "continuous", pos: 2, sal: 1 },
      CU: { kind: "continuous", pos: 4, sal: 1 },
      MOR: { kind: "continuous", pos: 3, sal: 1 },
      PRO: { kind: "continuous", pos: 4, sal: 2 },
      COM: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      ZS: { kind: "continuous", pos: 2, sal: 2 },  // raised sal 1→2 (discriminator vs Social Stabilizer)
      ONT_H: { kind: "continuous", pos: 4, sal: 1 },
      ONT_S: { kind: "continuous", pos: 3, sal: 2 },  // raised sal 1→2 (discriminator vs Social Stabilizer)
      PF: { kind: "continuous", pos: 2 },
      TRB: { kind: "continuous", pos: 2 },
      EPS: { kind: "categorical", probs: [0.62, 0.24, 0.03, 0.04, 0.03, 0.04], sal: 1, antiCats: [2, 3, 5] },
      AES: { kind: "categorical", probs: [0.60, 0.20, 0.04, 0.06, 0.04, 0.06], sal: 1, antiCats: [4] },
    },
    morBoundaries: { boundaries: { national: 0.05, ethnic_racial: 0.05, religious: 0.05, class: 0.19, ideological: 0.07, gender: 0.06, political_tribe: 0.25 }, intensity: 1 },
  },
  {
    id: "007",
    name: "Solidarist Reformer",
    tier: "T1",
    // CU 2→3 (2026-04-26 broadened CU framing): communal-left wants shared
    // moral values but pluralism on private lifestyle; net mid.
    nodes: {
      MAT: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      CD: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      CU: { kind: "continuous", pos: 3, sal: 2 },
      MOR: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      PRO: { kind: "continuous", pos: 4, sal: 2 },
      COM: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      ZS: { kind: "continuous", pos: 2, sal: 2 },
      ONT_H: { kind: "continuous", pos: 4, sal: 2 },
      ONT_S: { kind: "continuous", pos: 3, sal: 1 },
      PF: { kind: "continuous", pos: 2 },
      TRB: { kind: "continuous", pos: 2 },
      EPS: { kind: "categorical", probs: [0.04, 0.08, 0.60, 0.16, 0.08, 0.04], sal: 1, antiCats: [0, 5] },
      AES: { kind: "categorical", probs: [0.60, 0.10, 0.14, 0.06, 0.04, 0.06], sal: 1, antiCats: [4] },
    },
    morBoundaries: { boundaries: { national: 0.12, ethnic_racial: 0.05, religious: 0.22, class: 0.17, ideological: 0.11, gender: 0.06, political_tribe: 0.25 }, intensity: 2 },
  },
  {
    id: "008",
    name: "Procedural Redistributionist",
    tier: "T1",
    // ONT_H 2 → 4 per ADR-010 (2026-04-26): proceduralists believe institutions
    // (when properly designed) reshape incentives and behavior. Under the
    // malleability framing they are high-malleability-via-state, not skeptics.
    nodes: {
      MAT: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      CD: { kind: "continuous", pos: 2, sal: 1 },
      CU: { kind: "continuous", pos: 4, sal: 1 },
      MOR: { kind: "continuous", pos: 4, sal: 2 },
      PRO: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      COM: { kind: "continuous", pos: 3, sal: 1 },
      ZS: { kind: "continuous", pos: 2, sal: 1 },
      ONT_H: { kind: "continuous", pos: 4, sal: 1 },
      ONT_S: { kind: "continuous", pos: 3, sal: 1 },
      PF: { kind: "continuous", pos: 2 },
      TRB: { kind: "continuous", pos: 2 },
      EPS: { kind: "categorical", probs: [0.25, 0.58, 0.05, 0.03, 0.06, 0.03], sal: 1, antiCats: [5] },
      AES: { kind: "categorical", probs: [0.60, 0.10, 0.14, 0.06, 0.04, 0.06], sal: 1, antiCats: [4] },
    },
    morBoundaries: { boundaries: { national: 0.05, ethnic_racial: 0.05, religious: 0.05, class: 0.19, ideological: 0.07, gender: 0.06, political_tribe: 0.25 }, intensity: 2 },
  },
  {
    id: "010",
    name: "Bread-and-Butter Progressive",
    tier: "T1",
    // ONT_H 2 → 4 per ADR-010 (2026-04-26): BBP progressives believe state
    // programs (jobs, welfare, education) improve people's material and moral
    // condition. High malleability via state.
    nodes: {
      MAT: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      CD: { kind: "continuous", pos: 3, sal: 0 },
      CU: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      MOR: { kind: "continuous", pos: 2, sal: 1 },
      PRO: { kind: "continuous", pos: 4, sal: 2 },
      COM: { kind: "continuous", pos: 4, sal: 1 },
      ZS: { kind: "continuous", pos: 2, sal: 1 },
      ONT_H: { kind: "continuous", pos: 4, sal: 1 },
      ONT_S: { kind: "continuous", pos: 3, sal: 1 },
      PF: { kind: "continuous", pos: 2 },
      TRB: { kind: "continuous", pos: 2 },
      EPS: { kind: "categorical", probs: [0.25, 0.58, 0.05, 0.03, 0.06, 0.03], sal: 1, antiCats: [5] },
      AES: { kind: "categorical", probs: [0.60, 0.10, 0.14, 0.06, 0.04, 0.06], sal: 1, antiCats: [4] },
    },
    morBoundaries: { boundaries: { national: 0.19, ethnic_racial: 0.12, religious: 0.1, class: 0.17, ideological: 0.07, gender: 0.06, political_tribe: 0.25 }, intensity: 1 },
  },
  {
    id: "011",
    name: "Jacobin Egalitarian",
    tier: "T1",
    nodes: {
      MAT: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      CD: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      CU: { kind: "continuous", pos: 4, sal: 2, anti: "low" },
      MOR: { kind: "continuous", pos: 4, sal: 2, anti: "low" },
      PRO: { kind: "continuous", pos: 2, sal: 2, anti: "high" },
      COM: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      ZS: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      ONT_H: { kind: "continuous", pos: 3, sal: 2, anti: "high" },
      ONT_S: { kind: "continuous", pos: 2, sal: 1 },
      PF: { kind: "continuous", pos: 2 },
      TRB: { kind: "continuous", pos: 3 },
      EPS: { kind: "categorical", probs: [0.05, 0.05, 0.08, 0.58, 0.19, 0.05], sal: 1, antiCats: [0, 5] },
      AES: { kind: "categorical", probs: [0.04, 0.03, 0.04, 0.18, 0.63, 0.08], sal: 1, antiCats: [0, 1] },
    },
    morBoundaries: { boundaries: { national: 0.05, ethnic_racial: 0.05, religious: 0.05, class: 0.43, ideological: 0.26, gender: 0.07, political_tribe: 0.25 }, intensity: 2 },
  },
  {
    id: "012",
    name: "Class-War Leftist",
    // Archetype-audit Phase 4 (2026-04-26). Two priority-node corrections per
    // rubric. CU 2→3 (modest move; class-war can pair with internationalism
    // but ideological-uniformity edge retained — user direction). MOR 3→4
    // (universalist-class concern; spatial scope is wide). ONT_H 1→4
    // (ADR-010 reframe: class-warriors believe humans are reshaped by economic
    // structure → high malleability-via-cultivation; old ONT_H=1 reflected
    // pre-ADR-010 optimism-vs-pessimism reading). CU 4 jump held back per
    // user direction.
    tier: "T1",
    nodes: {
      MAT: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      CD: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      CU: { kind: "continuous", pos: 3, sal: 2 },
      MOR: { kind: "continuous", pos: 4, sal: 2 },
      PRO: { kind: "continuous", pos: 2, sal: 1 },
      COM: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      ZS: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      ONT_H: { kind: "continuous", pos: 4, sal: 2, anti: "low" },
      ONT_S: { kind: "continuous", pos: 2, sal: 2 },
      PF: { kind: "continuous", pos: 2 },
      TRB: { kind: "continuous", pos: 5, anti: "low" },
      EPS: { kind: "categorical", probs: [0.08, 0.08, 0.08, 0.20, 0.50, 0.06], sal: 1, antiCats: [2, 5] },
      AES: { kind: "categorical", probs: [0.04, 0.03, 0.04, 0.18, 0.63, 0.08], sal: 2, antiCats: [0, 1] },
    },
    morBoundaries: { boundaries: { national: 0.05, ethnic_racial: 0.05, religious: 0.05, class: 0.81, ideological: 0.48, gender: 0.1, political_tribe: 0.25 }, intensity: 3 },
  },
  {
    id: "013",
    name: "Radical Leveler",
    tier: "T1",
    nodes: {
      MAT: { kind: "continuous", pos: 2, sal: 2 },
      CD: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      CU: { kind: "continuous", pos: 4, sal: 1 },
      MOR: { kind: "continuous", pos: 4, sal: 1 },
      PRO: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      COM: { kind: "continuous", pos: 2, sal: 1 },
      ZS: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      ONT_H: { kind: "continuous", pos: 3, sal: 1 },
      ONT_S: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      PF: { kind: "continuous", pos: 2 },
      TRB: { kind: "continuous", pos: 3 },
      EPS: { kind: "categorical", probs: [0.08, 0.08, 0.08, 0.20, 0.50, 0.06], sal: 1, antiCats: [2, 5] },
      AES: { kind: "categorical", probs: [0.04, 0.03, 0.04, 0.18, 0.63, 0.08], sal: 2, antiCats: [0, 1] },
    },
    morBoundaries: { boundaries: { national: 0.05, ethnic_racial: 0.05, religious: 0.05, class: 0.34, ideological: 0.1, gender: 0.07, political_tribe: 0.25 }, intensity: 1.5 },
  },
  {
    id: "014",
    name: "Activist Progressive",
    // Archetype-audit Phase 4 (2026-04-26). ONT_S 2→4 per rubric Pattern A
    // archetype-side: "Activist Progressive" is institutional reform tradition
    // (Bryan/La Follette/FDR rubric anchor at ONT_S=4), not institutional
    // nihilism. Old ONT_S=2 reflects pre-ADR-010 "system needs reform"
    // framing; under capacity-belief framing, progressives believe institutions
    // CAN be made to work hard.
    tier: "T1",
    nodes: {
      MAT: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      CD: { kind: "continuous", pos: 2, sal: 2 },
      CU: { kind: "continuous", pos: 4, sal: 1 },
      MOR: { kind: "continuous", pos: 4, sal: 1 },
      PRO: { kind: "continuous", pos: 2, sal: 1 },
      COM: { kind: "continuous", pos: 3, sal: 1 },
      ZS: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      ONT_H: { kind: "continuous", pos: 3, sal: 1 },
      ONT_S: { kind: "continuous", pos: 4, sal: 1 },
      PF: { kind: "continuous", pos: 2 },
      TRB: { kind: "continuous", pos: 3 },
      EPS: { kind: "categorical", probs: [0.08, 0.08, 0.08, 0.20, 0.50, 0.06], sal: 1, antiCats: [2, 5] },
      AES: { kind: "categorical", probs: [0.06, 0.08, 0.05, 0.06, 0.08, 0.67], sal: 1 },
    },
    morBoundaries: { boundaries: { national: 0.05, ethnic_racial: 0.05, religious: 0.05, class: 0.43, ideological: 0.1, gender: 0.07, political_tribe: 0.25 }, intensity: 1.5 },
  },
  {
    id: "015",
    name: "Moral Firebrand",
    tier: "T1",
    nodes: {
      MAT: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      CD: { kind: "continuous", pos: 2, sal: 2, anti: "high" },
      CU: { kind: "continuous", pos: 5, sal: 3, anti: "low" },
      MOR: { kind: "continuous", pos: 5, sal: 3, anti: "low" },
      PRO: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      COM: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      ZS: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      ONT_H: { kind: "continuous", pos: 5, sal: 3, anti: "low" },
      ONT_S: { kind: "continuous", pos: 1, sal: 2 },
      PF: { kind: "continuous", pos: 2, anti: "low" },
      TRB: { kind: "continuous", pos: 4 },
      EPS: { kind: "categorical", probs: [0.05, 0.05, 0.08, 0.58, 0.19, 0.05], sal: 2, antiCats: [0, 5] },
      AES: { kind: "categorical", probs: [0.06, 0.08, 0.05, 0.06, 0.08, 0.67], sal: 2 },
    },
    morBoundaries: { boundaries: { national: 0.05, ethnic_racial: 0.05, religious: 0.05, class: 0.62, ideological: 0.26, gender: 0.09, political_tribe: 0.25 }, intensity: 3 },
  },
  {
    id: "016",
    name: "Insurgent Equalizer",
    tier: "T1",
    nodes: {
      MAT: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      CD: { kind: "continuous", pos: 2, sal: 2 },
      CU: { kind: "continuous", pos: 4, sal: 2, anti: "low" },
      MOR: { kind: "continuous", pos: 4, sal: 2, anti: "low" },
      PRO: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      COM: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      ZS: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      ONT_H: { kind: "continuous", pos: 3, sal: 2 },
      ONT_S: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      PF: { kind: "continuous", pos: 2 },
      TRB: { kind: "continuous", pos: 5, anti: "low" },
      EPS: { kind: "categorical", probs: [0.08, 0.08, 0.08, 0.20, 0.50, 0.06], sal: 1, antiCats: [2, 5] },
      AES: { kind: "categorical", probs: [0.04, 0.03, 0.04, 0.18, 0.63, 0.08], sal: 2, antiCats: [0, 1] },
    },
    morBoundaries: { boundaries: { national: 0.05, ethnic_racial: 0.05, religious: 0.05, class: 0.81, ideological: 0.34, gender: 0.1, political_tribe: 0.25 }, intensity: 3 },
  },
  {
    id: "017",
    name: "Uncompromising Redistributionist",
    // Archetype-audit Phase 6 ONT_H sweep (2026-04-27). ONT_H 1→4: parallel
    // fix to 012 Class-War Leftist. Old ONT_H=1 reflects pre-ADR-010
    // optimism-vs-pessimism reading ("pessimist about humans under
    // capitalism"). Under malleability-via-cultivation framing, an
    // uncompromising redistributionist who fights for max-state-redistribution
    // believes humans are reshaped by economic structure → high malleability.
    // Anti direction also flipped (high→low: now antagonistic to humans-fixed).
    tier: "T1",
    nodes: {
      MAT: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      CD: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      CU: { kind: "continuous", pos: 4, sal: 1 },
      MOR: { kind: "continuous", pos: 4, sal: 1 },
      PRO: { kind: "continuous", pos: 2, sal: 1 },
      COM: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      ZS: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      ONT_H: { kind: "continuous", pos: 4, sal: 2, anti: "low" },          // 1→4 audit Phase 6: humans reshaped by economic structure
      ONT_S: { kind: "continuous", pos: 2, sal: 1 },
      PF: { kind: "continuous", pos: 2 },
      TRB: { kind: "continuous", pos: 3 },
      EPS: { kind: "categorical", probs: [0.08, 0.08, 0.08, 0.20, 0.50, 0.06], sal: 1, antiCats: [2, 5] },
      AES: { kind: "categorical", probs: [0.04, 0.03, 0.04, 0.18, 0.63, 0.08], sal: 1, antiCats: [0, 1] },
    },
    morBoundaries: { boundaries: { national: 0.05, ethnic_racial: 0.05, religious: 0.05, class: 0.43, ideological: 0.26, gender: 0.07, political_tribe: 0.25 }, intensity: 1.5 },
  },
  // 019 Anarchist Mutualist — MERGED into 020 Grassroots Autonomist
  {
    id: "019",
    name: "Anarchist Mutualist",
    tier: "T1",
    active: false,  // DEACTIVATED — merged into 020
    nodes: {
      MAT: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      CD: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      CU: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      MOR: { kind: "continuous", pos: 4, sal: 2 },
      PRO: { kind: "continuous", pos: 1, sal: 3, anti: "high" },
      COM: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      ZS: { kind: "continuous", pos: 1, sal: 3, anti: "high" },
      ONT_H: { kind: "continuous", pos: 4, sal: 2 },
      ONT_S: { kind: "continuous", pos: 2, sal: 2 },
      PF: { kind: "continuous", pos: 2, anti: "low" },
      TRB: { kind: "continuous", pos: 2 },
      EPS: { kind: "categorical", probs: [0.08, 0.08, 0.08, 0.20, 0.50, 0.06], sal: 2, antiCats: [2, 5] },
      AES: { kind: "categorical", probs: [0.06, 0.05, 0.62, 0.17, 0.03, 0.07], sal: 2 },
    },
    morBoundaries: { boundaries: { national: 0.05, ethnic_racial: 0.05, religious: 0.05, class: 0.19, ideological: 0.16, gender: 0.06, political_tribe: 0.25 }, intensity: 2 },
  },
  {
    // Merged from 019 Anarchist Mutualist + 020 Horizontalist Dissenter
    // "Grassroots Autonomist" — anti-hierarchical, anti-institutional, bottom-up direct action
    id: "020",
    name: "Grassroots Autonomist",
    tier: "T1",
    nodes: {
      MAT: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      CD: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      CU: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      MOR: { kind: "continuous", pos: 4, sal: 2 },
      PRO: { kind: "continuous", pos: 1, sal: 3, anti: "high" },   // kept 019's stronger anti-proceduralism
      COM: { kind: "continuous", pos: 1, sal: 2, anti: "high" },   // kept 019's uncompromising stance
      ZS: { kind: "continuous", pos: 2, sal: 2, anti: "high" },    // split the difference (1+3)/2
      ONT_H: { kind: "continuous", pos: 4, sal: 2 },               // 019's optimism
      ONT_S: { kind: "continuous", pos: 2, sal: 2 },
      PF: { kind: "continuous", pos: 2, anti: "high" },    // kept 020's stronger anti-partisan
      TRB: { kind: "continuous", pos: 2, anti: "high" },   // kept 020's anti-tribal
      EPS: { kind: "categorical", probs: [0.08, 0.08, 0.08, 0.20, 0.50, 0.06], sal: 2, antiCats: [2, 5] },
      AES: { kind: "categorical", probs: [0.05, 0.05, 0.40, 0.38, 0.04, 0.08], sal: 2 }, // blend pastoral+plainspoken
    },
    morBoundaries: { boundaries: { national: 0.05, ethnic_racial: 0.05, religious: 0.05, class: 0.19, ideological: 0.16, gender: 0.06, political_tribe: 0.25 }, intensity: 2 },
  },
  {
    // Merged from 021 Kantian Cosmopolitan + 023 Rights Cosmopolitan + 025 World-Minded Reformer
    // "Principled Cosmopolitan" — universal moral principles, cross-border ethics, anti-tribal
    id: "021",
    name: "Principled Cosmopolitan",
    // Archetype-audit Phase 4 (2026-04-26). ONT_S 3→4: cosmopolitan-left
    // ONT_S undercoding fix per audit. Principled cosmopolitans use
    // international institutions hard (UN, ICC, treaty regimes) → institutional
    // capacity belief, not mid-skepticism. Old ONT_S=3 reflects pre-ADR-010
    // "system broken vs working" framing.
    tier: "T1",
    nodes: {
      MAT: { kind: "continuous", pos: 2, sal: 2 },
      CD: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      CU: { kind: "continuous", pos: 5, sal: 3, anti: "low" },    // cosmopolitanism is core
      MOR: { kind: "continuous", pos: 5, sal: 3, anti: "low" },   // moral universalism is core
      PRO: { kind: "continuous", pos: 5, sal: 2, anti: "low" },   // procedural (from 023/025)
      COM: { kind: "continuous", pos: 2, sal: 2 },                // leans uncompromising (from 023)
      ZS: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      ONT_H: { kind: "continuous", pos: 4, sal: 2 },
      ONT_S: { kind: "continuous", pos: 4, sal: 2 },              // 3→4 audit Phase 4: institutional-internationalist anchor
      PF: { kind: "continuous", pos: 2 },
      TRB: { kind: "continuous", pos: 2, anti: "high" },  // anti-tribalism is core
      EPS: { kind: "categorical", probs: [0.25, 0.58, 0.05, 0.03, 0.06, 0.03], sal: 1, antiCats: [5] },
      AES: { kind: "categorical", probs: [0.06, 0.18, 0.05, 0.06, 0.08, 0.57], sal: 2 },
    },
    morBoundaries: { boundaries: { national: 0.05, ethnic_racial: 0.05, religious: 0.05, class: 0.19, ideological: 0.07, gender: 0.06, political_tribe: 0.25 }, intensity: 3 },
  },
  {
    id: "022",
    name: "Pluralist Universalist",
    tier: "T1",
    nodes: {
      MAT: { kind: "continuous", pos: 2, sal: 2 },
      CD: { kind: "continuous", pos: 2, sal: 2 },
      CU: { kind: "continuous", pos: 5, sal: 2 },
      MOR: { kind: "continuous", pos: 4, sal: 2 },
      PRO: { kind: "continuous", pos: 2, sal: 2 },
      COM: { kind: "continuous", pos: 3, sal: 2 },
      ZS: { kind: "continuous", pos: 1, sal: 2 },
      ONT_H: { kind: "continuous", pos: 4, sal: 2 },
      ONT_S: { kind: "continuous", pos: 3, sal: 1 },
      PF: { kind: "continuous", pos: 2 },
      TRB: { kind: "continuous", pos: 2 },
      EPS: { kind: "categorical", probs: [0.25, 0.58, 0.05, 0.03, 0.06, 0.03], sal: 1 },
      AES: { kind: "categorical", probs: [0.06, 0.18, 0.05, 0.06, 0.08, 0.57], sal: 1 },
    
    },
    morBoundaries: { boundaries: { national: 0.05, ethnic_racial: 0.05, religious: 0.05, class: 0.19, ideological: 0.07, gender: 0.06, political_tribe: 0.25 }, intensity: 2 },
  },
  {
    // 023 Rights Cosmopolitan — MERGED into 021 Principled Cosmopolitan
    id: "023",
    name: "Rights Cosmopolitan",
    tier: "T1",
    active: false,  // DEACTIVATED
    nodes: {
      MAT: { kind: "continuous", pos: 2, sal: 2, anti: "low" },   // added anti:low — not redistributionist
      CD: { kind: "continuous", pos: 1, sal: 3, anti: "high" },
      CU: { kind: "continuous", pos: 4, sal: 3, anti: "low" },
      MOR: { kind: "continuous", pos: 5, sal: 3, anti: "low" },
      PRO: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      COM: { kind: "continuous", pos: 1, sal: 3, anti: "high" },
      ZS: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      ONT_H: { kind: "continuous", pos: 5, sal: 2, anti: "low" }, // added anti:low — strongly optimistic
      ONT_S: { kind: "continuous", pos: 3, sal: 1 },
      PF: { kind: "continuous", pos: 2 },
      TRB: { kind: "continuous", pos: 2, anti: "high" },  // raised sal 2→3
      EPS: { kind: "categorical", probs: [0.25, 0.58, 0.05, 0.03, 0.06, 0.03], sal: 1, antiCats: [5] },
      AES: { kind: "categorical", probs: [0.06, 0.08, 0.05, 0.06, 0.08, 0.67], sal: 2 }, // raised sal 1→2
    },
    morBoundaries: { boundaries: { national: 0.05, ethnic_racial: 0.05, religious: 0.05, class: 0.19, ideological: 0.12, gender: 0.06, political_tribe: 0.25 }, intensity: 3 },
  },
  {
    id: "024",
    name: "Ethical Internationalist",
    // Archetype-audit Phase 4 (2026-04-26). ONT_S 3→4: cosmopolitan-left
    // ONT_S undercoding fix. Ethical internationalism (UN tradition, Marshall
    // Plan, treaty regime building) is the institutional-internationalist
    // anchor → ONT_S=4. Old ONT_S=3 reflects pre-ADR-010 framing.
    tier: "T1",
    nodes: {
      MAT: { kind: "continuous", pos: 1, sal: 2 },
      CD: { kind: "continuous", pos: 1, sal: 3, anti: "high" },
      CU: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      MOR: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      PRO: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      COM: { kind: "continuous", pos: 5, sal: 3 },
      ZS: { kind: "continuous", pos: 1, sal: 3, anti: "high" },
      ONT_H: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      ONT_S: { kind: "continuous", pos: 4, sal: 1 },             // 3→4 audit Phase 4: institutional-internationalist anchor
      PF: { kind: "continuous", pos: 2 },
      TRB: { kind: "continuous", pos: 2, anti: "high" },
      EPS: { kind: "categorical", probs: [0.25, 0.58, 0.05, 0.03, 0.06, 0.03], sal: 1, antiCats: [5] },
      AES: { kind: "categorical", probs: [0.06, 0.18, 0.05, 0.06, 0.08, 0.57], sal: 2 },
    },
    morBoundaries: { boundaries: { national: 0.05, ethnic_racial: 0.05, religious: 0.05, class: 0.19, ideological: 0.11, gender: 0.06, political_tribe: 0.25 }, intensity: 2 },
  },
  {
    // 025 World-Minded Reformer — MERGED into 021 Principled Cosmopolitan
    id: "025",
    name: "World-Minded Reformer",
    tier: "T1",
    active: false,  // DEACTIVATED
    nodes: {
      MAT: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      CD: { kind: "continuous", pos: 2, sal: 2 },
      CU: { kind: "continuous", pos: 5, sal: 3, anti: "low" },
      MOR: { kind: "continuous", pos: 5, sal: 3, anti: "low" },
      PRO: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      COM: { kind: "continuous", pos: 3, sal: 2 },
      ZS: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      ONT_H: { kind: "continuous", pos: 4, sal: 2 },
      ONT_S: { kind: "continuous", pos: 2, sal: 3, anti: "high" }, // raised sal 2→3: system critique is core
      PF: { kind: "continuous", pos: 2 },
      TRB: { kind: "continuous", pos: 2, anti: "high" },
      EPS: { kind: "categorical", probs: [0.25, 0.58, 0.05, 0.03, 0.06, 0.03], sal: 2, antiCats: [5] }, // raised sal 1→2
      AES: { kind: "categorical", probs: [0.08, 0.64, 0.04, 0.04, 0.03, 0.17], sal: 2, antiCats: [4] },
    },
    morBoundaries: { boundaries: { national: 0.05, ethnic_racial: 0.05, religious: 0.05, class: 0.19, ideological: 0.07, gender: 0.06, political_tribe: 0.25 }, intensity: 3 },
  },
  {
    id: "026",
    name: "Cosmopolitan Pragmatist",
    tier: "T1",
    nodes: {
      MAT: { kind: "continuous", pos: 2, sal: 1 },
      CD: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      CU: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      MOR: { kind: "continuous", pos: 3, sal: 2 },
      PRO: { kind: "continuous", pos: 3, sal: 2 },
      COM: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      ZS: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      ONT_H: { kind: "continuous", pos: 4, sal: 2 },
      ONT_S: { kind: "continuous", pos: 3, sal: 1 },
      PF: { kind: "continuous", pos: 2 },
      TRB: { kind: "continuous", pos: 2, anti: "high" },
      EPS: { kind: "categorical", probs: [0.25, 0.58, 0.05, 0.03, 0.06, 0.03], sal: 1, antiCats: [5] },
      AES: { kind: "categorical", probs: [0.06, 0.18, 0.05, 0.06, 0.08, 0.57], sal: 1 },
    },
    morBoundaries: { boundaries: { national: 0.05, ethnic_racial: 0.05, religious: 0.05, class: 0.19, ideological: 0.07, gender: 0.06, political_tribe: 0.25 }, intensity: 2 },
  },
  {
    id: "027",
    name: "Popperian Liberal",
    // Archetype-audit Phase 4 (2026-04-26). MOR 2→4: open-society liberalism
    // is moral-universalist (wide spatial scope across humanity), not narrow.
    // Old MOR=2 conflated Popper's individual-rights-first framing with
    // narrow practiced scope; rubric requires spatial scope only.
    tier: "T1",
    nodes: {
      MAT: { kind: "continuous", pos: 2, sal: 1 },
      CD: { kind: "continuous", pos: 2, sal: 2 },
      CU: { kind: "continuous", pos: 3, sal: 2 },
      MOR: { kind: "continuous", pos: 4, sal: 2 },
      PRO: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      COM: { kind: "continuous", pos: 4, sal: 2 },
      ZS: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      ONT_H: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      ONT_S: { kind: "continuous", pos: 3, sal: 1 },
      PF: { kind: "continuous", pos: 2, anti: "high" },
      TRB: { kind: "continuous", pos: 2, anti: "high" },
      EPS: { kind: "categorical", probs: [0.62, 0.24, 0.03, 0.04, 0.03, 0.04], sal: 3, antiCats: [2, 3, 5] },
      AES: { kind: "categorical", probs: [0.60, 0.10, 0.14, 0.06, 0.04, 0.06], sal: 1, antiCats: [4] },
    },
    morBoundaries: { boundaries: { national: 0.05, ethnic_racial: 0.05, religious: 0.05, class: 0.19, ideological: 0.07, gender: 0.06, political_tribe: 0.25 }, intensity: 2 },
  },
  {
    id: "028",
    name: "Global Caretaker",
    // Archetype-audit Phase 4 (2026-04-26). ONT_S 3→4: cosmopolitan-left
    // ONT_S undercoding fix. Global care = WHO / Marshall Plan / aid-
    // institution-builder tradition → institutional capacity belief, not
    // mid-skepticism.
    tier: "T1",
    nodes: {
      MAT: { kind: "continuous", pos: 2, sal: 2 },
      CD: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      CU: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      MOR: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      PRO: { kind: "continuous", pos: 2, sal: 2 },
      COM: { kind: "continuous", pos: 4, sal: 2 },
      ZS: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      ONT_H: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      ONT_S: { kind: "continuous", pos: 4, sal: 1 },             // 3→4 audit Phase 4: institutional-internationalist anchor
      PF: { kind: "continuous", pos: 2 },
      TRB: { kind: "continuous", pos: 2, anti: "high" },
      EPS: { kind: "categorical", probs: [0.25, 0.58, 0.05, 0.03, 0.06, 0.03], sal: 1, antiCats: [5] },
      AES: { kind: "categorical", probs: [0.06, 0.05, 0.62, 0.17, 0.03, 0.07], sal: 1 },
    },
    morBoundaries: { boundaries: { national: 0.05, ethnic_racial: 0.05, religious: 0.05, class: 0.19, ideological: 0.07, gender: 0.06, political_tribe: 0.25 }, intensity: 2 },
  },
  {
    id: "029",
    name: "Liberationist Progressive",
    tier: "T1",
    nodes: {
      MAT: { kind: "continuous", pos: 1, sal: 2 },
      CD: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      CU: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      MOR: { kind: "continuous", pos: 5, sal: 3, anti: "low" },
      PRO: { kind: "continuous", pos: 1, sal: 3, anti: "high" },
      COM: { kind: "continuous", pos: 2, sal: 2 },
      ZS: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      ONT_H: { kind: "continuous", pos: 4, sal: 2 },
      ONT_S: { kind: "continuous", pos: 3, sal: 2 },
      PF: { kind: "continuous", pos: 2 },
      TRB: { kind: "continuous", pos: 2, anti: "high" },
      EPS: { kind: "categorical", probs: [0.05, 0.05, 0.08, 0.58, 0.19, 0.05], sal: 1, antiCats: [0, 5] },
      AES: { kind: "categorical", probs: [0.06, 0.18, 0.05, 0.06, 0.08, 0.57], sal: 2 },
    },
    morBoundaries: { boundaries: { national: 0.05, ethnic_racial: 0.05, religious: 0.05, class: 0.19, ideological: 0.11, gender: 0.06, political_tribe: 0.25 }, intensity: 3 },
  },
  {
    id: "031",
    name: "Planetary Steward",
    // Archetype-audit Phase 4 (2026-04-26). ONT_S 1→4 (PROMOTED HIGH per
    // user direction). Pattern A archetype-side: "Planetary Steward" implies
    // institutional climate-care (IPCC, Paris regime, multilateral
    // stewardship), not eco-anarchism. Old ONT_S=1 anti:high read this as
    // accelerationist nihilism — opposite of the name. Anti direction also
    // flipped: anti:high → anti:low (now antagonistic to institutional
    // nihilism, not to capacity belief).
    tier: "T1",
    nodes: {
      MAT: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      CD: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      CU: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      MOR: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      PRO: { kind: "continuous", pos: 3, sal: 1 },
      COM: { kind: "continuous", pos: 4, sal: 1 },
      ZS: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      ONT_H: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      ONT_S: { kind: "continuous", pos: 4, sal: 2, anti: "low" },  // 1→4 audit Phase 4: institutional climate-care, not eco-anarchism
      PF: { kind: "continuous", pos: 2 },
      TRB: { kind: "continuous", pos: 2, anti: "high" },
      EPS: { kind: "categorical", probs: [0.62, 0.24, 0.03, 0.04, 0.03, 0.04], sal: 1, antiCats: [2, 3, 5] },
      AES: { kind: "categorical", probs: [0.06, 0.05, 0.62, 0.17, 0.03, 0.07], sal: 2 },
    },
    morBoundaries: { boundaries: { national: 0.05, ethnic_racial: 0.05, religious: 0.05, class: 0.19, ideological: 0.11, gender: 0.06, political_tribe: 0.25 }, intensity: 2 },
  },
  {
    id: "032",
    name: "Hamiltonian Technocrat",
    // Archetype-audit Phase 4 (2026-04-26). ONT_S 3→5 + sal 1→2. Hamilton is
    // the literal rubric anchor for ONT_S=5 ("Hamilton, FDR New Dealers,
    // Progressive-era state-builders"). A literal Hamilton-named archetype
    // mid-coded on the dimension Hamilton anchors is the most direct rubric-
    // cite miscoding in the corpus. Sal raised 1→2 per user direction —
    // Hamiltonian institutional capacity is a defining trait, not a side note.
    tier: "T1",
    nodes: {
      MAT: { kind: "continuous", pos: 3, sal: 2 },
      CD: { kind: "continuous", pos: 2, sal: 2, anti: "high" },
      CU: { kind: "continuous", pos: 4, sal: 2, anti: "high" },
      MOR: { kind: "continuous", pos: 3, sal: 2 },
      PRO: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      COM: { kind: "continuous", pos: 4, sal: 2, anti: "low" },
      ZS: { kind: "continuous", pos: 4, sal: 2 },
      ONT_H: { kind: "continuous", pos: 4, sal: 2, anti: "low" },
      ONT_S: { kind: "continuous", pos: 5, sal: 2, anti: "low" },  // 3→5 sal 1→2 audit Phase 4: Hamilton-anchor for institutional capacity belief
      PF: { kind: "continuous", pos: 3, anti: "high" }, // Fixed: sal 0→1 (can't have anti on sal=0)
      TRB: { kind: "continuous", pos: 2, anti: "high" },
      EPS: { kind: "categorical", probs: [0.62, 0.24, 0.03, 0.04, 0.03, 0.04], sal: 3, antiCats: [2, 3, 5] },
      AES: { kind: "categorical", probs: [0.08, 0.64, 0.04, 0.04, 0.03, 0.17], sal: 3, antiCats: [4] },
    },
    morBoundaries: { boundaries: { national: 0.05, ethnic_racial: 0.05, religious: 0.05, class: 0.05, ideological: 0.07, gender: 0.06, political_tribe: 0.5 }, intensity: 2 },
  },
  {
    id: "033",
    name: "Systems Modernizer",
    tier: "T1",
    nodes: {
      MAT: { kind: "continuous", pos: 2, sal: 2 },
      CD: { kind: "continuous", pos: 1, sal: 3, anti: "high" },
      CU: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      MOR: { kind: "continuous", pos: 4, sal: 2 },
      PRO: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      COM: { kind: "continuous", pos: 2, sal: 3, anti: "high" },
      ZS: { kind: "continuous", pos: 2, sal: 3, anti: "high" },
      ONT_H: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      ONT_S: { kind: "continuous", pos: 4, sal: 3 },
      PF: { kind: "continuous", pos: 3, anti: "low" },
      TRB: { kind: "continuous", pos: 2, anti: "high" },
      EPS: { kind: "categorical", probs: [0.62, 0.24, 0.03, 0.04, 0.03, 0.04], sal: 3, antiCats: [2, 3, 5] },
      AES: { kind: "categorical", probs: [0.06, 0.18, 0.05, 0.06, 0.08, 0.57], sal: 3 },
    },
    morBoundaries: { boundaries: { national: 0.05, ethnic_racial: 0.05, religious: 0.05, class: 0.19, ideological: 0.07, gender: 0.06, political_tribe: 0.5 }, intensity: 2 },
  },
  // {
  // id: "034",
  // name: "Evidence Reformer",
  // tier: "T1",
  // prior: 1/112,
  // nodes: {
  // MAT: { kind: "continuous", pos: 2, sal: 1 },
  // CD: { kind: "continuous", pos: 2, sal: 1 },
  // CU: { kind: "continuous", pos: 4, sal: 1 },
  // MOR: { kind: "continuous", pos: 4, sal: 1 },
  // PRO: { kind: "continuous", pos: 3, sal: 2 },
  // COM: { kind: "continuous", pos: 3, sal: 1 },
  // ZS: { kind: "continuous", pos: 2, sal: 1 },
  // ONT_H: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
  // ONT_S: { kind: "continuous", pos: 4, sal: 1 },
  // PF: { kind: "continuous", pos: 3 },
  // TRB: { kind: "continuous", pos: 2, anti: "high" },
  // ENG: { kind: "continuous", pos: 3 },
  // EPS: { kind: "categorical", probs: [0.62, 0.24, 0.03, 0.04, 0.03, 0.04], sal: 1, antiCats: [2, 3, 5] },
  // AES: { kind: "categorical", probs: [0.08, 0.64, 0.04, 0.04, 0.03, 0.17], sal: 1, antiCats: [4] },
  // }
  // },
  {
    id: "035",
    name: "Administrative Liberal",
    tier: "T1",
    nodes: {
      MAT: { kind: "continuous", pos: 2, sal: 1 },
      CD: { kind: "continuous", pos: 3, sal: 1 },
      CU: { kind: "continuous", pos: 4, sal: 1 },
      MOR: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      PRO: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      COM: { kind: "continuous", pos: 4, sal: 2 },
      ZS: { kind: "continuous", pos: 3, sal: 2 },
      ONT_H: { kind: "continuous", pos: 4, sal: 2 },
      ONT_S: { kind: "continuous", pos: 4, sal: 1 },
      PF: { kind: "continuous", pos: 4 },
      TRB: { kind: "continuous", pos: 2, anti: "high" },
      EPS: { kind: "categorical", probs: [0.62, 0.24, 0.03, 0.04, 0.03, 0.04], sal: 2, antiCats: [2, 3, 5] },
      AES: { kind: "categorical", probs: [0.08, 0.64, 0.04, 0.04, 0.03, 0.17], sal: 2, antiCats: [4] },
    },
    morBoundaries: { boundaries: { national: 0.09, ethnic_racial: 0.05, religious: 0.05, class: 0.17, ideological: 0.15, gender: 0.06, political_tribe: 0.75 }, intensity: 2.25 },
  },
  {
    id: "036",
    name: "Institutional Optimizer",
    tier: "T1",
    nodes: {
      MAT: { kind: "continuous", pos: 4, sal: 2 },
      CD: { kind: "continuous", pos: 2, sal: 2 },
      CU: { kind: "continuous", pos: 3, sal: 2 },
      MOR: { kind: "continuous", pos: 4, sal: 2 },
      PRO: { kind: "continuous", pos: 4, sal: 2 },
      COM: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      ZS: { kind: "continuous", pos: 2, sal: 2 },
      ONT_H: { kind: "continuous", pos: 4, sal: 2 },
      ONT_S: { kind: "continuous", pos: 4, sal: 2 },
      PF: { kind: "continuous", pos: 3 },
      TRB: { kind: "continuous", pos: 2, anti: "high" },
      EPS: { kind: "categorical", probs: [0.62, 0.24, 0.03, 0.04, 0.03, 0.04], sal: 2, antiCats: [2, 3, 5] },
      AES: { kind: "categorical", probs: [0.08, 0.64, 0.04, 0.04, 0.03, 0.17], sal: 2, antiCats: [4] },
    },
    morBoundaries: { boundaries: { national: 0.05, ethnic_racial: 0.05, religious: 0.05, class: 0.05, ideological: 0.07, gender: 0.06, political_tribe: 0.5 }, intensity: 2 },
  },
  {
    id: "037",
    name: "Fabian Modernizer",
    tier: "T1",
    nodes: {
      MAT: { kind: "continuous", pos: 1, sal: 1 },
      CD: { kind: "continuous", pos: 3, sal: 1 },
      CU: { kind: "continuous", pos: 4, sal: 1 },
      MOR: { kind: "continuous", pos: 4, sal: 2 },
      PRO: { kind: "continuous", pos: 5, sal: 3, anti: "low" },
      COM: { kind: "continuous", pos: 4, sal: 2 },
      ZS: { kind: "continuous", pos: 2, sal: 2 },
      ONT_H: { kind: "continuous", pos: 5, sal: 3, anti: "low" },
      ONT_S: { kind: "continuous", pos: 4, sal: 1 },
      PF: { kind: "continuous", pos: 2 },
      TRB: { kind: "continuous", pos: 2, anti: "high" },
      EPS: { kind: "categorical", probs: [0.25, 0.58, 0.05, 0.03, 0.06, 0.03], sal: 2, antiCats: [5] },
      AES: { kind: "categorical", probs: [0.08, 0.64, 0.04, 0.04, 0.03, 0.17], sal: 2, antiCats: [4] },
    },
    morBoundaries: { boundaries: { national: 0.05, ethnic_racial: 0.05, religious: 0.05, class: 0.17, ideological: 0.07, gender: 0.06, political_tribe: 0.25 }, intensity: 2 },
  },
  {
    id: "039",
    name: "Data-Driven Moderate",
    tier: "T1",
    // CU 2→3 (2026-04-26 broadened CU framing): technocratic pragmatist; not
    // uniformity-seeking, just outcome-oriented. Net mid under broader axis.
    nodes: {
      MAT: { kind: "continuous", pos: 3, sal: 0 },
      CD: { kind: "continuous", pos: 2, sal: 1 },
      CU: { kind: "continuous", pos: 3, sal: 2, anti: "high" },
      MOR: { kind: "continuous", pos: 3, sal: 1 },
      PRO: { kind: "continuous", pos: 4, sal: 2, anti: "low" },
      COM: { kind: "continuous", pos: 4, sal: 2 },
      ZS: { kind: "continuous", pos: 2, sal: 1 },
      ONT_H: { kind: "continuous", pos: 4, sal: 1, anti: "low" },
      ONT_S: { kind: "continuous", pos: 4, sal: 2 },
      PF: { kind: "continuous", pos: 3 },
      TRB: { kind: "continuous", pos: 2, anti: "high" },
      EPS: { kind: "categorical", probs: [0.62, 0.24, 0.03, 0.04, 0.03, 0.04], sal: 3, antiCats: [2, 3, 5] },
      AES: { kind: "categorical", probs: [0.08, 0.64, 0.04, 0.04, 0.03, 0.17], sal: 3, antiCats: [4] },
    },
    morBoundaries: { boundaries: { national: 0.05, ethnic_racial: 0.05, religious: 0.05, class: 0.05, ideological: 0.07, gender: 0.06, political_tribe: 0.5 }, intensity: 1.5 },
  },
  {
    id: "040",
    name: "Reform Engineer",
    tier: "T1",
    nodes: {
      MAT: { kind: "continuous", pos: 4, sal: 2 },
      CD: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      CU: { kind: "continuous", pos: 4, sal: 1 },
      MOR: { kind: "continuous", pos: 4, sal: 2 },
      PRO: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      COM: { kind: "continuous", pos: 4, sal: 2 },
      ZS: { kind: "continuous", pos: 3, sal: 2 },
      ONT_H: { kind: "continuous", pos: 4, sal: 1 },
      ONT_S: { kind: "continuous", pos: 3, sal: 1 },
      PF: { kind: "continuous", pos: 3 },
      TRB: { kind: "continuous", pos: 2, anti: "high" },
      EPS: { kind: "categorical", probs: [0.62, 0.24, 0.03, 0.04, 0.03, 0.04], sal: 2, antiCats: [2, 3, 5] },
      AES: { kind: "categorical", probs: [0.08, 0.64, 0.04, 0.04, 0.03, 0.17], sal: 2, antiCats: [4] },
    },
    morBoundaries: { boundaries: { national: 0.05, ethnic_racial: 0.05, religious: 0.05, class: 0.05, ideological: 0.07, gender: 0.06, political_tribe: 0.5 }, intensity: 2 },
  },
  {
    id: "042",
    name: "Localist Progressive",
    tier: "T1",
    // CU 2→3 (2026-04-26 broadened CU framing): participatory-progressive,
    // civic-local not assimilationist.
    nodes: {
      MAT: { kind: "continuous", pos: 2, sal: 2 },
      CD: { kind: "continuous", pos: 2, sal: 1 },
      CU: { kind: "continuous", pos: 3, sal: 2 },
      MOR: { kind: "continuous", pos: 3, sal: 1 },
      PRO: { kind: "continuous", pos: 3, sal: 1 },
      COM: { kind: "continuous", pos: 3, sal: 1 },
      ZS: { kind: "continuous", pos: 2, sal: 1 },
      ONT_H: { kind: "continuous", pos: 3, sal: 1 },
      ONT_S: { kind: "continuous", pos: 3, sal: 1 },
      PF: { kind: "continuous", pos: 2 },
      TRB: { kind: "continuous", pos: 2 },
      EPS: { kind: "categorical", probs: [0.04, 0.08, 0.60, 0.16, 0.08, 0.04], sal: 1, antiCats: [0, 5] },
      AES: { kind: "categorical", probs: [0.06, 0.05, 0.62, 0.17, 0.03, 0.07], sal: 1 },
    },
    morBoundaries: { boundaries: { national: 0.05, ethnic_racial: 0.05, religious: 0.15, class: 0.19, ideological: 0.07, gender: 0.06, political_tribe: 0.25 }, intensity: 1 },
  },
  {
    id: "043",
    name: "Quiet Egalitarian",
    tier: "T1",
    // CU 2→3 (2026-04-26 broadened CU framing): communitarian redistributionist
    // wants shared moral life via solidarity, not uniformity enforcement.
    nodes: {
      MAT: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      CD: { kind: "continuous", pos: 2, sal: 1 },
      CU: { kind: "continuous", pos: 3, sal: 1 },
      MOR: { kind: "continuous", pos: 4, sal: 2 },
      PRO: { kind: "continuous", pos: 3, sal: 1 },
      COM: { kind: "continuous", pos: 3, sal: 1 },
      ZS: { kind: "continuous", pos: 2, sal: 1 },
      ONT_H: { kind: "continuous", pos: 3, sal: 1 },
      ONT_S: { kind: "continuous", pos: 3, sal: 1 },
      PF: { kind: "continuous", pos: 2 },
      TRB: { kind: "continuous", pos: 2 },
      EPS: { kind: "categorical", probs: [0.04, 0.08, 0.60, 0.16, 0.08, 0.04], sal: 1, antiCats: [0, 5] },
      AES: { kind: "categorical", probs: [0.06, 0.05, 0.62, 0.17, 0.03, 0.07], sal: 2 },
    },
    morBoundaries: { boundaries: { national: 0.05, ethnic_racial: 0.05, religious: 0.15, class: 0.19, ideological: 0.07, gender: 0.06, political_tribe: 0.25 }, intensity: 2 },
  },
  {
    id: "045",
    name: "Rooted Social Reformer",
    tier: "T1",
    // CU 2→3 (2026-04-26 broadened CU framing): rooted progressive seeking
    // deep community cohesion, not assimilationism.
    nodes: {
      MAT: { kind: "continuous", pos: 1, sal: 2 },
      CD: { kind: "continuous", pos: 4, sal: 2 },
      CU: { kind: "continuous", pos: 3, sal: 2 },
      MOR: { kind: "continuous", pos: 3, sal: 2 },
      PRO: { kind: "continuous", pos: 4, sal: 2 },
      COM: { kind: "continuous", pos: 5, sal: 2 },
      ZS: { kind: "continuous", pos: 2, sal: 2 },
      ONT_H: { kind: "continuous", pos: 3, sal: 2 },
      ONT_S: { kind: "continuous", pos: 3, sal: 1 },
      PF: { kind: "continuous", pos: 2 },
      TRB: { kind: "continuous", pos: 2 },
      EPS: { kind: "categorical", probs: [0.14, 0.33, 0.33, 0.10, 0.07, 0.04], sal: 1 },
      AES: { kind: "categorical", probs: [0.06, 0.05, 0.62, 0.17, 0.03, 0.07], sal: 2 },
    
    },
    morBoundaries: { boundaries: { national: 0.15, ethnic_racial: 0.05, religious: 0.12, class: 0.17, ideological: 0.07, gender: 0.06, political_tribe: 0.25 }, intensity: 2 },
  },
  {
    id: "046",
    name: "Pastoral Leftist",
    tier: "T1",
    // CU 2→3 (2026-04-26 broadened CU framing): spiritual-communal, not
    // uniformity-seeking.
    nodes: {
      MAT: { kind: "continuous", pos: 2, sal: 2 },
      CD: { kind: "continuous", pos: 4, sal: 2 },
      CU: { kind: "continuous", pos: 3, sal: 2 },
      MOR: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      PRO: { kind: "continuous", pos: 3, sal: 1 },
      COM: { kind: "continuous", pos: 3, sal: 1 },
      ZS: { kind: "continuous", pos: 2, sal: 2 },
      ONT_H: { kind: "continuous", pos: 4, sal: 2 },
      ONT_S: { kind: "continuous", pos: 3, sal: 1 },
      PF: { kind: "continuous", pos: 2 },
      TRB: { kind: "continuous", pos: 2 },
      EPS: { kind: "categorical", probs: [0.04, 0.08, 0.60, 0.16, 0.08, 0.04], sal: 1, antiCats: [0, 5] },
      AES: { kind: "categorical", probs: [0.06, 0.05, 0.62, 0.17, 0.03, 0.07], sal: 3 },
    },
    morBoundaries: { boundaries: { national: 0.12, ethnic_racial: 0.05, religious: 0.22, class: 0.17, ideological: 0.07, gender: 0.06, political_tribe: 0.25 }, intensity: 2 },
  },
  // {
  // id: "047",
  // name: "Common-Life Reformer",
  // tier: "T1",
  // prior: 1/112,
  // nodes: {
  // MAT: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
  // CD: { kind: "continuous", pos: 3, sal: 1 },
  // CU: { kind: "continuous", pos: 2, sal: 1 },
  // MOR: { kind: "continuous", pos: 3, sal: 2 },
  // PRO: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
  // COM: { kind: "continuous", pos: 3, sal: 1 },
  // ZS: { kind: "continuous", pos: 2, sal: 1 },
  // ONT_H: { kind: "continuous", pos: 3, sal: 1 },
  // ONT_S: { kind: "continuous", pos: 3, sal: 1 },
  // PF: { kind: "continuous", pos: 2 },
  // TRB: { kind: "continuous", pos: 2 },
  // ENG: { kind: "continuous", pos: 4 },
  // EPS: { kind: "categorical", probs: [0.04, 0.08, 0.60, 0.16, 0.08, 0.04], sal: 1, antiCats: [0, 5] },
  // AES: { kind: "categorical", probs: [0.60, 0.10, 0.14, 0.06, 0.04, 0.06], sal: 1, antiCats: [4] },
  // }
  // },
  {
    id: "048",
    name: "Solidaristic Localist",
    tier: "T1",
    // CU 2→3 (2026-04-26 broadened CU framing): communitarian localist
    // preferring shared life to uniformity.
    nodes: {
      MAT: { kind: "continuous", pos: 2, sal: 2 },
      CD: { kind: "continuous", pos: 2, sal: 1 },
      CU: { kind: "continuous", pos: 3, sal: 2 },
      MOR: { kind: "continuous", pos: 3, sal: 1 },
      PRO: { kind: "continuous", pos: 3, sal: 1 },
      COM: { kind: "continuous", pos: 4, sal: 1 },
      ZS: { kind: "continuous", pos: 2, sal: 1 },
      ONT_H: { kind: "continuous", pos: 3, sal: 1 },
      ONT_S: { kind: "continuous", pos: 3, sal: 1 },
      PF: { kind: "continuous", pos: 2 },
      TRB: { kind: "continuous", pos: 4 },
      EPS: { kind: "categorical", probs: [0.04, 0.08, 0.60, 0.16, 0.08, 0.04], sal: 1, antiCats: [0, 5] },
      AES: { kind: "categorical", probs: [0.06, 0.05, 0.62, 0.17, 0.03, 0.07], sal: 2 },
    },
    morBoundaries: { boundaries: { national: 0.05, ethnic_racial: 0.05, religious: 0.34, class: 0.48, ideological: 0.12, gender: 0.09, political_tribe: 0.25 }, intensity: 2.25 },
  },
  {
    id: "049",
    name: "Moral Egalitarian",
    tier: "T1",
    // CU 2→3 (2026-04-26 broadened CU framing): equality-through-solidarity,
    // not uniformity. Old CU=2 was narrow-framed.
    nodes: {
      MAT: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      CD: { kind: "continuous", pos: 4, sal: 1 },
      CU: { kind: "continuous", pos: 3, sal: 1 },
      MOR: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      PRO: { kind: "continuous", pos: 4, sal: 1 },
      COM: { kind: "continuous", pos: 3, sal: 1 },
      ZS: { kind: "continuous", pos: 2, sal: 1 },
      ONT_H: { kind: "continuous", pos: 3, sal: 1 },
      ONT_S: { kind: "continuous", pos: 2, sal: 1 },
      PF: { kind: "continuous", pos: 2 },
      TRB: { kind: "continuous", pos: 2 },
      EPS: { kind: "categorical", probs: [0.04, 0.08, 0.60, 0.16, 0.08, 0.04], sal: 1, antiCats: [0, 5] },
      AES: { kind: "categorical", probs: [0.06, 0.05, 0.62, 0.17, 0.03, 0.07], sal: 1 },
    },
    morBoundaries: { boundaries: { national: 0.12, ethnic_racial: 0.05, religious: 0.22, class: 0.17, ideological: 0.07, gender: 0.06, political_tribe: 0.25 }, intensity: 2 },
  },
  {
    id: "050",
    name: "Traditionalist Moralist",
    tier: "T1",
    nodes: {
      MAT: { kind: "continuous", pos: 2, sal: 2 },
      CD: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      CU: { kind: "continuous", pos: 3, sal: 1 },
      MOR: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      PRO: { kind: "continuous", pos: 3, sal: 1 },
      COM: { kind: "continuous", pos: 3, sal: 1 },
      ZS: { kind: "continuous", pos: 3, sal: 1 },
      ONT_H: { kind: "continuous", pos: 3, sal: 1 },
      ONT_S: { kind: "continuous", pos: 3, sal: 1 },
      PF: { kind: "continuous", pos: 2 },
      TRB: { kind: "continuous", pos: 2 },
      EPS: { kind: "categorical", probs: [0.04, 0.08, 0.60, 0.16, 0.08, 0.04], sal: 1, antiCats: [0, 5] },
      AES: { kind: "categorical", probs: [0.06, 0.05, 0.62, 0.17, 0.03, 0.07], sal: 1 },
    },
    morBoundaries: { boundaries: { national: 0.12, ethnic_racial: 0.05, religious: 0.22, class: 0.17, ideological: 0.07, gender: 0.06, political_tribe: 0.25 }, intensity: 2 },
  },
  {
    id: "051",
    name: "Systemic Redistributionist",
    tier: "T1",
    nodes: {
      MAT: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      CD: { kind: "continuous", pos: 3, sal: 1 },
      CU: { kind: "continuous", pos: 3, sal: 2 },
      MOR: { kind: "continuous", pos: 3, sal: 2 },
      PRO: { kind: "continuous", pos: 3, sal: 1 },
      COM: { kind: "continuous", pos: 3, sal: 1 },
      ZS: { kind: "continuous", pos: 2, sal: 1 },
      ONT_H: { kind: "continuous", pos: 4, sal: 1 },
      ONT_S: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      PF: { kind: "continuous", pos: 2 },
      TRB: { kind: "continuous", pos: 2 },
      EPS: { kind: "categorical", probs: [0.04, 0.08, 0.60, 0.16, 0.08, 0.04], sal: 1, antiCats: [0, 5] },
      AES: { kind: "categorical", probs: [0.06, 0.05, 0.62, 0.17, 0.03, 0.07], sal: 1 },
    },
    morBoundaries: { boundaries: { national: 0.05, ethnic_racial: 0.05, religious: 0.15, class: 0.17, ideological: 0.07, gender: 0.06, political_tribe: 0.25 }, intensity: 2 },
  },
  {
    id: "053",
    name: "Consensus Builder",
    tier: "T1",
    nodes: {
      MAT: { kind: "continuous", pos: 3, sal: 2 },
      CD: { kind: "continuous", pos: 3, sal: 2 },
      CU: { kind: "continuous", pos: 3, sal: 2 },
      MOR: { kind: "continuous", pos: 3, sal: 2 },
      PRO: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      COM: { kind: "continuous", pos: 5, sal: 3, anti: "low" },
      ZS: { kind: "continuous", pos: 2, sal: 2 },
      ONT_H: { kind: "continuous", pos: 4, sal: 2 },
      ONT_S: { kind: "continuous", pos: 4, sal: 2 },
      PF: { kind: "continuous", pos: 3 },
      TRB: { kind: "continuous", pos: 2, anti: "high" },
      EPS: { kind: "categorical", probs: [0.25, 0.58, 0.05, 0.03, 0.06, 0.03], sal: 2, antiCats: [5] },
      AES: { kind: "categorical", probs: [0.60, 0.20, 0.04, 0.06, 0.04, 0.06], sal: 1, antiCats: [4] },
    },
    morBoundaries: { boundaries: { national: 0.05, ethnic_racial: 0.05, religious: 0.05, class: 0.05, ideological: 0.07, gender: 0.06, political_tribe: 0.5 }, intensity: 2 },
  },
  {
    id: "054",
    name: "Arbiter Moderate",
    tier: "T1",
    nodes: {
      MAT: { kind: "continuous", pos: 3, sal: 2 },
      CD: { kind: "continuous", pos: 3, sal: 2 },
      CU: { kind: "continuous", pos: 4, sal: 1 },
      MOR: { kind: "continuous", pos: 4, sal: 3, anti: "low" },
      PRO: { kind: "continuous", pos: 5, sal: 3, anti: "low" },
      COM: { kind: "continuous", pos: 4, sal: 3 }, // Fixed: Moderate = high compromise
      ZS: { kind: "continuous", pos: 1, sal: 2 },
      ONT_H: { kind: "continuous", pos: 5, sal: 3, anti: "low" },
      ONT_S: { kind: "continuous", pos: 4, sal: 2 },
      PF: { kind: "continuous", pos: 3 },
      TRB: { kind: "continuous", pos: 2, anti: "high" },
      EPS: { kind: "categorical", probs: [0.25, 0.58, 0.05, 0.03, 0.06, 0.03], sal: 2, antiCats: [5] },
      AES: { kind: "categorical", probs: [0.08, 0.64, 0.04, 0.04, 0.03, 0.17], sal: 2, antiCats: [4] },
    },
    morBoundaries: { boundaries: { national: 0.05, ethnic_racial: 0.05, religious: 0.05, class: 0.05, ideological: 0.07, gender: 0.06, political_tribe: 0.5 }, intensity: 3 },
  },
  {
    id: "056",
    name: "Institutional Leftist",
    tier: "T1",
    // Renamed 2026-04-26 from "Institutional Centrist". The previous name was
    // misleading — MAT=2 is far-left on the redistribution axis, not centrist.
    // The archetype represents an economically progressive (MAT=2),
    // culturally moderate-traditional (CD=4), institutionally trusting
    // (ONT_S=4), strongly anti-zero-sum, anti-tribal pluralist. The
    // distinguishing feature vs Pluralist Structuralist (005) is the more
    // conservative cultural register and the institutional-trust orientation.
    // CU lowered 2026-04-26 from 5 → 4 under broadened CU framing — still
    // strongly pluralist on private worldview/lifestyle but not maximally so.
    nodes: {
      MAT: { kind: "continuous", pos: 2, sal: 2 },
      CD: { kind: "continuous", pos: 4, sal: 2 },
      CU: { kind: "continuous", pos: 4, sal: 3, anti: "low" },
      MOR: { kind: "continuous", pos: 4, sal: 3 },
      PRO: { kind: "continuous", pos: 3, sal: 2, anti: "low" },
      COM: { kind: "continuous", pos: 4, sal: 2 },
      ZS: { kind: "continuous", pos: 2, sal: 3, anti: "high" },
      ONT_H: { kind: "continuous", pos: 4, sal: 2 },
      ONT_S: { kind: "continuous", pos: 4, sal: 3, anti: "low" },
      PF: { kind: "continuous", pos: 3 },
      TRB: { kind: "continuous", pos: 2, anti: "high" },
      EPS: { kind: "categorical", probs: [0.25, 0.58, 0.05, 0.03, 0.06, 0.03], sal: 2, antiCats: [5] },
      AES: { kind: "categorical", probs: [0.60, 0.20, 0.04, 0.06, 0.04, 0.06], sal: 1, antiCats: [4] },
    },
    morBoundaries: { boundaries: { national: 0.12, ethnic_racial: 0.05, religious: 0.12, class: 0.17, ideological: 0.07, gender: 0.06, political_tribe: 0.5 }, intensity: 3 },
  },
  {
    id: "057",
    name: "Temperate Pluralist",
    tier: "T1",
    nodes: {
      MAT: { kind: "continuous", pos: 3, sal: 1 },
      CD: { kind: "continuous", pos: 2, sal: 2 },
      CU: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      MOR: { kind: "continuous", pos: 4, sal: 2 },
      PRO: { kind: "continuous", pos: 4, sal: 2 },
      COM: { kind: "continuous", pos: 4, sal: 2 },
      ZS: { kind: "continuous", pos: 2, sal: 2 },
      ONT_H: { kind: "continuous", pos: 4, sal: 2 },
      ONT_S: { kind: "continuous", pos: 4, sal: 2 },
      PF: { kind: "continuous", pos: 3 },
      TRB: { kind: "continuous", pos: 2, anti: "high" },
      EPS: { kind: "categorical", probs: [0.25, 0.58, 0.05, 0.03, 0.06, 0.03], sal: 1, antiCats: [5] },
      AES: { kind: "categorical", probs: [0.60, 0.20, 0.04, 0.06, 0.04, 0.06], sal: 1, antiCats: [4] },
    },
    morBoundaries: { boundaries: { national: 0.05, ethnic_racial: 0.05, religious: 0.05, class: 0.05, ideological: 0.07, gender: 0.06, political_tribe: 0.5 }, intensity: 2 },
  },
  {
    id: "059",
    name: "Public-Minded Moderate",
    tier: "T1",
    centristAnchor: true,
    nodes: {
      MAT: { kind: "continuous", pos: 3, sal: 2 },
      CD: { kind: "continuous", pos: 3, sal: 1 },
      CU: { kind: "continuous", pos: 3, sal: 2 },
      MOR: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      PRO: { kind: "continuous", pos: 4, sal: 2 },
      COM: { kind: "continuous", pos: 4, sal: 2 },
      ZS: { kind: "continuous", pos: 2, sal: 2 },
      ONT_H: { kind: "continuous", pos: 2, sal: 1 },
      ONT_S: { kind: "continuous", pos: 4, sal: 1 },
      PF: { kind: "continuous", pos: 3 },
      TRB: { kind: "continuous", pos: 2, anti: "high" },
      EPS: { kind: "categorical", probs: [0.25, 0.58, 0.05, 0.03, 0.06, 0.03], sal: 1, antiCats: [5] },
      AES: { kind: "categorical", probs: [0.60, 0.20, 0.04, 0.06, 0.04, 0.06], sal: 1, antiCats: [4] },
    },
    morBoundaries: { boundaries: { national: 0.05, ethnic_racial: 0.05, religious: 0.05, class: 0.05, ideological: 0.07, gender: 0.06, political_tribe: 0.5 }, intensity: 2 },
  },
  {
    id: "060",
    name: "Hinge Citizen",
    tier: "T1",
    centristAnchor: true,
    // CU 2→3 (2026-04-26 broadened CU framing): true swing centrist; mid CU
    // matches mid everything else.
    nodes: {
      MAT: { kind: "continuous", pos: 3, sal: 2 },
      CD: { kind: "continuous", pos: 3, sal: 1 },
      CU: { kind: "continuous", pos: 3, sal: 2 },
      MOR: { kind: "continuous", pos: 3, sal: 2 },
      PRO: { kind: "continuous", pos: 4, sal: 2 },
      COM: { kind: "continuous", pos: 3, sal: 2 },
      ZS: { kind: "continuous", pos: 2, sal: 2 },
      ONT_H: { kind: "continuous", pos: 4, sal: 2 },
      ONT_S: { kind: "continuous", pos: 2, sal: 2 },
      PF: { kind: "continuous", pos: 4 },
      TRB: { kind: "continuous", pos: 2 },
      EPS: { kind: "categorical", probs: [0.14, 0.38, 0.33, 0.04, 0.07, 0.04], sal: 1 },
      AES: { kind: "categorical", probs: [0.60, 0.20, 0.04, 0.06, 0.04, 0.06], sal: 1 },
    
    },
    morBoundaries: { boundaries: { national: 0.11, ethnic_racial: 0.05, religious: 0.05, class: 0.05, ideological: 0.15, gender: 0.06, political_tribe: 0.75 }, intensity: 2.25 },
  },
  {
    id: "061",
    name: "Millian Liberal",
    tier: "T1",
    nodes: {
      MAT: { kind: "continuous", pos: 5, sal: 2 },
      CD: { kind: "continuous", pos: 2, sal: 2 },
      CU: { kind: "continuous", pos: 4, sal: 3, anti: "low" },
      MOR: { kind: "continuous", pos: 4, sal: 2 },
      PRO: { kind: "continuous", pos: 2, sal: 2 },
      COM: { kind: "continuous", pos: 3, sal: 3, anti: "low" },
      ZS: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      ONT_H: { kind: "continuous", pos: 5, sal: 3, anti: "low" },
      ONT_S: { kind: "continuous", pos: 4, sal: 2 },
      PF: { kind: "continuous", pos: 3 },
      TRB: { kind: "continuous", pos: 2, anti: "high" },
      EPS: { kind: "categorical", probs: [0.08, 0.08, 0.08, 0.10, 0.60, 0.06], sal: 1, antiCats: [2, 5] },
      AES: { kind: "categorical", probs: [0.08, 0.64, 0.04, 0.04, 0.03, 0.17], sal: 1, antiCats: [4] },
    },
    morBoundaries: { boundaries: { national: 0.05, ethnic_racial: 0.05, religious: 0.05, class: 0.05, ideological: 0.07, gender: 0.06, political_tribe: 0.5 }, intensity: 2 },
  },
  {
    id: "062",
    name: "Meritocratic Liberal",
    tier: "T1",
    nodes: {
      MAT: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      CD: { kind: "continuous", pos: 2, sal: 1 },
      CU: { kind: "continuous", pos: 3, sal: 1 },
      MOR: { kind: "continuous", pos: 3, sal: 1 },
      PRO: { kind: "continuous", pos: 5, sal: 3, anti: "low" },
      COM: { kind: "continuous", pos: 4, sal: 1 },
      ZS: { kind: "continuous", pos: 2, sal: 2 },
      ONT_H: { kind: "continuous", pos: 4, sal: 1, anti: "low" },
      ONT_S: { kind: "continuous", pos: 4, sal: 1 },
      PF: { kind: "continuous", pos: 3 },
      TRB: { kind: "continuous", pos: 2, anti: "high" },
      EPS: { kind: "categorical", probs: [0.62, 0.24, 0.03, 0.04, 0.03, 0.04], sal: 1, antiCats: [2, 3, 5] },
      AES: { kind: "categorical", probs: [0.08, 0.64, 0.04, 0.04, 0.03, 0.17], sal: 1, antiCats: [4] },
    },
    morBoundaries: { boundaries: { national: 0.05, ethnic_racial: 0.05, religious: 0.05, class: 0.05, ideological: 0.07, gender: 0.06, political_tribe: 0.5 }, intensity: 1.5 },
  },
  {
    id: "063",
    name: "Enterprise Pluralist",
    tier: "T1",
    nodes: {
      MAT: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      CD: { kind: "continuous", pos: 3, sal: 1 },
      CU: { kind: "continuous", pos: 3, sal: 2 },
      MOR: { kind: "continuous", pos: 4, sal: 1 },
      PRO: { kind: "continuous", pos: 3, sal: 1 },
      COM: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      ZS: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      ONT_H: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      ONT_S: { kind: "continuous", pos: 4, sal: 1 },
      PF: { kind: "continuous", pos: 3 },
      TRB: { kind: "continuous", pos: 2, anti: "high" },
      EPS: { kind: "categorical", probs: [0.62, 0.14, 0.03, 0.04, 0.15, 0.02], sal: 1, antiCats: [2, 3, 5] },
      AES: { kind: "categorical", probs: [0.06, 0.18, 0.05, 0.06, 0.08, 0.57], sal: 1 },
    },
    morBoundaries: { boundaries: { national: 0.05, ethnic_racial: 0.05, religious: 0.05, class: 0.05, ideological: 0.07, gender: 0.06, political_tribe: 0.5 }, intensity: 1.5 },
  },
  // MERGED into Opportunity Liberal (ID 065) — 2026-04-01
  // {
  //   id: "064",
  //   name: "Market Optimist",
  //   tier: "T1",
  //   prior: 1/112,
  //   nodes: {
  //     MAT: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
  //     CD: { kind: "continuous", pos: 2, sal: 2 },
  //     CU: { kind: "continuous", pos: 4, sal: 2 },
  //     MOR: { kind: "continuous", pos: 2, sal: 2 },
  //     PRO: { kind: "continuous", pos: 3, sal: 2 },
  //     COM: { kind: "continuous", pos: 4, sal: 2 },
  //     ZS: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
  //     ONT_H: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
  //     ONT_S: { kind: "continuous", pos: 4, sal: 2 },
  //     PF: { kind: "continuous", pos: 3 },
  //     TRB: { kind: "continuous", pos: 2, anti: "high" },
  //     ENG: { kind: "continuous", pos: 5, anti: "low" },
  //     EPS: { kind: "categorical", probs: [0.62, 0.14, 0.03, 0.04, 0.15, 0.02], sal: 1, antiCats: [2, 3, 5] },
  //     AES: { kind: "categorical", probs: [0.06, 0.18, 0.05, 0.06, 0.08, 0.57], sal: 1 },
  //   }
  // },
  {
    id: "065",
    name: "Opportunity Liberal",
    // Archetype-audit Phase 6 PRO sweep (2026-04-27). PRO 1→3: rubric
    // distinguishes "outcome-focused / bureaucracy-skeptical" (PRO 3) from
    // "outright rule-breaking" (PRO 1). Opportunity Liberals work within
    // institutions to expand opportunity; not anti-procedural in the
    // Trump-2020 / Lenin sense. Anti direction also dropped (was anti:high).
    tier: "T1",
    nodes: {
      MAT: { kind: "continuous", pos: 3, sal: 3, anti: "low" },
      CD: { kind: "continuous", pos: 2, sal: 2 },
      CU: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      MOR: { kind: "continuous", pos: 5, sal: 2 },
      PRO: { kind: "continuous", pos: 3, sal: 3 },                // 1→3 audit Phase 6: outcome-focused, not anti-procedural
      COM: { kind: "continuous", pos: 3, sal: 2 },
      ZS: { kind: "continuous", pos: 1, sal: 3, anti: "high" },
      ONT_H: { kind: "continuous", pos: 5, sal: 3, anti: "low" },
      ONT_S: { kind: "continuous", pos: 4, sal: 2 },
      PF: { kind: "continuous", pos: 3 },
      TRB: { kind: "continuous", pos: 2, anti: "high" },
      EPS: { kind: "categorical", probs: [0.62, 0.24, 0.03, 0.04, 0.03, 0.04], sal: 1, antiCats: [2, 3, 5] },
      AES: { kind: "categorical", probs: [0.06, 0.18, 0.05, 0.06, 0.08, 0.57], sal: 1 },
    },
    morBoundaries: { boundaries: { national: 0.05, ethnic_racial: 0.05, religious: 0.05, class: 0.05, ideological: 0.07, gender: 0.06, political_tribe: 0.5 }, intensity: 2 },
  },
  {
    id: "067",
    name: "Free-Exchange Modernist",
    // Archetype-audit Phase 6 PRO sweep (2026-04-27). PRO 1→3: market-
    // libertarianism is bureaucracy-skeptical, not anti-procedural; free-
    // traders work within rule-of-law / WTO / contract-enforcement frames
    // to liberalize, not break them.
    tier: "T1",
    nodes: {
      MAT: { kind: "continuous", pos: 5, sal: 3, anti: "low" },
      CD: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      CU: { kind: "continuous", pos: 5, sal: 3, anti: "low" },
      MOR: { kind: "continuous", pos: 4, sal: 2 },
      PRO: { kind: "continuous", pos: 3, sal: 3 },                // 1→3 audit Phase 6: bureaucracy-skeptical, not anti-procedural
      COM: { kind: "continuous", pos: 3, sal: 2 },
      ZS: { kind: "continuous", pos: 1, sal: 3, anti: "high" },
      ONT_H: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      ONT_S: { kind: "continuous", pos: 5, sal: 2 },
      PF: { kind: "continuous", pos: 3 },
      TRB: { kind: "continuous", pos: 2, anti: "high" },
      EPS: { kind: "categorical", probs: [0.62, 0.14, 0.03, 0.04, 0.15, 0.02], sal: 1, antiCats: [2, 3, 5] },
      AES: { kind: "categorical", probs: [0.06, 0.18, 0.05, 0.06, 0.08, 0.57], sal: 1 },
    },
    morBoundaries: { boundaries: { national: 0.05, ethnic_racial: 0.05, religious: 0.05, class: 0.05, ideological: 0.11, gender: 0.06, political_tribe: 0.5 }, intensity: 2 },
  },
  {
    id: "069",
    name: "Bleeding-Heart Libertarian",
    tier: "T1",
    nodes: {
      MAT: { kind: "continuous", pos: 4, sal: 2, anti: "low" },
      CD: { kind: "continuous", pos: 2, sal: 2 },
      CU: { kind: "continuous", pos: 4, sal: 2, anti: "low" },
      MOR: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      PRO: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      COM: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      ZS: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      ONT_H: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      ONT_S: { kind: "continuous", pos: 4, sal: 2 },
      PF: { kind: "continuous", pos: 3 },
      TRB: { kind: "continuous", pos: 2, anti: "high" },
      EPS: { kind: "categorical", probs: [0.62, 0.14, 0.03, 0.08, 0.11, 0.02], sal: 1, antiCats: [2, 3, 5] },
      AES: { kind: "categorical", probs: [0.05, 0.05, 0.08, 0.70, 0.05, 0.07], sal: 1 },
    },
    morBoundaries: { boundaries: { national: 0.05, ethnic_racial: 0.05, religious: 0.05, class: 0.05, ideological: 0.12, gender: 0.06, political_tribe: 0.5 }, intensity: 2 },
  },
  {
    id: "070",
    name: "Burkean Steward",
    tier: "T1",
    // ONT_H 3 → 4, ONT_S 3 → 4 per ADR-010 (2026-04-26): Burkean tradition
    // explicitly believes humans are cultivated by family/church/custom (high
    // malleability via cultural mechanism) AND that lawful institutions are
    // foundational to ordered liberty (high institutional capacity belief).
    // Old encoding read these as 3/3 under "moderate optimism / mixed system"
    // — wrong axis under the new framings.
    nodes: {
      // CU 2→3 (2026-04-26 broadened CU framing): Burkean tradition values
      // shared civic/cultural cohesion but tolerates private pluralism;
      // anti="high" retained.
      MAT: { kind: "continuous", pos: 4, sal: 2, anti: "low" },
      CD: { kind: "continuous", pos: 4, sal: 2 },
      CU: { kind: "continuous", pos: 3, sal: 2, anti: "high" },
      MOR: { kind: "continuous", pos: 2, sal: 3 },
      PRO: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      COM: { kind: "continuous", pos: 3, sal: 1 },
      ZS: { kind: "continuous", pos: 3, sal: 1, anti: "low" },
      ONT_H: { kind: "continuous", pos: 4, sal: 2, anti: "low" },
      ONT_S: { kind: "continuous", pos: 4, sal: 2 },
      PF: { kind: "continuous", pos: 4 },
      TRB: { kind: "continuous", pos: 2 },
      EPS: { kind: "categorical", probs: [0.10, 0.58, 0.15, 0.05, 0.06, 0.06], sal: 2, antiCats: [5] },
      AES: { kind: "categorical", probs: [0.60, 0.10, 0.14, 0.06, 0.04, 0.06], sal: 2, antiCats: [4] },
    },
    morBoundaries: { boundaries: { national: 0.28, ethnic_racial: 0.05, religious: 0.12, class: 0.05, ideological: 0.15, gender: 0.06, political_tribe: 0.75 }, intensity: 3 },
  },
  {
    id: "071",
    name: "Constitutional Conservative",
    tier: "T1",
    // ONT_H 3 → 4, ONT_S 2 → 3 per ADR-010 (2026-04-26): constitutional
    // conservatism centers on lawful institutions and written tradition shaping
    // behavior — high malleability via constitutional/legal cultivation. Light
    // institutional capacity belief (constitutional structure works, but state
    // overreach bad).
    nodes: {
      MAT: { kind: "continuous", pos: 4, sal: 2 },
      CD: { kind: "continuous", pos: 5, sal: 2 },
      CU: { kind: "continuous", pos: 1, sal: 2 },
      MOR: { kind: "continuous", pos: 2, sal: 2 },
      PRO: { kind: "continuous", pos: 5, sal: 2 },
      COM: { kind: "continuous", pos: 2, sal: 2 },
      ZS: { kind: "continuous", pos: 4, sal: 2 },
      ONT_H: { kind: "continuous", pos: 4, sal: 1 },
      ONT_S: { kind: "continuous", pos: 3, sal: 1 },
      PF: { kind: "continuous", pos: 4 },
      TRB: { kind: "continuous", pos: 2 },
      EPS: { kind: "categorical", probs: [0.10, 0.58, 0.15, 0.05, 0.06, 0.06], sal: 2 },
      AES: { kind: "categorical", probs: [0.60, 0.10, 0.14, 0.06, 0.04, 0.06], sal: 2 },
    
    },
    morBoundaries: { boundaries: { national: 0.29, ethnic_racial: 0.24, religious: 0.17, class: 0.05, ideological: 0.15, gender: 0.06, political_tribe: 0.75 }, intensity: 2.25 },
  },
  {
    id: "072",
    name: "Blackstone Conservative",
    tier: "T1",
    // ONT_H 3 → 4, ONT_S 2 → 3 per ADR-010 (2026-04-26): common-law
    // traditionalist; institutions (especially law) transmit and shape character.
    // MOR 5→3 archetype-audit Phase 4 (2026-04-26): Pattern B inverse —
    // common-law conservatism is hierarchical / English-tradition-oriented.
    // Natural-law universalism is rhetorical; practiced moral scope is
    // narrower (Christian-English-tradition in-group). MOR=5 read traditional
    // moral content as wide spatial scope; rubric requires spatial scope only.
    nodes: {
      MAT: { kind: "continuous", pos: 4, sal: 2, anti: "low" },
      CD: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      CU: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      MOR: { kind: "continuous", pos: 3, sal: 2 },                  // 5→3 audit Phase 4: practiced scope is narrower than rhetorical universalism (also dropped anti:low)
      PRO: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      COM: { kind: "continuous", pos: 3, sal: 1 },
      ZS: { kind: "continuous", pos: 3, sal: 1 },
      ONT_H: { kind: "continuous", pos: 4, sal: 1 },
      ONT_S: { kind: "continuous", pos: 3, sal: 1 },
      PF: { kind: "continuous", pos: 3 },
      TRB: { kind: "continuous", pos: 2 },
      EPS: { kind: "categorical", probs: [0.10, 0.58, 0.15, 0.05, 0.06, 0.06], sal: 2, antiCats: [5] },
      AES: { kind: "categorical", probs: [0.60, 0.10, 0.14, 0.06, 0.04, 0.06], sal: 1, antiCats: [4] },
    },
    morBoundaries: { boundaries: { national: 0.22, ethnic_racial: 0.2, religious: 0.17, class: 0.05, ideological: 0.07, gender: 0.06, political_tribe: 0.5 }, intensity: 2 },
  },
  {
    id: "073",
    name: "Civic Traditionalist",
    tier: "T1",
    // ONT_H 3 → 4, ONT_S 3 → 4 per ADR-010 (2026-04-26): civic traditionalists
    // champion civic participation within inherited institutional frameworks —
    // high cultivation by civic duty + high faith in functioning institutions.
    nodes: {
      MAT: { kind: "continuous", pos: 4, sal: 2 },
      CD: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      CU: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      MOR: { kind: "continuous", pos: 4, sal: 1 },
      PRO: { kind: "continuous", pos: 3, sal: 2, anti: "low" },
      COM: { kind: "continuous", pos: 4, sal: 1 },
      ZS: { kind: "continuous", pos: 3, sal: 1 },
      ONT_H: { kind: "continuous", pos: 4, sal: 1 },
      ONT_S: { kind: "continuous", pos: 4, sal: 1 },
      PF: { kind: "continuous", pos: 4 },
      TRB: { kind: "continuous", pos: 2 },
      EPS: { kind: "categorical", probs: [0.10, 0.58, 0.15, 0.05, 0.06, 0.06], sal: 1, antiCats: [5] },
      AES: { kind: "categorical", probs: [0.60, 0.10, 0.14, 0.06, 0.04, 0.06], sal: 1, antiCats: [4] },
    },
    morBoundaries: { boundaries: { national: 0.25, ethnic_racial: 0.11, religious: 0.17, class: 0.05, ideological: 0.15, gender: 0.06, political_tribe: 0.75 }, intensity: 2.25 },
  },
  {
    id: "074",
    name: "Responsible Conservative",
    tier: "T1",
    nodes: {
      MAT: { kind: "continuous", pos: 3, sal: 2 },
      CD: { kind: "continuous", pos: 4, sal: 2, anti: "low" },
      CU: { kind: "continuous", pos: 2, sal: 2, anti: "high" },
      MOR: { kind: "continuous", pos: 4, sal: 2 },
      PRO: { kind: "continuous", pos: 4, sal: 2, anti: "low" },
      COM: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      ZS: { kind: "continuous", pos: 3, sal: 2 },
      ONT_H: { kind: "continuous", pos: 3, sal: 1 },
      ONT_S: { kind: "continuous", pos: 3, sal: 1 },
      PF: { kind: "continuous", pos: 4, anti: "high" },
      TRB: { kind: "continuous", pos: 2, anti: "high" },
      EPS: { kind: "categorical", probs: [0.10, 0.58, 0.15, 0.05, 0.06, 0.06], sal: 1, antiCats: [5] },
      AES: { kind: "categorical", probs: [0.60, 0.10, 0.14, 0.06, 0.04, 0.06], sal: 1, antiCats: [4] },
    },
    morBoundaries: { boundaries: { national: 0.25, ethnic_racial: 0.05, religious: 0.17, class: 0.05, ideological: 0.15, gender: 0.06, political_tribe: 0.75 }, intensity: 2.25 },
  },
  {
    id: "076",
    name: "Fiscal Gradualist",
    tier: "T1",
    nodes: {
      MAT: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      CD: { kind: "continuous", pos: 2, sal: 2 },
      CU: { kind: "continuous", pos: 3, sal: 1 },
      MOR: { kind: "continuous", pos: 2, sal: 2 },
      PRO: { kind: "continuous", pos: 3, sal: 2 },
      COM: { kind: "continuous", pos: 4, sal: 2, anti: "low" },
      ZS: { kind: "continuous", pos: 4, sal: 2 },
      ONT_H: { kind: "continuous", pos: 3, sal: 1 },
      ONT_S: { kind: "continuous", pos: 3, sal: 1 },
      PF: { kind: "continuous", pos: 4, anti: "high" },
      TRB: { kind: "continuous", pos: 2, anti: "high" },
      EPS: { kind: "categorical", probs: [0.10, 0.58, 0.15, 0.05, 0.06, 0.06], sal: 1, antiCats: [5] },
      AES: { kind: "categorical", probs: [0.60, 0.10, 0.14, 0.06, 0.04, 0.06], sal: 1, antiCats: [4] },
    },
    morBoundaries: { boundaries: { national: 0.18, ethnic_racial: 0.05, religious: 0.05, class: 0.05, ideological: 0.15, gender: 0.06, political_tribe: 0.75 }, intensity: 2.25 },
  },
  {
    id: "077",
    name: "Ordered Libertarian",
    tier: "T1",
    nodes: {
      MAT: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      CD: { kind: "continuous", pos: 4, sal: 1 },
      CU: { kind: "continuous", pos: 4, sal: 1 },
      MOR: { kind: "continuous", pos: 2, sal: 1 },
      PRO: { kind: "continuous", pos: 3, sal: 2 },
      COM: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      ZS: { kind: "continuous", pos: 2, sal: 1 },
      ONT_H: { kind: "continuous", pos: 3, sal: 1 },
      ONT_S: { kind: "continuous", pos: 3, sal: 1 },
      PF: { kind: "continuous", pos: 4 },
      TRB: { kind: "continuous", pos: 2 },
      EPS: { kind: "categorical", probs: [0.10, 0.58, 0.15, 0.05, 0.06, 0.06], sal: 1, antiCats: [5] },
      AES: { kind: "categorical", probs: [0.60, 0.10, 0.14, 0.06, 0.04, 0.06], sal: 1, antiCats: [4] },
    },
    morBoundaries: { boundaries: { national: 0.28, ethnic_racial: 0.05, religious: 0.12, class: 0.05, ideological: 0.19, gender: 0.06, political_tribe: 0.75 }, intensity: 2.25 },
  },
  {
    id: "078",
    name: "Meritocratic Conservative",
    tier: "T1",
    nodes: {
      MAT: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      CD: { kind: "continuous", pos: 4, sal: 1 },
      CU: { kind: "continuous", pos: 4, sal: 1 },
      MOR: { kind: "continuous", pos: 2, sal: 1 },
      PRO: { kind: "continuous", pos: 4, sal: 1 },
      COM: { kind: "continuous", pos: 3, sal: 1 },
      ZS: { kind: "continuous", pos: 3, sal: 2 },
      ONT_H: { kind: "continuous", pos: 4, sal: 2 },
      ONT_S: { kind: "continuous", pos: 3, sal: 2 },
      PF: { kind: "continuous", pos: 4 },
      TRB: { kind: "continuous", pos: 2, anti: "high" },
      EPS: { kind: "categorical", probs: [0.10, 0.58, 0.15, 0.05, 0.06, 0.06], sal: 1, antiCats: [5] },
      AES: { kind: "categorical", probs: [0.60, 0.10, 0.14, 0.06, 0.04, 0.06], sal: 1, antiCats: [4] },
    },
    morBoundaries: { boundaries: { national: 0.28, ethnic_racial: 0.05, religious: 0.12, class: 0.05, ideological: 0.15, gender: 0.06, political_tribe: 0.75 }, intensity: 2.25 },
  },
  {
    id: "079",
    name: "National Developmentalist",
    tier: "T1",
    // CU 2→3 (2026-04-26 broadened CU framing): nationalist but
    // development-focused; state-led growth, not cultural uniformity.
    // ONT_S 1→5 archetype-audit Phase 4 (2026-04-26, PROMOTED HIGH).
    // "Developmentalist" means institutional capacity belief — Hamilton, Lee
    // Kuan Yew, post-war Japan/South Korea state-developmentalism. ONT_S=1
    // reads developmentalists as institutional nihilists, opposite of the
    // name. As direct as Hamiltonian Technocrat.
    nodes: {
      MAT: { kind: "continuous", pos: 4, sal: 2 },
      CD: { kind: "continuous", pos: 4, sal: 1 },
      CU: { kind: "continuous", pos: 3, sal: 1 },
      MOR: { kind: "continuous", pos: 2, sal: 2 },
      PRO: { kind: "continuous", pos: 4, sal: 2 },
      COM: { kind: "continuous", pos: 4, sal: 1 },
      ZS: { kind: "continuous", pos: 4, sal: 2 },
      ONT_H: { kind: "continuous", pos: 2, sal: 1 },
      ONT_S: { kind: "continuous", pos: 5, sal: 2 },             // 1→5 audit Phase 4: developmentalist = institutional capacity belief
      PF: { kind: "continuous", pos: 4 },
      TRB: { kind: "continuous", pos: 3 },
      EPS: { kind: "categorical", probs: [0.10, 0.58, 0.15, 0.05, 0.06, 0.06], sal: 1 },
      AES: { kind: "categorical", probs: [0.60, 0.10, 0.09, 0.06, 0.09, 0.06], sal: 1 },
    
    },
    morBoundaries: { boundaries: { national: 0.5, ethnic_racial: 0.05, religious: 0.19, class: 0.05, ideological: 0.24, gender: 0.07, political_tribe: 0.75 }, intensity: 2.25 },
  },
  // MERGED: 080 Chestertonian Traditionalist → absorbed into 091 Security Paternalist (no Î”â‰¥2 discriminators)
  // {
  //   id: "080",
  //   name: "Chestertonian Traditionalist",
  //   ...
  // },
  {
    id: "081",
    name: "Heritage Guardian",
    tier: "T1",
    // ONT_H 2 → 4, ONT_S 1 → 2 per ADR-010 (2026-04-26): heritage preservation
    // IS belief in cultural transmission (high malleability via tradition).
    // Anti-state institutionalist preserved (anti:"high" on ONT_S, only raised
    // to 2 from 1).
    nodes: {
      MAT: { kind: "continuous", pos: 4, sal: 1 },
      CD: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      CU: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      MOR: { kind: "continuous", pos: 2, sal: 2 },
      PRO: { kind: "continuous", pos: 3, sal: 1 },
      COM: { kind: "continuous", pos: 2, sal: 1 },
      ZS: { kind: "continuous", pos: 4, sal: 1 },
      ONT_H: { kind: "continuous", pos: 4, sal: 1 },
      ONT_S: { kind: "continuous", pos: 2, sal: 2, anti: "high" },
      PF: { kind: "continuous", pos: 4 },
      TRB: { kind: "continuous", pos: 5, anti: "low" },
      EPS: { kind: "categorical", probs: [0.04, 0.18, 0.60, 0.06, 0.08, 0.04], sal: 2, antiCats: [0, 5] },
      AES: { kind: "categorical", probs: [0.16, 0.05, 0.62, 0.07, 0.03, 0.07], sal: 1 },
    },
    morBoundaries: { boundaries: { national: 1, ethnic_racial: 0.81, religious: 0.91, class: 0.05, ideological: 0.43, gender: 0.1, political_tribe: 0.75 }, intensity: 3 },
  },
  {
    id: "082",
    name: "Altar-and-Hearth Conservative",
    tier: "T1",
    // ONT_H 2 → 4, ONT_S 2 → 3 per ADR-010 (2026-04-26): family/religion/
    // tradition ARE cultivation mechanisms; humans malleable via them. Mid
    // institutional capacity (church/family yes, state skeptical).
    nodes: {
      MAT: { kind: "continuous", pos: 3, sal: 1 },
      CD: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      CU: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      MOR: { kind: "continuous", pos: 3, sal: 2 },
      PRO: { kind: "continuous", pos: 2, sal: 2 },
      COM: { kind: "continuous", pos: 2, sal: 2 },
      ZS: { kind: "continuous", pos: 3, sal: 1 },
      ONT_H: { kind: "continuous", pos: 4, sal: 1 },
      ONT_S: { kind: "continuous", pos: 3, sal: 1 },
      PF: { kind: "continuous", pos: 4 },
      TRB: { kind: "continuous", pos: 3 },
      EPS: { kind: "categorical", probs: [0.04, 0.18, 0.60, 0.06, 0.08, 0.04], sal: 2, antiCats: [0, 5] },
      AES: { kind: "categorical", probs: [0.16, 0.05, 0.62, 0.07, 0.03, 0.07], sal: 1 },
    },
    morBoundaries: { boundaries: { national: 0.5, ethnic_racial: 0.36, religious: 0.48, class: 0.05, ideological: 0.24, gender: 0.07, political_tribe: 0.75 }, intensity: 2.25 },
  },
  {
    id: "083",
    name: "Closed Traditionalist",
    tier: "T1",
    // ONT_H 2 → 4 per ADR-010 (2026-04-26): closed traditionalists believe in
    // cultivation via tradition/family/religion. ONT_S held at 2 — they reject
    // modern state institutions while valuing inherited ones.
    // MOR 4→2 archetype-audit Phase 4 (2026-04-26): a "Closed Traditionalist"
    // with high MOR is incoherent — closure implies narrow practiced scope
    // (in-group focus). Old MOR=4 read traditional moral content as wide
    // spatial scope; rubric requires spatial scope only.
    nodes: {
      MAT: { kind: "continuous", pos: 3, sal: 1 },
      CD: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      CU: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      MOR: { kind: "continuous", pos: 2, sal: 2 },                  // 4→2 audit Phase 4: closure = narrow practiced scope
      PRO: { kind: "continuous", pos: 3, sal: 1 },
      COM: { kind: "continuous", pos: 2, sal: 1 },
      ZS: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      ONT_H: { kind: "continuous", pos: 4, sal: 1 },
      ONT_S: { kind: "continuous", pos: 2, sal: 1 },
      PF: { kind: "continuous", pos: 4 },
      TRB: { kind: "continuous", pos: 3 },
      EPS: { kind: "categorical", probs: [0.04, 0.18, 0.60, 0.06, 0.08, 0.04], sal: 2, antiCats: [0, 5] },
      AES: { kind: "categorical", probs: [0.16, 0.05, 0.62, 0.07, 0.03, 0.07], sal: 1 },
    },
    morBoundaries: { boundaries: { national: 0.53, ethnic_racial: 0.43, religious: 0.48, class: 0.05, ideological: 0.24, gender: 0.07, political_tribe: 0.75 }, intensity: 2.25 },
  },
  {
    id: "084",
    name: "Civilizational Conservative",
    tier: "T1",
    // ONT_H 2 → 3 per ADR-010 (2026-04-26): civilizational conservatives
    // believe modern humans are degenerating — modest malleability via tradition
    // but institutional nihilism preserved (ONT_S kept at 1, anti:"high").
    nodes: {
      MAT: { kind: "continuous", pos: 3, sal: 1 },
      CD: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      CU: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      MOR: { kind: "continuous", pos: 3, sal: 2 },
      PRO: { kind: "continuous", pos: 3, sal: 1 },
      COM: { kind: "continuous", pos: 2, sal: 1 },
      ZS: { kind: "continuous", pos: 3, sal: 1 },
      ONT_H: { kind: "continuous", pos: 3, sal: 1 },
      ONT_S: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      PF: { kind: "continuous", pos: 4 },
      TRB: { kind: "continuous", pos: 5, anti: "low" },
      EPS: { kind: "categorical", probs: [0.04, 0.18, 0.60, 0.06, 0.08, 0.04], sal: 2, antiCats: [0, 5] },
      AES: { kind: "categorical", probs: [0.04, 0.03, 0.04, 0.18, 0.63, 0.08], sal: 1, antiCats: [0, 1] },
    },
    morBoundaries: { boundaries: { national: 0.95, ethnic_racial: 0.67, religious: 0.91, class: 0.05, ideological: 0.43, gender: 0.1, political_tribe: 0.75 }, intensity: 3 },
  },
  {
    id: "085",
    name: "Customary Localist",
    tier: "T1",
    // ONT_H 3 → 4, ONT_S 2 → 3 per ADR-010 (2026-04-26): customary localists
    // believe local custom shapes and improves people (high malleability via
    // tradition); local institutions trusted more than state but still real.
    nodes: {
      MAT: { kind: "continuous", pos: 4, sal: 2 },
      CD: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      CU: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      MOR: { kind: "continuous", pos: 2, sal: 2 },
      PRO: { kind: "continuous", pos: 2, sal: 2 },
      COM: { kind: "continuous", pos: 2, sal: 2 },
      ZS: { kind: "continuous", pos: 3, sal: 1 },
      ONT_H: { kind: "continuous", pos: 4, sal: 1 },
      ONT_S: { kind: "continuous", pos: 3, sal: 2 },
      PF: { kind: "continuous", pos: 4 },
      TRB: { kind: "continuous", pos: 2 },
      EPS: { kind: "categorical", probs: [0.04, 0.18, 0.60, 0.06, 0.08, 0.04], sal: 1, antiCats: [0, 5] },
      AES: { kind: "categorical", probs: [0.16, 0.05, 0.62, 0.07, 0.03, 0.07], sal: 2 },
    },
    morBoundaries: { boundaries: { national: 0.29, ethnic_racial: 0.24, religious: 0.26, class: 0.05, ideological: 0.15, gender: 0.06, political_tribe: 0.75 }, intensity: 2.25 },
  },
  {
    id: "086",
    name: "Duty Traditionalist",
    tier: "T1",
    // ONT_H 2 → 4, ONT_S 2 → 3 per ADR-010 (2026-04-26): duty-based traditionalism
    // explicitly emphasizes character cultivation through obligation and role —
    // high malleability via tradition + institutional structure.
    nodes: {
      // CU 2→3 (2026-04-26 broadened CU framing): duty-bound communitarian
      // but not uniformity-enforcing.
      MAT: { kind: "continuous", pos: 3, sal: 1 },
      CD: { kind: "continuous", pos: 4, sal: 1 },
      CU: { kind: "continuous", pos: 3, sal: 2 },
      MOR: { kind: "continuous", pos: 3, sal: 2 },
      PRO: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      COM: { kind: "continuous", pos: 2, sal: 1 },
      ZS: { kind: "continuous", pos: 3, sal: 1 },
      ONT_H: { kind: "continuous", pos: 4, sal: 1 },
      ONT_S: { kind: "continuous", pos: 3, sal: 1 },
      PF: { kind: "continuous", pos: 4 },
      TRB: { kind: "continuous", pos: 3 },
      EPS: { kind: "categorical", probs: [0.04, 0.18, 0.60, 0.06, 0.08, 0.04], sal: 2, antiCats: [0, 5] },
      AES: { kind: "categorical", probs: [0.16, 0.05, 0.62, 0.07, 0.03, 0.07], sal: 1 },
    },
    morBoundaries: { boundaries: { national: 0.36, ethnic_racial: 0.05, religious: 0.38, class: 0.05, ideological: 0.24, gender: 0.07, political_tribe: 0.75 }, intensity: 2.25 },
  },
  {
    id: "087",
    name: "Continuity Conservative",
    tier: "T1",
    // ONT_H 3 → 4, ONT_S 2 → 3 per ADR-010 (2026-04-26): continuity conservatism
    // prioritizes institutional continuity and cultural transmission as
    // improvement mechanisms.
    nodes: {
      MAT: { kind: "continuous", pos: 3, sal: 2 },
      CD: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      CU: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      MOR: { kind: "continuous", pos: 2, sal: 2 },
      PRO: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      COM: { kind: "continuous", pos: 3, sal: 1 },
      ZS: { kind: "continuous", pos: 3, sal: 1 },
      ONT_H: { kind: "continuous", pos: 4, sal: 2 },
      ONT_S: { kind: "continuous", pos: 3, sal: 2 },
      PF: { kind: "continuous", pos: 4 },
      TRB: { kind: "continuous", pos: 3 },
      EPS: { kind: "categorical", probs: [0.04, 0.18, 0.60, 0.06, 0.08, 0.04], sal: 1, antiCats: [0, 5] },
      AES: { kind: "categorical", probs: [0.16, 0.05, 0.62, 0.07, 0.03, 0.07], sal: 1 },
    },
    morBoundaries: { boundaries: { national: 0.53, ethnic_racial: 0.43, religious: 0.48, class: 0.05, ideological: 0.24, gender: 0.07, political_tribe: 0.75 }, intensity: 2.25 },
  },
  {
    id: "088",
    name: "Gentle Traditionalist",
    tier: "T1",
    // ONT_S 2 → 3 per ADR-010 (2026-04-26): already correctly high on ONT_H
    // (tradition shapes people). Mild upward shift on ONT_S — they trust
    // inherited institutions even if skeptical of modern state expansion.
    // anti:"high" preserved.
    // CU 2→3 (2026-04-26 broadened CU framing): soft conservatism; shared
    // customs preferred but not enforced uniformity. anti="high" retained.
    nodes: {
      MAT: { kind: "continuous", pos: 3, sal: 2 },
      CD: { kind: "continuous", pos: 4, sal: 2, anti: "low" },
      CU: { kind: "continuous", pos: 3, sal: 2, anti: "high" },
      MOR: { kind: "continuous", pos: 2, sal: 2 },
      PRO: { kind: "continuous", pos: 3, sal: 2 },
      COM: { kind: "continuous", pos: 4, sal: 2, anti: "low" },
      ZS: { kind: "continuous", pos: 3, sal: 2 },
      ONT_H: { kind: "continuous", pos: 4, sal: 1 },
      ONT_S: { kind: "continuous", pos: 3, sal: 2, anti: "high" },
      PF: { kind: "continuous", pos: 4 },
      TRB: { kind: "continuous", pos: 2 },
      EPS: { kind: "categorical", probs: [0.04, 0.18, 0.60, 0.06, 0.08, 0.04], sal: 1, antiCats: [0, 5] },
      AES: { kind: "categorical", probs: [0.16, 0.05, 0.62, 0.07, 0.03, 0.07], sal: 2 },
    },
    morBoundaries: { boundaries: { national: 0.28, ethnic_racial: 0.05, religious: 0.22, class: 0.05, ideological: 0.15, gender: 0.06, political_tribe: 0.75 }, intensity: 2.25 },
  },
  {
    id: "089",
    name: "Integral Traditionalist",
    tier: "T1",
    // ONT_H 2 → 4, ONT_S 2 → 3 per ADR-010 (2026-04-26): integral traditionalism
    // blends institutional and cultural transmission — humans cultivated by
    // sacred order and inherited institutions.
    nodes: {
      // CU 2→3 (2026-04-26 broadened CU framing): holistic conservative;
      // organic community coherence, not assimilationist policy.
      MAT: { kind: "continuous", pos: 4, sal: 1 },
      CD: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      CU: { kind: "continuous", pos: 3, sal: 2 },
      MOR: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      PRO: { kind: "continuous", pos: 3, sal: 1 },
      COM: { kind: "continuous", pos: 2, sal: 1 },
      ZS: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      ONT_H: { kind: "continuous", pos: 4, sal: 1 },
      ONT_S: { kind: "continuous", pos: 3, sal: 1 },
      PF: { kind: "continuous", pos: 4 },
      TRB: { kind: "continuous", pos: 3 },
      EPS: { kind: "categorical", probs: [0.04, 0.18, 0.60, 0.06, 0.08, 0.04], sal: 3, antiCats: [0, 5] },
      AES: { kind: "categorical", probs: [0.60, 0.10, 0.14, 0.06, 0.04, 0.06], sal: 1, antiCats: [4] },
    },
    morBoundaries: { boundaries: { national: 0.5, ethnic_racial: 0.36, religious: 0.38, class: 0.05, ideological: 0.24, gender: 0.12, political_tribe: 0.75 }, intensity: 2.25 },
  },
  {
    id: "090",
    name: "Hobbesian Guardian",
    tier: "T1",
    nodes: {
      MAT: { kind: "continuous", pos: 4, sal: 2 },
      CD: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      CU: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      MOR: { kind: "continuous", pos: 1, sal: 3, anti: "high" },
      PRO: { kind: "continuous", pos: 4, sal: 2 },
      COM: { kind: "continuous", pos: 2, sal: 2 },
      ZS: { kind: "continuous", pos: 5, sal: 3 }, // Hobbesian: life is zero-sum, strong differentiator
      ONT_H: { kind: "continuous", pos: 1, sal: 3, anti: "high" }, // Hobbesian: humans are NOT perfectible
      ONT_S: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      PF: { kind: "continuous", pos: 4 },
      TRB: { kind: "continuous", pos: 3 },
      EPS: { kind: "categorical", probs: [0.10, 0.58, 0.15, 0.05, 0.06, 0.06], sal: 1, antiCats: [5] },
      AES: { kind: "categorical", probs: [0.60, 0.10, 0.04, 0.06, 0.14, 0.06], sal: 1, antiCats: [4] },
    },
    morBoundaries: { boundaries: { national: 0.53, ethnic_racial: 0.53, religious: 0.29, class: 0.05, ideological: 0.24, gender: 0.12, political_tribe: 0.75 }, intensity: 3 },
  },
  {
    id: "091",
    name: "Security Paternalist",
    tier: "T1",
    nodes: {
      MAT: { kind: "continuous", pos: 3, sal: 1 },
      CD: { kind: "continuous", pos: 4, sal: 1 },
      CU: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      MOR: { kind: "continuous", pos: 3, sal: 1 },
      PRO: { kind: "continuous", pos: 4, sal: 1 },
      COM: { kind: "continuous", pos: 3, sal: 1 },
      ZS: { kind: "continuous", pos: 4, sal: 2, anti: "low" },
      ONT_H: { kind: "continuous", pos: 3, sal: 1 },
      ONT_S: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      PF: { kind: "continuous", pos: 4 },
      TRB: { kind: "continuous", pos: 3 },
      EPS: { kind: "categorical", probs: [0.10, 0.58, 0.15, 0.05, 0.06, 0.06], sal: 1, antiCats: [5] },
      AES: { kind: "categorical", probs: [0.60, 0.10, 0.04, 0.06, 0.14, 0.06], sal: 1, antiCats: [4] },
    },
    morBoundaries: { boundaries: { national: 0.5, ethnic_racial: 0.19, religious: 0.29, class: 0.05, ideological: 0.24, gender: 0.07, political_tribe: 0.75 }, intensity: 2.25 },
  },
  {
    id: "092",
    name: "Partisan Tribalist",
    tier: "T1",
    nodes: {
      MAT: { kind: "continuous", pos: 3, sal: 1 },
      CD: { kind: "continuous", pos: 4, sal: 1 },
      CU: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      MOR: { kind: "continuous", pos: 2, sal: 1 },
      PRO: { kind: "continuous", pos: 4, sal: 1 },
      COM: { kind: "continuous", pos: 2, sal: 1 },
      ZS: { kind: "continuous", pos: 4, sal: 1 },
      ONT_H: { kind: "continuous", pos: 2, sal: 1 },
      ONT_S: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      PF: { kind: "continuous", pos: 5, anti: "low" },
      TRB: { kind: "continuous", pos: 5, anti: "low" },
      EPS: { kind: "categorical", probs: [0.10, 0.58, 0.15, 0.05, 0.06, 0.06], sal: 1, antiCats: [5] },
      AES: { kind: "categorical", probs: [0.60, 0.10, 0.04, 0.06, 0.14, 0.06], sal: 1, antiCats: [4] },
    },
    morBoundaries: { boundaries: { national: 1, ethnic_racial: 0.48, religious: 0.53, class: 0.05, ideological: 0.43, gender: 0.1, political_tribe: 1 }, intensity: 3 },
  },
  {
    id: "094",
    name: "Hard-State Manager",
    // Archetype-audit Phase 4 (2026-04-26). ONT_S 1→4. Pattern A archetype-
    // side: name explicitly asserts state-institutional capacity ("Hard-
    // State"); old ONT_S=1 anti:high flipped this to institutional nihilism,
    // contradicting the name. PRO=5 (max-rules-bound) is consistent with
    // managerial authoritarianism but is incoherent with ONT_S=1. Anti
    // direction also flipped: anti:high → anti:low (now antagonistic to
    // institutional nihilism, not capacity belief).
    tier: "T1",
    nodes: {
      MAT: { kind: "continuous", pos: 3, sal: 2 },
      CD: { kind: "continuous", pos: 4, sal: 2 },
      CU: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      MOR: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      PRO: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      COM: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      ZS: { kind: "continuous", pos: 4, sal: 2 },
      ONT_H: { kind: "continuous", pos: 2, sal: 1 },
      ONT_S: { kind: "continuous", pos: 4, sal: 2, anti: "low" },  // 1→4 audit Phase 4: name says state-institutional, must match
      PF: { kind: "continuous", pos: 4 },
      TRB: { kind: "continuous", pos: 3 },
      EPS: { kind: "categorical", probs: [0.10, 0.58, 0.15, 0.05, 0.06, 0.06], sal: 1, antiCats: [5] },
      AES: { kind: "categorical", probs: [0.08, 0.64, 0.04, 0.04, 0.03, 0.17], sal: 1, antiCats: [4] },
    },
    morBoundaries: { boundaries: { national: 0.53, ethnic_racial: 0.41, religious: 0.29, class: 0.05, ideological: 0.34, gender: 0.07, political_tribe: 0.75 }, intensity: 2.25 },
  },
  {
    id: "095",
    name: "Emergency Orderist",
    tier: "T1",
    nodes: {
      MAT: { kind: "continuous", pos: 3, sal: 1 },
      CD: { kind: "continuous", pos: 4, sal: 1 },
      CU: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      MOR: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      PRO: { kind: "continuous", pos: 3, sal: 1 },
      COM: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      ZS: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      ONT_H: { kind: "continuous", pos: 2, sal: 1 },
      ONT_S: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      PF: { kind: "continuous", pos: 4 },
      TRB: { kind: "continuous", pos: 3 },
      EPS: { kind: "categorical", probs: [0.10, 0.58, 0.15, 0.05, 0.06, 0.06], sal: 1, antiCats: [5] },
      AES: { kind: "categorical", probs: [0.60, 0.10, 0.04, 0.06, 0.14, 0.06], sal: 1, antiCats: [4] },
    },
    morBoundaries: { boundaries: { national: 0.53, ethnic_racial: 0.41, religious: 0.29, class: 0.05, ideological: 0.34, gender: 0.07, political_tribe: 0.75 }, intensity: 2.25 },
  },
  {
    id: "097",
    name: "Authority Pragmatist",
    tier: "T1",
    nodes: {
      MAT: { kind: "continuous", pos: 4, sal: 1 },
      CD: { kind: "continuous", pos: 4, sal: 1 },
      CU: { kind: "continuous", pos: 1, sal: 2 },
      MOR: { kind: "continuous", pos: 1, sal: 2 },
      PRO: { kind: "continuous", pos: 4, sal: 1 },
      COM: { kind: "continuous", pos: 4, sal: 1 },
      ZS: { kind: "continuous", pos: 4, sal: 2 },
      ONT_H: { kind: "continuous", pos: 3, sal: 1 },
      ONT_S: { kind: "continuous", pos: 1, sal: 2 },
      PF: { kind: "continuous", pos: 4 },
      TRB: { kind: "continuous", pos: 3 },
      EPS: { kind: "categorical", probs: [0.10, 0.58, 0.15, 0.05, 0.06, 0.06], sal: 1 },
      AES: { kind: "categorical", probs: [0.60, 0.10, 0.04, 0.06, 0.14, 0.06], sal: 1 },
    
    },
    morBoundaries: { boundaries: { national: 0.53, ethnic_racial: 0.41, religious: 0.29, class: 0.05, ideological: 0.24, gender: 0.07, political_tribe: 0.75 }, intensity: 2.25 },
  },
  {
    id: "098",
    name: "Anti-Elite Populist",
    tier: "T1",
    nodes: {
      MAT: { kind: "continuous", pos: 3, sal: 1 },
      CD: { kind: "continuous", pos: 4, sal: 1 },
      CU: { kind: "continuous", pos: 1, sal: 2 },
      MOR: { kind: "continuous", pos: 2, sal: 2 },
      PRO: { kind: "continuous", pos: 1, sal: 2 },
      COM: { kind: "continuous", pos: 2, sal: 2 },
      ZS: { kind: "continuous", pos: 5, sal: 2 },
      ONT_H: { kind: "continuous", pos: 2, sal: 1 },
      ONT_S: { kind: "continuous", pos: 1, sal: 2 },
      PF: { kind: "continuous", pos: 2 },
      TRB: { kind: "continuous", pos: 2 },
      EPS: { kind: "categorical", probs: [0.05, 0.05, 0.08, 0.58, 0.19, 0.05], sal: 1 },
      AES: { kind: "categorical", probs: [0.05, 0.05, 0.08, 0.60, 0.15, 0.07], sal: 2 },
    
    },
    morBoundaries: { boundaries: { national: 0.29, ethnic_racial: 0.16, religious: 0.17, class: 0.05, ideological: 0.07, gender: 0.06, political_tribe: 0.25 }, intensity: 2 },
  },
  {
    id: "099",
    name: "Scarcity Populist",
    tier: "T1",
    nodes: {
      MAT: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      CD: { kind: "continuous", pos: 4, sal: 2 },
      CU: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      MOR: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      PRO: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      COM: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      ZS: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      ONT_H: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      ONT_S: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      PF: { kind: "continuous", pos: 3 },
      TRB: { kind: "continuous", pos: 3 },
      EPS: { kind: "categorical", probs: [0.05, 0.05, 0.08, 0.58, 0.19, 0.05], sal: 1, antiCats: [0, 5] },
      AES: { kind: "categorical", probs: [0.04, 0.03, 0.04, 0.18, 0.63, 0.08], sal: 1, antiCats: [0, 1] },
    },
    morBoundaries: { boundaries: { national: 0.53, ethnic_racial: 0.41, religious: 0.29, class: 0.38, ideological: 0.19, gender: 0.07, political_tribe: 0.5 }, intensity: 2 },
  },
  {
    id: "100",
    name: "Tribal Insurgent",
    tier: "T1",
    nodes: {
      MAT: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      CD: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      CU: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      MOR: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      PRO: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      COM: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      ZS: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      ONT_H: { kind: "continuous", pos: 2, sal: 1 },
      ONT_S: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      PF: { kind: "continuous", pos: 5, anti: "low" },
      TRB: { kind: "continuous", pos: 5, anti: "low" },
      EPS: { kind: "categorical", probs: [0.05, 0.05, 0.08, 0.58, 0.19, 0.05], sal: 1, antiCats: [0, 5] },
      AES: { kind: "categorical", probs: [0.04, 0.03, 0.04, 0.18, 0.63, 0.08], sal: 2, antiCats: [0, 1] },
    },
    morBoundaries: { boundaries: { national: 1, ethnic_racial: 1, religious: 0.53, class: 0.72, ideological: 0.76, gender: 0.19, political_tribe: 1 }, intensity: 3 },
  },
  {
    id: "101",
    name: "Embattled Majoritarian",
    tier: "T1",
    nodes: {
      MAT: { kind: "continuous", pos: 3, sal: 1 },
      CD: { kind: "continuous", pos: 4, sal: 2 },
      CU: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      MOR: { kind: "continuous", pos: 2, sal: 2 },
      PRO: { kind: "continuous", pos: 2, sal: 1 },
      COM: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      ZS: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      ONT_H: { kind: "continuous", pos: 2, sal: 1 },
      ONT_S: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      PF: { kind: "continuous", pos: 5, anti: "low" },
      TRB: { kind: "continuous", pos: 3 },
      EPS: { kind: "categorical", probs: [0.05, 0.05, 0.08, 0.58, 0.19, 0.05], sal: 1, antiCats: [0, 5] },
      AES: { kind: "categorical", probs: [0.05, 0.05, 0.08, 0.60, 0.15, 0.07], sal: 2 },
    },
    morBoundaries: { boundaries: { national: 0.53, ethnic_racial: 0.26, religious: 0.29, class: 0.05, ideological: 0.34, gender: 0.07, political_tribe: 1 }, intensity: 3 },
  },
  {
    id: "103",
    name: "Grievance Mobilizer",
    tier: "T1",
    nodes: {
      MAT: { kind: "continuous", pos: 2, sal: 1 },
      CD: { kind: "continuous", pos: 4, sal: 1 },
      CU: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      MOR: { kind: "continuous", pos: 2, sal: 1 },
      PRO: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      COM: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      ZS: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      ONT_H: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      ONT_S: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      PF: { kind: "continuous", pos: 4 },
      TRB: { kind: "continuous", pos: 4 },
      EPS: { kind: "categorical", probs: [0.05, 0.05, 0.08, 0.58, 0.19, 0.05], sal: 1, antiCats: [0, 5] },
      AES: { kind: "categorical", probs: [0.05, 0.05, 0.08, 0.60, 0.15, 0.07], sal: 2 },
    },
    morBoundaries: { boundaries: { national: 0.76, ethnic_racial: 0.37, religious: 0.41, class: 0.41, ideological: 0.48, gender: 0.09, political_tribe: 0.75 }, intensity: 2.25 },
  },
  {
    id: "104",
    name: "National Protector",
    tier: "T1",
    nodes: {
      MAT: { kind: "continuous", pos: 3, sal: 1 },
      CD: { kind: "continuous", pos: 4, sal: 2 },
      CU: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      MOR: { kind: "continuous", pos: 3, sal: 2 },
      PRO: { kind: "continuous", pos: 3, sal: 1 },
      COM: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      ZS: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      ONT_H: { kind: "continuous", pos: 3, sal: 1 },
      ONT_S: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      PF: { kind: "continuous", pos: 5, anti: "low" },
      TRB: { kind: "continuous", pos: 4 },
      EPS: { kind: "categorical", probs: [0.05, 0.05, 0.08, 0.58, 0.19, 0.05], sal: 1, antiCats: [0, 5] },
      AES: { kind: "categorical", probs: [0.04, 0.03, 0.04, 0.18, 0.63, 0.08], sal: 1, antiCats: [0, 1] },
    },
    morBoundaries: { boundaries: { national: 0.73, ethnic_racial: 0.26, religious: 0.41, class: 0.05, ideological: 0.48, gender: 0.09, political_tribe: 1 }, intensity: 3 },
  },
  {
    id: "105",
    name: "Combative Populist",
    tier: "T1",
    nodes: {
      MAT: { kind: "continuous", pos: 3, sal: 1 },
      CD: { kind: "continuous", pos: 4, sal: 1 },
      CU: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      MOR: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      PRO: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      COM: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      ZS: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      ONT_H: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      ONT_S: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      PF: { kind: "continuous", pos: 4 },
      TRB: { kind: "continuous", pos: 5, anti: "low" },
      EPS: { kind: "categorical", probs: [0.05, 0.05, 0.08, 0.58, 0.19, 0.05], sal: 1, antiCats: [0, 5] },
      AES: { kind: "categorical", probs: [0.04, 0.03, 0.04, 0.18, 0.63, 0.08], sal: 3, antiCats: [0, 1] },
    },
    morBoundaries: { boundaries: { national: 1, ethnic_racial: 0.76, religious: 0.53, class: 0.05, ideological: 0.62, gender: 0.1, political_tribe: 0.75 }, intensity: 3 },
  },
  {
    id: "106",
    name: "Militant Partisan",
    tier: "T1",
    nodes: {
      MAT: { kind: "continuous", pos: 3, sal: 1 },
      CD: { kind: "continuous", pos: 4, sal: 1 },
      CU: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      MOR: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      PRO: { kind: "continuous", pos: 2, sal: 2 },
      COM: { kind: "continuous", pos: 2, sal: 2 },
      ZS: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      ONT_H: { kind: "continuous", pos: 2, sal: 1 },
      ONT_S: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      PF: { kind: "continuous", pos: 5, anti: "low" },
      TRB: { kind: "continuous", pos: 4 },
      EPS: { kind: "categorical", probs: [0.05, 0.05, 0.08, 0.58, 0.19, 0.05], sal: 1, antiCats: [0, 5] },
      AES: { kind: "categorical", probs: [0.04, 0.03, 0.04, 0.18, 0.63, 0.08], sal: 3, antiCats: [0, 1] },
    },
    morBoundaries: { boundaries: { national: 0.76, ethnic_racial: 0.58, religious: 0.41, class: 0.05, ideological: 0.34, gender: 0.09, political_tribe: 1 }, intensity: 3 },
  },
  {
    id: "107",
    name: "Resentful Localist",
    tier: "T1",
    // CU 2→3 (2026-04-26 broadened CU framing): aggrieved localist; resentment
    // is anti-pluralist impulse but not uniformity-enforcing.
    nodes: {
      MAT: { kind: "continuous", pos: 3, sal: 2 },
      CD: { kind: "continuous", pos: 4, sal: 2 },
      CU: { kind: "continuous", pos: 3, sal: 2 },
      MOR: { kind: "continuous", pos: 2, sal: 2 },
      PRO: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      COM: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      ZS: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      ONT_H: { kind: "continuous", pos: 2, sal: 2 },
      ONT_S: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      PF: { kind: "continuous", pos: 2, anti: "high" },
      TRB: { kind: "continuous", pos: 2 },
      EPS: { kind: "categorical", probs: [0.05, 0.05, 0.08, 0.58, 0.19, 0.05], sal: 1, antiCats: [0, 5] },
      AES: { kind: "categorical", probs: [0.05, 0.05, 0.08, 0.60, 0.15, 0.07], sal: 1 },
    },
    morBoundaries: { boundaries: { national: 0.22, ethnic_racial: 0.05, religious: 0.12, class: 0.05, ideological: 0.12, gender: 0.06, political_tribe: 0.25 }, intensity: 2 },
  },
  {
    id: "108",
    name: "Passive Cynic",
    tier: "T1",
    nodes: {
      MAT: { kind: "continuous", pos: 3, sal: 0 },
      CD: { kind: "continuous", pos: 3, sal: 0 },
      CU: { kind: "continuous", pos: 3, sal: 0 },
      MOR: { kind: "continuous", pos: 2, sal: 1, anti: "high" },
      PRO: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      COM: { kind: "continuous", pos: 3, sal: 0 },
      ZS: { kind: "continuous", pos: 4, sal: 2 },
      ONT_H: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      ONT_S: { kind: "continuous", pos: 1, sal: 3, anti: "high" },
      PF: { kind: "continuous", pos: 1, anti: "high" },
      TRB: { kind: "continuous", pos: 1, anti: "high" },
      EPS: { kind: "categorical", probs: [0.05, 0.05, 0.05, 0.10, 0.15, 0.60], sal: 2, antiCats: [1] },
      AES: { kind: "categorical", probs: [0.05, 0.05, 0.10, 0.55, 0.20, 0.05], sal: 1 },
    },
    morBoundaries: { boundaries: { national: 0.05, ethnic_racial: 0.05, religious: 0.05, class: 0.05, ideological: 0.05, gender: 0.05, political_tribe: 0 }, intensity: 1 },
  },
  {
    id: "109",
    name: "Alienated Outsider",
    tier: "T1",
    nodes: {
      MAT: { kind: "continuous", pos: 3, sal: 1 },
      CD: { kind: "continuous", pos: 3, sal: 1 },
      CU: { kind: "continuous", pos: 3, sal: 1 },
      MOR: { kind: "continuous", pos: 4, sal: 2 },
      PRO: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      COM: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      ZS: { kind: "continuous", pos: 4, sal: 2, anti: "low" },
      ONT_H: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      ONT_S: { kind: "continuous", pos: 2, sal: 2 },
      PF: { kind: "continuous", pos: 2 },
      TRB: { kind: "continuous", pos: 3, anti: "high" },
      EPS: { kind: "categorical", probs: [0.08, 0.08, 0.08, 0.10, 0.60, 0.06], sal: 2, antiCats: [2, 5] },
      AES: { kind: "categorical", probs: [0.05, 0.05, 0.18, 0.60, 0.05, 0.07], sal: 1 },
    },
    morBoundaries: { boundaries: { national: 0.05, ethnic_racial: 0.05, religious: 0.05, class: 0.05, ideological: 0.19, gender: 0.07, political_tribe: 0.25 }, intensity: 2 },
  },
  {
    id: "110",
    name: "Principled Abstainer",
    tier: "T1",
    nodes: {
      MAT: { kind: "continuous", pos: 3, sal: 1 },
      CD: { kind: "continuous", pos: 3, sal: 1 },
      CU: { kind: "continuous", pos: 4, sal: 2 },
      MOR: { kind: "continuous", pos: 5, sal: 3, anti: "low" },
      PRO: { kind: "continuous", pos: 1, sal: 3, anti: "high" },
      COM: { kind: "continuous", pos: 1, sal: 1 },
      ZS: { kind: "continuous", pos: 4, sal: 2 },
      ONT_H: { kind: "continuous", pos: 4, sal: 2 },
      ONT_S: { kind: "continuous", pos: 3, sal: 1, anti: "high" },
      PF: { kind: "continuous", pos: 2, anti: "high" },
      TRB: { kind: "continuous", pos: 2, anti: "high" },
      EPS: { kind: "categorical", probs: [0.08, 0.08, 0.08, 0.20, 0.50, 0.06], sal: 2, antiCats: [2, 5] },
      AES: { kind: "categorical", probs: [0.05, 0.05, 0.18, 0.60, 0.05, 0.07], sal: 1 },
    },
    morBoundaries: { boundaries: { national: 0.05, ethnic_racial: 0.05, religious: 0.05, class: 0.05, ideological: 0.12, gender: 0.06, political_tribe: 0.25 }, intensity: 3 },
  },
  {
    id: "111",
    name: "Cosmopolitan Nonconformist",
    tier: "T1",
    nodes: {
      MAT: { kind: "continuous", pos: 3, sal: 0 },
      CD: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      CU: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      MOR: { kind: "continuous", pos: 4, sal: 1, anti: "low" },
      PRO: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      COM: { kind: "continuous", pos: 3, sal: 0 },
      ZS: { kind: "continuous", pos: 3, sal: 0 },
      ONT_H: { kind: "continuous", pos: 3, sal: 0 },
      ONT_S: { kind: "continuous", pos: 3, sal: 0 },
      PF: { kind: "continuous", pos: 3 },
      TRB: { kind: "continuous", pos: 2, anti: "high" },
      EPS: { kind: "categorical", probs: [0.08, 0.08, 0.08, 0.10, 0.60, 0.06], sal: 2, antiCats: [2, 5] },
      AES: { kind: "categorical", probs: [0.05, 0.05, 0.08, 0.70, 0.05, 0.07], sal: 2 },
    },
    morBoundaries: { boundaries: { national: 0.05, ethnic_racial: 0.05, religious: 0.05, class: 0.05, ideological: 0.07, gender: 0.06, political_tribe: 0.5 }, intensity: 1.5 },
  },
  {
    id: "112",
    name: "Engaged Cosmopolitan",
    tier: "T1",
    nodes: {
      MAT: { kind: "continuous", pos: 3, sal: 1 },
      CD: { kind: "continuous", pos: 2, sal: 1 },
      CU: { kind: "continuous", pos: 4, sal: 2 },
      MOR: { kind: "continuous", pos: 4, sal: 2 },
      PRO: { kind: "continuous", pos: 2, sal: 1, anti: "high" },
      COM: { kind: "continuous", pos: 3, sal: 1, anti: "high" },
      ZS: { kind: "continuous", pos: 3, sal: 1 },
      ONT_H: { kind: "continuous", pos: 4, sal: 2 },
      ONT_S: { kind: "continuous", pos: 3, sal: 1 },
      PF: { kind: "continuous", pos: 3 },
      TRB: { kind: "continuous", pos: 2, anti: "high" },
      EPS: { kind: "categorical", probs: [0.08, 0.08, 0.08, 0.10, 0.60, 0.06], sal: 1, antiCats: [2, 5] },
      AES: { kind: "categorical", probs: [0.05, 0.05, 0.08, 0.70, 0.05, 0.07], sal: 2 },
    },
    morBoundaries: { boundaries: { national: 0.05, ethnic_racial: 0.05, religious: 0.05, class: 0.05, ideological: 0.07, gender: 0.06, political_tribe: 0.5 }, intensity: 2 },
  },
  {
    id: "113",
    name: "Disaffected Contrarian",
    tier: "T1",
    // CU 2→3 (2026-04-26 broadened CU framing): populist outsider; oppositional
    // stance not assimilationist.
    nodes: {
      MAT: { kind: "continuous", pos: 3, sal: 1 },
      CD: { kind: "continuous", pos: 2, sal: 2 },
      CU: { kind: "continuous", pos: 3, sal: 1 },
      MOR: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      PRO: { kind: "continuous", pos: 1, sal: 3, anti: "high" },
      COM: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      ZS: { kind: "continuous", pos: 5, sal: 3, anti: "low" },
      ONT_H: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      ONT_S: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      PF: { kind: "continuous", pos: 2 },
      TRB: { kind: "continuous", pos: 2 },
      EPS: { kind: "categorical", probs: [0.05, 0.03, 0.07, 0.18, 0.12, 0.55], sal: 2, antiCats: [0, 1] },
      AES: { kind: "categorical", probs: [0.02, 0.02, 0.04, 0.10, 0.75, 0.07], sal: 2 },
    },
    morBoundaries: { boundaries: { national: 0.12, ethnic_racial: 0.12, religious: 0.05, class: 0.05, ideological: 0.12, gender: 0.06, political_tribe: 0.25 }, intensity: 2 },
  },
  {
    id: "114",
    name: "Political Nihilist",
    tier: "T1",
    nodes: {
      MAT: { kind: "continuous", pos: 3, sal: 0 },
      CD: { kind: "continuous", pos: 3, sal: 0 },
      CU: { kind: "continuous", pos: 3, sal: 0 },
      MOR: { kind: "continuous", pos: 1, sal: 3, anti: "high" },
      PRO: { kind: "continuous", pos: 1, sal: 3, anti: "high" },
      COM: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      ZS: { kind: "continuous", pos: 5, sal: 3, anti: "low" },
      ONT_H: { kind: "continuous", pos: 1, sal: 3, anti: "high" },
      ONT_S: { kind: "continuous", pos: 1, sal: 3, anti: "high" },
      PF: { kind: "continuous", pos: 1, anti: "high" },
      TRB: { kind: "continuous", pos: 1, anti: "high" },
      EPS: { kind: "categorical", probs: [0.03, 0.03, 0.03, 0.08, 0.10, 0.73], sal: 3, antiCats: [0, 1, 2] },
      AES: { kind: "categorical", probs: [0.02, 0.02, 0.03, 0.08, 0.70, 0.15], sal: 2 },
    },
    morBoundaries: { boundaries: { national: 0.05, ethnic_racial: 0.05, religious: 0.05, class: 0.05, ideological: 0.05, gender: 0.05, political_tribe: 0 }, intensity: 3 },
  },
  {
    id: "115",
    name: "Quietist",
    tier: "T1",
    nodes: {
      MAT: { kind: "continuous", pos: 3, sal: 1 },  // raised sal 0→1 (discriminator vs Ecological Localist)
      CD: { kind: "continuous", pos: 3, sal: 0 },
      CU: { kind: "continuous", pos: 3, sal: 0 },
      MOR: { kind: "continuous", pos: 2, sal: 2, anti: "high" },
      PRO: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      COM: { kind: "continuous", pos: 2, sal: 1 },
      ZS: { kind: "continuous", pos: 3, sal: 0, anti: "low" },
      ONT_H: { kind: "continuous", pos: 4, sal: 2 },
      ONT_S: { kind: "continuous", pos: 3, sal: 1 },  // raised sal 0→1 (discriminator vs Ecological Localist)
      PF: { kind: "continuous", pos: 3 },
      TRB: { kind: "continuous", pos: 2, anti: "high" },
      EPS: { kind: "categorical", probs: [0.04, 0.08, 0.60, 0.16, 0.08, 0.04], sal: 1, antiCats: [0, 5] },
      AES: { kind: "categorical", probs: [0.06, 0.05, 0.72, 0.07, 0.03, 0.07], sal: 1 },
    },
    morBoundaries: { boundaries: { national: 0.12, ethnic_racial: 0.05, religious: 0.15, class: 0.05, ideological: 0.07, gender: 0.06, political_tribe: 0.5 }, intensity: 2 },
  },
  {
    id: "116",
    name: "Quiet Middle",
    tier: "T1",
    centristAnchor: true,
    nodes: {
      MAT: { kind: "continuous", pos: 3, sal: 1 },
      CD: { kind: "continuous", pos: 3, sal: 1 },
      CU: { kind: "continuous", pos: 3, sal: 1 },
      MOR: { kind: "continuous", pos: 3, sal: 2 },
      PRO: { kind: "continuous", pos: 3, sal: 2 },
      COM: { kind: "continuous", pos: 3, sal: 2, anti: "low" },
      ZS: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      ONT_H: { kind: "continuous", pos: 2, sal: 2 },
      ONT_S: { kind: "continuous", pos: 4, sal: 2 },
      PF: { kind: "continuous", pos: 3, anti: "low" },
      TRB: { kind: "continuous", pos: 2, anti: "high" },
      EPS: { kind: "categorical", probs: [0.10, 0.58, 0.05, 0.03, 0.16, 0.08], sal: 1, antiCats: [5] },
      AES: { kind: "categorical", probs: [0.05, 0.05, 0.18, 0.60, 0.05, 0.07], sal: 1 },
    },
    morBoundaries: { boundaries: { national: 0.05, ethnic_racial: 0.05, religious: 0.05, class: 0.05, ideological: 0.07, gender: 0.06, political_tribe: 0.5 }, intensity: 2 },
  },
  {
    id: "117",
    name: "Comfortable Bystander",
    tier: "T1",
    nodes: {
      MAT: { kind: "continuous", pos: 3, sal: 1 },
      CD: { kind: "continuous", pos: 3, sal: 2 },
      CU: { kind: "continuous", pos: 3, sal: 1 },
      MOR: { kind: "continuous", pos: 1, sal: 1, anti: "high" },
      PRO: { kind: "continuous", pos: 4, sal: 2 },
      COM: { kind: "continuous", pos: 5, sal: 1 },
      ZS: { kind: "continuous", pos: 1, sal: 1, anti: "high" },
      ONT_H: { kind: "continuous", pos: 2, sal: 1, anti: "low" },
      ONT_S: { kind: "continuous", pos: 4, sal: 2 },
      PF: { kind: "continuous", pos: 3, anti: "low" },
      TRB: { kind: "continuous", pos: 2, anti: "high" },
      EPS: { kind: "categorical", probs: [0.04, 0.18, 0.60, 0.06, 0.08, 0.04], sal: 1, antiCats: [0, 5] },
      AES: { kind: "categorical", probs: [0.05, 0.05, 0.18, 0.60, 0.05, 0.07], sal: 1 },
    },
    morBoundaries: { boundaries: { national: 0.12, ethnic_racial: 0.12, religious: 0.15, class: 0.05, ideological: 0.07, gender: 0.06, political_tribe: 0.5 }, intensity: 1.5 },
  },
  {
    id: "118",
    name: "Survival Pragmatist",
    tier: "T1",
    nodes: {
      MAT: { kind: "continuous", pos: 2, sal: 2 },
      CD: { kind: "continuous", pos: 3, sal: 1 },
      CU: { kind: "continuous", pos: 3, sal: 1 },
      MOR: { kind: "continuous", pos: 3, sal: 1 },
      PRO: { kind: "continuous", pos: 3, sal: 1 },
      COM: { kind: "continuous", pos: 3, sal: 1 },
      ZS: { kind: "continuous", pos: 4, sal: 2 },
      ONT_H: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      ONT_S: { kind: "continuous", pos: 2, sal: 2 },
      PF: { kind: "continuous", pos: 3 },
      TRB: { kind: "continuous", pos: 2, anti: "high" },
      EPS: { kind: "categorical", probs: [0.10, 0.58, 0.05, 0.03, 0.16, 0.08], sal: 1, antiCats: [5] },
      AES: { kind: "categorical", probs: [0.05, 0.05, 0.18, 0.60, 0.05, 0.07], sal: 1 },
    },
    morBoundaries: { boundaries: { national: 0.05, ethnic_racial: 0.05, religious: 0.05, class: 0.17, ideological: 0.07, gender: 0.06, political_tribe: 0.5 }, intensity: 1.5 },
  },
  {
    id: "119",
    name: "Apolitical Striver",
    tier: "T1",
    nodes: {
      MAT: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      CD: { kind: "continuous", pos: 3, sal: 0 },
      CU: { kind: "continuous", pos: 3, sal: 0 },
      MOR: { kind: "continuous", pos: 3, sal: 0 },
      PRO: { kind: "continuous", pos: 2, sal: 1 },
      COM: { kind: "continuous", pos: 2, sal: 1 },
      ZS: { kind: "continuous", pos: 2, sal: 1 },
      ONT_H: { kind: "continuous", pos: 4, sal: 1 },
      ONT_S: { kind: "continuous", pos: 4, sal: 1 },
      PF: { kind: "continuous", pos: 3 },
      TRB: { kind: "continuous", pos: 2, anti: "high" },
      EPS: { kind: "categorical", probs: [0.10, 0.58, 0.05, 0.03, 0.16, 0.08], sal: 1, antiCats: [5] },
      AES: { kind: "categorical", probs: [0.05, 0.05, 0.18, 0.60, 0.05, 0.07], sal: 1 },
    },
    morBoundaries: { boundaries: { national: 0.05, ethnic_racial: 0.05, religious: 0.05, class: 0.05, ideological: 0.07, gender: 0.06, political_tribe: 0.5 }, intensity: 1.5 },
  },
  {
    id: "120",
    name: "Good Neighbor",
    tier: "T1",
    nodes: {
      MAT: { kind: "continuous", pos: 2, sal: 1 },
      CD: { kind: "continuous", pos: 4, sal: 2, anti: "low" },
      CU: { kind: "continuous", pos: 3, sal: 3 },
      MOR: { kind: "continuous", pos: 5, sal: 3, anti: "low" },
      PRO: { kind: "continuous", pos: 3, sal: 1 },
      COM: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      ZS: { kind: "continuous", pos: 2, sal: 2 },
      ONT_H: { kind: "continuous", pos: 3, sal: 2 },
      ONT_S: { kind: "continuous", pos: 4, sal: 3, anti: "low" },
      PF: { kind: "continuous", pos: 3 },
      TRB: { kind: "continuous", pos: 2, anti: "high" },
      EPS: { kind: "categorical", probs: [0.10, 0.58, 0.05, 0.03, 0.16, 0.08], sal: 1, antiCats: [5] },
      AES: { kind: "categorical", probs: [0.60, 0.10, 0.14, 0.06, 0.04, 0.06], sal: 2, antiCats: [4] },
    },
    morBoundaries: { boundaries: { national: 0.12, ethnic_racial: 0.05, religious: 0.12, class: 0.17, ideological: 0.07, gender: 0.06, political_tribe: 0.5 }, intensity: 3 },
  },
  {
    id: "121",
    name: "Spectator Citizen",
    tier: "T1",
    nodes: {
      MAT: { kind: "continuous", pos: 3, sal: 2 },
      CD: { kind: "continuous", pos: 3, sal: 2 },
      CU: { kind: "continuous", pos: 4, sal: 1 },
      MOR: { kind: "continuous", pos: 3, sal: 3 },
      PRO: { kind: "continuous", pos: 4, sal: 3 },
      COM: { kind: "continuous", pos: 3, sal: 2 },
      ZS: { kind: "continuous", pos: 2, sal: 1 },
      ONT_H: { kind: "continuous", pos: 4, sal: 1 },
      ONT_S: { kind: "continuous", pos: 4, sal: 2 },
      PF: { kind: "continuous", pos: 3 },
      TRB: { kind: "continuous", pos: 2, anti: "high" },
      EPS: { kind: "categorical", probs: [0.62, 0.24, 0.03, 0.04, 0.03, 0.04], sal: 1, antiCats: [2, 3, 5] },
      AES: { kind: "categorical", probs: [0.05, 0.05, 0.18, 0.60, 0.05, 0.07], sal: 1 },
    },
    morBoundaries: { boundaries: { national: 0.05, ethnic_racial: 0.05, religious: 0.05, class: 0.05, ideological: 0.07, gender: 0.06, political_tribe: 0.5 }, intensity: 3 },
  },
  {
    id: "122",
    name: "Civic Minimalist",
    tier: "T1",
    centristAnchor: true,
    nodes: {
      MAT: { kind: "continuous", pos: 3, sal: 0 },
      CD: { kind: "continuous", pos: 4, sal: 1 },
      CU: { kind: "continuous", pos: 3, sal: 0 },
      MOR: { kind: "continuous", pos: 4, sal: 1 },
      PRO: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      COM: { kind: "continuous", pos: 2, sal: 1 },
      ZS: { kind: "continuous", pos: 2, sal: 1 },
      ONT_H: { kind: "continuous", pos: 3, sal: 0 },
      ONT_S: { kind: "continuous", pos: 4, sal: 1 },
      PF: { kind: "continuous", pos: 3 },
      TRB: { kind: "continuous", pos: 2, anti: "high" },
      EPS: { kind: "categorical", probs: [0.10, 0.58, 0.05, 0.03, 0.16, 0.08], sal: 1, antiCats: [5] },
      AES: { kind: "categorical", probs: [0.05, 0.05, 0.18, 0.60, 0.05, 0.07], sal: 1 },
    },
    morBoundaries: { boundaries: { national: 0.12, ethnic_racial: 0.05, religious: 0.12, class: 0.05, ideological: 0.07, gender: 0.06, political_tribe: 0.5 }, intensity: 1.5 },
  },
  {
    id: "124",
    name: "Latent Alarmist",
    tier: "T1",
    nodes: {
      MAT: { kind: "continuous", pos: 3, sal: 0 },
      CD: { kind: "continuous", pos: 3, sal: 0 },
      CU: { kind: "continuous", pos: 3, sal: 0 },
      MOR: { kind: "continuous", pos: 3, sal: 0 },
      PRO: { kind: "continuous", pos: 2, sal: 1 },
      COM: { kind: "continuous", pos: 2, sal: 2 },
      ZS: { kind: "continuous", pos: 4, sal: 2 },
      ONT_H: { kind: "continuous", pos: 3, sal: 0 },
      ONT_S: { kind: "continuous", pos: 2, sal: 2 },
      PF: { kind: "continuous", pos: 4 },
      TRB: { kind: "continuous", pos: 2 },
      EPS: { kind: "categorical", probs: [0.10, 0.58, 0.05, 0.03, 0.16, 0.08], sal: 1 },
      AES: { kind: "categorical", probs: [0.05, 0.05, 0.18, 0.60, 0.05, 0.07], sal: 1 },
    
    },
    morBoundaries: { boundaries: { national: 0.11, ethnic_racial: 0.05, religious: 0.05, class: 0.05, ideological: 0.15, gender: 0.06, political_tribe: 0.75 }, intensity: 2.25 },
  },
  {
    id: "125",
    name: "Reluctant Partisan",
    tier: "T1",
    nodes: {
      MAT: { kind: "continuous", pos: 3, sal: 0 },
      CD: { kind: "continuous", pos: 3, sal: 0 },
      CU: { kind: "continuous", pos: 3, sal: 0, anti: "low" },
      MOR: { kind: "continuous", pos: 3, sal: 0, anti: "low" },
      PRO: { kind: "continuous", pos: 4, sal: 2, anti: "low" },
      COM: { kind: "continuous", pos: 4, sal: 2, anti: "low" },
      ZS: { kind: "continuous", pos: 3, sal: 1, anti: "low" },
      ONT_H: { kind: "continuous", pos: 3, sal: 0 },
      ONT_S: { kind: "continuous", pos: 2, sal: 2, anti: "high" },
      PF: { kind: "continuous", pos: 4, anti: "low" },
      TRB: { kind: "continuous", pos: 2, anti: "high" },
      EPS: { kind: "categorical", probs: [0.10, 0.58, 0.05, 0.03, 0.16, 0.08], sal: 1, antiCats: [5] },
      AES: { kind: "categorical", probs: [0.05, 0.05, 0.18, 0.60, 0.05, 0.07], sal: 1 },
    },
    morBoundaries: { boundaries: { national: 0.11, ethnic_racial: 0.05, religious: 0.05, class: 0.05, ideological: 0.15, gender: 0.06, political_tribe: 0.75 }, intensity: 2.25 },
  },
  {
    id: "126",
    name: "Uncompromising Activist",
    tier: "T1",
    nodes: {
      MAT: { kind: "continuous", pos: 3, sal: 0 },
      CD: { kind: "continuous", pos: 3, sal: 0 },
      CU: { kind: "continuous", pos: 3, sal: 0 },
      MOR: { kind: "continuous", pos: 4, sal: 1 },
      PRO: { kind: "continuous", pos: 2, sal: 1 },
      COM: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      ZS: { kind: "continuous", pos: 3, sal: 1 },
      ONT_H: { kind: "continuous", pos: 3, sal: 0 },
      ONT_S: { kind: "continuous", pos: 2, sal: 1 },
      PF: { kind: "continuous", pos: 3 },
      TRB: { kind: "continuous", pos: 3, anti: "low" },
      EPS: { kind: "categorical", probs: [0.10, 0.58, 0.05, 0.03, 0.16, 0.08], sal: 1, antiCats: [5] },
      AES: { kind: "categorical", probs: [0.05, 0.05, 0.18, 0.60, 0.05, 0.07], sal: 1 },
    },
    morBoundaries: { boundaries: { national: 0.05, ethnic_racial: 0.05, religious: 0.05, class: 0.05, ideological: 0.19, gender: 0.07, political_tribe: 0.5 }, intensity: 1.5 },
  },
  {
    id: "127",
    name: "Tribal Loyalist",
    tier: "T1",
    nodes: {
      MAT: { kind: "continuous", pos: 3, sal: 0 },
      CD: { kind: "continuous", pos: 4, sal: 1 },
      CU: { kind: "continuous", pos: 3, sal: 0 },
      MOR: { kind: "continuous", pos: 2, sal: 1 },
      PRO: { kind: "continuous", pos: 3, sal: 0 },
      COM: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      ZS: { kind: "continuous", pos: 3, sal: 1 },
      ONT_H: { kind: "continuous", pos: 3, sal: 0 },
      ONT_S: { kind: "continuous", pos: 2, sal: 1 },
      PF: { kind: "continuous", pos: 5, anti: "low" },
      TRB: { kind: "continuous", pos: 5, anti: "low" },
      EPS: { kind: "categorical", probs: [0.10, 0.58, 0.05, 0.03, 0.16, 0.08], sal: 1, antiCats: [5] },
      AES: { kind: "categorical", probs: [0.05, 0.05, 0.18, 0.60, 0.05, 0.07], sal: 1 },
    },
    morBoundaries: { boundaries: { national: 0.95, ethnic_racial: 0.05, religious: 0.34, class: 0.05, ideological: 0.62, gender: 0.1, political_tribe: 1 }, intensity: 3 },
  },
  {
    id: "128",
    name: "Loyal Democrat",
    tier: "T1",
    nodes: {
      MAT: { kind: "continuous", pos: 2, sal: 1 },
      CD: { kind: "continuous", pos: 3, sal: 0 },
      CU: { kind: "continuous", pos: 4, sal: 1 },
      MOR: { kind: "continuous", pos: 4, sal: 1 },
      PRO: { kind: "continuous", pos: 3, sal: 0 },
      COM: { kind: "continuous", pos: 2, sal: 1 },
      ZS: { kind: "continuous", pos: 3, sal: 1 },
      ONT_H: { kind: "continuous", pos: 3, sal: 0 },
      ONT_S: { kind: "continuous", pos: 2, sal: 1 },
      PF: { kind: "continuous", pos: 4 }, // Fixed: Loyal = high PF
      TRB: { kind: "continuous", pos: 4 },
      EPS: { kind: "categorical", probs: [0.10, 0.58, 0.05, 0.03, 0.16, 0.08], sal: 1, antiCats: [5] },
      AES: { kind: "categorical", probs: [0.05, 0.05, 0.18, 0.60, 0.05, 0.07], sal: 1 },
    },
    morBoundaries: { boundaries: { national: 0.16, ethnic_racial: 0.05, religious: 0.05, class: 0.41, ideological: 0.34, gender: 0.09, political_tribe: 0.75 }, intensity: 2.25 },
  },
  {
    id: "129",
    name: "Loyal Republican",
    tier: "T1",
    // CU 2→3 (2026-04-26 broadened CU framing): partisan Republican moderate;
    // civic-bound partisan, not uniformity-minded.
    nodes: {
      MAT: { kind: "continuous", pos: 4, sal: 1 },
      CD: { kind: "continuous", pos: 4, sal: 1 },
      CU: { kind: "continuous", pos: 3, sal: 1 },
      MOR: { kind: "continuous", pos: 2, sal: 1 },
      PRO: { kind: "continuous", pos: 3, sal: 0 },
      COM: { kind: "continuous", pos: 2, sal: 1 },
      ZS: { kind: "continuous", pos: 3, sal: 1 },
      ONT_H: { kind: "continuous", pos: 3, sal: 0 },
      ONT_S: { kind: "continuous", pos: 2, sal: 1 },
      PF: { kind: "continuous", pos: 5, anti: "low" },
      TRB: { kind: "continuous", pos: 4 },
      EPS: { kind: "categorical", probs: [0.10, 0.58, 0.05, 0.03, 0.16, 0.08], sal: 1, antiCats: [5] },
      AES: { kind: "categorical", probs: [0.05, 0.05, 0.18, 0.60, 0.05, 0.07], sal: 1 },
    },
    morBoundaries: { boundaries: { national: 0.73, ethnic_racial: 0.05, religious: 0.26, class: 0.05, ideological: 0.34, gender: 0.09, political_tribe: 1 }, intensity: 3 },
  },
  // MERGED into Duty Voter (ID 131) — 2026-04-01
  // {
  //   id: "130",
  //   name: "Habitual Partisan",
  //   tier: "T1",
  //   prior: 1/112,
  //   nodes: {
  //     MAT: { kind: "continuous", pos: 3, sal: 1 },
  //     CD: { kind: "continuous", pos: 4, sal: 1 },
  //     CU: { kind: "continuous", pos: 3, sal: 0 },
  //     MOR: { kind: "continuous", pos: 2, sal: 1 },
  //     PRO: { kind: "continuous", pos: 3, sal: 0 },
  //     COM: { kind: "continuous", pos: 2, sal: 1 },
  //     ZS: { kind: "continuous", pos: 3, sal: 1 },
  //     ONT_H: { kind: "continuous", pos: 3, sal: 0 },
  //     ONT_S: { kind: "continuous", pos: 2, sal: 1 },
  //     PF: { kind: "continuous", pos: 5, anti: "low" },
  //     TRB: { kind: "continuous", pos: 4 },
  //     ENG: { kind: "continuous", pos: 3, anti: "high" },
  //     EPS: { kind: "categorical", probs: [0.04, 0.18, 0.60, 0.06, 0.08, 0.04], sal: 1, antiCats: [0, 5] },
  //     AES: { kind: "categorical", probs: [0.05, 0.05, 0.18, 0.60, 0.05, 0.07], sal: 1 },
  //   }
  // },
  {
    id: "131",
    name: "Duty Voter",
    tier: "T1",
    nodes: {
      MAT: { kind: "continuous", pos: 3, sal: 1 },
      CD: { kind: "continuous", pos: 4, sal: 2 },
      CU: { kind: "continuous", pos: 3, sal: 1 },
      MOR: { kind: "continuous", pos: 4, sal: 2 },
      PRO: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      COM: { kind: "continuous", pos: 2, sal: 2 },
      ZS: { kind: "continuous", pos: 3, sal: 1 },
      ONT_H: { kind: "continuous", pos: 3, sal: 1 },
      ONT_S: { kind: "continuous", pos: 2, sal: 2 },
      PF: { kind: "continuous", pos: 3 },
      TRB: { kind: "continuous", pos: 2, anti: "high" },
      EPS: { kind: "categorical", probs: [0.10, 0.58, 0.05, 0.03, 0.16, 0.08], sal: 1, antiCats: [5] },
      AES: { kind: "categorical", probs: [0.05, 0.05, 0.18, 0.60, 0.05, 0.07], sal: 1 },
    },
    morBoundaries: { boundaries: { national: 0.12, ethnic_racial: 0.05, religious: 0.12, class: 0.05, ideological: 0.07, gender: 0.06, political_tribe: 0.5 }, intensity: 2 },
  },
  {
    id: "132",
    name: "Negative Partisan",
    tier: "T1",
    nodes: {
      MAT: { kind: "continuous", pos: 3, sal: 0 },
      CD: { kind: "continuous", pos: 3, sal: 0 },
      CU: { kind: "continuous", pos: 3, sal: 0 },
      MOR: { kind: "continuous", pos: 3, sal: 0 },
      PRO: { kind: "continuous", pos: 3, sal: 0 },
      COM: { kind: "continuous", pos: 2, sal: 1 },
      ZS: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      ONT_H: { kind: "continuous", pos: 3, sal: 0 },
      ONT_S: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      PF: { kind: "continuous", pos: 5, anti: "low" },
      TRB: { kind: "continuous", pos: 4 },
      EPS: { kind: "categorical", probs: [0.10, 0.58, 0.05, 0.03, 0.16, 0.08], sal: 1, antiCats: [5] },
      AES: { kind: "categorical", probs: [0.05, 0.05, 0.18, 0.60, 0.05, 0.07], sal: 1 },
    },
    morBoundaries: { boundaries: { national: 0.23, ethnic_racial: 0.05, religious: 0.05, class: 0.05, ideological: 0.34, gender: 0.09, political_tribe: 1 }, intensity: 3 },
  },
  {
    id: "134",
    name: "Progressive Civic Nationalist",
    tier: "T1",
    // Re-encoded 2026-04-24: this is the FDR/JFK/LBJ/Obama/Biden mainstream
    // Democratic tradition. Patriotic + economically progressive + civic-
    // nationalist + institutionally trusting + universalist-leaning + always
    // votes Democrat. Previous encoding (CU=4 sal=2, PF=2) misclassified this
    // as cosmopolitan-progressive — duplicating Activist Progressive — and
    // failed to fire on actual civic-nationalist progressives. PF bumped 2 → 5
    // because civic nationalists are the partisan-loyalist mainstream of the
    // Democratic Party.
    // CU 2 → 3 update 2026-04-26: under the broadened CU framing (worldview,
    // religion, lifestyle, conception-of-good-life pluralism, not just
    // narrow culture), civic-nationalist progressive lands at MID, not low.
    // The civic-nationalist signature is shared civic values (push CU low) +
    // pluralist on private life/religion/lifestyle (push CU high) → net mid.
    // Old CU=2 was calibrated under the narrower CU framing where civic-
    // nationalist read as assimilationist; under the broader framing CU=2 is
    // reserved for archetypes who actually want more uniformity in private
    // worldview/lifestyle (communitarian conservative, shared-thick-culture
    // advocates).
    nodes: {
      MAT: { kind: "continuous", pos: 1, sal: 3, anti: "high" },
      CD: { kind: "continuous", pos: 2, sal: 1 },
      CU: { kind: "continuous", pos: 3, sal: 2 },
      MOR: { kind: "continuous", pos: 4, sal: 2 },
      PRO: { kind: "continuous", pos: 4, sal: 2 },
      COM: { kind: "continuous", pos: 4, sal: 2 },
      ZS: { kind: "continuous", pos: 2, sal: 1 },
      ONT_H: { kind: "continuous", pos: 4, sal: 1 },
      // ONT_S 3 → 4 per ADR-010 (2026-04-26): civic-nationalist progressives
      // (FDR/Biden/Obama tradition) believe state programs effectively deliver
      // healthcare/education/redistribution. High institutional capacity belief.
      ONT_S: { kind: "continuous", pos: 4, sal: 1 },
      PF: { kind: "continuous", pos: 5 },
      TRB: { kind: "continuous", pos: 3 },
      EPS: { kind: "categorical", probs: [0.30, 0.40, 0.05, 0.10, 0.10, 0.05], sal: 1 },
      AES: { kind: "categorical", probs: [0.35, 0.20, 0.05, 0.10, 0.20, 0.10], sal: 1 },
    },
    morBoundaries: { boundaries: { national: 0.12, ethnic_racial: 0.05, religious: 0.05, class: 0.34, ideological: 0.24, gender: 0.07, political_tribe: 1 }, intensity: 3 },
  },

  // ===== NEW ARCHETYPES (added 2026-03-28 from ChatGPT semantic coverage audit) =====

  {
    id: "135",
    name: "Disruptive Cosmopolitan",
    // Archetype-audit Phase 6 PRO sweep (2026-04-27). PRO 1→3: tech-
    // entrepreneurial / startup-cosmopolitan disruption operates within
    // contract law and property regimes; "anti-bureaucratic" reads as
    // outcome-focused, not actually rule-breaking.
    tier: "T1",
    nodes: {
      MAT: { kind: "continuous", pos: 5, sal: 2 },
      CD: { kind: "continuous", pos: 1, sal: 2 },
      CU: { kind: "continuous", pos: 5, sal: 2 },
      MOR: { kind: "continuous", pos: 5, sal: 2 }, // FIX: Cosmopolitan = wide moral circle (was 1)
      PRO: { kind: "continuous", pos: 3, sal: 2 }, // 1→3 audit Phase 6: bureaucracy-skeptical, not rule-breaking
      COM: { kind: "continuous", pos: 1, sal: 1 },
      ZS: { kind: "continuous", pos: 1, sal: 1 },
      ONT_H: { kind: "continuous", pos: 4, sal: 2 },
      ONT_S: { kind: "continuous", pos: 4, sal: 1 },
      PF: { kind: "continuous", pos: 1 },
      TRB: { kind: "continuous", pos: 1 },
      EPS: { kind: "categorical", probs: [0.60, 0.05, 0.15, 0.05, 0.10, 0.05], sal: 1 },
      AES: { kind: "categorical", probs: [0.05, 0.10, 0.05, 0.05, 0.15, 0.60], sal: 1 }, // FIX: Disruptive = visionary, not statesman
    },
    morBoundaries: { boundaries: { national: 0.05, ethnic_racial: 0.05, religious: 0.05, class: 0.05, ideological: 0.05, gender: 0.05, political_tribe: 0 }, intensity: 2 },
  },

  {
    id: "136",
    name: "Aspirational Traditionalist",
    tier: "T1",
    nodes: {
      MAT: { kind: "continuous", pos: 5, sal: 2 },
      CD: { kind: "continuous", pos: 4, sal: 2 }, // FIX: Traditionalist = culturally conservative (was 2)
      CU: { kind: "continuous", pos: 2, sal: 2 }, // FIX: Traditionalist = assimilationist (was 4)
      MOR: { kind: "continuous", pos: 2, sal: 2 }, // FIX: Traditionalist = particularist (was 5/sal3)
      PRO: { kind: "continuous", pos: 3, sal: 2 },
      COM: { kind: "continuous", pos: 3, sal: 1 },
      ZS: { kind: "continuous", pos: 2, sal: 1 },
      ONT_H: { kind: "continuous", pos: 4, sal: 2 }, // Aspirational = optimistic (was 3/sal1)
      ONT_S: { kind: "continuous", pos: 4, sal: 1 },
      PF: { kind: "continuous", pos: 2 },
      TRB: { kind: "continuous", pos: 2 },
      EPS: { kind: "categorical", probs: [0.10, 0.15, 0.50, 0.10, 0.05, 0.10], sal: 1 },
      AES: { kind: "categorical", probs: [0.10, 0.10, 0.50, 0.15, 0.05, 0.10], sal: 1 },
    },
    morBoundaries: { boundaries: { national: 0.29, ethnic_racial: 0.09, religious: 0.26, class: 0.05, ideological: 0.07, gender: 0.06, political_tribe: 0.25 }, intensity: 2 },
  },

  {
    id: "137",
    name: "Moral Crusader",
    tier: "T1",
    nodes: {
      MAT: { kind: "continuous", pos: 4, sal: 1 },
      CD: { kind: "continuous", pos: 4, sal: 2 },
      CU: { kind: "continuous", pos: 2, sal: 1 },
      MOR: { kind: "continuous", pos: 5, sal: 3 },
      PRO: { kind: "continuous", pos: 2, sal: 2 },
      COM: { kind: "continuous", pos: 2, sal: 1 },
      ZS: { kind: "continuous", pos: 4, sal: 2 },
      ONT_H: { kind: "continuous", pos: 2, sal: 1 },
      ONT_S: { kind: "continuous", pos: 3, sal: 1 },
      PF: { kind: "continuous", pos: 4 },
      TRB: { kind: "continuous", pos: 4 },
      EPS: { kind: "categorical", probs: [0.05, 0.05, 0.15, 0.60, 0.10, 0.05], sal: 2 }, // FIX: Revivalist = intuitionist, not nihilist (was 0.70 nihilist)
      AES: { kind: "categorical", probs: [0.05, 0.05, 0.05, 0.05, 0.10, 0.70], sal: 3 }, // Prophetic visionary
    },
    morBoundaries: { boundaries: { national: 0.66, ethnic_racial: 0.05, religious: 0.41, class: 0.05, ideological: 0.34, gender: 0.09, political_tribe: 0.75 }, intensity: 3 },
  },

  {
    id: "138",
    name: "Optimistic Challenger",
    tier: "T1",
    nodes: {
      MAT: { kind: "continuous", pos: 3, sal: 1 },
      CD: { kind: "continuous", pos: 2, sal: 1 },
      CU: { kind: "continuous", pos: 4, sal: 1 },
      MOR: { kind: "continuous", pos: 4, sal: 2 }, // FIX: Holistic = broad concern (was 2/sal1)
      PRO: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      COM: { kind: "continuous", pos: 1, sal: 1 },
      ZS: { kind: "continuous", pos: 4, sal: 2 },
      ONT_H: { kind: "continuous", pos: 5, sal: 2 },
      ONT_S: { kind: "continuous", pos: 4, sal: 1 },
      PF: { kind: "continuous", pos: 1 },
      TRB: { kind: "continuous", pos: 2 },
      EPS: { kind: "categorical", probs: [0.10, 0.05, 0.05, 0.50, 0.25, 0.05], sal: 1 }, // FIX: Holistic = intuitionist+autonomous, not nihilist
      AES: { kind: "categorical", probs: [0.05, 0.05, 0.10, 0.60, 0.10, 0.10], sal: 2 }, // Experiential
    },
    morBoundaries: { boundaries: { national: 0.05, ethnic_racial: 0.05, religious: 0.05, class: 0.05, ideological: 0.12, gender: 0.06, political_tribe: 0 }, intensity: 2 },
  },

  {
    id: "139",
    name: "Civic Assimilationist",
    tier: "T1",
    nodes: {
      MAT: { kind: "continuous", pos: 4, sal: 2 },
      CD: { kind: "continuous", pos: 4, sal: 2 },
      CU: { kind: "continuous", pos: 1, sal: 3 }, // FIX: Assimilationist = CU=1, not CU=5 (was 5/sal2)
      MOR: { kind: "continuous", pos: 3, sal: 1 },
      PRO: { kind: "continuous", pos: 4, sal: 2 },
      COM: { kind: "continuous", pos: 3, sal: 1 },
      ZS: { kind: "continuous", pos: 2, sal: 1 },
      ONT_H: { kind: "continuous", pos: 3, sal: 1 },
      ONT_S: { kind: "continuous", pos: 4, sal: 1 },
      PF: { kind: "continuous", pos: 3 },
      TRB: { kind: "continuous", pos: 2 },
      EPS: { kind: "categorical", probs: [0.10, 0.50, 0.15, 0.10, 0.10, 0.05], sal: 1 },
      AES: { kind: "categorical", probs: [0.10, 0.50, 0.15, 0.10, 0.10, 0.05], sal: 1 },
    },
    morBoundaries: { boundaries: { national: 0.22, ethnic_racial: 0.12, religious: 0.17, class: 0.05, ideological: 0.07, gender: 0.06, political_tribe: 0.5 }, intensity: 1.5 },
  },

  {
    id: "140",
    name: "Market Green Modernist",
    // Archetype-audit Phase 4 (2026-04-26). ONT_S 1→4 (PROMOTED HIGH per
    // user direction). Pattern A archetype-side: "Market" + "Modernist" both
    // imply institutional-mechanism faith (pricing carbon, regulating markets,
    // reforming standards). Old ONT_S=1 read this as accelerationist /
    // institution-nihilist, opposite of the name.
    tier: "T1",
    nodes: {
      MAT: { kind: "continuous", pos: 4, sal: 2 },
      CD: { kind: "continuous", pos: 1, sal: 2 },
      CU: { kind: "continuous", pos: 5, sal: 2 },
      MOR: { kind: "continuous", pos: 4, sal: 2 }, // FIX: Green = wide moral concern (was 2/sal1)
      PRO: { kind: "continuous", pos: 5, sal: 2 },
      COM: { kind: "continuous", pos: 4, sal: 2 },
      ZS: { kind: "continuous", pos: 1, sal: 1 },
      ONT_H: { kind: "continuous", pos: 5, sal: 2 },
      ONT_S: { kind: "continuous", pos: 4, sal: 2 },             // 1→4 audit Phase 4: market-mechanism reform = institutional capacity belief
      PF: { kind: "continuous", pos: 1 },
      TRB: { kind: "continuous", pos: 1 },
      EPS: { kind: "categorical", probs: [0.70, 0.05, 0.10, 0.05, 0.05, 0.05], sal: 1 }, // Empiricist
      AES: { kind: "categorical", probs: [0.10, 0.60, 0.10, 0.05, 0.10, 0.05], sal: 1 }, // Systematic
    },
    morBoundaries: { boundaries: { national: 0.05, ethnic_racial: 0.05, religious: 0.05, class: 0.05, ideological: 0.05, gender: 0.05, political_tribe: 0 }, intensity: 2 },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // Identity-Primary Archetypes (141–146)
  //
  // These activate when tribalism and political fusion are the dominant signal
  // and the respondent's identity anchor + demographics confirm the fit.
  // Other nodes reflect the group's characteristic political tendencies, but
  // TRB/PF/ENG are the defining feature — politics is identity-first.
  // ═══════════════════════════════════════════════════════════════════════════

  {
    // ===== Identity-primary archetypes (141-146) =====
    // Re-encoded 2026-04-24 as policy-flat per ADR-006:
    //   - All non-SELF nodes: pos=3 sal=0 (no policy posture)
    //   - EPS/AES: uniform 1/6 distribution sal=0
    //   - PF=5, TRB=5 (highly fused, highly tribal)
    //   - No anti flags (no policy positions to anti)
    // The label of identity is determined by the resolver via:
    //   anchor + demographic confirmation + ideology-thinness gate
    // not by encoded policy similarity. A user with strong ideological
    // commitments (high policy salience) is excluded by the ideology gate
    // even if anchor + demographic + tribal/fusion conditions otherwise match.
    // White/Male Grievance are NOT separate ideological postures — per user
    // (2026-04-24), grievance just labels majority-position identity voting.
    id: "141",
    name: "Black Voter",
    tier: "T2",
    nodes: {
      MAT: { kind: "continuous", pos: 3, sal: 0 },
      CD:  { kind: "continuous", pos: 3, sal: 0 },
      CU:  { kind: "continuous", pos: 3, sal: 0 },
      MOR: { kind: "continuous", pos: 3, sal: 0 },
      PRO: { kind: "continuous", pos: 3, sal: 0 },
      COM: { kind: "continuous", pos: 3, sal: 0 },
      ZS:  { kind: "continuous", pos: 3, sal: 0 },
      ONT_H: { kind: "continuous", pos: 3, sal: 0 },
      ONT_S: { kind: "continuous", pos: 3, sal: 0 },
      PF:  { kind: "continuous", pos: 5 },
      TRB: { kind: "continuous", pos: 5 },
      EPS: { kind: "categorical", probs: [1/6, 1/6, 1/6, 1/6, 1/6, 1/6], sal: 0 },
      AES: { kind: "categorical", probs: [1/6, 1/6, 1/6, 1/6, 1/6, 1/6], sal: 0 },
    },
    morBoundaries: { boundaries: { national: 0.35, ethnic_racial: 0.9, religious: 0.3, class: 0.4, ideological: 0.3, gender: 0.15, political_tribe: 0.65 }, intensity: 3 },
  },
  {
    id: "142",
    name: "White Grievance Voter",
    tier: "T2",
    nodes: {
      MAT: { kind: "continuous", pos: 3, sal: 0 },
      CD:  { kind: "continuous", pos: 3, sal: 0 },
      CU:  { kind: "continuous", pos: 3, sal: 0 },
      MOR: { kind: "continuous", pos: 3, sal: 0 },
      PRO: { kind: "continuous", pos: 3, sal: 0 },
      COM: { kind: "continuous", pos: 3, sal: 0 },
      ZS:  { kind: "continuous", pos: 3, sal: 0 },
      ONT_H: { kind: "continuous", pos: 3, sal: 0 },
      ONT_S: { kind: "continuous", pos: 3, sal: 0 },
      PF:  { kind: "continuous", pos: 5 },
      TRB: { kind: "continuous", pos: 5 },
      EPS: { kind: "categorical", probs: [1/6, 1/6, 1/6, 1/6, 1/6, 1/6], sal: 0 },
      AES: { kind: "categorical", probs: [1/6, 1/6, 1/6, 1/6, 1/6, 1/6], sal: 0 },
    },
    morBoundaries: { boundaries: { national: 0.65, ethnic_racial: 0.9, religious: 0.35, class: 0.3, ideological: 0.4, gender: 0.3, political_tribe: 0.7 }, intensity: 3 },
  },
  {
    id: "143",
    name: "Evangelical Voter",
    tier: "T2",
    nodes: {
      MAT: { kind: "continuous", pos: 3, sal: 0 },
      CD:  { kind: "continuous", pos: 3, sal: 0 },
      CU:  { kind: "continuous", pos: 3, sal: 0 },
      MOR: { kind: "continuous", pos: 3, sal: 0 },
      PRO: { kind: "continuous", pos: 3, sal: 0 },
      COM: { kind: "continuous", pos: 3, sal: 0 },
      ZS:  { kind: "continuous", pos: 3, sal: 0 },
      ONT_H: { kind: "continuous", pos: 3, sal: 0 },
      ONT_S: { kind: "continuous", pos: 3, sal: 0 },
      PF:  { kind: "continuous", pos: 5 },
      TRB: { kind: "continuous", pos: 5 },
      EPS: { kind: "categorical", probs: [1/6, 1/6, 1/6, 1/6, 1/6, 1/6], sal: 0 },
      AES: { kind: "categorical", probs: [1/6, 1/6, 1/6, 1/6, 1/6, 1/6], sal: 0 },
    },
    morBoundaries: { boundaries: { national: 0.55, ethnic_racial: 0.3, religious: 0.85, class: 0.15, ideological: 0.4, gender: 0.3, political_tribe: 0.6 }, intensity: 3 },
  },
  {
    id: "144",
    name: "LGBTQ Voter",
    tier: "T2",
    nodes: {
      MAT: { kind: "continuous", pos: 3, sal: 0 },
      CD:  { kind: "continuous", pos: 3, sal: 0 },
      CU:  { kind: "continuous", pos: 3, sal: 0 },
      MOR: { kind: "continuous", pos: 3, sal: 0 },
      PRO: { kind: "continuous", pos: 3, sal: 0 },
      COM: { kind: "continuous", pos: 3, sal: 0 },
      ZS:  { kind: "continuous", pos: 3, sal: 0 },
      ONT_H: { kind: "continuous", pos: 3, sal: 0 },
      ONT_S: { kind: "continuous", pos: 3, sal: 0 },
      PF:  { kind: "continuous", pos: 5 },
      TRB: { kind: "continuous", pos: 5 },
      EPS: { kind: "categorical", probs: [1/6, 1/6, 1/6, 1/6, 1/6, 1/6], sal: 0 },
      AES: { kind: "categorical", probs: [1/6, 1/6, 1/6, 1/6, 1/6, 1/6], sal: 0 },
    },
    morBoundaries: { boundaries: { national: 0.2, ethnic_racial: 0.2, religious: 0.1, class: 0.2, ideological: 0.45, gender: 0.9, political_tribe: 0.55 }, intensity: 3 },
  },
  {
    id: "145",
    name: "Feminist Voter",
    tier: "T2",
    nodes: {
      MAT: { kind: "continuous", pos: 3, sal: 0 },
      CD:  { kind: "continuous", pos: 3, sal: 0 },
      CU:  { kind: "continuous", pos: 3, sal: 0 },
      MOR: { kind: "continuous", pos: 3, sal: 0 },
      PRO: { kind: "continuous", pos: 3, sal: 0 },
      COM: { kind: "continuous", pos: 3, sal: 0 },
      ZS:  { kind: "continuous", pos: 3, sal: 0 },
      ONT_H: { kind: "continuous", pos: 3, sal: 0 },
      ONT_S: { kind: "continuous", pos: 3, sal: 0 },
      PF:  { kind: "continuous", pos: 5 },
      TRB: { kind: "continuous", pos: 5 },
      EPS: { kind: "categorical", probs: [1/6, 1/6, 1/6, 1/6, 1/6, 1/6], sal: 0 },
      AES: { kind: "categorical", probs: [1/6, 1/6, 1/6, 1/6, 1/6, 1/6], sal: 0 },
    },
    morBoundaries: { boundaries: { national: 0.25, ethnic_racial: 0.25, religious: 0.1, class: 0.3, ideological: 0.5, gender: 0.85, political_tribe: 0.55 }, intensity: 3 },
  },
  {
    id: "146",
    name: "Male Grievance Voter",
    tier: "T2",
    nodes: {
      MAT: { kind: "continuous", pos: 3, sal: 0 },
      CD:  { kind: "continuous", pos: 3, sal: 0 },
      CU:  { kind: "continuous", pos: 3, sal: 0 },
      MOR: { kind: "continuous", pos: 3, sal: 0 },
      PRO: { kind: "continuous", pos: 3, sal: 0 },
      COM: { kind: "continuous", pos: 3, sal: 0 },
      ZS:  { kind: "continuous", pos: 3, sal: 0 },
      ONT_H: { kind: "continuous", pos: 3, sal: 0 },
      ONT_S: { kind: "continuous", pos: 3, sal: 0 },
      PF:  { kind: "continuous", pos: 5 },
      TRB: { kind: "continuous", pos: 5 },
      EPS: { kind: "categorical", probs: [1/6, 1/6, 1/6, 1/6, 1/6, 1/6], sal: 0 },
      AES: { kind: "categorical", probs: [1/6, 1/6, 1/6, 1/6, 1/6, 1/6], sal: 0 },
    },
    morBoundaries: { boundaries: { national: 0.45, ethnic_racial: 0.4, religious: 0.25, class: 0.25, ideological: 0.45, gender: 0.85, political_tribe: 0.55 }, intensity: 3 },
  },
];
