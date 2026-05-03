/**
 * VEP universe row scaffold smoke (Phase 2.7 v0).
 *
 * Hand-authored fixture exercising the `VepUniverseRow` contract +
 * validators in `vepUniverseTypes.ts`. NO raw data downloads. NO
 * IPUMS / Census network acquisition. The fixture is a tiny, varied
 * sample per backtest year so the smoke can:
 *
 *   1. Exercise every validator branch (eligible + ineligible rows).
 *   2. Compute weighted marginals (state / race / age_bucket / etc.)
 *      to confirm the type contract supports the downstream summaries
 *      a real PUMS-fed loader will need.
 *   3. Verify all five backtest years (2008/2012/2016/2020/2024) round-
 *      trip cleanly.
 *
 * Outputs:
 *   results/electorate/synthetic-electorate/vep-universe-loader-smoke.json
 *   results/electorate/synthetic-electorate/vep-universe-loader-smoke.md
 */

import { promises as fs } from "node:fs";
import * as path from "node:path";

import {
  STATE_TO_REGION,
  VEP_AGE_BUCKETS,
  ageToBucket,
  validateVepUniverseRow,
  validateVepUniverseRows,
  type VepAgeBucket,
  type VepBacktestYear,
  type VepCitizenship,
  type VepEducation,
  type VepIncomeBucket,
  type VepRace,
  type VepSex,
  type VepUniverseRow,
  type VepUniverseLoaderStats,
} from "./vepUniverseTypes.js";

// ─── Tiny hand-authored fixture ───────────────────────────────────────────
//
// Six rows per year, varied across state / race / sex / age / education /
// citizenship. Includes deliberate ineligible rows (non-citizen and
// minor) to exercise the vepEligible=false branch + the validator's
// invariant for vepEligible=true.

interface FixtureSpec {
  year: VepBacktestYear;
  rows: Array<{
    state: string;
    age: number;
    sex: VepSex;
    race: VepRace;
    hispanic: boolean;
    education: VepEducation;
    incomeBucket: VepIncomeBucket | null;
    citizenship: VepCitizenship;
    /** Pre-felon-disenfranchisement eligibility intent; the fixture sets vepEligible from this + age + citizenship. */
    intendedEligible: boolean;
    personWeight: number;
    replicateWeights?: number[];
    coverageNotes?: string[];
  }>;
}

