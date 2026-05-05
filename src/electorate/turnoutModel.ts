/**
 * Demographic turnout model — Phase B' of the abstention calibration.
 *
 * Trains a (age × education × race) → turnout-rate lookup table from
 * CCES 2008 validated turnout (the only cycle with clean ground truth
 * across the full sample), then applies it to any cycle's respondents.
 *
 * Design:
 *   - Lookup is precomputed offline by `trainTurnoutModel()` and written
 *     to `data/turnout-model/turnout-lookup-2008.json`. The runtime
 *     `predictTurnoutProbability()` reads the precomputed lookup.
 *   - Cell key is `age|edu|race`. Weighted turnout rate per cell.
 *   - Fallback hierarchy when a cell is thin (< 30 weighted-N):
 *       (age, edu, race) → (age, race) → (age, edu) → age → overall
 *   - "Unknown" buckets fall back through the same hierarchy.
 *
 * Read-only at runtime (just reads the JSON). Training requires
 * loading CCES 2008 and is gated behind an explicit train smoke.
 */

import * as fs from "node:fs";
import * as path from "node:path";

import type { SurveyDemographics, WeightedSurveyRespondent } from "./surveyBacktestTypes.js";

const LOOKUP_PATH = "data/turnout-model/turnout-lookup-2008.json";
const MIN_CELL_WEIGHTED_N = 30;

// ─── Bucketers (mirror the audit's logic) ─────────────────────────────────

export type AgeBucket = "18-29" | "30-44" | "45-64" | "65+" | "Unknown";
export type EducBucket = "HS or less" | "Some college" | "College" | "Post-grad" | "Unknown";
export type RaceBucket = "White" | "Black" | "Hispanic" | "Asian" | "Other" | "Unknown";

export function ageFromBirthyr(birthyr: number | undefined, year: number): number | null {
  if (!birthyr || birthyr < 1900 || birthyr > year - 17) return null;
  return year - birthyr;
}

export function ageBucket(age: number | null): AgeBucket {
  if (age === null) return "Unknown";
  if (age < 30) return "18-29";
  if (age < 45) return "30-44";
  if (age < 65) return "45-64";
  return "65+";
}

export function educBucket(educ: number | string | undefined): EducBucket {
  // CCES educ codes: 1=No HS, 2=HS, 3=Some college, 4=2-year, 5=4-year, 6=Post-grad
  const n = typeof educ === "string" ? parseInt(educ, 10) : (educ ?? -1);
  if (!Number.isFinite(n) || n < 1) return "Unknown";
  if (n <= 2) return "HS or less";
  if (n <= 4) return "Some college";
  if (n === 5) return "College";
  if (n >= 6) return "Post-grad";
  return "Unknown";
}

export function raceBucket(
  race: number | string | undefined,
  hispanic: number | string | undefined,
): RaceBucket {
  const hispNum = typeof hispanic === "string" ? parseInt(hispanic, 10) : (hispanic ?? -1);
  if (hispNum === 1) return "Hispanic";
  const n = typeof race === "string" ? parseInt(race, 10) : (race ?? -1);
  if (!Number.isFinite(n) || n < 1) return "Unknown";
  if (n === 1) return "White";
  if (n === 2) return "Black";
  if (n === 3) return "Hispanic";
  if (n === 4) return "Asian";
  return "Other";
}

// ─── Lookup model shape ──────────────────────────────────────────────────

export interface TurnoutLookup {
  /** Source cycle and methodology. */
  trained_from: { year: number; n_respondents: number; weighted_turnout_rate: number };
  /** Generated-at ISO timestamp. */
  generated_at: string;
  /** Full (age|edu|race) joint cells with weighted turnout rate. */
  joint: Record<string, { rate: number; weighted_n: number }>;
  /** Two-way (age|race) marginals. */
  ageRace: Record<string, { rate: number; weighted_n: number }>;
  /** Two-way (age|edu) marginals. */
  ageEduc: Record<string, { rate: number; weighted_n: number }>;
  /** One-way age marginals. */
  age: Record<string, { rate: number; weighted_n: number }>;
  /** Overall fallback. */
  overall: { rate: number; weighted_n: number };
}

let cached: TurnoutLookup | null = null;

export function loadTurnoutModel(filePath: string = LOOKUP_PATH): TurnoutLookup {
  if (cached) return cached;
  const raw = fs.readFileSync(filePath, "utf8");
  cached = JSON.parse(raw) as TurnoutLookup;
  return cached;
}

export function clearTurnoutModelCache(): void { cached = null; }

// ─── Predict ─────────────────────────────────────────────────────────────

