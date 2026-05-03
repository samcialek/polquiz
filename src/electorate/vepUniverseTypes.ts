/**
 * VEP universe row types — Phase 2.7 scaffold.
 *
 * Typed contract for the population-skeleton row produced by the (planned)
 * `vepUniverseLoader.ts`. The loader will stream PUMS records from
 * IPUMS USA — but acquisition is gated and out of scope for this commit;
 * this file ships the type contract + validation helpers so downstream
 * code (signature-imputation bridge, smoke fixtures) can already compile
 * against the surface.
 *
 * Design source: results/electorate/synthetic-electorate/vep-universe-loader-plan.md
 *
 * What this module IS:
 *  - Pure type definitions + validation helpers.
 *  - A canonical small set of enum constants (state region, race, etc.)
 *    so the bridge / smoke can reason about values without re-deriving
 *    them from PUMS coding.
 *
 * What this module is NOT:
 *  - A loader. Streaming PUMS files lands in a separate commit that is
 *    gated on user approval to acquire ~12 GB of raw data.
 *  - A signature carrier. VEP rows describe the population skeleton;
 *    PRISM signatures arrive at the bridge step (Phase 2.7.5 owned by
 *    Terminal-2).
 *  - An MRP / raking helper. Those are companion artifacts that consume
 *    universe rows but live elsewhere.
 */

// ─── Canonical enums ───────────────────────────────────────────────────────

/** Election-cycle years currently in scope for the modern survey-era backtest. */
export type VepBacktestYear = 2008 | 2012 | 2016 | 2020 | 2024;

/** Age bucket names matching the plan. */
export type VepAgeBucket =
  | "18-24"
  | "25-34"
  | "35-44"
  | "45-54"
  | "55-64"
  | "65-74"
  | "75+";

export const VEP_AGE_BUCKETS: VepAgeBucket[] = [
  "18-24", "25-34", "35-44", "45-54", "55-64", "65-74", "75+",
];

/** PUMS does not include non-binary sex 2008-2024 5-year files. */
export type VepSex = "male" | "female";

/** Race categories collapsed from PUMS RAC1P. */
export type VepRace =
  | "white"
  | "black"
  | "amerindian"
  | "asian"
  | "nhpi"            // Native Hawaiian / Other Pacific Islander
  | "other_single"
  | "two_or_more";

/** Education categories collapsed from PUMS SCHL. */
export type VepEducation =
  | "less_than_hs"
  | "hs_grad"
  | "some_college"
  | "bachelor"
  | "graduate";

/** Household-income buckets. `null` is permitted (group quarters). */
export type VepIncomeBucket =
  | "<25k"
  | "25-50k"
  | "50-75k"
  | "75-100k"
  | "100-150k"
  | "150k+";

/** Citizenship categories collapsed from PUMS CIT. */
export type VepCitizenship =
  | "us_born"
  | "us_naturalized"
  | "us_territory"
  | "non_citizen";

/** Citizenship values that count as voting-eligible (subject to the age + felon-disenfranchisement gates). */
export const VEP_ELIGIBLE_CITIZENSHIP: ReadonlySet<VepCitizenship> = new Set(["us_born", "us_naturalized"]);

/** 4-region collapse used by the bridge's backoff path. */
export type CensusRegion = "Northeast" | "Midwest" | "South" | "West";

/** Map of US state abbreviations (50 + DC) to their Census region. */
export const STATE_TO_REGION: Readonly<Record<string, CensusRegion>> = {
  CT: "Northeast", ME: "Northeast", MA: "Northeast", NH: "Northeast", RI: "Northeast", VT: "Northeast",
  NJ: "Northeast", NY: "Northeast", PA: "Northeast",
  IL: "Midwest", IN: "Midwest", MI: "Midwest", OH: "Midwest", WI: "Midwest",
  IA: "Midwest", KS: "Midwest", MN: "Midwest", MO: "Midwest", NE: "Midwest", ND: "Midwest", SD: "Midwest",
  DE: "South", DC: "South", FL: "South", GA: "South", MD: "South", NC: "South", SC: "South", VA: "South", WV: "South",
  AL: "South", KY: "South", MS: "South", TN: "South",
  AR: "South", LA: "South", OK: "South", TX: "South",
  AZ: "West", CO: "West", ID: "West", MT: "West", NV: "West", NM: "West", UT: "West", WY: "West",
  AK: "West", CA: "West", HI: "West", OR: "West", WA: "West",
};

