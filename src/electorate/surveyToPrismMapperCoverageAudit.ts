/**
 * Phase 2.7.7 — Survey-to-PRISM mapper coverage audit.
 *
 * Read-only diagnostic. Loads CCES/CES microdata per year, maps each
 * respondent to a `SurveyPrismSignature` via the existing v0 mapper, and
 * audits **per target** how much of the resulting synthetic-electorate
 * signature is filled by real survey signal vs by the mapper's uniform-
 * prior fallback.
 *
 * Per-target metrics:
 *   - Weighted % rows where the target's provenance.source is "real_signal".
 *   - Weighted % rows where source is "fallback".
 *   - Weighted % rows where partyIdDerived is true (only ever non-zero for
 *     `moralBoundaries.political_camp` per the mapper's design).
 *   - Weighted distribution of provenance.uncertainty (low / medium / high).
 *   - Top source fields actually consumed (raw column names) ordered by
 *     weighted use.
 *   - Per-target marginal summary (weighted average of the position
 *     posterior, the categorical distribution, the salience scalar, or the
 *     engagement value depending on target kind) plus a "near uniform /
 *     near fallback" flag.
 *   - Blocker labels: a target is flagged as a signature blocker if
 *     (a) weighted real-signal coverage < 25% OR (b) the weighted marginal
 *     is indistinguishable from the mapper's fallback prior.
 *
 * Vote-choice scrub spy: maps all respondents twice — once with the real
 * `voteChoiceObserved`, once scrubbed to "Unknown" — and asserts the
 * SurveyPrismSignature output is byte-identical (vote choice is forbidden
 * as a mapper input).
 *
 * Strict scope:
 *   - Read-only. The mapper is NOT modified. The audit cannot tune
 *     anything.
 *   - No vote prediction, candidate distance, abstention calibration, or
 *     scorer fields are emitted.
 *   - voteChoiceObserved is consumed only by the scrub spy, never as a
 *     diagnostic feature.
 *
 * Outputs:
 *   results/electorate/synthetic-electorate/survey-to-prism-mapper-coverage-audit.json
 *   results/electorate/synthetic-electorate/survey-to-prism-mapper-coverage-audit.md
 *
 * Usage:
 *   npx tsx src/electorate/surveyToPrismMapperCoverageAudit.ts
 */

import * as fs from "node:fs";
import * as path from "node:path";

import { loadSurveyRespondents } from "./cesBacktestLoader.js";
import {
  mapSurveyToPrism,
  type CatDist6,
  type ContinuousNodeSignature,
  type MoralBoundaryEntry,
  type NodeProvenance,
  type PosDist5,
  type SalDist4,
  type SurveyPrismSignature,
  type Uncertainty,
} from "./surveyToPrismMapper.js";
import type { WeightedSurveyRespondent } from "./surveyBacktestTypes.js";

// ─── Config ────────────────────────────────────────────────────────────────

const SAMPLE_ROW_LIMIT = 5000;
const NEAR_UNIFORM_SPREAD_THRESHOLD = 0.005; // max-min of weighted avg dist
const ENGAGEMENT_FALLBACK_DEFAULT = 5.0;
const ENGAGEMENT_FALLBACK_TOLERANCE = 0.5;
const BOUNDARY_FALLBACK_DEFAULT = 1.0;
const BOUNDARY_FALLBACK_TOLERANCE = 0.1;
const REAL_SIGNAL_BLOCKER_THRESHOLD = 0.25;

interface YearTarget {
  year: 2008 | 2012 | 2016 | 2020 | 2024;
  filePath: string;
}

const YEAR_TARGETS: YearTarget[] = [
  { year: 2008, filePath: "data/cces2008/cces_2008_common.tab" },
  { year: 2012, filePath: "data/cces2012/CCES12_Common_VV.tab" },
  { year: 2016, filePath: "data/cces2016/CCES16_Common_OUTPUT_Feb2018_VV.tab" },
  { year: 2020, filePath: "data/cces2020/CES20_Common_OUTPUT_vv.csv" },
  { year: 2024, filePath: "data/cces2024/CCES24_Common_OUTPUT_vv_topost_final.csv" },
];

const POSITION_NODES = ["MAT", "CD", "CU", "MOR", "PRO", "COM", "ZS", "ONT_H", "ONT_S"] as const;
const CATEGORICAL_NODES = ["EPS", "AES"] as const;
const MORAL_BOUNDARIES = [
  "national", "ethnic_racial", "religious", "class", "ideological", "gender", "political_camp",
] as const;

type PositionNodeName = typeof POSITION_NODES[number];
type CategoricalNodeName = typeof CATEGORICAL_NODES[number];
type MoralBoundaryName = typeof MORAL_BOUNDARIES[number];

