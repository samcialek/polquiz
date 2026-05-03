/**
 * CCES / CES backtest loader (Phase 2 Backtest V0).
 *
 * Streams a tab-delimited CCES Common Content file, normalizes each row
 * into a `WeightedSurveyRespondent` per the contract in
 * `surveyBacktestTypes.ts`, and yields the result. Non-voters are
 * preserved.
 *
 * v0 supports CCES 2016. The schema column-name resolver in
 * `RESOLVERS_BY_YEAR` makes adding 2008 / 2012 / 2020 / 2024 a matter of
 * adding another resolver entry per year — no structural change required.
 *
 * What this loader is NOT:
 *  - It is not a survey-to-PRISM mapper. The mapper spec lives in
 *    `results/electorate/mapping/survey-to-prism-v0.md` and is owned
 *    elsewhere; this loader produces the input the mapper will read.
 *  - It does not interpret issue-attitude items. Those columns flow
 *    through unchanged via `rawVarPayload`.
 *  - It does not aggregate, weight-normalize, or compute shares. Those
 *    are the smoke / aggregator's job.
 */

import { createReadStream } from "node:fs";
import { createInterface } from "node:readline";

import type {
  LoaderInventoryStats,
  LoaderOptions,
  ObservedVoteChoice,
  SurveyDemographics,
  WeightedSurveyRespondent,
} from "./surveyBacktestTypes.js";

// ─── Per-year column-name resolvers ────────────────────────────────────────

interface YearResolver {
  /** Column name carrying the unique respondent ID. */
  idCol: string;
  /**
   * Ordered list of weight column names. Loader picks the first non-empty,
   * finite value per row. Order should be: most preferred (validated voter,
   * post-wave) first.
   */
  weightCols: string[];
  /**
   * Validated-turnout column. Non-empty values that don't equal the
   * `validatedTurnoutEmptyMarker` indicate the respondent was matched to a
   * voter file AND voted (CCES 2016 sets `CL_E2016GVM` to non-empty when
   * a validated general-election ballot exists).
   */
  validatedTurnoutCol?: string;
  /** Empty-equivalents for the validated turnout column. */
  validatedTurnoutEmptyMarkers: Set<string>;
  /** Self-reported took-post-wave column. */
  tookPostCol?: string;
  /** Post-wave self-reported presidential vote choice column. */
  presVoteCol: string;
  /**
   * Mapping from raw vote-choice codes (as text in the .tab file) to
   * normalized ObservedVoteChoice. Codes not in this map are treated as
   * "Unknown" if the respondent voted, or "Abstain" if turnoutObserved is
   * known false.
   */
  presVoteCodeMap: Record<string, ObservedVoteChoice>;
  /**
   * Codes that indicate "did not vote" / "skipped" in the vote-choice
   * column. These map to abstention.
   */
  presVoteAbstainCodes: Set<string>;
  /** Demographic column names (loader passes raw values through). */
  demoCols: {
    state?: string;
    birthyr?: string;
    gender?: string;
    educ?: string;
    race?: string;
    hispanic?: string;
    countyFips?: string;
    cd?: string;
  };
}

/**
 * CCES 2016 resolver. Vote-choice codebook (CC16_410a):
 *   1 = Hillary Clinton (D)
 *   2 = Donald Trump (R)
 *   3 = Gary Johnson (Libertarian — Other)
 *   4 = Jill Stein (Green — Other)
 *   5 = Other / write-in (Other)
 *   6 = Evan McMullin (Other)
 *   7 = I did not vote in this race
 *   8 = Not sure / skipped
 *   "" / "__NA__" = missing
 *
 * The exact code map below is conservative: D=1, R=2, anyone in {3,4,5,6} is
 * Other. Codes 7 and 8 map to abstain when turnout is unknown; explicit
 * abstain treatment overrides at the row level.
 */
