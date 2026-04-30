# PR 6.E preflight — legacy MOR/TRB/PF/trbAnchor usage census

Date: 2026-04-30

Read-only enumeration. No code changes. Lists every src/ file that
still references `MOR`, `TRB`, `PF`, or any TRB_ANCHOR variant
(`trbAnchor`, `TRB_ANCHOR`, `TrbAnchor`, `TrbAnchorDist`),
with a suggested cutover PR per file category.

**Runtime-build scope vs total scope.** `npm run build` uses
`tsconfig.runtime.json` which **excludes** `src/test/`,
`src/eval/`, `src/optimize/`, and `src/diagnostics/`. Those
categories don't need to compile clean for 6.E to ship; they can
lag and be cleaned up post-6.H. The actual 6.E hot scope is the
runtime-included files only (engine + browser + historical + global
+ config + types + identity).

## Locked design decisions for 6.E

### 1. Identity-primary resolver: direct rewrite to morBoundaries (not shadow field)

`src/identity/resolveIdentityPrimary.ts` currently reads
`respondentState.trbAnchor.dist`. Decision: re-encode the resolver
in 6.E to read `morBoundaries` directly. Do NOT keep `trbAnchor`
as a shadow field — that would preserve a half-dead ontology in
exactly the place we're removing ambiguity. "Resolver stays active
through 6.G" means the resolver layer stays active, not that it
keeps reading the old field.

Resolver translation guidance:

- Replace `topAnchor(state.trbAnchor.dist)` with top boundary from
  `state.morBoundaries.boundaries`.
- Collapse old `sexual` into `gender`. Use `demo_lgbtq` before
  gender-specific feminist / male-grievance routing.
- Replace old TRB/PF activation gate with `morIntensity` +
  boundary load:
  - latent:    `intensity >= ~1.5`  and top boundary `>= ~0.45`
  - active:    `intensity >= ~2.25` and top boundary `>= ~0.65` plus engagement active
  - dominant:  same as active plus highly engaged
- Keep reason codes stable where possible. `gate.trb / gate.pf`
  becoming `gate.boundaryLoad / gate.intensity` is fine; if UI
  churn is too much, synthesize old-shaped values from the new
  fields for one PR.

The 141-146 archetypes already have morBoundaries set in 6.C, so
the resolver just changes its field source. Resolver removal
still happens in 6.I after 6.H validation.

### 2. era-context weights: max() merge, not sum (and no real rebalancing in 6.E)

`src/historical/contexts-*.ts` files (3 files, ~365 references)
define per-era node weight maps like
`{ PRO: 2.0, MAT: 1.5, PF: 1.3, COM: 1.5 }`. When 6.E removes
PF/MOR/TRB from the engine's node ontology, these weights become
dead string keys.

Decision: remap to a single `morBoundaries` weight slot using
**max() not sum**. Raw sum would over-amplify — e.g., 2016 with
`TRB: 2.0` and `PF: 1.4` summed gives `morBoundaries: 3.4`,
stronger than any single-node weight intended and would silently
rescale elections.

Specific rules:

- `nodeWeights.morBoundaries = max(MOR, TRB, PF)` if any exist.
- `primaryAxis / secondaryAxis / dormant`: remove old MOR/TRB/PF;
  add `morBoundaries` to the strongest bucket present, with
  precedence `primary > secondary > dormant`.
- `candidateActivations` and `threatActivation`: use
  `max(old MOR/TRB/PF activation)`, not sum.
- Defer real rebalancing to 6.H.

Note on scope: `contexts-*.ts` is the older election-context /
turnout machinery. The live vote-distance path uses
`era-activations.json`. So the 6.E goal here is
**compile-clean and semantically conservative**, not re-tuning
elections. Real rebalancing (whether to keep `morBoundaries` as
a single era-weight node or split it into multi-axis weights)
belongs in 6.H or a follow-up election-pipeline pass.

**Total: 109 files, 3669 legacy references.**

## Per-category summary

