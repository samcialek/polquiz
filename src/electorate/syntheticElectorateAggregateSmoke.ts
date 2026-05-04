/**
 * Phase 2.7.6 — Synthetic-electorate aggregation smoke.
 *
 * Pipeline:
 *   1. Per year, load CCES/CES microdata via cesBacktestLoader.
 *   2. Map each respondent to a SurveyPrismSignature (existing mapper).
 *   3. Bucket each donor's demographics into the canonical VEP vocabulary.
 *   4. Adapt the mock universe cells into VepUniverseRow[].
 *   5. Run the signature-imputation bridge with a fixed seed.
 *   6. Validate every output row through validateSyntheticElectorateRow.
 *   7. Stack rows across all 5 years and run runSyntheticElectorateAggregate.
 *   8. Verify smoke invariants (year coverage, finite/positive weights,
 *      forbidden-keys absent, JSON validity).
 *
 * Strict scope:
 *   - Mock universe only — no real VEP claim.
 *   - No vote prediction, no candidate distance, no abstention calibration.
 *   - The aggregator's output carries the mock disclaimer and the
 *     ENG × turnout-proxy joint is explicitly omitted with a documented
 *     reason.
 *
 * Usage:
 *   npx tsx src/electorate/syntheticElectorateAggregateSmoke.ts
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
  type MockVepCell,
  type MockYear,
} from "./mockVepUniverse.js";
import {
  runSignatureImputationBridge,
  type BridgeDemographicBuckets,
  type BridgeDonorSignature,
} from "./signatureImputationBridge.js";
import {
  runSyntheticElectorateAggregate,
  SYNTHETIC_ELECTORATE_AGGREGATE_SCHEMA_VERSION,
  type SyntheticElectorateAggregateOutput,
  type YearAggregate,
} from "./syntheticElectorateAggregate.js";
import type {
  VepAgeBucket,
  VepEducation,
  VepIncomeBucket,
  VepRace,
  VepUniverseRow,
} from "./vepUniverseTypes.js";

// ─── Config ────────────────────────────────────────────────────────────────

const SAMPLE_ROW_LIMIT = 5000;
const NUM_DRAWS = 5;
const RANDOM_SEED = 20260504;

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

// ─── Demographic bucketing helpers (mirrors signatureImputationBridgeSmoke) ─

const FIPS_TO_POSTAL: Record<string, string> = {
  "1": "AL", "2": "AK", "4": "AZ", "5": "AR", "6": "CA", "8": "CO", "9": "CT", "10": "DE",
  "11": "DC", "12": "FL", "13": "GA", "15": "HI", "16": "ID", "17": "IL", "18": "IN", "19": "IA",
  "20": "KS", "21": "KY", "22": "LA", "23": "ME", "24": "MD", "25": "MA", "26": "MI", "27": "MN",
  "28": "MS", "29": "MO", "30": "MT", "31": "NE", "32": "NV", "33": "NH", "34": "NJ", "35": "NM",
  "36": "NY", "37": "NC", "38": "ND", "39": "OH", "40": "OK", "41": "OR", "42": "PA", "44": "RI",
  "45": "SC", "46": "SD", "47": "TN", "48": "TX", "49": "UT", "50": "VT", "51": "VA", "53": "WA",
  "54": "WV", "55": "WI", "56": "WY",
};

function fipsToPostal(raw: string | undefined): string | null {
  if (raw === undefined || raw === null) return null;
  const s = String(raw).replace(/^0+/, "").trim();
  if (s === "") return null;
  return FIPS_TO_POSTAL[s] ?? null;
}

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

// ─── Mock-universe adapter (MockVepCell → VepUniverseRow) ──────────────────

function mockAgeBucket(bucket: string): VepAgeBucket {
  switch (bucket) {
    case "18-29": return "18-24";
    case "30-44": return "35-44";
    case "45-64": return "55-64";
    case "65+": return "65-74";
    default: return "35-44";
  }
}

function mockRepresentativeAge(bucket: VepAgeBucket): number {
  switch (bucket) {
    case "18-24": return 21;
    case "25-34": return 30;
    case "35-44": return 40;
    case "45-54": return 50;
    case "55-64": return 60;
    case "65-74": return 70;
    case "75+": return 78;
  }
}

function mockRace(cell: MockVepCell): { race: VepRace; hispanic: boolean } {
  switch (cell.raceEthnicity) {
    case "white": return { race: "white", hispanic: false };
    case "black": return { race: "black", hispanic: false };
    case "asian": return { race: "asian", hispanic: false };
    case "hispanic": return { race: "white", hispanic: true };
    default: return { race: "other_single", hispanic: false };
  }
}

function mockEducation(value: string): VepEducation {
  switch (value) {
    case "hs_or_less": return "hs_grad";
    case "some_college": return "some_college";
    case "ba_plus": return "bachelor";
    default: return "some_college";
  }
}

function mockIncome(value: string): VepIncomeBucket {
  switch (value) {
    case "low": return "<25k";
    case "middle": return "50-75k";
    case "high": return "100-150k";
    default: return "50-75k";
  }
}

function universeRowFromMockCell(cell: MockVepCell): VepUniverseRow {
  const ageBucket = mockAgeBucket(cell.ageBucket);
  const { race, hispanic } = mockRace(cell);
  return {
    respondentId: cell.cellId,
    year: cell.year,
    state: cell.state,
    age: mockRepresentativeAge(ageBucket),
    ageBucket,
    sex: cell.sex === "male" ? "male" : "female",
    race,
    hispanic,
    education: mockEducation(cell.education),
    incomeBucket: mockIncome(cell.incomeBucket),
    citizenship: "us_born",
    vepEligible: true,
    personWeight: cell.cellWeight,
    sourceDataset: "mock_vep_universe",
    sourceVintage: MOCK_VEP_UNIVERSE_VERSION,
    coverageNotes: [MOCK_DISCLAIMER],
    uncertainty: "high",
  };
}

// ─── Smoke invariants ──────────────────────────────────────────────────────

interface InvariantCheck {
  id: number;
  label: string;
  passed: boolean;
  detail: string;
}

function check(id: number, label: string, passed: boolean, detail: string): InvariantCheck {
  return { id, label, passed, detail };
}

const FORBIDDEN_KEYS = [
  "predictedVote",
  "candidateDistance",
  "voteProbability",
  "abstainProbability",
  "alpha_year",
  "predictedAbstainCount",
  "stageBResult",
];

function collectKeys(value: unknown, found: Set<string>, depth = 0): void {
  if (depth > 8 || value === null || typeof value !== "object") return;
  for (const k of Object.keys(value as Record<string, unknown>)) {
    found.add(k);
    collectKeys((value as Record<string, unknown>)[k], found, depth + 1);
  }
}

function fmt(n: number): string {
  if (!Number.isFinite(n)) return String(n);
  return n.toFixed(3);
}

function fmtMatrix(m: number[][]): string {
  return m.map(row => "[" + row.map(v => v.toFixed(3)).join(", ") + "]").join(", ");
}

async function main(): Promise<void> {
  const cwd = process.cwd();
  const outDir = path.join(cwd, "results", "electorate", "synthetic-electorate");
  fs.mkdirSync(outDir, { recursive: true });

  // ── Step 1-5: build SyntheticElectorateRow[] via the existing bridge.
  const allRows: SyntheticElectorateRow[] = [];
  const perYearStats: Array<{
    year: MockYear;
    file_present: boolean;
    skipped_reason?: string;
    donors: number;
    universe_rows: number;
    output_rows: number;
    per_row_validation_errors: number;
  }> = [];

  for (const target of YEAR_TARGETS) {
    const filePath = path.join(cwd, target.filePath);
    console.log(`\n=== ${target.year} (${target.filePath}) ===`);
    if (!fs.existsSync(filePath)) {
      console.log(`  ✗ file not present — skipping`);
      perYearStats.push({
        year: target.year,
        file_present: false,
        skipped_reason: "microdata file not present locally",
        donors: 0,
        universe_rows: 0,
        output_rows: 0,
        per_row_validation_errors: 0,
      });
      continue;
    }

    const { respondents } = await loadSurveyRespondents({
      filePath,
      year: target.year,
      rowLimit: SAMPLE_ROW_LIMIT,
      keepRawVarPayload: true,
    });

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
        sig, birthyr,
        payload[demoCols.state], payload[demoCols.gender], payload[demoCols.race],
        payload[demoCols.educ], payload[incomeCol],
      );
      if (donor) donors.push(donor);
    }

    const universe = getMockVepCells(target.year).map(universeRowFromMockCell);
    const { rows } = runSignatureImputationBridge(donors, universe, {
      year: target.year,
      numDraws: NUM_DRAWS,
      randomSeed: RANDOM_SEED,
    });

    let perRowErrors = 0;
    for (const r of rows) {
      const errs = validateSyntheticElectorateRow(r);
      if (errs.length > 0) perRowErrors++;
    }
    if (perRowErrors > 0) console.error(`  ✗ ${perRowErrors} row(s) failed validateSyntheticElectorateRow`);

    perYearStats.push({
      year: target.year,
      file_present: true,
      donors: donors.length,
      universe_rows: universe.length,
      output_rows: rows.length,
      per_row_validation_errors: perRowErrors,
    });
    allRows.push(...rows);
    console.log(`  donors=${donors.length} cells=${universe.length} rows=${rows.length} per-row errors=${perRowErrors}`);
  }

  // ── Step 7: aggregate.
  const aggregate = runSyntheticElectorateAggregate(allRows, { mockDisclaimer: MOCK_DISCLAIMER });

  // ── Step 8: smoke invariants.
  const checks: InvariantCheck[] = [];
  // (1) All 5 mock years represented in the input pipeline.
  const yearsLoaded = perYearStats.filter(s => s.file_present).map(s => s.year);
  const allFiveLoaded = MOCK_YEARS.every(y => yearsLoaded.includes(y));
  checks.push(check(1,
    "All 5 mock years loaded into the pipeline",
    allFiveLoaded,
    `loaded=[${yearsLoaded.join(",")}]`));
  // (2) Every input row validates per validateSyntheticElectorateRow.
  const totalValidationErrors = perYearStats.reduce((s, y) => s + y.per_row_validation_errors, 0);
  checks.push(check(2,
    "Every input SyntheticElectorateRow validates per validateSyntheticElectorateRow",
    totalValidationErrors === 0,
    `total per-row errors = ${totalValidationErrors}`));
  // (3) Every input row has finite, positive cellWeight.
  let weightsOk = true;
  let badIdx = -1;
  for (let i = 0; i < allRows.length; i++) {
    const w = allRows[i]!.cellWeight;
    if (!Number.isFinite(w) || w <= 0) { weightsOk = false; badIdx = i; break; }
  }
  checks.push(check(3,
    "All input row weights are finite and > 0",
    weightsOk,
    weightsOk
      ? `min=${Math.min(...allRows.map(r => r.cellWeight))} max=${Math.max(...allRows.map(r => r.cellWeight))} n=${allRows.length}`
      : `bad row index ${badIdx} weight=${allRows[badIdx]?.cellWeight}`));
  // (4) Every loaded year has aggregate output.
  const aggregateYears = Object.keys(aggregate.years).map(s => Number(s));
  const allYearsAggregated = yearsLoaded.every(y => aggregateYears.includes(y));
  checks.push(check(4,
    "Aggregate output present for every loaded year",
    allYearsAggregated,
    `aggregate years=[${aggregateYears.join(",")}] expected=[${yearsLoaded.join(",")}]`));
  // (5) Aggregate output carries the mock disclaimer.
  checks.push(check(5,
    "Aggregate output carries the mock-universe disclaimer",
    aggregate.mock_disclaimer === MOCK_DISCLAIMER,
    `mock_disclaimer="${aggregate.mock_disclaimer.slice(0, 60)}..."`));
  // (6) Forbidden keys absent in aggregate output.
  const foundKeys = new Set<string>();
  collectKeys(aggregate, foundKeys);
  const forbiddenPresent = FORBIDDEN_KEYS.filter(k => foundKeys.has(k));
  checks.push(check(6,
    "No vote-prediction / candidate-distance / abstention-calibration keys in aggregate output",
    forbiddenPresent.length === 0,
    forbiddenPresent.length === 0
      ? `forbidden keys checked = [${FORBIDDEN_KEYS.join(", ")}]; none present`
      : `FORBIDDEN keys present: [${forbiddenPresent.join(", ")}]`));
  // (7) Schema version is the canonical aggregator version.
  checks.push(check(7,
    "Aggregate schema_version matches canonical",
    aggregate.schema_version === SYNTHETIC_ELECTORATE_AGGREGATE_SCHEMA_VERSION,
    `schema_version="${aggregate.schema_version}"`));
  // (8) Per-year position marginals: 9 nodes, all with finite mean / sd / percentiles.
  const positionsOk = aggregateYears.every(y => {
    const yA = aggregate.years[String(y)]!;
    return (Object.keys(yA.position_node_marginals).length === 9 &&
      Object.values(yA.position_node_marginals).every(m =>
        [m.mean, m.sd, m.p10, m.p50, m.p90, m.mean_salience].every(Number.isFinite)));
  });
  checks.push(check(8,
    "Every year's 9 position-node marginals are finite",
    positionsOk,
    positionsOk ? "all years × 9 nodes pass finite check" : "found non-finite marginal"));
  // (9) Every year's joints exist as 5×5 matrices that sum to 1 (within tolerance).
  let joinedOk = true;
  let firstFailDetail = "";
  for (const y of aggregateYears) {
    const joints = aggregate.years[String(y)]!.low_order_joints;
    for (const name of ["MAT_x_CD", "CD_x_CU", "MOR_x_PRO"] as const) {
      const m = joints[name];
      if (m.length !== 5 || m.some(r => r.length !== 5)) {
        joinedOk = false; firstFailDetail = `${y} ${name} not 5×5`;
        break;
      }
      let sum = 0;
      for (const row of m) for (const v of row) sum += v;
      if (Math.abs(sum - 1) > 1e-6) {
        joinedOk = false; firstFailDetail = `${y} ${name} sums to ${sum.toFixed(6)}, not 1`;
        break;
      }
    }
    if (!joinedOk) break;
  }
  checks.push(check(9,
    "Every year's MAT×CD / CD×CU / MOR×PRO joints are 5×5 and sum to 1",
    joinedOk,
    joinedOk ? "all 3 joints × all years sum to 1" : firstFailDetail));
  // (10) ENG × turnout-proxy is explicitly omitted with a documented reason.
  const omittedOk = aggregateYears.every(y => {
    const j = aggregate.years[String(y)]!.low_order_joints.engagement_x_turnout_proxy;
    return j.status === "omitted" && typeof j.reason === "string" && j.reason.length > 20;
  });
  checks.push(check(10,
    "engagement_x_turnout_proxy is explicitly omitted with documented reason in every year",
    omittedOk,
    omittedOk ? "all years carry omission status + reason" : "omission missing or reason too short"));

  // Print + tally.
  let passed = 0;
  for (const c of checks) {
    const mark = c.passed ? "✓" : "✗";
    console.log(`  ${mark} ${c.id}. ${c.label} — ${c.detail}`);
    if (c.passed) passed++;
  }

  // ── JSON output.
  const jsonOut = {
    schema_version: "v0.1",
    run_at: new Date().toISOString(),
    phase: "2.7.6 — synthetic electorate aggregate harness (mock universe)",
    mock_disclaimer: MOCK_DISCLAIMER,
    pipeline: {
      sampleRowLimitPerYear: SAMPLE_ROW_LIMIT,
      numDraws: NUM_DRAWS,
      randomSeed: RANDOM_SEED,
    },
    forbidden_keys_checked: FORBIDDEN_KEYS,
    per_year_pipeline_stats: perYearStats,
    invariant_checks: checks,
    aggregate,
    smoke_summary: {
      total_checks: checks.length,
      total_passed: passed,
      all_passed: passed === checks.length,
      total_input_rows: allRows.length,
      years_aggregated: Object.keys(aggregate.years).length,
    },
  };
  const jsonPath = path.join(outDir, "synthetic-electorate-aggregate-smoke.json");
  fs.writeFileSync(jsonPath, JSON.stringify(jsonOut, null, 2));

  // ── Markdown summary.
  let md = `# Synthetic Electorate Aggregate — Smoke (Phase 2.7.6)\n\n`;
  md += `**Run at:** ${new Date().toISOString()}\n`;
  md += `**Aggregator schema:** \`${SYNTHETIC_ELECTORATE_AGGREGATE_SCHEMA_VERSION}\`\n`;
  md += `**Mock universe version:** \`${MOCK_VEP_UNIVERSE_VERSION}\`\n`;
  md += `**Pipeline:** sampleRowLimitPerYear=${SAMPLE_ROW_LIMIT}, numDraws=${NUM_DRAWS}, randomSeed=${RANDOM_SEED}\n\n`;
  md += `> **${MOCK_DISCLAIMER}**\n\n`;
  md += `## What this verifies\n\n`;
  md += `Builds \`SyntheticElectorateRow[]\` through the existing v1 hot-deck bridge against the mock universe (no raw JSON dependency), then runs \`runSyntheticElectorateAggregate\` on the stack and verifies smoke invariants. The aggregator surfaces per-year position-node marginals (mean / sd / p10/p50/p90), categorical distributions for EPS / AES, moral-boundary mean salience + intensity, engagement mean / sd, and three low-order joints (MAT × CD, CD × CU, MOR × PRO). The plan's fourth joint, ENG × abstention-proxy, is **explicitly omitted** because the synthetic-electorate row contract carries no abstention proxy — vote choice, abstention, candidate distance, and counterfactual outputs are downstream projections, not source fields on the row.\n\n`;
  md += `**Not in scope**: real PUMS universe, vote prediction, candidate distance, abstention calibration, scorer.\n\n`;

  md += `## Pipeline per year\n\n`;
  md += `| Year | File present | Donors | Mock cells | Output rows | Per-row errors |\n`;
  md += `|---|:--:|---:|---:|---:|---:|\n`;
  for (const s of perYearStats) {
    md += `| ${s.year} | ${s.file_present ? "yes" : "no"} | ${s.donors} | ${s.universe_rows} | ${s.output_rows} | ${s.per_row_validation_errors} |\n`;
  }
  md += `\n`;

  md += `## Smoke invariants\n\n`;
  md += `| # | Check | Pass | Detail |\n|---|---|:--:|---|\n`;
  for (const c of checks) {
    md += `| ${c.id} | ${c.label} | ${c.passed ? "✓" : "✗"} | ${c.detail} |\n`;
  }
  md += `\n**Overall: ${passed}/${checks.length} ${passed === checks.length ? "ALL PASS" : "FAIL"}**\n\n`;

  // Per-year aggregator output.
  for (const y of Object.keys(aggregate.years).sort()) {
    const yA = aggregate.years[y] as YearAggregate;
    md += `## ${y}\n\n`;
    md += `- Rows: **${yA.row_count}**; total weight: **${yA.total_weight.toFixed(0)}** (range ${yA.weight_min.toFixed(2)} → ${yA.weight_max.toFixed(2)})\n`;
    md += `- Engagement: mean ${fmt(yA.engagement.mean)}, sd ${fmt(yA.engagement.sd)}\n`;
    md += `- Moral-boundary intensity mean: ${fmt(yA.moral_boundary_intensity_mean)}\n\n`;

    md += `### Position-node marginals (1..5 scale)\n\n`;
    md += `| Node | Mean | SD | p10 | p50 | p90 | Mean salience |\n|---|---:|---:|---:|---:|---:|---:|\n`;
    for (const node of Object.keys(yA.position_node_marginals)) {
      const m = yA.position_node_marginals[node as keyof typeof yA.position_node_marginals];
      md += `| ${node} | ${fmt(m.mean)} | ${fmt(m.sd)} | ${fmt(m.p10)} | ${fmt(m.p50)} | ${fmt(m.p90)} | ${fmt(m.mean_salience)} |\n`;
    }
    md += `\n`;

    md += `### Categorical-node distributions (6-bin)\n\n`;
    md += `| Node | Distribution | Mean salience |\n|---|---|---:|\n`;
    for (const node of Object.keys(yA.categorical_node_distributions)) {
      const m = yA.categorical_node_distributions[node as keyof typeof yA.categorical_node_distributions];
      md += `| ${node} | [${m.distribution.map(v => v.toFixed(3)).join(", ")}] | ${fmt(m.mean_salience)} |\n`;
    }
    md += `\n`;

    md += `### Moral-boundary mean salience (0..3 scale)\n\n`;
    md += `| Boundary | Mean salience |\n|---|---:|\n`;
    for (const b of Object.keys(yA.moral_boundary_mean_salience)) {
      md += `| ${b} | ${fmt(yA.moral_boundary_mean_salience[b as keyof typeof yA.moral_boundary_mean_salience])} |\n`;
    }
    md += `\n`;

    md += `### Low-order joints (5×5 weighted outer-product, normalized)\n\n`;
    md += `**MAT × CD** — \`${fmtMatrix(yA.low_order_joints.MAT_x_CD)}\`\n\n`;
    md += `**CD × CU** — \`${fmtMatrix(yA.low_order_joints.CD_x_CU)}\`\n\n`;
    md += `**MOR × PRO** — \`${fmtMatrix(yA.low_order_joints.MOR_x_PRO)}\`\n\n`;
    md += `**ENG × turnout-proxy** — \`${yA.low_order_joints.engagement_x_turnout_proxy.status}\`. Reason: ${yA.low_order_joints.engagement_x_turnout_proxy.reason}\n\n`;

    md += `### Breakouts\n\n`;
    for (const dim of ["by_state", "by_ageBucket", "by_raceEthnicity", "by_sex"] as const) {
      md += `**${dim}**\n\n`;
      md += `| Group | n | Total weight | MAT mean | CD mean | MOR mean | Engagement mean |\n|---|---:|---:|---:|---:|---:|---:|\n`;
      for (const e of yA.breakouts[dim]) {
        md += `| ${e.group} | ${e.row_count} | ${e.total_weight.toFixed(0)} | ${fmt(e.MAT_mean)} | ${fmt(e.CD_mean)} | ${fmt(e.MOR_mean)} | ${fmt(e.engagement_mean)} |\n`;
      }
      md += `\n`;
    }
  }

  md += `## Forbidden keys (verified absent in aggregate output)\n\n`;
  for (const k of FORBIDDEN_KEYS) md += `- \`${k}\`\n`;
  md += `\n## Aggregate\n\n`;
  md += `- Total invariant checks: **${passed}/${checks.length}**\n`;
  md += `- Total input rows: ${allRows.length}\n`;
  md += `- Years aggregated: ${Object.keys(aggregate.years).length}\n`;

  fs.writeFileSync(path.join(outDir, "synthetic-electorate-aggregate-smoke.md"), md);

  try { JSON.parse(fs.readFileSync(jsonPath, "utf8")); console.log("\nJSON valid"); }
  catch (e) { console.error("JSON did not parse:", e); process.exit(3); }

  console.log(`\nWrote ${jsonPath}`);
  console.log(`Wrote ${path.join(outDir, "synthetic-electorate-aggregate-smoke.md")}`);
  console.log(`\nAggregate: ${passed}/${checks.length} invariant checks passed; ${allRows.length} input rows; ${Object.keys(aggregate.years).length} year(s) aggregated.`);
  if (passed !== checks.length) {
    console.error("\nSMOKE FAILED: at least one invariant check did not pass");
    process.exit(1);
  }
}

main().catch(err => { console.error(err); process.exit(1); });
