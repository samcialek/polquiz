#!/usr/bin/env node
/**
 * blend-population-weights.cjs
 * 
 * Creates blended population weights for quiz display by combining:
 *   - Hand-tuned "election weights" (src/config/population-weights.ts) — calibrated to get 15/17 elections right
 *   - Pew-anchored weights (output/live-data/population-weights.json) — empirically grounded in Pew 2021 typology
 * 
 * The blend uses 60% hand-tuned + 40% Pew-anchored, then renormalizes.
 * This preserves election accuracy while incorporating empirical population structure.
 * 
 * Output: output/live-data/population-weights.json (overwrites with blended version)
 * The election simulator continues to use src/config/population-weights.ts directly.
 */

const fs = require('fs');
const path = require('path');

// ── Load hand-tuned weights from TS source ──
const tsContent = fs.readFileSync(
  path.join(__dirname, '..', 'src', 'config', 'population-weights.ts'),
  'utf8'
);

const handTuned = {};
const re = /'(\d{3})':\s*([\d.]+)/g;
let match;
while ((match = re.exec(tsContent)) !== null) {
  handTuned[match[1]] = parseFloat(match[2]);
}

// ── Load Pew-anchored weights ──
const pewPath = path.join(__dirname, '..', 'output', 'live-data', 'population-weights.json');
let pewWeights;
try {
  pewWeights = JSON.parse(fs.readFileSync(pewPath, 'utf8'));
} catch (e) {
  console.error('No Pew weights found at', pewPath);
  console.error('Run compute-population-weights.cjs first');
  process.exit(1);
}

// ── Validate ──
const htIds = Object.keys(handTuned).sort();
const pewIds = Object.keys(pewWeights).sort();
console.log(`Hand-tuned: ${htIds.length} archetypes, sum=${Object.values(handTuned).reduce((a,b)=>a+b,0).toFixed(4)}`);
console.log(`Pew-anchored: ${pewIds.length} archetypes, sum=${Object.values(pewWeights).reduce((a,b)=>a+parseFloat(b),0).toFixed(4)}`);

// ── Blend ──
const HAND_TUNED_WEIGHT = 0.60;
const PEW_WEIGHT = 0.40;

const blended = {};
let sum = 0;

for (const id of htIds) {
  const ht = handTuned[id] || 0;
  const pw = parseFloat(pewWeights[id]) || 0;
  blended[id] = HAND_TUNED_WEIGHT * ht + PEW_WEIGHT * pw;
  sum += blended[id];
}

// Renormalize to sum to 1.0
for (const id of Object.keys(blended)) {
  blended[id] = parseFloat((blended[id] / sum).toFixed(6));
}

const finalSum = Object.values(blended).reduce((a, b) => a + b, 0);
console.log(`Blended (${HAND_TUNED_WEIGHT*100}% hand-tuned / ${PEW_WEIGHT*100}% Pew): ${Object.keys(blended).length} archetypes, sum=${finalSum.toFixed(6)}`);

// ── Show biggest differences from hand-tuned ──
const diffs = Object.keys(blended)
  .map(id => ({ id, ht: handTuned[id], bl: blended[id], diff: blended[id] - handTuned[id] }))
  .sort((a, b) => Math.abs(b.diff) - Math.abs(a.diff));

console.log('\nTop 10 changes from hand-tuned:');
for (const d of diffs.slice(0, 10)) {
  console.log(`  ${d.id}: ${(d.ht*100).toFixed(2)}% → ${(d.bl*100).toFixed(2)}% (${d.diff > 0 ? '+' : ''}${(d.diff*100).toFixed(2)}%)`);
}

// ── Write ──
fs.writeFileSync(pewPath, JSON.stringify(blended, null, 2));
console.log(`\nWritten blended weights to ${pewPath}`);

// ── Also write a raw-pew backup ──
const rawPewPath = path.join(__dirname, '..', 'output', 'live-data', 'population-weights-pew-raw.json');
fs.writeFileSync(rawPewPath, JSON.stringify(pewWeights, null, 2));
console.log(`Backed up raw Pew weights to ${rawPewPath}`);
