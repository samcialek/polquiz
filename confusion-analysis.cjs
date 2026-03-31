const fs = require('fs');

// Load results
const results = JSON.parse(fs.readFileSync('output/archetype-quiz-results.json', 'utf8'));

// === CONFUSION MATRIX ===
console.log("=== CONFUSION ANALYSIS: 28 MISSES ===\n");

const misses = results.filter(r => !r.match);
const hits = results.filter(r => r.match);

// Group misses by what they got classified as
const gotCounts = {};
misses.forEach(m => {
  gotCounts[m.gotName] = (gotCounts[m.gotName] || 0) + 1;
});

console.log("--- Most common false-positive attractors ---");
Object.entries(gotCounts).sort((a,b) => b[1]-a[1]).forEach(([name, count]) => {
  console.log(`  ${name}: attracted ${count} wrong archetypes`);
});

console.log("\n--- Detailed miss breakdown ---");
misses.forEach(m => {
  const top5str = m.top5.slice(0,5).map(t => `${t.name}(${(t.prob*100).toFixed(1)}%)`).join(', ');
  const trueRank = m.top5.findIndex(t => t.id === m.archetypeId) + 1;
  console.log(`\n  ${m.archetypeId} ${m.archetypeName}`);
  console.log(`    → Got: ${m.gotName} (${(m.topPosterior*100).toFixed(1)}%)`);
  console.log(`    → True archetype rank: ${trueRank > 0 ? '#' + trueRank : 'NOT IN TOP 5'}`);
  console.log(`    → Top 5: ${top5str}`);
  console.log(`    → Questions asked: ${m.questionsAnswered}`);
});

// === CONFUSION PAIRS ===
console.log("\n\n=== MOST CONFUSED PAIRS ===\n");
const pairCounts = {};
misses.forEach(m => {
  const pair = [m.archetypeName, m.gotName].sort().join(' <-> ');
  pairCounts[pair] = (pairCounts[pair] || 0) + 1;
});
Object.entries(pairCounts).sort((a,b) => b[1]-a[1]).forEach(([pair, count]) => {
  if (count > 1) console.log(`  ${pair}: ${count} confusions`);
});

// === LOW CONFIDENCE RESULTS ===
console.log("\n\n=== LOW CONFIDENCE (top posterior < 12%) ===\n");
results.filter(r => r.topPosterior < 0.12).sort((a,b) => a.topPosterior - b.topPosterior).forEach(r => {
  console.log(`  ${r.archetypeId} ${r.archetypeName}: ${(r.topPosterior*100).toFixed(1)}% → ${r.gotName} (match: ${r.match})`);
});

// === CATEGORY ANALYSIS ===
console.log("\n\n=== ACCURACY BY ARCHETYPE RANGE ===\n");
const ranges = [
  {label: '001-030 (Progressive)', start: 1, end: 30},
  {label: '031-060 (Center-Left to Center)', start: 31, end: 60},
  {label: '061-090 (Center-Right to Right)', start: 61, end: 90},
  {label: '091-120 (Far Right / Disengaged)', start: 91, end: 120},
];
ranges.forEach(range => {
  const inRange = results.filter(r => {
    const id = parseInt(r.archetypeId);
    return id >= range.start && id <= range.end;
  });
  const correct = inRange.filter(r => r.match).length;
  console.log(`  ${range.label}: ${correct}/${inRange.length} (${(correct/inRange.length*100).toFixed(1)}%)`);
});

