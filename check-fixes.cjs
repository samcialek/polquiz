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

// 019 Anarchist Mutualist vs 020 Horizontalist Dissenter
const a019 = getArch('019');
const a020 = getArch('020');
console.log("=== 019 Anarchist Mutualist vs 020 Horizontalist Dissenter ===");
contNodes.forEach(n => {
  const diff = Math.abs(a019.nodes[n].pos - a020.nodes[n].pos);
  if (diff >= 2) console.log(`  ${n}: 019=${a019.nodes[n].pos}(sal${a019.nodes[n].sal}) vs 020=${a020.nodes[n].pos}(sal${a020.nodes[n].sal}) Δ=${diff} ← DISCRIMINATOR`);
});

// 115 Quietist — who beat it?
const results = JSON.parse(fs.readFileSync('output/archetype-quiz-results.json', 'utf8'));
const r115 = results.find(r => r.archetypeId === '115');
const winnerId = r115.top5[0].id;
const a115 = getArch('115');
const aWin = getArch(winnerId);
console.log(`\n=== 115 Quietist vs ${winnerId} ${aWin.name} ===`);
contNodes.forEach(n => {
  const diff = Math.abs(a115.nodes[n].pos - aWin.nodes[n].pos);
  if (diff >= 2) console.log(`  ${n}: 115=${a115.nodes[n].pos}(sal${a115.nodes[n].sal}) vs ${winnerId}=${aWin.nodes[n].pos}(sal${aWin.nodes[n].sal}) Δ=${diff} ← DISCRIMINATOR`);
  else if (diff >= 1) console.log(`  ${n}: 115=${a115.nodes[n].pos}(sal${a115.nodes[n].sal}) vs ${winnerId}=${aWin.nodes[n].pos}(sal${aWin.nodes[n].sal}) Δ=${diff}`);
});
