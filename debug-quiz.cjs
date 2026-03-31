const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto('https://matricesofconfusion.com/prism-quiz-v3.html', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(3000);
  
  const info = await page.evaluate(() => {
    return {
      hasPE: typeof PrismEngine !== 'undefined',
      peKeys: typeof PrismEngine !== 'undefined' ? Object.keys(PrismEngine) : [],
      hasShowQ: typeof showQuestion !== 'undefined',
      title: document.title,
      buttons: Array.from(document.querySelectorAll('button')).map(b => b.textContent.trim()).slice(0, 10),
      visibleText: document.body.innerText.slice(0, 500),
    };
  });
  console.log('Page state:', JSON.stringify(info, null, 2));
  
  // Try clicking any visible start/begin button
  const btns = await page.$$('button');
  for (const btn of btns) {
    const text = await btn.textContent();
    console.log('Button found:', text.trim());
    if (/start|begin|take/i.test(text)) {
      console.log('Clicking:', text.trim());
      await btn.click();
      await page.waitForTimeout(2000);
      break;
    }
  }
  
  // Check engine state
  const info2 = await page.evaluate(() => {
    if (typeof PrismEngine === 'undefined') return { noPE: true };
    try {
      const q = PrismEngine.getNextQuestion();
      return {
        nextQ: q ? { id: q.id, prompt: q.promptShort, type: q.uiType } : null,
        progress: PrismEngine.getProgress(),
        isComplete: PrismEngine.isComplete(),
      };
    } catch(e) {
      return { error: e.message };
    }
  });
  console.log('Engine state:', JSON.stringify(info2, null, 2));
  
  // Submit answer Q1
  if (info2.nextQ) {
    console.log('Submitting answer for Q' + info2.nextQ.id);
    await page.evaluate(() => {
      PrismEngine.submitAnswer(1, 'most_days');
      if (typeof showQuestion === 'function') showQuestion();
    });
    await page.waitForTimeout(500);
    
    const info3 = await page.evaluate(() => {
      const q = PrismEngine.getNextQuestion();
      const r = PrismEngine.getResults();
      const p = PrismEngine.getProgress();
      return {
        nextQ: q ? { id: q.id, prompt: q.promptShort } : null,
        progress: p,
        resultsMatch: r && r.match ? r.match.name : null,
        resultsTop5Count: r && r.top5 ? r.top5.length : 0,
      };
    });
    console.log('After Q1:', JSON.stringify(info3, null, 2));
  }
  
  await browser.close();
})();
