/**
 * Phase 2.7.5 v1 — signature imputation bridge smoke.
 *
 * For each of 2008/2012/2016/2020/2024:
 *   1. Loads a sample of CCES/CES respondents and maps each to a
 *      `SurveyPrismSignature` (via the existing mapper).
 *   2. Wraps each into a `BridgeDonorSignature` with bucketed demographics.
 *   3. Adapts the year's `mockVepUniverse` cells into `BridgeUniverseRow[]`.
 *   4. Runs `runSignatureImputationBridge` with a fixed seed and `numDraws=5`.
 *   5. Validates every output row with `validateSyntheticElectorateRow`.
 *   6. Runs the **vote-choice scrubbing spy**: re-runs the bridge with
 *      donor `voteChoiceObserved` scrubbed to "Unknown"; output must be
 *      byte-identical (same seed) — proves vote-choice is not in the
 *      bridge's matching, sampling, or output path.
 *   7. Verifies forbidden keys are absent across all rows.
 *
 * Strict scope:
 *   - Mock universe only (real PUMS not yet acquired).
 *   - No vote prediction, no abstention calibration, no candidate
 *     distance, no scorer.
 *
 * Usage:
 *   npx tsx src/electorate/signatureImputationBridgeSmoke.ts
 */

import * as fs from "node:fs";
import * as path from "node:path";

