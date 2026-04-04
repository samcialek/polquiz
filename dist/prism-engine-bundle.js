"use strict";
var PrismEngine = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // src/browser/index.ts
  var index_exports = {};
  __export(index_exports, {
    attachToExistingQuiz: () => attachToExistingQuiz,
    canGoBack: () => canGoBack,
    getArchetypeCount: () => getArchetypeCount,
    getNextQuestion: () => getNextQuestion,
    getProgress: () => getProgress,
    getQuestionDef: () => getQuestionDef,
    getQuestionIds: () => getQuestionIds,
    getRespondentState: () => getRespondentState,
    getResults: () => getResults,
    goBack: () => goBack,
    initQuiz: () => initQuiz,
    isComplete: () => isComplete,
    mountQuiz: () => mountQuiz,
    submitAnswer: () => submitAnswer
  });

  // src/config/archetypes.ts
  var ARCHETYPES = [
    {
      id: "001",
      name: "Rawlsian Reformer",
      tier: "T1",
      prior: 1 / 112,
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
        EPS: { kind: "categorical", probs: [0.25, 0.58, 0.05, 0.03, 0.06, 0.03], sal: 2, antiCats: [5] },
        AES: { kind: "categorical", probs: [0.6, 0.1, 0.14, 0.06, 0.04, 0.06], sal: 2, antiCats: [4] }
      }
    },
    {
      id: "002",
      name: "Independent Social Democrat",
      tier: "T1",
      prior: 1 / 112,
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
        EPS: { kind: "categorical", probs: [0.25, 0.58, 0.05, 0.03, 0.06, 0.03], sal: 1, antiCats: [5] },
        AES: { kind: "categorical", probs: [0.6, 0.1, 0.14, 0.06, 0.04, 0.06], sal: 1, antiCats: [4] }
      }
    },
    {
      id: "003",
      name: "Consensus Redistributionist",
      tier: "T1",
      prior: 1 / 112,
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
        EPS: { kind: "categorical", probs: [0.62, 0.24, 0.03, 0.04, 0.03, 0.04], sal: 1, antiCats: [2, 3, 5] },
        AES: { kind: "categorical", probs: [0.08, 0.64, 0.04, 0.04, 0.03, 0.17], sal: 1, antiCats: [4] }
      }
    },
    {
      id: "004",
      name: "Labor Reformer",
      tier: "T1",
      prior: 1 / 112,
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
        EPS: { kind: "categorical", probs: [0.25, 0.58, 0.05, 0.03, 0.06, 0.03], sal: 1, antiCats: [5] },
        AES: { kind: "categorical", probs: [0.04, 0.03, 0.04, 0.18, 0.63, 0.08], sal: 1, antiCats: [0, 1] }
      }
    },
    {
      id: "005",
      name: "Pluralist Structuralist",
      tier: "T1",
      prior: 1 / 112,
      nodes: {
        MAT: { kind: "continuous", pos: 2, sal: 2 },
        CD: { kind: "continuous", pos: 2, sal: 1 },
        CU: { kind: "continuous", pos: 4, sal: 2 },
        MOR: { kind: "continuous", pos: 4, sal: 2 },
        PRO: { kind: "continuous", pos: 5, sal: 2 },
        COM: { kind: "continuous", pos: 4, sal: 1 },
        ZS: { kind: "continuous", pos: 4, sal: 2 },
        ONT_H: { kind: "continuous", pos: 4, sal: 1 },
        ONT_S: { kind: "continuous", pos: 1, sal: 2 },
        PF: { kind: "continuous", pos: 2, sal: 1 },
        TRB: { kind: "continuous", pos: 2, sal: 1 },
        ENG: { kind: "continuous", pos: 4, sal: 1 },
        EPS: { kind: "categorical", probs: [0.25, 0.58, 0.05, 0.03, 0.06, 0.03], sal: 1 },
        AES: { kind: "categorical", probs: [0.6, 0.1, 0.14, 0.06, 0.04, 0.06], sal: 1 }
      }
    },
    {
      id: "006",
      name: "Fairness Pragmatist",
      tier: "T1",
      prior: 1 / 112,
      nodes: {
        MAT: { kind: "continuous", pos: 2, sal: 2 },
        CD: { kind: "continuous", pos: 2, sal: 1 },
        CU: { kind: "continuous", pos: 4, sal: 1 },
        MOR: { kind: "continuous", pos: 3, sal: 1 },
        PRO: { kind: "continuous", pos: 4, sal: 2 },
        COM: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
        ZS: { kind: "continuous", pos: 2, sal: 2 },
        // raised sal 1→2 (discriminator vs Social Stabilizer)
        ONT_H: { kind: "continuous", pos: 4, sal: 1 },
        ONT_S: { kind: "continuous", pos: 3, sal: 2 },
        // raised sal 1→2 (discriminator vs Social Stabilizer)
        PF: { kind: "continuous", pos: 2, sal: 1 },
        TRB: { kind: "continuous", pos: 2, sal: 1 },
        ENG: { kind: "continuous", pos: 4, sal: 1 },
        EPS: { kind: "categorical", probs: [0.62, 0.24, 0.03, 0.04, 0.03, 0.04], sal: 1, antiCats: [2, 3, 5] },
        AES: { kind: "categorical", probs: [0.6, 0.2, 0.04, 0.06, 0.04, 0.06], sal: 1, antiCats: [4] }
      }
    },
    {
      id: "007",
      name: "Solidarist Reformer",
      tier: "T1",
      prior: 1 / 112,
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
        EPS: { kind: "categorical", probs: [0.04, 0.08, 0.6, 0.16, 0.08, 0.04], sal: 1, antiCats: [0, 5] },
        AES: { kind: "categorical", probs: [0.6, 0.1, 0.14, 0.06, 0.04, 0.06], sal: 1, antiCats: [4] }
      }
    },
    {
      id: "008",
      name: "Procedural Redistributionist",
      tier: "T1",
      prior: 1 / 112,
      nodes: {
        MAT: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
        CD: { kind: "continuous", pos: 2, sal: 1 },
        CU: { kind: "continuous", pos: 4, sal: 1 },
        MOR: { kind: "continuous", pos: 4, sal: 2 },
        PRO: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
        COM: { kind: "continuous", pos: 3, sal: 1 },
        ZS: { kind: "continuous", pos: 2, sal: 1 },
        ONT_H: { kind: "continuous", pos: 2, sal: 1 },
        ONT_S: { kind: "continuous", pos: 3, sal: 1 },
        PF: { kind: "continuous", pos: 2, sal: 1 },
        TRB: { kind: "continuous", pos: 2, sal: 1 },
        ENG: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
        EPS: { kind: "categorical", probs: [0.25, 0.58, 0.05, 0.03, 0.06, 0.03], sal: 1, antiCats: [5] },
        AES: { kind: "categorical", probs: [0.6, 0.1, 0.14, 0.06, 0.04, 0.06], sal: 1, antiCats: [4] }
      }
    },
    {
      id: "010",
      name: "Bread-and-Butter Progressive",
      tier: "T1",
      prior: 1 / 112,
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
        EPS: { kind: "categorical", probs: [0.25, 0.58, 0.05, 0.03, 0.06, 0.03], sal: 1, antiCats: [5] },
        AES: { kind: "categorical", probs: [0.6, 0.1, 0.14, 0.06, 0.04, 0.06], sal: 1, antiCats: [4] }
      }
    },
    {
      id: "011",
      name: "Jacobin Egalitarian",
      tier: "T1",
      prior: 1 / 112,
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
        PF: { kind: "continuous", pos: 2, sal: 2 },
        TRB: { kind: "continuous", pos: 3, sal: 2 },
        ENG: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
        EPS: { kind: "categorical", probs: [0.05, 0.05, 0.08, 0.58, 0.19, 0.05], sal: 1, antiCats: [0, 5] },
        AES: { kind: "categorical", probs: [0.04, 0.03, 0.04, 0.18, 0.63, 0.08], sal: 1, antiCats: [0, 1] }
      }
    },
    {
      id: "012",
      name: "Class-War Leftist",
      tier: "T1",
      prior: 1 / 112,
      nodes: {
        MAT: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
        CD: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
        CU: { kind: "continuous", pos: 2, sal: 2 },
        MOR: { kind: "continuous", pos: 3, sal: 2 },
        PRO: { kind: "continuous", pos: 2, sal: 1 },
        COM: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
        ZS: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
        ONT_H: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
        ONT_S: { kind: "continuous", pos: 2, sal: 2 },
        PF: { kind: "continuous", pos: 2, sal: 1 },
        TRB: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
        ENG: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
        EPS: { kind: "categorical", probs: [0.08, 0.08, 0.08, 0.2, 0.5, 0.06], sal: 1, antiCats: [2, 5] },
        AES: { kind: "categorical", probs: [0.04, 0.03, 0.04, 0.18, 0.63, 0.08], sal: 2, antiCats: [0, 1] }
      }
    },
    {
      id: "013",
      name: "Radical Leveler",
      tier: "T1",
      prior: 1 / 112,
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
        PF: { kind: "continuous", pos: 2, sal: 1 },
        TRB: { kind: "continuous", pos: 3, sal: 1 },
        ENG: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
        EPS: { kind: "categorical", probs: [0.08, 0.08, 0.08, 0.2, 0.5, 0.06], sal: 1, antiCats: [2, 5] },
        AES: { kind: "categorical", probs: [0.04, 0.03, 0.04, 0.18, 0.63, 0.08], sal: 2, antiCats: [0, 1] }
      }
    },
    {
      id: "014",
      name: "Activist Progressive",
      tier: "T1",
      prior: 1 / 112,
      nodes: {
        MAT: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
        CD: { kind: "continuous", pos: 2, sal: 2 },
        CU: { kind: "continuous", pos: 4, sal: 1 },
        MOR: { kind: "continuous", pos: 4, sal: 1 },
        PRO: { kind: "continuous", pos: 2, sal: 1 },
        COM: { kind: "continuous", pos: 3, sal: 1 },
        ZS: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
        ONT_H: { kind: "continuous", pos: 3, sal: 1 },
        ONT_S: { kind: "continuous", pos: 2, sal: 1 },
        PF: { kind: "continuous", pos: 2, sal: 1 },
        TRB: { kind: "continuous", pos: 3, sal: 1 },
        ENG: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
        EPS: { kind: "categorical", probs: [0.08, 0.08, 0.08, 0.2, 0.5, 0.06], sal: 1, antiCats: [2, 5] },
        AES: { kind: "categorical", probs: [0.06, 0.08, 0.05, 0.06, 0.08, 0.67], sal: 1 }
      }
    },
    {
      id: "015",
      name: "Moral Firebrand",
      tier: "T1",
      prior: 1 / 112,
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
        PF: { kind: "continuous", pos: 2, sal: 2, anti: "low" },
        TRB: { kind: "continuous", pos: 4, sal: 2 },
        ENG: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
        EPS: { kind: "categorical", probs: [0.05, 0.05, 0.08, 0.58, 0.19, 0.05], sal: 2, antiCats: [0, 5] },
        AES: { kind: "categorical", probs: [0.06, 0.08, 0.05, 0.06, 0.08, 0.67], sal: 2 }
      }
    },
    {
      id: "016",
      name: "Insurgent Equalizer",
      tier: "T1",
      prior: 1 / 112,
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
        PF: { kind: "continuous", pos: 2, sal: 1 },
        TRB: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
        ENG: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
        EPS: { kind: "categorical", probs: [0.08, 0.08, 0.08, 0.2, 0.5, 0.06], sal: 1, antiCats: [2, 5] },
        AES: { kind: "categorical", probs: [0.04, 0.03, 0.04, 0.18, 0.63, 0.08], sal: 2, antiCats: [0, 1] }
      }
    },
    {
      id: "017",
      name: "Uncompromising Redistributionist",
      tier: "T1",
      prior: 1 / 112,
      nodes: {
        MAT: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
        CD: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
        CU: { kind: "continuous", pos: 4, sal: 1 },
        MOR: { kind: "continuous", pos: 4, sal: 1 },
        PRO: { kind: "continuous", pos: 2, sal: 1 },
        COM: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
        ZS: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
        ONT_H: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
        ONT_S: { kind: "continuous", pos: 2, sal: 1 },
        PF: { kind: "continuous", pos: 2, sal: 1 },
        TRB: { kind: "continuous", pos: 3, sal: 1 },
        ENG: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
        EPS: { kind: "categorical", probs: [0.08, 0.08, 0.08, 0.2, 0.5, 0.06], sal: 1, antiCats: [2, 5] },
        AES: { kind: "categorical", probs: [0.04, 0.03, 0.04, 0.18, 0.63, 0.08], sal: 1, antiCats: [0, 1] }
      }
    },
    // 019 Anarchist Mutualist — MERGED into 020 Grassroots Autonomist
    {
      id: "019",
      name: "Anarchist Mutualist",
      tier: "T1",
      prior: 0,
      // DEACTIVATED — merged into 020
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
        PF: { kind: "continuous", pos: 1, sal: 2, anti: "low" },
        TRB: { kind: "continuous", pos: 2, sal: 2 },
        ENG: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
        EPS: { kind: "categorical", probs: [0.08, 0.08, 0.08, 0.2, 0.5, 0.06], sal: 2, antiCats: [2, 5] },
        AES: { kind: "categorical", probs: [0.06, 0.05, 0.62, 0.17, 0.03, 0.07], sal: 2 }
      }
    },
    {
      // Merged from 019 Anarchist Mutualist + 020 Horizontalist Dissenter
      // "Grassroots Autonomist" — anti-hierarchical, anti-institutional, bottom-up direct action
      id: "020",
      name: "Grassroots Autonomist",
      tier: "T1",
      prior: 1 / 112,
      nodes: {
        MAT: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
        CD: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
        CU: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
        MOR: { kind: "continuous", pos: 4, sal: 2 },
        PRO: { kind: "continuous", pos: 1, sal: 3, anti: "high" },
        // kept 019's stronger anti-proceduralism
        COM: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
        // kept 019's uncompromising stance
        ZS: { kind: "continuous", pos: 2, sal: 2, anti: "high" },
        // split the difference (1+3)/2
        ONT_H: { kind: "continuous", pos: 4, sal: 2 },
        // 019's optimism
        ONT_S: { kind: "continuous", pos: 2, sal: 2 },
        PF: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
        // kept 020's stronger anti-partisan
        TRB: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
        // kept 020's anti-tribal
        ENG: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
        EPS: { kind: "categorical", probs: [0.08, 0.08, 0.08, 0.2, 0.5, 0.06], sal: 2, antiCats: [2, 5] },
        AES: { kind: "categorical", probs: [0.05, 0.05, 0.4, 0.38, 0.04, 0.08], sal: 2 }
        // blend pastoral+authentic
      }
    },
    {
      // Merged from 021 Kantian Cosmopolitan + 023 Rights Cosmopolitan + 025 World-Minded Reformer
      // "Principled Cosmopolitan" — universal moral principles, cross-border ethics, anti-tribal
      id: "021",
      name: "Principled Cosmopolitan",
      tier: "T1",
      prior: 1 / 112,
      nodes: {
        MAT: { kind: "continuous", pos: 2, sal: 2 },
        CD: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
        CU: { kind: "continuous", pos: 5, sal: 3, anti: "low" },
        // cosmopolitanism is core
        MOR: { kind: "continuous", pos: 5, sal: 3, anti: "low" },
        // moral universalism is core
        PRO: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
        // procedural (from 023/025)
        COM: { kind: "continuous", pos: 2, sal: 2 },
        // leans uncompromising (from 023)
        ZS: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
        ONT_H: { kind: "continuous", pos: 4, sal: 2 },
        ONT_S: { kind: "continuous", pos: 3, sal: 2 },
        // blend of 3/3/4
        PF: { kind: "continuous", pos: 2, sal: 2 },
        TRB: { kind: "continuous", pos: 1, sal: 3, anti: "high" },
        // anti-tribalism is core
        ENG: { kind: "continuous", pos: 4, sal: 1 },
        EPS: { kind: "categorical", probs: [0.25, 0.58, 0.05, 0.03, 0.06, 0.03], sal: 1, antiCats: [5] },
        AES: { kind: "categorical", probs: [0.06, 0.18, 0.05, 0.06, 0.08, 0.57], sal: 2 }
      }
    },
    {
      id: "022",
      name: "Pluralist Universalist",
      tier: "T1",
      prior: 1 / 112,
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
        PF: { kind: "continuous", pos: 2, sal: 1 },
        TRB: { kind: "continuous", pos: 1, sal: 2 },
        ENG: { kind: "continuous", pos: 4, sal: 2 },
        EPS: { kind: "categorical", probs: [0.25, 0.58, 0.05, 0.03, 0.06, 0.03], sal: 1 },
        AES: { kind: "categorical", probs: [0.06, 0.18, 0.05, 0.06, 0.08, 0.57], sal: 1 }
      }
    },
    {
      // 023 Rights Cosmopolitan — MERGED into 021 Principled Cosmopolitan
      id: "023",
      name: "Rights Cosmopolitan",
      tier: "T1",
      prior: 0,
      // DEACTIVATED
      nodes: {
        MAT: { kind: "continuous", pos: 2, sal: 2, anti: "low" },
        // added anti:low — not redistributionist
        CD: { kind: "continuous", pos: 1, sal: 3, anti: "high" },
        CU: { kind: "continuous", pos: 4, sal: 3, anti: "low" },
        MOR: { kind: "continuous", pos: 5, sal: 3, anti: "low" },
        PRO: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
        COM: { kind: "continuous", pos: 1, sal: 3, anti: "high" },
        ZS: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
        ONT_H: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
        // added anti:low — strongly optimistic
        ONT_S: { kind: "continuous", pos: 3, sal: 1 },
        PF: { kind: "continuous", pos: 2, sal: 2 },
        TRB: { kind: "continuous", pos: 1, sal: 3, anti: "high" },
        // raised sal 2→3
        ENG: { kind: "continuous", pos: 3, sal: 2 },
        // raised sal 1→2 — low engagement is distinctive
        EPS: { kind: "categorical", probs: [0.25, 0.58, 0.05, 0.03, 0.06, 0.03], sal: 1, antiCats: [5] },
        AES: { kind: "categorical", probs: [0.06, 0.08, 0.05, 0.06, 0.08, 0.67], sal: 2 }
        // raised sal 1→2
      }
    },
    {
      id: "024",
      name: "Ethical Internationalist",
      tier: "T1",
      prior: 1 / 112,
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
        EPS: { kind: "categorical", probs: [0.25, 0.58, 0.05, 0.03, 0.06, 0.03], sal: 1, antiCats: [5] },
        AES: { kind: "categorical", probs: [0.06, 0.18, 0.05, 0.06, 0.08, 0.57], sal: 2 }
      }
    },
    {
      // 025 World-Minded Reformer — MERGED into 021 Principled Cosmopolitan
      id: "025",
      name: "World-Minded Reformer",
      tier: "T1",
      prior: 0,
      // DEACTIVATED
      nodes: {
        MAT: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
        CD: { kind: "continuous", pos: 2, sal: 2 },
        CU: { kind: "continuous", pos: 5, sal: 3, anti: "low" },
        MOR: { kind: "continuous", pos: 5, sal: 3, anti: "low" },
        PRO: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
        COM: { kind: "continuous", pos: 3, sal: 2 },
        ZS: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
        ONT_H: { kind: "continuous", pos: 4, sal: 2 },
        ONT_S: { kind: "continuous", pos: 2, sal: 3, anti: "high" },
        // raised sal 2→3: system critique is core
        PF: { kind: "continuous", pos: 2, sal: 2 },
        TRB: { kind: "continuous", pos: 1, sal: 3, anti: "high" },
        ENG: { kind: "continuous", pos: 4, sal: 2 },
        EPS: { kind: "categorical", probs: [0.25, 0.58, 0.05, 0.03, 0.06, 0.03], sal: 2, antiCats: [5] },
        // raised sal 1→2
        AES: { kind: "categorical", probs: [0.08, 0.64, 0.04, 0.04, 0.03, 0.17], sal: 2, antiCats: [4] }
      }
    },
    {
      id: "026",
      name: "Cosmopolitan Pragmatist",
      tier: "T1",
      prior: 1 / 112,
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
        EPS: { kind: "categorical", probs: [0.25, 0.58, 0.05, 0.03, 0.06, 0.03], sal: 1, antiCats: [5] },
        AES: { kind: "categorical", probs: [0.06, 0.18, 0.05, 0.06, 0.08, 0.57], sal: 1 }
      }
    },
    {
      id: "027",
      name: "Popperian Liberal",
      tier: "T1",
      prior: 1 / 112,
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
        AES: { kind: "categorical", probs: [0.6, 0.1, 0.14, 0.06, 0.04, 0.06], sal: 1, antiCats: [4] }
      }
    },
    {
      id: "028",
      name: "Global Caretaker",
      tier: "T1",
      prior: 1 / 112,
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
        EPS: { kind: "categorical", probs: [0.25, 0.58, 0.05, 0.03, 0.06, 0.03], sal: 1, antiCats: [5] },
        AES: { kind: "categorical", probs: [0.06, 0.05, 0.62, 0.17, 0.03, 0.07], sal: 1 }
      }
    },
    {
      id: "029",
      name: "Liberationist Progressive",
      tier: "T1",
      prior: 1 / 112,
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
        EPS: { kind: "categorical", probs: [0.05, 0.05, 0.08, 0.58, 0.19, 0.05], sal: 1, antiCats: [0, 5] },
        AES: { kind: "categorical", probs: [0.06, 0.18, 0.05, 0.06, 0.08, 0.57], sal: 2 }
      }
    },
    {
      id: "031",
      name: "Planetary Steward",
      tier: "T1",
      prior: 1 / 112,
      nodes: {
        MAT: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
        CD: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
        CU: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
        MOR: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
        PRO: { kind: "continuous", pos: 3, sal: 1 },
        COM: { kind: "continuous", pos: 4, sal: 1 },
        ZS: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
        ONT_H: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
        ONT_S: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
        PF: { kind: "continuous", pos: 2, sal: 1 },
        TRB: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
        ENG: { kind: "continuous", pos: 4, sal: 2 },
        EPS: { kind: "categorical", probs: [0.62, 0.24, 0.03, 0.04, 0.03, 0.04], sal: 1, antiCats: [2, 3, 5] },
        AES: { kind: "categorical", probs: [0.06, 0.05, 0.62, 0.17, 0.03, 0.07], sal: 2 }
      }
    },
    {
      id: "032",
      name: "Hamiltonian Technocrat",
      tier: "T1",
      prior: 1 / 112,
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
      prior: 1 / 112,
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
        PF: { kind: "continuous", pos: 3, sal: 1, anti: "low" },
        TRB: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
        ENG: { kind: "continuous", pos: 4, sal: 2 },
        EPS: { kind: "categorical", probs: [0.62, 0.24, 0.03, 0.04, 0.03, 0.04], sal: 3, antiCats: [2, 3, 5] },
        AES: { kind: "categorical", probs: [0.06, 0.18, 0.05, 0.06, 0.08, 0.57], sal: 3 }
      }
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
    // PF: { kind: "continuous", pos: 3, sal: 0 },
    // TRB: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
    // ENG: { kind: "continuous", pos: 3, sal: 1 },
    // EPS: { kind: "categorical", probs: [0.62, 0.24, 0.03, 0.04, 0.03, 0.04], sal: 1, antiCats: [2, 3, 5] },
    // AES: { kind: "categorical", probs: [0.08, 0.64, 0.04, 0.04, 0.03, 0.17], sal: 1, antiCats: [4] },
    // }
    // },
    {
      id: "035",
      name: "Administrative Liberal",
      tier: "T1",
      prior: 1 / 112,
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
      prior: 1 / 112,
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
        PF: { kind: "continuous", pos: 3, sal: 2 },
        TRB: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
        ENG: { kind: "continuous", pos: 3, sal: 2 },
        EPS: { kind: "categorical", probs: [0.62, 0.24, 0.03, 0.04, 0.03, 0.04], sal: 2, antiCats: [2, 3, 5] },
        AES: { kind: "categorical", probs: [0.08, 0.64, 0.04, 0.04, 0.03, 0.17], sal: 2, antiCats: [4] }
      }
    },
    {
      id: "037",
      name: "Fabian Modernizer",
      tier: "T1",
      prior: 1 / 112,
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
        PF: { kind: "continuous", pos: 2, sal: 1 },
        TRB: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
        ENG: { kind: "continuous", pos: 3, sal: 1 },
        EPS: { kind: "categorical", probs: [0.25, 0.58, 0.05, 0.03, 0.06, 0.03], sal: 2, antiCats: [5] },
        AES: { kind: "categorical", probs: [0.08, 0.64, 0.04, 0.04, 0.03, 0.17], sal: 2, antiCats: [4] }
      }
    },
    {
      id: "039",
      name: "Data-Driven Moderate",
      tier: "T1",
      prior: 1 / 112,
      nodes: {
        MAT: { kind: "continuous", pos: 3, sal: 0 },
        CD: { kind: "continuous", pos: 2, sal: 1 },
        CU: { kind: "continuous", pos: 2, sal: 2, anti: "high" },
        MOR: { kind: "continuous", pos: 3, sal: 1 },
        PRO: { kind: "continuous", pos: 4, sal: 2, anti: "low" },
        COM: { kind: "continuous", pos: 4, sal: 2 },
        ZS: { kind: "continuous", pos: 2, sal: 1 },
        ONT_H: { kind: "continuous", pos: 4, sal: 1, anti: "low" },
        ONT_S: { kind: "continuous", pos: 4, sal: 2 },
        PF: { kind: "continuous", pos: 3, sal: 0 },
        TRB: { kind: "continuous", pos: 2, sal: 1, anti: "high" },
        ENG: { kind: "continuous", pos: 3, sal: 1 },
        EPS: { kind: "categorical", probs: [0.62, 0.24, 0.03, 0.04, 0.03, 0.04], sal: 3, antiCats: [2, 3, 5] },
        AES: { kind: "categorical", probs: [0.08, 0.64, 0.04, 0.04, 0.03, 0.17], sal: 3, antiCats: [4] }
      }
    },
    {
      id: "040",
      name: "Reform Engineer",
      tier: "T1",
      prior: 1 / 112,
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
        EPS: { kind: "categorical", probs: [0.62, 0.24, 0.03, 0.04, 0.03, 0.04], sal: 2, antiCats: [2, 3, 5] },
        AES: { kind: "categorical", probs: [0.08, 0.64, 0.04, 0.04, 0.03, 0.17], sal: 2, antiCats: [4] }
      }
    },
    {
      id: "042",
      name: "Localist Progressive",
      tier: "T1",
      prior: 1 / 112,
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
        EPS: { kind: "categorical", probs: [0.04, 0.08, 0.6, 0.16, 0.08, 0.04], sal: 1, antiCats: [0, 5] },
        AES: { kind: "categorical", probs: [0.06, 0.05, 0.62, 0.17, 0.03, 0.07], sal: 1 }
      }
    },
    {
      id: "043",
      name: "Quiet Egalitarian",
      tier: "T1",
      prior: 1 / 112,
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
        EPS: { kind: "categorical", probs: [0.04, 0.08, 0.6, 0.16, 0.08, 0.04], sal: 1, antiCats: [0, 5] },
        AES: { kind: "categorical", probs: [0.06, 0.05, 0.62, 0.17, 0.03, 0.07], sal: 2 }
      }
    },
    {
      id: "045",
      name: "Rooted Social Reformer",
      tier: "T1",
      prior: 1 / 112,
      nodes: {
        MAT: { kind: "continuous", pos: 1, sal: 2 },
        CD: { kind: "continuous", pos: 4, sal: 2 },
        CU: { kind: "continuous", pos: 2, sal: 2 },
        MOR: { kind: "continuous", pos: 3, sal: 2 },
        PRO: { kind: "continuous", pos: 4, sal: 2 },
        COM: { kind: "continuous", pos: 5, sal: 2 },
        ZS: { kind: "continuous", pos: 2, sal: 2 },
        ONT_H: { kind: "continuous", pos: 3, sal: 2 },
        ONT_S: { kind: "continuous", pos: 3, sal: 1 },
        PF: { kind: "continuous", pos: 2, sal: 2 },
        TRB: { kind: "continuous", pos: 2, sal: 2 },
        ENG: { kind: "continuous", pos: 3, sal: 1 },
        EPS: { kind: "categorical", probs: [0.14, 0.33, 0.33, 0.1, 0.07, 0.04], sal: 1 },
        AES: { kind: "categorical", probs: [0.06, 0.05, 0.62, 0.17, 0.03, 0.07], sal: 2 }
      }
    },
    {
      id: "046",
      name: "Pastoral Leftist",
      tier: "T1",
      prior: 1 / 112,
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
        EPS: { kind: "categorical", probs: [0.04, 0.08, 0.6, 0.16, 0.08, 0.04], sal: 1, antiCats: [0, 5] },
        AES: { kind: "categorical", probs: [0.06, 0.05, 0.62, 0.17, 0.03, 0.07], sal: 3 }
      }
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
    // PF: { kind: "continuous", pos: 2, sal: 1 },
    // TRB: { kind: "continuous", pos: 2, sal: 1 },
    // ENG: { kind: "continuous", pos: 4, sal: 1 },
    // EPS: { kind: "categorical", probs: [0.04, 0.08, 0.60, 0.16, 0.08, 0.04], sal: 1, antiCats: [0, 5] },
    // AES: { kind: "categorical", probs: [0.60, 0.10, 0.14, 0.06, 0.04, 0.06], sal: 1, antiCats: [4] },
    // }
    // },
    {
      id: "048",
      name: "Solidaristic Localist",
      tier: "T1",
      prior: 1 / 112,
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
        EPS: { kind: "categorical", probs: [0.04, 0.08, 0.6, 0.16, 0.08, 0.04], sal: 1, antiCats: [0, 5] },
        AES: { kind: "categorical", probs: [0.06, 0.05, 0.62, 0.17, 0.03, 0.07], sal: 2 }
      }
    },
    {
      id: "049",
      name: "Moral Egalitarian",
      tier: "T1",
      prior: 1 / 112,
      nodes: {
        MAT: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
        CD: { kind: "continuous", pos: 4, sal: 1 },
        CU: { kind: "continuous", pos: 2, sal: 1 },
        MOR: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
        PRO: { kind: "continuous", pos: 4, sal: 1 },
        COM: { kind: "continuous", pos: 3, sal: 1 },
        ZS: { kind: "continuous", pos: 2, sal: 1 },
        ONT_H: { kind: "continuous", pos: 3, sal: 1 },
        ONT_S: { kind: "continuous", pos: 2, sal: 1 },
        PF: { kind: "continuous", pos: 2, sal: 1 },
        TRB: { kind: "continuous", pos: 2, sal: 1 },
        ENG: { kind: "continuous", pos: 3, sal: 1 },
        EPS: { kind: "categorical", probs: [0.04, 0.08, 0.6, 0.16, 0.08, 0.04], sal: 1, antiCats: [0, 5] },
        AES: { kind: "categorical", probs: [0.06, 0.05, 0.62, 0.17, 0.03, 0.07], sal: 1 }
      }
    },
    {
      id: "050",
      name: "Traditionalist Moralist",
      tier: "T1",
      prior: 1 / 112,
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
        EPS: { kind: "categorical", probs: [0.04, 0.08, 0.6, 0.16, 0.08, 0.04], sal: 1, antiCats: [0, 5] },
        AES: { kind: "categorical", probs: [0.06, 0.05, 0.62, 0.17, 0.03, 0.07], sal: 1 }
      }
    },
    {
      id: "051",
      name: "Systemic Redistributionist",
      tier: "T1",
      prior: 1 / 112,
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
        PF: { kind: "continuous", pos: 2, sal: 1 },
        TRB: { kind: "continuous", pos: 2, sal: 1 },
        ENG: { kind: "continuous", pos: 3, sal: 1 },
        EPS: { kind: "categorical", probs: [0.04, 0.08, 0.6, 0.16, 0.08, 0.04], sal: 1, antiCats: [0, 5] },
        AES: { kind: "categorical", probs: [0.06, 0.05, 0.62, 0.17, 0.03, 0.07], sal: 1 }
      }
    },
    {
      id: "053",
      name: "Consensus Builder",
      tier: "T1",
      prior: 1 / 112,
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
        PF: { kind: "continuous", pos: 3, sal: 1 },
        TRB: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
        ENG: { kind: "continuous", pos: 3, sal: 1 },
        EPS: { kind: "categorical", probs: [0.25, 0.58, 0.05, 0.03, 0.06, 0.03], sal: 2, antiCats: [5] },
        AES: { kind: "categorical", probs: [0.6, 0.2, 0.04, 0.06, 0.04, 0.06], sal: 1, antiCats: [4] }
      }
    },
    {
      id: "054",
      name: "Arbiter Moderate",
      tier: "T1",
      prior: 1 / 112,
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
        ONT_S: { kind: "continuous", pos: 4, sal: 2 },
        PF: { kind: "continuous", pos: 3, sal: 1 },
        TRB: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
        ENG: { kind: "continuous", pos: 3, sal: 2, anti: "high" },
        EPS: { kind: "categorical", probs: [0.25, 0.58, 0.05, 0.03, 0.06, 0.03], sal: 2, antiCats: [5] },
        AES: { kind: "categorical", probs: [0.08, 0.64, 0.04, 0.04, 0.03, 0.17], sal: 2, antiCats: [4] }
      }
    },
    {
      id: "056",
      name: "Institutional Centrist",
      tier: "T1",
      prior: 1 / 112,
      nodes: {
        MAT: { kind: "continuous", pos: 2, sal: 2 },
        CD: { kind: "continuous", pos: 4, sal: 2 },
        CU: { kind: "continuous", pos: 5, sal: 3, anti: "low" },
        MOR: { kind: "continuous", pos: 4, sal: 3 },
        PRO: { kind: "continuous", pos: 3, sal: 2, anti: "low" },
        COM: { kind: "continuous", pos: 4, sal: 2 },
        ZS: { kind: "continuous", pos: 2, sal: 3, anti: "high" },
        ONT_H: { kind: "continuous", pos: 4, sal: 2 },
        ONT_S: { kind: "continuous", pos: 4, sal: 3, anti: "low" },
        PF: { kind: "continuous", pos: 3, sal: 2 },
        TRB: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
        ENG: { kind: "continuous", pos: 4, sal: 2 },
        EPS: { kind: "categorical", probs: [0.25, 0.58, 0.05, 0.03, 0.06, 0.03], sal: 2, antiCats: [5] },
        AES: { kind: "categorical", probs: [0.6, 0.2, 0.04, 0.06, 0.04, 0.06], sal: 1, antiCats: [4] }
      }
    },
    {
      id: "057",
      name: "Temperate Pluralist",
      tier: "T1",
      prior: 1 / 112,
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
        PF: { kind: "continuous", pos: 3, sal: 1 },
        TRB: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
        ENG: { kind: "continuous", pos: 2, sal: 2 },
        EPS: { kind: "categorical", probs: [0.25, 0.58, 0.05, 0.03, 0.06, 0.03], sal: 1, antiCats: [5] },
        AES: { kind: "categorical", probs: [0.6, 0.2, 0.04, 0.06, 0.04, 0.06], sal: 1, antiCats: [4] }
      }
    },
    {
      id: "059",
      name: "Public-Minded Moderate",
      tier: "T1",
      prior: 1 / 112,
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
        PF: { kind: "continuous", pos: 3, sal: 0 },
        TRB: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
        ENG: { kind: "continuous", pos: 3, sal: 2 },
        EPS: { kind: "categorical", probs: [0.25, 0.58, 0.05, 0.03, 0.06, 0.03], sal: 1, antiCats: [5] },
        AES: { kind: "categorical", probs: [0.6, 0.2, 0.04, 0.06, 0.04, 0.06], sal: 1, antiCats: [4] }
      }
    },
    {
      id: "060",
      name: "Hinge Citizen",
      tier: "T1",
      prior: 1 / 112,
      nodes: {
        MAT: { kind: "continuous", pos: 3, sal: 2 },
        CD: { kind: "continuous", pos: 3, sal: 1 },
        CU: { kind: "continuous", pos: 2, sal: 2 },
        MOR: { kind: "continuous", pos: 3, sal: 2 },
        PRO: { kind: "continuous", pos: 4, sal: 2 },
        COM: { kind: "continuous", pos: 3, sal: 2 },
        ZS: { kind: "continuous", pos: 2, sal: 2 },
        ONT_H: { kind: "continuous", pos: 4, sal: 2 },
        ONT_S: { kind: "continuous", pos: 2, sal: 2 },
        PF: { kind: "continuous", pos: 4, sal: 2 },
        TRB: { kind: "continuous", pos: 1, sal: 2 },
        ENG: { kind: "continuous", pos: 3, sal: 2 },
        EPS: { kind: "categorical", probs: [0.14, 0.38, 0.33, 0.04, 0.07, 0.04], sal: 1 },
        AES: { kind: "categorical", probs: [0.6, 0.2, 0.04, 0.06, 0.04, 0.06], sal: 1 }
      }
    },
    {
      id: "061",
      name: "Millian Liberal",
      tier: "T1",
      prior: 1 / 112,
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
        PF: { kind: "continuous", pos: 3, sal: 2 },
        TRB: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
        ENG: { kind: "continuous", pos: 3, sal: 2, anti: "high" },
        EPS: { kind: "categorical", probs: [0.08, 0.08, 0.08, 0.1, 0.6, 0.06], sal: 1, antiCats: [2, 5] },
        AES: { kind: "categorical", probs: [0.08, 0.64, 0.04, 0.04, 0.03, 0.17], sal: 1, antiCats: [4] }
      }
    },
    {
      id: "062",
      name: "Meritocratic Liberal",
      tier: "T1",
      prior: 1 / 112,
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
        PF: { kind: "continuous", pos: 3, sal: 1 },
        TRB: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
        ENG: { kind: "continuous", pos: 3, sal: 1 },
        EPS: { kind: "categorical", probs: [0.62, 0.24, 0.03, 0.04, 0.03, 0.04], sal: 1, antiCats: [2, 3, 5] },
        AES: { kind: "categorical", probs: [0.08, 0.64, 0.04, 0.04, 0.03, 0.17], sal: 1, antiCats: [4] }
      }
    },
    {
      id: "063",
      name: "Enterprise Pluralist",
      tier: "T1",
      prior: 1 / 112,
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
        PF: { kind: "continuous", pos: 3, sal: 1 },
        TRB: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
        ENG: { kind: "continuous", pos: 4, sal: 1 },
        EPS: { kind: "categorical", probs: [0.62, 0.14, 0.03, 0.04, 0.15, 0.02], sal: 1, antiCats: [2, 3, 5] },
        AES: { kind: "categorical", probs: [0.06, 0.18, 0.05, 0.06, 0.08, 0.57], sal: 1 }
      }
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
    //     PF: { kind: "continuous", pos: 3, sal: 2 },
    //     TRB: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
    //     ENG: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
    //     EPS: { kind: "categorical", probs: [0.62, 0.14, 0.03, 0.04, 0.15, 0.02], sal: 1, antiCats: [2, 3, 5] },
    //     AES: { kind: "categorical", probs: [0.06, 0.18, 0.05, 0.06, 0.08, 0.57], sal: 1 },
    //   }
    // },
    {
      id: "065",
      name: "Opportunity Liberal",
      tier: "T1",
      prior: 1 / 112,
      nodes: {
        MAT: { kind: "continuous", pos: 3, sal: 3, anti: "low" },
        CD: { kind: "continuous", pos: 2, sal: 2 },
        CU: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
        MOR: { kind: "continuous", pos: 5, sal: 2 },
        PRO: { kind: "continuous", pos: 1, sal: 3, anti: "high" },
        COM: { kind: "continuous", pos: 3, sal: 2 },
        ZS: { kind: "continuous", pos: 1, sal: 3, anti: "high" },
        ONT_H: { kind: "continuous", pos: 5, sal: 3, anti: "low" },
        ONT_S: { kind: "continuous", pos: 4, sal: 2 },
        PF: { kind: "continuous", pos: 3, sal: 1 },
        TRB: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
        ENG: { kind: "continuous", pos: 4, sal: 2 },
        EPS: { kind: "categorical", probs: [0.62, 0.24, 0.03, 0.04, 0.03, 0.04], sal: 1, antiCats: [2, 3, 5] },
        AES: { kind: "categorical", probs: [0.06, 0.18, 0.05, 0.06, 0.08, 0.57], sal: 1 }
      }
    },
    {
      id: "067",
      name: "Free-Exchange Modernist",
      tier: "T1",
      prior: 1 / 112,
      nodes: {
        MAT: { kind: "continuous", pos: 5, sal: 3, anti: "low" },
        CD: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
        CU: { kind: "continuous", pos: 5, sal: 3, anti: "low" },
        MOR: { kind: "continuous", pos: 4, sal: 2 },
        PRO: { kind: "continuous", pos: 1, sal: 3, anti: "high" },
        COM: { kind: "continuous", pos: 3, sal: 2 },
        ZS: { kind: "continuous", pos: 1, sal: 3, anti: "high" },
        ONT_H: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
        ONT_S: { kind: "continuous", pos: 5, sal: 2 },
        PF: { kind: "continuous", pos: 3, sal: 2 },
        TRB: { kind: "continuous", pos: 1, sal: 3, anti: "high" },
        ENG: { kind: "continuous", pos: 3, sal: 1 },
        EPS: { kind: "categorical", probs: [0.62, 0.14, 0.03, 0.04, 0.15, 0.02], sal: 1, antiCats: [2, 3, 5] },
        AES: { kind: "categorical", probs: [0.06, 0.18, 0.05, 0.06, 0.08, 0.57], sal: 1 }
      }
    },
    {
      id: "069",
      name: "Bleeding-Heart Libertarian",
      tier: "T1",
      prior: 1 / 112,
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
        PF: { kind: "continuous", pos: 3, sal: 1 },
        TRB: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
        ENG: { kind: "continuous", pos: 3, sal: 1 },
        EPS: { kind: "categorical", probs: [0.62, 0.14, 0.03, 0.08, 0.11, 0.02], sal: 1, antiCats: [2, 3, 5] },
        AES: { kind: "categorical", probs: [0.05, 0.05, 0.08, 0.7, 0.05, 0.07], sal: 1 }
      }
    },
    {
      id: "070",
      name: "Burkean Steward",
      tier: "T1",
      prior: 1 / 112,
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
      prior: 1 / 112,
      nodes: {
        MAT: { kind: "continuous", pos: 4, sal: 2 },
        CD: { kind: "continuous", pos: 5, sal: 2 },
        CU: { kind: "continuous", pos: 1, sal: 2 },
        MOR: { kind: "continuous", pos: 2, sal: 2 },
        PRO: { kind: "continuous", pos: 5, sal: 2 },
        COM: { kind: "continuous", pos: 2, sal: 2 },
        ZS: { kind: "continuous", pos: 4, sal: 2 },
        ONT_H: { kind: "continuous", pos: 3, sal: 1 },
        ONT_S: { kind: "continuous", pos: 2, sal: 1 },
        PF: { kind: "continuous", pos: 4, sal: 2 },
        TRB: { kind: "continuous", pos: 2, sal: 2 },
        ENG: { kind: "continuous", pos: 4, sal: 2 },
        EPS: { kind: "categorical", probs: [0.1, 0.58, 0.15, 0.05, 0.06, 0.06], sal: 2 },
        AES: { kind: "categorical", probs: [0.6, 0.1, 0.14, 0.06, 0.04, 0.06], sal: 2 }
      }
    },
    {
      id: "072",
      name: "Blackstone Conservative",
      tier: "T1",
      prior: 1 / 112,
      nodes: {
        MAT: { kind: "continuous", pos: 4, sal: 2, anti: "low" },
        CD: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
        CU: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
        MOR: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
        PRO: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
        COM: { kind: "continuous", pos: 3, sal: 1 },
        ZS: { kind: "continuous", pos: 3, sal: 1 },
        ONT_H: { kind: "continuous", pos: 3, sal: 1 },
        ONT_S: { kind: "continuous", pos: 2, sal: 1 },
        PF: { kind: "continuous", pos: 3, sal: 0 },
        TRB: { kind: "continuous", pos: 2, sal: 1 },
        ENG: { kind: "continuous", pos: 4, sal: 1 },
        EPS: { kind: "categorical", probs: [0.1, 0.58, 0.15, 0.05, 0.06, 0.06], sal: 2, antiCats: [5] },
        AES: { kind: "categorical", probs: [0.6, 0.1, 0.14, 0.06, 0.04, 0.06], sal: 1, antiCats: [4] }
      }
    },
    {
      id: "073",
      name: "Civic Traditionalist",
      tier: "T1",
      prior: 1 / 112,
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
        EPS: { kind: "categorical", probs: [0.1, 0.58, 0.15, 0.05, 0.06, 0.06], sal: 1, antiCats: [5] },
        AES: { kind: "categorical", probs: [0.6, 0.1, 0.14, 0.06, 0.04, 0.06], sal: 1, antiCats: [4] }
      }
    },
    {
      id: "074",
      name: "Responsible Conservative",
      tier: "T1",
      prior: 1 / 112,
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
        EPS: { kind: "categorical", probs: [0.1, 0.58, 0.15, 0.05, 0.06, 0.06], sal: 1, antiCats: [5] },
        AES: { kind: "categorical", probs: [0.6, 0.1, 0.14, 0.06, 0.04, 0.06], sal: 1, antiCats: [4] }
      }
    },
    {
      id: "076",
      name: "Fiscal Gradualist",
      tier: "T1",
      prior: 1 / 112,
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
        EPS: { kind: "categorical", probs: [0.1, 0.58, 0.15, 0.05, 0.06, 0.06], sal: 1, antiCats: [5] },
        AES: { kind: "categorical", probs: [0.6, 0.1, 0.14, 0.06, 0.04, 0.06], sal: 1, antiCats: [4] }
      }
    },
    {
      id: "077",
      name: "Ordered Libertarian",
      tier: "T1",
      prior: 1 / 112,
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
        EPS: { kind: "categorical", probs: [0.1, 0.58, 0.15, 0.05, 0.06, 0.06], sal: 1, antiCats: [5] },
        AES: { kind: "categorical", probs: [0.6, 0.1, 0.14, 0.06, 0.04, 0.06], sal: 1, antiCats: [4] }
      }
    },
    {
      id: "078",
      name: "Meritocratic Conservative",
      tier: "T1",
      prior: 1 / 112,
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
        EPS: { kind: "categorical", probs: [0.1, 0.58, 0.15, 0.05, 0.06, 0.06], sal: 1, antiCats: [5] },
        AES: { kind: "categorical", probs: [0.6, 0.1, 0.14, 0.06, 0.04, 0.06], sal: 1, antiCats: [4] }
      }
    },
    {
      id: "079",
      name: "National Developmentalist",
      tier: "T1",
      prior: 1 / 112,
      nodes: {
        MAT: { kind: "continuous", pos: 4, sal: 2 },
        CD: { kind: "continuous", pos: 4, sal: 1 },
        CU: { kind: "continuous", pos: 2, sal: 1 },
        MOR: { kind: "continuous", pos: 2, sal: 2 },
        PRO: { kind: "continuous", pos: 4, sal: 2 },
        COM: { kind: "continuous", pos: 4, sal: 1 },
        ZS: { kind: "continuous", pos: 4, sal: 2 },
        ONT_H: { kind: "continuous", pos: 2, sal: 1 },
        ONT_S: { kind: "continuous", pos: 1, sal: 2 },
        PF: { kind: "continuous", pos: 4, sal: 1 },
        TRB: { kind: "continuous", pos: 3, sal: 2 },
        ENG: { kind: "continuous", pos: 4, sal: 1 },
        EPS: { kind: "categorical", probs: [0.1, 0.58, 0.15, 0.05, 0.06, 0.06], sal: 1 },
        AES: { kind: "categorical", probs: [0.6, 0.1, 0.09, 0.06, 0.09, 0.06], sal: 1 }
      }
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
      prior: 1 / 112,
      nodes: {
        MAT: { kind: "continuous", pos: 4, sal: 1 },
        CD: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
        CU: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
        MOR: { kind: "continuous", pos: 2, sal: 2 },
        PRO: { kind: "continuous", pos: 3, sal: 1 },
        COM: { kind: "continuous", pos: 2, sal: 1 },
        ZS: { kind: "continuous", pos: 4, sal: 1 },
        ONT_H: { kind: "continuous", pos: 2, sal: 1 },
        ONT_S: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
        PF: { kind: "continuous", pos: 4, sal: 1 },
        TRB: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
        ENG: { kind: "continuous", pos: 3, sal: 1 },
        EPS: { kind: "categorical", probs: [0.04, 0.18, 0.6, 0.06, 0.08, 0.04], sal: 2, antiCats: [0, 5] },
        AES: { kind: "categorical", probs: [0.16, 0.05, 0.62, 0.07, 0.03, 0.07], sal: 1 }
      }
    },
    {
      id: "082",
      name: "Altar-and-Hearth Conservative",
      tier: "T1",
      prior: 1 / 112,
      nodes: {
        MAT: { kind: "continuous", pos: 3, sal: 1 },
        CD: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
        CU: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
        MOR: { kind: "continuous", pos: 3, sal: 2 },
        PRO: { kind: "continuous", pos: 2, sal: 2 },
        COM: { kind: "continuous", pos: 2, sal: 2 },
        ZS: { kind: "continuous", pos: 3, sal: 1 },
        ONT_H: { kind: "continuous", pos: 2, sal: 1 },
        ONT_S: { kind: "continuous", pos: 2, sal: 1 },
        PF: { kind: "continuous", pos: 4, sal: 1 },
        TRB: { kind: "continuous", pos: 3, sal: 1 },
        ENG: { kind: "continuous", pos: 3, sal: 1 },
        EPS: { kind: "categorical", probs: [0.04, 0.18, 0.6, 0.06, 0.08, 0.04], sal: 2, antiCats: [0, 5] },
        AES: { kind: "categorical", probs: [0.16, 0.05, 0.62, 0.07, 0.03, 0.07], sal: 1 }
      }
    },
    {
      id: "083",
      name: "Closed Traditionalist",
      tier: "T1",
      prior: 1 / 112,
      nodes: {
        MAT: { kind: "continuous", pos: 3, sal: 1 },
        CD: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
        CU: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
        MOR: { kind: "continuous", pos: 4, sal: 2 },
        PRO: { kind: "continuous", pos: 3, sal: 1 },
        COM: { kind: "continuous", pos: 2, sal: 1 },
        ZS: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
        ONT_H: { kind: "continuous", pos: 2, sal: 1 },
        ONT_S: { kind: "continuous", pos: 2, sal: 1 },
        PF: { kind: "continuous", pos: 4, sal: 1 },
        TRB: { kind: "continuous", pos: 3, sal: 1 },
        ENG: { kind: "continuous", pos: 4, sal: 1 },
        EPS: { kind: "categorical", probs: [0.04, 0.18, 0.6, 0.06, 0.08, 0.04], sal: 2, antiCats: [0, 5] },
        AES: { kind: "categorical", probs: [0.16, 0.05, 0.62, 0.07, 0.03, 0.07], sal: 1 }
      }
    },
    {
      id: "084",
      name: "Civilizational Conservative",
      tier: "T1",
      prior: 1 / 112,
      nodes: {
        MAT: { kind: "continuous", pos: 3, sal: 1 },
        CD: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
        CU: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
        MOR: { kind: "continuous", pos: 3, sal: 2 },
        PRO: { kind: "continuous", pos: 3, sal: 1 },
        COM: { kind: "continuous", pos: 2, sal: 1 },
        ZS: { kind: "continuous", pos: 3, sal: 1 },
        ONT_H: { kind: "continuous", pos: 2, sal: 1 },
        ONT_S: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
        PF: { kind: "continuous", pos: 4, sal: 1 },
        TRB: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
        ENG: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
        EPS: { kind: "categorical", probs: [0.04, 0.18, 0.6, 0.06, 0.08, 0.04], sal: 2, antiCats: [0, 5] },
        AES: { kind: "categorical", probs: [0.04, 0.03, 0.04, 0.18, 0.63, 0.08], sal: 1, antiCats: [0, 1] }
      }
    },
    {
      id: "085",
      name: "Customary Localist",
      tier: "T1",
      prior: 1 / 112,
      nodes: {
        MAT: { kind: "continuous", pos: 4, sal: 2 },
        CD: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
        CU: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
        MOR: { kind: "continuous", pos: 2, sal: 2 },
        PRO: { kind: "continuous", pos: 2, sal: 2 },
        COM: { kind: "continuous", pos: 2, sal: 2 },
        ZS: { kind: "continuous", pos: 3, sal: 1 },
        ONT_H: { kind: "continuous", pos: 3, sal: 1 },
        ONT_S: { kind: "continuous", pos: 2, sal: 2 },
        PF: { kind: "continuous", pos: 4, sal: 2 },
        TRB: { kind: "continuous", pos: 2, sal: 2 },
        ENG: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
        EPS: { kind: "categorical", probs: [0.04, 0.18, 0.6, 0.06, 0.08, 0.04], sal: 1, antiCats: [0, 5] },
        AES: { kind: "categorical", probs: [0.16, 0.05, 0.62, 0.07, 0.03, 0.07], sal: 2 }
      }
    },
    {
      id: "086",
      name: "Duty Traditionalist",
      tier: "T1",
      prior: 1 / 112,
      nodes: {
        MAT: { kind: "continuous", pos: 3, sal: 1 },
        CD: { kind: "continuous", pos: 4, sal: 1 },
        CU: { kind: "continuous", pos: 2, sal: 2 },
        MOR: { kind: "continuous", pos: 3, sal: 2 },
        PRO: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
        COM: { kind: "continuous", pos: 2, sal: 1 },
        ZS: { kind: "continuous", pos: 3, sal: 1 },
        ONT_H: { kind: "continuous", pos: 2, sal: 1 },
        ONT_S: { kind: "continuous", pos: 2, sal: 1 },
        PF: { kind: "continuous", pos: 4, sal: 1 },
        TRB: { kind: "continuous", pos: 3, sal: 1 },
        ENG: { kind: "continuous", pos: 4, sal: 1 },
        EPS: { kind: "categorical", probs: [0.04, 0.18, 0.6, 0.06, 0.08, 0.04], sal: 2, antiCats: [0, 5] },
        AES: { kind: "categorical", probs: [0.16, 0.05, 0.62, 0.07, 0.03, 0.07], sal: 1 }
      }
    },
    {
      id: "087",
      name: "Continuity Conservative",
      tier: "T1",
      prior: 1 / 112,
      nodes: {
        MAT: { kind: "continuous", pos: 3, sal: 2 },
        CD: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
        CU: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
        MOR: { kind: "continuous", pos: 2, sal: 2 },
        PRO: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
        COM: { kind: "continuous", pos: 3, sal: 1 },
        ZS: { kind: "continuous", pos: 3, sal: 1 },
        ONT_H: { kind: "continuous", pos: 3, sal: 2 },
        ONT_S: { kind: "continuous", pos: 2, sal: 2 },
        PF: { kind: "continuous", pos: 4, sal: 1 },
        TRB: { kind: "continuous", pos: 3, sal: 0 },
        ENG: { kind: "continuous", pos: 3, sal: 1 },
        EPS: { kind: "categorical", probs: [0.04, 0.18, 0.6, 0.06, 0.08, 0.04], sal: 1, antiCats: [0, 5] },
        AES: { kind: "categorical", probs: [0.16, 0.05, 0.62, 0.07, 0.03, 0.07], sal: 1 }
      }
    },
    {
      id: "088",
      name: "Gentle Traditionalist",
      tier: "T1",
      prior: 1 / 112,
      nodes: {
        MAT: { kind: "continuous", pos: 3, sal: 2 },
        CD: { kind: "continuous", pos: 4, sal: 2, anti: "low" },
        CU: { kind: "continuous", pos: 2, sal: 2, anti: "high" },
        MOR: { kind: "continuous", pos: 2, sal: 2 },
        PRO: { kind: "continuous", pos: 3, sal: 2 },
        COM: { kind: "continuous", pos: 4, sal: 2, anti: "low" },
        ZS: { kind: "continuous", pos: 3, sal: 2 },
        ONT_H: { kind: "continuous", pos: 4, sal: 1 },
        ONT_S: { kind: "continuous", pos: 2, sal: 2, anti: "high" },
        PF: { kind: "continuous", pos: 4, sal: 1 },
        TRB: { kind: "continuous", pos: 2, sal: 1 },
        ENG: { kind: "continuous", pos: 2, sal: 1 },
        EPS: { kind: "categorical", probs: [0.04, 0.18, 0.6, 0.06, 0.08, 0.04], sal: 1, antiCats: [0, 5] },
        AES: { kind: "categorical", probs: [0.16, 0.05, 0.62, 0.07, 0.03, 0.07], sal: 2 }
      }
    },
    {
      id: "089",
      name: "Integral Traditionalist",
      tier: "T1",
      prior: 1 / 112,
      nodes: {
        MAT: { kind: "continuous", pos: 4, sal: 1 },
        CD: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
        CU: { kind: "continuous", pos: 2, sal: 2 },
        MOR: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
        PRO: { kind: "continuous", pos: 3, sal: 1 },
        COM: { kind: "continuous", pos: 2, sal: 1 },
        ZS: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
        ONT_H: { kind: "continuous", pos: 2, sal: 1 },
        ONT_S: { kind: "continuous", pos: 2, sal: 1 },
        PF: { kind: "continuous", pos: 4, sal: 2 },
        TRB: { kind: "continuous", pos: 3, sal: 1 },
        ENG: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
        EPS: { kind: "categorical", probs: [0.04, 0.18, 0.6, 0.06, 0.08, 0.04], sal: 3, antiCats: [0, 5] },
        AES: { kind: "categorical", probs: [0.6, 0.1, 0.14, 0.06, 0.04, 0.06], sal: 1, antiCats: [4] }
      }
    },
    {
      id: "090",
      name: "Hobbesian Guardian",
      tier: "T1",
      prior: 1 / 112,
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
        ONT_S: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
        PF: { kind: "continuous", pos: 4, sal: 2 },
        TRB: { kind: "continuous", pos: 3, sal: 1 },
        ENG: { kind: "continuous", pos: 3, sal: 1 },
        EPS: { kind: "categorical", probs: [0.1, 0.58, 0.15, 0.05, 0.06, 0.06], sal: 1, antiCats: [5] },
        AES: { kind: "categorical", probs: [0.6, 0.1, 0.04, 0.06, 0.14, 0.06], sal: 1, antiCats: [4] }
      }
    },
    {
      id: "091",
      name: "Security Paternalist",
      tier: "T1",
      prior: 1 / 112,
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
        PF: { kind: "continuous", pos: 4, sal: 1 },
        TRB: { kind: "continuous", pos: 3, sal: 1 },
        ENG: { kind: "continuous", pos: 3, sal: 1 },
        EPS: { kind: "categorical", probs: [0.1, 0.58, 0.15, 0.05, 0.06, 0.06], sal: 1, antiCats: [5] },
        AES: { kind: "categorical", probs: [0.6, 0.1, 0.04, 0.06, 0.14, 0.06], sal: 1, antiCats: [4] }
      }
    },
    {
      id: "092",
      name: "Partisan Tribalist",
      tier: "T1",
      prior: 1 / 112,
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
        PF: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
        TRB: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
        ENG: { kind: "continuous", pos: 4, sal: 1 },
        EPS: { kind: "categorical", probs: [0.1, 0.58, 0.15, 0.05, 0.06, 0.06], sal: 1, antiCats: [5] },
        AES: { kind: "categorical", probs: [0.6, 0.1, 0.04, 0.06, 0.14, 0.06], sal: 1, antiCats: [4] }
      }
    },
    {
      id: "094",
      name: "Hard-State Manager",
      tier: "T1",
      prior: 1 / 112,
      nodes: {
        MAT: { kind: "continuous", pos: 3, sal: 2 },
        CD: { kind: "continuous", pos: 4, sal: 2 },
        CU: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
        MOR: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
        PRO: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
        COM: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
        ZS: { kind: "continuous", pos: 4, sal: 2 },
        ONT_H: { kind: "continuous", pos: 2, sal: 1 },
        ONT_S: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
        PF: { kind: "continuous", pos: 4, sal: 1 },
        TRB: { kind: "continuous", pos: 3, sal: 1 },
        ENG: { kind: "continuous", pos: 4, sal: 1 },
        EPS: { kind: "categorical", probs: [0.1, 0.58, 0.15, 0.05, 0.06, 0.06], sal: 1, antiCats: [5] },
        AES: { kind: "categorical", probs: [0.08, 0.64, 0.04, 0.04, 0.03, 0.17], sal: 1, antiCats: [4] }
      }
    },
    {
      id: "095",
      name: "Emergency Orderist",
      tier: "T1",
      prior: 1 / 112,
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
        PF: { kind: "continuous", pos: 4, sal: 1 },
        TRB: { kind: "continuous", pos: 3, sal: 1 },
        ENG: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
        EPS: { kind: "categorical", probs: [0.1, 0.58, 0.15, 0.05, 0.06, 0.06], sal: 1, antiCats: [5] },
        AES: { kind: "categorical", probs: [0.6, 0.1, 0.04, 0.06, 0.14, 0.06], sal: 1, antiCats: [4] }
      }
    },
    {
      id: "097",
      name: "Authority Pragmatist",
      tier: "T1",
      prior: 1 / 112,
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
        PF: { kind: "continuous", pos: 4, sal: 1 },
        TRB: { kind: "continuous", pos: 3, sal: 1 },
        ENG: { kind: "continuous", pos: 3, sal: 1 },
        EPS: { kind: "categorical", probs: [0.1, 0.58, 0.15, 0.05, 0.06, 0.06], sal: 1 },
        AES: { kind: "categorical", probs: [0.6, 0.1, 0.04, 0.06, 0.14, 0.06], sal: 1 }
      }
    },
    {
      id: "098",
      name: "Anti-Elite Populist",
      tier: "T1",
      prior: 1 / 112,
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
        PF: { kind: "continuous", pos: 2, sal: 1 },
        TRB: { kind: "continuous", pos: 2, sal: 1 },
        ENG: { kind: "continuous", pos: 4, sal: 2 },
        EPS: { kind: "categorical", probs: [0.05, 0.05, 0.08, 0.58, 0.19, 0.05], sal: 1 },
        AES: { kind: "categorical", probs: [0.05, 0.05, 0.08, 0.6, 0.15, 0.07], sal: 2 }
      }
    },
    {
      id: "099",
      name: "Scarcity Populist",
      tier: "T1",
      prior: 1 / 112,
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
        PF: { kind: "continuous", pos: 3, sal: 2 },
        TRB: { kind: "continuous", pos: 3, sal: 2 },
        ENG: { kind: "continuous", pos: 3, sal: 2 },
        EPS: { kind: "categorical", probs: [0.05, 0.05, 0.08, 0.58, 0.19, 0.05], sal: 1, antiCats: [0, 5] },
        AES: { kind: "categorical", probs: [0.04, 0.03, 0.04, 0.18, 0.63, 0.08], sal: 1, antiCats: [0, 1] }
      }
    },
    {
      id: "100",
      name: "Tribal Insurgent",
      tier: "T1",
      prior: 1 / 112,
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
        PF: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
        TRB: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
        ENG: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
        EPS: { kind: "categorical", probs: [0.05, 0.05, 0.08, 0.58, 0.19, 0.05], sal: 1, antiCats: [0, 5] },
        AES: { kind: "categorical", probs: [0.04, 0.03, 0.04, 0.18, 0.63, 0.08], sal: 2, antiCats: [0, 1] }
      }
    },
    {
      id: "101",
      name: "Embattled Majoritarian",
      tier: "T1",
      prior: 1 / 112,
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
        PF: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
        TRB: { kind: "continuous", pos: 3, sal: 2 },
        ENG: { kind: "continuous", pos: 3, sal: 2 },
        EPS: { kind: "categorical", probs: [0.05, 0.05, 0.08, 0.58, 0.19, 0.05], sal: 1, antiCats: [0, 5] },
        AES: { kind: "categorical", probs: [0.05, 0.05, 0.08, 0.6, 0.15, 0.07], sal: 2 }
      }
    },
    {
      id: "103",
      name: "Grievance Mobilizer",
      tier: "T1",
      prior: 1 / 112,
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
        PF: { kind: "continuous", pos: 4, sal: 1 },
        TRB: { kind: "continuous", pos: 4, sal: 2 },
        ENG: { kind: "continuous", pos: 4, sal: 2 },
        // Fixed: Mobilizer = high engagement
        EPS: { kind: "categorical", probs: [0.05, 0.05, 0.08, 0.58, 0.19, 0.05], sal: 1, antiCats: [0, 5] },
        AES: { kind: "categorical", probs: [0.05, 0.05, 0.08, 0.6, 0.15, 0.07], sal: 2 }
      }
    },
    {
      id: "104",
      name: "National Protector",
      tier: "T1",
      prior: 1 / 112,
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
        PF: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
        TRB: { kind: "continuous", pos: 4, sal: 2 },
        ENG: { kind: "continuous", pos: 4, sal: 2 },
        EPS: { kind: "categorical", probs: [0.05, 0.05, 0.08, 0.58, 0.19, 0.05], sal: 1, antiCats: [0, 5] },
        AES: { kind: "categorical", probs: [0.04, 0.03, 0.04, 0.18, 0.63, 0.08], sal: 1, antiCats: [0, 1] }
      }
    },
    {
      id: "105",
      name: "Combative Populist",
      tier: "T1",
      prior: 1 / 112,
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
        PF: { kind: "continuous", pos: 4, sal: 1 },
        TRB: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
        ENG: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
        EPS: { kind: "categorical", probs: [0.05, 0.05, 0.08, 0.58, 0.19, 0.05], sal: 1, antiCats: [0, 5] },
        AES: { kind: "categorical", probs: [0.04, 0.03, 0.04, 0.18, 0.63, 0.08], sal: 3, antiCats: [0, 1] }
      }
    },
    {
      id: "106",
      name: "Militant Partisan",
      tier: "T1",
      prior: 1 / 112,
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
        PF: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
        TRB: { kind: "continuous", pos: 4, sal: 1 },
        ENG: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
        EPS: { kind: "categorical", probs: [0.05, 0.05, 0.08, 0.58, 0.19, 0.05], sal: 1, antiCats: [0, 5] },
        AES: { kind: "categorical", probs: [0.04, 0.03, 0.04, 0.18, 0.63, 0.08], sal: 3, antiCats: [0, 1] }
      }
    },
    {
      id: "107",
      name: "Resentful Localist",
      tier: "T1",
      prior: 1 / 112,
      nodes: {
        MAT: { kind: "continuous", pos: 3, sal: 2 },
        CD: { kind: "continuous", pos: 4, sal: 2 },
        CU: { kind: "continuous", pos: 2, sal: 2 },
        MOR: { kind: "continuous", pos: 2, sal: 2 },
        PRO: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
        COM: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
        ZS: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
        ONT_H: { kind: "continuous", pos: 2, sal: 2 },
        ONT_S: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
        PF: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
        TRB: { kind: "continuous", pos: 2, sal: 2 },
        ENG: { kind: "continuous", pos: 3, sal: 2 },
        EPS: { kind: "categorical", probs: [0.05, 0.05, 0.08, 0.58, 0.19, 0.05], sal: 1, antiCats: [0, 5] },
        AES: { kind: "categorical", probs: [0.05, 0.05, 0.08, 0.6, 0.15, 0.07], sal: 1 }
      }
    },
    // MERGED: 108 Passive Cynic → absorbed into 118 Survival Pragmatist (no Î”â‰¥2 discriminators, profile was mostly sal=0)
    // {
    //   id: "108",
    //   name: "Passive Cynic",
    //   ...
    // },
    {
      id: "109",
      name: "Alienated Outsider",
      tier: "T1",
      prior: 1 / 112,
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
        PF: { kind: "continuous", pos: 2, sal: 1 },
        TRB: { kind: "continuous", pos: 3, sal: 2, anti: "high" },
        ENG: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
        EPS: { kind: "categorical", probs: [0.08, 0.08, 0.08, 0.1, 0.6, 0.06], sal: 2, antiCats: [2, 5] },
        AES: { kind: "categorical", probs: [0.05, 0.05, 0.18, 0.6, 0.05, 0.07], sal: 1 }
      }
    },
    {
      id: "110",
      name: "Principled Abstainer",
      tier: "T1",
      prior: 1 / 112,
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
        PF: { kind: "continuous", pos: 1, sal: 3, anti: "high" },
        TRB: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
        ENG: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
        EPS: { kind: "categorical", probs: [0.08, 0.08, 0.08, 0.2, 0.5, 0.06], sal: 2, antiCats: [2, 5] },
        AES: { kind: "categorical", probs: [0.05, 0.05, 0.18, 0.6, 0.05, 0.07], sal: 1 }
      }
    },
    {
      id: "111",
      name: "Cosmopolitan Nonconformist",
      tier: "T1",
      prior: 1 / 112,
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
      name: "Engaged Cosmopolitan",
      tier: "T1",
      prior: 1 / 112,
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
        EPS: { kind: "categorical", probs: [0.08, 0.08, 0.08, 0.1, 0.6, 0.06], sal: 1, antiCats: [2, 5] },
        AES: { kind: "categorical", probs: [0.05, 0.05, 0.08, 0.7, 0.05, 0.07], sal: 2 }
      }
    },
    {
      id: "115",
      name: "Quietist",
      tier: "T1",
      prior: 1 / 112,
      nodes: {
        MAT: { kind: "continuous", pos: 3, sal: 1 },
        // raised sal 0→1 (discriminator vs Ecological Localist)
        CD: { kind: "continuous", pos: 3, sal: 0 },
        CU: { kind: "continuous", pos: 3, sal: 0 },
        MOR: { kind: "continuous", pos: 2, sal: 2, anti: "high" },
        PRO: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
        COM: { kind: "continuous", pos: 2, sal: 1 },
        ZS: { kind: "continuous", pos: 3, sal: 0, anti: "low" },
        ONT_H: { kind: "continuous", pos: 4, sal: 2 },
        ONT_S: { kind: "continuous", pos: 3, sal: 1 },
        // raised sal 0→1 (discriminator vs Ecological Localist)
        PF: { kind: "continuous", pos: 3, sal: 0 },
        TRB: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
        ENG: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
        EPS: { kind: "categorical", probs: [0.04, 0.08, 0.6, 0.16, 0.08, 0.04], sal: 1, antiCats: [0, 5] },
        AES: { kind: "categorical", probs: [0.06, 0.05, 0.72, 0.07, 0.03, 0.07], sal: 1 }
      }
    },
    {
      id: "116",
      name: "Quiet Middle",
      tier: "T1",
      prior: 1 / 112,
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
        PF: { kind: "continuous", pos: 3, sal: 1, anti: "low" },
        TRB: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
        ENG: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
        EPS: { kind: "categorical", probs: [0.1, 0.58, 0.05, 0.03, 0.16, 0.08], sal: 1, antiCats: [5] },
        AES: { kind: "categorical", probs: [0.05, 0.05, 0.18, 0.6, 0.05, 0.07], sal: 1 }
      }
    },
    {
      id: "117",
      name: "Comfortable Bystander",
      tier: "T1",
      prior: 1 / 112,
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
        PF: { kind: "continuous", pos: 3, sal: 1, anti: "low" },
        TRB: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
        ENG: { kind: "continuous", pos: 1, sal: 3, anti: "high" },
        // Bystander's defining trait: extremely disengaged
        EPS: { kind: "categorical", probs: [0.04, 0.18, 0.6, 0.06, 0.08, 0.04], sal: 1, antiCats: [0, 5] },
        AES: { kind: "categorical", probs: [0.05, 0.05, 0.18, 0.6, 0.05, 0.07], sal: 1 }
      }
    },
    {
      id: "118",
      name: "Survival Pragmatist",
      tier: "T1",
      prior: 1 / 112,
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
        PF: { kind: "continuous", pos: 3, sal: 1 },
        TRB: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
        ENG: { kind: "continuous", pos: 3, sal: 2, anti: "high" },
        EPS: { kind: "categorical", probs: [0.1, 0.58, 0.05, 0.03, 0.16, 0.08], sal: 1, antiCats: [5] },
        AES: { kind: "categorical", probs: [0.05, 0.05, 0.18, 0.6, 0.05, 0.07], sal: 1 }
      }
    },
    {
      id: "119",
      name: "Apolitical Striver",
      tier: "T1",
      prior: 1 / 112,
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
        PF: { kind: "continuous", pos: 3, sal: 0 },
        TRB: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
        ENG: { kind: "continuous", pos: 2, sal: 2 },
        EPS: { kind: "categorical", probs: [0.1, 0.58, 0.05, 0.03, 0.16, 0.08], sal: 1, antiCats: [5] },
        AES: { kind: "categorical", probs: [0.05, 0.05, 0.18, 0.6, 0.05, 0.07], sal: 1 }
      }
    },
    {
      id: "120",
      name: "Good Neighbor",
      tier: "T1",
      prior: 1 / 112,
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
        PF: { kind: "continuous", pos: 3, sal: 2 },
        TRB: { kind: "continuous", pos: 1, sal: 3, anti: "high" },
        ENG: { kind: "continuous", pos: 2, sal: 2 },
        EPS: { kind: "categorical", probs: [0.1, 0.58, 0.05, 0.03, 0.16, 0.08], sal: 1, antiCats: [5] },
        AES: { kind: "categorical", probs: [0.6, 0.1, 0.14, 0.06, 0.04, 0.06], sal: 2, antiCats: [4] }
      }
    },
    {
      id: "121",
      name: "Spectator Citizen",
      tier: "T1",
      prior: 1 / 112,
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
        PF: { kind: "continuous", pos: 3, sal: 1 },
        TRB: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
        ENG: { kind: "continuous", pos: 1, sal: 2, anti: "low" },
        EPS: { kind: "categorical", probs: [0.62, 0.24, 0.03, 0.04, 0.03, 0.04], sal: 1, antiCats: [2, 3, 5] },
        AES: { kind: "categorical", probs: [0.05, 0.05, 0.18, 0.6, 0.05, 0.07], sal: 1 }
      }
    },
    {
      id: "122",
      name: "Civic Minimalist",
      tier: "T1",
      prior: 1 / 112,
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
        PF: { kind: "continuous", pos: 3, sal: 0 },
        TRB: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
        ENG: { kind: "continuous", pos: 2, sal: 2 },
        EPS: { kind: "categorical", probs: [0.1, 0.58, 0.05, 0.03, 0.16, 0.08], sal: 1, antiCats: [5] },
        AES: { kind: "categorical", probs: [0.05, 0.05, 0.18, 0.6, 0.05, 0.07], sal: 1 }
      }
    },
    {
      id: "124",
      name: "Latent Alarmist",
      tier: "T1",
      prior: 1 / 112,
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
        PF: { kind: "continuous", pos: 4, sal: 1 },
        TRB: { kind: "continuous", pos: 2, sal: 2 },
        ENG: { kind: "continuous", pos: 3, sal: 2 },
        EPS: { kind: "categorical", probs: [0.1, 0.58, 0.05, 0.03, 0.16, 0.08], sal: 1 },
        AES: { kind: "categorical", probs: [0.05, 0.05, 0.18, 0.6, 0.05, 0.07], sal: 1 }
      }
    },
    {
      id: "125",
      name: "Reluctant Partisan",
      tier: "T1",
      prior: 1 / 112,
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
        PF: { kind: "continuous", pos: 4, sal: 2, anti: "low" },
        TRB: { kind: "continuous", pos: 2, sal: 2, anti: "high" },
        ENG: { kind: "continuous", pos: 2, sal: 2, anti: "high" },
        EPS: { kind: "categorical", probs: [0.1, 0.58, 0.05, 0.03, 0.16, 0.08], sal: 1, antiCats: [5] },
        AES: { kind: "categorical", probs: [0.05, 0.05, 0.18, 0.6, 0.05, 0.07], sal: 1 }
      }
    },
    {
      id: "126",
      name: "Uncompromising Activist",
      tier: "T1",
      prior: 1 / 112,
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
        PF: { kind: "continuous", pos: 3, sal: 0 },
        TRB: { kind: "continuous", pos: 3, sal: 0, anti: "low" },
        ENG: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
        EPS: { kind: "categorical", probs: [0.1, 0.58, 0.05, 0.03, 0.16, 0.08], sal: 1, antiCats: [5] },
        AES: { kind: "categorical", probs: [0.05, 0.05, 0.18, 0.6, 0.05, 0.07], sal: 1 }
      }
    },
    {
      id: "127",
      name: "Tribal Loyalist",
      tier: "T1",
      prior: 1 / 112,
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
        PF: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
        TRB: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
        ENG: { kind: "continuous", pos: 3, sal: 1, anti: "low" },
        EPS: { kind: "categorical", probs: [0.1, 0.58, 0.05, 0.03, 0.16, 0.08], sal: 1, antiCats: [5] },
        AES: { kind: "categorical", probs: [0.05, 0.05, 0.18, 0.6, 0.05, 0.07], sal: 1 }
      }
    },
    {
      id: "128",
      name: "Loyal Democrat",
      tier: "T1",
      prior: 1 / 112,
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
        PF: { kind: "continuous", pos: 4, sal: 2 },
        // Fixed: Loyal = high PF
        TRB: { kind: "continuous", pos: 4, sal: 2 },
        ENG: { kind: "continuous", pos: 3, sal: 1 },
        EPS: { kind: "categorical", probs: [0.1, 0.58, 0.05, 0.03, 0.16, 0.08], sal: 1, antiCats: [5] },
        AES: { kind: "categorical", probs: [0.05, 0.05, 0.18, 0.6, 0.05, 0.07], sal: 1 }
      }
    },
    {
      id: "129",
      name: "Loyal Republican",
      tier: "T1",
      prior: 1 / 112,
      nodes: {
        MAT: { kind: "continuous", pos: 4, sal: 1 },
        CD: { kind: "continuous", pos: 4, sal: 1 },
        CU: { kind: "continuous", pos: 2, sal: 1 },
        MOR: { kind: "continuous", pos: 2, sal: 1 },
        PRO: { kind: "continuous", pos: 3, sal: 0 },
        COM: { kind: "continuous", pos: 2, sal: 1 },
        ZS: { kind: "continuous", pos: 3, sal: 1 },
        ONT_H: { kind: "continuous", pos: 3, sal: 0 },
        ONT_S: { kind: "continuous", pos: 2, sal: 1 },
        PF: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
        TRB: { kind: "continuous", pos: 4, sal: 2 },
        ENG: { kind: "continuous", pos: 3, sal: 1 },
        EPS: { kind: "categorical", probs: [0.1, 0.58, 0.05, 0.03, 0.16, 0.08], sal: 1, antiCats: [5] },
        AES: { kind: "categorical", probs: [0.05, 0.05, 0.18, 0.6, 0.05, 0.07], sal: 1 }
      }
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
    //     PF: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
    //     TRB: { kind: "continuous", pos: 4, sal: 2 },
    //     ENG: { kind: "continuous", pos: 3, sal: 2, anti: "high" },
    //     EPS: { kind: "categorical", probs: [0.04, 0.18, 0.60, 0.06, 0.08, 0.04], sal: 1, antiCats: [0, 5] },
    //     AES: { kind: "categorical", probs: [0.05, 0.05, 0.18, 0.60, 0.05, 0.07], sal: 1 },
    //   }
    // },
    {
      id: "131",
      name: "Duty Voter",
      tier: "T1",
      prior: 1 / 112,
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
        PF: { kind: "continuous", pos: 3, sal: 1 },
        TRB: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
        ENG: { kind: "continuous", pos: 3, sal: 2 },
        EPS: { kind: "categorical", probs: [0.1, 0.58, 0.05, 0.03, 0.16, 0.08], sal: 1, antiCats: [5] },
        AES: { kind: "categorical", probs: [0.05, 0.05, 0.18, 0.6, 0.05, 0.07], sal: 1 }
      }
    },
    {
      id: "132",
      name: "Negative Partisan",
      tier: "T1",
      prior: 1 / 112,
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
        PF: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
        TRB: { kind: "continuous", pos: 4, sal: 2 },
        ENG: { kind: "continuous", pos: 4, sal: 1 },
        EPS: { kind: "categorical", probs: [0.1, 0.58, 0.05, 0.03, 0.16, 0.08], sal: 1, antiCats: [5] },
        AES: { kind: "categorical", probs: [0.05, 0.05, 0.18, 0.6, 0.05, 0.07], sal: 1 }
      }
    },
    {
      id: "134",
      name: "Progressive Civic Nationalist",
      tier: "T1",
      prior: 1 / 112,
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
        EPS: { kind: "categorical", probs: [0.05, 0.05, 0.08, 0.58, 0.19, 0.05], sal: 1, antiCats: [0, 5] },
        AES: { kind: "categorical", probs: [0.06, 0.08, 0.05, 0.06, 0.08, 0.67], sal: 1 }
      }
    },
    // ===== NEW ARCHETYPES (added 2026-03-28 from ChatGPT semantic coverage audit) =====
    {
      id: "135",
      name: "Disruptive Cosmopolitan",
      tier: "T1",
      prior: 1 / 112,
      nodes: {
        MAT: { kind: "continuous", pos: 5, sal: 2 },
        CD: { kind: "continuous", pos: 1, sal: 2 },
        CU: { kind: "continuous", pos: 5, sal: 2 },
        MOR: { kind: "continuous", pos: 5, sal: 2 },
        // FIX: Cosmopolitan = wide moral circle (was 1)
        PRO: { kind: "continuous", pos: 1, sal: 2 },
        // Anti-bureaucratic
        COM: { kind: "continuous", pos: 1, sal: 1 },
        ZS: { kind: "continuous", pos: 1, sal: 1 },
        ONT_H: { kind: "continuous", pos: 4, sal: 2 },
        ONT_S: { kind: "continuous", pos: 4, sal: 1 },
        PF: { kind: "continuous", pos: 1, sal: 1 },
        TRB: { kind: "continuous", pos: 1, sal: 1 },
        ENG: { kind: "continuous", pos: 4, sal: 2 },
        EPS: { kind: "categorical", probs: [0.6, 0.05, 0.15, 0.05, 0.1, 0.05], sal: 1 },
        AES: { kind: "categorical", probs: [0.05, 0.1, 0.05, 0.05, 0.15, 0.6], sal: 1 }
        // FIX: Disruptive = visionary, not statesman
      }
    },
    {
      id: "136",
      name: "Aspirational Traditionalist",
      tier: "T1",
      prior: 1 / 112,
      nodes: {
        MAT: { kind: "continuous", pos: 5, sal: 2 },
        CD: { kind: "continuous", pos: 4, sal: 2 },
        // FIX: Traditionalist = culturally conservative (was 2)
        CU: { kind: "continuous", pos: 2, sal: 2 },
        // FIX: Traditionalist = assimilationist (was 4)
        MOR: { kind: "continuous", pos: 2, sal: 2 },
        // FIX: Traditionalist = particularist (was 5/sal3)
        PRO: { kind: "continuous", pos: 3, sal: 2 },
        COM: { kind: "continuous", pos: 3, sal: 1 },
        ZS: { kind: "continuous", pos: 2, sal: 1 },
        ONT_H: { kind: "continuous", pos: 4, sal: 2 },
        // Aspirational = optimistic (was 3/sal1)
        ONT_S: { kind: "continuous", pos: 4, sal: 1 },
        PF: { kind: "continuous", pos: 2, sal: 1 },
        TRB: { kind: "continuous", pos: 2, sal: 1 },
        ENG: { kind: "continuous", pos: 3, sal: 2 },
        EPS: { kind: "categorical", probs: [0.1, 0.15, 0.5, 0.1, 0.05, 0.1], sal: 1 },
        AES: { kind: "categorical", probs: [0.1, 0.1, 0.5, 0.15, 0.05, 0.1], sal: 1 }
      }
    },
    {
      id: "137",
      name: "Moral Crusader",
      tier: "T1",
      prior: 1 / 112,
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
        EPS: { kind: "categorical", probs: [0.05, 0.05, 0.15, 0.6, 0.1, 0.05], sal: 2 },
        // FIX: Revivalist = intuitionist, not nihilist (was 0.70 nihilist)
        AES: { kind: "categorical", probs: [0.05, 0.05, 0.05, 0.05, 0.1, 0.7], sal: 3 }
        // Prophetic visionary
      }
    },
    {
      id: "138",
      name: "Optimistic Challenger",
      tier: "T1",
      prior: 1 / 112,
      nodes: {
        MAT: { kind: "continuous", pos: 3, sal: 1 },
        CD: { kind: "continuous", pos: 2, sal: 1 },
        CU: { kind: "continuous", pos: 4, sal: 1 },
        MOR: { kind: "continuous", pos: 4, sal: 2 },
        // FIX: Holistic = broad concern (was 2/sal1)
        PRO: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
        COM: { kind: "continuous", pos: 1, sal: 1 },
        ZS: { kind: "continuous", pos: 4, sal: 2 },
        ONT_H: { kind: "continuous", pos: 5, sal: 2 },
        ONT_S: { kind: "continuous", pos: 4, sal: 1 },
        PF: { kind: "continuous", pos: 1, sal: 1 },
        TRB: { kind: "continuous", pos: 2, sal: 1 },
        ENG: { kind: "continuous", pos: 4, sal: 2 },
        EPS: { kind: "categorical", probs: [0.1, 0.05, 0.05, 0.5, 0.25, 0.05], sal: 1 },
        // FIX: Holistic = intuitionist+autonomous, not nihilist
        AES: { kind: "categorical", probs: [0.05, 0.05, 0.1, 0.6, 0.1, 0.1], sal: 2 }
        // Experiential
      }
    },
    {
      id: "139",
      name: "Civic Assimilationist",
      tier: "T1",
      prior: 1 / 112,
      nodes: {
        MAT: { kind: "continuous", pos: 4, sal: 2 },
        CD: { kind: "continuous", pos: 4, sal: 2 },
        CU: { kind: "continuous", pos: 1, sal: 3 },
        // FIX: Assimilationist = CU=1, not CU=5 (was 5/sal2)
        MOR: { kind: "continuous", pos: 3, sal: 1 },
        PRO: { kind: "continuous", pos: 4, sal: 2 },
        COM: { kind: "continuous", pos: 3, sal: 1 },
        ZS: { kind: "continuous", pos: 2, sal: 1 },
        ONT_H: { kind: "continuous", pos: 3, sal: 1 },
        ONT_S: { kind: "continuous", pos: 4, sal: 1 },
        PF: { kind: "continuous", pos: 3, sal: 1 },
        TRB: { kind: "continuous", pos: 2, sal: 1 },
        ENG: { kind: "continuous", pos: 4, sal: 2 },
        EPS: { kind: "categorical", probs: [0.1, 0.5, 0.15, 0.1, 0.1, 0.05], sal: 1 },
        AES: { kind: "categorical", probs: [0.1, 0.5, 0.15, 0.1, 0.1, 0.05], sal: 1 }
      }
    },
    {
      id: "140",
      name: "Market Green Modernist",
      tier: "T1",
      prior: 1 / 112,
      nodes: {
        MAT: { kind: "continuous", pos: 4, sal: 2 },
        CD: { kind: "continuous", pos: 1, sal: 2 },
        CU: { kind: "continuous", pos: 5, sal: 2 },
        MOR: { kind: "continuous", pos: 4, sal: 2 },
        // FIX: Green = wide moral concern (was 2/sal1)
        PRO: { kind: "continuous", pos: 5, sal: 2 },
        COM: { kind: "continuous", pos: 4, sal: 2 },
        ZS: { kind: "continuous", pos: 1, sal: 1 },
        ONT_H: { kind: "continuous", pos: 5, sal: 2 },
        ONT_S: { kind: "continuous", pos: 1, sal: 2 },
        PF: { kind: "continuous", pos: 1, sal: 1 },
        TRB: { kind: "continuous", pos: 1, sal: 1 },
        ENG: { kind: "continuous", pos: 4, sal: 2 },
        EPS: { kind: "categorical", probs: [0.7, 0.05, 0.1, 0.05, 0.05, 0.05], sal: 1 },
        // Empiricist
        AES: { kind: "categorical", probs: [0.1, 0.6, 0.1, 0.05, 0.1, 0.05], sal: 1 }
        // Systematic
      }
    }
  ];

  // src/config/categories.ts
  var UNIFORM_CAT = [
    1 / 6,
    1 / 6,
    1 / 6,
    1 / 6,
    1 / 6,
    1 / 6
  ];
  var CATEGORY_COST_MATRIX = {
    EPS: [
      [0, 0.4, 0.9, 0.8, 0.6, 1.1],
      [0.4, 0, 0.7, 0.7, 0.5, 1],
      [0.9, 0.7, 0, 0.7, 0.9, 1],
      [0.8, 0.7, 0.7, 0, 0.6, 0.9],
      [0.6, 0.5, 0.9, 0.6, 0, 0.8],
      [1.1, 1, 1, 0.9, 0.8, 0]
    ],
    AES: [
      [0, 0.4, 0.6, 0.7, 0.9, 0.6],
      [0.4, 0, 0.6, 0.7, 0.8, 0.5],
      [0.6, 0.6, 0, 0.5, 0.7, 0.6],
      [0.7, 0.7, 0.5, 0, 0.6, 0.5],
      [0.9, 0.8, 0.7, 0.6, 0, 0.7],
      [0.6, 0.5, 0.6, 0.5, 0.7, 0]
    ]
  };
  var EPS_PROTOTYPES = {
    empiricist: [0.72, 0.14, 0.03, 0.04, 0.05, 0.02],
    institutionalist: [0.15, 0.68, 0.05, 0.03, 0.06, 0.03],
    traditionalist: [0.04, 0.08, 0.7, 0.06, 0.08, 0.04],
    intuitionist: [0.05, 0.05, 0.08, 0.68, 0.09, 0.05],
    autonomous: [0.08, 0.08, 0.08, 0.1, 0.6, 0.06],
    nihilist: [0.03, 0.04, 0.04, 0.05, 0.1, 0.74]
  };
  var AES_PROTOTYPES = {
    statesman: [0.7, 0.1, 0.04, 0.06, 0.04, 0.06],
    technocrat: [0.08, 0.74, 0.04, 0.04, 0.03, 0.07],
    pastoral: [0.06, 0.05, 0.72, 0.07, 0.03, 0.07],
    authentic: [0.05, 0.05, 0.08, 0.7, 0.05, 0.07],
    fighter: [0.04, 0.03, 0.04, 0.08, 0.73, 0.08],
    visionary: [0.06, 0.08, 0.05, 0.06, 0.08, 0.67]
  };

  // src/config/questions.representative.ts
  var REPRESENTATIVE_QUESTIONS = [
    {
      id: 1,
      stage: "fixed12",
      section: "I",
      promptShort: "political_content_frequency",
      uiType: "single_choice",
      quality: 0.92,
      rewriteNeeded: false,
      touchProfile: [
        { node: "ENG", kind: "continuous", role: "position", weight: 0.85, touchType: "behavior_frequency" },
        { node: "ENG", kind: "continuous", role: "salience", weight: 0.6, touchType: "behavior_frequency" },
        { node: "PF", kind: "continuous", role: "salience", weight: 0.2, touchType: "identity_proxy" }
      ],
      optionEvidence: {
        never: {
          continuous: {
            ENG: { pos: [0.7, 0.2, 0.08, 0.02, 0], sal: [0.6, 0.25, 0.1, 0.05] }
          }
        },
        few_days: {
          continuous: {
            ENG: { pos: [0.25, 0.45, 0.2, 0.08, 0.02], sal: [0.25, 0.4, 0.25, 0.1] }
          }
        },
        most_days: {
          continuous: {
            ENG: { pos: [0.03, 0.1, 0.25, 0.4, 0.22], sal: [0.05, 0.15, 0.4, 0.4] }
          }
        },
        every_day: {
          continuous: {
            ENG: { pos: [0, 0.02, 0.08, 0.25, 0.65], sal: [0.02, 0.08, 0.25, 0.65] }
          }
        }
      }
    },
    {
      id: 2,
      stage: "fixed12",
      section: "I",
      promptShort: "political_identity_centrality",
      uiType: "slider",
      quality: 0.94,
      rewriteNeeded: false,
      touchProfile: [
        { node: "PF", kind: "continuous", role: "salience", weight: 0.95, touchType: "direct_centrality" },
        { node: "TRB", kind: "continuous", role: "salience", weight: 0.25, touchType: "identity_proxy" },
        { node: "ENG", kind: "continuous", role: "salience", weight: 0.2, touchType: "identity_proxy" }
      ],
      sliderMap: {
        "0-20": { continuous: { PF: { sal: [0.7, 0.22, 0.07, 0.01] }, ENG: { sal: [0.55, 0.28, 0.12, 0.05] } } },
        "21-40": { continuous: { PF: { sal: [0.25, 0.45, 0.22, 0.08] }, ENG: { sal: [0.25, 0.4, 0.25, 0.1] } } },
        "41-60": { continuous: { PF: { sal: [0.08, 0.3, 0.4, 0.22] }, ENG: { sal: [0.1, 0.25, 0.38, 0.27] } } },
        "61-80": { continuous: { PF: { sal: [0.02, 0.1, 0.38, 0.5] }, ENG: { sal: [0.05, 0.12, 0.33, 0.5] } } },
        "81-100": { continuous: { PF: { sal: [0, 0.03, 0.22, 0.75] }, ENG: { sal: [0.02, 0.05, 0.23, 0.7] } } }
      }
    },
    {
      id: 11,
      stage: "fixed12",
      section: "I",
      promptShort: "nyt_headline_click",
      uiType: "single_choice",
      quality: 0.86,
      rewriteNeeded: false,
      touchProfile: [
        { node: "EPS", kind: "categorical", role: "category", weight: 0.95, touchType: "taste_proxy" },
        { node: "AES", kind: "categorical", role: "category", weight: 0.45, touchType: "style_proxy" },
        { node: "ENG", kind: "continuous", role: "salience", weight: 0.15, touchType: "attention_proxy" }
      ],
      optionEvidence: {
        timeless_principles: {
          categorical: { EPS: { cat: EPS_PROTOTYPES.traditionalist } }
        },
        weird_science: {
          categorical: {
            EPS: { cat: EPS_PROTOTYPES.empiricist },
            AES: { cat: AES_PROTOTYPES.visionary }
          }
        },
        practical_tips: {
          categorical: {
            EPS: { cat: EPS_PROTOTYPES.institutionalist },
            AES: { cat: AES_PROTOTYPES.technocrat }
          }
        },
        other_side_bad: {
          categorical: {
            EPS: { cat: EPS_PROTOTYPES.autonomous },
            AES: { cat: AES_PROTOTYPES.fighter }
          }
        }
      }
    },
    {
      id: 15,
      stage: "fixed12",
      section: "II",
      promptShort: "inequality_causes_allocation",
      uiType: "allocation",
      quality: 0.91,
      rewriteNeeded: false,
      touchProfile: [
        { node: "MAT", kind: "continuous", role: "position", weight: 0.85, touchType: "causal_allocation" },
        { node: "ONT_S", kind: "continuous", role: "position", weight: 0.55, touchType: "causal_allocation" },
        { node: "MAT", kind: "continuous", role: "salience", weight: 0.55, touchType: "derived_allocation_concentration" },
        { node: "ONT_S", kind: "continuous", role: "salience", weight: 0.5, touchType: "derived_allocation_concentration" }
      ],
      allocationMap: {
        effort_choices: { continuous: { MAT: 0.8, ONT_S: -0.5, COM: -0.4 } },
        family_background: { continuous: { MAT: -0.6, ONT_S: -0.7, COM: 0.3 } },
        discrimination_bias: { continuous: { MAT: -0.8, ONT_S: -0.8, COM: 0.5 } },
        luck_random: { continuous: { ONT_S: -0.4, COM: 0.2 } }
      }
    },
    {
      id: 20,
      stage: "fixed12",
      section: "II",
      promptShort: "bad_outcomes_blame_allocation",
      uiType: "allocation",
      quality: 0.9,
      rewriteNeeded: false,
      touchProfile: [
        { node: "ONT_S", kind: "continuous", role: "position", weight: 0.85, touchType: "causal_allocation" },
        { node: "ZS", kind: "continuous", role: "position", weight: 0.55, touchType: "conflict_attribution" },
        { node: "ONT_H", kind: "continuous", role: "position", weight: 0.25, touchType: "motive_model" },
        { node: "ZS", kind: "continuous", role: "salience", weight: 0.5, touchType: "derived_allocation_concentration" },
        { node: "ONT_S", kind: "continuous", role: "salience", weight: 0.55, touchType: "derived_allocation_concentration" }
      ],
      allocationMap: {
        complex_forces: { continuous: { ONT_S: -0.6, COM: 0.4 } },
        powerful_incompetent: { continuous: { ONT_S: -0.2, COM: -0.3 } },
        powerful_selfish: { continuous: { ZS: 0.9, ONT_H: -0.5, COM: -0.6 } },
        ordinary_choices: { continuous: { ONT_S: 0.8, COM: -0.4 } }
      }
    },
    {
      id: 21,
      stage: "fixed12",
      section: "II",
      promptShort: "controversial_speaker",
      uiType: "single_choice",
      quality: 0.93,
      rewriteNeeded: false,
      touchProfile: [
        { node: "PRO", kind: "continuous", role: "position", weight: 0.8, touchType: "rights_tradeoff" },
        { node: "COM", kind: "continuous", role: "position", weight: 0.35, touchType: "civic_balance" },
        { node: "EPS", kind: "categorical", role: "category", weight: 0.15, touchType: "truth_authority_proxy" }
      ],
      optionEvidence: {
        cancel: {
          continuous: {
            PRO: { pos: [0.55, 0.3, 0.1, 0.04, 0.01] },
            COM: { pos: [0.4, 0.3, 0.15, 0.1, 0.05] }
          }
        },
        restricted: {
          continuous: {
            PRO: { pos: [0.3, 0.35, 0.2, 0.1, 0.05] },
            COM: { pos: [0.2, 0.25, 0.3, 0.15, 0.1] }
          }
        },
        allow_with_counterspeech: {
          continuous: {
            PRO: { pos: [0.1, 0.2, 0.35, 0.25, 0.1] },
            COM: { pos: [0.05, 0.1, 0.2, 0.35, 0.3] }
          }
        },
        allow_no_restrictions: {
          continuous: {
            PRO: { pos: [0.01, 0.04, 0.1, 0.3, 0.55] },
            COM: { pos: [0.1, 0.15, 0.2, 0.25, 0.3] }
          }
        }
      }
    },
    {
      id: 23,
      stage: "fixed12",
      section: "III",
      promptShort: "who_should_shape_a_law",
      uiType: "ranking",
      quality: 0.89,
      rewriteNeeded: false,
      touchProfile: [
        { node: "EPS", kind: "categorical", role: "category", weight: 0.7, touchType: "authority_ranking" },
        { node: "PRO", kind: "continuous", role: "position", weight: 0.25, touchType: "governance_priority" }
      ],
      rankingMap: {
        researchers: { categorical: { EPS: EPS_PROTOTYPES.empiricist } },
        organized_residents: { categorical: { EPS: EPS_PROTOTYPES.autonomous } },
        elected_officials: { continuous: { PRO: 0.4 } },
        elders_religious: {
          categorical: {
            EPS: EPS_PROTOTYPES.traditionalist
          }
        },
        business_stakeholders: {
          categorical: { EPS: EPS_PROTOTYPES.institutionalist },
          continuous: { PRO: -0.3 }
        }
      }
    },
    {
      id: 24,
      stage: "screen20",
      section: "III",
      promptShort: "child_traits",
      uiType: "pairwise",
      quality: 0.9,
      rewriteNeeded: false,
      touchProfile: [
        { node: "EPS", kind: "categorical", role: "category", weight: 0.35, touchType: "socialization_style" },
        { node: "ONT_H", kind: "continuous", role: "position", weight: 0.1, touchType: "human_nature_proxy" }
      ],
      pairMaps: {
        independence_vs_elders: {
          independence: {
            continuous: { ONT_H: 0.25 },
            categorical: { EPS: EPS_PROTOTYPES.autonomous, AES: AES_PROTOTYPES.authentic }
          },
          respect_for_elders: {
            continuous: { ONT_H: -0.25 },
            categorical: { EPS: EPS_PROTOTYPES.traditionalist, AES: AES_PROTOTYPES.pastoral }
          }
        },
        obedience_vs_self_reliance: {
          obedience: {
            continuous: { ONT_H: -0.2 },
            categorical: { EPS: EPS_PROTOTYPES.institutionalist, AES: AES_PROTOTYPES.statesman }
          },
          self_reliance: {
            continuous: { ONT_H: 0.2 },
            categorical: { EPS: EPS_PROTOTYPES.empiricist, AES: AES_PROTOTYPES.technocrat }
          }
        }
      }
    },
    {
      id: 39,
      stage: "screen20",
      section: "IV",
      promptShort: "opponent_model_allocation",
      uiType: "allocation",
      quality: 0.9,
      rewriteNeeded: false,
      touchProfile: [
        { node: "TRB", kind: "continuous", role: "position", weight: 0.75, touchType: "outgroup_model" },
        { node: "COM", kind: "continuous", role: "position", weight: 0.45, touchType: "outgroup_model" },
        { node: "ONT_H", kind: "continuous", role: "position", weight: 0.3, touchType: "motive_model" }
      ],
      allocationMap: {
        legitimate_values: { continuous: { TRB: -0.9, COM: 0.8 } },
        misinformed: { continuous: { TRB: 0.1 } },
        self_interest: { continuous: { ONT_H: -0.5 } },
        bad_motives: { continuous: { TRB: 0.9, ONT_H: -0.8, COM: -0.7 } }
      }
    },
    {
      id: 56,
      stage: "screen20",
      section: "V",
      promptShort: "effective_leader_style",
      uiType: "single_choice",
      quality: 0.95,
      rewriteNeeded: false,
      touchProfile: [
        { node: "AES", kind: "categorical", role: "category", weight: 0.92, touchType: "leader_style" },
        { node: "PRO", kind: "continuous", role: "position", weight: 0.1, touchType: "governance_style" },
        { node: "ENG", kind: "continuous", role: "salience", weight: 0.05, touchType: "mobilization_proxy" },
        { node: "AES", kind: "categorical", role: "salience", weight: 0.88, touchType: "checkbox_salience" }
      ],
      optionEvidence: {
        channel_anger: {
          categorical: { AES: { cat: AES_PROTOTYPES.fighter } }
        },
        paint_vision: {
          categorical: { AES: { cat: AES_PROTOTYPES.visionary } }
        },
        fight_to_win: {
          categorical: { AES: { cat: AES_PROTOTYPES.fighter } }
        },
        master_policy_details: {
          categorical: { AES: { cat: AES_PROTOTYPES.technocrat } }
        },
        build_expert_coalitions: {
          categorical: { AES: { cat: AES_PROTOTYPES.statesman } }
        }
      }
    },
    {
      id: 60,
      stage: "screen20",
      section: "V",
      promptShort: "politically_important_identities",
      uiType: "ranking",
      quality: 0.96,
      rewriteNeeded: false,
      touchProfile: [
        { node: "TRB", kind: "continuous", role: "position", weight: 0.78, touchType: "identity_ranking" },
        { node: "TRB", kind: "continuous", role: "position", weight: 0.5, touchType: "identity_ranking" },
        { node: "PF", kind: "continuous", role: "position", weight: 0.42, touchType: "identity_ranking" },
        { node: "PF", kind: "continuous", role: "salience", weight: 0.52, touchType: "identity_ranking" },
        { node: "TRB_ANCHOR", kind: "derived", role: "anchor", weight: 0.95, touchType: "identity_ranking" }
      ],
      rankingMap: {
        national_identity: { trbAnchor: { national: 1 } },
        ideological_identity: { trbAnchor: { ideological: 1 } },
        religious_identity: { trbAnchor: { religious: 1 } },
        class_identity: { trbAnchor: { class: 1 } },
        ethnic_racial_identity: { trbAnchor: { ethnic_racial: 1 } },
        global_citizen: { trbAnchor: { global: 1 } }
      }
    },
    // =========================================================================
    // SLIDER EVIDENCE MAPS
    // =========================================================================
    // Q3 — cultural_social_placement (slider)
    {
      id: 3,
      stage: "fixed12",
      section: "I",
      promptShort: "cultural_social_placement",
      uiType: "slider",
      quality: 0.9,
      rewriteNeeded: false,
      touchProfile: [
        { node: "CD", kind: "continuous", role: "position", weight: 0.9, touchType: "direct_placement" },
        { node: "CU", kind: "continuous", role: "position", weight: 0.3, touchType: "boundary_proxy" },
        { node: "MOR", kind: "continuous", role: "position", weight: 0.2, touchType: "values_proxy" }
      ],
      sliderMap: {
        "0-20": { continuous: { CD: { pos: [0.6, 0.25, 0.1, 0.04, 0.01] } } },
        "21-40": { continuous: { CD: { pos: [0.3, 0.4, 0.2, 0.07, 0.03] } } },
        "41-60": { continuous: { CD: { pos: [0.08, 0.2, 0.44, 0.2, 0.08] } } },
        "61-80": { continuous: { CD: { pos: [0.03, 0.07, 0.2, 0.4, 0.3] } } },
        "81-100": { continuous: { CD: { pos: [0.01, 0.04, 0.1, 0.25, 0.6] } } }
      }
    },
    // Q4 — cultural_social_salience (slider)
    {
      id: 4,
      stage: "fixed12",
      section: "I",
      promptShort: "cultural_social_salience",
      uiType: "slider",
      quality: 0.93,
      rewriteNeeded: false,
      touchProfile: [
        { node: "CD", kind: "continuous", role: "salience", weight: 0.9, touchType: "direct_salience" },
        { node: "CU", kind: "continuous", role: "salience", weight: 0.45, touchType: "boundary_salience" },
        { node: "MOR", kind: "continuous", role: "salience", weight: 0.2, touchType: "values_salience" }
      ],
      sliderMap: {
        "0-20": { continuous: { CD: { sal: [0.55, 0.3, 0.12, 0.03] }, CU: { sal: [0.5, 0.3, 0.15, 0.05] }, MOR: { sal: [0.5, 0.3, 0.15, 0.05] } } },
        "21-40": { continuous: { CD: { sal: [0.3, 0.4, 0.22, 0.08] }, CU: { sal: [0.3, 0.35, 0.25, 0.1] }, MOR: { sal: [0.3, 0.35, 0.25, 0.1] } } },
        "41-60": { continuous: { CD: { sal: [0.1, 0.3, 0.38, 0.22] }, CU: { sal: [0.12, 0.28, 0.38, 0.22] }, MOR: { sal: [0.15, 0.3, 0.35, 0.2] } } },
        "61-80": { continuous: { CD: { sal: [0.04, 0.12, 0.38, 0.46] }, CU: { sal: [0.05, 0.15, 0.38, 0.42] }, MOR: { sal: [0.08, 0.2, 0.38, 0.34] } } },
        "81-100": { continuous: { CD: { sal: [0.02, 0.08, 0.3, 0.6] }, CU: { sal: [0.03, 0.1, 0.32, 0.55] }, MOR: { sal: [0.05, 0.12, 0.35, 0.48] } } }
      }
    },
    // Q8 — domestic_vs_abroad_lives (slider)
    {
      id: 8,
      stage: "screen20",
      section: "I",
      promptShort: "domestic_vs_abroad_lives",
      uiType: "slider",
      quality: 0.89,
      rewriteNeeded: false,
      touchProfile: [
        { node: "MOR", kind: "continuous", role: "position", weight: 0.9, touchType: "moral_scope_tradeoff" },
        { node: "TRB", kind: "continuous", role: "position", weight: 0.25, touchType: "moral_scope_tradeoff" },
        { node: "ZS", kind: "continuous", role: "position", weight: 0.15, touchType: "moral_scope_tradeoff" },
        { node: "MOR", kind: "continuous", role: "salience", weight: 0.85, touchType: "checkbox_salience" }
      ],
      sliderMap: {
        "0-20": { continuous: { MOR: { pos: [0.55, 0.28, 0.12, 0.04, 0.01] } } },
        "21-40": { continuous: { MOR: { pos: [0.25, 0.4, 0.22, 0.1, 0.03] } } },
        "41-60": { continuous: { MOR: { pos: [0.08, 0.18, 0.48, 0.18, 0.08] } } },
        "61-80": { continuous: { MOR: { pos: [0.03, 0.1, 0.22, 0.4, 0.25] } } },
        "81-100": { continuous: { MOR: { pos: [0.01, 0.04, 0.12, 0.28, 0.55] } } }
      }
    },
    // Q12 — guess_top_marginal_tax_rate (slider)
    {
      id: 12,
      stage: "stage2",
      section: "II",
      promptShort: "guess_top_marginal_tax_rate",
      uiType: "slider",
      quality: 0.68,
      rewriteNeeded: false,
      touchProfile: [
        { node: "EPS", kind: "categorical", role: "category", weight: 0.35, touchType: "factual_calibration" },
        { node: "ENG", kind: "continuous", role: "position", weight: 0.1, touchType: "policy_attention" }
      ],
      sliderMap: {
        "0-20": { categorical: { EPS: { cat: EPS_PROTOTYPES.intuitionist } } },
        "21-40": { categorical: { EPS: { cat: EPS_PROTOTYPES.empiricist } } },
        "41-60": { categorical: { EPS: { cat: EPS_PROTOTYPES.institutionalist } } },
        "61-80": { categorical: { EPS: { cat: EPS_PROTOTYPES.institutionalist } } },
        "81-100": { categorical: { EPS: { cat: EPS_PROTOTYPES.intuitionist } } }
      }
    },
    // Q13 — preferred_top_marginal_tax_rate (slider)
    {
      id: 13,
      stage: "stage2",
      section: "II",
      promptShort: "preferred_top_marginal_tax_rate",
      uiType: "slider",
      quality: 0.88,
      rewriteNeeded: false,
      touchProfile: [
        { node: "MAT", kind: "continuous", role: "position", weight: 0.92, touchType: "policy_preference" },
        { node: "MAT", kind: "continuous", role: "salience", weight: 0.35, touchType: "policy_preference" }
      ],
      sliderMap: {
        "0-20": { continuous: { MAT: { pos: [0.01, 0.04, 0.1, 0.25, 0.6] } } },
        "21-40": { continuous: { MAT: { pos: [0.03, 0.07, 0.2, 0.4, 0.3] } } },
        "41-60": { continuous: { MAT: { pos: [0.08, 0.18, 0.48, 0.18, 0.08] } } },
        "61-80": { continuous: { MAT: { pos: [0.3, 0.4, 0.2, 0.07, 0.03] } } },
        "81-100": { continuous: { MAT: { pos: [0.6, 0.25, 0.1, 0.04, 0.01] } } }
      }
    },
    // Q19 — human_progress_salience (slider)
    {
      id: 19,
      stage: "screen20",
      section: "II",
      promptShort: "human_progress_salience",
      uiType: "slider",
      quality: 0.93,
      rewriteNeeded: false,
      touchProfile: [
        { node: "ONT_H", kind: "continuous", role: "salience", weight: 0.95, touchType: "direct_salience" }
      ],
      sliderMap: {
        "0-20": { continuous: { ONT_H: { sal: [0.55, 0.3, 0.12, 0.03] } } },
        "21-40": { continuous: { ONT_H: { sal: [0.25, 0.4, 0.25, 0.1] } } },
        "41-60": { continuous: { ONT_H: { sal: [0.08, 0.28, 0.4, 0.24] } } },
        "61-80": { continuous: { ONT_H: { sal: [0.03, 0.12, 0.4, 0.45] } } },
        "81-100": { continuous: { ONT_H: { sal: [0.02, 0.08, 0.3, 0.6] } } }
      }
    },
    // Q35 — percent_groups_want_best_share_values (slider)
    {
      id: 35,
      stage: "stage2",
      section: "III",
      promptShort: "percent_groups_want_best_share_values",
      uiType: "slider",
      quality: 0.84,
      rewriteNeeded: false,
      touchProfile: [
        { node: "TRB", kind: "continuous", role: "position", weight: 0.8, touchType: "outgroup_trust_estimate" },
        { node: "COM", kind: "continuous", role: "position", weight: 0.35, touchType: "outgroup_trust_estimate" },
        { node: "ZS", kind: "continuous", role: "position", weight: 0.15, touchType: "outgroup_trust_estimate" }
      ],
      sliderMap: {
        "0-20": { continuous: { TRB: { pos: [0.01, 0.04, 0.12, 0.28, 0.55] }, ZS: {} } },
        "21-40": { continuous: { TRB: { pos: [0.03, 0.09, 0.2, 0.38, 0.3] }, ZS: {} } },
        "41-60": { continuous: { TRB: { pos: [0.08, 0.18, 0.48, 0.18, 0.08] }, ZS: {} } },
        "61-80": { continuous: { TRB: { pos: [0.3, 0.38, 0.2, 0.09, 0.03] }, ZS: {} } },
        "81-100": { continuous: { TRB: { pos: [0.55, 0.28, 0.12, 0.04, 0.01] }, ZS: {} } }
      }
    },
    // Q38 — rules_procedures_matter_salience (slider)
    {
      id: 38,
      stage: "screen20",
      section: "IV",
      promptShort: "rules_procedures_matter_salience",
      uiType: "slider",
      quality: 0.94,
      rewriteNeeded: false,
      touchProfile: [
        { node: "PRO", kind: "continuous", role: "salience", weight: 0.95, touchType: "direct_salience" }
      ],
      sliderMap: {
        "0-20": { continuous: { PRO: { sal: [0.55, 0.3, 0.12, 0.03] } } },
        "21-40": { continuous: { PRO: { sal: [0.25, 0.4, 0.25, 0.1] } } },
        "41-60": { continuous: { PRO: { sal: [0.08, 0.28, 0.4, 0.24] } } },
        "61-80": { continuous: { PRO: { sal: [0.03, 0.12, 0.4, 0.45] } } },
        "81-100": { continuous: { PRO: { sal: [0.02, 0.08, 0.3, 0.6] } } }
      }
    },
    // Q40 — opponents_matter_to_identity (slider)
    {
      id: 40,
      stage: "fixed12",
      section: "IV",
      promptShort: "opponents_matter_to_identity",
      uiType: "slider",
      quality: 0.91,
      rewriteNeeded: false,
      touchProfile: [
        { node: "PF", kind: "continuous", role: "salience", weight: 0.7, touchType: "identity_enemy_link" },
        { node: "TRB", kind: "continuous", role: "salience", weight: 0.45, touchType: "identity_enemy_link" }
      ],
      sliderMap: {
        "0-20": { continuous: { PF: { sal: [0.5, 0.3, 0.15, 0.05] }, TRB: { sal: [0.55, 0.3, 0.12, 0.03] } } },
        "21-40": { continuous: { PF: { sal: [0.25, 0.38, 0.27, 0.1] }, TRB: { sal: [0.25, 0.4, 0.25, 0.1] } } },
        "41-60": { continuous: { PF: { sal: [0.1, 0.25, 0.4, 0.25] }, TRB: { sal: [0.1, 0.28, 0.38, 0.24] } } },
        "61-80": { continuous: { PF: { sal: [0.04, 0.12, 0.38, 0.46] }, TRB: { sal: [0.04, 0.14, 0.4, 0.42] } } },
        "81-100": { continuous: { PF: { sal: [0.02, 0.08, 0.3, 0.6] }, TRB: { sal: [0.02, 0.08, 0.35, 0.55] } } }
      }
    },
    // Q44 — views_changed_in_10_years (slider)
    {
      id: 44,
      stage: "stage3",
      section: "IV",
      promptShort: "views_changed_in_10_years",
      uiType: "slider",
      quality: 0.58,
      rewriteNeeded: false,
      touchProfile: [
        { node: "PF", kind: "continuous", role: "position", weight: 0.18, touchType: "identity_rigidity_proxy" },
        { node: "EPS", kind: "categorical", role: "category", weight: 0.6, touchType: "updating_style_proxy" }
      ],
      sliderMap: {
        "0-20": { continuous: { PF: { pos: [0.03, 0.07, 0.15, 0.3, 0.45] } } },
        "21-40": { continuous: { PF: { pos: [0.05, 0.1, 0.25, 0.3, 0.3] } } },
        "41-60": { continuous: { PF: { pos: [0.12, 0.22, 0.32, 0.22, 0.12] } } },
        "61-80": { continuous: { PF: { pos: [0.3, 0.3, 0.25, 0.1, 0.05] } } },
        "81-100": { continuous: { PF: { pos: [0.45, 0.3, 0.15, 0.07, 0.03] } } }
      }
    },
    // Q49 — social_progress_salience (slider)
    {
      id: 49,
      stage: "stage2",
      section: "IV",
      promptShort: "social_progress_salience",
      uiType: "slider",
      quality: 0.92,
      rewriteNeeded: false,
      touchProfile: [
        { node: "ONT_H", kind: "continuous", role: "salience", weight: 0.95, touchType: "direct_salience" },
        { node: "ONT_S", kind: "continuous", role: "salience", weight: 0.2, touchType: "progress_salience" }
      ],
      sliderMap: {
        "0-20": { continuous: { ONT_H: { sal: [0.55, 0.3, 0.12, 0.03] }, ONT_S: { sal: [0.5, 0.3, 0.15, 0.05] } } },
        "21-40": { continuous: { ONT_H: { sal: [0.25, 0.4, 0.25, 0.1] }, ONT_S: { sal: [0.28, 0.38, 0.24, 0.1] } } },
        "41-60": { continuous: { ONT_H: { sal: [0.08, 0.28, 0.4, 0.24] }, ONT_S: { sal: [0.12, 0.28, 0.38, 0.22] } } },
        "61-80": { continuous: { ONT_H: { sal: [0.03, 0.12, 0.4, 0.45] }, ONT_S: { sal: [0.05, 0.18, 0.4, 0.37] } } },
        "81-100": { continuous: { ONT_H: { sal: [0.02, 0.08, 0.3, 0.6] }, ONT_S: { sal: [0.03, 0.12, 0.35, 0.5] } } }
      }
    },
    // Q51 — immigration_national_identity_salience (slider)
    {
      id: 51,
      stage: "screen20",
      section: "IV",
      promptShort: "immigration_national_identity_salience",
      uiType: "slider",
      quality: 0.93,
      rewriteNeeded: false,
      touchProfile: [
        { node: "CU", kind: "continuous", role: "salience", weight: 0.9, touchType: "direct_salience" },
        { node: "CD", kind: "continuous", role: "salience", weight: 0.25, touchType: "direct_salience" },
        { node: "TRB", kind: "continuous", role: "salience", weight: 0.2, touchType: "identity_salience" },
        { node: "TRB_ANCHOR", kind: "derived", role: "anchor", weight: 0.25, touchType: "nationality_anchor" }
      ],
      sliderMap: {
        "0-20": { continuous: { CU: { sal: [0.55, 0.3, 0.12, 0.03] }, CD: { sal: [0.5, 0.3, 0.15, 0.05] }, TRB: { sal: [0.5, 0.3, 0.15, 0.05] } } },
        "21-40": { continuous: { CU: { sal: [0.25, 0.4, 0.25, 0.1] }, CD: { sal: [0.28, 0.38, 0.24, 0.1] }, TRB: { sal: [0.28, 0.38, 0.24, 0.1] } } },
        "41-60": { continuous: { CU: { sal: [0.08, 0.28, 0.4, 0.24] }, CD: { sal: [0.12, 0.28, 0.38, 0.22] }, TRB: { sal: [0.12, 0.28, 0.38, 0.22] } } },
        "61-80": { continuous: { CU: { sal: [0.03, 0.12, 0.4, 0.45] }, CD: { sal: [0.05, 0.18, 0.4, 0.37] }, TRB: { sal: [0.05, 0.18, 0.4, 0.37] } } },
        "81-100": { continuous: { CU: { sal: [0.02, 0.08, 0.3, 0.6] }, CD: { sal: [0.03, 0.12, 0.35, 0.5] }, TRB: { sal: [0.03, 0.12, 0.35, 0.5] } } }
      }
    },
    // =========================================================================
    // SINGLE_CHOICE EVIDENCE MAPS (batch 1: Q6, Q7, Q9, Q10, Q14, Q16, Q17)
    // =========================================================================
    // Q6 — surveillance_enforcement_due_process_bundle
    {
      id: 6,
      stage: "stage3",
      section: "I",
      promptShort: "surveillance_enforcement_due_process_bundle",
      uiType: "single_choice",
      quality: 0.45,
      rewriteNeeded: true,
      touchProfile: [
        { node: "PRO", kind: "continuous", role: "position", weight: 0.45, touchType: "policy_bundle" },
        { node: "ONT_H", kind: "continuous", role: "position", weight: 0.15, touchType: "policy_bundle" }
      ],
      optionEvidence: {
        due_process_priority: {
          continuous: {
            PRO: { pos: [0.02, 0.08, 0.2, 0.38, 0.32] },
            ONT_H: { pos: [0.05, 0.12, 0.3, 0.33, 0.2] }
          }
        },
        balanced_security: {
          continuous: {
            PRO: { pos: [0.08, 0.2, 0.44, 0.2, 0.08] }
          }
        },
        security_priority: {
          continuous: {
            PRO: { pos: [0.32, 0.38, 0.2, 0.08, 0.02] },
            ONT_H: { pos: [0.2, 0.33, 0.3, 0.12, 0.05] }
          }
        }
      }
    },
    // Q7 — coalition_vs_principle
    {
      id: 7,
      stage: "screen20",
      section: "I",
      promptShort: "coalition_vs_principle",
      uiType: "single_choice",
      quality: 0.88,
      rewriteNeeded: false,
      touchProfile: [
        { node: "COM", kind: "continuous", role: "position", weight: 0.85, touchType: "principle_tradeoff" },
        { node: "TRB", kind: "continuous", role: "position", weight: 0.25, touchType: "principle_tradeoff" },
        { node: "PRO", kind: "continuous", role: "position", weight: 0.2, touchType: "principle_tradeoff" }
      ],
      optionEvidence: {
        principle_first: {
          continuous: {
            COM: { pos: [0.32, 0.38, 0.2, 0.08, 0.02] }
          }
        },
        coalition_first: {
          continuous: {
            COM: { pos: [0.02, 0.08, 0.2, 0.38, 0.32] }
          }
        },
        depends_on_issue: {
          continuous: {
            COM: { pos: [0.1, 0.22, 0.42, 0.18, 0.08] }
          }
        }
      }
    },
    // Q9 — politics_at_social_gatherings
    {
      id: 9,
      stage: "stage2",
      section: "I",
      promptShort: "politics_at_social_gatherings",
      uiType: "single_choice",
      quality: 0.86,
      rewriteNeeded: false,
      touchProfile: [
        { node: "ENG", kind: "continuous", role: "position", weight: 0.6, touchType: "social_behavior" },
        { node: "COM", kind: "continuous", role: "position", weight: 0.45, touchType: "social_behavior" },
        { node: "PF", kind: "continuous", role: "salience", weight: 0.15, touchType: "social_behavior" }
      ],
      optionEvidence: {
        // V1: "Share your views but try to keep it civil"
        share_views: {
          continuous: {
            ENG: { pos: [0.05, 0.15, 0.35, 0.3, 0.15] },
            COM: { pos: [0.06, 0.12, 0.3, 0.32, 0.2] }
          }
        },
        // V1: "Avoid entirely — politics ruins social situations"
        avoid_entirely: {
          continuous: {
            ENG: { pos: [0.4, 0.3, 0.18, 0.08, 0.04] },
            COM: { pos: [0.08, 0.15, 0.28, 0.3, 0.19] }
          }
        },
        // V1: "Try to change the subject — not the place"
        change_subject: {
          continuous: {
            ENG: { pos: [0.3, 0.3, 0.25, 0.1, 0.05] },
            COM: { pos: [0.05, 0.12, 0.28, 0.35, 0.2] }
          }
        },
        // V1: "Engage passionately — these conversations matter"
        engage_passionately: {
          continuous: {
            ENG: { pos: [0.02, 0.06, 0.15, 0.35, 0.42] },
            COM: { pos: [0.15, 0.22, 0.28, 0.22, 0.13] }
          }
        },
        // V1: "Listen mostly, share selectively"
        listen_mostly: {
          continuous: {
            ENG: { pos: [0.15, 0.25, 0.35, 0.18, 0.07] },
            COM: { pos: [0.04, 0.1, 0.25, 0.35, 0.26] }
          }
        }
      }
    },
    // Q10 — climate_energy_bundle
    {
      id: 10,
      stage: "stage3",
      section: "I",
      promptShort: "climate_energy_bundle",
      uiType: "single_choice",
      quality: 0.42,
      rewriteNeeded: true,
      touchProfile: [
        { node: "MAT", kind: "continuous", role: "position", weight: 0.35, touchType: "policy_bundle" },
        { node: "PRO", kind: "continuous", role: "position", weight: 0.2, touchType: "policy_bundle" },
        { node: "ONT_S", kind: "continuous", role: "position", weight: 0.2, touchType: "policy_bundle" },
        { node: "ZS", kind: "continuous", role: "position", weight: 0.1, touchType: "policy_bundle" }
      ],
      optionEvidence: {
        aggressive_transition: {
          continuous: {
            MAT: { pos: [0.35, 0.35, 0.2, 0.08, 0.02] },
            ONT_S: { pos: [0.27, 0.35, 0.25, 0.1, 0.03] }
          }
        },
        gradual_transition: {
          continuous: {
            MAT: { pos: [0.1, 0.24, 0.4, 0.18, 0.08] },
            ONT_S: { pos: [0.1, 0.24, 0.4, 0.18, 0.08] }
          }
        },
        market_led: {
          continuous: {
            MAT: { pos: [0.04, 0.09, 0.22, 0.35, 0.3] },
            ONT_S: { pos: [0.06, 0.14, 0.3, 0.3, 0.2] }
          }
        },
        no_action_needed: {
          continuous: {
            MAT: { pos: [0.03, 0.07, 0.15, 0.3, 0.45] },
            ONT_S: { pos: [0.05, 0.1, 0.25, 0.3, 0.3] }
          }
        }
      }
    },
    // Q14 — university_admissions_approach
    {
      id: 14,
      stage: "stage2",
      section: "II",
      promptShort: "university_admissions_approach",
      uiType: "single_choice",
      quality: 0.83,
      rewriteNeeded: false,
      touchProfile: [
        { node: "MAT", kind: "continuous", role: "position", weight: 0.65, touchType: "fairness_design" },
        { node: "MOR", kind: "continuous", role: "position", weight: 0.2, touchType: "fairness_design" },
        { node: "PRO", kind: "continuous", role: "position", weight: 0.15, touchType: "allocation_rule" }
      ],
      optionEvidence: {
        strict_merit: {
          continuous: {
            MAT: { pos: [0.02, 0.05, 0.13, 0.3, 0.5] },
            MOR: { pos: [0.35, 0.3, 0.22, 0.09, 0.04] }
          }
        },
        holistic_review: {
          continuous: {
            MAT: { pos: [0.15, 0.3, 0.35, 0.15, 0.05] },
            MOR: { pos: [0.05, 0.12, 0.3, 0.33, 0.2] }
          }
        },
        affirmative_action: {
          continuous: {
            MAT: { pos: [0.4, 0.34, 0.18, 0.06, 0.02] },
            MOR: { pos: [0.03, 0.08, 0.22, 0.35, 0.32] }
          }
        },
        lottery: {
          continuous: {
            MAT: { pos: [0.19, 0.28, 0.3, 0.15, 0.08] }
          }
        }
      }
    },
    // Q16 — criminal_justice_bundle
    {
      id: 16,
      stage: "stage3",
      section: "II",
      promptShort: "criminal_justice_bundle",
      uiType: "single_choice",
      quality: 0.4,
      rewriteNeeded: true,
      touchProfile: [
        { node: "PRO", kind: "continuous", role: "position", weight: 0.3, touchType: "policy_bundle" },
        { node: "ONT_H", kind: "continuous", role: "position", weight: 0.2, touchType: "policy_bundle" },
        { node: "COM", kind: "continuous", role: "position", weight: 0.1, touchType: "policy_bundle" }
      ],
      optionEvidence: {
        rehabilitation_focus: {
          continuous: {
            PRO: { pos: [0.05, 0.12, 0.25, 0.35, 0.23] },
            ONT_H: { pos: [0.04, 0.1, 0.25, 0.38, 0.23] }
          }
        },
        balanced_approach: {
          continuous: {
            PRO: { pos: [0.1, 0.2, 0.4, 0.2, 0.1] }
          }
        },
        punishment_focus: {
          continuous: {
            PRO: { pos: [0.3, 0.35, 0.22, 0.09, 0.04] },
            ONT_H: { pos: [0.25, 0.33, 0.25, 0.12, 0.05] }
          }
        }
      }
    },
    // Q17 — ceo_worker_pay_ratio
    {
      id: 17,
      stage: "stage2",
      section: "II",
      promptShort: "ceo_worker_pay_ratio",
      uiType: "single_choice",
      quality: 0.87,
      rewriteNeeded: false,
      touchProfile: [
        { node: "MAT", kind: "continuous", role: "position", weight: 0.9, touchType: "fairness_threshold" },
        { node: "MAT", kind: "continuous", role: "salience", weight: 0.85, touchType: "checkbox_salience" }
      ],
      optionEvidence: {
        ratio_10_to_1: {
          continuous: {
            MAT: { pos: [0.45, 0.35, 0.15, 0.04, 0.01] }
          }
        },
        ratio_100_to_1: {
          continuous: {
            MAT: { pos: [0.1, 0.25, 0.35, 0.2, 0.1] }
          }
        },
        ratio_1000_to_1: {
          continuous: {
            MAT: { pos: [0.04, 0.1, 0.25, 0.35, 0.26] }
          }
        },
        market_decides: {
          continuous: {
            MAT: { pos: [0.03, 0.07, 0.15, 0.3, 0.45] }
          }
        }
      }
    },
    // =========================================================================
    // SINGLE_CHOICE EVIDENCE MAPS (batch 2: Q18, Q25, Q26, Q27, Q28, Q30, Q31)
    // =========================================================================
    // Q18 — human_progress_view
    {
      id: 18,
      stage: "screen20",
      section: "II",
      promptShort: "human_progress_view",
      uiType: "single_choice",
      quality: 0.88,
      rewriteNeeded: false,
      touchProfile: [
        { node: "ONT_H", kind: "continuous", role: "position", weight: 0.9, touchType: "ontology_direct" },
        { node: "ONT_H", kind: "continuous", role: "salience", weight: 0.2, touchType: "ontology_direct" },
        { node: "ONT_S", kind: "continuous", role: "position", weight: 0.15, touchType: "worldview_proxy" }
      ],
      optionEvidence: {
        steady_improvement: {
          continuous: {
            ONT_H: { pos: [0.01, 0.05, 0.15, 0.38, 0.41] }
          }
        },
        gradual_progress: {
          continuous: {
            ONT_H: { pos: [0.04, 0.12, 0.3, 0.35, 0.19] }
          }
        },
        cyclical: {
          continuous: {
            ONT_H: { pos: [0.15, 0.25, 0.35, 0.18, 0.07] }
          }
        },
        decline: {
          continuous: {
            ONT_H: { pos: [0.42, 0.3, 0.18, 0.07, 0.03] }
          }
        }
      }
    },
    // Q25 — criminal_trial_error_tradeoff (error_tradeoff with ratio slider)
    // "In criminal trials, which type of error is worse?"
    // A: Convicting an innocent person  B: Letting a guilty person go free
    // Ratio slider: 1.5:1 → 100+:1 drives salience
    {
      id: 25,
      stage: "screen20",
      section: "III",
      promptShort: "criminal_trial_error_tradeoff",
      uiType: "single_choice",
      quality: 0.92,
      rewriteNeeded: false,
      options: ["convict_innocent", "free_guilty"],
      touchProfile: [
        { node: "PRO", kind: "continuous", role: "position", weight: 0.75, touchType: "error_asymmetry" },
        { node: "PRO", kind: "continuous", role: "salience", weight: 0.7, touchType: "ratio_salience" },
        { node: "MOR", kind: "continuous", role: "position", weight: 0.12, touchType: "human_motive_proxy" }
      ],
      optionEvidence: {
        convict_innocent: {
          continuous: {
            PRO: { pos: [0.02, 0.08, 0.2, 0.35, 0.35] },
            MOR: { pos: [0.08, 0.18, 0.3, 0.26, 0.18] }
          }
        },
        free_guilty: {
          continuous: {
            PRO: { pos: [0.35, 0.35, 0.2, 0.08, 0.02] },
            MOR: { pos: [0.18, 0.26, 0.3, 0.18, 0.08] }
          }
        }
      }
    },
    // Q27 — welfare_error_tradeoff (error_tradeoff with ratio slider)
    // "In welfare programs, which error is worse?"
    // A: Giving benefits to someone who doesn't qualify  B: Denying benefits to someone who genuinely needs them
    {
      id: 27,
      stage: "stage2",
      section: "III",
      promptShort: "welfare_error_tradeoff",
      uiType: "single_choice",
      quality: 0.89,
      rewriteNeeded: false,
      options: ["fp", "fn"],
      touchProfile: [
        { node: "MAT", kind: "continuous", role: "position", weight: 0.72, touchType: "error_asymmetry" },
        { node: "MAT", kind: "continuous", role: "salience", weight: 0.62, touchType: "ratio_salience" },
        { node: "PRO", kind: "continuous", role: "position", weight: 0.22, touchType: "error_asymmetry" },
        { node: "MOR", kind: "continuous", role: "position", weight: 0.24, touchType: "deservingness_proxy" }
      ],
      optionEvidence: {
        fp: {
          continuous: {
            MAT: { pos: [0.02, 0.08, 0.22, 0.35, 0.33] },
            MOR: { pos: [0.27, 0.35, 0.25, 0.1, 0.03] },
            PRO: { pos: [0.1, 0.18, 0.32, 0.24, 0.16] }
          }
        },
        fn: {
          continuous: {
            MAT: { pos: [0.33, 0.35, 0.22, 0.08, 0.02] },
            MOR: { pos: [0.03, 0.1, 0.25, 0.35, 0.27] },
            PRO: { pos: [0.16, 0.24, 0.32, 0.18, 0.1] }
          }
        }
      }
    },
    // Q28 — mask_mandate_acceptability
    {
      id: 28,
      stage: "stage2",
      section: "III",
      promptShort: "mask_mandate_acceptability",
      uiType: "single_choice",
      quality: 0.76,
      rewriteNeeded: false,
      touchProfile: [
        { node: "PRO", kind: "continuous", role: "position", weight: 0.55, touchType: "public_health_authority" },
        { node: "CU", kind: "continuous", role: "position", weight: 0.25, touchType: "collective_uniformity" },
        { node: "COM", kind: "continuous", role: "position", weight: 0.1, touchType: "collective_action_proxy" }
      ],
      optionEvidence: {
        accept_mandate: {
          continuous: {
            PRO: { pos: [0.25, 0.32, 0.25, 0.12, 0.06] },
            CU: { pos: [0.04, 0.1, 0.25, 0.35, 0.26] }
          }
        },
        comply_reluctantly: {
          continuous: {
            PRO: { pos: [0.1, 0.2, 0.4, 0.2, 0.1] },
            CU: { pos: [0.1, 0.2, 0.35, 0.25, 0.1] }
          }
        },
        resist_mandate: {
          continuous: {
            PRO: { pos: [0.04, 0.1, 0.2, 0.32, 0.34] },
            CU: { pos: [0.28, 0.3, 0.25, 0.12, 0.05] }
          }
        }
      }
    },
    // Q30 — information_control_error_tradeoff
    {
      id: 30,
      stage: "stage2",
      section: "III",
      promptShort: "information_control_error_tradeoff",
      uiType: "single_choice",
      quality: 0.9,
      rewriteNeeded: false,
      options: ["allow_harmful", "censor_legitimate"],
      touchProfile: [
        { node: "PRO", kind: "continuous", role: "position", weight: 0.72, touchType: "speech_harm_tradeoff" },
        { node: "PRO", kind: "continuous", role: "salience", weight: 0.62, touchType: "ratio_salience" },
        { node: "EPS", kind: "categorical", role: "category", weight: 0.2, touchType: "truth_authority_proxy" },
        { node: "COM", kind: "continuous", role: "position", weight: 0.12, touchType: "pluralism_proxy" }
      ],
      optionEvidence: {
        allow_harmful: {
          continuous: {
            PRO: { pos: [0.02, 0.06, 0.15, 0.35, 0.42] },
            COM: { pos: [0.18, 0.24, 0.3, 0.18, 0.1] }
          },
          categorical: { EPS: { cat: EPS_PROTOTYPES.autonomous } }
        },
        censor_legitimate: {
          continuous: {
            PRO: { pos: [0.4, 0.32, 0.18, 0.07, 0.03] },
            COM: { pos: [0.1, 0.18, 0.3, 0.24, 0.18] }
          },
          categorical: { EPS: { cat: EPS_PROTOTYPES.institutionalist } }
        }
      }
    },
    // Q31 — trade_liberalization_effects
    {
      id: 31,
      stage: "fixed12",
      section: "III",
      promptShort: "trade_liberalization_effects",
      uiType: "single_choice",
      quality: 0.9,
      rewriteNeeded: false,
      touchProfile: [
        { node: "ZS", kind: "continuous", role: "position", weight: 0.85, touchType: "macro_sum_view" },
        { node: "ZS", kind: "continuous", role: "salience", weight: 0.5, touchType: "macro_sum_view" },
        { node: "ONT_S", kind: "continuous", role: "position", weight: 0.45, touchType: "systems_view" },
        { node: "MAT", kind: "continuous", role: "position", weight: 0.2, touchType: "distribution_proxy" }
      ],
      optionEvidence: {
        net_positive_clear: {
          continuous: {
            ZS: { pos: [0.41, 0.38, 0.15, 0.05, 0.01] },
            ONT_S: { pos: [0.24, 0.38, 0.25, 0.1, 0.03] }
          }
        },
        net_positive_but_uneven: {
          continuous: {
            ZS: { pos: [0.15, 0.3, 0.35, 0.15, 0.05] },
            ONT_S: { pos: [0.12, 0.28, 0.4, 0.15, 0.05] }
          }
        },
        mixed_effects: {
          continuous: {
            ZS: { pos: [0.07, 0.18, 0.35, 0.25, 0.15] },
            ONT_S: { pos: [0.08, 0.2, 0.4, 0.22, 0.1] }
          }
        },
        mostly_harmful: {
          continuous: {
            ZS: { pos: [0.03, 0.07, 0.18, 0.3, 0.42] },
            ONT_S: { pos: [0.05, 0.12, 0.28, 0.3, 0.25] }
          }
        }
      }
    },
    // =========================================================================
    // SINGLE_CHOICE EVIDENCE MAPS (batch 3: Q33, Q34, Q36, Q37, Q41, Q42, Q43)
    // =========================================================================
    // Q33 — immigration_enforcement_error_tradeoff
    {
      id: 33,
      stage: "stage2",
      section: "III",
      promptShort: "immigration_enforcement_error_tradeoff",
      uiType: "single_choice",
      quality: 0.86,
      rewriteNeeded: false,
      options: ["deport_legal", "let_stay_illegal"],
      touchProfile: [
        { node: "PRO", kind: "continuous", role: "position", weight: 0.62, touchType: "boundary_error_asymmetry" },
        { node: "PRO", kind: "continuous", role: "salience", weight: 0.56, touchType: "ratio_salience" },
        { node: "CU", kind: "continuous", role: "position", weight: 0.22, touchType: "boundary_error_asymmetry" },
        { node: "ONT_S", kind: "continuous", role: "position", weight: 0.12, touchType: "boundary_error_asymmetry" }
      ],
      optionEvidence: {
        deport_legal: {
          continuous: {
            PRO: { pos: [0.06, 0.12, 0.26, 0.3, 0.26] },
            CU: { pos: [0.06, 0.12, 0.24, 0.3, 0.28] },
            ONT_S: { pos: [0.16, 0.2, 0.3, 0.22, 0.12] }
          }
        },
        let_stay_illegal: {
          continuous: {
            PRO: { pos: [0.26, 0.3, 0.26, 0.12, 0.06] },
            CU: { pos: [0.28, 0.3, 0.24, 0.12, 0.06] },
            ONT_S: { pos: [0.12, 0.22, 0.3, 0.2, 0.16] }
          }
        }
      }
    },
    // Q34 — threats_to_america_external_internal
    {
      id: 34,
      stage: "stage3",
      section: "III",
      promptShort: "threats_to_america_external_internal",
      uiType: "single_choice",
      quality: 0.38,
      rewriteNeeded: true,
      touchProfile: [
        { node: "ZS", kind: "continuous", role: "position", weight: 0.35, touchType: "threat_bundle" },
        { node: "TRB", kind: "continuous", role: "position", weight: 0.2, touchType: "threat_bundle" },
        { node: "CU", kind: "continuous", role: "position", weight: 0.15, touchType: "threat_bundle" },
        { node: "ONT_S", kind: "continuous", role: "position", weight: 0.15, touchType: "threat_bundle" }
      ],
      optionEvidence: {
        external_threats: {
          continuous: {
            ZS: { pos: [0.3, 0.3, 0.25, 0.1, 0.05] },
            TRB: { pos: [0.08, 0.15, 0.28, 0.3, 0.19] }
          }
        },
        internal_division: {
          continuous: {
            ZS: { pos: [0.05, 0.12, 0.3, 0.33, 0.2] }
          }
        },
        both_equally: {
          continuous: {
            ZS: { pos: [0.12, 0.22, 0.35, 0.22, 0.09] }
          }
        }
      }
    },
    // Q36 — fda_speed_vs_safety
    {
      id: 36,
      stage: "stage2",
      section: "IV",
      promptShort: "fda_speed_vs_safety",
      uiType: "single_choice",
      quality: 0.88,
      rewriteNeeded: false,
      touchProfile: [
        { node: "PRO", kind: "continuous", role: "position", weight: 0.65, touchType: "error_asymmetry" },
        { node: "EPS", kind: "categorical", role: "category", weight: 0.2, touchType: "expertise_risk_proxy" },
        { node: "ONT_H", kind: "continuous", role: "position", weight: 0.1, touchType: "risk_humanity_proxy" }
      ],
      optionEvidence: {
        prioritize_safety: {
          continuous: {
            PRO: { pos: [0.04, 0.09, 0.22, 0.35, 0.3] }
          },
          categorical: { EPS: { cat: EPS_PROTOTYPES.institutionalist } }
        },
        balanced_timeline: {
          continuous: {
            PRO: { pos: [0.08, 0.22, 0.38, 0.22, 0.1] }
          },
          categorical: { EPS: { cat: EPS_PROTOTYPES.empiricist } }
        },
        prioritize_speed: {
          continuous: {
            PRO: { pos: [0.3, 0.35, 0.22, 0.09, 0.04] }
          },
          categorical: { EPS: { cat: EPS_PROTOTYPES.autonomous } }
        }
      }
    },
    // Q37 — stupid_workplace_rule_response
    {
      id: 37,
      stage: "stage2",
      section: "IV",
      promptShort: "stupid_workplace_rule_response",
      uiType: "single_choice",
      quality: 0.8,
      rewriteNeeded: false,
      touchProfile: [
        { node: "PRO", kind: "continuous", role: "position", weight: 0.6, touchType: "rule_response" },
        { node: "COM", kind: "continuous", role: "position", weight: 0.25, touchType: "rule_response" },
        { node: "ENG", kind: "continuous", role: "position", weight: 0.1, touchType: "conflict_response" }
      ],
      optionEvidence: {
        follow_always: {
          continuous: {
            PRO: { pos: [0.03, 0.07, 0.18, 0.32, 0.4] }
          }
        },
        follow_then_advocate: {
          continuous: {
            PRO: { pos: [0.07, 0.2, 0.38, 0.25, 0.1] },
            COM: { pos: [0.05, 0.12, 0.28, 0.33, 0.22] }
          }
        },
        ignore_quietly: {
          continuous: {
            PRO: { pos: [0.29, 0.35, 0.22, 0.1, 0.04] }
          }
        },
        openly_challenge: {
          continuous: {
            PRO: { pos: [0.4, 0.32, 0.18, 0.07, 0.03] },
            COM: { pos: [0.22, 0.28, 0.25, 0.15, 0.1] }
          }
        }
      }
    },
    // Q41 — election_access_vs_security
    {
      id: 41,
      stage: "stage2",
      section: "IV",
      promptShort: "election_access_vs_security",
      uiType: "single_choice",
      quality: 0.9,
      rewriteNeeded: false,
      touchProfile: [
        { node: "PRO", kind: "continuous", role: "position", weight: 0.7, touchType: "error_asymmetry" },
        { node: "CU", kind: "continuous", role: "position", weight: 0.2, touchType: "boundary_order_proxy" },
        { node: "TRB", kind: "continuous", role: "position", weight: 0.15, touchType: "partisan_fairness_proxy" }
      ],
      optionEvidence: {
        easier_access: {
          continuous: {
            PRO: { pos: [0.04, 0.1, 0.22, 0.34, 0.3] }
          }
        },
        balanced_approach: {
          continuous: {
            PRO: { pos: [0.1, 0.22, 0.38, 0.22, 0.08] }
          }
        },
        tighter_security: {
          continuous: {
            PRO: { pos: [0.3, 0.34, 0.22, 0.1, 0.04] },
            TRB: { pos: [0.1, 0.18, 0.28, 0.28, 0.16] }
          }
        }
      }
    },
    // Q42 — close_friends_voted_differently
    {
      id: 42,
      stage: "screen20",
      section: "IV",
      promptShort: "close_friends_voted_differently",
      uiType: "single_choice",
      quality: 0.88,
      rewriteNeeded: false,
      touchProfile: [
        { node: "TRB", kind: "continuous", role: "position", weight: 0.9, touchType: "network_homophily" },
        { node: "PF", kind: "continuous", role: "salience", weight: 0.3, touchType: "network_homophily" }
      ],
      optionEvidence: {
        no_big_deal: {
          continuous: {
            TRB: { pos: [0.42, 0.38, 0.15, 0.04, 0.01] }
          }
        },
        keep_friendship: {
          continuous: {
            TRB: { pos: [0.19, 0.3, 0.35, 0.12, 0.04] }
          }
        },
        distance_somewhat: {
          continuous: {
            TRB: { pos: [0.05, 0.13, 0.28, 0.32, 0.22] }
          }
        },
        end_friendship: {
          continuous: {
            TRB: { pos: [0.03, 0.06, 0.15, 0.28, 0.48] }
          }
        }
      }
    },
    // Q43 — veil_of_ignorance_society_choice
    {
      id: 43,
      stage: "stage2",
      section: "IV",
      promptShort: "veil_of_ignorance_society_choice",
      uiType: "single_choice",
      quality: 0.91,
      rewriteNeeded: false,
      touchProfile: [
        { node: "MAT", kind: "continuous", role: "position", weight: 0.7, touchType: "distributive_choice" },
        { node: "MOR", kind: "continuous", role: "position", weight: 0.25, touchType: "fairness_scope" },
        { node: "ZS", kind: "continuous", role: "position", weight: 0.15, touchType: "distributional_worldview" }
      ],
      optionEvidence: {
        equal_society: {
          continuous: {
            MAT: { pos: [0.48, 0.35, 0.12, 0.04, 0.01] }
          }
        },
        safety_net_society: {
          continuous: {
            MAT: { pos: [0.2, 0.34, 0.3, 0.12, 0.04] }
          }
        },
        opportunity_society: {
          continuous: {
            MAT: { pos: [0.06, 0.14, 0.32, 0.3, 0.18] }
          }
        },
        free_market_society: {
          continuous: {
            MAT: { pos: [0.03, 0.07, 0.15, 0.3, 0.45] }
          }
        }
      }
    },
    // =========================================================================
    // SINGLE_CHOICE EVIDENCE MAPS (batch 4: Q45, Q47, Q48, Q52, Q53, Q54, Q57, Q58)
    // =========================================================================
    // Q47 — political_conflict_with_close_others
    {
      id: 47,
      stage: "fixed12",
      section: "IV",
      promptShort: "political_conflict_with_close_others",
      uiType: "single_choice",
      quality: 0.89,
      rewriteNeeded: false,
      touchProfile: [
        { node: "COM", kind: "continuous", role: "position", weight: 0.7, touchType: "interpersonal_conflict" },
        { node: "ENG", kind: "continuous", role: "position", weight: 0.35, touchType: "interpersonal_conflict" },
        { node: "PF", kind: "continuous", role: "salience", weight: 0.15, touchType: "interpersonal_conflict" }
      ],
      optionEvidence: {
        avoid_if_possible: {
          continuous: {
            COM: { pos: [0.03, 0.1, 0.25, 0.35, 0.27] }
          }
        },
        engage_carefully: {
          continuous: {
            COM: { pos: [0.06, 0.15, 0.35, 0.28, 0.16] }
          }
        },
        stand_ground: {
          continuous: {
            COM: { pos: [0.2, 0.3, 0.28, 0.15, 0.07] }
          }
        },
        enjoy_debate: {
          continuous: {
            COM: { pos: [0.35, 0.3, 0.2, 0.1, 0.05] }
          }
        }
      }
    },
    // Q48 — social_progress_view
    {
      id: 48,
      stage: "screen20",
      section: "IV",
      promptShort: "social_progress_view",
      uiType: "single_choice",
      quality: 0.87,
      rewriteNeeded: false,
      touchProfile: [
        { node: "ONT_H", kind: "continuous", role: "position", weight: 0.85, touchType: "progress_worldview" },
        { node: "ONT_S", kind: "continuous", role: "position", weight: 0.2, touchType: "progress_worldview" },
        { node: "CD", kind: "continuous", role: "position", weight: 0.1, touchType: "progress_worldview" }
      ],
      optionEvidence: {
        continuous_improvement: {
          continuous: {
            ONT_H: { pos: [0.01, 0.05, 0.15, 0.38, 0.41] }
          }
        },
        gradual_improvement: {
          continuous: {
            ONT_H: { pos: [0.04, 0.12, 0.32, 0.34, 0.18] }
          }
        },
        stagnation: {
          continuous: {
            ONT_H: { pos: [0.18, 0.28, 0.32, 0.15, 0.07] }
          }
        },
        decline: {
          continuous: {
            ONT_H: { pos: [0.42, 0.3, 0.18, 0.07, 0.03] }
          }
        }
      }
    },
    // Q52 — political_membership_criterion_rewrite
    {
      id: 52,
      stage: "stage2",
      section: "IV",
      promptShort: "political_membership_criterion_rewrite",
      uiType: "single_choice",
      quality: 0.64,
      rewriteNeeded: true,
      touchProfile: [
        { node: "CU", kind: "continuous", role: "position", weight: 0.8, touchType: "membership_boundary" },
        { node: "MOR", kind: "continuous", role: "position", weight: 0.2, touchType: "membership_boundary" },
        { node: "PF", kind: "continuous", role: "position", weight: 0.15, touchType: "membership_boundary" },
        { node: "TRB", kind: "continuous", role: "position", weight: 0.2, touchType: "membership_boundary" },
        { node: "TRB_ANCHOR", kind: "derived", role: "anchor", weight: 0.25, touchType: "nationality_anchor" }
      ],
      optionEvidence: {
        civic_participation: {
          continuous: {
            CU: { pos: [0.04, 0.1, 0.28, 0.35, 0.23] }
          }
        },
        shared_values: {
          continuous: {
            CU: { pos: [0.15, 0.25, 0.35, 0.18, 0.07] },
            TRB: { pos: [0.08, 0.15, 0.28, 0.3, 0.19] }
          }
        },
        cultural_heritage: {
          continuous: {
            CU: { pos: [0.3, 0.3, 0.25, 0.1, 0.05] },
            TRB: { pos: [0.05, 0.12, 0.25, 0.33, 0.25] }
          }
        },
        born_here: {
          continuous: {
            CU: { pos: [0.45, 0.28, 0.17, 0.07, 0.03] },
            TRB: { pos: [0.04, 0.1, 0.22, 0.34, 0.3] }
          }
        }
      }
    },
    // Q54 — religion_in_upbringing (background, mild)
    {
      id: 54,
      stage: "stage3",
      section: "V",
      promptShort: "religion_in_upbringing",
      uiType: "single_choice",
      quality: 0.4,
      rewriteNeeded: false,
      touchProfile: [
        { node: "MOR", kind: "continuous", role: "position", weight: 0.1, touchType: "background_context" },
        { node: "CD", kind: "continuous", role: "position", weight: 0.1, touchType: "background_context" },
        { node: "TRB", kind: "continuous", role: "position", weight: 0.1, touchType: "background_context" },
        { node: "TRB_ANCHOR", kind: "derived", role: "anchor", weight: 0.35, touchType: "religious_anchor" }
      ],
      optionEvidence: {
        very_religious: {
          continuous: {
            MOR: { pos: [0.25, 0.27, 0.23, 0.15, 0.1] },
            CD: { pos: [0.25, 0.27, 0.23, 0.15, 0.1] }
          }
        },
        somewhat_religious: {
          continuous: {
            MOR: { pos: [0.18, 0.24, 0.28, 0.18, 0.12] },
            CD: { pos: [0.18, 0.24, 0.28, 0.18, 0.12] }
          }
        },
        not_religious: {
          continuous: {
            MOR: { pos: [0.1, 0.15, 0.25, 0.27, 0.23] },
            CD: { pos: [0.1, 0.15, 0.25, 0.27, 0.23] }
          }
        }
      }
    },
    // =========================================================================
    // SINGLE_CHOICE EVIDENCE MAPS (batch 5: Q59, Q61, Q62)
    // =========================================================================
    // Q59 — what_matters_more_in_leader
    {
      id: 59,
      stage: "screen20",
      section: "V",
      promptShort: "what_matters_more_in_leader",
      uiType: "single_choice",
      quality: 0.91,
      rewriteNeeded: false,
      touchProfile: [
        { node: "PRO", kind: "continuous", role: "position", weight: 0.35, touchType: "leader_evaluation" },
        { node: "AES", kind: "categorical", role: "category", weight: 0.45, touchType: "leader_evaluation" },
        { node: "EPS", kind: "categorical", role: "category", weight: 0.2, touchType: "leader_evaluation" },
        { node: "ENG", kind: "continuous", role: "position", weight: 0.1, touchType: "leader_evaluation" }
      ],
      optionEvidence: {
        competence_record: {
          categorical: {
            AES: { cat: AES_PROTOTYPES.technocrat },
            EPS: { cat: EPS_PROTOTYPES.empiricist }
          }
        },
        moral_character: {
          categorical: {
            AES: { cat: AES_PROTOTYPES.pastoral },
            EPS: { cat: EPS_PROTOTYPES.intuitionist }
          }
        },
        fights_for_us: {
          categorical: {
            AES: { cat: AES_PROTOTYPES.fighter },
            EPS: { cat: EPS_PROTOTYPES.autonomous }
          }
        },
        unifying_vision: {
          categorical: {
            AES: { cat: AES_PROTOTYPES.visionary },
            EPS: { cat: EPS_PROTOTYPES.institutionalist }
          }
        }
      }
    },
    // Q61 — political_pitch_resonance
    {
      id: 61,
      stage: "screen20",
      section: "V",
      promptShort: "political_pitch_resonance",
      uiType: "single_choice",
      quality: 0.94,
      rewriteNeeded: false,
      touchProfile: [
        { node: "AES", kind: "categorical", role: "category", weight: 0.82, touchType: "rhetorical_preference" },
        { node: "EPS", kind: "categorical", role: "category", weight: 0.3, touchType: "rhetorical_preference" },
        { node: "TRB", kind: "continuous", role: "position", weight: 0.2, touchType: "rhetorical_preference" },
        { node: "ZS", kind: "continuous", role: "position", weight: 0.15, touchType: "rhetorical_preference" },
        { node: "PRO", kind: "continuous", role: "position", weight: 0.15, touchType: "rhetorical_preference" },
        { node: "AES", kind: "categorical", role: "salience", weight: 0.8, touchType: "checkbox_salience" }
      ],
      optionEvidence: {
        evidence_pitch: {
          categorical: {
            AES: { cat: AES_PROTOTYPES.technocrat },
            EPS: { cat: EPS_PROTOTYPES.empiricist }
          }
        },
        values_pitch: {
          categorical: {
            AES: { cat: AES_PROTOTYPES.pastoral },
            EPS: { cat: EPS_PROTOTYPES.traditionalist }
          }
        },
        fight_pitch: {
          categorical: {
            AES: { cat: AES_PROTOTYPES.fighter },
            EPS: { cat: EPS_PROTOTYPES.autonomous }
          }
        },
        unity_pitch: {
          categorical: {
            AES: { cat: AES_PROTOTYPES.statesman },
            EPS: { cat: EPS_PROTOTYPES.institutionalist }
          }
        }
      }
    },
    // Q62 — movement_aesthetics_reaction
    {
      id: 62,
      stage: "screen20",
      section: "V",
      promptShort: "movement_aesthetics_reaction",
      uiType: "single_choice",
      quality: 0.9,
      rewriteNeeded: false,
      touchProfile: [
        { node: "AES", kind: "categorical", role: "category", weight: 0.88, touchType: "movement_style" },
        { node: "TRB", kind: "continuous", role: "position", weight: 0.2, touchType: "movement_style" },
        { node: "ENG", kind: "continuous", role: "position", weight: 0.15, touchType: "movement_style" }
      ],
      optionEvidence: {
        fiery_rally: {
          categorical: {
            AES: { cat: AES_PROTOTYPES.fighter }
          }
        },
        measured_rally: {
          categorical: {
            AES: { cat: AES_PROTOTYPES.statesman }
          }
        },
        grassroots_community: {
          categorical: {
            AES: { cat: AES_PROTOTYPES.pastoral }
          }
        },
        data_driven_campaign: {
          categorical: {
            AES: { cat: AES_PROTOTYPES.technocrat }
          }
        }
      }
    },
    // =========================================================================
    // MULTI-SELECT EVIDENCE MAPS (Q5, Q55)
    // =========================================================================
    // Q5 — engagement_motivations_top2 (multi)
    {
      id: 5,
      stage: "screen20",
      section: "I",
      promptShort: "engagement_motivations_top2",
      uiType: "multi",
      quality: 0.86,
      rewriteNeeded: false,
      touchProfile: [
        { node: "ENG", kind: "continuous", role: "salience", weight: 0.55, touchType: "motive_salience" },
        { node: "PF", kind: "continuous", role: "salience", weight: 0.35, touchType: "motive_salience" },
        { node: "TRB", kind: "continuous", role: "salience", weight: 0.3, touchType: "motive_salience" },
        { node: "PRO", kind: "continuous", role: "salience", weight: 0.2, touchType: "motive_salience" },
        { node: "COM", kind: "continuous", role: "salience", weight: 0.2, touchType: "motive_salience" },
        { node: "EPS", kind: "categorical", role: "category", weight: 0.2, touchType: "motive_salience" }
      ],
      optionEvidence: {
        civic_duty: {
          // Civic duty → high salience on COM, PRO (process matters to this person)
          continuous: {
            COM: { sal: [0.05, 0.15, 0.35, 0.45] },
            PRO: { sal: [0.05, 0.15, 0.35, 0.45] }
          }
        },
        protect_values: {
          // Protect values → high salience on TRB, PF (tribal/partisan identity matters)
          continuous: {
            TRB: { sal: [0.05, 0.15, 0.35, 0.45] },
            PF: { sal: [0.05, 0.15, 0.35, 0.45] }
          }
        },
        help_community: {
          // Help community → high salience on COM, MOR (community/moral concern matters)
          continuous: {
            COM: { sal: [0.04, 0.12, 0.38, 0.46] },
            MOR: { sal: [0.04, 0.14, 0.38, 0.44] }
          }
        },
        fight_injustice: {
          // Fight injustice → high salience on ENG, TRB (engaged, cause-driven)
          continuous: {
            ENG: { sal: [0.03, 0.1, 0.37, 0.5] },
            TRB: { sal: [0.05, 0.15, 0.35, 0.45] }
          }
        },
        self_interest: {
          // Self-interest → high salience on ENG (engaged for personal stakes)
          continuous: {
            ENG: { sal: [0.05, 0.15, 0.35, 0.45] }
          },
          categorical: { EPS: { cat: EPS_PROTOTYPES.autonomous } }
        },
        intellectual_challenge: {
          // Intellectual challenge → salience on ENG, EPS category
          continuous: {
            ENG: { sal: [0.03, 0.1, 0.37, 0.5] }
          },
          categorical: { EPS: { cat: EPS_PROTOTYPES.empiricist } }
        }
      }
    },
    // Q55 — what_changed_your_mind (multi)
    {
      id: 55,
      stage: "screen20",
      section: "V",
      promptShort: "what_changed_your_mind",
      uiType: "multi",
      quality: 0.94,
      rewriteNeeded: false,
      touchProfile: [
        { node: "EPS", kind: "categorical", role: "category", weight: 0.95, touchType: "updating_channel" },
        { node: "PRO", kind: "continuous", role: "position", weight: 0.15, touchType: "updating_channel" },
        { node: "MOR", kind: "continuous", role: "position", weight: 0.15, touchType: "updating_channel" }
      ],
      optionEvidence: {
        personal_experience: {
          categorical: {
            EPS: { cat: EPS_PROTOTYPES.intuitionist }
          }
        },
        data_evidence: {
          categorical: {
            EPS: { cat: EPS_PROTOTYPES.empiricist }
          }
        },
        trusted_authority: {
          categorical: {
            EPS: { cat: EPS_PROTOTYPES.institutionalist }
          }
        },
        religious_moral: {
          categorical: {
            EPS: { cat: EPS_PROTOTYPES.traditionalist }
          }
        },
        never_changed: {
          categorical: {
            EPS: { cat: EPS_PROTOTYPES.traditionalist }
          }
        }
      }
    },
    // =========================================================================
    // ALLOCATION EVIDENCE MAP (Q22)
    // =========================================================================
    // Q22 — factual_estimates_and_confidence (allocation)
    {
      id: 22,
      stage: "screen20",
      section: "II",
      promptShort: "factual_estimates_and_confidence",
      uiType: "allocation",
      quality: 0.95,
      rewriteNeeded: false,
      touchProfile: [
        { node: "EPS", kind: "categorical", role: "category", weight: 0.98, touchType: "factual_calibration" },
        { node: "EPS", kind: "categorical", role: "salience", weight: 0.45, touchType: "factual_calibration" },
        { node: "ENG", kind: "continuous", role: "position", weight: 0.1, touchType: "issue_attention" }
      ],
      allocationMap: {
        expert_consensus: { categorical: { EPS: EPS_PROTOTYPES.institutionalist } },
        personal_research: { categorical: { EPS: EPS_PROTOTYPES.empiricist } },
        lived_experience: { categorical: { EPS: EPS_PROTOTYPES.intuitionist } },
        tradition: { categorical: { EPS: EPS_PROTOTYPES.traditionalist } }
      }
    },
    // =========================================================================
    // RANKING EVIDENCE MAPS (Q29, Q50)
    // =========================================================================
    // Q29 — factory_closure_causes_ranking (ranking)
    {
      id: 29,
      stage: "stage2",
      section: "III",
      promptShort: "factory_closure_causes_ranking",
      uiType: "ranking",
      quality: 0.91,
      rewriteNeeded: false,
      touchProfile: [
        { node: "MAT", kind: "continuous", role: "position", weight: 0.7, touchType: "economic_attribution" },
        { node: "ONT_S", kind: "continuous", role: "position", weight: 0.65, touchType: "economic_attribution" },
        { node: "ZS", kind: "continuous", role: "position", weight: 0.4, touchType: "conflict_attribution" }
      ],
      rankingMap: {
        global_competition: {
          continuous: { ONT_S: -0.7, ZS: 0.4 }
        },
        automation: {
          continuous: { ONT_S: -0.6 }
        },
        corporate_decisions: {
          continuous: { MAT: -0.7, ZS: 0.6 }
        },
        government_policy: {
          continuous: { MAT: -0.3, ONT_S: -0.3 }
        },
        worker_choices: {
          continuous: { MAT: 0.6, ONT_S: 0.5 }
        }
      }
    },
    // Q50 — integration_expectations_rewrite (ranking)
    {
      id: 50,
      stage: "stage2",
      section: "IV",
      promptShort: "integration_expectations_rewrite",
      uiType: "ranking",
      quality: 0.62,
      rewriteNeeded: true,
      touchProfile: [
        { node: "CU", kind: "continuous", role: "position", weight: 0.75, touchType: "membership_expectation" },
        { node: "CD", kind: "continuous", role: "position", weight: 0.25, touchType: "membership_expectation" },
        { node: "MOR", kind: "continuous", role: "position", weight: 0.2, touchType: "membership_expectation" },
        { node: "TRB", kind: "continuous", role: "position", weight: 0.2, touchType: "boundary_identity" }
      ],
      rankingMap: {
        learn_language: {
          continuous: { CU: -0.3 }
        },
        follow_laws: {
          continuous: { CU: -0.2 }
        },
        adopt_values: {
          continuous: { CU: -0.6, CD: -0.4 }
        },
        economic_contribution: {
          continuous: { CU: 0.2, MAT: 0.3 }
        },
        cultural_customs: {
          continuous: { CU: -0.8, CD: -0.6 }
        }
      }
    },
    // =========================================================================
    // BEST_WORST -> rankingMap (Q63)
    // =========================================================================
    // Q63 — best_worst_battery (best_worst, stored as rankingMap for applyRankingAnswer)
    {
      id: 63,
      stage: "screen20",
      section: "VI",
      promptShort: "best_worst_battery",
      uiType: "best_worst",
      quality: 0.95,
      rewriteNeeded: false,
      touchProfile: [
        { node: "MOR", kind: "continuous", role: "salience", weight: 0.38, touchType: "best_worst_asymmetric" },
        { node: "PRO", kind: "continuous", role: "salience", weight: 0.34, touchType: "best_worst_asymmetric" },
        { node: "PF", kind: "continuous", role: "salience", weight: 0.3, touchType: "best_worst_asymmetric" },
        { node: "TRB", kind: "continuous", role: "salience", weight: 0.3, touchType: "best_worst_asymmetric" },
        { node: "MAT", kind: "continuous", role: "salience", weight: 0.18, touchType: "best_worst_asymmetric" },
        { node: "CU", kind: "continuous", role: "salience", weight: 0.18, touchType: "best_worst_asymmetric" },
        { node: "COM", kind: "continuous", role: "salience", weight: 0.18, touchType: "best_worst_asymmetric" },
        { node: "TRB_ANCHOR", kind: "derived", role: "anchor", weight: 0.18, touchType: "best_worst_asymmetric" }
      ],
      rankingMap: {
        fairness: {
          continuous: { MAT: -0.5, MOR: 0.5, PRO: 0.25 }
        },
        procedural_integrity: {
          continuous: { PRO: 0.65, COM: 0.25 }
        },
        national_strength: {
          continuous: { CU: -0.45, TRB: 0.45, ZS: -0.25 }
        },
        community_bonds: {
          continuous: { COM: 0.45, TRB: -0.25, MOR: 0.35 }
        },
        individual_freedom: {
          continuous: { PRO: 0.55, MAT: 0.25 }
        },
        tradition_continuity: {
          continuous: { CD: -0.45, CU: -0.35 }
        }
      }
    },
    // =========================================================================
    // NEW QUESTIONS 64-75: Gap-targeted expansion
    // =========================================================================
    // Q64 — Political Frustration (PF position via grievance framing + salience)
    {
      id: 64,
      stage: "stage2",
      section: "VI",
      promptShort: "political_frustration",
      uiType: "single_choice",
      quality: 0.93,
      rewriteNeeded: false,
      touchProfile: [
        { node: "MAT", kind: "continuous", role: "position", weight: 0.35, touchType: "grievance_proxy" },
        { node: "ONT_S", kind: "continuous", role: "position", weight: 0.8, touchType: "grievance_proxy" },
        { node: "PRO", kind: "continuous", role: "position", weight: 0.15, touchType: "grievance_proxy" },
        { node: "CD", kind: "continuous", role: "position", weight: 0.2, touchType: "grievance_proxy" },
        { node: "ENG", kind: "continuous", role: "position", weight: 0.25, touchType: "frustration_intensity" }
      ],
      optionEvidence: {
        // "Corporations and the wealthy have too much power, ordinary people are left behind"
        corporate_power_inequality: {
          continuous: {
            MAT: { pos: [0.18, 0.32, 0.28, 0.15, 0.07] },
            ONT_S: { pos: [0.45, 0.28, 0.17, 0.07, 0.03] }
          }
        },
        // "Government has grown too large and intrusive, individual freedom is eroding"
        government_overreach: {
          continuous: {
            ONT_S: { pos: [0.4, 0.3, 0.18, 0.08, 0.04] },
            PRO: { pos: [0.18, 0.28, 0.3, 0.16, 0.08] }
          }
        },
        // "Both sides are more interested in fighting than solving real problems"
        both_sides_broken: {
          continuous: {
            ONT_S: { pos: [0.6, 0.24, 0.1, 0.04, 0.02] }
          }
        },
        // "The system itself is fundamentally unjust and needs radical change"
        system_unjust: {
          continuous: {
            ONT_S: { pos: [0.72, 0.18, 0.06, 0.03, 0.01] }
          }
        },
        // "Traditional values and social cohesion are being abandoned"
        values_eroding: {
          continuous: {
            CD: { pos: [0.03, 0.07, 0.15, 0.3, 0.45] },
            ONT_S: { pos: [0.35, 0.3, 0.2, 0.1, 0.05] }
          }
        },
        // "I don't think much about politics — it doesn't affect my daily life"
        politics_irrelevant: {
          continuous: {
            ENG: { pos: [0.62, 0.22, 0.1, 0.04, 0.02] }
          }
        }
      }
    },
    {
      id: 69,
      stage: "stage2",
      section: "VI",
      promptShort: "common_ground_salience",
      uiType: "slider",
      quality: 0.91,
      rewriteNeeded: false,
      touchProfile: [
        { node: "COM", kind: "continuous", role: "salience", weight: 0.9, touchType: "direct_salience" },
        { node: "PRO", kind: "continuous", role: "position", weight: 0.15, touchType: "governance_proxy" }
      ],
      sliderMap: {
        "0-20": { continuous: { COM: { sal: [0.55, 0.3, 0.12, 0.03] } } },
        "21-40": { continuous: { COM: { sal: [0.25, 0.42, 0.25, 0.08] } } },
        "41-60": { continuous: { COM: { sal: [0.1, 0.28, 0.4, 0.22] } } },
        "61-80": { continuous: { COM: { sal: [0.04, 0.12, 0.38, 0.46] } } },
        "81-100": { continuous: { COM: { sal: [0.02, 0.08, 0.3, 0.6] } } }
      }
    },
    {
      id: 71,
      stage: "stage2",
      section: "VI",
      promptShort: "rhetoric_style_importance",
      uiType: "slider",
      quality: 0.88,
      rewriteNeeded: false,
      touchProfile: [
        { node: "AES", kind: "categorical", role: "salience", weight: 0.9, touchType: "direct_salience" },
        { node: "ENG", kind: "continuous", role: "salience", weight: 0.2, touchType: "attention_proxy" }
      ],
      sliderMap: {
        "0-20": { categorical: { AES: { sal: [0.55, 0.3, 0.12, 0.03] } } },
        "21-40": { categorical: { AES: { sal: [0.25, 0.4, 0.25, 0.1] } } },
        "41-60": { categorical: { AES: { sal: [0.08, 0.28, 0.4, 0.24] } } },
        "61-80": { categorical: { AES: { sal: [0.03, 0.12, 0.4, 0.45] } } },
        "81-100": { categorical: { AES: { sal: [0.02, 0.08, 0.3, 0.6] } } }
      }
    },
    {
      id: 77,
      stage: "stage2",
      section: "III",
      promptShort: "decision_making_style",
      uiType: "single_choice",
      quality: 0.93,
      rewriteNeeded: false,
      touchProfile: [
        { node: "EPS", kind: "categorical", role: "category", weight: 0.95, touchType: "decision_style" },
        { node: "EPS", kind: "categorical", role: "salience", weight: 0.35, touchType: "decision_style" },
        { node: "AES", kind: "categorical", role: "category", weight: 0.15, touchType: "style_proxy" }
      ],
      optionEvidence: {
        research_data: {
          categorical: {
            EPS: { cat: EPS_PROTOTYPES.empiricist }
          }
        },
        trusted_advice: {
          categorical: {
            EPS: { cat: EPS_PROTOTYPES.institutionalist }
          }
        },
        values_tradition: {
          categorical: {
            EPS: { cat: EPS_PROTOTYPES.traditionalist }
          }
        },
        gut_feeling: {
          categorical: {
            EPS: { cat: EPS_PROTOTYPES.intuitionist },
            AES: { cat: AES_PROTOTYPES.authentic }
          }
        },
        own_reasoning: {
          categorical: {
            EPS: { cat: EPS_PROTOTYPES.autonomous }
          }
        },
        cant_predict: {
          categorical: {
            EPS: { cat: EPS_PROTOTYPES.nihilist }
          }
        }
      }
    },
    // Q78 — Speaker Appeal (AES authentic coverage)
    // Behavioral framing ("would you show up?") reveals aesthetic preference
    // without asking respondents to self-classify their communication style.
    {
      id: 78,
      stage: "stage2",
      section: "V",
      promptShort: "speaker_appeal",
      uiType: "single_choice",
      quality: 0.92,
      rewriteNeeded: false,
      touchProfile: [
        { node: "AES", kind: "categorical", role: "category", weight: 0.88, touchType: "rhetorical_preference" },
        { node: "AES", kind: "categorical", role: "salience", weight: 0.4, touchType: "rhetorical_preference" },
        { node: "EPS", kind: "categorical", role: "category", weight: 0.15, touchType: "style_proxy" }
      ],
      optionEvidence: {
        bridge_builder: {
          categorical: {
            AES: { cat: AES_PROTOTYPES.statesman, sal: [0.1, 0.2, 0.35, 0.35] }
          }
        },
        deep_expertise: {
          categorical: {
            AES: { cat: AES_PROTOTYPES.technocrat, sal: [0.12, 0.23, 0.33, 0.32] }
          }
        },
        community_voice: {
          categorical: {
            AES: { cat: AES_PROTOTYPES.pastoral, sal: [0.1, 0.2, 0.35, 0.35] }
          }
        },
        says_what_they_think: {
          categorical: {
            AES: { cat: AES_PROTOTYPES.authentic, sal: [0.08, 0.15, 0.32, 0.45] },
            EPS: { cat: EPS_PROTOTYPES.intuitionist }
          }
        },
        calls_out_power: {
          categorical: {
            AES: { cat: AES_PROTOTYPES.fighter, sal: [0.05, 0.12, 0.3, 0.53] }
          }
        },
        big_picture: {
          categorical: {
            AES: { cat: AES_PROTOTYPES.visionary, sal: [0.08, 0.15, 0.32, 0.45] }
          }
        },
        // "I don't really care how politicians present themselves"
        dont_care_style: {
          categorical: {
            AES: { cat: AES_PROTOTYPES.technocrat, sal: [0.55, 0.28, 0.12, 0.05] }
          }
        }
      }
    },
    // Q79 — Expert Disagreement (EPS nihilist dedicated)
    // Expert disagreement is a natural experiment for epistemic style.
    // "tune_out" normalizes nihilism as practical uncertainty acceptance.
    {
      id: 79,
      stage: "stage2",
      section: "III",
      promptShort: "expert_disagreement_reaction",
      uiType: "single_choice",
      quality: 0.9,
      rewriteNeeded: false,
      touchProfile: [
        { node: "EPS", kind: "categorical", role: "category", weight: 0.92, touchType: "epistemic_response" },
        { node: "EPS", kind: "categorical", role: "salience", weight: 0.4, touchType: "epistemic_response" },
        { node: "ENG", kind: "continuous", role: "salience", weight: 0.15, touchType: "attention_proxy" }
      ],
      optionEvidence: {
        check_evidence: {
          categorical: {
            EPS: { cat: EPS_PROTOTYPES.empiricist, sal: [0.05, 0.12, 0.33, 0.5] }
          }
        },
        check_credentials: {
          categorical: {
            EPS: { cat: EPS_PROTOTYPES.institutionalist, sal: [0.05, 0.12, 0.33, 0.5] }
          }
        },
        check_values: {
          categorical: {
            EPS: { cat: EPS_PROTOTYPES.traditionalist, sal: [0.05, 0.12, 0.33, 0.5] }
          }
        },
        check_experience: {
          categorical: {
            EPS: { cat: EPS_PROTOTYPES.intuitionist, sal: [0.05, 0.12, 0.33, 0.5] }
          }
        },
        both_wrong: {
          categorical: {
            EPS: { cat: EPS_PROTOTYPES.autonomous, sal: [0.1, 0.2, 0.35, 0.35] }
          }
        },
        tune_out: {
          categorical: {
            EPS: { cat: EPS_PROTOTYPES.nihilist, sal: [0.45, 0.3, 0.15, 0.1] }
          },
          continuous: {
            ENG: { sal: [0.5, 0.3, 0.15, 0.05] }
          }
        }
      }
    },
    // =========================================================================
    // Q80 — Political Attention Style (ENG + EPS + AES salience)
    // =========================================================================
    // "When you encounter a new political issue you haven't thought about before,
    //  what's the first thing you do?"
    // Behavioral framing reveals which dimension the respondent naturally
    // Q80 — political_attention_style — DELETED per Sam's request (question didn't match options)
    // ═══════════════════════════════════════════════════════════════════════
    // NEW DISCRIMINATOR QUESTIONS (81-85) — from ChatGPT audit
    // Added 2026-03-28 to address simulation misses and thin node coverage
    // ═══════════════════════════════════════════════════════════════════════
    // Q81 — Party loyalty vs cause loyalty
    // Addresses: 100 Tribal Insurgent ↔ 012 Class-War Leftist confusion; weak PF-position
    {
      id: 81,
      stage: "stage3",
      section: "IV",
      promptShort: "party_vs_cause_loyalty",
      uiType: "single_choice",
      quality: 0.92,
      rewriteNeeded: false,
      touchProfile: [
        { node: "PF", kind: "continuous", role: "position", weight: 0.92, touchType: "identity_loyalty" },
        { node: "ENG", kind: "continuous", role: "position", weight: 0.18, touchType: "activation_proxy" },
        { node: "TRB", kind: "continuous", role: "position", weight: 0.1, touchType: "camp_attachment" }
      ],
      optionEvidence: {
        // A: Say so publicly, even if it weakens my side
        say_so_publicly: {
          continuous: {
            PF: { pos: [0.55, 0.25, 0.12, 0.05, 0.03] },
            TRB: { pos: [0.4, 0.3, 0.18, 0.08, 0.04] },
            ENG: { pos: [0.05, 0.1, 0.25, 0.35, 0.25] }
          }
        },
        // B: Push back internally, but keep public unity
        push_back_internally: {
          continuous: {
            PF: { pos: [0.08, 0.15, 0.3, 0.3, 0.17] },
            ENG: { pos: [0.1, 0.2, 0.35, 0.25, 0.1] }
          }
        },
        // C: Stick with my side; the other camp is the real threat
        stick_with_side: {
          continuous: {
            PF: { pos: [0.03, 0.05, 0.12, 0.25, 0.55] },
            TRB: { pos: [0.04, 0.08, 0.18, 0.3, 0.4] },
            ENG: { pos: [0.05, 0.1, 0.25, 0.35, 0.25] }
          }
        },
        // D: Party labels matter less than whether the position serves the cause
        cause_over_party: {
          continuous: {
            PF: { pos: [0.55, 0.25, 0.12, 0.05, 0.03] },
            TRB: { pos: [0.25, 0.3, 0.25, 0.12, 0.08] },
            ENG: { pos: [0.03, 0.08, 0.2, 0.35, 0.34] }
          }
        }
      }
    },
    // Q82 — Openness vs assimilation vs closure
    // Addresses: 050 Religious Leftist ↔ 049 Paternal Egalitarian; 070 ↔ 075; CD/CU seam
    {
      id: 82,
      stage: "stage3",
      section: "IV",
      promptShort: "openness_assimilation_closure",
      uiType: "single_choice",
      quality: 0.91,
      rewriteNeeded: false,
      touchProfile: [
        { node: "CD", kind: "continuous", role: "position", weight: 0.9, touchType: "cultural_direction" },
        { node: "CU", kind: "continuous", role: "position", weight: 0.88, touchType: "cultural_uniformity" },
        { node: "MOR", kind: "continuous", role: "position", weight: 0.24, touchType: "moral_scope" },
        { node: "MAT", kind: "continuous", role: "position", weight: 0.08, touchType: "economics_signal" }
      ],
      optionEvidence: {
        // A: Preserve inherited culture, tighter limits on openness
        preserve_culture: {
          continuous: {
            CD: { pos: [0.02, 0.05, 0.13, 0.3, 0.5] },
            CU: { pos: [0.5, 0.28, 0.14, 0.05, 0.03] },
            MOR: { pos: [0.05, 0.1, 0.25, 0.35, 0.25] }
          }
        },
        // B: Stay open, but newcomers should adopt common civic culture
        civic_assimilation: {
          continuous: {
            CD: { pos: [0.05, 0.12, 0.28, 0.35, 0.2] },
            CU: { pos: [0.05, 0.12, 0.25, 0.35, 0.23] },
            MOR: { pos: [0.1, 0.2, 0.4, 0.2, 0.1] }
          }
        },
        // C: Stay open, don't demand cultural convergence
        open_pluralist: {
          continuous: {
            CD: { pos: [0.5, 0.3, 0.13, 0.05, 0.02] },
            CU: { pos: [0.03, 0.05, 0.14, 0.28, 0.5] },
            MOR: { pos: [0.25, 0.35, 0.25, 0.1, 0.05] }
          }
        },
        // D: Cultural questions matter less than economic fairness
        economics_first: {
          continuous: {
            MAT: { pos: [0.4, 0.3, 0.18, 0.08, 0.04] },
            CD: { pos: [0.15, 0.25, 0.35, 0.15, 0.1] },
            CU: { pos: [0.15, 0.25, 0.3, 0.2, 0.1] },
            MOR: { pos: [0.15, 0.25, 0.35, 0.15, 0.1] }
          }
        }
      }
    },
    // Q83 — Anti-elite rage vs tribune politics
    // Addresses: 098 Anti-Elite Populist ↔ 102 Folk Tribune
    {
      id: 83,
      stage: "stage3",
      section: "IV",
      promptShort: "broken_politics_diagnosis",
      uiType: "single_choice",
      quality: 0.9,
      rewriteNeeded: false,
      touchProfile: [
        { node: "ENG", kind: "continuous", role: "position", weight: 0.55, touchType: "mobilization_style" },
        { node: "TRB", kind: "continuous", role: "position", weight: 0.45, touchType: "camp_attachment" },
        { node: "CD", kind: "continuous", role: "position", weight: 0.6, touchType: "cultural_direction" },
        { node: "CU", kind: "continuous", role: "position", weight: 0.25, touchType: "cultural_uniformity" },
        { node: "COM", kind: "continuous", role: "position", weight: 0.2, touchType: "compromise_signal" }
      ],
      optionEvidence: {
        // A: Elites make real decisions and shut ordinary people out
        elite_exclusion: {
          continuous: {
            ENG: { pos: [0.05, 0.1, 0.22, 0.35, 0.28] },
            TRB: { pos: [0.06, 0.12, 0.25, 0.32, 0.25] },
            COM: { pos: [0.3, 0.28, 0.22, 0.12, 0.08] }
          }
        },
        // B: Ordinary people have no one who truly speaks for them
        no_representation: {
          continuous: {
            ENG: { pos: [0.05, 0.1, 0.22, 0.35, 0.28] },
            TRB: { pos: [0.02, 0.05, 0.13, 0.3, 0.5] },
            COM: { pos: [0.15, 0.25, 0.3, 0.18, 0.12] }
          }
        },
        // C: Politics is too restrained; needs leaders willing to fight harder
        combative_mobilization: {
          continuous: {
            ENG: { pos: [0.01, 0.04, 0.12, 0.28, 0.55] },
            TRB: { pos: [0.06, 0.12, 0.25, 0.32, 0.25] },
            COM: { pos: [0.45, 0.28, 0.15, 0.08, 0.04] }
          }
        },
        // D: People no longer share a common civic and national life
        civic_loss: {
          continuous: {
            CD: { pos: [0.04, 0.08, 0.18, 0.3, 0.4] },
            CU: { pos: [0.4, 0.28, 0.18, 0.1, 0.04] },
            ENG: { pos: [0.08, 0.15, 0.3, 0.3, 0.17] },
            TRB: { pos: [0.06, 0.12, 0.25, 0.32, 0.25] }
          }
        }
      }
    },
    // Q84 — Mutual-aid optimism vs domination suspicion (Likert)
    // Addresses: 019 Anarchist Mutualist ↔ 020 Horizontalist Dissenter
    {
      id: 84,
      stage: "stage3",
      section: "IV",
      promptShort: "institutions_harden_into_domination",
      uiType: "slider",
      quality: 0.89,
      rewriteNeeded: false,
      touchProfile: [
        { node: "ZS", kind: "continuous", role: "position", weight: 0.6, touchType: "zero_sum_institutions" },
        { node: "ZS", kind: "continuous", role: "salience", weight: 0.6, touchType: "zero_sum_institutions" },
        { node: "ONT_H", kind: "continuous", role: "position", weight: 0.45, touchType: "hierarchy_trust" },
        { node: "COM", kind: "continuous", role: "position", weight: 0.25, touchType: "compromise_signal" },
        { node: "PRO", kind: "continuous", role: "position", weight: 0.15, touchType: "procedural_trust" }
      ],
      sliderMap: {
        // 1 = strongly disagree (institutions are fine, hierarchy natural)
        "0-20": {
          continuous: {
            ZS: { pos: [0.55, 0.25, 0.12, 0.05, 0.03] },
            ONT_H: { pos: [0.03, 0.05, 0.12, 0.28, 0.52] },
            COM: { pos: [0.05, 0.1, 0.22, 0.35, 0.28] },
            PRO: { pos: [0.05, 0.1, 0.25, 0.35, 0.25] }
          }
        },
        // 2 = disagree
        "21-40": {
          continuous: {
            ZS: { pos: [0.3, 0.35, 0.22, 0.08, 0.05] },
            ONT_H: { pos: [0.05, 0.1, 0.22, 0.38, 0.25] },
            COM: { pos: [0.08, 0.15, 0.3, 0.3, 0.17] },
            PRO: { pos: [0.08, 0.12, 0.3, 0.3, 0.2] }
          }
        },
        // 3 = mixed
        "41-60": {
          continuous: {
            ZS: { pos: [0.1, 0.2, 0.4, 0.2, 0.1] },
            ONT_H: { pos: [0.1, 0.2, 0.4, 0.2, 0.1] },
            COM: { pos: [0.12, 0.22, 0.32, 0.22, 0.12] },
            PRO: { pos: [0.12, 0.22, 0.32, 0.22, 0.12] }
          }
        },
        // 4 = agree
        "61-80": {
          continuous: {
            ZS: { pos: [0.05, 0.08, 0.22, 0.35, 0.3] },
            ONT_H: { pos: [0.25, 0.38, 0.22, 0.1, 0.05] },
            COM: { pos: [0.17, 0.3, 0.3, 0.15, 0.08] },
            PRO: { pos: [0.2, 0.3, 0.3, 0.12, 0.08] }
          }
        },
        // 5 = strongly agree (institutions always corrupt, domination inevitable)
        "81-100": {
          continuous: {
            ZS: { pos: [0.03, 0.05, 0.12, 0.25, 0.55] },
            ONT_H: { pos: [0.52, 0.28, 0.12, 0.05, 0.03] },
            COM: { pos: [0.28, 0.35, 0.22, 0.1, 0.05] },
            PRO: { pos: [0.25, 0.35, 0.25, 0.1, 0.05] }
          }
        }
      }
    },
    // Q85 — What makes institutions legitimate?
    // Addresses: 070 Burkean Steward ↔ 075 Institutional Conservative; 091 ↔ 097
    {
      id: 85,
      stage: "stage3",
      section: "IV",
      promptShort: "institutional_legitimacy_source",
      uiType: "single_choice",
      quality: 0.91,
      rewriteNeeded: false,
      touchProfile: [
        { node: "PRO", kind: "continuous", role: "position", weight: 0.88, touchType: "procedural_legitimacy" },
        { node: "CD", kind: "continuous", role: "position", weight: 0.2, touchType: "cultural_direction" },
        { node: "COM", kind: "continuous", role: "position", weight: 0.08, touchType: "compromise_signal" }
      ],
      optionEvidence: {
        // A: It carries inherited ways of life forward
        inherited_tradition: {
          continuous: {
            PRO: { pos: [0.05, 0.12, 0.25, 0.35, 0.23] },
            CD: { pos: [0.04, 0.08, 0.18, 0.3, 0.4] }
          },
          categorical: {
            EPS: { probs: [0.05, 0.1, 0.55, 0.15, 0.1, 0.05] }
          }
        },
        // B: It follows neutral constitutional rules and procedures
        procedural_rules: {
          continuous: {
            PRO: { pos: [0.01, 0.04, 0.12, 0.28, 0.55] },
            COM: { pos: [0.05, 0.1, 0.25, 0.35, 0.25] }
          },
          categorical: {
            EPS: { probs: [0.35, 0.3, 0.1, 0.1, 0.1, 0.05] }
          }
        },
        // C: It keeps order and gets results when things are unstable
        order_and_results: {
          continuous: {
            PRO: { pos: [0.2, 0.3, 0.28, 0.15, 0.07] },
            COM: { pos: [0.25, 0.3, 0.25, 0.12, 0.08] },
            CD: { pos: [0.08, 0.12, 0.25, 0.3, 0.25] }
          },
          categorical: {
            EPS: { probs: [0.15, 0.15, 0.1, 0.1, 0.4, 0.1] }
          }
        },
        // D: It advances justice, even if rules sometimes have to bend
        justice_first: {
          continuous: {
            PRO: { pos: [0.55, 0.28, 0.12, 0.04, 0.01] },
            COM: { pos: [0.25, 0.3, 0.25, 0.12, 0.08] }
          },
          categorical: {
            EPS: { probs: [0.05, 0.05, 0.05, 0.5, 0.15, 0.2] }
          }
        }
      }
    }
  ];

  // src/config/nodes.ts
  var NODE_DEFS = [
    { id: "MAT", type: "continuous", cluster: "ENDS" },
    { id: "CD", type: "continuous", cluster: "ENDS" },
    { id: "CU", type: "continuous", cluster: "ENDS" },
    { id: "MOR", type: "continuous", cluster: "ENDS" },
    { id: "PRO", type: "continuous", cluster: "MEANS" },
    { id: "EPS", type: "categorical", cluster: "MEANS" },
    { id: "AES", type: "categorical", cluster: "MEANS" },
    { id: "COM", type: "continuous", cluster: "MEANS" },
    { id: "ZS", type: "continuous", cluster: "REALITY" },
    { id: "ONT_H", type: "continuous", cluster: "REALITY" },
    { id: "ONT_S", type: "continuous", cluster: "REALITY" },
    { id: "PF", type: "continuous", cluster: "SELF" },
    { id: "TRB", type: "continuous", cluster: "SELF" },
    { id: "ENG", type: "continuous", cluster: "SELF" }
  ];
  var CONTINUOUS_NODES = NODE_DEFS.filter(
    (n) => n.type === "continuous"
  ).map((n) => n.id);
  var CATEGORICAL_NODES = NODE_DEFS.filter(
    (n) => n.type === "categorical"
  ).map((n) => n.id);

  // src/engine/math.ts
  function multiplyAndNormalize(prior, likelihood) {
    const result = prior.map((p, i) => p * (likelihood[i] ?? 0));
    return normalize(result);
  }
  function normalize(arr) {
    const sum = arr.reduce((a, b) => a + b, 0);
    if (sum <= 0) {
      const uniform = arr.map(() => 1 / arr.length);
      return uniform;
    }
    return arr.map((v) => v / sum);
  }
  var TRB_ANCHOR_ORDER = [
    "national",
    "ideological",
    "religious",
    "class",
    "ethnic_racial",
    "global",
    "mixed_none"
  ];
  function addToAnchorDist(current, signals) {
    const updated = [...current];
    for (const [anchor, weight] of Object.entries(signals)) {
      const idx = TRB_ANCHOR_ORDER.indexOf(anchor);
      if (idx >= 0 && weight !== void 0) {
        updated[idx] = updated[idx] * Math.exp(weight);
      }
    }
    return normalize(updated);
  }

  // src/config/normalization.ts
  var NODE_NORM_FACTORS = {
    MAT: 0.8,
    // was 0.781 → clamped up to 0.80
    CD: 1.65,
    // was 1.870 → capped at 1.65
    CU: 1.6,
    // was 1.603 → kept ~same
    MOR: 1.65,
    // was 2.020 → capped at 1.65 (was over-amplifying sparse signal)
    PRO: 0.65,
    // was 0.580 → clamped up to 0.65
    COM: 0.98,
    // was 0.981 → kept ~same
    ZS: 1.65,
    // was 2.020 → capped at 1.65 (was over-amplifying sparse signal)
    ONT_H: 0.88,
    // was 0.878 → kept ~same
    ONT_S: 1.17,
    // was 1.174 → kept ~same
    PF: 1.3,
    // was 1.161 → boosted (PF-position was dangerously thin)
    TRB: 0.77,
    // was 0.765 → kept ~same
    ENG: 1.25,
    // was 1.153 → boosted (ENG had lowest total coverage at 3.63)
    EPS: 0.65,
    // was 0.596 → clamped up to 0.65
    AES: 0.89
    // was 0.889 → kept ~same
  };

  // src/engine/update.ts
  var RANK_SAL = [
    [0.05, 0.15, 0.3, 0.5],
    // rank 1 (most important)
    [0.1, 0.2, 0.3, 0.4],
    // rank 2
    [0.18, 0.25, 0.3, 0.27],
    // rank 3
    [0.27, 0.3, 0.25, 0.18],
    // rank 4
    [0.4, 0.3, 0.2, 0.1],
    // rank 5
    [0.5, 0.3, 0.15, 0.05]
    // rank 6 (least important)
  ];
  function registerTouches(state, q) {
    for (const touch of q.touchProfile) {
      if (touch.node === "TRB_ANCHOR") continue;
      if (touch.kind === "continuous" && touch.node in state.continuous) {
        const node = state.continuous[touch.node];
        node.touches += 1;
        node.touchTypes.add(touch.touchType);
      } else if (touch.kind === "categorical" && touch.node in state.categorical) {
        const node = state.categorical[touch.node];
        node.touches += 1;
        node.touchTypes.add(touch.touchType);
      }
    }
  }
  function applyOptionEvidence(state, evidence) {
    if (!evidence) return;
    if (evidence.continuous) {
      for (const [nodeId, upd] of Object.entries(evidence.continuous)) {
        const node = state.continuous[nodeId];
        if (upd?.pos) node.posDist = multiplyAndNormalize(node.posDist, upd.pos);
        if (upd?.sal) node.salDist = multiplyAndNormalize(node.salDist, upd.sal);
      }
    }
    if (evidence.categorical) {
      for (const [nodeId, upd] of Object.entries(evidence.categorical)) {
        const node = state.categorical[nodeId];
        if (upd?.cat) node.catDist = multiplyAndNormalize(node.catDist, upd.cat);
        if (upd?.sal) node.salDist = multiplyAndNormalize(node.salDist, upd.sal);
      }
    }
    if (evidence.trbAnchor) {
      state.trbAnchor.dist = addToAnchorDist(state.trbAnchor.dist, evidence.trbAnchor);
      state.trbAnchor.touches += 1;
    }
  }
  function applySingleChoiceAnswer(state, q, optionKey) {
    state.answers[q.id] = optionKey;
    registerTouches(state, q);
    applyOptionEvidence(state, q.optionEvidence?.[optionKey]);
  }
  function applySliderAnswer(state, q, rawValue) {
    state.answers[q.id] = rawValue;
    registerTouches(state, q);
    if (!q.sliderMap) return;
    const bucket = Object.keys(q.sliderMap).find((k) => {
      const parts = k.split("-").map(Number);
      const lo = parts[0] ?? 0;
      const hi = parts[1] ?? 100;
      return rawValue >= lo && rawValue <= hi;
    });
    if (!bucket) return;
    applyOptionEvidence(state, q.sliderMap[bucket]);
  }
  function applyAllocationAnswer(state, q, allocation) {
    state.answers[q.id] = allocation;
    registerTouches(state, q);
    if (!q.allocationMap) return;
    const total = Math.max(1, Object.values(allocation).reduce((a, b) => a + b, 0));
    for (const [bucket, weight] of Object.entries(allocation)) {
      const share = weight / total;
      const map = q.allocationMap[bucket];
      if (!map) continue;
      if (map.continuous) {
        for (const [nodeId, signal] of Object.entries(map.continuous)) {
          const node = state.continuous[nodeId];
          const normFactor = NODE_NORM_FACTORS[nodeId] ?? 1;
          const current = node.posDist;
          const bump = current.map((p, i) => p * Math.exp((signal ?? 0) * normFactor * share * (i + 1 - 3)));
          node.posDist = normalize(bump);
        }
      }
      if (map.categorical) {
        for (const [nodeId, catDist] of Object.entries(map.categorical)) {
          const node = state.categorical[nodeId];
          const normFactor = NODE_NORM_FACTORS[nodeId] ?? 1;
          const mixWeight = 0.35 * share * normFactor;
          const mixed = node.catDist.map((v, i) => v * (1 - mixWeight) + (catDist[i] ?? 0) * mixWeight);
          node.catDist = normalize(mixed);
        }
      }
      if (map.trbAnchor) {
        const scaled = {};
        for (const [k, v] of Object.entries(map.trbAnchor)) {
          scaled[k] = v * share;
        }
        state.trbAnchor.dist = addToAnchorDist(state.trbAnchor.dist, scaled);
        state.trbAnchor.touches += 1;
      }
    }
  }
  function applyRankingAnswer(state, q, ranking) {
    state.answers[q.id] = ranking;
    registerTouches(state, q);
    if (!q.rankingMap) return;
    const weights = [1, 0.8, 0.55, 0.35, 0.2, 0];
    const hasSalience = q.touchProfile.some((t) => t.role === "salience");
    ranking.forEach((item, idx) => {
      const rankWeight = weights[idx] ?? 0;
      const map = q.rankingMap?.[item];
      if (!map) return;
      const salLikelihood = hasSalience && idx < RANK_SAL.length ? RANK_SAL[idx] : null;
      if (map.continuous) {
        for (const [nodeId, signal] of Object.entries(map.continuous)) {
          const node = state.continuous[nodeId];
          const normFactor = NODE_NORM_FACTORS[nodeId] ?? 1;
          const bump = node.posDist.map((p, i) => p * Math.exp((signal ?? 0) * normFactor * rankWeight * (i + 1 - 3)));
          node.posDist = normalize(bump);
          if (salLikelihood) {
            node.salDist = multiplyAndNormalize(node.salDist, salLikelihood);
          }
        }
      }
      if (map.categorical) {
        for (const [nodeId, catDist] of Object.entries(map.categorical)) {
          const node = state.categorical[nodeId];
          const normFactor = NODE_NORM_FACTORS[nodeId] ?? 1;
          const mixWeight = 0.4 * rankWeight * normFactor;
          const mixed = node.catDist.map((v, i) => v * (1 - mixWeight) + (catDist[i] ?? 0) * mixWeight);
          node.catDist = normalize(mixed);
          if (salLikelihood) {
            node.salDist = multiplyAndNormalize(node.salDist, salLikelihood);
          }
        }
      }
      if (map.trbAnchor) {
        const scaled = {};
        for (const [k, v] of Object.entries(map.trbAnchor)) {
          scaled[k] = v * rankWeight;
        }
        state.trbAnchor.dist = addToAnchorDist(state.trbAnchor.dist, scaled);
        state.trbAnchor.touches += 1;
      }
    });
  }
  function applyPairwiseAnswer(state, q, answers) {
    state.answers[q.id] = answers;
    registerTouches(state, q);
    if (!q.pairMaps) return;
    for (const [pairId, chosen] of Object.entries(answers)) {
      const map = q.pairMaps[pairId]?.[chosen];
      if (!map) continue;
      if (map.continuous) {
        for (const [nodeId, signal] of Object.entries(map.continuous)) {
          const node = state.continuous[nodeId];
          const normFactor = NODE_NORM_FACTORS[nodeId] ?? 1;
          const bump = node.posDist.map((p, i) => p * Math.exp((signal ?? 0) * normFactor * (i + 1 - 3)));
          node.posDist = normalize(bump);
        }
      }
      if (map.categorical) {
        for (const [nodeId, catDist] of Object.entries(map.categorical)) {
          const node = state.categorical[nodeId];
          const normFactor = NODE_NORM_FACTORS[nodeId] ?? 1;
          const mixWeight = 0.4 * normFactor;
          const mixed = node.catDist.map((v, i) => v * (1 - mixWeight) + (catDist[i] ?? 0) * mixWeight);
          node.catDist = normalize(mixed);
        }
      }
    }
  }

  // src/engine/config.ts
  var FIXED_16 = [
    1,
    2,
    3,
    4,
    11,
    15,
    20,
    21,
    23,
    31,
    40,
    47,
    // The last 4 ensure we touch remaining SELF/REALITY nodes
    // that aren't well-covered by the first 12
    8,
    56,
    60,
    63
  ];

  // src/optimize/runtimeConfig.ts
  var DEFAULT_CONFIG = {
    // 3-Phase question selection
    PHASE1_END: 16,
    // First 16 questions: salience-first
    PHASE2_END: 28,
    // Questions 17-28: prune + discriminate
    // Legacy blend (kept for compatibility)
    EXPLOIT_BLEND_START: 12,
    EXPLOIT_BLEND_END: 30,
    // Devil's advocate weight during exploitation
    DEVILS_ADVOCATE_WEIGHT: 0.3,
    // Batch selection
    BATCH_SIZE_MIN: 2,
    BATCH_SIZE_MAX: 4,
    BATCH_PRUNE_MIN_VIABLE: 5,
    BATCH_SEARCH_DEPTH: 10,
    NODE_OVERLAP_PENALTY: 0.5,
    // Stop rule
    STOP_MIN_QUESTIONS: 25,
    STOP_POSTERIOR_THRESHOLD: 0.25,
    STOP_MARGIN_THRESHOLD: 0.04,
    STOP_MIN_CONSECUTIVE_LEADS: 3,
    STOP_AGREEMENT_K: 3,
    // Secondary stop
    SECONDARY_MIN_Q: 35,
    // High-confidence override
    HC_POSTERIOR: 0.45,
    HC_MARGIN: 0.15,
    HC_CONSECUTIVE: 5,
    HC_COSINE_BLOCK: 0.96,
    // Ultra-confidence stop
    UC_MIN_Q: 20,
    UC_POSTERIOR: 0.9,
    UC_MARGIN: 0.3,
    UC_CONSECUTIVE: 8,
    // Late game stop
    LATE_GAME_MIN_Q: 45,
    LATE_GAME_POSTERIOR: 0.15,
    LATE_GAME_MARGIN: 0.03,
    LATE_GAME_CONSECUTIVE: 4
  };
  var _config = { ...DEFAULT_CONFIG };
  function getConfig() {
    return _config;
  }

  // src/engine/archetypeDistance.ts
  function archetypeDistance(state, archetype) {
    let totalDist = 0;
    let totalWeight = 0;
    for (const nodeId of CONTINUOUS_NODES) {
      const template = archetype.nodes[nodeId];
      if (!template || template.kind !== "continuous") continue;
      const nodeState = state.continuous[nodeId];
      const expectedPos = nodeState.posDist[0] * 1 + nodeState.posDist[1] * 2 + nodeState.posDist[2] * 3 + nodeState.posDist[3] * 4 + nodeState.posDist[4] * 5;
      const posProb = nodeState.posDist[template.pos - 1] ?? 0.2;
      const expectedSal = nodeState.salDist[0] * 0 + nodeState.salDist[1] * 1 + nodeState.salDist[2] * 2 + nodeState.salDist[3] * 3;
      const salProb = nodeState.salDist[template.sal] ?? 0.25;
      const posMeanDiff = Math.abs(expectedPos - template.pos) / 4;
      const posProbDist = 1 - posProb;
      const salMeanDiff = Math.abs(expectedSal - template.sal) / 3;
      const salProbDist = 1 - salProb;
      const positionDist = posMeanDiff * 0.6 + posProbDist * 0.4;
      const salienceDist = salMeanDiff * 0.6 + salProbDist * 0.4;
      let antiPenalty = 0;
      if (template.anti === "high" && expectedPos > 3.8) {
        antiPenalty = 0.8 * (expectedPos - 3.8) / 1.2;
      } else if (template.anti === "low" && expectedPos < 2.2) {
        antiPenalty = 0.8 * (2.2 - expectedPos) / 1.2;
      }
      const archSalWeight = 0.5 + template.sal * 0.5;
      const respondentSalWeight = 0.5 + expectedSal * 0.25;
      const nodeWeight = archSalWeight * respondentSalWeight;
      const nodeDist = positionDist * 0.65 + salienceDist * 0.35 + antiPenalty;
      totalDist += nodeDist * nodeWeight;
      totalWeight += nodeWeight;
    }
    for (const nodeId of CATEGORICAL_NODES) {
      const template = archetype.nodes[nodeId];
      if (!template || template.kind !== "categorical") continue;
      const nodeState = state.categorical[nodeId];
      const costMatrix = CATEGORY_COST_MATRIX[nodeId];
      let catCostDist = 0;
      for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 6; j++) {
          catCostDist += nodeState.catDist[i] * template.probs[j] * (costMatrix[i]?.[j] ?? 0);
        }
      }
      let dot = 0;
      for (let i = 0; i < 6; i++) {
        dot += nodeState.catDist[i] * template.probs[i];
      }
      const dotDist = 1 - dot;
      let antiCatPenalty = 0;
      if (template.antiCats) {
        for (const antiIdx of template.antiCats) {
          if (antiIdx >= 0 && antiIdx < 6) {
            antiCatPenalty += nodeState.catDist[antiIdx] * 0.5;
          }
        }
      }
      const expectedSal = nodeState.salDist[0] * 0 + nodeState.salDist[1] * 1 + nodeState.salDist[2] * 2 + nodeState.salDist[3] * 3;
      const salDiff = Math.abs(expectedSal - template.sal) / 3;
      const archSalWeight = 0.5 + template.sal * 0.5;
      const respondentSalWeight = 0.5 + expectedSal * 0.25;
      const nodeWeight = archSalWeight * respondentSalWeight;
      const catDist = catCostDist * 0.5 + dotDist * 0.5;
      const nodeDist = catDist * 0.65 + salDiff * 0.35 + antiCatPenalty;
      totalDist += nodeDist * nodeWeight;
      totalWeight += nodeWeight;
    }
    return totalWeight > 0 ? totalDist / totalWeight : 0;
  }
  function viableArchetypes(state, archetypes, minRelative = 0.01) {
    const posteriors = state.archetypePosterior;
    const maxPosterior = Math.max(...Object.values(posteriors));
    if (maxPosterior <= 0) return archetypes;
    const threshold = maxPosterior * minRelative;
    return archetypes.filter((a) => (posteriors[a.id] ?? 0) >= threshold);
  }

  // src/engine/nextQuestion.ts
  var LIVE_OR_UNRESOLVED = /* @__PURE__ */ new Set(["unknown", "live_unresolved"]);
  function nodeIsLiveOrUnresolved(state, nodeId) {
    if (nodeId in state.continuous) {
      return LIVE_OR_UNRESOLVED.has(state.continuous[nodeId].status);
    }
    if (nodeId in state.categorical) {
      return LIVE_OR_UNRESOLVED.has(state.categorical[nodeId].status);
    }
    return false;
  }
  function answeredCount(state) {
    return Object.keys(state.answers).length;
  }
  function evaluatePredicate(state, predicate) {
    const liveMatch = predicate.match(/^(.+)_live_or_unresolved$/);
    if (liveMatch) {
      const nodeId = liveMatch[1];
      return nodeIsLiveOrUnresolved(state, nodeId);
    }
    const answered = answeredCount(state);
    switch (predicate) {
      // Eligible once we're past the fixed12 phase
      case "screen20_or_late_screen":
        return answered >= FIXED_16.length;
      // Late-stage consistency checks — most of the quiz is done
      case "late_consistency_check_only":
        return answered >= 30;
      // Low-weight items surfaced moderately late
      case "late_low_weight_only":
        return answered >= 20;
      // Background/biographical questions — very late filler
      case "background_prior_only":
        return answered >= 35;
      // Background eligible OR the TRB anchor is still uncertain
      case "background_prior_only_or_TRB_anchor_active": {
        if (answered >= 35) return true;
        const topAnchorProb = Math.max(...state.trbAnchor.dist);
        return state.trbAnchor.touches >= 1 && topAnchorProb < 0.45;
      }
      default:
        return false;
    }
  }
  function isQuestionEligible(state, q) {
    const rules = q.exposeRules?.eligibleIf;
    if (!rules || rules.length === 0) return true;
    return rules.some((predicate) => evaluatePredicate(state, predicate));
  }
  function topCandidateArchetypes(posterior, archetypes, k = 5) {
    return [...archetypes].sort((a, b) => (posterior[b.id] ?? 0) - (posterior[a.id] ?? 0)).slice(0, k);
  }
  function nodeUncertainty(state, nodeId) {
    if (nodeId in state.continuous) {
      const node = state.continuous[nodeId];
      return 1 - Math.max(...node.posDist);
    }
    if (nodeId in state.categorical) {
      const node = state.categorical[nodeId];
      return 1 - Math.max(...node.catDist);
    }
    if (nodeId === "TRB_ANCHOR") {
      return 1 - Math.max(...state.trbAnchor.dist);
    }
    return 0;
  }
  function salienceUncertainty(state, nodeId) {
    if (nodeId in state.continuous) {
      const node = state.continuous[nodeId];
      return 1 - Math.max(...node.salDist);
    }
    if (nodeId in state.categorical) {
      const node = state.categorical[nodeId];
      return 1 - Math.max(...node.salDist);
    }
    return 0;
  }
  function entropy(dist) {
    let h = 0;
    for (const p of dist) {
      if (p > 1e-12) h -= p * Math.log(p);
    }
    return h;
  }
  function expectedSalience(state, nodeId) {
    let salDist;
    if (nodeId in state.continuous) {
      salDist = state.continuous[nodeId].salDist;
    } else if (nodeId in state.categorical) {
      salDist = state.categorical[nodeId].salDist;
    }
    if (!salDist) return 1.5;
    return salDist[0] * 0 + salDist[1] * 1 + salDist[2] * 2 + salDist[3] * 3;
  }
  function scoreSaliencePhase(state, q, _archetypes2) {
    let salienceBoost = 0;
    let coverageScore = 0;
    let totalTouches = 0;
    for (const touch of q.touchProfile) {
      if (touch.node === "TRB_ANCHOR") {
        coverageScore += state.trbAnchor.touches < 2 ? 0.5 : 0.1;
        continue;
      }
      const isSalience = touch.role === "salience";
      const salUncert = salienceUncertainty(state, touch.node);
      const posUncert = nodeUncertainty(state, touch.node);
      if (isSalience) {
        salienceBoost += touch.weight * salUncert * 2;
      }
      if (touch.kind === "continuous" && touch.node in state.continuous) {
        const n = state.continuous[touch.node];
        coverageScore += n.touches < 2 ? 1 : n.touches < 4 ? 0.4 : 0.1;
      } else if (touch.kind === "categorical" && touch.node in state.categorical) {
        const n = state.categorical[touch.node];
        coverageScore += n.touches < 2 ? 1.2 : n.touches < 4 ? 0.5 : 0.15;
      }
      const normFactor = NODE_NORM_FACTORS[touch.node] ?? 1;
      totalTouches += touch.weight * posUncert * normFactor * 0.5;
    }
    const touchCount = Math.max(1, q.touchProfile.length);
    const base = (salienceBoost + coverageScore + totalTouches) / touchCount;
    return base * q.quality * (q.rewriteNeeded ? 0.7 : 1);
  }
  function pruneByRespondentSalience(state, archetypes, threshold = 0.15) {
    return archetypes.filter((a) => {
      let penalty = 0;
      let nodeCount = 0;
      for (const nodeId of CONTINUOUS_NODES) {
        const template = a.nodes[nodeId];
        if (!template || template.kind !== "continuous") continue;
        nodeCount++;
        const respondentSal = expectedSalience(state, nodeId);
        if (template.sal >= 2 && respondentSal < 1) {
          penalty += (template.sal - respondentSal) / 3;
        }
        if (template.sal <= 1 && respondentSal > 2) {
          penalty += (respondentSal - template.sal) / 3;
        }
      }
      for (const nodeId of CATEGORICAL_NODES) {
        const template = a.nodes[nodeId];
        if (!template || template.kind !== "categorical") continue;
        nodeCount++;
        const respondentSal = expectedSalience(state, nodeId);
        if (template.sal >= 2 && respondentSal < 1) {
          penalty += (template.sal - respondentSal) / 3;
        }
        if (template.sal <= 1 && respondentSal > 2) {
          penalty += (respondentSal - template.sal) / 3;
        }
      }
      const avgPenalty = nodeCount > 0 ? penalty / nodeCount : 0;
      return avgPenalty < threshold;
    });
  }
  function scorePruneDiscriminatePhase(state, q, archetypes) {
    const viable = viableArchetypes(state, archetypes, 5e-3);
    const saliencePruned = pruneByRespondentSalience(state, viable);
    const candidates = topCandidateArchetypes(
      state.archetypePosterior,
      saliencePruned.length > 2 ? saliencePruned : viable,
      6
    );
    const discrimScore = discriminationScoreExtended(state, q, candidates);
    const coverage = coverageNeed(state, q) * 0.3;
    const uncertainty = q.touchProfile.reduce((sum, t) => {
      const normFactor = NODE_NORM_FACTORS[t.node] ?? 1;
      return sum + nodeUncertainty(state, t.node) * normFactor;
    }, 0) / Math.max(1, q.touchProfile.length);
    return (discrimScore * 2 + coverage + uncertainty * 0.5) * q.quality * (q.rewriteNeeded ? 0.7 : 1);
  }
  function scoreInformationGain(state, q, archetypes) {
    const viable = viableArchetypes(state, archetypes, 2e-3);
    const topK = topCandidateArchetypes(state.archetypePosterior, viable, 8);
    if (topK.length < 2) return 0;
    const topPosteriors = topK.map((a) => state.archetypePosterior[a.id] ?? 0);
    const totalP = topPosteriors.reduce((a, b) => a + b, 0);
    const normalizedP = totalP > 0 ? topPosteriors.map((p) => p / totalP) : topPosteriors;
    const currentEntropy = entropy(normalizedP);
    if (currentEntropy < 0.01) return 0;
    const discrimScore = discriminationScoreExtended(state, q, topK);
    const leader = topK[0];
    const devilScore = leaderBlindSpotScore(state, q, leader);
    const cfg = getConfig();
    const entropyWeight = Math.min(1, currentEntropy / Math.log(8));
    return (discrimScore * 2.5 + cfg.DEVILS_ADVOCATE_WEIGHT * devilScore) * entropyWeight * q.quality * (q.rewriteNeeded ? 0.7 : 1);
  }
  function coverageNeed(state, q) {
    let score = 0;
    for (const touch of q.touchProfile) {
      if (touch.node === "TRB_ANCHOR") {
        score += state.trbAnchor.touches < 2 ? 1 : 0.25;
        continue;
      }
      if (touch.kind === "continuous" && touch.node in state.continuous) {
        const n = state.continuous[touch.node];
        score += n.touches < 3 ? 1 : 0.25;
      } else if (touch.kind === "categorical" && touch.node in state.categorical) {
        const n = state.categorical[touch.node];
        score += n.touches < 4 ? 1.25 : 0.35;
      }
    }
    return score / Math.max(1, q.touchProfile.length);
  }
  function pairwiseDisagreement(q, a1, a2) {
    let totalDisagreement = 0;
    let totalWeight = 0;
    for (const touch of q.touchProfile) {
      if (touch.node === "TRB_ANCHOR") continue;
      const nodeId = touch.node;
      const t1 = a1.nodes[nodeId];
      const t2 = a2.nodes[nodeId];
      if (!t1 || !t2) continue;
      const w = touch.weight;
      totalWeight += w;
      if (t1.kind === "continuous" && t2.kind === "continuous") {
        const posDiff = Math.abs(t1.pos - t2.pos) / 4;
        const salDiff = Math.abs(t1.sal - t2.sal) / 3;
        totalDisagreement += w * (posDiff * 0.8 + salDiff * 0.2);
      } else if (t1.kind === "categorical" && t2.kind === "categorical") {
        let dot = 0;
        for (let i = 0; i < 6; i++) {
          dot += (t1.probs[i] ?? 0) * (t2.probs[i] ?? 0);
        }
        totalDisagreement += w * (1 - dot);
      }
    }
    return { disagreement: totalDisagreement, weight: totalWeight };
  }
  function discriminationScoreExtended(state, q, topK) {
    let totalScore = 0;
    let pairCount = 0;
    for (let i = 0; i < topK.length; i++) {
      for (let j = i + 1; j < topK.length; j++) {
        const a1 = topK[i];
        const a2 = topK[j];
        const { disagreement, weight } = pairwiseDisagreement(q, a1, a2);
        if (weight === 0) continue;
        const p1 = state.archetypePosterior[a1.id] ?? 0;
        const p2 = state.archetypePosterior[a2.id] ?? 0;
        const closeness = Math.min(p1, p2) / Math.max(p1, p2, 1e-3);
        const leaderBonus = i === 0 ? 1.5 : 1;
        totalScore += disagreement / weight * closeness * leaderBonus;
        pairCount++;
      }
    }
    if (pairCount === 0) return 0;
    const uncertainty = q.touchProfile.reduce((sum, t) => {
      const normFactor = NODE_NORM_FACTORS[t.node] ?? 1;
      return sum + nodeUncertainty(state, t.node) * normFactor;
    }, 0) / Math.max(1, q.touchProfile.length);
    return totalScore / pairCount * Math.max(0.1, uncertainty);
  }
  function leaderBlindSpotScore(state, q, leader) {
    let score = 0;
    let count = 0;
    for (const touch of q.touchProfile) {
      if (touch.node === "TRB_ANCHOR") continue;
      const template = leader.nodes[touch.node];
      if (!template) continue;
      count++;
      if (template.sal <= 1) {
        score += touch.weight * nodeUncertainty(state, touch.node);
      }
    }
    return count > 0 ? score / count : 0;
  }
  function scorePairwiseDiscrimination(state, q, archetypes) {
    const viable = viableArchetypes(state, archetypes, 2e-3);
    const topK = topCandidateArchetypes(state.archetypePosterior, viable, 4);
    if (topK.length < 2) return 0;
    const leader = topK[0];
    const rival = topK[1];
    const differentiatingNodes = /* @__PURE__ */ new Map();
    for (const nodeId of CONTINUOUS_NODES) {
      const t1 = leader.nodes[nodeId];
      const t2 = rival.nodes[nodeId];
      if (!t1 || !t2 || t1.kind !== "continuous" || t2.kind !== "continuous") continue;
      const posDiff = Math.abs(t1.pos - t2.pos) / 4;
      const salDiff = Math.abs(t1.sal - t2.sal) / 3;
      const totalDiff = posDiff * 0.75 + salDiff * 0.25;
      if (totalDiff > 0.05) {
        differentiatingNodes.set(nodeId, totalDiff);
      }
    }
    for (const nodeId of CATEGORICAL_NODES) {
      const t1 = leader.nodes[nodeId];
      const t2 = rival.nodes[nodeId];
      if (!t1 || !t2 || t1.kind !== "categorical" || t2.kind !== "categorical") continue;
      let dot = 0;
      for (let i = 0; i < 6; i++) {
        dot += (t1.probs[i] ?? 0) * (t2.probs[i] ?? 0);
      }
      const catDiff = 1 - dot;
      if (catDiff > 0.05) {
        differentiatingNodes.set(nodeId, catDiff);
      }
    }
    if (differentiatingNodes.size === 0) return 0;
    let targetedScore = 0;
    let totalWeight = 0;
    for (const touch of q.touchProfile) {
      if (touch.node === "TRB_ANCHOR") continue;
      const diff = differentiatingNodes.get(touch.node);
      if (diff !== void 0) {
        const normFactor = NODE_NORM_FACTORS[touch.node] ?? 1;
        const uncert = nodeUncertainty(state, touch.node);
        targetedScore += touch.weight * diff * normFactor * uncert * 5;
        totalWeight += touch.weight;
      }
    }
    if (totalWeight === 0) {
      return scoreInformationGain(state, q, archetypes) * 0.2;
    }
    let thirdFourthBonus = 0;
    for (let k = 2; k < topK.length; k++) {
      const alt = topK[k];
      const { disagreement, weight } = pairwiseDisagreement(q, leader, alt);
      if (weight > 0) {
        thirdFourthBonus += disagreement / weight * 0.3;
      }
    }
    return (targetedScore / totalWeight + thirdFourthBonus) * q.quality * (q.rewriteNeeded ? 0.7 : 1);
  }
  function scoreQuestion3Phase(state, q, archetypes) {
    const cfg = getConfig();
    const nAnswered = answeredCount(state);
    if (nAnswered < cfg.PHASE1_END) {
      return scoreSaliencePhase(state, q, archetypes);
    }
    if (nAnswered < cfg.PHASE2_END) {
      const alpha = (nAnswered - cfg.PHASE1_END) / (cfg.PHASE2_END - cfg.PHASE1_END);
      const salienceScore = scoreSaliencePhase(state, q, archetypes);
      const discrimScore = scorePruneDiscriminatePhase(state, q, archetypes);
      return salienceScore * (1 - alpha) + discrimScore * alpha;
    }
    if (nAnswered >= 25) {
      const viable = viableArchetypes(state, archetypes, 2e-3);
      const top2 = topCandidateArchetypes(state.archetypePosterior, viable, 2);
      if (top2.length >= 2) {
        const p1 = state.archetypePosterior[top2[0].id] ?? 0;
        const p2 = state.archetypePosterior[top2[1].id] ?? 0;
        const gap = p1 - p2;
        if (gap < 0.02) {
          return scorePairwiseDiscrimination(state, q, archetypes);
        }
      }
    }
    return scoreInformationGain(state, q, archetypes);
  }
  function selectNextQuestion(state, available, archetypes) {
    const eligible = available.filter(
      (q) => !(q.id in state.answers) && isQuestionEligible(state, q)
    );
    if (!eligible.length) return null;
    const scored = eligible.map((q) => ({
      q,
      score: scoreQuestion3Phase(state, q, archetypes)
    }));
    scored.sort((a, b) => b.score - a.score);
    return scored[0]?.q ?? null;
  }

  // src/engine/stopRule.ts
  var CAT_CONFIDENT_GAP = 0.5;
  var _pairSimilarityCache = null;
  function resetSimilarityCache() {
    _pairSimilarityCache = null;
  }
  function ensureSimilarityCache(archetypes) {
    if (_pairSimilarityCache) return _pairSimilarityCache;
    _pairSimilarityCache = /* @__PURE__ */ new Map();
    function toVector(a) {
      const v = [];
      for (const [, t] of Object.entries(a.nodes)) {
        if (t.kind === "continuous") {
          v.push(t.pos / 5, t.sal / 3);
        } else {
          v.push(...t.probs, t.sal / 3);
        }
      }
      return v;
    }
    function cosine(a, b) {
      let dot = 0, na = 0, nb = 0;
      for (let i = 0; i < a.length; i++) {
        dot += (a[i] ?? 0) * (b[i] ?? 0);
        na += (a[i] ?? 0) ** 2;
        nb += (b[i] ?? 0) ** 2;
      }
      return na > 0 && nb > 0 ? dot / Math.sqrt(na * nb) : 0;
    }
    const vecs = archetypes.map((a) => ({ id: a.id, vec: toVector(a) }));
    for (let i = 0; i < vecs.length; i++) {
      for (let j = i + 1; j < vecs.length; j++) {
        const sim = cosine(vecs[i].vec, vecs[j].vec);
        const key = [vecs[i].id, vecs[j].id].sort().join("|");
        _pairSimilarityCache.set(key, sim);
      }
    }
    return _pairSimilarityCache;
  }
  function shouldStop(state, archetypes) {
    const cfg = getConfig();
    const nAnswered = Object.keys(state.answers).length;
    if (nAnswered < cfg.STOP_MIN_QUESTIONS) return false;
    const entries = Object.entries(state.archetypePosterior).sort((a, b) => b[1] - a[1]);
    const topId = entries[0]?.[0] ?? "";
    const top = entries[0]?.[1] ?? 0;
    const secondId = entries[1]?.[0] ?? "";
    const second = entries[1]?.[1] ?? 0;
    const margin = top - second;
    const significantCount = entries.filter(([, p]) => p > 5e-3).length;
    const adaptiveThreshold = Math.max(
      0.1,
      Math.min(cfg.STOP_POSTERIOR_THRESHOLD, 1 / Math.sqrt(significantCount) * 0.55)
    );
    let effectiveMargin = cfg.STOP_MARGIN_THRESHOLD;
    let pairSim = 0;
    if (archetypes) {
      const cache = ensureSimilarityCache(archetypes);
      const key = [topId, secondId].sort().join("|");
      pairSim = cache.get(key) ?? 0;
      if (pairSim > 0.95) {
        effectiveMargin = cfg.STOP_MARGIN_THRESHOLD * 4;
      } else if (pairSim > 0.92) {
        effectiveMargin = cfg.STOP_MARGIN_THRESHOLD * 2.5;
      }
    }
    const consecutiveCount = state.consecutiveLeadCount ?? 0;
    const stableLeader = consecutiveCount >= cfg.STOP_MIN_CONSECUTIVE_LEADS;
    const topKIds = entries.slice(0, cfg.STOP_AGREEMENT_K).map(([id]) => id);
    const topKArchetypes = archetypes ? archetypes.filter((a) => topKIds.includes(a.id)) : [];
    function topKAgreeOnContinuous(nodeId) {
      if (topKArchetypes.length < 2) return true;
      const templates = topKArchetypes.map((a) => a.nodes[nodeId]).filter((t) => t && t.kind === "continuous");
      if (templates.length < 2) return true;
      const positions = templates.map((t) => t.kind === "continuous" ? t.pos : 0);
      return positions.every((p) => p === positions[0]);
    }
    function topKAgreeOnCategorical(nodeId) {
      if (topKArchetypes.length < 2) return true;
      const templates = topKArchetypes.map((a) => a.nodes[nodeId]).filter((t) => t && t.kind === "categorical");
      if (templates.length < 2) return true;
      const topCats = templates.map((t) => {
        const probs = t.kind === "categorical" ? t.probs : [];
        return probs.indexOf(Math.max(...probs));
      });
      return topCats.every((c) => c === topCats[0]);
    }
    const anyContinuousBlocking = Object.entries(state.continuous).some(
      ([nodeId, n]) => n.status === "live_unresolved" && !topKAgreeOnContinuous(nodeId)
    );
    const anyCategoricalBlocking = Object.entries(state.categorical).some(([nodeId, n]) => {
      if (n.status !== "live_unresolved") return false;
      const sorted = [...n.catDist].sort((a, b) => b - a);
      const gap = (sorted[0] ?? 0) - (sorted[1] ?? 0);
      if (gap >= CAT_CONFIDENT_GAP) return false;
      return !topKAgreeOnCategorical(nodeId);
    });
    const highConfOverride = top >= cfg.HC_POSTERIOR && margin >= cfg.HC_MARGIN && consecutiveCount >= cfg.HC_CONSECUTIVE && pairSim < cfg.HC_COSINE_BLOCK;
    const primaryStop = top >= adaptiveThreshold && margin >= effectiveMargin && stableLeader && (highConfOverride || !anyContinuousBlocking && !anyCategoricalBlocking);
    const deepStableLeader = consecutiveCount >= 6;
    let secondaryMarginMultiplier = 1.5;
    if (archetypes) {
      const cache = ensureSimilarityCache(archetypes);
      const top3Ids = entries.slice(1, 4).map(([id]) => id);
      let maxSim = 0;
      for (const otherId of top3Ids) {
        const key = [topId, otherId].sort().join("|");
        maxSim = Math.max(maxSim, cache.get(key) ?? 0);
      }
      if (maxSim > 0.95) {
        secondaryMarginMultiplier = 5;
      } else if (maxSim > 0.92) {
        secondaryMarginMultiplier = 3;
      } else if (maxSim > 0.88) {
        secondaryMarginMultiplier = 2;
      }
    }
    const solidAbsMargin = margin >= effectiveMargin * secondaryMarginMultiplier;
    const solidRelMargin = second > 0 ? top / second >= 1.4 : true;
    const secondaryStop = nAnswered >= cfg.SECONDARY_MIN_Q && top >= adaptiveThreshold && solidAbsMargin && solidRelMargin && deepStableLeader;
    const ultraConfStop = nAnswered >= cfg.UC_MIN_Q && top >= cfg.UC_POSTERIOR && margin >= cfg.UC_MARGIN && consecutiveCount >= cfg.UC_CONSECUTIVE;
    const lateGameStop = nAnswered >= cfg.LATE_GAME_MIN_Q && top >= cfg.LATE_GAME_POSTERIOR && margin >= cfg.LATE_GAME_MARGIN && consecutiveCount >= cfg.LATE_GAME_CONSECUTIVE;
    const hardCapStop = nAnswered >= 55;
    return primaryStop || secondaryStop || ultraConfStop || lateGameStop || hardCapStop;
  }

  // src/browser/api.ts
  var _state = null;
  var _archetypes = [];
  var _questions = [];
  var _questionsById = /* @__PURE__ */ new Map();
  var _snapshots = [];
  function deepCopyState(state) {
    const copy = {
      answers: { ...state.answers },
      continuous: {},
      categorical: {},
      trbAnchor: {
        dist: [...state.trbAnchor.dist],
        touches: state.trbAnchor.touches
      },
      archetypePosterior: { ...state.archetypePosterior },
      currentLeader: state.currentLeader,
      consecutiveLeadCount: state.consecutiveLeadCount
    };
    for (const nodeId of CONTINUOUS_NODES) {
      const src = state.continuous[nodeId];
      copy.continuous[nodeId] = {
        posDist: [...src.posDist],
        salDist: [...src.salDist],
        touches: src.touches,
        touchTypes: new Set(src.touchTypes),
        status: src.status
      };
    }
    for (const nodeId of CATEGORICAL_NODES) {
      const src = state.categorical[nodeId];
      copy.categorical[nodeId] = {
        catDist: [...src.catDist],
        salDist: [...src.salDist],
        touches: src.touches,
        touchTypes: new Set(src.touchTypes),
        status: src.status
      };
    }
    return copy;
  }
  function createInitialState(archetypes) {
    const continuous = {};
    for (const nodeId of CONTINUOUS_NODES) {
      continuous[nodeId] = {
        posDist: [0.2, 0.2, 0.2, 0.2, 0.2],
        salDist: [0.25, 0.25, 0.25, 0.25],
        touches: 0,
        touchTypes: /* @__PURE__ */ new Set(),
        status: "unknown"
      };
    }
    const categorical = {};
    for (const nodeId of CATEGORICAL_NODES) {
      categorical[nodeId] = {
        catDist: [1 / 6, 1 / 6, 1 / 6, 1 / 6, 1 / 6, 1 / 6],
        salDist: [0.25, 0.25, 0.25, 0.25],
        touches: 0,
        touchTypes: /* @__PURE__ */ new Set(),
        status: "unknown"
      };
    }
    const archetypePosterior = {};
    for (const a of archetypes) {
      archetypePosterior[a.id] = a.prior;
    }
    return {
      answers: {},
      continuous,
      categorical,
      trbAnchor: {
        dist: [1 / 7, 1 / 7, 1 / 7, 1 / 7, 1 / 7, 1 / 7, 1 / 7],
        touches: 0
      },
      archetypePosterior,
      currentLeader: void 0,
      consecutiveLeadCount: 0
    };
  }
  function updatePosteriors(state, archetypes) {
    const nAnswered = Object.keys(state.answers).length;
    const distances = {};
    let minDist = Infinity;
    for (const a of archetypes) {
      const dist = archetypeDistance(state, a);
      distances[a.id] = dist;
      if (dist < minDist) minDist = dist;
    }
    const baseTemp = 0.12;
    const minTemp = 0.04;
    const coolRate = Math.min(1, nAnswered / 40);
    const temperature = baseTemp - (baseTemp - minTemp) * coolRate;
    let totalLikelihood = 0;
    const likelihoods = {};
    for (const a of archetypes) {
      const likelihood = Math.exp(-(distances[a.id] - minDist) / temperature);
      likelihoods[a.id] = likelihood * a.prior;
      totalLikelihood += likelihoods[a.id];
    }
    for (const a of archetypes) {
      state.archetypePosterior[a.id] = totalLikelihood > 0 ? likelihoods[a.id] / totalLikelihood : a.prior;
    }
    const entries = Object.entries(state.archetypePosterior).sort((a, b) => b[1] - a[1]);
    const newLeader = entries[0]?.[0];
    if (newLeader === state.currentLeader) {
      state.consecutiveLeadCount = (state.consecutiveLeadCount ?? 0) + 1;
    } else {
      state.currentLeader = newLeader;
      state.consecutiveLeadCount = 1;
    }
  }
  function toQuizQuestion(q) {
    const out = {
      id: q.id,
      promptShort: q.promptShort,
      promptFull: q.promptFull,
      uiType: q.uiType,
      section: q.section
    };
    if (q.optionLabels) {
      out.optionLabels = q.optionLabels;
    }
    if (q.optionEvidence) {
      out.options = Object.keys(q.optionEvidence);
    }
    if (q.uiType === "slider") {
      out.slider = { min: 0, max: 100 };
      if (q.sliderMap) {
        const keys = Object.keys(q.sliderMap);
        if (keys.length > 0) {
          const ranges = keys.map((k) => k.split("-").map(Number));
          const allMin = Math.min(...ranges.map((r) => r[0] ?? 0));
          const allMax = Math.max(...ranges.map((r) => r[1] ?? 100));
          out.slider = { min: allMin, max: allMax };
        }
      }
    }
    if (q.allocationMap) {
      out.allocationBuckets = Object.keys(q.allocationMap);
    }
    if (q.rankingMap) {
      out.rankingItems = Object.keys(q.rankingMap);
    }
    if (q.pairMaps) {
      out.pairIds = Object.keys(q.pairMaps);
    }
    if (q.bestWorstMap) {
      out.bestWorstItems = Object.keys(q.bestWorstMap);
    } else if (q.uiType === "best_worst" && q.rankingMap) {
      out.bestWorstItems = Object.keys(q.rankingMap);
    }
    return out;
  }
  function initQuiz() {
    _archetypes = ARCHETYPES;
    _questions = REPRESENTATIVE_QUESTIONS.filter((q) => q.touchProfile.length > 0);
    _questionsById = new Map(_questions.map((q) => [q.id, q]));
    resetSimilarityCache();
    _state = createInitialState(_archetypes);
    _snapshots.length = 0;
  }
  function getNextQuestion() {
    if (!_state) throw new Error("Call initQuiz() first");
    const nAnswered = Object.keys(_state.answers).length;
    if (nAnswered < FIXED_16.length) {
      const nextId = FIXED_16[nAnswered];
      const q = _questionsById.get(nextId);
      if (q) return toQuizQuestion(q);
    }
    const available = _questions.filter(
      (q) => !(q.id in _state.answers) && isQuestionEligible(_state, q)
    );
    const next = selectNextQuestion(_state, available, _archetypes);
    return next ? toQuizQuestion(next) : null;
  }
  function submitAnswer(questionId, answer) {
    if (!_state) throw new Error("Call initQuiz() first");
    _snapshots.push({ state: deepCopyState(_state), questionId });
    const q = _questionsById.get(questionId);
    if (!q) throw new Error(`Unknown question ID: ${questionId}`);
    switch (q.uiType) {
      case "single_choice":
      case "multi":
        applySingleChoiceAnswer(_state, q, answer);
        break;
      case "slider":
        applySliderAnswer(_state, q, answer);
        break;
      case "allocation":
        applyAllocationAnswer(_state, q, answer);
        break;
      case "ranking":
        applyRankingAnswer(_state, q, answer);
        break;
      case "pairwise":
        applyPairwiseAnswer(_state, q, answer);
        break;
      case "best_worst": {
        const bw = answer;
        const bwItems = q.bestWorstMap ? Object.keys(q.bestWorstMap) : q.rankingMap ? Object.keys(q.rankingMap) : [];
        if (bwItems.length > 0) {
          const middle = bwItems.filter((i) => i !== bw.best && i !== bw.worst);
          applyRankingAnswer(_state, q, [bw.best, ...middle, bw.worst]);
        }
        break;
      }
    }
    updatePosteriors(_state, _archetypes);
  }
  function getProgress() {
    if (!_state) throw new Error("Call initQuiz() first");
    const nAnswered = Object.keys(_state.answers).length;
    let estimatedTotal;
    if (nAnswered < 16) {
      estimatedTotal = 40;
    } else {
      const topPosterior = Math.max(...Object.values(_state.archetypePosterior));
      if (topPosterior > 0.5) estimatedTotal = Math.max(nAnswered + 3, 30);
      else if (topPosterior > 0.3) estimatedTotal = Math.max(nAnswered + 8, 35);
      else estimatedTotal = Math.max(nAnswered + 15, 45);
    }
    const sorted = Object.entries(_state.archetypePosterior).sort((a, b) => b[1] - a[1]).slice(0, 5);
    const topArchetypes = sorted.map(([id, posterior]) => {
      const arch = _archetypes.find((a) => a.id === id);
      return { id, name: arch?.name ?? "Unknown", posterior };
    });
    let phase;
    if (nAnswered < 16) phase = "salience";
    else if (nAnswered < 28) phase = "discriminate";
    else phase = "converge";
    return {
      questionsAnswered: nAnswered,
      estimatedTotal,
      topArchetypes,
      confidence: sorted[0]?.[1] ?? 0,
      phase
    };
  }
  function isComplete() {
    if (!_state) return false;
    const nAnswered = Object.keys(_state.answers).length;
    if (nAnswered < 20) return false;
    return shouldStop(_state, _archetypes);
  }
  function getResults() {
    if (!_state) throw new Error("Call initQuiz() first");
    const sorted = Object.entries(_state.archetypePosterior).sort((a, b) => b[1] - a[1]);
    const top5 = sorted.slice(0, 5).map(([id, posterior]) => {
      const arch = _archetypes.find((a) => a.id === id);
      return {
        id,
        name: arch.name,
        tier: arch.tier,
        posterior,
        distance: archetypeDistance(_state, arch)
      };
    });
    let family;
    if (top5.length >= 2) {
      const gap = top5[0].posterior - top5[1].posterior;
      if (gap < 0.03) {
        const words1 = top5[0].name.split(/[\s-]+/);
        const words2 = top5[1].name.split(/[\s-]+/);
        const shared = words1.filter((w) => words2.includes(w) && w.length > 2);
        const familyLabel = shared.length > 0 ? shared.join(" ") + " Family" : `${top5[0].name} / ${top5[1].name}`;
        family = {
          isFamily: true,
          familyLabel,
          members: [top5[0], top5[1]]
        };
      }
    }
    return {
      match: top5[0],
      top5,
      questionsAnswered: Object.keys(_state.answers).length,
      confidence: top5[0]?.posterior ?? 0,
      family
    };
  }
  function getQuestionIds() {
    return _questions.map((q) => q.id);
  }
  function getQuestionDef(questionId) {
    return _questionsById.get(questionId);
  }
  function getArchetypeCount() {
    return _archetypes.length;
  }
  function getRespondentState() {
    if (!_state) return null;
    const continuous = {};
    for (const [nodeId, node] of Object.entries(_state.continuous)) {
      const expectedPos = node.posDist.reduce((sum, p, i) => sum + p * (i + 1), 0);
      const salience = node.salDist.reduce((sum, p, i) => sum + p * i, 0);
      continuous[nodeId] = { expectedPos, salience, touches: node.touches };
    }
    const categorical = {};
    for (const [nodeId, node] of Object.entries(_state.categorical)) {
      const salience = node.salDist.reduce((sum, p, i) => sum + p * i, 0);
      categorical[nodeId] = { catDist: [...node.catDist], salience, touches: node.touches };
    }
    return { continuous, categorical };
  }
  function canGoBack() {
    return _snapshots.length > 0;
  }
  function goBack() {
    if (_snapshots.length === 0) return null;
    const snapshot = _snapshots.pop();
    _state = snapshot.state;
    return snapshot.questionId;
  }

  // src/browser/quiz-adapter.ts
  var _quiz = null;
  function mountQuiz(container, options = {}) {
    _quiz = { container, options, currentQuestion: null };
    injectStyles();
    showNextQuestion();
  }
  function injectStyles() {
    if (document.getElementById("prism-quiz-styles")) return;
    const style = document.createElement("style");
    style.id = "prism-quiz-styles";
    style.textContent = `
    .prism-quiz { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; max-width: 640px; margin: 0 auto; padding: 20px; }
    .prism-progress { margin-bottom: 24px; }
    .prism-progress-bar { height: 6px; background: #e0e0e0; border-radius: 3px; overflow: hidden; }
    .prism-progress-fill { height: 100%; background: #4a6fa5; border-radius: 3px; transition: width 0.3s ease; }
    .prism-progress-text { font-size: 13px; color: #666; margin-top: 6px; display: flex; justify-content: space-between; }
    .prism-question { margin-bottom: 32px; }
    .prism-question-text { font-size: 18px; line-height: 1.5; margin-bottom: 20px; color: #1a1a1a; }
    .prism-question-number { font-size: 13px; color: #999; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px; }
    .prism-options { display: flex; flex-direction: column; gap: 10px; }
    .prism-option { padding: 14px 18px; border: 2px solid #e0e0e0; border-radius: 8px; cursor: pointer; font-size: 15px; transition: all 0.15s ease; background: white; text-align: left; }
    .prism-option:hover { border-color: #4a6fa5; background: #f5f8fc; }
    .prism-option.selected { border-color: #4a6fa5; background: #eef3fa; }
    .prism-slider-container { padding: 20px 0; }
    .prism-slider { width: 100%; -webkit-appearance: none; height: 8px; border-radius: 4px; background: #e0e0e0; outline: none; }
    .prism-slider::-webkit-slider-thumb { -webkit-appearance: none; width: 22px; height: 22px; border-radius: 50%; background: #4a6fa5; cursor: pointer; }
    .prism-slider::-moz-range-thumb { width: 22px; height: 22px; border-radius: 50%; background: #4a6fa5; cursor: pointer; border: none; }
    .prism-slider-labels { display: flex; justify-content: space-between; font-size: 13px; color: #666; margin-top: 8px; }
    .prism-slider-value { text-align: center; font-size: 24px; font-weight: 600; color: #4a6fa5; margin-top: 12px; }
    .prism-btn { padding: 12px 32px; border: none; border-radius: 8px; font-size: 15px; font-weight: 600; cursor: pointer; transition: all 0.15s ease; }
    .prism-btn-primary { background: #4a6fa5; color: white; }
    .prism-btn-primary:hover { background: #3d5d8a; }
    .prism-btn-primary:disabled { background: #b0c4de; cursor: not-allowed; }
    .prism-actions { display: flex; justify-content: flex-end; margin-top: 24px; }
    .prism-results { text-align: center; }
    .prism-results h2 { font-size: 24px; margin-bottom: 8px; color: #1a1a1a; }
    .prism-results .prism-match-name { font-size: 32px; font-weight: 700; color: #4a6fa5; margin: 16px 0; }
    .prism-results .prism-confidence { font-size: 14px; color: #666; margin-bottom: 24px; }
    .prism-top5 { text-align: left; margin-top: 24px; }
    .prism-top5 h3 { font-size: 16px; margin-bottom: 12px; color: #333; }
    .prism-top5-item { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid #eee; }
    .prism-top5-name { font-weight: 500; }
    .prism-top5-score { font-size: 13px; color: #666; }
    .prism-top5-bar { height: 4px; background: #e0e0e0; border-radius: 2px; margin-top: 4px; overflow: hidden; }
    .prism-top5-bar-fill { height: 100%; background: #4a6fa5; border-radius: 2px; }
    .prism-debug { font-size: 11px; color: #999; margin-top: 24px; padding: 12px; background: #f5f5f5; border-radius: 6px; font-family: monospace; white-space: pre-wrap; }
    .prism-ranking-list { list-style: none; padding: 0; margin: 0; }
    .prism-ranking-item { padding: 12px 16px; margin: 6px 0; border: 2px solid #e0e0e0; border-radius: 8px; cursor: grab; background: white; display: flex; align-items: center; gap: 12px; user-select: none; }
    .prism-ranking-item:active { cursor: grabbing; }
    .prism-ranking-item.dragging { opacity: 0.5; }
    .prism-ranking-handle { color: #999; font-size: 18px; }
    .prism-ranking-rank { font-weight: 600; color: #4a6fa5; min-width: 24px; }
    .prism-alloc-container { display: flex; flex-direction: column; gap: 16px; }
    .prism-alloc-item { display: flex; align-items: center; gap: 12px; }
    .prism-alloc-label { flex: 1; font-size: 14px; }
    .prism-alloc-slider { flex: 2; }
    .prism-alloc-value { min-width: 40px; text-align: right; font-weight: 600; font-size: 14px; }
    .prism-bw-container { display: flex; flex-direction: column; gap: 8px; }
    .prism-bw-row { display: flex; align-items: center; gap: 12px; padding: 10px; border: 1px solid #eee; border-radius: 6px; }
    .prism-bw-row label { flex: 1; font-size: 14px; }
    .prism-bw-btn { padding: 6px 14px; border: 2px solid #e0e0e0; border-radius: 6px; background: white; cursor: pointer; font-size: 12px; font-weight: 600; transition: all 0.15s; }
    .prism-bw-btn:hover { border-color: #4a6fa5; }
    .prism-bw-btn.best-selected { border-color: #2e7d32; background: #e8f5e9; color: #2e7d32; }
    .prism-bw-btn.worst-selected { border-color: #c62828; background: #ffebee; color: #c62828; }
  `;
    document.head.appendChild(style);
  }
  function getQuestionText(q) {
    if (_quiz?.options.questionText?.[q.promptShort]) {
      return _quiz.options.questionText[q.promptShort];
    }
    return q.promptFull ?? q.promptShort.replace(/_/g, " ");
  }
  function showNextQuestion() {
    if (!_quiz) return;
    if (isComplete()) {
      showResults();
      return;
    }
    const q = getNextQuestion();
    if (!q) {
      showResults();
      return;
    }
    _quiz.currentQuestion = q;
    const progress = getProgress();
    _quiz.container.innerHTML = "";
    _quiz.container.className = "prism-quiz";
    const progressEl = renderProgress(progress);
    _quiz.container.appendChild(progressEl);
    const questionEl = document.createElement("div");
    questionEl.className = "prism-question";
    const numEl = document.createElement("div");
    numEl.className = "prism-question-number";
    numEl.textContent = `Question ${progress.questionsAnswered + 1}`;
    questionEl.appendChild(numEl);
    const textEl = document.createElement("div");
    textEl.className = "prism-question-text";
    textEl.textContent = getQuestionText(q);
    questionEl.appendChild(textEl);
    switch (q.uiType) {
      case "single_choice":
      case "multi":
        questionEl.appendChild(renderSingleChoice(q));
        break;
      case "slider":
        questionEl.appendChild(renderSlider(q));
        break;
      case "allocation":
        questionEl.appendChild(renderAllocation(q));
        break;
      case "ranking":
        questionEl.appendChild(renderRanking(q));
        break;
      case "best_worst":
        questionEl.appendChild(renderBestWorst(q));
        break;
      case "pairwise":
        questionEl.appendChild(renderPairwise(q));
        break;
      default:
        if (q.options) {
          questionEl.appendChild(renderSingleChoice(q));
        }
    }
    _quiz.container.appendChild(questionEl);
    if (_quiz.options.debug) {
      const debugEl = document.createElement("div");
      debugEl.className = "prism-debug";
      debugEl.textContent = JSON.stringify(progress, null, 2);
      _quiz.container.appendChild(debugEl);
    }
  }
  function renderProgress(progress) {
    const el = document.createElement("div");
    el.className = "prism-progress";
    const pct = Math.min(100, Math.round(progress.questionsAnswered / progress.estimatedTotal * 100));
    el.innerHTML = `
    <div class="prism-progress-bar">
      <div class="prism-progress-fill" style="width: ${pct}%"></div>
    </div>
    <div class="prism-progress-text">
      <span>${progress.questionsAnswered} answered</span>
      <span>~${progress.estimatedTotal - progress.questionsAnswered} remaining</span>
    </div>
  `;
    return el;
  }
  function renderSingleChoice(q) {
    const container = document.createElement("div");
    container.className = "prism-options";
    let selected = null;
    for (const opt of q.options ?? []) {
      const btn = document.createElement("button");
      btn.className = "prism-option";
      btn.textContent = q.optionLabels?.[opt] ?? opt.replace(/_/g, " ");
      btn.type = "button";
      btn.addEventListener("click", () => {
        selected = opt;
        container.querySelectorAll(".prism-option").forEach((b) => b.classList.remove("selected"));
        btn.classList.add("selected");
        setTimeout(() => {
          submitAnswer(q.id, opt);
          showNextQuestion();
        }, 250);
      });
      container.appendChild(btn);
    }
    return container;
  }
  function renderSlider(q) {
    const container = document.createElement("div");
    container.className = "prism-slider-container";
    const min = q.slider?.min ?? 0;
    const max = q.slider?.max ?? 100;
    const mid = Math.round((min + max) / 2);
    const slider = document.createElement("input");
    slider.type = "range";
    slider.className = "prism-slider";
    slider.min = String(min);
    slider.max = String(max);
    slider.value = String(mid);
    const valueDisplay = document.createElement("div");
    valueDisplay.className = "prism-slider-value";
    valueDisplay.textContent = String(mid);
    slider.addEventListener("input", () => {
      valueDisplay.textContent = slider.value;
    });
    const labels = document.createElement("div");
    labels.className = "prism-slider-labels";
    labels.innerHTML = `<span>${min}</span><span>${max}</span>`;
    container.appendChild(slider);
    container.appendChild(valueDisplay);
    container.appendChild(labels);
    const actions = document.createElement("div");
    actions.className = "prism-actions";
    const btn = document.createElement("button");
    btn.className = "prism-btn prism-btn-primary";
    btn.textContent = "Continue";
    btn.type = "button";
    btn.addEventListener("click", () => {
      submitAnswer(q.id, Number(slider.value));
      showNextQuestion();
    });
    actions.appendChild(btn);
    container.appendChild(actions);
    return container;
  }
  function renderAllocation(q) {
    const container = document.createElement("div");
    const buckets = q.allocationBuckets ?? [];
    const allocContainer = document.createElement("div");
    allocContainer.className = "prism-alloc-container";
    const values = {};
    for (const b of buckets) {
      values[b] = Math.round(100 / buckets.length);
    }
    function renderItems() {
      allocContainer.innerHTML = "";
      for (const bucket of buckets) {
        const item = document.createElement("div");
        item.className = "prism-alloc-item";
        const label = document.createElement("span");
        label.className = "prism-alloc-label";
        label.textContent = q.optionLabels?.[bucket] ?? bucket.replace(/_/g, " ");
        const slider = document.createElement("input");
        slider.type = "range";
        slider.className = "prism-slider prism-alloc-slider";
        slider.min = "0";
        slider.max = "100";
        slider.value = String(values[bucket]);
        const val = document.createElement("span");
        val.className = "prism-alloc-value";
        val.textContent = String(values[bucket]);
        slider.addEventListener("input", () => {
          values[bucket] = Number(slider.value);
          val.textContent = slider.value;
        });
        item.appendChild(label);
        item.appendChild(slider);
        item.appendChild(val);
        allocContainer.appendChild(item);
      }
    }
    renderItems();
    container.appendChild(allocContainer);
    const actions = document.createElement("div");
    actions.className = "prism-actions";
    const btn = document.createElement("button");
    btn.className = "prism-btn prism-btn-primary";
    btn.textContent = "Continue";
    btn.type = "button";
    btn.addEventListener("click", () => {
      submitAnswer(q.id, values);
      showNextQuestion();
    });
    actions.appendChild(btn);
    container.appendChild(actions);
    return container;
  }
  function renderRanking(q) {
    const container = document.createElement("div");
    const items = [...q.rankingItems ?? []];
    const list = document.createElement("ul");
    list.className = "prism-ranking-list";
    function renderList() {
      list.innerHTML = "";
      items.forEach((item, idx) => {
        const li = document.createElement("li");
        li.className = "prism-ranking-item";
        li.draggable = true;
        li.dataset.index = String(idx);
        li.innerHTML = `
        <span class="prism-ranking-handle">&#x2630;</span>
        <span class="prism-ranking-rank">${idx + 1}</span>
        <span>${q.optionLabels?.[item] ?? item.replace(/_/g, " ")}</span>
      `;
        li.addEventListener("dragstart", (e) => {
          li.classList.add("dragging");
          e.dataTransfer.effectAllowed = "move";
          e.dataTransfer.setData("text/plain", String(idx));
        });
        li.addEventListener("dragend", () => {
          li.classList.remove("dragging");
        });
        li.addEventListener("dragover", (e) => {
          e.preventDefault();
          e.dataTransfer.dropEffect = "move";
        });
        li.addEventListener("drop", (e) => {
          e.preventDefault();
          const fromIdx = Number(e.dataTransfer.getData("text/plain"));
          const toIdx = idx;
          if (fromIdx !== toIdx) {
            const [moved] = items.splice(fromIdx, 1);
            items.splice(toIdx, 0, moved);
            renderList();
          }
        });
        list.appendChild(li);
      });
    }
    renderList();
    container.appendChild(list);
    const actions = document.createElement("div");
    actions.className = "prism-actions";
    const btn = document.createElement("button");
    btn.className = "prism-btn prism-btn-primary";
    btn.textContent = "Continue";
    btn.type = "button";
    btn.addEventListener("click", () => {
      submitAnswer(q.id, items);
      showNextQuestion();
    });
    actions.appendChild(btn);
    container.appendChild(actions);
    return container;
  }
  function renderBestWorst(q) {
    const container = document.createElement("div");
    container.className = "prism-bw-container";
    const items = q.bestWorstItems ?? [];
    let best = null;
    let worst = null;
    function renderItems() {
      container.innerHTML = "";
      for (const item of items) {
        const row = document.createElement("div");
        row.className = "prism-bw-row";
        const bestBtn = document.createElement("button");
        bestBtn.className = "prism-bw-btn" + (best === item ? " best-selected" : "");
        bestBtn.textContent = "Best";
        bestBtn.type = "button";
        bestBtn.addEventListener("click", () => {
          best = item;
          if (worst === item) worst = null;
          renderItems();
          trySubmitBW();
        });
        const label = document.createElement("label");
        label.textContent = q.optionLabels?.[item] ?? item.replace(/_/g, " ");
        const worstBtn = document.createElement("button");
        worstBtn.className = "prism-bw-btn" + (worst === item ? " worst-selected" : "");
        worstBtn.textContent = "Worst";
        worstBtn.type = "button";
        worstBtn.addEventListener("click", () => {
          worst = item;
          if (best === item) best = null;
          renderItems();
          trySubmitBW();
        });
        row.appendChild(bestBtn);
        row.appendChild(label);
        row.appendChild(worstBtn);
        container.appendChild(row);
      }
    }
    function trySubmitBW() {
      if (best && worst) {
        setTimeout(() => {
          submitAnswer(q.id, { best, worst });
          showNextQuestion();
        }, 300);
      }
    }
    renderItems();
    return container;
  }
  function renderPairwise(q) {
    const container = document.createElement("div");
    const pairIds = q.pairIds ?? [];
    const answers = {};
    let currentPairIdx = 0;
    function showPair() {
      container.innerHTML = "";
      if (currentPairIdx >= pairIds.length) {
        submitAnswer(q.id, answers);
        showNextQuestion();
        return;
      }
      const pairId = pairIds[currentPairIdx];
      const subLabel = document.createElement("div");
      subLabel.style.cssText = "font-size:13px;color:#999;margin-bottom:12px;";
      subLabel.textContent = `Pair ${currentPairIdx + 1} of ${pairIds.length}`;
      container.appendChild(subLabel);
      const opts = document.createElement("div");
      opts.className = "prism-options";
      for (const choice of ["A", "B"]) {
        const btn = document.createElement("button");
        btn.className = "prism-option";
        btn.textContent = `Option ${choice}`;
        btn.type = "button";
        btn.addEventListener("click", () => {
          answers[pairId] = choice;
          currentPairIdx++;
          showPair();
        });
        opts.appendChild(btn);
      }
      container.appendChild(opts);
    }
    showPair();
    return container;
  }
  function showResults() {
    if (!_quiz) return;
    const results = getResults();
    _quiz.container.innerHTML = "";
    _quiz.container.className = "prism-quiz";
    const el = document.createElement("div");
    el.className = "prism-results";
    const maxPosterior = results.top5[0]?.posterior ?? 1;
    el.innerHTML = `
    <h2>Your Political Archetype</h2>
    <div class="prism-match-name">${results.match.name}</div>
    <div class="prism-confidence">
      Confidence: ${(results.confidence * 100).toFixed(1)}% |
      ${results.questionsAnswered} questions answered
    </div>
    <div class="prism-top5">
      <h3>Top 5 Matches</h3>
      ${results.top5.map((r, i) => `
        <div class="prism-top5-item">
          <div>
            <div class="prism-top5-name">${i + 1}. ${r.name}</div>
            <div class="prism-top5-bar">
              <div class="prism-top5-bar-fill" style="width: ${(r.posterior / maxPosterior * 100).toFixed(1)}%"></div>
            </div>
          </div>
          <div class="prism-top5-score">${(r.posterior * 100).toFixed(1)}%</div>
        </div>
      `).join("")}
    </div>
  `;
    _quiz.container.appendChild(el);
    if (_quiz.options.onComplete) {
      _quiz.options.onComplete(results);
    }
  }
  function attachToExistingQuiz(options) {
    const { container, onComplete } = options;
    container.querySelectorAll(".quiz-page").forEach((page) => {
      page.style.display = "none";
    });
    const dynamicArea = document.createElement("div");
    dynamicArea.className = "prism-quiz";
    container.prepend(dynamicArea);
    injectStyles();
    mountQuiz(dynamicArea, {
      onComplete: (results) => {
        dynamicArea.remove();
        const resultsArea = document.createElement("div");
        resultsArea.className = "prism-quiz";
        container.prepend(resultsArea);
        _quiz = { container: resultsArea, options: { onComplete }, currentQuestion: null };
        showResults();
        if (onComplete) onComplete(results);
      }
    });
  }
  return __toCommonJS(index_exports);
})();
//# sourceMappingURL=prism-engine-bundle.js.map
