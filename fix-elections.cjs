/**
 * Fix elections.json:
 * 1. Rename "Roosevelt" → "T. Roosevelt" (≤1912) or "F. Roosevelt" (≥1932)
 * 2. Fix party codes: T. Roosevelt 1904 = rep, 1912 = third; F. Roosevelt = dem
 * 3. Add CSS-compatible "third" → keep as "third" (we'll add CSS for it)
 * 4. Fix FDR 1936 (missing from some — was already "Roosevelt" tagged as "other")
 */
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'output/live-data/elections.json');
const d = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

let fixes = 0;

for (const aid of Object.keys(d)) {
  for (const e of d[aid]) {
    // Fix Roosevelt naming and party
    if (e.c === 'Roosevelt') {
      if (e.y <= 1912) {
        e.c = 'T. Roosevelt';
        if (e.y === 1912) {
          e.p = 'third'; // Bull Moose
        } else {
          e.p = 'rep'; // 1904 as Republican
        }
        fixes++;
      } else {
        e.c = 'F. Roosevelt';
        e.p = 'dem';
        fixes++;
      }
    }
    
    // Fix "other" that should be more specific historical parties
    // Washington stays "other" (independent)
    // Greeley 1872 was Liberal Republican — keep as "other"
  }
}

fs.writeFileSync(filePath, JSON.stringify(d, null, 2));
console.log(`Fixed ${fixes} Roosevelt entries across ${Object.keys(d).length} archetypes`);

// Verify
const verify = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
const remaining = [];
for (const aid of Object.keys(verify)) {
  for (const e of verify[aid]) {
    if (e.c === 'Roosevelt') remaining.push(`${aid}/${e.y}`);
  }
}
console.log(`Remaining unfixed "Roosevelt": ${remaining.length}`);

// Count party distribution
const parties = {};
for (const aid of Object.keys(verify)) {
  for (const e of verify[aid]) {
    parties[e.p] = (parties[e.p] || 0) + 1;
  }
}
console.log('Party distribution:', parties);
