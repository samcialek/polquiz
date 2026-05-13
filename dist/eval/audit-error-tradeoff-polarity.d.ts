/**
 * Polarity audit for error-tradeoff questions (Q25, Q27, Q30, Q33).
 *
 * Walks each option and computes implied E[pos] per touched node, then
 * compares to the human-readable semantic intent of that option. Flags
 * any case where the math direction contradicts the option's meaning —
 * the kind of bug the cross-LLM analysis worried about.
 *
 * For each option, we encode the EXPECTED direction (pos high vs pos low)
 * for every node it touches and check the actual likelihood matches.
 */
export {};
