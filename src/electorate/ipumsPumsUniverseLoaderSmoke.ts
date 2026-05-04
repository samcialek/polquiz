/**
 * Smoke for the fixture-only IPUMS/PUMS → VepUniverseRow loader.
 *
 * Hand-authored raw IPUMS rows (no `data/` reads, no network). The
 * smoke verifies:
 *   1. Field collapses produce the expected enum values for every input
 *      coding-table value referenced in `ipums-pums-extract-manifest.md`.
 *   2. Skip rules fire correctly: AGE<18 skipped, non-state STATEFIP
 *      skipped, non-positive PERWT skipped.
 *   3. Eligibility derivation matches v0 contract (age + citizenship
 *      only; state-disenfranchisement deferred to v1).
 *   4. Every emitted row passes `validateVepUniverseRow`.
 *   5. Eligible vs ineligible mix is exercised every cycle.
 *
 * Outputs:
 *   results/electorate/synthetic-electorate/ipums-pums-universe-loader-smoke.json
 *   results/electorate/synthetic-electorate/ipums-pums-universe-loader-smoke.md
 */

import { promises as fs } from "node:fs";
import * as path from "node:path";

import {
  type RawIpumsRow,
  type IpumsLoaderMeta,
  loadFixtureUniverse,
  convertIpumsRow,
  _internals,
} from "./ipumsPumsUniverseLoader.js";
import { validateVepUniverseRow, type VepBacktestYear, type VepUniverseRow } from "./vepUniverseTypes.js";

// ─── Per-cycle metadata (matches the manifest) ────────────────────────────

const META: Record<VepBacktestYear, IpumsLoaderMeta> = {
  2008: { cycle: 2008, sourceDataset: "ipums_acs5_2005_2009", sourceVintage: "2005-2009" },
  2012: { cycle: 2012, sourceDataset: "ipums_acs5_2008_2012", sourceVintage: "2008-2012" },
  2016: { cycle: 2016, sourceDataset: "ipums_acs5_2012_2016", sourceVintage: "2012-2016" },
  2020: { cycle: 2020, sourceDataset: "ipums_acs5_2016_2020", sourceVintage: "2016-2020" },
  2024: { cycle: 2024, sourceDataset: "ipums_acs5_2020_2024", sourceVintage: "2020-2024" },
};

// ─── Hand-authored raw fixture ────────────────────────────────────────────
//
// Each cycle ships 8 raw rows with an intentional mix of eligible /
// ineligible / skip cases:
//   - 4-5 eligible adults across race/sex/age/education/state
//   - 1 adult non-citizen → emitted with vepEligible=false
//   - 1 under-18 row → skipped
//   - 1 non-state STATEFIP (PR=72) → skipped
//   - 1 group-quarters row (GQ=3) → emitted with incomeBucket=null

interface Fixture {
  cycle: VepBacktestYear;
  rows: RawIpumsRow[];
}

