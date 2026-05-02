/**
 * Coalition gate — evaluates a CoalitionDecomposition against benchmark
 * subgroup targets within configurable tolerance.
 *
 * The gate is the formal pass/fail decision the master plan calls "G2"
 * (and its repeats). It does NOT decide what's a "good" coalition shape —
 * the benchmarks supply that; the gate just compares predicted to expected
 * within an explicit tolerance and reports per-subgroup deltas.
 *
 * Default checks: D and R share-of-turnout per subgroup, ±7pp tolerance.
 * The metrics list and tolerance can be overridden globally, by metric,
 * or by subgroup.
 *
 * Missing-data semantics:
 *   - Subgroup in decomposition but not in benchmarks → reported in
 *     overall.missingBenchmarks. Not a failure unless config requires
 *     full coverage.
 *   - Subgroup in benchmarks but not in decomposition → reported in
 *     overall.missingPredictions. Counts as a failure for that subgroup
 *     by default (you asked the gate to check it; the simulator didn't
 *     produce it).
 *
 * This module does NOT compute decompositions (that's C2) and does NOT
 * own benchmark data (that's downstream — eventually exit polls / CES
 * cells; for now synthetic).
 */

import type { CoalitionDecomposition, CoalitionShare } from "./coalitionDecomposition.js";

export type GateMetric = "D" | "R" | "T" | "O" | "turnout" | "abstain";

export const DEFAULT_METRICS: GateMetric[] = ["D", "R"];
export const DEFAULT_TOLERANCE_PP = 7;

export interface SubgroupBenchmark {
  /** Subgroup tag, e.g. "white-college" or "race:Black". Must match a tag from the tagger. */
  subgroup: string;
  /** Expected share-of-turnout per party (D/R/T/O). Each value in [0, 1]. */
  byParty?: Partial<Record<"D" | "R" | "T" | "O", number>>;
  /** Optional expected turnout rate within the subgroup. */
  turnoutRate?: number;
  /** Optional expected abstain rate. */
  abstainRate?: number;
  /** Provenance label for the dashboard / audit trail. */
  source?: string;
}

export interface ToleranceConfig {
  /** Default ±N percentage points (default: 7). */
  defaultPp?: number;
  /** Per-metric override. */
  byMetric?: Partial<Record<GateMetric, number>>;
  /** Per-subgroup override. */
  bySubgroup?: Record<string, number>;
}

export interface CoalitionGateConfig {
  metrics?: GateMetric[];
  tolerance?: ToleranceConfig;
  /** If true, missing-benchmark subgroups count as failures. Default false. */
  requireFullBenchmarkCoverage?: boolean;
  /** If true, missing-prediction subgroups count as failures. Default true. */
  requireFullPredictionCoverage?: boolean;
}

export interface SubgroupMetricCheck {
  metric: GateMetric;
  predicted: number;
  benchmark: number;
  /** predicted - benchmark, in percentage points. */
  deltaPp: number;
  tolerancePp: number;
  passed: boolean;
}

export interface SubgroupCheck {
  subgroup: string;
  hasBenchmark: boolean;
  hasPrediction: boolean;
  passed: boolean;
  metrics: SubgroupMetricCheck[];
  missingReason?: "no_benchmark" | "no_prediction";
  /** Source label from benchmark (for traceability). */
  benchmarkSource?: string;
  /** Predicted subgroup weight as fraction of electorate (when available). */
  shareOfElectorate?: number;
}

export interface CoalitionGateResult {
  year: number;
  passed: boolean;
  subgroups: SubgroupCheck[];
  overall: {
    totalChecked: number;
    passedCount: number;
    failedCount: number;
    missingBenchmarks: string[];
    missingPredictions: string[];
  };
  config: {
    metrics: GateMetric[];
    defaultTolerancePp: number;
    requireFullBenchmarkCoverage: boolean;
    requireFullPredictionCoverage: boolean;
  };
  meta: {
    runAt: string;
  };
}

function readPredicted(share: CoalitionShare, metric: GateMetric): number {
  switch (metric) {
    case "D": return share.byParty.D.voteShareOfTurnout;
    case "R": return share.byParty.R.voteShareOfTurnout;
    case "T": return share.byParty.T.voteShareOfTurnout;
    case "O": return share.byParty.O.voteShareOfTurnout;
    case "turnout": return share.turnoutRate;
    case "abstain": return share.abstainRate;
  }
}

function readBenchmark(b: SubgroupBenchmark, metric: GateMetric): number | undefined {
  switch (metric) {
    case "D": return b.byParty?.D;
    case "R": return b.byParty?.R;
    case "T": return b.byParty?.T;
    case "O": return b.byParty?.O;
    case "turnout": return b.turnoutRate;
    case "abstain": return b.abstainRate;
  }
}

