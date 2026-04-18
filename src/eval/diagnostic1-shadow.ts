/**
 * Diagnostic 1 — old softmax-of-distance scorer vs current Euclidean WTA.
 *
 * Runs the current harness (current selector, current stop-rule, current
 * answer generation) over all archetypes at σ=0 seed=0, then at each run's
 * final state re-scores with THREE variants and compares winners to the
 * current WTA pick:
 *
 *   (A) new Euclidean WTA  — current production scorer, argmin(distance)
 *   (B) old scalar distance, argmin                 (no softmax, no priors)
 *   (C) old scalar distance, softmax with uniform prior (1/n_active)
 *   (D) old scalar distance, softmax with a.prior   (codebase-native priors;
 *       these happen to be uniform 1/118 for actives and 0 for deactivates,
 *       so C and D should be effectively equivalent — but we run both to
 *       verify arithmetically.)
 *
 * Usage:
 *   npx tsx src/eval/diagnostic1-shadow.ts
 *
 * Emits: results/phase3/diagnostic-artifacts/diagnostic-1-results.json
 */

import * as fs from "fs";
import * as path from "path";

import type {
  Archetype,
  ContinuousNodeId,
  CategoricalNodeId,
  ContinuousPosDist,
  SalienceDist,
  CategoricalDist,
  RespondentState,
  TrbAnchorDist,
} from "../types.js";
import { ARCHETYPES } from "../config/archetypes.js";
import { REPRESENTATIVE_QUESTIONS } from "../config/questions.representative.js";
import { CONTINUOUS_NODES, CATEGORICAL_NODES } from "../config/nodes.js";
import { CATEGORY_COST_MATRIX } from "../config/categories.js";

import { simulateOne, type SimRun } from "./harness.js";

// -----------------------------------------------------------------------------
// OLD scalar distance function — verbatim from git 5ab3a04:src/engine/archetypeDistance.ts
// -----------------------------------------------------------------------------
function oldDistance(state: RespondentState, archetype: Archetype): number {
  let totalDist = 0;
  let totalWeight = 0;

  for (const nodeId of CONTINUOUS_NODES) {
    const template = archetype.nodes[nodeId as ContinuousNodeId];
    if (!template || template.kind !== "continuous") continue;
    const nodeState = state.continuous[nodeId as ContinuousNodeId];

    const expectedPos =
      (nodeState.posDist[0] ?? 0) * 1 +
      (nodeState.posDist[1] ?? 0) * 2 +
      (nodeState.posDist[2] ?? 0) * 3 +
      (nodeState.posDist[3] ?? 0) * 4 +
      (nodeState.posDist[4] ?? 0) * 5;

    const posProb = nodeState.posDist[template.pos - 1] ?? 0.2;

    const expectedSal =
      (nodeState.salDist[0] ?? 0) * 0 +
      (nodeState.salDist[1] ?? 0) * 1 +
      (nodeState.salDist[2] ?? 0) * 2 +
      (nodeState.salDist[3] ?? 0) * 3;

    const salProb = nodeState.salDist[template.sal] ?? 0.25;

    const posMeanDiff = Math.abs(expectedPos - template.pos) / 4;
    const posProbDist = 1 - posProb;
    const salMeanDiff = Math.abs(expectedSal - template.sal) / 3;
    const salProbDist = 1 - salProb;

    const positionDist = posMeanDiff * 0.6 + posProbDist * 0.4;
    const salienceDist = salMeanDiff * 0.6 + salProbDist * 0.4;

    let antiPenalty = 0;
    if (template.anti === "high" && expectedPos > 3.8) {
      antiPenalty = 0.8 * (expectedPos - 3.8) / 1.2;
    } else if (template.anti === "low" && expectedPos < 2.2) {
      antiPenalty = 0.8 * (2.2 - expectedPos) / 1.2;
    }

    const archSalWeight = 0.5 + template.sal * 0.5;
    const respondentSalWeight = 0.5 + expectedSal * 0.25;
    const nodeWeight = archSalWeight * respondentSalWeight;
    const nodeDist = positionDist * 0.65 + salienceDist * 0.35 + antiPenalty;

    totalDist += nodeDist * nodeWeight;
    totalWeight += nodeWeight;
  }

  for (const nodeId of CATEGORICAL_NODES) {
    const template = archetype.nodes[nodeId as CategoricalNodeId];
    if (!template || template.kind !== "categorical") continue;
    const nodeState = state.categorical[nodeId as CategoricalNodeId];

    const costMatrix = CATEGORY_COST_MATRIX[nodeId as CategoricalNodeId];
    let catCostDist = 0;
    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 6; j++) {
        catCostDist +=
          (nodeState.catDist[i] ?? 0) *
          (template.probs[j] ?? 0) *
          (costMatrix[i]?.[j] ?? 0);
      }
    }
    let dot = 0;
    for (let i = 0; i < 6; i++) {
      dot += (nodeState.catDist[i] ?? 0) * (template.probs[i] ?? 0);
    }
    const dotDist = 1 - dot;

    let antiCatPenalty = 0;
    if (template.antiCats) {
      for (const antiIdx of template.antiCats) {
        if (antiIdx >= 0 && antiIdx < 6) {
          antiCatPenalty += (nodeState.catDist[antiIdx] ?? 0) * 0.5;
        }
      }
    }

    const expectedSal =
      (nodeState.salDist[0] ?? 0) * 0 +
      (nodeState.salDist[1] ?? 0) * 1 +
      (nodeState.salDist[2] ?? 0) * 2 +
      (nodeState.salDist[3] ?? 0) * 3;
    const salDiff = Math.abs(expectedSal - template.sal) / 3;

    const archSalWeight = 0.5 + template.sal * 0.5;
    const respondentSalWeight = 0.5 + expectedSal * 0.25;
    const nodeWeight = archSalWeight * respondentSalWeight;

    const catDist = catCostDist * 0.5 + dotDist * 0.5;
    const nodeDist = catDist * 0.65 + salDiff * 0.35 + antiCatPenalty;

    totalDist += nodeDist * nodeWeight;
    totalWeight += nodeWeight;
  }

  return totalWeight > 0 ? totalDist / totalWeight : 0;
}

