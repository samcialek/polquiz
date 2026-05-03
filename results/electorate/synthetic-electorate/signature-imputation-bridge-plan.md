# Phase 2.7.5 — Signature Imputation Bridge: design plan

**Date:** 2026-05-03 (Terminal-3, plan-only)
**Status:** Design plan only. **No code written. No raw data downloaded.** No engine/selector/topK/browser/dist/output/candidate/era-context/raw-data edits.
**Companion file:** `signature-imputation-bridge-plan.json`

## What this plan is for

Phases 2.6 and 2.7 produce two distinct artifacts:

| Phase | Artifact | What it gives |
|---|---|---|
| 2.6 mapper | `SurveyPrismSignature` per CES/CCES respondent | Per-person PRISM node + moralBoundaries + engagement, with provenance |
| 2.7 universe loader (planned) | `VepUniverseRow` per ACS/PUMS respondent or cell | Voting-eligible adult skeleton with personWeight, demographics, no signature |

Neither artifact is the simulator's input. The simulator consumes
`SyntheticElectorateRow[]` per the contract at
`src/electorate/syntheticElectorateContract.ts` — every row carries
**both** demographics (from the universe layer) **and** a PRISM
signature (from the mapper), one row per represented voting-eligible
adult-cell or synthetic person.

The bridge is the function that takes one universe row and produces
a signature for it. v0 mock at `src/electorate/syntheticElectorateContractSmoke.ts`
shipped a placeholder. **v1 is the real bridge.**

## Decision: v1 default is weighted hot-deck / nearest-neighbor donor imputation

After comparing four candidate methods (cell-based imputation, raking
/ IPF, weighted hot-deck nearest-neighbor donor imputation, MRP), the
v1 default is **weighted hot-deck**. Reasons:

1. **Preserves the mapper's per-respondent posterior structure.**
   Donor signatures are full continuous + categorical + boundary
   distributions with provenance. Hot-deck copies them verbatim — no
   smoothing, no regression collapse.
2. **Honest about uncertainty by construction.** Multiple draws
   surface the variance directly; thin cells get larger backoff and
   self-flag through donor-pool-size and effective-sample-size
   diagnostics rather than silently averaging away.
3. **Implementable in one file** with no fitting step. v1 ships as
   pure data transform.
4. **Compatible with the existing contract.** `SignatureSource =
   "imputed_from_cell"` is already in `syntheticElectorateContract.ts`.
5. **Failure modes are inspectable.** When imputation goes wrong, the
   cause is recoverable from provenance: too-thin cell, all donors
   in one party, demographic dimension dropped during backoff.

MRP (multilevel regression with poststratification) is v2. Raking /
IPF is a **calibration companion**, not the bridge — it does not
attach signatures to ACS/PUMS rows. Cell-based imputation is the
degenerate case of hot-deck with fixed cell granularity; v1 hot-deck
generalizes it via backoff.

The dense joint matrix is **explicitly not the product.** The
product is `SyntheticElectorateRow` instances conforming to the
existing contract.

## Inputs and outputs

**Inputs:**
- `SurveyPrismSignature[]` for the year (Phase 2.6 mapper output, computed for all CES/CCES respondents in that cycle).
- `VepUniverseRow[]` for the year (Phase 2.7 v1 loader output — pending acquisition).
- `numDraws` (engine config, default 5).
- Random seed (engine config, deterministic for reproducibility).

**Output:**
- `SyntheticElectorateRow[]` conforming to `syntheticElectorateContract.ts`.
  - `rowKind = "weighted_cell"` for v1 default (each universe row → one row per draw, `cellWeight = personWeight`).
  - `rowKind = "synthetic_person"` for engine modes that need integer-headcount agents (each row → `round(personWeight)` synthetic persons, `cellWeight = 1`). v1 ships `weighted_cell` only.
  - `signatureSource = "imputed_from_cell"`.
  - `drawId = 0..numDraws-1`.

The bridge is **stateless and deterministic**: same input + seed →
same output, byte-identical across runs.

## Matching keys + backoff order

Donor pool selection is a stepwise dimension drop. Step 1 attempts an
exact-cell match; each subsequent step drops the most-specific
remaining dimension until the pool is large enough for sampling.

