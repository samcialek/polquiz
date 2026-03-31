const d = require('./output/live-data/elections.json');
const archetypes = Object.keys(d);
console.log('Total archetypes:', archetypes.length);

const expectedCount = 60; // 1789-2024 every 4 years
const issues = [];

for (const aid of archetypes) {
  const elections = d[aid];
  
  if (!Array.isArray(elections)) {
    issues.push(`${aid}: elections is not an array`);
    continue;
  }
  
  if (elections.length !== expectedCount) {
    issues.push(`${aid}: has ${elections.length} elections (expected ${expectedCount})`);
  }
  
  for (const e of elections) {
    // Empty/short candidate name
    if (!e.c || e.c.length < 2) {
      issues.push(`${aid}/${e.y}: empty/short candidate: "${e.c}"`);
    }
    
    // Invalid party
    if (!['dem','rep','other','abstain'].includes(e.p)) {
      issues.push(`${aid}/${e.y}: invalid party: ${e.p}`);
    }
    
    // Undistinguished Roosevelt
    if (e.c === 'Roosevelt') {
      if (e.y <= 1912) {
        issues.push(`${aid}/${e.y}: should be "T. Roosevelt" (party should be rep or other depending on 1912 Bull Moose)`);
      } else {
        issues.push(`${aid}/${e.y}: should be "F. Roosevelt" (party should be dem)`);
      }
    }
    
    // Wrong party for well-known candidates
    const knownParties = {
      'Washington': 'other', // Independent/Federalist-adjacent
      'Jefferson': 'dem', // Democratic-Republican → dem
      'Lincoln': 'rep',
      'Grant': 'rep',
      'Cleveland': 'dem',
      'McKinley': 'rep',
      'Wilson': 'dem',
      'Harding': 'rep',
      'Coolidge': 'rep',
      'Hoover': 'rep',
      'Truman': 'dem',
      'Eisenhower': 'rep',
      'Kennedy': 'dem',
      'Johnson': 'dem',
      'Nixon': 'rep',
      'Carter': 'dem',
      'Reagan': 'rep',
      'Bush': 'rep',
      'Clinton': 'dem',
      'Gore': 'dem',
      'Kerry': 'dem',
      'Obama': 'dem',
      'Trump': 'rep',
      'Biden': 'dem',
      'Harris': 'dem',
      'Dukakis': 'dem',
      'McCain': 'rep',
      'Romney': 'rep',
    };
    
    // Check name truncation — names that look cut off
    if (e.c && e.c.length > 0 && e.p !== 'abstain') {
      // Check for unusual very short names (2-3 chars, not "Lee" etc)
      if (e.c.length <= 2 && e.c !== 'ABSTAIN') {
        issues.push(`${aid}/${e.y}: suspiciously short name: "${e.c}"`);
      }
    }
    
    // Check for names with weird characters or truncation markers
    if (e.c && (e.c.includes('\\n') || e.c.includes('\\t') || e.c.includes('undefined'))) {
      issues.push(`${aid}/${e.y}: corrupt name: "${e.c}"`);
    }
  }
}

// Count Roosevelt issues
const rooseveltIssues = issues.filter(i => i.includes('Roosevelt'));

// Count all unique issue types
const patterns = {};
for (const i of issues) {
  // Generalize by removing archetype ID
  const pat = i.replace(/^\d+\//, '*/');
  patterns[pat] = (patterns[pat] || 0) + 1;
}

console.log('\nTotal issues:', issues.length);
console.log('Roosevelt issues:', rooseveltIssues.length);

console.log('\nAll unique issue patterns:');
const sorted = Object.entries(patterns).sort((a, b) => b[1] - a[1]);
for (const [pat, count] of sorted) {
  console.log(`  [${count}x] ${pat}`);
}

// Also check: what are ALL unique candidate names across all archetypes?
const allNames = new Set();
for (const aid of archetypes) {
  for (const e of d[aid]) {
    if (e.c !== 'ABSTAIN') allNames.add(e.c);
  }
}
console.log('\nAll unique candidate names (' + allNames.size + '):');
[...allNames].sort().forEach(n => console.log('  ' + n));

// Check what years have non-standard party assignments (not just dem/rep/abstain)
console.log('\nElections with "other" party (for archetype 035):');
const e035 = d['035'];
e035.filter(e => e.p === 'other').forEach(e => console.log(`  ${e.y}: ${e.c}`));
