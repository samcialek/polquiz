# D1 088-vs-090 attribution audit

**Date:** 2026-05-03 (Terminal-3, read-only audit)
**HEAD:** `0fdf0e1` eig: route q3 as clean cd top-k drill probe
**Scope:** explain why D1 (target 088 Gentle Traditionalist, hardened-fascist persona) still resolves to 090 Hobbesian Guardian after the Q3 top-K patch landed CD closer to Sam's target.
**No engine / question-config / archetype / dist / output / browser edits.**

## TL;DR

The D1 hardened-fascist persona scores closer to **090 Hobbesian Guardian** than to **088 Gentle Traditionalist** on three dimensions, in this order:

1. **CU mismatch (Δ +0.853, dominant)** — 088 has CU=3 (centrist on uniformity); 090 has CU=1 (assimilationist). The hardened-fascist persona answered CU=1.40, exactly matching 090. 088 is 2 pos-units off. **This is an archetype-signature direction issue: "Gentle Traditionalist" is encoded as centrist on cultural uniformity, so a hardened-uniformity persona cannot get close to it on this axis.**
2. **MAT mismatch (Δ +0.402)** — 088 has MAT=3 (mid); 090 has MAT=4 (free-market). Persona landed at MAT=3.76. **090 matches; 088 is 1 unit off.** Same flavor of signature-direction issue.
3. **AES weighting (Δ +0.402)** — 088 has AES sal=2; 090 has AES sal=1. Higher arch-salience amplifies the categorical-mismatch contribution under the weighted scoring formula. (Lossy in this reconstruction — see *Caveats*.)

**Root cause classification:** primarily an **archetype-signature direction issue** (top 1 + 2). Cause 3 is a distance-formula weighting artifact, secondary. The Q3 top-K patch from `0fdf0e1` correctly improved D1's CD (4.38 → 4.46) but **CD is not what was making 090 beat 088** — CU and MAT are.

D1 is in a structurally thin cluster: per memory `project_dump1_ground_truth.md`, 088, 101, 106, 129, 090 all sit within d=0.018 of each other. **The ground-truth target "088" was somewhat arbitrary in the original dump** (engine landed on 088 by margin 0.006 over 101 Embattled). With the under-extremity issue Sam already flagged, 088's centrist CU/MAT make it the *worst* fit in that cluster for a hardened-fascist persona.

## Caveats on this reconstruction

The internal `RespondentState` is module-private in `api.ts`, so this audit reconstructs state from the public `dump-replay.json` (per-node `expectedPos` / `salience` / `touches`) by:

- Building per-node `posDist` as a delta peaked at `round(expectedPos)`.
- Building per-node `salDist` as a delta peaked at `round(salience)`.
- For categoricals (EPS / AES), `catDist` is set uniform `[1/6 × 6]` because the public output doesn't include `catDist` arrays. **This loses categorical signal**, so the AES / EPS contribution numbers in this audit are directionally indicative only — the magnitudes are biased by the uniform fallback.
- `morBoundaries` is not reconstructed (left undefined). The decomposition exercises the legacy-fallback path of `archetypeDistance`, with the per-node MOR/TRB/PF terms still firing. This matches what the live D1 path does today since `state.morBoundaries` only gets populated from question-evidence wiring still in the legacy-fallback regime for this dump.

The reconstructed totals (088 d=0.493, 090 d=0.446) don't match the live scorer's output (088 not in top-5, 090 d=0.384) because of the lossy categorical reconstruction and peaked-vs-soft posDist. **The directional signal — which nodes drive 088 farther than 090 — is robust.** Use the per-node Δ values to attribute, not the absolute totals.

## D1 final state (after Q3 top-K patch)

