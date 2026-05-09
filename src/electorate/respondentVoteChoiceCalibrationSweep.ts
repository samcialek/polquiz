/**
 * Calibration sweep — refit `respondentVoteChoice` distance constants
 * against CCES validated voters now that the input signal is calibrated
 * (Phase B' turnout, Phase E boundaries, Phase B'' engagement de-leak,
 * ADR-007 Stage F moralCircleDistance all shipped).
 *
 * Method: grid-sweep three load-bearing constants by spawning
 * `multiCycleBacktest.ts` as subprocesses with env-var overrides
 * (`PRISM_SALIENCE_POWER`, `PRISM_PARTY_LOYALTY_BASE`,
 * `PRISM_CATEGORICAL_BASE_SALIENCE`). Read the resulting JSON, aggregate
 * per-cycle gaps, write a calibration audit. Subprocess approach is the
 * cleanest cross-platform way to vary module-load-time constants.
 *
 * Honest expectation: no single constant tuning will close the full
 * residual gap. The systematic D-over-prediction comes from at least
 * three distinct sources (centroid bias on issue positions, partyID
 * D-skew amplification, missing direct universalAffinity). The sweep
 * surfaces what each constant *can* close in isolation, picks the best
 * config, and documents what's left.
 *
 * Decision criterion: ship a constant change if it improves ≥3 of 5
 * cycles AND average abs-mean gap drops by ≥0.5pp AND no cycle worsens
 * by >1.5pp. Otherwise document as "current values well-calibrated".
 *
 * Usage: npx tsx src/electorate/respondentVoteChoiceCalibrationSweep.ts
 *
 * Outputs:
 *   results/electorate/backtest/respondent-vote-choice-calibration.json
 *   results/electorate/backtest/respondent-vote-choice-calibration.md
 */

import { spawnSync } from "node:child_process";
import * as fs from "node:fs";
import * as path from "node:path";

const RESULT_JSON_PATH = "results/electorate/backtest/multi-cycle-backtest.json";
const OUT_DIR = "results/electorate/backtest";
const OUT_JSON = path.join(OUT_DIR, "respondent-vote-choice-calibration.json");
const OUT_MD = path.join(OUT_DIR, "respondent-vote-choice-calibration.md");

interface SweepConfig {
  salPower: number;
  partyLoyalty: number;
  catBase: number;
}

// Round 2 — extended grid (2026-05-09). The first sweep capped PARTY_LOYALTY
// at 1.0 and that value won at the edge of the grid; extending up to 3.0 to
// find the true optimum. CATEGORICAL_BASE_SALIENCE didn't move things last
// round so it's pinned at 0.6 to halve the search. Optimization target also
// switched from sharesOfVoters.absMean to fourWayElectorateTVDistance per
// the dashboard reframe — this is the honest metric (abstain in the
// denominator).
//
// Grid: 3 × 6 × 1 = 18 configs. ~35s per run × 18 = ~10 minutes wallclock.
const GRID: SweepConfig[] = [];
for (const salPower of [1.3, 1.5, 1.8]) {
  for (const partyLoyalty of [1.0, 1.3, 1.6, 2.0, 2.5, 3.0]) {
    for (const catBase of [0.6]) {
      GRID.push({ salPower, partyLoyalty, catBase });
    }
  }
}

interface CycleResult {
  year: number;
  predD: number;
  actualD: number;
  predR: number;
  actualR: number;
  votersGap: number;            // 3-way shares-of-voters absMean (legacy metric)
  fourWayTV: number;             // 4-way share-of-electorate TV distance (honest metric)
  predAbstain: number;
  actualAbstain: number;
  pluralityMatch: boolean;
}

interface ConfigResult {
  config: SweepConfig;
  cycles: CycleResult[];
  avgVotersGap: number;          // legacy aggregate
  avgFourWayTV: number;          // optimization target
  worstFourWayTV: number;
  winnersCorrect: number;
  pluralityHits: number;          // 4-way plurality match count
}

