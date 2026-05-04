/**
 * Fixture-only IPUMS/PUMS → VepUniverseRow loader skeleton (Phase 2.7 v0).
 *
 * Pure converter from already-parsed IPUMS/PUMS rows to the
 * `VepUniverseRow` contract in `vepUniverseTypes.ts`. No file I/O; no
 * raw-data parsing; no network. The .dat / .dat.gz streamer that
 * actually consumes IPUMS extracts is gated behind user approval and
 * lands in a separate commit (per `ipums-pums-extract-manifest.md`).
 *
 * What this module IS:
 *  - The collapse logic from raw IPUMS code values (RACE 1..9, EDUC 0..11,
 *    CITIZEN 0..5, HISPAN 0..4, HHINCOME continuous, STATEFIP 1..56) into
 *    the `VepUniverseRow` enum vocabulary.
 *  - A FIPS → 2-letter state lookup table (50 + DC = 51 entries).
 *  - Skip-vs-emit policy: rows that fail the universe filters (AGE < 18,
 *    non-state STATEFIP, missing/invalid weight, missing required fields)
 *    are reported as skipped with a reason; eligible-or-not adults are
 *    emitted as rows with the appropriate `vepEligible` flag.
 *
 * What this module is NOT:
 *  - A streamer. v1 PUMS streamer is a separate commit, gated.
 *  - A raking / IPF helper. Companion artifact, separate module.
 *  - A signature carrier. Signatures attach at the bridge step (already
 *    shipped at `d2c9e14`).
 *
 * Felon-disenfranchisement adjustment is deliberately deferred. v0
 * sets `vepEligible` from age + citizenship only, with a coverageNote
 * documenting that state-level disenfranchisement is a v1 concern
 * sourced from the Sentencing Project tracker.
 */

import {
  STATE_TO_REGION,
  ageToBucket,
  validateVepUniverseRow,
  type VepBacktestYear,
  type VepCitizenship,
  type VepEducation,
  type VepIncomeBucket,
  type VepRace,
  type VepSex,
  type VepUniverseRow,
} from "./vepUniverseTypes.js";

// ─── Raw IPUMS row (already parsed; this loader does not read files) ──────

/**
 * Already-parsed IPUMS row. Field names + types mirror the harmonized
 * IPUMS USA variable scheme called out in `ipums-pums-extract-manifest.md`.
 * Numeric variables carry their raw IPUMS code values (e.g. RACE = 1..9).
 *
 * `REPWTP` is the 80-element replicate-weight array (or arbitrary length
 * for fixtures; the loader records length as-given). `GQ` and `MIGSP1`
 * are optional carry-throughs.
 */
export interface RawIpumsRow {
  YEAR: number;
  SAMPLE: number | string;
  SERIAL: number;
  PERNUM: number;
  STATEFIP: number;
  PUMA?: number;
  AGE: number;
  SEX: 1 | 2;
  RACE: number;
  RACED?: number;
  HISPAN: number;
  EDUC: number;
  EDUCD?: number;
  HHINCOME: number;
  CITIZEN: number;
  PERWT: number;
  REPWTP?: number[];
  GQ?: number;
  MIGSP1?: number;
}

/** Loader-side metadata that doesn't appear on each raw row. */
export interface IpumsLoaderMeta {
  cycle: VepBacktestYear;
  /** Loader-side dataset descriptor; lands on every emitted row. */
  sourceDataset: string;
  /** Loader-side vintage span; lands on every emitted row. */
  sourceVintage: string;
}

/** Result of converting one raw row. */
export type ConvertResult =
  | { kind: "row"; row: VepUniverseRow }
  | { kind: "skip"; reason: SkipReason; rowKey: string };

export type SkipReason =
  | "age_below_18"
  | "non_state_statefip"
  | "weight_missing_or_nonpositive"
  | "missing_required_field"
  | "validation_failed";

// ─── Lookup tables ─────────────────────────────────────────────────────────

