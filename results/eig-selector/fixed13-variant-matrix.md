# Fixed-13 follow-up opener variant matrix

**Date:** 2026-05-03 (Terminal-3)
**HEAD at evaluation:** `a246d96` (post fixed-12 matrix commit)
**Baseline:** Fixed-15 from `fixed12-variant-matrix.md` (top-1 66/121 = 54.5%, top-3 85/121 = 70.2%, avgQ 28.55).
**Goal:** Fixed-12 failed broad top-1 by −5.7 to −8.2pp. Test whether the safer cut "drop Q1 + Q22 only" yields a shippable fixed-13. Run two diagnostic 14-q variants alongside to isolate which dropped question is load-bearing.

## Variants

| ID | Length | Drops vs baseline | Adds | Sequence |
|---|---:|---|---|---|
| **F13-A** | **13** | Q1, Q22 | — | 200, 103, 97, 60, 89, 218, 211, 212, 93, 102, 209, 210, 214 |
| F13-B (diag) | 14 | Q1 only | — | 200, 103, 97, 60, 89, 22, 218, 211, 212, 93, 102, 209, 210, 214 |
| F13-C (diag) | 14 | Q1, Q22 | Q3 (after Q102) | 200, 103, 97, 60, 89, 218, 211, 212, 93, 102, 3, 209, 210, 214 |

F13-A is the candidate. F13-B isolates "is Q22 carrying the lost top-1 signal?" F13-C tests "does explicit fixed Q3 compensate for the Q22 drop?"

## Headline numbers

| Variant | Len | Dyn@ | D1 match (rank) | D2 match (rank) | D3 match (rank) | D1 CD pos | D1 CU pos | Top-1 | Δ top-1 | Top-3 | Δ top-3 | AvgQ | Δ AvgQ |
|---|---:|---:|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|
| **Baseline (15)** | 15 | 16 | 090 (−1) | 056 (1) | 011 (1) | 4.46 | 1.40 | 66/121 (54.5%) | — | 85/121 (70.2%) | — | 28.55 | — |
| **F13-A** | **13** | **14** | 090 (−1) | 056 (1) | 011 (1) | 4.46 | 1.40 | 59/121 (48.8%) | **−5.7pp** | 81/121 (66.9%) | **−3.3pp** | 26.05 | −2.50 |
| F13-B (14) | 14 | 15 | 090 (−1) | 056 (1) | 011 (1) | 4.46 | 1.40 | **66/121 (54.5%)** | **0.0pp** | **85/121 (70.2%)** | **0.0pp** | 26.97 | −1.58 |
| F13-C (14) | 14 | 15 | 090 (−1) | 056 (1) | 011 (1) | 4.46 | 1.40 | 62/121 (51.2%) | −3.3pp | 84/121 (69.4%) | −0.8pp | 27.01 | −1.54 |

## Per-node final estimates (D1)

| Variant | D1 CD | D1 CU | D1 MOR | D1 PRO | D1 ONT_H | D1 ONT_S |
|---|---:|---:|---:|---:|---:|---:|
| Baseline | 4.46/2.94 | 1.40/2.65 | **1.40**/2.86 | 3.14/1.50 | 1.80/2.66 | 3.22/2.20 |
| F13-A | 4.46/2.94 | 1.40/2.65 | 1.63/2.81 | 3.14/1.50 | 1.80/2.66 | 3.22/2.20 |
| F13-B | 4.46/2.94 | 1.40/2.65 | 1.63/2.81 | 3.14/1.50 | 1.80/2.66 | 3.22/2.20 |
| F13-C | 4.46/2.94 | 1.40/2.65 | 1.63/2.81 | 3.14/1.50 | 1.80/2.66 | 3.22/2.20 |

D2/D3 nodes are ≥99% identical across all variants (CD/CU/MOR/PRO/ONT_H/ONT_S match baseline within 0.07).

**D1 MOR slip 1.40 → 1.63 is caused by dropping Q1, not Q22.** Even F13-B (which keeps Q22) shows the same 1.63 MOR. Q1 (political content frequency) supplies indirect MOR position evidence via the engagement-channel touch profile. Not in the gate list, but worth flagging — D1 MOR moves slightly toward neutral whenever Q1 is dropped.

## Q3 / Q82 firing slots

| Variant | D1 Q3 | D1 Q82 | D2 Q3 | D2 Q82 | D3 Q3 | D3 Q82 |
|---|---:|---:|---:|---:|---:|---:|
| Baseline | 16 | — | — | 18 | 16 | 18 |
| F13-A | 14 | — | — | 16 | 14 | 16 |
| F13-B | 15 | — | — | 17 | 15 | 17 |
| F13-C | 11 (fixed) | — | 11 (fixed) | 17 | 11 (fixed) | 16 |