| Node | touches | expectedPos | salience |
|---|---|---|---|
| MAT | 6 | 3.76 | 1.42 |
| CD | 7 | 4.46 | 2.94 |
| CU | 7 | 1.40 | 2.65 |
| MOR | 6 | 1.40 | 2.86 |
| PRO | 7 | 3.14 | 1.50 |
| COM | 6 | 2.71 | 0.82 |
| ZS | 7 | 4.20 | 2.78 |
| ONT_H | 7 | 1.80 | 2.66 |
| ONT_S | 4 | 3.22 | 2.20 |
| PF | 2 | 4.63 | 2.33 |
| TRB | 4 | 4.39 | 2.22 |
| ENG | 3 | 4.73 | 2.33 |

Live scorer rank: 088 NOT in top-5. Top-5: 090 (0.384), 085 (0.396), 083 (0.406), 087 (0.406), 081 (0.408).

## Per-node distance contribution: 088 vs 090

Sorted by Δ(088 − 090) — positive means 088 pays MORE than 090 there (a "regret" for 088).

| Node | 088 contrib | 090 contrib | Δ(088−090) | 088 template | 090 template | Resp pos/sal | Read |
|---|---:|---:|---:|---|---|---|---|
| **CU** | 1.247 | 0.394 | **+0.853** | pos 3, sal 2, anti `high` | pos 1, sal 2, anti `high` | 1.00/3.00 | 088 mid-pluralist; 090 assimilationist matches persona |
| **MAT** | 0.638 | 0.236 | **+0.402** | pos 3, sal 2 | pos 4, sal 2 | 4.00/1.00 | 088 centrist; 090 pro-market matches persona |
| **AES** | 1.257 | 0.855 | **+0.402** | sal 2 | sal 1 | (uniform) | weighting artifact: 088's higher arch-sal amplifies cat mismatch (lossy in this reconstruction) |
| ZS | 1.064 | 0.894 | +0.170 | pos 3, sal 2 | pos 5, sal 3 | 4.00/3.00 | 090 zero-sum-extreme matches persona's high ZS |
| EPS | 0.933 | 0.896 | +0.037 | sal 1 | sal 1 | (uniform) | ~tied |
| ONT_H | 0.919 | 0.894 | +0.025 | pos 4, sal 1 | pos 1, sal 3, anti `high` | 2.00/3.00 | 090's anti-low fires (resp 1.80 < 2.2) but is offset by direction match |
| PRO | 0.236 | 0.638 | **−0.402** | pos 3, sal 2 | pos 4, sal 2 | 3.00/1.00 | 088 wins: persona PRO=3.14 matches 088's 3 exactly |
| CD | 0.394 | 1.064 | **−0.670** | pos 4, sal 2, anti `low` | pos 5, sal 2, anti `low` | 4.00/3.00 | 088 wins: persona CD=4.46 closer to 088's 4 than to 090's 5 |
| ONT_S | 0.000 | 0.683 | **−0.683** | pos 3, sal 2, anti `high` | pos 1, sal 2, anti `high` | 3.00/2.00 | 088 wins: persona ONT_S=3.22 matches 088's 3 exactly; 090's anti-high fires (1 << resp 3.22 — actually anti:high with respPos > 3.8 doesn't trigger here, but anti distance still) |

Net per-node sum (non-mor): 088 = 7.33, 090 = 7.19, **Δ +0.13** (088 loses by 0.13 on per-node alone). Total reconstructed Δ +0.05 (after weighting normalization).

## Module-level summary

- **morModule contribution:** not exercised in this reconstruction (state.morBoundaries left undefined → useMorModule gate is false → legacy MOR/TRB/PF per-node terms apply). Live runtime may behave the same way for D1; if D1's recorded path doesn't drive `state.morBoundaries` to populated, the gate stays off.
- **per-node sum (continuous + categorical):** 088 = 7.33, 090 = 7.19. Difference dominated by CU + MAT + AES.
- **engagement (ENG):** doesn't appear in the per-node delta because both 088 and 090 templates likely have similar ENG signatures (or 088's `nodes` doesn't include ENG; would need a direct template inspection — out of audit scope). Engagement is structurally separate from the moral-boundary module per canonical terminology and isn't a primary 088-vs-090 driver here.

## Root-cause classification

| Category | Verdict |
|---|---|
| **Archetype 088 / 090 signature issue** | **PRIMARY.** 088's CU=3 and MAT=3 encode it as centrist on dimensions where a hardened-fascist persona naturally lands extreme. 090 is the right "shape" for that persona. |
| **Respondent evidence under/over-shoot** | Secondary. The persona's CU=1.40 and MAT=3.76 are reasonable for a fascist-play; not under-shooting. |
| **Distance-formula weighting issue** | Tertiary. The AES sal=2 amplification on 088 contributes to the gap; would need full categorical reconstruction to quantify exactly. |
| **Missing moral-boundary loading** | Not active in this path (legacy-fallback). Could be — but the dominant CU + MAT signal is independent of the moral-boundary module. |
| **Engagement / participation label** | Not a primary driver here. |
| **Stale dump target expectation** | **Plausible context.** D1's 088 was the engine's pick by margin 0.006 over 101 in a 5-archetype thin cluster (per `project_dump1_ground_truth.md`). "Target = 088" wasn't a strong ground-truth label — more "engine happened to land here at the time." Under current encoding, 090 is arguably a *better* fit for the played persona than 088 ever was. |

## Top 3 causes of the 090 win (ranked)

1. **CU dimension: 088's signature is centrist (pos=3); 090's is assimilationist (pos=1).** Persona answered CU=1.40. Δ ≈ +0.853 in 090's favor. **This single dimension is the decisive driver.**
2. **MAT dimension: 088's signature is centrist (pos=3); 090's is free-market (pos=4).** Persona answered MAT≈3.76. Δ ≈ +0.402 in 090's favor.
3. **AES weighting: 088 has higher AES salience (sal=2) than 090 (sal=1).** When the AES categorical posterior is uncertain (likely here given Sam's "fighter" / "pastoral" play wasn't a clean single-category), the higher sal weight amplifies whatever cat-distance there is. Δ ≈ +0.402 in 090's favor — but magnitude here is biased by the lossy uniform-catDist reconstruction.

## What this implies for next experiments

- **Q3 top-K routing did exactly what it was supposed to do** (improved D1 CD). It correctly does NOT change which archetype wins because CD wasn't the deciding axis.
- **D1 → 088 cannot be recovered by selector / question-routing changes alone.** It requires either (a) re-encoding 088's CU + MAT signature toward the traditionalist end (signature change), or (b) accepting that 090 / 085 / 083 cluster better fits a hardened-fascist persona than the "Gentle" branch of the cluster.
- **The "under-extremity" symptom Sam flagged in the original D1 ground-truth memo** is partly an artifact of 088's encoding being literally "Gentle" — there's no amount of evidence pushing CD higher (the Q3 patch did push it +0.08) that changes the fundamental fact that 088's CU=3 and MAT=3 are centrist.
- **Recommended follow-up (out of this audit's scope):** archetype-side audit on 088 vs the broader hardened-traditionalist cluster (101 Embattled, 106 Militant Partisan, 129 Loyal Republican, 090 Hobbesian Guardian, 081 Heritage Guardian, 083 Closed Traditionalist, 085 Customary Localist, 087 Continuity Conservative). Question: should 088 stay encoded as "Gentle" centrist on CU/MAT, or is the dataset missing a true "Hardened Traditionalist" identifier and 088's role needs renaming/recoding? That's signature work, not selector work.

## Files written by this audit

- `results/eig-selector/d1-088-vs-090-attribution-audit.md` (this file)
- `results/eig-selector/d1-088-vs-090-attribution-audit.json` (machine-readable per-node decomposition)
- `scripts/d1-088-vs-090-audit.mjs` — diagnostic script used to produce the JSON (untracked; not staged)

## Terminology check

No retired model concepts used. "moral-boundary loading" / "moral-boundary module" used where applicable. Engagement described as a separate 1D continuous variable per ADR canon. Legacy code identifiers (`MOR`, `TRB`, `PF`, `CU`, etc.) appear only as implementation labels for nodes / templates.
