/**
 * Phase 2 — multi-cycle sweep. Loops the per-cycle backtest runner across
 * 2008/2012/2016/2020/2024 and writes a single master JSON that the
 * dashboard renderer consumes.
 *
 * Usage:
 *   npx tsx src/electorate/multiCycleBacktest.ts
 *
 * Output:
 *   results/electorate/backtest/multi-cycle-backtest.json
 */

import * as fs from "node:fs";
import * as path from "node:path";
import { runCycleBacktest, type CycleBacktestResult } from "./cces2BacktestRunner.js";

const YEARS = [2008, 2012, 2016, 2020, 2024];
const BENCHMARKS_PATH = "results/electorate/backtest/benchmarks-2008-2024.json";
const OUT_DIR = "results/electorate/backtest";
const OUT_JSON = path.join(OUT_DIR, "multi-cycle-backtest.json");

async function main() {
  const benchmarks = JSON.parse(fs.readFileSync(BENCHMARKS_PATH, "utf8"));
  const startedAt = new Date().toISOString();

  const cycles: CycleBacktestResult[] = [];
  const totalT0 = Date.now();
  for (const year of YEARS) {
    const t0 = Date.now();
    process.stdout.write(`${year}: loading + mapping + predicting ... `);
    const result = await runCycleBacktest(year, benchmarks, { rowLimit: null });
    const elapsed = Date.now() - t0;
    cycles.push(result);
    const v = result.predicted.sharesOfVoters;
    const a = result.actual.sharesOfVoters;
    process.stdout.write(`done in ${(elapsed/1000).toFixed(1)}s. n=${result.rowsProcessed}, pred D/R=${(v.D*100).toFixed(1)}/${(v.R*100).toFixed(1)} vs actual D/R=${(a.D*100).toFixed(1)}/${(a.R*100).toFixed(1)} (|gap|=${(result.gaps.sharesOfVoters.absMean*100).toFixed(2)}pp)\n`);
  }
  const totalElapsed = Date.now() - totalT0;

  const out = {
    schema_version: "v0.1",
    generated_at: startedAt,
    elapsed_ms: totalElapsed,
    pipeline: "cesBacktestLoader → surveyToPrismMapper (point estimate) → predictVote → weighted aggregate",
    decisions: {
      signature_representation: "posterior point estimate (E[posDist], E[salDist])",
      vote_denominator: "both shares-of-voters and shares-of-electorate reported",
      partyID_passed_to_predictor: false,
      anchorDist_passed_to_predictor: false,
    },
    cycles,
  };

  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(OUT_JSON, JSON.stringify(out, null, 2));
  console.log(`\nWrote ${OUT_JSON} (${(totalElapsed/1000).toFixed(1)}s total)`);
}

main().catch(err => { console.error(err); process.exit(1); });
