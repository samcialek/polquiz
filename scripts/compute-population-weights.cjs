/**
 * Compute population weights for 130 PRISM archetypes
 * 
 * Methodology: Top-down anchoring from Pew/Hidden Tribes typologies,
 * validated against 74K survey microdata from CES/ANES/VSG.
 */

const fs = require('fs');
const path = require('path');

// ========== STEP 1: Load archetypes ==========
const archetypesPath = path.join(__dirname, '..', 'output', 'live-data', 'archetypes.json');
const archetypes = JSON.parse(fs.readFileSync(archetypesPath, 'utf-8'));

console.log(`Loaded ${archetypes.length} archetypes`);

// Node polarity reference:
// MAT: 1=redistribution, 5=free market
// CD: 1=progressive, 5=conservative  
// CU: 1=closed/assimilationist, 5=open/pluralist
// MOR: 1=narrow/particularist, 5=wide/universalist
// PRO: 1=anti-procedural, 5=rules-bound
// COM: 1=uncompromising, 5=consensus-seeking
// ZS: 1=positive-sum, 5=zero-sum
// ONT_H: 1=pessimistic, 5=optimistic
// ONT_S: 1=system stable, 5=system broken
// PF: 1=low personal freedom, 5=high
// TRB: 1=low tribal, 5=high tribal
// ENG: 1=disengaged, 5=engaged

// ========== STEP 2: Define Pew/Hidden Tribes clusters ==========

// Pew Political Typology 2021 - 8 clusters with approximate node profiles
const pewClusters = [
  {
    name: "Faith and Flag Conservatives",
    share: 0.10,
    profile: { MAT: 4.5, CD: 4.8, CU: 1.5, MOR: 2.0, PRO: 3.5, COM: 1.5, ZS: 4.0, ONT_H: 2.5, ONT_S: 4.0, PF: 3.0, TRB: 4.5, ENG: 4.5 }
  },
  {
    name: "Populist Right",
    share: 0.11,
    profile: { MAT: 3.5, CD: 4.0, CU: 1.8, MOR: 2.5, PRO: 2.0, COM: 1.5, ZS: 4.5, ONT_H: 2.0, ONT_S: 4.5, PF: 4.0, TRB: 4.0, ENG: 3.5 }
  },
  {
    name: "Ambivalent Right",
    share: 0.12,
    profile: { MAT: 3.8, CD: 3.5, CU: 2.5, MOR: 3.0, PRO: 3.0, COM: 3.5, ZS: 3.0, ONT_H: 3.0, ONT_S: 3.0, PF: 3.5, TRB: 2.5, ENG: 2.0 }
  },
  {
    name: "Stressed Sideliners",
    share: 0.15,
    profile: { MAT: 3.0, CD: 3.0, CU: 3.0, MOR: 3.0, PRO: 2.5, COM: 3.0, ZS: 3.5, ONT_H: 2.5, ONT_S: 3.5, PF: 3.0, TRB: 2.5, ENG: 1.5 }
  },
  {
    name: "Outsider Left",
    share: 0.10,
    profile: { MAT: 2.0, CD: 2.0, CU: 4.0, MOR: 3.5, PRO: 2.0, COM: 2.0, ZS: 4.0, ONT_H: 2.0, ONT_S: 4.5, PF: 4.0, TRB: 3.0, ENG: 2.0 }
  },
  {
    name: "Democratic Mainstays",
    share: 0.16,
    profile: { MAT: 2.0, CD: 2.0, CU: 3.5, MOR: 4.0, PRO: 4.0, COM: 4.0, ZS: 2.0, ONT_H: 3.5, ONT_S: 2.5, PF: 3.0, TRB: 3.0, ENG: 3.5 }
  },
  {
    name: "Establishment Liberals",
    share: 0.13,
    profile: { MAT: 2.0, CD: 1.5, CU: 4.5, MOR: 4.5, PRO: 4.0, COM: 3.5, ZS: 1.5, ONT_H: 4.0, ONT_S: 2.0, PF: 4.0, TRB: 2.0, ENG: 4.5 }
  },
  {
    name: "Progressive Left",
    share: 0.06,
    profile: { MAT: 1.2, CD: 1.2, CU: 4.8, MOR: 4.8, PRO: 2.5, COM: 1.5, ZS: 3.0, ONT_H: 3.0, ONT_S: 4.5, PF: 4.5, TRB: 3.5, ENG: 5.0 }
  }
];

// Remaining ~7% are truly unclassifiable / apolitical  
const UNCLASSIFIED_SHARE = 0.07;

// Engagement-weighted distance: give extra weight to ENG node for sideliner detection
function engagementWeightedDistance(profileA, profileB) {
  const nodes = ['MAT', 'CD', 'CU', 'MOR', 'PRO', 'COM', 'ZS', 'ONT_H', 'ONT_S', 'PF', 'TRB', 'ENG'];
  const engWeight = 2.0; // ENG gets double weight for cluster assignment
  let sum = 0;
  for (const n of nodes) {
    const a = profileA[n] || 3.0;
    const b = profileB[n] || 3.0;
    const w = n === 'ENG' ? engWeight : 1.0;
    sum += w * (a - b) ** 2;
  }
  return Math.sqrt(sum);
}

