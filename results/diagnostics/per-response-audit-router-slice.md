# Per-Response Evidence Audit — Router Slice

Generated: 2026-05-19.

Slice: the 15 questions in `SALIENCE_ROUTER_FIXED` (engine/config.ts). These fire for every respondent, so calibration errors here have maximum impact.

Each row reports the mechanical findings only. Manual SIGN / UNDER-PULL / OVER-PULL / ASYMMETRIC judgments are annotated inline as `// audit:` comments.

## Summary

- Router questions: 15
- Total evidence rows in router slice: 112
- Mechanical flags in router slice: 0

**Full-bank totals (for context):**
- Questions: 106
- Evidence rows: 883
- Mechanical flags: 12
  - EVIDENCE_NOT_IN_TOUCHPROFILE: 12

## Q200 — party_identification

- UI: `single_choice` · stage: `fixed12` · quality: 0.99
- Prompt: *Which best describes how you think of your political affiliation?*
- touchProfile:
  - `MAT` · position · w=0.2
  - `CD` · position · w=0.2
  - `CU` · position · w=0.2
  - `MOR` · position · w=0.2
  - `ZS` · position · w=0.2
  - `ONT_S` · position · w=0.2
  - `ONT_H` · position · w=0.2

**Evidence rows:**

| option/bucket | evidence target | shape | touch declared | flag |
|---|---|---|---|---|
| `dem` — *Democrat* | `MAT.pos` | peak=1@0.25 [0.25, 0.25, 0.20, 0.16, 0.14] | ✓ |  |
| `dem` — *Democrat* | `CD.pos` | peak=1@0.25 [0.25, 0.25, 0.20, 0.16, 0.14] | ✓ |  |
| `dem` — *Democrat* | `CU.pos` | peak=1@0.25 [0.25, 0.25, 0.20, 0.16, 0.14] | ✓ |  |
| `dem` — *Democrat* | `MOR.pos` | peak=4@0.25 [0.14, 0.16, 0.20, 0.25, 0.25] | ✓ |  |
| `dem` — *Democrat* | `ZS.pos` | peak=1@0.25 [0.25, 0.25, 0.20, 0.16, 0.14] | ✓ |  |
| `dem` — *Democrat* | `ONT_S.pos` | peak=4@0.25 [0.14, 0.16, 0.20, 0.25, 0.25] | ✓ |  |
| `dem` — *Democrat* | `ONT_H.pos` | peak=4@0.25 [0.14, 0.16, 0.20, 0.25, 0.25] | ✓ |  |
| `rep` — *Republican* | `MAT.pos` | peak=4@0.25 [0.14, 0.16, 0.20, 0.25, 0.25] | ✓ |  |
| `rep` — *Republican* | `CD.pos` | peak=4@0.25 [0.14, 0.16, 0.20, 0.25, 0.25] | ✓ |  |
| `rep` — *Republican* | `CU.pos` | peak=4@0.25 [0.14, 0.16, 0.20, 0.25, 0.25] | ✓ |  |
| `rep` — *Republican* | `MOR.pos` | peak=1@0.25 [0.25, 0.25, 0.20, 0.16, 0.14] | ✓ |  |
| `rep` — *Republican* | `ZS.pos` | peak=4@0.25 [0.14, 0.16, 0.20, 0.25, 0.25] | ✓ |  |
| `rep` — *Republican* | `ONT_S.pos` | peak=1@0.25 [0.25, 0.25, 0.20, 0.16, 0.14] | ✓ |  |
| `rep` — *Republican* | `ONT_H.pos` | peak=1@0.25 [0.25, 0.25, 0.20, 0.16, 0.14] | ✓ |  |

## Q103 — issue_salience_screener

- UI: `priority_sort` · stage: `fixed12` · quality: 0.98
- Prompt: *Sort each political topic by how much it enters into your politics. Topics that feel central to your political identity go on the left. Topics you don't consider much go on the right.*
- touchProfile:
  - `MAT` · salience · w=0.95
  - `CD` · salience · w=0.95
  - `CU` · salience · w=0.95
  - `MOR` · salience · w=0.95
  - `PRO` · salience · w=0.95
  - `COM` · salience · w=0.95
  - `ZS` · salience · w=0.95
  - `ONT_H` · salience · w=0.95
  - `ONT_S` · salience · w=0.95
  - `EPS` · salience · w=0.95
  - `AES` · salience · w=0.95

