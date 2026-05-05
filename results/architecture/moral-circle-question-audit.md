# Moral Circle Question Audit

**Date:** 2026-05-05  
**Scope:** all unique questions present in `src/config/questions.representative.ts` and `src/config/questions.full.ts`, with current type/category definitions checked in `src/types.ts` and `src/config/categories.ts`.  
**Status:** read-only architecture audit; no code changes.

## New model being audited

Moral circle should be modeled as explicit universal affinity plus scoped affinities. Universal is the baseline moral concern for humans in general. A narrower group becomes an active moral boundary only when its affinity exceeds the universal baseline.

```ts
excessAffinity[group] = Math.max(0, scopedAffinity[group] - universalAffinity)
activeBoundary[group] = excessAffinity[group] > 0
```

Scoped categories audited: `national`, `religious`, `ethnic_racial`, `class`, `gender`, `sexual`, `ideological`, `political_camp`.

## Current implementation drift

- src/types.ts currently defines MorBoundaryId as seven categories, not universal + eight scoped affinities.
- src/config/categories.ts says universalism is encoded as low across all seven boundaries plus high intensity. The new model says universal is an explicit baseline, not absence of boundaries.
- sexual is currently folded into gender. The new model needs sexual as its own scoped affinity if kept conceptually distinct.
- political_tribe naming should be normalized to political_camp or another canonical term before new work starts.
- Question evidence maps currently use MOR, PF, TRB, and TRB_ANCHOR. None directly emit universalAffinity, scopedAffinity, or excessAffinity.

## Audit counts

| Metric | Value |
| --- | --- |
| Unique questions audited | 99 |
| Moral-circle-relevant candidates | 42 |
| Usable existing signal questions | 12 |
| Weak/proxy signal questions | 21 |
| Not relevant to moral circle | 66 |

## Category-by-category evidence and gaps

### universal

**Gap:** No clean direct universalAffinity item asks baseline concern for any human stranger. Existing MOR items are policy-scope or issue-salience proxies.

| Q | Prompt | Strength | Evidence type | Use / caution |
| --- | --- | --- | --- | --- |
| 8 | domestic_vs_abroad_lives | strong | policy_scope_proxy | domestic vs abroad lives; strongest existing universal-vs-national moral-scope item |
| 213 | equal_standing_within_polity | strong | equal_standing_proxy | equal standing inside polity; good for within-polity universal floor but not all-human baseline |
| 103 | issue_salience_screener | medium | salience_screener | directly names moral scope but asks issue priority rather than affinity |
| 93 | priority_sort_opener | medium | pole_battery | MOR pole battery; useful but legacy continuous-node framing |
| 203 | military_intervention | medium | international_policy_proxy | military intervention scope; confounded with realism/security |
| 204 | international_engagement | medium | international_policy_proxy | international engagement; confounded with institutions and strategy |
| 6 | national_priorities_bundle | weak | priority_bundle | planet/future and fairness options imply broad scope but not direct affinity |
| 43 | veil_of_ignorance_society_choice | weak | veil_proxy | veil-of-ignorance item implies impartiality, not affinity magnitude |
| 60 | politically_important_identities | weak | identity_anchor | global_citizen option is identity/scope cue, not universal moral floor |

### national

**Gap:** Good existing evidence, but it measures identity importance and membership criteria more than affinity above universal.

| Q | Prompt | Strength | Evidence type | Use / caution |
| --- | --- | --- | --- | --- |
| 51 | immigration_national_identity_salience | strong | direct_salience | immigration-national-identity salience slider |
| 60 | politically_important_identities | strong | identity_priority | national identity ranking |
| 102 | membership_criteria_priority_sort | strong | membership_criteria | national membership criteria priority sort |
| 201 | patriotism_institutional_trust | medium | national_identification | patriotism/institutional trust, mixes pride with trust |
| 204 | international_engagement | medium | national_orientation | international engagement with home-focus option |
| 205 | trade_nationalism | medium | policy_proxy | trade nationalism, confounded with economics |
| 63 | best_worst_battery | medium | best_worst_anchor | national_strength item |
| 6 | national_priorities_bundle | weak | priority_bundle | national strength option |

