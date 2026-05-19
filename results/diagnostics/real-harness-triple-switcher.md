# Harness Run — Triple-Switcher (Trump→Biden→Trump, 2016/2020/2024)

**Persona ID:** `triple-switcher`
**Date:** 2026-05-19
**Questions asked:** 22

## Reachability scorecard

- Composed archetype label: **Consequentialist Cynic**
- Identity-primary overlay: (none)
- Engagement level: casual

**Expected archetype family:** centrist switcher / non-college voter

**Top-5 by archetype distance** (via `getTopArchetypesForDiagnostics`):

| rank | id | name | distance |
|---|---|---|---|
| 1 | 124 | Latent Alarmist | 0.393 |
| 2 | 118 | Survival Pragmatist | 0.401 |
| 3 | 106 | Militant Partisan | 0.413 |
| 4 | 088 | Gentle Traditionalist | 0.424 |
| 5 | 137 | Moral Crusader | 0.434 |

## Assertions (8/8 pass)

| check | expected | actual | result |
|---|---|---|---|
| Q103: high-salience nodes in supportHigh | `all nodes with sal≥2.5 in supportHigh` | `all placed correctly` | ✓ |
| Q103: mid-salience nodes in supportMid | `all nodes with 1.5≤sal<2.5 in supportMid` | `all placed correctly` | ✓ |
| Q103: low-salience nodes in neutral | `all nodes with sal<1.5 in neutral` | `all placed correctly` | ✓ |
| top-1 archetype in acceptable list | `one of [124, 118, 106, 088, 137]` | `124 Latent Alarmist` | ✓ |
| vote match | `≥4/5` | `4/5` | ✓ |
| identity-primary state | `≥ none` | `none` | ✓ |
| engagement level | `casual` | `casual` | ✓ |
| questions asked in range | `[20, 35]` | `22` | ✓ |

## Vote-prediction scorecard

- Match: 4/5

| year | expected | actual | match |
|---|---|---|---|
| 2008 | ABSTAIN | ABSTAIN | ✓ |
| 2012 | ABSTAIN | ABSTAIN | ✓ |
| 2016 | R | R | ✓ |
| 2020 | D | R | ❌ |
| 2024 | R | R | ✓ |

## Question trace

| idx | qId | uiType | promptShort | answer |
|---|---|---|---|---|
| 1 | 200 | single_choice | party_identification | `"ind"` |
| 2 | 103 | priority_sort | issue_salience_screener | `{"supportHigh":["mat","zs"],"supportMid":["cd","ont_s","aes"],"neutral":["cu"...` |
| 3 | 97 | single_choice | political_thought_frequency | `"sometimes_events"` |
| 4 | 60 | priority_sort | politically_important_identities | `{"supportHigh":[],"supportMid":["national_identity","class_identity"],"neutra...` |
| 5 | 89 | best_worst | epistemic_style_battery | `{"best":["eps_intuitionist"],"worst":["eps_autonomous"]}` |
| 6 | 218 | best_worst | aesthetic_style_ranking | `{"best":["aes_authentic"],"worst":["aes_visionary"]}` |
| 7 | 211 | single_choice | strategic_voting | `"not_sure"` |
| 8 | 212 | single_choice | negative_partisanship | `"consider_all"` |
| 9 | 93 | priority_sort | priority_sort_opener | `{"supportHigh":["pro_low"],"supportMid":[],"neutral":["mat_low","mat_high","c...` |
| 10 | 102 | priority_sort | membership_criteria_priority_sort | `{"supportHigh":["born_here"],"supportMid":[],"neutral":["speak_lang","shared_...` |
| 11 | 209 | single_choice | zero_sum_economics_view | `"winners_at_others_expense"` |
| 12 | 210 | single_choice | human_malleability_view | `"modest_shaping"` |
| 13 | 214 | single_choice | institutions_foundational | `"instruments_not_essential"` |
| 14 | 8 | single_choice | domestic_vs_abroad_lives | `"hard_to_say"` |
| 15 | 229 | priority_sort | moral_circle_in_group_sort | `{"supportHigh":[],"supportMid":["ingroup_national","ingroup_class"],"neutral"...` |
| 16 | 6 | single_choice | national_priorities_bundle | `"priorities_strength"` |
| 17 | 21 | single_choice | controversial_speaker | `"restricted"` |
| 18 | 78 | best_worst | speaker_appeal | `{"best":["community_voice","calls_out_power"],"worst":["deep_expertise","big_...` |
| 19 | 215 | single_choice | theory_of_change_progress | `"movements_against_power"` |
| 20 | 11 | single_choice | nyt_headline_click | `"timeless_principles"` |
| 21 | 51 | slider | immigration_national_identity_salience | `31` |
| 22 | 56 | single_choice | effective_leader_style | `"channel_anger"` |