**Evidence rows:**

| option/bucket | evidence target | shape | touch declared | flag |
|---|---|---|---|---|

## Q97 — political_thought_frequency

- UI: `single_choice` · stage: `fixed12` · quality: 0.9
- Prompt: —
- touchProfile:
  - `PF` · position · w=0.7
  - `ENG` · position · w=0.55

**Evidence rows:**

| option/bucket | evidence target | shape | touch declared | flag |
|---|---|---|---|---|
| `rarely_elections` | `PF.pos` | peak=1@0.55 [0.55, 0.28, 0.12, 0.03, 0.02] · **sharp** | ✓ |  |
| `rarely_elections` | `ENG.pos` | peak=1@0.60 [0.60, 0.25, 0.10, 0.04, 0.01] · **sharp** | ✓ |  |
| `sometimes_events` | `PF.pos` | peak=2@0.40 [0.20, 0.40, 0.25, 0.12, 0.03] | ✓ |  |
| `sometimes_events` | `ENG.pos` | peak=2@0.40 [0.25, 0.40, 0.22, 0.10, 0.03] | ✓ |  |
| `regularly_daily` | `PF.pos` | peak=3@0.35 [0.05, 0.15, 0.35, 0.32, 0.13] | ✓ |  |
| `regularly_daily` | `ENG.pos` | peak=4@0.36 [0.04, 0.12, 0.30, 0.36, 0.18] | ✓ |  |
| `constantly_worldview` | `PF.pos` | peak=5@0.45 [0.02, 0.05, 0.15, 0.33, 0.45] · **sharp** | ✓ |  |
| `constantly_worldview` | `ENG.pos` | peak=5@0.53 [0.01, 0.04, 0.12, 0.30, 0.53] · **sharp** | ✓ |  |

## Q60 — politically_important_identities

- UI: `priority_sort` · stage: `screen20` · quality: 0.96
- Prompt: —
- touchProfile:
  - `TRB_ANCHOR` · anchor · w=0.95
  - `MORAL_CIRCLE` · affinity · w=0.1

**Evidence rows:**

| option/bucket | evidence target | shape | touch declared | flag |
|---|---|---|---|---|
| `national_identity` | `TRB_ANCHOR.anchor` | anchors=[national] | ✓ |  |
| `national_identity` | `MORAL_CIRCLE.scoped.national` | scalar=70 | ✓ |  |
| `ideological_identity` | `TRB_ANCHOR.anchor` | anchors=[ideological] | ✓ |  |
| `ideological_identity` | `MORAL_CIRCLE.scoped.ideological` | scalar=70 | ✓ |  |
| `religious_identity` | `TRB_ANCHOR.anchor` | anchors=[religious] | ✓ |  |
| `religious_identity` | `MORAL_CIRCLE.scoped.religious` | scalar=70 | ✓ |  |
| `class_identity` | `TRB_ANCHOR.anchor` | anchors=[class] | ✓ |  |
| `class_identity` | `MORAL_CIRCLE.scoped.class` | scalar=70 | ✓ |  |
| `ethnic_racial_identity` | `TRB_ANCHOR.anchor` | anchors=[ethnic_racial] | ✓ |  |
| `ethnic_racial_identity` | `MORAL_CIRCLE.scoped.ethnic_racial` | scalar=70 | ✓ |  |
| `gender_identity` | `TRB_ANCHOR.anchor` | anchors=[gender] | ✓ |  |
| `gender_identity` | `MORAL_CIRCLE.scoped.gender` | scalar=70 | ✓ |  |
| `global_citizen` | `TRB_ANCHOR.anchor` | anchors=[global] | ✓ |  |
| `global_citizen` | `MORAL_CIRCLE.universal` | scalar=75 | ✓ |  |

## Q89 — epistemic_style_battery

- UI: `best_worst` · stage: `fixed12` · quality: 0.92
- Prompt: —
- touchProfile:
  - `EPS` · category · w=0.85
  - `EPS` · salience · w=0.55

**Evidence rows:**

| option/bucket | evidence target | shape | touch declared | flag |
|---|---|---|---|---|

