# Mapper Coverage Gap Report — v0

**Date:** 2026-05-02
**Authors:** Terminal One (this terminal), as documentation. Terminal Two owns the survey-to-PRISM mapper itself; this report inventories where that mapper is structurally weak so the simulator + audit work can interpret coalition gate failures correctly.
**Inputs read:**
- `results/electorate/mapping/survey-to-prism-v0.json` (A2)
- `results/electorate/mapping/survey-to-prism-v0.md` (A2 prose)
- `results/electorate/intake/variable-catalog-v0.json` (A1)

**Scope:** modern survey-era (2008–2024). Pre-2008 coverage is out of scope for this v0 report.

**Terminology.** Identity-driven appeal is read through **moral-boundary salience** and **moral-boundary loading**. Legacy `PF` / `TRB` fields visible in source code are inert and not active model concepts. **Engagement** is a one-dimensional scalar separate from policy alignment; never called activation.

---

## Coverage rollup

Ratings sourced from `survey-to-prism-v0.json:targets[*].coverage`. Rolled-up grade is the WEAKEST cumulative source available without falling back to era-specific items only (which limits which years can be backtested).

| PRISM target | CES cum | CES yr | ANES cum | ANES yr | Roll-up grade | Uncertainty floor |
|---|---|---|---|---|:--:|:--:|
| MAT (material) | proxy | strong | strong | strong | **strong** | low |
| CD (cultural direction) | weak | strong | strong | strong | **strong** | low–medium |
| CU (cultural uniformity) | weak | strong | proxy | strong | **strong** | low–medium |
| MOR (moral circle) | weak | derived | derived | derived | **derived** | medium–high |
| PRO (proceduralism) | **missing** | weak | proxy | weak | **weak** | high |
| COM (compromise tolerance) | **missing** | **missing** | weak | weak | **near-absent** | high |
| ZS (zero-sum) | weak | derived | derived | strong | **partial** (ANES yr only) | medium |
| ONT_H (human malleability) | **missing** | **missing** | derived | proxy | **near-absent** | high |
| ONT_S (institutional capacity) | weak | derived | strong | strong | **strong** (ANES side) | low–medium |
| EPS (epistemic style) | missing | derived | derived | proxy | **weak** | high |
| AES (aesthetic style) | — | — | — | — | **absent (all sources)** | maximal |
| moral-boundary salience (avg) | proxy | derived | strong | strong | **moderate** | medium (per boundary) |
| moral-boundary `political_camp` | strong | strong | strong | strong | **strong** | low |
| moral-boundary `national` | weak | proxy | strong | strong | **strong (ANES)** | medium |
| moral-boundary `class` | proxy | derived | derived | proxy | **weak** | high |
| moral-boundary `religious` | strong | strong | strong | strong | **strong** | low |
| moral-boundary `ethnic_racial` | proxy | derived | strong | strong | **strong (ANES)** | medium |
| moral-boundary `gender` | proxy | derived | strong | strong | **strong (ANES)** | medium |
| moral-boundary `ideological` | proxy | derived | strong | strong | **strong (ANES)** | medium |
| engagement (one-dim scalar) | proxy (interest+turnout-hx) | proxy | proxy | proxy | **moderate** | medium |

---

## Hard gaps (the things the mapper genuinely cannot resolve well)

### 1. AES — absent in all sources

No standard battery in CES or ANES asks about a respondent's preferred political voice / aesthetic register. The 6 AES categories (statesman, technocrat, pastoral, authentic, fighter, visionary) cannot be inferred from issue items.

- **Failure mode in C3/C4 outputs.** Stylistic-decisive elections (2016 / 2020 / 2024 era-elevated by `STYLE_DRIVEN_ELECTIONS` multiplier) will produce coalition gate failures concentrated where AES is decisive — typically white-non-college (fighter affinity) and college-educated suburbanites (statesman affinity). The error reporter will likely tag these as `mapper_error` with `candidate_signature_error` close behind; both may be partially correct but the underlying issue is AES posterior is essentially flat.
- **Do not address by overfitting.** The fix is upstream (add AES proxy items to the panel, or accept high uncertainty and let the categorical posterior stay flat) — not by tweaking candidate AES coding to compensate.

