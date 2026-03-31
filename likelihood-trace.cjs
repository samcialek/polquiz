const fs = require('fs');

// The key finding: the posterior is NOT a standard Bayesian update.
// Instead it's:
// 1. Compute archetypeDistance(respondent, archetype) for all archetypes
// 2. Apply softmax: likelihood = exp(-(dist - minDist) / temperature)
// 3. Multiply by prior
// 4. Normalize
//
// The distance function uses:
//   expectedPos = weighted mean of posDist (the respondent's belief distribution)
//   posMeanDiff = |expectedPos - archetype.pos| / 4
//   posProbDist = 1 - posDist[archetype.pos - 1]
//   positionDist = posMeanDiff * 0.6 + posProbDist * 0.4
//   salienceDist = similar
//   nodeDist = positionDist * 0.65 + salienceDist * 0.35 + antiPenalty
//   nodeWeight = archSalWeight * respondentSalWeight
//   totalDist = sum(nodeDist * nodeWeight) / sum(nodeWeight)
//
// Temperature: starts at 0.12, cools to 0.04 by question 40

// Let's trace what happens for archetype 067 (Free-Exchange Modernist)
// MAT=5 (sal=3) vs Evidence Reformer (034) MAT=2 (sal=1)
// 
// The PROBLEM: distance is a weighted average over ALL nodes.
// Even if MAT differs by 3 positions, the other 11+ nodes may be similar,
// diluting the MAT signal.

// Let's compute: if respondent's posDist for MAT peaks at pos=5,
// what's the distance contribution from MAT for each archetype?

function nodeDistCalc(expectedPos, expectedSal, archPos, archSal) {
  const posMeanDiff = Math.abs(expectedPos - archPos) / 4;
  const posProb = 0; // placeholder - need actual posDist
  const posProbDist = 1 - posProb; // we'd need the actual dist
  const positionDist = posMeanDiff * 0.6 + posProbDist * 0.4;
  
  const salMeanDiff = Math.abs(expectedSal - archSal) / 3;
  const salProbDist = 1 - 0.25; // placeholder
  const salienceDist = salMeanDiff * 0.6 + salProbDist * 0.4;
  
  const nodeDist = positionDist * 0.65 + salienceDist * 0.35;
  
  const archSalWeight = 0.5 + archSal * 0.5;
  const respondentSalWeight = 0.5 + expectedSal * 0.25;
  const nodeWeight = archSalWeight * respondentSalWeight;
  
  return { nodeDist, nodeWeight, weighted: nodeDist * nodeWeight };
}

// Simulate: respondent's expectedPos on each node matches 067's profile
// 067 Free-Exchange Modernist profile:
const arch067 = {
  MAT: {pos:5, sal:3}, CD: {pos:2, sal:2}, CU: {pos:4, sal:2},
  MOR: {pos:3, sal:1}, PRO: {pos:1, sal:3}, COM: {pos:3, sal:1},
  ZS: {pos:1, sal:2}, ONT_H: {pos:5, sal:2}, ONT_S: {pos:2, sal:1},
  PF: {pos:3, sal:1}, TRB: {pos:1, sal:2}, ENG: {pos:3, sal:1}
};

// 034 Evidence Reformer profile:
const arch034 = {
  MAT: {pos:2, sal:1}, CD: {pos:2, sal:1}, CU: {pos:4, sal:1},
  MOR: {pos:4, sal:1}, PRO: {pos:3, sal:2}, COM: {pos:3, sal:1},
  ZS: {pos:2, sal:1}, ONT_H: {pos:5, sal:2}, ONT_S: {pos:2, sal:1},
  PF: {pos:3, sal:0}, TRB: {pos:1, sal:2}, ENG: {pos:3, sal:1}
};

// 002 ISD profile:
const arch002 = {
  MAT: {pos:1, sal:2}, CD: {pos:2, sal:1}, CU: {pos:4, sal:1},
  MOR: {pos:5, sal:2}, PRO: {pos:3, sal:2}, COM: {pos:4, sal:1},
  ZS: {pos:2, sal:1}, ONT_H: {pos:4, sal:1}, ONT_S: {pos:3, sal:1},
  PF: {pos:2, sal:1}, TRB: {pos:2, sal:1}, ENG: {pos:3, sal:1}
};

const nodes = ['MAT','CD','CU','MOR','PRO','COM','ZS','ONT_H','ONT_S','PF','TRB','ENG'];

// If respondent perfectly matches 067, what are the distances?
console.log("=== If respondent perfectly matches 067 (Free-Exchange Modernist) ===\n");

let dist067 = 0, weight067 = 0;
let dist034 = 0, weight034 = 0;
let dist002 = 0, weight002 = 0;

