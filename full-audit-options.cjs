const fs = require('fs');
const html = fs.readFileSync('prism-quiz-v3.html', 'utf8');
const config = fs.readFileSync('src/config/questions.representative.ts', 'utf8');
const OPT_LABELS = new Function(html.match(/const OPT_LABELS = \{[\s\S]*?\};/)[0] + '; return OPT_LABELS;')();
const Q_TEXT = new Function(html.match(/const Q_TEXT = \{[\s\S]*?\};/)[0] + '; return Q_TEXT;')();
const SLIDER_LABELS = new Function(html.match(/const SLIDER_LABELS = \{[\s\S]*?\};/)[0] + '; return SLIDER_LABELS;')();

const qBlocks = [...config.matchAll(/\/\/ Q(\d+)[^\n]*\n\s*\{([\s\S]*?)\n\s{2}\}/g)];
const questions = [];
for (const block of qBlocks) {
    const body = block[2];
    const id = body.match(/id:\s*(\d+)/);
    const ps = body.match(/promptShort:\s*"([^"]+)"/);
    const ui = body.match(/uiType:\s*"([^"]+)"/);
    if (!id || !ps) continue;
    
    const optKeys = [];
    const oeMatch = body.match(/optionEvidence:\s*\{([\s\S]*)/);
    if (oeMatch) {
        for (const m of oeMatch[1].matchAll(/^\s{6}(\w+)\s*:\s*\{/gm)) {
            if (!['continuous','categorical'].includes(m[1])) optKeys.push(m[1]);
        }
    }
    
    questions.push({ id: +id[1], ps: ps[1], ui: ui?ui[1]:'?', keys: [...new Set(optKeys)] });
}

questions.sort((a,b) => a.id - b.id);
let n = 0;
const lines = [];
for (const q of questions) {
    n++;
    lines.push('─'.repeat(60));
    lines.push(`Q${n} [${q.ps}] (${q.ui})`);
    lines.push(Q_TEXT[q.ps] || '⚠️ MISSING TEXT');
    if (q.ui === 'slider') {
        const s = SLIDER_LABELS[q.ps];
        lines.push(s ? `  ${s.low} ←→ ${s.high}` : '  ⚠️ NO SLIDER LABELS');
    } else {
        for (let i = 0; i < q.keys.length; i++) {
            const l = OPT_LABELS[q.keys[i]];
            lines.push(`  ${String.fromCharCode(65+i)}) ${l || '⚠️ MISSING: ' + q.keys[i]}`);
        }
        if (q.keys.length === 0) lines.push('  (no options parsed - ranking/allocation/multi)');
    }
}

const output = lines.join('\n');
fs.writeFileSync('v3-audit-full.txt', output);
console.log(output);
console.log(`\n${questions.length} questions audited.`);
