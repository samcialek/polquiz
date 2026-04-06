/**
 * Semantic Playthrough — Playwright + Claude API
 * Takes the PRISM quiz for each archetype, answering based on archetype NAME only.
 *
 * Usage: npx tsx src/test/semantic-playthrough.ts [--all]
 *   Default: runs archetype 134 (Progressive Civic Nationalist) only
 *   --all: runs all 122 active archetypes
 */
import { chromium } from 'playwright';
import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
// ── Config ────────────────────────────────────────────────────────────────────
// Serve locally to avoid file:// localStorage restrictions
const QUIZ_URL = `http://localhost:8765/prism-quiz-v3.html`;
const OUTPUT_DIR = path.resolve('output');
const SCREENSHOT_DIR = path.join(OUTPUT_DIR, 'screenshots');
const RESULTS_FILE = path.join(OUTPUT_DIR, 'semantic-playthrough-results.json');
const QUESTION_TIMEOUT = 60_000;
const ARCHETYPE_TIMEOUT = 1_800_000; // 30 minutes per archetype
// Anthropic API direct
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || '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';
const MODEL = 'claude-sonnet-4-20250514';
// ── Extract archetypes from source ────────────────────────────────────────────
const CONTINUOUS_NODES = ['MAT', 'CD', 'CU', 'MOR', 'PRO', 'COM', 'ZS', 'ONT_H', 'ONT_S', 'PF', 'TRB', 'ENG'];
function getArchetypes() {
    const src = fs.readFileSync(path.resolve('src/config/archetypes.ts'), 'utf-8');
    const results = [];
    // Split by archetype blocks (each starts with { and has id/name/nodes)
    const blocks = src.split(/\n  \{/);
    for (const block of blocks) {
        const idMatch = block.match(/id:\s*"(\d+)"/);
        const nameMatch = block.match(/name:\s*"([^"]+)"/);
        if (!idMatch || !nameMatch)
            continue;
        const nodes = {};
        for (const node of CONTINUOUS_NODES) {
            const nodeMatch = block.match(new RegExp(`${node}:\\s*\\{[^}]*pos:\\s*(\\d+)`));
            if (nodeMatch)
                nodes[node] = parseInt(nodeMatch[1]);
        }
        results.push({ id: idMatch[1], name: nameMatch[1], nodes });
    }
    return results;
}
// ── HTML Diagnostic Report Generator ──────────────────────────────────────────
const REPORT_FILE = path.join(OUTPUT_DIR, 'semantic-diagnostic-report.html');
function generateReport(completed, total) {
    const matches = completed.filter(r => r.match).length;
    const pct = completed.length > 0 ? (matches / completed.length * 100).toFixed(1) : '0.0';
    const now = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });
    let rows = '';
    for (const r of completed) {
        const expected = r.expectedNodes || {};
        const actual = r.actualNodes || {};
        let nodeCells = '';
        let totalDiff = 0;
        let nodeCount = 0;
        for (const node of CONTINUOUS_NODES) {
            const exp = expected[node];
            const act = actual[node];
            if (exp !== undefined && act !== undefined) {
                const diff = Math.abs(exp - act);
                totalDiff += diff;
                nodeCount++;
                const color = diff === 0 ? '#2d7d3a' : diff <= 0.5 ? '#5a8f29' : diff <= 1.0 ? '#b89e00' : diff <= 1.5 ? '#c96a00' : '#c43030';
                nodeCells += `<td style="background:${color}20;color:${color};font-weight:${diff > 1 ? 'bold' : 'normal'}" title="Expected: ${exp.toFixed(1)}, Actual: ${act.toFixed(2)}, Diff: ${diff.toFixed(2)}">${exp.toFixed(0)}→${act.toFixed(1)}</td>`;
            }
            else {
                nodeCells += `<td style="color:#999">—</td>`;
            }
        }
        const avgDiff = nodeCount > 0 ? (totalDiff / nodeCount).toFixed(2) : '—';
        const matchIcon = r.match ? '✅' : '❌';
        const top5Str = r.top5.slice(0, 3).map((t, i) => `${i + 1}. ${t.name} (${(t.score * 100).toFixed(1)}%)`).join('<br>');
        rows += `<tr>
      <td>${matchIcon}</td>
      <td><b>[${r.archetypeId}] ${r.archetypeName}</b></td>
      <td>${r.resultArchetype}<br><small>${(r.resultConfidence * 100).toFixed(1)}%</small></td>
      <td>${r.questionsAsked}</td>
      <td style="font-weight:bold">${avgDiff}</td>
      ${nodeCells}
      <td><small>${top5Str}</small></td>
      <td><small>${r.issues.length > 0 ? r.issues.join('; ') : '—'}</small></td>
    </tr>`;
    }
    const html = `<!DOCTYPE html>
<html><head>
<meta charset="UTF-8"><title>PRISM Semantic Playthrough — Diagnostic Report</title>
<style>
  body { font-family: -apple-system, sans-serif; margin: 20px; background: #0d1117; color: #c9d1d9; }
  h1 { color: #58a6ff; } h2 { color: #8b949e; }
  .stats { display: flex; gap: 20px; margin: 15px 0; }
  .stat { background: #161b22; padding: 15px 25px; border-radius: 8px; border: 1px solid #30363d; }
  .stat-val { font-size: 28px; font-weight: bold; color: #58a6ff; }
  .stat-label { color: #8b949e; font-size: 13px; }
  table { border-collapse: collapse; width: 100%; font-size: 12px; }
  th { background: #161b22; color: #58a6ff; padding: 8px 5px; text-align: left; position: sticky; top: 0; }
  td { padding: 6px 5px; border-bottom: 1px solid #21262d; }
  tr:hover { background: #161b2288; }
  .legend { margin: 10px 0; font-size: 12px; }
  .legend span { margin-right: 15px; padding: 2px 8px; border-radius: 3px; }
</style>
</head><body>
<h1>🔬 PRISM Semantic Playthrough — Diagnostic Report</h1>
<p>Updated: ${now} | Progress: ${completed.length}/${total}</p>
<div class="stats">
  <div class="stat"><div class="stat-val">${matches}/${completed.length}</div><div class="stat-label">Name Matches</div></div>
  <div class="stat"><div class="stat-val">${pct}%</div><div class="stat-label">Match Rate</div></div>
  <div class="stat"><div class="stat-val">${completed.length}</div><div class="stat-label">Completed</div></div>
  <div class="stat"><div class="stat-val">${total - completed.length}</div><div class="stat-label">Remaining</div></div>
</div>
<div class="legend">
  Node diff colors: <span style="background:#2d7d3a20;color:#2d7d3a">0 (exact)</span>
  <span style="background:#5a8f2920;color:#5a8f29">≤0.5</span>
  <span style="background:#b89e0020;color:#b89e00">≤1.0</span>
  <span style="background:#c96a0020;color:#c96a00">≤1.5</span>
  <span style="background:#c4303020;color:#c43030">&gt;1.5</span>
  | Format: Expected→Actual
</div>
<table>
<tr><th></th><th>Expected Archetype</th><th>Result</th><th>Qs</th><th>Avg Δ</th>
${CONTINUOUS_NODES.map(n => `<th>${n}</th>`).join('')}
<th>Top 3</th><th>Issues</th></tr>
${rows}
</table>
</body></html>`;
    fs.writeFileSync(REPORT_FILE, html, 'utf-8');
}
// ── Build result with node diagnostics ────────────────────────────────────────
function buildResult(archetype, quizResults, questionNum, lastQuestion, issues, answers) {
    const match = quizResults.archetypeName === archetype.name ||
        quizResults.archetypeId === archetype.id;
    // Extract actual node estimates from respondentState
    const actualNodes = {};
    const rs = quizResults.respondentState;
    if (rs) {
        // respondentState has node means/estimates
        for (const node of CONTINUOUS_NODES) {
            const nodeData = rs[node] || rs[node.toLowerCase()];
            if (nodeData && typeof nodeData === 'object') {
                // Could be { mean, variance } or { estimate } or { pos }
                actualNodes[node] = nodeData.mean ?? nodeData.estimate ?? nodeData.pos ?? nodeData.value ?? NaN;
            }
            else if (typeof nodeData === 'number') {
                actualNodes[node] = nodeData;
            }
        }
        // Also check if respondentState has a .nodes or .estimates sub-object
        const nodesObj = rs.nodes || rs.estimates || rs.nodeEstimates || rs.means;
        if (nodesObj && typeof nodesObj === 'object') {
            for (const node of CONTINUOUS_NODES) {
                if (nodesObj[node] !== undefined && !(node in actualNodes)) {
                    actualNodes[node] = typeof nodesObj[node] === 'object' ? nodesObj[node].mean ?? nodesObj[node].estimate : nodesObj[node];
                }
            }
        }
    }
    return {
        archetypeId: archetype.id,
        archetypeName: archetype.name,
        resultArchetype: quizResults.archetypeName || 'TIMEOUT',
        resultConfidence: quizResults.confidence || 0,
        match,
        top5: quizResults.top5?.map((t) => ({ name: t.name, score: t.posterior || t.score })) || [],
        questionsAsked: questionNum,
        lastQuestion,
        issues,
        answers,
        expectedNodes: archetype.nodes,
        actualNodes: Object.keys(actualNodes).length > 0 ? actualNodes : undefined,
        respondentState: rs || undefined,
    };
}
// ── Claude API: semantic answer ───────────────────────────────────────────────
async function askClaude(archetypeName, questionText, questionType, options, sliderLabels, allocationBuckets, rankingItems, bestWorstItems) {
    let userPrompt;
    if (questionType === 'slider') {
        const mode = sliderLabels?.mode || 'likert';
        if (mode === 'percent') {
            userPrompt = `Question: "${questionText}"\n\nThis is a percentage slider from 0 to 100.\nLeft end (0): ${sliderLabels?.low || '0%'}\nRight end (100): ${sliderLabels?.high || '100%'}\n\nReturn ONLY a number from 0 to 100. Nothing else.`;
        }
        else {
            userPrompt = `Question: "${questionText}"\n\nThis is a 1-7 scale.\n1 = ${sliderLabels?.low || 'low'}\n7 = ${sliderLabels?.high || 'high'}\n\nReturn ONLY a number from 1 to 7. Nothing else.`;
        }
    }
    else if (questionType === 'allocation') {
        userPrompt = `Question: "${questionText}"\n\nAllocate percentages to these categories (must sum to 100):\n${(allocationBuckets || []).map((b, i) => `${i + 1}. ${b}`).join('\n')}\n\nReturn ONLY a JSON object like {"category1": 30, "category2": 70}. Use the exact category keys shown. Nothing else.`;
    }
    else if (questionType === 'ranking') {
        userPrompt = `Question: "${questionText}"\n\nRank these from most important (first) to least important (last):\n${(rankingItems || []).map((r, i) => `- ${r}`).join('\n')}\n\nReturn ONLY a JSON array of the items in your preferred order, like ["item1", "item2", ...]. Use the exact item keys shown. Nothing else.`;
    }
    else if (questionType === 'best_worst') {
        userPrompt = `Question: "${questionText}"\n\nSelect which matters MOST and which matters LEAST:\n${(bestWorstItems || []).map((b, i) => `- ${b}`).join('\n')}\n\nReturn ONLY a JSON object like {"best": "key1", "worst": "key2"}. Use the exact item keys shown. Nothing else.`;
    }
    else {
        // single_choice, multi, pairwise
        userPrompt = `Question: "${questionText}"\n\nOptions:\n${options.map((o, i) => `${String.fromCharCode(65 + i)}. ${o}`).join('\n')}\n\nReturn ONLY the letter (A, B, C, etc.) of your choice. Nothing else.`;
    }
    const systemPrompt = `You are role-playing as a "${archetypeName}". Answer this political quiz question based on your understanding of what a "${archetypeName}" would believe. Do NOT look at any scoring algorithm or node profiles. Answer based purely on the semantic meaning of the archetype name. Be decisive - pick the answer that best fits the archetype. Return ONLY the requested format - no explanation, no preamble.`;
    const fullPrompt = `${systemPrompt}\n\n${userPrompt}`;
    // Write prompt to temp file to avoid shell quoting issues
    const tmpFile = path.join(OUTPUT_DIR, '_claude_prompt.txt');
    fs.writeFileSync(tmpFile, fullPrompt, 'utf-8');
    try {
        const text = execSync(`claude --print --model claude-sonnet-4-20250514 < "${tmpFile}"`, { timeout: 60_000, encoding: 'utf-8', shell: 'cmd.exe', windowsHide: true }).trim();
        return text;
    }
    catch (e) {
        throw new Error(`claude --print failed: ${e.message}`);
    }
}
// ── Detect question type from DOM ─────────────────────────────────────────────
async function detectQuestionType(page) {
    return await page.evaluate(() => {
        if (document.querySelector('.bw-container'))
            return 'best_worst';
        if (document.querySelector('.allocation-container'))
            return 'allocation';
        if (document.querySelector('.ranking-container'))
            return 'ranking';
        if (document.querySelector('.slider-container'))
            return 'slider';
        if (document.querySelector('.mc-options'))
            return 'single_choice';
        return 'unknown';
    });
}
// ── Read question data from DOM ───────────────────────────────────────────────
async function readQuestionData(page) {
    return await page.evaluate(() => {
        const qTextEl = document.querySelector('.question-text');
        const questionText = qTextEl?.textContent?.trim() || '';
        // MC options: extract both display text and option key
        const mcOptions = [];
        document.querySelectorAll('.mc-option').forEach(el => {
            const onclick = el.getAttribute('onclick') || '';
            const keyMatch = onclick.match(/selectMC\(this,\s*\d+,\s*'([^']+)'\)/);
            const key = keyMatch ? keyMatch[1] : '';
            const label = el.querySelector('.mc-text')?.textContent?.trim() || '';
            mcOptions.push({ key, label });
        });
        // Slider info
        const slider = document.getElementById('main-slider');
        const sliderMode = slider?.getAttribute('data-mode') || '';
        const sliderLabels = document.querySelectorAll('.slider-labels span');
        const sliderLow = sliderLabels[0]?.textContent?.trim() || '';
        const sliderHigh = sliderLabels[1]?.textContent?.trim() || '';
        // Allocation buckets
        const allocBuckets = [];
        document.querySelectorAll('.allocation-slider').forEach(el => {
            const key = el.dataset.bucket || '';
            const row = el.closest('.allocation-row');
            const label = row?.querySelector('.allocation-label')?.textContent?.trim() || '';
            allocBuckets.push({ key, label });
        });
        // Ranking items
        const rankItems = [];
        document.querySelectorAll('.ranking-item').forEach(el => {
            const key = el.dataset.item || '';
            const label = el.querySelector('.ranking-text')?.textContent?.trim() || '';
            rankItems.push({ key, label });
        });
        // Best-worst items
        const bwItems = [];
        document.querySelectorAll('.bw-row').forEach(el => {
            const id = el.id || '';
            const key = id.replace('bw-row-', '');
            const label = el.querySelector('.bw-label')?.textContent?.trim() || '';
            bwItems.push({ key, label });
        });
        // Question ID from MC onclick or other
        let qId = 0;
        const firstMC = document.querySelector('.mc-option');
        if (firstMC) {
            const onclick = firstMC.getAttribute('onclick') || '';
            const idMatch = onclick.match(/selectMC\(this,\s*(\d+)/);
            if (idMatch)
                qId = parseInt(idMatch[1]);
        }
        // Try submit buttons for slider/allocation/ranking
        if (!qId) {
            const continueBtn = document.querySelector('.continue-btn');
            if (continueBtn) {
                const onclick = continueBtn.getAttribute('onclick') || '';
                const idMatch = onclick.match(/submit\w+\((\d+)\)/);
                if (idMatch)
                    qId = parseInt(idMatch[1]);
            }
        }
        return {
            questionText,
            qId,
            mcOptions,
            sliderMode,
            sliderLow,
            sliderHigh,
            allocBuckets,
            rankItems,
            bwItems,
        };
    });
}
// ── Answer a single question ──────────────────────────────────────────────────
async function answerQuestion(page, archetypeName, questionNum, issues) {
    const qType = await detectQuestionType(page);
    if (qType === 'unknown') {
        await page.screenshot({ path: path.join(SCREENSHOT_DIR, `unknown-q${questionNum}.png`) });
        issues.push(`Q${questionNum}: unrecognized question type`);
        return null;
    }
    const data = await readQuestionData(page);
    let answer;
    let claudeRaw;
    try {
        if (qType === 'single_choice') {
            // Send labels to Claude, get back letter
            const optionLabels = data.mcOptions.map(o => o.label);
            claudeRaw = await askClaude(archetypeName, data.questionText, qType, optionLabels);
            // Parse letter response -> index -> key
            const letterMatch = claudeRaw.match(/^([A-Z])/i);
            if (letterMatch) {
                const idx = letterMatch[1].toUpperCase().charCodeAt(0) - 65;
                if (idx >= 0 && idx < data.mcOptions.length) {
                    answer = data.mcOptions[idx].key;
                    // Click the option (auto-submits after 300ms)
                    const options = await page.$$('.mc-option');
                    await options[idx].click();
                }
            }
            if (!answer) {
                // Try fuzzy match on label text
                const lower = claudeRaw.toLowerCase();
                const match = data.mcOptions.find(o => lower.includes(o.label.toLowerCase().slice(0, 20)));
                if (match) {
                    answer = match.key;
                    const idx = data.mcOptions.indexOf(match);
                    const options = await page.$$('.mc-option');
                    await options[idx].click();
                }
                else {
                    issues.push(`Q${questionNum}: couldn't match Claude response "${claudeRaw}" to options`);
                    // Default to first option
                    answer = data.mcOptions[0]?.key || 'unknown';
                    const options = await page.$$('.mc-option');
                    if (options.length > 0)
                        await options[0].click();
                }
            }
        }
        else if (qType === 'slider') {
            claudeRaw = await askClaude(archetypeName, data.questionText, qType, [], { low: data.sliderLow, high: data.sliderHigh, mode: data.sliderMode });
            const num = parseInt(claudeRaw.replace(/[^0-9]/g, ''));
            if (data.sliderMode === 'percent') {
                answer = Math.max(0, Math.min(100, num || 50));
                await page.evaluate((val) => {
                    const s = document.getElementById('main-slider');
                    s.value = String(val);
                    s.dispatchEvent(new Event('input'));
                }, answer);
            }
            else {
                answer = Math.max(1, Math.min(7, num || 4));
                await page.evaluate((val) => {
                    const s = document.getElementById('main-slider');
                    s.value = String(val);
                    s.dispatchEvent(new Event('input'));
                }, answer);
            }
            await page.click('.continue-btn');
        }
        else if (qType === 'allocation') {
            const bucketLabels = data.allocBuckets.map(b => `${b.key}: ${b.label}`);
            claudeRaw = await askClaude(archetypeName, data.questionText, qType, [], undefined, bucketLabels);
            // Parse JSON response
            let alloc = {};
            try {
                // Try to extract JSON from response
                const jsonMatch = claudeRaw.match(/\{[^}]+\}/);
                if (jsonMatch)
                    alloc = JSON.parse(jsonMatch[0]);
            }
            catch {
                // Default: even distribution
                const n = data.allocBuckets.length;
                data.allocBuckets.forEach(b => { alloc[b.key] = Math.round(100 / n); });
                issues.push(`Q${questionNum}: couldn't parse allocation response "${claudeRaw}"`);
            }
            // Map Claude's keys (which might use labels) back to actual bucket keys
            const resolvedAlloc = {};
            for (const bucket of data.allocBuckets) {
                // Check if Claude used the key directly
                if (alloc[bucket.key] !== undefined) {
                    resolvedAlloc[bucket.key] = alloc[bucket.key];
                }
                else {
                    // Check if Claude used "key: label" format or just label
                    const found = Object.entries(alloc).find(([k]) => k.includes(bucket.key) || bucket.label.toLowerCase().includes(k.toLowerCase()) ||
                        k.toLowerCase().includes(bucket.label.toLowerCase().slice(0, 15)));
                    resolvedAlloc[bucket.key] = found ? found[1] : Math.round(100 / data.allocBuckets.length);
                }
            }
            // Normalize to 100
            const total = Object.values(resolvedAlloc).reduce((s, v) => s + v, 0);
            if (total !== 100 && total > 0) {
                for (const k of Object.keys(resolvedAlloc)) {
                    resolvedAlloc[k] = Math.round(resolvedAlloc[k] * 100 / total);
                }
                // Fix rounding
                const newTotal = Object.values(resolvedAlloc).reduce((s, v) => s + v, 0);
                const keys = Object.keys(resolvedAlloc);
                if (newTotal !== 100 && keys.length > 0) {
                    resolvedAlloc[keys[0]] += (100 - newTotal);
                }
            }
            answer = resolvedAlloc;
            // Set each slider
            await page.evaluate((vals) => {
                document.querySelectorAll('.allocation-slider').forEach(el => {
                    const s = el;
                    const key = s.dataset.bucket || '';
                    if (vals[key] !== undefined) {
                        s.value = String(vals[key]);
                    }
                });
                // Trigger display update
                window.updateAllocDisplay?.();
            }, resolvedAlloc);
            await page.click('.continue-btn');
        }
        else if (qType === 'ranking') {
            const itemLabels = data.rankItems.map(r => `${r.key}: ${r.label}`);
            claudeRaw = await askClaude(archetypeName, data.questionText, qType, [], undefined, undefined, itemLabels);
            let ranking = [];
            try {
                const jsonMatch = claudeRaw.match(/\[[\s\S]*\]/);
                if (jsonMatch)
                    ranking = JSON.parse(jsonMatch[0]);
            }
            catch {
                issues.push(`Q${questionNum}: couldn't parse ranking response "${claudeRaw}"`);
            }
            // Map back to keys
            const resolvedRanking = [];
            for (const item of ranking) {
                // Find matching key
                const match = data.rankItems.find(r => r.key === item || item.includes(r.key) || r.key.includes(item) ||
                    r.label.toLowerCase().includes(item.toLowerCase().slice(0, 15)));
                if (match && !resolvedRanking.includes(match.key)) {
                    resolvedRanking.push(match.key);
                }
            }
            // Add any missing items at the end
            for (const r of data.rankItems) {
                if (!resolvedRanking.includes(r.key))
                    resolvedRanking.push(r.key);
            }
            answer = resolvedRanking;
            // Reorder DOM elements via evaluate
            await page.evaluate((order) => {
                const container = document.getElementById('ranking-list');
                if (!container)
                    return;
                for (const key of order) {
                    const item = container.querySelector(`[data-item="${key}"]`);
                    if (item)
                        container.appendChild(item);
                }
                // Update numbers
                container.querySelectorAll('.ranking-item').forEach((item, i) => {
                    const numEl = item.querySelector('.ranking-number');
                    if (numEl)
                        numEl.textContent = String(i + 1);
                });
            }, resolvedRanking);
            await page.click('.continue-btn');
        }
        else if (qType === 'best_worst') {
            const bwLabels = data.bwItems.map(b => `${b.key}: ${b.label}`);
            claudeRaw = await askClaude(archetypeName, data.questionText, qType, [], undefined, undefined, undefined, bwLabels);
            let bw = { best: '', worst: '' };
            try {
                const jsonMatch = claudeRaw.match(/\{[\s\S]*\}/);
                if (jsonMatch)
                    bw = JSON.parse(jsonMatch[0]);
            }
            catch {
                issues.push(`Q${questionNum}: couldn't parse best/worst response "${claudeRaw}"`);
            }
            // Resolve keys
            const resolveBWKey = (val) => {
                const exact = data.bwItems.find(b => b.key === val);
                if (exact)
                    return exact.key;
                const fuzzy = data.bwItems.find(b => val.includes(b.key) || b.key.includes(val) ||
                    b.label.toLowerCase().includes(val.toLowerCase().slice(0, 15)));
                return fuzzy?.key || data.bwItems[0]?.key || '';
            };
            const bestKey = resolveBWKey(bw.best);
            let worstKey = resolveBWKey(bw.worst);
            if (worstKey === bestKey) {
                // Pick a different one
                worstKey = data.bwItems.find(b => b.key !== bestKey)?.key || '';
            }
            answer = { best: bestKey, worst: worstKey };
            // Click best button, then worst button (auto-submits after both selected)
            if (bestKey) {
                await page.click(`#bw-row-${bestKey} .best-btn`);
                await page.waitForTimeout(100);
            }
            if (worstKey) {
                await page.click(`#bw-row-${worstKey} .worst-btn`);
            }
        }
        else {
            claudeRaw = 'unknown type';
            answer = null;
        }
    }
    catch (err) {
        claudeRaw = `ERROR: ${err.message}`;
        answer = null;
        issues.push(`Q${questionNum}: error - ${err.message}`);
        await page.screenshot({ path: path.join(SCREENSHOT_DIR, `error-q${questionNum}.png`) });
    }
    return {
        qId: data.qId,
        qText: data.questionText,
        qType,
        options: data.mcOptions.map(o => o.label),
        answer,
        claudeRaw: claudeRaw,
    };
}
// Shared variable for captured results from route intercept
let capturedResults = null;
// ── Run one archetype ─────────────────────────────────────────────────────────
async function runArchetype(page, archetype) {
    capturedResults = null; // Reset for each archetype
    console.log(`\n${'═'.repeat(60)}`);
    console.log(`Starting: [${archetype.id}] ${archetype.name}`);
    console.log(`${'═'.repeat(60)}`);
    // Navigate and start quiz
    await page.goto(QUIZ_URL, { waitUntil: 'networkidle' });
    // No injection needed — we'll detect the redirect via URL change
    await page.waitForSelector('.start-btn', { timeout: 10_000 });
    await page.click('.start-btn');
    await page.waitForSelector('#quiz-area', { state: 'visible', timeout: 5_000 });
    const answers = [];
    const issues = [];
    let questionNum = 0;
    let lastQuestion = '';
    let stuckCount = 0;
    let prevQuestionText = '';
    const startTime = Date.now();
    while (Date.now() - startTime < ARCHETYPE_TIMEOUT) {
        // Wait for question content to appear
        await page.waitForTimeout(500);
        // Check if we've navigated to results page (redirect happened)
        const currentUrl = page.url();
        if (currentUrl.includes('prism-results')) {
            const resultsJson = await page.evaluate(() => localStorage.getItem('prism-results')).catch(() => null);
            if (resultsJson) {
                const results = JSON.parse(resultsJson);
                console.log(`  Result: ${results.archetypeName} (${(results.confidence * 100).toFixed(1)}%)`);
                return buildResult(archetype, results, questionNum, lastQuestion, issues, answers);
            }
        }
        const resultsJson = await page.evaluate(() => localStorage.getItem('prism-results')).catch(() => null);
        if (resultsJson) {
            const results = JSON.parse(resultsJson);
            console.log(`  Result: ${results.archetypeName} (${(results.confidence * 100).toFixed(1)}%)`);
            return buildResult(archetype, results, questionNum, lastQuestion, issues, answers);
        }
        // Check if we're still on a question
        const hasQuestion = await page.$('.question-card');
        if (!hasQuestion) {
            // Maybe between questions, wait a bit
            await page.waitForTimeout(300);
            continue;
        }
        // Check for same question (stuck detection)
        const currentQText = await page.$eval('.question-text', el => el.textContent?.trim() || '').catch(() => '');
        if (currentQText === prevQuestionText && currentQText !== '') {
            stuckCount++;
            if (stuckCount > 5) {
                issues.push(`Q${questionNum}: stuck on same question, skipping`);
                await page.screenshot({ path: path.join(SCREENSHOT_DIR, `stuck-${archetype.id}-q${questionNum}.png`) });
                break;
            }
            await page.waitForTimeout(500);
            continue;
        }
        stuckCount = 0;
        prevQuestionText = currentQText;
        questionNum++;
        lastQuestion = currentQText;
        console.log(`  Q${questionNum}: ${currentQText.slice(0, 70)}...`);
        const record = await answerQuestion(page, archetype.name, questionNum, issues);
        if (record) {
            answers.push(record);
            console.log(`    → ${typeof record.answer === 'object' ? JSON.stringify(record.answer) : record.answer}`);
        }
        // Wait for next question or results
        await page.waitForTimeout(800);
        // Check if we redirected to results page after answering
        await page.waitForTimeout(500);
        const midUrl = page.url();
        let midCheckResults = null;
        if (midUrl.includes('prism-results')) {
            midCheckResults = await page.evaluate(() => localStorage.getItem('prism-results')).catch(() => null);
        }
        else {
            midCheckResults = await page.evaluate(() => localStorage.getItem('prism-results')).catch(() => null);
        }
        if (midCheckResults) {
            const results = JSON.parse(midCheckResults);
            console.log(`  Result: ${results.archetypeName} (${(results.confidence * 100).toFixed(1)}%)`);
            return buildResult(archetype, results, questionNum, lastQuestion, issues, answers);
        }
    }
    // If we got here without results, wait and check URL + localStorage
    await page.waitForTimeout(3000);
    const endUrl = page.url();
    if (endUrl.includes('prism-results')) {
        await page.goto(QUIZ_URL, { waitUntil: 'networkidle' });
    }
    const finalResults = await page.evaluate(() => localStorage.getItem('prism-results')).catch(() => null);
    if (finalResults) {
        const results = JSON.parse(finalResults);
        return buildResult(archetype, results, questionNum, lastQuestion, issues, answers);
    }
    issues.push('Timed out or quiz did not complete');
    return buildResult(archetype, { archetypeName: 'TIMEOUT', confidence: 0, top5: [] }, questionNum, lastQuestion, issues, answers);
}
// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
    const runAll = process.argv.includes('--all');
    const allArchetypes = getArchetypes();
    const archetypes = runAll
        ? allArchetypes
        : allArchetypes.filter(a => a.id === '134');
    if (archetypes.length === 0) {
        console.error('No archetypes found!');
        process.exit(1);
    }
    console.log(`PRISM Semantic Playthrough`);
    console.log(`Running ${archetypes.length} archetype(s): ${archetypes.map(a => a.name).join(', ')}`);
    console.log(`Quiz URL: ${QUIZ_URL}\n`);
    // Ensure output dirs
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await context.newPage();
    // Let redirects happen naturally — we'll detect URL change
    page.on('pageerror', () => { });
    const results = [];
    for (const archetype of archetypes) {
        // Clear localStorage before each run
        await page.goto(QUIZ_URL, { waitUntil: 'networkidle' });
        await page.evaluate(() => localStorage.clear());
        const result = await runArchetype(page, archetype);
        results.push(result);
        // Save incrementally + update HTML report
        fs.writeFileSync(RESULTS_FILE, JSON.stringify(results, null, 2));
        generateReport(results, archetypes.length);
        // Summary
        const matchStr = result.match ? '✓ MATCH' : '✗ MISMATCH';
        console.log(`\n  ${matchStr}: expected "${archetype.name}", got "${result.resultArchetype}" (${(result.resultConfidence * 100).toFixed(1)}%)`);
        if (result.top5.length > 0) {
            console.log(`  Top 5:`);
            result.top5.forEach((t, i) => {
                console.log(`    ${i + 1}. ${t.name} (${(t.score * 100).toFixed(1)}%)`);
            });
        }
        if (result.issues.length > 0) {
            console.log(`  Issues: ${result.issues.join('; ')}`);
        }
    }
    await browser.close();
    // Final summary
    console.log(`\n${'═'.repeat(60)}`);
    console.log('FINAL SUMMARY');
    console.log(`${'═'.repeat(60)}`);
    const matches = results.filter(r => r.match).length;
    const total = results.length;
    console.log(`Matches: ${matches}/${total} (${(matches / total * 100).toFixed(1)}%)`);
    const allIssues = results.flatMap(r => r.issues);
    if (allIssues.length > 0) {
        console.log(`\nIssues found: ${allIssues.length}`);
        allIssues.forEach(i => console.log(`  - ${i}`));
    }
    console.log(`\nResults saved to: ${RESULTS_FILE}`);
}
main().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
//# sourceMappingURL=semantic-playthrough.js.map