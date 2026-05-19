// One-shot transform: add MORAL_CIRCLE touchProfile entries to questions that
// emit moralCircle evidence but don't declare the touch (per per-response audit
// 2026-05-19). Also adds AES touch to Q77.gut_feeling.
//
// Group A — REPLACE: questions whose only declared touch is a hollow legacy
// pointer (Q230/Q231 → MOR, Q232-Q238 → TRB_ANCHOR). Replace the line with
// MORAL_CIRCLE.affinity.
//
// Group B — INSERT: questions with valid existing touches that additionally
// emit moralCircle evidence. Insert a MORAL_CIRCLE.affinity entry as a new
// line just before the array closer.

const fs = require('fs');
const path = 'src/config/questions.representative.ts';
const src = fs.readFileSync(path, 'utf8');

const MC_TOUCH = '      { node: "MORAL_CIRCLE", kind: "derived", role: "affinity", weight: 0.10, touchType: "moral_circle_affinity" },';
const AES_TOUCH_Q77 = '      { node: "AES", kind: "categorical", role: "category", weight: 0.10, touchType: "decision_style_aes_secondary" },';

const REPLACE_PATCHES = [
  { id: 230, oldLine: '{ node: "MOR", kind: "continuous", role: "position", weight: 0.10, touchType: "universal_baseline_legacy_proxy" },',
    newLine:           '{ node: "MORAL_CIRCLE", kind: "derived", role: "affinity", weight: 0.10, touchType: "universal_baseline" },' },
  { id: 231, oldLine: '{ node: "MOR", kind: "continuous", role: "position", weight: 0.10, touchType: "universal_baseline_legacy_proxy" },',
    newLine:           '{ node: "MORAL_CIRCLE", kind: "derived", role: "affinity", weight: 0.10, touchType: "universal_baseline" },' },
  { id: 232, oldLine: '{ node: "TRB_ANCHOR", kind: "derived", role: "anchor", weight: 0.10, touchType: "scoped_affinity_legacy_proxy" },',
    newLine:           '{ node: "MORAL_CIRCLE", kind: "derived", role: "affinity", weight: 0.10, touchType: "scoped_affinity_probe" },' },
  { id: 233, oldLine: '{ node: "TRB_ANCHOR", kind: "derived", role: "anchor", weight: 0.10, touchType: "scoped_affinity_legacy_proxy" },',
    newLine:           '{ node: "MORAL_CIRCLE", kind: "derived", role: "affinity", weight: 0.10, touchType: "scoped_affinity_probe" },' },
  { id: 234, oldLine: '{ node: "TRB_ANCHOR", kind: "derived", role: "anchor", weight: 0.10, touchType: "scoped_affinity_legacy_proxy" },',
    newLine:           '{ node: "MORAL_CIRCLE", kind: "derived", role: "affinity", weight: 0.10, touchType: "scoped_affinity_probe" },' },
  { id: 235, oldLine: '{ node: "TRB_ANCHOR", kind: "derived", role: "anchor", weight: 0.10, touchType: "scoped_affinity_legacy_proxy" },',
    newLine:           '{ node: "MORAL_CIRCLE", kind: "derived", role: "affinity", weight: 0.10, touchType: "scoped_affinity_probe" },' },
  { id: 236, oldLine: '{ node: "TRB_ANCHOR", kind: "derived", role: "anchor", weight: 0.10, touchType: "scoped_affinity_legacy_proxy" },',
    newLine:           '{ node: "MORAL_CIRCLE", kind: "derived", role: "affinity", weight: 0.10, touchType: "scoped_affinity_probe" },' },
  { id: 238, oldLine: '{ node: "TRB_ANCHOR", kind: "derived", role: "anchor", weight: 0.10, touchType: "scoped_affinity_legacy_proxy" },',
    newLine:           '{ node: "MORAL_CIRCLE", kind: "derived", role: "affinity", weight: 0.10, touchType: "scoped_affinity_probe" },' },
];

const INSERT_IDS = [8, 60, 82, 98, 102, 201, 203, 204, 206, 213];

const lines = src.split('\n');

function findIdLine(id) {
  const re = new RegExp('^\\s*id:\\s*' + id + ',');
  for (let i = 0; i < lines.length; i++) {
    if (re.test(lines[i])) return i;
  }
  return -1;
}

function findTouchProfileBounds(startIdx) {
  let openLine = -1;
  for (let i = startIdx; i < Math.min(startIdx + 100, lines.length); i++) {
    if (/^\s*touchProfile:\s*\[\s*\r?$/.test(lines[i])) { openLine = i; break; }
    if (/touchProfile:\s*\[[^[]*\]/.test(lines[i])) return { openLine: i, closeLine: i, oneLiner: true };
    if (i !== startIdx && /^\s*id:\s*\d+,/.test(lines[i])) return null;
  }
  if (openLine < 0) return null;
  for (let i = openLine + 1; i < lines.length; i++) {
    if (/^\s*\],?\s*\r?$/.test(lines[i])) return { openLine, closeLine: i, oneLiner: false };
  }
  return null;
}

let replacementsApplied = 0;
let insertsApplied = 0;
let errors = [];

// Apply REPLACE patches
for (const patch of REPLACE_PATCHES) {
  const idLine = findIdLine(patch.id);
  if (idLine < 0) { errors.push('Q' + patch.id + ': id line not found'); continue; }
  let found = -1;
  for (let i = idLine; i < Math.min(idLine + 80, lines.length); i++) {
    if (lines[i].includes(patch.oldLine)) { found = i; break; }
    if (i !== idLine && /^\s*id:\s*\d+,/.test(lines[i])) break;
  }
  if (found < 0) { errors.push('Q' + patch.id + ': old line not found within range'); continue; }
  lines[found] = lines[found].replace(patch.oldLine, patch.newLine);
  replacementsApplied++;
}

// Apply INSERT patches
for (const id of INSERT_IDS) {
  const idLine = findIdLine(id);
  if (idLine < 0) { errors.push('Q' + id + ': id line not found'); continue; }
  const bounds = findTouchProfileBounds(idLine);
  if (!bounds) { errors.push('Q' + id + ': touchProfile bounds not found'); continue; }
  if (bounds.oneLiner) { errors.push('Q' + id + ': one-liner touchProfile, manual edit needed'); continue; }
  lines.splice(bounds.closeLine, 0, MC_TOUCH);
  insertsApplied++;
}

// Q77 — AES touch
{
  const idLine = findIdLine(77);
  if (idLine < 0) errors.push('Q77: id line not found');
  else {
    const bounds = findTouchProfileBounds(idLine);
    if (!bounds) errors.push('Q77: touchProfile bounds not found');
    else if (bounds.oneLiner) errors.push('Q77: one-liner, manual edit needed');
    else {
      lines.splice(bounds.closeLine, 0, AES_TOUCH_Q77);
      insertsApplied++;
    }
  }
}

fs.writeFileSync(path, lines.join('\n'));
console.log('Replacements applied: ' + replacementsApplied + '/' + REPLACE_PATCHES.length);
console.log('Inserts applied: ' + insertsApplied + '/' + (INSERT_IDS.length + 1));
if (errors.length) {
  console.error('Errors:');
  for (const e of errors) console.error('  ' + e);
}
