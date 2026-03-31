import re, json

with open(r'C:\Users\Sam\Desktop\polmodel-clean\src\config\questions.representative.ts', 'r', encoding='utf-8') as f:
    ts = f.read()

with open(r'C:\Users\Sam\Desktop\polmodel-clean\v2-opt-labels.json') as f:
    v2_labels = json.load(f)

with open(r'C:\Users\Sam\Desktop\polmodel-clean\v1-questions.json') as f:
    v1_qs = json.load(f)
v1_by_id = {q['id']: q for q in v1_qs}

# Corrected V1->V2 mapping
v1_to_v2 = {
    'q125': 'politics_at_social_gatherings',
    'q53': 'coalition_vs_principle',
    'q13': 'university_admissions_approach',
    'q25': 'ceo_worker_pay_ratio',
    'q29': 'social_progress_view',  # or human_progress_view
    'q59': 'criminal_trial_error_tradeoff',
    'q60': 'welfare_error_tradeoff',
    'q70': 'vacation_new_vs_familiar',
    'self4': 'political_conflict_with_close_others',
}

for v1_id, v2_prompt in sorted(v1_to_v2.items()):
    v1_q = v1_by_id.get(v1_id, {})
    v1_opts = v1_q.get('options', [])
    
    # Find V2 question block
    idx = ts.find(f'promptShort: "{v2_prompt}"')
    if idx < 0:
        print(f"=== {v1_id} -> {v2_prompt}: V2 NOT FOUND ===\n")
        continue
    
    next_q = ts.find("\n  // Q", idx + 1)
    if next_q < 0:
        next_q = len(ts)
    block = ts[idx:next_q]
    
    ui_m = re.search(r'uiType:\s*"(\w+)"', block)
    ui = ui_m.group(1) if ui_m else "?"
    
    # Get option keys
    oe_idx = block.find("optionEvidence:")
    if oe_idx >= 0:
        oe_block = block[oe_idx:]
        keys = re.findall(r'\n\s{6}(\w+):\s*\{', oe_block)
    else:
        keys = []
    
    print(f"=== {v1_id} -> {v2_prompt} ({ui}) ===")
    print(f"  V1: {v1_q.get('text', '?')[:80]}")
    print(f"  V1 options ({len(v1_opts)}):")
    for o in v1_opts:
        print(f"    [{o.get('value','')}] {o.get('label','')}")
    print(f"  V2 option keys ({len(keys)}):")
    for k in keys:
        print(f"    [{k}] {v2_labels.get(k, '[NO LABEL]')}")
    print()
