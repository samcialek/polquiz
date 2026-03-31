const fs = require('fs');
const arcSrc = fs.readFileSync('src/config/archetypes.ts', 'utf8');
const contNodes = ['MAT','CD','CU','MOR','PRO','COM','ZS','ONT_H','ONT_S','PF','TRB','ENG'];

function getArch(id) {
  const regex = new RegExp(`id:\\s*"${id}"\\s*,\\s*name:\\s*"([^"]+)"[\\s\\S]*?nodes:\\s*\\{([\\s\\S]*?)\\}\\s*\\}`, 'i');
  const m = arcSrc.match(regex);
  if (!m) return null;
  const nodes = {};
  contNodes.forEach(n => {
    const nm = m[2].match(new RegExp(n + ':\\s*\\{[^}]*pos:\\s*(\\d+)[^}]*sal:\\s*(\\d+)'));
    if (nm) nodes[n] = { pos: parseInt(nm[1]), sal: parseInt(nm[2]) };
  });
  return { name: m[1], nodes };
}

// 115 vs likely winners (051 Ecological Localist was #2 in old results)
const a115 = getArch('115');
const a051 = getArch('051');
const a088 = getArch('088');

console.log("115 Quietist profile:");
contNodes.forEach(n => console.log(`  ${n.padEnd(6)}: pos=${a115.nodes[n].pos} sal=${a115.nodes[n].sal}`));

console.log("\n051 Ecological Localist profile:");
contNodes.forEach(n => console.log(`  ${n.padEnd(6)}: pos=${a051.nodes[n].pos} sal=${a051.nodes[n].sal}`));

console.log("\n=== Discriminators 115 vs 051 ===");
contNodes.forEach(n => {
  const diff = Math.abs(a115.nodes[n].pos - a051.nodes[n].pos);
  if (diff >= 1) console.log(`  ${n}: 115=${a115.nodes[n].pos}(sal${a115.nodes[n].sal}) vs 051=${a051.nodes[n].pos}(sal${a051.nodes[n].sal}) Δ=${diff}${diff >= 2 ? ' ← DISC' : ''}`);
});