const CCES_2016: YearResolver = {
  idCol: "V101",
  weightCols: ["commonweight_vv_post", "commonweight_post", "commonweight_vv", "commonweight"],
  validatedTurnoutCol: "CL_E2016GVM",
  validatedTurnoutEmptyMarkers: new Set(["", "__NA__"]),
  tookPostCol: "tookpost",
  presVoteCol: "CC16_410a",
  presVoteCodeMap: {
    "1": "D",
    "2": "R",
    "3": "Other",
    "4": "Other",
    "5": "Other",
    "6": "Other",
  },
  presVoteAbstainCodes: new Set(["7"]),
  demoCols: {
    state: "inputstate",
    birthyr: "birthyr",
    gender: "gender",
    educ: "educ",
    race: "race",
    hispanic: "hispanic",
    countyFips: "countyfips",
    cd: "cdid115",
  },
};

const RESOLVERS_BY_YEAR: Record<number, YearResolver> = {
  2016: CCES_2016,
  // 2008, 2012, 2020, 2024: add resolvers here when microdata + codebook
  // verified. The structure is identical; only column names differ.
};

// ─── Loader ────────────────────────────────────────────────────────────────

const NA_MARKERS = new Set(["", "__NA__", "NA"]);

function isNullCell(value: string | undefined): boolean {
  return value === undefined || NA_MARKERS.has(value.trim());
}

