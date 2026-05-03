/**
 * Phase 2.7c — Mocked synthetic-electorate bridge harness.
 *
 * Goal: prove the pipeline can produce rows that conform to
 * `syntheticElectorateContract.ts` without waiting for the real PUMS
 * acquisition. The bridge:
 *
 *   1. Loads a small sample of CCES/CES rows per year (rowLimit ~500).
 *   2. Maps each to a PRISM signature via `surveyToPrismMapper`.
 *   3. For each mock VEP cell from `mockVepUniverse`, picks an eligible
 *      donor signature from the same year (deterministic round-robin).
 *   4. Builds a `SyntheticElectorateRow` with `signatureSource =
 *      "imputed_from_cell"` and validates with
 *      `validateSyntheticElectorateRow`.
 *
 * Strict scope:
 *   - This is NOT the real VEP universe. The cells are hand-authored
 *     fixtures (see `mockVepUniverse.ts`).
 *   - There is NO vote prediction, NO abstention calibration, NO
 *     candidate distance computation, and NO claim that the cells
 *     aggregate to anything resembling true VEP totals.
 *   - The bridge proves the *shape* — that a mapper output can be
 *     joined onto a population skeleton and produce contract-valid
 *     rows. When the real PUMS loader arrives, this bridge is
 *     replaced; the mapper and the contract stay put.
 *
 * Usage:
 *   npx tsx src/electorate/syntheticElectorateBridgeSmoke.ts
 *
 * Outputs:
 *   results/electorate/synthetic-electorate/mock-synthetic-electorate-smoke.json
 *   results/electorate/synthetic-electorate/mock-synthetic-electorate-smoke.md
 */

import * as fs from "node:fs";
import * as path from "node:path";

import { loadSurveyRespondents } from "./cesBacktestLoader.js";
import { mapSurveyToPrism, type SurveyPrismSignature } from "./surveyToPrismMapper.js";
import {
  CATEGORICAL_NODE_IDS,
  MORAL_BOUNDARY_IDS,
  POSITION_NODE_IDS,
  SYNTHETIC_ELECTORATE_SCHEMA_VERSION,
  validateSyntheticElectorateRow,
  type SyntheticElectorateRow,
  type SyntheticElectorateSignature,
} from "./syntheticElectorateContract.js";
import {
  MOCK_DISCLAIMER,
  MOCK_VEP_UNIVERSE_VERSION,
  MOCK_YEARS,
  getMockVepCells,
  totalMockWeightForYear,
  type MockVepCell,
  type MockYear,
} from "./mockVepUniverse.js";

interface YearTarget {
  year: MockYear;
  filePath: string;
}

const YEAR_TARGETS: YearTarget[] = [
  { year: 2008, filePath: "data/cces2008/cces_2008_common.tab" },
  { year: 2012, filePath: "data/cces2012/CCES12_Common_VV.tab" },
  { year: 2016, filePath: "data/cces2016/CCES16_Common_OUTPUT_Feb2018_VV.tab" },
  { year: 2020, filePath: "data/cces2020/CES20_Common_OUTPUT_vv.csv" },
  { year: 2024, filePath: "data/cces2024/CCES24_Common_OUTPUT_vv_topost_final.csv" },
];

const SAMPLE_ROW_LIMIT = 500;

/**
 * Convert a SurveyPrismSignature (mapper output) into the
 * SyntheticElectorateSignature shape the contract expects. Both shapes
 * share the underlying NodeProvenance / boundary / engagement types via
 * the mapper's exports, so this is a structural rewrap, not a remap.
 *
 * Coverage accounting under signatureSource = "imputed_from_cell":
 *   - From the cell's perspective, NO target was filled by a real signal
 *     in this row's own data — the entire signature is imputed via the
 *     donor.
 *   - We preserve the donor's real_signal vs fallback split by mapping
 *     donor real_signal → imputed_targets here (the imputation carried
 *     a real signal from the donor) and donor fallback → fallback_targets
 *     (the donor itself fell back; the imputation propagates that gap).
 *   - real_signal_targets is therefore 0 for any row built from this
 *     bridge — fixing this requires the cell to have *its own* real
 *     signal source, which is a future loader's responsibility.
 */
