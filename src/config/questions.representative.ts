import type { QuestionDef } from "../types.js";
import {
  AES_PROTOTYPES,
  EPS_PROTOTYPES
} from "./categories.js";

export const REPRESENTATIVE_QUESTIONS: QuestionDef[] = [
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
    ],
    optionEvidence: {
      never: {
        continuous: {
          ENG: { pos: [0.70, 0.20, 0.08, 0.02, 0.00] }
        }
      },
      few_days: {
        continuous: {
          ENG: { pos: [0.25, 0.45, 0.20, 0.08, 0.02] }
        }
      },
      most_days: {
        continuous: {
          ENG: { pos: [0.03, 0.10, 0.25, 0.40, 0.22] }
        }
      },
      every_day: {
        continuous: {
          ENG: { pos: [0.00, 0.02, 0.08, 0.25, 0.65] }
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
      { node: "PF", kind: "continuous", role: "position", weight: 0.80, touchType: "direct_centrality" },
      { node: "ENG", kind: "continuous", role: "position", weight: 0.35, touchType: "identity_activation" }
    ],
    sliderMap: {
      "0-20":   { continuous: { PF: { pos: [0.70, 0.20, 0.08, 0.02, 0.00] }, ENG: { pos: [0.55, 0.28, 0.12, 0.04, 0.01] } } },
      "21-40":  { continuous: { PF: { pos: [0.35, 0.40, 0.18, 0.06, 0.01] }, ENG: { pos: [0.30, 0.40, 0.20, 0.08, 0.02] } } },
      "41-60":  { continuous: { PF: { pos: [0.10, 0.25, 0.40, 0.20, 0.05] }, ENG: { pos: [0.08, 0.22, 0.42, 0.22, 0.06] } } },
      "61-80":  { continuous: { PF: { pos: [0.03, 0.10, 0.25, 0.40, 0.22] }, ENG: { pos: [0.03, 0.10, 0.28, 0.40, 0.19] } } },
      "81-100": { continuous: { PF: { pos: [0.00, 0.03, 0.12, 0.30, 0.55] }, ENG: { pos: [0.01, 0.04, 0.14, 0.31, 0.50] } } }
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
    quality: 0.90,
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
      { node: "COM", kind: "continuous", role: "position", weight: 0.30, touchType: "allocation_shape" },
      { node: "ZS", kind: "continuous", role: "salience", weight: 0.50, touchType: "derived_allocation_concentration" }
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
      { node: "PRO", kind: "continuous", role: "position", weight: 0.80, touchType: "rights_tradeoff" },
      { node: "COM", kind: "continuous", role: "position", weight: 0.35, touchType: "civic_balance" }
    ],
    optionEvidence: {
      cancel: {
        continuous: {
          PRO: { pos: [0.55, 0.30, 0.10, 0.04, 0.01] },
          COM: { pos: [0.40, 0.30, 0.15, 0.10, 0.05] }
        },
      },
      restricted: {
        continuous: {
          PRO: { pos: [0.30, 0.35, 0.20, 0.10, 0.05] },
          COM: { pos: [0.20, 0.25, 0.30, 0.15, 0.10] }
        }
      },
      allow_with_counterspeech: {
        continuous: {
          PRO: { pos: [0.10, 0.20, 0.35, 0.25, 0.10] },
          COM: { pos: [0.05, 0.10, 0.20, 0.35, 0.30] }
        }
      },
      allow_no_restrictions: {
        continuous: {
          PRO: { pos: [0.01, 0.04, 0.10, 0.30, 0.55] },
          COM: { pos: [0.10, 0.15, 0.20, 0.25, 0.30] }
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
      { node: "EPS", kind: "categorical", role: "category", weight: 0.70, touchType: "authority_ranking" },
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
    quality: 0.90,
    rewriteNeeded: false,
    touchProfile: [
      { node: "EPS", kind: "categorical", role: "category", weight: 0.35, touchType: "socialization_style" },
      { node: "AES", kind: "categorical", role: "category", weight: 0.30, touchType: "socialization_style" },
      { node: "ONT_H", kind: "continuous", role: "position", weight: 0.10, touchType: "human_nature_proxy" }
    ],
    pairMaps: {
      independence_vs_elders: {
        independence: {
          continuous: { ONT_H: 0.25 },
          categorical: { EPS: EPS_PROTOTYPES.autonomous, AES: AES_PROTOTYPES.plainspoken }
        },
        respect_for_elders: {
          continuous: { ONT_H: -0.25 },
          categorical: { EPS: EPS_PROTOTYPES.traditionalist, AES: AES_PROTOTYPES.pastoral }
        }
      },
      obedience_vs_self_reliance: {
        obedience: {
          continuous: { ONT_H: -0.20 },
          categorical: { EPS: EPS_PROTOTYPES.institutionalist, AES: AES_PROTOTYPES.statesman }
        },
        self_reliance: {
          continuous: { ONT_H: 0.20 },
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
    quality: 0.90,
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
      { node: "ONT_H", kind: "continuous", role: "position", weight: 0.30, touchType: "malleability_proxy" },
      { node: "EPS", kind: "categorical", role: "category", weight: 0.20, touchType: "allocation_shape_epistemic" }
    ],
    allocationMap: {
      legitimate_values: { continuous: { TRB: -0.9, COM: 0.8 } },
      misinformed: {
        continuous: { TRB: 0.1, ONT_H: 0.25 },
        // Heavy "misinformed" allocation reads as epistemic paternalism — "if
        // they had better data / expert consensus they'd reach my view." Light
        // tilt toward empiricist/institutionalist epistemic deference.
        categorical: { EPS: [0.30, 0.30, 0.10, 0.10, 0.10, 0.10] }
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
      // Continuous position touches removed 2026-05-02: rankingMap carries
      // TRB_ANCHOR evidence only, so the old TRB/MOR/CU/CD/MAT rows inflated
      // coverage counters without moving posteriors.
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
    quality: 0.90,
    rewriteNeeded: false,
    touchProfile: [
      { node: "CD", kind: "continuous", role: "position", weight: 0.90, touchType: "direct_placement" }
    ],
    sliderMap: {
      "0-20":   { continuous: { CD: { pos: [0.60, 0.25, 0.10, 0.04, 0.01] } } },
      "21-40":  { continuous: { CD: { pos: [0.30, 0.40, 0.20, 0.07, 0.03] } } },
      "41-60":  { continuous: { CD: { pos: [0.08, 0.20, 0.44, 0.20, 0.08] } } },
      "61-80":  { continuous: { CD: { pos: [0.03, 0.07, 0.20, 0.40, 0.30] } } },
      "81-100": { continuous: { CD: { pos: [0.01, 0.04, 0.10, 0.25, 0.60] } } }
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
      { node: "CD", kind: "continuous", role: "salience", weight: 0.90, touchType: "direct_salience" },
      { node: "CU", kind: "continuous", role: "salience", weight: 0.45, touchType: "boundary_salience" },
      { node: "MOR", kind: "continuous", role: "salience", weight: 0.20, touchType: "values_salience" }
    ],
    sliderMap: {
      "0-20":   { continuous: { CD: { sal: [0.55, 0.30, 0.12, 0.03] }, CU: { sal: [0.50, 0.30, 0.15, 0.05] }, MOR: { sal: [0.50, 0.30, 0.15, 0.05] } } },
      "21-40":  { continuous: { CD: { sal: [0.30, 0.40, 0.22, 0.08] }, CU: { sal: [0.30, 0.35, 0.25, 0.10] }, MOR: { sal: [0.30, 0.35, 0.25, 0.10] } } },
      "41-60":  { continuous: { CD: { sal: [0.10, 0.30, 0.38, 0.22] }, CU: { sal: [0.12, 0.28, 0.38, 0.22] }, MOR: { sal: [0.15, 0.30, 0.35, 0.20] } } },
      "61-80":  { continuous: { CD: { sal: [0.04, 0.12, 0.38, 0.46] }, CU: { sal: [0.05, 0.15, 0.38, 0.42] }, MOR: { sal: [0.08, 0.20, 0.38, 0.34] } } },
      "81-100": { continuous: { CD: { sal: [0.02, 0.08, 0.30, 0.60] }, CU: { sal: [0.03, 0.10, 0.32, 0.55] }, MOR: { sal: [0.05, 0.12, 0.35, 0.48] } } }
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
      { node: "MOR", kind: "continuous", role: "position", weight: 0.90, touchType: "moral_scope_tradeoff" }
    ],
    sliderMap: {
      "0-20":   { continuous: { MOR: { pos: [0.55, 0.28, 0.12, 0.04, 0.01] } } },
      "21-40":  { continuous: { MOR: { pos: [0.25, 0.40, 0.22, 0.10, 0.03] } } },
      "41-60":  { continuous: { MOR: { pos: [0.08, 0.18, 0.48, 0.18, 0.08] } } },
      "61-80":  { continuous: { MOR: { pos: [0.03, 0.10, 0.22, 0.40, 0.25] } } },
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
      "0-20":   { categorical: { EPS: { cat: EPS_PROTOTYPES.intuitionist } } },
      "21-40":  { categorical: { EPS: { cat: EPS_PROTOTYPES.empiricist } } },
      "41-60":  { categorical: { EPS: { cat: EPS_PROTOTYPES.institutionalist } } },
      "61-80":  { categorical: { EPS: { cat: EPS_PROTOTYPES.institutionalist } } },
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
      "0-20":   { continuous: { MAT: { pos: [0.01, 0.04, 0.10, 0.25, 0.60] } } },
      "21-40":  { continuous: { MAT: { pos: [0.03, 0.07, 0.20, 0.40, 0.30] } } },
      "41-60":  { continuous: { MAT: { pos: [0.08, 0.18, 0.48, 0.18, 0.08] } } },
      "61-80":  { continuous: { MAT: { pos: [0.30, 0.40, 0.20, 0.07, 0.03] } } },
      "81-100": { continuous: { MAT: { pos: [0.60, 0.25, 0.10, 0.04, 0.01] } } }
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
      "0-20":   { continuous: { ONT_H: { sal: [0.55, 0.30, 0.12, 0.03] } } },
      "21-40":  { continuous: { ONT_H: { sal: [0.25, 0.40, 0.25, 0.10] } } },
      "41-60":  { continuous: { ONT_H: { sal: [0.08, 0.28, 0.40, 0.24] } } },
      "61-80":  { continuous: { ONT_H: { sal: [0.03, 0.12, 0.40, 0.45] } } },
      "81-100": { continuous: { ONT_H: { sal: [0.02, 0.08, 0.30, 0.60] } } }
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
      { node: "TRB", kind: "continuous", role: "position", weight: 0.80, touchType: "outgroup_trust_estimate" },
      { node: "ZS", kind: "continuous", role: "position", weight: 0.55, touchType: "outgroup_trust_estimate" }
    ],
    sliderMap: {
      "0-20":   { continuous: { TRB: { pos: [0.01, 0.04, 0.12, 0.28, 0.55] }, ZS: { pos: [0.01, 0.04, 0.12, 0.28, 0.55] } } },
      "21-40":  { continuous: { TRB: { pos: [0.03, 0.09, 0.20, 0.38, 0.30] }, ZS: { pos: [0.03, 0.09, 0.20, 0.38, 0.30] } } },
      "41-60":  { continuous: { TRB: { pos: [0.08, 0.18, 0.48, 0.18, 0.08] }, ZS: { pos: [0.08, 0.18, 0.48, 0.18, 0.08] } } },
      "61-80":  { continuous: { TRB: { pos: [0.30, 0.38, 0.20, 0.09, 0.03] }, ZS: { pos: [0.30, 0.38, 0.20, 0.09, 0.03] } } },
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
      "0-20":   { continuous: { PRO: { sal: [0.55, 0.30, 0.12, 0.03] } } },
      "21-40":  { continuous: { PRO: { sal: [0.25, 0.40, 0.25, 0.10] } } },
      "41-60":  { continuous: { PRO: { sal: [0.08, 0.28, 0.40, 0.24] } } },
      "61-80":  { continuous: { PRO: { sal: [0.03, 0.12, 0.40, 0.45] } } },
      "81-100": { continuous: { PRO: { sal: [0.02, 0.08, 0.30, 0.60] } } }
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
      { node: "TRB", kind: "continuous", role: "position", weight: 0.70, touchType: "opponent_identity_activation" }
    ],
    sliderMap: {
      "0-20":   { continuous: { PF: { pos: [0.60, 0.25, 0.10, 0.04, 0.01] }, TRB: { pos: [0.65, 0.22, 0.09, 0.03, 0.01] } } },
      "21-40":  { continuous: { PF: { pos: [0.32, 0.38, 0.20, 0.08, 0.02] }, TRB: { pos: [0.35, 0.35, 0.20, 0.07, 0.03] } } },
      "41-60":  { continuous: { PF: { pos: [0.10, 0.22, 0.40, 0.20, 0.08] }, TRB: { pos: [0.12, 0.24, 0.40, 0.18, 0.06] } } },
      "61-80":  { continuous: { PF: { pos: [0.03, 0.08, 0.22, 0.40, 0.27] }, TRB: { pos: [0.04, 0.10, 0.24, 0.38, 0.24] } } },
      "81-100": { continuous: { PF: { pos: [0.01, 0.03, 0.10, 0.28, 0.58] }, TRB: { pos: [0.02, 0.05, 0.13, 0.30, 0.50] } } }
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
      "0-20":   { continuous: { PF: { pos: [0.03, 0.07, 0.15, 0.30, 0.45] } } },
      "21-40":  { continuous: { PF: { pos: [0.05, 0.10, 0.25, 0.30, 0.30] } } },
      "41-60":  { continuous: { PF: { pos: [0.12, 0.22, 0.32, 0.22, 0.12] } } },
      "61-80":  { continuous: { PF: { pos: [0.30, 0.30, 0.25, 0.10, 0.05] } } },
      "81-100": { continuous: { PF: { pos: [0.45, 0.30, 0.15, 0.07, 0.03] } } }
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
      { node: "ONT_S", kind: "continuous", role: "salience", weight: 0.20, touchType: "progress_salience" }
    ],
    sliderMap: {
      "0-20":   { continuous: { ONT_H: { sal: [0.55, 0.30, 0.12, 0.03] }, ONT_S: { sal: [0.50, 0.30, 0.15, 0.05] } } },
      "21-40":  { continuous: { ONT_H: { sal: [0.25, 0.40, 0.25, 0.10] }, ONT_S: { sal: [0.28, 0.38, 0.24, 0.10] } } },
      "41-60":  { continuous: { ONT_H: { sal: [0.08, 0.28, 0.40, 0.24] }, ONT_S: { sal: [0.12, 0.28, 0.38, 0.22] } } },
      "61-80":  { continuous: { ONT_H: { sal: [0.03, 0.12, 0.40, 0.45] }, ONT_S: { sal: [0.05, 0.18, 0.40, 0.37] } } },
      "81-100": { continuous: { ONT_H: { sal: [0.02, 0.08, 0.30, 0.60] }, ONT_S: { sal: [0.03, 0.12, 0.35, 0.50] } } }
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
      { node: "CU", kind: "continuous", role: "salience", weight: 0.90, touchType: "direct_salience" },
      { node: "CD", kind: "continuous", role: "salience", weight: 0.25, touchType: "direct_salience" },
      { node: "TRB_ANCHOR", kind: "derived", role: "anchor", weight: 0.25, touchType: "nationality_anchor" }
    ],
    sliderMap: {
      "0-20":   { continuous: { CU: { sal: [0.55, 0.30, 0.12, 0.03] }, CD: { sal: [0.50, 0.30, 0.15, 0.05] } }, trbAnchor: { global: 0.45, mixed_none: 0.30, ideological: 0.15 } },
      "21-40":  { continuous: { CU: { sal: [0.25, 0.40, 0.25, 0.10] }, CD: { sal: [0.28, 0.38, 0.24, 0.10] } }, trbAnchor: { mixed_none: 0.30, global: 0.20, ideological: 0.20, national: 0.10 } },
      "41-60":  { continuous: { CU: { sal: [0.08, 0.28, 0.40, 0.24] }, CD: { sal: [0.12, 0.28, 0.38, 0.22] } }, trbAnchor: { national: 0.30, ideological: 0.20, mixed_none: 0.20 } },
      "61-80":  { continuous: { CU: { sal: [0.03, 0.12, 0.40, 0.45] }, CD: { sal: [0.05, 0.18, 0.40, 0.37] } }, trbAnchor: { national: 0.55, ideological: 0.10, religious: 0.10, ethnic_racial: 0.10 } },
      "81-100": { continuous: { CU: { sal: [0.02, 0.08, 0.30, 0.60] }, CD: { sal: [0.03, 0.12, 0.35, 0.50] } }, trbAnchor: { national: 0.65, ethnic_racial: 0.20, religious: 0.10 } }
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
    quality: 0.90,
    rewriteNeeded: false,
    // ONT_H weight lowered 2026-04-26 from 0.55 → 0.30 per ADR-010 ONT_H
    // reframe to malleability. Q6's policy-bundle ONT_H likelihoods encode the
    // older fixed-goodness reading (Traditional Order = pessimistic about
    // humans). Under the malleability framing the signal is ambiguous —
    // Traditional Order could be Burkean (high ONT_H, cultivation via
    // tradition) OR Hobbesian (low ONT_H, fixed bad nature). Reduced weight
    // until likelihoods are recalibrated for the new concept.
    touchProfile: [
      { node: "MAT",   kind: "continuous", role: "position", weight: 0.65, touchType: "policy_bundle" },
      { node: "CD",    kind: "continuous", role: "position", weight: 0.60, touchType: "policy_bundle" },
      { node: "MOR",   kind: "continuous", role: "position", weight: 0.60, touchType: "policy_bundle" },
      { node: "ONT_H", kind: "continuous", role: "position", weight: 0.30, touchType: "policy_bundle" },
      { node: "ZS",    kind: "continuous", role: "position", weight: 0.40, touchType: "policy_bundle" },
      { node: "MAT",   kind: "continuous", role: "salience", weight: 0.30, touchType: "policy_bundle_salience" }
    ],
    optionEvidence: {
      // A: Traditional Order — secure borders, civics in schools, strong families, back the police
      priorities_traditional: {
        continuous: {
          MAT:   { pos: [0.04, 0.10, 0.22, 0.34, 0.30] },
          CD:    { pos: [0.02, 0.05, 0.14, 0.32, 0.47] },
          MOR:   { pos: [0.48, 0.30, 0.14, 0.06, 0.02] },
          ONT_H: { pos: [0.38, 0.30, 0.18, 0.10, 0.04] },
          ZS:    { pos: [0.08, 0.18, 0.28, 0.28, 0.18] }
        }
      },
      // B: Economic Fairness — universal services, tax wealth, raise wages, break up monopolies
      priorities_fairness: {
        continuous: {
          MAT:   { pos: [0.48, 0.30, 0.14, 0.06, 0.02], sal: [0.05, 0.15, 0.45, 0.35] },
          CD:    { pos: [0.30, 0.32, 0.22, 0.12, 0.04] },
          MOR:   { pos: [0.10, 0.20, 0.32, 0.24, 0.14] },
          ONT_H: { pos: [0.05, 0.10, 0.22, 0.35, 0.28] },
          ZS:    { pos: [0.10, 0.20, 0.32, 0.24, 0.14] }
        }
      },
      // C: National Strength — cut regulation, invest in defense, protect industries, selective immigration
      priorities_strength: {
        continuous: {
          MAT:   { pos: [0.05, 0.10, 0.20, 0.35, 0.30] },
          CD:    { pos: [0.05, 0.12, 0.22, 0.35, 0.26] },
          MOR:   { pos: [0.42, 0.30, 0.16, 0.08, 0.04] },
          ONT_H: { pos: [0.30, 0.32, 0.22, 0.12, 0.04] },
          ZS:    { pos: [0.04, 0.10, 0.22, 0.34, 0.30] }
        }
      },
      // D: Planet & Future — climate action, global cooperation, scientific research, generational investment
      priorities_future: {
        continuous: {
          MAT:   { pos: [0.20, 0.28, 0.28, 0.16, 0.08] },
          CD:    { pos: [0.38, 0.30, 0.18, 0.10, 0.04] },
          MOR:   { pos: [0.04, 0.10, 0.20, 0.32, 0.34] },
          ONT_H: { pos: [0.10, 0.20, 0.28, 0.26, 0.16] },
          ZS:    { pos: [0.30, 0.32, 0.22, 0.12, 0.04] }
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
          COM: { pos: [0.32, 0.38, 0.20, 0.08, 0.02] }
        }
      },
      coalition_first: {
        continuous: {
          COM: { pos: [0.02, 0.08, 0.20, 0.38, 0.32] }
        }
      },
      depends_on_issue: {
        continuous: {
          COM: { pos: [0.10, 0.22, 0.42, 0.18, 0.08] }
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
      { node: "ENG", kind: "continuous", role: "position", weight: 0.60, touchType: "social_behavior" },
      { node: "COM", kind: "continuous", role: "position", weight: 0.45, touchType: "social_behavior" }
    ],
    optionEvidence: {
      // V1: "Share your views but try to keep it civil"
      share_views: {
        continuous: {
          ENG: { pos: [0.05, 0.15, 0.35, 0.30, 0.15] },
          COM: { pos: [0.06, 0.12, 0.30, 0.32, 0.20] }
        }
      },
      // V1: "Avoid entirely — politics ruins social situations"
      avoid_entirely: {
        continuous: {
          ENG: { pos: [0.40, 0.30, 0.18, 0.08, 0.04] },
          COM: { pos: [0.08, 0.15, 0.28, 0.30, 0.19] }
        }
      },
      // V1: "Try to change the subject — not the place"
      change_subject: {
        continuous: {
          ENG: { pos: [0.30, 0.30, 0.25, 0.10, 0.05] },
          COM: { pos: [0.05, 0.12, 0.28, 0.35, 0.20] }
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
          COM: { pos: [0.04, 0.10, 0.25, 0.35, 0.26] }
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
      { node: "ONT_S", kind: "continuous", role: "position", weight: 0.20, touchType: "policy_bundle" }
    ],
    optionEvidence: {
      aggressive_transition: {
        continuous: {
          MAT: { pos: [0.35, 0.35, 0.20, 0.08, 0.02] },
          ONT_S: { pos: [0.27, 0.35, 0.25, 0.10, 0.03] }
        }
      },
      gradual_transition: {
        continuous: {
          MAT: { pos: [0.10, 0.24, 0.40, 0.18, 0.08] },
          ONT_S: { pos: [0.10, 0.24, 0.40, 0.18, 0.08] }
        }
      },
      market_led: {
        continuous: {
          MAT: { pos: [0.04, 0.09, 0.22, 0.35, 0.30] },
          ONT_S: { pos: [0.04, 0.10, 0.20, 0.42, 0.24] }
        }
      },
      no_action_needed: {
        continuous: {
          MAT: { pos: [0.03, 0.07, 0.15, 0.30, 0.45] },
          ONT_S: { pos: [0.05, 0.10, 0.25, 0.30, 0.30] }
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
      { node: "MOR", kind: "continuous", role: "position", weight: 0.20, touchType: "fairness_design" }
    ],
    optionEvidence: {
      strict_merit: {
        continuous: {
          MAT: { pos: [0.02, 0.05, 0.13, 0.30, 0.50] },
          MOR: { pos: [0.35, 0.30, 0.22, 0.09, 0.04] }
        }
      },
      holistic_review: {
        continuous: {
          MAT: { pos: [0.15, 0.30, 0.35, 0.15, 0.05] },
          MOR: { pos: [0.05, 0.12, 0.30, 0.33, 0.20] }
        }
      },
      affirmative_action: {
        continuous: {
          MAT: { pos: [0.40, 0.34, 0.18, 0.06, 0.02] },
          MOR: { pos: [0.03, 0.08, 0.22, 0.35, 0.32] }
        }
      },
      lottery: {
        continuous: {
          MAT: { pos: [0.19, 0.28, 0.30, 0.15, 0.08] }
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
    quality: 0.40,
    rewriteNeeded: true,
    touchProfile: [
      { node: "PRO", kind: "continuous", role: "position", weight: 0.30, touchType: "policy_bundle" },
      { node: "ONT_H", kind: "continuous", role: "position", weight: 0.20, touchType: "policy_bundle" }
    ],
    optionEvidence: {
      rehabilitation_focus: {
        continuous: {
          PRO: { pos: [0.05, 0.12, 0.25, 0.35, 0.23] },
          ONT_H: { pos: [0.04, 0.10, 0.25, 0.38, 0.23] }
        },
      },
      balanced_approach: {
        continuous: {
          PRO: { pos: [0.10, 0.20, 0.40, 0.20, 0.10] }
        },
      },
      punishment_focus: {
        continuous: {
          PRO: { pos: [0.30, 0.35, 0.22, 0.09, 0.04] },
          ONT_H: { pos: [0.25, 0.33, 0.25, 0.12, 0.05] }
        },
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
      { node: "MAT", kind: "continuous", role: "position", weight: 0.90, touchType: "fairness_threshold" }
    ],
    optionEvidence: {
      ratio_10_to_1: {
        continuous: {
          MAT: { pos: [0.45, 0.35, 0.15, 0.04, 0.01] }
        }
      },
      ratio_100_to_1: {
        continuous: {
          MAT: { pos: [0.10, 0.25, 0.35, 0.20, 0.10] }
        }
      },
      ratio_1000_to_1: {
        continuous: {
          MAT: { pos: [0.04, 0.10, 0.25, 0.35, 0.26] }
        }
      },
      market_decides: {
        continuous: {
          MAT: { pos: [0.03, 0.07, 0.15, 0.30, 0.45] }
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
      { node: "ONT_H", kind: "continuous", role: "position", weight: 0.90, touchType: "malleability_capacity" }
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
          ONT_H: { pos: [0.04, 0.12, 0.30, 0.35, 0.19] }
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
          ONT_H: { pos: [0.42, 0.30, 0.18, 0.07, 0.03] }
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
      { node: "PRO", kind: "continuous", role: "salience", weight: 0.70, touchType: "error_asymmetry_ratio" },
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
          PRO: { pos: [0.02, 0.08, 0.20, 0.35, 0.35] },
          MOR: { pos: [0.08, 0.18, 0.30, 0.26, 0.18] }
        },
      },
      free_guilty: {
        continuous: {
          PRO: { pos: [0.35, 0.35, 0.20, 0.08, 0.02] },
          MOR: { pos: [0.18, 0.26, 0.30, 0.18, 0.08] }
        },
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
          MOR: { pos: [0.27, 0.35, 0.25, 0.10, 0.03] },
          PRO: { pos: [0.10, 0.18, 0.32, 0.24, 0.16] }
        }
      },
      fn: {
        continuous: {
          MAT: { pos: [0.33, 0.35, 0.22, 0.08, 0.02] },
          MOR: { pos: [0.03, 0.10, 0.25, 0.35, 0.27] },
          PRO: { pos: [0.16, 0.24, 0.32, 0.18, 0.10] }
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
          CU: { pos: [0.04, 0.10, 0.25, 0.35, 0.26] }
        },
      },
      comply_reluctantly: {
        continuous: {
          PRO: { pos: [0.10, 0.20, 0.40, 0.20, 0.10] },
          CU: { pos: [0.10, 0.20, 0.35, 0.25, 0.10] }
        }
      },
      resist_mandate: {
        continuous: {
          PRO: { pos: [0.04, 0.10, 0.20, 0.32, 0.34] },
          CU: { pos: [0.28, 0.30, 0.25, 0.12, 0.05] }
        },
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
    quality: 0.90,
    rewriteNeeded: false,
    options: ["allow_harmful", "censor_legitimate", "equal_errors"],
    touchProfile: [
      { node: "PRO", kind: "continuous", role: "position", weight: 0.72, touchType: "speech_harm_tradeoff" },
      { node: "PRO", kind: "continuous", role: "salience", weight: 0.65, touchType: "speech_harm_ratio" },
      { node: "EPS", kind: "categorical", role: "category", weight: 0.20, touchType: "truth_authority_proxy" },
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
          COM: { pos: [0.18, 0.24, 0.30, 0.18, 0.10] }
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
          PRO: { pos: [0.18, 0.30, 0.30, 0.15, 0.07] },
          COM: { pos: [0.10, 0.18, 0.30, 0.24, 0.18] }
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
    quality: 0.90,
    rewriteNeeded: false,
    touchProfile: [
      { node: "ZS", kind: "continuous", role: "position", weight: 0.85, touchType: "macro_sum_view" },
      { node: "ZS", kind: "continuous", role: "salience", weight: 0.50, touchType: "macro_sum_view" },
      { node: "ONT_S", kind: "continuous", role: "position", weight: 0.45, touchType: "systems_view" }
    ],
    optionEvidence: {
      net_positive_clear: {
        continuous: {
          ZS: { pos: [0.41, 0.38, 0.15, 0.05, 0.01], sal: [0.45, 0.30, 0.18, 0.07] },
          ONT_S: { pos: [0.24, 0.38, 0.25, 0.10, 0.03] }
        }
      },
      net_positive_but_uneven: {
        continuous: {
          ZS: { pos: [0.15, 0.30, 0.35, 0.15, 0.05], sal: [0.15, 0.35, 0.35, 0.15] },
          ONT_S: { pos: [0.12, 0.28, 0.40, 0.15, 0.05] }
        }
      },
      mixed_effects: {
        continuous: {
          ZS: { pos: [0.07, 0.18, 0.35, 0.25, 0.15], sal: [0.10, 0.28, 0.40, 0.22] },
          ONT_S: { pos: [0.08, 0.20, 0.40, 0.22, 0.10] }
        }
      },
      mostly_harmful: {
        continuous: {
          ZS: { pos: [0.03, 0.07, 0.18, 0.30, 0.42], sal: [0.05, 0.15, 0.35, 0.45] },
          ONT_S: { pos: [0.05, 0.12, 0.28, 0.30, 0.25] }
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
          PRO: { pos: [0.06, 0.12, 0.26, 0.30, 0.26] },
          CU: { pos: [0.06, 0.12, 0.24, 0.30, 0.28] },
          ONT_S: { pos: [0.16, 0.20, 0.30, 0.22, 0.12] }
        }
      },
      let_stay_illegal: {
        continuous: {
          PRO: { pos: [0.26, 0.30, 0.26, 0.12, 0.06] },
          CU: { pos: [0.28, 0.30, 0.24, 0.12, 0.06] },
          ONT_S: { pos: [0.12, 0.22, 0.30, 0.20, 0.16] }
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
      { node: "TRB", kind: "continuous", role: "position", weight: 0.20, touchType: "threat_bundle" }
    ],
    optionEvidence: {
      external_threats: {
        continuous: {
          ZS: { pos: [0.30, 0.30, 0.25, 0.10, 0.05] },
          TRB: { pos: [0.08, 0.15, 0.28, 0.30, 0.19] }
        }
      },
      internal_division: {
        continuous: {
          ZS: { pos: [0.05, 0.12, 0.30, 0.33, 0.20] }
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
      { node: "EPS", kind: "categorical", role: "category", weight: 0.20, touchType: "expertise_risk_proxy" }
    ],
    optionEvidence: {
      prioritize_safety: {
        continuous: {
          PRO: { pos: [0.04, 0.09, 0.22, 0.35, 0.30] }
        },
        categorical: { EPS: { cat: EPS_PROTOTYPES.institutionalist } }
      },
      balanced_timeline: {
        continuous: {
          PRO: { pos: [0.08, 0.22, 0.38, 0.22, 0.10] }
        },
        categorical: { EPS: { cat: EPS_PROTOTYPES.empiricist } }
      },
      prioritize_speed: {
        continuous: {
          PRO: { pos: [0.30, 0.35, 0.22, 0.09, 0.04] }
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
    quality: 0.80,
    rewriteNeeded: false,
    touchProfile: [
      { node: "PRO", kind: "continuous", role: "position", weight: 0.60, touchType: "rule_response" },
      { node: "COM", kind: "continuous", role: "position", weight: 0.25, touchType: "rule_response" }
    ],
    optionEvidence: {
      follow_always: {
        continuous: {
          PRO: { pos: [0.03, 0.07, 0.18, 0.32, 0.40] }
        }
      },
      follow_then_advocate: {
        continuous: {
          PRO: { pos: [0.07, 0.20, 0.38, 0.25, 0.10] },
          COM: { pos: [0.05, 0.12, 0.28, 0.33, 0.22] }
        }
      },
      ignore_quietly: {
        continuous: {
          PRO: { pos: [0.29, 0.35, 0.22, 0.10, 0.04] }
        }
      },
      openly_challenge: {
        continuous: {
          PRO: { pos: [0.40, 0.32, 0.18, 0.07, 0.03] },
          COM: { pos: [0.22, 0.28, 0.25, 0.15, 0.10] }
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
    quality: 0.90,
    rewriteNeeded: false,
    touchProfile: [
      { node: "PRO", kind: "continuous", role: "position", weight: 0.70, touchType: "error_asymmetry" },
      { node: "TRB", kind: "continuous", role: "position", weight: 0.15, touchType: "partisan_fairness_proxy" }
    ],
    optionEvidence: {
      easier_access: {
        continuous: {
          PRO: { pos: [0.04, 0.10, 0.22, 0.34, 0.30] }
        }
      },
      balanced_approach: {
        continuous: {
          PRO: { pos: [0.10, 0.22, 0.38, 0.22, 0.08] }
        }
      },
      tighter_security: {
        continuous: {
          PRO: { pos: [0.30, 0.34, 0.22, 0.10, 0.04] },
          TRB: { pos: [0.10, 0.18, 0.28, 0.28, 0.16] }
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
      { node: "TRB", kind: "continuous", role: "position", weight: 0.90, touchType: "network_homophily" }
    ],
    optionEvidence: {
      no_big_deal: {
        continuous: {
          TRB: { pos: [0.42, 0.38, 0.15, 0.04, 0.01] }
        }
      },
      keep_friendship: {
        continuous: {
          TRB: { pos: [0.19, 0.30, 0.35, 0.12, 0.04] }
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
      { node: "MAT", kind: "continuous", role: "position", weight: 0.70, touchType: "distributive_choice" }
    ],
    optionEvidence: {
      equal_society: {
        continuous: {
          MAT: { pos: [0.48, 0.35, 0.12, 0.04, 0.01] }
        }
      },
      safety_net_society: {
        continuous: {
          MAT: { pos: [0.20, 0.34, 0.30, 0.12, 0.04] }
        }
      },
      opportunity_society: {
        continuous: {
          MAT: { pos: [0.06, 0.14, 0.32, 0.30, 0.18] }
        }
      },
      free_market_society: {
        continuous: {
          MAT: { pos: [0.03, 0.07, 0.15, 0.30, 0.45] }
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
      { node: "COM", kind: "continuous", role: "position", weight: 0.70, touchType: "interpersonal_conflict" }
    ],
    optionEvidence: {
      avoid_if_possible: {
        continuous: {
          COM: { pos: [0.03, 0.10, 0.25, 0.35, 0.27] }
        }
      },
      engage_carefully: {
        continuous: {
          COM: { pos: [0.06, 0.15, 0.35, 0.28, 0.16] }
        }
      },
      stand_ground: {
        continuous: {
          COM: { pos: [0.20, 0.30, 0.28, 0.15, 0.07] }
        }
      },
      enjoy_debate: {
        continuous: {
          COM: { pos: [0.35, 0.30, 0.20, 0.10, 0.05] }
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
      { node: "ONT_H", kind: "continuous", role: "position", weight: 0.70, touchType: "malleability_mechanism" },
      { node: "ONT_S", kind: "continuous", role: "position", weight: 0.55, touchType: "malleability_mechanism" },
      { node: "MAT",   kind: "continuous", role: "position", weight: 0.35, touchType: "malleability_mechanism" },
      { node: "CD",    kind: "continuous", role: "position", weight: 0.25, touchType: "malleability_mechanism" }
    ],
    optionEvidence: {
      // "Strong state institutions — laws, programs, public education, agencies"
      // Progressive: high malleability via state. High ONT_H, high ONT_S, low MAT
      // (state-redistributionist), low CD (progressive direction).
      state_institutions: {
        continuous: {
          ONT_H: { pos: [0.02, 0.05, 0.18, 0.38, 0.37] },
          ONT_S: { pos: [0.02, 0.06, 0.18, 0.34, 0.40] },
          MAT:   { pos: [0.30, 0.32, 0.22, 0.10, 0.06] },
          CD:    { pos: [0.30, 0.30, 0.22, 0.12, 0.06] }
        }
      },
      // "Family, community, and local relationships — close human bonds"
      // Communitarian / pastoral. High malleability via local. Mid-low ONT_S
      // (institutions matter but not state), mid MAT, mid CD.
      family_community_tradition: {
        continuous: {
          ONT_H: { pos: [0.04, 0.10, 0.25, 0.35, 0.26] },
          ONT_S: { pos: [0.18, 0.30, 0.30, 0.15, 0.07] },
          MAT:   { pos: [0.10, 0.20, 0.35, 0.22, 0.13] },
          CD:    { pos: [0.10, 0.20, 0.30, 0.25, 0.15] }
        }
      },
      // "Markets, trade, and innovation — economic dynamism shapes behavior"
      // Classical liberal / market liberal. Mid ONT_H (markets discipline
      // behavior but don't really cultivate virtue), low ONT_S (state
      // institutions less essential), high MAT (free market).
      market_innovation: {
        continuous: {
          ONT_H: { pos: [0.08, 0.18, 0.32, 0.27, 0.15] },
          ONT_S: { pos: [0.30, 0.30, 0.22, 0.12, 0.06] },
          MAT:   { pos: [0.04, 0.08, 0.18, 0.32, 0.38] },
          CD:    { pos: [0.10, 0.20, 0.32, 0.22, 0.16] }
        }
      },
      // "Inherited cultural and religious traditions — accumulated wisdom"
      // Burkean / traditionalist. High malleability via tradition. Low/mid
      // ONT_S, mid MAT, high CD (traditional direction).
      cultural_inherited: {
        continuous: {
          ONT_H: { pos: [0.04, 0.10, 0.25, 0.35, 0.26] },
          ONT_S: { pos: [0.20, 0.30, 0.28, 0.15, 0.07] },
          MAT:   { pos: [0.10, 0.18, 0.32, 0.25, 0.15] },
          CD:    { pos: [0.04, 0.08, 0.22, 0.32, 0.34] }
        }
      },
      // "Society doesn't really improve — gains are illusory or temporary"
      // Fatalist / nihilist. Very low ONT_H (humans not really malleable),
      // low ONT_S (institutions can't deliver), neutral MAT/CD.
      doesnt_improve: {
        continuous: {
          ONT_H: { pos: [0.42, 0.30, 0.18, 0.07, 0.03] },
          ONT_S: { pos: [0.40, 0.30, 0.18, 0.08, 0.04] },
          MAT:   { pos: [0.20, 0.25, 0.30, 0.15, 0.10] },
          CD:    { pos: [0.18, 0.22, 0.30, 0.18, 0.12] }
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
    quality: 0.40,
    rewriteNeeded: false,
    touchProfile: [],
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
      { node: "EPS", kind: "categorical", role: "category", weight: 0.20, touchType: "leader_evaluation" }
    ],
    optionEvidence: {
      competence_record: {
        categorical: {
          AES: { cat: AES_PROTOTYPES.technocrat },
          EPS: { cat: EPS_PROTOTYPES.empiricist },
        }
      },
      moral_character: {
        categorical: {
          AES: { cat: [0.05, 0.05, 0.40, 0.40, 0.05, 0.05] },
          EPS: { cat: EPS_PROTOTYPES.intuitionist },
        }
      },
      fights_for_us: {
        categorical: {
          AES: { cat: AES_PROTOTYPES.fighter },
          EPS: { cat: EPS_PROTOTYPES.autonomous },
        }
      },
      unifying_vision: {
        categorical: {
          AES: { cat: AES_PROTOTYPES.visionary },
          EPS: { cat: EPS_PROTOTYPES.institutionalist },
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
      { node: "EPS", kind: "categorical", role: "category", weight: 0.30, touchType: "rhetorical_preference" }
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
          AES: { cat: [0.06, 0.05, 0.50, 0.25, 0.05, 0.09] },
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
    quality: 0.90,
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
      { node: "PRO", kind: "continuous", role: "salience", weight: 0.20, touchType: "motive_salience" },
      { node: "COM", kind: "continuous", role: "salience", weight: 0.20, touchType: "motive_salience" },
      { node: "MOR", kind: "continuous", role: "salience", weight: 0.20, touchType: "motive_salience" },
      { node: "PF", kind: "continuous", role: "position", weight: 0.25, touchType: "motive_activation" },
      { node: "TRB", kind: "continuous", role: "position", weight: 0.25, touchType: "motive_activation" },
      { node: "ENG", kind: "continuous", role: "position", weight: 0.30, touchType: "motive_activation" },
      { node: "EPS", kind: "categorical", role: "category", weight: 0.20, touchType: "motive_salience" }
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
          PF: { pos: [0.04, 0.10, 0.24, 0.35, 0.27] }
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
          ENG: { pos: [0.02, 0.06, 0.20, 0.38, 0.34] },
          TRB: { pos: [0.08, 0.16, 0.30, 0.28, 0.18] }
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
          ENG: { pos: [0.05, 0.15, 0.35, 0.30, 0.15] }
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
      "follow_money_breaks_tie",
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
        categorical: { EPS: { cat: [0.04, 0.66, 0.10, 0.05, 0.10, 0.05] } }
      },
      // Direct primary-source evidence wins → empiricist
      primary_evidence_breaks_tie: {
        categorical: { EPS: { cat: [0.62, 0.16, 0.04, 0.06, 0.10, 0.02] } }
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
        categorical: { EPS: { cat: [0.06, 0.04, 0.06, 0.06, 0.18, 0.60] } }
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
      { node: "MAT", kind: "continuous", role: "position", weight: 0.70, touchType: "economic_attribution" },
      { node: "ONT_S", kind: "continuous", role: "position", weight: 0.30, touchType: "economic_attribution" },
      { node: "CU", kind: "continuous", role: "position", weight: 0.20, touchType: "trade_protectionism" }
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
        trbAnchor: { ideological: 0.40, class: 0.25, mixed_none: 0.15 }
      },
      procedural_integrity: {
        continuous: { PRO: 0.65, COM: 0.25 },
        trbAnchor: { ideological: 0.45, national: 0.20, mixed_none: 0.15 }
      },
      national_strength: {
        continuous: { CU: -0.45, TRB: 0.45, ZS: -0.25 },
        trbAnchor: { national: 0.60, ethnic_racial: 0.20 }
      },
      community_bonds: {
        continuous: { COM: 0.45, TRB: -0.25, MOR: 0.35 },
        trbAnchor: { religious: 0.35, national: 0.25, ethnic_racial: 0.15, mixed_none: 0.10 }
      },
      individual_freedom: {
        continuous: { PRO: 0.55 },
        trbAnchor: { ideological: 0.45, mixed_none: 0.25, class: 0.10 }
      },
      tradition_continuity: {
        continuous: { CD: -0.45, CU: -0.35 },
        trbAnchor: { religious: 0.40, national: 0.30, ethnic_racial: 0.10 }
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
      { node: "ONT_S", kind: "continuous", role: "position", weight: 0.80, touchType: "grievance_proxy" },
      { node: "PRO", kind: "continuous", role: "position", weight: 0.15, touchType: "grievance_proxy" },
      { node: "CD", kind: "continuous", role: "position", weight: 0.20, touchType: "grievance_proxy" },
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
          ONT_S: { pos: [0.20, 0.30, 0.30, 0.15, 0.05] }
        }
      },
      // "Government has grown too large and intrusive, individual freedom is eroding"
      government_overreach: {
        continuous: {
          ONT_S: { pos: [0.20, 0.28, 0.28, 0.16, 0.08] },
          PRO: { pos: [0.18, 0.28, 0.30, 0.16, 0.08] }
        }
      },
      // "Both sides are more interested in fighting than solving real problems"
      both_sides_broken: {
        continuous: {
          ONT_S: { pos: [0.30, 0.32, 0.22, 0.12, 0.04] }
        }
      },
      // "The system itself is fundamentally unjust and needs radical change"
      // Kept sharp — this is the option where ONT_S=1 is the actual semantic claim
      system_unjust: {
        continuous: {
          ONT_S: { pos: [0.55, 0.28, 0.10, 0.05, 0.02] }
        }
      },
      // "Traditional values and social cohesion are being abandoned"
      values_eroding: {
        continuous: {
          CD: { pos: [0.03, 0.07, 0.15, 0.30, 0.45] },
          ONT_S: { pos: [0.20, 0.28, 0.28, 0.16, 0.08] }
        }
      },
      // "I don't think much about politics — it doesn't affect my daily life"
      politics_irrelevant: {
        continuous: {
          ENG: { pos: [0.62, 0.22, 0.10, 0.04, 0.02] }
        }
      },
      // "I'm not especially frustrated — the system works reasonably well"
      // Added 2026-04-24 per diagnose-cu-trb-coverage finding: every prior
      // option peaked ONT_S at pos=1-2, dragging even system-trusting
      // respondents toward "system broken". This option anchors the high pole.
      system_works: {
        continuous: {
          ONT_S: { pos: [0.03, 0.07, 0.15, 0.30, 0.45] }
        }
      }
    }
  }

  /* Q65, Q67, Q68 — evidence maps miscalibrated, need recalibration.
     The older Q66 copy remains here for history; active Q66 was re-enabled
     below after allocation-pattern extraction was added.
     See src/optimize/questionDiag.ts for individual impact analysis.
  // Q65 — Party-Culture Conflict Response (PF salience + CD salience joint)
  ,{
    id: 65,
    stage: "stage2",
    section: "VI",
    promptShort: "party_culture_conflict_response",
    uiType: "single_choice",
    quality: 0.90,
    rewriteNeeded: false,
    touchProfile: [
      { node: "CD", kind: "continuous", role: "salience", weight: 0.55, touchType: "cultural_salience" },
      { node: "COM", kind: "continuous", role: "position", weight: 0.25, touchType: "pragmatism_proxy" }
    ],
    optionEvidence: {
      vote_party_anyway: {
        continuous: {
          COM: { pos: [0.05, 0.12, 0.25, 0.33, 0.25] }
        }
      },
      vote_other_party: {
        continuous: {
        }
      },
      stay_home: {
        continuous: {
          ENG: { pos: [0.50, 0.30, 0.12, 0.05, 0.03] }
        }
      },
      look_for_independent: {
        continuous: {
          COM: { pos: [0.35, 0.30, 0.20, 0.10, 0.05] }
        }
      }
    }
  },

  // Q66 — Community Fund Allocation (CD + PRO joint)
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
      { node: "PRO", kind: "continuous", role: "position", weight: 0.60, touchType: "governance_allocation" },
      { node: "MAT", kind: "continuous", role: "position", weight: 0.20, touchType: "economic_proxy" },
      { node: "COM", kind: "continuous", role: "position", weight: 0.35, touchType: "governance_allocation" },
      { node: "EPS", kind: "categorical", role: "category", weight: 0.10, touchType: "allocation_shape_epistemic" },
      { node: "AES", kind: "categorical", role: "category", weight: 0.35, touchType: "civic_style_allocation" }
    ],
    allocationMap: {
      preserve_heritage: {
        continuous: { CD: 0.7, PRO: -0.2 },
        categorical: { AES: [0.08, 0.05, 0.55, 0.16, 0.04, 0.12] }
      },
      modernize_infrastructure: {
        continuous: { CD: -0.2, PRO: 0.2, MAT: 0.2 },
        categorical: { AES: [0.10, 0.60, 0.04, 0.06, 0.03, 0.17] }
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

  // Q67 — Universal vs Local Obligations (CU + MOR + ZS joint — pairwise)
  {
    id: 67,
    stage: "stage2",
    section: "VI",
    promptShort: "universal_vs_local_obligations",
    uiType: "pairwise",
    quality: 0.92,
    rewriteNeeded: false,
    touchProfile: [
      { node: "CU", kind: "continuous", role: "position", weight: 0.70, touchType: "scope_tradeoff" },
      { node: "MOR", kind: "continuous", role: "position", weight: 0.80, touchType: "scope_tradeoff" },
      { node: "ZS", kind: "continuous", role: "position", weight: 0.40, touchType: "resource_view" }
    ],
    pairMaps: {
      own_community_vs_strangers_abroad: {
        protect_own_community: {
          continuous: { CU: -0.7, MOR: -0.8, ZS: 0.4 }
        },
        protect_strangers_abroad: {
          continuous: { CU: 0.7, MOR: 0.8, ZS: -0.4 }
        }
      },
      national_sovereignty_vs_international_coop: {
        national_sovereignty: {
          continuous: { CU: -0.6, MOR: -0.5, ZS: 0.5 }
        },
        international_cooperation: {
          continuous: { CU: 0.6, MOR: 0.5, ZS: -0.5 }
        }
      },
      local_charity_vs_global_aid: {
        local_charity: {
          continuous: { MOR: -0.6, CU: -0.4 }
        },
        global_aid: {
          continuous: { MOR: 0.6, CU: 0.4 }
        }
      }
    }
  },

  // Q68 — Opponent Success Response (COM + ONT_H joint)
  {
    id: 68,
    stage: "stage2",
    section: "VI",
    promptShort: "opponent_success_response",
    uiType: "single_choice",
    quality: 0.91,
    rewriteNeeded: false,
    touchProfile: [
      { node: "COM", kind: "continuous", role: "position", weight: 0.80, touchType: "compromise_proxy" },
      { node: "ONT_H", kind: "continuous", role: "position", weight: 0.45, touchType: "optimism_proxy" },
      { node: "ZS", kind: "continuous", role: "position", weight: 0.25, touchType: "zero_sum_proxy" }
    ],
    optionEvidence: {
      maybe_good_outcome: {
        continuous: {
          COM: { pos: [0.02, 0.05, 0.15, 0.38, 0.40] },
          ONT_H: { pos: [0.02, 0.05, 0.20, 0.40, 0.33] },
          ZS: { pos: [0.35, 0.30, 0.20, 0.10, 0.05] }
        }
      },
      worried_but_accept: {
        continuous: {
          COM: { pos: [0.05, 0.15, 0.40, 0.25, 0.15] },
          ONT_H: { pos: [0.05, 0.15, 0.40, 0.25, 0.15] },
          ZS: { pos: [0.10, 0.20, 0.35, 0.25, 0.10] }
        }
      },
      fight_to_reverse: {
        continuous: {
          COM: { pos: [0.40, 0.30, 0.15, 0.10, 0.05] },
          ONT_H: { pos: [0.20, 0.30, 0.30, 0.15, 0.05] },
          ZS: { pos: [0.05, 0.10, 0.20, 0.30, 0.35] }
        }
      },
      system_broken: {
        continuous: {
          COM: { pos: [0.55, 0.25, 0.12, 0.05, 0.03] },
          ONT_H: { pos: [0.40, 0.30, 0.18, 0.08, 0.04] },
          ZS: { pos: [0.02, 0.05, 0.13, 0.30, 0.50] }
        }
      }
    }
  },
  */ // end Q65-Q68 comment block

  // Q66 — Community Fund Allocation. Re-enabled 2026-04-26 after pattern
  // extraction added COM/EPS/AES signals and pair-level allocation rules.
  // EPS/category row dropped 2026-05-03 per question-information audit:
  // allocationMap has no EPS entries (only AES). The "EPS extraction" comment
  // above predated the actual evidence-map pruning.
  ,{
    id: 66,
    stage: "stage2",
    section: "VI",
    promptShort: "community_fund_allocation",
    uiType: "allocation",
    quality: 0.89,
    rewriteNeeded: false,
    touchProfile: [
      { node: "CD", kind: "continuous", role: "position", weight: 0.75, touchType: "value_allocation" },
      { node: "PRO", kind: "continuous", role: "position", weight: 0.60, touchType: "governance_allocation" },
      { node: "MAT", kind: "continuous", role: "position", weight: 0.20, touchType: "economic_proxy" },
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
        categorical: { AES: [0.10, 0.60, 0.04, 0.06, 0.03, 0.17] }
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
  }

  // Q69 — Common Ground Salience (COM salience via slider)
  // Re-enabled: Q72 was removed, so interaction no longer applies.
  ,{
    id: 69,
    stage: "stage2",
    section: "VI",
    promptShort: "common_ground_salience",
    uiType: "slider",
    quality: 0.91,
    rewriteNeeded: false,
    touchProfile: [
      { node: "COM", kind: "continuous", role: "salience", weight: 0.90, touchType: "direct_salience" }
    ],
    sliderMap: {
      "0-20":   { continuous: { COM: { sal: [0.55, 0.30, 0.12, 0.03] } } },
      "21-40":  { continuous: { COM: { sal: [0.25, 0.42, 0.25, 0.08] } } },
      "41-60":  { continuous: { COM: { sal: [0.10, 0.28, 0.40, 0.22] } } },
      "61-80":  { continuous: { COM: { sal: [0.04, 0.12, 0.38, 0.46] } } },
      "81-100": { continuous: { COM: { sal: [0.02, 0.08, 0.30, 0.60] } } }
    }
  }

  /* Q70 — needs recalibration: breaks 029 Liberationist Progressive, 052 Distributist Localist
  // Q70 — Zero-Sum Politics (ZS salience + position)
  {
    id: 70,
    stage: "stage2",
    section: "VI",
    promptShort: "zero_sum_politics_view",
    uiType: "slider",
    quality: 0.90,
    rewriteNeeded: false,
    touchProfile: [
      { node: "ZS", kind: "continuous", role: "salience", weight: 0.85, touchType: "direct_salience" },
      { node: "ZS", kind: "continuous", role: "position", weight: 0.50, touchType: "direct_placement" }
    ],
    sliderMap: {
      "0-20":   { continuous: { ZS: { pos: [0.55, 0.25, 0.12, 0.05, 0.03] } } },
      "21-40":  { continuous: { ZS: { pos: [0.25, 0.35, 0.25, 0.10, 0.05] } } },
      "41-60":  { continuous: { ZS: { pos: [0.08, 0.18, 0.40, 0.22, 0.12] } } },
      "61-80":  { continuous: { ZS: { pos: [0.04, 0.08, 0.20, 0.38, 0.30] } } },
      "81-100": { continuous: { ZS: { pos: [0.02, 0.05, 0.10, 0.25, 0.58] } } }
    }
  },
  */ // end Q70 comment block

  // Q71 — Re-enabled: Q72 was removed, so interaction no longer applies.
  ,{
    id: 71,
    stage: "stage2",
    section: "VI",
    promptShort: "rhetoric_style_importance",
    uiType: "slider",
    quality: 0.88,
    rewriteNeeded: false,
    touchProfile: [
      { node: "AES", kind: "categorical", role: "salience", weight: 0.90, touchType: "direct_salience" }
    ],
    sliderMap: {
      "0-20":   { categorical: { AES: { sal: [0.55, 0.30, 0.12, 0.03] } } },
      "21-40":  { categorical: { AES: { sal: [0.25, 0.40, 0.25, 0.10] } } },
      "41-60":  { categorical: { AES: { sal: [0.08, 0.28, 0.40, 0.24] } } },
      "61-80":  { categorical: { AES: { sal: [0.03, 0.12, 0.40, 0.45] } } },
      "81-100": { categorical: { AES: { sal: [0.02, 0.08, 0.30, 0.60] } } }
    }
  }

  /* Q72 removed — PRO+COM process/outcome tradeoff is already well-covered
     by existing questions in the bank. */

  /* Q73-Q75 — needs recalibration: Q73 breaks 119, Q74 breaks 10 archetypes, Q75 breaks 050
  // Q73 — Inequality Solutions Ranking (MAT + PRO joint)
  {
    id: 73,
    stage: "stage2",
    section: "VI",
    promptShort: "inequality_solutions_ranking",
    uiType: "ranking",
    quality: 0.90,
    rewriteNeeded: false,
    touchProfile: [
      { node: "MAT", kind: "continuous", role: "position", weight: 0.70, touchType: "economic_ranking" },
      { node: "PRO", kind: "continuous", role: "position", weight: 0.40, touchType: "governance_ranking" },
      { node: "COM", kind: "continuous", role: "position", weight: 0.20, touchType: "pragmatism_proxy" }
    ],
    rankingMap: {
      free_market_growth: { continuous: { MAT: 0.9, PRO: -0.5 } },
      government_redistribution: { continuous: { MAT: -0.8, PRO: 0.4 } },
      strong_regulations: { continuous: { PRO: 0.7, MAT: -0.3 } },
      community_mutual_aid: { continuous: { COM: 0.6, MAT: -0.3, PRO: -0.3 } },
      charitable_giving: { continuous: { MAT: 0.4, COM: 0.3 } }
    }
  },

  // Q74 — Culture vs Diversity Scope (MOR + CD pairwise)
  {
    id: 74,
    stage: "stage2",
    section: "VI",
    promptShort: "culture_vs_diversity_scope",
    uiType: "pairwise",
    quality: 0.91,
    rewriteNeeded: false,
    touchProfile: [
      { node: "MOR", kind: "continuous", role: "position", weight: 0.70, touchType: "moral_scope" },
      { node: "CD", kind: "continuous", role: "position", weight: 0.65, touchType: "cultural_direction" },
      { node: "CU", kind: "continuous", role: "position", weight: 0.30, touchType: "universalism_proxy" }
    ],
    pairMaps: {
      preserve_culture_vs_embrace_diversity: {
        preserve_culture: {
          continuous: { CD: -0.7, MOR: -0.5, CU: -0.4 }
        },
        embrace_diversity: {
          continuous: { CD: 0.5, MOR: 0.5, CU: 0.4 }
        }
      },
      national_obligations_vs_global_obligations: {
        national_obligations_first: {
          continuous: { MOR: -0.7, CU: -0.5, CD: -0.3 }
        },
        global_obligations_first: {
          continuous: { MOR: 0.7, CU: 0.5, CD: 0.3 }
        }
      }
    }
  },

  // Q75 — Cross-Party Marriage (TRB + PF joint)
  {
    id: 75,
    stage: "stage2",
    section: "VI",
    promptShort: "cross_party_marriage_comfort",
    uiType: "single_choice",
    quality: 0.92,
    rewriteNeeded: false,
    touchProfile: [
      { node: "TRB", kind: "continuous", role: "position", weight: 0.70, touchType: "network_homophily" },
      { node: "PF", kind: "continuous", role: "position", weight: 0.30, touchType: "partisan_intensity" }
    ],
    optionEvidence: {
      no_problem: {
        continuous: {
          TRB: { pos: [0.45, 0.30, 0.15, 0.07, 0.03] },
        }
      },
      slight_discomfort: {
        continuous: {
          TRB: { pos: [0.10, 0.25, 0.35, 0.20, 0.10] },
        }
      },
      serious_concern: {
        continuous: {
          TRB: { pos: [0.03, 0.07, 0.15, 0.35, 0.40] },
        }
      },
      very_upset: {
        continuous: {
          TRB: { pos: [0.01, 0.03, 0.06, 0.20, 0.70] },
        }
      }
    }
  }
  */ // end Q73-Q75 comment block

  // ── Coverage-gap fillers (Q76-Q79) ──────────────────────────────
  // Q76 — Success Attribution (REMOVED — duplicates inequality_causes allocation question)
  /*
  ,{
    id: 76,
    stage: "stage2",
    section: "IV",
    promptShort: "success_attribution",
    uiType: "single_choice",
    quality: 0.91,
    rewriteNeeded: false,
    touchProfile: [
      { node: "ONT_S", kind: "continuous", role: "position",  weight: 0.90, touchType: "causal_attribution" },
      { node: "ONT_S", kind: "continuous", role: "salience",  weight: 0.40, touchType: "causal_attribution" },
      { node: "ZS",    kind: "continuous", role: "position",  weight: 0.20, touchType: "distributional_worldview" },
      { node: "ONT_S", kind: "continuous", role: "salience",  weight: 0.85, touchType: "checkbox_salience" }
    ],
    optionEvidence: {
      hard_work_talent: {
        continuous: {
          ONT_S: { pos: [0.62, 0.22, 0.10, 0.04, 0.02] },
          ZS:    { pos: [0.35, 0.30, 0.22, 0.09, 0.04] }
        }
      },
      good_choices: {
        continuous: {
          ONT_S: { pos: [0.22, 0.48, 0.20, 0.07, 0.03] },
          ZS:    { pos: [0.25, 0.35, 0.25, 0.10, 0.05] }
        }
      },
      right_connections: {
        continuous: {
          ONT_S: { pos: [0.06, 0.14, 0.48, 0.22, 0.10] },
          ZS:    { pos: [0.08, 0.18, 0.38, 0.24, 0.12] }
        }
      },
      system_advantages: {
        continuous: {
          ONT_S: { pos: [0.02, 0.06, 0.15, 0.45, 0.32] },
          ZS:    { pos: [0.05, 0.10, 0.25, 0.35, 0.25] }
        }
      },
      whole_system: {
        continuous: {
          ONT_S: { pos: [0.01, 0.03, 0.08, 0.28, 0.60] },
          ZS:    { pos: [0.03, 0.07, 0.18, 0.32, 0.40] }
        }
      }
    }
  },

  */ // end Q76 comment block

  // Q77 — Decision-Making Style (EPS intuitionist + nihilist coverage)
  // Life-decision framing (not political) avoids priming institutional answers.
  // "gut_feeling" gives intuitionist a dignified path; "cant_predict" normalizes nihilism.
  ,{
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
      { node: "EPS", kind: "categorical", role: "category",  weight: 0.95, touchType: "decision_style" }
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
          AES: { cat: AES_PROTOTYPES.plainspoken }
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
      { node: "AES", kind: "categorical", role: "category",  weight: 0.88, touchType: "rhetorical_preference" },
      { node: "AES", kind: "categorical", role: "salience",  weight: 0.40, touchType: "rhetorical_preference" },
      { node: "EPS", kind: "categorical", role: "category",  weight: 0.15, touchType: "style_proxy" }
    ],
    optionEvidence: {
      bridge_builder: {
        categorical: {
          AES: { cat: AES_PROTOTYPES.statesman, sal: [0.10, 0.20, 0.35, 0.35] }
        }
      },
      deep_expertise: {
        categorical: {
          AES: { cat: AES_PROTOTYPES.technocrat, sal: [0.12, 0.23, 0.33, 0.32] }
        }
      },
      community_voice: {
        categorical: {
          AES: { cat: AES_PROTOTYPES.pastoral, sal: [0.10, 0.20, 0.35, 0.35] }
        }
      },
      says_what_they_think: {
        categorical: {
          AES: { cat: AES_PROTOTYPES.plainspoken, sal: [0.08, 0.15, 0.32, 0.45] },
          EPS: { cat: EPS_PROTOTYPES.intuitionist }
        }
      },
      calls_out_power: {
        categorical: {
          AES: { cat: AES_PROTOTYPES.fighter, sal: [0.05, 0.12, 0.30, 0.53] }
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
    quality: 0.90,
    rewriteNeeded: false,
    touchProfile: [
      { node: "EPS", kind: "categorical", role: "category",  weight: 0.92, touchType: "epistemic_response" },
      { node: "EPS", kind: "categorical", role: "salience",  weight: 0.40, touchType: "epistemic_response" },
      { node: "ENG", kind: "continuous", role: "position", weight: 0.15, touchType: "epistemic_withdrawal" },
    ],
    optionEvidence: {
      check_evidence: {
        categorical: {
          EPS: { cat: EPS_PROTOTYPES.empiricist, sal: [0.05, 0.12, 0.33, 0.50] }
        }
      },
      check_credentials: {
        categorical: {
          EPS: { cat: EPS_PROTOTYPES.institutionalist, sal: [0.05, 0.12, 0.33, 0.50] }
        }
      },
      check_values: {
        categorical: {
          EPS: { cat: EPS_PROTOTYPES.traditionalist, sal: [0.05, 0.12, 0.33, 0.50] }
        }
      },
      check_experience: {
        categorical: {
          EPS: { cat: EPS_PROTOTYPES.intuitionist, sal: [0.05, 0.12, 0.33, 0.50] }
        }
      },
      both_wrong: {
        categorical: {
          EPS: { cat: EPS_PROTOTYPES.autonomous, sal: [0.10, 0.20, 0.35, 0.35] }
        }
      },
      tune_out: {
        categorical: {
          EPS: { cat: EPS_PROTOTYPES.nihilist, sal: [0.45, 0.30, 0.15, 0.10] }
        },
        continuous: {
          ENG: { pos: [0.70, 0.20, 0.08, 0.02, 0.00] }
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
      { node: "TRB", kind: "continuous", role: "position", weight: 0.10, touchType: "camp_attachment" }
    ],
    optionEvidence: {
      // A: Say so publicly, even if it weakens my side
      say_so_publicly: {
        continuous: {
          PF:  { pos: [0.55, 0.25, 0.12, 0.05, 0.03] },
          TRB: { pos: [0.40, 0.30, 0.18, 0.08, 0.04] },
          ENG: { pos: [0.05, 0.10, 0.25, 0.35, 0.25] }
        }
      },
      // B: Push back internally, but keep public unity
      push_back_internally: {
        continuous: {
          PF:  { pos: [0.08, 0.15, 0.30, 0.30, 0.17] },
          ENG: { pos: [0.10, 0.20, 0.35, 0.25, 0.10] }
        }
      },
      // C: Stick with my side; the other camp is the real threat
      stick_with_side: {
        continuous: {
          PF:  { pos: [0.03, 0.05, 0.12, 0.25, 0.55] },
          TRB: { pos: [0.04, 0.08, 0.18, 0.30, 0.40] },
          ENG: { pos: [0.05, 0.10, 0.25, 0.35, 0.25] }
        }
      },
      // D: Party labels matter less than whether the position serves the cause
      cause_over_party: {
        continuous: {
          PF:  { pos: [0.55, 0.25, 0.12, 0.05, 0.03] },
          TRB: { pos: [0.25, 0.30, 0.25, 0.12, 0.08] },
          ENG: { pos: [0.03, 0.08, 0.20, 0.35, 0.34] }
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
      { node: "CD", kind: "continuous", role: "position", weight: 0.90, touchType: "cultural_direction" },
      { node: "CU", kind: "continuous", role: "position", weight: 0.88, touchType: "cultural_uniformity" },
      { node: "MOR", kind: "continuous", role: "position", weight: 0.24, touchType: "moral_scope" },
      { node: "MAT", kind: "continuous", role: "position", weight: 0.08, touchType: "economics_signal" }
    ],
    optionEvidence: {
      // A: Preserve inherited culture, tighter limits on openness
      // MOR pos=1 (narrow): cultural in-group preservation → parochial moral scope.
      preserve_culture: {
        continuous: {
          CD:  { pos: [0.02, 0.05, 0.13, 0.30, 0.50] },
          CU:  { pos: [0.50, 0.28, 0.14, 0.05, 0.03] },
          MOR: { pos: [0.40, 0.30, 0.18, 0.08, 0.04] }
        }
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
          CD:  { pos: [0.10, 0.20, 0.40, 0.20, 0.10] },
          CU:  { pos: [0.08, 0.18, 0.32, 0.27, 0.15] },
          MOR: { pos: [0.15, 0.25, 0.35, 0.18, 0.07] }
        }
      },
      // C: Stay open, don't demand cultural convergence
      // MOR pos=5 (wide): cosmopolitan non-convergence → universalist moral scope.
      open_pluralist: {
        continuous: {
          CD:  { pos: [0.50, 0.30, 0.13, 0.05, 0.02] },
          CU:  { pos: [0.03, 0.05, 0.14, 0.28, 0.50] },
          MOR: { pos: [0.05, 0.10, 0.20, 0.30, 0.35] }
        }
      },
      // D: Cultural questions matter less than economic fairness
      // MOR pos=3 (neutral): deflects cultural framing → no MOR signal direction.
      economics_first: {
        continuous: {
          MAT: { pos: [0.40, 0.30, 0.18, 0.08, 0.04] },
          CD:  { pos: [0.15, 0.25, 0.35, 0.15, 0.10] },
          CU:  { pos: [0.15, 0.25, 0.30, 0.20, 0.10] },
          MOR: { pos: [0.15, 0.22, 0.32, 0.20, 0.11] }
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
    quality: 0.90,
    rewriteNeeded: false,
    touchProfile: [
      { node: "ENG", kind: "continuous", role: "position", weight: 0.55, touchType: "mobilization_style" },
      { node: "TRB", kind: "continuous", role: "position", weight: 0.45, touchType: "camp_attachment" },
      { node: "CD", kind: "continuous", role: "position", weight: 0.60, touchType: "cultural_direction" },
      { node: "CU", kind: "continuous", role: "position", weight: 0.25, touchType: "cultural_uniformity" },
      { node: "COM", kind: "continuous", role: "position", weight: 0.20, touchType: "compromise_signal" }
    ],
    optionEvidence: {
      // A: Elites make real decisions and shut ordinary people out
      elite_exclusion: {
        continuous: {
          ENG: { pos: [0.05, 0.10, 0.22, 0.35, 0.28] },
          TRB: { pos: [0.06, 0.12, 0.25, 0.32, 0.25] },
          COM: { pos: [0.30, 0.28, 0.22, 0.12, 0.08] }
        }
      },
      // B: Ordinary people have no one who truly speaks for them
      no_representation: {
        continuous: {
          ENG: { pos: [0.05, 0.10, 0.22, 0.35, 0.28] },
          TRB: { pos: [0.02, 0.05, 0.13, 0.30, 0.50] },
          COM: { pos: [0.15, 0.25, 0.30, 0.18, 0.12] }
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
          CD:  { pos: [0.04, 0.08, 0.18, 0.30, 0.40] },
          CU:  { pos: [0.40, 0.28, 0.18, 0.10, 0.04] },
          ENG: { pos: [0.08, 0.15, 0.30, 0.30, 0.17] },
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
      { node: "ZS", kind: "continuous", role: "position", weight: 0.60, touchType: "zero_sum_institutions" },
      { node: "ZS", kind: "continuous", role: "salience", weight: 0.60, touchType: "zero_sum_institutions" },
      { node: "ONT_H", kind: "continuous", role: "position", weight: 0.20, touchType: "hierarchy_trust" },
      { node: "COM", kind: "continuous", role: "position", weight: 0.25, touchType: "compromise_signal" },
      { node: "PRO", kind: "continuous", role: "position", weight: 0.15, touchType: "procedural_trust" },
      { node: "EPS", kind: "categorical", role: "category", weight: 0.30, touchType: "institutional_nihilism" }
    ],
    sliderMap: {
      // 1 = strongly disagree (institutions are fine, hierarchy natural)
      "0-20": {
        continuous: {
          ZS:    { pos: [0.55, 0.25, 0.12, 0.05, 0.03], sal: [0.55, 0.30, 0.12, 0.03] },
          ONT_H: { pos: [0.03, 0.05, 0.12, 0.28, 0.52] },
          COM:   { pos: [0.05, 0.10, 0.22, 0.35, 0.28] },
          PRO:   { pos: [0.05, 0.10, 0.25, 0.35, 0.25] }
        },
        categorical: {
          EPS: { cat: [0.15, 0.50, 0.15, 0.08, 0.10, 0.02] }
        }
      },
      // 2 = disagree
      "21-40": {
        continuous: {
          ZS:    { pos: [0.30, 0.35, 0.22, 0.08, 0.05], sal: [0.30, 0.40, 0.22, 0.08] },
          ONT_H: { pos: [0.05, 0.10, 0.22, 0.38, 0.25] },
          COM:   { pos: [0.08, 0.15, 0.30, 0.30, 0.17] },
          PRO:   { pos: [0.08, 0.12, 0.30, 0.30, 0.20] }
        },
        categorical: {
          EPS: { cat: [0.20, 0.38, 0.14, 0.12, 0.12, 0.04] }
        }
      },
      // 3 = mixed
      "41-60": {
        continuous: {
          ZS:    { pos: [0.10, 0.20, 0.40, 0.20, 0.10], sal: [0.12, 0.28, 0.38, 0.22] },
          ONT_H: { pos: [0.10, 0.20, 0.40, 0.20, 0.10] },
          COM:   { pos: [0.12, 0.22, 0.32, 0.22, 0.12] },
          PRO:   { pos: [0.12, 0.22, 0.32, 0.22, 0.12] }
        },
        categorical: {
          EPS: { cat: [0.17, 0.22, 0.17, 0.17, 0.17, 0.10] }
        }
      },
      // 4 = agree (institutions tend toward domination)
      "61-80": {
        continuous: {
          ZS:    { pos: [0.05, 0.08, 0.22, 0.35, 0.30], sal: [0.04, 0.15, 0.40, 0.41] },
          ONT_H: { pos: [0.25, 0.38, 0.22, 0.10, 0.05] },
          COM:   { pos: [0.17, 0.30, 0.30, 0.15, 0.08] },
          PRO:   { pos: [0.20, 0.30, 0.30, 0.12, 0.08] }
        },
        categorical: {
          EPS: { cat: [0.08, 0.08, 0.10, 0.17, 0.25, 0.32] }
        }
      },
      // 5 = strongly agree (institutions always corrupt, domination inevitable)
      "81-100": {
        continuous: {
          ZS:    { pos: [0.03, 0.05, 0.12, 0.25, 0.55], sal: [0.02, 0.08, 0.30, 0.60] },
          ONT_H: { pos: [0.52, 0.28, 0.12, 0.05, 0.03] },
          COM:   { pos: [0.28, 0.35, 0.22, 0.10, 0.05] },
          PRO:   { pos: [0.25, 0.35, 0.25, 0.10, 0.05] }
        },
        categorical: {
          EPS: { cat: [0.04, 0.04, 0.08, 0.10, 0.14, 0.60] }
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
      { node: "CD", kind: "continuous", role: "position", weight: 0.20, touchType: "cultural_direction" },
      { node: "COM", kind: "continuous", role: "position", weight: 0.08, touchType: "compromise_signal" },
      { node: "EPS", kind: "categorical", role: "category", weight: 0.20, touchType: "legitimacy_authority" }
    ],
    optionEvidence: {
      // A: It carries inherited ways of life forward
      inherited_tradition: {
        continuous: {
          PRO: { pos: [0.05, 0.12, 0.25, 0.35, 0.23] },
          CD:  { pos: [0.04, 0.08, 0.18, 0.30, 0.40] }
        },
        categorical: {
          EPS: { cat: [0.05, 0.10, 0.55, 0.15, 0.10, 0.05] }
        }
      },
      // B: It follows neutral constitutional rules and procedures
      procedural_rules: {
        continuous: {
          PRO: { pos: [0.01, 0.04, 0.12, 0.28, 0.55] },
          COM: { pos: [0.05, 0.10, 0.25, 0.35, 0.25] }
        },
        categorical: {
          EPS: { cat: [0.35, 0.30, 0.10, 0.10, 0.10, 0.05] }
        }
      },
      // C: It keeps order and gets results when things are unstable
      order_and_results: {
        continuous: {
          PRO: { pos: [0.20, 0.30, 0.28, 0.15, 0.07] },
          COM: { pos: [0.25, 0.30, 0.25, 0.12, 0.08] },
          CD:  { pos: [0.08, 0.12, 0.25, 0.30, 0.25] }
        },
        categorical: {
          EPS: { cat: [0.10, 0.10, 0.08, 0.08, 0.30, 0.34] }
        }
      },
      // D: It advances justice, even if rules sometimes have to bend
      justice_first: {
        continuous: {
          PRO: { pos: [0.55, 0.28, 0.12, 0.04, 0.01] },
          COM: { pos: [0.25, 0.30, 0.25, 0.12, 0.08] }
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
      { node: "CD",  kind: "continuous", role: "salience", weight: 0.85, touchType: "priority_sort_pole_battery" },
      { node: "CD",  kind: "continuous", role: "position", weight: 0.55, touchType: "priority_sort_pole_battery" },
      { node: "CU",  kind: "continuous", role: "salience", weight: 0.85, touchType: "priority_sort_pole_battery" },
      { node: "CU",  kind: "continuous", role: "position", weight: 0.55, touchType: "priority_sort_pole_battery" },
      { node: "MOR", kind: "continuous", role: "salience", weight: 0.85, touchType: "priority_sort_pole_battery" },
      { node: "MOR", kind: "continuous", role: "position", weight: 0.55, touchType: "priority_sort_pole_battery" },
      { node: "PRO", kind: "continuous", role: "salience", weight: 0.85, touchType: "priority_sort_pole_battery" },
      { node: "PRO", kind: "continuous", role: "position", weight: 0.55, touchType: "priority_sort_pole_battery" },
      { node: "COM", kind: "continuous", role: "salience", weight: 0.85, touchType: "priority_sort_pole_battery" },
      { node: "COM", kind: "continuous", role: "position", weight: 0.55, touchType: "priority_sort_pole_battery" }
    ],
    rankingMap: {
      mat_low:  { continuous: { MAT: { pos: [0.45, 0.30, 0.15, 0.07, 0.03] } } },
      mat_high: { continuous: { MAT: { pos: [0.03, 0.07, 0.15, 0.30, 0.45] } } },
      cd_low:   { continuous: { CD:  { pos: [0.45, 0.30, 0.15, 0.07, 0.03] } } },
      cd_high:  { continuous: { CD:  { pos: [0.03, 0.07, 0.15, 0.30, 0.45] } } },
      cu_low:   { continuous: { CU:  { pos: [0.45, 0.30, 0.15, 0.07, 0.03] } } },
      cu_high:  { continuous: { CU:  { pos: [0.03, 0.07, 0.15, 0.30, 0.45] } } },
      mor_low:  { continuous: { MOR: { pos: [0.45, 0.30, 0.15, 0.07, 0.03] } } },
      mor_high: { continuous: { MOR: { pos: [0.03, 0.07, 0.15, 0.30, 0.45] } } },
      pro_low:  { continuous: { PRO: { pos: [0.45, 0.30, 0.15, 0.07, 0.03] } } },
      pro_high: { continuous: { PRO: { pos: [0.03, 0.07, 0.15, 0.30, 0.45] } } },
      com_low:  { continuous: { COM: { pos: [0.45, 0.30, 0.15, 0.07, 0.03] } } },
      com_high: { continuous: { COM: { pos: [0.03, 0.07, 0.15, 0.30, 0.45] } } }
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
    quality: 0.90,
    rewriteNeeded: false,
    touchProfile: [
      { node: "PF",  kind: "continuous", role: "position", weight: 0.70, touchType: "thought_frequency_proxy" },
      { node: "ENG", kind: "continuous", role: "position", weight: 0.55, touchType: "thought_frequency_proxy" },
    ],
    optionEvidence: {
      // A: Rarely — only during elections or big news
      rarely_elections: {
        continuous: {
          PF:  { pos: [0.55, 0.28, 0.12, 0.03, 0.02] },
          ENG: { pos: [0.60, 0.25, 0.10, 0.04, 0.01] }
        }
      },
      // B: Sometimes — when something big happens I'll think about it
      sometimes_events: {
        continuous: {
          PF:  { pos: [0.20, 0.40, 0.25, 0.12, 0.03] },
          ENG: { pos: [0.25, 0.40, 0.22, 0.10, 0.03] }
        }
      },
      // C: Regularly — part of my daily media and conversations
      regularly_daily: {
        continuous: {
          PF:  { pos: [0.05, 0.15, 0.35, 0.32, 0.13] },
          ENG: { pos: [0.04, 0.12, 0.30, 0.36, 0.18] }
        }
      },
      // D: Constantly — politics shapes how I see most things
      constantly_worldview: {
        continuous: {
          PF:  { pos: [0.02, 0.05, 0.15, 0.33, 0.45] },
          ENG: { pos: [0.01, 0.04, 0.12, 0.30, 0.53] }
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
    quality: 0.90,
    rewriteNeeded: false,
    touchProfile: [
      { node: "TRB", kind: "continuous", role: "position", weight: 0.85, touchType: "group_solidarity" },
      { node: "MOR", kind: "continuous", role: "position", weight: 0.20, touchType: "in_group_proxy" }
    ],
    optionEvidence: {
      // A: Personal — like it's happening to me
      // MOR pos=1 (narrow): strong in-group identification → parochial moral scope.
      personal_feels: {
        continuous: {
          TRB: { pos: [0.02, 0.05, 0.15, 0.33, 0.45] },
          MOR: { pos: [0.40, 0.32, 0.18, 0.07, 0.03] }
        }
      },
      // B: Important — I pay attention and care
      // MOR moderate-narrow: in-group matters but not all-consuming.
      important_care: {
        continuous: {
          TRB: { pos: [0.05, 0.18, 0.38, 0.28, 0.11] },
          MOR: { pos: [0.15, 0.30, 0.35, 0.15, 0.05] }
        }
      },
      // C: Aware but it doesn't really touch me
      // MOR moderate-wide: detached from in-group → scope drifts outward.
      aware_distant: {
        continuous: {
          TRB: { pos: [0.25, 0.40, 0.22, 0.10, 0.03] },
          MOR: { pos: [0.08, 0.17, 0.35, 0.28, 0.12] }
        }
      },
      // D: Not really — I don't see myself mainly through group identity
      // MOR pos=5 (wide): universalist self-concept → universal moral scope.
      universalist_self: {
        continuous: {
          TRB: { pos: [0.55, 0.28, 0.12, 0.03, 0.02] },
          MOR: { pos: [0.03, 0.07, 0.20, 0.30, 0.40] }
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
      eps_empiricist:      { categorical: { EPS: EPS_PROTOTYPES.empiricist } },
      eps_institutionalist:{ categorical: { EPS: EPS_PROTOTYPES.institutionalist } },
      eps_traditionalist:  { categorical: { EPS: EPS_PROTOTYPES.traditionalist } },
      eps_intuitionist:    { categorical: { EPS: EPS_PROTOTYPES.intuitionist } },
      eps_autonomous:      { categorical: { EPS: EPS_PROTOTYPES.autonomous } }
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
      { node: "PF",  kind: "continuous", role: "position", weight: 0.88, touchType: "identity_fusion_affective" },
      { node: "TRB", kind: "continuous", role: "position", weight: 0.22, touchType: "camp_attachment" }
    ],
    optionEvidence: {
      // A: Fine — politics is separate from who they are
      politics_separate: {
        continuous: {
          PF:  { pos: [0.50, 0.28, 0.14, 0.05, 0.03] },
          TRB: { pos: [0.35, 0.30, 0.20, 0.10, 0.05] }
        }
      },
      // B: A bit awkward but doesn't change much
      slightly_awkward: {
        continuous: {
          PF:  { pos: [0.18, 0.32, 0.30, 0.14, 0.06] },
          TRB: { pos: [0.15, 0.28, 0.30, 0.17, 0.10] }
        }
      },
      // C: Bothered — I'd find it harder to feel close
      bothered_distance: {
        continuous: {
          PF:  { pos: [0.04, 0.10, 0.24, 0.36, 0.26] },
          TRB: { pos: [0.05, 0.12, 0.25, 0.33, 0.25] }
        }
      },
      // D: A major problem — I'd seriously question the relationship
      major_problem: {
        continuous: {
          PF:  { pos: [0.02, 0.04, 0.10, 0.28, 0.56] },
          TRB: { pos: [0.03, 0.07, 0.15, 0.30, 0.45] }
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
    quality: 0.90,
    rewriteNeeded: false,
    optionLabels: {
      neighbor:       "Neighbor — lives next door, small talk at the mailbox",
      coworker:       "Coworker — shares a team or office with you every day",
      close_friend:   "Close friend — someone you confide in regularly",
      sibling_inlaw:  "Sibling-in-law — part of your family through marriage",
      dating_partner: "Your romantic partner — someone you are dating exclusively",
      spouse:         "Your spouse — lifelong partner and co-parent"
    },
    touchProfile: [
      { node: "TRB", kind: "continuous", role: "position", weight: 0.80, touchType: "cross_partisan_tolerance" }
      // MOR dropped 2026-04-24 per audit: rankingMap carries no MOR evidence
      // per item, so the declared touch was inflating coverage counts without
      // delivering posterior updates. TRB is what Q99 actually measures.
    ],
    rankingMap: {
      neighbor:       { continuous: { TRB: { pos: [0.01, 0.03, 0.08, 0.25, 0.63] } } },
      coworker:       { continuous: { TRB: { pos: [0.02, 0.05, 0.13, 0.30, 0.50] } } },
      close_friend:   { continuous: { TRB: { pos: [0.04, 0.10, 0.20, 0.33, 0.33] } } },
      sibling_inlaw:  { continuous: { TRB: { pos: [0.08, 0.15, 0.27, 0.30, 0.20] } } },
      dating_partner: { continuous: { TRB: { pos: [0.12, 0.20, 0.30, 0.25, 0.13] } } },
      spouse:         { continuous: { TRB: { pos: [0.15, 0.25, 0.30, 0.18, 0.12] } } }
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
    promptFull:
      "Rank these ways of deciding what is politically true from most like you " +
      "to least like you.",
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
      eps_empiricist:       { categorical: { EPS: EPS_PROTOTYPES.empiricist } },
      eps_institutionalist: { categorical: { EPS: EPS_PROTOTYPES.institutionalist } },
      eps_traditionalist:   { categorical: { EPS: EPS_PROTOTYPES.traditionalist } },
      eps_intuitionist:     { categorical: { EPS: EPS_PROTOTYPES.intuitionist } },
      eps_autonomous:       { categorical: { EPS: EPS_PROTOTYPES.autonomous } },
      eps_nihilist:         { categorical: { EPS: EPS_PROTOTYPES.nihilist } }
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
    promptFull:
      "Pick the political leadership style you find most appealing and the " +
      "one you find least appealing.",
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
      aes_plainspoken: "Plainspoken - direct and casual, unscripted, refuses polish and political theater, talks like a regular person",
      aes_fighter: "Fighter - combative tone, willing to attack opponents directly, confrontational delivery, doesn't soften",
      aes_visionary: "Visionary - lyrical and aspirational, evocative-imagistic rhetoric, paints pictures with words"
    },
    touchProfile: [
      { node: "AES", kind: "categorical", role: "category", weight: 0.95, touchType: "direct_aesthetic_maxdiff" },
      { node: "AES", kind: "categorical", role: "salience", weight: 0.35, touchType: "direct_aesthetic_maxdiff" }
    ],
    bestWorstMap: {
      aes_statesman:  { categorical: { AES: AES_PROTOTYPES.statesman } },
      aes_technocrat: { categorical: { AES: AES_PROTOTYPES.technocrat } },
      aes_pastoral:   { categorical: { AES: AES_PROTOTYPES.pastoral } },
      aes_plainspoken:  { categorical: { AES: AES_PROTOTYPES.plainspoken } },
      aes_fighter:    { categorical: { AES: AES_PROTOTYPES.fighter } },
      aes_visionary:  { categorical: { AES: AES_PROTOTYPES.visionary } }
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
      { node: "CD", kind: "continuous", role: "position",  weight: 0.80, touchType: "dual_axis_cd" },
      { node: "CD", kind: "continuous", role: "salience",  weight: 0.75, touchType: "dual_axis_cd" }
    ],
    dualAxisMap: {
      node: "CD",
      xLow:  [0.45, 0.30, 0.15, 0.07, 0.03],
      xHigh: [0.03, 0.07, 0.15, 0.30, 0.45]
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
    quality: 0.90,
    rewriteNeeded: false,
    optionLabels: {
      born_here:     "Being born in the country — having citizenship by birth",
      speak_lang:    "Being able to speak the national language",
      shared_values: "Believing in the core civic values (liberty, equality, rule of law)",
      civic_part:    "Participating in civic life — voting, jury duty, community involvement",
      cultural:      "Adopting cultural customs, holidays, and traditions",
      ancestry:      "Having ancestral roots in the country going back generations",
      religion:      "Sharing the country's religious heritage and traditions",
      economic:      "Contributing economically — holding a job, paying taxes, not being a burden"
    },
    touchProfile: [
      // Position weight reduced 2026-04-24 from 0.85 → 0.30 per ADR-008.
      // Q102 conflates polity-gatekeeping with culture-pluralism: a civic-
      // nationalist user (shared civic values matter, but pluralism in private
      // life is fine) gets read as assimilationist because Q102's items push
      // CU low when marked Essential. Lowering position weight lets Q102
      // contribute mostly salience evidence without dominating CU position.
      { node: "CU",  kind: "continuous", role: "position", weight: 0.30, touchType: "membership_criteria" },
      { node: "CU",  kind: "continuous", role: "salience", weight: 0.80, touchType: "membership_criteria" },
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
      born_here:     { continuous: { CU: { pos: [0.50, 0.30, 0.12, 0.06, 0.02] } } },
      speak_lang:    { continuous: { CU: { pos: [0.20, 0.32, 0.30, 0.12, 0.06] } } },
      shared_values: { continuous: { CU: { pos: [0.10, 0.22, 0.40, 0.20, 0.08] } } },
      civic_part:    { continuous: { CU: { pos: [0.08, 0.20, 0.40, 0.22, 0.10] } } },
      cultural:      { continuous: { CU: { pos: [0.30, 0.32, 0.22, 0.10, 0.06] } } },
      ancestry:      { continuous: { CU: { pos: [0.55, 0.25, 0.10, 0.06, 0.04] } } },
      religion:      { continuous: { CU: { pos: [0.55, 0.25, 0.10, 0.06, 0.04] } } },
      economic:      { continuous: { CU: { pos: [0.20, 0.30, 0.32, 0.12, 0.06] } } }
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
    promptFull:
      "Sort each political topic below by how much it matters to how you see politics. " +
      "Put topics at the top that feel central to your political identity, in the middle " +
      "if they matter but aren't central, and at the bottom if they don't really register.",
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
      // Each label now matches the node's high5/low1 framing in nodes.ts.
      mat:   "Economic policy — taxes, redistribution, jobs, markets, and who gets to share in the gains",
      cd:    "Social direction — reproductive rights, LGBTQ rights, gender identity, marriage, religious accommodation, and whether (and how fast) social conventions should change",
      cu:    "Pluralism — whether different worldviews, religions, languages, lifestyles, and conceptions of a good life should coexist as equals within the country, or whether the country should have one shared standard",
      mor:   "Moral scope — whether obligations stop at family and country, or extend to strangers everywhere",
      pro:   "Rule of law and procedures — whether process binds every side, or results are what matter most",
      com:   "Compromise and dealmaking — whether half a win is worth taking, or some lines you just don't cross",
      zs:    "Zero-sum vs positive-sum — whether systems (economic, political, cultural) usually produce gains by cooperation that benefit everyone, or by competition where one side's gain requires another's loss",
      ont_h: "Human malleability — whether character and behavior can be substantially reshaped by environment, education, and institutions, or whether human nature is mostly fixed and cultivation can't really change it",
      ont_s: "Institutions — the importance of strong, accountable institutions (laws, courts, agencies, international bodies) to human progress and a thriving society",
      eps:   "Truth and evidence — what counts as a credible source in political debates",
      aes:   "Leadership style — the kind of leader who appeals (fighter vs. statesman, visionary vs. pragmatist)"
    },
    // Hard likelihoods on the "neutral" bucket — the whole point of this
    // question. [0.90, 0.08, 0.02, 0.00] drives salDist[0] from uniform 0.25 to
    // ~0.90 in one touch (vs. the default SAL_PRIORITY_LOW's asymptote at 0.63).
    // supportHigh and opposeHigh mirror the Q93 defaults; supportMid softened
    // slightly to leave more probability on the middle buckets.
    salienceBuckets: {
      supportHigh: [0.00, 0.02, 0.08, 0.90],
      supportMid:  [0.10, 0.25, 0.40, 0.25],
      neutral:     [0.90, 0.08, 0.02, 0.00],
      opposeHigh:  [0.00, 0.02, 0.08, 0.90]
    },
    touchProfile: [
      { node: "MAT",   kind: "continuous",  role: "salience", weight: 0.95, touchType: "salience_screener" },
      { node: "CD",    kind: "continuous",  role: "salience", weight: 0.95, touchType: "salience_screener" },
      { node: "CU",    kind: "continuous",  role: "salience", weight: 0.95, touchType: "salience_screener" },
      { node: "MOR",   kind: "continuous",  role: "salience", weight: 0.95, touchType: "salience_screener" },
      { node: "PRO",   kind: "continuous",  role: "salience", weight: 0.95, touchType: "salience_screener" },
      { node: "COM",   kind: "continuous",  role: "salience", weight: 0.95, touchType: "salience_screener" },
      { node: "ZS",    kind: "continuous",  role: "salience", weight: 0.95, touchType: "salience_screener" },
      { node: "ONT_H", kind: "continuous",  role: "salience", weight: 0.95, touchType: "salience_screener" },
      { node: "ONT_S", kind: "continuous",  role: "salience", weight: 0.95, touchType: "salience_screener" },
      { node: "EPS",   kind: "categorical", role: "salience", weight: 0.95, touchType: "salience_screener" },
      { node: "AES",   kind: "categorical", role: "salience", weight: 0.95, touchType: "salience_screener" }
    ],
    // Each item maps to exactly one node. Continuous items carry an empty
    // evidence object — all salience work is done by applyPrioritySort's
    // per-node bucket aggregation with this question's salienceBuckets override.
    // No position evidence: this question only rules nodes in or out, it does
    // not try to localize position on mattering nodes (that's the other 11
    // fixed-opener questions' job).
    rankingMap: {
      mat:   { continuous:  { MAT:   {} } },
      cd:    { continuous:  { CD:    {} } },
      cu:    { continuous:  { CU:    {} } },
      mor:   { continuous:  { MOR:   {} } },
      pro:   { continuous:  { PRO:   {} } },
      com:   { continuous:  { COM:   {} } },
      zs:    { continuous:  { ZS:    {} } },
      ont_h: { continuous:  { ONT_H: {} } },
      ont_s: { continuous:  { ONT_S: {} } },
      eps:   { categorical: { EPS: [1/6, 1/6, 1/6, 1/6, 1/6, 1/6] } },
      aes:   { categorical: { AES: [1/6, 1/6, 1/6, 1/6, 1/6, 1/6] } }
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
      { node: "ONT_S", kind: "continuous", role: "position", weight: 0.20, touchType: "current_institutional_confidence" },
      { node: "ONT_S", kind: "continuous", role: "salience", weight: 0.15, touchType: "current_institutional_confidence" },
      { node: "TRB", kind: "continuous", role: "position", weight: 0.30, touchType: "national_identification" }
    ],
    optionEvidence: {
      // "I'm generally proud of my country and trust most of its core institutions despite their flaws."
      proud_and_trust: {
        continuous: {
          ONT_S: { pos: [0.02, 0.06, 0.18, 0.34, 0.40] },
          TRB: { pos: [0.05, 0.15, 0.30, 0.30, 0.20] }
        }
      },
      // "I'm proud of my country but distrust most of its current institutions."
      proud_distrustful: {
        continuous: {
          ONT_S: { pos: [0.08, 0.18, 0.36, 0.25, 0.13] },
          TRB: { pos: [0.05, 0.15, 0.30, 0.30, 0.20] }
        }
      },
      // "I'm somewhat proud but skeptical of many institutions in their current form."
      moderate_pride_mixed_trust: {
        continuous: {
          ONT_S: { pos: [0.06, 0.16, 0.38, 0.27, 0.13] },
          TRB: { pos: [0.10, 0.25, 0.35, 0.20, 0.10] }
        }
      },
      // "I don't think in country-pride terms but I trust most major democratic institutions."
      internationalist_trusting: {
        continuous: {
          ONT_S: { pos: [0.02, 0.06, 0.18, 0.34, 0.40] },
          TRB: { pos: [0.40, 0.30, 0.18, 0.08, 0.04] }
        }
      },
      // "I'm critical of my country and don't trust most institutions."
      critical_low_trust: {
        continuous: {
          ONT_S: { pos: [0.18, 0.27, 0.32, 0.16, 0.07] },
          TRB: { pos: [0.30, 0.32, 0.22, 0.10, 0.06] }
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
    uiType: "single_choice",
    quality: 0.99,
    rewriteNeeded: false,
    options: ["dem", "rep", "ind", "third", "none"],
    // Q200 touchProfile cleaned 2026-04-25 (ADR-009 / P3.7): the previous
    // PF salience touch was no-op (SELF-cluster nodes skip salience writes
    // per ADR-005). Q200 is metadata-only — partyID is captured by the
    // applySingleChoiceAnswer hook and consumed by predictVote, not by the
    // Bayesian node state.
    touchProfile: [],
    optionEvidence: {
      dem:   {},
      rep:   {},
      ind:   {},
      third: {},
      none:  {}
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
      { node: "PRO", kind: "continuous", role: "position", weight: 0.30, touchType: "state_capacity" },
      { node: "ONT_S", kind: "continuous", role: "position", weight: 0.30, touchType: "institutional_importance" },
      { node: "COM", kind: "continuous", role: "position", weight: 0.15, touchType: "pragmatism_proxy" }
    ],
    optionEvidence: {
      // "Universal services and a strong state — public healthcare, public education
      // through college, robust social insurance, even at higher taxes."
      universal_strong_state: {
        continuous: {
          MAT: { pos: [0.55, 0.30, 0.10, 0.04, 0.01] },
          PRO: { pos: [0.05, 0.15, 0.30, 0.30, 0.20] },
          ONT_S: { pos: [0.05, 0.15, 0.30, 0.30, 0.20] },
          COM: { pos: [0.10, 0.22, 0.36, 0.22, 0.10] }
        }
      },
      // "Basic safety net and mixed economy — government provides core protections
      // and corrects market failures but doesn't run most things."
      basic_safety_net_mixed: {
        continuous: {
          MAT: { pos: [0.20, 0.35, 0.30, 0.10, 0.05] },
          PRO: { pos: [0.08, 0.20, 0.40, 0.20, 0.12] },
          ONT_S: { pos: [0.08, 0.20, 0.40, 0.20, 0.12] },
          COM: { pos: [0.04, 0.12, 0.28, 0.36, 0.20] }
        }
      },
      // "Market-enabling limited state — government should mostly enable
      // markets, individual choice, and small-business activity."
      market_enabling_limited: {
        continuous: {
          MAT: { pos: [0.05, 0.10, 0.25, 0.35, 0.25] },
          PRO: { pos: [0.15, 0.25, 0.30, 0.20, 0.10] },
          ONT_S: { pos: [0.20, 0.25, 0.25, 0.20, 0.10] },
          COM: { pos: [0.08, 0.18, 0.36, 0.26, 0.12] }
        }
      },
      // "Anti-bureaucratic / localist alternative — federal government does too
      // much; problems should be solved at community / state / private level."
      anti_bureaucratic_localist: {
        continuous: {
          MAT: { pos: [0.10, 0.20, 0.30, 0.25, 0.15] },
          PRO: { pos: [0.40, 0.30, 0.18, 0.07, 0.05] },
          ONT_S: { pos: [0.40, 0.30, 0.18, 0.07, 0.05] },
          COM: { pos: [0.30, 0.32, 0.22, 0.10, 0.06] }
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
    quality: 0.90,
    rewriteNeeded: false,
    options: ["robust_intervention", "alliance_diplomacy", "restraint_only", "anti_war"],
    touchProfile: [
      { node: "MOR", kind: "continuous", role: "position", weight: 0.30, touchType: "interventionism" },
      { node: "ZS", kind: "continuous", role: "position", weight: 0.30, touchType: "interventionism" },
      { node: "ONT_H", kind: "continuous", role: "position", weight: 0.20, touchType: "interventionism" }
    ],
    optionEvidence: {
      // "Use military force decisively when American interests / values demand it"
      robust_intervention: {
        continuous: {
          MOR: { pos: [0.30, 0.30, 0.22, 0.12, 0.06] },
          ZS: { pos: [0.05, 0.10, 0.20, 0.30, 0.35] },
          ONT_H: { pos: [0.30, 0.30, 0.22, 0.12, 0.06] }
        }
      },
      // "Lead through alliances and diplomacy; force is a last resort within international institutions"
      alliance_diplomacy: {
        continuous: {
          MOR: { pos: [0.05, 0.12, 0.25, 0.33, 0.25] },
          ZS: { pos: [0.20, 0.30, 0.30, 0.15, 0.05] },
          ONT_H: { pos: [0.05, 0.15, 0.30, 0.30, 0.20] }
        }
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
          MOR: { pos: [0.30, 0.32, 0.22, 0.12, 0.04] },  // narrower moral scope (realist-leaning)
          ZS: { pos: [0.10, 0.22, 0.34, 0.22, 0.12] },   // mixed zero-sum (geopolitics is a contest)
          ONT_H: { pos: [0.22, 0.30, 0.30, 0.13, 0.05] } // somewhat pessimistic about other actors
        }
      },
      // "War is rarely just — pursue diplomacy and disarmament; military force causes more harm than it prevents"
      anti_war: {
        continuous: {
          MOR: { pos: [0.04, 0.10, 0.22, 0.32, 0.32] },  // wide moral scope (cosmopolitan pacifism)
          ZS: { pos: [0.42, 0.30, 0.16, 0.08, 0.04] },   // strongly positive-sum (cooperation works)
          ONT_H: { pos: [0.04, 0.12, 0.26, 0.32, 0.26] } // optimistic about human nature
        }
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
    quality: 0.90,
    rewriteNeeded: false,
    options: ["deep_engagement", "selective_alliance", "unilateral_strength", "withdraw_focus_home"],
    touchProfile: [
      { node: "CU", kind: "continuous", role: "position", weight: 0.35, touchType: "international_orientation" },
      { node: "MOR", kind: "continuous", role: "position", weight: 0.25, touchType: "moral_scope_global" },
      { node: "TRB", kind: "continuous", role: "position", weight: 0.20, touchType: "national_identification" }
    ],
    optionEvidence: {
      // "America should engage deeply in international institutions and treaties"
      deep_engagement: {
        continuous: {
          CU: { pos: [0.04, 0.10, 0.25, 0.31, 0.30] },
          MOR: { pos: [0.04, 0.10, 0.25, 0.31, 0.30] },
          TRB: { pos: [0.30, 0.32, 0.22, 0.10, 0.06] }
        }
      },
      // "Strong alliances yes, but be selective and protect American sovereignty"
      selective_alliance: {
        continuous: {
          CU: { pos: [0.10, 0.22, 0.36, 0.22, 0.10] },
          MOR: { pos: [0.10, 0.22, 0.36, 0.22, 0.10] },
          TRB: { pos: [0.10, 0.22, 0.30, 0.25, 0.13] }
        }
      },
      // "America should act unilaterally to defend its interests; don't be constrained by international institutions"
      unilateral_strength: {
        continuous: {
          CU: { pos: [0.40, 0.30, 0.18, 0.08, 0.04] },
          MOR: { pos: [0.40, 0.30, 0.18, 0.08, 0.04] },
          TRB: { pos: [0.04, 0.10, 0.20, 0.32, 0.34] }
        }
      },
      // "Withdraw from foreign entanglements; focus on home"
      withdraw_focus_home: {
        continuous: {
          CU: { pos: [0.30, 0.30, 0.25, 0.10, 0.05] },
          MOR: { pos: [0.30, 0.30, 0.25, 0.10, 0.05] },
          TRB: { pos: [0.10, 0.18, 0.30, 0.25, 0.17] }
        }
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
      { node: "CU", kind: "continuous", role: "position", weight: 0.10, touchType: "economic_nationalism" },
      { node: "ZS", kind: "continuous", role: "position", weight: 0.25, touchType: "trade_zero_sum" }
    ],
    optionEvidence: {
      // "Free trade is mostly good; remove barriers, embrace globalization"
      free_trade: {
        continuous: {
          MAT: { pos: [0.05, 0.15, 0.30, 0.30, 0.20] },
          CU: { pos: [0.04, 0.10, 0.25, 0.31, 0.30] },
          ZS: { pos: [0.40, 0.30, 0.18, 0.08, 0.04] }
        }
      },
      // "Fair trade with worker / environmental protections — pro-trade but with rules"
      fair_trade_with_protections: {
        continuous: {
          MAT: { pos: [0.15, 0.30, 0.30, 0.15, 0.10] },
          CU: { pos: [0.10, 0.22, 0.36, 0.22, 0.10] },
          ZS: { pos: [0.20, 0.30, 0.30, 0.15, 0.05] }
        }
      },
      // "Tariffs and protections to defend American jobs and industry"
      tariffs_protect_jobs: {
        continuous: {
          MAT: { pos: [0.30, 0.30, 0.22, 0.12, 0.06] },
          CU: { pos: [0.40, 0.30, 0.18, 0.08, 0.04] },
          ZS: { pos: [0.05, 0.15, 0.30, 0.30, 0.20] }
        }
      },
      // "Whatever trade policy materially helps working people — open or closed"
      trade_what_helps_people: {
        continuous: {
          MAT: { pos: [0.40, 0.30, 0.18, 0.08, 0.04] },
          CU: { pos: [0.15, 0.25, 0.35, 0.18, 0.07] },
          ZS: { pos: [0.20, 0.30, 0.30, 0.15, 0.05] }
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
    quality: 0.90,
    rewriteNeeded: false,
    options: ["religion_central", "religion_inform", "religion_neutral", "religion_separate"],
    touchProfile: [
      { node: "CD", kind: "continuous", role: "position", weight: 0.40, touchType: "religion_traditionalism" },
      { node: "MOR", kind: "continuous", role: "position", weight: 0.20, touchType: "religion_morality" },
      { node: "PRO", kind: "continuous", role: "position", weight: 0.20, touchType: "religion_neutrality" },
      { node: "EPS", kind: "categorical", role: "category", weight: 0.30, touchType: "religion_epistemic" }
    ],
    optionEvidence: {
      // "Religious values should be central to public policy and law"
      religion_central: {
        continuous: {
          CD: { pos: [0.02, 0.06, 0.18, 0.34, 0.40] },
          MOR: { pos: [0.40, 0.30, 0.18, 0.08, 0.04] },
          PRO: { pos: [0.20, 0.25, 0.30, 0.15, 0.10] }
        },
        categorical: { EPS: { cat: [0.04, 0.06, 0.66, 0.10, 0.10, 0.04] } }
      },
      // "Religion can inform public values, but laws should serve everyone equally"
      religion_inform: {
        continuous: {
          CD: { pos: [0.10, 0.22, 0.36, 0.22, 0.10] },
          MOR: { pos: [0.15, 0.25, 0.35, 0.18, 0.07] },
          PRO: { pos: [0.05, 0.15, 0.30, 0.30, 0.20] }
        },
        categorical: { EPS: { cat: [0.10, 0.20, 0.30, 0.20, 0.15, 0.05] } }
      },
      // "Government should be neutral toward religion — neither favor nor restrict"
      religion_neutral: {
        continuous: {
          CD: { pos: [0.15, 0.25, 0.35, 0.15, 0.10] },
          MOR: { pos: [0.10, 0.20, 0.40, 0.20, 0.10] },
          PRO: { pos: [0.04, 0.10, 0.25, 0.31, 0.30] }
        },
        categorical: { EPS: { cat: [0.30, 0.35, 0.10, 0.05, 0.15, 0.05] } }
      },
      // "Strict separation — religion has no place in public policy"
      religion_separate: {
        continuous: {
          CD: { pos: [0.40, 0.30, 0.18, 0.08, 0.04] },
          MOR: { pos: [0.04, 0.10, 0.25, 0.31, 0.30] },
          PRO: { pos: [0.05, 0.15, 0.30, 0.30, 0.20] }
        },
        categorical: { EPS: { cat: [0.40, 0.20, 0.04, 0.05, 0.20, 0.11] } }
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
    quality: 0.90,
    rewriteNeeded: false,
    options: ["never_emergency_bypass", "narrow_emergency", "moderate_emergency", "strong_leader_acts"],
    touchProfile: [
      { node: "PRO", kind: "continuous", role: "position", weight: 0.65, touchType: "constitutional_restraint" },
      { node: "ONT_H", kind: "continuous", role: "position", weight: 0.20, touchType: "trust_concentrated_power" }
    ],
    optionEvidence: {
      // "Constitutional process binds even in emergencies — never bypass"
      never_emergency_bypass: {
        continuous: {
          PRO: { pos: [0.02, 0.06, 0.15, 0.32, 0.45] },
          ONT_H: { pos: [0.40, 0.30, 0.18, 0.08, 0.04] }
        }
      },
      // "Narrow, time-limited emergency powers under congressional or judicial check"
      narrow_emergency: {
        continuous: {
          PRO: { pos: [0.05, 0.15, 0.30, 0.30, 0.20] },
          ONT_H: { pos: [0.20, 0.30, 0.30, 0.15, 0.05] }
        }
      },
      // "Government can act decisively when problems demand it, with later review"
      moderate_emergency: {
        continuous: {
          PRO: { pos: [0.20, 0.30, 0.30, 0.15, 0.05] },
          ONT_H: { pos: [0.10, 0.20, 0.40, 0.20, 0.10] }
        }
      },
      // "When the system is gridlocked or failing, a strong leader should be able to act and let courts catch up"
      strong_leader_acts: {
        continuous: {
          PRO: { pos: [0.55, 0.30, 0.10, 0.04, 0.01] },
          ONT_H: { pos: [0.05, 0.15, 0.30, 0.30, 0.20] }
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
      { node: "ONT_H", kind: "continuous", role: "position", weight: 0.20, touchType: "trust_majority" }
    ],
    optionEvidence: {
      // "Courts protect rights even against majority opinion — that's their job"
      courts_protect_rights: {
        continuous: {
          PRO: { pos: [0.02, 0.06, 0.15, 0.32, 0.45] },
          ONT_H: { pos: [0.30, 0.32, 0.22, 0.12, 0.04] }
        }
      },
      // "Courts check majorities but should generally defer to democratically-elected branches"
      courts_check_with_deference: {
        continuous: {
          PRO: { pos: [0.10, 0.20, 0.40, 0.20, 0.10] },
          ONT_H: { pos: [0.12, 0.22, 0.36, 0.22, 0.08] }
        }
      },
      // "The democratic majority should mostly get its way; courts shouldn't override the public"
      majority_should_rule: {
        continuous: {
          PRO: { pos: [0.30, 0.30, 0.22, 0.12, 0.06] },
          ONT_H: { pos: [0.05, 0.12, 0.24, 0.34, 0.25] }
        }
      },
      // "Unelected elites in courts and bureaucracy are blocking the people's mandate"
      elites_blocking_change: {
        continuous: {
          PRO: { pos: [0.55, 0.28, 0.10, 0.05, 0.02] },
          ONT_H: { pos: [0.10, 0.18, 0.30, 0.25, 0.17] }
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
    quality: 0.90,
    rewriteNeeded: false,
    options: ["pie_grows_for_all", "growth_with_distribution", "winners_at_others_expense", "rigged_against_most"],
    touchProfile: [
      { node: "ZS", kind: "continuous", role: "position", weight: 0.85, touchType: "zero_sum_direct" },
      { node: "ZS", kind: "continuous", role: "salience", weight: 0.50, touchType: "zero_sum_direct" }
    ],
    optionEvidence: {
      // "When the economy grows, most people can benefit — wealth creation is positive-sum"
      pie_grows_for_all: {
        continuous: {
          ZS: { pos: [0.55, 0.28, 0.10, 0.05, 0.02], sal: [0.05, 0.20, 0.40, 0.35] }
        }
      },
      // "Growth helps when distribution is fair — both creating and sharing matter"
      growth_with_distribution: {
        continuous: {
          ZS: { pos: [0.20, 0.32, 0.30, 0.13, 0.05], sal: [0.10, 0.25, 0.40, 0.25] }
        }
      },
      // "When some win big, others lose — economic gains usually come at someone's expense"
      winners_at_others_expense: {
        continuous: {
          ZS: { pos: [0.04, 0.10, 0.20, 0.32, 0.34], sal: [0.05, 0.15, 0.35, 0.45] }
        }
      },
      // "The whole economy is rigged so most people can't get ahead no matter what"
      rigged_against_most: {
        continuous: {
          ZS: { pos: [0.02, 0.05, 0.15, 0.32, 0.46], sal: [0.02, 0.10, 0.30, 0.58] }
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
    quality: 0.90,
    rewriteNeeded: false,
    options: ["largely_fixed", "modest_shaping", "substantial_shaping", "mostly_made_by_environment"],
    touchProfile: [
      { node: "ONT_H", kind: "continuous", role: "position", weight: 0.85, touchType: "malleability_direct" },
      { node: "ONT_H", kind: "continuous", role: "salience", weight: 0.40, touchType: "malleability_direct" }
    ],
    optionEvidence: {
      // "Mostly fixed by adulthood — character barely changes after that"
      largely_fixed: {
        continuous: {
          ONT_H: { pos: [0.50, 0.30, 0.13, 0.05, 0.02], sal: [0.05, 0.20, 0.40, 0.35] }
        }
      },
      // "Some shaping is possible, but human nature sets real limits"
      modest_shaping: {
        continuous: {
          ONT_H: { pos: [0.20, 0.32, 0.30, 0.13, 0.05], sal: [0.10, 0.25, 0.40, 0.25] }
        }
      },
      // "Substantially shaped by upbringing, education, and community"
      substantial_shaping: {
        continuous: {
          ONT_H: { pos: [0.05, 0.13, 0.30, 0.32, 0.20], sal: [0.10, 0.25, 0.40, 0.25] }
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
          ONT_H: { pos: [0.02, 0.05, 0.15, 0.32, 0.46], sal: [0.05, 0.20, 0.40, 0.35] }
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
    options: ["never_dem", "never_rep", "never_dem_or_rep", "no_categorical_no", "consider_all"],
    touchProfile: [],
    optionEvidence: {
      never_dem: {},
      never_rep: {},
      never_dem_or_rep: {},
      no_categorical_no: {},
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
    promptFull:
      "When citizens, legal residents, minorities, or other groups living " +
      "under the country's laws are denied equal moral or legal standing, " +
      "how central is fixing that to your politics?",
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
      { node: "MOR", kind: "continuous", role: "salience", weight: 0.50, touchType: "within_polity_universalism" },
      { node: "CU",  kind: "continuous", role: "position", weight: 0.30, touchType: "within_polity_pluralism" },
      { node: "PRO", kind: "continuous", role: "position", weight: 0.20, touchType: "rights_proceduralism" }
    ],
    optionEvidence: {
      // "Central — equal full personhood for everyone within the country is
      //  foundational; denying it is the political issue I focus on"
      central_universalism: {
        continuous: {
          MOR: { pos: [0.02, 0.05, 0.13, 0.30, 0.50], sal: [0.02, 0.10, 0.30, 0.58] },
          CU:  { pos: [0.05, 0.15, 0.30, 0.30, 0.20] },
          PRO: { pos: [0.05, 0.15, 0.25, 0.30, 0.25] }
        }
      },
      // "Important but one issue among many; matters when it's directly happening"
      important_one_of_many: {
        continuous: {
          MOR: { pos: [0.05, 0.13, 0.27, 0.35, 0.20], sal: [0.10, 0.25, 0.40, 0.25] },
          CU:  { pos: [0.08, 0.20, 0.40, 0.22, 0.10] },
          PRO: { pos: [0.10, 0.20, 0.40, 0.20, 0.10] }
        }
      },
      // "Important in extreme cases but I focus on broader policy"
      depends_on_situation: {
        continuous: {
          MOR: { pos: [0.10, 0.25, 0.40, 0.18, 0.07], sal: [0.20, 0.35, 0.30, 0.15] },
          CU:  { pos: [0.15, 0.25, 0.35, 0.18, 0.07] },
          PRO: { pos: [0.15, 0.25, 0.35, 0.18, 0.07] }
        }
      },
      // "Some differentiation is part of stable political order; perfect equality isn't always the goal"
      some_differentiation_acceptable: {
        continuous: {
          MOR: { pos: [0.30, 0.35, 0.22, 0.10, 0.03], sal: [0.20, 0.35, 0.30, 0.15] },
          CU:  { pos: [0.30, 0.35, 0.22, 0.10, 0.03] },
          PRO: { pos: [0.20, 0.30, 0.30, 0.15, 0.05] }
        }
      },
      // "Different groups have different roles; that's how polities work"
      natural_hierarchy: {
        continuous: {
          MOR: { pos: [0.55, 0.28, 0.10, 0.05, 0.02], sal: [0.05, 0.20, 0.40, 0.35] },
          CU:  { pos: [0.55, 0.28, 0.10, 0.05, 0.02] },
          PRO: { pos: [0.30, 0.30, 0.22, 0.12, 0.06] }
        }
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
    promptFull:
      "Setting aside how well institutions function right now, how essential " +
      "do you think strong institutions — laws, courts, civic organizations, " +
      "international bodies — are to a society's long-term flourishing?",
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
      { node: "ONT_S", kind: "continuous", role: "salience", weight: 0.50, touchType: "institutional_essentialism" },
      { node: "PRO",   kind: "continuous", role: "position", weight: 0.25, touchType: "rule_of_law_normative" },
      { node: "ONT_H", kind: "continuous", role: "position", weight: 0.10, touchType: "trust_in_concentrated_authority" }
    ],
    optionEvidence: {
      // "Foundational — necessary infrastructure for any thriving society;
      //  can't have human progress without them"
      foundational_essential: {
        continuous: {
          ONT_S: { pos: [0.02, 0.05, 0.13, 0.30, 0.50], sal: [0.02, 0.10, 0.30, 0.58] },
          PRO:   { pos: [0.05, 0.15, 0.25, 0.30, 0.25] },
          ONT_H: { pos: [0.05, 0.15, 0.30, 0.30, 0.20] }
        }
      },
      // "Important, but they need constant maintenance and reform"
      important_with_caveats: {
        continuous: {
          ONT_S: { pos: [0.05, 0.13, 0.27, 0.35, 0.20], sal: [0.10, 0.25, 0.40, 0.25] },
          PRO:   { pos: [0.08, 0.18, 0.34, 0.28, 0.12] },
          ONT_H: { pos: [0.10, 0.20, 0.40, 0.20, 0.10] }
        }
      },
      // "Depends on which institutions and how they're structured"
      depends_on_design: {
        continuous: {
          ONT_S: { pos: [0.10, 0.25, 0.40, 0.18, 0.07], sal: [0.20, 0.35, 0.30, 0.15] },
          PRO:   { pos: [0.15, 0.25, 0.35, 0.18, 0.07] }
        }
      },
      // "They're useful instruments but not foundational; people can flourish
      //  under many arrangements"
      instruments_not_essential: {
        continuous: {
          ONT_S: { pos: [0.30, 0.35, 0.22, 0.10, 0.03], sal: [0.20, 0.35, 0.30, 0.15] },
          PRO:   { pos: [0.30, 0.30, 0.22, 0.12, 0.06] }
        }
      },
      // "Often obstacles — entrenched institutions block needed change"
      obstacles_to_progress: {
        continuous: {
          ONT_S: { pos: [0.55, 0.28, 0.10, 0.05, 0.02], sal: [0.05, 0.20, 0.40, 0.35] },
          PRO:   { pos: [0.40, 0.30, 0.18, 0.07, 0.05] },
          ONT_H: { pos: [0.20, 0.25, 0.30, 0.15, 0.10] }
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
    promptFull:
      "Looking at major political progress in the United States over the " +
      "last 100 years, where has it MOSTLY come from?",
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
      { node: "MAT",   kind: "continuous", role: "position", weight: 0.30, touchType: "policy_lever" },
      { node: "PRO",   kind: "continuous", role: "position", weight: 0.20, touchType: "process_vs_movement" }
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
          ONT_S: { pos: [0.02, 0.05, 0.15, 0.32, 0.46], sal: [0.02, 0.10, 0.30, 0.58] },
          MAT:   { pos: [0.20, 0.32, 0.30, 0.13, 0.05] },
          PRO:   { pos: [0.05, 0.13, 0.30, 0.32, 0.20] }
        }
      },
      // "From social movements forcing change against entrenched power —
      //  labor, civil rights, women's, gay rights, climate"
      movements_against_power: {
        continuous: {
          ONT_S: { pos: [0.20, 0.32, 0.30, 0.13, 0.05], sal: [0.05, 0.20, 0.40, 0.35] },
          MAT:   { pos: [0.30, 0.35, 0.22, 0.10, 0.03] },
          PRO:   { pos: [0.20, 0.30, 0.30, 0.15, 0.05] }
        }
      },
      // "From technological and economic dynamism — postwar growth,
      //  Silicon Valley, productivity gains lifting living standards"
      tech_and_economic: {
        continuous: {
          ONT_S: { pos: [0.13, 0.25, 0.34, 0.18, 0.10], sal: [0.20, 0.35, 0.30, 0.15] },
          MAT:   { pos: [0.04, 0.10, 0.25, 0.31, 0.30] },
          PRO:   { pos: [0.15, 0.25, 0.35, 0.18, 0.07] }
        }
      },
      // "From leaders with vision who mobilized the country — FDR,
      //  Reagan, Obama, leaders who reshaped what was politically possible"
      leaders_with_vision: {
        continuous: {
          ONT_S: { pos: [0.10, 0.22, 0.36, 0.22, 0.10], sal: [0.20, 0.35, 0.30, 0.15] },
          MAT:   { pos: [0.10, 0.22, 0.36, 0.22, 0.10] },
          PRO:   { pos: [0.20, 0.30, 0.30, 0.15, 0.05] }
        }
      },
      // "From markets, voluntary exchange, and individual initiative —
      //  most progress is bottom-up, not government-led"
      markets_voluntary: {
        continuous: {
          ONT_S: { pos: [0.42, 0.30, 0.18, 0.07, 0.03], sal: [0.10, 0.25, 0.40, 0.25] },
          MAT:   { pos: [0.02, 0.05, 0.18, 0.32, 0.43] },
          PRO:   { pos: [0.20, 0.30, 0.30, 0.15, 0.05] }
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
    promptFull:
      "If you were prioritizing one approach to strengthen American democracy " +
      "today, which would do MORE?",
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
      { node: "ONT_S", kind: "continuous", role: "salience", weight: 0.50, touchType: "institutional_strengthening" },
      { node: "MAT",   kind: "continuous", role: "position", weight: 0.25, touchType: "state_scope_implication" },
      { node: "PRO",   kind: "continuous", role: "position", weight: 0.30, touchType: "process_vs_populist" }
    ],
    exposeRules: {
      eligibleIf: ["ONT_S_live_or_unresolved"]
    },
    optionEvidence: {
      // "Repair existing constitutional and public institutions —
      //  Congress, courts, agencies, professional norms"
      reform_existing: {
        continuous: {
          ONT_S: { pos: [0.02, 0.05, 0.15, 0.32, 0.46], sal: [0.02, 0.10, 0.30, 0.58] },
          MAT:   { pos: [0.15, 0.30, 0.35, 0.15, 0.05] },
          PRO:   { pos: [0.02, 0.08, 0.20, 0.35, 0.35] }
        }
      },
      // "Replace outdated institutions with new ones designed for current
      //  challenges — many existing ones can't be repaired"
      build_new: {
        continuous: {
          ONT_S: { pos: [0.05, 0.13, 0.27, 0.35, 0.20], sal: [0.05, 0.20, 0.40, 0.35] },
          MAT:   { pos: [0.20, 0.30, 0.30, 0.15, 0.05] },
          PRO:   { pos: [0.10, 0.20, 0.40, 0.20, 0.10] }
        }
      },
      // "Return power from federal to state and local governments —
      //  decisions should be closer to the people affected"
      devolve_power: {
        continuous: {
          ONT_S: { pos: [0.20, 0.32, 0.30, 0.13, 0.05], sal: [0.10, 0.25, 0.40, 0.25] },
          MAT:   { pos: [0.05, 0.13, 0.27, 0.35, 0.20] },
          PRO:   { pos: [0.15, 0.25, 0.35, 0.18, 0.07] }
        }
      },
      // "Reduce the role of unelected experts and elites — reassert
      //  democratic majorities and ordinary-citizen control"
      democratize_rein_in: {
        continuous: {
          ONT_S: { pos: [0.40, 0.32, 0.18, 0.07, 0.03], sal: [0.05, 0.20, 0.40, 0.35] },
          MAT:   { pos: [0.20, 0.30, 0.30, 0.13, 0.07] },
          PRO:   { pos: [0.40, 0.30, 0.18, 0.07, 0.05] }
        }
      },
      // "Less government overall — more should be left to civil society
      //  and markets"
      shrink_government: {
        continuous: {
          ONT_S: { pos: [0.42, 0.30, 0.18, 0.07, 0.03], sal: [0.10, 0.25, 0.40, 0.25] },
          MAT:   { pos: [0.02, 0.05, 0.18, 0.32, 0.43] },
          PRO:   { pos: [0.20, 0.30, 0.30, 0.15, 0.05] }
        }
      }
    }
  }
];