| category | files | refs | cutover |
|---|---|---|---|
| types-additive | 1 | 37 | 6.E (cleanup deprecated unions; coordinate with resolver) |
| categories-additive | 1 | 9 | 6.E (remove TRB_ANCHORS export) |
| node-defs | 1 | 13 | 6.E (remove MOR/TRB/PF from NODE_DEFS) |
| node-norm-factors | 1 | 7 | 6.E (remove MOR/TRB/PF entries from NODE_NORM_FACTORS) |
| engine | 10 | 123 | 6.E |
| browser-api | 1 | 17 | 6.E |
| election-compute | 1 | 28 | 6.E |
| world-map-compute | 1 | 13 | 6.E |
| era-context | 3 | 365 | 6.E (strip orphaned MOR/TRB/PF era weights) |
| historical-other | 5 | 41 | 6.E (strip arch.nodes.MOR/TRB/PF reads) |
| archetype-data | 1 | 398 | 6.E (drop old MOR/TRB/PF fields) |
| candidate-data | 5 | 477 | 6.E (drop old MOR/TRB/PF fields) |
| regime-data | 5 | 1206 | 6.E (drop old MOR/TRB/PF fields) |
| question-evidence | 2 | 346 | 6.F |
| identity-primary | 1 | 14 | 6.E? (see notes — resolver reads trbAnchor.dist; coordinate with 6.G) |
| eval-diagnostic | 57 | 461 | lag (excluded from runtime build; update post-6.H) |
| test | 12 | 99 | lag (excluded from runtime build; update post-6.H) |
| diagnostics | 1 | 15 | lag (excluded from runtime build; update post-6.H) |


## types-additive — cutover: 6.E (cleanup deprecated unions; coordinate with resolver)

| file | MOR | TRB | PF | trbAnchor | TRB_ANCHOR | TrbAnchor | TrbAnchorDist |
|---|---|---|---|---|---|---|---|
| src/types.ts | 8 | 9 | 8 | 4 | 2 | 4 | 2 |

## categories-additive — cutover: 6.E (remove TRB_ANCHORS export)

| file | MOR | TRB | PF | trbAnchor | TRB_ANCHOR | TrbAnchor | TrbAnchorDist |
|---|---|---|---|---|---|---|---|
| src/config/categories.ts | 3 | 3 | — | — | 1 | 1 | 1 |

## node-defs — cutover: 6.E (remove MOR/TRB/PF from NODE_DEFS)

| file | MOR | TRB | PF | trbAnchor | TRB_ANCHOR | TrbAnchor | TrbAnchorDist |
|---|---|---|---|---|---|---|---|
| src/config/nodes.ts | 3 | 5 | 5 | — | — | — | — |

## node-norm-factors — cutover: 6.E (remove MOR/TRB/PF entries from NODE_NORM_FACTORS)

| file | MOR | TRB | PF | trbAnchor | TRB_ANCHOR | TrbAnchor | TrbAnchorDist |
|---|---|---|---|---|---|---|---|
| src/config/normalization.ts | 3 | 2 | 2 | — | — | — | — |

## engine — cutover: 6.E

| file | MOR | TRB | PF | trbAnchor | TRB_ANCHOR | TrbAnchor | TrbAnchorDist |
|---|---|---|---|---|---|---|---|
| src/engine/update.ts | 1 | 3 | — | 15 | 1 | 5 | — |
| src/engine/config.ts | 7 | 8 | 5 | — | — | — | — |
| src/engine/nextQuestion.ts | — | 9 | — | 5 | 6 | — | — |
| src/engine/selectorEIG.ts | 3 | 6 | — | 7 | 2 | — | — |
| src/engine/updateAvg.ts | — | 1 | — | 13 | 1 | — | — |
| src/engine/math.ts | — | 3 | — | — | — | 4 | 5 |
| src/engine/stateAvg.ts | — | — | — | 2 | — | — | 3 |
| src/engine/archetypeDistance.ts | 1 | 1 | 1 | — | — | — | — |
| src/engine/topKDrill.ts | 1 | 1 | 1 | — | — | — | — |
| src/engine/respondentSignature.ts | — | 1 | 1 | — | — | — | — |

## browser-api — cutover: 6.E

