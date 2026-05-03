# Question-information audit

**Date:** 2026-05-03 (Terminal-3, read-only audit)
**HEAD:** e776daa
**Bank:** `src/config/questions.representative.ts` — 96 questions audited
**Replay overlay:** persona-replay (121 archetypes), dump-replay (3 dumps)

## Methodology

For each question, walked every evidence map (`optionEvidence`, `sliderMap`, `allocationMap`, `rankingMap`, `bestWorstMap`, `pairMaps`, `dualAxisMap`, `salienceBuckets`) and computed per-(node, role) evidence strength as the *range* of expected outputs across all options/buckets/items. Compared declared touchProfile weight against actual evidence-map content. Cross-referenced with persona-replay + dump-replay for realized routing.

Evidence-strength scale:
- **position** (range over [1,5]): too_weak <0.5, reasonable 0.5–2.5, strong 2.5–3.5, too_strong ≥3.5.
- **salience** (range over [0,3]): too_weak <0.4, reasonable 0.4–1.8, strong 1.8–2.5, too_strong ≥2.5.
- **category** (max pairwise L1 over 6-cat dist [0,2]): too_weak <0.3, reasonable 0.3–1.2, strong ≥1.2.

Issue classification:
- **P0 bug** — hollow touch (touchProfile declares node/role but no evidence map affects it), or SELF-cluster sal touch (forbidden post-ADR-005).
- **P1 measurement risk** — declared-vs-actual mismatch, evidence too strong/weak with material weight.
- **P2 efficiency issue** — overloaded probe, subthreshold touch counted somewhere, or metadata-only question.
- **P3 documentation / terminology issue** — not auto-detected; flagged manually if observed.

## 1. Executive summary — top 10 suspicious questions

| qid | promptShort | uiType | nodes | flags | priority |
|---:|---|---|---:|---|:-:|
| 39 | `opponent_model_allocation` | allocation | 6 | overloaded_question, evidence_too_strong, subthreshold_touch, hollow_touch | P0 |
| 15 | `inequality_causes_allocation` | allocation | 4 | overloaded_question, hollow_touch, subthreshold_touch | P0 |
| 20 | `bad_outcomes_blame_allocation` | allocation | 4 | overloaded_question, subthreshold_touch, hollow_touch | P0 |
| 66 | `community_fund_allocation` | allocation | 6 | overloaded_question, subthreshold_touch, hollow_touch | P0 |
| 103 | `issue_salience_screener` | priority_sort | 11 | overloaded_question, evidence_too_strong | P1 |
| 27 | `welfare_error_tradeoff` | single_choice | 3 | hollow_touch, subthreshold_touch | P0 |
| 33 | `immigration_enforcement_error_tradeoff` | single_choice | 3 | hollow_touch, subthreshold_touch | P0 |
| 25 | `criminal_trial_error_tradeoff` | single_choice | 2 | hollow_touch, subthreshold_touch | P0 |
| 22 | `source_trust_conflict` | single_choice | 1 | hollow_touch | P0 |
| 77 | `decision_making_style` | single_choice | 2 | hollow_touch | P0 |

### 1a. P0 hollow-touch detail (9 questions)

Each row is a touchProfile entry that declares a node/role but the engine call path delivers no evidence for that combination — neither explicit per-option arrays nor any of the implicit-derivation paths in `update.ts` (extremity-boost for single_choice/slider, HHI for allocation, RANK_SAL for ranking, SAL_IF_BEST/WORST/MIDDLE for best_worst, salienceBuckets for priority_sort, y-axis for dual_axis). `registerTouches` still increments `node.touches` for these — so the routing ledger inflates while estimates stay unchanged.

