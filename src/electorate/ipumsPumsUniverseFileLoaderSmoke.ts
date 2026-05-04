/**
 * Smoke for the fixture-only IPUMS/PUMS file streamer.
 *
 * Hand-authored CSV/TSV fixture content (no `data/` reads, no network).
 * The smoke writes the fixture to an OS-temp file, streams it back
 * through `loadFromFile`, and asserts:
 *
 *   1. CSV and TSV variants of identical content produce byte-identical
 *      `VepUniverseRow` output (cross-format determinism).
 *   2. Re-running the same file twice produces byte-identical output
 *      (in-process determinism).
 *   3. Skip counts match the expected breakdown for the fixture.
 *   4. Every emitted row passes `validateVepUniverseRow`.
 *   5. Replicate-weight columns (REPWTP1..REPWTP4) are correctly
 *      assembled into a contiguous `replicateWeights` array.
 *   6. Optional columns (RACED, EDUCD, GQ) are honored when present.
 *   7. Unrecognized columns in the header are ignored without error.
 *   8. CSV quoted fields with embedded commas round-trip cleanly.
 *
 * Outputs:
 *   results/electorate/synthetic-electorate/ipums-pums-universe-file-loader-smoke.json
 *   results/electorate/synthetic-electorate/ipums-pums-universe-file-loader-smoke.md
 */

import { promises as fs } from "node:fs";
import * as os from "node:os";
import * as path from "node:path";

import {
  loadFromFile,
  streamFromFile,
  type FileLoaderResult,
  _internals as fileInternals,
} from "./ipumsPumsUniverseFileLoader.js";
import { validateVepUniverseRow, type VepUniverseRow } from "./vepUniverseTypes.js";
import type { IpumsLoaderMeta } from "./ipumsPumsUniverseLoader.js";

// ─── Fixture content ──────────────────────────────────────────────────────

/**
 * One representative fixture covering the full set of skip/emit cases.
 * Header contains: identifiers, demographics, weights including
 * REPWTP1..REPWTP4, plus an "EXTRA_COL" the loader should ignore.
 *
 * Rows (10 total):
 *   1: eligible white male, OH, hs_grad, REPWTPs present
 *   2: eligible white female, FL, senior
 *   3: eligible Asian female, CA, naturalized, RACED=600 (asian, refined=false)
 *   4: adult non-citizen → emitted with vepEligible=false
 *   5: under-18 → skipped (age_below_18)
 *   6: non-state STATEFIP=72 (PR) → skipped (non_state_statefip)
 *   7: group-quarters (GQ=3) → emitted with incomeBucket=null
 *   8: NHPI refinement (RACE=6, RACED=685) → emitted with race=nhpi
 *   9: missing required field (blank STATEFIP) → skipped (missing_required_field)
 *  10: weight 0 → skipped (weight_missing_or_nonpositive)
 *
 * Expected after running:
 *   rowsRead = 10
 *   rowsEmitted = 6  (rows 1, 2, 3, 4, 7, 8)
 *   rowsSkipped = 4
 *   skipBreakdown.age_below_18 = 1
 *   skipBreakdown.non_state_statefip = 1
 *   skipBreakdown.missing_required_field = 1
 *   skipBreakdown.weight_missing_or_nonpositive = 1
 */
