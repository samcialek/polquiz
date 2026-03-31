/**
 * Validate population weights against historical US elections (1789-2024)
 * 
 * For each election year:
 * - Sum population-weighted votes for each candidate
 * - Compare weighted winner vs actual winner
 * - Report accuracy improvement over uniform weights
 */

const fs = require('fs');
const path = require('path');

const elections = require('../output/live-data/elections.json');
const archetypes = require('../output/live-data/archetypes.json');
const popWeights = require('../output/live-data/population-weights.json');

// Known actual winners by year
const actualWinners = {
  1789: { winner: 'Washington', party: 'ind' },
  1792: { winner: 'Washington', party: 'ind' },
  1796: { winner: 'Adams', party: 'fed' },
  1800: { winner: 'Jefferson', party: 'dem-rep' },
  1804: { winner: 'Jefferson', party: 'dem-rep' },
  1808: { winner: 'Madison', party: 'dem-rep' },
  1812: { winner: 'Madison', party: 'dem-rep' },
  1816: { winner: 'Monroe', party: 'dem-rep' },
  1820: { winner: 'Monroe', party: 'dem-rep' },
  1824: { winner: 'Adams', party: 'dem-rep' },
  1828: { winner: 'Jackson', party: 'dem' },
  1832: { winner: 'Jackson', party: 'dem' },
  1836: { winner: 'Van Buren', party: 'dem' },
  1840: { winner: 'Harrison', party: 'whig' },
  1844: { winner: 'Polk', party: 'dem' },
  1848: { winner: 'Taylor', party: 'whig' },
  1852: { winner: 'Pierce', party: 'dem' },
  1856: { winner: 'Buchanan', party: 'dem' },
  1860: { winner: 'Lincoln', party: 'rep' },
  1864: { winner: 'Lincoln', party: 'rep' },
  1868: { winner: 'Grant', party: 'rep' },
  1872: { winner: 'Grant', party: 'rep' },
  1876: { winner: 'Hayes', party: 'rep' },
  1880: { winner: 'Garfield', party: 'rep' },
  1884: { winner: 'Cleveland', party: 'dem' },
  1888: { winner: 'Harrison', party: 'rep' },
  1892: { winner: 'Cleveland', party: 'dem' },
  1896: { winner: 'McKinley', party: 'rep' },
  1900: { winner: 'McKinley', party: 'rep' },
  1904: { winner: 'Roosevelt', party: 'rep' },
  1908: { winner: 'Taft', party: 'rep' },
  1912: { winner: 'Wilson', party: 'dem' },
  1916: { winner: 'Wilson', party: 'dem' },
  1920: { winner: 'Harding', party: 'rep' },
  1924: { winner: 'Coolidge', party: 'rep' },
  1928: { winner: 'Hoover', party: 'rep' },
  1932: { winner: 'Roosevelt', party: 'dem' },
  1936: { winner: 'Roosevelt', party: 'dem' },
  1940: { winner: 'Roosevelt', party: 'dem' },
  1944: { winner: 'Roosevelt', party: 'dem' },
  1948: { winner: 'Truman', party: 'dem' },
  1952: { winner: 'Eisenhower', party: 'rep' },
  1956: { winner: 'Eisenhower', party: 'rep' },
  1960: { winner: 'Kennedy', party: 'dem' },
  1964: { winner: 'Johnson', party: 'dem' },
  1968: { winner: 'Nixon', party: 'rep' },
  1972: { winner: 'Nixon', party: 'rep' },
  1976: { winner: 'Carter', party: 'dem' },
  1980: { winner: 'Reagan', party: 'rep' },
  1984: { winner: 'Reagan', party: 'rep' },
  1988: { winner: 'Bush', party: 'rep' },
  1992: { winner: 'Clinton', party: 'dem' },
  1996: { winner: 'Clinton', party: 'dem' },
  2000: { winner: 'Bush', party: 'rep' },
  2004: { winner: 'Bush', party: 'rep' },
  2008: { winner: 'Obama', party: 'dem' },
  2012: { winner: 'Obama', party: 'dem' },
  2016: { winner: 'Trump', party: 'rep' },
  2020: { winner: 'Biden', party: 'dem' },
  2024: { winner: 'Trump', party: 'rep' }
};

// Build election results by year
function simulateElections(weights) {
  // Collect all election years
  const yearVotes = {};
  
  for (const arch of archetypes) {
    const archId = arch.id;
    const w = weights[archId] || (1 / archetypes.length);
    const archElections = elections[archId];
    
    if (!archElections) continue;
    
    for (const elec of Object.values(archElections)) {
      const year = elec.y;
      const candidate = elec.c;
      const party = elec.p;
      
      if (!candidate || candidate === 'ABSTAIN' || party === 'abstain') continue;
      
      if (!yearVotes[year]) yearVotes[year] = {};
      if (!yearVotes[year][candidate]) yearVotes[year][candidate] = { weight: 0, party };
      yearVotes[year][candidate].weight += w;
    }
  }
  
  return yearVotes;
}

