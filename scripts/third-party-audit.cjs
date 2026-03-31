const fs = require('fs');
const csv = fs.readFileSync('output/historical_votes.csv', 'utf-8');
const lines = csv.trim().split('\n');
const header = lines[0].split(',');
const years = header.slice(2).map(Number);
const totalArchetypes = lines.length - 1;

// Known major party candidates per election (last names)
const majorParty = {
  1880: ['Garfield', 'Hancock'],
  1884: ['Cleveland', 'Blaine'],
  1888: ['Cleveland', 'Harrison'],
  1892: ['Cleveland', 'Harrison'],
  1896: ['McKinley', 'Bryan'],
  1900: ['McKinley', 'Bryan'],
  1904: ['Roosevelt', 'Parker'],
  1908: ['Taft', 'Bryan'],
  1912: ['Wilson', 'Taft', 'Roosevelt'],
  1916: ['Wilson', 'Hughes'],
  1920: ['Harding', 'Cox'],
  1924: ['Coolidge', 'Davis'],
};

const targetYears = years.filter(y => y >= 1880 && y <= 1924);

for (const year of targetYears) {
  const colIdx = header.indexOf(String(year));
  if (colIdx < 0) continue;

  const votes = {};
  let abstain = 0;
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(',');
    const vote = (cols[colIdx] || '').replace(/"/g, '').trim();
    if (vote === 'ABSTAIN') { abstain++; continue; }
    votes[vote] = (votes[vote] || 0) + 1;
  }

  const major = majorParty[year] || [];
  let thirdPartyCount = 0;
  const thirdParties = {};
  for (const [cand, count] of Object.entries(votes)) {
    const isMajor = major.some(m => cand.includes(m));
    if (!isMajor) {
      thirdPartyCount += count;
      thirdParties[cand] = count;
    }
  }

  const voterCount = totalArchetypes - abstain;
  const pct = ((thirdPartyCount / totalArchetypes) * 100).toFixed(1);
  const voterPct = voterCount > 0 ? ((thirdPartyCount / voterCount) * 100).toFixed(1) : '0.0';

  console.log(`${year}: ${thirdPartyCount}/${totalArchetypes} archetypes (${pct}% of all, ${voterPct}% of voters)`);
  if (Object.keys(thirdParties).length > 0) {
    const sorted = Object.entries(thirdParties).sort((a, b) => b[1] - a[1]);
    for (const [c, n] of sorted) {
      console.log(`    ${c}: ${n} (${((n / totalArchetypes) * 100).toFixed(1)}%)`);
    }
  }
  console.log(`    All votes: ${JSON.stringify(votes)}`);
  console.log();
}