const FIXTURE_SPEC: FixtureSpec[] = [
  {
    year: 2008,
    rows: [
      { state: "OH", age: 35, sex: "male",   race: "white", hispanic: false, education: "hs_grad",       incomeBucket: "50-75k",  citizenship: "us_born",        intendedEligible: true,  personWeight: 152.4, replicateWeights: [148, 150, 154, 156] },
      { state: "FL", age: 67, sex: "female", race: "white", hispanic: false, education: "some_college",  incomeBucket: "25-50k",  citizenship: "us_born",        intendedEligible: true,  personWeight: 121.7 },
      { state: "CA", age: 28, sex: "female", race: "asian", hispanic: false, education: "bachelor",      incomeBucket: "75-100k", citizenship: "us_naturalized", intendedEligible: true,  personWeight: 188.2 },
      { state: "TX", age: 42, sex: "male",   race: "other_single", hispanic: true, education: "less_than_hs", incomeBucket: "<25k", citizenship: "non_citizen", intendedEligible: false, personWeight: 167.0 },
      { state: "NY", age: 17, sex: "male",   race: "black", hispanic: false, education: "less_than_hs",  incomeBucket: "25-50k",  citizenship: "us_born",        intendedEligible: false, personWeight: 102.5, coverageNotes: ["under_voting_age"] },
      { state: "PA", age: 55, sex: "female", race: "black", hispanic: false, education: "graduate",      incomeBucket: "100-150k",citizenship: "us_born",        intendedEligible: true,  personWeight: 144.1 },
    ],
  },
  {
    year: 2012,
    rows: [
      { state: "MI", age: 33, sex: "male",   race: "white", hispanic: false, education: "bachelor",      incomeBucket: "75-100k", citizenship: "us_born",        intendedEligible: true,  personWeight: 159.0 },
      { state: "GA", age: 71, sex: "female", race: "black", hispanic: false, education: "hs_grad",       incomeBucket: "<25k",    citizenship: "us_born",        intendedEligible: true,  personWeight: 109.8 },
      { state: "WA", age: 25, sex: "female", race: "asian", hispanic: false, education: "graduate",      incomeBucket: "100-150k",citizenship: "us_naturalized", intendedEligible: true,  personWeight: 174.6 },
      { state: "AZ", age: 47, sex: "male",   race: "amerindian", hispanic: false, education: "some_college", incomeBucket: "50-75k", citizenship: "us_born",     intendedEligible: true,  personWeight: 128.3 },
      { state: "NJ", age: 29, sex: "male",   race: "white", hispanic: true,  education: "bachelor",      incomeBucket: "75-100k", citizenship: "us_naturalized", intendedEligible: true,  personWeight: 141.9 },
      { state: "IL", age: 38, sex: "male",   race: "two_or_more", hispanic: false, education: "some_college", incomeBucket: "25-50k", citizenship: "non_citizen", intendedEligible: false, personWeight: 95.4 },
    ],
  },
  {
    year: 2016,
    rows: [
      { state: "WI", age: 45, sex: "female", race: "white", hispanic: false, education: "hs_grad",       incomeBucket: "50-75k",  citizenship: "us_born",        intendedEligible: true,  personWeight: 134.2, replicateWeights: [130, 132, 136, 138] },
      { state: "NC", age: 38, sex: "male",   race: "black", hispanic: false, education: "bachelor",      incomeBucket: "75-100k", citizenship: "us_born",        intendedEligible: true,  personWeight: 148.7 },
      { state: "TX", age: 22, sex: "female", race: "white", hispanic: true,  education: "some_college",  incomeBucket: "25-50k",  citizenship: "us_born",        intendedEligible: true,  personWeight: 117.3 },
      { state: "CA", age: 60, sex: "male",   race: "asian", hispanic: false, education: "graduate",      incomeBucket: "150k+",   citizenship: "us_naturalized", intendedEligible: true,  personWeight: 198.0 },
      { state: "FL", age: 16, sex: "female", race: "white", hispanic: false, education: "less_than_hs",  incomeBucket: "25-50k",  citizenship: "us_born",        intendedEligible: false, personWeight: 88.9, coverageNotes: ["under_voting_age"] },
      { state: "NV", age: 31, sex: "male",   race: "other_single", hispanic: true, education: "less_than_hs", incomeBucket: "<25k", citizenship: "non_citizen", intendedEligible: false, personWeight: 156.5 },
    ],
  },
  {
    year: 2020,
    rows: [
      { state: "PA", age: 41, sex: "female", race: "white", hispanic: false, education: "some_college",  incomeBucket: "50-75k",  citizenship: "us_born",        intendedEligible: true,  personWeight: 162.4 },
      { state: "AZ", age: 27, sex: "male",   race: "white", hispanic: true,  education: "hs_grad",       incomeBucket: "25-50k",  citizenship: "us_born",        intendedEligible: true,  personWeight: 145.0 },
      { state: "GA", age: 64, sex: "female", race: "black", hispanic: false, education: "bachelor",      incomeBucket: "75-100k", citizenship: "us_born",        intendedEligible: true,  personWeight: 138.6 },
      { state: "MA", age: 78, sex: "male",   race: "white", hispanic: false, education: "graduate",      incomeBucket: "100-150k",citizenship: "us_born",        intendedEligible: true,  personWeight: 109.2 },
      { state: "WA", age: 21, sex: "female", race: "asian", hispanic: false, education: "bachelor",      incomeBucket: "<25k",    citizenship: "us_naturalized", intendedEligible: true,  personWeight: 124.1 },
      { state: "TX", age: 35, sex: "male",   race: "other_single", hispanic: true, education: "less_than_hs", incomeBucket: "25-50k", citizenship: "non_citizen", intendedEligible: false, personWeight: 151.3 },
    ],
  },
  {
    year: 2024,
    rows: [
      { state: "MI", age: 52, sex: "female", race: "white", hispanic: false, education: "hs_grad",       incomeBucket: "50-75k",  citizenship: "us_born",        intendedEligible: true,  personWeight: 156.8 },
      { state: "PA", age: 36, sex: "male",   race: "black", hispanic: false, education: "some_college",  incomeBucket: "50-75k",  citizenship: "us_born",        intendedEligible: true,  personWeight: 142.5 },
      { state: "FL", age: 73, sex: "female", race: "white", hispanic: true,  education: "bachelor",      incomeBucket: "75-100k", citizenship: "us_born",        intendedEligible: true,  personWeight: 130.1 },
      { state: "CA", age: 24, sex: "male",   race: "asian", hispanic: false, education: "graduate",      incomeBucket: "100-150k",citizenship: "us_naturalized", intendedEligible: true,  personWeight: 167.4 },
      { state: "OH", age: 49, sex: "female", race: "two_or_more", hispanic: false, education: "bachelor", incomeBucket: "75-100k", citizenship: "us_born",        intendedEligible: true,  personWeight: 138.7 },
      { state: "NY", age: 17, sex: "male",   race: "black", hispanic: true,  education: "less_than_hs",  incomeBucket: "25-50k",  citizenship: "us_born",        intendedEligible: false, personWeight: 91.9, coverageNotes: ["under_voting_age"] },
    ],
  },
];

