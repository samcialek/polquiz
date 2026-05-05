/**
 * Dev smoke for cces2BacktestRunner — runs 2020 first at 200 rows, then full.
 * Used to validate the bridge before scaling to all 5 cycles.
 */
import * as fs from "node:fs";
import { runCycleBacktest } from "./cces2BacktestRunner.js";

async function main() {
  const benchmarksPath = "results/electorate/backtest/benchmarks-2008-2024.json";
  const benchmarks = JSON.parse(fs.readFileSync(benchmarksPath, "utf8"));

  console.log("--- 2020 smoke (200 rows) ---");
  const t0 = Date.now();
  const small = await runCycleBacktest(2020, benchmarks, { rowLimit: 200 });
  console.log(`  rows=${small.rowsProcessed} elapsed=${Date.now() - t0}ms`);
  console.log(`  Predicted shares-of-voters: D=${(small.predicted.sharesOfVoters.D*100).toFixed(1)}% R=${(small.predicted.sharesOfVoters.R*100).toFixed(1)}% T+O=${((small.predicted.sharesOfVoters.T+small.predicted.sharesOfVoters.O)*100).toFixed(1)}%`);
  console.log(`  Predicted shares-of-electorate: D=${(small.predicted.sharesOfElectorate.D*100).toFixed(1)}% R=${(small.predicted.sharesOfElectorate.R*100).toFixed(1)}% Abst=${(small.predicted.sharesOfElectorate.Abstain*100).toFixed(1)}%`);
  console.log(`  Actual shares-of-voters:    D=${(small.actual.sharesOfVoters.D*100).toFixed(1)}% R=${(small.actual.sharesOfVoters.R*100).toFixed(1)}% Other=${(small.actual.sharesOfVoters.Other*100).toFixed(1)}%`);
  console.log(`  Gap voters: |avg|=${(small.gaps.sharesOfVoters.absMean*100).toFixed(2)}pp`);
  console.log(`  Top 5 archetypes: ${small.topArchetypes.slice(0,5).map(a => `${a.id}/${a.name}(${(a.share*100).toFixed(1)}%)`).join(", ")}`);

  if (process.argv.includes("--full")) {
    console.log("\n--- 2020 FULL ---");
    const t1 = Date.now();
    const full = await runCycleBacktest(2020, benchmarks, { rowLimit: null });
    console.log(`  rows=${full.rowsProcessed} elapsed=${Date.now() - t1}ms`);
    console.log(`  Predicted shares-of-voters: D=${(full.predicted.sharesOfVoters.D*100).toFixed(1)}% R=${(full.predicted.sharesOfVoters.R*100).toFixed(1)}% T+O=${((full.predicted.sharesOfVoters.T+full.predicted.sharesOfVoters.O)*100).toFixed(1)}%`);
    console.log(`  Actual shares-of-voters:    D=${(full.actual.sharesOfVoters.D*100).toFixed(1)}% R=${(full.actual.sharesOfVoters.R*100).toFixed(1)}% Other=${(full.actual.sharesOfVoters.Other*100).toFixed(1)}%`);
    console.log(`  Gap voters: |avg|=${(full.gaps.sharesOfVoters.absMean*100).toFixed(2)}pp`);
  }
}
main().catch(err => { console.error(err); process.exit(1); });
