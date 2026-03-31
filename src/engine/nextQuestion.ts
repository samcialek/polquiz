import type {
  Archetype,
  CategoricalNodeId,
  ContinuousNodeId,
  NodeStatus,
  QuestionDef,
  RespondentState
} from "../types.js";
import { FIXED_16 } from "./config.js";
import { getConfig } from "../optimize/runtimeConfig.js";
import { viableArchetypes } from "./archetypeDistance.js";
import { archetypeDistance } from "./archetypeDistance.js";
import { NODE_NORM_FACTORS } from "../config/normalization.js";
import { CONTINUOUS_NODES, CATEGORICAL_NODES } from "../config/nodes.js";

// ---------------------------------------------------------------------------
// eligibleIf predicate evaluator
// ---------------------------------------------------------------------------

const LIVE_OR_UNRESOLVED: ReadonlySet<NodeStatus> = new Set(["unknown", "live_unresolved"]);

function nodeIsLiveOrUnresolved(state: RespondentState, nodeId: string): boolean {
  if (nodeId in state.continuous) {
    return LIVE_OR_UNRESOLVED.has(state.continuous[nodeId as ContinuousNodeId].status);
  }
  if (nodeId in state.categorical) {
    return LIVE_OR_UNRESOLVED.has(state.categorical[nodeId as CategoricalNodeId].status);
  }
  return false;
}

function answeredCount(state: RespondentState): number {
  return Object.keys(state.answers).length;
}

function evaluatePredicate(state: RespondentState, predicate: string): boolean {
  // Pattern: {NODE}_live_or_unresolved
  const liveMatch = predicate.match(/^(.+)_live_or_unresolved$/);
  if (liveMatch) {
    const nodeId = liveMatch[1]!;
    return nodeIsLiveOrUnresolved(state, nodeId);
  }

  const answered = answeredCount(state);

  switch (predicate) {
    // Eligible once we're past the fixed12 phase
    case "screen20_or_late_screen":
      return answered >= FIXED_16.length;

    // Late-stage consistency checks — most of the quiz is done
    case "late_consistency_check_only":
      return answered >= 30;

    // Low-weight items surfaced moderately late
    case "late_low_weight_only":
      return answered >= 20;

    // Background/biographical questions — very late filler
    case "background_prior_only":
      return answered >= 35;

    // Background eligible OR the TRB anchor is still uncertain
    case "background_prior_only_or_TRB_anchor_active": {
      if (answered >= 35) return true;
      // TRB anchor is "active" if it has been touched at least once
      // and the top probability is still below a clear-winner threshold
      const topAnchorProb = Math.max(...state.trbAnchor.dist);
      return state.trbAnchor.touches >= 1 && topAnchorProb < 0.45;
    }

    default:
      // Unknown predicate — fail closed (ineligible)
      return false;
  }
}

/**
 * Evaluate a question's eligibleIf rules against the current respondent state.
 *
 * - If no eligibleIf array exists, the question is always eligible.
 * - If the array is present, at least one predicate must be true (OR semantics).
 */
export function isQuestionEligible(state: RespondentState, q: QuestionDef): boolean {
  const rules = q.exposeRules?.eligibleIf;
  if (!rules || rules.length === 0) return true;
  return rules.some((predicate) => evaluatePredicate(state, predicate));
}

// ---------------------------------------------------------------------------
// Utility functions
// ---------------------------------------------------------------------------

function topCandidateArchetypes(
  posterior: Record<string, number>,
  archetypes: Archetype[],
  k = 5
): Archetype[] {
  return [...archetypes]
    .sort((a, b) => (posterior[b.id] ?? 0) - (posterior[a.id] ?? 0))
    .slice(0, k);
}

function nodeUncertainty(state: RespondentState, nodeId: string): number {
  if (nodeId in state.continuous) {
    const node = state.continuous[nodeId as ContinuousNodeId];
    return 1 - Math.max(...node.posDist);
  }
  if (nodeId in state.categorical) {
    const node = state.categorical[nodeId as CategoricalNodeId];
    return 1 - Math.max(...node.catDist);
  }
  if (nodeId === "TRB_ANCHOR") {
    return 1 - Math.max(...state.trbAnchor.dist);
  }
  return 0;
}

