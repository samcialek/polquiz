/**
 * Phase 2.3 — Observed survey-vote aggregate (read-only sanity check).
 *
 * Inputs: arrays of `WeightedSurveyRespondent` produced by `cesBacktestLoader`,
 * plus the official benchmark JSON at
 * `results/electorate/backtest/benchmarks-2008-2024.json`.
 *
 * Outputs: a typed `ObservedYearAggregate` per year — weighted observed
 * vote-choice counts and shares (D, R, Other, Abstain, Unknown), the
 * known-only vote share (denominator excludes Unknown + Abstain), the
 * VEP-rescaled shares, and per-metric gaps vs the official benchmark.
 *
 * What this module is NOT:
 *  - It is NOT a prediction. There is no model, no signature, no scorer
 *    in this code path. It reports what the survey microdata + survey
 *    weights say, and how that observed picture compares to the official
 *    population benchmark.
 *  - It is NOT a tuning loop. No knobs are adjusted to close gaps. The
 *    gaps are evidence — they characterize survey nonresponse, Unknown
 *    handling, weight-frame mismatch, and self-report bias.
 *  - It does NOT run the survey-to-PRISM mapper. The mapper is a separate
 *    downstream component; this module only consumes loader output.
 */

import type { WeightedSurveyRespondent, ObservedVoteChoice } from "./surveyBacktestTypes.js";

/** Weighted counts in each observed-vote-choice bucket. Sums to total_weight. */
export interface WeightedChoiceCounts {
  D: number;
  R: number;
  Other: number;
  Abstain: number;
  Unknown: number;
}

/** Shares (each value in [0, 1]). Different denominators per shape. */
export interface WeightedChoiceShares {
  D: number;
  R: number;
  Other: number;
  Abstain: number;
  Unknown: number;
}

/** Vote shares conditional on a known voter (denom = D + R + Other). */
export interface KnownVoterShares {
  D: number;
  R: number;
  Other: number;
}

/** Benchmark fields lifted from `benchmarks-2008-2024.json`. */
export interface YearBenchmark {
  /** D / R / Other / Total presidential vote counts (FEC official). */
  d_votes: number;
  r_votes: number;
  other_votes: number;
  total_presidential_votes: number;
  /** Voting-Eligible Population (USEP for 2008; UF per-year for 2012-2024). */
  vep: number;
  abstentions_presidential: number;
  /** Per-VEP shares (decimal, not %). */
  d_share_of_vep: number;
  r_share_of_vep: number;
  other_share_of_vep: number;
  abstain_share_of_vep: number;
  turnout_share_of_vep_presidential: number;
  /** D, R, Other shares of presidential votes (FEC's "of total" denominators). */
  d_share_of_total: number;
  r_share_of_total: number;
  other_share_of_total: number;
}

/** Per-year aggregate result. */
export interface ObservedYearAggregate {
  year: number;
  n_respondents: number;
  total_weight: number;
  weight_min: number;
  weight_max: number;
  /** Weighted counts in each bucket. */
  weighted_counts: WeightedChoiceCounts;
  /** Weighted shares with denominator = total_weight (sums to 1). */
  shares_of_total_weight: WeightedChoiceShares;
  /** Vote shares conditional on a known voter (denom = D + R + Other weight). */
  known_voter_shares: KnownVoterShares | null;
  /** Survey-implied turnout rate = (D + R + Other) / total_weight. */
  turnout_share_implied: number;
  /** Survey-implied abstention rate = Abstain / total_weight. */
  abstain_share_implied: number;
  /** Unknown share (retained explicitly — never redistributed silently). */
  unknown_share_implied: number;
  /** Benchmark fields (FEC + USEP/UF). */
  benchmark: YearBenchmark;
  /**
   * Gaps in **percentage points** between the survey-implied share-of-VEP
   * and the benchmark share-of-VEP. Positive = survey over-counts vs benchmark.
   * Reported in pp (i.e. the raw difference of decimals × 100, NOT relative).
   */
  gaps_pp_vs_vep_benchmark: {
    d_share_of_vep_gap_pp: number;
    r_share_of_vep_gap_pp: number;
    other_share_of_vep_gap_pp: number;
    abstain_share_of_vep_gap_pp: number;
    turnout_share_of_vep_gap_pp: number;
    /** Sum of absolute pp-gaps on D/R/Other/Abstain — overall divergence. */
    abs_gap_sum_pp: number;
  };
  /**
   * Gaps between survey known-voter conditional shares and FEC's
   * D/R/Other shares of total presidential vote. This isolates self-report
   * vote-choice bias from turnout / Unknown effects.
   */
  gaps_pp_vs_known_voter_benchmark: {
    d_share_known_voter_gap_pp: number;
    r_share_known_voter_gap_pp: number;
    other_share_known_voter_gap_pp: number;
    abs_gap_sum_pp: number;
  } | null;
  /** Explicit policy: Unknown is retained as its own bucket, never redistributed. */
  unknown_handling_note: "Unknown share retained explicitly; not redistributed across D/R/Other/Abstain.";
}

const ZERO_COUNTS: WeightedChoiceCounts = { D: 0, R: 0, Other: 0, Abstain: 0, Unknown: 0 };

function tallyWeightedCounts(respondents: WeightedSurveyRespondent[]): WeightedChoiceCounts & { total_weight: number; weight_min: number; weight_max: number } {
  const counts: WeightedChoiceCounts = { ...ZERO_COUNTS };
  let total_weight = 0;
  let weight_min = Infinity;
  let weight_max = -Infinity;
  for (const r of respondents) {
    const w = r.weight;
    counts[r.voteChoiceObserved] += w;
    total_weight += w;
    if (w < weight_min) weight_min = w;
    if (w > weight_max) weight_max = w;
  }
  if (respondents.length === 0) {
    weight_min = 0;
    weight_max = 0;
  }
  return { ...counts, total_weight, weight_min, weight_max };
}