function runConfig(cfg: SweepConfig): ConfigResult {
  const env: Record<string, string> = {
    ...process.env as Record<string, string>,
    PRISM_SALIENCE_POWER: String(cfg.salPower),
    PRISM_PARTY_LOYALTY_BASE: String(cfg.partyLoyalty),
    PRISM_CATEGORICAL_BASE_SALIENCE: String(cfg.catBase),
  };
  const r = spawnSync("npx", ["tsx", "src/electorate/multiCycleBacktest.ts"], {
    env,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    shell: process.platform === "win32",
  });
  if (r.status !== 0) {
    throw new Error(`config ${JSON.stringify(cfg)} failed: ${r.stderr}`);
  }
  const data = JSON.parse(fs.readFileSync(RESULT_JSON_PATH, "utf8"));
  const cycles: CycleResult[] = data.cycles.map((c: any) => ({
    year: c.year,
    predD: c.predicted.sharesOfVoters.D,
    actualD: c.actual.sharesOfVoters.D,
    predR: c.predicted.sharesOfVoters.R,
    actualR: c.actual.sharesOfVoters.R,
    votersGap: c.gaps.sharesOfVoters.absMean,
    fourWayTV: c.gaps.fourWayElectorateTVDistance,
    predAbstain: c.predicted.sharesOfElectorate.Abstain,
    actualAbstain: c.actual.sharesOfElectorate.Abstain,
    pluralityMatch: c.pluralityMatch,
  }));
  const avgVotersGap = cycles.reduce((s, c) => s + c.votersGap, 0) / cycles.length;
  const avgFourWayTV = cycles.reduce((s, c) => s + c.fourWayTV, 0) / cycles.length;
  const worstFourWayTV = Math.max(...cycles.map(c => c.fourWayTV));
  const winnersCorrect = cycles.filter(c =>
    (c.predD > c.predR) === (c.actualD > c.actualR)
  ).length;
  const pluralityHits = cycles.filter(c => c.pluralityMatch).length;
  return { config: cfg, cycles, avgVotersGap, avgFourWayTV, worstFourWayTV, winnersCorrect, pluralityHits };
}

