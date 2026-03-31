// Node weight normalization factors
// Updated 2026-03-28 — capped to [0.65, 1.65] range per ChatGPT audit
// Rationale: 2.02x was too aggressive for thinly-measured nodes (ZS, MOR),
// amplifying noise. Capped range avoids noisy dominance while still boosting
// under-represented nodes. Will retune from live confusion data post-beta.
// Note: 5 new discriminator questions (81-85) added, improving coverage on
// PF, CD, CU, ZS, ONT_H, TRB, ENG — factors should be recomputed after beta.
export const NODE_NORM_FACTORS = {
    MAT: 0.80, // was 0.781 → clamped up to 0.80
    CD: 1.65, // was 1.870 → capped at 1.65
    CU: 1.60, // was 1.603 → kept ~same
    MOR: 1.65, // was 2.020 → capped at 1.65 (was over-amplifying sparse signal)
    PRO: 0.65, // was 0.580 → clamped up to 0.65
    COM: 0.98, // was 0.981 → kept ~same
    ZS: 1.65, // was 2.020 → capped at 1.65 (was over-amplifying sparse signal)
    ONT_H: 0.88, // was 0.878 → kept ~same
    ONT_S: 1.17, // was 1.174 → kept ~same
    PF: 1.30, // was 1.161 → boosted (PF-position was dangerously thin)
    TRB: 0.77, // was 0.765 → kept ~same
    ENG: 1.25, // was 1.153 → boosted (ENG had lowest total coverage at 3.63)
    EPS: 0.65, // was 0.596 → clamped up to 0.65
    AES: 0.89, // was 0.889 → kept ~same
};
// Usage in scorer:
// effectiveWeight = rawWeight * NODE_NORM_FACTORS[nodeId]
// This ensures that a question touching MOR with weight 0.5
// has equivalent influence to a question touching PRO with weight 0.5,
// despite PRO having 3.5x more total questions.
//
// Post-beta: recompute from live confusion matrices, not just question counts.
//# sourceMappingURL=normalization.js.map