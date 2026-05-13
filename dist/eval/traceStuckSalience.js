// Trace per-question MAT salience contribution for a single stuck archetype.
// Goal: find which questions are actually pushing MAT sal UP for Civic Minimalist
// (target sal=0, stuck at 2.18 per coherent-reachability.md).
//
// Method: run the coherent archetype-optimal sim for the given archetype, and at
// each step record the MAT salDist before/after plus the question id and picked
// option/ranking. Output a chronological trace so we can see which questions
// are the culprits.
//
// Usage: npx tsx src/eval/traceStuckSalience.ts [archetypeId] [nodeId]
// Default: 122 MAT.
import { ARCHETYPES } from "../config/archetypes.js";
import { REPRESENTATIVE_QUESTIONS } from "../config/questions.representative.js";
import { CONTINUOUS_NODES, CATEGORICAL_NODES } from "../config/nodes.js";
import { selectNextQuestion, isQuestionEligible } from "../engine/nextQuestion.js";
import { shouldStop } from "../engine/stopRule.js";
import { archetypeDistance } from "../engine/archetypeDistance.js";
import { applySingleChoiceAnswer, applySliderAnswer, applyRankingAnswer, applyAllocationAnswer, applyDualAxisAnswer, applyPrioritySort, } from "../engine/update.js";
function createInitialState() {
    const continuous = {};
    for (const n of CONTINUOUS_NODES) {
        continuous[n] = {
            posDist: [0.2, 0.2, 0.2, 0.2, 0.2],
            salDist: [0.25, 0.25, 0.25, 0.25],
            touches: 0, touchTypes: new Set(), status: "unknown",
        };
    }
    const categorical = {};
    for (const n of CATEGORICAL_NODES) {
        categorical[n] = {
            catDist: [1 / 6, 1 / 6, 1 / 6, 1 / 6, 1 / 6, 1 / 6],
            salDist: [0.25, 0.25, 0.25, 0.25],
            touches: 0, touchTypes: new Set(), status: "unknown",
        };
    }
    return {
        answers: {}, continuous, categorical,
        trbAnchor: { dist: [1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9], touches: 0 },
        archetypeDistances: {},
    };
}
const archId = process.argv[2] ?? "122";
const nodeId = process.argv[3] ?? "MAT";
const target = ARCHETYPES.find(a => a.id === archId);
if (!target) {
    console.error(`Archetype ${archId} not found`);
    process.exit(1);
}
const active = ARCHETYPES.filter(a => a.active !== false);
function expSal(d) {
    let s = 0;
    for (let i = 0; i < 4; i++)
        s += i * (d[i] ?? 0);
    return s;
}
// Archetype-optimal option scoring copied from harness.ts scoreOptionEvidence
function scoreOpt(a, ev) {
    if (!ev)
        return -Infinity;
    let score = 0;
    for (const [nid, upd] of Object.entries(ev.continuous ?? {})) {
        const tmpl = a.nodes[nid];
        if (!tmpl || tmpl.kind !== "continuous")
            continue;
        if (upd?.pos) {
            const targetPos = tmpl.pos - 1;
            score += Math.log((upd.pos[targetPos] ?? 0.01) + 0.001) * 1.0;
        }
        if (upd?.sal) {
            const targetSal = tmpl.sal;
            score += Math.log((upd.sal[targetSal] ?? 0.01) + 0.001) * 0.5;
        }
    }
    for (const [nid, upd] of Object.entries(ev.categorical ?? {})) {
        const tmpl = a.nodes[nid];
        if (!tmpl || tmpl.kind !== "categorical")
            continue;
        if (upd?.cat) {
            let dot = 0;
            for (let i = 0; i < 6; i++)
                dot += (upd.cat[i] ?? 0) * (tmpl.probs[i] ?? 0);
            score += Math.log(dot + 0.001) * 1.0;
        }
        if (upd?.sal) {
            score += Math.log((upd.sal[tmpl.sal] ?? 0.01) + 0.001) * 0.5;
        }
    }
    return score;
}
function scoreItem(a, map) {
    let score = 0;
    for (const [nid, v] of Object.entries(map?.continuous ?? {})) {
        const tmpl = a.nodes[nid];
        if (!tmpl || tmpl.kind !== "continuous")
            continue;
        if (typeof v === "number") {
            const targetSignal = (tmpl.pos - 3) / 2;
            score -= Math.abs(v - targetSignal) * tmpl.sal * 1.0;
        }
        else if (v?.pos) {
            score += Math.log((v.pos[tmpl.pos - 1] ?? 0.01) + 0.001);
        }
    }
    return score;
}
const state = createInitialState();
const answeredIds = new Set();
let q = 0;
console.log(`Tracing ${target.name} (id ${target.id}), node ${nodeId}`);
console.log(`Target signature: ${JSON.stringify(target.nodes[nodeId])}`);
console.log(`Initial ${nodeId} salDist: [${state.continuous[nodeId].salDist.map(x => x.toFixed(2)).join(",")}] E=${expSal(state.continuous[nodeId].salDist).toFixed(2)}`);
console.log();
console.log(`| Q | uiType | pick | ${nodeId}_sal_before | ${nodeId}_sal_after | ΔE[sal] |`);
console.log(`|---|--------|------|-----------------|-----------------|---------|`);
const rows = [];
while (q < 55) {
    const available = REPRESENTATIVE_QUESTIONS.filter(qq => !answeredIds.has(qq.id) && qq.touchProfile.length > 0 && isQuestionEligible(state, qq));
    if (!available.length)
        break;
    // Update distances so selectNextQuestion has something to work with
    for (const a of active)
        state.archetypeDistances[a.id] = archetypeDistance(state, a);
    const next = selectNextQuestion(state, available, active);
    if (!next)
        break;
    answeredIds.add(next.id);
    const salBefore = [...state.continuous[nodeId].salDist];
    const eBefore = expSal(salBefore);
    // Pick answer like harness does
    let pick = "?";
    switch (next.uiType) {
        case "single_choice":
        case "conjoint": {
            if (next.optionEvidence) {
                let best = "", bestScore = -Infinity;
                for (const opt of Object.keys(next.optionEvidence)) {
                    const s = scoreOpt(target, next.optionEvidence[opt]);
                    if (s > bestScore) {
                        bestScore = s;
                        best = opt;
                    }
                }
                pick = best;
                applySingleChoiceAnswer(state, next, best);
            }
            break;
        }
        case "multi": {
            if (next.optionEvidence) {
                let best = "", bestScore = -Infinity;
                for (const opt of Object.keys(next.optionEvidence)) {
                    const s = scoreOpt(target, next.optionEvidence[opt]);
                    if (s > bestScore) {
                        bestScore = s;
                        best = opt;
                    }
                }
                pick = best;
                applySingleChoiceAnswer(state, next, best);
            }
            break;
        }
        case "slider": {
            if (next.sliderMap) {
                let best = "", bestScore = -Infinity;
                for (const b of Object.keys(next.sliderMap)) {
                    const s = scoreOpt(target, next.sliderMap[b]);
                    if (s > bestScore) {
                        bestScore = s;
                        best = b;
                    }
                }
                pick = best;
                const parts = best.split("-").map(Number);
                const mid = Math.round(((parts[0] ?? 0) + (parts[1] ?? 100)) / 2);
                applySliderAnswer(state, next, mid);
            }
            break;
        }
        case "ranking": {
            if (next.rankingMap) {
                const items = Object.keys(next.rankingMap);
                const scored = items.map(i => ({ i, score: scoreItem(target, next.rankingMap[i]) }));
                scored.sort((a, b) => b.score - a.score);
                pick = scored.map(x => x.i).join(">");
                applyRankingAnswer(state, next, scored.map(x => x.i));
            }
            break;
        }
        case "best_worst": {
            const map = next.bestWorstMap ?? next.rankingMap;
            if (map) {
                const items = Object.keys(map);
                const scored = items.map(i => ({ i, score: scoreItem(target, map[i]) }));
                scored.sort((a, b) => b.score - a.score);
                pick = `best=${scored[0].i},worst=${scored[scored.length - 1].i}`;
                applyRankingAnswer(state, next, scored.map(x => x.i));
            }
            break;
        }
        case "priority_sort": {
            if (next.rankingMap) {
                const items = Object.keys(next.rankingMap);
                const scored = items.map(i => ({ i, score: scoreItem(target, next.rankingMap[i]) }));
                scored.sort((a, b) => b.score - a.score);
                const n = scored.length;
                const supportHigh = scored.slice(0, Math.ceil(n / 4)).map(x => x.i);
                const supportMid = scored.slice(Math.ceil(n / 4), Math.ceil(n / 2)).map(x => x.i);
                const neutral = scored.slice(Math.ceil(n / 2), Math.ceil(3 * n / 4)).map(x => x.i);
                const opposeHigh = scored.slice(Math.ceil(3 * n / 4)).map(x => x.i);
                pick = `sH=${supportHigh.length},sM=${supportMid.length},N=${neutral.length},oH=${opposeHigh.length}`;
                applyPrioritySort(state, next, { supportHigh, supportMid, neutral, opposeHigh }, items);
            }
            break;
        }
        case "allocation": {
            if (next.allocationMap) {
                const names = Object.keys(next.allocationMap);
                const scores = {};
                for (const n of names)
                    scores[n] = scoreItem(target, next.allocationMap[n]);
                const minS = Math.min(...Object.values(scores));
                const shifted = {};
                for (const n of names)
                    shifted[n] = Math.exp((scores[n] - minS) * 2);
                const tot = Object.values(shifted).reduce((a, b) => a + b, 0);
                const alloc = {};
                for (const n of names)
                    alloc[n] = Math.round((shifted[n] / tot) * 100);
                const at = Object.values(alloc).reduce((a, b) => a + b, 0);
                if (at !== 100) {
                    const maxKey = names.reduce((a, b) => alloc[a] > alloc[b] ? a : b);
                    alloc[maxKey] = alloc[maxKey] + (100 - at);
                }
                pick = JSON.stringify(alloc);
                applyAllocationAnswer(state, next, alloc);
            }
            break;
        }
        case "dual_axis": {
            if (next.dualAxisMap) {
                const tmpl = target.nodes[next.dualAxisMap.node];
                if (tmpl && tmpl.kind === "continuous") {
                    const x = (tmpl.pos - 1) / 4;
                    const y = tmpl.sal / 3;
                    pick = `x=${x.toFixed(2)},y=${y.toFixed(2)}`;
                    applyDualAxisAnswer(state, next, { x, y });
                }
            }
            break;
        }
        default:
            break;
    }
    const salAfter = [...state.continuous[nodeId].salDist];
    const eAfter = expSal(salAfter);
    const delta = eAfter - eBefore;
    if (Math.abs(delta) > 0.005) {
        rows.push({ qid: next.id, uiType: next.uiType, pick,
            salBefore: salBefore.map(x => x.toFixed(3)).join(","),
            salAfter: salAfter.map(x => x.toFixed(3)).join(","),
            delta,
        });
        console.log(`| Q${next.id} | ${next.uiType} | ${pick.slice(0, 40)} | [${salBefore.map(x => x.toFixed(2)).join(",")}] E=${eBefore.toFixed(2)} | [${salAfter.map(x => x.toFixed(2)).join(",")}] E=${eAfter.toFixed(2)} | ${delta >= 0 ? "+" : ""}${delta.toFixed(3)} |`);
    }
    q++;
    if (shouldStop(state, active))
        break;
}
console.log();
console.log(`Final ${nodeId} salDist: [${state.continuous[nodeId].salDist.map(x => x.toFixed(3)).join(",")}] E=${expSal(state.continuous[nodeId].salDist).toFixed(2)}`);
console.log(`Questions answered: ${q}`);
console.log();
console.log(`Top salience pushes UP (Δ > 0):`);
rows.filter(r => r.delta > 0).sort((a, b) => b.delta - a.delta).slice(0, 10).forEach(r => {
    console.log(`  Q${r.qid} (${r.uiType}): Δ=${r.delta.toFixed(3)} pick=${r.pick.slice(0, 50)}`);
});
console.log(`Top salience pushes DOWN (Δ < 0):`);
rows.filter(r => r.delta < 0).sort((a, b) => a.delta - b.delta).slice(0, 10).forEach(r => {
    console.log(`  Q${r.qid} (${r.uiType}): Δ=${r.delta.toFixed(3)} pick=${r.pick.slice(0, 50)}`);
});
//# sourceMappingURL=traceStuckSalience.js.map