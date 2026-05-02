/**
 * Closed-loop error reporter.
 *
 * Consumes a CoalitionGateResult and emits a structured diagnostic that
 * tells the measurement track WHERE TO LOOK NEXT when the gate fails.
 * Diagnostic only — never auto-tunes the mapper, never mutates signatures,
 * never edits benchmark data.
 *
 * Each failure row carries:
 *   - severity bucket relative to the gate's tolerance
 *   - a ranked list of diagnoses (mapper_error, candidate_signature_error,
 *     turnout_model_error, vote_formula_error, benchmark_or_coverage_issue,
 *     unknown) with confidence + rationale
 *   - human-readable recommended inspection steps
 *
 * The report also surfaces top-level hypotheses derived from cross-failure
 * patterns (e.g. "predicted D > benchmark D in 5 of 6 failures — likely
 * D-candidate signature over-attractive") so the measurement track sees
 * the systematic story, not just per-row deltas.
 *
 * Terminology notes for diagnoses + recommendations (project conventions):
 *   - PF / TRB are not active PRISM concepts; use "moral-boundary salience"
 *     or "moral-boundary loading" when referring to identity-driven appeal.
 *   - Engagement is one-dimensional and separate; not called "activation".
 */

import type { CoalitionGateResult, SubgroupCheck, GateMetric } from "./coalitionGate.js";

export type Severity = "minor" | "moderate" | "severe";

export type DiagnosisCategory =
  | "mapper_error"
  | "candidate_signature_error"
  | "turnout_model_error"
  | "vote_formula_error"
  | "benchmark_or_coverage_issue"
  | "unknown";

export interface Diagnosis {
  category: DiagnosisCategory;
  rationale: string;
  confidence: "low" | "medium" | "high";
}

export interface FailureRow {
  subgroup: string;
  metric: GateMetric | null; // null for missing-data rows that can't be metric-checked
  predicted: number | null;
  benchmark: number | null;
  deltaPp: number | null;
  tolerancePp: number | null;
  severity: Severity;
  diagnoses: Diagnosis[];
  recommendedInspection: string[];
  isMissingData: boolean;
  missingDataKind?: "no_prediction" | "no_benchmark";
}

export interface ErrorReport {
  year: number;
  failures: FailureRow[];
  topLevelHypotheses: string[];
  summary: {
    totalFailures: number;
    severeCount: number;
    moderateCount: number;
    minorCount: number;
    coverageIssueCount: number;
  };
  meta: {
    runAt: string;
    sourceTolerancePp: number;
  };
}

export interface ErrorReporterConfig {
  /** Severity thresholds expressed as multiples of the per-row tolerance. */
  severityMultipliers?: { moderate: number; severe: number };
}

const DEFAULT_SEVERITY_MULTIPLIERS = { moderate: 1.5, severe: 3 };

function severityFor(deltaPp: number, tolerancePp: number, m: { moderate: number; severe: number }): Severity {
  const ratio = Math.abs(deltaPp) / Math.max(tolerancePp, 0.001);
  if (ratio > m.severe) return "severe";
  if (ratio > m.moderate) return "moderate";
  return "minor";
}

/**
 * Subgroup tags that map to known coalition-realignment cells. Failures here
 * are higher-stakes diagnostic targets because they indicate the model
 * isn't capturing structural shifts (white-college / non-college divergence,
 * race-by-class realignment, etc.).
 */
const REALIGNMENT_CELLS = new Set([
  "white-college",
  "white-non-college",
  "race:white",
  "race:Black",
  "race:Latino",
  "race:Asian",
  "edu:college",
  "edu:non-college",
]);

function isRealignmentCell(subgroup: string): boolean {
  return REALIGNMENT_CELLS.has(subgroup);
}

