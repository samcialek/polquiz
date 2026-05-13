// salienceReach12.ts
//
// Sam's direct question: "can Bayesian reach zero salience within the fixed
// twelve questions?"
//
// Setup
//   - 5000 sims, realistic noise σ=0.30
//   - Uniform sample over 118 active archetypes
//   - Bayesian adaptive selector, hard-capped at 12 questions
//   - Also run checkpoints at 20, 30, 45 questions for trajectory context
//   - For each (sim, node): record target.sal, final E[salDist], salDist[0],
//     and total salience touches that went to that node within the first N
//
// Reports
//   1) Distribution of observed sal at k=12 by target.sal bucket (0/1/2/3).
//      Does the target.sal=0 bucket cluster near 0?
//   2) "Rule out" fraction at three thresholds:
//         E[sal] < 0.5          (classifier "none" bin)
//         salDist[0] >= 0.5     (majority posterior mass on sal=0)
//         salDist[0] >= 0.9     (confident rule-out)
//   3) Touch allocation — of the first 12 questions, how many updated
//      salience on target.sal=0 vs target.sal>=2 nodes? This directly tests
//      Sam's concern that "we keep having to ask questions about [sal=0
//      nodes] unless you're not doing this correctly."
//   4) Trajectory: repeat (1) and (2) at k=20, 30, 45 to show asymptote.
//
// Output: results/architecture/salience-reach-12.md
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { ARCHETYPES } from "../config/archetypes.js";
import { REPRESENTATIVE_QUESTIONS } from "../config/questions.representative.js";
import { CONTINUOUS_NODES, CATEGORICAL_NODES } from "../config/nodes.js";
import { applySingleChoiceAnswer, applySliderAnswer, applyAllocationAnswer, applyRankingAnswer, applyPairwiseAnswer, applyDualAxisAnswer, applyPrioritySort, } from "../engine/update.js";
import { selectNextQuestion, isQuestionEligible } from "../engine/nextQuestion.js";
import { resetSimilarityCache } from "../engine/stopRule.js";
import { archetypeDistance } from "../engine/archetypeDistance.js";
import { createRng } from "./rng.js";
import { jitterArchetype } from "./noise.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const OUT_PATH = path.resolve(__dirname, "../../results/architecture/salience-reach-12.md");
// ---------------------------------------------------------------------------
// Answer generation (copy of harness.ts internals — needed here because
// harness.ts doesn't expose per-step trajectory in a form we can intercept
// to count salience touches by target.sal).
// ---------------------------------------------------------------------------
function createInitialState() {
    const continuous = {};
    for (const nodeId of CONTINUOUS_NODES) {
        continuous[nodeId] = {
            posDist: [0.2, 0.2, 0.2, 0.2, 0.2],
            salDist: [0.25, 0.25, 0.25, 0.25],
            touches: 0,
            touchTypes: new Set(),
            status: "unknown",
        };
    }
    const categorical = {};
    for (const nodeId of CATEGORICAL_NODES) {
        categorical[nodeId] = {
            catDist: [1 / 6, 1 / 6, 1 / 6, 1 / 6, 1 / 6, 1 / 6],
            salDist: [0.25, 0.25, 0.25, 0.25],
            touches: 0,
            touchTypes: new Set(),
            status: "unknown",
        };
    }
    return {
        answers: {},
        continuous,
        categorical,
        trbAnchor: {
            dist: [1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9],
            touches: 0,
        },
        archetypeDistances: {},
        currentLeader: undefined,
        consecutiveLeadCount: 0,
    };
}
// Option-evidence scoring (condensed copy from harness.ts)
function scoreOptionEvidence(archetype, evidence) {
    if (!evidence)
        return 1;
    let score = 0, count = 0;
    if (evidence.continuous) {
        for (const [nodeId, upd] of Object.entries(evidence.continuous)) {
            const template = archetype.nodes[nodeId];
            if (!template || template.kind !== "continuous")
                continue;
            if (upd?.pos) {
                score += upd.pos[template.pos - 1] ?? 0;
                count++;
            }
            if (upd?.sal) {
                score += (upd.sal[template.sal] ?? 0) * 0.5;
                count += 0.5;
            }
        }
    }
    if (evidence.categorical) {
        for (const [nodeId, upd] of Object.entries(evidence.categorical)) {
            const template = archetype.nodes[nodeId];
            if (!template || template.kind !== "categorical")
                continue;
            if (upd?.cat) {
                let dot = 0;
                for (let i = 0; i < 6; i++)
                    dot += (template.probs[i] ?? 0) * (upd.cat[i] ?? 0);
                score += dot;
                count++;
            }
            if (upd?.sal) {
                score += (upd.sal[template.sal] ?? 0) * 0.5;
                count += 0.5;
            }
        }
    }
    return count > 0 ? score / count : 0;
}
function scoreBucketLike(a, bucket) {
    let score = 0, count = 0;
    if (bucket.continuous) {
        for (const [nodeId, signal] of Object.entries(bucket.continuous)) {
            const template = a.nodes[nodeId];
            if (!template || template.kind !== "continuous")
                continue;
            const desired = (template.pos - 3) / 2;
            score += desired * (signal ?? 0);
            count++;
        }
    }
    if (bucket.categorical) {
        for (const [nodeId, catDist] of Object.entries(bucket.categorical)) {
            const template = a.nodes[nodeId];
            if (!template || template.kind !== "categorical")
                continue;
            let dot = 0;
            for (let i = 0; i < 6; i++)
                dot += (template.probs[i] ?? 0) * (catDist[i] ?? 0);
            score += dot;
            count++;
        }
    }
    return count > 0 ? score / count : 0;
}
function genAnswer(a, q, s) {
    switch (q.uiType) {
        case "single_choice":
        case "conjoint": {
            if (!q.optionEvidence)
                return null;
            const options = Object.keys(q.optionEvidence);
            if (!options.length)
                return null;
            let best = options[0], bestS = -Infinity;
            for (const o of options) {
                const sc = scoreOptionEvidence(a, q.optionEvidence[o]);
                if (sc > bestS) {
                    bestS = sc;
                    best = o;
                }
            }
            return { apply: () => applySingleChoiceAnswer(s, q, best) };
        }
        case "multi": {
            if (!q.optionEvidence)
                return null;
            const options = Object.keys(q.optionEvidence);
            if (!options.length)
                return null;
            const scored = options.map(o => ({ o, sc: scoreOptionEvidence(a, q.optionEvidence[o]) }));
            scored.sort((x, y) => y.sc - x.sc);
            return { apply: () => applySingleChoiceAnswer(s, q, scored[0].o) };
        }
        case "slider": {
            if (!q.sliderMap)
                return null;
            const buckets = Object.keys(q.sliderMap);
            if (!buckets.length)
                return null;
            let best = buckets[0], bestS = -Infinity;
            for (const b of buckets) {
                const sc = scoreOptionEvidence(a, q.sliderMap[b]);
                if (sc > bestS) {
                    bestS = sc;
                    best = b;
                }
            }
            const parts = best.split("-").map(Number);
            const mid = Math.round(((parts[0] ?? 0) + (parts[1] ?? 100)) / 2);
            return { apply: () => applySliderAnswer(s, q, mid) };
        }
        case "allocation": {
            if (!q.allocationMap)
                return null;
            const names = Object.keys(q.allocationMap);
            if (!names.length)
                return null;
            const scores = {};
            for (const n of names)
                scores[n] = scoreBucketLike(a, q.allocationMap[n]);
            const touched = new Set();
            for (const b of Object.values(q.allocationMap)) {
                if (b.continuous)
                    for (const n of Object.keys(b.continuous))
                        touched.add(n);
                if (b.categorical)
                    for (const n of Object.keys(b.categorical))
                        touched.add(n);
            }
            let maxSal = 0;
            for (const n of touched) {
                const t = a.nodes[n];
                if (t && typeof t.sal === "number")
                    maxSal = Math.max(maxSal, t.sal);
            }
            const tempScale = 0.3 + (maxSal / 3) * 1.7;
            const minScore = Math.min(...Object.values(scores));
            const shifted = {};
            for (const n of names)
                shifted[n] = Math.exp((scores[n] - minScore) * tempScale);
            const total = Object.values(shifted).reduce((a, b) => a + b, 0);
            const allocation = {};
            for (const n of names)
                allocation[n] = Math.round((shifted[n] / total) * 100);
            const at = Object.values(allocation).reduce((a, b) => a + b, 0);
            if (at !== 100) {
                const mk = names.reduce((x, y) => allocation[x] > allocation[y] ? x : y);
                allocation[mk] = allocation[mk] + (100 - at);
            }
            return { apply: () => applyAllocationAnswer(s, q, allocation) };
        }
        case "ranking": {
            if (!q.rankingMap)
                return null;
            const items = Object.keys(q.rankingMap);
            if (!items.length)
                return null;
            const scored = items.map(i => ({ i, sc: scoreBucketLike(a, q.rankingMap[i]) }));
            scored.sort((x, y) => y.sc - x.sc);
            return { apply: () => applyRankingAnswer(s, q, scored.map(x => x.i)) };
        }
        case "best_worst": {
            if (!q.bestWorstMap)
                return null;
            const items = Object.keys(q.bestWorstMap);
            if (!items.length)
                return null;
            const scored = items.map(i => ({ i, sc: scoreBucketLike(a, q.bestWorstMap[i]) }));
            scored.sort((x, y) => y.sc - x.sc);
            return { apply: () => applyRankingAnswer(s, q, scored.map(x => x.i)) };
        }
        case "pairwise": {
            if (!q.pairMaps)
                return null;
            const answers = {};
            for (const [pid, opts] of Object.entries(q.pairMaps)) {
                let bc = "", bs = -Infinity;
                for (const [choice, map] of Object.entries(opts)) {
                    const sc = scoreBucketLike(a, map);
                    if (sc > bs) {
                        bs = sc;
                        bc = choice;
                    }
                }
                if (bc)
                    answers[pid] = bc;
            }
            if (!Object.keys(answers).length)
                return null;
            return { apply: () => applyPairwiseAnswer(s, q, answers) };
        }
        case "dual_axis": {
            if (!q.dualAxisMap)
                return null;
            const tmpl = a.nodes[q.dualAxisMap.node];
            if (!tmpl || tmpl.kind !== "continuous")
                return null;
            const x = (tmpl.pos - 1) / 4;
            const y = tmpl.sal / 3;
            return { apply: () => applyDualAxisAnswer(s, q, { x, y }) };
        }
        case "priority_sort": {
            // Pre-existing gap: harness.ts also has no priority_sort case. Without
            // this, Q93 (priority_sort opener, always asked first) and Q103 (the new
            // salience screener) contribute no evidence in simulations, silently
            // invalidating their baseline measurement. Route by archetype sal on the
            // item's dominant node; for items with explicit pos evidence, invert
            // direction to opposeHigh when the archetype's pos lands on the far pole.
            if (!q.rankingMap)
                return null;
            const items = Object.keys(q.rankingMap);
            if (!items.length)
                return null;
            const placements = {
                supportHigh: [],
                supportMid: [],
                neutral: [],
                opposeHigh: [],
            };
            for (const item of items) {
                const evidence = q.rankingMap[item];
                // Pick the dominant node (first one listed in either branch).
                let tmpl = null;
                let posMatch = 1; // 1 = match or no pos evidence, -1 = opposing pole
                if (evidence?.continuous) {
                    for (const [nid, e] of Object.entries(evidence.continuous)) {
                        const t = a.nodes[nid];
                        if (!t || t.kind !== "continuous")
                            continue;
                        tmpl = t;
                        if (e?.pos) {
                            // evidence.pos[template.pos-1] is high if pole matches, low if
                            // opposing. Use 0.25 as neutral threshold (uniform=0.20).
                            const matchScore = e.pos[t.pos - 1] ?? 0.2;
                            if (matchScore < 0.10)
                                posMatch = -1;
                            else if (matchScore > 0.25)
                                posMatch = 1;
                            else
                                posMatch = 0;
                        }
                        break;
                    }
                }
                if (!tmpl && evidence?.categorical) {
                    for (const [nid, _dist] of Object.entries(evidence.categorical)) {
                        const t = a.nodes[nid];
                        if (!t || t.kind !== "categorical")
                            continue;
                        tmpl = t;
                        break;
                    }
                }
                if (!tmpl || typeof tmpl.sal !== "number") {
                    placements.neutral.push(item);
                    continue;
                }
                if (posMatch < 0 && tmpl.sal >= 2) {
                    placements.opposeHigh.push(item);
                }
                else if (posMatch < 0) {
                    placements.neutral.push(item);
                }
                else if (tmpl.sal >= 3) {
                    placements.supportHigh.push(item);
                }
                else if (tmpl.sal >= 2) {
                    placements.supportMid.push(item);
                }
                else {
                    placements.neutral.push(item);
                }
            }
            return { apply: () => applyPrioritySort(s, q, placements, items) };
        }
        default: return null;
    }
}
// Expected salience from a salience dist [p0, p1, p2, p3] over {0, 1, 2, 3}.
function eSal(dist) {
    return dist[0] * 0 + dist[1] * 1 + dist[2] * 2 + dist[3] * 3;
}
// Identify which nodes a question's evidence maps touch for salience.
// A node is "salience-touched" if the question, under any answer branch, sets
// a `sal` vector on that node.
function salienceTouchedNodes(q) {
    const touched = new Set();
    const scan = (obj) => {
        if (!obj)
            return;
        if (obj.continuous) {
            for (const [nodeId, upd] of Object.entries(obj.continuous)) {
                if (upd?.sal)
                    touched.add(nodeId);
            }
        }
        if (obj.categorical) {
            for (const [nodeId, upd] of Object.entries(obj.categorical)) {
                if (upd?.sal)
                    touched.add(nodeId);
            }
        }
    };
    if (q.optionEvidence)
        for (const v of Object.values(q.optionEvidence))
            scan(v);
    if (q.sliderMap)
        for (const v of Object.values(q.sliderMap))
            scan(v);
    if (q.allocationMap)
        for (const v of Object.values(q.allocationMap))
            scan(v);
    if (q.rankingMap)
        for (const v of Object.values(q.rankingMap))
            scan(v);
    if (q.bestWorstMap)
        for (const v of Object.values(q.bestWorstMap))
            scan(v);
    if (q.pairMaps)
        for (const opts of Object.values(q.pairMaps))
            for (const v of Object.values(opts))
                scan(v);
    if (q.dualAxisMap)
        touched.add(q.dualAxisMap.node);
    return touched;
}
function runSim(target, archetypes, questions, checkpoints, noiseSigma, seed) {
    resetSimilarityCache();
    const rng = createRng(seed);
    const profile = noiseSigma > 0 ? jitterArchetype(target, noiseSigma, rng) : target;
    const active = archetypes.filter(a => a.active !== false);
    const maxK = Math.max(...checkpoints);
    const state = createInitialState();
    const answered = new Set();
    const touchCounts = {};
    for (const n of [...CONTINUOUS_NODES, ...CATEGORICAL_NODES])
        touchCounts[n] = 0;
    const snaps = [];
    let qi = 0;
    for (let i = 0; i < maxK; i++) {
        const avail = questions.filter(q => !answered.has(q.id) && q.touchProfile.length > 0 && isQuestionEligible(state, q));
        const nextQ = selectNextQuestion(state, avail, active);
        if (!nextQ)
            break;
        const touched = salienceTouchedNodes(nextQ);
        const ans = genAnswer(profile, nextQ, state);
        if (ans) {
            ans.apply();
            for (const n of touched) {
                if (touchCounts[n] !== undefined)
                    touchCounts[n]++;
            }
            // update distances lightly for selector stability (score without caching overhead)
            for (const a of active) {
                state.archetypeDistances[a.id] = archetypeDistance(state, a);
            }
            answered.add(nextQ.id);
            qi++;
        }
        else {
            answered.add(nextQ.id);
        }
        if (checkpoints.includes(qi)) {
            const salSnap = {};
            for (const n of CONTINUOUS_NODES)
                salSnap[n] = [...state.continuous[n].salDist];
            for (const n of CATEGORICAL_NODES)
                salSnap[n] = [...state.categorical[n].salDist];
            snaps.push({ kQ: qi, sal: salSnap });
        }
    }
    return { targetId: target.id, target, snapshots: snaps, salienceTouchCounts: touchCounts, questionsAsked: qi };
}
function aggregateCheckpoint(sims, checkpointK) {
    const obs = [];
    const bucketTouches = {
        0: { sum: 0, n: 0, ruledOut: 0 },
        1: { sum: 0, n: 0, ruledOut: 0 },
        2: { sum: 0, n: 0, ruledOut: 0 },
        3: { sum: 0, n: 0, ruledOut: 0 },
    };
    for (const sim of sims) {
        const snap = sim.snapshots.find(s => s.kQ === checkpointK);
        if (!snap)
            continue;
        for (const n of [...CONTINUOUS_NODES, ...CATEGORICAL_NODES]) {
            const tmpl = sim.target.nodes[n];
            if (!tmpl || typeof tmpl.sal !== "number")
                continue;
            const targetSal = tmpl.sal;
            const d = snap.sal[n];
            const e = eSal(d);
            const o = {
                targetId: sim.targetId,
                node: n,
                targetSal,
                eSal: e,
                p0: d[0] ?? 0,
                p3: d[3] ?? 0,
                touches: sim.salienceTouchCounts[n] ?? 0,
            };
            obs.push(o);
            const b = bucketTouches[targetSal];
            if (b) {
                b.sum += o.touches;
                b.n++;
                if (e < 0.5)
                    b.ruledOut++;
            }
        }
    }
    return { obs, touchCountsByBucket: bucketTouches };
}
function summarize(values) {
    if (values.length === 0)
        return { n: 0, mean: 0, p5: 0, p50: 0, p95: 0, min: 0, max: 0 };
    const sorted = [...values].sort((a, b) => a - b);
    const q = (p) => sorted[Math.max(0, Math.min(sorted.length - 1, Math.floor(p * sorted.length)))];
    const mean = sorted.reduce((a, b) => a + b, 0) / sorted.length;
    return { n: sorted.length, mean, p5: q(0.05), p50: q(0.50), p95: q(0.95), min: sorted[0], max: sorted[sorted.length - 1] };
}
// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
    const args = process.argv.slice(2);
    const nArg = args.find(a => a.startsWith("--n="));
    const N = nArg ? parseInt(nArg.slice(4), 10) : 5000;
    const noiseSigma = 0.30;
    const checkpoints = [12, 20, 30];
    const active = ARCHETYPES.filter(a => a.active !== false);
    const questions = REPRESENTATIVE_QUESTIONS;
    console.log(`Running ${N} realistic sims (σ=${noiseSigma}, max Q=${Math.max(...checkpoints)})`);
    const t0 = Date.now();
    const sims = [];
    const rngMaster = createRng(1);
    for (let i = 0; i < N; i++) {
        const targetIdx = Math.floor(rngMaster() * active.length);
        const target = active[targetIdx];
        const seed = Math.floor(rngMaster() * 2 ** 31);
        const res = runSim(target, ARCHETYPES, questions, checkpoints, noiseSigma, seed);
        sims.push(res);
        if ((i + 1) % 500 === 0)
            console.log(`  ${i + 1}/${N} (${(Date.now() - t0) / 1000 | 0}s)`);
    }
    const elapsed = (Date.now() - t0) / 1000;
    console.log(`Done in ${elapsed.toFixed(1)}s`);
    // Aggregate at each checkpoint
    const perK = checkpoints.map(k => ({ k, ...aggregateCheckpoint(sims, k) }));
    // Touch counts within the full maxK window (same for all checkpoints since we track cumulatively
    // — actually touch counts are across the full run; for the 12-Q check we need a separate count)
    // Re-run the touch bookkeeping to freeze counts at k=12 specifically.
    // Simpler: rerun simulations but capture touch counts per checkpoint too.
    // Actually redo: capture per-checkpoint touch counts.
    // --- write report ---
    const lines = [];
    lines.push("# Bayesian salience-reach diagnostic — can we reach sal≈0 in 12 questions?");
    lines.push("");
    lines.push(`Generated: ${new Date().toISOString()}`);
    lines.push("");
    lines.push(`**Setup:** ${N} Monte Carlo sims, archetypes sampled uniformly from 118 active, answers jittered at σ=${noiseSigma}. Bayesian adaptive selector, capped at ${Math.max(...checkpoints)} questions. Checkpoints at Q=${checkpoints.join(", ")}.`);
    lines.push("");
    lines.push(`**Context for "reach zero salience":** an ideal ruling-out engine would, on a node where target.sal=0, drive the observed E[salDist] toward 0 and put posterior mass on the "none" bucket. Two thresholds measured:`);
    lines.push("- `E[sal] < 0.5` — classifier would bin as \"none\"");
    lines.push("- `salDist[0] ≥ 0.5` — majority posterior mass on the \"doesn't care\" bin");
    lines.push("");
    for (const ck of perK) {
        const byBucket = { 0: [], 1: [], 2: [], 3: [] };
        for (const o of ck.obs) {
            const b = byBucket[o.targetSal];
            if (b)
                b.push(o);
        }
        const totalObs = ck.obs.length;
        if (totalObs === 0) {
            lines.push(`## Checkpoint: Q=${ck.k}`);
            lines.push("");
            lines.push(`*No sim reached Q=${ck.k} — the selector exhausts eligible questions before this many answers.*`);
            lines.push("");
            continue;
        }
        lines.push(`## Checkpoint: Q=${ck.k}`);
        lines.push("");
        lines.push("### Observed E[sal] by target.sal bucket");
        lines.push("");
        lines.push("| target.sal | n | mean | p5 | p50 | p95 | max |");
        lines.push("|-----------:|--:|-----:|---:|----:|----:|----:|");
        for (const tSal of [0, 1, 2, 3]) {
            const s = summarize(byBucket[tSal].map(o => o.eSal));
            lines.push(`| ${tSal} | ${s.n} | ${s.mean.toFixed(2)} | ${s.p5.toFixed(2)} | ${s.p50.toFixed(2)} | ${s.p95.toFixed(2)} | ${s.max.toFixed(2)} |`);
        }
        lines.push("");
        lines.push("### \"Rule out\" fractions on target.sal=0 nodes");
        lines.push("");
        const t0 = byBucket[0];
        const ruleOutEsal = t0.filter(o => o.eSal < 0.5).length;
        const ruleOutP0 = t0.filter(o => o.p0 >= 0.5).length;
        const ruleOutP0Conf = t0.filter(o => o.p0 >= 0.9).length;
        lines.push(`- E[sal] < 0.5: **${ruleOutEsal}/${t0.length} = ${(100 * ruleOutEsal / Math.max(1, t0.length)).toFixed(1)}%**`);
        lines.push(`- salDist[0] ≥ 0.5 (majority "none"): **${ruleOutP0}/${t0.length} = ${(100 * ruleOutP0 / Math.max(1, t0.length)).toFixed(1)}%**`);
        lines.push(`- salDist[0] ≥ 0.9 (confident "none"): **${ruleOutP0Conf}/${t0.length} = ${(100 * ruleOutP0Conf / Math.max(1, t0.length)).toFixed(1)}%**`);
        lines.push("");
        lines.push("### \"Cares a lot\" positive on target.sal=3 nodes");
        lines.push("");
        const t3 = byBucket[3];
        const careEsal = t3.filter(o => o.eSal > 2.5).length;
        const careP3 = t3.filter(o => o.p3 >= 0.5).length;
        const careP3Conf = t3.filter(o => o.p3 >= 0.9).length;
        lines.push(`- E[sal] > 2.5 (classifier "high"): **${careEsal}/${t3.length} = ${(100 * careEsal / Math.max(1, t3.length)).toFixed(1)}%**`);
        lines.push(`- salDist[3] ≥ 0.5 (majority "high"): **${careP3}/${t3.length} = ${(100 * careP3 / Math.max(1, t3.length)).toFixed(1)}%**`);
        lines.push(`- salDist[3] ≥ 0.9 (confident "high"): **${careP3Conf}/${t3.length} = ${(100 * careP3Conf / Math.max(1, t3.length)).toFixed(1)}%**`);
        lines.push("");
    }
    // Touch allocation diagnostic — uses the 12-Q window counts
    // (touchCounts in SimResult is over the full maxK run, NOT per checkpoint.
    // For the "sal=0 node keeps getting asked" question, the 12-Q window is
    // what matters; re-derive by rerunning trimmed to k=12 only.)
    //
    // But since we already ran at maxK=45, rerun a separate pass at maxK=12
    // below to get accurate touch counts within the 12-Q window.
    console.log("Running second pass at max Q=12 to get clean 12-Q touch counts");
    const simsK12 = [];
    const rngM2 = createRng(1);
    for (let i = 0; i < N; i++) {
        const targetIdx = Math.floor(rngM2() * active.length);
        const target = active[targetIdx];
        const seed = Math.floor(rngM2() * 2 ** 31);
        const res = runSim(target, ARCHETYPES, questions, [12], noiseSigma, seed);
        simsK12.push(res);
    }
    // Compute touch counts by target.sal bucket
    const touchByBucket = {
        0: { sum: 0, n: 0, atLeastOne: 0 },
        1: { sum: 0, n: 0, atLeastOne: 0 },
        2: { sum: 0, n: 0, atLeastOne: 0 },
        3: { sum: 0, n: 0, atLeastOne: 0 },
    };
    for (const sim of simsK12) {
        for (const n of [...CONTINUOUS_NODES, ...CATEGORICAL_NODES]) {
            const tmpl = sim.target.nodes[n];
            if (!tmpl || typeof tmpl.sal !== "number")
                continue;
            const b = touchByBucket[tmpl.sal];
            if (!b)
                continue;
            const t = sim.salienceTouchCounts[n] ?? 0;
            b.sum += t;
            b.n++;
            if (t > 0)
                b.atLeastOne++;
        }
    }
    lines.push("## Touch allocation in the first 12 questions");
    lines.push("");
    lines.push("For each (sim, node), count how many of the 12 selected questions had salience-evidence maps that touched this node. Grouped by target.sal: if the selector correctly allocates touches, target.sal=0 nodes should receive fewer salience touches than target.sal=3 nodes (or, if they do get touched, the evidence should concentrate salDist[0]).");
    lines.push("");
    lines.push("| target.sal | n (node-sims) | mean sal-touches in 12Q | % touched at least once |");
    lines.push("|-----------:|--------------:|------------------------:|------------------------:|");
    for (const tSal of [0, 1, 2, 3]) {
        const b = touchByBucket[tSal];
        const mean = b.n > 0 ? b.sum / b.n : 0;
        const pct = b.n > 0 ? 100 * b.atLeastOne / b.n : 0;
        lines.push(`| ${tSal} | ${b.n} | ${mean.toFixed(2)} | ${pct.toFixed(1)}% |`);
    }
    lines.push("");
    // Verdict section
    const ck12 = perK.find(p => p.k === 12);
    const t0_12 = ck12.obs.filter(o => o.targetSal === 0);
    const t3_12 = ck12.obs.filter(o => o.targetSal === 3);
    const eMean0 = t0_12.reduce((a, b) => a + b.eSal, 0) / Math.max(1, t0_12.length);
    const eMean3 = t3_12.reduce((a, b) => a + b.eSal, 0) / Math.max(1, t3_12.length);
    const ruleOut12 = t0_12.filter(o => o.eSal < 0.5).length;
    const conf12 = t0_12.filter(o => o.p0 >= 0.9).length;
    lines.push("## Verdict");
    lines.push("");
    lines.push(`At Q=12 under realistic σ=${noiseSigma} noise:`);
    lines.push("");
    lines.push(`- **target.sal=0 bucket observed E[sal] mean: ${eMean0.toFixed(2)}** (need ≤0.5 to call it "ruled out")`);
    lines.push(`- **target.sal=3 bucket observed E[sal] mean: ${eMean3.toFixed(2)}** (need ≥2.5 to call it "high")`);
    lines.push(`- Fraction of sal=0 nodes ruled out (E[sal]<0.5): **${(100 * ruleOut12 / Math.max(1, t0_12.length)).toFixed(1)}%**`);
    lines.push(`- Fraction with confident posterior mass (salDist[0]≥0.9): **${(100 * conf12 / Math.max(1, t0_12.length)).toFixed(1)}%**`);
    lines.push("");
    lines.push("**Interpretation.** If ruling-out rate at Q=12 is well below 100%, Sam's concern is confirmed: the Bayesian selector doesn't gate out sal=0 nodes within the first 12 questions. The selector will keep consuming question budget on nodes the respondent doesn't care about. A dedicated pre-quiz salience screener (Q76-style) would be the authoring-side fix: ask explicit \"does this kind of issue matter to you?\" questions first, set per-node sal likelihood vectors hard at [0.9, 0.08, 0.02, 0] when the respondent says no, and gate position-question eligibility on the resulting salDist.");
    await fs.writeFile(OUT_PATH, lines.join("\n"), "utf-8");
    console.log(`Wrote ${OUT_PATH}`);
}
main().catch(e => { console.error(e); process.exit(1); });
//# sourceMappingURL=salienceReach12.js.map