const fs = require('fs');

// We need to parse archetypes.ts to get node values
const arcSrc = fs.readFileSync('src/config/archetypes.ts', 'utf8');

// Extract archetype objects - they're defined as objects in an array
// Let's use a simpler approach - find specific archetypes and their node values
function extractArchetype(name) {
  // Find the archetype block
  const regex = new RegExp(`name:\\s*"${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[\\s\\S]*?nodes:\\s*\\{([\\s\\S]*?)\\}`, 'i');
  const match = arcSrc.match(regex);
  if (!match) return null;
  
  const nodesStr = match[1];
  const nodes = {};
  // Parse continuous nodes
  const contRegex = /(\w+):\s*([\d.]+)/g;
  let m;
  while ((m = contRegex.exec(nodesStr)) !== null) {
    nodes[m[1]] = parseFloat(m[2]);
  }
  // Parse categorical nodes (quoted values)
  const catRegex = /(\w+):\s*"(\w+)"/g;
  while ((m = catRegex.exec(nodesStr)) !== null) {
    nodes[m[1]] = m[2];
  }
  return nodes;
}

// Key confusion pairs to analyze
const pairs = [
  // ISD attracting 5 others
  ['Independent Social Democrat', 'Rawlsian Reformer'],
  ['Independent Social Democrat', 'Global Caretaker'],
  ['Independent Social Democrat', 'Evidence Reformer'],
  ['Independent Social Democrat', 'Institutional Centrist'],
  ['Independent Social Democrat', 'Good Neighbor'],
  
  // Social Stabilizer attracting 4
  ['Social Stabilizer', 'Fairness Pragmatist'],
  ['Social Stabilizer', 'World-Minded Reformer'],
  ['Social Stabilizer', 'Popperian Liberal'],
  ['Social Stabilizer', 'Halifax Moderate'],
  
  // Far-left confusion
  ['Uncompromising Redistributionist', 'Jacobin Egalitarian'],
  ['Uncompromising Redistributionist', 'Class-War Leftist'],
  
  // Paternal cluster
  ['Paternal Egalitarian', 'Pastoral Leftist'],
  ['Paternal Egalitarian', 'Religious Leftist'],
  
  // Populist right confusion
  ['Folk Tribune', 'Anti-Elite Populist'],
  ['Folk Tribune', 'Resentful Localist'],
];

const contNodes = ['MAT','CD','CU','MOR','PRO','COM','ZS','ONT_H','ONT_S','PF','TRB','ENG'];

console.log("=== NODE PROFILE COMPARISON FOR CONFUSED PAIRS ===\n");

pairs.forEach(([a, b]) => {
  const nodesA = extractArchetype(a);
  const nodesB = extractArchetype(b);
  
  if (!nodesA || !nodesB) {
    console.log(`  Could not find: ${!nodesA ? a : b}\n`);
    return;
  }
  
  console.log(`--- ${a} vs ${b} ---`);
  
  let totalDiff = 0;
  let maxDiffNode = '';
  let maxDiff = 0;
  let sameCat = [];
  let diffCat = [];
  
  contNodes.forEach(node => {
    const va = nodesA[node];
    const vb = nodesB[node];
    if (va !== undefined && vb !== undefined) {
      const diff = Math.abs(va - vb);
      totalDiff += diff;
      if (diff > maxDiff) { maxDiff = diff; maxDiffNode = node; }
      const marker = diff < 0.3 ? ' ⚠️SAME' : diff > 1.0 ? ' ✅DIFF' : '';
      console.log(`  ${node.padEnd(6)}: ${va.toFixed(1)} vs ${vb.toFixed(1)} (Δ=${diff.toFixed(1)})${marker}`);
    }
  });
  
  // Categorical
  ['EPS', 'AES'].forEach(node => {
    const va = nodesA[node];
    const vb = nodesB[node];
    if (va && vb) {
      if (va === vb) {
        console.log(`  ${node.padEnd(6)}: ${va} vs ${vb} ⚠️SAME`);
      } else {
        console.log(`  ${node.padEnd(6)}: ${va} vs ${vb} ✅DIFF`);
      }
    }
  });
  
  console.log(`  TOTAL Δ: ${totalDiff.toFixed(1)} | Max diff: ${maxDiffNode} (${maxDiff.toFixed(1)})`);
  console.log('');
});