function salienceUncertainty(state: RespondentState, nodeId: string): number {
  if (nodeId in state.continuous) {
    const node = state.continuous[nodeId as ContinuousNodeId];
    return 1 - Math.max(...node.salDist);
  }
  if (nodeId in state.categorical) {
    const node = state.categorical[nodeId as CategoricalNodeId];
    return 1 - Math.max(...node.salDist);
  }
  return 0;
}

/** Shannon entropy of a discrete distribution (in nats). */
function entropy(dist: number[]): number {
  let h = 0;
  for (const p of dist) {
    if (p > 1e-12) h -= p * Math.log(p);
  }
  return h;
}

/** Expected salience for a node (0-3 scale). */
function expectedSalience(state: RespondentState, nodeId: string): number {
  let salDist: number[] | undefined;
  if (nodeId in state.continuous) {
    salDist = state.continuous[nodeId as ContinuousNodeId].salDist as unknown as number[];
  } else if (nodeId in state.categorical) {
    salDist = state.categorical[nodeId as CategoricalNodeId].salDist as unknown as number[];
  }
  if (!salDist) return 1.5; // neutral
  return salDist[0]! * 0 + salDist[1]! * 1 + salDist[2]! * 2 + salDist[3]! * 3;
}

// ---------------------------------------------------------------------------
// Phase 1: Salience-first scoring (questions 1-16)
//
// Goal: Establish which nodes matter to the respondent before doing
// position-based discrimination. Questions with role:"salience" touches
// get a large boost. Coverage across all 14 nodes is also rewarded.
// ---------------------------------------------------------------------------

function scoreSaliencePhase(
  state: RespondentState,
  q: QuestionDef,
  _archetypes: Archetype[]
): number {
  let salienceBoost = 0;
  let coverageScore = 0;
  let totalTouches = 0;

  for (const touch of q.touchProfile) {
    if (touch.node === "TRB_ANCHOR") {
      coverageScore += state.trbAnchor.touches < 2 ? 0.5 : 0.1;
      continue;
    }

    const isSalience = touch.role === "salience";
    const salUncert = salienceUncertainty(state, touch.node);
    const posUncert = nodeUncertainty(state, touch.node);

    // Salience questions get 2x weight during this phase
    if (isSalience) {
      salienceBoost += touch.weight * salUncert * 2.0;
    }

    // Coverage: reward touching undertouched nodes
    if (touch.kind === "continuous" && touch.node in state.continuous) {
      const n = state.continuous[touch.node as ContinuousNodeId];
      coverageScore += n.touches < 2 ? 1.0 : (n.touches < 4 ? 0.4 : 0.1);
    } else if (touch.kind === "categorical" && touch.node in state.categorical) {
      const n = state.categorical[touch.node as CategoricalNodeId];
      coverageScore += n.touches < 2 ? 1.2 : (n.touches < 4 ? 0.5 : 0.15);
    }

    // Position information is still valuable, just lower priority
    const normFactor = NODE_NORM_FACTORS[touch.node] ?? 1;
    totalTouches += touch.weight * posUncert * normFactor * 0.5;
  }

  const touchCount = Math.max(1, q.touchProfile.length);
  const base = (salienceBoost + coverageScore + totalTouches) / touchCount;

  return base * q.quality * (q.rewriteNeeded ? 0.7 : 1.0);
}

// ---------------------------------------------------------------------------
// Phase 2: Prune + Discriminate (questions 17-28)
//
// Now that salience is established, prune archetypes that require high
// salience on nodes the respondent scored low on. Then select questions
// that best discriminate between remaining viable archetypes.
// ---------------------------------------------------------------------------

/**
 * Prune archetypes whose salience requirements conflict with the
 * respondent's established salience profile.
 */
