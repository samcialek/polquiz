/**
 * Phase 2.7.6 — Synthetic-electorate aggregation harness.
 *
 * Given an array of `SyntheticElectorateRow` (typically the output of the
 * signature imputation bridge), produces weighted summaries of the imputed
 * node-signature population:
 *
 *   - Per-year weighted marginals for the 9 continuous position nodes
 *     (mean, sd, p10/p50/p90 of the row-level expected position) plus
 *     the per-node weighted mean salience.
 *   - Per-year weighted categorical distributions for EPS / AES (6-bin
 *     vectors) plus per-node weighted mean salience.
 *   - Per-year weighted mean salience for each of the 7 moral-boundary
 *     loadings, plus the aggregate intensity mean.
 *   - Per-year engagement mean / sd (engagement is the canonical 1-D
 *     continuous scalar, NOT activation).
 *   - Low-order joints (MAT × CD, CD × CU, MOR × PRO) as 5 × 5 weighted
 *     posterior outer-products. The plan also calls for ENG × abstention
 *     proxy if available; the synthetic-electorate contract carries no
 *     abstention proxy on the row, so this joint is **explicitly omitted
 *     and documented**.
 *   - Breakouts by `state`, `ageBucket`, `raceEthnicity`, and `sex`
 *     (weighted means of MAT / CD / MOR / engagement per group).
 *
 * Strict scope:
 *   - Pure data transform — no IO, no global state, no randomness.
 *   - **No vote prediction, no candidate distance, no abstention
 *     calibration.** The aggregator's job is to summarise the imputed
 *     signature population, not to predict outcomes.
 *   - All output carries a `mock_disclaimer` field; the smoke threads the
 *     mock-universe disclaimer through. Real-PUMS aggregations will
 *     replace this string at the smoke level.
 */

import type {
  CategoricalNodeId,
  MoralBoundaryId,
  PositionNodeId,
  SyntheticElectorateRow,
} from "./syntheticElectorateContract.js";
import {
  CATEGORICAL_NODE_IDS,
  MORAL_BOUNDARY_IDS,
  POSITION_NODE_IDS,
} from "./syntheticElectorateContract.js";

// ─── Output shape ──────────────────────────────────────────────────────────

export const SYNTHETIC_ELECTORATE_AGGREGATE_SCHEMA_VERSION = "v0.1";

export interface PositionMarginal {
  /** Weighted mean of the row-level expected position (1..5 scale). */
  mean: number;
  /** Weighted standard deviation across rows. */
  sd: number;
  /** Weighted 10th percentile of row-level expected positions. */
  p10: number;
  /** Weighted 50th percentile (median). */
  p50: number;
  /** Weighted 90th percentile. */
  p90: number;
  /** Weighted mean salience (0..3). */
  mean_salience: number;
}

export interface CategoricalMarginal {
  /** 6-bin weighted-average categorical distribution. Sums to 1. */
  distribution: number[];
  /** Weighted mean salience (0..3). */
  mean_salience: number;
}

export interface BreakoutEntry {
  group: string;
  row_count: number;
  total_weight: number;
  MAT_mean: number;
  CD_mean: number;
  MOR_mean: number;
  engagement_mean: number;
}

export interface YearAggregate {
  year: number;
  row_count: number;
  total_weight: number;
  weight_min: number;
  weight_max: number;
  position_node_marginals: Record<PositionNodeId, PositionMarginal>;
  categorical_node_distributions: Record<CategoricalNodeId, CategoricalMarginal>;
  moral_boundary_mean_salience: Record<MoralBoundaryId, number>;
  moral_boundary_intensity_mean: number;
  engagement: { mean: number; sd: number };
  low_order_joints: {
    /** 5 × 5 weighted outer-product joint over MAT (rows) × CD (cols). */
    MAT_x_CD: number[][];
    /** 5 × 5 joint over CD × CU. */
    CD_x_CU: number[][];
    /** 5 × 5 joint over MOR × PRO. */
    MOR_x_PRO: number[][];
    /**
     * The plan calls for ENG × abstention-proxy. The synthetic-electorate
     * contract carries no abstention proxy on the row (vote choice,
     * abstention, candidate distance, and counterfactual outputs are
     * downstream projections, not source fields). This joint is therefore
     * deliberately omitted and documented.
     */
    engagement_x_turnout_proxy: {
      status: "omitted";
      reason: string;
    };
  };
  breakouts: {
    by_state: BreakoutEntry[];
    by_ageBucket: BreakoutEntry[];
    by_raceEthnicity: BreakoutEntry[];
    by_sex: BreakoutEntry[];
  };
}

