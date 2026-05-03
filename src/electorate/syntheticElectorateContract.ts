/**
 * Synthetic electorate contract.
 *
 * This module defines the target object for the project north star:
 * a voting-eligible adult universe where every represented adult/cell carries
 * demographics, geography, weight, and PRISM node signature posteriors.
 *
 * It is deliberately not a generator. Survey-to-PRISM mapper v0 creates node
 * signatures for survey rows; the VEP universe loader creates the population
 * skeleton. This contract is the join surface between those lanes.
 */

import type {
  CatDist6,
  ContinuousNodeSignature,
  CategoricalNodeSignature,
  MoralBoundariesSignature,
  PosDist5,
  SalDist4,
  SurveyPrismSignature,
  Uncertainty,
} from "./surveyToPrismMapper.js";

export const SYNTHETIC_ELECTORATE_SCHEMA_VERSION = "v0.1";

export const POSITION_NODE_IDS = [
  "MAT",
  "CD",
  "CU",
  "MOR",
  "PRO",
  "COM",
  "ZS",
  "ONT_H",
  "ONT_S",
] as const;

export const CATEGORICAL_NODE_IDS = ["EPS", "AES"] as const;

export const MORAL_BOUNDARY_IDS = [
  "national",
  "ethnic_racial",
  "religious",
  "class",
  "ideological",
  "gender",
  "political_camp",
] as const;

export type PositionNodeId = typeof POSITION_NODE_IDS[number];
export type CategoricalNodeId = typeof CATEGORICAL_NODE_IDS[number];
export type MoralBoundaryId = typeof MORAL_BOUNDARY_IDS[number];

export type SyntheticRowKind = "weighted_cell" | "synthetic_person";
export type SignatureSource = "survey_direct" | "imputed_from_cell" | "model_draw";
export type PopulationSource = "acs_pums" | "ipums_pums" | "nhgis_cell" | "survey_weighted";

export interface SyntheticElectorateDemographics {
  state: string;
  age: number | null;
  ageBucket: string;
  raceEthnicity: string;
  sex: string;
  education: string;
  incomeBucket?: string | null;
  citizenVotingEligible: boolean;
  geography?: {
    countyFips?: string | null;
    congressionalDistrict?: string | null;
    metroStatus?: string | null;
    densityBucket?: string | null;
  };
}

export interface SignatureCoverage {
  realSignalTargets: number;
  imputedTargets: number;
  fallbackTargets: number;
  totalTargets: number;
  notes: string[];
}

export interface SyntheticElectorateSignature {
  positionNodes: Record<PositionNodeId, ContinuousNodeSignature>;
  categoricalNodes: Record<CategoricalNodeId, CategoricalNodeSignature>;
  engagement: SurveyPrismSignature["engagement"];
  moralBoundaries: MoralBoundariesSignature;
  coverage: SignatureCoverage;
}

export interface SyntheticElectorateRow {
  schemaVersion: typeof SYNTHETIC_ELECTORATE_SCHEMA_VERSION;
  year: 2008 | 2012 | 2016 | 2020 | 2024;
  drawId: number;
  rowKind: SyntheticRowKind;
  syntheticPersonId?: string;
  cellId: string;
  cellWeight: number;
  populationSource: PopulationSource;
  signatureSource: SignatureSource;
  demographics: SyntheticElectorateDemographics;
  signature: SyntheticElectorateSignature;
  uncertainty: {
    demographicCoverage: Uncertainty;
    signatureCoverage: Uncertainty;
    imputation: Uncertainty;
  };
}