| file | MOR | TRB | PF | trbAnchor | TRB_ANCHOR | TrbAnchor | TrbAnchorDist |
|---|---|---|---|---|---|---|---|
| src/browser/api.ts | 1 | 2 | 2 | 9 | — | — | 3 |

## election-compute — cutover: 6.E

| file | MOR | TRB | PF | trbAnchor | TRB_ANCHOR | TrbAnchor | TrbAnchorDist |
|---|---|---|---|---|---|---|---|
| src/historical/respondentVoteChoice.ts | 4 | 8 | 8 | — | — | 4 | 4 |

## world-map-compute — cutover: 6.E

| file | MOR | TRB | PF | trbAnchor | TRB_ANCHOR | TrbAnchor | TrbAnchorDist |
|---|---|---|---|---|---|---|---|
| src/global/build-alignment.ts | 3 | 5 | 5 | — | — | — | — |

## era-context — cutover: 6.E (strip orphaned MOR/TRB/PF era weights)

| file | MOR | TRB | PF | trbAnchor | TRB_ANCHOR | TrbAnchor | TrbAnchorDist |
|---|---|---|---|---|---|---|---|
| src/historical/contexts-1920-2024.ts | 53 | 58 | 39 | — | — | — | — |
| src/historical/contexts-1856-1916.ts | 45 | 37 | 35 | — | — | — | — |
| src/historical/contexts-1789-1852.ts | 20 | 42 | 36 | — | — | — | — |

## historical-other — cutover: 6.E (strip arch.nodes.MOR/TRB/PF reads)

| file | MOR | TRB | PF | trbAnchor | TRB_ANCHOR | TrbAnchor | TrbAnchorDist |
|---|---|---|---|---|---|---|---|
| src/historical/simulate.ts | 5 | 5 | 7 | — | — | — | — |
| src/historical/validate.ts | 6 | 5 | — | — | — | — | — |
| src/historical/activation.ts | 2 | 2 | 2 | — | — | — | — |
| src/historical/era-activations.ts | 1 | 1 | 2 | — | — | — | — |
| src/historical/regime-alignment.ts | 1 | 1 | 1 | — | — | — | — |

## archetype-data — cutover: 6.E (drop old MOR/TRB/PF fields)

| file | MOR | TRB | PF | trbAnchor | TRB_ANCHOR | TrbAnchor | TrbAnchorDist |
|---|---|---|---|---|---|---|---|
| src/config/archetypes.ts | 136 | 130 | 132 | — | — | — | — |

## candidate-data — cutover: 6.E (drop old MOR/TRB/PF fields)

| file | MOR | TRB | PF | trbAnchor | TRB_ANCHOR | TrbAnchor | TrbAnchorDist |
|---|---|---|---|---|---|---|---|
| src/historical/candidates.ts | 76 | 53 | 53 | — | — | — | — |
| src/historical/elections-1789-1852.ts | 55 | 36 | 35 | — | — | — | — |
| src/historical/elections-1856-1888.ts | 25 | 21 | 21 | — | — | — | — |
| src/historical/elections-1892-1916.ts | 21 | 21 | 21 | — | — | — | — |
| src/historical/elections-1920-1936.ts | 15 | 12 | 12 | — | — | — | — |

## regime-data — cutover: 6.E (drop old MOR/TRB/PF fields)

| file | MOR | TRB | PF | trbAnchor | TRB_ANCHOR | TrbAnchor | TrbAnchorDist |
|---|---|---|---|---|---|---|---|
| src/global/jurisdictions-europe1.ts | 108 | 108 | 108 | — | — | — | — |
| src/global/jurisdictions-americas.ts | 90 | 90 | 90 | — | — | — | — |
| src/global/jurisdictions-asia.ts | 80 | 80 | 80 | — | — | — | — |
| src/global/jurisdictions-europe2.ts | 73 | 73 | 73 | — | — | — | — |
| src/global/jurisdictions-mena.ts | 51 | 51 | 51 | — | — | — | — |

## question-evidence — cutover: 6.F

| file | MOR | TRB | PF | trbAnchor | TRB_ANCHOR | TrbAnchor | TrbAnchorDist |
|---|---|---|---|---|---|---|---|
| src/config/questions.representative.ts | 110 | 91 | 50 | 19 | 4 | — | — |
| src/config/questions.full.ts | 19 | 30 | 19 | — | 4 | — | — |

