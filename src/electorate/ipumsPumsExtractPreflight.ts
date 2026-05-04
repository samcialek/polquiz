/**
 * IPUMS/PUMS extract preflight checker (Phase 2.7 v0).
 *
 * Reads only the header + first N data rows of a CSV/TSV extract and
 * reports whether the file is suitable for streaming through
 * `ipumsPumsUniverseFileLoader.ts`. Surfaces problems early, before
 * the loader has burned IO on the full extract.
 *
 * What this checker reports:
 *   - Detected delimiter (sniffed from header or extension).
 *   - Required-column coverage (hard-required vs soft-recommended).
 *   - Unknown/extra columns (informational only).
 *   - REPWTP coverage: count present, min/max index, gaps, whether
 *     the full 1..80 set is present.
 *   - Sample parse sanity: how many of the first N rows parse
 *     cleanly into a `RawIpumsRow`-shaped object, per-column finite-
 *     number parseability, and any failure reasons.
 *
 * What this checker does NOT do:
 *   - Read raw .dat / .dat.gz files (those need DDI-driven fixed-width
 *     parsing — separate v1 commit).
 *   - Stream the entire file (deferred to the file loader).
 *   - Validate row eligibility (`vepEligible`), aggregate weights, or
 *     compute marginals — those are loader-side smoke concerns.
 *   - Modify any data. Pure read-only inspection.
 *
 * The preflight returns a `PreflightReport` with `pass: boolean`.
 * `pass` is `true` iff: (a) at least one delimiter detected, (b) all
 * hard-required columns present, (c) at least one REPWTP column
 * present, and (d) at least one sample row parsed cleanly.
 */

import { createReadStream } from "node:fs";
import { createInterface } from "node:readline";
import { Readable } from "node:stream";

import { _internals as fileInternals, type FileDelimiter } from "./ipumsPumsUniverseFileLoader.js";

// ─── Public surface ───────────────────────────────────────────────────────

export interface PreflightOptions {
  /** Path on disk; OR `content` (one of the two must be set). */
  filePath?: string;
  content?: string;
  /** Number of data rows to sample for parse sanity. Default 10. */
  sampleRows?: number;
  /** Override the auto-detected delimiter. */
  delimiter?: FileDelimiter;
  /** Override CSV-style double-quote handling. Defaults from delimiter. */
  quoted?: boolean;
}

export interface RepwtpCoverage {
  /** Number of REPWTP columns observed in the header. */
  countPresent: number;
  /** Lowest replicate index seen, e.g. 1; null if no REPWTP at all. */
  minIndex: number | null;
  /** Highest replicate index seen, e.g. 80; null if no REPWTP at all. */
  maxIndex: number | null;
  /** Indices in [minIndex..maxIndex] that are missing from the header. */
  gaps: number[];
  /** True iff REPWTP1..REPWTP80 are all present. */
  isFull80: boolean;
}

export interface SampleParseFailure {
  /** 1-based row index within the data rows (header is row 0). */
  rowIndex: number;
  /** Short reason such as "missing_required_field" or "sex_not_1_or_2". */
  reason: string;
}

export interface NumericFieldCheck {
  /** Number of sample rows where the value parsed as a finite number. */
  finiteCount: number;
  /** Number of sample rows where the value was missing / blank / non-numeric. */
  nullOrNonNumericCount: number;
}

export interface PreflightReport {
  pass: boolean;
  /** Source descriptor: "file:<path>" or "memory". */
  source: string;
  /** Auto-detected (or override-provided) delimiter. */
  delimiter: FileDelimiter;
  /** True iff the delimiter was auto-detected (not caller-provided). */
  delimiterDetected: boolean;
  /** Header row split into column names. Empty when file produced no header. */
  header: string[];
  columns: {
    requiredPresent: string[];
    requiredMissing: string[];
    recommendedPresent: string[];
    recommendedMissing: string[];
    unknownColumns: string[];
  };
  repwtp: RepwtpCoverage;
  sample: {
    rowsRequested: number;
    rowsSampled: number;
    parseSuccessCount: number;
    parseFailureCount: number;
    parseFailures: SampleParseFailure[];
    numericFieldChecks: Record<string, NumericFieldCheck>;
  };
  warnings: string[];
  errors: string[];
}

