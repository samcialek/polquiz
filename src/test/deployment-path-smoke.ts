/**
 * Smoke test: verify the full quiz → demographics → results page flow works.
 * Checks that prism-results.html at root loads, fetches data from
 * output/live-data/, and renders the archetype identity section.
 */

import { promises as fs } from "node:fs";
import * as path from "node:path";
import { createServer, type Server } from "node:http";
import { chromium } from "playwright";

import { ARCHETYPES } from "../config/archetypes.js";
import type { Archetype, ContinuousNodeId, CategoricalNodeId, CategoricalDist } from "../types.js";

interface Persona {
  archId: string; archName: string;
  continuous: Partial<Record<ContinuousNodeId, { pos: number; sal: number }>>;
  categorical: Partial<Record<CategoricalNodeId, { probs: CategoricalDist; sal: number }>>;
}
function buildPersona(arch: Archetype): Persona {
  const p: Persona = { archId: arch.id, archName: arch.name, continuous: {}, categorical: {} };
  for (const [nid, t] of Object.entries(arch.nodes)) {
    if (t.kind === "continuous") p.continuous[nid as ContinuousNodeId] = { pos: t.pos, sal: t.sal ?? 0 };
    else p.categorical[nid as CategoricalNodeId] = { probs: t.probs, sal: t.sal ?? 0 };
  }
  return p;
}

const ROOT = path.resolve(process.cwd());
const PORT = 8727;

function startServer(rootDir: string, port: number): Promise<Server> {
  return new Promise((resolve, reject) => {
    const server = createServer(async (req, res) => {
      try {
        let urlPath = (req.url || "/").split("?")[0] || "/";
        if (urlPath === "/") urlPath = "/quiz-v2-live.html";
        const safePath = path.normalize(urlPath).replace(/^[/\\]+/, "");
        const filePath = path.join(rootDir, safePath);
        if (!filePath.startsWith(rootDir)) { res.writeHead(403); res.end("forbidden"); return; }
        const data = await fs.readFile(filePath);
        const ext = path.extname(filePath).toLowerCase();
        const mime: Record<string, string> = { ".html": "text/html; charset=utf-8", ".js": "application/javascript; charset=utf-8", ".json": "application/json; charset=utf-8", ".css": "text/css; charset=utf-8" };
        res.writeHead(200, { "content-type": mime[ext] || "application/octet-stream" });
        res.end(data);
      } catch (e) { res.writeHead(404); res.end(String(e)); }
    });
    server.listen(port, "127.0.0.1", () => resolve(server));
    server.on("error", reject);
  });
}