/** 50 states + DC. Territories deliberately omitted (filtered out). */
const STATE_FIPS_TO_ABBREV: Readonly<Record<number, string>> = {
  1: "AL",  2: "AK",  4: "AZ",  5: "AR",  6: "CA",  8: "CO",  9: "CT",
  10: "DE", 11: "DC", 12: "FL", 13: "GA", 15: "HI", 16: "ID", 17: "IL",
  18: "IN", 19: "IA", 20: "KS", 21: "KY", 22: "LA", 23: "ME", 24: "MD",
  25: "MA", 26: "MI", 27: "MN", 28: "MS", 29: "MO", 30: "MT", 31: "NE",
  32: "NV", 33: "NH", 34: "NJ", 35: "NM", 36: "NY", 37: "NC", 38: "ND",
  39: "OH", 40: "OK", 41: "OR", 42: "PA", 44: "RI", 45: "SC", 46: "SD",
  47: "TN", 48: "TX", 49: "UT", 50: "VT", 51: "VA", 53: "WA", 54: "WV",
  55: "WI", 56: "WY",
};

// ─── Collapsers ────────────────────────────────────────────────────────────

/**
 * IPUMS-harmonized RACE codes (1=White, 2=Black, 3=Amerind, 4=Chinese,
 * 5=Japanese, 6=Other Asian/PI, 7=Other race nec, 8=Two major races,
 * 9=Three+ major races) collapsed to the 7-cat `VepRace` enum.
 *
 * Note on Asian / NHPI: IPUMS RACE=6 conflates Asian and Pacific Islander.
 * v0 maps RACE=6 → "asian" by default, with the option to refine via
 * RACED when present (RACED 680–699 = Native Hawaiian / Other PI).
 * Without RACED detail, NHPI rows arrive as "asian"; v1 with full RACED
 * decode will refine. Documented in coverageNotes.
 */
function collapseRace(race: number, raced: number | undefined): { race: VepRace; refined: boolean } {
  // RACED-based NHPI refinement (when present).
  if (raced !== undefined && raced >= 680 && raced <= 699) {
    return { race: "nhpi", refined: true };
  }
  switch (race) {
    case 1: return { race: "white", refined: false };
    case 2: return { race: "black", refined: false };
    case 3: return { race: "amerindian", refined: false };
    case 4:
    case 5:
    case 6: return { race: "asian", refined: false };
    case 7: return { race: "other_single", refined: false };
    case 8:
    case 9: return { race: "two_or_more", refined: false };
    default: return { race: "other_single", refined: false };
  }
}

/** HISPAN: 0 = not Hispanic; 1..4 = Mexican / PR / Cuban / Other Hispanic. */
function collapseHispanic(hispan: number): boolean {
  return Number.isFinite(hispan) && hispan >= 1;
}

/**
 * IPUMS-harmonized EDUC (0..11) → VepEducation.
 *
 * v0 simplification: EDUC=6 (Grade 12) defaults to "hs_grad". The IPUMS
 * detail variable EDUCD distinguishes 12th-grade non-graduates from
 * actual HS diploma holders (EDUCD 60..62 = 12th grade, 63 = HS diploma,
 * 64 = GED). When EDUCD < 63, the loader reclassifies to "less_than_hs".
 */
function collapseEducation(educ: number, educd: number | undefined): VepEducation {
  if (educd !== undefined && educ === 6 && educd < 63) return "less_than_hs";
  if (educ <= 5) return "less_than_hs";
  if (educ === 6) return "hs_grad";
  if (educ === 7 || educ === 8) return "some_college";
  if (educ === 9) return "bachelor";
  if (educ >= 10) return "graduate";
  return "less_than_hs";
}

/**
 * CITIZEN: 0=N/A, 1=Born in US, 2=Born in PR/territories, 3=Born abroad
 * of US parents (treated as us_born — constitutionally eligible),
 * 4=Naturalized, 5=Non-citizen.
 *
 * For AGE>=18 inputs, CITIZEN=0 should be rare; loader treats it as
 * "us_born" default but flags via the `coverageNotes` so unusual coding
 * surfaces.
 */
