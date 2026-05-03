# Phase 2.4 — Turnout / Abstention Calibration Plan

**Date**: 2026-05-03
**Status**: Design plan only. **No engine code changed.** No mapper implementation. This converts the Phase 2.3 observed-survey aggregate finding into a concrete two-stage calibration plan that the upcoming mapper-backed backtest will follow.

**Inputs read**:
- `results/electorate/backtest/observed-survey-aggregate.{md,json}` (Phase 2.3)
- `results/electorate/backtest/benchmarks-2008-2024.{md,json}` (Phase 2.2)
- `results/electorate/mapping/survey-to-prism-v0.{md,json}` (A2 mapper spec)
- `src/electorate/cesBacktestLoader.ts` (Phase 2.1 loader contract)

**Companion file**: `turnout-abstention-calibration-plan.json` — machine-readable mirror.

---

## 1. The finding that drives this plan

The Phase 2.3 observed-survey aggregate produced two cleanly separable signals across 2008-2024:

| Signal | Quality | Detail |
|---|---|---|
| **Known-voter conditional D/R/Other shares** (survey vs FEC % of total presidential vote) | **strong** | Largest gap in any year: 2016 R `+2.24pp` / D `−2.33pp` (canonical "shy Trump" effect). 2024 mirror: D `−0.07pp`, R `+0.77pp`. Every year's abs-gap-sum < 5pp on the known-voter side. |
| **Abstain share-of-VEP** (survey vs benchmark VEP) | **systematically biased** | Survey reports ~0.10–0.54% abstain weight in 2012/2016/2020/2024 vs 34.57–41.97% benchmark. Mechanical cause: CCES post-wave weights scale to validated/registered voters, not VEP. 2008 is an outlier in the other direction (Abstain 38.11% close to 38.44% benchmark) because the 2008 weight construction tracks the broader population. |
| **Unknown share** | **structural, large** | 9.52% (2008) → 33.49% (2020). Post-wave non-response. Cannot be resolved by re-fitting; must be carried explicitly or modeled. |

**Implication**: vote-choice estimation and abstention estimation are **two separable problems with two different signal qualities**. A monolithic "predict the joint distribution over {D, R, Other, Abstain}" objective would let the strong vote-choice signal carry the (much weaker) abstention fit, and the abstention frame-mismatch would silently corrupt the vote-choice calibration.

This plan formalizes the two-stage decomposition.

---

## 2. The five questions, answered

### Q1. Should vote choice be estimated conditional on observed voters, while abstention is calibrated separately to benchmark VEP?

**Decision: yes.**

**Why.** Phase 2.3 evidence directly motivates this:
1. The known-voter denominator path (D + R + Other only, exclude Unknown + Abstain) gives survey shares within `<3pp` of FEC for every year. The survey is reliable for "given a respondent voted, who did they pick".
2. The full-sample share-of-VEP path requires the survey to represent abstainers, which CCES weights do not in the 2012-2024 cycles. Trying to fit abstention and vote choice jointly on this sample forces the optimizer to either over-weight abstainers (corrupting choice) or accept the abstention gap (rendering joint shares meaningless).

**Two-stage architecture**:
- **Stage A** — vote-choice fit, conditioned on observed voters. Denominator = D + R + Other survey weight. Target = FEC D/R/Other % of total presidential vote.
- **Stage B** — abstention model + global calibration to benchmark VEP (count, not share). Operates on the full survey sample (voters + abstainers + unknown), but the *aggregate-level constraint* is the benchmark, not the sample weights.

The two stages are independently auditable. A failure in Stage A is a mapper-vote-choice issue; a failure in Stage B is an engagement-to-turnout-function issue. They are not entangled.

---

### Q2. What is the correct first-pass abstention model?

**Decision: Option C — engagement-driven relative propensity, globally calibrated to benchmark abstention.**

The three options weighed:

| Option | What it does | Strengths | Why rejected (or accepted) |
|---|---|---|---|
| **A** — year-level prior from benchmark VEP only | Every individual gets `p_abstain = benchmark_abstain_share / 1`; no per-individual variation | Trivially matches aggregate. Implementation is one constant per year. | **Rejected for v0 primary**; **kept as fallback**. Discards all individual-level engagement signal — the mapper's strong-coverage `engagement` field becomes inert for participation. Useless for any subgroup or per-state breakdown. |
| **B** — subgroup/year calibration on observed survey abstention | Fit per-cell (demographic × year) abstention rates from CCES `voteChoiceObserved == "Abstain"` rows; apply to each respondent | More heterogeneity than A; uses observed abstention where it exists | **Rejected.** CCES post-wave abstention is structurally underrepresented (~0% weight 2012-2024). Fitting on `0` propagates the weight-frame bias into every subgroup. Survey nonresponse is *not* missing-at-random with respect to vote-choice (people who don't vote also disproportionately don't take post-wave) — using it would cross-contaminate Stage A. |
| **C** — engagement scalar predicts *relative* abstention propensity, then a single global multiplier scales to benchmark abstention count | Each respondent gets `p_abstain ∝ f(engagement, demographics)`; the global multiplier `α_year` is fit so `Σ_i w_i × α_year × f_i = benchmark_abstain_count` | Preserves individual heterogeneity. Aggregate match is by construction (one parameter per year). Engagement signal in mapper has `low` inherent uncertainty → strong covariate. Subgroup breakdown emerges naturally. | **Accepted as v0 primary.** |

**Stage B specification (v0)**:

1. **Per-respondent propensity function**:
   `f(engagement, demographics) = sigmoid(β_0 − β_eng × engagement + β_age × age_term + …)` where `engagement` is the mapper's 0-10 scalar. Initial coefficients can be set so `f = 1.0` at `engagement = 0` and `f = 0.05` at `engagement = 10`. The exact functional form is an engine concern; this plan only specifies the *interface* (Σ-finite, monotone-decreasing in engagement).
2. **Global calibration**:
   For each year, find `α_year` such that
   `Σ_i (weight_i × α_year × f_i) = benchmark_abstain_count_year`
   This is a one-dimensional root-finding step per year.
3. **Heterogeneity preservation**:
   After calibration, two respondents with `engagement = 8` and `engagement = 2` will have different `p_abstain` values. The global scaling does not flatten the distribution, only shifts the mean.
4. **Fallback to A** — if engagement is unavailable for a year (data outage), Stage B reverts to Option A's flat per-year prior with an explicit `degraded_to_option_a: true` flag in the output.

**Why this respects the canonical terminology**: engagement is the mapper's continuous one-dimensional scalar (not "activation"). Stage B's `f(engagement, …)` consumes that scalar, never re-binarizes it.

---

### Q3. What should happen to Unknown?

**Decision (three layers)**:

1. **Default**: keep Unknown as a first-class explicit bucket throughout. The Phase 2.3 invariant `unknown_handling_note: "Unknown share retained explicitly; not redistributed across D/R/Other/Abstain."` carries forward. Mapper-backed smoke must enforce the same.
2. **Stage A scope**: Unknown is **excluded from the known-voter vote-share fit denominator** (denominator = D + R + Other weight only). This is what the Phase 2.3 known-voter columns already do; Stage A inherits the convention.
3. **Sensitivity analyses (clearly labeled, never silent)**:
   - **Sensitivity-S1**: redistribute Unknown to D/R/Other in proportion to the within-state known-voter shares.
   - **Sensitivity-S2**: redistribute Unknown to Abstain (all of it).
   - **Sensitivity-S3**: redistribute Unknown 50/50 between (S1 distribution) and Abstain.
   Each sensitivity result is reported with an explicit `unknown_handling: "S1" | "S2" | "S3"` tag, alongside the default `"explicit"` result. No silent redistribution.

**Why**: Unknown is not noise — it is structurally informative. A respondent who took the post-wave but refused to disclose their vote is a different kind of evidence than one who didn't take the post-wave at all. Future mapper revisions may use the demographic profile of Unknown rows to refine engagement coverage, so the bucket must remain accessible.

**Bound**: total Unknown share `<= 35%` for any year (2020 sets the current ceiling at 33.49%). If a future year exceeds 40% Unknown, this plan needs revisiting — the survey may be unusable for direct vote-share inference and the engine should fall back to a prior.

---

### Q4. First runnable mapper-backed aggregate target?

**Decision**: Stage A — known-voter D/R/Other share — is the first mapper-backed target. Stage B can be developed in parallel but is not blocking.

