# Harness Run — Abstain → Trump (2016 mobilizer)

**Persona ID:** `abstain-to-trump`
**Date:** 2026-05-19
**Questions asked:** 31

## Reachability scorecard

- Composed archetype label: **Combative Partisan-Communitarian Assimilationist**
- Identity-primary overlay: (none)
- Engagement level: casual

**Expected archetype family:** populist-nationalist

**Top-5 by archetype distance** (via `getTopArchetypesForDiagnostics`):

| rank | id | name | distance |
|---|---|---|---|
| 1 | 106 | Militant Partisan | 0.360 |
| 2 | 104 | National Protector | 0.365 |
| 3 | 084 | Civilizational Conservative | 0.371 |
| 4 | 100 | Tribal Insurgent | 0.387 |
| 5 | 101 | Embattled Majoritarian | 0.387 |

## Assertions (11/11 pass)

| check | expected | actual | result |
|---|---|---|---|
| Q103: high-salience nodes in supportHigh | `all nodes with sal≥2.5 in supportHigh` | `all placed correctly` | ✓ |
| Q103: mid-salience nodes in supportMid | `all nodes with 1.5≤sal<2.5 in supportMid` | `all placed correctly` | ✓ |
| Q103: low-salience nodes in neutral | `all nodes with sal<1.5 in neutral` | `all placed correctly` | ✓ |
| top-1 archetype in acceptable list | `one of [106, 104, 084, 100, 101]` | `106 Militant Partisan` | ✓ |
| vote match | `≥5/5` | `5/5` | ✓ |
| composed label contains "Assimilationist" | `Assimilationist` | `Combative Partisan-Communitarian Assimilationist` | ✓ |
| composed label contains "Partisan-Communitarian" | `Partisan-Communitarian` | `Combative Partisan-Communitarian Assimilationist` | ✓ |
| composed label contains "Combative" | `Combative` | `Combative Partisan-Communitarian Assimilationist` | ✓ |
| identity-primary state | `≥ none` | `none` | ✓ |
| engagement level | `casual` | `casual` | ✓ |
| questions asked in range | `[20, 35]` | `31` | ✓ |

## Vote-prediction scorecard

- Match: 5/5

| year | expected | actual | match |
|---|---|---|---|
| 2008 | ABSTAIN | ABSTAIN | ✓ |
| 2012 | ABSTAIN | ABSTAIN | ✓ |
| 2016 | R | R | ✓ |
| 2020 | R | R | ✓ |
| 2024 | R | R | ✓ |

## Question trace

| idx | qId | uiType | promptShort | answer |
|---|---|---|---|---|
| 1 | 200 | single_choice | party_identification | `"ind"` |
| 2 | 103 | priority_sort | issue_salience_screener | `{"supportHigh":["cd","cu","zs","ont_s"],"supportMid":["mat","mor","eps","aes"...` |
| 3 | 97 | single_choice | political_thought_frequency | `"sometimes_events"` |
| 4 | 60 | priority_sort | politically_important_identities | `{"supportHigh":["national_identity","ideological_identity","religious_identit...` |
| 5 | 89 | best_worst | epistemic_style_battery | `{"best":["eps_intuitionist"],"worst":["eps_autonomous"]}` |
| 6 | 218 | best_worst | aesthetic_style_ranking | `{"best":["aes_fighter"],"worst":["aes_visionary"]}` |
| 7 | 211 | single_choice | strategic_voting | `"sincere_always"` |
| 8 | 212 | single_choice | negative_partisanship | `"consider_all"` |
| 9 | 93 | priority_sort | priority_sort_opener | `{"supportHigh":["cd_high","cu_low","mor_low","pro_low","com_low"],"supportMid...` |
| 10 | 102 | priority_sort | membership_criteria_priority_sort | `{"supportHigh":["born_here","speak_lang","cultural","ancestry","religion","ec...` |
| 11 | 209 | single_choice | zero_sum_economics_view | `"winners_at_others_expense"` |
| 12 | 210 | single_choice | human_malleability_view | `"modest_shaping"` |
| 13 | 214 | single_choice | institutions_foundational | `"obstacles_to_progress"` |
| 14 | 8 | single_choice | domestic_vs_abroad_lives | `"clearly_domestic"` |
| 15 | 229 | priority_sort | moral_circle_in_group_sort | `{"supportHigh":["ingroup_national","ingroup_religious","ingroup_ideological"]...` |
| 16 | 3 | slider | cultural_social_placement | `71` |
| 17 | 82 | single_choice | openness_assimilation_closure | `"civic_assimilation"` |
| 18 | 20 | allocation | bad_outcomes_blame_allocation | `{"complex_forces":25,"powerful_incompetent":25,"powerful_selfish":25,"ordinar...` |
| 19 | 215 | single_choice | theory_of_change_progress | `"movements_against_power"` |
| 20 | 7 | single_choice | coalition_vs_principle | `"principle_first"` |
| 21 | 213 | single_choice | equal_standing_within_polity | `"some_differentiation_acceptable"` |
| 22 | 207 | single_choice | emergency_powers | `"narrow_emergency"` |
| 23 | 78 | best_worst | speaker_appeal | `{"best":["calls_out_power","says_what_they_think"],"worst":["bridge_builder",...` |
| 24 | 79 | single_choice | expert_disagreement_reaction | `"both_wrong"` |
| 25 | 61 | single_choice | political_pitch_resonance | `"fight_pitch"` |
| 26 | 38 | slider | rules_procedures_matter_salience | `31` |
| 27 | 71 | slider | rhetoric_style_importance | `51` |
| 28 | 69 | slider | common_ground_salience | `31` |
| 29 | 19 | slider | human_progress_salience | `31` |
| 30 | 49 | slider | social_progress_salience | `51` |
| 31 | 63 | best_worst | best_worst_battery | `{"best":["fairness"],"worst":["tradition_continuity"]}` |
