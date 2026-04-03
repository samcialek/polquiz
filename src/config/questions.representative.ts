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
      { node: "ENG", kind: "continuous", role: "salience", weight: 0.60, touchType: "behavior_frequency" },
      { node: "PF", kind: "continuous", role: "salience", weight: 0.20, touchType: "identity_proxy" }
    ],
    optionEvidence: {
      never: {
        continuous: {
          ENG: { pos: [0.70, 0.20, 0.08, 0.02, 0.00], sal: [0.60, 0.25, 0.10, 0.05] }
        }
      },
      few_days: {
        continuous: {
          ENG: { pos: [0.25, 0.45, 0.20, 0.08, 0.02], sal: [0.25, 0.40, 0.25, 0.10] }
        }
      },
      most_days: {
        continuous: {
          ENG: { pos: [0.03, 0.10, 0.25, 0.40, 0.22], sal: [0.05, 0.15, 0.40, 0.40] }
        }
      },
      every_day: {
        continuous: {
          ENG: { pos: [0.00, 0.02, 0.08, 0.25, 0.65], sal: [0.02, 0.08, 0.25, 0.65] }
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
      { node: "ENG", kind: "continuous", role: "salience", weight: 0.20, touchType: "identity_proxy" }
    ],
    sliderMap: {
      "0-20": { continuous: { PF: { sal: [0.70, 0.22, 0.07, 0.01] }, ENG: { sal: [0.55, 0.28, 0.12, 0.05] } } },
      "21-40": { continuous: { PF: { sal: [0.25, 0.45, 0.22, 0.08] }, ENG: { sal: [0.25, 0.40, 0.25, 0.10] } } },
      "41-60": { continuous: { PF: { sal: [0.08, 0.30, 0.40, 0.22] }, ENG: { sal: [0.10, 0.25, 0.38, 0.27] } } },
      "61-80": { continuous: { PF: { sal: [0.02, 0.10, 0.38, 0.50] }, ENG: { sal: [0.05, 0.12, 0.33, 0.50] } } },
      "81-100": { continuous: { PF: { sal: [0.00, 0.03, 0.22, 0.75] }, ENG: { sal: [0.02, 0.05, 0.23, 0.70] } } }
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
      { node: "EPS", kind: "categorical", role: "category", weight: 0.80, touchType: "taste_proxy" },
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
      { node: "ONT_S", kind: "continuous", role: "salience", weight: 0.50, touchType: "derived_allocation_concentration" }
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
    quality: 0.90,
    rewriteNeeded: false,
    touchProfile: [
      { node: "ONT_S", kind: "continuous", role: "position", weight: 0.85, touchType: "causal_allocation" },
      { node: "ZS", kind: "continuous", role: "position", weight: 0.55, touchType: "conflict_attribution" },
      { node: "ONT_H", kind: "continuous", role: "position", weight: 0.25, touchType: "motive_model" },
      { node: "ZS", kind: "continuous", role: "salience", weight: 0.50, touchType: "derived_allocation_concentration" },
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
      { node: "PRO", kind: "continuous", role: "position", weight: 0.80, touchType: "rights_tradeoff" },
      { node: "COM", kind: "continuous", role: "position", weight: 0.35, touchType: "civic_balance" },
      { node: "EPS", kind: "categorical", role: "category", weight: 0.15, touchType: "truth_authority_proxy" }
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
      { node: "ONT_H", kind: "continuous", role: "position", weight: 0.10, touchType: "human_nature_proxy" }
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
    touchProfile: [
      { node: "TRB", kind: "continuous", role: "position", weight: 0.75, touchType: "outgroup_model" },
      { node: "COM", kind: "continuous", role: "position", weight: 0.45, touchType: "outgroup_model" },
      { node: "ONT_H", kind: "continuous", role: "position", weight: 0.30, touchType: "motive_model" }
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
      { node: "PRO", kind: "continuous", role: "position", weight: 0.10, touchType: "governance_style" },
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
    quality: 0.90,
    rewriteNeeded: false,
    touchProfile: [
      { node: "CD", kind: "continuous", role: "position", weight: 0.90, touchType: "direct_placement" },
      { node: "CU", kind: "continuous", role: "position", weight: 0.30, touchType: "boundary_proxy" },
      { node: "MOR", kind: "continuous", role: "position", weight: 0.20, touchType: "values_proxy" }
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
      { node: "MOR", kind: "continuous", role: "position", weight: 0.90, touchType: "moral_scope_tradeoff" },
      { node: "TRB", kind: "continuous", role: "position", weight: 0.25, touchType: "moral_scope_tradeoff" },
      { node: "ZS", kind: "continuous", role: "position", weight: 0.15, touchType: "moral_scope_tradeoff" },
      { node: "MOR", kind: "continuous", role: "salience", weight: 0.85, touchType: "checkbox_salience" }
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
      { node: "EPS", kind: "categorical", role: "category", weight: 0.35, touchType: "factual_calibration" },
      { node: "ENG", kind: "continuous", role: "position", weight: 0.10, touchType: "policy_attention" }
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
      { node: "MAT", kind: "continuous", role: "position", weight: 0.92, touchType: "policy_preference" },
      { node: "MAT", kind: "continuous", role: "salience", weight: 0.35, touchType: "policy_preference" }
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
      { node: "COM", kind: "continuous", role: "position", weight: 0.35, touchType: "outgroup_trust_estimate" },
      { node: "ZS", kind: "continuous", role: "position", weight: 0.15, touchType: "outgroup_trust_estimate" }
    ],
    sliderMap: {
      "0-20":   { continuous: { TRB: { pos: [0.01, 0.04, 0.12, 0.28, 0.55] }, ZS: { } } },
      "21-40":  { continuous: { TRB: { pos: [0.03, 0.09, 0.20, 0.38, 0.30] }, ZS: { } } },
      "41-60":  { continuous: { TRB: { pos: [0.08, 0.18, 0.48, 0.18, 0.08] }, ZS: { } } },
      "61-80":  { continuous: { TRB: { pos: [0.30, 0.38, 0.20, 0.09, 0.03] }, ZS: { } } },
      "81-100": { continuous: { TRB: { pos: [0.55, 0.28, 0.12, 0.04, 0.01] }, ZS: { } } }
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
      { node: "PF", kind: "continuous", role: "salience", weight: 0.70, touchType: "identity_enemy_link" },
      { node: "TRB", kind: "continuous", role: "salience", weight: 0.45, touchType: "identity_enemy_link" }
    ],
    sliderMap: {
      "0-20":   { continuous: { PF: { sal: [0.50, 0.30, 0.15, 0.05] }, TRB: { sal: [0.55, 0.30, 0.12, 0.03] } } },
      "21-40":  { continuous: { PF: { sal: [0.25, 0.38, 0.27, 0.10] }, TRB: { sal: [0.25, 0.40, 0.25, 0.10] } } },
      "41-60":  { continuous: { PF: { sal: [0.10, 0.25, 0.40, 0.25] }, TRB: { sal: [0.10, 0.28, 0.38, 0.24] } } },
      "61-80":  { continuous: { PF: { sal: [0.04, 0.12, 0.38, 0.46] }, TRB: { sal: [0.04, 0.14, 0.40, 0.42] } } },
      "81-100": { continuous: { PF: { sal: [0.02, 0.08, 0.30, 0.60] }, TRB: { sal: [0.02, 0.08, 0.35, 0.55] } } }
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
      { node: "TRB", kind: "continuous", role: "salience", weight: 0.20, touchType: "identity_salience" },
      { node: "TRB_ANCHOR", kind: "derived", role: "anchor", weight: 0.25, touchType: "nationality_anchor" }
    ],
    sliderMap: {
      "0-20":   { continuous: { CU: { sal: [0.55, 0.30, 0.12, 0.03] }, CD: { sal: [0.50, 0.30, 0.15, 0.05] }, TRB: { sal: [0.50, 0.30, 0.15, 0.05] } } },
      "21-40":  { continuous: { CU: { sal: [0.25, 0.40, 0.25, 0.10] }, CD: { sal: [0.28, 0.38, 0.24, 0.10] }, TRB: { sal: [0.28, 0.38, 0.24, 0.10] } } },
      "41-60":  { continuous: { CU: { sal: [0.08, 0.28, 0.40, 0.24] }, CD: { sal: [0.12, 0.28, 0.38, 0.22] }, TRB: { sal: [0.12, 0.28, 0.38, 0.22] } } },
      "61-80":  { continuous: { CU: { sal: [0.03, 0.12, 0.40, 0.45] }, CD: { sal: [0.05, 0.18, 0.40, 0.37] }, TRB: { sal: [0.05, 0.18, 0.40, 0.37] } } },
      "81-100": { continuous: { CU: { sal: [0.02, 0.08, 0.30, 0.60] }, CD: { sal: [0.03, 0.12, 0.35, 0.50] }, TRB: { sal: [0.03, 0.12, 0.35, 0.50] } } }
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
          PRO: { pos: [0.02, 0.08, 0.20, 0.38, 0.32] },
          ONT_H: { pos: [0.05, 0.12, 0.30, 0.33, 0.20] }
        },
      },
      balanced_security: {
        continuous: {
          PRO: { pos: [0.08, 0.20, 0.44, 0.20, 0.08] }
        },
      },
      security_priority: {
        continuous: {
          PRO: { pos: [0.32, 0.38, 0.20, 0.08, 0.02] },
          ONT_H: { pos: [0.20, 0.33, 0.30, 0.12, 0.05] }
        },
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
      { node: "PRO", kind: "continuous", role: "position", weight: 0.20, touchType: "principle_tradeoff" }
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
      { node: "COM", kind: "continuous", role: "position", weight: 0.45, touchType: "social_behavior" },
      { node: "PF", kind: "continuous", role: "salience", weight: 0.15, touchType: "social_behavior" }
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
      { node: "PRO", kind: "continuous", role: "position", weight: 0.20, touchType: "policy_bundle" },
      { node: "ONT_S", kind: "continuous", role: "position", weight: 0.20, touchType: "policy_bundle" },
      { node: "ZS", kind: "continuous", role: "position", weight: 0.10, touchType: "policy_bundle" }
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
          ONT_S: { pos: [0.06, 0.14, 0.30, 0.30, 0.20] }
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
      { node: "MOR", kind: "continuous", role: "position", weight: 0.20, touchType: "fairness_design" },
      { node: "PRO", kind: "continuous", role: "position", weight: 0.15, touchType: "allocation_rule" }
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
      { node: "ONT_H", kind: "continuous", role: "position", weight: 0.20, touchType: "policy_bundle" },
      { node: "COM", kind: "continuous", role: "position", weight: 0.10, touchType: "policy_bundle" }
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
      { node: "MAT", kind: "continuous", role: "position", weight: 0.90, touchType: "fairness_threshold" },
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
      { node: "ONT_H", kind: "continuous", role: "position", weight: 0.90, touchType: "ontology_direct" },
      { node: "ONT_H", kind: "continuous", role: "salience", weight: 0.20, touchType: "ontology_direct" },
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
          ONT_H: { pos: [0.04, 0.12, 0.30, 0.35, 0.19] }
        }
      },
      cyclical: {
        continuous: {
          ONT_H: { pos: [0.15, 0.25, 0.35, 0.18, 0.07] }
        }
      },
      decline: {
        continuous: {
          ONT_H: { pos: [0.42, 0.30, 0.18, 0.07, 0.03] }
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
      { node: "PRO", kind: "continuous", role: "salience", weight: 0.70, touchType: "ratio_salience" },
      { node: "MOR", kind: "continuous", role: "position", weight: 0.12, touchType: "human_motive_proxy" }
    ],
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
      { node: "COM", kind: "continuous", role: "position", weight: 0.10, touchType: "collective_action_proxy" }
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
    options: ["allow_harmful", "censor_legitimate"],
    touchProfile: [
      { node: "PRO", kind: "continuous", role: "position", weight: 0.72, touchType: "speech_harm_tradeoff" },
      { node: "PRO", kind: "continuous", role: "salience", weight: 0.62, touchType: "ratio_salience" },
      { node: "EPS", kind: "categorical", role: "category", weight: 0.20, touchType: "truth_authority_proxy" },
      { node: "COM", kind: "continuous", role: "position", weight: 0.12, touchType: "pluralism_proxy" }
    ],
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
          PRO: { pos: [0.40, 0.32, 0.18, 0.07, 0.03] },
          COM: { pos: [0.10, 0.18, 0.30, 0.24, 0.18] }
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
    quality: 0.90,
    rewriteNeeded: false,
    touchProfile: [
      { node: "ZS", kind: "continuous", role: "position", weight: 0.85, touchType: "macro_sum_view" },
      { node: "ONT_S", kind: "continuous", role: "position", weight: 0.45, touchType: "systems_view" },
      { node: "MAT", kind: "continuous", role: "position", weight: 0.20, touchType: "distribution_proxy" }
    ],
    optionEvidence: {
      net_positive_clear: {
        continuous: {
          ZS: { pos: [0.41, 0.38, 0.15, 0.05, 0.01] },
          ONT_S: { pos: [0.24, 0.38, 0.25, 0.10, 0.03] }
        }
      },
      net_positive_but_uneven: {
        continuous: {
          ZS: { pos: [0.15, 0.30, 0.35, 0.15, 0.05] },
          ONT_S: { pos: [0.12, 0.28, 0.40, 0.15, 0.05] }
        }
      },
      mixed_effects: {
        continuous: {
          ZS: { pos: [0.07, 0.18, 0.35, 0.25, 0.15] },
          ONT_S: { pos: [0.08, 0.20, 0.40, 0.22, 0.10] }
        }
      },
      mostly_harmful: {
        continuous: {
          ZS: { pos: [0.03, 0.07, 0.18, 0.30, 0.42] },
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
      { node: "TRB", kind: "continuous", role: "position", weight: 0.20, touchType: "threat_bundle" },
      { node: "CU", kind: "continuous", role: "position", weight: 0.15, touchType: "threat_bundle" },
      { node: "ONT_S", kind: "continuous", role: "position", weight: 0.15, touchType: "threat_bundle" }
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
          ZS: { pos: [0.05, 0.12, 0.30, 0.33, 0.20] },
          TRB: { pos: [0.15, 0.22, 0.30, 0.22, 0.11] }
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
      { node: "EPS", kind: "categorical", role: "category", weight: 0.20, touchType: "expertise_risk_proxy" },
      { node: "ONT_H", kind: "continuous", role: "position", weight: 0.10, touchType: "risk_humanity_proxy" }
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
      { node: "COM", kind: "continuous", role: "position", weight: 0.25, touchType: "rule_response" },
      { node: "ENG", kind: "continuous", role: "position", weight: 0.10, touchType: "conflict_response" }
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
      { node: "CU", kind: "continuous", role: "position", weight: 0.20, touchType: "boundary_order_proxy" },
      { node: "TRB", kind: "continuous", role: "position", weight: 0.15, touchType: "partisan_fairness_proxy" }
    ],
    optionEvidence: {
      easier_access: {
        continuous: {
          PRO: { pos: [0.04, 0.10, 0.22, 0.34, 0.30] },
          TRB: { pos: [0.15, 0.22, 0.30, 0.22, 0.11] }
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
      { node: "TRB", kind: "continuous", role: "position", weight: 0.75, touchType: "network_homophily" },
      { node: "PF", kind: "continuous", role: "salience", weight: 0.30, touchType: "network_homophily" }
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
      { node: "MAT", kind: "continuous", role: "position", weight: 0.70, touchType: "distributive_choice" },
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
      { node: "COM", kind: "continuous", role: "position", weight: 0.70, touchType: "interpersonal_conflict" },
      { node: "ENG", kind: "continuous", role: "position", weight: 0.35, touchType: "interpersonal_conflict" },
      { node: "PF", kind: "continuous", role: "salience", weight: 0.15, touchType: "interpersonal_conflict" }
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
      { node: "ONT_S", kind: "continuous", role: "position", weight: 0.20, touchType: "progress_worldview" },
      { node: "CD", kind: "continuous", role: "position", weight: 0.10, touchType: "progress_worldview" }
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
          ONT_H: { pos: [0.42, 0.30, 0.18, 0.07, 0.03] }
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
      { node: "CU", kind: "continuous", role: "position", weight: 0.80, touchType: "membership_boundary" },
      { node: "MOR", kind: "continuous", role: "position", weight: 0.20, touchType: "membership_boundary" },
      { node: "PF", kind: "continuous", role: "position", weight: 0.15, touchType: "membership_boundary" },
      { node: "TRB", kind: "continuous", role: "position", weight: 0.20, touchType: "membership_boundary" },
      { node: "TRB_ANCHOR", kind: "derived", role: "anchor", weight: 0.25, touchType: "nationality_anchor" }
    ],
    optionEvidence: {
      civic_participation: {
        continuous: {
          CU: { pos: [0.04, 0.10, 0.28, 0.35, 0.23] }
        }
      },
      shared_values: {
        continuous: {
          CU: { pos: [0.15, 0.25, 0.35, 0.18, 0.07] },
          TRB: { pos: [0.08, 0.15, 0.28, 0.30, 0.19] }
        }
      },
      cultural_heritage: {
        continuous: {
          CU: { pos: [0.30, 0.30, 0.25, 0.10, 0.05] },
          TRB: { pos: [0.05, 0.12, 0.25, 0.33, 0.25] }
        }
      },
      born_here: {
        continuous: {
          CU: { pos: [0.45, 0.28, 0.17, 0.07, 0.03] },
          TRB: { pos: [0.04, 0.10, 0.22, 0.34, 0.30] }
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
    quality: 0.40,
    rewriteNeeded: false,
    touchProfile: [
      { node: "MOR", kind: "continuous", role: "position", weight: 0.10, touchType: "background_context" },
      { node: "CD", kind: "continuous", role: "position", weight: 0.10, touchType: "background_context" },
      { node: "TRB", kind: "continuous", role: "position", weight: 0.10, touchType: "background_context" },
      { node: "TRB_ANCHOR", kind: "derived", role: "anchor", weight: 0.35, touchType: "religious_anchor" }
    ],
    optionEvidence: {
      very_religious: {
        continuous: {
          MOR: { pos: [0.25, 0.27, 0.23, 0.15, 0.10] },
          CD: { pos: [0.25, 0.27, 0.23, 0.15, 0.10] }
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
          MOR: { pos: [0.10, 0.15, 0.25, 0.27, 0.23] },
          CD: { pos: [0.10, 0.15, 0.25, 0.27, 0.23] }
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
      { node: "EPS", kind: "categorical", role: "category", weight: 0.20, touchType: "leader_evaluation" },
      { node: "ENG", kind: "continuous", role: "position", weight: 0.10, touchType: "leader_evaluation" }
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
          AES: { cat: AES_PROTOTYPES.pastoral },
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
      { node: "EPS", kind: "categorical", role: "category", weight: 0.30, touchType: "rhetorical_preference" },
      { node: "TRB", kind: "continuous", role: "position", weight: 0.20, touchType: "rhetorical_preference" },
      { node: "ZS", kind: "continuous", role: "position", weight: 0.15, touchType: "rhetorical_preference" },
      { node: "PRO", kind: "continuous", role: "position", weight: 0.15, touchType: "rhetorical_preference" },
      { node: "AES", kind: "categorical", role: "salience", weight: 0.80, touchType: "checkbox_salience" }
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
    quality: 0.90,
    rewriteNeeded: false,
    touchProfile: [
      { node: "AES", kind: "categorical", role: "category", weight: 0.88, touchType: "movement_style" },
      { node: "TRB", kind: "continuous", role: "position", weight: 0.20, touchType: "movement_style" },
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
      { node: "TRB", kind: "continuous", role: "salience", weight: 0.30, touchType: "motive_salience" },
      { node: "PRO", kind: "continuous", role: "salience", weight: 0.20, touchType: "motive_salience" },
      { node: "COM", kind: "continuous", role: "salience", weight: 0.20, touchType: "motive_salience" },
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
          ENG: { sal: [0.03, 0.10, 0.37, 0.50] },
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
          ENG: { sal: [0.03, 0.10, 0.37, 0.50] }
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
      { node: "EPS", kind: "categorical", role: "category", weight: 0.88, touchType: "updating_channel" },
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
      { node: "EPS", kind: "categorical", role: "category", weight: 0.92, touchType: "factual_calibration" },
      { node: "EPS", kind: "categorical", role: "salience", weight: 0.45, touchType: "factual_calibration" },
      { node: "ENG", kind: "continuous", role: "position", weight: 0.10, touchType: "issue_attention" }
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
      { node: "MAT", kind: "continuous", role: "position", weight: 0.70, touchType: "economic_attribution" },
      { node: "ONT_S", kind: "continuous", role: "position", weight: 0.65, touchType: "economic_attribution" },
      { node: "ZS", kind: "continuous", role: "position", weight: 0.40, touchType: "conflict_attribution" },
    ],
    rankingMap: {
      global_competition: {
        continuous: { ONT_S: -0.7, ZS: 0.4 }
      },
      automation: {
        continuous: { ONT_S: -0.6 }
      },
      corporate_decisions: {
        continuous: { MAT: -0.7, ZS: 0.6 },
      },
      government_policy: {
        continuous: { MAT: -0.3, ONT_S: -0.3 },
      },
      worker_choices: {
        continuous: { MAT: 0.6, ONT_S: 0.5 },
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
      { node: "MOR", kind: "continuous", role: "position", weight: 0.20, touchType: "membership_expectation" },
      { node: "TRB", kind: "continuous", role: "position", weight: 0.20, touchType: "boundary_identity" }
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
      { node: "PF", kind: "continuous", role: "salience", weight: 0.30, touchType: "best_worst_asymmetric" },
      { node: "TRB", kind: "continuous", role: "salience", weight: 0.30, touchType: "best_worst_asymmetric" },
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
      { node: "ONT_S", kind: "continuous", role: "position", weight: 0.80, touchType: "grievance_proxy" },
      { node: "PRO", kind: "continuous", role: "position", weight: 0.15, touchType: "grievance_proxy" },
      { node: "CD", kind: "continuous", role: "position", weight: 0.20, touchType: "grievance_proxy" },
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
          ONT_S: { pos: [0.40, 0.30, 0.18, 0.08, 0.04] },
          PRO: { pos: [0.18, 0.28, 0.30, 0.16, 0.08] }
        }
      },
      // "Both sides are more interested in fighting than solving real problems"
      both_sides_broken: {
        continuous: {
          ONT_S: { pos: [0.60, 0.24, 0.10, 0.04, 0.02] }
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
          CD: { pos: [0.03, 0.07, 0.15, 0.30, 0.45] },
          ONT_S: { pos: [0.35, 0.30, 0.20, 0.10, 0.05] }
        }
      },
      // "I don't think much about politics — it doesn't affect my daily life"
      politics_irrelevant: {
        continuous: {
          ENG: { pos: [0.62, 0.22, 0.10, 0.04, 0.02] }
        }
      }
    }
  }

  /* Q65, Q66, Q67, Q68 — evidence maps miscalibrated, need recalibration.
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
      { node: "PF", kind: "continuous", role: "salience", weight: 0.70, touchType: "loyalty_tradeoff" },
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
      { node: "MAT", kind: "continuous", role: "position", weight: 0.20, touchType: "economic_proxy" }
    ],
    allocationMap: {
      preserve_heritage: { continuous: { CD: -0.8, PRO: -0.3 } },
      modernize_infrastructure: { continuous: { CD: 0.5, PRO: 0.2, MAT: 0.4 } },
      community_deliberation: { continuous: { PRO: 0.7, COM: 0.5 } },
      market_based_development: { continuous: { MAT: 0.8, PRO: -0.5 } }
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
      { node: "COM", kind: "continuous", role: "salience", weight: 0.90, touchType: "direct_salience" },
      { node: "PRO", kind: "continuous", role: "position", weight: 0.15, touchType: "governance_proxy" }
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
      { node: "AES", kind: "categorical", role: "salience", weight: 0.90, touchType: "direct_salience" },
      { node: "ENG", kind: "continuous", role: "salience", weight: 0.20, touchType: "attention_proxy" }
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
      { node: "PF", kind: "continuous", role: "salience", weight: 0.55, touchType: "identity_strength" },
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
    touchProfile: [
      { node: "EPS", kind: "categorical", role: "category",  weight: 0.85, touchType: "decision_style" },
      { node: "EPS", kind: "categorical", role: "salience",  weight: 0.35, touchType: "decision_style" },
      { node: "AES", kind: "categorical", role: "category",  weight: 0.15, touchType: "style_proxy" }
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
          AES: { cat: AES_PROTOTYPES.authentic, sal: [0.08, 0.15, 0.32, 0.45] },
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
      { node: "EPS", kind: "categorical", role: "category",  weight: 0.82, touchType: "epistemic_response" },
      { node: "EPS", kind: "categorical", role: "salience",  weight: 0.40, touchType: "epistemic_response" },
      { node: "ENG", kind: "continuous",  role: "salience",  weight: 0.15, touchType: "attention_proxy" }
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
          ENG: { sal: [0.50, 0.30, 0.15, 0.05] }
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
          TRB: { pos: [0.12, 0.22, 0.32, 0.22, 0.12] },
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
      { node: "CD", kind: "continuous", role: "position", weight: 0.78, touchType: "cultural_direction" },
      { node: "CU", kind: "continuous", role: "position", weight: 0.88, touchType: "cultural_uniformity" },
      { node: "MOR", kind: "continuous", role: "position", weight: 0.24, touchType: "moral_scope" },
      { node: "MAT", kind: "continuous", role: "position", weight: 0.08, touchType: "economics_signal" }
    ],
    optionEvidence: {
      // A: Preserve inherited culture, tighter limits on openness
      preserve_culture: {
        continuous: {
          CD:  { pos: [0.02, 0.05, 0.13, 0.30, 0.50] },
          CU:  { pos: [0.50, 0.28, 0.14, 0.05, 0.03] },
          MOR: { pos: [0.05, 0.10, 0.25, 0.35, 0.25] }
        }
      },
      // B: Stay open, but newcomers should adopt common civic culture
      civic_assimilation: {
        continuous: {
          CD:  { pos: [0.05, 0.12, 0.28, 0.35, 0.20] },
          CU:  { pos: [0.05, 0.12, 0.25, 0.35, 0.23] },
          MOR: { pos: [0.10, 0.20, 0.40, 0.20, 0.10] }
        }
      },
      // C: Stay open, don't demand cultural convergence
      open_pluralist: {
        continuous: {
          CD:  { pos: [0.50, 0.30, 0.13, 0.05, 0.02] },
          CU:  { pos: [0.03, 0.05, 0.14, 0.28, 0.50] },
          MOR: { pos: [0.25, 0.35, 0.25, 0.10, 0.05] }
        }
      },
      // D: Cultural questions matter less than economic fairness
      economics_first: {
        continuous: {
          MAT: { pos: [0.40, 0.30, 0.18, 0.08, 0.04] },
          CD:  { pos: [0.15, 0.25, 0.35, 0.15, 0.10] },
          CU:  { pos: [0.15, 0.25, 0.30, 0.20, 0.10] },
          MOR: { pos: [0.15, 0.25, 0.35, 0.15, 0.10] }
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
      { node: "CD", kind: "continuous", role: "position", weight: 0.35, touchType: "cultural_direction" },
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
    touchProfile: [
      { node: "ZS", kind: "continuous", role: "position", weight: 0.60, touchType: "zero_sum_institutions" },
      { node: "ONT_H", kind: "continuous", role: "position", weight: 0.45, touchType: "hierarchy_trust" },
      { node: "COM", kind: "continuous", role: "position", weight: 0.25, touchType: "compromise_signal" },
      { node: "PRO", kind: "continuous", role: "position", weight: 0.15, touchType: "procedural_trust" }
    ],
    sliderMap: {
      // 1 = strongly disagree (institutions are fine, hierarchy natural)
      "0-20": {
        continuous: {
          ZS:    { pos: [0.55, 0.25, 0.12, 0.05, 0.03] },
          ONT_H: { pos: [0.03, 0.05, 0.12, 0.28, 0.52] },
          COM:   { pos: [0.05, 0.10, 0.22, 0.35, 0.28] },
          PRO:   { pos: [0.05, 0.10, 0.25, 0.35, 0.25] }
        }
      },
      // 2 = disagree
      "21-40": {
        continuous: {
          ZS:    { pos: [0.30, 0.35, 0.22, 0.08, 0.05] },
          ONT_H: { pos: [0.05, 0.10, 0.22, 0.38, 0.25] },
          COM:   { pos: [0.08, 0.15, 0.30, 0.30, 0.17] },
          PRO:   { pos: [0.08, 0.12, 0.30, 0.30, 0.20] }
        }
      },
      // 3 = mixed
      "41-60": {
        continuous: {
          ZS:    { pos: [0.10, 0.20, 0.40, 0.20, 0.10] },
          ONT_H: { pos: [0.10, 0.20, 0.40, 0.20, 0.10] },
          COM:   { pos: [0.12, 0.22, 0.32, 0.22, 0.12] },
          PRO:   { pos: [0.12, 0.22, 0.32, 0.22, 0.12] }
        }
      },
      // 4 = agree
      "61-80": {
        continuous: {
          ZS:    { pos: [0.05, 0.08, 0.22, 0.35, 0.30] },
          ONT_H: { pos: [0.25, 0.38, 0.22, 0.10, 0.05] },
          COM:   { pos: [0.17, 0.30, 0.30, 0.15, 0.08] },
          PRO:   { pos: [0.20, 0.30, 0.30, 0.12, 0.08] }
        }
      },
      // 5 = strongly agree (institutions always corrupt, domination inevitable)
      "81-100": {
        continuous: {
          ZS:    { pos: [0.03, 0.05, 0.12, 0.25, 0.55] },
          ONT_H: { pos: [0.52, 0.28, 0.12, 0.05, 0.03] },
          COM:   { pos: [0.28, 0.35, 0.22, 0.10, 0.05] },
          PRO:   { pos: [0.25, 0.35, 0.25, 0.10, 0.05] }
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
      { node: "COM", kind: "continuous", role: "position", weight: 0.08, touchType: "compromise_signal" }
    ],
    optionEvidence: {
      // A: It carries inherited ways of life forward
      inherited_tradition: {
        continuous: {
          PRO: { pos: [0.05, 0.12, 0.25, 0.35, 0.23] },
          CD:  { pos: [0.04, 0.08, 0.18, 0.30, 0.40] }
        },
        categorical: {
          EPS: { probs: [0.05, 0.10, 0.55, 0.15, 0.10, 0.05] }
        }
      },
      // B: It follows neutral constitutional rules and procedures
      procedural_rules: {
        continuous: {
          PRO: { pos: [0.01, 0.04, 0.12, 0.28, 0.55] },
          COM: { pos: [0.05, 0.10, 0.25, 0.35, 0.25] }
        },
        categorical: {
          EPS: { probs: [0.35, 0.30, 0.10, 0.10, 0.10, 0.05] }
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
          EPS: { probs: [0.15, 0.15, 0.10, 0.10, 0.40, 0.10] }
        }
      },
      // D: It advances justice, even if rules sometimes have to bend
      justice_first: {
        continuous: {
          PRO: { pos: [0.55, 0.28, 0.12, 0.04, 0.01] },
          COM: { pos: [0.25, 0.30, 0.25, 0.12, 0.08] }
        },
        categorical: {
          EPS: { probs: [0.05, 0.05, 0.05, 0.50, 0.15, 0.20] }
        }
      }
    }
  }
];
