// Detailed quiz trace for a single archetype
// Shows: archetype signature, each question asked, answer picked, 
// respondent's node distributions after each answer, and final posterior

const fs = require('fs');

// We need to actually run the simulation and capture intermediate state
// First, let's build the trace manually using the engine code

// Parse archetype profiles
const arcSrc = fs.readFileSync('src/config/archetypes.ts', 'utf8');

function getArchProfile(targetId) {
  const regex = new RegExp(`id:\\s*"${targetId}"\\s*,\\s*name:\\s*"([^"]+)"[\\s\\S]*?nodes:\\s*\\{([\\s\\S]*?)\\}\\s*\\}`, 'i');
  const m = arcSrc.match(regex);
  if (!m) return null;
  const name = m[1];
  const block = m[2];
  const nodes = {};
  ['MAT','CD','CU','MOR','PRO','COM','ZS','ONT_H','ONT_S','PF','TRB','ENG'].forEach(n => {
    const nm = block.match(new RegExp(n + ':\\s*\\{[^}]*pos:\\s*(\\d+)[^}]*sal:\\s*(\\d+)'));
    if (nm) nodes[n] = { pos: parseInt(nm[1]), sal: parseInt(nm[2]) };
  });
  // Categorical
  ['EPS','AES'].forEach(n => {
    const cm = block.match(new RegExp(n + ':\\s*\\{[^}]*probs:\\s*\\[([\\d.,\\s]+)\\]'));
    if (cm) nodes[n] = { probs: cm[1].split(',').map(Number) };
  });
  return { id: targetId, name, nodes };
}

// Let's trace 006 Fairness Pragmatist and its competitor
const arch006 = getArchProfile('006');
const contNodes = ['MAT','CD','CU','MOR','PRO','COM','ZS','ONT_H','ONT_S','PF','TRB','ENG'];
const epsLabels = ['empiricist','institutionalist','traditionalist','intuitionist','autonomous','nihilist'];
const aesLabels = ['statesman','technocrat','pastoral','authentic','fighter','visionary'];

console.log("╔══════════════════════════════════════════════════════════╗");
console.log("║  DETAILED TRACE: 006 Fairness Pragmatist               ║");
console.log("║  Baseline rank: 2 (MISS)                               ║");
console.log("╚══════════════════════════════════════════════════════════╝\n");

console.log("=== ARCHETYPE SIGNATURE ===\n");
contNodes.forEach(n => {
  if (arch006.nodes[n]) {
    const {pos, sal} = arch006.nodes[n];
    const bar = '█'.repeat(pos) + '░'.repeat(5 - pos);
    const salBar = '●'.repeat(sal) + '○'.repeat(3 - sal);
    console.log(`  ${n.padEnd(6)}: pos=${pos} ${bar}  sal=${sal} ${salBar}`);
  }
});
console.log(`\n  EPS: [${arch006.nodes.EPS?.probs.map(p => p.toFixed(2)).join(', ')}]`);
console.log(`       → top: ${epsLabels[arch006.nodes.EPS?.probs.indexOf(Math.max(...(arch006.nodes.EPS?.probs || [0])))]}`);
console.log(`  AES: [${arch006.nodes.AES?.probs.map(p => p.toFixed(2)).join(', ')}]`);
console.log(`       → top: ${aesLabels[arch006.nodes.AES?.probs.indexOf(Math.max(...(arch006.nodes.AES?.probs || [0])))]}`);

// Now find the closest competitor
// Load old results to see who won
const results = JSON.parse(fs.readFileSync('output/archetype-quiz-results.json', 'utf8'));
const result006 = results.find(r => r.archetypeId === '006');

