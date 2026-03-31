const fs = require('fs');
const results = JSON.parse(fs.readFileSync('output/archetype-quiz-results.json', 'utf8'));
const r115 = results.find(r => r.archetypeId === '115');
console.log("115 top5:");
r115.top5.forEach((t,i) => console.log(`  ${i+1}. ${t.id} ${t.name} (${(t.prob*100).toFixed(1)}%)`));