function diagnosesForFailure(
  subgroup: string,
  metric: GateMetric,
  deltaPp: number,
  severity: Severity,
): Diagnosis[] {
  const out: Diagnosis[] = [];
  const direction = deltaPp > 0 ? "over-predicting" : "under-predicting";

  if (metric === "turnout" || metric === "abstain") {
    out.push({
      category: "turnout_model_error",
      confidence: severity === "severe" ? "high" : "medium",
      rationale: `${metric} for ${subgroup} ${direction} by ${Math.abs(deltaPp).toFixed(1)}pp — engagement clearing-bar may be miscalibrated for this subgroup, OR the engagement mapper is producing the wrong distribution.`,
    });
    out.push({
      category: "mapper_error",
      confidence: "medium",
      rationale: `Engagement node mapping (one-dimensional, separate from policy nodes) may misread this subgroup's plugged-in-ness.`,
    });
    return out;
  }

  // For D / R / T / O share misses on a coalition cell:
  if (metric === "D" || metric === "R" || metric === "T" || metric === "O") {
    // Mapper error: always plausible — survey items might not be capturing the
    // signal axis that distinguishes this subgroup's vote choice.
    out.push({
      category: "mapper_error",
      confidence: severity === "severe" ? "high" : "medium",
      rationale: `${subgroup} ${metric}-share is ${direction} by ${Math.abs(deltaPp).toFixed(1)}pp. Survey-item-to-PRISM mapping for the nodes that distinguish this subgroup may be miscalibrated. ${isRealignmentCell(subgroup) ? "This is a known realignment cell; check moral-boundary loading and culturally-coded items." : ""}`.trim(),
    });

    // Candidate signature: especially if direction is consistent across many
    // subgroups, the candidate is over- or under-attractive.
    out.push({
      category: "candidate_signature_error",
      confidence: severity === "severe" ? "high" : "medium",
      rationale: `${metric === "D" ? "Democratic" : metric === "R" ? "Republican" : metric === "T" ? "Third-party" : "Other"} candidate signature may be off — check this candidate's node coding for the dimensions most salient to ${subgroup}.`,
    });

    // Vote formula: more likely on realignment cells where the issue may be
    // how morBoundary / moral-boundary salience interacts with the cell.
    if (isRealignmentCell(subgroup)) {
      out.push({
        category: "vote_formula_error",
        confidence: severity === "severe" ? "medium" : "low",
        rationale: `${subgroup} is a realignment cell. Inspect how moral-boundary salience and the salience-power weighting interact for this subgroup's dominant moral-boundary loadings.`,
      });
    }

    return out;
  }

  out.push({
    category: "unknown",
    confidence: "low",
    rationale: `Failure on metric ${metric} not covered by current diagnostic heuristics.`,
  });
  return out;
}

function recommendedInspectionFor(
  subgroup: string,
  metric: GateMetric | null,
  diagnoses: Diagnosis[],
  isMissingData: boolean,
  missingKind?: "no_prediction" | "no_benchmark",
): string[] {
  if (isMissingData) {
    if (missingKind === "no_prediction") {
      return [
        `Verify the simulator's agent population includes records tagged for "${subgroup}".`,
        `Check the demographic-tagger logic — is this subgroup definition produced from the AgentDemographics fields you supplied?`,
        `Confirm the benchmark subgroup tag spelling matches the tagger output exactly.`,
      ];
    }
    return [
      `Add a benchmark target for "${subgroup}" if this subgroup matters for gate coverage.`,
      `If this subgroup isn't load-bearing, leave as-is — by default missing benchmarks are non-failing.`,
    ];
  }

  const steps: string[] = [];
  const cats = new Set(diagnoses.map(d => d.category));

  if (cats.has("mapper_error")) {
    steps.push(
      `Open mapping/survey-to-prism.yaml; review survey items that drive the nodes most salient to "${subgroup}" (race / education / age axes for political-coalition shifts).`,
    );
    if (isRealignmentCell(subgroup)) {
      steps.push(
        `Cross-check moral-boundary loadings for ${subgroup} — uniform-mapper outputs across realignment cells often hide a load-bearing miscalibration.`,
      );
    }
  }
  if (cats.has("candidate_signature_error") && (metric === "D" || metric === "R")) {
    const cand = metric === "D" ? "Democratic" : "Republican";
    steps.push(
      `Open src/historical/candidates.ts for the relevant election; review the ${cand} candidate's node coding (especially MAT / CD / CU / ONT_S and AES if style was decisive).`,
    );
    steps.push(
      `Compare this candidate's signature against any nearby-year candidate to spot inconsistent coding.`,
    );
  }
  if (cats.has("vote_formula_error")) {
    steps.push(
      `Trace a single agent in this subgroup through respondentVoteChoice with telemetry on; see which node-impact term dominates the distance and whether that aligns with the subgroup's actual decisive axis.`,
    );
  }
  if (cats.has("turnout_model_error")) {
    steps.push(
      `Check the engagement clearing-bar in respondentVoteChoice (engagement is one-dimensional and separate from policy alignment).`,
    );
    steps.push(
      `Verify the agent-level engagement values for "${subgroup}" match plausible turnout norms for that demographic.`,
    );
  }

  if (steps.length === 0) {
    steps.push(
      `No specific inspection step inferred. Re-examine the failure row manually for context.`,
    );
  }
  return steps;
}