## Q218 — aesthetic_style_ranking

- UI: `best_worst` · stage: `fixed12` · quality: 0.96
- Prompt: *Pick the political leadership style you find most appealing and the one you find least appealing.*
- touchProfile:
  - `AES` · category · w=0.95
  - `AES` · salience · w=0.35

**Evidence rows:**

| option/bucket | evidence target | shape | touch declared | flag |
|---|---|---|---|---|

## Q211 — strategic_voting

- UI: `single_choice` · stage: `fixed12` · quality: 0.95
- Prompt: —
- touchProfile:

**Evidence rows:**

| option/bucket | evidence target | shape | touch declared | flag |
|---|---|---|---|---|

## Q212 — negative_partisanship

- UI: `single_choice` · stage: `fixed12` · quality: 0.95
- Prompt: —
- touchProfile:

**Evidence rows:**

| option/bucket | evidence target | shape | touch declared | flag |
|---|---|---|---|---|

## Q93 — priority_sort_opener

- UI: `priority_sort` · stage: `fixed12` · quality: 0.96
- Prompt: —
- touchProfile:
  - `MAT` · salience · w=0.85
  - `MAT` · position · w=0.55
  - `CD` · salience · w=0.85
  - `CD` · position · w=0.55
  - `CU` · salience · w=0.85
  - `CU` · position · w=0.55
  - `MOR` · salience · w=0.85
  - `MOR` · position · w=0.55
  - `PRO` · salience · w=0.85
  - `PRO` · position · w=0.55
  - `COM` · salience · w=0.85
  - `COM` · position · w=0.55

**Evidence rows:**

| option/bucket | evidence target | shape | touch declared | flag |
|---|---|---|---|---|
| `mat_low` | `MAT.pos` | peak=1@0.45 [0.45, 0.30, 0.15, 0.07, 0.03] · **sharp** | ✓ |  |
| `mat_high` | `MAT.pos` | peak=5@0.45 [0.03, 0.07, 0.15, 0.30, 0.45] · **sharp** | ✓ |  |
| `cd_low` | `CD.pos` | peak=1@0.45 [0.45, 0.30, 0.15, 0.07, 0.03] · **sharp** | ✓ |  |
| `cd_high` | `CD.pos` | peak=5@0.45 [0.03, 0.07, 0.15, 0.30, 0.45] · **sharp** | ✓ |  |
| `cu_low` | `CU.pos` | peak=1@0.45 [0.45, 0.30, 0.15, 0.07, 0.03] · **sharp** | ✓ |  |
| `cu_high` | `CU.pos` | peak=5@0.45 [0.03, 0.07, 0.15, 0.30, 0.45] · **sharp** | ✓ |  |
| `mor_low` | `MOR.pos` | peak=1@0.45 [0.45, 0.30, 0.15, 0.07, 0.03] · **sharp** | ✓ |  |
| `mor_high` | `MOR.pos` | peak=5@0.45 [0.03, 0.07, 0.15, 0.30, 0.45] · **sharp** | ✓ |  |
| `pro_low` | `PRO.pos` | peak=1@0.45 [0.45, 0.30, 0.15, 0.07, 0.03] · **sharp** | ✓ |  |
| `pro_high` | `PRO.pos` | peak=5@0.45 [0.03, 0.07, 0.15, 0.30, 0.45] · **sharp** | ✓ |  |
| `com_low` | `COM.pos` | peak=1@0.45 [0.45, 0.30, 0.15, 0.07, 0.03] · **sharp** | ✓ |  |
| `com_high` | `COM.pos` | peak=5@0.45 [0.03, 0.07, 0.15, 0.30, 0.45] · **sharp** | ✓ |  |

## Q102 — membership_criteria_priority_sort

- UI: `priority_sort` · stage: `fixed12` · quality: 0.9
- Prompt: —
- touchProfile:
  - `CU` · position · w=0.3
  - `CU` · salience · w=0.8
  - `MORAL_CIRCLE` · affinity · w=0.1

**Evidence rows:**