export interface SyntheticElectorateManifest {
  schemaVersion: typeof SYNTHETIC_ELECTORATE_SCHEMA_VERSION;
  created: string;
  years: number[];
  rowKind: SyntheticRowKind;
  draws: number;
  files: Array<{
    year: number;
    drawId: number;
    path: string;
    rows: number;
    totalCellWeight: number;
  }>;
  invariants: string[];
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function sum(values: readonly number[]): number {
  return values.reduce((total, value) => total + value, 0);
}

function normalized(values: readonly number[], tolerance = 1e-6): boolean {
  return values.every(isFiniteNumber) && Math.abs(sum(values) - 1) <= tolerance;
}

function inClosedRange(value: unknown, min: number, max: number): boolean {
  return isFiniteNumber(value) && value >= min && value <= max;
}

function validatePosDist(name: string, dist: PosDist5, errors: string[]): void {
  if (!normalized(dist)) errors.push(`${name}.posPosterior must be finite and sum to 1`);
}

function validateSalDist(name: string, dist: SalDist4, errors: string[]): void {
  if (!normalized(dist)) errors.push(`${name}.salPosterior must be finite and sum to 1`);
}

function validateCatDist(name: string, dist: CatDist6, errors: string[]): void {
  if (!normalized(dist)) errors.push(`${name}.catDistribution must be finite and sum to 1`);
}

export function validateSyntheticElectorateRow(row: SyntheticElectorateRow): string[] {
  const errors: string[] = [];
  if (row.schemaVersion !== SYNTHETIC_ELECTORATE_SCHEMA_VERSION) errors.push("schemaVersion mismatch");
  if (![2008, 2012, 2016, 2020, 2024].includes(row.year)) errors.push("year must be one of the five backtest years");
  if (!Number.isInteger(row.drawId) || row.drawId < 0) errors.push("drawId must be a non-negative integer");
  if (row.rowKind !== "weighted_cell" && row.rowKind !== "synthetic_person") errors.push("rowKind invalid");
  if (!row.cellId) errors.push("cellId required");
  if (!isFiniteNumber(row.cellWeight) || row.cellWeight <= 0) errors.push("cellWeight must be finite and > 0");
  if (row.rowKind === "synthetic_person" && row.cellWeight !== 1) errors.push("synthetic_person rows should have cellWeight = 1");
  if (!row.demographics.state) errors.push("demographics.state required");
  if (!row.demographics.ageBucket) errors.push("demographics.ageBucket required");
  if (!row.demographics.raceEthnicity) errors.push("demographics.raceEthnicity required");
  if (!row.demographics.sex) errors.push("demographics.sex required");
  if (!row.demographics.education) errors.push("demographics.education required");
  if (row.demographics.citizenVotingEligible !== true) errors.push("row must represent a voting-eligible citizen adult");

  for (const node of POSITION_NODE_IDS) {
    const sig = row.signature.positionNodes[node];
    if (!sig) {
      errors.push(`missing position node ${node}`);
      continue;
    }
    validatePosDist(node, sig.posPosterior, errors);
    validateSalDist(node, sig.salPosterior, errors);
    if (!sig.provenance?.uncertainty) errors.push(`${node}.provenance.uncertainty required`);
  }

  for (const node of CATEGORICAL_NODE_IDS) {
    const sig = row.signature.categoricalNodes[node];
    if (!sig) {
      errors.push(`missing categorical node ${node}`);
      continue;
    }
    validateCatDist(node, sig.catDistribution, errors);
    validateSalDist(node, sig.salPosterior, errors);
    if (!sig.provenance?.uncertainty) errors.push(`${node}.provenance.uncertainty required`);
  }

  if (!inClosedRange(row.signature.engagement.value, 0, 10)) errors.push("engagement.value must be in [0,10]");

  for (const boundary of MORAL_BOUNDARY_IDS) {
    const entry = row.signature.moralBoundaries[boundary];
    if (!entry) {
      errors.push(`missing moral boundary ${boundary}`);
      continue;
    }
    if (!inClosedRange(entry.salience, 0, 3)) errors.push(`${boundary}.salience must be in [0,3]`);
    if (!entry.provenance?.uncertainty) errors.push(`${boundary}.provenance.uncertainty required`);
  }
  if (!inClosedRange(row.signature.moralBoundaries.intensity, 0, 3)) {
    errors.push("moralBoundaries.intensity must be in [0,3]");
  }

  const coverage = row.signature.coverage;
  const coverageTotal = coverage.realSignalTargets + coverage.imputedTargets + coverage.fallbackTargets;
  if (coverageTotal !== coverage.totalTargets) errors.push("signature.coverage counts must sum to totalTargets");
  return errors;
}

const uniformPos: PosDist5 = [0.2, 0.2, 0.2, 0.2, 0.2];
const mediumSal: SalDist4 = [0.2, 0.3, 0.3, 0.2];
const uniformCat: CatDist6 = [1/6, 1/6, 1/6, 1/6, 1/6, 1/6];

function exampleProvenance(notes: string) {
  return {
    source: "imputed_from_cell" as const,
    vars: [],
    partyIdDerived: false,
    uncertainty: "high" as const,
    notes,
  };
}

export function makeExampleSyntheticElectorateRow(): SyntheticElectorateRow {
  const positionNodes = Object.fromEntries(
    POSITION_NODE_IDS.map((node) => [
      node,
      {
        posPosterior: uniformPos,
        salPosterior: mediumSal,
        provenance: exampleProvenance("contract example only"),
      } satisfies ContinuousNodeSignature,
    ])
  ) as Record<PositionNodeId, ContinuousNodeSignature>;

  const categoricalNodes = Object.fromEntries(
    CATEGORICAL_NODE_IDS.map((node) => [
      node,
      {
        catDistribution: uniformCat,
        salPosterior: mediumSal,
        provenance: exampleProvenance("contract example only"),
      } satisfies CategoricalNodeSignature,
    ])
  ) as Record<CategoricalNodeId, CategoricalNodeSignature>;

  const boundaryEntry = {
    salience: 1.0,
    provenance: exampleProvenance("contract example only"),
  };

  return {
    schemaVersion: SYNTHETIC_ELECTORATE_SCHEMA_VERSION,
    year: 2024,
    drawId: 0,
    rowKind: "weighted_cell",
    cellId: "2024|CA|age_30_44|race_hispanic|sex_female|edu_ba|inc_mid",
    cellWeight: 1250,
    populationSource: "acs_pums",
    signatureSource: "imputed_from_cell",
    demographics: {
      state: "CA",
      age: null,
      ageBucket: "30-44",
      raceEthnicity: "hispanic",
      sex: "female",
      education: "ba_plus",
      incomeBucket: "middle",
      citizenVotingEligible: true,
    },
    signature: {
      positionNodes,
      categoricalNodes,
      engagement: {
        value: 5,
        provenance: exampleProvenance("contract example only"),
      },
      moralBoundaries: {
        national: boundaryEntry,
        ethnic_racial: boundaryEntry,
        religious: boundaryEntry,
        class: boundaryEntry,
        ideological: boundaryEntry,
        gender: boundaryEntry,
        political_camp: boundaryEntry,
        intensity: 1.0,
        intensityProvenance: exampleProvenance("contract example only"),
      },
      coverage: {
        realSignalTargets: 0,
        imputedTargets: 19,
        fallbackTargets: 0,
        totalTargets: 19,
        notes: ["Example row; not generated from real data."],
      },
    },
    uncertainty: {
      demographicCoverage: "medium",
      signatureCoverage: "high",
      imputation: "high",
    },
  };
}
