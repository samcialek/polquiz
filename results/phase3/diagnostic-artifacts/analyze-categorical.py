"""
Diagnostic 2 helper — categorical template shape analysis.
"""
import re
from pathlib import Path

text = Path("src/config/archetypes.ts").read_text(encoding="utf-8")

# Anchor on `    id: "NNN"` lines; slice each entry from id start to next id start.
id_matches = list(re.finditer(r'^\s{4}id:\s*"(\d+)"', text, re.MULTILINE))
entries = []
for i, m in enumerate(id_matches):
    start = m.start()
    end = id_matches[i+1].start() if i+1 < len(id_matches) else len(text)
    block = text[start:end]
    aid = m.group(1)
    active = "active: false" not in block
    entries.append((aid, active, block))

def parse_cat(field, block):
    m = re.search(
        field + r':\s*\{\s*kind:\s*"categorical",\s*probs:\s*\[([^\]]+)\],\s*sal:\s*(\d)(?:,\s*antiCats:\s*\[([^\]]*)\])?',
        block
    )
    if not m:
        return None
    probs = [float(x.strip()) for x in m.group(1).split(",")]
    sal = int(m.group(2))
    antiCats_str = m.group(3) or ""
    anti = [int(x.strip()) for x in antiCats_str.split(",") if x.strip()]
    return {"probs": probs, "sal": sal, "antiCats": anti}

total = len(entries)
active_count = sum(1 for _,a,_ in entries if a)
print(f"Total archetypes parsed: {total} (active: {active_count})")

def summary(node_key):
    print(f"\n=== {node_key} ===")
    rows = [(aid, parse_cat(node_key, blk)) for aid, a, blk in entries if a]
    templated = [(aid, c) for aid, c in rows if c is not None]
    missing = [aid for aid, c in rows if c is None]
    total = len(templated)
    print(f"  active with {node_key} template: {total}  (missing: {len(missing)} — {missing[:10] if missing else '-'})")
    argmax_ge_030 = 0
    argmax_lt_030 = 0
    second_ge_030 = 0
    anti_count = 0
    sal_hist = {0:0,1:0,2:0,3:0}
    peak_buckets = {'<0.30':0,'0.30-0.45':0,'0.45-0.60':0,'0.60-0.80':0,'>=0.80':0}
    for aid, c in templated:
        p = sorted(c['probs'], reverse=True)
        top, second = p[0], p[1]
        if top >= 0.30:
            argmax_ge_030 += 1
            if top < 0.45: peak_buckets['0.30-0.45'] += 1
            elif top < 0.60: peak_buckets['0.45-0.60'] += 1
            elif top < 0.80: peak_buckets['0.60-0.80'] += 1
            else: peak_buckets['>=0.80'] += 1
        else:
            argmax_lt_030 += 1
            peak_buckets['<0.30'] += 1
        if second >= 0.30: second_ge_030 += 1
        if c['antiCats']: anti_count += 1
        sal_hist[c['sal']] = sal_hist.get(c['sal'], 0) + 1
    print(f"  argmax >= 0.30 (preferred-present in shipped): {argmax_ge_030} ({100*argmax_ge_030/max(1,total):.1f}%)")
    print(f"  argmax <  0.30 (silent): {argmax_lt_030}")
    print(f"  2nd-highest >= 0.30 (soft formulation would add; shipped discards): {second_ge_030} ({100*second_ge_030/max(1,total):.1f}%)")
    print(f"  has antiCats: {anti_count} ({100*anti_count/max(1,total):.1f}%)")
    print(f"  template salience distribution: {sal_hist}")
    print(f"  argmax peak distribution: {peak_buckets}")
    # Specific archetypes where 2nd >= 0.30
    soft_adders = [(aid, sorted(c['probs'], reverse=True)[:3]) for aid, c in templated if sorted(c['probs'], reverse=True)[1] >= 0.30]
    if soft_adders:
        print(f"  archetypes where 2nd-highest >= 0.30:")
        for aid, top3 in soft_adders:
            print(f"    {aid}: top3 = {top3}")

summary("EPS")
summary("AES")
