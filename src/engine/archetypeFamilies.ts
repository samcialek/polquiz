import type { Archetype } from "../types.js";
import { CONTINUOUS_NODES, CATEGORICAL_NODES } from "../config/nodes.js";

/**
 * Phase 3 family-detection module.
 *
 * Pre-computes the pairwise archetype-to-archetype Euclidean distance matrix
 * and derives the family-membership set per archetype.
 *
 * Per node distance (no respondent state involved, so no anti penalty):
 *   - Continuous:  (p^A - p^B)² * max(s^A, s^B)
 *   - Categorical: Σ_k (probs^A[k] - probs^B[k])² * max(s^A, s^B)
 *
 * If either archetype lacks a template for the node, the node is skipped — so
 * ENG (no signature on any archetype as of 3b) drops out automatically.
 *
 * The pairwise distance is sqrt(Σ d_i). Over all non-self pairs, the 10th
 * percentile defines the family threshold. familyOf[A] = {B ≠ A : pairwise[A][B] ≤ threshold}.
 *
 * Deactivated archetypes are still included — they cannot win MAP, so their
 * presence as neighbours of a winning archetype is harmless and keeps the
 * lookup symmetric.
 */

export interface ArchetypeFamilyIndex {
  pairwise: Record<string, Record<string, number>>;
  familyOf: Record<string, ReadonlySet<string>>;
  threshold: number;
}

const FAMILY_PERCENTILE = 0.10;

function pairwiseDistance(a: Archetype, b: Archetype): number {
  let sumSquared = 0;

  for (const nodeId of CONTINUOUS_NODES) {
    const tA = a.nodes[nodeId];
    const tB = b.nodes[nodeId];
    if (!tA || tA.kind !== "continuous") continue;
    if (!tB || tB.kind !== "continuous") continue;

    const dp = tA.pos - tB.pos;
    const w = Math.max(tA.sal ?? 0, tB.sal ?? 0); // SELF-cluster has no sal (ADR-005)
    sumSquared += dp * dp * w;
  }

  for (const nodeId of CATEGORICAL_NODES) {
    const tA = a.nodes[nodeId];
    const tB = b.nodes[nodeId];
    if (!tA || tA.kind !== "categorical") continue;
    if (!tB || tB.kind !== "categorical") continue;

    let probDiffSq = 0;
    for (let k = 0; k < 6; k++) {
      const d = (tA.probs[k] ?? 0) - (tB.probs[k] ?? 0);
      probDiffSq += d * d;
    }
    const w = Math.max(tA.sal, tB.sal);
    sumSquared += probDiffSq * w;
  }

  return Math.sqrt(sumSquared);
}

function percentile(sortedAsc: number[], p: number): number {
  if (sortedAsc.length === 0) return 0;
  const idx = (sortedAsc.length - 1) * p;
  const lo = Math.floor(idx);
  const hi = Math.ceil(idx);
  if (lo === hi) return sortedAsc[lo]!;
  const w = idx - lo;
  return sortedAsc[lo]! * (1 - w) + sortedAsc[hi]! * w;
}

export function buildArchetypeFamilies(
  archetypes: Archetype[]
): ArchetypeFamilyIndex {
  const pairwise: Record<string, Record<string, number>> = {};
  const allDistances: number[] = [];

  for (const a of archetypes) {
    pairwise[a.id] = {};
  }

  for (let i = 0; i < archetypes.length; i++) {
    for (let j = i + 1; j < archetypes.length; j++) {
      const a = archetypes[i]!;
      const b = archetypes[j]!;
      const d = pairwiseDistance(a, b);
      pairwise[a.id]![b.id] = d;
      pairwise[b.id]![a.id] = d;
      allDistances.push(d);
    }
  }

  allDistances.sort((x, y) => x - y);
  const threshold = percentile(allDistances, FAMILY_PERCENTILE);

  const familyOf: Record<string, ReadonlySet<string>> = {};
  for (const a of archetypes) {
    const neighbours = new Set<string>();
    for (const b of archetypes) {
      if (a.id === b.id) continue;
      const d = pairwise[a.id]![b.id];
      if (d !== undefined && d <= threshold) {
        neighbours.add(b.id);
      }
    }
    familyOf[a.id] = neighbours;
  }

  return { pairwise, familyOf, threshold };
}
