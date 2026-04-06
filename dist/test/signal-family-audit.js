import { REPRESENTATIVE_QUESTIONS } from '../config/questions.representative.js';
const TARGET_PROMPTS = new Set([
    'criminal_trial_error_tradeoff',
    'welfare_error_tradeoff',
    'information_control_error_tradeoff',
    'immigration_enforcement_error_tradeoff',
    'best_worst_battery'
]);
const TARGET_TOUCH_TYPES = new Set([
    'error_asymmetry',
    'speech_harm_tradeoff',
    'boundary_error_asymmetry',
    'best_worst'
]);
function esc(value) {
    return String(value)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;');
}
function fmt(obj) {
    return esc(JSON.stringify(obj, null, 2));
}
function collectQuestions() {
    return REPRESENTATIVE_QUESTIONS.filter((q) => {
        if (TARGET_PROMPTS.has(q.promptShort))
            return true;
        return (q.touchProfile || []).some((t) => TARGET_TOUCH_TYPES.has(t.touchType));
    });
}
function summarizeTouchProfile(q) {
    const rows = (q.touchProfile || []).map((t) => {
        return `<tr><td>${esc(t.node)}</td><td>${esc(t.kind)}</td><td>${esc(t.role)}</td><td>${esc(t.weight)}</td><td>${esc(t.touchType)}</td></tr>`;
    }).join('');
    return `
    <table>
      <tr><th>Node</th><th>Kind</th><th>Role</th><th>Weight</th><th>Touch type</th></tr>
      ${rows}
    </table>
  `;
}
function summarizeOptions(q) {
    const opts = q.options || [];
    if (!opts.length)
        return '<p class="muted">No explicit options array.</p>';
    return `<ul>${opts.map((o) => `<li><code>${esc(o)}</code></li>`).join('')}</ul>`;
}
function summarizeEvidence(q) {
    if (q.optionEvidence) {
        const blocks = Object.entries(q.optionEvidence).map(([key, value]) => {
            return `
        <details>
          <summary><code>${esc(key)}</code></summary>
          <pre>${fmt(value)}</pre>
        </details>
      `;
        }).join('');
        return blocks;
    }
    if (q.rankingMap) {
        return `<pre>${fmt(q.rankingMap)}</pre>`;
    }
    if (q.sliderMap) {
        return `<pre>${fmt(q.sliderMap)}</pre>`;
    }
    return '<p class="muted">No optionEvidence / rankingMap / sliderMap found.</p>';
}
function notes(q) {
    const out = [];
    if (q.promptShort?.includes('error_tradeoff') && q.uiType !== 'error_tradeoff') {
        out.push(`Question name suggests an error-tradeoff widget, but uiType is <code>${esc(q.uiType)}</code> in source config.`);
    }
    if (q.promptShort === 'best_worst_battery' && q.uiType === 'best_worst') {
        out.push('Best-worst is explicitly represented as a dedicated UI type in source config.');
    }
    const salienceTouches = (q.touchProfile || []).filter((t) => t.role === 'salience');
    if (salienceTouches.length) {
        out.push(`Includes explicit salience signal on: ${salienceTouches.map((t) => `${t.node} (${t.weight})`).join(', ')}.`);
    }
    return out;
}
const questions = collectQuestions();
const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>PRISM Signal Family Audit</title>
<style>
  body { font-family: Georgia, serif; background: #f8f5ef; color: #1f2937; margin: 0; }
  .wrap { max-width: 1100px; margin: 0 auto; padding: 28px 20px 60px; }
  h1, h2, h3 { line-height: 1.2; }
  h1 { color: #7c4f2f; }
  h2 { color: #355c7d; margin-top: 28px; }
  .card { background: #fffdf8; border: 1px solid #ddd6ce; border-radius: 16px; padding: 20px; margin-top: 18px; }
  .meta { color: #6b7280; }
  table { width: 100%; border-collapse: collapse; margin-top: 10px; }
  th, td { border-top: 1px solid #e7e2da; padding: 8px; text-align: left; vertical-align: top; }
  th { color: #355c7d; }
  pre { white-space: pre-wrap; word-break: break-word; background: #f6f1ea; border: 1px solid #e7e2da; padding: 12px; border-radius: 10px; overflow-x: auto; }
  code { background: #f1ebe2; padding: 1px 5px; border-radius: 6px; }
  details { margin: 10px 0; }
  .pill { display: inline-block; padding: 3px 8px; border-radius: 999px; background: #eee3d4; margin-right: 6px; font-size: 0.85rem; }
  .muted { color: #6b7280; }
  ul { margin: 8px 0 8px 20px; }
</style>
</head>
<body>
<div class="wrap">
  <h1>PRISM Signal Family Audit</h1>
  <p class="meta">Focused audit of the currently implemented signal structure for the main question families Sam asked about: error trade-off and best-worst / MaxDiff. This is source-driven, not inferred from memory.</p>

  <div class="card">
    <h2>What this audit covers</h2>
    <ul>
      <li>question type in source config</li>
      <li>touchProfile entries: node, role, weight, touchType</li>
      <li>optionEvidence / rankingMap that defines what each answer is signaling</li>
      <li>implementation notes where the source naming and UI semantics look mismatched</li>
    </ul>
  </div>

  ${questions.map((q) => `
    <div class="card">
      <h2>Q${esc(q.id)} — ${esc(q.promptShort)}</h2>
      <p>
        <span class="pill">stage: ${esc(q.stage)}</span>
        <span class="pill">section: ${esc(q.section)}</span>
        <span class="pill">uiType: ${esc(q.uiType)}</span>
        <span class="pill">quality: ${esc(q.quality)}</span>
      </p>

      <h3>Options / response structure</h3>
      ${summarizeOptions(q)}

      <h3>Touch profile</h3>
      ${summarizeTouchProfile(q)}

      <h3>Signal definition</h3>
      ${summarizeEvidence(q)}

      <h3>Audit notes</h3>
      <ul>
        ${notes(q).map(n => `<li>${n}</li>`).join('') || '<li class="muted">No special notes.</li>'}
      </ul>
    </div>
  `).join('')}
</div>
</body>
</html>`;
console.log(html);
//# sourceMappingURL=signal-family-audit.js.map