### religious

**Gap:** Has membership/background and public-life items; lacks a clean "my religious in-group receives extra moral weight" item.

| Q | Prompt | Strength | Evidence type | Use / caution |
| --- | --- | --- | --- | --- |
| 54 | religion_in_upbringing | strong | membership_background | religion in upbringing; membership/context not affinity |
| 60 | politically_important_identities | strong | identity_priority | religious identity ranking |
| 102 | membership_criteria_priority_sort | medium | membership_criteria | religious heritage as national belonging criterion |
| 206 | religion_in_public_life | medium | public_life_proxy | religion in public life; position and epistemic cross-load |
| 63 | best_worst_battery | weak | best_worst_anchor | community/tradition items can imply religious boundary but not direct |

### ethnic_racial

**Gap:** Only one strong direct identity-priority item. Direct own-group affinity is missing; most existing evidence is policy/structural proxy.

| Q | Prompt | Strength | Evidence type | Use / caution |
| --- | --- | --- | --- | --- |
| 60 | politically_important_identities | strong | identity_priority | ethnic/racial identity ranking |
| 14 | university_admissions_approach | weak | policy_proxy | admissions approach; issue proxy not own-group affinity |
| 15 | inequality_causes_allocation | weak | causal_proxy | discrimination attribution; structural view not affinity |
| 213 | equal_standing_within_polity | weak | equal_standing_proxy | universal equal standing can constrain ethnic/racial excess but does not identify own-group affinity |

### class

**Gap:** Several policy/deservingness proxies plus one identity-priority item. Direct class in-group affinity is missing.

| Q | Prompt | Strength | Evidence type | Use / caution |
| --- | --- | --- | --- | --- |
| 60 | politically_important_identities | strong | identity_priority | class identity ranking |
| 15 | inequality_causes_allocation | medium | structural_proxy | inequality cause allocation |
| 17 | ceo_worker_pay_ratio | medium | policy_proxy | CEO/worker pay ratio |
| 27 | welfare_error_tradeoff | medium | deservingness_proxy | welfare error tradeoff |
| 29 | factory_closure_causes_ranking | medium | causal_proxy | factory-closure causes |
| 13 | preferred_top_marginal_tax_rate | weak | policy_proxy | preferred top marginal tax rate |
| 103 | issue_salience_screener | weak | salience_screener | economic policy priority, not class affinity |

### gender

**Gap:** Sparse. Direct identity-priority exists, but no direct gender in-group affinity above universal.

| Q | Prompt | Strength | Evidence type | Use / caution |
| --- | --- | --- | --- | --- |
| 60 | politically_important_identities | strong | identity_priority | gender identity ranking |
| 103 | issue_salience_screener | weak | salience_screener | social-direction priority mentions gender identity but not gender-group affinity |

### sexual

**Gap:** Sparse and currently folded into gender in ADR-006. Needs separate category if the new architecture keeps sexual distinct.

| Q | Prompt | Strength | Evidence type | Use / caution |
| --- | --- | --- | --- | --- |
| 60 | politically_important_identities | strong | identity_priority | sexual identity ranking |
| 103 | issue_salience_screener | weak | salience_screener | social-direction priority mentions LGBTQ rights but not sexual-group affinity |

### ideological

**Gap:** Moderate evidence from identity ranking, opponent modeling, and cause-vs-party items. Needs cleaner separation from political_camp.