## identity-primary — cutover: 6.E? (see notes — resolver reads trbAnchor.dist; coordinate with 6.G)

| file | MOR | TRB | PF | trbAnchor | TRB_ANCHOR | TrbAnchor | TrbAnchorDist |
|---|---|---|---|---|---|---|---|
| src/identity/resolveIdentityPrimary.ts | 2 | 5 | 2 | 1 | — | 4 | — |

## eval-diagnostic — cutover: lag (excluded from runtime build; update post-6.H)

| file | MOR | TRB | PF | trbAnchor | TRB_ANCHOR | TrbAnchor | TrbAnchorDist |
|---|---|---|---|---|---|---|---|
| src/eval/cces2016-electorate-bridge.ts | 25 | 28 | 18 | — | 11 | 6 | 4 |
| src/eval/counterfactual-2016-matrix.ts | 11 | 17 | 14 | — | — | 3 | — |
| src/eval/counterfactual-2016.ts | 11 | 11 | 10 | — | — | — | — |
| src/eval/counterfactual-2016-diagnostic-sequence.ts | 5 | 5 | 7 | — | — | — | — |
| src/eval/diagnoseArch021.ts | — | 14 | — | 2 | — | — | — |
| src/eval/baseline-failure-diagnostic.ts | 2 | 6 | 2 | — | 1 | 3 | — |
| src/eval/runAudit.ts | 4 | 4 | 4 | 2 | — | — | — |
| src/eval/diagnose-synthetic-progressive.ts | 4 | 3 | 3 | 1 | — | — | 2 |
| src/eval/harness.ts | — | 1 | — | 8 | 1 | — | 2 |
| src/eval/analyzeStep5.ts | — | 9 | — | 2 | — | — | — |
| src/eval/buildLLMReference.ts | 3 | 4 | 4 | — | — | — | — |
| src/eval/test-identity-primary-resolver.ts | 4 | 1 | 1 | 1 | — | — | 3 |
| src/eval/buildShapleyHtml.ts | 3 | 3 | 3 | — | — | — | — |
| src/eval/mcmc-retake.ts | 2 | 1 | 2 | 2 | — | — | 2 |
| src/eval/test-user-trace-regression.ts | 1 | 1 | 1 | 4 | — | — | 2 |
| src/eval/diagnose-election-pipeline.ts | 2 | 3 | 3 | — | — | — | — |
| src/eval/diagnoseTrb.ts | — | 4 | — | 3 | 1 | — | — |
| src/eval/analyzeFaceValidity.ts | 2 | 1 | 1 | 3 | — | — | — |
| src/eval/diagnose-activation-mechanism.ts | 2 | 1 | 3 | — | — | — | — |
| src/eval/source-reconciled-saturation-diagnostic.ts | 3 | 1 | 2 | — | — | — | — |
| src/eval/test-respondent-vote.ts | 1 | 1 | 1 | 1 | — | — | 2 |
| src/eval/audit-error-tradeoff-polarity.ts | 5 | — | — | — | — | — | — |
| src/eval/diagnostic1-shadow.ts | — | — | — | 3 | — | — | 2 |
| src/eval/populationAdapter.ts | 2 | 2 | 1 | — | — | — | — |
| src/eval/quizDistribution.ts | 2 | 1 | 2 | — | — | — | — |
| src/eval/test-user-election-calibration.ts | 1 | 1 | 1 | — | — | — | 2 |
| src/eval/analyze.ts | — | 2 | — | — | — | 1 | 1 |
| src/eval/diagnose-progressive-walk.ts | 1 | 2 | 1 | — | — | — | — |
| src/eval/diagnoseCoverageGaps.ts | 3 | — | — | 1 | — | — | — |
| src/eval/simulate-opener-random.ts | 2 | 1 | 1 | — | — | — | — |
| src/eval/audit-candidate-signatures.ts | 1 | 1 | 1 | — | — | — | — |
| src/eval/buildLLMSamplePack.ts | 1 | 1 | 1 | — | — | — | — |
| src/eval/compareDeep.ts | — | — | — | 1 | — | — | 2 |
| src/eval/compareSalienceSep.ts | — | — | — | 1 | — | — | 2 |
| src/eval/debug-1876.ts | 1 | 1 | 1 | — | — | — | — |
| src/eval/debug-voter-election.ts | 1 | 1 | 1 | — | — | — | — |
| src/eval/diagnose-candidate-archetype-match.ts | — | — | — | 1 | — | — | 2 |
| src/eval/diagnose-candidates-as-voters.ts | 1 | 1 | 1 | — | — | — | — |
| src/eval/diagnose-election-pipeline-recalibrated.ts | 1 | 1 | 1 | — | — | — | — |
| src/eval/diagnose-nonideological-layer.ts | 1 | 1 | 1 | — | — | — | — |
| src/eval/diagnose-uniform-simulation.ts | 1 | 1 | 1 | — | — | — | — |
| src/eval/era-weighting-flips.ts | 1 | 1 | 1 | — | — | — | — |
| src/eval/era-weights-method-1.ts | 1 | 1 | 1 | — | — | — | — |
| src/eval/harnessAvg.ts | — | — | — | 1 | — | — | 2 |
| src/eval/inspectAvgState.ts | — | — | — | 1 | — | — | 2 |
| src/eval/pre-flip-diagnostic.ts | 1 | 1 | 1 | — | — | — | — |
| src/eval/salienceReach12.ts | — | — | — | 1 | — | — | 2 |
| src/eval/world-alignment-audit.ts | 1 | 1 | 1 | — | — | — | — |
| src/eval/compareEngines.ts | 2 | — | — | — | — | — | — |
| src/eval/diagnose-cu-trb-coverage.ts | — | 2 | — | — | — | — | — |
| src/eval/analyzeStagnancy.ts | — | — | — | 1 | — | — | — |
| src/eval/diagnose-question-signs.ts | — | 1 | — | — | — | — | — |
| src/eval/diagnoseReachability.ts | — | — | — | 1 | — | — | — |
| src/eval/diagnoseShapley.ts | — | — | — | 1 | — | — | — |
| src/eval/fullDistanceMatrix.ts | — | — | — | 1 | — | — | — |
| src/eval/probe-reach2.ts | — | — | — | 1 | — | — | — |
| src/eval/traceStuckSalience.ts | — | — | — | 1 | — | — | — |

