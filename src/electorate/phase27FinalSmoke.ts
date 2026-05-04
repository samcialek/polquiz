/**
 * Phase 2.7 final pipeline smoke.
 *
 * Single end-to-end harness that exercises every stage of the synthetic-
 * electorate pipeline against a real PUMS-style universe (loaded via
 * the IPUMS PUMS file loader) for the 2016 cycle:
 *
 *   1. PUMS fixture/file loader → `VepUniverseRow[]`
 *   2. CCES backtest loader → `WeightedSurveyRespondent[]`
 *      mapper (`mapSurveyToPrism`) → `SurveyPrismSignature[]`
 *   3. Donor adapter → `BridgeDonorSignature[]`
 *   4. Bridge (`runSignatureImputationBridge`) → `SyntheticElectorateRow[]`
 *   5. Aggregate (`runSyntheticElectorateAggregate`) → coverage report
 *
 * Output:
 *   results/electorate/synthetic-electorate/phase-27-final-smoke.{json,md}
 *
 * Strict scope:
 *   - Read-only against real CCES microdata. PUMS data is a hand-authored
 *     fixture (15 rows, written to a temp file, loaded back via the
 *     real loader) — no actual ACS/PUMS data file is referenced.
 *   - Exercises every layer the pipeline touches in production order.
 *     A failure at any stage halts the smoke with a detailed diagnostic.
 *   - Vote-choice scrub spy is verified at the bridge layer (already
 *     covered by `signatureImputationBridgeSmoke`); this final smoke
 *     does not duplicate it.
 *
 * Usage:
 *   npx tsx src/electorate/phase27FinalSmoke.ts
 */

import * as fs from "node:fs";
import * as path from "node:path";
import * as os from "node:os";

import { loadSurveyRespondents } from "./cesBacktestLoader.js";
import { mapSurveyToPrism, type SurveyPrismSignature } from "./surveyToPrismMapper.js";
import {
  validateSyntheticElectorateRow,
  type SyntheticElectorateRow,
} from "./syntheticElectorateContract.js";
import {
  runSignatureImputationBridge,
  type BridgeDemographicBuckets,
  type BridgeDonorSignature,
  type BridgeStats,
} from "./signatureImputationBridge.js";
import {
  runSyntheticElectorateAggregate,
  type SyntheticElectorateAggregateOutput,
} from "./syntheticElectorateAggregate.js";
import { loadFromFile, type FileLoaderResult } from "./ipumsPumsUniverseFileLoader.js";
import {
  validateVepUniverseRow,
  type VepAgeBucket,
  type VepEducation,
  type VepIncomeBucket,
  type VepUniverseRow,
} from "./vepUniverseTypes.js";
import type { IpumsLoaderMeta } from "./ipumsPumsUniverseLoader.js";

// ─── Config ────────────────────────────────────────────────────────────────

const CYCLE: 2016 = 2016;
const CCES_FILE_PATH = "data/cces2016/CCES16_Common_OUTPUT_Feb2018_VV.tab";
const CCES_ROW_LIMIT = 5000;
const NUM_DRAWS = 5;
const RANDOM_SEED = 20260504;

// ─── PUMS fixture (2016) ──────────────────────────────────────────────────

/**
 * 15-row fixture covering common demographic cells the CCES 2016 sample
 * reliably contains donors for. PUMS column conventions:
 *   - YEAR / SAMPLE / SERIAL / PERNUM: identifiers
 *   - STATEFIP: integer FIPS (loader maps to 2-letter)
 *   - PUMA: sub-state geo
 *   - AGE: integer (loader buckets via VepAgeBucket)
 *   - SEX: 1=male, 2=female
 *   - RACE / RACED / HISPAN: collapsed by loader
 *   - EDUC / EDUCD: 1-2=less_than_hs, 3-5=hs_grad, 6-7=some_college,
 *                   8-10=bachelor, 11+=graduate (per loader collapsers)
 *   - HHINCOME: dollars (loader buckets per VepIncomeBucket)
 *   - CITIZEN: 1=us_born, 2=us_naturalized, 3=us_territory, 4=non_citizen
 *   - PERWT: PUMS person weight; arbitrary positive
 *   - GQ: 1=non-group-quarters; 3 etc. = group quarters
 */