**Stage A target spec**:
- Restrict the survey to respondents with `voteChoiceObserved ∈ {D, R, Other}`.
- For each respondent, the mapper produces a PRISM signature; the engine produces a per-candidate distance + clearing-bar; the implied vote choice is the candidate at the minimum distance.
- Aggregate weighted predicted D/R/Other shares of the (known-voter) total.
- Compare to FEC D/R/Other % of total presidential vote (the `shares_of_total_*` benchmark fields, all FEC-PDF-verified).
- Report per-year `predicted_D - benchmark_D`, etc., in pp.

**Acceptance bands for v0** (intentionally loose; a v0 mapper is not tuned):
- `< 5pp` per-candidate gap on Stage A → "expected v0 baseline"
- `< 3pp` per-candidate gap on Stage A → "good first-pass mapper"
- `< 2pp` per-candidate gap → "ready for Stage B integration"

**Why Stage A first**: it isolates the mapper + vote-formula from the engagement/turnout function. If Stage A fails, Stage B is meaningless. If Stage A passes, Stage B becomes a clean engagement-tuning problem.

**Stage B target spec** (developed in parallel, not blocking):
- Apply Stage B (Option C) to the full survey sample.
- Compute per-respondent calibrated `p_abstain`.
- Aggregate predicted abstention count.
- Verify: `predicted_abstain_count == benchmark_abstain_count` (within float tolerance, by construction of α calibration).
- Report: `corr(engagement, p_abstain)` to confirm engagement is informative; per-quintile abstention rates to confirm heterogeneity preserved.

---

### Q5. What invariants should the eventual mapper-backed smoke enforce?

The mapper-backed smoke (downstream of this plan; not built here) must enforce — at minimum — the invariants below. They are organized by stage so that a partial implementation (Stage A only) can ship with a partial smoke.

#### Stage A invariants — known-voter vote-share fit

