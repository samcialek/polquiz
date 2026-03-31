/**
 * Audit prism-quiz-v3.html: check every question for issues.
 * Simulates what the quiz engine + HTML renderer would show.
 */
const fs = require('fs');

const html = fs.readFileSync('prism-quiz-v3.html', 'utf8');

// Extract Q_TEXT map
const qtextBlock = html.match(/const Q_TEXT = \{([\s\S]*?)\};/);
const Q_TEXT = {};
if (qtextBlock) {
    // Handle multi-line values and escaped quotes
    const entries = qtextBlock[1].matchAll(/(\w+)\s*:\s*(?:"((?:[^"\\]|\\.)*)"|'((?:[^'\\]|\\.)*)'|`((?:[^`\\]|\\.)*)`)/g);
    for (const m of entries) {
        Q_TEXT[m[1]] = m[2] || m[3] || m[4] || '';
    }
}

// Extract OPT_LABELS map
const optBlock = html.match(/const OPT_LABELS = \{([\s\S]*?)\};/);
const OPT_LABELS = {};
if (optBlock) {
    const entries = optBlock[1].matchAll(/(\w+)\s*:\s*(?:"((?:[^"\\]|\\.)*)"|'((?:[^'\\]|\\.)*)'|`((?:[^`\\]|\\.)*)`)/g);
    for (const m of entries) {
        OPT_LABELS[m[1]] = m[2] || m[3] || m[4] || '';
    }
}

// Extract SLIDER_LABELS
const sliderBlock = html.match(/const SLIDER_LABELS = \{([\s\S]*?)\};/);
const SLIDER_LABELS = {};
if (sliderBlock) {
    // Parse nested objects: key: { low: "...", high: "..." }
    const entries = sliderBlock[1].matchAll(/(\w+)\s*:\s*\{([^}]*)\}/g);
    for (const m of entries) {
        const inner = {};
        const props = m[2].matchAll(/(\w+)\s*:\s*"((?:[^"\\]|\\.)*)"/g);
        for (const p of props) inner[p[1]] = p[2];
        SLIDER_LABELS[m[1]] = inner;
    }
}

// Now load the engine config to get the question list
const configFile = fs.readFileSync('src/config/questions.representative.ts', 'utf8');

// Parse questions
const questions = [];
const qBlocks = configFile.matchAll(/\/\/ Q(\d+)[^\n]*\n\s*\{([\s\S]*?)\n\s*\}/g);
for (const block of qBlocks) {
    const qNum = parseInt(block[1]);
    const body = block[2];
    
    const getId = (key) => {
        const m = body.match(new RegExp(`${key}:\\s*(\\d+)`));
        return m ? parseInt(m[1]) : null;
    };
    const getStr = (key) => {
        const m = body.match(new RegExp(`${key}:\\s*["']([^"']+)["']`));
        return m ? m[1] : null;
    };
    const getArr = (key) => {
        const m = body.match(new RegExp(`${key}:\\s*\\[([^\\]]+)\\]`));
        if (!m) return [];
        return m[1].match(/["']([^"']+)["']/g)?.map(s => s.replace(/["']/g, '')) || [];
    };
    
    const id = getId('id');
    const promptShort = getStr('promptShort');
    const uiType = getStr('uiType');
    
    // Get option keys from optionEvidence
    const optEvidBlock = body.match(/optionEvidence:\s*\{([\s\S]*?)(?:\n\s{4}\}|\n\s{6}\})/);
    let optionKeys = [];
    if (optEvidBlock) {
        const keys = optEvidBlock[1].matchAll(/(\w+)\s*:\s*\{/g);
        for (const k of keys) {
            if (!['pos', 'node', 'kind', 'role', 'weight', 'touchType'].includes(k[1])) {
                // Check if this is a top-level option key (not a nested property)
                optionKeys.push(k[1]);
            }
        }
    }
    
    // Filter to just real option keys (they have node evidence inside)
    // Better approach: look for keys that directly contain node references
    const realOptKeys = [];
    if (optEvidBlock) {
        const lines = optEvidBlock[1].split('\n');
        let depth = 0;
        let currentKey = null;
        for (const line of lines) {
            const topKey = line.match(/^\s{8}(\w+)\s*:\s*\{/);
            if (topKey && !['pos'].includes(topKey[1])) {
                realOptKeys.push(topKey[1]);
            }
        }
    }
    
    questions.push({ qNum, id, promptShort, uiType, optionKeys: realOptKeys });
}

// Sort by id
questions.sort((a, b) => a.id - b.id);

// Now audit each question
console.log(`=== PRISM V3 Quiz Audit ===`);
console.log(`Questions in engine: ${questions.length}`);
console.log(`Q_TEXT entries: ${Object.keys(Q_TEXT).length}`);
console.log(`OPT_LABELS entries: ${Object.keys(OPT_LABELS).length}`);
console.log(`SLIDER_LABELS entries: ${Object.keys(SLIDER_LABELS).length}`);
console.log('');

let issues = 0;

for (const q of questions) {
    const errors = [];
    
    // Check Q_TEXT
    const qtext = Q_TEXT[q.promptShort];
    if (!qtext) {
        errors.push(`MISSING Q_TEXT for "${q.promptShort}"`);
    } else if (qtext.length < 10) {
        errors.push(`Q_TEXT too short: "${qtext}"`);
    }
    
    // Check options based on uiType
    if (['single_choice', 'best_worst'].includes(q.uiType)) {
        for (const optKey of q.optionKeys) {
            const label = OPT_LABELS[optKey];
            if (!label) {
                errors.push(`MISSING OPT_LABEL for option "${optKey}"`);
            } else if (label.length < 2) {
                errors.push(`OPT_LABEL too short for "${optKey}": "${label}"`);
            }
        }
        
        // Check for duplicate labels within this question
        const labels = q.optionKeys.map(k => OPT_LABELS[k]).filter(Boolean);
        const dupes = labels.filter((l, i) => labels.indexOf(l) !== i);
        if (dupes.length > 0) {
            errors.push(`DUPLICATE labels within question: ${dupes.map(d => `"${d.substring(0, 50)}"`).join(', ')}`);
        }
    }
    
    if (q.uiType === 'slider') {
        const slabel = SLIDER_LABELS[q.promptShort];
        if (!slabel) {
            errors.push(`MISSING SLIDER_LABELS for "${q.promptShort}"`);
        } else {
            if (!slabel.low) errors.push(`Missing slider "low" label`);
            if (!slabel.high) errors.push(`Missing slider "high" label`);
        }
    }
    
    // Print result
    const status = errors.length === 0 ? '✅' : '❌';
    const displayText = qtext ? qtext.substring(0, 70) : '(no text)';
    console.log(`Q${q.id} (${q.uiType}) ${status} — ${q.promptShort}`);
    if (qtext) console.log(`   Text: "${displayText}..."`);
    if (q.optionKeys.length > 0) {
        console.log(`   Options (${q.optionKeys.length}):`);
        for (const k of q.optionKeys) {
            const label = OPT_LABELS[k] || '⚠️ MISSING';
            console.log(`     ${k}: "${label.substring(0, 80)}"`);
        }
    }
    for (const err of errors) {
        console.log(`   ⚠️ ${err}`);
        issues++;
    }
    console.log('');
}

console.log(`\n=== Summary: ${issues} issues found across ${questions.length} questions ===`);
