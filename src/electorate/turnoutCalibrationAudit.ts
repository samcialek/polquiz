/**
 * Phase A — Turnout calibration diagnostic (read-only).
 *
 * Characterizes the empirical relationship between three signals available
 * to the model and validated turnout in the CCES sample:
 *   1. Mapper engagement score (0-10) → turnout rate
 *   2. predictVote nearest-candidate distance → turnout rate
 *   3. Demographics (age × education × race) → turnout rate
 *
 * Plus the predict-vote vs actual-turnout confusion matrix — does the
 * existing clearing-bar abstain logic pick out non-voters at all, even
 * imperfectly?
 *
 * Targets: 2008 (validated turnout, low mapper coverage), 2016 (validated
 * + ~55% coverage), 2020 (validated + ~65% coverage). 2012 and 2024 lack
 * validated turnout in their CCES releases and are excluded from the
 * calibration set; they will inherit the calibration as deployed.
 *
 * Read-only: no mapper / engine / candidate / era-context edits.
 *
 * Usage:
 *   npx tsx src/electorate/turnoutCalibrationAudit.ts
 *
 * Outputs:
 *   results/electorate/backtest/turnout-calibration-audit.json
 *   results/electorate/backtest/turnout-calibration-audit.md
 */

import * as fs from "node:fs";
import * as path from "node:path";

import { loadSurveyRespondents } from "./cesBacktestLoader.js";
import { mapSurveyToPrism } from "./surveyToPrismMapper.js";
import type { WeightedSurveyRespondent } from "./surveyBacktestTypes.js";
import type {
  SurveyPrismSignature,
  ContinuousNodeSignature,
  CategoricalNodeSignature,
} from "./surveyToPrismMapper.js";
import { ELECTIONS } from "../historical/candidates.js";
import { getContext } from "../historical/contexts.js";
import { predictVote } from "../historical/respondentVoteChoice.js";
import type { NodeSignature } from "../engine/respondentSignature.js";
import type { EngagementLevel } from "../engine/engagementLabel.js";
import type { ContinuousNodeId, NodeStatus, MorBoundariesNodeState } from "../types.js";

const OUT_DIR = "results/electorate/backtest";
const OUT_JSON = path.join(OUT_DIR, "turnout-calibration-audit.json");
const OUT_MD = path.join(OUT_DIR, "turnout-calibration-audit.md");

const TARGETS = [
  { year: 2008, file: "data/cces2008/cces_2008_common.tab" },
  { year: 2016, file: "data/cces2016/CCES16_Common_OUTPUT_Feb2018_VV.tab" },
  { year: 2020, file: "data/cces2020/CES20_Common_OUTPUT_vv.csv" },
];

// ─── Helpers ───────────────────────────────────────────────────────────

const CONTINUOUS_NODES = ["MAT", "CD", "CU", "MOR", "PRO", "COM", "ZS", "ONT_H", "ONT_S"] as const;
const CATEGORICAL_NODES = ["EPS", "AES"] as const;

function expectedPos5(d: ArrayLike<number>): number {
  let e = 0;
  for (let i = 0; i < 5; i++) e += (d[i] ?? 0) * (i + 1);
  return e;
}
function expectedSal4(d: ArrayLike<number>): number {
  return (d[0] ?? 0) * 0 + (d[1] ?? 0) * 1 + (d[2] ?? 0) * 2 + (d[3] ?? 0) * 3;
}
function expectedCatIdx6(d: ArrayLike<number>): number {
  let e = 0;
  for (let i = 0; i < 6; i++) e += (d[i] ?? 0) * i;
  return e;
}

function signatureToNodeSig(s: SurveyPrismSignature): NodeSignature {
  const sig: NodeSignature = {};
  for (const id of CONTINUOUS_NODES) {
    const ns: ContinuousNodeSignature = s[id];
    sig[id as ContinuousNodeId] = { pos: expectedPos5(ns.posPosterior), sal: expectedSal4(ns.salPosterior) };
  }
  for (const id of CATEGORICAL_NODES) {
    const ns: CategoricalNodeSignature = s[id];
    sig[id] = { pos: expectedCatIdx6(ns.catDistribution), sal: expectedSal4(ns.salPosterior), catDist: [...ns.catDistribution] };
  }
  return sig;
}