const HEADER = [
  "YEAR", "SAMPLE", "SERIAL", "PERNUM", "STATEFIP", "PUMA",
  "AGE", "SEX", "RACE", "RACED", "HISPAN", "EDUC", "EDUCD",
  "HHINCOME", "CITIZEN", "PERWT", "GQ",
  "REPWTP1", "REPWTP2", "REPWTP3", "REPWTP4",
  "EXTRA_COL",
];
const ROWS: string[][] = [
  // Row 1: eligible white male, OH, hs_grad, with replicate weights, and
  // an EXTRA_COL value containing a comma (tests CSV quoting).
  ["2016", "201600", "100001", "1", "39", "100", "35", "1", "1", "100", "0", "6", "63", "60000", "1", "152.4", "1", "148", "150", "154", "156", "value, with comma"],
  // Row 2: eligible white female, FL, senior, no replicate weights
  ["2016", "201600", "100002", "1", "12", "200", "67", "2", "1", "",    "0", "7", "",   "35000", "1", "121.7", "1", "",    "",    "",    "",    "extra"],
  // Row 3: eligible Asian female, CA, naturalized
  ["2016", "201600", "100003", "1", "6",  "5300", "28", "2", "6", "600", "0", "9", "",   "88000", "4", "188.2", "1", "",    "",    "",    "",    "extra"],
  // Row 4: adult non-citizen (Hispanic) → emitted with vepEligible=false
  ["2016", "201600", "100004", "1", "48", "1100", "42", "1", "7", "",    "1", "4", "",   "20000", "5", "167.0", "1", "",    "",    "",    "",    "extra"],
  // Row 5: under-18 → skipped
  ["2016", "201600", "100005", "2", "36", "300",  "17", "1", "2", "",    "0", "5", "",   "30000", "1", "102.5", "1", "",    "",    "",    "",    "extra"],
  // Row 6: non-state STATEFIP=72 (PR) → skipped
  ["2016", "201600", "100006", "1", "72", "100",  "41", "2", "1", "",    "1", "7", "",   "40000", "2", "110.0", "1", "",    "",    "",    "",    "extra"],
  // Row 7: group-quarters (GQ=3) → emitted with incomeBucket=null
  ["2016", "201600", "100007", "1", "17", "400",  "22", "2", "8", "",    "0", "8", "",   "9999999", "1", "95.4", "3", "",    "",    "",    "",    "extra"],
  // Row 8: NHPI refinement (RACE=6, RACED=685) → race=nhpi
  ["2016", "201600", "100008", "1", "15", "100",  "50", "2", "6", "685", "0", "9", "",   "80000", "1", "130.0", "1", "",    "",    "",    "",    "extra"],
  // Row 9: missing required field (blank STATEFIP) → skipped
  ["2016", "201600", "100009", "1", "",   "100",  "30", "1", "1", "",    "0", "9", "",   "50000", "1", "100.0", "1", "",    "",    "",    "",    "extra"],
  // Row 10: weight = 0 → skipped (weight_missing_or_nonpositive)
  ["2016", "201600", "100010", "1", "25", "100",  "55", "2", "2", "",    "0", "9", "",   "70000", "1", "0",     "1", "",    "",    "",    "",    "extra"],
];

const META: IpumsLoaderMeta = {
  cycle: 2016,
  sourceDataset: "ipums_acs5_2012_2016_fixture",
  sourceVintage: "2012-2016",
};

// ─── Fixture serialization helpers ────────────────────────────────────────

