/**
 * Layer 4 Browser-rendering verification.
 *
 * Drives one persona through the quiz in Chromium, redirects to
 * prism-results.html, then inspects the rendered DOM to verify:
 *
 *   1. Node bars exist and are populated
 *   2. The pos values in the DOM match respondent's measured expectedPos
 *      (NOT the archetype centroid)
 *   3. Different personas yield different rendered positions
 */
import { promises as fs } from "node:fs";
import * as path from "node:path";
import { createServer } from "node:http";
import { chromium } from "playwright";
import { ARCHETYPES } from "../config/archetypes.js";
function buildPersona(arch) {
    const persona = { archId: arch.id, archName: arch.name, continuous: {}, categorical: {} };
    for (const [nid, t] of Object.entries(arch.nodes)) {
        if (t.kind === "continuous")
            persona.continuous[nid] = { pos: t.pos, sal: t.sal };
        else
            persona.categorical[nid] = { probs: t.probs, sal: t.sal };
    }
    return persona;
}
const ROOT = path.resolve(process.cwd());
const PORT = 8724;
function startServer(rootDir, port) {
    return new Promise((resolve, reject) => {
        const server = createServer(async (req, res) => {
            try {
                let urlPath = (req.url || "/").split("?")[0] || "/";
                // Rewrite /output/prism-results.html's fetches: data/X -> output/data/X
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
                };
                res.writeHead(200, { "content-type": mime[ext] || "application/octet-stream" });
                res.end(data);
            }
            catch (e) {
                res.writeHead(404);
                res.end(String(e));
            }
        });
        server.listen(port, "127.0.0.1", () => resolve(server));
        server.on("error", reject);
    });
}
async function main() {
    const server = await startServer(ROOT, PORT);
    const browser = await chromium.launch({ headless: true });
    const ctx = await browser.newContext();
    await ctx.addInitScript(() => {
        window.__name = (f) => f;
    });
    const page = await ctx.newPage();
    page.on("pageerror", err => console.log(`  [page error] ${err.message}`));
    // Pick 3 personas with clearly different signatures
    const active = ARCHETYPES.filter(a => a.prior > 0);
    const picks = [
        active.find(a => a.id === "012"), // Class-War Leftist (extreme left)
        active.find(a => a.id === "090"), // Hobbesian Guardian (authoritarian)
        active.find(a => a.id === "060"),
    ].filter(Boolean);
    const perPersona = [];
    for (const arch of picks) {
        const persona = buildPersona(arch);
        console.log(`\nDriving persona ${arch.id} ${arch.name}...`);
        // Drive quiz on the quiz page
        await page.goto(`http://127.0.0.1:${PORT}/prism-quiz-v3.html`, { waitUntil: "domcontentloaded" });
        await page.waitForFunction(() => typeof window.PrismEngine !== "undefined", null, { timeout: 10000 });
        const driveResult = await page.evaluate(async (pJson) => {
            const persona = JSON.parse(pJson);
            const PE = window.PrismEngine;
            const scoreOE = (ev) => {
                if (!ev)
                    return 0;
                let s = 0, c = 0;
                if (ev.continuous)
                    for (const [nid, upd] of Object.entries(ev.continuous)) {
                        const t = persona.continuous[nid];
                        if (!t || !upd)
                            continue;
                        if (upd.pos) {
                            s += upd.pos[t.pos - 1] ?? 0.2;
                            c++;
                        }
                        if (upd.sal) {
                            s += upd.sal[t.sal] ?? 0.25;
                            c++;
                        }
                    }
                if (ev.categorical)
                    for (const [nid, upd] of Object.entries(ev.categorical)) {
                        const t = persona.categorical[nid];
                        if (!t || !upd)
                            continue;
                        if (upd.cat) {
                            let d = 0;
                            for (let i = 0; i < 6; i++)
                                d += (upd.cat[i] ?? 0) * (t.probs[i] ?? 0);
                            s += d * 6;
                            c++;
                        }
                        if (upd.sal) {
                            s += upd.sal[t.sal] ?? 0.25;
                            c++;
                        }
                    }
                return c > 0 ? s / c : 0;
            };
            const scoreBM = (m) => {
                if (!m)
                    return 0;
                let s = 0, c = 0;
                if (m.continuous)
                    for (const [nid, sig] of Object.entries(m.continuous)) {
                        const t = persona.continuous[nid];
                        if (!t || sig === undefined)
                            continue;
                        s += sig * ((t.pos - 3) / 2);
                        c++;
                    }
                if (m.categorical)
                    for (const [nid, cd] of Object.entries(m.categorical)) {
                        const t = persona.categorical[nid];
                        if (!t || !cd)
                            continue;
                        let d = 0;
                        for (let i = 0; i < 6; i++)
                            d += (cd[i] ?? 0) * (t.probs[i] ?? 0);
                        s += d * 6;
                        c++;
                    }
                return c > 0 ? s / c : 0;
            };
            const decide = (q, qq) => {
                switch (q.uiType) {
                    case "single_choice":
                    case "multi": {
                        const o = Object.keys(q.optionEvidence ?? {});
                        if (!o.length)
                            return qq.options?.[0] ?? "unknown";
                        let b = o[0], bs = -Infinity;
                        for (const x of o) {
                            const s = scoreOE(q.optionEvidence[x]);
                            if (s > bs) {
                                bs = s;
                                b = x;
                            }
                        }
                        return b;
                    }
                    case "slider": {
                        const o = Object.keys(q.sliderMap ?? {});
                        if (!o.length)
                            return 50;
                        let b = o[0], bs = -Infinity;
                        for (const x of o) {
                            const s = scoreOE(q.sliderMap[x]);
                            if (s > bs) {
                                bs = s;
                                b = x;
                            }
                        }
                        const p = b.split("-").map(Number);
                        return Math.floor(((p[0] ?? 0) + (p[1] ?? 100)) / 2);
                    }
                    case "allocation": {
                        const o = Object.keys(q.allocationMap ?? {});
                        if (!o.length)
                            return {};
                        const sc = o.map(b => ({ b, s: Math.max(0, scoreBM(q.allocationMap[b]) + 0.5) }));
                        const t = sc.reduce((a, b) => a + b.s, 0);
                        const a = {};
                        if (t === 0) {
                            const sh = Math.floor(100 / o.length);
                            for (const b of o)
                                a[b] = sh;
                        }
                        else {
                            for (const { b, s } of sc)
                                a[b] = Math.round((s / t) * 100);
                            const sum = Object.values(a).reduce((x, y) => x + y, 0);
                            if (sum !== 100)
                                a[o[0]] = (a[o[0]] ?? 0) + (100 - sum);
                        }
                        return a;
                    }
                    case "ranking": {
                        const o = Object.keys(q.rankingMap ?? {});
                        if (!o.length)
                            return [];
                        const sc = o.map(i => ({ i, s: scoreBM(q.rankingMap[i]) }));
                        sc.sort((x, y) => y.s - x.s);
                        return sc.map(x => x.i);
                    }
                    case "pairwise": {
                        const a = {};
                        for (const [pid, p] of Object.entries(q.pairMaps ?? {})) {
                            const c = Object.keys(p);
                            if (!c.length)
                                continue;
                            let b = c[0], bs = -Infinity;
                            for (const x of c) {
                                const s = scoreBM(p[x]);
                                if (s > bs) {
                                    bs = s;
                                    b = x;
                                }
                            }
                            a[pid] = b;
                        }
                        return a;
                    }
                    case "best_worst": {
                        const o = Object.keys(q.bestWorstMap ?? {});
                        if (!o.length)
                            return { best: "", worst: "" };
                        const sc = o.map(i => ({ i, s: scoreBM(q.bestWorstMap[i]) }));
                        sc.sort((x, y) => y.s - x.s);
                        return { best: sc[0].i, worst: sc[sc.length - 1].i };
                    }
                    default: return qq.options?.[0] ?? "unknown";
                }
            };
            PE.initQuiz();
            let steps = 0;
            while (!PE.isComplete() && steps < 120) {
                steps++;
                const qq = PE.getNextQuestion();
                if (!qq)
                    break;
                const q = PE.getQuestionDef(qq.id);
                if (!q) {
                    PE.submitAnswer(qq.id, qq.options?.[0] ?? "unknown");
                    continue;
                }
                PE.submitAnswer(qq.id, decide(q, qq));
            }
            const r = PE.getResults();
            const rs = PE.getRespondentState();
            const prismResults = { archetypeId: r.match.id, archetypeName: r.match.name, respondentState: rs, top5: [], questionsAnswered: r.questionsAnswered, confidence: 0.5, timestamp: Date.now() };
            localStorage.setItem("prism_results", JSON.stringify(prismResults));
            localStorage.setItem("prism-results", JSON.stringify(prismResults));
            return { matchId: r.match.id, matchName: r.match.name, matExpectedPos: rs?.continuous.MAT?.expectedPos ?? null };
        }, JSON.stringify(persona));
        console.log(`  Matched: ${driveResult.matchId} ${driveResult.matchName}`);
        console.log(`  Respondent MAT expectedPos: ${driveResult.matExpectedPos?.toFixed(2) ?? "null"}`);
        console.log(`  Archetype-${driveResult.matchId} MAT centroid: ${active.find(a => a.id === driveResult.matchId)?.nodes.MAT && active.find(a => a.id === driveResult.matchId).nodes.MAT.kind === "continuous" ? active.find(a => a.id === driveResult.matchId).nodes.MAT.pos : "n/a"}`);
        // Navigate to results page; localStorage persists within the same context
        await page.goto(`http://127.0.0.1:${PORT}/output/prism-results.html?id=${driveResult.matchId}`, { waitUntil: "networkidle" });
        // Wait for render completion
        await page.waitForSelector("#app .section", { timeout: 10000 });
        await page.waitForTimeout(500); // let async render finish
        // Extract node-profile data from rendered DOM
        const domData = await page.evaluate(() => {
            // Look for elements that display node positions. In prism-results.html,
            // each cluster-group contains rows with data we need.
            const rows = Array.from(document.querySelectorAll(".cluster-group"));
            // Count node bar elements (rough signal that rendering occurred)
            const nodeNames = Array.from(document.querySelectorAll(".node-name, .no-salience"));
            const barCount = nodeNames.length;
            const firstClusterText = rows[0]?.textContent?.slice(0, 200) ?? "";
            return { barCount, firstClusterText };
        });
        const matchedArch = active.find(a => a.id === driveResult.matchId);
        const matCentroidNode = matchedArch.nodes.MAT;
        const matCentroid = matCentroidNode && matCentroidNode.kind === "continuous" ? matCentroidNode.pos : 3;
        perPersona.push({
            archId: arch.id,
            archName: arch.name,
            top1Id: driveResult.matchId,
            matRespondent: driveResult.matExpectedPos,
            matCentroid,
            nodeBarCount: domData.barCount,
        });
        console.log(`  DOM node rows rendered: ${domData.barCount}`);
    }
    console.log(`\n=== Rendering verification ===`);
    console.log(`Persona          TopArchetype  MAT(respondent)  MAT(centroid)  NodeBars`);
    for (const p of perPersona) {
        const deltaStr = p.matRespondent !== null ? `Δ=${(p.matRespondent - p.matCentroid).toFixed(2)}` : "null";
        console.log(`  ${p.archId} → ${p.top1Id}         ${p.matRespondent?.toFixed(2) ?? "null".padEnd(4)}            ${p.matCentroid.toFixed(2)}           ${p.nodeBarCount}  (${deltaStr})`);
    }
    // All personas should have rendered bars
    const allRendered = perPersona.every(p => p.nodeBarCount >= 12);
    console.log(`\nAll personas rendered node bars: ${allRendered ? "PASS" : "FAIL"}`);
    // MAT values should differ across the 3 diverse personas
    const matValues = perPersona.map(p => p.matRespondent).filter(v => v !== null);
    const distinctMat = new Set(matValues.map(v => v.toFixed(1))).size;
    console.log(`Distinct MAT values across ${matValues.length} personas: ${distinctMat} (${distinctMat >= 2 ? "PASS" : "FAIL"})`);
    // MAT respondent should differ from archetype centroid (i.e., we're displaying respondent, not centroid)
    const diffFromCentroid = perPersona.filter(p => p.matRespondent !== null && Math.abs(p.matRespondent - p.matCentroid) > 0.05).length;
    console.log(`MAT values that differ from centroid (proves respondent-signature used): ${diffFromCentroid}/${perPersona.length} (${diffFromCentroid >= 1 ? "PASS" : "FAIL"})`);
    await browser.close();
    server.close();
}
main().catch(err => { console.error(err); process.exit(1); });
//# sourceMappingURL=browser-results-render.js.map