function buildTopLevelHypotheses(failures: FailureRow[]): string[] {
  const out: string[] = [];
  if (failures.length === 0) return out;

  const metricFails = failures.filter(f => !f.isMissingData && f.metric != null);

  // Pattern 1: D-share over-prediction (Dem candidate too attractive)
  const dFails = metricFails.filter(f => f.metric === "D");
  if (dFails.length >= 3) {
    const overCount = dFails.filter(f => (f.deltaPp ?? 0) > 0).length;
    if (overCount / dFails.length >= 0.7) {
      out.push(
        `Predicted D share exceeds benchmark in ${overCount}/${dFails.length} D-failures — likely candidate_signature_error: the Democratic candidate is systematically over-attractive across subgroups.`,
      );
    } else if (dFails.length - overCount >= dFails.length * 0.7) {
      out.push(
        `Predicted D share trails benchmark in ${dFails.length - overCount}/${dFails.length} D-failures — likely candidate_signature_error: the Democratic candidate is systematically under-attractive across subgroups.`,
      );
    }
  }

  // Pattern 2: R-share systematic miss
  const rFails = metricFails.filter(f => f.metric === "R");
  if (rFails.length >= 3) {
    const overCount = rFails.filter(f => (f.deltaPp ?? 0) > 0).length;
    if (overCount / rFails.length >= 0.7) {
      out.push(
        `Predicted R share exceeds benchmark in ${overCount}/${rFails.length} R-failures — likely candidate_signature_error: the Republican candidate is systematically over-attractive across subgroups.`,
      );
    } else if (rFails.length - overCount >= rFails.length * 0.7) {
      out.push(
        `Predicted R share trails benchmark in ${rFails.length - overCount}/${rFails.length} R-failures — likely candidate_signature_error: the Republican candidate is systematically under-attractive across subgroups.`,
      );
    }
  }

  // Pattern 3: realignment-cell concentration
  const realignFails = metricFails.filter(f => isRealignmentCell(f.subgroup));
  if (realignFails.length >= 2 && realignFails.length / metricFails.length >= 0.5) {
    out.push(
      `${realignFails.length}/${metricFails.length} failures are on coalition realignment cells (white-college / non-college / race-by-education) — likely mapper_error: survey-to-PRISM mapping may not capture the realignment axis. Inspect moral-boundary loadings for these cells.`,
    );
  }

  // Pattern 4: turnout-system-wide
  const turnoutFails = metricFails.filter(f => f.metric === "turnout" || f.metric === "abstain");
  if (turnoutFails.length >= 2) {
    out.push(
      `${turnoutFails.length} turnout/abstain failures across subgroups — likely turnout_model_error: clearing-bar or engagement mapper systematically off. Engagement is one-dimensional and lives outside the per-node Bayesian layer; treat as a separate calibration target.`,
    );
  }

  // Pattern 5: coverage cluster
  const coverageFails = failures.filter(f => f.isMissingData);
  if (coverageFails.length >= 3) {
    out.push(
      `${coverageFails.length} coverage-related issues — likely benchmark_or_coverage_issue: tagger / benchmark-tag alignment needs review before re-running the gate.`,
    );
  }

  if (out.length === 0) {
    out.push(
      `No systematic cross-failure pattern detected. Each failure row stands on its own; treat per-row diagnoses as the working theory.`,
    );
  }
  return out;
}

