/**
 * Coalition decomposition over an ElectorateSimulationResult.
 *
 * Joins per-agent results back to the originating WeightedAgent list (by id),
 * tags each agent into one or more demographic subgroups, then aggregates
 * weighted vote shares per subgroup.
 *
 * The decomposition is the load-bearing diagnostic for the electorate
 * simulator (per the master plan): if the model reproduces the right
 * coalition shape, it captures structural realignment even when popular-
 * vote precision is imperfect. If it gets popular vote right with the
 * wrong coalition shape, that's a coincidence and the model is overfit.
 *
 * This module does NOT compute the pass/fail gate (that's C3) — it just
 * produces the per-subgroup numbers that the gate consumes.
 */

import type {
  ElectorateSimulationResult,
  WeightedAgent,
  PartyBuckets,
  PerAgentResult,
  AgentDemographics,
} from "./types.js";

export interface CoalitionShare {
  /** Subgroup tag, e.g. "race:white" or "white-college" or "state:PA". */
  subgroup: string;
  /** Total population weight in this subgroup. */
  weightedSize: number;
  /** Weighted turnout (subgroup weight × (1 - mean abstention)). */
  weightedTurnout: number;
  /** Subgroup weight as fraction of total electorate weight. */
  shareOfElectorate: number;
  /** Within this subgroup: turnout rate (1 - abstain). */
  turnoutRate: number;
  /** Within this subgroup: abstain rate. */
  abstainRate: number;
  /** Within this subgroup: weighted shares by party bucket. Each share is share-of-turnout. */
  byParty: PartyBuckets;
  /** Within this subgroup: share of turnout per candidate name. */
  byCandidate: Record<string, number>;
  /** Number of agents tagged into this subgroup. */
  agentCount: number;
}

export interface CoalitionDecompositionConfig {
  /**
   * Which subgroup tags to compute. If omitted, the default tagger generates
   * the standard exit-poll cells (race, education, age, gender, evangelical,
   * union, region, geography, state, plus compound white-college /
   * white-non-college).
   */
  subgroupTagger?: (agent: WeightedAgent) => string[];
  /** Drop subgroups with fewer than this many agents (default: 1). */
  minAgents?: number;
  /** Drop subgroups whose weight is below this fraction of total (default: 0). */
  minWeightShare?: number;
}

export interface CoalitionDecomposition {
  year: number;
  subgroups: CoalitionShare[];
  meta: {
    totalElectorateWeight: number;
    runAt: string;
    coverageNotes: string[];
  };
}

/**
 * Default subgroup tagger — produces the standard exit-poll-style cells.
 * An agent typically belongs to MULTIPLE subgroups simultaneously (a
 * 35-year-old Black college graduate from PA appears in race:Black, edu:college,
 * age:30-44, state:PA, etc.). Subgroups overlap on purpose.
 */
export function defaultSubgroupTagger(agent: WeightedAgent): string[] {
  const tags: string[] = [];
  const d: AgentDemographics | undefined = agent.demographics;
  if (!d) return tags;

  if (d.race) tags.push(`race:${d.race}`);
  if (d.education) tags.push(`edu:${d.education}`);
  // Compound education-by-race (the load-bearing realignment cell).
  if (d.race === "white" && d.education) {
    tags.push(d.education === "college" || d.education === "post-grad"
      ? "white-college"
      : "white-non-college");
  }
  if (d.ageGroup) tags.push(`age:${d.ageGroup}`);
  if (d.gender) tags.push(`gender:${d.gender}`);
  if (d.evangelical === true) tags.push("evangelical");
  if (d.union === true) tags.push("union");
  if (d.region) tags.push(`region:${d.region}`);
  if (d.geography) tags.push(`geo:${d.geography}`);
  if (d.state) tags.push(`state:${d.state}`);

  return tags;
}

function emptyParty(): PartyBuckets {
  const z = { weightedVotes: 0, voteShare: 0, voteShareOfTurnout: 0 };
  return { D: { ...z }, R: { ...z }, T: { ...z }, O: { ...z } };
}

function partyBucket(party: string): "D" | "R" | "T" | "O" {
  if (party === "Democratic" || party === "Democratic-Republican") return "D";
  if (party === "Republican" || party === "Whig" || party === "Federalist") return "R";
  if (party === "Independent" || party === "American Independent" || party === "Dixiecrat") return "T";
  return "O";
}

interface SubgroupAccumulator {
  weight: number;
  abstainWeight: number;
  candidateWeight: Record<string, number>; // by candidate name
  candidateParty: Record<string, string>;
  agentCount: number;
}

function newAccumulator(): SubgroupAccumulator {
  return { weight: 0, abstainWeight: 0, candidateWeight: {}, candidateParty: {}, agentCount: 0 };
}

