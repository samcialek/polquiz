const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  // Capture console output from the page
  page.on('console', msg => console.log('PAGE:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));
  
  await page.goto('https://matricesofconfusion.com/prism-quiz-v3.html', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2000);
  
  // Click begin
  const btns = await page.$$('button');
  for (const btn of btns) {
    const text = await btn.textContent();
    if (/begin/i.test(text)) { await btn.click(); break; }
  }
  await page.waitForTimeout(1000);
  
  // Answer 20 questions rapidly
  for (let i = 0; i < 20; i++) {
    const qInfo = await page.evaluate(() => {
      const q = PrismEngine.getNextQuestion();
      if (!q) return null;
      return { id: q.id, prompt: q.promptShort, type: q.uiType };
    });
    if (!qInfo) { console.log('No more questions at step', i); break; }
    
    // Simple answer based on type
    let answer;
    if (qInfo.type === 'single_choice') {
      const opts = await page.evaluate((qId) => {
        const q = PrismEngine.getQuestionDef(qId);
        return Object.keys(q.optionEvidence || {});
      }, qInfo.id);
      answer = opts[0];
    } else if (qInfo.type === 'slider') {
      answer = 50;
    } else if (qInfo.type === 'allocation') {
      const buckets = await page.evaluate((qId) => {
        const q = PrismEngine.getQuestionDef(qId);
        return Object.keys(q.allocationMap || {});
      }, qInfo.id);
      answer = {};
      const each = Math.floor(100 / buckets.length);
      buckets.forEach((b, i) => { answer[b] = i === buckets.length - 1 ? 100 - each * (buckets.length - 1) : each; });
    } else if (qInfo.type === 'ranking') {
      const items = await page.evaluate((qId) => {
        const q = PrismEngine.getQuestionDef(qId);
        return Object.keys(q.rankingMap || {});
      }, qInfo.id);
      answer = items;
    } else if (qInfo.type === 'pairwise') {
      const pair = await page.evaluate((qId) => {
        const q = PrismEngine.getQuestionDef(qId);
        const pairName = Object.keys(q.pairMaps || {})[0];
        return Object.keys(q.pairMaps[pairName]);
      }, qInfo.id);
      answer = pair[0];
    } else if (qInfo.type === 'best_worst') {
      const items = await page.evaluate((qId) => {
        const q = PrismEngine.getQuestionDef(qId);
        return Object.keys(q.rankingMap || {});
      }, qInfo.id);
      answer = { best: items[0], worst: items[items.length - 1] };
    } else {
      answer = 50;
    }
    
    console.log(`Q${qInfo.id} (${qInfo.type}): ${JSON.stringify(answer).slice(0, 80)}`);
    
    try {
      await page.evaluate(({ qId, val }) => {
        PrismEngine.submitAnswer(qId, val);
        if (typeof showQuestion === 'function') showQuestion();
      }, { qId: qInfo.id, val: answer });
    } catch(e) {
      console.log('SUBMIT ERROR:', e.message);
      break;
    }
    
    await page.waitForTimeout(100);
  }
  
  // Check results
  const result = await page.evaluate(() => {
    const res = PrismEngine.getResults();
    const prog = PrismEngine.getProgress();
    return { res, prog };
  });
  console.log('\nFINAL RESULTS:', JSON.stringify(result, null, 2));
  
  await browser.close();
})();
