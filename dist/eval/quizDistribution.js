/**
 * Quiz distribution diagnostic.
 *
 * Exercises the real browser API (initQuiz → getNextQuestion → submitAnswer
 * → getResults) with three answer-generation strategies:
 *   1. Self-recovery — each archetype answers as itself. Lower bound on
 *      recoverable fraction under the live EIG selector + stop rule.
 *   2. Pole-grid — 48 patterns (ENDS 8 × REALITY 6) built as minimal
 *      "pseudo-archetype" profiles. Shows archetype-space coverage under a
 *      coarse persona generator.
 *   3. Monte Carlo — N random personas drawn as pseudo-archetypes with
 *      uniform pos/sal/cat. Organic reachability distribution.
 *
 * Respondent model is a copy of src/eval/harness.ts:generateAnswer, which
 * scores each option/bucket/ranking item against the archetype template and
 * picks the best. For non-archetype personas we synthesize an archetype-shaped
 * object so the same scorers apply.
 *
 * Answer formats follow src/browser/api.ts:submitAnswer — notably:
 *   - slider: numeric value (midpoint of best-scoring "a-b" bucket)
 *   - best_worst: { best: string[], worst: string[] } (top/bottom N)
 *   - allocation: softmax(score * 2) × 100 with rounding repair
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { initQuiz, getNextQuestion, submitAnswer, isComplete, getResults, getRespondentState, getQuestionDef, } from "../browser/api.js";
import { ARCHETYPES } from "../config/archetypes.js";
import { createRng } from "./rng.js";
// ─── Node ids and cluster assignments ─────────────────────────────────────
const CONT_NODES = [
    "MAT", "CD", "CU", "MOR", "PRO", "COM",
    "ZS", "ONT_H", "ONT_S", "PF", "TRB", "ENG",
];
const CAT_NODES = ["EPS", "AES"];
// ─── Pseudo-archetype builders ────────────────────────────────────────────
// We synthesize an Archetype-shaped object so we can reuse harness scoring.
function pseudoArchetype(continuous, categorical) {
    const nodes = {};
    for (const n of CONT_NODES) {
        const v = continuous[n];
        nodes[n] = { kind: "continuous", pos: v.pos, sal: v.sal };
    }
    for (const n of CAT_NODES) {
        const v = categorical[n];
        const probs = [0, 0, 0, 0, 0, 0];
        probs[v.cat] = 1;
        nodes[n] = { kind: "categorical", probs, sal: v.sal };
    }
    return { id: "persona", name: "persona", tier: "T1", nodes };
}
function personaRandom(rng) {
    const continuous = {};
    for (const n of CONT_NODES) {
        continuous[n] = {
            pos: 1 + Math.floor(rng() * 5),
            sal: Math.floor(rng() * 4),
        };
    }
    const categorical = {};
    for (const n of CAT_NODES) {
        categorical[n] = {
            cat: Math.floor(rng() * 6),
            sal: Math.floor(rng() * 4),
        };
    }
    return pseudoArchetype(continuous, categorical);
}
function personaFromPoleChoice(pc) {
    const continuous = {};
    for (const n of CONT_NODES)
        continuous[n] = { pos: 3, sal: 1 };
    continuous[pc.ends.node] = { pos: pc.ends.pole === "low" ? 1 : 5, sal: 3 };
    continuous[pc.reality.node] = { pos: pc.reality.pole === "low" ? 1 : 5, sal: 3 };
    continuous.PRO = { pos: 4, sal: 2 };
    continuous.PF = { pos: 4, sal: 2 };
    const categorical = {};
    for (const n of CAT_NODES)
        categorical[n] = { cat: 0, sal: 1 };
    return pseudoArchetype(continuous, categorical);
}
// ─── Harness-ported scoring functions ─────────────────────────────────────
function scoreOptionEvidence(a, ev) {
    if (!ev)
        return 1;
    let score = 0, count = 0;
    if (ev.continuous) {
        for (const [nodeId, upd] of Object.entries(ev.continuous)) {
            const t = a.nodes[nodeId];
            if (!t || t.kind !== "continuous")
                continue;
            if (upd?.pos) {
                score += upd.pos[t.pos - 1] ?? 0;
                count++;
            }
            if (upd?.sal) {
                score += (upd.sal[t.sal] ?? 0) * 0.5;
                count += 0.5;
            }
        }
    }
    if (ev.categorical) {
        for (const [nodeId, upd] of Object.entries(ev.categorical)) {
            const t = a.nodes[nodeId];
            if (!t || t.kind !== "categorical")
                continue;
            if (upd?.cat) {
                let dot = 0;
                for (let i = 0; i < 6; i++)
                    dot += (t.probs[i] ?? 0) * (upd.cat[i] ?? 0);
                score += dot;
                count++;
            }
            if (upd?.sal) {
                score += (upd.sal[t.sal] ?? 0) * 0.5;
                count += 0.5;
            }
        }
    }
    return count > 0 ? score / count : 0;
}
function scoreAllocationBucket(a, bucket) {
    let score = 0, count = 0;
    if (bucket.continuous) {
        for (const [nodeId, signal] of Object.entries(bucket.continuous)) {
            const t = a.nodes[nodeId];
            if (!t || t.kind !== "continuous")
                continue;
            score += ((t.pos - 3) / 2) * (signal ?? 0);
            count++;
        }
    }
    if (bucket.categorical) {
        for (const [nodeId, catDist] of Object.entries(bucket.categorical)) {
            const t = a.nodes[nodeId];
            if (!t || t.kind !== "categorical")
                continue;
            let dot = 0;
            for (let i = 0; i < 6; i++)
                dot += (t.probs[i] ?? 0) * (catDist[i] ?? 0);
            score += dot;
            count++;
        }
    }
    return count > 0 ? score / count : 0;
}
// RankingItemMap.continuous is OptionEvidenceContinuous ({pos, sal} arrays),
// NOT a plain number — so score against the evidence at the archetype's
// template.pos / template.sal index (same shape as scoreOptionEvidence).
function scoreRankingItem(a, item) {
    let score = 0, count = 0;
    if (item.continuous) {
        for (const [nodeId, upd] of Object.entries(item.continuous)) {
            const t = a.nodes[nodeId];
            if (!t || t.kind !== "continuous")
                continue;
            if (upd?.pos) {
                score += upd.pos[t.pos - 1] ?? 0;
                count++;
            }
            if (upd?.sal) {
                score += (upd.sal[t.sal] ?? 0) * 0.5;
                count += 0.5;
            }
        }
    }
    if (item.categorical) {
        for (const [nodeId, catDist] of Object.entries(item.categorical)) {
            const t = a.nodes[nodeId];
            if (!t || t.kind !== "categorical")
                continue;
            let dot = 0;
            for (let i = 0; i < 6; i++)
                dot += (t.probs[i] ?? 0) * (catDist[i] ?? 0);
            score += dot;
            count++;
        }
    }
    return count > 0 ? score / count : 0;
}
function scorePairOption(a, map) {
    // Structurally same as AllocationBucketMap.
    return scoreAllocationBucket(a, map);
}
// ─── Answer generators (one per uiType) ───────────────────────────────────
function generateSingleChoice(a, q) {
    if (!q.optionEvidence)
        return null;
    const options = Object.keys(q.optionEvidence);
    if (!options.length)
        return null;
    let best = options[0], bestScore = -Infinity;
    for (const o of options) {
        const s = scoreOptionEvidence(a, q.optionEvidence[o]);
        if (s > bestScore) {
            bestScore = s;
            best = o;
        }
    }
    return best;
}
function generateSlider(a, q) {
    if (!q.sliderMap)
        return null;
    const buckets = Object.keys(q.sliderMap);
    if (!buckets.length)
        return null;
    let best = buckets[0], bestScore = -Infinity;
    for (const b of buckets) {
        const s = scoreOptionEvidence(a, q.sliderMap[b]);
        if (s > bestScore) {
            bestScore = s;
            best = b;
        }
    }
    const parts = best.split("-").map(Number);
    return Math.round(((parts[0] ?? 0) + (parts[1] ?? 100)) / 2);
}
function generateAllocation(a, q) {
    if (!q.allocationMap)
        return null;
    const names = Object.keys(q.allocationMap);
    if (!names.length)
        return null;
    const scores = {};
    for (const n of names)
        scores[n] = scoreAllocationBucket(a, q.allocationMap[n]);
    const minScore = Math.min(...Object.values(scores));
    const shifted = {};
    for (const n of names)
        shifted[n] = Math.exp((scores[n] - minScore) * 2);
    const total = Object.values(shifted).reduce((x, y) => x + y, 0);
    const allocation = {};
    for (const n of names)
        allocation[n] = Math.round((shifted[n] / total) * 100);
    const allocTotal = Object.values(allocation).reduce((x, y) => x + y, 0);
    if (allocTotal !== 100) {
        const maxKey = names.reduce((x, y) => allocation[x] > allocation[y] ? x : y);
        allocation[maxKey] = allocation[maxKey] + (100 - allocTotal);
    }
    return allocation;
}
function generateRanking(a, q) {
    if (!q.rankingMap)
        return null;
    const items = Object.keys(q.rankingMap);
    if (!items.length)
        return null;
    const scored = items.map(i => ({ i, s: scoreRankingItem(a, q.rankingMap[i]) }));
    scored.sort((x, y) => y.s - x.s);
    return scored.map(x => x.i);
}
function generatePairwise(a, q) {
    if (!q.pairMaps)
        return null;
    const answers = {};
    for (const [pid, options] of Object.entries(q.pairMaps)) {
        let best = "", bestScore = -Infinity;
        for (const [choice, map] of Object.entries(options)) {
            const s = scorePairOption(a, map);
            if (s > bestScore) {
                bestScore = s;
                best = choice;
            }
        }
        if (best)
            answers[pid] = best;
    }
    return Object.keys(answers).length ? answers : null;
}
function generateBestWorst(a, q) {
    const map = q.bestWorstMap ?? q.rankingMap;
    if (!map)
        return null;
    const items = Object.keys(map);
    if (!items.length)
        return null;
    const scored = items.map(i => ({ i, s: scoreRankingItem(a, map[i]) }));
    scored.sort((x, y) => y.s - x.s);
    const n = q.bwMaxPicks ?? 1;
    return { best: scored.slice(0, n).map(x => x.i), worst: scored.slice(-n).map(x => x.i) };
}
function generateMulti(a, q) {
    // `multi` uses optionEvidence like single_choice; API treats it via
    // applySingleChoiceAnswer with a single string key.
    return generateSingleChoice(a, q);
}
function generateAnswer(a, q) {
    switch (q.uiType) {
        case "single_choice": return generateSingleChoice(a, q);
        case "slider": return generateSlider(a, q);
        case "allocation": return generateAllocation(a, q);
        case "ranking": return generateRanking(a, q);
        case "pairwise": return generatePairwise(a, q);
        case "best_worst": return generateBestWorst(a, q);
        case "multi": return generateMulti(a, q);
        default: return null;
    }
}
function simulate(persona, label) {
    initQuiz();
    let guard = 0;
    while (!isComplete() && guard < 80) {
        const next = getNextQuestion();
        if (!next)
            break;
        const qDef = getQuestionDef(next.id);
        if (!qDef)
            break;
        const answer = generateAnswer(persona, qDef);
        if (answer === null || answer === undefined)
            break;
        submitAnswer(qDef.id, answer);
        guard++;
    }
    const results = getResults();
    const state = getRespondentState();
    return {
        label,
        topArchetypeId: results.match.id,
        topArchetypeName: results.match.name,
        top3: results.top3.map(r => ({ id: r.id, name: r.name, distance: r.distance })),
        questionsAnswered: results.questionsAnswered,
        stopReason: results.questionsAnswered >= 40 ? "max_cap" : "convergence",
        finalState: state,
    };
}
// ─── Aggregation ──────────────────────────────────────────────────────────
function aggregate(runs) {
    const winnerCounts = new Map();
    for (const r of runs) {
        const cur = winnerCounts.get(r.topArchetypeId);
        if (cur)
            cur.count++;
        else
            winnerCounts.set(r.topArchetypeId, { id: r.topArchetypeId, name: r.topArchetypeName, count: 1 });
    }
    const winners = [...winnerCounts.values()].sort((a, b) => b.count - a.count);
    const reachedIds = new Set(winners.map(w => w.id));
    const unreached = ARCHETYPES
        .filter(a => a.active !== false && !reachedIds.has(a.id))
        .map(a => ({ id: a.id, name: a.name }));
    const qCounts = runs.map(r => r.questionsAnswered).sort((a, b) => a - b);
    const median = qCounts[Math.floor(qCounts.length / 2)] ?? 0;
    const p90 = qCounts[Math.floor(qCounts.length * 0.9)] ?? 0;
    const mean = qCounts.reduce((a, b) => a + b, 0) / Math.max(qCounts.length, 1);
    const maxCapHits = runs.filter(r => r.stopReason === "max_cap").length;
    const nodeCoverage = {};
    for (const n of CONT_NODES)
        nodeCoverage[n] = { posBins: [0, 0, 0, 0, 0], salBins: [0, 0, 0, 0] };
    for (const r of runs) {
        const fs = r.finalState;
        if (!fs?.continuous)
            continue;
        for (const n of CONT_NODES) {
            const c = fs.continuous[n];
            if (!c)
                continue;
            // browser API's getRespondentState returns {expectedPos, salience, touches}
            const expPos = typeof c.expectedPos === "number" ? c.expectedPos : 3;
            const expSal = typeof c.salience === "number" ? c.salience : 0;
            const p = Math.min(4, Math.max(0, Math.round(expPos - 1)));
            const s = Math.min(3, Math.max(0, Math.round(expSal)));
            nodeCoverage[n].posBins[p]++;
            nodeCoverage[n].salBins[s]++;
        }
    }
    return { winners, unreached, qStats: { mean, median, p90, maxCapHits }, nodeCoverage };
}
// ─── Strategies ───────────────────────────────────────────────────────────
function runSelfRecovery() {
    const active = ARCHETYPES.filter(a => a.active !== false);
    console.log(`[self-recovery] Running ${active.length} archetypes...`);
    const runs = [];
    for (const a of active) {
        const r = simulate(a, `self:${a.id}`);
        runs.push({
            ...r,
            expectedId: a.id,
            recovered1: r.topArchetypeId === a.id,
            recovered3: r.top3.some(x => x.id === a.id),
        });
    }
    return runs;
}
function runPoleGrid() {
    const endsOpts = [];
    for (const n of ["MAT", "CD", "CU", "MOR"])
        for (const p of ["low", "high"])
            endsOpts.push({ node: n, pole: p });
    const realityOpts = [];
    for (const n of ["ZS", "ONT_H", "ONT_S"])
        for (const p of ["low", "high"])
            realityOpts.push({ node: n, pole: p });
    const runs = [];
    console.log(`[pole-grid] Running ${endsOpts.length * realityOpts.length} patterns...`);
    for (const e of endsOpts)
        for (const r of realityOpts) {
            const persona = personaFromPoleChoice({ ends: e, reality: r });
            const pattern = `ENDS=${e.node}_${e.pole} REALITY=${r.node}_${r.pole}`;
            runs.push({ ...simulate(persona, `pole:${pattern}`), pattern });
        }
    return runs;
}
function runMonteCarlo(N, seed) {
    const rng = createRng(seed);
    const runs = [];
    console.log(`[monte-carlo] Running ${N} random personas (seed=${seed})...`);
    for (let i = 0; i < N; i++) {
        const persona = personaRandom(rng);
        runs.push(simulate(persona, `mc:${i}`));
        if ((i + 1) % 200 === 0)
            console.log(`  ${i + 1}/${N}`);
    }
    return runs;
}
// ─── Reports ──────────────────────────────────────────────────────────────
function fmtPct(n, total) {
    return total > 0 ? `${((n / total) * 100).toFixed(1)}%` : "—";
}
function writeMarkdown(path, content) {
    writeFileSync(path, content, "utf-8");
    console.log(`  wrote ${path}`);
}
function selfRecoveryReport(runs) {
    const n = runs.length;
    const top1 = runs.filter(r => r.recovered1).length;
    const top3 = runs.filter(r => r.recovered3).length;
    const attractors = new Map();
    for (const r of runs) {
        if (!r.recovered1) {
            const cur = attractors.get(r.topArchetypeId);
            if (cur) {
                cur.count++;
                cur.victims.push(r.expectedId);
            }
            else
                attractors.set(r.topArchetypeId, { count: 1, name: r.topArchetypeName, victims: [r.expectedId] });
        }
    }
    const sorted = [...attractors.entries()].sort((a, b) => b[1].count - a[1].count);
    let md = `# Strategy 1: Self-Recovery\n\n`;
    md += `Each active archetype was given its own signature and answered the live quiz (browser API, EIG selector). Top-1 = returned as winner.\n\n`;
    md += `## Aggregate\n- Top-1 recovery: ${top1}/${n} (${fmtPct(top1, n)})\n- Top-3 recovery: ${top3}/${n} (${fmtPct(top3, n)})\n\n`;
    md += `## Attractors\n\n| Attractor | Name | Victim count | Example victims |\n|---|---|---|---|\n`;
    for (const [id, a] of sorted.slice(0, 20)) {
        md += `| ${id} | ${a.name} | ${a.count} | ${a.victims.slice(0, 5).join(", ")}${a.victims.length > 5 ? "..." : ""} |\n`;
    }
    md += `\n## Misses\n\n| Expected | Got | Got name |\n|---|---|---|\n`;
    for (const r of runs.filter(r => !r.recovered1).sort((a, b) => a.expectedId.localeCompare(b.expectedId))) {
        md += `| ${r.expectedId} | ${r.topArchetypeId} | ${r.topArchetypeName} |\n`;
    }
    return md;
}
function distributionReport(title, runs, agg) {
    let md = `# ${title}\n\nTotal runs: ${runs.length}\n\n`;
    md += `## Question-count distribution\n`;
    md += `- mean: ${agg.qStats.mean.toFixed(1)}\n- median: ${agg.qStats.median}\n- p90: ${agg.qStats.p90}\n- hit max cap (40): ${agg.qStats.maxCapHits} (${fmtPct(agg.qStats.maxCapHits, runs.length)})\n\n`;
    md += `## Archetype distribution\n`;
    md += `- distinct winners: ${agg.winners.length} / ${ARCHETYPES.filter(a => a.active !== false).length}\n`;
    md += `- top 20:\n\n| Rank | ID | Name | Count | Share |\n|---|---|---|---|---|\n`;
    for (let i = 0; i < Math.min(20, agg.winners.length); i++) {
        const w = agg.winners[i];
        md += `| ${i + 1} | ${w.id} | ${w.name} | ${w.count} | ${fmtPct(w.count, runs.length)} |\n`;
    }
    md += `\n## Unreached (${agg.unreached.length})\n\n`;
    md += agg.unreached.map(u => `- ${u.id} ${u.name}`).join("\n") + "\n\n";
    md += `## Node coverage (row = node, pos/sal bins are % of runs)\n\n`;
    md += `| Node | pos1 | pos2 | pos3 | pos4 | pos5 | sal0 | sal1 | sal2 | sal3 |\n|---|---|---|---|---|---|---|---|---|---|\n`;
    for (const n of CONT_NODES) {
        const c = agg.nodeCoverage[n];
        const pt = c.posBins.reduce((a, b) => a + b, 0) || 1;
        const st = c.salBins.reduce((a, b) => a + b, 0) || 1;
        md += `| ${n} | ${c.posBins.map(b => fmtPct(b, pt)).join(" | ")} | ${c.salBins.map(b => fmtPct(b, st)).join(" | ")} |\n`;
    }
    return md;
}
// ─── Main ────────────────────────────────────────────────────────────────
async function main() {
    const outDir = join(process.cwd(), "results", "quiz-distribution");
    mkdirSync(outDir, { recursive: true });
    mkdirSync(join(outDir, "raw"), { recursive: true });
    console.log("\n=== Strategy 1: Self-Recovery ===");
    const selfRuns = runSelfRecovery();
    writeMarkdown(join(outDir, "self-recovery.md"), selfRecoveryReport(selfRuns));
    writeFileSync(join(outDir, "raw", "self-recovery.json"), JSON.stringify(selfRuns, null, 2));
    console.log("\n=== Strategy 2: Pole Grid ===");
    const poleRuns = runPoleGrid();
    writeMarkdown(join(outDir, "pole-grid.md"), distributionReport("Strategy 2: Pole Grid", poleRuns, aggregate(poleRuns)));
    writeFileSync(join(outDir, "raw", "pole-grid.json"), JSON.stringify(poleRuns, null, 2));
    console.log("\n=== Strategy 3: Monte Carlo (2000) ===");
    const mcRuns = runMonteCarlo(2000, 20260420);
    const mcAgg = aggregate(mcRuns);
    writeMarkdown(join(outDir, "monte-carlo.md"), distributionReport("Strategy 3: Monte Carlo (2000 runs)", mcRuns, mcAgg));
    writeFileSync(join(outDir, "raw", "monte-carlo.json"), JSON.stringify(mcRuns, null, 2));
    const selfTop1 = selfRuns.filter(r => r.recovered1).length;
    const summary = `# Quiz Distribution — Summary\n\n` +
        `- Self-recovery top-1: ${selfTop1}/${selfRuns.length} (${fmtPct(selfTop1, selfRuns.length)})\n` +
        `- Pole grid: ${poleRuns.length} runs, ${aggregate(poleRuns).winners.length} distinct winners\n` +
        `- Monte Carlo (2000 runs): ${mcAgg.winners.length} distinct winners, ${mcAgg.unreached.length} unreached\n` +
        `- MC question count — mean ${mcAgg.qStats.mean.toFixed(1)}, median ${mcAgg.qStats.median}, p90 ${mcAgg.qStats.p90}, hit-cap ${fmtPct(mcAgg.qStats.maxCapHits, mcRuns.length)}\n\n` +
        `Reports:\n- [self-recovery.md](self-recovery.md)\n- [pole-grid.md](pole-grid.md)\n- [monte-carlo.md](monte-carlo.md)\n`;
    writeMarkdown(join(outDir, "summary.md"), summary);
    console.log("\n=== Done ===\n" + summary);
}
main().catch(err => { console.error(err); process.exit(1); });
//# sourceMappingURL=quizDistribution.js.map