// Local smoke test: load quiz-v2-live.html from disk, advance into the quiz,
// and verify Q103 (FIXED_OPENER[0]) renders as a 3-bucket priority_sort with
// 14 items in the pool, no JS errors. Written 2026-04-23 as the gate before
// deploying the Q103 salience-screener change to prod.
import { chromium } from "playwright";
import * as path from "path";
import { pathToFileURL } from "url";
const FILE = pathToFileURL(path.resolve("quiz-v2-live.html")).href;
async function main() {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 1400, height: 1000 } });
    const errors = [];
    const consoleErrors = [];
    page.on("pageerror", (err) => errors.push(String(err)));
    page.on("console", (msg) => {
        if (msg.type() === "error")
            consoleErrors.push(msg.text());
    });
    await page.goto(FILE, { waitUntil: "networkidle", timeout: 30000 });
    console.log("LOADED", await page.title());
    const startBtn = page.locator(".start-btn").first();
    await startBtn.waitFor({ timeout: 15000 });
    await startBtn.click();
    await page.waitForTimeout(800);
    // Q200 (party_identification, single_choice) is now FIXED_OPENER[0] per
    // ADR-009. Advance past it to reach Q103 (issue_salience_screener,
    // priority_sort) at FIXED_OPENER[1].
    const partyOption = page.locator(".mc-option").first();
    if ((await partyOption.count()) > 0) {
        await partyOption.click();
        await page.waitForTimeout(600);
    }
    // Expect priority_sort UI to be live
    const psContainer = page.locator("#ps-container");
    const visible = await psContainer.count();
    if (visible === 0) {
        console.log("FAIL: #ps-container not found — Q103 did not render as priority_sort");
        const body = await page.locator("body").innerText();
        console.log("BODY SNIPPET:", body.slice(0, 500));
        await browser.close();
        process.exit(1);
    }
    const nBuckets = await page.locator(".ps-bucket").count();
    const nPool = await page.locator("#ps-pool .ps-item").count();
    const poolLabel = await page.locator(".ps-pool-label").innerText();
    const questionHeader = await page.locator(".question-text, h2, .prompt").first().innerText().catch(() => "(no header found)");
    console.log("BUCKETS", nBuckets);
    console.log("POOL_ITEMS", nPool);
    console.log("POOL_LABEL", poolLabel);
    console.log("PROMPT", questionHeader.slice(0, 200));
    // Q103 renders as 3-bucket priority_sort (central / middle / doesn't register)
    // — the UI omits the opposeHigh bucket because Q103 is a salience rule-out
    // screener, not an opinion-direction sort. 11 items = 11 topic-facing nodes.
    const ok = nBuckets === 3 && nPool === 11 && errors.length === 0;
    console.log("ERRORS", errors.length, errors);
    console.log("CONSOLE_ERRORS", consoleErrors.length, consoleErrors);
    console.log(ok ? "PASS" : "FAIL");
    // Screenshot for visual check
    await page.screenshot({ path: "output/q103-smoke.png", fullPage: true });
    console.log("SCREENSHOT", "output/q103-smoke.png");
    await browser.close();
    process.exit(ok ? 0 : 1);
}
main().catch((e) => { console.error(e); process.exit(2); });
//# sourceMappingURL=local-q103-smoke.js.map