import json
from pathlib import Path
from html import escape

SRC = Path(r"C:\Users\Sam\.openclaw\workspace\output\prism-overnight\live-questions.json")
OUT = Path(r"C:\Users\Sam\Desktop\polmodel-clean\output\response-node-signature-review-for-sam.html")

data = json.loads(SRC.read_text(encoding='utf-8'))

TARGET_IDS = [27, 31, 64, 33, 60, 63, 15, 20, 22, 24, 26, 32, 44, 45, 46, 53, 57, 58, 25, 56, 81, 82, 85]
qmap = {q['id']: q for q in data}

notes = {
    27: {
        'status': 'Review / likely incomplete',
        'why': 'Core welfare error-tradeoff item. Main MAT direction looks sensible, but promised salience and PRO signal are not visibly exposed in extracted live response map.',
        'ask': 'Should this question also encode how strongly the person cares about welfare false positives vs false negatives, not just which side they choose?'
    },
    31: {
        'status': 'High-priority review',
        'why': 'Trade question appears to push net-positive-trade respondents toward higher ONT_S (system broken), which looks backwards.',
        'ask': 'Do you agree this ONT_S direction should be reversed or rethought?'
    },
    64: {
        'status': 'High-priority review',
        'why': 'Political frustration answers look like ideology/grievance content, not PF as you defined it (partisan identity fused with self).',
        'ask': 'Should this be rewritten, or moved off PF-position entirely?'
    },
    33: {
        'status': 'Review / likely incomplete',
        'why': 'CU direction looks sensible, but expected PRO and CU salience do not visibly appear in extracted response map.',
        'ask': 'Should immigration enforcement tradeoff also encode how identity-central / salient the boundary issue is?'
    },
    60: {
        'status': 'High-value review',
        'why': 'This looks like one of the best potential PF/TRB questions, but visible extraction is mostly anchor-style and seems to leave real signal on the table.',
        'ask': 'Which identity rankings should most strongly count as PF salience vs TRB position?'
    },
    63: {
        'status': 'High-value review',
        'why': 'Best-worst battery is a strong design, but current extracted response logic looks too coarse for the salience it claims to capture.',
        'ask': 'Do you want richer salience extraction from best/worst choices instead of only sparse directional deltas?'
    },
    15: {
        'status': 'Review',
        'why': 'Allocation structure is conceptually strong, but it is not obvious from extracted live payload how much concentration/salience is being captured.',
        'ask': 'Should concentrated allocation itself strongly increase salience / conviction?'
    },
    20: {
        'status': 'Review',
        'why': 'Another strong allocation form, but likely under-auditable from current visible extraction.',
        'ask': 'Should blame concentration produce explicit salience signal?'
    },
    22: {
        'status': 'Review',
        'why': 'Potentially one of the best EPS questions, but downstream concentration/category behavior is not fully transparent from extracted payload.',
        'ask': 'Should strong concentration on one epistemic source imply stronger EPS salience?'
    },
    24: {
        'status': 'Review / semantically suspect',
        'why': 'Child-traits question may be overusing ONT_H for what could really be cultural authority / socialization signal.',
        'ask': 'Do you actually want this to be mostly ONT_H?'
    },
    26: {
        'status': 'Weak / likely prune',
        'why': 'Vacation preference looks like a weak lifestyle proxy and may overfit AES.',
        'ask': 'Is this doing anything worth keeping?'
    },
    32: {
        'status': 'Weak / likely prune or simplify',
        'why': 'Mainstream media accuracy estimate is a confounded trust proxy and may waste scale resolution.',
        'ask': 'Is this worth keeping as an EPS measure?'
    },
    44: {
        'status': 'Review / likely overinterpreted',
        'why': 'Views changed in 10 years may be too confounded to support strong EPS mapping.',
        'ask': 'Do you want a gentler interpretation here, or should this be demoted?'
    },
    45: {
        'status': 'Weak / likely prune or weaken',
        'why': 'What changed minds through history looks like philosophy-of-history taste more than reliable response-to-node signal.',
        'ask': 'Is this interesting but too indirect to keep strong?'
    },
    46: {
        'status': 'Background only',
        'why': 'Caregiver emotional availability should stay very weak if kept at all.',
        'ask': 'Keep as tiny background prior only?'
    },
    53: {
        'status': 'Background only',
        'why': 'Parents’ politics growing up is weak and likely exploratory only.',
        'ask': 'Keep tiny or remove?'
    },
    57: {
        'status': 'Background only',
        'why': 'Parents’ political engagement is weak background signal.',
        'ask': 'Keep tiny or remove?'
    },
    58: {
        'status': 'Background only',
        'why': 'Neighborhood safety childhood is weak and likely too indirect.',
        'ask': 'Keep tiny or remove?'
    },
    25: {
        'status': 'Stronger item / review completeness',
        'why': 'Criminal-trial error tradeoff is conceptually strong and likely worth preserving, but visible salience/secondary signals may still be incomplete.',
        'ask': 'Do you want this as a model for the other error-tradeoff items?'
    },
    56: {
        'status': 'Stronger item / review completeness',
        'why': 'Leader-style item seems good in concept, but likely under-realizes some secondary signals.',
        'ask': 'Should this mostly be AES, or also meaningfully contribute to PRO/ENG?'
    },
    81: {
        'status': 'Stronger anchor',
        'why': 'This seems much closer to your intended PF definition than Q64.',
        'ask': 'Should this become the main PF anchor?'
    },
    82: {
        'status': 'Stronger seam question',
        'why': 'Openness/assimilation/closure looks like one of the cleaner cultural-boundary seam questions.',
        'ask': 'Any answer options here you think are semantically overloaded?'
    },
    85: {
        'status': 'Stronger anchor',
        'why': 'Institutional legitimacy source looks close to your intended PRO definition.',
        'ask': 'Should this be treated as one of the main PRO anchors?'
    },
}