1. **All 5 years produce a Stage A result**. Loader output exists, mapper produces a signature for every respondent, scorer produces a vote choice.
2. **Denominator > 0**. Per year, weighted D + R + Other (predicted) > 0.
3. **Predicted shares sum to ~1**. Per year, abs(`pred_D + pred_R + pred_Other - 1`) < 1e-6.
4. **All three buckets non-zero in years with full data**. `pred_D > 0 ∧ pred_R > 0 ∧ pred_Other > 0` for all years where the corresponding observed bucket is non-zero (i.e., the mapper does not collapse Other into D/R).
5. **Per-candidate gap within v0 acceptance band** — soft invariant: `|pred_D - bench_D| < 5pp` (etc.) for each candidate, every year. Failure does not abort the smoke; it surfaces a labeled regression entry.
6. **No `Unknown` rows leak into Stage A**. Sample restriction `voteChoiceObserved ∈ {D, R, Other}` is applied before the predicted-share aggregation. (Hard invariant: smoke aborts if violated.)
7. **No mapper output uses `pid7` or party-ID-derived fields as a primary input to MAT / vote-choice node weights**. (Per mapper spec §2.1 risk: doing so makes the mapper circular for vote prediction. The smoke checks for the column name's appearance in the audit log of mapper inputs.)

#### Stage B invariants — engagement-driven turnout calibration

8. **Aggregate calibration is exact**. Per year, `|Σ_i (w_i × α_year × f_i) − benchmark_abstain_count| / benchmark_abstain_count < 1e-3` (root-finding tolerance).
9. **Engagement covariance non-zero**. `cov(engagement, p_abstain_calibrated) < 0` (informative; the more engaged, the less abstention).
10. **Per-quintile abstention spread > 5pp**. Top-engagement quintile abstention rate is `> 5pp` lower than bottom-engagement quintile. (Confirms heterogeneity preserved through global calibration.)
11. **Stage B fallback flag set when engagement missing**. If engagement coverage drops < 90% of the sample, smoke records `degraded_to_option_a: true`.

#### Joint / cross-stage invariants

12. **Unknown handling**: every year's smoke output carries either `unknown_handling: "explicit"` (default) or one of the labeled sensitivity tags. No silent redistribution.
13. **Year-level total reconstruction**: `pred_D_count + pred_R_count + pred_Other_count + pred_Abstain_count + Unknown_count = total_weight` (within tolerance). Stage A shares × (1 − pred_abstain_share − unknown_share) + abstain + unknown sums to 1.
14. **Benchmark loaded for every year**. Mapper-backed smoke must read `benchmarks-2008-2024.json`; abort if any of D/R/Other/Total/VEP/Abstain fields are null for any year.
15. **No prediction language inside the loader or the observed-aggregate module**. Loader and Phase 2.3 module remain "what the survey says"; Stage A and Stage B are the only paths that use the word "predicted".

---

## 3. What this plan deliberately does NOT decide

- **Mapper functional form** for any specific PRISM target. Owned by `survey-to-prism-v0.md`. This plan only specifies the interface the engine consumes.
- **Engine vote-formula** (distance, clearing-bar, era-context multipliers). Owned by `src/historical/respondentVoteChoice.ts` and the era-activations system. This plan treats it as a fixed downstream component.
- **Per-state or per-subgroup decomposition**. Phase 2.4 only addresses national-aggregate calibration. Subgroup decomposition is Phase 3 (coalition gates / `coalitionGate.ts`).
- **Mapper revision rules.** Owned by `survey-to-prism-v0.md` §4 (Mapper Revision Protocol). If Stage A misses by more than 5pp, the protocol there governs whether to revise the mapper, the candidate signature, the engagement function, or the engine vote-formula.
- **EIG / selector / quiz behavior**. Out of scope per Phase 2 boundary.

---

## 4. Sequencing

Recommended order (each step gated on the prior):

1. **2.4** — this plan (current).
2. **2.5 (proposed)** — minimal Stage A scaffold: a `mapperBackedAggregate.ts` that calls a *placeholder* mapper returning a uniform-prior PRISM signature for every respondent, runs the engine vote-formula, aggregates known-voter D/R/Other shares, and reports gaps. Verifies the wiring end-to-end without committing to mapper functional form. Smoke enforces invariants 1–7, 14, 15.
3. **2.6 (proposed)** — first non-trivial mapper for the strongest-coverage targets only (MAT, ideological, religious, engagement). Re-run Stage A; expect gaps in the 5–10pp band.
4. **2.7 (proposed)** — Stage B engagement-driven turnout calibration. Smoke enforces 8–11, plus joint invariants 12–13.
5. **2.8+ (proposed)** — iterate mapper coverage on remaining targets; tighten Stage A acceptance band; introduce sensitivity analyses for Unknown.

Steps 2.5–2.8 are *proposed*, not committed by this plan. They will be planned individually as each predecessor lands.

---

## 5. Why this plan respects the project's canonical terminology

- **"Engagement"** is used throughout as a continuous one-dimensional scalar — never "activation". Stage B consumes it via a continuous propensity function `f(engagement, …)`, never via a binary threshold.
- **"Moral-boundary salience"** is the framing for identity-political loading (per A2 spec §2.5). This plan does not use legacy "tribalism" or "partisan fusion" anywhere.
- **"Abstention"** is treated as a real category with its own benchmark, not a residual or an "inactive voter" label.
- **"Unknown"** is preserved as a first-class bucket — not collapsed into "abstain" or "missing".

---

## 6. Open questions deferred to v1 / Phase 3

- Is the engagement → turnout function monotone in engagement, or do mid-engagement respondents have nonlinear behavior (e.g., U-shape from low-information voters who turn out under specific mobilization)? Empirical question; v0 assumes monotone-decreasing.
- Should Stage B condition on demographics in addition to engagement (age, education, race), or rely on engagement alone? v0 starts engagement-only for parsimony; demographic enrichment is a v1 question.
- Is per-state Stage B calibration justified, or does the national `α_year` suffice? v0 is national-only; per-state is a Phase 3 concern.
- For Unknown sensitivity analyses, are S1/S2/S3 the right three? Should an S4 (mapper-backed redistribution conditional on PRISM signature) be added once the mapper exists?

---

## 7. Acceptance criteria for this plan

This plan is "done" (i.e., ready to drive Phase 2.5+ implementation) when:

- The two-stage decomposition is documented (✓ §2 Q1).
- Option C is selected with explicit fallback to Option A (✓ §2 Q2).
- Unknown handling policy is explicit, with sensitivity-analysis labels reserved (✓ §2 Q3).
- Stage A is named as the first mapper-backed target with acceptance bands (✓ §2 Q4).
- Mapper-backed smoke invariants 1–15 are enumerated (✓ §2 Q5).
- The plan does not modify mapper specs, candidate data, era-context data, EIG/selector files, browser/dist, output/live-data, or raw data (✓).
- JSON companion validates (✓ — see validation step in commit sequence).

---

## 8. Companion file

`turnout-abstention-calibration-plan.json` — machine-readable mirror of the decisions, target specs, and invariants for downstream tooling.
