# Phase 3g — Regression after representative-bank hollow touch drops

Applied drop-hollow-touches patch against `src/config/questions.representative.ts`: 68 hollow
`touchProfile` entries removed from 44 questions, identified by
`src/diagnostics/questionInfo.ts` (inter-variant max JSD < 1e-4 — i.e., the touch is declared but
no evidence map writes to that node:role, so the Bayesian update never fires).

A "hollow" declaration still bumped the `touches` counter on its node during `registerTouches`,
which the selector and stop-rule use as coverage signal. Removing phantom coverage lets the
selector pick questions that *actually* probe each node.

## Aggregate delta

| metric       | before drops | after drops | delta |
|--------------|--------------|-------------|-------|
| top1         | 50 (41.3%)   | 55 (45.5%)  | +5    |
| top3         | 75 (62.0%)   | 80 (66.1%)  | +5    |
| top5         | 88 (72.7%)   | 87 (71.9%)  | -1    |
| avg Qs asked | 28.4         | 28.4        |  0    |
| misses       | 71           | 66          | -5    |

Net: +5 top1, +5 top3, -1 top5. The one top5 loss is an archetype that dropped from rank 5 to
6+; compared with 5 archetypes promoted into top1 and 5 into top3, this is a clear win.

## Context: the Phase 3 level-shift

`post-3b` (pre-ADR-001) top1 was 105/121 (87%). The drop to 50-55 top1 is the Phase 3 scoring-
layer change, not this patch — ADR-001 retired per-archetype priors and swapped softmax-of-
distance for Euclidean WTA. Priors were absorbing a lot of archetype-shape nuance. Phase 3g's
purpose is to establish the **new baseline** under the new scoring regime, which is what this
run captures.

Saved at: `results/phase3/scoring-baseline-phase3.json`

## H2 recheck (Q60 per-touch JSD)

Q60 `politically_important_identities` per-touch TRB_ANCHOR JSD (post-drops): `0.0310` — still
weak. The H2 concern (from `results/trb-fix/diagnosis.md`) was that Q60 TRB_ANCHOR JSD of
0.0178 nats was the sole populated channel. With Phase 2 evidence-map fixes (Q51/Q52/Q63), Q60
is no longer the only signal, but its own per-touch discrimination remains modest.

Action: **deferred to Stage 4 attractor sharpening** (Task #47). The fix is conceptual — Q60's
`rankingMap` already writes `trbAnchor: { <anchor>: 1 }` per item, so each answer variant picks
out a different anchor. The low JSD is driven by the rank-weight schedule and the 9-way anchor
distribution; we'd need to amplify the per-item weight or make the rank schedule sharper.
Neither is critical pre-Stage-4.
