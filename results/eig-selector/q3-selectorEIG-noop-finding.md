# Q3 in `selectorEIG.ts` `FORCED_COVERAGE_PROBES` — no-op finding

**Date:** 2026-05-02 (Terminal-3 autonomous block)
**HEAD at test:** `6d46e8a` electorate: add survey-to-prism mapper spec
**Patch tested (then reverted):** added `{ qid: 3, node: "CD" }` entry to
`FORCED_COVERAGE_PROBES` in `src/engine/selectorEIG.ts`, mirroring the
existing pattern used for Q7/Q213/Q18/Q207. Comment marked it as a
"clean CD position probe" / "cultural direction coverage" probe.
**Status:** patch reverted via `git checkout -- src/engine/selectorEIG.ts`.
No code committed.

## Result

The patch is a no-op for D1, D2, and D3. Question sequences are
byte-identical between fresh baseline and patched runs.

| Dump | Q3 slot before | Q3 slot after | Q82 slot before | Q82 slot after | Final match before | Final match after |
|---|---|---|---|---|---|---|
| **D1** (target 088) | −1 | −1 | NOT ASKED | NOT ASKED | 090 (rank −1) | 090 (rank −1) |
| **D2** (target 056) | −1 | −1 | #18 (recorded) | #18 (recorded) | 056 (rank 1) | 056 (rank 1) |
| **D3** (target 011) | −1 | −1 | #16 (recorded) | #16 (recorded) | 011 (rank 1) | 011 (rank 1) |

Per-node final estimates are also identical between baseline and
patched runs (CD, CU, MOR, ZS, ONT_S all unchanged).

## Root cause

Q82 is selected during **TOP_K_DRILL**, before the EIG_FILL phase where
`FORCED_COVERAGE_PROBES` runs. By the time the EIG-fill code path
checks for "<2 strong CD probes," Q82 has already been selected
(D2 slot 17, D3 slot 15) and applied, putting CD's strong-probe count
at 2 (Q93 + Q82) — which fails the `< 2` gate condition.

For D1, Q82 is recorded in the dump's trace but the live selector at
current HEAD doesn't ask Q82 either; the selector reaches the
EIG_FILL forced-coverage block, but Q3 isn't picked up there for
reasons that need separate investigation (likely Q3 isn't in
`baseEligible` after the salience-floor or touch-cap filters by that
point in the sequence).

Either way, modifying `selectorEIG.ts` is the wrong layer. The
intervention point is the **earlier TOP_K_DRILL phase**, where Q82
is currently being selected as the cultural-direction drill.

## Implication

Any "route Q3 earlier than Q82" experiment must target
`src/engine/topKDrill.ts`, not `src/engine/selectorEIG.ts`.

The next valid experiment (A2): add a narrow preferred-clean-probe
override inside `selectTopKDrillQuestion` — when CD is in
`needsDrill`, prefer Q3 (clean single-node CD/position@0.90 slider)
over Q82 (mixed CD+CU + side touches on MOR/MAT). Scope strictly to
CD/Q3; do not generalize.

## Fresh baseline at HEAD `6d46e8a` (recorded for cross-experiment compare)

### dump-replay (3 dumps)

| Dump | Target | Final match | Target rank | Total Q | CD final | CU final | MOR final | ZS final | ONT_S final |
|---|---|---|---|---|---|---|---|---|---|
| D1 | 088 | 090 Hobbesian Guardian d=0.38 | **−1** | 28 | 4.4 | 1.4 | 1.4 | 4.2 | 3.2 |
| D2 | 056 | 056 d=0.37 | 1 | 33 | 2.9 | 3.2 | 3.7 | 2.5 | 4.5 |
| D3 | 011 | 011 d=0.39 | 1 | 31 | 1.6 | 4.3 | 4.6 | 4.1 | 2.5 |

### persona-replay (centroid, 121 archetypes)

- Top-1: 66 / 121 (54.5%)
- Top-3: 85 / 121 (70.2%)
- Avg Q answered: 28.55

These are the values to compare any subsequent experiment against in
this autonomous block. (D1 already classifies to 090 at clean baseline;
D1 pass gate is on CD/CU values, not classification, per Sam's spec.)
