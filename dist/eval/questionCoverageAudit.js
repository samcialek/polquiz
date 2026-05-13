// Question-coverage SHAP-style audit.
//
// Per architecture doc: leave-one-out ablation across the representative
// question bank, measuring per-(node,pos) resolution accuracy delta.
//
// Outputs (written to results/question-audit/):
//   baseline-coverage.json   — full baseline matrix
//   loo-deltas.json          — ablation matrix + per-question importance
//   importance-ranking.md    — ranked tables + per-node load-bearers
//   gap-attribution.md       — diagnoses for cells with <50% resolution
import { ARCHETYPES } from "../config/archetypes.js";
import { REPRESENTATIVE_QUESTIONS } from "../config/questions.representative.js";
import { CONTINUOUS_NODES, CATEGORICAL_NODES } from "../config/nodes.js";
import { simulateOne } from "./harness.js";
import { writeFileSync, mkdirSync } from "fs";
import { resolve } from "path";
function argmax(a) {
    let idx = 0, best = -Infinity;
    for (let i = 0; i < a.length; i++)
        if ((a[i] ?? -Infinity) > best) {
            best = a[i];
            idx = i;
        }
    return idx;
}
function expectedValue(dist, start = 0) {
    let s = 0;
    for (let i = 0; i < dist.length; i++)
        s += (i + start) * (dist[i] ?? 0);
    return s;
}
function simulateAll(archetypes, questions) {
    return archetypes
        .filter(a => a.active !== false)
        .map(a => simulateOne(a, archetypes, questions, {
        noiseSigma: 0,
        captureNodeStates: true,
    }));
}
function computeCoverage(runs, archetypes) {
    const byArchId = new Map();
    for (const r of runs)
        byArchId.set(r.archetypeId, r);
    const activeArchs = archetypes.filter(a => a.active !== false);
    const continuous = {};
    for (const nodeId of CONTINUOUS_NODES) {
        if (nodeId === "ENG")
            continue;
        continuous[nodeId] = {};
        for (let pos = 1; pos <= 5; pos++) {
            const targeted = activeArchs.filter(a => {
                const t = a.nodes[nodeId];
                return t && t.kind === "continuous" && t.pos === pos;
            });
            let correct = 0, massSum = 0, salSum = 0, counted = 0;
            for (const a of targeted) {
                const run = byArchId.get(a.id);
                if (!run?.nodeFinalState)
                    continue;
                const state = run.nodeFinalState.continuous[nodeId];
                const amIdx = argmax(state.posDist);
                if (amIdx + 1 === pos)
                    correct++;
                massSum += state.posDist[pos - 1] ?? 0;
                salSum += expectedValue(state.salDist);
                counted++;
            }
            continuous[nodeId][pos] = {
                nArchetypes: counted,
                accuracy: counted > 0 ? correct / counted : 0,
                massAtTarget: counted > 0 ? massSum / counted : 0,
                salienceEV: counted > 0 ? salSum / counted : 0,
            };
        }
    }
    const categorical = {};
    for (const nodeId of CATEGORICAL_NODES) {
        categorical[nodeId] = {};
        for (let cat = 0; cat < 6; cat++) {
            const targeted = activeArchs.filter(a => {
                const t = a.nodes[nodeId];
                if (!t || t.kind !== "categorical")
                    return false;
                return argmax(t.probs) === cat;
            });
            let correct = 0, massSum = 0, salSum = 0, counted = 0;
            for (const a of targeted) {
                const run = byArchId.get(a.id);
                if (!run?.nodeFinalState)
                    continue;
                const state = run.nodeFinalState.categorical[nodeId];
                const amIdx = argmax(state.catDist);
                if (amIdx === cat)
                    correct++;
                massSum += state.catDist[cat] ?? 0;
                salSum += expectedValue(state.salDist);
                counted++;
            }
            categorical[nodeId][cat] = {
                nArchetypes: counted,
                accuracy: counted > 0 ? correct / counted : 0,
                massAtTarget: counted > 0 ? massSum / counted : 0,
                salienceEV: counted > 0 ? salSum / counted : 0,
            };
        }
    }
    const top1 = runs.filter(r => r.correct).length / runs.length;
    const top3 = runs.filter(r => r.rank >= 1 && r.rank <= 3).length / runs.length;
    const avgQ = runs.reduce((s, r) => s + r.questionsAnswered, 0) / runs.length;
    return { continuous, categorical, globalTop1: top1, globalTop3: top3, avgQuestions: avgQ };
}
function computeImportance(baseline, ablated) {
    let scalar = 0;
    const perNode = {};
    const perCell = { continuous: {}, categorical: {} };
    for (const [nodeId, cells] of Object.entries(baseline.continuous)) {
        perNode[nodeId] = 0;
        perCell.continuous[nodeId] = {};
        for (const [posStr, b] of Object.entries(cells)) {
            const pos = +posStr;
            const a = ablated.continuous[nodeId]?.[pos];
            if (!a)
                continue;
            const d = b.accuracy - a.accuracy;
            perCell.continuous[nodeId][pos] = d;
            const abs = Math.abs(d);
            scalar += abs;
            perNode[nodeId] = (perNode[nodeId] ?? 0) + abs;
        }
    }
    for (const [nodeId, cells] of Object.entries(baseline.categorical)) {
        perNode[nodeId] = 0;
        perCell.categorical[nodeId] = {};
        for (const [catStr, b] of Object.entries(cells)) {
            const cat = +catStr;
            const a = ablated.categorical[nodeId]?.[cat];
            if (!a)
                continue;
            const d = b.accuracy - a.accuracy;
            perCell.categorical[nodeId][cat] = d;
            const abs = Math.abs(d);
            scalar += abs;
            perNode[nodeId] = (perNode[nodeId] ?? 0) + abs;
        }
    }
    return {
        scalar,
        perNode,
        perCell,
        globalTop1Delta: baseline.globalTop1 - ablated.globalTop1,
    };
}
async function main() {
    const activeArchs = ARCHETYPES.filter(a => a.active !== false);
    const bank = REPRESENTATIVE_QUESTIONS;
    console.log(`Audit: ${bank.length} questions × ${activeArchs.length} active archetypes.`);
    console.log(`Est. runtime ~${((bank.length + 1) * 7 / 60).toFixed(1)} min.\n`);
    console.log("Computing baseline…");
    const t0 = Date.now();
    const baselineRuns = simulateAll(ARCHETYPES, bank);
    const baseline = computeCoverage(baselineRuns, ARCHETYPES);
    console.log(`  baseline top-1 ${(baseline.globalTop1 * 100).toFixed(1)}%, top-3 ${(baseline.globalTop3 * 100).toFixed(1)}%, avgQ ${baseline.avgQuestions.toFixed(1)} — ${((Date.now() - t0) / 1000).toFixed(1)}s\n`);
    console.log("Running LOO ablations…");
    const ablations = {};
    const importance = {};
    const tAbl0 = Date.now();
    for (let i = 0; i < bank.length; i++) {
        const q = bank[i];
        const filtered = bank.filter(x => x.id !== q.id);
        const runs = simulateAll(ARCHETYPES, filtered);
        ablations[q.id] = computeCoverage(runs, ARCHETYPES);
        importance[q.id] = computeImportance(baseline, ablations[q.id]);
        const elapsed = (Date.now() - tAbl0) / 1000;
        const eta = ((elapsed / (i + 1)) * (bank.length - i - 1) / 60).toFixed(1);
        const imp = importance[q.id];
        console.log(`  [${String(i + 1).padStart(2)}/${bank.length}] Q${String(q.id).padEnd(3)} ${q.promptShort.slice(0, 35).padEnd(35)} ` +
            `top1Δ=${(imp.globalTop1Delta * 100).toFixed(1).padStart(5)}pp Σ|Δ|=${imp.scalar.toFixed(3)} ETA ${eta}min`);
    }
    const outDir = resolve("results/question-audit");
    mkdirSync(outDir, { recursive: true });
    writeFileSync(resolve(outDir, "baseline-coverage.json"), JSON.stringify(baseline, null, 2));
    writeFileSync(resolve(outDir, "loo-deltas.json"), JSON.stringify({ baseline, ablations, importance }, null, 2));
    // Importance ranking markdown
    const ranked = Object.entries(importance).sort((a, b) => b[1].scalar - a[1].scalar);
    const nodeOrder = [...CONTINUOUS_NODES.filter(n => n !== "ENG"), ...CATEGORICAL_NODES];
    let md = "# Question Coverage Audit — LOO Importance Ranking\n\n";
    md += `Baseline: top-1 **${(baseline.globalTop1 * 100).toFixed(1)}%**, top-3 ${(baseline.globalTop3 * 100).toFixed(1)}%, avgQ ${baseline.avgQuestions.toFixed(1)}\n\n`;
    md += `Bank size: ${bank.length} questions · Active archetypes: ${activeArchs.length}\n\n`;
    md += "Metric: sum of absolute per-cell accuracy delta when the question is removed from the bank. Higher = more load-bearing.\n\n";
    md += "## Top 25 most load-bearing questions\n\n";
    md += "| Rank | Qid | Prompt | Σ\\|Δ accuracy\\| | top-1 Δ pp | Top node contribution |\n";
    md += "|------|-----|--------|------------------|------------|------------------------|\n";
    for (let i = 0; i < Math.min(25, ranked.length); i++) {
        const [qidStr, imp] = ranked[i];
        const q = bank.find(x => x.id === +qidStr);
        const topNode = Object.entries(imp.perNode).sort((a, b) => b[1] - a[1])[0];
        md += `| ${i + 1} | Q${qidStr} | \`${q.promptShort}\` | ${imp.scalar.toFixed(3)} | ${(imp.globalTop1Delta * 100).toFixed(1)} | ${topNode[0]} (${topNode[1].toFixed(3)}) |\n`;
    }
    md += "\n## Bottom 15 least load-bearing (ablation candidates)\n\n";
    md += "| Rank | Qid | Prompt | Σ\\|Δ accuracy\\| | top-1 Δ pp |\n";
    md += "|------|-----|--------|------------------|------------|\n";
    for (let i = 0; i < Math.min(15, ranked.length); i++) {
        const idx = ranked.length - 1 - i;
        const [qidStr, imp] = ranked[idx];
        const q = bank.find(x => x.id === +qidStr);
        md += `| ${idx + 1} | Q${qidStr} | \`${q.promptShort}\` | ${imp.scalar.toFixed(3)} | ${(imp.globalTop1Delta * 100).toFixed(1)} |\n`;
    }
    md += "\n## Per-node load-bearers (top 5 per node)\n\n";
    for (const nodeId of nodeOrder) {
        const nodeRanked = Object.entries(importance)
            .filter(([_, i]) => (i.perNode[nodeId] ?? 0) > 0.001)
            .sort((a, b) => (b[1].perNode[nodeId] ?? 0) - (a[1].perNode[nodeId] ?? 0))
            .slice(0, 5);
        md += `### ${nodeId}\n\n`;
        if (nodeRanked.length === 0) {
            md += "_No question moves this node's resolution accuracy on LOO._\n\n";
            continue;
        }
        for (const [qidStr, imp] of nodeRanked) {
            const q = bank.find(x => x.id === +qidStr);
            md += `- Q${qidStr} \`${q.promptShort}\` — Δ=${(imp.perNode[nodeId] ?? 0).toFixed(3)}\n`;
        }
        md += "\n";
    }
    writeFileSync(resolve(outDir, "importance-ranking.md"), md);
    // Gap attribution markdown
    let gapMd = "# Coverage Gap Attribution\n\n";
    gapMd += `Baseline: top-1 ${(baseline.globalTop1 * 100).toFixed(1)}%, top-3 ${(baseline.globalTop3 * 100).toFixed(1)}%\n\n`;
    gapMd += "Cells where baseline resolution accuracy < 50%. Each gap lists the questions that declare a touchProfile entry for that node (non-salience roles), to diagnose declared-but-ineffective coverage.\n\n";
    const gaps = [];
    for (const [nodeId, cells] of Object.entries(baseline.continuous)) {
        for (const [posStr, m] of Object.entries(cells)) {
            if (m.nArchetypes > 0 && m.accuracy < 0.5)
                gaps.push([nodeId, +posStr, m, "continuous"]);
        }
    }
    for (const [nodeId, cells] of Object.entries(baseline.categorical)) {
        for (const [catStr, m] of Object.entries(cells)) {
            if (m.nArchetypes > 0 && m.accuracy < 0.5)
                gaps.push([nodeId, +catStr, m, "categorical"]);
        }
    }
    gaps.sort((a, b) => a[2].accuracy - b[2].accuracy);
    for (const [nodeId, idx, m, kind] of gaps) {
        const label = kind === "continuous" ? `pos=${idx}` : `cat=${idx}`;
        gapMd += `## ${nodeId} ${label}\n\n`;
        gapMd += `- Archetypes with this template value: **${m.nArchetypes}**\n`;
        gapMd += `- Resolution accuracy: **${(m.accuracy * 100).toFixed(1)}%**\n`;
        gapMd += `- Mean posterior mass at target: ${m.massAtTarget.toFixed(3)}\n`;
        gapMd += `- Mean salience EV: ${m.salienceEV.toFixed(2)}\n`;
        const touching = bank.filter(q => q.touchProfile.some(t => t.node === nodeId && t.role !== "salience"));
        gapMd += `- Questions touching ${nodeId} (non-salience roles): ${touching.length}\n`;
        if (touching.length > 0) {
            gapMd += `  - ${touching.map(q => `Q${q.id}`).join(", ")}\n`;
        }
        const topContributors = Object.entries(importance)
            .filter(([_, i]) => (i.perCell.continuous[nodeId]?.[idx] ?? i.perCell.categorical[nodeId]?.[idx] ?? 0) !== 0)
            .sort((a, b) => {
            const av = Math.abs(a[1].perCell.continuous[nodeId]?.[idx] ?? a[1].perCell.categorical[nodeId]?.[idx] ?? 0);
            const bv = Math.abs(b[1].perCell.continuous[nodeId]?.[idx] ?? b[1].perCell.categorical[nodeId]?.[idx] ?? 0);
            return bv - av;
        })
            .slice(0, 5);
        if (topContributors.length) {
            gapMd += `- Top LOO contributors to this cell:\n`;
            for (const [qidStr, imp] of topContributors) {
                const d = imp.perCell.continuous[nodeId]?.[idx] ?? imp.perCell.categorical[nodeId]?.[idx] ?? 0;
                const q = bank.find(x => x.id === +qidStr);
                gapMd += `  - Q${qidStr} \`${q.promptShort}\` — Δ=${d.toFixed(3)}\n`;
            }
        }
        gapMd += "\n";
    }
    writeFileSync(resolve(outDir, "gap-attribution.md"), gapMd);
    console.log(`\nTotal runtime: ${((Date.now() - t0) / 1000 / 60).toFixed(1)} min`);
    console.log(`\nOutputs:`);
    console.log(`  ${outDir}/baseline-coverage.json`);
    console.log(`  ${outDir}/loo-deltas.json`);
    console.log(`  ${outDir}/importance-ranking.md`);
    console.log(`  ${outDir}/gap-attribution.md`);
}
main().catch(err => { console.error(err); process.exit(1); });
//# sourceMappingURL=questionCoverageAudit.js.map