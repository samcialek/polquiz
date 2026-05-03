/**
 * Mock VEP universe — Phase 2.7c contract-test fixture.
 *
 * **THIS IS NOT REAL POPULATION DATA.** It is a tiny fixture (5–10 hand-
 * authored weighted cells per year × 5 years) used exclusively to prove
 * the synthetic-electorate bridge pipeline can produce rows conforming to
 * `syntheticElectorateContract.ts` without waiting on the real ACS/PUMS
 * acquisition tracked by `vep-universe-loader-plan.md`.
 *
 * The cells are not representative of any state's actual demographics, do
 * not aggregate to the official VEP, and must not be used for any analysis
 * other than contract-test smoke runs. Every row produced from these cells
 * carries an explicit `mock_contract_test_only: true` provenance flag and
 * `populationSource: "survey_weighted"` (the "I am NOT acs_pums or
 * ipums_pums" enum value).
 *
 * When the real PUMS loader ships (Phase 2.7 v1+ per the plan), this
 * fixture will be replaced; the bridge harness will continue to work
 * unchanged because the cell shape is stable.
 */

export const MOCK_VEP_UNIVERSE_VERSION = "v0.1-mock";

export const MOCK_DISCLAIMER =
  "MOCK CONTRACT-TEST CELLS — not real population data; do not aggregate or interpret demographically.";

/** Years the mock universe is defined for. */
export type MockYear = 2008 | 2012 | 2016 | 2020 | 2024;

/**
 * One demographic / geographic cell in the mock universe. Mirrors the
 * fields the real PUMS-derived `VepUniverseRow` will eventually carry
 * (state, ageBucket, raceEthnicity, sex, education, incomeBucket,
 * citizenVotingEligible, cellWeight) but is hand-authored, not loaded.
 */
export interface MockVepCell {
  /** Unique cell ID; format: "{year}|{state}|{ageBucket}|{race}|{sex}|{edu}|{income}". */
  cellId: string;
  year: MockYear;
  state: string;
  ageBucket: string;
  raceEthnicity: string;
  sex: string;
  education: string;
  incomeBucket: string;
  /** All cells in this fixture represent eligible adults (true by construction). */
  citizenVotingEligible: true;
  /** Plausible-looking weight for a cell of this size; arbitrary within the fixture. */
  cellWeight: number;
  /** Permanent flag: never a real population row. */
  mock_contract_test_only: true;
}

/** Hand-authored fixture: 7 cells per year × 5 years = 35 cells total. */
const CELLS_BY_YEAR: Record<MockYear, MockVepCell[]> = {
  2008: buildYearCells(2008, [
    ["CA", "30-44", "hispanic", "female", "ba_plus", "middle", 1250],
    ["TX", "45-64", "white", "male", "hs_or_less", "low", 1880],
    ["FL", "65+", "white", "female", "some_college", "middle", 1610],
    ["NY", "18-29", "black", "male", "ba_plus", "middle", 940],
    ["PA", "45-64", "white", "female", "hs_or_less", "low", 1320],
    ["OH", "30-44", "white", "male", "some_college", "middle", 1180],
    ["GA", "30-44", "black", "female", "ba_plus", "middle", 1040],
  ]),
  2012: buildYearCells(2012, [
    ["CA", "30-44", "asian", "female", "ba_plus", "high", 1110],
    ["TX", "30-44", "hispanic", "male", "some_college", "middle", 1730],
    ["FL", "65+", "white", "male", "hs_or_less", "low", 1450],
    ["NY", "45-64", "white", "female", "ba_plus", "high", 1280],
    ["PA", "18-29", "white", "female", "some_college", "low", 870],
    ["OH", "45-64", "black", "male", "hs_or_less", "low", 990],
    ["GA", "30-44", "white", "male", "ba_plus", "middle", 1090],
  ]),
  2016: buildYearCells(2016, [
    ["CA", "18-29", "hispanic", "male", "some_college", "low", 1340],
    ["TX", "65+", "white", "female", "hs_or_less", "low", 1520],
    ["FL", "45-64", "hispanic", "female", "some_college", "middle", 1190],
    ["NY", "30-44", "white", "male", "ba_plus", "high", 1020],
    ["PA", "65+", "white", "male", "hs_or_less", "middle", 1380],
    ["OH", "18-29", "white", "female", "ba_plus", "low", 760],
    ["GA", "45-64", "black", "female", "some_college", "low", 1100],
  ]),
  2020: buildYearCells(2020, [
    ["CA", "45-64", "white", "female", "ba_plus", "high", 1480],
    ["TX", "30-44", "white", "male", "ba_plus", "high", 1290],
    ["FL", "65+", "hispanic", "female", "hs_or_less", "low", 1370],
    ["NY", "18-29", "asian", "female", "ba_plus", "middle", 880],
    ["PA", "45-64", "white", "male", "some_college", "middle", 1410],
    ["OH", "65+", "white", "female", "hs_or_less", "low", 1240],
    ["GA", "30-44", "black", "male", "ba_plus", "middle", 1170],
  ]),
  2024: buildYearCells(2024, [
    ["CA", "30-44", "hispanic", "male", "some_college", "middle", 1260],
    ["TX", "18-29", "hispanic", "female", "ba_plus", "middle", 970],
    ["FL", "65+", "white", "male", "some_college", "middle", 1500],
    ["NY", "45-64", "black", "female", "ba_plus", "high", 1080],
    ["PA", "30-44", "white", "male", "hs_or_less", "low", 1130],
    ["OH", "45-64", "white", "female", "ba_plus", "middle", 1220],
    ["GA", "18-29", "black", "male", "some_college", "low", 850],
  ]),
};

function buildYearCells(
  year: MockYear,
  rows: ReadonlyArray<readonly [string, string, string, string, string, string, number]>,
): MockVepCell[] {
  return rows.map(([state, ageBucket, race, sex, education, income, weight]) => ({
    cellId: `mock|${year}|${state}|${ageBucket}|${race}|${sex}|${education}|${income}`,
    year,
    state,
    ageBucket,
    raceEthnicity: race,
    sex,
    education,
    incomeBucket: income,
    citizenVotingEligible: true,
    cellWeight: weight,
    mock_contract_test_only: true,
  }));
}

/** Get all mock cells for a year (returns a copy; do not mutate). */
export function getMockVepCells(year: MockYear): MockVepCell[] {
  return CELLS_BY_YEAR[year].slice();
}

/** Sum of cell weights for a year. */
export function totalMockWeightForYear(year: MockYear): number {
  return CELLS_BY_YEAR[year].reduce((acc, cell) => acc + cell.cellWeight, 0);
}

/** All years covered. */
export const MOCK_YEARS: readonly MockYear[] = [2008, 2012, 2016, 2020, 2024];