// -----------------------------------------------------------------------------
// Old-style softmax with configurable prior map.
//   likelihood_a = exp(-(d_a - d_min) / T) * prior_a
//   posterior_a  = likelihood_a / sum
// Adaptive temperature: 0.12 early, cools to 0.04 by q=40 — matches 5ab3a04.
// -----------------------------------------------------------------------------
function softmaxPosterior(
  distances: Record<string, number>,
  priors: Record<string, number>,
  nAnswered: number
): Record<string, number> {
  const baseTemp = 0.12;
  const minTemp = 0.04;
  const coolRate = Math.min(1.0, nAnswered / 40);
  const temperature = baseTemp - (baseTemp - minTemp) * coolRate;

  const vals = Object.values(distances).filter(Number.isFinite);
  const minDist = Math.min(...vals);

  const likelihoods: Record<string, number> = {};
  let total = 0;
  for (const [id, d] of Object.entries(distances)) {
    if (!Number.isFinite(d)) continue;
    const prior = priors[id] ?? 0;
    const L = Math.exp(-(d - minDist) / temperature) * prior;
    likelihoods[id] = L;
    total += L;
  }

  const posterior: Record<string, number> = {};
  if (total > 0) {
    for (const [id, L] of Object.entries(likelihoods)) {
      posterior[id] = L / total;
    }
  } else {
    // Degenerate — fall back to uniform over non-zero-prior archetypes.
    for (const id of Object.keys(likelihoods)) posterior[id] = priors[id] ?? 0;
  }
  return posterior;
}