| qid | uiType | hollow node/role | weight | impact |
|---:|---|---|---:|---|
| 15 | allocation | ZS/position | 0.15 | low (subthreshold) |
| 15 | allocation | EPS/category | 0.1 | low (subthreshold) |
| 20 | allocation | EPS/category | 0.1 | low (subthreshold) |
| 22 | single_choice | EPS/salience | 0.4 | **HIGH** (counts toward routing) |
| 25 | single_choice | PRO/salience | 0.7 | **HIGH** (counts toward routing) |
| 27 | single_choice | MAT/salience | 0.65 | **HIGH** (counts toward routing) |
| 33 | single_choice | PRO/salience | 0.55 | **HIGH** (counts toward routing) |
| 39 | allocation | ZS/position | 0.35 | low (subthreshold) |
| 39 | allocation | MOR/position | 0.15 | low (subthreshold) |
| 66 | allocation | EPS/category | 0.1 | low (subthreshold) |
| 77 | single_choice | AES/category | 0.15 | low (subthreshold) |

## 2. Questions that appear too weak

| qid | promptShort | uiType | flag detail |
|---:|---|---|---|
| 210 | `human_malleability_view` | single_choice | ONT_H/salience range 0.25 but weight=0.4 (counts toward routing) |

## 3. Questions that appear too strong

| qid | promptShort | uiType | flag detail |
|---:|---|---|---|
| 39 | `opponent_model_allocation` | allocation | TRB/position range 3.60 (option count 3) |
| 101 | `cultural_social_placement_dual` | dual_axis | CD/salience range 3.00 (option count 2) |
| 103 | `issue_salience_screener` | priority_sort | MAT/salience range 2.76 (option count 2); CD/salience range 2.76 (option count 2); CU/salience range 2.76 (option count 2); MOR/salience range 2.76 (option count 2); PRO/salience range 2.76 (option count 2); COM/salience range 2.76 (option count 2); ZS/salience range 2.76 (option count 2); ONT_H/salience range 2.76 (option count 2); ONT_S/salience range 2.76 (option count 2); EPS/salience range 2.76 (option count 2); AES/salience range 2.76 (option count 2) |

## 4. Questions that are overloaded

| qid | promptShort | uiType | flag detail |
|---:|---|---|---|
| 5 | `engagement_motivations_top2` | multi | touches 7 distinct nodes/anchors |
| 6 | `national_priorities_bundle` | single_choice | touches 5 distinct nodes/anchors |
| 15 | `inequality_causes_allocation` | allocation | touches 4 distinct nodes/anchors |
| 20 | `bad_outcomes_blame_allocation` | allocation | touches 4 distinct nodes/anchors |
| 39 | `opponent_model_allocation` | allocation | touches 6 distinct nodes/anchors |
| 48 | `improvement_mechanism` | single_choice | touches 4 distinct nodes/anchors |
| 63 | `best_worst_battery` | best_worst | touches 9 distinct nodes/anchors |
| 64 | `political_frustration` | single_choice | touches 5 distinct nodes/anchors |
| 66 | `community_fund_allocation` | allocation | touches 6 distinct nodes/anchors |
| 82 | `openness_assimilation_closure` | single_choice | touches 4 distinct nodes/anchors |
| 83 | `broken_politics_diagnosis` | single_choice | touches 5 distinct nodes/anchors |
| 84 | `institutions_harden_into_domination` | slider | touches 5 distinct nodes/anchors |
| 85 | `institutional_legitimacy_source` | single_choice | touches 4 distinct nodes/anchors |
| 93 | `priority_sort_opener` | priority_sort | touches 6 distinct nodes/anchors |
| 103 | `issue_salience_screener` | priority_sort | touches 11 distinct nodes/anchors |
| 202 | `state_scope_preference` | single_choice | touches 4 distinct nodes/anchors |
| 206 | `religion_in_public_life` | single_choice | touches 4 distinct nodes/anchors |

## 5. Questions that are clean but under-routed

