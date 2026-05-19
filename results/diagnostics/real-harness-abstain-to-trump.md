# Harness Run — Abstain → Trump (2016 mobilizer)

**Persona ID:** `abstain-to-trump`
**Date:** 2026-05-19
**Questions asked:** 28

## Reachability scorecard

- Composed archetype label: **Fighter Assimilationist**
- Identity-primary overlay: (none)
- Engagement level: casual

**Expected archetype family:** populist-nationalist

*Top-K archetype-id ranking is deferred — requires the internal RespondentState shape (posDist/salDist arrays) which `getRespondentState` does not expose. Composed label above is the canonical user-facing archetype identity (post-centroid-retirement).*

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
| 2 | 103 | priority_sort | issue_salience_screener | `{"supportHigh":["mat","cd"],"supportMid":["cu","mor"],"neutral":["pro","com",...` |
| 3 | 97 | single_choice | political_thought_frequency | `"sometimes_events"` |
| 4 | 60 | priority_sort | politically_important_identities | `{"supportHigh":["ideological_identity"],"supportMid":["religious_identity"],"...` |
| 5 | 89 | best_worst | epistemic_style_battery | `{"best":["eps_empiricist"],"worst":["eps_autonomous"]}` |
| 6 | 218 | best_worst | aesthetic_style_ranking | `{"best":["aes_statesman"],"worst":["aes_visionary"]}` |
| 7 | 211 | single_choice | strategic_voting | `"sincere_always"` |
| 8 | 212 | single_choice | negative_partisanship | `"consider_all"` |
| 9 | 93 | priority_sort | priority_sort_opener | `{"supportHigh":["cd_high","cu_low","mor_low"],"supportMid":["pro_low","com_lo...` |
| 10 | 102 | priority_sort | membership_criteria_priority_sort | `{"supportHigh":["cultural","speak_lang"],"supportMid":["ancestry","born_here"...` |
| 11 | 209 | single_choice | zero_sum_economics_view | `"winners_at_others_expense"` |
| 12 | 210 | single_choice | human_malleability_view | `"modest_shaping"` |
| 13 | 214 | single_choice | institutions_foundational | `"obstacles_to_progress"` |
| 14 | 8 | single_choice | domestic_vs_abroad_lives | `"clearly_domestic"` |
| 15 | 229 | priority_sort | moral_circle_in_group_sort | `{"supportHigh":["ingroup_national"],"supportMid":["ingroup_religious"],"neutr...` |
| 16 | 3 | slider | cultural_social_placement | `71` |
| 17 | 213 | single_choice | equal_standing_within_polity | `"some_differentiation_acceptable"` |
| 18 | 82 | single_choice | openness_assimilation_closure | `"civic_assimilation"` |
| 19 | 7 | single_choice | coalition_vs_principle | `"principle_first"` |
| 20 | 207 | single_choice | emergency_powers | `"narrow_emergency"` |
| 21 | 11 | single_choice | nyt_headline_click | `"timeless_principles"` |
| 22 | 56 | single_choice | effective_leader_style | `"channel_anger"` |
| 23 | 49 | slider | social_progress_salience | `51` |
| 24 | 38 | slider | rules_procedures_matter_salience | `31` |
| 25 | 69 | slider | common_ground_salience | `31` |
| 26 | 19 | slider | human_progress_salience | `31` |
| 27 | 63 | best_worst | best_worst_battery | `{"best":["fairness"],"worst":["tradition_continuity"]}` |
| 28 | 202 | single_choice | state_scope_preference | `"anti_bureaucratic_localist"` |
