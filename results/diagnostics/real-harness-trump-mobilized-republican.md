# Harness Run — Trump-mobilized Republican (cultural-traditionalist)

**Persona ID:** `trump-mobilized-republican`
**Date:** 2026-05-19
**Questions asked:** 28

## Reachability scorecard

- Composed archetype label: **Integralist**
- Identity-primary overlay: Evangelical Voter
- Engagement level: engaged

**Expected archetype family:** religious traditionalist / Christian-right

**Top-5 by archetype distance** (via `getTopArchetypesForDiagnostics`):

| rank | id | name | distance |
|---|---|---|---|
| 1 | 081 | Heritage Guardian | 0.331 |
| 2 | 084 | Civilizational Conservative | 0.338 |
| 3 | 083 | Closed Traditionalist | 0.357 |
| 4 | 082 | Altar-and-Hearth Conservative | 0.371 |
| 5 | 106 | Militant Partisan | 0.375 |

## Assertions (8/8 pass)

| check | expected | actual | result |
|---|---|---|---|
| Q103: high-salience nodes in supportHigh | `all nodes with sal≥2.5 in supportHigh` | `all placed correctly` | ✓ |
| Q103: low-salience nodes in neutral | `all nodes with sal<1.5 in neutral` | `all placed correctly` | ✓ |
| vote match | `≥4/5` | `4/5` | ✓ |
| composed label contains "Integralist" | `Integralist` | `Integralist` | ✓ |
| identity-primary state | `active` | `active` | ✓ |
| identity-primary label | `Evangelical Voter` | `Evangelical Voter` | ✓ |
| engagement level | `engaged` | `engaged` | ✓ |
| questions asked in range | `[20, 35]` | `28` | ✓ |

## Vote-prediction scorecard

- Match: 4/5

| year | expected | actual | match |
|---|---|---|---|
| 2008 | R | ABSTAIN | ❌ |
| 2012 | R | R | ✓ |
| 2016 | R | R | ✓ |
| 2020 | R | R | ✓ |
| 2024 | R | R | ✓ |

## Question trace

| idx | qId | uiType | promptShort | answer |
|---|---|---|---|---|
| 1 | 200 | single_choice | party_identification | `"rep"` |
| 2 | 103 | priority_sort | issue_salience_screener | `{"supportHigh":["cd","cu","mor"],"supportMid":["mat","zs","ont_s","eps","aes"...` |
| 3 | 97 | single_choice | political_thought_frequency | `"regularly_daily"` |
| 4 | 60 | priority_sort | politically_important_identities | `{"supportHigh":["national_identity","religious_identity"],"supportMid":["ideo...` |
| 5 | 89 | best_worst | epistemic_style_battery | `{"best":["eps_traditionalist"],"worst":["eps_autonomous"]}` |
| 6 | 218 | best_worst | aesthetic_style_ranking | `{"best":["aes_fighter"],"worst":["aes_visionary"]}` |
| 7 | 211 | single_choice | strategic_voting | `"sincere_always"` |
| 8 | 212 | single_choice | negative_partisanship | `"never_dem"` |
| 9 | 93 | priority_sort | priority_sort_opener | `{"supportHigh":["cd_high","cu_low","mor_low","com_low"],"supportMid":[],"neut...` |
| 10 | 102 | priority_sort | membership_criteria_priority_sort | `{"supportHigh":["born_here","speak_lang","cultural","ancestry","religion"],"s...` |
| 11 | 209 | single_choice | zero_sum_economics_view | `"winners_at_others_expense"` |
| 12 | 210 | single_choice | human_malleability_view | `"modest_shaping"` |
| 13 | 214 | single_choice | institutions_foundational | `"depends_on_design"` |
| 14 | 8 | single_choice | domestic_vs_abroad_lives | `"clearly_domestic"` |
| 15 | 229 | priority_sort | moral_circle_in_group_sort | `{"supportHigh":["ingroup_national","ingroup_religious"],"supportMid":["ingrou...` |
| 16 | 3 | slider | cultural_social_placement | `91` |
| 17 | 213 | single_choice | equal_standing_within_polity | `"natural_hierarchy"` |
| 18 | 82 | single_choice | openness_assimilation_closure | `"preserve_culture"` |
| 19 | 7 | single_choice | coalition_vs_principle | `"principle_first"` |
| 20 | 78 | best_worst | speaker_appeal | `{"best":["deep_expertise","says_what_they_think"],"worst":["bridge_builder","...` |
| 21 | 11 | single_choice | nyt_headline_click | `"timeless_principles"` |
| 22 | 56 | single_choice | effective_leader_style | `"channel_anger"` |
| 23 | 49 | slider | social_progress_salience | `31` |
| 24 | 71 | slider | rhetoric_style_importance | `51` |
| 25 | 69 | slider | common_ground_salience | `31` |
| 26 | 19 | slider | human_progress_salience | `31` |
| 27 | 84 | slider | institutions_harden_into_domination | `71` |
| 28 | 51 | slider | immigration_national_identity_salience | `91` |
