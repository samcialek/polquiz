/**
 * Comprehensive question signal audit.
 *
 * For every question in the representative bank:
 *   1. Cross-check touchProfile declarations against actual evidence maps.
 *      Flag:
 *        - "declared-unused": touchProfile says node is touched but no evidence
 *          map emits anything for it.
 *        - "unused-declared": evidence present but not declared in touchProfile.
 *   2. Compute signal strength per (question × node × role):
 *        - POSITION strength = KL divergence of best option's likelihood
 *          distribution from uniform [0.2,0.2,0.2,0.2,0.2]. 0 = flat (no info).
 *        - SALIENCE strength = KL divergence of best option's sal-likelihood
 *          from uniform [0.25, 0.25, 0.25, 0.25].
 *        - RANGE = difference between max and min E[pos] across options on the
 *          same node (tells us how discriminating the question is).
 *   3. Per-node coverage report:
 *        - Count questions carrying POSITION evidence vs SALIENCE evidence
 *        - Flag nodes with <5 position-emitting questions or <5 salience
 *          emitting questions
 *   4. Per-question "missing salience" report — single_choice and similar
 *      questions that touch a node for position but don't carry salience
 *      evidence on the same node (common pattern — every question ASKING
 *      about a node is implicit salience evidence).
 */
export {};
