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

// ── Node IDs ─────────────────────────────────────────────────────────────────

export type ContinuousNodeId = 
  | "MAT" | "CD" | "CU" | "MOR"     // ENDS
  | "PRO" | "COM" | "ZS"             // MEANS (continuous)
  | "ONT_H" | "ONT_S"                // REALITY
  | "PF" | "TRB" | "ENG";            // SELF

export type NodeId = ContinuousNodeId | "EPS" | "AES";

// ── Layer 1: Zeitgeist ───────────────────────────────────────────────────────

export type Era =
  | "founding"       // 1789-1815: new republic, constitutional debates
  | "good-feelings"  // 1816-1824: one-party era, national unity
  | "jacksonian"     // 1828-1852: mass democracy, expansion, slavery emerging
  | "sectional"      // 1856-1860: slavery crisis, party realignment
  | "civil-war"      // 1864-1868: wartime, reconstruction begins
  | "reconstruction"  // 1872-1876: rebuilding, freedmen's rights
  | "gilded"         // 1880-1892: patronage, tariffs, industrialization
  | "progressive"    // 1896-1916: reform movements, populism, imperialism
  | "normalcy"       // 1920-1928: post-war retreat, prosperity
  | "new-deal"       // 1932-1948: depression, WWII, welfare state
  | "consensus"      // 1952-1960: Cold War bipartisanship, suburbia
  | "upheaval"       // 1964-1976: civil rights, Vietnam, Watergate
  | "reagan"         // 1980-1992: conservative revolution, Cold War end
  | "third-way"      // 1996-2004: centrism, culture wars emerging
  | "polarization";  // 2008-2024: financial crisis → hyperpolarization

export interface Zeitgeist {
  /** Which era this election belongs to */
  era: Era;

  /** 
   * Node salience multipliers (default 1.0 for unspecified nodes).
   * These modify how much each node matters in the distance calculation.
   * e.g., {MAT: 2.0} means economic concerns are twice as important.
   */
  nodeWeights: Partial<Record<ContinuousNodeId, number>>;

  /**
   * Base turnout pressure: how "important" does this election feel?
   * 1.0 = normal, 1.3 = high-stakes/crisis, 0.7 = low-interest/fatigue
   * Affects the overall probability that any archetype votes.
   */
  intensity: number;

  /** Brief description of what's driving the zeitgeist */
  description: string;
}

// ── Layer 2: Issue Landscape ─────────────────────────────────────────────────

export interface IssueLandscape {
  /**
   * Primary axis of conflict — the 2-3 nodes that define what this 
   * election is "about." Gets 1.5× weight in distance calculation.
   */
  primaryAxis: ContinuousNodeId[];

  /**
   * Secondary issues — present in the campaign but not dominant.
   * Gets 1.0× weight (no modification).
   */
  secondaryAxis: ContinuousNodeId[];

  /**
   * Dormant nodes — bipartisan consensus, irrelevant, or actively 
   * suppressed. Gets 0.5× weight.
   */
  dormant: ContinuousNodeId[];

  /** Brief description of the issue landscape */
  description: string;
}

// ── Layer 3: Candidate Activation ────────────────────────────────────────────

export interface CandidateActivation {
  /** Must match a candidate name in the election */
  candidateName: string;

  /**
   * Which archetype traits does this candidate uniquely energize?
   * Archetypes with high salience on these nodes get a turnout boost.
   * Values > 1.0 = activating, < 1.0 = suppressing.
   */
  activationNodes: Partial<Record<ContinuousNodeId, number>>;

  /**
   * Novelty factor — how "new" or transformational does this candidate feel?
   * 1.0 = conventional politician, 1.5 = fresh face, 1.8 = once-in-a-generation
   * High novelty = can pull in disengaged voters who normally abstain.
   */
  novelty: number;

  /**
   * Negative activation — does this candidate repel people into voting AGAINST?
   * e.g., Goldwater 1964 activated Democratic turnout through fear.
   * Archetypes with high salience on these nodes get a turnout boost
   * to vote for the OTHER candidate.
   */
  threatActivation?: Partial<Record<ContinuousNodeId, number>>;
}

// ── Combined Election Context ────────────────────────────────────────────────

export interface ElectionContext {
  year: number;
  zeitgeist: Zeitgeist;
  issueLandscape: IssueLandscape;
  candidateActivations: CandidateActivation[];
}

// ── Computation Helpers ──────────────────────────────────────────────────────

const ALL_CONTINUOUS_NODES: ContinuousNodeId[] = [
  "MAT", "CD", "CU", "MOR", "PRO", "COM", "ZS",
  "ONT_H", "ONT_S", "PF", "TRB", "ENG",
];

/**
 * Compute the combined node weight for a given node in a given election.
 * = zeitgeist.nodeWeights[node] × issueLandscapeMultiplier[node]
 */
export function getNodeWeight(ctx: ElectionContext, node: ContinuousNodeId): number {
  const zeitWeight = ctx.zeitgeist.nodeWeights[node] ?? 1.0;

  let issueWeight = 1.0;
  if (ctx.issueLandscape.primaryAxis.includes(node)) {
    issueWeight = 1.5;
  } else if (ctx.issueLandscape.dormant.includes(node)) {
    issueWeight = 0.5;
  }
  // secondaryAxis = 1.0 (default)

  return zeitWeight * issueWeight;
}

/**
 * Get all node weights as a record for an election.
 */
export function getAllNodeWeights(ctx: ElectionContext): Record<ContinuousNodeId, number> {
  const weights: Record<string, number> = {};
  for (const node of ALL_CONTINUOUS_NODES) {
    weights[node] = getNodeWeight(ctx, node);
  }
  return weights as Record<ContinuousNodeId, number>;
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
export function computeTurnoutProbability(
  engPos: number,
  archSaliences: Record<string, number>,
  ctx: ElectionContext,
  bestCandidateResonance: number,
): number {
  // Base engagement: sigmoid mapping of ENG position
  // ENG=1 → ~0.15, ENG=2 → ~0.35, ENG=3 → ~0.55, ENG=4 → ~0.75, ENG=5 → ~0.90
  const baseENG = 1 / (1 + Math.exp(-1.2 * (engPos - 2.8)));

  // Activation overlap: how much do the election's activated nodes
  // match this archetype's high-salience nodes?
  let activationOverlap = 0;
  for (const node of ALL_CONTINUOUS_NODES) {
    if (node === "ENG") continue;
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
      if ((mult as number) > 1.0 && archSal >= 2) {
        matchScore += ((mult as number) - 1.0) * (archSal / 5);
      }
    }
    const boost = matchScore * (ca.novelty - 1.0) * 0.3;
    noveltyBoost = Math.max(noveltyBoost, boost);
  }

  // Threat activation: does a scary candidate motivate you to show up against them?
  let threatBoost = 0;
  for (const ca of ctx.candidateActivations) {
    if (!ca.threatActivation) continue;
    let threatScore = 0;
    for (const [node, mult] of Object.entries(ca.threatActivation)) {
      const archSal = archSaliences[node] ?? 0;
      if ((mult as number) > 1.0 && archSal >= 2) {
        threatScore += ((mult as number) - 1.0) * (archSal / 5);
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
