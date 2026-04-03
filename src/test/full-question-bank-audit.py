import json
from pathlib import Path
from html import escape

SRC = Path(r"C:\Users\Sam\.openclaw\workspace\output\prism-overnight\live-questions.json")
OUT = Path(r"C:\Users\Sam\Desktop\polmodel-clean\output\full-question-bank-audit.html")

data = json.loads(SRC.read_text(encoding="utf-8"))
assert isinstance(data, list)

rows = []
for q in data:
    qid = q.get('id')
    prompt = q.get('promptShort', '')
    ui = q.get('uiType', '')
    quality = q.get('quality', '')
    tp = q.get('touchProfile', []) or []

    promised = []
    for t in tp:
        promised.append(f"{t.get('node')}:{t.get('role')} ({t.get('kind')}, w={t.get('weight')})")

    visible = []
    modes = []
    if q.get('optionEvidence'):
        modes.append('optionEvidence')
        for opt, val in q['optionEvidence'].items():
            if isinstance(val, dict):
                if 'continuous' in val:
                    for node, nodeval in val['continuous'].items():
                        if isinstance(nodeval, dict):
                            for role in nodeval.keys():
                                visible.append(f"{node}:{role}")
                if 'categorical' in val:
                    for node, nodeval in val['categorical'].items():
                        if isinstance(nodeval, dict):
                            for role in nodeval.keys():
                                visible.append(f"{node}:{role}")
    if q.get('sliderMap'):
        modes.append('sliderMap')
        sval = q['sliderMap']
        if isinstance(sval, dict):
            for bucket, val in sval.items():
                if isinstance(val, dict):
                    if 'continuous' in val:
                        for node, nodeval in val['continuous'].items():
                            if isinstance(nodeval, dict):
                                for role in nodeval.keys():
                                    visible.append(f"{node}:{role}")
                    if 'categorical' in val:
                        for node, nodeval in val['categorical'].items():
                            if isinstance(nodeval, dict):
                                for role in nodeval.keys():
                                    visible.append(f"{node}:{role}")
    if q.get('rankingMap'):
        modes.append('rankingMap')
        rval = q['rankingMap']
        if isinstance(rval, dict):
            for bucket, val in rval.items():
                if isinstance(val, dict):
                    if 'continuous' in val:
                        for node in val['continuous'].keys():
                            visible.append(f"{node}:delta")
                    if 'categorical' in val:
                        for node in val['categorical'].keys():
                            visible.append(f"{node}:delta")
                    for k in val.keys():
                        if k not in ('continuous', 'categorical'):
                            visible.append(f"{k}:derived")

    promised_simple = sorted(set(f"{t.get('node')}:{t.get('role')}" for t in tp))
    visible_simple = sorted(set(visible))

    missing = []
    for p in promised_simple:
        if p not in visible_simple and not any(v.startswith(p.split(':')[0] + ':') and p.endswith('salience') and v.endswith(':delta') for v in visible_simple):
            missing.append(p)

    response_count = 0
    if q.get('optionEvidence'):
        response_count = len(q['optionEvidence'])
    elif q.get('sliderMap'):
        response_count = len(q['sliderMap'])
    elif q.get('rankingMap'):
        response_count = len(q['rankingMap'])

    rows.append({
        'id': qid,
        'prompt': prompt,
        'ui': ui,
        'quality': quality,
        'responses': response_count,
        'promised': promised,
        'visible': visible_simple,
        'missing': missing,
        'modes': modes,
        'raw': q,
    })

rows.sort(key=lambda r: r['id'])
missing_count = sum(1 for r in rows if r['missing'])

html = []
html.append('<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Full Question Bank Audit</title>')
html.append('''<style>
body{font-family:Georgia,serif;background:#f8f5ef;color:#1f2937;margin:0}
.wrap{max-width:1200px;margin:0 auto;padding:24px}
.card{background:#fffdf8;border:1px solid #ddd6ce;border-radius:16px;padding:18px;margin:18px 0}
h1,h2,h3{line-height:1.2} h1{color:#7c4f2f} h2{color:#355c7d}
.meta{color:#6b7280}.pill{display:inline-block;background:#eee3d4;padding:3px 8px;border-radius:999px;margin:4px 6px 0 0;font-size:0.85rem}
.good{color:#166534}.warn{color:#a16207}.bad{color:#991b1b}
pre{white-space:pre-wrap;word-break:break-word;background:#f6f1ea;border:1px solid #e7e2da;padding:12px;border-radius:10px}
ul{margin:8px 0 8px 20px} li{margin:4px 0}
summary{cursor:pointer;font-weight:700}
</style>''')
html.append('</head><body><div class="wrap">')
html.append(f'<h1>Full live question-bank audit</h1><p class="meta">Source: {escape(str(SRC))}</p>')
html.append(f'<div class="card"><h2>Coverage</h2><p>Total questions audited: <strong>{len(rows)}</strong></p><p>Questions with at least one promised signal not visibly represented in extracted response maps: <strong>{missing_count}</strong></p><p class="meta">This is a structural audit artifact: it shows what each question claims to touch vs what the extracted live payload visibly exposes.</p></div>')

for r in rows:
    cls = 'good' if not r['missing'] else ('warn' if len(r['missing']) <= 2 else 'bad')
    html.append('<div class="card">')
    html.append(f'<h2>Q{r["id"]} — {escape(r["prompt"])}</h2>')
    html.append(f'<p><span class="pill">uiType: {escape(str(r["ui"]))}</span><span class="pill">quality: {escape(str(r["quality"]))}</span><span class="pill">response modes: {escape(", ".join(r["modes"]) if r["modes"] else "none")}</span><span class="pill">response buckets/options: {r["responses"]}</span></p>')
    html.append(f'<p class="{cls}"><strong>Missing promised visible signals:</strong> {escape(", ".join(r["missing"]) if r["missing"] else "none")}</p>')
    html.append('<h3>Promised by touchProfile</h3><ul>' + ''.join(f'<li>{escape(x)}</li>' for x in r['promised']) + '</ul>')
    html.append('<h3>Visible in extracted live response map</h3><ul>' + ''.join(f'<li>{escape(x)}</li>' for x in r['visible']) + '</ul>')
    html.append('<details><summary>Raw extracted question payload</summary>')
    html.append(f'<pre>{escape(json.dumps(r["raw"], indent=2))}</pre>')
    html.append('</details></div>')

html.append('</div></body></html>')
OUT.write_text(''.join(html), encoding='utf-8')
print(str(OUT))
print(f'Total questions: {len(rows)}')
print(f'Questions with missing promised visible signals: {missing_count}')