// Run with population weights
const weightedResults = simulateElections(popWeights);

// Run with uniform weights
const uniformWeights = {};
for (const arch of archetypes) {
  uniformWeights[arch.id] = 1 / archetypes.length;
}
const uniformResults = simulateElections(uniformWeights);

// Compare
console.log('=== ELECTION VALIDATION: Population Weights vs Uniform ===\n');
console.log('Year | Actual Winner    | Weighted Winner   | Uniform Winner    | W✓ | U✓');
console.log('-----|-----------------|-------------------|-------------------|----|----|');

let weightedCorrect = 0, uniformCorrect = 0, totalElections = 0;
const years = Object.keys(actualWinners).map(Number).sort((a, b) => a - b);

// Focus on modern elections (1960+) for the most relevant comparison
const modernYears = years.filter(y => y >= 1960);

for (const year of years) {
  const actual = actualWinners[year];
  if (!actual) continue;
  
  const wVotes = weightedResults[year];
  const uVotes = uniformResults[year];
  
  if (!wVotes || !uVotes) continue;
  
  totalElections++;
  
  // Find weighted winner
  const wEntries = Object.entries(wVotes).sort((a, b) => b[1].weight - a[1].weight);
  const wWinner = wEntries[0] ? wEntries[0][0] : '???';
  const wParty = wEntries[0] ? wEntries[0][1].party : '???';
  
  // Find uniform winner  
  const uEntries = Object.entries(uVotes).sort((a, b) => b[1].weight - a[1].weight);
  const uWinner = uEntries[0] ? uEntries[0][0] : '???';
  const uParty = uEntries[0] ? uEntries[0][1].party : '???';
  
  const wCorrect = wWinner.toLowerCase().includes(actual.winner.toLowerCase()) || 
                    wParty === actual.party;
  const uCorrect = uWinner.toLowerCase().includes(actual.winner.toLowerCase()) || 
                    uParty === actual.party;
  
  if (wCorrect) weightedCorrect++;
  if (uCorrect) uniformCorrect++;
  
  const isModern = year >= 1960;
  const marker = isModern ? ' *' : '  ';
  
  console.log(`${year} | ${actual.winner.padEnd(16)} | ${(wWinner + ' (' + wParty + ')').padEnd(18)} | ${(uWinner + ' (' + uParty + ')').padEnd(18)} | ${wCorrect ? '✓' : '✗'}  | ${uCorrect ? '✓' : '✗'}${marker}`);
}

console.log('\n=== SUMMARY ===');
console.log(`Total elections: ${totalElections}`);
console.log(`Weighted correct: ${weightedCorrect}/${totalElections} (${(weightedCorrect/totalElections*100).toFixed(1)}%)`);
console.log(`Uniform correct: ${uniformCorrect}/${totalElections} (${(uniformCorrect/totalElections*100).toFixed(1)}%)`);

// Modern elections detail
let wModern = 0, uModern = 0;
for (const year of modernYears) {
  const actual = actualWinners[year];
  const wVotes = weightedResults[year];
  const uVotes = uniformResults[year];
  if (!wVotes || !uVotes || !actual) continue;
  
  const wEntries = Object.entries(wVotes).sort((a, b) => b[1].weight - a[1].weight);
  const uEntries = Object.entries(uVotes).sort((a, b) => b[1].weight - a[1].weight);
  
  const wWinner = wEntries[0] ? wEntries[0][1].party : '';
  const uWinner = uEntries[0] ? uEntries[0][1].party : '';
  
  if (wWinner === actual.party) wModern++;
  if (uWinner === actual.party) uModern++;
}
console.log(`\nModern (1960-2024): Weighted ${wModern}/${modernYears.length} | Uniform ${uModern}/${modernYears.length}`);

// Key question: 2024
const v2024w = weightedResults[2024];
const v2024u = uniformResults[2024];
if (v2024w) {
  console.log('\n=== 2024 DETAIL ===');
  const wSorted = Object.entries(v2024w).sort((a, b) => b[1].weight - a[1].weight);
  console.log('Weighted:');
  for (const [c, d] of wSorted) {
    console.log(`  ${c} (${d.party}): ${(d.weight * 100).toFixed(1)}%`);
  }
}
if (v2024u) {
  const uSorted = Object.entries(v2024u).sort((a, b) => b[1].weight - a[1].weight);
  console.log('Uniform:');
  for (const [c, d] of uSorted) {
    console.log(`  ${c} (${d.party}): ${(d.weight * 100).toFixed(1)}%`);
  }
}

// 2004 detail (other known miss)
const v2004w = weightedResults[2004];
if (v2004w) {
  console.log('\n=== 2004 DETAIL ===');
  const wSorted = Object.entries(v2004w).sort((a, b) => b[1].weight - a[1].weight);
  console.log('Weighted:');
  for (const [c, d] of wSorted) {
    console.log(`  ${c} (${d.party}): ${(d.weight * 100).toFixed(1)}%`);
  }
}