| Q | Prompt | Strength | Evidence type | Use / caution |
| --- | --- | --- | --- | --- |
| 60 | politically_important_identities | strong | identity_priority | ideological identity ranking |
| 35 | percent_groups_want_best_share_values | medium | shared_values_proxy | how many groups want best/share values |
| 39 | opponent_model_allocation | medium | outgroup_model | opponent model allocation |
| 63 | best_worst_battery | medium | best_worst_anchor | individual freedom/fairness/tradition values anchors |
| 81 | party_vs_cause_loyalty | medium | cause_vs_party | cause loyalty can separate ideology from party |
| 99 | cross_partisan_priority_sort | medium | cross_camp_tolerance | cross-party closeness tolerance implies ideological/camp boundary |
| 200 | party_identification | weak | party_label | party ID labels may proxy ideological camp but should not define it |

### political_camp

**Gap:** Strongest existing coverage, but much of it measures heat/intensity rather than affinity direction. Must not dominate the whole moral-circle construct.

| Q | Prompt | Strength | Evidence type | Use / caution |
| --- | --- | --- | --- | --- |
| 200 | party_identification | strong | party_label | party identification label; label only, not intensity |
| 2 | political_identity_centrality | strong | centrality_proxy | politics identity centrality; intensity not direction |
| 40 | opponents_matter_to_identity | strong | opponent_identity | opponents matter to identity |
| 42 | close_friends_voted_differently | strong | network_homophily | close friends voted differently |
| 81 | party_vs_cause_loyalty | strong | party_vs_cause | party/cause loyalty |
| 87 | family_cross_partisan_marriage | strong | family_boundary | cross-camp family marriage reaction |
| 97 | political_thought_frequency | medium | thought_frequency | political thought frequency; intensity proxy |
| 98 | group_solidarity_feeling | medium | solidarity_proxy | group solidarity feeling, ambiguous group object |
| 99 | cross_partisan_priority_sort | medium | cross_camp_tolerance | priority sort over relationship closeness |
| 201 | patriotism_institutional_trust | weak | national_camp_crossload | patriotism/trust may cross-load with camp |

## Questions that need new or revised items

The existing bank can provide partial evidence, but it does not yet cleanly measure the new architecture. The highest-priority additions are:

1. A direct universal baseline item: "How much moral concern should politics give to any human being, regardless of nationality, religion, race, class, gender, sexuality, ideology, or party?"
2. A parallel scoped-affinity battery using the exact same response scale for all eight scoped groups, so excess can be computed by subtraction from universal.
3. A political-camp item that separates party/camp label from moral concern for co-camp members.
4. Separate gender and sexual affinity items; current ADR-006 folds these together, but the new concept separates them.
5. Direct own-group affinity items for ethnic/racial, class, and religious categories. Existing policy proxies should not be used as substitutes for scoped affinity.

## Recommended implementation path

1. Write an ADR superseding the current seven-boundary ADR-006 representation with explicit universal baseline plus eight scoped affinities.
2. Add type-only structures first; do not change scoring until all terminals share the same vocabulary.
3. Add a new moral-circle calibration battery to the representative question bank.
4. Back-map existing questions conservatively: use Q8/Q213/Q103 for universal priors; Q60/Q102/Q200/Q40/Q42/Q81/Q87 for scoped priors; mark policy proxies as weak.
5. Only after the new battery exists, derive excess affinities and candidate/voter moral-circle matching.

## All-question index

