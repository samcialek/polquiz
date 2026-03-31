// PRISM Deep Diagnostic — traces each miss through the full pipeline
// For each missed archetype: replay the quiz, log which questions were asked,
// what the posteriors looked like at each step, and WHERE the true archetype fell behind

const fs = require('fs');

// Load results
const results = JSON.parse(fs.readFileSync('output/archetype-quiz-results.json', 'utf8'));
const misses = results.filter(r => !r.match);

// Load question definitions to check node alignment
const qSrc = fs.readFileSync('src/config/questions.representative.ts', 'utf8');

// Parse archetype source for node profiles
const arcSrc = fs.readFileSync('src/config/archetypes.ts', 'utf8');

function getArchNodes(name) {
  const regex = new RegExp(`name:\\s*"${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[\\s\\S]*?nodes:\\s*\\{([\\s\\S]*?)\\}\\s*\\}`, 'i');
  const m = arcSrc.match(regex);
  if (!m) return null;
  const block = m[1];
  const nodes = {};
  const contNodes = ['MAT','CD','CU','MOR','PRO','COM','ZS','ONT_H','ONT_S','PF','TRB','ENG'];
  contNodes.forEach(n => {
    const nm = block.match(new RegExp(n + ':\\s*\\{[^}]*pos:\\s*(\\d+)[^}]*sal:\\s*(\\d+)'));
    if (nm) nodes[n] = { pos: parseInt(nm[1]), sal: parseInt(nm[2]) };
  });
  return nodes;
}

// For each miss, analyze the question trace
console.log("# PRISM Deep Diagnostic — 28 Missed Archetypes\n");
console.log("## Methodology");
console.log("For each miss, we trace:");
console.log("1. Which questions were asked and how they mapped to nodes");
console.log("2. Which nodes the true archetype differs on from the winner");
console.log("3. Whether questions targeting those discriminating nodes were asked");
console.log("4. The posterior trajectory — when did the true archetype fall behind?\n");

// First: build a map of question → primary node
// Parse question IDs and their node targets from source
const questionNodes = {};
const qBlocks = qSrc.matchAll(/id:\s*(\d+)[\s\S]*?prompt:\s*"([^"]+)"[\s\S]*?nodes:\s*\[([^\]]*)\]/g);
for (const qm of qBlocks) {
  const qId = parseInt(qm[1]);
  const prompt = qm[2];
  const nodesStr = qm[3];
  // Extract node IDs from the nodes array
  const nodeIds = [];
  const nodeMatches = nodesStr.matchAll(/"([A-Z_]+)"/g);
  for (const nm of nodeMatches) {
    nodeIds.push(nm[1]);
  }
  questionNodes[qId] = { prompt, nodes: nodeIds };
}

// Alternative: try parsing nodeSignals
const questionNodeSignals = {};
const qBlocks2 = qSrc.matchAll(/id:\s*(\d+)[\s\S]*?prompt:\s*"([^"]+)"[\s\S]*?nodeSignals[\s\S]*?\{([\s\S]*?)\}/g);
for (const qm of qBlocks2) {
  const qId = parseInt(qm[1]);
  const prompt = qm[2];
  const signalBlock = qm[3];
  const signals = {};
  const sigMatches = signalBlock.matchAll(/([A-Z_]+):/g);
  for (const sm of sigMatches) {
    signals[sm[1]] = true;
  }
  questionNodeSignals[qId] = { prompt, nodes: Object.keys(signals) };
}

console.log(`Parsed ${Object.keys(questionNodeSignals).length} questions with nodeSignals\n`);

const contNodes = ['MAT','CD','CU','MOR','PRO','COM','ZS','ONT_H','ONT_S','PF','TRB','ENG'];