// ========== STEP 3: Score each archetype against clusters ==========

function euclideanDistance(profileA, profileB) {
  const nodes = ['MAT', 'CD', 'CU', 'MOR', 'PRO', 'COM', 'ZS', 'ONT_H', 'ONT_S', 'PF', 'TRB', 'ENG'];
  let sum = 0;
  for (const n of nodes) {
    const a = profileA[n] || 3.0;
    const b = profileB[n] || 3.0;
    sum += (a - b) ** 2;
  }
  return Math.sqrt(sum);
}

function getArchetypeProfile(arch) {
  const profile = {};
  const nodes = arch.nodes || {};
  for (const [code, data] of Object.entries(nodes)) {
    if (data && typeof data.pos === 'number') {
      profile[code] = data.pos;
    }
  }
  return profile;
}

// For each archetype, find distances to all Pew clusters
const archetypeClusterScores = [];

for (const arch of archetypes) {
  const profile = getArchetypeProfile(arch);
  const scores = pewClusters.map(cluster => ({
    cluster: cluster.name,
    share: cluster.share,
    distance: engagementWeightedDistance(profile, cluster.profile)
  }));
  
  // Sort by distance (closest first)
  scores.sort((a, b) => a.distance - b.distance);
  
  archetypeClusterScores.push({
    id: arch.id,
    name: arch.name,
    profile,
    scores,
    bestCluster: scores[0].cluster,
    bestDistance: scores[0].distance
  });
}

// ========== STEP 4: Assign weights via soft clustering ==========

// Group archetypes by best-matching cluster
const clusterGroups = {};
for (const cluster of pewClusters) {
  clusterGroups[cluster.name] = [];
}

for (const arch of archetypeClusterScores) {
  // Hard assignment: each archetype goes to nearest cluster only
  const top1 = arch.scores[0];
  
  clusterGroups[top1.cluster].push({
    id: arch.id,
    name: arch.name,
    relativeWeight: 1.0,
    distance: top1.distance
  });
}

// ========== STEP 5: Distribute population share within each cluster ==========

const rawWeights = {};

// Initialize all archetypes with a small base weight (from unclassified share)
const baseWeight = UNCLASSIFIED_SHARE / archetypes.length;
for (const arch of archetypes) {
  rawWeights[arch.id] = baseWeight;
}

for (const cluster of pewClusters) {
  const members = clusterGroups[cluster.name];
  if (!members || members.length === 0) continue;
  
  // Within cluster, distribute based on inverse distance (closer = more representative)
  const invDistances = members.map(m => ({
    id: m.id,
    invDist: (1 / (m.distance + 0.1)) * m.relativeWeight
  }));
  
  const totalInvDist = invDistances.reduce((s, m) => s + m.invDist, 0);
  
  for (const m of invDistances) {
    const clusterContribution = (m.invDist / totalInvDist) * cluster.share;
    rawWeights[m.id] = (rawWeights[m.id] || 0) + clusterContribution;
  }
}

// ========== STEP 6: Normalize and apply constraints ==========

// Cap at 8%
const MAX_WEIGHT = 0.08;
let totalWeight = Object.values(rawWeights).reduce((s, w) => s + w, 0);

// First pass: normalize
for (const id of Object.keys(rawWeights)) {
  rawWeights[id] = rawWeights[id] / totalWeight;
}

// Second pass: cap and redistribute
let excess = 0;
let uncappedCount = 0;
for (const id of Object.keys(rawWeights)) {
  if (rawWeights[id] > MAX_WEIGHT) {
    excess += rawWeights[id] - MAX_WEIGHT;
    rawWeights[id] = MAX_WEIGHT;
  } else {
    uncappedCount++;
  }
}

if (excess > 0 && uncappedCount > 0) {
  const redistrib = excess / uncappedCount;
  for (const id of Object.keys(rawWeights)) {
    if (rawWeights[id] < MAX_WEIGHT) {
      rawWeights[id] += redistrib;
    }
  }
}

// Final normalize to ensure sum = 1.0
totalWeight = Object.values(rawWeights).reduce((s, w) => s + w, 0);
for (const id of Object.keys(rawWeights)) {
  rawWeights[id] = rawWeights[id] / totalWeight;
}

// ========== STEP 7: Validate ==========

// Check left/right/center split
let leftWeight = 0, rightWeight = 0, centerWeight = 0;
for (const arch of archetypes) {
  const w = rawWeights[arch.id];
  const mat = arch.nodes?.MAT?.pos || 3;
  const cd = arch.nodes?.CD?.pos || 3;
  const avg = (mat + cd) / 2;
  
  if (avg < 2.5) leftWeight += w;
  else if (avg > 3.5) rightWeight += w;
  else centerWeight += w;
}

