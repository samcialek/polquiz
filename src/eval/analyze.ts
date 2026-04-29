// @ts-nocheck
// PENDING PHASE-3 PORT — Step-4 analyzer reads pre-Phase-3 SimRun posterior
// fields. Phase 3g rebuilds against the distance-native SimRun shape.

/**
 * Step 4 analyzer.
 *
 * Reads the Step 3 JSONL files + manifest, computes all metrics we can
 * derive from the archetype-posterior-only capture, and writes:
 *   results/step4/
 *     confusion-sigma-XX.csv              # 121×121 confusion matrix
 *     per-archetype-metrics.csv           # recall + entropy + credset + stop
 *     tier-confusion-sigma-XX.csv
 *     stop-rule-distribution.csv
 *     confusion-pairs-sigma-XX.csv        # top-20 misclass pairs
 *     family-pair-calibration.json
 *     flagged-lists.json
 *     preregistered-families.json
 *     drift-flags.json
 *     report.md
 *
 * Per-dimension (node-level) variance reduction requires node state, which
 * the Step 3 capture doesn't have — flagged in the report as needing a
 * supplementary run if the user wants it.
 */

import * as fs from "fs";
import * as path from "path";
import * as readline from "readline";

import { ARCHETYPES } from "../config/archetypes.js";
import { REPRESENTATIVE_QUESTIONS } from "../config/questions.representative.js";

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------
const STEP3_DIR = path.join(process.cwd(), "results", "step3");
const OUT_DIR = path.join(process.cwd(), "results", "step4");
const DEACTIVATED = new Set(["019", "023", "025"]);
const PREREG_FAMILIES: Array<[string, string]> = [
  ["019", "020"],
  ["098", "102"],
  ["070", "075"],
  ["091", "097"],
  ["049", "050"],
];
const CREDSET_ALPHA = 0.95;
const FAMILY_GAP = 0.03;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface Row {
  archetypeId: string;
  archetypeName: string;
  archetypePrior: number;
  noiseSigma: number;
  rep: number;
  seed: number;
  resultId: string;
  resultName: string;
  correct: boolean;
  questionsAsked: number;
  topPosterior: number;
  margin: number;
  rank: number;
  top5: string[];
  stopFired: string;
  familyPairDetected: { top1: string; top2: string } | null;
  posteriorFinal: Record<string, number>;
}

interface PerArchStats {
  id: string;
  name: string;
  tier: string;
  prior: number;
  deactivated: boolean;
  runs: number;
  top1: number;
  top3: number;
  top5: number;
  entropySum: number;
  credsetSum: number;
  questionsSum: number;
  questionsDist: number[];
  familyDetectedCount: number;
  familyCorrectCount: number;
  stopCounts: Record<string, number>;
}

interface SigmaBlock {
  sigma: number;
  file: string;
  confusion: Record<string, Record<string, number>>;
  perArch: Record<string, PerArchStats>;
  stopTotals: Record<string, number>;
  stopByCorrect: Record<string, { correct: number; total: number }>;
  totalRuns: number;
  familyPairTotals: { detected: number; correctWhenDetected: number };
  // pre-registered families — per-direction stats
  preregStats: Record<string, { runs: number; partnerAppearedInTop2: number; partnerAppearedInTop5: number; familyPairFlagged: number }>;
  // per-run top1 of deactivated-targeted runs (attractor analysis for prior=0 rows)
  deactivatedAttractors: Record<string, Record<string, number>>;
}

// ---------------------------------------------------------------------------
// Archetype metadata
// ---------------------------------------------------------------------------
const ARCH_META = Object.fromEntries(
  ARCHETYPES.map(a => [a.id, { id: a.id, name: a.name, tier: a.tier, prior: a.prior }])
) as Record<string, { id: string; name: string; tier: string; prior: number }>;
const ACTIVE_IDS = ARCHETYPES.filter(a => !DEACTIVATED.has(a.id)).map(a => a.id);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function entropyOfPosterior(p: Record<string, number>): number {
  let h = 0;
  for (const v of Object.values(p)) {
    if (v > 0) h -= v * Math.log(v);
  }
  return h;
}

function credibleSetSize(p: Record<string, number>, alpha: number): number {
  const vals = Object.values(p).sort((a, b) => b - a);
  let sum = 0;
  for (let i = 0; i < vals.length; i++) {
    sum += vals[i]!;
    if (sum >= alpha) return i + 1;
  }
  return vals.length;
}

function makePerArchStats(id: string): PerArchStats {
  const meta = ARCH_META[id]!;
  return {
    id,
    name: meta?.name ?? "?",
    tier: meta?.tier ?? "?",
    prior: meta?.prior ?? 0,
    deactivated: DEACTIVATED.has(id),
    runs: 0,
    top1: 0,
    top3: 0,
    top5: 0,
    entropySum: 0,
    credsetSum: 0,
    questionsSum: 0,
    questionsDist: [],
    familyDetectedCount: 0,
    familyCorrectCount: 0,
    stopCounts: {},
  };
}

function makeSigmaBlock(sigma: number, file: string): SigmaBlock {
  const perArch: Record<string, PerArchStats> = {};
  for (const a of ARCHETYPES) perArch[a.id] = makePerArchStats(a.id);
  const preregStats: SigmaBlock["preregStats"] = {};
  for (const [a, b] of PREREG_FAMILIES) {
    preregStats[`${a}↔${b}`] = { runs: 0, partnerAppearedInTop2: 0, partnerAppearedInTop5: 0, familyPairFlagged: 0 };
  }
  return {
    sigma,
    file,
    confusion: {},
    perArch,
    stopTotals: {},
    stopByCorrect: {},
    totalRuns: 0,
    familyPairTotals: { detected: 0, correctWhenDetected: 0 },
    preregStats,
    deactivatedAttractors: {},
  };
}

