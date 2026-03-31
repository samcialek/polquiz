/**
 * PRISM Archetype Quiz Runner — All 130 archetypes via Playwright
 * 
 * For each archetype, answers questions optimally based on node profile,
 * records what the quiz assigns, and generates an HTML report.
 * 
 * Usage: node quiz-all-archetypes.cjs [startId] [endId]
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const QUIZ_URL = 'https://matricesofconfusion.com/prism-quiz-v3.html';
const RESULTS_FILE = path.join(__dirname, 'output', 'archetype-quiz-results.json');
const REPORT_FILE = path.join(__dirname, 'output', 'archetype-quiz-report.html');

// ── Load data ──────────────────────────────────────────────────────────
const archetypes = JSON.parse(fs.readFileSync(path.join(__dirname, 'output/live-data/archetypes.json'), 'utf-8'));

// Load engine bundle in VM to extract questions
const bundleSrc = fs.readFileSync(path.join(__dirname, 'dist/prism-engine-bundle.min.js'), 'utf-8');
const sandbox = { console };
const ctx = vm.createContext(sandbox);
vm.runInContext(bundleSrc, ctx);
const PE = sandbox.PrismEngine;
PE.initQuiz();

// Extract all question definitions
const qIds = PE.getQuestionIds();
const questions = {};
for (const qId of qIds) {
  const q = PE.getQuestionDef(qId);
  questions[qId] = q;
}
console.log(`Loaded ${Object.keys(questions).length} questions from engine`);
console.log(`Loaded ${archetypes.length} archetypes`);

// ── Answer computation ─────────────────────────────────────────────────
function getOptimalAnswer(archetype, question) {
  const nodes = archetype.nodes;
  const uiType = question.uiType;

  // Score option evidence (probability distribution format from optionEvidence/sliderMap)
  function scoreEvidence(evidence) {
    let score = 0;
    if (evidence.continuous) {
      for (const [nodeName, ev] of Object.entries(evidence.continuous)) {
        const np = nodes[nodeName];
        if (!np || np.kind !== 'continuous') continue;
        if (Array.isArray(ev.pos) && ev.pos.length >= np.pos) {
          score += ev.pos[np.pos - 1] * (np.sal || 1);
        }
        if (Array.isArray(ev.sal) && np.sal) {
          const si = Math.min(np.sal - 1, ev.sal.length - 1);
          if (si >= 0) score += ev.sal[si] * 0.3;
        }
      }
    }
    if (evidence.categorical) {
      for (const [nodeName, ev] of Object.entries(evidence.categorical)) {
        const np = nodes[nodeName];
        if (!np || np.kind !== 'categorical') continue;
        if (ev.cat && np.probs) {
          for (let i = 0; i < Math.min(ev.cat.length, np.probs.length); i++) {
            score += ev.cat[i] * np.probs[i] * (np.sal || 1);
          }
        }
      }
    }
    return score;
  }

  // Score directional weight evidence (from allocationMap/rankingMap)
  // Format: { continuous: { NODE: weight }, categorical: { NODE: [probs] } }
  // Weight is directional: positive means high node value is good, negative means low is good
  function scoreDirectional(evidence) {
    let score = 0;
    if (evidence.continuous) {
      for (const [nodeName, weight] of Object.entries(evidence.continuous)) {
        const np = nodes[nodeName];
        if (!np || np.kind !== 'continuous') continue;
        // Archetype position 1-5, normalize to -1 to +1
        const normPos = (np.pos - 3) / 2;
        score += weight * normPos * (np.sal || 1);
      }
    }
    if (evidence.categorical) {
      for (const [nodeName, catProbs] of Object.entries(evidence.categorical)) {
        const np = nodes[nodeName];
        if (!np || np.kind !== 'categorical') continue;
        if (Array.isArray(catProbs) && np.probs) {
          for (let i = 0; i < Math.min(catProbs.length, np.probs.length); i++) {
            score += catProbs[i] * np.probs[i] * (np.sal || 1);
          }
        }
      }
    }
    return score;
  }

  if (uiType === 'single_choice' && question.optionEvidence) {
    const options = Object.keys(question.optionEvidence);
    let best = options[0], bestScore = -Infinity;
    for (const opt of options) {
      const s = scoreEvidence(question.optionEvidence[opt]);
      if (s > bestScore) { bestScore = s; best = opt; }
    }
    return { type: 'mc', value: best };
  }

  if (uiType === 'slider') {
    const sliderMap = question.sliderMap || question.optionEvidence;
    if (sliderMap) {
      const ranges = Object.keys(sliderMap);
      let best = '41-60', bestScore = -Infinity;
      for (const range of ranges) {
        const s = scoreEvidence(sliderMap[range]);
        if (s > bestScore) { bestScore = s; best = range; }
      }
      const [lo, hi] = best.split('-').map(Number);
      return { type: 'slider', value: Math.round((lo + hi) / 2) };
    }
    // Fallback: use primary touch node
    const touch = (question.touchProfile || []).find(t => t.kind === 'continuous' && t.role === 'position');
    if (touch && nodes[touch.node]) {
      const posToVal = { 1: 10, 2: 30, 3: 50, 4: 70, 5: 90 };
      return { type: 'slider', value: posToVal[nodes[touch.node].pos] || 50 };
    }
    return { type: 'slider', value: 50 };
  }

  if (uiType === 'allocation' && question.allocationMap) {
    const keys = Object.keys(question.allocationMap);
    const scores = {};
    let totalScore = 0;
    for (const k of keys) {
      // Shift scores so they're all positive for proportional allocation
      const s = scoreDirectional(question.allocationMap[k]);
      scores[k] = s;
    }
    // Shift to make all positive
    const minS = Math.min(...Object.values(scores));
    for (const k of keys) {
      scores[k] = Math.max(0.1, scores[k] - minS + 0.1);
      totalScore += scores[k];
    }
    const values = {};
    let assigned = 0;
    keys.forEach((k, i) => {
      if (i === keys.length - 1) values[k] = 100 - assigned;
      else { values[k] = Math.round((scores[k] / totalScore) * 100); assigned += values[k]; }
    });
    return { type: 'allocation', value: values };
  }

  if (uiType === 'ranking' && question.rankingMap) {
    const keys = Object.keys(question.rankingMap);
    const scored = keys.map(k => ({ k, s: scoreDirectional(question.rankingMap[k]) }));
    scored.sort((a, b) => b.s - a.s);
    return { type: 'ranking', value: scored.map(x => x.k) };
  }

  if (uiType === 'pairwise' && question.pairMaps) {
    // pairMaps has { pairName: { option1: evidence, option2: evidence } }
    const pairName = Object.keys(question.pairMaps)[0];
    const pair = question.pairMaps[pairName];
    const options = Object.keys(pair);
    let best = options[0], bestScore = -Infinity;
    for (const opt of options) {
      const s = scoreDirectional(pair[opt]);
      if (s > bestScore) { bestScore = s; best = opt; }
    }
    return { type: 'pairwise', value: best };
  }

  if (uiType === 'best_worst' && question.rankingMap) {
    const keys = Object.keys(question.rankingMap);
    const scored = keys.map(k => ({ k, s: scoreDirectional(question.rankingMap[k]) }));
    scored.sort((a, b) => b.s - a.s);
    return { type: 'best_worst', value: { best: scored[0].k, worst: scored[scored.length - 1].k } };
  }

  // Fallback
  if (question.optionEvidence) {
    return { type: 'mc', value: Object.keys(question.optionEvidence)[0] };
  }
  if (question.allocationMap) {
    const keys = Object.keys(question.allocationMap);
    const even = Math.floor(100 / keys.length);
    const values = {};
    keys.forEach((k, i) => { values[k] = i === keys.length - 1 ? 100 - even * (keys.length - 1) : even; });
    return { type: 'allocation', value: values };
  }
  return { type: 'slider', value: 50 };
}

// ── Pre-compute answers ────────────────────────────────────────────────
console.log('Pre-computing optimal answers for all archetypes...');
const answerMaps = {};
for (const arch of archetypes) {
  answerMaps[arch.id] = {};
  for (const [qId, q] of Object.entries(questions)) {
    answerMaps[arch.id][qId] = getOptimalAnswer(arch, q);
  }
}
console.log('Done.\n');

// ── Browser automation ─────────────────────────────────────────────────
async function runQuizForArchetype(browser, archetype) {
  const startTime = Date.now();
  const context = await browser.newContext();
  const page = await context.newPage();
  const answered = [];

  try {
    await page.goto(QUIZ_URL, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);

    // Debug: check if PrismEngine exists
    const engineCheck = await page.evaluate(() => {
      return {
        hasPE: typeof PrismEngine !== 'undefined',
        hasShowQ: typeof showQuestion !== 'undefined',
        title: document.title,
        bodyLen: document.body.innerHTML.length,
      };
    });
    if (!engineCheck.hasPE) {
      console.log(`  WARNING: PrismEngine not found on page! Title: ${engineCheck.title}`);
    }

    // Click start button
    try {
      const btns = await page.$$('button');
      for (const btn of btns) {
        const text = await btn.textContent();
        if (/start|begin|take/i.test(text)) {
          await btn.click();
          await page.waitForTimeout(1000);
          break;
        }
      }
    } catch(e) { /* no start button */ }

    let loops = 0;
    const maxLoops = 80;
    let earlyResult = null;

    while (loops < maxLoops) {
      loops++;

      // Check if quiz is complete
      const state = await page.evaluate(() => {
        if (typeof PrismEngine === 'undefined') return { done: false, noEngine: true };
        return {
          done: PrismEngine.isComplete(),
          nAnswered: PrismEngine.getProgress().questionsAnswered,
        };
      });

      if (state.done || state.noEngine) break;

      // Get current question
      const qInfo = await page.evaluate(() => {
        const q = PrismEngine.getNextQuestion();
        if (!q) return null;
        return { id: q.id, promptShort: q.promptShort, uiType: q.uiType };
      });

      if (!qInfo) {
        await page.waitForTimeout(300);
        continue;
      }

      const answer = answerMaps[archetype.id][qInfo.id];
      if (!answer) {
        // Skip question
        await page.evaluate((qId) => PrismEngine.submitAnswer(qId, null), qInfo.id);
        await page.waitForTimeout(200);
        continue;
      }

      // Submit via engine directly (reliable, bypasses UI animation delays)
      // Submit answer and immediately grab results (before showQuestion navigates away)
      const serializedAnswer = JSON.parse(JSON.stringify(answer.value));
      try {
        const submitResult = await page.evaluate(({ qId, val }) => {
          PrismEngine.submitAnswer(qId, val);
          // DON'T call showQuestion() — it navigates to results page when done
          const complete = PrismEngine.isComplete();
          if (complete) {
            // Grab results NOW before any navigation
            const res = PrismEngine.getResults();
            const prog = PrismEngine.getProgress();
            return { complete: true, res, prog };
          }
          return { complete: false };
        }, { qId: qInfo.id, val: serializedAnswer });
        
        answered.push({ id: qInfo.id, prompt: qInfo.promptShort, type: qInfo.uiType, answer: answer.value });
        
        if (submitResult.complete) {
          // Store results and break
          earlyResult = submitResult;
          break;
        }
      } catch(submitErr) {
        console.log(`  SUBMIT ERROR Q${qInfo.id} (${qInfo.uiType}): ${submitErr.message.slice(0, 100)}`);
        try { await page.evaluate((qId) => PrismEngine.submitAnswer(qId, null), qInfo.id); } catch(e2) {}
      }
      
      await page.waitForTimeout(100);
    }

    // Get results — either from earlyResult (captured before navigation) or from page
    let result;
    if (earlyResult && earlyResult.res) {
      const res = earlyResult.res;
      const prog = earlyResult.prog;
      result = {
        topName: res.match ? res.match.name : null,
        topId: res.match ? res.match.id : null,
        topPosterior: res.match ? res.match.posterior : null,
        top5: (res.top5 || []).map(a => ({ id: a.id, name: a.name, prob: a.posterior })),
        nAnswered: prog ? prog.questionsAnswered : answered.length,
      };
    } else {
      // Try from page (may fail if navigated)
      await page.waitForTimeout(500);
      result = await page.evaluate(() => {
        if (typeof PrismEngine === 'undefined') return { error: 'no engine' };
        try {
          const res = PrismEngine.getResults();
          const prog = PrismEngine.getProgress();
          return {
            topName: res && res.match ? res.match.name : (prog.topArchetypes && prog.topArchetypes[0] ? prog.topArchetypes[0].name : null),
            topId: res && res.match ? res.match.id : (prog.topArchetypes && prog.topArchetypes[0] ? prog.topArchetypes[0].id : null),
            topPosterior: res && res.match ? res.match.posterior : null,
            top5: res && res.top5 ? res.top5.map(a => ({ id: a.id, name: a.name, prob: a.posterior })) :
                  (prog.topArchetypes || []).map(a => ({ id: a.id, name: a.name, prob: a.posterior })),
            nAnswered: prog.questionsAnswered,
          };
        } catch(e) { return { error: e.message }; }
      });
    }
    
    if (result.error) console.log(`  RESULT ERROR: ${result.error}`);
    
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    const match = result.topId === archetype.id;
    const top5Str = (result.top5 || []).map(a => `${a.name}(${(a.prob*100).toFixed(1)}%)`).join(', ');

    console.log(`  → ${result.topName || '?'} ${match ? '✅' : '❌'} | ${result.nAnswered}Q | ${elapsed}s | Top5: ${top5Str}`);

    return {
      archetypeId: archetype.id,
      archetypeName: archetype.name,
      gotId: result.topId,
      gotName: result.topName,
      match,
      topPosterior: result.topPosterior,
      questionsAnswered: result.nAnswered || answered.length,
      top5: result.top5 || [],
      answeredQuestions: answered,
      elapsed: parseFloat(elapsed),
    };

  } catch (err) {
    console.error(`  ERROR: ${err.message}`);
    return {
      archetypeId: archetype.id,
      archetypeName: archetype.name,
      error: err.message,
      match: false,
      questionsAnswered: answered.length,
      answeredQuestions: answered,
      elapsed: ((Date.now() - startTime) / 1000).toFixed(1),
    };
  } finally {
    await context.close();
  }
}