const SEVERITY_RANK: Record<Severity, number> = { severe: 0, moderate: 1, minor: 2 };

export function buildErrorReport(
  gate: CoalitionGateResult,
  config?: ErrorReporterConfig,
): ErrorReport {
  const severityMult = config?.severityMultipliers ?? DEFAULT_SEVERITY_MULTIPLIERS;
  const failures: FailureRow[] = [];

  for (const sub of gate.subgroups) {
    if (sub.passed && !sub.missingReason) continue;
    if (sub.missingReason) {
      const tolerance = gate.config.defaultTolerancePp;
      // Coverage rows are always "moderate" by convention — they don't have
      // a delta to scale by — and are surfaced even if `passed` is true under
      // permissive coverage config (so they show up in the report as "things
      // to look at" without being blockers).
      const isFail = !sub.passed;
      if (!isFail && sub.missingReason === "no_benchmark") continue; // benign, hide
      failures.push({
        subgroup: sub.subgroup,
        metric: null,
        predicted: null,
        benchmark: null,
        deltaPp: null,
        tolerancePp: tolerance,
        severity: "moderate",
        diagnoses: [{
          category: "benchmark_or_coverage_issue",
          confidence: "high",
          rationale: sub.missingReason === "no_prediction"
            ? `Benchmark provided for "${sub.subgroup}" but the simulator produced no agent matching this subgroup tag.`
            : `Subgroup "${sub.subgroup}" appears in the prediction but no benchmark was supplied.`,
        }],
        recommendedInspection: recommendedInspectionFor(sub.subgroup, null, [], true, sub.missingReason),
        isMissingData: true,
        missingDataKind: sub.missingReason,
      });
      continue;
    }

    // Metric-checked subgroup that failed at least one metric — emit a row per failed metric.
    for (const m of sub.metrics) {
      if (m.passed) continue;
      const sev = severityFor(m.deltaPp, m.tolerancePp, severityMult);
      const diag = diagnosesForFailure(sub.subgroup, m.metric, m.deltaPp, sev);
      failures.push({
        subgroup: sub.subgroup,
        metric: m.metric,
        predicted: m.predicted,
        benchmark: m.benchmark,
        deltaPp: m.deltaPp,
        tolerancePp: m.tolerancePp,
        severity: sev,
        diagnoses: diag,
        recommendedInspection: recommendedInspectionFor(sub.subgroup, m.metric, diag, false),
        isMissingData: false,
      });
    }
  }

  // Sort: severe first, then moderate, then minor; ties broken by |delta| descending,
  // then alphabetical subgroup.
  failures.sort((a, b) => {
    if (a.severity !== b.severity) return SEVERITY_RANK[a.severity] - SEVERITY_RANK[b.severity];
    const da = Math.abs(a.deltaPp ?? 0);
    const db = Math.abs(b.deltaPp ?? 0);
    if (da !== db) return db - da;
    return a.subgroup.localeCompare(b.subgroup);
  });

  const summary = {
    totalFailures: failures.length,
    severeCount: failures.filter(f => f.severity === "severe").length,
    moderateCount: failures.filter(f => f.severity === "moderate").length,
    minorCount: failures.filter(f => f.severity === "minor").length,
    coverageIssueCount: failures.filter(f => f.isMissingData).length,
  };

  return {
    year: gate.year,
    failures,
    topLevelHypotheses: buildTopLevelHypotheses(failures),
    summary,
    meta: {
      runAt: new Date().toISOString(),
      sourceTolerancePp: gate.config.defaultTolerancePp,
    },
  };
}
