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
// FIXED_OPENER — expanded 2026-04-25 per ADR-009 Phase 2-3 to cover newly-
// introduced dimensions (state-scope, foreign-policy, religion, democratic-
// authoritarian, direct ZS/ONT_H probes, within-polity equal-standing,
// institutional essentialism, strategic voting, negative partisanship).
// 32 questions total (Q200 + 31 evidence/metadata items). Adaptive
// selection takes over after.
//
// Ordering rationale:
//   200      — Party-ID first (used in election distance multiplier)
//   103      — Salience screener (gates downstream eligibility)
//   97, 60   — PF position + TRB anchor
//   89, 217, 22 — EPS coverage (best/worst, direct rank, tie-breaker)
//   201      — Patriotism+institutional trust
//   84, 11, 218, 1 — Slider + headline + direct AES max-diff + ENG behavior
//   93, 99, 101 — Priority sort, cross-partisan, dual-axis
//   15, 27, 30, 33 — Inequality allocation + 3 error tradeoffs
//   202      — State scope
//   214      — Institutions as foundational (normative ONT_S, decoupled
//              from current performance; sits next to state-scope to keep
//              the institutional-design block coherent)
//   203, 204, 205 — Foreign policy mini-module
//   206      — Religion in public life
//   207, 208 — Democratic-authoritarian battery
//   209, 210 — Direct ZS / ONT_H probes
//   213      — Equal moral standing within the polity (within-scope MOR
//              universalism — disambiguates civic-nationalist universalists
//              from cosmopolitans where Q103 scope-only conflates them)
//   211, 212 — Metadata (strategic voting, negative partisanship)
/**
 * @deprecated Pre-Salience-Router 32-question opener. Replaced by
 * `SALIENCE_ROUTER_FIXED` (15 questions) on 2026-04-27. Retained ONLY for
 * historical diagnostic scripts that import it directly. Live path no
 * longer references this constant.
 */
export const LEGACY_FIXED_OPENER: readonly number[] = [
  200, 103, 97, 60, 89, 217, 22, 201, 84, 11, 218, 1,
  93, 99, 101, 15, 27, 30, 33,
  202, 214, 203, 204, 205, 206, 207, 208, 209, 210, 213,
  211, 212,
] as const;


// ──────────────────────────────────────────────────────────────────────────────
// Salience-Router architecture (Phase 1, 2026-04-27)
// ──────────────────────────────────────────────────────────────────────────────
//
// Replaces the 32-question FIXED_OPENER with a two-tier fixed front door
// (15 questions) followed by salience-gated top-K drilling and EIG-fill.
//
// Design principle: discover what's salient first, then spend question budget
// on the nodes the respondent actually cares about. Low-salience nodes get one
// rough position read via universal screeners and nothing further.
//
// CORE_OPENER (10) — establish salience for every node, capture metadata.
// UNIVERSAL_SCREENERS (5) — give every major node ≥ 1 light position read,
//                           even when its salience is zero.
// After fixed phase, selector enters TOP_K_DRILL → EIG_FILL phases (see
// browser/api.ts:getNextQuestion + engine/selectorEIG.ts).
//
// Items deliberately excluded from fixed and queued as conditional/adaptive:
//   - Q4 (cultural_social_salience): conditional on uncertain CD/CU/MOR sal.
//   - Q98 (group_solidarity): adaptive if TRB / identity-primary risk is high.
//   - Q101 (cultural_social_placement_dual): pending rewrite (omnibus social-
//          direction question conflates abortion / LGBT / trans / religion).
//   - Q217 (epistemic_style_ranking): redundant with Q89 + Q22.
//   - Q201 (patriotism + institutional trust): salience aspect covered by
//          Q103; institutional-trust position via Q214.

export const CORE_OPENER: readonly number[] = [
  200, // party identification — partyID metadata for election compute
  103, // issue salience screener — global salience router (priorityBattery)
  97,  // political thought frequency — PF / ENG activation
  1,   // political content frequency — ENG activation reinforcement
  60,  // politically important identities — TRB anchor
  89,  // epistemic style battery — EPS category + salience
  22,  // source trust conflict — EPS tie-breaker
  218, // aesthetic style ranking — AES category + salience
  211, // strategic voting — vote-prediction metadata
  212, // negative partisanship — vote-prediction metadata
] as const;

export const UNIVERSAL_SCREENERS: readonly number[] = [
  93,  // priority sort opener — broad MAT/CD/CU/MOR/PRO/COM position+salience
  102, // membership criteria priority sort — civic-nationality screen,
       //                                     touches CU/MOR/TRB/CD/MAT/ZS/PRO
  209, // zero-sum economics view — direct ZS position read
  210, // human malleability view — direct ONT_H position read
  214, // institutions foundational — direct ONT_S position read
] as const;

// Combined list — used by getNextQuestion to iterate the fixed front door
// in order. CORE first (establish salience + metadata), then UNIVERSAL
// (give every node a light position read regardless of salience).
export const SALIENCE_ROUTER_FIXED: readonly number[] = [
  ...CORE_OPENER,
  ...UNIVERSAL_SCREENERS,
] as const;

// Threshold for counting a question's position-touch toward a node's drill
// quota. Side-touches (e.g., Q102's weight=0.10 MAT touch) are below this
// floor and DO NOT count as meaningful drilling — the user explicitly
// flagged this as a quota-gaming vector.
export const MEANINGFUL_POSITION_WEIGHT: number = 0.4;

// Salience floor for top-K drilling and for position-question eligibility.
// Below this, a node's position is not interrogated past the universal-screener
// pass. Nodes Q103 ruled out (salDist[0] ≥ 0.5) remain ineligible regardless.
export const POSITION_DRILL_SAL_FLOOR: number = 1.5;

// Minimum meaningful position touches required per top-K drilled node before
// entering EIG_FILL phase. Top-K cap: 4. Non-top-K cap: 3.
export const MIN_POSITION_TOUCHES_PER_TOP_K: number = 2;
export const MAX_POSITION_TOUCHES_TOP_K: number = 4;
export const MAX_POSITION_TOUCHES_NON_TOP_K: number = 3;

// Top-K identification: take top-2 by expectedSal. If 3rd-place is within
// CLOSE_THRESHOLD of 2nd-place, include as top-3. Nodes below
// POSITION_DRILL_SAL_FLOOR are excluded from top-K regardless of rank.
export const TOP_K_BASE: number = 2;
export const TOP_K_CLOSE_THRESHOLD: number = 0.3;

/**
 * `FIXED_OPENER` is a backward-compatible alias for `SALIENCE_ROUTER_FIXED`.
 * Several diagnostic / eval scripts import `FIXED_OPENER` directly; the alias
 * keeps them compiling without forcing a wide refactor. New code should import
 * `SALIENCE_ROUTER_FIXED` (or one of its components, `CORE_OPENER` /
 * `UNIVERSAL_SCREENERS`) explicitly.
 *
 * The pre-Salience-Router 32-question opener is preserved as
 * `LEGACY_FIXED_OPENER` for historical reference / diagnostic comparison.
 */
export const FIXED_OPENER: readonly number[] = SALIENCE_ROUTER_FIXED;

/** @deprecated Kept as alias during EIG selector migration. Use SALIENCE_ROUTER_FIXED. */
export const FIXED_16: readonly number[] = SALIENCE_ROUTER_FIXED;