const HEADER = [
  "YEAR", "SAMPLE", "SERIAL", "PERNUM", "STATEFIP", "PUMA",
  "AGE", "SEX", "RACE", "RACED", "HISPAN", "EDUC", "EDUCD",
  "HHINCOME", "CITIZEN", "PERWT", "GQ",
];
const ROWS: string[][] = [
  // CA mixes
  ["2016", "201600", "100001", "1", "6",  "5300", "35", "2", "3", "",  "1", "10", "", "60000", "1", "150", "1"], // Hispanic female 35-44 BA CA middle
  ["2016", "201600", "100002", "1", "6",  "5301", "55", "1", "1", "",  "0", "8",  "", "120000","1", "180", "1"], // White male 55-64 BA CA high
  ["2016", "201600", "100003", "1", "6",  "5302", "28", "2", "4", "",  "0", "10", "", "55000", "2", "120", "1"], // Asian female 25-34 BA CA mid (naturalized)

  // TX mixes
  ["2016", "201600", "100004", "1", "48", "1100", "42", "1", "3", "",  "1", "6",  "", "45000", "1", "175", "1"], // Hispanic male 35-44 hs_grad TX middle
  ["2016", "201600", "100005", "1", "48", "1101", "62", "1", "1", "",  "0", "5",  "", "30000", "1", "160", "1"], // White male 55-64 hs_or_less TX low
  ["2016", "201600", "100006", "1", "48", "1102", "39", "2", "1", "",  "0", "9",  "", "85000", "1", "145", "1"], // White female 35-44 BA TX high

  // FL mixes
  ["2016", "201600", "100007", "1", "12", "1500", "70", "1", "1", "",  "0", "6",  "", "40000", "1", "165", "1"], // White male 65-74 hs_grad FL middle
  ["2016", "201600", "100008", "1", "12", "1501", "47", "2", "2", "",  "0", "8",  "", "50000", "1", "140", "1"], // Black female 45-54 BA FL middle

  // NY mixes
  ["2016", "201600", "100009", "1", "36", "3700", "29", "2", "1", "",  "0", "11", "", "95000", "1", "130", "1"], // White female 25-34 graduate NY high
  ["2016", "201600", "100010", "1", "36", "3701", "33", "1", "2", "",  "0", "7",  "", "55000", "1", "135", "1"], // Black male 25-34 some_college NY middle

  // PA mixes
  ["2016", "201600", "100011", "1", "42", "4200", "58", "1", "1", "",  "0", "5",  "", "35000", "1", "155", "1"], // White male 55-64 hs_or_less PA low
  ["2016", "201600", "100012", "1", "42", "4201", "44", "2", "1", "",  "0", "9",  "", "75000", "1", "150", "1"], // White female 35-44 BA PA middle

  // OH mixes
  ["2016", "201600", "100013", "1", "39", "3900", "67", "2", "1", "",  "0", "6",  "", "32000", "1", "170", "1"], // White female 65-74 hs_grad OH low
  ["2016", "201600", "100014", "1", "39", "3901", "31", "1", "2", "",  "0", "8",  "", "65000", "1", "140", "1"], // Black male 25-34 BA OH middle

  // GA mix
  ["2016", "201600", "100015", "1", "13", "1300", "52", "2", "2", "",  "0", "10", "", "70000", "1", "145", "1"], // Black female 45-54 BA GA middle
];

const META: IpumsLoaderMeta = {
  cycle: CYCLE,
  sourceDataset: "ipums_acs5_2012_2016_phase27_final_smoke_fixture",
  sourceVintage: "2012-2016",
};

function toTsv(rows: string[][]): string {
  return [HEADER, ...rows].map(r => r.join("\t")).join("\n") + "\n";
}