export interface SyntheticElectorateAggregateOutput {
  schema_version: typeof SYNTHETIC_ELECTORATE_AGGREGATE_SCHEMA_VERSION;
  /**
   * Required disclaimer — the synthetic electorate is currently a mock
   * fixture, not the real VEP universe. Smoke runners thread this string
   * through; real-PUMS aggregations replace it.
   */
  mock_disclaimer: string;
  total_rows: number;
  total_weight: number;
  years: Record<string, YearAggregate>;
}

// ─── Distribution / weighted-statistic helpers ─────────────────────────────

/** Expected position from a 5-bin posterior over positions 1..5. */
function expectedPosition(dist: readonly number[]): number {
  let s = 0;
  for (let i = 0; i < dist.length; i++) s += (i + 1) * dist[i]!;
  return s;
}

/** Expected salience from a 4-bin posterior over salience levels 0..3. */
function expectedSalience(dist: readonly number[]): number {
  let s = 0;
  for (let i = 0; i < dist.length; i++) s += i * dist[i]!;
  return s;
}

function weightedMean(values: number[], weights: number[]): number {
  let sumW = 0;
  let sumWX = 0;
  for (let i = 0; i < values.length; i++) {
    sumW += weights[i]!;
    sumWX += weights[i]! * values[i]!;
  }
  return sumW > 0 ? sumWX / sumW : 0;
}

function weightedSD(values: number[], weights: number[], mean: number): number {
  let sumW = 0;
  let sumWVar = 0;
  for (let i = 0; i < values.length; i++) {
    const d = values[i]! - mean;
    sumW += weights[i]!;
    sumWVar += weights[i]! * d * d;
  }
  return sumW > 0 ? Math.sqrt(sumWVar / sumW) : 0;
}

function weightedPercentile(values: number[], weights: number[], p: number): number {
  if (values.length === 0) return 0;
  const items = values.map((v, i) => ({ v, w: weights[i]! }))
    .sort((a, b) => a.v - b.v);
  let total = 0;
  for (const it of items) total += it.w;
  if (total <= 0) return items[items.length - 1]!.v;
  const target = total * p;
  let cum = 0;
  for (const it of items) {
    cum += it.w;
    if (cum >= target) return it.v;
  }
  return items[items.length - 1]!.v;
}

/** Weighted average of equal-length distributions; returns one distribution. */
function weightedAverageDistribution(distributions: readonly number[][], weights: number[]): number[] {
  if (distributions.length === 0) return [];
  const len = distributions[0]!.length;
  const out = new Array<number>(len).fill(0);
  let sumW = 0;
  for (let r = 0; r < distributions.length; r++) {
    const w = weights[r]!;
    sumW += w;
    const d = distributions[r]!;
    for (let i = 0; i < len; i++) out[i]! += w * d[i]!;
  }
  if (sumW > 0) for (let i = 0; i < len; i++) out[i]! /= sumW;
  return out;
}

