import re

with open(r'C:\Users\Sam\Desktop\polmodel-clean\src\config\questions.representative.ts', 'r', encoding='utf-8') as f:
    ts = f.read()

# Find all promptShorts
prompts = re.findall(r'promptShort:\s*"(\w+)"', ts)
print(f"Total V2 questions: {len(prompts)}")
for p in sorted(prompts):
    print(f"  {p}")
