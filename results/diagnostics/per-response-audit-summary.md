# Per-Response Evidence Audit — Summary

**Date:** 2026-05-19
**Spec:** HARNESS-HANDOFF.md §5.5

## What was audited

For every (question, option/bucket/item, evidence node) row across all 106 questions in `src/config/questions.representative.ts`, `scripts/audit-per-response.mjs` computes:

- Evidence shape (continuous pos/sal, categorical cat/probs/sal, trbAnchor keys, moralCircle universal/scoped scalar)
- Distribution properties (peak, max value, hollow-vs-uniform)
- Whether the evidence's target node is declared in `touchProfile` with a matching role

Total: **883 evidence rows** inventoried. Full inventory in `per-response-inventory.json`; per-row router-slice table in `per-response-audit-router-slice.md`.

## What was found (Phase 1)

**94 mechanical flags**, all of one code: `EVIDENCE_NOT_IN_TOUCHPROFILE`. Breakdown:

| Class | Count | Pattern |
|---|---:|---|
| MORAL_CIRCLE missing | 93 | 18 questions emit `moralCircle.universal` or `moralCircle.scopedAffinities` evidence but never declare a `MORAL_CIRCLE` touch in `touchProfile` (only Q229 did). |
| AES.cat missing on Q77 | 1 | Q77.`gut_feeling` option emits sharp AES.cat evidence (peak=4@0.70) but Q77's touchProfile lists only EPS. |

**Mechanical findings — clean:**
- 0 hollow distributions (older audit's H4-pattern already cleaned)
- 0 sign-error candidates discoverable mechanically (distributions structurally well-formed)

## Root cause

The 93 MORAL_CIRCLE flags are a single architectural drift. ADR-007 (2026-05-05) wired the new moral-circle evidence emission path through `rankingMap`/`sliderMap`/`optionEvidence` across 18 questions, but did NOT propagate the corresponding `MORAL_CIRCLE` touchProfile declarations. The only question with the declaration was Q229 (the original ADR-007 model).

Impact: `selectorEIG.touchInfoGain` *does* implement MORAL_CIRCLE scoring (`src/engine/selectorEIG.ts:152`), but it only runs when a `MORAL_CIRCLE` touch appears in the question's touchProfile. So for Q60, Q102, Q230, Q231, Q232-Q238 etc., the EIG selector was blind to the moral-circle signal those questions deliver — the questions were under-scored relative to their actual information content.

Two distinct sub-patterns:

1. **Stale legacy-pointer questions** (Q230, Q231, Q232-Q238): their touchProfile pointed at a hollow legacy node (Q230/Q231 → `MOR`; Q232-Q238 → `TRB_ANCHOR`) where no evidence is actually emitted. Pure dead declarations, doubly wrong.

2. **Mixed-touch questions** (Q8, Q60, Q82, Q98, Q102, Q201, Q203, Q204, Q206, Q213): valid existing touches for other nodes (CD, CU, MOR, TRB, etc.), with moral-circle evidence emission silently added without updating touchProfile.

## What was applied (Phase 2)

`scripts/apply-moral-circle-touches.cjs` made two transforms:

1. **REPLACE** the hollow legacy entries on Q230, Q231, Q232, Q233, Q234, Q235, Q236, Q238 with `{ node: "MORAL_CIRCLE", kind: "derived", role: "affinity", weight: 0.10, touchType: ... }`. Drops 8 dead touches; adds 8 live ones.

2. **INSERT** a MORAL_CIRCLE.affinity touch (same shape, weight 0.10) into the existing touchProfile arrays of Q8, Q60, Q82, Q98, Q102, Q201, Q203, Q204, Q206, Q213. Plus added an AES.category touch to Q77 (weight 0.10) for the `gut_feeling` option's authentic-AES signal.

Weight choice: **0.10** matches Q229's existing precedent (the only previously-correct declaration). Conservative — gives the selector enough signal to credit the moral-circle dimension without over-weighting it relative to position touches.

## Post-fix audit state

| Metric | Before | After |
|---|---:|---:|
| Total flags | 94 | 12 |
| Router-slice flags | 20 | 0 |
| Non-router flags | 74 | 12 (all Q228, retired) |

Remaining 12 flags are all on **Q228** which is retired (`exposeRules.eligibleIf: ["__retired__"]`). Dead code; left alone.

## Verification

- `npm run build` — clean
- `npx tsx src/test/opener-smoke.ts` — 15/15 fixed router items reached
- `npx tsx src/test/opposehigh-dryrun.ts` — MAGA-tribalist universalAffinity=27.5; IDP gate passes; identical to pre-fix output
- `npm run diagnose:personas` — 10/10 personas ran without crashes; vote tallies plausible

**Behavioral change observed (expected and correct):** in opener-smoke, the adaptive phase now selects moral-circle questions (Q230, Q231, Q232-Q236) earlier than before, and additionally reaches Q203/Q204/Q206/Q213/Q82 that the previous selection left unreached. This is the EIG selector correctly responding to the newly-credited moral-circle signal in those questions' touchProfiles.

## What's NOT yet done

Phase 1 surfaced the structural touchProfile bug. The §5.5 spec also calls for manual annotation across four judgment dimensions:

1. **SIGN correctness** — does each option's evidence direction match the option's text? (e.g., an option labeled "strong free-market" should push MAT toward 5, not toward 1)
2. **MAGNITUDE calibration** — is each option's evidence as strong as it justifiably could be, neither under-pulling nor over-pulling?
3. **CROSS-OPTION SYMMETRY** — within a question, are extreme-A and extreme-B options mirror-images of each other in pull strength?
4. **SALIENCE-vs-POSITION discipline** — questions with `role: "salience"` shouldn't accidentally write position, and vice versa.

These four dimensions require reading prompt text and option labels. Mechanical detection isn't sufficient. The audit script outputs the inventory in JSON, which can drive a focused manual review pass — recommended slicing: do the 15 router questions first (`per-response-audit-router-slice.md`), then expand to the 76 EIG-pool questions, then the 15 conditional/late questions.

Estimated effort: ~1 focused session per slice; ~3 sessions total to complete §5.5.

## Outputs

| File | Purpose |
|---|---|
| `scripts/audit-per-response.mjs` | Audit script; re-run anytime |
| `scripts/apply-moral-circle-touches.cjs` | One-shot transform; can be deleted after commit |
| `results/diagnostics/per-response-inventory.json` | Full row-level inventory (883 rows) |
| `results/diagnostics/per-response-audit-router-slice.md` | Router-slice per-question evidence tables |
| `results/diagnostics/per-response-audit-summary.md` | This document |