nodes.forEach(n => {
  const resp = arch067[n]; // respondent matches 067 perfectly
  
  // Distance to 067 (self) — should be 0 on position
  const d067 = Math.abs(resp.pos - arch067[n].pos) / 4; // 0
  const d034 = Math.abs(resp.pos - arch034[n].pos) / 4;
  const d002 = Math.abs(resp.pos - arch002[n].pos) / 4;
  
  // Salience distance
  const sd067 = Math.abs(resp.sal - arch067[n].sal) / 3;
  const sd034 = Math.abs(resp.sal - arch034[n].sal) / 3;
  const sd002 = Math.abs(resp.sal - arch002[n].sal) / 3;
  
  const posDist067 = d067 * 0.6; // ignoring posProb for now
  const posDist034 = d034 * 0.6;
  const posDist002 = d002 * 0.6;
  
  const salDist067 = sd067 * 0.6;
  const salDist034 = sd034 * 0.6;
  const salDist002 = sd002 * 0.6;
  
  const nodeDist067 = posDist067 * 0.65 + salDist067 * 0.35;
  const nodeDist034 = posDist034 * 0.65 + salDist034 * 0.35;
  const nodeDist002 = posDist002 * 0.65 + salDist002 * 0.35;
  
  // Weight = archSalWeight * respondentSalWeight
  // For EACH archetype, the weight uses THAT archetype's sal
  const respSalW = 0.5 + resp.sal * 0.25;
  
  const w067 = (0.5 + arch067[n].sal * 0.5) * respSalW;
  const w034 = (0.5 + arch034[n].sal * 0.5) * respSalW;
  const w002 = (0.5 + arch002[n].sal * 0.5) * respSalW;
  
  dist067 += nodeDist067 * w067;
  weight067 += w067;
  dist034 += nodeDist034 * w034;
  weight034 += w034;
  dist002 += nodeDist002 * w002;
  weight002 += w002;
  
  if (d034 > 0 || d002 > 0) {
    console.log(`${n.padEnd(6)}: resp=${resp.pos} | 067=${arch067[n].pos}(Δ${(d067*4).toFixed(0)}) 034=${arch034[n].pos}(Δ${(d034*4).toFixed(0)}) ISD=${arch002[n].pos}(Δ${(d002*4).toFixed(0)}) | weights: 067=${w067.toFixed(2)} 034=${w034.toFixed(2)} ISD=${w002.toFixed(2)}`);
  }
});

const finalDist067 = dist067 / weight067;
const finalDist034 = dist034 / weight034;
const finalDist002 = dist002 / weight002;

console.log(`\n--- Final distances (lower = better) ---`);
console.log(`067 Free-Exchange Modernist: ${finalDist067.toFixed(4)}`);
console.log(`034 Evidence Reformer:       ${finalDist034.toFixed(4)}`);
console.log(`002 ISD:                     ${finalDist002.toFixed(4)}`);

// Now apply softmax with temperature = 0.04 (late game)
const minDist = Math.min(finalDist067, finalDist034, finalDist002);
const temp = 0.04;
const l067 = Math.exp(-(finalDist067 - minDist) / temp);
const l034 = Math.exp(-(finalDist034 - minDist) / temp);
const l002 = Math.exp(-(finalDist002 - minDist) / temp);
const totalL = l067 + l034 + l002;

console.log(`\n--- Softmax posteriors (temp=${temp}) ---`);
console.log(`067: ${(l067/totalL*100).toFixed(1)}%`);
console.log(`034: ${(l034/totalL*100).toFixed(1)}%`);
console.log(`ISD: ${(l002/totalL*100).toFixed(1)}%`);

// KEY INSIGHT: the weight varies per archetype!
// Archetype 034 has MAT sal=1, so its weight on MAT is (0.5 + 1*0.5) * (0.5 + 3*0.25) = 1.0 * 1.25 = 1.25
// Archetype 067 has MAT sal=3, so its weight on MAT is (0.5 + 3*0.5) * (0.5 + 3*0.25) = 2.0 * 1.25 = 2.50
// 
// This means: the same MAT mismatch (respondent at pos=5) hurts 067 MORE than it helps
// because 067 has HIGHER sal on MAT, making MAT count MORE in 067's distance.
// 
// Wait no — if respondent matches 067 perfectly on MAT, then 067's MAT distance = 0 and
// 034's MAT distance is nonzero. That should help 067.
//
// But the DENOMINATOR (totalWeight) is also larger for 067 because of higher sal.
// This means non-MAT nodes get diluted LESS for 067 than for 034.
//
// The real issue: 067 and 034 differ on MAT (Δ3) and PRO (Δ2).
// But they're IDENTICAL or within 1 on 10 other nodes.
// Since those 10 nodes also contribute to distance (albeit with lower weight),
// the signal from MAT and PRO gets drowned in the average.

console.log("\n\n=== THE PROBLEM: WEIGHTED AVERAGE DILUTION ===");
console.log("Even with a perfect respondent match to 067:");
console.log(`  MAT contributes Δ of ${(Math.abs(5-2)/4 * 0.6 * 0.65).toFixed(3)} to 034's distance`);
console.log(`  PRO contributes Δ of ${(Math.abs(1-3)/4 * 0.6 * 0.65).toFixed(3)} to 034's distance`);
console.log(`  But 10 other nodes contribute ~0 to BOTH distances`);
console.log(`  The weighted average dilutes the MAT/PRO signal across 12 nodes`);
console.log(`  Total distance difference between 067 and 034 = ${Math.abs(finalDist067 - finalDist034).toFixed(4)}`);
console.log(`  With temperature ${temp}, that translates to likelihood ratio = ${(Math.exp(-Math.abs(finalDist067 - finalDist034)/temp)).toFixed(4)}`);

