/**
 * REAL audit: Print every question with its full text and every option with full label.
 * Human-readable format so someone can actually review each one.
 */
const fs = require('fs');

const html = fs.readFileSync('prism-quiz-v3.html', 'utf8');
const config = fs.readFileSync('src/config/questions.representative.ts', 'utf8');

// Extract all maps
const OPT_LABELS = new Function(html.match(/const OPT_LABELS = \{[\s\S]*?\};/)[0] + '; return OPT_LABELS;')();
const Q_TEXT = new Function(html.match(/const Q_TEXT = \{[\s\S]*?\};/)[0] + '; return Q_TEXT;')();
const SLIDER_LABELS = new Function(html.match(/const SLIDER_LABELS = \{[\s\S]*?\};/)[0] + '; return SLIDER_LABELS;')();

// Parse questions from engine
const questions = [];
// Split by question comments
const qRegex = /\/\/ Q(\d+)\s*[—–-]\s*(\w+)[\s\S]*?\{([\s\S]*?)\n\s{2}\}/g;
let match;
while ((match = qRegex.exec(config)) !== null) {
    const qNum = parseInt(match[1]);
    const body = match[3];
    
    const idMatch = body.match(/id:\s*(\d+)/);
    const promptMatch = body.match(/promptShort:\s*"([^"]+)"/);
    const uiMatch = body.match(/uiType:\s*"([^"]+)"/);
    
    if (!idMatch || !promptMatch) continue;
    
    const id = parseInt(idMatch[1]);
    const promptShort = promptMatch[1];
    const uiType = uiMatch ? uiMatch[1] : 'unknown';
    
    // Extract option keys from optionEvidence comments and keys
    const optionKeys = [];
    const optLines = body.split('\n');
    for (const line of optLines) {
        const keyMatch = line.match(/^\s{6}(\w+):\s*\{$/);
        if (keyMatch) {
            const skip = ['continuous', 'categorical', 'pos', 'sal'];
            if (!skip.includes(keyMatch[1])) {
                optionKeys.push(keyMatch[1]);
            }
        }
    }
    
    questions.push({ qNum, id, promptShort, uiType, optionKeys: [...new Set(optionKeys)] });
}

questions.sort((a, b) => a.id - b.id);

let output = `PRISM V3 — FULL QUESTION AUDIT\n`;
output += `Generated: ${new Date().toISOString()}\n`;
output += `Questions: ${questions.length}\n`;
output += `${'='.repeat(80)}\n\n`;

let questionNum = 0;
for (const q of questions) {
    questionNum++;
    const qtext = Q_TEXT[q.promptShort];
    const sliderLabels = SLIDER_LABELS[q.promptShort];
    
    output += `QUESTION ${questionNum} (engine id: ${q.id}, key: ${q.promptShort})\n`;
    output += `Type: ${q.uiType}\n`;
    output += `Text: ${qtext || '⚠️ MISSING Q_TEXT'}\n`;
    
    if (q.uiType === 'slider') {
        if (sliderLabels) {
            output += `  Slider: "${sliderLabels.low}" ←→ "${sliderLabels.high}"\n`;
        } else {
            output += `  ⚠️ MISSING SLIDER_LABELS\n`;
        }
    } else if (['single_choice', 'best_worst', 'multi', 'pairwise'].includes(q.uiType)) {
        const letters = 'ABCDEFGHIJKLMNOP';
        for (let i = 0; i < q.optionKeys.length; i++) {
            const key = q.optionKeys[i];
            const label = OPT_LABELS[key];
            const status = label ? '' : ' ⚠️ MISSING';
            output += `  ${letters[i]}) [${key}]: ${label || 'NO LABEL'}${status}\n`;
        }
        
        // Check for duplicates within this question
        const labels = q.optionKeys.map(k => OPT_LABELS[k]).filter(Boolean);
        const seen = new Map();
        for (let i = 0; i < labels.length; i++) {
            if (seen.has(labels[i])) {
                output += `  ⚠️ DUPLICATE: options ${letters[seen.get(labels[i])]} and ${letters[i]} have identical text\n`;
            }
            seen.set(labels[i], i);
        }
    } else if (['ranking', 'allocation'].includes(q.uiType)) {
        // These use items from the config, check what we can
        output += `  (${q.uiType} — items defined in engine config)\n`;
        if (q.optionKeys.length > 0) {
            for (let i = 0; i < q.optionKeys.length; i++) {
                const key = q.optionKeys[i];
                const label = OPT_LABELS[key];
                output += `  ${i+1}) [${key}]: ${label || key}\n`;
            }
        }
    }
    
    output += `\n`;
}

// Write to file
fs.writeFileSync('v3-full-audit.txt', output);
console.log(output);
console.log(`\nAudit written to v3-full-audit.txt`);
