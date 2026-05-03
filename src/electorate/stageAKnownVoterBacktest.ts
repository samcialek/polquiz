/**
 * Phase 2.5 — Stage A: known-voter D/R/Other aggregate harness.
 *
 * Per the calibration plan (turnout-abstention-calibration-plan.md §2 Q4),
 * Stage A is the first runnable mapper-backed target. This module is the
 * harness + baseline contract that the future mapper-backed predictions
 * must beat or match.
 *
 * Stage A in three lines:
 *   1. Restrict each year's CES/CCES sample to known voters
 *      (voteChoiceObserved ∈ {D, R, Other}).
 *   2. Compute weighted observed D/R/Other shares (denominator excludes
 *      Unknown and Abstain).
 *   3. Compare to FEC's D/R/Other shares of total presidential vote, label
 *      each year against the v0 acceptance bands.
 *
 * What this module is NOT (yet):
 *   - It is NOT the PRISM mapper. There is no signature, no scorer, no
 *     vote-formula in this code path. The "predictions" reported here are
 *     the observed weighted survey shares — i.e., the baseline that the
 *     future mapper-backed predictions must beat or match. When the mapper
 *     ships, Phase 2.6 will substitute mapper-implied vote choices for the
 *     observed `voteChoiceObserved` field; the harness contract stays the
 *     same.
 *   - It does NOT do abstention calibration. That is Stage B (Phase 2.7).
 *   - It does NOT redistribute Unknown. Per the plan §2 Q3, Unknown is
 *     excluded from the Stage A denominator and counted separately.
 */

import type { WeightedSurveyRespondent } from "./surveyBacktestTypes.js";

/** v0 acceptance bands per the calibration plan §2 Q4. */
export type StageAAcceptanceLabel = "ready_for_stage_b" | "good" | "baseline_pass" | "fail";

/** Per-candidate gap bundle (signed pp = survey − benchmark; abs pp = magnitude). */
export interface StageACandidateGap {
  survey_share: number;
  benchmark_share: number;
  signed_gap_pp: number;
  abs_gap_pp: number;
}

/** Benchmark fields needed for the Stage A comparison. */
export interface StageABenchmark {
  d_votes: number;
  r_votes: number;
  other_votes: number;
  total_presidential_votes: number;
  /** D / R / Other shares of total presidential votes, lifted from FEC. */
  d_share_of_total: number;
  r_share_of_total: number;
  other_share_of_total: number;
}

/** Per-year Stage A result. */
export interface StageAYearResult {
  year: number;
  /** Whole-sample respondents loaded (informational; not the Stage A denominator). */
  n_respondents_total: number;
  /** Sample restricted to known voters (voteChoiceObserved ∈ {D,R,Other}). */
  n_respondents_known_voter: number;
  /** Weight excluded by the Stage A sample restriction (Abstain + Unknown). */
  excluded_weight: {
    abstain_weight: number;
    unknown_weight: number;
    /** Sum (sanity). */
    total_excluded_weight: number;
  };
  /** Weighted denominator for Stage A: sum of D + R + Other survey weight. */
  known_voter_denominator: number;
  /** Survey weighted shares within the known-voter sample. Sums to 1 by construction. */
  survey_known_voter_shares: { D: number; R: number; Other: number };
  /** FEC benchmark shares within the known-voter sample (FEC has no Unknown). */
  benchmark_known_voter_shares: { D: number; R: number; Other: number };
  /** Per-candidate gap (signed + abs, in pp). */
  gaps_pp: { D: StageACandidateGap; R: StageACandidateGap; Other: StageACandidateGap };
  /** Maximum abs-gap across {D, R, Other} — the v0 acceptance-band metric. */
  max_abs_gap_pp: number;
  /** Sum of abs-gaps across {D, R, Other} — secondary divergence metric. */
  abs_gap_sum_pp: number;
  /** v0 acceptance-band label (per plan §2 Q4). */
  acceptance_label: StageAAcceptanceLabel;
  /**
   * Source of the "predictions" used in this run. For Phase 2.5 this is
   * `"observed_survey_baseline"`; for Phase 2.6 it will be
   * `"mapper_backed_v0"` etc. The harness contract is the same.
   */
  prediction_source: "observed_survey_baseline";
}

const ACCEPTANCE_THRESHOLDS_PP = {
  ready_for_stage_b: 2,
  good: 3,
  baseline_pass: 5,
} as const;

function labelFor(maxAbsGapPp: number): StageAAcceptanceLabel {
  if (maxAbsGapPp <= ACCEPTANCE_THRESHOLDS_PP.ready_for_stage_b) return "ready_for_stage_b";
  if (maxAbsGapPp <= ACCEPTANCE_THRESHOLDS_PP.good) return "good";
  if (maxAbsGapPp <= ACCEPTANCE_THRESHOLDS_PP.baseline_pass) return "baseline_pass";
  return "fail";
}