const SOURCE_DATASET_BY_YEAR: Record<VepBacktestYear, string> = {
  2008: "acs5_2005_2009_fixture",
  2012: "acs5_2008_2012_fixture",
  2016: "acs5_2012_2016_fixture",
  2020: "acs5_2016_2020_fixture",
  2024: "acs5_2020_2024_fixture",
};

const SOURCE_VINTAGE_BY_YEAR: Record<VepBacktestYear, string> = {
  2008: "2005-2009",
  2012: "2008-2012",
  2016: "2012-2016",
  2020: "2016-2020",
  2024: "2020-2024",
};

function buildFixtureRows(): VepUniverseRow[] {
  const rows: VepUniverseRow[] = [];
  for (const spec of FIXTURE_SPEC) {
    spec.rows.forEach((r, i) => {
      const eligible = r.intendedEligible &&
        r.age >= 18 &&
        (r.citizenship === "us_born" || r.citizenship === "us_naturalized");
      const ageBucket: VepAgeBucket = r.age >= 18 ? ageToBucket(r.age) : "18-24"; // bucket is required by schema; use 18-24 placeholder for ineligible-by-age rows (vepEligible=false)
      rows.push({
        respondentId: `FIXTURE-${spec.year}-${r.state}-${String(i + 1).padStart(3, "0")}`,
        year: spec.year,
        state: r.state,
        age: r.age,
        ageBucket,
        sex: r.sex,
        race: r.race,
        hispanic: r.hispanic,
        education: r.education,
        incomeBucket: r.incomeBucket,
        citizenship: r.citizenship,
        vepEligible: eligible,
        personWeight: r.personWeight,
        replicateWeights: r.replicateWeights,
        sourceDataset: SOURCE_DATASET_BY_YEAR[spec.year],
        sourceVintage: SOURCE_VINTAGE_BY_YEAR[spec.year],
        coverageNotes: r.coverageNotes,
        uncertainty: "high",
      });
    });
  }
  return rows;
}

// ─── Aggregation helper (mirrors the future loader's stats output) ────────

const RACE_VALUES: VepRace[] = ["white", "black", "amerindian", "asian", "nhpi", "other_single", "two_or_more"];
const EDU_VALUES: VepEducation[] = ["less_than_hs", "hs_grad", "some_college", "bachelor", "graduate"];
const CIT_VALUES: VepCitizenship[] = ["us_born", "us_naturalized", "us_territory", "non_citizen"];
const SEX_VALUES: VepSex[] = ["male", "female"];

function blankMarginals(): VepUniverseLoaderStats {
  return {
    rowsLoaded: 0,
    rowsSkipped: 0,
    weightedTotalPopulation: 0,
    weightedVepEligiblePopulation: 0,
    weightedAgeBucketMarginals: Object.fromEntries(VEP_AGE_BUCKETS.map(k => [k, 0])) as Record<VepAgeBucket, number>,
    weightedRaceMarginals: Object.fromEntries(RACE_VALUES.map(k => [k, 0])) as Record<VepRace, number>,
    weightedSexMarginals: Object.fromEntries(SEX_VALUES.map(k => [k, 0])) as Record<VepSex, number>,
    weightedEducationMarginals: Object.fromEntries(EDU_VALUES.map(k => [k, 0])) as Record<VepEducation, number>,
    weightedCitizenshipMarginals: Object.fromEntries(CIT_VALUES.map(k => [k, 0])) as Record<VepCitizenship, number>,
    weightedStateMarginals: {},
  };
}

