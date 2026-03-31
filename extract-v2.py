import re, json

with open(r'C:\Users\Sam\Desktop\polmodel-clean\quiz-v2-live.html', 'r', encoding='utf-8') as f:
    v2 = f.read()

# Extract PROMPTS map
pm = re.search(r'const PROMPTS\s*=\s*\{(.*?)\};', v2, re.DOTALL)
prompts = {}
if pm:
    for m in re.finditer(r'(\w+):\s*"([^"]+)"', pm.group(1)):
        prompts[m.group(1)] = m.group(2)

# Extract OPT_LABELS map
om = re.search(r'const OPT_LABELS\s*=\s*\{(.*?)\};', v2, re.DOTALL)
opt_labels = {}
if om:
    for m in re.finditer(r'(\w+):\s*"([^"]*)"', om.group(1)):
        opt_labels[m.group(1)] = m.group(2)

# Now extract question configs from the engine bundle to map promptShort -> option keys
# Actually, the HTML has the question rendering logic that maps questions to options
# Let me just output what we have

print(f"V2 PROMPTS: {len(prompts)}")
print(f"V2 OPT_LABELS: {len(opt_labels)}")

with open(r'C:\Users\Sam\Desktop\polmodel-clean\v2-prompts.json', 'w') as f:
    json.dump(prompts, f, indent=2)

with open(r'C:\Users\Sam\Desktop\polmodel-clean\v2-opt-labels.json', 'w') as f:
    json.dump(opt_labels, f, indent=2)

# Print all option labels
for k, v in sorted(opt_labels.items()):
    print(f"  {k}: {v}")
