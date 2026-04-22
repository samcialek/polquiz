/**
 * Fixed opener — these question IDs are always asked first, in order.
 *
 * Sequence (7 questions, varied formats, covers the ENDS+MEANS nodes directly
 * plus scenario-style probes for PF + TRB, categorical nodes, and TRB anchor):
 *   Q93 — priority_sort_opener (priority_sort; 12-item 3-bucket sort over
 *         MAT/CD/CU/MOR/PRO/COM × both poles — replaces the old Q93+Q94 pair)
 *   Q97 — political_thought_frequency (single_choice; PF pos + sal via thought-frequency)
 *   Q98 — group_solidarity_feeling (single_choice; TRB pos + sal via group solidarity)
 *   Q89 — epistemic_style_battery (best_worst; EPS category + salience)
 *   Q60 — politically_important_identities (ranking; TRB anchor)
 *   Q11 — nyt_headline_click (single_choice; EPS + AES category)
 *   Q1  — political_content_frequency (single_choice; ENG pos + sal)
 *
 * Q93 opens the quiz with a single 12-item priority-sort card-sort that covers
 * ENDS+MEANS in one shot (2026-04-21). It replaced the Q93+Q94 best_worst pair
 * because best_worst only extracts signal from the two extremes picked per
 * battery, whereas the card-sort extracts evidence from every placement.
 * Q97/Q98 replaced the old REALITY/SELF pole batteries (2026-04-21) because
 * the slogan-style poles read awkwardly for ZS / ONT_H / ONT_S / PF / TRB;
 * REALITY coverage now leans on the adaptive selector and existing bank
 * questions (zero_sum_politics_view, institutions_harden_into_domination, ...).
 * After the opener, the EIG selector drills position on nodes whose salience
 * posterior has crossed the active threshold (sal ≥ 2).
 */
export const FIXED_OPENER: readonly number[] = [93, 97, 98, 89, 60, 11, 1, 99, 100, 101, 102] as const;

/** @deprecated Kept as alias during EIG selector migration. Use FIXED_OPENER. */
export const FIXED_16: readonly number[] = FIXED_OPENER;
