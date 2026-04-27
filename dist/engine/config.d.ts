/**
 * Fixed opener — these question IDs are always asked first, in order.
 *
 * Q103 opens the quiz with an 11-item salience-screener priority sort covering
 * the 11 topic-facing nodes (PF/TRB/ENG excluded — those read as meta-questions
 * about one's relationship to politics, not political topics, so PF/ENG ride on
 * Q97/Q1 and TRB gets anchor/position evidence from Q60/Q99). Added 2026-04-23 per `results/architecture/salience-reach-12.md`
 * to fix the "never reach confident rule-out" problem: soft Q93-tuned salience
 * likelihoods asymptote at E[sal]=0.63 on target.sal=0 nodes, so the posterior
 * never crosses the `salDist[0] ≥ 0.5` eligibility gate and the engine keeps
 * burning question budget on nodes the respondent doesn't care about. Q103
 * ships harder per-question `salienceBuckets` ([0.90, 0.08, 0.02, 0] on the
 * neutral bucket) that concentrate salience posteriors in a single touch.
 *
 * Sequence (2026-04-23, post-reorder):
 *   Q103 — issue_salience_screener (priority_sort; 11-item salience rule-out)
 *   Q97  — political_thought_frequency (single_choice; PF pos + sal)
 *   Q60  — politically_important_identities (priority_sort; 3-bucket TRB anchor)
 *   Q89  — epistemic_style_battery (best_worst; EPS category + salience)
 *   Q84  — institutions_harden_into_domination (slider; ZS/ONT_H/PRO/COM/EPS)
 *   Q11  — nyt_headline_click (single_choice; EPS + AES category)
 *   Q1   — political_content_frequency (single_choice; ENG pos + sal)
 *   Q93  — priority_sort_opener (priority_sort; MAT/CD/CU/MOR/PRO/COM poles)
 *   Q99  — cross_partisan_priority_sort (priority_sort; TRB position)
 *   Q101 — cultural_social_placement_dual (dual_axis; CD position + salience)
 *   Q15  — inequality_causes_allocation (allocation; MAT + ONT_S position)
 *   Q27, Q30, Q33 — error-tradeoff battery (MAT/PRO/CU/MOR/ONT_S support)
 *
 * Ordering notes:
 * - Q93 moved from position 2 to position 9 (2026-04-23): two heavy priority
 *   sorts (Q103 + Q93) back-to-back at the front was fatigue-inducing; spread
 *   them apart so the opener feels lighter.
 * - Q60 converted from ranking to 3-bucket priority_sort (2026-04-23) so
 *   respondents who don't identify with any of the 8 anchors can express that
 *   (all items in "neutral" → uniform posterior → mixed_none reads).
 * - Q84 added to close the REALITY-cluster position gap — the original opener
 *   had zero position touches on ZS/ONT_H (only Q103 salience rule-out); Q84
 *   supplies slider-based position evidence on ZS/ONT_H/PRO/COM/EPS in a
 *   single Likert gesture.
 * - Q6 demoted for Q15 (2026-04-24): Q6's broad bundle was diffuse and
 *   over-added CD/MOR/ZS/ONT_H; Q15 gives cleaner ONT_S position plus MAT.
 *
 * After the opener, the EIG selector drills position on nodes whose salience
 * posterior has crossed the active threshold (sal ≥ 2). Nodes that Q103 ruled
 * out (`salDist[0] ≥ 0.5`) are skipped by isQuestionEligible.
 */
export declare const FIXED_OPENER: readonly number[];
/** @deprecated Kept as alias during EIG selector migration. Use FIXED_OPENER. */
export declare const FIXED_16: readonly number[];
export declare const CORE_OPENER: readonly number[];
export declare const UNIVERSAL_SCREENERS: readonly number[];
export declare const SALIENCE_ROUTER_FIXED: readonly number[];
export declare const MEANINGFUL_POSITION_WEIGHT: number;
export declare const POSITION_DRILL_SAL_FLOOR: number;
export declare const MIN_POSITION_TOUCHES_PER_TOP_K: number;
export declare const MAX_POSITION_TOUCHES_TOP_K: number;
export declare const MAX_POSITION_TOUCHES_NON_TOP_K: number;
export declare const TOP_K_BASE: number;
export declare const TOP_K_CLOSE_THRESHOLD: number;