// ─── Donor demographic bucketers (mirrored from signatureImputationBridgeSmoke) ──

function fipsToPostal(raw: string | undefined): string | null {
  if (raw === undefined || raw === null) return null;
  const s = String(raw).replace(/^0+/, "").trim();
  if (s === "") return null;
  return FIPS_TO_POSTAL[s] ?? null;
}

const FIPS_TO_POSTAL: Record<string, string> = {
  "1": "AL", "2": "AK", "4": "AZ", "5": "AR", "6": "CA", "8": "CO", "9": "CT", "10": "DE",
  "11": "DC", "12": "FL", "13": "GA", "15": "HI", "16": "ID", "17": "IL", "18": "IN", "19": "IA",
  "20": "KS", "21": "KY", "22": "LA", "23": "ME", "24": "MD", "25": "MA", "26": "MI", "27": "MN",
  "28": "MS", "29": "MO", "30": "MT", "31": "NE", "32": "NV", "33": "NH", "34": "NJ", "35": "NM",
  "36": "NY", "37": "NC", "38": "ND", "39": "OH", "40": "OK", "41": "OR", "42": "PA", "44": "RI",
  "45": "SC", "46": "SD", "47": "TN", "48": "TX", "49": "UT", "50": "VT", "51": "VA", "53": "WA",
  "54": "WV", "55": "WI", "56": "WY",
};

function bucketAge(year: number, birthyr: number | undefined): VepAgeBucket | null {
  if (typeof birthyr !== "number" || !Number.isFinite(birthyr) || birthyr < 1900 || birthyr > year) return null;
  const age = year - birthyr;
  if (age < 18) return null;
  if (age < 25) return "18-24";
  if (age < 35) return "25-34";
  if (age < 45) return "35-44";
  if (age < 55) return "45-54";
  if (age < 65) return "55-64";
  if (age < 75) return "65-74";
  return "75+";
}

function bucketRace(raw: string | undefined): string | null {
  if (raw === undefined) return null;
  const code = parseInt(String(raw).trim(), 10);
  if (!Number.isFinite(code)) return null;
  switch (code) {
    case 1: return "white";
    case 2: return "black";
    case 3: return "hispanic";
    case 4: return "asian";
    default: return "other";
  }
}

function bucketSex(raw: string | undefined): string | null {
  if (raw === undefined) return null;
  const code = parseInt(String(raw).trim(), 10);
  if (!Number.isFinite(code)) return null;
  if (code === 1) return "male";
  if (code === 2) return "female";
  return "other";
}

function bucketEducation(raw: string | undefined): VepEducation | null {
  if (raw === undefined) return null;
  const code = parseInt(String(raw).trim(), 10);
  if (!Number.isFinite(code)) return null;
  if (code <= 1) return "less_than_hs";
  if (code === 2) return "hs_grad";
  if (code <= 4) return "some_college";
  if (code === 5) return "bachelor";
  if (code === 6) return "graduate";
  return null;
}

function bucketIncome(raw: string | undefined): VepIncomeBucket | null {
  if (raw === undefined) return null;
  const code = parseInt(String(raw).trim(), 10);
  if (!Number.isFinite(code) || code <= 0) return null;
  if (code >= 90) return null;
  if (code <= 4) return "<25k";
  if (code <= 6) return "25-50k";
  if (code <= 8) return "50-75k";
  if (code <= 10) return "75-100k";
  if (code <= 12) return "100-150k";
  return "150k+";
}

