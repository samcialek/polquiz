// Coverage-by-slot: under a simple averaging scheme (no Bayesian prior),
// can a coherent respondent drive their per-node mean E[pos] to every target
// in {1, 2, 3, 4, 5} and their per-node mean E[sal] to every target in
// {0, 1, 2, 3}?
//
// Method:
//   1. Enumerate every (question, option, node) triple that carries position
//      evidence (5-vector) and/or salience evidence (4-vector).
//   2. For each node × each target t, simulate a coherent respondent who
//      answers every position-touching question by picking the option whose
//      coded E[pos] is closest to t. Compute the resulting mean across those
//      picks. Same for salience targets.
//   3. The target is reachable under averaging iff |mean - t| ≤ 0.5.
//
// Output: per-node table showing which pos/sal slots are reachable + which
// are not, with bottleneck questions for each unreachable slot.
//
// Usage: npx tsx src/eval/diagnoseCoverageBySlot.ts
import fs from "node:fs";
import path from "node:path";
import { REPRESENTATIVE_QUESTIONS } from "../config/questions.representative.js";
const OUT_DIR = "results/question-audit";
function expPos5(v) {
    if (!v)
        return null;
    let s = 0, m = 0;
    for (let i = 0; i < 5; i++) {
        s += (i + 1) * v[i];
        m += v[i];
    }
    return m > 0 ? s / m : null;
}
function expSal4(v) {
    if (!v)
        return null;
    let s = 0, m = 0;
    for (let i = 0; i < 4; i++) {
        s += i * v[i];
        m += v[i];
    }
    return m > 0 ? s / m : null;
}
// Canonical constants from src/engine/update.ts, replicated here for salience
// signals emitted implicitly by ranking/best-worst/priority-sort mechanics.
const RANK_SAL = [
    [0.05, 0.15, 0.30, 0.50], [0.10, 0.20, 0.30, 0.40], [0.18, 0.25, 0.30, 0.27],
    [0.27, 0.30, 0.25, 0.18], [0.40, 0.30, 0.20, 0.10], [0.50, 0.30, 0.15, 0.05],
];
const SAL_IF_BEST = [0.05, 0.15, 0.30, 0.50];
const SAL_IF_WORST = [0.50, 0.30, 0.15, 0.05];
const SAL_IF_MIDDLE = [0.25, 0.30, 0.25, 0.20];
const SAL_IF_BEST_FORCED = [0.23, 0.25, 0.27, 0.25];
const SAL_IF_WORST_FORCED = [0.27, 0.25, 0.25, 0.23];
const SAL_PRIORITY_HIGH = [0.03, 0.10, 0.27, 0.60];
const SAL_PRIORITY_MID = [0.20, 0.30, 0.30, 0.20];
const SAL_PRIORITY_LOW = [0.55, 0.30, 0.12, 0.03];
// Dual-axis salience bands from update.ts dualAxisYtoSal.
const DUAL_AXIS_BANDS = [
    { y: 0.10, sal: [0.60, 0.25, 0.12, 0.03] },
    { y: 0.30, sal: [0.40, 0.30, 0.20, 0.10] },
    { y: 0.50, sal: [0.22, 0.30, 0.28, 0.20] },
    { y: 0.70, sal: [0.10, 0.20, 0.32, 0.38] },
    { y: 0.90, sal: [0.03, 0.10, 0.27, 0.60] },
];
// ---- Enumerate every (q, source, node, ePos?, eSal?) signal. ----
const signals = [];
function pushSig(qid, uiType, promptShort, source, node, pos, sal) {
    const ePos = expPos5(pos);
    const eSal = expSal4(sal);
    if (ePos === null && eSal === null)
        return;
    signals.push({ qid, uiType, promptShort, source, node, ePos, eSal });
}
for (const q of REPRESENTATIVE_QUESTIONS) {
    const p = q.promptShort;
    // single_choice / multi / conjoint
    if (q.optionEvidence) {
        for (const [key, ev] of Object.entries(q.optionEvidence)) {
            for (const [nid, sub] of Object.entries(ev.continuous ?? {})) {
                pushSig(q.id, q.uiType, p, `optionEvidence:${key}`, nid, sub?.pos, sub?.sal);
            }
            for (const [nid, sub] of Object.entries(ev.categorical ?? {})) {
                // categorical: no ordinal position; track salience only here.
                pushSig(q.id, q.uiType, p, `optionEvidence:${key}`, nid, undefined, sub?.sal);
            }
        }
    }
    // slider
    if (q.sliderMap) {
        for (const [key, ev] of Object.entries(q.sliderMap)) {
            for (const [nid, sub] of Object.entries(ev.continuous ?? {})) {
                pushSig(q.id, q.uiType, p, `sliderMap:${key}`, nid, sub?.pos, sub?.sal);
            }
            for (const [nid, sub] of Object.entries(ev.categorical ?? {})) {
                pushSig(q.id, q.uiType, p, `sliderMap:${key}`, nid, undefined, sub?.sal);
            }
        }
    }
    // ranking — each item × each rank slot
    if (q.uiType === "ranking" && q.rankingMap) {
        for (const [item, m] of Object.entries(q.rankingMap)) {
            const touchedCont = Object.entries(m.continuous ?? {});
            const touchedCat = Object.entries(m.categorical ?? {});
            for (const [nid, sub] of touchedCont) {
                for (let r = 0; r < 6; r++) {
                    pushSig(q.id, q.uiType, p, `ranking:${item}@rank${r + 1}`, nid, sub?.pos, RANK_SAL[r]);
                }
            }
            for (const [nid] of touchedCat) {
                for (let r = 0; r < 6; r++) {
                    pushSig(q.id, q.uiType, p, `ranking:${item}@rank${r + 1}`, nid, undefined, RANK_SAL[r]);
                }
            }
        }
    }
    // best_worst — pure salience battery
    if (q.uiType === "best_worst") {
        const map = q.bestWorstMap ?? q.rankingMap;
        if (map) {
            const items = Object.keys(map);
            const nodeToItems = {};
            for (const item of items) {
                const m = map[item];
                const touched = new Set();
                for (const k of Object.keys(m.continuous ?? {}))
                    touched.add(k);
                for (const k of Object.keys(m.categorical ?? {}))
                    touched.add(k);
                for (const n of touched) {
                    (nodeToItems[n] ??= []).push(item);
                }
            }
            for (const item of items) {
                const m = map[item];
                const touched = new Set();
                for (const k of Object.keys(m.continuous ?? {}))
                    touched.add(k);
                for (const k of Object.keys(m.categorical ?? {}))
                    touched.add(k);
                for (const n of touched) {
                    const forced = (nodeToItems[n]?.length ?? 0) >= items.length;
                    const bestSal = forced ? SAL_IF_BEST_FORCED : SAL_IF_BEST;
                    const worstSal = forced ? SAL_IF_WORST_FORCED : SAL_IF_WORST;
                    const subCont = m.continuous?.[n];
                    pushSig(q.id, q.uiType, p, `bestWorst:${item}@best`, n, subCont?.pos, bestSal);
                    pushSig(q.id, q.uiType, p, `bestWorst:${item}@worst`, n, subCont?.pos, worstSal);
                    pushSig(q.id, q.uiType, p, `bestWorst:${item}@middle`, n, subCont?.pos, SAL_IF_MIDDLE);
                }
            }
        }
    }
    // priority_sort
    if (q.uiType === "priority_sort" && q.rankingMap) {
        for (const [item, m] of Object.entries(q.rankingMap)) {
            const touched = new Set();
            for (const k of Object.keys(m.continuous ?? {}))
                touched.add(k);
            for (const k of Object.keys(m.categorical ?? {}))
                touched.add(k);
            for (const n of touched) {
                const subCont = m.continuous?.[n];
                pushSig(q.id, q.uiType, p, `priority:${item}@high`, n, subCont?.pos, SAL_PRIORITY_HIGH);
                pushSig(q.id, q.uiType, p, `priority:${item}@mid`, n, subCont?.pos, SAL_PRIORITY_MID);
                pushSig(q.id, q.uiType, p, `priority:${item}@low`, n, subCont?.pos, SAL_PRIORITY_LOW);
            }
        }
    }
    // allocation — position evidence from allocation shares; salience via HHI
    // (not per-option). Allocation shares get normalized into a posDist by
    // update.ts; we approximate by treating the bucket's continuous target as
    // a point mass on that position.
    if (q.uiType === "allocation" && q.allocationMap) {
        for (const [bucket, m] of Object.entries(q.allocationMap)) {
            for (const [nid, val] of Object.entries(m.continuous ?? {})) {
                if (typeof val === "number") {
                    // Point-mass interpretation: putting 100% on this bucket moves pos
                    // to ~val. Emit a synthetic posDist concentrated at that integer.
                    const idx = Math.max(0, Math.min(4, Math.round(val) - 1));
                    const pos = [0, 0, 0, 0, 0];
                    pos[idx] = 1;
                    pushSig(q.id, q.uiType, p, `allocation:${bucket}@all-in`, nid, pos, undefined);
                }
            }
        }
    }
    // dual_axis — one gesture sets both pos and sal. x=0..1 interpolates
    // xLow→xHigh position, y=0..1 selects a salience band.
    if (q.uiType === "dual_axis" && q.dualAxisMap) {
        const da = q.dualAxisMap;
        const xs = [0, 0.25, 0.5, 0.75, 1.0];
        for (const x of xs) {
            const pos = [0, 0, 0, 0, 0];
            for (let i = 0; i < 5; i++)
                pos[i] = (1 - x) * da.xLow[i] + x * da.xHigh[i];
            for (const band of DUAL_AXIS_BANDS) {
                pushSig(q.id, q.uiType, p, `dualAxis@x=${x},y=${band.y}`, da.node, pos, band.sal);
            }
        }
    }
    // pairwise: pairMaps emit position evidence (numeric point value per pair
    // option). We treat as point mass like allocation.
    if (q.uiType === "pairwise" && q.pairMaps) {
        for (const [pairKey, opts] of Object.entries(q.pairMaps)) {
            for (const [opt, m] of Object.entries(opts)) {
                for (const [nid, val] of Object.entries(m.continuous ?? {})) {
                    if (typeof val === "number") {
                        const idx = Math.max(0, Math.min(4, Math.round(val) - 1));
                        const pos = [0, 0, 0, 0, 0];
                        pos[idx] = 1;
                        pushSig(q.id, q.uiType, p, `pair:${pairKey}/${opt}`, nid, pos, undefined);
                    }
                }
            }
        }
    }
}
// ---- Group signals by node. ----
const byNodePos = {};
const byNodeSal = {};
for (const s of signals) {
    if (s.ePos !== null)
        (byNodePos[s.node] ??= []).push(s);
    if (s.eSal !== null)
        (byNodeSal[s.node] ??= []).push(s);
}
function rangePerQuestion(sigs, field) {
    const by = new Map();
    for (const s of sigs) {
        if (s[field] === null)
            continue;
        (by.get(s.qid) ?? by.set(s.qid, []).get(s.qid)).push(s);
    }
    const out = [];
    for (const [qid, arr] of by) {
        const vals = arr.map(s => s[field]);
        out.push({
            qid,
            promptShort: arr[0].promptShort,
            uiType: arr[0].uiType,
            minV: Math.min(...vals),
            maxV: Math.max(...vals),
        });
    }
    return out;
}
function simulateReach(node, sigs, field, target) {
    const qnRanges = rangePerQuestion(sigs, field);
    if (qnRanges.length === 0) {
        return {
            node, dim: field === "ePos" ? "pos" : "sal", target,
            nQuestions: 0, attainedMean: NaN, absErr: NaN, reachable: false, bottleneckQids: [],
        };
    }
    // Per-question: pick the option-value that minimizes distance to target,
    // constrained to [minV, maxV]. (Respondent can only pick an available option.)
    let sum = 0;
    const bottlenecks = [];
    for (const r of qnRanges) {
        const pick = Math.max(r.minV, Math.min(r.maxV, target));
        sum += pick;
        if (Math.abs(pick - target) > 0.5)
            bottlenecks.push(r.qid);
    }
    const mean = sum / qnRanges.length;
    const err = Math.abs(mean - target);
    return {
        node,
        dim: field === "ePos" ? "pos" : "sal",
        target,
        nQuestions: qnRanges.length,
        attainedMean: mean,
        absErr: err,
        reachable: err <= 0.5,
        bottleneckQids: bottlenecks,
    };
}
const nodes = new Set([
    ...Object.keys(byNodePos),
    ...Object.keys(byNodeSal),
]);
const posTargets = [1, 2, 3, 4, 5];
const salTargets = [0, 1, 2, 3];
const rows = [];
for (const n of nodes) {
    const ps = byNodePos[n] ?? [];
    const ss = byNodeSal[n] ?? [];
    for (const t of posTargets)
        rows.push(simulateReach(n, ps, "ePos", t));
    for (const t of salTargets)
        rows.push(simulateReach(n, ss, "eSal", t));
}
const nodeSummaries = [];
for (const n of nodes) {
    const posRows = rows.filter(r => r.node === n && r.dim === "pos");
    const salRows = rows.filter(r => r.node === n && r.dim === "sal");
    const pMin = Math.min(...(posRows.map(r => r.attainedMean).filter(x => Number.isFinite(x))), Infinity);
    const pMax = Math.max(...(posRows.map(r => r.attainedMean).filter(x => Number.isFinite(x))), -Infinity);
    const sMin = Math.min(...(salRows.map(r => r.attainedMean).filter(x => Number.isFinite(x))), Infinity);
    const sMax = Math.max(...(salRows.map(r => r.attainedMean).filter(x => Number.isFinite(x))), -Infinity);
    nodeSummaries.push({
        node: n,
        posQuestions: posRows[0]?.nQuestions ?? 0,
        posMinAttained: Number.isFinite(pMin) ? pMin : NaN,
        posMaxAttained: Number.isFinite(pMax) ? pMax : NaN,
        posReachable15: [
            posRows.find(r => r.target === 1)?.reachable ?? false,
            posRows.find(r => r.target === 2)?.reachable ?? false,
            posRows.find(r => r.target === 3)?.reachable ?? false,
            posRows.find(r => r.target === 4)?.reachable ?? false,
            posRows.find(r => r.target === 5)?.reachable ?? false,
        ],
        salQuestions: salRows[0]?.nQuestions ?? 0,
        salMinAttained: Number.isFinite(sMin) ? sMin : NaN,
        salMaxAttained: Number.isFinite(sMax) ? sMax : NaN,
        salReachable03: [
            salRows.find(r => r.target === 0)?.reachable ?? false,
            salRows.find(r => r.target === 1)?.reachable ?? false,
            salRows.find(r => r.target === 2)?.reachable ?? false,
            salRows.find(r => r.target === 3)?.reachable ?? false,
        ],
    });
}
nodeSummaries.sort((a, b) => a.node.localeCompare(b.node));
// ---- Output. ----
fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(path.join(OUT_DIR, "coverage-by-slot.json"), JSON.stringify({
    nodeSummaries, rows,
}, null, 2));
const md = [];
md.push(`# Coverage-by-slot — averaging-mode reachability\n`);
md.push(`**Question**: under a simple *averaging* scheme (no Bayesian prior, no compression), can a coherent respondent drive their per-node mean to every target for both position (1–5) and salience (0–3)?\n`);
md.push(`**Method**: for each node × each target *t*, simulate a respondent who answers every touching question by picking the option whose coded expected value is closest to *t*. Average across questions. Reachable iff |attained − t| ≤ 0.5.\n`);
md.push(`**Corpus**: ${REPRESENTATIVE_QUESTIONS.length} representative questions, ${signals.length} signals.\n\n`);
md.push(`## Per-node reachability matrix\n`);
md.push(`Legend: ✅ = |attained − t| ≤ 0.5 (coherent respondent reaches slot); ❌ = cannot reach slot; ➖ = no evidence for this dimension.\n\n`);
md.push(`### Position reachability (targets 1 2 3 4 5)\n`);
md.push(`| Node | #qs | min attained | max attained | t=1 | t=2 | t=3 | t=4 | t=5 |`);
md.push(`|------|----:|-------------:|-------------:|:---:|:---:|:---:|:---:|:---:|`);
for (const s of nodeSummaries) {
    if (s.posQuestions === 0)
        continue;
    const cells = s.posReachable15.map(r => r ? "✅" : "❌").join(" | ");
    md.push(`| **${s.node}** | ${s.posQuestions} | ${s.posMinAttained.toFixed(2)} | ${s.posMaxAttained.toFixed(2)} | ${cells} |`);
}
md.push("");
md.push(`### Salience reachability (targets 0 1 2 3)\n`);
md.push(`| Node | #qs | min attained | max attained | t=0 | t=1 | t=2 | t=3 |`);
md.push(`|------|----:|-------------:|-------------:|:---:|:---:|:---:|:---:|`);
for (const s of nodeSummaries) {
    if (s.salQuestions === 0)
        continue;
    const cells = s.salReachable03.map(r => r ? "✅" : "❌").join(" | ");
    md.push(`| **${s.node}** | ${s.salQuestions} | ${s.salMinAttained.toFixed(2)} | ${s.salMaxAttained.toFixed(2)} | ${cells} |`);
}
md.push("");
// ---- Detailed per-slot table showing exactly how close we get ----
md.push(`## Per-slot attained values\n`);
md.push(`When a slot is unreachable, "attainedMean" tells you which direction is bounded. If attained = 2.8 for target = 5, the bank's upper end is capped at 2.8 — the max-picking respondent cannot get higher than that with the current questions.\n\n`);
md.push(`### Position\n`);
md.push(`| Node | t=1 | t=2 | t=3 | t=4 | t=5 |`);
md.push(`|------|----:|----:|----:|----:|----:|`);
for (const s of nodeSummaries) {
    if (s.posQuestions === 0)
        continue;
    const cells = [];
    for (const t of posTargets) {
        const r = rows.find(x => x.node === s.node && x.dim === "pos" && x.target === t);
        cells.push(r ? r.attainedMean.toFixed(2) : "—");
    }
    md.push(`| **${s.node}** | ${cells.join(" | ")} |`);
}
md.push("");
md.push(`### Salience\n`);
md.push(`| Node | t=0 | t=1 | t=2 | t=3 |`);
md.push(`|------|----:|----:|----:|----:|`);
for (const s of nodeSummaries) {
    if (s.salQuestions === 0)
        continue;
    const cells = [];
    for (const t of salTargets) {
        const r = rows.find(x => x.node === s.node && x.dim === "sal" && x.target === t);
        cells.push(r ? r.attainedMean.toFixed(2) : "—");
    }
    md.push(`| **${s.node}** | ${cells.join(" | ")} |`);
}
md.push("");
// ---- Bottleneck questions for unreachable slots ----
md.push(`## Unreachable slots — bottleneck questions\n`);
md.push(`For each unreachable (node, target), list the questions that cannot produce an option value within 0.5 of the target. These are the questions whose evidence pushes the attained mean away from the slot.\n\n`);
const unreachable = rows.filter(r => !r.reachable && r.nQuestions > 0);
if (unreachable.length === 0) {
    md.push(`**All slots reachable on the populated evidence axis.**\n`);
}
else {
    md.push(`| Node | Dim | Target | Attained | #bottleneck qs | Example bottlenecks |`);
    md.push(`|------|-----|-------:|---------:|---------------:|---------------------|`);
    unreachable.sort((a, b) => {
        if (a.node !== b.node)
            return a.node.localeCompare(b.node);
        if (a.dim !== b.dim)
            return a.dim.localeCompare(b.dim);
        return a.target - b.target;
    });
    for (const r of unreachable) {
        const examples = r.bottleneckQids.slice(0, 6).map(q => `Q${q}`).join(", ");
        md.push(`| **${r.node}** | ${r.dim} | ${r.target} | ${r.attainedMean.toFixed(2)} | ${r.bottleneckQids.length}/${r.nQuestions} | ${examples} |`);
    }
}
md.push("");
md.push(`## How to read\n`);
md.push(`- **Position scale** is 1–5. Archetype signatures use integer pos ∈ {1..5}. If attained at t=1 is ≈ 1.5 (not ≤ 1.5), the bank is compressing the low-end away from extremes.\n`);
md.push(`- **Salience scale** is 0–3. Archetype signatures use integer sal ∈ {0..3}. If attained at t=0 is ≈ 1.0, the bank lacks enough "this node doesn't matter" evidence for a sal=0 archetype to ever look like itself.\n`);
md.push(`- A **reachable** slot means a coherent respondent with that target CAN drive their mean there by answering consistently. If the archetype-optimal answerer doesn't land there, it's an authoring-consistency problem in the archetype signatures, not a bank-coverage problem.\n`);
md.push(`- An **unreachable** slot means the bank itself is the bottleneck — no amount of coherent answering can close the gap. These are the gaps that need new questions or re-authored options.\n`);
fs.writeFileSync(path.join(OUT_DIR, "coverage-by-slot.md"), md.join("\n") + "\n");
console.log(`Wrote ${path.join(OUT_DIR, "coverage-by-slot.md")}`);
console.log(`Wrote ${path.join(OUT_DIR, "coverage-by-slot.json")}`);
console.log(`Signals enumerated: ${signals.length}`);
console.log(`Nodes: ${nodeSummaries.length}`);
const posUnreach = rows.filter(r => r.dim === "pos" && !r.reachable && r.nQuestions > 0).length;
const salUnreach = rows.filter(r => r.dim === "sal" && !r.reachable && r.nQuestions > 0).length;
console.log(`Unreachable position slots: ${posUnreach}`);
console.log(`Unreachable salience slots: ${salUnreach}`);
//# sourceMappingURL=diagnoseCoverageBySlot.js.map