function toContractSignature(donor: SurveyPrismSignature, cell: MockVepCell): SyntheticElectorateSignature {
  const positionNodes = {
    MAT: donor.MAT,
    CD: donor.CD,
    CU: donor.CU,
    MOR: donor.MOR,
    PRO: donor.PRO,
    COM: donor.COM,
    ZS: donor.ZS,
    ONT_H: donor.ONT_H,
    ONT_S: donor.ONT_S,
  };
  const categoricalNodes = {
    EPS: donor.EPS,
    AES: donor.AES,
  };
  const totalTargets = donor.coverage.totalTargets;
  const imputedTargets = donor.coverage.realSignalCount;
  const fallbackTargets = donor.coverage.fallbackCount;
  return {
    positionNodes,
    categoricalNodes,
    engagement: donor.engagement,
    moralBoundaries: donor.moralBoundaries,
    coverage: {
      realSignalTargets: 0,
      imputedTargets,
      fallbackTargets,
      totalTargets,
      notes: [
        `mock-bridge: signature imputed from donor respondent ${donor.respondentId} (year ${donor.year})`,
        `donor real-signal target count = ${imputedTargets}; donor fallback count = ${fallbackTargets}`,
        `cell ${cell.cellId} is ${MOCK_DISCLAIMER}`,
      ],
    },
  };
}

function buildRowFromCellAndDonor(
  cell: MockVepCell,
  donor: SurveyPrismSignature,
  drawId: number,
): SyntheticElectorateRow {
  return {
    schemaVersion: SYNTHETIC_ELECTORATE_SCHEMA_VERSION,
    year: cell.year,
    drawId,
    rowKind: "weighted_cell",
    cellId: cell.cellId,
    cellWeight: cell.cellWeight,
    populationSource: "survey_weighted",
    signatureSource: "imputed_from_cell",
    demographics: {
      state: cell.state,
      age: null,
      ageBucket: cell.ageBucket,
      raceEthnicity: cell.raceEthnicity,
      sex: cell.sex,
      education: cell.education,
      incomeBucket: cell.incomeBucket,
      citizenVotingEligible: true,
    },
    signature: toContractSignature(donor, cell),
    uncertainty: {
      demographicCoverage: "high",
      signatureCoverage: "high",
      imputation: "high",
    },
  };
}

interface InvariantCheck {
  id: number;
  label: string;
  passed: boolean;
  detail: string;
}

function check(id: number, label: string, passed: boolean, detail: string): InvariantCheck {
  return { id, label, passed, detail };
}

interface YearRunResult {
  year: MockYear;
  source_file: string;
  file_present: boolean;
  skipped_reason?: string;
  cells_used?: number;
  rows_built?: number;
  rows_validated?: number;
  total_mock_weight?: number;
  rows?: SyntheticElectorateRow[];
  per_row_validation_errors?: Array<{ row_index: number; cell_id: string; errors: string[] }>;
  invariant_checks?: InvariantCheck[];
  overall_pass?: boolean;
}

const FORBIDDEN_KEYS_ON_ROW = [
  "predictedVote",
  "candidateDistance",
  "voteProbability",
  "abstainProbability",
  "alpha_year",
  "predictedAbstainCount",
  "stageBResult",
  "vepUniverseClaim",
];

function collectKeys(value: unknown, found: Set<string>, depth = 0): void {
  if (depth > 6 || value === null || typeof value !== "object") return;
  for (const k of Object.keys(value as Record<string, unknown>)) {
    found.add(k);
    collectKeys((value as Record<string, unknown>)[k], found, depth + 1);
  }
}

