# Phase 2 Backtest V0 — Architecture

**Date**: 2026-05-03
**Status**: Architecture doc only. No engine code touched.
**Scope**: National-level popular-vote and abstention backtest for 2008, 2012, 2016, 2020, 2024.
**Companions**:
- `benchmarks-2008-2024.md` (evaluation targets)
- `survey-data-inventory.md` (what's actually loadable today)
- A2: `results/electorate/mapping/survey-to-prism-v0.md` (mapper spec — not modified by this work)

**Terminology**: use moral-boundary salience / moral-boundary loading. Engagement is a separate one-dimensional continuous scalar.

---

## 1. Goal

Build the first real backtest path:

```
survey respondents → PRISM signatures → vote/abstain simulation → national aggregate → compare against benchmark
```

The backtest is **diagnostic**, not a fitting tool. The goal is to learn *whether* the simulator is in the right universe and *where* it's most off — not to tune it to match outcomes. Benchmarks are read-only evaluation targets.

## 2. Pipeline diagram

```
                 ┌──────────────────────────┐
                 │  CCES/CES microdata file │   (per-year .tab/.csv from Harvard Dataverse)
                 └────────────┬─────────────┘
                              │ thin loader (Step 4)
                              ▼
        ┌──────────────────────────────────────────────┐
        │  WeightedSurveyRespondent[]                  │
        │  { respondentId, year, weight,               │
        │    turnoutObserved, voteChoiceObserved,      │
        │    demographics, rawVarPayload }             │
        └────────────────────────┬─────────────────────┘
                                 │
       ┌─────────────────────────┴─────────────────────────┐
       │ MODE A — oracle_turnout_mode                       │
       │ - retain ALL respondents                           │
       │ - turnout = turnoutObserved (validated when avail) │
       │ - vote choice for VOTERS:                          │
       │     run survey-to-prism mapper (A2 spec) →         │
       │     PRISM signature → respondentVoteChoice         │
       │ - vote choice for NON-VOTERS:                      │
       │     not used in vote totals; counted in            │
       │     abstentions/non-voter columns                  │
       │                                                    │
       │ MODE B — model_turnout_mode                        │
       │ - retain ALL respondents                           │
       │ - mapper produces engagement scalar per respondent │
       │   plus full PRISM signature                        │
       │ - engine clearing-bar + vote-choice logic decides  │
       │   voter vs abstainer per respondent                │
       │ - aggregates: weighted shares of both              │
       │   voter and abstainer outcomes                     │
       └─────────────────────────┬─────────────────────────┘
                                 │
                                 ▼
                ┌─────────────────────────────────┐
                │  Aggregator                     │
                │  weighted shares × benchmark VEP│
                └────────────────┬────────────────┘
                                 │
                                 ▼
                ┌─────────────────────────────────┐
                │  Predicted national aggregate   │
                │  D_pred / R_pred / Other_pred / │
                │  Abstain_pred (counts + shares) │
                └────────────────┬────────────────┘
                                 │
                                 ▼
                ┌─────────────────────────────────┐
                │  Benchmark comparison report    │
                │  (no model tuning from this)    │
                └─────────────────────────────────┘
```

## 3. The two modes

### 3.1 `oracle_turnout_mode`

**Purpose**: isolate candidate-signature / mapper / vote-formula errors from engagement-or-turnout errors.

**Logic**:
- Use the survey's *observed* turnout to classify each respondent as voter or non-voter. Validated turnout (`CL_E2016GVM` for CCES 2016) is preferred when available; self-reported `CC16_410a` non-null + `tookpost == 1` is the fallback.
- For respondents classified as voters: run the survey-to-PRISM mapper to produce a signature, then `respondentVoteChoice` to predict their candidate choice.
- For respondents classified as non-voters: do not predict a vote choice. They contribute to abstentions only.
- Aggregate weighted shares of voters' predicted candidate choice (D / R / Other), then scale to benchmark VEP × benchmark turnout rate to produce D_pred / R_pred / Other_pred counts.
- Abstentions are simply (1 − benchmark turnout rate) × benchmark VEP — taken from the benchmark, not modeled.

**What this isolates**: if oracle-mode predictions diverge from benchmark D / R / Other counts, the issue is in the candidate path: candidate signatures, the mapper for voters specifically, or the vote-formula geometry. Engagement and abstention modeling are *not* implicated because we used observed turnout.

**What this hides**: the simulator's ability to predict who turns out is not tested in this mode.

### 3.2 `model_turnout_mode`

**Purpose**: full backtest — does the simulator predict the right popular vote AND the right turnout/abstention pattern?

**Logic**:
- Run the survey-to-PRISM mapper for *every* respondent, producing both a full PRISM signature and the engagement scalar (per A2 spec, `engagement.value` ∈ [0, 10]).
- Feed the signature + engagement scalar to the engine's vote-choice + clearing-bar logic. The clearing bar gates voter vs abstainer based on engagement and an engagement-driven threshold per A2.
- Aggregate weighted shares of all four outcomes: D, R, Other, Abstain. Scale each share by benchmark VEP to produce predicted counts.
- Compare against full benchmark: D_pred vs D_actual, R_pred vs R_actual, Other_pred vs Other_actual, Abstain_pred vs (VEP − total).

**What this tests**: the entire pipeline end-to-end. Errors here can be in any layer — mapper, candidate signatures, engagement inference, clearing-bar threshold, vote formula.

**What this requires**: a working engagement → turnout function in the engine. A2's mapper outputs engagement as a 0-10 scalar; the engine must consume that to make a clearing-bar decision. Pre-existing engine code uses `respondentVoteChoice.predictVote` with a clearing-bar mechanism — verify that path before running model-mode.

### 3.3 Comparison framework

For each year × mode, output a table:

| Metric | Predicted | Benchmark | Δ (pp) | Notes |
|---|---|---|---|---|
| D vote count | D_pred | D_actual | … | … |
| R vote count | R_pred | R_actual | … | … |
| Other vote count | O_pred | O_actual | … | … |
| Abstentions (count) | abs_pred | abs_actual | … | … |
| D share of VEP | … | … | … | … |
| R share of VEP | … | … | … | … |
| Other share of VEP | … | … | … | … |
| Turnout share of VEP | … | … | … | … |
| Abstention share of VEP | … | … | … | … |

**Reporting rule**: where benchmark cells are `null` per `benchmarks-2008-2024.md` (e.g., VEP not yet verified), the comparison is reported as "blocked: missing benchmark" rather than computed. No comparison is fabricated against an unknown ground truth.

## 4. Aggregation: weighted survey shares → VEP counts

Both modes produce *weighted survey shares* — fractions of the survey's weighted-respondent base that fall into each outcome bucket. To convert to predicted national counts:

```
For mode A (oracle):
  voter_pop_pred         = benchmark.VEP × benchmark.turnout_vep
  D_pred                 = voter_pop_pred × weighted_share_D_among_voters
  R_pred                 = voter_pop_pred × weighted_share_R_among_voters
  Other_pred             = voter_pop_pred × weighted_share_Other_among_voters
  abstain_pred           = benchmark.VEP × (1 − benchmark.turnout_vep)
                           [taken from benchmark, not modeled]

For mode B (model turnout):
  D_pred                 = benchmark.VEP × weighted_share_D_in_full_sample
  R_pred                 = benchmark.VEP × weighted_share_R_in_full_sample
  Other_pred             = benchmark.VEP × weighted_share_Other_in_full_sample
  abstain_pred           = benchmark.VEP × weighted_share_Abstain_in_full_sample
```

**Weight choice**:
- Mode A uses `commonweight_vv_post` (validated voters, post-wave) when available; falls back to `commonweight_post`.
- Mode B uses `commonweight` or `commonweight_post` (full sample, not voter-restricted) so that non-voters carry full population representation.

## 5. What this architecture does NOT do

- Does not modify candidate signatures (`src/historical/candidates.ts`). Backtest reads them as fixed inputs.
- Does not modify era-context calls (`src/historical/era-activations.json`). Read as fixed inputs.
- Does not modify EIG / selector files.
- Does not modify the survey-to-PRISM mapper spec (A2). Backtest *consumes* the mapper, doesn't rewrite it.
- Does not produce state-level or county-level estimates. National popular vote + abstentions only. Sub-national geography is out of scope for V0.
- Does not output Electoral College counts. National only.
- Does not auto-tune any parameter based on benchmark deltas. Comparison is read-only.

## 6. Per-mode failure-mode taxonomy (what divergences mean)

When predictions miss benchmarks, the mode helps localize blame:

| Symptom | Mode A behavior | Mode B behavior | Likely cause |
|---|---|---|---|
| D over-predicted, R under-predicted (consistent magnitude in both modes) | over | over | candidate-signature or mapper bias on issue items |
| D over-predicted only in mode B | matches benchmark | over | engagement / turnout overestimates D-leaning respondents' propensity to vote |
| Total turnout off but D-vs-R ratio correct | n/a (uses benchmark turnout) | turnout off | engagement scalar or clearing-bar threshold |
| Other vote under-predicted | under | under | candidate signature for the third-party candidate, OR vote formula doesn't route lesser-evil away strongly enough |
| Abstain count off in mode B only | n/a | off | engagement → clearing-bar mapping |
| Both modes track each other and both miss | both off | both off | benchmark exact value uncertain (check `needs_source` flags) OR candidate signature is the load-bearing error |

This mapping is the C4 error-reporter's input domain when run on national aggregates.

## 7. What's needed to actually run the backtest

| Year | CES microdata? | Benchmark fully verified? | Mode A runnable? | Mode B runnable? |
|---|:---:|:---:|:---:|:---:|
| 2008 | ✗ | partial (D/R from snippets; VEP needs source) | no | no |
| 2012 | ✗ | partial (D/R from snippets; VEP needs source) | no | no |
| 2016 | ✓ | partial (D/R from snippets; VEP needs source) | **partial** — predictions producible; comparison blocked on VEP | partial |
| 2020 | ✗ | partial (D/R from snippets; VEP needs source + reconcile) | no | no |
| 2024 | ✗ | mostly verified (D/R/Other/Total from FEC PDF; VEP needs source) | no | no |

**Today's actual unblocked path**: 2016 only, and only for the *prediction* side (the comparison is blocked on VEP verification for 2016).

## 8. Order of operations once data acquired

1. Acquire missing CCES/CES microdata for 2008, 2012, 2020, 2024 (per `data-needed-to-run-real-backtest.md`).
2. Verify VEP for all five years from UF Election Lab CSV / McDonald data tables (resolve the 2020 66.1-vs-66.6 and 2024 64.3-vs-62.5 discrepancies).
3. Run Mode A for all five years. Inspect divergences first — Mode A divergences are unambiguous candidate / mapper / vote-formula issues.
4. Run Mode B for all five years. Diff Mode A vs Mode B per year — the delta isolates engagement / turnout-modeling issues.
5. Pass per-year results through C3 coalition gate and C4 error reporter for structured diagnosis.

This sequence keeps blame attribution clean: Mode A failures indicate where the model's *vote choice given turnout* logic breaks; Mode A-vs-B deltas indicate where its *turnout prediction* logic breaks.

---

## 9. Related files

- `benchmarks-2008-2024.md` / `.json` — benchmark inputs
- `survey-data-inventory.md` / `.json` — what's loadable today
- `data-needed-to-run-real-backtest.md` (companion, written when blocked) — exact file requirements
- `src/electorate/surveyBacktestTypes.ts` — typed loader output (Step 4)
- `src/electorate/cesBacktestLoader.ts` — thin file reader (Step 4)
- `src/electorate/cesBacktestLoaderSmoke.ts` — verifies loader on CCES 2016 (Step 4)
- `loader-smoke-summary.md` / `loader-smoke.json` — Step 4 verification output

This architecture remains stable across data acquisitions; only the loader's coverage of years grows.
