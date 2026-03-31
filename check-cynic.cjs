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

const pc = getArch('108');
const sp = getArch('118'); // Survival Pragmatist

console.log("108 Passive Cynic:");
contNodes.forEach(n => {
  if (pc.nodes[n]) console.log(`  ${n.padEnd(6)}: pos=${pc.nodes[n].pos} sal=${pc.nodes[n].sal}`);
});

console.log("\n118 Survival Pragmatist:");
contNodes.forEach(n => {
  if (sp.nodes[n]) console.log(`  ${n.padEnd(6)}: pos=${sp.nodes[n].pos} sal=${sp.nodes[n].sal}`);
});

console.log("\n=== What makes Passive Cynic 'cynical'? ===");
const p = pc.nodes;
console.log(`ONT_H (human nature optimism): pos=${p.ONT_H.pos} — ${p.ONT_H.pos <= 2 ? 'PESSIMISTIC about human nature ✓' : 'neutral/optimistic'}`);
console.log(`ONT_S (system trust):          pos=${p.ONT_S.pos} — ${p.ONT_S.pos >= 4 ? 'systems are BROKEN ✓' : p.ONT_S.pos === 3 ? 'neutral on systems' : 'trusts systems'}`);
console.log(`ZS (zero-sum thinking):        pos=${p.ZS.pos} — ${p.ZS.pos >= 4 ? 'ZERO-SUM (life is winners/losers) ✓' : p.ZS.pos === 3 ? 'moderate' : 'positive-sum'}`);
console.log(`ENG (engagement):              pos=${p.ENG.pos} — ${p.ENG.pos <= 2 ? 'DISENGAGED ✓' : 'engaged'}`);
console.log(`PF (political focus):          pos=${p.PF.pos} — ${p.PF.pos <= 2 ? 'politics NOT central to identity ✓' : 'politically focused'}`);
console.log(`TRB (tribal loyalty):          pos=${p.TRB.pos} — ${p.TRB.pos <= 2 ? 'NOT tribal ✓' : 'tribal'}`);
console.log(`COM (compromise):              pos=${p.COM.pos} — ${p.COM.pos <= 2 ? 'UNCOMPROMISING ✓' : 'open to compromise'}`);
console.log(`MOR (moral circle):            pos=${p.MOR.pos} — ${p.MOR.pos <= 2 ? 'NARROW moral circle ✓' : 'wider'}`);
