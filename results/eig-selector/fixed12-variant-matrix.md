# Fixed-12 opener variant matrix

**Date:** 2026-05-03 (Terminal-3)
**HEAD at evaluation:** `2e136e2`
**Goal:** Cut the 15-question fixed opener (10 CORE + 5 UNIVERSAL_SCREENERS) to 12 without regressing D2/D3 top-1 or broad persona recovery beyond −2pp.
**Approach:** Patch only `CORE_OPENER` / `UNIVERSAL_SCREENERS` in `src/engine/config.ts`; run `dump-replay` (D1/D2/D3) and `persona-replay` (121 archetypes) per variant; record numerics; do not edit archetype signatures or question configs.

## Variants

| ID | Drops vs baseline | Adds | Sequence (12) |
|---|---|---|---|
| V12-A | Q1, Q22, Q102 | — | 200, 103, 97, 60, 89, 218, 211, 212, 93, 209, 210, 214 |
| V12-B | Q1, Q22, Q211 | — | 200, 103, 97, 60, 89, 218, 212, 93, 102, 209, 210, 214 |
| V12-C | Q1, Q22, Q212 | — | 200, 103, 97, 60, 89, 218, 211, 93, 102, 209, 210, 214 |
| V12-D | Q1, Q22, Q102, Q211 | Q3 (after Q93) | 200, 103, 97, 60, 89, 218, 212, 93, 3, 209, 210, 214 |
| V12-E | Q1, Q22, Q102, Q211 | Q8 (after Q93) | 200, 103, 97, 60, 89, 218, 212, 93, 8, 209, 210, 214 |

## Headline numbers

| Variant | Len | Dyn@ | D1 match (rank) | D2 match (rank) | D3 match (rank) | D1 CD pos | D1 CU pos | Top-1 | Top-3 | AvgQ |
|---|---:|---:|---|---|---|---:|---:|---:|---:|---:|
| **Baseline (15)** | 15 | 16 | 090 (−1) | 056 (1) | 011 (1) | 4.46 | 1.40 | 66/121 (54.5%) | 85/121 (70.2%) | 28.55 |
| V12-A | 12 | 13 | 090 (−1) | 056 (1) | 011 (1) | 4.46 | 1.40 | 56/121 (46.3%) | 80/121 (66.1%) | 26.12 |
| V12-B | 12 | 13 | 090 (−1) | 056 (1) | 011 (1) | 4.46 | 1.40 | 59/121 (48.8%) | 81/121 (66.9%) | 25.05 |
| V12-C | 12 | 13 | 090 (−1) | 056 (1) | 011 (1) | 4.46 | 1.40 | 59/121 (48.8%) | 81/121 (66.9%) | 25.05 |
| V12-D | 12 | 13 | 090 (−1) | 056 (1) | 011 (1) | 4.46 | 1.40 | 57/121 (47.1%) | 85/121 (70.2%) | 26.09 |
| V12-E | 12 | 13 | 083 (3)  | 056 (1) | 011 (1) | 4.21 | 1.50 | 56/121 (46.3%) | 82/121 (67.8%) | 25.61 |

D1 target 088 is rank −1 in baseline (per attribution audit `1de4ad4`, this is a profile-distance issue not a selector issue), so D1 rank for 088 is not a useful pass criterion. V12-E shifts D1 match from 090 to 083 and brings 088 into top-3 (rank 3) — but at the cost of regressing D1 CD (4.46 → 4.21) and D1 CU (1.40 → 1.50).

## Per-node final estimates by variant

(D1 only, since D2/D3 nodes barely shift between variants. Full per-dump per-node data is in the per-variant `*-dump.json` files.)

