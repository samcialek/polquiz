/**
 * PRISM Electorate Simulator — engine.
 *
 * Takes a population of WeightedAgents (each carrying posterior PRISM
 * signature samples + survey weight) and an election year. Runs each
 * sample through respondentVoteChoice, aggregates with weights, returns
 * a full ElectorateSimulationResult.
 *
 * Per-agent contribution: weight is split evenly across that agent's
 * signature samples. So an agent with weight=100 and 4 samples splits
 * 25 weight per sample. Abstain decisions count toward the abstainer
 * weight pool. Vote decisions accumulate toward the chosen candidate.
 *
 * This module does NOT do:
 *   - survey-to-PRISM mapping (workstream A's job)
 *   - geographic projection (workstream B's job)
 *   - coalition decomposition (C2)
 *   - dashboard rendering (C5)
 * It IS the simulator core that those other modules feed into / consume.
 */

import { ELECTIONS } from "../historical/candidates.js";
import { getContext } from "../historical/contexts.js";
import { predictVote } from "../historical/respondentVoteChoice.js";
import type {
  WeightedAgent,
  ElectorateSimulationInput,
  ElectorateSimulationResult,
  CandidateOutcome,
  PartyBuckets,
  PerAgentResult,
} from "./types.js";

function partyBucket(party: string): "D" | "R" | "T" | "O" {
  if (party === "Democratic" || party === "Democratic-Republican") return "D";
  if (party === "Republican" || party === "Whig" || party === "Federalist") return "R";
  if (party === "Independent" || party === "American Independent" || party === "Dixiecrat") return "T";
  return "O";
}

function emptyParty(): PartyBuckets {
  const z = { weightedVotes: 0, voteShare: 0, voteShareOfTurnout: 0 };
  return { D: { ...z }, R: { ...z }, T: { ...z }, O: { ...z } };
}

export function simulateElectorate(input: ElectorateSimulationInput): ElectorateSimulationResult {
  const election = ELECTIONS.find(e => e.year === input.year);
  if (!election) throw new Error(`No election data for year ${input.year}`);
  const ctx = getContext(input.year);
  if (!ctx) throw new Error(`No election context for year ${input.year}`);

  const includePerAgent = input.config?.includePerAgent !== false;
  const maxSamples = input.config?.maxSamplesPerAgent;

  let totalWeight = 0;
  let totalSamples = 0;
  let abstainWeight = 0;
  const candidateVoteWeight: Record<string, number> = {};
  const partyVoteWeight: Record<"D" | "R" | "T" | "O", number> = { D: 0, R: 0, T: 0, O: 0 };
  const perAgent: PerAgentResult[] = [];
  const sourceCounts: Record<string, number> = {};
  let totalSamplesUsedAcrossAgents = 0;

  for (const agent of input.agents) {
    if (agent.electionYear !== input.year) continue;
    if (agent.weight <= 0) continue;
    if (!agent.signatureSamples?.length) continue;

    sourceCounts[agent.source] = (sourceCounts[agent.source] || 0) + 1;
    totalWeight += agent.weight;

    const samplesToUse = maxSamples
      ? agent.signatureSamples.slice(0, maxSamples)
      : agent.signatureSamples;
    const N = samplesToUse.length;
    const sampleWeight = agent.weight / N;
    totalSamples += N;
    totalSamplesUsedAcrossAgents += N;

    const voteDistribution: Record<string, number> = {};
    let abstainCount = 0;

    for (const sig of samplesToUse) {
      const pred = predictVote(
        sig,
        election.candidates,
        ctx,
        agent.engagement,
        agent.partyID ?? null,
        agent.anchorDist ?? null,
        agent.negativeParties ?? null,
        agent.strategicVoting ?? false,
        agent.dominantNode ?? null,
        agent.morBoundariesState ?? null,
      );

      if (pred.decision === "abstain") {
        abstainWeight += sampleWeight;
        abstainCount += 1;
      } else {
        const name = pred.nearest.name;
        candidateVoteWeight[name] = (candidateVoteWeight[name] || 0) + sampleWeight;
        partyVoteWeight[partyBucket(pred.nearest.party)] += sampleWeight;
        voteDistribution[name] = (voteDistribution[name] || 0) + 1 / N;
      }
    }

    if (includePerAgent) {
      perAgent.push({
        id: agent.id,
        weight: agent.weight,
        voteDistribution,
        abstainShare: abstainCount / N,
      });
    }
  }

  const turnoutWeight = totalWeight - abstainWeight;
  const turnoutRate = totalWeight > 0 ? turnoutWeight / totalWeight : 0;

  const byCandidate: CandidateOutcome[] = election.candidates.map(c => {
    const w = candidateVoteWeight[c.name] || 0;
    return {
      name: c.name,
      party: c.party,
      weightedVotes: w,
      voteShare: totalWeight > 0 ? w / totalWeight : 0,
      voteShareOfTurnout: turnoutWeight > 0 ? w / turnoutWeight : 0,
    };
  });

  const byParty = emptyParty();
  for (const k of ["D", "R", "T", "O"] as const) {
    const w = partyVoteWeight[k];
    byParty[k] = {
      weightedVotes: w,
      voteShare: totalWeight > 0 ? w / totalWeight : 0,
      voteShareOfTurnout: turnoutWeight > 0 ? w / turnoutWeight : 0,
    };
  }

  const totalAgentsCounted = Object.values(sourceCounts).reduce((s, n) => s + n, 0);
  return {
    year: input.year,
    totalAgents: totalAgentsCounted,
    totalSamples,
    totalWeight,
    turnoutWeight,
    turnoutRate,
    byCandidate,
    byParty,
    abstain: {
      weightedAbstainers: abstainWeight,
      abstainRate: totalWeight > 0 ? abstainWeight / totalWeight : 0,
    },
    ...(includePerAgent ? { perAgent } : {}),
    meta: {
      sourceCounts,
      avgSamplesPerAgent: totalAgentsCounted > 0 ? totalSamplesUsedAcrossAgents / totalAgentsCounted : 0,
      runAt: new Date().toISOString(),
    },
  };
}
