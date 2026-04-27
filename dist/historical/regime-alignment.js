/**
 * Regime Alignment Score (-3 to +3)
 *
 * Based on Sam's original PRISM alignment formula:
 *   support = 100 × exp(-(distance / σ)²)      // Gaussian decay
 *   alignment = (support / 50 - 1) × 3          // Maps 0-100 → -3 to +3
 *
 * Era mechanism (aligned with respondentVoteChoice.ts):
 *   effectiveSal = archetype_sal × getActivationMultiplier(year, node)
 *   where the multiplier is 1 / 2 / 3 per era-activations.json.
 * Prior dense-vector eraWeight + 60/40 blend removed; activation-multiplier
 * is the sole era mechanism.
 *
 * - ENG is NOT used — engagement is emergent from alignment, not a trait
 * - Gaussian decay — near-agreement = high support, far = ~zero
 * - Continuous output, converted to turnout probability via sigmoid
 */
import { getActivationMultiplier } from "./era-activations.js";
const CONTINUOUS_NODES = [
    "MAT", "CD", "CU", "MOR", "PRO", "COM", "ZS",
    "ONT_H", "ONT_S", "PF", "TRB", "ENG",
];
// Gaussian σ parameter (controls how sharply distance kills support)
const GAUSSIAN_SIGMA = 2.9; // σ=2.9 — balanced for winner accuracy
/**
 * Compute salience-weighted distance between archetype and candidate,
 * using refracted salience (era-adjusted).
 */
function computeWeightedDistance(arch, cand, ctx) {
    let weightedSumSq = 0;
    let totalWeight = 0;
    for (const node of CONTINUOUS_NODES) {
        if (node === "ENG")
            continue; // ENG is not a scoring dimension
        const tmpl = arch.nodes[node];
        if (!tmpl || tmpl.kind !== "continuous")
            continue;
        const ct = tmpl;
        const archPos = ct.pos;
        const archSal = ct.sal ?? 0; // 0-3; undefined for SELF-cluster (ADR-005)
        const candPos = cand[node];
        if (candPos == null)
            continue;
        // Era activation multiplier: 3 if node super-activated for this year,
        // 2 if activated, 1 otherwise. See era-activations.ts / .json.
        const effectiveSal = archSal * getActivationMultiplier(ctx.year, node);
        // Anti-position penalty: if archetype has anti marker and candidate violates it,
        // amplify the distance
        let antiMultiplier = 1.0;
        if (ct.anti) {
            const diff = Math.abs(archPos - candPos);
            if (diff >= 3)
                antiMultiplier = 1.3;
            else if (diff >= 2)
                antiMultiplier = 1.1;
        }
        const posDiff = Math.abs(archPos - candPos) * antiMultiplier;
        weightedSumSq += effectiveSal * posDiff * posDiff;
        totalWeight += effectiveSal;
    }
    // Normalized distance (RMS-like, weighted by salience)
    const distance = totalWeight > 0
        ? Math.sqrt(weightedSumSq / totalWeight)
        : 4; // Max distance if no nodes
    return { distance, maxDistance: 4 };
}
/**
 * Compute alignment score for archetype with a specific candidate.
 * Returns -3 to +3.
 *
 * Formula:
 *   support = 100 × exp(-(distance / σ)²)
 *   alignment = (support / 50 - 1) × 3
 */
function computeCandidateAlignment(arch, cand, ctx) {
    const { distance } = computeWeightedDistance(arch, cand, ctx);
    // Gaussian support: distance=0 → 100, distance=σ → 37, distance=2σ → 2
    const support = 100 * Math.exp(-Math.pow(distance / GAUSSIAN_SIGMA, 2));
    // Map to -3 to +3: support=100 → +3, support=50 → 0, support=0 → -3
    const alignment = (support / 50 - 1) * 3;
    return Math.max(-3, Math.min(3, alignment));
}
/**
 * Compute regime alignment: best alignment across all candidates.
 * This is how aligned you are with the BEST option available.
 */
export function computeRegimeAlignment(arch, candidates, ctx) {
    let bestAlignment = -3;
    let bestCandidate = "";
    for (const cand of candidates) {
        const a = computeCandidateAlignment(arch, cand, ctx);
        if (a > bestAlignment) {
            bestAlignment = a;
            bestCandidate = cand.name;
        }
    }
    return {
        alignment: bestAlignment,
        bestCandidate,
        bestScore: bestAlignment,
    };
}
/**
 * Convert regime alignment score to turnout probability.
 *
 * -3 → ~5%   (totally alienated, no point voting)
 * -2 → ~15%
 * -1 → ~30%
 *  0 → ~50%  (coin flip)
 * +1 → ~70%
 * +2 → ~85%
 * +3 → ~95%  (maximally motivated)
 */
export function alignmentToTurnout(alignment, intensity = 1.0) {
    // Intensity scales the alignment — high-intensity elections amplify engagement
    const adjusted = alignment * intensity;
    return 1 / (1 + Math.exp(-1.2 * adjusted));
}
/**
 * Full turnout decision for an archetype in an election.
 * ENG is NOT used — turnout emerges from alignment + context.
 */
export function computeTurnoutFromAlignment(arch, candidates, ctx) {
    const { alignment } = computeRegimeAlignment(arch, candidates, ctx);
    const turnoutProb = alignmentToTurnout(alignment, ctx.zeitgeist.intensity);
    return {
        alignment,
        turnoutProbability: turnoutProb,
        votes: turnoutProb >= 0.5,
    };
}
/**
 * Gaussian vote choice: pick the candidate with the best alignment score.
 * Uses the same Gaussian distance formula as turnout, ensuring consistency.
 * Returns the best candidate name and alignment score.
 */
export function gaussianVoteChoice(arch, candidates, ctx) {
    const scores = {};
    let bestCandidate = "";
    let bestAlignment = -4;
    for (const cand of candidates) {
        const a = computeCandidateAlignment(arch, cand, ctx);
        scores[cand.name] = a;
        if (a > bestAlignment) {
            bestAlignment = a;
            bestCandidate = cand.name;
        }
    }
    return { bestCandidate, bestAlignment, scores };
}
//# sourceMappingURL=regime-alignment.js.map