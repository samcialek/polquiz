import re

with open(r'C:\Users\Sam\Desktop\polmodel-clean\src\config\questions.representative.ts', 'r', encoding='utf-8') as f:
    ts = f.read()

questions = [
    "politics_at_social_gatherings",
    "coalition_vs_principle", 
    "university_admissions",
    "ceo_worker_ratio",
    "social_progress_view",
    "criminal_trial_error",
    "welfare_error",
    "vacation_preference",
    "political_conflict_with_close_others",
]

for q in questions:
    idx = ts.find(f'promptShort: "{q}"')
    if idx < 0:
        print(f"=== {q}: NOT FOUND ===")
        continue
    
    # Find the next question boundary (next "// Q" comment)
    next_q = ts.find("\n  // Q", idx + 1)
    if next_q < 0:
        next_q = len(ts)
    
    block = ts[idx:next_q]
    
    # Get uiType
    ui_m = re.search(r'uiType:\s*"(\w+)"', block)
    ui = ui_m.group(1) if ui_m else "?"
    
    # Get optionEvidence keys
    oe_idx = block.find("optionEvidence:")
    if oe_idx >= 0:
        oe_block = block[oe_idx:]
        # Find top-level keys (indented at the right level)
        keys = re.findall(r'\n\s{6}(\w+):\s*\{', oe_block)
        print(f"=== {q} ({ui}) ===")
        print(f"  Keys: {keys}")
    else:
        print(f"=== {q} ({ui}) === [no optionEvidence]")
