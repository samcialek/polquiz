const fs = require('fs');

// Parse archetypes from TypeScript source
const src = fs.readFileSync('src/config/archetypes.ts', 'utf8');

// Extract all archetype blocks using a more robust approach
const archetypes = [];
const archRegex = /\{\s*id:\s*"(\d+)",\s*name:\s*"([^"]+)"[\s\S]*?nodes:\s*\{([\s\S]*?)\}\s*\}/g;
let m;
while ((m = archRegex.exec(src)) !== null) {
  const id = m[1];
  const name = m[2];
  const nodesBlock = m[3];
  
  const nodes = {};
  const contNodes = ['MAT','CD','CU','MOR','PRO','COM','ZS','ONT_H','ONT_S','PF','TRB','ENG'];
  contNodes.forEach(n => {
    const nodeRegex = new RegExp(n + ':\\s*\\{[^}]*pos:\\s*(\\d+)[^}]*sal:\\s*(\\d+)');
    const nm = nodesBlock.match(nodeRegex);
    if (nm) {
      nodes[n] = { pos: parseInt(nm[1]), sal: parseInt(nm[2]) };
    }
  });
  
  // Categorical
  ['EPS','AES'].forEach(n => {
    const catRegex = new RegExp(n + ':\\s*\\{[^}]*probs:\\s*\\[([\\d.,\\s]+)\\]');
    const cm = nodesBlock.match(catRegex);
    if (cm) {
      nodes[n] = { probs: cm[1].split(',').map(Number) };
    }
  });
  
  archetypes.push({ id, name, nodes });
}

console.log(`Parsed ${archetypes.length} archetypes\n`);

function getArch(name) {
  return archetypes.find(a => a.name === name);
}

const contNodes = ['MAT','CD','CU','MOR','PRO','COM','ZS','ONT_H','ONT_S','PF','TRB','ENG'];
const epsLabels = ['empiricist','institutionalist','traditionalist','intuitionist','autonomous','nihilist'];
const aesLabels = ['statesman','technocrat','pastoral','authentic','fighter','visionary'];

function comparePair(nameA, nameB) {
  const a = getArch(nameA);
  const b = getArch(nameB);
  if (!a || !b) { console.log(`  Missing: ${!a ? nameA : nameB}`); return; }
  
  console.log(`--- ${a.id} ${nameA} vs ${b.id} ${nameB} ---`);
  
  let totalDiff = 0;
  let sameNodes = [];
  let diffNodes = [];
  
  contNodes.forEach(n => {
    if (!a.nodes[n] || !b.nodes[n]) return;
    const posA = a.nodes[n].pos;
    const posB = b.nodes[n].pos;
    const salA = a.nodes[n].sal;
    const salB = b.nodes[n].sal;
    const diff = Math.abs(posA - posB);
    totalDiff += diff;
    
    const marker = diff === 0 ? ' ⚠️ IDENTICAL' : diff === 1 ? ' ~similar' : ' ✅ DIFFERENT';
    console.log(`  ${n.padEnd(6)}: ${posA} (sal=${salA}) vs ${posB} (sal=${salB})  Δ=${diff}${marker}`);
    
    if (diff === 0) sameNodes.push(n);
    if (diff >= 2) diffNodes.push({ node: n, diff });
  });
  
  // Categorical: compare dominant category
  ['EPS','AES'].forEach((n, idx) => {
    if (!a.nodes[n] || !b.nodes[n]) return;
    const labels = idx === 0 ? epsLabels : aesLabels;
    const topA = a.nodes[n].probs.indexOf(Math.max(...a.nodes[n].probs));
    const topB = b.nodes[n].probs.indexOf(Math.max(...b.nodes[n].probs));
    const marker = topA === topB ? ' ⚠️ SAME TOP' : ' ✅ DIFF TOP';
    console.log(`  ${n.padEnd(6)}: ${labels[topA]} vs ${labels[topB]}${marker}`);
  });
  
  console.log(`  SUMMARY: ${sameNodes.length}/12 identical nodes, total Δ=${totalDiff}`);
  console.log(`  Identical: ${sameNodes.join(', ') || 'none'}`);
  console.log(`  Best discriminators (Δ≥2): ${diffNodes.map(d => `${d.node}(Δ${d.diff})`).join(', ') || 'NONE — all within 1 step!'}`);
  console.log('');
}

console.log("========================================");
console.log("  ISD (002) — THE BIGGEST BLACK HOLE");
console.log("  Attracted 5 wrong archetypes");
console.log("========================================\n");

comparePair('Independent Social Democrat', 'Rawlsian Reformer');
comparePair('Independent Social Democrat', 'Global Caretaker');
comparePair('Independent Social Democrat', 'Evidence Reformer');
comparePair('Independent Social Democrat', 'Institutional Centrist');
comparePair('Independent Social Democrat', 'Good Neighbor');

console.log("========================================");
console.log("  Social Stabilizer — SECOND BLACK HOLE");
console.log("  Attracted 4 wrong archetypes");
console.log("========================================\n");

comparePair('Social Stabilizer', 'Fairness Pragmatist');
comparePair('Social Stabilizer', 'World-Minded Reformer');
comparePair('Social Stabilizer', 'Popperian Liberal');
comparePair('Social Stabilizer', 'Halifax Moderate');

console.log("========================================");
console.log("  FAR-LEFT CONFUSION CLUSTER");
console.log("========================================\n");

comparePair('Uncompromising Redistributionist', 'Jacobin Egalitarian');
comparePair('Uncompromising Redistributionist', 'Class-War Leftist');
comparePair('Insurgent Equalizer', 'Moral Firebrand');

console.log("========================================");
console.log("  COMMUNITARIAN LEFT CONFUSION");
console.log("========================================\n");

comparePair('Paternal Egalitarian', 'Pastoral Leftist');
comparePair('Paternal Egalitarian', 'Religious Leftist');

console.log("========================================");
console.log("  POPULIST RIGHT CONFUSION");
console.log("========================================\n");

comparePair('Folk Tribune', 'Anti-Elite Populist');
comparePair('Folk Tribune', 'Resentful Localist');

console.log("========================================");
console.log("  OTHER NOTABLE MISSES");
console.log("========================================\n");

comparePair('Data-Driven Moderate', 'Institutional Optimizer');
comparePair('Data-Driven Moderate', 'Spectator Citizen');
comparePair('Institutional Conservative', 'Burkean Steward');
comparePair('Security Paternalist', 'Chestertonian Traditionalist');
comparePair('Leader-Centered Insurgent', 'Embattled Majoritarian');
comparePair('Survival Pragmatist', 'Passive Cynic');