// -----------------------------------------------------------------------------
// Reconstruct a RespondentState from the rounded nodeFinalState snapshot.
// Only the fields the old distance function reads are required.
// -----------------------------------------------------------------------------
function stateFromSnapshot(snapshot: NonNullable<SimRun["nodeFinalState"]>): RespondentState {
  const continuous = {} as RespondentState["continuous"];
  for (const nodeId of CONTINUOUS_NODES) {
    const snap = snapshot.continuous[nodeId];
    continuous[nodeId] = {
      posDist: [...(snap?.posDist ?? [0.2, 0.2, 0.2, 0.2, 0.2])] as ContinuousPosDist,
      salDist: [...(snap?.salDist ?? [0.25, 0.25, 0.25, 0.25])] as SalienceDist,
      touches: snap?.touches ?? 0,
      touchTypes: new Set<string>(),
      status: "unknown",
    };
  }
  const categorical = {} as RespondentState["categorical"];
  for (const nodeId of CATEGORICAL_NODES) {
    const snap = snapshot.categorical[nodeId];
    categorical[nodeId] = {
      catDist: [...(snap?.catDist ?? [1/6,1/6,1/6,1/6,1/6,1/6])] as CategoricalDist,
      salDist: [...(snap?.salDist ?? [0.25,0.25,0.25,0.25])] as SalienceDist,
      touches: snap?.touches ?? 0,
      touchTypes: new Set<string>(),
      status: "unknown",
    };
  }
  return {
    answers: {},
    continuous,
    categorical,
    trbAnchor: {
      dist: [...(snapshot.trbAnchor?.dist ?? Array(9).fill(1/9))] as TrbAnchorDist,
      touches: snapshot.trbAnchor?.touches ?? 0,
    },
    archetypeDistances: {},
    currentLeader: undefined,
    consecutiveLeadCount: 0,
  };
}

// -----------------------------------------------------------------------------
// Main diagnostic
// -----------------------------------------------------------------------------
interface RunRow {
  target: string;
  targetName: string;
  questionsAnswered: number;
  // Four winners from each scoring variant
  winA_newWTA: string;
  winB_oldArgmin: string;
  winC_oldSoftUniform: string;
  winD_oldSoftActualPrior: string;
  // Ranks of true target under each scheme
  rankA: number;
  rankB: number;
  rankC: number;
  rankD: number;
  // Leader distances/posteriors for reference
  newDistLeader: number;
  oldDistLeader: number;
  softUniformLeader: number;
}

function sortedArgmin(dists: Record<string, number>): [string, number][] {
  return Object.entries(dists)
    .filter(([, d]) => Number.isFinite(d))
    .sort((a, b) => a[1] - b[1]);
}

function sortedArgmax(post: Record<string, number>): [string, number][] {
  return Object.entries(post)
    .filter(([, p]) => Number.isFinite(p))
    .sort((a, b) => b[1] - a[1]);
}

function rankOf(id: string, sorted: [string, number][]): number {
  const idx = sorted.findIndex(([x]) => x === id);
  return idx < 0 ? 0 : idx + 1;
}

