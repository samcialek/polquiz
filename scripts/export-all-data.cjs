const fs = require('fs');

// --- 1. Archetypes metadata ---
// Load from dist (handles both ESM 'export const' and CJS 'exports.' formats)
let ARCHETYPES;
try {
  let code = fs.readFileSync(__dirname + '/../dist/config/archetypes.js', 'utf8');
  // Convert ESM export to something eval-able
  code = code.replace(/^export\s+const\s+/gm, 'const ');
  code = code.replace(/^export\s+\{[^}]*\};?\s*$/gm, '');
  // Wrap and eval
  const fn = new Function(code + '\nreturn { ARCHETYPES };');
  const result = fn();
  ARCHETYPES = result.ARCHETYPES;
  if (!ARCHETYPES) throw new Error('ARCHETYPES not found after eval');
} catch (e) {
  console.error('Cannot load archetypes. Run build first:', e.message);
  process.exit(1);
}

// Load descriptions
const { descriptions } = require('./generate-descriptions.cjs');

// Load population weights
let popWeights = {};
try {
  popWeights = JSON.parse(fs.readFileSync(__dirname + '/../output/live-data/population-weights.json', 'utf8'));
  console.log('Loaded population weights for', Object.keys(popWeights).length, 'archetypes');
} catch (e) {
  console.warn('No population-weights.json found, using uniform weights');
}

const archetypesMeta = ARCHETYPES.map(a => ({
  id: a.id,
  name: a.name,
  description: descriptions[a.id] || '',
  populationWeight: popWeights[a.id] || (1 / ARCHETYPES.length),
  tier: a.tier,
  prior: a.prior,
  // Include node templates for centroid comparison
  nodes: Object.fromEntries(
    Object.entries(a.nodes).map(([k, v]) => {
      if (v.kind === 'continuous') return [k, { kind: 'continuous', pos: v.pos, sal: v.sal, anti: v.anti || null }];
      if (v.kind === 'categorical') return [k, { kind: 'categorical', probs: v.probs, sal: v.sal, antiCats: v.antiCats || null }];
      return [k, v];
    })
  )
}));

// --- 2. Elections data ---
const votesCSV = fs.readFileSync('output/historical_votes.csv', 'utf-8');
const vLines = votesCSV.trim().split('\n');
const vHeader = vLines[0].split(',');
const years = vHeader.slice(2).map(Number);

const partyMap = {
  'Jefferson': 'dem', 'Madison': 'dem', 'Monroe': 'dem', 'Jackson': 'dem',
  'Van Buren': 'dem', 'Polk': 'dem', 'Pierce': 'dem', 'Buchanan': 'dem',
  'Tilden': 'dem', 'Hancock': 'dem', 'Cleveland': 'dem', 'Bryan': 'dem',
  'Wilson': 'dem', 'Cox': 'dem', 'Davis': 'dem', 'Smith': 'dem',
  'FDR': 'dem', 'Truman': 'dem', 'Stevenson': 'dem',
  'Kennedy': 'dem', 'Johnson': 'dem', 'Humphrey': 'dem', 'McGovern': 'dem',
  'Carter': 'dem', 'Mondale': 'dem', 'Dukakis': 'dem', 'Clinton': 'dem',
  'Gore': 'dem', 'Kerry': 'dem', 'Obama': 'dem', 'Biden': 'dem', 'Harris': 'dem',
  'Adams': 'rep', 'Pinckney': 'rep', 'King': 'rep', 'Clay': 'rep',
  'Harrison': 'rep', 'Taylor': 'rep', 'Scott': 'rep', 'Fremont': 'rep',
  'Lincoln': 'rep', 'Grant': 'rep', 'Hayes': 'rep', 'Garfield': 'rep',
  'Blaine': 'rep', 'McKinley': 'rep', 'Taft': 'rep', 'Hughes': 'rep',
  'Harding': 'rep', 'Coolidge': 'rep', 'Hoover': 'rep', 'Landon': 'rep',
  'Willkie': 'rep', 'Dewey': 'rep', 'Eisenhower': 'rep', 'Nixon': 'rep',
  'Goldwater': 'rep', 'Ford': 'rep', 'Reagan': 'rep', 'Bush': 'rep',
  'Dole': 'rep', 'McCain': 'rep', 'Romney': 'rep', 'Trump': 'rep',
  'T. Roosevelt': 'rep',
  // Pre-Civil-War Democrats missing from original map
  'Crawford': 'dem', 'Cass': 'dem', 'Douglas': 'dem',
  // Civil War / Reconstruction Democrats
  'McClellan': 'dem', 'Seymour': 'dem',
  // Early 20th century Democrats
  'Parker': 'dem',
  // Third party / independent
  'Fillmore': 'third', 'Breckinridge': 'third', 'Bell': 'third',
  'Thurmond': 'third', 'Anderson': 'third',
  'Weaver': 'third', 'Debs': 'third', 'La Follette': 'third',
  'Wallace': 'third', 'Perot': 'third', 'Nader': 'third',
  'Greeley': 'other', 'Washington': 'other',
};

