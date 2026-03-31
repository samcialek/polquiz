import re, json

# Load V1 questions
with open(r'C:\Users\Sam\Desktop\polmodel-clean\v1-questions.json', 'r') as f:
    v1_qs = json.load(f)

# Load V2 HTML to get prompts and option labels
with open(r'C:\Users\Sam\Desktop\polmodel-clean\quiz-v2-live.html', 'r', encoding='utf-8') as f:
    v2_html = f.read()

# Extract V2 PROMPTS
pm = re.search(r'const PROMPTS\s*=\s*\{(.*?)\};', v2_html, re.DOTALL)
v2_prompts = {}
if pm:
    for m in re.finditer(r'(\w+):\s*"([^"]+)"', pm.group(1)):
        v2_prompts[m.group(1)] = m.group(2)

# Extract V2 OPT_LABELS
om = re.search(r'const OPT_LABELS\s*=\s*\{(.*?)\};', v2_html, re.DOTALL)
v2_opts = {}
if om:
    for m in re.finditer(r'(\w+):\s*"([^"]*)"', om.group(1)):
        v2_opts[m.group(1)] = m.group(2)

# Load the TS source to map question IDs to their option keys
with open(r'C:\Users\Sam\Desktop\polmodel-clean\src\config\questions.representative.ts', 'r', encoding='utf-8') as f:
    ts_src = f.read()

# Parse question blocks from TS to get promptShort -> option keys mapping
v2_questions = []
# Split by question comments
q_blocks = re.split(r'// Q\d+', ts_src)
for block in q_blocks[1:]:
    id_m = re.search(r'id:\s*(\d+)', block)
    prompt_m = re.search(r'promptShort:\s*"(\w+)"', block)
    ui_m = re.search(r'uiType:\s*"(\w+)"', block)
    
    if not id_m or not prompt_m:
        continue
    
    qid = int(id_m.group(1))
    prompt = prompt_m.group(1)
    ui = ui_m.group(1) if ui_m else "unknown"
    
    # Extract option keys from optionEvidence or sliderMap
    opt_keys = []
    if 'optionEvidence' in block:
        opt_keys = re.findall(r'(\w+):\s*\{[\s]*(?:continuous|categorical)', block)
    elif 'sliderMap' in block:
        opt_keys = re.findall(r'"([^"]+)":\s*\{', block)
    
    # Get labels for each option key
    options = []
    for key in opt_keys:
        label = v2_opts.get(key, f"[NO LABEL: {key}]")
        options.append({"key": key, "label": label})
    
    prompt_text = v2_prompts.get(prompt, f"[NO PROMPT: {prompt}]")
    
    v2_questions.append({
        "id": qid,
        "promptShort": prompt,
        "text": prompt_text,
        "uiType": ui,
        "options": options
    })

v2_questions.sort(key=lambda x: x["id"])

# Now build V1 lookup by question text similarity
# Manual mapping of V1 question IDs to V2 questions based on content match
v1_by_id = {q["id"]: q for q in v1_qs}

# Build comparison - find questions where options differ
# Map V1 to V2 by matching question text
comparisons = []

# Manual mappings (V1 qid -> V2 promptShort)
v1_to_v2_map = {
    "q125": "politics_at_social_gatherings",
    "q53": "coalition_vs_principle",
    "q6": "climate_energy_bundle",
    "q80": "guess_top_marginal_tax_rate",
    "q57": "preferred_top_marginal_tax_rate",
    "q13": "university_admissions",
    "q25": "ceo_worker_ratio",
    "q29": "social_progress_view",
    "q15": "controversial_speaker",
    "q59": "criminal_trial_error",
    "q60": "welfare_error",
    "q61": "information_control",
    "q62": "immigration_enforcement", 
    "q63": "medical_regulation",
    "q64": "electoral_security",
    "q35": "stupid_rule_response",
    "q38": "global_trade_view",
    "q37": "biggest_threats",
    "q40": "friends_vote_differently",
    "q69": "newspaper_article",
    "q70": "vacation_preference",
    "q71": "vaccine_mandate",
    "q94": "changed_minds_history",
    "q110": "social_progress_permanence",
    "q129": "immigrant_expectations",
    "q_nat_1": "national_identity_source",
    "q73": "parents_political_leaning",
    "q75": "religion_upbringing",
    "q2": "mind_change_catalyst",
    "q130": "effective_leaders",
    "q74": "parents_political_engagement",
    "q77": "childhood_safety",
    "q132": "leader_quality_priority",
    "q133": "political_pitch_resonance",
    "q98": "movement_aesthetics",
    "self4": "political_conflict_with_close_others",
}