function runYearInvariants(
  year: MockYear,
  rows: SyntheticElectorateRow[],
  perRowErrors: Array<{ row_index: number; cell_id: string; errors: string[] }>,
  totalMockWeight: number,
): InvariantCheck[] {
  const out: InvariantCheck[] = [];

  // Row-count invariant
  out.push(check(1, `${year}: ≥ 5 rows produced`,
    rows.length >= 5,
    `rows=${rows.length}`));

  // Validation
  const allValid = perRowErrors.length === 0;
  out.push(check(2, `${year}: every row validates per validateSyntheticElectorateRow`,
    allValid,
    allValid ? "0 row errors" : `${perRowErrors.length} row(s) failed validation; first: ${JSON.stringify(perRowErrors[0])}`));

  // Required node signatures (count enforcement; full structural check is in (2)
  // but we double-report here so the invariant table reads cleanly.)
  let allNodesPresent = true;
  for (const r of rows) {
    for (const n of POSITION_NODE_IDS) {
      if (!r.signature.positionNodes[n]) { allNodesPresent = false; break; }
    }
    for (const n of CATEGORICAL_NODE_IDS) {
      if (!r.signature.categoricalNodes[n]) { allNodesPresent = false; break; }
    }
    for (const b of MORAL_BOUNDARY_IDS) {
      if (!r.signature.moralBoundaries[b]) { allNodesPresent = false; break; }
    }
    if (!r.signature.engagement) { allNodesPresent = false; break; }
    if (!allNodesPresent) break;
  }
  out.push(check(3, `${year}: every row carries all 9 position + 2 categorical + 7 moral-boundary + engagement nodes`,
    allNodesPresent,
    `position=${POSITION_NODE_IDS.length} categorical=${CATEGORICAL_NODE_IDS.length} boundaries=${MORAL_BOUNDARY_IDS.length}`));

  // Positive cellWeight
  let allPositive = true;
  for (const r of rows) {
    if (!Number.isFinite(r.cellWeight) || r.cellWeight <= 0) { allPositive = false; break; }
  }
  out.push(check(4, `${year}: every row has finite, positive cellWeight`,
    allPositive,
    allPositive ? `min=${Math.min(...rows.map(r => r.cellWeight))} max=${Math.max(...rows.map(r => r.cellWeight))}` : "found non-positive or non-finite cellWeight"));

  // Mock / contract-test marker present in coverage notes
  let allMarked = true;
  for (const r of rows) {
    const notes = r.signature.coverage.notes.join(" | ");
    if (!notes.toLowerCase().includes("mock")) { allMarked = false; break; }
  }
  out.push(check(5, `${year}: every row explicitly marked as mock / contract-test in coverage notes`,
    allMarked,
    allMarked ? "all rows carry mock-disclaimer note" : "found row without mock disclaimer"));

  // Total mock weight finite
  out.push(check(6, `${year}: total mock weight finite and positive`,
    Number.isFinite(totalMockWeight) && totalMockWeight > 0,
    `total=${totalMockWeight}`));

  // Forbidden-keys structural check: no vote-prediction / abstention /
  // candidate-distance / real-VEP-claim fields anywhere in any row.
  const allKeysFound = new Set<string>();
  for (const r of rows) collectKeys(r, allKeysFound);
  const foundForbidden = FORBIDDEN_KEYS_ON_ROW.filter(k => allKeysFound.has(k));
  out.push(check(7, `${year}: no vote-prediction / abstention-calibration / candidate-distance / real-VEP-claim keys present`,
    foundForbidden.length === 0,
    foundForbidden.length === 0
      ? `forbidden keys checked = [${FORBIDDEN_KEYS_ON_ROW.join(", ")}]; none present`
      : `FORBIDDEN keys present: [${foundForbidden.join(", ")}]`));

  // Population source must be the "not-PUMS" enum value
  const allMockSource = rows.every(r => r.populationSource === "survey_weighted");
  out.push(check(8, `${year}: populationSource is 'survey_weighted' (not acs_pums / ipums_pums)`,
    allMockSource,
    `populationSource samples: [${[...new Set(rows.map(r => r.populationSource))].join(", ")}]`));

  return out;
}