function divideOrZero(num: number, denom: number): number {
  if (!Number.isFinite(denom) || denom === 0) return 0;
  return num / denom;
}

/**
 * Build the per-year aggregate result. Caller supplies the loaded
 * respondents and the matching benchmark fields. This function does not
 * touch the filesystem.
 */
export function buildYearAggregate(
  year: number,
  respondents: WeightedSurveyRespondent[],
  benchmark: YearBenchmark,
): ObservedYearAggregate {
  const tally = tallyWeightedCounts(respondents);
  const total = tally.total_weight;

  const shares_of_total_weight: WeightedChoiceShares = {
    D: divideOrZero(tally.D, total),
    R: divideOrZero(tally.R, total),
    Other: divideOrZero(tally.Other, total),
    Abstain: divideOrZero(tally.Abstain, total),
    Unknown: divideOrZero(tally.Unknown, total),
  };

  const knownVoterDenom = tally.D + tally.R + tally.Other;
  const known_voter_shares: KnownVoterShares | null = knownVoterDenom > 0
    ? {
        D: tally.D / knownVoterDenom,
        R: tally.R / knownVoterDenom,
        Other: tally.Other / knownVoterDenom,
      }
    : null;

  const turnout_share_implied = divideOrZero(knownVoterDenom, total);
  const abstain_share_implied = divideOrZero(tally.Abstain, total);
  const unknown_share_implied = divideOrZero(tally.Unknown, total);

  const gaps_pp_vs_vep_benchmark = {
    d_share_of_vep_gap_pp: (shares_of_total_weight.D - benchmark.d_share_of_vep) * 100,
    r_share_of_vep_gap_pp: (shares_of_total_weight.R - benchmark.r_share_of_vep) * 100,
    other_share_of_vep_gap_pp: (shares_of_total_weight.Other - benchmark.other_share_of_vep) * 100,
    abstain_share_of_vep_gap_pp: (shares_of_total_weight.Abstain - benchmark.abstain_share_of_vep) * 100,
    turnout_share_of_vep_gap_pp: (turnout_share_implied - benchmark.turnout_share_of_vep_presidential) * 100,
    abs_gap_sum_pp: 0, // filled below
  };
  gaps_pp_vs_vep_benchmark.abs_gap_sum_pp =
    Math.abs(gaps_pp_vs_vep_benchmark.d_share_of_vep_gap_pp) +
    Math.abs(gaps_pp_vs_vep_benchmark.r_share_of_vep_gap_pp) +
    Math.abs(gaps_pp_vs_vep_benchmark.other_share_of_vep_gap_pp) +
    Math.abs(gaps_pp_vs_vep_benchmark.abstain_share_of_vep_gap_pp);

  const gaps_pp_vs_known_voter_benchmark = known_voter_shares
    ? (() => {
        const d = (known_voter_shares.D - benchmark.d_share_of_total) * 100;
        const r = (known_voter_shares.R - benchmark.r_share_of_total) * 100;
        const o = (known_voter_shares.Other - benchmark.other_share_of_total) * 100;
        return {
          d_share_known_voter_gap_pp: d,
          r_share_known_voter_gap_pp: r,
          other_share_known_voter_gap_pp: o,
          abs_gap_sum_pp: Math.abs(d) + Math.abs(r) + Math.abs(o),
        };
      })()
    : null;

  return {
    year,
    n_respondents: respondents.length,
    total_weight: tally.total_weight,
    weight_min: tally.weight_min,
    weight_max: tally.weight_max,
    weighted_counts: { D: tally.D, R: tally.R, Other: tally.Other, Abstain: tally.Abstain, Unknown: tally.Unknown },
    shares_of_total_weight,
    known_voter_shares,
    turnout_share_implied,
    abstain_share_implied,
    unknown_share_implied,
    benchmark,
    gaps_pp_vs_vep_benchmark,
    gaps_pp_vs_known_voter_benchmark,
    unknown_handling_note: "Unknown share retained explicitly; not redistributed across D/R/Other/Abstain.",
  };
}

/** Lift the benchmark fields needed for the comparison from a parsed JSON year-block. */
export function liftYearBenchmark(yearBlock: Record<string, unknown>): YearBenchmark {
  const get = (k: string): number => {
    const v = yearBlock[k];
    if (typeof v !== "number" || !Number.isFinite(v)) {
      throw new Error(`benchmark missing or non-numeric field: ${k}`);
    }
    return v;
  };
  return {
    d_votes: get("d_votes"),
    r_votes: get("r_votes"),
    other_votes: get("other_votes"),
    total_presidential_votes: get("total_presidential_votes"),
    vep: get("vep_count"),
    abstentions_presidential: get("abstain_vep"),
    d_share_of_vep: get("d_share_of_vep"),
    r_share_of_vep: get("r_share_of_vep"),
    other_share_of_vep: get("other_share_of_vep"),
    abstain_share_of_vep: get("abstain_share_of_vep"),
    turnout_share_of_vep_presidential: get("turnout_presidential_vep"),
    d_share_of_total: get("d_share_of_total"),
    r_share_of_total: get("r_share_of_total"),
    // Other share of total is not always stored as its own field; derive from counts.
    other_share_of_total: divideOrZero(get("other_votes"), get("total_presidential_votes")),
  };
}

/** Re-export the choice type so external consumers don't need a second import. */
export type { ObservedVoteChoice };