| qid | promptShort | node/role | quality | asked count | avg slot |
|---:|---|---|---:|---:|---:|
| 3 | `cultural_social_placement` | CD/position | 0.9 | 0 | — |
| 8 | `domestic_vs_abroad_lives` | MOR/position | 0.89 | 0 | — |
| 13 | `preferred_top_marginal_tax_rate` | MAT/position | 0.88 | 0 | — |
| 17 | `ceo_worker_pay_ratio` | MAT/position | 0.87 | 0 | — |
| 42 | `close_friends_voted_differently` | TRB/position | 0.88 | 0 | — |
| 43 | `veil_of_ignorance_society_choice` | MAT/position | 0.91 | 0 | — |
| 47 | `political_conflict_with_close_others` | COM/position | 0.89 | 0 | — |
| 99 | `cross_partisan_priority_sort` | TRB/position | 0.9 | 0 | — |
| 101 | `cultural_social_placement_dual` | CD/position | 0.88 | 0 | — |

## 6. Fixed-opener questions

| slot | qid | promptShort | uiType | nodes | burden | flags |
|---:|---:|---|---|---:|---:|---|
| 1 | 200 | `party_identification` | single_choice | 0 | 1 | metadata_without_evidence |
| 2 | 103 | `issue_salience_screener` | priority_sort | 11 | 3 | overloaded_question, evidence_too_strong |
| 3 | 97 | `political_thought_frequency` | single_choice | 2 | 1 | — |
| 4 | 1 | `political_content_frequency` | single_choice | 1 | 1 | — |
| 5 | 60 | `politically_important_identities` | priority_sort | 1 | 3 | — |
| 6 | 89 | `epistemic_style_battery` | best_worst | 1 | 2 | — |
| 7 | 22 | `source_trust_conflict` | single_choice | 1 | 1 | hollow_touch |
| 8 | 218 | `aesthetic_style_ranking` | best_worst | 1 | 2 | — |
| 9 | 211 | `strategic_voting` | single_choice | 0 | 1 | metadata_without_evidence |
| 10 | 212 | `negative_partisanship` | single_choice | 0 | 1 | metadata_without_evidence |
| 11 | 93 | `priority_sort_opener` | priority_sort | 6 | 3 | overloaded_question |
| 12 | 102 | `membership_criteria_priority_sort` | priority_sort | 1 | 3 | subthreshold_touch |
| 13 | 209 | `zero_sum_economics_view` | single_choice | 1 | 1 | — |
| 14 | 210 | `human_malleability_view` | single_choice | 1 | 1 | evidence_too_weak |
| 15 | 214 | `institutions_foundational` | single_choice | 3 | 1 | subthreshold_touch |

## 7. Fixed-opener questions that could become conditional

Bottom 5 fixed-opener questions by `signal_per_burden` (= weighted-evidence-sum / UI-burden). These are first-cut candidates for conditional/adaptive demotion.

| qid | promptShort | uiType | burden | totalEvidence | signal/burden | nodes |
|---:|---|---|---:|---:|---:|---:|
| 200 | `party_identification` | single_choice | 1 | 0 | 0 | 0 |
| 211 | `strategic_voting` | single_choice | 1 | 0 | 0 | 0 |
| 212 | `negative_partisanship` | single_choice | 1 | 0 | 0 | 0 |
| 102 | `membership_criteria_priority_sort` | priority_sort | 3 | 0.381 | 0.127 | 1 |
| 89 | `epistemic_style_battery` | best_worst | 2 | 1.292 | 0.646 | 1 |

## 8. Per-node coverage table

