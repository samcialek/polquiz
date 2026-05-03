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
   * Field delimiter for the file. CCES 2008/2012/2016 use `\t`; CES
   * 2020/2024 ship CSVs with `,`. Loader splits accordingly.
   */
  delimiter: "\t" | ",";
  /**
   * Whether the file uses CSV-style double-quoting (CES 2020/2024 do).
   * When true, the loader strips wrapping `"` and handles `""` as an
   * embedded quote.
   */
  quoted: boolean;
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
   * a validated general-election ballot exists). Set to undefined when
   * the year's release does not include voter validation columns; loader
   * falls back to self-reported tookpost + vote choice.
   */
  validatedTurnoutCol?: string;
  /** Empty-equivalents for the validated turnout column. */
  validatedTurnoutEmptyMarkers: Set<string>;
  /** Self-reported took-post-wave column. */
  tookPostCol?: string;
  /**
   * Values in `tookPostCol` meaning "took the post-election wave".
   * 2012/2016 use "1"; 2020/2024 use "2" (the YouGov coding flipped between
   * 2016 and 2020 from 0/1 binary to 1/2 enumeration).
   */
  tookPostTakenValues: Set<string>;
  /** Values meaning "did not take the post-election wave". */
  tookPostNotTakenValues: Set<string>;
  /** Post-wave self-reported presidential vote choice column. */
  presVoteCol: string;
  /**
   * Mapping from raw vote-choice codes (as text in the file) to
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
  delimiter: "\t",
  quoted: false,
  weightCols: ["commonweight_vv_post", "commonweight_post", "commonweight_vv", "commonweight"],
  validatedTurnoutCol: "CL_E2016GVM",
  validatedTurnoutEmptyMarkers: new Set(["", "__NA__", "NA"]),
  tookPostCol: "tookpost",
  tookPostTakenValues: new Set(["1"]),
  tookPostNotTakenValues: new Set(["0"]),
  presVoteCol: "CC16_410a",
  presVoteCodeMap: {
    "1": "D", // Clinton
    "2": "R", // Trump
    "3": "Other", // Johnson
    "4": "Other", // Stein
    "5": "Other", // write-in
    "6": "Other", // McMullin
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

/**
 * CCES 2012 resolver. Tab-delimited. No CL_E2012GVM-style validation
 * column in the public release; the validated-voter weight (`weight_vv_post`)
 * does the validation gating at the weight level instead. Loader falls
 * back to self-reported tookpost + CC410a for turnout classification.
 *
 * CC410a code map (per cces_guide_2012.pdf, post-election president vote):
 *   1 = Barack Obama (D)
 *   2 = Mitt Romney (R)
 *   3 = Gary Johnson (Libertarian — Other)
 *   4 = Jill Stein (Green — Other)
 *   5 = Other / write-in
 *   6 = Not sure (Unknown)
 *   7 = I did not vote in this race (Abstain)
 *   8 = Skipped (Unknown)
 *   9 = Not asked (Unknown)
 */
const CCES_2012: YearResolver = {
  idCol: "V101",
  delimiter: "\t",
  quoted: false,
  weightCols: ["weight_vv_post", "weight_vv", "weight"],
  validatedTurnoutCol: undefined,
  validatedTurnoutEmptyMarkers: new Set(["", "__NA__", "NA"]),
  tookPostCol: "tookpost",
  tookPostTakenValues: new Set(["1"]),
  tookPostNotTakenValues: new Set(["0"]),
  presVoteCol: "CC410a",
  presVoteCodeMap: {
    "1": "D",
    "2": "R",
    "3": "Other",
    "4": "Other",
    "5": "Other",
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
  },
};

/**
 * CES 2020 resolver. CSV-delimited with quoted strings. Includes voter
 * validation: CL_2020gvm is the general-election validated-vote match.
 *
 * CC20_410 code map (per CCES Guide 2020, post-election president vote):
 *   1 = Joe Biden (D)
 *   2 = Donald Trump (R)
 *   3 = Jo Jorgensen (Libertarian — Other)
 *   4 = Howie Hawkins (Green — Other)
 *   5 = Other / write-in
 *   6 = I'm not sure (Unknown)
 *   7 = I did not vote in this race (Abstain)
 *   8 = Skipped (Unknown)
 *   9 = Not asked (Unknown)
 */
const CES_2020: YearResolver = {
  idCol: "caseid",
  delimiter: ",",
  quoted: true,
  weightCols: ["vvweight_post", "commonpostweight", "vvweight", "commonweight"],
  validatedTurnoutCol: "CL_2020gvm",
  validatedTurnoutEmptyMarkers: new Set(["", "__NA__", "NA"]),
  tookPostCol: "tookpost",
  tookPostTakenValues: new Set(["2"]),
  tookPostNotTakenValues: new Set(["1"]),
  presVoteCol: "CC20_410",
  presVoteCodeMap: {
    "1": "D",
    "2": "R",
    "3": "Other",
    "4": "Other",
    "5": "Other",
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
  },
};

