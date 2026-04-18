"""
Diagnostic 3 — per-archetype failure profile on the new WTA.

Reads:
  - results/phase3/diagnostic-artifacts/diagnostic-1-results.json
  - src/config/archetypes.ts

For each archetype under the new WTA scorer, classifies the outcome:
  WIN: winA_newWTA == target
  LOSS: winA_newWTA != target

For losses, cross-references:
  - target's signature shape (anti count, salience breadth, cat-template sal)
  - confounder (winA_newWTA) signature shape
  - shift direction: target → confounder
  - whether the target also lost under the old scorer (variant B)

Reports patterns:
  - broad-salience bias: do low-salience-breadth archetypes lose more?
  - anti-flag miscalibration: do archetypes with many anti flags fail?
  - categorical-heavy bias: do archetypes with high-salience EPS/AES lose?
  - confounder pattern: do losses cluster on a small set of "attractor" confounders?
"""
import json, re
from pathlib import Path
from collections import Counter, defaultdict

# Load diagnostic 1
diag = json.loads(Path("results/phase3/diagnostic-artifacts/diagnostic-1-results.json").read_text())
rows = diag['rows']

# Parse archetypes.ts
text = Path("src/config/archetypes.ts").read_text(encoding="utf-8")
id_matches = list(re.finditer(r'^\s{4}id:\s*"(\d+)"', text, re.MULTILINE))
arch = {}  # id -> profile

for i, m in enumerate(id_matches):
    start = m.start()
    end = id_matches[i+1].start() if i+1 < len(id_matches) else len(text)
    block = text[start:end]
    aid = m.group(1)
    name_m = re.search(r'name:\s*"([^"]+)"', block)
    name = name_m.group(1) if name_m else "?"
    tier_m = re.search(r'tier:\s*"([^"]+)"', block)
    tier = tier_m.group(1) if tier_m else "?"
    active = "active: false" not in block

    # Parse continuous nodes: {pos, sal, anti?}
    cont_nodes = re.findall(
        r'(MAT|CD|CU|MOR|PRO|COM|ZS|ONT_H|ONT_S|PF|TRB|ENG):\s*\{\s*kind:\s*"continuous",\s*pos:\s*(\d+),\s*sal:\s*(\d+)(?:,\s*anti:\s*"(high|low)")?',
        block
    )
    cont = []
    for node_id, pos, sal, anti in cont_nodes:
        cont.append({"node": node_id, "pos": int(pos), "sal": int(sal), "anti": anti or None})

    # Parse categorical nodes
    cats = {}
    for cat_name in ("EPS", "AES"):
        m2 = re.search(
            cat_name + r':\s*\{\s*kind:\s*"categorical",\s*probs:\s*\[([^\]]+)\],\s*sal:\s*(\d)(?:,\s*antiCats:\s*\[([^\]]*)\])?',
            block
        )
        if m2:
            probs = [float(x.strip()) for x in m2.group(1).split(",")]
            sal = int(m2.group(2))
            antiCats_str = m2.group(3) or ""
            anti_idxs = [int(x.strip()) for x in antiCats_str.split(",") if x.strip()]
            cats[cat_name] = {"probs": probs, "sal": sal, "antiCats": anti_idxs, "argmax": max(probs)}

    # Summary stats
    anti_count = sum(1 for c in cont if c["anti"]) + sum(1 for c in cats.values() if c["antiCats"])
    sal_active = sum(1 for c in cont if c["sal"] >= 1) + sum(1 for c in cats.values() if c["sal"] >= 1)
    sal_high = sum(1 for c in cont if c["sal"] >= 2) + sum(1 for c in cats.values() if c["sal"] >= 2)
    cat_sal = sum(c["sal"] for c in cats.values())
    tribe_sig = next((c for c in cont if c["node"] == "TRB"), None)

    arch[aid] = {
        "id": aid, "name": name, "tier": tier, "active": active,
        "cont": cont, "cats": cats,
        "anti_count": anti_count,
        "sal_active_nodes": sal_active,
        "sal_high_nodes": sal_high,
        "cat_sal_total": cat_sal,
        "n_cont_templated": len(cont),
    }

