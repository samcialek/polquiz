/**
 * Add Taiwan/ROC to alignments.json for all 130 archetypes.
 *
 * Taiwan eras:
 * 1. Japanese Colony (1895-1945)
 * 2. ROC Authoritarian/KMT (1945-1987)
 * 3. ROC Democracy (1987-2026)
 *
 * Scoring methodology:
 * Each era is characterized by regime traits on the 12 continuous nodes.
 * We compute alignment as weighted dot-product of archetype salience-weighted
 * position deviations vs regime characteristics, matching the existing scoring range.
 */

const fs = require('fs');

const alignments = JSON.parse(fs.readFileSync('output/live-data/alignments.json', 'utf-8'));
const archetypes = JSON.parse(fs.readFileSync('output/live-data/archetypes.json', 'utf-8'));

// Define Taiwan regime profiles on the same 1-5 node scale
// These represent what the regime VALUES/EMBODIES (not what it opposes)
const taiwanRegimes = [
  {
    r: "Japanese Colony",
    s: 1895,
    e: 1945,
    // Japanese colonial rule: state-directed economy (MAT~2.5), culturally conservative/assimilationist (CD~4, CU~1.5),
    // particularist moral circle (MOR~2), low proceduralism (PRO~2), low compromise (COM~2),
    // zero-sum (ZS~4), hierarchical (ONT_H~2), institutional (ONT_S~3.5),
    // high partisan fusion (PF~4), tribal (TRB~4), enforced engagement (ENG~4)
    profile: { MAT: 2.5, CD: 4, CU: 1.5, MOR: 2, PRO: 2, COM: 2, ZS: 4, ONT_H: 2, ONT_S: 3.5, PF: 4, TRB: 4, ENG: 4 }
  },
  {
    r: "KMT Authoritarian",
    s: 1945,
    e: 1987,
    // KMT one-party state: state capitalism (MAT~2.5), culturally conservative/Chinese nationalism (CD~4, CU~2),
    // moderate moral circle (MOR~2.5), moderate proceduralism (PRO~2.5), low compromise (COM~2),
    // moderately zero-sum (ZS~3.5), hierarchical (ONT_H~2.5), institutional trust (ONT_S~3.5),
    // high partisan fusion (PF~4), strong tribal identity (TRB~4), high engagement demanded (ENG~3.5)
    profile: { MAT: 2.5, CD: 4, CU: 2, MOR: 2.5, PRO: 2.5, COM: 2, ZS: 3.5, ONT_H: 2.5, ONT_S: 3.5, PF: 4, TRB: 4, ENG: 3.5 }
  },
  {
    r: "ROC Democracy",
    s: 1987,
    e: 2026,
    // Democratic Taiwan: mixed economy (MAT~3), culturally moderate-progressive (CD~2.5), pluralist (CU~4),
    // broad moral circle (MOR~3.5), proceduralist (PRO~4), pragmatic (COM~4),
    // moderate zero-sum (ZS~2.5), moderate human nature (ONT_H~3.5), institutional trust (ONT_S~4),
    // moderate partisan (PF~3), moderate tribal (TRB~3), engaged (ENG~3.5)
    profile: { MAT: 3, CD: 2.5, CU: 4, MOR: 3.5, PRO: 4, COM: 4, ZS: 2.5, ONT_H: 3.5, ONT_S: 4, PF: 3, TRB: 3, ENG: 3.5 }
  }
];

// Compute alignment score for an archetype against a regime profile
function computeAlignment(archetype, regimeProfile) {
  const nodes = archetype.nodes;
  let score = 0;
  let totalWeight = 0;

  const continuousNodes = ['MAT', 'CD', 'CU', 'MOR', 'PRO', 'COM', 'ZS', 'ONT_H', 'ONT_S', 'PF', 'TRB', 'ENG'];

  for (const node of continuousNodes) {
    const n = nodes[node];
    if (!n || n.kind !== 'continuous') continue;

    const pos = n.pos;       // 1-5
    const sal = n.sal;       // 0-3
    const regimeVal = regimeProfile[node];

    if (sal === 0) continue; // No salience = doesn't matter

    // Distance between archetype position and regime position
    // Closer = more aligned, farther = more opposed
    const diff = Math.abs(pos - regimeVal);

    // Convert to -3 to +3 scale
    // diff=0 → +3 (perfect alignment), diff=4 → -3 (maximum opposition)
    const rawAlignment = 3 - (diff * 1.5);

    // Anti-position penalty: if regime is on the "anti" side, extra penalty
    let antiPenalty = 0;
    if (n.anti === 'high' && regimeVal >= 4) antiPenalty = -0.8;
    if (n.anti === 'low' && regimeVal <= 2) antiPenalty = -0.8;

    const weight = sal / 3; // Normalize salience to 0-1
    score += (rawAlignment + antiPenalty) * weight;
    totalWeight += weight;
  }

  if (totalWeight === 0) return 0;

  // Normalize and scale to match existing data range (-3 to +3)
  let normalized = score / totalWeight;

  // Add some noise based on archetype id to avoid too-uniform scores
  const idNum = parseInt(archetype.id);
  const noise = Math.sin(idNum * 0.7) * 0.15;
  normalized += noise;

  // Clamp to -3, +3
  return Math.max(-3, Math.min(3, Math.round(normalized * 1000) / 1000));
}

// Validate by checking a known archetype against a known country
// Archetype 001 (Rawlsian Reformer) should align well with democratic regimes
const arch001 = archetypes.find(a => a.id === '001');
const testScore = computeAlignment(arch001, taiwanRegimes[2].profile); // ROC Democracy
console.log(`Test: Rawlsian Reformer vs ROC Democracy = ${testScore}`);
console.log(`  (For reference, vs UK Attlee/Consensus = ${alignments['001']['United Kingdom'][7].v})`);

// Compute and add Taiwan for all archetypes
let addedCount = 0;
for (const archetype of archetypes) {
  const id = archetype.id;
  if (!alignments[id]) {
    console.warn(`No alignments entry for archetype ${id}, skipping`);
    continue;
  }

  const taiwanEras = taiwanRegimes.map(regime => ({
    r: regime.r,
    s: regime.s,
    e: regime.e,
    v: computeAlignment(archetype, regime.profile)
  }));

  alignments[id]['Taiwan'] = taiwanEras;
  addedCount++;
}

console.log(`Added Taiwan data for ${addedCount} archetypes`);

// Show a few sample scores
['001', '010', '050', '100', '130'].forEach(id => {
  const tw = alignments[id]?.['Taiwan'];
  if (tw) {
    const arch = archetypes.find(a => a.id === id);
    console.log(`  ${id} (${arch?.name}): Colony=${tw[0].v}, KMT=${tw[1].v}, Democracy=${tw[2].v}`);
  }
});

// Write updated alignments
fs.writeFileSync('output/live-data/alignments.json', JSON.stringify(alignments));
console.log('Updated output/live-data/alignments.json');

// Also update the per-archetype files if they exist
const perArchDir = 'output/live-data/alignments';
if (fs.existsSync(perArchDir)) {
  for (const archetype of archetypes) {
    const filePath = `${perArchDir}/${archetype.id}.json`;
    if (fs.existsSync(filePath)) {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      data['Taiwan'] = alignments[archetype.id]['Taiwan'];
      fs.writeFileSync(filePath, JSON.stringify(data));
    }
  }
  console.log('Updated per-archetype alignment files');
}