| Step | Cell key | Backoff trigger |
|---:|---|---|
| 1 | `(year, state, race, sex, age_bucket, education, income_bucket)` | Always tried first when `income_bucket` is present on the universe row |
| 2 | `(year, state, race, sex, age_bucket, education)` | Step 1 had `income_bucket = null` OR fewer than `MIN_DONORS` donors |
| 3 | `(year, state-region, race, sex, age_bucket, education)` | State pool too thin (e.g., DC, Vermont rare cells) |
| 4 | `(year, state-region, race, sex, age_bucket)` | Education pool too thin |
| 5 | `(year, race, sex, age_bucket, education)` | Region pool too thin |
| 6 | `(year, race, sex, age_bucket)` | National + race × sex × age fallback |
| 7 | `(year, race, sex)` | Gender + race fallback |
| 8 | `(year)` | Last resort — full national pool |

`state-region` collapses the 50+1 states into 4 Census regions
(Northeast / Midwest / South / West) before falling back further.

`MIN_DONORS = 25` (configurable). When the candidate pool has ≥ 25
donors with combined survey weight ≥ `MIN_DONOR_WEIGHT = 5.0`,
sampling proceeds at that level. Otherwise step advances.

A separate floor (`MAX_BACKOFF_STEP = 7`) prevents step 8 (year-only)
from firing without an explicit `--allow-national-fallback` flag.
Step 8 hits should be rare and individually inspected.

## Sampling within the donor pool

Once a donor pool is selected at backoff step `k`:

1. **Survey-weighted multinomial sample** — donor `i` has draw
   probability `w_i / Σ w_j` where `w_i` is the CCES survey weight
   (already includes validated-voter post-wave preference per
   `cesBacktestLoader.ts`).
2. **Independent draws across `drawId`** — each draw of the same
   universe row samples a different donor (with replacement). For
   `numDraws = 5` and a thin pool of 8 donors, expect overlap; the
   draws are *independent* not *unique-without-replacement*.
3. **Full posterior preserved** — the donor's full
   `SurveyPrismSignature` is copied into the row's `signature` field
   verbatim. No averaging, no smoothing, no truncation. Position
   distributions stay 5-bin, salience 4-bin, categorical 6-bin,
   moralBoundaries 7-vector.
4. **Uncertainty propagation** — donor's per-target provenance is
   carried into `SyntheticElectorateRow.signature.coverage.notes`,
   prefixed with `"hot-deck-{step}: "` so the imputation hop is
   traceable.

## Imputation provenance contract

Every output row's `signature.coverage.notes` includes:

```text
hot-deck-step-{k}: cellKey={...}; donorPoolSize=N; effectiveSampleSize=ESS;
                   donorWeightTotal=W; selectedDonorId=R{respId}; uncertainty=U;
                   backoffPath=[step1Reason, step2Reason, ...]
```

Where:
- `k` ∈ `{1..7}` (or `8` if `--allow-national-fallback`).
- `donorPoolSize` is the donor count at the matched step.
- `effectiveSampleSize = (Σ w_i)² / Σ w_i²` (Kish ESS).
- `donorWeightTotal` is `Σ w_i`.
- `selectedDonorId` is the CCES respondent ID (NOT the demographic
  cell, NOT a hash) so any signature can be traced back to a real
  survey row.
- `uncertainty` is the row-level imputation uncertainty:
  - `"low"` — step ≤ 2, donor pool ≥ 100, ESS ≥ 50
  - `"medium"` — step ≤ 4 OR donor pool 25–100 OR ESS 20–50
  - `"high"` — step ≥ 5 OR donor pool < 25 OR ESS < 20
- `backoffPath` is the list of `[stepK: reason]` entries describing
  every step that was tried and the trigger for moving on. Empty when
  step 1 sufficed.

`SyntheticElectorateRow.uncertainty.imputation` is set from this
row-level value. The signature-level uncertainty
(`uncertainty.signatureCoverage`) is inherited from the donor —
hot-deck never lowers signature uncertainty.

## What stays out of the bridge — circularity invariants

The bridge is contractually forbidden from reading any of these in
matching, sampling, or weighting:

1. **`voteChoiceObserved`.** Mapper is already forbidden from this;
   bridge inherits the prohibition. Donor matching uses demographics
   only.
2. **Predicted vote choice from any model.** Even after a Phase 2.8
   scorer exists, the bridge will not consume scorer output in the
   matching key.
3. **`pid7` direction.** `pid7` strength contributes to
   `moralBoundaries.political_camp` salience inside the donor's
   signature (with `partyIdDerived: true` flag preserved) but is
   never a matching dimension. Two demographically identical cells
   with opposite pid7 will draw from the same donor pool.