| option/bucket | evidence target | shape | touch declared | flag |
|---|---|---|---|---|
| `born_here` — *Being born in the country — having citizenship by birth* | `CU.pos` | peak=1@0.50 [0.50, 0.30, 0.12, 0.06, 0.02] · **sharp** | ✓ |  |
| `born_here` — *Being born in the country — having citizenship by birth* | `MORAL_CIRCLE.scoped.national` | scalar=75 | ✓ |  |
| `speak_lang` — *Being able to speak the national language* | `CU.pos` | peak=2@0.32 [0.20, 0.32, 0.30, 0.12, 0.06] | ✓ |  |
| `speak_lang` — *Being able to speak the national language* | `MORAL_CIRCLE.scoped.national` | scalar=60 | ✓ |  |
| `shared_values` — *Believing in the core civic values (liberty, equality, rule of law)* | `CU.pos` | peak=3@0.40 [0.10, 0.22, 0.40, 0.20, 0.08] | ✓ |  |
| `shared_values` — *Believing in the core civic values (liberty, equality, rule of law)* | `MORAL_CIRCLE.universal` | scalar=65 | ✓ |  |
| `civic_part` — *Participating in civic life — voting, jury duty, community involvement* | `CU.pos` | peak=3@0.40 [0.08, 0.20, 0.40, 0.22, 0.10] | ✓ |  |
| `civic_part` — *Participating in civic life — voting, jury duty, community involvement* | `MORAL_CIRCLE.universal` | scalar=65 | ✓ |  |
| `cultural` — *Adopting cultural customs, holidays, and traditions* | `CU.pos` | peak=2@0.32 [0.30, 0.32, 0.22, 0.10, 0.06] | ✓ |  |
| `cultural` — *Adopting cultural customs, holidays, and traditions* | `MORAL_CIRCLE.scoped.national` | scalar=65 | ✓ |  |
| `ancestry` — *Having ancestral roots in the country going back generations* | `CU.pos` | peak=1@0.55 [0.55, 0.25, 0.10, 0.06, 0.04] · **sharp** | ✓ |  |
| `ancestry` — *Having ancestral roots in the country going back generations* | `MORAL_CIRCLE.scoped.national` | scalar=80 | ✓ |  |
| `religion` — *Sharing the country's religious heritage and traditions* | `CU.pos` | peak=1@0.55 [0.55, 0.25, 0.10, 0.06, 0.04] · **sharp** | ✓ |  |
| `religion` — *Sharing the country's religious heritage and traditions* | `MORAL_CIRCLE.scoped.religious` | scalar=75 | ✓ |  |
| `religion` — *Sharing the country's religious heritage and traditions* | `MORAL_CIRCLE.scoped.national` | scalar=60 | ✓ |  |
| `economic` — *Contributing economically — holding a job, paying taxes, not being a burden* | `CU.pos` | peak=3@0.32 [0.20, 0.30, 0.32, 0.12, 0.06] | ✓ |  |
| `economic` — *Contributing economically — holding a job, paying taxes, not being a burden* | `MORAL_CIRCLE.scoped.national` | scalar=55 | ✓ |  |

## Q209 — zero_sum_economics_view

- UI: `single_choice` · stage: `fixed12` · quality: 0.9
- Prompt: —
- touchProfile:
  - `ZS` · position · w=0.85
  - `ZS` · salience · w=0.5

**Evidence rows:**

| option/bucket | evidence target | shape | touch declared | flag |
|---|---|---|---|---|
| `pie_grows_for_all` | `ZS.pos` | peak=1@0.55 [0.55, 0.28, 0.10, 0.05, 0.02] · **sharp** | ✓ |  |
| `pie_grows_for_all` | `ZS.sal` | peak=3@0.40 [0.05, 0.20, 0.40, 0.35] | ✓ |  |
| `growth_with_distribution` | `ZS.pos` | peak=2@0.32 [0.20, 0.32, 0.30, 0.13, 0.05] | ✓ |  |
| `growth_with_distribution` | `ZS.sal` | peak=3@0.40 [0.10, 0.25, 0.40, 0.25] | ✓ |  |
| `winners_at_others_expense` | `ZS.pos` | peak=5@0.34 [0.04, 0.10, 0.20, 0.32, 0.34] | ✓ |  |
| `winners_at_others_expense` | `ZS.sal` | peak=4@0.45 [0.05, 0.15, 0.35, 0.45] · **sharp** | ✓ |  |
| `rigged_against_most` | `ZS.pos` | peak=5@0.46 [0.02, 0.05, 0.15, 0.32, 0.46] · **sharp** | ✓ |  |
| `rigged_against_most` | `ZS.sal` | peak=4@0.58 [0.02, 0.10, 0.30, 0.58] · **sharp** | ✓ |  |

