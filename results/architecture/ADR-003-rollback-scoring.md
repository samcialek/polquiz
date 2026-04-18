# ADR-003 — Rollback the Euclidean-WTA Scorer

**Status:** Accepted, 2026-04-17. Supersedes ADR-001 (scoring layer).

## Context

ADR-001 replaced softmax-of-distance scoring with a weighted-Euclidean
winner-take-all scorer on the premise that per-archetype priors were
load-bearing and their specification was intractable (~10,000 params). The
Phase-3 baseline under the new scorer produced **55 / 121 = 45.5%** top-1
deterministic recall, down from **105 / 121 = 86.8%** at post-3b. The
Phase-3h summary framed that drop as "the expected and intended consequence
of eliminating per-archetype priors."

Diagnostic 1 (`results/phase3/diagnostic-1-uniform-priors.md`) tested that
premise with a non-destructive shadow harness. It re-scored the Phase-3
selector's final states four ways:

| variant | top-1 |
|---|---|
| A — new WTA argmin                       | 55 / 121 (45.5%) |
| B — OLD scalar distance, argmin          | 98 / 121 (81.0%) |
| C — OLD + softmax + **uniform** priors   | 98 / 121 (81.0%) |
| D — OLD + softmax + **actual** priors    | 98 / 121 (81.0%) |

**B = C = D byte-identical.** Uniform priors cancel under softmax
normalization, and the codebase's actual priors have always been uniform
(`1/N` for all active IDs across full git history; `trbAnchorPrior` never
populated — H3 confirmed in `results/trb-fix/diagnosis.md`). ADR-001's
premise is mechanically false: priors contributed zero to the Phase-3
ranking they were claimed to underwrite.

Diagnostic 3 localized the damage: the +10 fixed anti penalty is uncalibrated
against position contributions (0–4 post-sqrt per continuous node), so any
anti misfire dominates ~5 nodes of real position signal. Targets with many
anti flags are systematically routed to centroid-shaped confounders (005,
125, 103, 112, 086 absorb 24 of 43 WTA-only losses). Diagnostic 2 confirmed
the categorical implementation is spec-correct and not the issue. Diagnostic
4 showed the selector/stop-rule change contributes only 5.8 pp of the 41.3
pp drop; the scorer is 86% of the problem.

## Decision

Roll back the scoring layer to the pre-ADR-001 weighted scalar-distance
argmin scorer. Do **not** reinstate `prior` or `trbAnchorPrior` fields —
they were always dead and stay dead. Preserve every other Phase-3 change
(ENG migration, hollow-touch drops, selector/stop-rule rework,
engagementLabel module, resolveIdentityPrimary, archetypeFamilies
signature-distance detection, reconciliation tool).

The rejected WTA implementation is preserved at
`src/engine/archetypeDistanceWTA.ts` with an ADR-003 header comment so
future work can see what was tried and why it failed.

## Consequences

- **Expected top-1: ~81%** (Diagnostic 1 variant B) — ceiling of the old
  scoring math running against the new engine's answer sequences. Below
  the 86.8% post-3b headline because the new selector stops ~12 Q earlier
  per run (Diagnostic 4). Acceptable trade.
- No posterior is restored. Family detection stays on signature-distance.
- ADR-002 (ENG migration) is **unaffected** and remains in effect.
- Stage-4 now absorbs two residual items: the 23 "deep losses" that fail
  under both scorers (node-discrimination limit), and the Phase-3 min-Q
  stop-rule calibration (fires at Q=25 for 44% of runs at 49% win rate).

## Rejected alternatives

- **Recalibrate the WTA scorer rather than roll back.** Rejected because
  Diagnostic 3's centroid-absorption finding identifies the failure as
  structural to WTA-in-Euclidean-13D, not parameter miscalibration. The
  +10 anti penalty is *a* symptom; the deeper issue is that weighted
  Euclidean geometry rewards low-commitment "flat" signatures — archetypes
  005, 125, 103, 112, 086 are nearest-neighbor to everything because they
  have broad moderate coverage, and WTA's argmin hands them targets that
  live farther out on the axes. Any fix that preserves WTA geometry (tune
  the anti penalty, reweight nodes, normalize by signature norm) hits the
  same centroid-attractor problem with different numbers — D3 documents
  56% of WTA-only losses routing to the same five centroids, and that
  concentration is geometric, not penalty-driven. Any fix that adds
  smoothing on top of Euclidean (confidence band, posterior-weighted
  ensemble, top-k blending) is functionally equivalent to the old scorer's
  softmax-of-distance — at which point the simpler path is to restore the
  old scorer directly, which is what this ADR does.
- **Hybrid scorer (Euclidean position, scalar categorical).** Still bleeds
  the anti-penalty calibration problem into an untested combination. No
  baseline to aim at.
- **Accept 45.5% as the new baseline.** Rejected by D1 — the 81% ceiling
  with the old math is unambiguous evidence of recoverable signal.

## Rollout

Five-part rollback (`results/architecture/roadmap.md` Stage 2 revised):
(1) diagnostics written; (2) ADRs updated; (3) code rollback
(`archetypeDistance.ts` restored, WTA preserved as `archetypeDistanceWTA.ts`,
`browser/api.ts` call site restored); (4) regression — accept at ≥75%, halt
and report otherwise; (5) doc cleanup (retract phase-3h "expected and
intended" line, update CLAUDE.md).