const specialParty = {
  '1912_Roosevelt': 'third',
  // FDR (1932-1944) vs Teddy Roosevelt (1904) disambiguation
  '1904_Roosevelt': 'rep',
  '1932_Roosevelt': 'dem', '1936_Roosevelt': 'dem',
  '1940_Roosevelt': 'dem', '1944_Roosevelt': 'dem',
  // Gary Johnson 2016 vs LBJ 1964
  '2016_Johnson': 'third',
};

const elections = {};
for (let i = 1; i < vLines.length; i++) {
  const match = vLines[i].match(/^(\d+),"([^"]+)",(.+)$/);
  if (!match) continue;
  const id = match[1];
  const votes = match[3].split(',');
  elections[id] = years.map((y, j) => {
    const c = votes[j] || 'ABSTAIN';
    let p = 'other';
    const key = y + '_' + c;
    if (specialParty[key]) p = specialParty[key];
    else if (partyMap[c]) p = partyMap[c];
    if (c === 'ABSTAIN') p = 'abstain';
    return { y, c, p };
  });
}

// --- 3. World alignment data ---
const alignCSV = fs.readFileSync('global/regime-alignment.csv', 'utf-8');
const aLines = alignCSV.trim().split('\n');
const aHeader = aLines[0].split(',');
const regimeColumns = aHeader.slice(2);

// Parse regime metadata once
const regimeMeta = regimeColumns.map(col => {
  const pipeIdx = col.indexOf('|');
  const country = col.substring(0, pipeIdx);
  const rest = col.substring(pipeIdx + 1);
  const dateMatch = rest.match(/\((\d{4})-(\d{4})\)/);
  const regime = rest.replace(/\s*\(\d{4}-\d{4}\)/, '').trim();
  return {
    country,
    regime,
    start: dateMatch ? parseInt(dateMatch[1]) : 0,
    end: dateMatch ? parseInt(dateMatch[2]) : 0
  };
});

const alignments = {};
for (let i = 1; i < aLines.length; i++) {
  const match = aLines[i].match(/^(\d+),([^,]+),(.+)$/);
  if (!match) continue;
  const id = match[1];
  const scores = match[3].split(',').map(Number);
  
  // Group by country
  const byCountry = {};
  for (let j = 0; j < regimeMeta.length; j++) {
    const rm = regimeMeta[j];
    if (!byCountry[rm.country]) byCountry[rm.country] = [];
    byCountry[rm.country].push({
      r: rm.regime,
      s: rm.start,
      e: rm.end,
      v: Math.round(scores[j] * 1000) / 1000  // 3 decimal places to save space
    });
  }
  alignments[id] = byCountry;
}

// --- Write output ---
const outDir = 'output/live-data';
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

fs.writeFileSync(outDir + '/archetypes.json', JSON.stringify(archetypesMeta));
console.log('archetypes.json:', (fs.statSync(outDir + '/archetypes.json').size / 1024).toFixed(0) + 'KB');

fs.writeFileSync(outDir + '/elections.json', JSON.stringify(elections));
console.log('elections.json:', (fs.statSync(outDir + '/elections.json').size / 1024).toFixed(0) + 'KB');

fs.writeFileSync(outDir + '/alignments.json', JSON.stringify(alignments));
console.log('alignments.json:', (fs.statSync(outDir + '/alignments.json').size / 1024).toFixed(0) + 'KB');

// Also create a compact version: alignments split per-archetype for lazy loading
const perArchDir = outDir + '/alignments';
if (!fs.existsSync(perArchDir)) fs.mkdirSync(perArchDir, { recursive: true });
for (const [id, data] of Object.entries(alignments)) {
  fs.writeFileSync(perArchDir + '/' + id + '.json', JSON.stringify(data));
}
console.log('Per-archetype alignments:', Object.keys(alignments).length + ' files');

console.log('\nDone! Files in ' + outDir);