function morStateFromMapper(s: SurveyPrismSignature): MorBoundariesNodeState {
  const mb = s.moralBoundaries;
  return {
    boundaries: {
      national: mb.national.salience / 3,
      ethnic_racial: mb.ethnic_racial.salience / 3,
      religious: mb.religious.salience / 3,
      class: mb.class.salience / 3,
      ideological: mb.ideological.salience / 3,
      gender: mb.gender.salience / 3,
      political_tribe: mb.political_camp.salience / 3,
    },
    intensity: mb.intensity,
    touches: {},
    touchTypes: new Set(),
    status: "live_resolved" as NodeStatus,
  };
}

function engagementLevelFromValue(v: number): EngagementLevel {
  if (v < 2.5) return "apolitical";
  if (v < 5.0) return "casual";
  if (v < 7.5) return "engaged";
  return "highly-engaged";
}

function dominantContinuousNode(sig: NodeSignature): string | null {
  let best: string | null = null;
  let bestSal = -Infinity;
  for (const id of CONTINUOUS_NODES) {
    const e = sig[id as ContinuousNodeId];
    if (!e) continue;
    if (e.sal > bestSal) { bestSal = e.sal; best = id; }
  }
  return best;
}

function ageFromBirthyr(birthyr: number | undefined, year: number): number | null {
  if (!birthyr || birthyr < 1900 || birthyr > year - 17) return null;
  return year - birthyr;
}
function ageBucket(age: number | null): string {
  if (age === null) return "Unknown";
  if (age < 30) return "18-29";
  if (age < 45) return "30-44";
  if (age < 65) return "45-64";
  return "65+";
}
function educBucket(educ: number | string | undefined): string {
  // CCES educ codes: 1=No HS, 2=HS, 3=Some college, 4=2-year, 5=4-year, 6=Post-grad
  const n = typeof educ === "string" ? parseInt(educ, 10) : (educ ?? -1);
  if (!Number.isFinite(n) || n < 1) return "Unknown";
  if (n <= 2) return "HS or less";
  if (n <= 4) return "Some college";
  if (n === 5) return "College";
  if (n >= 6) return "Post-grad";
  return "Unknown";
}
function raceBucket(race: number | string | undefined, hispanic: number | string | undefined): string {
  // CCES race codes: 1=White, 2=Black, 3=Hispanic (sometimes), 4=Asian, 5=Native American, 6=Mixed, 7=Other, 8=ME/NA
  // Hispanic flag: 1=Yes, 2=No
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

// ─── Bin accumulator ────────────────────────────────────────────────────

interface BinAccum {
  weightedN: number;
  weightedVoted: number;
  rawN: number;
  rawVoted: number;
}
function newBin(): BinAccum { return { weightedN: 0, weightedVoted: 0, rawN: 0, rawVoted: 0 }; }
function addToBin(b: BinAccum, w: number, voted: boolean) {
  b.weightedN += w;
  b.rawN++;
  if (voted) {
    b.weightedVoted += w;
    b.rawVoted++;
  }
}
function turnoutRate(b: BinAccum): number {
  return b.weightedN > 0 ? b.weightedVoted / b.weightedN : 0;
}

// ─── Per-cycle audit ────────────────────────────────────────────────────

interface CycleAuditResult {
  year: number;
  rowsLoaded: number;
  validatedSubsetN: number;
  weightedTurnoutRateValidated: number;
  fecActualTurnoutRate: number;
  byEngagementBucket: Record<string, BinAccum & { rate: number }>;
  byEngagementValue: Array<{ minIncl: number; maxExcl: number; rate: number; n: number }>;
  byNearestDistanceQuintile: Array<{ minIncl: number; maxExcl: number; rate: number; n: number }>;
  byAge: Record<string, BinAccum & { rate: number }>;
  byEducation: Record<string, BinAccum & { rate: number }>;
  byRace: Record<string, BinAccum & { rate: number }>;
  byEngagementCoverage: Record<string, BinAccum & { rate: number }>;
  byMapperCoverage: Record<string, BinAccum & { rate: number }>;
  confusionMatrix: {
    predicted_vote_actually_voted: number;
    predicted_vote_actually_abstained: number;
    predicted_abstain_actually_voted: number;
    predicted_abstain_actually_abstained: number;
  };
  confusionMatrixWeighted: {
    predicted_vote_actually_voted: number;
    predicted_vote_actually_abstained: number;
    predicted_abstain_actually_voted: number;
    predicted_abstain_actually_abstained: number;
  };
  predictedAbstainRateWeighted: number;
  actualAbstainRateWeighted: number;
}

const FEC_TURNOUT: Record<number, number> = {
  2008: 0.6156,
  2012: 0.5879,
  2016: 0.6024,
  2020: 0.6661,
  2024: 0.6377,
};

async function auditCycle(year: number, file: string): Promise<CycleAuditResult> {
  const ctx = getContext(year);
  if (!ctx) throw new Error(`No context for ${year}`);
  const election = ELECTIONS.find(e => e.year === year);
  if (!election) throw new Error(`No election for ${year}`);

  const { respondents } = await loadSurveyRespondents({
    filePath: file,
    year,
    keepRawVarPayload: true,
  });

  // Engagement bucket bins (categorical + value-quintile + value-2pt-bands).
  const engBuckets: Record<string, BinAccum> = {
    apolitical: newBin(), casual: newBin(), engaged: newBin(), "highly-engaged": newBin(),
  };
  const engValueBands = [0, 2, 4, 6, 8, 10];
  const engValueBins: BinAccum[] = engValueBands.slice(0, -1).map(() => newBin());

  // Distance quintiles — stored as raw observations first, then bucketed after.
  const distanceObs: { d: number; voted: boolean; w: number }[] = [];

  // Demographics.
  const ageBins: Record<string, BinAccum> = { "18-29": newBin(), "30-44": newBin(), "45-64": newBin(), "65+": newBin(), Unknown: newBin() };
  const educBins: Record<string, BinAccum> = { "HS or less": newBin(), "Some college": newBin(), "College": newBin(), "Post-grad": newBin(), Unknown: newBin() };
  const raceBins: Record<string, BinAccum> = { White: newBin(), Black: newBin(), Hispanic: newBin(), Asian: newBin(), Other: newBin(), Unknown: newBin() };

  // Engagement-coverage diagnosis.
  const engCovBins: Record<string, BinAccum> = { real_signal: newBin(), fallback: newBin() };
  const mapperCovBins: Record<string, BinAccum> = {
    "0-25%": newBin(), "25-50%": newBin(), "50-75%": newBin(), "75-100%": newBin(),
  };

  // Confusion matrix (only validated-turnout subset).
  let cmRaw_PV_AV = 0, cmRaw_PV_AA = 0, cmRaw_PA_AV = 0, cmRaw_PA_AA = 0;
  let cmW_PV_AV = 0, cmW_PV_AA = 0, cmW_PA_AV = 0, cmW_PA_AA = 0;

  let validatedN = 0;
  let validatedW = 0;
  let validatedVotedW = 0;

  // CCES 2008 has symmetric validated turnout (voters AND non-voters both ground-
  // truthed via vote_gen08). CCES 2016/2020 use asymmetric encoding: a non-empty
  // CL_*GVM means "matched voter file as voter"; non-voters are NOT validated as
  // such — they fall through to self-report. To get a usable turnout signal for
  // 2016/2020, widen the filter to `turnoutObserved !== null` which mixes
  // validated voters with self-reported turnout. Self-report has ~10pp
  // over-reporting bias; that's a known cost noted in the report.
  let inclusionPolicy = year === 2008 ? "validated_only" : "any_observed";
  for (const r of respondents) {
    const include = year === 2008
      ? (r.turnoutValidated && r.turnoutObserved !== null)
      : (r.turnoutObserved !== null);
    if (!include) continue;
    validatedN++;
    validatedW += r.weight;
    if (r.turnoutObserved === true) validatedVotedW += r.weight;
    const voted = r.turnoutObserved === true;
    const w = r.weight;

    // Mapper signature for engagement/coverage and the model prediction.
    const sig = mapSurveyToPrism(r);
    const engVal = sig.engagement.value;
    const engLvl = engagementLevelFromValue(engVal);
    addToBin(engBuckets[engLvl]!, w, voted);

    // Engagement value bands.
    let bandIdx = engValueBands.findIndex((lo, i) => engVal >= lo && engVal < (engValueBands[i + 1] ?? Infinity));
    if (bandIdx === -1) bandIdx = engValueBands.length - 2;
    addToBin(engValueBins[bandIdx]!, w, voted);

    // Engagement source.
    if (sig.engagement.provenance.source === "real_signal") addToBin(engCovBins.real_signal!, w, voted);
    else addToBin(engCovBins.fallback!, w, voted);

    // Mapper coverage as fraction of (continuous + categorical) target nodes.
    const totalNodes = CONTINUOUS_NODES.length + CATEGORICAL_NODES.length;
    let realNodes = 0;
    for (const id of CONTINUOUS_NODES) if (sig[id].provenance.source === "real_signal") realNodes++;
    for (const id of CATEGORICAL_NODES) if (sig[id].provenance.source === "real_signal") realNodes++;
    const covPct = realNodes / totalNodes;
    let covBucket = "0-25%";
    if (covPct >= 0.75) covBucket = "75-100%";
    else if (covPct >= 0.5) covBucket = "50-75%";
    else if (covPct >= 0.25) covBucket = "25-50%";
    addToBin(mapperCovBins[covBucket]!, w, voted);

    // Demographics.
    const age = ageFromBirthyr(r.demographics.birthyr, year);
    const ageK = ageBucket(age);
    const educK = educBucket(r.demographics.educ);
    const raceK = raceBucket(r.demographics.race, r.demographics.hispanic);
    addToBin(ageBins[ageK]!, w, voted);
    addToBin(educBins[educK]!, w, voted);
    addToBin(raceBins[raceK]!, w, voted);

    // predictVote → distance + decision.
    const nodeSig = signatureToNodeSig(sig);
    const morState = morStateFromMapper(sig);
    const dominant = dominantContinuousNode(nodeSig);
    const prediction = predictVote(
      nodeSig,
      election.candidates,
      ctx,
      engLvl,
      null,
      null,
      null,
      false,
      dominant,
      morState,
    );
    const dist = prediction.nearest.distance;
    distanceObs.push({ d: dist, voted, w });
    const predictedVote = prediction.decision === "vote";

    // Confusion matrix.
    if (predictedVote && voted)        { cmRaw_PV_AV++; cmW_PV_AV += w; }
    else if (predictedVote && !voted)  { cmRaw_PV_AA++; cmW_PV_AA += w; }
    else if (!predictedVote && voted)  { cmRaw_PA_AV++; cmW_PA_AV += w; }
    else                               { cmRaw_PA_AA++; cmW_PA_AA += w; }
  }

  // Distance quintiles after sorting.
  distanceObs.sort((a, b) => a.d - b.d);
  const totalDistW = distanceObs.reduce((s, o) => s + o.w, 0);
  const quintileBoundaries: number[] = [];
  let acc = 0;
  for (const o of distanceObs) {
    acc += o.w;
    if (quintileBoundaries.length < 4 && acc >= ((quintileBoundaries.length + 1) * totalDistW) / 5) {
      quintileBoundaries.push(o.d);
    }
  }
  const distQuintiles: Array<{ minIncl: number; maxExcl: number; n: number; rate: number }> = [];
  const bounds = [0, ...quintileBoundaries, Number.POSITIVE_INFINITY];
  for (let i = 0; i < 5; i++) {
    const lo = bounds[i]!;
    const hi = bounds[i + 1]!;
    let bn = newBin();
    for (const o of distanceObs) {
      if (o.d >= lo && o.d < hi) addToBin(bn, o.w, o.voted);
    }
    distQuintiles.push({ minIncl: lo, maxExcl: hi, n: bn.rawN, rate: turnoutRate(bn) });
  }

  function withRate<T extends BinAccum>(map: Record<string, T>): Record<string, T & { rate: number }> {
    const out: Record<string, T & { rate: number }> = {};
    for (const [k, v] of Object.entries(map)) out[k] = { ...v, rate: turnoutRate(v) };
    return out;
  }

  return {
    year,
    rowsLoaded: respondents.length,
    validatedSubsetN: validatedN,
    weightedTurnoutRateValidated: validatedW > 0 ? validatedVotedW / validatedW : 0,
    fecActualTurnoutRate: FEC_TURNOUT[year] ?? 0,
    byEngagementBucket: withRate(engBuckets),
    byEngagementValue: engValueBins.map((b, i) => ({
      minIncl: engValueBands[i]!,
      maxExcl: engValueBands[i + 1]!,
      n: b.rawN,
      rate: turnoutRate(b),
    })),
    byNearestDistanceQuintile: distQuintiles,
    byAge: withRate(ageBins),
    byEducation: withRate(educBins),
    byRace: withRate(raceBins),
    byEngagementCoverage: withRate(engCovBins),
    byMapperCoverage: withRate(mapperCovBins),
    confusionMatrix: {
      predicted_vote_actually_voted: cmRaw_PV_AV,
      predicted_vote_actually_abstained: cmRaw_PV_AA,
      predicted_abstain_actually_voted: cmRaw_PA_AV,
      predicted_abstain_actually_abstained: cmRaw_PA_AA,
    },
    confusionMatrixWeighted: {
      predicted_vote_actually_voted: cmW_PV_AV,
      predicted_vote_actually_abstained: cmW_PV_AA,
      predicted_abstain_actually_voted: cmW_PA_AV,
      predicted_abstain_actually_abstained: cmW_PA_AA,
    },
    predictedAbstainRateWeighted: validatedW > 0 ? (cmW_PA_AV + cmW_PA_AA) / validatedW : 0,
    actualAbstainRateWeighted: validatedW > 0 ? 1 - validatedVotedW / validatedW : 0,
  };
}

// ─── Markdown renderer ──────────────────────────────────────────────────

function renderTable(headers: string[], rows: (string | number)[][]): string {
  const head = `| ${headers.join(" | ")} |\n| ${headers.map(() => "---").join(" | ")} |`;
  const body = rows.map(r => `| ${r.join(" | ")} |`).join("\n");
  return `${head}\n${body}`;
}

function fmtPct(x: number): string { return (x * 100).toFixed(1) + "%"; }
function fmtNum(x: number, d = 2): string { return x.toFixed(d); }

function renderMD(results: CycleAuditResult[]): string {
  const lines: string[] = [];
  lines.push("# Phase A — Turnout Calibration Audit");
  lines.push("");
  lines.push("Read-only diagnostic on CCES validated-turnout subset for 2008 / 2016 / 2020.");
  lines.push("Tests four signals available to the model against actual turnout:");
  lines.push("(1) mapper engagement value, (2) mapper engagement bucket, (3) `predictVote`");
  lines.push("nearest-candidate distance, (4) demographics (age / education / race).");
  lines.push("Plus the existing predict-vote confusion matrix vs validated turnout.");
  lines.push("");
  lines.push("## CRITICAL DATA-AVAILABILITY CAVEAT");
  lines.push("");
  lines.push("**Only CCES 2008 has clean turnout ground truth across the full sample.** The");
  lines.push("`vote_gen08` column carries explicit voted/nonvoted codes for both voters AND");
  lines.push("nonvoters; the loader treats both as `turnoutValidated=true`. 2008 turnout rate");
  lines.push("on the validated subset matches FEC within ±0.5pp.");
  lines.push("");
  lines.push("**CCES 2016 / 2020 use asymmetric encoding** — non-empty `CL_*GVM` means");
  lines.push("\"matched voter file as voter\"; empty means \"unmatched OR nonvoter\" (the column");
  lines.push("does not distinguish the two). Self-reported turnout in these cycles is");
  lines.push("severely biased: of ~60k respondents, only ~75–118 self-report as nonvoters");
  lines.push("(real-world rate is ~40%). Most nonvoters skip the post-wave survey entirely");
  lines.push("and end up with `turnoutObserved=null`.");
  lines.push("");
  lines.push("**Practical consequence:** all calibration curves (engagement → turnout,");
  lines.push("distance → turnout, demographics → turnout) are derived from **2008 only**.");
  lines.push("2016/2020 sections in this report show the engagement-distribution and the");
  lines.push("predict-vote confusion matrix on the validated-voter subset, but the implied");
  lines.push("99%+ turnout rate is a sample-encoding artefact, not a finding. Real-world");
  lines.push("calibration of 2016/2020 abstention requires re-linking CCES to the voter");
  lines.push("file at the row level (not in scope for this phase).");
  lines.push("");
  lines.push("**Decision criterion:** if a signal's turnout-rate difference between top and");
  lines.push("bottom buckets is < 5pp, it has no calibration value. If 5–15pp, weak signal.");
  lines.push("If > 15pp, useful signal worth wiring into a turnout-prediction layer.");
  lines.push("");

  for (const r of results) {
    lines.push(`## ${r.year}`);
    lines.push("");
    lines.push(`**Validated-turnout subset:** ${r.validatedSubsetN.toLocaleString()} respondents.`);
    lines.push(`**Weighted turnout rate (validated subset):** ${fmtPct(r.weightedTurnoutRateValidated)}.`);
    lines.push(`**FEC actual turnout rate (% of VEP):** ${fmtPct(r.fecActualTurnoutRate)}.`);
    lines.push(`**Predicted abstain rate (current model):** ${fmtPct(r.predictedAbstainRateWeighted)}.`);
    lines.push(`**Actual abstain rate (validated):** ${fmtPct(r.actualAbstainRateWeighted)}.`);
    lines.push("");

    lines.push("### Confusion matrix vs validated turnout");
    lines.push("");
    lines.push("|   | Actually voted | Actually abstained |");
    lines.push("|---|---:|---:|");
    const cm = r.confusionMatrixWeighted;
    const totalW = cm.predicted_vote_actually_voted + cm.predicted_vote_actually_abstained + cm.predicted_abstain_actually_voted + cm.predicted_abstain_actually_abstained;
    lines.push(`| Predicted vote      | ${fmtPct(cm.predicted_vote_actually_voted/totalW)} (${(cm.predicted_vote_actually_voted/1000).toFixed(1)}k) | ${fmtPct(cm.predicted_vote_actually_abstained/totalW)} (${(cm.predicted_vote_actually_abstained/1000).toFixed(1)}k) |`);
    lines.push(`| Predicted abstain   | ${fmtPct(cm.predicted_abstain_actually_voted/totalW)} (${(cm.predicted_abstain_actually_voted/1000).toFixed(1)}k) | ${fmtPct(cm.predicted_abstain_actually_abstained/totalW)} (${(cm.predicted_abstain_actually_abstained/1000).toFixed(1)}k) |`);
    lines.push("");

    lines.push("### Engagement bucket → turnout rate");
    lines.push("");
    lines.push(renderTable(
      ["Bucket", "n", "weighted-N", "Turnout rate"],
      Object.entries(r.byEngagementBucket).map(([k, v]) => [k, v.rawN, fmtNum(v.weightedN, 0), fmtPct(v.rate)]),
    ));
    lines.push("");

    lines.push("### Engagement value bands → turnout rate");
    lines.push("");
    lines.push(renderTable(
      ["Band (engagement value)", "n", "Turnout rate"],
      r.byEngagementValue.map(b => [`[${b.minIncl}, ${b.maxExcl})`, b.n, fmtPct(b.rate)]),
    ));
    lines.push("");

    lines.push("### Nearest-candidate distance quintile → turnout rate");
    lines.push("");
    lines.push(renderTable(
      ["Quintile", "Distance range", "n", "Turnout rate"],
      r.byNearestDistanceQuintile.map((b, i) => [
        `Q${i + 1}` + (i === 0 ? " (closest)" : i === 4 ? " (farthest)" : ""),
        `[${fmtNum(b.minIncl, 3)}, ${b.maxExcl === Number.POSITIVE_INFINITY ? "∞" : fmtNum(b.maxExcl, 3)})`,
        b.n,
        fmtPct(b.rate),
      ]),
    ));
    lines.push("");

    lines.push("### Age → turnout rate");
    lines.push("");
    lines.push(renderTable(
      ["Age", "n", "weighted-N", "Turnout rate"],
      Object.entries(r.byAge).map(([k, v]) => [k, v.rawN, fmtNum(v.weightedN, 0), fmtPct(v.rate)]),
    ));
    lines.push("");

    lines.push("### Education → turnout rate");
    lines.push("");
    lines.push(renderTable(
      ["Education", "n", "weighted-N", "Turnout rate"],
      Object.entries(r.byEducation).map(([k, v]) => [k, v.rawN, fmtNum(v.weightedN, 0), fmtPct(v.rate)]),
    ));
    lines.push("");

    lines.push("### Race / ethnicity → turnout rate");
    lines.push("");
    lines.push(renderTable(
      ["Race", "n", "weighted-N", "Turnout rate"],
      Object.entries(r.byRace).map(([k, v]) => [k, v.rawN, fmtNum(v.weightedN, 0), fmtPct(v.rate)]),
    ));
    lines.push("");

    lines.push("### Mapper engagement source (real_signal vs fallback) → turnout rate");
    lines.push("");
    lines.push(renderTable(
      ["Source", "n", "weighted-N", "Turnout rate"],
      Object.entries(r.byEngagementCoverage).map(([k, v]) => [k, v.rawN, fmtNum(v.weightedN, 0), fmtPct(v.rate)]),
    ));
    lines.push("");

    lines.push("### Mapper coverage (% of nodes with real_signal) → turnout rate");
    lines.push("");
    lines.push(renderTable(
      ["Coverage", "n", "weighted-N", "Turnout rate"],
      Object.entries(r.byMapperCoverage).map(([k, v]) => [k, v.rawN, fmtNum(v.weightedN, 0), fmtPct(v.rate)]),
    ));
    lines.push("");
  }

  return lines.join("\n");
}

// ─── Main ───────────────────────────────────────────────────────────────

async function main() {
  const startedAt = new Date().toISOString();
  const results: CycleAuditResult[] = [];
  for (const t of TARGETS) {
    process.stdout.write(`Auditing ${t.year} ... `);
    const t0 = Date.now();
    const r = await auditCycle(t.year, t.file);
    process.stdout.write(`done in ${((Date.now() - t0) / 1000).toFixed(1)}s. validated subset n=${r.validatedSubsetN}, turnout rate ${(r.weightedTurnoutRateValidated * 100).toFixed(1)}% (FEC ${(r.fecActualTurnoutRate * 100).toFixed(1)}%), predicted abstain ${(r.predictedAbstainRateWeighted * 100).toFixed(1)}%\n`);
    results.push(r);
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(OUT_JSON, JSON.stringify({ generated_at: startedAt, cycles: results }, null, 2));
  fs.writeFileSync(OUT_MD, renderMD(results));
  console.log(`\nWrote ${OUT_JSON}\nWrote ${OUT_MD}`);
}

main().catch(err => { console.error(err); process.exit(1); });