function collapseCitizenship(citizen: number): { value: VepCitizenship; flagged: boolean } {
  switch (citizen) {
    case 0: return { value: "us_born", flagged: true };
    case 1: return { value: "us_born", flagged: false };
    case 2: return { value: "us_territory", flagged: false };
    case 3: return { value: "us_born", flagged: false };
    case 4: return { value: "us_naturalized", flagged: false };
    case 5: return { value: "non_citizen", flagged: false };
    default: return { value: "us_born", flagged: true };
  }
}

/**
 * HHINCOME (continuous, top-coded). Returns `null` for group quarters
 * (GQ != 1) or N/A sentinel (9999999). Negative incomes (loss-only
 * households) bucket into "<25k".
 */
function collapseIncome(hhincome: number, gq: number | undefined): VepIncomeBucket | null {
  if (gq !== undefined && gq !== 1) return null;
  if (!Number.isFinite(hhincome) || hhincome === 9999999) return null;
  if (hhincome < 25000) return "<25k";
  if (hhincome < 50000) return "25-50k";
  if (hhincome < 75000) return "50-75k";
  if (hhincome < 100000) return "75-100k";
  if (hhincome < 150000) return "100-150k";
  return "150k+";
}

function collapseSex(sex: 1 | 2): VepSex { return sex === 1 ? "male" : "female"; }

// ─── Single-row converter ──────────────────────────────────────────────────

/**
 * Convert one raw IPUMS row to a `VepUniverseRow`, or skip with a reason.
 *
 * The conversion is pure: same input → same output. No global state.
 * Failures are non-throwing — they return `{ kind: "skip", reason }`.
 */
export function convertIpumsRow(raw: RawIpumsRow, meta: IpumsLoaderMeta): ConvertResult {
  const rowKey = `${meta.cycle}-${raw.STATEFIP}-${raw.SERIAL}-${raw.PERNUM}`;

  // Required-field check.
  if (
    !Number.isFinite(raw.AGE) ||
    !Number.isFinite(raw.STATEFIP) ||
    !Number.isFinite(raw.SERIAL) ||
    !Number.isFinite(raw.PERNUM) ||
    !Number.isFinite(raw.PERWT)
  ) {
    return { kind: "skip", reason: "missing_required_field", rowKey };
  }

  // Age filter (universe is voting-eligible-aged adults).
  if (raw.AGE < 18) return { kind: "skip", reason: "age_below_18", rowKey };

  // STATEFIP filter (50 states + DC; territories filtered out).
  const state = STATE_FIPS_TO_ABBREV[raw.STATEFIP];
  if (!state) return { kind: "skip", reason: "non_state_statefip", rowKey };

  // Weight invariant.
  if (raw.PERWT <= 0) return { kind: "skip", reason: "weight_missing_or_nonpositive", rowKey };

  // Collapses.
  const { race, refined: nhpiRefined } = collapseRace(raw.RACE, raw.RACED);
  const hispanic = collapseHispanic(raw.HISPAN);
  const education = collapseEducation(raw.EDUC, raw.EDUCD);
  const incomeBucket = collapseIncome(raw.HHINCOME, raw.GQ);
  const { value: citizenship, flagged: citizenshipFlagged } = collapseCitizenship(raw.CITIZEN);
  const sex = collapseSex(raw.SEX);
  const ageBucket = ageToBucket(raw.AGE);

  // Eligibility: v0 = age + citizenship only.
  // State-disenfranchisement adjustment from the Sentencing Project
  // tracker is deferred to v1; documented in coverageNotes.
  const vepEligible = citizenship === "us_born" || citizenship === "us_naturalized";

  // Replicate weights — accept any length; validator only enforces finite
  // values when present. Real PUMS extracts ship 80; fixture rows can
  // ship fewer for compactness.
  const replicateWeights = raw.REPWTP !== undefined && Array.isArray(raw.REPWTP)
    ? raw.REPWTP.slice()
    : undefined;

  // Coverage notes — surface every soft signal so downstream consumers
  // can audit the conversion.
  const coverageNotes: string[] = [];
  if (raw.GQ !== undefined && raw.GQ !== 1) coverageNotes.push("group_quarters");
  if (incomeBucket === null && (raw.GQ === undefined || raw.GQ === 1)) coverageNotes.push("income_na");
  if (citizenshipFlagged) coverageNotes.push("citizen_code_unmapped_default");
  if (raw.RACE === 6 && !nhpiRefined) coverageNotes.push("race_asian_nhpi_unsplit_v0");
  coverageNotes.push("vep_eligible_pre_felon_disenfranchisement_v0");

  // Per-row uncertainty (v0): low when the conversion uses well-mapped
  // inputs; medium when soft flags fired.
  const uncertainty = (citizenshipFlagged || (raw.RACE === 6 && !nhpiRefined)) ? "medium" : "low";

  const row: VepUniverseRow = {
    respondentId: `IPUMS-${meta.sourceVintage}-${state}-${raw.SERIAL}-${raw.PERNUM}`,
    year: meta.cycle,
    state,
    puma: raw.PUMA !== undefined ? String(raw.PUMA).padStart(5, "0") : undefined,
    age: raw.AGE,
    ageBucket,
    sex,
    race,
    hispanic,
    education,
    incomeBucket,
    citizenship,
    vepEligible,
    personWeight: raw.PERWT,
    replicateWeights,
    sourceDataset: meta.sourceDataset,
    sourceVintage: meta.sourceVintage,
    coverageNotes,
    uncertainty,
  };

  // Final validator gate — anything that slips past should fail loudly.
  const errs = validateVepUniverseRow(row);
  if (errs.length > 0) {
    return { kind: "skip", reason: "validation_failed", rowKey };
  }

  return { kind: "row", row };
}

