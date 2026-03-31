// Extract the actual MAT pos distributions from question optionEvidence
// to see how sharp/flat they are

const fs = require('fs');

// We need to actually parse the TypeScript properly
// Let's use a targeted approach: find Q13 (tax rate) which should be a clean MAT question

const src = fs.readFileSync('src/config/questions.representative.ts', 'utf8');

// Find Q13 block
const q13Start = src.indexOf('id: 13');
const q13End = src.indexOf('\n  {', q13Start + 100);
const q13Block = src.substring(q13Start, q13End > 0 ? q13End : q13Start + 3000);

// Find all MAT pos arrays
const posRegex = /MAT:\s*\{\s*pos:\s*\[([^\]]+)\]/g;
let m;
const positions = [];
let context = '';

// Actually, let's just extract ALL MAT pos arrays from the entire file
const allMatPos = [];
const lines = src.split('\n');
for (let i = 0; i < lines.length; i++) {
  const match = lines[i].match(/MAT:\s*\{\s*pos:\s*\[([^\]]+)\]/);
  if (match) {
    const vals = match[1].split(',').map(Number);
    // Find the nearest option key above this line
    let optKey = '?';
    for (let j = i - 1; j >= Math.max(0, i - 10); j--) {
      const keyMatch = lines[j].match(/^\s*(\w+):\s*\{/);
      if (keyMatch) { optKey = keyMatch[1]; break; }
    }
    // Find the nearest question ID
    let qId = '?';
    for (let j = i - 1; j >= Math.max(0, i - 50); j--) {
      const idMatch = lines[j].match(/id:\s*(\d+)/);
      if (idMatch) { qId = idMatch[1]; break; }
    }
    allMatPos.push({ qId, option: optKey, pos: vals, line: i+1 });
  }
}

console.log(`Found ${allMatPos.length} MAT pos distributions\n`);
console.log("Archetype at MAT=5 (free market) picks option with highest pos[4]:");
console.log("Archetype at MAT=1 (redistribution) picks option with highest pos[0]:\n");

// Group by question
const byQ = {};
allMatPos.forEach(p => {
  if (!byQ[p.qId]) byQ[p.qId] = [];
  byQ[p.qId].push(p);
});

Object.entries(byQ).forEach(([qId, opts]) => {
  console.log(`Q${qId}:`);
  let maxPos5 = -1, maxPos5Opt = '';
  let maxPos1 = -1, maxPos1Opt = '';
  
  opts.forEach(o => {
    const pos = o.pos;
    console.log(`  ${o.option.padEnd(25)}: [${pos.map(v => v.toFixed(2)).join(', ')}]  pos5=${pos[4]?.toFixed(2) || 'N/A'}  pos1=${pos[0]?.toFixed(2)}`);
    if ((pos[4] || 0) > maxPos5) { maxPos5 = pos[4] || 0; maxPos5Opt = o.option; }
    if ((pos[0] || 0) > maxPos1) { maxPos1 = pos[0] || 0; maxPos1Opt = o.option; }
  });
  
  // What's the pos[4] range?
  const pos4vals = opts.map(o => o.pos[4] || 0);
  const pos4range = Math.max(...pos4vals) - Math.min(...pos4vals);
  console.log(`  → MAT=5 picks: ${maxPos5Opt} (${maxPos5.toFixed(2)})`);
  console.log(`  → MAT=1 picks: ${maxPos1Opt} (${maxPos1.toFixed(2)})`);
  console.log(`  → pos[4] range: ${pos4range.toFixed(2)} ${pos4range < 0.3 ? '⚠️ WEAK' : pos4range > 0.5 ? '✅ STRONG' : ''}`);
  console.log('');
});