### 2. COM — near-absent

CES doesn't measure compromise tolerance directly. ANES has weak proxies (party-loyalty items, candidate-quality items rated on a "willing to compromise" axis) but no clean COM battery.

- **Failure mode.** COM doesn't usually drive vote-choice decisions strongly, so backtest-level errors tend to be small. But COM is part of the salience-weighted distance; a flat COM posterior centered at 3 means the contribution to candidate distance is approximately zero for everyone. That can mute real candidate differentiation when COM is the deciding axis (rare but real — e.g., when both candidates agree on issues but differ on willingness to deal).

### 3. ONT_H — near-absent

CES is silent on human-malleability worldview. ANES yields it derivable from culturally-coded items (parenting / character / education-philosophy items) only as a proxy.

- **Failure mode.** ONT_H rarely drives modern-election vote choice directly, but it correlates with educational liberalism vs. traditionalism. Errors here typically express as misclassification within the white-college vs white-non-college cell.

### 4. Moral-boundary salience and loading — highest-risk derived inference

The 7-boundary moral-circle module is mostly derived/proxied from CES and is mostly strong on the ANES side. **`class` boundary is the weakest** across all sources (proxy/derived/derived/proxy). The `political_camp` and `religious` boundaries are the strongest.

- **Failure mode.** Coalition gate failures on cells defined by class identity (working-class, union, non-college) — both racial-coalition cells (white-non-college, multi-racial working class) and economic cells — will most often trace to `moralBoundaries.class` mis-loading. The error reporter will cite `mapper_error` + `vote_formula_error` as joint hypotheses for white-non-college failures; the dominant culprit is usually class-loading mis-resolution rather than the vote formula.
- **Highest-risk because it cascades.** A single mis-loaded boundary changes the morBoundary distance term in `respondentVoteChoice`, which shifts vote choice for any agent with that boundary's salience > 0. So a single mapper bug here can reshape the entire racial-coalition output.

### 5. Engagement vs turnout separation

Engagement is a one-dimensional scalar (range 0–10, separate from policy alignment) that drives the per-agent abstention clearing-bar in `respondentVoteChoice`. It is NOT activation; the mapper must keep it disjoint from policy salience.

- **Risk: conflation.** Survey items asking about political "interest" can be read as both engagement (likelihood-to-vote signal) and salience (how-much-this-matters signal). The mapper spec is clear that they're separate, but in practice many CES interest items co-load with partisan strength. The mapper must avoid mapping high partisan strength → high engagement just because they correlate.
- **Failure mode.** Turnout-rate misses across many subgroups simultaneously, especially asymmetric (one party turning out disproportionately) — that's the signature of a broken engagement mapper. The error reporter will tag `turnout_model_error` + `mapper_error` (engagement); the latter is usually correct.

---

## Individual-measurement gaps vs poststratification / geography gaps

Strict separation per the architecture: **CES / ANES are individual political mappers; ACS is poststratification only; Esri is optional geography enrichment.** The mapper coverage gaps above are individual-measurement gaps. Geography gaps are a separate axis.

| Gap class | Examples | Fixed by |
|---|---|---|
| **Individual measurement** | AES, COM, ONT_H absent. Moral-boundary `class` weak. | Adding survey items, accepting wider posteriors, building proxy bridges with stated uncertainty. NEVER fixed by ACS / Esri. |
| **Poststratification** | Subgroup population shares for the year being backtested. | ACS demographic poststratification weights. |
| **Geography** | State / county / block-group composition of the synthesized electorate. | Esri Tapestry (optional, paid) or ACS-only fallback. |

If a coalition gate failure suggests "the model thinks Black voters are 8% of the electorate when they were actually 12%", that's a **poststratification gap**, not a mapper gap. Fix by re-weighting, not by retraining the mapper.

If a coalition gate failure suggests "the model gets the right Black voter share but wrong Black voter D/R split", that's a **mapper gap** — the mapper is mis-inferring the per-respondent signature for Black voters. Fix by inspecting moral-boundary loading + culturally-coded item mappings.

---

## What each gap looks like in C3 / C4 outputs

