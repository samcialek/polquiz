/**
 * Dynamic Election Activation System
 *
 * Three-layer activation model for historical election simulation:
 * 1. Zeitgeist — macro background conditions affecting all voters
 * 2. Issue Landscape — what the election is actually about
 * 3. Candidate Activation — who's pulling new voters in or repelling them
 *
 * These layers combine to:
 * - Modify which nodes matter most in each election's distance calculation
 * - Determine dynamic turnout (who votes vs abstains per election)
 * - Fix margin accuracy, third-party bloat, and landslide compression
 */
// ── Computation Helpers ──────────────────────────────────────────────────────
const ALL_CONTINUOUS_NODES = [
    "MAT", "CD", "CU", "MOR", "PRO", "COM", "ZS",
    "ONT_H", "ONT_S", "PF", "TRB", "ENG",
];
/**
 * Compute the combined node weight for a given node in a given election.
 * = zeitgeist.nodeWeights[node] × issueLandscapeMultiplier[node]
 */
export function getNodeWeight(ctx, node) {
    const zeitWeight = ctx.zeitgeist.nodeWeights[node] ?? 1.0;
    let issueWeight = 1.0;
    if (ctx.issueLandscape.primaryAxis.includes(node)) {
        issueWeight = 1.5;
    }
    else if (ctx.issueLandscape.dormant.includes(node)) {
        issueWeight = 0.5;
    }
    // secondaryAxis = 1.0 (default)
    return zeitWeight * issueWeight;
}
/**
 * Get all node weights as a record for an election.
 */
export function getAllNodeWeights(ctx) {
    const weights = {};
    for (const node of ALL_CONTINUOUS_NODES) {
        weights[node] = getNodeWeight(ctx, node);
    }
    return weights;
}
/**
 * Compute turnout probability for an archetype in a given election.
 *
 * Formula:
 *   baseENG = sigmoid(ENG_position)  → 0.1 to 0.95
 *   activationOverlap = how much the election's hot nodes match archetype's high-salience nodes
 *   candidateResonance = max alignment score across candidates (modified by activation)
 *   noveltyBoost = best candidate's novelty factor for matching archetypes
 *
 *   turnoutScore = baseENG × intensity × (1 + activationOverlap) × (1 + noveltyBoost)
 *   turnoutProbability = clamp(turnoutScore, 0, 1)
 */
export function computeTurnoutProbability(engPos, archSaliences, ctx, bestCandidateResonance) {
    // Base engagement: sigmoid mapping of ENG position
    // ENG=1 → ~0.15, ENG=2 → ~0.35, ENG=3 → ~0.55, ENG=4 → ~0.75, ENG=5 → ~0.90
    const baseENG = 1 / (1 + Math.exp(-1.2 * (engPos - 2.8)));
    // Activation overlap: how much do the election's activated nodes
    // match this archetype's high-salience nodes?
    let activationOverlap = 0;
    for (const node of ALL_CONTINUOUS_NODES) {
        if (node === "ENG")
            continue;
        const electionWeight = getNodeWeight(ctx, node);
        const archSal = archSaliences[node] ?? 0;
        if (electionWeight > 1.0 && archSal >= 2) {
            // This election activates a node this archetype cares about
            activationOverlap += (electionWeight - 1.0) * (archSal / 5) * 0.15;
        }
    }
    // Candidate novelty boost: if a novel candidate speaks to your concerns
    let noveltyBoost = 0;
    for (const ca of ctx.candidateActivations) {
        let matchScore = 0;
        for (const [node, mult] of Object.entries(ca.activationNodes)) {
            const archSal = archSaliences[node] ?? 0;
            if (mult > 1.0 && archSal >= 2) {
                matchScore += (mult - 1.0) * (archSal / 5);
            }
        }
        const boost = matchScore * (ca.novelty - 1.0) * 0.3;
        noveltyBoost = Math.max(noveltyBoost, boost);
    }
    // Threat activation: does a scary candidate motivate you to show up against them?
    let threatBoost = 0;
    for (const ca of ctx.candidateActivations) {
        if (!ca.threatActivation)
            continue;
        let threatScore = 0;
        for (const [node, mult] of Object.entries(ca.threatActivation)) {
            const archSal = archSaliences[node] ?? 0;
            if (mult > 1.0 && archSal >= 2) {
                threatScore += (mult - 1.0) * (archSal / 5);
            }
        }
        threatBoost = Math.max(threatBoost, threatScore * 0.2);
    }
    // Combine
    // candidateResonance ranges 0-1: how well the best candidate matches this archetype
    // At low resonance (no candidate fits), multiply by 0.3 → even ENG=5 can abstain
    // At high resonance, multiply by 1.0 → engaged archetypes always vote
    const resonanceFactor = 0.3 + 0.7 * bestCandidateResonance;
    const turnoutScore = baseENG
        * ctx.zeitgeist.intensity
        * (1 + activationOverlap)
        * (1 + noveltyBoost)
        * (1 + threatBoost)
        * resonanceFactor;
    return Math.min(Math.max(turnoutScore, 0), 1);
}
//# sourceMappingURL=activation.js.map