| Q | Prompt | Stage | Use class | Proposed moral-circle use | Current touches |
| --- | --- | --- | --- | --- | --- |
| 1 | political_content_frequency | fixed12 | not_moral_circle_relevant |  | ENG |
| 2 | political_identity_centrality | fixed12 | usable_existing_signal | political_camp:strong | PF, ENG |
| 3 | cultural_social_placement | fixed12 | not_moral_circle_relevant |  | CD |
| 4 | cultural_social_salience | fixed12 | not_moral_circle_relevant |  | CD, CU, MOR |
| 5 | engagement_motivations_top2 | screen20 | not_moral_circle_relevant |  | PRO, COM, MOR, PF, TRB, ENG, EPS |
| 6 | national_priorities_bundle | stage2 | weak_or_proxy_signal | universal:weak, national:weak | MAT, CD, MOR, ONT_H, ZS, MAT |
| 7 | coalition_vs_principle | screen20 | not_moral_circle_relevant |  | COM |
| 8 | domestic_vs_abroad_lives | screen20 | usable_existing_signal | universal:strong | MOR |
| 9 | politics_at_social_gatherings | stage2 | not_moral_circle_relevant |  | ENG, COM |
| 10 | climate_energy_bundle | stage3 | not_moral_circle_relevant |  | MAT, ONT_S |
| 11 | nyt_headline_click | fixed12 | not_moral_circle_relevant |  | EPS, AES |
| 12 | guess_top_marginal_tax_rate | stage2 | not_moral_circle_relevant |  | EPS |
| 13 | preferred_top_marginal_tax_rate | stage2 | weak_or_proxy_signal | class:weak | MAT |
| 14 | university_admissions_approach | stage2 | weak_or_proxy_signal | ethnic_racial:weak | MAT, MOR |
| 15 | inequality_causes_allocation | fixed12 | weak_or_proxy_signal | ethnic_racial:weak, class:medium | MAT, COM, MAT |
| 16 | criminal_justice_bundle | stage3 | not_moral_circle_relevant |  | PRO, ONT_H |
| 17 | ceo_worker_pay_ratio | stage2 | weak_or_proxy_signal | class:medium | MAT |
| 18 | human_improvement_capacity | screen20 | not_moral_circle_relevant |  | ONT_H |
| 19 | human_progress_salience | screen20 | not_moral_circle_relevant |  | ONT_H |
| 20 | bad_outcomes_blame_allocation | fixed12 | not_moral_circle_relevant |  | ZS, ONT_H, COM, ZS |
| 21 | controversial_speaker | fixed12 | not_moral_circle_relevant |  | PRO, COM |
| 22 | source_trust_conflict | fixed12 | not_moral_circle_relevant |  | EPS |
| 23 | who_should_shape_a_law | fixed12 | not_moral_circle_relevant |  | EPS, PRO |
| 24 | child_traits | screen20 | not_moral_circle_relevant |  | EPS, AES, ONT_H |
| 25 | criminal_trial_error_tradeoff | screen20 | not_moral_circle_relevant |  | PRO, PRO, MOR |
| 27 | welfare_error_tradeoff | stage2 | weak_or_proxy_signal | class:medium | MAT, MAT, PRO, MOR |
| 28 | mask_mandate_acceptability | stage2 | not_moral_circle_relevant |  | PRO, CU |
| 29 | factory_closure_causes_ranking | stage2 | weak_or_proxy_signal | class:medium | MAT, ONT_S, CU |
| 30 | information_control_error_tradeoff | stage2 | not_moral_circle_relevant |  | PRO, PRO, EPS, COM |
| 31 | trade_liberalization_effects | fixed12 | not_moral_circle_relevant |  | ZS, ZS, ONT_S |
| 33 | immigration_enforcement_error_tradeoff | stage2 | not_moral_circle_relevant |  | PRO, PRO, CU, ONT_S |
| 34 | threats_to_america_external_internal | stage3 | not_moral_circle_relevant |  | ZS, TRB |
| 35 | percent_groups_want_best_share_values | stage2 | weak_or_proxy_signal | ideological:medium | TRB, ZS |
| 36 | fda_speed_vs_safety | stage2 | not_moral_circle_relevant |  | PRO, EPS |
| 37 | stupid_workplace_rule_response | stage2 | not_moral_circle_relevant |  | PRO, COM |
| 38 | rules_procedures_matter_salience | screen20 | not_moral_circle_relevant |  | PRO |
| 39 | opponent_model_allocation | screen20 | weak_or_proxy_signal | ideological:medium | TRB, COM, ONT_H, EPS |
| 40 | opponents_matter_to_identity | fixed12 | usable_existing_signal | political_camp:strong | PF, TRB |
| 41 | election_access_vs_security | stage2 | not_moral_circle_relevant |  | PRO, TRB |
| 42 | close_friends_voted_differently | screen20 | usable_existing_signal | political_camp:strong | TRB |
| 43 | veil_of_ignorance_society_choice | stage2 | weak_or_proxy_signal | universal:weak | MAT |
| 44 | views_changed_in_10_years | stage3 | not_moral_circle_relevant |  | PF |
| 47 | political_conflict_with_close_others | fixed12 | not_moral_circle_relevant |  | COM |
| 48 | improvement_mechanism | screen20 | not_moral_circle_relevant |  | ONT_H, ONT_S, MAT, CD |
| 49 | social_progress_salience | stage2 | not_moral_circle_relevant |  | ONT_H, ONT_S |
| 50 | integration_expectations_rewrite | stage2 | not_moral_circle_relevant |  | CU, CD, MAT |
| 51 | immigration_national_identity_salience | screen20 | usable_existing_signal | national:strong | CU, CD, TRB_ANCHOR |
| 52 | political_membership_criterion_rewrite | stage2 | not_moral_circle_relevant |  | CU, TRB, TRB_ANCHOR |
| 54 | religion_in_upbringing | stage3 | usable_existing_signal | religious:strong |  |
| 55 | what_changed_your_mind | screen20 | not_moral_circle_relevant |  | EPS |
| 56 | effective_leader_style | screen20 | not_moral_circle_relevant |  | AES |
| 59 | what_matters_more_in_leader | screen20 | not_moral_circle_relevant |  | AES, EPS |
| 60 | politically_important_identities | screen20 | usable_existing_signal | universal:weak, national:strong, religious:strong, ethnic_racial:strong, class:strong, gender:strong, sexual:strong, ideological:strong | TRB_ANCHOR |
| 61 | political_pitch_resonance | screen20 | not_moral_circle_relevant |  | AES, EPS |
| 62 | movement_aesthetics_reaction | screen20 | not_moral_circle_relevant |  | AES |
| 63 | best_worst_battery | screen20 | weak_or_proxy_signal | national:medium, religious:weak, ideological:medium | MOR, PRO, MAT, CU, COM, CD, ZS, TRB, TRB_ANCHOR |
| 64 | political_frustration | stage2 | not_moral_circle_relevant |  | MAT, ONT_S, PRO, CD, ENG |
| 66 | community_fund_allocation | stage2 | not_moral_circle_relevant |  | CD, PRO, MAT, COM, AES |
| 69 | common_ground_salience | stage2 | not_moral_circle_relevant |  | COM |
| 71 | rhetoric_style_importance | stage2 | not_moral_circle_relevant |  | AES |
| 76 | success_attribution | stage2 | not_moral_circle_relevant |  | ONT_S, ZS, ONT_S |
| 77 | decision_making_style | stage2 | not_moral_circle_relevant |  | EPS |
| 78 | speaker_appeal | stage2 | not_moral_circle_relevant |  | AES, AES, EPS |
| 79 | expert_disagreement_reaction | stage2 | not_moral_circle_relevant |  | EPS, EPS, ENG |
| 80 | political_attention_style | stage2 | not_moral_circle_relevant |  | ENG, EPS, AES |
| 81 | party_vs_cause_loyalty | stage3 | usable_existing_signal | ideological:medium, political_camp:strong | PF, ENG, TRB |
| 82 | openness_assimilation_closure | stage3 | not_moral_circle_relevant |  | CD, CU, MOR, MAT |
| 83 | broken_politics_diagnosis | stage3 | not_moral_circle_relevant |  | ENG, TRB, CD, CU, COM |
| 84 | institutions_harden_into_domination | stage3 | not_moral_circle_relevant |  | ZS, ZS, ONT_H, COM, PRO, EPS |
| 85 | institutional_legitimacy_source | stage3 | not_moral_circle_relevant |  | PRO, CD, COM, EPS |
| 87 | family_cross_partisan_marriage | stage3 | usable_existing_signal | political_camp:strong | PF, TRB |
| 89 | epistemic_style_battery | fixed12 | not_moral_circle_relevant |  | EPS, EPS |
| 93 | priority_sort_opener | fixed12 | weak_or_proxy_signal | universal:medium | MAT, MAT, CD, CD, CU, CU, MOR, MOR, PRO, PRO, COM, COM |
| 97 | political_thought_frequency | fixed12 | weak_or_proxy_signal | political_camp:medium | PF, ENG |
| 98 | group_solidarity_feeling | fixed12 | weak_or_proxy_signal | political_camp:medium | TRB, MOR |
| 99 | cross_partisan_priority_sort | fixed12 | weak_or_proxy_signal | ideological:medium, political_camp:medium | TRB |
| 100 | leader_conjoint | fixed12 | not_moral_circle_relevant |  |  |
| 101 | cultural_social_placement_dual | fixed12 | not_moral_circle_relevant |  | CD, CD |
| 102 | membership_criteria_priority_sort | fixed12 | usable_existing_signal | national:strong, religious:medium | CU, CU |
| 103 | issue_salience_screener | fixed12 | weak_or_proxy_signal | universal:medium, class:weak, gender:weak, sexual:weak | MAT, CD, CU, MOR, PRO, COM, ZS, ONT_H, ONT_S, EPS, AES |
| 200 | party_identification | fixed12 | usable_existing_signal | ideological:weak, political_camp:strong |  |
| 201 | patriotism_institutional_trust | fixed12 | weak_or_proxy_signal | national:medium, political_camp:weak | ONT_S, ONT_S, TRB |
| 202 | state_scope_preference | fixed12 | not_moral_circle_relevant |  | MAT, PRO, ONT_S, COM |
| 203 | military_intervention | fixed12 | weak_or_proxy_signal | universal:medium | MOR, ZS, ONT_H |
| 204 | international_engagement | fixed12 | weak_or_proxy_signal | universal:medium, national:medium | CU, MOR, TRB |
| 205 | trade_nationalism | fixed12 | weak_or_proxy_signal | national:medium | MAT, CU, ZS |
| 206 | religion_in_public_life | fixed12 | weak_or_proxy_signal | religious:medium | CD, MOR, PRO, EPS |
| 207 | emergency_powers | fixed12 | not_moral_circle_relevant |  | PRO, ONT_H |
| 208 | courts_vs_majority | fixed12 | not_moral_circle_relevant |  | PRO, ONT_H |
| 209 | zero_sum_economics_view | fixed12 | not_moral_circle_relevant |  | ZS, ZS |
| 210 | human_malleability_view | fixed12 | not_moral_circle_relevant |  | ONT_H, ONT_H |
| 211 | strategic_voting | fixed12 | not_moral_circle_relevant |  |  |
| 212 | negative_partisanship | fixed12 | not_moral_circle_relevant |  |  |
| 213 | equal_standing_within_polity | fixed12 | usable_existing_signal | universal:strong, ethnic_racial:weak | MOR, MOR, CU, PRO |
| 214 | institutions_foundational | fixed12 | not_moral_circle_relevant |  | ONT_S, ONT_S, PRO, ONT_H |
| 215 | theory_of_change_progress | stage2 | not_moral_circle_relevant |  | ONT_S, ONT_S, MAT, PRO |
| 216 | strengthen_democracy_priority | stage2 | not_moral_circle_relevant |  | ONT_S, ONT_S, MAT, PRO |
| 217 | epistemic_style_ranking | fixed12 | not_moral_circle_relevant |  | EPS |
| 218 | aesthetic_style_ranking | fixed12 | not_moral_circle_relevant |  | AES, AES |