export function pruneByRespondentSalience(
  state: RespondentState,
  archetypes: Archetype[],
  threshold: number = 0.15
): Archetype[] {
  return archetypes.filter((a) => {
    let penalty = 0;
    let nodeCount = 0;

    for (const nodeId of CONTINUOUS_NODES) {
      const template = a.nodes[nodeId];
      if (!template || template.kind !== "continuous") continue;
      nodeCount++;

      const respondentSal = expectedSalience(state, nodeId);

      // If archetype requires high salience (sal >= 2) but respondent is low (< 1)
      if (template.sal >= 2 && respondentSal < 1.0) {
        penalty += (template.sal - respondentSal) / 3;
      }
      // If archetype requires low salience (sal <= 1) but respondent is high (> 2)
      if (template.sal <= 1 && respondentSal > 2.0) {
        penalty += (respondentSal - template.sal) / 3;
      }
    }

    for (const nodeId of CATEGORICAL_NODES) {
      const template = a.nodes[nodeId];
      if (!template || template.kind !== "categorical") continue;
      nodeCount++;

      const respondentSal = expectedSalience(state, nodeId);
      if (template.sal >= 2 && respondentSal < 1.0) {
        penalty += (template.sal - respondentSal) / 3;
      }
      if (template.sal <= 1 && respondentSal > 2.0) {
        penalty += (respondentSal - template.sal) / 3;
      }
    }

    const avgPenalty = nodeCount > 0 ? penalty / nodeCount : 0;
    return avgPenalty < threshold;
  });
}

function scorePruneDiscriminatePhase(
  state: RespondentState,
  q: QuestionDef,
  archetypes: Archetype[]
): number {
  // Use viable archetypes (already pruned by posterior)
  const viable = viableArchetypes(state, archetypes, 0.005);

  // Further prune by salience mismatch
  const saliencePruned = pruneByRespondentSalience(state, viable);
  const candidates = topCandidateArchetypes(
    state.archetypePosterior,
    saliencePruned.length > 2 ? saliencePruned : viable,
    6
  );

  // Discrimination: how much do top candidates disagree on this question's nodes?
  const discrimScore = discriminationScoreExtended(state, q, candidates);

  // Still reward some coverage for undertouched nodes
  const coverage = coverageNeed(state, q) * 0.3;

  // Bonus for questions that touch high-uncertainty nodes
  const uncertainty =
    q.touchProfile.reduce((sum, t) => {
      const normFactor = NODE_NORM_FACTORS[t.node] ?? 1;
      return sum + nodeUncertainty(state, t.node) * normFactor;
    }, 0) / Math.max(1, q.touchProfile.length);

  return (
    (discrimScore * 2.0 + coverage + uncertainty * 0.5) *
    q.quality *
    (q.rewriteNeeded ? 0.7 : 1.0)
  );
}

// ---------------------------------------------------------------------------
// Phase 3: Information-gain maximization (questions 29+)
//
// For each candidate question, estimate the expected information gain
// (entropy reduction) over the archetype posterior. This is the key
// phase for efficient convergence.
// ---------------------------------------------------------------------------

function scoreInformationGain(
  state: RespondentState,
  q: QuestionDef,
  archetypes: Archetype[]
): number {
  const viable = viableArchetypes(state, archetypes, 0.002);
  const topK = topCandidateArchetypes(state.archetypePosterior, viable, 8);
  if (topK.length < 2) return 0;

  // Current entropy over top-K posteriors
  const topPosteriors = topK.map((a) => state.archetypePosterior[a.id] ?? 0);
  const totalP = topPosteriors.reduce((a, b) => a + b, 0);
  const normalizedP = totalP > 0 ? topPosteriors.map((p) => p / totalP) : topPosteriors;
  const currentEntropy = entropy(normalizedP);

  if (currentEntropy < 0.01) return 0; // already converged

  // Estimate expected entropy reduction by measuring how much
  // this question differentiates between top candidates.
  // We use a proxy: for each pair of top archetypes, measure
  // how differently they would respond to this question.
  const discrimScore = discriminationScoreExtended(state, q, topK);

  // Devil's advocate: probe leader's blind spots
  const leader = topK[0]!;
  const devilScore = leaderBlindSpotScore(state, q, leader);
  const cfg = getConfig();

  // Scale by current entropy — more valuable when uncertainty is high
  const entropyWeight = Math.min(1.0, currentEntropy / Math.log(8));

  return (
    (discrimScore * 2.5 + cfg.DEVILS_ADVOCATE_WEIGHT * devilScore) *
    entropyWeight *
    q.quality *
    (q.rewriteNeeded ? 0.7 : 1.0)
  );
}

// ---------------------------------------------------------------------------
// Shared scoring components
// ---------------------------------------------------------------------------