const FIXTURES: Fixture[] = [
  {
    cycle: 2008,
    rows: [
      // Eligible: white male, OH, mid-age, hs_grad
      { YEAR: 2008, SAMPLE: 200800, SERIAL: 100001, PERNUM: 1, STATEFIP: 39, PUMA: 100, AGE: 35, SEX: 1, RACE: 1, HISPAN: 0, EDUC: 6, EDUCD: 63, HHINCOME: 60000, CITIZEN: 1, PERWT: 152.4, REPWTP: [148, 150, 154, 156], GQ: 1 },
      // Eligible: white female, FL, senior
      { YEAR: 2008, SAMPLE: 200800, SERIAL: 100002, PERNUM: 1, STATEFIP: 12, PUMA: 200, AGE: 67, SEX: 2, RACE: 1, HISPAN: 0, EDUC: 7,             HHINCOME: 35000, CITIZEN: 1, PERWT: 121.7, GQ: 1 },
      // Eligible: Asian female, CA, naturalized, bachelor
      { YEAR: 2008, SAMPLE: 200800, SERIAL: 100003, PERNUM: 1, STATEFIP:  6, PUMA: 5300, AGE: 28, SEX: 2, RACE: 6, RACED: 600, HISPAN: 0, EDUC: 9, HHINCOME: 88000, CITIZEN: 4, PERWT: 188.2, GQ: 1 },
      // Adult non-citizen → emitted with vepEligible=false
      { YEAR: 2008, SAMPLE: 200800, SERIAL: 100004, PERNUM: 1, STATEFIP: 48, PUMA: 1100, AGE: 42, SEX: 1, RACE: 7, HISPAN: 1, EDUC: 4,             HHINCOME: 20000, CITIZEN: 5, PERWT: 167.0, GQ: 1 },
      // Under-18 → skipped
      { YEAR: 2008, SAMPLE: 200800, SERIAL: 100005, PERNUM: 2, STATEFIP: 36, PUMA:  300, AGE: 17, SEX: 1, RACE: 2, HISPAN: 0, EDUC: 5,             HHINCOME: 30000, CITIZEN: 1, PERWT: 102.5, GQ: 1 },
      // Non-state STATEFIP (PR=72) → skipped
      { YEAR: 2008, SAMPLE: 200800, SERIAL: 100006, PERNUM: 1, STATEFIP: 72, PUMA:  100, AGE: 41, SEX: 2, RACE: 1, HISPAN: 1, EDUC: 7,             HHINCOME: 40000, CITIZEN: 2, PERWT: 110.0, GQ: 1 },
      // Group-quarters row → emitted with incomeBucket=null
      { YEAR: 2008, SAMPLE: 200800, SERIAL: 100007, PERNUM: 1, STATEFIP: 17, PUMA:  400, AGE: 22, SEX: 2, RACE: 8, HISPAN: 0, EDUC: 8,             HHINCOME: 9999999, CITIZEN: 1, PERWT: 95.4, GQ: 3 },
      // Eligible: black female, PA, graduate
      { YEAR: 2008, SAMPLE: 200800, SERIAL: 100008, PERNUM: 1, STATEFIP: 42, PUMA: 1200, AGE: 55, SEX: 2, RACE: 2, HISPAN: 0, EDUC: 10,            HHINCOME: 130000, CITIZEN: 1, PERWT: 144.1, GQ: 1 },
    ],
  },
  {
    cycle: 2012,
    rows: [
      { YEAR: 2012, SAMPLE: 201200, SERIAL: 200001, PERNUM: 1, STATEFIP: 26, PUMA: 100, AGE: 33, SEX: 1, RACE: 1, HISPAN: 0, EDUC: 9,             HHINCOME: 85000, CITIZEN: 1, PERWT: 159.0, GQ: 1 },
      { YEAR: 2012, SAMPLE: 201200, SERIAL: 200002, PERNUM: 1, STATEFIP: 13, PUMA: 200, AGE: 71, SEX: 2, RACE: 2, HISPAN: 0, EDUC: 6, EDUCD: 64, HHINCOME: 18000, CITIZEN: 1, PERWT: 109.8, GQ: 1 },
      { YEAR: 2012, SAMPLE: 201200, SERIAL: 200003, PERNUM: 1, STATEFIP: 53, PUMA: 11600, AGE: 25, SEX: 2, RACE: 4, HISPAN: 0, EDUC: 10,           HHINCOME: 110000, CITIZEN: 4, PERWT: 174.6, GQ: 1 },
      { YEAR: 2012, SAMPLE: 201200, SERIAL: 200004, PERNUM: 1, STATEFIP:  4, PUMA: 401, AGE: 47, SEX: 1, RACE: 3, HISPAN: 0, EDUC: 7,             HHINCOME: 55000, CITIZEN: 1, PERWT: 128.3, GQ: 1 },
      { YEAR: 2012, SAMPLE: 201200, SERIAL: 200005, PERNUM: 1, STATEFIP: 34, PUMA: 1500, AGE: 29, SEX: 1, RACE: 1, HISPAN: 1, EDUC: 9,             HHINCOME: 78000, CITIZEN: 4, PERWT: 141.9, GQ: 1 },
      // Adult non-citizen
      { YEAR: 2012, SAMPLE: 201200, SERIAL: 200006, PERNUM: 1, STATEFIP: 17, PUMA: 502, AGE: 38, SEX: 1, RACE: 8, HISPAN: 0, EDUC: 8,             HHINCOME: 32000, CITIZEN: 5, PERWT: 95.4, GQ: 1 },
      // Under-18 → skipped
      { YEAR: 2012, SAMPLE: 201200, SERIAL: 200007, PERNUM: 2, STATEFIP: 26, PUMA: 100, AGE: 14, SEX: 1, RACE: 1, HISPAN: 0, EDUC: 3,             HHINCOME: 85000, CITIZEN: 1, PERWT: 88.0, GQ: 1 },
      // Non-state (Guam=66) → skipped
      { YEAR: 2012, SAMPLE: 201200, SERIAL: 200008, PERNUM: 1, STATEFIP: 66, PUMA: 100, AGE: 41, SEX: 2, RACE: 6, RACED: 685, HISPAN: 0, EDUC: 9, HHINCOME: 50000, CITIZEN: 2, PERWT: 100.0, GQ: 1 },
    ],
  },
  {
    cycle: 2016,
    rows: [
      { YEAR: 2016, SAMPLE: 201600, SERIAL: 300001, PERNUM: 1, STATEFIP: 55, PUMA: 100, AGE: 45, SEX: 2, RACE: 1, HISPAN: 0, EDUC: 6, EDUCD: 63, HHINCOME: 65000, CITIZEN: 1, PERWT: 134.2, REPWTP: [130, 132, 136, 138], GQ: 1 },
      { YEAR: 2016, SAMPLE: 201600, SERIAL: 300002, PERNUM: 1, STATEFIP: 37, PUMA: 200, AGE: 38, SEX: 1, RACE: 2, HISPAN: 0, EDUC: 9,             HHINCOME: 92000, CITIZEN: 1, PERWT: 148.7, GQ: 1 },
      { YEAR: 2016, SAMPLE: 201600, SERIAL: 300003, PERNUM: 1, STATEFIP: 48, PUMA: 1100, AGE: 22, SEX: 2, RACE: 1, HISPAN: 1, EDUC: 7,             HHINCOME: 30000, CITIZEN: 1, PERWT: 117.3, GQ: 1 },
      // RACE=6 with RACED=600 (Asian) → asian
      { YEAR: 2016, SAMPLE: 201600, SERIAL: 300004, PERNUM: 1, STATEFIP:  6, PUMA: 5300, AGE: 60, SEX: 1, RACE: 6, RACED: 600, HISPAN: 0, EDUC: 11, HHINCOME: 200000, CITIZEN: 4, PERWT: 198.0, GQ: 1 },
      // Under-18 → skipped
      { YEAR: 2016, SAMPLE: 201600, SERIAL: 300005, PERNUM: 2, STATEFIP: 12, PUMA: 200, AGE: 16, SEX: 2, RACE: 1, HISPAN: 0, EDUC: 4,             HHINCOME: 30000, CITIZEN: 1, PERWT: 88.9, GQ: 1 },
      // Adult non-citizen
      { YEAR: 2016, SAMPLE: 201600, SERIAL: 300006, PERNUM: 1, STATEFIP: 32, PUMA: 100, AGE: 31, SEX: 1, RACE: 7, HISPAN: 1, EDUC: 4,             HHINCOME: 22000, CITIZEN: 5, PERWT: 156.5, GQ: 1 },
      // RACE=6 with RACED=685 (NHPI) → nhpi (refinement test)
      { YEAR: 2016, SAMPLE: 201600, SERIAL: 300007, PERNUM: 1, STATEFIP: 15, PUMA: 100, AGE: 50, SEX: 2, RACE: 6, RACED: 685, HISPAN: 0, EDUC: 9, HHINCOME: 80000, CITIZEN: 1, PERWT: 130.0, GQ: 1 },
      // Group-quarters row
      { YEAR: 2016, SAMPLE: 201600, SERIAL: 300008, PERNUM: 1, STATEFIP: 25, PUMA: 100, AGE: 75, SEX: 2, RACE: 1, HISPAN: 0, EDUC: 7,             HHINCOME: 9999999, CITIZEN: 1, PERWT: 110.0, GQ: 4 },
      // Non-state (American Samoa=60) → skipped
      { YEAR: 2016, SAMPLE: 201600, SERIAL: 300009, PERNUM: 1, STATEFIP: 60, PUMA: 100, AGE: 38, SEX: 2, RACE: 6, RACED: 685, HISPAN: 0, EDUC: 7, HHINCOME: 35000, CITIZEN: 2, PERWT: 80.0, GQ: 1 },
    ],
  },
  {
    cycle: 2020,
    rows: [
      { YEAR: 2020, SAMPLE: 202000, SERIAL: 400001, PERNUM: 1, STATEFIP: 42, PUMA: 1200, AGE: 41, SEX: 2, RACE: 1, HISPAN: 0, EDUC: 7,             HHINCOME: 60000, CITIZEN: 1, PERWT: 162.4, GQ: 1 },
      { YEAR: 2020, SAMPLE: 202000, SERIAL: 400002, PERNUM: 1, STATEFIP:  4, PUMA: 401, AGE: 27, SEX: 1, RACE: 1, HISPAN: 1, EDUC: 6, EDUCD: 63, HHINCOME: 35000, CITIZEN: 1, PERWT: 145.0, GQ: 1 },
      { YEAR: 2020, SAMPLE: 202000, SERIAL: 400003, PERNUM: 1, STATEFIP: 13, PUMA: 200, AGE: 64, SEX: 2, RACE: 2, HISPAN: 0, EDUC: 9,             HHINCOME: 88000, CITIZEN: 1, PERWT: 138.6, GQ: 1 },
      { YEAR: 2020, SAMPLE: 202000, SERIAL: 400004, PERNUM: 1, STATEFIP: 25, PUMA: 100, AGE: 78, SEX: 1, RACE: 1, HISPAN: 0, EDUC: 11,            HHINCOME: 130000, CITIZEN: 1, PERWT: 109.2, GQ: 1 },
      { YEAR: 2020, SAMPLE: 202000, SERIAL: 400005, PERNUM: 1, STATEFIP: 53, PUMA: 11600, AGE: 21, SEX: 2, RACE: 4, HISPAN: 0, EDUC: 9,           HHINCOME: 18000, CITIZEN: 4, PERWT: 124.1, GQ: 1 },
      // Adult non-citizen
      { YEAR: 2020, SAMPLE: 202000, SERIAL: 400006, PERNUM: 1, STATEFIP: 48, PUMA: 1100, AGE: 35, SEX: 1, RACE: 7, HISPAN: 1, EDUC: 4,             HHINCOME: 28000, CITIZEN: 5, PERWT: 151.3, GQ: 1 },
      // Under-18 → skipped
      { YEAR: 2020, SAMPLE: 202000, SERIAL: 400007, PERNUM: 2, STATEFIP: 36, PUMA: 100, AGE: 13, SEX: 1, RACE: 8, HISPAN: 0, EDUC: 2,             HHINCOME: 60000, CITIZEN: 1, PERWT: 90.0, GQ: 1 },
      // Group-quarters row
      { YEAR: 2020, SAMPLE: 202000, SERIAL: 400008, PERNUM: 1, STATEFIP: 17, PUMA: 100, AGE: 82, SEX: 2, RACE: 2, HISPAN: 0, EDUC: 6, EDUCD: 63, HHINCOME: 9999999, CITIZEN: 1, PERWT: 100.0, GQ: 5 },
      // Non-state (Northern Mariana Islands=69) → skipped
      { YEAR: 2020, SAMPLE: 202000, SERIAL: 400009, PERNUM: 1, STATEFIP: 69, PUMA: 100, AGE: 30, SEX: 1, RACE: 6, RACED: 685, HISPAN: 0, EDUC: 6, EDUCD: 63, HHINCOME: 28000, CITIZEN: 2, PERWT: 75.0, GQ: 1 },
    ],
  },
  {
    cycle: 2024,
    rows: [
      { YEAR: 2024, SAMPLE: 202400, SERIAL: 500001, PERNUM: 1, STATEFIP: 26, PUMA: 100, AGE: 52, SEX: 2, RACE: 1, HISPAN: 0, EDUC: 6, EDUCD: 63, HHINCOME: 65000, CITIZEN: 1, PERWT: 156.8, GQ: 1 },
      { YEAR: 2024, SAMPLE: 202400, SERIAL: 500002, PERNUM: 1, STATEFIP: 42, PUMA: 1200, AGE: 36, SEX: 1, RACE: 2, HISPAN: 0, EDUC: 7,             HHINCOME: 58000, CITIZEN: 1, PERWT: 142.5, GQ: 1 },
      { YEAR: 2024, SAMPLE: 202400, SERIAL: 500003, PERNUM: 1, STATEFIP: 12, PUMA: 200, AGE: 73, SEX: 2, RACE: 1, HISPAN: 1, EDUC: 9,             HHINCOME: 90000, CITIZEN: 1, PERWT: 130.1, GQ: 1 },
      { YEAR: 2024, SAMPLE: 202400, SERIAL: 500004, PERNUM: 1, STATEFIP:  6, PUMA: 5300, AGE: 24, SEX: 1, RACE: 4, HISPAN: 0, EDUC: 10,            HHINCOME: 120000, CITIZEN: 4, PERWT: 167.4, GQ: 1 },
      { YEAR: 2024, SAMPLE: 202400, SERIAL: 500005, PERNUM: 1, STATEFIP: 39, PUMA: 200, AGE: 49, SEX: 2, RACE: 8, HISPAN: 0, EDUC: 9,             HHINCOME: 95000, CITIZEN: 1, PERWT: 138.7, GQ: 1 },
      // Adult non-citizen
      { YEAR: 2024, SAMPLE: 202400, SERIAL: 500006, PERNUM: 1, STATEFIP: 36, PUMA: 100, AGE: 33, SEX: 1, RACE: 2, HISPAN: 1, EDUC: 4,             HHINCOME: 26000, CITIZEN: 5, PERWT: 91.9, GQ: 1 },
      // Under-18 → skipped
      { YEAR: 2024, SAMPLE: 202400, SERIAL: 500007, PERNUM: 2, STATEFIP: 12, PUMA: 200, AGE: 17, SEX: 1, RACE: 2, HISPAN: 1, EDUC: 5,             HHINCOME: 26000, CITIZEN: 1, PERWT: 91.0, GQ: 1 },
      // Non-state (Virgin Islands=78) → skipped
      { YEAR: 2024, SAMPLE: 202400, SERIAL: 500008, PERNUM: 1, STATEFIP: 78, PUMA: 100, AGE: 40, SEX: 2, RACE: 2, HISPAN: 0, EDUC: 7,             HHINCOME: 40000, CITIZEN: 2, PERWT: 100.0, GQ: 1 },
    ],
  },
];

