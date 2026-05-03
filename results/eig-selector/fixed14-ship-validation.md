# Fixed-14 opener — ship validation

**Date:** 2026-05-03 (Terminal-3)
**HEAD before:** `101f46b` eig: clean q22 hollow touch and audit derivation path
**Patch:** `src/engine/config.ts` — drop Q1 (`political_content_frequency`) from `CORE_OPENER`. CORE shrinks 10 → 9; `SALIENCE_ROUTER_FIXED` shrinks 15 → 14.
**Source of recommendation:** `results/eig-selector/fixed13-variant-matrix.md` F13-B (the only variant across both fixed-12 and fixed-13 matrices that achieved full baseline parity on broad recovery).

## Live opener sequence (14)

| Slot | qid | Role |
|---:|---:|---|
| 1  | 200 | party identification — partyID metadata for election compute |
| 2  | 103 | issue salience screener — global salience router (priorityBattery) |
| 3  | 97  | political thought frequency — PF / ENG position |
| 4  | 60  | politically important identities — TRB anchor |
| 5  | 89  | epistemic style battery — EPS category + salience |
| 6  | 22  | source trust conflict — EPS tie-breaker (load-bearing for top-1) |
| 7  | 218 | aesthetic style ranking — AES category + salience |
| 8  | 211 | strategic voting — vote-prediction metadata |
| 9  | 212 | negative partisanship — vote-prediction metadata |
| 10 | 93  | priority sort opener — broad MAT/CD/CU/MOR/PRO/COM position+salience |
| 11 | 102 | membership criteria priority sort — civic-nationality screen |
| 12 | 209 | zero-sum economics view — direct ZS position read |
| 13 | 210 | human malleability view — direct ONT_H position read |
| 14 | 214 | institutions foundational — direct ONT_S position read |

Dynamic phase (TOP_K_DRILL → EIG_FILL) starts at slot 15.

## Before / after

| Metric | Baseline (15-q) | Fixed-14 | Δ |
|---|---:|---:|---:|
| Opener length | 15 | **14** | −1 |
| Dynamic phase starts at | slot 16 | slot 15 | −1 |
| **D1** target 088 — match (rank) | 090 (−1) | 090 (−1) | unchanged |
| **D1** Q total | 29 | 26 | −3 |
| D1 CD pos / sal | 4.46 / 2.94 | 4.5 / 2.94 | unchanged |
| D1 CU pos / sal | 1.40 / 2.65 | 1.4 / 2.65 | unchanged |
| D1 MOR pos / sal | 1.40 / 2.86 | 1.6 / 2.81 | +0.2 (slight neutral drift) |
| **D2** target 056 — match (rank) | 056 (1) | 056 (1) | unchanged |
| D2 Q total | 33 | 31 | −2 |
| **D3** target 011 — match (rank) | 011 (1) | 011 (1) | unchanged |
| D3 Q total | 32 | 31 | −1 |
| **Persona top-1** | 66/121 (54.5%) | 66/121 (54.5%) | **0.0pp** |
| **Persona top-3** | 85/121 (70.2%) | 85/121 (70.2%) | **0.0pp** |
| **Avg Q answered** | 28.55 | 27.00 | **−1.55** |

Avg-Q delta matches the F13-B prediction (−1.58) within rounding.

## Acceptance gates

| Gate | Threshold | Result |
|---|---|:-:|
| D1 not worse than baseline (090 rank −1 acceptable) | rank ≥ baseline | ✅ unchanged |
| D2 target rank | = 1 | ✅ |
| D3 target rank | = 1 | ✅ |
| Persona top-1 | within previous gate (≥ 52.5%) | ✅ 54.5% (0.0pp) |
| Persona top-3 | within previous gate (≥ 68.2%) | ✅ 70.2% (0.0pp) |
| Avg Q decreases by about 1.5 | ≈ −1.5 | ✅ −1.55 |
| Terminology grep clean | no matches | ✅ |
| No engine-selector / dist / output / live-data edits | scope guard | ✅ |

## D1 MOR drift note

D1 MOR slipped from 1.40 → 1.60 (sal also 2.86 → 2.81). This is the same pattern flagged in `fixed13-variant-matrix.md`: dropping Q1 reduces an indirect MOR position-evidence channel that only partially gets compensated by dynamic-phase questions. It is not a gated regression (D1 088 was already rank −1 baseline; per `d1-088-vs-090-attribution-audit.md` the D1 miss is a profile-distance / target-expectation issue, not a selector issue), and the broad persona-replay shows zero impact. Flagged here so it doesn't get rediscovered as a regression in the next live trace.

## Patch details

```diff
- // (15 questions) followed by salience-gated top-K drilling and EIG-fill.
+ // (14 questions) followed by salience-gated top-K drilling and EIG-fill.
- // CORE_OPENER (10) — establish salience for every node, capture metadata.
+ // CORE_OPENER (9) — establish salience for every node, capture metadata.

  export const CORE_OPENER: readonly number[] = [
    200, // party identification — partyID metadata for election compute
    103, // issue salience screener — global salience router (priorityBattery)
-   97,  // political thought frequency — PF / ENG activation
-   1,   // political content frequency — ENG activation reinforcement
+   97,  // political thought frequency — PF / ENG position
    60,  // politically important identities — TRB anchor
    89,  // epistemic style battery — EPS category + salience
-   22,  // source trust conflict — EPS tie-breaker
+   22,  // source trust conflict — EPS tie-breaker (load-bearing for top-1)
    218, // aesthetic style ranking — AES category + salience
    211, // strategic voting — vote-prediction metadata
    212, // negative partisanship — vote-prediction metadata
  ] as const;
```

The retired Q1 comment line and the Q97 comment were both updated to use canonical terminology — engagement is a separate 1D continuous variable per ADR canon.

## Files touched

- `src/engine/config.ts` — opener patch + comment hygiene
- `results/eig-selector/fixed14-ship-validation.md` — this note

## Terminology check

Canonical terminology only. Engagement is described as a separate 1D continuous variable per ADR canon. Legacy code identifiers (`MOR`, `EPS`, `Q1`, `Q22`, etc.) appear only as implementation labels.