## Acceptance gates (F13-A primary candidate)

| Gate | Threshold | F13-A | F13-B (ref) | F13-C (ref) |
|---|---|:-:|:-:|:-:|
| Fixed opener length | F13-A=13, others=14 | ✅ 13 | ✅ 14 | ✅ 14 |
| Dynamic phase starts at | slot len+1 | ✅ 14 | ✅ 15 | ✅ 15 |
| D2 target rank | = 1 | ✅ | ✅ | ✅ |
| D3 target rank | = 1 | ✅ | ✅ | ✅ |
| D1 CD pos | ≥ 4.46 | ✅ 4.46 | ✅ 4.46 | ✅ 4.46 |
| D1 CU pos | ≤ 1.40 | ✅ 1.40 | ✅ 1.40 | ✅ 1.40 |
| Persona top-1 | ≥ 52.5% (≥ 64/121) | ❌ 59 (48.8%) | ✅ 66 (54.5%) | ❌ 62 (51.2%) |
| Persona top-3 | ≥ 68.2% (≥ 83/121) | ❌ 81 (66.9%) | ✅ 85 (70.2%) | ✅ 84 (69.4%) |
| Avg Q decreases ≥ 1.0 | ≤ 27.55 | ✅ 26.05 (−2.50) | ✅ 26.97 (−1.58) | ✅ 27.01 (−1.54) |

## Headline findings

### 1. F13-A (the candidate) FAILS by exactly the same margin as V12-B/C

F13-A drops Q1 + Q22 → top-1 collapses to 59/121 (−5.7pp). This **matches V12-B and V12-C exactly** (both also 59/121, both also dropped Q22). The conclusion from this matrix is now unambiguous:

**Q22 (EPS source-trust tie-breaker) is the load-bearing cut.** Every variant that drops Q22 — V12-A, V12-B, V12-C, V12-D, V12-E, F13-A, F13-C — loses 4–10 personas on top-1. Every variant that keeps Q22 retains broad recovery.

Q22 was characterized in the original opener-design comments as a "tie-breaker" but is in fact a load-bearing EPS / categorical-distance signal across many archetypes.

### 2. F13-B is a clean fixed-14 win

Dropping Q1 only — keeping Q22, Q102, both election-metadata items — yields:
- **Top-1: 66/121 = baseline parity (0.0pp)**
- **Top-3: 85/121 = baseline parity (0.0pp)**
- **AvgQ: 26.97 (−1.58 vs baseline)**
- D1/D2/D3 classifications all preserved
- D1 CD/CU preserved exactly
- D1 MOR slips 0.23 toward neutral (not gated, but noted)

This is the safest opener cut found across both matrices. **Recommend Sam consider shipping F13-B as fixed-14.**

### 3. F13-C confirms Q3-fixed cannot rescue a Q22 drop

F13-C (drop Q1+Q22, add Q3 fixed at slot 11) recovers some of F13-A's top-1 loss (59 → 62) but still fails by −3.3pp. Q3's CD-direction probe is not what was being lost — what's being lost is Q22's EPS / categorical signal. Adding more CD evidence cannot fix a missing EPS evidence channel.

## Decision

**F13-A does not pass** (top-1 and top-3 both fail the −2pp gate). Per spec → revert `src/engine/config.ts` to HEAD; commit docs only.

**Strongly recommended follow-up: ship F13-B as fixed-14.** It is the only variant tested across both matrices that achieves full baseline parity on broad recovery while still delivering meaningful AvgQ reduction (−1.58 questions per respondent on average). If Sam wants a shippable cut, this is it.

If Sam wants to push toward fixed-13, the path is: redesign Q22's role (move its EPS tie-breaker function into Q89 or Q11) rather than just dropping it. That's signature/question work, not selector work.

## Files written by this experiment

- `results/eig-selector/fixed13-variant-matrix.md` (this file)
- `results/eig-selector/fixed13-variant-matrix.json`
- `results/eig-selector/fixed13-variant-outputs/F13-{A,B,C}-{dump,persona}.{json,log}`
- `scripts/fixed13-variant-runner.mjs` — runner (untracked; not staged)

## Patch state

`src/engine/config.ts` reverted to HEAD (`a246d96`). No engine, question-config, dist, browser, or output edits in this experiment.

## Terminology check

Canonical terminology only. Engagement is described as a separate 1D continuous variable per ADR canon. Legacy code identifiers appear only as implementation labels.
