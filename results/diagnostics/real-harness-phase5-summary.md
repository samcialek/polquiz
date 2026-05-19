# Phase 5 — Harness Skeleton, Validation Run

**Date:** 2026-05-19
**Spec:** HARNESS-HANDOFF.md §7 + §11.9

## What landed

Three new files realize the harness skeleton:

| File | Purpose |
|---|---|
| `src/diagnostics/personas/abstain-to-trump.ts` | Tier-A persona #1 declaration (HARNESS-HANDOFF §3.1) |
| `src/diagnostics/answerEngine.ts` | Generic `decideAnswer(persona, q)` dispatch by UI type; question-ID special cases for metadata items |
| `src/diagnostics/realHarness.ts` | Driver: loops through live `getNextQuestion`/`submitAnswer` against the same API the browser uses; emits report + trace |

Run via `npx tsx src/diagnostics/realHarness.ts`. Outputs:
- `results/diagnostics/real-harness-<persona-id>.md`
- `results/diagnostics/persona-traces/<persona-id>.json`

## Validation result (Abstain → Trump persona)

| Field | Value |
|---|---|
| Questions asked | 28 |
| Composed label | **Fighter Assimilationist** |
| Engagement | casual |
| Identity-primary overlay | (none) |
| **Vote match** | **5/5** ✓ ABSTAIN 2008/2012, R 2016/2020/2024 |

The vote-prediction chain — engine → respondent signature → election alignment → engagement gate → predictVote — is **functional end-to-end** for this persona. The composed label "Fighter Assimilationist" sits in the populist-nationalist family the persona was designed to land at.

## Known issues — Phase 5b iteration targets

The answer engine is intentionally minimal in this first pass (HARNESS-HANDOFF §11.9: "iterate from observed misroutings"). Three issues observed in the trace:

### 1. Identity-primary overlay returned (none)

Scoped affinities under-pulled: `national: 66.78` and `religious: 66.25` end up just below the IDP gate's `scoped ≥ 70`. Persona declared `national: 90, religious: 80` — should comfortably clear.

Root cause: `decidePrioritySort` uses quartile bucketing (6 items → 1/1/3/1 placement) without considering the persona's absolute intensity on each item's target scope. Only `ingroup_national` lands in supportHigh on Q229, instead of national+religious+ideological. Same effect on Q60.

Fix: score priority_sort items by persona's stance on the item's semantic target (scope or pole), then bucket by absolute thresholds rather than quartiles.

### 2. Categorical prototype shape mismatch (Q89, Q218)

Q89/Q218 evidence uses `categorical: { EPS: EPS_PROTOTYPES.empiricist }` where the value is a raw 6-element number[] (the prototype). My `scoreEvidence` only inspects `{cat: ...}` or `{probs: ...}` object shapes, so it misses raw arrays and returns 0 for every option — alphabetical tiebreak picks `eps_empiricist` regardless of the persona's preference. Trace shows the persona (eps=`intuitionist`) was assigned `eps_empiricist` as best.

Fix: handle `categorical: { NODE: number[] }` shape directly — peak of the array IS the category index.

### 3. One-pole question bucketing (Q102)

Q102 has all items pulling CU low (one-pole design, intentional). The persona is CU=2 (assimilationist). My scoring picked items whose CU peak is closest to 2 (e.g., `cultural` at peak=2, `speak_lang` at peak=2.5) over items whose CU peak is 1 (`ancestry`, `born_here`, `religion`). For an assimilationist persona, the strongest-pull items should land in supportHigh, not the closest-distance items.

Fix: for one-pole questions, items pulling toward the persona's pole at greater intensity should bucket higher, not items closer to the persona's exact peak.

## Architecture deferred for Phase 5b

**Top-K archetype-ID ranking.** Requires `archetypeDistance(state, archetype)` which needs the internal `RespondentState` shape (posDist/salDist arrays). `getRespondentState()` returns a sanitized debug shape (expectedPos/salience scalars). For Phase 5 the composed archetype label serves as the user-facing identity (which is what the live quiz now shows — the 124-centroid Bayesian matcher was retired 2026-05-13). Top-K ranking can be added by either (a) exposing an internal-state accessor for harness use, or (b) writing a signature-based distance variant.

## Updated contingency tree

Phase 5 is **functionally validated**. The architecture works. The next iteration is:

**Phase 5b — answer-engine refinement** (~1 session):
- Fix priority_sort bucketing per Issues 1 + 3
- Fix categorical raw-array handling per Issue 2
- Re-run abstain-to-trump → expect IDP overlay to trigger this time
- Verify composed label sharpens (currently "Fighter Assimilationist"; with proper sort placement could narrow further)

**Phase 6 — scale to 15-persona battery**:
- Build remaining 14 persona files (Tier-A #2, #3 + Tier-B 12)
- Run battery; emit cross-persona aggregate report per spec §4
- Identify selector starvation, non-discriminative questions, archetype reachability gaps per §5

**Phase 7 — gap analysis → new questions.** Use battery data to empirically justify (or kill) Q240–Q243.

Phases 3b (non-router §5.5), 4 (router F1 batch cleanup), and the open micro-decisions (Kirchnerism, Q243 wording) all remain queued and orthogonal.

## Verification commands

```
npm run build                                      # clean
npx tsx src/diagnostics/realHarness.ts             # one-persona run
node scripts/audit-per-response.mjs                # post-fix audit state unchanged
```

Outputs: `results/diagnostics/real-harness-abstain-to-trump.md` + `persona-traces/abstain-to-trump.json`.
