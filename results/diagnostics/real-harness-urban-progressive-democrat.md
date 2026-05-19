# Harness Run — Urban Progressive Democrat (lifelong D, college-educated)

**Persona ID:** `urban-progressive-democrat`
**Date:** 2026-05-19
**Questions asked:** 31

## Reachability scorecard

- Composed archetype label: **Institutional Principled Cosmopolitan**
- Identity-primary overlay: (none)
- Engagement level: engaged

**Expected archetype family:** progressive technocrat / institutional liberal

**Top-5 by archetype distance** (via `getTopArchetypesForDiagnostics`):

| rank | id | name | distance |
|---|---|---|---|
| 1 | 056 | Institutional Leftist | 0.361 |
| 2 | 001 | Rawlsian Reformer | 0.370 |
| 3 | 057 | Temperate Pluralist | 0.383 |
| 4 | 021 | Principled Cosmopolitan | 0.392 |
| 5 | 033 | Systems Modernizer | 0.393 |

## Assertions (9/9 pass)

| check | expected | actual | result |
|---|---|---|---|
| Q103: high-salience nodes in supportHigh | `all nodes with sal≥2.5 in supportHigh` | `all placed correctly` | ✓ |
| Q103: mid-salience nodes in supportMid | `all nodes with 1.5≤sal<2.5 in supportMid` | `all placed correctly` | ✓ |
| Q103: low-salience nodes in neutral | `all nodes with sal<1.5 in neutral` | `all placed correctly` | ✓ |
| top-1 archetype in acceptable list | `one of [056, 001, 057, 021, 033]` | `056 Institutional Leftist` | ✓ |
| vote match | `≥5/5` | `5/5` | ✓ |
| composed label contains "Cosmopolitan" | `Cosmopolitan` | `Institutional Principled Cosmopolitan` | ✓ |
| identity-primary state | `≥ none` | `none` | ✓ |
| engagement level | `engaged` | `engaged` | ✓ |
| questions asked in range | `[20, 35]` | `31` | ✓ |

## Vote-prediction scorecard

- Match: 5/5

| year | expected | actual | match |
|---|---|---|---|
| 2008 | D | D | ✓ |
| 2012 | D | D | ✓ |
| 2016 | D | D | ✓ |
| 2020 | D | D | ✓ |
| 2024 | D | D | ✓ |

## Question trace

| idx | qId | uiType | promptShort | answer |
|---|---|---|---|---|
| 1 | 200 | single_choice | party_identification | `"dem"` |
| 2 | 103 | priority_sort | issue_salience_screener | `{"supportHigh":["mat","cd","cu","mor","ont_s","eps"],"supportMid":["pro","com...` |
| 3 | 97 | single_choice | political_thought_frequency | `"regularly_daily"` |
| 4 | 60 | priority_sort | politically_important_identities | `{"supportHigh":["global_citizen"],"supportMid":["ideological_identity","gende...` |
| 5 | 89 | best_worst | epistemic_style_battery | `{"best":["eps_empiricist"],"worst":["eps_autonomous"]}` |
| 6 | 218 | best_worst | aesthetic_style_ranking | `{"best":["aes_technocrat"],"worst":["aes_visionary"]}` |
| 7 | 211 | single_choice | strategic_voting | `"depends_on_stakes"` |
| 8 | 212 | single_choice | negative_partisanship | `"never_rep"` |
| 9 | 93 | priority_sort | priority_sort_opener | `{"supportHigh":["mat_low","cd_low","cu_high","mor_high","pro_high","com_high"...` |
| 10 | 102 | priority_sort | membership_criteria_priority_sort | `{"supportHigh":[],"supportMid":["shared_values","civic_part"],"neutral":["spe...` |
| 11 | 209 | single_choice | zero_sum_economics_view | `"growth_with_distribution"` |
| 12 | 210 | single_choice | human_malleability_view | `"substantial_shaping"` |
| 13 | 214 | single_choice | institutions_foundational | `"foundational_essential"` |
| 14 | 8 | single_choice | domestic_vs_abroad_lives | `"clearly_abroad"` |
| 15 | 229 | priority_sort | moral_circle_in_group_sort | `{"supportHigh":[],"supportMid":["ingroup_gender","ingroup_ideological"],"neut...` |
| 16 | 215 | single_choice | theory_of_change_progress | `"institutions_and_laws"` |
| 17 | 213 | single_choice | equal_standing_within_polity | `"central_universalism"` |
| 18 | 82 | single_choice | openness_assimilation_closure | `"open_pluralist"` |
| 19 | 7 | single_choice | coalition_vs_principle | `"coalition_first"` |
| 20 | 18 | single_choice | human_improvement_capacity | `"gradual_with_limits"` |
| 21 | 207 | single_choice | emergency_powers | `"narrow_emergency"` |
| 22 | 78 | best_worst | speaker_appeal | `{"best":["deep_expertise","bridge_builder"],"worst":["says_what_they_think","...` |
| 23 | 11 | single_choice | nyt_headline_click | `"timeless_principles"` |
| 24 | 56 | single_choice | effective_leader_style | `"master_policy_details"` |
| 25 | 71 | slider | rhetoric_style_importance | `51` |
| 26 | 19 | slider | human_progress_salience | `51` |
| 27 | 84 | slider | institutions_harden_into_domination | `31` |
| 28 | 217 | ranking | epistemic_style_ranking | `["eps_empiricist","eps_institutionalist","eps_traditionalist","eps_intuitioni...` |
| 29 | 55 | multi | what_changed_your_mind | `["data_evidence","personal_experience"]` |
| 30 | 31 | single_choice | trade_liberalization_effects | `"mixed_effects"` |
| 31 | 51 | slider | immigration_national_identity_salience | `91` |
