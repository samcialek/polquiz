# Harness Run — MAGA all-in populist (committed R)

**Persona ID:** `maga-all-in`
**Date:** 2026-05-19
**Questions asked:** 26

## Reachability scorecard

- Composed archetype label: **Assimilationist Partisan-Communitarian**
- Identity-primary overlay: White Grievance Voter
- Engagement level: highly-engaged

**Expected archetype family:** extreme populist-nationalist / ethno-traditionalist

**Top-5 by archetype distance** (via `getTopArchetypesForDiagnostics`):

| rank | id | name | distance |
|---|---|---|---|
| 1 | 105 | Combative Populist | 0.361 |
| 2 | 106 | Militant Partisan | 0.369 |
| 3 | 100 | Tribal Insurgent | 0.377 |
| 4 | 104 | National Protector | 0.392 |
| 5 | 101 | Embattled Majoritarian | 0.398 |

## Assertions (10/10 pass)

| check | expected | actual | result |
|---|---|---|---|
| Q103: high-salience nodes in supportHigh | `all nodes with sal≥2.5 in supportHigh` | `all placed correctly` | ✓ |
| Q103: mid-salience nodes in supportMid | `all nodes with 1.5≤sal<2.5 in supportMid` | `all placed correctly` | ✓ |
| Q103: low-salience nodes in neutral | `all nodes with sal<1.5 in neutral` | `all placed correctly` | ✓ |
| top-1 archetype in acceptable list | `one of [106, 084, 105, 081, 104]` | `105 Combative Populist` | ✓ |
| vote match | `≥5/5` | `5/5` | ✓ |
| composed label contains "Partisan-Communitarian" | `Partisan-Communitarian` | `Assimilationist Partisan-Communitarian` | ✓ |
| identity-primary state | `≥ active` | `dominant` | ✓ |
| identity-primary label | `White Grievance Voter` | `White Grievance Voter` | ✓ |
| engagement level | `highly-engaged` | `highly-engaged` | ✓ |
| questions asked in range | `[20, 35]` | `26` | ✓ |

## Vote-prediction scorecard

- Match: 5/5

| year | expected | actual | match |
|---|---|---|---|
| 2008 | ABSTAIN | ABSTAIN | ✓ |
| 2012 | R | R | ✓ |
| 2016 | R | R | ✓ |
| 2020 | R | R | ✓ |
| 2024 | R | R | ✓ |

## Question trace

| idx | qId | uiType | promptShort | answer |
|---|---|---|---|---|
| 1 | 200 | single_choice | party_identification | `"rep"` |
| 2 | 103 | priority_sort | issue_salience_screener | `{"supportHigh":["mat","cd","cu","mor","zs","ont_s","aes"],"supportMid":["pro"...` |
| 3 | 97 | single_choice | political_thought_frequency | `"constantly_worldview"` |
| 4 | 60 | priority_sort | politically_important_identities | `{"supportHigh":["national_identity","ideological_identity","religious_identit...` |
| 5 | 89 | best_worst | epistemic_style_battery | `{"best":["eps_intuitionist"],"worst":["eps_autonomous"]}` |
| 6 | 218 | best_worst | aesthetic_style_ranking | `{"best":["aes_fighter"],"worst":["aes_visionary"]}` |
| 7 | 211 | single_choice | strategic_voting | `"sincere_always"` |
| 8 | 212 | single_choice | negative_partisanship | `"never_dem"` |
| 9 | 93 | priority_sort | priority_sort_opener | `{"supportHigh":["mat_high","cd_high","cu_low","mor_low","pro_low","com_low"],...` |
| 10 | 102 | priority_sort | membership_criteria_priority_sort | `{"supportHigh":["born_here","speak_lang","cultural","ancestry","religion"],"s...` |
| 11 | 209 | single_choice | zero_sum_economics_view | `"winners_at_others_expense"` |
| 12 | 210 | single_choice | human_malleability_view | `"modest_shaping"` |
| 13 | 214 | single_choice | institutions_foundational | `"obstacles_to_progress"` |
| 14 | 8 | single_choice | domestic_vs_abroad_lives | `"clearly_domestic"` |
| 15 | 229 | priority_sort | moral_circle_in_group_sort | `{"supportHigh":["ingroup_national","ingroup_religious","ingroup_ethnic_racial...` |
| 16 | 6 | single_choice | national_priorities_bundle | `"priorities_strength"` |
| 17 | 82 | single_choice | openness_assimilation_closure | `"preserve_culture"` |
| 18 | 7 | single_choice | coalition_vs_principle | `"principle_first"` |
| 19 | 18 | single_choice | human_improvement_capacity | `"cyclical_gains_lost"` |
| 20 | 207 | single_choice | emergency_powers | `"strong_leader_acts"` |
| 21 | 79 | single_choice | expert_disagreement_reaction | `"both_wrong"` |
| 22 | 61 | single_choice | political_pitch_resonance | `"fight_pitch"` |
| 23 | 19 | slider | human_progress_salience | `51` |
| 24 | 47 | single_choice | political_conflict_with_close_others | `"enjoy_debate"` |
| 25 | 69 | slider | common_ground_salience | `51` |
| 26 | 51 | slider | immigration_national_identity_salience | `91` |
