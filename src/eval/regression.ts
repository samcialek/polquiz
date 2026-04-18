/**
 * Phase 3 regression baseline emitter.
 *
 * Runs simulateOne(noiseSigma=0, seed=0) over every archetype in array order
 * under the new Euclidean WTA scorer, aggregates into the canonical baseline
 * JSON shape, and writes it to results/phase3/scoring-baseline-phase3.json.
 *
 * The pre-Phase-3 byte-compare against scoring-baseline-fresh.json is dropped
 * because the scorer change makes that comparison meaningless. The Phase-2
 * baseline at results/phase3/scoring-baseline-pre-3b.json remains on disk for
 * historical reference.
 *
 * Usage:
 *   npx tsx src/eval/regression.ts
 */

import * as fs from "fs";
import * as path from "path";

import { ARCHETYPES } from "../config/archetypes.js";
import { REPRESENTATIVE_QUESTIONS } from "../config/questions.representative.js";
import { resetConfig } from "../optimize/runtimeConfig.js";

import { simulateOne, type SimRun } from "./harness.js";

interface BaselineMiss {
  archetypeId: string;
  archetypeName: string;
  gotId: string;
  gotName: string;
  rank: number;
}

interface BaselineAllResult {
  archetypeId: string;
  correct: boolean;
  rank: number;
  questionsAnswered: number;
}

interface BaselineJson {
  variant: string;
  total: number;
  top1: number;
  top3: number;
  top5: number;
  top1Pct: number;
  top3Pct: number;
  top5Pct: number;
  avgQuestions: number;
  misses: BaselineMiss[];
  allResults: BaselineAllResult[];
}

function buildJsonShape(runs: SimRun[]): BaselineJson {
  const total = runs.length;
  const top1 = runs.filter(r => r.rank === 1).length;
  const top3 = runs.filter(r => r.rank <= 3).length;
  const top5 = runs.filter(r => r.rank <= 5).length;
  const totalQuestions = runs.reduce((s, r) => s + r.questionsAnswered, 0);
  const misses: BaselineMiss[] = runs
    .filter(r => !r.correct)
    .map(r => ({
      archetypeId: r.archetypeId,
      archetypeName: r.archetypeName,
      gotId: r.resultId,
      gotName: r.resultName,
      rank: r.rank,
    }));
  return {
    variant: "baseline",
    total,
    top1,
    top3,
    top5,
    top1Pct: +(top1 / total * 100).toFixed(1),
    top3Pct: +(top3 / total * 100).toFixed(1),
    top5Pct: +(top5 / total * 100).toFixed(1),
    avgQuestions: +(totalQuestions / total).toFixed(1),
    misses,
    allResults: runs.map(r => ({
      archetypeId: r.archetypeId,
      correct: r.correct,
      rank: r.rank,
      questionsAnswered: r.questionsAnswered,
    })),
  };
}

function main(): void {
  resetConfig();
  const archetypes = ARCHETYPES;
  const questions = REPRESENTATIVE_QUESTIONS;

  console.log("=== Phase 3 baseline: Euclidean WTA scorer ===");
  console.log(`Archetypes: ${archetypes.length}`);
  console.log(`Questions:  ${questions.length}`);
  console.log(`Mode:       noiseSigma=0, seed=0 (deterministic)`);
  console.log();

  const t0 = Date.now();
  const runs: SimRun[] = [];
  for (let i = 0; i < archetypes.length; i++) {
    const target = archetypes[i]!;
    const run = simulateOne(target, archetypes, questions, {
      noiseSigma: 0,
      seed: 0,
      maxQuestions: 65,
      captureDistances: false,
    });
    runs.push(run);
    const status = run.correct ? "OK" : `MISS(rank=${run.rank})`;
    console.log(
      `[${i + 1}/${archetypes.length}] ${target.id} ${target.name.padEnd(35)} ${status}`
    );
  }
  const elapsedSec = ((Date.now() - t0) / 1000).toFixed(1);
  console.log(`\nFinished in ${elapsedSec}s`);

  const actual = buildJsonShape(runs);

  const outDir = path.join(process.cwd(), "results", "phase3");
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, "scoring-baseline-phase3.json");
  fs.writeFileSync(outPath, JSON.stringify(actual, null, 2));

  console.log();
  console.log("=== Aggregate ===");
  console.log(`  total      ${actual.total}`);
  console.log(`  top1       ${actual.top1} (${actual.top1Pct}%)`);
  console.log(`  top3       ${actual.top3} (${actual.top3Pct}%)`);
  console.log(`  top5       ${actual.top5} (${actual.top5Pct}%)`);
  console.log(`  avgQ       ${actual.avgQuestions}`);
  console.log(`  misses.len ${actual.misses.length}`);
  console.log(`\nBaseline written to ${outPath}`);
}

main();
