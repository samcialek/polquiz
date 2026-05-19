# Harness Run — Abstain → Trump (2016 mobilizer)

**Persona ID:** `abstain-to-trump`
**Date:** 2026-05-19
**Questions asked:** 23

## Reachability scorecard

- Composed archetype label: **Fighter Partisan-Communitarian Assimilationist**
- Identity-primary overlay: (none)
- Engagement level: casual

**Expected archetype family:** populist-nationalist

*Top-K archetype-id ranking is deferred — requires the internal RespondentState shape (posDist/salDist arrays) which `getRespondentState` does not expose. Composed label above is the canonical user-facing archetype identity (post-centroid-retirement).*

## Assertions (6/6 pass)

| check | expected | actual | result |
|---|---|---|---|
| vote match | `≥5/5` | `5/5` | ✓ |
| composed label contains "Assimilationist" | `Assimilationist` | `Fighter Partisan-Communitarian Assimilationist` | ✓ |
| composed label contains "Fighter" | `Fighter` | `Fighter Partisan-Communitarian Assimilationist` | ✓ |
| identity-primary state | `none` | `none` | ✓ |
| engagement level | `casual` | `casual` | ✓ |
| questions asked in range | `[20, 35]` | `23` | ✓ |

## Vote-prediction scorecard

- Match: 5/5

| year | expected | actual | match |
|---|---|---|---|
| 2008 | ABSTAIN | ABSTAIN | ✓ |
| 2012 | ABSTAIN | ABSTAIN | ✓ |
| 2016 | R | R | ✓ |
| 2020 | R | R | ✓ |
| 2024 | R | R | ✓ |

## Question trace

| idx | qId | uiType | promptShort | answer |
|---|---|---|---|---|
| 1 | 200 | single_choice | party_identification | `"ind"` |
| 2 | 103 | priority_sort | issue_salience_screener | `{"supportHigh":[],"supportMid":[],"neutral":["mat","cd","cu","mor","pro","com...` |
| 3 | 97 | single_choice | political_thought_frequency | `"sometimes_events"` |
| 4 | 60 | priority_sort | politically_important_identities | `{"supportHigh":["national_identity","ideological_identity","religious_identit...` |
| 5 | 89 | best_worst | epistemic_style_battery | `{"best":["eps_intuitionist"],"worst":["eps_autonomous"]}` |
| 6 | 218 | best_worst | aesthetic_style_ranking | `{"best":["aes_fighter"],"worst":["aes_visionary"]}` |
| 7 | 211 | single_choice | strategic_voting | `"sincere_always"` |
| 8 | 212 | single_choice | negative_partisanship | `"consider_all"` |
| 9 | 93 | priority_sort | priority_sort_opener | `{"supportHigh":["cd_high","cu_low","mor_low","pro_low","com_low"],"supportMid...` |
| 10 | 102 | priority_sort | membership_criteria_priority_sort | `{"supportHigh":["born_here","speak_lang","cultural","ancestry","religion","ec...` |
| 11 | 209 | single_choice | zero_sum_economics_view | `"winners_at_others_expense"` |
| 12 | 210 | single_choice | human_malleability_view | `"modest_shaping"` |
| 13 | 214 | single_choice | institutions_foundational | `"obstacles_to_progress"` |
| 14 | 8 | single_choice | domestic_vs_abroad_lives | `"clearly_domestic"` |
| 15 | 229 | priority_sort | moral_circle_in_group_sort | `{"supportHigh":["ingroup_national","ingroup_religious","ingroup_ideological"]...` |
| 16 | 213 | single_choice | equal_standing_within_polity | `"some_differentiation_acceptable"` |
| 17 | 21 | single_choice | controversial_speaker | `"restricted"` |
| 18 | 82 | single_choice | openness_assimilation_closure | `"civic_assimilation"` |
| 19 | 7 | single_choice | coalition_vs_principle | `"principle_first"` |
| 20 | 11 | single_choice | nyt_headline_click | `"timeless_principles"` |
| 21 | 4 | slider | cultural_social_salience | `71` |
| 22 | 56 | single_choice | effective_leader_style | `"channel_anger"` |
| 23 | 51 | slider | immigration_national_identity_salience | `91` |