def extract_visible(q):
    visible = []
    if q.get('optionEvidence'):
        for opt, val in q['optionEvidence'].items():
            if isinstance(val, dict):
                if 'continuous' in val:
                    for node, nodeval in val['continuous'].items():
                        if isinstance(nodeval, dict):
                            for role, arr in nodeval.items():
                                visible.append((opt, f'{node}.{role}', arr))
                if 'categorical' in val:
                    for node, nodeval in val['categorical'].items():
                        if isinstance(nodeval, dict):
                            for role, arr in nodeval.items():
                                visible.append((opt, f'{node}.{role}', arr))
    if q.get('sliderMap'):
        for bucket, val in q['sliderMap'].items():
            if isinstance(val, dict):
                if 'continuous' in val:
                    for node, nodeval in val['continuous'].items():
                        if isinstance(nodeval, dict):
                            for role, arr in nodeval.items():
                                visible.append((bucket, f'{node}.{role}', arr))
                if 'categorical' in val:
                    for node, nodeval in val['categorical'].items():
                        if isinstance(nodeval, dict):
                            for role, arr in nodeval.items():
                                visible.append((bucket, f'{node}.{role}', arr))
    if q.get('rankingMap'):
        for bucket, val in q['rankingMap'].items():
            if isinstance(val, dict):
                if 'continuous' in val:
                    for node, arr in val['continuous'].items():
                        visible.append((bucket, f'{node}.delta', arr))
                if 'categorical' in val:
                    for node, arr in val['categorical'].items():
                        visible.append((bucket, f'{node}.delta', arr))
                for k, arr in val.items():
                    if k not in ('continuous', 'categorical'):
                        visible.append((bucket, f'{k}.derived', arr))
    return visible

