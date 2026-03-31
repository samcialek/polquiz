const fs = require('fs');
const arcSrc = fs.readFileSync('src/config/archetypes.ts', 'utf8');
const results = JSON.parse(fs.readFileSync('output/scoring-experiment-results.json', 'utf8'));
const quizResults = JSON.parse(fs.readFileSync('output/archetype-quiz-results.json', 'utf8'));

const contNodes = ['MAT','CD','CU','MOR','PRO','COM','ZS','ONT_H','ONT_S','PF','TRB','ENG'];
const epsLabels = ['empiricist','institutionalist','traditionalist','intuitionist','autonomous','nihilist'];
const aesLabels = ['statesman','technocrat','pastoral','authentic','fighter','visionary'];

function getArchProfile(targetId) {
  const regex = new RegExp(`id:\\s*"${targetId}"\\s*,\\s*name:\\s*"([^"]+)"[\\s\\S]*?nodes:\\s*\\{([\\s\\S]*?)\\}\\s*\\}`, 'i');
  const m = arcSrc.match(regex);
  if (!m) return null;
  const name = m[1]; const block = m[2]; const nodes = {};
  contNodes.forEach(n => {
    const nm = block.match(new RegExp(n + ':\\s*\\{[^}]*pos:\\s*(\\d+)[^}]*sal:\\s*(\\d+)'));
    if (nm) nodes[n] = { pos: parseInt(nm[1]), sal: parseInt(nm[2]) };
  });
  ['EPS','AES'].forEach(n => {
    const cm = block.match(new RegExp(n + ':\\s*\\{[^}]*probs:\\s*\\[([\\d.,\\s]+)\\]'));
    if (cm) nodes[n] = { probs: cm[1].split(',').map(Number) };
  });
  return { id: targetId, name, nodes };
}

// Find misses from the per-miss table
const misses = results.perMissTable.filter(m => m.baselineRank > 1);