// ─── Constants ─────────────────────────────────────────────────────────────

const HARD_REQUIRED: readonly string[] = [
  "YEAR", "SAMPLE", "SERIAL", "PERNUM", "STATEFIP", "PUMA",
  "AGE", "SEX", "RACE", "HISPAN", "EDUC", "HHINCOME", "CITIZEN",
  "PERWT",
];

const SOFT_RECOMMENDED: readonly string[] = [
  "RACED", "EDUCD", "GQ", "MIGSP1",
];

const NUMERIC_SAMPLE_COLUMNS: readonly string[] = [
  "YEAR", "SERIAL", "PERNUM", "STATEFIP", "AGE", "SEX",
  "RACE", "HISPAN", "EDUC", "HHINCOME", "CITIZEN", "PERWT",
];

const REPWTP_TARGET_COUNT = 80;

// ─── Helpers ───────────────────────────────────────────────────────────────

function sniffDelimiter(headerLine: string): FileDelimiter {
  const tabs = (headerLine.match(/\t/g) ?? []).length;
  const commas = (headerLine.match(/,/g) ?? []).length;
  return tabs > commas ? "\t" : ",";
}

function pickDelimiter(opts: PreflightOptions, headerLine: string): { delimiter: FileDelimiter; detected: boolean } {
  if (opts.delimiter) return { delimiter: opts.delimiter, detected: false };
  if (opts.filePath) {
    const lower = opts.filePath.toLowerCase();
    if (lower.endsWith(".csv")) return { delimiter: ",", detected: true };
    if (lower.endsWith(".tsv") || lower.endsWith(".tab")) return { delimiter: "\t", detected: true };
  }
  return { delimiter: sniffDelimiter(headerLine), detected: true };
}

