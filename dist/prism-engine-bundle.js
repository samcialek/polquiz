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
    applyRatioBoost: () => applyRatioBoost,
    attachToExistingQuiz: () => attachToExistingQuiz,
    canGoBack: () => canGoBack,
    getArchetypeCount: () => getArchetypeCount,
    getElectionPredictions: () => getElectionPredictions,
    getIdentityPrimaryResult: () => getIdentityPrimaryResult,
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
        EPS: { kind: "categorical", probs: [0.25, 0.58, 0.05, 0.03, 0.06, 0.03], sal: 2, antiCats: [5] },
        AES: { kind: "categorical", probs: [0.6, 0.1, 0.14, 0.06, 0.04, 0.06], sal: 2, antiCats: [4] }
      }
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
        PF: { kind: "continuous", pos: 2, sal: 1 },
        TRB: { kind: "continuous", pos: 2, sal: 1 },
        EPS: { kind: "categorical", probs: [0.25, 0.58, 0.05, 0.03, 0.06, 0.03], sal: 1, antiCats: [5] },
        AES: { kind: "categorical", probs: [0.6, 0.1, 0.14, 0.06, 0.04, 0.06], sal: 1, antiCats: [4] }
      }
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
        PF: { kind: "continuous", pos: 2, sal: 1 },
        TRB: { kind: "continuous", pos: 2, sal: 1 },
        EPS: { kind: "categorical", probs: [0.62, 0.24, 0.03, 0.04, 0.03, 0.04], sal: 1, antiCats: [2, 3, 5] },
        AES: { kind: "categorical", probs: [0.08, 0.64, 0.04, 0.04, 0.03, 0.17], sal: 1, antiCats: [4] }
      }
    },
    {
      id: "004",
      name: "Labor Reformer",
      tier: "T1",
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
        EPS: { kind: "categorical", probs: [0.25, 0.58, 0.05, 0.03, 0.06, 0.03], sal: 1, antiCats: [5] },
        AES: { kind: "categorical", probs: [0.04, 0.03, 0.04, 0.18, 0.63, 0.08], sal: 1, antiCats: [0, 1] }
      }
    },
    {
      id: "005",
      name: "Pluralist Structuralist",
      tier: "T1",
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
        EPS: { kind: "categorical", probs: [0.25, 0.58, 0.05, 0.03, 0.06, 0.03], sal: 1 },
        AES: { kind: "categorical", probs: [0.6, 0.1, 0.14, 0.06, 0.04, 0.06], sal: 1 }
      }
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
        ZS: { kind: "continuous", pos: 2, sal: 2 },
        // raised sal 1→2 (discriminator vs Social Stabilizer)
        ONT_H: { kind: "continuous", pos: 4, sal: 1 },
        ONT_S: { kind: "continuous", pos: 3, sal: 2 },
        // raised sal 1→2 (discriminator vs Social Stabilizer)
        PF: { kind: "continuous", pos: 2, sal: 1 },
        TRB: { kind: "continuous", pos: 2, sal: 1 },
        EPS: { kind: "categorical", probs: [0.62, 0.24, 0.03, 0.04, 0.03, 0.04], sal: 1, antiCats: [2, 3, 5] },
        AES: { kind: "categorical", probs: [0.6, 0.2, 0.04, 0.06, 0.04, 0.06], sal: 1, antiCats: [4] }
      }
    },
    {
      id: "007",
      name: "Solidarist Reformer",
      tier: "T1",
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
        EPS: { kind: "categorical", probs: [0.04, 0.08, 0.6, 0.16, 0.08, 0.04], sal: 1, antiCats: [0, 5] },
        AES: { kind: "categorical", probs: [0.6, 0.1, 0.14, 0.06, 0.04, 0.06], sal: 1, antiCats: [4] }
      }
    },
    {
      id: "008",
      name: "Procedural Redistributionist",
      tier: "T1",
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
        EPS: { kind: "categorical", probs: [0.25, 0.58, 0.05, 0.03, 0.06, 0.03], sal: 1, antiCats: [5] },
        AES: { kind: "categorical", probs: [0.6, 0.1, 0.14, 0.06, 0.04, 0.06], sal: 1, antiCats: [4] }
      }
    },
    {
      id: "010",
      name: "Bread-and-Butter Progressive",
      tier: "T1",
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
        EPS: { kind: "categorical", probs: [0.25, 0.58, 0.05, 0.03, 0.06, 0.03], sal: 1, antiCats: [5] },
        AES: { kind: "categorical", probs: [0.6, 0.1, 0.14, 0.06, 0.04, 0.06], sal: 1, antiCats: [4] }
      }
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
        PF: { kind: "continuous", pos: 2, sal: 2 },
        TRB: { kind: "continuous", pos: 3, sal: 2 },
        EPS: { kind: "categorical", probs: [0.05, 0.05, 0.08, 0.58, 0.19, 0.05], sal: 1, antiCats: [0, 5] },
        AES: { kind: "categorical", probs: [0.04, 0.03, 0.04, 0.18, 0.63, 0.08], sal: 1, antiCats: [0, 1] }
      }
    },
    {
      id: "012",
      name: "Class-War Leftist",
      tier: "T1",
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
        EPS: { kind: "categorical", probs: [0.08, 0.08, 0.08, 0.2, 0.5, 0.06], sal: 1, antiCats: [2, 5] },
        AES: { kind: "categorical", probs: [0.04, 0.03, 0.04, 0.18, 0.63, 0.08], sal: 2, antiCats: [0, 1] }
      }
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
        PF: { kind: "continuous", pos: 2, sal: 1 },
        TRB: { kind: "continuous", pos: 3, sal: 1 },
        EPS: { kind: "categorical", probs: [0.08, 0.08, 0.08, 0.2, 0.5, 0.06], sal: 1, antiCats: [2, 5] },
        AES: { kind: "categorical", probs: [0.04, 0.03, 0.04, 0.18, 0.63, 0.08], sal: 2, antiCats: [0, 1] }
      }
    },
    {
      id: "014",
      name: "Activist Progressive",
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
        ONT_S: { kind: "continuous", pos: 2, sal: 1 },
        PF: { kind: "continuous", pos: 2, sal: 1 },
        TRB: { kind: "continuous", pos: 3, sal: 1 },
        EPS: { kind: "categorical", probs: [0.08, 0.08, 0.08, 0.2, 0.5, 0.06], sal: 1, antiCats: [2, 5] },
        AES: { kind: "categorical", probs: [0.06, 0.08, 0.05, 0.06, 0.08, 0.67], sal: 1 }
      }
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
        PF: { kind: "continuous", pos: 2, sal: 2, anti: "low" },
        TRB: { kind: "continuous", pos: 4, sal: 2 },
        EPS: { kind: "categorical", probs: [0.05, 0.05, 0.08, 0.58, 0.19, 0.05], sal: 2, antiCats: [0, 5] },
        AES: { kind: "categorical", probs: [0.06, 0.08, 0.05, 0.06, 0.08, 0.67], sal: 2 }
      }
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
        PF: { kind: "continuous", pos: 2, sal: 1 },
        TRB: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
        EPS: { kind: "categorical", probs: [0.08, 0.08, 0.08, 0.2, 0.5, 0.06], sal: 1, antiCats: [2, 5] },
        AES: { kind: "categorical", probs: [0.04, 0.03, 0.04, 0.18, 0.63, 0.08], sal: 2, antiCats: [0, 1] }
      }
    },
    {
      id: "017",
      name: "Uncompromising Redistributionist",
      tier: "T1",
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
        EPS: { kind: "categorical", probs: [0.08, 0.08, 0.08, 0.2, 0.5, 0.06], sal: 1, antiCats: [2, 5] },
        AES: { kind: "categorical", probs: [0.04, 0.03, 0.04, 0.18, 0.63, 0.08], sal: 1, antiCats: [0, 1] }
      }
    },
    // 019 Anarchist Mutualist — MERGED into 020 Grassroots Autonomist
    {
      id: "019",
      name: "Anarchist Mutualist",
      tier: "T1",
      active: false,
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
        EPS: { kind: "categorical", probs: [0.25, 0.58, 0.05, 0.03, 0.06, 0.03], sal: 1, antiCats: [5] },
        AES: { kind: "categorical", probs: [0.06, 0.18, 0.05, 0.06, 0.08, 0.57], sal: 2 }
      }
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
        PF: { kind: "continuous", pos: 2, sal: 1 },
        TRB: { kind: "continuous", pos: 1, sal: 2 },
        EPS: { kind: "categorical", probs: [0.25, 0.58, 0.05, 0.03, 0.06, 0.03], sal: 1 },
        AES: { kind: "categorical", probs: [0.06, 0.18, 0.05, 0.06, 0.08, 0.57], sal: 1 }
      }
    },
    {
      // 023 Rights Cosmopolitan — MERGED into 021 Principled Cosmopolitan
      id: "023",
      name: "Rights Cosmopolitan",
      tier: "T1",
      active: false,
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
        EPS: { kind: "categorical", probs: [0.25, 0.58, 0.05, 0.03, 0.06, 0.03], sal: 1, antiCats: [5] },
        AES: { kind: "categorical", probs: [0.06, 0.08, 0.05, 0.06, 0.08, 0.67], sal: 2 }
        // raised sal 1→2
      }
    },
    {
      id: "024",
      name: "Ethical Internationalist",
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
        ONT_S: { kind: "continuous", pos: 3, sal: 1 },
        PF: { kind: "continuous", pos: 2, sal: 2 },
        TRB: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
        EPS: { kind: "categorical", probs: [0.25, 0.58, 0.05, 0.03, 0.06, 0.03], sal: 1, antiCats: [5] },
        AES: { kind: "categorical", probs: [0.06, 0.18, 0.05, 0.06, 0.08, 0.57], sal: 2 }
      }
    },
    {
      // 025 World-Minded Reformer — MERGED into 021 Principled Cosmopolitan
      id: "025",
      name: "World-Minded Reformer",
      tier: "T1",
      active: false,
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
        EPS: { kind: "categorical", probs: [0.25, 0.58, 0.05, 0.03, 0.06, 0.03], sal: 2, antiCats: [5] },
        // raised sal 1→2
        AES: { kind: "categorical", probs: [0.08, 0.64, 0.04, 0.04, 0.03, 0.17], sal: 2, antiCats: [4] }
      }
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
        PF: { kind: "continuous", pos: 2, sal: 1 },
        TRB: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
        EPS: { kind: "categorical", probs: [0.25, 0.58, 0.05, 0.03, 0.06, 0.03], sal: 1, antiCats: [5] },
        AES: { kind: "categorical", probs: [0.06, 0.18, 0.05, 0.06, 0.08, 0.57], sal: 1 }
      }
    },
    {
      id: "027",
      name: "Popperian Liberal",
      tier: "T1",
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
        EPS: { kind: "categorical", probs: [0.62, 0.24, 0.03, 0.04, 0.03, 0.04], sal: 3, antiCats: [2, 3, 5] },
        AES: { kind: "categorical", probs: [0.6, 0.1, 0.14, 0.06, 0.04, 0.06], sal: 1, antiCats: [4] }
      }
    },
    {
      id: "028",
      name: "Global Caretaker",
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
        ONT_S: { kind: "continuous", pos: 3, sal: 1 },
        PF: { kind: "continuous", pos: 2, sal: 2 },
        TRB: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
        EPS: { kind: "categorical", probs: [0.25, 0.58, 0.05, 0.03, 0.06, 0.03], sal: 1, antiCats: [5] },
        AES: { kind: "categorical", probs: [0.06, 0.05, 0.62, 0.17, 0.03, 0.07], sal: 1 }
      }
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
        PF: { kind: "continuous", pos: 2, sal: 2 },
        TRB: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
        EPS: { kind: "categorical", probs: [0.05, 0.05, 0.08, 0.58, 0.19, 0.05], sal: 1, antiCats: [0, 5] },
        AES: { kind: "categorical", probs: [0.06, 0.18, 0.05, 0.06, 0.08, 0.57], sal: 2 }
      }
    },
    {
      id: "031",
      name: "Planetary Steward",
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
        ONT_S: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
        PF: { kind: "continuous", pos: 2, sal: 1 },
        TRB: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
        EPS: { kind: "categorical", probs: [0.62, 0.24, 0.03, 0.04, 0.03, 0.04], sal: 1, antiCats: [2, 3, 5] },
        AES: { kind: "categorical", probs: [0.06, 0.05, 0.62, 0.17, 0.03, 0.07], sal: 2 }
      }
    },
    {
      id: "032",
      name: "Hamiltonian Technocrat",
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
        ONT_S: { kind: "continuous", pos: 3, sal: 1 },
        PF: { kind: "continuous", pos: 3, sal: 1, anti: "high" },
        // Fixed: sal 0→1 (can't have anti on sal=0)
        TRB: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
        EPS: { kind: "categorical", probs: [0.62, 0.24, 0.03, 0.04, 0.03, 0.04], sal: 3, antiCats: [2, 3, 5] },
        AES: { kind: "categorical", probs: [0.08, 0.64, 0.04, 0.04, 0.03, 0.17], sal: 3, antiCats: [4] }
      }
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
        PF: { kind: "continuous", pos: 3, sal: 1, anti: "low" },
        TRB: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
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
        EPS: { kind: "categorical", probs: [0.62, 0.24, 0.03, 0.04, 0.03, 0.04], sal: 2, antiCats: [2, 3, 5] },
        AES: { kind: "categorical", probs: [0.08, 0.64, 0.04, 0.04, 0.03, 0.17], sal: 2, antiCats: [4] }
      }
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
        PF: { kind: "continuous", pos: 3, sal: 2 },
        TRB: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
        EPS: { kind: "categorical", probs: [0.62, 0.24, 0.03, 0.04, 0.03, 0.04], sal: 2, antiCats: [2, 3, 5] },
        AES: { kind: "categorical", probs: [0.08, 0.64, 0.04, 0.04, 0.03, 0.17], sal: 2, antiCats: [4] }
      }
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
        PF: { kind: "continuous", pos: 2, sal: 1 },
        TRB: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
        EPS: { kind: "categorical", probs: [0.25, 0.58, 0.05, 0.03, 0.06, 0.03], sal: 2, antiCats: [5] },
        AES: { kind: "categorical", probs: [0.08, 0.64, 0.04, 0.04, 0.03, 0.17], sal: 2, antiCats: [4] }
      }
    },
    {
      id: "039",
      name: "Data-Driven Moderate",
      tier: "T1",
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
        EPS: { kind: "categorical", probs: [0.62, 0.24, 0.03, 0.04, 0.03, 0.04], sal: 3, antiCats: [2, 3, 5] },
        AES: { kind: "categorical", probs: [0.08, 0.64, 0.04, 0.04, 0.03, 0.17], sal: 3, antiCats: [4] }
      }
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
        PF: { kind: "continuous", pos: 3, sal: 0 },
        TRB: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
        EPS: { kind: "categorical", probs: [0.62, 0.24, 0.03, 0.04, 0.03, 0.04], sal: 2, antiCats: [2, 3, 5] },
        AES: { kind: "categorical", probs: [0.08, 0.64, 0.04, 0.04, 0.03, 0.17], sal: 2, antiCats: [4] }
      }
    },
    {
      id: "042",
      name: "Localist Progressive",
      tier: "T1",
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
        EPS: { kind: "categorical", probs: [0.04, 0.08, 0.6, 0.16, 0.08, 0.04], sal: 1, antiCats: [0, 5] },
        AES: { kind: "categorical", probs: [0.06, 0.05, 0.62, 0.17, 0.03, 0.07], sal: 1 }
      }
    },
    {
      id: "043",
      name: "Quiet Egalitarian",
      tier: "T1",
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
        EPS: { kind: "categorical", probs: [0.04, 0.08, 0.6, 0.16, 0.08, 0.04], sal: 1, antiCats: [0, 5] },
        AES: { kind: "categorical", probs: [0.06, 0.05, 0.62, 0.17, 0.03, 0.07], sal: 2 }
      }
    },
    {
      id: "045",
      name: "Rooted Social Reformer",
      tier: "T1",
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
        EPS: { kind: "categorical", probs: [0.14, 0.33, 0.33, 0.1, 0.07, 0.04], sal: 1 },
        AES: { kind: "categorical", probs: [0.06, 0.05, 0.62, 0.17, 0.03, 0.07], sal: 2 }
      }
    },
    {
      id: "046",
      name: "Pastoral Leftist",
      tier: "T1",
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
        EPS: { kind: "categorical", probs: [0.04, 0.08, 0.6, 0.16, 0.08, 0.04], sal: 1, antiCats: [0, 5] },
        AES: { kind: "categorical", probs: [0.06, 0.05, 0.62, 0.17, 0.03, 0.07], sal: 2 }
      }
    },
    {
      id: "049",
      name: "Moral Egalitarian",
      tier: "T1",
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
        EPS: { kind: "categorical", probs: [0.04, 0.08, 0.6, 0.16, 0.08, 0.04], sal: 1, antiCats: [0, 5] },
        AES: { kind: "categorical", probs: [0.06, 0.05, 0.62, 0.17, 0.03, 0.07], sal: 1 }
      }
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
        PF: { kind: "continuous", pos: 2, sal: 1 },
        TRB: { kind: "continuous", pos: 2, sal: 1 },
        EPS: { kind: "categorical", probs: [0.04, 0.08, 0.6, 0.16, 0.08, 0.04], sal: 1, antiCats: [0, 5] },
        AES: { kind: "categorical", probs: [0.06, 0.05, 0.62, 0.17, 0.03, 0.07], sal: 1 }
      }
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
        PF: { kind: "continuous", pos: 2, sal: 1 },
        TRB: { kind: "continuous", pos: 2, sal: 1 },
        EPS: { kind: "categorical", probs: [0.04, 0.08, 0.6, 0.16, 0.08, 0.04], sal: 1, antiCats: [0, 5] },
        AES: { kind: "categorical", probs: [0.06, 0.05, 0.62, 0.17, 0.03, 0.07], sal: 1 }
      }
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
        PF: { kind: "continuous", pos: 3, sal: 1 },
        TRB: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
        EPS: { kind: "categorical", probs: [0.25, 0.58, 0.05, 0.03, 0.06, 0.03], sal: 2, antiCats: [5] },
        AES: { kind: "categorical", probs: [0.6, 0.2, 0.04, 0.06, 0.04, 0.06], sal: 1, antiCats: [4] }
      }
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
        COM: { kind: "continuous", pos: 4, sal: 3 },
        // Fixed: Moderate = high compromise
        ZS: { kind: "continuous", pos: 1, sal: 2 },
        ONT_H: { kind: "continuous", pos: 5, sal: 3, anti: "low" },
        ONT_S: { kind: "continuous", pos: 4, sal: 2 },
        PF: { kind: "continuous", pos: 3, sal: 1 },
        TRB: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
        EPS: { kind: "categorical", probs: [0.25, 0.58, 0.05, 0.03, 0.06, 0.03], sal: 2, antiCats: [5] },
        AES: { kind: "categorical", probs: [0.08, 0.64, 0.04, 0.04, 0.03, 0.17], sal: 2, antiCats: [4] }
      }
    },
    {
      id: "056",
      name: "Institutional Centrist",
      tier: "T1",
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
        EPS: { kind: "categorical", probs: [0.25, 0.58, 0.05, 0.03, 0.06, 0.03], sal: 2, antiCats: [5] },
        AES: { kind: "categorical", probs: [0.6, 0.2, 0.04, 0.06, 0.04, 0.06], sal: 1, antiCats: [4] }
      }
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
        PF: { kind: "continuous", pos: 3, sal: 1 },
        TRB: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
        EPS: { kind: "categorical", probs: [0.25, 0.58, 0.05, 0.03, 0.06, 0.03], sal: 1, antiCats: [5] },
        AES: { kind: "categorical", probs: [0.6, 0.2, 0.04, 0.06, 0.04, 0.06], sal: 1, antiCats: [4] }
      }
    },
    {
      id: "059",
      name: "Public-Minded Moderate",
      tier: "T1",
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
        EPS: { kind: "categorical", probs: [0.25, 0.58, 0.05, 0.03, 0.06, 0.03], sal: 1, antiCats: [5] },
        AES: { kind: "categorical", probs: [0.6, 0.2, 0.04, 0.06, 0.04, 0.06], sal: 1, antiCats: [4] }
      }
    },
    {
      id: "060",
      name: "Hinge Citizen",
      tier: "T1",
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
        EPS: { kind: "categorical", probs: [0.14, 0.38, 0.33, 0.04, 0.07, 0.04], sal: 1 },
        AES: { kind: "categorical", probs: [0.6, 0.2, 0.04, 0.06, 0.04, 0.06], sal: 1 }
      }
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
        PF: { kind: "continuous", pos: 3, sal: 2 },
        TRB: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
        EPS: { kind: "categorical", probs: [0.08, 0.08, 0.08, 0.1, 0.6, 0.06], sal: 1, antiCats: [2, 5] },
        AES: { kind: "categorical", probs: [0.08, 0.64, 0.04, 0.04, 0.03, 0.17], sal: 1, antiCats: [4] }
      }
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
        PF: { kind: "continuous", pos: 3, sal: 1 },
        TRB: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
        EPS: { kind: "categorical", probs: [0.62, 0.24, 0.03, 0.04, 0.03, 0.04], sal: 1, antiCats: [2, 3, 5] },
        AES: { kind: "categorical", probs: [0.08, 0.64, 0.04, 0.04, 0.03, 0.17], sal: 1, antiCats: [4] }
      }
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
        PF: { kind: "continuous", pos: 3, sal: 1 },
        TRB: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
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
        EPS: { kind: "categorical", probs: [0.62, 0.24, 0.03, 0.04, 0.03, 0.04], sal: 1, antiCats: [2, 3, 5] },
        AES: { kind: "categorical", probs: [0.06, 0.18, 0.05, 0.06, 0.08, 0.57], sal: 1 }
      }
    },
    {
      id: "067",
      name: "Free-Exchange Modernist",
      tier: "T1",
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
        EPS: { kind: "categorical", probs: [0.62, 0.14, 0.03, 0.04, 0.15, 0.02], sal: 1, antiCats: [2, 3, 5] },
        AES: { kind: "categorical", probs: [0.06, 0.18, 0.05, 0.06, 0.08, 0.57], sal: 1 }
      }
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
        PF: { kind: "continuous", pos: 3, sal: 1 },
        TRB: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
        EPS: { kind: "categorical", probs: [0.62, 0.14, 0.03, 0.08, 0.11, 0.02], sal: 1, antiCats: [2, 3, 5] },
        AES: { kind: "categorical", probs: [0.05, 0.05, 0.08, 0.7, 0.05, 0.07], sal: 1 }
      }
    },
    {
      id: "070",
      name: "Burkean Steward",
      tier: "T1",
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
        EPS: { kind: "categorical", probs: [0.1, 0.58, 0.15, 0.05, 0.06, 0.06], sal: 2, antiCats: [5] },
        AES: { kind: "categorical", probs: [0.6, 0.1, 0.14, 0.06, 0.04, 0.06], sal: 2, antiCats: [4] }
      }
    },
    {
      id: "071",
      name: "Constitutional Conservative",
      tier: "T1",
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
        EPS: { kind: "categorical", probs: [0.1, 0.58, 0.15, 0.05, 0.06, 0.06], sal: 2 },
        AES: { kind: "categorical", probs: [0.6, 0.1, 0.14, 0.06, 0.04, 0.06], sal: 2 }
      }
    },
    {
      id: "072",
      name: "Blackstone Conservative",
      tier: "T1",
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
        EPS: { kind: "categorical", probs: [0.1, 0.58, 0.15, 0.05, 0.06, 0.06], sal: 2, antiCats: [5] },
        AES: { kind: "categorical", probs: [0.6, 0.1, 0.14, 0.06, 0.04, 0.06], sal: 1, antiCats: [4] }
      }
    },
    {
      id: "073",
      name: "Civic Traditionalist",
      tier: "T1",
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
        EPS: { kind: "categorical", probs: [0.1, 0.58, 0.15, 0.05, 0.06, 0.06], sal: 1, antiCats: [5] },
        AES: { kind: "categorical", probs: [0.6, 0.1, 0.14, 0.06, 0.04, 0.06], sal: 1, antiCats: [4] }
      }
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
        PF: { kind: "continuous", pos: 4, sal: 1, anti: "high" },
        TRB: { kind: "continuous", pos: 2, sal: 1, anti: "high" },
        EPS: { kind: "categorical", probs: [0.1, 0.58, 0.15, 0.05, 0.06, 0.06], sal: 1, antiCats: [5] },
        AES: { kind: "categorical", probs: [0.6, 0.1, 0.14, 0.06, 0.04, 0.06], sal: 1, antiCats: [4] }
      }
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
        PF: { kind: "continuous", pos: 4, sal: 1, anti: "high" },
        TRB: { kind: "continuous", pos: 2, sal: 1, anti: "high" },
        EPS: { kind: "categorical", probs: [0.1, 0.58, 0.15, 0.05, 0.06, 0.06], sal: 1, antiCats: [5] },
        AES: { kind: "categorical", probs: [0.6, 0.1, 0.14, 0.06, 0.04, 0.06], sal: 1, antiCats: [4] }
      }
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
        PF: { kind: "continuous", pos: 4, sal: 1 },
        TRB: { kind: "continuous", pos: 2, sal: 1 },
        EPS: { kind: "categorical", probs: [0.1, 0.58, 0.15, 0.05, 0.06, 0.06], sal: 1, antiCats: [5] },
        AES: { kind: "categorical", probs: [0.6, 0.1, 0.14, 0.06, 0.04, 0.06], sal: 1, antiCats: [4] }
      }
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
        PF: { kind: "continuous", pos: 4, sal: 1 },
        TRB: { kind: "continuous", pos: 2, sal: 1, anti: "high" },
        EPS: { kind: "categorical", probs: [0.1, 0.58, 0.15, 0.05, 0.06, 0.06], sal: 1, antiCats: [5] },
        AES: { kind: "categorical", probs: [0.6, 0.1, 0.14, 0.06, 0.04, 0.06], sal: 1, antiCats: [4] }
      }
    },
    {
      id: "079",
      name: "National Developmentalist",
      tier: "T1",
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
        EPS: { kind: "categorical", probs: [0.04, 0.18, 0.6, 0.06, 0.08, 0.04], sal: 2, antiCats: [0, 5] },
        AES: { kind: "categorical", probs: [0.16, 0.05, 0.62, 0.07, 0.03, 0.07], sal: 1 }
      }
    },
    {
      id: "082",
      name: "Altar-and-Hearth Conservative",
      tier: "T1",
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
        EPS: { kind: "categorical", probs: [0.04, 0.18, 0.6, 0.06, 0.08, 0.04], sal: 2, antiCats: [0, 5] },
        AES: { kind: "categorical", probs: [0.16, 0.05, 0.62, 0.07, 0.03, 0.07], sal: 1 }
      }
    },
    {
      id: "083",
      name: "Closed Traditionalist",
      tier: "T1",
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
        EPS: { kind: "categorical", probs: [0.04, 0.18, 0.6, 0.06, 0.08, 0.04], sal: 2, antiCats: [0, 5] },
        AES: { kind: "categorical", probs: [0.16, 0.05, 0.62, 0.07, 0.03, 0.07], sal: 1 }
      }
    },
    {
      id: "084",
      name: "Civilizational Conservative",
      tier: "T1",
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
        EPS: { kind: "categorical", probs: [0.04, 0.18, 0.6, 0.06, 0.08, 0.04], sal: 2, antiCats: [0, 5] },
        AES: { kind: "categorical", probs: [0.04, 0.03, 0.04, 0.18, 0.63, 0.08], sal: 1, antiCats: [0, 1] }
      }
    },
    {
      id: "085",
      name: "Customary Localist",
      tier: "T1",
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
        EPS: { kind: "categorical", probs: [0.04, 0.18, 0.6, 0.06, 0.08, 0.04], sal: 1, antiCats: [0, 5] },
        AES: { kind: "categorical", probs: [0.16, 0.05, 0.62, 0.07, 0.03, 0.07], sal: 2 }
      }
    },
    {
      id: "086",
      name: "Duty Traditionalist",
      tier: "T1",
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
        EPS: { kind: "categorical", probs: [0.04, 0.18, 0.6, 0.06, 0.08, 0.04], sal: 2, antiCats: [0, 5] },
        AES: { kind: "categorical", probs: [0.16, 0.05, 0.62, 0.07, 0.03, 0.07], sal: 1 }
      }
    },
    {
      id: "087",
      name: "Continuity Conservative",
      tier: "T1",
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
        EPS: { kind: "categorical", probs: [0.04, 0.18, 0.6, 0.06, 0.08, 0.04], sal: 1, antiCats: [0, 5] },
        AES: { kind: "categorical", probs: [0.16, 0.05, 0.62, 0.07, 0.03, 0.07], sal: 1 }
      }
    },
    {
      id: "088",
      name: "Gentle Traditionalist",
      tier: "T1",
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
        EPS: { kind: "categorical", probs: [0.04, 0.18, 0.6, 0.06, 0.08, 0.04], sal: 1, antiCats: [0, 5] },
        AES: { kind: "categorical", probs: [0.16, 0.05, 0.62, 0.07, 0.03, 0.07], sal: 2 }
      }
    },
    {
      id: "089",
      name: "Integral Traditionalist",
      tier: "T1",
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
        EPS: { kind: "categorical", probs: [0.04, 0.18, 0.6, 0.06, 0.08, 0.04], sal: 3, antiCats: [0, 5] },
        AES: { kind: "categorical", probs: [0.6, 0.1, 0.14, 0.06, 0.04, 0.06], sal: 1, antiCats: [4] }
      }
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
        ZS: { kind: "continuous", pos: 5, sal: 3 },
        // Hobbesian: life is zero-sum, strong differentiator
        ONT_H: { kind: "continuous", pos: 1, sal: 3, anti: "high" },
        // Hobbesian: humans are NOT perfectible
        ONT_S: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
        PF: { kind: "continuous", pos: 4, sal: 2 },
        TRB: { kind: "continuous", pos: 3, sal: 1 },
        EPS: { kind: "categorical", probs: [0.1, 0.58, 0.15, 0.05, 0.06, 0.06], sal: 1, antiCats: [5] },
        AES: { kind: "categorical", probs: [0.6, 0.1, 0.04, 0.06, 0.14, 0.06], sal: 1, antiCats: [4] }
      }
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
        PF: { kind: "continuous", pos: 4, sal: 1 },
        TRB: { kind: "continuous", pos: 3, sal: 1 },
        EPS: { kind: "categorical", probs: [0.1, 0.58, 0.15, 0.05, 0.06, 0.06], sal: 1, antiCats: [5] },
        AES: { kind: "categorical", probs: [0.6, 0.1, 0.04, 0.06, 0.14, 0.06], sal: 1, antiCats: [4] }
      }
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
        PF: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
        TRB: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
        EPS: { kind: "categorical", probs: [0.1, 0.58, 0.15, 0.05, 0.06, 0.06], sal: 1, antiCats: [5] },
        AES: { kind: "categorical", probs: [0.6, 0.1, 0.04, 0.06, 0.14, 0.06], sal: 1, antiCats: [4] }
      }
    },
    {
      id: "094",
      name: "Hard-State Manager",
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
        ONT_S: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
        PF: { kind: "continuous", pos: 4, sal: 1 },
        TRB: { kind: "continuous", pos: 3, sal: 1 },
        EPS: { kind: "categorical", probs: [0.1, 0.58, 0.15, 0.05, 0.06, 0.06], sal: 1, antiCats: [5] },
        AES: { kind: "categorical", probs: [0.08, 0.64, 0.04, 0.04, 0.03, 0.17], sal: 1, antiCats: [4] }
      }
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
        PF: { kind: "continuous", pos: 4, sal: 1 },
        TRB: { kind: "continuous", pos: 3, sal: 1 },
        EPS: { kind: "categorical", probs: [0.1, 0.58, 0.15, 0.05, 0.06, 0.06], sal: 1, antiCats: [5] },
        AES: { kind: "categorical", probs: [0.6, 0.1, 0.04, 0.06, 0.14, 0.06], sal: 1, antiCats: [4] }
      }
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
        PF: { kind: "continuous", pos: 4, sal: 1 },
        TRB: { kind: "continuous", pos: 3, sal: 1 },
        EPS: { kind: "categorical", probs: [0.1, 0.58, 0.15, 0.05, 0.06, 0.06], sal: 1 },
        AES: { kind: "categorical", probs: [0.6, 0.1, 0.04, 0.06, 0.14, 0.06], sal: 1 }
      }
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
        PF: { kind: "continuous", pos: 2, sal: 1 },
        TRB: { kind: "continuous", pos: 2, sal: 1 },
        EPS: { kind: "categorical", probs: [0.05, 0.05, 0.08, 0.58, 0.19, 0.05], sal: 1 },
        AES: { kind: "categorical", probs: [0.05, 0.05, 0.08, 0.6, 0.15, 0.07], sal: 2 }
      }
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
        PF: { kind: "continuous", pos: 3, sal: 2 },
        TRB: { kind: "continuous", pos: 3, sal: 2 },
        EPS: { kind: "categorical", probs: [0.05, 0.05, 0.08, 0.58, 0.19, 0.05], sal: 1, antiCats: [0, 5] },
        AES: { kind: "categorical", probs: [0.04, 0.03, 0.04, 0.18, 0.63, 0.08], sal: 1, antiCats: [0, 1] }
      }
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
        PF: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
        TRB: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
        EPS: { kind: "categorical", probs: [0.05, 0.05, 0.08, 0.58, 0.19, 0.05], sal: 1, antiCats: [0, 5] },
        AES: { kind: "categorical", probs: [0.04, 0.03, 0.04, 0.18, 0.63, 0.08], sal: 2, antiCats: [0, 1] }
      }
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
        PF: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
        TRB: { kind: "continuous", pos: 3, sal: 2 },
        EPS: { kind: "categorical", probs: [0.05, 0.05, 0.08, 0.58, 0.19, 0.05], sal: 1, antiCats: [0, 5] },
        AES: { kind: "categorical", probs: [0.05, 0.05, 0.08, 0.6, 0.15, 0.07], sal: 2 }
      }
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
        PF: { kind: "continuous", pos: 4, sal: 1 },
        TRB: { kind: "continuous", pos: 4, sal: 2 },
        EPS: { kind: "categorical", probs: [0.05, 0.05, 0.08, 0.58, 0.19, 0.05], sal: 1, antiCats: [0, 5] },
        AES: { kind: "categorical", probs: [0.05, 0.05, 0.08, 0.6, 0.15, 0.07], sal: 2 }
      }
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
        PF: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
        TRB: { kind: "continuous", pos: 4, sal: 2 },
        EPS: { kind: "categorical", probs: [0.05, 0.05, 0.08, 0.58, 0.19, 0.05], sal: 1, antiCats: [0, 5] },
        AES: { kind: "categorical", probs: [0.04, 0.03, 0.04, 0.18, 0.63, 0.08], sal: 1, antiCats: [0, 1] }
      }
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
        PF: { kind: "continuous", pos: 4, sal: 1 },
        TRB: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
        EPS: { kind: "categorical", probs: [0.05, 0.05, 0.08, 0.58, 0.19, 0.05], sal: 1, antiCats: [0, 5] },
        AES: { kind: "categorical", probs: [0.04, 0.03, 0.04, 0.18, 0.63, 0.08], sal: 3, antiCats: [0, 1] }
      }
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
        PF: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
        TRB: { kind: "continuous", pos: 4, sal: 1 },
        EPS: { kind: "categorical", probs: [0.05, 0.05, 0.08, 0.58, 0.19, 0.05], sal: 1, antiCats: [0, 5] },
        AES: { kind: "categorical", probs: [0.04, 0.03, 0.04, 0.18, 0.63, 0.08], sal: 3, antiCats: [0, 1] }
      }
    },
    {
      id: "107",
      name: "Resentful Localist",
      tier: "T1",
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
        EPS: { kind: "categorical", probs: [0.08, 0.08, 0.08, 0.1, 0.6, 0.06], sal: 2, antiCats: [2, 5] },
        AES: { kind: "categorical", probs: [0.05, 0.05, 0.18, 0.6, 0.05, 0.07], sal: 1 }
      }
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
        PF: { kind: "continuous", pos: 1, sal: 3, anti: "high" },
        TRB: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
        EPS: { kind: "categorical", probs: [0.08, 0.08, 0.08, 0.2, 0.5, 0.06], sal: 2, antiCats: [2, 5] },
        AES: { kind: "categorical", probs: [0.05, 0.05, 0.18, 0.6, 0.05, 0.07], sal: 1 }
      }
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
        PF: { kind: "continuous", pos: 3, sal: 0 },
        TRB: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
        EPS: { kind: "categorical", probs: [0.08, 0.08, 0.08, 0.1, 0.6, 0.06], sal: 2, antiCats: [2, 5] },
        AES: { kind: "categorical", probs: [0.05, 0.05, 0.08, 0.7, 0.05, 0.07], sal: 2 }
      }
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
        PF: { kind: "continuous", pos: 3, sal: 1 },
        TRB: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
        EPS: { kind: "categorical", probs: [0.08, 0.08, 0.08, 0.1, 0.6, 0.06], sal: 1, antiCats: [2, 5] },
        AES: { kind: "categorical", probs: [0.05, 0.05, 0.08, 0.7, 0.05, 0.07], sal: 2 }
      }
    },
    {
      id: "115",
      name: "Quietist",
      tier: "T1",
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
        EPS: { kind: "categorical", probs: [0.04, 0.08, 0.6, 0.16, 0.08, 0.04], sal: 1, antiCats: [0, 5] },
        AES: { kind: "categorical", probs: [0.06, 0.05, 0.72, 0.07, 0.03, 0.07], sal: 1 }
      }
    },
    {
      id: "116",
      name: "Quiet Middle",
      tier: "T1",
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
        EPS: { kind: "categorical", probs: [0.1, 0.58, 0.05, 0.03, 0.16, 0.08], sal: 1, antiCats: [5] },
        AES: { kind: "categorical", probs: [0.05, 0.05, 0.18, 0.6, 0.05, 0.07], sal: 1 }
      }
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
        PF: { kind: "continuous", pos: 3, sal: 1, anti: "low" },
        TRB: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
        EPS: { kind: "categorical", probs: [0.04, 0.18, 0.6, 0.06, 0.08, 0.04], sal: 1, antiCats: [0, 5] },
        AES: { kind: "categorical", probs: [0.05, 0.05, 0.18, 0.6, 0.05, 0.07], sal: 1 }
      }
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
        PF: { kind: "continuous", pos: 3, sal: 1 },
        TRB: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
        EPS: { kind: "categorical", probs: [0.1, 0.58, 0.05, 0.03, 0.16, 0.08], sal: 1, antiCats: [5] },
        AES: { kind: "categorical", probs: [0.05, 0.05, 0.18, 0.6, 0.05, 0.07], sal: 1 }
      }
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
        PF: { kind: "continuous", pos: 3, sal: 0 },
        TRB: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
        EPS: { kind: "categorical", probs: [0.1, 0.58, 0.05, 0.03, 0.16, 0.08], sal: 1, antiCats: [5] },
        AES: { kind: "categorical", probs: [0.05, 0.05, 0.18, 0.6, 0.05, 0.07], sal: 1 }
      }
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
        PF: { kind: "continuous", pos: 3, sal: 2 },
        TRB: { kind: "continuous", pos: 1, sal: 3, anti: "high" },
        EPS: { kind: "categorical", probs: [0.1, 0.58, 0.05, 0.03, 0.16, 0.08], sal: 1, antiCats: [5] },
        AES: { kind: "categorical", probs: [0.6, 0.1, 0.14, 0.06, 0.04, 0.06], sal: 2, antiCats: [4] }
      }
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
        PF: { kind: "continuous", pos: 3, sal: 1 },
        TRB: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
        EPS: { kind: "categorical", probs: [0.62, 0.24, 0.03, 0.04, 0.03, 0.04], sal: 1, antiCats: [2, 3, 5] },
        AES: { kind: "categorical", probs: [0.05, 0.05, 0.18, 0.6, 0.05, 0.07], sal: 1 }
      }
    },
    {
      id: "122",
      name: "Civic Minimalist",
      tier: "T1",
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
        EPS: { kind: "categorical", probs: [0.1, 0.58, 0.05, 0.03, 0.16, 0.08], sal: 1, antiCats: [5] },
        AES: { kind: "categorical", probs: [0.05, 0.05, 0.18, 0.6, 0.05, 0.07], sal: 1 }
      }
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
        PF: { kind: "continuous", pos: 4, sal: 1 },
        TRB: { kind: "continuous", pos: 2, sal: 2 },
        EPS: { kind: "categorical", probs: [0.1, 0.58, 0.05, 0.03, 0.16, 0.08], sal: 1 },
        AES: { kind: "categorical", probs: [0.05, 0.05, 0.18, 0.6, 0.05, 0.07], sal: 1 }
      }
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
        PF: { kind: "continuous", pos: 4, sal: 2, anti: "low" },
        TRB: { kind: "continuous", pos: 2, sal: 2, anti: "high" },
        EPS: { kind: "categorical", probs: [0.1, 0.58, 0.05, 0.03, 0.16, 0.08], sal: 1, antiCats: [5] },
        AES: { kind: "categorical", probs: [0.05, 0.05, 0.18, 0.6, 0.05, 0.07], sal: 1 }
      }
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
        PF: { kind: "continuous", pos: 3, sal: 0 },
        TRB: { kind: "continuous", pos: 3, sal: 0, anti: "low" },
        EPS: { kind: "categorical", probs: [0.1, 0.58, 0.05, 0.03, 0.16, 0.08], sal: 1, antiCats: [5] },
        AES: { kind: "categorical", probs: [0.05, 0.05, 0.18, 0.6, 0.05, 0.07], sal: 1 }
      }
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
        PF: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
        TRB: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
        EPS: { kind: "categorical", probs: [0.1, 0.58, 0.05, 0.03, 0.16, 0.08], sal: 1, antiCats: [5] },
        AES: { kind: "categorical", probs: [0.05, 0.05, 0.18, 0.6, 0.05, 0.07], sal: 1 }
      }
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
        PF: { kind: "continuous", pos: 4, sal: 2 },
        // Fixed: Loyal = high PF
        TRB: { kind: "continuous", pos: 4, sal: 2 },
        EPS: { kind: "categorical", probs: [0.1, 0.58, 0.05, 0.03, 0.16, 0.08], sal: 1, antiCats: [5] },
        AES: { kind: "categorical", probs: [0.05, 0.05, 0.18, 0.6, 0.05, 0.07], sal: 1 }
      }
    },
    {
      id: "129",
      name: "Loyal Republican",
      tier: "T1",
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
        EPS: { kind: "categorical", probs: [0.1, 0.58, 0.05, 0.03, 0.16, 0.08], sal: 1, antiCats: [5] },
        AES: { kind: "categorical", probs: [0.05, 0.05, 0.18, 0.6, 0.05, 0.07], sal: 1 }
      }
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
        PF: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
        TRB: { kind: "continuous", pos: 4, sal: 2 },
        EPS: { kind: "categorical", probs: [0.1, 0.58, 0.05, 0.03, 0.16, 0.08], sal: 1, antiCats: [5] },
        AES: { kind: "categorical", probs: [0.05, 0.05, 0.18, 0.6, 0.05, 0.07], sal: 1 }
      }
    },
    {
      id: "134",
      name: "Progressive Civic Nationalist",
      tier: "T1",
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
        EPS: { kind: "categorical", probs: [0.05, 0.05, 0.08, 0.58, 0.19, 0.05], sal: 1, antiCats: [0, 5] },
        AES: { kind: "categorical", probs: [0.06, 0.08, 0.05, 0.06, 0.08, 0.67], sal: 1 }
      }
    },
    // ===== NEW ARCHETYPES (added 2026-03-28 from ChatGPT semantic coverage audit) =====
    {
      id: "135",
      name: "Disruptive Cosmopolitan",
      tier: "T1",
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
        EPS: { kind: "categorical", probs: [0.6, 0.05, 0.15, 0.05, 0.1, 0.05], sal: 1 },
        AES: { kind: "categorical", probs: [0.05, 0.1, 0.05, 0.05, 0.15, 0.6], sal: 1 }
        // FIX: Disruptive = visionary, not statesman
      }
    },
    {
      id: "136",
      name: "Aspirational Traditionalist",
      tier: "T1",
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
        EPS: { kind: "categorical", probs: [0.1, 0.15, 0.5, 0.1, 0.05, 0.1], sal: 1 },
        AES: { kind: "categorical", probs: [0.1, 0.1, 0.5, 0.15, 0.05, 0.1], sal: 1 }
      }
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
        PF: { kind: "continuous", pos: 4, sal: 2 },
        TRB: { kind: "continuous", pos: 4, sal: 2 },
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
        EPS: { kind: "categorical", probs: [0.1, 0.5, 0.15, 0.1, 0.1, 0.05], sal: 1 },
        AES: { kind: "categorical", probs: [0.1, 0.5, 0.15, 0.1, 0.1, 0.05], sal: 1 }
      }
    },
    {
      id: "140",
      name: "Market Green Modernist",
      tier: "T1",
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
        EPS: { kind: "categorical", probs: [0.7, 0.05, 0.1, 0.05, 0.05, 0.05], sal: 1 },
        // Empiricist
        AES: { kind: "categorical", probs: [0.1, 0.6, 0.1, 0.05, 0.1, 0.05], sal: 1 }
        // Systematic
      }
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
      id: "141",
      name: "Black Voter",
      tier: "T2",
      nodes: {
        // Strong group-linked Democratic alignment. Redistributionist on economics,
        // moderate-progressive on culture, high community solidarity.
        MAT: { kind: "continuous", pos: 2, sal: 2 },
        CD: { kind: "continuous", pos: 2, sal: 1 },
        CU: { kind: "continuous", pos: 4, sal: 1 },
        MOR: { kind: "continuous", pos: 4, sal: 2 },
        PRO: { kind: "continuous", pos: 3, sal: 1 },
        COM: { kind: "continuous", pos: 3, sal: 1 },
        ZS: { kind: "continuous", pos: 3, sal: 2 },
        ONT_H: { kind: "continuous", pos: 3, sal: 1 },
        ONT_S: { kind: "continuous", pos: 3, sal: 2 },
        PF: { kind: "continuous", pos: 5, sal: 3 },
        TRB: { kind: "continuous", pos: 5, sal: 3 },
        EPS: { kind: "categorical", probs: [0.15, 0.3, 0.15, 0.25, 0.1, 0.05], sal: 1 },
        AES: { kind: "categorical", probs: [0.1, 0.05, 0.2, 0.4, 0.15, 0.1], sal: 1 }
        // Authentic
      }
    },
    {
      id: "142",
      name: "White Grievance Voter",
      tier: "T2",
      nodes: {
        // Ethno-cultural displacement threat. Cultural uniformity and narrow moral
        // circle are the anchors — not zero-sum competition per se. Sees society
        // losing its cultural identity, not losing a competitive game.
        MAT: { kind: "continuous", pos: 3, sal: 1 },
        CD: { kind: "continuous", pos: 5, sal: 3 },
        CU: { kind: "continuous", pos: 5, sal: 3, anti: "low" },
        MOR: { kind: "continuous", pos: 1, sal: 3, anti: "high" },
        PRO: { kind: "continuous", pos: 2, sal: 1 },
        COM: { kind: "continuous", pos: 2, sal: 2 },
        ZS: { kind: "continuous", pos: 4, sal: 2 },
        ONT_H: { kind: "continuous", pos: 3, sal: 1 },
        ONT_S: { kind: "continuous", pos: 1, sal: 3, anti: "high" },
        PF: { kind: "continuous", pos: 5, sal: 3 },
        TRB: { kind: "continuous", pos: 5, sal: 3 },
        EPS: { kind: "categorical", probs: [0.05, 0.1, 0.25, 0.4, 0.1, 0.1], sal: 1 },
        // Intuitionist
        AES: { kind: "categorical", probs: [0.05, 0.05, 0.1, 0.3, 0.4, 0.1], sal: 2 }
        // Fighter
      }
    },
    {
      id: "143",
      name: "Evangelical Voter",
      tier: "T2",
      nodes: {
        // Religion-centered identity. Traditional morality is the defining axis.
        // Moderate economics, strong cultural conservatism, community-anchored.
        MAT: { kind: "continuous", pos: 3, sal: 1 },
        CD: { kind: "continuous", pos: 5, sal: 3 },
        CU: { kind: "continuous", pos: 4, sal: 2 },
        MOR: { kind: "continuous", pos: 1, sal: 3, anti: "high" },
        PRO: { kind: "continuous", pos: 3, sal: 1 },
        COM: { kind: "continuous", pos: 3, sal: 1 },
        ZS: { kind: "continuous", pos: 3, sal: 1 },
        ONT_H: { kind: "continuous", pos: 3, sal: 1 },
        ONT_S: { kind: "continuous", pos: 2, sal: 1 },
        PF: { kind: "continuous", pos: 5, sal: 3 },
        TRB: { kind: "continuous", pos: 5, sal: 3 },
        EPS: { kind: "categorical", probs: [0.05, 0.15, 0.5, 0.2, 0.05, 0.05], sal: 2 },
        // Traditionalist
        AES: { kind: "categorical", probs: [0.1, 0.05, 0.5, 0.15, 0.1, 0.1], sal: 2 }
        // Pastoral
      }
    },
    {
      id: "144",
      name: "LGBTQ Voter",
      tier: "T2",
      nodes: {
        // Sexual-identity-centered. Strongly progressive on culture, expansive moral
        // circle, community-driven politics. Strong Democratic alignment.
        MAT: { kind: "continuous", pos: 2, sal: 1 },
        CD: { kind: "continuous", pos: 1, sal: 3, anti: "high" },
        CU: { kind: "continuous", pos: 5, sal: 2 },
        MOR: { kind: "continuous", pos: 5, sal: 3, anti: "low" },
        PRO: { kind: "continuous", pos: 3, sal: 1 },
        COM: { kind: "continuous", pos: 3, sal: 1 },
        ZS: { kind: "continuous", pos: 3, sal: 2 },
        ONT_H: { kind: "continuous", pos: 4, sal: 1 },
        ONT_S: { kind: "continuous", pos: 4, sal: 2 },
        PF: { kind: "continuous", pos: 5, sal: 3 },
        TRB: { kind: "continuous", pos: 5, sal: 3 },
        EPS: { kind: "categorical", probs: [0.2, 0.15, 0.05, 0.15, 0.35, 0.1], sal: 1 },
        // Autonomous
        AES: { kind: "categorical", probs: [0.05, 0.05, 0.1, 0.45, 0.15, 0.2], sal: 1 }
        // Authentic
      }
    },
    {
      id: "145",
      name: "Feminist Voter",
      tier: "T2",
      nodes: {
        // Gender-equity-centered. Progressive on culture, systemic structural
        // orientation, expansive moral circle. Strong Democratic alignment.
        MAT: { kind: "continuous", pos: 2, sal: 1 },
        CD: { kind: "continuous", pos: 1, sal: 3, anti: "high" },
        CU: { kind: "continuous", pos: 4, sal: 1 },
        MOR: { kind: "continuous", pos: 5, sal: 3, anti: "low" },
        PRO: { kind: "continuous", pos: 4, sal: 2 },
        COM: { kind: "continuous", pos: 3, sal: 1 },
        ZS: { kind: "continuous", pos: 3, sal: 2 },
        ONT_H: { kind: "continuous", pos: 4, sal: 2 },
        ONT_S: { kind: "continuous", pos: 5, sal: 3 },
        PF: { kind: "continuous", pos: 5, sal: 3 },
        TRB: { kind: "continuous", pos: 5, sal: 3 },
        EPS: { kind: "categorical", probs: [0.3, 0.2, 0.05, 0.1, 0.25, 0.1], sal: 1 },
        // Empiricist
        AES: { kind: "categorical", probs: [0.1, 0.05, 0.1, 0.25, 0.3, 0.2], sal: 1 }
        // Fighter/Visionary
      }
    },
    {
      id: "146",
      name: "Male Grievance Voter",
      tier: "T2",
      nodes: {
        // Gender-anchored backlash. Hierarchy-driven, anti-procedural, zero-sum.
        // Less about cultural uniformity than White Grievance — more about
        // natural-order hierarchy and seeing institutions as rigged against men.
        MAT: { kind: "continuous", pos: 3, sal: 1 },
        CD: { kind: "continuous", pos: 5, sal: 3 },
        CU: { kind: "continuous", pos: 3, sal: 1 },
        MOR: { kind: "continuous", pos: 2, sal: 2 },
        PRO: { kind: "continuous", pos: 1, sal: 2 },
        COM: { kind: "continuous", pos: 1, sal: 2 },
        ZS: { kind: "continuous", pos: 5, sal: 3, anti: "low" },
        ONT_H: { kind: "continuous", pos: 1, sal: 3 },
        ONT_S: { kind: "continuous", pos: 1, sal: 3, anti: "high" },
        PF: { kind: "continuous", pos: 5, sal: 3 },
        TRB: { kind: "continuous", pos: 5, sal: 3 },
        EPS: { kind: "categorical", probs: [0.05, 0.05, 0.1, 0.25, 0.25, 0.3], sal: 1 },
        // Nihilist/Autonomous
        AES: { kind: "categorical", probs: [0.05, 0.05, 0.05, 0.2, 0.5, 0.15], sal: 2 }
        // Fighter
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
        { node: "ENG", kind: "continuous", role: "salience", weight: 0.6, touchType: "behavior_frequency" }
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
        { node: "AES", kind: "categorical", role: "category", weight: 0.45, touchType: "style_proxy" }
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
        { node: "COM", kind: "continuous", role: "position", weight: 0.35, touchType: "civic_balance" }
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
        { node: "AES", kind: "categorical", role: "category", weight: 0.92, touchType: "leader_style" }
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
        { node: "TRB_ANCHOR", kind: "derived", role: "anchor", weight: 0.95, touchType: "identity_ranking" }
      ],
      rankingMap: {
        national_identity: { trbAnchor: { national: 1 } },
        ideological_identity: { trbAnchor: { ideological: 1 } },
        religious_identity: { trbAnchor: { religious: 1 } },
        class_identity: { trbAnchor: { class: 1 } },
        ethnic_racial_identity: { trbAnchor: { ethnic_racial: 1 } },
        gender_identity: { trbAnchor: { gender: 1 } },
        sexual_identity: { trbAnchor: { sexual: 1 } },
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
        { node: "CD", kind: "continuous", role: "position", weight: 0.9, touchType: "direct_placement" }
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
        { node: "MOR", kind: "continuous", role: "position", weight: 0.9, touchType: "moral_scope_tradeoff" }
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
        { node: "EPS", kind: "categorical", role: "category", weight: 0.35, touchType: "factual_calibration" }
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
        { node: "MAT", kind: "continuous", role: "position", weight: 0.92, touchType: "policy_preference" }
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
        { node: "TRB", kind: "continuous", role: "position", weight: 0.8, touchType: "outgroup_trust_estimate" }
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
        { node: "PF", kind: "continuous", role: "position", weight: 0.18, touchType: "identity_rigidity_proxy" }
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
        "0-20": { continuous: { CU: { sal: [0.55, 0.3, 0.12, 0.03] }, CD: { sal: [0.5, 0.3, 0.15, 0.05] }, TRB: { sal: [0.5, 0.3, 0.15, 0.05] } }, trbAnchor: { global: 0.45, mixed_none: 0.3, ideological: 0.15 } },
        "21-40": { continuous: { CU: { sal: [0.25, 0.4, 0.25, 0.1] }, CD: { sal: [0.28, 0.38, 0.24, 0.1] }, TRB: { sal: [0.28, 0.38, 0.24, 0.1] } }, trbAnchor: { mixed_none: 0.3, global: 0.2, ideological: 0.2, national: 0.1 } },
        "41-60": { continuous: { CU: { sal: [0.08, 0.28, 0.4, 0.24] }, CD: { sal: [0.12, 0.28, 0.38, 0.22] }, TRB: { sal: [0.12, 0.28, 0.38, 0.22] } }, trbAnchor: { national: 0.3, ideological: 0.2, mixed_none: 0.2 } },
        "61-80": { continuous: { CU: { sal: [0.03, 0.12, 0.4, 0.45] }, CD: { sal: [0.05, 0.18, 0.4, 0.37] }, TRB: { sal: [0.05, 0.18, 0.4, 0.37] } }, trbAnchor: { national: 0.55, ideological: 0.1, religious: 0.1, ethnic_racial: 0.1 } },
        "81-100": { continuous: { CU: { sal: [0.02, 0.08, 0.3, 0.6] }, CD: { sal: [0.03, 0.12, 0.35, 0.5] }, TRB: { sal: [0.03, 0.12, 0.35, 0.5] } }, trbAnchor: { national: 0.65, ethnic_racial: 0.2, religious: 0.1 } }
      }
    },
    // =========================================================================
    // SINGLE_CHOICE EVIDENCE MAPS (batch 1: Q6, Q7, Q9, Q10, Q14, Q16, Q17)
    // =========================================================================
    // Q6 — national_priorities_bundle (proper 5-node conjoint, replacing old
    // 2-touch surveillance bundle). 4 cross-cutting policy packages probe
    // MAT/CD/MOR/ONT_H/ZS position plus MAT salience in a single high-breadth
    // question the EIG selector prioritizes when multiple nodes are unconverged.
    {
      id: 6,
      stage: "stage2",
      section: "I",
      promptShort: "national_priorities_bundle",
      uiType: "single_choice",
      quality: 0.9,
      rewriteNeeded: false,
      touchProfile: [
        { node: "MAT", kind: "continuous", role: "position", weight: 0.65, touchType: "policy_bundle" },
        { node: "CD", kind: "continuous", role: "position", weight: 0.6, touchType: "policy_bundle" },
        { node: "MOR", kind: "continuous", role: "position", weight: 0.6, touchType: "policy_bundle" },
        { node: "ONT_H", kind: "continuous", role: "position", weight: 0.55, touchType: "policy_bundle" },
        { node: "ZS", kind: "continuous", role: "position", weight: 0.4, touchType: "policy_bundle" },
        { node: "MAT", kind: "continuous", role: "salience", weight: 0.3, touchType: "policy_bundle_salience" }
      ],
      optionEvidence: {
        // A: Traditional Order — secure borders, civics in schools, strong families, back the police
        priorities_traditional: {
          continuous: {
            MAT: { pos: [0.04, 0.1, 0.22, 0.34, 0.3] },
            CD: { pos: [0.02, 0.05, 0.14, 0.32, 0.47] },
            MOR: { pos: [0.48, 0.3, 0.14, 0.06, 0.02] },
            ONT_H: { pos: [0.38, 0.3, 0.18, 0.1, 0.04] },
            ZS: { pos: [0.08, 0.18, 0.28, 0.28, 0.18] }
          }
        },
        // B: Economic Fairness — universal services, tax wealth, raise wages, break up monopolies
        priorities_fairness: {
          continuous: {
            MAT: { pos: [0.48, 0.3, 0.14, 0.06, 0.02], sal: [0.05, 0.15, 0.45, 0.35] },
            CD: { pos: [0.3, 0.32, 0.22, 0.12, 0.04] },
            MOR: { pos: [0.1, 0.2, 0.32, 0.24, 0.14] },
            ONT_H: { pos: [0.05, 0.1, 0.22, 0.35, 0.28] },
            ZS: { pos: [0.1, 0.2, 0.32, 0.24, 0.14] }
          }
        },
        // C: National Strength — cut regulation, invest in defense, protect industries, selective immigration
        priorities_strength: {
          continuous: {
            MAT: { pos: [0.05, 0.1, 0.2, 0.35, 0.3] },
            CD: { pos: [0.05, 0.12, 0.22, 0.35, 0.26] },
            MOR: { pos: [0.42, 0.3, 0.16, 0.08, 0.04] },
            ONT_H: { pos: [0.3, 0.32, 0.22, 0.12, 0.04] },
            ZS: { pos: [0.04, 0.1, 0.22, 0.34, 0.3] }
          }
        },
        // D: Planet & Future — climate action, global cooperation, scientific research, generational investment
        priorities_future: {
          continuous: {
            MAT: { pos: [0.2, 0.28, 0.28, 0.16, 0.08] },
            CD: { pos: [0.38, 0.3, 0.18, 0.1, 0.04] },
            MOR: { pos: [0.04, 0.1, 0.2, 0.32, 0.34] },
            ONT_H: { pos: [0.1, 0.2, 0.28, 0.26, 0.16] },
            ZS: { pos: [0.3, 0.32, 0.22, 0.12, 0.04] }
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
        { node: "COM", kind: "continuous", role: "position", weight: 0.85, touchType: "principle_tradeoff" }
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
        { node: "COM", kind: "continuous", role: "position", weight: 0.45, touchType: "social_behavior" }
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
        { node: "ONT_S", kind: "continuous", role: "position", weight: 0.2, touchType: "policy_bundle" }
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
        { node: "MOR", kind: "continuous", role: "position", weight: 0.2, touchType: "fairness_design" }
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
        { node: "ONT_H", kind: "continuous", role: "position", weight: 0.2, touchType: "policy_bundle" }
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
        { node: "MAT", kind: "continuous", role: "position", weight: 0.9, touchType: "fairness_threshold" }
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
        { node: "ONT_H", kind: "continuous", role: "position", weight: 0.9, touchType: "ontology_direct" }
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
    // Ratio slider: 1.5:1 → 100+:1 drives salience via applyStoredRatioBoost
    // (reads _ratioBoosts map set by applyRatioBoost). The salience role on PRO
    // is what that function iterates over to apply the ratio-derived
    // SalienceDist likelihood.
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
        { node: "PRO", kind: "continuous", role: "salience", weight: 0.7, touchType: "error_asymmetry_ratio" },
        { node: "MOR", kind: "continuous", role: "position", weight: 0.12, touchType: "human_motive_proxy" }
      ],
      strengthFollowUp: {
        kind: "ratio",
        prompt: "How many guilty people would you let go free to avoid convicting one innocent person?",
        labels: { lowEnd: "1.5 to 1", highEnd: "100+ to 1" }
      },
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
        { node: "MAT", kind: "continuous", role: "salience", weight: 0.65, touchType: "error_asymmetry_ratio" },
        { node: "PRO", kind: "continuous", role: "position", weight: 0.22, touchType: "error_asymmetry" },
        { node: "MOR", kind: "continuous", role: "position", weight: 0.24, touchType: "deservingness_proxy" }
      ],
      strengthFollowUp: {
        kind: "ratio",
        prompt: "How many undeserving recipients would you accept to make sure one genuinely needy person gets help?",
        labels: { lowEnd: "1.5 to 1", highEnd: "100+ to 1" }
      },
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
        { node: "CU", kind: "continuous", role: "position", weight: 0.25, touchType: "collective_uniformity" }
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
        { node: "PRO", kind: "continuous", role: "salience", weight: 0.65, touchType: "speech_harm_ratio" },
        { node: "EPS", kind: "categorical", role: "category", weight: 0.2, touchType: "truth_authority_proxy" },
        { node: "COM", kind: "continuous", role: "position", weight: 0.12, touchType: "pluralism_proxy" }
      ],
      strengthFollowUp: {
        kind: "ratio",
        prompt: "How many legitimate speakers would you silence to stop one harmful one?",
        labels: { lowEnd: "1.5 to 1", highEnd: "100+ to 1" }
      },
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
        { node: "ONT_S", kind: "continuous", role: "position", weight: 0.45, touchType: "systems_view" }
      ],
      optionEvidence: {
        net_positive_clear: {
          continuous: {
            ZS: { pos: [0.41, 0.38, 0.15, 0.05, 0.01], sal: [0.45, 0.3, 0.18, 0.07] },
            ONT_S: { pos: [0.24, 0.38, 0.25, 0.1, 0.03] }
          }
        },
        net_positive_but_uneven: {
          continuous: {
            ZS: { pos: [0.15, 0.3, 0.35, 0.15, 0.05], sal: [0.15, 0.35, 0.35, 0.15] },
            ONT_S: { pos: [0.12, 0.28, 0.4, 0.15, 0.05] }
          }
        },
        mixed_effects: {
          continuous: {
            ZS: { pos: [0.07, 0.18, 0.35, 0.25, 0.15], sal: [0.1, 0.28, 0.4, 0.22] },
            ONT_S: { pos: [0.08, 0.2, 0.4, 0.22, 0.1] }
          }
        },
        mostly_harmful: {
          continuous: {
            ZS: { pos: [0.03, 0.07, 0.18, 0.3, 0.42], sal: [0.05, 0.15, 0.35, 0.45] },
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
        { node: "PRO", kind: "continuous", role: "salience", weight: 0.55, touchType: "boundary_error_asymmetry_ratio" },
        { node: "CU", kind: "continuous", role: "position", weight: 0.22, touchType: "boundary_error_asymmetry" },
        { node: "ONT_S", kind: "continuous", role: "position", weight: 0.12, touchType: "boundary_error_asymmetry" }
      ],
      strengthFollowUp: {
        kind: "ratio",
        prompt: "How many undocumented immigrants would you let stay to avoid wrongly deporting one legal resident?",
        labels: { lowEnd: "1.5 to 1", highEnd: "100+ to 1" }
      },
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
        { node: "TRB", kind: "continuous", role: "position", weight: 0.2, touchType: "threat_bundle" }
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
        { node: "EPS", kind: "categorical", role: "category", weight: 0.2, touchType: "expertise_risk_proxy" }
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
        { node: "COM", kind: "continuous", role: "position", weight: 0.25, touchType: "rule_response" }
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
        { node: "TRB", kind: "continuous", role: "position", weight: 0.9, touchType: "network_homophily" }
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
        { node: "MAT", kind: "continuous", role: "position", weight: 0.7, touchType: "distributive_choice" }
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
        { node: "COM", kind: "continuous", role: "position", weight: 0.7, touchType: "interpersonal_conflict" }
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
        { node: "ONT_H", kind: "continuous", role: "position", weight: 0.85, touchType: "progress_worldview" }
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
        { node: "TRB", kind: "continuous", role: "position", weight: 0.2, touchType: "membership_boundary" },
        { node: "TRB_ANCHOR", kind: "derived", role: "anchor", weight: 0.25, touchType: "nationality_anchor" }
      ],
      optionEvidence: {
        civic_participation: {
          continuous: {
            CU: { pos: [0.04, 0.1, 0.28, 0.35, 0.23] }
          },
          trbAnchor: { ideological: 0.3, mixed_none: 0.25, global: 0.2, national: 0.15 }
        },
        shared_values: {
          continuous: {
            CU: { pos: [0.15, 0.25, 0.35, 0.18, 0.07] },
            TRB: { pos: [0.08, 0.15, 0.28, 0.3, 0.19] }
          },
          trbAnchor: { ideological: 0.35, religious: 0.2, national: 0.2, mixed_none: 0.1 }
        },
        cultural_heritage: {
          continuous: {
            CU: { pos: [0.3, 0.3, 0.25, 0.1, 0.05] },
            TRB: { pos: [0.05, 0.12, 0.25, 0.33, 0.25] }
          },
          trbAnchor: { national: 0.5, ethnic_racial: 0.2, religious: 0.15 }
        },
        born_here: {
          continuous: {
            CU: { pos: [0.45, 0.28, 0.17, 0.07, 0.03] },
            TRB: { pos: [0.04, 0.1, 0.22, 0.34, 0.3] }
          },
          trbAnchor: { ethnic_racial: 0.45, national: 0.4, religious: 0.05 }
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
        { node: "CD", kind: "continuous", role: "position", weight: 0.1, touchType: "background_context" }
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
        { node: "AES", kind: "categorical", role: "category", weight: 0.45, touchType: "leader_evaluation" },
        { node: "EPS", kind: "categorical", role: "category", weight: 0.2, touchType: "leader_evaluation" }
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
        { node: "EPS", kind: "categorical", role: "category", weight: 0.3, touchType: "rhetorical_preference" }
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
        { node: "AES", kind: "categorical", role: "category", weight: 0.88, touchType: "movement_style" }
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
        { node: "EPS", kind: "categorical", role: "category", weight: 0.95, touchType: "updating_channel" }
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
        { node: "EPS", kind: "categorical", role: "salience", weight: 0.45, touchType: "factual_calibration" }
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
        { node: "CD", kind: "continuous", role: "position", weight: 0.25, touchType: "membership_expectation" }
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
        { node: "TRB", kind: "continuous", role: "salience", weight: 0.3, touchType: "best_worst_asymmetric" },
        { node: "MAT", kind: "continuous", role: "salience", weight: 0.18, touchType: "best_worst_asymmetric" },
        { node: "CU", kind: "continuous", role: "salience", weight: 0.18, touchType: "best_worst_asymmetric" },
        { node: "COM", kind: "continuous", role: "salience", weight: 0.18, touchType: "best_worst_asymmetric" },
        { node: "TRB_ANCHOR", kind: "derived", role: "anchor", weight: 0.18, touchType: "best_worst_asymmetric" }
      ],
      rankingMap: {
        fairness: {
          continuous: { MAT: -0.5, MOR: 0.5, PRO: 0.25 },
          trbAnchor: { ideological: 0.4, class: 0.25, mixed_none: 0.15 }
        },
        procedural_integrity: {
          continuous: { PRO: 0.65, COM: 0.25 },
          trbAnchor: { ideological: 0.45, national: 0.2, mixed_none: 0.15 }
        },
        national_strength: {
          continuous: { CU: -0.45, TRB: 0.45, ZS: -0.25 },
          trbAnchor: { national: 0.6, ethnic_racial: 0.2 }
        },
        community_bonds: {
          continuous: { COM: 0.45, TRB: -0.25, MOR: 0.35 },
          trbAnchor: { religious: 0.35, national: 0.25, ethnic_racial: 0.15, mixed_none: 0.1 }
        },
        individual_freedom: {
          continuous: { PRO: 0.55, MAT: 0.25 },
          trbAnchor: { ideological: 0.45, mixed_none: 0.25, class: 0.1 }
        },
        tradition_continuity: {
          continuous: { CD: -0.45, CU: -0.35 },
          trbAnchor: { religious: 0.4, national: 0.3, ethnic_racial: 0.1 }
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
        { node: "COM", kind: "continuous", role: "salience", weight: 0.9, touchType: "direct_salience" }
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
        { node: "AES", kind: "categorical", role: "salience", weight: 0.9, touchType: "direct_salience" }
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
            ZS: { pos: [0.55, 0.25, 0.12, 0.05, 0.03], sal: [0.55, 0.3, 0.12, 0.03] },
            ONT_H: { pos: [0.03, 0.05, 0.12, 0.28, 0.52] },
            COM: { pos: [0.05, 0.1, 0.22, 0.35, 0.28] },
            PRO: { pos: [0.05, 0.1, 0.25, 0.35, 0.25] }
          }
        },
        // 2 = disagree
        "21-40": {
          continuous: {
            ZS: { pos: [0.3, 0.35, 0.22, 0.08, 0.05], sal: [0.3, 0.4, 0.22, 0.08] },
            ONT_H: { pos: [0.05, 0.1, 0.22, 0.38, 0.25] },
            COM: { pos: [0.08, 0.15, 0.3, 0.3, 0.17] },
            PRO: { pos: [0.08, 0.12, 0.3, 0.3, 0.2] }
          }
        },
        // 3 = mixed
        "41-60": {
          continuous: {
            ZS: { pos: [0.1, 0.2, 0.4, 0.2, 0.1], sal: [0.12, 0.28, 0.38, 0.22] },
            ONT_H: { pos: [0.1, 0.2, 0.4, 0.2, 0.1] },
            COM: { pos: [0.12, 0.22, 0.32, 0.22, 0.12] },
            PRO: { pos: [0.12, 0.22, 0.32, 0.22, 0.12] }
          }
        },
        // 4 = agree
        "61-80": {
          continuous: {
            ZS: { pos: [0.05, 0.08, 0.22, 0.35, 0.3], sal: [0.04, 0.15, 0.4, 0.41] },
            ONT_H: { pos: [0.25, 0.38, 0.22, 0.1, 0.05] },
            COM: { pos: [0.17, 0.3, 0.3, 0.15, 0.08] },
            PRO: { pos: [0.2, 0.3, 0.3, 0.12, 0.08] }
          }
        },
        // 5 = strongly agree (institutions always corrupt, domination inevitable)
        "81-100": {
          continuous: {
            ZS: { pos: [0.03, 0.05, 0.12, 0.25, 0.55], sal: [0.02, 0.08, 0.3, 0.6] },
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
    },
    // Q93-Q96 — Pole-priority batteries (salience + position in one pick),
    // split strictly by PRISM cluster. Each item is a pole-specific priority:
    // picking "Redistribution and a strong safety net" as top priority signals
    // BOTH (a) MAT matters + (b) MAT lean is redistributionist.
    // applyBestWorstSalience reads `continuous[NODE].pos` for the position
    // signal; the node key alone drives the salience bucketing.
    //
    // LOW_POLE  = [0.45, 0.30, 0.15, 0.07, 0.03]  → peaks at position 1
    // HIGH_POLE = [0.03, 0.07, 0.15, 0.30, 0.45]  → peaks at position 5
    //
    // Note: ENG dropped from SELF battery (low pole "stay out of politics" is
    // paradoxical as a stated priority; ENG is inferred from participation
    // signals in other questions and engagementLabel).
    // Q93: ENDS+MEANS priority sort. Replaces the Q93+Q94 pair of best_worst
    // batteries (2026-04-21). The user places all 12 pole items (both poles of
    // MAT/CD/CU/MOR/PRO/COM) into one of three priority buckets: "high" (super
    // important), "mid" (care but not central), "low" (not central). Handled by
    // applyPrioritySort — per-node salience aggregation (strongest bucket wins)
    // plus per-item position mixing scaled by bucket (high=0.40, mid=0.20,
    // low=skip). Richer than best_worst: every item contributes evidence, not
    // just the two extremes.
    {
      id: 93,
      stage: "fixed12",
      section: "I",
      promptShort: "priority_sort_opener",
      uiType: "priority_sort",
      priorityBattery: true,
      quality: 0.96,
      rewriteNeeded: false,
      touchProfile: [
        { node: "MAT", kind: "continuous", role: "salience", weight: 0.85, touchType: "priority_sort_pole_battery" },
        { node: "MAT", kind: "continuous", role: "position", weight: 0.55, touchType: "priority_sort_pole_battery" },
        { node: "CD", kind: "continuous", role: "salience", weight: 0.85, touchType: "priority_sort_pole_battery" },
        { node: "CD", kind: "continuous", role: "position", weight: 0.55, touchType: "priority_sort_pole_battery" },
        { node: "CU", kind: "continuous", role: "salience", weight: 0.85, touchType: "priority_sort_pole_battery" },
        { node: "CU", kind: "continuous", role: "position", weight: 0.55, touchType: "priority_sort_pole_battery" },
        { node: "MOR", kind: "continuous", role: "salience", weight: 0.85, touchType: "priority_sort_pole_battery" },
        { node: "MOR", kind: "continuous", role: "position", weight: 0.55, touchType: "priority_sort_pole_battery" },
        { node: "PRO", kind: "continuous", role: "salience", weight: 0.85, touchType: "priority_sort_pole_battery" },
        { node: "PRO", kind: "continuous", role: "position", weight: 0.55, touchType: "priority_sort_pole_battery" },
        { node: "COM", kind: "continuous", role: "salience", weight: 0.85, touchType: "priority_sort_pole_battery" },
        { node: "COM", kind: "continuous", role: "position", weight: 0.55, touchType: "priority_sort_pole_battery" }
      ],
      rankingMap: {
        mat_low: { continuous: { MAT: { pos: [0.45, 0.3, 0.15, 0.07, 0.03] } } },
        mat_high: { continuous: { MAT: { pos: [0.03, 0.07, 0.15, 0.3, 0.45] } } },
        cd_low: { continuous: { CD: { pos: [0.45, 0.3, 0.15, 0.07, 0.03] } } },
        cd_high: { continuous: { CD: { pos: [0.03, 0.07, 0.15, 0.3, 0.45] } } },
        cu_low: { continuous: { CU: { pos: [0.45, 0.3, 0.15, 0.07, 0.03] } } },
        cu_high: { continuous: { CU: { pos: [0.03, 0.07, 0.15, 0.3, 0.45] } } },
        mor_low: { continuous: { MOR: { pos: [0.45, 0.3, 0.15, 0.07, 0.03] } } },
        mor_high: { continuous: { MOR: { pos: [0.03, 0.07, 0.15, 0.3, 0.45] } } },
        pro_low: { continuous: { PRO: { pos: [0.45, 0.3, 0.15, 0.07, 0.03] } } },
        pro_high: { continuous: { PRO: { pos: [0.03, 0.07, 0.15, 0.3, 0.45] } } },
        com_low: { continuous: { COM: { pos: [0.45, 0.3, 0.15, 0.07, 0.03] } } },
        com_high: { continuous: { COM: { pos: [0.03, 0.07, 0.15, 0.3, 0.45] } } }
      }
    },
    // Q97 + Q98 replaced the old Q95/Q96 REALITY+SELF pole batteries (2026-04-21).
    // Q95/Q96 read "too much like slogans" per user feedback; ZS / ONT_H / ONT_S
    // coverage now leans on the adaptive selector and existing bank questions
    // (zero_sum_politics_view, institutions_harden_into_domination, etc.).
    // Q97 targets PF via thought-frequency scenario; Q98 targets TRB via
    // group-solidarity scenario. Both use the Q87 single_choice pattern.
    {
      id: 97,
      stage: "fixed12",
      section: "I",
      promptShort: "political_thought_frequency",
      uiType: "single_choice",
      quality: 0.9,
      rewriteNeeded: false,
      touchProfile: [
        { node: "PF", kind: "continuous", role: "position", weight: 0.7, touchType: "thought_frequency_proxy" },
        { node: "PF", kind: "continuous", role: "salience", weight: 0.85, touchType: "thought_frequency_proxy" },
        { node: "ENG", kind: "continuous", role: "salience", weight: 0.25, touchType: "attention_proxy" }
      ],
      optionEvidence: {
        // A: Rarely — only during elections or big news
        rarely_elections: {
          continuous: {
            PF: { pos: [0.55, 0.28, 0.12, 0.03, 0.02], sal: [0.55, 0.3, 0.12, 0.03] },
            ENG: { sal: [0.5, 0.3, 0.15, 0.05] }
          }
        },
        // B: Sometimes — when something big happens I'll think about it
        sometimes_events: {
          continuous: {
            PF: { pos: [0.2, 0.4, 0.25, 0.12, 0.03], sal: [0.2, 0.4, 0.28, 0.12] },
            ENG: { sal: [0.2, 0.4, 0.28, 0.12] }
          }
        },
        // C: Regularly — part of my daily media and conversations
        regularly_daily: {
          continuous: {
            PF: { pos: [0.05, 0.15, 0.35, 0.32, 0.13], sal: [0.05, 0.18, 0.42, 0.35] },
            ENG: { sal: [0.05, 0.18, 0.42, 0.35] }
          }
        },
        // D: Constantly — politics shapes how I see most things
        constantly_worldview: {
          continuous: {
            PF: { pos: [0.02, 0.05, 0.15, 0.33, 0.45], sal: [0.02, 0.08, 0.25, 0.65] },
            ENG: { sal: [0.02, 0.08, 0.3, 0.6] }
          }
        }
      }
    },
    {
      id: 98,
      stage: "fixed12",
      section: "I",
      promptShort: "group_solidarity_feeling",
      uiType: "single_choice",
      quality: 0.9,
      rewriteNeeded: false,
      touchProfile: [
        { node: "TRB", kind: "continuous", role: "position", weight: 0.85, touchType: "group_solidarity" },
        { node: "TRB", kind: "continuous", role: "salience", weight: 0.8, touchType: "group_solidarity" },
        { node: "MOR", kind: "continuous", role: "position", weight: 0.2, touchType: "in_group_proxy" }
      ],
      optionEvidence: {
        // A: Personal — like it's happening to me
        personal_feels: {
          continuous: {
            TRB: { pos: [0.02, 0.05, 0.15, 0.33, 0.45], sal: [0.02, 0.08, 0.25, 0.65] },
            MOR: { pos: [0.05, 0.15, 0.3, 0.3, 0.2] }
          }
        },
        // B: Important — I pay attention and care
        important_care: {
          continuous: {
            TRB: { pos: [0.05, 0.18, 0.38, 0.28, 0.11], sal: [0.05, 0.22, 0.42, 0.31] },
            MOR: { pos: [0.1, 0.25, 0.35, 0.22, 0.08] }
          }
        },
        // C: Aware but it doesn't really touch me
        aware_distant: {
          continuous: {
            TRB: { pos: [0.25, 0.4, 0.22, 0.1, 0.03], sal: [0.25, 0.42, 0.25, 0.08] },
            MOR: { pos: [0.2, 0.35, 0.28, 0.12, 0.05] }
          }
        },
        // D: Not really — I don't see myself mainly through group identity
        universalist_self: {
          continuous: {
            TRB: { pos: [0.55, 0.28, 0.12, 0.03, 0.02], sal: [0.55, 0.3, 0.12, 0.03] },
            MOR: { pos: [0.3, 0.3, 0.22, 0.12, 0.06] }
          }
        }
      }
    },
    // Q89 — Epistemic-style battery (top-1 / bottom-1 over 6 EPS categories).
    // Updates EPS category (toward best, away from worst) AND EPS salience.
    // Closes the EPS sal=1,2 reachability gap and gives one-shot category info.
    // Requires applyBestWorstSalience to honor map.categorical (extended 2026-04-20).
    {
      id: 89,
      stage: "fixed12",
      section: "II",
      promptShort: "epistemic_style_battery",
      uiType: "best_worst",
      bwMaxPicks: 1,
      quality: 0.92,
      rewriteNeeded: false,
      touchProfile: [
        { node: "EPS", kind: "categorical", role: "category", weight: 0.85, touchType: "epistemic_style_pick" },
        { node: "EPS", kind: "categorical", role: "salience", weight: 0.55, touchType: "epistemic_style_pick" }
      ],
      rankingMap: {
        eps_empiricist: { categorical: { EPS: EPS_PROTOTYPES.empiricist } },
        eps_institutionalist: { categorical: { EPS: EPS_PROTOTYPES.institutionalist } },
        eps_traditionalist: { categorical: { EPS: EPS_PROTOTYPES.traditionalist } },
        eps_intuitionist: { categorical: { EPS: EPS_PROTOTYPES.intuitionist } },
        eps_autonomous: { categorical: { EPS: EPS_PROTOTYPES.autonomous } },
        eps_nihilist: { categorical: { EPS: EPS_PROTOTYPES.nihilist } }
      }
    },
    // Q87 — PF position via affective-polarization proxy (close-family cross-partisan marriage).
    // Added 2026-04-19 to raise PF position coverage from 2 → 3; EIG needs ≥2 agreeing touches to converge.
    {
      id: 87,
      stage: "stage3",
      section: "IV",
      promptShort: "family_cross_partisan_marriage",
      uiType: "single_choice",
      quality: 0.88,
      rewriteNeeded: false,
      touchProfile: [
        { node: "PF", kind: "continuous", role: "position", weight: 0.88, touchType: "identity_fusion_affective" },
        { node: "TRB", kind: "continuous", role: "position", weight: 0.22, touchType: "camp_attachment" }
      ],
      optionEvidence: {
        // A: Fine — politics is separate from who they are
        politics_separate: {
          continuous: {
            PF: { pos: [0.5, 0.28, 0.14, 0.05, 0.03] },
            TRB: { pos: [0.35, 0.3, 0.2, 0.1, 0.05] }
          }
        },
        // B: A bit awkward but doesn't change much
        slightly_awkward: {
          continuous: {
            PF: { pos: [0.18, 0.32, 0.3, 0.14, 0.06] },
            TRB: { pos: [0.15, 0.28, 0.3, 0.17, 0.1] }
          }
        },
        // C: Bothered — I'd find it harder to feel close
        bothered_distance: {
          continuous: {
            PF: { pos: [0.04, 0.1, 0.24, 0.36, 0.26] },
            TRB: { pos: [0.05, 0.12, 0.25, 0.33, 0.25] }
          }
        },
        // D: A major problem — I'd seriously question the relationship
        major_problem: {
          continuous: {
            PF: { pos: [0.02, 0.04, 0.1, 0.28, 0.56] },
            TRB: { pos: [0.03, 0.07, 0.15, 0.3, 0.45] }
          }
        }
      }
    },
    // ─────────────────────────────────────────────────────────────────────────
    // Q99 — cross_partisan_priority_sort (priority_sort, 3-bucket)
    // UI buckets: fine / not_ideal / dealbreaker map to engine buckets:
    //   fine        → neutral       (no position pull, low salience signal)
    //   not_ideal   → supportMid    (gentle pull toward item's TRB-high target)
    //   dealbreaker → supportHigh   (strong pull toward item's TRB-high target)
    // Item pos distributions encode "given this placement in supportHigh, where
    // should TRB be?" — neighbor dealbreaker = extreme tribal (pos peaked at 5),
    // spouse dealbreaker = common/moderate (pos peaked near 3-4). The convex
    // mix weight is fixed per bucket, so per-item pos asymmetry is what
    // distinguishes strong vs weak tribalism signals.
    // ─────────────────────────────────────────────────────────────────────────
    {
      id: 99,
      stage: "fixed12",
      section: "I",
      promptShort: "cross_partisan_priority_sort",
      uiType: "priority_sort",
      priorityBattery: true,
      quality: 0.9,
      rewriteNeeded: false,
      optionLabels: {
        neighbor: "Neighbor \u2014 lives next door, small talk at the mailbox",
        coworker: "Coworker \u2014 shares a team or office with you every day",
        close_friend: "Close friend \u2014 someone you confide in regularly",
        sibling_inlaw: "Sibling-in-law \u2014 part of your family through marriage",
        dating_partner: "Your romantic partner \u2014 someone you are dating exclusively",
        spouse: "Your spouse \u2014 lifelong partner and co-parent"
      },
      touchProfile: [
        { node: "TRB", kind: "continuous", role: "position", weight: 0.8, touchType: "cross_partisan_tolerance" },
        { node: "TRB", kind: "continuous", role: "salience", weight: 0.8, touchType: "cross_partisan_tolerance" },
        { node: "MOR", kind: "continuous", role: "position", weight: 0.15, touchType: "out_group_proxy" }
      ],
      rankingMap: {
        neighbor: { continuous: { TRB: { pos: [0.01, 0.03, 0.08, 0.25, 0.63] } } },
        coworker: { continuous: { TRB: { pos: [0.02, 0.05, 0.13, 0.3, 0.5] } } },
        close_friend: { continuous: { TRB: { pos: [0.04, 0.1, 0.2, 0.33, 0.33] } } },
        sibling_inlaw: { continuous: { TRB: { pos: [0.08, 0.15, 0.27, 0.3, 0.2] } } },
        dating_partner: { continuous: { TRB: { pos: [0.12, 0.2, 0.3, 0.25, 0.13] } } },
        spouse: { continuous: { TRB: { pos: [0.15, 0.25, 0.3, 0.18, 0.12] } } }
      }
    },
    // ─────────────────────────────────────────────────────────────────────────
    // Q100 — leader_conjoint (conjoint UI, single_choice engine semantics)
    // 2 candidate bundles × 4 attributes (Style, Outlook, Affiliation, Priority).
    // Engine treats as single_choice (two options: "a" and "b"). The strength
    // follow-up captures salience via applyRatioBoost (a_lot → ratio 10,
    // a_little → ratio 1.5). The 4 attribute bundles are baked into
    // optionEvidence — picking A commits to all four of A's attribute positions.
    // ─────────────────────────────────────────────────────────────────────────
    {
      id: 100,
      stage: "fixed12",
      section: "II",
      promptShort: "leader_conjoint",
      uiType: "conjoint",
      quality: 0.88,
      rewriteNeeded: false,
      options: ["a", "b"],
      touchProfile: [
        { node: "AES", kind: "categorical", role: "category", weight: 0.7, touchType: "conjoint_bundle" },
        { node: "AES", kind: "categorical", role: "salience", weight: 0.4, touchType: "conjoint_bundle" },
        { node: "CD", kind: "continuous", role: "position", weight: 0.55, touchType: "conjoint_bundle" },
        { node: "CD", kind: "continuous", role: "salience", weight: 0.45, touchType: "conjoint_bundle" },
        { node: "TRB", kind: "continuous", role: "position", weight: 0.45, touchType: "conjoint_bundle" },
        { node: "TRB", kind: "continuous", role: "salience", weight: 0.45, touchType: "conjoint_bundle" },
        { node: "MAT", kind: "continuous", role: "position", weight: 0.35, touchType: "conjoint_bundle" },
        { node: "CU", kind: "continuous", role: "position", weight: 0.35, touchType: "conjoint_bundle" }
      ],
      optionEvidence: {
        // Candidate A: fighter / progressive / party-loyal / economic-justice
        a: {
          categorical: {
            AES: { cat: [0.06, 0.06, 0.06, 0.08, 0.68, 0.06] }
          },
          continuous: {
            CD: { pos: [0.4, 0.3, 0.18, 0.08, 0.04] },
            TRB: { pos: [0.05, 0.1, 0.2, 0.3, 0.35] },
            MAT: { pos: [0.35, 0.32, 0.2, 0.08, 0.05] }
          }
        },
        // Candidate B: statesman / traditional / country-first / cultural-continuity
        b: {
          categorical: {
            AES: { cat: [0.65, 0.12, 0.06, 0.06, 0.06, 0.05] }
          },
          continuous: {
            CD: { pos: [0.04, 0.08, 0.18, 0.3, 0.4] },
            TRB: { pos: [0.15, 0.25, 0.3, 0.2, 0.1] },
            CU: { pos: [0.4, 0.3, 0.18, 0.08, 0.04] }
          }
        }
      },
      strengthFollowUp: {
        kind: "strength",
        prompt: "How strongly do you prefer this candidate?",
        labels: { strong: "A lot", weak: "A little" }
      }
    },
    // ─────────────────────────────────────────────────────────────────────────
    // Q101 — cultural_social_dual_axis (dual_axis on CD)
    // One grid tap gives both position (x, Progressive→Traditional) and
    // salience (y, doesn't-matter→central). Applied via applyDualAxisAnswer.
    // xLow = CD=1 (progressive) target posterior; xHigh = CD=5 (traditional).
    // ─────────────────────────────────────────────────────────────────────────
    {
      id: 101,
      stage: "fixed12",
      section: "II",
      promptShort: "cultural_social_placement_dual",
      uiType: "dual_axis",
      priorityBattery: true,
      quality: 0.88,
      rewriteNeeded: false,
      touchProfile: [
        { node: "CD", kind: "continuous", role: "position", weight: 0.8, touchType: "dual_axis_cd" },
        { node: "CD", kind: "continuous", role: "salience", weight: 0.75, touchType: "dual_axis_cd" }
      ],
      dualAxisMap: {
        node: "CD",
        xLow: [0.45, 0.3, 0.15, 0.07, 0.03],
        xHigh: [0.03, 0.07, 0.15, 0.3, 0.45]
      }
    },
    // ─────────────────────────────────────────────────────────────────────────
    // Q102 — membership_criteria_priority_sort (priority_sort, 3-bucket)
    // UI buckets: essential / nice / irrelevant → supportHigh / supportMid / neutral.
    // Targets CU (1=assimilationist, 5=pluralist). Items vary in how strongly
    // they predict CU when marked essential:
    //   born_here, ancestry, religion  → extreme low CU (ethno-religious exclusive)
    //   cultural, speak_lang           → moderately low CU (assimilationist)
    //   economic                       → mild low CU (instrumentalist)
    //   shared_values, civic_part      → center (civic nationalist)
    // All-essential respondent = demanding assimilationist (CU=1 lock).
    // Only civic_part+shared_values essential = civic nationalist (CU=3).
    // All-irrelevant respondent = pluralist (CU unmoved, low salience).
    // ─────────────────────────────────────────────────────────────────────────
    {
      id: 102,
      stage: "fixed12",
      section: "II",
      promptShort: "membership_criteria_priority_sort",
      uiType: "priority_sort",
      priorityBattery: true,
      quality: 0.9,
      rewriteNeeded: false,
      optionLabels: {
        born_here: "Being born in the country \u2014 having citizenship by birth",
        speak_lang: "Speaking the national language fluently in daily life",
        shared_values: "Believing in the core civic values (liberty, equality, rule of law)",
        civic_part: "Participating in civic life \u2014 voting, jury duty, community involvement",
        cultural: "Adopting cultural customs, holidays, and traditions",
        ancestry: "Having ancestral roots in the country going back generations",
        religion: "Sharing the country's religious heritage and traditions",
        economic: "Contributing economically \u2014 holding a job, paying taxes, not being a burden"
      },
      touchProfile: [
        { node: "CU", kind: "continuous", role: "position", weight: 0.85, touchType: "membership_criteria" },
        { node: "CU", kind: "continuous", role: "salience", weight: 0.8, touchType: "membership_criteria" },
        { node: "MOR", kind: "continuous", role: "position", weight: 0.2, touchType: "membership_scope" }
      ],
      rankingMap: {
        born_here: { continuous: { CU: { pos: [0.5, 0.3, 0.12, 0.06, 0.02] } } },
        speak_lang: { continuous: { CU: { pos: [0.35, 0.35, 0.18, 0.08, 0.04] } } },
        shared_values: { continuous: { CU: { pos: [0.2, 0.3, 0.3, 0.13, 0.07] } } },
        civic_part: { continuous: { CU: { pos: [0.18, 0.3, 0.3, 0.14, 0.08] } } },
        cultural: { continuous: { CU: { pos: [0.4, 0.3, 0.15, 0.1, 0.05] } } },
        ancestry: { continuous: { CU: { pos: [0.55, 0.25, 0.1, 0.06, 0.04] } } },
        religion: { continuous: { CU: { pos: [0.55, 0.25, 0.1, 0.06, 0.04] } } },
        economic: { continuous: { CU: { pos: [0.25, 0.3, 0.28, 0.12, 0.05] } } }
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
    "gender",
    "sexual",
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
  var SAL_IF_BEST = [0.05, 0.15, 0.3, 0.5];
  var SAL_IF_WORST = [0.5, 0.3, 0.15, 0.05];
  var SAL_IF_MIDDLE = [0.25, 0.3, 0.25, 0.2];
  var SAL_IF_BEST_FORCED = [0.23, 0.25, 0.27, 0.25];
  var SAL_IF_WORST_FORCED = [0.27, 0.25, 0.25, 0.23];
  var BW_BEST_CAT_MIX = 0.5;
  var BW_WORST_CAT_MIX = 0.3;
  var BW_BEST_POS_MIX = 0.35;
  var BW_WORST_POS_MIX = 0.22;
  var SAL_PRIORITY_HIGH = [0.03, 0.1, 0.27, 0.6];
  var SAL_PRIORITY_MID = [0.2, 0.3, 0.3, 0.2];
  var SAL_PRIORITY_LOW = [0.55, 0.3, 0.12, 0.03];
  var PRIORITY_HIGH_POS_MIX = 0.4;
  var PRIORITY_MID_POS_MIX = 0.2;
  var DUAL_AXIS_POS_MIX = 0.45;
  function dualAxisYtoSal(y) {
    if (y >= 0.8) return [0.03, 0.1, 0.27, 0.6];
    if (y >= 0.6) return [0.1, 0.2, 0.32, 0.38];
    if (y >= 0.4) return [0.22, 0.3, 0.28, 0.2];
    if (y >= 0.2) return [0.4, 0.3, 0.2, 0.1];
    return [0.6, 0.25, 0.12, 0.03];
  }
  function invertCatDist(d) {
    const inv = d.map((p) => 1 - p);
    const total = inv.reduce((a, b) => a + b, 0);
    if (total <= 0) return d;
    return inv.map((p) => p / total);
  }
  var EXTREMITY_SAL = [0.1, 0.2, 0.3, 0.4];
  function isExtremePosEvidence(pos) {
    if (!pos || pos.length !== 5) return false;
    const max = Math.max(...pos);
    if (max < 0.4) return false;
    const maxIdx = pos.indexOf(max);
    return maxIdx === 0 || maxIdx === 4;
  }
  function boostExtremitySalience(state, q, nodesToBoost) {
    if (nodesToBoost.size === 0) return;
    for (const touch of q.touchProfile) {
      if (touch.role !== "position") continue;
      if (!nodesToBoost.has(touch.node)) continue;
      if (touch.kind === "continuous" && touch.node in state.continuous) {
        const node = state.continuous[touch.node];
        node.salDist = multiplyAndNormalize(node.salDist, EXTREMITY_SAL);
      } else if (touch.kind === "categorical" && touch.node in state.categorical) {
        const node = state.categorical[touch.node];
        node.salDist = multiplyAndNormalize(node.salDist, EXTREMITY_SAL);
      }
    }
  }
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
    const ev = q.optionEvidence?.[optionKey];
    applyOptionEvidence(state, ev);
    if (ev?.continuous) {
      const extremeNodes = /* @__PURE__ */ new Set();
      for (const [nodeId, upd] of Object.entries(ev.continuous)) {
        if (isExtremePosEvidence(upd?.pos)) extremeNodes.add(nodeId);
      }
      boostExtremitySalience(state, q, extremeNodes);
    }
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
    if (rawValue <= 20 || rawValue >= 80) {
      const posNodes = new Set(
        q.touchProfile.filter((t) => t.role === "position").map((t) => t.node)
      );
      boostExtremitySalience(state, q, posNodes);
    }
  }
  function applyAllocationAnswer(state, q, allocation) {
    state.answers[q.id] = allocation;
    registerTouches(state, q);
    if (!q.allocationMap) return;
    const total = Math.max(1, Object.values(allocation).reduce((a, b) => a + b, 0));
    const shares = Object.values(allocation).map((weight) => weight / total);
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
    const salienceTouches = q.touchProfile.filter((t) => t.role === "salience");
    if (!salienceTouches.length) return;
    const hhi = shares.reduce((sum, s) => sum + s * s, 0);
    const concentration = Math.max(0, Math.min(1, (hhi - 0.25) / 0.75));
    const salLikelihood = concentration >= 0.75 ? [0.03, 0.08, 0.24, 0.65] : concentration >= 0.5 ? [0.06, 0.14, 0.32, 0.48] : concentration >= 0.25 ? [0.12, 0.22, 0.34, 0.32] : [0.22, 0.3, 0.28, 0.2];
    for (const touch of salienceTouches) {
      if (touch.kind === "continuous") {
        const node = state.continuous[touch.node];
        node.salDist = multiplyAndNormalize(node.salDist, salLikelihood);
      } else if (touch.kind === "categorical") {
        const node = state.categorical[touch.node];
        node.salDist = multiplyAndNormalize(node.salDist, salLikelihood);
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
  function applyBestWorstSalience(state, q, best, worst, allItems) {
    state.answers[q.id] = { best: best.slice(), worst: worst.slice() };
    registerTouches(state, q);
    if (!q.rankingMap) return;
    const bestSet = new Set(best);
    const worstSet = new Set(worst);
    const continuousBuckets = /* @__PURE__ */ new Map();
    const categoricalBuckets = /* @__PURE__ */ new Map();
    const bucketFor = (item) => bestSet.has(item) ? "best" : worstSet.has(item) ? "worst" : "middle";
    for (const item of allItems) {
      const map = q.rankingMap[item];
      if (!map) continue;
      const b = bucketFor(item);
      if (map.continuous) {
        for (const nodeId of Object.keys(map.continuous)) {
          if (!continuousBuckets.has(nodeId)) continuousBuckets.set(nodeId, /* @__PURE__ */ new Set());
          continuousBuckets.get(nodeId).add(b);
        }
      }
      if (map.categorical) {
        for (const nodeId of Object.keys(map.categorical)) {
          if (!categoricalBuckets.has(nodeId)) categoricalBuckets.set(nodeId, /* @__PURE__ */ new Set());
          categoricalBuckets.get(nodeId).add(b);
        }
      }
    }
    function resolveSal(buckets) {
      const forced = buckets.has("middle");
      if (buckets.has("best")) return forced ? SAL_IF_BEST_FORCED : SAL_IF_BEST;
      if (buckets.has("worst")) return forced ? SAL_IF_WORST_FORCED : SAL_IF_WORST;
      return SAL_IF_MIDDLE;
    }
    for (const [nodeId, buckets] of continuousBuckets) {
      const node = state.continuous[nodeId];
      if (!node) continue;
      node.salDist = multiplyAndNormalize(node.salDist, resolveSal(buckets));
    }
    for (const [nodeId, buckets] of categoricalBuckets) {
      const node = state.categorical[nodeId];
      if (!node) continue;
      node.salDist = multiplyAndNormalize(node.salDist, resolveSal(buckets));
    }
    for (const item of allItems) {
      const map = q.rankingMap[item];
      if (!map?.categorical) continue;
      const isBest = bestSet.has(item);
      const isWorst = worstSet.has(item);
      if (!isBest && !isWorst) continue;
      for (const [nodeId, catDist] of Object.entries(map.categorical)) {
        const node = state.categorical[nodeId];
        if (!node || !catDist) continue;
        const w = isBest ? BW_BEST_CAT_MIX : BW_WORST_CAT_MIX;
        const target = isBest ? catDist : invertCatDist(catDist);
        const mixed = node.catDist.map((v, i) => v * (1 - w) + target[i] * w);
        node.catDist = normalize(mixed);
      }
    }
    for (const item of allItems) {
      const map = q.rankingMap[item];
      if (!map?.continuous) continue;
      const isBest = bestSet.has(item);
      const isWorst = worstSet.has(item);
      if (!isBest && !isWorst) continue;
      for (const [nodeId, evidence] of Object.entries(map.continuous)) {
        if (!evidence?.pos) continue;
        const node = state.continuous[nodeId];
        if (!node) continue;
        const w = isBest ? BW_BEST_POS_MIX : BW_WORST_POS_MIX;
        const sum = evidence.pos.reduce((a, b) => a + b, 0) || 1;
        const target = isBest ? evidence.pos.map((p) => p / sum) : evidence.pos.map((p) => 1 - p / sum);
        const tSum = target.reduce((a, b) => a + b, 0) || 1;
        const tNorm = target.map((p) => p / tSum);
        const mixed = node.posDist.map((v, i) => v * (1 - w) + tNorm[i] * w);
        node.posDist = normalize(mixed);
      }
    }
  }
  function applyPrioritySort(state, q, placements, allItems) {
    state.answers[q.id] = {
      supportHigh: placements.supportHigh.slice(),
      supportMid: placements.supportMid.slice(),
      neutral: placements.neutral.slice(),
      opposeHigh: placements.opposeHigh.slice()
    };
    registerTouches(state, q);
    if (!q.rankingMap) return;
    const supportHighSet = new Set(placements.supportHigh);
    const supportMidSet = new Set(placements.supportMid);
    const opposeHighSet = new Set(placements.opposeHigh);
    const bucketFor = (item) => supportHighSet.has(item) ? "supportHigh" : opposeHighSet.has(item) ? "opposeHigh" : supportMidSet.has(item) ? "supportMid" : "neutral";
    const continuousBuckets = /* @__PURE__ */ new Map();
    const categoricalBuckets = /* @__PURE__ */ new Map();
    for (const item of allItems) {
      const map = q.rankingMap[item];
      if (!map) continue;
      const b = bucketFor(item);
      if (map.continuous) {
        for (const nodeId of Object.keys(map.continuous)) {
          if (!continuousBuckets.has(nodeId)) continuousBuckets.set(nodeId, /* @__PURE__ */ new Set());
          continuousBuckets.get(nodeId).add(b);
        }
      }
      if (map.categorical) {
        for (const nodeId of Object.keys(map.categorical)) {
          if (!categoricalBuckets.has(nodeId)) categoricalBuckets.set(nodeId, /* @__PURE__ */ new Set());
          categoricalBuckets.get(nodeId).add(b);
        }
      }
    }
    function resolveSal(buckets) {
      if (buckets.has("supportHigh") || buckets.has("opposeHigh")) return SAL_PRIORITY_HIGH;
      if (buckets.has("supportMid")) return SAL_PRIORITY_MID;
      return SAL_PRIORITY_LOW;
    }
    for (const [nodeId, buckets] of continuousBuckets) {
      const node = state.continuous[nodeId];
      if (!node) continue;
      node.salDist = multiplyAndNormalize(node.salDist, resolveSal(buckets));
    }
    for (const [nodeId, buckets] of categoricalBuckets) {
      const node = state.categorical[nodeId];
      if (!node) continue;
      node.salDist = multiplyAndNormalize(node.salDist, resolveSal(buckets));
    }
    for (const item of allItems) {
      const map = q.rankingMap[item];
      if (!map?.continuous) continue;
      const bucket = bucketFor(item);
      if (bucket === "neutral") continue;
      const w = bucket === "supportMid" ? PRIORITY_MID_POS_MIX : PRIORITY_HIGH_POS_MIX;
      const invert = bucket === "opposeHigh";
      for (const [nodeId, evidence] of Object.entries(map.continuous)) {
        if (!evidence?.pos) continue;
        const node = state.continuous[nodeId];
        if (!node) continue;
        const sum = evidence.pos.reduce((a, b) => a + b, 0) || 1;
        const raw = invert ? evidence.pos.map((p) => 1 - p / sum) : evidence.pos.map((p) => p / sum);
        const rawSum = raw.reduce((a, b) => a + b, 0) || 1;
        const target = raw.map((p) => p / rawSum);
        const mixed = node.posDist.map((v, i) => v * (1 - w) + target[i] * w);
        node.posDist = normalize(mixed);
      }
    }
  }
  function applyDualAxisAnswer(state, q, answer) {
    const x = Math.max(0, Math.min(1, answer.x));
    const y = Math.max(0, Math.min(1, answer.y));
    state.answers[q.id] = { x, y };
    registerTouches(state, q);
    if (!q.dualAxisMap) return;
    const map = q.dualAxisMap;
    const node = state.continuous[map.node];
    if (!node) return;
    const target = map.xLow.map((lo, i) => lo * (1 - x) + (map.xHigh[i] ?? 0) * x);
    const sum = target.reduce((a, b) => a + b, 0) || 1;
    const normTarget = target.map((v) => v / sum);
    const mixed = node.posDist.map((v, i) => v * (1 - DUAL_AXIS_POS_MIX) + (normTarget[i] ?? 0) * DUAL_AXIS_POS_MIX);
    node.posDist = normalize(mixed);
    node.salDist = multiplyAndNormalize(node.salDist, dualAxisYtoSal(y));
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
  var FIXED_OPENER = [93, 97, 98, 89, 60, 11, 1, 99, 100, 101, 102];

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
    // Stop rule (distance-native). Placeholders — calibrate in Stage 4.
    STOP_MIN_QUESTIONS: 25,
    STOP_DISTANCE_MAX: 8,
    STOP_GAP_RATIO_MIN: 0.1,
    STOP_MIN_CONSECUTIVE_LEADS: 3,
    STOP_AGREEMENT_K: 3,
    // Ultra-confidence stop (earlier, tighter)
    UC_MIN_Q: 20,
    UC_DISTANCE_MAX: 6,
    UC_GAP_RATIO_MIN: 0.25,
    UC_CONSECUTIVE: 8,
    // Secondary stop (later, relaxed)
    SECONDARY_MIN_Q: 35,
    SECONDARY_DISTANCE_MAX: 10,
    SECONDARY_GAP_RATIO_MIN: 0.05,
    SECONDARY_CONSECUTIVE: 6,
    // Late-game stop
    LATE_GAME_MIN_Q: 45,
    LATE_GAME_DISTANCE_MAX: 12,
    LATE_GAME_GAP_RATIO_MIN: 0.03,
    LATE_GAME_CONSECUTIVE: 4,
    // Hard cap on questions asked
    HARD_CAP_Q: 55
  };
  var _config = { ...DEFAULT_CONFIG };

  // src/engine/archetypeDistance.ts
  function archetypeDistance(state, archetype) {
    let totalDist = 0;
    let totalWeight = 0;
    for (const nodeId of CONTINUOUS_NODES) {
      const template = archetype.nodes[nodeId];
      if (!template || template.kind !== "continuous") continue;
      const nodeState = state.continuous[nodeId];
      const expectedPos2 = nodeState.posDist[0] * 1 + nodeState.posDist[1] * 2 + nodeState.posDist[2] * 3 + nodeState.posDist[3] * 4 + nodeState.posDist[4] * 5;
      const posProb = nodeState.posDist[template.pos - 1] ?? 0.2;
      const expectedSal3 = nodeState.salDist[0] * 0 + nodeState.salDist[1] * 1 + nodeState.salDist[2] * 2 + nodeState.salDist[3] * 3;
      const salProb = nodeState.salDist[template.sal] ?? 0.25;
      const posMeanDiff = Math.abs(expectedPos2 - template.pos) / 4;
      const posProbDist = 1 - posProb;
      const salMeanDiff = Math.abs(expectedSal3 - template.sal) / 3;
      const salProbDist = 1 - salProb;
      const positionDist = posMeanDiff * 0.6 + posProbDist * 0.4;
      const salienceDist = salMeanDiff * 0.6 + salProbDist * 0.4;
      let antiPenalty = 0;
      if (template.anti === "high" && expectedPos2 > 3.8) {
        antiPenalty = 0.8 * (expectedPos2 - 3.8) / 1.2;
      } else if (template.anti === "low" && expectedPos2 < 2.2) {
        antiPenalty = 0.8 * (2.2 - expectedPos2) / 1.2;
      }
      const archSalWeight = 0.5 + template.sal * 0.5;
      const respondentSalWeight = 0.5 + expectedSal3 * 0.25;
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
      const expectedSal3 = nodeState.salDist[0] * 0 + nodeState.salDist[1] * 1 + nodeState.salDist[2] * 2 + nodeState.salDist[3] * 3;
      const salDiff = Math.abs(expectedSal3 - template.sal) / 3;
      const archSalWeight = 0.5 + template.sal * 0.5;
      const respondentSalWeight = 0.5 + expectedSal3 * 0.25;
      const nodeWeight = archSalWeight * respondentSalWeight;
      const catDist = catCostDist * 0.5 + dotDist * 0.5;
      const nodeDist = catDist * 0.65 + salDiff * 0.35 + antiCatPenalty;
      totalDist += nodeDist * nodeWeight;
      totalWeight += nodeWeight;
    }
    return totalWeight > 0 ? totalDist / totalWeight : 0;
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
      // Eligible once we're past the opener
      case "screen20_or_late_screen":
        return answered >= FIXED_OPENER.length;
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

  // src/engine/selectorEIG.ts
  var ACTIVE_SAL_THRESHOLD = 2;
  var POS_CONVERGED_MAX_PROB = 0.45;
  var SAL_CONVERGED_MAX_PROB = 0.55;
  var CAT_CONVERGED_MAX_PROB = 0.55;
  var AES_CAT_CONVERGED_MAX_PROB = 0.4;
  var TRB_CONVERGED_MAX_PROB = 0.45;
  var POS_MIN_TOUCHES_TO_LOCK = 2;
  var MAX_POSITION_TOUCHES = 3;
  var MIN_QUESTIONS = 20;
  var MAX_QUESTIONS = 40;
  function entropy(dist) {
    let h = 0;
    for (const p of dist) if (p > 1e-12) h -= p * Math.log(p);
    return h;
  }
  function expectedSal(dist) {
    return dist[0] * 0 + dist[1] * 1 + dist[2] * 2 + dist[3] * 3;
  }
  function isActive(state, nodeId) {
    if (nodeId in state.continuous) {
      return expectedSal(state.continuous[nodeId].salDist) >= ACTIVE_SAL_THRESHOLD;
    }
    if (nodeId in state.categorical) {
      return expectedSal(state.categorical[nodeId].salDist) >= ACTIVE_SAL_THRESHOLD;
    }
    return false;
  }
  function roleTouches(state, nodeId, role, questionsById) {
    let n = 0;
    for (const qid of Object.keys(state.answers)) {
      const q = questionsById.get(Number(qid));
      if (!q) continue;
      for (const t of q.touchProfile) {
        if (t.node === nodeId && t.role === role) n++;
      }
    }
    return n;
  }
  function posConverged(state, nodeId, questionsById) {
    const node = state.continuous[nodeId];
    if (!node) return false;
    const touches = roleTouches(state, nodeId, "position", questionsById);
    if (touches >= MAX_POSITION_TOUCHES) return true;
    if (touches >= POS_MIN_TOUCHES_TO_LOCK && Math.max(...node.posDist) >= POS_CONVERGED_MAX_PROB) {
      return true;
    }
    return false;
  }
  function salConverged(state, nodeId) {
    let dist;
    if (nodeId in state.continuous) dist = state.continuous[nodeId].salDist;
    else if (nodeId in state.categorical) dist = state.categorical[nodeId].salDist;
    if (!dist) return false;
    return Math.max(...dist) >= SAL_CONVERGED_MAX_PROB;
  }
  function catConverged(state, nodeId) {
    const node = state.categorical[nodeId];
    if (!node) return false;
    const threshold = nodeId === "AES" ? AES_CAT_CONVERGED_MAX_PROB : CAT_CONVERGED_MAX_PROB;
    return Math.max(...node.catDist) >= threshold;
  }
  function trbConverged(state) {
    return Math.max(...state.trbAnchor.dist) >= TRB_CONVERGED_MAX_PROB;
  }
  function touchInfoGain(state, touch, questionsById) {
    const nodeId = touch.node;
    if (nodeId === "TRB_ANCHOR") {
      if (trbConverged(state)) return 0;
      return entropy(state.trbAnchor.dist);
    }
    if (touch.role === "position") {
      if (!isActive(state, nodeId)) return 0;
      if (nodeId in state.continuous) {
        if (posConverged(state, nodeId, questionsById)) return 0;
        return entropy(state.continuous[nodeId].posDist);
      }
      return 0;
    }
    if (touch.role === "salience") {
      if (salConverged(state, nodeId)) return 0;
      if (nodeId in state.continuous) {
        return entropy(state.continuous[nodeId].salDist);
      }
      if (nodeId in state.categorical) {
        return entropy(state.categorical[nodeId].salDist);
      }
      return 0;
    }
    if (touch.role === "category") {
      if (nodeId in state.categorical) {
        if (catConverged(state, nodeId)) return 0;
        return entropy(state.categorical[nodeId].catDist);
      }
      return 0;
    }
    if (touch.role === "anchor") {
      if (trbConverged(state)) return 0;
      return entropy(state.trbAnchor.dist);
    }
    return 0;
  }
  function evidenceEntries(q) {
    if (q.uiType === "single_choice" || q.uiType === "multi") {
      return Object.values(q.optionEvidence ?? {});
    }
    if (q.uiType === "slider") {
      return Object.values(q.sliderMap ?? {});
    }
    if (q.uiType === "ranking" || q.uiType === "best_worst") {
      const map = q.rankingMap ?? q.bestWorstMap ?? {};
      return Object.values(map);
    }
    if (q.uiType === "allocation") {
      return Object.values(q.allocationMap ?? {});
    }
    if (q.uiType === "pairwise") {
      const pm = q.pairMaps ?? {};
      const flat = [];
      for (const inner of Object.values(pm)) for (const ev of Object.values(inner)) flat.push(ev);
      return flat;
    }
    return [];
  }
  function hasEvidenceFor(ev, t, uiType) {
    if (!ev) return false;
    if (t.node === "TRB_ANCHOR") {
      const anchors = ev.trbAnchor;
      return !!anchors && Object.keys(anchors).length > 0;
    }
    if (uiType === "ranking" || uiType === "best_worst") {
      if (t.kind === "continuous" || t.role === "position" || t.role === "salience") {
        if (ev.continuous && t.node in ev.continuous) return true;
      }
      if (t.role === "category" || t.kind === "categorical") {
        if (ev.categorical && t.node in ev.categorical) return true;
      }
      return false;
    }
    if (uiType === "allocation" || uiType === "pairwise") {
      if (ev.continuous && t.node in ev.continuous) return true;
      if (ev.categorical && t.node in ev.categorical) return true;
      return false;
    }
    if (t.role === "position") {
      const n = ev.continuous?.[t.node];
      return !!n && n.pos !== void 0;
    }
    if (t.role === "salience") {
      const c = ev.continuous?.[t.node];
      const cat = ev.categorical?.[t.node];
      return !!c && c.sal !== void 0 || !!cat && cat.sal !== void 0;
    }
    if (t.role === "category") {
      const n = ev.categorical?.[t.node];
      return !!n && n.cat !== void 0;
    }
    if (t.role === "anchor") {
      const anchors = ev.trbAnchor;
      return !!anchors && Object.keys(anchors).length > 0;
    }
    return false;
  }
  var coverageCache = /* @__PURE__ */ new WeakMap();
  function touchCoverage(q, t) {
    let cache = coverageCache.get(q);
    if (!cache) {
      cache = /* @__PURE__ */ new Map();
      coverageCache.set(q, cache);
    }
    const key = `${t.node}:${t.role}:${t.kind}`;
    const hit = cache.get(key);
    if (hit !== void 0) return hit;
    const entries = evidenceEntries(q);
    if (!entries.length) {
      cache.set(key, 0);
      return 0;
    }
    let hits = 0;
    for (const ev of entries) if (hasEvidenceFor(ev, t, q.uiType)) hits++;
    const ratio = hits / entries.length;
    cache.set(key, ratio);
    return ratio;
  }
  function scoreQuestionEIG(state, q, questionsById) {
    let total = 0;
    for (const t of q.touchProfile) {
      const coverage = touchCoverage(q, t);
      if (coverage === 0) continue;
      total += coverage * t.weight * touchInfoGain(state, t, questionsById);
    }
    return total * q.quality * (q.rewriteNeeded ? 0.7 : 1);
  }
  function selectNextQuestionEIG(state, available, questionsById) {
    const eligible = available.filter(
      (q) => !(q.id in state.answers) && isQuestionEligible(state, q)
    );
    if (!eligible.length) return null;
    const priority = eligible.filter((q) => q.priorityBattery);
    if (priority.length) {
      const scoredPriority = priority.map((q) => ({ q, score: scoreQuestionEIG(state, q, questionsById) })).sort((a, b) => b.score - a.score);
      return scoredPriority[0].q;
    }
    const scored = eligible.map((q) => ({ q, score: scoreQuestionEIG(state, q, questionsById) })).filter((s) => s.score > 0);
    if (!scored.length) {
      const byQuality = [...eligible].sort((a, b) => b.quality - a.quality);
      return byQuality[0] ?? null;
    }
    scored.sort((a, b) => b.score - a.score);
    return scored[0].q;
  }
  function shouldStopEIG(state, questionsById) {
    const nAnswered = Object.keys(state.answers).length;
    if (nAnswered >= MAX_QUESTIONS) return true;
    if (nAnswered < MIN_QUESTIONS) return false;
    for (const nodeId of CONTINUOUS_NODES) {
      if (!isActive(state, nodeId)) continue;
      if (!posConverged(state, nodeId, questionsById)) return false;
    }
    for (const nodeId of CATEGORICAL_NODES) {
      if (nodeId === "AES") continue;
      if (!isActive(state, nodeId)) continue;
      if (!catConverged(state, nodeId)) return false;
    }
    if (!trbConverged(state) && state.trbAnchor.touches < 2) return false;
    return true;
  }

  // src/engine/stopRule.ts
  function resetSimilarityCache() {
  }

  // src/engine/archetypeFamilies.ts
  var FAMILY_PERCENTILE = 0.1;
  function pairwiseDistance(a, b) {
    let sumSquared = 0;
    for (const nodeId of CONTINUOUS_NODES) {
      const tA = a.nodes[nodeId];
      const tB = b.nodes[nodeId];
      if (!tA || tA.kind !== "continuous") continue;
      if (!tB || tB.kind !== "continuous") continue;
      const dp = tA.pos - tB.pos;
      const w = Math.max(tA.sal, tB.sal);
      sumSquared += dp * dp * w;
    }
    for (const nodeId of CATEGORICAL_NODES) {
      const tA = a.nodes[nodeId];
      const tB = b.nodes[nodeId];
      if (!tA || tA.kind !== "categorical") continue;
      if (!tB || tB.kind !== "categorical") continue;
      let probDiffSq = 0;
      for (let k = 0; k < 6; k++) {
        const d = (tA.probs[k] ?? 0) - (tB.probs[k] ?? 0);
        probDiffSq += d * d;
      }
      const w = Math.max(tA.sal, tB.sal);
      sumSquared += probDiffSq * w;
    }
    return Math.sqrt(sumSquared);
  }
  function percentile(sortedAsc, p) {
    if (sortedAsc.length === 0) return 0;
    const idx = (sortedAsc.length - 1) * p;
    const lo = Math.floor(idx);
    const hi = Math.ceil(idx);
    if (lo === hi) return sortedAsc[lo];
    const w = idx - lo;
    return sortedAsc[lo] * (1 - w) + sortedAsc[hi] * w;
  }
  function buildArchetypeFamilies(archetypes) {
    const pairwise = {};
    const allDistances = [];
    for (const a of archetypes) {
      pairwise[a.id] = {};
    }
    for (let i = 0; i < archetypes.length; i++) {
      for (let j = i + 1; j < archetypes.length; j++) {
        const a = archetypes[i];
        const b = archetypes[j];
        const d = pairwiseDistance(a, b);
        pairwise[a.id][b.id] = d;
        pairwise[b.id][a.id] = d;
        allDistances.push(d);
      }
    }
    allDistances.sort((x, y) => x - y);
    const threshold = percentile(allDistances, FAMILY_PERCENTILE);
    const familyOf = {};
    for (const a of archetypes) {
      const neighbours = /* @__PURE__ */ new Set();
      for (const b of archetypes) {
        if (a.id === b.id) continue;
        const d = pairwise[a.id][b.id];
        if (d !== void 0 && d <= threshold) {
          neighbours.add(b.id);
        }
      }
      familyOf[a.id] = neighbours;
    }
    return { pairwise, familyOf, threshold };
  }

  // src/identity/resolveIdentityPrimary.ts
  var TRB_ANCHOR_ORDER2 = [
    "national",
    "ideological",
    "religious",
    "class",
    "ethnic_racial",
    "gender",
    "sexual",
    "global",
    "mixed_none"
  ];
  function expectedContinuous(state, nodeId) {
    const node = state.continuous[nodeId];
    if (!node) return 3;
    return node.posDist.reduce((sum, p, i) => sum + p * (i + 1), 0);
  }
  function topAnchor(state) {
    const dist = state.trbAnchor?.dist;
    if (!dist || dist.length !== TRB_ANCHOR_ORDER2.length) return "mixed_none";
    let bestIdx = 0;
    for (let i = 1; i < dist.length; i++) {
      if (dist[i] > dist[bestIdx]) bestIdx = i;
    }
    return TRB_ANCHOR_ORDER2[bestIdx];
  }
  function resolveIdentityPrimary(state, engagementLabel, demographics) {
    const trb = expectedContinuous(state, "TRB");
    const pf = expectedContinuous(state, "PF");
    const zs = expectedContinuous(state, "ZS");
    const cd = expectedContinuous(state, "CD");
    const onts = expectedContinuous(state, "ONT_S");
    const mor = expectedContinuous(state, "MOR");
    const anchor = topAnchor(state);
    const engagementActive = engagementLabel.level === "engaged" || engagementLabel.level === "highly-engaged";
    const engagementDominant = engagementLabel.level === "highly-engaged";
    const passedLatent = trb >= 3 && pf >= 3;
    const passedActive = trb >= 4 && pf >= 4 && engagementActive;
    const passedDominant = trb >= 4 && pf >= 4 && engagementDominant;
    const gate = {
      trb,
      pf,
      engagementLevel: engagementLabel.level,
      passedLatent,
      passedActive,
      passedDominant
    };
    if (!passedLatent) {
      return { state: "none", anchor, reasonCodes: ["gate_not_met"], gate };
    }
    const stateLabel = passedDominant ? "dominant" : passedActive ? "active" : "latent";
    if (anchor === "ethnic_racial") {
      const race = typeof demographics?.demo_ethnicity === "string" ? demographics.demo_ethnicity : "";
      if (race === "black") {
        return {
          state: stateLabel,
          label: "Black Voter",
          confidence: passedActive ? "high" : "medium",
          anchor,
          reasonCodes: ["racial_anchor", "black_demographic_match"],
          gate
        };
      }
      if (race === "white") {
        const grievanceSignals = Number(zs >= 3.5) + Number(cd >= 3.5) + Number(onts <= 2.5);
        if (grievanceSignals >= 2) {
          return {
            state: stateLabel,
            label: "White Grievance Voter",
            confidence: grievanceSignals === 3 ? "high" : "medium",
            anchor,
            reasonCodes: ["racial_anchor", "white_demographic_match", "status_threat_pattern"],
            gate
          };
        }
        return {
          state: "unresolved",
          confidence: "low",
          anchor,
          reasonCodes: ["racial_anchor", "white_demographic_match", "insufficient_grievance_signal"],
          gate
        };
      }
      return {
        state: "unresolved",
        confidence: "low",
        anchor,
        reasonCodes: ["racial_anchor", "missing_or_nonresolving_race_demographic"],
        gate
      };
    }
    if (anchor === "religious") {
      const religion = typeof demographics?.demo_religion === "string" ? demographics.demo_religion : "";
      if (religion === "christian") {
        return {
          state: stateLabel,
          label: "Evangelical Voter",
          confidence: passedActive ? "medium" : "low",
          anchor,
          reasonCodes: ["religious_anchor", "christian_demographic_match"],
          gate
        };
      }
      return {
        state: "unresolved",
        confidence: "low",
        anchor,
        reasonCodes: ["religious_anchor", "missing_or_non_evangelical_religion_detail"],
        gate
      };
    }
    if (anchor === "sexual") {
      const lgbtq = typeof demographics?.demo_lgbtq === "string" ? demographics.demo_lgbtq : "";
      if (lgbtq === "yes") {
        return {
          state: stateLabel,
          label: "LGBTQ Voter",
          confidence: passedActive ? "high" : "medium",
          anchor,
          reasonCodes: ["sexual_anchor", "lgbtq_demographic_match"],
          gate
        };
      }
      return {
        state: "unresolved",
        confidence: "low",
        anchor,
        reasonCodes: ["sexual_anchor", "missing_or_non_lgbtq_demographic"],
        gate
      };
    }
    if (anchor === "gender") {
      const gender = typeof demographics?.demo_gender === "string" ? demographics.demo_gender : "";
      if (gender === "female") {
        const feministSignals = Number(cd <= 2.5) + Number(mor >= 3.5) + Number(onts >= 3.5);
        if (feministSignals >= 2) {
          return {
            state: stateLabel,
            label: "Feminist Voter",
            confidence: feministSignals === 3 ? "high" : "medium",
            anchor,
            reasonCodes: ["gender_anchor", "female_demographic_match", "progressive_gender_pattern"],
            gate
          };
        }
        return {
          state: "unresolved",
          confidence: "low",
          anchor,
          reasonCodes: ["gender_anchor", "female_demographic_match", "insufficient_feminist_signal"],
          gate
        };
      }
      if (gender === "male") {
        const grievanceSignals = Number(zs >= 3.5) + Number(cd >= 3.5) + Number(onts <= 2.5);
        if (grievanceSignals >= 2) {
          return {
            state: stateLabel,
            label: "Male Grievance Voter",
            confidence: grievanceSignals === 3 ? "high" : "medium",
            anchor,
            reasonCodes: ["gender_anchor", "male_demographic_match", "status_threat_pattern"],
            gate
          };
        }
        return {
          state: "unresolved",
          confidence: "low",
          anchor,
          reasonCodes: ["gender_anchor", "male_demographic_match", "insufficient_grievance_signal"],
          gate
        };
      }
      return {
        state: "unresolved",
        confidence: "low",
        anchor,
        reasonCodes: ["gender_anchor", "missing_or_nonresolving_gender_demographic"],
        gate
      };
    }
    return {
      state: "unresolved",
      confidence: "low",
      anchor,
      reasonCodes: ["identity_pattern_detected_but_anchor_not_yet_resolvable"],
      gate
    };
  }

  // src/engine/engagementLabel.ts
  var APOLITICAL_MAX = 2;
  var CASUAL_MAX = 3;
  var ENGAGED_MAX = 4;
  var SALIENCE_LOW_MAX = 1;
  var SALIENCE_MEDIUM_MAX = 2;
  function expectedPos(posDist) {
    return (posDist[0] ?? 0) * 1 + (posDist[1] ?? 0) * 2 + (posDist[2] ?? 0) * 3 + (posDist[3] ?? 0) * 4 + (posDist[4] ?? 0) * 5;
  }
  function expectedSal2(salDist) {
    return (salDist[0] ?? 0) * 0 + (salDist[1] ?? 0) * 1 + (salDist[2] ?? 0) * 2 + (salDist[3] ?? 0) * 3;
  }
  function levelForPosition(pos) {
    if (pos < APOLITICAL_MAX) return "apolitical";
    if (pos < CASUAL_MAX) return "casual";
    if (pos < ENGAGED_MAX) return "engaged";
    return "highly-engaged";
  }
  function salienceForPosition(sal) {
    if (sal < SALIENCE_LOW_MAX) return "low";
    if (sal < SALIENCE_MEDIUM_MAX) return "medium";
    return "high";
  }
  function computeEngagementLabel(state) {
    const eng = state.continuous.ENG;
    const position = eng ? expectedPos(eng.posDist) : 3;
    const saliencePosition = eng ? expectedSal2(eng.salDist) : 1.5;
    return {
      level: levelForPosition(position),
      salience: salienceForPosition(saliencePosition),
      position,
      saliencePosition
    };
  }

  // src/engine/respondentSignature.ts
  function expectedContinuousPos(dist) {
    let e = 0;
    for (let i = 0; i < 5; i++) e += (dist[i] ?? 0) * (i + 1);
    return e;
  }
  function expectedCategoricalIndex(dist) {
    let e = 0;
    for (let i = 0; i < 6; i++) e += (dist[i] ?? 0) * i;
    return e;
  }
  function expectedSalience(dist) {
    let e = 0;
    for (let i = 0; i < 4; i++) e += (dist[i] ?? 0) * i;
    return e;
  }
  function respondentSignatureFromState(state) {
    const sig = {};
    for (const [nodeId, node] of Object.entries(state.continuous)) {
      sig[nodeId] = {
        pos: expectedContinuousPos(node.posDist),
        sal: expectedSalience(node.salDist)
      };
    }
    for (const [nodeId, node] of Object.entries(state.categorical)) {
      sig[nodeId] = {
        pos: expectedCategoricalIndex(node.catDist),
        sal: expectedSalience(node.salDist)
      };
    }
    return sig;
  }

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
        ONT_S: 4,
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
        ONT_S: 4,
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
        ONT_S: 4,
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
        ONT_S: 2,
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
        ONT_S: 2,
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
        ONT_S: 5,
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
        ONT_S: 4,
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
        ONT_S: 5,
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
        ONT_S: 4,
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
        ONT_S: 5,
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
        ONT_S: 4,
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
        ONT_S: 5,
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
        ONT_S: 4,
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
        ONT_S: 5,
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
        ONT_S: 5,
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
        ONT_S: 2,
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
        ONT_S: 5,
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
        ONT_S: 5,
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
        ONT_S: 2,
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
        ONT_S: 5,
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
        ONT_S: 2,
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
        ONT_S: 5,
        PF: 5,
        TRB: 2,
        ENG: 5,
        EPS: 1,
        AES: 0
      },
      {
        // William Wirt - Anti-Masonic Party (7.8%)
        // First significant third-party candidate. Former Attorney General.
        // Anti-Masonic movement opposed secret societies as anti-democratic.
        // Irony: Wirt himself was a former Mason. Party was really anti-Jackson.
        name: "Wirt",
        party: "Independent",
        year: 1832,
        MAT: 3,
        // Centrist economics - not the issue
        CD: 4,
        // Culturally conservative - religious moralism, anti-secret-society
        CU: 2,
        // Particularist - focused on American civic institutions
        MOR: 4,
        // Wide moral circle - democratic transparency for all citizens
        PRO: 5,
        // Maximum proceduralist - transparency, rule of law, anti-corruption
        COM: 3,
        // Mixed
        ZS: 3,
        // Mixed
        ONT_H: 3,
        // Moderate
        ONT_S: 2,
        // System corrupted by secret societies but reformable
        PF: 1,
        // Anti-partisan - new third party against establishment
        TRB: 3,
        // Moderate tribal - civic reformers
        ENG: 4,
        // Engaged reform movement
        EPS: 1,
        // Institutionalist - fix corrupted institutions
        AES: 0
        // Statesman - former Attorney General
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
        ONT_S: 2,
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
        ONT_S: 5,
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
        ONT_S: 5,
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
        ONT_S: 4,
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
        ONT_S: 2,
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
        ONT_S: 1,
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
        ONT_S: 4,
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
        ONT_S: 5,
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
        ONT_S: 5,
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
        ONT_S: 1,
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
        ONT_S: 4,
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
        ONT_S: 2,
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
        ONT_S: 5,
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
        ONT_S: 2,
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
        ONT_S: 4,
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
        ONT_S: 2,
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
        ONT_S: 4,
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
        ONT_S: 2,
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
        ONT_S: 5,
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
        ONT_S: 4,
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
        ONT_S: 4,
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
        ONT_S: 4,
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
        ONT_S: 4,
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
        ONT_S: 4,
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
        ONT_S: 4,
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
        ONT_S: 5,
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
        ONT_S: 1,
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
        ONT_S: 5,
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
        ONT_S: 1,
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
        ONT_S: 5,
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
        ONT_S: 1,
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
      },
      {
        // Eugene V. Debs - Socialist Party (2.8%)
        // Labor organizer, founded IWW. Ran on public ownership of railroads,
        // mines, utilities. First serious socialist candidacy.
        name: "Debs",
        party: "Independent",
        year: 1900,
        MAT: 1,
        // Maximum redistribution - public ownership of means of production
        CD: 1,
        // Maximum cultural openness - racial equality, women's suffrage
        CU: 5,
        // Maximum universalist - international workers' solidarity
        MOR: 5,
        // Widest moral circle - all workers, all races, all nations
        PRO: 1,
        // Anti-proceduralist - capitalist system is rigged
        COM: 1,
        // Never compromise - revolutionary, not reformist
        ZS: 5,
        // Maximum zero-sum - class war, capital exploits labor
        ONT_H: 5,
        // Maximum perfectibility - socialist utopia achievable
        ONT_S: 1,
        // System completely broken - capitalism must be replaced
        PF: 1,
        // Anti-partisan - rejected both capitalist parties
        TRB: 5,
        // Maximum tribal - working class identity
        ENG: 5,
        // Maximum engagement - tireless organizer
        EPS: 0,
        // Empiricist - studied labor conditions, data on exploitation
        AES: 5
        // Visionary - prophetic socialist rhetoric
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
        ONT_S: 5,
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
      },
      {
        // Eugene V. Debs - Socialist Party (3.0%)
        // Second run. Growing socialist movement. TR's progressivism stole some
        // thunder but Debs held the radical flank: public ownership, not regulation.
        name: "Debs",
        party: "Independent",
        year: 1904,
        MAT: 1,
        // Maximum redistribution - public ownership
        CD: 1,
        // Maximum cultural openness - racial equality, women's suffrage
        CU: 5,
        // Maximum universalist - international solidarity
        MOR: 5,
        // Widest moral circle
        PRO: 1,
        // Anti-proceduralist - system is rigged by capital
        COM: 1,
        // Never compromise
        ZS: 5,
        // Maximum zero-sum - class war
        ONT_H: 5,
        // Maximum perfectibility
        ONT_S: 1,
        // System broken - capitalism must go
        PF: 1,
        // Anti-partisan
        TRB: 5,
        // Maximum tribal - worker class identity
        ENG: 5,
        // Maximum engagement
        EPS: 0,
        // Empiricist
        AES: 5
        // Visionary
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
        ONT_S: 4,
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
        ONT_S: 2,
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
      },
      {
        // Eugene V. Debs - Socialist Party (2.8%)
        // Third run. IWW founded 1905. Socialist movement growing but Bryan
        // absorbed much of the populist energy with his progressive turn.
        name: "Debs",
        party: "Independent",
        year: 1908,
        MAT: 1,
        // Maximum redistribution - public ownership
        CD: 1,
        // Maximum cultural openness
        CU: 5,
        // Maximum universalist - international solidarity
        MOR: 5,
        // Widest moral circle
        PRO: 1,
        // Anti-proceduralist
        COM: 1,
        // Never compromise
        ZS: 5,
        // Maximum zero-sum - class war
        ONT_H: 5,
        // Maximum perfectibility
        ONT_S: 1,
        // System broken
        PF: 1,
        // Anti-partisan
        TRB: 5,
        // Maximum tribal - worker identity
        ENG: 5,
        // Maximum engagement
        EPS: 0,
        // Empiricist
        AES: 5
        // Visionary
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
        ONT_S: 2,
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
        ONT_S: 2,
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
        ONT_S: 5,
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
      },
      {
        // Eugene V. Debs - Socialist Party (6.0%)
        // Peak vote share. Four-way race split mainstream vote. Socialist movement
        // at zenith - over 1,000 elected officials. "Vote for what you want."
        name: "Debs",
        party: "Independent",
        year: 1912,
        MAT: 1,
        // Maximum redistribution - public ownership
        CD: 1,
        // Maximum cultural openness
        CU: 5,
        // Maximum universalist - international solidarity
        MOR: 5,
        // Widest moral circle
        PRO: 1,
        // Anti-proceduralist
        COM: 1,
        // Never compromise
        ZS: 5,
        // Maximum zero-sum - class war
        ONT_H: 5,
        // Maximum perfectibility
        ONT_S: 1,
        // System broken
        PF: 1,
        // Anti-partisan - rejected both capitalist parties
        TRB: 5,
        // Maximum tribal - worker identity
        ENG: 5,
        // Maximum engagement
        EPS: 0,
        // Empiricist
        AES: 5
        // Visionary - "while there is a lower class, I am in it"
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
        ONT_S: 5,
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
      },
      {
        // Allan L. Benson - Socialist Party (3.2%)
        // Journalist, not organizer like Debs. Won nomination because Debs
        // declined. Main platform: national referendum before declaring war.
        // Anti-war was his defining issue as Europe burned.
        name: "Benson",
        party: "Independent",
        year: 1916,
        MAT: 1,
        // Maximum redistribution - socialist economics
        CD: 1,
        // Maximum cultural openness - progressive
        CU: 5,
        // Maximum universalist - anti-war internationalist
        MOR: 5,
        // Widest moral circle - war is immoral
        PRO: 1,
        // Anti-proceduralist - wanted referendum to bypass Congress on war
        COM: 1,
        // Never compromise - absolutist pacifist-socialist
        ZS: 5,
        // Maximum zero-sum - class war, war profiteers vs workers
        ONT_H: 4,
        // Optimistic - but less charismatic than Debs
        ONT_S: 1,
        // System broken - capitalism produces war
        PF: 1,
        // Anti-partisan
        TRB: 4,
        // High tribal - worker identity, but less personal than Debs
        ENG: 3,
        // Moderate - journalist, not mass organizer
        EPS: 0,
        // Empiricist - journalist, studied issues
        AES: 5
        // Visionary - anti-war idealism
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
        ONT_S: 4,
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
        ONT_S: 1,
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
      },
      {
        // Eugene V. Debs - Socialist Party (3.4%)
        // Ran from federal prison (convicted under Espionage Act for anti-war
        // speech). Convict No. 9653. Maximum martyrdom. "While there is a soul
        // in prison, I am not free."
        name: "Debs",
        party: "Independent",
        year: 1920,
        MAT: 1,
        // Maximum redistribution - public ownership
        CD: 1,
        // Maximum cultural openness
        CU: 5,
        // Maximum universalist - anti-war, international solidarity
        MOR: 5,
        // Widest moral circle
        PRO: 1,
        // Anti-proceduralist - imprisoned by the system he fought
        COM: 1,
        // Never compromise - went to prison rather than recant
        ZS: 5,
        // Maximum zero-sum - class war intensified by WWI profiteering
        ONT_H: 5,
        // Maximum perfectibility
        ONT_S: 1,
        // System broken - jailed for speech, Red Scare, Palmer Raids
        PF: 1,
        // Anti-partisan
        TRB: 5,
        // Maximum tribal - worker/prisoner solidarity
        ENG: 5,
        // Maximum engagement - ran from prison cell
        EPS: 0,
        // Empiricist
        AES: 5
        // Visionary - ultimate martyr-prophet figure
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
        ONT_S: 5,
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
        ONT_S: 2,
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
        ONT_S: 1,
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
        ONT_S: 4,
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
        ONT_S: 2,
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
        ONT_S: 1,
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
        ONT_S: 5,
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
        ONT_S: 1,
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
        ONT_S: 5,
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
        // System-trusting - government as solution within a basically workable system
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
        // System-working worldview - free enterprise basically works; government intervention is the problem
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
        // System-trusting - government as effective war machine and safety net
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
        // Strong system-working confidence
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
        // Strong system-working confidence - stable management, less government
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
        // Deep structural grievance - federal overreach is destroying the southern way of life
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
      },
      {
        // Henry A. Wallace - Progressive Party (2.4%)
        // FDR's VP 1941-45, Secretary of Commerce. Left Democrats over Cold War
        // hawkishness. Pro-Soviet accommodation, anti-nuclear, pro-civil rights,
        // pro-labor. "Century of the Common Man." Badly Red-baited.
        name: "H. Wallace",
        party: "Independent",
        year: 1948,
        MAT: 1,
        // Maximum redistribution - extend New Deal further, full employment
        CD: 1,
        // Maximum cultural openness - pro-civil rights, anti-segregation
        CU: 5,
        // Maximum universalist - peace with USSR, international cooperation
        MOR: 5,
        // Widest moral circle - all peoples, all nations, anti-nuclear
        PRO: 2,
        // Anti-proceduralist - wanted dramatic policy changes, bypass Cold War consensus
        COM: 1,
        // Never compromise - wouldn't moderate pro-Soviet stance despite Red-baiting
        ZS: 1,
        // Maximum positive-sum - cooperation with everyone including Soviets
        ONT_H: 5,
        // Maximum optimistic - believed peace and prosperity for all possible
        ONT_S: 2,
        // Structuralist - Cold War militarism is wrong path, system needs redirection
        PF: 1,
        // Anti-partisan - left Democratic Party
        TRB: 3,
        // Moderate tribal - broad progressive coalition
        ENG: 5,
        // Maximum engagement - launched third party, toured extensively
        EPS: 0,
        // Empiricist - former Sec. of Agriculture, scientific farmer, data-driven
        AES: 5
        // Visionary - "Century of the Common Man," prophetic rhetoric
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
        // System-working / preserve-and-manage orientation
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
        // System-trusting reformism - government as instrument of large-scale improvement
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
        // Strong system-working confidence - prosperity, peace, stability
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
        // System-trusting reformism - "New America" through public action
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
        // System-working / individual-responsibility leaning
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
        // System-trusting - systemic programs within a workable order
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
        // Maximum system-working / anti-systemic critique - minimal government
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
        // System-working / personal-responsibility rhetoric
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
        // System-trusting reformism - government programs
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
        // System-working with paternalist streak
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
        // Maximum system-trusting - large-scale institutional action
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
        // Strong system-working confidence — pardoned Nixon to "move on," nothing fundamentally broken
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
        // Moderately system-working / anti-government rhetoric, but not deep system-broken critique
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
        // System-working / individual-responsibility leaning - but not extreme
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
        // Maximum system-trusting institutionalism - big-government liberal image
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
        // System-working / individual-responsibility leaning
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
        // System-trusting - government solutions
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
        // System-working / individual-responsibility leaning
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
        // System-working / business-oriented
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
        // System-working / individual-responsibility leaning
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
      },
      {
        // Ross Perot - Reform Party (8.4%)
        // Second run. Less novelty, less support (18.9% → 8.4%). Same message:
        // deficit, NAFTA bad, outsider. Reform Party now formal. Excluded from
        // debates unlike 1992.
        name: "Perot",
        party: "Independent",
        year: 1996,
        MAT: 4,
        // Fiscally conservative - deficit hawk, balanced budget
        CD: 3,
        // Moderate - populist center
        CU: 2,
        // Particularist - anti-NAFTA, protect American jobs
        MOR: 3,
        // Moderate
        PRO: 3,
        // Mixed - pragmatic businessman
        COM: 2,
        // Low compromise - outsider, won't play the game
        ZS: 4,
        // Zero-sum on trade
        ONT_H: 3,
        // Moderate
        ONT_S: 2,
        // System corrupted by establishment insiders
        PF: 1,
        // Maximum independent
        TRB: 2,
        // Anti-establishment, low tribal
        ENG: 3,
        // Less engaged than 1992 - less novelty, excluded from debates
        EPS: 0,
        // Empiricist - charts, data, infomercials
        AES: 1
        // Technocrat - businessman with spreadsheets
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
        // System-working / "ownership society"
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
      },
      {
        name: "Nader",
        party: "Independent",
        year: 2e3,
        MAT: 1,
        // Maximum redistribution - corporate power, consumer protection
        CD: 3,
        // Culturally moderate - dismissed identity politics as corporate distraction, consumer focus
        CU: 5,
        // Maximum universalist - global justice, anti-corporate globalization, one-world
        MOR: 4,
        // Wide moral circle - environment, consumers, workers, global poor
        PRO: 1,
        // Anti-proceduralist - "two-party duopoly," system is rigged
        COM: 1,
        // Never compromise - rejected lesser-evil voting entirely
        ZS: 5,
        // Maximum zero-sum - corporations vs people, winner-take-all corporate power
        ONT_H: 5,
        // Maximum perfectibility - utopian green idealist, humans can live sustainably
        ONT_S: 1,
        // System broken - "two parties, same corporate masters"
        PF: 1,
        // Anti-partisan - ran against both parties
        TRB: 1,
        // Anti-tribal - pure individual crusader, no group identity politics
        ENG: 5,
        // Maximum engagement - decades of tireless activism, consumer crusader
        EPS: 0,
        // Empiricist - data on corporate malfeasance, safety research, evidence-driven
        AES: 3
        // Authentic - rumpled, sincere, no polish
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
        // Moderately system-working - defended institutions and continuity
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
        // System-working / individual-responsibility leaning - personal responsibility
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
        // Maximum system-working / anti-structural critique - "47%," self-reliance
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
        // Moderately system-working posture with personalized grievance rhetoric - "I alone can fix it"
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
        // System-trusting reformism - policy proposals, systemic
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
      },
      {
        name: "Johnson",
        party: "Independent",
        year: 2016,
        MAT: 5,
        // Maximum free-market - eliminate income tax, slash regulation
        CD: 1,
        // Maximum cultural openness - legalize marijuana, gay marriage early
        CU: 1,
        // Maximum non-interventionist - pull out of everywhere, isolationist
        MOR: 1,
        // Maximum individualist - only individual rights matter, no collective obligations
        PRO: 1,
        // Maximum anti-proceduralist - abolish IRS, FDA, EPA, entire departments
        COM: 1,
        // Never compromise - libertarian purity, wouldn't moderate positions
        ZS: 1,
        // Maximum positive-sum - free trade, voluntary exchange
        ONT_H: 5,
        // Maximum optimistic - libertarian utopianism, free markets solve everything
        ONT_S: 1,
        // System broken - government is fundamentally the problem, abolish departments
        PF: 1,
        // Anti-partisan - explicitly third-party
        TRB: 1,
        // Anti-tribal - individualist, anti-identity politics
        ENG: 2,
        // Low engagement - "what is Aleppo?", barely campaigned seriously
        EPS: 0,
        // Empiricist - pragmatic, evidence-based governor
        AES: 3
        // Authentic - unpolished, mountain climber, casual
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
        // Moderately system-working - defender of institutions and continuity
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
        // Deep structural grievance - "drain the swamp," system felt rigged/broken
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
        // Deep structural grievance - "system is rigged"
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
        // Mixed / ambiguous system diagnosis
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

  // src/historical/contexts-1789-1852.ts
  var context1789 = {
    year: 1789,
    zeitgeist: {
      era: "founding",
      nodeWeights: { PRO: 2.5, ONT_H: 1.8, ONT_S: 5.5, COM: 2, ENG: 1.5 },
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
      nodeWeights: { PF: 2, ONT_S: 4, CD: 1.8, MAT: 1.5, TRB: 1.5, CU: 1.5 },
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
        activationNodes: { ONT_S: 5.5, CU: 1.5, ONT_H: 1.3, PF: 1.3 },
        novelty: 1.5,
        threatActivation: { CD: 1.5, PRO: 1.3 }
      },
      {
        candidateName: "Adams",
        activationNodes: { PRO: 1.3, CD: 1.5, MAT: 1.2 },
        novelty: 1,
        threatActivation: { ONT_S: 5.5, CU: 1.3 }
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
      nodeWeights: { MAT: 2, ONT_S: 5.5, ZS: 1.5, CU: 1.3 },
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
      nodeWeights: { ZS: 2.5, TRB: 2, ONT_S: 5.8, ENG: 1.5, MAT: 1.3 },
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
        threatActivation: { ONT_S: 5.3 }
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
      nodeWeights: { PF: 1.8, TRB: 1.5, ONT_S: 5.5, MAT: 1.5, ENG: 1.3 },
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
        activationNodes: { TRB: 1.5, ONT_S: 5.5, ENG: 1.5 },
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
      nodeWeights: { TRB: 2, ONT_S: 4, PF: 2, ENG: 1.8, MAT: 1.5, ONT_H: 1.3 },
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
        activationNodes: { TRB: 1.8, ONT_S: 5.5, ENG: 1.5, PF: 1.3 },
        novelty: 1.8,
        threatActivation: { PRO: 1.5, COM: 1.3 }
      },
      {
        candidateName: "Adams",
        activationNodes: { PRO: 1.3, MAT: 1.2 },
        novelty: 0.8,
        threatActivation: { ONT_S: 5.3, TRB: 1.3 }
      }
    ]
  };
  var context1832 = {
    year: 1832,
    zeitgeist: {
      era: "jacksonian",
      nodeWeights: { MAT: 2.5, ONT_S: 4, TRB: 1.8, PF: 1.8, PRO: 1.5 },
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
        activationNodes: { MAT: 1.5, ONT_S: 5.5, TRB: 1.3, ENG: 1.3 },
        novelty: 1.3,
        threatActivation: { PRO: 1.5, COM: 1.3 }
      },
      {
        candidateName: "Clay",
        activationNodes: { MAT: 1.5, PRO: 1.5, COM: 1.3 },
        novelty: 1,
        threatActivation: { ONT_S: 5.3, TRB: 1.2 }
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
      nodeWeights: { MAT: 2.5, ONT_S: 4.5, TRB: 2, ENG: 2, ZS: 1.5 },
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
        activationNodes: { ONT_S: 5.5, TRB: 1.5, ENG: 1.5, MAT: 1.3 },
        novelty: 1.3,
        threatActivation: { MAT: 1.3 }
      },
      {
        candidateName: "Van Buren",
        activationNodes: { PF: 1.3, COM: 1.2 },
        novelty: 0.8,
        threatActivation: { ONT_S: 5.5, MAT: 1.3 }
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
      nodeWeights: { MOR: 2, TRB: 1.8, CU: 1.5, ONT_S: 5.5, ZS: 1.3 },
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
        activationNodes: { MOR: 1.8, ONT_S: 5.5, ENG: 1.3, CU: 1.3 },
        novelty: 1.3,
        threatActivation: { TRB: 1.3, PF: 1.2 }
      }
    ]
  };
  var context1852 = {
    year: 1852,
    zeitgeist: {
      era: "jacksonian",
      nodeWeights: { MOR: 1.8, COM: 1.5, PF: 1.5, TRB: 1.5, ONT_S: 5.3 },
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
      nodeWeights: { MOR: 1.8, TRB: 1.8, CD: 1.5, CU: 1.5, ONT_S: 5.5, COM: 1.3 },
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
        threatActivation: { ONT_S: 5.2 }
      },
      {
        candidateName: "Fremont",
        activationNodes: { MOR: 1.5, CU: 1.4, ONT_S: 5.3 },
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
      nodeWeights: { MOR: 2, TRB: 2, ONT_S: 4, CD: 1.8, CU: 1.5, ZS: 1.5 },
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
      nodeWeights: { MOR: 2.5, ZS: 2, TRB: 2, ONT_S: 4, ENG: 1.8, CD: 1.5 },
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
        activationNodes: { MOR: 1.8, ENG: 1.5, ONT_S: 5.4, CU: 1.3 },
        novelty: 1.5,
        threatActivation: { ZS: 1.3, TRB: 1.3 }
      },
      {
        candidateName: "McClellan",
        activationNodes: { COM: 1.3, PRO: 1.4, ZS: 1.2 },
        novelty: 1,
        threatActivation: { MOR: 1.5, ONT_S: 5.4 }
      }
    ]
  };
  var context1868 = {
    year: 1868,
    zeitgeist: {
      era: "civil-war",
      nodeWeights: { MOR: 2, TRB: 2, CD: 1.8, CU: 1.5, ONT_S: 5.5, ZS: 1.5 },
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
        threatActivation: { MOR: 1.5, CU: 1.4, ONT_S: 5.3 }
      }
    ]
  };
  var context1872 = {
    year: 1872,
    zeitgeist: {
      era: "reconstruction",
      nodeWeights: { PRO: 1.5, MOR: 1.3, ONT_S: 5.3, COM: 1.3, PF: 0.7 },
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
        activationNodes: { COM: 1.5, PRO: 1.4, ONT_H: 1.3, ONT_S: 5.3 },
        novelty: 1.3,
        threatActivation: { MOR: 1.2 }
      }
    ]
  };
  var context1876 = {
    year: 1876,
    zeitgeist: {
      era: "reconstruction",
      nodeWeights: { PRO: 1.8, ONT_S: 5.5, MOR: 1.3, COM: 1.3, PF: 1.3 },
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
        activationNodes: { PRO: 1.5, ONT_S: 5.3 },
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
      nodeWeights: { MAT: 1.8, ONT_S: 5.8, ZS: 1.5, TRB: 1.5, ENG: 1.3, MOR: 0.6 },
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
        activationNodes: { ONT_S: 5.6, ZS: 1.5, TRB: 1.5, MAT: 1.4, ENG: 1.4 },
        novelty: 1.5,
        threatActivation: { MAT: 1.3, ONT_S: 5.3 }
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
        threatActivation: { ONT_S: 5.3 }
      },
      {
        candidateName: "Bryan",
        activationNodes: { ONT_S: 5.3, TRB: 1.2 },
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
      nodeWeights: { ONT_S: 5.5, MAT: 1.5, MOR: 1.3, ONT_H: 1.3, PRO: 0.7 },
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
        activationNodes: { ONT_S: 5.4, MOR: 1.4, ENG: 1.5, ONT_H: 1.3 },
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
      nodeWeights: { ONT_S: 5.5, MAT: 1.5, PRO: 1.3, ONT_H: 1.3, TRB: 0.6 },
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
        activationNodes: { ONT_S: 5.4, MAT: 1.3, MOR: 1.3, ENG: 1.3 },
        novelty: 1
      }
    ]
  };
  var context1912 = {
    year: 1912,
    zeitgeist: {
      era: "progressive",
      nodeWeights: { ONT_S: 4, MAT: 1.8, ONT_H: 1.8, MOR: 1.5, PF: 1.5, ENG: 1.5 },
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
        activationNodes: { ONT_S: 5.4, MAT: 1.3, MOR: 1.3, PRO: 1.2 },
        novelty: 1.3
      },
      {
        candidateName: "Roosevelt",
        activationNodes: { ONT_S: 5.6, MOR: 1.6, ONT_H: 1.5, ENG: 1.5, MAT: 1.3 },
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
      nodeWeights: { ZS: 1.8, CU: 1.5, MAT: 1.5, TRB: 1.3, ONT_S: 5.3 },
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
        activationNodes: { MAT: 1.3, MOR: 1.3, CU: 1.2, ONT_S: 5.2 },
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
      nodeWeights: { MAT: 1.3, ONT_S: 5.4, PF: 0.7 },
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
        activationNodes: { MAT: 1.5, ONT_S: 5.6, COM: 0.7, PF: 0.7 },
        novelty: 1.5,
        threatActivation: { MAT: 1.3, ONT_S: 5.3 }
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
      nodeWeights: { MAT: 2.5, ONT_S: 4, ZS: 1.5, ONT_H: 1.5, ENG: 1.3 },
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
        activationNodes: { MAT: 1.5, ONT_S: 5.5, ONT_H: 1.5, ENG: 1.4 },
        novelty: 1.8,
        threatActivation: { MAT: 1.2 }
      },
      {
        candidateName: "Hoover",
        activationNodes: { PRO: 1.3, MAT: 1.2 },
        novelty: 0.8,
        threatActivation: { MAT: 1.5, ONT_S: 5.5 }
      }
    ]
  };
  var context1936 = {
    year: 1936,
    zeitgeist: {
      era: "new-deal",
      nodeWeights: { MAT: 2.2, ONT_S: 5.8, TRB: 1.5, PF: 1.5 },
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
        activationNodes: { MAT: 1.5, ONT_S: 5.4, TRB: 1.4, ENG: 1.3 },
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
      nodeWeights: { CU: 1.8, PRO: 1.5, ZS: 1.4, ONT_S: 5.3 },
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
        activationNodes: { CU: 1.4, MOR: 1.3, ONT_S: 5.2 },
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
      nodeWeights: { ZS: 1.6, CU: 1.4, TRB: 1.3, ONT_S: 5.2 },
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
      nodeWeights: { CD: 1.8, MOR: 1.6, MAT: 1.5, ONT_S: 5.5, COM: 1.4 },
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
        activationNodes: { MAT: 1.4, CD: 1.3, ONT_S: 5.3, COM: 1.3 },
        novelty: 1.2
      },
      {
        candidateName: "Goldwater",
        activationNodes: { MAT: 1.5, COM: 0.6, PRO: 1.3 },
        novelty: 1.5,
        threatActivation: { ZS: 1.5, CD: 1.4, MOR: 1.4, ONT_S: 5.3 }
      }
    ]
  };
  var context1968 = {
    year: 1968,
    zeitgeist: {
      era: "upheaval",
      nodeWeights: { CD: 2, ONT_S: 4, TRB: 1.8, ZS: 1.8 },
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
        activationNodes: { CD: 1.6, ZS: 1.5, TRB: 1.4, ONT_S: 5.3 },
        novelty: 1.3,
        threatActivation: { ONT_S: 5.3 }
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
        activationNodes: { CU: 1.5, MOR: 1.4, ONT_S: 5.4, ONT_H: 1.3 },
        novelty: 1.3,
        threatActivation: { CD: 1.5, MOR: 1.4, TRB: 1.3 }
      }
    ]
  };
  var context1976 = {
    year: 1976,
    zeitgeist: {
      era: "upheaval",
      nodeWeights: { PRO: 2, ONT_S: 5.6, PF: 1.3 },
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
        activationNodes: { PRO: 1.5, ONT_S: 5.3, PF: 0.7 },
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
      nodeWeights: { MAT: 1.8, ONT_S: 5.8, ZS: 1.5, CU: 1.4, ENG: 1.3 },
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
        activationNodes: { MAT: 1.4, ONT_H: 1.5, ONT_S: 5.3, ENG: 1.3 },
        novelty: 1.5,
        threatActivation: { MAT: 1.2 }
      },
      {
        candidateName: "Carter",
        activationNodes: { PRO: 1.2, CU: 1.2 },
        novelty: 0.8,
        threatActivation: { ONT_S: 5.3, MAT: 1.2 }
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
        activationNodes: { MAT: 1.3, ONT_S: 5.3, PRO: 1.2 },
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
      nodeWeights: { MAT: 1.8, ONT_S: 5.5, PF: 0.7, CU: 1.3 },
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
        activationNodes: { MAT: 1.3, ONT_S: 5.5, PF: 0.6, ZS: 1.4 },
        novelty: 1.5,
        threatActivation: { ONT_S: 5.2 }
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
      nodeWeights: { MAT: 2.2, ONT_S: 4, ONT_H: 1.5, ENG: 1.5, ZS: 1.3 },
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
        activationNodes: { ONT_H: 1.5, MAT: 1.3, ONT_S: 5.4, ENG: 1.5 },
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
      nodeWeights: { MAT: 1.5, ONT_S: 5.4, PF: 1.3, TRB: 1.3 },
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
        activationNodes: { MAT: 1.4, ONT_S: 5.2 },
        novelty: 1,
        threatActivation: { MAT: 1.3, ONT_S: 5.2 }
      }
    ]
  };
  var context2016 = {
    year: 2016,
    zeitgeist: {
      era: "polarization",
      nodeWeights: { CD: 2, TRB: 2, ONT_S: 5.8, ZS: 1.6, PF: 1.4, ENG: 1.4 },
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
        activationNodes: { CD: 1.6, TRB: 1.6, ONT_S: 5.5, ZS: 1.5, ENG: 1.4 },
        novelty: 1.8,
        threatActivation: { CD: 1.5, PRO: 1.5, MOR: 1.3, ONT_S: 5.3 }
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
      nodeWeights: { CD: 2, ONT_S: 4, PRO: 1.8, TRB: 1.8, MOR: 1.5, ENG: 1.5 },
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
        threatActivation: { PRO: 1.4, ONT_S: 5.3 }
      },
      {
        candidateName: "Trump",
        activationNodes: { CD: 1.5, TRB: 1.6, ONT_S: 5.5, ENG: 1.4 },
        novelty: 1.2,
        threatActivation: { PRO: 1.6, MOR: 1.4, CD: 1.5, ONT_S: 5.4 }
      }
    ]
  };
  var context2024 = {
    year: 2024,
    zeitgeist: {
      era: "polarization",
      nodeWeights: { PRO: 1.8, CD: 1.8, TRB: 1.8, ONT_S: 5.6, MAT: 1.5, ENG: 1.5 },
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
        activationNodes: { CD: 1.5, TRB: 1.6, ONT_S: 5.5, MAT: 1.3, ENG: 1.4 },
        novelty: 1.3,
        threatActivation: { PRO: 1.7, MOR: 1.4, CD: 1.4, ONT_S: 5.4 }
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

  // src/historical/era-activations.json
  var era_activations_default = {
    method: "PRISM era-activation map",
    generated: "2026-04-19",
    methodology: "Four independent LLM passes (two Claude Opus 4.7 instances, one ChatGPT, one additional pass) tagged each of 60 US presidential elections for PRISM-node activation. Calls converging at 4/4 or 3/4 were adopted directly. Contested calls (Tier C) were resolved by human judgment. See methodology notes for full provenance.",
    rubric: {
      activated: "Voters on opposite sides of this dimension sorted into opposite candidates' coalitions in a way that wouldn't happen in a typical election.",
      super_activated: "Vote choice was primarily organized around this dimension to the near-exclusion of other dimensions. Rare. Super-activated nodes also appear in the activated list.",
      multiplier_semantics: "activated node gets 2x multiplier on archetype's salience weight during Euclidean distance compute. super_activated gets 3x. Non-activated nodes use 1x (archetype's own salience)."
    },
    tier_legend: {
      A: "High confidence \u2014 4 of 4 or strong 3 of 4 LLM consensus",
      B: "Medium confidence \u2014 3 of 4 LLM consensus",
      C: "Contested among LLMs, resolved by human judgment"
    },
    summary_stats: {
      total_elections: 60,
      elections_with_any_activation: 32,
      elections_with_no_activation: 28,
      super_activation_count: 3,
      super_activation_years: [1860, 1896, 1932],
      nodes_that_never_activate: ["PF", "COM", "EPS", "AES", "ONT_H", "ZS"]
    },
    elections: {
      "1789": { activated: [], super_activated: [], tier: "A", notes: "Washington unanimous, no opposition." },
      "1792": { activated: [], super_activated: [], tier: "A", notes: "Washington re-elected unopposed." },
      "1796": { activated: ["PRO"], super_activated: [], tier: "B", notes: "First contested election; procedural/institutional sorting around federal power." },
      "1800": { activated: ["PRO", "MAT"], super_activated: [], tier: "B", notes: "Revolution of 1800 \u2014 federal power scope and Hamiltonian vs Jeffersonian economic program." },
      "1804": { activated: [], super_activated: [], tier: "A", notes: "Jefferson landslide ratification." },
      "1808": { activated: [], super_activated: [], tier: "A", notes: "Madison succession; Federalist collapse precluded sorting." },
      "1812": { activated: [], super_activated: [], tier: "C", notes: "War of 1812 election; war management drove votes but not a PRISM-dimension sort." },
      "1816": { activated: [], super_activated: [], tier: "A", notes: "Era of Good Feelings; no opposition." },
      "1820": { activated: [], super_activated: [], tier: "A", notes: "Monroe virtually unanimous." },
      "1824": { activated: [], super_activated: [], tier: "C", notes: "Multi-candidate splinter; regional and personality, not dimensional." },
      "1828": { activated: ["ONT_S", "TRB"], super_activated: [], tier: "C", notes: "Jacksonian realignment \u2014 anti-elite system critique and new tribal/regional coalition." },
      "1832": { activated: ["MAT"], super_activated: [], tier: "A", notes: "Bank War election; MAT was the organizing issue." },
      "1836": { activated: [], super_activated: [], tier: "A", notes: "Van Buren succession with Whig regional fragmentation." },
      "1840": { activated: ["MAT"], super_activated: [], tier: "C", notes: "Panic of 1837 depression drove economic sort; Log Cabin campaign was packaging." },
      "1844": { activated: ["CU"], super_activated: [], tier: "A", notes: "Texas annexation and Manifest Destiny \u2014 nationalist/territorial expansion." },
      "1848": { activated: ["MOR"], super_activated: [], tier: "B", notes: "Free Soil Party \u2014 explicit anti-slavery-extension sort." },
      "1852": { activated: [], super_activated: [], tier: "A", notes: "Whig collapse beginning; compromise-of-1850 aftermath suppressed dimensional sort." },
      "1856": { activated: ["MOR"], super_activated: [], tier: "A", notes: "Nascent Republican Party; slavery as moral issue emerging." },
      "1860": { activated: ["MOR", "TRB"], super_activated: ["MOR"], tier: "A", notes: "Slavery super-activated; sectional TRB alongside. Strongest consensus in dataset." },
      "1864": { activated: ["MOR"], super_activated: [], tier: "A", notes: "Emancipation and war-continuation as the sort." },
      "1868": { activated: ["MOR", "TRB"], super_activated: [], tier: "A", notes: "Reconstruction-era racial inclusion and sectional identity." },
      "1872": { activated: [], super_activated: [], tier: "A", notes: "Grant re-election; Liberal Republican defection was elite-level, not voter-level." },
      "1876": { activated: ["MOR"], super_activated: [], tier: "C", notes: "End of Reconstruction \u2014 federal enforcement of Black citizenship as sorting axis." },
      "1880": { activated: [], super_activated: [], tier: "A", notes: "Gilded-age tariff routine; no clean sort." },
      "1884": { activated: [], super_activated: [], tier: "B", notes: "Scandal-driven; narrow Mugwump defection on procedural integrity insufficient for voter-level sort." },
      "1888": { activated: ["MAT"], super_activated: [], tier: "A", notes: "Tariff was the defining issue; pure economic cleavage." },
      "1892": { activated: ["MAT"], super_activated: [], tier: "A", notes: "Tariff and silver; Populist Party emergence." },
      "1896": { activated: ["MAT"], super_activated: ["MAT"], tier: "A", notes: "Cross of Gold \u2014 MAT super-activated; textbook realigning election." },
      "1900": { activated: ["CU"], super_activated: [], tier: "A", notes: "Anti-imperialism and the Philippines; national-identity sort." },
      "1904": { activated: [], super_activated: [], tier: "A", notes: "TR landslide on personal popularity." },
      "1908": { activated: ["MAT"], super_activated: [], tier: "C", notes: "Progressive-era reform; Bryan's third run sorted on redistribution." },
      "1912": { activated: ["MAT"], super_activated: [], tier: "B", notes: "Four-way Progressive dispersion; economic regulation scale was the sort." },
      "1916": { activated: [], super_activated: [], tier: "B", notes: "He-Kept-Us-Out-Of-War; incumbency and foreign-policy ambiguity." },
      "1920": { activated: [], super_activated: [], tier: "C", notes: "Return to Normalcy \u2014 fatigue-repudiation, not dimensional sort." },
      "1924": { activated: [], super_activated: [], tier: "A", notes: "Coolidge prosperity; La Follette's progressive vote was residual not main axis." },
      "1928": { activated: ["CD", "TRB"], super_activated: [], tier: "A", notes: "Al Smith's Catholicism \u2014 ethno-religious and cultural-traditional sort." },
      "1932": { activated: ["MAT"], super_activated: ["MAT"], tier: "A", notes: "Great Depression realignment; MAT super-activated on economic catastrophe." },
      "1936": { activated: ["MAT"], super_activated: [], tier: "B", notes: "New Deal mandate; class-based realignment with FDR coalition consolidation." },
      "1940": { activated: [], super_activated: [], tier: "B", notes: "Third-term precedent and pre-war; Willkie's internationalism muted sorting." },
      "1944": { activated: [], super_activated: [], tier: "A", notes: "Wartime continuity; Dewey accepted New Deal framework." },
      "1948": { activated: ["MAT", "MOR"], super_activated: [], tier: "B", notes: "Fair Deal and civil-rights plank; Dixiecrat split activated MOR alongside economic sort." },
      "1952": { activated: [], super_activated: [], tier: "B", notes: "Korea and Eisenhower's personal credibility; not cleanly dimensional." },
      "1956": { activated: [], super_activated: [], tier: "A", notes: "Eisenhower peace-and-prosperity re-election." },
      "1960": { activated: [], super_activated: [], tier: "B", notes: "JFK-Nixon; religion and generation mattered but did not cleanly sort dimensionally." },
      "1964": { activated: ["MOR"], super_activated: [], tier: "A", notes: "Civil Rights Act; five Deep South states flipped on MOR." },
      "1968": { activated: ["CD", "TRB"], super_activated: [], tier: "B", notes: "Wallace/Nixon cultural and racial backlash; CD and TRB both activated; super is contested." },
      "1972": { activated: ["CD"], super_activated: [], tier: "A", notes: "McGovern and counterculture; Nixon 49-state landslide on CD axis." },
      "1976": { activated: ["PRO"], super_activated: [], tier: "A", notes: "Post-Watergate; procedural integrity as primary axis." },
      "1980": { activated: ["MAT", "ONT_S"], super_activated: [], tier: "A", notes: "Stagflation and Reagan realignment; economic and system-failure sort." },
      "1984": { activated: [], super_activated: [], tier: "A", notes: "Morning in America landslide; personality-plus-recovery, not dimensional." },
      "1988": { activated: [], super_activated: [], tier: "C", notes: "Bush-Dukakis; Willie Horton tactics did not reach voter-level dimensional sorting." },
      "1992": { activated: ["MAT", "ONT_S"], super_activated: [], tier: "A", notes: "It's the economy stupid; Perot's system-critique activated ONT_S alongside." },
      "1996": { activated: [], super_activated: [], tier: "A", notes: "Clinton triangulation; peace and prosperity, low sort." },
      "2000": { activated: [], super_activated: [], tier: "A", notes: "Compassionate conservatism blurred lines; narrow margins and procedural crisis came post-vote." },
      "2004": { activated: ["CU", "MOR"], super_activated: [], tier: "B", notes: "Post-9/11 War on Terror and values-voter gay-marriage referenda." },
      "2008": { activated: ["MAT", "ONT_S"], super_activated: [], tier: "A", notes: "Financial crisis and hope-and-change system-reform framing." },
      "2012": { activated: ["MAT"], super_activated: [], tier: "A", notes: "Obama-Romney; ACA and 47-percent framing sorted on redistribution." },
      "2016": { activated: ["CU", "ONT_S"], super_activated: [], tier: "C", notes: "Cosmopolitan-nationalist realignment and anti-system sentiment; super-activation was LLM-contested, resolved as activated-only." },
      "2020": { activated: ["PRO"], super_activated: [], tier: "C", notes: "Trump referendum; norm-violation framing as primary sort." },
      "2024": { activated: ["CU"], super_activated: [], tier: "B", notes: "Immigration and national-identity; inflation secondary and omitted from consensus." }
    }
  };

  // src/historical/era-activations.ts
  var CANONICAL_NODES = /* @__PURE__ */ new Set([
    "MAT",
    "CD",
    "CU",
    "MOR",
    "PRO",
    "COM",
    "EPS",
    "AES",
    "ZS",
    "ONT_H",
    "ONT_S",
    "PF",
    "TRB"
  ]);
  var MIN_YEAR = 1789;
  var MAX_YEAR = 2024;
  function loadAndValidate() {
    const parsed = era_activations_default;
    if (!parsed.elections || typeof parsed.elections !== "object") {
      throw new Error("era-activations.json: missing or malformed 'elections' map");
    }
    const out = {};
    for (const [yearStr, entry] of Object.entries(parsed.elections)) {
      if (!/^\d{4}$/.test(yearStr)) {
        throw new Error(`era-activations.json: key ${yearStr} is not a 4-digit year`);
      }
      const year = Number(yearStr);
      if (year < MIN_YEAR || year > MAX_YEAR) {
        throw new Error(`era-activations.json: year ${year} outside [${MIN_YEAR}, ${MAX_YEAR}]`);
      }
      if (!Array.isArray(entry.activated) || !Array.isArray(entry.super_activated)) {
        throw new Error(`era-activations.json: year ${year} missing activated/super_activated arrays`);
      }
      if (!["A", "B", "C"].includes(entry.tier)) {
        throw new Error(`era-activations.json: year ${year} has invalid tier ${entry.tier}`);
      }
      for (const n of entry.activated) {
        if (!CANONICAL_NODES.has(n)) {
          throw new Error(`era-activations.json: year ${year} activated contains non-canonical node '${n}'`);
        }
      }
      for (const n of entry.super_activated) {
        if (!CANONICAL_NODES.has(n)) {
          throw new Error(`era-activations.json: year ${year} super_activated contains non-canonical node '${n}'`);
        }
        if (!entry.activated.includes(n)) {
          throw new Error(`era-activations.json: year ${year} super_activated '${n}' missing from activated`);
        }
      }
      out[year] = entry;
    }
    return out;
  }
  var ERA_ACTIVATIONS = loadAndValidate();
  function getActivationMultiplier(year, nodeId) {
    const entry = ERA_ACTIVATIONS[year];
    if (!entry) return 1;
    if (entry.super_activated.includes(nodeId)) return 3;
    if (entry.activated.includes(nodeId)) return 2;
    return 1;
  }

  // src/historical/non-ideological-data.json
  var non_ideological_data_default = {
    _meta: {
      source: "PRISM non-ideological modifier layer",
      generated: "2026-04-19",
      description: "Per-election economic raw signal + incumbent-party attribution + per-candidate incumbency flag + cached charisma. Combined into a non-ideological modifier that nudges alignment distance, capped at \xB10.30.",
      formula: {
        composition: "non_ideo = 0.60 * economic_component + 0.20 * incumbency_component + 0.20 * charisma_component, clipped to [-0.30, +0.30]",
        application: "final_distance = ideological_distance - non_ideo  (subtracted; positive modifier helps the candidate)",
        component_bounds: {
          economic_component: "[-0.5, +0.5] \u2014 0.5 * raw_econ, sign flipped for non-incumbent-party candidates, zero for third-party",
          incumbency_component: "[0, +0.3] \u2014 +0.3 if sitting president running for re-election else 0",
          charisma_component: "[-0.5, +0.5] \u2014 (charisma - 3) / 4"
        }
      },
      economic_tiers: {
        quarterly_1948_plus: "raw_econ = 0.4*normalize(gdp_q2_annualized, 2.5, 2.5) + 0.3*normalize(-inflation_yoy, -2.5, 2.5) + 0.3*normalize(-unemp_delta, 0, 1.5)",
        annual_1929_1947: "raw_econ = 0.6*normalize(gdp_growth_pct, 2.5, 2.5) + 0.4*normalize(-unemp_delta, 0, 1.5)  \u2014 quarterly inflation series unreliable this era",
        binary_pre_1929: "major_panic=-0.4 (user-listed 1819/1837/1857/1873/1893/1907/1920), nber_recession=-0.2, normal=0, boom=+0.2",
        normalize_fn: "normalize(x, center, scale) = clip((x - center) / scale, -1, +1)"
      },
      incumbent_party_rules: {
        rule: "Party of the sitting president at time of election (Nov).",
        non_consecutive_comeback: "Cleveland_1892 and Trump_2024 are NOT flagged incumbent-person (both were out of office going in). Incumbent-party attribution still applies based on who was sitting (Harrison-R in 1892, Biden/Harris-D in 2024).",
        succession_incumbents: "TR 1904, Coolidge 1924, Truman 1948, LBJ 1964, Ford 1976 all counted as incumbent-person (succeeded, then ran).",
        andrew_johnson_1868: "Johnson was a War Democrat on Lincoln's National Union ticket. For 1868 attribution: incumbent party = Republican (Lincoln/R coalition held power since 1861; voters viewed Grant as continuation).",
        one_party_era_1820_1824: "Era of Good Feelings. 1820 and 1824 both D-R; attribution still applied per formula but all candidates share alignment.",
        tyler_1844_null: "Tyler was expelled by the Whigs in 1841 and governed without a party. 1844 incumbent_party set to null \u2014 modifier goes silent for that election rather than crediting/debiting Clay (Whig) or Polk (D) for Tyler's record."
      },
      known_gaps_and_caveats: [
        "Economic values for 1789-1928 are categorical approximations, not precise data. Judgment calls flagged in the notes for contested years.",
        "Economic values for 1929-1947 use annual data only per spec. Formula uses the election year's full-year GDP and the unemployment-rate change from prior year's average to election-year average. Subject to \xB10.2 error from rounding to one decimal.",
        "Economic values for 1948+ use Q2 GDP growth (SAAR), October CPI YoY, and (Oct election year - Oct prior year) unemployment delta. Subject to \xB10.1 error from revision-vintage differences between FRED current and contemporary estimates.",
        "1992 raw_econ \u2248 0 (formula doesn't capture 'jobless recovery' sentiment). 1956 raw_econ \u2248 0 (Q2 GDP was 0.1% but full-year was +2.1% \u2014 formula is Q2-anchored). These are known underweights; downstream consumers should not re-calibrate to force match with vote outcomes.",
        "Charisma values copied from results/candidate-signatures/consensus-final.json (2026-04-19 snapshot). If consensus-final.json is updated, re-run the build step."
      ]
    },
    elections: {
      "1789": { incumbent_party: null, raw_econ: 0, tier: "binary_pre_1929", tier_category: "normal", notes: "First election; no incumbent party. Post-Revolution recovery, debt restructuring beginning." },
      "1792": { incumbent_party: "Federalist", raw_econ: 0.2, tier: "binary_pre_1929", tier_category: "boom", notes: "Early expansion under Hamilton's financial system." },
      "1796": { incumbent_party: "Federalist", raw_econ: 0, tier: "binary_pre_1929", tier_category: "normal", notes: "Solid growth, no panic. Whiskey Rebellion resolved." },
      "1800": { incumbent_party: "Federalist", raw_econ: 0, tier: "binary_pre_1929", tier_category: "normal", notes: "Moderate growth." },
      "1804": { incumbent_party: "Democratic-Republican", raw_econ: 0.2, tier: "binary_pre_1929", tier_category: "boom", notes: "Louisiana Purchase era expansion." },
      "1808": { incumbent_party: "Democratic-Republican", raw_econ: -0.2, tier: "binary_pre_1929", tier_category: "nber_recession", notes: "Embargo Act (1807) caused severe contraction, especially New England. Deep recession but not on user's canonical major-panic list." },
      "1812": { incumbent_party: "Democratic-Republican", raw_econ: -0.2, tier: "binary_pre_1929", tier_category: "nber_recession", notes: "Embargo aftermath plus war just begun. Uncertainty-driven recession." },
      "1816": { incumbent_party: "Democratic-Republican", raw_econ: 0, tier: "binary_pre_1929", tier_category: "normal", notes: "Post-War of 1812 recovery; Era of Good Feelings beginning." },
      "1820": { incumbent_party: "Democratic-Republican", raw_econ: -0.4, tier: "binary_pre_1929", tier_category: "major_panic", notes: "Panic of 1819 ongoing. User-listed major panic." },
      "1824": { incumbent_party: "Democratic-Republican", raw_econ: 0, tier: "binary_pre_1929", tier_category: "normal", notes: "Recovery from Panic of 1819. One-party era (all candidates D-R factions)." },
      "1828": { incumbent_party: "National Republican", raw_econ: 0, tier: "binary_pre_1929", tier_category: "normal", notes: "Moderate expansion. JQ Adams incumbent (Nat-Rep faction)." },
      "1832": { incumbent_party: "Democratic", raw_econ: 0.2, tier: "binary_pre_1929", tier_category: "boom", notes: "Jackson's early era, expansion." },
      "1836": { incumbent_party: "Democratic", raw_econ: 0.2, tier: "binary_pre_1929", tier_category: "boom", notes: "Land speculation bubble (pre-Panic of 1837). Economy looked strong on election day." },
      "1840": { incumbent_party: "Democratic", raw_econ: -0.4, tier: "binary_pre_1929", tier_category: "major_panic", notes: "Panic of 1837 / 1839-43 depression ongoing. User-listed major panic." },
      "1844": { incumbent_party: null, raw_econ: 0, tier: "binary_pre_1929", tier_category: "normal", notes: "Recovery from 1837-43 depression. Tyler was expelled by the Whigs in 1841 and governed as a man without a party for three years. Setting incumbent_party: null so the modifier goes silent for 1844 rather than crediting/debiting Clay (Whig) or Polk (D) for Tyler's record. Both get economic_component = 0." },
      "1848": { incumbent_party: "Democratic", raw_econ: 0.2, tier: "binary_pre_1929", tier_category: "boom", notes: "California Gold Rush beginning; Mexican War ended." },
      "1852": { incumbent_party: "Whig", raw_econ: 0, tier: "binary_pre_1929", tier_category: "normal", notes: "Mild expansion." },
      "1856": { incumbent_party: "Democratic", raw_econ: 0.2, tier: "binary_pre_1929", tier_category: "boom", notes: "Pre-Panic of 1857 boom (railroads, Gold Rush wealth still circulating)." },
      "1860": { incumbent_party: "Democratic", raw_econ: -0.2, tier: "binary_pre_1929", tier_category: "nber_recession", notes: "Panic of 1857 aftermath plus secession crisis. Mild recession at election time." },
      "1864": { incumbent_party: "Republican", raw_econ: 0.2, tier: "binary_pre_1929", tier_category: "boom", notes: "Union war economy booming. Attribution: R/Lincoln administration." },
      "1868": { incumbent_party: "Republican", raw_econ: 0, tier: "binary_pre_1929", tier_category: "normal", notes: "Post-war Reconstruction. Andrew Johnson was a War Democrat but on Lincoln's ticket; attribution = R per user rule." },
      "1872": { incumbent_party: "Republican", raw_econ: 0.2, tier: "binary_pre_1929", tier_category: "boom", notes: "Pre-Panic of 1873 expansion." },
      "1876": { incumbent_party: "Republican", raw_econ: -0.4, tier: "binary_pre_1929", tier_category: "major_panic", notes: "Panic of 1873 / Long Depression 1873-79. User-listed major panic." },
      "1880": { incumbent_party: "Republican", raw_econ: 0, tier: "binary_pre_1929", tier_category: "normal", notes: "Recovery from Long Depression." },
      "1884": { incumbent_party: "Republican", raw_econ: -0.2, tier: "binary_pre_1929", tier_category: "nber_recession", notes: "1882-85 NBER contraction still active at election time." },
      "1888": { incumbent_party: "Democratic", raw_econ: 0, tier: "binary_pre_1929", tier_category: "normal", notes: "Recovery and expansion." },
      "1892": { incumbent_party: "Republican", raw_econ: 0, tier: "binary_pre_1929", tier_category: "normal", notes: "Expansion, but 1893 panic looming (not yet at election)." },
      "1896": { incumbent_party: "Democratic", raw_econ: -0.4, tier: "binary_pre_1929", tier_category: "major_panic", notes: "Panic of 1893 aftermath, depression bottom. User-listed major panic." },
      "1900": { incumbent_party: "Republican", raw_econ: 0, tier: "binary_pre_1929", tier_category: "normal", notes: "Expansion ending; Dec 1900 trough just ahead. Call it neutral at Nov election." },
      "1904": { incumbent_party: "Republican", raw_econ: -0.2, tier: "binary_pre_1929", tier_category: "nber_recession", notes: "1902-04 NBER contraction ended Aug 1904 \u2014 still fresh in voter memory at Nov election." },
      "1908": { incumbent_party: "Republican", raw_econ: -0.4, tier: "binary_pre_1929", tier_category: "major_panic", notes: "Panic of 1907 aftermath. User-listed major panic." },
      "1912": { incumbent_party: "Republican", raw_econ: -0.2, tier: "binary_pre_1929", tier_category: "nber_recession", notes: "1910-12 contraction just ended." },
      "1916": { incumbent_party: "Democratic", raw_econ: 0.2, tier: "binary_pre_1929", tier_category: "boom", notes: "WWI wartime economy booming (US not yet belligerent)." },
      "1920": { incumbent_party: "Democratic", raw_econ: -0.4, tier: "binary_pre_1929", tier_category: "major_panic", notes: "Depression of 1920-21 active. User-listed major panic." },
      "1924": { incumbent_party: "Republican", raw_econ: 0, tier: "binary_pre_1929", tier_category: "normal", notes: "1923-24 mild contraction ended July 1924. Election in expansion." },
      "1928": { incumbent_party: "Republican", raw_econ: 0.2, tier: "binary_pre_1929", tier_category: "boom", notes: "Roaring Twenties peak." },
      "1932": { incumbent_party: "Republican", raw_econ: -1, tier: "annual_1929_1947", gdp_growth_pct: -13, unemp_delta_pct: 7.7, notes: "Great Depression trough. Unemployment 23.6% (prev year 15.9%). Both terms saturate low." },
      "1936": { incumbent_party: "Democratic", raw_econ: 1, tier: "annual_1929_1947", gdp_growth_pct: 12.9, unemp_delta_pct: -3.2, notes: "Roaring recovery. Unemployment 16.9% (prev 20.1%). Both terms saturate high." },
      "1940": { incumbent_party: "Democratic", raw_econ: 1, tier: "annual_1929_1947", gdp_growth_pct: 8.8, unemp_delta_pct: -2.6, notes: "1938 recession passed; pre-war buildup boosting GDP. Unemployment 14.6% (prev 17.2%)." },
      "1944": { incumbent_party: "Democratic", raw_econ: 0.8, tier: "annual_1929_1947", gdp_growth_pct: 8.3, unemp_delta_pct: -0.7, notes: "War economy. Unemployment 1.2% (prev 1.9%). GDP term saturates high." },
      "1948": { incumbent_party: "Democratic", raw_econ: 0.2, tier: "quarterly_1948_plus", gdp_q2_annualized: 4.1, inflation_yoy_pct: 3.5, unemp_delta_pct: -0.2, notes: "Truman. Inflation falling from 1947 peak (14%). Post-war conversion mostly complete." },
      "1952": { incumbent_party: "Democratic", raw_econ: 0.5, tier: "quarterly_1948_plus", gdp_q2_annualized: 4.1, inflation_yoy_pct: 0.8, unemp_delta_pct: -0.4, notes: "Korean War economy. Low inflation (price controls), tight labor market. Signal boosts D (the incumbent party), but voters picked Ike anyway \u2014 20-year fatigue trumps economic signal." },
      "1956": { incumbent_party: "Republican", raw_econ: 0, tier: "quarterly_1948_plus", gdp_q2_annualized: 0.1, inflation_yoy_pct: 1.9, unemp_delta_pct: 0.1, notes: "Eisenhower. Q2 1956 GDP growth was a slow 0.1% SAAR (Q4 recovered to +4.6%); Q2-anchored formula underweights the full year (~2.1%). Documented caveat in _meta." },
      "1960": { incumbent_party: "Republican", raw_econ: -0.1, tier: "quarterly_1948_plus", gdp_q2_annualized: 2.6, inflation_yoy_pct: 1.4, unemp_delta_pct: 1.1, notes: "Eisenhower's 1960 recession. Unemployment rising from 5.0% to 6.1%. Kennedy narrow win." },
      "1964": { incumbent_party: "Democratic", raw_econ: 0.6, tier: "quarterly_1948_plus", gdp_q2_annualized: 5.8, inflation_yoy_pct: 1.2, unemp_delta_pct: -0.3, notes: "LBJ post-Kennedy tax cuts; strong growth, low inflation." },
      "1968": { incumbent_party: "Democratic", raw_econ: 0.2, tier: "quarterly_1948_plus", gdp_q2_annualized: 4.8, inflation_yoy_pct: 4.4, unemp_delta_pct: -0.3, notes: "Vietnam/Great Society era. Growth still strong, inflation beginning to bite." },
      "1972": { incumbent_party: "Republican", raw_econ: 0.4, tier: "quarterly_1948_plus", gdp_q2_annualized: 5.3, inflation_yoy_pct: 3.4, unemp_delta_pct: -0.3, notes: "Nixon price-controls era. Growth strong, inflation hidden for now." },
      "1976": { incumbent_party: "Republican", raw_econ: 0.2, tier: "quarterly_1948_plus", gdp_q2_annualized: 5.4, inflation_yoy_pct: 5.5, unemp_delta_pct: -0.7, notes: "Strong recovery from 1974-75 recession, but inflation still 5.5% and unemployment 7.7% \u2014 formula mildly positive; doesn't capture stagflation fatigue." },
      "1980": { incumbent_party: "Democratic", raw_econ: -1, tier: "quarterly_1948_plus", gdp_q2_annualized: -0.3, inflation_yoy_pct: 12.6, unemp_delta_pct: 1.5, notes: "Stagflation nadir. All three terms saturate low. Carter obliterated." },
      "1984": { incumbent_party: "Republican", raw_econ: 0.5, tier: "quarterly_1948_plus", gdp_q2_annualized: 7.2, inflation_yoy_pct: 4, unemp_delta_pct: -1.2, notes: "Morning in America. GDP term saturates high, unemployment dropping fast." },
      "1988": { incumbent_party: "Republican", raw_econ: 0.2, tier: "quarterly_1948_plus", gdp_q2_annualized: 4.2, inflation_yoy_pct: 4.2, unemp_delta_pct: -0.5, notes: "Late Reagan expansion; moderate growth." },
      "1992": { incumbent_party: "Republican", raw_econ: 0, tier: "quarterly_1948_plus", gdp_q2_annualized: 3.5, inflation_yoy_pct: 3.2, unemp_delta_pct: 0.4, notes: "Recovery from 1990-91 recession; jobless-recovery sentiment (unemployment STILL rising through 1992). Formula near zero; 'it's the economy, stupid' not captured." },
      "1996": { incumbent_party: "Democratic", raw_econ: 0.2, tier: "quarterly_1948_plus", gdp_q2_annualized: 3.8, inflation_yoy_pct: 3, unemp_delta_pct: -0.2, notes: "Clinton/Gingrich expansion." },
      "2000": { incumbent_party: "Democratic", raw_econ: 0.2, tier: "quarterly_1948_plus", gdp_q2_annualized: 4.1, inflation_yoy_pct: 3.4, unemp_delta_pct: -0.1, notes: "End of dot-com boom. Very tight labor market." },
      "2004": { incumbent_party: "Republican", raw_econ: 0.2, tier: "quarterly_1948_plus", gdp_q2_annualized: 3.8, inflation_yoy_pct: 3.2, unemp_delta_pct: -0.4, notes: "Bush re-election; moderate post-2001-recession recovery." },
      "2008": { incumbent_party: "Republican", raw_econ: -0.8, tier: "quarterly_1948_plus", gdp_q2_annualized: -0.1, inflation_yoy_pct: 3.7, unemp_delta_pct: 1.9, notes: "Financial crisis. GDP and unemployment terms both saturate low." },
      "2012": { incumbent_party: "Democratic", raw_econ: 0.2, tier: "quarterly_1948_plus", gdp_q2_annualized: 2.3, inflation_yoy_pct: 2.2, unemp_delta_pct: -1, notes: "Obama re-election. Slow recovery but unemployment falling." },
      "2016": { incumbent_party: "Democratic", raw_econ: 0, tier: "quarterly_1948_plus", gdp_q2_annualized: 1.7, inflation_yoy_pct: 1.6, unemp_delta_pct: -0.2, notes: "Slow growth. Formula near zero. Trump's victory driven by non-economic sorting." },
      "2020": { incumbent_party: "Republican", raw_econ: -0.5, tier: "quarterly_1948_plus", gdp_q2_annualized: -3.4, inflation_yoy_pct: 1.2, unemp_delta_pct: 3, notes: "COVID recession. GDP and unemployment terms saturate low; low inflation (briefly) a minor offset." },
      "2024": { incumbent_party: "Democratic", raw_econ: 0, tier: "quarterly_1948_plus", gdp_q2_annualized: 2.8, inflation_yoy_pct: 2.6, unemp_delta_pct: 0.3, notes: "Formula near zero \u2014 growth fine, inflation returned to near-target, unemployment ticking up slightly. Doesn't capture 2021-23 cumulative price-level fatigue that hurt Harris. Known limitation of YoY-spot inflation measure." }
    },
    candidates: {
      Washington_1789: { is_incumbent_person: false, charisma: 5, consensus_key: "Washington_1789", party: "Unaffiliated" },
      Washington_1792: { is_incumbent_person: true, charisma: 5, consensus_key: "Washington_1792", party: "Unaffiliated" },
      Adams_1796: { is_incumbent_person: false, charisma: 2, consensus_key: "Adams_1796", party: "Federalist" },
      Jefferson_1796: { is_incumbent_person: false, charisma: 4, consensus_key: "Jefferson_1796", party: "Democratic-Republican" },
      Jefferson_1800: { is_incumbent_person: false, charisma: 4, consensus_key: "Jefferson_1800", party: "Democratic-Republican" },
      Adams_1800: { is_incumbent_person: true, charisma: 2, consensus_key: "Adams_1800", party: "Federalist" },
      Jefferson_1804: { is_incumbent_person: true, charisma: 4, consensus_key: "Jefferson_1804", party: "Democratic-Republican" },
      Pinckney_1804: { is_incumbent_person: false, charisma: 2.5, consensus_key: "Pinckney_1804", party: "Federalist" },
      Madison_1808: { is_incumbent_person: false, charisma: 2.5, consensus_key: "Madison_1808", party: "Democratic-Republican" },
      Pinckney_1808: { is_incumbent_person: false, charisma: 2.5, consensus_key: "Pinckney_1808", party: "Federalist" },
      Madison_1812: { is_incumbent_person: true, charisma: 2.5, consensus_key: "Madison_1812", party: "Democratic-Republican" },
      Clinton_1812: { is_incumbent_person: false, charisma: 3, consensus_key: "Clinton_1812", party: "Federalist", note: "DeWitt Clinton, not Bill Clinton" },
      Monroe_1816: { is_incumbent_person: false, charisma: 3, consensus_key: "Monroe_1816", party: "Democratic-Republican" },
      King_1816: { is_incumbent_person: false, charisma: 2.5, consensus_key: "King_1816", party: "Federalist" },
      Monroe_1820: { is_incumbent_person: true, charisma: 3, consensus_key: "Monroe_1820", party: "Democratic-Republican" },
      Adams_1824: { is_incumbent_person: false, charisma: 1.5, consensus_key: "Adams_1824", party: "Democratic-Republican", note: "John Quincy Adams" },
      Jackson_1824: { is_incumbent_person: false, charisma: 5, consensus_key: "Jackson_1824", party: "Democratic-Republican" },
      Crawford_1824: { is_incumbent_person: false, charisma: 2.5, consensus_key: "Crawford_1824", party: "Democratic-Republican" },
      Clay_1824: { is_incumbent_person: false, charisma: 4.5, consensus_key: "Clay_1824", party: "Democratic-Republican" },
      Jackson_1828: { is_incumbent_person: false, charisma: 5, consensus_key: "Jackson_1828", party: "Democratic" },
      Adams_1828: { is_incumbent_person: true, charisma: 1.5, consensus_key: "Adams_1828", party: "National Republican", note: "John Quincy Adams" },
      Jackson_1832: { is_incumbent_person: true, charisma: 5, consensus_key: "Jackson_1832", party: "Democratic" },
      Clay_1832: { is_incumbent_person: false, charisma: 4.5, consensus_key: "Clay_1832", party: "National Republican" },
      Wirt_1832: { is_incumbent_person: false, charisma: 2.5, consensus_key: "Wirt_1832", party: "Anti-Masonic" },
      VanBuren_1836: { is_incumbent_person: false, charisma: 2.5, consensus_key: "VanBuren_1836", party: "Democratic" },
      Harrison_1836: { is_incumbent_person: false, charisma: 3, consensus_key: "Harrison_1836", party: "Whig", note: "William Henry Harrison" },
      Harrison_1840: { is_incumbent_person: false, charisma: 3.5, consensus_key: "Harrison_1840", party: "Whig", note: "William Henry Harrison" },
      VanBuren_1840: { is_incumbent_person: true, charisma: 2.5, consensus_key: "VanBuren_1840", party: "Democratic" },
      Polk_1844: { is_incumbent_person: false, charisma: 2.5, consensus_key: "Polk_1844", party: "Democratic" },
      Clay_1844: { is_incumbent_person: false, charisma: 4.5, consensus_key: "Clay_1844", party: "Whig" },
      Taylor_1848: { is_incumbent_person: false, charisma: 3, consensus_key: "Taylor_1848", party: "Whig" },
      Cass_1848: { is_incumbent_person: false, charisma: 2.5, consensus_key: "Cass_1848", party: "Democratic" },
      VanBuren_1848: { is_incumbent_person: false, charisma: 3, consensus_key: "VanBuren_1848", party: "Free Soil" },
      Pierce_1852: { is_incumbent_person: false, charisma: 3, consensus_key: "Pierce_1852", party: "Democratic" },
      Scott_1852: { is_incumbent_person: false, charisma: 2, consensus_key: "Scott_1852", party: "Whig" },
      Buchanan_1856: { is_incumbent_person: false, charisma: 2, consensus_key: "Buchanan_1856", party: "Democratic" },
      Fremont_1856: { is_incumbent_person: false, charisma: 3.5, consensus_key: "Fremont_1856", party: "Republican" },
      Fillmore_1856: { is_incumbent_person: false, charisma: 2.5, consensus_key: "Fillmore_1856", party: "Know-Nothing/American" },
      Lincoln_1860: { is_incumbent_person: false, charisma: 4.3, consensus_key: "Lincoln_1860", party: "Republican" },
      Douglas_1860: { is_incumbent_person: false, charisma: 4, consensus_key: "Douglas_1860", party: "Northern Democratic" },
      Breckinridge_1860: { is_incumbent_person: false, charisma: 3, consensus_key: "Breckinridge_1860", party: "Southern Democratic" },
      Bell_1860: { is_incumbent_person: false, charisma: 2.5, consensus_key: "Bell_1860", party: "Constitutional Union" },
      Lincoln_1864: { is_incumbent_person: true, charisma: 4.3, consensus_key: "Lincoln_1864", party: "Republican/National Union" },
      McClellan_1864: { is_incumbent_person: false, charisma: 3, consensus_key: "McClellan_1864", party: "Democratic" },
      Grant_1868: { is_incumbent_person: false, charisma: 3.7, consensus_key: "Grant_1868", party: "Republican" },
      Seymour_1868: { is_incumbent_person: false, charisma: 2.7, consensus_key: "Seymour_1868", party: "Democratic" },
      Grant_1872: { is_incumbent_person: true, charisma: 3.7, consensus_key: "Grant_1872", party: "Republican" },
      Greeley_1872: { is_incumbent_person: false, charisma: 2.3, consensus_key: "Greeley_1872", party: "Liberal Republican/Democratic" },
      Hayes_1876: { is_incumbent_person: false, charisma: 3, consensus_key: "Hayes_1876", party: "Republican" },
      Tilden_1876: { is_incumbent_person: false, charisma: 2.7, consensus_key: "Tilden_1876", party: "Democratic" },
      Garfield_1880: { is_incumbent_person: false, charisma: 4, consensus_key: "Garfield_1880", party: "Republican" },
      Hancock_1880: { is_incumbent_person: false, charisma: 3, consensus_key: "Hancock_1880", party: "Democratic" },
      Cleveland_1884: { is_incumbent_person: false, charisma: 2.7, consensus_key: "Cleveland_1884", party: "Democratic" },
      Blaine_1884: { is_incumbent_person: false, charisma: 4, consensus_key: "Blaine_1884", party: "Republican" },
      Harrison_1888: { is_incumbent_person: false, charisma: 2, consensus_key: "Harrison_1888", party: "Republican", note: "Benjamin Harrison" },
      Cleveland_1888: { is_incumbent_person: true, charisma: 2.7, consensus_key: "Cleveland_1888", party: "Democratic" },
      Cleveland_1892: { is_incumbent_person: false, charisma: 2.7, consensus_key: "Cleveland_1892", party: "Democratic", note: "Non-consecutive comeback; NOT flagged incumbent per rule" },
      Harrison_1892: { is_incumbent_person: true, charisma: 2, consensus_key: "Harrison_1892", party: "Republican", note: "Benjamin Harrison" },
      McKinley_1896: { is_incumbent_person: false, charisma: 3.3, consensus_key: "McKinley_1896", party: "Republican" },
      Bryan_1896: { is_incumbent_person: false, charisma: 5, consensus_key: "Bryan_1896", party: "Democratic/Populist" },
      McKinley_1900: { is_incumbent_person: true, charisma: 3.3, consensus_key: "McKinley_1900", party: "Republican" },
      Bryan_1900: { is_incumbent_person: false, charisma: 5, consensus_key: "Bryan_1900", party: "Democratic" },
      Roosevelt_1904: { is_incumbent_person: true, charisma: 5, consensus_key: "RooseveltTheodore_1904", party: "Republican", note: "Theodore Roosevelt (succeeded from McKinley assassination 1901)" },
      Parker_1904: { is_incumbent_person: false, charisma: 1.7, consensus_key: "Parker_1904", party: "Democratic" },
      Taft_1908: { is_incumbent_person: false, charisma: 2.7, consensus_key: "Taft_1908", party: "Republican" },
      Bryan_1908: { is_incumbent_person: false, charisma: 4.3, consensus_key: "Bryan_1908", party: "Democratic" },
      Wilson_1912: { is_incumbent_person: false, charisma: 4, consensus_key: "Wilson_1912", party: "Democratic" },
      Taft_1912: { is_incumbent_person: true, charisma: 2.3, consensus_key: "Taft_1912", party: "Republican" },
      Roosevelt_1912: { is_incumbent_person: false, charisma: 5, consensus_key: "Roosevelt_1912", party: "Progressive/Bull Moose", note: "Theodore Roosevelt running as third-party" },
      Wilson_1916: { is_incumbent_person: true, charisma: 4, consensus_key: "Wilson_1916", party: "Democratic" },
      Hughes_1916: { is_incumbent_person: false, charisma: 2.3, consensus_key: "Hughes_1916", party: "Republican" },
      Harding_1920: { is_incumbent_person: false, charisma: 4, consensus_key: "Harding_1920", party: "Republican" },
      Cox_1920: { is_incumbent_person: false, charisma: 3, consensus_key: "Cox_1920", party: "Democratic" },
      Coolidge_1924: { is_incumbent_person: true, charisma: 2.3, consensus_key: "Coolidge_1924", party: "Republican", note: "Succeeded from Harding death 1923" },
      Davis_1924: { is_incumbent_person: false, charisma: 2.3, consensus_key: "Davis_1924", party: "Democratic" },
      LaFollette_1924: { is_incumbent_person: false, charisma: 4, consensus_key: "LaFollette_1924", party: "Progressive" },
      Hoover_1928: { is_incumbent_person: false, charisma: 2.7, consensus_key: "Hoover_1928", party: "Republican" },
      Smith_1928: { is_incumbent_person: false, charisma: 4, consensus_key: "Smith_1928", party: "Democratic" },
      Roosevelt_1932: { is_incumbent_person: false, charisma: 5, consensus_key: "RooseveltFranklin_1932", party: "Democratic", note: "FDR" },
      Hoover_1932: { is_incumbent_person: true, charisma: 2, consensus_key: "Hoover_1932", party: "Republican" },
      Roosevelt_1936: { is_incumbent_person: true, charisma: 5, consensus_key: "RooseveltFranklin_1936", party: "Democratic", note: "FDR" },
      Landon_1936: { is_incumbent_person: false, charisma: 2.3, consensus_key: "Landon_1936", party: "Republican" },
      Roosevelt_1940: { is_incumbent_person: true, charisma: 5, consensus_key: "RooseveltFranklin_1940", party: "Democratic", note: "FDR (third term)" },
      Willkie_1940: { is_incumbent_person: false, charisma: 4, consensus_key: "Willkie_1940", party: "Republican" },
      Roosevelt_1944: { is_incumbent_person: true, charisma: 5, consensus_key: "RooseveltFranklin_1944", party: "Democratic", note: "FDR (fourth term)" },
      Dewey_1944: { is_incumbent_person: false, charisma: 2, consensus_key: "Dewey_1944", party: "Republican" },
      Truman_1948: { is_incumbent_person: true, charisma: 3.5, consensus_key: "Truman_1948", party: "Democratic", note: "Succeeded from FDR death 1945" },
      Dewey_1948: { is_incumbent_person: false, charisma: 1.8, consensus_key: "Dewey_1948", party: "Republican" },
      Thurmond_1948: { is_incumbent_person: false, charisma: 3.3, consensus_key: "Thurmond_1948", party: "Dixiecrat/States' Rights" },
      HWallace_1948: { is_incumbent_person: false, charisma: 2.8, consensus_key: "WallaceHenry_1948", party: "Progressive", note: "Henry A. Wallace" },
      Eisenhower_1952: { is_incumbent_person: false, charisma: 4.3, consensus_key: "Eisenhower_1952", party: "Republican" },
      Stevenson_1952: { is_incumbent_person: false, charisma: 3, consensus_key: "Stevenson_1952", party: "Democratic" },
      Eisenhower_1956: { is_incumbent_person: true, charisma: 4.3, consensus_key: "Eisenhower_1956", party: "Republican" },
      Stevenson_1956: { is_incumbent_person: false, charisma: 3, consensus_key: "Stevenson_1956", party: "Democratic" },
      Kennedy_1960: { is_incumbent_person: false, charisma: 5, consensus_key: "Kennedy_1960", party: "Democratic" },
      Nixon_1960: { is_incumbent_person: false, charisma: 2, consensus_key: "Nixon_1960", party: "Republican" },
      Johnson_1964: { is_incumbent_person: true, charisma: 3, consensus_key: "Johnson_1964", party: "Democratic", note: "LBJ, succeeded from JFK assassination 1963" },
      Goldwater_1964: { is_incumbent_person: false, charisma: 3, consensus_key: "Goldwater_1964", party: "Republican" },
      Nixon_1968: { is_incumbent_person: false, charisma: 2, consensus_key: "Nixon_1968", party: "Republican" },
      Humphrey_1968: { is_incumbent_person: false, charisma: 3.3, consensus_key: "Humphrey_1968", party: "Democratic" },
      Wallace_1968: { is_incumbent_person: false, charisma: 4.3, consensus_key: "WallaceGeorge_1968", party: "American Independent", note: "George Wallace" },
      Nixon_1972: { is_incumbent_person: true, charisma: 2.3, consensus_key: "Nixon_1972", party: "Republican" },
      McGovern_1972: { is_incumbent_person: false, charisma: 2.5, consensus_key: "McGovern_1972", party: "Democratic" },
      Carter_1976: { is_incumbent_person: false, charisma: 3.3, consensus_key: "Carter_1976", party: "Democratic" },
      Ford_1976: { is_incumbent_person: true, charisma: 2.5, consensus_key: "Ford_1976", party: "Republican", note: "Succeeded from Nixon resignation 1974" },
      Reagan_1980: { is_incumbent_person: false, charisma: 5, consensus_key: "Reagan_1980", party: "Republican" },
      Carter_1980: { is_incumbent_person: true, charisma: 2.3, consensus_key: "Carter_1980", party: "Democratic" },
      Anderson_1980: { is_incumbent_person: false, charisma: 3, consensus_key: "Anderson_1980", party: "Independent" },
      Reagan_1984: { is_incumbent_person: true, charisma: 5, consensus_key: "Reagan_1984", party: "Republican" },
      Mondale_1984: { is_incumbent_person: false, charisma: 2, consensus_key: "Mondale_1984", party: "Democratic" },
      Bush_1988: { is_incumbent_person: false, charisma: 2.8, consensus_key: "BushGeorgeHW_1988", party: "Republican", note: "George H.W. Bush" },
      Dukakis_1988: { is_incumbent_person: false, charisma: 1.8, consensus_key: "Dukakis_1988", party: "Democratic" },
      Clinton_1992: { is_incumbent_person: false, charisma: 5, consensus_key: "ClintonBill_1992", party: "Democratic", note: "Bill Clinton" },
      Bush_1992: { is_incumbent_person: true, charisma: 2.5, consensus_key: "BushGeorgeHW_1992", party: "Republican", note: "George H.W. Bush" },
      Perot_1992: { is_incumbent_person: false, charisma: 4, consensus_key: "Perot_1992", party: "Independent" },
      Clinton_1996: { is_incumbent_person: true, charisma: 4.8, consensus_key: "ClintonBill_1996", party: "Democratic", note: "Bill Clinton" },
      Dole_1996: { is_incumbent_person: false, charisma: 2, consensus_key: "Dole_1996", party: "Republican" },
      Perot_1996: { is_incumbent_person: false, charisma: 3, consensus_key: "Perot_1996", party: "Reform" },
      Gore_2000: { is_incumbent_person: false, charisma: 2, consensus_key: "Gore_2000", party: "Democratic" },
      Bush_2000: { is_incumbent_person: false, charisma: 3.5, consensus_key: "BushGeorgeW_2000", party: "Republican", note: "George W. Bush" },
      Nader_2000: { is_incumbent_person: false, charisma: 2.8, consensus_key: "Nader_2000", party: "Green" },
      Kerry_2004: { is_incumbent_person: false, charisma: 2, consensus_key: "Kerry_2004", party: "Democratic" },
      Bush_2004: { is_incumbent_person: true, charisma: 3.3, consensus_key: "BushGeorgeW_2004", party: "Republican", note: "George W. Bush" },
      Obama_2008: { is_incumbent_person: false, charisma: 5, consensus_key: "Obama_2008", party: "Democratic" },
      McCain_2008: { is_incumbent_person: false, charisma: 3.5, consensus_key: "McCain_2008", party: "Republican" },
      Obama_2012: { is_incumbent_person: true, charisma: 4.5, consensus_key: "Obama_2012", party: "Democratic" },
      Romney_2012: { is_incumbent_person: false, charisma: 2.8, consensus_key: "Romney_2012", party: "Republican" },
      Trump_2016: { is_incumbent_person: false, charisma: 4.3, consensus_key: "Trump_2016", party: "Republican" },
      Clinton_2016: { is_incumbent_person: false, charisma: 2.3, consensus_key: "ClintonHillary_2016", party: "Democratic", note: "Hillary Clinton" },
      Johnson_2016: { is_incumbent_person: false, charisma: 2.3, consensus_key: "JohnsonGary_2016", party: "Libertarian", note: "Gary Johnson" },
      Biden_2020: { is_incumbent_person: false, charisma: 3, consensus_key: "Biden_2020", party: "Democratic" },
      Trump_2020: { is_incumbent_person: true, charisma: 4.3, consensus_key: "Trump_2020", party: "Republican" },
      Trump_2024: { is_incumbent_person: false, charisma: 4.3, consensus_key: "Trump_2024", party: "Republican", note: "Non-consecutive comeback; NOT flagged incumbent per rule" },
      Harris_2024: { is_incumbent_person: false, charisma: 3, consensus_key: "Harris_2024", party: "Democratic", note: "Replaced Biden mid-campaign; not the sitting president" }
    }
  };

  // src/historical/non-ideological-modifiers.ts
  var WEIGHT_ECON = 0.6;
  var WEIGHT_INCUMB = 0.2;
  var WEIGHT_CHARISMA = 0.2;
  var TOTAL_CAP = 0.3;
  var MIN_YEAR2 = 1789;
  var MAX_YEAR2 = 2024;
  function loadAndValidate2() {
    const parsed = non_ideological_data_default;
    if (!parsed.elections || typeof parsed.elections !== "object") {
      throw new Error("non-ideological-data.json: missing or malformed 'elections' map");
    }
    if (!parsed.candidates || typeof parsed.candidates !== "object") {
      throw new Error("non-ideological-data.json: missing or malformed 'candidates' map");
    }
    for (const [yearStr, entry] of Object.entries(parsed.elections)) {
      if (!/^\d{4}$/.test(yearStr)) {
        throw new Error(`non-ideological-data.json: election key ${yearStr} is not a 4-digit year`);
      }
      const year = Number(yearStr);
      if (year < MIN_YEAR2 || year > MAX_YEAR2) {
        throw new Error(`non-ideological-data.json: year ${year} outside [${MIN_YEAR2}, ${MAX_YEAR2}]`);
      }
      if (typeof entry.raw_econ !== "number" || entry.raw_econ < -1 || entry.raw_econ > 1) {
        throw new Error(`non-ideological-data.json: year ${year} raw_econ invalid (${entry.raw_econ})`);
      }
    }
    for (const [key, entry] of Object.entries(parsed.candidates)) {
      if (typeof entry.is_incumbent_person !== "boolean") {
        throw new Error(`non-ideological-data.json: candidate ${key} missing is_incumbent_person`);
      }
      if (typeof entry.charisma !== "number" || entry.charisma < 1 || entry.charisma > 5) {
        throw new Error(`non-ideological-data.json: candidate ${key} charisma invalid (${entry.charisma})`);
      }
      if (typeof entry.party !== "string") {
        throw new Error(`non-ideological-data.json: candidate ${key} missing party`);
      }
    }
    return parsed;
  }
  var DATA = loadAndValidate2();
  var NAME_OVERRIDES = {
    "H. Wallace_1948": "HWallace_1948"
  };
  function historicalToCanonical(name, year) {
    const raw = `${name}_${year}`;
    return NAME_OVERRIDES[raw] ?? raw;
  }
  function clip(x, lo, hi) {
    return Math.max(lo, Math.min(hi, x));
  }
  function economicComponent(rawEcon, candidateParty, incumbentParty) {
    if (incumbentParty == null) return 0;
    const base = 0.5 * rawEcon;
    if (candidateParty === incumbentParty) return base;
    const major = ["Democratic", "Republican", "Whig", "Federalist", "Democratic-Republican", "National Republican"];
    const candIsMajor = major.includes(candidateParty);
    const incumbIsMajor = major.includes(incumbentParty);
    if (!candIsMajor || !incumbIsMajor) return 0;
    return -base;
  }
  function getNonIdeologicalModifier(year, candidateKey) {
    const election = DATA.elections[String(year)];
    const cand = DATA.candidates[candidateKey];
    if (!election || !cand) {
      return { economic: 0, incumbency: 0, charisma: 0, total: 0 };
    }
    const economic = economicComponent(election.raw_econ, cand.party, election.incumbent_party);
    const incumbency = cand.is_incumbent_person ? 0.3 : 0;
    const charisma = (cand.charisma - 3) / 4;
    const raw = WEIGHT_ECON * economic + WEIGHT_INCUMB * incumbency + WEIGHT_CHARISMA * charisma;
    const total = clip(raw, -TOTAL_CAP, TOTAL_CAP);
    return { economic, incumbency, charisma, total };
  }

  // src/historical/respondentVoteChoice.ts
  var NONIDEO_ENABLED = true;
  var SCORING_NODES = [
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
    "TRB"
  ];
  var CLEARING_BAR = {
    "apolitical": 1.02,
    "casual": 1.45,
    "engaged": 2.02,
    "highly-engaged": 3.55
  };
  function weightedDistance(sig, cand, ctx) {
    let weightedSumSq = 0;
    let totalWeight = 0;
    for (const node of SCORING_NODES) {
      const entry = sig[node];
      if (!entry) continue;
      const candPos = cand[node];
      if (candPos == null) continue;
      const effectiveSal = entry.sal * getActivationMultiplier(ctx.year, node);
      const diff = entry.pos - candPos;
      weightedSumSq += effectiveSal * diff * diff;
      totalWeight += effectiveSal;
    }
    const ideological = totalWeight > 0 ? Math.sqrt(weightedSumSq / totalWeight) : 4;
    if (!NONIDEO_ENABLED) return ideological;
    const modifier = getNonIdeologicalModifier(
      ctx.year,
      historicalToCanonical(cand.name, cand.year)
    );
    return ideological - modifier.total;
  }
  function predictVote(sig, candidates, ctx, engagement) {
    const scored = candidates.map((c) => ({
      name: c.name,
      party: c.party,
      distance: weightedDistance(sig, c, ctx)
    }));
    const nearest = scored.reduce((a, b) => a.distance <= b.distance ? a : b);
    const clearingBar = CLEARING_BAR[engagement];
    return {
      year: ctx.year,
      candidates: scored,
      clearingBar,
      nearest,
      decision: nearest.distance <= clearingBar ? "vote" : "abstain"
    };
  }

  // src/browser/api.ts
  var _state = null;
  var _archetypes = [];
  var _activeArchetypes = [];
  var _familyIndex = null;
  var _questions = [];
  var _questionsById = /* @__PURE__ */ new Map();
  var _ratioBoosts = /* @__PURE__ */ new Map();
  function ratioToSalienceDist(ratio) {
    if (ratio >= 4) return [0.02, 0.08, 0.3, 0.6];
    if (ratio >= 3) return [0.04, 0.12, 0.34, 0.5];
    if (ratio >= 2) return [0.08, 0.18, 0.34, 0.4];
    return [0.18, 0.28, 0.3, 0.24];
  }
  function applyStoredRatioBoost(q) {
    if (!_state) return;
    const ratio = _ratioBoosts.get(q.id);
    if (!ratio) return;
    const salLikelihood = ratioToSalienceDist(ratio);
    for (const touch of q.touchProfile) {
      if (touch.role !== "salience") continue;
      if (touch.kind === "continuous" && touch.node in _state.continuous) {
        const node = _state.continuous[touch.node];
        node.salDist = multiplyAndNormalize(node.salDist, salLikelihood);
      } else if (touch.kind === "categorical" && touch.node in _state.categorical) {
        const node = _state.categorical[touch.node];
        node.salDist = multiplyAndNormalize(node.salDist, salLikelihood);
      }
    }
  }
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
      archetypeDistances: { ...state.archetypeDistances },
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
  function createInitialState() {
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
    return {
      answers: {},
      continuous,
      categorical,
      trbAnchor: {
        dist: [1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9],
        touches: 0
      },
      archetypeDistances: {},
      currentLeader: void 0,
      consecutiveLeadCount: 0
    };
  }
  function updateDistances(state, archetypes) {
    let leaderId;
    let leaderDist = Infinity;
    for (const a of archetypes) {
      const dist = archetypeDistance(state, a);
      state.archetypeDistances[a.id] = dist;
      if (dist < leaderDist) {
        leaderDist = dist;
        leaderId = a.id;
      }
    }
    if (leaderId === state.currentLeader) {
      state.consecutiveLeadCount = (state.consecutiveLeadCount ?? 0) + 1;
    } else {
      state.currentLeader = leaderId;
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
    if (q.dualAxisMap) {
      out.dualAxisMap = {
        node: q.dualAxisMap.node,
        xLow: [...q.dualAxisMap.xLow],
        xHigh: [...q.dualAxisMap.xHigh]
      };
    }
    if (q.strengthFollowUp) {
      out.strengthFollowUp = {
        kind: q.strengthFollowUp.kind,
        prompt: q.strengthFollowUp.prompt,
        labels: q.strengthFollowUp.labels ? { ...q.strengthFollowUp.labels } : void 0
      };
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
      out.pairOptions = {};
      for (const [pairId, sides] of Object.entries(q.pairMaps)) {
        out.pairOptions[pairId] = Object.keys(sides);
      }
    }
    if (q.bestWorstMap) {
      out.bestWorstItems = Object.keys(q.bestWorstMap);
    } else if (q.uiType === "best_worst" && q.rankingMap) {
      out.bestWorstItems = Object.keys(q.rankingMap);
    }
    if (q.bwMaxPicks != null) {
      out.bwMaxPicks = q.bwMaxPicks;
    }
    return out;
  }
  function initQuiz() {
    _archetypes = ARCHETYPES;
    _activeArchetypes = ARCHETYPES.filter((a) => a.active !== false);
    _familyIndex = buildArchetypeFamilies(_archetypes);
    _questions = REPRESENTATIVE_QUESTIONS.filter((q) => q.touchProfile.length > 0);
    _questionsById = new Map(_questions.map((q) => [q.id, q]));
    resetSimilarityCache();
    _state = createInitialState();
    _snapshots.length = 0;
    _ratioBoosts.clear();
  }
  function getNextQuestion() {
    if (!_state) throw new Error("Call initQuiz() first");
    const nAnswered = Object.keys(_state.answers).length;
    if (nAnswered < FIXED_OPENER.length) {
      const nextId = FIXED_OPENER[nAnswered];
      const q = _questionsById.get(nextId);
      if (q) return toQuizQuestion(q);
    }
    const available = _questions.filter(
      (q) => !(q.id in _state.answers) && isQuestionEligible(_state, q)
    );
    const next = selectNextQuestionEIG(_state, available, _questionsById);
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
      case "conjoint":
        applySingleChoiceAnswer(_state, q, answer);
        applyStoredRatioBoost(q);
        break;
      case "dual_axis":
        applyDualAxisAnswer(_state, q, answer);
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
        if (bwItems.length === 0) break;
        if (Array.isArray(bw.best) || Array.isArray(bw.worst)) {
          const best = Array.isArray(bw.best) ? bw.best : [bw.best];
          const worst = Array.isArray(bw.worst) ? bw.worst : [bw.worst];
          applyBestWorstSalience(_state, q, best, worst, bwItems);
        } else {
          const middle = bwItems.filter((i) => i !== bw.best && i !== bw.worst);
          applyRankingAnswer(_state, q, [bw.best, ...middle, bw.worst]);
        }
        break;
      }
      case "priority_sort": {
        const placements = answer;
        const items = q.rankingMap ? Object.keys(q.rankingMap) : [];
        if (items.length === 0) break;
        applyPrioritySort(_state, q, placements, items);
        break;
      }
    }
    updateDistances(_state, _activeArchetypes);
  }
  function getProgress() {
    if (!_state) throw new Error("Call initQuiz() first");
    const nAnswered = Object.keys(_state.answers).length;
    const sorted = Object.entries(_state.archetypeDistances).filter(([, d]) => Number.isFinite(d)).sort((a, b) => a[1] - b[1]).slice(0, 5);
    const dLeader = sorted[0]?.[1] ?? Infinity;
    const dSecond = sorted[1]?.[1] ?? Infinity;
    const gapRatio = Number.isFinite(dLeader) && dLeader > 0 && Number.isFinite(dSecond) ? Math.min(1, Math.max(0, (dSecond - dLeader) / dLeader)) : 0;
    let estimatedTotal;
    if (nAnswered < 20) {
      estimatedTotal = 27;
    } else if (dLeader <= 6) {
      estimatedTotal = Math.max(nAnswered + 2, 25);
    } else if (dLeader <= 10) {
      estimatedTotal = Math.max(nAnswered + 4, 28);
    } else {
      estimatedTotal = Math.min(40, Math.max(nAnswered + 8, 33));
    }
    const topArchetypes = sorted.map(([id, distance]) => {
      const arch = _archetypes.find((a) => a.id === id);
      return { id, name: arch?.name ?? "Unknown", distance };
    });
    let phase;
    if (nAnswered < 16) phase = "salience";
    else if (nAnswered < 28) phase = "discriminate";
    else phase = "converge";
    return {
      questionsAnswered: nAnswered,
      estimatedTotal,
      topArchetypes,
      confidence: gapRatio,
      phase
    };
  }
  function isComplete() {
    if (!_state) return false;
    return shouldStopEIG(_state, _questionsById);
  }
  function getResults() {
    if (!_state) throw new Error("Call initQuiz() first");
    const sorted = Object.entries(_state.archetypeDistances).filter(([, d]) => Number.isFinite(d)).sort((a, b) => a[1] - b[1]);
    const top3 = sorted.slice(0, 3).map(([id, distance]) => {
      const arch = _archetypes.find((a) => a.id === id);
      return {
        id,
        name: arch.name,
        tier: arch.tier,
        distance
      };
    });
    let family;
    if (top3.length >= 2 && _familyIndex) {
      const leaderId = top3[0].id;
      const runnerUpId = top3[1].id;
      const leaderFamily = _familyIndex.familyOf[leaderId];
      if (leaderFamily && leaderFamily.has(runnerUpId)) {
        family = {
          isFamily: true,
          partnerId: runnerUpId,
          partnerName: top3[1].name
        };
      }
    }
    const dLeader = top3[0]?.distance ?? Infinity;
    const dSecond = top3[1]?.distance ?? Infinity;
    const confidence = Number.isFinite(dLeader) && dLeader > 0 && Number.isFinite(dSecond) ? Math.min(1, Math.max(0, (dSecond - dLeader) / dLeader)) : 0;
    const engagement = computeEngagementLabel(_state);
    return {
      match: top3[0],
      top3,
      questionsAnswered: Object.keys(_state.answers).length,
      confidence,
      family,
      engagement
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
      const expectedPos2 = node.posDist.reduce((sum, p, i) => sum + p * (i + 1), 0);
      const salience = node.salDist.reduce((sum, p, i) => sum + p * i, 0);
      continuous[nodeId] = { expectedPos: expectedPos2, salience, touches: node.touches };
    }
    const categorical = {};
    for (const [nodeId, node] of Object.entries(_state.categorical)) {
      const salience = node.salDist.reduce((sum, p, i) => sum + p * i, 0);
      categorical[nodeId] = { catDist: [...node.catDist], salience, touches: node.touches };
    }
    return {
      continuous,
      categorical,
      trbAnchor: {
        dist: [..._state.trbAnchor.dist],
        touches: _state.trbAnchor.touches
      },
      ratioBoosts: Object.fromEntries(Array.from(_ratioBoosts.entries()).map(([k, v]) => [String(k), v]))
    };
  }
  function getIdentityPrimaryResult(demographics) {
    if (!_state) return null;
    const engagement = computeEngagementLabel(_state);
    return resolveIdentityPrimary(_state, engagement, demographics ?? null);
  }
  function applyRatioBoost(questionId, ratio) {
    _ratioBoosts.set(questionId, ratio);
  }
  function getElectionPredictions() {
    if (!_state) throw new Error("Call initQuiz() first");
    const sig = respondentSignatureFromState(_state);
    const engagement = computeEngagementLabel(_state);
    const out = [];
    for (const election of ELECTIONS) {
      const ctx = getContext(election.year);
      if (!ctx) continue;
      out.push(predictVote(sig, election.candidates, ctx, engagement.level));
    }
    return out;
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
    const distances = results.top3.map((r) => r.distance);
    const dMin = Math.min(...distances);
    const dMax = Math.max(...distances);
    const span = dMax - dMin + 1e-6;
    const matchScore = (d) => (dMax - d) / span;
    el.innerHTML = `
    <h2>Your Political Archetype</h2>
    <div class="prism-match-name">${results.match.name}</div>
    <div class="prism-confidence">
      Confidence: ${(results.confidence * 100).toFixed(1)}% |
      ${results.questionsAnswered} questions answered
    </div>
    <div class="prism-top5">
      <h3>Top 3 Matches</h3>
      ${results.top3.map((r, i) => `
        <div class="prism-top5-item">
          <div>
            <div class="prism-top5-name">${i + 1}. ${r.name}</div>
            <div class="prism-top5-bar">
              <div class="prism-top5-bar-fill" style="width: ${(matchScore(r.distance) * 100).toFixed(1)}%"></div>
            </div>
          </div>
          <div class="prism-top5-score">d=${r.distance.toFixed(2)}</div>
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