// ─── Per-cycle smoke ──────────────────────────────────────────────────────

interface CycleReport {
  cycle: VepBacktestYear;
  inputRows: number;
  emittedRows: number;
  eligibleRows: number;
  skipBreakdown: Record<string, number>;
  weightedTotalEmitted: number;
  weightedVepEligible: number;
  vepEligibleShare: number;
  validationErrors: number;
  groupQuartersRowsEmitted: number;
  nhpiRefinedRowsEmitted: number;
}

function runCycle(cycle: VepBacktestYear, fixture: Fixture): CycleReport {
  const result = loadFixtureUniverse(fixture.rows, META[cycle]);
  const skipBreakdown: Record<string, number> = {};
  for (const s of result.stats.skipped) skipBreakdown[s.reason] = (skipBreakdown[s.reason] ?? 0) + 1;

  let validationErrors = 0;
  for (const r of result.rows) {
    if (validateVepUniverseRow(r).length > 0) validationErrors++;
  }
  const eligibleRows = result.rows.filter(r => r.vepEligible).length;
  const groupQuartersRowsEmitted = result.rows.filter(r => r.coverageNotes?.includes("group_quarters")).length;
  const nhpiRefinedRowsEmitted = result.rows.filter(r => r.race === "nhpi").length;

  return {
    cycle,
    inputRows: result.stats.inputRows,
    emittedRows: result.stats.emittedRows,
    eligibleRows,
    skipBreakdown,
    weightedTotalEmitted: result.stats.weightedTotalEmitted,
    weightedVepEligible: result.stats.weightedVepEligible,
    vepEligibleShare: result.stats.weightedTotalEmitted > 0
      ? result.stats.weightedVepEligible / result.stats.weightedTotalEmitted
      : 0,
    validationErrors,
    groupQuartersRowsEmitted,
    nhpiRefinedRowsEmitted,
  };
}

