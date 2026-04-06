import { chromium } from 'playwright';
const URL = 'https://matricesofconfusion.com/prism-quiz-v2.html';
async function main() {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 1400, height: 1000 } });
    const issues = [];
    const seenQuestions = new Set();
    await page.goto(URL, { waitUntil: 'networkidle', timeout: 60000 });
    const title = await page.title();
    console.log('PAGE_TITLE', title);
    const startBtn = await page.locator('.start-btn').first();
    await startBtn.waitFor({ timeout: 15000 });
    await startBtn.click();
    await page.waitForTimeout(1200);
    let steps = 0;
    const MAX_STEPS = 80;
    while (steps < MAX_STEPS) {
        steps++;
        await page.waitForTimeout(500);
        const url = page.url();
        if (url.includes('prism-results')) {
            console.log('RESULTS_REDIRECT', url);
            break;
        }
        const hasQuestion = await page.locator('.question-card').count();
        if (!hasQuestion) {
            const hasDemo = await page.locator('#demo-fields').count();
            if (hasDemo) {
                console.log('DEMOGRAPHICS_SCREEN');
                const skip = page.locator('a', { hasText: 'skip' }).first();
                if (await skip.count()) {
                    await skip.click();
                    await page.waitForTimeout(1500);
                    continue;
                }
            }
            const resultsJson = await page.evaluate(() => localStorage.getItem('prism-results')).catch(() => null);
            if (resultsJson) {
                console.log('RESULTS_IN_LOCALSTORAGE');
                break;
            }
            issues.push(`step ${steps}: no question card visible`);
            break;
        }
        const qText = (await page.locator('.question-text').textContent())?.trim() || '';
        const qType = await page.evaluate(() => {
            if (document.querySelector('.bw-container'))
                return 'best_worst';
            if (document.querySelector('.allocation-container'))
                return 'allocation';
            if (document.querySelector('.ranking-container'))
                return 'ranking';
            if (document.querySelector('.tradeoff-container'))
                return 'tradeoff';
            if (document.querySelector('.slider-container'))
                return 'slider';
            if (document.querySelector('.mc-options'))
                return 'single_choice';
            return 'unknown';
        });
        console.log('QUESTION', steps, qType, qText.slice(0, 120));
        if (seenQuestions.has(qText)) {
            issues.push(`loop detected on question: ${qText.slice(0, 80)}`);
            break;
        }
        seenQuestions.add(qText);
        if (qType === 'single_choice') {
            const opts = page.locator('.mc-option');
            const count = await opts.count();
            if (!count) {
                issues.push(`step ${steps}: single_choice with 0 options`);
                break;
            }
            await opts.first().click();
        }
        else if (qType === 'slider') {
            await page.evaluate(() => {
                const s = document.getElementById('main-slider');
                if (!s)
                    return;
                const mode = s.getAttribute('data-mode');
                s.value = mode === 'percent' ? '50' : '4';
                s.dispatchEvent(new Event('input', { bubbles: true }));
            });
            await page.locator('.continue-btn').click();
        }
        else if (qType === 'allocation') {
            const ok = await page.evaluate(() => {
                const sliders = Array.from(document.querySelectorAll('.allocation-slider'));
                if (!sliders.length)
                    return false;
                const each = Math.floor(100 / sliders.length);
                sliders.forEach((s, i) => { s.value = String(i === 0 ? 100 - each * (sliders.length - 1) : each); });
                const w = window;
                if (typeof w.updateAllocDisplay === 'function')
                    w.updateAllocDisplay();
                return true;
            });
            if (!ok) {
                issues.push(`step ${steps}: allocation UI missing sliders`);
                break;
            }
            await page.locator('.continue-btn').click();
        }
        else if (qType === 'ranking') {
            const ok = await page.evaluate(() => {
                const list = document.getElementById('ranking-list');
                if (!list)
                    return false;
                const items = Array.from(list.querySelectorAll('.ranking-item'));
                if (!items.length)
                    return false;
                items.forEach((item, i) => {
                    const n = item.querySelector('.ranking-number');
                    if (n)
                        n.textContent = String(i + 1);
                });
                return true;
            });
            if (!ok) {
                issues.push(`step ${steps}: ranking UI missing items`);
                break;
            }
            await page.locator('.continue-btn').click();
        }
        else if (qType === 'best_worst') {
            const rows = page.locator('.bw-row');
            const count = await rows.count();
            if (count < 2) {
                issues.push(`step ${steps}: best_worst has fewer than 2 rows`);
                break;
            }
            await rows.first().locator('.best-btn').click();
            await page.waitForTimeout(150);
            await rows.nth(count - 1).locator('.worst-btn').click();
        }
        else if (qType === 'tradeoff') {
            const opts = page.locator('.tradeoff-option');
            const count = await opts.count();
            if (count < 2) {
                issues.push(`step ${steps}: tradeoff has fewer than 2 options`);
                break;
            }
            await opts.first().click();
            await page.waitForTimeout(200);
            const ratios = page.locator('.ratio-btn');
            const ratioCount = await ratios.count();
            if (!ratioCount) {
                issues.push(`step ${steps}: tradeoff ratio buttons missing`);
                break;
            }
            await ratios.nth(Math.min(2, ratioCount - 1)).click();
        }
        else {
            issues.push(`step ${steps}: unknown question type for ${qText.slice(0, 80)}`);
            break;
        }
    }
    await page.waitForTimeout(1500);
    const finalUrl = page.url();
    const resultsJson = await page.evaluate(() => localStorage.getItem('prism-results')).catch(() => null);
    console.log('FINAL_URL', finalUrl);
    console.log('HAS_RESULTS_JSON', !!resultsJson);
    if (resultsJson) {
        const results = JSON.parse(resultsJson);
        console.log('RESULT_ARCHETYPE', results.archetypeName);
        console.log('RESULT_CONFIDENCE', results.confidence);
        console.log('TOP5_LEN', Array.isArray(results.top5) ? results.top5.length : 0);
        console.log('HAS_IDENTITY_PRIMARY', !!results.identityPrimary);
        if (results.identityPrimary) {
            console.log('IDENTITY_PRIMARY_STATE', results.identityPrimary.state);
            console.log('IDENTITY_PRIMARY_LABEL', results.identityPrimary.label || '');
            console.log('IDENTITY_PRIMARY_ANCHOR', results.identityPrimary.anchor || '');
        }
    }
    console.log('ISSUES', JSON.stringify(issues));
    await browser.close();
}
main().catch(err => {
    console.error('FATAL', err);
    process.exit(1);
});
//# sourceMappingURL=live-v2-smoke.js.map