/** Outer-product joint of two 5-bin posteriors, weighted across rows. */
function outerProductJoint(
  rows: SyntheticElectorateRow[],
  nodeA: PositionNodeId,
  nodeB: PositionNodeId,
): number[][] {
  const matrix: number[][] = Array.from({ length: 5 }, () => new Array<number>(5).fill(0));
  let sumW = 0;
  for (const r of rows) {
    const a = r.signature.positionNodes[nodeA].posPosterior;
    const b = r.signature.positionNodes[nodeB].posPosterior;
    const w = r.cellWeight;
    sumW += w;
    for (let i = 0; i < 5; i++) {
      const wai = w * a[i]!;
      for (let j = 0; j < 5; j++) {
        matrix[i]![j]! += wai * b[j]!;
      }
    }
  }
  if (sumW > 0) {
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        matrix[i]![j]! /= sumW;
      }
    }
  }
  return matrix;
}

// ─── Per-year aggregation ─────────────────────────────────────────────────

function aggregateYear(yearRows: SyntheticElectorateRow[]): YearAggregate {
  const year = yearRows[0]!.year;
  const weights = yearRows.map(r => r.cellWeight);
  let totalWeight = 0;
  let weightMin = Infinity;
  let weightMax = -Infinity;
  for (const w of weights) {
    totalWeight += w;
    if (w < weightMin) weightMin = w;
    if (w > weightMax) weightMax = w;
  }
  if (yearRows.length === 0) { weightMin = 0; weightMax = 0; }

  // Position-node marginals.
  const position_node_marginals = {} as Record<PositionNodeId, PositionMarginal>;
  for (const node of POSITION_NODE_IDS) {
    const positions = yearRows.map(r => expectedPosition(r.signature.positionNodes[node].posPosterior));
    const saliences = yearRows.map(r => expectedSalience(r.signature.positionNodes[node].salPosterior));
    const mean = weightedMean(positions, weights);
    const sd = weightedSD(positions, weights, mean);
    const p10 = weightedPercentile(positions, weights, 0.1);
    const p50 = weightedPercentile(positions, weights, 0.5);
    const p90 = weightedPercentile(positions, weights, 0.9);
    const mean_salience = weightedMean(saliences, weights);
    position_node_marginals[node] = { mean, sd, p10, p50, p90, mean_salience };
  }

  // Categorical-node marginals.
  const categorical_node_distributions = {} as Record<CategoricalNodeId, CategoricalMarginal>;
  for (const node of CATEGORICAL_NODE_IDS) {
    const dists = yearRows.map(r => r.signature.categoricalNodes[node].catDistribution as readonly number[] as number[]);
    const distribution = weightedAverageDistribution(dists, weights);
    const saliences = yearRows.map(r => expectedSalience(r.signature.categoricalNodes[node].salPosterior));
    const mean_salience = weightedMean(saliences, weights);
    categorical_node_distributions[node] = { distribution, mean_salience };
  }

  // Moral-boundary salience means.
  const moral_boundary_mean_salience = {} as Record<MoralBoundaryId, number>;
  for (const boundary of MORAL_BOUNDARY_IDS) {
    const sals = yearRows.map(r => r.signature.moralBoundaries[boundary].salience);
    moral_boundary_mean_salience[boundary] = weightedMean(sals, weights);
  }
  const intensities = yearRows.map(r => r.signature.moralBoundaries.intensity);
  const moral_boundary_intensity_mean = weightedMean(intensities, weights);

  // Engagement mean / sd.
  const engVals = yearRows.map(r => r.signature.engagement.value);
  const engMean = weightedMean(engVals, weights);
  const engSd = weightedSD(engVals, weights, engMean);

  // Low-order joints.
  const MAT_x_CD = outerProductJoint(yearRows, "MAT", "CD");
  const CD_x_CU = outerProductJoint(yearRows, "CD", "CU");
  const MOR_x_PRO = outerProductJoint(yearRows, "MOR", "PRO");

  // Breakouts.
  const breakouts = {
    by_state: breakoutBy(yearRows, weights, r => r.demographics.state),
    by_ageBucket: breakoutBy(yearRows, weights, r => r.demographics.ageBucket),
    by_raceEthnicity: breakoutBy(yearRows, weights, r => r.demographics.raceEthnicity),
    by_sex: breakoutBy(yearRows, weights, r => r.demographics.sex),
  };

  return {
    year,
    row_count: yearRows.length,
    total_weight: totalWeight,
    weight_min: weightMin,
    weight_max: weightMax,
    position_node_marginals,
    categorical_node_distributions,
    moral_boundary_mean_salience,
    moral_boundary_intensity_mean,
    engagement: { mean: engMean, sd: engSd },
    low_order_joints: {
      MAT_x_CD,
      CD_x_CU,
      MOR_x_PRO,
      engagement_x_turnout_proxy: {
        status: "omitted",
        reason:
          "SyntheticElectorateRow carries no turnout / abstention field — vote choice, abstention, candidate distance, and counterfactual outputs are downstream projections of the synthetic electorate, not source fields on the row contract. This joint will be filled when the downstream simulator publishes a per-row turnout / abstention projection.",
      },
    },
    breakouts,
  };
}

