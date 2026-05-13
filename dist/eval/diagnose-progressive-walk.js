/**
 * Layer 1 — Simulated progressive quiz-walk diagnostic.
 *
 * Run the full quiz simulation on each of several "progressive" target
 * archetypes. For each run, print:
 *   - final per-node E[pos] and E[sal]
 *   - top-5 archetype matches
 *   - was the target found in top 1 / top 5?
 *
 * If the engine systematically fails to recover a pluralist CU or non-tribal
 * TRB when the target archetype has CU=5/TRB=2, the bug is upstream of the
 * scorer — in the question/evidence maps.
 */
import { ARCHETYPES } from "../config/archetypes.js";
import { REPRESENTATIVE_QUESTIONS } from "../config/questions.representative.js";
import { simulateOne } from "./harness.js";
import { resetConfig } from "../optimize/runtimeConfig.js";
import { isSelfNode } from "../config/nodes.js";
resetConfig();
const active = ARCHETYPES.filter((a) => a.active !== false);
// The archetypes most representative of a "progressive Democrat / pluralist"
const TARGET_IDS = [
    "010", // Bread-and-Butter Progressive
    "011", // Jacobin Egalitarian
    "014", // Activist Progressive
    "029", // Liberationist Progressive
    "042", // Localist Progressive
    "134", // Progressive Civic Nationalist
    "001", // Rawlsian Reformer
    "060", // Hinge Citizen (user's actual result — for comparison)
];
function summarizePosDist(dist) {
    let e = 0;
    for (let i = 0; i < 5; i++)
        e += (dist[i] ?? 0) * (i + 1);
    return e;
}
function summarizeSalDist(dist) {
    let e = 0;
    for (let i = 0; i < 4; i++)
        e += (dist[i] ?? 0) * i;
    return e;
}
for (const targetId of TARGET_IDS) {
    const target = active.find((a) => a.id === targetId);
    if (!target) {
        console.log(`MISSING: ${targetId}\n`);
        continue;
    }
    console.log("=".repeat(90));
    console.log(`Target: ${target.id}  ${target.name}`);
    console.log(`  Target encoding:`);
    for (const [nodeId, n] of Object.entries(target.nodes)) {
        if (n.kind === "continuous") {
            if (isSelfNode(nodeId)) {
                console.log(`    ${nodeId.padEnd(6)}  pos=${n.pos}`);
            }
            else {
                console.log(`    ${nodeId.padEnd(6)}  pos=${n.pos}  sal=${n.sal ?? '-'}`);
            }
        }
        else {
            const peak = n.probs.indexOf(Math.max(...n.probs));
            console.log(`    ${nodeId.padEnd(6)}  cat_peak=${peak}  sal=${n.sal}`);
        }
    }
    // deterministic run first
    const run = simulateOne(target, ARCHETYPES, REPRESENTATIVE_QUESTIONS, {
        noiseSigma: 0,
        seed: 42,
        maxQuestions: 65,
        captureDistances: true,
        captureNodeStates: true,
    });
    console.log();
    console.log(`  Final signature (deterministic run, σ=0):`);
    const nodesShown = ["MAT", "CD", "CU", "MOR", "PRO", "COM", "ZS", "ONT_H", "ONT_S", "PF", "TRB", "ENG"];
    for (const nodeId of nodesShown) {
        const s = run.nodeFinalState?.continuous?.[nodeId];
        if (!s)
            continue;
        const pos = summarizePosDist(s.posDist);
        const sal = summarizeSalDist(s.salDist);
        const t = target.nodes[nodeId];
        const targetPosDisp = t && t.kind === "continuous" ? t.pos : "?";
        const targetSalDisp = t && t.kind === "continuous" && !isSelfNode(nodeId) ? (t.sal ?? 0) : "-";
        const posMark = Math.abs(pos - (t && t.kind === "continuous" ? t.pos : 3)) > 1 ? "  ⚠" : "";
        console.log(`    ${nodeId.padEnd(6)}  E[pos]=${pos.toFixed(2)} (target ${targetPosDisp})   E[sal]=${sal.toFixed(2)} (target ${targetSalDisp})${posMark}`);
    }
    console.log();
    console.log(`  Top-5 archetype match:`);
    const ranked = active
        .map((a) => ({ id: a.id, name: a.name, dist: run.nodeFinalState ? run.nodeFinalState.archetypeDistances?.[a.id] ?? 0 : 0 }))
        .filter((x) => x.dist > 0)
        .sort((a, b) => a.dist - b.dist)
        .slice(0, 5);
    for (const r of ranked) {
        const marker = r.id === target.id ? " ← TARGET" : "";
        console.log(`    ${r.id}  ${r.name.padEnd(40)} dist=${r.dist.toFixed(4)}${marker}`);
    }
    const targetRank = active
        .map((a) => ({ id: a.id, dist: run.nodeFinalState ? run.nodeFinalState.archetypeDistances?.[a.id] ?? 0 : 0 }))
        .filter((x) => x.dist > 0)
        .sort((a, b) => a.dist - b.dist)
        .findIndex((x) => x.id === target.id);
    console.log(`  Target rank: #${targetRank + 1} / ${active.length}`);
    console.log();
}
//# sourceMappingURL=diagnose-progressive-walk.js.map