"use strict";

// src/config/archetypes.ts
var ARCHETYPES = [
  {
    id: "001",
    name: "Rawlsian Reformer",
    tier: "T1",
    prior: 1 / 130,
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
      PF: { kind: "continuous", pos: 2, sal: 2 },
      TRB: { kind: "continuous", pos: 2, sal: 2, anti: "high" },
      ENG: { kind: "continuous", pos: 4, sal: 2 },
      EPS: { kind: "categorical", probs: [0.25, 0.58, 0.05, 0.03, 0.06, 0.03], sal: 3, antiCats: [5] },
      AES: { kind: "categorical", probs: [0.6, 0.1, 0.14, 0.06, 0.04, 0.06], sal: 3, antiCats: [4] }
    }
  },
  {
    id: "002",
    name: "Independent Social Democrat",
    tier: "T1",
    prior: 1 / 130,
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
      PF: { kind: "continuous", pos: 2, sal: 1 },
      TRB: { kind: "continuous", pos: 2, sal: 1 },
      ENG: { kind: "continuous", pos: 3, sal: 1 },
      EPS: { kind: "categorical", probs: [0.25, 0.58, 0.05, 0.03, 0.06, 0.03], sal: 2, antiCats: [5] },
      AES: { kind: "categorical", probs: [0.6, 0.1, 0.14, 0.06, 0.04, 0.06], sal: 2, antiCats: [4] }
    }
  },
  {
    id: "003",
    name: "Welfare Modernizer",
    tier: "T1",
    prior: 1 / 130,
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
      PF: { kind: "continuous", pos: 2, sal: 1 },
      TRB: { kind: "continuous", pos: 2, sal: 1 },
      ENG: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      EPS: { kind: "categorical", probs: [0.62, 0.24, 0.03, 0.04, 0.03, 0.04], sal: 2, antiCats: [2, 3, 5] },
      AES: { kind: "categorical", probs: [0.08, 0.64, 0.04, 0.04, 0.03, 0.17], sal: 2, antiCats: [4] }
    }
  },
  {
    id: "004",
    name: "Labor Reformer",
    tier: "T1",
    prior: 1 / 130,
    nodes: {
      MAT: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      CD: { kind: "continuous", pos: 2, sal: 1 },
      CU: { kind: "continuous", pos: 2, sal: 1 },
      MOR: { kind: "continuous", pos: 4, sal: 1 },
      PRO: { kind: "continuous", pos: 4, sal: 2 },
      COM: { kind: "continuous", pos: 4, sal: 1 },
      ZS: { kind: "continuous", pos: 2, sal: 1 },
      ONT_H: { kind: "continuous", pos: 4, sal: 1 },
      ONT_S: { kind: "continuous", pos: 3, sal: 1 },
      PF: { kind: "continuous", pos: 3, sal: 2 },
      TRB: { kind: "continuous", pos: 4, sal: 1 },
      ENG: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      EPS: { kind: "categorical", probs: [0.25, 0.58, 0.05, 0.03, 0.06, 0.03], sal: 2, antiCats: [5] },
      AES: { kind: "categorical", probs: [0.04, 0.03, 0.04, 0.18, 0.63, 0.08], sal: 2, antiCats: [0, 1] }
    }
  },
  {
    id: "005",
    name: "Public Guardian",
    tier: "T1",
    prior: 1 / 130,
    nodes: {
      MAT: { kind: "continuous", pos: 2, sal: 2 },
      CD: { kind: "continuous", pos: 3, sal: 1 },
      CU: { kind: "continuous", pos: 4, sal: 2 },
      MOR: { kind: "continuous", pos: 4, sal: 2 },
      PRO: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      COM: { kind: "continuous", pos: 4, sal: 1 },
      ZS: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      ONT_H: { kind: "continuous", pos: 4, sal: 1 },
      ONT_S: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      PF: { kind: "continuous", pos: 2, sal: 1 },
      TRB: { kind: "continuous", pos: 2, sal: 1 },
      ENG: { kind: "continuous", pos: 3, sal: 1 },
      EPS: { kind: "categorical", probs: [0.25, 0.58, 0.05, 0.03, 0.06, 0.03], sal: 2, antiCats: [5] },
      AES: { kind: "categorical", probs: [0.6, 0.1, 0.14, 0.06, 0.04, 0.06], sal: 2, antiCats: [4] }
    }
  },
  {
    id: "006",
    name: "Fairness Pragmatist",
    tier: "T1",
    prior: 1 / 130,
    nodes: {
      MAT: { kind: "continuous", pos: 2, sal: 2 },
      CD: { kind: "continuous", pos: 2, sal: 1 },
      CU: { kind: "continuous", pos: 4, sal: 1 },
      MOR: { kind: "continuous", pos: 3, sal: 1 },
      PRO: { kind: "continuous", pos: 4, sal: 2 },
      COM: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      ZS: { kind: "continuous", pos: 2, sal: 1 },
      ONT_H: { kind: "continuous", pos: 4, sal: 1 },
      ONT_S: { kind: "continuous", pos: 3, sal: 1 },
      PF: { kind: "continuous", pos: 2, sal: 1 },
      TRB: { kind: "continuous", pos: 2, sal: 1 },
      ENG: { kind: "continuous", pos: 4, sal: 1 },
      EPS: { kind: "categorical", probs: [0.62, 0.24, 0.03, 0.04, 0.03, 0.04], sal: 3, antiCats: [2, 3, 5] },
      AES: { kind: "categorical", probs: [0.6, 0.2, 0.04, 0.06, 0.04, 0.06], sal: 3, antiCats: [4] }
    }
  },
  {
    id: "007",
    name: "Solidarist Reformer",
    tier: "T1",
    prior: 1 / 130,
    nodes: {
      MAT: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      CD: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      CU: { kind: "continuous", pos: 2, sal: 2 },
      MOR: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      PRO: { kind: "continuous", pos: 4, sal: 2 },
      COM: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      ZS: { kind: "continuous", pos: 2, sal: 2 },
      ONT_H: { kind: "continuous", pos: 4, sal: 2 },
      ONT_S: { kind: "continuous", pos: 3, sal: 1 },
      PF: { kind: "continuous", pos: 2, sal: 1 },
      TRB: { kind: "continuous", pos: 2, sal: 1 },
      ENG: { kind: "continuous", pos: 4, sal: 1 },
      EPS: { kind: "categorical", probs: [0.04, 0.08, 0.6, 0.16, 0.08, 0.04], sal: 2, antiCats: [0, 5] },
      AES: { kind: "categorical", probs: [0.6, 0.1, 0.14, 0.06, 0.04, 0.06], sal: 2, antiCats: [4] }
    }
  },
  {
    id: "008",
    name: "Municipal Equalizer",
    tier: "T1",
    prior: 1 / 130,
    nodes: {
      MAT: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      CD: { kind: "continuous", pos: 2, sal: 1 },
      CU: { kind: "continuous", pos: 4, sal: 1 },
      MOR: { kind: "continuous", pos: 4, sal: 1 },
      PRO: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      COM: { kind: "continuous", pos: 3, sal: 1 },
      ZS: { kind: "continuous", pos: 2, sal: 1 },
      ONT_H: { kind: "continuous", pos: 2, sal: 1 },
      ONT_S: { kind: "continuous", pos: 3, sal: 1 },
      PF: { kind: "continuous", pos: 2, sal: 1 },
      TRB: { kind: "continuous", pos: 2, sal: 1 },
      ENG: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      EPS: { kind: "categorical", probs: [0.25, 0.58, 0.05, 0.03, 0.06, 0.03], sal: 2, antiCats: [5] },
      AES: { kind: "categorical", probs: [0.6, 0.1, 0.14, 0.06, 0.04, 0.06], sal: 2, antiCats: [4] }
    }
  },
  {
    id: "009",
    name: "Social Stabilizer",
    tier: "T1",
    prior: 1 / 130,
    nodes: {
      MAT: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      CD: { kind: "continuous", pos: 2, sal: 1 },
      CU: { kind: "continuous", pos: 3, sal: 1 },
      MOR: { kind: "continuous", pos: 4, sal: 1 },
      PRO: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      COM: { kind: "continuous", pos: 4, sal: 1 },
      ZS: { kind: "continuous", pos: 4, sal: 1 },
      ONT_H: { kind: "continuous", pos: 4, sal: 1 },
      ONT_S: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      PF: { kind: "continuous", pos: 2, sal: 1 },
      TRB: { kind: "continuous", pos: 2, sal: 1 },
      ENG: { kind: "continuous", pos: 4, sal: 1 },
      EPS: { kind: "categorical", probs: [0.25, 0.58, 0.05, 0.03, 0.06, 0.03], sal: 2, antiCats: [5] },
      AES: { kind: "categorical", probs: [0.6, 0.1, 0.14, 0.06, 0.04, 0.06], sal: 2, antiCats: [4] }
    }
  },
  {
    id: "010",
    name: "Bread-and-Butter Progressive",
    tier: "T1",
    prior: 1 / 130,
    nodes: {
      MAT: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      CD: { kind: "continuous", pos: 3, sal: 0 },
      CU: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      MOR: { kind: "continuous", pos: 2, sal: 1 },
      PRO: { kind: "continuous", pos: 4, sal: 2 },
      COM: { kind: "continuous", pos: 4, sal: 1 },
      ZS: { kind: "continuous", pos: 2, sal: 1 },
      ONT_H: { kind: "continuous", pos: 2, sal: 1 },
      ONT_S: { kind: "continuous", pos: 3, sal: 1 },
      PF: { kind: "continuous", pos: 2, sal: 1 },
      TRB: { kind: "continuous", pos: 2, sal: 1 },
      ENG: { kind: "continuous", pos: 3, sal: 2 },
      EPS: { kind: "categorical", probs: [0.25, 0.58, 0.05, 0.03, 0.06, 0.03], sal: 2, antiCats: [5] },
      AES: { kind: "categorical", probs: [0.6, 0.1, 0.14, 0.06, 0.04, 0.06], sal: 2, antiCats: [4] }
    }
  },
  {
    id: "011",
    name: "Jacobin Egalitarian",
    tier: "T1",
    prior: 1 / 130,
    nodes: {
      MAT: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      CD: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      CU: { kind: "continuous", pos: 4, sal: 2, anti: "low" },
      MOR: { kind: "continuous", pos: 4, sal: 2, anti: "low" },
      PRO: { kind: "continuous", pos: 2, sal: 2, anti: "high" },
      COM: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      ZS: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      ONT_H: { kind: "continuous", pos: 3, sal: 2, anti: "high" },
      ONT_S: { kind: "continuous", pos: 4, sal: 1 },
      PF: { kind: "continuous", pos: 2, sal: 2 },
      TRB: { kind: "continuous", pos: 3, sal: 2 },
      ENG: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      EPS: { kind: "categorical", probs: [0.05, 0.05, 0.08, 0.58, 0.19, 0.05], sal: 3, antiCats: [0, 5] },
      AES: { kind: "categorical", probs: [0.04, 0.03, 0.04, 0.18, 0.63, 0.08], sal: 3, antiCats: [0, 1] }
    }
  },
  {
    id: "012",
    name: "Class-War Leftist",
    tier: "T1",
    prior: 1 / 130,
    nodes: {
      MAT: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      CD: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      CU: { kind: "continuous", pos: 2, sal: 2 },
      MOR: { kind: "continuous", pos: 3, sal: 2 },
      PRO: { kind: "continuous", pos: 2, sal: 1 },
      COM: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      ZS: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      ONT_H: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      ONT_S: { kind: "continuous", pos: 4, sal: 2 },
      PF: { kind: "continuous", pos: 2, sal: 1 },
      TRB: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      ENG: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      EPS: { kind: "categorical", probs: [0.08, 0.08, 0.08, 0.2, 0.5, 0.06], sal: 3, antiCats: [2, 5] },
      AES: { kind: "categorical", probs: [0.04, 0.03, 0.04, 0.18, 0.63, 0.08], sal: 3, antiCats: [0, 1] }
    }
  },
  {
    id: "013",
    name: "Radical Leveler",
    tier: "T1",
    prior: 1 / 130,
    nodes: {
      MAT: { kind: "continuous", pos: 2, sal: 2 },
      CD: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      CU: { kind: "continuous", pos: 4, sal: 1 },
      MOR: { kind: "continuous", pos: 4, sal: 1 },
      PRO: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      COM: { kind: "continuous", pos: 2, sal: 1 },
      ZS: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      ONT_H: { kind: "continuous", pos: 3, sal: 1 },
      ONT_S: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      PF: { kind: "continuous", pos: 2, sal: 1 },
      TRB: { kind: "continuous", pos: 3, sal: 1 },
      ENG: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      EPS: { kind: "categorical", probs: [0.08, 0.08, 0.08, 0.2, 0.5, 0.06], sal: 2, antiCats: [2, 5] },
      AES: { kind: "categorical", probs: [0.04, 0.03, 0.04, 0.18, 0.63, 0.08], sal: 2, antiCats: [0, 1] }
    }
  },
  {
    id: "014",
    name: "Movement Egalitarian",
    tier: "T1",
    prior: 1 / 130,
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
      PF: { kind: "continuous", pos: 2, sal: 1 },
      TRB: { kind: "continuous", pos: 3, sal: 1 },
      ENG: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      EPS: { kind: "categorical", probs: [0.08, 0.08, 0.08, 0.2, 0.5, 0.06], sal: 2, antiCats: [2, 5] },
      AES: { kind: "categorical", probs: [0.06, 0.08, 0.05, 0.06, 0.08, 0.67], sal: 2 }
    }
  },
  {
    id: "015",
    name: "Moral Firebrand",
    tier: "T1",
    prior: 1 / 130,
    nodes: {
      MAT: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      CD: { kind: "continuous", pos: 2, sal: 2, anti: "high" },
      CU: { kind: "continuous", pos: 5, sal: 3, anti: "low" },
      MOR: { kind: "continuous", pos: 5, sal: 3, anti: "low" },
      PRO: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      COM: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      ZS: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      ONT_H: { kind: "continuous", pos: 5, sal: 3, anti: "low" },
      ONT_S: { kind: "continuous", pos: 5, sal: 2 },
      PF: { kind: "continuous", pos: 2, sal: 2, anti: "low" },
      TRB: { kind: "continuous", pos: 4, sal: 2 },
      ENG: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      EPS: { kind: "categorical", probs: [0.05, 0.05, 0.08, 0.58, 0.19, 0.05], sal: 2, antiCats: [0, 5] },
      AES: { kind: "categorical", probs: [0.06, 0.08, 0.05, 0.06, 0.08, 0.67], sal: 3 }
    }
  },
  {
    id: "016",
    name: "Insurgent Equalizer",
    tier: "T1",
    prior: 1 / 130,
    nodes: {
      MAT: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      CD: { kind: "continuous", pos: 2, sal: 2 },
      CU: { kind: "continuous", pos: 4, sal: 2, anti: "low" },
      MOR: { kind: "continuous", pos: 4, sal: 2, anti: "low" },
      PRO: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      COM: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      ZS: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      ONT_H: { kind: "continuous", pos: 3, sal: 2 },
      ONT_S: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      PF: { kind: "continuous", pos: 2, sal: 1 },
      TRB: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      ENG: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      EPS: { kind: "categorical", probs: [0.08, 0.08, 0.08, 0.2, 0.5, 0.06], sal: 2, antiCats: [2, 5] },
      AES: { kind: "categorical", probs: [0.04, 0.03, 0.04, 0.18, 0.63, 0.08], sal: 2, antiCats: [0, 1] }
    }
  },
  {
    id: "017",
    name: "Uncompromising Redistributionist",
    tier: "T1",
    prior: 1 / 130,
    nodes: {
      MAT: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      CD: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      CU: { kind: "continuous", pos: 4, sal: 1 },
      MOR: { kind: "continuous", pos: 4, sal: 1 },
      PRO: { kind: "continuous", pos: 2, sal: 1 },
      COM: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      ZS: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      ONT_H: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      ONT_S: { kind: "continuous", pos: 4, sal: 1 },
      PF: { kind: "continuous", pos: 2, sal: 1 },
      TRB: { kind: "continuous", pos: 3, sal: 1 },
      ENG: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      EPS: { kind: "categorical", probs: [0.08, 0.08, 0.08, 0.2, 0.5, 0.06], sal: 2, antiCats: [2, 5] },
      AES: { kind: "categorical", probs: [0.04, 0.03, 0.04, 0.18, 0.63, 0.08], sal: 2, antiCats: [0, 1] }
    }
  },
  {
    id: "019",
    name: "Anarchist Mutualist",
    tier: "T1",
    prior: 1 / 130,
    nodes: {
      MAT: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      CD: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      CU: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      MOR: { kind: "continuous", pos: 4, sal: 2 },
      PRO: { kind: "continuous", pos: 1, sal: 3, anti: "high" },
      COM: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      ZS: { kind: "continuous", pos: 1, sal: 3, anti: "high" },
      ONT_H: { kind: "continuous", pos: 4, sal: 2 },
      ONT_S: { kind: "continuous", pos: 4, sal: 1 },
      PF: { kind: "continuous", pos: 1, sal: 2, anti: "low" },
      TRB: { kind: "continuous", pos: 2, sal: 2 },
      ENG: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      EPS: { kind: "categorical", probs: [0.08, 0.08, 0.08, 0.2, 0.5, 0.06], sal: 2, antiCats: [2, 5] },
      AES: { kind: "categorical", probs: [0.06, 0.05, 0.62, 0.17, 0.03, 0.07], sal: 3 }
    }
  },
  {
    id: "020",
    name: "Horizontalist Dissenter",
    tier: "T1",
    prior: 1 / 130,
    nodes: {
      MAT: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      CD: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      CU: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      MOR: { kind: "continuous", pos: 4, sal: 2 },
      PRO: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      COM: { kind: "continuous", pos: 2, sal: 2 },
      ZS: { kind: "continuous", pos: 3, sal: 1 },
      ONT_H: { kind: "continuous", pos: 3, sal: 1 },
      ONT_S: { kind: "continuous", pos: 4, sal: 2 },
      PF: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      TRB: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      ENG: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      EPS: { kind: "categorical", probs: [0.08, 0.08, 0.08, 0.2, 0.5, 0.06], sal: 2, antiCats: [2, 5] },
      AES: { kind: "categorical", probs: [0.05, 0.05, 0.18, 0.6, 0.05, 0.07], sal: 2 }
    }
  },
  {
    id: "021",
    name: "Kantian Cosmopolitan",
    tier: "T1",
    prior: 1 / 130,
    nodes: {
      MAT: { kind: "continuous", pos: 2, sal: 2 },
      CD: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      CU: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      MOR: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      PRO: { kind: "continuous", pos: 4, sal: 2 },
      COM: { kind: "continuous", pos: 3, sal: 1 },
      ZS: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      ONT_H: { kind: "continuous", pos: 4, sal: 2 },
      ONT_S: { kind: "continuous", pos: 3, sal: 1 },
      PF: { kind: "continuous", pos: 2, sal: 1 },
      TRB: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      ENG: { kind: "continuous", pos: 4, sal: 1 },
      EPS: { kind: "categorical", probs: [0.25, 0.58, 0.05, 0.03, 0.06, 0.03], sal: 2, antiCats: [5] },
      AES: { kind: "categorical", probs: [0.06, 0.18, 0.05, 0.06, 0.08, 0.57], sal: 2 }
    }
  },
  {
    id: "022",
    name: "Pluralist Universalist",
    tier: "T1",
    prior: 1 / 130,
    nodes: {
      MAT: { kind: "continuous", pos: 2, sal: 2 },
      CD: { kind: "continuous", pos: 2, sal: 2 },
      CU: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      MOR: { kind: "continuous", pos: 4, sal: 2 },
      PRO: { kind: "continuous", pos: 2, sal: 1 },
      COM: { kind: "continuous", pos: 3, sal: 1 },
      ZS: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      ONT_H: { kind: "continuous", pos: 4, sal: 1 },
      ONT_S: { kind: "continuous", pos: 3, sal: 1 },
      PF: { kind: "continuous", pos: 2, sal: 1 },
      TRB: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      ENG: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      EPS: { kind: "categorical", probs: [0.25, 0.58, 0.05, 0.03, 0.06, 0.03], sal: 2, antiCats: [5] },
      AES: { kind: "categorical", probs: [0.06, 0.18, 0.05, 0.06, 0.08, 0.57], sal: 2 }
    }
  },
  {
    id: "023",
    name: "Rights Cosmopolitan",
    tier: "T1",
    prior: 1 / 130,
    nodes: {
      MAT: { kind: "continuous", pos: 2, sal: 2 },
      CD: { kind: "continuous", pos: 1, sal: 3, anti: "high" },
      CU: { kind: "continuous", pos: 4, sal: 3, anti: "low" },
      MOR: { kind: "continuous", pos: 5, sal: 3, anti: "low" },
      PRO: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      COM: { kind: "continuous", pos: 1, sal: 3, anti: "high" },
      ZS: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      ONT_H: { kind: "continuous", pos: 5, sal: 2 },
      ONT_S: { kind: "continuous", pos: 3, sal: 1 },
      PF: { kind: "continuous", pos: 2, sal: 2 },
      TRB: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      ENG: { kind: "continuous", pos: 3, sal: 1 },
      EPS: { kind: "categorical", probs: [0.25, 0.58, 0.05, 0.03, 0.06, 0.03], sal: 2, antiCats: [5] },
      AES: { kind: "categorical", probs: [0.06, 0.08, 0.05, 0.06, 0.08, 0.67], sal: 3 }
    }
  },
  {
    id: "024",
    name: "Ethical Internationalist",
    tier: "T1",
    prior: 1 / 130,
    nodes: {
      MAT: { kind: "continuous", pos: 1, sal: 2 },
      CD: { kind: "continuous", pos: 1, sal: 3, anti: "high" },
      CU: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      MOR: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      PRO: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      COM: { kind: "continuous", pos: 5, sal: 3 },
      ZS: { kind: "continuous", pos: 1, sal: 3, anti: "high" },
      ONT_H: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      ONT_S: { kind: "continuous", pos: 3, sal: 1 },
      PF: { kind: "continuous", pos: 2, sal: 2 },
      TRB: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      ENG: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      EPS: { kind: "categorical", probs: [0.25, 0.58, 0.05, 0.03, 0.06, 0.03], sal: 3, antiCats: [5] },
      AES: { kind: "categorical", probs: [0.06, 0.18, 0.05, 0.06, 0.08, 0.57], sal: 3 }
    }
  },
  {
    id: "025",
    name: "World-Minded Reformer",
    tier: "T1",
    prior: 1 / 130,
    nodes: {
      MAT: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      CD: { kind: "continuous", pos: 2, sal: 2 },
      CU: { kind: "continuous", pos: 5, sal: 3, anti: "low" },
      MOR: { kind: "continuous", pos: 5, sal: 3, anti: "low" },
      PRO: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      COM: { kind: "continuous", pos: 3, sal: 2 },
      ZS: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      ONT_H: { kind: "continuous", pos: 4, sal: 2 },
      ONT_S: { kind: "continuous", pos: 4, sal: 2, anti: "low" },
      PF: { kind: "continuous", pos: 2, sal: 2 },
      TRB: { kind: "continuous", pos: 1, sal: 3, anti: "high" },
      ENG: { kind: "continuous", pos: 4, sal: 2 },
      EPS: { kind: "categorical", probs: [0.25, 0.58, 0.05, 0.03, 0.06, 0.03], sal: 2, antiCats: [5] },
      AES: { kind: "categorical", probs: [0.08, 0.64, 0.04, 0.04, 0.03, 0.17], sal: 2, antiCats: [4] }
    }
  },
  {
    id: "026",
    name: "Cosmopolitan Pragmatist",
    tier: "T1",
    prior: 1 / 130,
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
      PF: { kind: "continuous", pos: 2, sal: 1 },
      TRB: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      ENG: { kind: "continuous", pos: 3, sal: 1 },
      EPS: { kind: "categorical", probs: [0.25, 0.58, 0.05, 0.03, 0.06, 0.03], sal: 2, antiCats: [5] },
      AES: { kind: "categorical", probs: [0.06, 0.18, 0.05, 0.06, 0.08, 0.57], sal: 2 }
    }
  },
  {
    id: "027",
    name: "Popperian Liberal",
    tier: "T1",
    prior: 1 / 130,
    nodes: {
      MAT: { kind: "continuous", pos: 2, sal: 1 },
      CD: { kind: "continuous", pos: 2, sal: 2 },
      CU: { kind: "continuous", pos: 3, sal: 2 },
      MOR: { kind: "continuous", pos: 2, sal: 2 },
      PRO: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      COM: { kind: "continuous", pos: 4, sal: 2 },
      ZS: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      ONT_H: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      ONT_S: { kind: "continuous", pos: 3, sal: 1 },
      PF: { kind: "continuous", pos: 2, sal: 2, anti: "high" },
      TRB: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      ENG: { kind: "continuous", pos: 4, sal: 1 },
      EPS: { kind: "categorical", probs: [0.62, 0.24, 0.03, 0.04, 0.03, 0.04], sal: 3, antiCats: [2, 3, 5] },
      AES: { kind: "categorical", probs: [0.6, 0.1, 0.14, 0.06, 0.04, 0.06], sal: 3, antiCats: [4] }
    }
  },
  {
    id: "028",
    name: "Global Caretaker",
    tier: "T1",
    prior: 1 / 130,
    nodes: {
      MAT: { kind: "continuous", pos: 2, sal: 2 },
      CD: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      CU: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      MOR: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      PRO: { kind: "continuous", pos: 2, sal: 2 },
      COM: { kind: "continuous", pos: 4, sal: 2 },
      ZS: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      ONT_H: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      ONT_S: { kind: "continuous", pos: 3, sal: 1 },
      PF: { kind: "continuous", pos: 2, sal: 2 },
      TRB: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      ENG: { kind: "continuous", pos: 3, sal: 1 },
      EPS: { kind: "categorical", probs: [0.25, 0.58, 0.05, 0.03, 0.06, 0.03], sal: 2, antiCats: [5] },
      AES: { kind: "categorical", probs: [0.06, 0.05, 0.62, 0.17, 0.03, 0.07], sal: 2 }
    }
  },
  {
    id: "029",
    name: "Liberationist Progressive",
    tier: "T1",
    prior: 1 / 130,
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
      PF: { kind: "continuous", pos: 2, sal: 2 },
      TRB: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      ENG: { kind: "continuous", pos: 5, sal: 3, anti: "low" },
      EPS: { kind: "categorical", probs: [0.05, 0.05, 0.08, 0.58, 0.19, 0.05], sal: 3, antiCats: [0, 5] },
      AES: { kind: "categorical", probs: [0.06, 0.18, 0.05, 0.06, 0.08, 0.57], sal: 2 }
    }
  },
  {
    id: "030",
    name: "Cultural Pluralist",
    tier: "T1",
    prior: 1 / 130,
    nodes: {
      MAT: { kind: "continuous", pos: 2, sal: 2 },
      CD: { kind: "continuous", pos: 2, sal: 2, anti: "high" },
      CU: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      MOR: { kind: "continuous", pos: 3, sal: 2 },
      PRO: { kind: "continuous", pos: 3, sal: 2, anti: "low" },
      COM: { kind: "continuous", pos: 3, sal: 2 },
      ZS: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      ONT_H: { kind: "continuous", pos: 3, sal: 2 },
      ONT_S: { kind: "continuous", pos: 3, sal: 1 },
      PF: { kind: "continuous", pos: 2, sal: 1 },
      TRB: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      ENG: { kind: "continuous", pos: 4, sal: 1 },
      EPS: { kind: "categorical", probs: [0.25, 0.58, 0.05, 0.03, 0.06, 0.03], sal: 2, antiCats: [5] },
      AES: { kind: "categorical", probs: [0.06, 0.18, 0.05, 0.06, 0.08, 0.57], sal: 2 }
    }
  },
  {
    id: "031",
    name: "Planetary Steward",
    tier: "T1",
    prior: 1 / 130,
    nodes: {
      MAT: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      CD: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      CU: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      MOR: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      PRO: { kind: "continuous", pos: 3, sal: 1 },
      COM: { kind: "continuous", pos: 4, sal: 1 },
      ZS: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      ONT_H: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      ONT_S: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      PF: { kind: "continuous", pos: 2, sal: 1 },
      TRB: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      ENG: { kind: "continuous", pos: 4, sal: 2 },
      EPS: { kind: "categorical", probs: [0.62, 0.24, 0.03, 0.04, 0.03, 0.04], sal: 2, antiCats: [2, 3, 5] },
      AES: { kind: "categorical", probs: [0.06, 0.05, 0.62, 0.17, 0.03, 0.07], sal: 2 }
    }
  },
  {
    id: "032",
    name: "Hamiltonian Technocrat",
    tier: "T1",
    prior: 1 / 130,
    nodes: {
      MAT: { kind: "continuous", pos: 3, sal: 2 },
      CD: { kind: "continuous", pos: 2, sal: 2, anti: "high" },
      CU: { kind: "continuous", pos: 4, sal: 2, anti: "high" },
      MOR: { kind: "continuous", pos: 3, sal: 2 },
      PRO: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      COM: { kind: "continuous", pos: 4, sal: 2, anti: "low" },
      ZS: { kind: "continuous", pos: 4, sal: 2 },
      ONT_H: { kind: "continuous", pos: 4, sal: 2, anti: "low" },
      ONT_S: { kind: "continuous", pos: 3, sal: 1 },
      PF: { kind: "continuous", pos: 3, sal: 1, anti: "high" },
      // Fixed: sal 0→1 (can't have anti on sal=0)
      TRB: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      ENG: { kind: "continuous", pos: 4, sal: 1 },
      EPS: { kind: "categorical", probs: [0.62, 0.24, 0.03, 0.04, 0.03, 0.04], sal: 3, antiCats: [2, 3, 5] },
      AES: { kind: "categorical", probs: [0.08, 0.64, 0.04, 0.04, 0.03, 0.17], sal: 3, antiCats: [4] }
    }
  },
  {
    id: "033",
    name: "Systems Modernizer",
    tier: "T1",
    prior: 1 / 130,
    nodes: {
      MAT: { kind: "continuous", pos: 2, sal: 2 },
      CD: { kind: "continuous", pos: 1, sal: 3, anti: "high" },
      CU: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      MOR: { kind: "continuous", pos: 4, sal: 2 },
      PRO: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      COM: { kind: "continuous", pos: 2, sal: 3, anti: "high" },
      ZS: { kind: "continuous", pos: 2, sal: 3, anti: "high" },
      ONT_H: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      ONT_S: { kind: "continuous", pos: 2, sal: 3 },
      PF: { kind: "continuous", pos: 3, sal: 1, anti: "low" },
      TRB: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      ENG: { kind: "continuous", pos: 4, sal: 2 },
      EPS: { kind: "categorical", probs: [0.62, 0.24, 0.03, 0.04, 0.03, 0.04], sal: 2, antiCats: [2, 3, 5] },
      AES: { kind: "categorical", probs: [0.06, 0.18, 0.05, 0.06, 0.08, 0.57], sal: 3 }
    }
  },
  {
    id: "034",
    name: "Evidence Reformer",
    tier: "T1",
    prior: 1 / 130,
    nodes: {
      MAT: { kind: "continuous", pos: 2, sal: 1 },
      CD: { kind: "continuous", pos: 2, sal: 1 },
      CU: { kind: "continuous", pos: 4, sal: 1 },
      MOR: { kind: "continuous", pos: 4, sal: 1 },
      PRO: { kind: "continuous", pos: 3, sal: 2 },
      COM: { kind: "continuous", pos: 3, sal: 1 },
      ZS: { kind: "continuous", pos: 2, sal: 1 },
      ONT_H: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      ONT_S: { kind: "continuous", pos: 2, sal: 1 },
      PF: { kind: "continuous", pos: 3, sal: 0 },
      TRB: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      ENG: { kind: "continuous", pos: 3, sal: 1 },
      EPS: { kind: "categorical", probs: [0.62, 0.24, 0.03, 0.04, 0.03, 0.04], sal: 2, antiCats: [2, 3, 5] },
      AES: { kind: "categorical", probs: [0.08, 0.64, 0.04, 0.04, 0.03, 0.17], sal: 2, antiCats: [4] }
    }
  },
  {
    id: "035",
    name: "Administrative Liberal",
    tier: "T1",
    prior: 1 / 130,
    nodes: {
      MAT: { kind: "continuous", pos: 2, sal: 1 },
      CD: { kind: "continuous", pos: 3, sal: 1 },
      CU: { kind: "continuous", pos: 4, sal: 1 },
      MOR: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      PRO: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      COM: { kind: "continuous", pos: 4, sal: 2 },
      ZS: { kind: "continuous", pos: 3, sal: 2 },
      ONT_H: { kind: "continuous", pos: 4, sal: 2 },
      ONT_S: { kind: "continuous", pos: 2, sal: 1 },
      PF: { kind: "continuous", pos: 4, sal: 1 },
      TRB: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      ENG: { kind: "continuous", pos: 4, sal: 1 },
      EPS: { kind: "categorical", probs: [0.62, 0.24, 0.03, 0.04, 0.03, 0.04], sal: 2, antiCats: [2, 3, 5] },
      AES: { kind: "categorical", probs: [0.08, 0.64, 0.04, 0.04, 0.03, 0.17], sal: 2, antiCats: [4] }
    }
  },
  {
    id: "036",
    name: "Institutional Optimizer",
    tier: "T1",
    prior: 1 / 130,
    nodes: {
      MAT: { kind: "continuous", pos: 4, sal: 2 },
      CD: { kind: "continuous", pos: 2, sal: 2 },
      CU: { kind: "continuous", pos: 3, sal: 2 },
      MOR: { kind: "continuous", pos: 4, sal: 2 },
      PRO: { kind: "continuous", pos: 4, sal: 2 },
      COM: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      ZS: { kind: "continuous", pos: 2, sal: 2 },
      ONT_H: { kind: "continuous", pos: 4, sal: 2 },
      ONT_S: { kind: "continuous", pos: 2, sal: 2 },
      PF: { kind: "continuous", pos: 3, sal: 2 },
      TRB: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      ENG: { kind: "continuous", pos: 3, sal: 2 },
      EPS: { kind: "categorical", probs: [0.62, 0.24, 0.03, 0.04, 0.03, 0.04], sal: 3, antiCats: [2, 3, 5] },
      AES: { kind: "categorical", probs: [0.08, 0.64, 0.04, 0.04, 0.03, 0.17], sal: 3, antiCats: [4] }
    }
  },
  {
    id: "037",
    name: "Fabian Modernizer",
    tier: "T1",
    prior: 1 / 130,
    nodes: {
      MAT: { kind: "continuous", pos: 1, sal: 1 },
      CD: { kind: "continuous", pos: 3, sal: 1 },
      CU: { kind: "continuous", pos: 4, sal: 1 },
      MOR: { kind: "continuous", pos: 4, sal: 2 },
      PRO: { kind: "continuous", pos: 5, sal: 3, anti: "low" },
      COM: { kind: "continuous", pos: 4, sal: 2 },
      ZS: { kind: "continuous", pos: 2, sal: 2 },
      ONT_H: { kind: "continuous", pos: 5, sal: 3, anti: "low" },
      ONT_S: { kind: "continuous", pos: 2, sal: 1 },
      PF: { kind: "continuous", pos: 2, sal: 1 },
      TRB: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      ENG: { kind: "continuous", pos: 3, sal: 1 },
      EPS: { kind: "categorical", probs: [0.25, 0.58, 0.05, 0.03, 0.06, 0.03], sal: 3, antiCats: [5] },
      AES: { kind: "categorical", probs: [0.08, 0.64, 0.04, 0.04, 0.03, 0.17], sal: 2, antiCats: [4] }
    }
  },
  {
    id: "039",
    name: "Data-Driven Moderate",
    tier: "T1",
    prior: 1 / 130,
    nodes: {
      MAT: { kind: "continuous", pos: 3, sal: 0 },
      CD: { kind: "continuous", pos: 2, sal: 1 },
      CU: { kind: "continuous", pos: 2, sal: 2, anti: "high" },
      MOR: { kind: "continuous", pos: 3, sal: 1 },
      PRO: { kind: "continuous", pos: 4, sal: 2, anti: "low" },
      COM: { kind: "continuous", pos: 4, sal: 2 },
      ZS: { kind: "continuous", pos: 2, sal: 1 },
      ONT_H: { kind: "continuous", pos: 4, sal: 1, anti: "low" },
      ONT_S: { kind: "continuous", pos: 2, sal: 2 },
      PF: { kind: "continuous", pos: 3, sal: 0 },
      TRB: { kind: "continuous", pos: 2, sal: 1, anti: "high" },
      ENG: { kind: "continuous", pos: 3, sal: 1 },
      EPS: { kind: "categorical", probs: [0.62, 0.24, 0.03, 0.04, 0.03, 0.04], sal: 2, antiCats: [2, 3, 5] },
      AES: { kind: "categorical", probs: [0.08, 0.64, 0.04, 0.04, 0.03, 0.17], sal: 2, antiCats: [4] }
    }
  },
  {
    id: "040",
    name: "Reform Engineer",
    tier: "T1",
    prior: 1 / 130,
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
      PF: { kind: "continuous", pos: 3, sal: 0 },
      TRB: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      ENG: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      EPS: { kind: "categorical", probs: [0.62, 0.24, 0.03, 0.04, 0.03, 0.04], sal: 3, antiCats: [2, 3, 5] },
      AES: { kind: "categorical", probs: [0.08, 0.64, 0.04, 0.04, 0.03, 0.17], sal: 3, antiCats: [4] }
    }
  },
  {
    id: "042",
    name: "Localist Progressive",
    tier: "T1",
    prior: 1 / 130,
    nodes: {
      MAT: { kind: "continuous", pos: 2, sal: 2 },
      CD: { kind: "continuous", pos: 2, sal: 1 },
      CU: { kind: "continuous", pos: 2, sal: 2 },
      MOR: { kind: "continuous", pos: 3, sal: 1 },
      PRO: { kind: "continuous", pos: 3, sal: 1 },
      COM: { kind: "continuous", pos: 3, sal: 1 },
      ZS: { kind: "continuous", pos: 2, sal: 1 },
      ONT_H: { kind: "continuous", pos: 3, sal: 1 },
      ONT_S: { kind: "continuous", pos: 3, sal: 1 },
      PF: { kind: "continuous", pos: 2, sal: 1 },
      TRB: { kind: "continuous", pos: 2, sal: 1 },
      ENG: { kind: "continuous", pos: 4, sal: 1 },
      EPS: { kind: "categorical", probs: [0.04, 0.08, 0.6, 0.16, 0.08, 0.04], sal: 2, antiCats: [0, 5] },
      AES: { kind: "categorical", probs: [0.06, 0.05, 0.62, 0.17, 0.03, 0.07], sal: 2 }
    }
  },
  {
    id: "043",
    name: "Neighborly Egalitarian",
    tier: "T1",
    prior: 1 / 130,
    nodes: {
      MAT: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      CD: { kind: "continuous", pos: 2, sal: 1 },
      CU: { kind: "continuous", pos: 2, sal: 1 },
      MOR: { kind: "continuous", pos: 4, sal: 2 },
      PRO: { kind: "continuous", pos: 3, sal: 1 },
      COM: { kind: "continuous", pos: 3, sal: 1 },
      ZS: { kind: "continuous", pos: 2, sal: 1 },
      ONT_H: { kind: "continuous", pos: 3, sal: 1 },
      ONT_S: { kind: "continuous", pos: 3, sal: 1 },
      PF: { kind: "continuous", pos: 2, sal: 1 },
      TRB: { kind: "continuous", pos: 2, sal: 1 },
      ENG: { kind: "continuous", pos: 2, sal: 1 },
      EPS: { kind: "categorical", probs: [0.04, 0.08, 0.6, 0.16, 0.08, 0.04], sal: 2, antiCats: [0, 5] },
      AES: { kind: "categorical", probs: [0.06, 0.05, 0.62, 0.17, 0.03, 0.07], sal: 2 }
    }
  },
  {
    id: "045",
    name: "Rooted Social Reformer",
    tier: "T1",
    prior: 1 / 130,
    nodes: {
      MAT: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      CD: { kind: "continuous", pos: 4, sal: 2 },
      CU: { kind: "continuous", pos: 2, sal: 1 },
      MOR: { kind: "continuous", pos: 3, sal: 1 },
      PRO: { kind: "continuous", pos: 4, sal: 1 },
      COM: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      ZS: { kind: "continuous", pos: 2, sal: 1 },
      ONT_H: { kind: "continuous", pos: 3, sal: 1 },
      ONT_S: { kind: "continuous", pos: 3, sal: 1 },
      PF: { kind: "continuous", pos: 2, sal: 1 },
      TRB: { kind: "continuous", pos: 2, sal: 1 },
      ENG: { kind: "continuous", pos: 3, sal: 1 },
      EPS: { kind: "categorical", probs: [0.04, 0.08, 0.6, 0.16, 0.08, 0.04], sal: 2, antiCats: [0, 5] },
      AES: { kind: "categorical", probs: [0.06, 0.05, 0.62, 0.17, 0.03, 0.07], sal: 2 }
    }
  },
  {
    id: "046",
    name: "Pastoral Leftist",
    tier: "T1",
    prior: 1 / 130,
    nodes: {
      MAT: { kind: "continuous", pos: 2, sal: 2 },
      CD: { kind: "continuous", pos: 4, sal: 2 },
      CU: { kind: "continuous", pos: 2, sal: 2 },
      MOR: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      PRO: { kind: "continuous", pos: 3, sal: 1 },
      COM: { kind: "continuous", pos: 3, sal: 1 },
      ZS: { kind: "continuous", pos: 2, sal: 2 },
      ONT_H: { kind: "continuous", pos: 4, sal: 2 },
      ONT_S: { kind: "continuous", pos: 3, sal: 1 },
      PF: { kind: "continuous", pos: 2, sal: 2 },
      TRB: { kind: "continuous", pos: 2, sal: 2 },
      ENG: { kind: "continuous", pos: 2, sal: 2 },
      EPS: { kind: "categorical", probs: [0.04, 0.08, 0.6, 0.16, 0.08, 0.04], sal: 2, antiCats: [0, 5] },
      AES: { kind: "categorical", probs: [0.06, 0.05, 0.62, 0.17, 0.03, 0.07], sal: 2 }
    }
  },
  {
    id: "047",
    name: "Common-Life Reformer",
    tier: "T1",
    prior: 1 / 130,
    nodes: {
      MAT: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      CD: { kind: "continuous", pos: 3, sal: 1 },
      CU: { kind: "continuous", pos: 2, sal: 1 },
      MOR: { kind: "continuous", pos: 3, sal: 2 },
      PRO: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      COM: { kind: "continuous", pos: 3, sal: 1 },
      ZS: { kind: "continuous", pos: 2, sal: 1 },
      ONT_H: { kind: "continuous", pos: 3, sal: 1 },
      ONT_S: { kind: "continuous", pos: 3, sal: 1 },
      PF: { kind: "continuous", pos: 2, sal: 1 },
      TRB: { kind: "continuous", pos: 2, sal: 1 },
      ENG: { kind: "continuous", pos: 4, sal: 1 },
      EPS: { kind: "categorical", probs: [0.04, 0.08, 0.6, 0.16, 0.08, 0.04], sal: 2, antiCats: [0, 5] },
      AES: { kind: "categorical", probs: [0.6, 0.1, 0.14, 0.06, 0.04, 0.06], sal: 2, antiCats: [4] }
    }
  },
  {
    id: "048",
    name: "Solidaristic Localist",
    tier: "T1",
    prior: 1 / 130,
    nodes: {
      MAT: { kind: "continuous", pos: 2, sal: 2 },
      CD: { kind: "continuous", pos: 2, sal: 1 },
      CU: { kind: "continuous", pos: 2, sal: 2 },
      MOR: { kind: "continuous", pos: 3, sal: 1 },
      PRO: { kind: "continuous", pos: 3, sal: 1 },
      COM: { kind: "continuous", pos: 4, sal: 1 },
      ZS: { kind: "continuous", pos: 2, sal: 1 },
      ONT_H: { kind: "continuous", pos: 3, sal: 1 },
      ONT_S: { kind: "continuous", pos: 3, sal: 1 },
      PF: { kind: "continuous", pos: 2, sal: 1 },
      TRB: { kind: "continuous", pos: 4, sal: 2 },
      ENG: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      EPS: { kind: "categorical", probs: [0.04, 0.08, 0.6, 0.16, 0.08, 0.04], sal: 2, antiCats: [0, 5] },
      AES: { kind: "categorical", probs: [0.06, 0.05, 0.62, 0.17, 0.03, 0.07], sal: 2 }
    }
  },
  {
    id: "049",
    name: "Paternal Egalitarian",
    tier: "T1",
    prior: 1 / 130,
    nodes: {
      MAT: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      CD: { kind: "continuous", pos: 4, sal: 1 },
      CU: { kind: "continuous", pos: 2, sal: 1 },
      MOR: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      PRO: { kind: "continuous", pos: 4, sal: 1 },
      COM: { kind: "continuous", pos: 3, sal: 1 },
      ZS: { kind: "continuous", pos: 2, sal: 1 },
      ONT_H: { kind: "continuous", pos: 3, sal: 1 },
      ONT_S: { kind: "continuous", pos: 4, sal: 1 },
      PF: { kind: "continuous", pos: 2, sal: 1 },
      TRB: { kind: "continuous", pos: 2, sal: 1 },
      ENG: { kind: "continuous", pos: 3, sal: 1 },
      EPS: { kind: "categorical", probs: [0.04, 0.08, 0.6, 0.16, 0.08, 0.04], sal: 2, antiCats: [0, 5] },
      AES: { kind: "categorical", probs: [0.06, 0.05, 0.62, 0.17, 0.03, 0.07], sal: 2 }
    }
  },
  {
    id: "050",
    name: "Religious Leftist",
    tier: "T1",
    prior: 1 / 130,
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
      PF: { kind: "continuous", pos: 2, sal: 1 },
      TRB: { kind: "continuous", pos: 2, sal: 1 },
      ENG: { kind: "continuous", pos: 3, sal: 1 },
      EPS: { kind: "categorical", probs: [0.04, 0.08, 0.6, 0.16, 0.08, 0.04], sal: 2, antiCats: [0, 5] },
      AES: { kind: "categorical", probs: [0.06, 0.05, 0.62, 0.17, 0.03, 0.07], sal: 2 }
    }
  },
  {
    id: "051",
    name: "Ecological Localist",
    tier: "T1",
    prior: 1 / 130,
    nodes: {
      MAT: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      CD: { kind: "continuous", pos: 3, sal: 1 },
      CU: { kind: "continuous", pos: 3, sal: 2 },
      MOR: { kind: "continuous", pos: 3, sal: 2 },
      PRO: { kind: "continuous", pos: 3, sal: 1 },
      COM: { kind: "continuous", pos: 3, sal: 1 },
      ZS: { kind: "continuous", pos: 2, sal: 1 },
      ONT_H: { kind: "continuous", pos: 4, sal: 1 },
      ONT_S: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      PF: { kind: "continuous", pos: 2, sal: 1 },
      TRB: { kind: "continuous", pos: 2, sal: 1 },
      ENG: { kind: "continuous", pos: 3, sal: 1 },
      EPS: { kind: "categorical", probs: [0.04, 0.08, 0.6, 0.16, 0.08, 0.04], sal: 2, antiCats: [0, 5] },
      AES: { kind: "categorical", probs: [0.06, 0.05, 0.62, 0.17, 0.03, 0.07], sal: 2 }
    }
  },
  {
    id: "052",
    name: "Distributist Localist",
    tier: "T1",
    prior: 1 / 130,
    nodes: {
      MAT: { kind: "continuous", pos: 1, sal: 3, anti: "high" },
      CD: { kind: "continuous", pos: 5, sal: 3, anti: "low" },
      CU: { kind: "continuous", pos: 2, sal: 3, anti: "high" },
      MOR: { kind: "continuous", pos: 3, sal: 3, anti: "low" },
      PRO: { kind: "continuous", pos: 4, sal: 2 },
      COM: { kind: "continuous", pos: 5, sal: 2 },
      ZS: { kind: "continuous", pos: 2, sal: 2, anti: "high" },
      ONT_H: { kind: "continuous", pos: 3, sal: 3 },
      ONT_S: { kind: "continuous", pos: 3, sal: 1 },
      PF: { kind: "continuous", pos: 3, sal: 2 },
      TRB: { kind: "continuous", pos: 2, sal: 2 },
      ENG: { kind: "continuous", pos: 3, sal: 1 },
      EPS: { kind: "categorical", probs: [0.25, 0.58, 0.05, 0.03, 0.06, 0.03], sal: 3, antiCats: [5] },
      AES: { kind: "categorical", probs: [0.06, 0.05, 0.62, 0.17, 0.03, 0.07], sal: 2 }
    }
  },
  {
    id: "053",
    name: "Consensus Builder",
    tier: "T1",
    prior: 1 / 130,
    nodes: {
      MAT: { kind: "continuous", pos: 3, sal: 2 },
      CD: { kind: "continuous", pos: 3, sal: 2 },
      CU: { kind: "continuous", pos: 3, sal: 2 },
      MOR: { kind: "continuous", pos: 3, sal: 2 },
      PRO: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      COM: { kind: "continuous", pos: 5, sal: 3, anti: "low" },
      ZS: { kind: "continuous", pos: 2, sal: 2 },
      ONT_H: { kind: "continuous", pos: 4, sal: 2 },
      ONT_S: { kind: "continuous", pos: 2, sal: 2 },
      PF: { kind: "continuous", pos: 3, sal: 1 },
      TRB: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      ENG: { kind: "continuous", pos: 3, sal: 1 },
      EPS: { kind: "categorical", probs: [0.25, 0.58, 0.05, 0.03, 0.06, 0.03], sal: 3, antiCats: [5] },
      AES: { kind: "categorical", probs: [0.6, 0.2, 0.04, 0.06, 0.04, 0.06], sal: 3, antiCats: [4] }
    }
  },
  {
    id: "054",
    name: "Arbiter Moderate",
    tier: "T1",
    prior: 1 / 130,
    nodes: {
      MAT: { kind: "continuous", pos: 3, sal: 2 },
      CD: { kind: "continuous", pos: 3, sal: 2 },
      CU: { kind: "continuous", pos: 4, sal: 1 },
      MOR: { kind: "continuous", pos: 4, sal: 3, anti: "low" },
      PRO: { kind: "continuous", pos: 5, sal: 3, anti: "low" },
      COM: { kind: "continuous", pos: 4, sal: 3 },
      // Fixed: Moderate = high compromise
      ZS: { kind: "continuous", pos: 1, sal: 2 },
      ONT_H: { kind: "continuous", pos: 5, sal: 3, anti: "low" },
      ONT_S: { kind: "continuous", pos: 2, sal: 2 },
      PF: { kind: "continuous", pos: 3, sal: 1 },
      TRB: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      ENG: { kind: "continuous", pos: 3, sal: 2, anti: "high" },
      EPS: { kind: "categorical", probs: [0.25, 0.58, 0.05, 0.03, 0.06, 0.03], sal: 2, antiCats: [5] },
      AES: { kind: "categorical", probs: [0.08, 0.64, 0.04, 0.04, 0.03, 0.17], sal: 3, antiCats: [4] }
    }
  },
  {
    id: "055",
    name: "Halifax Moderate",
    tier: "T1",
    prior: 1 / 130,
    nodes: {
      MAT: { kind: "continuous", pos: 3, sal: 1 },
      CD: { kind: "continuous", pos: 3, sal: 1 },
      CU: { kind: "continuous", pos: 2, sal: 1 },
      MOR: { kind: "continuous", pos: 3, sal: 2 },
      PRO: { kind: "continuous", pos: 4, sal: 2 },
      COM: { kind: "continuous", pos: 3, sal: 1 },
      ZS: { kind: "continuous", pos: 2, sal: 2, anti: "high" },
      ONT_H: { kind: "continuous", pos: 4, sal: 2, anti: "low" },
      ONT_S: { kind: "continuous", pos: 4, sal: 2 },
      PF: { kind: "continuous", pos: 4, sal: 1 },
      TRB: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      ENG: { kind: "continuous", pos: 3, sal: 2 },
      EPS: { kind: "categorical", probs: [0.04, 0.18, 0.6, 0.06, 0.08, 0.04], sal: 2, antiCats: [0, 5] },
      AES: { kind: "categorical", probs: [0.6, 0.2, 0.04, 0.06, 0.04, 0.06], sal: 2, antiCats: [4] }
    }
  },
  {
    id: "056",
    name: "Institutional Centrist",
    tier: "T1",
    prior: 1 / 130,
    nodes: {
      MAT: { kind: "continuous", pos: 2, sal: 2 },
      CD: { kind: "continuous", pos: 4, sal: 2 },
      CU: { kind: "continuous", pos: 5, sal: 3, anti: "low" },
      MOR: { kind: "continuous", pos: 4, sal: 3 },
      PRO: { kind: "continuous", pos: 3, sal: 2, anti: "low" },
      COM: { kind: "continuous", pos: 4, sal: 2 },
      ZS: { kind: "continuous", pos: 2, sal: 3, anti: "high" },
      ONT_H: { kind: "continuous", pos: 4, sal: 2 },
      ONT_S: { kind: "continuous", pos: 2, sal: 3, anti: "high" },
      PF: { kind: "continuous", pos: 3, sal: 2 },
      TRB: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      ENG: { kind: "continuous", pos: 4, sal: 2 },
      EPS: { kind: "categorical", probs: [0.25, 0.58, 0.05, 0.03, 0.06, 0.03], sal: 3, antiCats: [5] },
      AES: { kind: "categorical", probs: [0.6, 0.2, 0.04, 0.06, 0.04, 0.06], sal: 3, antiCats: [4] }
    }
  },
  {
    id: "057",
    name: "Temperate Pluralist",
    tier: "T1",
    prior: 1 / 130,
    nodes: {
      MAT: { kind: "continuous", pos: 3, sal: 1 },
      CD: { kind: "continuous", pos: 2, sal: 2 },
      CU: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      MOR: { kind: "continuous", pos: 4, sal: 2 },
      PRO: { kind: "continuous", pos: 4, sal: 2 },
      COM: { kind: "continuous", pos: 4, sal: 2 },
      ZS: { kind: "continuous", pos: 2, sal: 2 },
      ONT_H: { kind: "continuous", pos: 4, sal: 2 },
      ONT_S: { kind: "continuous", pos: 2, sal: 2 },
      PF: { kind: "continuous", pos: 3, sal: 1 },
      TRB: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      ENG: { kind: "continuous", pos: 2, sal: 2 },
      EPS: { kind: "categorical", probs: [0.25, 0.58, 0.05, 0.03, 0.06, 0.03], sal: 2, antiCats: [5] },
      AES: { kind: "categorical", probs: [0.6, 0.2, 0.04, 0.06, 0.04, 0.06], sal: 2, antiCats: [4] }
    }
  },
  {
    id: "059",
    name: "Public-Minded Moderate",
    tier: "T1",
    prior: 1 / 130,
    nodes: {
      MAT: { kind: "continuous", pos: 3, sal: 2 },
      CD: { kind: "continuous", pos: 3, sal: 1 },
      CU: { kind: "continuous", pos: 3, sal: 2 },
      MOR: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      PRO: { kind: "continuous", pos: 4, sal: 2 },
      COM: { kind: "continuous", pos: 4, sal: 2 },
      ZS: { kind: "continuous", pos: 2, sal: 2 },
      ONT_H: { kind: "continuous", pos: 2, sal: 1 },
      ONT_S: { kind: "continuous", pos: 2, sal: 1 },
      PF: { kind: "continuous", pos: 3, sal: 0 },
      TRB: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      ENG: { kind: "continuous", pos: 3, sal: 2 },
      EPS: { kind: "categorical", probs: [0.25, 0.58, 0.05, 0.03, 0.06, 0.03], sal: 2, antiCats: [5] },
      AES: { kind: "categorical", probs: [0.6, 0.2, 0.04, 0.06, 0.04, 0.06], sal: 2, antiCats: [4] }
    }
  },
  {
    id: "060",
    name: "Hinge Citizen",
    tier: "T1",
    prior: 1 / 130,
    nodes: {
      MAT: { kind: "continuous", pos: 3, sal: 2 },
      CD: { kind: "continuous", pos: 3, sal: 1 },
      CU: { kind: "continuous", pos: 3, sal: 3 },
      MOR: { kind: "continuous", pos: 3, sal: 2, anti: "high" },
      PRO: { kind: "continuous", pos: 3, sal: 2, anti: "high" },
      COM: { kind: "continuous", pos: 3, sal: 2, anti: "low" },
      ZS: { kind: "continuous", pos: 2, sal: 1 },
      ONT_H: { kind: "continuous", pos: 4, sal: 2, anti: "low" },
      ONT_S: { kind: "continuous", pos: 3, sal: 1 },
      PF: { kind: "continuous", pos: 4, sal: 2, anti: "high" },
      TRB: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      ENG: { kind: "continuous", pos: 3, sal: 2, anti: "high" },
      EPS: { kind: "categorical", probs: [0.25, 0.58, 0.05, 0.03, 0.06, 0.03], sal: 3, antiCats: [5] },
      AES: { kind: "categorical", probs: [0.6, 0.2, 0.04, 0.06, 0.04, 0.06], sal: 3, antiCats: [4] }
    }
  },
  {
    id: "061",
    name: "Millian Liberal",
    tier: "T1",
    prior: 1 / 130,
    nodes: {
      MAT: { kind: "continuous", pos: 5, sal: 2 },
      CD: { kind: "continuous", pos: 2, sal: 2 },
      CU: { kind: "continuous", pos: 4, sal: 3, anti: "low" },
      MOR: { kind: "continuous", pos: 4, sal: 2 },
      PRO: { kind: "continuous", pos: 2, sal: 2 },
      COM: { kind: "continuous", pos: 3, sal: 3, anti: "low" },
      ZS: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      ONT_H: { kind: "continuous", pos: 5, sal: 3, anti: "low" },
      ONT_S: { kind: "continuous", pos: 2, sal: 2 },
      PF: { kind: "continuous", pos: 3, sal: 2 },
      TRB: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      ENG: { kind: "continuous", pos: 3, sal: 2, anti: "high" },
      EPS: { kind: "categorical", probs: [0.08, 0.08, 0.08, 0.1, 0.6, 0.06], sal: 3, antiCats: [2, 5] },
      AES: { kind: "categorical", probs: [0.08, 0.64, 0.04, 0.04, 0.03, 0.17], sal: 3, antiCats: [4] }
    }
  },
  {
    id: "062",
    name: "Meritocratic Liberal",
    tier: "T1",
    prior: 1 / 130,
    nodes: {
      MAT: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      CD: { kind: "continuous", pos: 2, sal: 1 },
      CU: { kind: "continuous", pos: 3, sal: 1 },
      MOR: { kind: "continuous", pos: 3, sal: 1 },
      PRO: { kind: "continuous", pos: 5, sal: 3, anti: "low" },
      COM: { kind: "continuous", pos: 4, sal: 1 },
      ZS: { kind: "continuous", pos: 2, sal: 2 },
      ONT_H: { kind: "continuous", pos: 4, sal: 1, anti: "low" },
      ONT_S: { kind: "continuous", pos: 2, sal: 1 },
      PF: { kind: "continuous", pos: 3, sal: 1 },
      TRB: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      ENG: { kind: "continuous", pos: 3, sal: 1 },
      EPS: { kind: "categorical", probs: [0.62, 0.24, 0.03, 0.04, 0.03, 0.04], sal: 2, antiCats: [2, 3, 5] },
      AES: { kind: "categorical", probs: [0.08, 0.64, 0.04, 0.04, 0.03, 0.17], sal: 2, antiCats: [4] }
    }
  },
  {
    id: "063",
    name: "Enterprise Pluralist",
    tier: "T1",
    prior: 1 / 130,
    nodes: {
      MAT: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      CD: { kind: "continuous", pos: 3, sal: 1 },
      CU: { kind: "continuous", pos: 3, sal: 2 },
      MOR: { kind: "continuous", pos: 4, sal: 1 },
      PRO: { kind: "continuous", pos: 3, sal: 1 },
      COM: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      ZS: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      ONT_H: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      ONT_S: { kind: "continuous", pos: 2, sal: 1 },
      PF: { kind: "continuous", pos: 3, sal: 1 },
      TRB: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      ENG: { kind: "continuous", pos: 4, sal: 1 },
      EPS: { kind: "categorical", probs: [0.62, 0.14, 0.03, 0.04, 0.15, 0.02], sal: 2, antiCats: [2, 3, 5] },
      AES: { kind: "categorical", probs: [0.06, 0.18, 0.05, 0.06, 0.08, 0.57], sal: 2 }
    }
  },
  {
    id: "064",
    name: "Market Optimist",
    tier: "T1",
    prior: 1 / 130,
    nodes: {
      MAT: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      CD: { kind: "continuous", pos: 2, sal: 2 },
      CU: { kind: "continuous", pos: 4, sal: 2 },
      MOR: { kind: "continuous", pos: 2, sal: 2 },
      PRO: { kind: "continuous", pos: 3, sal: 2 },
      COM: { kind: "continuous", pos: 4, sal: 2 },
      ZS: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      ONT_H: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      ONT_S: { kind: "continuous", pos: 2, sal: 2 },
      PF: { kind: "continuous", pos: 3, sal: 2 },
      TRB: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      ENG: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      EPS: { kind: "categorical", probs: [0.62, 0.14, 0.03, 0.04, 0.15, 0.02], sal: 2, antiCats: [2, 3, 5] },
      AES: { kind: "categorical", probs: [0.06, 0.18, 0.05, 0.06, 0.08, 0.57], sal: 2 }
    }
  },
  {
    id: "065",
    name: "Opportunity Liberal",
    tier: "T1",
    prior: 1 / 130,
    nodes: {
      MAT: { kind: "continuous", pos: 3, sal: 3, anti: "low" },
      CD: { kind: "continuous", pos: 2, sal: 2 },
      CU: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      MOR: { kind: "continuous", pos: 5, sal: 2 },
      PRO: { kind: "continuous", pos: 1, sal: 3, anti: "high" },
      COM: { kind: "continuous", pos: 3, sal: 2 },
      ZS: { kind: "continuous", pos: 1, sal: 3, anti: "high" },
      ONT_H: { kind: "continuous", pos: 5, sal: 3, anti: "low" },
      ONT_S: { kind: "continuous", pos: 2, sal: 2 },
      PF: { kind: "continuous", pos: 3, sal: 1 },
      TRB: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      ENG: { kind: "continuous", pos: 4, sal: 2 },
      EPS: { kind: "categorical", probs: [0.62, 0.24, 0.03, 0.04, 0.03, 0.04], sal: 2, antiCats: [2, 3, 5] },
      AES: { kind: "categorical", probs: [0.06, 0.18, 0.05, 0.06, 0.08, 0.57], sal: 3 }
    }
  },
  {
    id: "067",
    name: "Free-Exchange Modernist",
    tier: "T1",
    prior: 1 / 130,
    nodes: {
      MAT: { kind: "continuous", pos: 5, sal: 3, anti: "low" },
      CD: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      CU: { kind: "continuous", pos: 5, sal: 3, anti: "low" },
      MOR: { kind: "continuous", pos: 4, sal: 2 },
      PRO: { kind: "continuous", pos: 1, sal: 3, anti: "high" },
      COM: { kind: "continuous", pos: 3, sal: 2 },
      ZS: { kind: "continuous", pos: 1, sal: 3, anti: "high" },
      ONT_H: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      ONT_S: { kind: "continuous", pos: 1, sal: 2 },
      PF: { kind: "continuous", pos: 3, sal: 2 },
      TRB: { kind: "continuous", pos: 1, sal: 3, anti: "high" },
      ENG: { kind: "continuous", pos: 3, sal: 1 },
      EPS: { kind: "categorical", probs: [0.62, 0.14, 0.03, 0.04, 0.15, 0.02], sal: 3, antiCats: [2, 3, 5] },
      AES: { kind: "categorical", probs: [0.06, 0.18, 0.05, 0.06, 0.08, 0.57], sal: 3 }
    }
  },
  {
    id: "069",
    name: "Bleeding-Heart Libertarian",
    tier: "T1",
    prior: 1 / 130,
    nodes: {
      MAT: { kind: "continuous", pos: 4, sal: 2, anti: "low" },
      CD: { kind: "continuous", pos: 2, sal: 2 },
      CU: { kind: "continuous", pos: 4, sal: 2, anti: "low" },
      MOR: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      PRO: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      COM: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      ZS: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      ONT_H: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      ONT_S: { kind: "continuous", pos: 2, sal: 2 },
      PF: { kind: "continuous", pos: 3, sal: 1 },
      TRB: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      ENG: { kind: "continuous", pos: 3, sal: 1 },
      EPS: { kind: "categorical", probs: [0.62, 0.14, 0.03, 0.08, 0.11, 0.02], sal: 2, antiCats: [2, 3, 5] },
      AES: { kind: "categorical", probs: [0.05, 0.05, 0.08, 0.7, 0.05, 0.07], sal: 2 }
    }
  },
  {
    id: "070",
    name: "Burkean Steward",
    tier: "T1",
    prior: 1 / 130,
    nodes: {
      MAT: { kind: "continuous", pos: 4, sal: 2, anti: "low" },
      CD: { kind: "continuous", pos: 4, sal: 2 },
      CU: { kind: "continuous", pos: 2, sal: 2, anti: "high" },
      MOR: { kind: "continuous", pos: 2, sal: 3 },
      PRO: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      COM: { kind: "continuous", pos: 3, sal: 1 },
      ZS: { kind: "continuous", pos: 3, sal: 1, anti: "low" },
      ONT_H: { kind: "continuous", pos: 3, sal: 2, anti: "low" },
      ONT_S: { kind: "continuous", pos: 3, sal: 2 },
      PF: { kind: "continuous", pos: 4, sal: 1 },
      TRB: { kind: "continuous", pos: 2, sal: 2 },
      ENG: { kind: "continuous", pos: 4, sal: 1 },
      EPS: { kind: "categorical", probs: [0.1, 0.58, 0.15, 0.05, 0.06, 0.06], sal: 2, antiCats: [5] },
      AES: { kind: "categorical", probs: [0.6, 0.1, 0.14, 0.06, 0.04, 0.06], sal: 2, antiCats: [4] }
    }
  },
  {
    id: "071",
    name: "Constitutional Conservative",
    tier: "T1",
    prior: 1 / 130,
    nodes: {
      MAT: { kind: "continuous", pos: 4, sal: 2, anti: "low" },
      CD: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      CU: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      MOR: { kind: "continuous", pos: 3, sal: 1 },
      PRO: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      COM: { kind: "continuous", pos: 2, sal: 2 },
      ZS: { kind: "continuous", pos: 3, sal: 1, anti: "low" },
      ONT_H: { kind: "continuous", pos: 3, sal: 1 },
      ONT_S: { kind: "continuous", pos: 3, sal: 1 },
      PF: { kind: "continuous", pos: 4, sal: 2 },
      TRB: { kind: "continuous", pos: 2, sal: 2 },
      ENG: { kind: "continuous", pos: 4, sal: 2 },
      EPS: { kind: "categorical", probs: [0.1, 0.58, 0.15, 0.05, 0.06, 0.06], sal: 2, antiCats: [5] },
      AES: { kind: "categorical", probs: [0.6, 0.1, 0.14, 0.06, 0.04, 0.06], sal: 2, antiCats: [4] }
    }
  },
  {
    id: "072",
    name: "Blackstone Conservative",
    tier: "T1",
    prior: 1 / 130,
    nodes: {
      MAT: { kind: "continuous", pos: 4, sal: 2, anti: "low" },
      CD: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      CU: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      MOR: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      PRO: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      COM: { kind: "continuous", pos: 3, sal: 1 },
      ZS: { kind: "continuous", pos: 3, sal: 1 },
      ONT_H: { kind: "continuous", pos: 3, sal: 1 },
      ONT_S: { kind: "continuous", pos: 4, sal: 1 },
      PF: { kind: "continuous", pos: 3, sal: 0 },
      TRB: { kind: "continuous", pos: 2, sal: 1 },
      ENG: { kind: "continuous", pos: 4, sal: 1 },
      EPS: { kind: "categorical", probs: [0.1, 0.58, 0.15, 0.05, 0.06, 0.06], sal: 2, antiCats: [5] },
      AES: { kind: "categorical", probs: [0.6, 0.1, 0.14, 0.06, 0.04, 0.06], sal: 2, antiCats: [4] }
    }
  },
  {
    id: "073",
    name: "Civic Traditionalist",
    tier: "T1",
    prior: 1 / 130,
    nodes: {
      MAT: { kind: "continuous", pos: 4, sal: 2 },
      CD: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      CU: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      MOR: { kind: "continuous", pos: 4, sal: 1 },
      PRO: { kind: "continuous", pos: 3, sal: 2, anti: "low" },
      COM: { kind: "continuous", pos: 4, sal: 1 },
      ZS: { kind: "continuous", pos: 3, sal: 1 },
      ONT_H: { kind: "continuous", pos: 3, sal: 1 },
      ONT_S: { kind: "continuous", pos: 3, sal: 1 },
      PF: { kind: "continuous", pos: 4, sal: 1 },
      TRB: { kind: "continuous", pos: 2, sal: 1 },
      ENG: { kind: "continuous", pos: 4, sal: 1 },
      EPS: { kind: "categorical", probs: [0.1, 0.58, 0.15, 0.05, 0.06, 0.06], sal: 2, antiCats: [5] },
      AES: { kind: "categorical", probs: [0.6, 0.1, 0.14, 0.06, 0.04, 0.06], sal: 2, antiCats: [4] }
    }
  },
  {
    id: "074",
    name: "Responsible Conservative",
    tier: "T1",
    prior: 1 / 130,
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
      PF: { kind: "continuous", pos: 4, sal: 1, anti: "high" },
      TRB: { kind: "continuous", pos: 2, sal: 1, anti: "high" },
      ENG: { kind: "continuous", pos: 3, sal: 1 },
      EPS: { kind: "categorical", probs: [0.1, 0.58, 0.15, 0.05, 0.06, 0.06], sal: 3, antiCats: [5] },
      AES: { kind: "categorical", probs: [0.6, 0.1, 0.14, 0.06, 0.04, 0.06], sal: 3, antiCats: [4] }
    }
  },
  {
    id: "075",
    name: "Institutional Conservative",
    tier: "T1",
    prior: 1 / 130,
    nodes: {
      MAT: { kind: "continuous", pos: 4, sal: 2 },
      CD: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      CU: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      MOR: { kind: "continuous", pos: 2, sal: 2 },
      PRO: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      COM: { kind: "continuous", pos: 3, sal: 1 },
      ZS: { kind: "continuous", pos: 4, sal: 2 },
      ONT_H: { kind: "continuous", pos: 3, sal: 1 },
      ONT_S: { kind: "continuous", pos: 4, sal: 1 },
      PF: { kind: "continuous", pos: 4, sal: 2 },
      TRB: { kind: "continuous", pos: 2, sal: 2 },
      ENG: { kind: "continuous", pos: 4, sal: 1 },
      EPS: { kind: "categorical", probs: [0.1, 0.58, 0.15, 0.05, 0.06, 0.06], sal: 2, antiCats: [5] },
      AES: { kind: "categorical", probs: [0.6, 0.1, 0.14, 0.06, 0.04, 0.06], sal: 2, antiCats: [4] }
    }
  },
  {
    id: "076",
    name: "Fiscal Gradualist",
    tier: "T1",
    prior: 1 / 130,
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
      PF: { kind: "continuous", pos: 4, sal: 1, anti: "high" },
      TRB: { kind: "continuous", pos: 2, sal: 1, anti: "high" },
      ENG: { kind: "continuous", pos: 4, sal: 1 },
      EPS: { kind: "categorical", probs: [0.1, 0.58, 0.15, 0.05, 0.06, 0.06], sal: 2, antiCats: [5] },
      AES: { kind: "categorical", probs: [0.6, 0.1, 0.14, 0.06, 0.04, 0.06], sal: 2, antiCats: [4] }
    }
  },
  {
    id: "077",
    name: "Ordered Libertarian",
    tier: "T1",
    prior: 1 / 130,
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
      PF: { kind: "continuous", pos: 4, sal: 1 },
      TRB: { kind: "continuous", pos: 2, sal: 1 },
      ENG: { kind: "continuous", pos: 4, sal: 1 },
      EPS: { kind: "categorical", probs: [0.1, 0.58, 0.15, 0.05, 0.06, 0.06], sal: 2, antiCats: [5] },
      AES: { kind: "categorical", probs: [0.6, 0.1, 0.14, 0.06, 0.04, 0.06], sal: 2, antiCats: [4] }
    }
  },
  {
    id: "078",
    name: "Meritocratic Conservative",
    tier: "T1",
    prior: 1 / 130,
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
      PF: { kind: "continuous", pos: 4, sal: 1 },
      TRB: { kind: "continuous", pos: 2, sal: 1, anti: "high" },
      ENG: { kind: "continuous", pos: 4, sal: 1 },
      EPS: { kind: "categorical", probs: [0.1, 0.58, 0.15, 0.05, 0.06, 0.06], sal: 2, antiCats: [5] },
      AES: { kind: "categorical", probs: [0.6, 0.1, 0.14, 0.06, 0.04, 0.06], sal: 2, antiCats: [4] }
    }
  },
  {
    id: "079",
    name: "National Developmentalist",
    tier: "T1",
    prior: 1 / 130,
    nodes: {
      MAT: { kind: "continuous", pos: 4, sal: 2, anti: "low" },
      CD: { kind: "continuous", pos: 4, sal: 1 },
      CU: { kind: "continuous", pos: 2, sal: 1 },
      MOR: { kind: "continuous", pos: 2, sal: 1 },
      PRO: { kind: "continuous", pos: 4, sal: 1 },
      COM: { kind: "continuous", pos: 4, sal: 1 },
      ZS: { kind: "continuous", pos: 4, sal: 1 },
      ONT_H: { kind: "continuous", pos: 3, sal: 1 },
      ONT_S: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      PF: { kind: "continuous", pos: 4, sal: 1 },
      TRB: { kind: "continuous", pos: 3, sal: 1 },
      ENG: { kind: "continuous", pos: 4, sal: 1 },
      EPS: { kind: "categorical", probs: [0.1, 0.58, 0.15, 0.05, 0.06, 0.06], sal: 2, antiCats: [5] },
      AES: { kind: "categorical", probs: [0.6, 0.1, 0.14, 0.06, 0.04, 0.06], sal: 2, antiCats: [4] }
    }
  },
  {
    id: "080",
    name: "Chestertonian Traditionalist",
    tier: "T1",
    prior: 1 / 130,
    nodes: {
      MAT: { kind: "continuous", pos: 3, sal: 1 },
      CD: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      CU: { kind: "continuous", pos: 2, sal: 2 },
      MOR: { kind: "continuous", pos: 2, sal: 2 },
      PRO: { kind: "continuous", pos: 4, sal: 2 },
      COM: { kind: "continuous", pos: 3, sal: 1 },
      ZS: { kind: "continuous", pos: 3, sal: 1 },
      ONT_H: { kind: "continuous", pos: 2, sal: 1 },
      ONT_S: { kind: "continuous", pos: 4, sal: 1 },
      PF: { kind: "continuous", pos: 4, sal: 1 },
      TRB: { kind: "continuous", pos: 3, sal: 2 },
      ENG: { kind: "continuous", pos: 3, sal: 1 },
      EPS: { kind: "categorical", probs: [0.04, 0.18, 0.6, 0.06, 0.08, 0.04], sal: 2, antiCats: [0, 5] },
      AES: { kind: "categorical", probs: [0.6, 0.1, 0.14, 0.06, 0.04, 0.06], sal: 2, antiCats: [4] }
    }
  },
  {
    id: "081",
    name: "Heritage Guardian",
    tier: "T1",
    prior: 1 / 130,
    nodes: {
      MAT: { kind: "continuous", pos: 4, sal: 1 },
      CD: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      CU: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      MOR: { kind: "continuous", pos: 2, sal: 2 },
      PRO: { kind: "continuous", pos: 3, sal: 1 },
      COM: { kind: "continuous", pos: 2, sal: 1 },
      ZS: { kind: "continuous", pos: 4, sal: 1 },
      ONT_H: { kind: "continuous", pos: 2, sal: 1 },
      ONT_S: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      PF: { kind: "continuous", pos: 4, sal: 1 },
      TRB: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      ENG: { kind: "continuous", pos: 3, sal: 1 },
      EPS: { kind: "categorical", probs: [0.04, 0.18, 0.6, 0.06, 0.08, 0.04], sal: 2, antiCats: [0, 5] },
      AES: { kind: "categorical", probs: [0.16, 0.05, 0.62, 0.07, 0.03, 0.07], sal: 2 }
    }
  },
  {
    id: "082",
    name: "Altar-and-Hearth Conservative",
    tier: "T1",
    prior: 1 / 130,
    nodes: {
      MAT: { kind: "continuous", pos: 3, sal: 1 },
      CD: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      CU: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      MOR: { kind: "continuous", pos: 3, sal: 2 },
      PRO: { kind: "continuous", pos: 2, sal: 2 },
      COM: { kind: "continuous", pos: 2, sal: 2 },
      ZS: { kind: "continuous", pos: 3, sal: 1 },
      ONT_H: { kind: "continuous", pos: 2, sal: 1 },
      ONT_S: { kind: "continuous", pos: 4, sal: 1 },
      PF: { kind: "continuous", pos: 4, sal: 1 },
      TRB: { kind: "continuous", pos: 3, sal: 1 },
      ENG: { kind: "continuous", pos: 3, sal: 1 },
      EPS: { kind: "categorical", probs: [0.04, 0.18, 0.6, 0.06, 0.08, 0.04], sal: 2, antiCats: [0, 5] },
      AES: { kind: "categorical", probs: [0.16, 0.05, 0.62, 0.07, 0.03, 0.07], sal: 2 }
    }
  },
  {
    id: "083",
    name: "Sacred-Order Defender",
    tier: "T1",
    prior: 1 / 130,
    nodes: {
      MAT: { kind: "continuous", pos: 3, sal: 1 },
      CD: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      CU: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      MOR: { kind: "continuous", pos: 4, sal: 2 },
      PRO: { kind: "continuous", pos: 3, sal: 1 },
      COM: { kind: "continuous", pos: 2, sal: 1 },
      ZS: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      ONT_H: { kind: "continuous", pos: 2, sal: 1 },
      ONT_S: { kind: "continuous", pos: 4, sal: 1 },
      PF: { kind: "continuous", pos: 4, sal: 1 },
      TRB: { kind: "continuous", pos: 3, sal: 1 },
      ENG: { kind: "continuous", pos: 4, sal: 1 },
      EPS: { kind: "categorical", probs: [0.04, 0.18, 0.6, 0.06, 0.08, 0.04], sal: 2, antiCats: [0, 5] },
      AES: { kind: "categorical", probs: [0.16, 0.05, 0.62, 0.07, 0.03, 0.07], sal: 2 }
    }
  },
  {
    id: "084",
    name: "Civilizational Conservative",
    tier: "T1",
    prior: 1 / 130,
    nodes: {
      MAT: { kind: "continuous", pos: 3, sal: 1 },
      CD: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      CU: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      MOR: { kind: "continuous", pos: 3, sal: 2 },
      PRO: { kind: "continuous", pos: 3, sal: 1 },
      COM: { kind: "continuous", pos: 2, sal: 1 },
      ZS: { kind: "continuous", pos: 3, sal: 1 },
      ONT_H: { kind: "continuous", pos: 2, sal: 1 },
      ONT_S: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      PF: { kind: "continuous", pos: 4, sal: 1 },
      TRB: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      ENG: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      EPS: { kind: "categorical", probs: [0.04, 0.18, 0.6, 0.06, 0.08, 0.04], sal: 2, antiCats: [0, 5] },
      AES: { kind: "categorical", probs: [0.04, 0.03, 0.04, 0.18, 0.63, 0.08], sal: 2, antiCats: [0, 1] }
    }
  },
  {
    id: "085",
    name: "Customary Localist",
    tier: "T1",
    prior: 1 / 130,
    nodes: {
      MAT: { kind: "continuous", pos: 4, sal: 2 },
      CD: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      CU: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      MOR: { kind: "continuous", pos: 2, sal: 2 },
      PRO: { kind: "continuous", pos: 2, sal: 2 },
      COM: { kind: "continuous", pos: 2, sal: 2 },
      ZS: { kind: "continuous", pos: 3, sal: 1 },
      ONT_H: { kind: "continuous", pos: 3, sal: 1 },
      ONT_S: { kind: "continuous", pos: 4, sal: 2 },
      PF: { kind: "continuous", pos: 4, sal: 2 },
      TRB: { kind: "continuous", pos: 2, sal: 2 },
      ENG: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      EPS: { kind: "categorical", probs: [0.04, 0.18, 0.6, 0.06, 0.08, 0.04], sal: 2, antiCats: [0, 5] },
      AES: { kind: "categorical", probs: [0.16, 0.05, 0.62, 0.07, 0.03, 0.07], sal: 2 }
    }
  },
  {
    id: "086",
    name: "Duty Traditionalist",
    tier: "T1",
    prior: 1 / 130,
    nodes: {
      MAT: { kind: "continuous", pos: 3, sal: 1 },
      CD: { kind: "continuous", pos: 4, sal: 1 },
      CU: { kind: "continuous", pos: 2, sal: 2 },
      MOR: { kind: "continuous", pos: 3, sal: 2 },
      PRO: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      COM: { kind: "continuous", pos: 2, sal: 1 },
      ZS: { kind: "continuous", pos: 3, sal: 1 },
      ONT_H: { kind: "continuous", pos: 2, sal: 1 },
      ONT_S: { kind: "continuous", pos: 4, sal: 1 },
      PF: { kind: "continuous", pos: 4, sal: 1 },
      TRB: { kind: "continuous", pos: 3, sal: 1 },
      ENG: { kind: "continuous", pos: 4, sal: 1 },
      EPS: { kind: "categorical", probs: [0.04, 0.18, 0.6, 0.06, 0.08, 0.04], sal: 2, antiCats: [0, 5] },
      AES: { kind: "categorical", probs: [0.16, 0.05, 0.62, 0.07, 0.03, 0.07], sal: 2 }
    }
  },
  {
    id: "087",
    name: "Continuity Conservative",
    tier: "T1",
    prior: 1 / 130,
    nodes: {
      MAT: { kind: "continuous", pos: 3, sal: 2 },
      CD: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      CU: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      MOR: { kind: "continuous", pos: 2, sal: 2 },
      PRO: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      COM: { kind: "continuous", pos: 3, sal: 1 },
      ZS: { kind: "continuous", pos: 3, sal: 1 },
      ONT_H: { kind: "continuous", pos: 3, sal: 2 },
      ONT_S: { kind: "continuous", pos: 4, sal: 2 },
      PF: { kind: "continuous", pos: 4, sal: 1 },
      TRB: { kind: "continuous", pos: 3, sal: 0 },
      ENG: { kind: "continuous", pos: 3, sal: 1 },
      EPS: { kind: "categorical", probs: [0.04, 0.18, 0.6, 0.06, 0.08, 0.04], sal: 2, antiCats: [0, 5] },
      AES: { kind: "categorical", probs: [0.16, 0.05, 0.62, 0.07, 0.03, 0.07], sal: 2 }
    }
  },
  {
    id: "088",
    name: "Gentle Traditionalist",
    tier: "T1",
    prior: 1 / 130,
    nodes: {
      MAT: { kind: "continuous", pos: 3, sal: 2 },
      CD: { kind: "continuous", pos: 4, sal: 2, anti: "low" },
      CU: { kind: "continuous", pos: 2, sal: 2, anti: "high" },
      MOR: { kind: "continuous", pos: 2, sal: 2 },
      PRO: { kind: "continuous", pos: 3, sal: 2 },
      COM: { kind: "continuous", pos: 4, sal: 2, anti: "low" },
      ZS: { kind: "continuous", pos: 3, sal: 2 },
      ONT_H: { kind: "continuous", pos: 4, sal: 1 },
      ONT_S: { kind: "continuous", pos: 4, sal: 2, anti: "low" },
      PF: { kind: "continuous", pos: 4, sal: 1 },
      TRB: { kind: "continuous", pos: 2, sal: 1 },
      ENG: { kind: "continuous", pos: 2, sal: 1 },
      EPS: { kind: "categorical", probs: [0.04, 0.18, 0.6, 0.06, 0.08, 0.04], sal: 3, antiCats: [0, 5] },
      AES: { kind: "categorical", probs: [0.16, 0.05, 0.62, 0.07, 0.03, 0.07], sal: 3 }
    }
  },
  {
    id: "089",
    name: "Integral Traditionalist",
    tier: "T1",
    prior: 1 / 130,
    nodes: {
      MAT: { kind: "continuous", pos: 4, sal: 1 },
      CD: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      CU: { kind: "continuous", pos: 2, sal: 2 },
      MOR: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      PRO: { kind: "continuous", pos: 3, sal: 1 },
      COM: { kind: "continuous", pos: 2, sal: 1 },
      ZS: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      ONT_H: { kind: "continuous", pos: 2, sal: 1 },
      ONT_S: { kind: "continuous", pos: 4, sal: 1 },
      PF: { kind: "continuous", pos: 4, sal: 2 },
      TRB: { kind: "continuous", pos: 3, sal: 1 },
      ENG: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      EPS: { kind: "categorical", probs: [0.04, 0.18, 0.6, 0.06, 0.08, 0.04], sal: 2, antiCats: [0, 5] },
      AES: { kind: "categorical", probs: [0.6, 0.1, 0.14, 0.06, 0.04, 0.06], sal: 2, antiCats: [4] }
    }
  },
  {
    id: "090",
    name: "Hobbesian Guardian",
    tier: "T1",
    prior: 1 / 130,
    nodes: {
      MAT: { kind: "continuous", pos: 4, sal: 2 },
      CD: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      CU: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      MOR: { kind: "continuous", pos: 1, sal: 3, anti: "high" },
      PRO: { kind: "continuous", pos: 4, sal: 2 },
      COM: { kind: "continuous", pos: 2, sal: 2 },
      ZS: { kind: "continuous", pos: 5, sal: 3 },
      // Hobbesian: life is zero-sum, strong differentiator
      ONT_H: { kind: "continuous", pos: 1, sal: 3, anti: "high" },
      // Hobbesian: humans are NOT perfectible
      ONT_S: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      PF: { kind: "continuous", pos: 4, sal: 2 },
      TRB: { kind: "continuous", pos: 3, sal: 1 },
      ENG: { kind: "continuous", pos: 3, sal: 1 },
      EPS: { kind: "categorical", probs: [0.1, 0.58, 0.15, 0.05, 0.06, 0.06], sal: 2, antiCats: [5] },
      AES: { kind: "categorical", probs: [0.6, 0.1, 0.04, 0.06, 0.14, 0.06], sal: 2, antiCats: [4] }
    }
  },
  {
    id: "091",
    name: "Security Paternalist",
    tier: "T1",
    prior: 1 / 130,
    nodes: {
      MAT: { kind: "continuous", pos: 3, sal: 1 },
      CD: { kind: "continuous", pos: 4, sal: 1 },
      CU: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      MOR: { kind: "continuous", pos: 3, sal: 1 },
      PRO: { kind: "continuous", pos: 4, sal: 1 },
      COM: { kind: "continuous", pos: 3, sal: 1 },
      ZS: { kind: "continuous", pos: 4, sal: 2, anti: "low" },
      ONT_H: { kind: "continuous", pos: 3, sal: 1 },
      ONT_S: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      PF: { kind: "continuous", pos: 4, sal: 1 },
      TRB: { kind: "continuous", pos: 3, sal: 1 },
      ENG: { kind: "continuous", pos: 3, sal: 1 },
      EPS: { kind: "categorical", probs: [0.1, 0.58, 0.15, 0.05, 0.06, 0.06], sal: 2, antiCats: [5] },
      AES: { kind: "categorical", probs: [0.6, 0.1, 0.04, 0.06, 0.14, 0.06], sal: 2, antiCats: [4] }
    }
  },
  {
    id: "092",
    name: "Disciplined Majoritarian",
    tier: "T1",
    prior: 1 / 130,
    nodes: {
      MAT: { kind: "continuous", pos: 3, sal: 1 },
      CD: { kind: "continuous", pos: 4, sal: 1 },
      CU: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      MOR: { kind: "continuous", pos: 2, sal: 1 },
      PRO: { kind: "continuous", pos: 4, sal: 1 },
      COM: { kind: "continuous", pos: 2, sal: 1 },
      ZS: { kind: "continuous", pos: 4, sal: 1 },
      ONT_H: { kind: "continuous", pos: 2, sal: 1 },
      ONT_S: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      PF: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      TRB: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      ENG: { kind: "continuous", pos: 4, sal: 1 },
      EPS: { kind: "categorical", probs: [0.1, 0.58, 0.15, 0.05, 0.06, 0.06], sal: 2, antiCats: [5] },
      AES: { kind: "categorical", probs: [0.6, 0.1, 0.04, 0.06, 0.14, 0.06], sal: 2, antiCats: [4] }
    }
  },
  {
    id: "093",
    name: "Stability-First Voter",
    tier: "T1",
    prior: 1 / 130,
    nodes: {
      MAT: { kind: "continuous", pos: 3, sal: 1 },
      CD: { kind: "continuous", pos: 4, sal: 1 },
      CU: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      MOR: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      PRO: { kind: "continuous", pos: 3, sal: 1 },
      COM: { kind: "continuous", pos: 3, sal: 1 },
      ZS: { kind: "continuous", pos: 4, sal: 2 },
      ONT_H: { kind: "continuous", pos: 3, sal: 1 },
      ONT_S: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      PF: { kind: "continuous", pos: 4, sal: 1 },
      TRB: { kind: "continuous", pos: 3, sal: 1 },
      ENG: { kind: "continuous", pos: 3, sal: 1 },
      // Fixed: Voter = some engagement, removed anti
      EPS: { kind: "categorical", probs: [0.1, 0.58, 0.15, 0.05, 0.06, 0.06], sal: 2, antiCats: [5] },
      AES: { kind: "categorical", probs: [0.6, 0.1, 0.04, 0.06, 0.14, 0.06], sal: 2, antiCats: [4] }
    }
  },
  {
    id: "094",
    name: "Hard-State Manager",
    tier: "T1",
    prior: 1 / 130,
    nodes: {
      MAT: { kind: "continuous", pos: 3, sal: 2 },
      CD: { kind: "continuous", pos: 4, sal: 2 },
      CU: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      MOR: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      PRO: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      COM: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      ZS: { kind: "continuous", pos: 4, sal: 2 },
      ONT_H: { kind: "continuous", pos: 2, sal: 1 },
      ONT_S: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      PF: { kind: "continuous", pos: 4, sal: 1 },
      TRB: { kind: "continuous", pos: 3, sal: 1 },
      ENG: { kind: "continuous", pos: 4, sal: 1 },
      EPS: { kind: "categorical", probs: [0.1, 0.58, 0.15, 0.05, 0.06, 0.06], sal: 2, antiCats: [5] },
      AES: { kind: "categorical", probs: [0.08, 0.64, 0.04, 0.04, 0.03, 0.17], sal: 2, antiCats: [4] }
    }
  },
  {
    id: "095",
    name: "Emergency Orderist",
    tier: "T1",
    prior: 1 / 130,
    nodes: {
      MAT: { kind: "continuous", pos: 3, sal: 1 },
      CD: { kind: "continuous", pos: 4, sal: 1 },
      CU: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      MOR: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      PRO: { kind: "continuous", pos: 3, sal: 1 },
      COM: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      ZS: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      ONT_H: { kind: "continuous", pos: 2, sal: 1 },
      ONT_S: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      PF: { kind: "continuous", pos: 4, sal: 1 },
      TRB: { kind: "continuous", pos: 3, sal: 1 },
      ENG: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      EPS: { kind: "categorical", probs: [0.1, 0.58, 0.15, 0.05, 0.06, 0.06], sal: 2, antiCats: [5] },
      AES: { kind: "categorical", probs: [0.6, 0.1, 0.04, 0.06, 0.14, 0.06], sal: 2, antiCats: [4] }
    }
  },
  {
    id: "096",
    name: "Civic Disciplinarian",
    tier: "T1",
    prior: 1 / 130,
    nodes: {
      MAT: { kind: "continuous", pos: 3, sal: 1 },
      CD: { kind: "continuous", pos: 4, sal: 1 },
      CU: { kind: "continuous", pos: 2, sal: 1 },
      MOR: { kind: "continuous", pos: 2, sal: 2 },
      PRO: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      COM: { kind: "continuous", pos: 3, sal: 1 },
      ZS: { kind: "continuous", pos: 4, sal: 2 },
      ONT_H: { kind: "continuous", pos: 2, sal: 1 },
      ONT_S: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      PF: { kind: "continuous", pos: 4, sal: 1 },
      TRB: { kind: "continuous", pos: 3, sal: 2 },
      ENG: { kind: "continuous", pos: 4, sal: 1 },
      EPS: { kind: "categorical", probs: [0.1, 0.58, 0.15, 0.05, 0.06, 0.06], sal: 2, antiCats: [5] },
      AES: { kind: "categorical", probs: [0.6, 0.1, 0.04, 0.06, 0.14, 0.06], sal: 2, antiCats: [4] }
    }
  },
  {
    id: "097",
    name: "Authority Pragmatist",
    tier: "T1",
    prior: 1 / 130,
    nodes: {
      MAT: { kind: "continuous", pos: 4, sal: 1 },
      CD: { kind: "continuous", pos: 4, sal: 1 },
      CU: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      MOR: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      PRO: { kind: "continuous", pos: 4, sal: 1 },
      COM: { kind: "continuous", pos: 4, sal: 1 },
      ZS: { kind: "continuous", pos: 4, sal: 2 },
      ONT_H: { kind: "continuous", pos: 3, sal: 1 },
      ONT_S: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      PF: { kind: "continuous", pos: 4, sal: 1 },
      TRB: { kind: "continuous", pos: 3, sal: 1 },
      ENG: { kind: "continuous", pos: 3, sal: 1 },
      EPS: { kind: "categorical", probs: [0.1, 0.58, 0.15, 0.05, 0.06, 0.06], sal: 2, antiCats: [5] },
      AES: { kind: "categorical", probs: [0.6, 0.1, 0.04, 0.06, 0.14, 0.06], sal: 2, antiCats: [4] }
    }
  },
  {
    id: "098",
    name: "Anti-Elite Populist",
    tier: "T1",
    prior: 1 / 130,
    nodes: {
      MAT: { kind: "continuous", pos: 3, sal: 1 },
      CD: { kind: "continuous", pos: 4, sal: 1 },
      CU: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      MOR: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      PRO: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      COM: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      ZS: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      ONT_H: { kind: "continuous", pos: 2, sal: 1 },
      ONT_S: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      PF: { kind: "continuous", pos: 2, sal: 1 },
      TRB: { kind: "continuous", pos: 3, sal: 1 },
      ENG: { kind: "continuous", pos: 4, sal: 1 },
      EPS: { kind: "categorical", probs: [0.05, 0.05, 0.08, 0.58, 0.19, 0.05], sal: 2, antiCats: [0, 5] },
      AES: { kind: "categorical", probs: [0.05, 0.05, 0.08, 0.6, 0.15, 0.07], sal: 2 }
    }
  },
  {
    id: "099",
    name: "Scarcity Populist",
    tier: "T1",
    prior: 1 / 130,
    nodes: {
      MAT: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      CD: { kind: "continuous", pos: 4, sal: 2 },
      CU: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      MOR: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      PRO: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      COM: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      ZS: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      ONT_H: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      ONT_S: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      PF: { kind: "continuous", pos: 3, sal: 2 },
      TRB: { kind: "continuous", pos: 3, sal: 2 },
      ENG: { kind: "continuous", pos: 3, sal: 2 },
      EPS: { kind: "categorical", probs: [0.05, 0.05, 0.08, 0.58, 0.19, 0.05], sal: 2, antiCats: [0, 5] },
      AES: { kind: "categorical", probs: [0.04, 0.03, 0.04, 0.18, 0.63, 0.08], sal: 2, antiCats: [0, 1] }
    }
  },
  {
    id: "100",
    name: "Tribal Insurgent",
    tier: "T1",
    prior: 1 / 130,
    nodes: {
      MAT: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      CD: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      CU: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      MOR: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      PRO: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      COM: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      ZS: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      ONT_H: { kind: "continuous", pos: 2, sal: 1 },
      ONT_S: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      PF: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      TRB: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      ENG: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      EPS: { kind: "categorical", probs: [0.05, 0.05, 0.08, 0.58, 0.19, 0.05], sal: 2, antiCats: [0, 5] },
      AES: { kind: "categorical", probs: [0.04, 0.03, 0.04, 0.18, 0.63, 0.08], sal: 2, antiCats: [0, 1] }
    }
  },
  {
    id: "101",
    name: "Embattled Majoritarian",
    tier: "T1",
    prior: 1 / 130,
    nodes: {
      MAT: { kind: "continuous", pos: 3, sal: 1 },
      CD: { kind: "continuous", pos: 4, sal: 2 },
      CU: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      MOR: { kind: "continuous", pos: 2, sal: 2 },
      PRO: { kind: "continuous", pos: 2, sal: 1 },
      COM: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      ZS: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      ONT_H: { kind: "continuous", pos: 2, sal: 1 },
      ONT_S: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      PF: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      TRB: { kind: "continuous", pos: 3, sal: 2 },
      ENG: { kind: "continuous", pos: 3, sal: 2 },
      EPS: { kind: "categorical", probs: [0.05, 0.05, 0.08, 0.58, 0.19, 0.05], sal: 2, antiCats: [0, 5] },
      AES: { kind: "categorical", probs: [0.05, 0.05, 0.08, 0.6, 0.15, 0.07], sal: 2 }
    }
  },
  {
    id: "102",
    name: "Folk Tribune",
    tier: "T1",
    prior: 1 / 130,
    nodes: {
      MAT: { kind: "continuous", pos: 3, sal: 1 },
      CD: { kind: "continuous", pos: 4, sal: 1 },
      CU: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      MOR: { kind: "continuous", pos: 2, sal: 1 },
      PRO: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      COM: { kind: "continuous", pos: 2, sal: 1 },
      ZS: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      ONT_H: { kind: "continuous", pos: 2, sal: 1 },
      ONT_S: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      PF: { kind: "continuous", pos: 2, sal: 1 },
      TRB: { kind: "continuous", pos: 2, sal: 1 },
      ENG: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      EPS: { kind: "categorical", probs: [0.05, 0.05, 0.08, 0.58, 0.19, 0.05], sal: 2, antiCats: [0, 5] },
      AES: { kind: "categorical", probs: [0.05, 0.05, 0.08, 0.6, 0.15, 0.07], sal: 2 }
    }
  },
  {
    id: "103",
    name: "Grievance Mobilizer",
    tier: "T1",
    prior: 1 / 130,
    nodes: {
      MAT: { kind: "continuous", pos: 2, sal: 1 },
      CD: { kind: "continuous", pos: 4, sal: 1 },
      CU: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      MOR: { kind: "continuous", pos: 2, sal: 1 },
      PRO: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      COM: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      ZS: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      ONT_H: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      ONT_S: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      PF: { kind: "continuous", pos: 4, sal: 1 },
      TRB: { kind: "continuous", pos: 4, sal: 2 },
      ENG: { kind: "continuous", pos: 4, sal: 2 },
      // Fixed: Mobilizer = high engagement
      EPS: { kind: "categorical", probs: [0.05, 0.05, 0.08, 0.58, 0.19, 0.05], sal: 2, antiCats: [0, 5] },
      AES: { kind: "categorical", probs: [0.05, 0.05, 0.08, 0.6, 0.15, 0.07], sal: 2 }
    }
  },
  {
    id: "104",
    name: "National Protector",
    tier: "T1",
    prior: 1 / 130,
    nodes: {
      MAT: { kind: "continuous", pos: 3, sal: 1 },
      CD: { kind: "continuous", pos: 4, sal: 2 },
      CU: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      MOR: { kind: "continuous", pos: 3, sal: 2 },
      PRO: { kind: "continuous", pos: 3, sal: 1 },
      COM: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      ZS: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      ONT_H: { kind: "continuous", pos: 3, sal: 1 },
      ONT_S: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      PF: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      TRB: { kind: "continuous", pos: 4, sal: 2 },
      ENG: { kind: "continuous", pos: 4, sal: 2 },
      EPS: { kind: "categorical", probs: [0.05, 0.05, 0.08, 0.58, 0.19, 0.05], sal: 2, antiCats: [0, 5] },
      AES: { kind: "categorical", probs: [0.04, 0.03, 0.04, 0.18, 0.63, 0.08], sal: 2, antiCats: [0, 1] }
    }
  },
  {
    id: "105",
    name: "Combative Populist",
    tier: "T1",
    prior: 1 / 130,
    nodes: {
      MAT: { kind: "continuous", pos: 3, sal: 1 },
      CD: { kind: "continuous", pos: 4, sal: 1 },
      CU: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      MOR: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      PRO: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      COM: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      ZS: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      ONT_H: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      ONT_S: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      PF: { kind: "continuous", pos: 4, sal: 1 },
      TRB: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      ENG: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      EPS: { kind: "categorical", probs: [0.05, 0.05, 0.08, 0.58, 0.19, 0.05], sal: 2, antiCats: [0, 5] },
      AES: { kind: "categorical", probs: [0.04, 0.03, 0.04, 0.18, 0.63, 0.08], sal: 2, antiCats: [0, 1] }
    }
  },
  {
    id: "106",
    name: "Leader-Centered Insurgent",
    tier: "T1",
    prior: 1 / 130,
    nodes: {
      MAT: { kind: "continuous", pos: 3, sal: 1 },
      CD: { kind: "continuous", pos: 4, sal: 1 },
      CU: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      MOR: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      PRO: { kind: "continuous", pos: 2, sal: 2 },
      COM: { kind: "continuous", pos: 2, sal: 2 },
      ZS: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      ONT_H: { kind: "continuous", pos: 2, sal: 1 },
      ONT_S: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      PF: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      TRB: { kind: "continuous", pos: 4, sal: 1 },
      ENG: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      EPS: { kind: "categorical", probs: [0.05, 0.05, 0.08, 0.58, 0.19, 0.05], sal: 2, antiCats: [0, 5] },
      AES: { kind: "categorical", probs: [0.04, 0.03, 0.04, 0.18, 0.63, 0.08], sal: 2, antiCats: [0, 1] }
    }
  },
  {
    id: "107",
    name: "Resentful Localist",
    tier: "T1",
    prior: 1 / 130,
    nodes: {
      MAT: { kind: "continuous", pos: 3, sal: 2 },
      CD: { kind: "continuous", pos: 4, sal: 2 },
      CU: { kind: "continuous", pos: 2, sal: 2 },
      MOR: { kind: "continuous", pos: 2, sal: 2 },
      PRO: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      COM: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      ZS: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      ONT_H: { kind: "continuous", pos: 2, sal: 2 },
      ONT_S: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      PF: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      TRB: { kind: "continuous", pos: 2, sal: 2 },
      ENG: { kind: "continuous", pos: 3, sal: 2 },
      EPS: { kind: "categorical", probs: [0.05, 0.05, 0.08, 0.58, 0.19, 0.05], sal: 2, antiCats: [0, 5] },
      AES: { kind: "categorical", probs: [0.05, 0.05, 0.08, 0.6, 0.15, 0.07], sal: 2 }
    }
  },
  {
    id: "108",
    name: "Passive Cynic",
    tier: "T1",
    prior: 1 / 130,
    nodes: {
      MAT: { kind: "continuous", pos: 3, sal: 0 },
      CD: { kind: "continuous", pos: 3, sal: 0 },
      CU: { kind: "continuous", pos: 3, sal: 0 },
      MOR: { kind: "continuous", pos: 3, sal: 0 },
      PRO: { kind: "continuous", pos: 2, sal: 1 },
      COM: { kind: "continuous", pos: 3, sal: 0 },
      ZS: { kind: "continuous", pos: 3, sal: 0 },
      ONT_H: { kind: "continuous", pos: 2, sal: 1 },
      ONT_S: { kind: "continuous", pos: 3, sal: 0 },
      PF: { kind: "continuous", pos: 3, sal: 0 },
      TRB: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      ENG: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      EPS: { kind: "categorical", probs: [0.03, 0.04, 0.04, 0.05, 0.1, 0.74], sal: 2, antiCats: [0, 1, 2, 3] },
      AES: { kind: "categorical", probs: [0.05, 0.05, 0.08, 0.7, 0.05, 0.07], sal: 2 }
    }
  },
  {
    id: "109",
    name: "Alienated Outsider",
    tier: "T1",
    prior: 1 / 130,
    nodes: {
      MAT: { kind: "continuous", pos: 3, sal: 1 },
      CD: { kind: "continuous", pos: 3, sal: 1 },
      CU: { kind: "continuous", pos: 3, sal: 1 },
      MOR: { kind: "continuous", pos: 4, sal: 2 },
      PRO: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      COM: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      ZS: { kind: "continuous", pos: 4, sal: 2, anti: "low" },
      ONT_H: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      ONT_S: { kind: "continuous", pos: 4, sal: 2 },
      PF: { kind: "continuous", pos: 2, sal: 1 },
      TRB: { kind: "continuous", pos: 3, sal: 2, anti: "high" },
      ENG: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      EPS: { kind: "categorical", probs: [0.08, 0.08, 0.08, 0.1, 0.6, 0.06], sal: 3, antiCats: [2, 5] },
      AES: { kind: "categorical", probs: [0.05, 0.05, 0.18, 0.6, 0.05, 0.07], sal: 3 }
    }
  },
  {
    id: "110",
    name: "Principled Abstainer",
    tier: "T1",
    prior: 1 / 130,
    nodes: {
      MAT: { kind: "continuous", pos: 3, sal: 1 },
      CD: { kind: "continuous", pos: 3, sal: 1 },
      CU: { kind: "continuous", pos: 4, sal: 2 },
      MOR: { kind: "continuous", pos: 5, sal: 3, anti: "low" },
      PRO: { kind: "continuous", pos: 1, sal: 3, anti: "high" },
      COM: { kind: "continuous", pos: 1, sal: 1 },
      ZS: { kind: "continuous", pos: 4, sal: 2 },
      ONT_H: { kind: "continuous", pos: 4, sal: 2 },
      ONT_S: { kind: "continuous", pos: 3, sal: 1, anti: "low" },
      PF: { kind: "continuous", pos: 1, sal: 3, anti: "high" },
      TRB: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      ENG: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      EPS: { kind: "categorical", probs: [0.08, 0.08, 0.08, 0.2, 0.5, 0.06], sal: 2, antiCats: [2, 5] },
      AES: { kind: "categorical", probs: [0.05, 0.05, 0.18, 0.6, 0.05, 0.07], sal: 2 }
    }
  },
  {
    id: "111",
    name: "Diogenes Independent",
    tier: "T1",
    prior: 1 / 130,
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
      PF: { kind: "continuous", pos: 3, sal: 0 },
      TRB: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      ENG: { kind: "continuous", pos: 3, sal: 1 },
      EPS: { kind: "categorical", probs: [0.08, 0.08, 0.08, 0.1, 0.6, 0.06], sal: 2, antiCats: [2, 5] },
      AES: { kind: "categorical", probs: [0.05, 0.05, 0.08, 0.7, 0.05, 0.07], sal: 2 }
    }
  },
  {
    id: "112",
    name: "Contrarian Intellectual",
    tier: "T1",
    prior: 1 / 130,
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
      PF: { kind: "continuous", pos: 3, sal: 1 },
      TRB: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      ENG: { kind: "continuous", pos: 4, sal: 2, anti: "low" },
      EPS: { kind: "categorical", probs: [0.08, 0.08, 0.08, 0.1, 0.6, 0.06], sal: 3, antiCats: [2, 5] },
      AES: { kind: "categorical", probs: [0.05, 0.05, 0.08, 0.7, 0.05, 0.07], sal: 3 }
    }
  },
  {
    id: "115",
    name: "Quietist",
    tier: "T1",
    prior: 1 / 130,
    nodes: {
      MAT: { kind: "continuous", pos: 3, sal: 0 },
      CD: { kind: "continuous", pos: 3, sal: 0 },
      CU: { kind: "continuous", pos: 3, sal: 0 },
      MOR: { kind: "continuous", pos: 2, sal: 2, anti: "high" },
      PRO: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      COM: { kind: "continuous", pos: 2, sal: 1 },
      ZS: { kind: "continuous", pos: 3, sal: 0, anti: "low" },
      ONT_H: { kind: "continuous", pos: 4, sal: 2 },
      ONT_S: { kind: "continuous", pos: 3, sal: 0 },
      PF: { kind: "continuous", pos: 3, sal: 0 },
      TRB: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      ENG: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      EPS: { kind: "categorical", probs: [0.04, 0.08, 0.6, 0.16, 0.08, 0.04], sal: 2, antiCats: [0, 5] },
      AES: { kind: "categorical", probs: [0.06, 0.05, 0.72, 0.07, 0.03, 0.07], sal: 2 }
    }
  },
  {
    id: "116",
    name: "Quiet Middle",
    tier: "T1",
    prior: 1 / 130,
    nodes: {
      MAT: { kind: "continuous", pos: 3, sal: 1 },
      CD: { kind: "continuous", pos: 3, sal: 1 },
      CU: { kind: "continuous", pos: 3, sal: 1 },
      MOR: { kind: "continuous", pos: 3, sal: 2 },
      PRO: { kind: "continuous", pos: 3, sal: 2 },
      COM: { kind: "continuous", pos: 3, sal: 2, anti: "low" },
      ZS: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      ONT_H: { kind: "continuous", pos: 2, sal: 2 },
      ONT_S: { kind: "continuous", pos: 2, sal: 2 },
      PF: { kind: "continuous", pos: 3, sal: 1, anti: "low" },
      TRB: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      ENG: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      EPS: { kind: "categorical", probs: [0.1, 0.58, 0.05, 0.03, 0.16, 0.08], sal: 2, antiCats: [5] },
      AES: { kind: "categorical", probs: [0.05, 0.05, 0.18, 0.6, 0.05, 0.07], sal: 2 }
    }
  },
  {
    id: "117",
    name: "Comfortable Bystander",
    tier: "T1",
    prior: 1 / 130,
    nodes: {
      MAT: { kind: "continuous", pos: 3, sal: 1 },
      CD: { kind: "continuous", pos: 3, sal: 2 },
      CU: { kind: "continuous", pos: 3, sal: 1 },
      MOR: { kind: "continuous", pos: 1, sal: 1, anti: "high" },
      PRO: { kind: "continuous", pos: 4, sal: 2 },
      COM: { kind: "continuous", pos: 5, sal: 1 },
      ZS: { kind: "continuous", pos: 1, sal: 1, anti: "high" },
      ONT_H: { kind: "continuous", pos: 2, sal: 1, anti: "low" },
      ONT_S: { kind: "continuous", pos: 2, sal: 2 },
      PF: { kind: "continuous", pos: 3, sal: 1, anti: "low" },
      TRB: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      ENG: { kind: "continuous", pos: 1, sal: 3, anti: "high" },
      // Bystander's defining trait: extremely disengaged
      EPS: { kind: "categorical", probs: [0.04, 0.18, 0.6, 0.06, 0.08, 0.04], sal: 1, antiCats: [0, 5] },
      AES: { kind: "categorical", probs: [0.05, 0.05, 0.18, 0.6, 0.05, 0.07], sal: 2 }
    }
  },
  {
    id: "118",
    name: "Survival Pragmatist",
    tier: "T1",
    prior: 1 / 130,
    nodes: {
      MAT: { kind: "continuous", pos: 2, sal: 2 },
      CD: { kind: "continuous", pos: 3, sal: 1 },
      CU: { kind: "continuous", pos: 3, sal: 1 },
      MOR: { kind: "continuous", pos: 3, sal: 1 },
      PRO: { kind: "continuous", pos: 3, sal: 1 },
      COM: { kind: "continuous", pos: 3, sal: 1 },
      ZS: { kind: "continuous", pos: 4, sal: 2 },
      ONT_H: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      ONT_S: { kind: "continuous", pos: 4, sal: 2 },
      PF: { kind: "continuous", pos: 3, sal: 1 },
      TRB: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      ENG: { kind: "continuous", pos: 3, sal: 2, anti: "high" },
      EPS: { kind: "categorical", probs: [0.1, 0.58, 0.05, 0.03, 0.16, 0.08], sal: 2, antiCats: [5] },
      AES: { kind: "categorical", probs: [0.05, 0.05, 0.18, 0.6, 0.05, 0.07], sal: 2 }
    }
  },
  {
    id: "119",
    name: "Apolitical Striver",
    tier: "T1",
    prior: 1 / 130,
    nodes: {
      MAT: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      CD: { kind: "continuous", pos: 3, sal: 0 },
      CU: { kind: "continuous", pos: 3, sal: 0 },
      MOR: { kind: "continuous", pos: 3, sal: 0 },
      PRO: { kind: "continuous", pos: 2, sal: 1 },
      COM: { kind: "continuous", pos: 2, sal: 1 },
      ZS: { kind: "continuous", pos: 2, sal: 1 },
      ONT_H: { kind: "continuous", pos: 4, sal: 1 },
      ONT_S: { kind: "continuous", pos: 2, sal: 1 },
      PF: { kind: "continuous", pos: 3, sal: 0 },
      TRB: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      ENG: { kind: "continuous", pos: 2, sal: 2 },
      EPS: { kind: "categorical", probs: [0.1, 0.58, 0.05, 0.03, 0.16, 0.08], sal: 2, antiCats: [5] },
      AES: { kind: "categorical", probs: [0.05, 0.05, 0.18, 0.6, 0.05, 0.07], sal: 2 }
    }
  },
  {
    id: "120",
    name: "Good Neighbor",
    tier: "T1",
    prior: 1 / 130,
    nodes: {
      MAT: { kind: "continuous", pos: 2, sal: 1 },
      CD: { kind: "continuous", pos: 4, sal: 2, anti: "low" },
      CU: { kind: "continuous", pos: 3, sal: 3 },
      MOR: { kind: "continuous", pos: 5, sal: 3, anti: "low" },
      PRO: { kind: "continuous", pos: 3, sal: 1 },
      COM: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      ZS: { kind: "continuous", pos: 2, sal: 2 },
      ONT_H: { kind: "continuous", pos: 3, sal: 2 },
      ONT_S: { kind: "continuous", pos: 2, sal: 3, anti: "high" },
      PF: { kind: "continuous", pos: 3, sal: 2 },
      TRB: { kind: "continuous", pos: 1, sal: 3, anti: "high" },
      ENG: { kind: "continuous", pos: 2, sal: 2 },
      EPS: { kind: "categorical", probs: [0.1, 0.58, 0.05, 0.03, 0.16, 0.08], sal: 2, antiCats: [5] },
      AES: { kind: "categorical", probs: [0.6, 0.1, 0.14, 0.06, 0.04, 0.06], sal: 3, antiCats: [4] }
    }
  },
  {
    id: "121",
    name: "Spectator Citizen",
    tier: "T1",
    prior: 1 / 130,
    nodes: {
      MAT: { kind: "continuous", pos: 3, sal: 2 },
      CD: { kind: "continuous", pos: 3, sal: 2 },
      CU: { kind: "continuous", pos: 4, sal: 1 },
      MOR: { kind: "continuous", pos: 3, sal: 3 },
      PRO: { kind: "continuous", pos: 4, sal: 3 },
      COM: { kind: "continuous", pos: 3, sal: 2 },
      ZS: { kind: "continuous", pos: 2, sal: 1 },
      ONT_H: { kind: "continuous", pos: 4, sal: 1 },
      ONT_S: { kind: "continuous", pos: 2, sal: 2 },
      PF: { kind: "continuous", pos: 3, sal: 1 },
      TRB: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      ENG: { kind: "continuous", pos: 3, sal: 2, anti: "low" },
      EPS: { kind: "categorical", probs: [0.62, 0.24, 0.03, 0.04, 0.03, 0.04], sal: 3, antiCats: [2, 3, 5] },
      AES: { kind: "categorical", probs: [0.05, 0.05, 0.18, 0.6, 0.05, 0.07], sal: 2 }
    }
  },
  {
    id: "122",
    name: "Civic Minimalist",
    tier: "T1",
    prior: 1 / 130,
    nodes: {
      MAT: { kind: "continuous", pos: 3, sal: 0 },
      CD: { kind: "continuous", pos: 4, sal: 1 },
      CU: { kind: "continuous", pos: 3, sal: 0 },
      MOR: { kind: "continuous", pos: 4, sal: 1 },
      PRO: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      COM: { kind: "continuous", pos: 2, sal: 1 },
      ZS: { kind: "continuous", pos: 2, sal: 1 },
      ONT_H: { kind: "continuous", pos: 3, sal: 0 },
      ONT_S: { kind: "continuous", pos: 2, sal: 1 },
      PF: { kind: "continuous", pos: 3, sal: 0 },
      TRB: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      ENG: { kind: "continuous", pos: 2, sal: 2 },
      EPS: { kind: "categorical", probs: [0.1, 0.58, 0.05, 0.03, 0.16, 0.08], sal: 2, antiCats: [5] },
      AES: { kind: "categorical", probs: [0.05, 0.05, 0.18, 0.6, 0.05, 0.07], sal: 2 }
    }
  },
  {
    id: "124",
    name: "Crisis-Activated Sleeper",
    tier: "T1",
    prior: 1 / 130,
    nodes: {
      MAT: { kind: "continuous", pos: 3, sal: 0 },
      CD: { kind: "continuous", pos: 3, sal: 0, anti: "low" },
      CU: { kind: "continuous", pos: 3, sal: 0 },
      MOR: { kind: "continuous", pos: 3, sal: 0 },
      PRO: { kind: "continuous", pos: 2, sal: 1 },
      COM: { kind: "continuous", pos: 2, sal: 1 },
      ZS: { kind: "continuous", pos: 4, sal: 1 },
      ONT_H: { kind: "continuous", pos: 3, sal: 0 },
      ONT_S: { kind: "continuous", pos: 4, sal: 2, anti: "low" },
      PF: { kind: "continuous", pos: 4, sal: 1 },
      TRB: { kind: "continuous", pos: 2, sal: 1, anti: "high" },
      ENG: { kind: "continuous", pos: 3, sal: 2, anti: "high" },
      EPS: { kind: "categorical", probs: [0.1, 0.58, 0.05, 0.03, 0.16, 0.08], sal: 2, antiCats: [5] },
      AES: { kind: "categorical", probs: [0.05, 0.05, 0.18, 0.6, 0.05, 0.07], sal: 2 }
    }
  },
  {
    id: "125",
    name: "Reluctant Partisan",
    tier: "T1",
    prior: 1 / 130,
    nodes: {
      MAT: { kind: "continuous", pos: 3, sal: 0 },
      CD: { kind: "continuous", pos: 3, sal: 0 },
      CU: { kind: "continuous", pos: 3, sal: 0, anti: "low" },
      MOR: { kind: "continuous", pos: 3, sal: 0, anti: "low" },
      PRO: { kind: "continuous", pos: 4, sal: 2, anti: "low" },
      COM: { kind: "continuous", pos: 4, sal: 2, anti: "low" },
      ZS: { kind: "continuous", pos: 3, sal: 1, anti: "low" },
      ONT_H: { kind: "continuous", pos: 3, sal: 0 },
      ONT_S: { kind: "continuous", pos: 4, sal: 2, anti: "low" },
      PF: { kind: "continuous", pos: 4, sal: 2, anti: "low" },
      TRB: { kind: "continuous", pos: 2, sal: 2, anti: "high" },
      ENG: { kind: "continuous", pos: 2, sal: 2, anti: "high" },
      EPS: { kind: "categorical", probs: [0.1, 0.58, 0.05, 0.03, 0.16, 0.08], sal: 2, antiCats: [5] },
      AES: { kind: "categorical", probs: [0.05, 0.05, 0.18, 0.6, 0.05, 0.07], sal: 2 }
    }
  },
  {
    id: "126",
    name: "Single-Issue Activator",
    tier: "T1",
    prior: 1 / 130,
    nodes: {
      MAT: { kind: "continuous", pos: 3, sal: 0 },
      CD: { kind: "continuous", pos: 3, sal: 0 },
      CU: { kind: "continuous", pos: 3, sal: 0 },
      MOR: { kind: "continuous", pos: 4, sal: 1 },
      PRO: { kind: "continuous", pos: 2, sal: 1 },
      COM: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      ZS: { kind: "continuous", pos: 3, sal: 1 },
      ONT_H: { kind: "continuous", pos: 3, sal: 0 },
      ONT_S: { kind: "continuous", pos: 4, sal: 1 },
      PF: { kind: "continuous", pos: 3, sal: 0 },
      TRB: { kind: "continuous", pos: 3, sal: 0, anti: "low" },
      ENG: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      EPS: { kind: "categorical", probs: [0.1, 0.58, 0.05, 0.03, 0.16, 0.08], sal: 2, antiCats: [5] },
      AES: { kind: "categorical", probs: [0.05, 0.05, 0.18, 0.6, 0.05, 0.07], sal: 2 }
    }
  },
  {
    id: "127",
    name: "Tribal Loyalist",
    tier: "T1",
    prior: 1 / 130,
    nodes: {
      MAT: { kind: "continuous", pos: 3, sal: 0 },
      CD: { kind: "continuous", pos: 4, sal: 1 },
      CU: { kind: "continuous", pos: 3, sal: 0 },
      MOR: { kind: "continuous", pos: 2, sal: 1 },
      PRO: { kind: "continuous", pos: 3, sal: 0 },
      COM: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      ZS: { kind: "continuous", pos: 3, sal: 1 },
      ONT_H: { kind: "continuous", pos: 3, sal: 0 },
      ONT_S: { kind: "continuous", pos: 4, sal: 1 },
      PF: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      TRB: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      ENG: { kind: "continuous", pos: 3, sal: 1, anti: "low" },
      EPS: { kind: "categorical", probs: [0.1, 0.58, 0.05, 0.03, 0.16, 0.08], sal: 2, antiCats: [5] },
      AES: { kind: "categorical", probs: [0.05, 0.05, 0.18, 0.6, 0.05, 0.07], sal: 2 }
    }
  },
  {
    id: "128",
    name: "Loyal Democrat",
    tier: "T1",
    prior: 1 / 130,
    nodes: {
      MAT: { kind: "continuous", pos: 2, sal: 1 },
      CD: { kind: "continuous", pos: 3, sal: 0 },
      CU: { kind: "continuous", pos: 4, sal: 1 },
      MOR: { kind: "continuous", pos: 4, sal: 1 },
      PRO: { kind: "continuous", pos: 3, sal: 0 },
      COM: { kind: "continuous", pos: 2, sal: 1 },
      ZS: { kind: "continuous", pos: 3, sal: 1 },
      ONT_H: { kind: "continuous", pos: 3, sal: 0 },
      ONT_S: { kind: "continuous", pos: 4, sal: 1 },
      PF: { kind: "continuous", pos: 4, sal: 2 },
      // Fixed: Loyal = high PF
      TRB: { kind: "continuous", pos: 4, sal: 2 },
      ENG: { kind: "continuous", pos: 3, sal: 1 },
      EPS: { kind: "categorical", probs: [0.1, 0.58, 0.05, 0.03, 0.16, 0.08], sal: 2, antiCats: [5] },
      AES: { kind: "categorical", probs: [0.05, 0.05, 0.18, 0.6, 0.05, 0.07], sal: 2 }
    }
  },
  {
    id: "129",
    name: "Loyal Republican",
    tier: "T1",
    prior: 1 / 130,
    nodes: {
      MAT: { kind: "continuous", pos: 4, sal: 1 },
      CD: { kind: "continuous", pos: 4, sal: 1 },
      CU: { kind: "continuous", pos: 2, sal: 1 },
      MOR: { kind: "continuous", pos: 2, sal: 1 },
      PRO: { kind: "continuous", pos: 3, sal: 0 },
      COM: { kind: "continuous", pos: 2, sal: 1 },
      ZS: { kind: "continuous", pos: 3, sal: 1 },
      ONT_H: { kind: "continuous", pos: 3, sal: 0 },
      ONT_S: { kind: "continuous", pos: 4, sal: 1 },
      PF: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      TRB: { kind: "continuous", pos: 4, sal: 2 },
      ENG: { kind: "continuous", pos: 3, sal: 1 },
      EPS: { kind: "categorical", probs: [0.1, 0.58, 0.05, 0.03, 0.16, 0.08], sal: 2, antiCats: [5] },
      AES: { kind: "categorical", probs: [0.05, 0.05, 0.18, 0.6, 0.05, 0.07], sal: 2 }
    }
  },
  {
    id: "130",
    name: "Legacy Partisan",
    tier: "T1",
    prior: 1 / 130,
    nodes: {
      MAT: { kind: "continuous", pos: 3, sal: 1 },
      CD: { kind: "continuous", pos: 4, sal: 1 },
      CU: { kind: "continuous", pos: 3, sal: 0 },
      MOR: { kind: "continuous", pos: 2, sal: 1 },
      PRO: { kind: "continuous", pos: 3, sal: 0 },
      COM: { kind: "continuous", pos: 2, sal: 1 },
      ZS: { kind: "continuous", pos: 3, sal: 1 },
      ONT_H: { kind: "continuous", pos: 3, sal: 0 },
      ONT_S: { kind: "continuous", pos: 4, sal: 1 },
      PF: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      TRB: { kind: "continuous", pos: 4, sal: 2 },
      ENG: { kind: "continuous", pos: 3, sal: 2, anti: "high" },
      EPS: { kind: "categorical", probs: [0.04, 0.18, 0.6, 0.06, 0.08, 0.04], sal: 2, antiCats: [0, 5] },
      AES: { kind: "categorical", probs: [0.05, 0.05, 0.18, 0.6, 0.05, 0.07], sal: 2 }
    }
  },
  {
    id: "131",
    name: "Duty Voter",
    tier: "T1",
    prior: 1 / 130,
    nodes: {
      MAT: { kind: "continuous", pos: 3, sal: 1 },
      CD: { kind: "continuous", pos: 4, sal: 2 },
      CU: { kind: "continuous", pos: 3, sal: 1 },
      MOR: { kind: "continuous", pos: 4, sal: 2 },
      PRO: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      COM: { kind: "continuous", pos: 2, sal: 2 },
      ZS: { kind: "continuous", pos: 3, sal: 1 },
      ONT_H: { kind: "continuous", pos: 3, sal: 1 },
      ONT_S: { kind: "continuous", pos: 4, sal: 2 },
      PF: { kind: "continuous", pos: 3, sal: 1 },
      TRB: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      ENG: { kind: "continuous", pos: 3, sal: 2 },
      EPS: { kind: "categorical", probs: [0.1, 0.58, 0.05, 0.03, 0.16, 0.08], sal: 2, antiCats: [5] },
      AES: { kind: "categorical", probs: [0.05, 0.05, 0.18, 0.6, 0.05, 0.07], sal: 2 }
    }
  },
  {
    id: "132",
    name: "Negative Partisan",
    tier: "T1",
    prior: 1 / 130,
    nodes: {
      MAT: { kind: "continuous", pos: 3, sal: 0 },
      CD: { kind: "continuous", pos: 3, sal: 0 },
      CU: { kind: "continuous", pos: 3, sal: 0 },
      MOR: { kind: "continuous", pos: 3, sal: 0 },
      PRO: { kind: "continuous", pos: 3, sal: 0 },
      COM: { kind: "continuous", pos: 2, sal: 1 },
      ZS: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      ONT_H: { kind: "continuous", pos: 3, sal: 0 },
      ONT_S: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      PF: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      TRB: { kind: "continuous", pos: 4, sal: 2 },
      ENG: { kind: "continuous", pos: 4, sal: 1 },
      EPS: { kind: "categorical", probs: [0.1, 0.58, 0.05, 0.03, 0.16, 0.08], sal: 2, antiCats: [5] },
      AES: { kind: "categorical", probs: [0.05, 0.05, 0.18, 0.6, 0.05, 0.07], sal: 2 }
    }
  },
  {
    id: "133",
    name: "Sporadic Alarm Voter",
    tier: "T1",
    prior: 1 / 130,
    nodes: {
      MAT: { kind: "continuous", pos: 3, sal: 1 },
      CD: { kind: "continuous", pos: 3, sal: 1 },
      CU: { kind: "continuous", pos: 3, sal: 1 },
      MOR: { kind: "continuous", pos: 3, sal: 1, anti: "high" },
      PRO: { kind: "continuous", pos: 3, sal: 1, anti: "low" },
      COM: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      ZS: { kind: "continuous", pos: 4, sal: 2 },
      ONT_H: { kind: "continuous", pos: 3, sal: 1 },
      ONT_S: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      PF: { kind: "continuous", pos: 3, sal: 1, anti: "low" },
      TRB: { kind: "continuous", pos: 2, sal: 2, anti: "low" },
      ENG: { kind: "continuous", pos: 3, sal: 2, anti: "high" },
      EPS: { kind: "categorical", probs: [0.1, 0.58, 0.05, 0.03, 0.16, 0.08], sal: 2, antiCats: [5] },
      AES: { kind: "categorical", probs: [0.05, 0.05, 0.18, 0.6, 0.05, 0.07], sal: 2 }
    }
  },
  {
    id: "134",
    name: "Progressive Civic Nationalist",
    tier: "T1",
    prior: 1 / 130,
    nodes: {
      MAT: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      CD: { kind: "continuous", pos: 2, sal: 1 },
      CU: { kind: "continuous", pos: 4, sal: 2 },
      MOR: { kind: "continuous", pos: 4, sal: 2 },
      PRO: { kind: "continuous", pos: 4, sal: 2 },
      COM: { kind: "continuous", pos: 4, sal: 2 },
      ZS: { kind: "continuous", pos: 2, sal: 1 },
      ONT_H: { kind: "continuous", pos: 4, sal: 1 },
      ONT_S: { kind: "continuous", pos: 3, sal: 1 },
      PF: { kind: "continuous", pos: 2, sal: 2 },
      TRB: { kind: "continuous", pos: 4, sal: 2 },
      ENG: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
      EPS: { kind: "categorical", probs: [0.05, 0.05, 0.08, 0.58, 0.19, 0.05], sal: 2, antiCats: [0, 5] },
      AES: { kind: "categorical", probs: [0.06, 0.08, 0.05, 0.06, 0.08, 0.67], sal: 2 }
    }
  },
  // ===== NEW ARCHETYPES (added 2026-03-28 from ChatGPT semantic coverage audit) =====
  {
    id: "135",
    name: "Disruptive Cosmopolitan",
    tier: "T1",
    prior: 1 / 130,
    nodes: {
      MAT: { kind: "continuous", pos: 5, sal: 2 },
      CD: { kind: "continuous", pos: 1, sal: 2 },
      CU: { kind: "continuous", pos: 5, sal: 2 },
      MOR: { kind: "continuous", pos: 1, sal: 2 },
      PRO: { kind: "continuous", pos: 1, sal: 2 },
      // Anti-bureaucratic
      COM: { kind: "continuous", pos: 1, sal: 1 },
      ZS: { kind: "continuous", pos: 1, sal: 1 },
      ONT_H: { kind: "continuous", pos: 4, sal: 2 },
      ONT_S: { kind: "continuous", pos: 2, sal: 1 },
      PF: { kind: "continuous", pos: 1, sal: 1 },
      TRB: { kind: "continuous", pos: 1, sal: 1 },
      ENG: { kind: "continuous", pos: 4, sal: 2 },
      EPS: { kind: "categorical", probs: [0.6, 0.05, 0.15, 0.05, 0.1, 0.05], sal: 2 },
      AES: { kind: "categorical", probs: [0.6, 0.15, 0.05, 0.05, 0.1, 0.05], sal: 2 }
    }
  },
  {
    id: "136",
    name: "Aspirational Traditionalist",
    tier: "T1",
    prior: 1 / 130,
    nodes: {
      MAT: { kind: "continuous", pos: 5, sal: 2 },
      CD: { kind: "continuous", pos: 2, sal: 2 },
      CU: { kind: "continuous", pos: 4, sal: 2 },
      MOR: { kind: "continuous", pos: 5, sal: 3 },
      PRO: { kind: "continuous", pos: 3, sal: 2 },
      COM: { kind: "continuous", pos: 3, sal: 1 },
      ZS: { kind: "continuous", pos: 2, sal: 1 },
      ONT_H: { kind: "continuous", pos: 3, sal: 1 },
      ONT_S: { kind: "continuous", pos: 2, sal: 1 },
      PF: { kind: "continuous", pos: 2, sal: 1 },
      TRB: { kind: "continuous", pos: 2, sal: 1 },
      ENG: { kind: "continuous", pos: 3, sal: 2 },
      EPS: { kind: "categorical", probs: [0.1, 0.15, 0.5, 0.1, 0.05, 0.1], sal: 2 },
      AES: { kind: "categorical", probs: [0.1, 0.1, 0.5, 0.15, 0.05, 0.1], sal: 2 }
    }
  },
  {
    id: "137",
    name: "Prophetic Revivalist",
    tier: "T1",
    prior: 1 / 130,
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
      PF: { kind: "continuous", pos: 4, sal: 2 },
      TRB: { kind: "continuous", pos: 4, sal: 2 },
      ENG: { kind: "continuous", pos: 5, sal: 3 },
      EPS: { kind: "categorical", probs: [0.05, 0.05, 0.05, 0.1, 0.05, 0.7], sal: 3 },
      // Revelatory
      AES: { kind: "categorical", probs: [0.05, 0.05, 0.05, 0.05, 0.1, 0.7], sal: 3 }
      // Prophetic
    }
  },
  {
    id: "138",
    name: "Holistic Dissenter",
    tier: "T1",
    prior: 1 / 130,
    nodes: {
      MAT: { kind: "continuous", pos: 3, sal: 1 },
      CD: { kind: "continuous", pos: 2, sal: 1 },
      CU: { kind: "continuous", pos: 4, sal: 1 },
      MOR: { kind: "continuous", pos: 2, sal: 1 },
      PRO: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
      COM: { kind: "continuous", pos: 1, sal: 1 },
      ZS: { kind: "continuous", pos: 4, sal: 2 },
      ONT_H: { kind: "continuous", pos: 5, sal: 2 },
      ONT_S: { kind: "continuous", pos: 2, sal: 1 },
      PF: { kind: "continuous", pos: 1, sal: 1 },
      TRB: { kind: "continuous", pos: 2, sal: 1 },
      ENG: { kind: "continuous", pos: 4, sal: 2 },
      EPS: { kind: "categorical", probs: [0.05, 0.05, 0.05, 0.1, 0.05, 0.7], sal: 3 },
      // Revelatory
      AES: { kind: "categorical", probs: [0.05, 0.05, 0.1, 0.6, 0.1, 0.1], sal: 2 }
      // Experiential
    }
  },
  {
    id: "139",
    name: "Civic Assimilationist",
    tier: "T1",
    prior: 1 / 130,
    nodes: {
      MAT: { kind: "continuous", pos: 4, sal: 2 },
      CD: { kind: "continuous", pos: 4, sal: 2 },
      CU: { kind: "continuous", pos: 5, sal: 2 },
      MOR: { kind: "continuous", pos: 3, sal: 1 },
      PRO: { kind: "continuous", pos: 4, sal: 2 },
      COM: { kind: "continuous", pos: 3, sal: 1 },
      ZS: { kind: "continuous", pos: 2, sal: 1 },
      ONT_H: { kind: "continuous", pos: 3, sal: 1 },
      ONT_S: { kind: "continuous", pos: 2, sal: 1 },
      PF: { kind: "continuous", pos: 3, sal: 1 },
      TRB: { kind: "continuous", pos: 2, sal: 1 },
      ENG: { kind: "continuous", pos: 4, sal: 2 },
      EPS: { kind: "categorical", probs: [0.1, 0.5, 0.15, 0.1, 0.1, 0.05], sal: 2 },
      // Traditionalist
      AES: { kind: "categorical", probs: [0.1, 0.5, 0.15, 0.1, 0.1, 0.05], sal: 2 }
      // Systematic
    }
  },
  {
    id: "140",
    name: "Market Green Modernist",
    tier: "T1",
    prior: 1 / 130,
    nodes: {
      MAT: { kind: "continuous", pos: 4, sal: 2 },
      CD: { kind: "continuous", pos: 1, sal: 2 },
      CU: { kind: "continuous", pos: 5, sal: 2 },
      MOR: { kind: "continuous", pos: 2, sal: 1 },
      PRO: { kind: "continuous", pos: 5, sal: 2 },
      COM: { kind: "continuous", pos: 4, sal: 2 },
      ZS: { kind: "continuous", pos: 1, sal: 1 },
      ONT_H: { kind: "continuous", pos: 5, sal: 2 },
      ONT_S: { kind: "continuous", pos: 5, sal: 2 },
      PF: { kind: "continuous", pos: 1, sal: 1 },
      TRB: { kind: "continuous", pos: 1, sal: 1 },
      ENG: { kind: "continuous", pos: 4, sal: 2 },
      EPS: { kind: "categorical", probs: [0.7, 0.05, 0.1, 0.05, 0.05, 0.05], sal: 3 },
      // Empiricist
      AES: { kind: "categorical", probs: [0.1, 0.6, 0.1, 0.05, 0.1, 0.05], sal: 2 }
      // Systematic
    }
  }
];

// src/historical/elections-1789-1852.ts
var election1789 = {
  year: 1789,
  candidates: [
    {
      name: "Washington",
      party: "Independent",
      year: 1789,
      MAT: 3,
      // Centrist - planter aristocrat but supported Hamilton's program
      CD: 3,
      // Culturally moderate - Enlightenment values
      CU: 3,
      // Mixed - national unity focus
      MOR: 4,
      // Wide moral circle - "all men" rhetoric (limited in practice)
      PRO: 5,
      // Maximum proceduralist - Constitution, precedent-setting
      COM: 5,
      // Maximum compromiser - held factions together
      ZS: 2,
      // Positive-sum - new nation optimism
      ONT_H: 4,
      // Optimistic - republic experiment
      ONT_S: 2,
      // System new and working - he's building it
      PF: 1,
      // Maximum independent - warned against factions
      TRB: 1,
      // No tribal - national father figure
      ENG: 5,
      // Maximum - accepted the call
      EPS: 1,
      // Institutionalist - building institutions
      AES: 0
      // Statesman - Cincinnatus
    }
  ]
};
var election1792 = {
  year: 1792,
  candidates: [
    {
      name: "Washington",
      party: "Independent",
      year: 1792,
      MAT: 3,
      CD: 3,
      CU: 3,
      MOR: 4,
      PRO: 5,
      COM: 5,
      ZS: 2,
      ONT_H: 4,
      ONT_S: 2,
      PF: 1,
      TRB: 1,
      ENG: 4,
      EPS: 1,
      AES: 0
    }
  ]
};
var election1796 = {
  year: 1796,
  candidates: [
    {
      name: "Adams",
      party: "Federalist",
      year: 1796,
      MAT: 4,
      // Pro-commerce, pro-tariff
      CD: 4,
      // Culturally conservative - Puritan New England values
      CU: 3,
      // Mixed - British alliance but national focus
      MOR: 3,
      // Moderate moral circle
      PRO: 5,
      // Maximum proceduralist - rule of law, Constitution
      COM: 3,
      // Mixed - principled but stubborn
      ZS: 3,
      // Mixed - worried about French threat
      ONT_H: 2,
      // Pessimistic - distrusted popular passions
      ONT_S: 2,
      // System working - defend it from demagogues
      PF: 4,
      // Strong Federalist
      TRB: 3,
      // Moderate - New England identity
      ENG: 4,
      // Engaged
      EPS: 1,
      // Institutionalist - government as stabilizer
      AES: 0
      // Statesman - gravitas, learning
    },
    {
      name: "Jefferson",
      party: "Democratic-Republican",
      year: 1796,
      MAT: 2,
      // Agrarian populist
      CD: 2,
      // Culturally open
      CU: 4,
      // Internationalist
      MOR: 4,
      // Wide moral circle
      PRO: 2,
      // Anti-federal power - states' rights skeptic
      COM: 2,
      // Low compromise - partisan opposition
      ZS: 3,
      // Mixed
      ONT_H: 4,
      // Optimistic
      ONT_S: 4,
      // System corrupted by Federalists
      PF: 5,
      // Maximum D-R partisan
      TRB: 4,
      // Factional - planter/agrarian identity
      ENG: 4,
      // Engaged
      EPS: 0,
      // Empiricist
      AES: 5
      // Visionary
    }
  ]
};
var election1800 = {
  year: 1800,
  candidates: [
    {
      name: "Jefferson",
      party: "Democratic-Republican",
      year: 1800,
      MAT: 1,
      // Maximum populist signal - opposition to Hamilton's system
      CD: 1,
      // Maximum cultural openness - religious freedom, anti-established church
      CU: 5,
      // Maximum universalist - rights of man, French Revolution sympathy
      MOR: 5,
      // Maximum universalist moral circle
      PRO: 2,
      // Anti-proceduralist - opposed Alien & Sedition Acts, federal overreach
      COM: 2,
      // Low compromise - revolutionary rhetoric
      ZS: 2,
      // Positive-sum
      ONT_H: 5,
      // Maximum optimistic
      ONT_S: 4,
      // System needs overhaul - "revolution" against Federalist tyranny
      PF: 5,
      // Maximum partisan - built party machine
      TRB: 4,
      // High tribal - yeoman farmer vs. merchant class
      ENG: 5,
      // Maximum engagement
      EPS: 0,
      // Empiricist
      AES: 5
      // Visionary
    },
    {
      name: "Adams",
      party: "Federalist",
      year: 1800,
      MAT: 5,
      // Maximum pro-commerce - Hamilton's system
      CD: 5,
      // Maximum cultural conservatism - Alien & Sedition Acts
      CU: 1,
      // Maximum closed - nativist legislation
      MOR: 1,
      // Narrow moral circle - elite governance
      PRO: 5,
      // Maximum proceduralist
      COM: 2,
      // Low compromise - stubborn
      ZS: 4,
      // Zero-sum - French threat, partisan enemies
      ONT_H: 1,
      // Maximum pessimistic - distrusted the mob
      ONT_S: 1,
      // System working - defend it
      PF: 5,
      // Maximum Federalist
      TRB: 4,
      // High tribal - Federalist establishment
      ENG: 4,
      // Engaged but aloof
      EPS: 1,
      // Institutionalist
      AES: 0
      // Statesman
    }
  ]
};
var election1804 = {
  year: 1804,
  candidates: [
    {
      name: "Jefferson",
      party: "Democratic-Republican",
      year: 1804,
      MAT: 2,
      CD: 2,
      CU: 4,
      MOR: 4,
      PRO: 3,
      COM: 3,
      ZS: 2,
      ONT_H: 4,
      ONT_S: 2,
      PF: 4,
      TRB: 3,
      ENG: 5,
      EPS: 0,
      AES: 5
    },
    {
      name: "Pinckney",
      party: "Federalist",
      year: 1804,
      MAT: 5,
      CD: 5,
      CU: 1,
      MOR: 1,
      PRO: 5,
      COM: 3,
      ZS: 4,
      ONT_H: 2,
      ONT_S: 1,
      PF: 4,
      TRB: 4,
      ENG: 3,
      EPS: 1,
      AES: 0
    }
  ]
};
var election1808 = {
  year: 1808,
  candidates: [
    {
      name: "Madison",
      party: "Democratic-Republican",
      year: 1808,
      MAT: 2,
      // Moderate - Constitution framer, more institutional than Jefferson
      CD: 2,
      // Culturally open
      CU: 4,
      // Internationalist but navigating embargo
      MOR: 4,
      // Wide moral circle
      PRO: 5,
      // Maximum proceduralist - Father of the Constitution
      COM: 4,
      // Compromiser - Great Compromiser at Convention
      ZS: 2,
      // Positive-sum
      ONT_H: 4,
      // Optimistic
      ONT_S: 2,
      // System working - he designed it
      PF: 4,
      // Strong D-R
      TRB: 2,
      // Low tribal - intellectual
      ENG: 4,
      // Engaged
      EPS: 0,
      // Empiricist - political theorist
      AES: 1
      // Technocrat - policy wonk of his era
    },
    {
      name: "Pinckney",
      party: "Federalist",
      year: 1808,
      MAT: 5,
      CD: 5,
      CU: 1,
      MOR: 2,
      PRO: 5,
      COM: 3,
      ZS: 4,
      ONT_H: 2,
      ONT_S: 1,
      PF: 4,
      TRB: 4,
      ENG: 3,
      EPS: 1,
      AES: 0
    }
  ]
};
var election1812 = {
  year: 1812,
  candidates: [
    {
      name: "Madison",
      party: "Democratic-Republican",
      year: 1812,
      MAT: 2,
      CD: 2,
      CU: 4,
      MOR: 4,
      PRO: 4,
      COM: 3,
      ZS: 3,
      ONT_H: 3,
      ONT_S: 3,
      PF: 4,
      TRB: 3,
      ENG: 5,
      EPS: 0,
      AES: 0
    },
    {
      name: "Clinton",
      party: "Federalist",
      year: 1812,
      MAT: 4,
      CD: 4,
      CU: 2,
      MOR: 2,
      PRO: 5,
      COM: 4,
      ZS: 3,
      ONT_H: 3,
      ONT_S: 2,
      PF: 3,
      TRB: 3,
      ENG: 4,
      EPS: 1,
      AES: 1
    }
  ]
};
var election1816 = {
  year: 1816,
  candidates: [
    {
      name: "Monroe",
      party: "Democratic-Republican",
      year: 1816,
      MAT: 2,
      CD: 2,
      CU: 4,
      MOR: 4,
      PRO: 4,
      COM: 5,
      ZS: 1,
      ONT_H: 5,
      ONT_S: 1,
      PF: 3,
      TRB: 2,
      ENG: 4,
      EPS: 1,
      AES: 0
    },
    {
      name: "King",
      party: "Federalist",
      year: 1816,
      MAT: 5,
      CD: 5,
      CU: 1,
      MOR: 1,
      PRO: 5,
      COM: 3,
      ZS: 4,
      ONT_H: 2,
      ONT_S: 2,
      PF: 4,
      TRB: 4,
      ENG: 3,
      EPS: 1,
      AES: 0
    }
  ]
};
var election1820 = {
  year: 1820,
  candidates: [
    {
      name: "Monroe",
      party: "Democratic-Republican",
      year: 1820,
      MAT: 3,
      CD: 3,
      CU: 4,
      MOR: 4,
      PRO: 4,
      COM: 5,
      ZS: 1,
      ONT_H: 5,
      ONT_S: 1,
      PF: 2,
      TRB: 1,
      ENG: 3,
      EPS: 1,
      AES: 0
    }
  ]
};
var election1824 = {
  year: 1824,
  candidates: [
    {
      name: "Adams",
      party: "Democratic-Republican",
      year: 1824,
      MAT: 5,
      // Pro-commerce, American System, tariffs - push extreme to differentiate
      CD: 5,
      // Culturally conservative elite - Puritan gravitas
      CU: 1,
      // Assimilationist - national project, not pluralist
      MOR: 1,
      // Narrow moral circle - establishment elite
      PRO: 5,
      // Maximum proceduralist - institutional
      COM: 4,
      // Compromiser - corrupt bargain
      ZS: 2,
      // Positive-sum
      ONT_H: 2,
      // Pessimistic - distrusted popular passions
      ONT_S: 1,
      // System working - defend from demagogues
      PF: 4,
      // Strong establishment
      TRB: 2,
      // Low tribal
      ENG: 4,
      // Engaged
      EPS: 1,
      // Institutionalist
      AES: 1
      // Technocrat
    },
    {
      name: "Jackson",
      party: "Democratic-Republican",
      year: 1824,
      MAT: 2,
      // Populist - bank opposition, anti-elite economics
      CD: 3,
      // Moderate cultural - frontier but broad appeal
      CU: 3,
      // Mixed - expansion but national unity
      MOR: 3,
      // Moderate - broad "common man" appeal
      PRO: 2,
      // Anti-procedural - military hero, direct action
      COM: 2,
      // Low compromise but not extreme
      ZS: 3,
      // Mixed
      ONT_H: 3,
      // Moderate
      ONT_S: 4,
      // System needs reform - elites rigged it
      PF: 3,
      // Building a new party
      TRB: 4,
      // Tribal - common man identity
      ENG: 5,
      // Maximum engagement
      EPS: 3,
      // Intuitionist - gut instinct
      AES: 4
      // Fighter - Old Hickory
    },
    {
      name: "Crawford",
      party: "Democratic-Republican",
      year: 1824,
      MAT: 5,
      CD: 5,
      CU: 1,
      MOR: 1,
      PRO: 5,
      COM: 4,
      ZS: 4,
      ONT_H: 2,
      ONT_S: 1,
      PF: 5,
      TRB: 4,
      ENG: 3,
      EPS: 1,
      AES: 0
    },
    {
      name: "Clay",
      party: "Democratic-Republican",
      year: 1824,
      MAT: 5,
      // American System - tariffs, pro-commerce, push extreme
      CD: 4,
      // Conservative - establishment
      CU: 1,
      // Assimilationist - national project
      MOR: 2,
      // Narrow-ish
      PRO: 5,
      // Maximum proceduralist
      COM: 5,
      // Maximum compromiser
      ZS: 2,
      // Positive-sum
      ONT_H: 3,
      // Moderate
      ONT_S: 1,
      // System working
      PF: 4,
      // Strong establishment
      TRB: 2,
      // Low tribal
      ENG: 5,
      // Maximum
      EPS: 1,
      // Institutionalist
      AES: 0
      // Statesman
    }
  ]
};
var election1828 = {
  year: 1828,
  candidates: [
    {
      name: "Jackson",
      party: "Democratic",
      year: 1828,
      MAT: 2,
      CD: 3,
      CU: 3,
      MOR: 3,
      PRO: 2,
      COM: 2,
      ZS: 3,
      ONT_H: 3,
      ONT_S: 4,
      PF: 4,
      TRB: 4,
      ENG: 5,
      EPS: 3,
      AES: 4
    },
    {
      name: "Adams",
      party: "National Republican",
      year: 1828,
      MAT: 5,
      CD: 5,
      CU: 1,
      MOR: 1,
      PRO: 5,
      COM: 3,
      ZS: 3,
      ONT_H: 2,
      ONT_S: 1,
      PF: 4,
      TRB: 2,
      ENG: 3,
      EPS: 1,
      AES: 1
    }
  ]
};
var election1832 = {
  year: 1832,
  candidates: [
    {
      name: "Jackson",
      party: "Democratic",
      year: 1832,
      MAT: 2,
      // Bank War - populist anti-elite economics
      CD: 3,
      CU: 3,
      MOR: 3,
      PRO: 2,
      COM: 2,
      ZS: 3,
      ONT_H: 3,
      ONT_S: 4,
      PF: 4,
      TRB: 4,
      ENG: 5,
      EPS: 3,
      AES: 4
    },
    {
      name: "Clay",
      party: "National Republican",
      year: 1832,
      MAT: 5,
      CD: 5,
      CU: 1,
      MOR: 1,
      PRO: 5,
      COM: 5,
      ZS: 2,
      ONT_H: 2,
      ONT_S: 1,
      PF: 5,
      TRB: 2,
      ENG: 5,
      EPS: 1,
      AES: 0
    }
  ]
};
var election1836 = {
  year: 1836,
  candidates: [
    {
      name: "Van Buren",
      party: "Democratic",
      year: 1836,
      MAT: 2,
      // Redistributive — labor friendly, Jacksonian heir
      CD: 3,
      // Moderate
      CU: 3,
      // Mixed
      MOR: 3,
      // Moderate universalist
      PRO: 3,
      // Mixed — machine politician but competent
      COM: 4,
      // Compromiser — "Little Magician"
      ZS: 3,
      // Mixed — Jacksonian optimism
      ONT_H: 3,
      // Moderate
      ONT_S: 3,
      // Mixed — system working but challenges
      PF: 4,
      // Strong partisan
      TRB: 3,
      // Moderate — northern coalition builder
      ENG: 5,
      // Maximum
      EPS: 1,
      // Institutionalist - party builder
      AES: 1
      // Technocrat - operator/fixer
    },
    {
      name: "Harrison",
      party: "Whig",
      year: 1836,
      MAT: 5,
      CD: 5,
      CU: 1,
      MOR: 1,
      PRO: 5,
      COM: 4,
      ZS: 3,
      ONT_H: 3,
      ONT_S: 3,
      PF: 2,
      TRB: 2,
      ENG: 3,
      EPS: 2,
      AES: 3
    }
  ]
};
var election1840 = {
  year: 1840,
  candidates: [
    {
      name: "Harrison",
      party: "Whig",
      year: 1840,
      MAT: 4,
      // Pro-market - Whig economics
      CD: 4,
      // Culturally conservative
      CU: 2,
      // Assimilationist
      MOR: 2,
      // Narrow moral circle
      PRO: 4,
      // Proceduralist - Whig constitutionalism
      COM: 4,
      // Compromiser
      ZS: 2,
      // Positive-sum - prosperity message
      ONT_H: 3,
      // Moderate
      ONT_S: 4,
      // System needs change - Depression of 1837 blamed on Van Buren
      PF: 4,
      // Strong Whig
      TRB: 4,
      // High tribal - "log cabin and hard cider" populism
      ENG: 5,
      // Maximum - massive campaign
      EPS: 3,
      // Intuitionist - ran on image not policy
      AES: 3
      // Authentic - "log cabin" common man image
    },
    {
      name: "Van Buren",
      party: "Democratic",
      year: 1840,
      MAT: 1,
      // Blamed for depression
      CD: 1,
      // Extreme left
      CU: 5,
      // Extreme internationalist
      MOR: 5,
      // Extreme universalist
      PRO: 1,
      // Anti-procedural - failed policies
      COM: 1,
      // Never compromise - stubborn incumbent
      ZS: 5,
      // Zero-sum - depression scarcity thinking
      ONT_H: 1,
      // Pessimistic - failed
      ONT_S: 1,
      // System working (incumbent defense)
      PF: 5,
      TRB: 5,
      ENG: 5,
      EPS: 1,
      AES: 1
    }
  ]
};
var election1844 = {
  year: 1844,
  candidates: [
    {
      name: "Polk",
      party: "Democratic",
      year: 1844,
      MAT: 3,
      // Moderate - tariff reform but not radical
      CD: 3,
      // Moderate - Southern but broad appeal
      CU: 2,
      // Mild assimilationist - expansion
      MOR: 3,
      // Moderate
      PRO: 3,
      // Mixed
      COM: 3,
      // Mixed - pragmatic
      ZS: 2,
      // Positive-sum - expansion as opportunity for all
      ONT_H: 3,
      // Moderate
      ONT_S: 3,
      // Mixed
      PF: 4,
      // Strong Democrat
      TRB: 3,
      // Moderate - broad coalition
      ENG: 5,
      // Maximum - energized dark horse
      EPS: 3,
      // Intuitionist
      AES: 4
      // Fighter - aggressive expansionist
    },
    {
      name: "Clay",
      party: "Whig",
      year: 1844,
      MAT: 5,
      CD: 5,
      CU: 1,
      MOR: 1,
      PRO: 5,
      COM: 5,
      ZS: 1,
      ONT_H: 2,
      ONT_S: 1,
      PF: 5,
      TRB: 1,
      ENG: 5,
      EPS: 1,
      AES: 0
    }
  ]
};
var election1848 = {
  year: 1848,
  candidates: [
    {
      name: "Taylor",
      party: "Whig",
      year: 1848,
      MAT: 4,
      // Pro-market Whig
      CD: 4,
      // Culturally conservative - slaveholder, military
      CU: 2,
      // Assimilationist - national unity
      MOR: 2,
      // Narrow - slaveholder
      PRO: 3,
      // Mixed - military man, above politics
      COM: 4,
      // Compromiser - "no party" stance
      ZS: 3,
      // Mixed
      ONT_H: 3,
      // Moderate
      ONT_S: 2,
      // System fine - just needs steady hand
      PF: 1,
      // Maximum independent - "I am a Whig but not an ultra Whig"
      TRB: 3,
      // Moderate - military hero identity
      ENG: 3,
      // Moderate - reluctant candidate
      EPS: 3,
      // Intuitionist - military man
      AES: 0
      // Statesman - war hero
    },
    {
      name: "Cass",
      party: "Democratic",
      year: 1848,
      MAT: 1,
      CD: 1,
      CU: 5,
      MOR: 5,
      PRO: 1,
      COM: 2,
      ZS: 4,
      ONT_H: 3,
      ONT_S: 4,
      PF: 5,
      TRB: 5,
      ENG: 4,
      EPS: 3,
      AES: 0
    },
    {
      name: "Van Buren",
      party: "Free Soil",
      year: 1848,
      MAT: 1,
      // Maximum redistributive - anti-slavery economics
      CD: 1,
      // Maximum cultural openness - anti-slavery moral crusade
      CU: 5,
      // Maximum universalist - free soil, free labor
      MOR: 5,
      // Maximum universalist - anti-slavery expansion
      PRO: 4,
      // Proceduralist - constitutional anti-slavery
      COM: 1,
      // Never compromise - broke from Democrats over slavery
      ZS: 2,
      // Positive-sum - free labor ideology
      ONT_H: 4,
      // Optimistic
      ONT_S: 5,
      // System broken - slavery corrupting republic
      PF: 1,
      // Independent - third party
      TRB: 3,
      // Moderate
      ENG: 5,
      // Maximum - came out of retirement
      EPS: 0,
      // Empiricist
      AES: 5
      // Visionary - moral crusade
    }
  ]
};
var election1852 = {
  year: 1852,
  candidates: [
    {
      name: "Pierce",
      party: "Democratic",
      year: 1852,
      MAT: 2,
      // Moderate redistributive
      CD: 4,
      // Culturally conservative - Northern doughface, pro-South
      CU: 1,
      // Assimilationist - expansion, nativist tendencies
      MOR: 1,
      // Narrow moral circle - enforced Fugitive Slave Act
      PRO: 2,
      // Anti-procedural - Kansas-Nebraska, executive overreach
      COM: 3,
      // Mixed - tried to hold party together
      ZS: 3,
      // Mixed
      ONT_H: 3,
      // Moderate
      ONT_S: 2,
      // System working - status quo on slavery
      PF: 5,
      // Maximum Democrat - party unity above all
      TRB: 4,
      // High tribal - Democratic identity
      ENG: 4,
      // Engaged
      EPS: 1,
      // Institutionalist
      AES: 3
      // Authentic - "handsome Frank," young, vigorous
    },
    {
      name: "Scott",
      party: "Whig",
      year: 1852,
      MAT: 5,
      CD: 5,
      CU: 1,
      MOR: 1,
      PRO: 5,
      COM: 5,
      ZS: 2,
      ONT_H: 1,
      ONT_S: 1,
      PF: 2,
      TRB: 1,
      ENG: 2,
      EPS: 1,
      AES: 0
    }
  ]
};
var ELECTIONS_1789_1852 = [
  election1789,
  election1792,
  election1796,
  election1800,
  election1804,
  election1808,
  election1812,
  election1816,
  election1820,
  election1824,
  election1828,
  election1832,
  election1836,
  election1840,
  election1844,
  election1848,
  election1852
];

// src/historical/elections-1856-1888.ts
var election1856 = {
  year: 1856,
  candidates: [
    {
      name: "Buchanan",
      party: "Democratic",
      year: 1856,
      MAT: 4,
      // Pro-planter economics - low tariff, free trade, agrarian elite
      CD: 4,
      // Culturally conservative - defended southern social order, status quo
      CU: 2,
      // Particularist - states' rights, popular sovereignty, not universal principles
      MOR: 2,
      // Narrow moral circle - willing to tolerate slavery for Union's sake
      PRO: 4,
      // Proceduralist - legalist, Compromise of 1850, Dred Scott compliance
      COM: 5,
      // Maximum compromiser - entire platform was compromise to hold Union together
      ZS: 3,
      // Mixed - believed compromise could produce positive outcomes but defensive
      ONT_H: 2,
      // Pessimistic - feared social disruption, human nature requires order
      ONT_S: 1,
      // System fine - Constitution as-is protects slavery, don't change it
      PF: 5,
      // Maximum partisan - Democratic Party machine, Jacksonian tradition
      TRB: 4,
      // High tribal - southern planter class + northern Catholic immigrants
      ENG: 4,
      // Engaged - career diplomat/politician, but "Old Buck" was cautious
      EPS: 1,
      // Institutionalist - trusted constitutional framework, legal precedent
      AES: 0
      // Statesman - elder diplomat, gravitas, experienced hand
    },
    {
      name: "Fremont",
      party: "Republican",
      year: 1856,
      MAT: 1,
      // Push extreme - free labor, anti-planter economics
      CD: 1,
      // Maximum culturally open - anti-slavery, progressive
      CU: 5,
      // Maximum universalist - Free Soil, Free Labor, Free Men
      MOR: 5,
      // Maximum moral circle - anti-slavery crusade
      PRO: 2,
      // Anti-procedural - new party challenging entire system
      COM: 1,
      // Never compromise - sectional candidate, no deals with slave power
      ZS: 2,
      // Positive-sum
      ONT_H: 5,
      // Maximum optimistic - free labor utopia
      ONT_S: 5,
      // System broken - slave power conspiracy
      PF: 5,
      // Maximum partisan - new party zealot
      TRB: 5,
      // Maximum tribal - northern identity
      ENG: 5,
      // Maximum engagement
      EPS: 3,
      // Intuitionist
      AES: 5
      // Visionary
    },
    {
      name: "Fillmore",
      party: "Independent",
      // Know-Nothing / American Party
      year: 1856,
      MAT: 4,
      // Pro-business - Whig economics, tariff supporter
      CD: 5,
      // Maximum cultural closure - nativist, anti-Catholic, anti-immigrant
      CU: 1,
      // Maximum particularist - "Americans must rule America," closed borders
      MOR: 1,
      // Maximum narrow - nativist exclusion, Protestant-only moral community
      PRO: 4,
      // Proceduralist - legalist, Compromise of 1850 architect as president
      COM: 4,
      // Compromiser - ran as Union candidate, above-sectional-conflict
      ZS: 4,
      // Zero-sum - immigrants taking American jobs, Catholic conspiracy fears
      ONT_H: 2,
      // Pessimistic - feared foreign subversion, society under threat
      ONT_S: 3,
      // Mixed - system threatened by immigration, needs protection not overhaul
      PF: 2,
      // Low partisan - bolted from Whigs, ran on third-party ticket
      TRB: 5,
      // Maximum tribal - "native-born Americans" as identity, Protestant nativism
      ENG: 4,
      // Engaged - ex-president running again on nativist platform
      EPS: 2,
      // Traditionalist - "the way things were" before immigrant wave
      AES: 0
      // Statesman - ex-president, tried to project elder authority
    }
  ]
};
var election1860 = {
  year: 1860,
  candidates: [
    {
      name: "Lincoln",
      party: "Republican",
      year: 1860,
      MAT: 3,
      // Mixed - free labor, Homestead Act (yeoman farmer), but pro-tariff for industry
      CD: 2,
      // Culturally open - anti-slavery expansion, moral opposition to slavery
      CU: 4,
      // Universalist - Declaration of Independence, "all men are created equal"
      MOR: 5,
      // Maximum wide moral circle - slavery is morally wrong, must not expand
      PRO: 5,
      // Maximum proceduralist - won't touch slavery where Constitution protects it
      COM: 3,
      // Mixed - principled on slavery expansion but pragmatic coalition builder
      ZS: 2,
      // Positive-sum - free labor benefits everyone, "right to rise"
      ONT_H: 4,
      // Optimistic - believed in human improvement, self-made man narrative
      ONT_S: 3,
      // Mixed - system needs correction on slavery but Constitution basically sound
      PF: 4,
      // Strong Republican - party's champion, but attracted ex-Whigs and Know-Nothings
      TRB: 3,
      // Moderate tribal - northern free-state identity but universal rhetoric
      ENG: 5,
      // Maximum engagement - historic stakes, tireless campaigner (through surrogates)
      EPS: 0,
      // Empiricist - lawyer, logical reasoning, Lincoln-Douglas debates
      AES: 3
      // Authentic - "Rail-Splitter," log cabin, self-made man
    },
    {
      name: "Douglas",
      party: "Democratic",
      year: 1860,
      MAT: 3,
      // Centrist - popular sovereignty, let markets and voters decide
      CD: 3,
      // Culturally moderate - tried to straddle slavery issue, not moralist
      CU: 3,
      // Mixed - popular sovereignty = local choice, neither universalist nor closed
      MOR: 3,
      // Center - refused to call slavery morally wrong, "I don't care" stance
      PRO: 4,
      // Proceduralist - popular sovereignty IS proceduralism, let the process decide
      COM: 5,
      // Maximum compromiser - career built on compromise, "Little Giant" dealmaker
      ZS: 3,
      // Mixed - believed compromise avoided conflict
      ONT_H: 3,
      // Moderate - pragmatic, not idealistic
      ONT_S: 2,
      // System working - popular sovereignty can resolve crisis within existing order
      PF: 5,
      // Maximum partisan - Democratic Party man, fought for party unity
      TRB: 3,
      // Moderate tribal - tried to be national, not sectional
      ENG: 5,
      // Maximum engagement - campaigned nationally even when cause was lost
      EPS: 1,
      // Institutionalist - trusted democratic process, popular sovereignty
      AES: 4
      // Fighter - "Little Giant," combative debater, tireless campaigner
    },
    {
      name: "Breckinridge",
      party: "Democratic",
      // Southern Democrat faction
      year: 1860,
      MAT: 4,
      // Pro-planter - slave economy, low tariff, agrarian elite
      CD: 5,
      // Maximum cultural closure - slavery is a positive good, white supremacy
      CU: 1,
      // Maximum particularist - states' rights, slave property paramount
      MOR: 1,
      // Maximum narrow moral circle - slavery, racial hierarchy, white-only citizenship
      PRO: 2,
      // Anti-proceduralist - defied party, would defy Union if slavery not protected
      COM: 1,
      // Never compromise - slavery must be protected everywhere, no concessions
      ZS: 5,
      // Maximum zero-sum - racial hierarchy, slave labor vs free labor
      ONT_H: 1,
      // Maximum pessimistic - fixed racial hierarchy, human nature unchangeable
      ONT_S: 4,
      // System broken - federal government failing to protect slave property
      PF: 3,
      // Moderate partisan - split from main Democratic Party, sectional
      TRB: 5,
      // Maximum tribal - white southern slaveholder identity
      ENG: 5,
      // Maximum engagement - existential stakes for slavery, secession looming
      EPS: 2,
      // Traditionalist - "peculiar institution" as tradition, ancestral ways
      AES: 0
      // Statesman - Vice President, senior Southern dignitary
    },
    {
      name: "Bell",
      party: "Independent",
      // Constitutional Union
      year: 1860,
      MAT: 5,
      // Pro-business Whig — tariff, planter economics
      CD: 4,
      // Conservative — Southern slaveholder, traditional
      CU: 2,
      // Assimilationist — Union but no pluralism
      MOR: 2,
      // Narrow — avoided moral stance on slavery
      PRO: 5,
      // Maximum proceduralist — Constitution above all
      COM: 5,
      // Maximum compromiser — avoiding the issue
      ZS: 2,
      // Positive-sum
      ONT_H: 2,
      // Skeptical
      ONT_S: 1,
      // System fine
      PF: 1,
      // Independent
      TRB: 2,
      // Low tribal
      ENG: 2,
      // Low — ran as calming presence
      EPS: 1,
      // Institutionalist - trusted constitutional framework above all
      AES: 0
      // Statesman - elder Whig, dignified, above-the-fray
    }
  ]
};
var election1864 = {
  year: 1864,
  candidates: [
    {
      name: "Lincoln",
      party: "Republican",
      year: 1864,
      MAT: 3,
      // Mixed - wartime spending, Homestead Act, but pro-tariff and railroad subsidies
      CD: 1,
      // Maximum culturally open - Emancipation Proclamation, abolition amendment
      CU: 5,
      // Maximum universalist - "all men are created equal" now includes Black men
      MOR: 5,
      // Maximum wide moral circle - abolition, "new birth of freedom"
      PRO: 4,
      // Proceduralist - sought constitutional amendment for abolition, but stretched executive power in wartime
      COM: 3,
      // Mixed - "with malice toward none" but uncompromising on Union and abolition
      ZS: 2,
      // Positive-sum - Union victory benefits all, free labor for all
      ONT_H: 4,
      // Optimistic - "better angels of our nature," believed in human improvement
      ONT_S: 4,
      // System needs reform - 13th Amendment, fundamental constitutional change
      PF: 4,
      // Strong Republican - ran as "National Union" to broaden coalition
      TRB: 3,
      // Moderate tribal - national unity rhetoric, "Union" above faction
      ENG: 5,
      // Maximum engagement - wartime president, existential stakes
      EPS: 0,
      // Empiricist - lawyer, logical, adapted strategy to evidence
      AES: 5
      // Visionary - Gettysburg Address, "new birth of freedom," transformative
    },
    {
      name: "McClellan",
      party: "Democratic",
      year: 1864,
      MAT: 5,
      // Push extreme - planter/merchant economics, restore old order
      CD: 5,
      // Maximum conservative - opposed emancipation, restore old Union
      CU: 1,
      // Maximum assimilationist - states' rights, no rights for Black people
      MOR: 1,
      // Maximum narrow moral circle - pro-slavery party
      PRO: 5,
      // Maximum proceduralist - attacked Lincoln's wartime executive overreach
      COM: 4,
      // Compromiser - negotiated peace, restore Union through concession
      ZS: 4,
      // Zero-sum - war is destroying both sides, stop the bleeding
      ONT_H: 2,
      // Pessimistic - war is failing, carnage is pointless
      ONT_S: 2,
      // System was fine - prewar Union should be restored as-was
      PF: 4,
      // Strong Democrat - party nominee, but repudiated peace plank
      TRB: 4,
      // Tribal - northern Democrats, peace movement, anti-Black-equality
      ENG: 4,
      // Engaged - but ran cautious campaign, let party do the work
      EPS: 1,
      // Institutionalist - military man, trusted hierarchy and order
      AES: 0
      // Statesman - "Young Napoleon," military prestige, gravitas
    }
  ]
};
var election1868 = {
  year: 1868,
  candidates: [
    {
      name: "Grant",
      party: "Republican",
      year: 1868,
      MAT: 3,
      // Mixed - supported sound money, pro-business, but also Freedmen's Bureau spending
      CD: 2,
      // Culturally open - supported Reconstruction, Black suffrage, anti-KKK
      CU: 4,
      // Universalist - equal citizenship regardless of race, 14th Amendment
      MOR: 4,
      // Wide moral circle - defended freedmen, crushed KKK, expanded rights
      PRO: 4,
      // Proceduralist - military discipline, constitutional amendments, rule of law
      COM: 3,
      // Mixed - "let us have peace" but uncompromising on Reconstruction
      ZS: 2,
      // Positive-sum - Union victory benefits all, national reconciliation
      ONT_H: 3,
      // Moderate - military realist, not utopian, but believed in progress
      ONT_S: 3,
      // Mixed - Reconstruction reforms but didn't seek systemic economic overhaul
      PF: 4,
      // Strong Republican - party's hero, Reconstruction champion
      TRB: 3,
      // Moderate tribal - national unity appeal, but firmly Republican
      ENG: 4,
      // Engaged - but quiet, let reputation speak, not a campaigner
      EPS: 0,
      // Empiricist - military pragmatist, evidence and results over theory
      AES: 3
      // Authentic - plain-spoken, simple, honest soldier
    },
    {
      name: "Seymour",
      party: "Democratic",
      year: 1868,
      MAT: 4,
      // Pro-planter/merchant - opposed Reconstruction spending, low tariff
      CD: 5,
      // Maximum cultural closure - "white man's government," anti-Black suffrage
      CU: 1,
      // Maximum particularist - states' rights, opposed 14th Amendment
      MOR: 1,
      // Maximum narrow moral circle - white-only citizenship, racial hierarchy
      PRO: 3,
      // Mixed - invoked Constitution but selectively, opposed amendments
      COM: 3,
      // Mixed - reluctant nominee, tried to moderate but base was extreme
      ZS: 5,
      // Maximum zero-sum - racial competition, Black rights = white dispossession
      ONT_H: 1,
      // Maximum pessimistic - fixed racial hierarchy, Reconstruction is tyranny
      ONT_S: 4,
      // System broken - Reconstruction is destroying constitutional order
      PF: 4,
      // Strong Democrat - party nominee, but reluctant
      TRB: 5,
      // Maximum tribal - white racial identity, anti-Reconstruction solidarity
      ENG: 3,
      // Moderate engagement - reluctant candidate, lackluster campaign
      EPS: 2,
      // Traditionalist - antebellum order was correct, restore it
      AES: 0
      // Statesman - governor, tried for dignified image
    }
  ]
};
var election1872 = {
  year: 1872,
  candidates: [
    {
      name: "Grant",
      party: "Republican",
      year: 1872,
      MAT: 3,
      // Mixed - sound money, pro-business, but continued Freedmen's Bureau
      CD: 2,
      // Culturally open - continued Reconstruction, KKK suppression
      CU: 4,
      // Universalist - equal rights enforcement, 15th Amendment
      MOR: 4,
      // Wide moral circle - defended Black rights against Klan violence
      PRO: 3,
      // Mixed - strong executive, used military force, but constitutional
      COM: 3,
      // Mixed - unyielding on Reconstruction but administration was pragmatic
      ZS: 2,
      // Positive-sum - national prosperity narrative, stability
      ONT_H: 3,
      // Moderate - experienced realism, scandals tarnishing idealism
      ONT_S: 2,
      // System working - Reconstruction is succeeding, stay the course
      PF: 5,
      // Maximum partisan - incumbent Republican, party-line Reconstruction
      TRB: 3,
      // Moderate tribal - national unity, but firmly identified with freedmen
      ENG: 4,
      // Engaged - incumbent seeking reelection
      EPS: 0,
      // Empiricist - military results-oriented pragmatist
      AES: 3
      // Authentic - plain soldier, unpretentious, honest reputation (despite scandals)
    },
    {
      name: "Greeley",
      party: "Democratic",
      // Liberal Republican + Democratic fusion
      year: 1872,
      MAT: 3,
      // Mixed - reformer but not redistributionist, lower tariff, civil service
      CD: 2,
      // Culturally open - lifelong abolitionist, progressive reformer
      CU: 4,
      // Universalist - abolitionist, but now wanted reconciliation with South
      MOR: 4,
      // Wide moral circle - abolitionist, humanitarian, utopian reformer
      PRO: 4,
      // Proceduralist - civil service reform, anti-corruption, clean government
      COM: 5,
      // Maximum compromiser - entire campaign was reconciliation, amnesty for Confederates
      ZS: 2,
      // Positive-sum - reconciliation benefits all, end Reconstruction divisions
      ONT_H: 5,
      // Maximum optimistic - utopian reformer, believed in human perfectibility
      ONT_S: 4,
      // System needs reform - Grant's corruption proves system broken
      PF: 1,
      // Maximum independent - bolted own party, fusion candidate
      TRB: 2,
      // Low tribal - explicitly anti-partisan, cross-party appeal
      ENG: 5,
      // Maximum engagement - crusading editor, tireless campaigner (died from it)
      EPS: 0,
      // Empiricist - journalist, investigative editor, reform through information
      AES: 5
      // Visionary - utopian reformer, reconciliation crusade, eccentric idealist
    }
  ]
};
var election1876 = {
  year: 1876,
  candidates: [
    {
      name: "Hayes",
      party: "Republican",
      year: 1876,
      MAT: 5,
      // Push extreme — pro-business, gold standard, high tariff
      CD: 5,
      // Push extreme — ending Reconstruction, abandoning freedmen
      CU: 1,
      // Push extreme — sectional reconciliation = abandoning universalism
      MOR: 1,
      // Push extreme — abandoned freedmen for compromise
      PRO: 5,
      // Maximum proceduralist
      COM: 4,
      // Compromiser
      ZS: 3,
      // Mixed
      ONT_H: 2,
      // Pessimistic — Reconstruction fatigue
      ONT_S: 1,
      // System fine — just needs cleanup
      PF: 5,
      // Strong Republican machine
      TRB: 4,
      // Tribal — Republican establishment
      ENG: 3,
      // Moderate — quiet campaign
      EPS: 0,
      // Empiricist - lawyer, evidence-based, reform-minded
      AES: 0
      // Statesman - dignified governor, reformer, integrity
    },
    {
      name: "Tilden",
      party: "Democratic",
      year: 1876,
      MAT: 4,
      // Pro-business - gold standard, fiscal conservative, anti-spending
      CD: 4,
      // Culturally conservative - opposed Reconstruction, states' rights
      CU: 2,
      // Particularist - states' rights, end federal "interference" in South
      MOR: 2,
      // Narrow moral circle - white Democratic base, anti-Reconstruction
      PRO: 5,
      // Maximum proceduralist - prosecuted Tweed, anti-corruption crusader
      COM: 3,
      // Mixed - reformer but principled, wouldn't fight stolen election
      ZS: 3,
      // Mixed - anti-corruption but not expansive positive-sum vision
      ONT_H: 2,
      // Skeptical - lawyer's caution, feared concentrated power
      ONT_S: 3,
      // Mixed - system corrupted by Grant/Reconstruction, needs reform
      PF: 4,
      // Strong Democrat - party nominee, reformist wing
      TRB: 4,
      // Tribal - white Democratic coalition, anti-Reconstruction solidarity
      ENG: 4,
      // Engaged - but accepted stolen election gracefully
      EPS: 0,
      // Empiricist - lawyer, prosecutor, evidence-based reform
      AES: 1
      // Technocrat - reform manager, prosecutorial efficiency
    }
  ]
};
var election1880 = {
  year: 1880,
  candidates: [
    {
      name: "Garfield",
      party: "Republican",
      year: 1880,
      MAT: 4,
      // Pro-business - high tariff, sound money, industrial development
      CD: 3,
      // Moderate culturally - supported Black rights but Reconstruction fading
      CU: 3,
      // Mixed - nationalist, pro-tariff protectionism, but equal citizenship
      MOR: 3,
      // Center - nominally supported Black rights but not crusading
      PRO: 5,
      // Maximum proceduralist - civil service reform, institutional integrity
      COM: 4,
      // Compromiser - bridged Stalwart and Half-Breed factions, Chester Arthur as VP
      ZS: 2,
      // Positive-sum - industrial growth benefits all, national development
      ONT_H: 4,
      // Optimistic - self-made man, upward mobility, American dream
      ONT_S: 2,
      // System working - system just needs honest men in charge (civil service reform)
      PF: 4,
      // Strong Republican - party nominee, loyal partisan
      TRB: 3,
      // Moderate tribal - national Republican identity, not sectional
      ENG: 4,
      // Engaged - skilled campaigner, front-porch campaign
      EPS: 0,
      // Empiricist - scholar, intellectual, evidence-based
      AES: 0
      // Statesman - classical orator, gravitas, self-made dignity
    },
    {
      name: "Hancock",
      party: "Democratic",
      year: 1880,
      MAT: 1,
      // Push extreme — low tariff, agrarian
      CD: 1,
      // Push extreme
      CU: 5,
      // Push extreme
      MOR: 5,
      // Push extreme
      PRO: 3,
      // Mixed
      COM: 4,
      // Compromiser
      ZS: 3,
      // Mixed
      ONT_H: 3,
      // Moderate
      ONT_S: 3,
      // Mixed
      PF: 5,
      // Maximum partisan — Democrat machine
      TRB: 4,
      // Tribal
      ENG: 3,
      // Moderate
      EPS: 1,
      // Institutionalist - military hierarchy, institutional framework
      AES: 0
      // Statesman - "Hancock the Superb," military prestige
    }
  ]
};
var election1884 = {
  year: 1884,
  candidates: [
    {
      name: "Cleveland",
      party: "Democratic",
      year: 1884,
      MAT: 4,
      // Pro-business - gold standard, vetoed spending, fiscal conservative
      CD: 3,
      // Culturally moderate - honest reformer, not culture warrior
      CU: 3,
      // Mixed - not ideological on this axis, pragmatic
      MOR: 3,
      // Center - owned personal scandal honestly, "tell the truth"
      PRO: 5,
      // Maximum proceduralist - "public office is a public trust," vetoed pension fraud
      COM: 3,
      // Mixed - principled reformer, not a dealmaker
      ZS: 2,
      // Positive-sum - clean government benefits all citizens
      ONT_H: 3,
      // Moderate - realistic about human nature, hence need for good government
      ONT_S: 2,
      // System fine - just needs honest men, reform not revolution
      PF: 3,
      // Moderate partisan - Democrats nominated him, but Mugwumps (R defectors) supported him
      TRB: 2,
      // Low tribal - reform appeal transcended party, anti-machine
      ENG: 4,
      // Engaged - but projected competence, not passion
      EPS: 0,
      // Empiricist - lawyer, evidence-based, practical reform
      AES: 3
      // Authentic - owned scandal, "tell the truth," plain-spoken integrity
    },
    {
      name: "Blaine",
      party: "Republican",
      year: 1884,
      MAT: 4,
      // Pro-business - high tariff champion, industrial development
      CD: 3,
      // Moderate culturally - but alienated Catholics with "Rum, Romanism" gaffe
      CU: 3,
      // Mixed - protectionist but Pan-American outreach
      MOR: 3,
      // Center - charismatic but personally corrupt
      PRO: 2,
      // Anti-proceduralist - corrupt, Mulligan letters, patronage politician
      COM: 4,
      // Compromiser - master politician, coalition builder
      ZS: 3,
      // Mixed - competitive protectionism but growth-oriented
      ONT_H: 3,
      // Moderate - politician's optimism tempered by cynicism
      ONT_S: 2,
      // System fine - just needs Republican management
      PF: 5,
      // Maximum partisan - "Plumed Knight" of the party, stalwart Republican
      TRB: 4,
      // High tribal - Protestant Republican identity, partisan warrior
      ENG: 5,
      // Maximum engagement - charismatic, tireless campaigner
      EPS: 3,
      // Intuitionist - gut politician, instinctive, charismatic appeal
      AES: 4
      // Fighter - "Plumed Knight," combative, charismatic warrior
    }
  ]
};
var election1888 = {
  year: 1888,
  candidates: [
    {
      name: "Harrison",
      party: "Republican",
      year: 1888,
      MAT: 5,
      // Maximum free-market/pro-business - maximum tariff protection for industry
      CD: 3,
      // Moderate culturally - not a culture warrior, Presbyterian dignity
      CU: 2,
      // Particularist - protectionist, "America first" economics
      MOR: 3,
      // Center - supported Black voting rights rhetorically, pension generosity
      PRO: 4,
      // Proceduralist - lawyer, institutional, respected constitutional process
      COM: 3,
      // Mixed - principled on tariff but pragmatic party operator
      ZS: 3,
      // Mixed - protectionism implies competition, but prosperity rhetoric
      ONT_H: 3,
      // Moderate - conservative temperament
      ONT_S: 2,
      // System fine - protect American industry, system works
      PF: 5,
      // Maximum partisan - party machine candidate, organization man
      TRB: 3,
      // Moderate tribal - Republican veteran identity, not populist
      ENG: 3,
      // Moderate engagement - front-porch campaign, not dynamic
      EPS: 1,
      // Institutionalist - lawyer, senator, institutional man
      AES: 0
      // Statesman - dignified, reserved, presidential grandson
    },
    {
      name: "Cleveland",
      party: "Democratic",
      year: 1888,
      MAT: 4,
      // Pro-business - gold standard, but lower tariff (tariff = tax on consumers)
      CD: 3,
      // Moderate - same reformer, not culture warrior
      CU: 3,
      // Mixed - pragmatic, but tariff reduction opened to international trade
      MOR: 3,
      // Center - honest governance, not moral crusader
      PRO: 5,
      // Maximum proceduralist - same "public trust" integrity, vetoed pension fraud
      COM: 2,
      // Low compromise - stubbornly devoted 1887 message entirely to tariff
      ZS: 2,
      // Positive-sum - lower tariff benefits consumers and economy overall
      ONT_H: 3,
      // Moderate - realistic, practical
      ONT_S: 2,
      // System fine - just reduce unnecessary taxation
      PF: 4,
      // Strong Democrat - incumbent running for reelection
      TRB: 2,
      // Low tribal - reform transcended faction, anti-machine
      ENG: 3,
      // Moderate engagement - honest but boring, not a dynamic campaigner
      EPS: 0,
      // Empiricist - evidence-based tariff argument, economist's logic
      AES: 1
      // Technocrat - devoted State of Union to policy substance, wonkish
    }
  ]
};
var ELECTIONS_1856_1888 = [
  election1856,
  election1860,
  election1864,
  election1868,
  election1872,
  election1876,
  election1880,
  election1884,
  election1888
];

// src/historical/elections-1892-1916.ts
var election1892 = {
  year: 1892,
  candidates: [
    {
      name: "Cleveland",
      party: "Democratic",
      year: 1892,
      MAT: 2,
      // Mild redistributive lean - tariff reform for consumers, but Bourbon Democrat, anti-spending
      CD: 3,
      // Culturally moderate - not a culture warrior, reform-minded but socially conventional
      CU: 3,
      // Mixed - internationalist on trade (low tariff), but no foreign entanglements
      MOR: 3,
      // Centrist moral frame - "public trust" civic virtue, not expansive
      PRO: 5,
      // Maximum proceduralist - anti-corruption crusader, vetoed private pension bills, rule of law
      COM: 3,
      // Mixed - principled and rigid on gold standard, but pragmatic governor
      ZS: 2,
      // Positive-sum lean - believed free trade expands prosperity
      ONT_H: 3,
      // Moderate realism - civic republican, duty-bound, neither optimist nor pessimist
      ONT_S: 2,
      // System mostly fine - just needs honest administration, not structural reform
      PF: 4,
      // Strong Democrat - Bourbon wing leader, party standard-bearer
      TRB: 2,
      // Low tribal - above-the-fray reformer, anti-machine
      ENG: 4,
      // Engaged - ran three times, serious about governance
      EPS: 1,
      // Institutionalist - trusted existing institutions, just wanted them honest
      AES: 0
      // Statesman - dignified, serious, "public office is a public trust"
    },
    {
      name: "Harrison",
      party: "Republican",
      year: 1892,
      MAT: 5,
      // Maximum free-market - McKinley Tariff (protectionist = pro-business), corporate champion
      CD: 4,
      // Culturally conservative - Protestant establishment, Union veteran identity
      CU: 2,
      // Particularist - high tariff wall, protect American industry, economic nationalism
      MOR: 2,
      // Narrow moral circle - business/veteran class, Protestant establishment
      PRO: 4,
      // Proceduralist - legalistic, formal, institutional Republican
      COM: 3,
      // Mixed - stiff, formal, poor at building personal alliances ("White House iceberg")
      ZS: 3,
      // Mixed - tariff protection implies some zero-sum thinking on trade
      ONT_H: 2,
      // Skeptical - conservative establishment, human nature is fixed
      ONT_S: 1,
      // System fine - business-led growth, government protects industry
      PF: 5,
      // Maximum partisan - grandson of president, GOP establishment through and through
      TRB: 3,
      // Moderate tribal - Union veteran identity, but patrician style
      ENG: 3,
      // Moderate - stiff campaigner, let surrogates do the work
      EPS: 1,
      // Institutionalist - formal legalist, trusted party machinery
      AES: 0
      // Statesman - dignified, formal, presidential bearing (if cold)
    },
    {
      name: "Weaver",
      party: "Independent",
      // Populist Party - typed as Independent per CandidateProfile union
      year: 1892,
      MAT: 1,
      // Maximum redistribution - free silver, income tax, government ownership of railroads
      CD: 4,
      // Culturally conservative - agrarian, Protestant, rural values, suspicious of cities
      CU: 2,
      // Particularist - nativist undertones, suspicious of foreign capital, America for farmers
      MOR: 3,
      // Mixed - wide circle for "the people" but narrow in practice (white farmers mostly)
      PRO: 2,
      // Anti-proceduralist - wanted to break existing rules (direct election, initiative/referendum)
      COM: 1,
      // Never compromise - insurgent, rejected both parties as corrupt
      ZS: 4,
      // Zero-sum lean - banks and railroads robbing the farmers, class war framing
      ONT_H: 3,
      // Mixed - believed common people were good but elites were corrupt
      ONT_S: 5,
      // Maximum structuralist - entire financial system rigged against farmers
      PF: 1,
      // Maximum independent - founded new party, rejected both old ones
      TRB: 5,
      // Maximum tribal - farmer/agrarian class identity, "the people" vs. "the plutocrats"
      ENG: 5,
      // Maximum engagement - launched third party, barnstormed the country
      EPS: 3,
      // Intuitionist - populist gut-level politics, "the people know"
      AES: 4
      // Fighter - insurgent crusader, combative populist
    }
  ]
};
var election1896 = {
  year: 1896,
  candidates: [
    {
      name: "McKinley",
      party: "Republican",
      year: 1896,
      MAT: 3,
      // Moderate — "full dinner pail" = prosperity for all, not just business
      CD: 3,
      // Moderate — mainstream, non-threatening
      CU: 3,
      // Moderate — tariff but not nativist
      MOR: 3,
      // Moderate — broad appeal
      PRO: 5,
      // Maximum proceduralist — gold standard as law
      COM: 5,
      // Maximum compromiser — Hanna coalition-builder
      ZS: 2,
      // Positive-sum — prosperity
      ONT_H: 3,
      // Moderate
      ONT_S: 1,
      // System fine — gold standard works
      PF: 4,
      // Strong partisan
      TRB: 2,
      // Low tribal — broad appeal
      ENG: 3,
      // Moderate — front-porch
      EPS: 1,
      // Institutionalist - trusted established financial institutions, gold standard
      AES: 0
      // Statesman - dignified front-porch campaign, presidential calm
    },
    {
      name: "Bryan",
      party: "Democratic",
      year: 1896,
      MAT: 1,
      // Maximum redistribution - free silver = inflation = debt relief for farmers, anti-bank
      CD: 5,
      // Maximum cultural closure - evangelical Protestant, rural, anti-urban, anti-immigrant
      CU: 2,
      // Particularist - nativist, suspicious of foreign gold standard, agrarian nationalism
      MOR: 3,
      // Mixed - evangelical compassion for "the people" but narrow to white Protestant farmers
      PRO: 2,
      // Anti-proceduralist - wanted to break the gold standard, challenge financial establishment
      COM: 1,
      // Never compromise - "shall not crucify mankind," absolutist rhetoric
      ZS: 4,
      // Zero-sum - banks stealing from farmers, Eastern money vs. Western producers
      ONT_H: 4,
      // Optimistic - believed common people would triumph, democratic faith
      ONT_S: 5,
      // Maximum structuralist - financial system rigged, gold standard is oppression
      PF: 3,
      // Moderate - fused Democratic and Populist tickets, but also alienated Gold Democrats
      TRB: 5,
      // Maximum tribal - agrarian/producer class vs. Eastern financiers, "the people"
      ENG: 5,
      // Maximum engagement - 18,000 miles of barnstorming, first modern campaign
      EPS: 3,
      // Intuitionist - evangelical passion, moral conviction, gut populism
      AES: 5
      // Visionary - "Cross of Gold," messianic rhetoric, prophetic oratory
    }
  ]
};
var election1900 = {
  year: 1900,
  candidates: [
    {
      name: "McKinley",
      party: "Republican",
      year: 1900,
      MAT: 5,
      // Maximum free-market - Gold Standard Act, prosperity era, corporate champion
      CD: 4,
      // Culturally conservative - Victorian morality, "civilizing mission" in Philippines
      CU: 3,
      // Mixed - now imperialist/internationalist (Philippines, Open Door) but still tariff wall
      MOR: 3,
      // Mixed - "benevolent assimilation" had universalist rhetoric but paternalist reality
      PRO: 4,
      // Proceduralist - institutional, worked through Congress, but stretched war powers
      COM: 4,
      // Compromiser - managed diverse party coalition, pragmatic
      ZS: 2,
      // Positive-sum - "full dinner pail," prosperity expanding through empire
      ONT_H: 3,
      // Moderate - steady stewardship, neither utopian nor pessimistic
      ONT_S: 1,
      // System fine - prosperity proves the system works
      PF: 5,
      // Maximum partisan - dominant GOP machine
      TRB: 3,
      // Moderate tribal - patriotic/imperial identity but broad prosperity appeal
      ENG: 4,
      // Engaged - wartime president, seeking second term
      EPS: 1,
      // Institutionalist - established order, gold standard, institutional governance
      AES: 0
      // Statesman - incumbent president, wartime gravitas
    },
    {
      name: "Bryan",
      party: "Democratic",
      year: 1900,
      MAT: 1,
      // Maximum redistribution - same populist economics, anti-trust, anti-monopoly
      CD: 5,
      // Maximum cultural closure - same evangelical/agrarian conservatism
      CU: 3,
      // Mixed - anti-imperialist (opposed Philippines annexation) but still nativist on immigration
      MOR: 4,
      // Wider moral circle than 1896 - anti-imperialism added concern for Filipino people
      PRO: 2,
      // Anti-proceduralist - still wanted to break financial establishment
      COM: 1,
      // Never compromise - same absolutist populist stance
      ZS: 4,
      // Zero-sum - imperialism as exploitation, banks still robbing the people
      ONT_H: 4,
      // Optimistic - democracy and self-government for all peoples
      ONT_S: 5,
      // Maximum structuralist - financial and now imperial system is rigged
      PF: 4,
      // Stronger partisan - more clearly Democratic this time, less Populist fusion
      TRB: 5,
      // Maximum tribal - same agrarian class identity
      ENG: 5,
      // Maximum engagement - another massive barnstorming campaign
      EPS: 3,
      // Intuitionist - same evangelical moral conviction
      AES: 5
      // Visionary - anti-imperialist crusade layered onto populist economics
    }
  ]
};
var election1904 = {
  year: 1904,
  candidates: [
    {
      name: "Roosevelt",
      party: "Republican",
      year: 1904,
      MAT: 3,
      // Centrist - trust-busting but pro-business; "Square Deal" = fair play, not redistribution
      CD: 3,
      // Culturally moderate - progressive for era, "strenuous life" but not moralist
      CU: 4,
      // Internationalist - Panama Canal, "big stick" diplomacy, global power projection
      MOR: 4,
      // Wide moral circle - conservation, labor arbitration (coal strike), progressive reform
      PRO: 3,
      // Mixed - used executive power aggressively (trust-busting, Panama) but within legal bounds
      COM: 3,
      // Mixed - "Square Deal" fairness but would break trusts unilaterally, not a dealmaker
      ZS: 2,
      // Positive-sum - believed government could grow the pie through fair regulation
      ONT_H: 4,
      // Optimistic - "strenuous life," humans can improve through vigor and will
      ONT_S: 3,
      // Mixed - system needs reform (trusts) but basically sound with strong leadership
      PF: 4,
      // Strong Republican - but progressive wing, not Old Guard
      TRB: 3,
      // Moderate tribal - "100% Americanism" patriotism, but broad coalition
      ENG: 5,
      // Maximum engagement - boundless energy, "bully pulpit," transformed presidency
      EPS: 0,
      // Empiricist - naturalist, historian, read voraciously, evidence-based reform
      AES: 3
      // Authentic - cowboy, Rough Rider, utterly genuine, force of personality
    },
    {
      name: "Parker",
      party: "Democratic",
      year: 1904,
      MAT: 1,
      // Bourbon Democrat — gold standard, anti-labor
      CD: 2,
      // Culturally conservative for a Democrat
      CU: 2,
      // Anti-imperialism
      MOR: 2,
      // Narrow — judicial restraint, not a reformer
      PRO: 5,
      // Maximum proceduralist
      COM: 5,
      // Maximum compromiser — bland consensus pick
      ZS: 2,
      // Positive-sum
      ONT_H: 2,
      // Skeptical — feared change
      ONT_S: 1,
      // System fine — just enforce existing law
      PF: 5,
      // Maximum Democrat — chosen to reclaim party
      TRB: 1,
      // Minimal tribal — anti-populist, bland
      ENG: 1,
      // Extremely low engagement — one of the worst campaigns in history
      EPS: 1,
      // Institutionalist - judge, trusted courts and legal institutions
      AES: 0
      // Statesman - judicial dignity, understated (to a fault)
    }
  ]
};
var election1908 = {
  year: 1908,
  candidates: [
    {
      name: "Taft",
      party: "Republican",
      year: 1908,
      MAT: 4,
      // Pro-market lean - more conservative than TR, business-friendly, tariff protectionist
      CD: 3,
      // Culturally moderate - not a culture warrior, legalistic temperament
      CU: 3,
      // Mixed - continued TR's internationalism (Philippines, dollar diplomacy) but less ambitious
      MOR: 3,
      // Centrist moral frame - fair-minded judge, not a moral crusader
      PRO: 5,
      // Maximum proceduralist - federal judge, constitutional lawyer, rule of law above all
      COM: 4,
      // Compromiser - amiable, sought consensus, collegiate temperament
      ZS: 2,
      // Positive-sum - believed in orderly growth through law
      ONT_H: 3,
      // Moderate - legal realism, cautious temperament
      ONT_S: 2,
      // System mostly fine - needs honest administration and careful legal reform
      PF: 4,
      // Strong Republican - TR's chosen heir, party establishment
      TRB: 2,
      // Low tribal - judicial temperament, didn't play identity politics
      ENG: 3,
      // Moderate - reluctant campaigner, would rather have been on the bench
      EPS: 1,
      // Institutionalist - trusted courts, legal process, established institutions
      AES: 0
      // Statesman - dignified, judicial bearing, presidential gravitas
    },
    {
      name: "Bryan",
      party: "Democratic",
      year: 1908,
      MAT: 1,
      // Maximum redistribution - income tax, railroad regulation, anti-monopoly, anti-injunction
      CD: 4,
      // Culturally conservative - same evangelical base, rural Protestant identity
      CU: 3,
      // Mixed - anti-imperialist, but Progressive-era reforms were domestic-focused
      MOR: 4,
      // Wide moral circle - "the Great Commoner," workers and farmers deserve justice
      PRO: 2,
      // Anti-proceduralist - wanted to restructure financial system, direct democracy
      COM: 2,
      // Low compromise - ideological progressive, wouldn't water down demands
      ZS: 4,
      // Zero-sum - railroads and trusts extracting from the common people
      ONT_H: 4,
      // Optimistic - believed in democratic self-government, common people's wisdom
      ONT_S: 4,
      // Structuralist - system needs major reform, but mellowed from 1896's maximalism
      PF: 5,
      // Maximum partisan - three-time Democratic nominee, party defined by his populism
      TRB: 4,
      // High tribal - farmer/worker identity, class politics, but less maximalist
      ENG: 5,
      // Maximum engagement - another barnstorming campaign, tireless
      EPS: 3,
      // Intuitionist - evangelical moral conviction, "the people know best"
      AES: 5
      // Visionary - "the Great Commoner," prophetic moral rhetoric
    }
  ]
};
var election1912 = {
  year: 1912,
  candidates: [
    {
      name: "Wilson",
      party: "Democratic",
      year: 1912,
      MAT: 2,
      // Redistributive lean - tariff reduction, income tax, antitrust, but not radical
      CD: 3,
      // Culturally moderate - progressive intellectual but Southern Presbyterian conservative
      CU: 4,
      // Internationalist lean - moralistic foreign policy vision, "make the world safe"
      MOR: 4,
      // Wide moral circle - "New Freedom" for the little man, progressive reform
      PRO: 4,
      // Proceduralist - constitutional scholar, worked through legislation, institutional
      COM: 3,
      // Mixed - principled, moralistic, wouldn't easily bend, but could legislate
      ZS: 2,
      // Positive-sum - "New Freedom" frees competition, everyone benefits
      ONT_H: 4,
      // Optimistic - progressive faith in democratic improvement
      ONT_S: 4,
      // Structuralist - trusts must be broken, system needs reform
      PF: 5,
      // Maximum partisan - rebuilt Democratic Party as progressive vehicle
      TRB: 3,
      // Moderate tribal - intellectual progressive coalition, not class warrior
      ENG: 5,
      // Maximum engagement - academic turned passionate campaigner
      EPS: 0,
      // Empiricist - political scientist, professor, studied government systematically
      AES: 5
      // Visionary - "New Freedom," moral crusade rhetoric, professor-prophet
    },
    {
      name: "Roosevelt",
      party: "Independent",
      // Progressive/Bull Moose - typed as Independent per CandidateProfile union
      year: 1912,
      MAT: 2,
      // Redistributive - "New Nationalism," regulate trusts, worker protections, social insurance
      CD: 2,
      // Culturally open - women's suffrage, Progressive Era reform, social justice
      CU: 4,
      // Internationalist - strong foreign policy, global leadership role for America
      MOR: 5,
      // Maximum universalist - social insurance, child labor laws, worker safety, broad moral vision
      PRO: 2,
      // Anti-proceduralist - recall of judicial decisions, executive activism, break party rules
      COM: 2,
      // Low compromise - walked out of GOP, launched new party, uncompromising on reform
      ZS: 2,
      // Positive-sum - government regulation grows the pie for everyone, "Square Deal" expanded
      ONT_H: 5,
      // Maximum optimistic - "strenuous life," humans can be perfected through reform
      ONT_S: 4,
      // Structuralist - corporations must be regulated, government must be stronger
      PF: 1,
      // Maximum independent - broke from his own party, created Bull Moose
      TRB: 4,
      // High tribal - progressive movement identity, us-vs-bosses
      ENG: 5,
      // Maximum engagement - shot during campaign, gave speech anyway, boundless energy
      EPS: 0,
      // Empiricist - naturalist, historian, evidence-driven reform agenda
      AES: 4
      // Fighter - "Bull Moose," shot and kept speaking, combative reformer
    },
    {
      name: "Taft",
      party: "Republican",
      year: 1912,
      MAT: 5,
      // Maximum free-market - old guard GOP, Payne-Aldrich tariff, pro-business
      CD: 4,
      // Culturally conservative - establishment, traditional values, Old Guard
      CU: 2,
      // Particularist - dollar diplomacy, protect American interests narrowly
      MOR: 2,
      // Narrow moral circle - business establishment, judicial conservatism
      PRO: 5,
      // Maximum proceduralist - judge to his core, constitutional strict construction
      COM: 3,
      // Mixed - tried to hold party together but failed, rigid on principles
      ZS: 3,
      // Mixed - believed in steady legal order, not dynamic reform
      ONT_H: 2,
      // Skeptical - conservative realism, judicial caution about human improvement
      ONT_S: 1,
      // System fine - courts and constitutions work, leave them alone
      PF: 5,
      // Maximum partisan - fought to hold GOP establishment against TR insurgency
      TRB: 2,
      // Low tribal - judicial temperament, establishment dignity
      ENG: 3,
      // Moderate - defensive campaign, dispirited, knew he'd lose
      EPS: 1,
      // Institutionalist - trusted courts above all else
      AES: 0
      // Statesman - judicial dignity, but failed to project leadership
    }
  ]
};
var election1916 = {
  year: 1916,
  candidates: [
    {
      name: "Wilson",
      party: "Democratic",
      year: 1916,
      MAT: 1,
      // Maximum redistribution - Adamson Act (8-hour day), FTC, Clayton Act, progressive taxation
      CD: 2,
      // Culturally open lean - progressive reform, but Southern racial conservatism
      CU: 4,
      // Internationalist - but "he kept us out of war" = cautious internationalism
      MOR: 4,
      // Wide moral circle - progressive legislation for workers, moral foreign policy rhetoric
      PRO: 4,
      // Proceduralist - worked through Congress (Federal Reserve Act, FTC), institutional reform
      COM: 3,
      // Mixed - moralistic, wouldn't easily compromise principles, but legislated effectively
      ZS: 2,
      // Positive-sum - reform benefits everyone, shared prosperity through regulation
      ONT_H: 4,
      // Optimistic - progressive faith in democratic improvement, "New Freedom" working
      ONT_S: 3,
      // Mixed - system reformed substantially (Fed, FTC), but not calling for overhaul
      PF: 5,
      // Maximum partisan - rebuilt Democratic Party, strong party leader
      TRB: 3,
      // Moderate tribal - progressive coalition, not class-warfare rhetoric
      ENG: 5,
      // Maximum engagement - aggressive legislative agenda, seeking reelection
      EPS: 0,
      // Empiricist - political scientist, studied government, evidence-based reform
      AES: 0
      // Statesman - incumbent president, "above politics" neutrality posture
    },
    {
      name: "Hughes",
      party: "Republican",
      year: 1916,
      MAT: 5,
      // Push extreme — pro-business, anti-labor legislation
      CD: 5,
      // Push extreme — conservative establishment
      CU: 1,
      // Push extreme — preparedness/nationalism
      MOR: 1,
      // Push extreme — narrow establishment
      PRO: 5,
      // Maximum proceduralist
      COM: 3,
      // Mixed — couldn't reunite the wings
      ZS: 3,
      // Mixed
      ONT_H: 2,
      // Pessimistic — wanted war preparedness
      ONT_S: 1,
      // System fine — just needs Republican management
      PF: 5,
      // Maximum Republican partisan
      TRB: 4,
      // Tribal — GOP establishment
      ENG: 3,
      // Moderate — stiff campaigner
      EPS: 1,
      // Institutionalist - Supreme Court justice, trusted legal institutions
      AES: 0
      // Statesman - judicial dignity, presidential bearing, but aloof
    }
  ]
};
var ELECTIONS_1892_1916 = [
  election1892,
  election1896,
  election1900,
  election1904,
  election1908,
  election1912,
  election1916
];

// src/historical/elections-1920-1936.ts
var election1920 = {
  year: 1920,
  candidates: [
    {
      name: "Harding",
      party: "Republican",
      year: 1920,
      MAT: 3,
      // Moderate — "Return to Normalcy" = centrist, broadly appealing
      CD: 3,
      // Moderate — genial, not culture warrior
      CU: 3,
      // Moderate — isolationist but not extreme
      MOR: 3,
      // Moderate moral circle — broad appeal
      PRO: 4,
      // Proceduralist — institutional normalcy
      COM: 5,
      // Maximum compromiser — amiable, consensus
      ZS: 2,
      // Positive-sum — prosperity message
      ONT_H: 3,
      // Moderate
      ONT_S: 2,
      // System mostly fine — just needs calm hand
      PF: 3,
      // Moderate partisan — broad coalition
      TRB: 2,
      // Low tribal — genial "normalcy"
      ENG: 3,
      // Moderate — front porch calm
      EPS: 2,
      // Traditionalist - "return to normalcy" = traditional ways are best
      AES: 2
      // Pastoral - small-town Ohio, Main Street, folksy newspaper editor
    },
    {
      name: "Cox",
      party: "Democratic",
      year: 1920,
      MAT: 1,
      // Extreme left — Wilson's progressive heir
      CD: 1,
      // Extreme — progressive
      CU: 5,
      // Maximum universalist — League zealot
      MOR: 5,
      // Extreme — global moral crusade
      PRO: 2,
      // Anti-procedural — executive power
      COM: 1,
      // Never compromise — League without reservations
      ZS: 1,
      // Maximum positive-sum
      ONT_H: 5,
      // Maximum optimistic
      ONT_S: 5,
      // System needs overhaul
      PF: 5,
      // Maximum partisan
      TRB: 5,
      // Maximum tribal — alienating
      ENG: 5,
      // Maximum
      EPS: 1,
      // Institutionalist - trusted League, government machinery
      AES: 0
      // Statesman - projected Wilsonian gravitas and internationalism
    }
  ]
};
var election1924 = {
  year: 1924,
  candidates: [
    {
      name: "Coolidge",
      party: "Republican",
      year: 1924,
      MAT: 3,
      // Moderate — prosperity message, broadly appealing
      CD: 3,
      // Moderate — quiet, not a culture warrior
      CU: 3,
      // Moderate
      MOR: 3,
      // Moderate — "Coolidge prosperity" for all
      PRO: 5,
      // Maximum proceduralist — strict constitutionalist
      COM: 4,
      // Compromiser — let things run smoothly
      ZS: 2,
      // Positive-sum — rising tide, prosperity
      ONT_H: 3,
      // Moderate
      ONT_S: 1,
      // System fine — don't touch what works
      PF: 3,
      // Moderate partisan
      TRB: 2,
      // Low tribal
      ENG: 3,
      // Moderate
      EPS: 2,
      // Traditionalist - inherited wisdom, Puritan tradition, established ways
      AES: 0
      // Statesman - dignified, austere, presidential reserve
    },
    {
      name: "Davis",
      party: "Democratic",
      year: 1924,
      MAT: 1,
      // Push extreme — Democratic progressive tradition
      CD: 1,
      // Push extreme — anti-KKK, culturally liberal
      CU: 5,
      // Maximum universalist — Wilsonian internationalism
      MOR: 5,
      // Maximum wide moral circle — anti-KKK crusade
      PRO: 4,
      // Proceduralist — lawyer
      COM: 4,
      // Compromiser
      ZS: 2,
      // Positive-sum
      ONT_H: 4,
      // Optimistic
      ONT_S: 4,
      // System needs reform
      PF: 5,
      // Maximum partisan
      TRB: 4,
      // Tribal — Democratic coalition
      ENG: 3,
      // Moderate — lackluster campaign
      EPS: 1,
      // Institutionalist - trusted courts, legal process, institutions
      AES: 0
      // Statesman - dignified lawyer, understated
    },
    {
      name: "La Follette",
      party: "Independent",
      // Progressive Party - typed as Independent per CandidateProfile union
      year: 1924,
      MAT: 1,
      // Maximum redistribution - public ownership of railroads, break up monopolies
      CD: 1,
      // Maximum cultural openness - pro-labor, anti-nativist, civil liberties
      CU: 4,
      // Internationalist lean - anti-imperialism, but not League (seen as elite club)
      MOR: 5,
      // Maximum universalist - fought for workers, farmers, immigrants, the little guy
      PRO: 2,
      // Anti-proceduralist - direct democracy, referenda, recall of judges
      COM: 1,
      // Never compromise - "Fighting Bob," ideological purist, insurgent
      ZS: 3,
      // Mixed - saw monopolies as zero-sum extraction but believed reform could fix it
      ONT_H: 4,
      // Optimistic - believed common people would choose wisely given direct democracy
      ONT_S: 5,
      // Maximum structuralist - system rigged by monopolies, needs overhaul
      PF: 1,
      // Maximum independent - rejected both parties, ran as Progressive
      TRB: 4,
      // Tribal - worker/farmer identity, class-based politics
      ENG: 5,
      // Maximum engagement - lifelong crusader, launched entire third party
      EPS: 0,
      // Empiricist - investigated corporate corruption, data-driven muckraker
      AES: 4
      // Fighter - "Fighting Bob," combative, insurgent champion of the people
    }
  ]
};
var election1928 = {
  year: 1928,
  candidates: [
    {
      name: "Hoover",
      party: "Republican",
      year: 1928,
      MAT: 4,
      // Pro-market - but believed in "associationalism," voluntary cooperation
      CD: 3,
      // Culturally moderate - not a culture warrior, progressive on race for era
      CU: 3,
      // Mixed - internationalist background (relief work) but America-first economics
      MOR: 3,
      // Centrist moral frame - humanitarian but not expansive moral crusader
      PRO: 5,
      // Maximum proceduralist - engineer, systems, order, efficiency
      COM: 3,
      // Mixed - principled but rigid, not a natural dealmaker
      ZS: 1,
      // Maximum positive-sum - peak 1920s prosperity optimism, "abolish poverty"
      ONT_H: 4,
      // Optimistic - engineering mentality, problems are solvable
      ONT_S: 2,
      // System working - voluntary cooperation, "rugged individualism"
      PF: 4,
      // Strong Republican - party standard-bearer in prosperity era
      TRB: 2,
      // Low tribal - technocratic, above-the-fray, not populist
      ENG: 4,
      // Engaged - ambitious, ran on competence and vision
      EPS: 0,
      // Empiricist - engineer, data-driven, technocratic problem-solver
      AES: 1
      // Technocrat - "The Great Engineer," efficiency and expertise
    },
    {
      name: "Smith",
      party: "Democratic",
      year: 1928,
      MAT: 2,
      // Redistributive lean - pro-labor, urban working class, public works
      CD: 1,
      // Maximum cultural openness - wet (anti-Prohibition), Catholic, urban, immigrant
      CU: 4,
      // Pluralist - immigrant tolerance, cultural diversity of NYC
      MOR: 4,
      // Wide moral circle - championed workers, immigrants, religious minorities
      PRO: 3,
      // Mixed - Tammany machine pragmatism, not a purist on process
      COM: 4,
      // Compromiser - machine politician, dealmaker, worked across interests
      ZS: 2,
      // Positive-sum - believed in shared prosperity through urban development
      ONT_H: 4,
      // Optimistic - up-from-poverty narrative, American Dream
      ONT_S: 4,
      // Structuralist - government should build infrastructure, help workers
      PF: 5,
      // Maximum partisan - Tammany Democrat, party machine product
      TRB: 4,
      // Tribal - Catholic/Irish/urban immigrant identity, ethnic coalition
      ENG: 5,
      // Maximum engagement - barnstorming campaigner, passionate
      EPS: 3,
      // Intuitionist - street-smart, gut-level populist, not academic
      AES: 3
      // Authentic - Lower East Side accent, brown derby, "the real article"
    }
  ]
};
var election1932 = {
  year: 1932,
  candidates: [
    {
      name: "Roosevelt",
      party: "Democratic",
      year: 1932,
      MAT: 1,
      // Maximum redistribution - "New Deal," bold government spending and relief
      CD: 2,
      // Culturally open - cosmopolitan patrician, progressive for era
      CU: 3,
      // Mixed - focused on domestic crisis, "good neighbor" policy but not League
      MOR: 4,
      // Wide moral circle - "forgotten man" speech, broad compassion
      PRO: 2,
      // Anti-proceduralist - "bold, persistent experimentation," executive action
      COM: 4,
      // Dealmaker - built huge coalition, pragmatic about means
      ZS: 2,
      // Positive-sum - "abundance for all," economic expansion through spending
      ONT_H: 5,
      // Maximum optimistic - "nothing to fear but fear itself," can-do spirit
      ONT_S: 5,
      // Maximum structuralist - Depression proves system broken, needs overhaul
      PF: 5,
      // Maximum partisan - built the New Deal Democratic coalition from scratch
      TRB: 3,
      // Moderate tribal - broad coalition appeal, not narrowly sectarian
      ENG: 5,
      // Maximum engagement - energetic campaigning despite disability
      EPS: 1,
      // Institutionalist - brain trust, government expertise, bold institutions
      AES: 5
      // Visionary - "New Deal," transformative rhetoric, "happy days are here again"
    },
    {
      name: "Hoover",
      party: "Republican",
      year: 1932,
      MAT: 5,
      // Maximum free-market - refused direct relief, "rugged individualism"
      CD: 4,
      // Culturally conservative - defended traditional order, business establishment
      CU: 2,
      // Particularist - Smoot-Hawley tariff, turned inward
      MOR: 2,
      // Narrow moral circle - "rugged individualism," personal responsibility framing
      PRO: 5,
      // Maximum proceduralist - refused to break precedent on relief, rigid
      COM: 2,
      // Low compromise - stubborn, wouldn't bend on relief philosophy
      ZS: 3,
      // Mixed - still claimed prosperity would return but defensive
      ONT_H: 2,
      // Skeptical - government relief would destroy character, fixed human nature
      ONT_S: 1,
      // System fine - Depression is temporary, system will self-correct
      PF: 4,
      // Strong Republican - party standard-bearer
      TRB: 3,
      // Moderate tribal - not populist, establishment identity
      ENG: 3,
      // Moderate engagement - defensive, beleaguered campaign
      EPS: 0,
      // Empiricist - engineer, but data contradicted his optimism
      AES: 1
      // Technocrat - still projected managerial competence, but hollow
    }
  ]
};
var election1936 = {
  year: 1936,
  candidates: [
    {
      name: "Roosevelt",
      party: "Democratic",
      year: 1936,
      MAT: 1,
      // Maximum redistribution - Social Security, WPA, Wagner Act, "economic royalists"
      CD: 2,
      // Culturally open - progressive coalition, but pre-civil-rights
      CU: 3,
      // Mixed - "good neighbor" policy, focused domestically on New Deal
      MOR: 5,
      // Maximum universalist - "I see one-third of a nation ill-housed, ill-clad"
      PRO: 2,
      // Anti-proceduralist - court-packing threat, executive expansion
      COM: 3,
      // Less compromising - "I welcome their hatred," confrontational populism
      ZS: 2,
      // Positive-sum - government spending creates growth, "priming the pump"
      ONT_H: 5,
      // Maximum optimistic - New Deal working, recovery underway
      ONT_S: 5,
      // Maximum structuralist - total systemic reform, new institutions
      PF: 5,
      // Maximum partisan - New Deal coalition at peak, "Roosevelt coalition"
      TRB: 4,
      // High tribal - "forgotten man" vs. "economic royalists," class warfare
      ENG: 5,
      // Maximum engagement - barnstorming incumbent, massive rallies
      EPS: 1,
      // Institutionalist - brain trust, government agencies, new institutions
      AES: 4
      // Fighter - "I welcome their hatred," combative populist champion
    },
    {
      name: "Landon",
      party: "Republican",
      year: 1936,
      MAT: 5,
      // Maximum free-market — attacked New Deal spending
      CD: 5,
      // Maximum cultural conservative — Kansas values, anti-cosmopolitan
      CU: 1,
      // Maximum particularist — America-first
      MOR: 1,
      // Maximum narrow — business elite, self-reliance
      PRO: 5,
      // Maximum proceduralist — attacked executive overreach
      COM: 3,
      // Mixed
      ZS: 3,
      // Mixed
      ONT_H: 1,
      // Maximum pessimistic — government breeds dependency
      ONT_S: 1,
      // System fine — free enterprise works
      PF: 5,
      // Maximum partisan
      TRB: 2,
      // Low tribal
      ENG: 2,
      // Low — outmatched by FDR
      EPS: 0,
      // Empiricist - businessman, practical, fiscal prudence
      AES: 2
      // Pastoral - "the Kansas Coolidge," folksy midwestern governor
    }
  ]
};
var ELECTIONS_1920_1936 = [
  election1920,
  election1924,
  election1928,
  election1932,
  election1936
];

// src/historical/candidates.ts
var election1940 = {
  year: 1940,
  candidates: [
    {
      name: "Roosevelt",
      party: "Democratic",
      year: 1940,
      MAT: 1,
      // Maximum redistribution - New Deal architect, WPA, Social Security
      CD: 2,
      // Culturally open - progressive for era, but pre-civil-rights
      CU: 4,
      // Internationalist - Lend-Lease, Atlantic Charter
      MOR: 4,
      // Wide moral circle - "four freedoms," refugees (limited in practice)
      PRO: 3,
      // Mixed - stretched executive power but through institutions
      COM: 4,
      // Master dealmaker - coalition builder
      ZS: 2,
      // Positive-sum - "abundance for all," economic expansion
      ONT_H: 4,
      // Optimistic - "nothing to fear but fear itself"
      ONT_S: 4,
      // Structuralist - government as solution to systemic failures
      PF: 5,
      // Maximum partisan - built the New Deal coalition
      TRB: 3,
      // Moderate tribal - broad coalition, not in-group focused
      ENG: 5,
      // Maximum engagement - sought unprecedented third term
      EPS: 1,
      // Institutionalist - trusted government machinery
      AES: 0
      // Statesman - patrician, fireside chats, gravitas
    },
    {
      name: "Willkie",
      party: "Republican",
      year: 1940,
      MAT: 5,
      // Pro-market - opposed New Deal expansion, business freedom
      CD: 4,
      // Culturally conservative-leaning - business establishment
      CU: 3,
      // Mixed - internationalist but America-first economics
      MOR: 2,
      // Narrow - business class, not universalist
      PRO: 5,
      // Maximum proceduralist - attacked executive overreach, third-term norm
      COM: 3,
      // Mixed - accepted some New Deal but attacked most
      ZS: 3,
      // Mixed
      ONT_H: 2,
      // Skeptical - government can't fix everything
      ONT_S: 1,
      // System fine - free enterprise works, government is the problem
      PF: 4,
      // Ran as strong Republican despite being newcomer
      TRB: 3,
      // Moderate - business coalition identity
      ENG: 4,
      // Energetic campaign
      EPS: 0,
      // Empiricist - business pragmatist
      AES: 3
      // Authentic - outsider, plain-spoken
    }
  ]
};
var election1944 = {
  year: 1944,
  candidates: [
    {
      name: "Roosevelt",
      party: "Democratic",
      year: 1944,
      MAT: 1,
      // Same New Deal economics, plus wartime spending
      CD: 2,
      // Culturally open - but wartime constraints (Japanese internment)
      CU: 5,
      // Maximum internationalist - UN architect, Allied leader
      MOR: 4,
      // Wide moral circle - fighting fascism, "four freedoms"
      PRO: 3,
      // Mixed - wartime executive power, but through institutions
      COM: 4,
      // Dealmaker - Yalta, Allied coordination
      ZS: 2,
      // Positive-sum - postwar planning, Bretton Woods
      ONT_H: 4,
      // Optimistic - victory within reach
      ONT_S: 4,
      // Structuralist - government as war machine and social safety net
      PF: 5,
      // Maximum partisan
      TRB: 3,
      // National unity rhetoric - "our boys"
      ENG: 5,
      // Maximum - fourth-term bid during world war
      EPS: 1,
      // Institutionalist
      AES: 0
      // Statesman - commander-in-chief gravitas
    },
    {
      name: "Dewey",
      party: "Republican",
      year: 1944,
      MAT: 5,
      // Pro-market — criticized New Deal spending
      CD: 5,
      // Maximum conservative — establishment
      CU: 1,
      // Maximum assimilationist
      MOR: 1,
      // Maximum narrow
      PRO: 5,
      // Maximum proceduralist
      COM: 3,
      // Mixed
      ZS: 3,
      // Mixed
      ONT_H: 2,
      // Skeptical
      ONT_S: 1,
      // System fine
      PF: 5,
      // Maximum partisan
      TRB: 3,
      // Moderate
      ENG: 3,
      // Lower — cautious campaign
      EPS: 0,
      // Empiricist - prosecutor, facts-based
      AES: 1
      // Technocrat - efficient manager image
    }
  ]
};
var election1948 = {
  year: 1948,
  candidates: [
    {
      name: "Truman",
      party: "Democratic",
      year: 1948,
      MAT: 1,
      // Maximum redistribution - Fair Deal, national healthcare attempt
      CD: 2,
      // Culturally open - desegregated military, civil rights plank
      CU: 4,
      // Internationalist - Marshall Plan, NATO, containment
      MOR: 4,
      // Wide moral circle - civil rights courage, Berlin Airlift
      PRO: 3,
      // Mixed - strong executive, "the buck stops here"
      COM: 3,
      // Mixed - fighter, not dealmaker ("do-nothing Congress")
      ZS: 2,
      // Positive-sum - Marshall Plan, postwar prosperity
      ONT_H: 4,
      // Optimistic - America can lead the free world
      ONT_S: 3,
      // Mixed - system needs reform (Fair Deal) but basically sound
      PF: 5,
      // Maximum partisan - attacked Republican Congress relentlessly
      TRB: 3,
      // Moderate tribal - working-class identity, "regular guy"
      ENG: 5,
      // Maximum engagement - whistle-stop tour, never-give-up
      EPS: 1,
      // Institutionalist - trusted government, Truman Doctrine
      AES: 4
      // Fighter - "Give 'em hell Harry"
    },
    {
      name: "Dewey",
      party: "Republican",
      year: 1948,
      MAT: 5,
      // Pro-market - opposed Fair Deal expansion
      CD: 4,
      // Culturally conservative - establishment values
      CU: 2,
      // Assimilationist leaning - America-first
      MOR: 2,
      // Narrow moral frame - business establishment
      PRO: 5,
      // Maximum proceduralist - prosecutor, above-the-fray
      COM: 4,
      // Compromiser - ran cautious, non-confrontational campaign
      ZS: 3,
      // Mixed
      ONT_H: 2,
      // Skeptical - government overreach concern
      ONT_S: 1,
      // System fine - stable management, less government
      PF: 4,
      // Strong Republican
      TRB: 3,
      // Moderate tribal
      ENG: 3,
      // Lower engagement - overconfident, coasted
      EPS: 0,
      // Empiricist - technocratic
      AES: 0
      // Statesman - dignified, above-the-fray
    },
    {
      name: "Thurmond",
      party: "Dixiecrat",
      year: 1948,
      MAT: 3,
      // Mixed - supported New Deal economics for whites
      CD: 5,
      // Maximum cultural conservatism - segregation
      CU: 1,
      // Maximum assimilationist/closed - racial hierarchy, states' rights
      MOR: 1,
      // Maximum narrow moral circle - whites only
      PRO: 2,
      // Anti-proceduralist - states' rights to override federal law
      COM: 1,
      // Never compromise - walked out of convention
      ZS: 5,
      // Maximum zero-sum - racial competition for resources
      ONT_H: 2,
      // Pessimistic - feared social change
      ONT_S: 4,
      // System broken - federal overreach destroying southern way of life
      PF: 3,
      // Regional partisan - not national party man
      TRB: 5,
      // Maximum tribal - white southern identity
      ENG: 5,
      // Maximum engagement - launched entire party over civil rights
      EPS: 2,
      // Traditionalist - "way things have always been"
      AES: 4
      // Fighter - insurgent, defiant
    }
  ]
};
var election1952 = {
  year: 1952,
  candidates: [
    {
      name: "Eisenhower",
      party: "Republican",
      year: 1952,
      MAT: 4,
      // Pro-market lean - balanced budgets, limited government expansion
      CD: 3,
      // Culturally moderate - not a culture warrior
      CU: 3,
      // Mixed - NATO but also "America first" resonance with base
      MOR: 3,
      // Centrist moral frame - duty over ideology
      PRO: 5,
      // Maximum proceduralist - military institutionalist, chain of command
      COM: 4,
      // Pragmatic compromiser - "middle way" politics
      ZS: 2,
      // Positive-sum - postwar prosperity, "peace through strength"
      ONT_H: 3,
      // Moderate realism - military pragmatist
      ONT_S: 2,
      // System working - protect and manage it
      PF: 3,
      // Moderate partisan - ran as Republican, attracted independents
      TRB: 3,
      // Moderate - military patriotic identity, "our boys"
      ENG: 5,
      // Maximum engagement - running for president is maximum engagement
      EPS: 0,
      // Empiricist - military planning, evidence-based
      AES: 0
      // Statesman - supreme commander, gravitas
    },
    {
      name: "Stevenson",
      party: "Democratic",
      year: 1952,
      MAT: 1,
      // Maximum redistributive - full New Deal expansion
      CD: 1,
      // Culturally open - intellectual, progressive, "egghead"
      CU: 5,
      // Maximum internationalist - UN, multilateral, cosmopolitan
      MOR: 5,
      // Maximum universalist - humanitarian concern, broad moral circle
      PRO: 4,
      // Proceduralist - lawyer, institutional
      COM: 4,
      // Compromiser - pragmatic liberal
      ZS: 2,
      // Positive-sum - optimistic liberal
      ONT_H: 5,
      // Maximum optimistic - believed deeply in human progress
      ONT_S: 4,
      // System needs big reform - government as instrument of good
      PF: 5,
      // Maximum Democrat - New Deal heir
      TRB: 3,
      // Moderate tribal - intellectual elite identity
      ENG: 4,
      // Engaged but "egghead" aloofness
      EPS: 0,
      // Empiricist - "the thinking man's candidate"
      AES: 5
      // Visionary - eloquent idealist
    }
  ]
};
var election1956 = {
  year: 1956,
  candidates: [
    {
      name: "Eisenhower",
      party: "Republican",
      year: 1956,
      MAT: 3,
      // Same centrist economics - highway act, balanced budgets
      CD: 3,
      // Moderate - sent troops to Little Rock (reluctantly)
      CU: 4,
      // Internationalist - Suez response, NATO
      MOR: 3,
      // Centrist
      PRO: 5,
      // Maximum proceduralist - institutional, rule-of-law (Little Rock)
      COM: 4,
      // Pragmatic - "middle way"
      ZS: 2,
      // Positive-sum - peace and prosperity
      ONT_H: 3,
      // Moderate realism
      ONT_S: 1,
      // System working well - prosperity, peace, stability
      PF: 2,
      // Low partisan - above-party, national figure
      TRB: 2,
      // Low tribal - father figure to nation
      ENG: 4,
      // Engaged incumbent
      EPS: 0,
      // Empiricist - military planning background
      AES: 0
      // Statesman - beloved grandfather-commander
    },
    {
      name: "Stevenson",
      party: "Democratic",
      year: 1956,
      MAT: 1,
      // Maximum redistributive - expanded New Deal vision
      CD: 1,
      // Culturally open - civil rights support, progressive intellectual
      CU: 5,
      // Maximum internationalist - nuclear test ban, UN
      MOR: 5,
      // Maximum universalist - humanitarian, nuclear concern
      PRO: 4,
      // Proceduralist
      COM: 3,
      // Less compromising this time - sharper attacks
      ZS: 2,
      // Positive-sum
      ONT_H: 5,
      // Maximum optimistic - progress narrative
      ONT_S: 4,
      // System needs big reform - "New America"
      PF: 5,
      // Maximum partisan - stronger party identity second time
      TRB: 4,
      // Higher tribal - rallying the base, us-vs-them
      ENG: 5,
      // Maximum engagement - fighting harder second time
      EPS: 0,
      // Empiricist
      AES: 5
      // Visionary - nuclear test ban, "New America"
    }
  ]
};
var election1960 = {
  year: 1960,
  candidates: [
    {
      name: "Kennedy",
      party: "Democratic",
      year: 1960,
      MAT: 2,
      // Mildly redistributive - New Frontier spending, but not radical
      CD: 2,
      // Culturally open but within Catholic bounds
      CU: 4,
      // Internationalist - Peace Corps, Alliance for Progress
      MOR: 3,
      // Center - Catholic traditionalism + secular modernism
      PRO: 4,
      // Institutionalist - rule of law, Cold War institutions
      COM: 4,
      // Willing to deal - pragmatic liberal
      ZS: 2,
      // Mostly positive-sum - "rising tide lifts all boats"
      ONT_H: 4,
      // Optimistic about human potential - "ask what you can do"
      ONT_S: 3,
      // Mix of individual initiative and government programs
      PF: 4,
      // Strong Democrat identity
      TRB: 3,
      // Moderate tribal - Catholic identity, but broadening coalition
      ENG: 5,
      // Politics as calling - "ask what you can do for your country"
      EPS: 1,
      // Institutionalist - trusted expertise and government
      AES: 0
      // Statesman - projected elegance and gravitas
    },
    {
      name: "Nixon",
      party: "Republican",
      year: 1960,
      MAT: 4,
      // Pro-market but accepted New Deal baseline
      CD: 3,
      // Culturally moderate - suburban middle America
      CU: 3,
      // Internationalist but America-first undertones
      MOR: 3,
      // Moderate on morality - not culture warrior
      PRO: 4,
      // Proceduralist - rule of law, anti-communist legalism
      COM: 4,
      // Pragmatic dealmaker (pre-Watergate Nixon)
      ZS: 3,
      // Mixed - Cold War competition but domestic optimism
      ONT_H: 3,
      // Moderate realism about human nature
      ONT_S: 2,
      // Individualist-leaning
      PF: 4,
      // Strong Republican partisan
      TRB: 3,
      // Middle-class tribal identity
      ENG: 5,
      // Career politician, deeply engaged
      EPS: 1,
      // Institutionalist - government experience
      AES: 0
      // Statesman - tried to project gravitas (less successfully)
    }
  ]
};
var election1964 = {
  year: 1964,
  candidates: [
    {
      name: "Johnson",
      party: "Democratic",
      year: 1964,
      MAT: 1,
      // Maximum redistribution - Great Society, War on Poverty
      CD: 2,
      // Culturally open - signed Civil Rights Act
      CU: 4,
      // Universalist - civil rights, global engagement
      MOR: 3,
      // Southern traditionalist personally, but signed progressive laws
      PRO: 3,
      // Ends-oriented - "whatever it takes" legislative arm-twisting
      COM: 4,
      // Master dealmaker - greatest legislative arm-twister in history
      ZS: 2,
      // Positive-sum - abundance mentality, Great Society for all
      ONT_H: 4,
      // Optimistic - believed government could improve society
      ONT_S: 4,
      // Structuralist - systemic programs
      PF: 5,
      // Party-is-identity - master Democrat
      TRB: 4,
      // Strong coalition tribal politics
      ENG: 5,
      // Politics was his life
      EPS: 1,
      // Institutionalist - trusted government machinery
      AES: 0
      // Statesman (with pastoral southern touches)
    },
    {
      name: "Goldwater",
      party: "Republican",
      year: 1964,
      MAT: 5,
      // Maximum free-market - wanted to abolish New Deal programs
      CD: 4,
      // Culturally conservative - states' rights, opposed CRA
      CU: 2,
      // Particularist - America first, skeptical of UN
      MOR: 3,
      // Not a moralist - libertarian streak, personal tolerance
      PRO: 4,
      // Constitutional proceduralist - strict constructionist
      COM: 1,
      // Never compromise - "extremism in defense of liberty"
      ZS: 3,
      // Mixed - Cold War zero-sum, domestic freedom
      ONT_H: 2,
      // Conservative realism - skeptical of social engineering
      ONT_S: 1,
      // Maximum individualist - minimal government
      PF: 3,
      // Party loyalist but also insurgent within party
      TRB: 3,
      // Ideological tribe more than ethnic/class
      ENG: 5,
      // Deeply engaged - movement conservative
      EPS: 4,
      // Autonomous - principled first-principles reasoning
      AES: 3
      // Authentic - spoke his mind regardless of consequences
    }
  ]
};
var election1968 = {
  year: 1968,
  candidates: [
    {
      name: "Nixon",
      party: "Republican",
      year: 1968,
      MAT: 4,
      // Pro-market but accepted welfare state basics
      CD: 4,
      // Law and order, Silent Majority - culturally conservative signal
      CU: 3,
      // Internationalist (détente) but America-first undertones
      MOR: 4,
      // Appealed to traditional values, moral majority
      PRO: 3,
      // Pragmatic - willing to bend rules (foreshadowing)
      COM: 3,
      // Dealmaker but hardline rhetoric
      ZS: 3,
      // Mixed - us vs. them rhetoric, but pragmatic
      ONT_H: 2,
      // Pessimistic about human nature - realpolitik
      ONT_S: 2,
      // Individualist - personal responsibility rhetoric
      PF: 4,
      // Strong Republican
      TRB: 4,
      // Silent Majority tribal appeal
      ENG: 5,
      // Career politician
      EPS: 1,
      // Institutionalist - worked the system
      AES: 0
      // Statesman - projected authority
    },
    {
      name: "Humphrey",
      party: "Democratic",
      year: 1968,
      MAT: 2,
      // Redistributive - Great Society continuation
      CD: 2,
      // Culturally open - civil rights record
      CU: 4,
      // Internationalist - UN champion, liberal internationalism
      MOR: 3,
      // Moderate morality
      PRO: 4,
      // Proceduralist - institutional liberal
      COM: 5,
      // Maximum compromiser - "happy warrior," consensus-seeker
      ZS: 2,
      // Positive-sum - politics of joy
      ONT_H: 4,
      // Optimistic about human nature
      ONT_S: 4,
      // Structuralist - government programs
      PF: 5,
      // Strong Democrat partisan
      TRB: 3,
      // Coalition builder
      ENG: 5,
      // Lifelong politician
      EPS: 1,
      // Institutionalist
      AES: 5
      // Visionary - idealistic rhetoric
    },
    {
      name: "Wallace",
      party: "American Independent",
      year: 1968,
      MAT: 2,
      // Economic populist - pro-worker, anti-elite
      CD: 5,
      // Maximum cultural closure - segregationist
      CU: 1,
      // Maximum particularist - white southern identity
      MOR: 5,
      // Maximum traditional morality
      PRO: 1,
      // Ends-justify-means - willing to defy courts
      COM: 1,
      // Never compromise - defiant
      ZS: 5,
      // Maximum zero-sum - racial/cultural competition
      ONT_H: 1,
      // Deeply pessimistic - human nature fixed, hierarchical
      ONT_S: 2,
      // Individualist with paternalist streak
      PF: 1,
      // Independent - rejected both parties
      TRB: 5,
      // Maximum tribal - white southern identity
      ENG: 5,
      // Deeply politically engaged
      EPS: 3,
      // Intuitionist - gut-level politics
      AES: 4
      // Fighter - combative, defiant
    }
  ]
};
var election1972 = {
  year: 1972,
  candidates: [
    {
      name: "Nixon",
      party: "Republican",
      year: 1972,
      MAT: 3,
      // More centrist as president - wage controls, EPA
      CD: 4,
      // Silent Majority, law and order
      CU: 3,
      // Détente - pragmatic internationalism
      MOR: 4,
      // Traditional values appeal
      PRO: 3,
      // Pragmatic - willing to bend rules
      COM: 4,
      // Dealmaker - bipartisan governance, EPA, China opening
      ZS: 3,
      // Mixed - détente positive-sum, domestic messaging mixed
      ONT_H: 3,
      // Moderate - realpolitik
      ONT_S: 3,
      // Center - created EPA, but individual responsibility rhetoric
      PF: 4,
      // Strong Republican
      TRB: 3,
      // Broad appeal - "Silent Majority" was deliberately broad
      ENG: 5,
      // Career politician
      EPS: 0,
      // Empiricist as president - data-driven détente
      AES: 0
      // Statesman - presidential, "peace with honor"
    },
    {
      name: "McGovern",
      party: "Democratic",
      year: 1972,
      MAT: 1,
      // Maximum redistribution - demogrant proposal
      CD: 1,
      // Maximum cultural openness - counterculture affinity
      CU: 5,
      // Maximum universalist - anti-war, global peace
      MOR: 1,
      // Maximum secular progressivism - "acid, amnesty, abortion"
      PRO: 2,
      // Anti-establishment - challenged party rules
      COM: 1,
      // Uncompromising on principles - anti-war absolutism
      ZS: 1,
      // Maximum positive-sum - "come home, America"
      ONT_H: 5,
      // Maximum perfectibility - believed in transformation
      ONT_S: 5,
      // Maximum structuralist - systemic change
      PF: 2,
      // Challenged party establishment - insurgent
      TRB: 2,
      // New Left - narrow coalition, alienated traditional Dems
      ENG: 5,
      // Deeply engaged - movement politics
      EPS: 0,
      // Empiricist - professor, policy wonk
      AES: 5
      // Visionary - idealistic moral appeal
    }
  ]
};
var election1976 = {
  year: 1976,
  candidates: [
    {
      name: "Carter",
      party: "Democratic",
      year: 1976,
      MAT: 2,
      // Mildly redistributive - but fiscally cautious
      CD: 3,
      // Center - southern Christian but progressive on race
      CU: 4,
      // Internationalist - human rights foreign policy
      MOR: 4,
      // Traditional morality - born-again Christian
      PRO: 5,
      // Maximum proceduralist - "I'll never lie to you," integrity
      COM: 4,
      // Willing to deal - pragmatic
      ZS: 2,
      // Positive-sum - optimistic outsider
      ONT_H: 4,
      // Optimistic - "why not the best?"
      ONT_S: 3,
      // Mixed - government reform, not expansion
      PF: 3,
      // Democrat but ran as outsider to party
      TRB: 3,
      // Southern identity, broad coalition
      ENG: 4,
      // Engaged but projected citizen-politician
      EPS: 3,
      // Intuitionist - moral/faith-based reasoning
      AES: 2
      // Pastoral - peanut farmer, small-town authenticity
    },
    {
      name: "Ford",
      party: "Republican",
      year: 1976,
      MAT: 5,
      // Pro-market — Republican economics, vetoed spending bills
      CD: 4,
      // Conservative — establishment Republican values
      CU: 3,
      // Mixed
      MOR: 3,
      // Moderate
      PRO: 5,
      // Maximum proceduralist — healer, institutional
      COM: 5,
      // Maximum compromise — "nightmare is over"
      ZS: 2,
      // Positive-sum
      ONT_H: 3,
      // Moderate
      ONT_S: 1,
      // System fine — pardoned Nixon to "move on," nothing broken
      PF: 5,
      // Maximum partisan — lifelong Republican
      TRB: 2,
      // Low tribal
      ENG: 3,
      // Lower — uninspiring campaigner
      EPS: 1,
      // Institutionalist - congressional creature
      AES: 0
      // Statesman - steady, presidential
    }
  ]
};
var election1980 = {
  year: 1980,
  candidates: [
    {
      name: "Reagan",
      party: "Republican",
      year: 1980,
      MAT: 4,
      // Pro-market - supply-side, tax cuts, but not abolishing safety net
      CD: 4,
      // Culturally conservative - traditional values coalition
      CU: 3,
      // American exceptionalism - patriotic internationalist, not isolationist
      MOR: 4,
      // Traditional morality - evangelical alliance, but not fire-and-brimstone
      PRO: 3,
      // Mixed - respected institutions but anti-government rhetoric
      COM: 4,
      // Great Communicator - worked across aisle, pragmatic when needed
      ZS: 2,
      // Positive-sum - "rising tide lifts all boats," optimistic
      ONT_H: 4,
      // Optimistic about Americans - believed in their potential
      ONT_S: 2,
      // Individualist - "government IS the problem" but not extreme
      PF: 4,
      // Strong Republican - transformed the party
      TRB: 4,
      // Strong tribal - "real Americans" appeal
      ENG: 5,
      // Deeply engaged - movement leader
      EPS: 3,
      // Intuitionist - gut conviction, moral clarity
      AES: 5
      // Visionary - "morning in America," transformative optimism
    },
    {
      name: "Carter",
      party: "Democratic",
      year: 1980,
      MAT: 2,
      // Same as 1976 but more cautious
      CD: 3,
      // Center
      CU: 4,
      // Internationalist - human rights
      MOR: 4,
      // Traditional morality - born-again
      PRO: 5,
      // Maximum proceduralist - integrity
      COM: 3,
      // Less compromising as incumbent - stubborn
      ZS: 3,
      // More pessimistic - "malaise" speech
      ONT_H: 3,
      // Less optimistic - humbled by office
      ONT_S: 3,
      // Mixed
      PF: 4,
      // Stronger partisan as incumbent
      TRB: 3,
      // Moderate tribal
      ENG: 4,
      // Engaged but exhausted
      EPS: 0,
      // Empiricist - engineer's mindset, detail-oriented
      AES: 2
      // Pastoral - but less effective
    },
    {
      name: "Anderson",
      party: "Independent",
      year: 1980,
      MAT: 4,
      // Fiscally conservative
      CD: 2,
      // Socially liberal
      CU: 4,
      // Internationalist
      MOR: 2,
      // Secular-leaning despite personal faith
      PRO: 5,
      // Proceduralist - rule of law, institutional
      COM: 4,
      // Compromiser - bipartisan appeal
      ZS: 2,
      // Positive-sum - optimistic moderate
      ONT_H: 4,
      // Optimistic
      ONT_S: 3,
      // Mixed
      PF: 1,
      // Maximum independent - rejected own party
      TRB: 1,
      // Low tribal - explicitly anti-tribal
      ENG: 4,
      // Engaged - ran despite impossible odds
      EPS: 0,
      // Empiricist - policy wonk
      AES: 1
      // Technocrat - intellectual, professorial
    }
  ]
};
var election1984 = {
  year: 1984,
  candidates: [
    {
      name: "Reagan",
      party: "Republican",
      year: 1984,
      MAT: 4,
      // Pro-market but governed pragmatically - didn't touch Social Security
      CD: 3,
      // Broad cultural appeal - optimistic, not punitive
      CU: 3,
      // American exceptionalism - but "Mr. Gorbachev, tear down this wall" is universalist
      MOR: 4,
      // Traditional morality - but sunny, not fire-and-brimstone
      PRO: 4,
      // Worked with Tip O'Neill - respected institutional process
      COM: 4,
      // Great Communicator - master compromiser in practice
      ZS: 1,
      // Maximum positive-sum - "it's morning in America"
      ONT_H: 4,
      // Optimistic about Americans - peak "shining city on a hill"
      ONT_S: 2,
      // Individualist-leaning - but not extreme
      PF: 5,
      // Maximum party leader - defined the GOP
      TRB: 3,
      // Broad appeal - won 49 states by transcending tribes
      ENG: 5,
      // Maximum engagement - dominant president
      EPS: 3,
      // Intuitionist - gut conviction, moral clarity
      AES: 5
      // Visionary - peak "morning in America"
    },
    {
      name: "Mondale",
      party: "Democratic",
      year: 1984,
      MAT: 1,
      // Maximum redistribution - old-guard New Deal liberal
      CD: 2,
      // Culturally open - perceived as liberal
      CU: 4,
      // Internationalist
      MOR: 2,
      // Secular-leaning - perceived as permissive by swing voters
      PRO: 4,
      // Institutionalist - process-oriented
      COM: 4,
      // Compromiser - coalition politician
      ZS: 3,
      // "We need to raise taxes" - sacrifice framing
      ONT_H: 3,
      // Less optimistic - "let's be honest" downer messaging
      ONT_S: 5,
      // Maximum structuralist - big-government liberal image
      PF: 5,
      // Maximum Democrat - party creature
      TRB: 4,
      // Labor/union tribal - narrow coalition
      ENG: 5,
      // Career politician
      EPS: 1,
      // Institutionalist - establishment
      AES: 0
      // Statesman - tried to project gravitas but lacked charisma
    }
  ]
};
var election1988 = {
  year: 1988,
  candidates: [
    {
      name: "Bush",
      party: "Republican",
      year: 1988,
      MAT: 4,
      // Pro-market - "no new taxes" (initially)
      CD: 4,
      // Culturally conservative - Willie Horton, flag/pledge
      CU: 3,
      // Internationalist - UN ambassador, CIA director
      MOR: 4,
      // Traditional values - "thousand points of light"
      PRO: 4,
      // Proceduralist - institutionalist background
      COM: 4,
      // Pragmatic - "kinder, gentler"
      ZS: 2,
      // Positive-sum - "kinder, gentler nation"
      ONT_H: 3,
      // Moderate
      ONT_S: 2,
      // Individualist-leaning
      PF: 4,
      // Strong Republican - Reagan's heir
      TRB: 3,
      // Patrician - less tribal than Reagan
      ENG: 4,
      // Career public servant
      EPS: 1,
      // Institutionalist - foreign policy establishment
      AES: 0
      // Statesman - patrician dignity
    },
    {
      name: "Dukakis",
      party: "Democratic",
      year: 1988,
      MAT: 2,
      // Mildly redistributive - Massachusetts liberal
      CD: 1,
      // Culturally very open - ACLU member, perceived as too liberal
      CU: 4,
      // Universalist
      MOR: 1,
      // Secular progressive - wouldn't say death penalty even for wife's murder
      PRO: 5,
      // Maximum proceduralist - "competence not ideology"
      COM: 4,
      // Pragmatic compromiser
      ZS: 2,
      // Positive-sum - economic manager
      ONT_H: 4,
      // Optimistic - technocratic confidence
      ONT_S: 4,
      // Structuralist - government solutions
      PF: 4,
      // Strong Democrat
      TRB: 2,
      // Low tribal - technocratic appeal
      ENG: 4,
      // Engaged - governor/manager
      EPS: 0,
      // Empiricist - data-driven, technocratic
      AES: 1
      // Technocrat - "competence not ideology"
    }
  ]
};
var election1992 = {
  year: 1992,
  candidates: [
    {
      name: "Clinton",
      party: "Democratic",
      year: 1992,
      MAT: 3,
      // Centrist - "end welfare as we know it," pro-business Democrat
      CD: 2,
      // Culturally open - boomer, saxophone, Arsenio Hall
      CU: 4,
      // Internationalist - free trade, global engagement
      MOR: 3,
      // Center - "safe, legal, and rare" on abortion
      PRO: 3,
      // Pragmatic - ends-oriented, "whatever works"
      COM: 5,
      // Maximum compromiser - triangulation, "Third Way"
      ZS: 1,
      // Maximum positive-sum - "it's the economy" optimism
      ONT_H: 4,
      // Optimistic - "a place called Hope"
      ONT_S: 3,
      // Mixed - market solutions + government investment
      PF: 4,
      // Strong Democrat - but "New Democrat"
      TRB: 3,
      // Broad coalition - Bubba + professionals
      ENG: 5,
      // Maximum political animal
      EPS: 0,
      // Empiricist - policy wonk, "putting people first"
      AES: 3
      // Authentic - "I feel your pain," personal connection
    },
    {
      name: "Bush",
      party: "Republican",
      year: 1992,
      MAT: 4,
      // Pro-market but raised taxes
      CD: 3,
      // Culturally moderate - patrician, not culture warrior
      CU: 4,
      // Internationalist - "new world order," Gulf War coalition
      MOR: 3,
      // Moderate traditional
      PRO: 4,
      // Institutionalist
      COM: 4,
      // Pragmatic - broke tax pledge to deal
      ZS: 3,
      // Mixed
      ONT_H: 3,
      // Moderate
      ONT_S: 2,
      // Individualist-leaning
      PF: 4,
      // Strong Republican
      TRB: 3,
      // Patrician, low-tribal
      ENG: 4,
      // Career public servant
      EPS: 1,
      // Institutionalist
      AES: 0
      // Statesman - "résumé candidate"
    },
    {
      name: "Perot",
      party: "Independent",
      year: 1992,
      MAT: 4,
      // Fiscally conservative - deficit hawk
      CD: 3,
      // Moderate - populist center
      CU: 2,
      // Particularist - anti-NAFTA, "giant sucking sound"
      MOR: 3,
      // Moderate
      PRO: 3,
      // Mixed - pragmatic businessman
      COM: 2,
      // Low compromise - outsider, won't play the game
      ZS: 4,
      // Zero-sum on trade - "they're taking our jobs"
      ONT_H: 3,
      // Moderate - practical businessman
      ONT_S: 2,
      // Individualist - business-oriented
      PF: 1,
      // Maximum independent
      TRB: 2,
      // Anti-establishment, low tribal
      ENG: 4,
      // Engaged - ran despite no political background
      EPS: 0,
      // Empiricist - charts and graphs, data-driven
      AES: 1
      // Technocrat - businessman with spreadsheets
    }
  ]
};
var election1996 = {
  year: 1996,
  candidates: [
    {
      name: "Clinton",
      party: "Democratic",
      year: 1996,
      MAT: 3,
      // Centrist - welfare reform, balanced budget
      CD: 2,
      // Culturally open - but "V-chip," school uniforms
      CU: 4,
      // Internationalist - Kosovo, global trade
      MOR: 3,
      // Center - "bridge to 21st century"
      PRO: 3,
      // Pragmatic
      COM: 5,
      // Maximum compromise - triangulation perfected
      ZS: 1,
      // Maximum positive-sum - booming economy
      ONT_H: 4,
      // Optimistic
      ONT_S: 3,
      // Mixed
      PF: 4,
      // Strong Democrat
      TRB: 3,
      // Broad coalition
      ENG: 5,
      // Maximum engagement
      EPS: 0,
      // Empiricist - "what works"
      AES: 0
      // Statesman - presidential incumbent
    },
    {
      name: "Dole",
      party: "Republican",
      year: 1996,
      MAT: 4,
      // Pro-market - 15% tax cut proposal
      CD: 4,
      // Culturally conservative - "where's the outrage?"
      CU: 3,
      // Internationalist - WWII veteran, NATO supporter
      MOR: 4,
      // Traditional values
      PRO: 4,
      // Proceduralist - Senate institutionalist
      COM: 4,
      // Dealmaker - Senate culture
      ZS: 3,
      // Mixed
      ONT_H: 2,
      // Conservative realism - WWII generation
      ONT_S: 2,
      // Individualist-leaning
      PF: 5,
      // Maximum partisan - career Republican
      TRB: 3,
      // Moderate tribal - old-guard, not populist
      ENG: 5,
      // Career politician
      EPS: 1,
      // Institutionalist - Senate creature
      AES: 0
      // Statesman - WWII hero, tried for gravitas
    }
  ]
};
var election2000 = {
  year: 2e3,
  candidates: [
    {
      name: "Gore",
      party: "Democratic",
      year: 2e3,
      MAT: 2,
      // Mildly redistributive - "people vs. powerful"
      CD: 2,
      // Culturally open
      CU: 4,
      // Universalist - climate, global engagement
      MOR: 3,
      // Center - Tipper's PMRC but personally moderate
      PRO: 4,
      // Proceduralist - institutions, process
      COM: 4,
      // Compromiser - centrist Democrat
      ZS: 2,
      // Positive-sum - technology optimism
      ONT_H: 4,
      // Optimistic - technology/progress
      ONT_S: 3,
      // Mixed - government investment but market-friendly
      PF: 4,
      // Strong Democrat
      TRB: 3,
      // Moderate tribal
      ENG: 5,
      // Career politician
      EPS: 0,
      // Empiricist - data, science, climate expertise
      AES: 1
      // Technocrat - wonkish, "lockbox"
    },
    {
      name: "Bush",
      party: "Republican",
      year: 2e3,
      MAT: 4,
      // Pro-market - tax cuts
      CD: 3,
      // Moderate culturally - "compassionate conservatism"
      CU: 3,
      // Mixed - internationalist but skeptical of nation-building
      MOR: 4,
      // Traditional - born-again, faith-based initiatives
      PRO: 3,
      // Mixed - pragmatic governor
      COM: 4,
      // "Uniter not a divider" - compromiser signal
      ZS: 2,
      // Positive-sum - compassionate conservatism
      ONT_H: 3,
      // Moderate - faith in individual but "soft bigotry of low expectations"
      ONT_S: 2,
      // Individualist - "ownership society"
      PF: 4,
      // Strong Republican
      TRB: 3,
      // Moderate tribal - compassionate conservatism
      ENG: 3,
      // Projected citizen-politician - rancher, not career pol
      EPS: 3,
      // Intuitionist - "gut" decision-maker, faith-based
      AES: 2
      // Pastoral - ranch, folksy, "guy you'd have a beer with"
    }
  ]
};
var election2004 = {
  year: 2004,
  candidates: [
    {
      name: "Kerry",
      party: "Democratic",
      year: 2004,
      MAT: 1,
      // Redistributive signal - opposed Bush tax cuts, healthcare expansion
      CD: 1,
      // Culturally open - Massachusetts liberal, pro-choice, anti-death-penalty
      CU: 5,
      // Maximum pluralist - multilateral, UN, "global test"
      MOR: 5,
      // Maximum universalist - broad moral concern, anti-torture
      PRO: 4,
      // Proceduralist - rule of law, Geneva Conventions, Senate institutionalist
      COM: 4,
      // Compromiser - Senate dealmaker
      ZS: 2,
      // Positive-sum - multilateral cooperation
      ONT_H: 4,
      // Optimistic about human nature
      ONT_S: 3,
      // Mixed - criticized Iraq but defended system broadly
      PF: 5,
      // Maximum Democrat - ran as anti-Bush
      TRB: 4,
      // Higher tribal - "reporting for duty" military identity, us-vs-them on Iraq
      ENG: 5,
      // Maximum engagement - war hero running against wartime president
      EPS: 0,
      // Empiricist - nuanced, "intellectual"
      AES: 0
      // Statesman - "reporting for duty," patrician
    },
    {
      name: "Bush",
      party: "Republican",
      year: 2004,
      MAT: 5,
      // Maximum free-market - ownership society, tax cuts, privatize SS
      CD: 4,
      // Culturally conservative - gay marriage amendment
      CU: 2,
      // Assimilationist/closed - American exceptionalism, unilateral (CU low=closed)
      MOR: 2,
      // Narrow moral circle - evangelical in-group, us-vs-them (MOR low=particularist)
      PRO: 4,
      // Institutional president - worked through Congress, DOJ, NATO (PRO high=procedural)
      COM: 3,
      // Mixed - "decider" rhetoric but bipartisan on education, immigration
      ZS: 4,
      // Zero-sum - "with us or against us"
      ONT_H: 3,
      // Mixed - "freedom is on the march" but threat-focused
      ONT_S: 2,
      // System mostly working - defended institutions (ONT_S low=stable)
      PF: 5,
      // Maximum partisan - Karl Rove base strategy
      TRB: 4,
      // Highly tribal - post-9/11 patriotic identity, but not max
      ENG: 5,
      // War president - maximum engagement
      EPS: 3,
      // Intuitionist - gut decisions, faith-based
      AES: 4
      // Fighter - war president, "bring 'em on"
    }
  ]
};
var election2008 = {
  year: 2008,
  candidates: [
    {
      name: "Obama",
      party: "Democratic",
      year: 2008,
      MAT: 2,
      // Mildly redistributive - "spread the wealth" but market-friendly
      CD: 2,
      // Culturally open - but ran as unifier, not radical
      CU: 4,
      // Universalist - global citizen, but grounded in American values
      MOR: 3,
      // Center - referenced faith frequently, "God is in the mix"
      PRO: 4,
      // Proceduralist - constitutional law professor
      COM: 4,
      // Compromiser - post-partisan rhetoric, "no red/blue America"
      ZS: 1,
      // Maximum positive-sum - "hope and change," unity
      ONT_H: 5,
      // Maximum perfectibility - "yes we can," transformation
      ONT_S: 3,
      // Mixed - community organizer but "personal responsibility" rhetoric
      PF: 3,
      // Moderate partisan - post-partisan appeal
      TRB: 2,
      // Low tribal - explicitly anti-tribal, transcended identity politics
      ENG: 5,
      // Maximum engagement - movement-building
      EPS: 0,
      // Empiricist - "what works," pragmatic progressive
      AES: 5
      // Visionary - "yes we can," transformative rhetoric
    },
    {
      name: "McCain",
      party: "Republican",
      year: 2008,
      MAT: 4,
      // Pro-market - but not supply-side ideologue
      CD: 3,
      // Culturally moderate - immigration reform, "maverick"
      CU: 3,
      // Internationalist - but American leadership
      MOR: 3,
      // Moderate morality - not culture warrior (Palin was)
      PRO: 4,
      // Proceduralist - campaign finance reform, rule of law
      COM: 4,
      // Compromiser - "maverick," bipartisan deals
      ZS: 3,
      // Mixed - competition abroad, cooperation at home
      ONT_H: 3,
      // Moderate
      ONT_S: 2,
      // Individualist-leaning - personal responsibility
      PF: 3,
      // Moderate partisan - maverick who bucked party
      TRB: 3,
      // Mixed - war hero identity + Palin complicated it
      ENG: 5,
      // Career senator, war hero - deeply engaged
      EPS: 1,
      // Institutionalist - Senate creature
      AES: 3
      // Authentic - straight talk, personal honor
    }
  ]
};
var election2012 = {
  year: 2012,
  candidates: [
    {
      name: "Obama",
      party: "Democratic",
      year: 2012,
      MAT: 2,
      // Redistributive - ACA, Buffett Rule, "you didn't build that"
      CD: 2,
      // Culturally open - supported gay marriage
      CU: 4,
      // Internationalist - but more pragmatic
      MOR: 2,
      // Progressive morality - evolved on marriage equality
      PRO: 4,
      // Proceduralist - institutional governance
      COM: 3,
      // Less compromising - frustrated with Congress
      ZS: 2,
      // Mostly positive-sum - but "forward" implies work needed
      ONT_H: 4,
      // Still optimistic but more seasoned
      ONT_S: 3,
      // Mixed - ACA, but also personal responsibility framing
      PF: 4,
      // Stronger partisan - election mode
      TRB: 3,
      // Coalition politics
      ENG: 5,
      // Maximum engagement - incumbent running
      EPS: 0,
      // Empiricist - data-driven governance
      AES: 0
      // Statesman - presidential, above the fray
    },
    {
      name: "Romney",
      party: "Republican",
      year: 2012,
      MAT: 5,
      // Maximum free-market - Bain Capital, cut taxes/regulations
      CD: 3,
      // Moderate culturally - Massachusetts record, Mormon
      CU: 3,
      // Mixed - internationalist establishment
      MOR: 4,
      // Traditionally moral - Mormon, family values
      PRO: 4,
      // Proceduralist - rule of law, business process
      COM: 3,
      // Mixed - "severely conservative" pivot
      ZS: 3,
      // Mixed - competitive business worldview
      ONT_H: 3,
      // Moderate - business pragmatism
      ONT_S: 1,
      // Maximum individualist - "47%," self-reliance
      PF: 4,
      // Strong Republican
      TRB: 3,
      // Moderate tribal - business class
      ENG: 4,
      // Engaged - but projected competent manager
      EPS: 0,
      // Empiricist - consulting/business background
      AES: 1
      // Technocrat - business turnaround specialist
    }
  ]
};
var election2016 = {
  year: 2016,
  candidates: [
    {
      name: "Trump",
      party: "Republican",
      year: 2016,
      MAT: 3,
      // Populist economics - protectionist, but tax cuts for rich
      CD: 5,
      // Maximum cultural closure - "build the wall," immigration
      CU: 1,
      // Maximum particularist - "America First"
      MOR: 3,
      // Mixed - evangelicals supported him but not personally moral
      PRO: 1,
      // Maximum anti-proceduralist - norm-breaking, "drain the swamp"
      COM: 1,
      // Never compromise - "we're going to win so much"
      ZS: 5,
      // Maximum zero-sum - "they're taking our jobs," immigration
      ONT_H: 2,
      // Pessimistic - "American carnage"
      ONT_S: 2,
      // Individualist - "I alone can fix it"
      PF: 3,
      // Moderate - hijacked the party, not loyal to it
      TRB: 5,
      // Maximum tribal - MAGA movement
      ENG: 5,
      // Maximum engagement - rallies, constant media
      EPS: 3,
      // Intuitionist - gut instinct, "I have a feeling"
      AES: 4
      // Fighter - "counterpuncher," combative, dominant
    },
    {
      name: "Clinton",
      party: "Democratic",
      year: 2016,
      MAT: 2,
      // Mildly redistributive - but Wall Street ties
      CD: 2,
      // Culturally open - "stronger together," diversity
      CU: 4,
      // Universalist - global engagement
      MOR: 2,
      // Progressive morality
      PRO: 4,
      // Proceduralist - institutional, rule-following
      COM: 4,
      // Compromiser - pragmatic, deal-oriented
      ZS: 2,
      // Positive-sum - "stronger together"
      ONT_H: 4,
      // Optimistic - "when they go low, we go high" (borrowed)
      ONT_S: 4,
      // Structuralist - policy proposals, systemic
      PF: 5,
      // Maximum partisan - career Democrat
      TRB: 3,
      // Moderate tribal - broad coalition
      ENG: 5,
      // Career politician - maximum engagement
      EPS: 0,
      // Empiricist - policy wonk, detailed plans
      AES: 0
      // Statesman - projected competence, gravitas
    }
  ]
};
var election2020 = {
  year: 2020,
  candidates: [
    {
      name: "Biden",
      party: "Democratic",
      year: 2020,
      MAT: 2,
      // Redistributive - COVID spending, expanded safety net
      CD: 2,
      // Culturally open - but moderate brand
      CU: 4,
      // Pluralist/open - "America is back," multilateral (CU high=open)
      MOR: 4,
      // Fairly wide moral circle - empathy-centered (MOR high=universalist)
      PRO: 5,
      // Maximum proceduralist - "restore norms," rule of law (PRO high=rules-bound)
      COM: 5,
      // Maximum compromise - "I'll work with anyone"
      ZS: 2,
      // Positive-sum - unity, "soul of the nation"
      ONT_H: 4,
      // Optimistic - "America can be defined in one word: possibilities"
      ONT_S: 2,
      // System mostly working - defender of institutions (ONT_S low=stable)
      PF: 4,
      // Strong Democrat - but bipartisan rhetoric
      TRB: 2,
      // Low tribal - broad unity appeal, "president for all Americans"
      ENG: 4,
      // Engaged - but projected calm
      EPS: 1,
      // Institutionalist - "trust the institutions"
      AES: 2
      // Pastoral - "Scranton Joe," empathy, personal loss
    },
    {
      name: "Trump",
      party: "Republican",
      year: 2020,
      MAT: 3,
      // Same populist economics - but COVID checks
      CD: 5,
      // Maximum cultural closure - doubled down
      CU: 1,
      // Maximum assimilationist/closed (CU low=closed)
      MOR: 2,
      // Narrow moral circle - in-group focused (MOR low=particularist)
      PRO: 1,
      // Maximum anti-proceduralist - challenged election results (PRO low=outcome-first)
      COM: 1,
      // Never compromise - more combative than 2016
      ZS: 5,
      // Maximum zero-sum
      ONT_H: 2,
      // Pessimistic - "they're destroying your country"
      ONT_S: 4,
      // Deep structural critique - "drain the swamp" (ONT_S high=system broken)
      PF: 3,
      // Moderate partisan - MAGA over GOP
      TRB: 5,
      // Maximum tribal - MAGA intensified
      ENG: 5,
      // Maximum engagement
      EPS: 3,
      // Intuitionist - gut politics
      AES: 4
      // Fighter - "counterpuncher," grievance
    }
  ]
};
var election2024 = {
  year: 2024,
  candidates: [
    {
      name: "Trump",
      party: "Republican",
      year: 2024,
      MAT: 4,
      // Tax cuts + tariffs - pro-business signal, not populist economics
      CD: 5,
      // Maximum cultural closure - immigration, "poisoning the blood"
      CU: 1,
      // Maximum assimilationist/closed - America First extreme
      MOR: 2,
      // Narrow moral circle - in-group loyalty
      PRO: 2,
      // Anti-proceduralist but not maximally - still works through courts, Congress
      COM: 2,
      // Low compromise but deals on infrastructure, budget, criminal justice reform
      ZS: 4,
      // Zero-sum rhetoric but "economy was great under me" positive framing
      ONT_H: 2,
      // Pessimistic but "we'll be great again" implies some optimism
      ONT_S: 4,
      // Deep structural critique - "system is rigged"
      PF: 4,
      // Party IS now MAGA
      TRB: 5,
      // Maximum tribal
      ENG: 5,
      // Maximum engagement
      EPS: 3,
      // Intuitionist
      AES: 4
      // Fighter - "I am your retribution"
    },
    {
      name: "Harris",
      party: "Democratic",
      year: 2024,
      MAT: 1,
      // Maximum redistributive signal - "opportunity economy," price controls, housing
      CD: 1,
      // Maximum cultural openness - trans rights, pronouns, DEI
      CU: 5,
      // Maximum pluralist - diversity as strength, multilateral
      MOR: 5,
      // Maximum universalist - reproductive rights, global concern
      PRO: 4,
      // Proceduralist - prosecutor, "rule of law"
      COM: 4,
      // Compromiser - moderate positioning
      ZS: 2,
      // Positive-sum - "joyful warrior," optimism
      ONT_H: 4,
      // Optimistic - "what can be, unburdened by what has been"
      ONT_S: 3,
      // Mixed systemic critique
      PF: 5,
      // Maximum partisan - strong Democrat identity signaling
      TRB: 4,
      // Coalition tribal - identity politics framing
      ENG: 5,
      // Maximum engagement
      EPS: 1,
      // Institutionalist - prosecutor, DA, AG
      AES: 1
      // Technocrat - policy-focused
    }
  ]
};
var ELECTIONS = [
  ...ELECTIONS_1789_1852,
  ...ELECTIONS_1856_1888,
  ...ELECTIONS_1892_1916,
  ...ELECTIONS_1920_1936,
  election1940,
  election1944,
  election1948,
  election1952,
  election1956,
  election1960,
  election1964,
  election1968,
  election1972,
  election1976,
  election1980,
  election1984,
  election1988,
  election1992,
  election1996,
  election2000,
  election2004,
  election2008,
  election2012,
  election2016,
  election2020,
  election2024
];

// src/config/population-weights.ts
var POPULATION_WEIGHTS = {
  // ===================================================================
  // PROGRESSIVE ECONOMIC REFORMERS (001-010)
  // Mainstream left — economic redistribution + moderate-to-progressive culture
  // ===================================================================
  "001": 7e-3,
  // Rawlsian Reformer — academic left, small but vocal
  "002": 0.015,
  // Independent Social Democrat — sizable, educated progressives
  "003": 0.012,
  // Welfare Modernizer — technocratic left, professional class
  "004": 0.01,
  // Labor Reformer — union-adjacent workers, declining but real
  "005": 0.015,
  // Public Guardian — public-sector workers, teachers, nurses
  "006": 0.018,
  // Fairness Pragmatist — pragmatic progressives, suburban professionals
  "007": 5e-3,
  // Solidarist Reformer — communitarian left, small
  "008": 6e-3,
  // Municipal Equalizer — local-government progressives
  "009": 0.01,
  // Social Stabilizer — stability-oriented left
  "010": 0.038,
  // Bread-and-Butter Progressive — LARGE: kitchen-table Dems
  // ===================================================================
  // RADICAL / INSURGENT LEFT (011-020)
  // Fringe left — class war, anarchism, radical egalitarianism
  // ===================================================================
  "011": 3e-3,
  // Jacobin Egalitarian — hard-left intellectuals
  "012": 3e-3,
  // Class-War Leftist — Marxist-adjacent, small
  "013": 3e-3,
  // Radical Leveler — extreme egalitarian, very small
  "014": 4e-3,
  // Movement Egalitarian — activist left
  "015": 4e-3,
  // Moral Firebrand — passionate progressive moralists
  "016": 2e-3,
  // Insurgent Equalizer — radical redistributionist
  "017": 2e-3,
  // Uncompromising Redistributionist — no-compromise left
  "019": 1e-3,
  // Anarchist Mutualist — fringe anarchist
  "020": 1e-3,
  // Horizontalist Dissenter — fringe anti-hierarchy
  // ===================================================================
  // COSMOPOLITAN / UNIVERSALIST LEFT (021-031)
  // Educated, globally-oriented progressives
  // ===================================================================
  "021": 5e-3,
  // Kantian Cosmopolitan — philosophical universalist
  "022": 0.01,
  // Pluralist Universalist — diversity-focused, suburban educated
  "023": 7e-3,
  // Rights Cosmopolitan — human-rights focused
  "024": 5e-3,
  // Ethical Internationalist — foreign-policy left
  "025": 6e-3,
  // World-Minded Reformer — globally-aware reformist
  "026": 8e-3,
  // Cosmopolitan Pragmatist — practical internationalist
  "027": 6e-3,
  // Popperian Liberal — open-society liberal
  "028": 5e-3,
  // Global Caretaker — humanitarian-focused
  "029": 5e-3,
  // Liberationist Progressive — identity-liberation left
  "030": 0.01,
  // Cultural Pluralist — multiculturalism advocate, sizable
  "031": 5e-3,
  // Planetary Steward — environmental cosmopolitan
  // ===================================================================
  // TECHNOCRATIC / INSTITUTIONAL LEFT-CENTER (032-040)
  // Evidence-based, systems-thinking, often professional class
  // ===================================================================
  "032": 7e-3,
  // Hamiltonian Technocrat — state-capacity centrist
  "033": 5e-3,
  // Systems Modernizer — reform-through-efficiency
  "034": 8e-3,
  // Evidence Reformer — data-driven progressive
  "035": 0.01,
  // Administrative Liberal — gov't-trusting moderate-left
  "036": 5e-3,
  // Institutional Optimizer — efficiency-focused centrist
  "037": 6e-3,
  // Fabian Modernizer — gradualist left
  "039": 0.012,
  // Data-Driven Moderate — evidence-based centrist, growing
  "040": 3e-3,
  // Reform Engineer — technocratic reformer
  // ===================================================================
  // COMMUNITARIAN / LOCALIST LEFT (042-052)
  // Community-oriented, often religious or rural left
  // ===================================================================
  "042": 6e-3,
  // Localist Progressive — community-first leftist
  "043": 7e-3,
  // Neighborly Egalitarian — neighborly, working-class left
  "045": 6e-3,
  // Rooted Social Reformer — tradition-respecting left
  "046": 5e-3,
  // Pastoral Leftist — rural-ish progressive
  "047": 6e-3,
  // Common-Life Reformer — everyday-life focused
  "048": 5e-3,
  // Solidaristic Localist — local solidarity
  "049": 4e-3,
  // Paternal Egalitarian — paternalistic left
  "050": 9e-3,
  // Religious Leftist — faith-based progressives (Black church, Catholic social teaching)
  "051": 5e-3,
  // Ecological Localist — green localist
  "052": 3e-3,
  // Distributist Localist — Chestertonian left, very small
  // ===================================================================
  // MODERATES / CENTRISTS (053-060)
  // True middle — swing voters, median Americans
  // ===================================================================
  "053": 0.012,
  // Consensus Builder — bridge-builders, sizable moderate
  "054": 0.01,
  // Arbiter Moderate — balanced centrist
  "055": 8e-3,
  // Halifax Moderate — cautious, risk-averse center
  "056": 8e-3,
  // Institutional Centrist — institution-trusting middle
  "057": 0.01,
  // Temperate Pluralist — tolerant moderate
  "059": 0.012,
  // Public-Minded Moderate — civic-minded centrist, common
  "060": 0.012,
  // Hinge Citizen — true swing voter, large
  // ===================================================================
  // CLASSICAL / MARKET LIBERALS (061-069)
  // Pro-market, socially moderate-to-liberal
  // ===================================================================
  "061": 5e-3,
  // Millian Liberal — philosophical libertarian-liberal
  "062": 8e-3,
  // Meritocratic Liberal — achievement-oriented, suburban
  "063": 8e-3,
  // Enterprise Pluralist — business-friendly moderate
  "064": 0.015,
  // Market Optimist — LARGE: pro-business, suburban professional
  "065": 0.012,
  // Opportunity Liberal — aspiration + fairness
  "067": 4e-3,
  // Free-Exchange Modernist — libertarian-leaning cosmopolitan
  "069": 5e-3,
  // Bleeding-Heart Libertarian — socially liberal, free-market
  // ===================================================================
  // ESTABLISHMENT CONSERVATIVES (070-079)
  // Traditional, institutional, Burkean right
  // ===================================================================
  "070": 0.01,
  // Burkean Steward — thoughtful conservative, educated
  "071": 0.01,
  // Constitutional Conservative — founding-principles focused
  "072": 6e-3,
  // Blackstone Conservative — legal-tradition right
  "073": 0.012,
  // Civic Traditionalist — mainstream traditionalism, sizable
  "074": 0.015,
  // Responsible Conservative — LARGE: pragmatic, duty-bound right
  "075": 9e-3,
  // Institutional Conservative — institution-preserving right
  "076": 7e-3,
  // Fiscal Gradualist — deficit hawks, business right
  "077": 6e-3,
  // Ordered Libertarian — libertarian w/ social order
  "078": 8e-3,
  // Meritocratic Conservative — achievement-oriented right
  "079": 6e-3,
  // National Developmentalist — industrial-policy right
  // ===================================================================
  // CULTURAL / RELIGIOUS CONSERVATIVES (080-089)
  // Tradition, faith, heritage — heartland America
  // ===================================================================
  "080": 5e-3,
  // Chestertonian Traditionalist — intellectual trad
  "081": 8e-3,
  // Heritage Guardian — heritage-preservation, sizable in rural
  "082": 0.014,
  // Altar-and-Hearth Conservative — LARGE: religious, family-values
  "083": 8e-3,
  // Sacred-Order Defender — religious right, devout
  "084": 4e-3,
  // Civilizational Conservative — Western-civ focused
  "085": 8e-3,
  // Customary Localist — rural tradition-keepers
  "086": 0.01,
  // Duty Traditionalist — duty-bound, common in heartland
  "087": 8e-3,
  // Continuity Conservative — status-quo preference
  "088": 0.01,
  // Gentle Traditionalist — moderate trad, non-confrontational
  "089": 4e-3,
  // Integral Traditionalist — hardline trad, small
  // ===================================================================
  // ORDER / SECURITY CONSERVATIVES (090-097)
  // Law-and-order, authority, national security
  // ===================================================================
  "090": 4e-3,
  // Hobbesian Guardian — security-absolutist
  "091": 7e-3,
  // Security Paternalist — nanny-state right
  "092": 6e-3,
  // Disciplined Majoritarian — majority-rule enforcer
  "093": 0.01,
  // Stability-First Voter — risk-averse, order-preference
  "094": 3e-3,
  // Hard-State Manager — authoritarian-leaning, small
  "095": 2e-3,
  // Emergency Orderist — crisis-authoritarian, fringe
  "096": 6e-3,
  // Civic Disciplinarian — rules-focused conservative
  "097": 7e-3,
  // Authority Pragmatist — pragmatic law-and-order
  // ===================================================================
  // RIGHT POPULISTS (098-107)
  // Anti-elite, tribal, grievance-driven
  // ===================================================================
  "098": 0.01,
  // Anti-Elite Populist — Trumpian base, suspicious of elites
  "099": 8e-3,
  // Scarcity Populist — economic anxiety + traditionalism
  "100": 3e-3,
  // Tribal Insurgent — extreme tribal politics
  "101": 8e-3,
  // Embattled Majoritarian — feels under siege, sizable
  "102": 8e-3,
  // Folk Tribune — folk-populist, rural working-class
  "103": 5e-3,
  // Grievance Mobilizer — grievance-driven activist
  "104": 8e-3,
  // National Protector — security-patriot populist
  "105": 4e-3,
  // Combative Populist — confrontational populist
  "106": 3e-3,
  // Leader-Centered Insurgent — personality-cult follower
  "107": 6e-3,
  // Resentful Localist — rural resentment, modest size
  // ===================================================================
  // DISENGAGED / ALIENATED (108-112, 115)
  // Low political engagement, cynical, withdrawn
  // ===================================================================
  "108": 0.01,
  // Passive Cynic — checked out, distrustful, common
  "109": 8e-3,
  // Alienated Outsider — feels excluded from system
  "110": 5e-3,
  // Principled Abstainer — deliberate non-participant
  "111": 3e-3,
  // Diogenes Independent — philosophical non-joiner
  "112": 3e-3,
  // Contrarian Intellectual — contrarian for contrarianism
  "115": 8e-3,
  // Quietist — prefers to stay out of politics
  // ===================================================================
  // LOW-ENGAGEMENT MAINSTREAM (116-124)
  // Apolitical, casual, everyday Americans who don't follow politics closely
  // ===================================================================
  "116": 0.015,
  // Quiet Middle — LARGE: silent majority, don't think about politics
  "117": 0.013,
  // Comfortable Bystander — doing fine, not engaged
  "118": 0.01,
  // Survival Pragmatist — focused on getting by
  "119": 8e-3,
  // Apolitical Striver — too busy working to care
  "120": 0.011,
  // Good Neighbor — community but not political
  "121": 8e-3,
  // Spectator Citizen — watches but doesn't act
  "122": 6e-3,
  // Civic Minimalist — minimal political participation
  "124": 6e-3,
  // Crisis-Activated Sleeper — only engages in emergencies
  // ===================================================================
  // PARTISAN IDENTIFIERS (125-133)
  // Politics as team sport, identity, habit
  // ===================================================================
  "125": 0.01,
  // Reluctant Partisan — holds nose, votes party
  "126": 8e-3,
  // Single-Issue Activator — one issue drives all voting
  "127": 9e-3,
  // Tribal Loyalist — party-over-everything
  "128": 0.018,
  // Loyal Democrat — reliable Dem voter, sizable
  "129": 0.015,
  // Loyal Republican — reliable GOP voter, sizable
  "130": 8e-3,
  // Legacy Partisan — inherited partisanship
  "131": 0.018,
  // Duty Voter — LARGE: votes because they should, common
  "132": 0.01,
  // Negative Partisan — votes against, not for
  "133": 8e-3,
  // Sporadic Alarm Voter — votes only when alarmed
  // ===================================================================
  // CROSS-CUTTING / HYBRID (134-140)
  // Don't fit neatly into left-right — cross-pressured types
  // ===================================================================
  "134": 8e-3,
  // Progressive Civic Nationalist — left-patriot hybrid
  "135": 3e-3,
  // Disruptive Cosmopolitan — techno-libertarian disruptor
  "136": 5e-3,
  // Aspirational Traditionalist — upward-mobile social conservative
  "137": 4e-3,
  // Prophetic Revivalist — religious renewal movement
  "138": 4e-3,
  // Holistic Dissenter — holistic/alternative politics
  "139": 6e-3,
  // Civic Assimilationist — assimilation-focused patriot
  "140": 4e-3
  // Market Green Modernist — green capitalism
};

// src/historical/simulate.ts
var import_node_fs = require("node:fs");
var import_node_path = require("node:path");
var import_node_url = require("node:url");

// src/historical/contexts-1789-1852.ts
var context1789 = {
  year: 1789,
  zeitgeist: {
    era: "founding",
    nodeWeights: { PRO: 2.5, ONT_H: 1.8, ONT_S: 1.5, COM: 2, ENG: 1.5 },
    intensity: 1.3,
    description: "Birth of the republic; constitutional experiment with no precedent"
  },
  issueLandscape: {
    primaryAxis: ["PRO", "ONT_H", "COM"],
    secondaryAxis: ["MAT", "ONT_S", "ENG"],
    dormant: ["CD", "CU", "MOR", "ZS", "PF", "TRB"],
    description: "Can a republic work? Procedural legitimacy and institutional design are everything"
  },
  candidateActivations: [
    {
      candidateName: "Washington",
      activationNodes: { PRO: 1.8, COM: 1.5, ENG: 1.5, ONT_H: 1.3 },
      novelty: 1.8
    }
  ]
};
var context1792 = {
  year: 1792,
  zeitgeist: {
    era: "founding",
    nodeWeights: { PRO: 2, MAT: 1.5, PF: 1.3, COM: 1.5 },
    intensity: 0.9,
    description: "Washington reelected; Hamilton vs Jefferson factions crystallizing beneath the surface"
  },
  issueLandscape: {
    primaryAxis: ["PRO", "MAT", "COM"],
    secondaryAxis: ["ONT_H", "ONT_S", "PF", "ENG"],
    dormant: ["CD", "CU", "MOR", "ZS", "TRB"],
    description: "Hamilton's financial program divides elites; tariffs and the national bank are contested"
  },
  candidateActivations: [
    {
      candidateName: "Washington",
      activationNodes: { PRO: 1.5, COM: 1.5, ENG: 1.2 },
      novelty: 1.3
    }
  ]
};
var context1796 = {
  year: 1796,
  zeitgeist: {
    era: "founding",
    nodeWeights: { PRO: 1.8, MAT: 1.5, CD: 1.3, PF: 1.2 },
    intensity: 1,
    description: "First contested election; Jay Treaty anger; institutional stability matters most"
  },
  issueLandscape: {
    primaryAxis: ["PRO", "MAT", "CD"],
    secondaryAxis: ["PF", "COM", "ENG"],
    dormant: ["MOR", "CU", "ZS", "ONT_S", "TRB", "ONT_H"],
    description: "Can the republic hold? Proceduralism and commerce vs agrarian populism"
  },
  candidateActivations: [
    {
      candidateName: "Adams",
      activationNodes: { PRO: 1.5, CD: 1.3, MAT: 1.3 },
      novelty: 1.2,
      threatActivation: { ONT_H: 1.2 }
    },
    {
      candidateName: "Jefferson",
      activationNodes: { ONT_H: 1.3, CU: 1.2 },
      novelty: 1
    }
  ]
};
var context1800 = {
  year: 1800,
  zeitgeist: {
    era: "founding",
    nodeWeights: { PF: 2, ONT_S: 2, CD: 1.8, MAT: 1.5, TRB: 1.5, CU: 1.5 },
    intensity: 1.5,
    description: "Alien & Sedition Acts; partisan warfare; both sides fear the republic will die if they lose"
  },
  issueLandscape: {
    primaryAxis: ["PF", "ONT_S", "CD"],
    secondaryAxis: ["MAT", "CU", "TRB", "ONT_H"],
    dormant: ["MOR", "PRO", "COM", "ZS", "ENG"],
    description: "Liberty vs order; Sedition Acts make free speech THE issue; existential partisan conflict"
  },
  candidateActivations: [
    {
      candidateName: "Jefferson",
      activationNodes: { ONT_S: 1.5, CU: 1.5, ONT_H: 1.3, PF: 1.3 },
      novelty: 1.5,
      threatActivation: { CD: 1.5, PRO: 1.3 }
    },
    {
      candidateName: "Adams",
      activationNodes: { PRO: 1.3, CD: 1.5, MAT: 1.2 },
      novelty: 1,
      threatActivation: { ONT_S: 1.5, CU: 1.3 }
    }
  ]
};
var context1804 = {
  year: 1804,
  zeitgeist: {
    era: "founding",
    nodeWeights: { ONT_H: 1.5, MAT: 1.3, PF: 0.7 },
    intensity: 0.8,
    description: "Louisiana Purchase vindicates Jefferson; national optimism; Federalists crumbling"
  },
  issueLandscape: {
    primaryAxis: ["ONT_H", "MAT", "CU"],
    secondaryAxis: ["CD", "PRO", "ONT_S", "ENG"],
    dormant: ["MOR", "COM", "ZS", "PF", "TRB"],
    description: "Expansion and prosperity dominate; opposition party has no compelling counter-narrative"
  },
  candidateActivations: [
    {
      candidateName: "Jefferson",
      activationNodes: { ONT_H: 1.5, CU: 1.3, MAT: 1.2 },
      novelty: 1.3
    },
    {
      candidateName: "Pinckney",
      activationNodes: { CD: 1.2, PRO: 1.2 },
      novelty: 0.8
    }
  ]
};
var context1808 = {
  year: 1808,
  zeitgeist: {
    era: "founding",
    nodeWeights: { MAT: 2, ONT_S: 1.5, ZS: 1.5, CU: 1.3 },
    intensity: 1.1,
    description: "Embargo Act devastating New England commerce; British impressment; war looming"
  },
  issueLandscape: {
    primaryAxis: ["MAT", "ZS", "ONT_S"],
    secondaryAxis: ["CU", "PRO", "CD", "ENG"],
    dormant: ["MOR", "COM", "ONT_H", "PF", "TRB"],
    description: "Trade embargo splits the country; economic pain vs national honor against Britain"
  },
  candidateActivations: [
    {
      candidateName: "Madison",
      activationNodes: { PRO: 1.3, CU: 1.2, ONT_H: 1.2 },
      novelty: 1,
      threatActivation: { MAT: 1.3 }
    },
    {
      candidateName: "Pinckney",
      activationNodes: { MAT: 1.5, CD: 1.3, ZS: 1.2 },
      novelty: 0.8
    }
  ]
};
var context1812 = {
  year: 1812,
  zeitgeist: {
    era: "founding",
    nodeWeights: { ZS: 2.5, TRB: 2, ONT_S: 1.8, ENG: 1.5, MAT: 1.3 },
    intensity: 1.3,
    description: "Nation at war with Britain; security and national survival dominate the election"
  },
  issueLandscape: {
    primaryAxis: ["ZS", "TRB", "ONT_S"],
    secondaryAxis: ["MAT", "ENG", "PRO", "PF"],
    dormant: ["CD", "CU", "MOR", "COM", "ONT_H"],
    description: "War hawks vs peace faction; national honor and security override all other concerns"
  },
  candidateActivations: [
    {
      candidateName: "Madison",
      activationNodes: { ZS: 1.5, TRB: 1.3, ENG: 1.3 },
      novelty: 1,
      threatActivation: { ONT_S: 1.3 }
    },
    {
      candidateName: "Clinton",
      activationNodes: { MAT: 1.3, COM: 1.2, PRO: 1.2 },
      novelty: 1,
      threatActivation: { ZS: 1.3 }
    }
  ]
};
var context1816 = {
  year: 1816,
  zeitgeist: {
    era: "good-feelings",
    nodeWeights: { COM: 1.5, ONT_H: 1.5, PF: 0.5, TRB: 0.5 },
    intensity: 0.7,
    description: "Post-war nationalism; Federalists irrelevant; one-party era beginning"
  },
  issueLandscape: {
    primaryAxis: ["COM", "ONT_H", "MAT"],
    secondaryAxis: ["PRO", "ONT_S", "ENG"],
    dormant: ["CD", "CU", "MOR", "ZS", "PF", "TRB"],
    description: "National unity and internal improvements; partisan conflict dormant"
  },
  candidateActivations: [
    {
      candidateName: "Monroe",
      activationNodes: { COM: 1.5, ONT_H: 1.3, MAT: 1.2 },
      novelty: 1
    },
    {
      candidateName: "King",
      activationNodes: { PRO: 1.2, CD: 1.2 },
      novelty: 0.8
    }
  ]
};
var context1820 = {
  year: 1820,
  zeitgeist: {
    era: "good-feelings",
    nodeWeights: { COM: 1.8, ONT_H: 1.5, PF: 0.5, TRB: 0.5, ZS: 0.5 },
    intensity: 0.7,
    description: "Peak national unity; Monroe Doctrine era; Missouri Compromise foreshadows trouble"
  },
  issueLandscape: {
    primaryAxis: ["COM", "ONT_H", "PRO"],
    secondaryAxis: ["MAT", "ONT_S", "ENG"],
    dormant: ["CD", "CU", "MOR", "ZS", "PF", "TRB"],
    description: "Virtually no contest; national consensus on internal improvements and expansion"
  },
  candidateActivations: [
    {
      candidateName: "Monroe",
      activationNodes: { COM: 1.5, ONT_H: 1.3 },
      novelty: 0.8
    }
  ]
};
var context1824 = {
  year: 1824,
  zeitgeist: {
    era: "good-feelings",
    nodeWeights: { PF: 1.8, TRB: 1.5, ONT_S: 1.5, MAT: 1.5, ENG: 1.3 },
    intensity: 1.2,
    description: "One-party system fracturing; 4-way race driven by personality and regional identity"
  },
  issueLandscape: {
    primaryAxis: ["MAT", "TRB", "ONT_S"],
    secondaryAxis: ["PRO", "PF", "COM", "ENG"],
    dormant: ["CD", "CU", "MOR", "ZS", "ONT_H"],
    description: "American System vs agrarian populism; regional blocs and personal factions replace parties"
  },
  candidateActivations: [
    {
      candidateName: "Adams",
      activationNodes: { MAT: 1.3, PRO: 1.3, COM: 1.2 },
      novelty: 1
    },
    {
      candidateName: "Jackson",
      activationNodes: { TRB: 1.5, ONT_S: 1.5, ENG: 1.5 },
      novelty: 1.5,
      threatActivation: { PRO: 1.3, COM: 1.2 }
    },
    {
      candidateName: "Crawford",
      activationNodes: { PF: 1.3, PRO: 1.2 },
      novelty: 0.8
    },
    {
      candidateName: "Clay",
      activationNodes: { MAT: 1.3, COM: 1.5, PRO: 1.2 },
      novelty: 1
    }
  ]
};
var context1828 = {
  year: 1828,
  zeitgeist: {
    era: "jacksonian",
    nodeWeights: { TRB: 2, ONT_S: 2, PF: 2, ENG: 1.8, MAT: 1.5, ONT_H: 1.3 },
    intensity: 1.3,
    description: "Mass democracy arrives; common man vs establishment; 'corrupt bargain' revenge"
  },
  issueLandscape: {
    primaryAxis: ["TRB", "ONT_S", "PF"],
    secondaryAxis: ["MAT", "ENG", "ONT_H", "PRO"],
    dormant: ["CD", "CU", "MOR", "ZS", "COM"],
    description: "Populism vs elitism; Jackson channels rage of the common man against Adams aristocracy"
  },
  candidateActivations: [
    {
      candidateName: "Jackson",
      activationNodes: { TRB: 1.8, ONT_S: 1.5, ENG: 1.5, PF: 1.3 },
      novelty: 1.8,
      threatActivation: { PRO: 1.5, COM: 1.3 }
    },
    {
      candidateName: "Adams",
      activationNodes: { PRO: 1.3, MAT: 1.2 },
      novelty: 0.8,
      threatActivation: { ONT_S: 1.3, TRB: 1.3 }
    }
  ]
};
var context1832 = {
  year: 1832,
  zeitgeist: {
    era: "jacksonian",
    nodeWeights: { MAT: 2.5, ONT_S: 2, TRB: 1.8, PF: 1.8, PRO: 1.5 },
    intensity: 1.3,
    description: "Bank War dominates; Jackson vetoes BUS; nullification crisis challenges federal authority"
  },
  issueLandscape: {
    primaryAxis: ["MAT", "ONT_S", "PRO"],
    secondaryAxis: ["TRB", "PF", "ENG", "COM"],
    dormant: ["CD", "CU", "MOR", "ZS", "ONT_H"],
    description: "National Bank is THE issue; executive power vs congressional prerogative; state vs federal"
  },
  candidateActivations: [
    {
      candidateName: "Jackson",
      activationNodes: { MAT: 1.5, ONT_S: 1.5, TRB: 1.3, ENG: 1.3 },
      novelty: 1.3,
      threatActivation: { PRO: 1.5, COM: 1.3 }
    },
    {
      candidateName: "Clay",
      activationNodes: { MAT: 1.5, PRO: 1.5, COM: 1.3 },
      novelty: 1,
      threatActivation: { ONT_S: 1.3, TRB: 1.2 }
    }
  ]
};
var context1836 = {
  year: 1836,
  zeitgeist: {
    era: "jacksonian",
    nodeWeights: { PF: 2, TRB: 1.8, COM: 1.3 },
    intensity: 1,
    description: "Jacksonian succession; party machine vs scattered Whig opposition"
  },
  issueLandscape: {
    primaryAxis: ["PF", "TRB", "COM"],
    secondaryAxis: ["MAT", "PRO", "ENG"],
    dormant: ["CD", "CU", "MOR", "ZS", "ONT_H", "ONT_S"],
    description: "Party loyalty and coalition management dominate; VB inherits Jackson's machine"
  },
  candidateActivations: [
    {
      candidateName: "Van Buren",
      activationNodes: { PF: 1.8, TRB: 1.5, COM: 1.3 },
      novelty: 1.2
    },
    {
      candidateName: "Harrison",
      activationNodes: { PRO: 1.2 },
      novelty: 0.8
    }
  ]
};
var context1840 = {
  year: 1840,
  zeitgeist: {
    era: "jacksonian",
    nodeWeights: { MAT: 2.5, ONT_S: 2.5, TRB: 2, ENG: 2, ZS: 1.5 },
    intensity: 1.3,
    description: "Depression of 1837 devastates the country; first mass-spectacle campaign; record turnout"
  },
  issueLandscape: {
    primaryAxis: ["MAT", "ONT_S", "ENG"],
    secondaryAxis: ["TRB", "ZS", "COM"],
    dormant: ["CD", "CU", "MOR", "PRO", "ONT_H", "PF"],
    description: "Economic catastrophe drives everything; 'log cabin and hard cider' populism vs incumbent blame"
  },
  candidateActivations: [
    {
      candidateName: "Harrison",
      activationNodes: { ONT_S: 1.5, TRB: 1.5, ENG: 1.5, MAT: 1.3 },
      novelty: 1.3,
      threatActivation: { MAT: 1.3 }
    },
    {
      candidateName: "Van Buren",
      activationNodes: { PF: 1.3, COM: 1.2 },
      novelty: 0.8,
      threatActivation: { ONT_S: 1.5, MAT: 1.3 }
    }
  ]
};
var context1844 = {
  year: 1844,
  zeitgeist: {
    era: "jacksonian",
    nodeWeights: { TRB: 2.5, ZS: 2, ENG: 1.5 },
    intensity: 1.2,
    description: "Manifest Destiny fever; Texas annexation; expansionist energy vs cautious establishment"
  },
  issueLandscape: {
    primaryAxis: ["TRB", "ZS", "ENG"],
    secondaryAxis: ["MAT", "PF", "ONT_S"],
    dormant: ["CD", "CU", "MOR", "PRO", "COM", "ONT_H"],
    description: "Expansion and national destiny dominate; Texas and Oregon questions split along sectional lines"
  },
  candidateActivations: [
    {
      candidateName: "Polk",
      activationNodes: { TRB: 1.8, ZS: 1.5, ENG: 1.5 },
      novelty: 1.5
    },
    {
      candidateName: "Clay",
      activationNodes: { MAT: 1.3, COM: 1.5, PRO: 1.3 },
      novelty: 1,
      threatActivation: { CU: 1.2 }
    }
  ]
};
var context1848 = {
  year: 1848,
  zeitgeist: {
    era: "jacksonian",
    nodeWeights: { MOR: 2, TRB: 1.8, CU: 1.5, ONT_S: 1.5, ZS: 1.3 },
    intensity: 1.2,
    description: "Mexican War conquered new territory; slavery expansion is now unavoidable; Free Soil revolt"
  },
  issueLandscape: {
    primaryAxis: ["MOR", "TRB", "ONT_S"],
    secondaryAxis: ["CU", "ZS", "PF", "ENG"],
    dormant: ["MAT", "CD", "PRO", "COM", "ONT_H"],
    description: "Wilmot Proviso and slavery in the territories; Free Soil movement fractures both parties"
  },
  candidateActivations: [
    {
      candidateName: "Taylor",
      activationNodes: { COM: 1.3, TRB: 1.2 },
      novelty: 1
    },
    {
      candidateName: "Cass",
      activationNodes: { PF: 1.3, TRB: 1.3 },
      novelty: 0.8
    },
    {
      candidateName: "Van Buren",
      activationNodes: { MOR: 1.8, ONT_S: 1.5, ENG: 1.3, CU: 1.3 },
      novelty: 1.3,
      threatActivation: { TRB: 1.3, PF: 1.2 }
    }
  ]
};
var context1852 = {
  year: 1852,
  zeitgeist: {
    era: "jacksonian",
    nodeWeights: { MOR: 1.8, COM: 1.5, PF: 1.5, TRB: 1.5, ONT_S: 1.3 },
    intensity: 1,
    description: "Compromise of 1850 bought time but satisfied nobody; Fugitive Slave Act enrages North; Whig party fracturing"
  },
  issueLandscape: {
    primaryAxis: ["MOR", "COM", "PF"],
    secondaryAxis: ["TRB", "ONT_S", "CD", "ENG"],
    dormant: ["MAT", "CU", "PRO", "ZS", "ONT_H"],
    description: "Slavery and the Compromise dominate; both parties claim to be unionist; Whigs have no clear identity"
  },
  candidateActivations: [
    {
      candidateName: "Pierce",
      activationNodes: { PF: 1.3, COM: 1.3, TRB: 1.2 },
      novelty: 1
    },
    {
      candidateName: "Scott",
      activationNodes: { PRO: 1.2 },
      novelty: 0.8
    }
  ]
};
var CONTEXTS_1789_1852 = [
  context1789,
  context1792,
  context1796,
  context1800,
  context1804,
  context1808,
  context1812,
  context1816,
  context1820,
  context1824,
  context1828,
  context1832,
  context1836,
  context1840,
  context1844,
  context1848,
  context1852
];

// src/historical/contexts-1856-1916.ts
var context1856 = {
  year: 1856,
  zeitgeist: {
    era: "sectional",
    nodeWeights: { MOR: 1.8, TRB: 1.8, CD: 1.5, CU: 1.5, ONT_S: 1.5, COM: 1.3 },
    intensity: 1.3,
    description: "Bleeding Kansas; slavery expansion fracturing the party system"
  },
  issueLandscape: {
    primaryAxis: ["MOR", "TRB", "CD"],
    secondaryAxis: ["CU", "ONT_S", "COM", "PRO", "ZS"],
    dormant: ["MAT", "ONT_H", "PF", "ENG"],
    description: "Slavery in territories dominates; nativism a secondary current; economics irrelevant"
  },
  candidateActivations: [
    {
      candidateName: "Buchanan",
      activationNodes: { COM: 1.4, PRO: 1.3, PF: 1.2 },
      novelty: 1,
      threatActivation: { ONT_S: 1.2 }
    },
    {
      candidateName: "Fremont",
      activationNodes: { MOR: 1.5, CU: 1.4, ONT_S: 1.3 },
      novelty: 1.5,
      threatActivation: { TRB: 1.5, CD: 1.4 }
    },
    {
      candidateName: "Fillmore",
      activationNodes: { CD: 1.5, TRB: 1.5, ZS: 1.3 },
      novelty: 0.8,
      threatActivation: { CU: 1.3 }
    }
  ]
};
var context1860 = {
  year: 1860,
  zeitgeist: {
    era: "sectional",
    nodeWeights: { MOR: 2, TRB: 2, ONT_S: 2, CD: 1.8, CU: 1.5, ZS: 1.5 },
    intensity: 1.5,
    description: "Nation fracturing over slavery; secession looming; existential stakes"
  },
  issueLandscape: {
    primaryAxis: ["MOR", "TRB", "ONT_S"],
    secondaryAxis: ["CD", "CU", "PRO", "ZS"],
    dormant: ["MAT", "COM", "ONT_H", "PF", "ENG"],
    description: "Slavery expansion is THE issue; economic policy irrelevant; party system shattering"
  },
  candidateActivations: [
    {
      candidateName: "Lincoln",
      activationNodes: { MOR: 1.5, CU: 1.3, PRO: 1.2 },
      novelty: 1.8,
      threatActivation: { TRB: 1.5, CD: 1.3 }
    },
    {
      candidateName: "Douglas",
      activationNodes: { COM: 1.3, PRO: 1.2 },
      novelty: 1
    },
    {
      candidateName: "Breckinridge",
      activationNodes: { TRB: 1.8, CD: 1.5, ZS: 1.3 },
      novelty: 1.2,
      threatActivation: { MOR: 1.4, CU: 1.3 }
    },
    {
      candidateName: "Bell",
      activationNodes: { COM: 1.5, PRO: 1.3 },
      novelty: 0.8
    }
  ]
};
var context1864 = {
  year: 1864,
  zeitgeist: {
    era: "civil-war",
    nodeWeights: { MOR: 2.5, ZS: 2, TRB: 2, ONT_S: 2, ENG: 1.8, CD: 1.5 },
    intensity: 1.5,
    description: "Civil War raging; emancipation now a war aim; Union survival at stake"
  },
  issueLandscape: {
    primaryAxis: ["MOR", "ZS", "TRB"],
    secondaryAxis: ["ONT_S", "CD", "ENG", "PRO"],
    dormant: ["MAT", "CU", "COM", "ONT_H", "PF"],
    description: "War vs. peace; emancipation vs. restoration; total commitment vs. negotiation"
  },
  candidateActivations: [
    {
      candidateName: "Lincoln",
      activationNodes: { MOR: 1.8, ENG: 1.5, ONT_S: 1.4, CU: 1.3 },
      novelty: 1.5,
      threatActivation: { ZS: 1.3, TRB: 1.3 }
    },
    {
      candidateName: "McClellan",
      activationNodes: { COM: 1.3, PRO: 1.4, ZS: 1.2 },
      novelty: 1,
      threatActivation: { MOR: 1.5, ONT_S: 1.4 }
    }
  ]
};
var context1868 = {
  year: 1868,
  zeitgeist: {
    era: "civil-war",
    nodeWeights: { MOR: 2, TRB: 2, CD: 1.8, CU: 1.5, ONT_S: 1.5, ZS: 1.5 },
    intensity: 1.3,
    description: "Reconstruction underway; 14th Amendment; KKK violence; freedmen's rights contested"
  },
  issueLandscape: {
    primaryAxis: ["MOR", "TRB", "CD"],
    secondaryAxis: ["CU", "ONT_S", "ZS", "PRO"],
    dormant: ["MAT", "COM", "ONT_H", "PF", "ENG"],
    description: "Reconstruction and Black rights dominate; racial hierarchy vs. equal citizenship"
  },
  candidateActivations: [
    {
      candidateName: "Grant",
      activationNodes: { MOR: 1.4, PRO: 1.3, CU: 1.3 },
      novelty: 1.5,
      threatActivation: { TRB: 1.2 }
    },
    {
      candidateName: "Seymour",
      activationNodes: { TRB: 1.6, CD: 1.5, ZS: 1.4 },
      novelty: 0.8,
      threatActivation: { MOR: 1.5, CU: 1.4, ONT_S: 1.3 }
    }
  ]
};
var context1872 = {
  year: 1872,
  zeitgeist: {
    era: "reconstruction",
    nodeWeights: { PRO: 1.5, MOR: 1.3, ONT_S: 1.3, COM: 1.3, PF: 0.7 },
    intensity: 0.9,
    description: "Reconstruction fatigue; corruption scandals; Liberal Republican revolt"
  },
  issueLandscape: {
    primaryAxis: ["PRO", "COM", "ONT_S"],
    secondaryAxis: ["MOR", "CD", "CU", "PF"],
    dormant: ["MAT", "ZS", "ONT_H", "TRB", "ENG"],
    description: "Corruption vs. clean government; reconciliation vs. continued Reconstruction"
  },
  candidateActivations: [
    {
      candidateName: "Grant",
      activationNodes: { MOR: 1.3, TRB: 1.2, PF: 1.3 },
      novelty: 1
    },
    {
      candidateName: "Greeley",
      activationNodes: { COM: 1.5, PRO: 1.4, ONT_H: 1.3, ONT_S: 1.3 },
      novelty: 1.3,
      threatActivation: { MOR: 1.2 }
    }
  ]
};
var context1876 = {
  year: 1876,
  zeitgeist: {
    era: "reconstruction",
    nodeWeights: { PRO: 1.8, ONT_S: 1.5, MOR: 1.3, COM: 1.3, PF: 1.3 },
    intensity: 1.2,
    description: "Reconstruction winding down; Grant scandals; reform movement ascendant"
  },
  issueLandscape: {
    primaryAxis: ["PRO", "ONT_S", "MOR"],
    secondaryAxis: ["COM", "CD", "PF", "TRB"],
    dormant: ["MAT", "CU", "ZS", "ONT_H", "ENG"],
    description: "Clean government vs. corruption; Reconstruction's fate decided behind closed doors"
  },
  candidateActivations: [
    {
      candidateName: "Hayes",
      activationNodes: { PRO: 1.4, PF: 1.3, COM: 1.2 },
      novelty: 1
    },
    {
      candidateName: "Tilden",
      activationNodes: { PRO: 1.5, ONT_S: 1.3 },
      novelty: 1.3,
      threatActivation: { MOR: 1.2 }
    }
  ]
};
var context1880 = {
  year: 1880,
  zeitgeist: {
    era: "gilded",
    nodeWeights: { PRO: 2, MAT: 1.5, PF: 1.5, MOR: 0.3, CD: 0.3, CU: 0.3 },
    intensity: 0.8,
    description: "Post-Reconstruction calm; patronage politics; tariff debate; low-stakes"
  },
  issueLandscape: {
    primaryAxis: ["PRO", "MAT", "PF"],
    secondaryAxis: ["COM", "TRB", "ONT_S"],
    dormant: ["CD", "CU", "MOR", "ZS", "ONT_H", "ENG"],
    description: "Civil service reform and tariff; moral questions of Reconstruction era fading"
  },
  candidateActivations: [
    {
      candidateName: "Garfield",
      activationNodes: { PRO: 1.3, MAT: 1.2, ONT_H: 1.2 },
      novelty: 1
    },
    {
      candidateName: "Hancock",
      activationNodes: { COM: 1.2, PF: 1.1 },
      novelty: 1
    }
  ]
};
var context1884 = {
  year: 1884,
  zeitgeist: {
    era: "gilded",
    nodeWeights: { PRO: 1.8, PF: 1.3, MAT: 1.2, MOR: 0.6, CD: 0.6 },
    intensity: 1,
    description: "Corruption vs. reform; Mugwump revolt; character matters more than policy"
  },
  issueLandscape: {
    primaryAxis: ["PRO", "PF", "COM"],
    secondaryAxis: ["MAT", "TRB", "CD"],
    dormant: ["CU", "MOR", "ZS", "ONT_H", "ONT_S", "ENG"],
    description: "Personal integrity and clean government dominate; tariff secondary; moral questions dormant"
  },
  candidateActivations: [
    {
      candidateName: "Cleveland",
      activationNodes: { PRO: 1.5, COM: 1.2 },
      novelty: 1.3
    },
    {
      candidateName: "Blaine",
      activationNodes: { PF: 1.4, TRB: 1.3, ENG: 1.3 },
      novelty: 1,
      threatActivation: { PRO: 1.4 }
    }
  ]
};
var context1888 = {
  year: 1888,
  zeitgeist: {
    era: "gilded",
    nodeWeights: { MAT: 1.5, PRO: 1.3, PF: 1.3, MOR: 0.5, CD: 0.5 },
    intensity: 0.8,
    description: "Tariff is THE issue; patronage politics; honest but boring"
  },
  issueLandscape: {
    primaryAxis: ["MAT", "PRO", "PF"],
    secondaryAxis: ["COM", "CU", "TRB"],
    dormant: ["CD", "MOR", "ZS", "ONT_H", "ONT_S", "ENG"],
    description: "Tariff reduction vs. protection; party organization and patronage; low moral stakes"
  },
  candidateActivations: [
    {
      candidateName: "Harrison",
      activationNodes: { MAT: 1.3, PF: 1.3, TRB: 1.2 },
      novelty: 1
    },
    {
      candidateName: "Cleveland",
      activationNodes: { PRO: 1.3, MAT: 1.2 },
      novelty: 0.8
    }
  ]
};
var context1892 = {
  year: 1892,
  zeitgeist: {
    era: "gilded",
    nodeWeights: { MAT: 1.8, ONT_S: 1.8, ZS: 1.5, TRB: 1.5, ENG: 1.3, MOR: 0.6 },
    intensity: 1.1,
    description: "Agrarian revolt; Homestead Strike; Populist insurgency; economic anxiety rising"
  },
  issueLandscape: {
    primaryAxis: ["MAT", "ONT_S", "ZS"],
    secondaryAxis: ["TRB", "ENG", "PF", "COM"],
    dormant: ["CD", "CU", "MOR", "PRO", "ONT_H"],
    description: "Economic class conflict erupting; gold vs. silver nascent; Populist third force"
  },
  candidateActivations: [
    {
      candidateName: "Cleveland",
      activationNodes: { PRO: 1.3, COM: 1.2 },
      novelty: 0.8
    },
    {
      candidateName: "Harrison",
      activationNodes: { MAT: 1.2, PF: 1.3 },
      novelty: 0.8
    },
    {
      candidateName: "Weaver",
      activationNodes: { ONT_S: 1.6, ZS: 1.5, TRB: 1.5, MAT: 1.4, ENG: 1.4 },
      novelty: 1.5,
      threatActivation: { MAT: 1.3, ONT_S: 1.3 }
    }
  ]
};
var context1896 = {
  year: 1896,
  zeitgeist: {
    era: "progressive",
    nodeWeights: { MAT: 2, PRO: 1.5, PF: 1.5 },
    intensity: 1.2,
    description: "Realignment: gold vs. silver; industrial capitalism vs. agrarian populism; Panic of 1893 aftermath"
  },
  issueLandscape: {
    primaryAxis: ["MAT", "PRO", "PF"],
    secondaryAxis: ["ONT_S", "CD", "COM"],
    dormant: ["CU", "MOR", "ZS", "TRB", "ONT_H", "ENG"],
    description: "Economic policy dominates; McKinley's 'full dinner pail' vs Bryan's silver populism"
  },
  candidateActivations: [
    {
      candidateName: "McKinley",
      activationNodes: { MAT: 1.5, PRO: 1.5, PF: 1.3, COM: 1.3 },
      novelty: 1.2,
      threatActivation: { ONT_S: 1.3 }
    },
    {
      candidateName: "Bryan",
      activationNodes: { ONT_S: 1.3, TRB: 1.2 },
      novelty: 1.3
    }
  ]
};
var context1900 = {
  year: 1900,
  zeitgeist: {
    era: "progressive",
    nodeWeights: { MAT: 1.5, CU: 1.5, MOR: 1.3, ZS: 1.3, ONT_S: 0.7 },
    intensity: 1,
    description: "Prosperity; imperialism debate; silver question fading; realignment consolidated"
  },
  issueLandscape: {
    primaryAxis: ["MAT", "CU", "MOR"],
    secondaryAxis: ["ZS", "TRB", "CD", "ENG"],
    dormant: ["PRO", "COM", "ONT_H", "ONT_S", "PF"],
    description: "Imperialism (Philippines) joins economic debate; prosperity vs. populism rematch"
  },
  candidateActivations: [
    {
      candidateName: "McKinley",
      activationNodes: { MAT: 1.3, CU: 1.2, PF: 1.2 },
      novelty: 1
    },
    {
      candidateName: "Bryan",
      activationNodes: { MOR: 1.4, CU: 1.3, ZS: 1.3, TRB: 1.3, ENG: 1.3 },
      novelty: 1,
      threatActivation: { MAT: 1.3 }
    }
  ]
};
var context1904 = {
  year: 1904,
  zeitgeist: {
    era: "progressive",
    nodeWeights: { ONT_S: 1.5, MAT: 1.5, MOR: 1.3, ONT_H: 1.3, PRO: 0.7 },
    intensity: 1.1,
    description: "Progressive era dawning; trust-busting; conservation; Square Deal; prosperity continuing"
  },
  issueLandscape: {
    primaryAxis: ["ONT_S", "MAT", "MOR"],
    secondaryAxis: ["ONT_H", "CU", "ENG", "ZS"],
    dormant: ["CD", "PRO", "COM", "PF", "TRB"],
    description: "Trust regulation and corporate power; role of government in economy; cultural issues quiet"
  },
  candidateActivations: [
    {
      candidateName: "Roosevelt",
      activationNodes: { ONT_S: 1.4, MOR: 1.4, ENG: 1.5, ONT_H: 1.3 },
      novelty: 1.5
    },
    {
      candidateName: "Parker",
      activationNodes: { PRO: 1.3, COM: 1.3 },
      novelty: 0.8
    }
  ]
};
var context1908 = {
  year: 1908,
  zeitgeist: {
    era: "progressive",
    nodeWeights: { ONT_S: 1.5, MAT: 1.5, PRO: 1.3, ONT_H: 1.3, TRB: 0.6 },
    intensity: 0.9,
    description: "Progressive reforms mainstreaming; TR's heir vs. the Great Commoner; reform consensus"
  },
  issueLandscape: {
    primaryAxis: ["ONT_S", "MAT", "PRO"],
    secondaryAxis: ["ONT_H", "MOR", "COM", "ENG"],
    dormant: ["CD", "CU", "ZS", "PF", "TRB"],
    description: "Degree of Progressive reform; railroad regulation; income tax; direct democracy"
  },
  candidateActivations: [
    {
      candidateName: "Taft",
      activationNodes: { PRO: 1.3, COM: 1.2 },
      novelty: 1
    },
    {
      candidateName: "Bryan",
      activationNodes: { ONT_S: 1.4, MAT: 1.3, MOR: 1.3, ENG: 1.3 },
      novelty: 1
    }
  ]
};
var context1912 = {
  year: 1912,
  zeitgeist: {
    era: "progressive",
    nodeWeights: { ONT_S: 2, MAT: 1.8, ONT_H: 1.8, MOR: 1.5, PF: 1.5, ENG: 1.5 },
    intensity: 1.3,
    description: "Peak Progressive era; three-way reform debate; party system fracturing; high engagement"
  },
  issueLandscape: {
    primaryAxis: ["ONT_S", "MAT", "ONT_H"],
    secondaryAxis: ["MOR", "PF", "ENG", "PRO"],
    dormant: ["CD", "CU", "ZS", "COM", "TRB"],
    description: "How to reform capitalism: break trusts, regulate trusts, or leave courts in charge"
  },
  candidateActivations: [
    {
      candidateName: "Wilson",
      activationNodes: { ONT_S: 1.4, MAT: 1.3, MOR: 1.3, PRO: 1.2 },
      novelty: 1.3
    },
    {
      candidateName: "Roosevelt",
      activationNodes: { ONT_S: 1.6, MOR: 1.6, ONT_H: 1.5, ENG: 1.5, MAT: 1.3 },
      novelty: 1.5,
      threatActivation: { PRO: 1.3, PF: 1.3 }
    },
    {
      candidateName: "Taft",
      activationNodes: { PRO: 1.4, PF: 1.3 },
      novelty: 0.8
    }
  ]
};
var context1916 = {
  year: 1916,
  zeitgeist: {
    era: "progressive",
    nodeWeights: { ZS: 1.8, CU: 1.5, MAT: 1.5, TRB: 1.3, ONT_S: 1.3 },
    intensity: 1.2,
    description: "European war looming; neutrality vs. preparedness; Progressive legislation at home"
  },
  issueLandscape: {
    primaryAxis: ["ZS", "CU", "MAT"],
    secondaryAxis: ["TRB", "ONT_S", "PRO", "MOR"],
    dormant: ["CD", "COM", "ONT_H", "PF", "ENG"],
    description: "War and peace dominate; Progressive reforms continue; party reunification for GOP"
  },
  candidateActivations: [
    {
      candidateName: "Wilson",
      activationNodes: { MAT: 1.3, MOR: 1.3, CU: 1.2, ONT_S: 1.2 },
      novelty: 1,
      threatActivation: { ZS: 1.3, TRB: 1.2 }
    },
    {
      candidateName: "Hughes",
      activationNodes: { PRO: 1.3, ZS: 1.2, PF: 1.3 },
      novelty: 1,
      threatActivation: { CU: 1.2 }
    }
  ]
};
var CONTEXTS_1856_1916 = [
  context1856,
  context1860,
  context1864,
  context1868,
  context1872,
  context1876,
  context1880,
  context1884,
  context1888,
  context1892,
  context1896,
  context1900,
  context1904,
  context1908,
  context1912,
  context1916
];

// src/historical/contexts-1920-2024.ts
var context1920 = {
  year: 1920,
  zeitgeist: {
    era: "normalcy",
    nodeWeights: { COM: 2, PRO: 1.5, ONT_S: 0.5, ENG: 0.6 },
    intensity: 0.7,
    description: "Post-WWI exhaustion; voters reject Wilsonian crusades and want calm normalcy"
  },
  issueLandscape: {
    primaryAxis: ["COM", "PRO", "MAT"],
    secondaryAxis: ["CD", "ONT_S"],
    dormant: ["CU", "MOR", "ZS", "ONT_H", "PF", "TRB", "ENG"],
    description: "Normalcy vs reform; voters exhausted; compromise and stability win"
  },
  candidateActivations: [
    {
      candidateName: "Harding",
      activationNodes: { COM: 1.5, PRO: 1.3 },
      novelty: 1.2
    },
    {
      candidateName: "Cox",
      activationNodes: { CU: 1.1 },
      novelty: 0.7
    }
  ]
};
var context1924 = {
  year: 1924,
  zeitgeist: {
    era: "normalcy",
    nodeWeights: { MAT: 1.3, ONT_S: 1.4, PF: 0.7 },
    intensity: 0.8,
    description: "Prosperity + KKK controversy + Progressive insurgency fragmenting politics"
  },
  issueLandscape: {
    primaryAxis: ["MAT", "ONT_S", "CD"],
    secondaryAxis: ["MOR", "PRO", "COM", "CU"],
    dormant: ["ZS", "ONT_H", "PF", "TRB", "ENG"],
    description: "Business prosperity vs. anti-monopoly reform; KKK and cultural identity simmer"
  },
  candidateActivations: [
    {
      candidateName: "Coolidge",
      activationNodes: { MAT: 1.2, PRO: 1.3 },
      novelty: 0.8
    },
    {
      candidateName: "Davis",
      activationNodes: { MOR: 1.2, PRO: 1.2 },
      novelty: 0.8
    },
    {
      candidateName: "La Follette",
      activationNodes: { MAT: 1.5, ONT_S: 1.6, COM: 0.7, PF: 0.7 },
      novelty: 1.5,
      threatActivation: { MAT: 1.3, ONT_S: 1.3 }
    }
  ]
};
var context1928 = {
  year: 1928,
  zeitgeist: {
    era: "normalcy",
    nodeWeights: { CD: 1.8, TRB: 1.5, MOR: 1.4 },
    intensity: 0.9,
    description: "Peak 1920s prosperity but deep urban-rural cultural divide over religion and prohibition"
  },
  issueLandscape: {
    primaryAxis: ["CD", "TRB", "MOR"],
    secondaryAxis: ["MAT", "CU", "PRO", "ONT_H"],
    dormant: ["COM", "ZS", "ONT_S", "PF", "ENG"],
    description: "Catholic candidate triggers cultural identity war; economy is background consensus"
  },
  candidateActivations: [
    {
      candidateName: "Hoover",
      activationNodes: { PRO: 1.3, MAT: 1.2, ONT_H: 1.2 },
      novelty: 1.2
    },
    {
      candidateName: "Smith",
      activationNodes: { CD: 1.4, TRB: 1.5, CU: 1.3 },
      novelty: 1.4,
      threatActivation: { CD: 1.5, TRB: 1.4, MOR: 1.3 }
    }
  ]
};
var context1932 = {
  year: 1932,
  zeitgeist: {
    era: "new-deal",
    nodeWeights: { MAT: 2.5, ONT_S: 2, ZS: 1.5, ONT_H: 1.5, ENG: 1.3 },
    intensity: 1.5,
    description: "25% unemployment; Hoovervilles; total economic collapse; realignment election"
  },
  issueLandscape: {
    primaryAxis: ["MAT", "ONT_S", "ONT_H"],
    secondaryAxis: ["ZS", "PRO", "COM", "ENG"],
    dormant: ["CD", "CU", "MOR", "PF", "TRB"],
    description: "Depression is THE issue; economic philosophy and systemic failure dominate everything"
  },
  candidateActivations: [
    {
      candidateName: "Roosevelt",
      activationNodes: { MAT: 1.5, ONT_S: 1.5, ONT_H: 1.5, ENG: 1.4 },
      novelty: 1.8,
      threatActivation: { MAT: 1.2 }
    },
    {
      candidateName: "Hoover",
      activationNodes: { PRO: 1.3, MAT: 1.2 },
      novelty: 0.8,
      threatActivation: { MAT: 1.5, ONT_S: 1.5 }
    }
  ]
};
var context1936 = {
  year: 1936,
  zeitgeist: {
    era: "new-deal",
    nodeWeights: { MAT: 2.2, ONT_S: 1.8, TRB: 1.5, PF: 1.5 },
    intensity: 1.3,
    description: "New Deal as referendum; labor vs. business class warfare; party realignment solidifying"
  },
  issueLandscape: {
    primaryAxis: ["MAT", "ONT_S", "TRB"],
    secondaryAxis: ["PF", "ZS", "ONT_H", "PRO"],
    dormant: ["CD", "CU", "MOR", "COM", "ENG"],
    description: "Pure economics and class: New Deal populism vs. free enterprise; labor vs. business"
  },
  candidateActivations: [
    {
      candidateName: "Roosevelt",
      activationNodes: { MAT: 1.5, ONT_S: 1.4, TRB: 1.4, ENG: 1.3 },
      novelty: 1.5
    },
    {
      candidateName: "Landon",
      activationNodes: { PRO: 1.3, MAT: 1.2 },
      novelty: 0.8
    }
  ]
};
var context1940 = {
  year: 1940,
  zeitgeist: {
    era: "new-deal",
    nodeWeights: { CU: 1.8, PRO: 1.5, ZS: 1.4, ONT_S: 1.3 },
    intensity: 1.2,
    description: "Europe falling to fascism; interventionism debate; unprecedented third term bid"
  },
  issueLandscape: {
    primaryAxis: ["CU", "PRO", "ZS"],
    secondaryAxis: ["MAT", "ONT_S", "MOR", "COM"],
    dormant: ["CD", "ONT_H", "PF", "TRB", "ENG"],
    description: "Interventionism vs. isolation + third-term norm-breaking; New Deal fading as issue"
  },
  candidateActivations: [
    {
      candidateName: "Roosevelt",
      activationNodes: { CU: 1.4, MOR: 1.3, ONT_S: 1.2 },
      novelty: 1.3,
      threatActivation: { PRO: 1.3 }
    },
    {
      candidateName: "Willkie",
      activationNodes: { PRO: 1.5, MAT: 1.3 },
      novelty: 1.2,
      threatActivation: { PRO: 1.2 }
    }
  ]
};
var context1944 = {
  year: 1944,
  zeitgeist: {
    era: "new-deal",
    nodeWeights: { CU: 2, ZS: 1.5, TRB: 1.5, ENG: 1.3 },
    intensity: 1.3,
    description: "World War raging; D-Day; national unity but war fatigue setting in"
  },
  issueLandscape: {
    primaryAxis: ["CU", "ZS", "TRB"],
    secondaryAxis: ["MAT", "PRO", "MOR", "ENG"],
    dormant: ["CD", "COM", "ONT_H", "ONT_S", "PF"],
    description: "War leadership dominates; 'don't change horses midstream' vs. four-term fatigue"
  },
  candidateActivations: [
    {
      candidateName: "Roosevelt",
      activationNodes: { CU: 1.4, TRB: 1.3, ENG: 1.2 },
      novelty: 1
    },
    {
      candidateName: "Dewey",
      activationNodes: { PRO: 1.3, MAT: 1.2 },
      novelty: 1
    }
  ]
};
var context1948 = {
  year: 1948,
  zeitgeist: {
    era: "new-deal",
    nodeWeights: { CD: 1.6, MOR: 1.5, TRB: 1.8, CU: 1.4, PF: 1.4 },
    intensity: 1.2,
    description: "Cold War begins; civil rights emerging; Dixiecrat revolt fractures New Deal coalition"
  },
  issueLandscape: {
    primaryAxis: ["CD", "TRB", "MOR"],
    secondaryAxis: ["CU", "MAT", "PF", "ZS"],
    dormant: ["PRO", "COM", "ONT_H", "ONT_S", "ENG"],
    description: "Civil rights vs. segregation fractures the Democratic Party; Cold War as backdrop"
  },
  candidateActivations: [
    {
      candidateName: "Truman",
      activationNodes: { CD: 1.3, MOR: 1.3, CU: 1.3, ENG: 1.4 },
      novelty: 1.3
    },
    {
      candidateName: "Dewey",
      activationNodes: { PRO: 1.2, COM: 1.2 },
      novelty: 0.8
    },
    {
      candidateName: "Thurmond",
      activationNodes: { CD: 1.6, TRB: 1.8, MOR: 1.4 },
      novelty: 1.3,
      threatActivation: { CD: 1.5, MOR: 1.5, TRB: 1.3 }
    }
  ]
};
var context1952 = {
  year: 1952,
  zeitgeist: {
    era: "consensus",
    nodeWeights: { ZS: 1.6, CU: 1.4, TRB: 1.3, ONT_S: 1.2 },
    intensity: 1.1,
    description: "Korean War stalemate; McCarthyism; Cold War anxiety; desire for steady leadership"
  },
  issueLandscape: {
    primaryAxis: ["ZS", "CU", "TRB"],
    secondaryAxis: ["MAT", "PRO", "ONT_S", "CD"],
    dormant: ["MOR", "COM", "ONT_H", "PF", "ENG"],
    description: "Cold War security + Korea dominate; communism fear; first TV campaign era"
  },
  candidateActivations: [
    {
      candidateName: "Eisenhower",
      activationNodes: { ZS: 1.3, PRO: 1.3, COM: 1.2 },
      novelty: 1.3
    },
    {
      candidateName: "Stevenson",
      activationNodes: { ONT_H: 1.3, CU: 1.2, MOR: 1.2 },
      novelty: 1.2
    }
  ]
};
var context1956 = {
  year: 1956,
  zeitgeist: {
    era: "consensus",
    nodeWeights: { CU: 1.3, ZS: 1.2, ONT_S: 0.6 },
    intensity: 0.8,
    description: "Prosperous peace; Suez and Hungary remind voters to trust Ike; low domestic tension"
  },
  issueLandscape: {
    primaryAxis: ["CU", "ZS", "PRO"],
    secondaryAxis: ["MAT", "CD", "ONT_H"],
    dormant: ["MOR", "COM", "ONT_S", "PF", "TRB", "ENG"],
    description: "Foreign crises reinforce Ike's commander image; domestic consensus; boring election"
  },
  candidateActivations: [
    {
      candidateName: "Eisenhower",
      activationNodes: { CU: 1.2, PRO: 1.3, ZS: 1.2 },
      novelty: 0.8
    },
    {
      candidateName: "Stevenson",
      activationNodes: { ONT_H: 1.3, CU: 1.3, MOR: 1.2 },
      novelty: 0.8
    }
  ]
};
var context1960 = {
  year: 1960,
  zeitgeist: {
    era: "consensus",
    nodeWeights: { CU: 1.5, ZS: 1.4, CD: 1.3, TRB: 1.3 },
    intensity: 1.1,
    description: "Cold War missile gap; TV debates transform politics; Catholic question resurfaces"
  },
  issueLandscape: {
    primaryAxis: ["CU", "ZS", "CD"],
    secondaryAxis: ["TRB", "MAT", "ONT_H", "ENG"],
    dormant: ["MOR", "PRO", "COM", "ONT_S", "PF"],
    description: "Cold War competition + generational change; Catholic identity as cultural flashpoint"
  },
  candidateActivations: [
    {
      candidateName: "Kennedy",
      activationNodes: { CU: 1.3, ONT_H: 1.4, ENG: 1.4, CD: 1.2 },
      novelty: 1.5,
      threatActivation: { CD: 1.3, TRB: 1.2 }
    },
    {
      candidateName: "Nixon",
      activationNodes: { ZS: 1.3, PRO: 1.2 },
      novelty: 1
    }
  ]
};
var context1964 = {
  year: 1964,
  zeitgeist: {
    era: "upheaval",
    nodeWeights: { CD: 1.8, MOR: 1.6, MAT: 1.5, ONT_S: 1.5, COM: 1.4 },
    intensity: 1.3,
    description: "Civil Rights Act transforms politics; Great Society expansion; Goldwater scares moderates"
  },
  issueLandscape: {
    primaryAxis: ["CD", "MOR", "MAT"],
    secondaryAxis: ["ONT_S", "COM", "PRO", "ZS"],
    dormant: ["CU", "ONT_H", "PF", "TRB", "ENG"],
    description: "Civil rights + Great Society vs. anti-government conservatism; first modern ideological election"
  },
  candidateActivations: [
    {
      candidateName: "Johnson",
      activationNodes: { MAT: 1.4, CD: 1.3, ONT_S: 1.3, COM: 1.3 },
      novelty: 1.2
    },
    {
      candidateName: "Goldwater",
      activationNodes: { MAT: 1.5, COM: 0.6, PRO: 1.3 },
      novelty: 1.5,
      threatActivation: { ZS: 1.5, CD: 1.4, MOR: 1.4, ONT_S: 1.3 }
    }
  ]
};
var context1968 = {
  year: 1968,
  zeitgeist: {
    era: "upheaval",
    nodeWeights: { CD: 2, ONT_S: 2, TRB: 1.8, ZS: 1.8 },
    intensity: 1.4,
    description: "Vietnam, MLK/RFK assassinated, riots, convention chaos; nation coming apart"
  },
  issueLandscape: {
    primaryAxis: ["CD", "ONT_S", "ZS"],
    secondaryAxis: ["TRB", "ENG", "PF"],
    dormant: ["MAT", "CU", "MOR", "PRO", "COM", "ONT_H"],
    description: "Law and order vs chaos; cultural backlash dominates; progressive idealism suppressed"
  },
  candidateActivations: [
    {
      candidateName: "Nixon",
      activationNodes: { CD: 1.6, ZS: 1.5, TRB: 1.4, ONT_S: 1.3 },
      novelty: 1.3,
      threatActivation: { ONT_S: 1.3 }
    },
    {
      candidateName: "Humphrey",
      activationNodes: { COM: 1.2 },
      novelty: 0.8
    },
    {
      candidateName: "Wallace",
      activationNodes: { CD: 1.5, TRB: 1.5 },
      novelty: 1.3
    }
  ]
};
var context1972 = {
  year: 1972,
  zeitgeist: {
    era: "upheaval",
    nodeWeights: { CD: 1.8, CU: 1.5, MOR: 1.5, TRB: 1.4 },
    intensity: 1.1,
    description: "Vietnam winding down but cultural revolution deepens; New Left vs. Silent Majority"
  },
  issueLandscape: {
    primaryAxis: ["CD", "CU", "MOR"],
    secondaryAxis: ["TRB", "MAT", "ONT_S", "ZS"],
    dormant: ["PRO", "COM", "ONT_H", "PF", "ENG"],
    description: "Cultural identity war: counterculture vs. traditional America; Vietnam as cultural proxy"
  },
  candidateActivations: [
    {
      candidateName: "Nixon",
      activationNodes: { CD: 1.3, TRB: 1.3, COM: 1.2 },
      novelty: 1
    },
    {
      candidateName: "McGovern",
      activationNodes: { CU: 1.5, MOR: 1.4, ONT_S: 1.4, ONT_H: 1.3 },
      novelty: 1.3,
      threatActivation: { CD: 1.5, MOR: 1.4, TRB: 1.3 }
    }
  ]
};
var context1976 = {
  year: 1976,
  zeitgeist: {
    era: "upheaval",
    nodeWeights: { PRO: 2, ONT_S: 1.6, PF: 1.3 },
    intensity: 1.1,
    description: "Post-Watergate crisis of trust; voters want honesty and procedural integrity"
  },
  issueLandscape: {
    primaryAxis: ["PRO", "ONT_S", "PF"],
    secondaryAxis: ["MAT", "COM", "CD", "ENG"],
    dormant: ["CU", "MOR", "ZS", "ONT_H", "TRB"],
    description: "Integrity and institutional trust dominate; process and character over policy"
  },
  candidateActivations: [
    {
      candidateName: "Carter",
      activationNodes: { PRO: 1.5, ONT_S: 1.3, PF: 0.7 },
      novelty: 1.3
    },
    {
      candidateName: "Ford",
      activationNodes: { PRO: 1.3, COM: 1.4 },
      novelty: 0.8,
      threatActivation: { PRO: 1.3 }
    }
  ]
};
var context1980 = {
  year: 1980,
  zeitgeist: {
    era: "reagan",
    nodeWeights: { MAT: 1.8, ONT_S: 1.8, ZS: 1.5, CU: 1.4, ENG: 1.3 },
    intensity: 1.3,
    description: "Stagflation, Iran hostages, malaise; voters feel system broken; realignment election"
  },
  issueLandscape: {
    primaryAxis: ["MAT", "ONT_S", "ZS"],
    secondaryAxis: ["CU", "CD", "ENG", "ONT_H"],
    dormant: ["MOR", "PRO", "COM", "PF", "TRB"],
    description: "Economic crisis + global humiliation; 'are you better off?' frames everything"
  },
  candidateActivations: [
    {
      candidateName: "Reagan",
      activationNodes: { MAT: 1.4, ONT_H: 1.5, ONT_S: 1.3, ENG: 1.3 },
      novelty: 1.5,
      threatActivation: { MAT: 1.2 }
    },
    {
      candidateName: "Carter",
      activationNodes: { PRO: 1.2, CU: 1.2 },
      novelty: 0.8,
      threatActivation: { ONT_S: 1.3, MAT: 1.2 }
    },
    {
      candidateName: "Anderson",
      activationNodes: { PF: 0.7, PRO: 1.3, COM: 1.2 },
      novelty: 1.1
    }
  ]
};
var context1984 = {
  year: 1984,
  zeitgeist: {
    era: "reagan",
    nodeWeights: { ONT_H: 1.4, ZS: 1.3, MAT: 1.2 },
    intensity: 0.9,
    description: "Morning in America; economic recovery; Cold War confidence; low-anxiety landslide"
  },
  issueLandscape: {
    primaryAxis: ["MAT", "ONT_H", "ZS"],
    secondaryAxis: ["CU", "CD", "ONT_S"],
    dormant: ["MOR", "PRO", "COM", "PF", "TRB", "ENG"],
    description: "Economic optimism vs. sacrifice; Cold War strength; prosperity election"
  },
  candidateActivations: [
    {
      candidateName: "Reagan",
      activationNodes: { ONT_H: 1.4, MAT: 1.3, ZS: 1.2 },
      novelty: 1.2
    },
    {
      candidateName: "Mondale",
      activationNodes: { MAT: 1.3, ONT_S: 1.3, PRO: 1.2 },
      novelty: 1
    }
  ]
};
var context1988 = {
  year: 1988,
  zeitgeist: {
    era: "reagan",
    nodeWeights: { CD: 1.4, MAT: 1.2 },
    intensity: 0.8,
    description: "Prosperity + Cold War winding down; low stakes; culture-war wedge issues emerge"
  },
  issueLandscape: {
    primaryAxis: ["CD", "MAT", "MOR"],
    secondaryAxis: ["CU", "PRO", "ZS"],
    dormant: ["COM", "ONT_H", "ONT_S", "PF", "TRB", "ENG"],
    description: "Willie Horton and culture wedges; 'L-word' liberalism vs. Reagan continuity"
  },
  candidateActivations: [
    {
      candidateName: "Bush",
      activationNodes: { CD: 1.3, MAT: 1.2, MOR: 1.2 },
      novelty: 1
    },
    {
      candidateName: "Dukakis",
      activationNodes: { PRO: 1.3, ONT_H: 1.2 },
      novelty: 1,
      threatActivation: { CD: 1.4, MOR: 1.3 }
    }
  ]
};
var context1992 = {
  year: 1992,
  zeitgeist: {
    era: "reagan",
    nodeWeights: { MAT: 1.8, ONT_S: 1.5, PF: 0.7, CU: 1.3 },
    intensity: 1.1,
    description: "Recession, end of Cold War identity vacuum, generational change; Perot disruption"
  },
  issueLandscape: {
    primaryAxis: ["MAT", "ONT_S", "CU"],
    secondaryAxis: ["CD", "COM", "ZS", "ENG"],
    dormant: ["MOR", "PRO", "ONT_H", "PF", "TRB"],
    description: "'It's the economy, stupid' + trade/globalization + generational change; Cold War over"
  },
  candidateActivations: [
    {
      candidateName: "Clinton",
      activationNodes: { MAT: 1.4, COM: 1.3, ONT_H: 1.3, ENG: 1.3 },
      novelty: 1.3
    },
    {
      candidateName: "Bush",
      activationNodes: { CU: 1.2, PRO: 1.2 },
      novelty: 0.8
    },
    {
      candidateName: "Perot",
      activationNodes: { MAT: 1.3, ONT_S: 1.5, PF: 0.6, ZS: 1.4 },
      novelty: 1.5,
      threatActivation: { ONT_S: 1.2 }
    }
  ]
};
var context1996 = {
  year: 1996,
  zeitgeist: {
    era: "third-way",
    nodeWeights: { ONT_S: 0.6, ZS: 0.6 },
    intensity: 0.7,
    description: "Dot-com boom, peace, welfare reform done; low-stakes election; Clinton coasts"
  },
  issueLandscape: {
    primaryAxis: ["MAT", "CD", "COM"],
    secondaryAxis: ["CU", "PRO", "ONT_H"],
    dormant: ["MOR", "ZS", "ONT_S", "PF", "TRB", "ENG"],
    description: "Prosperity and centrism; Dole struggles for traction; 'bridge to 21st century'"
  },
  candidateActivations: [
    {
      candidateName: "Clinton",
      activationNodes: { COM: 1.3, MAT: 1.2, ONT_H: 1.2 },
      novelty: 1
    },
    {
      candidateName: "Dole",
      activationNodes: { PRO: 1.2, CD: 1.2 },
      novelty: 0.8
    }
  ]
};
var context2000 = {
  year: 2e3,
  zeitgeist: {
    era: "third-way",
    nodeWeights: { CD: 1.2, MOR: 1.2 },
    intensity: 0.8,
    description: "Peace and prosperity; culture wars simmer; 'people vs. powerful' vs. compassionate conservatism"
  },
  issueLandscape: {
    primaryAxis: ["MAT", "CD", "MOR"],
    secondaryAxis: ["PRO", "COM", "CU", "ONT_H"],
    dormant: ["ZS", "ONT_S", "PF", "TRB", "ENG"],
    description: "Dueling centrisms; emerging culture war on values; policy wonk vs. likability"
  },
  candidateActivations: [
    {
      candidateName: "Gore",
      activationNodes: { MAT: 1.3, ONT_H: 1.2, CU: 1.2 },
      novelty: 1
    },
    {
      candidateName: "Bush",
      activationNodes: { CD: 1.2, MOR: 1.3, COM: 1.2 },
      novelty: 1.2
    }
  ]
};
var context2004 = {
  year: 2004,
  zeitgeist: {
    era: "third-way",
    nodeWeights: { ZS: 2, TRB: 1.8, CD: 1.5, CU: 1.4, ENG: 1.3 },
    intensity: 1.3,
    description: "Post-9/11 security election; Iraq War divides; 'with us or against us' framing"
  },
  issueLandscape: {
    primaryAxis: ["ZS", "TRB", "CU"],
    secondaryAxis: ["CD", "PRO", "MOR", "ENG"],
    dormant: ["MAT", "COM", "ONT_H", "ONT_S", "PF"],
    description: "Security dominates: Iraq, terrorism, patriotism; gay marriage as wedge; faith vs. nuance"
  },
  candidateActivations: [
    {
      candidateName: "Kerry",
      activationNodes: { CU: 1.3, PRO: 1.3, MOR: 1.2 },
      novelty: 1
    },
    {
      candidateName: "Bush",
      activationNodes: { ZS: 1.5, TRB: 1.4, CD: 1.3, ENG: 1.3 },
      novelty: 1,
      threatActivation: { CU: 1.3, PRO: 1.2 }
    }
  ]
};
var context2008 = {
  year: 2008,
  zeitgeist: {
    era: "polarization",
    nodeWeights: { MAT: 2.2, ONT_S: 2, ONT_H: 1.5, ENG: 1.5, ZS: 1.3 },
    intensity: 1.4,
    description: "Financial crisis + Iraq fatigue; historic candidacy; 'hope and change' vs. 'country first'"
  },
  issueLandscape: {
    primaryAxis: ["MAT", "ONT_S", "ONT_H"],
    secondaryAxis: ["ENG", "CU", "ZS", "CD"],
    dormant: ["MOR", "PRO", "COM", "PF", "TRB"],
    description: "Economic collapse is THE issue; systemic failure; generational/racial transformation"
  },
  candidateActivations: [
    {
      candidateName: "Obama",
      activationNodes: { ONT_H: 1.5, MAT: 1.3, ONT_S: 1.4, ENG: 1.5 },
      novelty: 1.8
    },
    {
      candidateName: "McCain",
      activationNodes: { ZS: 1.3, PRO: 1.2, CU: 1.2 },
      novelty: 1
    }
  ]
};
var context2012 = {
  year: 2012,
  zeitgeist: {
    era: "polarization",
    nodeWeights: { MAT: 1.5, ONT_S: 1.4, PF: 1.3, TRB: 1.3 },
    intensity: 1,
    description: "Slow recovery; ACA as lightning rod; growing polarization; '47%' crystallizes class divide"
  },
  issueLandscape: {
    primaryAxis: ["MAT", "ONT_S", "PF"],
    secondaryAxis: ["CD", "TRB", "MOR", "COM"],
    dormant: ["CU", "PRO", "ZS", "ONT_H", "ENG"],
    description: "Role of government in recovery; class divide; partisan identity sharpens"
  },
  candidateActivations: [
    {
      candidateName: "Obama",
      activationNodes: { MAT: 1.3, CD: 1.2, PF: 1.3, TRB: 1.2 },
      novelty: 1.1
    },
    {
      candidateName: "Romney",
      activationNodes: { MAT: 1.4, ONT_S: 1.2 },
      novelty: 1,
      threatActivation: { MAT: 1.3, ONT_S: 1.2 }
    }
  ]
};
var context2016 = {
  year: 2016,
  zeitgeist: {
    era: "polarization",
    nodeWeights: { CD: 2, TRB: 2, ONT_S: 1.8, ZS: 1.6, PF: 1.4, ENG: 1.4 },
    intensity: 1.4,
    description: "Populist revolt; cultural backlash; institutional distrust; realignment-level disruption"
  },
  issueLandscape: {
    primaryAxis: ["CD", "TRB", "ONT_S"],
    secondaryAxis: ["ZS", "MAT", "PF", "ENG"],
    dormant: ["CU", "MOR", "PRO", "COM", "ONT_H"],
    description: "Cultural identity and system legitimacy; populism vs. establishment; 'drain the swamp'"
  },
  candidateActivations: [
    {
      candidateName: "Trump",
      activationNodes: { CD: 1.6, TRB: 1.6, ONT_S: 1.5, ZS: 1.5, ENG: 1.4 },
      novelty: 1.8,
      threatActivation: { CD: 1.5, PRO: 1.5, MOR: 1.3, ONT_S: 1.3 }
    },
    {
      candidateName: "Clinton",
      activationNodes: { PRO: 1.3, CU: 1.2, MAT: 1.2 },
      novelty: 1.2,
      threatActivation: { CD: 1.3, TRB: 1.2 }
    }
  ]
};
var context2020 = {
  year: 2020,
  zeitgeist: {
    era: "polarization",
    nodeWeights: { CD: 2, ONT_S: 2, PRO: 1.8, TRB: 1.8, MOR: 1.5, ENG: 1.5 },
    intensity: 1.5,
    description: "COVID pandemic + racial justice protests + democratic norms crisis; existential framing on both sides"
  },
  issueLandscape: {
    primaryAxis: ["PRO", "ONT_S", "CD"],
    secondaryAxis: ["TRB", "MOR", "MAT", "ENG"],
    dormant: ["CU", "ZS", "COM", "ONT_H", "PF"],
    description: "Democracy and norms vs. system overhaul; pandemic response; racial justice; unprecedented mobilization"
  },
  candidateActivations: [
    {
      candidateName: "Biden",
      activationNodes: { PRO: 1.5, COM: 1.3, MOR: 1.3 },
      novelty: 1,
      threatActivation: { PRO: 1.4, ONT_S: 1.3 }
    },
    {
      candidateName: "Trump",
      activationNodes: { CD: 1.5, TRB: 1.6, ONT_S: 1.5, ENG: 1.4 },
      novelty: 1.2,
      threatActivation: { PRO: 1.6, MOR: 1.4, CD: 1.5, ONT_S: 1.4 }
    }
  ]
};
var context2024 = {
  year: 2024,
  zeitgeist: {
    era: "polarization",
    nodeWeights: { PRO: 1.8, CD: 1.8, TRB: 1.8, ONT_S: 1.6, MAT: 1.5, ENG: 1.5 },
    intensity: 1.4,
    description: "Post-January 6 democracy fears + inflation + historic candidates on both sides; existential framing"
  },
  issueLandscape: {
    primaryAxis: ["PRO", "CD", "MAT"],
    secondaryAxis: ["TRB", "ONT_S", "MOR", "ENG"],
    dormant: ["CU", "ZS", "COM", "ONT_H", "PF"],
    description: "Democracy vs. authoritarianism framing + economy/inflation + cultural identity war"
  },
  candidateActivations: [
    {
      candidateName: "Trump",
      activationNodes: { CD: 1.5, TRB: 1.6, ONT_S: 1.5, MAT: 1.3, ENG: 1.4 },
      novelty: 1.3,
      threatActivation: { PRO: 1.7, MOR: 1.4, CD: 1.4, ONT_S: 1.4 }
    },
    {
      candidateName: "Harris",
      activationNodes: { PRO: 1.4, MOR: 1.3, CD: 1.3, ENG: 1.3 },
      novelty: 1.4,
      threatActivation: { CD: 1.4, TRB: 1.3 }
    }
  ]
};
var CONTEXTS_1920_2024 = [
  context1920,
  context1924,
  context1928,
  context1932,
  context1936,
  context1940,
  context1944,
  context1948,
  context1952,
  context1956,
  context1960,
  context1964,
  context1968,
  context1972,
  context1976,
  context1980,
  context1984,
  context1988,
  context1992,
  context1996,
  context2000,
  context2004,
  context2008,
  context2012,
  context2016,
  context2020,
  context2024
];

// src/historical/contexts.ts
var ALL_CONTEXTS = [
  ...CONTEXTS_1789_1852,
  ...CONTEXTS_1856_1916,
  ...CONTEXTS_1920_2024
];
function getContext(year) {
  return ALL_CONTEXTS.find((c) => c.year === year);
}

// src/historical/activation.ts
function getNodeWeight(ctx, node) {
  const zeitWeight = ctx.zeitgeist.nodeWeights[node] ?? 1;
  let issueWeight = 1;
  if (ctx.issueLandscape.primaryAxis.includes(node)) {
    issueWeight = 1.5;
  } else if (ctx.issueLandscape.dormant.includes(node)) {
    issueWeight = 0.5;
  }
  return zeitWeight * issueWeight;
}

// src/historical/regime-alignment.ts
var CONTINUOUS_NODES = [
  "MAT",
  "CD",
  "CU",
  "MOR",
  "PRO",
  "COM",
  "ZS",
  "ONT_H",
  "ONT_S",
  "PF",
  "TRB",
  "ENG"
];
var ERA_ALPHA = 0.4;
var GAUSSIAN_SIGMA = 2.9;
function computeWeightedDistance(arch, cand, ctx) {
  let weightedSumSq = 0;
  let totalWeight = 0;
  for (const node of CONTINUOUS_NODES) {
    if (node === "ENG") continue;
    const tmpl = arch.nodes[node];
    if (!tmpl || tmpl.kind !== "continuous") continue;
    const ct = tmpl;
    const archPos = ct.pos;
    const archSal = ct.sal;
    const candPos = cand[node];
    if (candPos == null) continue;
    const eraWeight = getNodeWeight(ctx, node);
    const eraSal = Math.min(3, (eraWeight - 0.5) * 2);
    const effectiveSal = (1 - ERA_ALPHA) * archSal + ERA_ALPHA * Math.max(0, eraSal);
    let antiMultiplier = 1;
    if (ct.anti) {
      const diff = Math.abs(archPos - candPos);
      if (diff >= 3) antiMultiplier = 1.3;
      else if (diff >= 2) antiMultiplier = 1.1;
    }
    const posDiff = Math.abs(archPos - candPos) * antiMultiplier;
    weightedSumSq += effectiveSal * posDiff * posDiff;
    totalWeight += effectiveSal;
  }
  const distance = totalWeight > 0 ? Math.sqrt(weightedSumSq / totalWeight) : 4;
  return { distance, maxDistance: 4 };
}
function computeCandidateAlignment(arch, cand, ctx) {
  const { distance } = computeWeightedDistance(arch, cand, ctx);
  const support = 100 * Math.exp(-Math.pow(distance / GAUSSIAN_SIGMA, 2));
  const alignment = (support / 50 - 1) * 3;
  return Math.max(-3, Math.min(3, alignment));
}
function computeRegimeAlignment(arch, candidates, ctx) {
  let bestAlignment = -3;
  let bestCandidate = "";
  for (const cand of candidates) {
    const a = computeCandidateAlignment(arch, cand, ctx);
    if (a > bestAlignment) {
      bestAlignment = a;
      bestCandidate = cand.name;
    }
  }
  return {
    alignment: bestAlignment,
    bestCandidate,
    bestScore: bestAlignment
  };
}
function alignmentToTurnout(alignment, intensity = 1) {
  const adjusted = alignment * intensity;
  return 1 / (1 + Math.exp(-1.2 * adjusted));
}
function computeTurnoutFromAlignment(arch, candidates, ctx) {
  const { alignment } = computeRegimeAlignment(arch, candidates, ctx);
  const turnoutProb = alignmentToTurnout(alignment, ctx.zeitgeist.intensity);
  return {
    alignment,
    turnoutProbability: turnoutProb,
    votes: turnoutProb >= 0.5
  };
}

// src/historical/simulate.ts
var import_meta = {};
var CONTINUOUS_NODES2 = [
  "MAT",
  "CD",
  "CU",
  "MOR",
  "PRO",
  "COM",
  "ZS",
  "ONT_H",
  "ONT_S",
  "PF",
  "TRB",
  "ENG"
];
var CATEGORICAL_NODES = ["EPS", "AES"];
var ACTUAL_RESULTS = {
  1789: { winner: "Washington", winnerPct: 100, loserPct: 0 },
  1792: { winner: "Washington", winnerPct: 100, loserPct: 0 },
  1796: { winner: "Adams", winnerPct: 53.4, loserPct: 46.6 },
  1800: { winner: "Jefferson", winnerPct: 61.4, loserPct: 38.6 },
  1804: { winner: "Jefferson", winnerPct: 72.8, loserPct: 27.2 },
  1808: { winner: "Madison", winnerPct: 64.7, loserPct: 32.4 },
  1812: { winner: "Madison", winnerPct: 58.7, loserPct: 41.3 },
  1816: { winner: "Monroe", winnerPct: 68.2, loserPct: 31.8 },
  1820: { winner: "Monroe", winnerPct: 99.6, loserPct: 0.4 },
  1824: { winner: "Jackson", winnerPct: 41.4, loserPct: 30.9 },
  1828: { winner: "Jackson", winnerPct: 56, loserPct: 43.6 },
  1832: { winner: "Jackson", winnerPct: 54.2, loserPct: 37.4 },
  1836: { winner: "Van Buren", winnerPct: 50.8, loserPct: 36.6 },
  1840: { winner: "Harrison", winnerPct: 52.9, loserPct: 46.8 },
  1844: { winner: "Polk", winnerPct: 49.5, loserPct: 48.1 },
  1848: { winner: "Taylor", winnerPct: 47.3, loserPct: 42.5 },
  1852: { winner: "Pierce", winnerPct: 50.8, loserPct: 43.9 },
  1856: { winner: "Buchanan", winnerPct: 45.3, loserPct: 33.1 },
  1860: { winner: "Lincoln", winnerPct: 39.8, loserPct: 29.5 },
  1864: { winner: "Lincoln", winnerPct: 55, loserPct: 45 },
  1868: { winner: "Grant", winnerPct: 52.7, loserPct: 47.3 },
  1872: { winner: "Grant", winnerPct: 55.6, loserPct: 43.8 },
  1876: { winner: "Tilden", winnerPct: 50.9, loserPct: 47.9 },
  1880: { winner: "Garfield", winnerPct: 48.3, loserPct: 48.2 },
  1884: { winner: "Cleveland", winnerPct: 48.9, loserPct: 48.3 },
  1888: { winner: "Cleveland", winnerPct: 48.6, loserPct: 47.8 },
  1892: { winner: "Cleveland", winnerPct: 46, loserPct: 43 },
  1896: { winner: "McKinley", winnerPct: 51, loserPct: 46.7 },
  1900: { winner: "McKinley", winnerPct: 51.6, loserPct: 45.5 },
  1904: { winner: "Roosevelt", winnerPct: 56.4, loserPct: 37.6 },
  1908: { winner: "Taft", winnerPct: 51.6, loserPct: 43 },
  1912: { winner: "Wilson", winnerPct: 41.8, loserPct: 27.4 },
  1916: { winner: "Wilson", winnerPct: 49.2, loserPct: 46.1 },
  1920: { winner: "Harding", winnerPct: 60.3, loserPct: 34.1 },
  1924: { winner: "Coolidge", winnerPct: 54, loserPct: 28.8 },
  1928: { winner: "Hoover", winnerPct: 58.2, loserPct: 40.8 },
  1932: { winner: "Roosevelt", winnerPct: 57.4, loserPct: 39.7 },
  1936: { winner: "Roosevelt", winnerPct: 60.8, loserPct: 36.5 },
  1940: { winner: "Roosevelt", winnerPct: 54.7, loserPct: 44.8 },
  1944: { winner: "Roosevelt", winnerPct: 53.4, loserPct: 45.9 },
  1948: { winner: "Truman", winnerPct: 49.6, loserPct: 45.1 },
  // Thurmond 2.4%, H.Wallace 2.4%
  1952: { winner: "Eisenhower", winnerPct: 55.2, loserPct: 44.3 },
  1956: { winner: "Eisenhower", winnerPct: 57.4, loserPct: 42 },
  1960: { winner: "Kennedy", winnerPct: 49.7, loserPct: 49.5 },
  1964: { winner: "Johnson", winnerPct: 61.1, loserPct: 38.5 },
  1968: { winner: "Nixon", winnerPct: 43.4, loserPct: 42.7 },
  // Humphrey 42.7, Wallace 13.5
  1972: { winner: "Nixon", winnerPct: 60.7, loserPct: 37.5 },
  1976: { winner: "Carter", winnerPct: 50.1, loserPct: 48 },
  1980: { winner: "Reagan", winnerPct: 50.7, loserPct: 41 },
  // Anderson 6.6%
  1984: { winner: "Reagan", winnerPct: 58.8, loserPct: 40.6 },
  1988: { winner: "Bush", winnerPct: 53.4, loserPct: 45.6 },
  1992: { winner: "Clinton", winnerPct: 43, loserPct: 37.4 },
  // Perot 18.9%
  1996: { winner: "Clinton", winnerPct: 49.2, loserPct: 40.7 },
  2e3: { winner: "Gore", winnerPct: 48.4, loserPct: 47.9 },
  // Gore won PV
  2004: { winner: "Bush", winnerPct: 50.7, loserPct: 48.3 },
  2008: { winner: "Obama", winnerPct: 52.9, loserPct: 45.7 },
  2012: { winner: "Obama", winnerPct: 51.1, loserPct: 47.2 },
  2016: { winner: "Clinton", winnerPct: 48.2, loserPct: 46.1 },
  // Clinton won PV
  2020: { winner: "Biden", winnerPct: 51.3, loserPct: 46.9 },
  2024: { winner: "Trump", winnerPct: 49.8, loserPct: 48.3 }
};
var ERA_BONUSES = {
  1964: { Johnson: 2.5 },
  // Post-JFK sympathy + Goldwater extremism
  1968: { Nixon: 0.8 },
  // Law and order resonated, Humphrey tainted by Vietnam
  1972: { Nixon: 2 },
  // McGovern perceived as extreme, "peace with honor"
  1980: { Reagan: 1.5 },
  // Malaise, hostage crisis, Carter perceived as weak
  1984: { Reagan: 2.5 },
  // "Morning in America," economic boom, incumbent
  1988: { Bush: 0.5 },
  // Reagan coattails, Dukakis tank photo, Willie Horton
  1992: { Clinton: 1.5 },
  // "It's the economy, stupid," change election, Bush broken promises
  1996: { Clinton: 1 },
  // Incumbent, peace and prosperity, Dole lacked energy
  2004: { Bush: 2 },
  // Post-9/11 security, wartime incumbent, "Swift Boat"
  2008: { Obama: 1.5 },
  // Financial crisis, change wave, historic candidacy
  2024: { Trump: 1.5 }
  // Inflation/economy frustration, "were you better off" framing
};
function inferArchetypeParty(arch) {
  const matTmpl = arch.nodes.MAT;
  const cdTmpl = arch.nodes.CD;
  const morTmpl = arch.nodes.MOR;
  const ontsTmpl = arch.nodes.ONT_S;
  const cuTmpl = arch.nodes.CU;
  if (!matTmpl || matTmpl.kind !== "continuous") return "none";
  const matPos = matTmpl.pos;
  const cdPos = cdTmpl && cdTmpl.kind === "continuous" ? cdTmpl.pos : 3;
  const morPos = morTmpl && morTmpl.kind === "continuous" ? morTmpl.pos : 3;
  const ontsPos = ontsTmpl && ontsTmpl.kind === "continuous" ? ontsTmpl.pos : 3;
  const cuPos = cuTmpl && cuTmpl.kind === "continuous" ? cuTmpl.pos : 3;
  if (matPos <= 1) return "Democratic";
  if (matPos >= 5) return "Republican";
  let demSignals = 0;
  let gopSignals = 0;
  if (matPos <= 2) demSignals += 2;
  if (matPos >= 4) gopSignals += 2;
  if (cdPos <= 2) demSignals++;
  if (cdPos >= 4) gopSignals++;
  if (morPos <= 2) demSignals++;
  if (morPos >= 4) gopSignals++;
  if (ontsPos >= 4) demSignals++;
  if (ontsPos <= 2) gopSignals++;
  if (cuPos >= 4) demSignals++;
  if (cuPos <= 2) gopSignals++;
  if (gopSignals > demSignals) return "Republican";
  if (demSignals > gopSignals) return "Democratic";
  return "none";
}
function turnoutProbability(engPos) {
  if (engPos >= 5) return 0.95;
  if (engPos >= 4) return 0.85;
  if (engPos >= 3) return 0.7;
  if (engPos >= 2) return 0.45;
  return 0.15;
}
function willVote(engPos) {
  return turnoutProbability(engPos) >= 0.5;
}
function computeAlignment(arch, cand, year, ctx) {
  let total = 0;
  for (const node of CONTINUOUS_NODES2) {
    const tmpl = arch.nodes[node];
    if (!tmpl || tmpl.kind !== "continuous") continue;
    const ct = tmpl;
    const archPos = ct.pos;
    const candPos = cand[node];
    const sal = ct.sal;
    const activationWeight = ctx ? getNodeWeight(ctx, node) : 1;
    const posAlignment = 1 - Math.abs(archPos - candPos) / 4;
    total += sal * activationWeight * posAlignment;
    if (ct.anti) {
      const antiTarget = ct.anti === "high" ? 5 : 1;
      const candDistFromAnti = Math.abs(candPos - antiTarget) / 4;
      if (candDistFromAnti < 0.25) {
        total -= sal * 0.5 * (1 - candDistFromAnti);
      }
    }
  }
  for (const node of CATEGORICAL_NODES) {
    const tmpl = arch.nodes[node];
    if (!tmpl || tmpl.kind !== "categorical") continue;
    const ct = tmpl;
    const sal = ct.sal;
    const candCategory = cand[node];
    total += sal * ct.probs[candCategory];
    if (ct.antiCats && ct.antiCats.includes(candCategory)) {
      total -= sal * 0.3;
    }
  }
  const pfTmpl = arch.nodes.PF;
  const trbTmpl = arch.nodes.TRB;
  const archParty = inferArchetypeParty(arch);
  if (archParty !== "none" && cand.party === archParty) {
    let partyBonus = 0;
    if (pfTmpl && pfTmpl.kind === "continuous") {
      const pfCt = pfTmpl;
      const pfPos = pfCt.pos;
      const pfSal = pfCt.sal;
      if (pfPos >= 5 && pfSal >= 2) {
        partyBonus = 3;
      } else if (pfPos >= 4 && pfSal >= 2) {
        partyBonus = 2;
      } else if (pfPos >= 4 && pfSal >= 1) {
        partyBonus = 1.5;
      } else if (pfPos >= 3 && pfSal >= 1) {
        partyBonus = 0.8;
      }
    }
    if (partyBonus === 0) {
      partyBonus = 0.5;
    }
    total += partyBonus;
  }
  if (trbTmpl && trbTmpl.kind === "continuous") {
    const trbCt = trbTmpl;
    const trbPos = trbCt.pos;
    if (trbPos >= 4) {
      const candTrb = cand.TRB;
      if (candTrb >= 4) {
        total += 0.5;
      }
    }
  }
  const eraBonus = ERA_BONUSES[year];
  if (eraBonus && eraBonus[cand.name] !== void 0) {
    total += eraBonus[cand.name];
  }
  return total;
}
function simulate() {
  const results = [];
  for (const arch of ARCHETYPES) {
    const votes = {};
    const engTmpl = arch.nodes.ENG;
    const engPos = engTmpl && engTmpl.kind === "continuous" ? engTmpl.pos : 3;
    const archSaliences = {};
    for (const node of CONTINUOUS_NODES2) {
      const tmpl = arch.nodes[node];
      if (tmpl && tmpl.kind === "continuous") {
        archSaliences[node] = tmpl.sal;
      }
    }
    for (const election of ELECTIONS) {
      const ctx = getContext(election.year);
      let bestCandidate = "";
      let bestScore = -Infinity;
      for (const cand of election.candidates) {
        const score = computeAlignment(arch, cand, election.year, ctx);
        if (score > bestScore) {
          bestScore = score;
          bestCandidate = cand.name;
        }
      }
      if (ctx) {
        const { votes: doesVote } = computeTurnoutFromAlignment(arch, election.candidates, ctx);
        if (!doesVote) {
          votes[election.year] = "ABSTAIN";
          continue;
        }
      } else {
        if (!willVote(engPos)) {
          votes[election.year] = "ABSTAIN";
          continue;
        }
      }
      votes[election.year] = bestCandidate;
    }
    results.push({
      archetypeId: arch.id,
      archetypeName: arch.name,
      votes
    });
  }
  return results;
}
function generateCSV(results) {
  const years = ELECTIONS.map((e) => e.year);
  const header = ["ID", "Archetype", ...years.map(String)].join(",");
  const rows = results.map((r) => {
    const cells = [r.archetypeId, `"${r.archetypeName}"`];
    for (const year of years) {
      cells.push(r.votes[year]);
    }
    return cells.join(",");
  });
  return [header, ...rows].join("\n");
}
function generateCandidateProfilesCSV() {
  const nodes = [
    "MAT",
    "CD",
    "CU",
    "MOR",
    "PRO",
    "COM",
    "ZS",
    "ONT_H",
    "ONT_S",
    "PF",
    "TRB",
    "ENG",
    "EPS",
    "AES"
  ];
  const header = ["Year", "Name", "Party", ...nodes].join(",");
  const rows = [];
  for (const election of ELECTIONS) {
    for (const cand of election.candidates) {
      const values = nodes.map((n) => cand[n]);
      rows.push([cand.year, cand.name, cand.party, ...values].join(","));
    }
  }
  return [header, ...rows].join("\n");
}
function generateSummary(results) {
  const lines = [];
  lines.push("\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550");
  lines.push("  PRISM HISTORICAL ELECTION SIMULATION \u2014 SUMMARY");
  lines.push("\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\n");
  for (const election of ELECTIONS) {
    const year = election.year;
    const candNames = election.candidates.map((c) => c.name);
    const tallies = {};
    let abstentions = 0;
    for (const name of candNames) tallies[name] = 0;
    for (const r of results) {
      const vote = r.votes[year];
      const weight = POPULATION_WEIGHTS[r.archetypeId] ?? 1 / results.length;
      if (vote === "ABSTAIN") {
        abstentions += weight;
      } else {
        tallies[vote] = (tallies[vote] || 0) + weight;
      }
    }
    const totalVoters = Object.values(tallies).reduce((a, b) => a + b, 0);
    lines.push(`\u2500\u2500 ${year} \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500`);
    lines.push(`  Candidates: ${election.candidates.map((c) => `${c.name} (${c.party})`).join(" vs ")}`);
    const sorted = Object.entries(tallies).sort((a, b) => b[1] - a[1]);
    for (const [name, weight] of sorted) {
      const pct = totalVoters > 0 ? (weight / totalVoters * 100).toFixed(1) : "0.0";
      const bar = "\u2588".repeat(Math.round(weight * 50));
      lines.push(`  ${name.padEnd(12)} ${(weight * 100).toFixed(1).padStart(5)}% pop (${pct.padStart(5)}% of voters) ${bar}`);
    }
    lines.push(`  ABSTAIN      ${(abstentions * 100).toFixed(1).padStart(5)}% pop`);
    lines.push("");
  }
  return lines.join("\n");
}
function generatePredictedVsActual(results) {
  const lines = [];
  lines.push("\n\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550");
  lines.push("  PREDICTED vs ACTUAL MARGINS");
  lines.push("\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\n");
  lines.push("  Year  Predicted Winner   Pred%  Actual Winner   Actual%  \u0394     Status");
  lines.push("  \u2500\u2500\u2500\u2500  \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500  \u2500\u2500\u2500\u2500\u2500  \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500  \u2500\u2500\u2500\u2500\u2500\u2500\u2500  \u2500\u2500\u2500\u2500  \u2500\u2500\u2500\u2500\u2500\u2500");
  for (const election of ELECTIONS) {
    const year = election.year;
    const tallies = {};
    let totalVoters = 0;
    for (const r of results) {
      const vote = r.votes[year];
      const weight = POPULATION_WEIGHTS[r.archetypeId] ?? 1 / results.length;
      if (vote !== "ABSTAIN") {
        totalVoters += weight;
        tallies[vote] = (tallies[vote] || 0) + weight;
      }
    }
    const sorted = Object.entries(tallies).sort((a, b) => b[1] - a[1]);
    const predWinner = sorted[0]?.[0] ?? "?";
    const predWeight = sorted[0]?.[1] ?? 0;
    const predPct = totalVoters > 0 ? predWeight / totalVoters * 100 : 0;
    const actual = ACTUAL_RESULTS[year];
    const actualWinner = actual?.winner ?? "?";
    const actualPct = actual?.winnerPct ?? 0;
    const delta = Math.abs(predPct - actualPct);
    const correctWinner = predWinner === actualWinner;
    const withinMargin = delta <= 10;
    const status = correctWinner && withinMargin ? "OK" : correctWinner ? "MARGIN" : "WRONG";
    lines.push(
      `  ${year}  ${predWinner.padEnd(17)}  ${predPct.toFixed(1).padStart(5)}  ${actualWinner.padEnd(14)}  ${actualPct.toFixed(1).padStart(5)}%  ${delta.toFixed(1).padStart(4)}  ${status}`
    );
  }
  lines.push("");
  return lines.join("\n");
}
function main() {
  console.log("Running PRISM historical election simulation...\n");
  console.log(`Archetypes: ${ARCHETYPES.length}`);
  console.log(`Elections:  ${ELECTIONS.length} (${ELECTIONS.map((e) => e.year).join(", ")})
`);
  const results = simulate();
  const summary = generateSummary(results);
  console.log(summary);
  const comparison = generatePredictedVsActual(results);
  console.log(comparison);
  let __dirname;
  try {
    __dirname = (0, import_node_path.dirname)((0, import_node_url.fileURLToPath)(import_meta.url));
  } catch {
    __dirname = process.cwd();
  }
  const outDir = (0, import_node_path.join)(__dirname, "..", "..", "output");
  (0, import_node_fs.mkdirSync)(outDir, { recursive: true });
  const csvPath = (0, import_node_path.join)(outDir, "historical_votes.csv");
  (0, import_node_fs.writeFileSync)(csvPath, generateCSV(results), "utf-8");
  console.log(`Vote CSV written to: ${csvPath}`);
  const profilesPath = (0, import_node_path.join)(outDir, "candidate_profiles.csv");
  (0, import_node_fs.writeFileSync)(profilesPath, generateCandidateProfilesCSV(), "utf-8");
  console.log(`Candidate profiles CSV written to: ${profilesPath}`);
  return results;
}
main();

// src/historical/validate.ts
function getPos(arch, node) {
  const tmpl = arch.nodes[node];
  if (!tmpl || tmpl.kind !== "continuous") return 3;
  return tmpl.pos;
}
function getSal(arch, node) {
  const tmpl = arch.nodes[node];
  if (!tmpl) return 0;
  return tmpl.sal;
}
function getCatPeak(arch, node) {
  const tmpl = arch.nodes[node];
  if (!tmpl || tmpl.kind !== "categorical") return 0;
  const probs = tmpl.probs;
  return probs.indexOf(Math.max(...probs));
}
function getVote(results, archId, year) {
  const r = results.find((r2) => r2.archetypeId === archId);
  return r ? r.votes[year] : "UNKNOWN";
}
function getVoteByName(results, name, year) {
  const r = results.find((r2) => r2.archetypeName === name);
  return r ? r.votes[year] : "UNKNOWN";
}
function isLaborArchetype(arch) {
  const matPos = getPos(arch, "MAT");
  const matSal = getSal(arch, "MAT");
  const trbSal = getSal(arch, "TRB");
  return matPos <= 2 && matSal >= 2 && trbSal >= 1;
}
function isEvangelicalArchetype(arch) {
  const morPos = getPos(arch, "MOR");
  const morSal = getSal(arch, "MOR");
  const cdPos = getPos(arch, "CD");
  return morPos >= 4 && morSal >= 2 && cdPos >= 3;
}
function isSuburbanEducatedArchetype(arch) {
  const proPos = getPos(arch, "PRO");
  const comPos = getPos(arch, "COM");
  const matPos = getPos(arch, "MAT");
  const epsPeak = getCatPeak(arch, "EPS");
  return matPos >= 2 && matPos <= 4 && proPos >= 4 && comPos >= 3 && (epsPeak === 0 || epsPeak === 1);
}
function isBlackCoalitionArchetype(arch) {
  const matPos = getPos(arch, "MAT");
  const ontSPos = getPos(arch, "ONT_S");
  const trbPos = getPos(arch, "TRB");
  const trbSal = getSal(arch, "TRB");
  return matPos <= 2 && ontSPos >= 4 && trbPos >= 3 && trbSal >= 2;
}
function isSocialConservativeArchetype(arch) {
  const morPos = getPos(arch, "MOR");
  const cdPos = getPos(arch, "CD");
  return morPos >= 4 && cdPos >= 4;
}
function isFreeMarketArchetype(arch) {
  const matPos = getPos(arch, "MAT");
  const matSal = getSal(arch, "MAT");
  return matPos >= 4 && matSal >= 2;
}
function isPopulistArchetype(arch) {
  const zsPos = getPos(arch, "ZS");
  const trbPos = getPos(arch, "TRB");
  const proPos = getPos(arch, "PRO");
  return zsPos >= 4 && trbPos >= 4 && proPos <= 2;
}
function runValidation(results) {
  const checks = [];
  {
    const laborArchs = ARCHETYPES.filter(isLaborArchetype);
    const laborIds = laborArchs.map((a) => a.id);
    const preDemYears = [1960, 1964, 1968, 1972, 1976];
    let preDemCount = 0;
    let preTotalVotes = 0;
    for (const year of preDemYears) {
      const demCandidate = ELECTIONS.find((e) => e.year === year)?.candidates.find((c) => c.party === "Democratic")?.name;
      for (const id of laborIds) {
        const vote = getVote(results, id, year);
        if (vote !== "ABSTAIN") {
          preTotalVotes++;
          if (vote === demCandidate) preDemCount++;
        }
      }
    }
    const prePct = preTotalVotes > 0 ? preDemCount / preTotalVotes * 100 : 0;
    const postYears = [1984, 1988, 1992, 1996, 2e3, 2004, 2008, 2012, 2016, 2020, 2024];
    let postDemCount = 0;
    let postTotalVotes = 0;
    for (const year of postYears) {
      const demCandidate = ELECTIONS.find((e) => e.year === year)?.candidates.find((c) => c.party === "Democratic")?.name;
      for (const id of laborIds) {
        const vote = getVote(results, id, year);
        if (vote !== "ABSTAIN") {
          postTotalVotes++;
          if (vote === demCandidate) postDemCount++;
        }
      }
    }
    const postPct = postTotalVotes > 0 ? postDemCount / postTotalVotes * 100 : 0;
    checks.push({
      name: "Labor Coalition",
      description: "Union/labor archetypes should favor Democrats pre-1980, become more split after Reagan",
      pass: prePct > 60 && postPct < prePct,
      details: `Found ${laborArchs.length} labor archetypes.
  Pre-1980 Democrat vote: ${prePct.toFixed(1)}% (${preDemCount}/${preTotalVotes})
  Post-1980 Democrat vote: ${postPct.toFixed(1)}% (${postDemCount}/${postTotalVotes})
  Expected: pre-1980 > 60% Dem, post-1980 < pre-1980`
    });
  }
  {
    const evangArchs = ARCHETYPES.filter(isEvangelicalArchetype);
    const evangIds = evangArchs.map((a) => a.id);
    let carterVotes1976 = 0;
    let total1976 = 0;
    for (const id of evangIds) {
      const vote = getVote(results, id, 1976);
      if (vote !== "ABSTAIN") {
        total1976++;
        if (vote === "Carter") carterVotes1976++;
      }
    }
    const postYears = [1980, 1984, 1988, 1992, 1996, 2e3, 2004, 2008, 2012, 2016, 2020, 2024];
    let repCount = 0;
    let totalVotes = 0;
    for (const year of postYears) {
      const repCandidate = ELECTIONS.find((e) => e.year === year)?.candidates.find((c) => c.party === "Republican")?.name;
      for (const id of evangIds) {
        const vote = getVote(results, id, year);
        if (vote !== "ABSTAIN") {
          totalVotes++;
          if (vote === repCandidate) repCount++;
        }
      }
    }
    const repPct = totalVotes > 0 ? repCount / totalVotes * 100 : 0;
    checks.push({
      name: "Evangelical Shift",
      description: "Evangelical archetypes should shift Republican after 1976",
      pass: repPct > 65,
      details: `Found ${evangArchs.length} evangelical archetypes.
  1976 Carter vote: ${total1976 > 0 ? (carterVotes1976 / total1976 * 100).toFixed(1) : "N/A"}% (${carterVotes1976}/${total1976})
  Post-1980 Republican vote: ${repPct.toFixed(1)}% (${repCount}/${totalVotes})
  Expected: >65% Republican after 1980`
    });
  }
  {
    const suburbArchs = ARCHETYPES.filter(isSuburbanEducatedArchetype);
    const suburbIds = suburbArchs.map((a) => a.id);
    const preYears = [2e3, 2004, 2008, 2012];
    let preRepCount = 0;
    let preTotal = 0;
    for (const year of preYears) {
      const repCandidate = ELECTIONS.find((e) => e.year === year)?.candidates.find((c) => c.party === "Republican")?.name;
      for (const id of suburbIds) {
        const vote = getVote(results, id, year);
        if (vote !== "ABSTAIN") {
          preTotal++;
          if (vote === repCandidate) preRepCount++;
        }
      }
    }
    const prePct = preTotal > 0 ? preRepCount / preTotal * 100 : 0;
    const postYears = [2016, 2020, 2024];
    let postDemCount = 0;
    let postTotal = 0;
    for (const year of postYears) {
      const demCandidate = ELECTIONS.find((e) => e.year === year)?.candidates.find((c) => c.party === "Democratic")?.name;
      for (const id of suburbIds) {
        const vote = getVote(results, id, year);
        if (vote !== "ABSTAIN") {
          postTotal++;
          if (vote === demCandidate) postDemCount++;
        }
      }
    }
    const postPct = postTotal > 0 ? postDemCount / postTotal * 100 : 0;
    checks.push({
      name: "Suburban Realignment",
      description: "College-educated suburbanites should shift Democratic after 2016",
      pass: postPct > 50,
      details: `Found ${suburbArchs.length} suburban educated archetypes.
  Pre-2016 Republican vote: ${prePct.toFixed(1)}% (${preRepCount}/${preTotal})
  Post-2016 Democratic vote: ${postPct.toFixed(1)}% (${postDemCount}/${postTotal})
  Expected: >50% Democratic post-2016`
    });
  }
  {
    const blackArchs = ARCHETYPES.filter(isBlackCoalitionArchetype);
    const blackIds = blackArchs.map((a) => a.id);
    const postYears = [1968, 1972, 1976, 1980, 1984, 1988, 1992, 1996, 2e3, 2004, 2008, 2012, 2016, 2020, 2024];
    let demCount = 0;
    let totalVotes = 0;
    for (const year of postYears) {
      const demCandidate = ELECTIONS.find((e) => e.year === year)?.candidates.find((c) => c.party === "Democratic")?.name;
      for (const id of blackIds) {
        const vote = getVote(results, id, year);
        if (vote !== "ABSTAIN") {
          totalVotes++;
          if (vote === demCandidate) demCount++;
        }
      }
    }
    const pct = totalVotes > 0 ? demCount / totalVotes * 100 : 0;
    checks.push({
      name: "Black Coalition",
      description: "Structuralist, redistributive, tribal archetypes should be solidly Democratic post-1964",
      pass: pct > 80,
      details: `Found ${blackArchs.length} Black coalition-proxy archetypes.
  Post-1964 Democratic vote: ${pct.toFixed(1)}% (${demCount}/${totalVotes})
  Expected: >80% Democratic`
    });
  }
  {
    const socConArchs = ARCHETYPES.filter(isSocialConservativeArchetype);
    const socConIds = socConArchs.map((a) => a.id);
    const postYears = [1980, 1984, 1988, 1992, 1996, 2e3, 2004, 2008, 2012, 2016, 2020, 2024];
    let repCount = 0;
    let totalVotes = 0;
    for (const year of postYears) {
      const repCandidate = ELECTIONS.find((e) => e.year === year)?.candidates.find((c) => c.party === "Republican")?.name;
      for (const id of socConIds) {
        const vote = getVote(results, id, year);
        if (vote !== "ABSTAIN") {
          totalVotes++;
          if (vote === repCandidate) repCount++;
        }
      }
    }
    const pct = totalVotes > 0 ? repCount / totalVotes * 100 : 0;
    checks.push({
      name: "Social Conservative \u2192 GOP",
      description: "High MOR + high CD archetypes should favor Republican post-1980",
      pass: pct > 65,
      details: `Found ${socConArchs.length} social conservative archetypes.
  Post-1980 Republican vote: ${pct.toFixed(1)}% (${repCount}/${totalVotes})
  Expected: >65% Republican`
    });
  }
  {
    const fmArchs = ARCHETYPES.filter(isFreeMarketArchetype);
    const fmIds = fmArchs.map((a) => a.id);
    const allYears = ELECTIONS.map((e) => e.year);
    let repCount = 0;
    let totalVotes = 0;
    for (const year of allYears) {
      const repCandidate = ELECTIONS.find((e) => e.year === year)?.candidates.find((c) => c.party === "Republican")?.name;
      for (const id of fmIds) {
        const vote = getVote(results, id, year);
        if (vote !== "ABSTAIN") {
          totalVotes++;
          if (vote === repCandidate) repCount++;
        }
      }
    }
    const pct = totalVotes > 0 ? repCount / totalVotes * 100 : 0;
    checks.push({
      name: "Free-Market \u2192 GOP",
      description: "High MAT (market) archetypes should favor Republican consistently",
      pass: pct > 60,
      details: `Found ${fmArchs.length} free-market archetypes.
  Overall Republican vote: ${pct.toFixed(1)}% (${repCount}/${totalVotes})
  Expected: >60% Republican`
    });
  }
  {
    const popArchs = ARCHETYPES.filter(isPopulistArchetype);
    const popIds = popArchs.map((a) => a.id);
    let wallace1968 = 0;
    let total1968 = 0;
    for (const id of popIds) {
      const vote = getVote(results, id, 1968);
      if (vote !== "ABSTAIN") {
        total1968++;
        if (vote === "Wallace") wallace1968++;
      }
    }
    let trump2016 = 0;
    let total2016 = 0;
    for (const id of popIds) {
      const vote = getVote(results, id, 2016);
      if (vote !== "ABSTAIN") {
        total2016++;
        if (vote === "Trump") trump2016++;
      }
    }
    let trump2024 = 0;
    let total2024 = 0;
    for (const id of popIds) {
      const vote = getVote(results, id, 2024);
      if (vote !== "ABSTAIN") {
        total2024++;
        if (vote === "Trump") trump2024++;
      }
    }
    checks.push({
      name: "Populist Alignment",
      description: "Populist archetypes should favor Wallace (1968), Trump (2016, 2024)",
      pass: (total1968 > 0 ? wallace1968 / total1968 > 0.3 : true) && (total2016 > 0 ? trump2016 / total2016 > 0.5 : true) && (total2024 > 0 ? trump2024 / total2024 > 0.5 : true),
      details: `Found ${popArchs.length} populist archetypes.
  1968 Wallace: ${total1968 > 0 ? (wallace1968 / total1968 * 100).toFixed(1) : "N/A"}% (${wallace1968}/${total1968})
  2016 Trump: ${total2016 > 0 ? (trump2016 / total2016 * 100).toFixed(1) : "N/A"}% (${trump2016}/${total2016})
  2024 Trump: ${total2024 > 0 ? (trump2024 / total2024 * 100).toFixed(1) : "N/A"}% (${trump2024}/${total2024})`
    });
  }
  {
    const spotChecks = [
      // Loyal Democrat should always vote D
      { archName: "Loyal Democrat", year: 2016, expected: "Clinton" },
      { archName: "Loyal Democrat", year: 2020, expected: "Biden" },
      // Loyal Republican should always vote R
      { archName: "Loyal Republican", year: 2016, expected: "Trump" },
      { archName: "Loyal Republican", year: 2020, expected: "Trump" },
      // Rawlsian Reformer should vote Obama
      { archName: "Rawlsian Reformer", year: 2008, expected: "Obama" },
      // Burkean Steward should favor establishment Republicans
      { archName: "Burkean Steward", year: 2008, expected: "McCain" }
    ];
    let passed = 0;
    const details = [];
    for (const check of spotChecks) {
      const actual = getVoteByName(results, check.archName, check.year);
      const ok = actual === check.expected;
      if (ok) passed++;
      details.push(`  ${ok ? "\u2713" : "\u2717"} ${check.archName} ${check.year}: expected ${check.expected}, got ${actual}`);
    }
    checks.push({
      name: "Spot Checks",
      description: "Specific archetype-election predictions",
      pass: passed >= spotChecks.length * 0.7,
      details: `${passed}/${spotChecks.length} spot checks passed:
${details.join("\n")}`
    });
  }
  return checks;
}
function printReport(checks) {
  console.log("\n\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550");
  console.log("  PRISM HISTORICAL VALIDATION REPORT");
  console.log("\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\n");
  let passCount = 0;
  for (const check of checks) {
    const status = check.pass ? "PASS \u2713" : "FAIL \u2717";
    if (check.pass) passCount++;
    console.log(`\u2500\u2500 ${check.name} [${status}] \u2500\u2500`);
    console.log(`  ${check.description}`);
    console.log(check.details.split("\n").map((l) => `  ${l}`).join("\n"));
    console.log("");
  }
  console.log("\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500");
  console.log(`  OVERALL: ${passCount}/${checks.length} checks passed`);
  if (passCount === checks.length) {
    console.log("  All coalition patterns validated successfully.");
  } else {
    console.log(`  ${checks.length - passCount} check(s) need attention.`);
  }
  console.log("\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\n");
}
function printCoalitionBreakdown(results) {
  console.log("\n\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550");
  console.log("  COALITION BREAKDOWN BY ELECTION");
  console.log("\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\n");
  const coalitions = [
    { name: "Labor/Union", filter: isLaborArchetype },
    { name: "Evangelical", filter: isEvangelicalArchetype },
    { name: "Suburban Educated", filter: isSuburbanEducatedArchetype },
    { name: "Social Conservative", filter: isSocialConservativeArchetype },
    { name: "Free Market", filter: isFreeMarketArchetype },
    { name: "Populist", filter: isPopulistArchetype }
  ];
  for (const coalition of coalitions) {
    const archs = ARCHETYPES.filter(coalition.filter);
    const ids = archs.map((a) => a.id);
    console.log(`\u2500\u2500 ${coalition.name} (${archs.length} archetypes) \u2500\u2500`);
    for (const election of ELECTIONS) {
      const tallies = {};
      let abstentions = 0;
      for (const id of ids) {
        const vote = getVote(results, id, election.year);
        if (vote === "ABSTAIN") {
          abstentions++;
        } else {
          tallies[vote] = (tallies[vote] || 0) + 1;
        }
      }
      const parts = Object.entries(tallies).sort((a, b) => b[1] - a[1]).map(([name, count]) => `${name}:${count}`).join(", ");
      console.log(`  ${election.year}: ${parts}${abstentions > 0 ? `, ABSTAIN:${abstentions}` : ""}`);
    }
    console.log("");
  }
}
function writeCSVs(results) {
  const fs = require("fs");
  const years = ELECTIONS.map((e) => e.year).sort((a, b) => a - b);
  const header = ["id", "name", ...years.map(String)].join(",");
  const rows = [header];
  for (const r of results) {
    const cols = [r.archetypeId, `"${r.archetypeName}"`];
    for (const y of years) {
      cols.push(r.votes[y] || "");
    }
    rows.push(cols.join(","));
  }
  fs.writeFileSync("output/historical_votes.csv", rows.join("\n"));
  console.log(`Wrote historical_votes.csv: ${results.length} archetypes \xD7 ${years.length} elections`);
}
function main2() {
  console.log("Running PRISM historical election simulation for validation...\n");
  const results = simulate();
  const checks = runValidation(results);
  printReport(checks);
  printCoalitionBreakdown(results);
  writeCSVs(results);
}
main2();
