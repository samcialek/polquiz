# Q93 contradictory-pole detection — calibration note, 2026-04-28

**Commit context:** PR 2 priority 2. Surfaced by Dump 1's Q93
priority-sort answer where Sam (playing hardened fascist) placed both
`pro_low` AND `pro_high` in supportHigh, plus both `mat_low` AND `mat_high`
in supportMid. Pre-fix, `applyPrioritySort` applied each item's position
update sequentially with order-dependence — last-applied item slightly
biased the result.

## What changed

`src/engine/update.ts` `applyPrioritySort()` — added pre-pass that builds
per-node combined target distribution from all items touching that node
(weighted by bucket weight, oppose-bucket inverted). If the combined target
has entropy ≥ 0.95 × log(5) ≈ 1.529 (i.e., near-uniform), mark the node as
contradictory and skip the position update entirely. Salience update
proceeds as normal — this captures Sam's "high salience + uncertain
position" semantics from design D7.

## Behavior contract

| input pattern | combined target | entropy | position update |
|---|---|---|---|
| Single item (most cases) | item's target | low (~1.3) | applies normally |
| Multi-item same direction (Q102 all-supportHigh assimilationist) | concentrated | low (~1.3) | applies normally |
| Two opposite-pole items same bucket | near-uniform | high (~1.6) | **skipped** |
| Items in opposite buckets pointing at opposite poles | combined → concentrated (one direction) | low (~1.3) | applies normally |

## Three-dump impact

| dump | Q93 contradictory cases | result |
|---|---|---|
| **Dump 1 Gentle Trad** | PRO (both poles in supportHigh), MAT (both poles in supportMid) | PRO position update skipped — removes prior +0.17 wrong-direction pull; cascade through other questions: MAT +0.36, MOR -0.30, ZS +0.21, PRO net -0.02 |
| **Dump 2 Inst Leftist** | none | trivial cascade drift (<0.1 on most nodes) |
| **Dump 3 Jacobin** | none | trivial cascade drift (COM +0.11) |

## Persona-replay impact

**Identical to Q29-only baseline:** 57.0% top-1 / 72.7% top-3. Q93 fix adds
no additional persona-replay regression beyond the Q29 floor-bend.

## Why PR 2 didn't push Dump 1's PRO toward Sam's target

Sam wanted PRO ≈ 1.5 (rule-bender) for the fascist play. Q93 fix removed a
+0.17 wrong-direction pull but PRO only moved by -0.02. Reason: the OTHER
PRO probes in Dump 1's trace (Q102, Q214) are weak signals for PRO. This is
the system-wide under-extremity issue (Phase 0 verification #2: PRO has 11
under-sharp probes with sharpest available at 0.45 mass at extreme).

The Q93 fix correctly removes the wrongful contribution. Hitting Sam's PRO
target requires the upstream selector forced-coverage work (PR 3 — force-
fire dedicated PRO direct probe like Q18 when PRO is salient and
unresolved).

## Notes on cascade effects in Dump 1

Removing Q93's MAT contradictory-cancellation (where mat_low+mat_high in
supportMid partially canceled Q6's MAT-high pull) lets Q6's MAT-high pull
land more strongly. MAT moved from 2.97 → 3.33. Sam's verdict on Dump 1
MAT was "5.6, that's good" — at 3.33 (display ~6.7), still acceptable.

MOR moved from 1.81 → 1.51 — more parochial. Sam's intent for hardened
fascist play wanted MOR-low, so this is *correct direction*.

ZS moved from 3.82 → 4.03 — slightly more zero-sum. Small drift in the
direction Sam intended (fascist play is zero-sum-aware).

None of these cascade effects regress against Sam's verdicts; one (MOR)
moves in the desired direction.