async function main(): Promise<void> {
  const cwd = process.cwd();
  const outDir = path.join(cwd, "results", "electorate", "synthetic-electorate");
  fs.mkdirSync(outDir, { recursive: true });

  const results: YearRunResult[] = [];
  let totalChecks = 0;
  let totalPassed = 0;

  for (const target of YEAR_TARGETS) {
    const filePath = path.join(cwd, target.filePath);
    console.log(`\n=== ${target.year} (${target.filePath}) ===`);
    if (!fs.existsSync(filePath)) {
      console.log(`  ✗ file not present — skipping (data acquisition pending)`);
      results.push({
        year: target.year,
        source_file: target.filePath,
        file_present: false,
        skipped_reason: "microdata file not present locally",
      });
      continue;
    }

    const t0 = Date.now();
    const { respondents } = await loadSurveyRespondents({
      filePath,
      year: target.year,
      rowLimit: SAMPLE_ROW_LIMIT,
      keepRawVarPayload: true,
    });
    const donors = respondents.map(mapSurveyToPrism);
    if (donors.length === 0) {
      console.error(`  ✗ no donors mapped for ${target.year}`);
      process.exit(2);
    }

    const cells = getMockVepCells(target.year);
    const rows: SyntheticElectorateRow[] = [];
    const perRowErrors: Array<{ row_index: number; cell_id: string; errors: string[] }> = [];

    cells.forEach((cell, cellIdx) => {
      // Deterministic round-robin donor pick within the same year.
      const donor = donors[cellIdx % donors.length]!;
      const row = buildRowFromCellAndDonor(cell, donor, cellIdx);
      const errors = validateSyntheticElectorateRow(row);
      if (errors.length > 0) {
        perRowErrors.push({ row_index: rows.length, cell_id: cell.cellId, errors });
      }
      rows.push(row);
    });

    const totalMockWeight = totalMockWeightForYear(target.year);
    const checks = runYearInvariants(target.year, rows, perRowErrors, totalMockWeight);
    const passed = checks.filter(c => c.passed).length;
    totalChecks += checks.length;
    totalPassed += passed;

    const durationMs = Date.now() - t0;
    console.log(`  donors=${donors.length} cells=${cells.length} rows=${rows.length} duration=${(durationMs / 1000).toFixed(1)}s checks=${passed}/${checks.length}`);
    console.log(`  total mock weight: ${totalMockWeight}`);
    console.log(`  per-row validation errors: ${perRowErrors.length}`);
    for (const c of checks) {
      const mark = c.passed ? "✓" : "✗";
      console.log(`    ${mark} ${c.id}. ${c.label} — ${c.detail}`);
    }

    results.push({
      year: target.year,
      source_file: target.filePath,
      file_present: true,
      cells_used: cells.length,
      rows_built: rows.length,
      rows_validated: rows.length - perRowErrors.length,
      total_mock_weight: totalMockWeight,
      rows,
      per_row_validation_errors: perRowErrors,
      invariant_checks: checks,
      overall_pass: checks.every(c => c.passed),
    });
  }

  // Aggregate-level invariant: all 5 mock years represented
  const allFivePresent = MOCK_YEARS.every(y => results.find(r => r.year === y && r.file_present));
  const aggregateChecks: InvariantCheck[] = [
    check(0, "All 5 mock years represented (file loaded for each)",
      allFivePresent,
      `years_present=[${results.filter(r => r.file_present).map(r => r.year).join(",")}], years_skipped=[${results.filter(r => !r.file_present).map(r => r.year).join(",")}]`),
  ];
  totalChecks += aggregateChecks.length;
  totalPassed += aggregateChecks.filter(c => c.passed).length;
  for (const c of aggregateChecks) {
    const mark = c.passed ? "✓" : "✗";
    console.log(`\n${mark} aggregate ${c.id}. ${c.label} — ${c.detail}`);
  }

  // ── JSON output
  const jsonOut = {
    schema_version: "v0.1",
    run_at: new Date().toISOString(),
    phase: "2.7c — mocked synthetic-electorate bridge harness",
    mock_universe_version: MOCK_VEP_UNIVERSE_VERSION,
    mock_disclaimer: MOCK_DISCLAIMER,
    description: "Bridge harness proving the survey-mapper-backed pipeline can produce rows conforming to syntheticElectorateContract. NOT a real VEP universe; NOT a vote prediction; NOT abstention calibration. Cells are hand-authored fixtures (mockVepUniverse.ts).",
    contract_schema_version: SYNTHETIC_ELECTORATE_SCHEMA_VERSION,
    sample_row_limit: SAMPLE_ROW_LIMIT,
    aggregate_checks: aggregateChecks,
    years: results.map(r => ({
      // Strip the full row payload from the JSON output; per-row contents are
      // verified via validateSyntheticElectorateRow already, and embedding 35
      // full signature blobs would bloat this file. We keep one example per
      // year for inspection.
      year: r.year,
      source_file: r.source_file,
      file_present: r.file_present,
      skipped_reason: r.skipped_reason,
      cells_used: r.cells_used,
      rows_built: r.rows_built,
      rows_validated: r.rows_validated,
      total_mock_weight: r.total_mock_weight,
      example_row: r.rows?.[0] ?? null,
      per_row_validation_errors: r.per_row_validation_errors,
      invariant_checks: r.invariant_checks,
      overall_pass: r.overall_pass,
    })),
    aggregate: {
      total_checks: totalChecks,
      total_passed: totalPassed,
      all_passed: totalPassed === totalChecks && totalChecks > 0,
      years_with_file_present: results.filter(r => r.file_present).length,
      years_skipped: results.filter(r => !r.file_present).map(r => r.year),
      total_rows_built: results.reduce((acc, r) => acc + (r.rows_built ?? 0), 0),
    },
    forbidden_keys_checked: FORBIDDEN_KEYS_ON_ROW,
  };
  const jsonPath = path.join(outDir, "mock-synthetic-electorate-smoke.json");
  fs.writeFileSync(jsonPath, JSON.stringify(jsonOut, null, 2));

  // ── Markdown summary
  let md = `# Mocked Synthetic-Electorate Bridge Smoke (Phase 2.7c)\n\n`;
  md += `**Run at:** ${new Date().toISOString()}\n`;
  md += `**Mock universe version:** \`${MOCK_VEP_UNIVERSE_VERSION}\`\n`;
  md += `**Contract schema:** \`${SYNTHETIC_ELECTORATE_SCHEMA_VERSION}\`\n`;
  md += `**Sample row limit per year:** ${SAMPLE_ROW_LIMIT}\n\n`;
  md += `> **${MOCK_DISCLAIMER}**\n\n`;
  md += `## What this is, and is not\n\n`;
  md += `**Is**: a bridge harness proving the survey-mapper pipeline can produce rows conforming to \`syntheticElectorateContract.ts\`. Loads a small CCES/CES sample per year, maps each row to a PRISM signature via \`surveyToPrismMapper\`, then for each hand-authored mock VEP cell picks a same-year donor signature (deterministic round-robin) and emits a contract-valid \`SyntheticElectorateRow\` with \`signatureSource = "imputed_from_cell"\`.\n\n`;
  md += `**Is not**: the real VEP universe; a vote prediction; abstention calibration; a candidate-distance computation; or a claim that the mock cells aggregate to anything resembling true population totals. The real PUMS-driven loader is tracked separately in \`vep-universe-loader-plan.md\`.\n\n`;
  md += `## Cross-year roll-up\n\n`;
  md += `| Year | Source file present | Donors mapped (≤${SAMPLE_ROW_LIMIT}) | Mock cells | Rows built | Rows validated | Total mock weight |\n`;
  md += `|---|:--:|---:|---:|---:|---:|---:|\n`;
  for (const r of results) {
    if (!r.file_present) {
      md += `| ${r.year} | no | n/a | n/a | n/a | n/a | n/a |\n`;
      continue;
    }
    md += `| ${r.year} | yes | ≤${SAMPLE_ROW_LIMIT} | ${r.cells_used} | ${r.rows_built} | ${r.rows_validated} | ${r.total_mock_weight} |\n`;
  }
  md += `\n`;
  md += `## Per-year invariants\n\n`;
  for (const r of results) {
    md += `### ${r.year}\n\n`;
    if (!r.file_present) {
      md += `- **Skipped** — ${r.skipped_reason ?? "file not present"}\n\n`;
      continue;
    }
    md += `- Cells: ${r.cells_used}; rows built: ${r.rows_built}; rows validated: ${r.rows_validated}\n`;
    md += `- Total mock weight: ${r.total_mock_weight}\n`;
    md += `- Per-row validation errors: ${r.per_row_validation_errors!.length}\n\n`;
    md += `| # | Check | Pass | Detail |\n|---|---|:--:|---|\n`;
    for (const c of r.invariant_checks!) {
      md += `| ${c.id} | ${c.label} | ${c.passed ? "✓" : "✗"} | ${c.detail} |\n`;
    }
    md += `\n**Year ${r.year} overall: ${r.overall_pass ? "✓ ALL PASS" : "✗ FAIL"}** (${r.invariant_checks!.filter(c => c.passed).length}/${r.invariant_checks!.length})\n\n`;
  }
  md += `## Aggregate invariants\n\n`;
  for (const c of aggregateChecks) {
    md += `- ${c.passed ? "✓" : "✗"} ${c.id}. ${c.label} — ${c.detail}\n`;
  }
  md += `\n`;
  md += `## Forbidden keys (verified absent on every row)\n\n`;
  for (const k of FORBIDDEN_KEYS_ON_ROW) md += `- \`${k}\`\n`;
  md += `\n`;
  md += `## What the future PUMS loader replaces\n\n`;
  md += `When the real PUMS loader ships (per \`vep-universe-loader-plan.md\` v1+):\n\n`;
  md += `- The hand-authored cells in \`mockVepUniverse.ts\` are replaced by streamed PUMS rows with real \`personWeight\` × replicate weights.\n`;
  md += `- The deterministic round-robin donor picker is replaced by demographic-cell donor matching (likely a poststratification step or a small-cell IPF/raking helper).\n`;
  md += `- \`populationSource\` shifts from \`"survey_weighted"\` to \`"acs_pums"\` or \`"ipums_pums"\`.\n`;
  md += `- The mapper, the contract, and the validation surface stay unchanged. The bridge that gets renamed at that point is **only** the population-skeleton lane.\n\n`;
  md += `## Aggregate\n\n`;
  md += `- Total invariant checks (incl. aggregate): **${totalPassed}/${totalChecks}**\n`;
  md += `- Years with file present: ${jsonOut.aggregate.years_with_file_present}\n`;
  md += `- Years skipped (file not present): ${jsonOut.aggregate.years_skipped.join(", ") || "(none)"}\n`;
  md += `- Total contract-valid rows built across all years: **${jsonOut.aggregate.total_rows_built}**\n`;

  fs.writeFileSync(path.join(outDir, "mock-synthetic-electorate-smoke.md"), md);

  // Verify JSON parses
  try {
    JSON.parse(fs.readFileSync(jsonPath, "utf8"));
    console.log("\nJSON valid");
  } catch (e) {
    console.error("JSON did not parse:", e);
    process.exit(3);
  }

  console.log(`\nWrote ${jsonPath}`);
  console.log(`Wrote ${path.join(outDir, "mock-synthetic-electorate-smoke.md")}`);
  console.log(`\nAggregate: ${totalPassed}/${totalChecks} invariant checks passed across ${jsonOut.aggregate.years_with_file_present} year(s); ${jsonOut.aggregate.total_rows_built} contract-valid rows built.`);
  if (totalPassed !== totalChecks) {
    console.error(`\nSMOKE FAILED: at least one invariant check did not pass`);
    process.exit(1);
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
