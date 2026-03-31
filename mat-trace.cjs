// Trace: what answer does archetype 067 pick for a MAT question?
// And does that answer's optionEvidence actually push posDist toward pos=5?

const fs = require('fs');
const src = fs.readFileSync('src/config/questions.representative.ts', 'utf8');

// Find a clear MAT question — let's find all questions with MAT in touchProfile
const questions = [];
const qRegex = /\{\s*id:\s*(\d+)[\s\S]*?promptShort:\s*"([^"]+)"[\s\S]*?touchProfile:\s*\[([\s\S]*?)\][\s\S]*?(?:optionEvidence|sliderMap):\s*\{([\s\S]*?)\n  \}/g;

let m;
while ((m = qRegex.exec(src)) !== null) {
  const id = parseInt(m[1]);
  const prompt = m[2];
  const tp = m[3];
  if (tp.includes('"MAT"')) {
    questions.push({ id, prompt });
  }
}

console.log(`Found ${questions.length} questions touching MAT\n`);
questions.forEach(q => console.log(`  Q${q.id}: ${q.prompt}`));

// Let's manually trace one specific MAT question
// Q3 cultural_social_placement is in the fixed-12 and touches MAT
// Let's find the actual optionEvidence for Q3

// Actually let's find a single_choice question touching MAT
const scRegex = /\{\s*id:\s*(\d+)[\s\S]*?promptShort:\s*"([^"]+)"[\s\S]*?uiType:\s*"single_choice"[\s\S]*?touchProfile:\s*\[([\s\S]*?)\]/g;
const matSCQuestions = [];
let m2;
const src2 = fs.readFileSync('src/config/questions.representative.ts', 'utf8');
while ((m2 = scRegex.exec(src2)) !== null) {
  if (m2[3].includes('"MAT"')) {
    matSCQuestions.push({ id: parseInt(m2[1]), prompt: m2[2] });
  }
}

console.log(`\nSingle-choice MAT questions: ${matSCQuestions.length}`);
matSCQuestions.forEach(q => console.log(`  Q${q.id}: ${q.prompt}`));

// Let's look at what the simulation actually does for 067
// The key question: does scoreOptionEvidence pick the RIGHT option for an archetype at MAT=5?
//
// scoreOptionEvidence looks at evidence.continuous.MAT.pos[archetype.pos-1]
// For 067 with MAT=5, it checks pos[4] for each option
// The option with highest pos[4] wins
//
// But here's the potential issue: pos arrays are LIKELIHOOD RATIOS, not positions
// pos = [0.70, 0.20, 0.08, 0.02, 0.00] means "this answer is very likely if MAT=1, unlikely if MAT=5"
// pos = [0.00, 0.02, 0.08, 0.20, 0.70] means "this answer is very likely if MAT=5"
//
// If archetype 067 has MAT=5, scoreOptionEvidence picks the option with highest pos[4]
// That option's evidence will then multiply the respondent's posDist by [x,x,x,x,0.70]
// which should push posDist toward pos=5. ✓ This part seems correct.
//
// BUT: the issue may be that many MAT questions don't have strong enough
// discrimination at pos=5. If options all have similar pos[4] values,
// the "best" pick doesn't generate much signal.

console.log("\n=== KEY INSIGHT ===");
console.log("The simulation picks answers by checking optionEvidence.continuous.MAT.pos[archetype.pos-1]");
console.log("For MAT=5, it picks the option with highest pos[4]");
console.log("That option then updates posDist via multiplyAndNormalize");
console.log("");
console.log("Potential failure modes:");
console.log("1. Options may not have MAT evidence at all (some questions touch MAT weakly)");
console.log("2. pos[4] values may be similar across options (weak discrimination)");
console.log("3. The simulation picks the BEST option but the evidence is too gentle");
console.log("4. After 9 MAT questions, posDist may converge to pos=5 but with spread");
console.log("   A spread of [0.05, 0.10, 0.15, 0.25, 0.45] at pos=5 still gives");
console.log("   expectedPos = 3.95, which is closer to 5 but not sharp");
console.log("   Distance to arch with pos=5: |3.95-5|/4 = 0.26");
console.log("   Distance to arch with pos=2: |3.95-2|/4 = 0.49");
console.log("   The 0.23 difference gets diluted across 12 nodes");

