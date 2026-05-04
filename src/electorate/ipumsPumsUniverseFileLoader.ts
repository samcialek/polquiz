/**
 * Fixture-only IPUMS/PUMS file streamer (Phase 2.7 v0).
 *
 * Streaming wrapper around `convertIpumsRow` from
 * `ipumsPumsUniverseLoader.ts`. Reads CSV or TSV input whose header row
 * names columns from the IPUMS extract spec
 * (`results/electorate/synthetic-electorate/ipums-pums-extract-manifest.md`),
 * parses each row into a `RawIpumsRow`, and feeds it through the
 * existing pure converter.
 *
 * What this module IS:
 *  - A line-streaming reader (node:readline) for hand-authored fixture
 *    files in CSV or TSV format.
 *  - Header-driven column resolver: any subset of IPUMS variables
 *    appears as columns; missing optional columns become `undefined` on
 *    the `RawIpumsRow`.
 *  - REPWTP1..REPWTP80 collector: when those columns are present
 *    (any contiguous subset), they get assembled into the
 *    `REPWTP: number[]` array.
 *
 * What this module is NOT:
 *  - A real PUMS .dat / .dat.gz parser. Those files are fixed-width with
 *    DDI-described layouts; that streamer is the v1 acquisition-gated
 *    commit. This module deliberately stays in CSV/TSV territory so it
 *    can be exercised by hand-authored fixtures.
 *  - A signature carrier or vote-prediction component.
 *
 * The contract: same fixture bytes → same emitted row sequence (modulo
 * `respondentId` which is deterministic from the IPUMS identifier
 * fields). CSV vs TSV with identical content must produce identical
 * output.
 */

import { createReadStream } from "node:fs";
import { createInterface } from "node:readline";
import { Readable } from "node:stream";

import {
  convertIpumsRow,
  type ConvertResult,
  type IpumsLoaderMeta,
  type RawIpumsRow,
  type SkipReason,
} from "./ipumsPumsUniverseLoader.js";
import { type VepUniverseRow } from "./vepUniverseTypes.js";

// ─── Public surface ───────────────────────────────────────────────────────

export type FileDelimiter = "\t" | ",";

export interface FileLoaderOptions {
  /** Path on disk to a CSV or TSV fixture file. Either this or `content` must be set. */
  filePath?: string;
  /** Inline string content (useful in tests when you don't want to round-trip through disk). */
  content?: string;
  /** Field delimiter. Auto-detected from file extension when `filePath` is given and `delimiter` omitted (`.csv` → `,`, `.tsv`/`.tab` → `\t`). */
  delimiter?: FileDelimiter;
  /** CSV-style double-quote handling. Defaults to true for `,` files, false for `\t` files. */
  quoted?: boolean;
  /** Universe metadata applied to every emitted row. */
  meta: IpumsLoaderMeta;
  /** Smoke-test gate: process at most this many data rows. Null = all. */
  rowLimit?: number | null;
}

export interface FileLoaderStats {
  rowsRead: number;
  rowsEmitted: number;
  rowsSkipped: number;
  skipBreakdown: Record<SkipReason, number>;
  weightedTotalEmitted: number;
  weightedVepEligible: number;
}

export interface FileLoaderResult {
  rows: VepUniverseRow[];
  stats: FileLoaderStats;
}

// ─── Header resolution ────────────────────────────────────────────────────

/**
 * Names of fixed (non-replicate-weight) columns we know how to parse.
 * Any column in the header that isn't in this set and isn't a
 * `REPWTP\d+` is silently ignored — fixture files can carry extra
 * columns without breaking parsing.
 */
const KNOWN_NUMERIC_COLUMNS: ReadonlySet<string> = new Set([
  "YEAR", "SERIAL", "PERNUM", "STATEFIP", "PUMA",
  "AGE", "SEX", "RACE", "RACED", "HISPAN", "EDUC", "EDUCD",
  "HHINCOME", "CITIZEN", "PERWT", "GQ", "MIGSP1",
]);
const KNOWN_PASSTHROUGH_COLUMNS: ReadonlySet<string> = new Set([
  "SAMPLE", // can be alphanumeric
]);

interface ResolvedHeader {
  fixedIndices: Map<string, number>;
  /** Index into the row for REPWTP1..N, in numeric order. Missing reps yield gaps (undefined). */
  repwtpIndices: number[];
  /** Names of any header columns we did not recognize. Reported to the caller for visibility. */
  unrecognizedColumns: string[];
}

