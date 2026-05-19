# Harness Run — Obama → Trump (2016 realignment)

**Persona ID:** `obama-to-trump`
**Date:** 2026-05-19
**Questions asked:** 33

## Reachability scorecard

- Composed archetype label: **Combative Assimilationist Redistributionist**
- Identity-primary overlay: Evangelical Voter
- Engagement level: engaged

**Expected archetype family:** cross-pressured populist-communitarian

**Top-5 by archetype distance** (via `getTopArchetypesForDiagnostics`):

| rank | id | name | distance |
|---|---|---|---|
| 1 | 084 | Civilizational Conservative | 0.412 |
| 2 | 104 | National Protector | 0.413 |
| 3 | 100 | Tribal Insurgent | 0.420 |
| 4 | 088 | Gentle Traditionalist | 0.423 |
| 5 | 083 | Closed Traditionalist | 0.426 |

## Assertions (8/8 pass)

| check | expected | actual | result |
|---|---|---|---|
| Q103: high-salience nodes in supportHigh | `all nodes with sal≥2.5 in supportHigh` | `all placed correctly` | ✓ |
| Q103: low-salience nodes in neutral | `all nodes with sal<1.5 in neutral` | `all placed correctly` | ✓ |
| vote match | `≥4/5` | `4/5` | ✓ |
| composed label contains "Assimilationist" | `Assimilationist` | `Combative Assimilationist Redistributionist` | ✓ |
| identity-primary state | `active` | `active` | ✓ |
| identity-primary label | `Evangelical Voter` | `Evangelical Voter` | ✓ |
| engagement level | `engaged` | `engaged` | ✓ |
| questions asked in range | `[20, 35]` | `33` | ✓ |

## Vote-prediction scorecard

- Match: 4/5

| year | expected | actual | match |
|---|---|---|---|
| 2008 | D | D | ✓ |
| 2012 | D | D | ✓ |
| 2016 | R | R | ✓ |
| 2020 | R | D | ❌ |
| 2024 | R | R | ✓ |

## Question trace

| idx | qId | uiType | promptShort | answer |
|---|---|---|---|---|
| 1 | 200 | single_choice | party_identification | `"ind"` |
| 2 | 103 | priority_sort | issue_salience_screener | `{"supportHigh":["mat","cd","cu","zs"],"supportMid":["mor","ont_s","eps","aes"...` |
| 3 | 97 | single_choice | political_thought_frequency | `"regularly_daily"` |
| 4 | 60 | priority_sort | politically_important_identities | `{"supportHigh":["national_identity"],"supportMid":["ideological_identity","cl...` |
| 5 | 89 | best_worst | epistemic_style_battery | `{"best":["eps_intuitionist"],"worst":["eps_autonomous"]}` |
| 6 | 218 | best_worst | aesthetic_style_ranking | `{"best":["aes_pastoral"],"worst":["aes_visionary"]}` |
| 7 | 211 | single_choice | strategic_voting | `"depends_on_stakes"` |
| 8 | 212 | single_choice | negative_partisanship | `"consider_all"` |
| 9 | 93 | priority_sort | priority_sort_opener | `{"supportHigh":["mat_low","cd_high","cu_low","mor_low","pro_low","com_low"],"...` |
| 10 | 102 | priority_sort | membership_criteria_priority_sort | `{"supportHigh":["born_here","speak_lang","cultural","ancestry","religion","ec...` |
| 11 | 209 | single_choice | zero_sum_economics_view | `"winners_at_others_expense"` |
| 12 | 210 | single_choice | human_malleability_view | `"modest_shaping"` |
| 13 | 214 | single_choice | institutions_foundational | `"important_with_caveats"` |
| 14 | 8 | single_choice | domestic_vs_abroad_lives | `"hard_to_say"` |
| 15 | 229 | priority_sort | moral_circle_in_group_sort | `{"supportHigh":["ingroup_national"],"supportMid":["ingroup_class","ingroup_id...` |
| 16 | 3 | slider | cultural_social_placement | `71` |
| 17 | 202 | single_choice | state_scope_preference | `"universal_strong_state"` |
| 18 | 82 | single_choice | openness_assimilation_closure | `"civic_assimilation"` |
| 19 | 7 | single_choice | coalition_vs_principle | `"principle_first"` |
| 20 | 213 | single_choice | equal_standing_within_polity | `"some_differentiation_acceptable"` |
| 21 | 207 | single_choice | emergency_powers | `"moderate_emergency"` |
| 22 | 78 | best_worst | speaker_appeal | `{"best":["says_what_they_think","calls_out_power"],"worst":["bridge_builder",...` |
| 23 | 20 | allocation | bad_outcomes_blame_allocation | `{"complex_forces":25,"powerful_incompetent":25,"powerful_selfish":25,"ordinar...` |
| 24 | 79 | single_choice | expert_disagreement_reaction | `"both_wrong"` |
| 25 | 61 | single_choice | political_pitch_resonance | `"values_pitch"` |
| 26 | 11 | single_choice | nyt_headline_click | `"timeless_principles"` |
| 27 | 56 | single_choice | effective_leader_style | `"channel_anger"` |
| 28 | 38 | slider | rules_procedures_matter_salience | `31` |
| 29 | 49 | slider | social_progress_salience | `31` |
| 30 | 71 | slider | rhetoric_style_importance | `51` |
| 31 | 69 | slider | common_ground_salience | `31` |
| 32 | 19 | slider | human_progress_salience | `31` |
| 33 | 63 | best_worst | best_worst_battery | `{"best":["fairness"],"worst":["tradition_continuity"]}` |