| Variant | D1 CD | D1 CU | D1 MOR | D1 PRO | D1 ONT_H | D1 ONT_S |
|---|---:|---:|---:|---:|---:|---:|
| Baseline | 4.46/2.94 | 1.40/2.65 | 1.40/2.86 | 3.14/1.50 | 1.80/2.66 | 3.22/2.20 |
| V12-A | 4.46/2.94 | 1.40/2.65 | 1.63/2.81 | 3.14/1.50 | 1.80/2.66 | 3.22/2.20 |
| V12-B | 4.46/2.94 | 1.40/2.65 | 1.63/2.81 | 3.14/1.50 | 1.80/2.66 | 3.22/2.20 |
| V12-C | 4.46/2.94 | 1.40/2.65 | 1.63/2.81 | 3.14/1.50 | 1.80/2.66 | 3.22/2.20 |
| V12-D | 4.46/2.94 | 1.40/2.65 | 1.63/2.81 | 3.14/1.50 | 1.80/2.66 | 3.22/2.20 |
| V12-E | 4.21/2.94 | 1.50/2.65 | 1.76/2.81 | 2.91/1.50 | 1.73/2.66 | 2.92/1.98 |

D1 MOR slips from 1.40 to 1.63 in every variant (consistent ~0.23 nudge toward neutral). MOR sal also drops 2.86 → 2.81. Likely caused by dropping Q22 + Q1 from the opener — the residual MOR position evidence is being supplied by fewer touches in the dynamic phase.

## Q3 / Q82 firing slots

| Variant | D1 Q3 | D1 Q82 | D2 Q3 | D2 Q82 | D3 Q3 | D3 Q82 |
|---|---:|---:|---:|---:|---:|---:|
| Baseline | 16 | — | — | 18 | 16 | 18 |
| V12-A | 13 | — | — | 15 | 13 | 15 |
| V12-B | 13 | — | — | 15 | 13 | 15 |
| V12-C | 13 | — | — | 15 | 13 | 15 |
| V12-D | 9 | — | 9 | 15 | 9 | 14 |
| V12-E | 13 | 24 | — | 15 | 13 | 14 |

V12-D is the only variant where Q3 fires on D2 (because Q3 is forced into slot 9 of the fixed sequence). Q3 in fixed slot doesn't help D1's classification (still 090) — because, per the D1 attribution audit, CD is not the deciding axis on D1.

## Acceptance gates

| Gate | Threshold | V12-A | V12-B | V12-C | V12-D | V12-E |
|---|---|:-:|:-:|:-:|:-:|:-:|
| Fixed opener length | = 12 | ✅ | ✅ | ✅ | ✅ | ✅ |
| Dynamic phase starts at | slot 13 | ✅ | ✅ | ✅ | ✅ | ✅ |
| D2 target rank | = 1 | ✅ | ✅ | ✅ | ✅ | ✅ |
| D3 target rank | = 1 | ✅ | ✅ | ✅ | ✅ | ✅ |
| D1 CD pos | ≥ 4.46 | ✅ (4.46) | ✅ (4.46) | ✅ (4.46) | ✅ (4.46) | ❌ (4.21) |
| D1 CU pos | ≤ 1.40 | ✅ (1.40) | ✅ (1.40) | ✅ (1.40) | ✅ (1.40) | ❌ (1.50) |
| Persona top-1 | ≥ 52.5% (≥ 64/121) | ❌ 56 (46.3%) | ❌ 59 (48.8%) | ❌ 59 (48.8%) | ❌ 57 (47.1%) | ❌ 56 (46.3%) |
| Persona top-3 | ≥ 68.2% (≥ 83/121) | ❌ 80 (66.1%) | ❌ 81 (66.9%) | ❌ 81 (66.9%) | ✅ 85 (70.2%) | ❌ 82 (67.8%) |
| Avg Q | ≤ 28.55 | ✅ 26.12 | ✅ 25.05 | ✅ 25.05 | ✅ 26.09 | ✅ 25.61 |
| No retired terminology | grep clean | ✅ | ✅ | ✅ | ✅ | ✅ |

## Summary

**No fixed-12 variant passes the broad-regression gates.** All five variants drop persona top-1 by **−5.7pp to −8.2pp** (baseline 54.5% → variants 46.3–48.8%) — far below the −2pp acceptance threshold.

The cut is buying ~2.5–3.5 fewer questions per respondent on average (28.55 → 25.05–26.12), but at the cost of 7–10 personas falling out of top-1. That is a bad trade.

### What failed for each rejected variant