/**
 * CES 2024 resolver. CSV-delimited with quoted strings. The current
 * Dataverse release does NOT include CL_*-style voter validation columns
 * (validated voter file appended in a later cycle). Loader falls back to
 * tookpost + CC24_410 for turnout classification, mirroring 2012.
 *
 * CC24_410 code map (per CES_2024_GUIDE_vv.pdf, post-election president
 * vote — verify against cached codebook before relying for production):
 *   1 = Kamala Harris (D)
 *   2 = Donald Trump (R)
 *   3 = Robert F. Kennedy Jr. (Other)
 *   4 = Jill Stein (Other)
 *   5 = Cornel West (Other)
 *   6 = Chase Oliver (Other)
 *   7 = Other / write-in
 *   8 = I did not vote in this race (Abstain)
 *   9 = I'm not sure / skipped (Unknown)
 */
const CES_2024: YearResolver = {
  idCol: "caseid",
  delimiter: ",",
  quoted: true,
  weightCols: ["vvweight_post", "commonpostweight", "vvweight", "commonweight"],
  validatedTurnoutCol: undefined,
  validatedTurnoutEmptyMarkers: new Set(["", "__NA__", "NA"]),
  tookPostCol: "tookpost",
  tookPostTakenValues: new Set(["2"]),
  tookPostNotTakenValues: new Set(["1"]),
  presVoteCol: "CC24_410",
  presVoteCodeMap: {
    "1": "D",
    "2": "R",
    "3": "Other",
    "4": "Other",
    "5": "Other",
    "6": "Other",
    "7": "Other",
  },
  presVoteAbstainCodes: new Set(["8"]),
  demoCols: {
    state: "inputstate",
    birthyr: "birthyr",
    gender: "gender4", // 2024 uses gender4 not gender
    educ: "educ",
    race: "race",
    hispanic: "hispanic",
    countyFips: "countyfips",
  },
};

const RESOLVERS_BY_YEAR: Record<number, YearResolver> = {
  2012: CCES_2012,
  2016: CCES_2016,
  2020: CES_2020,
  2024: CES_2024,
  // 2008: opaque V### naming requires deeper codebook (CCES_2008_Guide_v4.doc)
  //       investigation before resolver can be authored. Tracked in
  //       results/electorate/backtest/data-needed-to-run-real-backtest.md.
};

// ─── Loader ────────────────────────────────────────────────────────────────

const NA_MARKERS = new Set(["", "__NA__", "NA"]);

function isNullCell(value: string | undefined): boolean {
  return value === undefined || NA_MARKERS.has(value.trim());
}

/**
 * Splits a single CSV/TSV row, handling quoted fields with embedded
 * delimiters and escaped `""` quote sequences. For tab-delimited files
 * with `quoted=false`, falls back to a simple `split(delimiter)` for
 * speed.
 */
function splitRow(line: string, delimiter: "\t" | ",", quoted: boolean): string[] {
  if (!quoted) return line.split(delimiter);
  const out: string[] = [];
  let buf = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"') {
        if (line[i + 1] === '"') {
          buf += '"';
          i++; // consume the escaped quote
        } else {
          inQuotes = false;
        }
      } else {
        buf += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === delimiter) {
        out.push(buf);
        buf = "";
      } else {
        buf += ch;
      }
    }
  }
  out.push(buf);
  return out;
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
  const tookPostRaw = resolver.tookPostCol ? row[resolver.tookPostCol] : undefined;
  const tookPostStr = (tookPostRaw ?? "").trim();
  const tookPostTaken = resolver.tookPostTakenValues.has(tookPostStr);
  const tookPostNotTaken = resolver.tookPostNotTakenValues.has(tookPostStr);
  const choiceRaw = row[resolver.presVoteCol];

  // Validated voter (gold-standard for turnout). Vote choice from self-report.
  // Per CCES methodology: when the voter file confirms general-election
  // turnout but the respondent's vote-choice is empty OR carries an abstain
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
  if (tookPostNotTaken) {
    return { turnoutObserved: null, turnoutValidated: false, voteChoiceObserved: "Unknown" };
  }

  // Took post-wave but no validation. Use self-report.
  if (tookPostTaken) {
    if (isNullCell(choiceRaw)) {
      // Took post-wave but vote-choice missing → unknown.
      return { turnoutObserved: null, turnoutValidated: false, voteChoiceObserved: "Unknown" };
    }
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
    // Took post-wave with an unrecognized code (e.g. "9 = not sure") →
    // voted status unknown.
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
      header = splitRow(line, resolver.delimiter, resolver.quoted);
      continue;
    }
    if (stats.rowsLoaded + stats.rowsSkipped >= limit) break;
    const fields = splitRow(line, resolver.delimiter, resolver.quoted);
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