function divideOrZero(num: number, denom: number): number {
  if (!Number.isFinite(denom) || denom === 0) return 0;
  return num / denom;
}

/**
 * Build the Stage A per-year result. Caller supplies the loaded
 * respondents and the matching benchmark fields. This function is
 * pure: no filesystem, no globals.
 *
 * @param year — election year (used for the result label only)
 * @param respondents — loader output for that year (full sample)
 * @param benchmark — FEC fields lifted from `benchmarks-2008-2024.json`
 */
export function buildStageAResult(
  year: number,
  respondents: WeightedSurveyRespondent[],
  benchmark: StageABenchmark,
): StageAYearResult {
  let dWeight = 0;
  let rWeight = 0;
  let oWeight = 0;
  let abstainWeight = 0;
  let unknownWeight = 0;
  let knownVoterCount = 0;

  for (const r of respondents) {
    const w = r.weight;
    switch (r.voteChoiceObserved) {
      case "D": dWeight += w; knownVoterCount++; break;
      case "R": rWeight += w; knownVoterCount++; break;
      case "Other": oWeight += w; knownVoterCount++; break;
      case "Abstain": abstainWeight += w; break;
      case "Unknown": unknownWeight += w; break;
    }
  }

  const knownVoterDenom = dWeight + rWeight + oWeight;

  const survey_known_voter_shares = {
    D: divideOrZero(dWeight, knownVoterDenom),
    R: divideOrZero(rWeight, knownVoterDenom),
    Other: divideOrZero(oWeight, knownVoterDenom),
  };

  // FEC's known-voter denominator: total presidential votes (D + R + Other,
  // since FEC has no Unknown bucket). benchmark.{d,r,other}_share_of_total
  // is exactly D/(D+R+Other) and correctly serves as the FEC known-voter share.
  const benchmark_known_voter_shares = {
    D: benchmark.d_share_of_total,
    R: benchmark.r_share_of_total,
    Other: benchmark.other_share_of_total,
  };

  const gapFor = (surveyShare: number, benchShare: number): StageACandidateGap => {
    const signed = (surveyShare - benchShare) * 100;
    return {
      survey_share: surveyShare,
      benchmark_share: benchShare,
      signed_gap_pp: signed,
      abs_gap_pp: Math.abs(signed),
    };
  };

  const gaps_pp = {
    D: gapFor(survey_known_voter_shares.D, benchmark_known_voter_shares.D),
    R: gapFor(survey_known_voter_shares.R, benchmark_known_voter_shares.R),
    Other: gapFor(survey_known_voter_shares.Other, benchmark_known_voter_shares.Other),
  };

  const max_abs_gap_pp = Math.max(gaps_pp.D.abs_gap_pp, gaps_pp.R.abs_gap_pp, gaps_pp.Other.abs_gap_pp);
  const abs_gap_sum_pp = gaps_pp.D.abs_gap_pp + gaps_pp.R.abs_gap_pp + gaps_pp.Other.abs_gap_pp;

  return {
    year,
    n_respondents_total: respondents.length,
    n_respondents_known_voter: knownVoterCount,
    excluded_weight: {
      abstain_weight: abstainWeight,
      unknown_weight: unknownWeight,
      total_excluded_weight: abstainWeight + unknownWeight,
    },
    known_voter_denominator: knownVoterDenom,
    survey_known_voter_shares,
    benchmark_known_voter_shares,
    gaps_pp,
    max_abs_gap_pp,
    abs_gap_sum_pp,
    acceptance_label: labelFor(max_abs_gap_pp),
    prediction_source: "observed_survey_baseline",
  };
}

/** Lift the Stage A benchmark fields from a parsed JSON year-block. */
export function liftStageABenchmark(yearBlock: Record<string, unknown>): StageABenchmark {
  const get = (k: string): number => {
    const v = yearBlock[k];
    if (typeof v !== "number" || !Number.isFinite(v)) {
      throw new Error(`benchmark missing or non-numeric field: ${k}`);
    }
    return v;
  };
  const d_votes = get("d_votes");
  const r_votes = get("r_votes");
  const other_votes = get("other_votes");
  const total_presidential_votes = get("total_presidential_votes");
  return {
    d_votes,
    r_votes,
    other_votes,
    total_presidential_votes,
    d_share_of_total: get("d_share_of_total"),
    r_share_of_total: get("r_share_of_total"),
    other_share_of_total: divideOrZero(other_votes, total_presidential_votes),
  };
}