html = []
html.append('<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Response-node signature review for Sam</title>')
html.append('''<style>
body{font-family:Georgia,serif;background:#f8f5ef;color:#1f2937;margin:0}
.wrap{max-width:1150px;margin:0 auto;padding:24px}
.card{background:#fffdf8;border:1px solid #ddd6ce;border-radius:16px;padding:20px;margin:18px 0}
h1,h2,h3{line-height:1.2} h1{color:#7c4f2f} h2{color:#355c7d}
.meta{color:#6b7280}.pill{display:inline-block;background:#eee3d4;padding:3px 8px;border-radius:999px;margin:4px 6px 0 0;font-size:0.85rem}
pre{white-space:pre-wrap;word-break:break-word;background:#f6f1ea;border:1px solid #e7e2da;padding:12px;border-radius:10px}
table{width:100%;border-collapse:collapse;margin-top:10px}th,td{border-top:1px solid #e7e2da;padding:8px;text-align:left;vertical-align:top}th{color:#355c7d}
.good{color:#166534}.warn{color:#a16207}.bad{color:#991b1b}
details{margin-top:12px} summary{cursor:pointer;font-weight:700}
</style>''')
html.append('</head><body><div class="wrap">')
html.append('<h1>PRISM response-node signature review for Sam</h1>')
html.append('<p class="meta">Focused review sheet for the question/response mappings that look suspicious, incomplete, weak, or especially worth your judgment. Built from live extracted question payload in `live-questions.json`.</p>')
html.append('<div class="card"><h2>How to use this</h2><ul><li>Each section shows the actual response-to-node mapping currently visible in the extracted live payload.</li><li>I included only questions I think are worth your review or likely to be important anchors.</li><li>The “Question for Sam” line is the specific judgment call I think matters most.</li></ul></div>')

for qid in TARGET_IDS:
    q = qmap[qid]
    note = notes[qid]
    touch = q.get('touchProfile', [])
    visible = extract_visible(q)
    cls = 'bad' if 'High-priority' in note['status'] or 'Weak' in note['status'] else ('warn' if 'Review' in note['status'] or 'Background' in note['status'] else 'good')
    html.append('<div class="card">')
    html.append(f'<h2>Q{qid} — {escape(q.get("promptShort",""))}</h2>')
    html.append(f'<p><span class="pill">uiType: {escape(str(q.get("uiType","")))}</span><span class="pill">quality: {escape(str(q.get("quality","")))}</span><span class="pill">status: {escape(note["status"])}</span></p>')
    html.append(f'<p class="{cls}"><strong>Why this is on the review list:</strong> {escape(note["why"])}</p>')
    html.append(f'<p><strong>Question for Sam:</strong> {escape(note["ask"])}</p>')

    html.append('<h3>Promised touch profile</h3><table><tr><th>Node</th><th>Kind</th><th>Role</th><th>Weight</th><th>Touch type</th></tr>')
    for t in touch:
        html.append(f'<tr><td>{escape(str(t.get("node","")))}</td><td>{escape(str(t.get("kind","")))}</td><td>{escape(str(t.get("role","")))}</td><td>{escape(str(t.get("weight","")))}</td><td>{escape(str(t.get("touchType","")))}</td></tr>')
    html.append('</table>')

    html.append('<h3>Visible extracted response mapping</h3><table><tr><th>Response bucket / option</th><th>Signal</th><th>Value</th></tr>')
    for bucket, sig, arr in visible:
        html.append(f'<tr><td>{escape(str(bucket))}</td><td>{escape(str(sig))}</td><td><code>{escape(json.dumps(arr))}</code></td></tr>')
    html.append('</table>')

    html.append('<details><summary>Raw extracted payload</summary>')
    html.append(f'<pre>{escape(json.dumps(q, indent=2))}</pre>')
    html.append('</details></div>')

html.append('</div></body></html>')
OUT.write_text(''.join(html), encoding='utf-8')
print(str(OUT))
print(f'Questions included: {len(TARGET_IDS)}')