// ── Report generator ───────────────────────────────────────────────────
function generateReport(results) {
  const matches = results.filter(r => r.match).length;
  const errors = results.filter(r => r.error).length;
  const total = results.length;
  const pct = ((matches / total) * 100).toFixed(1);
  const avgQ = (results.reduce((s, r) => s + (r.questionsAnswered || 0), 0) / total).toFixed(1);
  const avgT = (results.reduce((s, r) => s + (parseFloat(r.elapsed) || 0), 0) / total).toFixed(1);

  // Top-3 and top-5 accuracy
  const top3 = results.filter(r => !r.error && r.top5 && r.top5.slice(0,3).some(t => t.id === r.archetypeId)).length;
  const top5 = results.filter(r => !r.error && r.top5 && r.top5.some(t => t.id === r.archetypeId)).length;
  const nonError = total - errors;

  // Mismatch analysis
  const mismatches = results.filter(r => !r.match && !r.error);
  const gotCounts = {};
  mismatches.forEach(r => { gotCounts[r.gotName || '?'] = (gotCounts[r.gotName || '?'] || 0) + 1; });
  const topAttractors = Object.entries(gotCounts).sort((a,b) => b[1] - a[1]).slice(0, 10);

  let html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>PRISM Archetype Quiz Accuracy Report</title>
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family:'Segoe UI',system-ui,sans-serif; background:#0a0a0f; color:#e0e0e0; padding:20px; max-width:1400px; margin:0 auto; }
  h1 { text-align:center; margin:20px 0 10px; color:#00D4FF; font-size:1.8em; }
  .stats { display:flex; justify-content:center; gap:30px; flex-wrap:wrap; margin:20px 0; }
  .stat { text-align:center; padding:15px 20px; background:#1a1a2e; border-radius:8px; min-width:120px; }
  .stat-val { font-size:2em; font-weight:700; }
  .stat-val.good { color:#00ff88; } .stat-val.ok { color:#FFE135; } .stat-val.bad { color:#FF6B6B; }
  .stat-label { font-size:0.8em; color:#888; margin-top:4px; }
  .attractors { margin:20px 0; padding:15px; background:#1a1a2e; border-radius:8px; }
  .attractors h3 { color:#FF6B6B; margin-bottom:10px; }
  .attractors .bar { display:flex; align-items:center; margin:4px 0; }
  .attractors .bar-fill { background:#FF6B6B; height:18px; border-radius:3px; margin-right:8px; min-width:2px; }
  .attractors .bar-label { font-size:0.8em; }
  .filter-bar { text-align:center; margin:15px 0; }
  .filter-bar button { background:#1a1a2e; color:#ccc; border:1px solid #333; padding:6px 14px; margin:0 4px; border-radius:4px; cursor:pointer; font-size:0.85em; }
  .filter-bar button.active { background:#00D4FF; color:#000; border-color:#00D4FF; }
  table { width:100%; border-collapse:collapse; margin:10px 0; font-size:0.82em; }
  th { background:#1a1a2e; padding:8px 6px; text-align:left; font-weight:600; color:#00D4FF; border-bottom:2px solid #333; position:sticky; top:0; }
  td { padding:6px; border-bottom:1px solid #1a1a2e; }
  tr:hover { background:#12122a; }
  .match { color:#00ff88; } .mismatch { color:#FF6B6B; } .error { color:#ff8800; }
  .top5 { font-size:0.8em; color:#777; }
  .pos { color:#00ff88; } .neg { color:#FF6B6B; }
</style>
</head>
<body>
<h1>🔬 PRISM Archetype Quiz Accuracy Report</h1>
<p style="text-align:center;color:#888;margin-bottom:15px;">130 archetypes tested against the live quiz engine with optimal answers derived from node profiles.</p>

<div class="stats">
  <div class="stat"><div class="stat-val ${pct >= 70 ? 'good' : pct >= 40 ? 'ok' : 'bad'}">${pct}%</div><div class="stat-label">Top-1 Accuracy</div></div>
  <div class="stat"><div class="stat-val ${top3/nonError*100 >= 80 ? 'good' : 'ok'}">${nonError ? ((top3/nonError)*100).toFixed(1) : 0}%</div><div class="stat-label">Top-3 Accuracy</div></div>
  <div class="stat"><div class="stat-val ${top5/nonError*100 >= 90 ? 'good' : 'ok'}">${nonError ? ((top5/nonError)*100).toFixed(1) : 0}%</div><div class="stat-label">Top-5 Accuracy</div></div>
  <div class="stat"><div class="stat-val" style="color:#00D4FF;">${avgQ}</div><div class="stat-label">Avg Questions</div></div>
  <div class="stat"><div class="stat-val" style="color:#00D4FF;">${avgT}s</div><div class="stat-label">Avg Time</div></div>
  <div class="stat"><div class="stat-val" style="color:#888;">${errors}</div><div class="stat-label">Errors</div></div>
</div>`;

  if (topAttractors.length > 0) {
    const maxCount = topAttractors[0][1];
    html += `<div class="attractors"><h3>🧲 Top Attractor Archetypes (misassigned to)</h3>`;
    for (const [name, count] of topAttractors) {
      const w = Math.round((count / maxCount) * 200);
      html += `<div class="bar"><div class="bar-fill" style="width:${w}px;"></div><div class="bar-label">${name}: ${count} times</div></div>`;
    }
    html += `</div>`;
  }

  html += `
<div class="filter-bar">
  <button class="active" onclick="filterRows('all')">All (${total})</button>
  <button onclick="filterRows('match')">✅ Match (${matches})</button>
  <button onclick="filterRows('mismatch')">❌ Mismatch (${total - matches - errors})</button>
  ${errors > 0 ? `<button onclick="filterRows('error')">⚠️ Error (${errors})</button>` : ''}
</div>
<table><thead><tr>
  <th>ID</th><th>Expected</th><th>Got</th><th></th><th>Conf</th><th>Q</th><th>Top 5</th>
</tr></thead><tbody>`;

  for (const r of results) {
    const st = r.error ? 'error' : (r.match ? 'match' : 'mismatch');
    const icon = r.error ? '⚠️' : (r.match ? '✅' : '❌');
    const conf = r.topPosterior ? `${(r.topPosterior * 100).toFixed(1)}%` : '-';
    const t5 = (r.top5 || []).map(a => {
      const cls = a.id === r.archetypeId ? 'pos' : '';
      return `<span class="${cls}">${a.name} ${(a.prob*100).toFixed(1)}%</span>`;
    }).join(' · ');
    html += `<tr data-status="${st}"><td>${r.archetypeId}</td><td>${r.archetypeName}</td><td class="${st}">${r.gotName || r.error?.slice(0,40) || '-'}</td><td>${icon}</td><td>${conf}</td><td>${r.questionsAnswered||0}</td><td class="top5">${t5}</td></tr>`;
  }

  html += `</tbody></table>
<script>
function filterRows(t){document.querySelectorAll('.filter-bar button').forEach(b=>b.classList.remove('active'));event.target.classList.add('active');document.querySelectorAll('tbody tr').forEach(r=>{r.style.display=t==='all'||r.dataset.status===t?'':'none';});}
</script>
</body></html>`;
  return html;
}

// ── Main ───────────────────────────────────────────────────────────────
async function main() {
  const args = process.argv.slice(2);
  const startId = args[0] ? parseInt(args[0]) : 1;
  const endId = args[1] ? parseInt(args[1]) : 130;

  console.log(`=== PRISM Archetype Quiz Runner ===`);
  console.log(`Archetypes ${String(startId).padStart(3,'0')}–${String(endId).padStart(3,'0')}`);
  console.log(`URL: ${QUIZ_URL}\n`);

  // Resume from existing results
  let allResults = [];
  if (fs.existsSync(RESULTS_FILE)) {
    try { allResults = JSON.parse(fs.readFileSync(RESULTS_FILE, 'utf-8')); } catch(e) {}
  }
  // Keep results outside our range
  const outsideResults = allResults.filter(r => {
    const id = parseInt(r.archetypeId);
    return id < startId || id > endId;
  });

  const browser = await chromium.launch({
    headless: false,
    args: ['--disable-blink-features=AutomationControlled'],
  });

  const targets = archetypes.filter(a => {
    const id = parseInt(a.id);
    return id >= startId && id <= endId;
  });

  console.log(`Running ${targets.length} archetypes...\n`);
  const newResults = [];
  let done = 0;

  for (const arch of targets) {
    done++;
    process.stdout.write(`[${done}/${targets.length}] ${arch.id} ${arch.name} `);
    const result = await runQuizForArchetype(browser, arch);
    newResults.push(result);

    // Save checkpoint
    const combined = [...outsideResults, ...newResults].sort((a,b) => a.archetypeId.localeCompare(b.archetypeId));
    fs.writeFileSync(RESULTS_FILE, JSON.stringify(combined, null, 2));

    // Update report every 5
    if (done % 5 === 0 || done === targets.length) {
      fs.writeFileSync(REPORT_FILE, generateReport(combined));
    }
  }

  await browser.close();

  // Final report
  const final = [...outsideResults, ...newResults].sort((a,b) => a.archetypeId.localeCompare(b.archetypeId));
  fs.writeFileSync(RESULTS_FILE, JSON.stringify(final, null, 2));
  fs.writeFileSync(REPORT_FILE, generateReport(final));

  const m = final.filter(r => r.match).length;
  console.log(`\n=== DONE ===`);
  console.log(`${m}/${final.length} matches (${((m/final.length)*100).toFixed(1)}%)`);
  console.log(`Report: ${REPORT_FILE}`);
}

main().catch(console.error);
