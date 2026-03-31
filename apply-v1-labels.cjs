/**
 * Apply corrected V1 labels to the V2 quiz HTML.
 * Replaces the entire OPT_LABELS block.
 */
const fs = require('fs');

const corrected = JSON.parse(fs.readFileSync('v1-corrected-labels.json', 'utf8'));
const html = fs.readFileSync('quiz-v2-live.html', 'utf8');

// Build new OPT_LABELS block
let newBlock = 'const OPT_LABELS = {\n';
const entries = Object.entries(corrected.opt_labels).sort((a, b) => a[0].localeCompare(b[0]));
for (const [key, value] of entries) {
    // Escape quotes in value
    const escaped = value.replace(/"/g, '\\"');
    newBlock += `    ${key}: "${escaped}",\n`;
}
newBlock += '};';

// Replace old block
const newHtml = html.replace(/const OPT_LABELS = \{[\s\S]*?\};/, newBlock);

if (newHtml === html) {
    console.log("ERROR: OPT_LABELS block not found!");
    process.exit(1);
}

fs.writeFileSync('quiz-v2-live.html', newHtml);
console.log(`Applied ${entries.length} labels to quiz-v2-live.html`);
