const fs = require('fs');
const files = [
  'src/historical/elections-1789-1852.ts',
  'src/historical/elections-1856-1888.ts',
  'src/historical/elections-1892-1916.ts',
  'src/historical/elections-1920-1936.ts',
  'src/historical/candidates.ts'
];

const results = [];
for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  const blocks = content.split(/\{\s*\n\s*name:/);
  for (let i = 1; i < blocks.length; i++) {
    const block = 'name:' + blocks[i].split(/\},?\s*(?:\n\s*\]|\n\s*\{)/)[0];
    const get = (key) => { const m = block.match(new RegExp(key + ':\\s*(\\d+)')); return m ? parseInt(m[1]) : null; };
    const nameMatch = block.match(/name:\s*"([^"]+)"/);
    const name = nameMatch ? nameMatch[1] : '';
    const year = get('year');
    if (!year || !name) continue;
    const contNodes = ['MAT','CD','CU','MOR','PRO','COM','ZS','ONT_H','ONT_S','PF','TRB','ENG'];
    const vals = contNodes.map(n => get(n)).filter(v => v !== null);
    const extremes = vals.filter(v => v === 1 || v === 5).length;
    const at1 = vals.filter(v => v === 1).length;
    const at5 = vals.filter(v => v === 5).length;
    results.push({ year, name, extremes, at1, at5, total: vals.length });
  }
}

results.sort((a, b) => a.year - b.year || a.name.localeCompare(b.name));

console.log('Year  Candidate        Extremes  At1  At5  /Total');
console.log('----  ---------------  --------  ---  ---  ------');
for (const r of results) {
  const flag = r.extremes >= 6 ? ' <<<' : r.extremes >= 4 ? ' **' : '';
  console.log(
    String(r.year).padEnd(6) + 
    r.name.padEnd(17) + 
    String(r.extremes).padStart(4) + 
    String(r.at1).padStart(6) + 
    String(r.at5).padStart(5) + 
    ('/' + r.total).padStart(6) + flag
  );
}

const total = results.length;
const e4 = results.filter(r => r.extremes >= 4).length;
const e6 = results.filter(r => r.extremes >= 6).length;
const e8 = results.filter(r => r.extremes >= 8).length;
console.log('\n--- SUMMARY ---');
console.log(`Total candidates: ${total}`);
console.log(`4+ extreme nodes: ${e4} (${(e4/total*100).toFixed(1)}%)`);
console.log(`6+ extreme nodes: ${e6} (${(e6/total*100).toFixed(1)}%)`);
console.log(`8+ extreme nodes: ${e8} (${(e8/total*100).toFixed(1)}%)`);

// Identify which were clearly "pushed" — losers with 6+ extremes
console.log('\n--- MOST EXTREME PROFILES (8+ nodes at 1 or 5) ---');
for (const r of results.filter(r => r.extremes >= 8)) {
  console.log(`${r.year} ${r.name}: ${r.extremes}/12 extreme (${r.at1} at min, ${r.at5} at max)`);
}

// Avg extremes by era
const eras = [
  { label: '1789-1852', lo: 1789, hi: 1852 },
  { label: '1856-1888', lo: 1856, hi: 1888 },
  { label: '1892-1936', lo: 1892, hi: 1936 },
  { label: '1940-2024', lo: 1940, hi: 2024 },
];
console.log('\n--- AVERAGE EXTREMES BY ERA ---');
for (const era of eras) {
  const group = results.filter(r => r.year >= era.lo && r.year <= era.hi);
  const avg = group.reduce((s, r) => s + r.extremes, 0) / group.length;
  console.log(`${era.label}: ${avg.toFixed(1)} avg extreme nodes per candidate (n=${group.length})`);
}