if (result006) {
  console.log(`\n\n=== QUIZ RESULT ===\n`);
  console.log(`  Questions answered: ${result006.questionsAnswered}`);
  console.log(`  Match: ${result006.match ? 'YES ✅' : 'NO ❌'}`);
  console.log(`  Got: ${result006.gotName} (${(result006.topPosterior * 100).toFixed(1)}%)`);
  console.log(`  Top 5:`);
  result006.top5.forEach((t, i) => {
    const isTrue = t.id === '006';
    console.log(`    ${i+1}. ${t.name} (${(t.prob * 100).toFixed(1)}%) ${isTrue ? '← TRUE' : ''}`);
  });
  
  // Compare profiles
  const winnerProfile = getArchProfile(result006.top5[0].id);
  if (winnerProfile) {
    console.log(`\n\n=== PROFILE COMPARISON: 006 vs ${winnerProfile.name} ===\n`);
    console.log(`  Node    006(pos/sal)  ${winnerProfile.name.substring(0,15).padEnd(15)}(pos/sal)  Δpos  Verdict`);
    console.log(`  ${'─'.repeat(70)}`);
    contNodes.forEach(n => {
      const a = arch006.nodes[n];
      const b = winnerProfile.nodes[n];
      if (!a || !b) return;
      const diff = Math.abs(a.pos - b.pos);
      let verdict = '';
      if (diff === 0) verdict = '⚠️ IDENTICAL';
      else if (diff === 1) verdict = '~similar';
      else verdict = `✅ DIFFERENT (Δ${diff})`;
      console.log(`  ${n.padEnd(6)}  ${a.pos}/${a.sal}           ${b.pos}/${b.sal}                 ${diff}     ${verdict}`);
    });
  }
  
  // Show the answered questions and which nodes they touched
  if (result006.answeredQuestions && result006.answeredQuestions.length > 0) {
    console.log(`\n\n=== QUESTIONS ASKED (${result006.answeredQuestions.length}) ===\n`);
    
    // Parse question touchProfile
    const qSrc = fs.readFileSync('src/config/questions.representative.ts', 'utf8');
    const questionMap = {};
    const qMatches = qSrc.matchAll(/id:\s*(\d+)[\s\S]*?promptShort:\s*"([^"]+)"[\s\S]*?touchProfile:\s*\[([\s\S]*?)\]/g);
    for (const qm of qMatches) {
      const qId = parseInt(qm[1]);
      const prompt = qm[2];
      const tpBlock = qm[3];
      const nodes = new Set();
      const nodeMatches = tpBlock.matchAll(/node:\s*"([A-Z_]+)"/g);
      for (const nm of nodeMatches) nodes.add(nm[1]);
      questionMap[qId] = { prompt, nodes: [...nodes] };
    }
    
    const nodeTouchCount = {};
    result006.answeredQuestions.forEach((aq, idx) => {
      const qInfo = questionMap[aq.id];
      const nodeStr = qInfo ? qInfo.nodes.join(', ') : '?';
      if (qInfo) qInfo.nodes.forEach(n => { nodeTouchCount[n] = (nodeTouchCount[n] || 0) + 1; });
      if (idx < 20 || idx > result006.answeredQuestions.length - 5) {
        console.log(`  Q${aq.id.toString().padEnd(3)} ${(qInfo?.prompt || '?').substring(0, 40).padEnd(42)} → [${nodeStr}]`);
      } else if (idx === 20) {
        console.log(`  ... (${result006.answeredQuestions.length - 24} more questions) ...`);
      }
    });
    
    console.log(`\n\n=== NODE TOUCH COUNTS ===\n`);
    Object.entries(nodeTouchCount).sort((a,b) => b[1]-a[1]).forEach(([node, count]) => {
      const archNode = arch006.nodes[node];
      const isDiscriminator = winnerProfile && winnerProfile.nodes[node] && archNode && 
        Math.abs(archNode.pos - winnerProfile.nodes[node].pos) >= 2;
      console.log(`  ${node.padEnd(6)}: ${count}x ${isDiscriminator ? '🎯 DISCRIMINATOR' : ''}`);
    });
  }
}