function parseFiniteFromCell(raw: string | undefined): number | null {
  if (raw === undefined) return null;
  const s = raw.trim();
  if (s === "" || s === "NA" || s === "__NA__") return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

function describeColumns(header: readonly string[]): {
  requiredPresent: string[];
  requiredMissing: string[];
  recommendedPresent: string[];
  recommendedMissing: string[];
  unknownColumns: string[];
} {
  const headerSet = new Set(header.map(h => h.trim()));
  const requiredPresent = HARD_REQUIRED.filter(c => headerSet.has(c));
  const requiredMissing = HARD_REQUIRED.filter(c => !headerSet.has(c));
  const recommendedPresent = SOFT_RECOMMENDED.filter(c => headerSet.has(c));
  const recommendedMissing = SOFT_RECOMMENDED.filter(c => !headerSet.has(c));
  const known = new Set<string>([...HARD_REQUIRED, ...SOFT_RECOMMENDED]);
  const unknownColumns: string[] = [];
  for (const name of headerSet) {
    if (name.length === 0) continue;
    if (known.has(name)) continue;
    if (/^REPWTP\d+$/.test(name)) continue;
    unknownColumns.push(name);
  }
  unknownColumns.sort();
  return { requiredPresent, requiredMissing, recommendedPresent, recommendedMissing, unknownColumns };
}

function describeRepwtp(header: readonly string[]): RepwtpCoverage {
  const indices: number[] = [];
  for (const name of header) {
    const m = /^REPWTP(\d+)$/.exec(name.trim());
    if (m) {
      const n = parseInt(m[1]!, 10);
      if (Number.isFinite(n) && n >= 1) indices.push(n);
    }
  }
  if (indices.length === 0) {
    return { countPresent: 0, minIndex: null, maxIndex: null, gaps: [], isFull80: false };
  }
  indices.sort((a, b) => a - b);
  const minIndex = indices[0]!;
  const maxIndex = indices[indices.length - 1]!;
  const present = new Set(indices);
  const gaps: number[] = [];
  for (let i = minIndex; i <= maxIndex; i++) {
    if (!present.has(i)) gaps.push(i);
  }
  const isFull80 = minIndex === 1 && maxIndex === REPWTP_TARGET_COUNT && gaps.length === 0;
  return { countPresent: indices.length, minIndex, maxIndex, gaps, isFull80 };
}

/** Try to parse one row into a typed shape. Returns either success or a failure reason. */
function trySampleRow(
  header: readonly string[],
  fields: readonly string[],
): { ok: true } | { ok: false; reason: string } {
  function indexOf(col: string): number { return header.indexOf(col); }

  for (const col of HARD_REQUIRED) {
    const idx = indexOf(col);
    if (idx < 0) {
      // Missing required column already surfaces in `requiredMissing`. Don't double-report.
      return { ok: false, reason: `header_missing_${col}` };
    }
    if (col === "SAMPLE") {
      // SAMPLE is allowed to be alphanumeric; just require non-empty.
      if ((fields[idx] ?? "").trim() === "") return { ok: false, reason: `${col}_empty` };
      continue;
    }
    if (col === "PUMA") continue; // PUMA may be 0 / empty in some PUMS samples; warn-not-fail.
    const v = parseFiniteFromCell(fields[idx]);
    if (v === null) return { ok: false, reason: `${col}_not_finite_number` };
  }

  const sexIdx = indexOf("SEX");
  if (sexIdx >= 0) {
    const sx = parseFiniteFromCell(fields[sexIdx]);
    if (sx !== 1 && sx !== 2) return { ok: false, reason: "sex_not_1_or_2" };
  }
  return { ok: true };
}

// ─── Streaming reader (header + first N rows only) ────────────────────────

async function readHeaderAndSample(
  opts: PreflightOptions,
): Promise<{ headerLine: string | null; dataLines: string[] }> {
  if (opts.filePath === undefined && opts.content === undefined) {
    throw new Error("ipumsPumsExtractPreflight: either filePath or content must be provided");
  }
  const stream = opts.filePath !== undefined
    ? createReadStream(opts.filePath, { encoding: "utf8" })
    : Readable.from([opts.content!], { objectMode: false });
  const rl = createInterface({ input: stream, crlfDelay: Infinity });
  const limit = Math.max(1, opts.sampleRows ?? 10);
  let headerLine: string | null = null;
  const dataLines: string[] = [];
  for await (const raw of rl) {
    const trimmed = raw.length === 0 ? "" : raw.trimEnd();
    if (trimmed.length === 0) continue;
    if (headerLine === null) {
      headerLine = trimmed;
      continue;
    }
    if (dataLines.length >= limit) break;
    dataLines.push(trimmed);
  }
  rl.close();
  // Drain the stream so we don't leak a file descriptor when we early-break.
  if (typeof (stream as { destroy?: () => void }).destroy === "function") {
    (stream as { destroy?: () => void }).destroy!();
  }
  return { headerLine, dataLines };
}

// ─── Public entry ─────────────────────────────────────────────────────────

/**
 * Run the preflight on a fixture or file. Pure: deterministic given input;
 * no global state.
 */
export async function preflightExtract(opts: PreflightOptions): Promise<PreflightReport> {
  const source = opts.filePath !== undefined ? `file:${opts.filePath}` : "memory";
  const sampleRowsRequested = Math.max(1, opts.sampleRows ?? 10);

  const { headerLine, dataLines } = await readHeaderAndSample(opts);

  const errors: string[] = [];
  const warnings: string[] = [];

  if (headerLine === null) {
    return {
      pass: false,
      source,
      delimiter: opts.delimiter ?? ",",
      delimiterDetected: opts.delimiter === undefined,
      header: [],
      columns: {
        requiredPresent: [],
        requiredMissing: [...HARD_REQUIRED],
        recommendedPresent: [],
        recommendedMissing: [...SOFT_RECOMMENDED],
        unknownColumns: [],
      },
      repwtp: { countPresent: 0, minIndex: null, maxIndex: null, gaps: [], isFull80: false },
      sample: {
        rowsRequested: sampleRowsRequested,
        rowsSampled: 0,
        parseSuccessCount: 0,
        parseFailureCount: 0,
        parseFailures: [],
        numericFieldChecks: {},
      },
      warnings: [],
      errors: ["empty_or_unreadable_input"],
    };
  }

  const { delimiter, detected } = pickDelimiter(opts, headerLine);
  const quoted = opts.quoted ?? (delimiter === ",");

  const headerFields = fileInternals.splitRow(headerLine, delimiter, quoted).map(s => s.trim());

  const columns = describeColumns(headerFields);
  const repwtp = describeRepwtp(headerFields);

  if (columns.requiredMissing.length > 0) {
    errors.push(`required_columns_missing: ${columns.requiredMissing.join(",")}`);
  }
  if (repwtp.countPresent === 0) {
    errors.push("no_repwtp_columns_present");
  } else if (!repwtp.isFull80) {
    warnings.push(`repwtp_not_full_80: countPresent=${repwtp.countPresent}, minIndex=${repwtp.minIndex}, maxIndex=${repwtp.maxIndex}, gaps=${repwtp.gaps.length}`);
  }
  if (columns.recommendedMissing.length > 0) {
    warnings.push(`recommended_columns_missing: ${columns.recommendedMissing.join(",")}`);
  }
  if (columns.unknownColumns.length > 0) {
    warnings.push(`unknown_columns_in_header: ${columns.unknownColumns.join(",")}`);
  }

  // Sample parse sanity.
  const numericFieldChecks: Record<string, NumericFieldCheck> = {};
  for (const col of NUMERIC_SAMPLE_COLUMNS) {
    numericFieldChecks[col] = { finiteCount: 0, nullOrNonNumericCount: 0 };
  }
  let parseSuccessCount = 0;
  const parseFailures: SampleParseFailure[] = [];
  for (let i = 0; i < dataLines.length; i++) {
    const fields = fileInternals.splitRow(dataLines[i]!, delimiter, quoted);
    const result = trySampleRow(headerFields, fields);
    if (result.ok) parseSuccessCount++;
    else parseFailures.push({ rowIndex: i + 1, reason: result.reason });
    // Per-column finite check.
    for (const col of NUMERIC_SAMPLE_COLUMNS) {
      const idx = headerFields.indexOf(col);
      if (idx < 0) continue;
      const v = parseFiniteFromCell(fields[idx]);
      if (v === null) numericFieldChecks[col]!.nullOrNonNumericCount++;
      else numericFieldChecks[col]!.finiteCount++;
    }
  }
  if (dataLines.length > 0 && parseSuccessCount === 0) {
    errors.push("no_sample_rows_parsed_cleanly");
  } else if (dataLines.length > 0 && parseFailures.length > 0) {
    warnings.push(`some_sample_rows_failed_parse: ${parseFailures.length}/${dataLines.length}`);
  }
  if (dataLines.length === 0) {
    warnings.push("no_data_rows_observed");
  }

  const pass = errors.length === 0;

  return {
    pass,
    source,
    delimiter,
    delimiterDetected: detected,
    header: headerFields,
    columns,
    repwtp,
    sample: {
      rowsRequested: sampleRowsRequested,
      rowsSampled: dataLines.length,
      parseSuccessCount,
      parseFailureCount: parseFailures.length,
      parseFailures,
      numericFieldChecks,
    },
    warnings,
    errors,
  };
}

// Exposed for smoke / debugging.
export const _internals = {
  HARD_REQUIRED,
  SOFT_RECOMMENDED,
  NUMERIC_SAMPLE_COLUMNS,
  REPWTP_TARGET_COUNT,
  sniffDelimiter,
  pickDelimiter,
  describeColumns,
  describeRepwtp,
  trySampleRow,
  parseFiniteFromCell,
};
