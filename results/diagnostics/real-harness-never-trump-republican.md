# Harness Run — Suburban Never-Trump Republican (Bush/McCain/Romney → D)

**Persona ID:** `never-trump-republican`
**Date:** 2026-05-19
**Questions asked:** 26

## Reachability scorecard

- Composed archetype label: **Dealmaker Reformer**
- Identity-primary overlay: (none)
- Engagement level: highly-engaged

**Expected archetype family:** institutional moderate / Bush-Republican defector

**Top-5 by archetype distance** (via `getTopArchetypesForDiagnostics`):

| rank | id | name | distance |
|---|---|---|---|
| 1 | 053 | Consensus Builder | 0.388 |
| 2 | 056 | Institutional Leftist | 0.392 |
| 3 | 054 | Arbiter Moderate | 0.405 |
| 4 | 057 | Temperate Pluralist | 0.407 |
| 5 | 120 | Good Neighbor | 0.407 |

## Assertions (9/9 pass)

| check | expected | actual | result |
|---|---|---|---|
| Q103: high-salience nodes in supportHigh | `all nodes with sal≥2.5 in supportHigh` | `all placed correctly` | ✓ |
| Q103: mid-salience nodes in supportMid | `all nodes with 1.5≤sal<2.5 in supportMid` | `all placed correctly` | ✓ |
| Q103: low-salience nodes in neutral | `all nodes with sal<1.5 in neutral` | `all placed correctly` | ✓ |
| top-1 archetype in acceptable list | `one of [053, 054, 056, 057, 120]` | `053 Consensus Builder` | ✓ |
| vote match | `≥3/5` | `3/5` | ✓ |
| composed label contains "Dealmaker" | `Dealmaker` | `Dealmaker Reformer` | ✓ |
| identity-primary state | `≥ none` | `none` | ✓ |
| engagement level | `highly-engaged` | `highly-engaged` | ✓ |
| questions asked in range | `[20, 35]` | `26` | ✓ |

## Vote-prediction scorecard

- Match: 3/5

| year | expected | actual | match |
|---|---|---|---|
| 2008 | R | D | ❌ |
| 2012 | R | D | ❌ |
| 2016 | D | D | ✓ |
| 2020 | D | D | ✓ |
| 2024 | D | D | ✓ |

## Question trace

| idx | qId | uiType | promptShort | answer |
|---|---|---|---|---|
| 1 | 200 | single_choice | party_identification | `"ind"` |
| 2 | 103 | priority_sort | issue_salience_screener | `{"supportHigh":["mat","mor","pro","com","ont_s","eps","aes"],"supportMid":["c...` |
| 3 | 97 | single_choice | political_thought_frequency | `"constantly_worldview"` |
| 4 | 60 | priority_sort | politically_important_identities | `{"supportHigh":["global_citizen"],"supportMid":["national_identity"],"neutral...` |
| 5 | 89 | best_worst | epistemic_style_battery | `{"best":["eps_institutionalist"],"worst":["eps_autonomous"]}` |
| 6 | 218 | best_worst | aesthetic_style_ranking | `{"best":["aes_statesman"],"worst":["aes_visionary"]}` |
| 7 | 211 | single_choice | strategic_voting | `"strategic_lesser_evil"` |
| 8 | 212 | single_choice | negative_partisanship | `"never_rep"` |
| 9 | 93 | priority_sort | priority_sort_opener | `{"supportHigh":["mat_high","cu_high","mor_high","pro_high","com_high"],"suppo...` |
| 10 | 102 | priority_sort | membership_criteria_priority_sort | `{"supportHigh":[],"supportMid":["shared_values","civic_part"],"neutral":["bor...` |
| 11 | 209 | single_choice | zero_sum_economics_view | `"growth_with_distribution"` |
| 12 | 210 | single_choice | human_malleability_view | `"substantial_shaping"` |
| 13 | 214 | single_choice | institutions_foundational | `"foundational_essential"` |
| 14 | 8 | single_choice | domestic_vs_abroad_lives | `"clearly_abroad"` |
| 15 | 229 | priority_sort | moral_circle_in_group_sort | `{"supportHigh":[],"supportMid":["ingroup_national"],"neutral":["ingroup_relig...` |
| 16 | 6 | single_choice | national_priorities_bundle | `"priorities_future"` |
| 17 | 215 | single_choice | theory_of_change_progress | `"institutions_and_laws"` |
| 18 | 7 | single_choice | coalition_vs_principle | `"coalition_first"` |
| 19 | 18 | single_choice | human_improvement_capacity | `"gradual_with_limits"` |
| 20 | 207 | single_choice | emergency_powers | `"narrow_emergency"` |
| 21 | 11 | single_choice | nyt_headline_click | `"timeless_principles"` |
| 22 | 51 | slider | immigration_national_identity_salience | `51` |
| 23 | 78 | best_worst | speaker_appeal | `{"best":["bridge_builder","big_picture"],"worst":["says_what_they_think","cal...` |
| 24 | 217 | ranking | epistemic_style_ranking | `["eps_institutionalist","eps_empiricist","eps_traditionalist","eps_intuitioni...` |
| 25 | 55 | multi | what_changed_your_mind | `["trusted_authority","personal_experience"]` |
| 26 | 1 | single_choice | political_content_frequency | `"every_day"` |
