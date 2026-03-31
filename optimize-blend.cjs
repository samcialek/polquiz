/**
 * Find the optimal 3-way blend of empirical, hand-tuned, and Pew weights
 * that best satisfies common-sense population constraints.
 */
const fs = require('fs');

const arch = JSON.parse(fs.readFileSync('output/live-data/archetypes.json', 'utf8'));
const emp = JSON.parse(fs.readFileSync('output/live-data/population-weights-empirical.json', 'utf8'));
const pew = JSON.parse(fs.readFileSync('output/live-data/population-weights-pew-raw.json', 'utf8'));

// Load hand-tuned from TS
const tsContent = fs.readFileSync('src/config/population-weights.ts', 'utf8');
const ht = {};
const re = /'(\d{3})':\s*([\d.]+)/g;
let m;
while ((m = re.exec(tsContent)) !== null) ht[m[1]] = parseFloat(m[2]);

const lookup = {};
arch.forEach(a => lookup[a.id] = a.name);
const ids = arch.map(a => a.id);

// ══════════════════════════════════════════════════════════════════════════
// COMMON-SENSE CONSTRAINTS
// ══════════════════════════════════════════════════════════════════════════

// Target ranges: [min%, max%] for specific archetypes
const targets = {
  '128': [1.5, 4.0],   // Loyal Democrat — large, clear identity
  '129': [1.5, 4.0],   // Loyal Republican — same
  '116': [1.0, 3.0],   // Quiet Middle — substantial silent center
  '108': [1.0, 3.0],   // Passive Cynic — large disengaged bloc
  '010': [1.5, 4.0],   // Bread-and-Butter Progressive — kitchen-table Dems, large
  '006': [1.0, 2.5],   // Fairness Pragmatist — suburban professionals
  '071': [0.8, 2.0],   // Constitutional Conservative — real constituency
  '082': [0.5, 1.5],   // Altar-and-Hearth Conservative — real but smaller
  '075': [0.5, 1.5],   // Institutional Conservative — real
  '132': [0.5, 2.0],   // Negative Partisan — anti-other-side voters
  '133': [0.5, 2.0],   // Sporadic Alarm Voter — crisis-only voters
  '124': [0.5, 2.0],   // Crisis-Activated Sleeper — similar
  '109': [0.5, 2.0],   // Alienated Outsider — real disengaged group
  '115': [0.5, 2.0],   // Quietist — checked-out
  '060': [0.5, 1.5],   // Hinge Citizen — swing voters
  '088': [0.5, 1.5],   // Gentle Traditionalist — moderate cultural conservatives
};

// Global constraints
const MAX_SINGLE = 4.0;   // No archetype > 4%
const MIN_SINGLE = 0.15;  // No archetype < 0.15% (don't have empty slots)
const IDEAL_GINI = 0.35;  // Want moderate inequality, not uniform, not spiky

// Soft targets for category totals
// Left-leaning (001-050 roughly): 35-45%
// Right-leaning (070-107): 20-30%
// Disengaged/swing (108-140): 15-25%
// Centrist (050-069): 10-18%

function gini(weights) {
  const sorted = [...weights].sort((a, b) => a - b);
  const n = sorted.length;
  let sum = 0;
  for (let i = 0; i < n; i++) sum += (2 * (i + 1) - n - 1) * sorted[i];
  const mean = sorted.reduce((a, b) => a + b, 0) / n;
  return sum / (n * n * mean);
}