function coverageNeed(state: RespondentState, q: QuestionDef): number {
  let score = 0;
  for (const touch of q.touchProfile) {
    if (touch.node === "TRB_ANCHOR") {
      score += state.trbAnchor.touches < 2 ? 1 : 0.25;
      continue;
    }
    if (touch.kind === "continuous" && touch.node in state.continuous) {
      const n = state.continuous[touch.node as ContinuousNodeId];
      score += n.touches < 3 ? 1 : 0.25;
    } else if (touch.kind === "categorical" && touch.node in state.categorical) {
      const n = state.categorical[touch.node as CategoricalNodeId];
      score += n.touches < 4 ? 1.25 : 0.35;
    }
  }
  return score / Math.max(1, q.touchProfile.length);
}

/**
 * Compute pairwise disagreement between two archetypes on the nodes
 * touched by question q.
 */
function pairwiseDisagreement(
  q: QuestionDef,
  a1: Archetype,
  a2: Archetype
): { disagreement: number; weight: number } {
  let totalDisagreement = 0;
  let totalWeight = 0;

  for (const touch of q.touchProfile) {
    if (touch.node === "TRB_ANCHOR") continue;
    const nodeId = touch.node as ContinuousNodeId | CategoricalNodeId;
    const t1 = a1.nodes[nodeId];
    const t2 = a2.nodes[nodeId];
    if (!t1 || !t2) continue;

    const w = touch.weight;
    totalWeight += w;

    if (t1.kind === "continuous" && t2.kind === "continuous") {
      const posDiff = Math.abs(t1.pos - t2.pos) / 4;
      const salDiff = Math.abs(t1.sal - t2.sal) / 3;
      totalDisagreement += w * (posDiff * 0.8 + salDiff * 0.2);
    } else if (t1.kind === "categorical" && t2.kind === "categorical") {
      let dot = 0;
      for (let i = 0; i < 6; i++) {
        dot += (t1.probs[i] ?? 0) * (t2.probs[i] ?? 0);
      }
      totalDisagreement += w * (1 - dot);
    }
  }

  return { disagreement: totalDisagreement, weight: totalWeight };
}

/**
 * Extended discrimination score: considers top-K archetypes,
 * weighted by posterior closeness and salience relevance.
 */
function discriminationScoreExtended(
  state: RespondentState,
  q: QuestionDef,
  topK: Archetype[]
): number {
  let totalScore = 0;
  let pairCount = 0;

  for (let i = 0; i < topK.length; i++) {
    for (let j = i + 1; j < topK.length; j++) {
      const a1 = topK[i]!;
      const a2 = topK[j]!;
      const { disagreement, weight } = pairwiseDisagreement(q, a1, a2);
      if (weight === 0) continue;

      // Weight pair by closeness in posterior (closer pairs are more important)
      const p1 = state.archetypePosterior[a1.id] ?? 0;
      const p2 = state.archetypePosterior[a2.id] ?? 0;
      const closeness = Math.min(p1, p2) / Math.max(p1, p2, 0.001);

      // Bonus for pairs involving the leader (pair [0,j] matters most)
      const leaderBonus = i === 0 ? 1.5 : 1.0;

      totalScore += (disagreement / weight) * closeness * leaderBonus;
      pairCount++;
    }
  }

  if (pairCount === 0) return 0;

  const uncertainty =
    q.touchProfile.reduce((sum, t) => {
      const normFactor = NODE_NORM_FACTORS[t.node] ?? 1;
      return sum + nodeUncertainty(state, t.node) * normFactor;
    }, 0) / Math.max(1, q.touchProfile.length);

  return (totalScore / pairCount) * Math.max(0.1, uncertainty);
}

/**
 * Devil's advocate: probe the leader's blind spots.
 * When the leader has many sal<=1 (indifferent) nodes, ask about
 * those to verify the respondent truly doesn't care.
 */
function leaderBlindSpotScore(
  state: RespondentState,
  q: QuestionDef,
  leader: Archetype
): number {
  let score = 0;
  let count = 0;
  for (const touch of q.touchProfile) {
    if (touch.node === "TRB_ANCHOR") continue;
    const template = leader.nodes[touch.node as keyof typeof leader.nodes];
    if (!template) continue;
    count++;
    // Leader is indifferent on this node — worth probing
    if (template.sal <= 1) {
      score += touch.weight * nodeUncertainty(state, touch.node);
    }
  }
  return count > 0 ? score / count : 0;
}

