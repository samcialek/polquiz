/**
 * Extract V1 question text and map to V2 promptShort keys.
 * V1 questions use data-q="qNN" attributes.
 */
const fs = require('fs');

const v1 = fs.readFileSync('quiz-v1.html', 'utf8');
const v3 = fs.readFileSync('prism-quiz-v3.html', 'utf8');

// Extract V2 Q_TEXT map
const qtextMatch = v3.match(/const Q_TEXT = \{([\s\S]*?)\};/);
const v2QText = {};
if (qtextMatch) {
    for (const line of qtextMatch[1].split('\n')) {
        const m = line.match(/^\s*(\w+)\s*:\s*["'](.+?)["']/);
        if (m) v2QText[m[1]] = m[2];
    }
}

// Extract V1 question texts by data-q attribute
const v1QTexts = {};
const regex = /data-q="(\w+)"[\s\S]*?<div class="question-text">([\s\S]*?)<\/div>/g;
let match;
while ((match = regex.exec(v1)) !== null) {
    const qId = match[1];
    let text = match[2].trim().replace(/\s+/g, ' ');
    v1QTexts[qId] = text;
}

console.log(`V1 questions found: ${Object.keys(v1QTexts).length}`);
console.log(`V2 Q_TEXT entries: ${Object.keys(v2QText).length}`);

// Print V1 questions for reference
console.log('\n=== V1 Question Texts ===');
for (const [id, text] of Object.entries(v1QTexts).sort()) {
    console.log(`  ${id}: "${text.substring(0, 80)}..."`);
}

console.log('\n=== V2 Q_TEXT entries ===');
for (const [key, text] of Object.entries(v2QText).sort()) {
    console.log(`  ${key}: "${text.substring(0, 80)}..."`);
}
