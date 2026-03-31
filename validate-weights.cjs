/**
 * Validates population-weights.ts:
 *   1. All weights sum to 1.0 (within 0.001)
 *   2. Prints top 10 and bottom 10 by weight
 *   3. Prints total weight for conservative-leaning vs progressive-leaning archetypes
 */

const fs = require('fs');
const path = require('path');

// ---------------------------------------------------------------------------
// Parse weights from the TS source (avoids needing ts-node / esbuild)
// ---------------------------------------------------------------------------
const src = fs.readFileSync(
  path.join(__dirname, 'src', 'config', 'population-weights.ts'),
  'utf8'
);

const entries = [];
const re = /'(\d+)':\s*([\d.]+),?\s*\/\/\s*(.*)/g;
let m;
while ((m = re.exec(src)) !== null) {
  entries.push({ id: m[1], weight: parseFloat(m[2]), comment: m[3].trim() });
}

// ---------------------------------------------------------------------------
// Parse archetype names from archetypes.ts
// ---------------------------------------------------------------------------
const archSrc = fs.readFileSync(
  path.join(__dirname, 'src', 'config', 'archetypes.ts'),
  'utf8'
);

const nameMap = {};
const nameRe = /id:\s*"(\d+)"[\s\S]*?name:\s*"([^"]+)"/g;
while ((m = nameRe.exec(archSrc)) !== null) {
  nameMap[m[1]] = m[2];
}

// ---------------------------------------------------------------------------
// 1. Sum check
// ---------------------------------------------------------------------------
const sum = entries.reduce((s, e) => s + e.weight, 0);
const pass = Math.abs(sum - 1.0) < 0.001;

console.log('='.repeat(70));
console.log('  POPULATION WEIGHT VALIDATION');
console.log('='.repeat(70));
console.log();
console.log(`Total archetypes: ${entries.length}`);
console.log(`Weight sum:       ${sum.toFixed(6)}  ${pass ? 'PASS' : 'FAIL — must be within 0.001 of 1.0'}`);
console.log();

// ---------------------------------------------------------------------------
// 2. Top 10 / Bottom 10
// ---------------------------------------------------------------------------
const sorted = [...entries].sort((a, b) => b.weight - a.weight);

console.log('-'.repeat(70));
console.log('  TOP 10 BY WEIGHT');
console.log('-'.repeat(70));
for (let i = 0; i < Math.min(10, sorted.length); i++) {
  const e = sorted[i];
  const name = nameMap[e.id] || '???';
  console.log(`  ${e.id}  ${(e.weight * 100).toFixed(1).padStart(5)}%  ${name}`);
}
console.log();

console.log('-'.repeat(70));
console.log('  BOTTOM 10 BY WEIGHT');
console.log('-'.repeat(70));
for (let i = Math.max(0, sorted.length - 10); i < sorted.length; i++) {
  const e = sorted[i];
  const name = nameMap[e.id] || '???';
  console.log(`  ${e.id}  ${(e.weight * 100).toFixed(1).padStart(5)}%  ${name}`);
}
console.log();

// ---------------------------------------------------------------------------
// 3. Political leaning breakdown
// ---------------------------------------------------------------------------
// Explicit classification based on archetype identity and likely vote direction.
// This is more accurate than mechanical MAT/CD averaging.

// Progressive / Left: would vote Dem in a typical election
const progressiveIds = new Set([
  '001', '002', '003', '004', '005', '006', '007', '008', '009', '010', // econ reformers
  '021', '022', '023', '024', '025', '026', '027', '028', '029', '030', '031', // cosmopolitan left
  '032', '033', '034', '035', '036', '037', '039', '040',                       // technocratic left-center
  '042', '043', '045', '046', '047', '048', '049', '050', '051', '052',         // communitarian left
  '118',                                                                           // survival pragmatist (econ-left lean)
  '128', '134', '138', '140',                                                      // loyal Dem, prog nationalist, holistic, market green
]);

// Conservative: would vote GOP in a typical election
const conservativeIds = new Set([
  '062', '063', '064',                                                           // market liberals (lean R)
  '070', '071', '072', '073', '074', '075', '076', '077', '078', '079',         // establishment con
  '080', '081', '082', '083', '084', '085', '086', '087', '088',                // cultural/religious con
  '091', '092', '093', '096', '097',                                             // order/security con
  '098', '099', '101', '102', '103', '104', '105', '107',                       // right populists
  '129', '136', '137', '139',                                                    // loyal GOP, aspirational trad, etc.
]);

// Fringe / Extreme: radical left + radical right + fringe
const fringeIds = new Set([
  '011', '012', '013', '014', '015', '016', '017', '019', '020',  // radical left
  '089', '090', '094', '095', '100', '106',                        // extreme right/authoritarian
  '135',                                                             // disruptive fringe
]);

// Moderate / Disengaged: true centrists + low-engagement + cross-pressured
// Everything not in the above sets

let progWeight = 0;
let conWeight = 0;
let modWeight = 0;
let fringeWeight = 0;
let progCount = 0, conCount = 0, modCount = 0, fringeCount = 0;

for (const e of entries) {
  if (fringeIds.has(e.id)) {
    fringeWeight += e.weight;
    fringeCount++;
  } else if (progressiveIds.has(e.id)) {
    progWeight += e.weight;
    progCount++;
  } else if (conservativeIds.has(e.id)) {
    conWeight += e.weight;
    conCount++;
  } else {
    modWeight += e.weight;
    modCount++;
  }
}

console.log('-'.repeat(70));
console.log('  POLITICAL LEANING BREAKDOWN');
console.log('-'.repeat(70));
console.log(`  Progressive / Left :  ${(progWeight * 100).toFixed(1)}%  (${progCount} archetypes)`);
console.log(`  Conservative       :  ${(conWeight * 100).toFixed(1)}%  (${conCount} archetypes)`);
console.log(`  Moderate / Center  :  ${(modWeight * 100).toFixed(1)}%  (${modCount} archetypes)`);
console.log(`  Fringe / Extreme   :  ${(fringeWeight * 100).toFixed(1)}%  (${fringeCount} archetypes)`);
console.log();
console.log(`  Con + Moderate     :  ${((conWeight + modWeight) * 100).toFixed(1)}%  (target: 55-60%)`);
console.log(`  Progressive + Left :  ${(progWeight * 100).toFixed(1)}%  (target: 35-40%)`);
console.log(`  Fringe / Extreme   :  ${(fringeWeight * 100).toFixed(1)}%  (target: 5-10%)`);
console.log();

// ---------------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------------
console.log('='.repeat(70));
if (pass) {
  console.log('  ALL CHECKS PASSED');
} else {
  console.log('  WEIGHT SUM CHECK FAILED');
  process.exit(1);
}
console.log('='.repeat(70));
