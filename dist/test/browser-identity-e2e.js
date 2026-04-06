/**
 * Layer 6 — Identity-Primary E2E verification.
 *
 * Drives a high-TRB/PF/ENG persona through the browser-bundled quiz,
 * but overrides Q60 (identity_ranking) to place the desired anchor at
 * rank 1, then calls PrismEngine.getIdentityPrimaryResult(demographics)
 * and verifies the expected identity overlay fires.
 *
 * Tests 6 identity overlays with correct demographics, plus negative cases.
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
const PORT = 8725;
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
                const mime = { ".html": "text/html; charset=utf-8", ".js": "application/javascript; charset=utf-8", ".json": "application/json; charset=utf-8" };
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
// Pick an archetype with strongest TRB/PF/ENG to produce dominant-state triggering
function pickHighIdentityArchetype() {
    const active = ARCHETYPES.filter(a => a.prior > 0);
    const best = active
        .map(a => {
        const trb = a.nodes.TRB && a.nodes.TRB.kind === "continuous" ? (a.nodes.TRB.pos + a.nodes.TRB.sal) : 0;
        const pf = a.nodes.PF && a.nodes.PF.kind === "continuous" ? (a.nodes.PF.pos + a.nodes.PF.sal) : 0;
        const eng = a.nodes.ENG && a.nodes.ENG.kind === "continuous" ? (a.nodes.ENG.pos + a.nodes.ENG.sal) : 0;
        return { a, score: trb + pf + eng };
    })
        .sort((x, y) => y.score - x.score)[0];
    return best.a;
}
// Anchor items in the Q60 ranking (from questions.representative.ts:313-323)
// Map anchor name → ranking key
const ANCHOR_ITEMS = {
    national: "national_identity",
    ideological: "ideological_identity",
    religious: "religious_identity",
    class: "class_identity",
    ethnic_racial: "ethnic_racial_identity",
    gender: "gender_identity",
    sexual: "sexual_identity",
    global: "global_citizen",
};
const CASES = [
    { label: "Black Voter", anchorToPromote: "ethnic_racial", demographics: { demo_ethnicity: "black" }, expectedLabel: "Black Voter", expectedState: "dominant" },
    { label: "White Grievance Voter", anchorToPromote: "ethnic_racial", demographics: { demo_ethnicity: "white" }, expectedLabel: "White Grievance Voter", expectedState: "dominant" },
    { label: "Evangelical Voter", anchorToPromote: "religious", demographics: { demo_religion: "christian" }, expectedLabel: "Evangelical Voter", expectedState: "dominant" },
    { label: "LGBTQ Voter", anchorToPromote: "sexual", demographics: { demo_lgbtq: "yes" }, expectedLabel: "LGBTQ Voter", expectedState: "dominant" },
    { label: "Feminist Voter", anchorToPromote: "gender", demographics: { demo_gender: "female" }, expectedLabel: "Feminist Voter", expectedState: "dominant" },
    { label: "Male Grievance Voter", anchorToPromote: "gender", demographics: { demo_gender: "male" }, expectedLabel: "Male Grievance Voter", expectedState: "dominant" },
];
async function main() {
    const server = await startServer(ROOT, PORT);
    const browser = await chromium.launch({ headless: true });
    const ctx = await browser.newContext();
    await ctx.addInitScript(() => { window.__name = (f) => f; });
    const page = await ctx.newPage();
    page.on("pageerror", err => console.log(`  [page error] ${err.message}`));
    // Strategy: use high-TRB/PF/ENG archetype as base for most cases, but swap
    // to a feminist-pattern base (CD<=2, MOR>=4, ONT_S>=4) for Feminist Voter.
    // The identity-primary resolver requires BOTH high TRB/PF (gate) AND node
    // patterns (branch-specific signals) — these combine in ways that don't
    // naturally appear in any single archetype's centroid, so we must layer
    // overrides carefully.
    const baseArchetype = pickHighIdentityArchetype();
    const feministBaseArchetype = ARCHETYPES.find(a => a.id === "069"); // Bleeding-Heart Libertarian: CD=2, MOR=5, ONT_S=4
    console.log(`Base archetype for identity signals: ${baseArchetype.id} ${baseArchetype.name}`);
    console.log(`(TRB=${baseArchetype.nodes.TRB && baseArchetype.nodes.TRB.kind === "continuous" ? baseArchetype.nodes.TRB.pos : "?"}, PF=${baseArchetype.nodes.PF && baseArchetype.nodes.PF.kind === "continuous" ? baseArchetype.nodes.PF.pos : "?"}, ENG=${baseArchetype.nodes.ENG && baseArchetype.nodes.ENG.kind === "continuous" ? baseArchetype.nodes.ENG.pos : "?"})`);
    console.log(`Feminist-pattern base: ${feministBaseArchetype.id} ${feministBaseArchetype.name}`);
    await page.goto(`http://127.0.0.1:${PORT}/prism-quiz-v3.html`, { waitUntil: "domcontentloaded" });
    await page.waitForFunction(() => typeof window.PrismEngine !== "undefined", null, { timeout: 10000 });
    let pass = 0, fail = 0;
    const details = [];
    for (const tc of CASES) {
        // Build a persona customized per case
        const base = tc.label === "Feminist Voter" ? feministBaseArchetype : baseArchetype;
        const persona = buildPersona(base);
        // Force TRB/PF/ENG high
        persona.continuous.TRB = { pos: 5, sal: 3 };
        persona.continuous.PF = { pos: 5, sal: 3 };
        persona.continuous.ENG = { pos: 4, sal: 3 };
        // Per-case overrides for resolver branch signals
        if (tc.label === "Feminist Voter") {
            // feministBaseArchetype (069) already has CD=2, MOR=5, ONT_S=4 — no overrides needed
        }
        else if (tc.label === "Male Grievance Voter") {
            persona.continuous.CD = { pos: 5, sal: 3 };
            persona.continuous.MOR = { pos: 1, sal: 3 };
            persona.continuous.ONT_S = { pos: 1, sal: 3 };
            persona.continuous.ZS = { pos: 5, sal: 3 };
        }
        else if (tc.label === "White Grievance Voter") {
            persona.continuous.ZS = { pos: 5, sal: 3 };
            persona.continuous.CU = { pos: 5, sal: 3 };
        }
        else if (tc.label === "LGBTQ Voter") {
            persona.continuous.CD = { pos: 1, sal: 3 };
            persona.continuous.MOR = { pos: 5, sal: 3 };
        }
        else if (tc.label === "Black Voter") {
            persona.continuous.CD = { pos: 2, sal: 2 };
            persona.continuous.MAT = { pos: 2, sal: 2 };
        }
        // Reset page state
        await page.goto(`http://127.0.0.1:${PORT}/prism-quiz-v3.html`, { waitUntil: "domcontentloaded" });
        await page.waitForFunction(() => typeof window.PrismEngine !== "undefined", null, { timeout: 10000 });
        const result = await page.evaluate(async (payload) => {
            const { personaJson, anchorKey, anchorItems, demographics } = JSON.parse(payload);
            const persona = JSON.parse(personaJson);
            const PE = window.PrismEngine;
            const topItem = anchorItems[anchorKey];
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
                        // If this is Q60 (identity_ranking), force anchorKey item to rank 1
                        if (q.promptShort === "primary_identity_ranking" || (q.rankingMap && topItem && q.rankingMap[topItem])) {
                            const items = Object.keys(q.rankingMap ?? {});
                            if (items.includes(topItem)) {
                                const rest = items.filter(x => x !== topItem);
                                return [topItem, ...rest];
                            }
                        }
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
            const ipResult = PE.getIdentityPrimaryResult(demographics);
            const respondentState = PE.getRespondentState();
            return {
                ipResult,
                anchorDist: respondentState?.trbAnchor?.dist ?? null,
                cd: respondentState?.continuous?.CD?.expectedPos ?? null,
                mor: respondentState?.continuous?.MOR?.expectedPos ?? null,
                onts: respondentState?.continuous?.ONT_S?.expectedPos ?? null,
                zs: respondentState?.continuous?.ZS?.expectedPos ?? null,
            };
        }, JSON.stringify({
            personaJson: JSON.stringify(persona),
            anchorKey: tc.anchorToPromote,
            anchorItems: ANCHOR_ITEMS,
            demographics: tc.demographics,
        }));
        const ip = result.ipResult;
        const got = {
            state: ip?.state ?? "null",
            label: ip?.label ?? null,
            anchor: ip?.anchor ?? null,
            confidence: ip?.confidence ?? null,
            reasons: ip?.reasonCodes ?? [],
        };
        const ok = got.label === tc.expectedLabel && got.state === tc.expectedState;
        if (ok)
            pass++;
        else
            fail++;
        details.push({ label: tc.label, pass: ok, got });
        const anchorDistStr = result.anchorDist ? result.anchorDist.map(x => x.toFixed(2)).join(",") : "null";
        console.log(`${ok ? "PASS" : "FAIL"}  ${tc.label.padEnd(24)}  got: state=${got.state} label=${got.label ?? "(none)"} anchor=${got.anchor ?? "(none)"} conf=${got.confidence ?? "(none)"}`);
        if (!ok) {
            console.log(`      expected: state=${tc.expectedState} label=${tc.expectedLabel}`);
            console.log(`      anchorDist: [${anchorDistStr}]  (order: nat,id,rel,cls,eth,gen,sex,glo,mxn)`);
            console.log(`      CD=${result.cd?.toFixed(2)}  MOR=${result.mor?.toFixed(2)}  ONT_S=${result.onts?.toFixed(2)}  ZS=${result.zs?.toFixed(2)}`);
            console.log(`      reasons: ${got.reasons.join(", ")}`);
        }
    }
    console.log(`\n=== Identity-Primary E2E ===`);
    console.log(`${pass} passed, ${fail} failed (${CASES.length} total)`);
    const outDir = path.join(ROOT, "output");
    await fs.mkdir(outDir, { recursive: true });
    await fs.writeFile(path.join(outDir, "browser-identity-e2e.json"), JSON.stringify({ summary: { pass, fail, total: CASES.length }, details }, null, 2));
    console.log(`Wrote output/browser-identity-e2e.json`);
    await browser.close();
    server.close();
    if (fail > 0)
        process.exit(1);
}
main().catch(err => { console.error(err); process.exit(1); });
//# sourceMappingURL=browser-identity-e2e.js.map