const fs = require('fs');

const arch = JSON.parse(fs.readFileSync('output/live-data/archetypes.json', 'utf8'));
const emp = JSON.parse(fs.readFileSync('output/live-data/population-weights-empirical.json', 'utf8'));
const final_ = JSON.parse(fs.readFileSync('output/live-data/population-weights.json', 'utf8'));
const pew = JSON.parse(fs.readFileSync('output/live-data/population-weights-pew-raw.json', 'utf8'));

// Load respondent counts
const csv = fs.readFileSync('output/respondent-classifications.csv', 'utf8');
const lines = csv.trim().split('\n').slice(1);
const counts = {};
for (const line of lines) {
  const id = line.split(',')[0];
  counts[id] = (counts[id] || 0) + 1;
}

const data = arch.map(a => ({
  id: a.id,
  name: a.name,
  final: final_[a.id] || 0,
  emp: emp[a.id] || 0,
  pew: parseFloat(pew[a.id]) || 0,
  respondents: counts[a.id] || 0,
}));

let html = fs.readFileSync('output/population-weights-comparison.html', 'utf8');
html = html.replace('DATA_PLACEHOLDER', JSON.stringify(data));
fs.writeFileSync('output/population-weights-comparison.html', html);
console.log('Built HTML with', data.length, 'archetypes');