4. **Candidate feeling thermometers, vote intent, predicted turnout.**
   None ever enter matching.

A scrubbing-spy smoke (analogous to the mapper's vote-choice spy)
verifies these invariants at v1 implementation: re-running the
bridge with `voteChoiceObserved` scrubbed should produce
byte-identical `SyntheticElectorateRow` output for the same seed.

## What stays out of the bridge — data hygiene

5. **No raking / IPF inside the bridge.** Raking calibrates survey
   weights to ACS marginals; it does not attach signatures to ACS
   rows. v1 keeps raking out of the bridge entirely. Phase 2.7 v1's
   loader may publish raked CES weights as a sanity-check companion
   (`raked_weight_2014_2018.csv`), and the bridge can optionally
   consume those instead of raw CES weights as a `donorWeightSource:
   "raked"` flag — but the bridge itself does not run the raking
   step.
6. **No demographic invention.** If the universe row carries
   `income_bucket = null`, step 1 is skipped — the bridge does not
   guess income from the rest of the demographics.
7. **No row creation.** Bridge produces exactly `numDraws` output
   rows per universe row. It does not split, expand, or collapse
   universe rows. Universe-side raking lives in Phase 2.7 loader.

## v1 implementation contract

Module: `src/electorate/signatureImputationBridge.ts` (planned, not
shipped in this commit).

```ts
export interface BridgeOptions {
  year: 2008 | 2012 | 2016 | 2020 | 2024;
  numDraws: number;            // default 5
  randomSeed: number;          // deterministic
  minDonors?: number;          // default 25
  minDonorWeight?: number;     // default 5.0
  allowNationalFallback?: boolean; // default false (step 8 disabled)
  donorWeightSource?: "raw" | "raked"; // default "raw"
}

export function runSignatureImputationBridge(
  signatures: SurveyPrismSignature[],
  universe: VepUniverseRow[],
  opts: BridgeOptions,
): {
  rows: SyntheticElectorateRow[];
  stats: BridgeStats;
};

export interface BridgeStats {
  inputUniverseRows: number;
  outputRows: number;          // = inputUniverseRows × numDraws
  perStepRowCount: Record<1|2|3|4|5|6|7|8, number>;
  perStepShare: Record<1|2|3|4|5|6|7|8, number>; // share of output rows
  meanDonorPoolSize: number;
  meanEffectiveSampleSize: number;
  uncertaintyDistribution: { low: number; medium: number; high: number };
  unmatchableUniverseRows: number; // rows that even step 7 (or 8 if enabled) couldn't match
}
```

The bridge is one pure function. No global state. Deterministic per
`(year, randomSeed)` pair.

## v1 smoke contract

`src/electorate/signatureImputationBridgeSmoke.ts` will assert:

1. **Output count invariant**: `outputRows == inputUniverseRows × numDraws`.
2. **Schema validity**: every row passes `validateSyntheticElectorateRow`.
3. **Contract enum compliance**: every row has `signatureSource = "imputed_from_cell"`.
4. **Distribution invariants**: every position dist sums to 1, every cat dist sums to 1, every salience value in [0, 3], engagement in [0, 10].
5. **Donor traceability**: for every row, `selectedDonorId` resolves to a real CCES respondent in the input `signatures[]`.
6. **Voter-choice scrubbing spy**: re-running the bridge with `voteChoiceObserved = "Unknown"` on every donor produces byte-identical `signature` fields (same seed). Confirms voteChoice is not in any matching path.
7. **Backoff distribution sanity**: per-year, `perStepShare[step1] + perStepShare[step2]` should be ≥ 60% for the modern years (2012/2016/2020/2024) where CCES has ~60k donors. Lower thresholds for 2008. A year that lands ≥ 50% of rows in step 5+ flags as "donor coverage too thin — investigate before consumption."
8. **No silent unmatched rows**: `unmatchableUniverseRows = 0` when `allowNationalFallback = true`; otherwise unmatched rows are explicitly counted and reported.

## v2 — MRP (separate plan)

v2 replaces `runSignatureImputationBridge` with an MRP-style
predictor:
1. Fit a multilevel model: each PRISM target ← `state` (random
   intercept) + `age_bucket × education × race × sex` (interactions)
   + `pid7-strength` for political_camp only (gated by
   `partyIdDerived` flag).
2. Predict per-target posterior for every universe row.
3. Sample `numDraws` times from the posterior to populate
   `signatureSource = "model_draw"`.

v2 prerequisites:
- v1 hot-deck shipped + smoke-validated.
- Phase 2.8 scorer in place so the v2 model can be evaluated against
  the same Stage A known-voter target.
- A holdout-cycle protocol: fit MRP on 4 cycles, predict the 5th,
  measure `predicted_D - benchmark_D` per state. v2 ships when MRP
  matches or beats hot-deck on this holdout in ≥ 4/5 cycles.

v2 is NOT in scope of this plan. Mentioned so v1 design choices stay
forward-compatible (e.g., `signatureSource` enum already includes
`"model_draw"`).

## What raking is for in this architecture (it is NOT the bridge)

Raking / IPF is a **validation/calibration companion**, used in two
places:

1. **Phase 2.7 universe loader v1** can publish raked CES weights as
   a sanity-check artifact: take CES survey weights and rake them
   to match ACS marginals (age × race × sex × education × state).
   The result is `raked_weight_{vintage}.csv`. The bridge optionally
   consumes these via `donorWeightSource: "raked"`.
2. **Phase 2.8 backtest** can compare bridge-imputed marginals to
   raked-CES marginals as a sanity check: if hot-deck imputation
   is producing universe-side marginals very different from raked
   CES, the backoff is hiding something.

Raking is **not the bridge** because it does not produce
`SyntheticElectorateRow` instances. It produces re-weighted CES
respondents. It is a numerical sanity check, not a primary mechanism.

## Why not cell-based imputation as primary?

Pure cell-based imputation (one fixed cell key, no backoff) is
the degenerate case of hot-deck with `MAX_BACKOFF_STEP = 1`. v1
hot-deck reduces to cell-based when every cell has ≥ 25 donors. The
backoff is the value-add: it handles thin-cell tails honestly
instead of suppressing or smoothing.

## Why not raking / IPF as primary?

Raking adjusts CES *weights* to match ACS *marginals*. It does not
produce per-universe-row signatures — it produces re-weighted
respondents. To turn raked CES into `SyntheticElectorateRow[]` you
would still need a bridge step (probably hot-deck again). Raking
is a *companion* to hot-deck, not a replacement.

## Why not MRP as primary?

MRP requires a fitted model per node × year. For 9 position nodes +
2 categorical nodes + 7 boundaries + engagement = 19 fitted models
× 5 years = 95 model fits. Each needs holdout validation, prior
specification, and convergence checks. v1 is too early for that
engineering load when hot-deck answers the same question
transparently and immediately.

When v2 lands, the bridge swap is a single-file change behind the
existing `BridgeOptions` interface — universal-electorate consumers
do not need to know whether `signatureSource` came from
`"imputed_from_cell"` or `"model_draw"`.

## Phase dependencies

| Depends on | Status |
|---|---|
| Phase 2.6 mapper (`SurveyPrismSignature`) | ✅ shipped (`25fb6cb`) |
| Phase 2.7 universe loader v1 (`VepUniverseRow`) | ⏳ planned (`1c48861`); awaiting acquisition approval |
| `syntheticElectorateContract.ts` | ✅ shipped (`69c31f0`) |
| Mock bridge (`syntheticElectorateContractSmoke.ts`) | ✅ shipped (`004c4ee`) — placeholder; v1 replaces |

| Blocks | Why |
|---|---|
| Phase 2.8 mapper-backed Stage A backtest | Needs `SyntheticElectorateRow[]` input, which only the bridge produces |
| Phase 2.4 Stage B abstention calibration | Needs per-row engagement + universe weights |
| Any sub-national geography work | Depends on bridge handling state × geography correctly |

## Files in this plan

- `results/electorate/synthetic-electorate/signature-imputation-bridge-plan.md` (this file)
- `results/electorate/synthetic-electorate/signature-imputation-bridge-plan.json` (machine-readable mirror)

## Terminology check

`signatureSource = "imputed_from_cell"` is the v1 contract value.
Engagement is described as a separate 1D continuous scalar per ADR
canon — referenced only as a target the bridge transports unchanged
from donor to recipient. Compound moral-circle (`moralBoundaries`)
terminology used throughout. Legacy code identifiers (`pid7`,
`PWGTP`, `RAC1P` etc.) appear only as survey/PUMS column names.
