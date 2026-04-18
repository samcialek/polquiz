import type { Archetype, ContinuousNodeId, CategoricalNodeId, RespondentState } from "../types.js";
import { getConfig } from "../optimize/runtimeConfig.js";

/**
 * Phase 3 distance-native stop rule.
 *
 * Scoring is Euclidean winner-take-all on state.archetypeDistances (lower =
 * better). The stop rule fires when one of four tiers agrees that the leader
 * is stable and the gap_ratio to the runner-up is wide enough. gap_ratio is
 * (d_second - d_leader) / d_leader, clamped to [0, +inf). The tiers cover the
 * question-budget ramp:
 *
 *   tier         Q≥   d_leader≤   gap_ratio≥   consecutive_leads≥
 *   ultraConf    20   6           0.25         8
 *   primary      25   8           0.10         3
 *   secondary    35   10          0.05         6
 *   lateGame     45   12          0.03         4
 *   hardCap      55   —           —            —
 *
 * Thresholds live in runtimeConfig.ts so the optimizer can calibrate them in
 * Stage 4. Current values are plan-§4 placeholders.
 *
 * Node-level convergence gates (anyContinuousBlocking / anyCategoricalBlocking)
 * are retained from the pre-Phase-3 rule: even if the archetype leader is
 * clear, the rule waits until the top-K archetypes agree on the unresolved
 * nodes that the respondent is still shaping. This keeps the adaptive selector
 * from being cut short while a node is actively being probed.
 */

const CAT_CONFIDENT_GAP = 0.50;

export function resetSimilarityCache(): void {
  // Retained as a no-op for API stability; pre-Phase-3 callers imported this.
  // Phase 3 scoring has no per-stop cosine cache.
}

export function shouldStop(
  state: RespondentState,
  archetypes?: Archetype[]
): boolean {
  const cfg = getConfig();
  const nAnswered = Object.keys(state.answers).length;

  if (nAnswered >= cfg.HARD_CAP_Q) return true;
  if (nAnswered < cfg.STOP_MIN_QUESTIONS) {
    if (!(nAnswered >= cfg.UC_MIN_Q)) return false;
  }

  const entries = Object.entries(state.archetypeDistances)
    .filter(([, d]) => Number.isFinite(d))
    .sort((a, b) => a[1] - b[1]);
  if (entries.length < 2) return false;

  const topId = entries[0]![0];
  const dLeader = entries[0]![1];
  const dSecond = entries[1]![1];
  const gapRatio = dLeader > 0 ? (dSecond - dLeader) / dLeader : 0;
  const consecutiveCount = state.consecutiveLeadCount ?? 0;

  const topKIds = entries.slice(0, cfg.STOP_AGREEMENT_K).map(([id]) => id);
  const topKArchetypes = archetypes
    ? archetypes.filter((a) => topKIds.includes(a.id))
    : [];

  function topKAgreeOnContinuous(nodeId: string): boolean {
    if (topKArchetypes.length < 2) return true;
    const templates = topKArchetypes
      .map((a) => a.nodes[nodeId as ContinuousNodeId])
      .filter((t) => t && t.kind === "continuous");
    if (templates.length < 2) return true;
    const positions = templates.map((t) => (t!.kind === "continuous" ? (t as any).pos : 0));
    return positions.every((p: number) => p === positions[0]);
  }

  function topKAgreeOnCategorical(nodeId: string): boolean {
    if (topKArchetypes.length < 2) return true;
    const templates = topKArchetypes
      .map((a) => a.nodes[nodeId as CategoricalNodeId])
      .filter((t) => t && t.kind === "categorical");
    if (templates.length < 2) return true;
    const topCats = templates.map((t) => {
      const probs = t!.kind === "categorical" ? (t as any).probs : [];
      return probs.indexOf(Math.max(...probs));
    });
    return topCats.every((c: number) => c === topCats[0]);
  }

  const anyContinuousBlocking = Object.entries(state.continuous).some(
    ([nodeId, n]) =>
      n.status === "live_unresolved" && !topKAgreeOnContinuous(nodeId)
  );

  const anyCategoricalBlocking = Object.entries(state.categorical).some(([nodeId, n]) => {
    if (n.status !== "live_unresolved") return false;
    const sorted = [...n.catDist].sort((a, b) => b - a);
    const gap = (sorted[0] ?? 0) - (sorted[1] ?? 0);
    if (gap >= CAT_CONFIDENT_GAP) return false;
    return !topKAgreeOnCategorical(nodeId);
  });

  const nodesSettled = !anyContinuousBlocking && !anyCategoricalBlocking;

  const ultraConfStop =
    nAnswered >= cfg.UC_MIN_Q &&
    dLeader <= cfg.UC_DISTANCE_MAX &&
    gapRatio >= cfg.UC_GAP_RATIO_MIN &&
    consecutiveCount >= cfg.UC_CONSECUTIVE;

  const primaryStop =
    nAnswered >= cfg.STOP_MIN_QUESTIONS &&
    dLeader <= cfg.STOP_DISTANCE_MAX &&
    gapRatio >= cfg.STOP_GAP_RATIO_MIN &&
    consecutiveCount >= cfg.STOP_MIN_CONSECUTIVE_LEADS &&
    nodesSettled;

  const secondaryStop =
    nAnswered >= cfg.SECONDARY_MIN_Q &&
    dLeader <= cfg.SECONDARY_DISTANCE_MAX &&
    gapRatio >= cfg.SECONDARY_GAP_RATIO_MIN &&
    consecutiveCount >= cfg.SECONDARY_CONSECUTIVE;

  const lateGameStop =
    nAnswered >= cfg.LATE_GAME_MIN_Q &&
    dLeader <= cfg.LATE_GAME_DISTANCE_MAX &&
    gapRatio >= cfg.LATE_GAME_GAP_RATIO_MIN &&
    consecutiveCount >= cfg.LATE_GAME_CONSECUTIVE;

  void topId;

  return ultraConfStop || primaryStop || secondaryStop || lateGameStop;
}
