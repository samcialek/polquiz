/**
 * CCES 2016 -> PRISM electorate bridge.
 *
 * This is a diagnostic/evaluation pipeline, not a production scorer:
 *  1. stream the CCES 2016 Common Content file,
 *  2. map survey items into PRISM node posterior means + uncertainty proxies,
 *  3. validate against reported/validated presidential vote,
 *  4. run Clinton -> Sanders candidate swaps on the same weighted voters.
 *
 * Usage:
 *   npx tsx src/eval/cces2016-electorate-bridge.ts
 *
 * Optional:
 *   PRISM_NONIDEO=0 npx tsx src/eval/cces2016-electorate-bridge.ts
 */

import { createReadStream, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createInterface } from "node:readline";
import { dirname, join } from "node:path";
import { ELECTIONS, type CandidateProfile } from "../historical/candidates.js";
import { getContext } from "../historical/contexts.js";
import { predictVote, type ElectionPrediction } from "../historical/respondentVoteChoice.js";
import type { NodeSignature } from "../engine/respondentSignature.js";
import type { EngagementLevel } from "../engine/engagementLabel.js";
import type {
  CategoricalNodeId,
  ContinuousNodeId,
  PartyID,
  TrbAnchor,
  TrbAnchorDist,
} from "../types.js";

const DATA_FILE = join("data", "cces2016", "CCES16_Common_OUTPUT_Feb2018_VV.tab");
const CODEBOOK_DIR = join("data", "cces2016");
const OUT_DIR = join("results", "cces2016-bridge");
const PRESIDENT_RESULTS_CSV = join("results", "counterfactuals", "source-1976-2020-president.csv");

const CONTINUOUS_NODES: ContinuousNodeId[] = [
  "MAT", "CD", "CU", "MOR", "PRO", "COM", "ZS",
  "ONT_H", "ONT_S", "PF", "TRB", "ENG",
];
const NON_SELF_NODES: ContinuousNodeId[] = [
  "MAT", "CD", "CU", "MOR", "PRO", "COM", "ZS", "ONT_H", "ONT_S",
];
const CATEGORICAL_NODES: CategoricalNodeId[] = ["EPS", "AES"];
const TRB_ANCHOR_ORDER: TrbAnchor[] = [
  "national", "ideological", "religious", "class", "ethnic_racial",
  "gender", "sexual", "global", "mixed_none",
];

const STATE_FIPS_TO_PO: Record<number, string> = {
  1: "AL", 2: "AK", 4: "AZ", 5: "AR", 6: "CA", 8: "CO", 9: "CT", 10: "DE",
  11: "DC", 12: "FL", 13: "GA", 15: "HI", 16: "ID", 17: "IL", 18: "IN",
  19: "IA", 20: "KS", 21: "KY", 22: "LA", 23: "ME", 24: "MD", 25: "MA",
  26: "MI", 27: "MN", 28: "MS", 29: "MO", 30: "MT", 31: "NE", 32: "NV",
  33: "NH", 34: "NJ", 35: "NM", 36: "NY", 37: "NC", 38: "ND", 39: "OH",
  40: "OK", 41: "OR", 42: "PA", 44: "RI", 45: "SC", 46: "SD", 47: "TN",
  48: "TX", 49: "UT", 50: "VT", 51: "VA", 53: "WA", 54: "WV", 55: "WI",
  56: "WY",
};

const ELECTORAL_VOTES_2016: Record<string, number> = {
  AL: 9, AK: 3, AZ: 11, AR: 6, CA: 55, CO: 9, CT: 7, DE: 3, DC: 3,
  FL: 29, GA: 16, HI: 4, ID: 4, IL: 20, IN: 11, IA: 6, KS: 6, KY: 8,
  LA: 8, ME: 4, MD: 10, MA: 11, MI: 16, MN: 10, MS: 6, MO: 10, MT: 3,
  NE: 5, NV: 6, NH: 4, NJ: 14, NM: 5, NY: 29, NC: 15, ND: 3, OH: 18,
  OK: 7, OR: 7, PA: 20, RI: 4, SC: 9, SD: 3, TN: 11, TX: 38, UT: 6,
  VT: 3, VA: 13, WA: 12, WV: 5, WI: 10, WY: 3,
};

type VoteBucket = "Democratic" | "Republican" | "Johnson" | "Stein" | "Other" | "AbstainUnknown";
type Method =
  | "wta"
  | "softmax_t1.0"
  | "softmax_t1.5"
  | "softmax_t2.0"
  | "calibrated_softmax_t1.5"
  | "state_calibrated_softmax_t1.5";
type ScenarioId = "baseline_clinton" | "sanders_static" | "sanders_perceived";
type CandidateVariant = "canonical" | "perceived_2016_patch";
type RunMode = "fixed_voter" | "elastic_turnout";
type TurnoutSplit = "train" | "holdout";
type EvidenceBlock =
  | "party_id"
  | "ideology"
  | "primary_vote"
  | "racial_attitudes"
  | "institutional_trust"
  | "policy"
  | "engagement"
  | "demographics"
  | "religion_union"
  | "other";

interface CcesRow {
  get(name: string): string;
  num(name: string): number | null;
}

interface ContinuousPosterior {
  posSum: number;
  posWeight: number;
  salSum: number;
  salWeight: number;
  touches: number;
}

interface CategoricalPosterior {
  dist: number[];
  weight: number;
  salSum: number;
  salWeight: number;
  touches: number;
}

interface EvidenceAuditRow {
  variable: string;
  label: string;
  block: string;
  target: string;
  role: string;
  mapping: string;
  weight: number;
  notes: string;
}

interface SchemaAuditRow {
  variable: string;
  label: string;
  present: number;
  nonmissing_n: number;
  weighted_nonmissing: number;
  top_values: string;
}

interface BridgeRespondent {
  id: string;
  state: string;
  raceGroup: string;
  ageGroup: string;
  educationGroup: string;
  weightVoter: number;
  weightAdult: number;
  reportedVote: VoteBucket;
  isReportedVoter: boolean;
  validatedVoter: boolean;
  turnoutSplit: TurnoutSplit;
  partyID: PartyID | null;
  signature: NodeSignature;
  engagement: EngagementLevel;
  anchorDist: TrbAnchorDist;
  posteriorMeta: {
    touches: Record<string, number>;
    sd: Record<string, number>;
  };
}

interface ScenarioRun {
  scenario: ScenarioId;
  candidateVariant: CandidateVariant;
  method: Method;
  mode: RunMode;
  national: VoteAccumulator;
  states: Map<string, VoteAccumulator>;
  byGroup: Map<string, VoteAccumulator>;
  accuracy?: AccuracyAccumulator;
}

type BucketAlphas = Record<"Democratic" | "Republican" | "Johnson" | "Stein" | "Other", number>;

interface TurnoutModel {
  featureNames: string[];
  coefficients: number[];
  lambda: number;
  iterations: number;
}

interface TurnoutMetrics {
  split: TurnoutSplit | "all";
  weightedN: number;
  actualTurnout: number;
  predictedTurnout: number;
  logLoss: number;
  brier: number;
  accuracy: number;
}

interface TurnoutSettings {
  label: string;
  affinityCoefficient: number;
  blackPenalty: number;
  youngBoost: number;
  latinoBoost: number;
  flCubanPenalty: number;
  collegePlusPenalty: number;
}

interface BootstrapSummary {
  scenario: ScenarioId;
  candidateVariant: CandidateVariant;
  method: Method;
  mode: RunMode;
  reps: number;
  demWinRate: number;
  medianDemEv: number;
  p05DemEv: number;
  p95DemEv: number;
  medianNationalD2p: number;
  p05NationalD2p: number;
  p95NationalD2p: number;
  mostCommonTippingStates: string;
}

interface ActualStateRow {
  state: string;
  state_po: string;
  dem_votes: number;
  rep_votes: number;
  third_votes: number;
  total_votes: number;
  dem_share: number;
  rep_share: number;
  third_share: number;
  dem_two_party: number;
}

const CODEBOOK_LABEL_OVERRIDES: Record<string, string> = {
  CC16_330a: "Gun Control - Background checks",
  CC16_330b: "Gun Control - Keep gun-owner names private",
  CC16_330d: "Gun Control - Ban assault rifles",
  CC16_330e: "Gun Control - Easier concealed-carry permits",
  CC16_331_1: "Immigration - Legal status for employed undocumented immigrants",
  CC16_331_2: "Immigration - More border patrol",
  CC16_331_3: "Immigration - Legal status for childhood arrivals",
  CC16_331_4: "Immigration - Fine businesses hiring undocumented immigrants",
  CC16_331_5: "Immigration - Admit no Syrian refugees",
  CC16_331_6: "Immigration - Increase visas for overseas workers",
  CC16_331_7: "Immigration - Identify and deport undocumented immigrants",
  CC16_331_8: "Immigration - Ban Muslims from immigrating",
  CC16_351K: "Congress vote - Minimum wage",
  CC16_351I: "Congress vote - Repeal Affordable Care Act",
  CC16_351B: "Congress vote - Trans-Pacific Partnership",
  CC16_351D: "Congress vote - Trade Adjustment Assistance",
  CC16_351A: "Congress vote - Garland nomination",
  CC16_351C: "Congress vote - USA Freedom Act",
  CC16_401: "Voted 2016",
  CC16_410a: "President vote",
  CC16_421a: "3 point party ID",
  CC16_421b: "Party ID lean",
  CC16_421_dem: "Party ID Democratic strength",
  CC16_421_rep: "Party ID Republican strength",
};

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function round(value: number, digits = 4): number {
  const k = 10 ** digits;
  return Math.round(value * k) / k;
}

function stableHash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function sigmoid(value: number): number {
  if (value >= 0) {
    const z = Math.exp(-value);
    return 1 / (1 + z);
  }
  const z = Math.exp(value);
  return z / (1 + z);
}

function logit(value: number): number {
  const p = clamp(value, 0.0001, 0.9999);
  return Math.log(p / (1 - p));
}

let ACTIVE_EVIDENCE_BLOCK_SCALES: Partial<Record<EvidenceBlock, number>> = {};
let ACTIVE_EVIDENCE_JITTER = { amplitude: 0, seed: "baseline" };

function setEvidenceStress(
  blockScales: Partial<Record<EvidenceBlock, number>> = {},
  jitterAmplitude = 0,
  jitterSeed = "baseline",
): void {
  ACTIVE_EVIDENCE_BLOCK_SCALES = blockScales;
  ACTIVE_EVIDENCE_JITTER = { amplitude: jitterAmplitude, seed: jitterSeed };
}

function evidenceBlock(variable: string): EvidenceBlock {
  if (variable === "ideo5") return "ideology";
  if (variable === "pid3" || variable === "pid7" || variable.startsWith("CC16_421")) return "party_id";
  if (variable === "CC16_328") return "primary_vote";
  if (variable.startsWith("CC16_422")) return "racial_attitudes";
  if (
    variable.startsWith("CC16_320")
    || variable === "CC16_302"
    || variable === "CC16_303"
    || variable === "CC16_304"
    || variable === "CC16_307"
    || variable === "CC16_351A"
    || variable === "CC16_351C"
  ) return "institutional_trust";
  if (
    variable.startsWith("CC16_301")
    || variable.startsWith("CC16_330")
    || variable.startsWith("CC16_331")
    || variable.startsWith("CC16_351")
    || variable.startsWith("CC16_312")
    || variable.startsWith("CC16_414")
    || variable.startsWith("CC16_426")
    || variable === "CC16_415r"
  ) return "policy";
  if (variable === "newsint" || variable === "votereg" || variable === "CC16_327" || variable.startsWith("CC16_417")) return "engagement";
  if (variable === "race" || variable === "hispanic" || variable === "Hispanic_origin_5" || variable === "sexuality" || variable === "trans" || variable === "gender") return "demographics";
  if (variable.startsWith("pew_") || variable === "union" || variable === "unionhh") return "religion_union";
  return "other";
}

function scaledEvidenceWeight(variable: string, target: string, role: string, baseWeight: number): number {
  const block = evidenceBlock(variable);
  const blockScale = ACTIVE_EVIDENCE_BLOCK_SCALES[block] ?? 1;
  const jitter = ACTIVE_EVIDENCE_JITTER.amplitude;
  if (jitter <= 0) return baseWeight * blockScale;
  const h = stableHash(`${ACTIVE_EVIDENCE_JITTER.seed}|${variable}|${target}|${role}`);
  const unit = (h / 4294967295) * 2 - 1;
  return Math.max(0, baseWeight * blockScale * (1 + jitter * unit));
}

function csvEscape(value: unknown): string {
  const s = String(value ?? "");
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function writeCsv(path: string, rows: Array<Record<string, unknown>>): void {
  mkdirSync(dirname(path), { recursive: true });
  if (rows.length === 0) {
    writeFileSync(path, "", "utf-8");
    return;
  }
  const headers = Object.keys(rows[0]!);
  const lines = [
    headers.join(","),
    ...rows.map((row) => headers.map((h) => csvEscape(row[h])).join(",")),
  ];
  writeFileSync(path, `${lines.join("\n")}\n`, "utf-8");
}

function parseDelimitedLine(line: string, delimiter: "\t" | ","): string[] {
  const out: string[] = [];
  let cell = "";
  let quoted = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]!;
    const next = line[i + 1];
    if (quoted) {
      if (ch === '"' && next === '"') {
        cell += '"';
        i++;
      } else if (ch === '"') {
        quoted = false;
      } else {
        cell += ch;
      }
    } else if (ch === '"') {
      quoted = true;
    } else if (ch === delimiter) {
      out.push(cell);
      cell = "";
    } else if (delimiter === "," && ch === "\r") {
      // ignore
    } else {
      cell += ch;
    }
  }
  out.push(cell);
  return out;
}

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i]!;
    const next = text[i + 1];
    if (quoted) {
      if (ch === '"' && next === '"') {
        cell += '"';
        i++;
      } else if (ch === '"') {
        quoted = false;
      } else {
        cell += ch;
      }
    } else if (ch === '"') {
      quoted = true;
    } else if (ch === ",") {
      row.push(cell);
      cell = "";
    } else if (ch === "\n") {
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else if (ch !== "\r") {
      cell += ch;
    }
  }
  if (row.length > 0 || cell.length > 0) {
    row.push(cell);
    rows.push(row);
  }
  return rows;
}

function asNum(value: string): number | null {
  if (value == null || value === "" || value === "." || value === "NA") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function validCode(value: number | null, min = 1, max = 7): value is number {
  return value != null && value >= min && value <= max;
}

function yesNo(value: number | null): boolean | null {
  if (value === 1) return true;
  if (value === 2) return false;
  return null;
}

function fivePoint(value: number | null): number | null {
  return validCode(value, 1, 5) ? value : null;
}

function invertFive(value: number | null): number | null {
  return validCode(value, 1, 5) ? 6 - value : null;
}

function fourApprovalToPos(value: number | null, approveHigh = true): number | null {
  if (!validCode(value, 1, 4)) return null;
  const pos = 1 + ((value - 1) / 3) * 4;
  return approveHigh ? 6 - pos : pos;
}

function issueImportanceToSal(value: number | null): number | null {
  if (!validCode(value, 1, 5)) return null;
  return clamp(3.2 - (value - 1) * 0.75, 0, 3);
}

function binaryPolicyPos(value: number | null, supportPos: number, opposePos: number): number | null {
  if (value === 1) return supportPos;
  if (value === 2) return opposePos;
  return null;
}

function binarySal(value: number | null, sal = 2.0): number | null {
  return value === 1 || value === 2 ? sal : null;
}

function codebookLabels(): Map<string, string> {
  const labels = new Map<string, string>();
  for (let i = 1; i <= 16; i++) {
    const path = join(CODEBOOK_DIR, `hcbk${String(i).padStart(4, "0")}.htm`);
    if (!existsSync(path)) continue;
    const text = readFileSync(path, "utf-8");
    const re = /<span id="([^"]+)" class="varname">[^<]+<\/span><span class="varlabel">([^<]*)<\/span>/g;
    for (const m of text.matchAll(re)) {
      labels.set(m[1]!, decodeHtml(m[2]!));
    }
  }
  for (const [k, v] of Object.entries(CODEBOOK_LABEL_OVERRIDES)) labels.set(k, v);
  return labels;
}

