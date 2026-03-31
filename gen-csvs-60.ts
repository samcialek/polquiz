import { ELECTIONS } from "./src/historical/candidates.js";
import { ARCHETYPES } from "./src/config/archetypes.js";
import { simulateElection } from "./src/historical/simulate.js";
import * as fs from "fs";

// Generate candidate-profiles.csv
const candidateRows: string[] = ["year,name,party,MAT,CD,CU,MOR,PRO,COM,ZS,ONT_H,ONT_S,PF,TRB,ENG,EPS,AES"];
for (const e of ELECTIONS) {
  for (const c of e.candidates) {
    candidateRows.push(`${e.year},${c.name},${c.party},${c.MAT},${c.CD},${c.CU},${c.MOR},${c.PRO},${c.COM},${c.ZS},${c.ONT_H},${c.ONT_S},${c.PF},${c.TRB},${c.ENG},${c.EPS},${c.AES}`);
  }
}
fs.writeFileSync("output/candidate_profiles.csv", candidateRows.join("\n"));
console.log(`Wrote candidate_profiles.csv: ${candidateRows.length - 1} candidates`);

// Generate historical-votes.csv  
const years = ELECTIONS.map(e => e.year).sort((a, b) => a - b);
const headerCols = ["id", "name", ...years.map(y => String(y))];
const voteRows: string[] = [headerCols.join(",")];

// Simulate all elections
const results: Map<number, Map<string, string>> = new Map();
for (const e of ELECTIONS) {
  const sim = simulateElection(e, ARCHETYPES);
  const yearMap = new Map<string, string>();
  for (const vote of sim.votes) {
    yearMap.set(vote.archetypeId, vote.candidate || "ABSTAIN");
  }
  results.set(e.year, yearMap);
}

for (const arch of ARCHETYPES) {
  const cols = [arch.id, `"${arch.name}"`];
  for (const y of years) {
    const yearMap = results.get(y);
    cols.push(yearMap?.get(arch.id) || "");
  }
  voteRows.push(cols.join(","));
}
fs.writeFileSync("output/historical_votes.csv", voteRows.join("\n"));
console.log(`Wrote historical_votes.csv: ${ARCHETYPES.length} archetypes × ${years.length} elections`);