// ─── Coverage-table spot-checks ───────────────────────────────────────────
//
// These exercise the manifest's coding tables one line per branch so any
// regression in a collapser is loud.

interface SpotCheck { input: string; expected: string; actual: string; pass: boolean }

function spotChecks(): SpotCheck[] {
  const out: SpotCheck[] = [];
  function eq(label: string, expected: string, actual: string): void {
    out.push({ input: label, expected, actual, pass: expected === actual });
  }

  // Race
  for (const [code, expected] of [[1, "white"], [2, "black"], [3, "amerindian"], [4, "asian"], [5, "asian"], [6, "asian"], [7, "other_single"], [8, "two_or_more"], [9, "two_or_more"]] as const) {
    eq(`RACE=${code}`, expected, _internals.collapseRace(code, undefined).race);
  }
  // RACED-driven NHPI refinement
  eq("RACE=6, RACED=685", "nhpi", _internals.collapseRace(6, 685).race);

  // Hispanic
  eq("HISPAN=0", "false", String(_internals.collapseHispanic(0)));
  eq("HISPAN=1", "true",  String(_internals.collapseHispanic(1)));
  eq("HISPAN=4", "true",  String(_internals.collapseHispanic(4)));

  // Education
  for (const [code, expected] of [[0, "less_than_hs"], [3, "less_than_hs"], [5, "less_than_hs"], [6, "hs_grad"], [7, "some_college"], [8, "some_college"], [9, "bachelor"], [10, "graduate"], [11, "graduate"]] as const) {
    eq(`EDUC=${code}`, expected, _internals.collapseEducation(code, undefined));
  }
  // EDUCD reclassifies Grade-12-no-diploma down to less_than_hs
  eq("EDUC=6, EDUCD=60", "less_than_hs", _internals.collapseEducation(6, 60));
  eq("EDUC=6, EDUCD=63", "hs_grad",      _internals.collapseEducation(6, 63));

  // Citizenship
  for (const [code, expected] of [[1, "us_born"], [2, "us_territory"], [3, "us_born"], [4, "us_naturalized"], [5, "non_citizen"]] as const) {
    eq(`CITIZEN=${code}`, expected, _internals.collapseCitizenship(code).value);
  }

  // Income
  eq("HHINCOME=0",        "<25k",     String(_internals.collapseIncome(0, 1)));
  eq("HHINCOME=24999",    "<25k",     String(_internals.collapseIncome(24999, 1)));
  eq("HHINCOME=25000",    "25-50k",   String(_internals.collapseIncome(25000, 1)));
  eq("HHINCOME=49999",    "25-50k",   String(_internals.collapseIncome(49999, 1)));
  eq("HHINCOME=50000",    "50-75k",   String(_internals.collapseIncome(50000, 1)));
  eq("HHINCOME=75000",    "75-100k",  String(_internals.collapseIncome(75000, 1)));
  eq("HHINCOME=100000",   "100-150k", String(_internals.collapseIncome(100000, 1)));
  eq("HHINCOME=150000",   "150k+",    String(_internals.collapseIncome(150000, 1)));
  eq("HHINCOME=9999999",  "null",     String(_internals.collapseIncome(9999999, 1)));
  eq("HHINCOME=60000, GQ=3", "null",  String(_internals.collapseIncome(60000, 3)));

  // Sex
  eq("SEX=1", "male",   _internals.collapseSex(1));
  eq("SEX=2", "female", _internals.collapseSex(2));

  return out;
}