async function main() {
  const server = await startServer(ROOT, PORT);
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext();
  await ctx.addInitScript(() => { (window as unknown as { __name: (f: unknown) => unknown }).__name = (f: unknown) => f; });
  const page = await ctx.newPage();
  const errors: string[] = [];
  page.on("pageerror", err => errors.push(err.message));

  // Step 1: Drive quiz
  const arch = ARCHETYPES.find(a => a.id === "012")!;
  const persona = buildPersona(arch);
  console.log(`Driving persona ${arch.id} ${arch.name} through quiz...`);

  await page.goto(`http://127.0.0.1:${PORT}/quiz-v2-live.html`, { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => typeof (window as unknown as { PrismEngine?: unknown }).PrismEngine !== "undefined", null, { timeout: 10000 });

  await page.evaluate((pJson) => {
    const persona = JSON.parse(pJson);
    const PE = (window as unknown as { PrismEngine: Record<string, (...args: unknown[]) => unknown> }).PrismEngine;
    type OE = { continuous?: Record<string, { pos?: number[]; sal?: number[] }>; categorical?: Record<string, { cat?: number[]; sal?: number[] }> };
    type BM = { continuous?: Record<string, number>; categorical?: Record<string, number[]> };
    const scoreOE = (ev: OE | undefined): number => { if (!ev) return 0; let s=0,c=0; if(ev.continuous) for(const[nid,upd] of Object.entries(ev.continuous)){const t=persona.continuous[nid]; if(!t||!upd)continue; if(upd.pos){s+=upd.pos[t.pos-1]??0.2;c++;} if(upd.sal){s+=upd.sal[t.sal]??0.25;c++;}} if(ev.categorical) for(const[nid,upd] of Object.entries(ev.categorical)){const t=persona.categorical[nid]; if(!t||!upd)continue; if(upd.cat){let d=0; for(let i=0;i<6;i++)d+=(upd.cat[i]??0)*(t.probs[i]??0); s+=d*6;c++;} if(upd.sal){s+=upd.sal[t.sal]??0.25;c++;}} return c>0?s/c:0; };
    const scoreBM = (m: BM | undefined): number => { if(!m)return 0; let s=0,c=0; if(m.continuous) for(const[nid,sig] of Object.entries(m.continuous)){const t=persona.continuous[nid]; if(!t||sig===undefined)continue; s+=sig*((t.pos-3)/2);c++;} if(m.categorical) for(const[nid,cd] of Object.entries(m.categorical)){const t=persona.categorical[nid]; if(!t||!cd)continue; let d=0; for(let i=0;i<6;i++)d+=(cd[i]??0)*(t.probs[i]??0); s+=d*6;c++;} return c>0?s/c:0; };
    type Q = { uiType: string; optionEvidence?: Record<string, OE>; sliderMap?: Record<string, OE>; allocationMap?: Record<string, BM>; rankingMap?: Record<string, BM>; pairMaps?: Record<string, Record<string, BM>>; bestWorstMap?: Record<string, BM> };
    const decide = (q: Q, qq: { id: number; options?: string[] }): unknown => {
      switch(q.uiType){case"single_choice":case"multi":{const o=Object.keys(q.optionEvidence??{});if(!o.length)return qq.options?.[0]??"unknown";let b=o[0]!,bs=-Infinity;for(const x of o){const s=scoreOE(q.optionEvidence![x]);if(s>bs){bs=s;b=x;}}return b;}case"slider":{const o=Object.keys(q.sliderMap??{});if(!o.length)return 50;let b=o[0]!,bs=-Infinity;for(const x of o){const s=scoreOE(q.sliderMap![x]);if(s>bs){bs=s;b=x;}}const p=b.split("-").map(Number);return Math.floor(((p[0]??0)+(p[1]??100))/2);}case"allocation":{const o=Object.keys(q.allocationMap??{});if(!o.length)return{};const sc=o.map(b=>({b,s:Math.max(0,scoreBM(q.allocationMap![b])+0.5)}));const t=sc.reduce((a,b)=>a+b.s,0);const a:Record<string,number>={};if(t===0){const sh=Math.floor(100/o.length);for(const b of o)a[b]=sh;}else{for(const{b,s}of sc)a[b]=Math.round((s/t)*100);const sum=Object.values(a).reduce((x,y)=>x+y,0);if(sum!==100)a[o[0]!]=(a[o[0]!]??0)+(100-sum);}return a;}case"ranking":{const o=Object.keys(q.rankingMap??{});if(!o.length)return[];const sc=o.map(i=>({i,s:scoreBM(q.rankingMap![i])}));sc.sort((x,y)=>y.s-x.s);return sc.map(x=>x.i);}case"pairwise":{const a:Record<string,string>={};for(const[pid,p] of Object.entries(q.pairMaps??{})){const c=Object.keys(p);if(!c.length)continue;let b=c[0]!,bs=-Infinity;for(const x of c){const s=scoreBM(p[x]);if(s>bs){bs=s;b=x;}}a[pid]=b;}return a;}case"best_worst":{const o=Object.keys(q.bestWorstMap??{});if(!o.length)return{best:"",worst:""};const sc=o.map(i=>({i,s:scoreBM(q.bestWorstMap![i])}));sc.sort((x,y)=>y.s-x.s);return{best:sc[0]!.i,worst:sc[sc.length-1]!.i};}case"priority_sort":{const o=Object.keys(q.rankingMap??{});if(!o.length)return{supportHigh:[],supportMid:[],neutral:[],opposeHigh:[]};const sc=o.map(i=>({i,s:scoreBM(q.rankingMap![i])}));sc.sort((x,y)=>y.s-x.s);const n=sc.length,q1=Math.ceil(n/4),q2=Math.ceil(n/2),q3=Math.ceil((3*n)/4);return{supportHigh:sc.slice(0,q1).map(x=>x.i),supportMid:sc.slice(q1,q2).map(x=>x.i),neutral:sc.slice(q2,q3).map(x=>x.i),opposeHigh:sc.slice(q3).map(x=>x.i)};}default:return qq.options?.[0]??"unknown";}
    };
    PE.initQuiz(); let steps=0;
    while(!PE.isComplete()&&steps<120){steps++;const qq=PE.getNextQuestion() as {id:number;options?:string[]}|null;if(!qq)break;const q=PE.getQuestionDef(qq.id) as Q|null;if(!q){PE.submitAnswer(qq.id,qq.options?.[0]??"unknown");continue;}PE.submitAnswer(qq.id,decide(q,qq));}
    // Simulate demographics submission
    localStorage.setItem('prism-demographics', JSON.stringify({ demo_ethnicity: 'white', demo_gender: 'male' }));
    (window as unknown as { finishResults: () => void }).finishResults();
  }, JSON.stringify(persona));

  // Step 2: Wait for redirect to the v27 results page (canonical post-2026-05 path)
  await page.waitForURL("**/examples/results-prototype-v27.html**", { timeout: 10000 });
  console.log(`  Redirected to: ${page.url()}`);

  // Step 3: Wait for results page to render (archetype-name node is populated after load)
  await page.waitForSelector("#archetype-name", { timeout: 15000 });
  await page.waitForFunction(() => {
    const el = document.getElementById("archetype-name");
    return !!el && (el.textContent ?? "").trim().length > 0;
  }, null, { timeout: 15000 });
  console.log(`  Results page rendered.`);

  // Wait for the cluster panels to be populated by buildBreakdown.
  await page.waitForFunction(() => {
    const realityPanel = document.querySelector('.cluster-panel[data-cluster="REALITY"]');
    return !!realityPanel && (realityPanel.textContent ?? "").includes("Closest epistemic style");
  }, null, { timeout: 15000 });

  // Step 4: Verify key sections + 2026-05-12 cleanup invariants
  const checks = await page.evaluate(() => {
    const text = document.body.textContent ?? "";
    const resultsEl = document.getElementById("results");
    const renderedSectionOrder = resultsEl
      ? Array.from(resultsEl.children)
          .filter(el => el.tagName.toLowerCase() === "section")
          .map(el => el.id)
      : [];
    const realityPanel = document.querySelector('.cluster-panel[data-cluster="REALITY"]');
    const meansPanel = document.querySelector('.cluster-panel[data-cluster="MEANS"]');
    const endsPanel = document.querySelector('.cluster-panel[data-cluster="ENDS"]');
    const identityPanel = document.querySelector('.cluster-panel[data-cluster="IDENTITY"]');
    const realityText = (realityPanel?.textContent ?? "");
    const meansText = (meansPanel?.textContent ?? "");
    // Old leaderboard signatures we want to be gone.
    const hasLeaderboardBars = !!document.querySelector(".cat-vbar-bar, .cat-vbar-cols, .cat-vbar-col");
    // 2026-05-12: percentage on cat-closest-match values is intentional.
    // Moral-circle moved from IDENTITY cluster to profile-donut-col.
    const donutCol = document.querySelector(".profile-donut-col");
    const moralCircleInDonutCol = !!donutCol && !!donutCol.querySelector(".moral-circle-section");
    const moralCircleInIdentity = !!identityPanel && !!identityPanel.querySelector(".moral-circle-section");
    const catMatchValueEls = Array.from(document.querySelectorAll(".cat-closest-match-value"));
    const catMatchHasPercent = catMatchValueEls.length > 0 && catMatchValueEls.every(el => /\d+\s*%/.test(el.textContent ?? ""));
    return {
      archetypeNameText: (document.getElementById("archetype-name")?.textContent ?? "").trim(),
      renderedSectionOrder,
      hasElectionsText: text.includes("Presidential Elections") || text.includes("1789"),
      sectionCount: document.querySelectorAll("section").length,
      allFourClustersPresent: !!realityPanel && !!meansPanel && !!endsPanel && !!identityPanel,
      epsInReality: realityText.includes("Closest epistemic style"),
      epsNotInMeans: !meansText.includes("Closest epistemic style"),
      aesInMeans: meansText.includes("Closest aesthetic style"),
      aesNotInReality: !realityText.includes("Closest aesthetic style"),
      hasLeaderboardBars,
      moralCircleInDonutCol,
      moralCircleInIdentity,
      catMatchHasPercent,
      bodyHasLeastFavorite: /least\s+favorite/i.test(text),
      bodyHasFavoriteAesthetic: /favorite\s+aesthetic|favorite\s+epistemic/i.test(text),
    };
  });

  // Section-order check: ignore hidden / empty sections (comparison-section
  // only shows when a friend-prediction is staged).
  const visibleOrder = checks.renderedSectionOrder.filter(id => id !== "comparison-section");
  const expectedOrder = ["archetype-section", "elections-section", "map-section", "profile-section", "footer-section"];
  const sectionOrderOK = JSON.stringify(visibleOrder) === JSON.stringify(expectedOrder);

  console.log(`\n=== Deployment path verification ===`);
  console.log(`  Archetype name rendered:        ${checks.archetypeNameText ? `OK (${checks.archetypeNameText})` : "FAIL"}`);
  console.log(`  Section order (post-comparison): ${sectionOrderOK ? "OK" : `FAIL — got ${JSON.stringify(visibleOrder)}`}`);
  console.log(`  Elections text present:         ${checks.hasElectionsText ? "OK" : "FAIL"}`);
  console.log(`  All 4 cluster panels present:   ${checks.allFourClustersPresent ? "OK" : "FAIL"}`);
  console.log(`  EPS shown in REALITY panel:     ${checks.epsInReality ? "OK" : "FAIL"}`);
  console.log(`  EPS NOT in MEANS panel:         ${checks.epsNotInMeans ? "OK" : "FAIL"}`);
  console.log(`  AES shown in MEANS panel:       ${checks.aesInMeans ? "OK" : "FAIL"}`);
  console.log(`  AES NOT in REALITY panel:       ${checks.aesNotInReality ? "OK" : "FAIL"}`);
  console.log(`  Old 6-cat leaderboard gone:     ${!checks.hasLeaderboardBars ? "OK" : "FAIL"}`);
  console.log(`  Moral circle in donut col:      ${checks.moralCircleInDonutCol ? "OK" : "FAIL"}`);
  console.log(`  Moral circle NOT in IDENTITY:   ${!checks.moralCircleInIdentity ? "OK" : "FAIL"}`);
  console.log(`  EPS/AES label has %:            ${checks.catMatchHasPercent ? "OK" : "FAIL"}`);
  console.log(`  No "least favorite" in body:    ${!checks.bodyHasLeastFavorite ? "OK" : "FAIL"}`);
  console.log(`  No "favorite ___" in body:      ${!checks.bodyHasFavoriteAesthetic ? "OK" : "FAIL"}`);
  console.log(`  Total <section> tags:           ${checks.sectionCount}`);
  console.log(`  Page errors:                    ${errors.length === 0 ? "none" : errors.join("; ")}`);

  const pass =
    !!checks.archetypeNameText &&
    sectionOrderOK &&
    checks.hasElectionsText &&
    checks.allFourClustersPresent &&
    checks.epsInReality && checks.epsNotInMeans &&
    checks.aesInMeans && checks.aesNotInReality &&
    !checks.hasLeaderboardBars &&
    checks.moralCircleInDonutCol &&
    !checks.moralCircleInIdentity &&
    checks.catMatchHasPercent &&
    !checks.bodyHasLeastFavorite &&
    !checks.bodyHasFavoriteAesthetic &&
    checks.sectionCount >= 3;
  console.log(`\nResult: ${pass ? "PASS" : "FAIL"}`);

  await browser.close();
  server.close();
  if (!pass) process.exit(1);
}

main().catch(err => { console.error(err); process.exit(1); });
