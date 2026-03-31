const fs = require('fs');

const ARCHETYPE_ID = process.argv[2] || '134';

// --- Elections ---
const votesCSV = fs.readFileSync('output/historical_votes.csv', 'utf-8');
const vLines = votesCSV.trim().split('\n');
const vHeader = vLines[0].split(',');
const years = vHeader.slice(2).map(Number);

let elections = null;
for (let i = 1; i < vLines.length; i++) {
  // Handle quoted names
  const match = vLines[i].match(/^(\d+),"([^"]+)",(.+)$/);
  if (!match) continue;
  const id = match[1];
  if (id !== ARCHETYPE_ID) continue;
  const name = match[2];
  const votes = match[3].split(',');
  elections = { id, name, votes: {} };
  for (let j = 0; j < years.length; j++) {
    elections.votes[years[j]] = votes[j] || 'ABSTAIN';
  }
  break;
}

if (!elections) {
  console.error('Archetype ' + ARCHETYPE_ID + ' not found in votes CSV');
  process.exit(1);
}

// Determine party for each vote
const partyMap = {
  // Democrats/Democratic-Republicans
  'Jefferson': 'dem', 'Madison': 'dem', 'Monroe': 'dem', 'Jackson': 'dem',
  'Van Buren': 'dem', 'Polk': 'dem', 'Pierce': 'dem', 'Buchanan': 'dem',
  'Tilden': 'dem', 'Hancock': 'dem', 'Cleveland': 'dem', 'Bryan': 'dem',
  'Wilson': 'dem', 'Cox': 'dem', 'Davis': 'dem', 'Smith': 'dem',
  'Roosevelt': 'dem', 'FDR': 'dem', 'Truman': 'dem', 'Stevenson': 'dem',
  'Kennedy': 'dem', 'Johnson': 'dem', 'Humphrey': 'dem', 'McGovern': 'dem',
  'Carter': 'dem', 'Mondale': 'dem', 'Dukakis': 'dem', 'Clinton': 'dem',
  'Gore': 'dem', 'Kerry': 'dem', 'Obama': 'dem', 'Biden': 'dem', 'Harris': 'dem',
  // Republicans/Whigs/Federalists
  'Adams': 'rep', 'Pinckney': 'rep', 'King': 'rep', 'Clay': 'rep',
  'Harrison': 'rep', 'Taylor': 'rep', 'Scott': 'rep', 'Fremont': 'rep',
  'Lincoln': 'rep', 'Grant': 'rep', 'Hayes': 'rep', 'Garfield': 'rep',
  'Blaine': 'rep', 'McKinley': 'rep', 'Taft': 'rep', 'Hughes': 'rep',
  'Harding': 'rep', 'Coolidge': 'rep', 'Hoover': 'rep', 'Landon': 'rep',
  'Willkie': 'rep', 'Dewey': 'rep', 'Eisenhower': 'rep', 'Nixon': 'rep',
  'Goldwater': 'rep', 'Ford': 'rep', 'Reagan': 'rep', 'Bush': 'rep',
  'Dole': 'rep', 'McCain': 'rep', 'Romney': 'rep', 'Trump': 'rep',
  // Third party
  'Weaver': 'third', 'Debs': 'third', 'La Follette': 'third',
  'Wallace': 'third', 'Perot': 'third', 'Nader': 'third',
  'Greeley': 'other', 'Washington': 'other',
  'T. Roosevelt': 'rep',  // in 1904 as Republican
};

// Special cases by year
const specialParty = {
  '1904_Roosevelt': 'rep',
  '1912_Roosevelt': 'third',  // Bull Moose
  '1932_Roosevelt': 'dem', '1936_Roosevelt': 'dem',
  '1940_Roosevelt': 'dem', '1944_Roosevelt': 'dem',
};

const electionData = years.map(y => {
  const c = elections.votes[y];
  let p = 'other';
  const key = y + '_' + c;
  if (specialParty[key]) p = specialParty[key];
  else if (partyMap[c]) p = partyMap[c];
  if (c === 'ABSTAIN') p = 'abstain';
  return { y, c, p };
});

// --- World Alignment ---
const alignCSV = fs.readFileSync('global/regime-alignment.csv', 'utf-8');
const aLines = alignCSV.trim().split('\n');
const aHeader = aLines[0].split(',');
const regimeColumns = aHeader.slice(2); // "Country|Regime (dates)" format

let alignments = null;
for (let i = 1; i < aLines.length; i++) {
  const match = aLines[i].match(/^(\d+),([^,]+),(.+)$/);
  if (!match) continue;
  if (match[1] !== ARCHETYPE_ID) continue;
  const scores = match[3].split(',').map(Number);
  alignments = {};
  for (let j = 0; j < regimeColumns.length; j++) {
    const col = regimeColumns[j];
    const pipeIdx = col.indexOf('|');
    if (pipeIdx < 0) continue;
    const country = col.substring(0, pipeIdx);
    const regimeWithDates = col.substring(pipeIdx + 1);
    // Parse date range
    const dateMatch = regimeWithDates.match(/\((\d{4})-(\d{4})\)/);
    if (!dateMatch) continue;
    if (!alignments[country]) alignments[country] = [];
    alignments[country].push({
      regime: regimeWithDates.replace(/\s*\(\d{4}-\d{4}\)/, '').trim(),
      start: parseInt(dateMatch[1]),
      end: parseInt(dateMatch[2]),
      score: scores[j]
    });
  }
  break;
}

// --- Archetype info ---
const result = {
  archetype: { id: ARCHETYPE_ID, name: elections.name },
  elections: electionData,
  alignments: alignments || {}
};

const outDir = 'output';
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
const outPath = outDir + '/archetype-' + ARCHETYPE_ID + '.json';
fs.writeFileSync(outPath, JSON.stringify(result, null, 2));
console.log('Written to ' + outPath);
console.log('Elections: ' + electionData.length);
console.log('Countries: ' + Object.keys(result.alignments).length);
console.log('Total regimes: ' + Object.values(result.alignments).reduce((a, b) => a + b.length, 0));