- **V12-A** (drop Q1 + Q22 + Q102) — top-1 56/121 (−8.2pp), top-3 80/121 (−4.1pp). Worst broad regression in the set.
- **V12-B** (drop Q1 + Q22 + Q211, keep Q102) — top-1 59/121 (−5.7pp), top-3 81/121 (−3.3pp). Best top-1 in set, but still fails by 5pp.
- **V12-C** (drop Q1 + Q22 + Q212, keep Q102) — top-1 59/121 (−5.7pp), top-3 81/121 (−3.3pp). Statistically indistinguishable from V12-B (Q211 vs Q212 are vote-prediction metadata that don't change archetype scoring distance).
- **V12-D** (drop Q1 + Q22 + Q102 + Q211, add Q3 after Q93) — top-1 57/121 (−7.4pp), top-3 85/121 (matches baseline). Wins on top-3 — Q3 in fixed slot 9 supplies clean CD evidence early enough to keep middle-rank cosmopolitans/traditionalists in top-3 — but doesn't move them to top-1.
- **V12-E** (drop Q1 + Q22 + Q102 + Q211, add Q8 after Q93) — top-1 56/121 (−8.2pp), top-3 82/121 (−2.5pp), and uniquely **regresses D1 CD/CU**. Q8 doesn't supply the CD direction probe Q3 does. Q8 shifts D1 match from 090 to 083 (target 088 enters top-3 at rank 3), but at the cost of D1 CD slipping to 4.21 and CU to 1.50 — under-extremity returns.

### Where the broad regression comes from

D1 MOR slips uniformly 1.40 → 1.63 across all variants. This is not a coincidence: dropping Q1 and Q22 reduces opener-phase ENG/EPS coverage, which downstream affects MOR signal accumulation in dynamic phase. The selector takes longer to reach the same MOR estimate (and the +1 question budget reduction pushes the run to terminate before recovering).

The Q102 drop (V12-A, V12-D, V12-E) is also load-bearing — Q102 is the only opener question that touches CU + MOR + TRB + CD + MAT + ZS + PRO simultaneously (membership criteria priority sort). It's a multi-node anchoring question whose absence forces the dynamic phase to reconstruct that signal one node at a time.

### Best fixed-12 candidate (if forced to ship one)

**V12-D** — top-3 matches baseline, broad damage somewhat localized to top-1 ranking-shuffle (not top-3 exits). But still fails the −2pp gate by 5pp on top-1; not shippable as-is.

### Is fixed-12 ready to ship?

**No.** All variants fail the broad-regression gate. Recommendation: keep the current 15-question opener; revisit fixed-12 only after one of the following:
1. **Q103 / Q93 / Q102 redesign** — supply more per-question position evidence so each opener slot does more work, then 12 becomes feasible.
2. **Top-K drill expansion** — raise `MIN_POSITION_TOUCHES_PER_TOP_K` from 2 to 3 so the dynamic phase compensates for opener cuts. (Would need its own variant matrix; would also raise avg-Q.)
3. **Selective-drop approach** — drop only Q1 and Q22 to reach a fixed-13, which the data here suggests would lose ~3pp top-1 (extrapolating from V12-B/C dropping 1 vote-metadata question). A 13-question opener with top-1 ~51.2% might be a more defensible operating point.

## Files written by this experiment

- `results/eig-selector/fixed12-variant-baseline.md` — baseline numbers
- `results/eig-selector/fixed12-variant-matrix.md` (this file)
- `results/eig-selector/fixed12-variant-matrix.json` — machine-readable matrix
- `results/eig-selector/fixed12-variant-outputs/baseline-{dump,persona}.log`
- `results/eig-selector/fixed12-variant-outputs/V12-{A,B,C,D,E}-{dump,persona}.{json,log}`
- `scripts/fixed12-variant-runner.mjs` — diagnostic runner (untracked; not staged)

## Patch state

`src/engine/config.ts` reverted to HEAD (`2e136e2`). No engine, question-config, dist, browser, or output edits.

## Terminology check

No retired model concepts used; canonical terminology only ("moral-boundary salience" / "moral-boundary loading" where applicable). Engagement described as a separate 1D continuous variable per ADR canon. Legacy code identifiers (`MOR`, `CD`, `CU`, `Q3`, `Q82`) appear only as implementation labels for nodes / questions.
