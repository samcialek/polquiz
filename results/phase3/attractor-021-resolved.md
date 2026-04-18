# Stage 4 — 021 → 001 attractor: resolved as side effect

## Prior state (from CLAUDE.md)

> 021 Principled Cosmopolitan → 001 Rawlsian Reformer. Surfaced (not caused) by the Phase 2 TRB
> evidence-map fix. Mechanical cause: 021's and 001's final TRB anchor posteriors both collapse
> to flat national/ideological distributions. 001-vs-021 posterior margin in 021's run is 0.087
> (middle zone).

## Current state (post Task #45 — hollow-touch drops)

From `results/phase3/scoring-baseline-phase3.json`:

```
021 Principled Cosmopolitan: correct=True, rank=1, Q=28
001 Rawlsian Reformer:        correct=False, rank=20, Q=25  (→ 005 Pluralist Structuralist)
023 Rights Cosmopolitan:      correct=False, rank=0, Q=28   (deactivated; → 021, expected)
025 World-Minded Reformer:    correct=False, rank=0, Q=25   (deactivated; → 004 Labor Reformer)
```

021 now lands on itself at rank 1. The attractor is resolved.

## Why it resolved

The hollow-touch drops removed 68 phantom touchProfile entries from 44 representative-bank
questions. These phantoms were inflating the selector's coverage count — making the selector
think nodes were "touched" when no evidence actually updated them. In 021's earlier run,
questions that nominally touched TRB (and thus bumped its coverage) were not actually writing
any TRB posterior motion. The selector consequently deprioritized questions that would have
written real TRB evidence, and 021's final TRB distribution stayed flat.

With the phantom touches dropped, the selector now correctly picks questions that produce real
TRB motion. 021's TRB/global anchor posterior resolves distinctly from 001's.

## Remaining follow-up

001 Rawlsian Reformer itself now lands on 005 Pluralist Structuralist at rank 20. This is a
new, different attractor — unrelated to the 021/001 collapse. Deferred; 001 is not a priority
archetype and 005 is a principled near-neighbor.

## No further Stage-4 sharpening work scheduled

The original Stage-4 scope was "sharpen 021's TRB anchor posterior so it concentrates on global
rather than flat national/ideological". With 021 now correct at rank 1, there is no sharpening
problem to solve. Task #47 is **closed as resolved-by-side-effect**.
