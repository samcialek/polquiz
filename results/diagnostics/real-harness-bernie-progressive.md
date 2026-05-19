# Harness Run — Bernie Progressive / DSA-curious

**Persona ID:** `bernie-progressive`
**Date:** 2026-05-19
**Questions asked:** 26

## Reachability scorecard

- Composed archetype label: **Cosmopolitan Reformer**
- Identity-primary overlay: (none)
- Engagement level: highly-engaged

**Expected archetype family:** democratic-socialist / DSA progressive

**Top-5 by archetype distance** (via `getTopArchetypesForDiagnostics`):

| rank | id | name | distance |
|---|---|---|---|
| 1 | 001 | Rawlsian Reformer | 0.381 |
| 2 | 021 | Principled Cosmopolitan | 0.393 |
| 3 | 031 | Planetary Steward | 0.399 |
| 4 | 033 | Systems Modernizer | 0.403 |
| 5 | 022 | Pluralist Universalist | 0.420 |

## Assertions (9/9 pass)

| check | expected | actual | result |
|---|---|---|---|
| Q103: high-salience nodes in supportHigh | `all nodes with sal≥2.5 in supportHigh` | `all placed correctly` | ✓ |
| Q103: mid-salience nodes in supportMid | `all nodes with 1.5≤sal<2.5 in supportMid` | `all placed correctly` | ✓ |
| Q103: low-salience nodes in neutral | `all nodes with sal<1.5 in neutral` | `all placed correctly` | ✓ |
| top-1 archetype in acceptable list | `one of [011, 001, 056, 034, 057]` | `001 Rawlsian Reformer` | ✓ |
| vote match | `≥5/5` | `5/5` | ✓ |
| composed label contains "Cosmopolitan" | `Cosmopolitan` | `Cosmopolitan Reformer` | ✓ |
| identity-primary state | `≥ none` | `none` | ✓ |
| engagement level | `highly-engaged` | `highly-engaged` | ✓ |
| questions asked in range | `[20, 35]` | `26` | ✓ |

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
| 1 | 200 | single_choice | party_identification | `"ind"` |
| 2 | 103 | priority_sort | issue_salience_screener | `{"supportHigh":["mat","cd","cu","mor","zs","ont_h","eps"],"supportMid":["pro"...` |
| 3 | 97 | single_choice | political_thought_frequency | `"constantly_worldview"` |
| 4 | 60 | priority_sort | politically_important_identities | `{"supportHigh":["class_identity","global_citizen"],"supportMid":["ideological...` |
| 5 | 89 | best_worst | epistemic_style_battery | `{"best":["eps_empiricist"],"worst":["eps_autonomous"]}` |
| 6 | 218 | best_worst | aesthetic_style_ranking | `{"best":["aes_visionary"],"worst":["aes_fighter"]}` |
| 7 | 211 | single_choice | strategic_voting | `"strategic_lesser_evil"` |
| 8 | 212 | single_choice | negative_partisanship | `"never_rep"` |
| 9 | 93 | priority_sort | priority_sort_opener | `{"supportHigh":["mat_low","cd_low","cu_high","mor_high"],"supportMid":[],"neu...` |
| 10 | 102 | priority_sort | membership_criteria_priority_sort | `{"supportHigh":["shared_values","civic_part"],"supportMid":[],"neutral":["eco...` |
| 11 | 209 | single_choice | zero_sum_economics_view | `"winners_at_others_expense"` |
| 12 | 210 | single_choice | human_malleability_view | `"mostly_made_by_environment"` |
| 13 | 214 | single_choice | institutions_foundational | `"depends_on_design"` |
| 14 | 8 | single_choice | domestic_vs_abroad_lives | `"clearly_abroad"` |
| 15 | 229 | priority_sort | moral_circle_in_group_sort | `{"supportHigh":["ingroup_class"],"supportMid":["ingroup_gender","ingroup_ideo...` |
| 16 | 6 | single_choice | national_priorities_bundle | `"priorities_fairness"` |
| 17 | 82 | single_choice | openness_assimilation_closure | `"open_pluralist"` |
| 18 | 18 | single_choice | human_improvement_capacity | `"substantial_capacity"` |
| 19 | 78 | best_worst | speaker_appeal | `{"best":["deep_expertise","bridge_builder"],"worst":["says_what_they_think","...` |
| 20 | 11 | single_choice | nyt_headline_click | `"weird_science"` |
| 21 | 2 | slider | political_identity_centrality | `71` |
| 22 | 71 | slider | rhetoric_style_importance | `51` |
| 23 | 49 | slider | social_progress_salience | `71` |
| 24 | 38 | slider | rules_procedures_matter_salience | `51` |
| 25 | 69 | slider | common_ground_salience | `31` |
| 26 | 63 | best_worst | best_worst_battery | `{"best":["fairness"],"worst":["tradition_continuity"]}` |