## Q210 — human_malleability_view

- UI: `single_choice` · stage: `fixed12` · quality: 0.9
- Prompt: —
- touchProfile:
  - `ONT_H` · position · w=0.85
  - `ONT_H` · salience · w=0.4

**Evidence rows:**

| option/bucket | evidence target | shape | touch declared | flag |
|---|---|---|---|---|
| `largely_fixed` | `ONT_H.pos` | peak=1@0.50 [0.50, 0.30, 0.13, 0.05, 0.02] · **sharp** | ✓ |  |
| `largely_fixed` | `ONT_H.sal` | peak=3@0.40 [0.05, 0.20, 0.40, 0.35] | ✓ |  |
| `modest_shaping` | `ONT_H.pos` | peak=2@0.32 [0.20, 0.32, 0.30, 0.13, 0.05] | ✓ |  |
| `modest_shaping` | `ONT_H.sal` | peak=3@0.40 [0.10, 0.25, 0.40, 0.25] | ✓ |  |
| `substantial_shaping` | `ONT_H.pos` | peak=4@0.32 [0.05, 0.13, 0.30, 0.32, 0.20] | ✓ |  |
| `substantial_shaping` | `ONT_H.sal` | peak=3@0.40 [0.10, 0.25, 0.40, 0.25] | ✓ |  |
| `mostly_made_by_environment` | `ONT_H.pos` | peak=5@0.46 [0.02, 0.05, 0.15, 0.32, 0.46] · **sharp** | ✓ |  |
| `mostly_made_by_environment` | `ONT_H.sal` | peak=3@0.40 [0.05, 0.20, 0.40, 0.35] | ✓ |  |

## Q214 — institutions_foundational

- UI: `single_choice` · stage: `fixed12` · quality: 0.95
- Prompt: *Setting aside how well institutions function right now, how essential do you think strong institutions — laws, courts, civic organizations, international bodies — are to a society's long-term flourishing?*
- touchProfile:
  - `ONT_S` · position · w=0.85
  - `ONT_S` · salience · w=0.5
  - `PRO` · position · w=0.25
  - `ONT_H` · position · w=0.1

**Evidence rows:**

| option/bucket | evidence target | shape | touch declared | flag |
|---|---|---|---|---|
| `foundational_essential` | `ONT_S.pos` | peak=5@0.50 [0.02, 0.05, 0.13, 0.30, 0.50] · **sharp** | ✓ |  |
| `foundational_essential` | `ONT_S.sal` | peak=4@0.58 [0.02, 0.10, 0.30, 0.58] · **sharp** | ✓ |  |
| `foundational_essential` | `PRO.pos` | peak=4@0.30 [0.05, 0.15, 0.25, 0.30, 0.25] | ✓ |  |
| `foundational_essential` | `ONT_H.pos` | peak=3@0.30 [0.05, 0.15, 0.30, 0.30, 0.20] | ✓ |  |
| `important_with_caveats` | `ONT_S.pos` | peak=4@0.35 [0.05, 0.13, 0.27, 0.35, 0.20] | ✓ |  |
| `important_with_caveats` | `ONT_S.sal` | peak=3@0.40 [0.10, 0.25, 0.40, 0.25] | ✓ |  |
| `important_with_caveats` | `PRO.pos` | peak=3@0.34 [0.08, 0.18, 0.34, 0.28, 0.12] | ✓ |  |
| `important_with_caveats` | `ONT_H.pos` | peak=3@0.40 [0.10, 0.20, 0.40, 0.20, 0.10] | ✓ |  |
| `depends_on_design` | `ONT_S.pos` | peak=3@0.40 [0.10, 0.25, 0.40, 0.18, 0.07] | ✓ |  |
| `depends_on_design` | `ONT_S.sal` | peak=2@0.35 [0.20, 0.35, 0.30, 0.15] | ✓ |  |
| `depends_on_design` | `PRO.pos` | peak=3@0.35 [0.15, 0.25, 0.35, 0.18, 0.07] | ✓ |  |
| `instruments_not_essential` | `ONT_S.pos` | peak=2@0.35 [0.30, 0.35, 0.22, 0.10, 0.03] | ✓ |  |
| `instruments_not_essential` | `ONT_S.sal` | peak=2@0.35 [0.20, 0.35, 0.30, 0.15] | ✓ |  |
| `instruments_not_essential` | `PRO.pos` | peak=1@0.30 [0.30, 0.30, 0.22, 0.12, 0.06] | ✓ |  |
| `obstacles_to_progress` | `ONT_S.pos` | peak=1@0.55 [0.55, 0.28, 0.10, 0.05, 0.02] · **sharp** | ✓ |  |
| `obstacles_to_progress` | `ONT_S.sal` | peak=3@0.40 [0.05, 0.20, 0.40, 0.35] | ✓ |  |
| `obstacles_to_progress` | `PRO.pos` | peak=1@0.40 [0.40, 0.30, 0.18, 0.07, 0.05] | ✓ |  |
| `obstacles_to_progress` | `ONT_H.pos` | peak=3@0.30 [0.20, 0.25, 0.30, 0.15, 0.10] | ✓ |  |