type TargetKind = "continuous" | "categorical" | "engagement" | "moral_boundary" | "intensity";

interface MarginalSummary {
  /** Position posterior or categorical distribution (weighted average) — present for continuous + categorical kinds. */
  weighted_avg_distribution?: number[];
  /** max(dist) - min(dist) — used as the "near uniform" probe. */
  spread?: number;
  /** Weighted expected value on the position scale (1..5 for continuous, mean salience for moral_boundary). */
  weighted_mean?: number;
  /** Weighted standard deviation of the per-row scalar. */
  weighted_sd?: number;
  /** For engagement / boundary scalars: |mean − fallback_default|. */
  distance_from_fallback_default?: number;
}

interface PerTargetCoverage {
  target_name: string;
  target_kind: TargetKind;
  rows_observed: number;
  weighted_real_signal_pct: number;
  weighted_fallback_pct: number;
  weighted_party_id_derived_pct: number;
  uncertainty_weighted_share: { low: number; medium: number; high: number };
  /** Numeric mean uncertainty (low=1, medium=2, high=3). */
  mean_uncertainty_score: number;
  top_source_fields: Array<{ field: string; weighted_use_pct: number }>;
  marginal_summary: MarginalSummary;
  near_uniform_or_fallback: boolean;
  blocker_reasons: string[];
}

interface YearAudit {
  year: number;
  rows_mapped: number;
  total_weight: number;
  per_row_target_count: number; // always 20 in v0
  aggregate_provenance: {
    weighted_mean_real_signal_per_row: number;
    weighted_mean_fallback_per_row: number;
    weighted_mean_party_id_derived_per_row: number;
  };
  per_target: PerTargetCoverage[];
  signature_blockers: Array<{ target: string; reasons: string[] }>;
}

// ─── Helpers ───────────────────────────────────────────────────────────────

function uncertaintyScore(u: Uncertainty): number {
  return u === "low" ? 1 : u === "medium" ? 2 : 3;
}

function weightedSum(values: number[], weights: number[]): number {
  let s = 0;
  for (let i = 0; i < values.length; i++) s += values[i]! * weights[i]!;
  return s;
}

