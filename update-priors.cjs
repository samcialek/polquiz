/**
 * Update archetypes.ts to use populationWeight as prior instead of uniform 1/130
 */
const fs = require('fs');
const path = require('path');

const jsonArchetypes = JSON.parse(fs.readFileSync(path.join(__dirname, 'output/live-data/archetypes.json'), 'utf-8'));
const tsPath = path.join(__dirname, 'src/config/archetypes.ts');
let ts = fs.readFileSync(tsPath, 'utf-8');

// Map id -> populationWeight
const weights = {};
jsonArchetypes.forEach(a => { weights[a.id] = a.populationWeight; });

// Replace each `prior: 1/130` or `prior: 1/124` or `prior: 0.0076923...` with the actual weight
// The pattern in the source is: prior: 1/130, or prior: NUMBER,
let replacements = 0;

// For each archetype block, find the id and replace the prior
for (const [id, weight] of Object.entries(weights)) {
  // Find the block for this id
  const idPattern = new RegExp(`id:\\s*"${id}"[\\s\\S]*?prior:\\s*[^,]+,`, 'g');
  const match = ts.match(idPattern);
  if (match) {
    const oldBlock = match[0];
    const newBlock = oldBlock.replace(/prior:\s*[^,]+,/, `prior: ${weight},`);
    if (oldBlock !== newBlock) {
      ts = ts.replace(oldBlock, newBlock);
      replacements++;
    }
  }
}

// Also update the comment about priors
ts = ts.replace(
  /Priors updated from .* to reflect the new total\./,
  'Priors set to populationWeight values (range 0.003-0.023, sum to 1.0).'
);

fs.writeFileSync(tsPath, ts);
console.log(`Updated ${replacements} priors in archetypes.ts`);

// Verify
const verifyTs = fs.readFileSync(tsPath, 'utf-8');
const uniformCount = (verifyTs.match(/prior:\s*1\/130/g) || []).length;
const weightedCount = (verifyTs.match(/prior:\s*0\.0\d+/g) || []).length;
console.log(`Remaining uniform priors: ${uniformCount}`);
console.log(`Weighted priors: ${weightedCount}`);