function tolerancePpFor(
  config: ToleranceConfig,
  metric: GateMetric,
  subgroup: string,
): number {
  if (config.bySubgroup?.[subgroup] != null) return config.bySubgroup[subgroup]!;
  if (config.byMetric?.[metric] != null) return config.byMetric[metric]!;
  return config.defaultPp ?? DEFAULT_TOLERANCE_PP;
}

export function evaluateCoalitionGate(
  decomp: CoalitionDecomposition,
  benchmarks: SubgroupBenchmark[],
  config?: CoalitionGateConfig,
): CoalitionGateResult {
  const metrics = config?.metrics ?? DEFAULT_METRICS;
  const tolerance = config?.tolerance ?? {};
  const defaultPp = tolerance.defaultPp ?? DEFAULT_TOLERANCE_PP;
  const requireBench = config?.requireFullBenchmarkCoverage ?? false;
  const requirePred = config?.requireFullPredictionCoverage ?? true;

  const predBySubgroup = new Map<string, CoalitionShare>();
  for (const s of decomp.subgroups) predBySubgroup.set(s.subgroup, s);

  const benchBySubgroup = new Map<string, SubgroupBenchmark>();
  for (const b of benchmarks) benchBySubgroup.set(b.subgroup, b);

  const subgroupNames = new Set<string>([
    ...predBySubgroup.keys(),
    ...benchBySubgroup.keys(),
  ]);

  const checks: SubgroupCheck[] = [];
  const missingBenchmarks: string[] = [];
  const missingPredictions: string[] = [];

  for (const name of subgroupNames) {
    const pred = predBySubgroup.get(name);
    const bench = benchBySubgroup.get(name);

    if (!pred && !bench) continue; // shouldn't happen given the union above

    if (!bench) {
      missingBenchmarks.push(name);
      checks.push({
        subgroup: name,
        hasBenchmark: false,
        hasPrediction: true,
        passed: !requireBench,
        metrics: [],
        missingReason: "no_benchmark",
        shareOfElectorate: pred?.shareOfElectorate,
      });
      continue;
    }

    if (!pred) {
      missingPredictions.push(name);
      checks.push({
        subgroup: name,
        hasBenchmark: true,
        hasPrediction: false,
        passed: !requirePred,
        metrics: [],
        missingReason: "no_prediction",
        benchmarkSource: bench.source,
      });
      continue;
    }

    // Both present — evaluate metrics.
    const metricChecks: SubgroupMetricCheck[] = [];
    for (const m of metrics) {
      const benchVal = readBenchmark(bench, m);
      if (benchVal == null) continue; // benchmark doesn't supply this metric — skip silently
      const predVal = readPredicted(pred, m);
      const deltaPp = (predVal - benchVal) * 100;
      const tolPp = tolerancePpFor(tolerance, m, name);
      metricChecks.push({
        metric: m,
        predicted: predVal,
        benchmark: benchVal,
        deltaPp,
        tolerancePp: tolPp,
        passed: Math.abs(deltaPp) <= tolPp,
      });
    }
    const allPassed = metricChecks.length > 0 && metricChecks.every(m => m.passed);
    checks.push({
      subgroup: name,
      hasBenchmark: true,
      hasPrediction: true,
      passed: allPassed,
      metrics: metricChecks,
      benchmarkSource: bench.source,
      shareOfElectorate: pred.shareOfElectorate,
    });
  }

  // Sort: failures first (loud), then missing, then passing; alphabetical within a tier.
  const tierOf = (c: SubgroupCheck): number => {
    if (c.metrics.length > 0 && !c.passed) return 0; // hard fails
    if (c.missingReason) return 1; // missing one side
    return 2; // pass
  };
  checks.sort((a, b) => {
    const ta = tierOf(a), tb = tierOf(b);
    if (ta !== tb) return ta - tb;
    return a.subgroup.localeCompare(b.subgroup);
  });

  const totalChecked = checks.filter(c => c.metrics.length > 0).length;
  const passedCount = checks.filter(c => c.passed).length;
  const failedCount = checks.length - passedCount;
  const overallPassed = checks.length > 0 && checks.every(c => c.passed);

  return {
    year: decomp.year,
    passed: overallPassed,
    subgroups: checks,
    overall: {
      totalChecked,
      passedCount,
      failedCount,
      missingBenchmarks,
      missingPredictions,
    },
    config: {
      metrics,
      defaultTolerancePp: defaultPp,
      requireFullBenchmarkCoverage: requireBench,
      requireFullPredictionCoverage: requirePred,
    },
    meta: {
      runAt: new Date().toISOString(),
    },
  };
}