for v1_id, v2_prompt in v1_to_v2_map.items():
    v1_q = v1_by_id.get(v1_id)
    v2_q = next((q for q in v2_questions if q["promptShort"] == v2_prompt), None)
    
    if not v1_q or not v2_q:
        continue
    
    v1_opts = v1_q.get("options", [])
    v2_opts_list = v2_q.get("options", [])
    
    if not v1_opts and not v2_opts_list:
        continue
    
    # Check if options differ
    v1_labels = [o.get("label", "") for o in v1_opts]
    v2_labels = [o.get("label", "") for o in v2_opts_list]
    
    if v1_labels != v2_labels or len(v1_labels) != len(v2_labels):
        comparisons.append({
            "v1_id": v1_id,
            "v2_id": v2_q["id"],
            "v2_prompt": v2_prompt,
            "text_v1": v1_q.get("text", ""),
            "text_v2": v2_q.get("text", ""),
            "type_v1": v1_q.get("type", "?"),
            "type_v2": v2_q.get("uiType", "?"),
            "options_v1": v1_opts,
            "options_v2": v2_opts_list,
        })

print(f"Found {len(comparisons)} questions with differences")

# Build HTML
html = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>PRISM Quiz: V1 → V2 Option Changes Review</title>
<style>
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Segoe UI', system-ui, sans-serif; background: #0a0a0f; color: #e0e0e0; padding: 2rem; line-height: 1.6; }
h1 { text-align: center; margin-bottom: 0.5rem; color: #fff; font-size: 1.8rem; }
.subtitle { text-align: center; color: #888; margin-bottom: 2rem; font-size: 0.95rem; }
.stats { display: flex; gap: 1rem; justify-content: center; margin-bottom: 2rem; flex-wrap: wrap; }
.stat { background: #1a1a2e; padding: 0.8rem 1.5rem; border-radius: 8px; text-align: center; }
.stat-num { font-size: 1.8rem; font-weight: 700; color: #60a5fa; }
.stat-label { font-size: 0.8rem; color: #888; text-transform: uppercase; }
.comparison { background: #12121f; border: 1px solid #2a2a3e; border-radius: 12px; margin-bottom: 1.5rem; overflow: hidden; }
.comp-header { padding: 1rem 1.5rem; background: #1a1a2e; border-bottom: 1px solid #2a2a3e; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem; }
.comp-header h3 { font-size: 1rem; color: #fff; }
.badge { font-size: 0.7rem; padding: 0.2rem 0.6rem; border-radius: 20px; font-weight: 600; }
.badge-changed { background: #f59e0b22; color: #f59e0b; border: 1px solid #f59e0b44; }
.badge-reworded { background: #ef444422; color: #ef4444; border: 1px solid #ef444444; }
.badge-count-diff { background: #8b5cf622; color: #8b5cf6; border: 1px solid #8b5cf644; }
.badge-ok { background: #10b98122; color: #10b981; border: 1px solid #10b98144; }
.comp-body { display: grid; grid-template-columns: 1fr 1fr; }
.version { padding: 1rem 1.5rem; }
.version:first-child { border-right: 1px solid #2a2a3e; }
.version-label { font-size: 0.75rem; font-weight: 700; text-transform: uppercase; margin-bottom: 0.5rem; letter-spacing: 0.05em; }
.v1-label { color: #60a5fa; }
.v2-label { color: #f59e0b; }
.q-text { font-size: 0.85rem; color: #ccc; margin-bottom: 0.8rem; font-style: italic; }
.opt-list { list-style: none; }
.opt-list li { padding: 0.4rem 0.6rem; margin-bottom: 0.3rem; border-radius: 6px; font-size: 0.85rem; background: #1a1a2e; }
.opt-list li.added { background: #10b98115; border-left: 3px solid #10b981; }
.opt-list li.removed { background: #ef444415; border-left: 3px solid #ef4444; }
.opt-list li.changed { background: #f59e0b15; border-left: 3px solid #f59e0b; }
.opt-key { color: #666; font-size: 0.7rem; font-family: monospace; }
.legend { display: flex; gap: 1.5rem; justify-content: center; margin-bottom: 1.5rem; flex-wrap: wrap; }
.legend-item { display: flex; align-items: center; gap: 0.4rem; font-size: 0.8rem; color: #888; }
.legend-dot { width: 12px; height: 12px; border-radius: 3px; }
.dot-removed { background: #ef4444; }
.dot-added { background: #10b981; }
.dot-changed { background: #f59e0b; }
@media (max-width: 768px) { .comp-body { grid-template-columns: 1fr; } .version:first-child { border-right: none; border-bottom: 1px solid #2a2a3e; } }
</style>
</head>
<body>
<h1>PRISM Quiz: V1 → V2 Changes</h1>
<p class="subtitle">Complete comparison of every option that changed between versions</p>
<div class="stats">
  <div class="stat"><div class="stat-num">TOTAL_CHANGES</div><div class="stat-label">Questions Changed</div></div>
  <div class="stat"><div class="stat-num">REWORDED</div><div class="stat-label">Options Reworded</div></div>
  <div class="stat"><div class="stat-num">COUNT_DIFF</div><div class="stat-label">Option Count Changed</div></div>
</div>
<div class="legend">
  <div class="legend-item"><div class="legend-dot dot-removed"></div>Removed in V2</div>
  <div class="legend-item"><div class="legend-dot dot-added"></div>Added in V2</div>
  <div class="legend-item"><div class="legend-dot dot-changed"></div>Reworded in V2</div>
</div>
"""

reworded_count = 0
count_diff_count = 0

for comp in comparisons:
    v1_labels = [o.get("label", "") for o in comp["options_v1"]]
    v2_labels = [o.get("label", "") for o in comp["options_v2"]]
    
    n_v1 = len(v1_labels)
    n_v2 = len(v2_labels)
    
    badges = []
    if n_v1 != n_v2:
        badges.append(f'<span class="badge badge-count-diff">{n_v1} → {n_v2} options</span>')
        count_diff_count += 1
    
    # Check for reworded
    has_reword = v1_labels != v2_labels
    if has_reword:
        badges.append('<span class="badge badge-reworded">Reworded</span>')
        reworded_count += 1
    
    badges_html = " ".join(badges)
    
    # Build option lists
    v1_html = ""
    for o in comp["options_v1"]:
        label = o.get("label", "")
        val = o.get("value", "")
        v1_html += f'<li><span class="opt-key">{val}</span> {label}</li>'
    
    v2_html_opts = ""
    for o in comp["options_v2"]:
        key = o.get("key", "")
        label = o.get("label", "")
        v2_html_opts += f'<li><span class="opt-key">{key}</span> {label}</li>'
    
    html += f"""
<div class="comparison">
  <div class="comp-header">
    <h3>V1: {comp['v1_id']} → V2: Q{comp['v2_id']} ({comp['v2_prompt']})</h3>
    <div>{badges_html}</div>
  </div>
  <div class="comp-body">
    <div class="version">
      <div class="version-label v1-label">V1 Original</div>
      <div class="q-text">{comp['text_v1'][:150]}</div>
      <ul class="opt-list">{v1_html}</ul>
    </div>
    <div class="version">
      <div class="version-label v2-label">V2 Current</div>
      <div class="q-text">{comp['text_v2'][:150]}</div>
      <ul class="opt-list">{v2_html_opts}</ul>
    </div>
  </div>
</div>
"""

html = html.replace("TOTAL_CHANGES", str(len(comparisons)))
html = html.replace("REWORDED", str(reworded_count))
html = html.replace("COUNT_DIFF", str(count_diff_count))

html += """
</body>
</html>
"""

with open(r'C:\Users\Sam\Desktop\polmodel-clean\v1-v2-comparison.html', 'w', encoding='utf-8') as f:
    f.write(html)

print(f"Generated comparison HTML: {len(comparisons)} questions with differences")
print(f"  Reworded: {reworded_count}")
print(f"  Option count changed: {count_diff_count}")
