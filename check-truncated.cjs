const fs = require('fs');
const h = fs.readFileSync('prism-quiz-v3.html', 'utf8');
const fn = new Function(h.match(/const OPT_LABELS = \{[\s\S]*?\};/)[0] + '; return OPT_LABELS;');
const O = fn();
let issues = 0;
for (const [k, v] of Object.entries(O)) {
    // Check for truncated labels (< 5 chars, ending mid-word, etc.)
    if (v.length < 3) {
        console.log('TOO SHORT:', k, '=', JSON.stringify(v));
        issues++;
    }
    // Check for labels ending in apostrophe truncation patterns
    if (/\b\w+n$/.test(v) && v.length < 50 && !v.endsWith('an') && !v.endsWith('on') && !v.endsWith('en') && !v.endsWith('in')) {
        // Might be truncated at apostrophe like "shouldn" -> "shouldn't"
        if (v.endsWith('shouldn') || v.endsWith('won') || v.endsWith('didn') || v.endsWith('couldn') || v.endsWith('isn') || v.endsWith('don') || v.endsWith('hasn') || v.endsWith('weren')) {
            console.log('APOSTROPHE TRUNCATED:', k, '=', JSON.stringify(v));
            issues++;
        }
    }
}
console.log('Total issues:', issues);