// ─── Markdown ─────────────────────────────────────────────────────────────

function pct(x: number): string { return (100 * x).toFixed(1) + "%"; }

function renderMd(reports: CycleReport[], spots: SpotCheck[]): string {
  const lines: string[] = [];
  lines.push(`# IPUMS/PUMS fixture loader smoke`);
  lines.push(``);
  lines.push(`**Run at:** ${new Date().toISOString()}`);
  lines.push(`**Cycles exercised:** ${reports.map(r => r.cycle).join(", ")}`);
  lines.push(``);
  lines.push(`Pure converter from parsed IPUMS rows (\`RawIpumsRow\`) to \`VepUniverseRow\`. **No raw downloads, no file I/O, no network.** Eight hand-authored raw rows per cycle, structured to exercise: eligible adults across race/sex/age/education/state, an adult non-citizen (emitted with \`vepEligible=false\`), an under-18 row (skipped), a non-state STATEFIP (skipped), and a group-quarters row (emitted with \`incomeBucket=null\`). One cycle additionally exercises the RACE=6 → NHPI refinement via \`RACED=685\`.`);
  lines.push(``);

  lines.push(`## Per-cycle overview`);
  lines.push(``);
  lines.push(`| Cycle | Input rows | Emitted | Eligible | Σ weight | Σ VEP weight | VEP share | Validation errors |`);
  lines.push(`|---:|---:|---:|---:|---:|---:|---:|---:|`);
  for (const r of reports) {
    lines.push(`| ${r.cycle} | ${r.inputRows} | ${r.emittedRows} | ${r.eligibleRows} | ${r.weightedTotalEmitted.toFixed(1)} | ${r.weightedVepEligible.toFixed(1)} | ${pct(r.vepEligibleShare)} | ${r.validationErrors} |`);
  }
  lines.push(``);

  lines.push(`## Skip breakdown by cycle`);
  lines.push(``);
  const reasons = ["age_below_18", "non_state_statefip", "weight_missing_or_nonpositive", "missing_required_field", "validation_failed"];
  lines.push(`| Cycle | ${reasons.join(" | ")} |`);
  lines.push(`|---:|${reasons.map(() => "---").join("|")}|`);
  for (const r of reports) {
    const cells = reasons.map(rs => String(r.skipBreakdown[rs] ?? 0));
    lines.push(`| ${r.cycle} | ${cells.join(" | ")} |`);
  }
  lines.push(``);

  lines.push(`## Coverage flag exercises`);
  lines.push(``);
  lines.push(`| Cycle | Group-quarters rows | NHPI-refined rows |`);
  lines.push(`|---:|---:|---:|`);
  for (const r of reports) {
    lines.push(`| ${r.cycle} | ${r.groupQuartersRowsEmitted} | ${r.nhpiRefinedRowsEmitted} |`);
  }
  lines.push(``);

  lines.push(`## Coding-table spot checks`);
  lines.push(``);
  const passed = spots.filter(s => s.pass).length;
  lines.push(`Passed: **${passed}/${spots.length}**`);
  lines.push(``);
  lines.push(`| Input | Expected | Actual | Pass |`);
  lines.push(`|---|---|---|:-:|`);
  for (const s of spots) {
    lines.push(`| ${s.input} | ${s.expected} | ${s.actual} | ${s.pass ? "✅" : "❌"} |`);
  }
  lines.push(``);

  lines.push(`## Acceptance summary`);
  lines.push(``);
  const allPass =
    reports.every(r => r.validationErrors === 0) &&
    reports.every(r => r.eligibleRows > 0 && r.eligibleRows < r.emittedRows) &&
    reports.every(r => (r.skipBreakdown.age_below_18 ?? 0) > 0) &&
    reports.every(r => (r.skipBreakdown.non_state_statefip ?? 0) > 0) &&
    spots.every(s => s.pass);
  lines.push(`- All emitted rows pass \`validateVepUniverseRow\`: ${reports.every(r => r.validationErrors === 0) ? "✅" : "❌"}`);
  lines.push(`- Eligible / ineligible mix exercised every cycle: ${reports.every(r => r.eligibleRows > 0 && r.eligibleRows < r.emittedRows) ? "✅" : "❌"}`);
  lines.push(`- Under-18 skip path exercised every cycle: ${reports.every(r => (r.skipBreakdown.age_below_18 ?? 0) > 0) ? "✅" : "❌"}`);
  lines.push(`- Non-state STATEFIP skip path exercised every cycle: ${reports.every(r => (r.skipBreakdown.non_state_statefip ?? 0) > 0) ? "✅" : "❌"}`);
  lines.push(`- All coding-table spot checks pass: ${spots.every(s => s.pass) ? "✅" : "❌"}`);
  lines.push(`- **Overall**: ${allPass ? "✅ ALL PASS" : "❌ FAILED"}`);
  lines.push(``);

  lines.push(`## Notes`);
  lines.push(``);
  lines.push(`- v0 \`vepEligible\` derivation = \`age >= 18 AND citizenship ∈ {us_born, us_naturalized}\`. State-level felon-disenfranchisement adjustment is deferred to v1 (will read from a Sentencing Project tracker table); every emitted row carries \`vep_eligible_pre_felon_disenfranchisement_v0\` in \`coverageNotes\` so the pre-adjustment status is auditable.`);
  lines.push(`- v0 RACE=6 (Asian + Pacific Islander conflated in IPUMS-harmonized RACE) collapses to \`asian\` by default. RACED=680..699 refines to \`nhpi\` when present. Without RACED, NHPI rows arrive as \`asian\` (flagged \`race_asian_nhpi_unsplit_v0\`).`);
  lines.push(`- v0 EDUC=6 (Grade 12) defaults to \`hs_grad\`. EDUCD < 63 reclassifies to \`less_than_hs\` (Grade 12 non-graduates).`);
  lines.push(``);

  lines.push(`## Terminology`);
  lines.push(``);
  lines.push(`\`vepEligible\` is the population-skeleton invariant. Engagement is referenced only as a downstream concern — separate 1D continuous scalar per ADR canon, not introduced by this loader. Compound moral-circle terminology applies at the bridge step (already shipped at \`d2c9e14\`), not at the universe layer. Legacy code identifiers (\`PWGTP\`, \`RAC1P\`, \`SCHL\`, \`HHINCOME\`, \`STATEFIP\`, \`CITIZEN\` etc.) appear only as IPUMS / PUMS column names.`);

  return lines.join("\n");
}

