# ADR-001 — Scoring Layer: Euclidean Winner-Take-All

**Status:** Superseded by ADR-003 on 2026-04-17 — premise rejected per Diagnostic 1 (`results/phase3/diagnostic-1-uniform-priors.md`). Priors were uniform across the codebase's full git history and cancel under softmax normalization; the 86.8% → 45.5% drop is attributable to the scoring-function swap, not priors elimination. Rollback documented in `results/architecture/ADR-003-rollback-scoring.md`.

## Context

Step 4 eval returned 89% top-1 at σ=0 and 78% at σ=0.5, but with a mean credible set of 58 of 118 archetypes — posteriors were diffuse and largely invariant to noise. Family-pair calibration (42.9% / 52.7% / 32.4%) was well below the ≥95% target across all three measured pairs.

Step 5 found TRB anchor effectively non-functional (3.3% variance reduction despite ~8 touches per run). Step 2a investigation discovered the reason: `archetypes.ts` contains zero `trbAnchorPrior` entries, so every ranking scorer returns 0 on the prior product `archWeight * weight`. Priors were load-bearing for scoring in a way no one had specified.

The concrete fragility (surfaced in the 141-146 investigation): when the ranking scorer multiplies `archWeight * weight` for the picked anchor, the gap between an identity-primary archetype and a non-identity archetype sharing a secondary-anchor lean is too small to reliably discriminate. Specifying priors densely enough to discriminate across 118 archetypes × 9 anchors (≈1,062 anchor params) plus per-node priors brings the total to roughly 10,000 parameters — an elicitation task of that scale has no calibration source. Euclidean scoring avoids this entirely.

## Decision

Replace softmax-of-distance archetype scoring with weighted Euclidean distance, winner-take-all assignment. Report top-k by distance for UI.

**Retained:** per-node Bayesian update layer. It is load-bearing for adaptive question selection in `src/engine/nextQuestion.ts` and is independent of the archetype-layer change.

## Consequences

- Lose probabilistic archetype posterior. (It was diffuse anyway — mean credible set 58/118.)
- Lose current family-pair detection mechanism. (It was broken anyway — 32–53% vs ≥95% target.)
- Eliminate per-archetype priors entirely: the `prior` and `trbAnchorPrior` fields become dead.
- Rework adaptive selectors in `nextQuestion.ts` that consumed archetype posteriors.
- Require replacement family-detection. Candidate: signature-distance-based — pre-compute 118×118 archetype signature distance matrix, call pairs below the 10th percentile "families," emit family flag only when top-2 is in top-1's family list.

## Rejected alternatives

- **Softmax-of-distance with uniform priors.** Still produces a diffuse posterior (uniform priors do not fix likelihood diffusion), still requires softmax+temperature machinery, removes only the prior-specification burden. Does not address the underlying fragility.
- **Naive Bayes at archetype layer** (sum of per-dimension log-likelihoods, normalize). Keeps Bayesian machinery at the archetype layer and requires per-dimension likelihood functions to be specified per archetype. Moves the specification burden rather than eliminating it — retains the 15,000-parameter problem in different form.

## Open questions

- Distance weighting: uniform across 14 nodes, salience-weighted per-archetype, or inverse-variance-weighted by respondent's final node posteriors?
- Family-detection percentile threshold (10th is a placeholder).
- Top-k value for reporting (current quiz reports top-5).

## Methodological note (added with supersession)

Before committing to the replacement architecture, a diagnostic testing the motivating premise (running the old scorer with uniform priors) should have been run first. That diagnostic was only run as part of the ADR-003 investigation and would have prevented this decision if run earlier. Future ADRs motivating architectural change by naming a load-bearing component should validate that premise empirically before the architectural work begins.
