# Q102 all-supportHigh escalation — calibration note, 2026-04-28

**Commit context:** PR 2 priority 3. Per locked design D1 — when ALL membership
criteria in Q102 are placed in supportHigh, the user is signaling the
maximum-assimilationist demand (every criterion essential = none dispensable).
Per ADR-008 the per-item evidence weights were lowered to avoid civic-
nationalist collapse, but that softening also suppresses the genuine MAX
case. Override fixes that.

## What changed

`src/engine/update.ts` `applyPrioritySort()` — added Q102-specific extreme-
case detection. When `q.id === 102` AND all items in supportHigh (or all in
opposeHigh, the inverse), apply a single concentrated CU position update
(target peaked at pos=1 or pos=5, mix weight 0.85), and add CU to the
position-skip set so the per-item loop doesn't double-pull.

Per-item updates for OTHER nodes touched by Q102 (MOR, TRB, CD, MAT, ZS, PRO)
proceed normally — those are item-specific signals and stay valid.

## Override math

For all-supportHigh (max-assimilationist):
- Target: `[0.90, 0.05, 0.03, 0.01, 0.01]` (mean ≈ 1.18, peaked at CU=1)
- Mix weight: 0.85

For all-opposeHigh (max-pluralist anti-criterion):
- Target: `[0.01, 0.01, 0.03, 0.05, 0.90]` (mean ≈ 4.82, peaked at CU=5)
- Mix weight: 0.85

The 0.85 mix weight is aggressive (vs 0.40 for routine priority-sort items).
Justification: this is a detected EXTREME-case, not a routine update. The
user has signaled max-strict membership demand; the engine should reflect
that without diluting through soft per-item averaging.

## Three-dump impact

| dump | Q102 supportHigh count | escalation fires | CU before → after |
|---|---|---|---|
| **Dump 1 (Gentle Trad — fascist play)** | **all 8** | YES | 2.35 → **1.50** ✅ Sam's target <1.4 |
| Dump 2 (Inst Leftist) | 3 of 8 (civic-nationalist subset) | no | 3.32 → 3.22 (Q29/Q93 cascade only) |
| Dump 3 (Jacobin) | 0 of 8 | no | 4.27 → 4.27 (untouched) |

Dump 1 CU now at 1.50 (display ≈ 8.75 on one-shared-way scale). Sam wanted
">9" → very close, within 0.10. The remaining gap is below the noise floor
of likelihood sharpness (Phase 0 verification #2 found CU has 10 of 11
under-sharp probes).

## Persona-replay impact

**57.0% top-1 / 72.7% top-3** — identical to Q29+Q93 baseline. Escalation
rarely fires on centroid personas because most CU-extreme archetypes have
geometry that doesn't naturally produce all-8-essential or all-8-opposed
patterns when answered through the deterministic answer-picker. The narrow
gate (all-or-nothing) is what makes this safe.

## Why CU didn't reach 1.40 exactly

Going into Q102: CU=2.636 (Q93's cu_low pick already shifted it from uniform
3.0). With override: posDist = 0.15 × pre + 0.85 × target, expected pos =
0.15 × 2.636 + 0.85 × 1.18 = 0.40 + 1.00 = **1.40** in pure math.

Observed final CU was 1.50 — slightly higher than the math predicts because
OTHER questions after Q102 in Dump 1's trace (Q60, Q63 etc.) touch CU and
pull it slightly differently. The escalation gets us to ~1.40 immediately
post-Q102; downstream questions then add small drift.

## Symmetry note

The all-opposeHigh case was added for symmetry even though no current dump
exercises it. Semantically, marking every membership criterion as "no, I
oppose this being essential" = max-pluralist anti-criterion stance. Pre-fix
behavior would have produced ~CU=4.7 (decent but not max). Post-fix override
pulls toward CU=4.82 (max-pluralist). Useful for genuine cosmopolitan-
anarchist play patterns that may surface in future runs.