function breakoutBy(
  rows: SyntheticElectorateRow[],
  weights: number[],
  key: (r: SyntheticElectorateRow) => string,
): BreakoutEntry[] {
  const groups = new Map<string, { rows: SyntheticElectorateRow[]; weights: number[] }>();
  for (let i = 0; i < rows.length; i++) {
    const g = key(rows[i]!);
    let entry = groups.get(g);
    if (!entry) { entry = { rows: [], weights: [] }; groups.set(g, entry); }
    entry.rows.push(rows[i]!);
    entry.weights.push(weights[i]!);
  }
  const out: BreakoutEntry[] = [];
  for (const [group, { rows: gRows, weights: gW }] of groups) {
    const matVals = gRows.map(r => expectedPosition(r.signature.positionNodes.MAT.posPosterior));
    const cdVals = gRows.map(r => expectedPosition(r.signature.positionNodes.CD.posPosterior));
    const morVals = gRows.map(r => expectedPosition(r.signature.positionNodes.MOR.posPosterior));
    const engVals = gRows.map(r => r.signature.engagement.value);
    let totalW = 0;
    for (const w of gW) totalW += w;
    out.push({
      group,
      row_count: gRows.length,
      total_weight: totalW,
      MAT_mean: weightedMean(matVals, gW),
      CD_mean: weightedMean(cdVals, gW),
      MOR_mean: weightedMean(morVals, gW),
      engagement_mean: weightedMean(engVals, gW),
    });
  }
  // Stable order by group name for byte-deterministic output.
  out.sort((a, b) => a.group.localeCompare(b.group));
  return out;
}

// ─── Public entry point ────────────────────────────────────────────────────

export function runSyntheticElectorateAggregate(
  rows: SyntheticElectorateRow[],
  opts?: { mockDisclaimer?: string },
): SyntheticElectorateAggregateOutput {
  const disclaimer = opts?.mockDisclaimer
    ?? "Aggregation operates on synthetic-electorate rows; if these were built from a mock universe, the underlying population claims are NOT real VEP totals.";

  // Group by year.
  const byYear = new Map<number, SyntheticElectorateRow[]>();
  let totalWeight = 0;
  for (const r of rows) {
    let bucket = byYear.get(r.year);
    if (!bucket) { bucket = []; byYear.set(r.year, bucket); }
    bucket.push(r);
    totalWeight += r.cellWeight;
  }
  const years: Record<string, YearAggregate> = {};
  // Stable order by year for byte-deterministic output.
  const sortedYears = Array.from(byYear.keys()).sort((a, b) => a - b);
  for (const y of sortedYears) {
    years[String(y)] = aggregateYear(byYear.get(y)!);
  }

  return {
    schema_version: SYNTHETIC_ELECTORATE_AGGREGATE_SCHEMA_VERSION,
    mock_disclaimer: disclaimer,
    total_rows: rows.length,
    total_weight: totalWeight,
    years,
  };
}

// Exposed for smoke / debugging.
export const _internals = {
  expectedPosition,
  expectedSalience,
  weightedMean,
  weightedSD,
  weightedPercentile,
  weightedAverageDistribution,
  outerProductJoint,
  aggregateYear,
  breakoutBy,
};
