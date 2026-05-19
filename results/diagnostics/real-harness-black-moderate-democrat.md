# Harness Run — Black Moderate Religious Democrat (lifelong D)

**Persona ID:** `black-moderate-democrat`
**Date:** 2026-05-19
**Questions asked:** 22

## Reachability scorecard

- Composed archetype label: **Traditionalist Populist-Left**
- Identity-primary overlay: Black Voter
- Engagement level: engaged

**Expected archetype family:** communitarian Democrat / Black voter

**Top-5 by archetype distance** (via `getTopArchetypesForDiagnostics`):

| rank | id | name | distance |
|---|---|---|---|
| 1 | 134 | Progressive Civic Nationalist | 0.377 |
| 2 | 088 | Gentle Traditionalist | 0.382 |
| 3 | 045 | Rooted Social Reformer | 0.382 |
| 4 | 050 | Traditionalist Moralist | 0.386 |
| 5 | 046 | Pastoral Leftist | 0.391 |

## Assertions (10/10 pass)

| check | expected | actual | result |
|---|---|---|---|
| Q103: high-salience nodes in supportHigh | `all nodes with sal≥2.5 in supportHigh` | `all placed correctly` | ✓ |
| Q103: mid-salience nodes in supportMid | `all nodes with 1.5≤sal<2.5 in supportMid` | `all placed correctly` | ✓ |
| Q103: low-salience nodes in neutral | `all nodes with sal<1.5 in neutral` | `all placed correctly` | ✓ |
| top-1 archetype in acceptable list | `one of [134, 050, 049, 045, 088]` | `134 Progressive Civic Nationalist` | ✓ |
| vote match | `≥5/5` | `5/5` | ✓ |
| composed label contains "Traditionalist" | `Traditionalist` | `Traditionalist Populist-Left` | ✓ |
| identity-primary state | `≥ active` | `active` | ✓ |
| identity-primary label | `Black Voter` | `Black Voter` | ✓ |
| engagement level | `engaged` | `engaged` | ✓ |
| questions asked in range | `[20, 35]` | `22` | ✓ |

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
| 2 | 103 | priority_sort | issue_salience_screener | `{"supportHigh":["mat","mor"],"supportMid":["cd","cu","pro","com","zs","ont_s"...` |
| 3 | 97 | single_choice | political_thought_frequency | `"regularly_daily"` |
| 4 | 60 | priority_sort | politically_important_identities | `{"supportHigh":["national_identity","religious_identity","ethnic_racial_ident...` |
| 5 | 89 | best_worst | epistemic_style_battery | `{"best":["eps_institutionalist"],"worst":["eps_autonomous"]}` |
| 6 | 218 | best_worst | aesthetic_style_ranking | `{"best":["aes_pastoral"],"worst":["aes_visionary"]}` |
| 7 | 211 | single_choice | strategic_voting | `"depends_on_stakes"` |
| 8 | 212 | single_choice | negative_partisanship | `"never_rep"` |
| 9 | 93 | priority_sort | priority_sort_opener | `{"supportHigh":["mat_low","cd_high"],"supportMid":[],"neutral":["cu_low","cu_...` |
| 10 | 102 | priority_sort | membership_criteria_priority_sort | `{"supportHigh":["religion"],"supportMid":["born_here","speak_lang","cultural"...` |
| 11 | 209 | single_choice | zero_sum_economics_view | `"growth_with_distribution"` |
| 12 | 210 | single_choice | human_malleability_view | `"substantial_shaping"` |
| 13 | 214 | single_choice | institutions_foundational | `"important_with_caveats"` |
| 14 | 8 | single_choice | domestic_vs_abroad_lives | `"hard_to_say"` |
| 15 | 229 | priority_sort | moral_circle_in_group_sort | `{"supportHigh":["ingroup_national","ingroup_religious","ingroup_ethnic_racial...` |
| 16 | 3 | slider | cultural_social_placement | `71` |
| 17 | 202 | single_choice | state_scope_preference | `"universal_strong_state"` |
| 18 | 213 | single_choice | equal_standing_within_polity | `"important_one_of_many"` |
| 19 | 78 | best_worst | speaker_appeal | `{"best":["deep_expertise","bridge_builder"],"worst":["says_what_they_think","...` |
| 20 | 11 | single_choice | nyt_headline_click | `"timeless_principles"` |
| 21 | 51 | slider | immigration_national_identity_salience | `51` |
| 22 | 4 | slider | cultural_social_salience | `51` |