function weightedAverageDist(distributions: number[][], weights: number[]): number[] {
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

function weightedScalarMean(values: number[], weights: number[]): number {
  let sumW = 0;
  let sumWX = 0;
  for (let i = 0; i < values.length; i++) {
    sumW += weights[i]!;
    sumWX += weights[i]! * values[i]!;
  }
  return sumW > 0 ? sumWX / sumW : 0;
}

function weightedScalarSD(values: number[], weights: number[], mean: number): number {
  let sumW = 0;
  let sumWVar = 0;
  for (let i = 0; i < values.length; i++) {
    const d = values[i]! - mean;
    sumW += weights[i]!;
    sumWVar += weights[i]! * d * d;
  }
  return sumW > 0 ? Math.sqrt(sumWVar / sumW) : 0;
}

function spread(dist: number[]): number {
  if (dist.length === 0) return 0;
  return Math.max(...dist) - Math.min(...dist);
}

interface ProvenanceObservation {
  provenance: NodeProvenance;
  weight: number;
}

function summarizeProvenance(observations: ProvenanceObservation[]): {
  weighted_real_signal_pct: number;
  weighted_fallback_pct: number;
  weighted_party_id_derived_pct: number;
  uncertainty_weighted_share: { low: number; medium: number; high: number };
  mean_uncertainty_score: number;
  top_source_fields: Array<{ field: string; weighted_use_pct: number }>;
} {
  let totalW = 0;
  let realSignalW = 0;
  let fallbackW = 0;
  let pidDerivedW = 0;
  const uncW: Record<Uncertainty, number> = { low: 0, medium: 0, high: 0 };
  const fieldW = new Map<string, number>();
  for (const o of observations) {
    const w = o.weight;
    totalW += w;
    if (o.provenance.source === "real_signal") realSignalW += w; else fallbackW += w;
    if (o.provenance.partyIdDerived) pidDerivedW += w;
    uncW[o.provenance.uncertainty] += w;
    for (const f of o.provenance.vars) {
      // Skip the synthetic intensity marker; it's not a real column.
      if (f === "__derived_from_boundaries__") continue;
      fieldW.set(f, (fieldW.get(f) ?? 0) + w);
    }
  }
  const pct = (x: number) => totalW > 0 ? (x / totalW) * 100 : 0;
  const meanUncScore = totalW > 0
    ? (uncW.low * 1 + uncW.medium * 2 + uncW.high * 3) / totalW
    : 0;
  const topFields = Array.from(fieldW.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([field, w]) => ({ field, weighted_use_pct: totalW > 0 ? (w / totalW) * 100 : 0 }));
  return {
    weighted_real_signal_pct: pct(realSignalW),
    weighted_fallback_pct: pct(fallbackW),
    weighted_party_id_derived_pct: pct(pidDerivedW),
    uncertainty_weighted_share: {
      low: pct(uncW.low),
      medium: pct(uncW.medium),
      high: pct(uncW.high),
    },
    mean_uncertainty_score: meanUncScore,
    top_source_fields: topFields,
  };
}

function expectedPositionFromDist(dist: PosDist5): number {
  return dist[0] * 1 + dist[1] * 2 + dist[2] * 3 + dist[3] * 4 + dist[4] * 5;
}

function buildContinuousCoverage(
  name: PositionNodeName,
  signatures: SurveyPrismSignature[],
  weights: number[],
): PerTargetCoverage {
  const observations: ProvenanceObservation[] = [];
  const dists: number[][] = [];
  const positions: number[] = [];
  for (let i = 0; i < signatures.length; i++) {
    const node = signatures[i]![name] as ContinuousNodeSignature;
    observations.push({ provenance: node.provenance, weight: weights[i]! });
    dists.push([...node.posPosterior]);
    positions.push(expectedPositionFromDist(node.posPosterior));
  }
  const prov = summarizeProvenance(observations);
  const avgDist = weightedAverageDist(dists, weights);
  const sp = spread(avgDist);
  const meanPos = weightedScalarMean(positions, weights);
  const sdPos = weightedScalarSD(positions, weights, meanPos);
  const nearUniform = sp < NEAR_UNIFORM_SPREAD_THRESHOLD;
  const blocker_reasons: string[] = [];
  if (prov.weighted_real_signal_pct < REAL_SIGNAL_BLOCKER_THRESHOLD * 100) {
    blocker_reasons.push(`real-signal coverage ${prov.weighted_real_signal_pct.toFixed(1)}% < ${REAL_SIGNAL_BLOCKER_THRESHOLD * 100}%`);
  }
  if (nearUniform) {
    blocker_reasons.push(`weighted marginal indistinguishable from uniform [0.2,0.2,0.2,0.2,0.2] (spread=${sp.toExponential(2)})`);
  }
  return {
    target_name: name,
    target_kind: "continuous",
    rows_observed: signatures.length,
    ...prov,
    marginal_summary: {
      weighted_avg_distribution: avgDist,
      spread: sp,
      weighted_mean: meanPos,
      weighted_sd: sdPos,
    },
    near_uniform_or_fallback: nearUniform,
    blocker_reasons,
  };
}

function buildCategoricalCoverage(
  name: CategoricalNodeName,
  signatures: SurveyPrismSignature[],
  weights: number[],
): PerTargetCoverage {
  const observations: ProvenanceObservation[] = [];
  const dists: number[][] = [];
  for (let i = 0; i < signatures.length; i++) {
    const node = signatures[i]![name];
    observations.push({ provenance: node.provenance, weight: weights[i]! });
    dists.push([...node.catDistribution as unknown as number[]]);
  }
  const prov = summarizeProvenance(observations);
  const avgDist = weightedAverageDist(dists, weights);
  const sp = spread(avgDist);
  const nearUniform = sp < NEAR_UNIFORM_SPREAD_THRESHOLD;
  const blocker_reasons: string[] = [];
  if (prov.weighted_real_signal_pct < REAL_SIGNAL_BLOCKER_THRESHOLD * 100) {
    blocker_reasons.push(`real-signal coverage ${prov.weighted_real_signal_pct.toFixed(1)}% < ${REAL_SIGNAL_BLOCKER_THRESHOLD * 100}%`);
  }
  if (nearUniform) {
    blocker_reasons.push(`weighted 6-bin distribution indistinguishable from uniform [1/6 × 6] (spread=${sp.toExponential(2)})`);
  }
  return {
    target_name: name,
    target_kind: "categorical",
    rows_observed: signatures.length,
    ...prov,
    marginal_summary: {
      weighted_avg_distribution: avgDist,
      spread: sp,
    },
    near_uniform_or_fallback: nearUniform,
    blocker_reasons,
  };
}

function buildEngagementCoverage(
  signatures: SurveyPrismSignature[],
  weights: number[],
): PerTargetCoverage {
  const observations: ProvenanceObservation[] = [];
  const values: number[] = [];
  for (let i = 0; i < signatures.length; i++) {
    observations.push({ provenance: signatures[i]!.engagement.provenance, weight: weights[i]! });
    values.push(signatures[i]!.engagement.value);
  }
  const prov = summarizeProvenance(observations);
  const mean = weightedScalarMean(values, weights);
  const sd = weightedScalarSD(values, weights, mean);
  const dist = Math.abs(mean - ENGAGEMENT_FALLBACK_DEFAULT);
  const nearFallback = dist < ENGAGEMENT_FALLBACK_TOLERANCE && sd < 0.5;
  const blocker_reasons: string[] = [];
  if (prov.weighted_real_signal_pct < REAL_SIGNAL_BLOCKER_THRESHOLD * 100) {
    blocker_reasons.push(`real-signal coverage ${prov.weighted_real_signal_pct.toFixed(1)}% < ${REAL_SIGNAL_BLOCKER_THRESHOLD * 100}%`);
  }
  if (nearFallback) {
    blocker_reasons.push(`weighted mean ≈ engagement fallback default ${ENGAGEMENT_FALLBACK_DEFAULT} (mean=${mean.toFixed(2)}, sd=${sd.toFixed(2)})`);
  }
  return {
    target_name: "engagement",
    target_kind: "engagement",
    rows_observed: signatures.length,
    ...prov,
    marginal_summary: {
      weighted_mean: mean,
      weighted_sd: sd,
      distance_from_fallback_default: dist,
    },
    near_uniform_or_fallback: nearFallback,
    blocker_reasons,
  };
}

function buildMoralBoundaryCoverage(
  name: MoralBoundaryName,
  signatures: SurveyPrismSignature[],
  weights: number[],
): PerTargetCoverage {
  const observations: ProvenanceObservation[] = [];
  const values: number[] = [];
  for (let i = 0; i < signatures.length; i++) {
    const entry = signatures[i]!.moralBoundaries[name] as MoralBoundaryEntry;
    observations.push({ provenance: entry.provenance, weight: weights[i]! });
    values.push(entry.salience);
  }
  const prov = summarizeProvenance(observations);
  const mean = weightedScalarMean(values, weights);
  const sd = weightedScalarSD(values, weights, mean);
  const dist = Math.abs(mean - BOUNDARY_FALLBACK_DEFAULT);
  const nearFallback = dist < BOUNDARY_FALLBACK_TOLERANCE && sd < 0.05;
  const blocker_reasons: string[] = [];
  if (prov.weighted_real_signal_pct < REAL_SIGNAL_BLOCKER_THRESHOLD * 100) {
    blocker_reasons.push(`real-signal coverage ${prov.weighted_real_signal_pct.toFixed(1)}% < ${REAL_SIGNAL_BLOCKER_THRESHOLD * 100}%`);
  }
  if (nearFallback) {
    blocker_reasons.push(`weighted mean salience ≈ boundary fallback default ${BOUNDARY_FALLBACK_DEFAULT} (mean=${mean.toFixed(3)}, sd=${sd.toFixed(3)})`);
  }
  return {
    target_name: `moralBoundaries.${name}`,
    target_kind: "moral_boundary",
    rows_observed: signatures.length,
    ...prov,
    marginal_summary: {
      weighted_mean: mean,
      weighted_sd: sd,
      distance_from_fallback_default: dist,
    },
    near_uniform_or_fallback: nearFallback,
    blocker_reasons,
  };
}

function buildIntensityCoverage(
  signatures: SurveyPrismSignature[],
  weights: number[],
): PerTargetCoverage {
  const observations: ProvenanceObservation[] = [];
  const values: number[] = [];
  for (let i = 0; i < signatures.length; i++) {
    observations.push({ provenance: signatures[i]!.moralBoundaries.intensityProvenance, weight: weights[i]! });
    values.push(signatures[i]!.moralBoundaries.intensity);
  }
  const prov = summarizeProvenance(observations);
  const mean = weightedScalarMean(values, weights);
  const sd = weightedScalarSD(values, weights, mean);
  const dist = Math.abs(mean - BOUNDARY_FALLBACK_DEFAULT);
  const nearFallback = dist < BOUNDARY_FALLBACK_TOLERANCE && sd < 0.05;
  const blocker_reasons: string[] = [];
  if (prov.weighted_real_signal_pct < REAL_SIGNAL_BLOCKER_THRESHOLD * 100) {
    blocker_reasons.push(`real-signal coverage ${prov.weighted_real_signal_pct.toFixed(1)}% < ${REAL_SIGNAL_BLOCKER_THRESHOLD * 100}%`);
  }
  if (nearFallback) {
    blocker_reasons.push(`weighted mean intensity ≈ fallback default ${BOUNDARY_FALLBACK_DEFAULT} (mean=${mean.toFixed(3)})`);
  }
  return {
    target_name: "moralBoundaries.intensity",
    target_kind: "intensity",
    rows_observed: signatures.length,
    ...prov,
    marginal_summary: {
      weighted_mean: mean,
      weighted_sd: sd,
      distance_from_fallback_default: dist,
    },
    near_uniform_or_fallback: nearFallback,
    blocker_reasons,
  };
}

function auditYear(signatures: SurveyPrismSignature[]): YearAudit {
  const weights = signatures.map(s => s.weight);
  const totalW = weights.reduce((a, b) => a + b, 0);
  const year = signatures[0]?.year ?? 0;

  // Per-row aggregate provenance: across all 20 targets per row, what are the
  // counts of real_signal vs fallback vs partyIdDerived. We use the
  // signature.coverage counts directly (real_signal / fallback) and count
  // partyIdDerived per row by walking provenances.
  const realPerRow: number[] = [];
  const fallbackPerRow: number[] = [];
  const pidDerivedPerRow: number[] = [];
  for (const sig of signatures) {
    realPerRow.push(sig.coverage.realSignalCount);
    fallbackPerRow.push(sig.coverage.fallbackCount);
    let pid = 0;
    const provenances: NodeProvenance[] = [
      sig.MAT.provenance, sig.CD.provenance, sig.CU.provenance, sig.MOR.provenance,
      sig.PRO.provenance, sig.COM.provenance, sig.ZS.provenance, sig.ONT_H.provenance, sig.ONT_S.provenance,
      sig.EPS.provenance, sig.AES.provenance,
      sig.engagement.provenance,
      sig.moralBoundaries.national.provenance, sig.moralBoundaries.ethnic_racial.provenance,
      sig.moralBoundaries.religious.provenance, sig.moralBoundaries.class.provenance,
      sig.moralBoundaries.ideological.provenance, sig.moralBoundaries.gender.provenance,
      sig.moralBoundaries.political_camp.provenance,
      sig.moralBoundaries.intensityProvenance,
    ];
    for (const p of provenances) if (p.partyIdDerived) pid++;
    pidDerivedPerRow.push(pid);
  }

  const per_target: PerTargetCoverage[] = [];
  for (const node of POSITION_NODES) per_target.push(buildContinuousCoverage(node, signatures, weights));
  for (const node of CATEGORICAL_NODES) per_target.push(buildCategoricalCoverage(node, signatures, weights));
  per_target.push(buildEngagementCoverage(signatures, weights));
  for (const b of MORAL_BOUNDARIES) per_target.push(buildMoralBoundaryCoverage(b, signatures, weights));
  per_target.push(buildIntensityCoverage(signatures, weights));

  const signature_blockers = per_target
    .filter(t => t.blocker_reasons.length > 0)
    .map(t => ({ target: t.target_name, reasons: t.blocker_reasons }));

  return {
    year,
    rows_mapped: signatures.length,
    total_weight: totalW,
    per_row_target_count: 20,
    aggregate_provenance: {
      weighted_mean_real_signal_per_row: weightedScalarMean(realPerRow, weights),
      weighted_mean_fallback_per_row: weightedScalarMean(fallbackPerRow, weights),
      weighted_mean_party_id_derived_per_row: weightedScalarMean(pidDerivedPerRow, weights),
    },
    per_target,
    signature_blockers,
  };
}

// ─── Vote-choice scrub spy ────────────────────────────────────────────────

/**
 * Drop-in replacement that scrubs voteChoiceObserved from each respondent
 * before mapping. If the mapper truly never reads voteChoiceObserved, the
 * resulting SurveyPrismSignature should be byte-identical (compared via
 * JSON.stringify after stripping voteChoiceObserved/turnoutObserved which
 * are intentionally carried through).
 */
function scrubVoteChoice(r: WeightedSurveyRespondent): WeightedSurveyRespondent {
  return { ...r, voteChoiceObserved: "Unknown" };
}

function signatureFingerprint(sig: SurveyPrismSignature): string {
  // Strip the two observed fields that the mapper deliberately carries
  // through but never reads — comparing those would be circular for the spy.
  const { voteChoiceObserved: _vc, turnoutObserved: _to, ...rest } = sig;
  return JSON.stringify(rest);
}

// ─── Main ──────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const cwd = process.cwd();
  const outDir = path.join(cwd, "results", "electorate", "synthetic-electorate");
  fs.mkdirSync(outDir, { recursive: true });

  const yearAudits: YearAudit[] = [];
  const skippedYears: Array<{ year: number; reason: string }> = [];
  let scrubChecks = 0;
  let scrubMatches = 0;

  for (const target of YEAR_TARGETS) {
    const filePath = path.join(cwd, target.filePath);
    console.log(`\n=== ${target.year} (${target.filePath}) ===`);
    if (!fs.existsSync(filePath)) {
      console.log(`  ✗ file not present — skipping`);
      skippedYears.push({ year: target.year, reason: "microdata file not present locally" });
      continue;
    }

    const t0 = Date.now();
    const { respondents } = await loadSurveyRespondents({
      filePath,
      year: target.year,
      rowLimit: SAMPLE_ROW_LIMIT,
      keepRawVarPayload: true,
    });
    const signatures = respondents.map(mapSurveyToPrism);

    // Vote-choice scrub spy: re-map with vote-choice scrubbed and compare per-row.
    const scrubbed = respondents.map(scrubVoteChoice).map(mapSurveyToPrism);
    let yearScrubMatches = 0;
    for (let i = 0; i < signatures.length; i++) {
      if (signatureFingerprint(signatures[i]!) === signatureFingerprint(scrubbed[i]!)) yearScrubMatches++;
    }
    scrubChecks += signatures.length;
    scrubMatches += yearScrubMatches;
    const yearScrubOk = yearScrubMatches === signatures.length;

    const audit = auditYear(signatures);
    yearAudits.push(audit);

    console.log(`  rows=${respondents.length} signatures=${signatures.length} scrub_spy_pass=${yearScrubMatches}/${signatures.length} duration=${(Date.now() - t0) / 1000}s`);
    console.log(`  per-row: real_signal_mean=${audit.aggregate_provenance.weighted_mean_real_signal_per_row.toFixed(2)}/20 fallback_mean=${audit.aggregate_provenance.weighted_mean_fallback_per_row.toFixed(2)}/20 partyIdDerived_mean=${audit.aggregate_provenance.weighted_mean_party_id_derived_per_row.toFixed(2)}/20`);
    console.log(`  signature blockers: ${audit.signature_blockers.length}/${audit.per_target.length} (${audit.signature_blockers.map(b => b.target).join(", ") || "none"})`);
    if (!yearScrubOk) {
      console.error(`  ✗ vote-choice scrub spy mismatch in ${target.year}: ${signatures.length - yearScrubMatches} row(s) differ`);
    }
  }

  const overallScrubPass = scrubMatches === scrubChecks;
  const yearsLoaded = yearAudits.map(a => a.year);

  const jsonOut = {
    schema_version: "v0.1",
    run_at: new Date().toISOString(),
    phase: "2.7.7 — survey-to-PRISM mapper coverage audit (read-only diagnostic)",
    config: {
      sample_row_limit_per_year: SAMPLE_ROW_LIMIT,
      near_uniform_spread_threshold: NEAR_UNIFORM_SPREAD_THRESHOLD,
      engagement_fallback_default: ENGAGEMENT_FALLBACK_DEFAULT,
      engagement_fallback_tolerance: ENGAGEMENT_FALLBACK_TOLERANCE,
      boundary_fallback_default: BOUNDARY_FALLBACK_DEFAULT,
      boundary_fallback_tolerance: BOUNDARY_FALLBACK_TOLERANCE,
      real_signal_blocker_threshold: REAL_SIGNAL_BLOCKER_THRESHOLD,
    },
    description: "Read-only diagnostic of the survey-to-PRISM mapper. Per-target weighted real-signal vs fallback coverage, top source columns, near-uniform/near-fallback flagging, and signature-blocker labels. The mapper is NOT modified by this audit.",
    vote_choice_scrub_spy: {
      total_signatures_checked: scrubChecks,
      total_byte_identical_after_scrub: scrubMatches,
      all_byte_identical: overallScrubPass,
      note: "Vote-choice (voteChoiceObserved + turnoutObserved) is excluded from the fingerprint comparison since the mapper deliberately carries those two fields through unchanged for downstream backtest evaluators. Equality of the rest of the signature confirms the mapper does not read voteChoiceObserved.",
    },
    years_loaded: yearsLoaded,
    years_skipped: skippedYears,
    audits: yearAudits,
  };
  const jsonPath = path.join(outDir, "survey-to-prism-mapper-coverage-audit.json");
  fs.writeFileSync(jsonPath, JSON.stringify(jsonOut, null, 2));

  // ── Markdown summary
  let md = `# Survey-to-PRISM Mapper Coverage Audit (Phase 2.7.7)\n\n`;
  md += `**Run at:** ${new Date().toISOString()}\n`;
  md += `**Sample row limit per year:** ${SAMPLE_ROW_LIMIT}\n`;
  md += `**Status:** Read-only diagnostic. The mapper is **NOT** modified by this audit.\n\n`;

  md += `## What this answers\n\n`;
  md += `By year and by PRISM target: how much of the synthetic-electorate signature is **real survey signal** (the mapper consumed at least one CCES column) versus **fallback** (the mapper emitted a uniform prior because no covered column was available). Where the target is a moral-boundary salience or engagement scalar, "near-fallback" means the weighted mean is near the mapper's documented fallback default.\n\n`;
  md += `Per target the audit reports:\n`;
  md += `- weighted % rows where provenance.source = "real_signal" vs "fallback"\n`;
  md += `- weighted % rows where provenance.partyIdDerived = true (only ever > 0 for \`moralBoundaries.political_camp\` per the mapper's pid7 wiring)\n`;
  md += `- weighted distribution of provenance.uncertainty (low / medium / high)\n`;
  md += `- top source columns actually consumed (by weighted use)\n`;
  md += `- weighted marginal summary (avg posterior or scalar mean) and a near-uniform / near-fallback flag\n`;
  md += `- **signature-blocker** labels: real-signal coverage < ${REAL_SIGNAL_BLOCKER_THRESHOLD * 100}% OR weighted marginal indistinguishable from the mapper's fallback prior\n\n`;
  md += `**Not in scope**: vote prediction, candidate distance, abstention calibration, scorer fields, mapper revision. The audit's job is to *explain* coverage gaps so the next mapper version can be planned with priorities; it does not change anything.\n\n`;

  md += `## Vote-choice scrub spy\n\n`;
  md += `- Signatures checked: **${scrubChecks}**\n`;
  md += `- Byte-identical after scrubbing \`voteChoiceObserved\` to \`"Unknown"\`: **${scrubMatches}**\n`;
  md += `- Spy result: ${overallScrubPass ? "**✓ PASS** — mapper does not read voteChoiceObserved" : "**✗ FAIL — mapper appears to read voteChoiceObserved**"}\n\n`;
  md += `(Comparison strips \`voteChoiceObserved\` + \`turnoutObserved\` from the fingerprint; those fields are intentionally carried through the mapper unchanged for downstream backtest evaluators and would be circular to compare.)\n\n`;

  md += `## Cross-year aggregate provenance (per-row, weighted)\n\n`;
  md += `| Year | Rows | Real-signal targets / 20 | Fallback targets / 20 | Party-ID-derived targets / 20 |\n`;
  md += `|---|---:|---:|---:|---:|\n`;
  for (const a of yearAudits) {
    md += `| ${a.year} | ${a.rows_mapped} | ${a.aggregate_provenance.weighted_mean_real_signal_per_row.toFixed(2)} | ${a.aggregate_provenance.weighted_mean_fallback_per_row.toFixed(2)} | ${a.aggregate_provenance.weighted_mean_party_id_derived_per_row.toFixed(2)} |\n`;
  }
  md += `\n`;

  md += `## Cross-year per-target real-signal coverage (weighted %)\n\n`;
  if (yearAudits.length > 0) {
    md += `| Target | Kind | ${yearAudits.map(a => a.year).join(" | ")} | Mean | Blocker years |\n`;
    md += `|---|---|${yearAudits.map(() => "---:").join("|")}|---:|---|\n`;
    const targetNames = yearAudits[0]!.per_target.map(t => t.target_name);
    for (const tn of targetNames) {
      const cells: string[] = [];
      const blockerYears: number[] = [];
      let sum = 0;
      for (const a of yearAudits) {
        const t = a.per_target.find(t => t.target_name === tn)!;
        cells.push(t.weighted_real_signal_pct.toFixed(1));
        sum += t.weighted_real_signal_pct;
        if (t.blocker_reasons.length > 0) blockerYears.push(a.year);
      }
      const kind = yearAudits[0]!.per_target.find(t => t.target_name === tn)!.target_kind;
      const mean = (sum / yearAudits.length).toFixed(1);
      md += `| \`${tn}\` | ${kind} | ${cells.join(" | ")} | ${mean} | ${blockerYears.join(", ") || "(none)"} |\n`;
    }
    md += `\n`;
  }

  for (const a of yearAudits) {
    md += `## ${a.year}\n\n`;
    md += `- Rows mapped: **${a.rows_mapped}**; total weight: **${a.total_weight.toFixed(0)}**\n`;
    md += `- Per row (weighted mean): real-signal targets **${a.aggregate_provenance.weighted_mean_real_signal_per_row.toFixed(2)} / 20**; fallback **${a.aggregate_provenance.weighted_mean_fallback_per_row.toFixed(2)} / 20**; party-ID-derived **${a.aggregate_provenance.weighted_mean_party_id_derived_per_row.toFixed(2)} / 20**\n`;
    md += `- Signature blockers: **${a.signature_blockers.length} / ${a.per_target.length}** (${a.signature_blockers.map(b => "`" + b.target + "`").join(", ") || "(none)"})\n\n`;

    md += `### Per-target coverage\n\n`;
    md += `| Target | Kind | Real-signal % | Fallback % | Party-ID % | Mean uncertainty | Top source fields | Marginal summary | Blocker |\n`;
    md += `|---|---|---:|---:|---:|---:|---|---|:--:|\n`;
    for (const t of a.per_target) {
      const topF = t.top_source_fields.length > 0
        ? t.top_source_fields.map(f => `\`${f.field}\` (${f.weighted_use_pct.toFixed(0)}%)`).join(", ")
        : "—";
      let marg = "";
      if (t.target_kind === "continuous" || t.target_kind === "categorical") {
        const m = t.marginal_summary.weighted_avg_distribution!;
        marg = `dist=[${m.map(v => v.toFixed(3)).join(", ")}], spread=${(t.marginal_summary.spread ?? 0).toExponential(2)}`;
        if (t.target_kind === "continuous") marg += `, mean_pos=${(t.marginal_summary.weighted_mean ?? 0).toFixed(2)}`;
      } else if (t.target_kind === "engagement") {
        marg = `mean=${(t.marginal_summary.weighted_mean ?? 0).toFixed(2)}, sd=${(t.marginal_summary.weighted_sd ?? 0).toFixed(2)}, |mean−${ENGAGEMENT_FALLBACK_DEFAULT}|=${(t.marginal_summary.distance_from_fallback_default ?? 0).toFixed(2)}`;
      } else if (t.target_kind === "moral_boundary" || t.target_kind === "intensity") {
        marg = `mean=${(t.marginal_summary.weighted_mean ?? 0).toFixed(3)}, sd=${(t.marginal_summary.weighted_sd ?? 0).toFixed(3)}, |mean−${BOUNDARY_FALLBACK_DEFAULT}|=${(t.marginal_summary.distance_from_fallback_default ?? 0).toFixed(3)}`;
      }
      md += `| \`${t.target_name}\` | ${t.target_kind} | ${t.weighted_real_signal_pct.toFixed(1)} | ${t.weighted_fallback_pct.toFixed(1)} | ${t.weighted_party_id_derived_pct.toFixed(1)} | ${t.mean_uncertainty_score.toFixed(2)} | ${topF} | ${marg} | ${t.blocker_reasons.length > 0 ? "✗" : "✓"} |\n`;
    }
    md += `\n`;
    if (a.signature_blockers.length > 0) {
      md += `### Signature blockers detail\n\n`;
      for (const b of a.signature_blockers) {
        md += `- **\`${b.target}\`** — ${b.reasons.join("; ")}\n`;
      }
      md += `\n`;
    }
  }

  md += `## What "blocker" means here\n\n`;
  md += `A target is flagged as a **signature blocker** when either of these conditions holds:\n\n`;
  md += `1. **Real-signal coverage is < ${REAL_SIGNAL_BLOCKER_THRESHOLD * 100}%** of weighted respondents — the mapper is producing a uniform / fallback prior for ≥ ${(1 - REAL_SIGNAL_BLOCKER_THRESHOLD) * 100}% of the electorate on that target.\n`;
  md += `2. **Weighted marginal is indistinguishable from the mapper's fallback prior** — for continuous nodes that's the uniform 5-bin position posterior; for categoricals it's the uniform 6-bin distribution; for engagement / moral-boundary / intensity scalars it's the mapper's documented default value.\n\n`;
  md += `Both conditions are diagnostics, not failures. They tell the next mapper-revision pass which targets the upcoming year-specific issue-item resolvers (CC*_337_*, CC*_415r, abortion battery, immigration battery, group-empathy thermometers, etc.) need to cover first.\n\n`;
  md += `## Cross-reference\n\n`;
  md += `- The mapper itself: \`src/electorate/surveyToPrismMapper.ts\` (do not edit from this audit).\n`;
  md += `- The synthetic-electorate aggregate (downstream consumer): \`results/electorate/synthetic-electorate/synthetic-electorate-aggregate-smoke.{md,json}\`. The aggregate's near-3.0 weighted means on most position nodes are **explained** by this audit's per-target real-signal coverage — they reflect the mapper's uniform-prior fallback being copied through verbatim, not a substantive electorate centrism finding.\n`;

  fs.writeFileSync(path.join(outDir, "survey-to-prism-mapper-coverage-audit.md"), md);

  try { JSON.parse(fs.readFileSync(jsonPath, "utf8")); console.log("\nJSON valid"); }
  catch (e) { console.error("JSON did not parse:", e); process.exit(3); }

  console.log(`\nWrote ${jsonPath}`);
  console.log(`Wrote ${path.join(outDir, "survey-to-prism-mapper-coverage-audit.md")}`);
  console.log(`\nVote-choice scrub spy: ${scrubMatches}/${scrubChecks} byte-identical (${overallScrubPass ? "PASS" : "FAIL"})`);
  if (!overallScrubPass) {
    console.error(`\nAudit FAILED: vote-choice scrub spy did not pass`);
    process.exit(1);
  }
}

main().catch(err => { console.error(err); process.exit(1); });
