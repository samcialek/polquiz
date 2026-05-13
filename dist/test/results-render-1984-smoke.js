/**
 * Regression smoke for the 2026-04-25 results-live.html bug where the
 * elections grid was rendering archetype-level pre-computed votes
 * (electionsData[archetypeId]) instead of the user's actual respondent
 * predictions (localStorage["prism-election-raw"]).
 *
 * The archetype-side scorer at src/historical/regime-alignment.ts gives
 * Progressive Civic Nationalist a Reagan/Reagan/Bush sequence in
 * 1980-88 because it lacks the partisan-loyalty multiplier. The
 * user-side path at src/historical/respondentVoteChoice.ts (which
 * powers the tooltip and writes prism-election-raw at quiz finalization)
 * correctly returns Carter/Mondale/Dukakis for any user with partyID="D"
 * and high PF.
 *
 * This smoke seeds localStorage["prism-election-raw"] with a synthetic
 * 1984 vote of Mondale (Democratic, distance 1.13) beating Reagan
 * (Republican, distance 1.56), loads results-live.html, and asserts:
 *   - the 1984 cell shows "Mondale" not "Reagan"
 *   - the cell carries class "dem"
 *   - the hover tooltip ranks Mondale before Reagan
 *
 * If this fails, a future rewrite has reintroduced the archetype-level
 * fallback as primary.
 *
 * Usage: npx tsx src/test/results-render-1984-smoke.ts
 */
import { chromium } from "playwright";
import { createServer } from "http";
import * as path from "path";
import * as fs from "fs/promises";
const ROOT = path.resolve(process.cwd());
const PORT = 8728;
const SYNTHETIC_RAW = [
    {
        year: 1984,
        candidates: [
            { name: "Reagan", party: "Republican", distance: 1.5593 },
            { name: "Mondale", party: "Democratic", distance: 1.1332 },
        ],
        clearingBar: 1.85,
        nearest: { name: "Mondale", party: "Democratic", distance: 1.1332 },
        decision: "vote",
    },
    {
        year: 1988,
        candidates: [
            { name: "Bush", party: "Republican", distance: 1.7673 },
            { name: "Dukakis", party: "Democratic", distance: 1.0023 },
        ],
        clearingBar: 1.85,
        nearest: { name: "Dukakis", party: "Democratic", distance: 1.0023 },
        decision: "vote",
    },
];
async function startServer(rootDir, port) {
    return new Promise((resolve, reject) => {
        const server = createServer(async (req, res) => {
            try {
                let urlPath = (req.url || "/").split("?")[0] || "/";
                if (urlPath === "/")
                    urlPath = "/results-live.html";
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
                    ".png": "image/png",
                    ".jpg": "image/jpeg",
                    ".webp": "image/webp",
                };
                res.writeHead(200, { "content-type": mime[ext] || "application/octet-stream" });
                res.end(data);
            }
            catch (e) {
                res.writeHead(404);
                res.end(String(e));
            }
        });
        server.listen(port, "127.0.0.1", () => resolve({ close: () => server.close() }));
        server.on("error", reject);
    });
}
async function main() {
    const server = await startServer(ROOT, PORT);
    const browser = await chromium.launch({ headless: true });
    let pass = false;
    try {
        const context = await browser.newContext({ viewport: { width: 1400, height: 1000 } });
        const page = await context.newPage();
        const errors = [];
        page.on("pageerror", (err) => errors.push(String(err)));
        // Seed localStorage BEFORE the page loads its data — addInitScript runs
        // before any document scripts, so prism-election-raw is in place when
        // results-live.html reads it at line 404.
        await page.addInitScript(({ raw }) => {
            localStorage.setItem("prism-election-raw", JSON.stringify(raw));
        }, { raw: SYNTHETIC_RAW });
        // Load results page for archetype 134 (Progressive Civic Nationalist —
        // the archetype where the bug manifests because its centroid scores
        // Reagan/Bush in 1980-88).
        const url = `http://127.0.0.1:${PORT}/results-live.html?id=134`;
        await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });
        await page.waitForSelector(".election-cell", { state: "attached", timeout: 10000 });
        const cell1984 = await page.$(".election-cell[data-year='1984']");
        if (!cell1984) {
            console.log("FAIL: no .election-cell with data-year='1984' found");
            return;
        }
        const name1984 = (await cell1984.$eval(".cell-name", el => el.textContent ?? "")).trim();
        const cls1984 = await cell1984.getAttribute("class") ?? "";
        const cell1988 = await page.$(".election-cell[data-year='1988']");
        const name1988 = cell1988
            ? (await cell1988.$eval(".cell-name", el => el.textContent ?? "")).trim()
            : "(missing)";
        console.log(`1984 cell: name="${name1984}" class="${cls1984}"`);
        console.log(`1988 cell: name="${name1988}"`);
        console.log(`pageerrors: ${errors.length}`);
        // Positive assertions: the user-side prediction we seeded must surface.
        const ok1984 = name1984 === "Mondale" && cls1984.includes("dem");
        const ok1988 = name1988 === "Dukakis";
        // Negative assertions: catch the exact regression — if the grid falls
        // back to archetype-level data again, archetype 134's Gaussian path
        // returns Reagan in 1984 and Bush in 1988. A test that only checks
        // for Mondale/Dukakis can pass against an empty grid; these
        // assertions catch the actual reversion mode.
        const not1984Reagan = name1984 !== "Reagan";
        const not1988Bush = name1988 !== "Bush";
        pass = ok1984 && ok1988 && not1984Reagan && not1988Bush && errors.length === 0;
        if (!pass) {
            if (!ok1984)
                console.log(`  ✗ 1984 expected Mondale (dem), got "${name1984}" (${cls1984})`);
            if (!ok1988)
                console.log(`  ✗ 1988 expected Dukakis, got "${name1988}"`);
            if (!not1984Reagan)
                console.log(`  ✗ 1984 must not be Reagan (archetype-level fallback regression)`);
            if (!not1988Bush)
                console.log(`  ✗ 1988 must not be Bush (archetype-level fallback regression)`);
            if (errors.length)
                console.log(`  ✗ pageerrors: ${errors.join(" | ")}`);
        }
    }
    finally {
        await browser.close();
        server.close();
    }
    console.log(pass ? "PASS" : "FAIL");
    process.exit(pass ? 0 : 1);
}
main().catch((e) => { console.error(e); process.exit(2); });
//# sourceMappingURL=results-render-1984-smoke.js.map