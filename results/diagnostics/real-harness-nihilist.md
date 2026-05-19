# Harness Run — Young Low-Trust Nihilist

**Persona ID:** `nihilist`
**Date:** 2026-05-19
**Questions asked:** 28

## Reachability scorecard

- Composed archetype label: **Combative Apolitical Voter**
- Identity-primary overlay: (none)
- Engagement level: apolitical

**Expected archetype family:** nihilist / disaffected non-voter

**Top-5 by archetype distance** (via `getTopArchetypesForDiagnostics`):

| rank | id | name | distance |
|---|---|---|---|
| 1 | 124 | Latent Alarmist | 0.331 |
| 2 | 126 | Uncompromising Activist | 0.394 |
| 3 | 098 | Anti-Elite Populist | 0.397 |
| 4 | 132 | Negative Partisan | 0.398 |
| 5 | 118 | Survival Pragmatist | 0.399 |

## Assertions (8/8 pass)

| check | expected | actual | result |
|---|---|---|---|
| Q103: high-salience nodes in supportHigh | `all nodes with sal≥2.5 in supportHigh` | `all placed correctly` | ✓ |
| Q103: mid-salience nodes in supportMid | `all nodes with 1.5≤sal<2.5 in supportMid` | `all placed correctly` | ✓ |
| Q103: low-salience nodes in neutral | `all nodes with sal<1.5 in neutral` | `all placed correctly` | ✓ |
| top-1 archetype in acceptable list | `one of [124, 126, 098, 132, 118]` | `124 Latent Alarmist` | ✓ |
| vote match | `≥3/5` | `3/5` | ✓ |
| identity-primary state | `≥ none` | `none` | ✓ |
| engagement level | `apolitical` | `apolitical` | ✓ |
| questions asked in range | `[20, 35]` | `28` | ✓ |

## Vote-prediction scorecard

- Match: 3/5

| year | expected | actual | match |
|---|---|---|---|
| 2008 | ABSTAIN | ABSTAIN | ✓ |
| 2012 | ABSTAIN | ABSTAIN | ✓ |
| 2016 | R | ABSTAIN | ❌ |
| 2020 | ABSTAIN | ABSTAIN | ✓ |
| 2024 | ABSTAIN | R | ❌ |

## Question trace

| idx | qId | uiType | promptShort | answer |
|---|---|---|---|---|
| 1 | 200 | single_choice | party_identification | `"none"` |
| 2 | 103 | priority_sort | issue_salience_screener | `{"supportHigh":[],"supportMid":["zs","ont_s"],"neutral":["mat","cd","cu","mor...` |
| 3 | 97 | single_choice | political_thought_frequency | `"rarely_elections"` |
| 4 | 60 | priority_sort | politically_important_identities | `{"supportHigh":[],"supportMid":[],"neutral":["class_identity","ethnic_racial_...` |
| 5 | 89 | best_worst | epistemic_style_battery | `{"best":["eps_empiricist"],"worst":["eps_autonomous"]}` |
| 6 | 218 | best_worst | aesthetic_style_ranking | `{"best":["aes_authentic"],"worst":["aes_visionary"]}` |
| 7 | 211 | single_choice | strategic_voting | `"not_sure"` |
| 8 | 212 | single_choice | negative_partisanship | `"consider_all"` |
| 9 | 93 | priority_sort | priority_sort_opener | `{"supportHigh":["mor_low","pro_low","com_low"],"supportMid":[],"neutral":["ma...` |
| 10 | 102 | priority_sort | membership_criteria_priority_sort | `{"supportHigh":[],"supportMid":[],"neutral":["born_here","speak_lang","shared...` |
| 11 | 209 | single_choice | zero_sum_economics_view | `"winners_at_others_expense"` |
| 12 | 210 | single_choice | human_malleability_view | `"modest_shaping"` |
| 13 | 214 | single_choice | institutions_foundational | `"obstacles_to_progress"` |
| 14 | 8 | single_choice | domestic_vs_abroad_lives | `"hard_to_say"` |
| 15 | 229 | priority_sort | moral_circle_in_group_sort | `{"supportHigh":[],"supportMid":[],"neutral":["ingroup_ethnic_racial","ingroup...` |
| 16 | 31 | single_choice | trade_liberalization_effects | `"mixed_effects"` |
| 17 | 21 | single_choice | controversial_speaker | `"restricted"` |
| 18 | 7 | single_choice | coalition_vs_principle | `"principle_first"` |
| 19 | 213 | single_choice | equal_standing_within_polity | `"some_differentiation_acceptable"` |
| 20 | 11 | single_choice | nyt_headline_click | `"timeless_principles"` |
| 21 | 56 | single_choice | effective_leader_style | `"channel_anger"` |
| 22 | 51 | slider | immigration_national_identity_salience | `31` |
| 23 | 2 | slider | political_identity_centrality | `10` |
| 24 | 49 | slider | social_progress_salience | `31` |
| 25 | 38 | slider | rules_procedures_matter_salience | `31` |
| 26 | 69 | slider | common_ground_salience | `31` |
| 27 | 19 | slider | human_progress_salience | `31` |
| 28 | 63 | best_worst | best_worst_battery | `{"best":["fairness"],"worst":["tradition_continuity"]}` |