async function main() {
  const startedAt = new Date().toISOString();
  const results: ConfigResult[] = [];
  const totalT0 = Date.now();
  for (let i = 0; i < GRID.length; i++) {
    const cfg = GRID[i]!;
    const t0 = Date.now();
    process.stdout.write(`[${i + 1}/${GRID.length}] sal=${cfg.salPower} loyalty=${cfg.partyLoyalty} catBase=${cfg.catBase} ... `);
    const r = runConfig(cfg);
    process.stdout.write(`TV=${(r.avgFourWayTV * 100).toFixed(2)}pp worstTV=${(r.worstFourWayTV * 100).toFixed(2)}pp plur=${r.pluralityHits}/5 winners=${r.winnersCorrect}/5 (${((Date.now() - t0) / 1000).toFixed(0)}s)\n`);
    results.push(r);
  }
  const totalElapsed = Date.now() - totalT0;
  console.log(`\nTotal: ${(totalElapsed / 1000 / 60).toFixed(1)} min`);

  // Sort by avg 4-way TV distance (the honest metric).
  results.sort((a, b) => a.avgFourWayTV - b.avgFourWayTV);
  // Current defaults (post-Round-1 refit) are sal=1.5, loyalty=1.0, catBase=0.6.
  const baseline = results.find(r =>
    r.config.salPower === 1.5 && r.config.partyLoyalty === 1.00 && r.config.catBase === 0.60
  );
  const best = results[0]!;

  console.log(`\n=== TOP 5 CONFIGS BY 4-WAY TV DISTANCE ===`);
  for (const r of results.slice(0, 5)) {
    console.log(`  sal=${r.config.salPower} loyalty=${r.config.partyLoyalty} catBase=${r.config.catBase}: TV=${(r.avgFourWayTV*100).toFixed(2)}pp worstTV=${(r.worstFourWayTV*100).toFixed(2)}pp plurality=${r.pluralityHits}/5 winners=${r.winnersCorrect}/5`);
  }
  if (baseline) {
    console.log(`\nBASELINE (post-Round-1 defaults sal=1.5 loyalty=1.0): TV=${(baseline.avgFourWayTV*100).toFixed(2)}pp plurality=${baseline.pluralityHits}/5`);
  }
  console.log(`BEST CONFIG:                                          TV=${(best.avgFourWayTV*100).toFixed(2)}pp plurality=${best.pluralityHits}/5  Δ=${baseline ? ((best.avgFourWayTV - baseline.avgFourWayTV) * 100).toFixed(2) + "pp" : "n/a"}`);

  // Write JSON + MD.
  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(OUT_JSON, JSON.stringify({
    generated_at: startedAt,
    elapsed_ms: totalElapsed,
    grid_size: GRID.length,
    optimization_target: "fourWayElectorateTVDistance",
    baseline_config: { salPower: 1.5, partyLoyalty: 1.00, catBase: 0.60 },
    results,
  }, null, 2));

  const md: string[] = [];
  md.push("# `respondentVoteChoice` constant calibration sweep");
  md.push("");
  md.push(`Generated ${startedAt}; ${(totalElapsed / 1000 / 60).toFixed(1)} min wallclock; ${GRID.length} configs.`);
  md.push("");
  md.push(`**Optimization target:** average 4-way TV distance over {D, R, Other, Abstain} share-of-electorate.`);
  md.push("");
  if (baseline) {
    md.push(`**Baseline (post-Round-1 defaults):** sal=1.5 / loyalty=1.0 / catBase=0.6 → TV ${(baseline.avgFourWayTV * 100).toFixed(2)}pp, plurality ${baseline.pluralityHits}/5, winners ${baseline.winnersCorrect}/5`);
    md.push("");
  }
  md.push(`**Best config:** sal=${best.config.salPower} / loyalty=${best.config.partyLoyalty} / catBase=${best.config.catBase} → TV ${(best.avgFourWayTV * 100).toFixed(2)}pp, plurality ${best.pluralityHits}/5, winners ${best.winnersCorrect}/5 ${baseline ? `(Δ ${((best.avgFourWayTV - baseline.avgFourWayTV) * 100).toFixed(2)}pp TV)` : ""}`);
  md.push("");
  md.push("## All configs sorted by 4-way TV distance");
  md.push("");
  md.push("| sal | loyalty | catBase | 2008 | 2012 | 2016 | 2020 | 2024 | avg TV | worst | plurality | winners |");
  md.push("|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|");
  for (const r of results) {
    const cells = r.cycles.map(c => `${(c.fourWayTV*100).toFixed(1)}`).join(" | ");
    md.push(`| ${r.config.salPower} | ${r.config.partyLoyalty} | ${r.config.catBase} | ${cells} | **${(r.avgFourWayTV*100).toFixed(2)}** | ${(r.worstFourWayTV*100).toFixed(2)} | ${r.pluralityHits}/5 | ${r.winnersCorrect}/5 |`);
  }
  md.push("");
  md.push("## Per-cycle for the best config");
  md.push("");
  md.push("| Year | Pred D | Actual D | Pred R | Actual R | TV | Pred Abst | Actual Abst | Plurality |");
  md.push("|---|---:|---:|---:|---:|---:|---:|---:|:---|");
  for (const c of best.cycles) {
    md.push(`| ${c.year} | ${(c.predD*100).toFixed(1)}% | ${(c.actualD*100).toFixed(1)}% | ${(c.predR*100).toFixed(1)}% | ${(c.actualR*100).toFixed(1)}% | ${(c.fourWayTV*100).toFixed(2)}pp | ${(c.predAbstain*100).toFixed(1)}% | ${(c.actualAbstain*100).toFixed(1)}% | ${c.pluralityMatch ? "✓" : "✗"} |`);
  }
  md.push("");
  fs.writeFileSync(OUT_MD, md.join("\n"));
  console.log(`\nWrote ${OUT_JSON}\nWrote ${OUT_MD}`);
}

main().catch(err => { console.error(err); process.exit(1); });
