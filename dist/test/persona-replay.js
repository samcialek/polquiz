/**
 * Layer 2 — 115-Persona Replay (offline, deterministic).
 *
 * For each of the 115 archetypes, build a persona from its centroid, drive
 * the quiz through the public API, and answer each question with the option
 * most consistent with the persona's target signature.
 *
 * Outputs:
 *   - output/persona-replay.json (full per-persona results)
 *   - output/persona-replay.md (summary)
 */
import { promises as fs } from "node:fs";
import * as path from "node:path";
import { ARCHETYPES } from "../config/archetypes.js";
import { initQuiz, getNextQuestion, submitAnswer, isComplete, getResults, getQuestionDef, } from "../browser/api.js";
function buildPersona(arch) {
    const persona = { archId: arch.id, archName: arch.name, continuous: {}, categorical: {} };
    for (const [nid, t] of Object.entries(arch.nodes)) {
        if (t.kind === "continuous") {
            persona.continuous[nid] = { pos: t.pos, sal: t.sal };
        }
        else {
            persona.categorical[nid] = { probs: t.probs, sal: t.sal };
        }
    }
    return persona;
}
// ---------------------------------------------------------------------------
// Scoring: how well does an option/bucket/item match the persona's target?
// ---------------------------------------------------------------------------
/** Score an OptionEvidence (distributional likelihood) against persona target. */
function scoreOptionEvidence(ev, persona) {
    if (!ev)
        return 0;
    let score = 0;
    let count = 0;
    if (ev.continuous) {
        for (const [nid, upd] of Object.entries(ev.continuous)) {
            const t = persona.continuous[nid];
            if (!t || !upd)
                continue;
            if (upd.pos) {
                score += upd.pos[t.pos - 1] ?? 0.2;
                count++;
            }
            if (upd.sal) {
                score += upd.sal[t.sal] ?? 0.25;
                count++;
            }
        }
    }
    if (ev.categorical) {
        for (const [nid, upd] of Object.entries(ev.categorical)) {
            const t = persona.categorical[nid];
            if (!t || !upd)
                continue;
            if (upd.cat) {
                let dot = 0;
                for (let i = 0; i < 6; i++)
                    dot += (upd.cat[i] ?? 0) * (t.probs[i] ?? 0);
                score += dot * 6; // scale to comparable magnitude
                count++;
            }
            if (upd.sal) {
                score += upd.sal[t.sal] ?? 0.25;
                count++;
            }
        }
    }
    return count > 0 ? score / count : 0;
}
/** Score a bucket/item map (signal number for continuous) against persona target. */
function scoreBucketMap(map, persona) {
    if (!map)
        return 0;
    let score = 0;
    let count = 0;
    if (map.continuous) {
        for (const [nid, signal] of Object.entries(map.continuous)) {
            const t = persona.continuous[nid];
            if (!t || signal === undefined)
                continue;
            // Signal is a bump direction (+ pushes high, - pushes low).
            // A signal aligned with target direction (pos > 3 wants positive, pos < 3 wants negative) is good.
            const direction = (t.pos - 3) / 2; // -1 to +1
            score += signal * direction;
            count++;
        }
    }
    if (map.categorical) {
        for (const [nid, catDist] of Object.entries(map.categorical)) {
            const t = persona.categorical[nid];
            if (!t || !catDist)
                continue;
            let dot = 0;
            for (let i = 0; i < 6; i++)
                dot += (catDist[i] ?? 0) * (t.probs[i] ?? 0);
            score += dot * 6;
            count++;
        }
    }
    return count > 0 ? score / count : 0;
}
function decideAnswer(q, qq, persona) {
    switch (q.uiType) {
        case "single_choice":
        case "multi": {
            const opts = Object.keys(q.optionEvidence ?? {});
            if (opts.length === 0)
                return qq.options?.[0] ?? "unknown";
            let bestOpt = opts[0];
            let bestScore = -Infinity;
            for (const o of opts) {
                const s = scoreOptionEvidence(q.optionEvidence[o], persona);
                if (s > bestScore) {
                    bestScore = s;
                    bestOpt = o;
                }
            }
            return bestOpt;
        }
        case "slider": {
            const buckets = Object.keys(q.sliderMap ?? {});
            if (buckets.length === 0)
                return 50;
            let bestBucket = buckets[0];
            let bestScore = -Infinity;
            for (const b of buckets) {
                const s = scoreOptionEvidence(q.sliderMap[b], persona);
                if (s > bestScore) {
                    bestScore = s;
                    bestBucket = b;
                }
            }
            const parts = bestBucket.split("-").map(Number);
            const lo = parts[0] ?? 0;
            const hi = parts[1] ?? 100;
            return Math.floor((lo + hi) / 2);
        }
        case "allocation": {
            const buckets = Object.keys(q.allocationMap ?? {});
            if (buckets.length === 0)
                return {};
            const scores = buckets.map(b => ({
                b,
                s: Math.max(0, scoreBucketMap(q.allocationMap[b], persona) + 0.5), // shift to non-negative
            }));
            const total = scores.reduce((a, b) => a + b.s, 0);
            const alloc = {};
            if (total === 0) {
                // fallback: uniform
                const share = Math.floor(100 / buckets.length);
                for (const b of buckets)
                    alloc[b] = share;
            }
            else {
                for (const { b, s } of scores)
                    alloc[b] = Math.round((s / total) * 100);
                // adjust to sum to 100
                const sum = Object.values(alloc).reduce((a, b) => a + b, 0);
                if (sum !== 100 && buckets.length > 0) {
                    alloc[buckets[0]] = (alloc[buckets[0]] ?? 0) + (100 - sum);
                }
            }
            return alloc;
        }
        case "ranking": {
            const items = Object.keys(q.rankingMap ?? {});
            if (items.length === 0)
                return [];
            const scored = items.map(i => ({ i, s: scoreBucketMap(q.rankingMap[i], persona) }));
            scored.sort((a, b) => b.s - a.s);
            return scored.map(x => x.i);
        }
        case "pairwise": {
            const answers = {};
            for (const [pairId, pair] of Object.entries(q.pairMaps ?? {})) {
                const choices = Object.keys(pair);
                if (choices.length === 0)
                    continue;
                let bestChoice = choices[0];
                let bestScore = -Infinity;
                for (const c of choices) {
                    const s = scoreBucketMap(pair[c], persona);
                    if (s > bestScore) {
                        bestScore = s;
                        bestChoice = c;
                    }
                }
                answers[pairId] = bestChoice;
            }
            return answers;
        }
        case "best_worst": {
            const items = Object.keys(q.bestWorstMap ?? {});
            if (items.length === 0)
                return { best: "", worst: "" };
            const scored = items.map(i => ({ i, s: scoreBucketMap(q.bestWorstMap[i], persona) }));
            scored.sort((a, b) => b.s - a.s);
            return { best: scored[0].i, worst: scored[scored.length - 1].i };
        }
        default:
            return qq.options?.[0] ?? "unknown";
    }
}
function runPersona(persona) {
    initQuiz();
    let steps = 0;
    const MAX = 120;
    while (!isComplete() && steps < MAX) {
        steps++;
        const qq = getNextQuestion();
        if (!qq)
            break;
        const q = getQuestionDef(qq.id);
        if (!q) {
            // shouldn't happen but guard
            submitAnswer(qq.id, qq.options?.[0] ?? "unknown");
            continue;
        }
        const answer = decideAnswer(q, qq, persona);
        submitAnswer(qq.id, answer);
    }
    const results = getResults();
    // Compute full posterior ranking to find target rank
    const ranked = results.top5; // only top5 exposed, so compute rank within top5 or -1
    const targetRank = ranked.findIndex(r => r.id === persona.archId);
    const targetInTop5 = targetRank >= 0;
    const targetInTop3 = targetRank >= 0 && targetRank < 3;
    const targetInTop1 = targetRank === 0;
    return {
        archId: persona.archId,
        archName: persona.archName,
        top1Id: results.match.id,
        top1Name: results.match.name,
        top1Posterior: results.match.posterior,
        top3: ranked.slice(0, 3).map(r => ({ id: r.id, name: r.name, posterior: r.posterior })),
        top5: ranked.map(r => ({ id: r.id, name: r.name, posterior: r.posterior })),
        target_in_top1: targetInTop1,
        target_in_top3: targetInTop3,
        target_in_top5: targetInTop5,
        targetRank: targetRank >= 0 ? targetRank + 1 : -1,
        targetPosterior: targetRank >= 0 ? (ranked[targetRank]?.posterior ?? 0) : 0,
        questionsAnswered: results.questionsAnswered,
    };
}
// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
    const active = ARCHETYPES.filter(a => a.prior > 0);
    console.log(`Running ${active.length} personas (one per active archetype)`);
    const results = [];
    let i = 0;
    for (const arch of active) {
        i++;
        const persona = buildPersona(arch);
        const res = runPersona(persona);
        results.push(res);
        if (i % 10 === 0) {
            console.log(`  ... ${i}/${active.length}  latest: ${arch.id} ${arch.name} → top1=${res.top1Id} ${res.top1Name.slice(0, 28)} (${res.top1Posterior.toFixed(3)})  rank=${res.targetRank}`);
        }
    }
    // Aggregate stats
    const top1 = results.filter(r => r.target_in_top1).length;
    const top3 = results.filter(r => r.target_in_top3).length;
    const top5 = results.filter(r => r.target_in_top5).length;
    const avgQ = results.reduce((s, r) => s + r.questionsAnswered, 0) / results.length;
    console.log();
    console.log("=== Recovery Rates ===");
    console.log(`Top-1: ${top1}/${results.length} (${(100 * top1 / results.length).toFixed(1)}%)`);
    console.log(`Top-3: ${top3}/${results.length} (${(100 * top3 / results.length).toFixed(1)}%)`);
    console.log(`Top-5: ${top5}/${results.length} (${(100 * top5 / results.length).toFixed(1)}%)`);
    console.log(`Avg questions answered: ${avgQ.toFixed(1)}`);
    console.log();
    // Per-archetype failures (target not in top5)
    const failures = results.filter(r => !r.target_in_top5);
    console.log(`=== Personas NOT recovered in top-5 (${failures.length}) ===`);
    for (const r of failures.slice(0, 30)) {
        console.log(`  ${r.archId} ${r.archName.padEnd(34)} → got ${r.top1Id} ${r.top1Name.slice(0, 28)}`);
    }
    if (failures.length > 30)
        console.log(`  ... and ${failures.length - 30} more`);
    console.log();
    // Confusion: most-common wrong answers
    const confusionMap = new Map();
    for (const r of results) {
        if (!r.target_in_top1) {
            const key = `${r.archId}:${r.archName} → ${r.top1Id}:${r.top1Name}`;
            confusionMap.set(key, (confusionMap.get(key) ?? 0) + 1);
        }
    }
    const confusionList = [...confusionMap.entries()].sort((a, b) => b[1] - a[1]);
    console.log(`=== Top-1 misassignments (persona → wrong archetype) ===`);
    console.log(`Personas where target was NOT top-1: ${results.length - top1}`);
    console.log(`Examples (first 20):`);
    for (const [pair] of confusionList.slice(0, 20)) {
        console.log(`  ${pair}`);
    }
    console.log();
    // Destination histogram: which archetypes "attract" wrong personas?
    const destCount = new Map();
    for (const r of results) {
        if (!r.target_in_top1) {
            const k = r.top1Id;
            const existing = destCount.get(k);
            if (existing)
                existing.n++;
            else
                destCount.set(k, { id: r.top1Id, name: r.top1Name, n: 1 });
        }
    }
    const destList = [...destCount.values()].sort((a, b) => b.n - a.n);
    console.log("=== Attractor archetypes (where mispredicted personas land) ===");
    for (const d of destList.slice(0, 15)) {
        console.log(`  ${d.id} ${d.name.padEnd(34)} attracts ${d.n} wrong personas`);
    }
    console.log();
    // Write full results
    const outDir = path.join(process.cwd(), "output");
    await fs.mkdir(outDir, { recursive: true });
    await fs.writeFile(path.join(outDir, "persona-replay.json"), JSON.stringify({
        summary: { top1, top3, top5, total: results.length, avgQuestionsAnswered: avgQ },
        results,
        misassignments: confusionList.map(([pair, n]) => ({ pair, n })),
        attractors: destList,
    }, null, 2));
    console.log(`Wrote output/persona-replay.json`);
}
main().catch(err => {
    console.error(err);
    process.exit(1);
});
//# sourceMappingURL=persona-replay.js.map