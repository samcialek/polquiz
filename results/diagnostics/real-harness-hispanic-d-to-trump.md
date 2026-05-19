# Harness Run — Hispanic D → Trump (2020/2024 shift)

**Persona ID:** `hispanic-d-to-trump`
**Date:** 2026-05-19
**Questions asked:** 22

## Reachability scorecard

- Composed archetype label: **Traditionalist Culture Warrior**
- Identity-primary overlay: (none)
- Engagement level: engaged

**Expected archetype family:** cross-pressured moderate / new-coalition

**Top-5 by archetype distance** (via `getTopArchetypesForDiagnostics`):

| rank | id | name | distance |
|---|---|---|---|
| 1 | 088 | Gentle Traditionalist | 0.396 |
| 2 | 089 | Integral Traditionalist | 0.397 |
| 3 | 050 | Traditionalist Moralist | 0.403 |
| 4 | 083 | Closed Traditionalist | 0.405 |
| 5 | 079 | National Developmentalist | 0.408 |

## Assertions (9/9 pass)

| check | expected | actual | result |
|---|---|---|---|
| Q103: high-salience nodes in supportHigh | `all nodes with sal≥2.5 in supportHigh` | `all placed correctly` | ✓ |
| Q103: mid-salience nodes in supportMid | `all nodes with 1.5≤sal<2.5 in supportMid` | `all placed correctly` | ✓ |
| Q103: low-salience nodes in neutral | `all nodes with sal<1.5 in neutral` | `all placed correctly` | ✓ |
| top-1 archetype in acceptable list | `one of [088, 050, 083, 084, 079]` | `088 Gentle Traditionalist` | ✓ |
| vote match | `≥2/5` | `2/5` | ✓ |
| composed label contains "Traditionalist" | `Traditionalist` | `Traditionalist Culture Warrior` | ✓ |
| identity-primary state | `≥ none` | `none` | ✓ |
| engagement level | `engaged` | `engaged` | ✓ |
| questions asked in range | `[20, 35]` | `22` | ✓ |

## Vote-prediction scorecard

- Match: 2/5

| year | expected | actual | match |
|---|---|---|---|
| 2008 | D | R | ❌ |
| 2012 | D | R | ❌ |
| 2016 | D | R | ❌ |
| 2020 | R | R | ✓ |
| 2024 | R | R | ✓ |

## Question trace

| idx | qId | uiType | promptShort | answer |
|---|---|---|---|---|
| 1 | 200 | single_choice | party_identification | `"ind"` |
| 2 | 103 | priority_sort | issue_salience_screener | `{"supportHigh":["mat","mor","zs"],"supportMid":["cd","cu","ont_s","eps","aes"...` |
| 3 | 97 | single_choice | political_thought_frequency | `"regularly_daily"` |
| 4 | 60 | priority_sort | politically_important_identities | `{"supportHigh":["national_identity","religious_identity","ethnic_racial_ident...` |
| 5 | 89 | best_worst | epistemic_style_battery | `{"best":["eps_traditionalist"],"worst":["eps_autonomous"]}` |
| 6 | 218 | best_worst | aesthetic_style_ranking | `{"best":["aes_pastoral"],"worst":["aes_visionary"]}` |
| 7 | 211 | single_choice | strategic_voting | `"depends_on_stakes"` |
| 8 | 212 | single_choice | negative_partisanship | `"consider_all"` |
| 9 | 93 | priority_sort | priority_sort_opener | `{"supportHigh":["cd_high"],"supportMid":[],"neutral":["mat_low","mat_high","c...` |
| 10 | 102 | priority_sort | membership_criteria_priority_sort | `{"supportHigh":[],"supportMid":["born_here","speak_lang","cultural","ancestry...` |
| 11 | 209 | single_choice | zero_sum_economics_view | `"winners_at_others_expense"` |
| 12 | 210 | single_choice | human_malleability_view | `"modest_shaping"` |
| 13 | 214 | single_choice | institutions_foundational | `"important_with_caveats"` |
| 14 | 8 | single_choice | domestic_vs_abroad_lives | `"hard_to_say"` |
| 15 | 229 | priority_sort | moral_circle_in_group_sort | `{"supportHigh":["ingroup_national","ingroup_religious","ingroup_ethnic_racial...` |
| 16 | 3 | slider | cultural_social_placement | `71` |
| 17 | 20 | allocation | bad_outcomes_blame_allocation | `{"complex_forces":25,"powerful_incompetent":25,"powerful_selfish":25,"ordinar...` |
| 18 | 213 | single_choice | equal_standing_within_polity | `"important_one_of_many"` |
| 19 | 244 | single_choice | religion_political_role | `"religion_public_moral_source"` |
| 20 | 78 | best_worst | speaker_appeal | `{"best":["bridge_builder","deep_expertise"],"worst":["says_what_they_think","...` |
| 21 | 11 | single_choice | nyt_headline_click | `"timeless_principles"` |
| 22 | 51 | slider | immigration_national_identity_salience | `51` |
