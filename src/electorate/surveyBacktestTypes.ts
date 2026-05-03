/**
 * Phase 2 Backtest V0 — typed shapes for survey-microdata-driven backtesting.
 *
 * The loader (cesBacktestLoader.ts) normalizes raw CES/CCES rows into
 * `WeightedSurveyRespondent` objects. Downstream consumers (mapper, mode A
 * oracle path, mode B model-turnout path) read this typed shape rather than
 * touching raw column names.
 *
 * This module is a TYPE module only. It does NOT modify or duplicate the
 * existing survey-to-PRISM mapper specification (results/electorate/mapping/
 * survey-to-prism-v0.{md,json}). It also does NOT redefine candidate
 * signatures, era-context, or EIG concerns. It is the loader's interface.
 *
 * Terminology note (canonical): per A2 spec the engagement field is a
 * one-dimensional continuous scalar. Vote choice is observed where present;
 * non-voters are retained, never silently dropped.
 */

/** D / R / Other / Abstain / Unknown — observed vote-choice classification. */
export type ObservedVoteChoice = "D" | "R" | "Other" | "Abstain" | "Unknown";

/** Demographic fields used downstream for poststratification + coalition gates. */
export interface SurveyDemographics {
  /** State of residence (e.g. "TX" or numeric FIPS — loader normalizes to 2-letter where possible). */
  state?: string;
  /** Year of birth. Age = year − birthyr. */
  birthyr?: number;
  /** "male" | "female" or other if survey supports it. */
  gender?: string;
  /** Educational attainment as a coded category (loader passes through; mapper interprets). */
  educ?: number | string;
  /** Race / ethnicity (loader passes through). */
  race?: number | string;
  /** Hispanic origin (loader passes through). */
  hispanic?: number | string;
  /** County FIPS (where available). */
  countyFips?: string;
  /** Congressional district (where available). */
  congressionalDistrict?: string;
}

/**
 * Normalized weighted survey respondent for backtest consumption.
 *
 * Invariants the loader guarantees:
 *  - `weight` is finite and > 0.
 *  - `turnoutObserved` is `true` (voted), `false` (did not vote), or `null`
 *    (unknown — e.g., respondent didn't take post-election wave). Loader
 *    prefers validated turnout (e.g., CL_E2016GVM for CCES 2016) over self-
 *    report when both are available.
 *  - `voteChoiceObserved` is set to "Abstain" when `turnoutObserved === false`
 *    and to "Unknown" when both turnout and choice are missing. Voted-but-
 *    refused-to-disclose-choice cases also map to "Unknown".
 *  - Non-voters are NEVER dropped from the loader output. They appear as
 *    `turnoutObserved: false, voteChoiceObserved: "Abstain"`.
 *  - `rawVarPayload` carries the full raw row so the mapper can read any
 *    column without re-loading the file.
 */
export interface WeightedSurveyRespondent {
  /** Unique respondent ID within (year, source). For CCES 2016 the source field is `V101`. */
  respondentId: string;
  /** Election year the response covers. */
  year: number;
  /** Survey weight (post-election preferred when available; otherwise pre-election). */
  weight: number;
  /** Which weight column was used (for traceability). */
  weightSource: string;
  /** true = voted, false = did not vote, null = unknown turnout. */
  turnoutObserved: boolean | null;
  /** Whether `turnoutObserved` came from a validated voter-file match. */
  turnoutValidated: boolean;
  /** Observed vote choice; "Abstain" when turnoutObserved===false. */
  voteChoiceObserved: ObservedVoteChoice;
  /** Demographics extracted from common-content fields. May be partially populated. */
  demographics: SurveyDemographics;
  /** Raw row payload for downstream mapper/issue-item consumption. Keys are the raw column names. */
  rawVarPayload: Record<string, string>;
}

/**
 * Aggregate counters returned by the loader's smoke test. All counts are
 * raw row counts; weighted-share computations live in the smoke script,
 * not in the loader, to keep the loader's responsibilities narrow.
 */
export interface LoaderInventoryStats {
  /** Total rows successfully normalized. */
  rowsLoaded: number;
  /** Rows skipped due to missing/invalid weight or other parse errors. */
  rowsSkipped: number;
  /** How many normalized rows have turnoutObserved true / false / null. */
  turnoutCounts: { voted: number; nonvoter: number; unknown: number };
  /** How many normalized rows have validated turnout. */
  validatedTurnoutCount: number;
  /** Distribution of voteChoiceObserved values across normalized rows. */
  voteChoiceCounts: Record<ObservedVoteChoice, number>;
  /** Sum of weights — sanity-check that aggregate weight ≈ population estimate the survey targets. */
  totalWeight: number;
  /** Min / max weight observed (sanity check for outliers). */
  weightMin: number;
  weightMax: number;
}

/** Per-source loader options. */
export interface LoaderOptions {
  /** Where the file lives on disk. */
  filePath: string;
  /** Election year covered by the file (used to set respondent.year). */
  year: number;
  /**
   * Maximum rows to process. Useful for smoke tests; null = process all.
   * Loader streams the file and halts cleanly at this row count.
   */
  rowLimit?: number | null;
  /** Whether to keep the rawVarPayload (false reduces memory for huge files). */
  keepRawVarPayload?: boolean;
}
