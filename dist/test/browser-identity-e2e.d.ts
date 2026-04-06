/**
 * Layer 6 — Identity-Primary E2E verification.
 *
 * Drives a high-TRB/PF/ENG persona through the browser-bundled quiz,
 * but overrides Q60 (identity_ranking) to place the desired anchor at
 * rank 1, then calls PrismEngine.getIdentityPrimaryResult(demographics)
 * and verifies the expected identity overlay fires.
 *
 * Tests 6 identity overlays with correct demographics, plus negative cases.
 */
export {};