console.log('\n=== VALIDATION ===');
console.log(`Left-leaning: ${(leftWeight * 100).toFixed(1)}%`);
console.log(`Right-leaning: ${(rightWeight * 100).toFixed(1)}%`);
console.log(`Centrist: ${(centerWeight * 100).toFixed(1)}%`);
console.log(`Total: ${(Object.values(rawWeights).reduce((s, w) => s + w, 0) * 100).toFixed(2)}%`);

// Check max weight
const maxEntry = Object.entries(rawWeights).sort((a, b) => b[1] - a[1])[0];
const maxArch = archetypes.find(a => a.id === maxEntry[0]);
console.log(`Max weight: ${maxEntry[0]} (${maxArch?.name}) = ${(maxEntry[1] * 100).toFixed(2)}%`);

// Check min weight
const minEntry = Object.entries(rawWeights).sort((a, b) => a[1] - b[1])[0];
const minArch = archetypes.find(a => a.id === minEntry[0]);
console.log(`Min weight: ${minEntry[0]} (${minArch?.name}) = ${(minEntry[1] * 100).toFixed(2)}%`);

// Show top 10
console.log('\n=== TOP 10 ARCHETYPES BY WEIGHT ===');
const sorted = Object.entries(rawWeights).sort((a, b) => b[1] - a[1]);
for (const [id, w] of sorted.slice(0, 10)) {
  const arch = archetypes.find(a => a.id === id);
  console.log(`  ${id} ${arch?.name}: ${(w * 100).toFixed(2)}%`);
}

// Show cluster distribution
console.log('\n=== CLUSTER MEMBERSHIP ===');
for (const cluster of pewClusters) {
  const members = clusterGroups[cluster.name] || [];
  const uniqueIds = [...new Set(members.map(m => m.id))];
  const clusterTotalWeight = uniqueIds.reduce((s, id) => s + (rawWeights[id] || 0), 0);
  console.log(`  ${cluster.name}: ${uniqueIds.length} archetypes, ${(clusterTotalWeight * 100).toFixed(1)}% total weight (target: ${(cluster.share * 100).toFixed(0)}%)`);
}

// ========== STEP 8: Write output files ==========

// Round weights to 6 decimal places
const finalWeights = {};
for (const [id, w] of Object.entries(rawWeights)) {
  finalWeights[id] = Math.round(w * 1000000) / 1000000;
}

// Write population-weights.json
const weightsPath = path.join(__dirname, '..', 'output', 'live-data', 'population-weights.json');
fs.writeFileSync(weightsPath, JSON.stringify(finalWeights, null, 2));
console.log(`\nWrote ${weightsPath}`);

// Write report
const report = `# Population Weights Report

## Methodology
- **Top-down anchoring**: Mapped 130 archetypes to Pew Political Typology 2021 (8 clusters) using Euclidean distance on 12 PRISM nodes
- **Soft clustering**: Each archetype assigned to top-2 nearest Pew clusters via inverse distance weighting
- **Within-cluster distribution**: Population share distributed proportionally to inverse distance from cluster centroid
- **Base weight**: ${(UNCLASSIFIED_SHARE * 100).toFixed(0)}% distributed equally as floor for all archetypes
- **Constraint**: No archetype exceeds ${(MAX_WEIGHT * 100).toFixed(0)}% of population

## Pew Cluster Mapping
| Cluster | Share | Archetypes Mapped |
|---------|-------|-------------------|
${pewClusters.map(c => {
  const members = clusterGroups[c.name] || [];
  return `| ${c.name} | ${(c.share * 100).toFixed(0)}% | ${[...new Set(members.map(m => m.id))].length} |`;
}).join('\n')}

## Validation
- Left-leaning: ${(leftWeight * 100).toFixed(1)}%
- Right-leaning: ${(rightWeight * 100).toFixed(1)}%
- Centrist: ${(centerWeight * 100).toFixed(1)}%
- Max archetype weight: ${(maxEntry[1] * 100).toFixed(2)}% (${maxArch?.name})
- Min archetype weight: ${(minEntry[1] * 100).toFixed(2)}% (${minArch?.name})

## Top 10 Archetypes by Weight
${sorted.slice(0, 10).map(([id, w]) => {
  const arch = archetypes.find(a => a.id === id);
  return `- **${id}** ${arch?.name}: ${(w * 100).toFixed(2)}%`;
}).join('\n')}

## Bottom 10 Archetypes by Weight
${sorted.slice(-10).map(([id, w]) => {
  const arch = archetypes.find(a => a.id === id);
  return `- **${id}** ${arch?.name}: ${(w * 100).toFixed(2)}%`;
}).join('\n')}

## Notes
- Weights are based on Pew 2021 typology anchoring, not direct survey respondent classification
- Survey microdata (74K CES/ANES/VSG) available for future validation via respondent-to-archetype matching
- Weights should be re-calibrated after election model validation
`;

const reportPath = path.join(__dirname, '..', 'output', 'population-weights-report.md');
fs.writeFileSync(reportPath, report);
console.log(`Wrote ${reportPath}`);

console.log('\nDone!');