function decodeHtml(s: string): string {
  return s
    .replace(/&nbsp;/g, " ")
    .replace(/&#x2F;/g, "/")
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

class SignatureBuilder {
  continuous: Record<ContinuousNodeId, ContinuousPosterior>;
  categorical: Record<CategoricalNodeId, CategoricalPosterior>;
  anchorMass: Record<TrbAnchor, number>;
  anchorTouches = 0;

  constructor() {
    this.continuous = Object.fromEntries(
      CONTINUOUS_NODES.map((node) => [node, {
        posSum: priorPos(node) * priorWeight(node),
        posWeight: priorWeight(node),
        salSum: priorSal(node) * 0.9,
        salWeight: 0.9,
        touches: 0,
      }])
    ) as Record<ContinuousNodeId, ContinuousPosterior>;
    this.categorical = {
      EPS: { dist: Array(6).fill(0.75 / 6), weight: 0.75, salSum: 0.8 * 0.75, salWeight: 0.75, touches: 0 },
      AES: { dist: Array(6).fill(0.75 / 6), weight: 0.75, salSum: 0.8 * 0.75, salWeight: 0.75, touches: 0 },
    };
    this.anchorMass = Object.fromEntries(TRB_ANCHOR_ORDER.map((a) => [a, 0.08])) as Record<TrbAnchor, number>;
  }

  addContinuous(node: ContinuousNodeId, pos: number | null, sal: number | null, weight: number): void {
    if (pos == null && sal == null) return;
    const p = this.continuous[node];
    if (pos != null) {
      p.posSum += clamp(pos, 1, 5) * weight;
      p.posWeight += weight;
    }
    if (sal != null) {
      p.salSum += clamp(sal, 0, 3) * weight;
      p.salWeight += weight;
    }
    p.touches += 1;
  }

  addCategory(node: CategoricalNodeId, dist: number[] | null, sal: number | null, weight: number): void {
    if (!dist && sal == null) return;
    const p = this.categorical[node];
    if (dist) {
      const total = dist.reduce((sum, v) => sum + Math.max(0, v), 0);
      if (total > 0) {
        for (let i = 0; i < 6; i++) p.dist[i] += (Math.max(0, dist[i] ?? 0) / total) * weight;
        p.weight += weight;
      }
    }
    if (sal != null) {
      p.salSum += clamp(sal, 0, 3) * weight;
      p.salWeight += weight;
    }
    p.touches += 1;
  }

  addAnchor(anchor: TrbAnchor, weight: number): void {
    this.anchorMass[anchor] += Math.max(0, weight);
    this.anchorTouches += 1;
  }

  finalize(): { signature: NodeSignature; anchorDist: TrbAnchorDist; touches: Record<string, number>; sd: Record<string, number> } {
    const signature: NodeSignature = {};
    const touches: Record<string, number> = {};
    const sd: Record<string, number> = {};
    for (const node of CONTINUOUS_NODES) {
      const p = this.continuous[node];
      const pos = p.posSum / p.posWeight;
      const sal = isSelfNodeId(node) ? ((pos - 1) / 4) * 3 : p.salSum / p.salWeight;
      signature[node] = { pos, sal };
      touches[node] = p.touches;
      sd[node] = posteriorSd(p.posWeight, p.touches);
    }
    for (const node of CATEGORICAL_NODES) {
      const p = this.categorical[node];
      const total = p.dist.reduce((sum, v) => sum + v, 0);
      const catDist = p.dist.map((v) => v / total);
      signature[node] = {
        pos: catDist.reduce((sum, v, idx) => sum + v * idx, 0),
        sal: p.salSum / p.salWeight,
        catDist,
      };
      touches[node] = p.touches;
      sd[node] = posteriorSd(p.weight, p.touches);
    }
    const anchorTotal = TRB_ANCHOR_ORDER.reduce((sum, a) => sum + this.anchorMass[a], 0);
    const anchorDist = TRB_ANCHOR_ORDER.map((a) => this.anchorMass[a] / anchorTotal) as TrbAnchorDist;
    touches.TRB_ANCHOR = this.anchorTouches;
    sd.TRB_ANCHOR = posteriorSd(anchorTotal, this.anchorTouches);
    return { signature, anchorDist, touches, sd };
  }
}

function priorPos(node: ContinuousNodeId): number {
  if (node === "ENG") return 2.7;
  if (node === "PF") return 2.4;
  if (node === "TRB") return 2.3;
  return 3;
}

function priorSal(node: ContinuousNodeId): number {
  if (node === "ENG" || node === "PF" || node === "TRB") return 1.2;
  return 1.0;
}

function priorWeight(node: ContinuousNodeId): number {
  if (node === "ENG" || node === "PF" || node === "TRB") return 1.0;
  return 0.8;
}

function posteriorSd(totalWeight: number, touches: number): number {
  return clamp(1.25 / Math.sqrt(totalWeight + touches * 0.7), 0.22, 1.15);
}

function isSelfNodeId(node: ContinuousNodeId): boolean {
  return node === "PF" || node === "TRB" || node === "ENG";
}

interface EvidenceSpec {
  variable: string;
  label: string;
  block: EvidenceBlock;
  target: string;
  role: string;
  mapping: string;
  weight: number;
  notes: string;
  apply(row: CcesRow, builder: SignatureBuilder): void;
}

function continuousSpec(
  variable: string,
  label: string,
  node: ContinuousNodeId,
  role: string,
  mapping: string,
  weight: number,
  pos: (value: number | null, row: CcesRow) => number | null,
  sal: (value: number | null, row: CcesRow) => number | null,
  notes = "",
): EvidenceSpec {
  const block = evidenceBlock(variable);
  return {
    variable, label, block, target: node, role, mapping, weight, notes,
    apply: (row, builder) => {
      const value = row.num(variable);
      builder.addContinuous(node, pos(value, row), sal(value, row), scaledEvidenceWeight(variable, node, role, weight));
    },
  };
}

function anchorSpec(
  variable: string,
  label: string,
  anchor: TrbAnchor,
  mapping: string,
  weight: number,
  active: (value: number | null, row: CcesRow) => boolean,
  notes = "",
): EvidenceSpec {
  const block = evidenceBlock(variable);
  const target = `TRB_ANCHOR:${anchor}`;
  return {
    variable, label, block, target, role: "anchor", mapping, weight, notes,
    apply: (row, builder) => {
      if (active(row.num(variable), row)) builder.addAnchor(anchor, scaledEvidenceWeight(variable, target, "anchor", weight));
    },
  };
}

function categorySpec(
  variable: string,
  label: string,
  node: CategoricalNodeId,
  mapping: string,
  weight: number,
  dist: (value: number | null, row: CcesRow) => number[] | null,
  sal: (value: number | null, row: CcesRow) => number | null,
  notes = "",
): EvidenceSpec {
  const block = evidenceBlock(variable);
  return {
    variable, label, block, target: node, role: "category", mapping, weight, notes,
    apply: (row, builder) => {
      const value = row.num(variable);
      builder.addCategory(node, dist(value, row), sal(value, row), scaledEvidenceWeight(variable, node, "category", weight));
    },
  };
}

function buildCrosswalk(labels: Map<string, string>): EvidenceSpec[] {
  const L = (v: string) => labels.get(v) ?? CODEBOOK_LABEL_OVERRIDES[v] ?? v;
  const specs: EvidenceSpec[] = [];

  specs.push(
    continuousSpec("ideo5", L("ideo5"), "MAT", "position", "1 very liberal -> MAT 1; 5 very conservative -> MAT 5", 1.15, v => fivePoint(v), () => 1.8, "Broad ideology is used as a weak prior, not a vote label."),
    continuousSpec("ideo5", L("ideo5"), "CD", "position", "1 very liberal/open -> CD 1; 5 conservative/closed -> CD 5", 1.0, v => fivePoint(v), () => 1.6),
    continuousSpec("ideo5", L("ideo5"), "CU", "position", "1 very liberal/pluralist -> CU 5; 5 conservative/particularist -> CU 1", 0.9, v => invertFive(v), () => 1.4),
    // MOR direction inverted 2026-04-26: under spatial-scope MOR semantics,
    // liberal/secular respondents tend to wider moral scope (universalist) and
    // traditional respondents tend to narrower scope (in-group). Old mapping
    // had this backwards (was using progressive-vs-traditional content framing).
    continuousSpec("ideo5", L("ideo5"), "MOR", "position", "1 very liberal -> wide moral scope (MOR 5); 5 conservative -> narrow scope (MOR 1)", 0.8, v => invertFive(v), () => 1.3),
    categorySpec("ideo5", L("ideo5"), "EPS", "ideology certainty: extremes -> autonomous/intuitionist; moderates -> institutionalist/empiricist", 0.55, ideologyToEps, v => validCode(v, 1, 5) ? 1.0 : null),
  );

  for (const variable of ["pid7", "CC16_421a", "CC16_421b", "CC16_421_dem", "CC16_421_rep"]) {
    specs.push(continuousSpec(variable, L(variable), "PF", "activation", "party identification strength -> PF activation", variable === "pid7" ? 1.6 : 0.7, (_, row) => pfFromPartyVars(row), () => null, "PF uses pre pid7 first, post-election party ID only as fallback/weak confirmation."));
    specs.push(anchorSpec(variable, L(variable), "ideological", "strong/leaning party ID -> ideological anchor", variable === "pid7" ? 0.8 : 0.35, (_, row) => (pfFromPartyVars(row) ?? 0) >= 3.5));
  }

  // Approval-to-ONT_S mappings removed 2026-04-26 per ONT_S reframe. Approval
  // of current officeholders/institutions is a CURRENT-PERFORMANCE assessment,
  // not a belief about institutional capacity. A respondent can disapprove of
  // Obama / current Congress / current SCOTUS while still believing strongly
  // in institutional capacity (just not these specific ones). Conversely a
  // libertarian who structurally rejects institutional capacity may still
  // approve of a SCOTUS ruling that limits federal power. Keep PF (party
  // fusion) signal from Obama approval and PRO (procedural deference) signal
  // from SCOTUS approval — those are the legitimate readings.
  specs.push(
    continuousSpec("CC16_320a", L("CC16_320a"), "PF", "activation", "Obama approval/disapproval weakly confirms Democratic/Republican fusion", 0.35, (v, row) => partyFusionFromObamaApproval(v, row), () => null),
    continuousSpec("CC16_320c", L("CC16_320c"), "PRO", "position", "approve Supreme Court -> procedural deference", 0.55, v => fourApprovalToPos(v), v => validCode(v, 1, 4) ? 1.2 : null),
  );

  specs.push(
    continuousSpec("CC16_302", L("CC16_302"), "ONT_S", "position", "national economy better -> system trust; worse -> system distrust", 0.65, v => validCode(v, 1, 5) ? 6 - v : null, v => validCode(v, 1, 5) ? 1.2 : null),
    continuousSpec("CC16_302", L("CC16_302"), "ZS", "position", "worse economy -> more zero-sum", 0.45, v => fivePoint(v), v => validCode(v, 1, 5) ? 1.1 : null),
    continuousSpec("CC16_303", L("CC16_303"), "ONT_H", "position", "household income increased -> human optimism; decreased -> pessimism", 0.35, v => validCode(v, 1, 5) ? 6 - v : null, v => validCode(v, 1, 5) ? 0.8 : null),
    continuousSpec("CC16_304", L("CC16_304"), "ONT_H", "position", "expected income improvement -> optimism", 0.35, v => validCode(v, 1, 5) ? 6 - v : null, v => validCode(v, 1, 5) ? 0.8 : null),
  );

  const salienceVars: Array<[string, ContinuousNodeId, string]> = [
    ["CC16_301a", "CD", "gun salience"],
    ["CC16_301b", "MOR", "abortion salience"],
    ["CC16_301c", "MAT", "tax salience"],
    ["CC16_301d", "CU", "immigration salience"],
    ["CC16_301e", "MAT", "deficit salience"],
    ["CC16_301f", "ZS", "defense salience"],
    ["CC16_301g", "MAT", "social security salience"],
    ["CC16_301h", "MOR", "environment salience"],
    ["CC16_301i", "MAT", "jobs salience"],
    ["CC16_301j", "ZS", "crime salience"],
    ["CC16_301k", "ZS", "national-security salience"],
    ["CC16_301l", "CU", "race-relations salience"],
    ["CC16_301m", "MAT", "health-care salience"],
    ["CC16_301n", "CD", "gay-marriage salience"],
    ["CC16_301o", "ONT_S", "corruption salience"],
  ];
  for (const [variable, node, label] of salienceVars) {
    specs.push(continuousSpec(variable, L(variable), node, "salience", `MIP battery: ${label}`, 0.75, () => null, v => issueImportanceToSal(v)));
  }

  specs.push(
    continuousSpec("CC16_351K", L("CC16_351K"), "MAT", "position", "for minimum wage -> redistribution/labor", 1.2, v => binaryPolicyPos(v, 1.4, 4.3), v => binarySal(v, 2.0)),
    continuousSpec("CC16_351I", L("CC16_351I"), "MAT", "position", "for ACA repeal -> market/right; against repeal -> welfare-state support", 1.0, v => binaryPolicyPos(v, 4.2, 1.8), v => binarySal(v, 1.8)),
    continuousSpec("CC16_426_1", L("CC16_426_1"), "MAT", "position", "increase welfare spending -> MAT 1; decrease -> MAT 5", 0.9, v => fivePoint(v), v => validCode(v, 1, 5) ? 1.7 : null),
    continuousSpec("CC16_426_2", L("CC16_426_2"), "MAT", "position", "increase health spending -> MAT 1; decrease -> MAT 5", 0.75, v => fivePoint(v), v => validCode(v, 1, 5) ? 1.4 : null),
    continuousSpec("CC16_426_3", L("CC16_426_3"), "MAT", "position", "increase education spending -> MAT 1; decrease -> MAT 5", 0.65, v => fivePoint(v), v => validCode(v, 1, 5) ? 1.2 : null),
    continuousSpec("CC16_426_4", L("CC16_426_4"), "ONT_S", "position", "increase law enforcement spending -> institutional trust/order", 0.45, v => validCode(v, 1, 5) ? 6 - v : null, v => validCode(v, 1, 5) ? 0.9 : null),
    continuousSpec("CC16_415r", L("CC16_415r"), "MAT", "position", "deficit tradeoff: spending cuts vs tax increases", 0.7, v => validCode(v, 1, 100) ? clamp(1 + (v / 100) * 4, 1, 5) : null, v => validCode(v, 1, 100) ? 1.2 : null, "CCES slider-style variable; lower values treated as tax-increase preference."),
  );

  const immigration: Array<[string, number, number, string]> = [
    ["CC16_331_1", 4.5, 1.8, "legalization for employed undocumented immigrants"],
    ["CC16_331_3", 4.6, 1.7, "legal status for childhood arrivals"],
    ["CC16_331_6", 4.0, 2.4, "more work visas"],
    ["CC16_331_2", 1.8, 4.2, "more border patrol"],
    ["CC16_331_4", 2.3, 3.8, "fine businesses hiring undocumented immigrants"],
    ["CC16_331_5", 1.4, 4.2, "admit no Syrian refugees"],
    ["CC16_331_7", 1.3, 4.5, "identify and deport undocumented immigrants"],
    ["CC16_331_8", 1.1, 4.7, "Muslim immigration ban"],
  ];
  for (const [variable, supportCu, opposeCu, note] of immigration) {
    specs.push(continuousSpec(variable, L(variable), "CU", "position", `yes/no on ${note}`, 1.05, v => binaryPolicyPos(v, supportCu, opposeCu), v => binarySal(v, 2.0)));
    specs.push(continuousSpec(variable, L(variable), "CD", "position", `immigration/cultural openness proxy: ${note}`, 0.7, v => {
      const cu = binaryPolicyPos(v, supportCu, opposeCu);
      return cu == null ? null : 6 - cu;
    }, v => binarySal(v, 1.5)));
  }
  specs.push(
    anchorSpec("CC16_331_2", L("CC16_331_2"), "national", "support border patrol -> national anchor", 0.45, v => v === 1),
    anchorSpec("CC16_331_5", L("CC16_331_5"), "national", "support refugee ban -> national anchor", 0.5, v => v === 1),
    anchorSpec("CC16_331_8", L("CC16_331_8"), "religious", "support Muslim ban -> religious/cultural boundary anchor", 0.45, v => v === 1),
    anchorSpec("CC16_331_1", L("CC16_331_1"), "global", "support legalization -> global/pluralist anchor", 0.3, v => v === 1),
  );

  specs.push(
    continuousSpec("CC16_422c", L("CC16_422c"), "CU", "position", "agree racism exists -> pluralist/race-conscious", 1.0, v => invertFive(v), v => validCode(v, 1, 5) ? 1.6 : null),
    continuousSpec("CC16_422d", L("CC16_422d"), "CU", "position", "agree white advantage -> pluralist/race-conscious", 1.1, v => invertFive(v), v => validCode(v, 1, 5) ? 1.9 : null),
    continuousSpec("CC16_422e", L("CC16_422e"), "CU", "position", "fear of other races -> particularist/closed", 0.8, v => fivePoint(v), v => validCode(v, 1, 5) ? 1.4 : null),
    continuousSpec("CC16_422f", L("CC16_422f"), "CU", "position", "racial problems rare -> less race-conscious", 0.95, v => fivePoint(v), v => validCode(v, 1, 5) ? 1.6 : null),
    // MOR direction inverted 2026-04-26: agree-racism-exists is race-conscious
    // universalism, which under spatial-scope MOR maps to WIDE moral circle
    // (MOR=5), not narrow. v=1 (strongly agree) → MOR=5; v=5 (strongly
    // disagree) → MOR=1. Was previously fivePoint (inverted under new semantics).
    continuousSpec("CC16_422c", L("CC16_422c"), "MOR", "position", "agree racism exists -> universalist moral scope (MOR high); disagree -> narrow scope (MOR low)", 0.5, v => invertFive(v), v => validCode(v, 1, 5) ? 1.0 : null),
  );

  specs.push(
    continuousSpec("CC16_330a", L("CC16_330a"), "CD", "position", "support background checks -> culturally open/regulatory", 0.45, v => binaryPolicyPos(v, 2.0, 4.0), v => binarySal(v, 1.1)),
    continuousSpec("CC16_330d", L("CC16_330d"), "CD", "position", "support assault-rifle ban -> culturally open/regulatory", 0.6, v => binaryPolicyPos(v, 1.8, 4.2), v => binarySal(v, 1.4)),
    continuousSpec("CC16_330e", L("CC16_330e"), "CD", "position", "support easier concealed carry -> culturally closed/gun-rights", 0.6, v => binaryPolicyPos(v, 4.3, 1.8), v => binarySal(v, 1.4)),
    continuousSpec("CC16_307", L("CC16_307"), "ONT_S", "position", "police make respondent feel safe -> local institutional trust", 0.55, v => validCode(v, 1, 4) ? 6 - (1 + ((v - 1) / 3) * 4) : null, v => validCode(v, 1, 4) ? 1.2 : null),
  );

  specs.push(
    continuousSpec("CC16_351A", L("CC16_351A"), "PRO", "position", "for Garland vote -> procedural/institutional norm", 0.55, v => binaryPolicyPos(v, 4.3, 2.2), v => binarySal(v, 1.2)),
    continuousSpec("CC16_351C", L("CC16_351C"), "PRO", "position", "for USA Freedom Act -> procedural civil-liberties compromise", 0.35, v => binaryPolicyPos(v, 3.8, 2.2), v => binarySal(v, 0.9)),
    continuousSpec("CC16_351B", L("CC16_351B"), "CU", "position", "for TPP -> globalist/open; against -> economic nationalism", 0.55, v => binaryPolicyPos(v, 4.0, 2.2), v => binarySal(v, 1.1)),
    continuousSpec("CC16_351B", L("CC16_351B"), "ONT_S", "position", "against TPP -> anti-establishment trade skepticism", 0.45, v => binaryPolicyPos(v, 3.7, 2.0), v => binarySal(v, 1.0)),
    continuousSpec("CC16_351D", L("CC16_351D"), "MAT", "position", "for trade adjustment -> social-insurance cushion", 0.35, v => binaryPolicyPos(v, 2.0, 3.8), v => binarySal(v, 0.9)),
    anchorSpec("CC16_351B", L("CC16_351B"), "global", "support TPP -> global/economic-open anchor", 0.25, v => v === 1),
    anchorSpec("CC16_351B", L("CC16_351B"), "class", "oppose TPP -> class/economic-national anchor", 0.25, v => v === 2),
  );

  specs.push(
    continuousSpec("CC16_312_1", L("CC16_312_1"), "CU", "position", "do not get involved in Syria -> particularist/isolationist", 0.45, v => binaryPolicyPos(v, 2.0, 3.4), v => binarySal(v, 1.0)),
    continuousSpec("CC16_312_2", L("CC16_312_2"), "MOR", "position", "send aid to refugees/affected countries -> wider moral concern", 0.5, v => binaryPolicyPos(v, 4.2, 2.4), v => binarySal(v, 1.1)),
    continuousSpec("CC16_312_7", L("CC16_312_7"), "ZS", "position", "send significant force -> threat/zero-sum orientation", 0.45, v => binaryPolicyPos(v, 4.2, 2.2), v => binarySal(v, 1.1)),
    continuousSpec("CC16_414_6", L("CC16_414_6"), "CU", "position", "military to uphold UN/international law -> global/institutional", 0.5, v => binaryPolicyPos(v, 4.3, 2.3), v => binarySal(v, 1.1)),
    continuousSpec("CC16_414_1", L("CC16_414_1"), "ZS", "position", "military to ensure oil supply -> zero-sum/resource realism", 0.4, v => binaryPolicyPos(v, 4.3, 2.4), v => binarySal(v, 1.0)),
  );

  specs.push(
    continuousSpec("newsint", L("newsint"), "ENG", "activation", "political interest -> engagement", 1.4, v => validCode(v, 1, 4) ? 6 - (1 + ((v - 1) / 3) * 4) : null, () => null),
    continuousSpec("votereg", L("votereg"), "ENG", "activation", "registered -> higher engagement", 0.55, v => v === 1 ? 3.8 : v === 2 ? 1.6 : null, () => null),
    continuousSpec("CC16_327", L("CC16_327"), "ENG", "activation", "primary participation -> higher engagement", 0.8, v => v === 1 ? 4.3 : v === 2 ? 2.3 : null, () => null),
    continuousSpec("CC16_417a_1", L("CC16_417a_1"), "ENG", "activation", "attended local meeting", 0.5, v => v === 1 ? 4.5 : v === 2 ? 2.8 : null, () => null),
    continuousSpec("CC16_417a_3", L("CC16_417a_3"), "ENG", "activation", "worked for campaign", 0.55, v => v === 1 ? 5.0 : v === 2 ? 2.8 : null, () => null),
    continuousSpec("CC16_417a_4", L("CC16_417a_4"), "ENG", "activation", "donated money", 0.55, v => v === 1 ? 4.6 : v === 2 ? 2.7 : null, () => null),
  );

  specs.push(
    // MOR direction inverted 2026-04-26: under spatial-scope MOR, born-again
    // identity correlates with NARROW moral circle (in-faith focus on
    // co-believers, parochial concern), not wide. v=1 (yes born-again) → MOR
    // ~2.0 (low/narrow); v=2 (no) → MOR ~3.5 (mid-wide). Old mapping treated
    // born-again as "high MOR" under progressive-vs-traditional moral content
    // framing — sign error under current spatial-scope semantics.
    continuousSpec("pew_bornagain", L("pew_bornagain"), "MOR", "position", "born-again -> narrow in-faith moral scope (MOR low); not -> wider scope", 0.55, v => v === 1 ? 2.0 : v === 2 ? 3.5 : null, v => v === 1 ? 1.5 : v === 2 ? 0.7 : null),
    // Salience direction unchanged — religious-importance respondents have
    // higher MOR salience regardless of position. Removing "traditional frame"
    // language from comment to reflect spatial-scope semantics.
    continuousSpec("pew_religimp", L("pew_religimp"), "MOR", "salience", "religion importance -> MOR salience (independent of position direction)", 0.75, v => validCode(v, 1, 4) ? 5 - v : null, v => validCode(v, 1, 4) ? clamp(3.2 - (v - 1), 0, 3) : null),
    anchorSpec("pew_bornagain", L("pew_bornagain"), "religious", "born-again -> religious anchor", 0.85, v => v === 1),
    anchorSpec("pew_religimp", L("pew_religimp"), "religious", "religion very important -> religious anchor", 0.65, v => v === 1),
  );

  specs.push(
    continuousSpec("union", L("union"), "TRB", "activation", "current/former union -> class anchor activation", 0.5, v => v === 1 ? 4.3 : v === 2 ? 3.5 : v === 3 ? 2.2 : null, () => null),
    continuousSpec("unionhh", L("unionhh"), "TRB", "activation", "household union -> class anchor activation", 0.4, v => v === 1 ? 4.0 : v === 2 ? 3.3 : v === 3 ? 2.2 : null, () => null),
    anchorSpec("union", L("union"), "class", "union membership -> class anchor", 0.9, v => v === 1 || v === 2),
    anchorSpec("unionhh", L("unionhh"), "class", "union household -> class anchor", 0.65, v => v === 1 || v === 2),
  );

  specs.push(
    continuousSpec("CC16_328", L("CC16_328"), "MAT", "position", "2016 primary choice: Sanders/Clinton/Trump factional signal", 0.8, primaryToMat, v => validCode(v, 1, 9) ? 1.4 : null),
    continuousSpec("CC16_328", L("CC16_328"), "ONT_S", "position", "primary choice: establishment vs outsider signal", 0.85, primaryToOntS, v => validCode(v, 1, 9) ? 1.5 : null),
    continuousSpec("CC16_328", L("CC16_328"), "COM", "position", "primary choice: revolutionary vs compromise signal", 0.6, primaryToCom, v => validCode(v, 1, 9) ? 1.0 : null),
    categorySpec("CC16_328", L("CC16_328"), "AES", "primary choice: Clinton technocrat, Sanders authentic/fighter, Trump fighter", 0.7, primaryToAes, v => validCode(v, 1, 9) ? 1.2 : null),
    anchorSpec("CC16_328", L("CC16_328"), "class", "Sanders primary vote -> class anchor", 0.55, v => v === 2),
    anchorSpec("CC16_328", L("CC16_328"), "national", "Trump primary vote -> national anchor", 0.65, v => v === 4),
  );

  specs.push(
    anchorSpec("race", L("race"), "ethnic_racial", "nonwhite race -> ethnic/racial anchor potential", 0.75, v => v === 2 || v === 3 || v === 4 || v === 5 || v === 6 || v === 7 || v === 8),
    anchorSpec("race", L("race"), "mixed_none", "white race alone -> mixed/no dominant anchor fallback", 0.25, v => v === 1),
    anchorSpec("Hispanic_origin_5", L("Hispanic_origin_5"), "ethnic_racial", "Cuban-origin Hispanic flag -> ethnic/racial anchor", 0.4, v => v === 1),
    anchorSpec("sexuality", L("sexuality"), "sexual", "LGBTQ identity -> sexual identity anchor", 0.8, v => validCode(v, 2, 5)),
    anchorSpec("trans", L("trans"), "gender", "trans identity -> gender identity anchor", 0.8, v => v === 1),
    anchorSpec("gender", L("gender"), "gender", "gender identity weak prior", 0.18, v => v === 1 || v === 2),
  );

  return specs;
}

function ideologyToEps(value: number | null): number[] | null {
  if (!validCode(value, 1, 5)) return null;
  if (value === 1) return [0.30, 0.12, 0.04, 0.06, 0.40, 0.08];
  if (value === 2) return [0.36, 0.25, 0.04, 0.06, 0.24, 0.05];
  if (value === 3) return [0.27, 0.36, 0.11, 0.12, 0.10, 0.04];
  if (value === 4) return [0.18, 0.27, 0.28, 0.18, 0.05, 0.04];
  return [0.12, 0.18, 0.36, 0.24, 0.04, 0.06];
}

function primaryToAes(value: number | null): number[] | null {
  if (value === 1) return [0.20, 0.48, 0.04, 0.08, 0.14, 0.06]; // Clinton
  if (value === 2) return [0.04, 0.15, 0.03, 0.42, 0.28, 0.08]; // Sanders
  if (value === 4) return [0.03, 0.04, 0.02, 0.18, 0.66, 0.07]; // Trump
  if (value === 5 || value === 6 || value === 7) return [0.35, 0.18, 0.12, 0.12, 0.18, 0.05];
  return null;
}

function primaryToMat(value: number | null): number | null {
  if (value === 1) return 2.3;
  if (value === 2) return 1.2;
  if (value === 4) return 3.8;
  if (value === 5 || value === 6 || value === 7) return 4.2;
  if (value === 3) return 1.8;
  if (value === 8 || value === 9) return 3.2;
  return null;
}

function primaryToOntS(value: number | null): number | null {
  if (value === 1) return 4.0;
  if (value === 2) return 1.8;
  if (value === 4) return 1.5;
  if (value === 5 || value === 6 || value === 7) return 3.2;
  if (value === 8 || value === 9) return 2.5;
  return null;
}

function primaryToCom(value: number | null): number | null {
  if (value === 1) return 4.0;
  if (value === 2) return 1.6;
  if (value === 4) return 1.2;
  if (value === 5 || value === 6 || value === 7) return 2.2;
  return null;
}

function partyFusionFromObamaApproval(value: number | null, row: CcesRow): number | null {
  const party = partyFromRow(row);
  if (!validCode(value, 1, 4) || !party) return null;
  if (party === "D") return value <= 2 ? 4.4 : 2.6;
  if (party === "R") return value >= 3 ? 4.3 : 2.4;
  return value <= 2 ? 3.0 : 2.6;
}

function pfFromPartyVars(row: CcesRow): number | null {
  const pid7 = row.num("pid7");
  if (pid7 === 1 || pid7 === 7) return 5.0;
  if (pid7 === 2 || pid7 === 6) return 4.2;
  if (pid7 === 3 || pid7 === 5) return 3.4;
  if (pid7 === 4) return 2.0;
  const pid3 = row.num("CC16_421a") ?? row.num("pid3");
  const demStrength = row.num("CC16_421_dem");
  const repStrength = row.num("CC16_421_rep");
  const lean = row.num("CC16_421b");
  if (pid3 === 1) return demStrength === 1 ? 5.0 : 4.2;
  if (pid3 === 2) return repStrength === 1 ? 5.0 : 4.2;
  if (pid3 === 3 && (lean === 1 || lean === 2)) return 3.3;
  if (pid3 === 3) return 2.0;
  return null;
}

function partyFromRow(row: CcesRow): PartyID | null {
  const pid7 = row.num("pid7");
  if (pid7 === 1 || pid7 === 2 || pid7 === 3) return "D";
  if (pid7 === 5 || pid7 === 6 || pid7 === 7) return "R";
  if (pid7 === 4) return "I";
  const pid3 = row.num("CC16_421a") ?? row.num("pid3");
  const lean = row.num("CC16_421b");
  if (pid3 === 1) return "D";
  if (pid3 === 2) return "R";
  if (pid3 === 3 && lean === 1) return "D";
  if (pid3 === 3 && lean === 2) return "R";
  if (pid3 === 3) return "I";
  return null;
}

function engagementLevelFromSignature(sig: NodeSignature): EngagementLevel {
  const eng = sig.ENG?.pos ?? 2.7;
  if (eng < 2.0) return "apolitical";
  if (eng < 3.0) return "casual";
  if (eng < 4.0) return "engaged";
  return "highly-engaged";
}

function reportedVoteFromRow(row: CcesRow): VoteBucket {
  const v = row.num("CC16_410a");
  if (v === 1) return "Republican";
  if (v === 2) return "Democratic";
  if (v === 3) return "Johnson";
  if (v === 4) return "Stein";
  if (v === 5 || v === 8) return "Other";
  return "AbstainUnknown";
}

function isValidatedVoter(row: CcesRow): boolean {
  const gvm = row.get("CL_E2016GVM");
  if (gvm && gvm !== "") return true;
  const status = row.get("CL_voterstatus");
  return status === "active" && row.num("CC16_401") === 5;
}

function stateFromRow(row: CcesRow): string {
  const fips = row.num("inputstate");
  if (fips != null && STATE_FIPS_TO_PO[fips]) return STATE_FIPS_TO_PO[fips]!;
  const clState = row.get("CL_state");
  return clState || "NA";
}

function raceGroup(row: CcesRow): string {
  const race = row.num("race");
  if (race === 1) return "white";
  if (race === 2) return "black";
  if (race === 3 || row.num("hispanic") === 1) return row.num("Hispanic_origin_5") === 1 ? "latino_cuban" : "latino_non_cuban";
  if (race === 4) return "asian";
  if (race === 5) return "native";
  if (race === 6) return "mixed";
  if (race === 8) return "middle_eastern";
  return "other_unknown";
}

function ageGroup(row: CcesRow): string {
  const birthyr = row.num("birthyr");
  if (birthyr == null) return "age_unknown";
  const age = 2016 - birthyr;
  if (age < 30) return "18_29";
  if (age < 45) return "30_44";
  if (age < 65) return "45_64";
  return "65_plus";
}

function educationGroup(row: CcesRow): string {
  const educ = row.num("educ");
  if (educ == null) return "educ_unknown";
  if (educ <= 2) return "noncollege_hs_or_less";
  if (educ <= 4) return "some_college";
  return "college_plus";
}

function weightFromRow(row: CcesRow, primary: string, fallback: string): number {
  const p = row.num(primary);
  if (p != null && p > 0) return p;
  const f = row.num(fallback);
  if (f != null && f > 0) return f;
  return 0;
}

async function loadBridgeRespondents(specs: EvidenceSpec[], labels: Map<string, string>): Promise<{
  respondents: BridgeRespondent[];
  schemaRows: SchemaAuditRow[];
}> {
  if (!existsSync(DATA_FILE)) {
    throw new Error(`Missing CCES file at ${DATA_FILE}. Download CCES16_Common_OUTPUT_Feb2018_VV.tab first.`);
  }

  const variables = new Set<string>([
    "V101", "commonweight", "commonweight_post", "commonweight_vv", "commonweight_vv_post",
    "inputstate", "birthyr", "gender", "educ", "race", "hispanic", "votereg",
    "CC16_401", "CC16_410a", "CL_E2016GVM", "CL_voterstatus",
    "pid3", "pid7", "CC16_421a", "CC16_421b", "CC16_421_dem", "CC16_421_rep",
    ...specs.map((s) => s.variable),
  ]);
  const counts = new Map<string, Map<string, number>>();
  const weightedNonMissing = new Map<string, number>();
  for (const v of variables) {
    counts.set(v, new Map());
    weightedNonMissing.set(v, 0);
  }

  const respondents: BridgeRespondent[] = [];
  const stream = createReadStream(DATA_FILE);
  const rl = createInterface({ input: stream, crlfDelay: Infinity });
  let header: string[] | null = null;
  let index = new Map<string, number>();
  let rowNumber = 0;

  for await (const line of rl) {
    if (!header) {
      header = parseDelimitedLine(line, "\t");
      index = new Map(header.map((name, idx) => [name, idx]));
      continue;
    }
    rowNumber++;
    const cells = parseDelimitedLine(line, "\t");
    const row: CcesRow = {
      get(name: string): string {
        const i = index.get(name);
        return i == null ? "" : (cells[i] ?? "");
      },
      num(name: string): number | null {
        return asNum(this.get(name));
      },
    };
    const adultWeight = weightFromRow(row, "commonweight", "commonweight_post");
    const voterWeight = weightFromRow(row, "commonweight_vv_post", "commonweight_post");
    for (const variable of variables) {
      const value = row.get(variable);
      const c = counts.get(variable)!;
      c.set(value, (c.get(value) ?? 0) + 1);
      if (value !== "" && value !== "." && value !== "NA") {
        weightedNonMissing.set(variable, (weightedNonMissing.get(variable) ?? 0) + adultWeight);
      }
    }

    const builder = new SignatureBuilder();
    for (const spec of specs) spec.apply(row, builder);
    addDemographicAnchorEvidence(row, builder);
    const { signature, anchorDist, touches, sd } = builder.finalize();
    const reportedVote = reportedVoteFromRow(row);
    const isReportedVoter = reportedVote !== "AbstainUnknown";
    respondents.push({
      id: row.get("V101") || String(rowNumber),
      state: stateFromRow(row),
      raceGroup: raceGroup(row),
      ageGroup: ageGroup(row),
      educationGroup: educationGroup(row),
      weightVoter: voterWeight,
      weightAdult: adultWeight,
      reportedVote,
      isReportedVoter,
      validatedVoter: isValidatedVoter(row),
      turnoutSplit: stableHash(row.get("V101") || String(rowNumber)) % 5 === 0 ? "holdout" : "train",
      partyID: partyFromRow(row),
      signature,
      engagement: engagementLevelFromSignature(signature),
      anchorDist,
      posteriorMeta: { touches, sd },
    });
  }

  const schemaRows = [...variables].sort().map((variable) => {
    const c = counts.get(variable)!;
    const nonmissing = [...c.entries()]
      .filter(([value]) => value !== "" && value !== "." && value !== "NA")
      .reduce((sum, [, n]) => sum + n, 0);
    const topValues = [...c.entries()]
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8)
      .map(([value, n]) => `${value || "<blank>"}:${n}`)
      .join(" | ");
    return {
      variable,
      label: labels.get(variable) ?? variable,
      present: header?.includes(variable) ? 1 : 0,
      nonmissing_n: nonmissing,
      weighted_nonmissing: round(weightedNonMissing.get(variable) ?? 0, 3),
      top_values: topValues,
    };
  });
  return { respondents, schemaRows };
}

function addDemographicAnchorEvidence(row: CcesRow, builder: SignatureBuilder): void {
  const race = row.num("race");
  const hispanic = row.num("hispanic");
  if (race === 2) builder.addAnchor("ethnic_racial", scaledEvidenceWeight("race", "TRB_ANCHOR:ethnic_racial", "anchor", 1.2));
  if (race === 3 || hispanic === 1) builder.addAnchor("ethnic_racial", scaledEvidenceWeight("race", "TRB_ANCHOR:ethnic_racial", "anchor", 0.95));
  if (race === 4 || race === 5 || race === 6 || race === 7 || race === 8) builder.addAnchor("ethnic_racial", scaledEvidenceWeight("race", "TRB_ANCHOR:ethnic_racial", "anchor", 0.65));
  if (race === 1) builder.addAnchor("mixed_none", scaledEvidenceWeight("race", "TRB_ANCHOR:mixed_none", "anchor", 0.18));
  if (row.num("Hispanic_origin_5") === 1) builder.addAnchor("ethnic_racial", scaledEvidenceWeight("Hispanic_origin_5", "TRB_ANCHOR:ethnic_racial", "anchor", 0.45));
  const gender = row.num("gender");
  if (gender === 1 || gender === 2) builder.addAnchor("gender", scaledEvidenceWeight("gender", "TRB_ANCHOR:gender", "anchor", 0.12));
}

function loadActualStateRows(): ActualStateRow[] {
  if (!existsSync(PRESIDENT_RESULTS_CSV)) return [];
  const rows = parseCsv(readFileSync(PRESIDENT_RESULTS_CSV, "utf-8"));
  const headers = rows.shift();
  if (!headers) return [];
  const byState = new Map<string, ActualStateRow>();
  for (const row of rows) {
    const rec = Object.fromEntries(headers.map((h, i) => [h, row[i] ?? ""]));
    if (rec.year !== "2016" || rec.office !== "US PRESIDENT") continue;
    const state = rec.state ?? "";
    const statePo = rec.state_po ?? "";
    const party = rec.party_simplified ?? "OTHER";
    const votes = Number(rec.candidatevotes ?? 0);
    const total = Number(rec.totalvotes ?? 0);
    const current = byState.get(statePo) ?? {
      state,
      state_po: statePo,
      dem_votes: 0,
      rep_votes: 0,
      third_votes: 0,
      total_votes: total,
      dem_share: 0,
      rep_share: 0,
      third_share: 0,
      dem_two_party: 0,
    };
    if (party === "DEMOCRAT") current.dem_votes += votes;
    else if (party === "REPUBLICAN") current.rep_votes += votes;
    else current.third_votes += votes;
    current.total_votes = total || current.total_votes;
    byState.set(statePo, current);
  }
  for (const row of byState.values()) {
    row.dem_share = row.total_votes > 0 ? row.dem_votes / row.total_votes : 0;
    row.rep_share = row.total_votes > 0 ? row.rep_votes / row.total_votes : 0;
    row.third_share = row.total_votes > 0 ? row.third_votes / row.total_votes : 0;
    const two = row.dem_votes + row.rep_votes;
    row.dem_two_party = two > 0 ? row.dem_votes / two : 0;
  }
  return [...byState.values()].sort((a, b) => a.state_po.localeCompare(b.state_po));
}

class VoteAccumulator {
  total = 0;
  democratic = 0;
  republican = 0;
  johnson = 0;
  stein = 0;
  other = 0;
  abstainUnknown = 0;

  add(bucket: VoteBucket, weight: number): void {
    if (weight <= 0 || !Number.isFinite(weight)) return;
    this.total += weight;
    if (bucket === "Democratic") this.democratic += weight;
    else if (bucket === "Republican") this.republican += weight;
    else if (bucket === "Johnson") this.johnson += weight;
    else if (bucket === "Stein") this.stein += weight;
    else if (bucket === "Other") this.other += weight;
    else this.abstainUnknown += weight;
  }

  addProbs(probs: Record<VoteBucket, number>, weight: number): void {
    for (const bucket of Object.keys(probs) as VoteBucket[]) this.add(bucket, probs[bucket] * weight);
  }

  third(): number {
    return this.johnson + this.stein + this.other;
  }

  twoPartyDem(): number {
    const two = this.democratic + this.republican;
    return two > 0 ? this.democratic / two : 0;
  }

  share(value: number): number {
    return this.total > 0 ? value / this.total : 0;
  }

  row(prefix: string): Record<string, number> {
    return {
      [`${prefix}_total_weight`]: round(this.total, 4),
      [`${prefix}_dem_share`]: round(this.share(this.democratic) * 100, 3),
      [`${prefix}_rep_share`]: round(this.share(this.republican) * 100, 3),
      [`${prefix}_johnson_share`]: round(this.share(this.johnson) * 100, 3),
      [`${prefix}_stein_share`]: round(this.share(this.stein) * 100, 3),
      [`${prefix}_other_share`]: round(this.share(this.other) * 100, 3),
      [`${prefix}_third_share`]: round(this.share(this.third()) * 100, 3),
      [`${prefix}_dem_two_party`]: round(this.twoPartyDem() * 100, 3),
    };
  }
}

class AccuracyAccumulator {
  weightedN = 0;
  top1Correct = 0;
  partyBucketCorrect = 0;
  logLoss = 0;
  brier = 0;

  add(actual: VoteBucket, predicted: VoteBucket, probs: Record<VoteBucket, number>, weight: number): void {
    if (actual === "AbstainUnknown" || weight <= 0) return;
    this.weightedN += weight;
    if (actual === predicted) this.top1Correct += weight;
    if (majorBucket(actual) === majorBucket(predicted)) this.partyBucketCorrect += weight;
    const p = clamp(probs[actual] ?? 0.000001, 0.000001, 0.999999);
    this.logLoss += -Math.log(p) * weight;
    for (const b of ["Democratic", "Republican", "Johnson", "Stein", "Other"] as VoteBucket[]) {
      const y = b === actual ? 1 : 0;
      const diff = (probs[b] ?? 0) - y;
      this.brier += diff * diff * weight;
    }
  }

  row(): Record<string, number> {
    return {
      accuracy_top1: round((this.top1Correct / Math.max(1, this.weightedN)) * 100, 3),
      accuracy_party_bucket: round((this.partyBucketCorrect / Math.max(1, this.weightedN)) * 100, 3),
      log_loss: round(this.logLoss / Math.max(1, this.weightedN), 4),
      brier: round(this.brier / Math.max(1, this.weightedN), 4),
      validation_weighted_n: round(this.weightedN, 3),
    };
  }
}

function majorBucket(bucket: VoteBucket): "D" | "R" | "T" | "A" {
  if (bucket === "Democratic") return "D";
  if (bucket === "Republican") return "R";
  if (bucket === "AbstainUnknown") return "A";
  return "T";
}

function candidateToBucket(name: string, party: string): VoteBucket {
  if (party === "Democratic") return "Democratic";
  if (party === "Republican") return "Republican";
  if (name === "Johnson") return "Johnson";
  if (name === "Stein") return "Stein";
  return "Other";
}

function predictionToProbs(
  prediction: ElectionPrediction,
  method: Method,
  alphas?: BucketAlphas,
): Record<VoteBucket, number> {
  const probs: Record<VoteBucket, number> = {
    Democratic: 0,
    Republican: 0,
    Johnson: 0,
    Stein: 0,
    Other: 0,
    AbstainUnknown: 0,
  };
  if (method === "wta") {
    if (prediction.decision === "abstain") {
      probs.AbstainUnknown = 1;
    } else {
      const nearest = prediction.nearest;
      probs[candidateToBucket(nearest.name, nearest.party)] = 1;
    }
    return probs;
  }
  const t = method === "softmax_t1.0"
    ? 1.0
    : method === "softmax_t1.5" || method === "calibrated_softmax_t1.5" || method === "state_calibrated_softmax_t1.5"
      ? 1.5
      : 2.0;
  const exps = prediction.candidates.map((c) => Math.exp(-c.distance / t));
  if ((method === "calibrated_softmax_t1.5" || method === "state_calibrated_softmax_t1.5") && alphas) {
    for (let i = 0; i < prediction.candidates.length; i++) {
      const candidate = prediction.candidates[i]!;
      const bucket = candidateToBucket(candidate.name, candidate.party);
      if (bucket !== "AbstainUnknown") exps[i] = Math.exp((alphas[bucket] ?? 0) - candidate.distance / t);
    }
  }
  const total = exps.reduce((sum, v) => sum + v, 0);
  prediction.candidates.forEach((candidate, idx) => {
    const bucket = candidateToBucket(candidate.name, candidate.party);
    probs[bucket] += total > 0 ? exps[idx]! / total : 0;
  });
  return probs;
}

function topBucket(probs: Record<VoteBucket, number>): VoteBucket {
  return (Object.entries(probs) as Array<[VoteBucket, number]>)
    .filter(([b]) => b !== "AbstainUnknown")
    .sort(([, a], [, b]) => b - a)[0]?.[0] ?? "AbstainUnknown";
}

function voteProbsForRespondent(
  respondent: BridgeRespondent,
  candidates: CandidateProfile[],
  method: Method,
  alphas?: BucketAlphas,
  stateAlphas?: Map<string, BucketAlphas>,
): Record<VoteBucket, number> {
  const ctx = getContext(2016);
  if (!ctx) throw new Error("Missing 2016 context");
  const prediction = predictVote(
    respondent.signature,
    candidates,
    ctx,
    respondent.engagement,
    respondent.partyID,
    respondent.anchorDist,
    null,
    true,
    null,
  );
  const effectiveAlphas = method === "state_calibrated_softmax_t1.5"
    ? (stateAlphas?.get(respondent.state) ?? alphas)
    : alphas;
  return predictionToProbs(prediction, method, effectiveAlphas);
}

function emptyAlphas(): BucketAlphas {
  return {
    Democratic: 0,
    Republican: 0,
    Johnson: 0,
    Stein: 0,
    Other: 0,
  };
}

function fitCalibratedSoftmaxAlphas(
  respondents: BridgeRespondent[],
  candidates: CandidateProfile[],
  reported: VoteAccumulator,
): BucketAlphas {
  return fitCalibratedSoftmaxAlphasToTargets(respondents, candidates, {
    Democratic: Math.max(1e-6, reported.democratic),
    Republican: Math.max(1e-6, reported.republican),
    Johnson: Math.max(1e-6, reported.johnson),
    Stein: Math.max(1e-6, reported.stein),
    Other: Math.max(1e-6, reported.other),
  });
}

function fitCalibratedSoftmaxAlphasToTargets(
  respondents: BridgeRespondent[],
  candidates: CandidateProfile[],
  targets: BucketAlphas,
): BucketAlphas {
  const ctx = getContext(2016);
  if (!ctx) throw new Error("Missing 2016 context");
  const alphas = emptyAlphas();
  for (let iter = 0; iter < 80; iter++) {
    const modeled = emptyAlphas();
    for (const respondent of respondents) {
      if (!respondent.isReportedVoter || respondent.weightVoter <= 0) continue;
      const prediction = predictVote(
        respondent.signature,
        candidates,
        ctx,
        respondent.engagement,
        respondent.partyID,
        respondent.anchorDist,
        null,
        true,
        null,
      );
      const probs = predictionToProbs(prediction, "calibrated_softmax_t1.5", alphas);
      modeled.Democratic += probs.Democratic * respondent.weightVoter;
      modeled.Republican += probs.Republican * respondent.weightVoter;
      modeled.Johnson += probs.Johnson * respondent.weightVoter;
      modeled.Stein += probs.Stein * respondent.weightVoter;
      modeled.Other += probs.Other * respondent.weightVoter;
    }
    for (const bucket of Object.keys(alphas) as Array<keyof BucketAlphas>) {
      alphas[bucket] += 0.75 * Math.log(targets[bucket] / Math.max(1e-6, modeled[bucket]));
    }
    const meanAlpha = Object.values(alphas).reduce((sum, v) => sum + v, 0) / Object.keys(alphas).length;
    for (const bucket of Object.keys(alphas) as Array<keyof BucketAlphas>) alphas[bucket] -= meanAlpha;
  }
  return alphas;
}

function fitStateCalibratedSoftmaxAlphas(
  respondents: BridgeRespondent[],
  candidates: CandidateProfile[],
  actualRows: ActualStateRow[],
  reported: VoteAccumulator,
): Map<string, BucketAlphas> {
  const byState = new Map<string, BridgeRespondent[]>();
  for (const respondent of respondents) {
    if (!respondent.isReportedVoter || respondent.weightVoter <= 0) continue;
    const stateRows = byState.get(respondent.state) ?? [];
    stateRows.push(respondent);
    byState.set(respondent.state, stateRows);
  }
  const actualByState = new Map(actualRows.map((r) => [r.state_po, r]));
  const thirdTotal = Math.max(1e-6, reported.third());
  const johnsonFrac = reported.johnson / thirdTotal;
  const steinFrac = reported.stein / thirdTotal;
  const otherFrac = reported.other / thirdTotal;
  const stateAlphas = new Map<string, BucketAlphas>();
  const nationalFallback = fitCalibratedSoftmaxAlphas(respondents, candidates, reported);
  for (const [state, stateRespondents] of byState) {
    const actual = actualByState.get(state);
    const stateWeight = stateRespondents.reduce((sum, r) => sum + r.weightVoter, 0);
    if (!actual || stateWeight <= 0) {
      stateAlphas.set(state, nationalFallback);
      continue;
    }
    const targets: BucketAlphas = {
      Democratic: Math.max(1e-6, stateWeight * actual.dem_share),
      Republican: Math.max(1e-6, stateWeight * actual.rep_share),
      Johnson: Math.max(1e-6, stateWeight * actual.third_share * johnsonFrac),
      Stein: Math.max(1e-6, stateWeight * actual.third_share * steinFrac),
      Other: Math.max(1e-6, stateWeight * actual.third_share * otherFrac),
    };
    stateAlphas.set(state, fitCalibratedSoftmaxAlphasToTargets(stateRespondents, candidates, targets));
  }
  return stateAlphas;
}

function makeSteinCandidate(base: CandidateProfile): CandidateProfile {
  return {
    ...base,
    name: "Stein",
    party: "Independent",
    year: 2016,
    MAT: 1,
    CD: 1,
    CU: 5,
    MOR: 2,
    PRO: 2,
    COM: 1,
    ZS: 4,
    ONT_H: 4,
    ONT_S: 1,
    PF: 1,
    TRB: 2,
    ENG: 4,
    EPS: 4,
    AES: 5,
  };
}

function makeOtherCandidate(base: CandidateProfile): CandidateProfile {
  return {
    ...base,
    name: "Other",
    party: "Independent",
    year: 2016,
    MAT: 3,
    CD: 3,
    CU: 3,
    MOR: 3,
    PRO: 2,
    COM: 1,
    ZS: 3,
    ONT_H: 3,
    ONT_S: 1,
    PF: 1,
    TRB: 1,
    ENG: 2,
    EPS: 4,
    AES: 3,
  };
}

function sandersProfile(kind: "static" | "perceived"): CandidateProfile {
  const base = ELECTIONS.find((e) => e.year === 2016)?.candidates.find((c) => c.name === "H. Clinton");
  if (!base) throw new Error("Missing 2016 Clinton profile");
  return kind === "static"
    ? {
      ...base,
      name: "Sanders",
      party: "Democratic",
      year: 2016,
      MAT: 1, CD: 2, CU: 3, MOR: 4.5, PRO: 2, COM: 1.5,
      ZS: 4, ONT_H: 4, ONT_S: 2, PF: 4, TRB: 3.5, ENG: 5,
      EPS: 0, AES: 3,
    }
    : {
      ...base,
      name: "Sanders",
      party: "Democratic",
      year: 2016,
      MAT: 1, CD: 2.5, CU: 3, MOR: 4, PRO: 1.5, COM: 1.5,
      ZS: 4.5, ONT_H: 3.5, ONT_S: 1.5, PF: 4, TRB: 3.5, ENG: 5,
      EPS: 0, AES: 4,
    };
}

function applyCandidateVariant(candidates: CandidateProfile[], variant: CandidateVariant): CandidateProfile[] {
  if (variant === "canonical") return candidates;
  return candidates.map((candidate) => {
    if (candidate.name === "Trump") {
      return {
        ...candidate,
        MOR: 2,
        ONT_S: 1,
        PF: 5,
      };
    }
    if (candidate.name === "H. Clinton") {
      return {
        ...candidate,
        AES: 1,
      };
    }
    return candidate;
  });
}

function candidatesForScenario(scenario: ScenarioId, variant: CandidateVariant): CandidateProfile[] {
  const election2016 = ELECTIONS.find((e) => e.year === 2016);
  if (!election2016) throw new Error("Missing 2016 election");
  const base = election2016.candidates.map((c) => ({ ...c }));
  const clinton = base.find((c) => c.name === "H. Clinton");
  if (!clinton) throw new Error("Missing Clinton candidate");
  const withThirds = applyCandidateVariant([...base, makeSteinCandidate(clinton), makeOtherCandidate(clinton)], variant);
  if (scenario === "baseline_clinton") return withThirds;
  const replacement = sandersProfile(scenario === "sanders_static" ? "static" : "perceived");
  const replacementWithVariant = applyCandidateVariant([replacement], variant)[0]!;
  return withThirds.map((c) => c.name === "H. Clinton" ? replacementWithVariant : c);
}

function runScenario(
  respondents: BridgeRespondent[],
  scenario: ScenarioId,
  method: Method,
  candidateVariant: CandidateVariant,
  mode: RunMode,
  alphas?: BucketAlphas,
  stateAlphas?: Map<string, BucketAlphas>,
  turnoutModel?: TurnoutModel,
  turnoutSettings?: TurnoutSettings,
): ScenarioRun {
  const candidates = candidatesForScenario(scenario, candidateVariant);
  const baselineCandidates = scenario === "baseline_clinton"
    ? candidates
    : candidatesForScenario("baseline_clinton", candidateVariant);
  const national = new VoteAccumulator();
  const states = new Map<string, VoteAccumulator>();
  const byGroup = new Map<string, VoteAccumulator>();
  const accuracy = scenario === "baseline_clinton" && mode === "fixed_voter" ? new AccuracyAccumulator() : undefined;
  const settings = turnoutSettings ?? defaultTurnoutSettings(scenario);

  for (const respondent of respondents) {
    if (mode === "fixed_voter" && (!respondent.isReportedVoter || respondent.weightVoter <= 0)) continue;
    if (mode === "elastic_turnout" && (!turnoutModel || respondent.weightAdult <= 0)) continue;
    const probs = voteProbsForRespondent(respondent, candidates, method, alphas, stateAlphas);
    let weight = respondent.weightVoter;
    if (mode === "elastic_turnout" && turnoutModel) {
      const baselineProbs = scenario === "baseline_clinton"
        ? probs
        : voteProbsForRespondent(respondent, baselineCandidates, method, alphas, stateAlphas);
      const baseTurnout = predictTurnout(turnoutModel, respondent);
      weight = respondent.weightAdult * scenarioTurnoutProbability(
        respondent,
        scenario,
        baseTurnout,
        probs,
        baselineProbs,
        settings,
      );
    }
    national.addProbs(probs, weight);
    mapAccumulator(states, respondent.state).addProbs(probs, weight);
    mapAccumulator(byGroup, `${respondent.raceGroup}|${respondent.ageGroup}|${respondent.educationGroup}`).addProbs(probs, weight);
    if (accuracy) accuracy.add(respondent.reportedVote, topBucket(probs), probs, weight);
  }
  return { scenario, candidateVariant, method, mode, national, states, byGroup, accuracy };
}

function mapAccumulator(map: Map<string, VoteAccumulator>, key: string): VoteAccumulator {
  let acc = map.get(key);
  if (!acc) {
    acc = new VoteAccumulator();
    map.set(key, acc);
  }
  return acc;
}

function reportedVoteAccumulators(respondents: BridgeRespondent[]): {
  national: VoteAccumulator;
  states: Map<string, VoteAccumulator>;
  byGroup: Map<string, VoteAccumulator>;
} {
  const national = new VoteAccumulator();
  const states = new Map<string, VoteAccumulator>();
  const byGroup = new Map<string, VoteAccumulator>();
  for (const r of respondents) {
    if (!r.isReportedVoter || r.weightVoter <= 0) continue;
    national.add(r.reportedVote, r.weightVoter);
    mapAccumulator(states, r.state).add(r.reportedVote, r.weightVoter);
    mapAccumulator(byGroup, `${r.raceGroup}|${r.ageGroup}|${r.educationGroup}`).add(r.reportedVote, r.weightVoter);
  }
  return { national, states, byGroup };
}

function turnoutFeatureMap(respondent: BridgeRespondent): Map<string, number> {
  const features = new Map<string, number>();
  features.set("bias", 1);
  for (const node of CONTINUOUS_NODES) {
    const entry = respondent.signature[node];
    const pos = entry?.pos ?? priorPos(node);
    features.set(`node:${node}:pos`, (pos - 3) / 2);
    if (!isSelfNodeId(node)) features.set(`node:${node}:sal`, (entry?.sal ?? priorSal(node)) / 3);
  }
  for (const node of CATEGORICAL_NODES) {
    const entry = respondent.signature[node];
    const dist = entry?.catDist ?? Array(6).fill(1 / 6);
    for (let i = 0; i < 6; i++) features.set(`cat:${node}:${i}`, dist[i] ?? 0);
    features.set(`cat:${node}:sal`, (entry?.sal ?? 1) / 3);
  }
  features.set(`party:${respondent.partyID ?? "unknown"}`, 1);
  features.set(`race:${respondent.raceGroup}`, 1);
  features.set(`age:${respondent.ageGroup}`, 1);
  features.set(`education:${respondent.educationGroup}`, 1);
  features.set(`state:${respondent.state}`, 1);
  features.set(`engagement:${respondent.engagement}`, 1);
  features.set(`race_age:${respondent.raceGroup}|${respondent.ageGroup}`, 1);
  features.set(`race_educ:${respondent.raceGroup}|${respondent.educationGroup}`, 1);
  return features;
}

interface SparseTurnoutExample {
  indices: number[];
  values: number[];
  y: number;
  weight: number;
  split: TurnoutSplit;
}

function buildTurnoutExamples(respondents: BridgeRespondent[]): {
  featureNames: string[];
  examples: SparseTurnoutExample[];
} {
  const featureSet = new Set<string>();
  const featureMaps = respondents.map((respondent) => {
    const map = turnoutFeatureMap(respondent);
    for (const key of map.keys()) featureSet.add(key);
    return map;
  });
  const featureNames = ["bias", ...[...featureSet].filter((f) => f !== "bias").sort()];
  const featureIndex = new Map(featureNames.map((name, idx) => [name, idx]));
  const examples = respondents
    .filter((respondent) => respondent.weightAdult > 0)
    .map((respondent, idx) => {
      const indices: number[] = [];
      const values: number[] = [];
      for (const [key, value] of featureMaps[idx]!) {
        const featureIdx = featureIndex.get(key);
        if (featureIdx == null || value === 0) continue;
        indices.push(featureIdx);
        values.push(value);
      }
      return {
        indices,
        values,
        y: respondent.validatedVoter ? 1 : 0,
        weight: respondent.weightAdult,
        split: respondent.turnoutSplit,
      };
    });
  return { featureNames, examples };
}

function sparseDot(coefficients: number[], example: Pick<SparseTurnoutExample, "indices" | "values">): number {
  let z = 0;
  for (let i = 0; i < example.indices.length; i++) z += coefficients[example.indices[i]!]! * example.values[i]!;
  return z;
}

function trainTurnoutModel(respondents: BridgeRespondent[]): TurnoutModel {
  const { featureNames, examples } = buildTurnoutExamples(respondents);
  const coefficients = Array(featureNames.length).fill(0);
  const lambda = 0.012;
  const iterations = 260;
  const trainWeight = examples
    .filter((example) => example.split === "train")
    .reduce((sum, example) => sum + example.weight, 0);
  for (let iter = 0; iter < iterations; iter++) {
    const gradient = Array(featureNames.length).fill(0);
    for (const example of examples) {
      if (example.split !== "train") continue;
      const p = sigmoid(sparseDot(coefficients, example));
      const err = (p - example.y) * example.weight;
      for (let i = 0; i < example.indices.length; i++) {
        gradient[example.indices[i]!] += err * example.values[i]!;
      }
    }
    const lr = 0.42 / Math.sqrt(1 + iter / 35);
    for (let j = 0; j < coefficients.length; j++) {
      const regularization = j === 0 ? 0 : lambda * coefficients[j]!;
      coefficients[j] -= lr * ((gradient[j]! / Math.max(1, trainWeight)) + regularization);
    }
  }
  return { featureNames, coefficients, lambda, iterations };
}

function predictTurnout(model: TurnoutModel, respondent: BridgeRespondent): number {
  const featureIndex = new Map(model.featureNames.map((name, idx) => [name, idx]));
  const map = turnoutFeatureMap(respondent);
  let z = 0;
  for (const [key, value] of map) {
    const idx = featureIndex.get(key);
    if (idx != null) z += model.coefficients[idx]! * value;
  }
  return sigmoid(z);
}

function turnoutMetrics(model: TurnoutModel, respondents: BridgeRespondent[], split: TurnoutSplit | "all"): TurnoutMetrics {
  let weightedN = 0;
  let actual = 0;
  let predicted = 0;
  let logLossSum = 0;
  let brier = 0;
  let correct = 0;
  for (const respondent of respondents) {
    if (respondent.weightAdult <= 0 || (split !== "all" && respondent.turnoutSplit !== split)) continue;
    const y = respondent.validatedVoter ? 1 : 0;
    const p = clamp(predictTurnout(model, respondent), 0.000001, 0.999999);
    const w = respondent.weightAdult;
    weightedN += w;
    actual += y * w;
    predicted += p * w;
    logLossSum += -(y * Math.log(p) + (1 - y) * Math.log(1 - p)) * w;
    brier += (p - y) * (p - y) * w;
    if ((p >= 0.5 ? 1 : 0) === y) correct += w;
  }
  return {
    split,
    weightedN,
    actualTurnout: actual / Math.max(1, weightedN),
    predictedTurnout: predicted / Math.max(1, weightedN),
    logLoss: logLossSum / Math.max(1, weightedN),
    brier: brier / Math.max(1, weightedN),
    accuracy: correct / Math.max(1, weightedN),
  };
}

function turnoutValidationRows(model: TurnoutModel, respondents: BridgeRespondent[]): Array<Record<string, unknown>> {
  return (["train", "holdout", "all"] as Array<TurnoutSplit | "all">).map((split) => {
    const metrics = turnoutMetrics(model, respondents, split);
    return {
      split: metrics.split,
      weighted_n: round(metrics.weightedN, 3),
      actual_turnout: round(metrics.actualTurnout * 100, 3),
      predicted_turnout: round(metrics.predictedTurnout * 100, 3),
      residual_turnout: round((metrics.predictedTurnout - metrics.actualTurnout) * 100, 3),
      log_loss: round(metrics.logLoss, 5),
      brier: round(metrics.brier, 5),
      accuracy: round(metrics.accuracy * 100, 3),
      features: model.featureNames.length,
      iterations: model.iterations,
      lambda: model.lambda,
    };
  });
}

function turnoutCalibrationRows(model: TurnoutModel, respondents: BridgeRespondent[]): Array<Record<string, unknown>> {
  const rows: Array<Record<string, unknown>> = [];
  for (const split of ["holdout", "all"] as Array<TurnoutSplit | "all">) {
    const buckets = Array.from({ length: 10 }, () => ({
      weightedN: 0,
      actual: 0,
      predicted: 0,
      minP: Number.POSITIVE_INFINITY,
      maxP: 0,
    }));
    for (const respondent of respondents) {
      if (respondent.weightAdult <= 0 || (split !== "all" && respondent.turnoutSplit !== split)) continue;
      const p = predictTurnout(model, respondent);
      const idx = Math.min(9, Math.max(0, Math.floor(p * 10)));
      const bucket = buckets[idx]!;
      const w = respondent.weightAdult;
      bucket.weightedN += w;
      bucket.actual += (respondent.validatedVoter ? 1 : 0) * w;
      bucket.predicted += p * w;
      bucket.minP = Math.min(bucket.minP, p);
      bucket.maxP = Math.max(bucket.maxP, p);
    }
    buckets.forEach((bucket, idx) => {
      if (bucket.weightedN <= 0) return;
      rows.push({
        split,
        decile: idx,
        weighted_n: round(bucket.weightedN, 3),
        predicted_min: round(bucket.minP * 100, 3),
        predicted_max: round(bucket.maxP * 100, 3),
        actual_turnout: round((bucket.actual / bucket.weightedN) * 100, 3),
        predicted_turnout: round((bucket.predicted / bucket.weightedN) * 100, 3),
      });
    });
  }
  return rows;
}

function turnoutFeatureWeightRows(model: TurnoutModel): Array<Record<string, unknown>> {
  return model.featureNames
    .map((feature, idx) => ({
      feature,
      coefficient: round(model.coefficients[idx]!, 6),
      abs_coefficient: round(Math.abs(model.coefficients[idx]!), 6),
    }))
    .sort((a, b) => Number(b.abs_coefficient) - Number(a.abs_coefficient));
}

function defaultTurnoutSettings(scenario: ScenarioId): TurnoutSettings {
  if (scenario === "sanders_static") {
    return {
      label: "static_default",
      affinityCoefficient: 1.0,
      blackPenalty: -0.16,
      youngBoost: 0.18,
      latinoBoost: 0.06,
      flCubanPenalty: -0.10,
      collegePlusPenalty: -0.03,
    };
  }
  if (scenario === "sanders_perceived") {
    return {
      label: "perceived_default",
      affinityCoefficient: 1.05,
      blackPenalty: -0.27,
      youngBoost: 0.14,
      latinoBoost: 0.02,
      flCubanPenalty: -0.24,
      collegePlusPenalty: -0.08,
    };
  }
  return {
    label: "baseline",
    affinityCoefficient: 0,
    blackPenalty: 0,
    youngBoost: 0,
    latinoBoost: 0,
    flCubanPenalty: 0,
    collegePlusPenalty: 0,
  };
}

function scenarioTurnoutProbability(
  respondent: BridgeRespondent,
  scenario: ScenarioId,
  baseProbability: number,
  scenarioProbs: Record<VoteBucket, number>,
  baselineProbs: Record<VoteBucket, number>,
  settings: TurnoutSettings,
): number {
  if (scenario === "baseline_clinton") return baseProbability;
  const demDelta = scenarioProbs.Democratic - baselineProbs.Democratic;
  let delta = settings.affinityCoefficient * demDelta;
  if (respondent.raceGroup === "black") delta += settings.blackPenalty;
  if (respondent.ageGroup === "18_29") delta += settings.youngBoost;
  if (respondent.raceGroup === "latino_non_cuban") delta += settings.latinoBoost;
  if (respondent.raceGroup === "latino_cuban") {
    delta += respondent.state === "FL" ? settings.flCubanPenalty : settings.latinoBoost * 0.4;
  }
  if (respondent.educationGroup === "college_plus" && respondent.partyID !== "D") delta += settings.collegePlusPenalty;
  return clamp(sigmoid(logit(baseProbability) + delta), 0.02, 0.98);
}

function nodeDistributionRows(respondents: BridgeRespondent[]): Array<Record<string, unknown>> {
  const rows: Array<Record<string, unknown>> = [];
  for (const node of [...CONTINUOUS_NODES, ...CATEGORICAL_NODES, "TRB_ANCHOR"]) {
    let w = 0;
    let pos = 0;
    let sal = 0;
    let touches = 0;
    let sd = 0;
    for (const r of respondents) {
      const weight = r.weightAdult;
      if (weight <= 0) continue;
      w += weight;
      if (node === "TRB_ANCHOR") {
        const maxIdx = r.anchorDist.indexOf(Math.max(...r.anchorDist));
        pos += (maxIdx + 1) * weight;
        sal += (1 - r.anchorDist[8]!) * 3 * weight;
      } else {
        const entry = r.signature[node as keyof NodeSignature];
        pos += (entry?.pos ?? 0) * weight;
        sal += (entry?.sal ?? 0) * weight;
      }
      touches += (r.posteriorMeta.touches[node] ?? 0) * weight;
      sd += (r.posteriorMeta.sd[node] ?? 0) * weight;
    }
    rows.push({
      node,
      adult_weighted_mean_pos: round(pos / Math.max(w, 1), 4),
      adult_weighted_mean_sal: round(sal / Math.max(w, 1), 4),
      adult_weighted_mean_touches: round(touches / Math.max(w, 1), 3),
      adult_weighted_mean_sd: round(sd / Math.max(w, 1), 4),
    });
  }
  return rows;
}

function validationNationalRows(
  reported: VoteAccumulator,
  runs: ScenarioRun[],
): Array<Record<string, unknown>> {
  return runs
    .filter((r) => r.scenario === "baseline_clinton")
    .map((run) => {
      const row = {
        scenario: run.scenario,
        candidate_variant: run.candidateVariant,
        method: run.method,
        mode: run.mode,
        ...reported.row("cces_reported"),
        ...run.national.row("model"),
        model_minus_reported_dem_share: round((run.national.share(run.national.democratic) - reported.share(reported.democratic)) * 100, 3),
        model_minus_reported_rep_share: round((run.national.share(run.national.republican) - reported.share(reported.republican)) * 100, 3),
        model_minus_reported_dem_two_party: round((run.national.twoPartyDem() - reported.twoPartyDem()) * 100, 3),
        nonideo_enabled: process.env.PRISM_NONIDEO === "0" ? 0 : 1,
      };
      return { ...row, ...(run.accuracy?.row() ?? {}) };
    });
}

function stateValidationRows(
  reportedStates: Map<string, VoteAccumulator>,
  baselineRuns: ScenarioRun[],
  actualRows: ActualStateRow[],
): Array<Record<string, unknown>> {
  const actualByState = new Map(actualRows.map((r) => [r.state_po, r]));
  const rows: Array<Record<string, unknown>> = [];
  for (const baselineRun of baselineRuns) {
    const states = [...new Set([...reportedStates.keys(), ...baselineRun.states.keys(), ...actualByState.keys()])].sort();
    for (const state of states) {
      const reported = reportedStates.get(state) ?? new VoteAccumulator();
      const model = baselineRun.states.get(state) ?? new VoteAccumulator();
      const actual = actualByState.get(state);
      rows.push({
        candidate_variant: baselineRun.candidateVariant,
        method: baselineRun.method,
        mode: baselineRun.mode,
        state,
        reported_weight: round(reported.total, 3),
        actual_dem_share: actual ? round(actual.dem_share * 100, 3) : "",
        actual_rep_share: actual ? round(actual.rep_share * 100, 3) : "",
        actual_third_share: actual ? round(actual.third_share * 100, 3) : "",
        actual_dem_two_party: actual ? round(actual.dem_two_party * 100, 3) : "",
        ...reported.row("cces_reported"),
        ...model.row("model"),
        model_minus_actual_dem_two_party: actual ? round((model.twoPartyDem() - actual.dem_two_party) * 100, 3) : "",
        reported_minus_actual_dem_two_party: actual ? round((reported.twoPartyDem() - actual.dem_two_party) * 100, 3) : "",
      });
    }
  }
  return rows;
}

function counterfactualNationalRows(runs: ScenarioRun[]): Array<Record<string, unknown>> {
  const baseByMethod = new Map(runs.filter(r => r.scenario === "baseline_clinton").map(r => [`${r.candidateVariant}|${r.method}|${r.mode}`, r]));
  return runs.map((run) => {
    const base = baseByMethod.get(`${run.candidateVariant}|${run.method}|${run.mode}`);
    return {
      scenario: run.scenario,
      candidate_variant: run.candidateVariant,
      method: run.method,
      mode: run.mode,
      ...run.national.row("model"),
      dem_two_party_delta_vs_clinton: base ? round((run.national.twoPartyDem() - base.national.twoPartyDem()) * 100, 3) : 0,
      dem_share_delta_vs_clinton: base ? round((run.national.share(run.national.democratic) - base.national.share(base.national.democratic)) * 100, 3) : 0,
      nonideo_enabled: process.env.PRISM_NONIDEO === "0" ? 0 : 1,
    };
  });
}

function counterfactualStateRows(runs: ScenarioRun[], actualRows: ActualStateRow[]): Array<Record<string, unknown>> {
  const rows: Array<Record<string, unknown>> = [];
  const actualByState = new Map(actualRows.map((r) => [r.state_po, r]));
  for (const run of runs) {
    if (run.scenario === "baseline_clinton") continue;
    const base = runs.find((r) => r.scenario === "baseline_clinton" && r.method === run.method && r.candidateVariant === run.candidateVariant && r.mode === run.mode);
    if (!base) continue;
    const states = [...new Set([...base.states.keys(), ...run.states.keys()])].sort();
    for (const state of states) {
      const baseAcc = base.states.get(state) ?? new VoteAccumulator();
      const scenAcc = run.states.get(state) ?? new VoteAccumulator();
      const actual = actualByState.get(state);
      const ev = ELECTORAL_VOTES_2016[state] ?? 0;
      rows.push({
        scenario: run.scenario,
        candidate_variant: run.candidateVariant,
        method: run.method,
        mode: run.mode,
        state,
        electoral_votes: ev,
        actual_2016_dem_two_party: actual ? round(actual.dem_two_party * 100, 3) : "",
        baseline_model_dem_two_party: round(baseAcc.twoPartyDem() * 100, 3),
        scenario_model_dem_two_party: round(scenAcc.twoPartyDem() * 100, 3),
        scenario_minus_baseline_dem_two_party: round((scenAcc.twoPartyDem() - baseAcc.twoPartyDem()) * 100, 3),
        scenario_predicted_winner: scenAcc.twoPartyDem() >= 0.5 ? "Democratic" : "Republican",
        scenario_ev_to_dem: scenAcc.twoPartyDem() >= 0.5 ? ev : 0,
        scenario_ev_to_rep: scenAcc.twoPartyDem() < 0.5 ? ev : 0,
      });
    }
  }
  return rows;
}

function evSummaryRows(stateRows: Array<Record<string, unknown>>): Array<Record<string, unknown>> {
  const keys = [...new Set(stateRows.map((r) => `${r.scenario}|${r.candidate_variant}|${r.method}|${r.mode}`))].sort();
  return keys.map((key) => {
    const subset = stateRows.filter((r) => `${r.scenario}|${r.candidate_variant}|${r.method}|${r.mode}` === key);
    const [scenario, candidateVariant, method, mode] = key.split("|");
    const demEv = subset.reduce((sum, r) => sum + Number(r.scenario_ev_to_dem), 0);
    const repEv = subset.reduce((sum, r) => sum + Number(r.scenario_ev_to_rep), 0);
    const tipping = subset
      .map((r) => ({
        state: String(r.state),
        ev: Number(r.electoral_votes),
        margin: Math.abs(Number(r.scenario_model_dem_two_party) - 50),
        demTwo: Number(r.scenario_model_dem_two_party),
      }))
      .sort((a, b) => a.margin - b.margin)
      .slice(0, 8)
      .map((r) => `${r.state} ${round(r.demTwo, 1)}D2P`)
      .join("; ");
    return {
      scenario,
      candidate_variant: candidateVariant,
      method,
      mode,
      dem_ev: demEv,
      rep_ev: repEv,
      predicted_winner: demEv >= 270 ? "Democratic" : repEv >= 270 ? "Republican" : "No majority",
      tipping_states: tipping,
    };
  });
}

function makeRng(seed: number): () => number {
  let t = seed >>> 0;
  return () => {
    t += 0x6D2B79F5;
    let x = t;
    x = Math.imul(x ^ (x >>> 15), x | 1);
    x ^= x + Math.imul(x ^ (x >>> 7), x | 61);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

function uniform(rng: () => number, min: number, max: number): number {
  return min + (max - min) * rng();
}

function sampledTurnoutSettings(scenario: ScenarioId, rng: () => number, band: "narrow" | "wide" = "narrow"): TurnoutSettings {
  if (band === "wide" && scenario === "sanders_static") {
    return {
      label: "wide_static",
      affinityCoefficient: uniform(rng, 0.35, 1.95),
      blackPenalty: uniform(rng, -0.42, 0.04),
      youngBoost: uniform(rng, -0.02, 0.55),
      latinoBoost: uniform(rng, -0.05, 0.24),
      flCubanPenalty: uniform(rng, -0.34, 0.02),
      collegePlusPenalty: uniform(rng, -0.16, 0.05),
    };
  }
  if (band === "wide") {
    return {
      label: "wide_perceived",
      affinityCoefficient: uniform(rng, 0.35, 2.1),
      blackPenalty: uniform(rng, -0.62, 0.0),
      youngBoost: uniform(rng, -0.04, 0.48),
      latinoBoost: uniform(rng, -0.08, 0.18),
      flCubanPenalty: uniform(rng, -0.52, -0.02),
      collegePlusPenalty: uniform(rng, -0.26, 0.02),
    };
  }
  if (scenario === "sanders_static") {
    return {
      label: "bootstrap_static",
      affinityCoefficient: uniform(rng, 0.7, 1.3),
      blackPenalty: uniform(rng, -0.24, -0.08),
      youngBoost: uniform(rng, 0.10, 0.28),
      latinoBoost: uniform(rng, 0.01, 0.11),
      flCubanPenalty: uniform(rng, -0.18, -0.04),
      collegePlusPenalty: uniform(rng, -0.07, 0.01),
    };
  }
  return {
    label: "bootstrap_perceived",
    affinityCoefficient: uniform(rng, 0.75, 1.45),
    blackPenalty: uniform(rng, -0.42, -0.14),
    youngBoost: uniform(rng, 0.06, 0.24),
    latinoBoost: uniform(rng, -0.02, 0.08),
    flCubanPenalty: uniform(rng, -0.34, -0.10),
    collegePlusPenalty: uniform(rng, -0.16, -0.02),
  };
}

function percentile(values: number[], p: number): number {
  if (values.length === 0) return 0;
  const sorted = values.slice().sort((a, b) => a - b);
  const idx = clamp((sorted.length - 1) * p, 0, sorted.length - 1);
  const lo = Math.floor(idx);
  const hi = Math.ceil(idx);
  if (lo === hi) return sorted[lo]!;
  return sorted[lo]! + (sorted[hi]! - sorted[lo]!) * (idx - lo);
}

function evFromStateAccumulators(states: Map<string, VoteAccumulator>): {
  demEv: number;
  repEv: number;
  tippingStates: string;
} {
  let demEv = 0;
  let repEv = 0;
  const tipping = [...states.entries()]
    .map(([state, acc]) => {
      const ev = ELECTORAL_VOTES_2016[state] ?? 0;
      const demTwo = acc.twoPartyDem();
      if (demTwo >= 0.5) demEv += ev;
      else repEv += ev;
      return { state, ev, demTwo, margin: Math.abs(demTwo - 0.5) };
    })
    .sort((a, b) => a.margin - b.margin)
    .slice(0, 8)
    .map((r) => `${r.state} ${round(r.demTwo * 100, 1)}D2P`)
    .join("; ");
  return { demEv, repEv, tippingStates: tipping };
}

function bootstrapElasticTurnoutRows(
  respondents: BridgeRespondent[],
  turnoutModel: TurnoutModel,
  candidateVariant: CandidateVariant,
  alphas: BucketAlphas,
  stateAlphas: Map<string, BucketAlphas>,
  reps = 160,
  band: "narrow" | "wide" = "narrow",
): Array<Record<string, unknown>> {
  const method: Method = "state_calibrated_softmax_t1.5";
  const scenarios: ScenarioId[] = ["sanders_static", "sanders_perceived"];
  const baseTurnout = respondents.map((r) => predictTurnout(turnoutModel, r));
  const baselineCandidates = candidatesForScenario("baseline_clinton", candidateVariant);
  const baselineProbs = respondents.map((r) => voteProbsForRespondent(r, baselineCandidates, method, alphas, stateAlphas));
  const scenarioProbs = new Map<ScenarioId, Array<Record<VoteBucket, number>>>();
  for (const scenario of scenarios) {
    const candidates = candidatesForScenario(scenario, candidateVariant);
    scenarioProbs.set(scenario, respondents.map((r) => voteProbsForRespondent(r, candidates, method, alphas, stateAlphas)));
  }

  const rows: Array<Record<string, unknown>> = [];
  const rng = makeRng(20260425 + stableHash(`${candidateVariant}|${band}`));
  for (let rep = 0; rep < reps; rep++) {
    for (const scenario of scenarios) {
      const settings = sampledTurnoutSettings(scenario, rng, band);
      const national = new VoteAccumulator();
      const states = new Map<string, VoteAccumulator>();
      const probsForScenario = scenarioProbs.get(scenario)!;
      for (let i = 0; i < respondents.length; i++) {
        const respondent = respondents[i]!;
        if (respondent.weightAdult <= 0) continue;
        const probs = probsForScenario[i]!;
        const weight = respondent.weightAdult * scenarioTurnoutProbability(
          respondent,
          scenario,
          baseTurnout[i]!,
          probs,
          baselineProbs[i]!,
          settings,
        );
        national.addProbs(probs, weight);
        mapAccumulator(states, respondent.state).addProbs(probs, weight);
      }
      const ev = evFromStateAccumulators(states);
      rows.push({
        rep,
        scenario,
        candidate_variant: candidateVariant,
        method,
        mode: "elastic_turnout",
        band,
        national_dem_share: round(national.share(national.democratic) * 100, 3),
        national_rep_share: round(national.share(national.republican) * 100, 3),
        national_third_share: round(national.share(national.third()) * 100, 3),
        national_dem_two_party: round(national.twoPartyDem() * 100, 3),
        dem_ev: ev.demEv,
        rep_ev: ev.repEv,
        predicted_winner: ev.demEv >= 270 ? "Democratic" : "Republican",
        tipping_states: ev.tippingStates,
        affinity_coefficient: round(settings.affinityCoefficient, 4),
        black_penalty: round(settings.blackPenalty, 4),
        young_boost: round(settings.youngBoost, 4),
        latino_boost: round(settings.latinoBoost, 4),
        fl_cuban_penalty: round(settings.flCubanPenalty, 4),
        college_plus_penalty: round(settings.collegePlusPenalty, 4),
      });
    }
  }
  return rows;
}

function bootstrapSummaryRows(rows: Array<Record<string, unknown>>): Array<Record<string, unknown>> {
  const keys = [...new Set(rows.map((row) => `${row.scenario}|${row.candidate_variant}|${row.method}|${row.mode}|${row.band ?? "narrow"}`))].sort();
  return keys.map((key) => {
    const subset = rows.filter((row) => `${row.scenario}|${row.candidate_variant}|${row.method}|${row.mode}|${row.band ?? "narrow"}` === key);
    const [scenario, candidateVariant, method, mode, band] = key.split("|") as [ScenarioId, CandidateVariant, Method, RunMode, string];
    const demEvs = subset.map((row) => Number(row.dem_ev));
    const d2ps = subset.map((row) => Number(row.national_dem_two_party));
    const tippingCounts = new Map<string, number>();
    for (const row of subset) {
      const first = String(row.tipping_states).split(";")[0]?.trim().split(" ")[0] ?? "";
      if (first) tippingCounts.set(first, (tippingCounts.get(first) ?? 0) + 1);
    }
    const mostCommonTippingStates = [...tippingCounts.entries()]
      .sort(([, a], [, b]) => b - a)
      .slice(0, 6)
      .map(([state, count]) => `${state}:${count}`)
      .join("; ");
    const summary: BootstrapSummary = {
      scenario,
      candidateVariant,
      method,
      mode,
      reps: subset.length,
      demWinRate: subset.filter((row) => Number(row.dem_ev) >= 270).length / Math.max(1, subset.length),
      medianDemEv: percentile(demEvs, 0.5),
      p05DemEv: percentile(demEvs, 0.05),
      p95DemEv: percentile(demEvs, 0.95),
      medianNationalD2p: percentile(d2ps, 0.5),
      p05NationalD2p: percentile(d2ps, 0.05),
      p95NationalD2p: percentile(d2ps, 0.95),
      mostCommonTippingStates,
    };
    return {
      scenario: summary.scenario,
      candidate_variant: summary.candidateVariant,
      method: summary.method,
      mode: summary.mode,
      band,
      reps: summary.reps,
      dem_win_rate: round(summary.demWinRate * 100, 2),
      median_dem_ev: round(summary.medianDemEv, 1),
      p05_dem_ev: round(summary.p05DemEv, 1),
      p95_dem_ev: round(summary.p95DemEv, 1),
      median_national_dem_two_party: round(summary.medianNationalD2p, 3),
      p05_national_dem_two_party: round(summary.p05NationalD2p, 3),
      p95_national_dem_two_party: round(summary.p95NationalD2p, 3),
      most_common_tipping_states: summary.mostCommonTippingStates,
    };
  });
}

function runCandidateSet(
  respondents: BridgeRespondent[],
  candidates: CandidateProfile[],
  method: Method,
  candidateVariant: CandidateVariant,
  mode: RunMode,
  alphas?: BucketAlphas,
  stateAlphas?: Map<string, BucketAlphas>,
  turnoutModel?: TurnoutModel,
  turnoutSettings?: TurnoutSettings,
  turnoutScenario: ScenarioId = "sanders_static",
): { national: VoteAccumulator; states: Map<string, VoteAccumulator>; byGroup: Map<string, VoteAccumulator> } {
  const baselineCandidates = candidatesForScenario("baseline_clinton", candidateVariant);
  const national = new VoteAccumulator();
  const states = new Map<string, VoteAccumulator>();
  const byGroup = new Map<string, VoteAccumulator>();
  const settings = turnoutSettings ?? defaultTurnoutSettings(turnoutScenario);
  for (const respondent of respondents) {
    if (mode === "fixed_voter" && (!respondent.isReportedVoter || respondent.weightVoter <= 0)) continue;
    if (mode === "elastic_turnout" && (!turnoutModel || respondent.weightAdult <= 0)) continue;
    const probs = voteProbsForRespondent(respondent, candidates, method, alphas, stateAlphas);
    let weight = respondent.weightVoter;
    if (mode === "elastic_turnout" && turnoutModel) {
      const baselineProbs = voteProbsForRespondent(respondent, baselineCandidates, method, alphas, stateAlphas);
      weight = respondent.weightAdult * scenarioTurnoutProbability(
        respondent,
        turnoutScenario,
        predictTurnout(turnoutModel, respondent),
        probs,
        baselineProbs,
        settings,
      );
    }
    national.addProbs(probs, weight);
    mapAccumulator(states, respondent.state).addProbs(probs, weight);
    mapAccumulator(byGroup, `${respondent.raceGroup}|${respondent.ageGroup}|${respondent.educationGroup}`).addProbs(probs, weight);
  }
  return { national, states, byGroup };
}

function candidatesWithDemocraticReplacement(profile: CandidateProfile, variant: CandidateVariant): CandidateProfile[] {
  return candidatesForScenario("baseline_clinton", variant).map((candidate) =>
    candidate.name === "H. Clinton" ? applyCandidateVariant([{ ...profile, name: "Sanders", party: "Democratic", year: 2016 }], variant)[0]! : candidate
  );
}

function sandersProfileWithOverrides(overrides: Partial<CandidateProfile>): CandidateProfile {
  return { ...sandersProfile("static"), ...overrides, name: "Sanders", party: "Democratic", year: 2016 };
}

function preferredOutcomeRowsForRespondents(
  respondents: BridgeRespondent[],
  actualStates: ActualStateRow[],
  experiment: string,
  notes: string,
): Array<Record<string, unknown>> {
  const candidateVariant: CandidateVariant = "canonical";
  const method: Method = "state_calibrated_softmax_t1.5";
  const reported = reportedVoteAccumulators(respondents);
  const turnoutModel = trainTurnoutModel(respondents);
  const baselineCandidates = candidatesForScenario("baseline_clinton", candidateVariant);
  const alphas = fitCalibratedSoftmaxAlphas(respondents, baselineCandidates, reported.national);
  const stateAlphas = fitStateCalibratedSoftmaxAlphas(respondents, baselineCandidates, actualStates, reported.national);
  const baselineRuns = new Map<RunMode, ScenarioRun>();
  for (const mode of ["fixed_voter", "elastic_turnout"] as RunMode[]) {
    baselineRuns.set(mode, runScenario(
      respondents,
      "baseline_clinton",
      method,
      candidateVariant,
      mode,
      alphas,
      stateAlphas,
      turnoutModel,
      defaultTurnoutSettings("baseline_clinton"),
    ));
  }
  const rows: Array<Record<string, unknown>> = [];
  for (const scenario of ["sanders_static", "sanders_perceived"] as ScenarioId[]) {
    for (const mode of ["fixed_voter", "elastic_turnout"] as RunMode[]) {
      const run = runScenario(
        respondents,
        scenario,
        method,
        candidateVariant,
        mode,
        alphas,
        stateAlphas,
        turnoutModel,
        defaultTurnoutSettings(scenario),
      );
      const base = baselineRuns.get(mode)!;
      const ev = evFromStateAccumulators(run.states);
      rows.push({
        experiment,
        notes,
        candidate_variant: candidateVariant,
        method,
        mode,
        scenario,
        baseline_dem_two_party: round(base.national.twoPartyDem() * 100, 3),
        scenario_dem_two_party: round(run.national.twoPartyDem() * 100, 3),
        dem_two_party_delta: round((run.national.twoPartyDem() - base.national.twoPartyDem()) * 100, 3),
        dem_ev: ev.demEv,
        rep_ev: ev.repEv,
        predicted_winner: ev.demEv >= 270 ? "Democratic" : "Republican",
        tipping_states: ev.tippingStates,
      });
    }
  }
  return rows;
}

async function crosswalkStressRows(
  labels: Map<string, string>,
  actualStates: ActualStateRow[],
  baselineRespondents: BridgeRespondent[],
): Promise<Array<Record<string, unknown>>> {
  const rows: Array<Record<string, unknown>> = [
    ...preferredOutcomeRowsForRespondents(baselineRespondents, actualStates, "baseline_crosswalk", "no crosswalk stress"),
  ];
  const stressBlocks: EvidenceBlock[] = [
    "party_id",
    "ideology",
    "primary_vote",
    "racial_attitudes",
    "institutional_trust",
    "policy",
  ];
  for (const block of stressBlocks) {
    setEvidenceStress({ [block]: 0 }, 0, `drop_${block}`);
    const specs = buildCrosswalk(labels);
    const loaded = await loadBridgeRespondents(specs, labels);
    rows.push(...preferredOutcomeRowsForRespondents(loaded.respondents, actualStates, `drop_${block}`, `${block} evidence weight set to zero`));
  }
  for (let i = 0; i < 8; i++) {
    setEvidenceStress({}, 0.25, `jitter_${i}`);
    const specs = buildCrosswalk(labels);
    const loaded = await loadBridgeRespondents(specs, labels);
    rows.push(...preferredOutcomeRowsForRespondents(loaded.respondents, actualStates, `jitter_${i}`, "all evidence weights jittered +/-25% deterministically"));
  }
  setEvidenceStress();
  return rows;
}

function fitStateCalibratedSoftmaxAlphasWithHoldout(
  respondents: BridgeRespondent[],
  candidates: CandidateProfile[],
  actualRows: ActualStateRow[],
  reported: VoteAccumulator,
  heldoutStates: Set<string>,
): Map<string, BucketAlphas> {
  const byState = new Map<string, BridgeRespondent[]>();
  for (const respondent of respondents) {
    if (!respondent.isReportedVoter || respondent.weightVoter <= 0) continue;
    const stateRows = byState.get(respondent.state) ?? [];
    stateRows.push(respondent);
    byState.set(respondent.state, stateRows);
  }
  const actualByState = new Map(actualRows.map((r) => [r.state_po, r]));
  const thirdTotal = Math.max(1e-6, reported.third());
  const johnsonFrac = reported.johnson / thirdTotal;
  const steinFrac = reported.stein / thirdTotal;
  const otherFrac = reported.other / thirdTotal;
  const stateAlphas = new Map<string, BucketAlphas>();
  const nationalFallback = fitCalibratedSoftmaxAlphas(respondents, candidates, reported);
  for (const [state, stateRespondents] of byState) {
    const actual = actualByState.get(state);
    const stateWeight = stateRespondents.reduce((sum, r) => sum + r.weightVoter, 0);
    if (heldoutStates.has(state) || !actual || stateWeight <= 0) {
      stateAlphas.set(state, nationalFallback);
      continue;
    }
    const targets: BucketAlphas = {
      Democratic: Math.max(1e-6, stateWeight * actual.dem_share),
      Republican: Math.max(1e-6, stateWeight * actual.rep_share),
      Johnson: Math.max(1e-6, stateWeight * actual.third_share * johnsonFrac),
      Stein: Math.max(1e-6, stateWeight * actual.third_share * steinFrac),
      Other: Math.max(1e-6, stateWeight * actual.third_share * otherFrac),
    };
    stateAlphas.set(state, fitCalibratedSoftmaxAlphasToTargets(stateRespondents, candidates, targets));
  }
  return stateAlphas;
}

function stateCalibrationHoldoutRows(
  respondents: BridgeRespondent[],
  actualStates: ActualStateRow[],
): Array<Record<string, unknown>> {
  const candidateVariant: CandidateVariant = "canonical";
  const method: Method = "state_calibrated_softmax_t1.5";
  const reported = reportedVoteAccumulators(respondents);
  const candidates = candidatesForScenario("baseline_clinton", candidateVariant);
  const alphas = fitCalibratedSoftmaxAlphas(respondents, candidates, reported.national);
  const actualByState = new Map(actualStates.map((r) => [r.state_po, r]));
  const rows: Array<Record<string, unknown>> = [];
  for (let fold = 0; fold < 5; fold++) {
    const heldoutStates = new Set(actualStates.filter((row) => stableHash(row.state_po) % 5 === fold).map((row) => row.state_po));
    const stateAlphas = fitStateCalibratedSoftmaxAlphasWithHoldout(respondents, candidates, actualStates, reported.national, heldoutStates);
    const run = runScenario(respondents, "baseline_clinton", method, candidateVariant, "fixed_voter", alphas, stateAlphas);
    for (const state of heldoutStates) {
      const actual = actualByState.get(state);
      const acc = run.states.get(state);
      if (!actual || !acc) continue;
      rows.push({
        fold,
        state,
        actual_dem_two_party: round(actual.dem_two_party * 100, 3),
        model_dem_two_party: round(acc.twoPartyDem() * 100, 3),
        residual_dem_two_party: round((acc.twoPartyDem() - actual.dem_two_party) * 100, 3),
        abs_residual_dem_two_party: round(Math.abs(acc.twoPartyDem() - actual.dem_two_party) * 100, 3),
      });
    }
  }
  return rows;
}

function candidateProfileGridRows(
  respondents: BridgeRespondent[],
  actualStates: ActualStateRow[],
  turnoutModel: TurnoutModel,
  alphas: BucketAlphas,
  stateAlphas: Map<string, BucketAlphas>,
  candidateVariant: CandidateVariant,
): Array<Record<string, unknown>> {
  const method: Method = "state_calibrated_softmax_t1.5";
  const baselineByMode = new Map<RunMode, { national: VoteAccumulator; states: Map<string, VoteAccumulator> }>();
  const baselineCandidates = candidatesForScenario("baseline_clinton", candidateVariant);
  for (const mode of ["fixed_voter", "elastic_turnout"] as RunMode[]) {
    baselineByMode.set(mode, runCandidateSet(
      respondents,
      baselineCandidates,
      method,
      candidateVariant,
      mode,
      alphas,
      stateAlphas,
      turnoutModel,
      defaultTurnoutSettings("baseline_clinton"),
      "baseline_clinton",
    ));
  }
  const rows: Array<Record<string, unknown>> = [];
  for (const ONT_S of [1.5, 2, 2.5]) {
    for (const PRO of [1.5, 2, 2.5]) {
      for (const PF of [3.5, 4.5, 5]) {
        for (const AES of [3, 4]) {
          const profile = sandersProfileWithOverrides({ ONT_S, PRO, PF, AES });
          const candidates = candidatesWithDemocraticReplacement(profile, candidateVariant);
          const label = `ONT_S=${ONT_S};PRO=${PRO};PF=${PF};AES=${AES}`;
          for (const mode of ["fixed_voter", "elastic_turnout"] as RunMode[]) {
            const run = runCandidateSet(
              respondents,
              candidates,
              method,
              candidateVariant,
              mode,
              alphas,
              stateAlphas,
              turnoutModel,
              defaultTurnoutSettings("sanders_static"),
              "sanders_static",
            );
            const base = baselineByMode.get(mode)!;
            const ev = evFromStateAccumulators(run.states);
            rows.push({
              profile_label: label,
              candidate_variant: candidateVariant,
              method,
              mode,
              ONT_S,
              PRO,
              PF,
              AES,
              baseline_dem_two_party: round(base.national.twoPartyDem() * 100, 3),
              scenario_dem_two_party: round(run.national.twoPartyDem() * 100, 3),
              dem_two_party_delta: round((run.national.twoPartyDem() - base.national.twoPartyDem()) * 100, 3),
              dem_ev: ev.demEv,
              rep_ev: ev.repEv,
              predicted_winner: ev.demEv >= 270 ? "Democratic" : "Republican",
              tipping_states: ev.tippingStates,
            });
          }
        }
      }
    }
  }
  return rows.sort((a, b) => Number(b.dem_ev) - Number(a.dem_ev) || Number(b.scenario_dem_two_party) - Number(a.scenario_dem_two_party));
}

function candidateGridSummaryRows(rows: Array<Record<string, unknown>>): Array<Record<string, unknown>> {
  const keys = [...new Set(rows.map((row) => `${row.candidate_variant}|${row.mode}`))].sort();
  return keys.map((key) => {
    const subset = rows.filter((row) => `${row.candidate_variant}|${row.mode}` === key);
    const best = subset.slice().sort((a, b) => Number(b.dem_ev) - Number(a.dem_ev) || Number(b.scenario_dem_two_party) - Number(a.scenario_dem_two_party))[0]!;
    const wins = subset.filter((row) => Number(row.dem_ev) >= 270).length;
    return {
      candidate_variant: best.candidate_variant,
      mode: best.mode,
      grid_points: subset.length,
      democratic_win_points: wins,
      democratic_win_rate: round((wins / Math.max(1, subset.length)) * 100, 3),
      best_dem_ev: best.dem_ev,
      best_national_dem_two_party: best.scenario_dem_two_party,
      best_profile: best.profile_label,
      best_tipping_states: best.tipping_states,
    };
  });
}

function robustnessVerdictRows(params: {
  crosswalkRows: Array<Record<string, unknown>>;
  gridRows: Array<Record<string, unknown>>;
  stateHoldoutRows: Array<Record<string, unknown>>;
  bootstrapSummaryRows: Array<Record<string, unknown>>;
}): Array<Record<string, unknown>> {
  const stateMae = params.stateHoldoutRows.reduce((sum, row) => sum + Number(row.abs_residual_dem_two_party), 0) / Math.max(1, params.stateHoldoutRows.length);
  const crosswalkSanders = params.crosswalkRows.filter((row) => row.scenario === "sanders_static" && row.mode === "elastic_turnout");
  const crosswalkWins = crosswalkSanders.filter((row) => Number(row.dem_ev) >= 270).length;
  const bestGrid = params.gridRows.slice().sort((a, b) => Number(b.dem_ev) - Number(a.dem_ev) || Number(b.scenario_dem_two_party) - Number(a.scenario_dem_two_party))[0];
  const wideRows = params.bootstrapSummaryRows.filter((row) => row.band === "wide");
  const bestWideWinRate = wideRows.reduce((max, row) => Math.max(max, Number(row.dem_win_rate)), 0);
  return [
    {
      check: "crosswalk_stress_static_elastic",
      result: crosswalkWins > 0 ? "unstable" : "stable_no_sanders_win",
      detail: `${crosswalkWins}/${crosswalkSanders.length} crosswalk stress cases produced a Sanders EV win`,
      decision_grade_impact: crosswalkWins > 0 ? "high" : "low",
    },
    {
      check: "candidate_profile_grid",
      result: bestGrid && Number(bestGrid.dem_ev) >= 270 ? "profile_can_flip" : "no_profile_grid_win",
      detail: bestGrid
        ? `best grid point ${bestGrid.profile_label} in ${bestGrid.mode} reached ${bestGrid.dem_ev} EV and ${bestGrid.scenario_dem_two_party}% D2P`
        : "no grid rows",
      decision_grade_impact: bestGrid && Number(bestGrid.dem_ev) >= 270 ? "high" : "medium",
    },
    {
      check: "state_calibration_holdout",
      result: stateMae <= 4 ? "good" : stateMae <= 7 ? "usable_with_caution" : "weak",
      detail: `5-fold held-out state two-party MAE ${round(stateMae, 3)} pp`,
      decision_grade_impact: stateMae <= 4 ? "low" : "high",
    },
    {
      check: "wide_turnout_bootstrap",
      result: bestWideWinRate > 0 ? "turnout_band_can_flip" : "no_turnout_band_win",
      detail: `max Sanders win rate across wide turnout bands: ${round(bestWideWinRate, 2)}%`,
      decision_grade_impact: bestWideWinRate > 0 ? "high" : "medium",
    },
  ];
}

function robustnessMarkdown(params: {
  crosswalkRows: Array<Record<string, unknown>>;
  gridSummaryRows: Array<Record<string, unknown>>;
  stateHoldoutRows: Array<Record<string, unknown>>;
  bootstrapSummaryRows: Array<Record<string, unknown>>;
  verdictRows: Array<Record<string, unknown>>;
}): string {
  const stateMae = params.stateHoldoutRows.reduce((sum, row) => sum + Number(row.abs_residual_dem_two_party), 0) / Math.max(1, params.stateHoldoutRows.length);
  const crosswalkStatic = params.crosswalkRows.filter((row) => row.scenario === "sanders_static" && row.mode === "elastic_turnout");
  const crosswalkBest = crosswalkStatic.slice().sort((a, b) => Number(b.dem_ev) - Number(a.dem_ev) || Number(b.scenario_dem_two_party) - Number(a.scenario_dem_two_party))[0];
  return [
    "# CCES 2016 Bridge Robustness Stress Test",
    "",
    "This pass asks how hard the assumptions must be pushed before the Sanders 2016 result flips.",
    "",
    "## Verdict",
    "",
    "| check | result | detail | impact |",
    "|---|---|---|---|",
    ...params.verdictRows.map((row) => `| ${row.check} | ${row.result} | ${row.detail} | ${row.decision_grade_impact} |`),
    "",
    "## Crosswalk Stress",
    "",
    `- Static Sanders, elastic turnout: best stressed case was ${crosswalkBest?.experiment ?? "n/a"} at ${crosswalkBest?.dem_ev ?? "n/a"} EV and ${crosswalkBest?.scenario_dem_two_party ?? "n/a"}% national D two-party.`,
    "- Stress cases include leave-one-block-out for party ID, ideology, primary vote, racial attitudes, institutional trust, policy evidence, plus eight deterministic +/-25% evidence-weight jitters.",
    "",
    "## Candidate Profile Grid",
    "",
    "| variant | mode | grid points | win points | win rate | best EV | best D2P | best profile |",
    "|---|---|---:|---:|---:|---:|---:|---|",
    ...params.gridSummaryRows.map((row) => `| ${row.candidate_variant} | ${row.mode} | ${row.grid_points} | ${row.democratic_win_points} | ${row.democratic_win_rate}% | ${row.best_dem_ev} | ${row.best_national_dem_two_party}% | ${row.best_profile} |`),
    "",
    "## State Calibration Holdout",
    "",
    `- Five-fold held-out state two-party MAE: ${round(stateMae, 3)} pp.`,
    "- This is the largest remaining caution: state-calibrated counterfactual movement is better read as anchored scenario movement than as an independent state forecast.",
    "",
    "## Wide Turnout Band",
    "",
    "| variant | scenario | band | reps | Dem win rate | median EV | EV 5/95 | median D2P | D2P 5/95 |",
    "|---|---|---|---:|---:|---:|---:|---:|---:|",
    ...params.bootstrapSummaryRows
      .filter((row) => row.band === "wide")
      .map((row) => `| ${row.candidate_variant} | ${row.scenario} | ${row.band} | ${row.reps} | ${row.dem_win_rate}% | ${row.median_dem_ev} | ${row.p05_dem_ev}/${row.p95_dem_ev} | ${row.median_national_dem_two_party}% | ${row.p05_national_dem_two_party}/${row.p95_national_dem_two_party} |`),
    "",
  ].join("\n");
}

function coalitionRows(runs: ScenarioRun[], reportedGroups: Map<string, VoteAccumulator>): Array<Record<string, unknown>> {
  const rows: Array<Record<string, unknown>> = [];
  for (const run of runs) {
    const base = runs.find((r) => r.scenario === "baseline_clinton" && r.method === run.method && r.candidateVariant === run.candidateVariant && r.mode === run.mode);
    for (const [group, acc] of run.byGroup) {
      const [race, age, education] = group.split("|");
      const reported = reportedGroups.get(group) ?? new VoteAccumulator();
      const baseAcc = base?.byGroup.get(group);
      rows.push({
        scenario: run.scenario,
        candidate_variant: run.candidateVariant,
        method: run.method,
        mode: run.mode,
        race,
        age,
        education,
        weighted_n: round(acc.total, 3),
        cces_reported_dem_two_party: round(reported.twoPartyDem() * 100, 3),
        model_dem_two_party: round(acc.twoPartyDem() * 100, 3),
        model_dem_two_party_delta_vs_baseline: baseAcc ? round((acc.twoPartyDem() - baseAcc.twoPartyDem()) * 100, 3) : 0,
        model_dem_share: round(acc.share(acc.democratic) * 100, 3),
        model_rep_share: round(acc.share(acc.republican) * 100, 3),
        model_third_share: round(acc.share(acc.third()) * 100, 3),
      });
    }
  }
  return rows.sort((a, b) => Number(b.weighted_n) - Number(a.weighted_n));
}

function respondentSampleRows(respondents: BridgeRespondent[]): Array<Record<string, unknown>> {
  return respondents.slice(0, 500).map((r) => ({
    id: r.id,
    state: r.state,
    race: r.raceGroup,
    age: r.ageGroup,
    education: r.educationGroup,
    weight_voter: round(r.weightVoter, 4),
    weight_adult: round(r.weightAdult, 4),
    reported_vote: r.reportedVote,
    party_id: r.partyID ?? "",
    engagement: r.engagement,
    MAT: round(r.signature.MAT?.pos ?? 0, 3),
    CD: round(r.signature.CD?.pos ?? 0, 3),
    CU: round(r.signature.CU?.pos ?? 0, 3),
    MOR: round(r.signature.MOR?.pos ?? 0, 3),
    PRO: round(r.signature.PRO?.pos ?? 0, 3),
    COM: round(r.signature.COM?.pos ?? 0, 3),
    ZS: round(r.signature.ZS?.pos ?? 0, 3),
    ONT_H: round(r.signature.ONT_H?.pos ?? 0, 3),
    ONT_S: round(r.signature.ONT_S?.pos ?? 0, 3),
    PF: round(r.signature.PF?.pos ?? 0, 3),
    TRB: round(r.signature.TRB?.pos ?? 0, 3),
    ENG: round(r.signature.ENG?.pos ?? 0, 3),
  }));
}

function reportMarkdown(params: {
  respondentCount: number;
  voterCount: number;
  reported: VoteAccumulator;
  validationRows: Array<Record<string, unknown>>;
  counterRows: Array<Record<string, unknown>>;
  evRows: Array<Record<string, unknown>>;
  nodeRows: Array<Record<string, unknown>>;
  turnoutValidationRows: Array<Record<string, unknown>>;
  bootstrapSummaryRows: Array<Record<string, unknown>>;
}): string {
  const bestValidation = params.validationRows
    .slice()
    .filter((r) => r.mode === "fixed_voter")
    .sort((a, b) => Math.abs(Number(a.model_minus_reported_dem_two_party)) - Math.abs(Number(b.model_minus_reported_dem_two_party)))[0];
  const nationalCounter = params.counterRows.filter((r) => r.method === "state_calibrated_softmax_t1.5");
  const holdoutTurnout = params.turnoutValidationRows.find((r) => r.split === "holdout");
  return [
    "# CCES 2016 PRISM Electorate Bridge",
    "",
    "This diagnostic maps CCES 2016 respondents into PRISM node posterior means, validates vote choice on reported voters, trains a turnout model on the adult sample, then swaps Clinton for Sanders under fixed-voter and elastic-turnout regimes.",
    "",
    "## Intermediate Steps Performed",
    "",
    "1. Downloaded/used the CCES 2016 Common Content voter-validation tab file.",
    "2. Parsed the CCES codebook labels and the 64,600-row tab file with a streaming TSV parser.",
    "3. Built an explicit crosswalk from CCES party ID, ideology, policy, institutional-trust, racial-attitude, religious, union, engagement, and demographic items into PRISM node evidence.",
    "4. Created respondent-level posterior means plus uncertainty proxies (`touches` and `sd`) for all PRISM nodes and TRB anchors.",
    "5. Weighted the respondent pool with CCES voter-validation post-election weights for vote validation and fixed-voter counterfactuals.",
    "6. Trained a weighted logistic turnout model on adult respondents with a deterministic holdout split.",
    "7. Validated the baseline Clinton/Trump/Johnson/Stein model against reported CCES presidential vote nationally and by state.",
    "8. Replaced Clinton with two Sanders profiles: static/platform and perceived/attack-framed.",
    "9. Re-ran the swap under elastic turnout with group-specific uncertainty bands for Black, young, Latino, Florida Cuban, and college-plus voters.",
    "10. Produced national, state, Electoral College, coalition, schema, crosswalk, turnout, bootstrap, and respondent-sample audit artifacts.",
    "",
    "## Dataset",
    "",
    `- Respondents parsed: ${params.respondentCount.toLocaleString()}`,
    `- Reported presidential voters used in validation/counterfactuals: ${params.voterCount.toLocaleString()}`,
    `- Baseline reported CCES weighted Democratic two-party share: ${round(params.reported.twoPartyDem() * 100, 3)}%`,
    `- Non-ideological modifier enabled: ${process.env.PRISM_NONIDEO === "0" ? "no" : "yes"}`,
    holdoutTurnout
      ? `- Turnout holdout: actual ${holdoutTurnout.actual_turnout}%, predicted ${holdoutTurnout.predicted_turnout}%, log loss ${holdoutTurnout.log_loss}, Brier ${holdoutTurnout.brier}`
      : "- Turnout holdout: unavailable",
    "",
    "## Best Baseline Validation",
    "",
    bestValidation
      ? `Best method by national two-party residual: **${bestValidation.candidate_variant} / ${bestValidation.method}**, model minus reported D two-party = **${bestValidation.model_minus_reported_dem_two_party} pp**, party-bucket accuracy = **${bestValidation.accuracy_party_bucket}%**, log loss = **${bestValidation.log_loss}**.`
      : "No validation rows produced.",
    "",
    "| candidate variant | method | model D | model R | model third | model D two-party | residual D two-party | party-bucket accuracy | log loss |",
    "|---|---|---:|---:|---:|---:|---:|---:|---:|",
    ...params.validationRows.filter((r) => r.mode === "fixed_voter").map((r) =>
      `| ${r.candidate_variant} | ${r.method} | ${r.model_dem_share}% | ${r.model_rep_share}% | ${r.model_third_share}% | ${r.model_dem_two_party}% | ${r.model_minus_reported_dem_two_party} | ${r.accuracy_party_bucket}% | ${r.log_loss} |`
    ),
    "",
    "## Sanders Swap",
    "",
    "The rows below use the bridge-preferred probabilistic method (`state_calibrated_softmax_t1.5`). `fixed_voter` rescoring holds the reported voter pool constant; `elastic_turnout` uses the adult CCES sample and lets turnout move under the Sanders scenario.",
    "",
    "| candidate variant | mode | scenario | D share | R share | third | D two-party | D two-party delta vs Clinton |",
    "|---|---|---|---:|---:|---:|---:|---:|",
    ...nationalCounter.map((r) =>
      `| ${r.candidate_variant} | ${r.mode} | ${r.scenario} | ${r.model_dem_share}% | ${r.model_rep_share}% | ${r.model_third_share}% | ${r.model_dem_two_party}% | ${r.dem_two_party_delta_vs_clinton} |`
    ),
    "",
    "## Elastic-Turnout Uncertainty",
    "",
    "Bootstrap rows perturb the turnout-elasticity assumptions, not the CCES crosswalk itself. This is therefore a scenario band around the bridge, not a full sampling-error confidence interval.",
    "",
    "| candidate variant | scenario | band | reps | Dem win rate | median Dem EV | EV 5/95 | median national D two-party | D2P 5/95 | common tipping states |",
    "|---|---|---|---:|---:|---:|---:|---:|---:|---|",
    ...params.bootstrapSummaryRows.map((r) =>
      `| ${r.candidate_variant} | ${r.scenario} | ${r.band} | ${r.reps} | ${r.dem_win_rate}% | ${r.median_dem_ev} | ${r.p05_dem_ev}/${r.p95_dem_ev} | ${r.median_national_dem_two_party}% | ${r.p05_national_dem_two_party}/${r.p95_national_dem_two_party} | ${r.most_common_tipping_states} |`
    ),
    "",
    "## Electoral College Projection",
    "",
    "This is state-aggregated from CCES respondents by state, not a uniform national swing. Small-state samples remain noisy, so the EC row is diagnostic rather than final-call grade.",
    "",
    "| candidate variant | mode | scenario | method | Dem EV | Rep EV | winner | tipping states |",
    "|---|---|---|---|---:|---:|---|---|",
    ...params.evRows
      .filter((r) => r.method === "state_calibrated_softmax_t1.5")
      .map((r) => `| ${r.candidate_variant} | ${r.mode} | ${r.scenario} | ${r.method} | ${r.dem_ev} | ${r.rep_ev} | ${r.predicted_winner} | ${r.tipping_states} |`),
    "",
    "## Node Distribution Snapshot",
    "",
    "| node | mean pos | mean sal | touches | sd |",
    "|---|---:|---:|---:|---:|",
    ...params.nodeRows.map((r) =>
      `| ${r.node} | ${r.adult_weighted_mean_pos} | ${r.adult_weighted_mean_sal} | ${r.adult_weighted_mean_touches} | ${r.adult_weighted_mean_sd} |`
    ),
    "",
    "## Important Limits",
    "",
    "- This is a first bridge, not the final crosswalk. Several PRISM nodes are only partially observed by CCES and are held with wider posterior uncertainty.",
    "- Party ID and ideology are legitimate bridge variables, but they can dominate validation; the coalition and residual files should be used to detect overfitting.",
    "- Elastic turnout uses a transparent same-day logistic/perturbation layer; it is useful for sensitivity, but it is not yet a fully identified causal turnout model.",
    "- State-calibrated rows deliberately anchor the 2016 baseline to official state returns. Treat them as counterfactual movement from a calibrated baseline, not as an independent state forecast.",
    "- Candidate perception is scenario-coded. The static and perceived Sanders profiles intentionally define a band rather than a single truth.",
    "",
    "## Artifacts",
    "",
    "- `cces2016-schema-audit.csv`",
    "- `cces2016-crosswalk-audit.csv`",
    "- `cces2016-node-distribution.csv`",
    "- `cces2016-validation-national.csv`",
    "- `cces2016-validation-state.csv`",
    "- `cces2016-calibration-alphas.csv`",
    "- `cces2016-state-calibration-alphas.csv`",
    "- `cces2016-turnout-validation.csv`",
    "- `cces2016-turnout-calibration.csv`",
    "- `cces2016-turnout-feature-weights.csv`",
    "- `cces2016-counterfactual-national.csv`",
    "- `cces2016-counterfactual-state.csv`",
    "- `cces2016-counterfactual-ev.csv`",
    "- `cces2016-turnout-bootstrap.csv`",
    "- `cces2016-turnout-bootstrap-summary.csv`",
    "- `cces2016-candidate-profile-grid.csv`",
    "- `cces2016-candidate-profile-grid-summary.csv`",
    "- `cces2016-state-calibration-holdout.csv`",
    "- `cces2016-crosswalk-stress.csv`",
    "- `cces2016-robustness-verdict.csv`",
    "- `cces2016-robustness-report.md`",
    "- `cces2016-coalition-diagnostics.csv`",
    "- `cces2016-respondent-sample.csv`",
    "",
  ].join("\n");
}

async function main(): Promise<void> {
  mkdirSync(OUT_DIR, { recursive: true });
  const labels = codebookLabels();
  const specs = buildCrosswalk(labels);
  writeCsv(join(OUT_DIR, "cces2016-crosswalk-audit.csv"), specs.map((s) => ({
    variable: s.variable,
    label: s.label,
    block: s.block,
    target: s.target,
    role: s.role,
    mapping: s.mapping,
    weight: s.weight,
    notes: s.notes,
  } satisfies EvidenceAuditRow)));

  const { respondents, schemaRows } = await loadBridgeRespondents(specs, labels);
  writeCsv(join(OUT_DIR, "cces2016-schema-audit.csv"), schemaRows.map((row) => ({ ...row })));
  writeCsv(join(OUT_DIR, "cces2016-node-distribution.csv"), nodeDistributionRows(respondents));
  writeCsv(join(OUT_DIR, "cces2016-respondent-sample.csv"), respondentSampleRows(respondents));

  const reported = reportedVoteAccumulators(respondents);
  const actualStates = loadActualStateRows();
  const turnoutModel = trainTurnoutModel(respondents);
  const turnoutValidation = turnoutValidationRows(turnoutModel, respondents);
  writeCsv(join(OUT_DIR, "cces2016-turnout-validation.csv"), turnoutValidation);
  writeCsv(join(OUT_DIR, "cces2016-turnout-calibration.csv"), turnoutCalibrationRows(turnoutModel, respondents));
  writeCsv(join(OUT_DIR, "cces2016-turnout-feature-weights.csv"), turnoutFeatureWeightRows(turnoutModel));

  const scenarios: ScenarioId[] = ["baseline_clinton", "sanders_static", "sanders_perceived"];
  const candidateVariants: CandidateVariant[] = ["canonical", "perceived_2016_patch"];
  const methods: Method[] = [
    "wta",
    "softmax_t1.0",
    "softmax_t1.5",
    "softmax_t2.0",
    "calibrated_softmax_t1.5",
    "state_calibrated_softmax_t1.5",
  ];
  const runs: ScenarioRun[] = [];
  const calibrationRows: Array<Record<string, unknown>> = [];
  const stateCalibrationRows: Array<Record<string, unknown>> = [];
  const bootstrapRows: Array<Record<string, unknown>> = [];
  const candidateGridRowsAll: Array<Record<string, unknown>> = [];
  for (const candidateVariant of candidateVariants) {
    const baselineCandidates = candidatesForScenario("baseline_clinton", candidateVariant);
    const alphas = fitCalibratedSoftmaxAlphas(respondents, baselineCandidates, reported.national);
    const stateAlphas = fitStateCalibratedSoftmaxAlphas(respondents, baselineCandidates, actualStates, reported.national);
    calibrationRows.push({
      candidate_variant: candidateVariant,
      alpha_democratic: round(alphas.Democratic, 6),
      alpha_republican: round(alphas.Republican, 6),
      alpha_johnson: round(alphas.Johnson, 6),
      alpha_stein: round(alphas.Stein, 6),
      alpha_other: round(alphas.Other, 6),
    });
    for (const [state, stateAlpha] of stateAlphas) {
      stateCalibrationRows.push({
        candidate_variant: candidateVariant,
        state,
        alpha_democratic: round(stateAlpha.Democratic, 6),
        alpha_republican: round(stateAlpha.Republican, 6),
        alpha_johnson: round(stateAlpha.Johnson, 6),
        alpha_stein: round(stateAlpha.Stein, 6),
        alpha_other: round(stateAlpha.Other, 6),
      });
    }
    for (const scenario of scenarios) {
      for (const method of methods) {
        runs.push(runScenario(
          respondents,
          scenario,
          method,
          candidateVariant,
          "fixed_voter",
          method === "calibrated_softmax_t1.5" || method === "state_calibrated_softmax_t1.5" ? alphas : undefined,
          method === "state_calibrated_softmax_t1.5" ? stateAlphas : undefined,
        ));
      }
      runs.push(runScenario(
        respondents,
        scenario,
        "state_calibrated_softmax_t1.5",
        candidateVariant,
        "elastic_turnout",
        alphas,
        stateAlphas,
        turnoutModel,
        defaultTurnoutSettings(scenario),
      ));
    }
    bootstrapRows.push(...bootstrapElasticTurnoutRows(respondents, turnoutModel, candidateVariant, alphas, stateAlphas, 160, "narrow"));
    bootstrapRows.push(...bootstrapElasticTurnoutRows(respondents, turnoutModel, candidateVariant, alphas, stateAlphas, 240, "wide"));
    candidateGridRowsAll.push(...candidateProfileGridRows(respondents, actualStates, turnoutModel, alphas, stateAlphas, candidateVariant));
  }
  writeCsv(join(OUT_DIR, "cces2016-turnout-bootstrap.csv"), bootstrapRows);
  const bootstrapSummary = bootstrapSummaryRows(bootstrapRows);
  writeCsv(join(OUT_DIR, "cces2016-turnout-bootstrap-summary.csv"), bootstrapSummary);
  writeCsv(join(OUT_DIR, "cces2016-candidate-profile-grid.csv"), candidateGridRowsAll);
  const candidateGridSummary = candidateGridSummaryRows(candidateGridRowsAll);
  writeCsv(join(OUT_DIR, "cces2016-candidate-profile-grid-summary.csv"), candidateGridSummary);
  const stateHoldoutRows = stateCalibrationHoldoutRows(respondents, actualStates);
  writeCsv(join(OUT_DIR, "cces2016-state-calibration-holdout.csv"), stateHoldoutRows);
  const crosswalkRows = await crosswalkStressRows(labels, actualStates, respondents);
  writeCsv(join(OUT_DIR, "cces2016-crosswalk-stress.csv"), crosswalkRows);
  const verdictRows = robustnessVerdictRows({
    crosswalkRows,
    gridRows: candidateGridRowsAll,
    stateHoldoutRows,
    bootstrapSummaryRows: bootstrapSummary,
  });
  writeCsv(join(OUT_DIR, "cces2016-robustness-verdict.csv"), verdictRows);
  writeFileSync(join(OUT_DIR, "cces2016-robustness-report.md"), robustnessMarkdown({
    crosswalkRows,
    gridSummaryRows: candidateGridSummary,
    stateHoldoutRows,
    bootstrapSummaryRows: bootstrapSummary,
    verdictRows,
  }), "utf-8");
  writeCsv(join(OUT_DIR, "cces2016-calibration-alphas.csv"), calibrationRows);
  writeCsv(join(OUT_DIR, "cces2016-state-calibration-alphas.csv"), stateCalibrationRows);

  const validationRows = validationNationalRows(reported.national, runs);
  writeCsv(join(OUT_DIR, "cces2016-validation-national.csv"), validationRows);
  const baselineRuns = runs.filter((r) => r.scenario === "baseline_clinton");
  writeCsv(join(OUT_DIR, "cces2016-validation-state.csv"), stateValidationRows(reported.states, baselineRuns, actualStates));

  const counterRows = counterfactualNationalRows(runs);
  writeCsv(join(OUT_DIR, "cces2016-counterfactual-national.csv"), counterRows);
  const stateRows = counterfactualStateRows(runs, actualStates);
  writeCsv(join(OUT_DIR, "cces2016-counterfactual-state.csv"), stateRows);
  const evRows = evSummaryRows(stateRows);
  writeCsv(join(OUT_DIR, "cces2016-counterfactual-ev.csv"), evRows);
  writeCsv(join(OUT_DIR, "cces2016-coalition-diagnostics.csv"), coalitionRows(runs, reported.byGroup));

  const nodeRows = nodeDistributionRows(respondents);
  const report = reportMarkdown({
    respondentCount: respondents.length,
    voterCount: respondents.filter((r) => r.isReportedVoter && r.weightVoter > 0).length,
    reported: reported.national,
    validationRows,
    counterRows,
    evRows,
    nodeRows,
    turnoutValidationRows: turnoutValidation,
    bootstrapSummaryRows: bootstrapSummary,
  });
  writeFileSync(join(OUT_DIR, "cces2016-bridge-report.md"), report, "utf-8");

  console.log(`Wrote CCES 2016 bridge artifacts to ${OUT_DIR}`);
  const best = validationRows
    .slice()
    .sort((a, b) => Math.abs(Number(a.model_minus_reported_dem_two_party)) - Math.abs(Number(b.model_minus_reported_dem_two_party)))[0];
  if (best) {
    console.log(`Best baseline: ${best.method}, D2P residual ${best.model_minus_reported_dem_two_party} pp, party accuracy ${best.accuracy_party_bucket}%`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