function resolveHeader(header: readonly string[]): ResolvedHeader {
  const fixedIndices = new Map<string, number>();
  const repwtpByNumber: Map<number, number> = new Map();
  const unrecognizedColumns: string[] = [];
  for (let i = 0; i < header.length; i++) {
    const name = header[i]!.trim();
    if (KNOWN_NUMERIC_COLUMNS.has(name) || KNOWN_PASSTHROUGH_COLUMNS.has(name)) {
      fixedIndices.set(name, i);
      continue;
    }
    const repMatch = /^REPWTP(\d+)$/.exec(name);
    if (repMatch) {
      const idx = parseInt(repMatch[1]!, 10);
      if (Number.isFinite(idx) && idx >= 1) repwtpByNumber.set(idx, i);
      continue;
    }
    if (name.length > 0) unrecognizedColumns.push(name);
  }
  // Order REPWTP indices by replicate number (1, 2, 3, ...). Gaps are dropped:
  // we emit a contiguous array, not a sparse one. The validator only cares
  // that present values are finite; absent reps disappear cleanly.
  const repwtpIndices: number[] = [];
  const sortedRepNums = [...repwtpByNumber.keys()].sort((a, b) => a - b);
  for (const n of sortedRepNums) repwtpIndices.push(repwtpByNumber.get(n)!);
  return { fixedIndices, repwtpIndices, unrecognizedColumns };
}

// ─── Row splitter (mirrors cesBacktestLoader's CSV/TSV handling) ──────────

function splitRow(line: string, delimiter: FileDelimiter, quoted: boolean): string[] {
  if (!quoted) return line.split(delimiter);
  const out: string[] = [];
  let buf = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"') {
        if (line[i + 1] === '"') { buf += '"'; i++; } else { inQuotes = false; }
      } else {
        buf += ch;
      }
    } else {
      if (ch === '"') { inQuotes = true; }
      else if (ch === delimiter) { out.push(buf); buf = ""; }
      else { buf += ch; }
    }
  }
  out.push(buf);
  return out;
}

// ─── Row parser ────────────────────────────────────────────────────────────