print(f"Parsed {len(arch)} archetypes ({sum(1 for a in arch.values() if a['active'])} active)")

# Classify each run
wins = []
losses = []
wta_only_losses = []  # lost under A but won under B (scorer-caused)
both_losses = []      # lost under both A and B (deeper)
won_A_lost_B = []     # WTA won, old lost — rare case

for r in rows:
    tgt = r["target"]
    a_win = r["winA_newWTA"] == tgt
    b_win = r["winB_oldArgmin"] == tgt
    if a_win:
        wins.append(r)
        if not b_win:
            won_A_lost_B.append(r)
    else:
        losses.append(r)
        if b_win:
            wta_only_losses.append(r)
        else:
            both_losses.append(r)

print(f"\nOverall breakdown:")
print(f"  Wins under WTA (A):            {len(wins)} / {len(rows)}")
print(f"  Losses under WTA (A):          {len(losses)} / {len(rows)}")
print(f"    of which lost under WTA only (WTA-scoring-induced): {len(wta_only_losses)}")
print(f"    of which lost under both WTA and old (deep):        {len(both_losses)}")
print(f"  WTA won but old lost (rare):   {len(won_A_lost_B)}")

# WTA-only losses — these are the archetypes WTA broke
print(f"\n=== WTA-only losses ({len(wta_only_losses)} archetypes) ===")
print("These are targets the OLD scorer recovers correctly but WTA does not.")
print("The WTA scoring function is the causal mechanism for these failures.\n")

# Tabulate confounders
confounder_count = Counter()
for r in wta_only_losses:
    confounder_count[r['winA_newWTA']] += 1

print("Top confounders (where WTA pushed targets):")
for cid, n in confounder_count.most_common(10):
    cname = arch.get(cid, {}).get('name', '?')
    print(f"  {cid} {cname}: {n} targets")

# Anti-flag distribution in target vs confounder
def stat_pair(rows, key):
    import statistics
    if not rows:
        return None
    tgt_vals = [arch[r['target']][key] for r in rows if r['target'] in arch]
    conf_vals = [arch[r['winA_newWTA']][key] for r in rows if r['winA_newWTA'] in arch]
    return {
        'target_mean': statistics.mean(tgt_vals) if tgt_vals else 0,
        'confounder_mean': statistics.mean(conf_vals) if conf_vals else 0,
        'target_median': statistics.median(tgt_vals) if tgt_vals else 0,
        'confounder_median': statistics.median(conf_vals) if conf_vals else 0,
    }

for stat_key, label in [
    ('anti_count', 'Anti flags (continuous anti + categorical antiCats)'),
    ('sal_active_nodes', 'Active salience nodes (sal >= 1)'),
    ('sal_high_nodes',   'High salience nodes (sal >= 2)'),
    ('cat_sal_total',    'Total categorical salience (EPS.sal + AES.sal)'),
]:
    s = stat_pair(wta_only_losses, stat_key)
    if s:
        print(f"\n{label}: target vs confounder")
        print(f"  target    mean={s['target_mean']:.2f}  median={s['target_median']:.1f}")
        print(f"  confounder mean={s['confounder_mean']:.2f}  median={s['confounder_median']:.1f}")

# Compare wins vs WTA-only losses
print("\n=== Targets: WINS (under WTA) vs WTA-only LOSSES ===")
for stat_key, label in [
    ('anti_count', 'Anti flags'),
    ('sal_active_nodes', 'Active sal nodes'),
    ('sal_high_nodes',   'High sal nodes'),
]:
    import statistics
    win_vals = [arch[r['target']][stat_key] for r in wins if r['target'] in arch]
    loss_vals = [arch[r['target']][stat_key] for r in wta_only_losses if r['target'] in arch]
    print(f"  {label}: wins mean={statistics.mean(win_vals):.2f}, losses mean={statistics.mean(loss_vals):.2f}")