function summarize(rows: readonly VepUniverseRow[], { vepOnly }: { vepOnly: boolean }): VepUniverseLoaderStats {
  const stats = blankMarginals();
  for (const r of rows) {
    if (vepOnly && !r.vepEligible) continue;
    stats.rowsLoaded++;
    stats.weightedTotalPopulation += r.personWeight;
    if (r.vepEligible) stats.weightedVepEligiblePopulation += r.personWeight;
    stats.weightedAgeBucketMarginals[r.ageBucket] += r.personWeight;
    stats.weightedRaceMarginals[r.race] += r.personWeight;
    stats.weightedSexMarginals[r.sex] += r.personWeight;
    stats.weightedEducationMarginals[r.education] += r.personWeight;
    stats.weightedCitizenshipMarginals[r.citizenship] += r.personWeight;
    stats.weightedStateMarginals[r.state] = (stats.weightedStateMarginals[r.state] ?? 0) + r.personWeight;
  }
  return stats;
}

// ─── Smoke runner ─────────────────────────────────────────────────────────

interface YearReport {
  year: VepBacktestYear;
  rowsTotal: number;
  rowsValid: number;
  validationErrors: Array<{ index: number; respondentId: string; errors: string[] }>;
  vepEligibleRows: number;
  weightedTotal: number;
  weightedVepEligible: number;
  vepEligibleShare: number;
  byState: Record<string, number>;
  byRace: Record<VepRace, number>;
  byAgeBucket: Record<VepAgeBucket, number>;
  bySex: Record<VepSex, number>;
  byCitizenship: Record<VepCitizenship, number>;
}

function reportYear(rows: VepUniverseRow[]): YearReport {
  const errs = validateVepUniverseRows(rows);
  const validationErrors: YearReport["validationErrors"] = [];
  for (const [idx, e] of errs) {
    const r = rows[idx];
    if (r) validationErrors.push({ index: idx, respondentId: r.respondentId, errors: e });
  }
  const stats = summarize(rows, { vepOnly: false });
  return {
    year: rows[0]!.year,
    rowsTotal: rows.length,
    rowsValid: rows.length - validationErrors.length,
    validationErrors,
    vepEligibleRows: rows.filter(r => r.vepEligible).length,
    weightedTotal: stats.weightedTotalPopulation,
    weightedVepEligible: stats.weightedVepEligiblePopulation,
    vepEligibleShare: stats.weightedTotalPopulation > 0
      ? stats.weightedVepEligiblePopulation / stats.weightedTotalPopulation
      : 0,
    byState: stats.weightedStateMarginals,
    byRace: stats.weightedRaceMarginals,
    byAgeBucket: stats.weightedAgeBucketMarginals,
    bySex: stats.weightedSexMarginals,
    byCitizenship: stats.weightedCitizenshipMarginals,
  };
}

function pct(x: number): string { return (100 * x).toFixed(1) + "%"; }