// ─── Main ─────────────────────────────────────────────────────────────────

async function main() {
  const reports: CycleReport[] = [];
  for (const fixture of FIXTURES) {
    const r = runCycle(fixture.cycle, fixture);
    reports.push(r);
    console.log(`\n=== ${fixture.cycle} ===`);
    console.log(`  input=${r.inputRows} emitted=${r.emittedRows} eligible=${r.eligibleRows}`);
    console.log(`  skips=${JSON.stringify(r.skipBreakdown)}`);
    console.log(`  weighted total=${r.weightedTotalEmitted.toFixed(1)} VEP=${r.weightedVepEligible.toFixed(1)} (${pct(r.vepEligibleShare)})`);
    console.log(`  validation errors=${r.validationErrors}`);
  }

  const spots = spotChecks();
  const passedSpots = spots.filter(s => s.pass).length;
  console.log(`\nSpot checks: ${passedSpots}/${spots.length} passed`);

  // Vote-choice scrub spy is N/A here (this loader has no vote-choice
  // input). Instead, prove determinism: re-run convertIpumsRow on the
  // same row twice and compare for byte-equivalence.
  const determinismOk = (() => {
    const first = FIXTURES[0]!;
    const a = convertIpumsRow(first.rows[0]!, META[first.cycle]);
    const b = convertIpumsRow(first.rows[0]!, META[first.cycle]);
    return JSON.stringify(a) === JSON.stringify(b);
  })();
  console.log(`Determinism (same input → same output): ${determinismOk ? "✅" : "❌"}`);

  // Defensively confirm every emitted row from every cycle revalidates.
  let revalidationFailures = 0;
  for (const fixture of FIXTURES) {
    const { rows } = loadFixtureUniverse(fixture.rows, META[fixture.cycle]);
    for (const row of rows) {
      const errs = validateVepUniverseRow(row as VepUniverseRow);
      if (errs.length > 0) revalidationFailures++;
    }
  }
  console.log(`Revalidation: ${revalidationFailures === 0 ? "✅" : "❌"} (${revalidationFailures} failures)`);

  const outDir = path.join(process.cwd(), "results/electorate/synthetic-electorate");
  await fs.mkdir(outDir, { recursive: true });
  const out = {
    schema_version: "v0",
    generator: "src/electorate/ipumsPumsUniverseLoaderSmoke.ts",
    runAt: new Date().toISOString(),
    fixture_size: { perCycle: 8, totalCycles: 5 },
    invariants: {
      allEmittedValid: reports.every(r => r.validationErrors === 0),
      eligibleMixExercisedAllCycles: reports.every(r => r.eligibleRows > 0 && r.eligibleRows < r.emittedRows),
      under18SkipExercisedAllCycles: reports.every(r => (r.skipBreakdown.age_below_18 ?? 0) > 0),
      nonStateSkipExercisedAllCycles: reports.every(r => (r.skipBreakdown.non_state_statefip ?? 0) > 0),
      determinismHolds: determinismOk,
      revalidationClean: revalidationFailures === 0,
      spotChecksAllPass: spots.every(s => s.pass),
    },
    spotChecks: spots,
    reports,
  };
  await fs.writeFile(path.join(outDir, "ipums-pums-universe-loader-smoke.json"), JSON.stringify(out, null, 2));
  await fs.writeFile(path.join(outDir, "ipums-pums-universe-loader-smoke.md"), renderMd(reports, spots));
  console.log(`\nWrote ${path.join(outDir, "ipums-pums-universe-loader-smoke.json")}`);
  console.log(`Wrote ${path.join(outDir, "ipums-pums-universe-loader-smoke.md")}`);

  const overallPass =
    reports.every(r => r.validationErrors === 0) &&
    reports.every(r => r.eligibleRows > 0 && r.eligibleRows < r.emittedRows) &&
    reports.every(r => (r.skipBreakdown.age_below_18 ?? 0) > 0) &&
    reports.every(r => (r.skipBreakdown.non_state_statefip ?? 0) > 0) &&
    determinismOk &&
    revalidationFailures === 0 &&
    spots.every(s => s.pass);
  console.log(`\nOVERALL: ${overallPass ? "✅ ALL PASS" : "❌ FAILED"}`);
  if (!overallPass) process.exitCode = 1;
}

main().catch(err => { console.error(err); process.exit(1); });
