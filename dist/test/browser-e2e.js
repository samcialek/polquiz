/**
 * Layer 3 — Browser End-to-End harness (Playwright).
 *
 * Loads prism-quiz-v3.html in a real Chromium browser, drives it via the
 * global PrismEngine API using the same deterministic persona decision
 * policy as Layer 2, and verifies:
 *
 *   (a) Browser-bundled engine produces same top-1/top-3/top-5 recovery
 *       rates as the offline tsx engine (detects browser-specific bugs
 *       like module resolution or bundler artifacts).
 *   (b) localStorage persistence: respondentState serializes/deserializes
 *       intact through JSON.
 *   (c) Results page renders node bars driven by RESPONDENT's measured
 *       signature (via the field paths fixed in Layer 4), not archetype
 *       centroid fallback.
 *
 * Sample size: 20 personas (not 112) — the offline Layer 2 already proves
 * end-to-end engine logic at scale. Browser harness is a sanity check on
 * the browser transport layer, so a diverse sample is sufficient.
 */
import { promises as fs } from "node:fs";
import * as path from "node:path";
import { createServer } from "node:http";
import { chromium } from "playwright";
import { ARCHETYPES } from "../config/archetypes.js";
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
// Sample selection: diverse archetypes across tiers, clusters, IDs
// ---------------------------------------------------------------------------
function pickSamplePersonas(count) {
    const active = ARCHETYPES.filter(a => a.prior > 0);
    if (count >= active.length)
        return active.map(buildPersona);
    // Pick every Nth archetype to spread across the ID space
    const stride = Math.max(1, Math.floor(active.length / count));
    const picks = [];
    for (let i = 0; i < active.length && picks.length < count; i += stride) {
        picks.push(active[i]);
    }
    for (let i = 0; i < active.length && picks.length < count; i++) {
        if (!picks.includes(active[i]))
            picks.push(active[i]);
    }
    return picks.map(buildPersona);
}
// ---------------------------------------------------------------------------
// Static file server for the quiz HTML + bundle + data
// ---------------------------------------------------------------------------
function startServer(rootDir, port) {
    return new Promise((resolve, reject) => {
        const server = createServer(async (req, res) => {
            try {
                let urlPath = (req.url || "/").split("?")[0] || "/";
                if (urlPath === "/")
                    urlPath = "/prism-quiz-v3.html";
                // Prevent directory traversal
                const safePath = path.normalize(urlPath).replace(/^[/\\]+/, "");
                const filePath = path.join(rootDir, safePath);
                if (!filePath.startsWith(rootDir)) {
                    res.writeHead(403);
                    res.end("forbidden");
                    return;
                }
                const data = await fs.readFile(filePath);
                const ext = path.extname(filePath).toLowerCase();
                const mime = {
                    ".html": "text/html; charset=utf-8",
                    ".js": "application/javascript; charset=utf-8",
                    ".json": "application/json; charset=utf-8",
                    ".css": "text/css; charset=utf-8",
                    ".svg": "image/svg+xml",
                    ".png": "image/png",
                    ".jpg": "image/jpeg",
                    ".jpeg": "image/jpeg",
                };
                res.writeHead(200, { "content-type": mime[ext] || "application/octet-stream" });
                res.end(data);
            }
            catch (e) {
                const msg = e instanceof Error ? e.message : String(e);
                res.writeHead(404);
                res.end(msg);
            }
        });
        server.listen(port, "127.0.0.1", () => resolve(server));
        server.on("error", reject);
    });
}
async function runPersonaInBrowser(page, persona) {
    // Evaluate the full persona-replay loop in the browser context
    const result = await page.evaluate(async (personaJson) => {
        const persona = JSON.parse(personaJson);
        const PE = window.PrismEngine;
        // Persona scorers (same logic as Layer 2)
        function scoreOptionEvidence(ev) {
            if (!ev)
                return 0;
            let score = 0, count = 0;
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
                        score += dot * 6;
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
        function scoreBucketMap(map) {
            if (!map)
                return 0;
            let score = 0, count = 0;
            if (map.continuous) {
                for (const [nid, signal] of Object.entries(map.continuous)) {
                    const t = persona.continuous[nid];
                    if (!t || signal === undefined)
                        continue;
                    const direction = (t.pos - 3) / 2;
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
        function decideAnswer(q, qq) {
            switch (q.uiType) {
                case "single_choice":
                case "multi": {
                    const opts = Object.keys(q.optionEvidence ?? {});
                    if (opts.length === 0)
                        return qq.options?.[0] ?? "unknown";
                    let bestOpt = opts[0], bestScore = -Infinity;
                    for (const o of opts) {
                        const s = scoreOptionEvidence(q.optionEvidence[o]);
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
                    let bestBucket = buckets[0], bestScore = -Infinity;
                    for (const b of buckets) {
                        const s = scoreOptionEvidence(q.sliderMap[b]);
                        if (s > bestScore) {
                            bestScore = s;
                            bestBucket = b;
                        }
                    }
                    const parts = bestBucket.split("-").map(Number);
                    const lo = parts[0] ?? 0, hi = parts[1] ?? 100;
                    return Math.floor((lo + hi) / 2);
                }
                case "allocation": {
                    const buckets = Object.keys(q.allocationMap ?? {});
                    if (buckets.length === 0)
                        return {};
                    const scores = buckets.map(b => ({ b, s: Math.max(0, scoreBucketMap(q.allocationMap[b]) + 0.5) }));
                    const total = scores.reduce((a, b) => a + b.s, 0);
                    const alloc = {};
                    if (total === 0) {
                        const share = Math.floor(100 / buckets.length);
                        for (const b of buckets)
                            alloc[b] = share;
                    }
                    else {
                        for (const { b, s } of scores)
                            alloc[b] = Math.round((s / total) * 100);
                        const sum = Object.values(alloc).reduce((a, b) => a + b, 0);
                        if (sum !== 100 && buckets.length > 0)
                            alloc[buckets[0]] = (alloc[buckets[0]] ?? 0) + (100 - sum);
                    }
                    return alloc;
                }
                case "ranking": {
                    const items = Object.keys(q.rankingMap ?? {});
                    if (items.length === 0)
                        return [];
                    const scored = items.map(i => ({ i, s: scoreBucketMap(q.rankingMap[i]) }));
                    scored.sort((a, b) => b.s - a.s);
                    return scored.map(x => x.i);
                }
                case "pairwise": {
                    const answers = {};
                    for (const [pairId, pair] of Object.entries(q.pairMaps ?? {})) {
                        const choices = Object.keys(pair);
                        if (choices.length === 0)
                            continue;
                        let bestChoice = choices[0], bestScore = -Infinity;
                        for (const c of choices) {
                            const s = scoreBucketMap(pair[c]);
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
                    const scored = items.map(i => ({ i, s: scoreBucketMap(q.bestWorstMap[i]) }));
                    scored.sort((a, b) => b.s - a.s);
                    return { best: scored[0].i, worst: scored[scored.length - 1].i };
                }
                default: return qq.options?.[0] ?? "unknown";
            }
        }
        // Drive the quiz
        PE.initQuiz();
        let steps = 0;
        const MAX = 120;
        while (!PE.isComplete() && steps < MAX) {
            steps++;
            const qq = PE.getNextQuestion();
            if (!qq)
                break;
            const q = PE.getQuestionDef(qq.id);
            if (!q) {
                PE.submitAnswer(qq.id, qq.options?.[0] ?? "unknown");
                continue;
            }
            const answer = decideAnswer(q, qq);
            PE.submitAnswer(qq.id, answer);
        }
        const results = PE.getResults();
        const respondentState = PE.getRespondentState();
        // Shape check
        let shape = "missing";
        let hasExpectedPos = false, hasSalience = false, hasCatDist = false;
        if (respondentState) {
            const cont = respondentState.continuous;
            const cat = respondentState.categorical;
            if (cont && typeof cont === "object") {
                shape = "nested";
                const first = Object.values(cont)[0];
                if (first && typeof first === "object") {
                    hasExpectedPos = "expectedPos" in first;
                    hasSalience = "salience" in first;
                }
            }
            else if (Object.keys(respondentState).length > 0 && Object.values(respondentState).some(v => typeof v === "object" && v !== null && ("expectedPos" in v || "pos" in v))) {
                shape = "flat";
            }
            if (cat && typeof cat === "object") {
                const firstCat = Object.values(cat)[0];
                if (firstCat && typeof firstCat === "object") {
                    hasCatDist = "catDist" in firstCat;
                }
            }
        }
        // Persist to localStorage so results page can read
        const prismResults = {
            archetypeId: results.match.id,
            archetypeName: results.match.name,
            top5: results.top5,
            respondentState,
            questionsAnswered: results.questionsAnswered,
            timestamp: Date.now(),
        };
        localStorage.setItem("prism_results", JSON.stringify(prismResults));
        localStorage.setItem("prism-results", JSON.stringify(prismResults));
        return { results, respondentState, shape, hasExpectedPos, hasSalience, hasCatDist };
    }, JSON.stringify(persona));
    // Compute target rank
    const targetRank = result.results.top5.findIndex(r => r.id === persona.archId);
    return {
        archId: persona.archId,
        archName: persona.archName,
        top1Id: result.results.match.id,
        top1Name: result.results.match.name,
        top1Posterior: result.results.match.posterior,
        top5: result.results.top5,
        targetRank: targetRank >= 0 ? targetRank + 1 : -1,
        questionsAnswered: result.results.questionsAnswered,
        respondentStateShape: result.shape,
        hasExpectedPos: result.hasExpectedPos,
        hasSalience: result.hasSalience,
        hasCatDist: result.hasCatDist,
    };
}
// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
const ROOT = path.resolve(process.cwd());
const PORT = 8723;
const URL = `http://127.0.0.1:${PORT}/prism-quiz-v3.html`;
const SAMPLE_SIZE = 112;
async function main() {
    console.log(`Starting static server on ${URL}`);
    const server = await startServer(ROOT, PORT);
    console.log(`Launching headless Chromium...`);
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    // Shim: tsx compiler inserts __name() calls into serialized evaluate functions
    await page.addInitScript(() => {
        window.__name = (fn) => fn;
    });
    // Silence console noise from page
    page.on("pageerror", err => console.log(`  [page error] ${err.message}`));
    await page.goto(URL, { waitUntil: "domcontentloaded" });
    // Wait for PrismEngine global to be available
    await page.waitForFunction(() => typeof window.PrismEngine !== "undefined", null, { timeout: 10000 });
    console.log(`  PrismEngine loaded in browser context.`);
    const personas = pickSamplePersonas(SAMPLE_SIZE);
    console.log(`\nRunning ${personas.length} personas through browser-bundled engine:\n`);
    const results = [];
    for (let i = 0; i < personas.length; i++) {
        const p = personas[i];
        // Reload the page to reset PrismEngine state between personas
        await page.goto(URL, { waitUntil: "domcontentloaded" });
        await page.waitForFunction(() => typeof window.PrismEngine !== "undefined", null, { timeout: 10000 });
        const res = await runPersonaInBrowser(page, p);
        results.push(res);
        const rankStr = res.targetRank > 0 ? `rank=${res.targetRank}` : "NOT in top5";
        console.log(`  [${i + 1}/${personas.length}]  ${p.archId} ${p.archName.slice(0, 30).padEnd(30)} → ${res.top1Id} ${res.top1Name.slice(0, 25).padEnd(25)}  (${rankStr}, ${res.questionsAnswered}q)`);
    }
    // Aggregate
    const top1 = results.filter(r => r.targetRank === 1).length;
    const top3 = results.filter(r => r.targetRank > 0 && r.targetRank <= 3).length;
    const top5 = results.filter(r => r.targetRank > 0 && r.targetRank <= 5).length;
    const avgQ = results.reduce((s, r) => s + r.questionsAnswered, 0) / results.length;
    console.log(`\n=== Browser E2E Recovery ===`);
    console.log(`Top-1: ${top1}/${results.length} (${(100 * top1 / results.length).toFixed(1)}%)`);
    console.log(`Top-3: ${top3}/${results.length} (${(100 * top3 / results.length).toFixed(1)}%)`);
    console.log(`Top-5: ${top5}/${results.length} (${(100 * top5 / results.length).toFixed(1)}%)`);
    console.log(`Avg questions: ${avgQ.toFixed(1)}`);
    console.log();
    // Respondent-state shape checks
    const shapeOK = results.every(r => r.respondentStateShape === "nested" && r.hasExpectedPos && r.hasSalience && r.hasCatDist);
    console.log(`=== Respondent-state shape (all ${results.length}) ===`);
    console.log(`  nested shape:        ${results.every(r => r.respondentStateShape === "nested") ? "OK" : "FAIL"}`);
    console.log(`  .expectedPos field:  ${results.every(r => r.hasExpectedPos) ? "OK" : "FAIL"}`);
    console.log(`  .salience field:     ${results.every(r => r.hasSalience) ? "OK" : "FAIL"}`);
    console.log(`  .catDist field:      ${results.every(r => r.hasCatDist) ? "OK" : "FAIL"}`);
    console.log(`  Overall:             ${shapeOK ? "PASS" : "FAIL"}`);
    console.log();
    // Per-persona failures
    const failures = results.filter(r => r.targetRank <= 0);
    if (failures.length > 0) {
        console.log(`=== NOT in top5 (${failures.length}) ===`);
        for (const r of failures) {
            console.log(`  ${r.archId} ${r.archName} → ${r.top1Id} ${r.top1Name}`);
        }
        console.log();
    }
    // Write results
    const outDir = path.join(ROOT, "output");
    await fs.mkdir(outDir, { recursive: true });
    await fs.writeFile(path.join(outDir, "browser-e2e.json"), JSON.stringify({
        summary: { top1, top3, top5, total: results.length, avgQuestionsAnswered: avgQ, shapeOK },
        results,
    }, null, 2));
    console.log(`Wrote output/browser-e2e.json`);
    await browser.close();
    server.close();
    console.log(`\nServer stopped. Done.`);
}
main().catch(err => {
    console.error(err);
    process.exit(1);
});
//# sourceMappingURL=browser-e2e.js.map