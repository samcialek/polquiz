import re, json

with open(r'C:\Users\Sam\Desktop\polmodel-clean\quiz-v1.html', 'r', encoding='utf-8') as f:
    v1 = f.read()

# Split by question divs
parts = re.split(r'<div class="question" data-q="([^"]+)">', v1)
questions = []
for i in range(1, len(parts), 2):
    qid = parts[i]
    body = parts[i+1] if i+1 < len(parts) else ""
    
    # Get question text
    tm = re.search(r'<div class="question-text">(.*?)</div>', body)
    qtext = tm.group(1).strip() if tm else "?"
    
    # MC options
    opts = re.findall(r'value="([^"]+)".*?class="mc-text">(.*?)</span>', body, re.DOTALL)
    
    # Slider
    slider_labels = re.findall(r'<span>([^<]+)</span>', body[:500])
    
    # Conjoint
    conjoints = re.findall(r'class="param-value[^"]*">(.*?)</span>', body)
    
    # Rank items
    ranks = re.findall(r'data-value="([^"]+)"[^>]*class="rank-item[^"]*">(.*?)</div>', body)
    
    # Allocation
    allocs = re.findall(r'class="alloc-label">(.*?)</div>', body)
    
    q = {"id": qid, "text": qtext}
    if opts:
        q["type"] = "mc"
        q["options"] = [{"value": v, "label": l} for v, l in opts]
    elif ranks:
        q["type"] = "rank"
        q["options"] = [{"value": v, "label": l.strip()} for v, l in ranks]
    elif allocs:
        q["type"] = "allocation"
        q["options"] = [{"label": a} for a in allocs]
    elif conjoints:
        q["type"] = "conjoint"
        q["options"] = [{"label": c} for c in conjoints]
    elif slider_labels:
        q["type"] = "slider"
        q["labels"] = slider_labels[:2]
    
    questions.append(q)

with open(r'C:\Users\Sam\Desktop\polmodel-clean\v1-questions.json', 'w') as f:
    json.dump(questions, f, indent=2)

print(f"Extracted {len(questions)} questions from V1")
for q in questions:
    t = q.get("type", "unknown")
    n = len(q.get("options", q.get("labels", [])))
    print(f"  {q['id']}: [{t}] {q['text'][:60]}... ({n} opts)")
