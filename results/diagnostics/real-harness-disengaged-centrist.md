# Harness Run — Disengaged Centrist (mostly abstains)

**Persona ID:** `disengaged-centrist`
**Date:** 2026-05-19
**Questions asked:** 24

## Reachability scorecard

- Composed archetype label: **Redistributionist Apolitical Voter**
- Identity-primary overlay: (none)
- Engagement level: apolitical

**Expected archetype family:** disengaged / functionally apolitical

**Top-5 by archetype distance** (via `getTopArchetypesForDiagnostics`):

| rank | id | name | distance |
|---|---|---|---|
| 1 | 042 | Localist Progressive | 0.369 |
| 2 | 050 | Traditionalist Moralist | 0.378 |
| 3 | 048 | Solidaristic Localist | 0.381 |
| 4 | 002 | Independent Social Democrat | 0.393 |
| 5 | 043 | Quiet Egalitarian | 0.399 |

## Assertions (8/8 pass)

| check | expected | actual | result |
|---|---|---|---|
| Q103: high-salience nodes in supportHigh | `all nodes with sal≥2.5 in supportHigh` | `all placed correctly` | ✓ |
| Q103: mid-salience nodes in supportMid | `all nodes with 1.5≤sal<2.5 in supportMid` | `all placed correctly` | ✓ |
| Q103: low-salience nodes in neutral | `all nodes with sal<1.5 in neutral` | `all placed correctly` | ✓ |
| top-1 archetype in acceptable list | `one of [042, 050, 048, 002, 043]` | `042 Localist Progressive` | ✓ |
| vote match | `≥3/5` | `3/5` | ✓ |
| identity-primary state | `≥ none` | `none` | ✓ |
| engagement level | `apolitical` | `apolitical` | ✓ |
| questions asked in range | `[20, 35]` | `24` | ✓ |

## Vote-prediction scorecard

- Match: 3/5

| year | expected | actual | match |
|---|---|---|---|
| 2008 | ABSTAIN | D | ❌ |
| 2012 | ABSTAIN | D | ❌ |
| 2016 | ABSTAIN | ABSTAIN | ✓ |
| 2020 | ABSTAIN | ABSTAIN | ✓ |
| 2024 | ABSTAIN | ABSTAIN | ✓ |

## Question trace

| idx | qId | uiType | promptShort | answer |
|---|---|---|---|---|
| 1 | 200 | single_choice | party_identification | `"none"` |
| 2 | 103 | priority_sort | issue_salience_screener | `{"supportHigh":[],"supportMid":[],"neutral":["mat","cd","cu","mor","pro","com...` |
| 3 | 97 | single_choice | political_thought_frequency | `"rarely_elections"` |
| 4 | 60 | priority_sort | politically_important_identities | `{"supportHigh":[],"supportMid":[],"neutral":["national_identity","ideological...` |
| 5 | 89 | best_worst | epistemic_style_battery | `{"best":["eps_empiricist"],"worst":["eps_autonomous"]}` |
| 6 | 218 | best_worst | aesthetic_style_ranking | `{"best":["aes_statesman"],"worst":["aes_visionary"]}` |
| 7 | 211 | single_choice | strategic_voting | `"not_sure"` |
| 8 | 212 | single_choice | negative_partisanship | `"consider_all"` |
| 9 | 93 | priority_sort | priority_sort_opener | `{"supportHigh":["mat_low"],"supportMid":[],"neutral":["mat_high","cd_low","cd...` |
| 10 | 102 | priority_sort | membership_criteria_priority_sort | `{"supportHigh":["born_here"],"supportMid":[],"neutral":["speak_lang","shared_...` |
| 11 | 209 | single_choice | zero_sum_economics_view | `"growth_with_distribution"` |
| 12 | 210 | single_choice | human_malleability_view | `"modest_shaping"` |
| 13 | 214 | single_choice | institutions_foundational | `"depends_on_design"` |
| 14 | 8 | single_choice | domestic_vs_abroad_lives | `"hard_to_say"` |
| 15 | 229 | priority_sort | moral_circle_in_group_sort | `{"supportHigh":[],"supportMid":[],"neutral":["ingroup_national","ingroup_ethn...` |
| 16 | 202 | single_choice | state_scope_preference | `"basic_safety_net_mixed"` |
| 17 | 11 | single_choice | nyt_headline_click | `"timeless_principles"` |
| 18 | 56 | single_choice | effective_leader_style | `"build_expert_coalitions"` |
| 19 | 51 | slider | immigration_national_identity_salience | `10` |
| 20 | 2 | slider | political_identity_centrality | `10` |
| 21 | 49 | slider | social_progress_salience | `10` |
| 22 | 19 | slider | human_progress_salience | `10` |
| 23 | 15 | allocation | inequality_causes_allocation | `{"effort_choices":25,"family_background":25,"discrimination_bias":25,"luck_ra...` |
| 24 | 63 | best_worst | best_worst_battery | `{"best":["fairness"],"worst":["tradition_continuity"]}` |