// ─── Bulk loader (fixture surface; no I/O) ────────────────────────────────

export interface BulkLoadStats {
  inputRows: number;
  emittedRows: number;
  skipped: Array<{ reason: SkipReason; rowKey: string }>;
  weightedTotalEmitted: number;
  weightedVepEligible: number;
}

export interface BulkLoadResult {
  rows: VepUniverseRow[];
  stats: BulkLoadStats;
}

/**
 * Convert a batch of parsed IPUMS rows. Pure: deterministic given input;
 * no global state; no I/O. Use this directly with hand-authored fixtures
 * (smoke tests). v1 streamer will feed pre-parsed rows into this same
 * function from the .dat / .dat.gz parser.
 */
export function loadFixtureUniverse(
  rawRows: readonly RawIpumsRow[],
  meta: IpumsLoaderMeta,
): BulkLoadResult {
  const rows: VepUniverseRow[] = [];
  const skipped: BulkLoadStats["skipped"] = [];
  let weightedTotalEmitted = 0;
  let weightedVepEligible = 0;
  for (const raw of rawRows) {
    const result = convertIpumsRow(raw, meta);
    if (result.kind === "row") {
      rows.push(result.row);
      weightedTotalEmitted += result.row.personWeight;
      if (result.row.vepEligible) weightedVepEligible += result.row.personWeight;
    } else {
      skipped.push({ reason: result.reason, rowKey: result.rowKey });
    }
  }
  return {
    rows,
    stats: {
      inputRows: rawRows.length,
      emittedRows: rows.length,
      skipped,
      weightedTotalEmitted,
      weightedVepEligible,
    },
  };
}

// Re-exports kept narrow — exposed for smoke / debugging.
export const _internals = {
  STATE_FIPS_TO_ABBREV,
  STATE_TO_REGION,
  collapseRace,
  collapseHispanic,
  collapseEducation,
  collapseCitizenship,
  collapseIncome,
  collapseSex,
};