let html = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>PRISM Quiz — Miss Diagnostic Report</title>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#0c0a08;color:#e8e2d8;font-family:'Inter',sans-serif;padding:2rem}
h1{font-family:'Cormorant Garamond',serif;font-size:2.5rem;color:#fff;margin-bottom:.5rem}
h2{font-family:'Cormorant Garamond',serif;font-size:1.8rem;color:#fff;margin:2rem 0 1rem}
h3{font-family:'Cormorant Garamond',serif;font-size:1.3rem;color:#5BA8D9;margin:.5rem 0}
.subtitle{color:#888;font-size:.9rem;margin-bottom:2rem}
.summary-table{width:100%;border-collapse:collapse;margin:1.5rem 0}
.summary-table th{background:#1a1816;color:#5BA8D9;padding:.7rem 1rem;text-align:left;font-size:.85rem;text-transform:uppercase;letter-spacing:.05em}
.summary-table td{padding:.6rem 1rem;border-bottom:1px solid #222;font-size:.9rem}
.summary-table tr:hover{background:#1a1816}
.rank-bad{color:#EC1014;font-weight:600}
.rank-ok{color:#FFB800;font-weight:600}
.miss-card{background:#141210;border:1px solid #2a2826;border-radius:12px;margin:1.5rem 0;overflow:hidden}
.miss-header{padding:1.2rem 1.5rem;cursor:pointer;display:flex;justify-content:space-between;align-items:center;transition:background .2s}
.miss-header:hover{background:#1a1816}
.miss-header .left{display:flex;align-items:center;gap:1rem}
.miss-header .id{color:#5BA8D9;font-family:'Cormorant Garamond',serif;font-size:1.4rem;font-weight:700}
.miss-header .name{font-size:1.1rem}
.miss-header .arrow{color:#666;font-size:1.2rem;transition:transform .3s}
.miss-header.open .arrow{transform:rotate(180deg)}
.miss-body{display:none;padding:0 1.5rem 1.5rem}
.miss-body.open{display:block}
.rec{display:inline-block;padding:.3rem .8rem;border-radius:6px;font-size:.8rem;font-weight:600;text-transform:uppercase;letter-spacing:.05em}
.rec-merge{background:rgba(236,16,20,.15);color:#EC1014;border:1px solid rgba(236,16,20,.3)}
.rec-fix{background:rgba(3,232,122,.15);color:#03E87A;border:1px solid rgba(3,232,122,.3)}
.node-row{display:grid;grid-template-columns:60px 1fr 60px 1fr 60px 120px;gap:.5rem;align-items:center;padding:.4rem 0;border-bottom:1px solid #1a1816;font-size:.85rem}
.node-label{color:#5BA8D9;font-weight:600;font-family:monospace}
.bar-container{height:20px;background:#1a1816;border-radius:4px;position:relative;overflow:hidden}
.bar{height:100%;border-radius:4px;transition:width .3s}
.bar-true{background:linear-gradient(90deg,#1019EC,#5BA8D9)}
.bar-winner{background:linear-gradient(90deg,#EC1014,#ff6b6b)}
.bar-same{background:#444}
.sal-dots{display:flex;gap:3px}
.sal-dot{width:8px;height:8px;border-radius:50%}
.sal-filled{background:#5BA8D9}
.sal-empty{background:#2a2826}
.delta{font-weight:600;text-align:center}
.delta-0{color:#666}
.delta-1{color:#FFB800}
.delta-2{color:#EC1014}
.verdict{font-size:.8rem;padding:.2rem .5rem;border-radius:4px}
.v-ident{background:rgba(236,16,20,.1);color:#EC1014}
.v-sim{background:rgba(255,184,0,.1);color:#FFB800}
.v-diff{background:rgba(3,232,122,.1);color:#03E87A}
.node-grid-header{display:grid;grid-template-columns:60px 1fr 60px 1fr 60px 120px;gap:.5rem;padding:.4rem 0;border-bottom:2px solid #333;font-size:.75rem;color:#888;text-transform:uppercase;letter-spacing:.05em}
.cat-compare{display:flex;gap:2rem;margin-top:1rem;padding:1rem;background:#1a1816;border-radius:8px}
.cat-col{flex:1}
.cat-col h4{font-size:.8rem;color:#888;text-transform:uppercase;margin-bottom:.5rem}
.cat-bar{display:flex;align-items:center;gap:.5rem;margin:.3rem 0;font-size:.8rem}
.cat-bar-fill{height:14px;border-radius:3px;min-width:2px}
.top5{margin-top:1rem;padding:1rem;background:#1a1816;border-radius:8px}
.top5 h4{font-size:.8rem;color:#888;text-transform:uppercase;margin-bottom:.5rem}
.top5-item{display:flex;justify-content:space-between;padding:.3rem 0;font-size:.85rem;border-bottom:1px solid #222}
.top5-item.true-arch{color:#03E87A;font-weight:600}
.top5-item.winner{color:#EC1014;font-weight:600}
</style></head><body>
<h1>PRISM Quiz — Miss Diagnostic Report</h1>
<p class="subtitle">Generated ${new Date().toISOString().split('T')[0]} · Baseline scoring · ${misses.length} misses out of ${results.perMissTable.length} archetypes tested</p>
<h2>Summary</h2>
<table class="summary-table"><thead><tr><th>ID</th><th>Archetype</th><th>Rank</th><th>Winner</th><th>Discriminators (Δ≥2)</th><th>Recommendation</th></tr></thead><tbody>`;

const missDetails = [];

misses.forEach(miss => {
  const qr = quizResults.find(r => r.archetypeId === miss.id);
  if (!qr) return;
  const trueProfile = getArchProfile(miss.id);
  const winnerProfile = getArchProfile(qr.top5[0].id);
  if (!trueProfile || !winnerProfile) return;

  const discriminators = [];
  const identical = [];
  contNodes.forEach(n => {
    if (!trueProfile.nodes[n] || !winnerProfile.nodes[n]) return;
    const diff = Math.abs(trueProfile.nodes[n].pos - winnerProfile.nodes[n].pos);
    if (diff >= 2) discriminators.push(n);
    if (diff === 0) identical.push(n);
  });

  const rec = discriminators.length === 0 ? 'MERGE' : 'FIX';
  const rankClass = miss.baselineRank > 3 ? 'rank-bad' : 'rank-ok';

  html += `<tr>
    <td>${miss.id}</td><td>${miss.name}</td>
    <td class="${rankClass}">#${miss.baselineRank}</td>
    <td>${qr.gotName} (${(qr.topPosterior*100).toFixed(1)}%)</td>
    <td>${discriminators.length > 0 ? discriminators.join(', ') : '<span style="color:#EC1014">NONE</span>'}</td>
    <td><span class="rec ${rec === 'MERGE' ? 'rec-merge' : 'rec-fix'}">${rec}</span></td>
  </tr>`;

  missDetails.push({ miss, qr, trueProfile, winnerProfile, discriminators, identical, rec });
});

html += `</tbody></table><h2>Detailed Analysis</h2>`;

missDetails.forEach(({ miss, qr, trueProfile, winnerProfile, discriminators, identical, rec }, idx) => {
  // Rank nodes by "wrongness" — how much closer the result is to winner vs true
  const nodeAnalysis = contNodes.map(n => {
    const t = trueProfile.nodes[n];
    const w = winnerProfile.nodes[n];
    if (!t || !w) return null;
    const diff = Math.abs(t.pos - w.pos);
    // The midpoint between them — if respondent is closer to winner, it's "wrong"
    return { node: n, truePos: t.pos, trueSal: t.sal, winPos: w.pos, winSal: w.sal, diff };
  }).filter(Boolean).sort((a, b) => {
    // Sort by: discriminators first, then by diff descending, then by sal difference
    const aDisc = a.diff >= 2 ? 1 : 0;
    const bDisc = b.diff >= 2 ? 1 : 0;
    if (aDisc !== bDisc) return bDisc - aDisc;
    if (a.diff !== b.diff) return b.diff - a.diff;
    return (b.trueSal + b.winSal) - (a.trueSal + a.winSal);
  });

  const trueRank = qr.top5.findIndex(t => t.id === miss.id) + 1;

  html += `<div class="miss-card"><div class="miss-header" onclick="this.classList.toggle('open');this.nextElementSibling.classList.toggle('open')">
    <div class="left">
      <span class="id">#${miss.id}</span>
      <span class="name">${miss.name}</span>
      <span class="rec ${rec === 'MERGE' ? 'rec-merge' : 'rec-fix'}">${rec}</span>
    </div>
    <div style="display:flex;align-items:center;gap:1rem">
      <span style="color:#888;font-size:.85rem">→ ${qr.gotName} (rank #${miss.baselineRank})</span>
      <span class="arrow">▼</span>
    </div>
  </div>
  <div class="miss-body${idx === 0 ? ' open' : ''}">`;
  
  if (idx === 0) {
    // Auto-open first one
    html = html.replace(`class="miss-header"`, `class="miss-header open"`);
  }

  // Top 5 results
  html += `<div class="top5"><h4>Quiz Result — ${qr.questionsAnswered} questions</h4>`;
  qr.top5.slice(0, 5).forEach((t, i) => {
    const isTrue = t.id === miss.id;
    const isWinner = i === 0;
    html += `<div class="top5-item ${isTrue ? 'true-arch' : isWinner ? 'winner' : ''}">
      <span>${i+1}. ${t.name}${isTrue ? ' ← TRUE' : ''}</span>
      <span>${(t.prob*100).toFixed(1)}%</span>
    </div>`;
  });
  if (trueRank === 0) html += `<div class="top5-item" style="color:#EC1014">True archetype NOT in top 5</div>`;
  html += `</div>`;

  // Node comparison grid
  html += `<h3 style="margin-top:1.5rem">Node Comparison (ranked by discrimination potential)</h3>
  <div class="node-grid-header">
    <span>Node</span><span>${miss.name.substring(0,20)}</span><span>Δ</span><span>${qr.gotName.substring(0,20)}</span><span>Sal</span><span>Verdict</span>
  </div>`;

  nodeAnalysis.forEach(na => {
    const barWidthTrue = (na.truePos / 5) * 100;
    const barWidthWin = (na.winPos / 5) * 100;
    const barClass = na.diff === 0 ? 'bar-same' : 'bar-true';
    const barClassWin = na.diff === 0 ? 'bar-same' : 'bar-winner';
    const deltaClass = na.diff === 0 ? 'delta-0' : na.diff === 1 ? 'delta-1' : 'delta-2';
    const vClass = na.diff === 0 ? 'v-ident' : na.diff === 1 ? 'v-sim' : 'v-diff';
    const vText = na.diff === 0 ? 'IDENTICAL' : na.diff === 1 ? 'Similar' : `Δ${na.diff} DISC`;

    let salDots = '';
    for (let i = 0; i < 3; i++) {
      salDots += `<span class="sal-dot ${i < na.trueSal ? 'sal-filled' : 'sal-empty'}"></span>`;
    }
    salDots += ' / ';
    for (let i = 0; i < 3; i++) {
      salDots += `<span class="sal-dot ${i < na.winSal ? 'sal-filled' : 'sal-empty'}"></span>`;
    }

    html += `<div class="node-row">
      <span class="node-label">${na.node}</span>
      <div><div class="bar-container"><div class="bar ${barClass}" style="width:${barWidthTrue}%"></div></div><span style="font-size:.75rem;color:#888">pos=${na.truePos}</span></div>
      <span class="delta ${deltaClass}">${na.diff}</span>
      <div><div class="bar-container"><div class="bar ${barClassWin}" style="width:${barWidthWin}%"></div></div><span style="font-size:.75rem;color:#888">pos=${na.winPos}</span></div>
      <div class="sal-dots">${salDots}</div>
      <span class="verdict ${vClass}">${vText}</span>
    </div>`;
  });

  // Categorical comparison
  const epsT = trueProfile.nodes.EPS?.probs || [];
  const epsW = winnerProfile.nodes.EPS?.probs || [];
  const aesT = trueProfile.nodes.AES?.probs || [];
  const aesW = winnerProfile.nodes.AES?.probs || [];

  html += `<div class="cat-compare">
    <div class="cat-col"><h4>EPS — ${miss.name.substring(0,15)}</h4>`;
  epsT.forEach((p, i) => {
    html += `<div class="cat-bar"><span style="width:90px;text-align:right">${epsLabels[i]}</span><div class="cat-bar-fill" style="width:${p*200}px;background:#5BA8D9"></div><span>${(p*100).toFixed(0)}%</span></div>`;
  });
  html += `</div><div class="cat-col"><h4>EPS — ${qr.gotName.substring(0,15)}</h4>`;
  epsW.forEach((p, i) => {
    html += `<div class="cat-bar"><span style="width:90px;text-align:right">${epsLabels[i]}</span><div class="cat-bar-fill" style="width:${p*200}px;background:#EC1014"></div><span>${(p*100).toFixed(0)}%</span></div>`;
  });
  html += `</div></div>`;

  html += `<div class="cat-compare">
    <div class="cat-col"><h4>AES — ${miss.name.substring(0,15)}</h4>`;
  aesT.forEach((p, i) => {
    html += `<div class="cat-bar"><span style="width:90px;text-align:right">${aesLabels[i]}</span><div class="cat-bar-fill" style="width:${p*200}px;background:#5BA8D9"></div><span>${(p*100).toFixed(0)}%</span></div>`;
  });
  html += `</div><div class="cat-col"><h4>AES — ${qr.gotName.substring(0,15)}</h4>`;
  aesW.forEach((p, i) => {
    html += `<div class="cat-bar"><span style="width:90px;text-align:right">${aesLabels[i]}</span><div class="cat-bar-fill" style="width:${p*200}px;background:#EC1014"></div><span>${(p*100).toFixed(0)}%</span></div>`;
  });
  html += `</div></div>`;

  html += `</div></div>`;
});

html += `<div style="margin-top:3rem;padding:2rem;background:#141210;border-radius:12px;border:1px solid #2a2826">
<h2 style="margin-top:0">Recommendations</h2>
<p style="color:#888;margin:.5rem 0">Based on the analysis above:</p>
<ul style="margin:1rem 0;padding-left:1.5rem;line-height:1.8">`;

missDetails.forEach(({ miss, rec, discriminators }) => {
  if (rec === 'MERGE') {
    html += `<li><span class="rec rec-merge">MERGE</span> <strong>${miss.name}</strong> — no discriminating nodes (Δ≥2). Consider absorbing into the winner archetype.</li>`;
  } else {
    html += `<li><span class="rec rec-fix">FIX</span> <strong>${miss.name}</strong> — raise salience on: ${discriminators.join(', ')}. These nodes differentiate it but aren't weighted enough.</li>`;
  }
});

html += `</ul></div></body></html>`;

fs.writeFileSync('output/miss-diagnostic.html', html);
console.log(`Written ${(html.length/1024).toFixed(1)}KB to output/miss-diagnostic.html`);
console.log(`${missDetails.length} misses documented`);
console.log(`Recommendations: ${missDetails.filter(d=>d.rec==='MERGE').length} MERGE, ${missDetails.filter(d=>d.rec==='FIX').length} FIX`);
