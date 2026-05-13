/**
 * Layer 2 — Question sign & coverage audit.
 *
 * For each continuous node:
 *   - Count questions that touch it (position and/or salience)
 *   - For every option in every question, compute implied E[pos|option] from
 *     the likelihood distribution in optionEvidence/sliderMap/rankingMap/
 *     allocationMap. Flag anything where the "neutral balanced" answerer
 *     (uniform over options) drifts the posterior away from the neutral mean.
 *   - Highlight questions where every option points the SAME direction on a
 *     node — those would pull every respondent to one pole.
 *
 * Output: per-node summary + suspicious-question list for CU, TRB, ONT_S,
 * ONT_H, ZS (the nodes the user flagged as wrong or zero-salience).
 */
export {};
