/**
 * Step 5 analyzer — per-dimension and per-UI-type × per-dimension variance
 * reduction, derived from the Step 5 node-state capture.
 *
 * Streams sigma-{00,05,15}.jsonl (three files, ~1GB total) without loading
 * full JSONL into memory. Uses the *final* node state snapshot per run for
 * entropy/variance-reduction stats; uses the per-question touch deltas for
 * per-UI-type × per-dimension metrics.
 *
 * Outputs in results/step5/:
 *   per-node-variance-reduction.csv
 *   per-archetype-per-node.csv
 *   per-ui-type-per-node.csv
 *   ui-type-counts.csv
 *   report.md
 */
import * as fs from "fs";
import * as path from "path";
import * as readline from "readline";
import { ARCHETYPES } from "../config/archetypes.js";
import { CONTINUOUS_NODES, CATEGORICAL_NODES } from "../config/nodes.js";
const STEP5_DIR = path.join(process.cwd(), "results", "step5");
const OUT_DIR = STEP5_DIR;
const DEACTIVATED = new Set(["019", "023", "025"]);
// Bin counts per node
const POS_BINS = 5; // posDist over {1..5}
const SAL_BINS = 4; // salDist over {0,1,2,3}
const EPS_CATS = 6;
const AES_CATS = 6;
const TRB_BINS = 9; // state init length (types.ts has 9)
const H_POS_UNIFORM = Math.log(POS_BINS);
const H_SAL_UNIFORM = Math.log(SAL_BINS);
const H_EPS_UNIFORM = Math.log(EPS_CATS);
const H_AES_UNIFORM = Math.log(AES_CATS);
const H_TRB_UNIFORM = Math.log(TRB_BINS);
const ARCH_META = Object.fromEntries(ARCHETYPES.map(a => [a.id, { id: a.id, name: a.name, tier: a.tier, active: a.active !== false }]));
// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function entropy(dist) {
    let h = 0;
    for (const v of dist) {
        if (v > 0)
            h -= v * Math.log(v);
    }
    return h;
}
function l1Distance(a, b) {
    if (!a || !b)
        return 0;
    let s = 0;
    const n = Math.min(a.length, b.length);
    for (let i = 0; i < n; i++)
        s += Math.abs(a[i] - b[i]);
    return s;
}
function isUniform(dist, tol = 1e-6) {
    if (dist.length === 0)
        return false;
    const u = 1 / dist.length;
    for (const v of dist)
        if (Math.abs(v - u) > tol)
            return false;
    return true;
}
function blankPerNodeAgg() {
    return { finalPosH: 0, finalSalH: 0, touches: 0, runs: 0, zeroTouchRuns: 0 };
}
function blankPerCatAgg() {
    return { finalCatH: 0, finalSalH: 0, touches: 0, runs: 0, zeroTouchRuns: 0 };
}
function blankPerTrbAgg() {
    return { finalH: 0, touches: 0, runs: 0, zeroTouchRuns: 0 };
}
function blankUiNodeAgg() {
    return {
        deltaPosSum: 0,
        deltaSalSum: 0,
        deltaCatSum: 0,
        deltaAnchorSum: 0,
        touches: 0,
        runs: new Set(),
    };
}
function makeSigmaBlock(sigma, file) {
    return {
        sigma,
        file,
        totalRuns: 0,
        contByArch: {},
        catByArch: {},
        trbByArch: {},
        uiNode: {},
        uiCounts: {},
    };
}
async function processSigmaFile(sigma, file) {
    const block = makeSigmaBlock(sigma, file);
    const rl = readline.createInterface({
        input: fs.createReadStream(file, { encoding: "utf-8" }),
        crlfDelay: Infinity,
    });
    let lineNo = 0;
    const reportEvery = 5000;
    const t0 = Date.now();
    for await (const line of rl) {
        if (!line.trim())
            continue;
        const r = JSON.parse(line);
        block.totalRuns++;
        lineNo++;
        const a = r.archetypeId;
        block.contByArch[a] ??= {};
        block.catByArch[a] ??= {};
        block.trbByArch[a] ??= blankPerTrbAgg();
        // Final state per node
        if (r.nodeFinalState) {
            for (const nodeId of CONTINUOUS_NODES) {
                const n = r.nodeFinalState.continuous[nodeId];
                if (!n)
                    continue;
                block.contByArch[a][nodeId] ??= blankPerNodeAgg();
                const agg = block.contByArch[a][nodeId];
                agg.finalPosH += entropy(n.posDist);
                agg.finalSalH += entropy(n.salDist);
                agg.touches += n.touches;
                agg.runs++;
                if (n.touches === 0)
                    agg.zeroTouchRuns++;
            }
            for (const nodeId of CATEGORICAL_NODES) {
                const n = r.nodeFinalState.categorical[nodeId];
                if (!n)
                    continue;
                block.catByArch[a][nodeId] ??= blankPerCatAgg();
                const agg = block.catByArch[a][nodeId];
                agg.finalCatH += entropy(n.catDist);
                agg.finalSalH += entropy(n.salDist);
                agg.touches += n.touches;
                agg.runs++;
                if (n.touches === 0)
                    agg.zeroTouchRuns++;
            }
            const trb = r.nodeFinalState.trbAnchor;
            if (trb) {
                const agg = block.trbByArch[a];
                agg.finalH += entropy(trb.dist);
                agg.touches += trb.touches;
                agg.runs++;
                if (trb.touches === 0)
                    agg.zeroTouchRuns++;
            }
        }
        // Trajectory → per UI × node
        if (r.nodeTrajectory) {
            for (const step of r.nodeTrajectory) {
                const ui = step.uiType;
                block.uiCounts[ui] = (block.uiCounts[ui] ?? 0) + 1;
                block.uiNode[ui] ??= {};
                for (const td of step.touchedNodes) {
                    block.uiNode[ui][td.nodeId] ??= blankUiNodeAgg();
                    const agg = block.uiNode[ui][td.nodeId];
                    agg.touches++;
                    agg.runs.add(a);
                    agg.deltaPosSum += l1Distance(td.posBefore, td.posAfter);
                    agg.deltaSalSum += l1Distance(td.salBefore, td.salAfter);
                    agg.deltaCatSum += l1Distance(td.catBefore, td.catAfter);
                    agg.deltaAnchorSum += l1Distance(td.anchorBefore, td.anchorAfter);
                }
            }
        }
        if (lineNo % reportEvery === 0) {
            const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
            console.log(`    σ=${sigma}: ${lineNo} lines, ${elapsed}s`);
        }
    }
    return block;
}
// ---------------------------------------------------------------------------
// CSV / report writers
// ---------------------------------------------------------------------------
function writePerNodeVarianceReductionCsv(blocks, outPath) {
    // For each node, average across archetypes (excluding deactivated):
    //   mean_final_pos_H, mean_final_sal_H (continuous)
    //   mean_final_cat_H, mean_final_sal_H (categorical)
    //   mean_final_H (TRB)
    //   variance reduction = 1 - meanH / H_uniform
    const headers = [
        "node_id",
        "node_kind",
        ...blocks.flatMap(b => {
            const s = String(b.sigma);
            return [
                `sigma_${s}_mean_final_H`,
                `sigma_${s}_mean_final_sal_H`,
                `sigma_${s}_var_reduction_pct`,
                `sigma_${s}_mean_touches`,
                `sigma_${s}_zero_touch_pct`,
                `sigma_${s}_runs`,
            ];
        }),
    ];
    const lines = [headers.join(",")];
    const aggNodeCont = (block, nodeId) => {
        let posHSum = 0, salHSum = 0, touchesSum = 0, runs = 0, zeroTouches = 0;
        for (const [aid, perNode] of Object.entries(block.contByArch)) {
            if (DEACTIVATED.has(aid))
                continue;
            const n = perNode[nodeId];
            if (!n)
                continue;
            if (n.runs === 0)
                continue;
            posHSum += n.finalPosH / n.runs;
            salHSum += n.finalSalH / n.runs;
            touchesSum += n.touches / n.runs;
            zeroTouches += n.zeroTouchRuns / n.runs;
            runs += n.runs;
        }
        // Average across archetypes (not across runs, since per-archetype means are
        // more interpretable under uneven archetype counts)
        const archetypes = Object.keys(block.contByArch).filter(id => !DEACTIVATED.has(id));
        const n = archetypes.length || 1;
        return {
            meanPosH: posHSum / n,
            meanSalH: salHSum / n,
            meanTouches: touchesSum / n,
            zeroTouchPct: (zeroTouches / n) * 100,
            runs,
        };
    };
    const aggNodeCat = (block, nodeId) => {
        let catHSum = 0, salHSum = 0, touchesSum = 0, runs = 0, zeroTouches = 0;
        for (const [aid, perNode] of Object.entries(block.catByArch)) {
            if (DEACTIVATED.has(aid))
                continue;
            const n = perNode[nodeId];
            if (!n)
                continue;
            if (n.runs === 0)
                continue;
            catHSum += n.finalCatH / n.runs;
            salHSum += n.finalSalH / n.runs;
            touchesSum += n.touches / n.runs;
            zeroTouches += n.zeroTouchRuns / n.runs;
            runs += n.runs;
        }
        const archetypes = Object.keys(block.catByArch).filter(id => !DEACTIVATED.has(id));
        const n = archetypes.length || 1;
        return {
            meanCatH: catHSum / n,
            meanSalH: salHSum / n,
            meanTouches: touchesSum / n,
            zeroTouchPct: (zeroTouches / n) * 100,
            runs,
        };
    };
    const aggTrb = (block) => {
        let hSum = 0, touchesSum = 0, runs = 0, zeroTouches = 0;
        for (const [aid, agg] of Object.entries(block.trbByArch)) {
            if (DEACTIVATED.has(aid))
                continue;
            if (agg.runs === 0)
                continue;
            hSum += agg.finalH / agg.runs;
            touchesSum += agg.touches / agg.runs;
            zeroTouches += agg.zeroTouchRuns / agg.runs;
            runs += agg.runs;
        }
        const archetypes = Object.keys(block.trbByArch).filter(id => !DEACTIVATED.has(id));
        const n = archetypes.length || 1;
        return {
            meanH: hSum / n,
            meanTouches: touchesSum / n,
            zeroTouchPct: (zeroTouches / n) * 100,
            runs,
        };
    };
    for (const nodeId of CONTINUOUS_NODES) {
        const row = [nodeId, "continuous_pos"];
        for (const b of blocks) {
            const x = aggNodeCont(b, nodeId);
            const varRed = ((H_POS_UNIFORM - x.meanPosH) / H_POS_UNIFORM) * 100;
            row.push(x.meanPosH.toFixed(4), x.meanSalH.toFixed(4), varRed.toFixed(2), x.meanTouches.toFixed(2), x.zeroTouchPct.toFixed(2), x.runs);
        }
        lines.push(row.join(","));
    }
    for (const nodeId of CATEGORICAL_NODES) {
        const row = [nodeId, "categorical"];
        const H_UNIFORM = nodeId === "EPS" ? H_EPS_UNIFORM : H_AES_UNIFORM;
        for (const b of blocks) {
            const x = aggNodeCat(b, nodeId);
            const varRed = ((H_UNIFORM - x.meanCatH) / H_UNIFORM) * 100;
            row.push(x.meanCatH.toFixed(4), x.meanSalH.toFixed(4), varRed.toFixed(2), x.meanTouches.toFixed(2), x.zeroTouchPct.toFixed(2), x.runs);
        }
        lines.push(row.join(","));
    }
    // TRB anchor
    {
        const row = ["TRB_anchor", "anchor"];
        for (const b of blocks) {
            const x = aggTrb(b);
            const varRed = ((H_TRB_UNIFORM - x.meanH) / H_TRB_UNIFORM) * 100;
            row.push(x.meanH.toFixed(4), "n/a", varRed.toFixed(2), x.meanTouches.toFixed(2), x.zeroTouchPct.toFixed(2), x.runs);
        }
        lines.push(row.join(","));
    }
    fs.writeFileSync(outPath, lines.join("\n"));
}
function writePerArchetypePerNodeCsv(blocks, outPath) {
    // Wide table: archetype × node × sigma → final entropy / touches
    const headers = ["arch_id", "arch_name", "deactivated", "node_id", "node_kind",
        ...blocks.flatMap(b => [`sigma_${b.sigma}_finalH`, `sigma_${b.sigma}_mean_touches`])];
    const lines = [headers.join(",")];
    for (const a of ARCHETYPES) {
        for (const nodeId of CONTINUOUS_NODES) {
            const row = [
                a.id,
                `"${a.name.replace(/"/g, '""')}"`,
                DEACTIVATED.has(a.id) ? "1" : "0",
                nodeId,
                "continuous",
            ];
            for (const b of blocks) {
                const agg = b.contByArch[a.id]?.[nodeId];
                if (agg && agg.runs) {
                    row.push((agg.finalPosH / agg.runs).toFixed(4), (agg.touches / agg.runs).toFixed(2));
                }
                else {
                    row.push("n/a", "n/a");
                }
            }
            lines.push(row.join(","));
        }
        for (const nodeId of CATEGORICAL_NODES) {
            const row = [
                a.id,
                `"${a.name.replace(/"/g, '""')}"`,
                DEACTIVATED.has(a.id) ? "1" : "0",
                nodeId,
                "categorical",
            ];
            for (const b of blocks) {
                const agg = b.catByArch[a.id]?.[nodeId];
                if (agg && agg.runs) {
                    row.push((agg.finalCatH / agg.runs).toFixed(4), (agg.touches / agg.runs).toFixed(2));
                }
                else {
                    row.push("n/a", "n/a");
                }
            }
            lines.push(row.join(","));
        }
    }
    fs.writeFileSync(outPath, lines.join("\n"));
}
function writePerUiPerNodeCsv(blocks, outPath) {
    const headers = ["ui_type", "node_id",
        ...blocks.flatMap(b => [
            `sigma_${b.sigma}_touches`,
            `sigma_${b.sigma}_mean_delta_pos`,
            `sigma_${b.sigma}_mean_delta_sal`,
            `sigma_${b.sigma}_mean_delta_cat`,
            `sigma_${b.sigma}_mean_delta_anchor`,
            `sigma_${b.sigma}_archetypes_reached`,
        ])];
    const lines = [headers.join(",")];
    const allPairs = new Set();
    for (const b of blocks) {
        for (const ui of Object.keys(b.uiNode)) {
            for (const node of Object.keys(b.uiNode[ui])) {
                allPairs.add(`${ui}|${node}`);
            }
        }
    }
    const sortedPairs = [...allPairs].sort();
    for (const pair of sortedPairs) {
        const [ui, node] = pair.split("|");
        const row = [ui, node];
        for (const b of blocks) {
            const agg = b.uiNode[ui]?.[node];
            if (agg && agg.touches) {
                row.push(agg.touches, (agg.deltaPosSum / agg.touches).toFixed(4), (agg.deltaSalSum / agg.touches).toFixed(4), (agg.deltaCatSum / agg.touches).toFixed(4), (agg.deltaAnchorSum / agg.touches).toFixed(4), agg.runs.size);
            }
            else {
                row.push(0, "n/a", "n/a", "n/a", "n/a", 0);
            }
        }
        lines.push(row.join(","));
    }
    fs.writeFileSync(outPath, lines.join("\n"));
}
function writeUiCountsCsv(blocks, outPath) {
    const headers = ["ui_type", ...blocks.flatMap(b => [`sigma_${b.sigma}_count`, `sigma_${b.sigma}_pct`])];
    const lines = [headers.join(",")];
    const uis = new Set();
    for (const b of blocks)
        for (const k of Object.keys(b.uiCounts))
            uis.add(k);
    const sortedUis = [...uis].sort();
    for (const ui of sortedUis) {
        const row = [ui];
        for (const b of blocks) {
            const count = b.uiCounts[ui] ?? 0;
            const total = Object.values(b.uiCounts).reduce((a, n) => a + n, 0);
            const pct = total ? (count / total) * 100 : 0;
            row.push(count, pct.toFixed(2));
        }
        lines.push(row.join(","));
    }
    fs.writeFileSync(outPath, lines.join("\n"));
}
function writeReport(blocks, manifest, outPath) {
    const lines = [];
    lines.push("# PRISM Step 5 — Per-Dimension Variance Reduction Report");
    lines.push("");
    lines.push(`Generated: ${new Date().toISOString()}`);
    lines.push(`Step 5 run: ${manifest.startedAt} → ${manifest.finishedAt} (${manifest.elapsedSec}s)`);
    lines.push(`Git: ${manifest.git?.branch ?? "?"} @ ${manifest.git?.sha?.slice(0, 10) ?? "?"}${manifest.git?.dirty ? " (dirty)" : ""}`);
    lines.push(`Total runs: ${manifest.totalRuns}`);
    lines.push("");
    lines.push("## Scope");
    lines.push("- Supplements Step 4's archetype-posterior-only metrics with per-node state tracking.");
    lines.push("- σ=0: N=1 (deterministic, byte-identical repeat discarded).");
    lines.push("- σ=0.5 and σ=1.5: N=200 reps each × 121 archetypes.");
    lines.push("- Variance reduction measured against the uniform prior over each node's support.");
    lines.push(`  - pos bins: ${POS_BINS} → H_uniform = ln(${POS_BINS}) = ${H_POS_UNIFORM.toFixed(3)} nats`);
    lines.push(`  - sal bins: ${SAL_BINS} → H_uniform = ${H_SAL_UNIFORM.toFixed(3)} nats`);
    lines.push(`  - EPS cats: ${EPS_CATS} → H_uniform = ${H_EPS_UNIFORM.toFixed(3)} nats`);
    lines.push(`  - AES cats: ${AES_CATS} → H_uniform = ${H_AES_UNIFORM.toFixed(3)} nats`);
    lines.push(`  - TRB anchor: ${TRB_BINS} bins → H_uniform = ${H_TRB_UNIFORM.toFixed(3)} nats`);
    lines.push("");
    lines.push("## Per-Node Variance Reduction (active archetypes, n=118)");
    lines.push("");
    lines.push("Variance reduction % = (H_uniform − mean H_final) / H_uniform × 100. Higher = node learned more.");
    lines.push("");
    lines.push("### σ = 0.5 (primary clean-answer baseline)");
    lines.push("");
    lines.push("| node       | kind       | mean H (final) | var reduction | mean touches | zero-touch runs |");
    lines.push("|------------|------------|----------------|---------------|--------------|-----------------|");
    const s05 = blocks.find(b => b.sigma === 0.5);
    const s15 = blocks.find(b => b.sigma === 1.5);
    const rowsFor = (b) => {
        const rows = [];
        for (const nodeId of CONTINUOUS_NODES) {
            let posHSum = 0, touchesSum = 0, zeroTouches = 0, archCount = 0;
            for (const [aid, perNode] of Object.entries(b.contByArch)) {
                if (DEACTIVATED.has(aid))
                    continue;
                const n = perNode[nodeId];
                if (!n || n.runs === 0)
                    continue;
                posHSum += n.finalPosH / n.runs;
                touchesSum += n.touches / n.runs;
                zeroTouches += n.zeroTouchRuns / n.runs;
                archCount++;
            }
            const mean = archCount ? posHSum / archCount : 0;
            rows.push({
                node: nodeId,
                kind: "continuous pos",
                meanH: mean,
                H_uniform: H_POS_UNIFORM,
                meanTouches: archCount ? touchesSum / archCount : 0,
                zeroTouch: archCount ? (zeroTouches / archCount) * 100 : 0,
            });
        }
        for (const nodeId of CATEGORICAL_NODES) {
            let catHSum = 0, touchesSum = 0, zeroTouches = 0, archCount = 0;
            for (const [aid, perNode] of Object.entries(b.catByArch)) {
                if (DEACTIVATED.has(aid))
                    continue;
                const n = perNode[nodeId];
                if (!n || n.runs === 0)
                    continue;
                catHSum += n.finalCatH / n.runs;
                touchesSum += n.touches / n.runs;
                zeroTouches += n.zeroTouchRuns / n.runs;
                archCount++;
            }
            const mean = archCount ? catHSum / archCount : 0;
            const H_U = nodeId === "EPS" ? H_EPS_UNIFORM : H_AES_UNIFORM;
            rows.push({
                node: nodeId,
                kind: "categorical",
                meanH: mean,
                H_uniform: H_U,
                meanTouches: archCount ? touchesSum / archCount : 0,
                zeroTouch: archCount ? (zeroTouches / archCount) * 100 : 0,
            });
        }
        {
            let hSum = 0, touchesSum = 0, zeroTouches = 0, archCount = 0;
            for (const [aid, agg] of Object.entries(b.trbByArch)) {
                if (DEACTIVATED.has(aid))
                    continue;
                if (agg.runs === 0)
                    continue;
                hSum += agg.finalH / agg.runs;
                touchesSum += agg.touches / agg.runs;
                zeroTouches += agg.zeroTouchRuns / agg.runs;
                archCount++;
            }
            const mean = archCount ? hSum / archCount : 0;
            rows.push({
                node: "TRB_anchor",
                kind: "anchor",
                meanH: mean,
                H_uniform: H_TRB_UNIFORM,
                meanTouches: archCount ? touchesSum / archCount : 0,
                zeroTouch: archCount ? (zeroTouches / archCount) * 100 : 0,
            });
        }
        return rows;
    };
    const rows05 = rowsFor(s05);
    rows05.sort((a, b) => {
        const ra = (a.H_uniform - a.meanH) / a.H_uniform;
        const rb = (b.H_uniform - b.meanH) / b.H_uniform;
        return rb - ra;
    });
    for (const r of rows05) {
        const red = ((r.H_uniform - r.meanH) / r.H_uniform) * 100;
        lines.push(`| ${r.node.padEnd(10)} | ${r.kind.padEnd(10)} | ${r.meanH.toFixed(4).padStart(14)} | ${red.toFixed(2).padStart(12)}% | ${r.meanTouches.toFixed(2).padStart(12)} | ${r.zeroTouch.toFixed(1).padStart(13)}% |`);
    }
    lines.push("");
    lines.push("### σ = 1.5 (heavy noise)");
    lines.push("");
    lines.push("| node       | kind       | mean H (final) | var reduction | mean touches | zero-touch runs |");
    lines.push("|------------|------------|----------------|---------------|--------------|-----------------|");
    const rows15 = rowsFor(s15);
    rows15.sort((a, b) => {
        const ra = (a.H_uniform - a.meanH) / a.H_uniform;
        const rb = (b.H_uniform - b.meanH) / b.H_uniform;
        return rb - ra;
    });
    for (const r of rows15) {
        const red = ((r.H_uniform - r.meanH) / r.H_uniform) * 100;
        lines.push(`| ${r.node.padEnd(10)} | ${r.kind.padEnd(10)} | ${r.meanH.toFixed(4).padStart(14)} | ${red.toFixed(2).padStart(12)}% | ${r.meanTouches.toFixed(2).padStart(12)} | ${r.zeroTouch.toFixed(1).padStart(13)}% |`);
    }
    lines.push("");
    lines.push("## UI-Type Distribution");
    lines.push("");
    lines.push("How frequently each question UI type fires, averaged over all runs.");
    lines.push("");
    const uiRows = () => {
        const uis = new Set();
        for (const b of blocks)
            for (const k of Object.keys(b.uiCounts))
                uis.add(k);
        const sorted = [...uis].sort();
        return sorted;
    };
    lines.push("| ui_type               | σ=0 count | σ=0.5 count | σ=1.5 count |");
    lines.push("|-----------------------|-----------|-------------|-------------|");
    for (const ui of uiRows()) {
        const c0 = blocks[0].uiCounts[ui] ?? 0;
        const c05 = blocks[1].uiCounts[ui] ?? 0;
        const c15 = blocks[2].uiCounts[ui] ?? 0;
        lines.push(`| ${ui.padEnd(21)} | ${String(c0).padStart(9)} | ${String(c05).padStart(11)} | ${String(c15).padStart(11)} |`);
    }
    lines.push("");
    lines.push("## Per-UI-Type × Per-Node Mean Touch Magnitude (σ = 0.5)");
    lines.push("");
    lines.push("Mean L1 distance of posDist/salDist before→after, per touch event. Higher = UI type moves that node more per hit.");
    lines.push("Top 30 (uiType, node) pairs by combined delta.");
    lines.push("");
    lines.push("| ui_type               | node     | touches | mean Δpos | mean Δsal | mean Δcat | mean Δanchor |");
    lines.push("|-----------------------|----------|---------|-----------|-----------|-----------|--------------|");
    const pairs = [];
    for (const [ui, nodes] of Object.entries(s05.uiNode)) {
        for (const [node, agg] of Object.entries(nodes)) {
            if (!agg.touches)
                continue;
            pairs.push({
                ui,
                node,
                touches: agg.touches,
                dp: agg.deltaPosSum / agg.touches,
                ds: agg.deltaSalSum / agg.touches,
                dc: agg.deltaCatSum / agg.touches,
                da: agg.deltaAnchorSum / agg.touches,
            });
        }
    }
    pairs.sort((a, b) => (b.dp + b.ds + b.dc + b.da) - (a.dp + a.ds + a.dc + a.da));
    for (const p of pairs.slice(0, 30)) {
        lines.push(`| ${p.ui.padEnd(21)} | ${p.node.padEnd(8)} | ${String(p.touches).padStart(7)} | ${p.dp.toFixed(4).padStart(9)} | ${p.ds.toFixed(4).padStart(9)} | ${p.dc.toFixed(4).padStart(9)} | ${p.da.toFixed(4).padStart(12)} |`);
    }
    lines.push("");
    lines.push("## Artifact Index");
    lines.push("");
    lines.push("```");
    lines.push("results/step5/");
    lines.push("  manifest.json                   # Step 5 run provenance");
    lines.push("  sigma-00.jsonl                  # σ=0 (N=1, deterministic) — 121 runs");
    lines.push("  sigma-05.jsonl                  # σ=0.5 — 24,200 runs");
    lines.push("  sigma-15.jsonl                  # σ=1.5 — 24,200 runs");
    lines.push("  per-node-variance-reduction.csv # per-node mean H / var reduction × σ");
    lines.push("  per-archetype-per-node.csv      # 121 × 14 × σ cell table");
    lines.push("  per-ui-type-per-node.csv        # (uiType, node) touch-weighted deltas");
    lines.push("  ui-type-counts.csv              # UI distribution");
    lines.push("  report.md                       # this file");
    lines.push("```");
    lines.push("");
    fs.writeFileSync(outPath, lines.join("\n"));
}
// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
    const manifestPath = path.join(STEP5_DIR, "manifest.json");
    if (!fs.existsSync(manifestPath)) {
        console.error(`Missing manifest: ${manifestPath}`);
        process.exit(2);
    }
    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
    fs.mkdirSync(OUT_DIR, { recursive: true });
    console.log("=== Step 5 analyzer ===");
    console.log(`Input dir:         ${STEP5_DIR}`);
    console.log(`Output dir:        ${OUT_DIR}`);
    console.log();
    const blocks = [];
    for (const f of manifest.files) {
        const filePath = path.join(STEP5_DIR, f.file);
        console.log(`Streaming ${filePath}...`);
        const t0 = Date.now();
        const block = await processSigmaFile(f.sigma, filePath);
        const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
        console.log(`  done in ${elapsed}s — ${block.totalRuns} runs`);
        blocks.push(block);
    }
    console.log();
    console.log("Writing outputs...");
    writePerNodeVarianceReductionCsv(blocks, path.join(OUT_DIR, "per-node-variance-reduction.csv"));
    writePerArchetypePerNodeCsv(blocks, path.join(OUT_DIR, "per-archetype-per-node.csv"));
    writePerUiPerNodeCsv(blocks, path.join(OUT_DIR, "per-ui-type-per-node.csv"));
    writeUiCountsCsv(blocks, path.join(OUT_DIR, "ui-type-counts.csv"));
    writeReport(blocks, manifest, path.join(OUT_DIR, "report.md"));
    console.log(`Done. Report: ${path.join(OUT_DIR, "report.md")}`);
}
main().catch(e => {
    console.error(e);
    process.exit(1);
});
//# sourceMappingURL=analyzeStep5.js.map