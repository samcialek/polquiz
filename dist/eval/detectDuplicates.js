/**
 * Phase 3f — duplicate archetype detection.
 *
 * Runs `buildArchetypeFamilies` over all 121 archetypes (active + deactivated)
 * and reports the lowest pairwise Euclidean distances using the same scoring
 * metric the production family index uses. The goal: surface archetype pairs
 * that became indistinguishable (or near-indistinguishable) after ENG was
 * removed from signatures in 3b. Candidates for consolidation or signature
 * sharpening show up at the top of the list.
 *
 * Usage:
 *   npx tsx src/eval/detectDuplicates.ts
 *
 * Output:
 *   results/phase3/duplicate-archetypes.md
 */
import * as fs from "fs";
import * as path from "path";
import { ARCHETYPES } from "../config/archetypes.js";
import { buildArchetypeFamilies } from "../engine/archetypeFamilies.js";
import { CONTINUOUS_NODES, CATEGORICAL_NODES } from "../config/nodes.js";
function compareSignatures(a, b) {
    const continuousDiffs = [];
    const categoricalDiffs = [];
    let identicalContinuous = 0;
    let identicalCategorical = 0;
    for (const n of CONTINUOUS_NODES) {
        const tA = a.nodes[n];
        const tB = b.nodes[n];
        if (!tA || !tB || tA.kind !== "continuous" || tB.kind !== "continuous")
            continue;
        if (tA.pos === tB.pos && tA.sal === tB.sal)
            identicalContinuous++;
        else
            continuousDiffs.push({ node: n, aPos: tA.pos, bPos: tB.pos, aSal: tA.sal, bSal: tB.sal });
    }
    for (const n of CATEGORICAL_NODES) {
        const tA = a.nodes[n];
        const tB = b.nodes[n];
        if (!tA || !tB || tA.kind !== "categorical" || tB.kind !== "categorical")
            continue;
        const probsEqual = tA.probs.every((p, i) => p === (tB.probs[i] ?? 0));
        if (probsEqual && tA.sal === tB.sal)
            identicalCategorical++;
        else
            categoricalDiffs.push({ node: n, aProbs: tA.probs, bProbs: tB.probs, aSal: tA.sal, bSal: tB.sal });
    }
    return { continuousDiffs, categoricalDiffs, identicalContinuous, identicalCategorical };
}
function main() {
    const archetypes = ARCHETYPES;
    const index = buildArchetypeFamilies(archetypes);
    const byId = new Map(archetypes.map((a) => [a.id, a]));
    const pairs = [];
    for (let i = 0; i < archetypes.length; i++) {
        for (let j = i + 1; j < archetypes.length; j++) {
            const a = archetypes[i];
            const b = archetypes[j];
            const d = index.pairwise[a.id][b.id];
            pairs.push({
                aId: a.id,
                aName: a.name,
                bId: b.id,
                bName: b.name,
                distance: d,
                aActive: a.active !== false,
                bActive: b.active !== false,
            });
        }
    }
    pairs.sort((x, y) => x.distance - y.distance);
    const identicalPairs = pairs.filter((p) => p.distance === 0);
    const nearDuplicates = pairs.filter((p) => p.distance > 0 && p.distance < 1);
    const close = pairs.filter((p) => p.distance >= 1 && p.distance < 2);
    const outDir = path.join(process.cwd(), "results", "phase3");
    fs.mkdirSync(outDir, { recursive: true });
    const lines = [];
    lines.push("# Phase 3f — duplicate archetype detection");
    lines.push("");
    lines.push(`Ran on all ${archetypes.length} archetypes (active + deactivated) using the`);
    lines.push(`production family-index distance metric (Euclidean sqrt of sum over nodes,`);
    lines.push(`continuous = (ΔP)² · max(sA,sB), categorical = Σ (Δprob)² · max(sA,sB),`);
    lines.push(`ENG-node skipped automatically — no archetype has an ENG template as of 3b).`);
    lines.push("");
    lines.push(`Family threshold (10th percentile): **${index.threshold.toFixed(3)}**`);
    lines.push(`Total unordered pairs: ${pairs.length}`);
    lines.push("");
    lines.push("## Summary");
    lines.push("");
    lines.push(`- **Exact duplicates (d = 0):** ${identicalPairs.length}`);
    lines.push(`- **Near-duplicates (0 < d < 1):** ${nearDuplicates.length}`);
    lines.push(`- **Close (1 ≤ d < 2):** ${close.length}`);
    lines.push("");
    function activeTag(p) {
        const a = p.aActive ? "" : " [INACTIVE]";
        const b = p.bActive ? "" : " [INACTIVE]";
        return `${a}${b}`;
    }
    if (identicalPairs.length > 0) {
        lines.push("## Exact duplicates (d = 0)");
        lines.push("");
        lines.push("These archetype pairs have byte-identical node signatures after ENG removal.");
        lines.push("Strongly consider consolidation in Stage 4.");
        lines.push("");
        lines.push("| a.id | a.name | b.id | b.name | d |");
        lines.push("|---|---|---|---|---|");
        for (const p of identicalPairs) {
            lines.push(`| ${p.aId} | ${p.aName}${activeTag(p).includes("INACTIVE") && !p.aActive ? " [INACTIVE]" : ""} | ${p.bId} | ${p.bName}${!p.bActive ? " [INACTIVE]" : ""} | 0.000 |`);
        }
        lines.push("");
    }
    else {
        lines.push("## Exact duplicates (d = 0)");
        lines.push("");
        lines.push("*None.*");
        lines.push("");
    }
    lines.push("## Closest 30 pairs");
    lines.push("");
    lines.push("| rank | d | a.id | a.name | b.id | b.name |");
    lines.push("|---|---|---|---|---|---|");
    for (let i = 0; i < Math.min(30, pairs.length); i++) {
        const p = pairs[i];
        const aFlag = p.aActive ? "" : " [INACTIVE]";
        const bFlag = p.bActive ? "" : " [INACTIVE]";
        lines.push(`| ${i + 1} | ${p.distance.toFixed(3)} | ${p.aId} | ${p.aName}${aFlag} | ${p.bId} | ${p.bName}${bFlag} |`);
    }
    lines.push("");
    // Detailed signature diff for the 5 closest non-zero pairs (zero pairs are
    // uninteresting to diff — they have no differences).
    const nonZeroClosest = pairs.filter((p) => p.distance > 0).slice(0, 5);
    if (nonZeroClosest.length > 0) {
        lines.push("## Signature diffs (5 closest non-zero pairs)");
        lines.push("");
        for (const p of nonZeroClosest) {
            const a = byId.get(p.aId);
            const b = byId.get(p.bId);
            const cmp = compareSignatures(a, b);
            lines.push(`### ${p.aId} ${p.aName} ↔ ${p.bId} ${p.bName}  (d = ${p.distance.toFixed(3)})`);
            lines.push("");
            lines.push(`Identical continuous nodes: ${cmp.identicalContinuous} / ${CONTINUOUS_NODES.filter((n) => a.nodes[n] && b.nodes[n]).length}`);
            lines.push(`Identical categorical nodes: ${cmp.identicalCategorical} / ${CATEGORICAL_NODES.filter((n) => a.nodes[n] && b.nodes[n]).length}`);
            lines.push("");
            if (cmp.continuousDiffs.length > 0) {
                lines.push(`**Continuous differences (${cmp.continuousDiffs.length}):**`);
                lines.push("");
                lines.push("| node | aPos | bPos | aSal | bSal |");
                lines.push("|---|---|---|---|---|");
                for (const d of cmp.continuousDiffs) {
                    lines.push(`| ${d.node} | ${d.aPos} | ${d.bPos} | ${d.aSal} | ${d.bSal} |`);
                }
                lines.push("");
            }
            if (cmp.categoricalDiffs.length > 0) {
                lines.push(`**Categorical differences (${cmp.categoricalDiffs.length}):**`);
                lines.push("");
                for (const d of cmp.categoricalDiffs) {
                    const aProbsStr = Array.from(d.aProbs).map((v) => v.toFixed(2)).join(", ");
                    const bProbsStr = Array.from(d.bProbs).map((v) => v.toFixed(2)).join(", ");
                    lines.push(`- **${d.node}**: aSal=${d.aSal} bSal=${d.bSal}`);
                    lines.push(`  - a.probs: [${aProbsStr}]`);
                    lines.push(`  - b.probs: [${bProbsStr}]`);
                }
                lines.push("");
            }
        }
    }
    lines.push("## Interpretation");
    lines.push("");
    lines.push(`- The family index uses a 10th-percentile cutoff (${index.threshold.toFixed(3)}), so any`);
    lines.push(`  pair above that line shows up as a family member of both sides at quiz-result`);
    lines.push(`  time. That is working as designed — family detection is about surfacing close`);
    lines.push(`  neighbours in the UI, not flagging duplicates.`);
    lines.push("");
    lines.push(`- Exact duplicates (d = 0) are the consolidation candidates. They are genuinely`);
    lines.push(`  indistinguishable under the Phase-3 Euclidean scorer on the remaining 13 nodes`);
    lines.push(`  (ENG was removed in 3b). Deactivated archetypes appearing in a d = 0 pair are`);
    lines.push(`  benign — they cannot win MAP — but the active partner in such a pair may want`);
    lines.push(`  a signature edit to keep identifiability.`);
    lines.push("");
    lines.push(`- Near-duplicates (0 < d < 1) are typically one-salience-or-one-position deltas`);
    lines.push(`  at low weight. Whether these matter depends on whether the current question`);
    lines.push(`  bank actually probes the differing node. Cross-reference with Step 3 confusion`);
    lines.push(`  matrices to decide.`);
    lines.push("");
    lines.push(`**Next step.** Review the exact-duplicate list with Sam before Stage 4 consolidation.`);
    lines.push(`No action is being taken on duplicates in this phase — Phase 3 is about the`);
    lines.push(`scoring-layer rewrite; duplicate resolution is a content decision that belongs`);
    lines.push(`alongside attractor-pair sharpening in Stage 4.`);
    const outPath = path.join(outDir, "duplicate-archetypes.md");
    fs.writeFileSync(outPath, lines.join("\n") + "\n");
    console.log(`=== Phase 3f: duplicate archetype detection ===`);
    console.log(`Total pairs:       ${pairs.length}`);
    console.log(`Exact duplicates:  ${identicalPairs.length}`);
    console.log(`Near-duplicates:   ${nearDuplicates.length} (0 < d < 1)`);
    console.log(`Close:             ${close.length} (1 ≤ d < 2)`);
    console.log(`Family threshold:  ${index.threshold.toFixed(3)} (10th percentile)`);
    console.log(`Report written:    ${outPath}`);
}
main();
//# sourceMappingURL=detectDuplicates.js.map