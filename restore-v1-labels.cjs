/**
 * Extract V1 labels and map them to V2 engine keys.
 * Outputs a corrected Q_TEXT and OPT_LABELS for the V2 HTML.
 */
const fs = require('fs');

// Read files
const v1 = fs.readFileSync('quiz-v1.html', 'utf8');
const v2 = fs.readFileSync('quiz-v2-live.html', 'utf8');

// Extract V1 question texts
const v1Questions = {};
const qTextRegex = /<div class="question-text">(.*?)<\/div>/g;
let match;
while ((match = qTextRegex.exec(v1)) !== null) {
    v1Questions[match.index] = match[1];
}

// Extract V1 option labels (MC options)
const v1Options = {};
const optRegex = /value="(\w+)".*?<span class="mc-text">(.*?)<\/span>/g;
while ((match = optRegex.exec(v1)) !== null) {
    v1Options[match[1]] = match[2];
}

// Extract V1 slider labels  
const sliderLabelRegex = /<div class="slider-labels">\s*<span>(.*?)<\/span>\s*<span>(.*?)<\/span>/g;
while ((match = sliderLabelRegex.exec(v1)) !== null) {
    // Store for reference
}

// Extract V1 allocation labels
const allocRegex = /<span class="alloc-label">(.*?)<\/span>/g;
while ((match = allocRegex.exec(v1)) !== null) {
    // Store for reference
}

// Extract V1 ranking labels
const rankRegex = /data-value="(\w+)".*?<span class="rank-label">(.*?)<\/span>/g;
while ((match = rankRegex.exec(v1)) !== null) {
    v1Options[match[1]] = match[2];
}

// Extract V1 maxdiff labels
const maxdiffRegex = /data-value="(\w+)".*?<span class="maxdiff-label">(.*?)<\/span>/g;
while ((match = maxdiffRegex.exec(v1)) !== null) {
    v1Options[match[1]] = match[2];
}

// Extract V1 conjoint labels
const conjointRegex = /data-value="(\w+)".*?<div class="conjoint-label">(.*?)<\/div>/g;
while ((match = conjointRegex.exec(v1)) !== null) {
    v1Options[match[1]] = match[2];
}

// Extract current V2 OPT_LABELS
const v2OptMatch = v2.match(/const OPT_LABELS = \{([\s\S]*?)\};/);
const v2Labels = {};
if (v2OptMatch) {
    const lines = v2OptMatch[1].split('\n');
    for (const line of lines) {
        const m = line.match(/^\s*(\w+)\s*:\s*["'](.+?)["']/);
        if (m) v2Labels[m[1]] = m[2];
    }
}

// Report
console.log("=== V1 Option Labels Found ===");
const sortedKeys = Object.keys(v1Options).sort();
for (const key of sortedKeys) {
    console.log(`  ${key}: "${v1Options[key]}"`);
}

console.log(`\nTotal V1 labels: ${sortedKeys.length}`);
console.log(`Total V2 labels: ${Object.keys(v2Labels).length}`);

// Find V2 labels that differ from V1
console.log("\n=== Labels that DIFFER between V1 and V2 ===");
for (const key of Object.keys(v2Labels).sort()) {
    if (v1Options[key] && v1Options[key] !== v2Labels[key]) {
        console.log(`  ${key}:`);
        console.log(`    V1: "${v1Options[key]}"`);
        console.log(`    V2: "${v2Labels[key]}"`);
    }
}

// Find V2 labels with no V1 equivalent
console.log("\n=== V2 labels with NO V1 match ===");
for (const key of Object.keys(v2Labels).sort()) {
    if (!v1Options[key]) {
        console.log(`  ${key}: "${v2Labels[key]}"`);
    }
}

// Find V1 labels missing from V2
console.log("\n=== V1 labels MISSING from V2 ===");
for (const key of sortedKeys) {
    if (!v2Labels[key]) {
        console.log(`  ${key}: "${v1Options[key]}"`);
    }
}

// Generate corrected OPT_LABELS (V1 wins, V2 fills gaps)
const corrected = { ...v2Labels };
for (const key of sortedKeys) {
    corrected[key] = v1Options[key]; // V1 always wins
}

// Write corrected labels
fs.writeFileSync('v1-corrected-labels.json', JSON.stringify({ opt_labels: corrected }, null, 2));
console.log("\nWrote v1-corrected-labels.json");