function renderMd(reports: YearReport[]): string {
  const lines: string[] = [];
  lines.push(`# VEP universe row scaffold smoke`);
  lines.push(``);
  lines.push(`**Run at:** ${new Date().toISOString()}`);
  lines.push(`**Years exercised:** ${reports.map(r => r.year).join(", ")}`);
  lines.push(``);
  lines.push(`Hand-authored fixture exercising the \`VepUniverseRow\` contract from \`src/electorate/vepUniverseTypes.ts\`. **No raw data downloaded.** No IPUMS / Census network calls. The fixture is six rows per backtest year, varied across state / race / sex / age / education / citizenship, including deliberate ineligible rows (non-citizen, under-voting-age) to exercise the \`vepEligible=false\` branch.`);
  lines.push(``);
  lines.push(`When the (planned) PUMS-fed loader lands, the per-year smoke output will have the same shape with real population marginals.`);
  lines.push(``);

  lines.push(`## Per-year overview`);
  lines.push(``);
  lines.push(`| Year | Rows | Valid | Eligible rows | Σ personWeight | Σ vepEligible weight | Eligible share |`);
  lines.push(`|---:|---:|---:|---:|---:|---:|---:|`);
  for (const r of reports) {
    lines.push(`| ${r.year} | ${r.rowsTotal} | ${r.rowsValid} | ${r.vepEligibleRows} | ${r.weightedTotal.toFixed(1)} | ${r.weightedVepEligible.toFixed(1)} | ${pct(r.vepEligibleShare)} |`);
  }
  lines.push(``);

  lines.push(`## Validation errors`);
  lines.push(``);
  let anyErrors = false;
  for (const r of reports) {
    if (r.validationErrors.length > 0) {
      anyErrors = true;
      lines.push(`### ${r.year}`);
      for (const e of r.validationErrors) lines.push(`- ${e.respondentId} (idx ${e.index}): ${e.errors.join("; ")}`);
      lines.push(``);
    }
  }
  if (!anyErrors) lines.push(`_(none — all fixture rows pass)_`);
  lines.push(``);

  lines.push(`## Weighted state marginals (across all rows, regardless of eligibility)`);
  lines.push(``);
  const allStates = new Set<string>();
  for (const r of reports) for (const s of Object.keys(r.byState)) allStates.add(s);
  const sortedStates = [...allStates].sort();
  const headerCells = ["state", "region", ...reports.map(r => String(r.year))];
  lines.push(`| ${headerCells.join(" | ")} |`);
  lines.push(`|${headerCells.map(() => "---").join("|")}|`);
  for (const s of sortedStates) {
    const region = STATE_TO_REGION[s] ?? "?";
    const cells = [s, region, ...reports.map(r => (r.byState[s] ?? 0).toFixed(1))];
    lines.push(`| ${cells.join(" | ")} |`);
  }
  lines.push(``);

  lines.push(`## Weighted age-bucket marginals`);
  lines.push(``);
  const ahCells = ["bucket", ...reports.map(r => String(r.year))];
  lines.push(`| ${ahCells.join(" | ")} |`);
  lines.push(`|${ahCells.map(() => "---").join("|")}|`);
  for (const b of VEP_AGE_BUCKETS) {
    lines.push(`| ${b} | ${reports.map(r => (r.byAgeBucket[b] ?? 0).toFixed(1)).join(" | ")} |`);
  }
  lines.push(``);

  lines.push(`## Weighted race marginals`);
  lines.push(``);
  lines.push(`| race | ${reports.map(r => String(r.year)).join(" | ")} |`);
  lines.push(`|---|${reports.map(() => "---").join("|")}|`);
  for (const ra of RACE_VALUES) {
    lines.push(`| ${ra} | ${reports.map(r => (r.byRace[ra] ?? 0).toFixed(1)).join(" | ")} |`);
  }
  lines.push(``);

  lines.push(`## Weighted citizenship marginals (eligibility surface)`);
  lines.push(``);
  lines.push(`| citizenship | ${reports.map(r => String(r.year)).join(" | ")} |`);
  lines.push(`|---|${reports.map(() => "---").join("|")}|`);
  for (const c of CIT_VALUES) {
    lines.push(`| ${c} | ${reports.map(r => (r.byCitizenship[c] ?? 0).toFixed(1)).join(" | ")} |`);
  }
  lines.push(``);

  lines.push(`## Acceptance summary`);
  lines.push(``);
  const allPass = reports.every(r => r.validationErrors.length === 0 && r.rowsValid === r.rowsTotal);
  lines.push(`- All five backtest years produce rows: ${reports.length === 5 ? "✅" : "❌"} (${reports.length}/5)`);
  lines.push(`- All fixture rows pass \`validateVepUniverseRow\`: ${allPass ? "✅" : "❌"}`);
  lines.push(`- Eligible / ineligible mix exercised in every year: ${reports.every(r => r.vepEligibleRows > 0 && r.vepEligibleRows < r.rowsTotal) ? "✅" : "❌"}`);
  lines.push(``);

  lines.push(`## Terminology`);
  lines.push(``);
  lines.push(`\`vepEligible\` is the population-skeleton invariant. Engagement is referenced only as a downstream concern (Phase 2.4 calibration consumes universe rows) — separate 1D continuous scalar per ADR canon, not introduced in this scaffold. Compound moral-circle terminology applies at the bridge step (Phase 2.7.5), not here. Legacy code identifiers (\`PWGTP\`, \`RAC1P\`, \`SCHL\` etc.) are referenced only as PUMS column names in comments.`);
  return lines.join("\n");
}

