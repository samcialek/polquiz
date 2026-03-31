const { execSync } = require('child_process');
const fs = require('fs');

// Run validate and capture full output
const output = execSync('node dist/validate.cjs', { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });

// Parse the archetype vote lines from output
// Format: "  001 Libertarian Meritocrat     → FDR (D)"
// The validate output shows per-election per-archetype votes

// Actually, the validate output format is different. Let me check what it looks like
const lines = output.split('\n');

// Find all archetype ID lines — they show per-election results
// The output format from validate.ts shows election-level summaries, not per-archetype votes
// We need to build the CSV another way

// Let's parse the TS source directly to extract the ELECTIONS array, then use esbuild
// Actually, the simplest approach: rebuild with a custom entry that exports CSV data

// For now, let's just build the CSV from validate output which shows:
// year  predicted_winner  pct  actual_winner  actual_pct  gap  status
const electionResults = [];
for (const line of lines) {
  const m = line.match(/^\s+(\d{4})\s+(\w+)\s+([\d.]+)\s+(\w+)\s+([\d.]+)%\s+([\d.]+)\s+(\w+)/);
  if (m) {
    electionResults.push({
      year: parseInt(m[1]),
      predicted: m[2],
      predictedPct: parseFloat(m[3]),
      actual: m[4],
      actualPct: parseFloat(m[5]),
      gap: parseFloat(m[6]),
      status: m[7],
    });
  }
}
console.log(`Parsed ${electionResults.length} elections from validate output`);

// The historical_votes.csv needs per-archetype votes
// Since we can't easily get that from validate output, let's generate a summary CSV instead
const summaryRows = ['year,predicted_winner,predicted_pct,actual_winner,actual_pct,gap,status'];
for (const r of electionResults) {
  summaryRows.push(`${r.year},${r.predicted},${r.predictedPct},${r.actual},${r.actualPct},${r.gap},${r.status}`);
}
fs.writeFileSync('output/election_results_60.csv', summaryRows.join('\n'));
console.log(`Wrote election_results_60.csv`);

// For the full historical_votes.csv (130 archetypes × 60 elections), 
// we need to modify validate.ts to output per-archetype data
// For now, flag this as a TODO
console.log('NOTE: Full historical_votes.csv (per-archetype) needs validate.ts modification');
