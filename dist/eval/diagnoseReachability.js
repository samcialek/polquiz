// Reachability Monte Carlo — runs the quiz N times with pure random answers
// and records the min/max/p5/p95 per-node posterior statistics. Answers the
// question: "given every possible quiz-taker, what range of position and
// salience values can the engine actually emit?"
//
// Contrast with the archetype-baseline audit (questionCoverageAudit.ts): that
// one feeds archetype-optimal answers through the quiz and checks whether the
// posterior argmax matches the target. Reachability instead feeds *random*
// answers and records the full reachable output range — a property of the
// engine + question bank, independent of any archetype's answer style.
//
// Output:
//   results/question-audit/reachability-range.json — full dump
//   results/question-audit/reachability-range.md — summary table
//
// Usage:
//   npx tsx src/eval/diagnoseReachability.ts [numRuns]
//   default numRuns = 5000
import fs from "node:fs";
import path from "node:path";
import { ARCHETYPES } from "../config/archetypes.js";
import { REPRESENTATIVE_QUESTIONS } from "../config/questions.representative.js";
import { CONTINUOUS_NODES, CATEGORICAL_NODES } from "../config/nodes.js";
import { EPS_CATEGORIES, AES_CATEGORIES } from "../config/categories.js";
import { applySingleChoiceAnswer, applySliderAnswer, applyAllocationAnswer, applyRankingAnswer, applyPairwiseAnswer, applyDualAxisAnswer, applyPrioritySort, applyBestWorstSalience, } from "../engine/update.js";
import { selectNextQuestion, isQuestionEligible } from "../engine/nextQuestion.js";
import { shouldStop, resetSimilarityCache } from "../engine/stopRule.js";
import { archetypeDistance } from "../engine/archetypeDistance.js";
import { createRng } from "./rng.js";
const OUT_DIR = "results/question-audit";
const DEFAULT_RUNS = 5000;
const MAX_QUESTIONS = 65;
const PROGRESS_EVERY = 250;
// ---------------------------------------------------------------------------
// State init (copy of harness helper to avoid exporting private internals).
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
// ---------------------------------------------------------------------------
// Random-answer generator — dispatch on uiType.
// ---------------------------------------------------------------------------
function pickRandom(arr, rng) {
    return arr[Math.floor(rng() * arr.length)];
}
function shuffle(arr, rng) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}
/** Random priority_sort placement: each item independently sorted into one
 *  of the four buckets with equal prior probability. */
function randomPrioritySortPlacements(items, rng) {
    const result = { supportHigh: [], supportMid: [], neutral: [], opposeHigh: [] };
    const buckets = ["supportHigh", "supportMid", "neutral", "opposeHigh"];
    for (const item of items) {
        const b = buckets[Math.floor(rng() * 4)];
        result[b].push(item);
    }
    return result;
}
/** Dirichlet-ish sample: draw N exponentials, normalise, scale to 100, round
 *  and fix rounding drift to hit 100 exactly. */