# Rank drop — under WTA where does the target land?
print("\n=== Rank of true target under WTA for WTA-only losses ===")
rank_buckets = Counter()
for r in wta_only_losses:
    rk = r['rankA']
    if rk == 2: rank_buckets['rank 2'] += 1
    elif rk == 3: rank_buckets['rank 3'] += 1
    elif rk <= 5: rank_buckets['rank 4-5'] += 1
    elif rk <= 10: rank_buckets['rank 6-10'] += 1
    elif rk <= 20: rank_buckets['rank 11-20'] += 1
    else: rank_buckets['rank 21+'] += 1
for k, v in rank_buckets.most_common():
    print(f"  {k}: {v}")

# List top rank-drops (target ranked far from 1 under WTA but rank 1 under old)
print("\n=== Largest rank drops under WTA (top 20) ===")
wta_drops = sorted(
    [(r['target'], arch.get(r['target'], {}).get('name','?'), r['rankA'], r['rankB'], r['winA_newWTA'], arch.get(r['winA_newWTA'], {}).get('name','?')) for r in wta_only_losses],
    key=lambda x: -x[2]
)
for aid, name, rkA, rkB, confID, confName in wta_drops[:20]:
    print(f"  {aid} {name}: WTA rank {rkA}, OLD rank {rkB}, WTA confounder={confID} {confName}")

# Both-losses — structural / irreducible
print(f"\n=== Deep losses ({len(both_losses)} archetypes — lost under both A and B) ===")
both_confounders = Counter()
for r in both_losses:
    both_confounders[r['winA_newWTA']] += 1
print("These are archetypes the node-discrimination signal itself cannot resolve.")
print("Stage-4 candidates regardless of scoring function.")
print("Top deep-loss confounders:")
for cid, n in both_confounders.most_common(5):
    cname = arch.get(cid, {}).get('name', '?')
    print(f"  {cid} {cname}: {n} targets")

# Save structured summary
out = {
    "n_total": len(rows),
    "wins": len(wins),
    "losses": len(losses),
    "wta_only_losses": len(wta_only_losses),
    "both_losses": len(both_losses),
    "won_A_lost_B": len(won_A_lost_B),
    "wta_confounders_top10": [{"id": cid, "name": arch.get(cid,{}).get('name','?'), "count": n} for cid, n in confounder_count.most_common(10)],
    "wta_only_loss_rows": [
        {
            "target": r['target'], "target_name": arch.get(r['target'],{}).get('name','?'),
            "rank_wta": r['rankA'], "rank_old": r['rankB'],
            "wta_confounder": r['winA_newWTA'], "wta_confounder_name": arch.get(r['winA_newWTA'],{}).get('name','?'),
            "target_anti_count": arch.get(r['target'],{}).get('anti_count'),
            "target_sal_active": arch.get(r['target'],{}).get('sal_active_nodes'),
            "conf_anti_count": arch.get(r['winA_newWTA'],{}).get('anti_count'),
            "conf_sal_active": arch.get(r['winA_newWTA'],{}).get('sal_active_nodes'),
        }
        for r in wta_only_losses
    ],
    "both_loss_rows": [
        {
            "target": r['target'], "target_name": arch.get(r['target'],{}).get('name','?'),
            "rank_wta": r['rankA'], "rank_old": r['rankB'],
            "confounder": r['winA_newWTA'], "confounder_name": arch.get(r['winA_newWTA'],{}).get('name','?'),
        }
        for r in both_losses
    ],
}
Path("results/phase3/diagnostic-artifacts/diagnostic-3-profile.json").write_text(json.dumps(out, indent=2))
print(f"\nWrote results/phase3/diagnostic-artifacts/diagnostic-3-profile.json")
