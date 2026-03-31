// Fixed question-node parser using touchProfile
const fs = require('fs');
const src = fs.readFileSync('src/config/questions.representative.ts', 'utf8');

// Extract question ID → nodes from touchProfile
const questionMap = {};
const qMatches = src.matchAll(/id:\s*(\d+)[\s\S]*?touchProfile:\s*\[([\s\S]*?)\]/g);
for (const m of qMatches) {
  const qId = parseInt(m[1]);
  const tpBlock = m[2];
  const nodes = new Set();
  const nodeMatches = tpBlock.matchAll(/node:\s*"([A-Z_]+)"/g);
  for (const nm of nodeMatches) {
    nodes.add(nm[1]);
  }
  questionMap[qId] = [...nodes];
}

console.log(`Parsed ${Object.keys(questionMap).length} questions\n`);

// Count questions per node
const nodeCounts = {};
Object.values(questionMap).forEach(nodes => {
  nodes.forEach(n => { nodeCounts[n] = (nodeCounts[n] || 0) + 1; });
});

console.log("=== QUESTIONS PER NODE ===");
Object.entries(nodeCounts).sort((a,b) => b[1]-a[1]).forEach(([node, count]) => {
  console.log(`  ${node.padEnd(6)}: ${count} questions`);
});

// Now trace each miss
const results = JSON.parse(fs.readFileSync('output/archetype-quiz-results.json', 'utf8'));
const misses = results.filter(r => !r.match);

// Parse archetype nodes
const arcSrc = fs.readFileSync('src/config/archetypes.ts', 'utf8');
function getArchNodes(name) {
  const regex = new RegExp(`name:\\s*"${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[\\s\\S]*?nodes:\\s*\\{([\\s\\S]*?)\\}\\s*\\}`);
  const m = arcSrc.match(regex);
  if (!m) return null;
  const block = m[1];
  const nodes = {};
  ['MAT','CD','CU','MOR','PRO','COM','ZS','ONT_H','ONT_S','PF','TRB','ENG'].forEach(n => {
    const nm = block.match(new RegExp(n + ':\\s*\\{[^}]*pos:\\s*(\\d+)[^}]*sal:\\s*(\\d+)'));
    if (nm) nodes[n] = { pos: parseInt(nm[1]), sal: parseInt(nm[2]) };
  });
  return nodes;
}

const contNodes = ['MAT','CD','CU','MOR','PRO','COM','ZS','ONT_H','ONT_S','PF','TRB','ENG'];

console.log("\n\n=== DETAILED MISS DIAGNOSIS ===\n");

let noDisc = 0, qGap = 0, lowSal = 0, likelihood = 0;

misses.forEach(miss => {
  const trueNodes = getArchNodes(miss.archetypeName);
  const winnerNodes = getArchNodes(miss.gotName);
  if (!trueNodes || !winnerNodes) return;
  
  // Find discriminators
  const discriminators = [];
  const identical = [];
  contNodes.forEach(n => {
    if (!trueNodes[n] || !winnerNodes[n]) return;
    const diff = Math.abs(trueNodes[n].pos - winnerNodes[n].pos);
    if (diff >= 2) discriminators.push({ node: n, trueSal: trueNodes[n].sal, winSal: winnerNodes[n].sal, diff, truePos: trueNodes[n].pos, winPos: winnerNodes[n].pos });
    else if (diff === 0) identical.push(n);
  });
  
  // Which questions were asked and what nodes they covered
  const askedQs = miss.answeredQuestions || [];
  const nodesCovered = {};
  askedQs.forEach(aq => {
    const qNodes = questionMap[aq.id];
    if (qNodes) {
      qNodes.forEach(n => { nodesCovered[n] = (nodesCovered[n] || 0) + 1; });
    }
  });
  
  const uncoveredDisc = discriminators.filter(d => !nodesCovered[d.node]);
  const coveredDisc = discriminators.filter(d => nodesCovered[d.node]);
  
  let failureMode;
  if (discriminators.length === 0) {
    failureMode = '🔴 PROFILES TOO SIMILAR';
    noDisc++;
  } else if (uncoveredDisc.length > 0 && uncoveredDisc.length === discriminators.length) {
    failureMode = '🟡 QUESTION GAP (no discriminator questions asked)';
    qGap++;
  } else if (uncoveredDisc.length > 0) {
    failureMode = '🟡 PARTIAL QUESTION GAP';
    qGap++;
  } else {
    const lowSalDiscs = coveredDisc.filter(d => d.trueSal <= 1);
    if (lowSalDiscs.length === coveredDisc.length) {
      failureMode = '🟠 LOW SALIENCE (discriminator asked but sal≤1)';
      lowSal++;
    } else {
      failureMode = '⚪ LIKELIHOOD (questions asked, sal OK, still lost)';
      likelihood++;
    }
  }
  
  const trueRank = (miss.top5 || []).findIndex(t => t.id === miss.archetypeId) + 1;
  
  console.log(`${miss.archetypeId} ${miss.archetypeName} → ${miss.gotName}`);
  console.log(`  Rank: ${trueRank > 0 ? '#' + trueRank : 'NOT TOP 5'} | Qs: ${miss.questionsAnswered} | Mode: ${failureMode}`);
  
  if (discriminators.length > 0) {
    discriminators.forEach(d => {
      const qCount = nodesCovered[d.node] || 0;
      const status = qCount === 0 ? '❌ NOT ASKED' : `✅ asked ${qCount}x`;
      console.log(`  ${d.node}: true=${d.truePos}(sal${d.trueSal}) vs win=${d.winPos}(sal${d.winSal}) Δ=${d.diff} ${status}`);
    });
  } else {
    console.log(`  No nodes differ by ≥2. Total coverage: ${Object.keys(nodesCovered).length}/14 nodes asked about`);
  }
  console.log('');
});

console.log("\n=== FAILURE MODE TOTALS ===");
console.log(`🔴 Profiles too similar (need merge/widen): ${noDisc}`);
console.log(`🟡 Question gap (discriminator not asked):  ${qGap}`);
console.log(`🟠 Low salience:                            ${lowSal}`);
console.log(`⚪ Likelihood issue:                        ${likelihood}`);

