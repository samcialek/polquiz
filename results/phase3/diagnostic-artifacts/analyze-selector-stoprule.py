"""
Diagnostic 4 — selector / stop-rule cadence analysis.

Reads:
  - results/phase3/scoring-baseline-post-3b.json  (pre-Phase-3 baseline)
  - results/phase3/scoring-baseline-phase3.json   (current Phase-3 baseline)
  - results/phase3/diagnostic-artifacts/diagnostic-1-results.json
    (old scorer re-scored against Phase-3 final states)

Question: has the Phase-3 selector + stop-rule rework degraded question
selection in a way we should partially reverse as part of the rollback?

D1 already isolated the selector/stop-rule contribution at ~6pp under the
old scorer (86.8% post-3b full → 81.0% new-selector + old-scorer). D4 goes
deeper — looks at per-run question counts, stop-rule firing distribution,
and win rate by Q bucket to identify whether the cadence change is net
positive, neutral, or negative.
"""
import json
from collections import Counter
from pathlib import Path

def load(path):
    return json.loads(Path(path).read_text())

baselines = {
    "post-3b (pre-Phase-3 selector + old scorer)":
        load("results/phase3/scoring-baseline-post-3b.json"),
    "phase-3 (current selector + WTA scorer)":
        load("results/phase3/scoring-baseline-phase3.json"),
}

def bucket(q, mn):
    if q == mn: return f"=min ({mn})"
    if q <= 30: return "26-30"
    if q <= 35: return "31-35"
    if q <= 45: return "36-45"
    if q <= 54: return "46-54"
    return "=55 (hardCap)"

for label, d in baselines.items():
    r = d["allResults"]
    qs = [x["questionsAnswered"] for x in r]
    mn, mx, avg = min(qs), max(qs), sum(qs) / len(qs)
    print(f"=== {label} ===")
    print(f"  top-1: {d['top1']}/{d['total']} ({d['top1Pct']}%)")
    print(f"  Q: min={mn}, max={mx}, avg={avg:.1f}")
    b = Counter(bucket(q, mn) for q in qs)
    for k, v in sorted(b.items(), key=lambda x: -x[1]):
        print(f"    {k}: {v}")
    # Win rate by bucket
    print("  win rate by bucket:")
    for k in b:
        sub = [x for x in r if bucket(x["questionsAnswered"], mn) == k]
        correct = sum(1 for x in sub if x["correct"])
        print(f"    {k}: {correct}/{len(sub)} ({100*correct/len(sub):.1f}%)")
    print()

# Composite: old scorer re-evaluated on Phase-3 selector's final states
d1 = load("results/phase3/diagnostic-artifacts/diagnostic-1-results.json")
rows = d1["rows"]
b_wins = sum(1 for r in rows if r["winB_oldArgmin"] == r["target"])
a_wins = sum(1 for r in rows if r["winA_newWTA"] == r["target"])
print(f"=== D1 re-scoring (Phase-3 selector's final states) ===")
print(f"  variant A (new WTA scorer):  {a_wins}/{len(rows)} = {100*a_wins/len(rows):.1f}%")
print(f"  variant B (old scalar scorer): {b_wins}/{len(rows)} = {100*b_wins/len(rows):.1f}%")
print(f"  selector-only contribution:  86.8% (post-3b) - 81.0% (B) = 5.8pp")
print(f"  scorer-only contribution:    81.0% (B) - 45.5% (A)       = 35.5pp")