// ---------------------------------------------------------------------------
// Phase 4: Pairwise late-stage discrimination
//
// When top-2 posterior gap < 0.02 after 25+ questions, switch from generic
// EIG to targeted pairwise discrimination. Find the exact nodes where the
// top-2 archetypes differ and massively boost questions that touch those.
// This addresses near-neighbor confusion families like:
//   {019, 020}, {098, 102}, {070, 075}, {091, 097}, {049, 050}
// ---------------------------------------------------------------------------

function scorePairwiseDiscrimination(
  state: RespondentState,
  q: QuestionDef,
  archetypes: Archetype[]
): number {
  const viable = viableArchetypes(state, archetypes, 0.002);
  const topK = topCandidateArchetypes(state.archetypePosterior, viable, 4);
  if (topK.length < 2) return 0;

  const leader = topK[0]!;
  const rival = topK[1]!;

  // Find differentiating nodes between leader and rival
  const differentiatingNodes = new Map<string, number>(); // node → difference magnitude

  for (const nodeId of CONTINUOUS_NODES) {
    const t1 = leader.nodes[nodeId];
    const t2 = rival.nodes[nodeId];
    if (!t1 || !t2 || t1.kind !== "continuous" || t2.kind !== "continuous") continue;
    const posDiff = Math.abs(t1.pos - t2.pos) / 4;
    const salDiff = Math.abs(t1.sal - t2.sal) / 3;
    const totalDiff = posDiff * 0.75 + salDiff * 0.25;
    if (totalDiff > 0.05) {
      differentiatingNodes.set(nodeId, totalDiff);
    }
  }

  for (const nodeId of CATEGORICAL_NODES) {
    const t1 = leader.nodes[nodeId];
    const t2 = rival.nodes[nodeId];
    if (!t1 || !t2 || t1.kind !== "categorical" || t2.kind !== "categorical") continue;
    let dot = 0;
    for (let i = 0; i < 6; i++) {
      dot += (t1.probs[i] ?? 0) * (t2.probs[i] ?? 0);
    }
    const catDiff = 1 - dot;
    if (catDiff > 0.05) {
      differentiatingNodes.set(nodeId, catDiff);
    }
  }

  if (differentiatingNodes.size === 0) return 0;

  // Score question by how well it targets differentiating nodes
  let targetedScore = 0;
  let totalWeight = 0;

  for (const touch of q.touchProfile) {
    if (touch.node === "TRB_ANCHOR") continue;
    const diff = differentiatingNodes.get(touch.node);
    if (diff !== undefined) {
      const normFactor = NODE_NORM_FACTORS[touch.node] ?? 1;
      const uncert = nodeUncertainty(state, touch.node);
      // Massive boost for questions that target exactly where archetypes differ
      targetedScore += touch.weight * diff * normFactor * uncert * 5.0;
      totalWeight += touch.weight;
    }
  }

  if (totalWeight === 0) {
    // Question doesn't touch differentiating nodes — still score by generic EIG
    // but heavily penalized
    return scoreInformationGain(state, q, archetypes) * 0.2;
  }

  // Also consider the 3rd and 4th candidates (don't tunnel-vision on just top-2)
  let thirdFourthBonus = 0;
  for (let k = 2; k < topK.length; k++) {
    const alt = topK[k]!;
    const { disagreement, weight } = pairwiseDisagreement(q, leader, alt);
    if (weight > 0) {
      thirdFourthBonus += (disagreement / weight) * 0.3;
    }
  }

  return (targetedScore / totalWeight + thirdFourthBonus) *
    q.quality * (q.rewriteNeeded ? 0.7 : 1.0);
}

// ---------------------------------------------------------------------------
// 3-Phase blended scoring (with pairwise late-stage override)
// ---------------------------------------------------------------------------

