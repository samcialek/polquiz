/**
 * Family-pair detection audit — post-ADR-003 rollback.
 *
 * For every archetype target, runs simulateOne with captureDistances=true,
 * extracts the top-2 archetypes under the restored scalar scorer, and asks:
 * is the runner-up in the leader's signature-distance family set?
 *
 * Reports:
 *   - Firing rate: how often top-2 is in the leader's family
 *   - Sample of 10 firings: verify each pairing makes sense
 *   - Contrast with old broken margin-based detection (gap < 0.03 posterior),
 *     which this replaces. The old mechanism measured posterior margin; under
 *     the restored scalar scorer (no posterior exposed to api.ts), we have no
 *     direct port of that mechanism — the new signature-distance detector is
 *     the sole production path.
 */
import * as fs from "fs";
import * as path from "path";

import { ARCHETYPES } from "../config/archetypes.js";
import { REPRESENTATIVE_QUESTIONS } from "../config/questions.representative.js";
import { resetConfig } from "../optimize/runtimeConfig.js";
import { buildArchetypeFamilies } from "../engine/archetypeFamilies.js";

import { simulateOne } from "./harness.js";

interface AuditRow {
  targetId: string;
  targetName: string;
  leaderId: string;
  leaderName: string;
  runnerUpId: string;
  runnerUpName: string;
  leaderDistance: number;
  runnerUpDistance: number;
  gapRatio: number;
  runnerUpInLeaderFamily: boolean;
  targetCorrect: boolean;
}

function main(): void {
  resetConfig();
  const archetypes = ARCHETYPES;
  const questions = REPRESENTATIVE_QUESTIONS;
  const familyIndex = buildArchetypeFamilies(archetypes);

  const nameById = new Map(archetypes.map(a => [a.id, a.name]));

  console.log("=== Family-pair detection audit (post-rollback) ===");
  console.log(`Archetypes: ${archetypes.length}`);
  console.log(`Family threshold (10th pct of pairwise sig-distance): ${familyIndex.threshold.toFixed(4)}`);
  console.log();

  const rows: AuditRow[] = [];
  for (let i = 0; i < archetypes.length; i++) {
    const target = archetypes[i]!;
    const run = simulateOne(target, archetypes, questions, {
      noiseSigma: 0,
      seed: 0,
      maxQuestions: 65,
      captureDistances: true,
    });
    const dists = run.distancesFinal;
    if (!dists) continue;
    const sorted = Object.entries(dists)
      .filter(([, d]) => Number.isFinite(d))
      .sort((a, b) => (a[1] as number) - (b[1] as number));
    if (sorted.length < 2) continue;
    const [leaderId, leaderDistance] = sorted[0]!;
    const [runnerUpId, runnerUpDistance] = sorted[1]!;
    const gapRatio = (leaderDistance as number) > 0
      ? ((runnerUpDistance as number) - (leaderDistance as number)) / (leaderDistance as number)
      : 0;
    const leaderFamily = familyIndex.familyOf[leaderId];
    const inFamily = !!(leaderFamily && leaderFamily.has(runnerUpId));

    rows.push({
      targetId: target.id,
      targetName: target.name,
      leaderId,
      leaderName: nameById.get(leaderId) ?? "?",
      runnerUpId,
      runnerUpName: nameById.get(runnerUpId) ?? "?",
      leaderDistance: leaderDistance as number,
      runnerUpDistance: runnerUpDistance as number,
      gapRatio,
      runnerUpInLeaderFamily: inFamily,
      targetCorrect: run.correct,
    });
  }

  const nFire = rows.filter(r => r.runnerUpInLeaderFamily).length;
  const nTotal = rows.length;
  const nCorrect = rows.filter(r => r.targetCorrect).length;
  const nFireWhenCorrect = rows.filter(r => r.runnerUpInLeaderFamily && r.targetCorrect).length;
  const nFireWhenIncorrect = rows.filter(r => r.runnerUpInLeaderFamily && !r.targetCorrect).length;

  console.log("=== Aggregate ===");
  console.log(`  runs evaluated:                     ${nTotal}`);
  console.log(`  top-1 correct:                      ${nCorrect} (${(100 * nCorrect / nTotal).toFixed(1)}%)`);
  console.log(`  family fires (runner-up ∈ family):  ${nFire} (${(100 * nFire / nTotal).toFixed(1)}%)`);
  console.log(`    ... when top-1 correct:           ${nFireWhenCorrect}`);
  console.log(`    ... when top-1 incorrect:         ${nFireWhenIncorrect}`);
  console.log();

  const sample = rows.filter(r => r.runnerUpInLeaderFamily).slice(0, 10);
  console.log("=== First 10 family firings — verify sig-distance membership ===");
  for (const r of sample) {
    const tag = r.targetCorrect ? "CORRECT" : "MISS";
    console.log(`  target=${r.targetId} ${r.targetName}`);
    console.log(`    → leader=${r.leaderId} ${r.leaderName} [${tag}]`);
    console.log(`    → runner-up=${r.runnerUpId} ${r.runnerUpName} [in family: yes]`);
    console.log(`       dLeader=${r.leaderDistance.toFixed(4)}, dRunnerUp=${r.runnerUpDistance.toFixed(4)}, gap_ratio=${r.gapRatio.toFixed(3)}`);
    console.log(`       pairwise sig-distance: ${familyIndex.pairwise[r.leaderId]?.[r.runnerUpId]?.toFixed(4) ?? "?"}  (threshold ${familyIndex.threshold.toFixed(4)})`);
  }
  console.log();

  const outPath = path.join(process.cwd(), "results", "phase3", "family-audit-post-rollback.json");
  fs.writeFileSync(outPath, JSON.stringify({
    threshold: familyIndex.threshold,
    runs: rows,
    summary: {
      total: nTotal,
      correct: nCorrect,
      firings: nFire,
      firingsWhenCorrect: nFireWhenCorrect,
      firingsWhenIncorrect: nFireWhenIncorrect,
    },
  }, null, 2));
  console.log(`Wrote ${outPath}`);
}

main();
