/**
 * Deep audit: extract ALL option keys from engine config,
 * verify every single one has an OPT_LABELS entry.
 */
const fs = require('fs');

const html = fs.readFileSync('prism-quiz-v3.html', 'utf8');
const config = fs.readFileSync('src/config/questions.representative.ts', 'utf8');

// Extract OPT_LABELS
const fn = new Function(html.match(/const OPT_LABELS = \{[\s\S]*?\};/)[0] + '; return OPT_LABELS;');
const OPT_LABELS = fn();

// Extract Q_TEXT
const fn2 = new Function(html.match(/const Q_TEXT = \{[\s\S]*?\};/)[0] + '; return Q_TEXT;');
const Q_TEXT = fn2();

// Extract SLIDER_LABELS  
const fn3 = new Function(html.match(/const SLIDER_LABELS = \{[\s\S]*?\};/)[0] + '; return SLIDER_LABELS;');
const SLIDER_LABELS = fn3();

// Parse every question from engine config
const questions = [];
const blocks = config.split(/\/\/ Q\d+/);
for (let i = 1; i < blocks.length; i++) {
    const block = blocks[i];
    const header = config.match(new RegExp(`// Q(\\d+)[^\\n]*(?=` + blocks[i].substring(0, 30).replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')'));
    
    const idMatch = block.match(/id:\s*(\d+)/);
    const promptMatch = block.match(/promptShort:\s*"([^"]+)"/);
    const uiMatch = block.match(/uiType:\s*"([^"]+)"/);
    
    if (!idMatch || !promptMatch) continue;
    
    const id = parseInt(idMatch[1]);
    const promptShort = promptMatch[1];
    const uiType = uiMatch ? uiMatch[1] : 'unknown';
    
    // Extract option keys from optionEvidence
    const optEvid = block.match(/optionEvidence:\s*\{([\s\S]*?)(?:\n\s{4}\})/);
    const optionKeys = [];
    if (optEvid) {
        // Find top-level keys (8 spaces indent, followed by : {)
        const keyMatches = optEvid[1].matchAll(/^\s{6,8}(\w+)\s*:\s*\{/gm);
        for (const m of keyMatches) {
            // Skip nested keys like 'continuous', 'categorical', 'pos', 'sal', node names
            const skip = ['continuous', 'categorical', 'pos', 'sal', 'MAT', 'PRO', 'EPS', 'AES', 'COM', 'ZS', 'ONT_H', 'ONT_S', 'PF', 'TRB', 'ENG', 'CD', 'CU', 'MOR'];
            if (!skip.includes(m[1])) {
                optionKeys.push(m[1]);
            }
        }
    }
    
    questions.push({ id, promptShort, uiType, optionKeys: [...new Set(optionKeys)] });
}

questions.sort((a, b) => a.id - b.id);

let totalIssues = 0;

for (const q of questions) {
    const issues = [];
    
    // Check Q_TEXT
    if (!Q_TEXT[q.promptShort]) {
        issues.push(`MISSING Q_TEXT`);
    }
    
    // Check slider labels
    if (q.uiType === 'slider' && !SLIDER_LABELS[q.promptShort]) {
        issues.push(`MISSING SLIDER_LABELS`);
    }
    
    // Check option labels
    if (['single_choice', 'best_worst', 'multi', 'pairwise'].includes(q.uiType)) {
        for (const key of q.optionKeys) {
            if (!OPT_LABELS[key]) {
                issues.push(`MISSING label for option "${key}"`);
            }
        }
        
        // Check for duplicates within question
        const labels = q.optionKeys.map(k => OPT_LABELS[k]).filter(Boolean);
        const seen = new Set();
        for (const l of labels) {
            if (seen.has(l)) issues.push(`DUPLICATE label: "${l.substring(0, 60)}"`);
            seen.add(l);
        }
    }
    
    const status = issues.length === 0 ? '✅' : '❌';
    if (issues.length > 0) {
        console.log(`Q${q.id} (${q.uiType}) ${status} — ${q.promptShort}`);
        console.log(`   Options: [${q.optionKeys.join(', ')}]`);
        for (const i of issues) {
            console.log(`   ⚠️  ${i}`);
            totalIssues++;
        }
    }
}

console.log(`\n=== ${totalIssues} issues across ${questions.length} questions ===`);