## test — cutover: lag (excluded from runtime build; update post-6.H)

| file | MOR | TRB | PF | trbAnchor | TRB_ANCHOR | TrbAnchor | TrbAnchorDist |
|---|---|---|---|---|---|---|---|
| src/test/resolver-smoke.ts | 4 | 12 | 11 | 1 | — | — | 3 |
| src/test/browser-identity-e2e.ts | 7 | 8 | 8 | 2 | — | — | — |
| src/test/question-discrimination.ts | 1 | 1 | 1 | 3 | — | — | 3 |
| src/test/full-diagnostic.ts | — | — | — | 5 | — | — | 2 |
| src/test/simulation.ts | — | — | — | 5 | — | — | 2 |
| src/test/identity-primary-smoke.ts | 1 | 1 | 1 | 1 | — | — | — |
| src/test/semantic-playthrough.ts | 1 | 1 | 2 | — | — | — | — |
| src/test/diagnostic-40k.ts | — | — | — | 1 | — | — | 2 |
| src/test/metadata-hooks-smoke.ts | — | — | — | 1 | — | — | 2 |
| src/test/signal-audit.ts | 1 | 1 | 1 | — | — | — | — |
| src/test/identity-wiring-smoke.ts | — | 1 | 1 | — | — | — | — |
| src/test/results-render-1984-smoke.ts | — | — | 1 | — | — | — | — |

## diagnostics — cutover: lag (excluded from runtime build; update post-6.H)

| file | MOR | TRB | PF | trbAnchor | TRB_ANCHOR | TrbAnchor | TrbAnchorDist |
|---|---|---|---|---|---|---|---|
| src/diagnostics/questionInfo.ts | — | 4 | — | 5 | 4 | — | 2 |
