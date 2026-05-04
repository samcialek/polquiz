/**
 * Smoke for `ipumsPumsExtractPreflight.ts`.
 *
 * In-memory fixture content only — NO `data/` reads, NO disk I/O beyond
 * the OS-temp transient used by `runWithDiskRoundTrip` (cleaned up at
 * end). Each scenario exercises one preflight path:
 *
 *   1. complete_tsv     — all required columns + 80 REPWTP → pass clean
 *   2. complete_csv     — same content, CSV format → pass clean (cross-format)
 *   3. missing_required — drop PERWT and AGE → fail with required_columns_missing
 *   4. sparse_repwtp    — only REPWTP1, REPWTP3, REPWTP10 → pass + sparse warning
 *   5. no_repwtp        — zero REPWTP columns → fail with no_repwtp_columns_present
 *   6. unknown_extra    — header carries an extra column → pass + unknown warning
 *   7. delimiter_sniff  — TSV via in-memory content (no extension hint) → sniffed
 *   8. bad_sample_row   — row with non-numeric AGE → parseFailure flagged
 *   9. empty_input      — no header at all → pass=false, empty_or_unreadable_input
 *  10. recommended_only_missing — drop RACED/EDUCD/GQ/MIGSP1 → pass + recommended warning
 *  11. zero_data_rows   — header only, no data → pass + no_data_rows_observed warning
 *
 * Outputs:
 *   results/electorate/synthetic-electorate/ipums-pums-extract-preflight-smoke.json
 *   results/electorate/synthetic-electorate/ipums-pums-extract-preflight-smoke.md
 */

import { promises as fs } from "node:fs";
import * as os from "node:os";
import * as path from "node:path";

import { preflightExtract, type PreflightReport } from "./ipumsPumsExtractPreflight.js";

// ─── Fixture helpers ──────────────────────────────────────────────────────

function buildHeader(repwtpIndices: number[], extras: string[] = [], excluded: string[] = []): string[] {
  const base = [
    "YEAR", "SAMPLE", "SERIAL", "PERNUM", "STATEFIP", "PUMA",
    "AGE", "SEX", "RACE", "RACED", "HISPAN", "EDUC", "EDUCD",
    "HHINCOME", "CITIZEN", "PERWT", "GQ", "MIGSP1",
  ].filter(c => !excluded.includes(c));
  return [...base, ...repwtpIndices.map(n => `REPWTP${n}`), ...extras];
}