function main(): void {
  const activeArchetypes = ARCHETYPES.filter(a => a.active !== false);
  const nActive = activeArchetypes.length;

  // Prior maps
  const uniformPriors: Record<string, number> = {};
  const actualPriors: Record<string, number> = {};
  for (const a of activeArchetypes) uniformPriors[a.id] = 1 / nActive;
  for (const a of ARCHETYPES) {
    // Codebase priors are uniform 1/118 for active and 0 for deactivated.
    // We use that explicit pattern here (reading a.prior would 404 under the
    // current type definition — it's been removed from Archetype).
    actualPriors[a.id] = a.active === false ? 0 : 1 / nActive;
  }

  console.log(`Active archetypes: ${nActive}`);
  console.log(`Total archetypes (including deactivated): ${ARCHETYPES.length}`);
  console.log(`Running diagnostic on all ${ARCHETYPES.length} targets (σ=0, seed=0)...`);

  const rows: RunRow[] = [];
  let topA = 0, topB = 0, topC = 0, topD = 0;
  let top5A = 0, top5B = 0, top5C = 0, top5D = 0;

  for (let i = 0; i < ARCHETYPES.length; i++) {
    const target = ARCHETYPES[i]!;
    const run = simulateOne(target, ARCHETYPES, REPRESENTATIVE_QUESTIONS, {
      noiseSigma: 0, seed: 0, maxQuestions: 65,
      captureDistances: true, captureNodeStates: true,
    });

    if (!run.nodeFinalState || !run.distancesFinal) {
      console.warn(`Skipping ${target.id} — capture failed`);
      continue;
    }

    // A: new WTA  (straight from simulateOne; already computed)
    const sortedA = sortedArgmin(run.distancesFinal);
    const winA = sortedA[0]?.[0] ?? "";
    const rankA = rankOf(target.id, sortedA);

    // Reconstruct state and compute old distances for B/C/D
    const state = stateFromSnapshot(run.nodeFinalState);
    const oldDists: Record<string, number> = {};
    for (const a of ARCHETYPES) {
      if (a.active === false) {
        oldDists[a.id] = Infinity; // match the active filter used by new WTA
        continue;
      }
      oldDists[a.id] = oldDistance(state, a);
    }

    const sortedB = sortedArgmin(oldDists);
    const winB = sortedB[0]?.[0] ?? "";
    const rankB = rankOf(target.id, sortedB);

    // Softmax variants — use nAnswered from the run so temperature matches the
    // cooling schedule at that stage of the interview.
    const postC = softmaxPosterior(oldDists, uniformPriors, run.questionsAnswered);
    const sortedC = sortedArgmax(postC);
    const winC = sortedC[0]?.[0] ?? "";
    const rankC = rankOf(target.id, sortedC);

    const postD = softmaxPosterior(oldDists, actualPriors, run.questionsAnswered);
    const sortedD = sortedArgmax(postD);
    const winD = sortedD[0]?.[0] ?? "";
    const rankD = rankOf(target.id, sortedD);

    if (winA === target.id) topA++;
    if (winB === target.id) topB++;
    if (winC === target.id) topC++;
    if (winD === target.id) topD++;
    if (rankA > 0 && rankA <= 5) top5A++;
    if (rankB > 0 && rankB <= 5) top5B++;
    if (rankC > 0 && rankC <= 5) top5C++;
    if (rankD > 0 && rankD <= 5) top5D++;

    rows.push({
      target: target.id,
      targetName: target.name,
      questionsAnswered: run.questionsAnswered,
      winA_newWTA: winA,
      winB_oldArgmin: winB,
      winC_oldSoftUniform: winC,
      winD_oldSoftActualPrior: winD,
      rankA, rankB, rankC, rankD,
      newDistLeader: sortedA[0]?.[1] ?? Infinity,
      oldDistLeader: sortedB[0]?.[1] ?? Infinity,
      softUniformLeader: sortedC[0]?.[1] ?? 0,
    });

    if ((i + 1) % 20 === 0) {
      console.log(`  ${i + 1}/${ARCHETYPES.length}  topA=${topA} topB=${topB} topC=${topC} topD=${topD}`);
    }
  }

  const n = rows.length;
  const summary = {
    n,
    nActive,
    variantA: { label: "new Euclidean WTA (argmin)", top1: topA, top1Pct: +(100 * topA / n).toFixed(1), top5: top5A, top5Pct: +(100 * top5A / n).toFixed(1) },
    variantB: { label: "OLD scalar distance, argmin (no softmax)", top1: topB, top1Pct: +(100 * topB / n).toFixed(1), top5: top5B, top5Pct: +(100 * top5B / n).toFixed(1) },
    variantC: { label: "OLD scalar distance + softmax + UNIFORM priors (1/n)", top1: topC, top1Pct: +(100 * topC / n).toFixed(1), top5: top5C, top5Pct: +(100 * top5C / n).toFixed(1) },
    variantD: { label: "OLD scalar distance + softmax + ACTUAL priors (codebase: 1/118 active, 0 deactivated)", top1: topD, top1Pct: +(100 * topD / n).toFixed(1), top5: top5D, top5Pct: +(100 * top5D / n).toFixed(1) },
  };

  console.log("\n=== Diagnostic 1 summary ===");
  console.log(JSON.stringify(summary, null, 2));

  const outDir = path.join("results", "phase3", "diagnostic-artifacts");
  fs.mkdirSync(outDir, { recursive: true });
  const outFile = path.join(outDir, "diagnostic-1-results.json");
  fs.writeFileSync(outFile, JSON.stringify({ summary, rows }, null, 2));
  console.log(`\nWrote ${outFile}  (${rows.length} rows)`);
}

main();