| Gap | Most likely C3 (gate) failure | Most likely C4 (reporter) diagnosis |
|---|---|---|
| AES absent | Style-driven year (2016/2020/2024) misses white-non-college (fighter) or college-educated cells (statesman) | `mapper_error` (high) + `candidate_signature_error` (medium) |
| COM near-absent | Rarely shows; possibly suburban-moderate cells in landslide elections | `mapper_error` (low) + `vote_formula_error` (low) |
| ONT_H near-absent | White-college vs non-college misclassification on cultural-traditionalism axis | `mapper_error` (medium) |
| Moral-boundary `class` weak | White-non-college, union, multi-racial-working-class cells; especially in realignment elections | `mapper_error` (high) + `vote_formula_error` (medium) — true cause typically class-loading mis-resolution |
| Engagement-vs-salience conflation | Multiple subgroups missing turnout simultaneously, asymmetric by party | `turnout_model_error` (high) + `mapper_error` (medium) |
| Moral-boundary `political_camp` over-weighting | Weak Democratic / Republican leaners voting too strongly with their inferred camp | `vote_formula_error` (medium) — but actually mapper over-resolution |

---

## Do not overfit

When **NOT** to revise the mapper based on a coalition gate failure:

1. **Single-cell miss in a year with known candidate-coding flag.** If the 2024 audit already says "Trump 2024 morBoundaries.class is too low" and the gate fails on white-non-college 2024, the candidate signature is the immediate cause. Revise candidate coding first; do not blame the mapper.

2. **Failure on a cell with high uncertainty floor.** If the coverage rollup grades the relevant target as `weak` or `near-absent` (AES, COM, ONT_H), expect failure and don't tighten the mapper to chase it. Uncertainty propagated faithfully through to the C2 decomposition is the honest behavior.

3. **Failure on a single subgroup while all others pass.** A single-cell failure where the rest of the coalition is correct usually means a subgroup-specific demographic-tag problem, candidate-coding problem, or sample-size issue — not a global mapper bug. Revising the mapper risks degrading the cells that already pass.

4. **Failure with delta within 1.5x tolerance.** That's a `minor` severity per C4. Don't revise on minors; gather more data points first. Revising on minors is how mappers fossilize toward yesterday's election.

5. **Failure where C4's top-level hypothesis is `benchmark_or_coverage_issue`.** Fix the benchmark or the demographic-tagger first; the mapper isn't broken if the benchmark is misaligned with the tagger's subgroup definitions.

6. **Failure across many cells with the SAME directional sign (all D over-predicted, all R over-predicted).** That's a candidate-signature problem, not a mapper problem. The candidate is systematically over-attractive across the electorate. Revise candidate coding; do not revise the mapper to compensate (which would corrupt every other election).

The general principle: **mapper revisions should only happen when the failure pattern is (a) consistent across MULTIPLE coalitions, (b) tied to a target with `weak` or `derived` coverage, and (c) NOT explained by candidate-coding audit flags or poststratification mismatch.** Anything else, fix downstream.

---

## Targets sorted by gap risk (worst first)

1. **AES** — absent everywhere. Highest gap.
2. **COM** — near-absent. High gap.
3. **ONT_H** — near-absent. High gap.
4. **moral-boundary `class`** — weakest of the 7 boundaries. High gap (cascading).
5. **EPS** — weak / derived. Medium gap.
6. **MOR** — derived from culturally-coded items. Medium gap.
7. **PRO** — weak in CES, proxy in ANES. Medium gap.
8. **engagement** — moderate, conflation risk. Medium gap.
9. **moral-boundary `national`, `ethnic_racial`, `gender`, `ideological`** — strong on ANES, weaker on CES. Low–medium gap.
10. **MAT, CD, CU, ONT_S, moral-boundary `political_camp` and `religious`** — strong. Low gap.

---

## What this report does NOT do

- It does NOT recommend any change to the mapper spec (Terminal Two owns that).
- It does NOT recommend any candidate-signature edits (those live in audit flags).
- It does NOT alter benchmark targets or tolerance thresholds.
- It does NOT define a fitting target — gate failures are diagnostic, not calibration goals.