function donorFromSignature(
  signature: SurveyPrismSignature,
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

// ─── Stage runners ─────────────────────────────────────────────────────────

interface StageResult {
  name: string;
  passed: boolean;
  detail: string;
  durationMs: number;
}

function stage(name: string, passed: boolean, detail: string, durationMs: number): StageResult {
  return { name, passed, detail, durationMs };
}

async function main(): Promise<void> {
  const cwd = process.cwd();
  const outDir = path.join(cwd, "results", "electorate", "synthetic-electorate");
  fs.mkdirSync(outDir, { recursive: true });

  const stages: StageResult[] = [];
  const reports: Record<string, unknown> = {};

  // ─── Stage 1: PUMS fixture/file loader → VepUniverseRow[] ────────────────
  let universe: VepUniverseRow[] = [];
  let pumsResult: FileLoaderResult | null = null;
  {
    const t0 = Date.now();
    const tmp = await fs.promises.mkdtemp(path.join(os.tmpdir(), "phase27-final-smoke-"));
    const tsvPath = path.join(tmp, "pums_fixture_2016.tsv");
    await fs.promises.writeFile(tsvPath, toTsv(ROWS), "utf8");
    pumsResult = await loadFromFile({ filePath: tsvPath, meta: META });
    universe = pumsResult.rows;
    let rowsValid = 0;
    let rowsInvalid = 0;
    for (const r of universe) {
      const errs = validateVepUniverseRow(r);
      if (errs.length === 0) rowsValid++;
      else rowsInvalid++;
    }
    const passed = pumsResult.stats.rowsRead === ROWS.length
      && pumsResult.stats.rowsEmitted === universe.length
      && pumsResult.stats.rowsEmitted > 0
      && rowsInvalid === 0;
    stages.push(stage(
      "1. PUMS fixture file loader → VepUniverseRow[]",
      passed,
      `rowsRead=${pumsResult.stats.rowsRead} rowsEmitted=${pumsResult.stats.rowsEmitted} rowsSkipped=${pumsResult.stats.rowsSkipped} rowsValid=${rowsValid} rowsInvalid=${rowsInvalid} weightedTotal=${pumsResult.stats.weightedTotalEmitted.toFixed(1)} weightedVepEligible=${pumsResult.stats.weightedVepEligible.toFixed(1)}`,
      Date.now() - t0,
    ));
    reports.stage_1_pums_loader = {
      stats: pumsResult.stats,
      universe_row_count: universe.length,
      rows_valid: rowsValid,
      rows_invalid: rowsInvalid,
      sample_universe_row: universe[0] ?? null,
    };
    if (!passed) {
      console.error("Stage 1 failed; aborting.");
      writeReports(stages, reports, outDir);
      process.exit(1);
    }
  }

  // ─── Stage 2: CCES backtest loader + mapper → SurveyPrismSignature[] ────
  let signatures: SurveyPrismSignature[] = [];
  let respondentsLoaded = 0;
  {
    const t0 = Date.now();
    const ccesFilePath = path.join(cwd, CCES_FILE_PATH);
    if (!fs.existsSync(ccesFilePath)) {
      stages.push(stage("2. CCES loader + mapper", false, `CCES 2016 file not present at ${ccesFilePath}`, Date.now() - t0));
      writeReports(stages, reports, outDir);
      process.exit(2);
    }
    const { respondents } = await loadSurveyRespondents({
      filePath: ccesFilePath, year: CYCLE, rowLimit: CCES_ROW_LIMIT, keepRawVarPayload: true,
    });
    respondentsLoaded = respondents.length;
    signatures = respondents.map(mapSurveyToPrism);
    let realSignalSum = 0;
    for (const s of signatures) realSignalSum += s.coverage.realSignalCount;
    const meanRealSignal = signatures.length > 0 ? realSignalSum / signatures.length : 0;
    const passed = respondents.length > 0 && signatures.length === respondents.length;
    stages.push(stage(
      "2. CCES loader + mapper → SurveyPrismSignature[]",
      passed,
      `respondents=${respondents.length} signatures=${signatures.length} mean_real_signal_targets=${meanRealSignal.toFixed(2)}/${signatures[0]?.coverage.totalTargets ?? 20}`,
      Date.now() - t0,
    ));
    reports.stage_2_cces_mapper = {
      respondents_loaded: respondents.length,
      signatures_built: signatures.length,
      mean_real_signal_targets_per_row: meanRealSignal,
      total_targets_per_row: signatures[0]?.coverage.totalTargets ?? null,
    };
    if (!passed) {
      writeReports(stages, reports, outDir);
      process.exit(2);
    }
  }

  // ─── Stage 3: Donor adapter → BridgeDonorSignature[] ────────────────────
  let donors: BridgeDonorSignature[] = [];
  {
    const t0 = Date.now();
    const ccesFilePath = path.join(cwd, CCES_FILE_PATH);
    const { respondents } = await loadSurveyRespondents({
      filePath: ccesFilePath, year: CYCLE, rowLimit: CCES_ROW_LIMIT, keepRawVarPayload: true,
    });
    for (let i = 0; i < respondents.length; i++) {
      const r = respondents[i]!;
      const sig = signatures[i]!;
      const payload = r.rawVarPayload;
      const birthyr = payload["birthyr"] ? Number(payload["birthyr"]) : undefined;
      const donor = donorFromSignature(
        sig, birthyr,
        payload["inputstate"], payload["gender"], payload["race"],
        payload["educ"], payload["faminc"],
      );
      if (donor) donors.push(donor);
    }
    const passed = donors.length > 0;
    stages.push(stage(
      "3. Donor demographic bucketing → BridgeDonorSignature[]",
      passed,
      `donors_with_full_demographics=${donors.length} of ${respondentsLoaded}`,
      Date.now() - t0,
    ));
    reports.stage_3_donor_adapter = {
      donors_with_full_demographics: donors.length,
      respondents_loaded: respondentsLoaded,
      coverage_pct: respondentsLoaded > 0 ? (donors.length / respondentsLoaded * 100).toFixed(1) : "0",
    };
    if (!passed) {
      writeReports(stages, reports, outDir);
      process.exit(3);
    }
  }

  // ─── Stage 4: Bridge → SyntheticElectorateRow[] ─────────────────────────
  let rows: SyntheticElectorateRow[] = [];
  let bridgeStats: BridgeStats | null = null;
  {
    const t0 = Date.now();
    const bridgeOut = runSignatureImputationBridge(donors, universe, {
      year: CYCLE, numDraws: NUM_DRAWS, randomSeed: RANDOM_SEED,
    });
    rows = bridgeOut.rows;
    bridgeStats = bridgeOut.stats;
    let validationFailures: Array<{ cellId: string; drawId: number; errors: string[] }> = [];
    for (const r of rows) {
      const errs = validateSyntheticElectorateRow(r);
      if (errs.length > 0) validationFailures.push({ cellId: r.cellId, drawId: r.drawId, errors: errs });
    }
    const passed = rows.length === universe.length * NUM_DRAWS
      && bridgeStats.unmatchableUniverseRows === 0
      && validationFailures.length === 0;
    stages.push(stage(
      "4. Bridge (hot-deck imputation) → SyntheticElectorateRow[]",
      passed,
      `rows=${rows.length} expected=${universe.length * NUM_DRAWS} unmatched=${bridgeStats.unmatchableUniverseRows} mean_donor_pool=${bridgeStats.meanDonorPoolSize.toFixed(1)} mean_ess=${bridgeStats.meanEffectiveSampleSize.toFixed(1)} validation_failures=${validationFailures.length}`,
      Date.now() - t0,
    ));
    reports.stage_4_bridge = {
      output_rows: rows.length,
      expected_rows: universe.length * NUM_DRAWS,
      stats: bridgeStats,
      validation_failures: validationFailures,
    };
    if (!passed) {
      writeReports(stages, reports, outDir);
      process.exit(4);
    }
  }

  // ─── Stage 5: Aggregate → SyntheticElectorateAggregateOutput ────────────
  let aggregate: SyntheticElectorateAggregateOutput | null = null;
  {
    const t0 = Date.now();
    aggregate = runSyntheticElectorateAggregate(rows, {
      mockDisclaimer: "Phase 2.7 final smoke — PUMS fixture + CCES 2016 microdata. Universe is a 15-row hand-authored fixture; CCES donors are real survey microdata. NOT a population claim.",
    });
    const yearKeys = Object.keys(aggregate.years);
    const passed = aggregate.total_rows === rows.length
      && yearKeys.length === 1
      && yearKeys[0] === String(CYCLE)
      && aggregate.years[String(CYCLE)]!.row_count === rows.length;
    stages.push(stage(
      "5. Aggregate → coverage report",
      passed,
      `total_rows=${aggregate.total_rows} year_keys=[${yearKeys.join(",")}] row_count_2016=${aggregate.years[String(CYCLE)]?.row_count ?? "n/a"}`,
      Date.now() - t0,
    ));
    const yA = aggregate.years[String(CYCLE)]!;
    reports.stage_5_aggregate = {
      schema_version: aggregate.schema_version,
      total_rows: aggregate.total_rows,
      total_weight: aggregate.total_weight,
      year_keys: yearKeys,
      year_aggregate_summary: {
        year: yA.year,
        row_count: yA.row_count,
        total_weight: yA.total_weight,
        engagement: yA.engagement,
        moral_boundary_intensity_mean: yA.moral_boundary_intensity_mean,
        moral_boundary_mean_salience: yA.moral_boundary_mean_salience,
        position_node_means: Object.fromEntries(
          Object.entries(yA.position_node_marginals).map(([k, v]) => [k, { mean: v.mean, sd: v.sd, mean_salience: v.mean_salience }])
        ),
      },
    };
    if (!passed) {
      writeReports(stages, reports, outDir);
      process.exit(5);
    }
  }

  // ─── Final report ────────────────────────────────────────────────────────
  writeReports(stages, reports, outDir);

  const allPassed = stages.every(s => s.passed);
  console.log(`\nPhase 2.7 final smoke: ${allPassed ? "ALL PASS" : "FAIL"} (${stages.filter(s => s.passed).length}/${stages.length} stages)`);
  for (const s of stages) {
    console.log(`  ${s.passed ? "✓" : "✗"} ${s.name} — ${s.detail} [${s.durationMs}ms]`);
  }
  if (!allPassed) process.exit(1);
}

function writeReports(
  stages: StageResult[],
  reports: Record<string, unknown>,
  outDir: string,
): void {
  const allPassed = stages.every(s => s.passed);
  const jsonOut = {
    schema_version: "v0.1",
    run_at: new Date().toISOString(),
    phase: "2.7 final pipeline smoke (PUMS → CCES mapper → bridge → aggregate)",
    cycle: CYCLE,
    cces_file_path: CCES_FILE_PATH,
    cces_row_limit: CCES_ROW_LIMIT,
    num_draws: NUM_DRAWS,
    random_seed: RANDOM_SEED,
    pums_fixture_row_count: ROWS.length,
    overall_passed: allPassed,
    stages,
    reports,
  };
  const jsonPath = path.join(outDir, "phase-27-final-smoke.json");
  fs.writeFileSync(jsonPath, JSON.stringify(jsonOut, null, 2));

  let md = `# Phase 2.7 Final Pipeline Smoke\n\n`;
  md += `**Run at:** ${new Date().toISOString()}\n`;
  md += `**Cycle:** ${CYCLE}\n`;
  md += `**CCES file:** \`${CCES_FILE_PATH}\` (rowLimit=${CCES_ROW_LIMIT})\n`;
  md += `**PUMS fixture:** ${ROWS.length} hand-authored rows (loaded via real \`ipumsPumsUniverseFileLoader\`)\n`;
  md += `**Bridge config:** numDraws=${NUM_DRAWS}, randomSeed=${RANDOM_SEED}\n\n`;
  md += `## Pipeline\n\n`;
  md += `\`\`\`\n`;
  md += `PUMS fixture file ──▶ ipumsPumsUniverseFileLoader ──▶ VepUniverseRow[]  (Stage 1)\n`;
  md += `CCES 2016 microdata ─▶ cesBacktestLoader ─▶ surveyToPrismMapper ──▶ SurveyPrismSignature[]  (Stage 2)\n`;
  md += `                                          ─▶ donor demographic bucketing ──▶ BridgeDonorSignature[]  (Stage 3)\n`;
  md += `                                          ─▶ runSignatureImputationBridge ──▶ SyntheticElectorateRow[]  (Stage 4)\n`;
  md += `                                          ─▶ runSyntheticElectorateAggregate ──▶ coverage report  (Stage 5)\n`;
  md += `\`\`\`\n\n`;
  md += `## Stage results\n\n`;
  md += `| # | Stage | Pass | Detail | Duration |\n|---|---|:--:|---|---:|\n`;
  for (const s of stages) {
    md += `| ${stages.indexOf(s) + 1} | ${s.name} | ${s.passed ? "✓" : "✗"} | ${s.detail} | ${s.durationMs}ms |\n`;
  }
  md += `\n**Overall: ${allPassed ? "✓ ALL PASS" : "✗ FAIL"}** (${stages.filter(s => s.passed).length}/${stages.length} stages)\n\n`;

  if (reports.stage_5_aggregate) {
    const r = reports.stage_5_aggregate as { year_aggregate_summary?: { row_count: number; total_weight: number; engagement: { mean: number; sd: number }; moral_boundary_intensity_mean: number; moral_boundary_mean_salience: Record<string, number>; position_node_means: Record<string, { mean: number; sd: number; mean_salience: number }> } };
    if (r.year_aggregate_summary) {
      const y = r.year_aggregate_summary;
      md += `## ${CYCLE} aggregate (from PUMS-derived universe)\n\n`;
      md += `- Rows: ${y.row_count}; total weight: ${y.total_weight.toFixed(0)}\n`;
      md += `- Engagement: mean ${y.engagement.mean.toFixed(3)}, sd ${y.engagement.sd.toFixed(3)}\n`;
      md += `- Moral-boundary intensity mean: ${y.moral_boundary_intensity_mean.toFixed(3)}\n\n`;
      md += `### Position-node marginals (mean, sd, mean_salience)\n\n`;
      md += `| Node | Mean | SD | Mean salience |\n|---|---:|---:|---:|\n`;
      for (const [k, v] of Object.entries(y.position_node_means)) {
        md += `| ${k} | ${v.mean.toFixed(3)} | ${v.sd.toFixed(3)} | ${v.mean_salience.toFixed(3)} |\n`;
      }
      md += `\n### Moral-boundary mean salience\n\n`;
      md += `| Boundary | Mean salience |\n|---|---:|\n`;
      for (const [k, v] of Object.entries(y.moral_boundary_mean_salience)) {
        md += `| ${k} | ${v.toFixed(3)} |\n`;
      }
      md += `\n`;
    }
  }

  md += `## What this verifies\n\n`;
  md += `- Real \`ipumsPumsUniverseFileLoader\` reads a PUMS-format fixture and emits valid \`VepUniverseRow\` objects.\n`;
  md += `- The full mapper-and-bridge stack consumes those rows together with real CCES microdata to produce contract-valid \`SyntheticElectorateRow\` instances.\n`;
  md += `- The aggregator runs end-to-end on the bridge output and produces structured per-year marginals + boundary salience values.\n\n`;
  md += `## What this does NOT do\n\n`;
  md += `- Loads no real ACS / PUMS data file. The 15 PUMS rows are hand-authored.\n`;
  md += `- Does not produce vote predictions, candidate distances, or abstention calibration outputs.\n`;
  md += `- Does not duplicate the vote-choice scrub spy (already covered by \`signatureImputationBridgeSmoke\`).\n`;

  const mdPath = path.join(outDir, "phase-27-final-smoke.md");
  fs.writeFileSync(mdPath, md);
  console.log(`Wrote ${jsonPath}`);
  console.log(`Wrote ${mdPath}`);
}

main().catch(err => { console.error(err); process.exit(1); });