function score(wEmp, wHt, wPew) {
  // Compute blended weights
  const blended = {};
  let total = 0;
  for (const id of ids) {
    blended[id] = wEmp * (emp[id] || 0) + wHt * (ht[id] || 0) + wPew * parseFloat(pew[id] || 0);
    total += blended[id];
  }
  // Normalize
  for (const id of ids) blended[id] /= total;

  let penalty = 0;

  // Target range penalties
  for (const [id, [lo, hi]] of Object.entries(targets)) {
    const pct = blended[id] * 100;
    if (pct < lo) penalty += (lo - pct) ** 2 * 10;
    if (pct > hi) penalty += (pct - hi) ** 2 * 10;
  }

  // Max single penalty
  for (const id of ids) {
    const pct = blended[id] * 100;
    if (pct > MAX_SINGLE) penalty += (pct - MAX_SINGLE) ** 2 * 20;
    if (pct < MIN_SINGLE) penalty += (MIN_SINGLE - pct) ** 2 * 5;
  }

  // Gini penalty
  const g = gini(Object.values(blended));
  penalty += (g - IDEAL_GINI) ** 2 * 50;

  // Bonus: how many archetypes are in "reasonable" range (0.3% - 3%)?
  let reasonable = 0;
  for (const id of ids) {
    const pct = blended[id] * 100;
    if (pct >= 0.3 && pct <= 3.0) reasonable++;
  }
  penalty -= reasonable * 0.5; // reward reasonable spread

  return { penalty, blended };
}

// ══════════════════════════════════════════════════════════════════════════
// GRID SEARCH
// ══════════════════════════════════════════════════════════════════════════

let best = { penalty: Infinity, wEmp: 0, wHt: 0, wPew: 0, blended: {} };
const step = 0.02;

for (let wEmp = 0; wEmp <= 0.5; wEmp += step) {
  for (let wHt = 0; wHt <= 1.0; wHt += step) {
    const wPew = 1 - wEmp - wHt;
    if (wPew < 0 || wPew > 1) continue;
    const { penalty, blended } = score(wEmp, wHt, wPew);
    if (penalty < best.penalty) {
      best = { penalty, wEmp, wHt, wPew, blended };
    }
  }
}

console.log('═══════════════════════════════════════════════════════════');
console.log('OPTIMAL 3-WAY BLEND');
console.log('═══════════════════════════════════════════════════════════');
console.log(`Empirical: ${(best.wEmp * 100).toFixed(0)}%  Hand-tuned: ${(best.wHt * 100).toFixed(0)}%  Pew: ${(best.wPew * 100).toFixed(0)}%`);
console.log(`Penalty score: ${best.penalty.toFixed(2)}`);
console.log();

// Sort by weight
const sorted = ids
  .map(id => ({ id, name: lookup[id], w: best.blended[id] }))
  .sort((a, b) => b.w - a.w);

console.log('All 130 archetypes (sorted by weight):');
console.log();
for (const { id, name, w } of sorted) {
  const pct = (w * 100).toFixed(2);
  const bar = '█'.repeat(Math.round(w * 200));
  const marker = targets[id] ? ' ◄' : '';
  console.log(`  ${id} ${name.padEnd(35)} ${pct.padStart(5)}% ${bar}${marker}`);
}

// Stats
const vals = Object.values(best.blended);
console.log();
console.log(`Sum: ${vals.reduce((a, b) => a + b, 0).toFixed(4)}`);
console.log(`Max: ${(Math.max(...vals) * 100).toFixed(2)}%`);
console.log(`Min: ${(Math.min(...vals) * 100).toFixed(2)}%`);
console.log(`Gini: ${gini(vals).toFixed(3)}`);
console.log(`Archetypes in 0.3-3% range: ${vals.filter(v => v >= 0.003 && v <= 0.03).length}/130`);

// Check target archetypes
console.log();
console.log('Target archetype check:');
for (const [id, [lo, hi]] of Object.entries(targets)) {
  const pct = (best.blended[id] * 100).toFixed(2);
  const ok = pct >= lo && pct <= hi ? '✓' : '✗';
  console.log(`  ${ok} ${id} ${lookup[id].padEnd(30)} ${pct}% (target: ${lo}-${hi}%)`);
}

// Save optimal blend
const outWeights = {};
for (const id of ids) outWeights[id] = parseFloat(best.blended[id].toFixed(6));
fs.writeFileSync('output/live-data/population-weights-optimal.json', JSON.stringify(outWeights, null, 2));
console.log('\nSaved to output/live-data/population-weights-optimal.json');