| node | cluster | pos touches | sal touches | cat touches | meaningful pos | clean direct probes | omnibus probes | fixed-opener touches | hollow | status |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---|
| MAT | ENDS | 19 | 6 | 0 | 10 | 3 | 13 | 3 | 1 | adequate_position_coverage |
| CD | ENDS | 12 | 6 | 0 | 8 | 2 | 12 | 3 | 0 | adequate_position_coverage |
| CU | ENDS | 11 | 6 | 0 | 3 | 0 | 6 | 5 | 0 | adequate_position_coverage |
| MOR | ENDS | 13 | 6 | 0 | 4 | 1 | 9 | 3 | 1 | adequate_position_coverage |
| PRO | MEANS | 24 | 8 | 0 | 13 | 0 | 11 | 4 | 2 | over_covered_position |
| COM | MEANS | 15 | 5 | 0 | 5 | 2 | 13 | 3 | 0 | adequate_position_coverage |
| ZS | REALITY | 11 | 6 | 0 | 6 | 1 | 9 | 3 | 2 | adequate_position_coverage |
| ONT_H | REALITY | 13 | 4 | 0 | 3 | 2 | 6 | 4 | 0 | adequate_position_coverage |
| ONT_S | REALITY | 11 | 6 | 0 | 6 | 0 | 4 | 3 | 0 | adequate_position_coverage |
| PF | SELF | 7 | 0 | 0 | 5 | 0 | 1 | 1 | 0 | adequate_position_coverage |
| TRB | SELF | 15 | 0 | 0 | 7 | 2 | 4 | 0 | 0 | adequate_position_coverage |
| ENG | SELF | 9 | 0 | 0 | 4 | 1 | 3 | 2 | 0 | adequate_position_coverage |
| EPS | MEANS | 0 | 4 | 23 | 0 | 0 | 9 | 5 | 4 | over_covered_category |
| AES | MEANS | 0 | 4 | 10 | 0 | 0 | 2 | 3 | 1 | over_covered_category |

## 9. Special-attention questions (per spec)

| qid | note | nodes | uiType | burden | total evidence | signal/burden | flags |
|---:|---|---:|---|---:|---:|---:|---|
| 1 | redundant engagement reinforcement? | 1 | single_choice | 1 | 2.643 | 2.643 | — |
| 22 | EPS tie-breaker, possible conditional-only? | 1 | single_choice | 1 | 1.288 | 1.288 | hollow_touch |
| 102 | expensive but structurally important — why? | 1 | priority_sort | 3 | 0.381 | 0.127 | subthreshold_touch |
| 82 | CD/CU lever; mixed or too strong? | 4 | single_choice | 1 | 4.73 | 4.73 | overloaded_question, subthreshold_touch |
| 3 | clean CD probe; now Top-K routed | 1 | slider | 1 | 2.502 | 2.502 | — |
| 8 | clean MOR probe; possible future route | 1 | slider | 1 | 2.376 | 2.376 | — |
| 93 | broad opener; overloaded but necessary? | 6 | priority_sort | 3 | 7.062 | 2.354 | overloaded_question |
| 103 | salience screener; high burden but essential | 11 | priority_sort | 3 | 28.842 | 9.614 | overloaded_question, evidence_too_strong |
| 209 | direct ZS screener | 1 | single_choice | 1 | 2.394 | 2.394 | — |
| 210 | direct ONT_H screener | 1 | single_choice | 1 | 2.106 | 2.106 | evidence_too_weak |
| 214 | direct ONT_S screener | 3 | single_choice | 1 | 3.09 | 3.09 | subthreshold_touch |
| 89 | EPS category anchor | 1 | best_worst | 2 | 1.292 | 0.646 | — |
| 218 | AES category anchor | 1 | best_worst | 2 | 1.425 | 0.712 | — |
| 207 | PRO forced-coverage probe | 2 | single_choice | 1 | 1.877 | 1.877 | subthreshold_touch |
| 213 | MOR forced-coverage probe | 3 | single_choice | 1 | 3.409 | 3.409 | subthreshold_touch |
| 18 | ONT_H forced-coverage probe | 1 | single_choice | 1 | 1.926 | 1.926 | — |
| 7 | COM forced-coverage probe | 1 | single_choice | 1 | 1.53 | 1.53 | — |

## 10. Recommended next experiments

Issue counts: **9 P0** · **14 P1** · **40 P2**

### Intentional patterns (not bugs)

Some flags surface deliberate design choices. These were verified against the question file's inline comments and `results/architecture/` ADRs:

- **Q103** salience screener — `evidence_too_strong` flag for all 11 sal touches is *intentional*. Q103's whole job is to drive `salDist[0]` past the eligibility gate in one touch via the `salienceBuckets` override (`[0.90, 0.08, 0.02, 0.00]` on the neutral bucket). The "too strong" flag is the audit recognizing the design.
- **Q101** `cultural_social_placement_dual` — `CD/salience range 3.00` is intentional dual-axis behavior. Y-axis = "doesn't matter" (E[sal]≈0) to "central" (E[sal]≈3) by construction.
- **Q39** `opponent_model_allocation` — `TRB/position range 3.60` reflects the deliberate opposite-pole encoding (allocation buckets at TRB:+0.9 and TRB:-0.9). Audit will always flag this; it's not a defect.

### Suggested follow-ups (priority-ordered)

1. **P0 fix highest-impact hollow salience touches first.** The most consequential P0s are hollow *salience* touches with weight ≥ MEANINGFUL_POSITION_WEIGHT (0.4):
   - **Q22 EPS/salience@0.40** (fixed-opener) — touch declared but the only EPS update is via `EPS.cat`. The "tie-breaker" framing always referred to category disambiguation; the salience row is leftover. Drop the row.
   - **Q25 PRO/salience@0.70** — high weight, no derivation path. Either add per-option `PRO.sal` arrays or drop the touch.
   - **Q27 MAT/salience@0.65** — same pattern as Q25.
   - **Q33 PRO/salience@0.55** — same pattern.
   These are pure routing-ledger inflation. Each one either needs explicit per-option `.sal` evidence added or the touchProfile row removed.
2. **P0 subthreshold hollow touches** — Q15/Q20/Q39/Q66 all declare `EPS/category@0.10` on allocation questions but the `allocationMap.categorical` field is never populated. These are subthreshold (don't count for routing) but still increment touch counters — drop the rows for hygiene.
3. **P1 evidence_too_strong soak test.** For Q39 (TRB/position@3.60) verify whether the opposite-pole allocation is too aggressive — if a single bucket pick is collapsing the TRB posterior, it may be over-fitting. Q103/Q101 are intentional and need no change.
4. **Under-routed clean probes** — Q3 (CD), Q8 (MOR), Q13 (MAT), Q17 (MAT), Q42 (TRB), Q43 (MAT), Q47 (COM), Q99 (TRB) are all single-node high-weight position questions never asked in any persona-replay. Q3 just got Top-K routed; Q8 (MOR) is the next-cleanest candidate for an MOR drill probe. Q47 (COM) is a clean COM probe currently unused — could replace Q7 in FORCED_COVERAGE_PROBES.
5. **Conditional demotion candidates.** Bottom of the fixed-opener `signal_per_burden` table: Q200/Q211/Q212 all sit at signal=0 because they're metadata-only questions (no node evidence by design — they feed election compute). They cost 1 burden unit each but contribute no node estimate. *They should NOT be demoted* — Q200 PartyID is needed for the partisan multiplier; Q211/Q212 feed predictVote. Document this clearly so they're not bundled with low-signal candidates.
6. **Overloaded omnibus probes.** Q5 (multi, 7 nodes — half hollow), Q63 (best_worst, 9 nodes), Q39 (allocation, 6 nodes), Q66 (allocation, 6 nodes) carry the highest distinct-node counts. Q5 in particular has 3 hollow touches inside a 7-node declaration — restructure or split. Q102 was already pruned (2026-05-02) and is now clean (1 effective node); leave alone. Q93/Q103 are deliberate priorityBatteries.

## Files written by this audit

- `results/eig-selector/question-information-audit.md` (this file)
- `results/eig-selector/question-information-audit.json` — full machine-readable audit
- `results/eig-selector/question-information-audit.csv` — one row per question
- `results/eig-selector/question-information-node-summary.md` — per-node coverage detail
- `scripts/question-information-audit.mjs` — audit script (untracked; not committed)

## Terminology check

No retired model concepts as active terms. Engagement (ENG) is referenced as a separate 1D continuous variable per ADR canon. Legacy code identifiers (`MOR`, `TRB`, `PF`, `CU`, `CD`, etc.) appear only as implementation labels for nodes. Touch-profile field names match `src/types.ts`.