/** Per-row uncertainty class (mirrors the bridge plan's vocabulary). */
export type VepUncertainty = "low" | "medium" | "high";

/** Set of acceptable backtest years for runtime validation. */
export const VEP_BACKTEST_YEARS: ReadonlySet<number> = new Set([2008, 2012, 2016, 2020, 2024]);

// ─── Row schema ────────────────────────────────────────────────────────────

/**
 * One row of the VEP population skeleton — represents either a PUMS
 * respondent (rowKind="microdata") or an aggregated demographic cell
 * (rowKind="cell"). v1 loader emits microdata rows; aggregated cells are
 * for downstream consumers that prefer cell-level marginals (e.g., MRP
 * companion).
 *
 * Invariants (enforced by `validateVepUniverseRow`):
 *  - `personWeight` is finite and > 0.
 *  - `year` is one of the five backtest years.
 *  - `state` is a non-empty string (typically 2-letter abbrev).
 *  - `sourceDataset` and `sourceVintage` are non-empty strings.
 *  - When `vepEligible === true`, `age >= 18` and `citizenship ∈
 *    {us_born, us_naturalized}`. (Felon-disenfranchisement extra
 *    gating is applied by the loader; we do not re-enforce it here.)
 *  - `replicateWeights` (when present) is an array of finite numbers.
 */
export interface VepUniverseRow {
  /** Unique row id. PUMS form: `"PUMS-{vintage}-{state}-{serial}-{sporder}"`. */
  respondentId: string;
  /** Election cycle the row represents. */
  year: VepBacktestYear;
  /** State abbrev (50 + DC). Loader normalizes from PUMS STATE FIPS. */
  state: string;
  /** PUMA (~100K-pop sub-state geography). Optional for cell rows. */
  puma?: string;
  /** Integer age. Top-coded at 95 by PUMS. */
  age: number;
  /** Bucketed age (matches VepAgeBucket). */
  ageBucket: VepAgeBucket;
  /** PUMS does not include non-binary sex 2008-2024 5-year files. */
  sex: VepSex;
  /** Collapsed race category. */
  race: VepRace;
  /** Hispanic/Latino origin (any race). */
  hispanic: boolean;
  /** Collapsed education category. */
  education: VepEducation;
  /** Household income bucket; `null` for group quarters. */
  incomeBucket: VepIncomeBucket | null;
  /** Citizenship category. */
  citizenship: VepCitizenship;
  /**
   * Voting-eligible-citizen flag: true iff citizenship ∈
   * {us_born, us_naturalized} AND age >= 18 AND not state-disenfranchised
   * (felon-disenfranchisement adjustment applied by the loader).
   */
  vepEligible: boolean;
  /** Population weight. PUMS PWGTP. Finite and > 0. */
  personWeight: number;
  /**
   * Replicate weights for variance estimation (PUMS PWGTP1..PWGTP80).
   * Optional; loader may omit on cell rows. When present, must contain
   * finite numbers.
   */
  replicateWeights?: number[];
  /** ACS / IPUMS dataset descriptor (e.g. `"acs5_2014_2018"`). */
  sourceDataset: string;
  /** Vintage span (e.g. `"2014-2018"`). */
  sourceVintage: string;
  /** Free-form coverage flags carried through from loader. */
  coverageNotes?: string[];
  /** Per-row uncertainty class. */
  uncertainty: VepUncertainty;
}

// ─── Validation ────────────────────────────────────────────────────────────

/** Runtime check: is `value` one of the canonical age buckets? */
export function isVepAgeBucket(value: unknown): value is VepAgeBucket {
  return typeof value === "string" && (VEP_AGE_BUCKETS as readonly string[]).includes(value);
}

/** Map an integer age to its canonical age bucket. Throws on age < 18. */
export function ageToBucket(age: number): VepAgeBucket {
  if (!Number.isFinite(age) || age < 18) {
    throw new RangeError(`ageToBucket: age must be a finite number >= 18 (got ${age})`);
  }
  if (age < 25) return "18-24";
  if (age < 35) return "25-34";
  if (age < 45) return "35-44";
  if (age < 55) return "45-54";
  if (age < 65) return "55-64";
  if (age < 75) return "65-74";
  return "75+";
}

