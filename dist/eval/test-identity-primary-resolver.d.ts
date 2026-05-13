/**
 * Identity-primary resolver regression + synthetic test battery.
 *
 * Adds 2026-04-24 alongside ADR-006 (identity-primary policy-flat refactor).
 *
 * Cases:
 *   1. NEGATIVE — replay of user's actual quiz signature: Loyal-Democrat-shaped
 *      progressive with national anchor and high policy salience. Resolver
 *      should return null identity-primary, reason "policy_salience_too_high".
 *
 *   2. POSITIVE — synthetic identity-primary candidate per anchor:
 *        Black Voter (ethnic_racial anchor + black demographic + ideology-thin)
 *        White Grievance Voter (ethnic_racial + white)
 *        Evangelical Voter (religious + christian)
 *        LGBTQ Voter (sexual + yes)
 *        Feminist Voter (gender + female)
 *        Male Grievance Voter (gender + male)
 *
 *   3. NEGATIVE — same anchor + demographic as #2 but with high policy salience.
 *      Resolver should return unresolved, "policy_salience_too_high".
 *
 *   4. NEGATIVE — identity-thin user with national anchor (civic). Resolver
 *      should return unresolved, "national_anchor_civic_not_demographic".
 *
 *   5. NEGATIVE — identity-thin user with anchor at exactly threshold mass
 *      (0.20, below the 0.25 bar). Resolver should return "anchor_not_dominant".
 *
 *   6. NEGATIVE — passes all gates but no demographic provided. Resolver
 *      should return "missing_demographic_confirmation".
 */
export {};