misses.forEach(miss => {
  const trueNodes = getArchNodes(miss.archetypeName);
  const winnerNodes = getArchNodes(miss.gotName);
  
  if (!trueNodes || !winnerNodes) {
    console.log(`\n## ${miss.archetypeId} ${miss.archetypeName} — COULD NOT LOAD PROFILES\n`);
    return;
  }
  
  // Find discriminating nodes (where true and winner differ)
  const discriminators = [];
  const identical = [];
  contNodes.forEach(n => {
    if (!trueNodes[n] || !winnerNodes[n]) return;
    const diff = Math.abs(trueNodes[n].pos - winnerNodes[n].pos);
    if (diff >= 2) discriminators.push({ node: n, trueSal: trueNodes[n].sal, winSal: winnerNodes[n].sal, diff });
    else if (diff === 0) identical.push(n);
  });
  
  // Check which questions were asked and which nodes they target
  const askedQuestions = miss.answeredQuestions || [];
  const nodesAsked = {};
  const nodesCovered = new Set();
  askedQuestions.forEach(aq => {
    const qInfo = questionNodeSignals[aq.id] || questionNodes[aq.id];
    if (qInfo) {
      qInfo.nodes.forEach(n => {
        nodesCovered.add(n);
        nodesAsked[n] = (nodesAsked[n] || 0) + 1;
      });
    }
  });
  
  // Check if discriminating nodes were covered
  const uncoveredDiscriminators = discriminators.filter(d => !nodesCovered.has(d.node));
  const coveredDiscriminators = discriminators.filter(d => nodesCovered.has(d.node));
  
  // Determine failure mode
  let failureMode = '';
  if (discriminators.length === 0) {
    failureMode = '🔴 NO DISCRIMINATORS — profiles too similar (all Δ<2)';
  } else if (uncoveredDiscriminators.length > 0) {
    failureMode = '🟡 QUESTION GAP — discriminating nodes not asked about';
  } else if (coveredDiscriminators.length > 0) {
    // Questions were asked but still missed — salience or likelihood issue
    const lowSalDisc = coveredDiscriminators.filter(d => d.trueSal <= 1);
    if (lowSalDisc.length > 0) {
      failureMode = '🟠 LOW SALIENCE — discriminator exists & was asked, but sal≤1';
    } else {
      failureMode = '⚪ LIKELIHOOD — questions asked, sal OK, but posterior still lost';
    }
  }
  
  // True archetype rank
  const trueRank = (miss.top5 || []).findIndex(t => t.id === miss.archetypeId) + 1;
  
  console.log(`\n## ${miss.archetypeId} ${miss.archetypeName}`);
  console.log(`**Result:** ${miss.gotName} (${(miss.topPosterior*100).toFixed(1)}%)`);
  console.log(`**True rank:** ${trueRank > 0 ? '#' + trueRank : 'NOT IN TOP 5'} | **Questions:** ${miss.questionsAnswered}`);
  console.log(`**Failure mode:** ${failureMode}`);
  console.log(`**Identical nodes (Δ=0):** ${identical.join(', ') || 'none'} (${identical.length}/12)`);
  
  if (discriminators.length > 0) {
    console.log(`**Discriminators (Δ≥2):**`);
    discriminators.forEach(d => {
      const covered = nodesCovered.has(d.node);
      const qCount = nodesAsked[d.node] || 0;
      console.log(`  - ${d.node}: Δ=${d.diff}, true sal=${d.trueSal}, winner sal=${d.winSal}, asked ${qCount}x ${covered ? '✅' : '❌ NOT ASKED'}`);
    });
  }
  
  if (uncoveredDiscriminators.length > 0) {
    console.log(`**⚠️ Missing questions for:** ${uncoveredDiscriminators.map(d => d.node).join(', ')}`);
  }
  
  // Node coverage summary
  const allNodesArr = [...contNodes, 'EPS', 'AES'];
  const uncoveredNodes = allNodesArr.filter(n => !nodesCovered.has(n));
  if (uncoveredNodes.length > 0) {
    console.log(`**Uncovered nodes (no questions asked):** ${uncoveredNodes.join(', ')}`);
  }
});

// === SUMMARY ===
console.log("\n\n# FAILURE MODE SUMMARY\n");

let noDisc = 0, qGap = 0, lowSal = 0, likelihood = 0;
misses.forEach(miss => {
  const trueNodes = getArchNodes(miss.archetypeName);
  const winnerNodes = getArchNodes(miss.gotName);
  if (!trueNodes || !winnerNodes) return;
  
  const discriminators = [];
  contNodes.forEach(n => {
    if (!trueNodes[n] || !winnerNodes[n]) return;
    if (Math.abs(trueNodes[n].pos - winnerNodes[n].pos) >= 2) 
      discriminators.push({ node: n, sal: trueNodes[n].sal });
  });
  
  const askedQuestions = miss.answeredQuestions || [];
  const nodesCovered = new Set();
  askedQuestions.forEach(aq => {
    const qInfo = questionNodeSignals[aq.id] || questionNodes[aq.id];
    if (qInfo) qInfo.nodes.forEach(n => nodesCovered.add(n));
  });
  
  if (discriminators.length === 0) noDisc++;
  else {
    const uncovered = discriminators.filter(d => !nodesCovered.has(d.node));
    if (uncovered.length > 0) qGap++;
    else {
      const lowS = discriminators.filter(d => d.sal <= 1);
      if (lowS.length > 0) lowSal++;
      else likelihood++;
    }
  }
});

console.log(`| Failure Mode | Count | Fix |`);
console.log(`|---|---|---|`);
console.log(`| 🔴 No discriminators (profiles too similar) | ${noDisc} | Merge archetypes OR widen node gaps |`);
console.log(`| 🟡 Question gap (discriminator not asked) | ${qGap} | Add targeted questions |`);
console.log(`| 🟠 Low salience (asked but sal≤1) | ${lowSal} | Raise salience on discriminating nodes |`);
console.log(`| ⚪ Likelihood issue (all looks right) | ${likelihood} | Debug likelihood computation |`);