function parseFiniteInt(raw: string | undefined): number | null {
  if (raw === undefined) return null;
  const s = raw.trim();
  if (s === "" || s === "NA" || s === "__NA__") return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

function parseFiniteFloat(raw: string | undefined): number | null {
  return parseFiniteInt(raw);
}

/**
 * Build a `RawIpumsRow` from the field array using the resolved header
 * map. Returns `null` when required fields cannot be parsed (causing
 * the streamer to skip the row with `missing_required_field`).
 */
function buildRawRow(fields: readonly string[], header: ResolvedHeader): RawIpumsRow | null {
  const at = (col: string): number | undefined => {
    const idx = header.fixedIndices.get(col);
    if (idx === undefined) return undefined;
    return idx;
  };
  function num(col: string): number | null {
    const i = at(col);
    if (i === undefined) return null;
    return parseFiniteInt(fields[i]);
  }
  function numOptional(col: string): number | undefined {
    const v = num(col);
    return v === null ? undefined : v;
  }

  const YEAR = num("YEAR");
  const SERIAL = num("SERIAL");
  const PERNUM = num("PERNUM");
  const STATEFIP = num("STATEFIP");
  const AGE = num("AGE");
  const SEX = num("SEX");
  const RACE = num("RACE");
  const HISPAN = num("HISPAN");
  const EDUC = num("EDUC");
  const HHINCOME = num("HHINCOME");
  const CITIZEN = num("CITIZEN");
  const PERWT = parseFiniteFloat(at("PERWT") !== undefined ? fields[at("PERWT")!] : undefined);

  if (YEAR === null || SERIAL === null || PERNUM === null || STATEFIP === null ||
      AGE === null || SEX === null || RACE === null || HISPAN === null ||
      EDUC === null || HHINCOME === null || CITIZEN === null || PERWT === null) {
    return null;
  }
  if (SEX !== 1 && SEX !== 2) return null;

  // SAMPLE can be alphanumeric (e.g. "201600"); accept as string or number.
  const sampleIdx = at("SAMPLE");
  let SAMPLE: number | string;
  if (sampleIdx === undefined) {
    SAMPLE = "";
  } else {
    const raw = fields[sampleIdx]?.trim() ?? "";
    const asNum = Number(raw);
    SAMPLE = raw === "" ? "" : Number.isFinite(asNum) ? asNum : raw;
  }

  // Replicate weights, in replicate-number order. Skip blanks (loader is
  // tolerant of partial replicate sets in fixtures; v1 enforces 80).
  const REPWTP: number[] = [];
  for (const i of header.repwtpIndices) {
    const v = parseFiniteFloat(fields[i]);
    if (v !== null) REPWTP.push(v);
  }

  return {
    YEAR,
    SAMPLE,
    SERIAL,
    PERNUM,
    STATEFIP,
    PUMA: numOptional("PUMA"),
    AGE,
    SEX: SEX as 1 | 2,
    RACE,
    RACED: numOptional("RACED"),
    HISPAN,
    EDUC,
    EDUCD: numOptional("EDUCD"),
    HHINCOME,
    CITIZEN,
    PERWT,
    REPWTP: REPWTP.length > 0 ? REPWTP : undefined,
    GQ: numOptional("GQ"),
    MIGSP1: numOptional("MIGSP1"),
  };
}

// ─── Streamer + loader ────────────────────────────────────────────────────

function pickDefaults(opts: FileLoaderOptions): { delimiter: FileDelimiter; quoted: boolean } {
  let delimiter = opts.delimiter;
  if (!delimiter) {
    if (opts.filePath) {
      const lower = opts.filePath.toLowerCase();
      if (lower.endsWith(".csv")) delimiter = ",";
      else if (lower.endsWith(".tsv") || lower.endsWith(".tab")) delimiter = "\t";
      else delimiter = ",";
    } else {
      delimiter = ",";
    }
  }
  const quoted = opts.quoted ?? (delimiter === ",");
  return { delimiter, quoted };
}

/**
 * Stream rows from a CSV/TSV fixture, yielding `ConvertResult` per row.
 * The first non-empty line is treated as the header. Blank lines are
 * tolerated and ignored.
 */
export async function* streamFromFile(opts: FileLoaderOptions): AsyncGenerator<ConvertResult, FileLoaderStats, void> {
  const stats: FileLoaderStats = {
    rowsRead: 0,
    rowsEmitted: 0,
    rowsSkipped: 0,
    skipBreakdown: {
      age_below_18: 0,
      non_state_statefip: 0,
      weight_missing_or_nonpositive: 0,
      missing_required_field: 0,
      validation_failed: 0,
    },
    weightedTotalEmitted: 0,
    weightedVepEligible: 0,
  };

  const { delimiter, quoted } = pickDefaults(opts);
  if (!opts.filePath && opts.content === undefined) {
    throw new Error("ipumsPumsUniverseFileLoader: either filePath or content must be provided");
  }
  const stream = opts.filePath
    ? createReadStream(opts.filePath, { encoding: "utf8" })
    : Readable.from([opts.content!], { objectMode: false });
  const rl = createInterface({ input: stream, crlfDelay: Infinity });

  let header: ResolvedHeader | null = null;
  const limit = opts.rowLimit ?? Infinity;

  for await (const line of rl) {
    const trimmed = line.length === 0 ? "" : line.trimEnd();
    if (trimmed.length === 0) continue;
    if (header === null) {
      header = resolveHeader(splitRow(trimmed, delimiter, quoted));
      continue;
    }
    if (stats.rowsRead >= limit) break;
    stats.rowsRead++;
    const fields = splitRow(trimmed, delimiter, quoted);
    const raw = buildRawRow(fields, header);
    if (raw === null) {
      stats.rowsSkipped++;
      stats.skipBreakdown.missing_required_field++;
      yield { kind: "skip", reason: "missing_required_field", rowKey: `unparseable_row_${stats.rowsRead}` };
      continue;
    }
    const result = convertIpumsRow(raw, opts.meta);
    if (result.kind === "row") {
      stats.rowsEmitted++;
      stats.weightedTotalEmitted += result.row.personWeight;
      if (result.row.vepEligible) stats.weightedVepEligible += result.row.personWeight;
    } else {
      stats.rowsSkipped++;
      stats.skipBreakdown[result.reason]++;
    }
    yield result;
  }

  return stats;
}

/**
 * Convenience wrapper: load all rows into memory and return them with stats.
 * For large real PUMS extracts, prefer `streamFromFile` directly so memory
 * stays bounded.
 */
export async function loadFromFile(opts: FileLoaderOptions): Promise<FileLoaderResult> {
  const rows: VepUniverseRow[] = [];
  const it = streamFromFile(opts);
  let last: IteratorResult<ConvertResult, FileLoaderStats>;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    last = await it.next();
    if (last.done) return { rows, stats: last.value };
    if (last.value.kind === "row") rows.push(last.value.row);
  }
}

// Exposed for smoke / debugging.
export const _internals = {
  resolveHeader,
  splitRow,
  buildRawRow,
  pickDefaults,
};
