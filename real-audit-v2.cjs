/**
 * REAL audit v2: Shows EVERY option label for EVERY question.
 * Also flags semantic issues.
 */
const fs = require('fs');

const html = fs.readFileSync('prism-quiz-v3.html', 'utf8');
const config = fs.readFileSync('src/config/questions.representative.ts', 'utf8');

const OPT_LABELS = new Function(html.match(/const OPT_LABELS = \{[\s\S]*?\};/)[0] + '; return OPT_LABELS;')();
const Q_TEXT = new Function(html.match(/const Q_TEXT = \{[\s\S]*?\};/)[0] + '; return Q_TEXT;')();
const SLIDER_LABELS = new Function(html.match(/const SLIDER_LABELS = \{[\s\S]*?\};/)[0] + '; return SLIDER_LABELS;')();

// Better parser: find each question block between // Q markers
const lines = config.split('\n');
const questions = [];
let currentQ = null;
let braceDepth = 0;
let inQuestion = false;

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const qHeader = line.match(/\/\/\s*Q(\d+)\s*[—–-]/);
    
    if (qHeader && !inQuestion) {
        // Look ahead for the opening brace
        for (let j = i + 1; j < Math.min(i + 5, lines.length); j++) {
            if (lines[j].trim() === '{') {
                currentQ = { qNum: parseInt(qHeader[1]), startLine: j, body: '' };
                inQuestion = true;
                braceDepth = 1;
                break;
            }
        }
        continue;
    }
    
    if (inQuestion) {
        currentQ.body += line + '\n';
        braceDepth += (line.match(/\{/g) || []).length;
        braceDepth -= (line.match(/\}/g) || []).length;
        
        if (braceDepth <= 0) {
            inQuestion = false;
            questions.push(currentQ);
            currentQ = null;
        }
    }
}

// Parse each question
const parsed = [];
for (const q of questions) {
    const body = q.body;
    const idMatch = body.match(/id:\s*(\d+)/);
    const promptMatch = body.match(/promptShort:\s*"([^"]+)"/);
    const uiMatch = body.match(/uiType:\s*"([^"]+)"/);
    if (!idMatch || !promptMatch) continue;
    
    // Extract option keys - look for top-level keys in optionEvidence
    const optionKeys = [];
    const bodyLines = body.split('\n');
    let inOptEvid = false;
    let optDepth = 0;
    
    for (const bline of bodyLines) {
        if (bline.match(/optionEvidence:\s*\{/)) {
            inOptEvid = true;
            optDepth = 0;
            continue;
        }
        if (inOptEvid) {
            // Count braces to track depth
            const opens = (bline.match(/\{/g) || []).length;
            const closes = (bline.match(/\}/g) || []).length;
            
            // At depth 0, a key followed by { is a top-level option
            if (optDepth === 0) {
                const keyMatch = bline.match(/^\s+(\w+)\s*:\s*\{/);
                if (keyMatch) {
                    optionKeys.push(keyMatch[1]);
                }
            }
            
            optDepth += opens;
            optDepth -= closes;
            if (optDepth < 0) break; // end of optionEvidence
        }
    }
    
    parsed.push({
        qNum: q.qNum,
        id: parseInt(idMatch[1]),
        promptShort: promptMatch[1],
        uiType: uiMatch ? uiMatch[1] : 'unknown',
        optionKeys
    });
}

parsed.sort((a, b) => a.id - b.id);

let output = '';
let issues = [];

for (let qi = 0; qi < parsed.length; qi++) {
    const q = parsed[qi];
    const qtext = Q_TEXT[q.promptShort];
    const num = qi + 1;
    
    output += `\n${'─'.repeat(70)}\n`;
    output += `Q${num} [${q.promptShort}] (${q.uiType})\n`;
    output += `"${qtext || '⚠️ MISSING'}"\n`;
    
    if (q.uiType === 'slider') {
        const sl = SLIDER_LABELS[q.promptShort];
        if (sl) {
            output += `  [${sl.low}] ←————→ [${sl.high}]\n`;
        } else {
            output += `  ⚠️ NO SLIDER LABELS\n`;
            issues.push(`Q${num} ${q.promptShort}: missing slider labels`);
        }
    } else {
        for (let i = 0; i < q.optionKeys.length; i++) {
            const key = q.optionKeys[i];
            const label = OPT_LABELS[key];
            if (!label) {
                output += `  ${String.fromCharCode(65+i)}) [${key}] ⚠️ NO LABEL\n`;
                issues.push(`Q${num} ${q.promptShort}: missing label for "${key}"`);
            } else {
                output += `  ${String.fromCharCode(65+i)}) ${label}\n`;
            }
        }
        
        // Check dupes within question
        const labels = q.optionKeys.map(k => OPT_LABELS[k]).filter(Boolean);
        for (let i = 0; i < labels.length; i++) {
            for (let j = i + 1; j < labels.length; j++) {
                if (labels[i] === labels[j]) {
                    issues.push(`Q${num} ${q.promptShort}: DUPLICATE options ${String.fromCharCode(65+i)} and ${String.fromCharCode(65+j)}`);
                }
            }
        }
    }
}

output += `\n${'='.repeat(70)}\n`;
output += `ISSUES FOUND: ${issues.length}\n`;
for (const i of issues) output += `  • ${i}\n`;

fs.writeFileSync('v3-full-audit-with-options.txt', output);
console.log(output);
