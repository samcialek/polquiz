import { initQuiz, getNextQuestion, submitAnswer, getRespondentState, applyRatioBoost, getProgress } from "../browser/api.js";
import { FIXED_OPENER } from "../engine/config.js";
import * as fs from "node:fs/promises";
import * as path from "node:path";
const CONTINUOUS_NODES = ["MAT", "CD", "CU", "MOR", "PRO", "COM", "ZS", "ONT_H", "ONT_S", "PF", "TRB", "ENG"];
const CATEGORICAL_NODES = ["EPS", "AES"];
const Q103_ITEM_TO_NODE = {
    mat: "MAT",
    cd: "CD",
    cu: "CU",
    mor: "MOR",
    pro: "PRO",
    com: "COM",
    zs: "ZS",
    ont_h: "ONT_H",
    ont_s: "ONT_S",
    eps: "EPS",
    aes: "AES",
};
function readArg(name, fallback) {
    const prefix = `--${name}=`;
    const hit = process.argv.find((arg) => arg.startsWith(prefix));
    return hit ? hit.slice(prefix.length) : fallback;
}
const RUNS = Number(readArg("runs", "1000"));
const STEPS = Number(readArg("steps", String(FIXED_OPENER.length)));
const SEED = Number(readArg("seed", "20260424"));
const INCLUDE_OPPOSE = process.argv.includes("--include-oppose");
function mulberry32(seed) {
    let t = seed >>> 0;
    return () => {
        t += 0x6D2B79F5;
        let x = Math.imul(t ^ (t >>> 15), 1 | t);
        x ^= x + Math.imul(x ^ (x >>> 7), 61 | x);
        return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
    };
}
function pick(rng, xs) {
    if (!xs.length)
        throw new Error("Cannot pick from empty array");
    return xs[Math.floor(rng() * xs.length)];
}
function shuffle(rng, xs) {
    const out = [...xs];
    for (let i = out.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        [out[i], out[j]] = [out[j], out[i]];
    }
    return out;
}
function randInt(rng, min, max) {
    return min + Math.floor(rng() * (max - min + 1));
}
function addDelta(stat, before, after) {
    const d = after - before;
    stat.n += 1;
    if (Math.abs(d) > 1e-9)
        stat.changed += 1;
    stat.signed += d;
    stat.abs += Math.abs(d);
    stat.min = Math.min(stat.min, d);
    stat.max = Math.max(stat.max, d);
}
function newDeltaStat() {
    return { n: 0, changed: 0, signed: 0, abs: 0, min: Infinity, max: -Infinity };
}
function expectedPos(state, node) {
    return state.continuous[node]?.expectedPos ?? NaN;
}
function salience(state, node) {
    const continuous = state.continuous;
    const categorical = state.categorical;
    return continuous[node]?.salience ?? categorical[node]?.salience ?? NaN;
}
function touches(state, node) {
    const continuous = state.continuous;
    const categorical = state.categorical;
    return continuous[node]?.touches ?? categorical[node]?.touches ?? NaN;
}
function catMax(state, node) {
    const categorical = state.categorical;
    return Math.max(...(categorical[node]?.catDist ?? []));
}
function randomAllocation(rng, buckets) {
    if (!buckets.length)
        return {};
    const raw = buckets.map(() => -Math.log(Math.max(1e-9, rng())));
    const total = raw.reduce((a, b) => a + b, 0) || 1;
    const rounded = raw.map((v) => Math.max(0, Math.floor((v / total) * 100)));
    let remainder = 100 - rounded.reduce((a, b) => a + b, 0);
    while (remainder > 0) {
        rounded[Math.floor(rng() * rounded.length)] += 1;
        remainder -= 1;
    }
    return Object.fromEntries(buckets.map((b, i) => [b, rounded[i]]));
}
function randomPrioritySort(rng, q) {
    const placements = { supportHigh: [], supportMid: [], neutral: [], opposeHigh: [] };
    const items = q.rankingItems ?? [];
    const buckets = INCLUDE_OPPOSE
        ? ["supportHigh", "supportMid", "neutral", "opposeHigh"]
        : ["supportHigh", "supportMid", "neutral"];
    for (const item of items) {
        const bucket = pick(rng, buckets);
        placements[bucket].push(item);
    }
    return placements;
}
function randomAnswer(rng, q) {
    if (q.strengthFollowUp) {
        const ratio = q.strengthFollowUp.kind === "ratio"
            ? pick(rng, [1.5, 2, 3, 4, 10])
            : pick(rng, [1.5, 10]);
        applyRatioBoost(q.id, ratio);
    }
    switch (q.uiType) {
        case "single_choice":
        case "multi":
        case "conjoint":
            return pick(rng, q.options ?? ["a"]);
        case "slider":
            return pick(rng, [10, 30, 50, 70, 90]);
        case "allocation":
            return randomAllocation(rng, q.allocationBuckets ?? []);
        case "ranking":
            return shuffle(rng, q.rankingItems ?? []);
        case "best_worst": {
            const items = shuffle(rng, q.bestWorstItems ?? []);
            return { best: items[0] ?? "missing_best", worst: items[1] ?? "missing_worst" };
        }
        case "priority_sort":
            return randomPrioritySort(rng, q);
        case "dual_axis":
            return { x: rng(), y: rng() };
        case "pairwise": {
            const answer = {};
            for (const pairId of q.pairIds ?? []) {
                answer[pairId] = pick(rng, q.pairOptions?.[pairId] ?? ["a"]);
            }
            return answer;
        }
    }
}
function updateQ103Sanity(answer, stateAfterQ103, counts) {
    const buckets = [
        { name: "supportHigh", items: answer.supportHigh, pass: (s) => s > 2.5 },
        { name: "supportMid", items: answer.supportMid, pass: (s) => s > 1.2 && s < 2.3 },
        { name: "neutral", items: answer.neutral, pass: (s) => s < 0.5 },
        { name: "opposeHigh", items: answer.opposeHigh, pass: (s) => s > 2.5 },
    ];
    for (const bucket of buckets) {
        for (const item of bucket.items) {
            const node = Q103_ITEM_TO_NODE[item];
            if (!node)
                continue;
            const s = salience(stateAfterQ103, node);
            counts[bucket.name].n += 1;
            counts[bucket.name].meanSal += s;
            if (bucket.pass(s))
                counts[bucket.name].pass += 1;
        }
    }
}
function addNodeAggregate(target, state) {
    for (const node of CONTINUOUS_NODES) {
        const row = target[node] ?? { n: 0, expectedPos: 0, salience: 0, touches: 0 };
        row.n += 1;
        row.expectedPos += expectedPos(state, node);
        row.salience += salience(state, node);
        row.touches += touches(state, node);
        target[node] = row;
    }
    for (const node of CATEGORICAL_NODES) {
        const row = target[node] ?? { n: 0, expectedPos: 0, salience: 0, touches: 0 };
        row.n += 1;
        row.expectedPos += catMax(state, node);
        row.salience += salience(state, node);
        row.touches += touches(state, node);
        target[node] = row;
    }
}
const rng = mulberry32(SEED);
const failures = [];
const sequenceCounts = new Map();
const firstRunRows = [];
const q15OntS = newDeltaStat();
const q15Mat = newDeltaStat();
const q84Eps = newDeltaStat();
const q103Sanity = {
    supportHigh: { n: 0, pass: 0, meanSal: 0 },
    supportMid: { n: 0, pass: 0, meanSal: 0 },
    neutral: { n: 0, pass: 0, meanSal: 0 },
    opposeHigh: { n: 0, pass: 0, meanSal: 0 },
};
const after12Aggregate = {};
const expectedPrefix = FIXED_OPENER.slice(0, STEPS);
for (let run = 1; run <= RUNS; run++) {
    initQuiz();
    const served = [];
    for (let step = 1; step <= STEPS; step++) {
        const q = getNextQuestion();
        if (!q) {
            failures.push({ run, step, kind: "missing_question", detail: "getNextQuestion() returned null" });
            break;
        }
        const beforeProgress = getProgress().questionsAnswered;
        const before = getRespondentState();
        const answer = randomAnswer(rng, q);
        submitAnswer(q.id, answer);
        const after = getRespondentState();
        const afterProgress = getProgress().questionsAnswered;
        served.push(q.id);
        if (run === 1)
            firstRunRows.push({ step, id: q.id, promptShort: q.promptShort, uiType: q.uiType });
        if (afterProgress !== beforeProgress + 1) {
            failures.push({
                run,
                step,
                kind: "progress_not_incremented",
                detail: `Q${q.id} moved progress ${beforeProgress} -> ${afterProgress}`,
            });
        }
        if (q.id === 103 && after && typeof answer === "object" && "supportHigh" in answer) {
            updateQ103Sanity(answer, after, q103Sanity);
        }
        if (q.id === 84 && before && after) {
            addDelta(q84Eps, catMax(before, "EPS"), catMax(after, "EPS"));
        }
        if (q.id === 15 && before && after) {
            addDelta(q15OntS, expectedPos(before, "ONT_S"), expectedPos(after, "ONT_S"));
            addDelta(q15Mat, expectedPos(before, "MAT"), expectedPos(after, "MAT"));
        }
        if (step === 12 && after)
            addNodeAggregate(after12Aggregate, after);
    }
    const expected = expectedPrefix.join(",");
    const actual = served.join(",");
    sequenceCounts.set(actual, (sequenceCounts.get(actual) ?? 0) + 1);
    if (actual !== expected) {
        failures.push({
            run,
            step: served.length,
            kind: "sequence_mismatch",
            detail: `expected ${expected}, got ${actual}`,
        });
    }
}
function finishDelta(stat) {
    return {
        n: stat.n,
        changed: stat.changed,
        changedRate: stat.n ? stat.changed / stat.n : 0,
        meanSignedDelta: stat.n ? stat.signed / stat.n : 0,
        meanAbsDelta: stat.n ? stat.abs / stat.n : 0,
        minDelta: Number.isFinite(stat.min) ? stat.min : 0,
        maxDelta: Number.isFinite(stat.max) ? stat.max : 0,
    };
}
function finishQ103(row) {
    return {
        n: row.n,
        pass: row.pass,
        passRate: row.n ? row.pass / row.n : 0,
        meanSalience: row.n ? row.meanSal / row.n : 0,
    };
}
function finishNodeAggregate(row) {
    return {
        meanExpectedPosOrCatMax: row.expectedPos / row.n,
        meanSalience: row.salience / row.n,
        meanTouches: row.touches / row.n,
    };
}
const report = {
    runs: RUNS,
    steps: STEPS,
    seed: SEED,
    includeOpposeBucket: INCLUDE_OPPOSE,
    expectedSequence: expectedPrefix,
    uniqueSequences: Array.from(sequenceCounts.entries()).map(([sequence, count]) => ({ sequence, count })),
    failures: {
        count: failures.length,
        sample: failures.slice(0, 20),
    },
    firstRunRows,
    q103Sanity: {
        supportHigh: finishQ103(q103Sanity.supportHigh),
        supportMid: finishQ103(q103Sanity.supportMid),
        neutral: finishQ103(q103Sanity.neutral),
        opposeHigh: finishQ103(q103Sanity.opposeHigh),
    },
    signalDeltas: {
        q84EpsMaxCatProbability: finishDelta(q84Eps),
        q15OntSExpectedPosition: finishDelta(q15OntS),
        q15MatExpectedPosition: finishDelta(q15Mat),
    },
    after12NodeMeans: Object.fromEntries(Object.entries(after12Aggregate).map(([node, row]) => [node, finishNodeAggregate(row)])),
};
const outDir = path.join("results", "opener-random-sim");
await fs.mkdir(outDir, { recursive: true });
const jsonPath = path.join(outDir, `runs-${RUNS}-steps-${STEPS}-seed-${SEED}${INCLUDE_OPPOSE ? "-oppose" : ""}.json`);
const mdPath = path.join(outDir, `runs-${RUNS}-steps-${STEPS}-seed-${SEED}${INCLUDE_OPPOSE ? "-oppose" : ""}.md`);
await fs.writeFile(jsonPath, JSON.stringify(report, null, 2) + "\n", "utf8");
await fs.writeFile(mdPath, [
    "# Opener Random Simulation",
    "",
    `- runs: ${RUNS}`,
    `- steps: ${STEPS}`,
    `- seed: ${SEED}`,
    `- includeOpposeBucket: ${INCLUDE_OPPOSE}`,
    `- expected sequence: ${expectedPrefix.join(",")}`,
    `- unique sequences: ${report.uniqueSequences.length}`,
    `- failures: ${failures.length}`,
    "",
    "## First Run",
    "",
    ...firstRunRows.map((row) => `- ${row.step}. Q${row.id} ${row.promptShort} [${row.uiType}]`),
    "",
    "## Q103 Sanity",
    "",
    ...Object.entries(report.q103Sanity).map(([bucket, row]) => `- ${bucket}: n=${row.n}, passRate=${(row.passRate * 100).toFixed(1)}%, meanSal=${row.meanSalience.toFixed(3)}`),
    "",
    "## Signal Deltas",
    "",
    ...Object.entries(report.signalDeltas).map(([name, row]) => `- ${name}: changed=${(row.changedRate * 100).toFixed(1)}%, meanAbs=${row.meanAbsDelta.toFixed(3)}, meanSigned=${row.meanSignedDelta.toFixed(3)}`),
    "",
    "## After 12 Mean Touches",
    "",
    Object.entries(report.after12NodeMeans)
        .map(([node, row]) => `${node}:${row.meanTouches.toFixed(1)}`)
        .join(" "),
    "",
].join("\n"), "utf8");
console.log("=== Opener Random Simulation ===");
console.log(`runs=${RUNS} steps=${STEPS} seed=${SEED} includeOppose=${INCLUDE_OPPOSE}`);
console.log(`expected=${expectedPrefix.join(",")}`);
console.log(`uniqueSequences=${report.uniqueSequences.length} failures=${failures.length}`);
console.log("firstRun:");
for (const row of firstRunRows) {
    console.log(`  ${row.step}. Q${row.id} ${row.promptShort} [${row.uiType}]`);
}
console.log("q103Sanity:");
for (const [bucket, row] of Object.entries(report.q103Sanity)) {
    console.log(`  ${bucket}: n=${row.n} passRate=${(row.passRate * 100).toFixed(1)}% meanSal=${row.meanSalience.toFixed(3)}`);
}
console.log("signalDeltas:");
for (const [name, row] of Object.entries(report.signalDeltas)) {
    console.log(`  ${name}: changed=${(row.changedRate * 100).toFixed(1)}% meanAbs=${row.meanAbsDelta.toFixed(3)} meanSigned=${row.meanSignedDelta.toFixed(3)}`);
}
console.log("after12 mean touches:");
console.log(Object.entries(report.after12NodeMeans)
    .map(([node, row]) => `${node}:${row.meanTouches.toFixed(1)}`)
    .join(" "));
console.log(`savedJson=${jsonPath}`);
console.log(`savedMarkdown=${mdPath}`);
console.log("REPORT_JSON");
console.log(JSON.stringify(report, null, 2));
//# sourceMappingURL=simulate-opener-random.js.map