export function decomposeByCoalition(
  result: ElectorateSimulationResult,
  agents: WeightedAgent[],
  config?: CoalitionDecompositionConfig,
): CoalitionDecomposition {
  if (!result.perAgent) {
    throw new Error(
      "decomposeByCoalition requires per-agent results. " +
      "Re-run the simulator with config.includePerAgent !== false.",
    );
  }

  const tagger = config?.subgroupTagger ?? defaultSubgroupTagger;
  const minAgents = config?.minAgents ?? 1;
  const minWeightShare = config?.minWeightShare ?? 0;

  // Index agents by id for quick join.
  const agentById = new Map<string, WeightedAgent>();
  for (const a of agents) agentById.set(a.id, a);

  // Map candidate name → party (for buckets), drawn from the simulator result.
  const candidatePartyByName = new Map<string, string>();
  for (const c of result.byCandidate) candidatePartyByName.set(c.name, c.party);

  const accumulators = new Map<string, SubgroupAccumulator>();
  let agentsWithoutTags = 0;
  let agentsWithoutDemographics = 0;
  let totalElectorateWeight = 0;

  for (const pa of result.perAgent) {
    const agent = agentById.get(pa.id);
    if (!agent) continue;
    if (!agent.demographics) agentsWithoutDemographics += 1;

    totalElectorateWeight += pa.weight;
    const tags = tagger(agent);
    if (tags.length === 0) { agentsWithoutTags += 1; continue; }

    const abstainWeightForAgent = pa.weight * pa.abstainShare;

    for (const tag of tags) {
      let acc = accumulators.get(tag);
      if (!acc) { acc = newAccumulator(); accumulators.set(tag, acc); }
      acc.weight += pa.weight;
      acc.abstainWeight += abstainWeightForAgent;
      acc.agentCount += 1;
      for (const [name, share] of Object.entries(pa.voteDistribution)) {
        const w = pa.weight * share;
        acc.candidateWeight[name] = (acc.candidateWeight[name] || 0) + w;
        if (!acc.candidateParty[name]) {
          const party = candidatePartyByName.get(name);
          if (party) acc.candidateParty[name] = party;
        }
      }
    }
  }

  const coverageNotes: string[] = [];
  if (agentsWithoutDemographics > 0) {
    const pctMissing = ((agentsWithoutDemographics / result.perAgent.length) * 100).toFixed(1);
    coverageNotes.push(
      `${agentsWithoutDemographics} of ${result.perAgent.length} agents (${pctMissing}%) had no demographics — excluded from all subgroups.`,
    );
  }
  if (agentsWithoutTags > 0 && agentsWithoutTags !== agentsWithoutDemographics) {
    const noTagOnly = agentsWithoutTags - agentsWithoutDemographics;
    coverageNotes.push(
      `${noTagOnly} additional agents had demographics but produced zero subgroup tags from the tagger.`,
    );
  }

  const subgroups: CoalitionShare[] = [];
  for (const [tag, acc] of accumulators) {
    if (acc.agentCount < minAgents) continue;
    const shareOfElectorate = totalElectorateWeight > 0 ? acc.weight / totalElectorateWeight : 0;
    if (shareOfElectorate < minWeightShare) continue;

    const turnoutWeight = acc.weight - acc.abstainWeight;
    const turnoutRate = acc.weight > 0 ? turnoutWeight / acc.weight : 0;
    const abstainRate = acc.weight > 0 ? acc.abstainWeight / acc.weight : 0;

    const byParty = emptyParty();
    for (const [name, w] of Object.entries(acc.candidateWeight)) {
      const party = acc.candidateParty[name] || "Unknown";
      const bucket = partyBucket(party);
      byParty[bucket].weightedVotes += w;
    }
    for (const k of ["D", "R", "T", "O"] as const) {
      const w = byParty[k].weightedVotes;
      byParty[k].voteShare = acc.weight > 0 ? w / acc.weight : 0;
      byParty[k].voteShareOfTurnout = turnoutWeight > 0 ? w / turnoutWeight : 0;
    }

    const byCandidate: Record<string, number> = {};
    for (const [name, w] of Object.entries(acc.candidateWeight)) {
      byCandidate[name] = turnoutWeight > 0 ? w / turnoutWeight : 0;
    }

    subgroups.push({
      subgroup: tag,
      weightedSize: acc.weight,
      weightedTurnout: turnoutWeight,
      shareOfElectorate,
      turnoutRate,
      abstainRate,
      byParty,
      byCandidate,
      agentCount: acc.agentCount,
    });
  }

  // Sort: largest subgroup first, ties broken alphabetically.
  subgroups.sort((a, b) => {
    if (b.weightedSize !== a.weightedSize) return b.weightedSize - a.weightedSize;
    return a.subgroup.localeCompare(b.subgroup);
  });

  return {
    year: result.year,
    subgroups,
    meta: {
      totalElectorateWeight,
      runAt: new Date().toISOString(),
      coverageNotes,
    },
  };
}