function csvEscape(value: string): string {
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

function toTsv(rows: string[][]): string {
  return [HEADER, ...rows].map(r => r.join("\t")).join("\n") + "\n";
}

function toCsv(rows: string[][]): string {
  return [HEADER, ...rows].map(r => r.map(csvEscape).join(",")).join("\n") + "\n";
}

// ─── Comparison helpers ──────────────────────────────────────────────────

function rowsEqual(a: VepUniverseRow[], b: VepUniverseRow[]): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

// ─── Smoke runner ─────────────────────────────────────────────────────────

interface Run {
  label: string;
  filePath: string;
  result: FileLoaderResult;
}

async function runOne(label: string, filePath: string): Promise<Run> {
  const result = await loadFromFile({ filePath, meta: META });
  return { label, filePath, result };
}

async function main() {
  const tmp = await fs.mkdtemp(path.join(os.tmpdir(), "pums-fileloader-smoke-"));
  const tsvPath = path.join(tmp, "fixture.tsv");
  const csvPath = path.join(tmp, "fixture.csv");
  await fs.writeFile(tsvPath, toTsv(ROWS), "utf8");
  await fs.writeFile(csvPath, toCsv(ROWS), "utf8");

  console.log(`Wrote fixtures to ${tmp}`);

  const tsv1 = await runOne("tsv-run-1", tsvPath);
  const tsv2 = await runOne("tsv-run-2", tsvPath);
  const csv1 = await runOne("csv-run-1", csvPath);

  // ─── Invariants ────────────────────────────────────────────────────────
  const tsvDeterministic = rowsEqual(tsv1.result.rows, tsv2.result.rows);
  const csvMatchesTsv = rowsEqual(tsv1.result.rows, csv1.result.rows);

  // Re-validate every emitted row.
  let revalidationFailures = 0;
  for (const row of tsv1.result.rows) {
    if (validateVepUniverseRow(row).length > 0) revalidationFailures++;
  }

  // Skip-breakdown expectations.
  const expectedSkips = {
    age_below_18: 1,
    non_state_statefip: 1,
    weight_missing_or_nonpositive: 1,
    missing_required_field: 1,
    validation_failed: 0,
  };
  const skipBreakdownMatches = JSON.stringify(tsv1.result.stats.skipBreakdown) === JSON.stringify(expectedSkips);

  // Replicate-weight assembly: row 1 had REPWTP1..REPWTP4 = 148/150/154/156.
  // Other rows had blank replicate columns, so replicateWeights should be
  // undefined on those.
  const row1 = tsv1.result.rows[0];
  const repsCorrect = !!row1 && Array.isArray(row1.replicateWeights) &&
    row1.replicateWeights.length === 4 &&
    row1.replicateWeights[0] === 148 &&
    row1.replicateWeights[1] === 150 &&
    row1.replicateWeights[2] === 154 &&
    row1.replicateWeights[3] === 156;
  const otherRowsHaveNoReps = tsv1.result.rows.slice(1).every(r => r.replicateWeights === undefined);

  // NHPI refinement: row 8 (the third-from-last in input rows 1..10) has
  // RACE=6 RACED=685, so it should arrive as race="nhpi".
  const nhpiRow = tsv1.result.rows.find(r => r.respondentId.endsWith("-100008-1"));
  const nhpiCorrect = !!nhpiRow && nhpiRow.race === "nhpi";

  // Group-quarters: row 7 (RACE=8 GQ=3) → incomeBucket=null + coverageNotes
  // includes "group_quarters".
  const gqRow = tsv1.result.rows.find(r => r.respondentId.endsWith("-100007-1"));
  const gqCorrect = !!gqRow && gqRow.incomeBucket === null &&
    !!gqRow.coverageNotes && gqRow.coverageNotes.includes("group_quarters");

  // Non-citizen emitted with vepEligible=false.
  const nonCitizenRow = tsv1.result.rows.find(r => r.respondentId.endsWith("-100004-1"));
  const nonCitizenCorrect = !!nonCitizenRow && nonCitizenRow.vepEligible === false &&
    nonCitizenRow.citizenship === "non_citizen";

  // Quoted-field round-trip: CSV with a row containing "value, with comma"
  // in EXTRA_COL must still produce 22 fields after splitting (matches header).
  const csvLines = toCsv(ROWS).split("\n").filter(l => l.length > 0);
  const csvFirstDataRow = fileInternals.splitRow(csvLines[1]!, ",", true);
  const quotingCorrect = csvFirstDataRow.length === HEADER.length;

  // Streaming yield-count sanity: streamFromFile must yield exactly
  // rowsRead ConvertResults across the file.
  let streamedYields = 0;
  const streamIt = streamFromFile({ filePath: tsvPath, meta: META });
  for await (const _r of streamIt) { streamedYields++; }
  const streamYieldsCorrect = streamedYields === tsv1.result.stats.rowsRead;

  // In-memory variant (content rather than filePath) must match disk
  // variant byte-for-byte.
  const inMemory = await loadFromFile({ content: toTsv(ROWS), delimiter: "\t", quoted: false, meta: META });
  const inMemoryMatchesDisk = rowsEqual(inMemory.rows, tsv1.result.rows);

  console.log(`\n=== Results ===`);
  console.log(`  rowsRead=${tsv1.result.stats.rowsRead} emitted=${tsv1.result.stats.rowsEmitted} skipped=${tsv1.result.stats.rowsSkipped}`);
  console.log(`  TSV→TSV determinism: ${tsvDeterministic ? "✅" : "❌"}`);
  console.log(`  CSV matches TSV: ${csvMatchesTsv ? "✅" : "❌"}`);
  console.log(`  Skip breakdown matches expected: ${skipBreakdownMatches ? "✅" : "❌"}`);
  console.log(`    expected: ${JSON.stringify(expectedSkips)}`);
  console.log(`    actual:   ${JSON.stringify(tsv1.result.stats.skipBreakdown)}`);
  console.log(`  Replicate-weight assembly: ${repsCorrect && otherRowsHaveNoReps ? "✅" : "❌"}`);
  console.log(`  NHPI refinement: ${nhpiCorrect ? "✅" : "❌"}`);
  console.log(`  Group-quarters incomeBucket=null: ${gqCorrect ? "✅" : "❌"}`);
  console.log(`  Non-citizen emitted with vepEligible=false: ${nonCitizenCorrect ? "✅" : "❌"}`);
  console.log(`  CSV quoting round-trips correctly: ${quotingCorrect ? "✅" : "❌"}`);
  console.log(`  Stream yields = rowsRead (${tsv1.result.stats.rowsRead}): ${streamYieldsCorrect ? "✅" : "❌"}`);
  console.log(`  In-memory matches disk: ${inMemoryMatchesDisk ? "✅" : "❌"}`);
  console.log(`  Revalidation: ${revalidationFailures === 0 ? "✅" : `❌ (${revalidationFailures} failures)`}`);

  // Header-resolution unit test: an unrecognized column should be silently
  // dropped, not surface as a parse error.
  const fakeHeader = fileInternals.resolveHeader([
    "YEAR", "STATEFIP", "MYSTERY_COL", "REPWTP1", "REPWTP3",
  ]);
  const headerResolverCorrect =
    fakeHeader.fixedIndices.get("YEAR") === 0 &&
    fakeHeader.fixedIndices.get("STATEFIP") === 1 &&
    !fakeHeader.fixedIndices.has("MYSTERY_COL") &&
    fakeHeader.unrecognizedColumns.includes("MYSTERY_COL") &&
    fakeHeader.repwtpIndices.length === 2 &&
    fakeHeader.repwtpIndices[0] === 3 &&
    fakeHeader.repwtpIndices[1] === 4;
  console.log(`  Header resolver (unrecognized + sparse REPWTP): ${headerResolverCorrect ? "✅" : "❌"}`);

  // Outputs.
  const outDir = path.join(process.cwd(), "results/electorate/synthetic-electorate");
  await fs.mkdir(outDir, { recursive: true });
  const out = {
    schema_version: "v0",
    generator: "src/electorate/ipumsPumsUniverseFileLoaderSmoke.ts",
    runAt: new Date().toISOString(),
    fixture: {
      header: HEADER,
      rowCount: ROWS.length,
      formats: ["TSV", "CSV"],
      tempDir: tmp,
    },
    stats: tsv1.result.stats,
    invariants: {
      tsvDeterministic,
      csvMatchesTsv,
      skipBreakdownMatches,
      replicateWeightAssemblyCorrect: repsCorrect && otherRowsHaveNoReps,
      nhpiRefinement: nhpiCorrect,
      groupQuartersIncomeNull: gqCorrect,
      nonCitizenEmittedIneligible: nonCitizenCorrect,
      csvQuotingRoundTrips: quotingCorrect,
      streamYieldCountMatches: streamYieldsCorrect,
      inMemoryMatchesDisk: inMemoryMatchesDisk,
      revalidationClean: revalidationFailures === 0,
      headerResolverHandlesUnrecognizedAndSparseRepwtp: headerResolverCorrect,
    },
    expectedSkips,
  };
  await fs.writeFile(path.join(outDir, "ipums-pums-universe-file-loader-smoke.json"), JSON.stringify(out, null, 2));

  const md: string[] = [];
  md.push(`# IPUMS/PUMS file streamer smoke`);
  md.push(``);
  md.push(`**Run at:** ${new Date().toISOString()}`);
  md.push(`**Fixture:** ${ROWS.length} hand-authored rows, written to OS-temp as both TSV and CSV. **No \`data/\` reads.** No raw downloads.`);
  md.push(``);
  md.push(`## Stats (from TSV run)`);
  md.push(``);
  md.push(`| Metric | Value |`);
  md.push(`|---|---:|`);
  md.push(`| rowsRead | ${tsv1.result.stats.rowsRead} |`);
  md.push(`| rowsEmitted | ${tsv1.result.stats.rowsEmitted} |`);
  md.push(`| rowsSkipped | ${tsv1.result.stats.rowsSkipped} |`);
  md.push(`| Σ personWeight emitted | ${tsv1.result.stats.weightedTotalEmitted.toFixed(1)} |`);
  md.push(`| Σ vepEligible weight | ${tsv1.result.stats.weightedVepEligible.toFixed(1)} |`);
  md.push(``);
  md.push(`## Skip breakdown`);
  md.push(``);
  md.push(`| Reason | Expected | Actual |`);
  md.push(`|---|---:|---:|`);
  for (const k of Object.keys(expectedSkips) as Array<keyof typeof expectedSkips>) {
    md.push(`| ${k} | ${expectedSkips[k]} | ${tsv1.result.stats.skipBreakdown[k]} |`);
  }
  md.push(``);
  md.push(`## Invariants`);
  md.push(``);
  for (const [k, v] of Object.entries(out.invariants)) {
    md.push(`- ${k}: ${v ? "✅" : "❌"}`);
  }
  md.push(``);
  md.push(`## Notes`);
  md.push(``);
  md.push(`- Fixture covers every emit / skip path in \`convertIpumsRow\`: eligible adults, adult non-citizen (emit with vepEligible=false), under-18 (skip), non-state STATEFIP=72 (skip), group-quarters (emit with incomeBucket=null), NHPI refinement via RACED=685, missing required field (blank STATEFIP), and zero personWeight.`);
  md.push(`- Replicate weights: row 1 carries REPWTP1..REPWTP4 = 148, 150, 154, 156; assembled into a length-4 \`replicateWeights\` array. Other rows have blank replicate columns and emit \`replicateWeights: undefined\`.`);
  md.push(`- The fixture header includes an \`EXTRA_COL\` that the loader silently ignores (header resolver dropped it). One row's \`EXTRA_COL\` value contains a literal comma, exercising CSV quoted-field handling.`);
  md.push(`- Cross-format determinism: identical content in TSV vs CSV produces byte-identical \`VepUniverseRow\` output, so downstream consumers can use either format interchangeably.`);
  md.push(`- In-memory parsing (\`{ content: "..." }\`) matches disk parsing (\`{ filePath: "..." }\`) — useful for tests that don't want to round-trip through disk.`);
  md.push(``);
  md.push(`## Terminology`);
  md.push(``);
  md.push(`Engagement is referenced only as a downstream concern — separate 1D continuous scalar per ADR canon, not surfaced by the file loader. Compound moral-circle terminology applies at the bridge step (already shipped at \`d2c9e14\`), not at file-streaming time. Legacy code identifiers (\`PWGTP\`, \`RAC1P\`, \`SCHL\`, \`HHINCOME\`, \`STATEFIP\` etc.) appear only as IPUMS / PUMS column names.`);
  await fs.writeFile(path.join(outDir, "ipums-pums-universe-file-loader-smoke.md"), md.join("\n"));

  console.log(`\nWrote ${path.join(outDir, "ipums-pums-universe-file-loader-smoke.json")}`);
  console.log(`Wrote ${path.join(outDir, "ipums-pums-universe-file-loader-smoke.md")}`);

  // Cleanup OS temp.
  await fs.rm(tmp, { recursive: true, force: true });

  const overallPass =
    tsvDeterministic &&
    csvMatchesTsv &&
    skipBreakdownMatches &&
    repsCorrect && otherRowsHaveNoReps &&
    nhpiCorrect &&
    gqCorrect &&
    nonCitizenCorrect &&
    quotingCorrect &&
    streamYieldsCorrect &&
    inMemoryMatchesDisk &&
    revalidationFailures === 0 &&
    headerResolverCorrect;
  console.log(`\nOVERALL: ${overallPass ? "✅ ALL PASS" : "❌ FAILED"}`);
  if (!overallPass) process.exitCode = 1;
}

main().catch(err => { console.error(err); process.exit(1); });