function scoreQuestion3Phase(
  state: RespondentState,
  q: QuestionDef,
  archetypes: Archetype[]
): number {
  const cfg = getConfig();
  const nAnswered = answeredCount(state);

  // Phase 1: Salience-first (questions 0-15)
  if (nAnswered < cfg.PHASE1_END) {
    return scoreSaliencePhase(state, q, archetypes);
  }

  // Phase 2: Prune + Discriminate (questions 16-27)
  if (nAnswered < cfg.PHASE2_END) {
    // Smooth blend from salience→discrimination
    const alpha = (nAnswered - cfg.PHASE1_END) / (cfg.PHASE2_END - cfg.PHASE1_END);
    const salienceScore = scoreSaliencePhase(state, q, archetypes);
    const discrimScore = scorePruneDiscriminatePhase(state, q, archetypes);
    return salienceScore * (1 - alpha) + discrimScore * alpha;
  }

  // Phase 4 override: Pairwise discrimination when top-2 gap < 0.02
  // Kicks in after 25+ questions when the leader and runner-up are neck-and-neck
  if (nAnswered >= 25) {
    const viable = viableArchetypes(state, archetypes, 0.002);
    const top2 = topCandidateArchetypes(state.archetypePosterior, viable, 2);
    if (top2.length >= 2) {
      const p1 = state.archetypePosterior[top2[0]!.id] ?? 0;
      const p2 = state.archetypePosterior[top2[1]!.id] ?? 0;
      const gap = p1 - p2;
      if (gap < 0.02) {
        return scorePairwiseDiscrimination(state, q, archetypes);
      }
    }
  }

  // Phase 3: Information-gain maximization (questions 28+)
  return scoreInformationGain(state, q, archetypes);
}

// ---------------------------------------------------------------------------
// Question selection
// ---------------------------------------------------------------------------

export function selectNextQuestion(
  state: RespondentState,
  available: QuestionDef[],
  archetypes: Archetype[]
): QuestionDef | null {
  const eligible = available.filter(
    (q) => !(q.id in state.answers) && isQuestionEligible(state, q)
  );
  if (!eligible.length) return null;

  const scored = eligible.map((q) => ({
    q,
    score: scoreQuestion3Phase(state, q, archetypes)
  }));

  scored.sort((a, b) => b.score - a.score);
  return scored[0]?.q ?? null;
}

// Keep old export for compatibility with diagnostic scripts
export function scoreQuestionForExposure(
  state: RespondentState,
  q: QuestionDef,
  archetypes: Archetype[]
): number {
  return scoreQuestion3Phase(state, q, archetypes);
}

// ---------------------------------------------------------------------------
// Batch selection: pick 3-4 complementary questions for the adaptive phase.
//
// Greedy with node-diversity penalty: score all eligible questions, pick the
// best, then penalize subsequent candidates that overlap on the same nodes
// so the batch covers diverse dimensions.
// ---------------------------------------------------------------------------

function computeBatchSize(state: RespondentState, archetypes: Archetype[]): number {
  const cfg = getConfig();
  const viable = viableArchetypes(state, archetypes);
  if (viable.length > 20) return cfg.BATCH_SIZE_MAX;
  if (viable.length > cfg.BATCH_PRUNE_MIN_VIABLE) return cfg.BATCH_SIZE_MIN;
  return 1; // fine discrimination — single question mode
}

export function selectNextBatch(
  state: RespondentState,
  available: QuestionDef[],
  archetypes: Archetype[]
): QuestionDef[] {
  const batchSize = computeBatchSize(state, archetypes);

  const eligible = available.filter(
    (q) => !(q.id in state.answers) && isQuestionEligible(state, q)
  );
  if (!eligible.length) return [];

  // Score all eligible questions
  const scored = eligible.map((q) => ({
    q,
    baseScore: scoreQuestion3Phase(state, q, archetypes),
  }));
  scored.sort((a, b) => b.baseScore - a.baseScore);

  const batch: QuestionDef[] = [];
  const selectedNodes = new Set<string>();

  while (batch.length < batchSize && scored.length > 0) {
    // Consider the top 10 candidates with node-overlap penalty
    const cfg = getConfig();
    const searchDepth = Math.min(scored.length, cfg.BATCH_SEARCH_DEPTH);
    let bestIdx = 0;
    let bestScore = -Infinity;

    for (let i = 0; i < searchDepth; i++) {
      const candidate = scored[i]!;
      const touchNodes = candidate.q.touchProfile.map((t) => t.node);
      const overlapCount = touchNodes.filter((n) => selectedNodes.has(n)).length;
      const overlapPenalty = 1 - cfg.NODE_OVERLAP_PENALTY * overlapCount / Math.max(1, touchNodes.length);
      const adjustedScore = candidate.baseScore * overlapPenalty;

      if (adjustedScore > bestScore) {
        bestScore = adjustedScore;
        bestIdx = i;
      }
    }

    const selected = scored.splice(bestIdx, 1)[0]!;
    batch.push(selected.q);
    for (const t of selected.q.touchProfile) {
      selectedNodes.add(t.node);
    }
  }

  return batch;
}