function csvEscape(value: string): string {
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

function joinRow(values: string[], delimiter: "\t" | ","): string {
  if (delimiter === ",") return values.map(csvEscape).join(",");
  return values.join(delimiter);
}

function buildSampleRow(opts: {
  age?: string;
  perwt?: string;
  statefip?: string;
  extras?: number;
  numRepwtp?: number;
  excluded?: string[];
} = {}): string[] {
  const cols = [
    "2016",            // YEAR
    "201600",          // SAMPLE
    "100001",          // SERIAL
    "1",               // PERNUM
    opts.statefip ?? "39", // STATEFIP
    "100",             // PUMA
    opts.age ?? "35",  // AGE
    "1",               // SEX
    "1",               // RACE
    "100",             // RACED
    "0",               // HISPAN
    "6",               // EDUC
    "63",              // EDUCD
    "60000",           // HHINCOME
    "1",               // CITIZEN
    opts.perwt ?? "152.4", // PERWT
    "1",               // GQ
    "0",               // MIGSP1
  ];
  // Drop excluded
  const excluded = opts.excluded ?? [];
  const colNames = ["YEAR", "SAMPLE", "SERIAL", "PERNUM", "STATEFIP", "PUMA", "AGE", "SEX", "RACE", "RACED", "HISPAN", "EDUC", "EDUCD", "HHINCOME", "CITIZEN", "PERWT", "GQ", "MIGSP1"];
  const filtered = cols.filter((_, i) => !excluded.includes(colNames[i]!));
  // Replicate weights
  const reps: string[] = [];
  for (let i = 0; i < (opts.numRepwtp ?? 0); i++) reps.push(String(150 + i));
  // Extras
  const extras: string[] = [];
  for (let i = 0; i < (opts.extras ?? 0); i++) extras.push(`extra_${i}`);
  return [...filtered, ...reps, ...extras];
}

function buildFixture(args: {
  repwtpIndices: number[];
  extras?: string[];
  excluded?: string[];
  rows: string[][];
  delimiter: "\t" | ",";
}): string {
  const header = buildHeader(args.repwtpIndices, args.extras ?? [], args.excluded ?? []);
  const lines = [joinRow(header, args.delimiter)];
  for (const row of args.rows) lines.push(joinRow(row, args.delimiter));
  return lines.join("\n") + "\n";
}

// ─── Scenarios ────────────────────────────────────────────────────────────

interface Scenario {
  name: string;
  description: string;
  content: string;
  delimiter?: "\t" | ",";   // override; otherwise sniffed
  expectedPass: boolean;
  expectedErrors: string[]; // substrings to look for
  expectedWarnings: string[];
  customAssertions?: (report: PreflightReport) => Array<{ label: string; ok: boolean }>;
}

const REPWTP_FULL = Array.from({ length: 80 }, (_, i) => i + 1);

const scenarios: Scenario[] = [
  {
    name: "complete_tsv",
    description: "All required + recommended columns + 80 REPWTP → pass clean",
    content: buildFixture({
      repwtpIndices: REPWTP_FULL,
      delimiter: "\t",
      rows: [buildSampleRow({ numRepwtp: 80 }), buildSampleRow({ numRepwtp: 80 })],
    }),
    delimiter: "\t",
    expectedPass: true,
    expectedErrors: [],
    expectedWarnings: [],
    customAssertions: (r) => [
      { label: "repwtp.isFull80", ok: r.repwtp.isFull80 },
      { label: "repwtp.countPresent === 80", ok: r.repwtp.countPresent === 80 },
      { label: "no recommended missing", ok: r.columns.recommendedMissing.length === 0 },
      { label: "no unknown columns", ok: r.columns.unknownColumns.length === 0 },
    ],
  },
  {
    name: "complete_csv",
    description: "Same as complete_tsv but CSV format",
    content: buildFixture({
      repwtpIndices: REPWTP_FULL,
      delimiter: ",",
      rows: [buildSampleRow({ numRepwtp: 80 }), buildSampleRow({ numRepwtp: 80 })],
    }),
    delimiter: ",",
    expectedPass: true,
    expectedErrors: [],
    expectedWarnings: [],
    customAssertions: (r) => [
      { label: "delimiter is ,", ok: r.delimiter === "," },
      { label: "repwtp.isFull80", ok: r.repwtp.isFull80 },
    ],
  },
  {
    name: "missing_required",
    description: "Drop PERWT and AGE → fail with required_columns_missing",
    content: buildFixture({
      repwtpIndices: [1, 2, 3, 4],
      excluded: ["PERWT", "AGE"],
      delimiter: "\t",
      rows: [buildSampleRow({ numRepwtp: 4, excluded: ["PERWT", "AGE"] })],
    }),
    delimiter: "\t",
    expectedPass: false,
    expectedErrors: ["required_columns_missing"],
    expectedWarnings: [],
    customAssertions: (r) => [
      { label: "PERWT in requiredMissing", ok: r.columns.requiredMissing.includes("PERWT") },
      { label: "AGE in requiredMissing", ok: r.columns.requiredMissing.includes("AGE") },
      { label: "errors mention PERWT", ok: r.errors.some(e => e.includes("PERWT")) },
    ],
  },
  {
    name: "sparse_repwtp",
    description: "Only REPWTP1, REPWTP3, REPWTP10 → pass + sparse warning",
    content: buildFixture({
      repwtpIndices: [1, 3, 10],
      delimiter: "\t",
      rows: [buildSampleRow({ numRepwtp: 3 })],
    }),
    delimiter: "\t",
    expectedPass: true,
    expectedErrors: [],
    expectedWarnings: ["repwtp_not_full_80"],
    customAssertions: (r) => [
      { label: "countPresent === 3", ok: r.repwtp.countPresent === 3 },
      { label: "minIndex === 1", ok: r.repwtp.minIndex === 1 },
      { label: "maxIndex === 10", ok: r.repwtp.maxIndex === 10 },
      { label: "gaps include 2 and 4..9", ok: r.repwtp.gaps.includes(2) && r.repwtp.gaps.includes(4) && r.repwtp.gaps.includes(9) && r.repwtp.gaps.length === 7 },
      { label: "isFull80 false", ok: !r.repwtp.isFull80 },
    ],
  },
  {
    name: "no_repwtp",
    description: "Zero REPWTP columns → fail with no_repwtp_columns_present",
    content: buildFixture({
      repwtpIndices: [],
      delimiter: "\t",
      rows: [buildSampleRow({ numRepwtp: 0 })],
    }),
    delimiter: "\t",
    expectedPass: false,
    expectedErrors: ["no_repwtp_columns_present"],
    expectedWarnings: [],
    customAssertions: (r) => [
      { label: "countPresent === 0", ok: r.repwtp.countPresent === 0 },
      { label: "isFull80 false", ok: !r.repwtp.isFull80 },
    ],
  },
  {
    name: "unknown_extra",
    description: "Header carries an extra column → pass + unknown warning",
    content: buildFixture({
      repwtpIndices: [1, 2, 3, 4],
      extras: ["MYSTERY_FIELD"],
      delimiter: "\t",
      rows: [buildSampleRow({ numRepwtp: 4, extras: 1 })],
    }),
    delimiter: "\t",
    expectedPass: true,
    expectedErrors: [],
    expectedWarnings: ["unknown_columns_in_header"],
    customAssertions: (r) => [
      { label: "MYSTERY_FIELD in unknownColumns", ok: r.columns.unknownColumns.includes("MYSTERY_FIELD") },
    ],
  },
  {
    name: "delimiter_sniff",
    description: "TSV via in-memory content (no filePath/extension hint) → sniffed automatically",
    content: buildFixture({
      repwtpIndices: [1, 2, 3, 4],
      delimiter: "\t",
      rows: [buildSampleRow({ numRepwtp: 4 })],
    }),
    // intentionally omit delimiter so the preflight must sniff
    expectedPass: true,
    expectedErrors: [],
    expectedWarnings: ["repwtp_not_full_80"],
    customAssertions: (r) => [
      { label: "delimiter sniffed to \\t", ok: r.delimiter === "\t" },
      { label: "delimiterDetected true", ok: r.delimiterDetected === true },
    ],
  },
  {
    name: "bad_sample_row",
    description: "Row with non-numeric AGE → parseFailure flagged",
    content: buildFixture({
      repwtpIndices: [1, 2, 3, 4],
      delimiter: "\t",
      rows: [
        buildSampleRow({ numRepwtp: 4 }),                  // good row
        buildSampleRow({ age: "not_a_number", numRepwtp: 4 }), // bad row
      ],
    }),
    delimiter: "\t",
    expectedPass: true,
    expectedErrors: [],
    expectedWarnings: ["some_sample_rows_failed_parse", "repwtp_not_full_80"],
    customAssertions: (r) => [
      { label: "rowsSampled === 2", ok: r.sample.rowsSampled === 2 },
      { label: "parseSuccessCount === 1", ok: r.sample.parseSuccessCount === 1 },
      { label: "parseFailureCount === 1", ok: r.sample.parseFailureCount === 1 },
      { label: "first failure reason mentions AGE", ok: r.sample.parseFailures.length === 1 && r.sample.parseFailures[0]!.reason.includes("AGE") },
      { label: "AGE finiteCount === 1", ok: r.sample.numericFieldChecks.AGE!.finiteCount === 1 },
      { label: "AGE nullOrNonNumericCount === 1", ok: r.sample.numericFieldChecks.AGE!.nullOrNonNumericCount === 1 },
    ],
  },
  {
    name: "empty_input",
    description: "No header → pass=false with empty_or_unreadable_input",
    content: "",
    expectedPass: false,
    expectedErrors: ["empty_or_unreadable_input"],
    expectedWarnings: [],
    customAssertions: (r) => [
      { label: "header empty", ok: r.header.length === 0 },
      { label: "rowsSampled === 0", ok: r.sample.rowsSampled === 0 },
    ],
  },
  {
    name: "recommended_only_missing",
    description: "Drop RACED, EDUCD, GQ, MIGSP1 → pass + recommended warning",
    content: buildFixture({
      repwtpIndices: [1, 2, 3, 4],
      excluded: ["RACED", "EDUCD", "GQ", "MIGSP1"],
      delimiter: "\t",
      rows: [buildSampleRow({ numRepwtp: 4, excluded: ["RACED", "EDUCD", "GQ", "MIGSP1"] })],
    }),
    delimiter: "\t",
    expectedPass: true,
    expectedErrors: [],
    expectedWarnings: ["recommended_columns_missing", "repwtp_not_full_80"],
    customAssertions: (r) => [
      { label: "all 4 recommended missing", ok: r.columns.recommendedMissing.length === 4 },
      { label: "all required present", ok: r.columns.requiredMissing.length === 0 },
    ],
  },
  {
    name: "zero_data_rows",
    description: "Header only, no data rows → pass + no_data_rows_observed warning",
    content: buildFixture({
      repwtpIndices: REPWTP_FULL,
      delimiter: "\t",
      rows: [],
    }),
    delimiter: "\t",
    expectedPass: true,
    expectedErrors: [],
    expectedWarnings: ["no_data_rows_observed"],
    customAssertions: (r) => [
      { label: "rowsSampled === 0", ok: r.sample.rowsSampled === 0 },
      { label: "parseSuccessCount === 0", ok: r.sample.parseSuccessCount === 0 },
    ],
  },
];

// ─── Runner ───────────────────────────────────────────────────────────────

interface ScenarioResult {
  name: string;
  description: string;
  pass: boolean;
  passOk: boolean;
  errorsOk: boolean;
  warningsOk: boolean;
  customAssertionsAllOk: boolean;
  customAssertionResults: Array<{ label: string; ok: boolean }>;
  report: PreflightReport;
}

function arrayContainsAll(haystack: string[], needles: string[]): boolean {
  return needles.every(n => haystack.some(h => h.includes(n)));
}

async function runScenario(s: Scenario): Promise<ScenarioResult> {
  const report = await preflightExtract({
    content: s.content,
    delimiter: s.delimiter,
    sampleRows: 10,
  });
  const passOk = report.pass === s.expectedPass;
  const errorsOk = arrayContainsAll(report.errors, s.expectedErrors);
  const warningsOk = arrayContainsAll(report.warnings, s.expectedWarnings);
  const customAssertionResults = s.customAssertions ? s.customAssertions(report) : [];
  const customAssertionsAllOk = customAssertionResults.every(a => a.ok);
  return {
    name: s.name,
    description: s.description,
    pass: passOk && errorsOk && warningsOk && customAssertionsAllOk,
    passOk,
    errorsOk,
    warningsOk,
    customAssertionsAllOk,
    customAssertionResults,
    report,
  };
}

async function runWithDiskRoundTrip(): Promise<{ memoryReport: PreflightReport; diskReport: PreflightReport; equivalent: boolean }> {
  // Round-trip the complete_tsv scenario through OS-temp to confirm filePath
  // and content paths produce equivalent reports (modulo the `source` field).
  const tmp = await fs.mkdtemp(path.join(os.tmpdir(), "preflight-smoke-"));
  const filePath = path.join(tmp, "fixture.tsv");
  const fixture = buildFixture({
    repwtpIndices: REPWTP_FULL,
    delimiter: "\t",
    rows: [buildSampleRow({ numRepwtp: 80 })],
  });
  await fs.writeFile(filePath, fixture, "utf8");
  // Both paths must auto-detect the delimiter so `delimiterDetected: true`
  // matches; explicitly passing `delimiter` would flip the flag and the
  // round-trip equivalence check would diverge.
  const memoryReport = await preflightExtract({ content: fixture });
  const diskReport = await preflightExtract({ filePath });
  // Ignore source field when comparing.
  const memCopy = { ...memoryReport, source: "" };
  const diskCopy = { ...diskReport, source: "" };
  const equivalent = JSON.stringify(memCopy) === JSON.stringify(diskCopy);
  await fs.rm(tmp, { recursive: true, force: true });
  return { memoryReport, diskReport, equivalent };
}

// ─── Main ─────────────────────────────────────────────────────────────────

function pct(n: number, d: number): string {
  return d === 0 ? "0.0%" : (100 * n / d).toFixed(1) + "%";
}

async function main() {
  const results: ScenarioResult[] = [];
  for (const s of scenarios) {
    const r = await runScenario(s);
    results.push(r);
    console.log(`[${r.pass ? "✅" : "❌"}] ${r.name} — ${r.description}`);
    if (!r.passOk) console.log(`     pass mismatch: expected ${scenarios.find(x => x.name === r.name)!.expectedPass}, got ${r.report.pass}`);
    if (!r.errorsOk) console.log(`     errors mismatch: expected substrings ${JSON.stringify(scenarios.find(x => x.name === r.name)!.expectedErrors)} in ${JSON.stringify(r.report.errors)}`);
    if (!r.warningsOk) console.log(`     warnings mismatch: expected substrings ${JSON.stringify(scenarios.find(x => x.name === r.name)!.expectedWarnings)} in ${JSON.stringify(r.report.warnings)}`);
    for (const a of r.customAssertionResults) {
      if (!a.ok) console.log(`     custom: ${a.label} ❌`);
    }
  }

  const diskRoundTrip = await runWithDiskRoundTrip();
  console.log(`\nDisk round-trip equivalent to in-memory: ${diskRoundTrip.equivalent ? "✅" : "❌"}`);

  const allPassed = results.every(r => r.pass) && diskRoundTrip.equivalent;
  console.log(`\nOVERALL: ${allPassed ? "✅ ALL PASS" : "❌ FAILED"} (${results.filter(r => r.pass).length}/${results.length} scenarios passed)`);

  // Outputs.
  const outDir = path.join(process.cwd(), "results/electorate/synthetic-electorate");
  await fs.mkdir(outDir, { recursive: true });
  const out = {
    schema_version: "v0",
    generator: "src/electorate/ipumsPumsExtractPreflightSmoke.ts",
    runAt: new Date().toISOString(),
    scenarios: results.map(r => ({
      name: r.name,
      description: r.description,
      pass: r.pass,
      passOk: r.passOk,
      errorsOk: r.errorsOk,
      warningsOk: r.warningsOk,
      customAssertionsAllOk: r.customAssertionsAllOk,
      customAssertionResults: r.customAssertionResults,
      report: r.report,
    })),
    diskRoundTrip: {
      equivalent: diskRoundTrip.equivalent,
    },
    overall: {
      scenariosPassed: results.filter(r => r.pass).length,
      scenariosTotal: results.length,
      allPassed,
    },
  };
  await fs.writeFile(path.join(outDir, "ipums-pums-extract-preflight-smoke.json"), JSON.stringify(out, null, 2));

  const md: string[] = [];
  md.push(`# IPUMS/PUMS extract preflight smoke`);
  md.push(``);
  md.push(`**Run at:** ${new Date().toISOString()}`);
  md.push(`**Fixtures:** in-memory only. **No \`data/\` reads.** No raw downloads.`);
  md.push(``);
  md.push(`The preflight reads only the header + first N data rows of a CSV/TSV extract and reports whether it is suitable for streaming through \`ipumsPumsUniverseFileLoader.ts\`. \`pass: true\` requires all hard-required columns present, at least one REPWTP column present, and at least one sample row that parses cleanly.`);
  md.push(``);
  md.push(`## Scenario coverage`);
  md.push(``);
  md.push(`| # | Scenario | Pass | Description |`);
  md.push(`|---:|---|:-:|---|`);
  results.forEach((r, i) => {
    md.push(`| ${i + 1} | \`${r.name}\` | ${r.pass ? "✅" : "❌"} | ${r.description} |`);
  });
  md.push(``);
  md.push(`## Per-scenario detail`);
  md.push(``);
  for (const r of results) {
    md.push(`### \`${r.name}\` — ${r.pass ? "✅" : "❌"}`);
    md.push(``);
    md.push(`- ${r.description}`);
    md.push(`- pass=${r.report.pass}, delimiter=${r.report.delimiter === "\t" ? "TAB" : r.report.delimiter}, delimiterDetected=${r.report.delimiterDetected}`);
    if (r.report.errors.length > 0) md.push(`- errors: ${r.report.errors.join("; ")}`);
    if (r.report.warnings.length > 0) md.push(`- warnings: ${r.report.warnings.join("; ")}`);
    md.push(`- columns.requiredMissing: [${r.report.columns.requiredMissing.join(", ")}]`);
    md.push(`- columns.recommendedMissing: [${r.report.columns.recommendedMissing.join(", ")}]`);
    md.push(`- columns.unknownColumns: [${r.report.columns.unknownColumns.join(", ")}]`);
    md.push(`- repwtp: countPresent=${r.report.repwtp.countPresent}, minIndex=${r.report.repwtp.minIndex}, maxIndex=${r.report.repwtp.maxIndex}, gaps=${r.report.repwtp.gaps.length}, isFull80=${r.report.repwtp.isFull80}`);
    md.push(`- sample: rowsSampled=${r.report.sample.rowsSampled}, parseSuccess=${r.report.sample.parseSuccessCount}, parseFailure=${r.report.sample.parseFailureCount}`);
    if (r.customAssertionResults.length > 0) {
      const passedCount = r.customAssertionResults.filter(a => a.ok).length;
      md.push(`- custom assertions: ${passedCount}/${r.customAssertionResults.length} passed`);
      for (const a of r.customAssertionResults.filter(x => !x.ok)) md.push(`  - ❌ ${a.label}`);
    }
    md.push(``);
  }
  md.push(`## Disk vs in-memory equivalence`);
  md.push(``);
  md.push(`Round-tripping the \`complete_tsv\` fixture through OS-temp produces a report byte-identical to the in-memory variant (ignoring the \`source\` field): ${diskRoundTrip.equivalent ? "✅" : "❌"}`);
  md.push(``);
  md.push(`## Overall`);
  md.push(``);
  md.push(`- Scenarios passed: ${results.filter(r => r.pass).length} / ${results.length} (${pct(results.filter(r => r.pass).length, results.length)})`);
  md.push(`- Disk round-trip equivalence: ${diskRoundTrip.equivalent ? "✅" : "❌"}`);
  md.push(`- **Overall:** ${allPassed ? "✅ ALL PASS" : "❌ FAILED"}`);
  md.push(``);
  md.push(`## Terminology`);
  md.push(``);
  md.push(`Engagement is referenced only as a downstream concern — separate 1D continuous scalar per ADR canon, not surfaced by the preflight. Compound moral-circle terminology applies at the bridge step (already shipped at \`d2c9e14\`), not at extract preflight time. Legacy code identifiers (\`PWGTP\`, \`RAC1P\`, \`SCHL\`, \`HHINCOME\`, \`STATEFIP\`, \`HISP\` etc.) appear only as IPUMS / PUMS column names.`);

  await fs.writeFile(path.join(outDir, "ipums-pums-extract-preflight-smoke.md"), md.join("\n"));

  console.log(`\nWrote ${path.join(outDir, "ipums-pums-extract-preflight-smoke.json")}`);
  console.log(`Wrote ${path.join(outDir, "ipums-pums-extract-preflight-smoke.md")}`);

  if (!allPassed) process.exitCode = 1;
}

main().catch(err => { console.error(err); process.exit(1); });