function parseFiniteNumber(s: string | undefined): number | null {
  if (isNullCell(s)) return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

function pickWeight(row: Record<string, string>, weightCols: string[]): { weight: number; source: string } | null {
  for (const col of weightCols) {
    const w = parseFiniteNumber(row[col]);
    if (w !== null && w > 0) return { weight: w, source: col };
  }
  return null;
}

function readValidatedTurnout(row: Record<string, string>, resolver: YearResolver): boolean | null {
  if (!resolver.validatedTurnoutCol) return null;
  const v = row[resolver.validatedTurnoutCol];
  if (v === undefined) return null;
  const t = v.trim();
  // Non-empty and not a known empty-marker → validated voter file recorded
  // them as having voted in the general election. CCES sets this column to
  // empty for non-voters AND for unmatched respondents — we cannot
  // distinguish "non-voter" from "unmatched" from this column alone.
  if (resolver.validatedTurnoutEmptyMarkers.has(t)) return null;
  return true;
}

/**
 * Compose final turnout + vote-choice classification:
 *  - Validated turnout (if true) → voter; vote-choice from presVoteCol
 *  - Validated turnout (null) AND tookpost == 1 AND presVoteCol present:
 *      voter if presVoteCol indicates a candidate; non-voter if presVoteCol
 *      is in the abstain-code set; unknown otherwise
 *  - tookpost == 0 (didn't take post-wave) → turnout unknown, choice unknown
 *  - tookpost null AND no validated → turnout unknown, choice unknown
 */
function classifyTurnoutAndChoice(
  row: Record<string, string>,
  resolver: YearResolver,
): { turnoutObserved: boolean | null; turnoutValidated: boolean; voteChoiceObserved: ObservedVoteChoice } {
  const validated = readValidatedTurnout(row, resolver);
  const tookPost = resolver.tookPostCol ? row[resolver.tookPostCol] : undefined;
  const tookPostNum = parseFiniteNumber(tookPost);
  const choiceRaw = row[resolver.presVoteCol];

  // Validated voter (gold-standard for turnout). Vote choice from self-report.
  // Per CCES methodology: when the voter file confirms general-election
  // turnout but the respondent's CC16_410a is empty OR carries an abstain
  // code (e.g. "I did not vote in this race" — i.e., they voted downballot
  // but skipped the presidential race), turnout stays TRUE (validated wins)
  // and vote-choice is Unknown rather than Abstain. Abstain is reserved
  // for respondents who actually didn't vote.
  if (validated === true) {
    const code = (choiceRaw ?? "").trim();
    if (isNullCell(choiceRaw) || resolver.presVoteAbstainCodes.has(code)) {
      return { turnoutObserved: true, turnoutValidated: true, voteChoiceObserved: "Unknown" };
    }
    if (resolver.presVoteCodeMap[code]) {
      return { turnoutObserved: true, turnoutValidated: true, voteChoiceObserved: resolver.presVoteCodeMap[code] };
    }
    return { turnoutObserved: true, turnoutValidated: true, voteChoiceObserved: "Unknown" };
  }

  // Did not take post-wave → cannot observe vote choice.
  if (tookPostNum === 0) {
    return { turnoutObserved: null, turnoutValidated: false, voteChoiceObserved: "Unknown" };
  }

  // Took post-wave but no validation. Use self-report.
  if (tookPostNum === 1 && !isNullCell(choiceRaw)) {
    const code = (choiceRaw ?? "").trim();
    if (resolver.presVoteAbstainCodes.has(code)) {
      return { turnoutObserved: false, turnoutValidated: false, voteChoiceObserved: "Abstain" };
    }
    if (resolver.presVoteCodeMap[code]) {
      return {
        turnoutObserved: true,
        turnoutValidated: false,
        voteChoiceObserved: resolver.presVoteCodeMap[code],
      };
    }
    // tookpost==1 with an unrecognized code (e.g. "8 not sure") → voted
    // status unknown.
    return { turnoutObserved: null, turnoutValidated: false, voteChoiceObserved: "Unknown" };
  }

  // Default: turnout unknown, choice unknown.
  return { turnoutObserved: null, turnoutValidated: false, voteChoiceObserved: "Unknown" };
}

function mapVoteChoice(
  raw: string | undefined,
  resolver: YearResolver,
  turnedOut: boolean,
): ObservedVoteChoice {
  if (isNullCell(raw)) return turnedOut ? "Unknown" : "Abstain";
  const code = (raw ?? "").trim();
  if (resolver.presVoteAbstainCodes.has(code)) return "Abstain";
  if (resolver.presVoteCodeMap[code]) return resolver.presVoteCodeMap[code];
  return turnedOut ? "Unknown" : "Abstain";
}

function pickDemographics(row: Record<string, string>, resolver: YearResolver): SurveyDemographics {
  const d: SurveyDemographics = {};
  if (resolver.demoCols.state) {
    const v = row[resolver.demoCols.state];
    if (!isNullCell(v)) d.state = (v ?? "").trim();
  }
  if (resolver.demoCols.birthyr) {
    const v = parseFiniteNumber(row[resolver.demoCols.birthyr]);
    if (v !== null) d.birthyr = v;
  }
  if (resolver.demoCols.gender) {
    const v = row[resolver.demoCols.gender];
    if (!isNullCell(v)) d.gender = (v ?? "").trim();
  }
  if (resolver.demoCols.educ) {
    const v = row[resolver.demoCols.educ];
    if (!isNullCell(v)) d.educ = (v ?? "").trim();
  }
  if (resolver.demoCols.race) {
    const v = row[resolver.demoCols.race];
    if (!isNullCell(v)) d.race = (v ?? "").trim();
  }
  if (resolver.demoCols.hispanic) {
    const v = row[resolver.demoCols.hispanic];
    if (!isNullCell(v)) d.hispanic = (v ?? "").trim();
  }
  if (resolver.demoCols.countyFips) {
    const v = row[resolver.demoCols.countyFips];
    if (!isNullCell(v)) d.countyFips = (v ?? "").trim().replace(/^"|"$/g, "");
  }
  if (resolver.demoCols.cd) {
    const v = row[resolver.demoCols.cd];
    if (!isNullCell(v)) d.congressionalDistrict = (v ?? "").trim().replace(/^"|"$/g, "");
  }
  return d;
}

/**
 * Streams the file at `opts.filePath`, normalizes each row, and yields
 * a `WeightedSurveyRespondent`. Skips rows with missing/invalid weights.
 */
export async function* streamSurveyRespondents(
  opts: LoaderOptions,
): AsyncGenerator<WeightedSurveyRespondent, LoaderInventoryStats, void> {
  const resolver = RESOLVERS_BY_YEAR[opts.year];
  if (!resolver) {
    throw new Error(
      `cesBacktestLoader: no resolver configured for year ${opts.year}. Add a resolver entry in RESOLVERS_BY_YEAR.`,
    );
  }

  const stats: LoaderInventoryStats = {
    rowsLoaded: 0,
    rowsSkipped: 0,
    turnoutCounts: { voted: 0, nonvoter: 0, unknown: 0 },
    validatedTurnoutCount: 0,
    voteChoiceCounts: { D: 0, R: 0, Other: 0, Abstain: 0, Unknown: 0 },
    totalWeight: 0,
    weightMin: Infinity,
    weightMax: -Infinity,
  };

  const stream = createReadStream(opts.filePath, { encoding: "utf8" });
  const rl = createInterface({ input: stream, crlfDelay: Infinity });

  let header: string[] | null = null;
  const limit = opts.rowLimit ?? Infinity;
  const keepRaw = opts.keepRawVarPayload !== false; // default true

  for await (const line of rl) {
    if (header === null) {
      header = line.split("\t");
      continue;
    }
    if (stats.rowsLoaded + stats.rowsSkipped >= limit) break;
    const fields = line.split("\t");
    if (fields.length === 1 && fields[0] === "") continue; // blank line guard

    // Build row dict.
    const row: Record<string, string> = {};
    for (let i = 0; i < header.length; i++) row[header[i]!] = fields[i] ?? "";

    // Weight (loader skips rows without a usable weight).
    const w = pickWeight(row, resolver.weightCols);
    if (!w) {
      stats.rowsSkipped++;
      continue;
    }

    // ID (skip if missing).
    const idRaw = row[resolver.idCol];
    if (isNullCell(idRaw)) {
      stats.rowsSkipped++;
      continue;
    }

    // Classify turnout + vote choice.
    const cls = classifyTurnoutAndChoice(row, resolver);
    const demographics = pickDemographics(row, resolver);

    const respondent: WeightedSurveyRespondent = {
      respondentId: (idRaw ?? "").trim(),
      year: opts.year,
      weight: w.weight,
      weightSource: w.source,
      turnoutObserved: cls.turnoutObserved,
      turnoutValidated: cls.turnoutValidated,
      voteChoiceObserved: cls.voteChoiceObserved,
      demographics,
      rawVarPayload: keepRaw ? row : {},
    };

    // Update stats.
    stats.rowsLoaded++;
    stats.totalWeight += w.weight;
    if (w.weight < stats.weightMin) stats.weightMin = w.weight;
    if (w.weight > stats.weightMax) stats.weightMax = w.weight;
    if (cls.turnoutObserved === true) stats.turnoutCounts.voted++;
    else if (cls.turnoutObserved === false) stats.turnoutCounts.nonvoter++;
    else stats.turnoutCounts.unknown++;
    if (cls.turnoutValidated) stats.validatedTurnoutCount++;
    stats.voteChoiceCounts[cls.voteChoiceObserved]++;

    yield respondent;
  }

  return stats;
}

/**
 * Convenience: load all rows into memory and return the array + stats.
 * Use only for smoke tests / small-N analyses; for full production runs,
 * consume the async iterator directly so memory stays bounded.
 */
export async function loadSurveyRespondents(opts: LoaderOptions): Promise<{
  respondents: WeightedSurveyRespondent[];
  stats: LoaderInventoryStats;
}> {
  const respondents: WeightedSurveyRespondent[] = [];
  const it = streamSurveyRespondents(opts);
  let last: IteratorResult<WeightedSurveyRespondent, LoaderInventoryStats>;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    last = await it.next();
    if (last.done) {
      // Sentinel: if no rows loaded, weightMin/Max are still Infinity;
      // normalize to 0 to keep downstream JSON serialization clean.
      const stats = last.value;
      if (stats.rowsLoaded === 0) {
        stats.weightMin = 0;
        stats.weightMax = 0;
      }
      return { respondents, stats };
    }
    respondents.push(last.value);
  }
}
