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

// src/historical/candidates.ts
var election1940 = {
  year: 1940,
  candidates: [
    {
      name: "Roosevelt",
      party: "Democratic",
      year: 1940,
      MAT: 1,
      // Maximum redistribution — New Deal architect, WPA, Social Security
      CD: 2,
      // Culturally open — progressive for era, but pre-civil-rights
      CU: 4,
      // Internationalist — Lend-Lease, Atlantic Charter
      MOR: 4,
      // Wide moral circle — "four freedoms," refugees (limited in practice)
      PRO: 3,
      // Mixed — stretched executive power but through institutions
      COM: 4,
      // Master dealmaker — coalition builder
      ZS: 2,
      // Positive-sum — "abundance for all," economic expansion
      ONT_H: 4,
      // Optimistic — "nothing to fear but fear itself"
      ONT_S: 4,
      // Structuralist — government as solution to systemic failures
      PF: 5,
      // Maximum partisan — built the New Deal coalition
      TRB: 3,
      // Moderate tribal — broad coalition, not in-group focused
      ENG: 5,
      // Maximum engagement — sought unprecedented third term
      EPS: 1,
      // Institutionalist — trusted government machinery
      AES: 0
      // Statesman — patrician, fireside chats, gravitas
    },
    {
      name: "Willkie",
      party: "Republican",
      year: 1940,
      MAT: 5,
      // Pro-market — opposed New Deal expansion, business freedom
      CD: 4,
      // Culturally conservative-leaning — business establishment
      CU: 3,
      // Mixed — internationalist but America-first economics
      MOR: 2,
      // Narrow — business class, not universalist
      PRO: 5,
      // Maximum proceduralist — attacked executive overreach, third-term norm
      COM: 3,
      // Mixed — accepted some New Deal but attacked most
      ZS: 3,
      // Mixed
      ONT_H: 2,
      // Skeptical — government can't fix everything
      ONT_S: 1,
      // System fine — free enterprise works, government is the problem
      PF: 4,
      // Ran as strong Republican despite being newcomer
      TRB: 3,
      // Moderate — business coalition identity
      ENG: 4,
      // Energetic campaign
      EPS: 0,
      // Empiricist — business pragmatist
      AES: 3
      // Authentic — outsider, plain-spoken
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
      // Culturally open — but wartime constraints (Japanese internment)
      CU: 5,
      // Maximum internationalist — UN architect, Allied leader
      MOR: 4,
      // Wide moral circle — fighting fascism, "four freedoms"
      PRO: 3,
      // Mixed — wartime executive power, but through institutions
      COM: 4,
      // Dealmaker — Yalta, Allied coordination
      ZS: 2,
      // Positive-sum — postwar planning, Bretton Woods
      ONT_H: 4,
      // Optimistic — victory within reach
      ONT_S: 4,
      // Structuralist — government as war machine and social safety net
      PF: 5,
      // Maximum partisan
      TRB: 3,
      // National unity rhetoric — "our boys"
      ENG: 5,
      // Maximum — fourth-term bid during world war
      EPS: 1,
      // Institutionalist
      AES: 0
      // Statesman — commander-in-chief gravitas
    },
    {
      name: "Dewey",
      party: "Republican",
      year: 1944,
      MAT: 5,
      // Pro-market — criticized New Deal spending and bureaucracy
      CD: 4,
      // Culturally conservative — establishment Republican values
      CU: 2,
      // Leaned assimilationist — America-first, skeptical of entanglements
      MOR: 2,
      // Narrow moral circle — business/establishment focus
      PRO: 5,
      // Maximum proceduralist — prosecutor, rule-of-law identity
      COM: 3,
      // Mixed — attacked FDR but ran cautious campaign
      ZS: 3,
      // Mixed
      ONT_H: 2,
      // Skeptical — FDR overreach, government can't do everything
      ONT_S: 1,
      // System fine — just needs less government, better management
      PF: 4,
      // Strong Republican
      TRB: 3,
      // Moderate tribal — establishment identity
      ENG: 4,
      // Engaged
      EPS: 0,
      // Empiricist — prosecutor, facts-based
      AES: 1
      // Technocrat — efficient manager image
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
      // Maximum redistribution — Fair Deal, national healthcare attempt
      CD: 2,
      // Culturally open — desegregated military, civil rights plank
      CU: 4,
      // Internationalist — Marshall Plan, NATO, containment
      MOR: 4,
      // Wide moral circle — civil rights courage, Berlin Airlift
      PRO: 3,
      // Mixed — strong executive, "the buck stops here"
      COM: 3,
      // Mixed — fighter, not dealmaker ("do-nothing Congress")
      ZS: 2,
      // Positive-sum — Marshall Plan, postwar prosperity
      ONT_H: 4,
      // Optimistic — America can lead the free world
      ONT_S: 3,
      // Mixed — system needs reform (Fair Deal) but basically sound
      PF: 5,
      // Maximum partisan — attacked Republican Congress relentlessly
      TRB: 3,
      // Moderate tribal — working-class identity, "regular guy"
      ENG: 5,
      // Maximum engagement — whistle-stop tour, never-give-up
      EPS: 1,
      // Institutionalist — trusted government, Truman Doctrine
      AES: 4
      // Fighter — "Give 'em hell Harry"
    },
    {
      name: "Dewey",
      party: "Republican",
      year: 1948,
      MAT: 5,
      // Pro-market — opposed Fair Deal expansion
      CD: 4,
      // Culturally conservative — establishment values
      CU: 2,
      // Assimilationist leaning — America-first
      MOR: 2,
      // Narrow moral frame — business establishment
      PRO: 5,
      // Maximum proceduralist — prosecutor, above-the-fray
      COM: 4,
      // Compromiser — ran cautious, non-confrontational campaign
      ZS: 3,
      // Mixed
      ONT_H: 2,
      // Skeptical — government overreach concern
      ONT_S: 1,
      // System fine — stable management, less government
      PF: 4,
      // Strong Republican
      TRB: 3,
      // Moderate tribal
      ENG: 3,
      // Lower engagement — overconfident, coasted
      EPS: 0,
      // Empiricist — technocratic
      AES: 0
      // Statesman — dignified, above-the-fray
    },
    {
      name: "Thurmond",
      party: "Dixiecrat",
      year: 1948,
      MAT: 3,
      // Mixed — supported New Deal economics for whites
      CD: 5,
      // Maximum cultural conservatism — segregation
      CU: 1,
      // Maximum assimilationist/closed — racial hierarchy, states' rights
      MOR: 1,
      // Maximum narrow moral circle — whites only
      PRO: 2,
      // Anti-proceduralist — states' rights to override federal law
      COM: 1,
      // Never compromise — walked out of convention
      ZS: 5,
      // Maximum zero-sum — racial competition for resources
      ONT_H: 2,
      // Pessimistic — feared social change
      ONT_S: 4,
      // System broken — federal overreach destroying southern way of life
      PF: 3,
      // Regional partisan — not national party man
      TRB: 5,
      // Maximum tribal — white southern identity
      ENG: 5,
      // Maximum engagement — launched entire party over civil rights
      EPS: 2,
      // Traditionalist — "way things have always been"
      AES: 4
      // Fighter — insurgent, defiant
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
      // Pro-market lean — balanced budgets, limited government expansion
      CD: 3,
      // Culturally moderate — not a culture warrior
      CU: 3,
      // Mixed — NATO but also "America first" resonance with base
      MOR: 3,
      // Centrist moral frame — duty over ideology
      PRO: 5,
      // Maximum proceduralist — military institutionalist, chain of command
      COM: 4,
      // Pragmatic compromiser — "middle way" politics
      ZS: 2,
      // Positive-sum — postwar prosperity, "peace through strength"
      ONT_H: 3,
      // Moderate realism — military pragmatist
      ONT_S: 2,
      // System working — protect and manage it
      PF: 3,
      // Moderate partisan — ran as Republican, attracted independents
      TRB: 3,
      // Moderate — military patriotic identity, "our boys"
      ENG: 5,
      // Maximum engagement — running for president is maximum engagement
      EPS: 0,
      // Empiricist — military planning, evidence-based
      AES: 0
      // Statesman — supreme commander, gravitas
    },
    {
      name: "Stevenson",
      party: "Democratic",
      year: 1952,
      MAT: 1,
      // Maximum redistributive — full New Deal expansion
      CD: 1,
      // Culturally open — intellectual, progressive, "egghead"
      CU: 5,
      // Maximum internationalist — UN, multilateral, cosmopolitan
      MOR: 5,
      // Maximum universalist — humanitarian concern, broad moral circle
      PRO: 4,
      // Proceduralist — lawyer, institutional
      COM: 4,
      // Compromiser — pragmatic liberal
      ZS: 2,
      // Positive-sum — optimistic liberal
      ONT_H: 5,
      // Maximum optimistic — believed deeply in human progress
      ONT_S: 4,
      // System needs big reform — government as instrument of good
      PF: 5,
      // Maximum Democrat — New Deal heir
      TRB: 3,
      // Moderate tribal — intellectual elite identity
      ENG: 4,
      // Engaged but "egghead" aloofness
      EPS: 0,
      // Empiricist — "the thinking man's candidate"
      AES: 5
      // Visionary — eloquent idealist
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
      // Same centrist economics — highway act, balanced budgets
      CD: 3,
      // Moderate — sent troops to Little Rock (reluctantly)
      CU: 4,
      // Internationalist — Suez response, NATO
      MOR: 3,
      // Centrist
      PRO: 5,
      // Maximum proceduralist — institutional, rule-of-law (Little Rock)
      COM: 4,
      // Pragmatic — "middle way"
      ZS: 2,
      // Positive-sum — peace and prosperity
      ONT_H: 3,
      // Moderate realism
      ONT_S: 1,
      // System working well — prosperity, peace, stability
      PF: 2,
      // Low partisan — above-party, national figure
      TRB: 2,
      // Low tribal — father figure to nation
      ENG: 4,
      // Engaged incumbent
      EPS: 0,
      // Empiricist — military planning background
      AES: 0
      // Statesman — beloved grandfather-commander
    },
    {
      name: "Stevenson",
      party: "Democratic",
      year: 1956,
      MAT: 1,
      // Maximum redistributive — expanded New Deal vision
      CD: 1,
      // Culturally open — civil rights support, progressive intellectual
      CU: 5,
      // Maximum internationalist — nuclear test ban, UN
      MOR: 5,
      // Maximum universalist — humanitarian, nuclear concern
      PRO: 4,
      // Proceduralist
      COM: 3,
      // Less compromising this time — sharper attacks
      ZS: 2,
      // Positive-sum
      ONT_H: 5,
      // Maximum optimistic — progress narrative
      ONT_S: 4,
      // System needs big reform — "New America"
      PF: 5,
      // Maximum partisan — stronger party identity second time
      TRB: 4,
      // Higher tribal — rallying the base, us-vs-them
      ENG: 5,
      // Maximum engagement — fighting harder second time
      EPS: 0,
      // Empiricist
      AES: 5
      // Visionary — nuclear test ban, "New America"
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
      // Mildly redistributive — New Frontier spending, but not radical
      CD: 2,
      // Culturally open but within Catholic bounds
      CU: 4,
      // Internationalist — Peace Corps, Alliance for Progress
      MOR: 3,
      // Center — Catholic traditionalism + secular modernism
      PRO: 4,
      // Institutionalist — rule of law, Cold War institutions
      COM: 4,
      // Willing to deal — pragmatic liberal
      ZS: 2,
      // Mostly positive-sum — "rising tide lifts all boats"
      ONT_H: 4,
      // Optimistic about human potential — "ask what you can do"
      ONT_S: 3,
      // Mix of individual initiative and government programs
      PF: 4,
      // Strong Democrat identity
      TRB: 3,
      // Moderate tribal — Catholic identity, but broadening coalition
      ENG: 5,
      // Politics as calling — "ask what you can do for your country"
      EPS: 1,
      // Institutionalist — trusted expertise and government
      AES: 0
      // Statesman — projected elegance and gravitas
    },
    {
      name: "Nixon",
      party: "Republican",
      year: 1960,
      MAT: 4,
      // Pro-market but accepted New Deal baseline
      CD: 3,
      // Culturally moderate — suburban middle America
      CU: 3,
      // Internationalist but America-first undertones
      MOR: 3,
      // Moderate on morality — not culture warrior
      PRO: 4,
      // Proceduralist — rule of law, anti-communist legalism
      COM: 4,
      // Pragmatic dealmaker (pre-Watergate Nixon)
      ZS: 3,
      // Mixed — Cold War competition but domestic optimism
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
      // Institutionalist — government experience
      AES: 0
      // Statesman — tried to project gravitas (less successfully)
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
      // Maximum redistribution — Great Society, War on Poverty
      CD: 2,
      // Culturally open — signed Civil Rights Act
      CU: 4,
      // Universalist — civil rights, global engagement
      MOR: 3,
      // Southern traditionalist personally, but signed progressive laws
      PRO: 3,
      // Ends-oriented — "whatever it takes" legislative arm-twisting
      COM: 4,
      // Master dealmaker — greatest legislative arm-twister in history
      ZS: 2,
      // Positive-sum — abundance mentality, Great Society for all
      ONT_H: 4,
      // Optimistic — believed government could improve society
      ONT_S: 4,
      // Structuralist — systemic programs
      PF: 5,
      // Party-is-identity — master Democrat
      TRB: 4,
      // Strong coalition tribal politics
      ENG: 5,
      // Politics was his life
      EPS: 1,
      // Institutionalist — trusted government machinery
      AES: 0
      // Statesman (with pastoral southern touches)
    },
    {
      name: "Goldwater",
      party: "Republican",
      year: 1964,
      MAT: 5,
      // Maximum free-market — wanted to abolish New Deal programs
      CD: 4,
      // Culturally conservative — states' rights, opposed CRA
      CU: 2,
      // Particularist — America first, skeptical of UN
      MOR: 3,
      // Not a moralist — libertarian streak, personal tolerance
      PRO: 4,
      // Constitutional proceduralist — strict constructionist
      COM: 1,
      // Never compromise — "extremism in defense of liberty"
      ZS: 3,
      // Mixed — Cold War zero-sum, domestic freedom
      ONT_H: 2,
      // Conservative realism — skeptical of social engineering
      ONT_S: 1,
      // Maximum individualist — minimal government
      PF: 3,
      // Party loyalist but also insurgent within party
      TRB: 3,
      // Ideological tribe more than ethnic/class
      ENG: 5,
      // Deeply engaged — movement conservative
      EPS: 4,
      // Autonomous — principled first-principles reasoning
      AES: 3
      // Authentic — spoke his mind regardless of consequences
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
      // Law and order, Silent Majority — culturally conservative signal
      CU: 3,
      // Internationalist (détente) but America-first undertones
      MOR: 4,
      // Appealed to traditional values, moral majority
      PRO: 3,
      // Pragmatic — willing to bend rules (foreshadowing)
      COM: 3,
      // Dealmaker but hardline rhetoric
      ZS: 3,
      // Mixed — us vs. them rhetoric, but pragmatic
      ONT_H: 2,
      // Pessimistic about human nature — realpolitik
      ONT_S: 2,
      // Individualist — personal responsibility rhetoric
      PF: 4,
      // Strong Republican
      TRB: 4,
      // Silent Majority tribal appeal
      ENG: 5,
      // Career politician
      EPS: 1,
      // Institutionalist — worked the system
      AES: 0
      // Statesman — projected authority
    },
    {
      name: "Humphrey",
      party: "Democratic",
      year: 1968,
      MAT: 2,
      // Redistributive — Great Society continuation
      CD: 2,
      // Culturally open — civil rights record
      CU: 4,
      // Internationalist — UN champion, liberal internationalism
      MOR: 3,
      // Moderate morality
      PRO: 4,
      // Proceduralist — institutional liberal
      COM: 5,
      // Maximum compromiser — "happy warrior," consensus-seeker
      ZS: 2,
      // Positive-sum — politics of joy
      ONT_H: 4,
      // Optimistic about human nature
      ONT_S: 4,
      // Structuralist — government programs
      PF: 5,
      // Strong Democrat partisan
      TRB: 3,
      // Coalition builder
      ENG: 5,
      // Lifelong politician
      EPS: 1,
      // Institutionalist
      AES: 5
      // Visionary — idealistic rhetoric
    },
    {
      name: "Wallace",
      party: "American Independent",
      year: 1968,
      MAT: 2,
      // Economic populist — pro-worker, anti-elite
      CD: 5,
      // Maximum cultural closure — segregationist
      CU: 1,
      // Maximum particularist — white southern identity
      MOR: 5,
      // Maximum traditional morality
      PRO: 1,
      // Ends-justify-means — willing to defy courts
      COM: 1,
      // Never compromise — defiant
      ZS: 5,
      // Maximum zero-sum — racial/cultural competition
      ONT_H: 1,
      // Deeply pessimistic — human nature fixed, hierarchical
      ONT_S: 2,
      // Individualist with paternalist streak
      PF: 1,
      // Independent — rejected both parties
      TRB: 5,
      // Maximum tribal — white southern identity
      ENG: 5,
      // Deeply politically engaged
      EPS: 3,
      // Intuitionist — gut-level politics
      AES: 4
      // Fighter — combative, defiant
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
      // More centrist as president — wage controls, EPA
      CD: 4,
      // Silent Majority, law and order
      CU: 3,
      // Détente — pragmatic internationalism
      MOR: 4,
      // Traditional values appeal
      PRO: 3,
      // Pragmatic — willing to bend rules
      COM: 4,
      // Dealmaker — bipartisan governance, EPA, China opening
      ZS: 3,
      // Mixed — détente positive-sum, domestic messaging mixed
      ONT_H: 3,
      // Moderate — realpolitik
      ONT_S: 3,
      // Center — created EPA, but individual responsibility rhetoric
      PF: 4,
      // Strong Republican
      TRB: 3,
      // Broad appeal — "Silent Majority" was deliberately broad
      ENG: 5,
      // Career politician
      EPS: 0,
      // Empiricist as president — data-driven détente
      AES: 0
      // Statesman — presidential, "peace with honor"
    },
    {
      name: "McGovern",
      party: "Democratic",
      year: 1972,
      MAT: 1,
      // Maximum redistribution — demogrant proposal
      CD: 1,
      // Maximum cultural openness — counterculture affinity
      CU: 5,
      // Maximum universalist — anti-war, global peace
      MOR: 1,
      // Maximum secular progressivism — "acid, amnesty, abortion"
      PRO: 2,
      // Anti-establishment — challenged party rules
      COM: 1,
      // Uncompromising on principles — anti-war absolutism
      ZS: 1,
      // Maximum positive-sum — "come home, America"
      ONT_H: 5,
      // Maximum perfectibility — believed in transformation
      ONT_S: 5,
      // Maximum structuralist — systemic change
      PF: 2,
      // Challenged party establishment — insurgent
      TRB: 2,
      // New Left — narrow coalition, alienated traditional Dems
      ENG: 5,
      // Deeply engaged — movement politics
      EPS: 0,
      // Empiricist — professor, policy wonk
      AES: 5
      // Visionary — idealistic moral appeal
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
      // Mildly redistributive — but fiscally cautious
      CD: 3,
      // Center — southern Christian but progressive on race
      CU: 4,
      // Internationalist — human rights foreign policy
      MOR: 4,
      // Traditional morality — born-again Christian
      PRO: 5,
      // Maximum proceduralist — "I'll never lie to you," integrity
      COM: 4,
      // Willing to deal — pragmatic
      ZS: 2,
      // Positive-sum — optimistic outsider
      ONT_H: 4,
      // Optimistic — "why not the best?"
      ONT_S: 3,
      // Mixed — government reform, not expansion
      PF: 3,
      // Democrat but ran as outsider to party
      TRB: 3,
      // Southern identity, broad coalition
      ENG: 4,
      // Engaged but projected citizen-politician
      EPS: 3,
      // Intuitionist — moral/faith-based reasoning
      AES: 2
      // Pastoral — peanut farmer, small-town authenticity
    },
    {
      name: "Ford",
      party: "Republican",
      year: 1976,
      MAT: 4,
      // Pro-market moderate Republican
      CD: 3,
      // Culturally moderate
      CU: 3,
      // Internationalist mainstream
      MOR: 3,
      // Moderate traditionalist
      PRO: 5,
      // Maximum proceduralist — healer, institutional legitimacy
      COM: 5,
      // Maximum compromise — "our long national nightmare is over"
      ZS: 2,
      // Positive-sum — healing, unity
      ONT_H: 3,
      // Moderate realism
      ONT_S: 2,
      // Individualist-leaning
      PF: 4,
      // Republican loyalist
      TRB: 2,
      // Broad appeal, low tribal signaling
      ENG: 4,
      // Institutional politician
      EPS: 1,
      // Institutionalist — congressional creature
      AES: 0
      // Statesman — steady, presidential
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
      // Pro-market — supply-side, tax cuts, but not abolishing safety net
      CD: 4,
      // Culturally conservative — traditional values coalition
      CU: 3,
      // American exceptionalism — patriotic internationalist, not isolationist
      MOR: 4,
      // Traditional morality — evangelical alliance, but not fire-and-brimstone
      PRO: 3,
      // Mixed — respected institutions but anti-government rhetoric
      COM: 4,
      // Great Communicator — worked across aisle, pragmatic when needed
      ZS: 2,
      // Positive-sum — "rising tide lifts all boats," optimistic
      ONT_H: 4,
      // Optimistic about Americans — believed in their potential
      ONT_S: 2,
      // Individualist — "government IS the problem" but not extreme
      PF: 4,
      // Strong Republican — transformed the party
      TRB: 4,
      // Strong tribal — "real Americans" appeal
      ENG: 5,
      // Deeply engaged — movement leader
      EPS: 3,
      // Intuitionist — gut conviction, moral clarity
      AES: 5
      // Visionary — "morning in America," transformative optimism
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
      // Internationalist — human rights
      MOR: 4,
      // Traditional morality — born-again
      PRO: 5,
      // Maximum proceduralist — integrity
      COM: 3,
      // Less compromising as incumbent — stubborn
      ZS: 3,
      // More pessimistic — "malaise" speech
      ONT_H: 3,
      // Less optimistic — humbled by office
      ONT_S: 3,
      // Mixed
      PF: 4,
      // Stronger partisan as incumbent
      TRB: 3,
      // Moderate tribal
      ENG: 4,
      // Engaged but exhausted
      EPS: 0,
      // Empiricist — engineer's mindset, detail-oriented
      AES: 2
      // Pastoral — but less effective
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
      // Proceduralist — rule of law, institutional
      COM: 4,
      // Compromiser — bipartisan appeal
      ZS: 2,
      // Positive-sum — optimistic moderate
      ONT_H: 4,
      // Optimistic
      ONT_S: 3,
      // Mixed
      PF: 1,
      // Maximum independent — rejected own party
      TRB: 1,
      // Low tribal — explicitly anti-tribal
      ENG: 4,
      // Engaged — ran despite impossible odds
      EPS: 0,
      // Empiricist — policy wonk
      AES: 1
      // Technocrat — intellectual, professorial
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
      // Pro-market but governed pragmatically — didn't touch Social Security
      CD: 3,
      // Broad cultural appeal — optimistic, not punitive
      CU: 3,
      // American exceptionalism — but "Mr. Gorbachev, tear down this wall" is universalist
      MOR: 4,
      // Traditional morality — but sunny, not fire-and-brimstone
      PRO: 4,
      // Worked with Tip O'Neill — respected institutional process
      COM: 4,
      // Great Communicator — master compromiser in practice
      ZS: 1,
      // Maximum positive-sum — "it's morning in America"
      ONT_H: 4,
      // Optimistic about Americans — peak "shining city on a hill"
      ONT_S: 2,
      // Individualist-leaning — but not extreme
      PF: 5,
      // Maximum party leader — defined the GOP
      TRB: 3,
      // Broad appeal — won 49 states by transcending tribes
      ENG: 5,
      // Maximum engagement — dominant president
      EPS: 3,
      // Intuitionist — gut conviction, moral clarity
      AES: 5
      // Visionary — peak "morning in America"
    },
    {
      name: "Mondale",
      party: "Democratic",
      year: 1984,
      MAT: 1,
      // Maximum redistribution — old-guard New Deal liberal
      CD: 2,
      // Culturally open — perceived as liberal
      CU: 4,
      // Internationalist
      MOR: 2,
      // Secular-leaning — perceived as permissive by swing voters
      PRO: 4,
      // Institutionalist — process-oriented
      COM: 4,
      // Compromiser — coalition politician
      ZS: 3,
      // "We need to raise taxes" — sacrifice framing
      ONT_H: 3,
      // Less optimistic — "let's be honest" downer messaging
      ONT_S: 5,
      // Maximum structuralist — big-government liberal image
      PF: 5,
      // Maximum Democrat — party creature
      TRB: 4,
      // Labor/union tribal — narrow coalition
      ENG: 5,
      // Career politician
      EPS: 1,
      // Institutionalist — establishment
      AES: 0
      // Statesman — tried to project gravitas but lacked charisma
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
      // Pro-market — "no new taxes" (initially)
      CD: 4,
      // Culturally conservative — Willie Horton, flag/pledge
      CU: 3,
      // Internationalist — UN ambassador, CIA director
      MOR: 4,
      // Traditional values — "thousand points of light"
      PRO: 4,
      // Proceduralist — institutionalist background
      COM: 4,
      // Pragmatic — "kinder, gentler"
      ZS: 2,
      // Positive-sum — "kinder, gentler nation"
      ONT_H: 3,
      // Moderate
      ONT_S: 2,
      // Individualist-leaning
      PF: 4,
      // Strong Republican — Reagan's heir
      TRB: 3,
      // Patrician — less tribal than Reagan
      ENG: 4,
      // Career public servant
      EPS: 1,
      // Institutionalist — foreign policy establishment
      AES: 0
      // Statesman — patrician dignity
    },
    {
      name: "Dukakis",
      party: "Democratic",
      year: 1988,
      MAT: 2,
      // Mildly redistributive — Massachusetts liberal
      CD: 1,
      // Culturally very open — ACLU member, perceived as too liberal
      CU: 4,
      // Universalist
      MOR: 1,
      // Secular progressive — wouldn't say death penalty even for wife's murder
      PRO: 5,
      // Maximum proceduralist — "competence not ideology"
      COM: 4,
      // Pragmatic compromiser
      ZS: 2,
      // Positive-sum — economic manager
      ONT_H: 4,
      // Optimistic — technocratic confidence
      ONT_S: 4,
      // Structuralist — government solutions
      PF: 4,
      // Strong Democrat
      TRB: 2,
      // Low tribal — technocratic appeal
      ENG: 4,
      // Engaged — governor/manager
      EPS: 0,
      // Empiricist — data-driven, technocratic
      AES: 1
      // Technocrat — "competence not ideology"
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
      // Centrist — "end welfare as we know it," pro-business Democrat
      CD: 2,
      // Culturally open — boomer, saxophone, Arsenio Hall
      CU: 4,
      // Internationalist — free trade, global engagement
      MOR: 3,
      // Center — "safe, legal, and rare" on abortion
      PRO: 3,
      // Pragmatic — ends-oriented, "whatever works"
      COM: 5,
      // Maximum compromiser — triangulation, "Third Way"
      ZS: 1,
      // Maximum positive-sum — "it's the economy" optimism
      ONT_H: 4,
      // Optimistic — "a place called Hope"
      ONT_S: 3,
      // Mixed — market solutions + government investment
      PF: 4,
      // Strong Democrat — but "New Democrat"
      TRB: 3,
      // Broad coalition — Bubba + professionals
      ENG: 5,
      // Maximum political animal
      EPS: 0,
      // Empiricist — policy wonk, "putting people first"
      AES: 3
      // Authentic — "I feel your pain," personal connection
    },
    {
      name: "Bush",
      party: "Republican",
      year: 1992,
      MAT: 4,
      // Pro-market but raised taxes
      CD: 3,
      // Culturally moderate — patrician, not culture warrior
      CU: 4,
      // Internationalist — "new world order," Gulf War coalition
      MOR: 3,
      // Moderate traditional
      PRO: 4,
      // Institutionalist
      COM: 4,
      // Pragmatic — broke tax pledge to deal
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
      // Statesman — "résumé candidate"
    },
    {
      name: "Perot",
      party: "Independent",
      year: 1992,
      MAT: 4,
      // Fiscally conservative — deficit hawk
      CD: 3,
      // Moderate — populist center
      CU: 2,
      // Particularist — anti-NAFTA, "giant sucking sound"
      MOR: 3,
      // Moderate
      PRO: 3,
      // Mixed — pragmatic businessman
      COM: 2,
      // Low compromise — outsider, won't play the game
      ZS: 4,
      // Zero-sum on trade — "they're taking our jobs"
      ONT_H: 3,
      // Moderate — practical businessman
      ONT_S: 2,
      // Individualist — business-oriented
      PF: 1,
      // Maximum independent
      TRB: 2,
      // Anti-establishment, low tribal
      ENG: 4,
      // Engaged — ran despite no political background
      EPS: 0,
      // Empiricist — charts and graphs, data-driven
      AES: 1
      // Technocrat — businessman with spreadsheets
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
      // Centrist — welfare reform, balanced budget
      CD: 2,
      // Culturally open — but "V-chip," school uniforms
      CU: 4,
      // Internationalist — Kosovo, global trade
      MOR: 3,
      // Center — "bridge to 21st century"
      PRO: 3,
      // Pragmatic
      COM: 5,
      // Maximum compromise — triangulation perfected
      ZS: 1,
      // Maximum positive-sum — booming economy
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
      // Empiricist — "what works"
      AES: 0
      // Statesman — presidential incumbent
    },
    {
      name: "Dole",
      party: "Republican",
      year: 1996,
      MAT: 4,
      // Pro-market — 15% tax cut proposal
      CD: 4,
      // Culturally conservative — "where's the outrage?"
      CU: 3,
      // Internationalist — WWII veteran, NATO supporter
      MOR: 4,
      // Traditional values
      PRO: 4,
      // Proceduralist — Senate institutionalist
      COM: 4,
      // Dealmaker — Senate culture
      ZS: 3,
      // Mixed
      ONT_H: 2,
      // Conservative realism — WWII generation
      ONT_S: 2,
      // Individualist-leaning
      PF: 5,
      // Maximum partisan — career Republican
      TRB: 3,
      // Moderate tribal — old-guard, not populist
      ENG: 5,
      // Career politician
      EPS: 1,
      // Institutionalist — Senate creature
      AES: 0
      // Statesman — WWII hero, tried for gravitas
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
      // Mildly redistributive — "people vs. powerful"
      CD: 2,
      // Culturally open
      CU: 4,
      // Universalist — climate, global engagement
      MOR: 3,
      // Center — Tipper's PMRC but personally moderate
      PRO: 4,
      // Proceduralist — institutions, process
      COM: 4,
      // Compromiser — centrist Democrat
      ZS: 2,
      // Positive-sum — technology optimism
      ONT_H: 4,
      // Optimistic — technology/progress
      ONT_S: 3,
      // Mixed — government investment but market-friendly
      PF: 4,
      // Strong Democrat
      TRB: 3,
      // Moderate tribal
      ENG: 5,
      // Career politician
      EPS: 0,
      // Empiricist — data, science, climate expertise
      AES: 1
      // Technocrat — wonkish, "lockbox"
    },
    {
      name: "Bush",
      party: "Republican",
      year: 2e3,
      MAT: 4,
      // Pro-market — tax cuts
      CD: 3,
      // Moderate culturally — "compassionate conservatism"
      CU: 3,
      // Mixed — internationalist but skeptical of nation-building
      MOR: 4,
      // Traditional — born-again, faith-based initiatives
      PRO: 3,
      // Mixed — pragmatic governor
      COM: 4,
      // "Uniter not a divider" — compromiser signal
      ZS: 2,
      // Positive-sum — compassionate conservatism
      ONT_H: 3,
      // Moderate — faith in individual but "soft bigotry of low expectations"
      ONT_S: 2,
      // Individualist — "ownership society"
      PF: 4,
      // Strong Republican
      TRB: 3,
      // Moderate tribal — compassionate conservatism
      ENG: 3,
      // Projected citizen-politician — rancher, not career pol
      EPS: 3,
      // Intuitionist — "gut" decision-maker, faith-based
      AES: 2
      // Pastoral — ranch, folksy, "guy you'd have a beer with"
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
      // Redistributive signal — opposed Bush tax cuts, healthcare expansion
      CD: 1,
      // Culturally open — Massachusetts liberal, pro-choice, anti-death-penalty
      CU: 5,
      // Maximum pluralist — multilateral, UN, "global test"
      MOR: 5,
      // Maximum universalist — broad moral concern, anti-torture
      PRO: 4,
      // Proceduralist — rule of law, Geneva Conventions, Senate institutionalist
      COM: 4,
      // Compromiser — Senate dealmaker
      ZS: 2,
      // Positive-sum — multilateral cooperation
      ONT_H: 4,
      // Optimistic about human nature
      ONT_S: 3,
      // Mixed — criticized Iraq but defended system broadly
      PF: 5,
      // Maximum Democrat — ran as anti-Bush
      TRB: 4,
      // Higher tribal — "reporting for duty" military identity, us-vs-them on Iraq
      ENG: 5,
      // Maximum engagement — war hero running against wartime president
      EPS: 0,
      // Empiricist — nuanced, "intellectual"
      AES: 0
      // Statesman — "reporting for duty," patrician
    },
    {
      name: "Bush",
      party: "Republican",
      year: 2004,
      MAT: 5,
      // Maximum free-market — ownership society, tax cuts, privatize SS
      CD: 4,
      // Culturally conservative — gay marriage amendment
      CU: 2,
      // Assimilationist/closed — American exceptionalism, unilateral (CU low=closed)
      MOR: 2,
      // Narrow moral circle — evangelical in-group, us-vs-them (MOR low=particularist)
      PRO: 4,
      // Institutional president — worked through Congress, DOJ, NATO (PRO high=procedural)
      COM: 3,
      // Mixed — "decider" rhetoric but bipartisan on education, immigration
      ZS: 4,
      // Zero-sum — "with us or against us"
      ONT_H: 3,
      // Mixed — "freedom is on the march" but threat-focused
      ONT_S: 2,
      // System mostly working — defended institutions (ONT_S low=stable)
      PF: 5,
      // Maximum partisan — Karl Rove base strategy
      TRB: 4,
      // Highly tribal — post-9/11 patriotic identity, but not max
      ENG: 5,
      // War president — maximum engagement
      EPS: 3,
      // Intuitionist — gut decisions, faith-based
      AES: 4
      // Fighter — war president, "bring 'em on"
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
      // Mildly redistributive — "spread the wealth" but market-friendly
      CD: 2,
      // Culturally open — but ran as unifier, not radical
      CU: 4,
      // Universalist — global citizen, but grounded in American values
      MOR: 3,
      // Center — referenced faith frequently, "God is in the mix"
      PRO: 4,
      // Proceduralist — constitutional law professor
      COM: 4,
      // Compromiser — post-partisan rhetoric, "no red/blue America"
      ZS: 1,
      // Maximum positive-sum — "hope and change," unity
      ONT_H: 5,
      // Maximum perfectibility — "yes we can," transformation
      ONT_S: 3,
      // Mixed — community organizer but "personal responsibility" rhetoric
      PF: 3,
      // Moderate partisan — post-partisan appeal
      TRB: 2,
      // Low tribal — explicitly anti-tribal, transcended identity politics
      ENG: 5,
      // Maximum engagement — movement-building
      EPS: 0,
      // Empiricist — "what works," pragmatic progressive
      AES: 5
      // Visionary — "yes we can," transformative rhetoric
    },
    {
      name: "McCain",
      party: "Republican",
      year: 2008,
      MAT: 4,
      // Pro-market — but not supply-side ideologue
      CD: 3,
      // Culturally moderate — immigration reform, "maverick"
      CU: 3,
      // Internationalist — but American leadership
      MOR: 3,
      // Moderate morality — not culture warrior (Palin was)
      PRO: 4,
      // Proceduralist — campaign finance reform, rule of law
      COM: 4,
      // Compromiser — "maverick," bipartisan deals
      ZS: 3,
      // Mixed — competition abroad, cooperation at home
      ONT_H: 3,
      // Moderate
      ONT_S: 2,
      // Individualist-leaning — personal responsibility
      PF: 3,
      // Moderate partisan — maverick who bucked party
      TRB: 3,
      // Mixed — war hero identity + Palin complicated it
      ENG: 5,
      // Career senator, war hero — deeply engaged
      EPS: 1,
      // Institutionalist — Senate creature
      AES: 3
      // Authentic — straight talk, personal honor
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
      // Redistributive — ACA, Buffett Rule, "you didn't build that"
      CD: 2,
      // Culturally open — supported gay marriage
      CU: 4,
      // Internationalist — but more pragmatic
      MOR: 2,
      // Progressive morality — evolved on marriage equality
      PRO: 4,
      // Proceduralist — institutional governance
      COM: 3,
      // Less compromising — frustrated with Congress
      ZS: 2,
      // Mostly positive-sum — but "forward" implies work needed
      ONT_H: 4,
      // Still optimistic but more seasoned
      ONT_S: 3,
      // Mixed — ACA, but also personal responsibility framing
      PF: 4,
      // Stronger partisan — election mode
      TRB: 3,
      // Coalition politics
      ENG: 5,
      // Maximum engagement — incumbent running
      EPS: 0,
      // Empiricist — data-driven governance
      AES: 0
      // Statesman — presidential, above the fray
    },
    {
      name: "Romney",
      party: "Republican",
      year: 2012,
      MAT: 5,
      // Maximum free-market — Bain Capital, cut taxes/regulations
      CD: 3,
      // Moderate culturally — Massachusetts record, Mormon
      CU: 3,
      // Mixed — internationalist establishment
      MOR: 4,
      // Traditionally moral — Mormon, family values
      PRO: 4,
      // Proceduralist — rule of law, business process
      COM: 3,
      // Mixed — "severely conservative" pivot
      ZS: 3,
      // Mixed — competitive business worldview
      ONT_H: 3,
      // Moderate — business pragmatism
      ONT_S: 1,
      // Maximum individualist — "47%," self-reliance
      PF: 4,
      // Strong Republican
      TRB: 3,
      // Moderate tribal — business class
      ENG: 4,
      // Engaged — but projected competent manager
      EPS: 0,
      // Empiricist — consulting/business background
      AES: 1
      // Technocrat — business turnaround specialist
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
      // Populist economics — protectionist, but tax cuts for rich
      CD: 5,
      // Maximum cultural closure — "build the wall," immigration
      CU: 1,
      // Maximum particularist — "America First"
      MOR: 3,
      // Mixed — evangelicals supported him but not personally moral
      PRO: 1,
      // Maximum anti-proceduralist — norm-breaking, "drain the swamp"
      COM: 1,
      // Never compromise — "we're going to win so much"
      ZS: 5,
      // Maximum zero-sum — "they're taking our jobs," immigration
      ONT_H: 2,
      // Pessimistic — "American carnage"
      ONT_S: 2,
      // Individualist — "I alone can fix it"
      PF: 3,
      // Moderate — hijacked the party, not loyal to it
      TRB: 5,
      // Maximum tribal — MAGA movement
      ENG: 5,
      // Maximum engagement — rallies, constant media
      EPS: 3,
      // Intuitionist — gut instinct, "I have a feeling"
      AES: 4
      // Fighter — "counterpuncher," combative, dominant
    },
    {
      name: "Clinton",
      party: "Democratic",
      year: 2016,
      MAT: 2,
      // Mildly redistributive — but Wall Street ties
      CD: 2,
      // Culturally open — "stronger together," diversity
      CU: 4,
      // Universalist — global engagement
      MOR: 2,
      // Progressive morality
      PRO: 4,
      // Proceduralist — institutional, rule-following
      COM: 4,
      // Compromiser — pragmatic, deal-oriented
      ZS: 2,
      // Positive-sum — "stronger together"
      ONT_H: 4,
      // Optimistic — "when they go low, we go high" (borrowed)
      ONT_S: 4,
      // Structuralist — policy proposals, systemic
      PF: 5,
      // Maximum partisan — career Democrat
      TRB: 3,
      // Moderate tribal — broad coalition
      ENG: 5,
      // Career politician — maximum engagement
      EPS: 0,
      // Empiricist — policy wonk, detailed plans
      AES: 0
      // Statesman — projected competence, gravitas
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
      // Redistributive — COVID spending, expanded safety net
      CD: 2,
      // Culturally open — but moderate brand
      CU: 4,
      // Pluralist/open — "America is back," multilateral (CU high=open)
      MOR: 4,
      // Fairly wide moral circle — empathy-centered (MOR high=universalist)
      PRO: 5,
      // Maximum proceduralist — "restore norms," rule of law (PRO high=rules-bound)
      COM: 5,
      // Maximum compromise — "I'll work with anyone"
      ZS: 2,
      // Positive-sum — unity, "soul of the nation"
      ONT_H: 4,
      // Optimistic — "America can be defined in one word: possibilities"
      ONT_S: 2,
      // System mostly working — defender of institutions (ONT_S low=stable)
      PF: 4,
      // Strong Democrat — but bipartisan rhetoric
      TRB: 2,
      // Low tribal — broad unity appeal, "president for all Americans"
      ENG: 4,
      // Engaged — but projected calm
      EPS: 1,
      // Institutionalist — "trust the institutions"
      AES: 2
      // Pastoral — "Scranton Joe," empathy, personal loss
    },
    {
      name: "Trump",
      party: "Republican",
      year: 2020,
      MAT: 3,
      // Same populist economics — but COVID checks
      CD: 5,
      // Maximum cultural closure — doubled down
      CU: 1,
      // Maximum assimilationist/closed (CU low=closed)
      MOR: 2,
      // Narrow moral circle — in-group focused (MOR low=particularist)
      PRO: 1,
      // Maximum anti-proceduralist — challenged election results (PRO low=outcome-first)
      COM: 1,
      // Never compromise — more combative than 2016
      ZS: 5,
      // Maximum zero-sum
      ONT_H: 2,
      // Pessimistic — "they're destroying your country"
      ONT_S: 4,
      // Deep structural critique — "drain the swamp" (ONT_S high=system broken)
      PF: 3,
      // Moderate partisan — MAGA over GOP
      TRB: 5,
      // Maximum tribal — MAGA intensified
      ENG: 5,
      // Maximum engagement
      EPS: 3,
      // Intuitionist — gut politics
      AES: 4
      // Fighter — "counterpuncher," grievance
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
      // Tax cuts + tariffs — pro-business signal, not populist economics
      CD: 5,
      // Maximum cultural closure — immigration, "poisoning the blood"
      CU: 1,
      // Maximum assimilationist/closed — America First extreme
      MOR: 2,
      // Narrow moral circle — in-group loyalty
      PRO: 2,
      // Anti-proceduralist but not maximally — still works through courts, Congress
      COM: 2,
      // Low compromise but deals on infrastructure, budget, criminal justice reform
      ZS: 4,
      // Zero-sum rhetoric but "economy was great under me" positive framing
      ONT_H: 2,
      // Pessimistic but "we'll be great again" implies some optimism
      ONT_S: 4,
      // Deep structural critique — "system is rigged"
      PF: 4,
      // Party IS now MAGA
      TRB: 5,
      // Maximum tribal
      ENG: 5,
      // Maximum engagement
      EPS: 3,
      // Intuitionist
      AES: 4
      // Fighter — "I am your retribution"
    },
    {
      name: "Harris",
      party: "Democratic",
      year: 2024,
      MAT: 1,
      // Maximum redistributive signal — "opportunity economy," price controls, housing
      CD: 1,
      // Maximum cultural openness — trans rights, pronouns, DEI
      CU: 5,
      // Maximum pluralist — diversity as strength, multilateral
      MOR: 5,
      // Maximum universalist — reproductive rights, global concern
      PRO: 4,
      // Proceduralist — prosecutor, "rule of law"
      COM: 4,
      // Compromiser — moderate positioning
      ZS: 2,
      // Positive-sum — "joyful warrior," optimism
      ONT_H: 4,
      // Optimistic — "what can be, unburdened by what has been"
      ONT_S: 3,
      // Mixed systemic critique
      PF: 5,
      // Maximum partisan — strong Democrat identity signaling
      TRB: 4,
      // Coalition tribal — identity politics framing
      ENG: 5,
      // Maximum engagement
      EPS: 1,
      // Institutionalist — prosecutor, DA, AG
      AES: 1
      // Technocrat — policy-focused
    }
  ]
};
var ELECTIONS = [
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

// src/historical/simulate.ts
import { writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
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
var CATEGORICAL_NODES = ["EPS", "AES"];
var ACTUAL_RESULTS = {
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
function computeAlignment(arch, cand, year) {
  let total = 0;
  for (const node of CONTINUOUS_NODES) {
    const tmpl = arch.nodes[node];
    if (!tmpl || tmpl.kind !== "continuous") continue;
    const ct = tmpl;
    const archPos = ct.pos;
    const candPos = cand[node];
    const sal = ct.sal;
    const posAlignment = 1 - Math.abs(archPos - candPos) / 4;
    total += sal * posAlignment;
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
    for (const election of ELECTIONS) {
      if (!willVote(engPos)) {
        votes[election.year] = "ABSTAIN";
        continue;
      }
      let bestCandidate = "";
      let bestScore = -Infinity;
      for (const cand of election.candidates) {
        const score = computeAlignment(arch, cand, election.year);
        if (score > bestScore) {
          bestScore = score;
          bestCandidate = cand.name;
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
      if (vote === "ABSTAIN") {
        abstentions++;
      } else {
        tallies[vote] = (tallies[vote] || 0) + 1;
      }
    }
    const totalVoters = results.length - abstentions;
    lines.push(`\u2500\u2500 ${year} \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500`);
    lines.push(`  Candidates: ${election.candidates.map((c) => `${c.name} (${c.party})`).join(" vs ")}`);
    const sorted = Object.entries(tallies).sort((a, b) => b[1] - a[1]);
    for (const [name, count] of sorted) {
      const pct = totalVoters > 0 ? (count / totalVoters * 100).toFixed(1) : "0.0";
      const bar = "\u2588".repeat(Math.round(count / 2));
      lines.push(`  ${name.padEnd(12)} ${String(count).padStart(3)} archetypes (${pct.padStart(5)}%) ${bar}`);
    }
    lines.push(`  ABSTAIN      ${String(abstentions).padStart(3)} archetypes`);
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
      if (vote !== "ABSTAIN") {
        totalVoters++;
        tallies[vote] = (tallies[vote] || 0) + 1;
      }
    }
    const sorted = Object.entries(tallies).sort((a, b) => b[1] - a[1]);
    const predWinner = sorted[0]?.[0] ?? "?";
    const predCount = sorted[0]?.[1] ?? 0;
    const predPct = totalVoters > 0 ? predCount / totalVoters * 100 : 0;
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
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const outDir = join(__dirname, "..", "..", "output");
  mkdirSync(outDir, { recursive: true });
  const csvPath = join(outDir, "historical_votes.csv");
  writeFileSync(csvPath, generateCSV(results), "utf-8");
  console.log(`Vote CSV written to: ${csvPath}`);
  const profilesPath = join(outDir, "candidate_profiles.csv");
  writeFileSync(profilesPath, generateCandidateProfilesCSV(), "utf-8");
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
function main2() {
  console.log("Running PRISM historical election simulation for validation...\n");
  const results = simulate();
  const checks = runValidation(results);
  printReport(checks);
  printCoalitionBreakdown(results);
}
main2();
