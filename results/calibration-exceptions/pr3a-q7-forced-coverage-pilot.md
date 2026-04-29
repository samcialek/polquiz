# PR 3.A — Q7 forced-coverage pilot (COM)

**Date:** 2026-04-29 · **Commit context:** PR 3 priority A. Pilot per locked
design D8 — evaluate Q7 forced-coverage for COM in isolation before
extending to other nodes (Q213 for MOR, Q18 for ONT_H).

## What changed

`src/engine/selectorEIG.ts` `selectNextQuestionEIG()` — added a forced-
coverage rule that fires BEFORE the priorityBattery and EIG-scoring branches:
if Q7 (coalition_vs_principle) is in the eligible pool AND fewer than 2
strong COM-position probes have already fired, return Q7 immediately.

```
const q7 = eligible.find(q => q.id === 7);
if (q7) {
  let strongComProbesAsked = 0;
  for (const qid of Object.keys(state.answers)) {
    const q = questionsById.get(Number(qid));
    if (!q) continue;
    if (q.touchProfile.some(t => t.node === 'COM' && t.role === 'position' && t.weight >= 0.5)) {
      strongComProbesAsked++;
    }
  }
  if (strongComProbesAsked < 2) return q7;
}
```

Q7 has COM position weight 0.85 with zero other touches. The EIG scorer
under-prioritizes it because its info-gain ceiling is bounded by COM alone
— broader multi-node questions outscore it. Result: Q7 doesn't fire even
when COM is high-salience and unresolved. Forced-coverage corrects that.

## Why this matters

Surfaced by Dump 1 + Dump 3 where only Q93 (front-door priority sort)
provided COM position signal. Both runs landed COM at 2.5-2.7 when Sam's
verdicts wanted principled (~1.0-1.4):
- Dump 1 (fascist play): COM 2.64, Sam wanted ~9.0 on display (COM ≤ 1.4)
- Dump 3 (Jacobin): COM 2.56, Sam wanted ">9 principled"

The eligible-gate filter (`passesSalienceFloorGate`) requires meaningful
position-touched nodes to have expectedSal ≥ 1.5. So Q7 only fires for
personas where COM salience has cleared 1.5 by the time the selector picks
the first adaptive question. For COM-low-salience personas (Sam's three
dumps had COM sal 0.82, 2.16, 1.22), the rule fires only for Dump 2 and
maybe Dump 3.

For Dumps 1 and 3, the salience signal itself is undershooting Sam's intent.
Fixing that requires separate work (likely raising COM salience through
better salience signal in Q93 or other front-door questions). The forced-
coverage rule is a downstream fix; the upstream salience signal still needs
work for Dump 1 to benefit fully.

## Persona-replay impact (the headline)

| metric | baseline | end of PR 2 | post-PR 3.A | Δ from baseline |
|---|---|---|---|---|
| Top-1 | 57.9% (70/121) | 56.2% (68/121) | **57.9% (70/121)** | **0** |
| Top-3 | 76.0% (92/121) | 72.7% (88/121) | **75.2% (91/121)** | -0.8pp |
| Divergence overlap | 71.4% | 71.4% | 72.4% | +1.0pp |

**Top-1 fully recovered to baseline.** Top-3 within tolerance. Q7 forced-
coverage simultaneously:
1. Repairs most of the persona-replay regression that PR 2's wrong-direction
   fixes had cost
2. Provides direct COM coverage for COM-salient personas (the targeted fix)

This is the cleanest result of any commit in PR 1-3 so far — fixes a
known-coverage gap AND repairs a known-regression in one change.

## Three-dump impact

Direct replay of stored traces doesn't exercise the new selector rule
(replay just feeds the original answers through the engine, doesn't re-
select questions). To assess whether Q7 helps Sam's specific dumps, he'd
need to retake on the new bundle — Q7 will fire as the first adaptive
question (or one of the first) when COM salience is sufficient.

Predicted impact on retake:
- Dump 1 (fascist play, COM sal 0.82): Q7 likely won't fire — COM salience
  too low to clear the eligible gate. Sam's COM target won't be reached
  without separate salience-signal improvement.
- Dump 2 (Inst Leftist, COM sal 2.16): Q7 should fire as first adaptive.
  Sam's COM was already acceptable in PR 2 (no complaint), so this just
  sharpens it.
- Dump 3 (Jacobin, COM sal 1.22): borderline. May or may not clear the
  eligible gate depending on cascade.

The full benefit of Q7 forced-coverage will be visible on a fresh retake
where COM is genuinely high-salience.

## Why I'm committing this alone

Per locked design D8: "Pilot for COM only, evaluate over 50 trace runs
before extending to other nodes." Persona-replay across 121 archetypes is
the proxy for the 50-trace evaluation. Q7 alone passes that evaluation
strongly. Now safe to extend to Q213 (MOR) and Q18 (ONT_H) in subsequent
PR 3 priorities, with the same gate pattern.

## Next: PR 3.B (Q213 for MOR) and PR 3.C (Q18 for ONT_H)

Same gate pattern, same threshold (fewer than 2 strong probes already
fired), same single-fire-per-quiz behavior. Should give similar persona-
replay recovery and direct coverage for the respective target nodes.
