/**
 * Smoke test: verify the full quiz → demographics → results page flow works.
 * Checks that prism-results.html at root loads, fetches data from
 * output/live-data/, and renders the archetype identity section.
 */
import { promises as fs } from "node:fs";
import * as path from "node:path";
import { createServer } from "node:http";
import { chromium } from "playwright";
import { ARCHETYPES } from "../config/archetypes.js";
function buildPersona(arch) {
    const p = { archId: arch.id, archName: arch.name, continuous: {}, categorical: {} };
    for (const [nid, t] of Object.entries(arch.nodes)) {
        if (t.kind === "continuous")
            p.continuous[nid] = { pos: t.pos, sal: t.sal };
        else
            p.categorical[nid] = { probs: t.probs, sal: t.sal };
    }
    return p;
}
const ROOT = path.resolve(process.cwd());
const PORT = 8727;
function startServer(rootDir, port) {
    return new Promise((resolve, reject) => {
        const server = createServer(async (req, res) => {
            try {
                let urlPath = (req.url || "/").split("?")[0] || "/";
                if (urlPath === "/")
                    urlPath = "/prism-quiz-v3.html";
                const safePath = path.normalize(urlPath).replace(/^[/\\]+/, "");
                const filePath = path.join(rootDir, safePath);
                if (!filePath.startsWith(rootDir)) {
                    res.writeHead(403);
                    res.end("forbidden");
                    return;
                }
                const data = await fs.readFile(filePath);
                const ext = path.extname(filePath).toLowerCase();
                const mime = { ".html": "text/html; charset=utf-8", ".js": "application/javascript; charset=utf-8", ".json": "application/json; charset=utf-8", ".css": "text/css; charset=utf-8" };
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
    await ctx.addInitScript(() => { window.__name = (f) => f; });
    const page = await ctx.newPage();
    const errors = [];
    page.on("pageerror", err => errors.push(err.message));
    // Step 1: Drive quiz
    const arch = ARCHETYPES.find(a => a.id === "012");
    const persona = buildPersona(arch);
    console.log(`Driving persona ${arch.id} ${arch.name} through quiz...`);
    await page.goto(`http://127.0.0.1:${PORT}/prism-quiz-v3.html`, { waitUntil: "domcontentloaded" });
    await page.waitForFunction(() => typeof window.PrismEngine !== "undefined", null, { timeout: 10000 });
    await page.evaluate((pJson) => {
        const persona = JSON.parse(pJson);
        const PE = window.PrismEngine;
        const scoreOE = (ev) => { if (!ev)
            return 0; let s = 0, c = 0; if (ev.continuous)
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
            } if (ev.categorical)
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
            } return c > 0 ? s / c : 0; };
        const scoreBM = (m) => { if (!m)
            return 0; let s = 0, c = 0; if (m.continuous)
            for (const [nid, sig] of Object.entries(m.continuous)) {
                const t = persona.continuous[nid];
                if (!t || sig === undefined)
                    continue;
                s += sig * ((t.pos - 3) / 2);
                c++;
            } if (m.categorical)
            for (const [nid, cd] of Object.entries(m.categorical)) {
                const t = persona.categorical[nid];
                if (!t || !cd)
                    continue;
                let d = 0;
                for (let i = 0; i < 6; i++)
                    d += (cd[i] ?? 0) * (t.probs[i] ?? 0);
                s += d * 6;
                c++;
            } return c > 0 ? s / c : 0; };
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
        // Simulate demographics submission
        localStorage.setItem('prism-demographics', JSON.stringify({ demo_ethnicity: 'white', demo_gender: 'male' }));
        window.finalizeResults();
    }, JSON.stringify(persona));
    // Step 2: Wait for redirect to prism-results.html
    await page.waitForURL("**/prism-results.html**", { timeout: 10000 });
    console.log(`  Redirected to: ${page.url()}`);
    // Step 3: Wait for results page to render
    await page.waitForSelector("#app .section", { timeout: 15000 });
    console.log(`  Results page rendered.`);
    // Step 4: Verify key sections exist
    const checks = await page.evaluate(() => {
        const app = document.getElementById("app");
        const text = app?.textContent ?? "";
        return {
            hasArchetypeName: text.includes("Class-War Leftist") || text.includes("Archetype"),
            hasElections: text.includes("Presidential Elections") || text.includes("1789"),
            hasNodeProfile: text.includes("Profile") || text.includes("MAT") || text.includes("Material"),
            hasWorldMap: !!document.getElementById("alignment-map"),
            sectionCount: document.querySelectorAll(".section").length,
        };
    });
    console.log(`\n=== Deployment path verification ===`);
    console.log(`  Archetype name rendered:  ${checks.hasArchetypeName ? "OK" : "FAIL"}`);
    console.log(`  Elections section:        ${checks.hasElections ? "OK" : "FAIL"}`);
    console.log(`  Node profile section:     ${checks.hasNodeProfile ? "OK" : "FAIL"}`);
    console.log(`  World map container:      ${checks.hasWorldMap ? "OK" : "FAIL"}`);
    console.log(`  Total sections rendered:  ${checks.sectionCount}`);
    console.log(`  Page errors:              ${errors.length === 0 ? "none" : errors.join("; ")}`);
    const pass = checks.hasArchetypeName && checks.hasElections && checks.hasNodeProfile && checks.sectionCount >= 3;
    console.log(`\nResult: ${pass ? "PASS" : "FAIL"}`);
    await browser.close();
    server.close();
    if (!pass)
        process.exit(1);
}
main().catch(err => { console.error(err); process.exit(1); });
//# sourceMappingURL=deployment-path-smoke.js.map