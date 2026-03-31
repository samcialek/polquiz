import * as fs from "fs";
import * as path from "path";

const outputDir = path.join(process.cwd(), "output");
const baseline = JSON.parse(fs.readFileSync(path.join(outputDir, "scoring-baseline.json"), "utf8"));
const v1 = JSON.parse(fs.readFileSync(path.join(outputDir, "scoring-v1.json"), "utf8"));
const v2 = JSON.parse(fs.readFileSync(path.join(outputDir, "scoring-v2.json"), "utf8"));

const baselineMisses = new Set(baseline.misses.map((m: any) => m.archetypeId));
const v1Misses = new Set(v1.misses.map((m: any) => m.archetypeId));
const v2Misses = new Set(v2.misses.map((m: any) => m.archetypeId));

const allMissIds = [...new Set([...baselineMisses, ...v1Misses, ...v2Misses])].sort();

const comparison = {
  summary: {
    baseline: { top1: baseline.top1Pct, top3: baseline.top3Pct, top5: baseline.top5Pct, avgQ: baseline.avgQuestions },
    v1: { top1: v1.top1Pct, top3: v1.top3Pct, top5: v1.top5Pct, avgQ: v1.avgQuestions },
    v2: { top1: v2.top1Pct, top3: v2.top3Pct, top5: v2.top5Pct, avgQ: v2.avgQuestions },
  },
  baselineMissesFixedByV1: [...baselineMisses].filter(id => !v1Misses.has(id)),
  baselineMissesFixedByV2: [...baselineMisses].filter(id => !v2Misses.has(id)),
  newMissesInV1: [...v1Misses].filter(id => !baselineMisses.has(id)),
  newMissesInV2: [...v2Misses].filter(id => !baselineMisses.has(id)),
  perMissTable: allMissIds.map((id: any) => {
    const bRank = baseline.allResults.find((r: any) => r.archetypeId === id)?.rank;
    const v1Rank = v1.allResults.find((r: any) => r.archetypeId === id)?.rank;
    const v2Rank = v2.allResults.find((r: any) => r.archetypeId === id)?.rank;
    const miss = baseline.misses.find((m: any) => m.archetypeId === id)
      || v1.misses.find((m: any) => m.archetypeId === id)
      || v2.misses.find((m: any) => m.archetypeId === id);
    return { id, name: miss?.archetypeName, baselineRank: bRank, v1Rank, v2Rank };
  }),
};

fs.writeFileSync(path.join(outputDir, "scoring-experiment-results.json"), JSON.stringify(comparison, null, 2));

// Print formatted summary
console.log("\n╔══════════════════════════════════════════════════════════════╗");
console.log("║           SCORING EXPERIMENT — COMPARISON SUMMARY           ║");
console.log("╚══════════════════════════════════════════════════════════════╝\n");

console.log("┌─────────────┬─────────┬─────────┬─────────┬────────┐");
console.log("│  Variant    │  Top-1  │  Top-3  │  Top-5  │ Avg Q  │");
console.log("├─────────────┼─────────┼─────────┼─────────┼────────┤");
console.log(`│  Baseline   │ ${String(baseline.top1Pct + "%").padStart(6)} │ ${String(baseline.top3Pct + "%").padStart(6)} │ ${String(baseline.top5Pct + "%").padStart(6)} │ ${String(baseline.avgQuestions).padStart(5)}  │`);
console.log(`│  V1 (accum) │ ${String(v1.top1Pct + "%").padStart(6)} │ ${String(v1.top3Pct + "%").padStart(6)} │ ${String(v1.top5Pct + "%").padStart(6)} │ ${String(v1.avgQuestions).padStart(5)}  │`);
console.log(`│  V2 (touch) │ ${String(v2.top1Pct + "%").padStart(6)} │ ${String(v2.top3Pct + "%").padStart(6)} │ ${String(v2.top5Pct + "%").padStart(6)} │ ${String(v2.avgQuestions).padStart(5)}  │`);
console.log("└─────────────┴─────────┴─────────┴─────────┴────────┘\n");

console.log("Baseline misses fixed by V1:", comparison.baselineMissesFixedByV1.length > 0 ? comparison.baselineMissesFixedByV1.join(", ") : "none");
console.log("Baseline misses fixed by V2:", comparison.baselineMissesFixedByV2.length > 0 ? comparison.baselineMissesFixedByV2.join(", ") : "none");
console.log("New misses introduced by V1:", comparison.newMissesInV1.length);
console.log("New misses introduced by V2:", comparison.newMissesInV2.length);

console.log("\n┌──────────────────────────────────────────────────────┬──────┬──────┬──────┐");
console.log("│  Archetype                                           │ Base │  V1  │  V2  │");
console.log("├──────────────────────────────────────────────────────┼──────┼──────┼──────┤");
for (const row of comparison.perMissTable) {
  const label = `${row.id} ${row.name}`.substring(0, 52).padEnd(52);
  const bStr = row.baselineRank === 1 ? "  OK " : String(row.baselineRank).padStart(4) + " ";
  const v1Str = row.v1Rank === 1 ? "  OK " : String(row.v1Rank).padStart(4) + " ";
  const v2Str = row.v2Rank === 1 ? "  OK " : String(row.v2Rank).padStart(4) + " ";
  console.log(`│  ${label} │${bStr}│${v1Str}│${v2Str}│`);
}
console.log("└──────────────────────────────────────────────────────┴──────┴──────┴──────┘");
console.log("\nResults saved to output/scoring-experiment-results.json");