async function main() {
  const allRows = buildFixtureRows();
  const byYear = new Map<VepBacktestYear, VepUniverseRow[]>();
  for (const r of allRows) {
    if (!byYear.has(r.year)) byYear.set(r.year, []);
    byYear.get(r.year)!.push(r);
  }

  const reports: YearReport[] = [];
  for (const year of [2008, 2012, 2016, 2020, 2024] as VepBacktestYear[]) {
    const rows = byYear.get(year) ?? [];
    if (rows.length === 0) {
      throw new Error(`smoke fixture missing rows for year ${year}`);
    }
    const r = reportYear(rows);
    reports.push(r);
    console.log(`\n=== ${year} ===`);
    console.log(`  rows=${r.rowsTotal} valid=${r.rowsValid} eligibleRows=${r.vepEligibleRows}`);
    console.log(`  Σ weight=${r.weightedTotal.toFixed(1)} Σ vepEligible weight=${r.weightedVepEligible.toFixed(1)} (${pct(r.vepEligibleShare)})`);
    if (r.validationErrors.length > 0) {
      console.log(`  validation errors: ${r.validationErrors.length}`);
      for (const e of r.validationErrors) console.log(`    ${e.respondentId}: ${e.errors.join("; ")}`);
    }
  }

  // Final invariants — every fixture row must validate; every year must have
  // both eligible and ineligible rows so we know the validator's eligibility
  // path was exercised.
  const allValid = reports.every(r => r.rowsValid === r.rowsTotal);
  const eligibleMixOk = reports.every(r => r.vepEligibleRows > 0 && r.vepEligibleRows < r.rowsTotal);

  // Spot-check the ageToBucket helper across the whole bucket span.
  const bucketSpotCheck = [
    { age: 18, expected: "18-24" }, { age: 24, expected: "18-24" },
    { age: 25, expected: "25-34" }, { age: 34, expected: "25-34" },
    { age: 35, expected: "35-44" }, { age: 44, expected: "35-44" },
    { age: 45, expected: "45-54" }, { age: 54, expected: "45-54" },
    { age: 55, expected: "55-64" }, { age: 64, expected: "55-64" },
    { age: 65, expected: "65-74" }, { age: 74, expected: "65-74" },
    { age: 75, expected: "75+" },   { age: 95, expected: "75+" },
  ].map(c => ({ ...c, actual: ageToBucket(c.age) }));
  const bucketsOk = bucketSpotCheck.every(c => c.actual === c.expected);

  // Spot-check that ageToBucket throws on invalid input.
  let throwsOnInvalid = false;
  try {
    ageToBucket(15);
  } catch (e) {
    if (e instanceof RangeError) throwsOnInvalid = true;
  }

  // Spot-check validator catches a deliberately bad row.
  const badRow: VepUniverseRow = {
    respondentId: "BAD-1",
    year: 2016,
    state: "CA",
    age: 17,
    ageBucket: "18-24",
    sex: "female",
    race: "white",
    hispanic: false,
    education: "less_than_hs",
    incomeBucket: null,
    citizenship: "us_born",
    vepEligible: true, // contradicts age=17
    personWeight: -1,  // invalid
    sourceDataset: "",
    sourceVintage: "",
    uncertainty: "high",
  };
  const badRowErrs = validateVepUniverseRow(badRow);
  const validatorCatchesBadRow = badRowErrs.length >= 4; // age, weight, dataset, vintage at minimum

  const outDir = path.join(process.cwd(), "results/electorate/synthetic-electorate");
  await fs.mkdir(outDir, { recursive: true });
  const out = {
    schema_version: "v0",
    generator: "src/electorate/vepUniverseLoaderSmoke.ts",
    runAt: new Date().toISOString(),
    fixture_size: { perYear: 6, totalYears: 5 },
    invariants: {
      allRowsValid: allValid,
      eligibleMixExercisedAllYears: eligibleMixOk,
      ageToBucketSpotCheckPasses: bucketsOk,
      ageToBucketThrowsOnInvalid: throwsOnInvalid,
      validatorCatchesDeliberatelyBadRow: validatorCatchesBadRow,
    },
    bucketSpotCheck,
    reports,
  };
  await fs.writeFile(path.join(outDir, "vep-universe-loader-smoke.json"), JSON.stringify(out, null, 2));
  await fs.writeFile(path.join(outDir, "vep-universe-loader-smoke.md"), renderMd(reports));

  console.log(`\nWrote ${path.join(outDir, "vep-universe-loader-smoke.json")}`);
  console.log(`Wrote ${path.join(outDir, "vep-universe-loader-smoke.md")}`);

  const overallPass = allValid && eligibleMixOk && bucketsOk && throwsOnInvalid && validatorCatchesBadRow;
  console.log(`\nOVERALL: ${overallPass ? "✅ ALL PASS" : "❌ FAILED"}`);
  if (!overallPass) process.exitCode = 1;
}

main().catch(err => { console.error(err); process.exit(1); });
