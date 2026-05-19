# Harness Run — Libertarian Republican (Ron Paul / Justin Amash family)

**Persona ID:** `libertarian-republican`
**Date:** 2026-05-19
**Questions asked:** 29

## Reachability scorecard

- Composed archetype label: **Pragmatic Free-Marketeer**
- Identity-primary overlay: (none)
- Engagement level: highly-engaged

**Expected archetype family:** libertarian / classical liberal

**Top-5 by archetype distance** (via `getTopArchetypesForDiagnostics`):

| rank | id | name | distance |
|---|---|---|---|
| 1 | 042 | Localist Progressive | 0.426 |
| 2 | 088 | Gentle Traditionalist | 0.427 |
| 3 | 048 | Solidaristic Localist | 0.429 |
| 4 | 117 | Comfortable Bystander | 0.446 |
| 5 | 076 | Fiscal Gradualist | 0.447 |

## Assertions (9/9 pass)

| check | expected | actual | result |
|---|---|---|---|
| Q103: high-salience nodes in supportHigh | `all nodes with sal≥2.5 in supportHigh` | `all placed correctly` | ✓ |
| Q103: mid-salience nodes in supportMid | `all nodes with 1.5≤sal<2.5 in supportMid` | `all placed correctly` | ✓ |
| Q103: low-salience nodes in neutral | `all nodes with sal<1.5 in neutral` | `all placed correctly` | ✓ |
| top-1 archetype in acceptable list | `one of [042, 088, 048, 117, 076]` | `042 Localist Progressive` | ✓ |
| vote match | `≥3/5` | `3/5` | ✓ |
| composed label contains "Free-Marketeer" | `Free-Marketeer` | `Pragmatic Free-Marketeer` | ✓ |
| identity-primary state | `≥ none` | `none` | ✓ |
| engagement level | `highly-engaged` | `highly-engaged` | ✓ |
| questions asked in range | `[20, 35]` | `29` | ✓ |

## Vote-prediction scorecard

- Match: 3/5

| year | expected | actual | match |
|---|---|---|---|
| 2008 | R | R | ✓ |
| 2012 | R | R | ✓ |
| 2016 | T | T | ✓ |
| 2020 | ABSTAIN | D | ❌ |
| 2024 | R | D | ❌ |

## Question trace

| idx | qId | uiType | promptShort | answer |
|---|---|---|---|---|
| 1 | 200 | single_choice | party_identification | `"ind"` |
| 2 | 103 | priority_sort | issue_salience_screener | `{"supportHigh":["mat","pro","ont_s","eps"],"supportMid":["cd","cu","mor","zs"...` |
| 3 | 97 | single_choice | political_thought_frequency | `"constantly_worldview"` |
| 4 | 60 | priority_sort | politically_important_identities | `{"supportHigh":["global_citizen"],"supportMid":["ideological_identity"],"neut...` |
| 5 | 89 | best_worst | epistemic_style_battery | `{"best":["eps_autonomous"],"worst":["eps_intuitionist"]}` |
| 6 | 218 | best_worst | aesthetic_style_ranking | `{"best":["aes_authentic"],"worst":["aes_visionary"]}` |
| 7 | 211 | single_choice | strategic_voting | `"sincere_always"` |
| 8 | 212 | single_choice | negative_partisanship | `"consider_all"` |
| 9 | 93 | priority_sort | priority_sort_opener | `{"supportHigh":["mat_high","cd_low","cu_high","mor_high","pro_high"],"support...` |
| 10 | 102 | priority_sort | membership_criteria_priority_sort | `{"supportHigh":[],"supportMid":["shared_values","civic_part"],"neutral":["spe...` |
| 11 | 209 | single_choice | zero_sum_economics_view | `"growth_with_distribution"` |
| 12 | 210 | single_choice | human_malleability_view | `"modest_shaping"` |
| 13 | 214 | single_choice | institutions_foundational | `"depends_on_design"` |
| 14 | 8 | single_choice | domestic_vs_abroad_lives | `"clearly_abroad"` |
| 15 | 229 | priority_sort | moral_circle_in_group_sort | `{"supportHigh":[],"supportMid":["ingroup_ideological"],"neutral":["ingroup_na...` |
| 16 | 202 | single_choice | state_scope_preference | `"market_enabling_limited"` |
| 17 | 21 | single_choice | controversial_speaker | `"allow_no_restrictions"` |
| 18 | 82 | single_choice | openness_assimilation_closure | `"pluralist_with_common_ground"` |
| 19 | 213 | single_choice | equal_standing_within_polity | `"important_one_of_many"` |
| 20 | 78 | best_worst | speaker_appeal | `{"best":["community_voice","bridge_builder"],"worst":["says_what_they_think",...` |
| 21 | 11 | single_choice | nyt_headline_click | `"timeless_principles"` |
| 22 | 56 | single_choice | effective_leader_style | `"channel_anger"` |
| 23 | 49 | slider | social_progress_salience | `51` |
| 24 | 71 | slider | rhetoric_style_importance | `51` |
| 25 | 4 | slider | cultural_social_salience | `51` |
| 26 | 1 | single_choice | political_content_frequency | `"every_day"` |
| 27 | 19 | slider | human_progress_salience | `31` |
| 28 | 69 | slider | common_ground_salience | `31` |
| 29 | 51 | slider | immigration_national_identity_salience | `51` |
