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
    BUNDLE_VERSION: () => BUNDLE_VERSION,
    LABEL_DESCRIPTIONS: () => LABEL_DESCRIPTIONS,
    applyRatioBoost: () => applyRatioBoost,
    attachToExistingQuiz: () => attachToExistingQuiz,
    canGoBack: () => canGoBack,
    composeArchetypeDescription: () => composeArchetypeDescription,
    composeArchetypeLabel: () => composeArchetypeLabel,
    composeAtomFallback: () => composeAtomFallback,
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
    submitAnswer: () => submitAnswer,
    tokenizeRespondent: () => tokenizeRespondent
  });

  // src/config/categories.ts
  var UNIFORM_CAT = [
    1 / 6,
    1 / 6,
    1 / 6,
    1 / 6,
    1 / 6,
    1 / 6
  ];
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
        { node: "ENG", kind: "continuous", role: "position", weight: 0.85, touchType: "behavior_frequency" }
      ],
      optionEvidence: {
        never: {
          continuous: {
            ENG: { pos: [0.7, 0.2, 0.08, 0.02, 0] }
          }
        },
        few_days: {
          continuous: {
            ENG: { pos: [0.25, 0.45, 0.2, 0.08, 0.02] }
          }
        },
        most_days: {
          continuous: {
            ENG: { pos: [0.03, 0.1, 0.25, 0.4, 0.22] }
          }
        },
        every_day: {
          continuous: {
            ENG: { pos: [0, 0.02, 0.08, 0.25, 0.65] }
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
        { node: "PF", kind: "continuous", role: "position", weight: 0.8, touchType: "direct_centrality" },
        { node: "ENG", kind: "continuous", role: "position", weight: 0.35, touchType: "identity_activation" }
      ],
      sliderMap: {
        "0-20": { continuous: { PF: { pos: [0.7, 0.2, 0.08, 0.02, 0] }, ENG: { pos: [0.55, 0.28, 0.12, 0.04, 0.01] } } },
        "21-40": { continuous: { PF: { pos: [0.35, 0.4, 0.18, 0.06, 0.01] }, ENG: { pos: [0.3, 0.4, 0.2, 0.08, 0.02] } } },
        "41-60": { continuous: { PF: { pos: [0.1, 0.25, 0.4, 0.2, 0.05] }, ENG: { pos: [0.08, 0.22, 0.42, 0.22, 0.06] } } },
        "61-80": { continuous: { PF: { pos: [0.03, 0.1, 0.25, 0.4, 0.22] }, ENG: { pos: [0.03, 0.1, 0.28, 0.4, 0.19] } } },
        "81-100": { continuous: { PF: { pos: [0, 0.03, 0.12, 0.3, 0.55] }, ENG: { pos: [0.01, 0.04, 0.14, 0.31, 0.5] } } }
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
      // ONT_S removed 2026-04-26: structural attribution of inequality
      // (discrimination, family background) is not the same as low institutional
      // trust. A respondent who attributes inequality to structural causes
      // typically wants stronger institutions to address it, not weaker ones.
      // ONT_S is now measured by Q214/Q215/Q216 (normative essentialism) only.
      // ZS/position and EPS/category rows dropped 2026-05-03 per question-information
      // audit: allocationMap has no ZS or EPS entries in any bucket, so the engine
      // never updated either node from this question.
      touchProfile: [
        { node: "MAT", kind: "continuous", role: "position", weight: 0.85, touchType: "causal_allocation" },
        { node: "COM", kind: "continuous", role: "position", weight: 0.25, touchType: "allocation_shape" },
        { node: "MAT", kind: "continuous", role: "salience", weight: 0.55, touchType: "derived_allocation_concentration" }
      ],
      allocationMap: {
        effort_choices: { continuous: { MAT: 0.8, COM: -0.4 } },
        family_background: { continuous: { MAT: -0.6, COM: 0.3 } },
        discrimination_bias: { continuous: { MAT: -0.8, COM: 0.5 } },
        luck_random: { continuous: { COM: 0.2 } }
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
      // ONT_S removed 2026-04-26: blaming "complex forces" or "powerful
      // incompetent people" for bad outcomes is not anti-institutional —
      // attributing failure to incompetence implicitly assumes institutions
      // matter and could work better. This is a ZS / ONT_H probe (zero-sum
      // worldview + view of human nature), not an institutional-trust probe.
      // ONT_S is now measured by Q214/Q215/Q216 (normative essentialism) only.
      // EPS/category row dropped 2026-05-03 per question-information audit:
      // allocationMap has no EPS entries in any bucket.
      touchProfile: [
        { node: "ZS", kind: "continuous", role: "position", weight: 0.55, touchType: "conflict_attribution" },
        { node: "ONT_H", kind: "continuous", role: "position", weight: 0.25, touchType: "motive_model" },
        { node: "COM", kind: "continuous", role: "position", weight: 0.3, touchType: "allocation_shape" },
        { node: "ZS", kind: "continuous", role: "salience", weight: 0.5, touchType: "derived_allocation_concentration" }
      ],
      allocationMap: {
        complex_forces: { continuous: { COM: 0.4 } },
        powerful_incompetent: { continuous: { COM: -0.3 } },
        powerful_selfish: { continuous: { ZS: 0.9, ONT_H: -0.5, COM: -0.6 } },
        ordinary_choices: { continuous: { COM: -0.4 } }
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
        { node: "AES", kind: "categorical", role: "category", weight: 0.3, touchType: "socialization_style" },
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
      // ONT_H signal reinterpreted 2026-04-26 under the malleability framing.
      // Updated again 2026-04-26 (PR1) per cross-LLM critique: misinformed=+0.5
      // ONT_H was too confident. "They're misinformed" can mean "persuadable"
      // (malleability) OR "they consumed bad sources" (epistemic-paternalism).
      // Reduced to +0.25 ONT_H plus a light EPS empiricist/institutionalist
      // tilt (the "if only they had better data/expert consensus" reading).
      // - misinformed = mixed signal: light malleability + epistemic paternalism
      // - self_interest = rational actors, low malleability. Kept at -0.5 ONT_H.
      // - bad_motives = fixed in bad faith, very low malleability. Kept -0.8.
      // - legitimate_values = good-faith disagreement. Kept at 0 ONT_H.
      // ZS/position and MOR/position rows dropped 2026-05-03 per question-information
      // audit: allocationMap has no ZS or MOR entries in any bucket. EPS/category
      // retained — `misinformed` bucket has explicit categorical EPS distribution.
      touchProfile: [
        { node: "TRB", kind: "continuous", role: "position", weight: 0.75, touchType: "outgroup_model" },
        { node: "COM", kind: "continuous", role: "position", weight: 0.45, touchType: "outgroup_model" },
        { node: "ONT_H", kind: "continuous", role: "position", weight: 0.3, touchType: "malleability_proxy" },
        { node: "EPS", kind: "categorical", role: "category", weight: 0.2, touchType: "allocation_shape_epistemic" }
      ],
      allocationMap: {
        legitimate_values: { continuous: { TRB: -0.9, COM: 0.8 } },
        misinformed: {
          continuous: { TRB: 0.1, ONT_H: 0.25 },
          // Heavy "misinformed" allocation reads as epistemic paternalism — "if
          // they had better data / expert consensus they'd reach my view." Light
          // tilt toward empiricist/institutionalist epistemic deference.
          categorical: { EPS: [0.3, 0.3, 0.1, 0.1, 0.1, 0.1] }
        },
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
      // Converted ranking → priority_sort 2026-04-23 per user feedback: bucketing
      // into "central / somewhat / doesn't register" extracts signal from
      // respondents who reject ALL real identity anchors. "No dominant identity"
      // is inferred from the pattern (all neutral), not offered as a fake anchor.
      uiType: "priority_sort",
      quality: 0.96,
      rewriteNeeded: false,
      touchProfile: [
        // ADR-007 (T3): Q60 emits both legacy trbAnchor (for the ADR-006
        // fallback path) AND new moralCircle scoped evidence. When a user
        // ranks an identity highly, we infer above-baseline scoped affinity
        // for that group. global_citizen flips to universalAffinity.
        { node: "TRB_ANCHOR", kind: "derived", role: "anchor", weight: 0.95, touchType: "identity_ranking" }
      ],
      rankingMap: {
        // Each highly-ranked identity boosts the matching scoped affinity to
        // 70 (mid-strong scoped value, comparable to "somewhat_more" on the
        // Battery B scale). Below-the-fold ranks get no scoped evidence.
        // Per 2026-05-08: sexual_identity row dropped per Sam — we don't
        // probe sexual identity separately under the 6-scope model.
        national_identity: { trbAnchor: { national: 1 }, moralCircle: { scopedAffinities: { national: 70 } } },
        ideological_identity: { trbAnchor: { ideological: 1 }, moralCircle: { scopedAffinities: { ideological: 70 } } },
        religious_identity: { trbAnchor: { religious: 1 }, moralCircle: { scopedAffinities: { religious: 70 } } },
        class_identity: { trbAnchor: { class: 1 }, moralCircle: { scopedAffinities: { class: 70 } } },
        ethnic_racial_identity: { trbAnchor: { ethnic_racial: 1 }, moralCircle: { scopedAffinities: { ethnic_racial: 70 } } },
        gender_identity: { trbAnchor: { gender: 1 }, moralCircle: { scopedAffinities: { gender: 70 } } },
        // global_citizen: universalist signal — boosts universalAffinity
        // rather than any scoped affinity.
        global_citizen: { trbAnchor: { global: 1 }, moralCircle: { universal: 75 } }
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
    // Q8 — domestic_vs_abroad_lives (single_choice, 3 options)
    // 2026-05-13: converted from 5-bucket slider to 3-option forced trade-off.
    // The slider's middle three buckets collapsed into "hard_to_say"; the
    // forced binary at the extremes is honest about the trade-off. Now
    // serves as the load-bearing universal-baseline probe in UNIVERSAL_SCREENERS
    // (replacing Q231, which had a social-desirability bias). Picking
    // "clearly_abroad" triggers Q228 to surface residual in-group preferences.
    {
      id: 8,
      stage: "fixed12",
      section: "I",
      promptShort: "domestic_vs_abroad_lives",
      uiType: "single_choice",
      quality: 0.92,
      rewriteNeeded: false,
      options: ["clearly_domestic", "hard_to_say", "clearly_abroad"],
      optionLabels: {
        clearly_domestic: "Program A \u2014 save 10 lives in your country",
        hard_to_say: "Hard to say \u2014 I'd want to know more before choosing",
        clearly_abroad: "Program B \u2014 save 100 lives in a developing nation"
      },
      touchProfile: [
        { node: "MOR", kind: "continuous", role: "position", weight: 0.3, touchType: "moral_scope_tradeoff_legacy_proxy" }
      ],
      optionEvidence: {
        clearly_domestic: {
          continuous: { MOR: { pos: [0.55, 0.28, 0.12, 0.04, 0.01] } },
          moralCircle: { universal: 30, scopedAffinities: { national: 75 } }
        },
        hard_to_say: {
          continuous: { MOR: { pos: [0.08, 0.18, 0.48, 0.18, 0.08] } },
          moralCircle: { universal: 55 }
        },
        clearly_abroad: {
          continuous: { MOR: { pos: [0.01, 0.04, 0.12, 0.28, 0.55] } },
          moralCircle: { universal: 90 }
        }
      }
    },
    // Q228 — remaining_in_group_pull (conditional follow-up to Q8)
    // 2026-05-13: fires only when Q8 = clearly_abroad. Surfaces residual
    // in-group preferences from respondents who claimed a wide moral circle.
    // Each item placed in supportHigh walks back universal slightly (75) AND
    // pushes the scoped value above the running-average universal (85), which
    // is enough to register positive excess after engine averaging.
    {
      id: 228,
      stage: "fixed12",
      section: "I",
      promptShort: "remaining_in_group_pull",
      promptFull: "You picked the abroad option just now \u2014 a wide moral circle. Even so, some groups may still pull at you. Sort each by whether you feel extra moral concern for them, beyond what you feel for people in general.",
      uiType: "priority_sort",
      quality: 0.92,
      rewriteNeeded: false,
      exposeRules: { eligibleIf: ["answered_q8_abroad"] },
      touchProfile: [
        { node: "TRB_ANCHOR", kind: "derived", role: "anchor", weight: 0.1, touchType: "scoped_affinity_legacy_proxy" }
      ],
      optionLabels: {
        ingroup_national: "Fellow citizens of your country",
        ingroup_religious: "People who share your religious tradition",
        ingroup_ethnic_racial: "People of your racial or ethnic background",
        ingroup_class: "People in your economic class",
        ingroup_gender: "People who share your gender",
        ingroup_ideological: "People who share your core political values"
      },
      rankingMap: {
        ingroup_national: { moralCircle: { universal: 75, scopedAffinities: { national: 85 } } },
        ingroup_religious: { moralCircle: { universal: 75, scopedAffinities: { religious: 85 } } },
        ingroup_ethnic_racial: { moralCircle: { universal: 75, scopedAffinities: { ethnic_racial: 85 } } },
        ingroup_class: { moralCircle: { universal: 75, scopedAffinities: { class: 85 } } },
        ingroup_gender: { moralCircle: { universal: 75, scopedAffinities: { gender: 85 } } },
        ingroup_ideological: { moralCircle: { universal: 75, scopedAffinities: { ideological: 85 } } }
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
        { node: "TRB", kind: "continuous", role: "position", weight: 0.8, touchType: "outgroup_trust_estimate" },
        { node: "ZS", kind: "continuous", role: "position", weight: 0.55, touchType: "outgroup_trust_estimate" }
      ],
      sliderMap: {
        "0-20": { continuous: { TRB: { pos: [0.01, 0.04, 0.12, 0.28, 0.55] }, ZS: { pos: [0.01, 0.04, 0.12, 0.28, 0.55] } } },
        "21-40": { continuous: { TRB: { pos: [0.03, 0.09, 0.2, 0.38, 0.3] }, ZS: { pos: [0.03, 0.09, 0.2, 0.38, 0.3] } } },
        "41-60": { continuous: { TRB: { pos: [0.08, 0.18, 0.48, 0.18, 0.08] }, ZS: { pos: [0.08, 0.18, 0.48, 0.18, 0.08] } } },
        "61-80": { continuous: { TRB: { pos: [0.3, 0.38, 0.2, 0.09, 0.03] }, ZS: { pos: [0.3, 0.38, 0.2, 0.09, 0.03] } } },
        "81-100": { continuous: { TRB: { pos: [0.55, 0.28, 0.12, 0.04, 0.01] }, ZS: { pos: [0.55, 0.28, 0.12, 0.04, 0.01] } } }
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
        { node: "PF", kind: "continuous", role: "position", weight: 0.65, touchType: "opponent_identity_activation" },
        { node: "TRB", kind: "continuous", role: "position", weight: 0.7, touchType: "opponent_identity_activation" }
      ],
      sliderMap: {
        "0-20": { continuous: { PF: { pos: [0.6, 0.25, 0.1, 0.04, 0.01] }, TRB: { pos: [0.65, 0.22, 0.09, 0.03, 0.01] } } },
        "21-40": { continuous: { PF: { pos: [0.32, 0.38, 0.2, 0.08, 0.02] }, TRB: { pos: [0.35, 0.35, 0.2, 0.07, 0.03] } } },
        "41-60": { continuous: { PF: { pos: [0.1, 0.22, 0.4, 0.2, 0.08] }, TRB: { pos: [0.12, 0.24, 0.4, 0.18, 0.06] } } },
        "61-80": { continuous: { PF: { pos: [0.03, 0.08, 0.22, 0.4, 0.27] }, TRB: { pos: [0.04, 0.1, 0.24, 0.38, 0.24] } } },
        "81-100": { continuous: { PF: { pos: [0.01, 0.03, 0.1, 0.28, 0.58] }, TRB: { pos: [0.02, 0.05, 0.13, 0.3, 0.5] } } }
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
        { node: "TRB_ANCHOR", kind: "derived", role: "anchor", weight: 0.25, touchType: "nationality_anchor" }
      ],
      sliderMap: {
        "0-20": { continuous: { CU: { sal: [0.55, 0.3, 0.12, 0.03] }, CD: { sal: [0.5, 0.3, 0.15, 0.05] } }, trbAnchor: { global: 0.45, mixed_none: 0.3, ideological: 0.15 } },
        "21-40": { continuous: { CU: { sal: [0.25, 0.4, 0.25, 0.1] }, CD: { sal: [0.28, 0.38, 0.24, 0.1] } }, trbAnchor: { mixed_none: 0.3, global: 0.2, ideological: 0.2, national: 0.1 } },
        "41-60": { continuous: { CU: { sal: [0.08, 0.28, 0.4, 0.24] }, CD: { sal: [0.12, 0.28, 0.38, 0.22] } }, trbAnchor: { national: 0.3, ideological: 0.2, mixed_none: 0.2 } },
        "61-80": { continuous: { CU: { sal: [0.03, 0.12, 0.4, 0.45] }, CD: { sal: [0.05, 0.18, 0.4, 0.37] } }, trbAnchor: { national: 0.55, ideological: 0.1, religious: 0.1, ethnic_racial: 0.1 } },
        "81-100": { continuous: { CU: { sal: [0.02, 0.08, 0.3, 0.6] }, CD: { sal: [0.03, 0.12, 0.35, 0.5] } }, trbAnchor: { national: 0.65, ethnic_racial: 0.2, religious: 0.1 } }
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
      // ONT_H weight lowered 2026-04-26 from 0.55 → 0.30 per ADR-010 ONT_H
      // reframe to malleability. Q6's policy-bundle ONT_H likelihoods encode the
      // older fixed-goodness reading (Traditional Order = pessimistic about
      // humans). Under the malleability framing the signal is ambiguous —
      // Traditional Order could be Burkean (high ONT_H, cultivation via
      // tradition) OR Hobbesian (low ONT_H, fixed bad nature). Reduced weight
      // until likelihoods are recalibrated for the new concept.
      touchProfile: [
        { node: "MAT", kind: "continuous", role: "position", weight: 0.65, touchType: "policy_bundle" },
        { node: "CD", kind: "continuous", role: "position", weight: 0.6, touchType: "policy_bundle" },
        { node: "MOR", kind: "continuous", role: "position", weight: 0.6, touchType: "policy_bundle" },
        { node: "ONT_H", kind: "continuous", role: "position", weight: 0.3, touchType: "policy_bundle" },
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
            ONT_S: { pos: [0.04, 0.1, 0.2, 0.42, 0.24] }
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
    // Q18 — human_improvement_capacity. Reframed 2026-04-26 from the older
    // "do you think humans are improving" framing (steady_improvement / decline)
    // to the malleability-via-cultivation framing per ADR-010. The original
    // labels conflated metaphysical progress narrative with the politically
    // load-bearing question: how much CAN humans be improved, regardless of
    // current trajectory?
    {
      id: 18,
      stage: "screen20",
      section: "II",
      promptShort: "human_improvement_capacity",
      uiType: "single_choice",
      quality: 0.88,
      rewriteNeeded: false,
      options: ["substantial_capacity", "gradual_with_limits", "cyclical_gains_lost", "negligible_capacity"],
      touchProfile: [
        { node: "ONT_H", kind: "continuous", role: "position", weight: 0.9, touchType: "malleability_capacity" }
      ],
      optionEvidence: {
        // "Substantially — each generation can be wiser, kinder, and more capable than the last"
        substantial_capacity: {
          continuous: {
            ONT_H: { pos: [0.01, 0.05, 0.15, 0.38, 0.41] }
          }
        },
        // "Gradually — there's real progress but human nature sets ceilings on how far we can go"
        gradual_with_limits: {
          continuous: {
            ONT_H: { pos: [0.04, 0.12, 0.3, 0.35, 0.19] }
          }
        },
        // "Cyclical — gains in one generation are usually lost in the next"
        cyclical_gains_lost: {
          continuous: {
            ONT_H: { pos: [0.15, 0.25, 0.35, 0.18, 0.07] }
          }
        },
        // "Negligibly — human nature is the main constraint; education and institutions can't really change it"
        negligible_capacity: {
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
      options: ["convict_innocent", "free_guilty", "equal_errors"],
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
        },
        // "Both errors are equal" — emits no position evidence and bypasses
        // the ratio follow-up. UI flag: answer === 'equal_errors' suppresses
        // strengthFollowUp display.
        equal_errors: {}
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
      options: ["fp", "fn", "equal_errors"],
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
        },
        equal_errors: {}
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
      options: ["allow_harmful", "censor_legitimate", "equal_errors"],
      touchProfile: [
        { node: "PRO", kind: "continuous", role: "position", weight: 0.72, touchType: "speech_harm_tradeoff" },
        { node: "PRO", kind: "continuous", role: "salience", weight: 0.65, touchType: "speech_harm_ratio" },
        { node: "EPS", kind: "categorical", role: "category", weight: 0.2, touchType: "truth_authority_proxy" },
        { node: "COM", kind: "continuous", role: "position", weight: 0.12, touchType: "pluralism_proxy" }
      ],
      strengthFollowUp: {
        kind: "ratio",
        prompt: "How much true content would you remove to take down one piece of harmful misinformation?",
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
            // Softened 2026-04-25: previous likelihood [0.40, 0.32, 0.18, 0.07, 0.03]
            // peaked PRO at pos=1 (anti-procedural). But "censoring legitimate
            // speakers is worse" can be either an anti-establishment claim
            // (system abuses speech rights — PRO low) or a civil-libertarian
            // claim (free speech is the constitutional rule, follow it — PRO
            // high). New centered distribution leaves room for both readings
            // without forcing the anti-establishment interpretation.
            PRO: { pos: [0.18, 0.3, 0.3, 0.15, 0.07] },
            COM: { pos: [0.1, 0.18, 0.3, 0.24, 0.18] }
          },
          categorical: { EPS: { cat: EPS_PROTOTYPES.institutionalist } }
        },
        equal_errors: {}
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
      options: ["deport_legal", "let_stay_illegal", "equal_errors"],
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
        },
        equal_errors: {}
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
    // Q48 — improvement_mechanism. Reframed 2026-04-26 from "do you think
    // society is improving / declining" (parallel-redundant with Q18) to
    // mechanism-specificity per ADR-010. This is the question that distinguishes
    // Burkean cultural-malleability (humans cultivated by family/tradition) from
    // Progressive state-malleability (humans cultivated by state institutions)
    // from libertarian market-malleability (humans shaped by market discipline)
    // from fatalist no-malleability ("society doesn't really improve"). All four
    // pro-mechanism options signal HIGH ONT_H (humans are malleable); they
    // differ on the *mechanism* and so produce different ONT_S, MAT, CD signals.
    {
      id: 48,
      stage: "screen20",
      section: "IV",
      promptShort: "improvement_mechanism",
      uiType: "single_choice",
      quality: 0.87,
      rewriteNeeded: false,
      options: ["state_institutions", "family_community_tradition", "market_innovation", "cultural_inherited", "doesnt_improve"],
      // ONT_H weight lowered 2026-04-26 from 0.85 → 0.70 per cross-LLM critique:
      // Q48 is a worldview bundle (malleability + preferred mechanism + ideology),
      // not a pure ONT_H probe. Each option does real MAT/ONT_S/CD work too.
      // Reducing ONT_H reflects what the question actually probes — Q210 remains
      // the dedicated direct malleability probe at 0.85.
      touchProfile: [
        { node: "ONT_H", kind: "continuous", role: "position", weight: 0.7, touchType: "malleability_mechanism" },
        { node: "ONT_S", kind: "continuous", role: "position", weight: 0.55, touchType: "malleability_mechanism" },
        { node: "MAT", kind: "continuous", role: "position", weight: 0.35, touchType: "malleability_mechanism" },
        { node: "CD", kind: "continuous", role: "position", weight: 0.25, touchType: "malleability_mechanism" }
      ],
      optionEvidence: {
        // "Strong state institutions — laws, programs, public education, agencies"
        // Progressive: high malleability via state. High ONT_H, high ONT_S, low MAT
        // (state-redistributionist), low CD (progressive direction).
        state_institutions: {
          continuous: {
            ONT_H: { pos: [0.02, 0.05, 0.18, 0.38, 0.37] },
            ONT_S: { pos: [0.02, 0.06, 0.18, 0.34, 0.4] },
            MAT: { pos: [0.3, 0.32, 0.22, 0.1, 0.06] },
            CD: { pos: [0.3, 0.3, 0.22, 0.12, 0.06] }
          }
        },
        // "Family, community, and local relationships — close human bonds"
        // Communitarian / pastoral. High malleability via local. Mid-low ONT_S
        // (institutions matter but not state), mid MAT, mid CD.
        family_community_tradition: {
          continuous: {
            ONT_H: { pos: [0.04, 0.1, 0.25, 0.35, 0.26] },
            ONT_S: { pos: [0.18, 0.3, 0.3, 0.15, 0.07] },
            MAT: { pos: [0.1, 0.2, 0.35, 0.22, 0.13] },
            CD: { pos: [0.1, 0.2, 0.3, 0.25, 0.15] }
          }
        },
        // "Markets, trade, and innovation — economic dynamism shapes behavior"
        // Classical liberal / market liberal. Mid ONT_H (markets discipline
        // behavior but don't really cultivate virtue), low ONT_S (state
        // institutions less essential), high MAT (free market).
        market_innovation: {
          continuous: {
            ONT_H: { pos: [0.08, 0.18, 0.32, 0.27, 0.15] },
            ONT_S: { pos: [0.3, 0.3, 0.22, 0.12, 0.06] },
            MAT: { pos: [0.04, 0.08, 0.18, 0.32, 0.38] },
            CD: { pos: [0.1, 0.2, 0.32, 0.22, 0.16] }
          }
        },
        // "Inherited cultural and religious traditions — accumulated wisdom"
        // Burkean / traditionalist. High malleability via tradition. Low/mid
        // ONT_S, mid MAT, high CD (traditional direction).
        cultural_inherited: {
          continuous: {
            ONT_H: { pos: [0.04, 0.1, 0.25, 0.35, 0.26] },
            ONT_S: { pos: [0.2, 0.3, 0.28, 0.15, 0.07] },
            MAT: { pos: [0.1, 0.18, 0.32, 0.25, 0.15] },
            CD: { pos: [0.04, 0.08, 0.22, 0.32, 0.34] }
          }
        },
        // "Society doesn't really improve — gains are illusory or temporary"
        // Fatalist / nihilist. Very low ONT_H (humans not really malleable),
        // low ONT_S (institutions can't deliver), neutral MAT/CD.
        doesnt_improve: {
          continuous: {
            ONT_H: { pos: [0.42, 0.3, 0.18, 0.07, 0.03] },
            ONT_S: { pos: [0.4, 0.3, 0.18, 0.08, 0.04] },
            MAT: { pos: [0.2, 0.25, 0.3, 0.15, 0.1] },
            CD: { pos: [0.18, 0.22, 0.3, 0.18, 0.12] }
          }
        }
      }
    },
    // Q52 removed 2026-04-24: redundant with Q102 membership_criteria_priority_sort,
    // which covers the same CU+TRB_ANCHOR signal via a richer priority-sort UI.
    // Q54 — religion_in_upbringing — DEPRECATED 2026-04-28 (PR 2 priority 4).
    // Religion-of-upbringing is demographic background, not political-position
    // evidence. Pre-deprecation evidence map equated "raised religious" with
    // MOR-low (parochial) + CD-high (traditional) — sociologically common
    // correlation but factually weak: a person raised religious can be
    // politically MOR-universalist + CD-progressive, and vice versa. Empty
    // touchProfile causes the question-pool filter (api.ts:442) to exclude
    // this from active rotation. Definition kept for documentation.
    {
      id: 54,
      stage: "stage3",
      section: "V",
      promptShort: "religion_in_upbringing",
      uiType: "single_choice",
      quality: 0.4,
      rewriteNeeded: false,
      touchProfile: []
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
            AES: { cat: [0.05, 0.05, 0.4, 0.4, 0.05, 0.05] },
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
            AES: { cat: [0.06, 0.05, 0.5, 0.25, 0.05, 0.09] },
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
            AES: { cat: [0.04, 0.04, 0.45, 0.35, 0.05, 0.07] }
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
        { node: "PRO", kind: "continuous", role: "salience", weight: 0.2, touchType: "motive_salience" },
        { node: "COM", kind: "continuous", role: "salience", weight: 0.2, touchType: "motive_salience" },
        { node: "MOR", kind: "continuous", role: "salience", weight: 0.2, touchType: "motive_salience" },
        { node: "PF", kind: "continuous", role: "position", weight: 0.25, touchType: "motive_activation" },
        { node: "TRB", kind: "continuous", role: "position", weight: 0.25, touchType: "motive_activation" },
        { node: "ENG", kind: "continuous", role: "position", weight: 0.3, touchType: "motive_activation" },
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
            TRB: { pos: [0.05, 0.12, 0.25, 0.33, 0.25] },
            PF: { pos: [0.04, 0.1, 0.24, 0.35, 0.27] }
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
            ENG: { pos: [0.02, 0.06, 0.2, 0.38, 0.34] },
            TRB: { pos: [0.08, 0.16, 0.3, 0.28, 0.18] }
          }
        },
        self_interest: {
          // Self-interest → high salience on ENG (engaged for personal stakes)
          continuous: {
            ENG: { pos: [0.08, 0.18, 0.32, 0.27, 0.15] }
          },
          categorical: { EPS: { cat: EPS_PROTOTYPES.autonomous } }
        },
        intellectual_challenge: {
          // Intellectual challenge → salience on ENG, EPS category
          continuous: {
            ENG: { pos: [0.05, 0.15, 0.35, 0.3, 0.15] }
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
    // Q22 re-added 2026-04-25 per ADR-009 with conflict-framing rewrite. The
    // original allocation version conflated overlapping sources (expert
    // consensus and personal research aren't separable). New version asks
    // about tie-breaking when sources disagree — forces a real choice between
    // distinct authority claims.
    {
      id: 22,
      stage: "fixed12",
      section: "II",
      promptShort: "source_trust_conflict",
      uiType: "single_choice",
      quality: 0.92,
      rewriteNeeded: false,
      options: [
        "expert_consensus_breaks_tie",
        "primary_evidence_breaks_tie",
        "lived_experience_breaks_tie",
        "tradition_breaks_tie",
        "follow_money_breaks_tie"
      ],
      touchProfile: [
        // EPS/salience row dropped 2026-05-03 per question-information audit:
        // Q22 single_choice has no strengthFollowUp and no per-option .sal arrays,
        // so the engine never updated EPS salience from this question. EPS salience
        // is supplied by Q103 (issue salience screener) and Q89 (best_worst battery).
        { node: "EPS", kind: "categorical", role: "category", weight: 0.92, touchType: "tie_breaker_authority" }
      ],
      optionEvidence: {
        // Expert consensus wins when claims conflict → institutionalist
        expert_consensus_breaks_tie: {
          categorical: { EPS: { cat: [0.04, 0.66, 0.1, 0.05, 0.1, 0.05] } }
        },
        // Direct primary-source evidence wins → empiricist
        primary_evidence_breaks_tie: {
          categorical: { EPS: { cat: [0.62, 0.16, 0.04, 0.06, 0.1, 0.02] } }
        },
        // Direct lived experience of those affected wins → intuitionist
        lived_experience_breaks_tie: {
          categorical: { EPS: { cat: [0.06, 0.08, 0.06, 0.62, 0.14, 0.04] } }
        },
        // Long-standing inherited / community wisdom wins → traditionalist
        tradition_breaks_tie: {
          categorical: { EPS: { cat: [0.04, 0.06, 0.66, 0.12, 0.08, 0.04] } }
        },
        // "Look at who benefits before trusting any source" → nihilist/cynic
        follow_money_breaks_tie: {
          categorical: { EPS: { cat: [0.06, 0.04, 0.06, 0.06, 0.18, 0.6] } }
        }
      }
    },
    // =========================================================================
    // RANKING EVIDENCE MAPS (Q29, Q50)
    // =========================================================================
    // Q29 — factory_closure_causes_ranking (ranking)
    // PR 2 rebalance 2026-04-28: strip out unjustified ZS smuggling and most
    // ONT_S signals. Per the three-dump review:
    //  - "blame corporations" (corporate_decisions) is a redistributive critique
    //    (MAT-low) — it does NOT imply zero-sum worldview. A Democrat can think
    //    corporate power is too concentrated AND think the economy is positive-sum.
    //  - "blame automation / global competition" are structural-economic causes,
    //    not signals about institutional capacity. Stripped from ONT_S.
    //  - "blame govt policy" is the only option where ONT_S-skeptical signal is
    //    defensible (mild) — kept.
    //  - "blame worker_choices" is a market-individualist framing → MAT-positive
    //    only; doesn't say anything about institutional belief.
    // Phase 0 verification (scripts/compute-q29-contribution.ts): pre-rebalance
    // Q29 dragged Dump 2's ONT_S by -1.007 and ZS by +1.412 — both confirmed
    // wrong-direction culprits of the Institutional Leftist miscalibration.
    // Predicted post-rebalance impact on Dump 2: ZS no longer pushed (was +1.4),
    // ONT_S only mildly pulled by govt_policy at rank 2 (~-0.17 vs prior -1.0).
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
        { node: "ONT_S", kind: "continuous", role: "position", weight: 0.3, touchType: "economic_attribution" },
        { node: "CU", kind: "continuous", role: "position", weight: 0.2, touchType: "trade_protectionism" }
      ],
      rankingMap: {
        // Cheaper-labor-abroad framing → mild protectionist (CU low, national).
        // Stripped: ONT_S (institutional-capacity not implicated) and ZS (trade
        // can be positive-sum even when one believes outsourcing hurts workers).
        global_competition: {
          continuous: { CU: -0.3 }
        },
        // Tech-replaces-labor framing → mild redistributive concern. Stripped:
        // ONT_S (automation doesn't say anything about institutions).
        automation: {
          continuous: { MAT: -0.2 }
        },
        // Corporate-power critique → strong redistributive signal. Stripped: ZS
        // (the entire wrong-direction culprit for Dump 2's positive-sum miss).
        corporate_decisions: {
          continuous: { MAT: -0.6 }
        },
        // Govt-policy framing → mild ONT_S-skeptical (govt-mismanagement view).
        // Stripped: MAT (ambiguous direction — could be free-trade-blame OR
        // regulation-blame, the engine can't tell).
        government_policy: {
          continuous: { ONT_S: -0.3 }
        },
        // Individual-responsibility framing → market-individualist (MAT high).
        // Stripped: ONT_S (worker-choices framing isn't pro-institution).
        worker_choices: {
          continuous: { MAT: 0.6 }
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
        { node: "MAT", kind: "continuous", role: "position", weight: 0.15, touchType: "economic_membership_expectation" }
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
        { node: "MAT", kind: "continuous", role: "salience", weight: 0.18, touchType: "best_worst_asymmetric" },
        { node: "CU", kind: "continuous", role: "salience", weight: 0.18, touchType: "best_worst_asymmetric" },
        { node: "COM", kind: "continuous", role: "salience", weight: 0.18, touchType: "best_worst_asymmetric" },
        { node: "CD", kind: "continuous", role: "salience", weight: 0.12, touchType: "best_worst_asymmetric" },
        { node: "ZS", kind: "continuous", role: "salience", weight: 0.12, touchType: "best_worst_asymmetric" },
        { node: "TRB", kind: "continuous", role: "position", weight: 0.12, touchType: "best_worst_asymmetric" },
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
          continuous: { PRO: 0.55 },
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
        // ONT_S likelihoods softened 2026-04-24: original distributions made
        // "frustrated about a specific issue" read as "system fundamentally
        // broken" (e.g., corporate_power_inequality peaked ONT_S at 1 with
        // 0.45 mass — too sharp). Softened so a Democrat frustrated about
        // corporate power doesn't get classified as system-rejectionist when
        // they actually trust most institutions. Only system_unjust retains
        // a sharp ONT_S=1 peak — the only option whose semantic intent IS
        // "the whole system is broken."
        // "Corporations and the wealthy have too much power, ordinary people are left behind"
        corporate_power_inequality: {
          continuous: {
            MAT: { pos: [0.18, 0.32, 0.28, 0.15, 0.07] },
            ONT_S: { pos: [0.2, 0.3, 0.3, 0.15, 0.05] }
          }
        },
        // "Government has grown too large and intrusive, individual freedom is eroding"
        government_overreach: {
          continuous: {
            ONT_S: { pos: [0.2, 0.28, 0.28, 0.16, 0.08] },
            PRO: { pos: [0.18, 0.28, 0.3, 0.16, 0.08] }
          }
        },
        // "Both sides are more interested in fighting than solving real problems"
        both_sides_broken: {
          continuous: {
            ONT_S: { pos: [0.3, 0.32, 0.22, 0.12, 0.04] }
          }
        },
        // "The system itself is fundamentally unjust and needs radical change"
        // Kept sharp — this is the option where ONT_S=1 is the actual semantic claim
        system_unjust: {
          continuous: {
            ONT_S: { pos: [0.55, 0.28, 0.1, 0.05, 0.02] }
          }
        },
        // "Traditional values and social cohesion are being abandoned"
        values_eroding: {
          continuous: {
            CD: { pos: [0.03, 0.07, 0.15, 0.3, 0.45] },
            ONT_S: { pos: [0.2, 0.28, 0.28, 0.16, 0.08] }
          }
        },
        // "I don't think much about politics — it doesn't affect my daily life"
        politics_irrelevant: {
          continuous: {
            ENG: { pos: [0.62, 0.22, 0.1, 0.04, 0.02] }
          }
        },
        // "I'm not especially frustrated — the system works reasonably well"
        // Added 2026-04-24 per diagnose-cu-trb-coverage finding: every prior
        // option peaked ONT_S at pos=1-2, dragging even system-trusting
        // respondents toward "system broken". This option anchors the high pole.
        system_works: {
          continuous: {
            ONT_S: { pos: [0.03, 0.07, 0.15, 0.3, 0.45] }
          }
        }
      }
    },
    {
      id: 66,
      stage: "stage2",
      section: "VI",
      promptShort: "community_fund_allocation",
      uiType: "allocation",
      quality: 0.89,
      rewriteNeeded: false,
      touchProfile: [
        { node: "CD", kind: "continuous", role: "position", weight: 0.75, touchType: "value_allocation" },
        { node: "PRO", kind: "continuous", role: "position", weight: 0.6, touchType: "governance_allocation" },
        { node: "MAT", kind: "continuous", role: "position", weight: 0.2, touchType: "economic_proxy" },
        { node: "COM", kind: "continuous", role: "position", weight: 0.35, touchType: "governance_allocation" },
        { node: "AES", kind: "categorical", role: "category", weight: 0.35, touchType: "civic_style_allocation" }
      ],
      allocationMap: {
        preserve_heritage: {
          continuous: { CD: 0.7, PRO: -0.2 },
          categorical: { AES: [0.08, 0.05, 0.55, 0.16, 0.04, 0.12] }
        },
        modernize_infrastructure: {
          continuous: { CD: -0.2, PRO: 0.2, MAT: 0.2 },
          categorical: { AES: [0.1, 0.6, 0.04, 0.06, 0.03, 0.17] }
        },
        community_deliberation: {
          continuous: { PRO: 0.7, COM: 0.5 },
          categorical: { AES: [0.42, 0.12, 0.12, 0.25, 0.04, 0.05] }
        },
        market_based_development: {
          continuous: { MAT: 0.8, PRO: -0.5 },
          categorical: { AES: [0.08, 0.42, 0.04, 0.07, 0.04, 0.35] }
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
      // AES/category row dropped 2026-05-03 per question-information audit:
      // the only option that referenced AES (`gut_feeling`) used
      // `AES_PROTOTYPES.plainspoken` which is undefined (no such category — the
      // 6 AES categories are statesman/technocrat/pastoral/authentic/fighter/
      // visionary). Engine never updated AES from this question. Orphan reference
      // in `gut_feeling.categorical.AES` is silently no-op at runtime.
      touchProfile: [
        { node: "EPS", kind: "categorical", role: "category", weight: 0.95, touchType: "decision_style" }
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
    // Q78 speaker_appeal — converted from single_choice to best_worst (pick
    // 2 most compelling, 2 least compelling) on 2026-05-08 per Sam's
    // observation that picking ONE max throws away signal. With best/worst,
    // each respondent gives 4 distinct AES-prototype data points (positive on
    // top picks, negative on bottom picks) instead of 1.
    //
    // The "I don't really care" option (dont_care_style) is dropped — best_worst
    // already encodes low AES salience naturally when the respondent's picks
    // don't cluster on a coherent style.
    {
      id: 78,
      stage: "stage2",
      section: "V",
      promptShort: "speaker_appeal",
      uiType: "best_worst",
      bwMaxPicks: 2,
      quality: 0.94,
      rewriteNeeded: false,
      // 2026-05-13 (Sam): each AES prototype option now carries weak continuous
      // payloads for the belief axes its rhetorical style empirically tracks
      // with. Each respondent's 4 picks (2 best + 2 worst) now inform 5-7
      // nodes rather than just AES. Weight 0.20 per side-touch (sub-
      // MEANINGFUL_POSITION_WEIGHT=0.4, so topKDrill won't treat the node as
      // drilled). pos shapes are mild leans, peak ratio ~2:1 — easily
      // overpowered by a single direct position question.
      touchProfile: [
        { node: "AES", kind: "categorical", role: "category", weight: 0.92, touchType: "rhetorical_maxdiff" },
        { node: "AES", kind: "categorical", role: "salience", weight: 0.45, touchType: "rhetorical_maxdiff" },
        { node: "EPS", kind: "categorical", role: "category", weight: 0.15, touchType: "style_proxy" },
        { node: "COM", kind: "continuous", role: "position", weight: 0.2, touchType: "rhetorical_side_signal" },
        { node: "MOR", kind: "continuous", role: "position", weight: 0.2, touchType: "rhetorical_side_signal" },
        { node: "ONT_S", kind: "continuous", role: "position", weight: 0.2, touchType: "rhetorical_side_signal" },
        { node: "PRO", kind: "continuous", role: "position", weight: 0.2, touchType: "rhetorical_side_signal" },
        { node: "ZS", kind: "continuous", role: "position", weight: 0.2, touchType: "rhetorical_side_signal" },
        { node: "ONT_H", kind: "continuous", role: "position", weight: 0.2, touchType: "rhetorical_side_signal" },
        { node: "CU", kind: "continuous", role: "position", weight: 0.2, touchType: "rhetorical_side_signal" }
      ],
      rankingMap: {
        // bridge_builder (statesman): compromise-friendly, universal-leaning,
        // process-respecting.
        bridge_builder: {
          categorical: { AES: AES_PROTOTYPES.statesman },
          continuous: {
            COM: { pos: [0.14, 0.16, 0.2, 0.25, 0.25] },
            // high (dealmaking)
            MOR: { pos: [0.14, 0.16, 0.2, 0.25, 0.25] },
            // universal-lean
            PRO: { pos: [0.14, 0.16, 0.2, 0.25, 0.25] }
            // process-oriented
          }
        },
        // deep_expertise (technocrat): expertise + institutions + process.
        deep_expertise: {
          categorical: { AES: AES_PROTOTYPES.technocrat, EPS: EPS_PROTOTYPES.empiricist },
          continuous: {
            ONT_S: { pos: [0.14, 0.16, 0.2, 0.25, 0.25] },
            // institutions matter
            PRO: { pos: [0.14, 0.16, 0.2, 0.25, 0.25] }
            // process-oriented
          }
        },
        // community_voice (pastoral): culturally rooted, in-group focus,
        // skeptical of distant institutions.
        community_voice: {
          categorical: { AES: AES_PROTOTYPES.pastoral },
          continuous: {
            CU: { pos: [0.14, 0.16, 0.2, 0.25, 0.25] },
            // common-culture lean
            ONT_S: { pos: [0.25, 0.25, 0.2, 0.16, 0.14] }
            // less institutional
          }
        },
        // says_what_they_think (authentic + intuitionist): anti-compromise,
        // anti-establishment.
        says_what_they_think: {
          categorical: { AES: AES_PROTOTYPES.authentic, EPS: EPS_PROTOTYPES.intuitionist },
          continuous: {
            COM: { pos: [0.25, 0.25, 0.2, 0.16, 0.14] },
            // anti-compromise
            PRO: { pos: [0.25, 0.25, 0.2, 0.16, 0.14] }
            // anti-procedural
          }
        },
        // calls_out_power (fighter): zero-sum view of conflict, action over
        // process, suspicious of institutions.
        calls_out_power: {
          categorical: { AES: AES_PROTOTYPES.fighter },
          continuous: {
            ZS: { pos: [0.14, 0.16, 0.2, 0.25, 0.25] },
            // zero-sum lean
            PRO: { pos: [0.25, 0.25, 0.2, 0.16, 0.14] },
            // action > process
            ONT_S: { pos: [0.25, 0.25, 0.2, 0.16, 0.14] }
            // anti-institutional
          }
        },
        // big_picture (visionary): people can change, humanity-wide concern,
        // positive-sum vision.
        big_picture: {
          categorical: { AES: AES_PROTOTYPES.visionary },
          continuous: {
            ONT_H: { pos: [0.14, 0.16, 0.2, 0.25, 0.25] },
            // environment shapes
            MOR: { pos: [0.14, 0.16, 0.2, 0.25, 0.25] },
            // universal-lean
            ZS: { pos: [0.25, 0.25, 0.2, 0.16, 0.14] }
            // positive-sum
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
        { node: "ENG", kind: "continuous", role: "position", weight: 0.15, touchType: "epistemic_withdrawal" }
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
        // 2026-05-13: dropped `check_experience` ("matches my personal experience") —
        // respondents conflated it with `check_values` ("aligns with my values"). Both
        // framings read as "trust my own judgment over the experts." Intuitionist
        // signal is preserved via Q22's `lived_experience_breaks_tie`.
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
            ENG: { pos: [0.7, 0.2, 0.08, 0.02, 0] }
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
        // MOR pos=1 (narrow): cultural in-group preservation → parochial moral scope.
        preserve_culture: {
          continuous: {
            CD: { pos: [0.02, 0.05, 0.13, 0.3, 0.5] },
            CU: { pos: [0.5, 0.28, 0.14, 0.05, 0.03] },
            MOR: { pos: [0.4, 0.3, 0.18, 0.08, 0.04] }
          },
          // 2026-05-13: ethnocultural-preservation framing → national in-group preference.
          moralCircle: { scopedAffinities: { national: 75 } }
        },
        // B: Stay open, but newcomers should adopt common civic culture
        // PR 2 priority 5 rebalance 2026-04-28 — pre-fix likelihoods were
        // internally inconsistent: CD peaked pos=4 (traditional) and CU peaked
        // pos=4 (pluralist) for an option labeled "civic assimilation." Civic-
        // nationalism is centrist on CD and assimilationist-lean on CU — not
        // traditional, not pluralist. Surfaced by Dump 2 (Sam picked this option;
        // engine pushed CD +0.62 toward traditional and CU +0.50 toward pluralist
        // — both wrong-direction for his progressive intent).
        // Refit: CD centrist peak (pos=3), CU assimilationist-lean peak (pos=2),
        // MOR unchanged (centrist civic-frame doesn't bias scope).
        civic_assimilation: {
          continuous: {
            CD: { pos: [0.1, 0.2, 0.4, 0.2, 0.1] },
            CU: { pos: [0.08, 0.18, 0.32, 0.27, 0.15] },
            MOR: { pos: [0.15, 0.25, 0.35, 0.18, 0.07] }
          }
        },
        // C: Stay open, don't demand cultural convergence
        // MOR pos=5 (wide): cosmopolitan non-convergence → universalist moral scope.
        open_pluralist: {
          continuous: {
            CD: { pos: [0.5, 0.3, 0.13, 0.05, 0.02] },
            CU: { pos: [0.03, 0.05, 0.14, 0.28, 0.5] },
            MOR: { pos: [0.05, 0.1, 0.2, 0.3, 0.35] }
          },
          // 2026-05-13: explicit "don't demand convergence" → wide universal scope.
          moralCircle: { universal: 80 }
        },
        // D: Cultural questions matter less than economic fairness
        // MOR pos=3 (neutral): deflects cultural framing → no MOR signal direction.
        economics_first: {
          continuous: {
            MAT: { pos: [0.4, 0.3, 0.18, 0.08, 0.04] },
            CD: { pos: [0.15, 0.25, 0.35, 0.15, 0.1] },
            CU: { pos: [0.15, 0.25, 0.3, 0.2, 0.1] },
            MOR: { pos: [0.15, 0.22, 0.32, 0.2, 0.11] }
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
      // ONT_H weight lowered 2026-04-26 from 0.45 → 0.20 per ADR-010. Q84 is
      // primarily a ZS / ONT_S probe ("institutions corrupt over time"); the
      // ONT_H residual was reading "humans dominate when given hierarchy" as
      // pessimistic-fixed-nature, but under malleability framing that's an
      // ambiguous signal (could be either fixed-bad or "humans are malleable
      // toward domination if given the chance"). Reduced to a light residual.
      touchProfile: [
        { node: "ZS", kind: "continuous", role: "position", weight: 0.6, touchType: "zero_sum_institutions" },
        { node: "ZS", kind: "continuous", role: "salience", weight: 0.6, touchType: "zero_sum_institutions" },
        { node: "ONT_H", kind: "continuous", role: "position", weight: 0.2, touchType: "hierarchy_trust" },
        { node: "COM", kind: "continuous", role: "position", weight: 0.25, touchType: "compromise_signal" },
        { node: "PRO", kind: "continuous", role: "position", weight: 0.15, touchType: "procedural_trust" },
        { node: "EPS", kind: "categorical", role: "category", weight: 0.3, touchType: "institutional_nihilism" }
      ],
      sliderMap: {
        // 1 = strongly disagree (institutions are fine, hierarchy natural)
        "0-20": {
          continuous: {
            ZS: { pos: [0.55, 0.25, 0.12, 0.05, 0.03], sal: [0.55, 0.3, 0.12, 0.03] },
            ONT_H: { pos: [0.03, 0.05, 0.12, 0.28, 0.52] },
            COM: { pos: [0.05, 0.1, 0.22, 0.35, 0.28] },
            PRO: { pos: [0.05, 0.1, 0.25, 0.35, 0.25] }
          },
          categorical: {
            EPS: { cat: [0.15, 0.5, 0.15, 0.08, 0.1, 0.02] }
          }
        },
        // 2 = disagree
        "21-40": {
          continuous: {
            ZS: { pos: [0.3, 0.35, 0.22, 0.08, 0.05], sal: [0.3, 0.4, 0.22, 0.08] },
            ONT_H: { pos: [0.05, 0.1, 0.22, 0.38, 0.25] },
            COM: { pos: [0.08, 0.15, 0.3, 0.3, 0.17] },
            PRO: { pos: [0.08, 0.12, 0.3, 0.3, 0.2] }
          },
          categorical: {
            EPS: { cat: [0.2, 0.38, 0.14, 0.12, 0.12, 0.04] }
          }
        },
        // 3 = mixed
        "41-60": {
          continuous: {
            ZS: { pos: [0.1, 0.2, 0.4, 0.2, 0.1], sal: [0.12, 0.28, 0.38, 0.22] },
            ONT_H: { pos: [0.1, 0.2, 0.4, 0.2, 0.1] },
            COM: { pos: [0.12, 0.22, 0.32, 0.22, 0.12] },
            PRO: { pos: [0.12, 0.22, 0.32, 0.22, 0.12] }
          },
          categorical: {
            EPS: { cat: [0.17, 0.22, 0.17, 0.17, 0.17, 0.1] }
          }
        },
        // 4 = agree (institutions tend toward domination)
        "61-80": {
          continuous: {
            ZS: { pos: [0.05, 0.08, 0.22, 0.35, 0.3], sal: [0.04, 0.15, 0.4, 0.41] },
            ONT_H: { pos: [0.25, 0.38, 0.22, 0.1, 0.05] },
            COM: { pos: [0.17, 0.3, 0.3, 0.15, 0.08] },
            PRO: { pos: [0.2, 0.3, 0.3, 0.12, 0.08] }
          },
          categorical: {
            EPS: { cat: [0.08, 0.08, 0.1, 0.17, 0.25, 0.32] }
          }
        },
        // 5 = strongly agree (institutions always corrupt, domination inevitable)
        "81-100": {
          continuous: {
            ZS: { pos: [0.03, 0.05, 0.12, 0.25, 0.55], sal: [0.02, 0.08, 0.3, 0.6] },
            ONT_H: { pos: [0.52, 0.28, 0.12, 0.05, 0.03] },
            COM: { pos: [0.28, 0.35, 0.22, 0.1, 0.05] },
            PRO: { pos: [0.25, 0.35, 0.25, 0.1, 0.05] }
          },
          categorical: {
            EPS: { cat: [0.04, 0.04, 0.08, 0.1, 0.14, 0.6] }
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
        { node: "COM", kind: "continuous", role: "position", weight: 0.08, touchType: "compromise_signal" },
        { node: "EPS", kind: "categorical", role: "category", weight: 0.2, touchType: "legitimacy_authority" }
      ],
      optionEvidence: {
        // A: It carries inherited ways of life forward
        inherited_tradition: {
          continuous: {
            PRO: { pos: [0.05, 0.12, 0.25, 0.35, 0.23] },
            CD: { pos: [0.04, 0.08, 0.18, 0.3, 0.4] }
          },
          categorical: {
            EPS: { cat: [0.05, 0.1, 0.55, 0.15, 0.1, 0.05] }
          }
        },
        // B: It follows neutral constitutional rules and procedures
        procedural_rules: {
          continuous: {
            PRO: { pos: [0.01, 0.04, 0.12, 0.28, 0.55] },
            COM: { pos: [0.05, 0.1, 0.25, 0.35, 0.25] }
          },
          categorical: {
            EPS: { cat: [0.35, 0.3, 0.1, 0.1, 0.1, 0.05] }
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
            EPS: { cat: [0.1, 0.1, 0.08, 0.08, 0.3, 0.34] }
          }
        },
        // D: It advances justice, even if rules sometimes have to bend
        justice_first: {
          continuous: {
            PRO: { pos: [0.55, 0.28, 0.12, 0.04, 0.01] },
            COM: { pos: [0.25, 0.3, 0.25, 0.12, 0.08] }
          },
          categorical: {
            EPS: { cat: [0.05, 0.05, 0.05, 0.45, 0.15, 0.25] }
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
        { node: "ENG", kind: "continuous", role: "position", weight: 0.55, touchType: "thought_frequency_proxy" }
      ],
      optionEvidence: {
        // A: Rarely — only during elections or big news
        rarely_elections: {
          continuous: {
            PF: { pos: [0.55, 0.28, 0.12, 0.03, 0.02] },
            ENG: { pos: [0.6, 0.25, 0.1, 0.04, 0.01] }
          }
        },
        // B: Sometimes — when something big happens I'll think about it
        sometimes_events: {
          continuous: {
            PF: { pos: [0.2, 0.4, 0.25, 0.12, 0.03] },
            ENG: { pos: [0.25, 0.4, 0.22, 0.1, 0.03] }
          }
        },
        // C: Regularly — part of my daily media and conversations
        regularly_daily: {
          continuous: {
            PF: { pos: [0.05, 0.15, 0.35, 0.32, 0.13] },
            ENG: { pos: [0.04, 0.12, 0.3, 0.36, 0.18] }
          }
        },
        // D: Constantly — politics shapes how I see most things
        constantly_worldview: {
          continuous: {
            PF: { pos: [0.02, 0.05, 0.15, 0.33, 0.45] },
            ENG: { pos: [0.01, 0.04, 0.12, 0.3, 0.53] }
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
        { node: "MOR", kind: "continuous", role: "position", weight: 0.2, touchType: "in_group_proxy" }
      ],
      optionEvidence: {
        // A: Personal — like it's happening to me
        // MOR pos=1 (narrow): strong in-group identification → parochial moral scope.
        personal_feels: {
          continuous: {
            TRB: { pos: [0.02, 0.05, 0.15, 0.33, 0.45] },
            MOR: { pos: [0.4, 0.32, 0.18, 0.07, 0.03] }
          }
        },
        // B: Important — I pay attention and care
        // MOR moderate-narrow: in-group matters but not all-consuming.
        important_care: {
          continuous: {
            TRB: { pos: [0.05, 0.18, 0.38, 0.28, 0.11] },
            MOR: { pos: [0.15, 0.3, 0.35, 0.15, 0.05] }
          }
        },
        // C: Aware but it doesn't really touch me
        // MOR moderate-wide: detached from in-group → scope drifts outward.
        aware_distant: {
          continuous: {
            TRB: { pos: [0.25, 0.4, 0.22, 0.1, 0.03] },
            MOR: { pos: [0.08, 0.17, 0.35, 0.28, 0.12] }
          }
        },
        // D: Not really — I don't see myself mainly through group identity
        // MOR pos=5 (wide): universalist self-concept → universal moral scope.
        universalist_self: {
          continuous: {
            TRB: { pos: [0.55, 0.28, 0.12, 0.03, 0.02] },
            MOR: { pos: [0.03, 0.07, 0.2, 0.3, 0.4] }
          },
          // 2026-05-13: explicit "I don't see myself through group identity" →
          // universal baseline. Only this option emits moralCircle — the in-group
          // responses (personal_feels / important_care) are scope-agnostic (we don't
          // know which scope is active without Q60), so they do NOT emit scoped
          // evidence here.
          moralCircle: { universal: 80 }
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
        eps_autonomous: { categorical: { EPS: EPS_PROTOTYPES.autonomous } }
        // eps_nihilist removed 2026-04-24 per user feedback: option reads as
        // redundant with eps_autonomous ("trust in yourself"). Nihilist category
        // still exists in the archetype library; coverage shifts to Q79
        // expert_disagreement_reaction's nihilist-specific branch.
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
      // priorityBattery removed 2026-04-27 (Salience-Router Phase 3): Q99 is
      // no longer in the fixed front door, so its priority-battery flag would
      // auto-fire it for every respondent in EIG_FILL — defeating the
      // adaptive-divergence goal.
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
        { node: "TRB", kind: "continuous", role: "position", weight: 0.8, touchType: "cross_partisan_tolerance" }
        // MOR dropped 2026-04-24 per audit: rankingMap carries no MOR evidence
        // per item, so the declared touch was inflating coverage counts without
        // delivering posterior updates. TRB is what Q99 actually measures.
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
      // Deprecated 2026-04-26: the direct AES max-diff probe (Q218) replaces the
      // fighter-vs-statesman conjoint proxy. Leaving the definition in place
      // preserves ID stability, but an empty touchProfile keeps it out of the
      // active quiz.
      touchProfile: [],
      optionEvidence: {}
    },
    // ─────────────────────────────────────────────────────────────────────────
    // Q217 - Direct epistemic category ranking. Added 2026-04-26 because EPS
    // should not be inferred mostly from proxy situations. This asks the six
    // canonical epistemic styles directly and rank-weights the full order.
    {
      id: 217,
      stage: "fixed12",
      section: "II",
      promptShort: "epistemic_style_ranking",
      promptFull: "Rank these ways of deciding what is politically true from most like you to least like you.",
      uiType: "ranking",
      quality: 0.96,
      rewriteNeeded: false,
      optionLabels: {
        eps_empiricist: "Evidence-first - studies, data, measurement, and observable results",
        eps_institutionalist: "Institutional confidence - expert consensus, courts, agencies, journals, and professional standards",
        eps_traditionalist: "Inherited wisdom - long-standing traditions, religious teaching, and practices that have endured",
        eps_intuitionist: "Moral intuition - conscience, gut sense, and felt right-or-wrong",
        eps_autonomous: "Independent reasoning - work it out myself; no authority gets automatic deference",
        eps_nihilist: "Radical skepticism - most sources are compromised, so claims need deep suspicion"
      },
      touchProfile: [
        { node: "EPS", kind: "categorical", role: "category", weight: 0.95, touchType: "direct_epistemic_rank" }
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
    // Q218 - Direct aesthetic category max-diff. Added 2026-04-26 so AES does
    // not depend on a single bundled leader conjoint. This asks the six canonical
    // political aesthetics directly and uses most/least appealing picks.
    {
      id: 218,
      stage: "fixed12",
      section: "V",
      promptShort: "aesthetic_style_ranking",
      promptFull: "Pick the political leadership style you find most appealing and the one you find least appealing.",
      uiType: "best_worst",
      bwMaxPicks: 1,
      quality: 0.96,
      rewriteNeeded: false,
      optionLabels: {
        // Style-only descriptions (2026-04-26): previous labels conflated
        // aesthetic with belief content (e.g., pastoral "tradition-aware" was
        // really CD content; statesman "constitutional" was ONT_S/PRO content).
        // AES is presentation/persona/rhetorical mode — what kind of leader
        // appeals to you stylistically — independent of their beliefs. A
        // traditionalist can be visionary, a progressive can be statesman, etc.
        aes_statesman: "Statesman - formal and dignified, measured tone, ceremonial register, presidential bearing",
        aes_technocrat: "Technocrat - precise and analytical, expert-coded delivery, comfortable with technical detail and jargon",
        aes_pastoral: "Pastoral - warm hometown register, regional cadence, family-and-community language, evocative and emotional",
        aes_authentic: "Authentic - direct and casual, unscripted, refuses polish and political theater, talks like a regular person",
        aes_fighter: "Fighter - combative tone, willing to attack opponents directly, confrontational delivery, doesn't soften",
        aes_visionary: "Visionary - lyrical and aspirational, evocative-imagistic rhetoric, paints pictures with words"
      },
      touchProfile: [
        { node: "AES", kind: "categorical", role: "category", weight: 0.95, touchType: "direct_aesthetic_maxdiff" },
        { node: "AES", kind: "categorical", role: "salience", weight: 0.35, touchType: "direct_aesthetic_maxdiff" }
      ],
      bestWorstMap: {
        aes_statesman: { categorical: { AES: AES_PROTOTYPES.statesman } },
        aes_technocrat: { categorical: { AES: AES_PROTOTYPES.technocrat } },
        aes_pastoral: { categorical: { AES: AES_PROTOTYPES.pastoral } },
        aes_authentic: { categorical: { AES: AES_PROTOTYPES.authentic } },
        aes_fighter: { categorical: { AES: AES_PROTOTYPES.fighter } },
        aes_visionary: { categorical: { AES: AES_PROTOTYPES.visionary } }
      }
    },
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
      // priorityBattery removed 2026-04-27 (Salience-Router Phase 3): Q101 is
      // pending rewrite — user flagged that the omnibus "social-direction"
      // axis incorrectly conflates abortion / LGBT / trans / religion into
      // one bucket. With priorityBattery removed, it's adaptive-only and
      // unlikely to fire absent very-high CD salience. Will be replaced by
      // split conjoint questions in a separate workstream.
      quality: 0.88,
      rewriteNeeded: true,
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
    //   anyone_willing, no_gatekeeping → high CU (pluralist — anti-criterion)
    // All-essential respondent excluding the pluralist items = demanding
    // assimilationist (CU=1 lock). Only civic_part+shared_values essential =
    // civic nationalist (CU=3). Pluralist items essential with everything else
    // irrelevant = strong CU=5 signal (fixes the 2026-04-24 diagnostic finding
    // that CU=5 targets were getting recovered as CU=2-3).
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
        speak_lang: "Being able to speak the national language",
        shared_values: "Believing in the core civic values (liberty, equality, rule of law)",
        civic_part: "Participating in civic life \u2014 voting, jury duty, community involvement",
        cultural: "Adopting cultural customs, holidays, and traditions",
        ancestry: "Having ancestral roots in the country going back generations",
        religion: "Sharing the country's religious heritage and traditions",
        economic: "Contributing economically \u2014 holding a job, paying taxes, not being a burden"
      },
      touchProfile: [
        // Position weight reduced 2026-04-24 from 0.85 → 0.30 per ADR-008.
        // Q102 conflates polity-gatekeeping with culture-pluralism: a civic-
        // nationalist user (shared civic values matter, but pluralism in private
        // life is fine) gets read as assimilationist because Q102's items push
        // CU low when marked Essential. Lowering position weight lets Q102
        // contribute mostly salience evidence without dominating CU position.
        { node: "CU", kind: "continuous", role: "position", weight: 0.3, touchType: "membership_criteria" },
        { node: "CU", kind: "continuous", role: "salience", weight: 0.8, touchType: "membership_criteria" }
        // Other continuous position touches removed 2026-05-02: rankingMap only
        // carries CU evidence, so MOR/TRB/CD/MAT/ZS/PRO rows were hollow.
      ],
      rankingMap: {
        // Civic-membership likelihoods recalibrated 2026-04-25 per ADR-009.
        // Previous design pushed CU low for ALL items including civic ones —
        // a civic-nationalist progressive (FDR/Obama tradition) who marks
        // "shared civic values" or "civic participation" as Essential got
        // read as anti-pluralist. Re-encoded so:
        //   civic items (shared_values, civic_part) → ~neutral CU (centered
        //     at 3.0): valuing shared civic values is compatible with
        //     pluralism in private culture; gives no signal either way
        //   ethnic/religious gatekeeping (born_here, ancestry, religion) →
        //     strong CU low (peak ~1.7): these items pick out culture-of-
        //     origin as a membership criterion; that's the assimilationist
        //     position by definition
        //   language (speak_lang) → mild CU low (~2.5): functional civic
        //     requirement, slightly assimilationist but not strongly
        //   cultural / economic → mild low (already-existing, kept)
        //
        // ADR-007 (T3): items also emit moralCircle scoped evidence on the
        // matching membership-gatekeeping axis. Birth/ancestry/cultural items
        // → national scoped affinity. Religion item → religious scoped.
        // Civic items (shared_values, civic_part) → universal (civic
        // universalism within polity, not ethnic).
        born_here: { continuous: { CU: { pos: [0.5, 0.3, 0.12, 0.06, 0.02] } }, moralCircle: { scopedAffinities: { national: 75 } } },
        speak_lang: { continuous: { CU: { pos: [0.2, 0.32, 0.3, 0.12, 0.06] } }, moralCircle: { scopedAffinities: { national: 60 } } },
        shared_values: { continuous: { CU: { pos: [0.1, 0.22, 0.4, 0.2, 0.08] } }, moralCircle: { universal: 65 } },
        civic_part: { continuous: { CU: { pos: [0.08, 0.2, 0.4, 0.22, 0.1] } }, moralCircle: { universal: 65 } },
        cultural: { continuous: { CU: { pos: [0.3, 0.32, 0.22, 0.1, 0.06] } }, moralCircle: { scopedAffinities: { national: 65 } } },
        ancestry: { continuous: { CU: { pos: [0.55, 0.25, 0.1, 0.06, 0.04] } }, moralCircle: { scopedAffinities: { national: 80 } } },
        religion: { continuous: { CU: { pos: [0.55, 0.25, 0.1, 0.06, 0.04] } }, moralCircle: { scopedAffinities: { religious: 75, national: 60 } } },
        economic: { continuous: { CU: { pos: [0.2, 0.3, 0.32, 0.12, 0.06] } }, moralCircle: { scopedAffinities: { national: 55 } } }
      }
    },
    // Q103 — Issue Salience Screener (pre-quiz rule-out pass).
    // Added 2026-04-23 per diagnostic `results/architecture/salience-reach-12.md`
    // finding that the Bayesian engine never reaches confident `salDist[0] ≥ 0.9`
    // on target.sal=0 nodes with existing soft salience likelihoods
    // (SAL_PRIORITY_LOW=[0.55,0.30,0.12,0.03] asymptotes at E[sal]=0.63). This
    // priority_sort hands the engine 11 per-node salience gestures in a single
    // question, using a per-question `salienceBuckets` override to ship harder
    // likelihoods (neutral bucket = [0.90,0.08,0.02,0.00]) that can push the
    // posterior past the `salDist[0] ≥ 0.5` eligibility gate in one touch.
    // Pairs with an eligibility check in isQuestionEligible that skips position
    // questions on ruled-out nodes. Forced to position 1 in FIXED_OPENER.
    {
      id: 103,
      stage: "fixed12",
      section: "I",
      promptShort: "issue_salience_screener",
      promptFull: "Sort each political topic by how much it enters into your politics. Topics that feel central to your political identity go on the left. Topics you don't consider much go on the right.",
      uiType: "priority_sort",
      priorityBattery: true,
      quality: 0.98,
      rewriteNeeded: false,
      optionLabels: {
        // Labels rewritten 2026-04-25 for tighter alignment with each node's
        // actual position scale. Previous labels for ZS, ONT_H, and CU
        // mismatched their underlying nodes:
        //   ZS    "Partisan identity..."  → wrong node (PF/TRB territory)
        //   ONT_H "Hierarchy and order..." → mismatch (node scale is human-nature)
        //   CU    "National identity..."   → leaks into TRB anchor
        // 2026-05-13 rewrite (per Sam): tightened to 14-16 words each, no
        // "whether/whether" framing, consistent "Noun phrase — subject-matter
        // clause" pattern. Goal is to help the respondent decide salience
        // ("does this area of life matter to me?") rather than position.
        // 2026-05-13 second pass: headlines audited for pole-bias (Pluralism /
        // Cooperation / Compromise / Procedure were each leaning toward one
        // pole and could discourage respondents who lean the other way from
        // marking the topic as salient). Now each headline names the spectrum,
        // not a pole. Subtitles slightly more verbose for recognition ("yeah I
        // do think about that"), 15-19 words each.
        mat: "Economic life \u2014 how wealth is produced, who collects it, and how policy reshapes the distribution.",
        cd: "Direction of the culture \u2014 the pace and shape of change on family, gender, sexuality, marriage, and religion.",
        cu: "Common culture and difference \u2014 how a single political community accommodates many ways of life and belief, or whether it asks for one shared standard.",
        mor: "Reach of moral concern \u2014 how wide a circle of obligation reaches: family, country, all of humanity, or somewhere in between.",
        pro: "Process and outcomes \u2014 the weight of fair rules and due process against the urgency of getting the right result.",
        com: "Dealmaking and conviction \u2014 the terms on which political actors give ground, hold the line, or refuse to deal.",
        zs: "Cooperation and conflict \u2014 whether gains in economic, political, and cultural life come from working together or from one side winning at another's expense.",
        ont_h: "Human nature \u2014 the weight of disposition versus environment and education in shaping people's character.",
        ont_s: "Institutions \u2014 the role of formal organizations (laws, courts, agencies, treaties) in producing stability, progress, and accountability.",
        eps: "Evidence and authority \u2014 the standards by which political claims earn credibility: data, tradition, expert opinion, lived experience, gut instinct.",
        aes: "Political style \u2014 the kind of leadership and rhetorical register that resonates: fighter, statesman, visionary, technocrat, pragmatist."
      },
      // Hard likelihoods on the "neutral" bucket — the whole point of this
      // question. [0.90, 0.08, 0.02, 0.00] drives salDist[0] from uniform 0.25 to
      // ~0.90 in one touch (vs. the default SAL_PRIORITY_LOW's asymptote at 0.63).
      // supportHigh and opposeHigh mirror the Q93 defaults; supportMid softened
      // slightly to leave more probability on the middle buckets.
      salienceBuckets: {
        supportHigh: [0, 0.02, 0.08, 0.9],
        supportMid: [0.1, 0.25, 0.4, 0.25],
        neutral: [0.9, 0.08, 0.02, 0],
        opposeHigh: [0, 0.02, 0.08, 0.9]
      },
      touchProfile: [
        { node: "MAT", kind: "continuous", role: "salience", weight: 0.95, touchType: "salience_screener" },
        { node: "CD", kind: "continuous", role: "salience", weight: 0.95, touchType: "salience_screener" },
        { node: "CU", kind: "continuous", role: "salience", weight: 0.95, touchType: "salience_screener" },
        { node: "MOR", kind: "continuous", role: "salience", weight: 0.95, touchType: "salience_screener" },
        { node: "PRO", kind: "continuous", role: "salience", weight: 0.95, touchType: "salience_screener" },
        { node: "COM", kind: "continuous", role: "salience", weight: 0.95, touchType: "salience_screener" },
        { node: "ZS", kind: "continuous", role: "salience", weight: 0.95, touchType: "salience_screener" },
        { node: "ONT_H", kind: "continuous", role: "salience", weight: 0.95, touchType: "salience_screener" },
        { node: "ONT_S", kind: "continuous", role: "salience", weight: 0.95, touchType: "salience_screener" },
        { node: "EPS", kind: "categorical", role: "salience", weight: 0.95, touchType: "salience_screener" },
        { node: "AES", kind: "categorical", role: "salience", weight: 0.95, touchType: "salience_screener" }
      ],
      // Each item maps to exactly one node. Continuous items carry an empty
      // evidence object — all salience work is done by applyPrioritySort's
      // per-node bucket aggregation with this question's salienceBuckets override.
      // No position evidence: this question only rules nodes in or out, it does
      // not try to localize position on mattering nodes (that's the other 11
      // fixed-opener questions' job).
      rankingMap: {
        mat: { continuous: { MAT: {} } },
        cd: { continuous: { CD: {} } },
        cu: { continuous: { CU: {} } },
        mor: { continuous: { MOR: {} } },
        pro: { continuous: { PRO: {} } },
        com: { continuous: { COM: {} } },
        zs: { continuous: { ZS: {} } },
        ont_h: { continuous: { ONT_H: {} } },
        ont_s: { continuous: { ONT_S: {} } },
        eps: { categorical: { EPS: [1 / 6, 1 / 6, 1 / 6, 1 / 6, 1 / 6, 1 / 6] } },
        aes: { categorical: { AES: [1 / 6, 1 / 6, 1 / 6, 1 / 6, 1 / 6, 1 / 6] } }
      }
    },
    // Q201 — Patriotism + institutional trust direct probe.
    // Added 2026-04-24 per ADR-008 to close the "civic-nationalist progressive"
    // signal gap. Previous opener had no direct probe of country-pride or
    // institutional-trust-despite-flaws; civic-nationalist users were forced
    // to express via Q60 (national_identity anchor — fires only if matters)
    // and Q102 (gatekeeping framing — biased toward assimilationist read).
    // This question separates "I'm proud + trust institutions despite flaws"
    // from "I'm critical and don't trust system" cleanly, touching ONT_S
    // (institutional trust) and TRB (national identification).
    {
      id: 201,
      stage: "fixed12",
      section: "I",
      promptShort: "patriotism_institutional_trust",
      uiType: "single_choice",
      quality: 0.95,
      rewriteNeeded: false,
      // Q201 options expanded 2026-04-25 per ADR-009 to cover the patriotism ×
      // institutional-trust grid. 5 options span the meaningful cells:
      //   - high pride, high trust   (proud_and_trust, mainstream patriot)
      //   - high pride, low trust    (proud_distrustful, right-populist patriot)
      //   - moderate pride, mixed    (moderate_pride_mixed_trust)
      //   - low pride, high trust    (internationalist_trusting)
      //   - low pride, low trust     (critical_low_trust)
      // The 6th "not country-framed" option was dropped 2026-04-25 per user
      // feedback: it duplicates Q103's salience rule-out (TRB sal=0 case) and
      // confuses the question's purpose by inviting respondents who do think in
      // country/tribe terms to opt out altogether.
      options: ["proud_and_trust", "proud_distrustful", "moderate_pride_mixed_trust", "internationalist_trusting", "critical_low_trust"],
      // Current trust in institutions is not the same as ONT_S's normative
      // institutional essentialism. Keep this as a light contextual cue and let
      // Q214/Q215/Q216 carry the real "strong institutions are foundational"
      // signal.
      touchProfile: [
        { node: "ONT_S", kind: "continuous", role: "position", weight: 0.2, touchType: "current_institutional_confidence" },
        { node: "ONT_S", kind: "continuous", role: "salience", weight: 0.15, touchType: "current_institutional_confidence" },
        { node: "TRB", kind: "continuous", role: "position", weight: 0.3, touchType: "national_identification" }
      ],
      optionEvidence: {
        // "I'm generally proud of my country and trust most of its core institutions despite their flaws."
        proud_and_trust: {
          continuous: {
            ONT_S: { pos: [0.02, 0.06, 0.18, 0.34, 0.4] },
            TRB: { pos: [0.05, 0.15, 0.3, 0.3, 0.2] }
          }
        },
        // "I'm proud of my country but distrust most of its current institutions."
        proud_distrustful: {
          continuous: {
            ONT_S: { pos: [0.08, 0.18, 0.36, 0.25, 0.13] },
            TRB: { pos: [0.05, 0.15, 0.3, 0.3, 0.2] }
          }
        },
        // "I'm somewhat proud but skeptical of many institutions in their current form."
        moderate_pride_mixed_trust: {
          continuous: {
            ONT_S: { pos: [0.06, 0.16, 0.38, 0.27, 0.13] },
            TRB: { pos: [0.1, 0.25, 0.35, 0.2, 0.1] }
          }
        },
        // "I don't think in country-pride terms but I trust most major democratic institutions."
        internationalist_trusting: {
          continuous: {
            ONT_S: { pos: [0.02, 0.06, 0.18, 0.34, 0.4] },
            TRB: { pos: [0.4, 0.3, 0.18, 0.08, 0.04] }
          }
        },
        // "I'm critical of my country and don't trust most institutions."
        critical_low_trust: {
          continuous: {
            ONT_S: { pos: [0.18, 0.27, 0.32, 0.16, 0.07] },
            TRB: { pos: [0.3, 0.32, 0.22, 0.1, 0.06] }
          }
        }
      }
    },
    // Q200 — Party identification (added 2026-04-24 per ADR-007).
    // Captured separately from the Bayesian node state because party loyalty
    // is a non-ideological force (Duvergerian / coalitional), not a continuous-
    // dimensional position. Stored directly on state.partyID via custom hook
    // in applySingleChoiceAnswer (engine/update.ts). Used in predictVote to
    // multiply distance to non-matching-party candidates by 1 + 0.4 × (PF/5).
    // Effect: a high-PF Democrat votes Democratic regardless of small ideological
    // shifts in candidates — fixing the "staunch Dem voted Trump 2024" artifact.
    // Touch profile is empty (no node updates) — this is pure metadata.
    // PF salience nudge added so the question still contributes to PF posterior
    // confidence (a person who answers a party question is engaged enough that
    // PF matters).
    {
      id: 200,
      stage: "fixed12",
      section: "I",
      promptShort: "party_identification",
      promptFull: "Which best describes how you think of your political affiliation?",
      uiType: "single_choice",
      quality: 0.99,
      rewriteNeeded: false,
      options: ["dem", "rep", "ind", "third", "other", "none"],
      optionLabels: {
        dem: "Democrat",
        rep: "Republican",
        ind: "Independent",
        third: "Member of a third party",
        other: "Other",
        none: "Nothing"
      },
      // 2026-05-13 — Q200 carries weak Bayesian priors on the belief axes that
      // partisan ID most reliably predicts in US politics (ANES/Pew patterns).
      // Weight 0.20 per touchType "partisan_prior" — well below the typical
      // direct-position weight (0.60-0.85), so a heterodox respondent (e.g.,
      // fiscally-conservative Democrat) easily overrides the prior on Q15.
      // Independent/Third/Other/Nothing carry no continuous evidence.
      //
      // partyID metadata is still captured by the applySingleChoiceAnswer
      // hook → partyIdFromAnswer and consumed by predictVote.
      touchProfile: [
        { node: "MAT", kind: "continuous", role: "position", weight: 0.2, touchType: "partisan_prior" },
        { node: "CD", kind: "continuous", role: "position", weight: 0.2, touchType: "partisan_prior" },
        { node: "CU", kind: "continuous", role: "position", weight: 0.2, touchType: "partisan_prior" },
        { node: "MOR", kind: "continuous", role: "position", weight: 0.2, touchType: "partisan_prior" },
        { node: "ZS", kind: "continuous", role: "position", weight: 0.2, touchType: "partisan_prior" },
        { node: "ONT_S", kind: "continuous", role: "position", weight: 0.2, touchType: "partisan_prior" },
        { node: "ONT_H", kind: "continuous", role: "position", weight: 0.2, touchType: "partisan_prior" }
      ],
      optionEvidence: {
        // Mild leans: peak likelihood 0.25 vs lowest 0.14 (~1.8:1 ratio). After
        // one multiplication from uniform [0.20×5], posterior mean shifts ~0.3
        // bucket. A direct position question with ~3:1 contrast and weight 0.7
        // moves the mean further; Q15 alone overpowers this prior.
        dem: {
          continuous: {
            MAT: { pos: [0.25, 0.25, 0.2, 0.16, 0.14] },
            // lean low (redistributive)
            CD: { pos: [0.25, 0.25, 0.2, 0.16, 0.14] },
            // lean low (progressive)
            CU: { pos: [0.25, 0.25, 0.2, 0.16, 0.14] },
            // lean low (pluralist)
            MOR: { pos: [0.14, 0.16, 0.2, 0.25, 0.25] },
            // lean high (universalist)
            ZS: { pos: [0.25, 0.25, 0.2, 0.16, 0.14] },
            // lean low (positive-sum)
            ONT_S: { pos: [0.14, 0.16, 0.2, 0.25, 0.25] },
            // lean high (institutions matter)
            ONT_H: { pos: [0.14, 0.16, 0.2, 0.25, 0.25] }
            // lean high (environment shapes)
          }
        },
        rep: {
          continuous: {
            MAT: { pos: [0.14, 0.16, 0.2, 0.25, 0.25] },
            // lean high (market)
            CD: { pos: [0.14, 0.16, 0.2, 0.25, 0.25] },
            // lean high (traditional)
            CU: { pos: [0.14, 0.16, 0.2, 0.25, 0.25] },
            // lean high (uniformity)
            MOR: { pos: [0.25, 0.25, 0.2, 0.16, 0.14] },
            // lean low (bounded circle)
            ZS: { pos: [0.14, 0.16, 0.2, 0.25, 0.25] },
            // lean high (zero-sum)
            ONT_S: { pos: [0.25, 0.25, 0.2, 0.16, 0.14] },
            // lean low (suspicious of state)
            ONT_H: { pos: [0.25, 0.25, 0.2, 0.16, 0.14] }
            // lean low (dispositional)
          }
        },
        ind: {},
        third: {},
        other: {},
        none: {}
      }
    },
    // Q202 — State scope / state capacity. Added 2026-04-25 per ADR-009.
    // Distinguishes Progressive Social Democrat (universal services, big-state)
    // from Third Way Liberal (basic safety net, market-friendly) at the same
    // MAT-progressive direction. MAT collapsed scope and direction into one
    // axis; this question separates them via overlay.
    {
      id: 202,
      stage: "fixed12",
      section: "II",
      promptShort: "state_scope_preference",
      uiType: "single_choice",
      quality: 0.94,
      rewriteNeeded: false,
      options: ["universal_strong_state", "basic_safety_net_mixed", "market_enabling_limited", "anti_bureaucratic_localist"],
      touchProfile: [
        { node: "MAT", kind: "continuous", role: "position", weight: 0.55, touchType: "state_scope" },
        { node: "PRO", kind: "continuous", role: "position", weight: 0.3, touchType: "state_capacity" },
        { node: "ONT_S", kind: "continuous", role: "position", weight: 0.3, touchType: "institutional_importance" },
        { node: "COM", kind: "continuous", role: "position", weight: 0.15, touchType: "pragmatism_proxy" }
      ],
      optionEvidence: {
        // "Universal services and a strong state — public healthcare, public education
        // through college, robust social insurance, even at higher taxes."
        universal_strong_state: {
          continuous: {
            MAT: { pos: [0.55, 0.3, 0.1, 0.04, 0.01] },
            PRO: { pos: [0.05, 0.15, 0.3, 0.3, 0.2] },
            ONT_S: { pos: [0.05, 0.15, 0.3, 0.3, 0.2] },
            COM: { pos: [0.1, 0.22, 0.36, 0.22, 0.1] }
          }
        },
        // "Basic safety net and mixed economy — government provides core protections
        // and corrects market failures but doesn't run most things."
        basic_safety_net_mixed: {
          continuous: {
            MAT: { pos: [0.2, 0.35, 0.3, 0.1, 0.05] },
            PRO: { pos: [0.08, 0.2, 0.4, 0.2, 0.12] },
            ONT_S: { pos: [0.08, 0.2, 0.4, 0.2, 0.12] },
            COM: { pos: [0.04, 0.12, 0.28, 0.36, 0.2] }
          }
        },
        // "Market-enabling limited state — government should mostly enable
        // markets, individual choice, and small-business activity."
        market_enabling_limited: {
          continuous: {
            MAT: { pos: [0.05, 0.1, 0.25, 0.35, 0.25] },
            PRO: { pos: [0.15, 0.25, 0.3, 0.2, 0.1] },
            ONT_S: { pos: [0.2, 0.25, 0.25, 0.2, 0.1] },
            COM: { pos: [0.08, 0.18, 0.36, 0.26, 0.12] }
          }
        },
        // "Anti-bureaucratic / localist alternative — federal government does too
        // much; problems should be solved at community / state / private level."
        anti_bureaucratic_localist: {
          continuous: {
            MAT: { pos: [0.1, 0.2, 0.3, 0.25, 0.15] },
            PRO: { pos: [0.4, 0.3, 0.18, 0.07, 0.05] },
            ONT_S: { pos: [0.4, 0.3, 0.18, 0.07, 0.05] },
            COM: { pos: [0.3, 0.32, 0.22, 0.1, 0.06] }
          }
        }
      }
    },
    // Q203-205 — Foreign policy mini-module. Added 2026-04-25 per ADR-009 as
    // overlay rather than new node. Maps onto existing nodes (MOR for moral
    // scope, CU for nationalism, MAT for trade, ONT_S for institutions).
    // Q203 — Hawk-dove / military intervention
    {
      id: 203,
      stage: "fixed12",
      section: "III",
      promptShort: "military_intervention",
      uiType: "single_choice",
      quality: 0.9,
      rewriteNeeded: false,
      options: ["robust_intervention", "alliance_diplomacy", "restraint_only", "anti_war"],
      touchProfile: [
        { node: "MOR", kind: "continuous", role: "position", weight: 0.3, touchType: "interventionism" },
        { node: "ZS", kind: "continuous", role: "position", weight: 0.3, touchType: "interventionism" },
        { node: "ONT_H", kind: "continuous", role: "position", weight: 0.2, touchType: "interventionism" }
      ],
      optionEvidence: {
        // "Use military force decisively when American interests / values demand it"
        robust_intervention: {
          continuous: {
            MOR: { pos: [0.3, 0.3, 0.22, 0.12, 0.06] },
            ZS: { pos: [0.05, 0.1, 0.2, 0.3, 0.35] },
            ONT_H: { pos: [0.3, 0.3, 0.22, 0.12, 0.06] }
          },
          // 2026-05-13: "American interests/values demand force" → national priority.
          moralCircle: { scopedAffinities: { national: 70 } }
        },
        // "Lead through alliances and diplomacy; force is a last resort within international institutions"
        alliance_diplomacy: {
          continuous: {
            MOR: { pos: [0.05, 0.12, 0.25, 0.33, 0.25] },
            ZS: { pos: [0.2, 0.3, 0.3, 0.15, 0.05] },
            ONT_H: { pos: [0.05, 0.15, 0.3, 0.3, 0.2] }
          },
          // 2026-05-13: alliance/institution framing → moderate universalism.
          moralCircle: { universal: 65 }
        },
        // C and D rewritten 2026-04-25 per user feedback that they overlapped.
        // Now distinguished on the realist-vs-moral axis:
        //   C realist_restraint = strategic prudence (would intervene if vital
        //                         interests were directly threatened — narrow scope)
        //   D anti_war         = moral pacifism (war itself is the problem,
        //                         even when interests would justify it)
        // "Strategic prudence — intervene only to protect vital US security interests; treat foreign policy as cost-benefit, not values projection"
        restraint_only: {
          continuous: {
            MOR: { pos: [0.3, 0.32, 0.22, 0.12, 0.04] },
            // narrower moral scope (realist-leaning)
            ZS: { pos: [0.1, 0.22, 0.34, 0.22, 0.12] },
            // mixed zero-sum (geopolitics is a contest)
            ONT_H: { pos: [0.22, 0.3, 0.3, 0.13, 0.05] }
            // somewhat pessimistic about other actors
          }
        },
        // "War is rarely just — pursue diplomacy and disarmament; military force causes more harm than it prevents"
        anti_war: {
          continuous: {
            MOR: { pos: [0.04, 0.1, 0.22, 0.32, 0.32] },
            // wide moral scope (cosmopolitan pacifism)
            ZS: { pos: [0.42, 0.3, 0.16, 0.08, 0.04] },
            // strongly positive-sum (cooperation works)
            ONT_H: { pos: [0.04, 0.12, 0.26, 0.32, 0.26] }
            // optimistic about human nature
          },
          // 2026-05-13: cosmopolitan pacifism → strong universalism.
          moralCircle: { universal: 80 }
        }
      }
    },
    // Q204 — Internationalist vs isolationist (alliances, institutions, treaties)
    {
      id: 204,
      stage: "fixed12",
      section: "III",
      promptShort: "international_engagement",
      uiType: "single_choice",
      quality: 0.9,
      rewriteNeeded: false,
      options: ["deep_engagement", "selective_alliance", "unilateral_strength", "withdraw_focus_home"],
      touchProfile: [
        { node: "CU", kind: "continuous", role: "position", weight: 0.35, touchType: "international_orientation" },
        { node: "MOR", kind: "continuous", role: "position", weight: 0.25, touchType: "moral_scope_global" },
        { node: "TRB", kind: "continuous", role: "position", weight: 0.2, touchType: "national_identification" }
      ],
      optionEvidence: {
        // "America should engage deeply in international institutions and treaties"
        deep_engagement: {
          continuous: {
            CU: { pos: [0.04, 0.1, 0.25, 0.31, 0.3] },
            MOR: { pos: [0.04, 0.1, 0.25, 0.31, 0.3] },
            TRB: { pos: [0.3, 0.32, 0.22, 0.1, 0.06] }
          },
          // 2026-05-13: international-institution embrace → universalist scope.
          moralCircle: { universal: 75 }
        },
        // "Strong alliances yes, but be selective and protect American sovereignty"
        selective_alliance: {
          continuous: {
            CU: { pos: [0.1, 0.22, 0.36, 0.22, 0.1] },
            MOR: { pos: [0.1, 0.22, 0.36, 0.22, 0.1] },
            TRB: { pos: [0.1, 0.22, 0.3, 0.25, 0.13] }
          }
        },
        // "America should act unilaterally to defend its interests; don't be constrained by international institutions"
        unilateral_strength: {
          continuous: {
            CU: { pos: [0.4, 0.3, 0.18, 0.08, 0.04] },
            MOR: { pos: [0.4, 0.3, 0.18, 0.08, 0.04] },
            TRB: { pos: [0.04, 0.1, 0.2, 0.32, 0.34] }
          },
          // 2026-05-13: national sovereignty above international institutions → strong national preference.
          moralCircle: { scopedAffinities: { national: 80 } }
        },
        // "Withdraw from foreign entanglements; focus on home"
        withdraw_focus_home: {
          continuous: {
            CU: { pos: [0.3, 0.3, 0.25, 0.1, 0.05] },
            MOR: { pos: [0.3, 0.3, 0.25, 0.1, 0.05] },
            TRB: { pos: [0.1, 0.18, 0.3, 0.25, 0.17] }
          },
          // 2026-05-13: domestic-first isolationism → mild national preference.
          moralCircle: { scopedAffinities: { national: 65 } }
        }
      }
    },
    // Q205 — Trade / economic nationalism
    {
      id: 205,
      stage: "fixed12",
      section: "III",
      promptShort: "trade_nationalism",
      uiType: "single_choice",
      quality: 0.88,
      rewriteNeeded: false,
      options: ["free_trade", "fair_trade_with_protections", "tariffs_protect_jobs", "trade_what_helps_people"],
      // CU weight lowered 2026-04-26 from 0.25 → 0.10 per CU broadening audit.
      // Economic nationalism (wanting tariffs to protect jobs) is a weak proxy for
      // CU under the broadened pluralism framing — a respondent can favor tariffs
      // for purely economic reasons without holding any uniformity preference.
      // Kept as a light residual to preserve the protectionist↔globalist
      // correlation that does exist in the data, but not load-bearing.
      touchProfile: [
        { node: "MAT", kind: "continuous", role: "position", weight: 0.35, touchType: "trade_economics" },
        { node: "CU", kind: "continuous", role: "position", weight: 0.1, touchType: "economic_nationalism" },
        { node: "ZS", kind: "continuous", role: "position", weight: 0.25, touchType: "trade_zero_sum" }
      ],
      optionEvidence: {
        // "Free trade is mostly good; remove barriers, embrace globalization"
        free_trade: {
          continuous: {
            MAT: { pos: [0.05, 0.15, 0.3, 0.3, 0.2] },
            CU: { pos: [0.04, 0.1, 0.25, 0.31, 0.3] },
            ZS: { pos: [0.4, 0.3, 0.18, 0.08, 0.04] }
          }
        },
        // "Fair trade with worker / environmental protections — pro-trade but with rules"
        fair_trade_with_protections: {
          continuous: {
            MAT: { pos: [0.15, 0.3, 0.3, 0.15, 0.1] },
            CU: { pos: [0.1, 0.22, 0.36, 0.22, 0.1] },
            ZS: { pos: [0.2, 0.3, 0.3, 0.15, 0.05] }
          }
        },
        // "Tariffs and protections to defend American jobs and industry"
        tariffs_protect_jobs: {
          continuous: {
            MAT: { pos: [0.3, 0.3, 0.22, 0.12, 0.06] },
            CU: { pos: [0.4, 0.3, 0.18, 0.08, 0.04] },
            ZS: { pos: [0.05, 0.15, 0.3, 0.3, 0.2] }
          }
        },
        // "Whatever trade policy materially helps working people — open or closed"
        trade_what_helps_people: {
          continuous: {
            MAT: { pos: [0.4, 0.3, 0.18, 0.08, 0.04] },
            CU: { pos: [0.15, 0.25, 0.35, 0.18, 0.07] },
            ZS: { pos: [0.2, 0.3, 0.3, 0.15, 0.05] }
          }
        }
      }
    },
    // Q206 — Religion in public life. Maps to CD, CU, MOR, PRO. Added 2026-04-25.
    {
      id: 206,
      stage: "fixed12",
      section: "IV",
      promptShort: "religion_in_public_life",
      uiType: "single_choice",
      quality: 0.9,
      rewriteNeeded: false,
      options: ["religion_central", "religion_inform", "religion_neutral", "religion_separate"],
      touchProfile: [
        { node: "CD", kind: "continuous", role: "position", weight: 0.4, touchType: "religion_traditionalism" },
        { node: "MOR", kind: "continuous", role: "position", weight: 0.2, touchType: "religion_morality" },
        { node: "PRO", kind: "continuous", role: "position", weight: 0.2, touchType: "religion_neutrality" },
        { node: "EPS", kind: "categorical", role: "category", weight: 0.3, touchType: "religion_epistemic" }
      ],
      optionEvidence: {
        // "Religious values should be central to public policy and law"
        religion_central: {
          continuous: {
            CD: { pos: [0.02, 0.06, 0.18, 0.34, 0.4] },
            MOR: { pos: [0.4, 0.3, 0.18, 0.08, 0.04] },
            PRO: { pos: [0.2, 0.25, 0.3, 0.15, 0.1] }
          },
          categorical: { EPS: { cat: [0.04, 0.06, 0.66, 0.1, 0.1, 0.04] } },
          // 2026-05-13: religion-in-policy → religious in-group preference.
          moralCircle: { scopedAffinities: { religious: 80 } }
        },
        // "Religion can inform public values, but laws should serve everyone equally"
        religion_inform: {
          continuous: {
            CD: { pos: [0.1, 0.22, 0.36, 0.22, 0.1] },
            MOR: { pos: [0.15, 0.25, 0.35, 0.18, 0.07] },
            PRO: { pos: [0.05, 0.15, 0.3, 0.3, 0.2] }
          },
          categorical: { EPS: { cat: [0.1, 0.2, 0.3, 0.2, 0.15, 0.05] } }
        },
        // "Government should be neutral toward religion — neither favor nor restrict"
        religion_neutral: {
          continuous: {
            CD: { pos: [0.15, 0.25, 0.35, 0.15, 0.1] },
            MOR: { pos: [0.1, 0.2, 0.4, 0.2, 0.1] },
            PRO: { pos: [0.04, 0.1, 0.25, 0.31, 0.3] }
          },
          categorical: { EPS: { cat: [0.3, 0.35, 0.1, 0.05, 0.15, 0.05] } }
        },
        // "Strict separation — religion has no place in public policy"
        religion_separate: {
          continuous: {
            CD: { pos: [0.4, 0.3, 0.18, 0.08, 0.04] },
            MOR: { pos: [0.04, 0.1, 0.25, 0.31, 0.3] },
            PRO: { pos: [0.05, 0.15, 0.3, 0.3, 0.2] }
          },
          categorical: { EPS: { cat: [0.4, 0.2, 0.04, 0.05, 0.2, 0.11] } },
          // 2026-05-13: strict secular separation → mild universal civic frame.
          moralCircle: { universal: 65 }
        }
      }
    },
    // Q207 — Emergency powers tolerance. PRO probe with anti-democratic-shortcut framing.
    {
      id: 207,
      stage: "fixed12",
      section: "II",
      promptShort: "emergency_powers",
      uiType: "single_choice",
      quality: 0.9,
      rewriteNeeded: false,
      options: ["never_emergency_bypass", "narrow_emergency", "moderate_emergency", "strong_leader_acts"],
      touchProfile: [
        { node: "PRO", kind: "continuous", role: "position", weight: 0.65, touchType: "constitutional_restraint" },
        { node: "ONT_H", kind: "continuous", role: "position", weight: 0.2, touchType: "trust_concentrated_power" }
      ],
      optionEvidence: {
        // "Constitutional process binds even in emergencies — never bypass"
        never_emergency_bypass: {
          continuous: {
            PRO: { pos: [0.02, 0.06, 0.15, 0.32, 0.45] },
            ONT_H: { pos: [0.4, 0.3, 0.18, 0.08, 0.04] }
          }
        },
        // "Narrow, time-limited emergency powers under congressional or judicial check"
        narrow_emergency: {
          continuous: {
            PRO: { pos: [0.05, 0.15, 0.3, 0.3, 0.2] },
            ONT_H: { pos: [0.2, 0.3, 0.3, 0.15, 0.05] }
          }
        },
        // "Government can act decisively when problems demand it, with later review"
        moderate_emergency: {
          continuous: {
            PRO: { pos: [0.2, 0.3, 0.3, 0.15, 0.05] },
            ONT_H: { pos: [0.1, 0.2, 0.4, 0.2, 0.1] }
          }
        },
        // "When the system is gridlocked or failing, a strong leader should be able to act and let courts catch up"
        strong_leader_acts: {
          continuous: {
            PRO: { pos: [0.55, 0.3, 0.1, 0.04, 0.01] },
            ONT_H: { pos: [0.05, 0.15, 0.3, 0.3, 0.2] }
          }
        }
      }
    },
    // Q208 — Courts vs majority will
    {
      id: 208,
      stage: "fixed12",
      section: "II",
      promptShort: "courts_vs_majority",
      uiType: "single_choice",
      quality: 0.88,
      rewriteNeeded: false,
      options: ["courts_protect_rights", "courts_check_with_deference", "majority_should_rule", "elites_blocking_change"],
      touchProfile: [
        { node: "PRO", kind: "continuous", role: "position", weight: 0.55, touchType: "judicial_review" },
        { node: "ONT_H", kind: "continuous", role: "position", weight: 0.2, touchType: "trust_majority" }
      ],
      optionEvidence: {
        // "Courts protect rights even against majority opinion — that's their job"
        courts_protect_rights: {
          continuous: {
            PRO: { pos: [0.02, 0.06, 0.15, 0.32, 0.45] },
            ONT_H: { pos: [0.3, 0.32, 0.22, 0.12, 0.04] }
          }
        },
        // "Courts check majorities but should generally defer to democratically-elected branches"
        courts_check_with_deference: {
          continuous: {
            PRO: { pos: [0.1, 0.2, 0.4, 0.2, 0.1] },
            ONT_H: { pos: [0.12, 0.22, 0.36, 0.22, 0.08] }
          }
        },
        // "The democratic majority should mostly get its way; courts shouldn't override the public"
        majority_should_rule: {
          continuous: {
            PRO: { pos: [0.3, 0.3, 0.22, 0.12, 0.06] },
            ONT_H: { pos: [0.05, 0.12, 0.24, 0.34, 0.25] }
          }
        },
        // "Unelected elites in courts and bureaucracy are blocking the people's mandate"
        elites_blocking_change: {
          continuous: {
            PRO: { pos: [0.55, 0.28, 0.1, 0.05, 0.02] },
            ONT_H: { pos: [0.1, 0.18, 0.3, 0.25, 0.17] }
          }
        }
      }
    },
    // Q209 — Direct ZS probe. Currently ZS proxied via Q84 institutions slider only.
    {
      id: 209,
      stage: "fixed12",
      section: "III",
      promptShort: "zero_sum_economics_view",
      uiType: "single_choice",
      quality: 0.9,
      rewriteNeeded: false,
      options: ["pie_grows_for_all", "growth_with_distribution", "winners_at_others_expense", "rigged_against_most"],
      touchProfile: [
        { node: "ZS", kind: "continuous", role: "position", weight: 0.85, touchType: "zero_sum_direct" },
        { node: "ZS", kind: "continuous", role: "salience", weight: 0.5, touchType: "zero_sum_direct" }
      ],
      optionEvidence: {
        // "When the economy grows, most people can benefit — wealth creation is positive-sum"
        pie_grows_for_all: {
          continuous: {
            ZS: { pos: [0.55, 0.28, 0.1, 0.05, 0.02], sal: [0.05, 0.2, 0.4, 0.35] }
          }
        },
        // "Growth helps when distribution is fair — both creating and sharing matter"
        growth_with_distribution: {
          continuous: {
            ZS: { pos: [0.2, 0.32, 0.3, 0.13, 0.05], sal: [0.1, 0.25, 0.4, 0.25] }
          }
        },
        // "When some win big, others lose — economic gains usually come at someone's expense"
        winners_at_others_expense: {
          continuous: {
            ZS: { pos: [0.04, 0.1, 0.2, 0.32, 0.34], sal: [0.05, 0.15, 0.35, 0.45] }
          }
        },
        // "The whole economy is rigged so most people can't get ahead no matter what"
        rigged_against_most: {
          continuous: {
            ZS: { pos: [0.02, 0.05, 0.15, 0.32, 0.46], sal: [0.02, 0.1, 0.3, 0.58] }
          }
        }
      }
    },
    // Q210 — Direct ONT_H malleability probe. Reframed 2026-04-26 from the older
    // "fixed-goodness" framing (fallen vs cooperative) to malleability framing per
    // ADR-010 / ONT_H concept reframe. The politically load-bearing question is
    // not whether humans are inherently good or bad, but whether they can be
    // reshaped by environment, education, institutions, and modeling. See
    // src/config/nodes.ts for full canonical comment.
    {
      id: 210,
      stage: "fixed12",
      section: "III",
      promptShort: "human_malleability_view",
      uiType: "single_choice",
      quality: 0.9,
      rewriteNeeded: false,
      options: ["largely_fixed", "modest_shaping", "substantial_shaping", "mostly_made_by_environment"],
      touchProfile: [
        { node: "ONT_H", kind: "continuous", role: "position", weight: 0.85, touchType: "malleability_direct" },
        { node: "ONT_H", kind: "continuous", role: "salience", weight: 0.4, touchType: "malleability_direct" }
      ],
      optionEvidence: {
        // "Mostly fixed by adulthood — character barely changes after that"
        largely_fixed: {
          continuous: {
            ONT_H: { pos: [0.5, 0.3, 0.13, 0.05, 0.02], sal: [0.05, 0.2, 0.4, 0.35] }
          }
        },
        // "Some shaping is possible, but human nature sets real limits"
        modest_shaping: {
          continuous: {
            ONT_H: { pos: [0.2, 0.32, 0.3, 0.13, 0.05], sal: [0.1, 0.25, 0.4, 0.25] }
          }
        },
        // "Substantially shaped by upbringing, education, and community"
        substantial_shaping: {
          continuous: {
            ONT_H: { pos: [0.05, 0.13, 0.3, 0.32, 0.2], sal: [0.1, 0.25, 0.4, 0.25] }
          }
        },
        // "Mostly made — character and behavior are largely products of how a
        // person is raised, taught, and surrounded; people can be changed
        // substantially"
        // Label softened 2026-04-26: previous "institutions and culture do most
        // of the work" wording bundled ONT_H with ONT_S/CD by naming
        // institutional mechanism. Narrowed to pure malleability claim.
        mostly_made_by_environment: {
          continuous: {
            ONT_H: { pos: [0.02, 0.05, 0.15, 0.32, 0.46], sal: [0.05, 0.2, 0.4, 0.35] }
          }
        }
      }
    },
    // Q211 — Strategic / lesser-evil voting tendency. Used by predictVote to
    // route third-party-leaning users to lesser-evil major-party candidates
    // when their preferred party has no chance.
    {
      id: 211,
      stage: "fixed12",
      section: "I",
      promptShort: "strategic_voting",
      uiType: "single_choice",
      quality: 0.95,
      rewriteNeeded: false,
      options: ["strategic_lesser_evil", "sincere_always", "depends_on_stakes", "not_sure"],
      // No node touch; this is metadata used by predictVote.
      touchProfile: [],
      optionEvidence: {
        strategic_lesser_evil: {},
        sincere_always: {},
        depends_on_stakes: {},
        not_sure: {}
      }
    },
    // Q212 — Negative partisanship. Asks which parties (if any) the respondent
    // would never vote for. Captured as a multi-select; UI handler is special-
    // cased like Q200.
    {
      id: 212,
      stage: "fixed12",
      section: "I",
      promptShort: "negative_partisanship",
      uiType: "single_choice",
      quality: 0.95,
      rewriteNeeded: false,
      // 2026-05-13: dropped `no_categorical_no` ("I'd consider voting for any
      // party if the candidate were right") — semantically subsumed by
      // `consider_all` ("I evaluate every candidate on their own — no
      // categorical exclusions"). Same answer, different framing.
      options: ["never_dem", "never_rep", "never_dem_or_rep", "consider_all"],
      touchProfile: [],
      optionEvidence: {
        never_dem: {},
        never_rep: {},
        never_dem_or_rep: {},
        consider_all: {}
      }
    },
    // Q213 — Equal moral standing within the polity. Added 2026-04-25 to address
    // the MOR-conflation gap surfaced by the user-trace diagnostic: PRISM's
    // existing MOR axis (Q103 label, Q27 welfare tradeoff, etc.) measures
    // *scope* of moral concern (family/country → world). It does NOT cleanly
    // measure *universalism within scope* — i.e., whether everyone inside the
    // polity has equal full personhood (the position that distinguishes
    // abolitionists from popular-sovereignty Democrats in 1860, civil-rights
    // Democrats from segregationist Democrats in 1948-64, modern civic-
    // nationalist progressives from cosmopolitans).
    //
    // A civic nationalist who answers Q103 "country first" but holds strong
    // within-country universalism currently lands at MOR≈3 (mid). Without this
    // probe, the model can't distinguish them from someone who's mid on
    // both axes. Q213 pushes MOR pos *up* toward 5 when respondent affirms
    // strong within-polity equal standing, regardless of their scope answer
    // elsewhere. CU also gets a secondary push (pluralism within polity).
    //
    // Reads as a sub-question of MOR rather than a new axis: keeps the 14-node
    // architecture intact while resolving the universalism-vs-scope conflation
    // for users where the two diverge.
    {
      id: 213,
      stage: "fixed12",
      section: "IV",
      promptShort: "equal_standing_within_polity",
      promptFull: "When citizens, legal residents, minorities, or other groups living under the country's laws are denied equal moral or legal standing, how central is fixing that to your politics?",
      uiType: "single_choice",
      quality: 0.95,
      rewriteNeeded: false,
      options: [
        "central_universalism",
        "important_one_of_many",
        "depends_on_situation",
        "some_differentiation_acceptable",
        "natural_hierarchy"
      ],
      touchProfile: [
        { node: "MOR", kind: "continuous", role: "position", weight: 0.85, touchType: "within_polity_universalism" },
        { node: "MOR", kind: "continuous", role: "salience", weight: 0.5, touchType: "within_polity_universalism" },
        { node: "CU", kind: "continuous", role: "position", weight: 0.3, touchType: "within_polity_pluralism" },
        { node: "PRO", kind: "continuous", role: "position", weight: 0.2, touchType: "rights_proceduralism" }
      ],
      optionEvidence: {
        // "Central — equal full personhood for everyone within the country is
        //  foundational; denying it is the political issue I focus on"
        central_universalism: {
          continuous: {
            MOR: { pos: [0.02, 0.05, 0.13, 0.3, 0.5], sal: [0.02, 0.1, 0.3, 0.58] },
            CU: { pos: [0.05, 0.15, 0.3, 0.3, 0.2] },
            PRO: { pos: [0.05, 0.15, 0.25, 0.3, 0.25] }
          },
          moralCircle: { universal: 85 }
        },
        // "Important but one issue among many; matters when it's directly happening"
        important_one_of_many: {
          continuous: {
            MOR: { pos: [0.05, 0.13, 0.27, 0.35, 0.2], sal: [0.1, 0.25, 0.4, 0.25] },
            CU: { pos: [0.08, 0.2, 0.4, 0.22, 0.1] },
            PRO: { pos: [0.1, 0.2, 0.4, 0.2, 0.1] }
          },
          moralCircle: { universal: 70 }
        },
        // "Important in extreme cases but I focus on broader policy"
        depends_on_situation: {
          continuous: {
            MOR: { pos: [0.1, 0.25, 0.4, 0.18, 0.07], sal: [0.2, 0.35, 0.3, 0.15] },
            CU: { pos: [0.15, 0.25, 0.35, 0.18, 0.07] },
            PRO: { pos: [0.15, 0.25, 0.35, 0.18, 0.07] }
          },
          moralCircle: { universal: 55 }
        },
        // "Some differentiation is part of stable political order; perfect equality isn't always the goal"
        some_differentiation_acceptable: {
          continuous: {
            MOR: { pos: [0.3, 0.35, 0.22, 0.1, 0.03], sal: [0.2, 0.35, 0.3, 0.15] },
            CU: { pos: [0.3, 0.35, 0.22, 0.1, 0.03] },
            PRO: { pos: [0.2, 0.3, 0.3, 0.15, 0.05] }
          },
          moralCircle: { universal: 35 }
        },
        // "Different groups have different roles; that's how polities work"
        natural_hierarchy: {
          continuous: {
            MOR: { pos: [0.55, 0.28, 0.1, 0.05, 0.02], sal: [0.05, 0.2, 0.4, 0.35] },
            CU: { pos: [0.55, 0.28, 0.1, 0.05, 0.02] },
            PRO: { pos: [0.3, 0.3, 0.22, 0.12, 0.06] }
          },
          moralCircle: { universal: 20 }
        }
      }
    },
    // Q214 — Institutional essentialism (normative ONT_S, decoupled from current
    // empirical performance). Added 2026-04-25 to address the ONT_S-conflation
    // gap surfaced by user feedback: existing ONT_S signals (Q15 inequality
    // causal allocation, Q83 broken-politics diagnosis, Q201 patriotism+trust)
    // mostly probe how the respondent perceives institutions *as they are right
    // now*. A respondent who is empirically critical of 2026 US institutions
    // but normatively believes institutions are foundational to human progress
    // (a civic-institutionalist progressive) gets pulled to ONT_S=mid by the
    // empirical signals when their underlying values would land them ONT_S=5.
    //
    // Q214 explicitly asks the normative question, decoupled from current
    // performance: "Setting aside how well institutions function right now…"
    // It pushes ONT_S pos *up* toward 5 when the respondent affirms
    // foundational-essentialism, regardless of their answers about specific
    // failure modes elsewhere. Same architecture as Q213 (within-polity
    // universalism for MOR).
    {
      id: 214,
      stage: "fixed12",
      section: "II",
      promptShort: "institutions_foundational",
      promptFull: "Setting aside how well institutions function right now, how essential do you think strong institutions \u2014 laws, courts, civic organizations, international bodies \u2014 are to a society's long-term flourishing?",
      uiType: "single_choice",
      quality: 0.95,
      rewriteNeeded: false,
      options: [
        "foundational_essential",
        "important_with_caveats",
        "depends_on_design",
        "instruments_not_essential",
        "obstacles_to_progress"
      ],
      touchProfile: [
        { node: "ONT_S", kind: "continuous", role: "position", weight: 0.85, touchType: "institutional_essentialism" },
        { node: "ONT_S", kind: "continuous", role: "salience", weight: 0.5, touchType: "institutional_essentialism" },
        { node: "PRO", kind: "continuous", role: "position", weight: 0.25, touchType: "rule_of_law_normative" },
        { node: "ONT_H", kind: "continuous", role: "position", weight: 0.1, touchType: "trust_in_concentrated_authority" }
      ],
      optionEvidence: {
        // "Foundational — necessary infrastructure for any thriving society;
        //  can't have human progress without them"
        foundational_essential: {
          continuous: {
            ONT_S: { pos: [0.02, 0.05, 0.13, 0.3, 0.5], sal: [0.02, 0.1, 0.3, 0.58] },
            PRO: { pos: [0.05, 0.15, 0.25, 0.3, 0.25] },
            ONT_H: { pos: [0.05, 0.15, 0.3, 0.3, 0.2] }
          }
        },
        // "Important, but they need constant maintenance and reform"
        important_with_caveats: {
          continuous: {
            ONT_S: { pos: [0.05, 0.13, 0.27, 0.35, 0.2], sal: [0.1, 0.25, 0.4, 0.25] },
            PRO: { pos: [0.08, 0.18, 0.34, 0.28, 0.12] },
            ONT_H: { pos: [0.1, 0.2, 0.4, 0.2, 0.1] }
          }
        },
        // "Depends on which institutions and how they're structured"
        depends_on_design: {
          continuous: {
            ONT_S: { pos: [0.1, 0.25, 0.4, 0.18, 0.07], sal: [0.2, 0.35, 0.3, 0.15] },
            PRO: { pos: [0.15, 0.25, 0.35, 0.18, 0.07] }
          }
        },
        // "They're useful instruments but not foundational; people can flourish
        //  under many arrangements"
        instruments_not_essential: {
          continuous: {
            ONT_S: { pos: [0.3, 0.35, 0.22, 0.1, 0.03], sal: [0.2, 0.35, 0.3, 0.15] },
            PRO: { pos: [0.3, 0.3, 0.22, 0.12, 0.06] }
          }
        },
        // "Often obstacles — entrenched institutions block needed change"
        obstacles_to_progress: {
          continuous: {
            ONT_S: { pos: [0.55, 0.28, 0.1, 0.05, 0.02], sal: [0.05, 0.2, 0.4, 0.35] },
            PRO: { pos: [0.4, 0.3, 0.18, 0.07, 0.05] },
            ONT_H: { pos: [0.2, 0.25, 0.3, 0.15, 0.1] }
          }
        }
      }
    },
    // Q215 — Theory of change. Forced-choice institutional-essentialism probe
    // designed to avoid the social-desirability bias of Q214 (where option 1
    // sounds "thoughtful-civic" and most respondents pick it regardless of
    // actual politics). Each option here maps to a real American political
    // constituency:
    //   institutions_and_laws → mainstream institutionalist (Obama-Biden Dems,
    //                            Romney Republicans, EU technocrats)
    //   movements_against_power → progressive-movement-organizing left
    //   tech_and_economic     → Silicon Valley accelerationist, growth-progressive
    //   leaders_with_vision   → great-man theorist (Reagan-Trump-Obama coalitional)
    //   markets_voluntary     → libertarian, classical liberal
    //
    // Gated on ONT_S salience: only fires if respondent put ONT_S in
    // supportHigh/supportMid on Q103 (the salience screener). High quality
    // (0.96) so adaptive selector prefers it over noisy alternatives when ONT_S
    // is the open dimension.
    {
      id: 215,
      stage: "stage2",
      section: "II",
      promptShort: "theory_of_change_progress",
      promptFull: "Looking at major political progress in the United States over the last 100 years, where has it MOSTLY come from?",
      uiType: "single_choice",
      quality: 0.96,
      rewriteNeeded: false,
      options: [
        "institutions_and_laws",
        "movements_against_power",
        "tech_and_economic",
        "leaders_with_vision",
        "markets_voluntary"
      ],
      touchProfile: [
        { node: "ONT_S", kind: "continuous", role: "position", weight: 0.85, touchType: "theory_of_change" },
        { node: "ONT_S", kind: "continuous", role: "salience", weight: 0.55, touchType: "theory_of_change" },
        { node: "MAT", kind: "continuous", role: "position", weight: 0.3, touchType: "policy_lever" },
        { node: "PRO", kind: "continuous", role: "position", weight: 0.2, touchType: "process_vs_movement" }
      ],
      exposeRules: {
        eligibleIf: ["ONT_S_live_or_unresolved"]
      },
      optionEvidence: {
        // "From durable institutions and laws — courts, the Federal Reserve,
        //  the interstate highway system, public-health agencies, NATO,
        //  Medicare, the Civil Rights Act"
        // Examples deliberately mixed across ideological coalitions (left
        // progressive achievements + center-right / Cold War / national-
        // security institutions) so respondents pick this option for
        // institutional-essentialism reasons, not because they like a
        // specific list of progressive policies.
        institutions_and_laws: {
          continuous: {
            ONT_S: { pos: [0.02, 0.05, 0.15, 0.32, 0.46], sal: [0.02, 0.1, 0.3, 0.58] },
            MAT: { pos: [0.2, 0.32, 0.3, 0.13, 0.05] },
            PRO: { pos: [0.05, 0.13, 0.3, 0.32, 0.2] }
          }
        },
        // "From social movements forcing change against entrenched power —
        //  labor, civil rights, women's, gay rights, climate"
        movements_against_power: {
          continuous: {
            ONT_S: { pos: [0.2, 0.32, 0.3, 0.13, 0.05], sal: [0.05, 0.2, 0.4, 0.35] },
            MAT: { pos: [0.3, 0.35, 0.22, 0.1, 0.03] },
            PRO: { pos: [0.2, 0.3, 0.3, 0.15, 0.05] }
          }
        },
        // "From technological and economic dynamism — postwar growth,
        //  Silicon Valley, productivity gains lifting living standards"
        tech_and_economic: {
          continuous: {
            ONT_S: { pos: [0.13, 0.25, 0.34, 0.18, 0.1], sal: [0.2, 0.35, 0.3, 0.15] },
            MAT: { pos: [0.04, 0.1, 0.25, 0.31, 0.3] },
            PRO: { pos: [0.15, 0.25, 0.35, 0.18, 0.07] }
          }
        },
        // "From leaders with vision who mobilized the country — FDR,
        //  Reagan, Obama, leaders who reshaped what was politically possible"
        leaders_with_vision: {
          continuous: {
            ONT_S: { pos: [0.1, 0.22, 0.36, 0.22, 0.1], sal: [0.2, 0.35, 0.3, 0.15] },
            MAT: { pos: [0.1, 0.22, 0.36, 0.22, 0.1] },
            PRO: { pos: [0.2, 0.3, 0.3, 0.15, 0.05] }
          }
        },
        // "From markets, voluntary exchange, and individual initiative —
        //  most progress is bottom-up, not government-led"
        markets_voluntary: {
          continuous: {
            ONT_S: { pos: [0.42, 0.3, 0.18, 0.07, 0.03], sal: [0.1, 0.25, 0.4, 0.25] },
            MAT: { pos: [0.02, 0.05, 0.18, 0.32, 0.43] },
            PRO: { pos: [0.2, 0.3, 0.3, 0.15, 0.05] }
          }
        }
      }
    },
    // Q216 — Concrete institutional-strengthening preference. Tests the same
    // axis as Q215 from a different angle: rather than retrospective theory of
    // change, asks where the respondent would direct effort *now*. Forces a
    // choice between five real American constituencies on institutional reform:
    //   reform_existing       → mainstream institutionalist (Liz Cheney, Obama)
    //   build_new             → reform progressive (Niskanen Center, Yglesias)
    //   devolve_power         → federalist conservative (states' rights)
    //   democratize_rein_in   → populist (MAGA, left-populist Bernie/Sanders coalitional)
    //   shrink_government     → libertarian / small-government conservative
    {
      id: 216,
      stage: "stage2",
      section: "II",
      promptShort: "strengthen_democracy_priority",
      promptFull: "If you were prioritizing one approach to strengthen American democracy today, which would do MORE?",
      uiType: "single_choice",
      quality: 0.96,
      rewriteNeeded: false,
      options: [
        "reform_existing",
        "build_new",
        "devolve_power",
        "democratize_rein_in",
        "shrink_government"
      ],
      touchProfile: [
        { node: "ONT_S", kind: "continuous", role: "position", weight: 0.85, touchType: "institutional_strengthening" },
        { node: "ONT_S", kind: "continuous", role: "salience", weight: 0.5, touchType: "institutional_strengthening" },
        { node: "MAT", kind: "continuous", role: "position", weight: 0.25, touchType: "state_scope_implication" },
        { node: "PRO", kind: "continuous", role: "position", weight: 0.3, touchType: "process_vs_populist" }
      ],
      exposeRules: {
        eligibleIf: ["ONT_S_live_or_unresolved"]
      },
      optionEvidence: {
        // "Repair existing constitutional and public institutions —
        //  Congress, courts, agencies, professional norms"
        reform_existing: {
          continuous: {
            ONT_S: { pos: [0.02, 0.05, 0.15, 0.32, 0.46], sal: [0.02, 0.1, 0.3, 0.58] },
            MAT: { pos: [0.15, 0.3, 0.35, 0.15, 0.05] },
            PRO: { pos: [0.02, 0.08, 0.2, 0.35, 0.35] }
          }
        },
        // "Replace outdated institutions with new ones designed for current
        //  challenges — many existing ones can't be repaired"
        build_new: {
          continuous: {
            ONT_S: { pos: [0.05, 0.13, 0.27, 0.35, 0.2], sal: [0.05, 0.2, 0.4, 0.35] },
            MAT: { pos: [0.2, 0.3, 0.3, 0.15, 0.05] },
            PRO: { pos: [0.1, 0.2, 0.4, 0.2, 0.1] }
          }
        },
        // "Return power from federal to state and local governments —
        //  decisions should be closer to the people affected"
        devolve_power: {
          continuous: {
            ONT_S: { pos: [0.2, 0.32, 0.3, 0.13, 0.05], sal: [0.1, 0.25, 0.4, 0.25] },
            MAT: { pos: [0.05, 0.13, 0.27, 0.35, 0.2] },
            PRO: { pos: [0.15, 0.25, 0.35, 0.18, 0.07] }
          }
        },
        // "Reduce the role of unelected experts and elites — reassert
        //  democratic majorities and ordinary-citizen control"
        democratize_rein_in: {
          continuous: {
            ONT_S: { pos: [0.4, 0.32, 0.18, 0.07, 0.03], sal: [0.05, 0.2, 0.4, 0.35] },
            MAT: { pos: [0.2, 0.3, 0.3, 0.13, 0.07] },
            PRO: { pos: [0.4, 0.3, 0.18, 0.07, 0.05] }
          }
        },
        // "Less government overall — more should be left to civil society
        //  and markets"
        shrink_government: {
          continuous: {
            ONT_S: { pos: [0.42, 0.3, 0.18, 0.07, 0.03], sal: [0.1, 0.25, 0.4, 0.25] },
            MAT: { pos: [0.02, 0.05, 0.18, 0.32, 0.43] },
            PRO: { pos: [0.2, 0.3, 0.3, 0.15, 0.05] }
          }
        }
      }
    },
    // =========================================================================
    // ADR-007 — Moral Circle Calibration Battery (T3)
    //
    // Battery A: two universal-baseline items. Both feed
    //            moralCircle.universal directly. Engine averages contributions.
    // Battery B: eight scoped-affinity single_choice questions, one per scope.
    //            Each emits moralCircle.scopedAffinities[scope].
    //
    // Per ADR-007 §"Calibration Battery", this is the PRIMARY source for
    // moral-circle evidence. Existing questions (Q60, Q102, etc.) provide
    // weaker priors only.
    //
    // Battery B option mapping (5-level comparative scale):
    //   not_meaningful  -> null (scope drops out for this respondent)
    //   less_than       -> 30   (below typical universal; almost never makes excess)
    //   about_same      -> 50   (matches universal; no excess)
    //   somewhat_more   -> 70   (small excess for typical universal users)
    //   much_more       -> 90   (large excess; clearly active boundary)
    //
    // Active boundary only emerges when scoped > universal. Most respondents
    // will have 0-2 active scopes after derivation.
    // =========================================================================
    // Q229 — moral-circle in-group importance, 3-bucket priority sort.
    // 2026-05-13 revision: was single_choice (8 options, one of which was
    // "everyone equal"). Now 3-bucket sort over 6 in-groups — quantitative
    // info on ALL six scopes per respondent rather than just the top pick.
    // Universal anchor is no longer carried here (Q8 + Q213 handle it).
    // The conditional Q228 is retired in favor of this question, which fires
    // unconditionally for everyone and serves the same purpose.
    //
    // Bucket emissions (after applyPrioritySort weight scaling):
    //   supportHigh (full weight, 1.0): scoped:95 → real excess even when
    //     respondent's universal sits at 90 (Q8 clearly_abroad).
    //   supportMid (half weight, 0.5): scoped:72.5 → meaningful for low/mid
    //     universal respondents, ~0 excess for universalists.
    //   neutral / opposeHigh: no emission (skip).
    {
      id: 229,
      stage: "fixed12",
      section: "I",
      promptShort: "moral_circle_in_group_sort",
      promptFull: "How much extra moral concern do you feel for each of these groups, beyond what you feel for people in general? Sort each into the column that fits best.",
      uiType: "priority_sort",
      quality: 0.97,
      rewriteNeeded: false,
      optionLabels: {
        ingroup_national: "Fellow citizens of your country",
        ingroup_religious: "People who share your religious tradition",
        ingroup_ethnic_racial: "People of your racial or ethnic background",
        ingroup_class: "People in your economic class",
        ingroup_gender: "People who share your gender",
        ingroup_ideological: "People who share your core political values"
      },
      touchProfile: [
        { node: "TRB_ANCHOR", kind: "derived", role: "anchor", weight: 0.1, touchType: "scoped_affinity_legacy_proxy" }
      ],
      rankingMap: {
        ingroup_national: { moralCircle: { scopedAffinities: { national: 95 } } },
        ingroup_religious: { moralCircle: { scopedAffinities: { religious: 95 } } },
        ingroup_ethnic_racial: { moralCircle: { scopedAffinities: { ethnic_racial: 95 } } },
        ingroup_class: { moralCircle: { scopedAffinities: { class: 95 } } },
        ingroup_gender: { moralCircle: { scopedAffinities: { gender: 95 } } },
        ingroup_ideological: { moralCircle: { scopedAffinities: { ideological: 95 } } }
      }
    },
    // Q-A1: universal_baseline_humanity
    {
      id: 230,
      stage: "fixed12",
      section: "I",
      promptShort: "universal_baseline_humanity",
      promptFull: "How much moral concern do you feel for any human being, simply because they are human?",
      uiType: "slider",
      quality: 0.98,
      rewriteNeeded: false,
      touchProfile: [
        { node: "MOR", kind: "continuous", role: "position", weight: 0.1, touchType: "universal_baseline_legacy_proxy" }
      ],
      sliderMap: {
        "0-20": { moralCircle: { universal: 10 } },
        "21-40": { moralCircle: { universal: 30 } },
        "41-60": { moralCircle: { universal: 50 } },
        "61-80": { moralCircle: { universal: 75 } },
        "81-100": { moralCircle: { universal: 95 } }
      }
    },
    // Q-A2: universal_baseline_stranger
    {
      id: 231,
      stage: "fixed12",
      section: "I",
      promptShort: "universal_baseline_stranger",
      promptFull: "When a stranger is suffering, how much does that matter to you even if they share none of your identities, beliefs, nationality, or politics?",
      uiType: "slider",
      quality: 0.97,
      rewriteNeeded: false,
      touchProfile: [
        { node: "MOR", kind: "continuous", role: "position", weight: 0.1, touchType: "universal_baseline_legacy_proxy" }
      ],
      sliderMap: {
        "0-20": { moralCircle: { universal: 10 } },
        "21-40": { moralCircle: { universal: 30 } },
        "41-60": { moralCircle: { universal: 50 } },
        "61-80": { moralCircle: { universal: 75 } },
        "81-100": { moralCircle: { universal: 95 } }
      }
    },
    // Battery B — scoped affinity per scope (8 questions, 5 options each).
    // Same prompt skeleton; only the in-group label differs.
    // Comparative scale: not_meaningful / less_than / about_same / somewhat_more / much_more
    // Active excess emerges only on "somewhat_more" (70) and "much_more" (90)
    // when universal is moderate; only "much_more" creates excess for high-universal users.
    {
      id: 232,
      stage: "stage2",
      section: "V",
      promptShort: "scoped_affinity_national",
      promptFull: "Compared with people in general, how much extra moral concern do you feel for people in your country?",
      uiType: "single_choice",
      quality: 0.95,
      rewriteNeeded: false,
      touchProfile: [
        { node: "TRB_ANCHOR", kind: "derived", role: "anchor", weight: 0.1, touchType: "scoped_affinity_legacy_proxy" }
      ],
      optionEvidence: {
        not_meaningful: { moralCircle: { scopedAffinities: { national: null } } },
        less_than: { moralCircle: { scopedAffinities: { national: 30 } } },
        about_same: { moralCircle: { scopedAffinities: { national: 50 } } },
        somewhat_more: { moralCircle: { scopedAffinities: { national: 70 } } },
        much_more: { moralCircle: { scopedAffinities: { national: 90 } } }
      }
    },
    {
      id: 233,
      stage: "stage2",
      section: "V",
      promptShort: "scoped_affinity_religious",
      promptFull: "Compared with people in general, how much extra moral concern do you feel for people who share your religious tradition or sacred worldview?",
      uiType: "single_choice",
      quality: 0.95,
      rewriteNeeded: false,
      touchProfile: [
        { node: "TRB_ANCHOR", kind: "derived", role: "anchor", weight: 0.1, touchType: "scoped_affinity_legacy_proxy" }
      ],
      optionEvidence: {
        not_meaningful: { moralCircle: { scopedAffinities: { religious: null } } },
        less_than: { moralCircle: { scopedAffinities: { religious: 30 } } },
        about_same: { moralCircle: { scopedAffinities: { religious: 50 } } },
        somewhat_more: { moralCircle: { scopedAffinities: { religious: 70 } } },
        much_more: { moralCircle: { scopedAffinities: { religious: 90 } } }
      }
    },
    {
      id: 234,
      stage: "stage2",
      section: "V",
      promptShort: "scoped_affinity_ethnic_racial",
      promptFull: "Compared with people in general, how much extra moral concern do you feel for people who share your racial or ethnic background?",
      uiType: "single_choice",
      quality: 0.95,
      rewriteNeeded: false,
      touchProfile: [
        { node: "TRB_ANCHOR", kind: "derived", role: "anchor", weight: 0.1, touchType: "scoped_affinity_legacy_proxy" }
      ],
      optionEvidence: {
        not_meaningful: { moralCircle: { scopedAffinities: { ethnic_racial: null } } },
        less_than: { moralCircle: { scopedAffinities: { ethnic_racial: 30 } } },
        about_same: { moralCircle: { scopedAffinities: { ethnic_racial: 50 } } },
        somewhat_more: { moralCircle: { scopedAffinities: { ethnic_racial: 70 } } },
        much_more: { moralCircle: { scopedAffinities: { ethnic_racial: 90 } } }
      }
    },
    {
      id: 235,
      stage: "stage2",
      section: "V",
      promptShort: "scoped_affinity_class",
      promptFull: "Compared with people in general, how much extra moral concern do you feel for people in your economic class or material situation?",
      uiType: "single_choice",
      quality: 0.95,
      rewriteNeeded: false,
      touchProfile: [
        { node: "TRB_ANCHOR", kind: "derived", role: "anchor", weight: 0.1, touchType: "scoped_affinity_legacy_proxy" }
      ],
      optionEvidence: {
        not_meaningful: { moralCircle: { scopedAffinities: { class: null } } },
        less_than: { moralCircle: { scopedAffinities: { class: 30 } } },
        about_same: { moralCircle: { scopedAffinities: { class: 50 } } },
        somewhat_more: { moralCircle: { scopedAffinities: { class: 70 } } },
        much_more: { moralCircle: { scopedAffinities: { class: 90 } } }
      }
    },
    // Q236 — gender scope. 2026-05-13: dropped the "(including LGBTQ status)"
    // parenthetical per Sam — the LGBTQ scope of moral circle doesn't exist
    // as a separate axis. LGBTQ Voter (archetype 144) still routes via the
    // gender excess + demo_lgbtq lock-and-key in the IDP resolver.
    {
      id: 236,
      stage: "stage2",
      section: "V",
      promptShort: "scoped_affinity_gender",
      promptFull: "Compared with people in general, how much extra moral concern do you feel for people who share your gender?",
      uiType: "single_choice",
      quality: 0.95,
      rewriteNeeded: false,
      touchProfile: [
        { node: "TRB_ANCHOR", kind: "derived", role: "anchor", weight: 0.1, touchType: "scoped_affinity_legacy_proxy" }
      ],
      optionEvidence: {
        not_meaningful: { moralCircle: { scopedAffinities: { gender: null } } },
        less_than: { moralCircle: { scopedAffinities: { gender: 30 } } },
        about_same: { moralCircle: { scopedAffinities: { gender: 50 } } },
        somewhat_more: { moralCircle: { scopedAffinities: { gender: 70 } } },
        much_more: { moralCircle: { scopedAffinities: { gender: 90 } } }
      }
    },
    // Q238 — ideological scope (merged: ideology + political-side; the broader
    // name survives since "I share their values" subsumes "I share their party").
    // Q237 (sexual) and Q239 (political_camp) dropped per 2026-05-07 6-scope
    // revision.
    {
      id: 238,
      stage: "stage2",
      section: "V",
      promptShort: "scoped_affinity_ideological",
      promptFull: "Compared with people in general, how much extra moral concern do you feel for people who share your core ideology, values, or political side?",
      uiType: "single_choice",
      quality: 0.95,
      rewriteNeeded: false,
      touchProfile: [
        { node: "TRB_ANCHOR", kind: "derived", role: "anchor", weight: 0.1, touchType: "scoped_affinity_legacy_proxy" }
      ],
      optionEvidence: {
        not_meaningful: { moralCircle: { scopedAffinities: { ideological: null } } },
        less_than: { moralCircle: { scopedAffinities: { ideological: 30 } } },
        about_same: { moralCircle: { scopedAffinities: { ideological: 50 } } },
        somewhat_more: { moralCircle: { scopedAffinities: { ideological: 70 } } },
        much_more: { moralCircle: { scopedAffinities: { ideological: 90 } } }
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
    { id: "AES", type: "categorical", cluster: "MEANS" },
    { id: "COM", type: "continuous", cluster: "MEANS" },
    // ONT_S moved back to MEANS (2026-05-12): institutional ontology ("are
    // institutions a useful tool?") is closer to "how you act" than to "how
    // you see the world." Sits with PRO/COM/AES as strategy-relevant nodes.
    { id: "ONT_S", type: "continuous", cluster: "MEANS" },
    { id: "ZS", type: "continuous", cluster: "REALITY" },
    { id: "ONT_H", type: "continuous", cluster: "REALITY" },
    // EPS moved from MEANS to REALITY (2026-05-12): epistemic style is closer
    // to "how you see the world" (what counts as knowledge) than to "how you
    // pursue your goals."
    { id: "EPS", type: "categorical", cluster: "REALITY" },
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
  var SELF_NODES = ["PF", "TRB", "ENG"];
  function isSelfNode(nodeId) {
    return SELF_NODES.includes(nodeId);
  }

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
  var MOR_BOUNDARY_ORDER = [
    "national",
    "ethnic_racial",
    "religious",
    "class",
    "ideological",
    "gender",
    "political_tribe"
  ];
  function mkInitialMorBoundaries() {
    return {
      boundaries: {
        national: 0.5,
        ethnic_racial: 0.5,
        religious: 0.5,
        class: 0.5,
        ideological: 0.5,
        gender: 0.5,
        political_tribe: 0.5
      },
      intensity: 0,
      touches: {},
      touchTypes: /* @__PURE__ */ new Set(),
      status: "unknown"
    };
  }
  function addToMorBoundary(current, target, mix) {
    const t = clamp01(target);
    const m = clamp01(mix);
    const updated = current * (1 - m) + t * m;
    return clamp01(updated);
  }
  function bumpMorIntensity(current, target, mix) {
    const t = Math.max(0, Math.min(3, target));
    const m = clamp01(mix);
    const updated = current * (1 - m) + t * m;
    return Math.max(0, Math.min(3, updated));
  }
  function boundaryLoad(b) {
    return Math.max(
      b.national,
      b.ethnic_racial,
      b.religious,
      b.class,
      b.ideological,
      b.gender,
      b.political_tribe
    );
  }
  function assertBoundariesValid(b, label) {
    for (const key of MOR_BOUNDARY_ORDER) {
      const v = b[key];
      if (typeof v !== "number" || !Number.isFinite(v) || v < 0 || v > 1) {
        throw new Error(
          `${label}: morBoundaries.${key} invalid (got ${String(v)}); must be a finite number in [0, 1]`
        );
      }
    }
  }
  function morTargetVectorDistance(respondentBoundaries, targetBoundaries) {
    if (!respondentBoundaries) {
      throw new Error("morTargetVectorDistance: respondentBoundaries is missing \u2014 caller must gate on useMorModule (PR 6.E.4a invariant)");
    }
    if (!targetBoundaries) {
      throw new Error("morTargetVectorDistance: targetBoundaries is missing \u2014 caller must gate on useMorModule (PR 6.E.4a invariant)");
    }
    assertBoundariesValid(respondentBoundaries, "morTargetVectorDistance respondent");
    assertBoundariesValid(targetBoundaries, "morTargetVectorDistance target");
    let sumSq = 0;
    for (const key of MOR_BOUNDARY_ORDER) {
      const d = respondentBoundaries[key] - targetBoundaries[key];
      sumSq += d * d;
    }
    return Math.sqrt(sumSq / MOR_BOUNDARY_ORDER.length);
  }
  function clamp01(x) {
    if (x < 0) return 0;
    if (x > 1) return 1;
    return x;
  }
  var MORAL_CIRCLE_SCOPES_ORDER = [
    "national",
    "religious",
    "ethnic_racial",
    "class",
    "gender",
    "ideological"
  ];
  function moralCircleDistance(state, archetype) {
    const uDiff = Math.abs(state.universalAffinity - archetype.universalAffinity) / 100;
    let sumSq = 0;
    let pairCount = 0;
    for (const scope of MORAL_CIRCLE_SCOPES_ORDER) {
      const archScoped = archetype.scopedAffinities[scope];
      if (archScoped === null || archScoped === void 0) continue;
      const archExcess = Math.max(0, archScoped - archetype.universalAffinity);
      const stateExcess = state.excessAffinities[scope] ?? 0;
      const d = archExcess - stateExcess;
      sumSq += d * d;
      pairCount += 1;
    }
    const maxL2 = Math.sqrt(pairCount * 100 * 100);
    const excessDist = maxL2 > 0 ? Math.sqrt(sumSq) / maxL2 : 0;
    const stateActive = new Set(state.activeBoundaries);
    const archActive = /* @__PURE__ */ new Set();
    for (const scope of MORAL_CIRCLE_SCOPES_ORDER) {
      const archScoped = archetype.scopedAffinities[scope];
      if (archScoped === null || archScoped === void 0) continue;
      if (archScoped > archetype.universalAffinity) archActive.add(scope);
    }
    let intersect = 0;
    let union = 0;
    for (const scope of MORAL_CIRCLE_SCOPES_ORDER) {
      const inS = stateActive.has(scope);
      const inA = archActive.has(scope);
      if (inS && inA) intersect++;
      if (inS || inA) union++;
    }
    const jaccardMiss = union === 0 ? 0 : 1 - intersect / union;
    const blended = uDiff * 0.4 + excessDist * 0.4 + jaccardMiss * 0.2;
    return clamp01(blended);
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
  var BRIDGE_MOR_MIX = 0.06;
  var BRIDGE_TRB_MIX = 0.1;
  var BRIDGE_PF_MIX_BD = 0.1;
  var BRIDGE_PF_MIX_INT = 0.06;
  var BRIDGE_MOR_SAL_MIX = 0.1;
  var BRIDGE_GLOBAL_BD_MIX = 0.1;
  var BRIDGE_GLOBAL_BD_TARGET = 0.15;
  var BRIDGE_INT_TARGET = 2.5;
  var BRIDGE_BD_TARGET = 0.8;
  function anchorToBoundary(anchor) {
    switch (anchor) {
      case "national":
        return "national";
      case "ethnic_racial":
        return "ethnic_racial";
      case "religious":
        return "religious";
      case "class":
        return "class";
      case "ideological":
        return "ideological";
      case "gender":
        return "gender";
      case "sexual":
        return "gender";
      // collapsed per resolver design
      case "global":
        return null;
      case "mixed_none":
        return null;
      default:
        return null;
    }
  }
  function mirrorMorPosToBoundaries(state, nodeId, posDist, weight = 1) {
    if (!state.morBoundaries || !posDist || posDist.length !== 5) return;
    const sum = posDist.reduce((a, b) => a + b, 0);
    if (sum <= 0) return;
    const meanPos = posDist[0] / sum * 1 + posDist[1] / sum * 2 + posDist[2] / sum * 3 + posDist[3] / sum * 4 + posDist[4] / sum * 5;
    const w = Math.max(0, Math.min(1, weight));
    if (nodeId === "MOR") {
      const target = Math.max(0, Math.min(1, 1 - (meanPos - 1) / 4));
      const mix = BRIDGE_MOR_MIX * w;
      for (const k of MOR_BOUNDARY_ORDER) {
        state.morBoundaries.boundaries[k] = addToMorBoundary(
          state.morBoundaries.boundaries[k],
          target,
          mix
        );
      }
    } else if (nodeId === "TRB") {
      const target = (meanPos - 1) / 4 * 3;
      state.morBoundaries.intensity = bumpMorIntensity(
        state.morBoundaries.intensity,
        target,
        BRIDGE_TRB_MIX * w
      );
    } else {
      const targetBd = Math.max(0, Math.min(1, (meanPos - 1) / 4));
      const targetInt = (meanPos - 1) / 4 * 3;
      state.morBoundaries.boundaries.political_tribe = addToMorBoundary(
        state.morBoundaries.boundaries.political_tribe,
        targetBd,
        BRIDGE_PF_MIX_BD * w
      );
      state.morBoundaries.intensity = bumpMorIntensity(
        state.morBoundaries.intensity,
        targetInt,
        BRIDGE_PF_MIX_INT * w
      );
    }
  }
  function mirrorMorSalToIntensity(state, salDist, weight = 1) {
    if (!state.morBoundaries || !salDist || salDist.length !== 4) return;
    const sum = salDist.reduce((a, b) => a + b, 0);
    if (sum <= 0) return;
    const expectedSal3 = salDist[0] / sum * 0 + salDist[1] / sum * 1 + salDist[2] / sum * 2 + salDist[3] / sum * 3;
    const w = Math.max(0, Math.min(1, weight));
    state.morBoundaries.intensity = bumpMorIntensity(
      state.morBoundaries.intensity,
      expectedSal3,
      BRIDGE_MOR_SAL_MIX * w
    );
  }
  function mirrorMorSignalToBoundaries(state, nodeId, signal, weight = 1) {
    if (!state.morBoundaries || !Number.isFinite(signal)) return;
    const peak = Math.max(1, Math.min(5, 3 + signal * 2));
    const sigma = 0.8;
    const raw = [1, 2, 3, 4, 5].map(
      (i) => Math.exp(-0.5 * ((i - peak) / sigma) ** 2)
    );
    mirrorMorPosToBoundaries(state, nodeId, raw, weight);
  }
  function mirrorAnchorToBoundaries(state, signals, weight = 1) {
    if (!state.morBoundaries || !signals) return;
    const w = Math.max(0, Math.min(1, weight));
    for (const [anchor, raw] of Object.entries(signals)) {
      if (raw === void 0 || raw <= 0) continue;
      const mag = Math.abs(raw);
      if (anchor === "global") {
        const bdMix = Math.min(0.3, (0.05 + mag * 0.1) * w) * (BRIDGE_GLOBAL_BD_MIX / 0.1);
        for (const k of MOR_BOUNDARY_ORDER) {
          state.morBoundaries.boundaries[k] = addToMorBoundary(
            state.morBoundaries.boundaries[k],
            BRIDGE_GLOBAL_BD_TARGET,
            bdMix
          );
        }
        const intMix2 = Math.min(0.2, (0.04 + mag * 0.06) * w);
        state.morBoundaries.intensity = bumpMorIntensity(
          state.morBoundaries.intensity,
          BRIDGE_INT_TARGET,
          intMix2
        );
        continue;
      }
      if (anchor === "mixed_none") continue;
      const key = anchorToBoundary(anchor);
      if (key) {
        const mix = Math.min(0.3, (0.05 + mag * 0.1) * w);
        state.morBoundaries.boundaries[key] = addToMorBoundary(
          state.morBoundaries.boundaries[key],
          BRIDGE_BD_TARGET,
          mix
        );
      }
      const intMix = Math.min(0.2, (0.04 + mag * 0.06) * w);
      state.morBoundaries.intensity = bumpMorIntensity(
        state.morBoundaries.intensity,
        BRIDGE_INT_TARGET,
        intMix
      );
    }
  }
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
        if (touch.node === "MOR") {
          mirrorMorSalToIntensity(state, EXTREMITY_SAL, 1);
        }
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
        if (upd?.pos && (nodeId === "MOR" || nodeId === "TRB" || nodeId === "PF")) {
          mirrorMorPosToBoundaries(state, nodeId, upd.pos, 1);
        }
        if (upd?.sal && nodeId === "MOR") {
          mirrorMorSalToIntensity(state, upd.sal, 1);
        }
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
      mirrorAnchorToBoundaries(state, evidence.trbAnchor, 1);
    }
    if (evidence.moralCircle) {
      applyMoralCircleEvidence(state, evidence.moralCircle);
    }
  }
  function applyMoralCircleEvidence(state, ev) {
    if (!state.moralCircle) return;
    const acc = state.moralCircle.accumulator;
    if (typeof ev.universal === "number" && Number.isFinite(ev.universal)) {
      const v = Math.max(0, Math.min(100, ev.universal));
      acc.universalSum += v;
      acc.universalCount += 1;
    }
    if (ev.scopedAffinities) {
      for (const [scope, raw] of Object.entries(ev.scopedAffinities)) {
        if (raw === null || raw === void 0) continue;
        if (typeof raw !== "number" || !Number.isFinite(raw)) continue;
        const v = Math.max(0, Math.min(100, raw));
        const key = scope;
        acc.scopedSums[key] = (acc.scopedSums[key] ?? 0) + v;
        acc.scopedCounts[key] = (acc.scopedCounts[key] ?? 0) + 1;
      }
    }
    state.moralCircle.touchCount += 1;
    state.moralCircle.affinity = materializeAffinityFromAccumulator(acc);
  }
  function materializeAffinityFromAccumulator(acc) {
    const universalAffinity = acc.universalCount > 0 ? acc.universalSum / acc.universalCount : 50;
    const SCOPES = [
      "national",
      "religious",
      "ethnic_racial",
      "class",
      "gender",
      "ideological"
    ];
    const scopedAffinities = {};
    for (const scope of SCOPES) {
      const cnt = acc.scopedCounts[scope] ?? 0;
      if (cnt > 0) {
        scopedAffinities[scope] = (acc.scopedSums[scope] ?? 0) / cnt;
      } else {
        scopedAffinities[scope] = null;
      }
    }
    const excessAffinities = {};
    let sumSq = 0;
    for (const scope of SCOPES) {
      const raw = scopedAffinities[scope];
      if (raw === null) {
        excessAffinities[scope] = 0;
        continue;
      }
      const e = Math.max(0, raw - universalAffinity);
      excessAffinities[scope] = e;
      sumSq += e * e;
    }
    const l2 = Math.sqrt(sumSq);
    const intensity01 = Math.min(1, l2 / 100);
    const intensity03 = 3 * intensity01;
    const activeBoundaries = SCOPES.filter((s) => excessAffinities[s] > 0);
    return {
      universalAffinity,
      scopedAffinities,
      excessAffinities,
      activeBoundaries: [...activeBoundaries],
      intensity01,
      intensity03
    };
  }
  function partyIdFromAnswer(optionKey) {
    switch (optionKey) {
      case "dem":
        return "D";
      case "rep":
        return "R";
      case "ind":
        return "I";
      case "third":
        return "T";
      case "other":
        return "O";
      case "none":
        return "N";
      default:
        return null;
    }
  }
  function negativePartiesFromAnswers(optionKeys) {
    const out = /* @__PURE__ */ new Set();
    for (const optionKey of optionKeys) {
      if (optionKey === "never_dem") out.add("D");
      if (optionKey === "never_rep") out.add("R");
      if (optionKey === "never_dem_or_rep") {
        out.add("D");
        out.add("R");
      }
    }
    return out.size > 0 ? out : null;
  }
  function applyMetadataAnswer(state, q, optionKeyOrKeys) {
    const optionKeys = Array.isArray(optionKeyOrKeys) ? optionKeyOrKeys : [optionKeyOrKeys];
    switch (q.id) {
      case 200:
        state.partyID = typeof optionKeyOrKeys === "string" ? partyIdFromAnswer(optionKeyOrKeys) : null;
        return;
      case 211:
        state.strategicVoting = optionKeys.includes("strategic_lesser_evil");
        return;
      case 212:
        state.negativeParties = negativePartiesFromAnswers(optionKeys);
        return;
      default:
        return;
    }
  }
  function applySingleChoiceAnswer(state, q, optionKey) {
    state.answers[q.id] = optionKey;
    applyMetadataAnswer(state, q, optionKey);
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
  function applyMultiAnswer(state, q, optionKeys) {
    state.answers[q.id] = optionKeys.slice();
    applyMetadataAnswer(state, q, optionKeys);
    registerTouches(state, q);
    for (const optionKey of optionKeys) {
      const ev = q.optionEvidence?.[optionKey];
      applyOptionEvidence(state, ev);
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
          if (nodeId === "MOR" || nodeId === "TRB" || nodeId === "PF") {
            mirrorMorSignalToBoundaries(state, nodeId, (signal ?? 0) * normFactor, share);
          }
        }
      }
      if (map.categorical) {
        for (const [nodeId, catDist] of Object.entries(map.categorical)) {
          const node = state.categorical[nodeId];
          if (!node || !catDist) continue;
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
        mirrorAnchorToBoundaries(state, scaled, 1);
      }
      if (map.moralCircle && share >= 0.05) {
        const scaled = {};
        if (typeof map.moralCircle.universal === "number") {
          scaled.universal = map.moralCircle.universal;
        }
        if (map.moralCircle.scopedAffinities) {
          scaled.scopedAffinities = { ...map.moralCircle.scopedAffinities };
        }
        applyMoralCircleEvidence(state, scaled);
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
        if (touch.node === "MOR") mirrorMorSalToIntensity(state, salLikelihood, 1);
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
          const sig = typeof signal === "number" ? signal : 0;
          const bump = node.posDist.map((p, i) => p * Math.exp(sig * normFactor * rankWeight * (i + 1 - 3)));
          node.posDist = normalize(bump);
          if (salLikelihood) {
            node.salDist = multiplyAndNormalize(node.salDist, salLikelihood);
          }
          if (nodeId === "MOR" || nodeId === "TRB" || nodeId === "PF") {
            mirrorMorSignalToBoundaries(state, nodeId, sig * normFactor, rankWeight);
          }
          if (nodeId === "MOR" && salLikelihood) {
            mirrorMorSalToIntensity(state, salLikelihood, rankWeight);
          }
        }
      }
      if (map.categorical) {
        for (const [nodeId, catDist] of Object.entries(map.categorical)) {
          const node = state.categorical[nodeId];
          if (!node || !catDist) continue;
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
        mirrorAnchorToBoundaries(state, scaled, 1);
      }
      if (map.moralCircle && rankWeight > 0) {
        const scaled = {};
        if (typeof map.moralCircle.universal === "number") {
          scaled.universal = map.moralCircle.universal;
        }
        if (map.moralCircle.scopedAffinities) {
          scaled.scopedAffinities = { ...map.moralCircle.scopedAffinities };
        }
        if (rankWeight >= 0.2) {
          applyMoralCircleEvidence(state, scaled);
        }
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
      const sal = resolveSal(buckets);
      node.salDist = multiplyAndNormalize(node.salDist, sal);
      if (nodeId === "MOR") mirrorMorSalToIntensity(state, sal, 1);
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
        if (typeof evidence !== "object" || !evidence?.pos) continue;
        const pos = evidence.pos;
        const node = state.continuous[nodeId];
        if (!node) continue;
        const w = isBest ? BW_BEST_POS_MIX : BW_WORST_POS_MIX;
        const sum = pos.reduce((a, b) => a + b, 0) || 1;
        const target = isBest ? pos.map((p) => p / sum) : pos.map((p) => 1 - p / sum);
        const tSum = target.reduce((a, b) => a + b, 0) || 1;
        const tNorm = target.map((p) => p / tSum);
        const mixed = node.posDist.map((v, i) => v * (1 - w) + tNorm[i] * w);
        node.posDist = normalize(mixed);
        if (nodeId === "MOR" || nodeId === "TRB" || nodeId === "PF") {
          mirrorMorPosToBoundaries(state, nodeId, tNorm, w);
        }
      }
    }
    let anchorApplied = false;
    for (const item of allItems) {
      if (!bestSet.has(item)) continue;
      const map = q.rankingMap[item];
      if (!map?.trbAnchor) continue;
      state.trbAnchor.dist = addToAnchorDist(state.trbAnchor.dist, map.trbAnchor);
      mirrorAnchorToBoundaries(state, map.trbAnchor, 1);
      anchorApplied = true;
    }
    if (anchorApplied) state.trbAnchor.touches += 1;
    for (const item of allItems) {
      if (!bestSet.has(item)) continue;
      const map = q.rankingMap[item];
      if (!map?.moralCircle) continue;
      const scaled = {};
      if (typeof map.moralCircle.universal === "number") {
        scaled.universal = map.moralCircle.universal;
      }
      if (map.moralCircle.scopedAffinities) {
        scaled.scopedAffinities = { ...map.moralCircle.scopedAffinities };
      }
      applyMoralCircleEvidence(state, scaled);
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
      const sal = resolveSal(buckets);
      node.salDist = multiplyAndNormalize(node.salDist, sal);
      if (nodeId === "MOR") mirrorMorSalToIntensity(state, sal, 1);
    }
    for (const [nodeId, buckets] of categoricalBuckets) {
      const node = state.categorical[nodeId];
      if (!node) continue;
      node.salDist = multiplyAndNormalize(node.salDist, resolveSal(buckets));
    }
    const UNIFORM_THRESHOLD_PSORT = 0.95 * Math.log(5);
    const perNodeTargetSum = /* @__PURE__ */ new Map();
    const perNodeWeightSum = /* @__PURE__ */ new Map();
    for (const item of allItems) {
      const map = q.rankingMap[item];
      if (!map?.continuous) continue;
      const bucket = bucketFor(item);
      if (bucket === "neutral") continue;
      const itemWeight = bucket === "supportMid" ? PRIORITY_MID_POS_MIX : PRIORITY_HIGH_POS_MIX;
      const invert = bucket === "opposeHigh";
      for (const [nodeId, evidence] of Object.entries(map.continuous)) {
        if (typeof evidence !== "object" || !evidence?.pos) continue;
        const pos = evidence.pos;
        const sum = pos.reduce((a, b) => a + b, 0) || 1;
        const raw = invert ? pos.map((p) => 1 - p / sum) : pos.map((p) => p / sum);
        const rawSum = raw.reduce((a, b) => a + b, 0) || 1;
        const itemTarget = raw.map((p) => p / rawSum);
        if (!perNodeTargetSum.has(nodeId)) {
          perNodeTargetSum.set(nodeId, [0, 0, 0, 0, 0]);
          perNodeWeightSum.set(nodeId, 0);
        }
        const acc = perNodeTargetSum.get(nodeId);
        for (let i = 0; i < 5; i++) acc[i] += itemTarget[i] * itemWeight;
        perNodeWeightSum.set(nodeId, (perNodeWeightSum.get(nodeId) ?? 0) + itemWeight);
      }
    }
    const skipPositionForNode = /* @__PURE__ */ new Set();
    for (const [nodeId, sumArr] of perNodeTargetSum) {
      const totalW = perNodeWeightSum.get(nodeId) ?? 0;
      if (totalW <= 0) continue;
      const targetNorm = sumArr.map((v) => v / totalW);
      let entropy2 = 0;
      for (const p of targetNorm) if (p > 0) entropy2 -= p * Math.log(p);
      if (entropy2 >= UNIFORM_THRESHOLD_PSORT) skipPositionForNode.add(nodeId);
    }
    if (q.id === 102) {
      const allInHigh = placements.supportHigh.length === allItems.length && allItems.length > 0;
      const allInOppose = placements.opposeHigh.length === allItems.length && allItems.length > 0;
      if (allInHigh || allInOppose) {
        const node = state.continuous["CU"];
        if (node) {
          const target = allInHigh ? [0.9, 0.05, 0.03, 0.01, 0.01] : [0.01, 0.01, 0.03, 0.05, 0.9];
          const w = 0.85;
          const mixed = node.posDist.map((v, i) => v * (1 - w) + target[i] * w);
          node.posDist = normalize(mixed);
        }
        skipPositionForNode.add("CU");
      }
    }
    for (const item of allItems) {
      const map = q.rankingMap[item];
      if (!map?.continuous) continue;
      const bucket = bucketFor(item);
      if (bucket === "neutral") continue;
      const w = bucket === "supportMid" ? PRIORITY_MID_POS_MIX : PRIORITY_HIGH_POS_MIX;
      const invert = bucket === "opposeHigh";
      for (const [nodeId, evidence] of Object.entries(map.continuous)) {
        if (skipPositionForNode.has(nodeId)) continue;
        if (typeof evidence !== "object" || !evidence?.pos) continue;
        const pos = evidence.pos;
        const node = state.continuous[nodeId];
        if (!node) continue;
        const sum = pos.reduce((a, b) => a + b, 0) || 1;
        const raw = invert ? pos.map((p) => 1 - p / sum) : pos.map((p) => p / sum);
        const rawSum = raw.reduce((a, b) => a + b, 0) || 1;
        const target = raw.map((p) => p / rawSum);
        const mixed = node.posDist.map((v, i) => v * (1 - w) + target[i] * w);
        node.posDist = normalize(mixed);
        if (nodeId === "MOR" || nodeId === "TRB" || nodeId === "PF") {
          mirrorMorPosToBoundaries(state, nodeId, target, w);
        }
      }
    }
    let anchorApplied = false;
    for (const item of allItems) {
      const map = q.rankingMap[item];
      if (!map) continue;
      const bucket = bucketFor(item);
      if (bucket === "neutral" || bucket === "opposeHigh") continue;
      const weight = bucket === "supportHigh" ? 1 : 0.5;
      if (map.trbAnchor) {
        const scaled = {};
        for (const [k, v] of Object.entries(map.trbAnchor)) {
          scaled[k] = v * weight;
        }
        state.trbAnchor.dist = addToAnchorDist(state.trbAnchor.dist, scaled);
        mirrorAnchorToBoundaries(state, scaled, 1);
        anchorApplied = true;
      }
      if (map.moralCircle) {
        const NEUTRAL = 50;
        const scaled = {};
        if (typeof map.moralCircle.universal === "number") {
          scaled.universal = NEUTRAL + weight * (map.moralCircle.universal - NEUTRAL);
        }
        if (map.moralCircle.scopedAffinities) {
          const out = {};
          for (const [k, v] of Object.entries(map.moralCircle.scopedAffinities)) {
            if (v === null || v === void 0) continue;
            out[k] = NEUTRAL + weight * (v - NEUTRAL);
          }
          scaled.scopedAffinities = out;
        }
        applyMoralCircleEvidence(state, scaled);
      }
    }
    if (anchorApplied) state.trbAnchor.touches += 1;
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
    const targetIdx = 4 * x;
    const sigma = 0.8;
    const raw = [0, 1, 2, 3, 4].map((i) => {
      const d = i - targetIdx;
      return Math.exp(-0.5 * (d * d) / (sigma * sigma));
    });
    const rawSum = raw.reduce((a, b) => a + b, 0) || 1;
    const normTarget = raw.map((v) => v / rawSum);
    const mixed = node.posDist.map((v, i) => v * (1 - DUAL_AXIS_POS_MIX) + (normTarget[i] ?? 0) * DUAL_AXIS_POS_MIX);
    node.posDist = normalize(mixed);
    const dualSal = dualAxisYtoSal(y);
    node.salDist = multiplyAndNormalize(node.salDist, dualSal);
    if (map.node === "MOR" || map.node === "TRB" || map.node === "PF") {
      mirrorMorPosToBoundaries(state, map.node, normTarget, DUAL_AXIS_POS_MIX);
    }
    if (map.node === "MOR") {
      mirrorMorSalToIntensity(state, dualSal, 1);
    }
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
          if (nodeId === "MOR" || nodeId === "TRB" || nodeId === "PF") {
            mirrorMorSignalToBoundaries(state, nodeId, (signal ?? 0) * normFactor, 1);
          }
        }
      }
      if (map.categorical) {
        for (const [nodeId, catDist] of Object.entries(map.categorical)) {
          const node = state.categorical[nodeId];
          if (!node || !catDist) continue;
          const normFactor = NODE_NORM_FACTORS[nodeId] ?? 1;
          const mixWeight = 0.4 * normFactor;
          const mixed = node.catDist.map((v, i) => v * (1 - mixWeight) + (catDist[i] ?? 0) * mixWeight);
          node.catDist = normalize(mixed);
        }
      }
      if (map.trbAnchor) {
        state.trbAnchor.dist = addToAnchorDist(state.trbAnchor.dist, map.trbAnchor);
        state.trbAnchor.touches += 1;
        mirrorAnchorToBoundaries(state, map.trbAnchor, 1);
      }
      if (map.moralCircle) {
        applyMoralCircleEvidence(state, map.moralCircle);
      }
    }
  }

  // src/engine/config.ts
  var CORE_OPENER = [
    200,
    // party identification — partyID metadata + weak Bayes prior on
    //   MAT/CD/CU/MOR/ZS/ONT_S/ONT_H (added 2026-05-13).
    103,
    // issue salience screener — global salience router (priorityBattery)
    97,
    // political thought frequency — PF / ENG position
    60,
    // politically important identities — TRB anchor
    89,
    // epistemic style battery — EPS category + salience
    // 2026-05-13: Q22 (source_trust_conflict, EPS tie-breaker) removed from
    //   CORE_OPENER. Q22 was load-bearing for the 124-centroid scorer when
    //   empiricist-vs-institutionalist on a knife's edge decided one cluster
    //   vs another. With the centroid rip, EPS only needs an argmax for the
    //   composed label — Q89 alone gets empiricist to ~37% (winning), and
    //   Q22 only tightens confidence without changing the winner. Saves 1
    //   question. Q22 remains in the bank for the EIG selector to pick
    //   adaptively when EPS is genuinely close.
    218,
    // aesthetic style ranking — AES category + salience
    211,
    // strategic voting — vote-prediction metadata
    212
    // negative partisanship — vote-prediction metadata
  ];
  var UNIVERSAL_SCREENERS = [
    93,
    // priority sort opener — broad MAT/CD/CU/MOR/PRO/COM position+salience
    102,
    // membership criteria priority sort — civic-nationality screen,
    //                                     touches CU/MOR/TRB/CD/MAT/ZS/PRO
    209,
    // zero-sum economics view — direct ZS position read
    210,
    // human malleability view — direct ONT_H position read
    214,
    // institutions foundational — direct ONT_S position read
    // 2026-05-13: moral-circle battery. The `stage: "fixed12"` field on
    // these questions is metadata only — the engine reads this hardcoded
    // list. The EIG scorer doesn't evaluate moralCircle evidence as a
    // dimension, so these need to be in the fixed router or they almost
    // never fire. Q231 (slider universal-baseline) retired in favor of
    // Q8's forced trade-off, which is less subject to social-desirability
    // bias and emits both universal AND national scope signal.
    8,
    // domestic_vs_abroad_lives — 3-option forced trade-off, primary
    //   universal anchor. Replaced Q231 on 2026-05-13.
    229
    // moral_circle_in_group_sort — 3-bucket priority sort over 6
    //   in-groups (national / religious / ethnic_racial / class /
    //   gender / ideological). Fires for every respondent. Replaced
    //   the prior single_choice version on 2026-05-13 to get
    //   quantitative info on ALL scopes per respondent rather than
    //   forcing a single pick. Q228 (conditional version of this
    //   same pattern) was retired the same day; it lives on in the
    //   question bank but is no longer wired into the fixed router.
  ];
  var SALIENCE_ROUTER_FIXED = [
    ...CORE_OPENER,
    ...UNIVERSAL_SCREENERS
  ];
  var MEANINGFUL_POSITION_WEIGHT = 0.4;
  var POSITION_DRILL_SAL_FLOOR = 1.5;
  var MIN_POSITION_TOUCHES_PER_TOP_K = 2;
  var MAX_POSITION_TOUCHES_TOP_K = 4;
  var MAX_POSITION_TOUCHES_NON_TOP_K = 3;
  var TOP_K_BASE = 2;
  var TOP_K_CLOSE_THRESHOLD = 0.3;
  var FIXED_OPENER = SALIENCE_ROUTER_FIXED;

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
      // Q228 gate: only fires when Q8's answer is the clearly-universalist
      // option. Particularist or middle answers reveal in-group preferences
      // directly from Q8; the follow-up is only needed for those who claimed
      // universalist views to surface any residual in-group pull.
      case "answered_q8_abroad":
        return state.answers[8] === "clearly_abroad";
      default:
        return false;
    }
  }
  function isQuestionEligible(state, q) {
    const rules = q.exposeRules?.eligibleIf;
    if (!rules || rules.length === 0) return true;
    return rules.some((predicate) => evaluatePredicate(state, predicate));
  }

  // src/engine/topKDrill.ts
  var SCORING_NODES = [
    "MAT",
    "CD",
    "CU",
    "MOR",
    "PRO",
    "COM",
    "ZS",
    "ONT_H",
    "ONT_S"
  ];
  function expectedSalience(state, nodeId) {
    const node = state.continuous[nodeId];
    if (!node) return 0;
    const d = node.salDist;
    return d[0] * 0 + d[1] * 1 + d[2] * 2 + d[3] * 3;
  }
  function getTopSalientNodes(state, base = TOP_K_BASE, closeThreshold = TOP_K_CLOSE_THRESHOLD, floor = POSITION_DRILL_SAL_FLOOR) {
    const sals = SCORING_NODES.map((n) => ({ node: n, sal: expectedSalience(state, n) })).filter((s) => s.sal >= floor).sort((a, b) => b.sal - a.sal);
    if (sals.length === 0) return [];
    const top = sals.slice(0, base);
    if (sals.length > base) {
      const lastTopSal = top[top.length - 1].sal;
      const next = sals[base].sal;
      if (next >= lastTopSal - closeThreshold) {
        top.push(sals[base]);
      }
    }
    return top.map((s) => s.node);
  }
  function meaningfulPositionTouchCount(state, nodeId, questionsById, threshold = MEANINGFUL_POSITION_WEIGHT) {
    let count = 0;
    for (const qIdStr of Object.keys(state.answers)) {
      const q = questionsById.get(parseInt(qIdStr, 10));
      if (!q) continue;
      const tps = q.touchProfile ?? [];
      for (const tp of tps) {
        if (tp.node === nodeId && tp.role === "position" && tp.weight >= threshold) {
          count++;
          break;
        }
      }
    }
    return count;
  }
  function topKNodesStillNeedingDrill(state, topK, questionsById) {
    return topK.filter(
      (n) => meaningfulPositionTouchCount(state, n, questionsById) < MIN_POSITION_TOUCHES_PER_TOP_K
    );
  }
  function selectTopKDrillQuestion(state, available, questionsById, topK) {
    const needsDrill = topKNodesStillNeedingDrill(state, topK, questionsById);
    if (needsDrill.length === 0) return null;
    const needsDrillSet = new Set(needsDrill);
    if (needsDrillSet.has("CD")) {
      const q3 = available.find((q) => q.id === 3);
      if (q3) {
        const hasCleanCdPositionTouch = q3.touchProfile?.some(
          (tp) => tp.node === "CD" && tp.role === "position" && tp.weight >= MEANINGFUL_POSITION_WEIGHT
        );
        if (hasCleanCdPositionTouch) return q3;
      }
    }
    const candidates = [];
    for (const q of available) {
      const tps = q.touchProfile ?? [];
      const meaningfulHits = /* @__PURE__ */ new Set();
      for (const tp of tps) {
        if (tp.role === "position" && tp.weight >= MEANINGFUL_POSITION_WEIGHT && needsDrillSet.has(tp.node)) {
          meaningfulHits.add(tp.node);
        }
      }
      if (meaningfulHits.size > 0) {
        candidates.push({ q, multiHit: meaningfulHits.size, quality: q.quality ?? 0 });
      }
    }
    if (candidates.length === 0) return null;
    candidates.sort((a, b) => {
      if (b.multiHit !== a.multiHit) return b.multiHit - a.multiHit;
      return b.quality - a.quality;
    });
    return candidates[0].q;
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
  var MIN_QUESTIONS = 22;
  var MAX_QUESTIONS = 35;
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
      let salWeight = 1;
      if (t.role === "position" && CONTINUOUS_NODES.includes(t.node)) {
        const sal = expectedSalience(state, t.node);
        salWeight = 0.3 + sal / 3 * 1.2;
      }
      total += coverage * t.weight * salWeight * touchInfoGain(state, t, questionsById);
    }
    return total * q.quality * (q.rewriteNeeded ? 0.7 : 1);
  }
  function passesTouchCapFilter(state, q, questionsById, topK) {
    const positionTouches = q.touchProfile.filter(
      (t) => t.role === "position" && t.weight >= MEANINGFUL_POSITION_WEIGHT
    );
    if (positionTouches.length === 0) return true;
    for (const t of positionTouches) {
      if (!CONTINUOUS_NODES.includes(t.node)) continue;
      const cap = topK.has(t.node) ? MAX_POSITION_TOUCHES_TOP_K : MAX_POSITION_TOUCHES_NON_TOP_K;
      const touches = meaningfulPositionTouchCount(
        state,
        t.node,
        questionsById
      );
      if (touches < cap) return true;
    }
    return false;
  }
  function passesSalienceFloorGate(state, q) {
    const positionTouches = q.touchProfile.filter(
      (t) => t.role === "position" && t.weight >= MEANINGFUL_POSITION_WEIGHT
    );
    if (positionTouches.length === 0) return true;
    for (const t of positionTouches) {
      if (!CONTINUOUS_NODES.includes(t.node)) continue;
      const sal = expectedSalience(state, t.node);
      if (sal >= POSITION_DRILL_SAL_FLOOR) return true;
    }
    return false;
  }
  var MORAL_CIRCLE_SCOPE_QUESTION_MAP = {
    232: "national",
    233: "religious",
    234: "ethnic_racial",
    235: "class",
    236: "gender",
    // Q237 (sexual) and Q239 (political_camp) removed in 2026-05-07 6-scope
    // revision. sexual folded into gender; political_camp merged into ideological.
    238: "ideological"
  };
  function passesMoralCircleScopeGate(state, q) {
    const scope = MORAL_CIRCLE_SCOPE_QUESTION_MAP[q.id];
    if (!scope) return true;
    const aff = state.moralCircle?.affinity;
    if (!aff) return true;
    const universal = aff.universalAffinity;
    const scoped = aff.scopedAffinities[scope];
    if (scoped === null || scoped === void 0) {
      if (universal >= 80) return false;
      return true;
    }
    if (scoped + 5 <= universal) return false;
    return true;
  }
  function selectNextQuestionEIG(state, available, questionsById) {
    const baseEligible = available.filter(
      (q) => !(q.id in state.answers) && isQuestionEligible(state, q)
    );
    if (!baseEligible.length) return null;
    const topK = new Set(getTopSalientNodes(state));
    const eligible = baseEligible.filter(
      (q) => passesSalienceFloorGate(state, q) && passesTouchCapFilter(state, q, questionsById, topK) && passesMoralCircleScopeGate(state, q)
    );
    if (!eligible.length) return null;
    const FORCED_COVERAGE_PROBES = [
      { qid: 7, node: "COM" },
      // Surfaced by Dumps 1 + 3 COM under-shoot
      { qid: 213, node: "MOR" },
      // Surfaced by Dump 2 MOR wrong-direction
      { qid: 18, node: "ONT_H" },
      // Surfaced by Dump 1 ONT_H sharpness gap
      // PR 3.D (added 2026-04-29 per Sam's PR 3 correction). Q207 emergency_powers
      // chosen over Q85/Q25/Q30/Q41 after candidate eval (scripts/evaluate-pro-
      // probes.ts): Q207's "strong_leader_acts" option pulls PRO mean to 1.66
      // (sharpest among candidates) AND is semantically unambiguous — explicit
      // authoritarian-exception-making rather than generic anti-proceduralism.
      // Sam: "rule-bender authoritarianism is not the same as generic anti-
      // proceduralism. Q207 emergency powers may be more diagnostic than Q85."
      { qid: 207, node: "PRO" }
      // Surfaced by Dump 1 PRO under-extremity
    ];
    for (const { qid, node } of FORCED_COVERAGE_PROBES) {
      const probe = eligible.find((q) => q.id === qid);
      if (!probe) continue;
      let strongProbesAsked = 0;
      for (const askedId of Object.keys(state.answers)) {
        const q = questionsById.get(Number(askedId));
        if (!q) continue;
        if (q.touchProfile.some((t) => t.node === node && t.role === "position" && t.weight >= 0.5)) {
          strongProbesAsked++;
        }
      }
      if (strongProbesAsked < 2) {
        return probe;
      }
    }
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
    const topK = getTopSalientNodes(state);
    for (const nodeId of topK) {
      const touches = meaningfulPositionTouchCount(state, nodeId, questionsById);
      if (touches < /* MIN_POSITION_TOUCHES_PER_TOP_K */
      2) return false;
    }
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

  // src/identity/resolveIdentityPrimary.ts
  var LATENT_INTENSITY = 1.5;
  var LATENT_LOAD = 0.45;
  var ACTIVE_INTENSITY = 2.25;
  var ACTIVE_LOAD = 0.65;
  var ADR007_EXCESS_THRESHOLD = 20;
  var ADR007_SCOPED_THRESHOLD = 70;
  var ADR007_UNIVERSAL_CEILING = 75;
  var ADR007_INTENSITY03_THRESHOLD = 1.2;
  var ADR007_INTENSITY03_DOMINANT = 2.25;
  function expectedContinuous(state, nodeId) {
    const node = state.continuous[nodeId];
    if (!node) return 3;
    return node.posDist.reduce((sum, p, i) => sum + p * (i + 1), 0);
  }
  var MORAL_CIRCLE_SCOPES_ORDER2 = [
    "national",
    "religious",
    "ethnic_racial",
    "class",
    "gender",
    "ideological"
  ];
  function topExcessScope(affinity) {
    let best = null;
    let bestVal = 0;
    for (const scope of MORAL_CIRCLE_SCOPES_ORDER2) {
      const e = affinity.excessAffinities[scope] ?? 0;
      if (e > bestVal) {
        bestVal = e;
        best = scope;
      }
    }
    return best;
  }
  function topBoundary(state) {
    const mb = state.morBoundaries;
    if (!mb) return null;
    let bestKey = MOR_BOUNDARY_ORDER[0];
    let bestVal = mb.boundaries[bestKey];
    let allEqual = true;
    for (const k of MOR_BOUNDARY_ORDER) {
      const v = mb.boundaries[k];
      if (v !== bestVal) allEqual = false;
      if (v > bestVal) {
        bestVal = v;
        bestKey = k;
      }
    }
    return allEqual ? null : bestKey;
  }
  function scopeToLegacyAnchor(scope) {
    switch (scope) {
      case "national":
        return "national";
      case "religious":
        return "religious";
      case "ethnic_racial":
        return "ethnic_racial";
      case "class":
        return "class";
      case "ideological":
        return "ideological";
      case "gender":
        return "gender";
    }
  }
  function resolveIdentityPrimary(state, engagementLabel, demographics) {
    const engagementActive = engagementLabel.level === "engaged" || engagementLabel.level === "highly-engaged";
    const engagementDominant = engagementLabel.level === "highly-engaged";
    if (state.moralCircle?.affinity) {
      return resolveViaMoralCircle(
        state,
        state.moralCircle.affinity,
        engagementLabel,
        engagementActive,
        engagementDominant,
        demographics
      );
    }
    const mb = state.morBoundaries;
    const intensity = mb?.intensity ?? 0;
    const load = mb ? boundaryLoad(mb.boundaries) : 0;
    const anchorTop = topBoundary(state);
    const passedLatent = intensity >= LATENT_INTENSITY && load >= LATENT_LOAD;
    const passedActive = intensity >= ACTIVE_INTENSITY && load >= ACTIVE_LOAD && engagementActive;
    const passedDominant = intensity >= ACTIVE_INTENSITY && load >= ACTIVE_LOAD && engagementDominant;
    const gate = {
      intensity,
      load,
      engagementLevel: engagementLabel.level,
      passedLatent,
      passedActive,
      passedDominant
    };
    if (!passedLatent || !anchorTop) {
      return {
        state: "none",
        anchor: anchorTop ?? void 0,
        reasonCodes: anchorTop ? ["gate_not_met"] : ["module_uninitialized_or_uniform"],
        gate
      };
    }
    const stateLabel = passedDominant ? "dominant" : passedActive ? "active" : "latent";
    if (anchorTop === "gender") {
      const lgbtq = typeof demographics?.demo_lgbtq === "string" ? demographics.demo_lgbtq : "";
      if (lgbtq === "yes") {
        return {
          state: stateLabel,
          label: "LGBTQ Voter",
          confidence: passedActive ? "high" : "medium",
          anchor: anchorTop,
          reasonCodes: ["gender_anchor", "lgbtq_demographic_match", "legacy_path"],
          gate
        };
      }
    }
    if (anchorTop === "ethnic_racial") {
      const race = typeof demographics?.demo_ethnicity === "string" ? demographics.demo_ethnicity : "";
      if (race === "black") {
        return {
          state: stateLabel,
          label: "Black Voter",
          confidence: passedActive ? "high" : "medium",
          anchor: anchorTop,
          reasonCodes: ["racial_anchor", "black_demographic_match"],
          gate
        };
      }
      if (race === "white") {
        const zs = expectedContinuous(state, "ZS");
        const cd = expectedContinuous(state, "CD");
        const onts = expectedContinuous(state, "ONT_S");
        const grievanceSignals = Number(zs >= 3.5) + Number(cd >= 3.5) + Number(onts <= 2.5);
        if (grievanceSignals >= 2) {
          return {
            state: stateLabel,
            label: "White Grievance Voter",
            confidence: grievanceSignals === 3 ? "high" : "medium",
            anchor: anchorTop,
            reasonCodes: ["racial_anchor", "white_demographic_match", "status_threat_pattern"],
            gate
          };
        }
        return {
          state: "unresolved",
          confidence: "low",
          anchor: anchorTop,
          reasonCodes: ["racial_anchor", "white_demographic_match", "insufficient_grievance_signal"],
          gate
        };
      }
      return {
        state: "unresolved",
        confidence: "low",
        anchor: anchorTop,
        reasonCodes: ["racial_anchor", "missing_or_nonresolving_race_demographic"],
        gate
      };
    }
    if (anchorTop === "religious") {
      const religion = typeof demographics?.demo_religion === "string" ? demographics.demo_religion : "";
      if (religion === "christian") {
        return {
          state: stateLabel,
          label: "Evangelical Voter",
          confidence: passedActive ? "medium" : "low",
          anchor: anchorTop,
          reasonCodes: ["religious_anchor", "christian_demographic_match"],
          gate
        };
      }
      return {
        state: "unresolved",
        confidence: "low",
        anchor: anchorTop,
        reasonCodes: ["religious_anchor", "missing_or_non_evangelical_religion_detail"],
        gate
      };
    }
    if (anchorTop === "gender") {
      const gender = typeof demographics?.demo_gender === "string" ? demographics.demo_gender : "";
      const cd = expectedContinuous(state, "CD");
      const mor = expectedContinuous(state, "MOR");
      const onts = expectedContinuous(state, "ONT_S");
      const zs = expectedContinuous(state, "ZS");
      if (gender === "female") {
        const feministSignals = Number(cd <= 2.5) + Number(mor >= 3.5) + Number(onts >= 3.5);
        if (feministSignals >= 2) {
          return {
            state: stateLabel,
            label: "Feminist Voter",
            confidence: feministSignals === 3 ? "high" : "medium",
            anchor: anchorTop,
            reasonCodes: ["gender_anchor", "female_demographic_match", "progressive_gender_pattern"],
            gate
          };
        }
        return {
          state: "unresolved",
          confidence: "low",
          anchor: anchorTop,
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
            anchor: anchorTop,
            reasonCodes: ["gender_anchor", "male_demographic_match", "status_threat_pattern"],
            gate
          };
        }
        return {
          state: "unresolved",
          confidence: "low",
          anchor: anchorTop,
          reasonCodes: ["gender_anchor", "male_demographic_match", "insufficient_grievance_signal"],
          gate
        };
      }
      return {
        state: "unresolved",
        confidence: "low",
        anchor: anchorTop,
        reasonCodes: ["gender_anchor", "missing_or_nonresolving_gender_demographic"],
        gate
      };
    }
    return {
      state: "unresolved",
      confidence: "low",
      anchor: anchorTop,
      reasonCodes: ["identity_pattern_detected_but_anchor_not_yet_resolvable"],
      gate
    };
  }
  function resolveViaMoralCircle(state, affinity, engagementLabel, engagementActive, engagementDominant, demographics) {
    const intensity03 = affinity.intensity03;
    const maxScoped = Math.max(
      0,
      ...MORAL_CIRCLE_SCOPES_ORDER2.map((s) => affinity.scopedAffinities[s] ?? 0)
    );
    const load = maxScoped / 100;
    const topScope = topExcessScope(affinity);
    const topExcess = topScope ? affinity.excessAffinities[topScope] ?? 0 : 0;
    const topScoped = topScope ? affinity.scopedAffinities[topScope] ?? 0 : 0;
    const baseGate = topExcess >= ADR007_EXCESS_THRESHOLD && topScoped >= ADR007_SCOPED_THRESHOLD && affinity.universalAffinity <= ADR007_UNIVERSAL_CEILING && intensity03 >= ADR007_INTENSITY03_THRESHOLD;
    const passedLatent = baseGate;
    const passedActive = baseGate && engagementActive;
    const passedDominant = baseGate && engagementDominant && intensity03 >= ADR007_INTENSITY03_DOMINANT;
    const gate = {
      intensity: intensity03,
      load,
      engagementLevel: engagementLabel.level,
      passedLatent,
      passedActive,
      passedDominant
    };
    if (!passedLatent || !topScope) {
      return {
        state: "none",
        anchor: topScope ? scopeToLegacyAnchor(topScope) : void 0,
        scopedAnchor: topScope ?? void 0,
        reasonCodes: topScope ? ["gate_not_met"] : ["affinity_uniform_or_below_universal"],
        gate
      };
    }
    const stateLabel = passedDominant ? "dominant" : passedActive ? "active" : "latent";
    if (topScope === "ethnic_racial") {
      const race = typeof demographics?.demo_ethnicity === "string" ? demographics.demo_ethnicity : "";
      if (race === "black") {
        return {
          state: stateLabel,
          label: "Black Voter",
          confidence: passedActive ? "high" : "medium",
          anchor: scopeToLegacyAnchor(topScope),
          scopedAnchor: topScope,
          reasonCodes: ["ethnic_racial_scope_excess", "black_demographic_match"],
          gate
        };
      }
      if (race === "white") {
        const zs = expectedContinuous(state, "ZS");
        const cd = expectedContinuous(state, "CD");
        const onts = expectedContinuous(state, "ONT_S");
        const grievanceSignals = Number(zs >= 3.5) + Number(cd >= 3.5) + Number(onts <= 2.5);
        if (grievanceSignals >= 2) {
          return {
            state: stateLabel,
            label: "White Grievance Voter",
            confidence: grievanceSignals === 3 ? "high" : "medium",
            anchor: scopeToLegacyAnchor(topScope),
            scopedAnchor: topScope,
            reasonCodes: ["ethnic_racial_scope_excess", "white_demographic_match", "status_threat_pattern"],
            gate
          };
        }
        return {
          state: "unresolved",
          confidence: "low",
          anchor: scopeToLegacyAnchor(topScope),
          scopedAnchor: topScope,
          reasonCodes: ["ethnic_racial_scope_excess", "white_demographic_match", "insufficient_grievance_signal"],
          gate
        };
      }
      return {
        state: "unresolved",
        confidence: "low",
        anchor: scopeToLegacyAnchor(topScope),
        scopedAnchor: topScope,
        reasonCodes: ["ethnic_racial_scope_excess", "missing_or_nonresolving_race_demographic"],
        gate
      };
    }
    if (topScope === "religious") {
      const religion = typeof demographics?.demo_religion === "string" ? demographics.demo_religion : "";
      if (religion === "christian") {
        return {
          state: stateLabel,
          label: "Evangelical Voter",
          confidence: passedActive ? "medium" : "low",
          anchor: scopeToLegacyAnchor(topScope),
          scopedAnchor: topScope,
          reasonCodes: ["religious_scope_excess", "christian_demographic_match"],
          gate
        };
      }
      return {
        state: "unresolved",
        confidence: "low",
        anchor: scopeToLegacyAnchor(topScope),
        scopedAnchor: topScope,
        reasonCodes: ["religious_scope_excess", "missing_or_non_evangelical_religion_detail"],
        gate
      };
    }
    if (topScope === "gender") {
      const lgbtq = typeof demographics?.demo_lgbtq === "string" ? demographics.demo_lgbtq : "";
      if (lgbtq === "yes") {
        return {
          state: stateLabel,
          label: "LGBTQ Voter",
          confidence: passedActive ? "high" : "medium",
          anchor: scopeToLegacyAnchor(topScope),
          scopedAnchor: topScope,
          reasonCodes: ["gender_scope_excess", "lgbtq_demographic_match"],
          gate
        };
      }
      const gender = typeof demographics?.demo_gender === "string" ? demographics.demo_gender : "";
      const cd = expectedContinuous(state, "CD");
      const onts = expectedContinuous(state, "ONT_S");
      const zs = expectedContinuous(state, "ZS");
      if (gender === "female") {
        const feministSignals = Number(cd <= 2.5) + Number(affinity.universalAffinity >= 60) + Number(onts >= 3.5);
        if (feministSignals >= 2) {
          return {
            state: stateLabel,
            label: "Feminist Voter",
            confidence: feministSignals === 3 ? "high" : "medium",
            anchor: scopeToLegacyAnchor(topScope),
            scopedAnchor: topScope,
            reasonCodes: ["gender_scope_excess", "female_demographic_match", "progressive_gender_pattern"],
            gate
          };
        }
        return {
          state: "unresolved",
          confidence: "low",
          anchor: scopeToLegacyAnchor(topScope),
          scopedAnchor: topScope,
          reasonCodes: ["gender_scope_excess", "female_demographic_match", "insufficient_feminist_signal"],
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
            anchor: scopeToLegacyAnchor(topScope),
            scopedAnchor: topScope,
            reasonCodes: ["gender_scope_excess", "male_demographic_match", "status_threat_pattern"],
            gate
          };
        }
        return {
          state: "unresolved",
          confidence: "low",
          anchor: scopeToLegacyAnchor(topScope),
          scopedAnchor: topScope,
          reasonCodes: ["gender_scope_excess", "male_demographic_match", "insufficient_grievance_signal"],
          gate
        };
      }
      return {
        state: "unresolved",
        confidence: "low",
        anchor: scopeToLegacyAnchor(topScope),
        scopedAnchor: topScope,
        reasonCodes: ["gender_scope_excess", "missing_or_nonresolving_gender_demographic"],
        gate
      };
    }
    return {
      state: "unresolved",
      confidence: "low",
      anchor: scopeToLegacyAnchor(topScope),
      scopedAnchor: topScope,
      reasonCodes: ["scope_excess_detected_no_idp_overlay_defined"],
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
  function expectedSalience2(dist) {
    let e = 0;
    for (let i = 0; i < 4; i++) e += (dist[i] ?? 0) * i;
    return e;
  }
  function respondentSignatureFromState(state) {
    const sig = {};
    for (const [nodeId, node] of Object.entries(state.continuous)) {
      const pos = expectedContinuousPos(node.posDist);
      const sal = isSelfNode(nodeId) ? (pos - 1) / 4 * 3 : expectedSalience2(node.salDist);
      sig[nodeId] = { pos, sal };
    }
    for (const [nodeId, node] of Object.entries(state.categorical)) {
      sig[nodeId] = {
        pos: expectedCategoricalIndex(node.catDist),
        sal: expectedSalience2(node.salDist),
        catDist: [...node.catDist]
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
        AES: 0,
        // Statesman - Cincinnatus,
        morBoundaries: { boundaries: { national: 0.05, ethnic_racial: 0.05, religious: 0.05, class: 0.05, ideological: 0.05, gender: 0.05, political_tribe: 0 }, intensity: 2 }
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
        AES: 0,
        morBoundaries: { boundaries: { national: 0.05, ethnic_racial: 0.05, religious: 0.05, class: 0.05, ideological: 0.05, gender: 0.05, political_tribe: 0 }, intensity: 1.5 }
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
        AES: 0,
        // Statesman - gravitas, learning,
        morBoundaries: { boundaries: { national: 0.36, ethnic_racial: 0.05, religious: 0.19, class: 0.05, ideological: 0.24, gender: 0.07, political_tribe: 0.75 }, intensity: 2.25 }
      },
      {
        name: "Jefferson",
        party: "Democratic-Republican",
        year: 1796,
        // Recalibrated 2026-04-26: previous encoding (MAT=2, MOR=4, CU=4)
        // misrepresented Jefferson by reading him through modern progressive
        // optics. Historical reality: anti-federal-tax, anti-bank, agrarian-
        // property-protective slaveholder whose universalism was for free white
        // men only. MAT 2→4 (anti-redistribution, market-favoring of agrarian
        // property), MOR 4→2 (slavery contradicts wide moral circle), CU 4→2
        // (assimilationist white-settler expansion, not pluralism).
        MAT: 4,
        // Anti-federal-tax, anti-Hamilton's bank, pro-agrarian-property
        CD: 2,
        // Enlightenment progressive (religious tolerance) for whites
        CU: 2,
        // Assimilationist on white-settler expansion (not universalist)
        MOR: 2,
        // Narrow circle: held 600+ slaves, Indian Removal sympathizer
        PRO: 2,
        // Anti-federal power - states' rights skeptic
        COM: 2,
        // Low compromise - partisan opposition
        ZS: 3,
        // Mixed
        ONT_H: 4,
        // Optimistic about Enlightenment-rational free white men
        ONT_S: 2,
        // Anti-Federalist - ideological institutional skeptic
        PF: 5,
        // Maximum D-R partisan
        TRB: 4,
        // Factional - planter/agrarian identity
        ENG: 4,
        // Engaged
        EPS: 0,
        // Empiricist
        AES: 5,
        // Visionary,
        morBoundaries: { boundaries: { national: 0.66, ethnic_racial: 0.05, religious: 0.19, class: 0.05, ideological: 0.34, gender: 0.09, political_tribe: 1 }, intensity: 3 }
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
        // Recalibrated 2026-04-26: previous encoding read MAT=1 (maximum
        // redistributive) for an anti-Hamilton position that was actually
        // anti-federal-taxation and pro-agrarian-property. CU=5 and MOR=5
        // ignored that Jefferson's "rights of man" was rhetorical universalism
        // while he held hundreds of enslaved people. MAT 1→4, CU 5→2, MOR 5→2.
        MAT: 4,
        // Anti-Hamilton ≠ pro-redistribution; pro-agrarian-property
        CD: 1,
        // Religious tolerance / Enlightenment-progressive (for whites)
        CU: 2,
        // Assimilationist white-settler expansion (Louisiana Purchase)
        MOR: 2,
        // Slaveholder; rhetorical universalism, narrow practiced scope
        PRO: 2,
        // Anti-proceduralist - opposed Alien & Sedition Acts
        COM: 2,
        // Low compromise - revolutionary rhetoric
        ZS: 2,
        // Positive-sum yeoman vision
        ONT_H: 5,
        // Maximum optimistic about Enlightenment-rational free whites
        ONT_S: 2,
        // Anti-Federalist institutional skeptic
        PF: 5,
        // Maximum partisan - built party machine
        TRB: 4,
        // High tribal - yeoman farmer vs. merchant class
        ENG: 5,
        // Maximum engagement
        EPS: 0,
        // Empiricist
        AES: 5,
        // Visionary,
        morBoundaries: { boundaries: { national: 0.66, ethnic_racial: 0.05, religious: 0.19, class: 0.05, ideological: 0.34, gender: 0.09, political_tribe: 1 }, intensity: 3 }
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
        // MOR 1→2 (Phase 6, 2026-04-27). Federalist elite-favoring is narrow
        // practiced scope but not klan-tier in-group-only. MOR 1 reserved for
        // explicit dehumanization / ethnic cleansing per rubric anchors.
        MOR: 2,
        // Narrow practiced scope - elite governance, not klan-tier
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
        AES: 0,
        // Statesman,
        morBoundaries: { boundaries: { national: 0.76, ethnic_racial: 0.62, religious: 0.41, class: 0.05, ideological: 0.44, gender: 0.09, political_tribe: 1 }, intensity: 3 }
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
        // Recalibrated 2026-04-26: previous encoding (MAT=2, MOR=4, CU=4,
        // ONT_S=4) created a major calibration anomaly — Jefferson 1804 base
        // distance to a modern progressive (0.495) was lower than FDR's (0.613),
        // matching slave-owning anti-federal Jefferson closer than New Deal
        // architect FDR. MAT 2→4, MOR 4→2, CU 4→2, ONT_S 4→2 corrects this.
        // ONT_S 1804 spike to 4 conflated his presidential actions (Louisiana
        // Purchase required executive action) with his ideology (states-rights
        // anti-Federalist). His core belief remained anti-strong-government.
        MAT: 4,
        CD: 2,
        CU: 2,
        MOR: 2,
        PRO: 3,
        COM: 3,
        ZS: 2,
        ONT_H: 4,
        ONT_S: 2,
        PF: 4,
        TRB: 3,
        ENG: 5,
        EPS: 0,
        AES: 5,
        morBoundaries: { boundaries: { national: 0.45, ethnic_racial: 0.05, religious: 0.15, class: 0.05, ideological: 0.24, gender: 0.07, political_tribe: 0.75 }, intensity: 2.25 }
      },
      {
        // Pinckney 1804 MOR 1→2 (Phase 6, 2026-04-27). Federalist elite-favoring
        // is narrow practiced scope but not klan-tier; rubric reserves MOR 1.
        name: "Pinckney",
        party: "Federalist",
        year: 1804,
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
        AES: 0,
        morBoundaries: { boundaries: { national: 0.76, ethnic_racial: 0.62, religious: 0.41, class: 0.05, ideological: 0.44, gender: 0.09, political_tribe: 0.75 }, intensity: 2.25 }
      }
    ]
  };
  var election1808 = {
    year: 1808,
    candidates: [
      {
        // Madison 1808 Pattern B + Jeffersonian-agrarian recalibration (2026-04-26
        // Phase 4). Madison held ~100 enslaved people; the prior MOR 4 / CU 4
        // overread his rhetorical universalism for practiced moral scope. MAT 2→4
        // (Jeffersonian agrarian-property, anti-Hamilton, not redistributive),
        // CU 4→2 (assimilationist white-settler), MOR 4→2 (slaveholder).
        name: "Madison",
        party: "Democratic-Republican",
        year: 1808,
        MAT: 4,
        // Anti-Hamilton agrarian-property (per Jeffersonian-agrarian rubric)
        CD: 2,
        // Culturally open
        CU: 2,
        // Assimilationist white-settler expansion (Pattern B)
        MOR: 2,
        // Slaveholder - narrow practiced scope, not rhetorical universalism (Pattern B)
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
        AES: 1,
        // Technocrat - policy wonk of his era,
        morBoundaries: { boundaries: { national: 0.25, ethnic_racial: 0.05, religious: 0.1, class: 0.05, ideological: 0.15, gender: 0.06, political_tribe: 0.75 }, intensity: 2.25 }
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
        AES: 0,
        morBoundaries: { boundaries: { national: 0.76, ethnic_racial: 0.62, religious: 0.41, class: 0.05, ideological: 0.44, gender: 0.09, political_tribe: 0.75 }, intensity: 2.25 }
      }
    ]
  };
  var election1812 = {
    year: 1812,
    candidates: [
      {
        // Madison 1812 — same Pattern B as 1808 (slaveholder; rhetorical
        // universalism overread). MAT 2→4, CU 4→2, MOR 4→2. Plus Madison-drift
        // caveat applied: as wartime president (War of 1812) using federal +
        // military institutions hard, ONT_S drifts up from 3→4.
        name: "Madison",
        party: "Democratic-Republican",
        year: 1812,
        MAT: 4,
        CD: 2,
        CU: 2,
        MOR: 2,
        PRO: 4,
        COM: 3,
        ZS: 3,
        ONT_H: 3,
        ONT_S: 4,
        PF: 4,
        TRB: 3,
        ENG: 5,
        EPS: 0,
        AES: 0,
        morBoundaries: { boundaries: { national: 0.45, ethnic_racial: 0.05, religious: 0.15, class: 0.05, ideological: 0.24, gender: 0.07, political_tribe: 0.75 }, intensity: 2.25 }
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
        AES: 1,
        morBoundaries: { boundaries: { national: 0.53, ethnic_racial: 0.12, religious: 0.29, class: 0.05, ideological: 0.1, gender: 0.07, political_tribe: 0.5 }, intensity: 1.5 }
      }
    ]
  };
  var election1816 = {
    year: 1816,
    candidates: [
      {
        // Monroe 1816 — same Pattern B as Madison. Held ~250 enslaved people.
        // MAT 2→4 (Jeffersonian agrarian-property), CU 4→2 (assimilationist),
        // MOR 4→2 (slaveholder; rhetorical-universalism overread). ONT_S 5
        // already correct by Madison/Monroe-drift caveat (Monroe Doctrine,
        // internal improvements via federal institutions).
        name: "Monroe",
        party: "Democratic-Republican",
        year: 1816,
        MAT: 4,
        CD: 2,
        CU: 2,
        MOR: 2,
        PRO: 4,
        COM: 5,
        ZS: 1,
        ONT_H: 5,
        ONT_S: 5,
        PF: 3,
        TRB: 2,
        ENG: 4,
        EPS: 1,
        AES: 0,
        morBoundaries: { boundaries: { national: 0.19, ethnic_racial: 0.05, religious: 0.1, class: 0.05, ideological: 0.07, gender: 0.06, political_tribe: 0.5 }, intensity: 1.5 }
      },
      {
        // King 1816 MOR 1→2 (Phase 6, 2026-04-27). Final Federalist nominee;
        // elite-favoring is narrow practiced scope but not klan-tier.
        name: "King",
        party: "Federalist",
        year: 1816,
        MAT: 5,
        CD: 5,
        CU: 1,
        MOR: 2,
        PRO: 5,
        COM: 3,
        ZS: 4,
        ONT_H: 2,
        ONT_S: 4,
        PF: 4,
        TRB: 4,
        ENG: 3,
        EPS: 1,
        AES: 0,
        morBoundaries: { boundaries: { national: 0.76, ethnic_racial: 0.62, religious: 0.41, class: 0.05, ideological: 0.44, gender: 0.09, political_tribe: 0.75 }, intensity: 2.25 }
      }
    ]
  };
  var election1820 = {
    year: 1820,
    candidates: [
      {
        // Monroe 1820 — same Pattern B. Even Era of Good Feelings Monroe was a
        // slaveholder. MAT 3→4 (Jeffersonian agrarian), CU 4→2 (assimilationist),
        // MOR 4→2. ENG 3 retained — defensible for unopposed reluctant-style
        // election.
        name: "Monroe",
        party: "Democratic-Republican",
        year: 1820,
        MAT: 4,
        CD: 3,
        CU: 2,
        MOR: 2,
        PRO: 4,
        COM: 5,
        ZS: 1,
        ONT_H: 5,
        ONT_S: 5,
        PF: 2,
        TRB: 1,
        ENG: 3,
        EPS: 1,
        AES: 0,
        morBoundaries: { boundaries: { national: 0.05, ethnic_racial: 0.05, religious: 0.05, class: 0.05, ideological: 0.05, gender: 0.05, political_tribe: 0.25 }, intensity: 1 }
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
        MAT: 4,
        // Developmentalist - tariffs/internal improvements, not laissez-faire maximalism
        CD: 3,
        // Moderate-conservative elite - Puritan gravitas without culture-war closure
        CU: 3,
        // National-development project; neither mosaic pluralist nor closed nativist
        MOR: 4,
        // Broad civic-national moral language, especially in later anti-slavery career
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
        AES: 1,
        // Technocrat,
        morBoundaries: { boundaries: { national: 0.09, ethnic_racial: 0.05, religious: 0.05, class: 0.05, ideological: 0.15, gender: 0.06, political_tribe: 0.75 }, intensity: 2.25 }
      },
      {
        name: "Jackson",
        party: "Democratic-Republican",
        year: 1824,
        MAT: 4,
        // Anti-bank populist, but not modern redistributionist; hard-money/agrarian
        CD: 4,
        // Traditional frontier values - expansion, slavery-tolerant, anti-establishment
        CU: 1,
        // Particularist - Jacksonian democracy was white-male-centric, Indian Removal
        MOR: 1,
        // Very narrow moral circle - "common (white) man," Native removal, slavery tolerance
        PRO: 2,
        // Anti-procedural - military hero, direct action
        COM: 1,
        // Maximum uncompromising - "corrupt bargain" rhetoric, vendetta politics
        ZS: 4,
        // Zero-sum "enemies of the people" populist framing
        ONT_H: 2,
        // Pessimistic about elite motives, rigged institutions
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
        AES: 4,
        // Fighter - Old Hickory,
        morBoundaries: { boundaries: { national: 0.76, ethnic_racial: 0.58, religious: 0.41, class: 0.05, ideological: 0.26, gender: 0.09, political_tribe: 0.5 }, intensity: 2.25 }
      },
      {
        name: "Crawford",
        party: "Democratic-Republican",
        year: 1824,
        // Recoded 2026-04-23: previous all-1s-and-5s coding (avg dist 2.291) was
        // over-extreme for a conventional Jeffersonian Democratic-Republican.
        MAT: 4,
        CD: 4,
        CU: 2,
        MOR: 2,
        PRO: 4,
        COM: 3,
        ZS: 3,
        ONT_H: 2,
        ONT_S: 4,
        PF: 4,
        TRB: 3,
        ENG: 3,
        EPS: 1,
        AES: 0,
        morBoundaries: { boundaries: { national: 0.53, ethnic_racial: 0.12, religious: 0.29, class: 0.05, ideological: 0.24, gender: 0.07, political_tribe: 0.75 }, intensity: 2.25 }
      },
      {
        name: "Clay",
        party: "Democratic-Republican",
        year: 1824,
        MAT: 4,
        // American System - tariffs and internal improvements, not pure free-market
        CD: 3,
        // Establishment conservative but not maximum cultural closure
        CU: 3,
        // National-development civic project
        MOR: 3,
        // Centrist moral frame; compromise politics, not universalist crusade
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
        AES: 0,
        // Statesman,
        morBoundaries: { boundaries: { national: 0.11, ethnic_racial: 0.05, religious: 0.05, class: 0.05, ideological: 0.15, gender: 0.06, political_tribe: 0.75 }, intensity: 2.25 }
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
        // Recoded 2026-04-23: previous coding (CD=3, CU=3, MOR=3, ZS=3, ONT_H=3)
        // placed Jackson near the archetype centroid, making him universally
        // "close" to all archetypes. Jacksonian populism was sharply particularist
        // and zero-sum; recoded to match the actual platform.
        MAT: 4,
        CD: 4,
        CU: 1,
        MOR: 1,
        PRO: 2,
        COM: 1,
        ZS: 4,
        ONT_H: 2,
        ONT_S: 2,
        PF: 4,
        TRB: 4,
        ENG: 5,
        EPS: 3,
        AES: 4,
        morBoundaries: { boundaries: { national: 0.76, ethnic_racial: 0.58, religious: 0.41, class: 0.05, ideological: 0.48, gender: 0.09, political_tribe: 0.75 }, intensity: 2.25 }
      },
      {
        name: "Adams",
        party: "National Republican",
        year: 1828,
        MAT: 4,
        CD: 3,
        CU: 3,
        MOR: 4,
        PRO: 5,
        COM: 3,
        ZS: 3,
        ONT_H: 2,
        ONT_S: 5,
        PF: 4,
        TRB: 2,
        ENG: 3,
        EPS: 1,
        AES: 1,
        morBoundaries: { boundaries: { national: 0.09, ethnic_racial: 0.05, religious: 0.05, class: 0.05, ideological: 0.15, gender: 0.06, political_tribe: 0.75 }, intensity: 2.25 }
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
        MAT: 4,
        // Bank War anti-elite populism, but not modern redistributionism
        // Recoded 2026-04-23 — see Jackson 1828 note. Sharper particularism +
        // zero-sum framing for Bank War re-election.
        CD: 4,
        CU: 1,
        MOR: 1,
        PRO: 2,
        COM: 1,
        ZS: 4,
        ONT_H: 2,
        ONT_S: 2,
        PF: 4,
        TRB: 4,
        ENG: 5,
        EPS: 3,
        AES: 4,
        morBoundaries: { boundaries: { national: 0.76, ethnic_racial: 0.58, religious: 0.41, class: 0.05, ideological: 0.48, gender: 0.09, political_tribe: 0.75 }, intensity: 2.25 }
      },
      {
        name: "Clay",
        party: "National Republican",
        year: 1832,
        // ADR-010 (2026-04-26): ONT_H 2 → 4. Clay was an arch-Hamiltonian
        // institutionalist who believed genteel education, law, and institutions
        // CULTIVATE human character. Under malleability framing he is high
        // ONT_H, not low. Old "pessimistic about humans" reading inverted his
        // actual Burkean-cultivation worldview.
        MAT: 4,
        CD: 3,
        CU: 3,
        MOR: 3,
        PRO: 5,
        COM: 5,
        ZS: 2,
        ONT_H: 4,
        ONT_S: 5,
        PF: 5,
        TRB: 2,
        ENG: 5,
        EPS: 1,
        AES: 0,
        morBoundaries: { boundaries: { national: 0.11, ethnic_racial: 0.05, religious: 0.05, class: 0.05, ideological: 0.15, gender: 0.06, political_tribe: 1 }, intensity: 3 }
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
        AES: 0,
        // Statesman - former Attorney General,
        morBoundaries: { boundaries: { national: 0.34, ethnic_racial: 0.05, religious: 0.29, class: 0.05, ideological: 0.1, gender: 0.07, political_tribe: 0 }, intensity: 1.5 }
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
        // Recoded 2026-04-23: previous coding had VB at near-centroid (avg dist
        // 1.44, lowest of any candidate in the bank). Sharpened the coalitional
        // axes to reflect Jacksonian Democratic coalition, not "moderate on
        // everything."
        MAT: 2,
        // Redistributive — labor friendly, Jacksonian heir
        CD: 3,
        // Moderate
        CU: 2,
        // Assimilationist — Democratic coalition was particularist
        MOR: 2,
        // Narrow moral circle — coalition didn't emphasize universal rights
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
        PF: 5,
        // Maximum partisan — literally built the Democratic Party
        TRB: 4,
        // Strong Northern Democratic partisan identity
        ENG: 5,
        // Maximum
        EPS: 1,
        // Institutionalist - party builder
        AES: 1,
        // Technocrat - operator/fixer,
        morBoundaries: { boundaries: { national: 0.66, ethnic_racial: 0.05, religious: 0.19, class: 0.41, ideological: 0.34, gender: 0.09, political_tribe: 1 }, intensity: 3 }
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
        AES: 3,
        morBoundaries: { boundaries: { national: 0.29, ethnic_racial: 0.29, religious: 0.26, class: 0.05, ideological: 0.11, gender: 0.09, political_tribe: 0.25 }, intensity: 1 }
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
        AES: 3,
        // Authentic - "log cabin" common man image,
        morBoundaries: { boundaries: { national: 0.76, ethnic_racial: 0.16, religious: 0.41, class: 0.05, ideological: 0.34, gender: 0.09, political_tribe: 0.75 }, intensity: 2.25 }
      },
      {
        name: "Van Buren",
        party: "Democratic",
        year: 1840,
        // Recoded 2026-04-23: previous coding was deeply miscalibrated —
        // every axis pushed to extremes with comments like "blamed for depression"
        // (a non-ideological factor, not a position change). Reset to match his
        // 1836 profile with minor adjustments reflecting recession-era pressure.
        MAT: 2,
        // Same Jacksonian heir position — sub-treasury hard-money
        CD: 3,
        // Moderate — unchanged from 1836
        CU: 2,
        // Assimilationist — same Democratic coalition
        MOR: 2,
        // Narrow moral circle — unchanged
        PRO: 3,
        // Mixed
        COM: 3,
        // Less compromising under recession pressure, defending sub-treasury
        ZS: 3,
        // Mixed
        ONT_H: 2,
        // Pessimistic under Panic of 1837 pressure
        ONT_S: 3,
        // Defending the system (incumbent)
        PF: 5,
        TRB: 4,
        ENG: 5,
        EPS: 1,
        AES: 1,
        morBoundaries: { boundaries: { national: 0.66, ethnic_racial: 0.05, religious: 0.19, class: 0.41, ideological: 0.34, gender: 0.09, political_tribe: 1 }, intensity: 3 }
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
        // Recoded 2026-04-23: previous coding placed Polk at avg dist 1.445
        // (near-centroid). Dark-horse Southern expansionist — sharper on MAT
        // (anti-tariff populist), MOR (particularist expansion), TRB.
        MAT: 2,
        // Anti-tariff Jacksonian, Walker Tariff — mild redistributionist
        CD: 3,
        // Moderate
        CU: 2,
        // Particularist expansionism — Manifest Destiny
        MOR: 2,
        // Narrow moral circle — expansion at Mexican/Native expense
        PRO: 3,
        // Mixed
        COM: 3,
        // Mixed - pragmatic
        ZS: 3,
        // Zero-sum territorial expansion vs Mexico
        ONT_H: 3,
        // Moderate
        ONT_S: 2,
        // Expansion mandate to reshape the map
        PF: 4,
        // Strong Democrat
        TRB: 4,
        // Southern Democratic partisan
        ENG: 5,
        // Maximum - energized dark horse
        EPS: 3,
        // Intuitionist
        AES: 4,
        // Fighter - aggressive expansionist,
        morBoundaries: { boundaries: { national: 0.66, ethnic_racial: 0.05, religious: 0.19, class: 0.41, ideological: 0.34, gender: 0.09, political_tribe: 0.75 }, intensity: 2.25 }
      },
      {
        name: "Clay",
        party: "Whig",
        year: 1844,
        // Recoded 2026-04-23: previous coding was all 1s and 5s (avg dist 2.462).
        // Clay was a mainstream Whig leader, not maximally extreme. Softened.
        MAT: 4,
        CD: 4,
        CU: 2,
        MOR: 2,
        PRO: 4,
        COM: 4,
        ZS: 2,
        ONT_H: 3,
        ONT_S: 4,
        PF: 4,
        TRB: 2,
        ENG: 5,
        EPS: 1,
        AES: 0,
        morBoundaries: { boundaries: { national: 0.29, ethnic_racial: 0.09, religious: 0.17, class: 0.05, ideological: 0.15, gender: 0.06, political_tribe: 0.75 }, intensity: 2.25 }
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
        AES: 0,
        // Statesman - war hero,
        morBoundaries: { boundaries: { national: 0.53, ethnic_racial: 0.12, religious: 0.29, class: 0.05, ideological: 0.1, gender: 0.07, political_tribe: 0 }, intensity: 1.5 }
      },
      {
        // Cass full-row recalibration (Phase 1 of audit, 2026-04-26).
        // Prior encoding read him as max-redistributive max-universalist anti-institutional;
        // that's wrong on every count. Cass was a Jacksonian institutionalist (Pattern A
        // correction: PRO 1→4, ONT_S 2→3) whose "popular sovereignty" doctrine was a
        // slavery-accommodating compromise, not a universalist moral stance (Pattern B
        // correction: CU 5→2, MOR 5→2). MAT 1→3 (hard-money Jacksonian, not redistributive),
        // CD 1→4 (anti-abolition, culturally traditional), COM 2→4 (popular sovereignty WAS
        // the compromise position).
        name: "Cass",
        party: "Democratic",
        year: 1848,
        MAT: 3,
        CD: 4,
        CU: 2,
        MOR: 2,
        PRO: 4,
        COM: 4,
        ZS: 3,
        ONT_H: 3,
        ONT_S: 3,
        PF: 5,
        TRB: 5,
        ENG: 4,
        EPS: 1,
        AES: 0,
        morBoundaries: { boundaries: { national: 1, ethnic_racial: 0.19, religious: 0.53, class: 0.05, ideological: 0.43, gender: 0.1, political_tribe: 1 }, intensity: 3 }
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
        AES: 5,
        // Visionary - moral crusade,
        morBoundaries: { boundaries: { national: 0.05, ethnic_racial: 0.05, religious: 0.05, class: 0.34, ideological: 0.26, gender: 0.07, political_tribe: 0 }, intensity: 2 }
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
        AES: 3,
        // Authentic - "handsome Frank," young, vigorous,
        morBoundaries: { boundaries: { national: 0.76, ethnic_racial: 0.58, religious: 0.41, class: 0.41, ideological: 0.34, gender: 0.09, political_tribe: 1 }, intensity: 3 }
      },
      {
        // Scott 1852 MOR 1→2 (Phase 6, 2026-04-27). Whig elite/Northern-establishment
        // candidate; narrow practiced scope but not klan-tier per rubric.
        name: "Scott",
        party: "Whig",
        year: 1852,
        MAT: 5,
        CD: 5,
        CU: 1,
        MOR: 2,
        PRO: 5,
        COM: 5,
        ZS: 2,
        ONT_H: 1,
        ONT_S: 5,
        PF: 2,
        TRB: 1,
        ENG: 2,
        EPS: 1,
        AES: 0,
        morBoundaries: { boundaries: { national: 0.05, ethnic_racial: 0.05, religious: 0.05, class: 0.05, ideological: 0.05, gender: 0.05, political_tribe: 0.25 }, intensity: 0.75 }
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
        MOR: 1,
        // Narrow moral circle - pro-slavery accommodation, Dred Scott compliance
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
        AES: 0,
        // Statesman - elder diplomat, gravitas, experienced hand,
        morBoundaries: { boundaries: { national: 0.76, ethnic_racial: 0.37, religious: 0.41, class: 0.05, ideological: 0.34, gender: 0.09, political_tribe: 1 }, intensity: 3 }
      },
      {
        name: "Fremont",
        party: "Republican",
        year: 1856,
        MAT: 3,
        // Free-labor reformer; anti-planter, not modern redistributionist
        CD: 2,
        // Culturally open for the era, not a modern endpoint
        CU: 4,
        // Universalist free-soil appeal, short of full pluralist maximum
        MOR: 4,
        // Anti-slavery-expansion moral politics, not full abolitionist maximalism
        PRO: 3,
        // New-party challenger but still constitutional/electoral
        COM: 2,
        // Low compromise on slave-power expansion, not total absolutism
        ZS: 2,
        // Positive-sum
        ONT_H: 4,
        // Optimistic - free labor promise
        ONT_S: 2,
        // System corrupted by slave power, reformable through new party
        PF: 4,
        // Strong partisan - first Republican nominee
        TRB: 4,
        // Strong northern free-state identity
        ENG: 5,
        // Maximum engagement
        EPS: 3,
        // Intuitionist
        AES: 5,
        // Visionary,
        morBoundaries: { boundaries: { national: 0.16, ethnic_racial: 0.05, religious: 0.05, class: 0.05, ideological: 0.34, gender: 0.09, political_tribe: 0.75 }, intensity: 2.25 }
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
        AES: 0,
        // Statesman - ex-president, tried to project elder authority,
        morBoundaries: { boundaries: { national: 1, ethnic_racial: 1, religious: 0.91, class: 0.05, ideological: 0.15, gender: 0.19, political_tribe: 0.25 }, intensity: 3 }
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
        // Free-labor developmentalism; tariffs/railroads but not laissez-faire
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
        AES: 3,
        // Authentic - "Rail-Splitter," log cabin, self-made man,
        morBoundaries: { boundaries: { national: 0.85, ethnic_racial: 0.55, religious: 0.4, class: 0.2, ideological: 0.5, gender: 0.1, political_tribe: 0.5 }, intensity: 3 },
        morMembership: { ethnic_racial: "white", religious: "Protestant", class: "working", gender: "male", political_tribe: "R" }
      },
      {
        name: "Douglas",
        party: "Democratic",
        year: 1860,
        MAT: 3,
        // Centrist - popular sovereignty, let markets and voters decide
        CD: 3,
        // Culturally moderate - tried to straddle slavery issue, not moralist
        CU: 2,
        // Local-choice particularism; territories decide rather than universal rights
        MOR: 2,
        // Narrow-to-mixed - refused to call slavery morally wrong, "I don't care" stance
        PRO: 4,
        // Proceduralist - popular sovereignty IS proceduralism, let the process decide
        COM: 5,
        // Maximum compromiser - career built on compromise, "Little Giant" dealmaker
        ZS: 3,
        // Mixed - believed compromise avoided conflict
        ONT_H: 3,
        // Moderate - pragmatic, not idealistic
        ONT_S: 3,
        // Mixed - popular sovereignty as a patch for a visibly failing order
        PF: 5,
        // Maximum partisan - Democratic Party man, fought for party unity
        TRB: 3,
        // Moderate tribal - tried to be national, not sectional
        ENG: 5,
        // Maximum engagement - campaigned nationally even when cause was lost
        EPS: 1,
        // Institutionalist - trusted democratic process, popular sovereignty
        AES: 4,
        // Fighter - "Little Giant," combative debater, tireless campaigner,
        morBoundaries: { boundaries: { national: 0.45, ethnic_racial: 0.05, religious: 0.15, class: 0.05, ideological: 0.24, gender: 0.07, political_tribe: 1 }, intensity: 3 }
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
        AES: 0,
        // Statesman - Vice President, senior Southern dignitary,
        morBoundaries: { boundaries: { national: 1, ethnic_racial: 1, religious: 0.91, class: 0.05, ideological: 0.34, gender: 0.19, political_tribe: 0.5 }, intensity: 3 }
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
        AES: 0,
        // Statesman - elder Whig, dignified, above-the-fray,
        morBoundaries: { boundaries: { national: 0.29, ethnic_racial: 0.09, religious: 0.17, class: 0.05, ideological: 0.07, gender: 0.06, political_tribe: 0 }, intensity: 0.75 }
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
        MAT: 4,
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
        // ONT_S 2→4 (Phase 4, 2026-04-26). Wartime Lincoln was the paradigmatic
        // institution-USING reformer — his entire war effort was institution-
        // preserving, and his reforms (13th Amendment, habeas suspension,
        // emergency war powers) were institutions used hard to save the Union,
        // not signals that institutions can never work. ONT_S 4 (institutional
        // reformer using institutions hard, per rubric) replaces ONT_S 2.
        ONT_S: 4,
        // Institutional reformer - 13th Amendment via constitutional process, used federal power hard to preserve Union
        PF: 4,
        // Strong Republican - ran as "National Union" to broaden coalition
        TRB: 3,
        // Moderate tribal - national unity rhetoric, "Union" above faction
        ENG: 5,
        // Maximum engagement - wartime president, existential stakes
        EPS: 0,
        // Empiricist - lawyer, logical, adapted strategy to evidence
        AES: 5,
        // Visionary - Gettysburg Address, "new birth of freedom," transformative,
        morBoundaries: { boundaries: { national: 0.9, ethnic_racial: 0.6, religious: 0.4, class: 0.2, ideological: 0.55, gender: 0.1, political_tribe: 0.55 }, intensity: 3 },
        morMembership: { ethnic_racial: "white", religious: "Protestant", class: "working", gender: "male", political_tribe: "R" }
      },
      {
        // McClellan 1864 platform-vs-persona correction (Phase 6, 2026-04-27).
        // Per rubric, "signal" = platform + rhetoric + persona + actions. The
        // prior coding read McClellan exclusively through the Copperhead party
        // platform, but McClellan publicly REPUDIATED the peace plank, ran as
        // a War Democrat, and was a former Union general. His personal signal
        // was moderate-conservative Democrat, not max-extreme on every axis.
        // Softened: MAT 5→4 (not max free-market, conservative-moderate),
        // CD 5→4 (traditional Democrat, not maximum), MOR 1→2 (narrow practiced
        // scope, not klan-tier), PRO 5→4 (institutional general, not max-rules-
        // bound; he stretched the platform-vs-persona line). CU=1 retained
        // (party platform genuinely was states-rights peace).
        name: "McClellan",
        party: "Democratic",
        year: 1864,
        MAT: 4,
        // Conservative Democrat, not max-laissez-faire
        CD: 4,
        // Traditional Democrat opposing emancipation; not max-restorationist
        CU: 1,
        // Maximum assimilationist - states' rights peace platform
        MOR: 2,
        // Narrow practiced scope - Civil War Democrat, not klan-tier
        PRO: 4,
        // Institutional general - mostly procedural but war Democrat tension with platform
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
        AES: 0,
        // Statesman - "Young Napoleon," military prestige, gravitas,
        morBoundaries: { boundaries: { national: 0.76, ethnic_racial: 0.37, religious: 0.41, class: 0.05, ideological: 0.34, gender: 0.09, political_tribe: 0.75 }, intensity: 2.25 }
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
        MAT: 4,
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
        AES: 3,
        // Authentic - plain-spoken, simple, honest soldier,
        morBoundaries: { boundaries: { national: 0.12, ethnic_racial: 0.05, religious: 0.05, class: 0.05, ideological: 0.24, gender: 0.07, political_tribe: 0.75 }, intensity: 2.25 }
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
        AES: 0,
        // Statesman - governor, tried for dignified image,
        morBoundaries: { boundaries: { national: 1, ethnic_racial: 1, religious: 0.91, class: 0.05, ideological: 0.43, gender: 0.19, political_tribe: 0.75 }, intensity: 3 }
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
        MAT: 4,
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
        AES: 3,
        // Authentic - plain soldier, unpretentious, honest reputation (despite scandals),
        morBoundaries: { boundaries: { national: 0.12, ethnic_racial: 0.05, religious: 0.05, class: 0.05, ideological: 0.24, gender: 0.07, political_tribe: 1 }, intensity: 3 }
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
        AES: 5,
        // Visionary - utopian reformer, reconciliation crusade, eccentric idealist,
        morBoundaries: { boundaries: { national: 0.05, ethnic_racial: 0.05, religious: 0.05, class: 0.05, ideological: 0.07, gender: 0.06, political_tribe: 0 }, intensity: 2 }
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
        MAT: 4,
        // Push extreme — pro-business, gold standard, high tariff
        CD: 3,
        // Moderate Republican reform signal, not a culture-war conservative
        CU: 3,
        // Civic-national reformer, with Reconstruction commitment fading
        MOR: 4,
        // Campaign signal still leaned toward equal citizenship / reform Republicanism
        PRO: 5,
        // Maximum proceduralist
        COM: 5,
        // Compromiser
        ZS: 3,
        // Mixed
        ONT_H: 3,
        // Pessimistic — Reconstruction fatigue
        ONT_S: 4,
        // System mostly sound, needs honest reform rather than overhaul
        PF: 5,
        // Strong Republican machine
        TRB: 3,
        // Moderate Republican establishment identity
        ENG: 3,
        // Moderate — quiet campaign
        EPS: 0,
        // Empiricist - lawyer, evidence-based, reform-minded
        AES: 0,
        // Statesman - dignified governor, reformer, integrity,
        morBoundaries: { boundaries: { national: 0.12, ethnic_racial: 0.05, religious: 0.05, class: 0.05, ideological: 0.24, gender: 0.07, political_tribe: 1 }, intensity: 3 }
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
        AES: 1,
        // Technocrat - reform manager, prosecutorial efficiency,
        morBoundaries: { boundaries: { national: 0.76, ethnic_racial: 0.16, religious: 0.41, class: 0.05, ideological: 0.34, gender: 0.09, political_tribe: 0.75 }, intensity: 2.25 }
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
        AES: 0,
        // Statesman - classical orator, gravitas, self-made dignity,
        morBoundaries: { boundaries: { national: 0.17, ethnic_racial: 0.05, religious: 0.05, class: 0.05, ideological: 0.24, gender: 0.07, political_tribe: 0.75 }, intensity: 2.25 }
      },
      {
        // Hancock 1880 — "push extreme" loser-coding artifact corrected (Phase 4,
        // 2026-04-26). Per user direction, "push extreme" overrides candidate
        // signal and the rubric overrides "push extreme." Hancock was an
        // apolitical Democratic war hero who deliberately avoided issues; the
        // max-redistributive max-progressive max-universalist max-wide-MOR
        // coding was rubric-incompatible. MAT 1→4 (Democratic low-tariff but
        // not redistributive), CD 1→3 (apolitical, not progressive), CU 5→3
        // (not pluralist), MOR 5→3 (no wide-moral-circle stance taken).
        name: "Hancock",
        party: "Democratic",
        year: 1880,
        MAT: 4,
        // Democratic low-tariff/agrarian property, not redistributive
        CD: 3,
        // Apolitical war hero, no progressive cultural stance
        CU: 3,
        // No pluralist commitment - civic-Democratic centrist
        MOR: 3,
        // No wide-circle stance - civic-national, "the Superb" persona
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
        AES: 0,
        // Statesman - "Hancock the Superb," military prestige,
        morBoundaries: { boundaries: { national: 0.23, ethnic_racial: 0.05, religious: 0.05, class: 0.05, ideological: 0.34, gender: 0.09, political_tribe: 1 }, intensity: 3 }
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
        AES: 3,
        // Authentic - owned scandal, "tell the truth," plain-spoken integrity,
        morBoundaries: { boundaries: { national: 0.05, ethnic_racial: 0.05, religious: 0.05, class: 0.05, ideological: 0.07, gender: 0.06, political_tribe: 0.5 }, intensity: 1.5 }
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
        AES: 4,
        // Fighter - "Plumed Knight," combative, charismatic warrior,
        morBoundaries: { boundaries: { national: 0.23, ethnic_racial: 0.05, religious: 0.05, class: 0.05, ideological: 0.34, gender: 0.09, political_tribe: 1 }, intensity: 3 }
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
        AES: 0,
        // Statesman - dignified, reserved, presidential grandson,
        morBoundaries: { boundaries: { national: 0.31, ethnic_racial: 0.05, religious: 0.15, class: 0.05, ideological: 0.24, gender: 0.07, political_tribe: 1 }, intensity: 3 }
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
        AES: 1,
        // Technocrat - devoted State of Union to policy substance, wonkish,
        morBoundaries: { boundaries: { national: 0.11, ethnic_racial: 0.05, religious: 0.05, class: 0.05, ideological: 0.15, gender: 0.06, political_tribe: 0.75 }, intensity: 2.25 }
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
        AES: 0,
        // Statesman - dignified, serious, "public office is a public trust",
        morBoundaries: { boundaries: { national: 0.11, ethnic_racial: 0.05, religious: 0.05, class: 0.17, ideological: 0.15, gender: 0.06, political_tribe: 0.75 }, intensity: 2.25 }
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
        AES: 0,
        // Statesman - dignified, formal, presidential bearing (if cold),
        morBoundaries: { boundaries: { national: 0.53, ethnic_racial: 0.12, religious: 0.29, class: 0.05, ideological: 0.24, gender: 0.07, political_tribe: 1 }, intensity: 3 }
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
        // Weaver 1892 Pattern A correction (Phase 4, 2026-04-26). Populist Party
        // founder used the new-party institutional vehicle and pioneered direct-
        // democracy *procedures* (initiative, referendum, recall, direct
        // election of senators, railroad regulation). That is institutional
        // reform USING institutions hard, not anti-institutional nihilism.
        // PRO 2→4, ONT_S 1→4 per rubric Pattern A correction (parallels Bryan
        // and La Follette).
        PRO: 4,
        // Institutional reformer - new party, direct-democracy procedures
        COM: 1,
        // Never compromise - insurgent, rejected both parties as corrupt
        ZS: 4,
        // Zero-sum lean - banks and railroads robbing the farmers, class war framing
        ONT_H: 3,
        // Mixed - believed common people were good but elites were corrupt
        ONT_S: 4,
        // Institutional capacity belief - the system can be made to work for farmers via NEW procedures
        PF: 1,
        // Maximum independent - founded new party, rejected both old ones
        TRB: 5,
        // Maximum tribal - farmer/agrarian class identity, "the people" vs. "the plutocrats"
        ENG: 5,
        // Maximum engagement - launched third party, barnstormed the country
        EPS: 3,
        // Intuitionist - populist gut-level politics, "the people know"
        AES: 4,
        // Fighter - insurgent crusader, combative populist,
        morBoundaries: { boundaries: { national: 0.72, ethnic_racial: 0.05, religious: 0.53, class: 0.72, ideological: 0.34, gender: 0.1, political_tribe: 0 }, intensity: 3 }
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
        MAT: 4,
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
        AES: 0,
        // Statesman - dignified front-porch campaign, presidential calm,
        morBoundaries: { boundaries: { national: 0.11, ethnic_racial: 0.05, religious: 0.05, class: 0.05, ideological: 0.15, gender: 0.06, political_tribe: 0.75 }, intensity: 2.25 }
      },
      {
        name: "Bryan",
        party: "Democratic",
        year: 1896,
        // Bryan 1896 — PATTERN A FLAGSHIP CASE per rubric (Phase 4, 2026-04-26).
        // Prior PRO 2 / ONT_S 1 read him as anti-institutional, but Bryan used
        // party machinery hard, fused Democratic-Populist tickets, ran on
        // constitutional amendments (income tax, direct election of senators),
        // and pioneered modern barnstorming WITHIN institutional channels.
        // PRO 2→4, ONT_S 1→4. EPS 3→2 traditionalist per rubric (biblical
        // "Cross of Gold," providential democracy, agrarian inherited virtue —
        // not pure intuitionism). AES 5 visionary retained for 1896.
        MAT: 1,
        // Maximum redistribution - free silver = inflation = debt relief for farmers, anti-bank
        CD: 5,
        // Maximum cultural closure - evangelical Protestant, rural, anti-urban, anti-immigrant
        CU: 2,
        // Particularist - nativist, suspicious of foreign gold standard, agrarian nationalism
        MOR: 3,
        // Mixed - evangelical compassion for "the people" but narrow to white Protestant farmers
        PRO: 4,
        // Institutional reformer - constitutional amendments, party machinery, electoral institutions
        COM: 1,
        // Never compromise - "shall not crucify mankind," absolutist rhetoric
        ZS: 4,
        // Zero-sum - banks stealing from farmers, Eastern money vs. Western producers
        ONT_H: 4,
        // Optimistic - believed common people would triumph, democratic faith
        ONT_S: 4,
        // Institutional capacity belief - the system can be reformed via majoritarian politics, monetary policy, constitutional amendment
        PF: 3,
        // Moderate - fused Democratic and Populist tickets, but also alienated Gold Democrats
        TRB: 5,
        // Maximum tribal - agrarian/producer class vs. Eastern financiers, "the people"
        ENG: 5,
        // Maximum engagement - 18,000 miles of barnstorming, first modern campaign
        EPS: 2,
        // Traditionalist - biblical, providential democracy, agrarian inherited virtue (per rubric)
        AES: 5,
        // Visionary - "Cross of Gold," messianic rhetoric, prophetic oratory,
        morBoundaries: { boundaries: { national: 0.72, ethnic_racial: 0.38, religious: 0.91, class: 0.72, ideological: 0.48, gender: 0.1, political_tribe: 0.5 }, intensity: 3 }
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
        AES: 0,
        // Statesman - incumbent president, wartime gravitas,
        morBoundaries: { boundaries: { national: 0.36, ethnic_racial: 0.05, religious: 0.19, class: 0.05, ideological: 0.24, gender: 0.07, political_tribe: 1 }, intensity: 3 }
      },
      {
        name: "Bryan",
        party: "Democratic",
        year: 1900,
        // Bryan 1900 — same Pattern A as 1896. PRO 2→4, ONT_S 1→4, EPS 3→2
        // traditionalist. AES 5 visionary retained per rubric (1896 and 1900
        // are visionary; 1908 shifts to pastoral).
        MAT: 1,
        // Maximum redistribution - same populist economics, anti-trust, anti-monopoly
        CD: 5,
        // Maximum cultural closure - same evangelical/agrarian conservatism
        CU: 3,
        // Mixed - anti-imperialist (opposed Philippines annexation) but still nativist on immigration
        MOR: 4,
        // Wider moral circle than 1896 - anti-imperialism added concern for Filipino people
        PRO: 4,
        // Institutional reformer - constitutional amendments, party machinery
        COM: 1,
        // Never compromise - same absolutist populist stance
        ZS: 4,
        // Zero-sum - imperialism as exploitation, banks still robbing the people
        ONT_H: 4,
        // Optimistic - democracy and self-government for all peoples
        ONT_S: 4,
        // Institutional capacity belief - reform via majoritarian politics, monetary policy
        PF: 4,
        // Stronger partisan - more clearly Democratic this time, less Populist fusion
        TRB: 5,
        // Maximum tribal - same agrarian class identity
        ENG: 5,
        // Maximum engagement - another massive barnstorming campaign
        EPS: 2,
        // Traditionalist - same biblical / providential democracy frame as 1896
        AES: 5,
        // Visionary - anti-imperialist crusade layered onto populist economics,
        morBoundaries: { boundaries: { national: 0.57, ethnic_racial: 0.05, religious: 0.72, class: 0.72, ideological: 0.76, gender: 0.1, political_tribe: 0.75 }, intensity: 3 }
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
        AES: 5,
        // Visionary - prophetic socialist rhetoric,
        morBoundaries: { boundaries: { national: 0.05, ethnic_racial: 0.05, religious: 0.05, class: 0.81, ideological: 0.48, gender: 0.1, political_tribe: 0 }, intensity: 3 }
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
        CD: 2,
        // Culturally moderate - progressive for era, "strenuous life" but not moralist
        CU: 4,
        // Internationalist - Panama Canal, "big stick" diplomacy, global power projection
        MOR: 5,
        // Wide moral circle - conservation, labor arbitration (coal strike), progressive reform
        PRO: 3,
        // Mixed - used executive power aggressively (trust-busting, Panama) but within legal bounds
        COM: 2,
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
        AES: 3,
        // Authentic - cowboy, Rough Rider, utterly genuine, force of personality,
        morBoundaries: { boundaries: { national: 0.12, ethnic_racial: 0.05, religious: 0.05, class: 0.05, ideological: 0.24, gender: 0.07, political_tribe: 0.75 }, intensity: 2.25 }
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
        AES: 0,
        // Statesman - judicial dignity, understated (to a fault),
        morBoundaries: { boundaries: { national: 0.05, ethnic_racial: 0.05, religious: 0.05, class: 0.05, ideological: 0.05, gender: 0.05, political_tribe: 1 }, intensity: 3 }
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
        AES: 5,
        // Visionary,
        morBoundaries: { boundaries: { national: 0.05, ethnic_racial: 0.05, religious: 0.05, class: 0.81, ideological: 0.48, gender: 0.1, political_tribe: 0 }, intensity: 3 }
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
        AES: 0,
        // Statesman - dignified, judicial bearing, presidential gravitas,
        morBoundaries: { boundaries: { national: 0.11, ethnic_racial: 0.05, religious: 0.05, class: 0.05, ideological: 0.15, gender: 0.06, political_tribe: 0.75 }, intensity: 2.25 }
      },
      {
        name: "Bryan",
        party: "Democratic",
        year: 1908,
        // Bryan 1908 — same Pattern A as 1896/1900. PRO 2→4, ONT_S 2→4,
        // EPS 3→2 traditionalist. AES 5→2 PASTORAL — rubric explicitly tags
        // 1908 as the year Bryan's aesthetic shifted from visionary to pastoral
        // ("Great Commoner" salt-of-earth framing). Year-specificity test from
        // rubric — don't mechanically code all three Bryan rows the same.
        MAT: 1,
        // Maximum redistribution - income tax, railroad regulation, anti-monopoly, anti-injunction
        CD: 4,
        // Culturally conservative - same evangelical base, rural Protestant identity
        CU: 3,
        // Mixed - anti-imperialist, but Progressive-era reforms were domestic-focused
        MOR: 4,
        // Wide moral circle - "the Great Commoner," workers and farmers deserve justice
        PRO: 4,
        // Institutional reformer - constitutional reform, party machinery, regulatory law
        COM: 2,
        // Low compromise - ideological progressive, wouldn't water down demands
        ZS: 4,
        // Zero-sum - railroads and trusts extracting from the common people
        ONT_H: 4,
        // Optimistic - believed in democratic self-government, common people's wisdom
        ONT_S: 4,
        // Institutional capacity belief - reform via constitutional amendment and majoritarian politics
        PF: 5,
        // Maximum partisan - three-time Democratic nominee, party defined by his populism
        TRB: 4,
        // High tribal - farmer/worker identity, class politics, but less maximalist
        ENG: 5,
        // Maximum engagement - another barnstorming campaign, tireless
        EPS: 2,
        // Traditionalist - biblical / providential democracy / agrarian inherited virtue (per rubric)
        AES: 2,
        // Pastoral - "Great Commoner" salt-of-earth framing (rubric year-specificity),
        morBoundaries: { boundaries: { national: 0.44, ethnic_racial: 0.05, religious: 0.55, class: 0.55, ideological: 0.34, gender: 0.09, political_tribe: 1 }, intensity: 3 }
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
        AES: 5,
        // Visionary,
        morBoundaries: { boundaries: { national: 0.05, ethnic_racial: 0.05, religious: 0.05, class: 0.81, ideological: 0.48, gender: 0.1, political_tribe: 0 }, intensity: 3 }
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
        AES: 5,
        // Visionary - "New Freedom," moral crusade rhetoric, professor-prophet,
        morBoundaries: { boundaries: { national: 0.12, ethnic_racial: 0.05, religious: 0.05, class: 0.29, ideological: 0.24, gender: 0.07, political_tribe: 1 }, intensity: 3 }
      },
      {
        name: "Roosevelt",
        party: "Independent",
        // Progressive/Bull Moose - typed as Independent per CandidateProfile union
        year: 1912,
        // TR 1912 — RUBRIC SPECIAL CASE per Phase 4 (2026-04-26). Prior PRO 2 /
        // ONT_S 2 was exactly inverted from rubric. New Nationalism is the
        // paradigmatic "national institutions can solve collective problems"
        // worldview — ONT_S 5. PRO 3 (not 4): recall of judicial decisions,
        // executive activism, party rupture, plebiscitary style → mixed-
        // procedural; not anti-procedural, not clean institutionalist.
        MAT: 2,
        // Redistributive - "New Nationalism," regulate trusts, worker protections, social insurance
        CD: 2,
        // Culturally open - women's suffrage, Progressive Era reform, social justice
        CU: 4,
        // Internationalist - strong foreign policy, global leadership role for America
        MOR: 5,
        // Maximum universalist - social insurance, child labor laws, worker safety, broad moral vision
        PRO: 3,
        // Mixed-procedural - judicial recall + executive activism + party rupture, but not anti-procedural
        COM: 2,
        // Low compromise - walked out of GOP, launched new party, uncompromising on reform
        ZS: 2,
        // Positive-sum - government regulation grows the pie for everyone, "Square Deal" expanded
        ONT_H: 5,
        // Maximum optimistic - "strenuous life," humans can be perfected through reform
        ONT_S: 5,
        // Maximum institutional capacity belief - New Nationalism: national institutions can solve collective problems
        PF: 1,
        // Maximum independent - broke from his own party, created Bull Moose
        TRB: 4,
        // High tribal - progressive movement identity, us-vs-bosses
        ENG: 5,
        // Maximum engagement - shot during campaign, gave speech anyway, boundless energy
        EPS: 0,
        // Empiricist - naturalist, historian, evidence-driven reform agenda
        AES: 4,
        // Fighter - "Bull Moose," shot and kept speaking, combative reformer,
        morBoundaries: { boundaries: { national: 0.05, ethnic_racial: 0.05, religious: 0.05, class: 0.48, ideological: 0.12, gender: 0.09, political_tribe: 0 }, intensity: 2.25 }
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
        AES: 0,
        // Statesman - judicial dignity, but failed to project leadership,
        morBoundaries: { boundaries: { national: 0.29, ethnic_racial: 0.09, religious: 0.17, class: 0.05, ideological: 0.15, gender: 0.06, political_tribe: 1 }, intensity: 3 }
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
        AES: 5,
        // Visionary - "while there is a lower class, I am in it",
        morBoundaries: { boundaries: { national: 0.05, ethnic_racial: 0.05, religious: 0.05, class: 0.81, ideological: 0.48, gender: 0.1, political_tribe: 0 }, intensity: 3 }
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
        CD: 3,
        // Culturally open lean - progressive reform, but Southern racial conservatism
        CU: 4,
        // Internationalist - but "he kept us out of war" = cautious internationalism
        MOR: 3,
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
        AES: 0,
        // Statesman - incumbent president, "above politics" neutrality posture,
        morBoundaries: { boundaries: { national: 0.17, ethnic_racial: 0.05, religious: 0.05, class: 0.29, ideological: 0.24, gender: 0.07, political_tribe: 1 }, intensity: 3 }
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
        AES: 0,
        // Statesman - judicial dignity, presidential bearing, but aloof,
        morBoundaries: { boundaries: { national: 0.76, ethnic_racial: 0.76, religious: 0.41, class: 0.05, ideological: 0.44, gender: 0.16, political_tribe: 1 }, intensity: 3 }
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
        AES: 5,
        // Visionary - anti-war idealism,
        morBoundaries: { boundaries: { national: 0.05, ethnic_racial: 0.05, religious: 0.05, class: 0.62, ideological: 0.37, gender: 0.09, political_tribe: 0 }, intensity: 2.25 }
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
        MAT: 4,
        // Moderate — "Return to Normalcy" = centrist, broadly appealing
        CD: 4,
        // Moderate — genial, not culture warrior
        CU: 3,
        // Moderate — isolationist but not extreme
        MOR: 2,
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
        PF: 4,
        // Moderate partisan — broad coalition
        TRB: 2,
        // Low tribal — genial "normalcy"
        ENG: 3,
        // Moderate — front porch calm
        EPS: 2,
        // Traditionalist - "return to normalcy" = traditional ways are best
        AES: 2,
        // Pastoral - small-town Ohio, Main Street, folksy newspaper editor,
        morBoundaries: { boundaries: { national: 0.28, ethnic_racial: 0.05, religious: 0.22, class: 0.05, ideological: 0.15, gender: 0.06, political_tribe: 0.75 }, intensity: 2.25 }
      },
      {
        // Cox 1920 — "push extreme" loser-coding artifact corrected (Phase 4,
        // 2026-04-26). Cox was a forgotten Wilsonian-heir progressive newspaper
        // publisher who lost in a Harding landslide; the prior coding maxed
        // every axis as if to manufacture distance from Harding. Per user
        // direction the rubric overrides "push extreme." Softened to mainstream
        // Wilson-progressive-internationalist: MAT 1→2, CD 1→3, CU 5→4, MOR 5→4,
        // PRO 2→4 (Wilsonian institutionalist, not anti-procedural), COM 1→3,
        // ZS 1→2, ONT_H 5→4, ONT_S 1→4 (institutional capacity belief).
        name: "Cox",
        party: "Democratic",
        year: 1920,
        MAT: 2,
        // Wilsonian-progressive-redistributive lean, not max
        CD: 3,
        // Mainstream progressive Democrat - not max progressive
        CU: 4,
        // Internationalist (League) but not max-pluralist
        MOR: 4,
        // Liberal-internationalist wide-circle, not maximum
        PRO: 4,
        // Wilsonian institutionalist - worked through political institutions
        COM: 3,
        // Mixed - principled on League but a working politician
        ZS: 2,
        // Positive-sum - League/internationalism as growth-frame
        ONT_H: 4,
        // Optimistic but not maximalist
        ONT_S: 4,
        // Institutional capacity belief - League and federal institutions can work
        PF: 5,
        // Maximum partisan
        TRB: 5,
        // Maximum tribal — alienating
        ENG: 5,
        // Maximum
        EPS: 1,
        // Institutionalist - trusted League, government machinery
        AES: 0,
        // Statesman - projected Wilsonian gravitas and internationalism,
        morBoundaries: { boundaries: { national: 0.19, ethnic_racial: 0.05, religious: 0.05, class: 0.53, ideological: 0.43, gender: 0.1, political_tribe: 1 }, intensity: 3 }
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
        AES: 5,
        // Visionary - ultimate martyr-prophet figure,
        morBoundaries: { boundaries: { national: 0.05, ethnic_racial: 0.05, religious: 0.05, class: 0.81, ideological: 0.48, gender: 0.1, political_tribe: 0 }, intensity: 3 }
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
        MAT: 4,
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
        AES: 0,
        // Statesman - dignified, austere, presidential reserve,
        morBoundaries: { boundaries: { national: 0.05, ethnic_racial: 0.05, religious: 0.15, class: 0.05, ideological: 0.07, gender: 0.06, political_tribe: 0.5 }, intensity: 1.5 }
      },
      {
        // Davis 1924 — "push extreme" loser-coding artifact corrected (Phase 4,
        // 2026-04-26). Davis was a CONSERVATIVE Wall Street lawyer chosen as a
        // compromise candidate after a deadlocked 103-ballot convention. The
        // prior MAT 1 / CD 1 / CU 5 / MOR 5 max-progressive coding was directly
        // contradicted by his actual signal: Bourbon Democrat, J.P. Morgan
        // counsel, later head of the anti-New-Deal American Liberty League.
        // MAT 1→4 (Wall Street conservative, not redistributive), CD 1→3,
        // CU 5→3, MOR 5→3, ONT_S 2→4 (institutionalist lawyer, not "system
        // needs reform"). PRO 4 retained (constitutional lawyer).
        name: "Davis",
        party: "Democratic",
        year: 1924,
        MAT: 4,
        // Wall Street Bourbon Democrat - free-market lean, J.P. Morgan counsel
        CD: 3,
        // Centrist - anti-KKK plank but otherwise traditional Democrat
        CU: 3,
        // Mixed - civic-Democratic, not max-pluralist
        MOR: 3,
        // Civic-national circle - no max-universalist crusade
        PRO: 4,
        // Proceduralist — constitutional lawyer
        COM: 4,
        // Compromiser - was the literal compromise candidate
        ZS: 2,
        // Positive-sum
        ONT_H: 4,
        // Optimistic
        ONT_S: 4,
        // Institutional capacity belief - constitutional lawyer trusted institutions
        PF: 5,
        // Maximum partisan
        TRB: 4,
        // Tribal — Democratic coalition
        ENG: 3,
        // Moderate — lackluster campaign
        EPS: 1,
        // Institutionalist - trusted courts, legal process, institutions
        AES: 0,
        // Statesman - dignified lawyer, understated,
        morBoundaries: { boundaries: { national: 0.23, ethnic_racial: 0.05, religious: 0.05, class: 0.05, ideological: 0.34, gender: 0.09, political_tribe: 1 }, intensity: 3 }
      },
      {
        name: "La Follette",
        party: "Independent",
        // Progressive Party - typed as Independent per CandidateProfile union
        year: 1924,
        // Recalibrated 2026-04-26: previous encoding (MAT=1, PRO=2, ONT_S=1)
        // misread La Follette as a Debs-style anti-systemic radical. Historical
        // reality: he was a Progressive REPUBLICAN INSTITUTIONAL REFORMER who
        // pioneered direct democracy (referendum/initiative/recall), used the
        // regulatory state, founded the Progressive Party as an institutional
        // reform vehicle. MAT 1→2 (social-democratic with selective public
        // ownership, not revolutionary class-struggle). PRO 2→4 (procedural
        // reformer who created NEW procedures rather than rejecting them).
        // ONT_S 1→4 (believed institutions can produce good change via reform —
        // his entire career was institutional reformism, not nihilism).
        MAT: 2,
        // Social-democratic redistribution - public ownership of railroads, break up monopolies, but not class-revolutionary
        CD: 1,
        // Maximum cultural openness - pro-labor, anti-nativist, civil liberties
        CU: 4,
        // Internationalist lean - anti-imperialism, but not League (seen as elite club)
        MOR: 5,
        // Maximum universalist - fought for workers, farmers, immigrants, the little guy
        PRO: 4,
        // Procedural reformer - direct democracy, referenda, recall as INSTITUTIONAL innovations within constitutional frame
        COM: 1,
        // Never compromise - "Fighting Bob," ideological purist, insurgent
        ZS: 3,
        // Mixed - saw monopolies as zero-sum extraction but believed reform could fix it
        ONT_H: 4,
        // Optimistic - believed common people would choose wisely given direct democracy
        ONT_S: 4,
        // Institutional capacity belief - reform via institutions, not abolition; founded Progressive Party AS institutional reform vehicle
        PF: 1,
        // Maximum independent - rejected both parties, ran as Progressive
        TRB: 4,
        // Tribal - worker/farmer identity, class-based politics
        ENG: 5,
        // Maximum engagement - lifelong crusader, launched entire third party
        EPS: 0,
        // Empiricist - investigated corporate corruption, data-driven muckraker
        AES: 4,
        // Fighter - "Fighting Bob," combative, insurgent champion of the people,
        morBoundaries: { boundaries: { national: 0.05, ethnic_racial: 0.05, religious: 0.05, class: 0.48, ideological: 0.26, gender: 0.09, political_tribe: 0 }, intensity: 2.25 }
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
        AES: 1,
        // Technocrat - "The Great Engineer," efficiency and expertise,
        morBoundaries: { boundaries: { national: 0.11, ethnic_racial: 0.05, religious: 0.05, class: 0.05, ideological: 0.15, gender: 0.06, political_tribe: 0.75 }, intensity: 2.25 }
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
        // ADR-010 polarity fix 2026-04-26: high institutional capacity belief - government BUILDS infrastructure and helps workers. "Structuralist" advocacy is institutional reform, NOT institutional nihilism. Was 2 under old "system broken" framing.
        PF: 5,
        // Maximum partisan - Tammany Democrat, party machine product
        TRB: 4,
        // Tribal - Catholic/Irish/urban immigrant identity, ethnic coalition
        ENG: 5,
        // Maximum engagement - barnstorming campaigner, passionate
        EPS: 3,
        // Intuitionist - street-smart, gut-level populist, not academic
        AES: 3,
        // Authentic - Lower East Side accent, brown derby, "the real article",
        morBoundaries: { boundaries: { national: 0.16, ethnic_racial: 0.05, religious: 0.05, class: 0.48, ideological: 0.34, gender: 0.09, political_tribe: 1 }, intensity: 3 }
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
        ONT_S: 4,
        // ADR-010 polarity fix 2026-04-26: high institutional capacity belief - FDR was the paradigmatic institution-builder (RFC, CCC, SEC, SSA, NLRB). Was 1 under old "system broken" framing — exactly inverted. Structuralism = institutional reform, NOT nihilism.
        PF: 5,
        // Maximum partisan - built the New Deal Democratic coalition from scratch
        TRB: 3,
        // Moderate tribal - broad coalition appeal, not narrowly sectarian
        ENG: 5,
        // Maximum engagement - energetic campaigning despite disability
        EPS: 1,
        // Institutionalist - brain trust, government expertise, bold institutions
        AES: 5,
        // Visionary - "New Deal," transformative rhetoric, "happy days are here again",
        morBoundaries: { boundaries: { national: 0.12, ethnic_racial: 0.05, religious: 0.05, class: 0.34, ideological: 0.24, gender: 0.07, political_tribe: 1 }, intensity: 3 },
        morMembership: { ethnic_racial: "white", religious: "Protestant", class: "upper", gender: "male", political_tribe: "D" }
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
        AES: 1,
        // Technocrat - still projected managerial competence, but hollow,
        morBoundaries: { boundaries: { national: 0.53, ethnic_racial: 0.12, religious: 0.29, class: 0.05, ideological: 0.24, gender: 0.07, political_tribe: 0.75 }, intensity: 2.25 }
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
        // ADR-010 polarity fix 2026-04-26: maximum institutional capacity belief - "total systemic reform, new institutions" = building institutional capacity at maximum scale. Was 1 under old "system broken" framing.
        PF: 5,
        // Maximum partisan - New Deal coalition at peak, "Roosevelt coalition"
        TRB: 4,
        // High tribal - "forgotten man" vs. "economic royalists," class warfare
        ENG: 5,
        // Maximum engagement - barnstorming incumbent, massive rallies
        EPS: 1,
        // Institutionalist - brain trust, government agencies, new institutions
        AES: 4,
        // Fighter - "I welcome their hatred," combative populist champion,
        morBoundaries: { boundaries: { national: 0.16, ethnic_racial: 0.05, religious: 0.05, class: 0.48, ideological: 0.34, gender: 0.09, political_tribe: 1 }, intensity: 3 },
        morMembership: { ethnic_racial: "white", religious: "Protestant", class: "upper", gender: "male", political_tribe: "D" }
      },
      {
        name: "Landon",
        party: "Republican",
        year: 1936,
        // Recoded 2026-04-23: previous coding ran Landon to extremes on every
        // axis (avg dist 2.304). He was a moderate Kansas Republican — "Kansas
        // Coolidge" — not an ideological maximalist. Softened to reflect
        // mainstream Republican positioning of the era.
        MAT: 4,
        // Pro-market but not laissez-faire maximalist
        CD: 4,
        // Culturally conservative but not extreme
        CU: 2,
        // Particularist-leaning America-first
        MOR: 2,
        // Narrow moral circle
        PRO: 4,
        // Proceduralist — attacked executive overreach
        COM: 3,
        // Mixed
        ZS: 3,
        // Mixed
        ONT_H: 2,
        // Pessimistic about government dependency
        ONT_S: 4,
        // System mostly working — free enterprise
        PF: 4,
        // Strong Republican
        TRB: 2,
        // Low tribal
        ENG: 2,
        // Low — outmatched by FDR
        EPS: 0,
        // Empiricist - businessman, practical, fiscal prudence
        AES: 2,
        // Pastoral - "the Kansas Coolidge," folksy midwestern governor,
        morBoundaries: { boundaries: { national: 0.29, ethnic_racial: 0.09, religious: 0.17, class: 0.05, ideological: 0.15, gender: 0.06, political_tribe: 0.75 }, intensity: 2.25 }
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
        AES: 0,
        // Statesman - patrician, fireside chats, gravitas,
        morBoundaries: { boundaries: { national: 0.12, ethnic_racial: 0.05, religious: 0.05, class: 0.34, ideological: 0.24, gender: 0.07, political_tribe: 1 }, intensity: 3 },
        moralCircle: { universalAffinity: 73, scopedAffinities: { national: 12, religious: 5, ethnic_racial: 5, class: 34, gender: 7, ideological: 100 } },
        morMembership: { ethnic_racial: "white", religious: "Protestant", class: "upper", gender: "male", political_tribe: "D" }
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
        ONT_S: 4,
        // POLARITY FIX 2026-04-23: System-working worldview - free enterprise works
        PF: 4,
        // Ran as strong Republican despite being newcomer
        TRB: 3,
        // Moderate - business coalition identity
        ENG: 4,
        // Energetic campaign
        EPS: 0,
        // Empiricist - business pragmatist
        AES: 3,
        // Authentic - outsider, plain-spoken,
        morBoundaries: { boundaries: { national: 0.5, ethnic_racial: 0.05, religious: 0.19, class: 0.05, ideological: 0.24, gender: 0.07, political_tribe: 0.75 }, intensity: 2.25 },
        moralCircle: { universalAffinity: 38, scopedAffinities: { national: 50, religious: 19, ethnic_racial: 5, class: 5, gender: 7, ideological: 75 } }
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
        AES: 0,
        // Statesman - commander-in-chief gravitas,
        morBoundaries: { boundaries: { national: 0.12, ethnic_racial: 0.05, religious: 0.05, class: 0.34, ideological: 0.24, gender: 0.07, political_tribe: 1 }, intensity: 3 },
        moralCircle: { universalAffinity: 73, scopedAffinities: { national: 12, religious: 5, ethnic_racial: 5, class: 34, gender: 7, ideological: 100 } },
        morMembership: { ethnic_racial: "white", religious: "Protestant", class: "upper", gender: "male", political_tribe: "D" }
      },
      {
        // Dewey 1944 MOR 1→2 (Phase 6, 2026-04-27). Establishment-Republican
        // narrow practiced scope is MOR 2 territory per rubric, not klan-tier.
        name: "Dewey",
        party: "Republican",
        year: 1944,
        MAT: 5,
        // Pro-market — criticized New Deal spending
        CD: 5,
        // Maximum conservative — establishment
        CU: 1,
        // Maximum assimilationist
        MOR: 2,
        // Narrow practiced scope - establishment Republican, not klan-tier
        PRO: 5,
        // Maximum proceduralist
        COM: 3,
        // Mixed
        ZS: 3,
        // Mixed
        ONT_H: 2,
        // Skeptical
        ONT_S: 4,
        // POLARITY FIX 2026-04-23: Strong system-working confidence
        PF: 5,
        // Maximum partisan
        TRB: 3,
        // Moderate
        ENG: 3,
        // Lower — cautious campaign
        EPS: 0,
        // Empiricist - prosecutor, facts-based
        AES: 1,
        // Technocrat - efficient manager image,
        morBoundaries: { boundaries: { national: 0.53, ethnic_racial: 0.43, religious: 0.29, class: 0.05, ideological: 0.31, gender: 0.07, political_tribe: 1 }, intensity: 3 },
        moralCircle: { universalAffinity: 38, scopedAffinities: { national: 53, religious: 29, ethnic_racial: 43, class: 5, gender: 7, ideological: 100 } }
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
        MAT: 2,
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
        ONT_S: 4,
        // ADR-010 (2026-04-26): high institutional capacity belief - Fair Deal architect, Marshall Plan, NATO, Truman Doctrine. Was 3 under old "mixed" framing. Truman built lasting institutions of postwar liberal order.
        PF: 5,
        // Maximum partisan - attacked Republican Congress relentlessly
        TRB: 4,
        // Moderate tribal - working-class identity, "regular guy"
        ENG: 5,
        // Maximum engagement - whistle-stop tour, never-give-up
        EPS: 1,
        // Institutionalist - trusted government, Truman Doctrine
        AES: 4,
        // Fighter - "Give 'em hell Harry",
        morBoundaries: { boundaries: { national: 0.16, ethnic_racial: 0.05, religious: 0.05, class: 0.48, ideological: 0.34, gender: 0.09, political_tribe: 1 }, intensity: 3 },
        moralCircle: { universalAffinity: 73, scopedAffinities: { national: 16, religious: 5, ethnic_racial: 5, class: 48, gender: 9, ideological: 100 } }
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
        ONT_S: 4,
        // POLARITY FIX 2026-04-23: Strong system-working confidence - stable management
        PF: 4,
        // Strong Republican
        TRB: 3,
        // Moderate tribal
        ENG: 3,
        // Lower engagement - overconfident, coasted
        EPS: 0,
        // Empiricist - technocratic
        AES: 0,
        // Statesman - dignified, above-the-fray,
        morBoundaries: { boundaries: { national: 0.53, ethnic_racial: 0.12, religious: 0.29, class: 0.05, ideological: 0.24, gender: 0.07, political_tribe: 0.75 }, intensity: 2.25 },
        moralCircle: { universalAffinity: 38, scopedAffinities: { national: 53, religious: 29, ethnic_racial: 12, class: 5, gender: 7, ideological: 75 } }
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
        ONT_S: 2,
        // POLARITY FIX 2026-04-23: System broken - Dixiecrat anti-federal, structural grievance
        PF: 3,
        // Regional partisan - not national party man
        TRB: 5,
        // Maximum tribal - white southern identity
        ENG: 5,
        // Maximum engagement - launched entire party over civil rights
        EPS: 2,
        // Traditionalist - "way things have always been"
        AES: 4,
        // Fighter - insurgent, defiant,
        morBoundaries: { boundaries: { national: 1, ethnic_racial: 1, religious: 0.91, class: 0.05, ideological: 0.34, gender: 0.19, political_tribe: 0.5 }, intensity: 3 },
        moralCircle: { universalAffinity: 20, scopedAffinities: { national: 100, religious: 91, ethnic_racial: 100, class: 5, gender: 19, ideological: 50 } }
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
        // ONT_S 2→4 (Phase 4, 2026-04-26). H. Wallace was a former VP and
        // Commerce Secretary running on EXTENDING New Deal institutions, not
        // dismantling them — institutional reformer using institutions hard.
        // ONT_S 2 read him as Debs-style anti-systemic socialist; he was the
        // opposite. Per rubric Pattern A correction.
        ONT_S: 4,
        // Institutional capacity belief - extend New Deal via federal institutions
        PF: 1,
        // Anti-partisan - left Democratic Party
        TRB: 3,
        // Moderate tribal - broad progressive coalition
        ENG: 5,
        // Maximum engagement - launched third party, toured extensively
        EPS: 0,
        // Empiricist - former Sec. of Agriculture, scientific farmer, data-driven
        AES: 5,
        // Visionary - "Century of the Common Man," prophetic rhetoric,
        morBoundaries: { boundaries: { national: 0.05, ethnic_racial: 0.05, religious: 0.05, class: 0.34, ideological: 0.26, gender: 0.07, political_tribe: 0 }, intensity: 2 },
        moralCircle: { universalAffinity: 90, scopedAffinities: { national: 5, religious: 5, ethnic_racial: 5, class: 34, gender: 7, ideological: 26 } }
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
        ONT_S: 4,
        // POLARITY FIX 2026-04-23: System-working / preserve-and-manage
        PF: 3,
        // Moderate partisan - ran as Republican, attracted independents
        TRB: 3,
        // Moderate - military patriotic identity, "our boys"
        ENG: 5,
        // Maximum engagement - running for president is maximum engagement
        EPS: 0,
        // Empiricist - military planning, evidence-based
        AES: 0,
        // Statesman - supreme commander, gravitas,
        morBoundaries: { boundaries: { national: 0.05, ethnic_racial: 0.05, religious: 0.05, class: 0.05, ideological: 0.1, gender: 0.07, political_tribe: 0.5 }, intensity: 2 },
        moralCircle: { universalAffinity: 55, scopedAffinities: { national: 5, religious: 5, ethnic_racial: 5, class: 5, gender: 7, ideological: 50 } }
      },
      {
        name: "Stevenson",
        party: "Democratic",
        year: 1952,
        // Stevenson 1952 MAT 1→2 (Phase 6, 2026-04-27). MAT 1 anchor in rubric
        // is reserved for Debs / Norman Thomas / Bernie / FDR 1936 / H. Wallace
        // 1948 — true max-redistribution. Stevenson is a New Deal liberal in
        // Truman's mold (MAT 2 anchor: Truman 1948, Carter 1976, Mondale 1984,
        // Obama 2008). Off-by-one fix.
        MAT: 2,
        // New Deal liberal - Truman/Carter/Mondale band, not max-redistribution
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
        ONT_S: 5,
        // ADR-010 (2026-04-26): maximum institutional capacity belief - lawyer-statesman, UN architect, full-throated New Deal heir. Was 4.
        PF: 5,
        // Maximum Democrat - New Deal heir
        TRB: 3,
        // Moderate tribal - intellectual elite identity
        ENG: 4,
        // Engaged but "egghead" aloofness
        EPS: 0,
        // Empiricist - "the thinking man's candidate"
        AES: 5,
        // Visionary - eloquent idealist,
        morBoundaries: { boundaries: { national: 0.12, ethnic_racial: 0.05, religious: 0.05, class: 0.34, ideological: 0.24, gender: 0.07, political_tribe: 1 }, intensity: 3 },
        moralCircle: { universalAffinity: 90, scopedAffinities: { national: 12, religious: 5, ethnic_racial: 5, class: 34, gender: 7, ideological: 100 } }
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
        MAT: 4,
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
        ONT_S: 4,
        // POLARITY FIX 2026-04-23: Strong system-working confidence - prosperity, peace, stability
        PF: 2,
        // Low partisan - above-party, national figure
        TRB: 2,
        // Low tribal - father figure to nation
        ENG: 4,
        // Engaged incumbent
        EPS: 0,
        // Empiricist - military planning background
        AES: 0,
        // Statesman - beloved grandfather-commander,
        morBoundaries: { boundaries: { national: 0.05, ethnic_racial: 0.05, religious: 0.05, class: 0.05, ideological: 0.07, gender: 0.06, political_tribe: 0.25 }, intensity: 1.5 },
        moralCircle: { universalAffinity: 55, scopedAffinities: { national: 5, religious: 5, ethnic_racial: 5, class: 5, gender: 6, ideological: 25 } }
      },
      {
        // Stevenson 1956 MAT 1→2 (Phase 6, 2026-04-27). Same off-by-one fix as
        // 1952; New Deal liberal sits at MAT 2 anchor with Truman/Carter/Mondale.
        name: "Stevenson",
        party: "Democratic",
        year: 1956,
        MAT: 2,
        // New Deal liberal - Truman/Carter/Mondale band
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
        AES: 5,
        // Visionary - nuclear test ban, "New America",
        morBoundaries: { boundaries: { national: 0.16, ethnic_racial: 0.05, religious: 0.05, class: 0.48, ideological: 0.34, gender: 0.09, political_tribe: 1 }, intensity: 3 },
        moralCircle: { universalAffinity: 90, scopedAffinities: { national: 16, religious: 5, ethnic_racial: 5, class: 48, gender: 9, ideological: 100 } }
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
        AES: 0,
        // Statesman - projected elegance and gravitas,
        morBoundaries: { boundaries: { national: 0.5, ethnic_racial: 0.2, religious: 0.5, class: 0.25, ideological: 0.35, gender: 0.1, political_tribe: 0.5 }, intensity: 2.5 },
        moralCircle: { universalAffinity: 55, scopedAffinities: { national: 50, religious: 50, ethnic_racial: 20, class: 25, gender: 10, ideological: 50 } },
        morMembership: { ethnic_racial: "white", religious: "Catholic", class: "upper", gender: "male", political_tribe: "D" }
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
        ONT_S: 3,
        // POLARITY FIX 2026-04-23: Mixed - system-working rhetoric but tough-on-crime distrust
        PF: 4,
        // Strong Republican partisan
        TRB: 3,
        // Middle-class tribal identity
        ENG: 5,
        // Career politician, deeply engaged
        EPS: 1,
        // Institutionalist - government experience
        AES: 0,
        // Statesman - tried to project gravitas (less successfully),
        morBoundaries: { boundaries: { national: 0.17, ethnic_racial: 0.05, religious: 0.05, class: 0.05, ideological: 0.24, gender: 0.07, political_tribe: 0.75 }, intensity: 2.25 },
        moralCircle: { universalAffinity: 55, scopedAffinities: { national: 17, religious: 5, ethnic_racial: 5, class: 5, gender: 7, ideological: 75 } }
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
        ONT_S: 5,
        // ADR-010 (2026-04-26): peak institutional capacity belief - Great Society, Medicare/Medicaid, ESEA, Voting Rights Act, HUD. Was 4. Top of the institution-building era.
        PF: 5,
        // Party-is-identity - master Democrat
        TRB: 5,
        // Strong coalition tribal politics
        ENG: 5,
        // Politics was his life
        EPS: 1,
        // Institutionalist - trusted government machinery
        AES: 0,
        // Statesman (with pastoral southern touches),
        morBoundaries: { boundaries: { national: 0.29, ethnic_racial: 0.05, religious: 0.05, class: 0.62, ideological: 0.43, gender: 0.1, political_tribe: 1 }, intensity: 3 },
        moralCircle: { universalAffinity: 55, scopedAffinities: { national: 29, religious: 5, ethnic_racial: 5, class: 62, gender: 10, ideological: 100 } }
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
        AES: 3,
        // Authentic - spoke his mind regardless of consequences,
        morBoundaries: { boundaries: { national: 0.38, ethnic_racial: 0.05, religious: 0.29, class: 0.05, ideological: 0.19, gender: 0.07, political_tribe: 0.5 }, intensity: 2 },
        moralCircle: { universalAffinity: 55, scopedAffinities: { national: 38, religious: 29, ethnic_racial: 5, class: 5, gender: 7, ideological: 50 } }
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
        AES: 0,
        // Statesman - projected authority,
        morBoundaries: { boundaries: { national: 0.44, ethnic_racial: 0.05, religious: 0.26, class: 0.05, ideological: 0.34, gender: 0.09, political_tribe: 0.75 }, intensity: 2.25 },
        moralCircle: { universalAffinity: 73, scopedAffinities: { national: 44, religious: 26, ethnic_racial: 5, class: 5, gender: 9, ideological: 75 } }
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
        ONT_S: 5,
        // ADR-010 (2026-04-26): peak institutional capacity belief - Great Society defender, civil rights legislative architect, UN/internationalist institution builder. Was 4.
        PF: 5,
        // Strong Democrat partisan
        TRB: 3,
        // Coalition builder
        ENG: 5,
        // Lifelong politician
        EPS: 1,
        // Institutionalist
        AES: 5,
        // Visionary - idealistic rhetoric,
        morBoundaries: { boundaries: { national: 0.17, ethnic_racial: 0.05, religious: 0.05, class: 0.34, ideological: 0.24, gender: 0.07, political_tribe: 1 }, intensity: 3 },
        moralCircle: { universalAffinity: 55, scopedAffinities: { national: 17, religious: 5, ethnic_racial: 5, class: 34, gender: 7, ideological: 100 } }
      },
      {
        // Wallace 1968 — MOR INVERSION BUG corrected (Phase 4, 2026-04-26).
        // Prior MOR 5 read "traditional moral content" as MOR. But MOR is
        // SPATIAL SCOPE ONLY (rubric); segregationism is the paradigmatic
        // narrow practiced moral scope (in-group only, willing to harm out-
        // group for in-group benefit). Traditional moral content is already
        // captured by CD 5 / CU 1. MOR 5→1 corrects the sign error.
        name: "Wallace",
        party: "American Independent",
        year: 1968,
        MAT: 2,
        // Economic populist - pro-worker, anti-elite
        CD: 5,
        // Maximum cultural closure - segregationist
        CU: 1,
        // Maximum particularist - white southern identity
        MOR: 1,
        // Narrow practiced scope - segregationist in-group-only morality
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
        AES: 4,
        // Fighter - combative, defiant,
        morBoundaries: { boundaries: { national: 0.6, ethnic_racial: 0.85, religious: 0.3, class: 0.2, ideological: 0.3, gender: 0.1, political_tribe: 0.7 }, intensity: 3 },
        moralCircle: { universalAffinity: 20, scopedAffinities: { national: 60, religious: 30, ethnic_racial: 85, class: 20, gender: 10, ideological: 70 } },
        morMembership: { ethnic_racial: "white", religious: "Protestant", class: "middle", gender: "male", political_tribe: "third" }
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
        // Recoded 2026-04-23: previous coding averaged 3.5 across the 14 nodes
        // (avg dist 1.473 — coded as "moderate on everything"). Nixon's Silent
        // Majority platform was sharply particularist and in-group, his
        // institutional rhetoric was distrustful, and his MOR appeal was narrow
        // ("take care of our own"). Sharpened accordingly.
        MAT: 4,
        // More centrist as president - wage controls, EPA
        CD: 5,
        // Silent Majority, law and order - maximum traditional values
        CU: 3,
        // Détente - pragmatic internationalism
        MOR: 2,
        // Particularist - "take care of our own," Silent Majority in-group framing
        PRO: 3,
        // Pragmatic - willing to bend rules
        COM: 4,
        // Dealmaker - bipartisan governance, EPA, China opening
        ZS: 3,
        // Mixed - détente positive-sum, domestic messaging mixed
        ONT_H: 2,
        // Pessimistic - Watergate-era paranoia, "enemies list," press-as-enemy
        ONT_S: 2,
        // System needs reform - rhetoric against "liberal establishment," media
        PF: 4,
        // Strong Republican
        TRB: 4,
        // Silent Majority was explicit in-group appeal to white working class
        ENG: 5,
        // Career politician
        EPS: 0,
        // Empiricist as president - data-driven détente
        AES: 0,
        // Statesman - presidential, "peace with honor",
        morBoundaries: { boundaries: { national: 0.73, ethnic_racial: 0.3, religious: 0.26, class: 0.05, ideological: 0.34, gender: 0.09, political_tribe: 0.75 }, intensity: 2.25 },
        moralCircle: { universalAffinity: 38, scopedAffinities: { national: 73, religious: 26, ethnic_racial: 30, class: 5, gender: 9, ideological: 75 } }
      },
      {
        name: "McGovern",
        party: "Democratic",
        year: 1972,
        // Recoded 2026-04-23: THE critical fix. Previous coding had MOR=1
        // ("maximum secular progressivism — 'acid, amnesty, abortion'"), which
        // inverted the MOR polarity (MOR 1 = narrow/particularist, 5 = wide/
        // universalist). Anti-war universal-humanitarianism is MAX MOR, not min.
        // Also softened a few max-extremes (ONT_S, COM) that were overstated.
        // Before fix, every universalist left-progressive archetype (MOR=5) read
        // McGovern as MAXIMALLY FAR from them — driving 0% McGovern in 1972 sim.
        MAT: 1,
        // Maximum redistribution - demogrant proposal
        CD: 1,
        // Maximum cultural openness - counterculture affinity
        CU: 5,
        // Maximum universalist - anti-war, global peace
        MOR: 5,
        // Maximum WIDE moral circle - universal humanitarianism, anti-war
        PRO: 3,
        // Mixed - challenged party rules but operated within civil-rights framework
        COM: 2,
        // Low compromise on core principles but capable of coalition work
        ZS: 2,
        // Positive-sum - "come home, America"
        ONT_H: 4,
        // Optimistic - believed in transformation
        ONT_S: 4,
        // ADR-010 (2026-04-26): institutional capacity belief - despite anti-Vietnam-establishment rhetoric, McGovern relied on institutional action (demogrant via federal programs, regulatory reform). Was 3.
        PF: 3,
        // Democratic insurgent - challenged establishment from within
        TRB: 2,
        // New Left coalition - narrow
        ENG: 5,
        // Deeply engaged - movement politics
        EPS: 0,
        // Empiricist - professor, policy wonk
        AES: 5,
        // Visionary - idealistic moral appeal,
        morBoundaries: { boundaries: { national: 0.05, ethnic_racial: 0.05, religious: 0.05, class: 0.19, ideological: 0.11, gender: 0.06, political_tribe: 0.5 }, intensity: 2 },
        moralCircle: { universalAffinity: 90, scopedAffinities: { national: 5, religious: 5, ethnic_racial: 5, class: 19, gender: 6, ideological: 50 } }
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
        ONT_S: 4,
        // ADR-010 (2026-04-26): institutional capacity belief - reform-oriented (Department of Education, Energy created), trusted institutions, just wanted them better-managed. Was 3.
        PF: 3,
        // Democrat but ran as outsider to party
        TRB: 3,
        // Southern identity, broad coalition
        ENG: 4,
        // Engaged but projected citizen-politician
        EPS: 3,
        // Intuitionist - moral/faith-based reasoning
        AES: 2,
        // Pastoral - peanut farmer, small-town authenticity,
        morBoundaries: { boundaries: { national: 0.05, ethnic_racial: 0.05, religious: 0.05, class: 0.29, ideological: 0.1, gender: 0.07, political_tribe: 0.5 }, intensity: 1.5 },
        moralCircle: { universalAffinity: 73, scopedAffinities: { national: 5, religious: 5, ethnic_racial: 5, class: 29, gender: 7, ideological: 50 } },
        morMembership: { ethnic_racial: "white", religious: "Protestant", class: "middle", gender: "male", political_tribe: "D" }
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
        ONT_S: 4,
        // POLARITY FIX 2026-04-23: Strong system-working confidence - "move on" after Watergate
        PF: 5,
        // Maximum partisan — lifelong Republican
        TRB: 2,
        // Low tribal
        ENG: 3,
        // Lower — uninspiring campaigner
        EPS: 1,
        // Institutionalist - congressional creature
        AES: 0,
        // Statesman - steady, presidential,
        morBoundaries: { boundaries: { national: 0.2, ethnic_racial: 0.05, religious: 0.12, class: 0.05, ideological: 0.15, gender: 0.06, political_tribe: 1 }, intensity: 3 },
        moralCircle: { universalAffinity: 55, scopedAffinities: { national: 20, religious: 12, ethnic_racial: 5, class: 5, gender: 6, ideological: 100 } }
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
        ONT_S: 3,
        // POLARITY FIX 2026-04-23: Mixed - "government is the problem" rhetoric but pro-system
        PF: 4,
        // Strong Republican - transformed the party
        TRB: 4,
        // Strong tribal - "real Americans" appeal
        ENG: 5,
        // Deeply engaged - movement leader
        EPS: 3,
        // Intuitionist - gut conviction, moral clarity
        AES: 5,
        // Visionary - "morning in America," transformative optimism,
        morBoundaries: { boundaries: { national: 0.7, ethnic_racial: 0.3, religious: 0.5, class: 0.2, ideological: 0.5, gender: 0.15, political_tribe: 0.6 }, intensity: 2.5 },
        moralCircle: { universalAffinity: 73, scopedAffinities: { national: 70, religious: 50, ethnic_racial: 30, class: 20, gender: 15, ideological: 60 } },
        morMembership: { ethnic_racial: "white", religious: "Protestant", class: "middle", gender: "male", political_tribe: "R" }
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
        ONT_S: 4,
        // ADR-010 (2026-04-26): institutional capacity belief - even "malaise" speech advocated institutional renewal not abandonment. Was 3.
        PF: 4,
        // Stronger partisan as incumbent
        TRB: 3,
        // Moderate tribal
        ENG: 4,
        // Engaged but exhausted
        EPS: 0,
        // Empiricist - engineer's mindset, detail-oriented
        AES: 2,
        // Pastoral - but less effective,
        morBoundaries: { boundaries: { national: 0.12, ethnic_racial: 0.05, religious: 0.05, class: 0.29, ideological: 0.24, gender: 0.07, political_tribe: 0.75 }, intensity: 2.25 },
        moralCircle: { universalAffinity: 73, scopedAffinities: { national: 12, religious: 5, ethnic_racial: 5, class: 29, gender: 7, ideological: 75 } },
        morMembership: { ethnic_racial: "white", religious: "Protestant", class: "middle", gender: "male", political_tribe: "D" }
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
        AES: 1,
        // Technocrat - intellectual, professorial,
        morBoundaries: { boundaries: { national: 0.05, ethnic_racial: 0.05, religious: 0.05, class: 0.05, ideological: 0.05, gender: 0.05, political_tribe: 0 }, intensity: 1.5 },
        moralCircle: { universalAffinity: 38, scopedAffinities: { national: 5, religious: 5, ethnic_racial: 5, class: 5, gender: 5, ideological: 5 } }
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
        CD: 4,
        // Broad cultural appeal - optimistic, not punitive
        CU: 2,
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
        ONT_S: 4,
        // POLARITY FIX 2026-04-23: System-working incumbency - "Morning in America"
        PF: 5,
        // Maximum party leader - defined the GOP
        TRB: 4,
        // Broad appeal - won 49 states by transcending tribes
        ENG: 5,
        // Maximum engagement - dominant president
        EPS: 3,
        // Intuitionist - gut conviction, moral clarity
        AES: 5,
        // Visionary - peak "morning in America",
        morBoundaries: { boundaries: { national: 0.7, ethnic_racial: 0.3, religious: 0.5, class: 0.15, ideological: 0.5, gender: 0.15, political_tribe: 0.65 }, intensity: 2.5 },
        moralCircle: { universalAffinity: 73, scopedAffinities: { national: 70, religious: 50, ethnic_racial: 30, class: 15, gender: 15, ideological: 65 } },
        morMembership: { ethnic_racial: "white", religious: "Protestant", class: "middle", gender: "male", political_tribe: "R" }
      },
      {
        name: "Mondale",
        party: "Democratic",
        year: 1984,
        // MOR 2→4 (Phase 4, 2026-04-26). Same MOR-as-CD-content confusion as
        // Dukakis/Obama/Clinton: "secular-leaning permissive" is CD content
        // (already captured by CD 2). MOR is spatial scope; Mondale's
        // coalition (labor + civil-rights + nuclear-freeze internationalism)
        // is wide moral circle. MOR 4 fits Truman/Carter/Obama anchor band.
        MAT: 1,
        // Maximum redistribution - old-guard New Deal liberal
        CD: 2,
        // Culturally open - perceived as liberal
        CU: 4,
        // Internationalist
        MOR: 4,
        // Wide moral circle - civil-rights + labor + nuclear-freeze internationalism
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
        AES: 0,
        // Statesman - tried to project gravitas but lacked charisma,
        morBoundaries: { boundaries: { national: 0.16, ethnic_racial: 0.05, religious: 0.05, class: 0.48, ideological: 0.34, gender: 0.09, political_tribe: 1 }, intensity: 3 },
        moralCircle: { universalAffinity: 73, scopedAffinities: { national: 16, religious: 5, ethnic_racial: 5, class: 48, gender: 9, ideological: 100 } }
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
        CD: 5,
        // Culturally conservative - Willie Horton, flag/pledge
        CU: 3,
        // Internationalist - UN ambassador, CIA director
        MOR: 2,
        // Traditional values - "thousand points of light"
        PRO: 4,
        // Proceduralist - institutionalist background
        COM: 4,
        // Pragmatic - "kinder, gentler"
        ZS: 2,
        // Positive-sum - "kinder, gentler nation"
        ONT_H: 3,
        // Moderate
        ONT_S: 4,
        // POLARITY FIX 2026-04-23: System-working - establishment Republican continuity
        PF: 4,
        // Strong Republican - Reagan's heir
        TRB: 4,
        // Patrician - less tribal than Reagan
        ENG: 4,
        // Career public servant
        EPS: 1,
        // Institutionalist - foreign policy establishment
        AES: 0,
        // Statesman - patrician dignity,
        morBoundaries: { boundaries: { national: 0.73, ethnic_racial: 0.3, religious: 0.26, class: 0.05, ideological: 0.34, gender: 0.09, political_tribe: 0.75 }, intensity: 2.25 },
        moralCircle: { universalAffinity: 38, scopedAffinities: { national: 73, religious: 26, ethnic_racial: 30, class: 5, gender: 9, ideological: 75 } },
        morMembership: { ethnic_racial: "white", religious: "Protestant", class: "upper", gender: "male", political_tribe: "R" }
      },
      {
        // Dukakis 1988 — MOR 1→4 (Phase 4, 2026-04-26). MOR-as-CD-content
        // confusion: ACLU progressivism is cultural progressive content (CD 1
        // already captures this), not narrow moral scope. MOR 1 means klan-tier
        // in-group only — wrong for a humanitarian liberal. Dukakis's actual
        // moral scope (universal-rights, immigrant-defending, wide-circle
        // criminal-justice) is MOR 4.
        name: "Dukakis",
        party: "Democratic",
        year: 1988,
        MAT: 2,
        // Mildly redistributive - Massachusetts liberal
        CD: 1,
        // Culturally very open - ACLU member, perceived as too liberal
        CU: 4,
        // Universalist
        MOR: 4,
        // Wide moral circle - universal-rights, immigrant-defending humanitarian liberal
        PRO: 5,
        // Maximum proceduralist - "competence not ideology"
        COM: 4,
        // Pragmatic compromiser
        ZS: 2,
        // Positive-sum - economic manager
        ONT_H: 4,
        // Optimistic - technocratic confidence
        ONT_S: 5,
        // ADR-010 (2026-04-26): maximum institutional capacity belief - "competence not ideology" IS the technocratic-institutionalist creed. Was 4.
        PF: 4,
        // Strong Democrat
        TRB: 2,
        // Low tribal - technocratic appeal
        ENG: 4,
        // Engaged - governor/manager
        EPS: 0,
        // Empiricist - data-driven, technocratic
        AES: 1,
        // Technocrat - "competence not ideology",
        morBoundaries: { boundaries: { national: 0.09, ethnic_racial: 0.05, religious: 0.05, class: 0.19, ideological: 0.15, gender: 0.06, political_tribe: 0.75 }, intensity: 2.25 },
        moralCircle: { universalAffinity: 73, scopedAffinities: { national: 9, religious: 5, ethnic_racial: 5, class: 19, gender: 6, ideological: 75 } }
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
        ONT_S: 4,
        // ADR-010 (2026-04-26): institutional capacity belief - despite "Third Way" framing, Clinton built/reformed institutions (NAFTA, welfare reform via institutions, AmeriCorps, COPS). Was 3 under old "mixed" framing.
        PF: 4,
        // Strong Democrat - but "New Democrat"
        TRB: 3,
        // Broad coalition - Bubba + professionals
        ENG: 5,
        // Maximum political animal
        EPS: 0,
        // Empiricist - policy wonk, "putting people first"
        AES: 3,
        // Authentic - "I feel your pain," personal connection,
        morBoundaries: { boundaries: { national: 0.17, ethnic_racial: 0.05, religious: 0.05, class: 0.05, ideological: 0.24, gender: 0.07, political_tribe: 0.75 }, intensity: 2.25 },
        moralCircle: { universalAffinity: 55, scopedAffinities: { national: 17, religious: 5, ethnic_racial: 5, class: 5, gender: 7, ideological: 75 } },
        morMembership: { ethnic_racial: "white", religious: "Protestant", class: "working", gender: "male", political_tribe: "D" }
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
        ONT_S: 4,
        // POLARITY FIX 2026-04-23: System-working - incumbent defender of institutions
        PF: 4,
        // Strong Republican
        TRB: 3,
        // Patrician, low-tribal
        ENG: 4,
        // Career public servant
        EPS: 1,
        // Institutionalist
        AES: 0,
        // Statesman - "résumé candidate",
        morBoundaries: { boundaries: { national: 0.17, ethnic_racial: 0.05, religious: 0.05, class: 0.05, ideological: 0.24, gender: 0.07, political_tribe: 0.75 }, intensity: 2.25 },
        moralCircle: { universalAffinity: 55, scopedAffinities: { national: 17, religious: 5, ethnic_racial: 5, class: 5, gender: 7, ideological: 75 } },
        morMembership: { ethnic_racial: "white", religious: "Protestant", class: "upper", gender: "male", political_tribe: "R" }
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
        AES: 1,
        // Technocrat - businessman with spreadsheets,
        morBoundaries: { boundaries: { national: 0.12, ethnic_racial: 0.05, religious: 0.1, class: 0.05, ideological: 0.07, gender: 0.06, political_tribe: 0 }, intensity: 1.5 },
        moralCircle: { universalAffinity: 55, scopedAffinities: { national: 12, religious: 10, ethnic_racial: 5, class: 5, gender: 6, ideological: 7 } }
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
        ONT_S: 4,
        // ADR-010 (2026-04-26): institutional capacity belief - second term focused on institutional governance, "bridge to 21st century" infrastructure/education/research investments. Was 3.
        PF: 4,
        // Strong Democrat
        TRB: 3,
        // Broad coalition
        ENG: 5,
        // Maximum engagement
        EPS: 0,
        // Empiricist - "what works"
        AES: 0,
        // Statesman - presidential incumbent,
        morBoundaries: { boundaries: { national: 0.17, ethnic_racial: 0.05, religious: 0.05, class: 0.05, ideological: 0.24, gender: 0.07, political_tribe: 0.75 }, intensity: 2.25 },
        moralCircle: { universalAffinity: 55, scopedAffinities: { national: 17, religious: 5, ethnic_racial: 5, class: 5, gender: 7, ideological: 75 } },
        morMembership: { ethnic_racial: "white", religious: "Protestant", class: "working", gender: "male", political_tribe: "D" }
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
        ONT_S: 4,
        // POLARITY FIX 2026-04-23: System-working - institutional Republican
        PF: 5,
        // Maximum partisan - career Republican
        TRB: 3,
        // Moderate tribal - old-guard, not populist
        ENG: 5,
        // Career politician
        EPS: 1,
        // Institutionalist - Senate creature
        AES: 0,
        // Statesman - WWII hero, tried for gravitas,
        morBoundaries: { boundaries: { national: 0.31, ethnic_racial: 0.05, religious: 0.19, class: 0.05, ideological: 0.24, gender: 0.07, political_tribe: 1 }, intensity: 3 },
        moralCircle: { universalAffinity: 73, scopedAffinities: { national: 31, religious: 19, ethnic_racial: 5, class: 5, gender: 7, ideological: 100 } }
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
        AES: 1,
        // Technocrat - businessman with spreadsheets,
        morBoundaries: { boundaries: { national: 0.12, ethnic_racial: 0.05, religious: 0.1, class: 0.05, ideological: 0.07, gender: 0.06, political_tribe: 0 }, intensity: 1 },
        moralCircle: { universalAffinity: 55, scopedAffinities: { national: 12, religious: 10, ethnic_racial: 5, class: 5, gender: 6, ideological: 7 } }
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
        ONT_S: 4,
        // ADR-010 (2026-04-26): institutional capacity belief - climate institutional builder, technology/research investment, "lockbox" for Social Security. Was 3.
        PF: 4,
        // Strong Democrat
        TRB: 3,
        // Moderate tribal
        ENG: 5,
        // Career politician
        EPS: 0,
        // Empiricist - data, science, climate expertise
        AES: 1,
        // Technocrat - wonkish, "lockbox",
        morBoundaries: { boundaries: { national: 0.17, ethnic_racial: 0.05, religious: 0.05, class: 0.34, ideological: 0.24, gender: 0.07, political_tribe: 0.75 }, intensity: 2.25 },
        moralCircle: { universalAffinity: 55, scopedAffinities: { national: 17, religious: 5, ethnic_racial: 5, class: 34, gender: 7, ideological: 75 } }
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
        ONT_S: 4,
        // POLARITY FIX 2026-04-23: System-working - "ownership society" within institutions
        PF: 4,
        // Strong Republican
        TRB: 3,
        // Moderate tribal - compassionate conservatism
        ENG: 3,
        // Projected citizen-politician - rancher, not career pol
        EPS: 3,
        // Intuitionist - "gut" decision-maker, faith-based
        AES: 2,
        // Pastoral - ranch, folksy, "guy you'd have a beer with",
        morBoundaries: { boundaries: { national: 0.12, ethnic_racial: 0.05, religious: 0.05, class: 0.05, ideological: 0.24, gender: 0.07, political_tribe: 0.75 }, intensity: 2.25 },
        moralCircle: { universalAffinity: 73, scopedAffinities: { national: 12, religious: 5, ethnic_racial: 5, class: 5, gender: 7, ideological: 75 } },
        morMembership: { ethnic_racial: "white", religious: "Protestant", class: "upper", gender: "male", political_tribe: "R" }
      },
      {
        name: "Nader",
        party: "Independent",
        year: 2e3,
        // Recalibrated 2026-04-26: previous encoding (MAT=1, PRO=1, ONT_S=1)
        // misread Nader as anti-systemic. Historical reality: he was a public-
        // interest LAWYER who built his career using regulatory and legal
        // INSTITUTIONS (auto safety regulations, FTC, consumer-protection
        // statutes). His "two parties, same corporate masters" critique was
        // about CURRENT party-system capture, not institutional nihilism in
        // principle. MAT 1→2 (progressive consumer-protection / anti-corporate,
        // not revolutionary). PRO 1→4 (legalistic, used statutory + regulatory
        // mechanisms). ONT_S 1→3 (current institutions corrupted by corporate
        // capture but reformable via legal/regulatory action — mid, not low).
        MAT: 2,
        // Progressive anti-corporate - consumer protection, regulation, not class-revolutionary
        CD: 3,
        // Culturally moderate - dismissed identity politics as corporate distraction, consumer focus
        CU: 4,
        // Universalist-leaning - global justice, anti-corporate globalization, but not max cosmopolitan
        MOR: 4,
        // Wide moral circle - environment, consumers, workers, global poor
        PRO: 4,
        // Legalistic - public-interest law, used regulatory institutions extensively; "two-party duopoly" critique was party-system, not procedure
        COM: 1,
        // Never compromise - rejected lesser-evil voting entirely
        ZS: 5,
        // Maximum zero-sum - corporations vs people, winner-take-all corporate power
        ONT_H: 4,
        // Optimistic about human improvement via consumer protection, regulation, education
        ONT_S: 3,
        // Mid - current party system corrupt but legal/regulatory institutions can produce good change via reform
        PF: 1,
        // Anti-partisan - ran against both parties
        TRB: 1,
        // Anti-tribal - pure individual crusader, no group identity politics
        ENG: 5,
        // Maximum engagement - decades of tireless activism, consumer crusader
        EPS: 0,
        // Empiricist - data on corporate malfeasance, safety research, evidence-driven
        AES: 3,
        // Plainspoken - rumpled, sincere, no polish, refuses political theater,
        morBoundaries: { boundaries: { national: 0.05, ethnic_racial: 0.05, religious: 0.05, class: 0.05, ideological: 0.05, gender: 0.05, political_tribe: 0 }, intensity: 2 },
        moralCircle: { universalAffinity: 73, scopedAffinities: { national: 5, religious: 5, ethnic_racial: 5, class: 5, gender: 5, ideological: 5 } }
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
        MAT: 2,
        // Center-left redistribution signal - opposed Bush tax cuts, healthcare expansion
        CD: 2,
        // Culturally open mainstream Democrat, not endpoint radical
        CU: 4,
        // Pluralist/multilateral, but not open-borders or post-national maximum
        MOR: 4,
        // Broad moral concern, anti-torture, short of maximum universalist signal
        PRO: 4,
        // Proceduralist - rule of law, Geneva Conventions, Senate institutionalist
        COM: 4,
        // Compromiser - Senate dealmaker
        ZS: 2,
        // Positive-sum - multilateral cooperation
        ONT_H: 4,
        // Optimistic about human nature
        ONT_S: 4,
        // ADR-010 (2026-04-26): institutional capacity belief - Senate institutionalist, defended Geneva Conventions, multilateral institutionalism, healthcare expansion via institutions. Was 3.
        PF: 5,
        // Maximum Democrat - ran as anti-Bush
        TRB: 3,
        // Coalition Democrat plus military identity, not strongly tribal
        ENG: 5,
        // Maximum engagement - war hero running against wartime president
        EPS: 0,
        // Empiricist - nuanced, "intellectual"
        AES: 0,
        // Statesman - "reporting for duty," patrician,
        morBoundaries: { boundaries: { national: 0.12, ethnic_racial: 0.05, religious: 0.05, class: 0.34, ideological: 0.24, gender: 0.07, political_tribe: 1 }, intensity: 3 },
        moralCircle: { universalAffinity: 73, scopedAffinities: { national: 12, religious: 5, ethnic_racial: 5, class: 34, gender: 7, ideological: 100 } }
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
        ONT_S: 4,
        // POLARITY FIX 2026-04-23: System-working - defended institutions and continuity
        PF: 5,
        // Maximum partisan - Karl Rove base strategy
        TRB: 4,
        // Highly tribal - post-9/11 patriotic identity, but not max
        ENG: 5,
        // War president - maximum engagement
        EPS: 3,
        // Intuitionist - gut decisions, faith-based
        AES: 4,
        // Fighter - war president, "bring 'em on",
        morBoundaries: { boundaries: { national: 0.76, ethnic_racial: 0.16, religious: 0.41, class: 0.05, ideological: 0.34, gender: 0.09, political_tribe: 1 }, intensity: 3 },
        moralCircle: { universalAffinity: 38, scopedAffinities: { national: 76, religious: 41, ethnic_racial: 16, class: 5, gender: 9, ideological: 100 } },
        morMembership: { ethnic_racial: "white", religious: "Protestant", class: "upper", gender: "male", political_tribe: "R" }
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
        ONT_S: 4,
        // ADR-010 (2026-04-26): institutional capacity belief - constitutional law professor, ACA architect-in-waiting, faith in deliberative institutional reform. Was 3.
        PF: 3,
        // Moderate partisan - post-partisan appeal
        TRB: 2,
        // Low tribal - explicitly anti-tribal, transcended identity politics
        ENG: 5,
        // Maximum engagement - movement-building
        EPS: 0,
        // Empiricist - "what works," pragmatic progressive
        AES: 5,
        // Visionary - "yes we can," transformative rhetoric,
        morBoundaries: { boundaries: { national: 0.5, ethnic_racial: 0.2, religious: 0.15, class: 0.2, ideological: 0.4, gender: 0.1, political_tribe: 0.5 }, intensity: 2.5 },
        moralCircle: { universalAffinity: 55, scopedAffinities: { national: 50, religious: 15, ethnic_racial: 20, class: 20, gender: 10, ideological: 50 } },
        morMembership: { ethnic_racial: "Black", religious: "Protestant", class: "middle", gender: "male", political_tribe: "D" }
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
        ONT_S: 4,
        // POLARITY FIX 2026-04-23: System-working - personal responsibility within institutions
        PF: 3,
        // Moderate partisan - maverick who bucked party
        TRB: 3,
        // Mixed - war hero identity + Palin complicated it
        ENG: 5,
        // Career senator, war hero - deeply engaged
        EPS: 1,
        // Institutionalist - Senate creature
        AES: 3,
        // Authentic - straight talk, personal honor,
        morBoundaries: { boundaries: { national: 0.05, ethnic_racial: 0.05, religious: 0.05, class: 0.05, ideological: 0.1, gender: 0.07, political_tribe: 0.5 }, intensity: 2 },
        moralCircle: { universalAffinity: 55, scopedAffinities: { national: 5, religious: 5, ethnic_racial: 5, class: 5, gender: 7, ideological: 50 } }
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
        // MOR 2→4 (Phase 4, 2026-04-26). Same MOR-as-CD-content confusion:
        // "evolved on marriage equality" is CD progressive content (CD 2
        // already captures this). MOR is spatial scope; Obama's actual moral
        // scope (ACA expansion, climate cooperation, global engagement,
        // immigrant-rights stance) is wide. MOR 4.
        MAT: 2,
        // Redistributive - ACA, Buffett Rule, "you didn't build that"
        CD: 2,
        // Culturally open - supported gay marriage
        CU: 4,
        // Internationalist - but more pragmatic
        MOR: 4,
        // Wide moral circle - ACA expansion, climate cooperation, global engagement
        PRO: 4,
        // Proceduralist - institutional governance
        COM: 3,
        // Less compromising - frustrated with Congress
        ZS: 2,
        // Mostly positive-sum - but "forward" implies work needed
        ONT_H: 4,
        // Still optimistic but more seasoned
        ONT_S: 5,
        // ADR-010 (2026-04-26): maximum institutional capacity belief - ACA architect, "you didn't build that" celebrates institutional foundations, second-term doubled down on regulatory state. Was 3.
        PF: 4,
        // Stronger partisan - election mode
        TRB: 3,
        // Coalition politics
        ENG: 5,
        // Maximum engagement - incumbent running
        EPS: 0,
        // Empiricist - data-driven governance
        AES: 0,
        // Statesman - presidential, above the fray,
        morBoundaries: { boundaries: { national: 0.5, ethnic_racial: 0.25, religious: 0.15, class: 0.3, ideological: 0.45, gender: 0.15, political_tribe: 0.55 }, intensity: 2.5 },
        moralCircle: { universalAffinity: 73, scopedAffinities: { national: 50, religious: 15, ethnic_racial: 25, class: 30, gender: 15, ideological: 55 } },
        morMembership: { ethnic_racial: "Black", religious: "Protestant", class: "middle", gender: "male", political_tribe: "D" }
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
        // 2026-04-23 — POLARITY FIX. Previous ONT_S=1 with "Maximum system-working"
        // inverted the axis (1=broken, 5=working). Romney's 47% / self-reliance /
        // pro-establishment worldview is system-working, not system-broken.
        ONT_S: 4,
        // System mostly works — "47%," self-reliance, pro-establishment
        PF: 4,
        // Strong Republican
        TRB: 3,
        // Moderate tribal - business class
        ENG: 4,
        // Engaged - but projected competent manager
        EPS: 0,
        // Empiricist - consulting/business background
        AES: 1,
        // Technocrat - business turnaround specialist,
        morBoundaries: { boundaries: { national: 0.12, ethnic_racial: 0.05, religious: 0.05, class: 0.05, ideological: 0.24, gender: 0.07, political_tribe: 0.75 }, intensity: 2.25 },
        moralCircle: { universalAffinity: 73, scopedAffinities: { national: 12, religious: 5, ethnic_racial: 5, class: 5, gender: 7, ideological: 75 } },
        morMembership: { ethnic_racial: "white", religious: "Mormon", class: "upper", gender: "male", political_tribe: "R" }
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
        MAT: 4,
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
        AES: 4,
        // Fighter - "counterpuncher," combative, dominant,
        morBoundaries: { boundaries: { national: 0.85, ethnic_racial: 0.6, religious: 0.2, class: 0.15, ideological: 0.4, gender: 0.2, political_tribe: 0.85 }, intensity: 3 },
        moralCircle: { universalAffinity: 55, scopedAffinities: { national: 85, religious: 20, ethnic_racial: 60, class: 15, gender: 20, ideological: 85 } },
        morMembership: { ethnic_racial: "white", religious: "Protestant", class: "upper", gender: "male", political_tribe: "R" }
      },
      {
        // H. Clinton 2016 — MOR 2→4 (Phase 4, 2026-04-26). Same MOR-as-CD-
        // content confusion as Mondale/Dukakis/Obama 2012. "Progressive
        // morality" is CD content (CD 2 already captures this); MOR is
        // spatial scope. Clinton's wide-moral-circle stances — global
        // engagement, immigration policy, human-rights internationalism —
        // are MOR 4.
        name: "H. Clinton",
        party: "Democratic",
        year: 2016,
        MAT: 2,
        // Mildly redistributive - but Wall Street ties
        CD: 2,
        // Culturally open - "stronger together," diversity
        CU: 4,
        // Universalist - global engagement
        MOR: 4,
        // Wide moral circle - global engagement, immigration, human-rights internationalism
        PRO: 4,
        // Proceduralist - institutional, rule-following
        COM: 4,
        // Compromiser - pragmatic, deal-oriented
        ZS: 2,
        // Positive-sum - "stronger together"
        ONT_H: 4,
        // Optimistic - "when they go low, we go high" (borrowed)
        ONT_S: 5,
        // ADR-010 (2026-04-26): maximum institutional capacity belief - paradigmatic establishment institutionalist, lifelong defender of liberal institutional order, detailed policy-via-institutions platform. Was 4.
        PF: 5,
        // Maximum partisan - career Democrat
        TRB: 3,
        // Moderate tribal - broad coalition
        ENG: 5,
        // Career politician - maximum engagement
        EPS: 0,
        // Empiricist - policy wonk, detailed plans
        AES: 0,
        // Statesman - projected competence, gravitas,
        morBoundaries: { boundaries: { national: 0.4, ethnic_racial: 0.3, religious: 0.1, class: 0.3, ideological: 0.45, gender: 0.5, political_tribe: 0.7 }, intensity: 2.5 },
        moralCircle: { universalAffinity: 73, scopedAffinities: { national: 40, religious: 10, ethnic_racial: 30, class: 30, gender: 50, ideological: 70 } },
        morMembership: { ethnic_racial: "white", religious: "Protestant", class: "middle", gender: "female", political_tribe: "D" }
      },
      {
        name: "Johnson",
        party: "Independent",
        year: 2016,
        MAT: 5,
        // Maximum free-market - eliminate income tax, slash regulation
        CD: 1,
        // Maximum cultural openness - legalize marijuana, gay marriage early
        CU: 3,
        // Maximum non-interventionist - pull out of everywhere, isolationist
        MOR: 4,
        // Maximum individualist - only individual rights matter, no collective obligations
        PRO: 3,
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
        AES: 3,
        // Authentic - unpolished, mountain climber, casual,
        morBoundaries: { boundaries: { national: 0.05, ethnic_racial: 0.05, religious: 0.05, class: 0.05, ideological: 0.05, gender: 0.05, political_tribe: 0 }, intensity: 0.5 },
        moralCircle: { universalAffinity: 73, scopedAffinities: { national: 5, religious: 5, ethnic_racial: 5, class: 5, gender: 5, ideological: 5 } }
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
        ONT_S: 5,
        // ADR-010 (2026-04-26): maximum institutional capacity belief - defender of liberal institutional order, "restore norms," post-Trump institutional restoration. Was 4.
        PF: 4,
        // Strong Democrat - but bipartisan rhetoric
        TRB: 2,
        // Low tribal - broad unity appeal, "president for all Americans"
        ENG: 4,
        // Engaged - but projected calm
        EPS: 1,
        // Institutionalist - "trust the institutions"
        AES: 2,
        // Pastoral - "Scranton Joe," empathy, personal loss,
        morBoundaries: { boundaries: { national: 0.45, ethnic_racial: 0.2, religious: 0.2, class: 0.3, ideological: 0.4, gender: 0.15, political_tribe: 0.65 }, intensity: 2.5 },
        moralCircle: { universalAffinity: 73, scopedAffinities: { national: 45, religious: 20, ethnic_racial: 20, class: 30, gender: 15, ideological: 65 } },
        morMembership: { ethnic_racial: "white", religious: "Catholic", class: "middle", gender: "male", political_tribe: "D" }
      },
      {
        name: "Trump",
        party: "Republican",
        year: 2020,
        MAT: 4,
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
        ONT_S: 2,
        // POLARITY FIX 2026-04-23: System broken - "deep state," "drain the swamp," system rigged
        PF: 3,
        // Moderate partisan - MAGA over GOP
        TRB: 5,
        // Maximum tribal - MAGA intensified
        ENG: 5,
        // Maximum engagement
        EPS: 3,
        // Intuitionist - gut politics
        AES: 4,
        // Fighter - "counterpuncher," grievance,
        morBoundaries: { boundaries: { national: 0.85, ethnic_racial: 0.6, religious: 0.25, class: 0.15, ideological: 0.45, gender: 0.2, political_tribe: 0.95 }, intensity: 3 },
        moralCircle: { universalAffinity: 38, scopedAffinities: { national: 85, religious: 25, ethnic_racial: 60, class: 15, gender: 20, ideological: 95 } },
        morMembership: { ethnic_racial: "white", religious: "Protestant", class: "upper", gender: "male", political_tribe: "R" }
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
        ONT_S: 2,
        // POLARITY FIX 2026-04-23: System broken - "system is rigged," institutional distrust
        PF: 4,
        // Party IS now MAGA
        TRB: 5,
        // Maximum tribal
        ENG: 5,
        // Maximum engagement
        EPS: 3,
        // Intuitionist
        AES: 4,
        // Fighter - "I am your retribution",
        morBoundaries: { boundaries: { national: 0.85, ethnic_racial: 0.6, religious: 0.3, class: 0.2, ideological: 0.5, gender: 0.2, political_tribe: 0.95 }, intensity: 3 },
        moralCircle: { universalAffinity: 38, scopedAffinities: { national: 85, religious: 30, ethnic_racial: 60, class: 20, gender: 20, ideological: 95 } },
        morMembership: { ethnic_racial: "white", religious: "Protestant", class: "upper", gender: "male", political_tribe: "R" }
      },
      {
        name: "Harris",
        party: "Democratic",
        year: 2024,
        MAT: 2,
        // Center-left economic signal - opportunity economy, housing, price-gouging rhetoric
        CD: 2,
        // Culturally open Democrat, but ran a moderated national campaign
        CU: 4,
        // Pluralist and multilateral, not maximum open-mosaic/post-national
        MOR: 4,
        // Wide moral circle - reproductive rights/global concern, short of endpoint
        PRO: 4,
        // Proceduralist - prosecutor, "rule of law"
        COM: 4,
        // Compromiser - moderate positioning
        ZS: 2,
        // Positive-sum - "joyful warrior," optimism
        ONT_H: 4,
        // Optimistic - "what can be, unburdened by what has been"
        ONT_S: 4,
        // ADR-010 (2026-04-26): institutional capacity belief - Biden-continuity establishment Democrat, prosecutor/AG/Senator institutional career. Was 3 ("mixed").
        PF: 5,
        // Maximum partisan - strong Democrat identity signaling
        TRB: 3,
        // Coalition Democratic identity without maximum tribal appeal
        ENG: 5,
        // Maximum engagement
        EPS: 1,
        // Institutionalist - prosecutor, DA, AG
        AES: 1,
        // Technocrat - policy-focused,
        morBoundaries: { boundaries: { national: 0.4, ethnic_racial: 0.4, religious: 0.1, class: 0.3, ideological: 0.45, gender: 0.45, political_tribe: 0.65 }, intensity: 2.5 },
        moralCircle: { universalAffinity: 73, scopedAffinities: { national: 40, religious: 10, ethnic_racial: 40, class: 30, gender: 45, ideological: 65 } },
        morMembership: { ethnic_racial: "Black", religious: "Protestant", class: "middle", gender: "female", political_tribe: "D" }
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
      dormant: ["CD", "CU", "MOR", "ZS"],
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
      nodeWeights: { PRO: 2, MAT: 1.5, MOR: 1.3, COM: 1.5 },
      intensity: 0.9,
      description: "Washington reelected; Hamilton vs Jefferson factions crystallizing beneath the surface"
    },
    issueLandscape: {
      primaryAxis: ["PRO", "MAT", "COM"],
      secondaryAxis: ["ONT_H", "ONT_S", "MOR", "ENG"],
      dormant: ["CD", "CU", "ZS"],
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
      nodeWeights: { PRO: 1.8, MAT: 1.5, CD: 1.3, MOR: 1.2 },
      intensity: 1,
      description: "First contested election; Jay Treaty anger; institutional stability matters most"
    },
    issueLandscape: {
      primaryAxis: ["PRO", "MAT", "CD"],
      secondaryAxis: ["MOR", "COM", "ENG"],
      dormant: ["CU", "ZS", "ONT_S", "ONT_H"],
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
      nodeWeights: { MOR: 2, ONT_S: 4, CD: 1.8, MAT: 1.5, CU: 1.5 },
      intensity: 1.5,
      description: "Alien & Sedition Acts; partisan warfare; both sides fear the republic will die if they lose"
    },
    issueLandscape: {
      primaryAxis: ["MOR", "ONT_S", "CD"],
      secondaryAxis: ["MAT", "CU", "ONT_H"],
      dormant: ["PRO", "COM", "ZS", "ENG"],
      description: "Liberty vs order; Sedition Acts make free speech THE issue; existential partisan conflict"
    },
    candidateActivations: [
      {
        candidateName: "Jefferson",
        activationNodes: { ONT_S: 5.5, CU: 1.5, ONT_H: 1.3, MOR: 1.3 },
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
      nodeWeights: { ONT_H: 1.5, MAT: 1.3, MOR: 0.7 },
      intensity: 0.8,
      description: "Louisiana Purchase vindicates Jefferson; national optimism; Federalists crumbling"
    },
    issueLandscape: {
      primaryAxis: ["ONT_H", "MAT", "CU"],
      secondaryAxis: ["CD", "PRO", "ONT_S", "ENG"],
      dormant: ["MOR", "COM", "ZS"],
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
      dormant: ["MOR", "COM", "ONT_H"],
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
      nodeWeights: { ZS: 2.5, MOR: 2, ONT_S: 5.8, ENG: 1.5, MAT: 1.3 },
      intensity: 1.3,
      description: "Nation at war with Britain; security and national survival dominate the election"
    },
    issueLandscape: {
      primaryAxis: ["ZS", "MOR", "ONT_S"],
      secondaryAxis: ["MAT", "ENG", "PRO"],
      dormant: ["CD", "CU", "COM", "ONT_H"],
      description: "War hawks vs peace faction; national honor and security override all other concerns"
    },
    candidateActivations: [
      {
        candidateName: "Madison",
        activationNodes: { ZS: 1.5, MOR: 1.3, ENG: 1.3 },
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
      nodeWeights: { COM: 1.5, ONT_H: 1.5, MOR: 0.5 },
      intensity: 0.7,
      description: "Post-war nationalism; Federalists irrelevant; one-party era beginning"
    },
    issueLandscape: {
      primaryAxis: ["COM", "ONT_H", "MAT"],
      secondaryAxis: ["PRO", "ONT_S", "ENG"],
      dormant: ["CD", "CU", "MOR", "ZS"],
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
      nodeWeights: { COM: 1.8, ONT_H: 1.5, MOR: 0.5, ZS: 0.5 },
      intensity: 0.7,
      description: "Peak national unity; Monroe Doctrine era; Missouri Compromise foreshadows trouble"
    },
    issueLandscape: {
      primaryAxis: ["COM", "ONT_H", "PRO"],
      secondaryAxis: ["MAT", "ONT_S", "ENG"],
      dormant: ["CD", "CU", "MOR", "ZS"],
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
      nodeWeights: { MOR: 1.8, ONT_S: 5.5, MAT: 1.5, ENG: 1.3 },
      intensity: 1.2,
      description: "One-party system fracturing; 4-way race driven by personality and regional identity"
    },
    issueLandscape: {
      primaryAxis: ["MAT", "MOR", "ONT_S"],
      secondaryAxis: ["PRO", "COM", "ENG"],
      dormant: ["CD", "CU", "ZS", "ONT_H"],
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
        activationNodes: { MOR: 1.5, ONT_S: 5.5, ENG: 1.5 },
        novelty: 1.5,
        threatActivation: { PRO: 1.3, COM: 1.2 }
      },
      {
        candidateName: "Crawford",
        activationNodes: { MOR: 1.3, PRO: 1.2 },
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
      nodeWeights: { MOR: 2, ONT_S: 4, ENG: 1.8, MAT: 1.5, ONT_H: 1.3 },
      intensity: 1.3,
      description: "Mass democracy arrives; common man vs establishment; 'corrupt bargain' revenge"
    },
    issueLandscape: {
      primaryAxis: ["MOR", "ONT_S"],
      secondaryAxis: ["MAT", "ENG", "ONT_H", "PRO"],
      dormant: ["CD", "CU", "ZS", "COM"],
      description: "Populism vs elitism; Jackson channels rage of the common man against Adams aristocracy"
    },
    candidateActivations: [
      {
        candidateName: "Jackson",
        activationNodes: { MOR: 1.8, ONT_S: 5.5, ENG: 1.5 },
        novelty: 1.8,
        threatActivation: { PRO: 1.5, COM: 1.3 }
      },
      {
        candidateName: "Adams",
        activationNodes: { PRO: 1.3, MAT: 1.2 },
        novelty: 0.8,
        threatActivation: { ONT_S: 5.3, MOR: 1.3 }
      }
    ]
  };
  var context1832 = {
    year: 1832,
    zeitgeist: {
      era: "jacksonian",
      nodeWeights: { MAT: 2.5, ONT_S: 4, MOR: 1.8, PRO: 1.5 },
      intensity: 1.3,
      description: "Bank War dominates; Jackson vetoes BUS; nullification crisis challenges federal authority"
    },
    issueLandscape: {
      primaryAxis: ["MAT", "ONT_S", "PRO"],
      secondaryAxis: ["MOR", "ENG", "COM"],
      dormant: ["CD", "CU", "ZS", "ONT_H"],
      description: "National Bank is THE issue; executive power vs congressional prerogative; state vs federal"
    },
    candidateActivations: [
      {
        candidateName: "Jackson",
        activationNodes: { MAT: 1.5, ONT_S: 5.5, MOR: 1.3, ENG: 1.3 },
        novelty: 1.3,
        threatActivation: { PRO: 1.5, COM: 1.3 }
      },
      {
        candidateName: "Clay",
        activationNodes: { MAT: 1.5, PRO: 1.5, COM: 1.3 },
        novelty: 1,
        threatActivation: { ONT_S: 5.3, MOR: 1.2 }
      }
    ]
  };
  var context1836 = {
    year: 1836,
    zeitgeist: {
      era: "jacksonian",
      nodeWeights: { MOR: 2, COM: 1.3 },
      intensity: 1,
      description: "Jacksonian succession; party machine vs scattered Whig opposition"
    },
    issueLandscape: {
      primaryAxis: ["MOR", "COM"],
      secondaryAxis: ["MAT", "PRO", "ENG"],
      dormant: ["CD", "CU", "ZS", "ONT_H", "ONT_S"],
      description: "Party loyalty and coalition management dominate; VB inherits Jackson's machine"
    },
    candidateActivations: [
      {
        candidateName: "Van Buren",
        activationNodes: { MOR: 1.8, COM: 1.3 },
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
      nodeWeights: { MAT: 2.5, ONT_S: 4.5, MOR: 2, ENG: 2, ZS: 1.5 },
      intensity: 1.3,
      description: "Depression of 1837 devastates the country; first mass-spectacle campaign; record turnout"
    },
    issueLandscape: {
      primaryAxis: ["MAT", "ONT_S", "ENG"],
      secondaryAxis: ["MOR", "ZS", "COM"],
      dormant: ["CD", "CU", "PRO", "ONT_H"],
      description: "Economic catastrophe drives everything; 'log cabin and hard cider' populism vs incumbent blame"
    },
    candidateActivations: [
      {
        candidateName: "Harrison",
        activationNodes: { ONT_S: 5.5, MOR: 1.5, ENG: 1.5, MAT: 1.3 },
        novelty: 1.3,
        threatActivation: { MAT: 1.3 }
      },
      {
        candidateName: "Van Buren",
        activationNodes: { MOR: 1.3, COM: 1.2 },
        novelty: 0.8,
        threatActivation: { ONT_S: 5.5, MAT: 1.3 }
      }
    ]
  };
  var context1844 = {
    year: 1844,
    zeitgeist: {
      era: "jacksonian",
      nodeWeights: { MOR: 2.5, ZS: 2, ENG: 1.5 },
      intensity: 1.2,
      description: "Manifest Destiny fever; Texas annexation; expansionist energy vs cautious establishment"
    },
    issueLandscape: {
      primaryAxis: ["MOR", "ZS", "ENG"],
      secondaryAxis: ["MAT", "ONT_S"],
      dormant: ["CD", "CU", "PRO", "COM", "ONT_H"],
      description: "Expansion and national destiny dominate; Texas and Oregon questions split along sectional lines"
    },
    candidateActivations: [
      {
        candidateName: "Polk",
        activationNodes: { MOR: 1.8, ZS: 1.5, ENG: 1.5 },
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
      nodeWeights: { MOR: 2, CU: 1.5, ONT_S: 5.5, ZS: 1.3 },
      intensity: 1.2,
      description: "Mexican War conquered new territory; slavery expansion is now unavoidable; Free Soil revolt"
    },
    issueLandscape: {
      primaryAxis: ["MOR", "ONT_S"],
      secondaryAxis: ["CU", "ZS", "ENG"],
      dormant: ["MAT", "CD", "PRO", "COM", "ONT_H"],
      description: "Wilmot Proviso and slavery in the territories; Free Soil movement fractures both parties"
    },
    candidateActivations: [
      {
        candidateName: "Taylor",
        activationNodes: { COM: 1.3, MOR: 1.2 },
        novelty: 1
      },
      {
        candidateName: "Cass",
        activationNodes: { MOR: 1.3 },
        novelty: 0.8
      },
      {
        candidateName: "Van Buren",
        activationNodes: { MOR: 1.8, ONT_S: 5.5, ENG: 1.3, CU: 1.3 },
        novelty: 1.3,
        threatActivation: { MOR: 1.3 }
      }
    ]
  };
  var context1852 = {
    year: 1852,
    zeitgeist: {
      era: "jacksonian",
      nodeWeights: { MOR: 1.8, COM: 1.5, ONT_S: 5.3 },
      intensity: 1,
      description: "Compromise of 1850 bought time but satisfied nobody; Fugitive Slave Act enrages North; Whig party fracturing"
    },
    issueLandscape: {
      primaryAxis: ["MOR", "COM"],
      secondaryAxis: ["ONT_S", "CD", "ENG"],
      dormant: ["MAT", "CU", "PRO", "ZS", "ONT_H"],
      description: "Slavery and the Compromise dominate; both parties claim to be unionist; Whigs have no clear identity"
    },
    candidateActivations: [
      {
        candidateName: "Pierce",
        activationNodes: { MOR: 1.3, COM: 1.3 },
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
      nodeWeights: { MOR: 1.8, CD: 1.5, CU: 1.5, ONT_S: 5.5, COM: 1.3 },
      intensity: 1.3,
      description: "Bleeding Kansas; slavery expansion fracturing the party system"
    },
    issueLandscape: {
      primaryAxis: ["MOR", "CD"],
      secondaryAxis: ["CU", "ONT_S", "COM", "PRO", "ZS"],
      dormant: ["MAT", "ONT_H", "ENG"],
      description: "Slavery in territories dominates; nativism a secondary current; economics irrelevant"
    },
    candidateActivations: [
      {
        candidateName: "Buchanan",
        activationNodes: { COM: 1.4, PRO: 1.3, MOR: 1.2 },
        novelty: 1,
        threatActivation: { ONT_S: 5.2 }
      },
      {
        candidateName: "Fremont",
        activationNodes: { MOR: 1.5, CU: 1.4, ONT_S: 5.3 },
        novelty: 1.5,
        threatActivation: { MOR: 1.5, CD: 1.4 }
      },
      {
        candidateName: "Fillmore",
        activationNodes: { CD: 1.5, MOR: 1.5, ZS: 1.3 },
        novelty: 0.8,
        threatActivation: { CU: 1.3 }
      }
    ]
  };
  var context1860 = {
    year: 1860,
    zeitgeist: {
      era: "sectional",
      nodeWeights: { MOR: 2, ONT_S: 4, CD: 1.8, CU: 1.5, ZS: 1.5 },
      intensity: 1.5,
      description: "Nation fracturing over slavery; secession looming; existential stakes"
    },
    issueLandscape: {
      primaryAxis: ["MOR", "ONT_S"],
      secondaryAxis: ["CD", "CU", "PRO", "ZS"],
      dormant: ["MAT", "COM", "ONT_H", "ENG"],
      description: "Slavery expansion is THE issue; economic policy irrelevant; party system shattering"
    },
    candidateActivations: [
      {
        candidateName: "Lincoln",
        activationNodes: { MOR: 1.5, CU: 1.3, PRO: 1.2 },
        novelty: 1.8,
        threatActivation: { MOR: 1.5, CD: 1.3 }
      },
      {
        candidateName: "Douglas",
        activationNodes: { COM: 1.3, PRO: 1.2 },
        novelty: 1
      },
      {
        candidateName: "Breckinridge",
        activationNodes: { MOR: 1.8, CD: 1.5, ZS: 1.3 },
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
      nodeWeights: { MOR: 2.5, ZS: 2, ONT_S: 4, ENG: 1.8, CD: 1.5 },
      intensity: 1.5,
      description: "Civil War raging; emancipation now a war aim; Union survival at stake"
    },
    issueLandscape: {
      primaryAxis: ["MOR", "ZS"],
      secondaryAxis: ["ONT_S", "CD", "ENG", "PRO"],
      dormant: ["MAT", "CU", "COM", "ONT_H"],
      description: "War vs. peace; emancipation vs. restoration; total commitment vs. negotiation"
    },
    candidateActivations: [
      {
        candidateName: "Lincoln",
        activationNodes: { MOR: 1.8, ENG: 1.5, ONT_S: 5.4, CU: 1.3 },
        novelty: 1.5,
        threatActivation: { ZS: 1.3, MOR: 1.3 }
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
      nodeWeights: { MOR: 2, CD: 1.8, CU: 1.5, ONT_S: 5.5, ZS: 1.5 },
      intensity: 1.3,
      description: "Reconstruction underway; 14th Amendment; KKK violence; freedmen's rights contested"
    },
    issueLandscape: {
      primaryAxis: ["MOR", "CD"],
      secondaryAxis: ["CU", "ONT_S", "ZS", "PRO"],
      dormant: ["MAT", "COM", "ONT_H", "ENG"],
      description: "Reconstruction and Black rights dominate; racial hierarchy vs. equal citizenship"
    },
    candidateActivations: [
      {
        candidateName: "Grant",
        activationNodes: { MOR: 1.4, PRO: 1.3, CU: 1.3 },
        novelty: 1.5,
        threatActivation: { MOR: 1.2 }
      },
      {
        candidateName: "Seymour",
        activationNodes: { MOR: 1.6, CD: 1.5, ZS: 1.4 },
        novelty: 0.8,
        threatActivation: { MOR: 1.5, CU: 1.4, ONT_S: 5.3 }
      }
    ]
  };
  var context1872 = {
    year: 1872,
    zeitgeist: {
      era: "reconstruction",
      nodeWeights: { PRO: 1.5, MOR: 1.3, ONT_S: 5.3, COM: 1.3 },
      intensity: 0.9,
      description: "Reconstruction fatigue; corruption scandals; Liberal Republican revolt"
    },
    issueLandscape: {
      primaryAxis: ["PRO", "COM", "ONT_S"],
      secondaryAxis: ["MOR", "CD", "CU"],
      dormant: ["MAT", "ZS", "ONT_H", "ENG"],
      description: "Corruption vs. clean government; reconciliation vs. continued Reconstruction"
    },
    candidateActivations: [
      {
        candidateName: "Grant",
        activationNodes: { MOR: 1.3 },
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
      nodeWeights: { PRO: 1.8, ONT_S: 5.5, MOR: 1.3, COM: 1.3 },
      intensity: 1.2,
      description: "Reconstruction winding down; Grant scandals; reform movement ascendant"
    },
    issueLandscape: {
      primaryAxis: ["PRO", "ONT_S", "MOR"],
      secondaryAxis: ["COM", "CD"],
      dormant: ["MAT", "CU", "ZS", "ONT_H", "ENG"],
      description: "Clean government vs. corruption; Reconstruction's fate decided behind closed doors"
    },
    candidateActivations: [
      {
        candidateName: "Hayes",
        activationNodes: { PRO: 1.4, MOR: 1.3, COM: 1.2 },
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
      nodeWeights: { PRO: 2, MAT: 1.5, MOR: 1.5, CD: 0.3, CU: 0.3 },
      intensity: 0.8,
      description: "Post-Reconstruction calm; patronage politics; tariff debate; low-stakes"
    },
    issueLandscape: {
      primaryAxis: ["PRO", "MAT", "MOR"],
      secondaryAxis: ["COM", "ONT_S"],
      dormant: ["CD", "CU", "ZS", "ONT_H", "ENG"],
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
        activationNodes: { COM: 1.2, MOR: 1.1 },
        novelty: 1
      }
    ]
  };
  var context1884 = {
    year: 1884,
    zeitgeist: {
      era: "gilded",
      nodeWeights: { PRO: 1.8, MOR: 1.3, MAT: 1.2, CD: 0.6 },
      intensity: 1,
      description: "Corruption vs. reform; Mugwump revolt; character matters more than policy"
    },
    issueLandscape: {
      primaryAxis: ["PRO", "MOR", "COM"],
      secondaryAxis: ["MAT", "CD"],
      dormant: ["CU", "ZS", "ONT_H", "ONT_S", "ENG"],
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
        activationNodes: { MOR: 1.4, ENG: 1.3 },
        novelty: 1,
        threatActivation: { PRO: 1.4 }
      }
    ]
  };
  var context1888 = {
    year: 1888,
    zeitgeist: {
      era: "gilded",
      nodeWeights: { MAT: 1.5, PRO: 1.3, MOR: 1.3, CD: 0.5 },
      intensity: 0.8,
      description: "Tariff is THE issue; patronage politics; honest but boring"
    },
    issueLandscape: {
      primaryAxis: ["MAT", "PRO", "MOR"],
      secondaryAxis: ["COM", "CU"],
      dormant: ["CD", "ZS", "ONT_H", "ONT_S", "ENG"],
      description: "Tariff reduction vs. protection; party organization and patronage; low moral stakes"
    },
    candidateActivations: [
      {
        candidateName: "Harrison",
        activationNodes: { MAT: 1.3, MOR: 1.3 },
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
      nodeWeights: { MAT: 1.8, ONT_S: 5.8, ZS: 1.5, MOR: 1.5, ENG: 1.3 },
      intensity: 1.1,
      description: "Agrarian revolt; Homestead Strike; Populist insurgency; economic anxiety rising"
    },
    issueLandscape: {
      primaryAxis: ["MAT", "ONT_S", "ZS"],
      secondaryAxis: ["MOR", "ENG", "COM"],
      dormant: ["CD", "CU", "PRO", "ONT_H"],
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
        activationNodes: { MAT: 1.2, MOR: 1.3 },
        novelty: 0.8
      },
      {
        candidateName: "Weaver",
        activationNodes: { ONT_S: 5.6, ZS: 1.5, MOR: 1.5, MAT: 1.4, ENG: 1.4 },
        novelty: 1.5,
        threatActivation: { MAT: 1.3, ONT_S: 5.3 }
      }
    ]
  };
  var context1896 = {
    year: 1896,
    zeitgeist: {
      era: "progressive",
      nodeWeights: { MAT: 2, PRO: 1.5, MOR: 1.5 },
      intensity: 1.2,
      description: "Realignment: gold vs. silver; industrial capitalism vs. agrarian populism; Panic of 1893 aftermath"
    },
    issueLandscape: {
      primaryAxis: ["MAT", "PRO", "MOR"],
      secondaryAxis: ["ONT_S", "CD", "COM"],
      dormant: ["CU", "ZS", "ONT_H", "ENG"],
      description: "Economic policy dominates; McKinley's 'full dinner pail' vs Bryan's silver populism"
    },
    candidateActivations: [
      {
        candidateName: "McKinley",
        activationNodes: { MAT: 1.5, PRO: 1.5, MOR: 1.3, COM: 1.3 },
        novelty: 1.2,
        threatActivation: { ONT_S: 5.3 }
      },
      {
        candidateName: "Bryan",
        activationNodes: { ONT_S: 5.3, MOR: 1.2 },
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
      secondaryAxis: ["ZS", "CD", "ENG"],
      dormant: ["PRO", "COM", "ONT_H", "ONT_S"],
      description: "Imperialism (Philippines) joins economic debate; prosperity vs. populism rematch"
    },
    candidateActivations: [
      {
        candidateName: "McKinley",
        activationNodes: { MAT: 1.3, CU: 1.2, MOR: 1.2 },
        novelty: 1
      },
      {
        candidateName: "Bryan",
        activationNodes: { MOR: 1.4, CU: 1.3, ZS: 1.3, ENG: 1.3 },
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
      dormant: ["CD", "PRO", "COM"],
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
      nodeWeights: { ONT_S: 5.5, MAT: 1.5, PRO: 1.3, ONT_H: 1.3, MOR: 0.6 },
      intensity: 0.9,
      description: "Progressive reforms mainstreaming; TR's heir vs. the Great Commoner; reform consensus"
    },
    issueLandscape: {
      primaryAxis: ["ONT_S", "MAT", "PRO"],
      secondaryAxis: ["ONT_H", "MOR", "COM", "ENG"],
      dormant: ["CD", "CU", "ZS"],
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
      nodeWeights: { ONT_S: 4, MAT: 1.8, ONT_H: 1.8, MOR: 1.5, ENG: 1.5 },
      intensity: 1.3,
      description: "Peak Progressive era; three-way reform debate; party system fracturing; high engagement"
    },
    issueLandscape: {
      primaryAxis: ["ONT_S", "MAT", "ONT_H"],
      secondaryAxis: ["MOR", "ENG", "PRO"],
      dormant: ["CD", "CU", "ZS", "COM"],
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
        threatActivation: { PRO: 1.3, MOR: 1.3 }
      },
      {
        candidateName: "Taft",
        activationNodes: { PRO: 1.4, MOR: 1.3 },
        novelty: 0.8
      }
    ]
  };
  var context1916 = {
    year: 1916,
    zeitgeist: {
      era: "progressive",
      nodeWeights: { ZS: 1.8, CU: 1.5, MAT: 1.5, MOR: 1.3, ONT_S: 5.3 },
      intensity: 1.2,
      description: "European war looming; neutrality vs. preparedness; Progressive legislation at home"
    },
    issueLandscape: {
      primaryAxis: ["ZS", "CU", "MAT"],
      secondaryAxis: ["MOR", "ONT_S", "PRO"],
      dormant: ["CD", "COM", "ONT_H", "ENG"],
      description: "War and peace dominate; Progressive reforms continue; party reunification for GOP"
    },
    candidateActivations: [
      {
        candidateName: "Wilson",
        activationNodes: { MAT: 1.3, MOR: 1.3, CU: 1.2, ONT_S: 5.2 },
        novelty: 1,
        threatActivation: { ZS: 1.3, MOR: 1.2 }
      },
      {
        candidateName: "Hughes",
        activationNodes: { PRO: 1.3, ZS: 1.2, MOR: 1.3 },
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
      dormant: ["CU", "MOR", "ZS", "ONT_H", "ENG"],
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
      nodeWeights: { MAT: 1.3, ONT_S: 5.4, MOR: 0.7 },
      intensity: 0.8,
      description: "Prosperity + KKK controversy + Progressive insurgency fragmenting politics"
    },
    issueLandscape: {
      primaryAxis: ["MAT", "ONT_S", "CD"],
      secondaryAxis: ["MOR", "PRO", "COM", "CU"],
      dormant: ["ZS", "ONT_H", "ENG"],
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
        activationNodes: { MAT: 1.5, ONT_S: 5.6, COM: 0.7, MOR: 0.7 },
        novelty: 1.5,
        threatActivation: { MAT: 1.3, ONT_S: 5.3 }
      }
    ]
  };
  var context1928 = {
    year: 1928,
    zeitgeist: {
      era: "normalcy",
      nodeWeights: { CD: 1.8, MOR: 1.5 },
      intensity: 0.9,
      description: "Peak 1920s prosperity but deep urban-rural cultural divide over religion and prohibition"
    },
    issueLandscape: {
      primaryAxis: ["CD", "MOR"],
      secondaryAxis: ["MAT", "CU", "PRO", "ONT_H"],
      dormant: ["COM", "ZS", "ONT_S", "ENG"],
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
        activationNodes: { CD: 1.4, MOR: 1.5, CU: 1.3 },
        novelty: 1.4,
        threatActivation: { CD: 1.5, MOR: 1.4 }
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
      dormant: ["CD", "CU", "MOR"],
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
      nodeWeights: { MAT: 2.2, ONT_S: 5.8, MOR: 1.5 },
      intensity: 1.3,
      description: "New Deal as referendum; labor vs. business class warfare; party realignment solidifying"
    },
    issueLandscape: {
      primaryAxis: ["MAT", "ONT_S", "MOR"],
      secondaryAxis: ["ZS", "ONT_H", "PRO"],
      dormant: ["CD", "CU", "COM", "ENG"],
      description: "Pure economics and class: New Deal populism vs. free enterprise; labor vs. business"
    },
    candidateActivations: [
      {
        candidateName: "Roosevelt",
        activationNodes: { MAT: 1.5, ONT_S: 5.4, MOR: 1.4, ENG: 1.3 },
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
      dormant: ["CD", "ONT_H", "ENG"],
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
      nodeWeights: { CU: 2, ZS: 1.5, MOR: 1.5, ENG: 1.3 },
      intensity: 1.3,
      description: "World War raging; D-Day; national unity but war fatigue setting in"
    },
    issueLandscape: {
      primaryAxis: ["CU", "ZS", "MOR"],
      secondaryAxis: ["MAT", "PRO", "ENG"],
      dormant: ["CD", "COM", "ONT_H", "ONT_S"],
      description: "War leadership dominates; 'don't change horses midstream' vs. four-term fatigue"
    },
    candidateActivations: [
      {
        candidateName: "Roosevelt",
        activationNodes: { CU: 1.4, MOR: 1.3, ENG: 1.2 },
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
      nodeWeights: { CD: 1.6, MOR: 1.8, CU: 1.4 },
      intensity: 1.2,
      description: "Cold War begins; civil rights emerging; Dixiecrat revolt fractures New Deal coalition"
    },
    issueLandscape: {
      primaryAxis: ["CD", "MOR"],
      secondaryAxis: ["CU", "MAT", "ZS"],
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
        activationNodes: { CD: 1.6, MOR: 1.8 },
        novelty: 1.3,
        threatActivation: { CD: 1.5, MOR: 1.5 }
      }
    ]
  };
  var context1952 = {
    year: 1952,
    zeitgeist: {
      era: "consensus",
      nodeWeights: { ZS: 1.6, CU: 1.4, MOR: 1.3, ONT_S: 5.2 },
      intensity: 1.1,
      description: "Korean War stalemate; McCarthyism; Cold War anxiety; desire for steady leadership"
    },
    issueLandscape: {
      primaryAxis: ["ZS", "CU", "MOR"],
      secondaryAxis: ["MAT", "PRO", "ONT_S", "CD"],
      dormant: ["COM", "ONT_H", "ENG"],
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
      dormant: ["MOR", "COM", "ONT_S", "ENG"],
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
      nodeWeights: { CU: 1.5, ZS: 1.4, CD: 1.3, MOR: 1.3 },
      intensity: 1.1,
      description: "Cold War missile gap; TV debates transform politics; Catholic question resurfaces"
    },
    issueLandscape: {
      primaryAxis: ["CU", "ZS", "CD"],
      secondaryAxis: ["MOR", "MAT", "ONT_H", "ENG"],
      dormant: ["PRO", "COM", "ONT_S"],
      description: "Cold War competition + generational change; Catholic identity as cultural flashpoint"
    },
    candidateActivations: [
      {
        candidateName: "Kennedy",
        activationNodes: { CU: 1.3, ONT_H: 1.4, ENG: 1.4, CD: 1.2 },
        novelty: 1.5,
        threatActivation: { CD: 1.3, MOR: 1.2 }
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
      dormant: ["CU", "ONT_H", "ENG"],
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
      nodeWeights: { CD: 2, ONT_S: 4, MOR: 1.8, ZS: 1.8 },
      intensity: 1.4,
      description: "Vietnam, MLK/RFK assassinated, riots, convention chaos; nation coming apart"
    },
    issueLandscape: {
      primaryAxis: ["CD", "ONT_S", "ZS"],
      secondaryAxis: ["MOR", "ENG"],
      dormant: ["MAT", "CU", "PRO", "COM", "ONT_H"],
      description: "Law and order vs chaos; cultural backlash dominates; progressive idealism suppressed"
    },
    candidateActivations: [
      {
        candidateName: "Nixon",
        activationNodes: { CD: 1.6, ZS: 1.5, MOR: 1.4, ONT_S: 5.3 },
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
        activationNodes: { CD: 1.5, MOR: 1.5 },
        novelty: 1.3
      }
    ]
  };
  var context1972 = {
    year: 1972,
    zeitgeist: {
      era: "upheaval",
      nodeWeights: { CD: 1.8, CU: 1.5, MOR: 1.5 },
      intensity: 1.1,
      description: "Vietnam winding down but cultural revolution deepens; New Left vs. Silent Majority"
    },
    issueLandscape: {
      primaryAxis: ["CD", "CU", "MOR"],
      secondaryAxis: ["MAT", "ONT_S", "ZS"],
      dormant: ["PRO", "COM", "ONT_H", "ENG"],
      description: "Cultural identity war: counterculture vs. traditional America; Vietnam as cultural proxy"
    },
    candidateActivations: [
      {
        candidateName: "Nixon",
        activationNodes: { CD: 1.3, MOR: 1.3, COM: 1.2 },
        novelty: 1
      },
      {
        candidateName: "McGovern",
        activationNodes: { CU: 1.5, MOR: 1.4, ONT_S: 5.4, ONT_H: 1.3 },
        novelty: 1.3,
        threatActivation: { CD: 1.5, MOR: 1.4 }
      }
    ]
  };
  var context1976 = {
    year: 1976,
    zeitgeist: {
      era: "upheaval",
      nodeWeights: { PRO: 2, ONT_S: 5.6, MOR: 1.3 },
      intensity: 1.1,
      description: "Post-Watergate crisis of trust; voters want honesty and procedural integrity"
    },
    issueLandscape: {
      primaryAxis: ["PRO", "ONT_S", "MOR"],
      secondaryAxis: ["MAT", "COM", "CD", "ENG"],
      dormant: ["CU", "ZS", "ONT_H"],
      description: "Integrity and institutional trust dominate; process and character over policy"
    },
    candidateActivations: [
      {
        candidateName: "Carter",
        activationNodes: { PRO: 1.5, ONT_S: 5.3, MOR: 0.7 },
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
      dormant: ["MOR", "PRO", "COM"],
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
        activationNodes: { MOR: 0.7, PRO: 1.3, COM: 1.2 },
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
      dormant: ["MOR", "PRO", "COM", "ENG"],
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
      dormant: ["COM", "ONT_H", "ONT_S", "ENG"],
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
      nodeWeights: { MAT: 1.8, ONT_S: 5.5, MOR: 0.7, CU: 1.3 },
      intensity: 1.1,
      description: "Recession, end of Cold War identity vacuum, generational change; Perot disruption"
    },
    issueLandscape: {
      primaryAxis: ["MAT", "ONT_S", "CU"],
      secondaryAxis: ["CD", "COM", "ZS", "ENG"],
      dormant: ["MOR", "PRO", "ONT_H"],
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
        activationNodes: { MAT: 1.3, ONT_S: 5.5, MOR: 0.6, ZS: 1.4 },
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
      dormant: ["MOR", "ZS", "ONT_S", "ENG"],
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
      dormant: ["ZS", "ONT_S", "ENG"],
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
      nodeWeights: { ZS: 2, MOR: 1.8, CD: 1.5, CU: 1.4, ENG: 1.3 },
      intensity: 1.3,
      description: "Post-9/11 security election; Iraq War divides; 'with us or against us' framing"
    },
    issueLandscape: {
      primaryAxis: ["ZS", "MOR", "CU"],
      secondaryAxis: ["CD", "PRO", "ENG"],
      dormant: ["MAT", "COM", "ONT_H", "ONT_S"],
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
        activationNodes: { ZS: 1.5, MOR: 1.4, CD: 1.3, ENG: 1.3 },
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
      dormant: ["MOR", "PRO", "COM"],
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
      nodeWeights: { MAT: 1.5, ONT_S: 5.4, MOR: 1.3 },
      intensity: 1,
      description: "Slow recovery; ACA as lightning rod; growing polarization; '47%' crystallizes class divide"
    },
    issueLandscape: {
      primaryAxis: ["MAT", "ONT_S", "MOR"],
      secondaryAxis: ["CD", "COM"],
      dormant: ["CU", "PRO", "ZS", "ONT_H", "ENG"],
      description: "Role of government in recovery; class divide; partisan identity sharpens"
    },
    candidateActivations: [
      {
        candidateName: "Obama",
        activationNodes: { MAT: 1.3, CD: 1.2, MOR: 1.3 },
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
      nodeWeights: { CD: 2, MOR: 2, ONT_S: 5.8, ZS: 1.6, ENG: 1.4 },
      intensity: 1.4,
      description: "Populist revolt; cultural backlash; institutional distrust; realignment-level disruption"
    },
    issueLandscape: {
      primaryAxis: ["CD", "MOR", "ONT_S"],
      secondaryAxis: ["ZS", "MAT", "ENG"],
      dormant: ["CU", "PRO", "COM", "ONT_H"],
      description: "Cultural identity and system legitimacy; populism vs. establishment; 'drain the swamp'"
    },
    candidateActivations: [
      {
        candidateName: "Trump",
        activationNodes: { CD: 1.6, MOR: 1.6, ONT_S: 5.5, ZS: 1.5, ENG: 1.4 },
        novelty: 1.8,
        threatActivation: { CD: 1.5, PRO: 1.5, MOR: 1.3, ONT_S: 5.3 }
      },
      {
        candidateName: "Clinton",
        activationNodes: { PRO: 1.3, CU: 1.2, MAT: 1.2 },
        novelty: 1.2,
        threatActivation: { CD: 1.3, MOR: 1.2 }
      }
    ]
  };
  var context2020 = {
    year: 2020,
    zeitgeist: {
      era: "polarization",
      nodeWeights: { CD: 2, ONT_S: 4, PRO: 1.8, MOR: 1.8, ENG: 1.5 },
      intensity: 1.5,
      description: "COVID pandemic + racial justice protests + democratic norms crisis; existential framing on both sides"
    },
    issueLandscape: {
      primaryAxis: ["PRO", "ONT_S", "CD"],
      secondaryAxis: ["MOR", "MAT", "ENG"],
      dormant: ["CU", "ZS", "COM", "ONT_H"],
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
        activationNodes: { CD: 1.5, MOR: 1.6, ONT_S: 5.5, ENG: 1.4 },
        novelty: 1.2,
        threatActivation: { PRO: 1.6, MOR: 1.4, CD: 1.5, ONT_S: 5.4 }
      }
    ]
  };
  var context2024 = {
    year: 2024,
    zeitgeist: {
      era: "polarization",
      nodeWeights: { PRO: 1.8, CD: 1.8, MOR: 1.8, ONT_S: 5.6, MAT: 1.5, ENG: 1.5 },
      intensity: 1.4,
      description: "Post-January 6 democracy fears + inflation + historic candidates on both sides; existential framing"
    },
    issueLandscape: {
      primaryAxis: ["PRO", "CD", "MAT"],
      secondaryAxis: ["MOR", "ONT_S", "ENG"],
      dormant: ["CU", "ZS", "COM", "ONT_H"],
      description: "Democracy vs. authoritarianism framing + economy/inflation + cultural identity war"
    },
    candidateActivations: [
      {
        candidateName: "Trump",
        activationNodes: { CD: 1.5, MOR: 1.6, ONT_S: 5.5, MAT: 1.3, ENG: 1.4 },
        novelty: 1.3,
        threatActivation: { PRO: 1.7, MOR: 1.4, CD: 1.4, ONT_S: 5.4 }
      },
      {
        candidateName: "Harris",
        activationNodes: { PRO: 1.4, MOR: 1.3, CD: 1.3, ENG: 1.3 },
        novelty: 1.4,
        threatActivation: { CD: 1.4, MOR: 1.3 }
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
  var TOTAL_CAP = 0.2;
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
  var TRB_ANCHOR_BY_CANDIDATE = {
    // Modern-era — strongest signals
    "Trump_2016": "national",
    "Trump_2020": "national",
    "Trump_2024": "national",
    "Sanders_2016": "class",
    "Sanders_2016_primary": "class",
    // not in main set but reserved
    "H. Clinton_2016": "ideological",
    "Obama_2008": "ideological",
    "Obama_2012": "ideological",
    "Biden_2020": "national",
    "Harris_2024": "ideological",
    "Romney_2012": "ideological",
    "McCain_2008": "national",
    "Bush_2000": "religious",
    "Bush_2004": "religious",
    "Bush_1988": "national",
    "Bush_1992": "national",
    "Reagan_1980": "ideological",
    "Reagan_1984": "ideological",
    "Carter_1976": "religious",
    "Carter_1980": "religious",
    "Goldwater_1964": "ideological",
    "Johnson_1964": "class",
    "Kennedy_1960": "national",
    "Nixon_1968": "national",
    "Nixon_1972": "national",
    "Roosevelt_1932": "class",
    "Roosevelt_1936": "class",
    "Roosevelt_1940": "class",
    "Roosevelt_1944": "class",
    "Truman_1948": "class",
    "Eisenhower_1952": "national",
    "Eisenhower_1956": "national",
    "Wallace_1968": "ethnic_racial",
    // segregationist
    "Thurmond_1948": "ethnic_racial",
    // Dixiecrat
    // Third party / independent
    "Nader_2000": "ideological",
    "Perot_1992": "class",
    "Perot_1996": "class",
    "Anderson_1980": "ideological"
  };
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
  function getCandidateAnchor(cand) {
    const key = `${cand.name}_${cand.year}`;
    return TRB_ANCHOR_BY_CANDIDATE[key] ?? null;
  }
  function anchorDistanceContribution(cand, anchorDist) {
    if (!anchorDist) return { contribution: 0, weight: 0 };
    const anchor = getCandidateAnchor(cand);
    if (!anchor) return { contribution: 0, weight: 0 };
    const idx = TRB_ANCHOR_ORDER2.indexOf(anchor);
    if (idx < 0) return { contribution: 0, weight: 0 };
    const userMass = anchorDist[idx] ?? 0;
    const baseSal = 0.7;
    const effectiveSal = Math.pow(baseSal, SALIENCE_POWER);
    const diff2 = (1 - userMass) * 4;
    return { contribution: effectiveSal * diff2, weight: effectiveSal };
  }
  var PARTY_LOYALTY_BASE = (() => {
    const env = "5";
    if (env === void 0) return 5;
    const n = Number(env);
    return Number.isFinite(n) && n >= 0 ? n : 5;
  })();
  function candidatePartyToCanonical(party) {
    if (party === "Democratic" || party === "Democratic-Republican" || party === "Free Soil" || party === "Dixiecrat") return "D";
    if (party === "Republican" || party === "National Republican" || party === "Federalist" || party === "Whig") return "R";
    if (party === "Independent" || party === "American Independent" || party === "Libertarian" || party === "Green") return "T";
    return "O";
  }
  function pfEquivalentFromMorBoundaries(state) {
    if (!state) return null;
    const pt = state.boundaries.political_tribe;
    const intensityFactor = state.intensity / 3;
    return 1 + 4 * pt * intensityFactor;
  }
  function pfEquivalentFromMoralCircle(affinity) {
    if (!affinity) return null;
    const ideo = affinity.scopedAffinities.ideological;
    if (ideo === null || ideo === void 0) return null;
    const ideoN = Math.max(0, Math.min(100, ideo)) / 100;
    const intensityFactor = Math.max(0, Math.min(1, affinity.intensity03 / 3));
    return 1 + 4 * ideoN * intensityFactor;
  }
  function partisanLoyaltyMultiplier(candidateParty, respondentParty, pfPos, electionYear) {
    if (electionYear < 1960) return 1;
    if (!respondentParty || respondentParty === "I" || respondentParty === "N" || respondentParty === "O" || respondentParty === "T") return 1;
    const candPartyKey = candidatePartyToCanonical(candidateParty);
    const userPartyKey = respondentParty === "D" ? "D" : respondentParty === "R" ? "R" : "O";
    if (candPartyKey === userPartyKey) return 1;
    const pf = Math.max(1, Math.min(5, pfPos ?? 3));
    return 1 + PARTY_LOYALTY_BASE * (pf / 5);
  }
  var NONIDEO_ENABLED = true;
  var SCORING_NODES2 = [
    "MAT",
    "CD",
    "CU",
    "MOR",
    "PRO",
    "COM",
    "ZS",
    "ONT_H",
    "ONT_S"
  ];
  var MOR_MODULE_LEGACY_NODES = ["MOR"];
  var CLEARING_BAR = {
    "apolitical": 0.95,
    "casual": 1.4,
    "engaged": 1.7,
    "highly-engaged": 1.85
  };
  var SALIENCE_POWER = (() => {
    const env = "1.1";
    if (env === void 0) return 1.1;
    const n = Number(env);
    return Number.isFinite(n) && n > 0 ? n : 1.1;
  })();
  var CATEGORICAL_BASE_SALIENCE = (() => {
    const env = "0.6";
    if (env === void 0) return 0.6;
    const n = Number(env);
    return Number.isFinite(n) && n >= 0 ? n : 0.6;
  })();
  var STYLE_DRIVEN_ELECTIONS = {
    1932: 1.4,
    1960: 1.4,
    1980: 1.5,
    2008: 1.4,
    2016: 2,
    2020: 1.7,
    2024: 1.8
  };
  var RIGHTS_VETO_CONTEXTS = {
    1824: "Jacksonian exclusion / Native removal and slavery-era citizenship",
    1828: "Jacksonian exclusion / Native removal and slavery-era citizenship",
    1832: "Jacksonian exclusion / Native removal and slavery-era citizenship",
    1836: "Jacksonian exclusion / slavery-era citizenship",
    1840: "Jacksonian exclusion / slavery-era citizenship",
    1844: "slavery expansion and equal citizenship",
    1848: "slavery expansion and equal citizenship",
    1852: "Fugitive Slave Act / slavery accommodation",
    1856: "slavery expansion and equal citizenship",
    1860: "slavery expansion and equal citizenship",
    1864: "slavery / emancipation / equal citizenship",
    1868: "Reconstruction and Black citizenship",
    1872: "Reconstruction and Black citizenship",
    1876: "Reconstruction and Black citizenship",
    1948: "segregation and civil rights",
    1964: "civil rights and segregation",
    1968: "segregation and civil rights backlash"
  };
  function clamp012(x) {
    return Math.max(0, Math.min(1, x));
  }
  function moralFloorPenalty(sig, cand, year, morBoundariesState) {
    const reason = RIGHTS_VETO_CONTEXTS[year];
    if (!reason) return { penalty: 0 };
    if (morBoundariesState && cand.morBoundaries) {
      const userLoad = boundaryLoad(morBoundariesState.boundaries);
      const userIntensity = morBoundariesState.intensity;
      const candLoad = boundaryLoad(cand.morBoundaries.boundaries);
      if (candLoad < 0.6 || userLoad > 0.4 || userIntensity < 1.5) return { penalty: 0 };
      const universalismStrength = clamp012((0.4 - userLoad) / 0.4);
      const intensityStrength = clamp012((userIntensity - 1.5) / 1.5);
      const severity2 = candLoad >= 0.85 ? 0.2 : 0;
      const penalty2 = 0.25 + 0.25 * universalismStrength + 0.25 * intensityStrength + severity2;
      return { penalty: penalty2, reason };
    }
    if (cand.MOR > 2) return { penalty: 0 };
    const mor = sig.MOR;
    if (!mor || mor.pos < 3.5 || mor.sal < 1.5) return { penalty: 0 };
    const posStrength = clamp012((mor.pos - 3.5) / 1.5);
    const salStrength = clamp012((mor.sal - 1.5) / 1.5);
    const severity = cand.MOR <= 1 ? 0.2 : 0;
    const penalty = 0.25 + 0.25 * posStrength + 0.25 * salStrength + severity;
    return { penalty, reason };
  }
  function categoricalDistance(cand, cat, nodeName, year) {
    if (!cat) return { contribution: 0, weight: 0 };
    const candIdx = cand[nodeName];
    if (candIdx == null || candIdx < 0 || candIdx >= 6) return { contribution: 0, weight: 0 };
    const alignment = cat.catDist[candIdx] ?? 0;
    const eraMult = STYLE_DRIVEN_ELECTIONS[year] ?? 1;
    const baseSal = CATEGORICAL_BASE_SALIENCE * eraMult;
    const effectiveSal = Math.pow(baseSal, SALIENCE_POWER);
    const diff2 = (1 - alignment) * 4;
    return { contribution: effectiveSal * diff2, weight: effectiveSal };
  }
  function ideologicalDistance(sig, cand, ctx, anchorDist, dominantNode, morBoundariesState, moralCircleAffinity) {
    let weightedSumSq = 0;
    let totalWeight = 0;
    const useMoralCircle = !!moralCircleAffinity && !!cand.moralCircle;
    const useMorModule = !useMoralCircle && !!morBoundariesState && !!cand.morBoundaries;
    for (const node of SCORING_NODES2) {
      if ((useMorModule || useMoralCircle) && MOR_MODULE_LEGACY_NODES.includes(node)) continue;
      const entry = sig[node];
      if (!entry) continue;
      const candPos = cand[node];
      if (candPos == null) continue;
      const rawSal = entry.sal * getActivationMultiplier(ctx.year, node);
      let effectiveSal = Math.pow(rawSal, SALIENCE_POWER);
      if (dominantNode === node) effectiveSal *= 1.5;
      const diff = entry.pos - candPos;
      weightedSumSq += effectiveSal * diff * diff;
      totalWeight += effectiveSal;
    }
    const epsSig = sig.EPS;
    const aesSig = sig.AES;
    if (epsSig?.catDist) {
      const r = categoricalDistance(cand, { catDist: epsSig.catDist }, "EPS", ctx.year);
      weightedSumSq += r.contribution;
      totalWeight += r.weight;
    }
    if (aesSig?.catDist) {
      const r = categoricalDistance(cand, { catDist: aesSig.catDist }, "AES", ctx.year);
      weightedSumSq += r.contribution;
      totalWeight += r.weight;
    }
    if (useMoralCircle) {
      const dist01 = moralCircleDistance(moralCircleAffinity, cand.moralCircle);
      const diff = dist01 * 4;
      const intensity03 = moralCircleAffinity.intensity03;
      const eraMult = getActivationMultiplier(ctx.year, "MOR");
      const rawSal = intensity03 * eraMult;
      let effectiveSal = Math.pow(rawSal, SALIENCE_POWER);
      if (dominantNode === "MOR" || dominantNode === "TRB" || dominantNode === "PF") {
        effectiveSal *= 1.5;
      }
      weightedSumSq += effectiveSal * diff * diff;
      totalWeight += effectiveSal;
    } else if (useMorModule) {
      const respBd = morBoundariesState.boundaries;
      const candBd = cand.morBoundaries.boundaries;
      const vd = morTargetVectorDistance(respBd, candBd);
      const diff = vd * 4;
      const intensity = morBoundariesState.intensity;
      const eraMult = getActivationMultiplier(ctx.year, "MOR");
      const rawSal = intensity * eraMult;
      let effectiveSal = Math.pow(rawSal, SALIENCE_POWER);
      if (dominantNode === "MOR" || dominantNode === "TRB" || dominantNode === "PF") {
        effectiveSal *= 1.5;
      }
      weightedSumSq += effectiveSal * diff * diff;
      totalWeight += effectiveSal;
    } else if (anchorDist) {
      const r = anchorDistanceContribution(cand, anchorDist);
      weightedSumSq += r.contribution;
      totalWeight += r.weight;
    }
    const ideological = totalWeight > 0 ? Math.sqrt(weightedSumSq / totalWeight) : 4;
    return ideological;
  }
  function predictVote(sig, candidates, ctx, engagement, partyID, anchorDist, negativeParties, strategicVoting, dominantNode, morBoundariesState, moralCircleAffinity) {
    const pfFromMc = pfEquivalentFromMoralCircle(moralCircleAffinity);
    const pfFromMor = pfEquivalentFromMorBoundaries(morBoundariesState);
    const pfPos = pfFromMc ?? pfFromMor ?? sig.PF?.pos ?? null;
    const scored = candidates.map((c) => {
      const baseValuesDist = ideologicalDistance(sig, c, ctx, anchorDist, dominantNode, morBoundariesState, moralCircleAffinity);
      const moralFloor = moralFloorPenalty(sig, c, ctx.year, morBoundariesState);
      const valuesDist = baseValuesDist + moralFloor.penalty;
      const nonIdeologicalModifier = NONIDEO_ENABLED ? getNonIdeologicalModifier(
        ctx.year,
        historicalToCanonical(c.name, c.year)
      ).total : 0;
      const nonIdeologicalAdjustedDistance = valuesDist - nonIdeologicalModifier;
      const loyaltyMult = partisanLoyaltyMultiplier(c.party, partyID, pfPos, ctx.year);
      let negPenalty = 1;
      if (negativeParties && ctx.year >= 1960) {
        const cp = candidatePartyToCanonical(c.party);
        if (cp === "D" && negativeParties.has("D") || cp === "R" && negativeParties.has("R") || cp === "T" && negativeParties.has("T")) {
          negPenalty = 1.8;
        }
      }
      return {
        name: c.name,
        party: c.party,
        baseIdeologicalDistance: baseValuesDist,
        moralFloorPenalty: moralFloor.penalty,
        ...moralFloor.reason ? { moralFloorReason: moralFloor.reason } : {},
        ideologicalDistance: valuesDist,
        nonIdeologicalModifier,
        nonIdeologicalAdjustedDistance,
        partisanMultiplier: loyaltyMult,
        negativePartisanshipMultiplier: negPenalty,
        distance: nonIdeologicalAdjustedDistance * loyaltyMult * negPenalty
      };
    });
    const nearestByValues = scored.reduce(
      (a, b) => a.ideologicalDistance <= b.ideologicalDistance ? a : b
    );
    let nearest = scored.reduce((a, b) => a.distance <= b.distance ? a : b);
    const clearingBar = CLEARING_BAR[engagement];
    if (strategicVoting) {
      const nearestCanon = candidatePartyToCanonical(nearest.party);
      if (nearestCanon === "T" || nearestCanon === "O") {
        const majorWithin = scored.filter((s) => {
          const k = candidatePartyToCanonical(s.party);
          return (k === "D" || k === "R") && s.distance - nearest.distance <= 0.4;
        }).sort((a, b) => a.distance - b.distance)[0];
        if (majorWithin) nearest = majorWithin;
      }
    }
    const loyaltyAbstains = nearest.distance > clearingBar;
    const ideologyClearWin = nearestByValues.nonIdeologicalAdjustedDistance <= clearingBar * 0.85;
    let decisionDistance = nearest.distance;
    if (loyaltyAbstains && ideologyClearWin && nearestByValues !== nearest) {
      nearest = nearestByValues;
      decisionDistance = nearestByValues.nonIdeologicalAdjustedDistance;
    }
    return {
      year: ctx.year,
      candidates: scored,
      clearingBar,
      nearestByValues,
      nearest,
      valuesDecision: nearestByValues.ideologicalDistance <= clearingBar ? "vote" : "abstain",
      decision: decisionDistance <= clearingBar ? "vote" : "abstain"
    };
  }

  // src/identity/archetypeLabeler.ts
  var POSITION_LEXICON = {
    MAT: { low: "Redistributionist", mid: "Mixed-Economy", high: "Free-Marketeer" },
    CD: { low: "Progressive", mid: "", high: "Traditionalist" },
    CU: { low: "Assimilationist", mid: "Civic-Pluralist", high: "Pluralist" },
    MOR: { low: "", mid: "Civic", high: "Universalist" },
    PRO: { low: "Consequentialist", mid: "Pragmatic", high: "Procedural" },
    COM: { low: "Principled", mid: "Practical", high: "Dealmaker" },
    ZS: { low: "Positive-Sum", mid: "Realist", high: "Combative" },
    ONT_H: { low: "", mid: "Tempered", high: "" },
    ONT_S: { low: "Anti-Institutional", mid: "Reformist", high: "Institutional" },
    PF: { low: "Detached", mid: "Engaged-Civic", high: "Partisan" },
    TRB: { low: "", mid: "Civic", high: "Tribal" },
    ENG: { low: "Tuned-Out", mid: "Casual", high: "Mobilized" }
  };
  var EPS_LEXICON = [
    "Empiricist",
    "Institutionalist",
    "Traditionalist",
    "Intuitionist",
    "Autonomous",
    "Nihilist"
  ];
  var AES_LEXICON = [
    "Statesman",
    "Technocrat",
    "Pastoral",
    "Authentic",
    "Fighter",
    "Visionary"
  ];
  var MORAL_CIRCLE_SCOPE_LEXICON = {
    national: "Nationalist",
    religious: "Religious-Communitarian",
    ethnic_racial: "Ethnic-Communitarian",
    class: "Class-Conscious",
    gender: "Gender-Identitarian",
    ideological: "Partisan-Communitarian"
  };
  var POSITION_LOW_MAX = 2.5;
  var POSITION_HIGH_MIN = 3.5;
  var MAX_LABEL_TOKENS = 3;
  var MORAL_CIRCLE_SCOPE_EXCESS_MIN = 20;
  var MORAL_CIRCLE_UNIVERSAL_MIN = 70;
  function continuousBin(pos) {
    if (pos <= POSITION_LOW_MAX) return "low";
    if (pos >= POSITION_HIGH_MIN) return "high";
    return "mid";
  }
  function tokenizeRespondent(state) {
    const entries = [];
    if (state.continuous) {
      for (const [node, n] of Object.entries(state.continuous)) {
        if (!n || typeof n.salience !== "number") continue;
        if (!(node in POSITION_LEXICON)) continue;
        const bin = continuousBin(n.expectedPos ?? 3);
        const lex = POSITION_LEXICON[node];
        const token = bin === "low" ? lex.low : bin === "high" ? lex.high : lex.mid;
        entries.push({ node, bin, token, salience: n.salience, isCategorical: false });
      }
    }
    const eps = state.categorical?.EPS;
    if (eps && Array.isArray(eps.catDist)) {
      const topIdx = argmax(eps.catDist);
      if (topIdx >= 0 && topIdx < EPS_LEXICON.length) {
        entries.push({
          node: "EPS",
          bin: EPS_LEXICON[topIdx],
          token: EPS_LEXICON[topIdx],
          salience: eps.salience ?? 0,
          isCategorical: true
        });
      }
    }
    const aes = state.categorical?.AES;
    if (aes && Array.isArray(aes.catDist)) {
      const topIdx = argmax(aes.catDist);
      if (topIdx >= 0 && topIdx < AES_LEXICON.length) {
        entries.push({
          node: "AES",
          bin: AES_LEXICON[topIdx],
          token: AES_LEXICON[topIdx],
          salience: aes.salience ?? 0,
          isCategorical: true
        });
      }
    }
    const mc = state.moralCircle;
    if (mc) {
      const universal = mc.universalAffinity ?? 50;
      const scopes = mc.scopedAffinities ? Object.entries(mc.scopedAffinities).filter(([, v]) => typeof v === "number").map(([scope, v]) => ({ scope, excess: Math.max(0, v - universal) })) : [];
      const maxScope = scopes.length ? scopes.reduce((a, b) => a.excess > b.excess ? a : b) : null;
      if (maxScope && maxScope.excess >= MORAL_CIRCLE_SCOPE_EXCESS_MIN) {
        const adj = MORAL_CIRCLE_SCOPE_LEXICON[maxScope.scope];
        if (adj) {
          entries.push({
            node: "MORAL_CIRCLE",
            bin: maxScope.scope,
            token: adj,
            salience: Math.min(3, mc.intensity03 ?? 0),
            isCategorical: true
          });
        }
      } else if (universal >= MORAL_CIRCLE_UNIVERSAL_MIN) {
        entries.push({
          node: "MORAL_CIRCLE",
          bin: "universal",
          token: "Universalist",
          salience: Math.min(3, (universal - 50) / 16.67),
          // 50→0, 100→3
          isCategorical: true
        });
      }
    }
    return entries;
  }
  function selectLabelTokens(entries) {
    const sorted = [...entries].sort((a, b) => {
      if (b.salience !== a.salience) return b.salience - a.salience;
      const distA = a.isCategorical ? 0 : Math.abs(positionFromBin(a.bin) - 3);
      const distB = b.isCategorical ? 0 : Math.abs(positionFromBin(b.bin) - 3);
      if (distB !== distA) return distB - distA;
      return a.node.localeCompare(b.node);
    });
    const candidates = sorted.slice(0, MAX_LABEL_TOKENS);
    const picked = [];
    for (let i = 0; i < candidates.length; i++) {
      const e = candidates[i];
      if (picked.length === 0) {
        picked.push(e);
      } else if (!e.isCategorical && e.bin === "mid") {
        continue;
      } else {
        picked.push(e);
      }
    }
    return picked;
  }
  function positionFromBin(bin) {
    if (bin === "low") return 1.5;
    if (bin === "high") return 4.5;
    if (bin === "mid") return 3;
    return 3;
  }
  function signatureOf(tokens) {
    return tokens.map((t) => `${t.node}:${t.bin}`).sort().join("|");
  }
  function composeLabel(tokens, mergerTable) {
    if (tokens.length === 0) {
      return { label: "Civic Generalist", source: "lexicon", signature: "", tokensUsed: [] };
    }
    const fullSig = signatureOf(tokens);
    if (fullSig in mergerTable) {
      return { label: mergerTable[fullSig], source: "merger-full", signature: fullSig, tokensUsed: tokens };
    }
    if (tokens.length === 3) {
      const top2 = [tokens[0], tokens[1]];
      const sig2 = signatureOf(top2);
      if (sig2 in mergerTable) {
        const merged = mergerTable[sig2];
        const leftover = tokens[2];
        const label = leftover.token ? `${leftover.token} ${merged}` : merged;
        return {
          label,
          source: "merger-partial",
          signature: sig2,
          tokensUsed: tokens
        };
      }
    }
    const emitted = tokens.filter((t) => t.token.length > 0);
    const compressed = applyCompression(emitted);
    if (compressed) {
      return {
        label: ensureNounAnchor(reorderByPOS(compressed)).map((t) => t.token).join(" "),
        source: "compression",
        signature: fullSig,
        tokensUsed: tokens
      };
    }
    if (emitted.length === 0) {
      return { label: "Civic Generalist", source: "lexicon", signature: fullSig, tokensUsed: tokens };
    }
    return {
      label: ensureNounAnchor(reorderByPOS(emitted)).map((t) => t.token).join(" "),
      source: "lexicon",
      signature: fullSig,
      tokensUsed: tokens
    };
  }
  function labelForRespondent(state, mergerTable) {
    const entries = tokenizeRespondent(state);
    const tokens = selectLabelTokens(entries);
    return composeLabel(tokens, mergerTable);
  }
  var DEFAULT_MERGER_TABLE = {
    "MAT:low|ONT_S:high": "Institutional Leftist",
    "MAT:high|ONT_S:high": "Institutional Conservative",
    "MAT:low|MORAL_CIRCLE:universal": "Rawlsian Reformer",
    "MAT:low|MORAL_CIRCLE:class": "Class-War Leftist",
    "MAT:low|COM:low": "Jacobin Egalitarian",
    "MAT:low|CD:low|MORAL_CIRCLE:national": "Progressive Civic Nationalist",
    "MAT:low|CD:low": "Progressive Leftist",
    "MAT:high|CD:high": "Conservative",
    "CD:high|MORAL_CIRCLE:national": "Heritage Guardian",
    "CD:high|MORAL_CIRCLE:religious": "Religious Traditionalist",
    "MAT:high|CD:high|ZS:high": "Combative Conservative",
    "MAT:low|ZS:high": "Combative Leftist",
    "MAT:low|AES:Fighter": "Insurgent Equalizer",
    "MAT:high|AES:Fighter": "Combative Populist",
    "CD:high|AES:Fighter": "Heritage Firebrand",
    "AES:Statesman|ONT_S:high": "Statesman Institutionalist",
    "AES:Technocrat|ONT_S:high": "Technocratic Optimizer",
    "AES:Visionary|ONT_S:low": "Visionary Insurgent",
    "AES:Visionary|MAT:low": "Visionary Progressive",
    "EPS:Empiricist|ONT_S:high": "Evidence-Based Institutionalist",
    "EPS:Empiricist|MAT:low": "Evidence-Based Progressive",
    "EPS:Traditionalist|CD:high": "Civic Traditionalist",
    "EPS:Intuitionist|AES:Fighter": "Gut-Politics Fighter",
    "COM:high|ONT_S:high": "Burkean Steward",
    "COM:low|ONT_S:low": "Disaffected Contrarian",
    "MAT:low|ONT_H:high": "Constructivist Progressive",
    "CD:high|ONT_H:low": "Essentialist Traditionalist",
    "CU:high|MORAL_CIRCLE:universal": "World-Minded Reformer",
    "CU:high|MOR:high": "Principled Cosmopolitan",
    "CD:high|CU:low": "Communitarian Traditionalist",
    "MAT:low|PF:high": "Loyal Democrat",
    "MAT:high|PF:high": "Loyal Republican",
    "AES:Fighter|PF:high": "Militant Partisan",
    "CD:high|ENG:low": "Quiet Traditionalist",
    "ENG:low|MAT:low": "Comfortable Bystander",
    "MORAL_CIRCLE:gender": "Identity-Group Activist",
    "MORAL_CIRCLE:ethnic_racial": "Identity-Group Activist",
    "CU:high|MAT:low|ONT_S:high": "Institutional Leftist",
    "MAT:low|ONT_S:high|PRO:high": "Procedural Institutional Leftist",
    "COM:high|MAT:low|ONT_S:high": "Pragmatic Institutional Leftist",
    "CD:low|CU:high|MAT:low": "Cosmopolitan Progressive",
    "CD:low|MAT:low|MOR:high": "Rawlsian Reformer",
    "CD:high|MAT:high|ONT_S:high": "Institutional Conservative",
    "CD:high|MAT:high|MORAL_CIRCLE:religious": "Religious Right",
    "CD:high|CU:low|MORAL_CIRCLE:national": "Heritage Guardian",
    "MAT:low|ONT_S:high|ZS:low": "Pluralist Structuralist",
    "CU:high|MAT:low|MOR:high": "Cosmopolitan Reformer",
    "AES:Fighter|MAT:low|MORAL_CIRCLE:class": "Class-War Fighter",
    "AES:Statesman|MAT:low|ONT_S:high": "Statesman Institutional Leftist",
    "AES:Statesman|MAT:high|ONT_S:high": "Statesman Institutional Conservative",
    "EPS:Empiricist|MAT:low|ONT_S:high": "Evidence-Based Institutional Leftist",
    "EPS:Empiricist|MAT:high|ONT_S:high": "Evidence-Based Institutional Conservative",
    "CU:high|MAT:low|MORAL_CIRCLE:universal": "Cosmopolitan Reformer",
    // Expansion pass 2 — three-token iconic mergers
    "MAT:low|MOR:high|ONT_S:high": "Liberal Internationalist",
    "MAT:high|CD:high|COM:high": "Continuity Conservative",
    "COM:low|ONT_S:low|PF:low": "Anarchist",
    "MAT:low|MOR:high|MORAL_CIRCLE:religious": "Christian Socialist",
    "AES:Statesman|MAT:low|MOR:high": "FDR-Style Statesman",
    "MAT:high|EPS:Empiricist|AES:Technocrat": "Neoliberal Wonk",
    // ──────────────────────────────────────────────────────────────────────
    // Expansion pass 3 (2026-05-12) — second-opinion review pass.
    // 47 iconic 2-3 token merger names drawn from established political
    // vocabulary (classical liberal, neoliberal, anarcho-capitalist, etc.).
    // ──────────────────────────────────────────────────────────────────────
    "CD:low|MAT:high|PRO:high": "Classical Liberal",
    "CD:low|MAT:high|ONT_S:high": "Neoliberal",
    "CD:low|MAT:high|ONT_S:low": "Anarcho-Capitalist",
    "MAT:high|ONT_S:low|PRO:low": "Anarcho-Capitalist",
    "CD:high|MAT:low|MORAL_CIRCLE:national": "National Populist",
    "CD:high|MAT:low|MORAL_CIRCLE:religious": "Christian Democrat",
    "CD:high|MAT:low|ONT_S:high": "Paternalist Conservative",
    "CD:high|MAT:high|MORAL_CIRCLE:national": "National Conservative",
    "CD:high|CU:low|MORAL_CIRCLE:religious": "Integralist",
    "CD:low|MAT:low|ONT_S:high": "Bull Moose Progressive",
    "MAT:low|MORAL_CIRCLE:class|ONT_H:high": "Marxist",
    "MAT:low|MORAL_CIRCLE:class|ONT_S:low": "Syndicalist",
    "COM:low|MAT:low|MORAL_CIRCLE:class": "Vanguardist",
    "COM:low|ENG:high|MAT:low": "Vanguardist",
    "CD:low|MAT:low|MORAL_CIRCLE:gender": "Socialist Feminist",
    "CD:low|MORAL_CIRCLE:ethnic_racial|PRO:high": "Civil-Rights Liberal",
    "CD:low|MAT:high|MORAL_CIRCLE:universal": "Cosmopolitan Liberal",
    "CD:low|CU:high|MAT:high": "Cosmopolitan Capitalist",
    "CD:high|MAT:high|PRO:high": "Constitutional Conservative",
    "CD:high|PF:high|ZS:high": "Culture Warrior",
    "CD:low|PF:high|ZS:high": "Movement Progressive",
    "CD:high|MAT:low|PF:high": "Yellow Dog Democrat",
    "MAT:mid|ONT_S:high|PRO:high": "Good-Government Reformer",
    "EPS:Institutionalist|ONT_S:high|PRO:high": "Good-Government Reformer",
    "AES:Pastoral|MAT:low|MOR:high": "Eco-Socialist",
    "AES:Pastoral|CD:low|MAT:low": "Green Progressive",
    "AES:Visionary|CD:low|MAT:low": "Utopian Socialist",
    "AES:Visionary|MAT:high|ONT_S:low": "Techno-Libertarian",
    "MAT:high|ONT_S:high|PRO:high": "Hamiltonian",
    "CD:low|COM:high|MAT:high": "Rockefeller Republican",
    "AES:Visionary|CD:high|MAT:high": "Reaganite",
    "CD:high|MAT:high|ONT_S:low": "Goldwater Conservative",
    "CD:high|MORAL_CIRCLE:national|ONT_S:low": "Paleoconservative",
    "MAT:low|MORAL_CIRCLE:religious|ONT_S:low": "Distributist",
    "CD:high|COM:high|MAT:low": "One-Nation Conservative",
    "MAT:low|MORAL_CIRCLE:national|ONT_S:high": "New Dealer",
    "AES:Fighter|MORAL_CIRCLE:national|ZS:high": "Jacksonian",
    "EPS:Institutionalist|MAT:high|ONT_S:high": "Hamiltonian"
  };
  var COMPRESSION_TABLE = {
    // Ideology axes (economy × culture)
    "CD:low|MAT:low": "Leftist",
    "CD:high|MAT:high": "Conservative",
    "CD:low|MAT:high": "Libertarian",
    "CD:high|MAT:low": "Populist-Left",
    // Economy × moral circle width
    "MAT:low|MOR:high": "Internationalist",
    "MAT:low|MOR:low": "Class-Particularist",
    "MAT:high|MOR:low": "Tribal-Capitalist",
    // Economy × institutions
    "MAT:high|ONT_S:low": "Free-Market-Disruptor",
    "MAT:low|ONT_S:low": "Anti-Capitalist-Radical",
    // Cultural axes (continuity × pluralism)
    "CD:high|CU:high": "Conservative-Pluralist",
    "CD:low|CU:high": "Cosmopolitan",
    "CD:high|CU:low": "Communitarian",
    "CD:low|CU:low": "Progressive-Unifier",
    // Cultural × moral circle
    "CU:high|MOR:low": "Provincial-Pluralist",
    "CU:low|MOR:high": "Civic-Universalist",
    // Process axes (procedure × compromise)
    "COM:high|PRO:high": "Establishment",
    "COM:low|PRO:low": "Insurgent",
    "COM:high|PRO:low": "Negotiator",
    "COM:low|PRO:high": "Hard-Liner",
    // Process × institutions
    "ONT_S:high|PRO:high": "Bureaucratic",
    "ONT_S:low|PRO:low": "Outsider",
    "COM:high|ONT_S:high": "Statesman-Style",
    "COM:low|ONT_S:low": "Antagonist",
    // Worldview (zero-sum × human nature)
    "ONT_H:low|ZS:high": "Hobbesian",
    "ONT_H:high|ZS:low": "Utopian",
    "MOR:high|ZS:low": "Idealist",
    "MOR:low|ZS:high": "Hard-Realist",
    // Worldview × institutions
    "ONT_H:high|ONT_S:high": "Social-Engineer",
    "ONT_H:low|ONT_S:low": "Reactionary",
    "ONT_S:high|ZS:low": "Cooperator",
    "ONT_S:low|ZS:high": "Cynic",
    // Conflict-style
    "AES:Fighter|ZS:high": "Militant",
    "AES:Fighter|COM:low": "Combatant",
    "AES:Fighter|MAT:high": "Populist-Right",
    "AES:Fighter|CD:high": "Reactionary-Firebrand",
    // Style × engagement
    "AES:Statesman|PF:high": "Loyal-Statesman",
    "AES:Technocrat|EPS:Empiricist": "Wonk",
    "AES:Visionary|MOR:high": "Prophet",
    "AES:Pastoral|CD:high": "Hearth-Conservative",
    "AES:Authentic|PF:high": "Plain-Partisan",
    // Epistemic × institutions
    "EPS:Empiricist|ONT_S:high": "Evidence-Institutionalist",
    "EPS:Empiricist|ONT_S:low": "Skeptic",
    "EPS:Traditionalist|ONT_S:high": "Custom-Institutionalist",
    "EPS:Intuitionist|ONT_S:low": "Gut-Outsider",
    "EPS:Autonomous|MAT:high": "Self-Reliant",
    "EPS:Nihilist|ZS:high": "Cynic",
    // Moral-circle scope compressions
    "MAT:low|MORAL_CIRCLE:national": "Civic-Nationalist-Left",
    "MAT:high|MORAL_CIRCLE:national": "Civic-Nationalist-Right",
    "MORAL_CIRCLE:national|PF:high": "Patriot-Partisan",
    "MORAL_CIRCLE:class|AES:Fighter": "Class-Fighter",
    "MORAL_CIRCLE:religious|CD:high": "Religious-Conservative",
    "MORAL_CIRCLE:universal|MAT:low": "Solidarist",
    "MORAL_CIRCLE:universal|CU:high": "Cosmopolite",
    // Engagement modifiers
    "ENG:low|MAT:high": "Quiet-Conservative",
    "ENG:low|CD:low": "Disengaged-Progressive",
    "ENG:high|PF:high": "Activist-Partisan",
    // ──────────────────────────────────────────────────────────────────────
    // Expansion pass 2 (2026-05-12) — iconic political-identity pairs that
    // the lexicon-only path was rendering awkwardly. Hyphenated compounds
    // count as one "word" in the token sequence.
    // ──────────────────────────────────────────────────────────────────────
    // Economy × compromise / dealmaker axis
    "COM:high|MAT:low": "Social-Democrat",
    "COM:high|MAT:high": "Pragmatic-Conservative",
    "COM:low|MOR:high": "Doctrinaire-Idealist",
    "COM:high|ZS:low": "Conciliator",
    // Economy × moral circle
    "MAT:high|MOR:high": "Globalist",
    "MAT:low|MORAL_CIRCLE:religious": "Liberation-Theologian",
    // Institutional reform / theocrat
    "MOR:high|ONT_S:high": "Reformer",
    "MOR:high|PRO:high": "Constitutionalist",
    "MOR:high|ONT_H:high": "Humanist",
    "MORAL_CIRCLE:religious|ONT_S:high": "Theocrat",
    // Conflict-style × moral circle
    "AES:Fighter|MOR:high": "Crusader",
    "AES:Fighter|MORAL_CIRCLE:national": "Patriot-Firebrand",
    "AES:Fighter|MORAL_CIRCLE:religious": "Religious-Firebrand",
    // Statesman archetypes
    "AES:Statesman|EPS:Traditionalist": "Old-Guard",
    "AES:Statesman|EPS:Institutionalist": "Mandarin",
    "AES:Statesman|MAT:high": "Tory",
    "AES:Statesman|MOR:high": "Internationalist-Statesman",
    // Visionary archetypes
    "AES:Visionary|MAT:high": "Mogul",
    "AES:Visionary|ONT_S:high": "Institutional-Visionary",
    "AES:Visionary|EPS:Empiricist": "Tech-Visionary",
    // Authentic / folk register
    "AES:Authentic|MAT:low": "Folk-Progressive",
    "AES:Authentic|MAT:high": "Folk-Conservative",
    // Engagement-driven activist roles
    "ENG:high|MAT:low": "Activist-Leftist",
    "ENG:high|MAT:high": "Activist-Conservative",
    "ENG:high|CD:low": "Activist-Progressive",
    // Continuity / cultural axis
    "CD:high|COM:high": "Continuity-Conservative",
    "CD:low|MOR:high": "Universalist-Progressive",
    // Identity-scope × institutional
    "MORAL_CIRCLE:class|PF:high": "Class-Partisan",
    "MORAL_CIRCLE:national|PRO:high": "Patriot-Institutionalist",
    "MORAL_CIRCLE:national|COM:high": "Patriot-Pragmatist",
    // ──────────────────────────────────────────────────────────────────────
    // Expansion pass 3 (2026-05-12) — second-opinion review pass.
    // 62 additional 2-token compressions drawn from established political
    // vocabulary. Mostly non-collision; where a sig already had an entry
    // (Heritage Guardian, Tech-Visionary), the original is kept.
    // ──────────────────────────────────────────────────────────────────────
    // Civic-republican / civic axes
    "CU:low|MORAL_CIRCLE:national": "Civic-Republican",
    "CU:high|MAT:high": "Cosmopolitan Capitalist",
    // Market / class compressions
    "MAT:high|COM:low": "Market-Fundamentalist",
    "MAT:low|ZS:low": "Social Liberal",
    "MAT:high|MORAL_CIRCLE:class": "Producerist",
    "MORAL_CIRCLE:class|ZS:high": "Class-Warrior",
    // Gender / feminism
    "CD:low|MORAL_CIRCLE:gender": "Feminist",
    "MAT:low|MORAL_CIRCLE:gender": "Socialist Feminist",
    "MORAL_CIRCLE:gender|PRO:high": "Rights Feminist",
    // Ethnic-racial
    "MORAL_CIRCLE:ethnic_racial|PRO:high": "Civil-Rights Liberal",
    "CD:low|MORAL_CIRCLE:ethnic_racial": "Civil-Rights Progressive",
    "CU:high|MORAL_CIRCLE:ethnic_racial": "Multiculturalist",
    // Religious axes
    "CD:low|MORAL_CIRCLE:religious": "Religious Progressive",
    "CU:low|MORAL_CIRCLE:religious": "Confessionalist",
    "CU:high|MORAL_CIRCLE:religious": "Interfaith-Pluralist",
    "EPS:Traditionalist|MORAL_CIRCLE:religious": "Confessionalist",
    "EPS:Traditionalist|MORAL_CIRCLE:national": "National Conservative",
    // EPS pairings
    "EPS:Institutionalist|PRO:high": "Legalist",
    "COM:high|EPS:Institutionalist": "Establishmentarian",
    "EPS:Empiricist|MAT:high": "Market Wonk",
    "EPS:Empiricist|PRO:high": "Rule-of-Law Wonk",
    "EPS:Autonomous|PF:low": "Independent",
    "EPS:Nihilist|AES:Visionary": "Accelerationist",
    "EPS:Nihilist|ONT_S:low": "Accelerationist",
    // AES pairings
    "AES:Visionary|ONT_H:high": "Futurist",
    "AES:Technocrat|MAT:low": "Social Planner",
    "AES:Technocrat|MAT:high": "Market Technocrat",
    "AES:Pastoral|MAT:low": "Agrarian Populist",
    "AES:Pastoral|MAT:high": "Agrarian Conservative",
    "AES:Pastoral|MORAL_CIRCLE:national": "Heartland Populist",
    "AES:Authentic|MORAL_CIRCLE:national": "Plainspoken Patriot",
    "AES:Fighter|CD:low": "Progressive Firebrand",
    "AES:Fighter|MORAL_CIRCLE:gender": "Feminist Firebrand",
    "AES:Fighter|MORAL_CIRCLE:ethnic_racial": "Civil-Rights Firebrand",
    "AES:Statesman|CD:low": "Liberal Statesman",
    // Partisan / movement
    "PF:high|ZS:high": "Party Warrior",
    "CD:high|ZS:high": "Culture Warrior",
    "CD:low|PF:high": "Movement Progressive",
    "CD:high|PF:high": "Movement Conservative",
    "PF:low|PRO:high": "Mugwump",
    // Engagement-activist compressions
    "ENG:low|PF:low": "Apolitical Voter",
    "ENG:high|MORAL_CIRCLE:class": "Labor Activist",
    "ENG:high|MORAL_CIRCLE:religious": "Faith Activist",
    "ENG:high|MORAL_CIRCLE:ethnic_racial": "Civil-Rights Activist",
    "ENG:high|MORAL_CIRCLE:national": "Patriot Activist",
    // Cultural / procedural
    "CD:low|PRO:high": "Civil-Libertarian",
    "CD:high|PRO:high": "Constitutional Conservative",
    "CD:low|COM:low": "Doctrinaire Progressive",
    "CD:high|COM:low": "Doctrinaire Conservative",
    "CD:low|COM:high": "Liberal Pragmatist",
    "COM:high|PF:high": "Party Regular",
    "COM:low|PF:high": "Party Loyalist",
    "ENG:high|PRO:high": "Civic Activist",
    "ENG:high|PRO:low": "Direct-Action Activist",
    "COM:low|ENG:high": "Movement Activist",
    "ENG:low|PRO:high": "Civic Bystander",
    // Tribal / sectarian
    "TRB:low|ZS:low": "Bridge-Builder",
    "TRB:high|ZS:high": "Sectarian",
    "MORAL_CIRCLE:religious|ZS:high": "Sectarian",
    "MORAL_CIRCLE:religious|TRB:high": "Sectarian",
    "MORAL_CIRCLE:national|TRB:high": "Ultra-Nationalist",
    // Autonomous / nihilist
    "EPS:Autonomous|PRO:low": "Maverick",
    "AES:Authentic|EPS:Autonomous": "Maverick",
    "EPS:Nihilist|PF:low": "Alienated Voter",
    "ENG:low|EPS:Nihilist": "Alienated Bystander",
    // Statesman variants
    "AES:Statesman|COM:high": "Consensus Statesman",
    "AES:Statesman|PRO:high": "Constitutional Statesman",
    "AES:Statesman|MORAL_CIRCLE:national": "Patriotic Statesman",
    // Technocrat variants
    "AES:Technocrat|PRO:high": "Good-Government Technocrat",
    "AES:Technocrat|COM:high": "Policy Broker",
    "AES:Technocrat|ZS:low": "Policy Optimizer",
    // Pastoral / preacher
    "AES:Pastoral|MORAL_CIRCLE:religious": "Country Preacher",
    // Intuitionist / moral
    "EPS:Intuitionist|MOR:high": "Moral Idealist",
    "CD:high|EPS:Intuitionist": "Moral Traditionalist",
    "COM:high|EPS:Traditionalist": "Customary Pragmatist"
  };
  var POS_OVERRIDES = {
    // Adjective-leaning continuous-node tokens
    "Procedural": 0,
    "Pragmatic": 0,
    "Combative": 0,
    "Practical": 0,
    "Principled": 0,
    "Detached": 0,
    "Tempered": 0,
    "Authentic": 0,
    "Pastoral": 0,
    "Autonomous": 0,
    "Casual": 0,
    "Mobilized": 0,
    "Tuned-Out": 0,
    "Tribal": 0,
    "Anti-Institutional": 0,
    "Engaged-Civic": 0,
    "Class-Conscious": 0,
    "Bureaucratic": 0,
    "Hobbesian": 0,
    "Utopian": 0,
    "Civic": 1,
    "Institutional": 1,
    // Hybrid words used as nouns in political-identity context
    "Progressive": 3,
    "Conservative": 3,
    "Liberal": 3,
    "Cosmopolitan": 3,
    "Reactionary": 3,
    "Pluralist": 3,
    "Realist": 3,
    // Compound nouns
    "Mixed-Economy": 3,
    "Hinge": 4,
    "Positive-Sum": 2,
    "Civic-Pluralist": 3,
    "Free-Marketeer": 4,
    "Dealmaker": 4,
    "Civic-Universalist": 4,
    "Provincial-Pluralist": 3,
    "Conservative-Pluralist": 3,
    "Communitarian": 4,
    "Internationalist": 4,
    "Populist-Left": 4,
    "Populist-Right": 4,
    "Libertarian": 4,
    "Leftist": 4,
    "Solidarist": 4,
    "Cosmopolite": 4,
    "Class-Particularist": 4,
    "Tribal-Capitalist": 4,
    "Free-Market-Disruptor": 4,
    "Anti-Capitalist-Radical": 4,
    "Progressive-Unifier": 4,
    "Establishment": 4,
    "Insurgent": 4,
    "Negotiator": 4,
    "Hard-Liner": 4,
    "Outsider": 4,
    "Statesman-Style": 4,
    "Antagonist": 4,
    "Idealist": 4,
    "Hard-Realist": 4,
    "Social-Engineer": 4,
    "Cooperator": 4,
    "Cynic": 4,
    "Militant": 4,
    "Combatant": 4,
    "Reactionary-Firebrand": 4,
    "Loyal-Statesman": 4,
    "Wonk": 4,
    "Prophet": 4,
    "Hearth-Conservative": 4,
    "Plain-Partisan": 4,
    "Evidence-Institutionalist": 4,
    "Skeptic": 4,
    "Custom-Institutionalist": 4,
    "Gut-Outsider": 4,
    "Self-Reliant": 0,
    "Civic-Nationalist-Left": 4,
    "Civic-Nationalist-Right": 4,
    "Patriot-Partisan": 4,
    "Class-Fighter": 4,
    "Religious-Conservative": 4,
    "Quiet-Conservative": 4,
    "Disengaged-Progressive": 4,
    "Activist-Partisan": 4,
    // Categorical-leaning items
    "Religious-Communitarian": 4,
    "Ethnic-Communitarian": 4,
    "Gender-Identitarian": 4,
    "Partisan-Communitarian": 4,
    // Expansion pass 2 compressed outputs
    "Social-Democrat": 4,
    "Pragmatic-Conservative": 4,
    "Doctrinaire-Idealist": 4,
    "Conciliator": 4,
    "Globalist": 4,
    "Liberation-Theologian": 4,
    "Reformer": 4,
    "Constitutionalist": 4,
    "Humanist": 4,
    "Theocrat": 4,
    "Crusader": 4,
    "Patriot-Firebrand": 4,
    "Religious-Firebrand": 4,
    "Old-Guard": 4,
    "Mandarin": 4,
    "Tory": 4,
    "Internationalist-Statesman": 4,
    "Mogul": 4,
    "Institutional-Visionary": 4,
    "Tech-Visionary": 4,
    "Folk-Progressive": 4,
    "Folk-Conservative": 4,
    "Activist-Leftist": 4,
    "Activist-Conservative": 4,
    "Activist-Progressive": 4,
    "Continuity-Conservative": 4,
    "Universalist-Progressive": 4,
    "Class-Partisan": 4,
    "Patriot-Institutionalist": 4,
    "Patriot-Pragmatist": 4,
    // Expansion pass 3 (second-opinion review)
    "Classical Liberal": 4,
    "Neoliberal": 4,
    "Anarcho-Capitalist": 4,
    "National Populist": 4,
    "Christian Democrat": 4,
    "Paternalist Conservative": 4,
    "National Conservative": 4,
    "Integralist": 4,
    "Bull Moose Progressive": 4,
    "Marxist": 4,
    "Syndicalist": 4,
    "Vanguardist": 4,
    "Socialist Feminist": 4,
    "Civil-Rights Liberal": 4,
    "Cosmopolitan Liberal": 4,
    "Cosmopolitan Capitalist": 4,
    "Constitutional Conservative": 4,
    "Culture Warrior": 4,
    "Movement Progressive": 4,
    "Yellow Dog Democrat": 4,
    "Good-Government Reformer": 4,
    "Eco-Socialist": 4,
    "Green Progressive": 4,
    "Utopian Socialist": 4,
    "Techno-Libertarian": 4,
    "Hamiltonian": 4,
    "Rockefeller Republican": 4,
    "Reaganite": 4,
    "Goldwater Conservative": 4,
    "Paleoconservative": 4,
    "Distributist": 4,
    "One-Nation Conservative": 4,
    "New Dealer": 4,
    "Jacksonian": 4,
    // Compression outputs
    "Civic-Republican": 4,
    "Market-Fundamentalist": 4,
    "Social Liberal": 4,
    "Producerist": 4,
    "Class-Warrior": 4,
    "Feminist": 4,
    "Rights Feminist": 4,
    "Civil-Rights Progressive": 4,
    "Multiculturalist": 4,
    "Religious Progressive": 4,
    "Confessionalist": 4,
    "Interfaith-Pluralist": 4,
    "Legalist": 4,
    "Establishmentarian": 4,
    "Market Wonk": 4,
    "Rule-of-Law Wonk": 4,
    "Independent": 4,
    "Accelerationist": 4,
    "Futurist": 4,
    "Social Planner": 4,
    "Market Technocrat": 4,
    "Agrarian Populist": 4,
    "Agrarian Conservative": 4,
    "Heartland Populist": 4,
    "Plainspoken Patriot": 4,
    "Progressive Firebrand": 4,
    "Feminist Firebrand": 4,
    "Civil-Rights Firebrand": 4,
    "Liberal Statesman": 4,
    "Party Warrior": 4,
    "Movement Conservative": 4,
    "Mugwump": 4,
    "Apolitical Voter": 4,
    "Labor Activist": 4,
    "Faith Activist": 4,
    "Civil-Rights Activist": 4,
    "Patriot Activist": 4,
    "Civil-Libertarian": 4,
    "Doctrinaire Progressive": 4,
    "Doctrinaire Conservative": 4,
    "Liberal Pragmatist": 4,
    "Party Regular": 4,
    "Party Loyalist": 4,
    "Civic Activist": 4,
    "Direct-Action Activist": 4,
    "Movement Activist": 4,
    "Civic Bystander": 4,
    "Bridge-Builder": 4,
    "Sectarian": 4,
    "Ultra-Nationalist": 4,
    "Maverick": 4,
    "Alienated Voter": 4,
    "Alienated Bystander": 4,
    "Consensus Statesman": 4,
    "Constitutional Statesman": 4,
    "Patriotic Statesman": 4,
    "Good-Government Technocrat": 4,
    "Policy Broker": 4,
    "Policy Optimizer": 4,
    "Country Preacher": 4,
    "Moral Idealist": 4,
    "Moral Traditionalist": 4,
    "Customary Pragmatist": 4
  };
  function posRank(token) {
    if (token in POS_OVERRIDES) return POS_OVERRIDES[token];
    const last = (token.split("-").pop() ?? token).toLowerCase();
    if (/(?:ist|crat|man|ee[rt]|eer|aire|ant|arch|gogue|cyte|naut)$/.test(last)) return 4;
    if (/(?:al|ed|ous|ic|ive|ory|ish)$/.test(last)) return 0;
    return 3;
  }
  var ADJECTIVE_NOUN_FORM = {
    // Continuous lexicon adjectives
    "Procedural": "Proceduralist",
    "Pragmatic": "Pragmatist",
    "Combative": "Combatant",
    "Practical": "Pragmatist",
    "Principled": "Idealist",
    "Detached": "Detached",
    // Sam: works as standalone
    "Tempered": "Realist",
    "Pastoral": "Folk-Voice",
    "Casual": "Casual Voter",
    "Mobilized": "Activist",
    "Tuned-Out": "Bystander",
    "Tribal": "Tribalist",
    "Anti-Institutional": "Outsider",
    "Engaged-Civic": "Engaged-Civic",
    // Sam: works as compound
    "Civic": "Civic-Minded Citizen",
    "Institutional": "Institutionalist",
    // Categorical adjectives
    "Autonomous": "Free-Thinker",
    "Authentic": "Plain-Talker",
    // Compression outputs that are adjectives
    "Bureaucratic": "Bureaucrat",
    "Hobbesian": "Hobbesian-Realist",
    "Utopian": "Utopian-Idealist",
    "Class-Conscious": "Class-Activist",
    "Self-Reliant": "Individualist"
  };
  function ensureNounAnchor(tokens) {
    if (tokens.length === 0) return tokens;
    const last = tokens[tokens.length - 1];
    if (posRank(last.token) >= 2) return tokens;
    const nounForm = ADJECTIVE_NOUN_FORM[last.token];
    if (!nounForm || nounForm === last.token) return tokens;
    return [...tokens.slice(0, -1), { ...last, token: nounForm }];
  }
  function reorderByPOS(tokens) {
    const adjs = [];
    const nouns = [];
    for (const t of tokens) {
      if (posRank(t.token) <= 1) adjs.push(t);
      else nouns.push(t);
    }
    nouns.reverse();
    return [...adjs, ...nouns];
  }
  function applyCompression(tokens) {
    if (tokens.length < 2) return null;
    for (let i = 0; i < tokens.length; i++) {
      for (let j = i + 1; j < tokens.length; j++) {
        const pair = [tokens[i], tokens[j]];
        const sig = signatureOf(pair);
        if (sig in COMPRESSION_TABLE) {
          const compressed = {
            node: "_COMPRESSED",
            bin: sig,
            token: COMPRESSION_TABLE[sig],
            salience: Math.max(tokens[i].salience, tokens[j].salience),
            isCategorical: true
          };
          const remaining = tokens.filter((_, k) => k !== i && k !== j);
          return [compressed, ...remaining];
        }
      }
    }
    return null;
  }
  function composeArchetypeLabel(state) {
    return labelForRespondent(state, DEFAULT_MERGER_TABLE).label;
  }
  function argmax(arr) {
    let best = -1, bestV = -Infinity;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] > bestV) {
        bestV = arr[i];
        best = i;
      }
    }
    return best;
  }

  // src/identity/labelDescriptions.ts
  var LABEL_DESCRIPTIONS = {
    // ────────────────────────────────────────────────────────────────────────
    // Merger labels (full-signature handles — 87 entries)
    // ────────────────────────────────────────────────────────────────────────
    "Anarchist": "You believe legitimate political order has to come from voluntary cooperation, not from hierarchical institutions you didn't choose. Compromise feels like complicity, and you'd rather hold a principled line outside the system than win small concessions inside it. The state isn't a tool to be reformed \u2014 it's the structure you ultimately want to dismantle.",
    "Anarcho-Capitalist": "You think free markets and voluntary exchange can replace nearly everything the state currently does, including law and order itself. Your worldview combines deep skepticism of government with a strong faith in private contracting and emergent rules. Where libertarians want a small state, you want no state \u2014 only owners, customers, and competing private providers.",
    "Bull Moose Progressive": "You back muscular, energetic government action to break up concentrated power and clean up entrenched corruption. You're a believer in expert administration and aggressive reform, but rooted in a traditional civic patriotism rather than a radical critique. Your spiritual ancestor is Theodore Roosevelt: progressive policy, big-stick temperament, no apologies.",
    "Burkean Steward": "You treat society as a fragile inheritance \u2014 built up slowly, easily wrecked, and owed to people who haven't been born yet. Change is sometimes necessary, but it should be gradual, careful, and answerable to lived tradition rather than abstract theory. Reform yes; revolution never.",
    "Christian Democrat": "You believe a faithful religious tradition and a generous social-welfare state belong together, not on opposite sides of politics. You support strong family and community structures alongside redistribution, public services, and worker protection. Markets serve people, not the other way around \u2014 and the moral framework that gives that claim teeth is explicitly religious.",
    "Christian Socialist": "You read economic justice as a religious obligation, not a policy preference. The early-church model of shared resources, the prophets' indictment of inequality, and modern liberation theology all point you toward redistribution as a moral act. You're often more comfortable with leftist economics than leftist culture.",
    "Civic Traditionalist": "You believe a healthy political community needs shared rituals, shared symbols, and shared rules of conduct that get passed down rather than reinvented each generation. You're not necessarily religious or partisan \u2014 but you do think civic life atrophies when nothing is treated as sacred. Citizenship is something you practice, not just hold.",
    "Civil-Rights Liberal": "You take procedural fairness and equal treatment under law as the moral core of politics. Civil-rights victories \u2014 the Reconstruction amendments, Brown, the Civil Rights Act \u2014 define what good government looks like to you. Where critics see proceduralism as cold or thin, you see it as the only durable foundation for justice.",
    "Class-War Fighter": "You treat politics as a confrontation between economic classes whose interests genuinely cannot be reconciled. Soft-edged rhetoric about shared prosperity strikes you as either naive or actively misleading. The job of the left is to win the fight, not to host the dialogue.",
    "Class-War Leftist": "Your politics start from the conviction that the economic structure is the underlying story, and that the owning class and working class are in a real, ongoing conflict. Cultural and identity battles matter, but only as they connect back to material power. Class first \u2014 and class second.",
    "Classical Liberal": "You believe individual liberty, free exchange, and limited government are the conditions under which societies flourish. You're suspicious of concentrated power whether it sits in a corporate boardroom or a regulatory agency. Your reference points are Locke, Smith, and Mill more than any contemporary party platform.",
    "Combative Conservative": "You're willing to fight hard for traditional values, and you've stopped believing the other side is operating in good faith. Strong moral lines, strong rhetoric, and a willingness to use power when you have it define your political style. Civility matters less to you than victory on the questions you consider non-negotiable.",
    "Combative Leftist": "You believe the left wins when it confronts power directly rather than seeking accommodation. Compromise with the right is, in your view, mostly a way of slowing down progress. You're more invested in moral clarity than in coalition arithmetic.",
    "Combative Populist": "You see politics as a fight between ordinary people and a self-dealing elite that has rigged the system. Polite institutionalism strikes you as the very mechanism the elite uses to keep its grip. You back leaders who name the enemy plainly and don't apologize for breaking the table.",
    "Comfortable Bystander": "You're not actively engaged with politics, but you're also not unhappy with how things are going. You vote sometimes, watch occasionally, and trust that the broader system is more or less sound. Your political identity is mostly low-temperature acceptance.",
    "Communitarian Traditionalist": "You believe people are formed by particular communities \u2014 families, faiths, neighborhoods, trades \u2014 and that politics should defend those bonds against both atomized individualism and centralized bureaucracy. Cultural continuity matters more to you than free-market efficiency. You're skeptical of any program that asks you to think of yourself as just a generic citizen.",
    "Conservative": "You believe time-tested institutions, traditions, and norms encode hard-won knowledge that planners can't easily replace. You're slower to embrace sweeping change than the average voter, not from hostility but from caution. Stability isn't glamorous, but you think it's underrated.",
    "Constitutional Conservative": "You treat the constitutional framework \u2014 separation of powers, enumerated rights, federalism \u2014 as the central inheritance of American politics. Substantive disputes should be resolved within those forms, not by sidelining them. Originalist or not, you believe procedural fidelity is itself a moral commitment.",
    "Constructivist Progressive": "You believe political institutions and economic arrangements are human-made and therefore changeable \u2014 and you want to rebuild them on more equitable foundations. Tradition has no automatic claim if it can't justify itself. Your motivating intuition: we built this, we can build something better.",
    "Continuity Conservative": "You support the conservative tradition's pragmatic, governance-oriented wing: get reelected, run things, keep the lights on, move the dial slowly. You see the populist insurgent wing as both ineffective and reckless. Boring competence is, in your view, a virtue.",
    "Cosmopolitan Capitalist": "You combine an open-borders, free-trade, internationalist worldview with a strong belief in markets and private enterprise. The global economy is, to you, both a fact and a moral good. You're at home in cities, conferences, and capital flows \u2014 and uneasy with the nationalist strain of right-wing politics.",
    "Cosmopolitan Liberal": "You believe individual rights and free-market institutions should travel across borders, and that the long arc bends toward integration rather than separation. National identity matters less to you than membership in a broader liberal order. You're the natural constituency for trade deals, immigration, and international institutions.",
    "Cosmopolitan Progressive": "You want a more equal economy and a more open, pluralistic culture, and you think the two reinforce each other. Borders, in-groups, and inherited identity categories all strike you as worth interrogating. Your reference point is the global liberal-left rather than any single national tradition.",
    "Cosmopolitan Reformer": "You believe reasonable policy can deliver a fairer, more open society \u2014 and you're not particularly interested in revolutionary rupture. You're an internationalist at heart but pragmatic in method. Technocracy in service of liberal values is the basic formula.",
    "Culture Warrior": "Cultural and moral questions sit at the center of your political identity. You believe the wrong side winning on those questions does real damage that economics can't undo. You're willing to spend political capital on values fights that pragmatists would skip.",
    "Disaffected Contrarian": "You're checked out from the mainstream of both major coalitions and skeptical of the people running them. You vote, when you vote, against rather than for. Trust in institutions has been low for a long time and isn't coming back soon.",
    "Distributist": "You believe ownership of productive property \u2014 land, tools, small businesses \u2014 should be widely distributed rather than concentrated in either large corporations or the state. Both big capital and big government make you uneasy. Your sympathies often run through Catholic social teaching, agrarianism, and cooperatives.",
    "Eco-Socialist": "You think the climate crisis and the structure of capitalism are the same problem viewed from different angles. Markets, in your view, can't solve a problem they were partly built to cause. Solving the ecological question requires changing who owns and decides \u2014 not just upgrading the technology.",
    "Essentialist Traditionalist": "You believe certain features of human nature, the family, and the moral order are fixed givens rather than malleable social constructs. Politics should work with that grain, not against it. You read most utopian projects as attempts to abolish constraints that can't actually be abolished.",
    "Evidence-Based Institutional Conservative": "You hold conservative values but trust expertise and procedural government over populist instinct. Data, institutions, and durable rules are how you think good policy gets made. Your right-of-center politics looks like a serious think tank rather than a rally.",
    "Evidence-Based Institutional Leftist": "You combine left-of-center values with a strong belief in expert administration, evidence-based policy, and durable institutions. You'd rather grind out incremental wins through agencies and statutes than chase movement-style purity. You want the left to govern well, not just protest loudly.",
    "Evidence-Based Institutionalist": "Your politics centers on competent institutions and policies that survive contact with data. Movement passion and ideological purity tests strike you as obstacles to good governance. You're a process maximalist with reformer instincts.",
    "Evidence-Based Progressive": "You back progressive goals but believe they should be tested empirically and refined as evidence accumulates. Slogans don't move you; randomized trials, longitudinal studies, and well-designed programs do. You're the policy-shop wing of the left.",
    "FDR-Style Statesman": "You believe in active, ambitious government leadership that mobilizes the country around shared projects \u2014 and you carry a wartime sense of stakes about the consequences of failure. Markets are tools, not gods. Your touchstones are the New Deal and the postwar liberal order it produced.",
    "Goldwater Conservative": "You're a movement conservative in the 1964 mold: limited government, strong national defense, deep suspicion of federal overreach, a willingness to lose elections rather than dilute principles. You're more comfortable with the libertarian-leaning wing of the right than with the populist or theocratic wings. Compromise on first principles strikes you as how conservatism dies.",
    "Good-Government Reformer": "You're motivated by clean process, professional administration, and the elimination of patronage and graft. Procedural reform \u2014 civil service rules, transparency, conflict-of-interest law \u2014 is the substantive politics for you. Whatever the party, you want competent and accountable government.",
    "Green Progressive": "Environmental sustainability is your political center of gravity, but it's woven through with broader progressive commitments on inequality and democracy. You don't see the climate crisis as a stand-alone issue. Solving it, for you, requires fairer economics and more responsive politics at the same time.",
    "Gut-Politics Fighter": "You trust instinct, lived experience, and moral conviction over wonk-y analysis or institutional process. When the gut says the system is broken, you don't need a study to confirm it. The fights you pick are visceral and personal rather than abstract.",
    "Hamiltonian": "You believe a strong central government, sound finance, robust commerce, and ambitious public investment are how a country builds lasting power. You're skeptical of small-state purism and agrarian nostalgia. Your reference point is the federalist tradition of state-building from the top down.",
    "Heritage Firebrand": "You're a passionate defender of national or cultural heritage and willing to fight publicly for it. The rhetorical register is fervent rather than reserved. Sentimentality about the past is, in your view, a virtue rather than a weakness.",
    "Heritage Guardian": "You see preserving cultural inheritance \u2014 language, custom, identity, place \u2014 as a primary political duty. You're not necessarily reactionary, but you do think rapid demographic and cultural change deserves more skepticism than it currently gets. Continuity is the value; assimilation is the mechanism.",
    "Identity-Group Activist": "Your politics is organized around the defense and advancement of a specific identity group whose interests, in your view, the mainstream has neglected. Coalition-building flows from that center. Politics, for you, is partly about visibility and recognition, not just policy.",
    "Institutional Conservative": "You trust slow-moving, rules-based institutions to handle disputes better than charismatic leaders or angry crowds. The job of a conservative is to defend that machinery against both populist and progressive impatience. Process is substance.",
    "Institutional Leftist": "You believe the left wins by working through institutions \u2014 agencies, statutes, courts, unions, professional bodies \u2014 rather than around them. Movement energy matters, but only if it converts into durable policy. You're the long-game wing of the progressive coalition.",
    "Insurgent Equalizer": "You believe the political system is too captured to deliver equality through normal channels, so you back disruptive, movement-style politics aimed at structural change. Reform from inside hasn't worked; the strategy now has to be pressure from outside. The status quo is not a stable resting point.",
    "Integralist": "You believe political authority should explicitly serve a religious moral order rather than treat all comprehensive worldviews as equally valid. You're skeptical of liberal neutrality on the deepest questions. The state, in your view, has to take a side on what the good life actually is.",
    "Jacksonian": "Your politics is rooted in popular sovereignty, plain-folk loyalty, and a willingness to fight enemies \u2014 domestic and foreign \u2014 without apology. Elite institutions are objects of suspicion rather than reverence. Honor, loyalty, and the gut sense of who's-us define the coalition.",
    "Jacobin Egalitarian": "You believe in radical, root-and-branch leveling of social hierarchies, and you're not bothered by being called extreme for it. Half-measures preserve the very inequalities they claim to fix. The political tradition you draw on is more revolutionary than reformist.",
    "Liberal Internationalist": "You believe a rules-based international order \u2014 alliances, institutions, treaties, trade \u2014 is the best framework for durable peace and prosperity. You're skeptical of both isolationism and unilateralism. Hard power matters, but legitimacy multiplied by it is what wins long.",
    "Loyal Democrat": "Whatever the candidate, whatever the cycle, you vote Democratic \u2014 and you think party loyalty is itself a civic virtue rather than a default of imagination. Your identity is tied to the coalition, not to any particular faction inside it. Defeat is regrouping; betrayal is splitting the ticket.",
    "Loyal Republican": "Whatever the candidate, whatever the cycle, you vote Republican \u2014 and you treat party loyalty as a real political commitment rather than mere habit. You'd rather work to shape the coalition from inside than defect over any single issue. The team is the project.",
    "Marxist": "You read history through the lens of class conflict and the mode of production. Capitalism, in your view, is a specific historical formation that can and will be superseded \u2014 and the political question is how. Material structures, not ideas in isolation, drive what's possible.",
    "Militant Partisan": "You bring movement-style intensity to electoral politics. The party isn't a halfway house; it's the vehicle, and the goal is to win and use power. You're impatient with both the high-minded independent center and the purity-testing fringes.",
    "Movement Progressive": "You're closely tied to the progressive movement infrastructure \u2014 coalitions, organizing groups, advocacy networks \u2014 and you measure progress by movement metrics, not just electoral ones. Building durable people power matters as much as winning the next race. The fight is generational.",
    "National Conservative": "You combine cultural traditionalism with a strong, identity-rooted nationalism and a willingness to use the state to defend both. Free-market orthodoxy doesn't constrain you when national interest is at stake. Family, faith, and country sit at the center of your politics.",
    "National Populist": "You see politics as a defense of ordinary people and the national community against detached elites and unaccountable outside forces. Cultural sovereignty matters as much as economic redistribution. You'd cross old left-right lines to back leaders who name those threats clearly.",
    "Neoliberal": "You believe market mechanisms, open trade, and globalization have generated enormous gains that protectionists and populists badly underestimate. Where markets fail, well-designed regulation should target the failure, not replace the market. Growth, mobility, and competition are first-order goods.",
    "Neoliberal Wonk": "You trust market-friendly policy designed by serious technocrats \u2014 congestion pricing, carbon taxes, means-tested transfers, evidence-based regulation. Ideological purity, on left or right, gets in the way of policies that would actually work. Your idea of a productive evening involves a working paper.",
    "New Dealer": "You believe in active government using its full toolkit \u2014 public works, social insurance, labor protection, financial regulation \u2014 to underwrite a broad middle-class economy. Markets are useful tenants of the polity, not its landlords. Your touchstone is the FDR settlement, not its rollback.",
    "One-Nation Conservative": "You're conservative on culture and tradition but generous on the welfare state and economic policy \u2014 a Tory in the Disraeli mold rather than the Thatcher one. Social solidarity, you believe, is what makes a nation worth conserving. Pure market liberalism gets the order of priorities wrong.",
    "Paleoconservative": "You combine cultural traditionalism with foreign-policy restraint, immigration skepticism, and a preference for the old, decentralist American republic over the modern administrative state. Neoconservatives strike you as a wrong turn the right took decades ago. Heritage and locality, not global mission, define the project.",
    "Paternalist Conservative": "You believe the state has a duty to shape moral and social outcomes \u2014 not just to protect rights \u2014 and that responsible authority is something to embrace rather than apologize for. Free-market individualism is, in your view, insufficient to sustain a healthy society. Order, hierarchy, and care belong together.",
    "Pluralist Structuralist": "You think a healthy polity needs many competing centers of power \u2014 civil-society groups, sub-national governments, professional bodies \u2014 held in workable tension. Concentration of power, public or private, is the underlying danger. Structural diversity, not ideological uniformity, is the goal.",
    "Pragmatic Institutional Leftist": "You hold left-of-center values but you're more interested in what passes and what works than in maximally pure positions. Marginal gains through normal institutional channels add up. The movement's purity tests strike you as a luxury serious politics can't afford.",
    "Principled Cosmopolitan": "You believe the moral circle extends beyond your nation, your culture, and your kin, and that public policy ought to reflect that. Borders, in your view, are administrative tools, not ethical truths. Your principles are abstract by design \u2014 they have to apply to strangers too.",
    "Procedural Institutional Leftist": "You believe the left should win through legitimate, rule-bound institutional channels \u2014 courts, statutes, agencies, elections \u2014 and not through extralegal pressure. Bending procedure to get faster results corrodes the very system that makes left victories durable. Process and substance aren't opposed; they reinforce each other.",
    "Progressive Civic Nationalist": "You combine progressive economic and cultural commitments with a real, affirmative attachment to your national community. National belonging, for you, is something to expand and democratize, not to abandon. The left, in your view, abandons patriotism at its own electoral peril.",
    "Progressive Leftist": "You sit firmly on the left of contemporary politics \u2014 on economics, culture, and identity \u2014 and you don't see meaningful daylight between those dimensions. The conservative coalition is the opposition, not a partner. Your political project is to move the center of gravity, decisively and over time.",
    "Quiet Traditionalist": "You hold traditional values without making them a public crusade. Your conservatism is lived rather than performed \u2014 visible in habits, families, and communities rather than in rallies or column inches. You wish the loud parts of right-wing politics would calm down.",
    "Rawlsian Reformer": "You believe a just society would be the one we'd choose if we didn't yet know our station in life \u2014 and you read that thought experiment as a demanding standard for present-day reform. Inequality is permissible only if it improves the position of the worst-off. Liberal proceduralism, deployed seriously, is more radical than its critics suppose.",
    "Reaganite": "You're a movement conservative in the 1980 mold: smaller government, lower taxes, robust national defense, and an optimistic, sunny rhetorical register. You see the Reagan synthesis as the right combination of pieces and the contemporary right's drift away from it as a mistake. Limited government plus muscular foreign policy plus cultural confidence is the formula.",
    "Religious Right": "Your politics is anchored in a religious tradition and the moral framework it provides, especially on family, life, and culture. You see the secular drift of the larger society as the underlying problem most other issues flow from. Coalition with the secular right is instrumental \u2014 the values are the point.",
    "Religious Traditionalist": "You believe inherited religious tradition is the deepest source of moral and political wisdom, more reliable than either secular philosophy or popular instinct. Your politics defers to that tradition where modern preferences conflict with it. Adaptation has limits; some commitments don't update.",
    "Rockefeller Republican": "You're an East-Coast Republican in the moderate mold: comfortable with markets, comfortable with regulation, socially liberal, civically minded. The party's contemporary populist wing strikes you as foreign. Your tradition is country-club governance with a pragmatic streak.",
    "Socialist Feminist": "You see economic structure and gendered power as parts of the same system, and you don't think either can be fixed in isolation. Mainstream liberal feminism, in your view, leaves the wage and care economy intact. The redistribution that actually liberates women has to be material.",
    "Statesman Institutional Conservative": "You're a senior-statesman type within the conservative coalition: respected, institutional, reluctant to break norms even when the base wants them broken. You see protecting durable institutions as a deeper conservative duty than winning any one election. Dignity is part of the job description.",
    "Statesman Institutional Leftist": "You're a senior-statesman type within the progressive coalition: institutional, dignified, reluctant to throw the rules over for short-term wins. You believe the long credibility of the left depends on how its leaders carry themselves under pressure. The grown-up wing of the project.",
    "Statesman Institutionalist": "You believe in institutions, in dignity, and in the slow, accountable practice of government. Hot rhetoric and movement insurgency strike you as undignified at best and corrosive at worst. The bearing of a statesman is itself a political stance.",
    "Syndicalist": "You believe workers organizing through their own unions and federations \u2014 not parties, not the state \u2014 are the legitimate engine of political and economic change. Centralized state socialism strikes you as nearly as alienating as capitalism. The general strike, not the ballot, is the deeper instrument.",
    "Techno-Libertarian": "You believe technology is the central engine of human progress and that markets, individual builders, and minimal regulation are how that engine keeps running. You're suspicious of bureaucratic constraints on innovation. Silicon Valley libertarianism, in some form, is the natural political home.",
    "Technocratic Optimizer": "You believe well-designed policy \u2014 informed by data and run by competent professionals \u2014 can deliver enormous gains that ideology routinely sacrifices. Cost-benefit analysis isn't cold; it's how serious people show care. Mood-driven politics is something you'd happily replace.",
    "Utopian Socialist": "You believe a fundamentally different and better society is possible \u2014 one organized around cooperation, ecological balance, and human flourishing \u2014 and you take seriously that vision even when it's far from current reality. Pragmatism that surrenders the horizon isn't pragmatism; it's resignation. Imagination is a political act.",
    "Vanguardist": "You believe disciplined leadership by a politically conscious minority is sometimes necessary to drive structural change that the majority won't yet support. Pure spontaneity gets co-opted; pure parliamentarism gets neutralized. Leadership, theory, and organization are non-negotiable.",
    "Visionary Insurgent": "You back politicians and movements that paint a different future and disrupt the existing political order to get there. Incrementalism strikes you as imagination-deficient rather than realistic. The energy is forward-leaning, not preservationist.",
    "Visionary Progressive": "You believe progressives win by articulating a compelling positive vision, not just by managing decline or correcting injustice. Imagination is itself a political resource. The future ought to be better than the present, and somebody has to draw the picture.",
    "World-Minded Reformer": "Your moral horizon is global, and you back reform agendas that take international solidarity seriously \u2014 humanitarian intervention, refugee protection, development, climate. National-interest framing alone strikes you as morally cramped. The relevant 'us' is wider than the passport.",
    "Yellow Dog Democrat": "You'd vote for a yellow dog before a Republican, and you take that party loyalty as identity rather than mere habit. The Democratic coalition is your political home through every internal disagreement. Coalition discipline, not factional purity, is what wins.",
    // ────────────────────────────────────────────────────────────────────────
    // Compression labels (2-token role-archetypes — 155 entries)
    // ────────────────────────────────────────────────────────────────────────
    "Accelerationist": "You believe the system needs to be pushed past its breaking point rather than slowly reformed. Whether the destination is utopian or unknown, the consensus path is a dead end. Hit the gas.",
    "Activist-Conservative": "You're a movement conservative with high engagement: rallies, candidate work, organizing, advocacy. Conservative politics, in your view, requires the same intensity progressives put into theirs. The age of country-club passivity is over on your side too.",
    "Activist-Leftist": "You're a deeply engaged movement leftist who treats organizing as a vocation. Showing up is the baseline; the question is how skilled and strategic the work gets. Politics happens in the streets, the doors, and the meetings \u2014 not just on ballots.",
    "Activist-Partisan": "You combine party loyalty with movement-style energy. Your politics isn't a hobby \u2014 it's structured volunteer work, party meetings, candidate operations. The coalition is the vehicle, and you help build it.",
    "Activist-Progressive": "Your progressive politics is high-engagement and movement-flavored: protests, organizing, mutual aid, advocacy. You see activism as the engine that pulls the political center of gravity left. Showing up is the practice.",
    "Agrarian Conservative": "You're rooted in a land-based, traditional, often religious conservatism \u2014 small towns, family farms, faith communities. Urban cosmopolitanism is, to you, not just different but slightly disorienting. The rhythms of place and season carry moral weight.",
    "Agrarian Populist": "You believe in the dignity of rural producers and the political alliance of farmers, small-town workers, and the laboring poor against finance, monopolies, and metropolitan elites. The historical lineage runs from the People's Party through the New Deal coalition's rural wing. Land, labor, and locality define the politics.",
    "Alienated Bystander": "You've checked out from politics not because nothing matters but because nothing you do seems to. The institutions strike you as gamed, the parties as theater, the candidates as interchangeable. Disengagement is, for now, a defensible response.",
    "Alienated Voter": "You vote, sometimes, but you don't trust the process or the people running it. The choice on the ballot rarely feels like a real one. Your participation is closer to obligation than to enthusiasm.",
    "Antagonist": "You're naturally oriented against the consensus of the moment, whatever it happens to be. Disagreement isn't a side effect of your politics \u2014 it's much of the substance. You'd rather sharpen a fight than dull it.",
    "Anti-Capitalist-Radical": "You believe capitalism is the underlying structure that has to be overcome, not merely regulated. Reformist gestures inside the system don't reach the source. The work is to imagine and build the post-capitalist alternative.",
    "Apolitical Voter": "You show up at the polls because you're supposed to, but politics doesn't otherwise occupy you. You don't follow the coverage, you don't argue about it at parties, and you're fine with that. Civic duty, not civic passion.",
    "Bridge-Builder": "You instinctively look for shared ground across political lines. The escalating polarization of contemporary politics strikes you as both ugly and avoidable. Where others want victory, you want a workable settlement.",
    "Bureaucratic": "You trust formal procedure, written rules, and chain-of-command accountability. Charismatic leadership and movement passion both look like risks rather than assets. Process correctness is itself a value.",
    "Civic Activist": "You're a high-engagement participant in civic life: city council meetings, school boards, volunteer boards, community organizing. The closer to home the politics, the more committed you tend to be. Democracy, in your view, is something you have to keep showing up for.",
    "Civic Bystander": "You believe civic engagement is good and important \u2014 for other people. Your participation is mostly aspirational rather than actual. The intent is there; the calendar isn't.",
    "Civic-Nationalist-Left": "You combine left-of-center economics with a genuine civic patriotism. National belonging, to you, is something the left should claim and expand rather than cede to the right. Solidarity has a flag.",
    "Civic-Nationalist-Right": "You combine right-of-center cultural commitments with a civic \u2014 rather than ethnic \u2014 definition of national belonging. The nation is bounded but joinable. You're patriotic and traditional without being exclusionary on first principles.",
    "Civic-Republican": "You believe self-government requires active, virtuous citizens \u2014 not just rights-bearing individuals. A free polity is a practice, not a vending machine. Your reference points run from the classical republicans through the American founders' civic tradition.",
    "Civic-Universalist": "You hold a universalist moral horizon together with a strong civic-republican commitment to public life. The nation is one expression of the universal, not its replacement. Cosmopolitan in principle, civic in practice.",
    "Civil-Libertarian": "You take individual rights \u2014 speech, conscience, due process, privacy \u2014 as nearly inviolable. You'd accept significant costs in efficiency or security to preserve them. The state's expanding power is the recurring worry.",
    "Civil-Rights Activist": "You're a high-engagement participant in civil-rights organizing and advocacy. The unfinished business of equal protection is your day-to-day project. Procedural fairness, in your view, requires constant defense.",
    "Civil-Rights Firebrand": "You bring movement intensity to civil-rights work \u2014 confrontational, public, willing to escalate. Reasoned advocacy alone, in your view, is too slow against entrenched resistance. Pressure is the instrument.",
    "Civil-Rights Progressive": "Your progressive politics is centered on the civil-rights tradition \u2014 equal protection, anti-discrimination, voting rights. Material and cultural questions matter, but they thread through this core. The unfinished business is the project.",
    "Class-Fighter": "You see economic class as the real underlying axis of politics and you're ready to fight for it. The other side isn't confused; it's the other side. Class consciousness, applied seriously, is what wins.",
    "Class-Particularist": "You're rooted in a particular class identity \u2014 its dignities, its grievances, its political needs \u2014 rather than in abstract universalism. Cosmopolitan framings can feel like they erase the people you actually care about. Solidarity starts close to home.",
    "Class-Partisan": "You're a deeply partisan voter whose partisanship is fundamentally about class. The party is the vehicle for a class project, not the other way around. You're loyal to the coalition for material reasons.",
    "Class-Warrior": "You don't believe class conflict is a metaphor. The owning class and the working class have real, opposed interests, and politics is the field on which that struggle plays out. Polite framing of the conflict mostly serves the side that's winning.",
    "Combatant": "You take politics as a fight rather than a deliberation. You're skilled at it, energized by it, and not interested in pretending otherwise. Honest opponents are preferable to comfortable consensus.",
    "Communitarian": "You believe people are formed by particular communities \u2014 and that liberal individualism understates how much we owe to those communities. The thin self of rights-talk strikes you as morally incomplete. Belonging is a real political category.",
    "Conciliator": "You're the person trying to lower the temperature in the room. Cross-aisle bargaining is, to you, a craft rather than a betrayal. The deal that holds is worth more than the speech that didn't.",
    "Confessionalist": "You believe a specific religious confession provides the framework for both personal and public life. Religious pluralism is a fact, but neutrality among confessions strikes you as itself a kind of position. Your tradition has substantive content.",
    "Consensus Statesman": "You combine institutional dignity with a real talent for building consensus across factions. The hardest political work, in your view, is keeping a coalition together when its pieces would rather split. Bringing people along is the craft.",
    "Conservative-Pluralist": "You're culturally conservative but genuinely pluralist about how others choose to live. You want to preserve your tradition without using the state to require it of strangers. Live and let live, but mean both halves.",
    "Constitutional Statesman": "You combine the dignified bearing of a senior statesman with deep loyalty to the constitutional order. Norms, not just laws, are part of the inheritance you defend. The form holds because particular people choose to honor it.",
    "Constitutionalist": "You believe the written constitutional framework \u2014 and the norms around it \u2014 is the foundation that lets everything else operate. Both populists and progressives strike you as too willing to bend the rules for the cause of the day. Rules first, even when inconvenient.",
    "Continuity-Conservative": "You back the conservative tradition's governance-oriented wing: serious people, durable institutions, slow change. The insurgent populist wing strikes you as both reckless and ineffective. Boring is a feature, not a bug.",
    "Cooperator": "You believe most political problems can be solved through cooperation rather than confrontation. Zero-sum framing usually misreads the situation. There's almost always a deal in the room if people will look for it.",
    "Cosmopolitan": "Your moral and political imagination is oriented outward \u2014 across borders, across cultures, across in-group lines. Particularist attachments matter, but they don't trump universal claims. The relevant community is bigger than the nearest one.",
    "Cosmopolite": "You're at home in the global liberal-cultural milieu \u2014 its cities, its media, its institutions. Your tastes, friendships, and worldview are all transnational. The local is real but not central.",
    "Country Preacher": "You combine a pastoral religious sensibility with a rooted, often rural, sense of place. The pulpit and the porch are both legitimate venues for moral talk. Faith is lived in particular communities, not abstracted away from them.",
    "Crusader": "You bring religious or moral fervor to political causes. The stakes are eternal, not just legislative. Half-measures, by definition, betray the underlying commitment.",
    "Custom-Institutionalist": "You trust the slow accretion of custom, precedent, and institutional habit more than written rules or formal theory. The deep wisdom of working systems isn't articulable in advance. You'd rather not redesign from scratch.",
    "Customary Pragmatist": "You combine respect for inherited custom with a workmanlike pragmatism about getting things done. Tradition is the default, but it bends where necessary. You're not the person who sets fire to the rulebook.",
    "Cynic": "You expect bad faith, self-dealing, and decay as the baseline conditions of political life. Naive idealism strikes you as more dangerous than honest realism. You'd rather know who's lying than be told they aren't.",
    "Direct-Action Activist": "You believe the work of politics is direct, embodied action \u2014 strikes, occupations, blockades, mutual aid \u2014 rather than electoral mediation. Institutional channels are slow, captured, or both. The point is to do, not to petition.",
    "Disengaged-Progressive": "Your values are progressive but your engagement is low. You agree with the cause in the abstract; you're just not living it. The intent is real even when the schedule isn't.",
    "Doctrinaire Conservative": "You hold conservative positions firmly and aren't interested in trading them for short-term compromise. Principles, in your view, are what they are because they're not negotiable. The drift toward expediency on the right is, to you, the underlying problem.",
    "Doctrinaire Progressive": "You hold progressive positions firmly and aren't inclined to trade them for short-term compromise. Principles, in your view, are what they are because they're not negotiable. The drift toward triangulation on the left is, to you, the underlying problem.",
    "Doctrinaire-Idealist": "You hold your ideals firmly and aren't moved by tactical arguments to soften them. Compromise on principle isn't shrewd; it's surrender. The next election matters less than the long shape of the project.",
    "Establishment": "You're comfortable with the existing institutional order and the people who run it. The system isn't perfect, but it's functional, and most insurgents make it worse. Stability under competent management is what good politics looks like.",
    "Establishmentarian": "You believe the established institutions of public life \u2014 civil service, party hierarchies, professional bodies \u2014 deserve real loyalty. Reformers underestimate how much the working machinery actually does. The system needs maintenance, not demolition.",
    "Evidence-Institutionalist": "You combine respect for institutions with a strong evidentiary discipline. Policy ought to be informed by what the data actually says, refined by professionals, and made durable through institutional channels. Loud arguments without evidence don't move you much.",
    "Faith Activist": "You're a high-engagement participant in faith-based organizing \u2014 congregations, denominational networks, religious advocacy groups. Your faith is, among other things, political in practice. The work and the worship are the same thread.",
    "Feminist": "Gender equality is a central commitment in your political identity rather than a side issue. The unfinished business of feminism \u2014 wages, care work, autonomy, representation \u2014 defines a real agenda. The framework is structural, not just individual.",
    "Feminist Firebrand": "You bring movement intensity to feminist politics \u2014 confrontational, public, willing to escalate. The slower channels of liberal feminism, in your view, leave too much intact. Pressure is the instrument.",
    "Folk-Conservative": "You're conservative in a rooted, folk-cultural register rather than in an ideological or institutional one. Plain talk, plain values, plain people. The intellectual right strikes you as overcomplicated.",
    "Folk-Progressive": "You're progressive in a rooted, folk-cultural register rather than in an academic or technocratic one. Solidarity, fairness, mutual aid \u2014 in the idiom of ordinary people. The academic left strikes you as overcomplicated.",
    "Free-Market-Disruptor": "You combine strong faith in markets with skepticism of existing institutions \u2014 including regulators, incumbents, and credentialed gatekeepers. Disruption is, on balance, good. The future is more pluralistic and more competitive, not less.",
    "Futurist": "You believe technology, science, and ambitious thinking are going to transform the conditions of human life \u2014 and politics ought to be oriented toward that horizon rather than the rear-view. Status-quo defensiveness strikes you as a failure of imagination. The next century is the real subject.",
    "Globalist": "You think tightly integrated trade, migration, and international institutions deliver enormous gains that critics routinely underestimate. National-protectionism strikes you as both economically costly and morally cramped. The world economy is a fact and, mostly, a feature.",
    "Good-Government Technocrat": "You believe well-designed, professionally administered policy is most of what good government looks like \u2014 and that ideological framing usually gets in the way. Anti-corruption, transparency, evidence-based regulation are the workhorses. The mood is competent rather than charismatic.",
    "Gut-Outsider": "You trust your gut over expert advice, especially when the experts seem to be circling their own interests. The institutional consensus is, in your view, frequently wrong. You'd rather be outside the room than captured by it.",
    "Hard-Liner": "You hold uncompromising positions and you're suspicious of negotiation. Where others see room for a deal, you see a trap. Holding the line is, in your view, the more important political virtue.",
    "Hard-Realist": "You believe politics is mostly about power and scarce resources, and you're impatient with framings that obscure that. Soft-edged moralism doesn't move you. The unsentimental view is, you suspect, also the more honest one.",
    "Hearth-Conservative": "You're conservative in a domestic, family-rooted register \u2014 home, neighborhood, congregation. The political world matters less than the smaller world close to you. You'd just like to be left alone to live it.",
    "Heartland Populist": "Your politics is rooted in the geography and culture of the country's interior \u2014 small towns, working communities, the heartland. Coastal-elite framings of national life skip you over. The political project is to make sure that doesn't keep happening.",
    "Hobbesian": "You believe order is the prior political good, because without it nothing else holds. Without a clear authority enforcing rules, you suspect, conditions get bad faster than people think. Idealistic political theory ignores how thin the floor really is.",
    "Humanist": "You believe a shared, generally optimistic view of human capacity should anchor politics. Cynicism is often a self-fulfilling prophecy. The point is to build institutions worthy of better outcomes, not to manage decline.",
    "Idealist": "You hold political ideals firmly and you'd rather lose with them intact than win by softening them. The day-to-day grind of politics matters, but only as it serves the longer-arc project. The dream is the point.",
    "Independent": "You don't belong to either major coalition by identity, and you don't intend to start. You vote on the candidate and the moment rather than on the team. Partisan identity strikes you as a thinking shortcut you'd rather not take.",
    "Institutional-Visionary": "You combine ambition about what the future could look like with a serious commitment to building it through durable institutions. Both naive utopianism and pure institutional caretaking fall short. The vision needs the structure; the structure needs the vision.",
    "Insurgent": "You're not interested in working comfortably inside the existing political order. The incumbents \u2014 whichever side \u2014 are the problem. The political project is to break the consensus and replace it.",
    "Interfaith-Pluralist": "You believe the public square should genuinely host multiple religious and moral traditions on roughly equal terms. Religious life is important \u2014 but no single tradition should set the terms for everyone else. Pluralism is real, not just nominal.",
    "Internationalist": "You believe the international order \u2014 alliances, treaties, institutions, trade \u2014 is a genuine moral and practical project. Withdrawal and unilateralism, in your view, leave both interests and ideals undefended. The relevant community is the world.",
    "Internationalist-Statesman": "You combine the dignified bearing of a senior statesman with deep loyalty to the international liberal order. Alliances, institutions, and the slow work of multilateral diplomacy are how you measure success. The job, properly done, is unglamorous.",
    "Labor Activist": "You're a high-engagement participant in labor organizing \u2014 unions, worker centers, contract fights. Class politics, in your view, is built one workplace at a time. The day-to-day is the work.",
    "Leftist": "You hold positions firmly on the left of contemporary politics, on both economic and cultural questions. The political center, in your view, has drifted in directions that need to be reversed rather than accommodated. The work is to move the whole conversation.",
    "Legalist": "You believe disputes should be resolved through formal legal procedure and reasoned argument rather than political pressure. The rule of law is, in your view, the underlying achievement of a free society. Procedure is substance.",
    "Liberal Pragmatist": "You hold liberal values but you're flexible about means. The point is what passes and what works, not what scores best on a purity test. You'd rather win small and durable than lose loud.",
    "Liberal Statesman": "You combine the bearing of a senior statesman with a liberal political program. Dignity, institutional respect, and serious policy are how you carry the work. The substantive politics is reformist; the manner is not.",
    "Liberation-Theologian": "You read religious tradition as fundamentally committed to the poor, the oppressed, and the marginalized. Faith without that commitment, in your view, isn't faithful. Theology and political economy live in the same conversation.",
    "Libertarian": "You believe individual liberty is the central political value and that government power is the recurring threat to it. Markets, voluntary association, and limited state authority are the building blocks. The default answer to most policy questions is fewer rules, not more.",
    "Loyal-Statesman": "You combine the bearing of a senior statesman with deep party or institutional loyalty. The coalition isn't a hindrance; it's the vehicle. The job is to carry it forward with dignity and skill.",
    "Mandarin": "You're a credentialed, professional, institutional operator. The administrative state \u2014 and the people who actually run it \u2014 does most of the work the public mistakes for politics. Expertise and procedural skill are underappreciated virtues.",
    "Market Technocrat": "You believe markets, properly designed by serious technocrats, are the most powerful tool politics has. Where markets fail, well-targeted regulation should address the failure rather than replace the market. The work is detail-engineering, not slogans.",
    "Market Wonk": "You're an evidence-driven enthusiast for market mechanisms \u2014 pricing externalities, designing incentives, evaluating outcomes. Most policy debates, in your view, would benefit from a quieter and more empirical conversation. Working papers are how you relax.",
    "Market-Fundamentalist": "You believe markets are not just useful but morally central, and that interventions in them tend to do more harm than good. The free-market position isn't one ideology among many; it's the underlying truth other ideologies obscure. Free exchange is the default unless proven otherwise.",
    "Maverick": "You go your own way regardless of party line. Coalition discipline matters less to you than calling things as you see them. You'd rather be wrong on your own than right by team instruction.",
    "Militant": "You bring uncompromising intensity to political work. The other side isn't a misguided neighbor; it's the obstacle. You're willing to escalate where polite politics would back off.",
    "Mogul": "You see private enterprise \u2014 at scale, ambitious, unapologetic \u2014 as a generative force in the world. Building things is its own kind of public good. You're more comfortable with founders than with regulators.",
    "Moral Idealist": "You take moral intuition seriously as a guide to political action. Cold calculation that ignores the moral picture, in your view, ends up serving the wrong things. The right thing to do is often plainer than the strategists make it sound.",
    "Moral Traditionalist": "You believe moral truths are inherited rather than constructed, and that the tradition's verdict deserves more weight than the moment's preferences. Modern moral reinvention strikes you as overconfident. The old answers were old for reasons.",
    "Movement Activist": "You're a high-engagement participant in movement-style politics \u2014 organizing, advocacy, mutual aid. The party system, in your view, is something to pressure rather than rely on. Building independent capacity is the long game.",
    "Movement Conservative": "Your conservatism is movement-flavored rather than country-club. You're in the work \u2014 rallies, candidate operations, advocacy, coalition-building. The party is the vehicle, but it needs the movement to drive it.",
    "Mugwump": "You prize independent judgment over party loyalty and you're willing to bolt the coalition over corruption or principle. Reform, not faction, is the through-line. The historical lineage runs through nineteenth-century good-government dissidents.",
    "Multiculturalist": "You believe a healthy polity makes room for many cultural communities \u2014 language, religion, custom \u2014 on terms that respect their integrity. Assimilation is one possible outcome, not the goal. Pluralism is a substantive achievement.",
    "Negotiator": "You're the person looking for the deal. Confrontation is sometimes necessary, but it's mostly a failure of imagination. Most rooms have a settlement nobody's quite found yet.",
    "Old-Guard": "You're a long-tenured insider in your political tradition, comfortable with its institutions and uncomfortable with its insurgents. The rules of the road are mostly fine; the people questioning them are mostly the problem. Stability is the underrated political asset.",
    "Outsider": "You're not at home in either established coalition and you don't want to be. The system rewards the wrong things and protects the wrong people. Distance is, on balance, a virtue.",
    "Party Loyalist": "You stick with the party through whatever cycle, candidate, or controversy comes along. The coalition is the vehicle, and abandoning it serves the opposition. Loyalty over preference, every time.",
    "Party Regular": "You're an institutional partisan \u2014 comfortable inside the party apparatus, fluent in its rituals, patient with its compromises. The party is your political home rather than your political project. You belong to it as much as it belongs to you.",
    "Party Warrior": "You bring high-temperature loyalty to partisan politics. The other coalition isn't a partner; it's the opposition, in something close to a literal sense. You'd rather win loud than win quiet.",
    "Patriot Activist": "You're a high-engagement participant in national-pride and patriotic causes. The work is, in your view, civic and structural \u2014 defending and advancing the national project. Patriotism is something you practice, not just feel.",
    "Patriot-Firebrand": "You bring movement intensity to national-pride politics. The country, you believe, has enemies \u2014 internal and external \u2014 that polite framing won't address. The rhetorical register is fervent rather than reserved.",
    "Patriot-Institutionalist": "You combine deep patriotism with respect for the institutional order \u2014 courts, agencies, the constitution itself. Loving the country, in your view, means defending the rules that make it work. Sentiment without structure decays.",
    "Patriot-Partisan": "You combine national patriotism with strong partisan identity. The party, in your view, is the practical vehicle for the country's interests. Loyalty to both reinforces rather than conflicts.",
    "Patriot-Pragmatist": "You're a patriot without being a romantic about it. The country's strength is a working concern that requires deals, alliances, and trade-offs. Sentiment is fine; the budget still has to balance.",
    "Patriotic Statesman": "You combine the dignified bearing of a senior statesman with deep, affirmative patriotism. Public service is its own honor. The flag is something you carry rather than wave.",
    "Plain-Partisan": "You're a partisan in a plain, unfussy register. You don't dress up your politics in elaborate theory \u2014 you support your side because they're your side. That's enough.",
    "Plainspoken Patriot": "Your patriotism is direct and unornamented. The high-theory framings \u2014 civic-republican, ethno-nationalist, whatever \u2014 don't really capture it. The country is the country, and you love it.",
    "Policy Broker": "You're the person who turns competing political demands into workable policy compromises. Skill at structuring the deal matters more, in your view, than rhetorical performance. The trade is the craft.",
    "Policy Optimizer": "You're focused on policy that actually delivers measured outcomes. Performative legislation that doesn't move the dial doesn't impress you. The point is the result, not the press release.",
    "Populist-Left": "You back politics that confronts economic elites directly on behalf of working people. Mainstream center-left technocracy, in your view, has been too friendly to capital for too long. The energy belongs to those willing to name the conflict.",
    "Populist-Right": "You back politics that confronts cultural and political elites directly on behalf of ordinary people. The mainstream right's country-club wing, in your view, has been complicit too long. The energy belongs to the insurgent flank.",
    "Pragmatic-Conservative": "You hold conservative values but you're flexible about means. Doctrinal purity, in your view, often loses ground that pragmatic conservatism would have held. You'd rather win small and durable than lose loud.",
    "Producerist": "You believe political legitimacy belongs to people who actually make things \u2014 farmers, workers, builders, small-business owners \u2014 and not to those who manipulate paper claims on what they make. Finance and rent-seeking strike you as parasitic on real production. The producer-vs-parasite frame is foundational.",
    "Progressive Firebrand": "You bring movement intensity to progressive politics. Compromise within the coalition strikes you as concession before the fight has even started. The rhetorical register is fervent, the strategy is escalation.",
    "Progressive-Unifier": "You believe the progressive coalition wins by holding its different factions together \u2014 class-first, identity-first, climate-first, abundance-first \u2014 rather than litigating which is the real left. The big tent is the project. Unity is a political skill, not a betrayal.",
    "Prophet": "You speak from a moral or spiritual conviction that doesn't bend to political calculation. The point isn't to persuade the median voter; it's to name what's wrong and demand better. The role is older than democracy.",
    "Provincial-Pluralist": "You're rooted in a particular place and tradition but open to coexistence with others on similar terms. Cosmopolitanism strikes you as thin; tribalism strikes you as ugly. Local plus pluralist is a coherent position.",
    "Quiet-Conservative": "You hold conservative values without making them a public crusade. Your conservatism is lived rather than performed \u2014 visible in family, neighborhood, work \u2014 not in rallies. You wish the louder parts of the right would calm down.",
    "Reactionary": "You believe modern political life has taken serious wrong turns and that a meaningful response involves reversing rather than incrementally adjusting. Restoration, not reform, is the relevant frame. You're willing to defend positions most contemporaries treat as closed.",
    "Reactionary-Firebrand": "You bring fervent, movement-style intensity to a reactionary politics. Modernity's wrong turns, in your view, need to be confronted directly rather than wished away. The rhetorical register matches the stakes you perceive.",
    "Reformer": "You believe specific, durable changes to existing institutions can deliver substantial improvements over time. Revolution overpromises and underdelivers; pure preservation accepts too much. Useful reform is patient work.",
    "Religious Progressive": "You read your religious tradition as fundamentally committed to social justice, equality, and care for the marginalized. Conservative co-option of religious vocabulary strikes you as a serious misreading. Faith, properly heard, points left as often as it points right.",
    "Religious-Conservative": "Your conservatism is grounded in religious tradition and the moral framework it provides. Cultural questions \u2014 family, life, education \u2014 flow from that center. Secular conservatism, by itself, doesn't quite reach the depth of the commitment.",
    "Religious-Firebrand": "You bring fervent, movement-style intensity to religiously grounded politics. The moral and spiritual stakes, in your view, justify a register most polite politics rejects. Prophecy, not policy memo.",
    "Rights Feminist": "Your feminism is organized around equal rights under law \u2014 anti-discrimination, reproductive autonomy, equal protection. Procedural fairness is the framework. The political work is the slow institutional grind toward equal treatment in practice.",
    "Rule-of-Law Wonk": "You combine an empiricist disposition with a deep commitment to procedural rule-of-law. Strong, predictable rules, transparently enforced, are the load-bearing achievement of liberal politics. Good government has the receipts.",
    "Sectarian": "You see political life as conflict between distinct moral or religious communities whose claims can't easily be harmonized. Universalist framings, in your view, miss how deep the divisions actually run. You'd rather draw the lines clearly than pretend they aren't there.",
    "Self-Reliant": "You believe the basic political unit is the responsible individual \u2014 not the family, the community, or the state. Dependency erodes both character and freedom. The political program is to make space for self-reliance, not to substitute for it.",
    "Skeptic": "You hold most political claims at arm's length until they survive scrutiny. Confident certainty, on either side, makes you reach for the question marks. Your default is doubt, not cynicism.",
    "Social Liberal": "You're a liberal in the modern sense: pro-market broadly, but also pro-redistribution, pro-civil-rights, and pro-public-goods. The free market is one tool among several. The welfare state and civil-rights tradition aren't enemies of liberty \u2014 they're conditions for it.",
    "Social Planner": "You believe well-designed public policy \u2014 administered by serious professionals \u2014 can solve problems markets won't. Where market enthusiasts see government failure, you see opportunity for good design. The planner's mood is constructive, not nostalgic.",
    "Social-Democrat": "You believe robust markets and an active welfare state belong together rather than in opposition. Public services, labor protection, and progressive taxation are how capitalism stays compatible with democracy. The model is Nordic rather than libertarian or revolutionary.",
    "Social-Engineer": "You believe institutions and behaviors can be deliberately designed to produce better outcomes. The political project is, at the deepest level, a problem of mechanism design. Skepticism about that program strikes you as defeatism.",
    "Solidarist": "You believe political life is about the bonds of solidarity that hold communities together \u2014 not just rights, transactions, or efficiencies. Atomized liberalism misses what people actually need. Mutual obligation is a feature, not a constraint.",
    "Statesman-Style": "You carry a senior-statesman bearing into political work \u2014 dignified, institutional, reluctant to break norms. Style and substance, in your view, aren't separable. How leaders carry themselves matters substantively.",
    "Tech-Visionary": "You combine an empiricist disposition with bold, future-oriented ambition about what technology can do. The work is to keep the engines of innovation running. Status-quo defensiveness, on either side, is the recurring obstacle.",
    "Theocrat": "You believe political authority should explicitly serve a religious moral order rather than treat all comprehensive worldviews as equally valid. Liberal neutrality, in your view, is itself a substantive \u2014 and wrong \u2014 position. The state can't avoid taking a side on the deepest questions.",
    "Tory": "You sit on the older, governance-oriented wing of the conservative tradition \u2014 comfortable with the existing institutional order, suspicious of populist or revolutionary energy. The party's role is to keep the system running responsibly. Conservatism, in your view, is a practice rather than a fervor.",
    "Tribal-Capitalist": "You combine in-group loyalty with a strong commitment to private enterprise. The market is a tool; whose market it is matters too. Cosmopolitan capitalism strikes you as missing half the picture.",
    "Ultra-Nationalist": "Your national identity is the deep organizing center of your politics. The nation comes first in a strong sense \u2014 culturally, demographically, strategically. You're impatient with frameworks that treat it as just one membership among many.",
    "Universalist-Progressive": "You combine progressive economic and cultural commitments with a moral horizon that runs past borders, faiths, and in-groups. The relevant 'us' is large. Particularist framings strike you as too small for the project.",
    "Utopian": "You hold a serious vision of how human life could be reorganized for the better, and you don't think pragmatism gets to declare that vision off-limits. The picture matters; pragmatism without horizon is just drift. Imagination is itself political work.",
    "Wonk": "You're driven by the substance of policy itself. Most political debate is downstream of design choices, and you'd rather work on the design. The working paper is the unit of progress."
  };
  var POSITION_ATOMS = {
    MAT: {
      low: { what: "redistribution and economic equality" },
      mid: { what: "a mixed economy that balances markets and intervention" },
      high: { what: "free markets and private enterprise" }
    },
    CD: {
      low: { what: "cultural reform and progressive change" },
      mid: { what: "incremental cultural change" },
      high: { what: "cultural tradition and continuity" }
    },
    CU: {
      low: { what: "shared civic culture and assimilation" },
      mid: { what: "civic pluralism on terms of mutual recognition" },
      high: { what: "cultural pluralism and minority preservation" }
    },
    MOR: {
      low: { what: "loyalty to particular kin and community" },
      mid: { what: "civic-scale moral obligation" },
      high: { what: "universal moral concern across borders and groups" }
    },
    PRO: {
      low: { what: "outcomes over procedure" },
      mid: { what: "pragmatic balance between procedure and outcome" },
      high: { what: "procedural fairness and rule of law" }
    },
    COM: {
      low: { what: "principled non-compromise" },
      mid: { what: "practical negotiation on substance" },
      high: { what: "deal-making and coalition arithmetic" }
    },
    ZS: {
      low: { what: "the possibility of positive-sum cooperation" },
      mid: { what: "a clear-eyed mix of cooperation and contest" },
      high: { what: "politics as a zero-sum contest for scarce stakes" }
    },
    ONT_H: {
      low: { what: "a fixed view of human nature and its limits" },
      mid: { what: "a tempered view of how much people change" },
      high: { what: "human malleability and the possibility of growth" }
    },
    ONT_S: {
      low: { what: "skepticism of institutional authority" },
      mid: { what: "selective reform of working institutions" },
      high: { what: "the legitimacy of long-standing institutions" }
    },
    PF: {
      low: { what: "independence from party affiliation" },
      mid: { what: "engaged civic life beyond strict partisanship" },
      high: { what: "strong partisan identity" }
    },
    TRB: {
      low: { what: "inclusive identity that crosses group lines" },
      mid: { what: "civic-scale belonging without strong group attachment" },
      high: { what: "loyalty to a particular tribe or community" }
    },
    ENG: {
      low: { what: "low political engagement" },
      mid: { what: "casual political engagement" },
      high: { what: "high political engagement and activism" }
    }
  };
  var EPS_ATOMS = {
    Empiricist: { what: "an empiricist, evidence-driven way of forming beliefs" },
    Institutionalist: { what: "trust in established institutions as repositories of knowledge" },
    Traditionalist: { what: "deference to inherited tradition for moral and practical wisdom" },
    Intuitionist: { what: "trust in moral and gut intuition" },
    Autonomous: { what: "independent reasoning over deference to authority" },
    Nihilist: { what: "skepticism that any system reliably tracks the truth" }
  };
  var AES_ATOMS = {
    Statesman: { what: "the dignified, institutional register of statesmanship" },
    Technocrat: { what: "the competent, evidence-driven register of technocracy" },
    Pastoral: { what: "a folk, rooted, place-based political register" },
    Authentic: { what: "plain-talking, unpolished authenticity" },
    Fighter: { what: "a combative, confrontational political register" },
    Visionary: { what: "an imaginative, future-oriented political register" }
  };
  var MORAL_CIRCLE_ATOMS = {
    Universalist: { what: "moral concern that extends to all human beings equally" },
    Nationalist: { what: "elevated moral weight on co-nationals" },
    "Religious-Communitarian": { what: "elevated moral weight on co-religionists" },
    "Ethnic-Communitarian": { what: "elevated moral weight on shared ethnic or racial community" },
    "Class-Conscious": { what: "elevated moral weight on shared economic class" },
    "Gender-Identitarian": { what: "elevated moral weight on shared gender experience" },
    "Partisan-Communitarian": { what: "elevated moral weight on shared ideological camp" }
  };
  var STRIP_PREFIXES = [
    "Anti-Institutional ",
    "Anti-Capitalist "
  ];
  function lookupIconic(label) {
    if (label in LABEL_DESCRIPTIONS) return LABEL_DESCRIPTIONS[label];
    for (const prefix of STRIP_PREFIXES) {
      if (label.startsWith(prefix)) {
        const tail = label.slice(prefix.length);
        if (tail in LABEL_DESCRIPTIONS) return LABEL_DESCRIPTIONS[tail];
      }
    }
    return void 0;
  }
  function atomFragment(t) {
    if (t.node === "EPS") return EPS_ATOMS[t.token];
    if (t.node === "AES") return AES_ATOMS[t.token];
    if (t.node === "MORAL_CIRCLE") return MORAL_CIRCLE_ATOMS[t.token];
    const node = POSITION_ATOMS[t.node];
    if (!node) return void 0;
    return node[t.bin];
  }
  function composeAtomFallback(tokens) {
    const frags = tokens.map(atomFragment).filter((f) => !!f);
    if (frags.length === 0) {
      return "Your political identity didn't concentrate strongly on any single dimension; this respondent profile averages across the available axes.";
    }
    if (frags.length === 1) {
      return `Your political identity centers on ${frags[0].what}.`;
    }
    if (frags.length === 2) {
      return `Your political identity centers on ${frags[0].what}, with a secondary theme of ${frags[1].what}.`;
    }
    return `Your political identity centers on ${frags[0].what}, with secondary themes of ${frags[1].what} and ${frags[2].what}.`;
  }
  function composeArchetypeDescription(label, tokens) {
    const iconic = lookupIconic(label);
    if (iconic) return iconic;
    return composeAtomFallback(tokens);
  }

  // src/browser/api.ts
  var BUNDLE_VERSION = "20260513-q79-merge";
  var _state = null;
  var _questions = [];
  var _questionsById = /* @__PURE__ */ new Map();
  var _ratioBoosts = /* @__PURE__ */ new Map();
  var _demographics = null;
  function ratioToSalienceDist(ratio) {
    if (ratio >= 25) return [0.04, 0.14, 0.32, 0.5];
    if (ratio >= 5) return [0.08, 0.2, 0.36, 0.36];
    if (ratio >= 2) return [0.14, 0.28, 0.36, 0.22];
    return [0.22, 0.32, 0.3, 0.16];
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
        if (touch.node === "MOR") mirrorMorSalToIntensity(_state, salLikelihood, 1);
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
      // Centroid posterior fields (archetypeDistances/currentLeader/
      // consecutiveLeadCount) retained at the type level so RespondentState
      // contracts still typecheck across legacy eval scripts, but the live
      // engine no longer populates them (2026-05-13 centroid rip). Leave them
      // empty in deep copies so back-navigation doesn't fabricate stale state.
      archetypeDistances: {},
      // Metadata fields written by Q200/Q211/Q212 update hooks. Snapshot must
      // round-trip these or back-navigation will silently drop election-alignment
      // signals that the user already provided.
      partyID: state.partyID ?? null,
      strategicVoting: state.strategicVoting,
      dominantNode: state.dominantNode ?? null,
      negativeParties: state.negativeParties ? new Set(state.negativeParties) : void 0
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
    if (state.morBoundaries) {
      copy.morBoundaries = {
        boundaries: { ...state.morBoundaries.boundaries },
        intensity: state.morBoundaries.intensity,
        touches: { ...state.morBoundaries.touches },
        touchTypes: new Set(state.morBoundaries.touchTypes),
        status: state.morBoundaries.status
      };
    }
    if (state.moralCircle) {
      copy.moralCircle = {
        affinity: state.moralCircle.affinity ? {
          universalAffinity: state.moralCircle.affinity.universalAffinity,
          scopedAffinities: { ...state.moralCircle.affinity.scopedAffinities },
          excessAffinities: { ...state.moralCircle.affinity.excessAffinities },
          activeBoundaries: [...state.moralCircle.affinity.activeBoundaries],
          intensity01: state.moralCircle.affinity.intensity01,
          intensity03: state.moralCircle.affinity.intensity03
        } : null,
        touchCount: state.moralCircle.touchCount,
        accumulator: {
          universalSum: state.moralCircle.accumulator.universalSum,
          universalCount: state.moralCircle.accumulator.universalCount,
          scopedSums: { ...state.moralCircle.accumulator.scopedSums },
          scopedCounts: { ...state.moralCircle.accumulator.scopedCounts }
        }
      };
    }
    if (state.membership) {
      copy.membership = { ...state.membership };
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
      // 6.E.2b: initialize the compound moral-circle module per ADR-006.
      // Triggers archetypeDistance.ts's per-archetype gate to switch to the
      // morModule branch — the bridge in update.ts (committed in this same PR)
      // mirrors every legacy MOR/TRB/PF/trbAnchor write into this field so the
      // module ends the quiz meaningfully shifted from {boundaries: 0.5,
      // intensity: 0} rather than near-neutral.
      morBoundaries: mkInitialMorBoundaries(),
      // ADR-007 — moralCircleAffinity initialization (T10).
      // affinity stays null until first moralCircle evidence; no zero-default
      // (universalAffinity=0 would be a positive moral claim). Accumulator
      // tracks per-component running totals.
      moralCircle: {
        affinity: null,
        touchCount: 0,
        accumulator: {
          universalSum: 0,
          universalCount: 0,
          scopedSums: {},
          scopedCounts: {}
        }
      },
      membership: {},
      // archetypeDistances kept as empty record for type-shape compatibility
      // with eval/simulation scripts that still read the field. Live engine no
      // longer populates after 2026-05-13 centroid rip.
      archetypeDistances: {}
    };
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
  var METADATA_QUESTION_IDS = /* @__PURE__ */ new Set([200, 211, 212]);
  function initQuiz() {
    _questions = REPRESENTATIVE_QUESTIONS.filter(
      (q) => q.touchProfile.length > 0 || METADATA_QUESTION_IDS.has(q.id)
    );
    _questionsById = new Map(_questions.map((q) => [q.id, q]));
    resetSimilarityCache();
    _state = createInitialState();
    _snapshots.length = 0;
    _ratioBoosts.clear();
    _demographics = null;
  }
  function getNextQuestion() {
    if (!_state) throw new Error("Call initQuiz() first");
    for (const nextId of SALIENCE_ROUTER_FIXED) {
      if (nextId in _state.answers) continue;
      const q = _questionsById.get(nextId);
      if (!q) continue;
      if (!isQuestionEligible(_state, q)) continue;
      return toQuizQuestion(q);
    }
    const available = _questions.filter(
      (q) => !(q.id in _state.answers) && isQuestionEligible(_state, q)
    );
    const topK = getTopSalientNodes(_state);
    if (topK.length > 0) {
      const drill = selectTopKDrillQuestion(_state, available, _questionsById, topK);
      if (drill) return toQuizQuestion(drill);
    }
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
      case "conjoint":
        applySingleChoiceAnswer(_state, q, answer);
        applyStoredRatioBoost(q);
        break;
      case "multi":
        applyMultiAnswer(_state, q, Array.isArray(answer) ? answer : [answer]);
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
        const best = Array.isArray(bw.best) ? bw.best : [bw.best];
        const worst = Array.isArray(bw.worst) ? bw.worst : [bw.worst];
        if (Array.isArray(bw.best) || Array.isArray(bw.worst) || q.bestWorstMap) {
          applyBestWorstSalience(_state, q, best, worst, bwItems);
        } else {
          const middle = bwItems.filter((i) => i !== best[0] && i !== worst[0]);
          applyRankingAnswer(_state, q, [best[0], ...middle, worst[0]]);
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
  }
  function getProgress() {
    if (!_state) throw new Error("Call initQuiz() first");
    const nAnswered = Object.keys(_state.answers).length;
    let phase;
    if (nAnswered < 16) phase = "salience";
    else if (nAnswered < 28) phase = "discriminate";
    else phase = "converge";
    return {
      questionsAnswered: nAnswered,
      estimatedTotal: 32,
      phase
    };
  }
  function isComplete() {
    if (!_state) return false;
    return shouldStopEIG(_state, _questionsById);
  }
  function getResults() {
    if (!_state) throw new Error("Call initQuiz() first");
    const engagement = computeEngagementLabel(_state);
    detectAndStoreDominantNode(_state);
    const identityResult = resolveIdentityPrimary(_state, engagement, _demographics);
    const identityPrimary = identityResult.state === "active" || identityResult.state === "dominant" ? identityResult : null;
    return {
      questionsAnswered: Object.keys(_state.answers).length,
      engagement,
      identityPrimary
    };
  }
  function detectAndStoreDominantNode(state) {
    const nonSelfNodes = [
      "MAT",
      "CD",
      "CU",
      "MOR",
      "PRO",
      "COM",
      "ZS",
      "ONT_H",
      "ONT_S"
    ];
    const sals = [];
    for (const nid of nonSelfNodes) {
      const node = state.continuous[nid];
      if (!node) continue;
      sals.push({ nid, sal: node.salDist.reduce((s, p, i) => s + p * i, 0) });
    }
    for (const nid of ["EPS", "AES"]) {
      const node = state.categorical[nid];
      if (!node) continue;
      sals.push({ nid, sal: node.salDist.reduce((s, p, i) => s + p * i, 0) });
    }
    if (sals.length === 0) {
      state.dominantNode = null;
      return;
    }
    const top = sals.reduce((a, b) => a.sal > b.sal ? a : b);
    const others = sals.filter((s) => s.nid !== top.nid);
    const othersMean = others.reduce((s, e) => s + e.sal, 0) / Math.max(1, others.length);
    state.dominantNode = top.sal >= 2.7 && top.sal > 2 * othersMean ? top.nid : null;
  }
  function getQuestionIds() {
    return _questions.map((q) => q.id);
  }
  function getQuestionDef(questionId) {
    return _questionsById.get(questionId);
  }
  function getRespondentState() {
    if (!_state) return null;
    const continuous = {};
    for (const [nodeId, node] of Object.entries(_state.continuous)) {
      const expectedPos2 = node.posDist.reduce((sum, p, i) => sum + p * (i + 1), 0);
      const salience = node.salDist.reduce((sum, p, i) => sum + p * i, 0);
      continuous[nodeId] = { expectedPos: expectedPos2, salience, touches: node.touches, posDist: [...node.posDist] };
    }
    const categorical = {};
    for (const [nodeId, node] of Object.entries(_state.categorical)) {
      const salience = node.salDist.reduce((sum, p, i) => sum + p * i, 0);
      categorical[nodeId] = { catDist: [...node.catDist], salience, touches: node.touches };
    }
    const mb = _state.morBoundaries;
    let boundaryLoad2 = 0;
    if (mb) {
      for (const k of MOR_BOUNDARY_ORDER) {
        if (mb.boundaries[k] > boundaryLoad2) boundaryLoad2 = mb.boundaries[k];
      }
    }
    const morBoundaries = mb ? {
      boundaries: { ...mb.boundaries },
      intensity: mb.intensity,
      boundaryLoad: boundaryLoad2,
      universalismScore: mb.intensity * (1 - boundaryLoad2),
      boundednessScore: mb.intensity * boundaryLoad2,
      touches: { ...mb.touches },
      touchTypeCount: mb.touchTypes.size,
      status: mb.status
    } : null;
    const mc = _state.moralCircle?.affinity ?? null;
    const moralCircle = mc ? {
      universalAffinity: mc.universalAffinity,
      scopedAffinities: { ...mc.scopedAffinities },
      excessAffinities: { ...mc.excessAffinities },
      activeBoundaries: [...mc.activeBoundaries],
      intensity01: mc.intensity01,
      intensity03: mc.intensity03,
      touchCount: _state.moralCircle?.touchCount ?? 0
    } : null;
    return {
      continuous,
      categorical,
      trbAnchor: {
        dist: [..._state.trbAnchor.dist],
        touches: _state.trbAnchor.touches
      },
      morBoundaries,
      moralCircle,
      membership: _state.membership ? { ..._state.membership } : null,
      partyID: _state.partyID ?? null,
      strategicVoting: _state.strategicVoting ?? false,
      negativeParties: _state.negativeParties ? [..._state.negativeParties] : [],
      dominantNode: _state.dominantNode ?? null,
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
      out.push(predictVote(
        sig,
        election.candidates,
        ctx,
        engagement.level,
        _state.partyID ?? null,
        _state.trbAnchor.dist,
        _state.negativeParties ?? null,
        _state.strategicVoting ?? false,
        _state.dominantNode ?? null,
        _state.morBoundaries ?? null
      ));
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
        const b = best;
        const w = worst;
        setTimeout(() => {
          submitAnswer(q.id, { best: b, worst: w });
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
    const engLevel = results.engagement?.level ?? "unknown";
    const idp = results.identityPrimary?.label;
    el.innerHTML = `
    <h2>Quiz Complete</h2>
    <div class="prism-confidence">
      ${results.questionsAnswered} questions answered \xB7 engagement: ${engLevel}
      ${idp ? ` \xB7 ${idp}` : ""}
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