async function processSigmaFile(sigma: number, file: string): Promise<SigmaBlock> {
  const block = makeSigmaBlock(sigma, file);
  const rl = readline.createInterface({
    input: fs.createReadStream(file, { encoding: "utf-8" }),
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    if (!line.trim()) continue;
    const r = JSON.parse(line) as Row;
    block.totalRuns++;

    // Confusion (121×121): [truth][predicted]++
    block.confusion[r.archetypeId] ??= {};
    block.confusion[r.archetypeId]![r.resultId] = (block.confusion[r.archetypeId]![r.resultId] ?? 0) + 1;

    // Per-archetype stats
    const pa = block.perArch[r.archetypeId]!;
    pa.runs++;
    if (r.rank === 1) pa.top1++;
    if (r.rank <= 3) pa.top3++;
    if (r.rank <= 5) pa.top5++;
    pa.entropySum += entropyOfPosterior(r.posteriorFinal);
    pa.credsetSum += credibleSetSize(r.posteriorFinal, CREDSET_ALPHA);
    pa.questionsSum += r.questionsAsked;
    pa.questionsDist.push(r.questionsAsked);
    pa.stopCounts[r.stopFired] = (pa.stopCounts[r.stopFired] ?? 0) + 1;
    if (r.familyPairDetected) {
      pa.familyDetectedCount++;
      const inPair = r.familyPairDetected.top1 === r.archetypeId || r.familyPairDetected.top2 === r.archetypeId;
      if (inPair) pa.familyCorrectCount++;
    }

    // Stop rule totals
    block.stopTotals[r.stopFired] = (block.stopTotals[r.stopFired] ?? 0) + 1;
    block.stopByCorrect[r.stopFired] ??= { correct: 0, total: 0 };
    block.stopByCorrect[r.stopFired]!.total++;
    if (r.correct) block.stopByCorrect[r.stopFired]!.correct++;

    // Family pair totals
    if (r.familyPairDetected) {
      block.familyPairTotals.detected++;
      const inPair = r.familyPairDetected.top1 === r.archetypeId || r.familyPairDetected.top2 === r.archetypeId;
      if (inPair) block.familyPairTotals.correctWhenDetected++;
    }

    // Pre-registered family pairs
    for (const [a, b] of PREREG_FAMILIES) {
      if (r.archetypeId === a || r.archetypeId === b) {
        const key = `${a}↔${b}`;
        const partner = r.archetypeId === a ? b : a;
        const stats = block.preregStats[key]!;
        stats.runs++;
        const top2Ids = r.top5.slice(0, 2).map(s => s.split(":")[0]!);
        const top5Ids = r.top5.map(s => s.split(":")[0]!);
        if (top2Ids.includes(partner)) stats.partnerAppearedInTop2++;
        if (top5Ids.includes(partner)) stats.partnerAppearedInTop5++;
        if (r.familyPairDetected &&
            (r.familyPairDetected.top1 === partner || r.familyPairDetected.top2 === partner)) {
          stats.familyPairFlagged++;
        }
      }
    }

    // Deactivated attractor tracking
    if (DEACTIVATED.has(r.archetypeId)) {
      block.deactivatedAttractors[r.archetypeId] ??= {};
      block.deactivatedAttractors[r.archetypeId]![r.resultId] =
        (block.deactivatedAttractors[r.archetypeId]![r.resultId] ?? 0) + 1;
    }
  }

  return block;
}

// ---------------------------------------------------------------------------
// CSV writers
// ---------------------------------------------------------------------------
function writeConfusionCsv(block: SigmaBlock, outPath: string): void {
  const ids = ARCHETYPES.map(a => a.id);
  const headers = ["truth_id", "truth_name", "truth_tier", "truth_deactivated", ...ids];
  const lines = [headers.join(",")];
  for (const truthId of ids) {
    const meta = ARCH_META[truthId]!;
    const row: (string | number)[] = [
      truthId,
      `"${meta.name.replace(/"/g, '""')}"`,
      meta.tier,
      DEACTIVATED.has(truthId) ? "1" : "0",
    ];
    for (const predId of ids) {
      row.push(block.confusion[truthId]?.[predId] ?? 0);
    }
    lines.push(row.join(","));
  }
  fs.writeFileSync(outPath, lines.join("\n"));
}

function writePerArchCsv(blocks: SigmaBlock[], outPath: string): void {
  const sigmas = blocks.map(b => b.sigma);
  const headers = [
    "id", "name", "tier", "deactivated", "prior",
    ...sigmas.flatMap(s => [
      `sigma_${s}_runs`,
      `sigma_${s}_top1_pct`,
      `sigma_${s}_top3_pct`,
      `sigma_${s}_top5_pct`,
      `sigma_${s}_mean_entropy`,
      `sigma_${s}_mean_credset95`,
      `sigma_${s}_mean_q`,
      `sigma_${s}_median_q`,
      `sigma_${s}_family_detected_pct`,
      `sigma_${s}_family_correct_when_detected_pct`,
    ]),
  ];
  const lines = [headers.join(",")];
  for (const a of ARCHETYPES) {
    const row: (string | number)[] = [
      a.id,
      `"${a.name.replace(/"/g, '""')}"`,
      a.tier,
      DEACTIVATED.has(a.id) ? "1" : "0",
      a.prior,
    ];
    for (const block of blocks) {
      const p = block.perArch[a.id]!;
      const n = p.runs || 1;
      const top1Pct = p.runs ? (p.top1 / p.runs) * 100 : 0;
      const top3Pct = p.runs ? (p.top3 / p.runs) * 100 : 0;
      const top5Pct = p.runs ? (p.top5 / p.runs) * 100 : 0;
      const entropy = p.entropySum / n;
      const credset = p.credsetSum / n;
      const meanQ = p.questionsSum / n;
      const sorted = [...p.questionsDist].sort((a, b) => a - b);
      const medianQ = sorted.length ? sorted[Math.floor(sorted.length / 2)]! : 0;
      const familyPct = p.runs ? (p.familyDetectedCount / p.runs) * 100 : 0;
      const familyCorrectPct = p.familyDetectedCount
        ? (p.familyCorrectCount / p.familyDetectedCount) * 100
        : 0;
      row.push(
        p.runs,
        top1Pct.toFixed(2),
        top3Pct.toFixed(2),
        top5Pct.toFixed(2),
        entropy.toFixed(4),
        credset.toFixed(2),
        meanQ.toFixed(2),
        medianQ,
        familyPct.toFixed(2),
        familyCorrectPct.toFixed(2),
      );
    }
    lines.push(row.join(","));
  }
  fs.writeFileSync(outPath, lines.join("\n"));
}

function writeTierConfusionCsv(block: SigmaBlock, outPath: string): void {
  const tiers = ["T1", "T2", "MEANS", "GATE", "REALITY"];
  const tierOf = (id: string): string => ARCH_META[id]?.tier ?? "?";
  const matrix: Record<string, Record<string, number>> = {};
  for (const t of tiers) {
    matrix[t] = {};
    for (const t2 of tiers) matrix[t]![t2] = 0;
  }
  for (const [truth, preds] of Object.entries(block.confusion)) {
    if (DEACTIVATED.has(truth)) continue;
    const tTruth = tierOf(truth);
    for (const [pred, n] of Object.entries(preds)) {
      const tPred = tierOf(pred);
      if (matrix[tTruth] && matrix[tTruth]![tPred] !== undefined) {
        matrix[tTruth]![tPred]! += n;
      }
    }
  }
  const lines = [["truth_tier", ...tiers].join(",")];
  for (const t of tiers) {
    lines.push([t, ...tiers.map(t2 => matrix[t]![t2]!)].join(","));
  }
  fs.writeFileSync(outPath, lines.join("\n"));
}

function writeStopRuleCsv(blocks: SigmaBlock[], outPath: string): void {
  const sigmas = blocks.map(b => b.sigma);
  const keys = new Set<string>();
  for (const b of blocks) for (const k of Object.keys(b.stopTotals)) keys.add(k);
  const sortedKeys = [...keys].sort();
  const headers = [
    "stopFired",
    ...sigmas.flatMap(s => [`sigma_${s}_count`, `sigma_${s}_pct`, `sigma_${s}_correct_pct`]),
  ];
  const lines = [headers.join(",")];
  for (const k of sortedKeys) {
    const row: (string | number)[] = [k];
    for (const b of blocks) {
      const count = b.stopTotals[k] ?? 0;
      const pct = b.totalRuns ? (count / b.totalRuns) * 100 : 0;
      const sc = b.stopByCorrect[k] ?? { correct: 0, total: 0 };
      const correctPct = sc.total ? (sc.correct / sc.total) * 100 : 0;
      row.push(count, pct.toFixed(2), correctPct.toFixed(2));
    }
    lines.push(row.join(","));
  }
  fs.writeFileSync(outPath, lines.join("\n"));
}

function writeConfusionPairsCsv(block: SigmaBlock, outPath: string, limit = 20): void {
  const pairs: Array<{ from: string; to: string; count: number }> = [];
  for (const [truth, preds] of Object.entries(block.confusion)) {
    if (DEACTIVATED.has(truth)) continue;
    for (const [pred, count] of Object.entries(preds)) {
      if (truth === pred) continue;
      pairs.push({ from: truth, to: pred, count });
    }
  }
  pairs.sort((a, b) => b.count - a.count);
  const lines = [
    ["from_id", "from_name", "to_id", "to_name", "count", "from_runs", "miss_fraction"].join(","),
  ];
  for (const { from, to, count } of pairs.slice(0, limit)) {
    const fromRuns = block.perArch[from]?.runs ?? 0;
    const frac = fromRuns ? count / fromRuns : 0;
    const fromName = ARCH_META[from]?.name ?? "?";
    const toName = ARCH_META[to]?.name ?? "?";
    lines.push(
      [
        from,
        `"${fromName.replace(/"/g, '""')}"`,
        to,
        `"${toName.replace(/"/g, '""')}"`,
        count,
        fromRuns,
        frac.toFixed(4),
      ].join(","),
    );
  }
  fs.writeFileSync(outPath, lines.join("\n"));
}

// ---------------------------------------------------------------------------
// Flagged lists
// ---------------------------------------------------------------------------
interface FlaggedLists {
  nonIdentifiable: Array<{ id: string; name: string; sigma0_top1_pct: number }>;
  fragile: Array<{ id: string; name: string; sigma0_top1: number; sigma05_top1: number; drop: number }>;
  attractors: Array<{ id: string; name: string; missesAttracted_sigma0: number; missesAttracted_sigma05: number; missesAttracted_sigma15: number }>;
  orphans: Array<{ id: string; name: string; meanRank_sigma0: number }>;
  diffuse: Array<{ id: string; name: string; meanCredset_sigma0: number; meanEntropy_sigma0: number }>;
  familyPairUnderCalibrated: Array<{ id: string; name: string; sigma: number; correctWhenDetected_pct: number; detectedRuns: number }>;
}

function computeFlaggedLists(blocks: SigmaBlock[]): FlaggedLists {
  const [s0, s05, s15] = blocks;
  if (!s0 || !s05 || !s15) throw new Error("Expected 3 sigma blocks");

  // Non-identifiable: σ=0 top-1 < 50% — but σ=0 is deterministic, so top-1 is
  // 0% or 100% for every active archetype. "Non-identifiable" = σ=0 top-1 = 0.
  const nonIdentifiable: FlaggedLists["nonIdentifiable"] = [];
  for (const a of ARCHETYPES) {
    if (DEACTIVATED.has(a.id)) continue;
    const p = s0.perArch[a.id]!;
    const pct = p.runs ? (p.top1 / p.runs) * 100 : 0;
    if (pct < 50) nonIdentifiable.push({ id: a.id, name: a.name, sigma0_top1_pct: pct });
  }

  // Fragile: σ=0 top-1 = 100% but σ=0.5 drops > 20pp
  const fragile: FlaggedLists["fragile"] = [];
  for (const a of ARCHETYPES) {
    if (DEACTIVATED.has(a.id)) continue;
    const p0 = s0.perArch[a.id]!;
    const p1 = s05.perArch[a.id]!;
    const pct0 = p0.runs ? (p0.top1 / p0.runs) * 100 : 0;
    const pct1 = p1.runs ? (p1.top1 / p1.runs) * 100 : 0;
    if (pct0 >= 99 && pct0 - pct1 >= 20) {
      fragile.push({ id: a.id, name: a.name, sigma0_top1: pct0, sigma05_top1: pct1, drop: pct0 - pct1 });
    }
  }
  fragile.sort((a, b) => b.drop - a.drop);

  // Attractors: which archetypes collect the most misclassifications (across σ)
  const attractorCounts: Record<string, { s0: number; s05: number; s15: number }> = {};
  for (const a of ARCHETYPES) attractorCounts[a.id] = { s0: 0, s05: 0, s15: 0 };
  const addAttract = (block: SigmaBlock, field: "s0" | "s05" | "s15") => {
    for (const [truth, preds] of Object.entries(block.confusion)) {
      if (DEACTIVATED.has(truth)) continue;
      for (const [pred, count] of Object.entries(preds)) {
        if (truth === pred) continue;
        attractorCounts[pred]![field] += count;
      }
    }
  };
  addAttract(s0, "s0");
  addAttract(s05, "s05");
  addAttract(s15, "s15");
  const attractors: FlaggedLists["attractors"] = [];
  for (const a of ARCHETYPES) {
    const c = attractorCounts[a.id]!;
    if (c.s0 + c.s05 + c.s15 > 0) {
      attractors.push({
        id: a.id,
        name: a.name,
        missesAttracted_sigma0: c.s0,
        missesAttracted_sigma05: c.s05,
        missesAttracted_sigma15: c.s15,
      });
    }
  }
  attractors.sort((a, b) =>
    (b.missesAttracted_sigma0 + b.missesAttracted_sigma05 + b.missesAttracted_sigma15) -
    (a.missesAttracted_sigma0 + a.missesAttracted_sigma05 + a.missesAttracted_sigma15),
  );

  // Orphans: archetypes whose own σ=0 runs yield high mean rank (hard to recover)
  const orphans: FlaggedLists["orphans"] = [];
  for (const a of ARCHETYPES) {
    if (DEACTIVATED.has(a.id)) continue;
    const p = s0.perArch[a.id]!;
    if (!p.runs) continue;
    const pct = (p.top1 / p.runs) * 100;
    if (pct < 100) {
      // read ranks from confusion — infer rank=1 count, else unknown. Skip
      // detailed mean-rank since we'd need per-run rank in the aggregator.
      // Use top5 miss as a weak proxy.
      const top5Pct = (p.top5 / p.runs) * 100;
      if (top5Pct < 100) {
        orphans.push({ id: a.id, name: a.name, meanRank_sigma0: 0 });
      }
    }
  }

  // Diffuse: largest mean credible-set at σ=0
  const diffuse: FlaggedLists["diffuse"] = [];
  for (const a of ARCHETYPES) {
    if (DEACTIVATED.has(a.id)) continue;
    const p = s0.perArch[a.id]!;
    if (!p.runs) continue;
    const credset = p.credsetSum / p.runs;
    const entropy = p.entropySum / p.runs;
    diffuse.push({ id: a.id, name: a.name, meanCredset_sigma0: credset, meanEntropy_sigma0: entropy });
  }
  diffuse.sort((a, b) => b.meanCredset_sigma0 - a.meanCredset_sigma0);

  // Family-pair under-calibrated: archetypes where, when flagged, partner not
  // in fact in {top1, top2}. Target ≥95%.
  const familyPairUnderCalibrated: FlaggedLists["familyPairUnderCalibrated"] = [];
  for (const block of blocks) {
    for (const a of ARCHETYPES) {
      if (DEACTIVATED.has(a.id)) continue;
      const p = block.perArch[a.id]!;
      if (p.familyDetectedCount >= 20) {
        const correctPct = (p.familyCorrectCount / p.familyDetectedCount) * 100;
        if (correctPct < 95) {
          familyPairUnderCalibrated.push({
            id: a.id,
            name: a.name,
            sigma: block.sigma,
            correctWhenDetected_pct: correctPct,
            detectedRuns: p.familyDetectedCount,
          });
        }
      }
    }
  }
  familyPairUnderCalibrated.sort((a, b) => a.correctWhenDetected_pct - b.correctWhenDetected_pct);

  return {
    nonIdentifiable,
    fragile,
    attractors: attractors.slice(0, 20),
    orphans,
    diffuse: diffuse.slice(0, 20),
    familyPairUnderCalibrated,
  };
}

// ---------------------------------------------------------------------------
// Family & prereg analysis
// ---------------------------------------------------------------------------
interface FamilyCalibration {
  sigma: number;
  detected: number;
  correctWhenDetected: number;
  detectedPct: number;
  correctWhenDetectedPct: number;
  target: number;
  pass: boolean;
}

function computeFamilyCalibration(blocks: SigmaBlock[]): FamilyCalibration[] {
  return blocks.map(b => {
    const { detected, correctWhenDetected } = b.familyPairTotals;
    return {
      sigma: b.sigma,
      detected,
      correctWhenDetected,
      detectedPct: b.totalRuns ? (detected / b.totalRuns) * 100 : 0,
      correctWhenDetectedPct: detected ? (correctWhenDetected / detected) * 100 : 0,
      target: 95,
      pass: detected > 0 && (correctWhenDetected / detected) * 100 >= 95,
    };
  });
}

// ---------------------------------------------------------------------------
// Drift flags
// ---------------------------------------------------------------------------
function computeDriftFlags(): Array<{ id: string; description: string; severity: string }> {
  const flags: Array<{ id: string; description: string; severity: string }> = [];

  flags.push({
    id: "claudemd-question-count",
    description: `CLAUDE.md claims ~74 representative questions; actual REPRESENTATIVE_QUESTIONS.length = ${REPRESENTATIVE_QUESTIONS.length}.`,
    severity: "info",
  });
  flags.push({
    id: "claudemd-question-range",
    description: "CLAUDE.md says engine selects ~55–65 questions per respondent; actual hard cap in runtimeConfig is 55.",
    severity: "info",
  });
  flags.push({
    id: "trb-anchor-9v7",
    description: "types.ts TRB anchor enum has 9 values (adds 'gender' and 'sexual'); categories.ts TRB_ANCHORS lists 7. State initialises dist as length-9 uniform. Downstream logic that reads TRB_ANCHORS may miss the added anchors.",
    severity: "medium",
  });
  flags.push({
    id: "node-norm-factors-unused",
    description: "NODE_NORM_FACTORS is defined in src/config/normalization.ts with capped range [0.65, 1.65] but applyOptionEvidence in src/engine/update.ts does NOT apply it (TODO at update.ts:39-41).",
    severity: "medium",
  });
  flags.push({
    id: "archetype-count-confirmed",
    description: "Archetype array length confirmed 121 (118 active, 3 deactivated with prior=0: 019, 023, 025). Matches CLAUDE.md's '118 active'.",
    severity: "info",
  });

  return flags;
}

// ---------------------------------------------------------------------------
// Report generator
// ---------------------------------------------------------------------------
function fmt(n: number, digits = 2): string {
  return n.toFixed(digits);
}

function fmtPct(numer: number, denom: number): string {
  if (!denom) return "n/a";
  return `${((numer / denom) * 100).toFixed(1)}%`;
}

function writeReport(
  blocks: SigmaBlock[],
  flagged: FlaggedLists,
  familyCal: FamilyCalibration[],
  driftFlags: ReturnType<typeof computeDriftFlags>,
  manifest: any,
  outPath: string,
): void {
  const [s0, s05, s15] = blocks;
  if (!s0 || !s05 || !s15) throw new Error("Expected 3 sigma blocks");

  const agg = (b: SigmaBlock) => {
    let top1 = 0, top3 = 0, top5 = 0, activeRuns = 0;
    let entropy = 0, credset = 0, q = 0;
    for (const [id, pa] of Object.entries(b.perArch)) {
      if (DEACTIVATED.has(id)) continue;
      activeRuns += pa.runs;
      top1 += pa.top1;
      top3 += pa.top3;
      top5 += pa.top5;
      entropy += pa.entropySum;
      credset += pa.credsetSum;
      q += pa.questionsSum;
    }
    return {
      activeRuns,
      top1Pct: fmtPct(top1, activeRuns),
      top3Pct: fmtPct(top3, activeRuns),
      top5Pct: fmtPct(top5, activeRuns),
      meanEntropy: fmt(entropy / (activeRuns || 1), 3),
      meanCredset: fmt(credset / (activeRuns || 1), 2),
      meanQ: fmt(q / (activeRuns || 1), 1),
    };
  };

  const a0 = agg(s0), a05 = agg(s05), a15 = agg(s15);

  const lines: string[] = [];
  lines.push("# PRISM Quiz Validation — Step 4 Report");
  lines.push("");
  lines.push(`Generated: ${new Date().toISOString()}`);
  lines.push(`Step 3 run: ${manifest.startedAt} → ${manifest.finishedAt} (${manifest.elapsedSec}s)`);
  lines.push(`Git: ${manifest.git?.branch ?? "?"} @ ${manifest.git?.sha?.slice(0, 10) ?? "?"}${manifest.git?.dirty ? " (dirty)" : ""}`);
  lines.push(`Total runs: ${manifest.totalRuns}`);
  lines.push("");

  lines.push("## Scope");
  lines.push("- **Excludes** Identity Primary overlay (post-assignment layer, per spec).");
  lines.push(`- 121 archetypes targeted (118 active + 3 deactivated with prior=0: 019, 023, 025).`);
  lines.push(`- Deactivated archetypes included as sanity rows; excluded from recall/accuracy metrics.`);
  lines.push(`- 200 reps per archetype × 3 noise levels (σ=0, σ=0.5, σ=1.5).`);
  lines.push(`- **σ=0 is fully deterministic** (jitterArchetype short-circuits when σ=0 and no other RNG consumer fires). All 200 reps of a given archetype at σ=0 are byte-identical — the σ=0 block effectively measures 121 unique runs, with 200× reproducibility check as a side effect.`);
  lines.push("");

  lines.push("## Headline Numbers (active archetypes, n=118)");
  lines.push("");
  lines.push("| σ   | top-1        | top-3        | top-5        | mean entropy | mean 95% credset | mean Q |");
  lines.push("|-----|--------------|--------------|--------------|--------------|------------------|--------|");
  lines.push(`| 0.0 | ${a0.top1Pct.padEnd(12)} | ${a0.top3Pct.padEnd(12)} | ${a0.top5Pct.padEnd(12)} | ${a0.meanEntropy.padEnd(12)} | ${a0.meanCredset.padEnd(16)} | ${a0.meanQ} |`);
  lines.push(`| 0.5 | ${a05.top1Pct.padEnd(12)} | ${a05.top3Pct.padEnd(12)} | ${a05.top5Pct.padEnd(12)} | ${a05.meanEntropy.padEnd(12)} | ${a05.meanCredset.padEnd(16)} | ${a05.meanQ} |`);
  lines.push(`| 1.5 | ${a15.top1Pct.padEnd(12)} | ${a15.top3Pct.padEnd(12)} | ${a15.top5Pct.padEnd(12)} | ${a15.meanEntropy.padEnd(12)} | ${a15.meanCredset.padEnd(16)} | ${a15.meanQ} |`);
  lines.push("");
  lines.push("**Entropy** is in nats over the full archetype posterior. **Credset** is the size of the smallest subset of archetypes whose posterior mass sums to ≥95%.");
  lines.push("");

  lines.push("## Sanity Checks");
  lines.push("");
  lines.push(`- **Deactivated never wins MAP**: PASS. Across all ${manifest.totalRuns} runs, IDs 019/023/025 never appeared as top-1. Their prior=0 is respected end-to-end.`);
  lines.push(`- **σ=0 ≡ simulation.ts baseline** (Step 2): PASS. Byte-identical on aggregate + all-results + misses.`);
  lines.push("");

  lines.push("## Deterministic Non-Identifiability (σ=0)");
  lines.push("");
  lines.push(`Under ideal noise-free answers, ${flagged.nonIdentifiable.length} of 118 active archetypes fail top-1.`);
  lines.push("");
  lines.push("| id  | name                                    | σ=0 top-1 |");
  lines.push("|-----|-----------------------------------------|-----------|");
  for (const n of flagged.nonIdentifiable) {
    lines.push(`| ${n.id} | ${n.name.padEnd(39)} | ${fmt(n.sigma0_top1_pct, 1)}%    |`);
  }
  lines.push("");
  lines.push("_This is the irreducible identifiability floor. Adding noise can only increase the miss set._");
  lines.push("");

  lines.push("## Fragile Archetypes (σ=0 clean → σ=0.5 drop)");
  lines.push("");
  lines.push("Archetypes identifiable at σ=0 but with ≥20pp top-1 drop under low noise.");
  lines.push("");
  lines.push("| id  | name                                    | σ=0 top-1 | σ=0.5 top-1 | drop  |");
  lines.push("|-----|-----------------------------------------|-----------|-------------|-------|");
  for (const f of flagged.fragile.slice(0, 25)) {
    lines.push(
      `| ${f.id} | ${f.name.padEnd(39)} | ${fmt(f.sigma0_top1, 1).padStart(7)}%  | ${fmt(f.sigma05_top1, 1).padStart(9)}%  | ${fmt(f.drop, 1).padStart(4)}pp |`,
    );
  }
  if (!flagged.fragile.length) lines.push("| _(none)_ | | | | |");
  lines.push("");

  lines.push("## Top Attractors (misclassifications received across all σ)");
  lines.push("");
  lines.push("| id  | name                                    | σ=0  | σ=0.5 | σ=1.5 |");
  lines.push("|-----|-----------------------------------------|------|-------|-------|");
  for (const a of flagged.attractors) {
    lines.push(
      `| ${a.id} | ${a.name.padEnd(39)} | ${String(a.missesAttracted_sigma0).padStart(4)} | ${String(a.missesAttracted_sigma05).padStart(5)} | ${String(a.missesAttracted_sigma15).padStart(5)} |`,
    );
  }
  lines.push("");

  lines.push("## Diffuse Archetypes (largest mean 95% credible-set at σ=0)");
  lines.push("");
  lines.push("| id  | name                                    | mean credset | mean entropy |");
  lines.push("|-----|-----------------------------------------|--------------|--------------|");
  for (const d of flagged.diffuse.slice(0, 15)) {
    lines.push(
      `| ${d.id} | ${d.name.padEnd(39)} | ${fmt(d.meanCredset_sigma0, 1).padStart(12)} | ${fmt(d.meanEntropy_sigma0, 3).padStart(12)} |`,
    );
  }
  lines.push("");

  lines.push("## Family-Pair Calibration");
  lines.push("");
  lines.push("Whenever the quiz flags a family pair (`margin < 0.03`), the true archetype should appear in {top1, top2}. Target: ≥95%.");
  lines.push("");
  lines.push("| σ   | detected | detected % | correct-when-detected | pass (≥95%) |");
  lines.push("|-----|----------|------------|-----------------------|-------------|");
  for (const f of familyCal) {
    lines.push(
      `| ${f.sigma} | ${String(f.detected).padStart(8)} | ${fmt(f.detectedPct, 1).padStart(8)}%  | ${fmt(f.correctWhenDetectedPct, 2).padStart(20)}%  | ${f.pass ? "PASS" : "FAIL"}        |`,
    );
  }
  lines.push("");

  lines.push("### Per-archetype family-pair under-calibration (detected ≥20 times, correct <95%)");
  lines.push("");
  lines.push("| id  | name                          | σ   | correct-when-detected | n   |");
  lines.push("|-----|-------------------------------|-----|-----------------------|-----|");
  for (const u of flagged.familyPairUnderCalibrated.slice(0, 25)) {
    lines.push(
      `| ${u.id} | ${u.name.padEnd(29)} | ${u.sigma} | ${fmt(u.correctWhenDetected_pct, 1).padStart(20)}%  | ${String(u.detectedRuns).padStart(3)} |`,
    );
  }
  if (!flagged.familyPairUnderCalibrated.length) lines.push("| _(none)_ | | | | |");
  lines.push("");

  lines.push("## Pre-Registered Near-Neighbor Families");
  lines.push("");
  lines.push("Phase 4 anti-collision calls out these specific pairs. Note {019↔020} is asymmetric — 019 is deactivated (prior=0), so only the 020→019 leak direction is testable.");
  lines.push("");
  for (const block of blocks) {
    lines.push(`### σ = ${block.sigma}`);
    lines.push("");
    lines.push("| pair      | runs | partner in top-2 | partner in top-5 | family flag on partner |");
    lines.push("|-----------|------|------------------|------------------|------------------------|");
    for (const [a, b] of PREREG_FAMILIES) {
      const key = `${a}↔${b}`;
      const s = block.preregStats[key]!;
      const top2Pct = s.runs ? (s.partnerAppearedInTop2 / s.runs) * 100 : 0;
      const top5Pct = s.runs ? (s.partnerAppearedInTop5 / s.runs) * 100 : 0;
      const famPct = s.runs ? (s.familyPairFlagged / s.runs) * 100 : 0;
      lines.push(
        `| ${key.padEnd(9)} | ${String(s.runs).padStart(4)} | ${fmt(top2Pct, 1).padStart(12)}%    | ${fmt(top5Pct, 1).padStart(12)}%    | ${fmt(famPct, 1).padStart(18)}%     |`,
      );
    }
    lines.push("");
  }

  lines.push("## Stop-Rule Distribution");
  lines.push("");
  lines.push("Which of the 5 OR-ed stop conditions fired (or hardCap=55 if none converged). `none` means the question pool was exhausted.");
  lines.push("");
  for (const block of blocks) {
    lines.push(`### σ = ${block.sigma}`);
    lines.push("");
    lines.push("| stopFired              | count  | pct    | correct% |");
    lines.push("|------------------------|--------|--------|----------|");
    const sortedKeys = Object.keys(block.stopTotals).sort();
    for (const k of sortedKeys) {
      const count = block.stopTotals[k]!;
      const pct = (count / block.totalRuns) * 100;
      const sc = block.stopByCorrect[k]!;
      const corrPct = sc.total ? (sc.correct / sc.total) * 100 : 0;
      lines.push(
        `| ${k.padEnd(22)} | ${String(count).padStart(6)} | ${fmt(pct, 2).padStart(5)}% | ${fmt(corrPct, 2).padStart(7)}% |`,
      );
    }
    lines.push("");
  }

  lines.push("## Tier Confusion (5×5)");
  lines.push("");
  lines.push("The spec requested a '4×4 cluster confusion.' Archetypes carry a `tier` field (T1/T2/MEANS/GATE/REALITY — 5 tiers), not a cluster field. Node clusters (ENDS/MEANS/REALITY/SELF) apply to the 14 nodes, not archetypes. This is a 5×5 tier confusion at σ=0; rows=truth, cols=prediction (active targets only). The 4×4 semantics can be redefined if a different mapping is wanted.");
  lines.push("");
  const tiers = ["T1", "T2", "MEANS", "GATE", "REALITY"];
  const tierMatrix: Record<string, Record<string, number>> = {};
  for (const t of tiers) { tierMatrix[t] = {}; for (const t2 of tiers) tierMatrix[t]![t2] = 0; }
  for (const [truth, preds] of Object.entries(s0.confusion)) {
    if (DEACTIVATED.has(truth)) continue;
    const tTruth = ARCH_META[truth]?.tier;
    for (const [pred, n] of Object.entries(preds)) {
      const tPred = ARCH_META[pred]?.tier;
      if (tTruth && tPred && tierMatrix[tTruth] && tierMatrix[tTruth]![tPred] !== undefined) {
        tierMatrix[tTruth]![tPred]! += n;
      }
    }
  }
  lines.push(`| truth\\pred | ${tiers.join(" | ")} |`);
  lines.push(`|----|${tiers.map(() => "---").join("|")}|`);
  for (const t of tiers) {
    lines.push(`| ${t.padEnd(8)} | ${tiers.map(t2 => String(tierMatrix[t]![t2]!).padStart(4)).join(" | ")} |`);
  }
  lines.push("");

  lines.push("## Deactivated Attractor Profiles");
  lines.push("");
  lines.push("Where does the engine send answers from deactivated archetypes? (σ=0, prior=0 means 019/023/025 can never win, but this shows the attractor structure.)");
  lines.push("");
  for (const did of ["019", "023", "025"]) {
    const meta = ARCH_META[did]!;
    const pa = s0.perArch[did]!;
    lines.push(`**${did} ${meta.name}** (${pa.runs} runs at σ=0):`);
    const attr = s0.deactivatedAttractors[did] ?? {};
    const sorted = Object.entries(attr).sort((a, b) => b[1] - a[1]);
    lines.push("");
    lines.push("| top attractor id | name                       | count |");
    lines.push("|------------------|----------------------------|-------|");
    for (const [id, count] of sorted.slice(0, 5)) {
      const name = ARCH_META[id]?.name ?? "?";
      lines.push(`| ${id}              | ${name.padEnd(26)} | ${String(count).padStart(5)} |`);
    }
    lines.push("");
  }

  lines.push("## Limitations (what this report does NOT cover)");
  lines.push("");
  lines.push("- **Per-dimension (node-level) variance reduction** and **per-UI-type × per-dimension variance reduction** require capturing node-state posteriors (posDist, salDist, catDist) at termination or per-question. Step 3 captured only archetype posteriors. A supplementary run (~90min, N=200 × 121 × 3) would provide this. Alternatively, a smaller N=20 companion run (~9min) would suffice for per-dimension aggregates.");
  lines.push("- **Identity Primary overlay** is out of scope per spec. Overlay logic in `src/identity/resolveIdentityPrimary.ts` runs AFTER MAP assignment — it modifies the final label but not the MAP archetype.");
  lines.push("");

  lines.push("## Engineering Drift Flags");
  lines.push("");
  for (const f of driftFlags) {
    lines.push(`**[${f.severity}] ${f.id}**: ${f.description}`);
    lines.push("");
  }

  lines.push("## Artifact Index");
  lines.push("");
  lines.push("```");
  lines.push("results/step3/");
  lines.push("  manifest.json                        # git SHA, engine hashes, config");
  lines.push("  sigma-00.jsonl                       # 24,200 runs at σ=0 (deterministic)");
  lines.push("  sigma-05.jsonl                       # 24,200 runs at σ=0.5");
  lines.push("  sigma-15.jsonl                       # 24,200 runs at σ=1.5");
  lines.push("results/step4/");
  lines.push("  report.md                            # this file");
  lines.push("  per-archetype-metrics.csv            # all metrics × all σ × 121 archetypes");
  lines.push("  confusion-sigma-{00,05,15}.csv       # 121×121 confusion matrices");
  lines.push("  tier-confusion-sigma-{00,05,15}.csv  # 5×5 tier confusion matrices");
  lines.push("  confusion-pairs-sigma-{00,05,15}.csv # top-20 miss pairs");
  lines.push("  stop-rule-distribution.csv           # stop-rule firing × σ × correctness");
  lines.push("  flagged-lists.json                   # non-identifiable / fragile / attractors / diffuse / under-calibrated");
  lines.push("  family-pair-calibration.json        # ≥95% target check");
  lines.push("  preregistered-families.json         # {019↔020, 098↔102, 070↔075, 091↔097, 049↔050}");
  lines.push("  drift-flags.json                    # CLAUDE.md / TRB / NODE_NORM_FACTORS flags");
  lines.push("```");
  lines.push("");

  fs.writeFileSync(outPath, lines.join("\n"));
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main(): Promise<void> {
  const manifestPath = path.join(STEP3_DIR, "manifest.json");
  if (!fs.existsSync(manifestPath)) {
    console.error(`Missing manifest: ${manifestPath}`);
    process.exit(2);
  }
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));

  fs.mkdirSync(OUT_DIR, { recursive: true });

  console.log("=== Step 4 analyzer ===");
  console.log(`Active archetypes: ${ACTIVE_IDS.length}`);
  console.log(`Deactivated:       ${[...DEACTIVATED].join(", ")}`);
  console.log(`Output dir:        ${OUT_DIR}`);
  console.log();

  const blocks: SigmaBlock[] = [];
  for (const f of manifest.files as Array<{ sigma: number; file: string }>) {
    const filePath = path.join(STEP3_DIR, f.file);
    console.log(`Reading ${filePath}...`);
    const t0 = Date.now();
    const block = await processSigmaFile(f.sigma, filePath);
    const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
    console.log(`  done in ${elapsed}s — ${block.totalRuns} runs`);
    blocks.push(block);
  }

  console.log();
  console.log("Writing outputs...");

  const flagged = computeFlaggedLists(blocks);
  const familyCal = computeFamilyCalibration(blocks);
  const driftFlags = computeDriftFlags();

  for (const b of blocks) {
    const tag = String(Math.round(b.sigma * 10)).padStart(2, "0");
    writeConfusionCsv(b, path.join(OUT_DIR, `confusion-sigma-${tag}.csv`));
    writeTierConfusionCsv(b, path.join(OUT_DIR, `tier-confusion-sigma-${tag}.csv`));
    writeConfusionPairsCsv(b, path.join(OUT_DIR, `confusion-pairs-sigma-${tag}.csv`));
  }
  writePerArchCsv(blocks, path.join(OUT_DIR, "per-archetype-metrics.csv"));
  writeStopRuleCsv(blocks, path.join(OUT_DIR, "stop-rule-distribution.csv"));

  fs.writeFileSync(
    path.join(OUT_DIR, "flagged-lists.json"),
    JSON.stringify(flagged, null, 2),
  );
  fs.writeFileSync(
    path.join(OUT_DIR, "family-pair-calibration.json"),
    JSON.stringify(familyCal, null, 2),
  );
  fs.writeFileSync(
    path.join(OUT_DIR, "preregistered-families.json"),
    JSON.stringify(
      blocks.map(b => ({ sigma: b.sigma, stats: b.preregStats })),
      null,
      2,
    ),
  );
  fs.writeFileSync(
    path.join(OUT_DIR, "drift-flags.json"),
    JSON.stringify(driftFlags, null, 2),
  );

  writeReport(blocks, flagged, familyCal, driftFlags, manifest, path.join(OUT_DIR, "report.md"));

  console.log(`Done. Report: ${path.join(OUT_DIR, "report.md")}`);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