export function predictTurnoutProbability(
  demographics: SurveyDemographics,
  year: number,
  model: TurnoutLookup = loadTurnoutModel(),
): { probability: number; cell: string; tier: "joint" | "ageRace" | "ageEduc" | "age" | "overall" } {
  const ageK = ageBucket(ageFromBirthyr(demographics.birthyr, year));
  const educK = educBucket(demographics.educ);
  const raceK = raceBucket(demographics.race, demographics.hispanic);

  const jointKey = `${ageK}|${educK}|${raceK}`;
  const jc = model.joint[jointKey];
  if (jc && jc.weighted_n >= MIN_CELL_WEIGHTED_N) {
    return { probability: jc.rate, cell: jointKey, tier: "joint" };
  }
  const arKey = `${ageK}|${raceK}`;
  const arc = model.ageRace[arKey];
  if (arc && arc.weighted_n >= MIN_CELL_WEIGHTED_N) {
    return { probability: arc.rate, cell: arKey, tier: "ageRace" };
  }
  const aeKey = `${ageK}|${educK}`;
  const aec = model.ageEduc[aeKey];
  if (aec && aec.weighted_n >= MIN_CELL_WEIGHTED_N) {
    return { probability: aec.rate, cell: aeKey, tier: "ageEduc" };
  }
  const ac = model.age[ageK];
  if (ac && ac.weighted_n >= MIN_CELL_WEIGHTED_N) {
    return { probability: ac.rate, cell: ageK, tier: "age" };
  }
  return { probability: model.overall.rate, cell: "overall", tier: "overall" };
}

// ─── Trainer ─────────────────────────────────────────────────────────────

interface CellAccum { weighted_n: number; weighted_voted: number; }
function newCell(): CellAccum { return { weighted_n: 0, weighted_voted: 0 }; }
function bumpCell(map: Record<string, CellAccum>, key: string, w: number, voted: boolean) {
  if (!map[key]) map[key] = newCell();
  map[key]!.weighted_n += w;
  if (voted) map[key]!.weighted_voted += w;
}
function ratesOf(map: Record<string, CellAccum>): Record<string, { rate: number; weighted_n: number }> {
  const out: Record<string, { rate: number; weighted_n: number }> = {};
  for (const [k, v] of Object.entries(map)) {
    out[k] = {
      rate: v.weighted_n > 0 ? v.weighted_voted / v.weighted_n : 0,
      weighted_n: v.weighted_n,
    };
  }
  return out;
}

/**
 * Train the lookup from validated CCES 2008 respondents (or any year that
 * supplies clean turnout ground truth). Writes JSON to `outPath`. Returns
 * the trained lookup.
 *
 * Inclusion: only `turnoutValidated && turnoutObserved !== null` respondents
 * are used. Survey weights are honored throughout.
 */
export function trainTurnoutModel(
  respondents: WeightedSurveyRespondent[],
  trainingYear: number,
  outPath: string = LOOKUP_PATH,
): TurnoutLookup {
  const joint: Record<string, CellAccum> = {};
  const ageRace: Record<string, CellAccum> = {};
  const ageEduc: Record<string, CellAccum> = {};
  const ageOnly: Record<string, CellAccum> = {};
  const overall: CellAccum = newCell();

  let nUsed = 0;
  let totalW = 0;
  let votedW = 0;

  for (const r of respondents) {
    if (!r.turnoutValidated || r.turnoutObserved === null) continue;
    nUsed++;
    const voted = r.turnoutObserved === true;
    const w = r.weight;
    totalW += w;
    if (voted) votedW += w;

    const ageK = ageBucket(ageFromBirthyr(r.demographics.birthyr, trainingYear));
    const educK = educBucket(r.demographics.educ);
    const raceK = raceBucket(r.demographics.race, r.demographics.hispanic);

    bumpCell(joint, `${ageK}|${educK}|${raceK}`, w, voted);
    bumpCell(ageRace, `${ageK}|${raceK}`, w, voted);
    bumpCell(ageEduc, `${ageK}|${educK}`, w, voted);
    bumpCell(ageOnly, ageK, w, voted);
    overall.weighted_n += w;
    if (voted) overall.weighted_voted += w;
  }

  const lookup: TurnoutLookup = {
    trained_from: {
      year: trainingYear,
      n_respondents: nUsed,
      weighted_turnout_rate: totalW > 0 ? votedW / totalW : 0,
    },
    generated_at: new Date().toISOString(),
    joint: ratesOf(joint),
    ageRace: ratesOf(ageRace),
    ageEduc: ratesOf(ageEduc),
    age: ratesOf(ageOnly),
    overall: { rate: totalW > 0 ? votedW / totalW : 0, weighted_n: totalW },
  };

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(lookup, null, 2));
  clearTurnoutModelCache();
  return lookup;
}