function randomAllocation(names, rng) {
    const raw = names.map(() => -Math.log(Math.max(1e-9, rng())));
    const sum = raw.reduce((a, b) => a + b, 0);
    const alloc = {};
    for (let i = 0; i < names.length; i++) {
        alloc[names[i]] = Math.round((raw[i] / sum) * 100);
    }
    const total = Object.values(alloc).reduce((a, b) => a + b, 0);
    if (total !== 100) {
        const keys = Object.keys(alloc);
        alloc[keys[0]] = alloc[keys[0]] + (100 - total);
    }
    return alloc;
}
function applyRandomAnswer(q, s, rng) {
    switch (q.uiType) {
        case "single_choice":
        case "multi":
        case "conjoint": {
            if (!q.optionEvidence)
                return false;
            const keys = Object.keys(q.optionEvidence);
            if (!keys.length)
                return false;
            applySingleChoiceAnswer(s, q, pickRandom(keys, rng));
            return true;
        }
        case "slider": {
            if (!q.sliderMap)
                return false;
            const buckets = Object.keys(q.sliderMap);
            if (!buckets.length)
                return false;
            const bucket = pickRandom(buckets, rng);
            const parts = bucket.split("-").map(Number);
            const lo = parts[0] ?? 0;
            const hi = parts[1] ?? 100;
            // Pick a uniform value inside the bucket, so we exercise the full slider
            // range rather than only midpoints.
            const raw = Math.round(lo + rng() * (hi - lo));
            applySliderAnswer(s, q, raw);
            return true;
        }
        case "allocation": {
            if (!q.allocationMap)
                return false;
            const names = Object.keys(q.allocationMap);
            if (!names.length)
                return false;
            applyAllocationAnswer(s, q, randomAllocation(names, rng));
            return true;
        }
        case "ranking": {
            if (!q.rankingMap)
                return false;
            const items = Object.keys(q.rankingMap);
            if (!items.length)
                return false;
            // Detect OptionEvidenceContinuous shape (pole-priority pattern) to avoid
            // the NaN-poisoning path in applyRankingAnswer. If any continuous slot is
            // an object with .pos rather than a scalar, route as a priority_sort.
            const poleShape = Object.values(q.rankingMap).some(m => {
                const c = m.continuous;
                if (!c)
                    return false;
                return Object.values(c).some(v => v && typeof v === "object" && "pos" in v);
            });
            if (poleShape) {
                applyPrioritySort(s, q, randomPrioritySortPlacements(items, rng), items);
            }
            else {
                applyRankingAnswer(s, q, shuffle(items, rng));
            }
            return true;
        }
        case "best_worst": {
            const items = q.bestWorstMap ? Object.keys(q.bestWorstMap)
                : q.rankingMap ? Object.keys(q.rankingMap)
                    : [];
            if (!items.length)
                return false;
            // Top-N/bottom-N: pick one random best and one random worst. Route
            // through applyBestWorstSalience, the NaN-safe path the live UI uses.
            const shuffled = shuffle(items, rng);
            const best = [shuffled[0]];
            const worst = shuffled.length > 1 ? [shuffled[shuffled.length - 1]] : [];
            applyBestWorstSalience(s, q, best, worst, items);
            return true;
        }
        case "priority_sort": {
            if (!q.rankingMap)
                return false;
            const items = Object.keys(q.rankingMap);
            if (!items.length)
                return false;
            applyPrioritySort(s, q, randomPrioritySortPlacements(items, rng), items);
            return true;
        }
        case "pairwise": {
            if (!q.pairMaps)
                return false;
            const answers = {};
            for (const [pairId, options] of Object.entries(q.pairMaps)) {
                const choices = Object.keys(options);
                if (!choices.length)
                    continue;
                answers[pairId] = pickRandom(choices, rng);
            }
            if (!Object.keys(answers).length)
                return false;
            applyPairwiseAnswer(s, q, answers);
            return true;
        }
        case "dual_axis": {
            if (!q.dualAxisMap)
                return false;
            applyDualAxisAnswer(s, q, { x: rng(), y: rng() });
            return true;
        }
        default:
            return false;
    }
}
// ---------------------------------------------------------------------------
// Summary stats across distributions.
// ---------------------------------------------------------------------------
function expectedContinuousPos(posDist) {
    // posDist is length 5, mapping to positions 1..5.
    let sum = 0;
    let mass = 0;
    for (let i = 0; i < posDist.length; i++) {
        sum += (i + 1) * (posDist[i] ?? 0);
        mass += posDist[i] ?? 0;
    }
    return mass > 0 ? sum / mass : 3;
}
function expectedSalience(salDist) {
    // salDist is length 4, mapping to salience buckets 0..3.
    let sum = 0;
    let mass = 0;
    for (let i = 0; i < salDist.length; i++) {
        sum += i * (salDist[i] ?? 0);
        mass += salDist[i] ?? 0;
    }
    return mass > 0 ? sum / mass : 1.5;
}
function runOne(rng, activeArchetypes) {
    resetSimilarityCache();
    const s = createInitialState();
    const answeredIds = new Set();
    let qa = 0;
    for (let i = 0; i < MAX_QUESTIONS; i++) {
        const available = REPRESENTATIVE_QUESTIONS.filter(q => !answeredIds.has(q.id) && q.touchProfile.length > 0 && isQuestionEligible(s, q));
        const nextQ = selectNextQuestion(s, available, activeArchetypes);
        if (!nextQ)
            break;
        const applied = applyRandomAnswer(nextQ, s, rng);
        answeredIds.add(nextQ.id);
        if (!applied)
            continue;
        qa++;
        // Update archetype distances so the selector + stop rule see current state.
        let best, bestD = Infinity;
        for (const a of activeArchetypes) {
            const d = archetypeDistance(s, a);
            s.archetypeDistances[a.id] = d;
            if (d < bestD) {
                bestD = d;
                best = a.id;
            }
        }
        if (best === s.currentLeader)
            s.consecutiveLeadCount = (s.consecutiveLeadCount ?? 0) + 1;
        else {
            s.currentLeader = best;
            s.consecutiveLeadCount = 1;
        }
        if (qa >= 25 && shouldStop(s, activeArchetypes))
            break;
    }
    const continuous = {};
    for (const nodeId of CONTINUOUS_NODES) {
        continuous[nodeId] = {
            expPos: expectedContinuousPos(s.continuous[nodeId].posDist),
            expSal: expectedSalience(s.continuous[nodeId].salDist),
        };
    }
    const categorical = {};
    for (const nodeId of CATEGORICAL_NODES) {
        categorical[nodeId] = {
            catProbs: [...s.categorical[nodeId].catDist],
            expSal: expectedSalience(s.categorical[nodeId].salDist),
        };
    }
    return { questionsAnswered: qa, continuous, categorical };
}
function percentile(sorted, q) {
    if (!sorted.length)
        return NaN;
    const idx = q * (sorted.length - 1);
    const lo = Math.floor(idx);
    const hi = Math.ceil(idx);
    if (lo === hi)
        return sorted[lo];
    const frac = idx - lo;
    return sorted[lo] * (1 - frac) + sorted[hi] * frac;
}
function summarise(values) {
    const s = [...values].sort((a, b) => a - b);
    const n = s.length;
    const mean = n > 0 ? values.reduce((a, b) => a + b, 0) / n : 0;
    return {
        min: s[0] ?? 0,
        max: s[n - 1] ?? 0,
        p5: percentile(s, 0.05),
        p95: percentile(s, 0.95),
        mean,
    };
}
// ---------------------------------------------------------------------------
// Main.
// ---------------------------------------------------------------------------
function main() {
    const numRuns = Number(process.argv[2] ?? DEFAULT_RUNS);
    if (!Number.isFinite(numRuns) || numRuns < 1) {
        console.error("Invalid run count:", process.argv[2]);
        process.exit(1);
    }
    console.log(`Running reachability Monte Carlo — ${numRuns} runs.`);
    const t0 = Date.now();
    const activeArchetypes = ARCHETYPES.filter(a => a.active !== false);
    const continuousAcc = {};
    for (const n of CONTINUOUS_NODES)
        continuousAcc[n] = { expPos: [], expSal: [] };
    const categoricalAcc = {};
    for (const n of CATEGORICAL_NODES)
        categoricalAcc[n] = { catProbs: [], expSal: [] };
    const qCounts = [];
    for (let i = 0; i < numRuns; i++) {
        const rng = createRng(1 + i);
        const run = runOne(rng, activeArchetypes);
        qCounts.push(run.questionsAnswered);
        for (const n of CONTINUOUS_NODES) {
            continuousAcc[n].expPos.push(run.continuous[n].expPos);
            continuousAcc[n].expSal.push(run.continuous[n].expSal);
        }
        for (const n of CATEGORICAL_NODES) {
            categoricalAcc[n].catProbs.push(run.categorical[n].catProbs);
            categoricalAcc[n].expSal.push(run.categorical[n].expSal);
        }
        if ((i + 1) % PROGRESS_EVERY === 0) {
            const elapsed = (Date.now() - t0) / 1000;
            const rate = (i + 1) / elapsed;
            const etaSec = (numRuns - i - 1) / rate;
            console.log(`  ${i + 1}/${numRuns} (${rate.toFixed(1)} runs/s, ETA ${etaSec.toFixed(0)}s)`);
        }
    }
    const elapsed = (Date.now() - t0) / 1000;
    console.log(`Done — ${elapsed.toFixed(1)}s total.`);
    const qStats = summarise(qCounts);
    // ---- JSON output ----
    const continuousOut = {};
    for (const n of CONTINUOUS_NODES) {
        const a = continuousAcc[n];
        continuousOut[n] = {
            pos: summarise(a.expPos),
            sal: summarise(a.expSal),
        };
    }
    const categoricalOut = {};
    for (const n of CATEGORICAL_NODES) {
        const a = categoricalAcc[n];
        const cats = n === "EPS" ? EPS_CATEGORIES : AES_CATEGORIES;
        const perCat = {};
        for (let c = 0; c < cats.length; c++) {
            const values = a.catProbs.map(v => v[c] ?? 0);
            perCat[cats[c]] = summarise(values);
        }
        categoricalOut[n] = {
            categories: perCat,
            sal: summarise(a.expSal),
        };
    }
    fs.mkdirSync(OUT_DIR, { recursive: true });
    const jsonPath = path.join(OUT_DIR, "reachability-range.json");
    fs.writeFileSync(jsonPath, JSON.stringify({
        numRuns,
        elapsedSeconds: elapsed,
        questionsAnswered: qStats,
        continuous: continuousOut,
        categorical: categoricalOut,
    }, null, 2));
    console.log(`Wrote ${jsonPath}`);
    // ---- Markdown summary ----
    const lines = [];
    lines.push(`# Reachability Range — ${numRuns} Monte Carlo runs\n`);
    lines.push(`Random-answer simulations. For each run the quiz selects questions adaptively and a uniformly random valid answer is applied. Captures the full reachable range of posterior expected values per node.\n`);
    lines.push(`- **Runs**: ${numRuns}`);
    lines.push(`- **Elapsed**: ${elapsed.toFixed(1)}s`);
    lines.push(`- **Questions answered**: mean ${qStats.mean.toFixed(1)}, range [${qStats.min}, ${qStats.max}], p5/p95 [${qStats.p5.toFixed(1)}, ${qStats.p95.toFixed(1)}]\n`);
    lines.push(`## Continuous nodes — E[position] range (scale 1–5)\n`);
    lines.push(`"Position" here is the posterior's expected value, i.e. Σ iᵢ·pᵢ across the 5-bucket posDist. Scale 1–5.\n`);
    lines.push(`| Node | min | p5 | mean | p95 | max | reachable span |`);
    lines.push(`|------|----:|---:|-----:|----:|----:|---------------:|`);
    for (const n of CONTINUOUS_NODES) {
        const s = continuousOut[n].pos;
        const span = s.max - s.min;
        lines.push(`| **${n}** | ${s.min.toFixed(2)} | ${s.p5.toFixed(2)} | ${s.mean.toFixed(2)} | ${s.p95.toFixed(2)} | ${s.max.toFixed(2)} | ${span.toFixed(2)} |`);
    }
    lines.push(`\n## Continuous nodes — E[salience] range (scale 0–3)\n`);
    lines.push(`| Node | min | p5 | mean | p95 | max | reachable span |`);
    lines.push(`|------|----:|---:|-----:|----:|----:|---------------:|`);
    for (const n of CONTINUOUS_NODES) {
        const s = continuousOut[n].sal;
        const span = s.max - s.min;
        lines.push(`| **${n}** | ${s.min.toFixed(2)} | ${s.p5.toFixed(2)} | ${s.mean.toFixed(2)} | ${s.p95.toFixed(2)} | ${s.max.toFixed(2)} | ${span.toFixed(2)} |`);
    }
    for (const n of CATEGORICAL_NODES) {
        const cats = n === "EPS" ? EPS_CATEGORIES : AES_CATEGORIES;
        const catsData = categoricalOut[n];
        lines.push(`\n## ${n} — per-category probability range\n`);
        lines.push(`| Category | min | p5 | mean | p95 | max |`);
        lines.push(`|----------|----:|---:|-----:|----:|----:|`);
        for (const c of cats) {
            const s = catsData.categories[c];
            lines.push(`| \`${c}\` | ${s.min.toFixed(3)} | ${s.p5.toFixed(3)} | ${s.mean.toFixed(3)} | ${s.p95.toFixed(3)} | ${s.max.toFixed(3)} |`);
        }
        const sal = catsData.sal;
        lines.push(`\nE[salience] for ${n}: min ${sal.min.toFixed(2)}, p5 ${sal.p5.toFixed(2)}, mean ${sal.mean.toFixed(2)}, p95 ${sal.p95.toFixed(2)}, max ${sal.max.toFixed(2)}.`);
    }
    const mdPath = path.join(OUT_DIR, "reachability-range.md");
    fs.writeFileSync(mdPath, lines.join("\n") + "\n");
    console.log(`Wrote ${mdPath}`);
}
main();
//# sourceMappingURL=diagnoseReachability.js.map