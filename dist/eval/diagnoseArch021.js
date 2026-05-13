// @ts-nocheck
// PENDING PHASE-3 PORT — Phase-2d diagnostic relies on pre-Phase-3 posterior
// capture (capturePosterior/topPosterior/posteriorFinal). Kept for historical
// reference; not rebuilt against the distance-native shape.
/**
 * Diagnostic for Phase 2d verification.
 *
 * For Phase 2d of the TRB evidence-map fix, the regression report needs:
 *   1. 021's final TRB anchor winner
 *   2. 001's final TRB anchor winner (under 001 simulation)
 *   3. 001 - 021 posterior margin in 021's run
 *   4. 021's final-state TRB salience touches
 *
 * Usage:
 *   npx tsx src/eval/diagnoseArch021.ts
 */
import { ARCHETYPES } from "../config/archetypes.js";
import { REPRESENTATIVE_QUESTIONS } from "../config/questions.representative.js";
import { resetConfig } from "../optimize/runtimeConfig.js";
import { simulateOne } from "./harness.js";
const TRB_ANCHOR_NAMES = [
    "national",
    "ideological",
    "religious",
    "class",
    "ethnic_racial",
    "gender",
    "sexual",
    "global",
    "mixed_none",
];
function fmtAnchor(dist) {
    return dist
        .map((p, i) => `${TRB_ANCHOR_NAMES[i]}:${p.toFixed(3)}`)
        .join("  ");
}
function topAnchor(dist) {
    const entries = dist.map((p, i) => ({ name: TRB_ANCHOR_NAMES[i], p }));
    entries.sort((a, b) => b.p - a.p);
    return {
        name: entries[0].name,
        prob: entries[0].p,
        rank2: entries[1].name,
        rank2prob: entries[1].p,
    };
}
function main() {
    resetConfig();
    const archetypes = ARCHETYPES;
    const questions = REPRESENTATIVE_QUESTIONS;
    for (const id of ["021", "001"]) {
        const target = archetypes.find(a => a.id === id);
        if (!target) {
            console.error(`Missing ${id}`);
            continue;
        }
        console.log(`\n=== Target ${id} ${target.name} ===`);
        const run = simulateOne(target, archetypes, questions, {
            noiseSigma: 0,
            seed: 0,
            maxQuestions: 65,
            capturePosterior: true,
            captureNodeStates: true,
        });
        console.log(`result: ${run.resultId} ${run.resultName} (correct=${run.correct})`);
        console.log(`rank of target: ${run.rank}`);
        console.log(`questions answered: ${run.questionsAnswered}`);
        console.log(`top posterior: ${run.topPosterior.toFixed(4)}`);
        console.log(`posterior margin (top1 - top2): ${run.margin.toFixed(4)}`);
        console.log(`top5: ${run.top5.join(" | ")}`);
        // TRB anchor final distribution
        const trbDist = run.nodeFinalState.trbAnchor.dist;
        const trbTouches = run.nodeFinalState.trbAnchor.touches;
        const top = topAnchor(trbDist);
        console.log(`TRB anchor touches: ${trbTouches}`);
        console.log(`TRB anchor full dist:`);
        console.log(`  ${fmtAnchor(trbDist)}`);
        console.log(`TRB anchor winner: ${top.name} (${top.prob.toFixed(4)}); runner-up: ${top.rank2} (${top.rank2prob.toFixed(4)})`);
        // 001 vs 021 in this run's posterior
        const p001 = run.posteriorFinal["001"] ?? 0;
        const p021 = run.posteriorFinal["021"] ?? 0;
        console.log(`posterior[001] = ${p001.toFixed(4)}`);
        console.log(`posterior[021] = ${p021.toFixed(4)}`);
        console.log(`001 - 021 margin: ${(p001 - p021).toFixed(4)}`);
        // Rank of 001 and 021 inside the final posterior (to double-check)
        const sorted = Object.entries(run.posteriorFinal).sort((a, b) => b[1] - a[1]);
        const r001 = sorted.findIndex(([k]) => k === "001") + 1;
        const r021 = sorted.findIndex(([k]) => k === "021") + 1;
        console.log(`rank[001] = ${r001},  rank[021] = ${r021}`);
        // Report TRB continuous node final state (position + salience)
        const trbNode = run.nodeFinalState.continuous["TRB"];
        if (trbNode) {
            console.log(`TRB node posDist: [${trbNode.posDist.map(x => x.toFixed(3)).join(", ")}]  salDist: [${trbNode.salDist.map(x => x.toFixed(3)).join(", ")}]  touches: ${trbNode.touches}`);
        }
    }
}
main();
//# sourceMappingURL=diagnoseArch021.js.map