## Q8 — domestic_vs_abroad_lives

- UI: `single_choice` · stage: `fixed12` · quality: 0.92
- Prompt: —
- touchProfile:
  - `MOR` · position · w=0.3
  - `MORAL_CIRCLE` · affinity · w=0.1

**Evidence rows:**

| option/bucket | evidence target | shape | touch declared | flag |
|---|---|---|---|---|
| `clearly_domestic` — *Program A — save 10 lives in your country* | `MOR.pos` | peak=1@0.55 [0.55, 0.28, 0.12, 0.04, 0.01] · **sharp** | ✓ |  |
| `clearly_domestic` — *Program A — save 10 lives in your country* | `MORAL_CIRCLE.universal` | scalar=30 | ✓ |  |
| `clearly_domestic` — *Program A — save 10 lives in your country* | `MORAL_CIRCLE.scoped.national` | scalar=75 | ✓ |  |
| `hard_to_say` — *Hard to say — I'd want to know more before choosing* | `MOR.pos` | peak=3@0.48 [0.08, 0.18, 0.48, 0.18, 0.08] · **sharp** | ✓ |  |
| `hard_to_say` — *Hard to say — I'd want to know more before choosing* | `MORAL_CIRCLE.universal` | scalar=55 | ✓ |  |
| `clearly_abroad` — *Program B — save 100 lives in a developing nation* | `MOR.pos` | peak=5@0.55 [0.01, 0.04, 0.12, 0.28, 0.55] · **sharp** | ✓ |  |
| `clearly_abroad` — *Program B — save 100 lives in a developing nation* | `MORAL_CIRCLE.universal` | scalar=75 | ✓ |  |

## Q229 — moral_circle_in_group_sort

- UI: `priority_sort` · stage: `fixed12` · quality: 0.97
- Prompt: *How much extra moral concern do you feel for each of these groups, beyond what you feel for people in general? Sort each into the column that fits best.*
- touchProfile:
  - `MORAL_CIRCLE` · affinity · w=0.1

**Evidence rows:**

| option/bucket | evidence target | shape | touch declared | flag |
|---|---|---|---|---|
| `ingroup_national` — *Fellow citizens of your country* | `MORAL_CIRCLE.scoped.national` | scalar=95 | ✓ |  |
| `ingroup_religious` — *People who share your religious tradition* | `MORAL_CIRCLE.scoped.religious` | scalar=95 | ✓ |  |
| `ingroup_ethnic_racial` — *People of your racial or ethnic background* | `MORAL_CIRCLE.scoped.ethnic_racial` | scalar=95 | ✓ |  |
| `ingroup_class` — *People in your economic class* | `MORAL_CIRCLE.scoped.class` | scalar=95 | ✓ |  |
| `ingroup_gender` — *People who share your gender* | `MORAL_CIRCLE.scoped.gender` | scalar=95 | ✓ |  |
| `ingroup_ideological` — *People who share your core political values* | `MORAL_CIRCLE.scoped.ideological` | scalar=95 | ✓ |  |
