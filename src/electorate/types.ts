/**
 * PRISM Electorate Simulator — core types.
 *
 * A WeightedAgent represents a single survey respondent (or other
 * population unit) carrying a posterior PRISM signature. The simulator
 * runs each agent's signature samples through respondentVoteChoice,
 * aggregates with the agent's population weight, and produces an
 * ElectorateSimulationResult.
 *
 * Design notes:
 * - signatureSamples is a list of NodeSignature draws representing
 *   measurement uncertainty. v0 callers may supply N=1 (point estimate);
 *   real CES/ANES integration will supply N=50–200.
 * - engagement, partyID, morBoundariesState are agent-level for v0 since
 *   CES typically delivers them as observed values, not as posteriors.
 * - demographics is opt-in, used by the coalition-decomposition module
 *   (C2) for subgroup breakdown. None of it affects predictVote directly.
 */

import type { NodeSignature } from "../engine/respondentSignature.js";
import type { EngagementLevel } from "../engine/engagementLabel.js";
import type { PartyID, TrbAnchorDist, MorBoundariesNodeState } from "../types.js";

/** Coarse demographic tags for coalition decomposition. All optional. */
export interface AgentDemographics {
  race?: "white" | "Black" | "Latino" | "Asian" | "AAPI" | "other" | "multi" | string;
  /** "non-college" or "college" or finer; coalition module reads "college" / "non-college". */
  education?: "non-college" | "college" | "post-grad" | string;
  ageGroup?: "18-29" | "30-44" | "45-64" | "65+";
  gender?: "M" | "F" | "X" | string;
  evangelical?: boolean;
  union?: boolean;
  region?: "Northeast" | "Midwest" | "South" | "West";
  geography?: "urban" | "suburban" | "rural";
  /** Two-letter US state code; needed for state-level aggregation. */
  state?: string;
  /** Free-form additional tags downstream consumers may want. */
  extra?: Record<string, unknown>;
}

export interface WeightedAgent {
  /** Unique within an input batch. CES respondent ID, archetype ID, or synthetic. */
  id: string;
  /** Year this agent is voting in. Must match ElectorateSimulationInput.year. */
  electionYear: number;
  /** Source label for provenance. CES, ANES, ARCHETYPE-STRAW, SYNTHETIC, etc. */
  source: string;
  /** Population weight (e.g., adults represented). Need not sum to anything in particular. */
  weight: number;
  /** Posterior PRISM signature draws. v0 commonly uses N=1; real surveys produce N=50+. */
  signatureSamples: NodeSignature[];
  /** Engagement level. Drives the abstention clearing-bar in respondentVoteChoice. */
  engagement: EngagementLevel;
  /** Self-reported party ID. Optional. */
  partyID?: PartyID | null;
  /** TRB anchor distribution. Optional. */
  anchorDist?: TrbAnchorDist | null;
  /** Set of party codes the respondent will never vote for ("never-Trump", etc.). */
  negativeParties?: Set<string> | null;
  /** Strategic / lesser-evil voter flag. */
  strategicVoting?: boolean;
  /** Highest-salience continuous node (for downstream weighting). Optional. */
  dominantNode?: string | null;
  /** Compound moral-circle module state. Optional. */
  morBoundariesState?: MorBoundariesNodeState | null;
  /** Demographics for coalition decomposition. None of it affects vote prediction. */
  demographics?: AgentDemographics;
}

export interface ElectorateSimulationInput {
  /** Election year to simulate. Agents whose electionYear !== year are skipped. */
  year: number;
  agents: WeightedAgent[];
  /** Optional config knobs. */
  config?: {
    /**
     * Cap on how many of each agent's signatureSamples to actually use.
     * Defaults to all available. Useful for fast smoke tests.
     */
    maxSamplesPerAgent?: number;
    /** RNG seed for any future stochastic logic. v0 uses none. */
    seed?: number;
    /** Include per-agent breakdown in the result. Default true; set false for very large runs. */
    includePerAgent?: boolean;
  };
}

export interface CandidateOutcome {
  name: string;
  party: string;
  weightedVotes: number;
  /** Share of total population weight. */
  voteShare: number;
  /** Share of weighted turnout (excludes abstainers). */
  voteShareOfTurnout: number;
}

export interface PartyBucket {
  weightedVotes: number;
  voteShare: number;
  voteShareOfTurnout: number;
}

export type PartyBuckets = {
  D: PartyBucket;
  R: PartyBucket;
  T: PartyBucket;
  O: PartyBucket;
};

export interface PerAgentResult {
  id: string;
  weight: number;
  /** Map of candidate name → share of N samples that picked them. */
  voteDistribution: Record<string, number>;
  /** Share of N samples that abstained. */
  abstainShare: number;
}

export interface ElectorateSimulationResult {
  year: number;
  totalAgents: number;
  /** Total samples actually evaluated (sum across all agents). */
  totalSamples: number;
  totalWeight: number;
  /** Total weight of agents who voted (1 - abstention). */
  turnoutWeight: number;
  turnoutRate: number;
  /** Per-candidate aggregation, ordered as in the source candidates.ts. */
  byCandidate: CandidateOutcome[];
  /** Aggregation by party bucket. */
  byParty: PartyBuckets;
  abstain: {
    weightedAbstainers: number;
    abstainRate: number;
  };
  /** Per-agent results (omitted if config.includePerAgent === false). */
  perAgent?: PerAgentResult[];
  /** Provenance metadata for the dashboard footer. */
  meta: {
    sourceCounts: Record<string, number>; // e.g., { CES: 50000, SYNTHETIC: 121 }
    avgSamplesPerAgent: number;
    runAt: string; // ISO timestamp
  };
}