/**
 * Validate a single VEP universe row. Returns an array of human-readable
 * error strings; empty array means the row is valid.
 *
 * The validator enforces the invariants from the design plan plus the
 * eligibility derivation contract: `vepEligible === true` requires
 * `age >= 18` and `citizenship ∈ VEP_ELIGIBLE_CITIZENSHIP`.
 */
export function validateVepUniverseRow(row: VepUniverseRow): string[] {
  const errors: string[] = [];

  if (!row.respondentId || typeof row.respondentId !== "string") errors.push("respondentId required");
  if (!VEP_BACKTEST_YEARS.has(row.year)) errors.push(`year must be one of {2008, 2012, 2016, 2020, 2024} (got ${row.year})`);
  if (!row.state || typeof row.state !== "string") errors.push("state required");
  if (!row.sourceDataset || typeof row.sourceDataset !== "string") errors.push("sourceDataset required");
  if (!row.sourceVintage || typeof row.sourceVintage !== "string") errors.push("sourceVintage required");

  if (!Number.isFinite(row.age)) errors.push(`age must be finite (got ${row.age})`);
  if (!isVepAgeBucket(row.ageBucket)) errors.push(`ageBucket invalid (got ${String(row.ageBucket)})`);

  if (!Number.isFinite(row.personWeight)) errors.push(`personWeight must be finite (got ${row.personWeight})`);
  else if (row.personWeight <= 0) errors.push(`personWeight must be > 0 (got ${row.personWeight})`);

  if (row.replicateWeights !== undefined) {
    if (!Array.isArray(row.replicateWeights)) {
      errors.push(`replicateWeights must be an array when present`);
    } else {
      for (let i = 0; i < row.replicateWeights.length; i++) {
        const v = row.replicateWeights[i];
        if (!Number.isFinite(v)) {
          errors.push(`replicateWeights[${i}] must be finite (got ${v})`);
          break; // one error is enough for the list
        }
      }
    }
  }

  if (row.vepEligible === true) {
    if (!Number.isFinite(row.age) || row.age < 18) {
      errors.push(`vepEligible=true requires age >= 18 (got ${row.age})`);
    }
    if (!VEP_ELIGIBLE_CITIZENSHIP.has(row.citizenship)) {
      errors.push(`vepEligible=true requires citizenship ∈ {us_born, us_naturalized} (got "${row.citizenship}")`);
    }
  }

  return errors;
}

/** Validate a batch; returns rows-with-errors keyed by index for easy reporting. */
export function validateVepUniverseRows(rows: readonly VepUniverseRow[]): Map<number, string[]> {
  const out = new Map<number, string[]>();
  rows.forEach((row, idx) => {
    const errs = validateVepUniverseRow(row);
    if (errs.length > 0) out.set(idx, errs);
  });
  return out;
}

// ─── Loader / aggregation surface (forward declarations only) ─────────────

/**
 * Options for the (planned) PUMS streamer. v1 implementation lands in a
 * separate commit; the type lives here so the bridge code can compile
 * against the same surface.
 */
export interface VepUniverseLoaderOptions {
  year: VepBacktestYear;
  /** Path to PUMS .dat / .dat.gz on disk. */
  filePath: string;
  /** Smoke-test gate: process at most this many rows. `null` = all. */
  rowLimit?: number | null;
  /** Optional state filter (FIPS or 2-letter). */
  states?: string[];
  /** Inclusive minimum age for the universe. Defaults to 18 (VEP assumption). */
  ageMin?: number;
}

/**
 * Aggregate counters returned by the loader's smoke. Mirrors the
 * `LoaderInventoryStats` pattern from `cesBacktestLoader.ts`.
 */
export interface VepUniverseLoaderStats {
  rowsLoaded: number;
  rowsSkipped: number;
  weightedTotalPopulation: number;
  weightedVepEligiblePopulation: number;
  weightedAgeBucketMarginals: Record<VepAgeBucket, number>;
  weightedRaceMarginals: Record<VepRace, number>;
  weightedSexMarginals: Record<VepSex, number>;
  weightedEducationMarginals: Record<VepEducation, number>;
  weightedCitizenshipMarginals: Record<VepCitizenship, number>;
  weightedStateMarginals: Record<string, number>;
}