import { loadSurveyRespondents } from "./cesBacktestLoader.js";
import { mapSurveyToPrism, type SurveyPrismSignature } from "./surveyToPrismMapper.js";
import {
  validateSyntheticElectorateRow,
  type SyntheticElectorateRow,
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
import {
  runSignatureImputationBridge,
  type BridgeDemographicBuckets,
  type BridgeDonorSignature,
  type BridgeUniverseRow,
  type BridgeStats,
} from "./signatureImputationBridge.js";

// ─── Config ────────────────────────────────────────────────────────────────

const SAMPLE_ROW_LIMIT = 5000;
const NUM_DRAWS = 5;
const RANDOM_SEED = 20260503;

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

// ─── Demographic bucketing helpers ─────────────────────────────────────────

const FIPS_TO_POSTAL: Record<string, string> = {
  "1": "AL", "2": "AK", "4": "AZ", "5": "AR", "6": "CA", "8": "CO", "9": "CT", "10": "DE",
  "11": "DC", "12": "FL", "13": "GA", "15": "HI", "16": "ID", "17": "IL", "18": "IN", "19": "IA",
  "20": "KS", "21": "KY", "22": "LA", "23": "ME", "24": "MD", "25": "MA", "26": "MI", "27": "MN",
  "28": "MS", "29": "MO", "30": "MT", "31": "NE", "32": "NV", "33": "NH", "34": "NJ", "35": "NM",
  "36": "NY", "37": "NC", "38": "ND", "39": "OH", "40": "OK", "41": "OR", "42": "PA", "44": "RI",
  "45": "SC", "46": "SD", "47": "TN", "48": "TX", "49": "UT", "50": "VT", "51": "VA", "53": "WA",
  "54": "WV", "55": "WI", "56": "WY",
};

function fipsToPostal(raw: string | undefined | number): string | null {
  if (raw === undefined || raw === null) return null;
  const s = String(raw).replace(/^0+/, "").trim();
  if (s === "") return null;
  return FIPS_TO_POSTAL[s] ?? null;
}

function bucketAge(year: number, birthyr: number | undefined): string | null {
  if (typeof birthyr !== "number" || !Number.isFinite(birthyr) || birthyr < 1900 || birthyr > year) return null;
  const age = year - birthyr;
  if (age < 18) return null;
  if (age < 30) return "18-29";
  if (age < 45) return "30-44";
  if (age < 65) return "45-64";
  return "65+";
}

function bucketRace(raw: string | number | undefined): string | null {
  if (raw === undefined || raw === null) return null;
  const code = parseInt(String(raw).trim(), 10);
  if (!Number.isFinite(code)) return null;
  switch (code) {
    case 1: return "white";
    case 2: return "black";
    case 3: return "hispanic";
    case 4: return "asian";
    case 5: return "other"; // native american
    case 6: return "other"; // mixed
    case 7: return "other";
    case 8: return "other";
    default: return null;
  }
}

function bucketSex(raw: string | number | undefined): string | null {
  if (raw === undefined || raw === null) return null;
  const code = parseInt(String(raw).trim(), 10);
  if (!Number.isFinite(code)) return null;
  if (code === 1) return "male";
  if (code === 2) return "female";
  // 2024's gender4: 3 = non-binary, 4 = other → bucket to "other" (not in mock universe; will fall through backoff)
  return "other";
}

function bucketEducation(raw: string | number | undefined): string | null {
  if (raw === undefined || raw === null) return null;
  const code = parseInt(String(raw).trim(), 10);
  if (!Number.isFinite(code)) return null;
  if (code <= 2) return "hs_or_less";
  if (code <= 4) return "some_college";
  if (code <= 6) return "ba_plus";
  return null;
}

function bucketIncome(raw: string | number | undefined): string | null {
  if (raw === undefined || raw === null) return null;
  const code = parseInt(String(raw).trim(), 10);
  if (!Number.isFinite(code) || code <= 0) return null;
  // Skip code values that conventionally mean "skipped" / "prefer not to say".
  if (code >= 90) return null;
  if (code <= 4) return "low";
  if (code <= 8) return "middle";
  return "high";
}

/** Build a BridgeDonorSignature from a mapped signature + raw payload demographics. */
function donorFromSignature(
  signature: SurveyPrismSignature,
  rawPayload: Record<string, string>,
  birthyr: number | undefined,
  stateFips: string | undefined,
  genderRaw: string | undefined,
  raceRaw: string | undefined,
  educRaw: string | undefined,
  incomeRaw: string | undefined,
): BridgeDonorSignature | null {
  const state = fipsToPostal(stateFips);
  const ageBucket = bucketAge(signature.year, birthyr);
  const raceEthnicity = bucketRace(raceRaw);
  const sex = bucketSex(genderRaw);
  const education = bucketEducation(educRaw);
  const incomeBucket = bucketIncome(incomeRaw);
  if (!state || !ageBucket || !raceEthnicity || !sex || !education) return null;
  const demographics: BridgeDemographicBuckets = {
    state, ageBucket, raceEthnicity, sex, education, incomeBucket,
  };
  return { signature, demographics, weight: signature.weight };
}

/** Adapt MockVepCell to BridgeUniverseRow. */
function universeRowFromMockCell(cell: MockVepCell): BridgeUniverseRow {
  return {
    universeRowId: cell.cellId,
    year: cell.year,
    demographics: {
      state: cell.state,
      ageBucket: cell.ageBucket,
      raceEthnicity: cell.raceEthnicity,
      sex: cell.sex,
      education: cell.education,
      incomeBucket: cell.incomeBucket,
    },
    personWeight: cell.cellWeight,
  };
}

/** Returns a copy of donors with each signature's voteChoiceObserved scrubbed. */
function scrubVoteChoice(donors: BridgeDonorSignature[]): BridgeDonorSignature[] {
  return donors.map(d => ({
    signature: { ...d.signature, voteChoiceObserved: "Unknown" as const },
    demographics: d.demographics,
    weight: d.weight,
  }));
}

const FORBIDDEN_KEYS_ON_ROW = [
  "predictedVote",
  "candidateDistance",
  "voteProbability",
  "abstainProbability",
  "alpha_year",
  "predictedAbstainCount",
  "stageBResult",
];

function collectKeys(value: unknown, found: Set<string>, depth = 0): void {
  if (depth > 6 || value === null || typeof value !== "object") return;
  for (const k of Object.keys(value as Record<string, unknown>)) {
    found.add(k);
    collectKeys((value as Record<string, unknown>)[k], found, depth + 1);
  }
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
  duration_ms?: number;
  donor_count?: number;
  donors_with_full_demographics?: number;
  universe_rows?: number;
  output_rows?: number;
  per_row_validation_errors?: Array<{ cellId: string; drawId: number; errors: string[] }>;
  stats?: BridgeStats;
  scrubbing_spy_byte_identical?: boolean;
  invariant_checks?: InvariantCheck[];
  overall_pass?: boolean;
  example_provenance_note?: string | null;
}

function runYearInvariants(
  year: MockYear,
  rows: SyntheticElectorateRow[],
  perRowErrors: Array<{ cellId: string; drawId: number; errors: string[] }>,
  stats: BridgeStats,
  scrubMatches: boolean,
  universeRowCount: number,
  donorCount: number,
): InvariantCheck[] {
  const out: InvariantCheck[] = [];
  // 1. Output count invariant: outputRows = inputUniverseRows × numDraws (when no unmatched).
  out.push(check(1,
    `${year}: outputRows = inputUniverseRows × numDraws (no unmatched)`,
    stats.outputRows === universeRowCount * NUM_DRAWS && stats.unmatchableUniverseRows === 0,
    `outputRows=${stats.outputRows} expected=${universeRowCount * NUM_DRAWS} unmatchable=${stats.unmatchableUniverseRows}`));
  // 2. Schema validity: every row passes contract validation.
  out.push(check(2,
    `${year}: every row validates per validateSyntheticElectorateRow`,
    perRowErrors.length === 0,
    perRowErrors.length === 0 ? "0 row errors" : `${perRowErrors.length} row(s) failed; first: ${JSON.stringify(perRowErrors[0])}`));
  // 3. Contract enum: signatureSource = "imputed_from_cell" everywhere.
  const allImputed = rows.every(r => r.signatureSource === "imputed_from_cell");
  out.push(check(3,
    `${year}: every row has signatureSource = "imputed_from_cell"`,
    allImputed,
    allImputed ? "all rows tagged imputed_from_cell" : "found row with mismatched signatureSource"));
  // 4. populationSource = "survey_weighted" (mock universe contract value).
  const allMock = rows.every(r => r.populationSource === "survey_weighted");
  out.push(check(4,
    `${year}: populationSource = "survey_weighted" everywhere (mock universe)`,
    allMock,
    `populationSource samples: [${[...new Set(rows.map(r => r.populationSource))].join(", ")}]`));
  // 5. Vote-choice scrubbing spy: re-running with vote-choice scrubbed produces byte-identical output.
  out.push(check(5,
    `${year}: vote-choice scrubbing spy — bridge output byte-identical when donor voteChoiceObserved scrubbed`,
    scrubMatches,
    scrubMatches ? "byte-identical (vote choice not in matching/sampling/output path)" : "DIVERGENT — vote choice may be leaking into bridge logic"));
  // 6. Forbidden keys absent on every row.
  const allKeysFound = new Set<string>();
  for (const r of rows) collectKeys(r, allKeysFound);
  const foundForbidden = FORBIDDEN_KEYS_ON_ROW.filter(k => allKeysFound.has(k));
  out.push(check(6,
    `${year}: no forbidden vote-prediction / abstention-calibration keys present`,
    foundForbidden.length === 0,
    foundForbidden.length === 0
      ? `forbidden keys checked = [${FORBIDDEN_KEYS_ON_ROW.join(", ")}]; none present`
      : `FORBIDDEN keys present: [${foundForbidden.join(", ")}]`));
  // 7. Donor traceability — every row's coverage notes carry a selectedDonorId
  //    pointing at a respondent that exists in the donor pool. We accept any
  //    R{respId} substring; the explicit cross-check happens in the smoke
  //    body before we get here.
  const allHaveDonorId = rows.every(r => {
    const note = (r.signature.coverage.notes[0] ?? "");
    return /selectedDonorId=R\S+/.test(note);
  });
  out.push(check(7,
    `${year}: every row carries selectedDonorId provenance`,
    allHaveDonorId,
    allHaveDonorId ? "all rows reference a donor respondentId" : "row missing selectedDonorId"));
  // 8. perStepShare sums to 1 (or row count is zero); uncertainty distribution sums to outputRows.
  const stepSum = (Object.values(stats.perStepShare) as number[]).reduce((a, b) => a + b, 0);
  const uShareSum = stats.uncertaintyDistribution.low + stats.uncertaintyDistribution.medium + stats.uncertaintyDistribution.high;
  out.push(check(8,
    `${year}: perStepShare sums to 1 and uncertainty distribution accounts for all rows`,
    Math.abs(stepSum - 1) < 1e-9 && uShareSum === stats.outputRows,
    `perStepShare sum=${stepSum.toFixed(6)} uncertainty sum=${uShareSum} outputRows=${stats.outputRows}`));
  // 9. Donor pool informational: enough donors loaded for the pool to function.
  out.push(check(9,
    `${year}: donor pool has bucketed donors (≥ 100)`,
    donorCount >= 100,
    `donorCount=${donorCount}`));
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
      console.log(`  ✗ file not present — skipping`);
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

    // Map raw column names per year's resolver. The cesBacktestLoader's
    // demographics field passes raw codes; we re-pull them from rawVarPayload
    // for full clarity over which column names we're consuming.
    const demoCols: { state: string; birthyr: string; gender: string; race: string; educ: string } =
      target.year === 2008
        ? { state: "V206", birthyr: "V207", gender: "V208", race: "V211", educ: "V213" }
        : target.year === 2024
          ? { state: "inputstate", birthyr: "birthyr", gender: "gender4", race: "race", educ: "educ" }
          : { state: "inputstate", birthyr: "birthyr", gender: "gender", race: "race", educ: "educ" };
    const incomeCol = target.year === 2008 ? "V246" : "faminc";

    const donors: BridgeDonorSignature[] = [];
    for (const r of respondents) {
      const sig = mapSurveyToPrism(r);
      const payload = r.rawVarPayload;
      const birthyr = payload[demoCols.birthyr] ? Number(payload[demoCols.birthyr]) : undefined;
      const donor = donorFromSignature(
        sig, payload, birthyr,
        payload[demoCols.state], payload[demoCols.gender], payload[demoCols.race],
        payload[demoCols.educ], payload[incomeCol],
      );
      if (donor) donors.push(donor);
    }
    console.log(`  loaded=${respondents.length} donors_with_full_demographics=${donors.length}`);

    const universe = getMockVepCells(target.year).map(universeRowFromMockCell);

    const { rows, stats } = runSignatureImputationBridge(donors, universe, {
      year: target.year,
      numDraws: NUM_DRAWS,
      randomSeed: RANDOM_SEED,
    });

    // Per-row contract validation
    const perRowErrors: Array<{ cellId: string; drawId: number; errors: string[] }> = [];
    for (const r of rows) {
      const errs = validateSyntheticElectorateRow(r);
      if (errs.length > 0) perRowErrors.push({ cellId: r.cellId, drawId: r.drawId, errors: errs });
    }

    // Donor-traceability cross-check (verifies smoke invariant 7's substantive
    // claim: the substring referenced in provenance is a real donor).
    const knownDonorIds = new Set(donors.map(d => d.signature.respondentId));
    let traceFailures = 0;
    for (const r of rows) {
      const note = r.signature.coverage.notes[0] ?? "";
      const m = /selectedDonorId=R(\S+?);/.exec(note);
      if (!m || !knownDonorIds.has(m[1]!)) { traceFailures++; }
    }
    if (traceFailures > 0) {
      console.error(`  ✗ ${traceFailures} row(s) reference a donor not in the donor pool`);
    }

    // Vote-choice scrubbing spy: re-run with scrubbed donors, compare byte-identical.
    const donorsScrubbed = scrubVoteChoice(donors);
    const { rows: rowsScrubbed } = runSignatureImputationBridge(donorsScrubbed, universe, {
      year: target.year,
      numDraws: NUM_DRAWS,
      randomSeed: RANDOM_SEED,
    });
    const scrubMatches = JSON.stringify(rows) === JSON.stringify(rowsScrubbed);

    const checks = runYearInvariants(
      target.year, rows, perRowErrors, stats, scrubMatches,
      universe.length, donors.length,
    );
    const passed = checks.filter(c => c.passed).length;
    totalChecks += checks.length;
    totalPassed += passed;

    const durationMs = Date.now() - t0;
    console.log(`  cells=${universe.length} rows=${rows.length} duration=${(durationMs / 1000).toFixed(1)}s checks=${passed}/${checks.length}`);
    console.log(`  perStep counts: ${JSON.stringify(stats.perStepRowCount)}`);
    console.log(`  uncertainty: ${JSON.stringify(stats.uncertaintyDistribution)}`);
    console.log(`  meanDonorPool=${stats.meanDonorPoolSize.toFixed(1)} meanESS=${stats.meanEffectiveSampleSize.toFixed(1)}`);
    console.log(`  scrubbing spy byte-identical: ${scrubMatches}`);
    for (const c of checks) {
      const mark = c.passed ? "✓" : "✗";
      console.log(`    ${mark} ${c.id}. ${c.label} — ${c.detail}`);
    }

    results.push({
      year: target.year,
      source_file: target.filePath,
      file_present: true,
      duration_ms: durationMs,
      donor_count: respondents.length,
      donors_with_full_demographics: donors.length,
      universe_rows: universe.length,
      output_rows: rows.length,
      per_row_validation_errors: perRowErrors,
      stats,
      scrubbing_spy_byte_identical: scrubMatches,
      invariant_checks: checks,
      overall_pass: checks.every(c => c.passed) && traceFailures === 0,
      example_provenance_note: rows[0]?.signature.coverage.notes[0] ?? null,
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
    phase: "2.7.5 v1 — signature imputation bridge (weighted hot-deck)",
    bridge_options: {
      numDraws: NUM_DRAWS,
      randomSeed: RANDOM_SEED,
      sampleRowLimitPerYear: SAMPLE_ROW_LIMIT,
    },
    mock_universe_version: MOCK_VEP_UNIVERSE_VERSION,
    mock_disclaimer: MOCK_DISCLAIMER,
    description: "Weighted hot-deck imputation per signature-imputation-bridge-plan.md. Uses mock universe; voteChoice spy verifies bridge ignores vote-choice; forbidden-keys structural check verifies no scorer fields leak into output. NOT a vote prediction.",
    aggregate_checks: aggregateChecks,
    forbidden_keys_checked: FORBIDDEN_KEYS_ON_ROW,
    years: results.map(r => ({
      // Trim row payload to one example per year (per-row contents validated above).
      year: r.year,
      source_file: r.source_file,
      file_present: r.file_present,
      skipped_reason: r.skipped_reason,
      duration_ms: r.duration_ms,
      donor_count: r.donor_count,
      donors_with_full_demographics: r.donors_with_full_demographics,
      universe_rows: r.universe_rows,
      output_rows: r.output_rows,
      stats: r.stats,
      scrubbing_spy_byte_identical: r.scrubbing_spy_byte_identical,
      example_provenance_note: r.example_provenance_note,
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
      total_rows_built: results.reduce((acc, r) => acc + (r.output_rows ?? 0), 0),
    },
  };
  const jsonPath = path.join(outDir, "signature-imputation-bridge-smoke.json");
  fs.writeFileSync(jsonPath, JSON.stringify(jsonOut, null, 2));

  // ── Markdown summary
  let md = `# Signature Imputation Bridge v1 — Smoke (Phase 2.7.5)\n\n`;
  md += `**Run at:** ${new Date().toISOString()}\n`;
  md += `**Mock universe version:** \`${MOCK_VEP_UNIVERSE_VERSION}\`\n`;
  md += `**Bridge options:** numDraws=${NUM_DRAWS}, randomSeed=${RANDOM_SEED}, sampleRowLimitPerYear=${SAMPLE_ROW_LIMIT}\n\n`;
  md += `> **${MOCK_DISCLAIMER}**\n\n`;
  md += `## What this verifies\n\n`;
  md += `Promotes the v0 mock-bridge into v1 weighted hot-deck imputation per \`signature-imputation-bridge-plan.md\`. The smoke loads CCES/CES respondents per year, maps each to a PRISM signature, wraps with bucketed demographics, then runs \`runSignatureImputationBridge\` against the year's mock universe with a fixed seed. Verifies contract validation, the 8-step backoff machinery, donor-traceability provenance, the **vote-choice scrubbing spy**, and the forbidden-keys structural check.\n\n`;
  md += `**Not in scope**: real PUMS universe, vote prediction, abstention calibration, candidate distance, scorer.\n\n`;
  md += `## Cross-year roll-up\n\n`;
  md += `| Year | Donors loaded | Donors w/ full demo | Universe cells | Output rows | Mean donor pool | Mean ESS | Spy byte-identical |\n`;
  md += `|---|---:|---:|---:|---:|---:|---:|:--:|\n`;
  for (const r of results) {
    if (!r.file_present || !r.stats) {
      md += `| ${r.year} | n/a | n/a | n/a | n/a | n/a | n/a | n/a |\n`;
      continue;
    }
    md += `| ${r.year} | ${r.donor_count} | ${r.donors_with_full_demographics} | ${r.universe_rows} | ${r.output_rows} | ${r.stats.meanDonorPoolSize.toFixed(1)} | ${r.stats.meanEffectiveSampleSize.toFixed(1)} | ${r.scrubbing_spy_byte_identical ? "✓" : "✗"} |\n`;
  }
  md += `\n`;
  md += `## Backoff distribution per year (rows landed at step k)\n\n`;
  md += `| Year | s1 | s2 | s3 | s4 | s5 | s6 | s7 | s8 |\n`;
  md += `|---|---:|---:|---:|---:|---:|---:|---:|---:|\n`;
  for (const r of results) {
    if (!r.file_present || !r.stats) { md += `| ${r.year} | – | – | – | – | – | – | – | – |\n`; continue; }
    const s = r.stats.perStepRowCount;
    md += `| ${r.year} | ${s[1]} | ${s[2]} | ${s[3]} | ${s[4]} | ${s[5]} | ${s[6]} | ${s[7]} | ${s[8]} |\n`;
  }
  md += `\n`;
  md += `## Uncertainty distribution per year (rows)\n\n`;
  md += `| Year | low | medium | high |\n`;
  md += `|---|---:|---:|---:|\n`;
  for (const r of results) {
    if (!r.file_present || !r.stats) { md += `| ${r.year} | – | – | – |\n`; continue; }
    const u = r.stats.uncertaintyDistribution;
    md += `| ${r.year} | ${u.low} | ${u.medium} | ${u.high} |\n`;
  }
  md += `\n`;
  md += `## Per-year invariants\n\n`;
  for (const r of results) {
    md += `### ${r.year}\n\n`;
    if (!r.file_present) {
      md += `- **Skipped** — ${r.skipped_reason ?? "file not present"}\n\n`;
      continue;
    }
    md += `- Mock universe rows: ${r.universe_rows}; output rows: ${r.output_rows}\n`;
    md += `- Mean donor pool size: ${r.stats!.meanDonorPoolSize.toFixed(1)}; mean ESS: ${r.stats!.meanEffectiveSampleSize.toFixed(1)}\n`;
    md += `- Vote-choice scrubbing spy byte-identical: **${r.scrubbing_spy_byte_identical ? "yes" : "no"}**\n`;
    md += `- Per-row validation errors: ${r.per_row_validation_errors!.length}\n`;
    md += `- Example provenance note (row 0): \`${r.example_provenance_note ?? "(none)"}\`\n\n`;
    md += `| # | Check | Pass | Detail |\n|---|---|:--:|---|\n`;
    for (const c of r.invariant_checks!) {
      md += `| ${c.id} | ${c.label} | ${c.passed ? "✓" : "✗"} | ${c.detail} |\n`;
    }
    md += `\n**Year ${r.year} overall: ${r.overall_pass ? "✓ ALL PASS" : "✗ FAIL"}**\n\n`;
  }
  md += `## Aggregate invariants\n\n`;
  for (const c of aggregateChecks) {
    md += `- ${c.passed ? "✓" : "✗"} ${c.id}. ${c.label} — ${c.detail}\n`;
  }
  md += `\n## Forbidden keys (verified absent on every row)\n\n`;
  for (const k of FORBIDDEN_KEYS_ON_ROW) md += `- \`${k}\`\n`;
  md += `\n## Aggregate\n\n`;
  md += `- Total invariant checks (incl. aggregate): **${totalPassed}/${totalChecks}**\n`;
  md += `- Years with file present: ${jsonOut.aggregate.years_with_file_present}\n`;
  md += `- Years skipped: ${jsonOut.aggregate.years_skipped.join(", ") || "(none)"}\n`;
  md += `- Total contract-valid rows built: **${jsonOut.aggregate.total_rows_built}**\n`;

  fs.writeFileSync(path.join(outDir, "signature-imputation-bridge-smoke.md"), md);

  try { JSON.parse(fs.readFileSync(jsonPath, "utf8")); console.log("\nJSON valid"); }
  catch (e) { console.error("JSON did not parse:", e); process.exit(3); }

  console.log(`\nWrote ${jsonPath}`);
  console.log(`Wrote ${path.join(outDir, "signature-imputation-bridge-smoke.md")}`);
  console.log(`\nAggregate: ${totalPassed}/${totalChecks} invariant checks passed across ${jsonOut.aggregate.years_with_file_present} year(s); ${jsonOut.aggregate.total_rows_built} contract-valid rows built.`);
  if (totalPassed !== totalChecks) {
    console.error(`\nSMOKE FAILED: at least one invariant check did not pass`);
    process.exit(1);
  }
}

main().catch(err => { console.error(err); process.exit(1); });
