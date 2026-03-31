import json, re

with open(r'C:\Users\Sam\Desktop\polmodel-clean\v1-questions.json') as f:
    v1 = json.load(f)
v1_by_id = {q['id']: q for q in v1}

with open(r'C:\Users\Sam\Desktop\polmodel-clean\v2-opt-labels.json') as f:
    v2_labels = json.load(f)

# Load TS source to get V2 option keys per question
with open(r'C:\Users\Sam\Desktop\polmodel-clean\src\config\questions.representative.ts', 'r', encoding='utf-8') as f:
    ts = f.read()

mappings = {
    'q125': 'politics_at_social_gatherings',
    'q53': 'coalition_vs_principle',
    'q13': 'university_admissions',
    'q25': 'ceo_worker_ratio',
    'q29': 'social_progress_view',
    'q59': 'criminal_trial_error',
    'q60': 'welfare_error',
    'q70': 'vacation_preference',
    'self4': 'political_conflict_with_close_others',
}

for v1_id, v2_prompt in sorted(mappings.items()):
    q = v1_by_id.get(v1_id, {})
    v1_opts = q.get('options', [])
    
    print(f'=== {v1_id} -> {v2_prompt} ===')
    print(f'  Q: {q.get("text", "?")[:100]}')
    
    # Find V2 option keys from TS
    prompt_idx = ts.find(f'promptShort: "{v2_prompt}"')
    if prompt_idx > 0:
        block = ts[prompt_idx:prompt_idx+2000]
        v2_keys = re.findall(r'(\w+):\s*\{\s*(?:continuous|categorical)', block)
        print(f'  V1 options ({len(v1_opts)}):')
        for o in v1_opts:
            print(f'    {o.get("value", "?")}: {o.get("label", "?")}')
        print(f'  V2 option keys ({len(v2_keys)}):')
        for k in v2_keys:
            print(f'    {k}: {v2_labels.get(k, "[NO LABEL]")}')
    print()
