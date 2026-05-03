# Survey-to-PRISM mapper v0 — design note

**Date:** 2026-05-03 (Terminal-3, Phase 2.6)
**HEAD at build:** `d5c752f` (post stage-A known-voter aggregate)
**Spec:** `results/electorate/mapping/survey-to-prism-v0.{md,json}`
**Calibration plan:** `results/electorate/backtest/turnout-abstention-calibration-plan.{md,json}`

## What v0 is

A pure, deterministic, transparent mapper that turns one
`WeightedSurveyRespondent` (CES/CCES microdata row) into one
`SurveyPrismSignature`. v0 deliberately ships *narrow* coverage rather
than imputing distributions we cannot defend.

Each CES/CCES row becomes one weighted PRISM respondent signature. The
row weight (validated-voter post-wave preferred) carries the
voting-eligible-population share. We do **not** materialize records for
every American adult.

## Inputs and source columns actually consumed

For each respondent, the mapper inspects `rawVarPayload` for the
following columns. CCES standard column names are present in 2012,
2016, 2020, 2024. CCES 2008 uses opaque `V###` codes — those are
deliberately not decoded in v0.

| Target | Variables consumed | Years where signal fires |
|---|---|---|
| `engagement` | `newsint` + `turnoutValidated` + `turnoutObserved` | 2008–2024 (turnout always; newsint 2012+) |
| `moralBoundaries.religious` | `pew_churatd` + `pew_bornagain` | 2012, 2016, 2020, 2024 |
| `moralBoundaries.ideological` | `ideo5` (strength only — distance from center 3) | 2012, 2016, 2020, 2024 |
| `moralBoundaries.political_camp` | `pid7` (strength only — distance from center 4); **flagged as party-ID-derived** | 2012, 2016, 2020, 2024 |
| `moralBoundaries.class` | `union` (light proxy) | 2012, 2016, 2020, 2024 |

Smoke-measured per-target coverage (share of respondents whose target
came from a real survey column vs. fallback prior; sample size 200/year):

| target | 2008 | 2012 | 2016 | 2020 | 2024 |
|---|---:|---:|---:|---:|---:|
| `engagement` | 100% | 100% | 100% | 100% | 100% |
| `mb.religious` | 0% | 100% | 100% | 100% | 100% |
| `mb.ideological` | 0% | 89% | 96% | 95% | 95% |
| `mb.political_camp` | 0% | 96% | 99% | 98% | 98% |
| `mb.class` | 0% | 100% | 100% | 100% | 100% |
| all others | 0% | 0% | 0% | 0% | 0% |

The 5% "real signal" mean coverage on 2008 is entirely driven by
validated turnout (which CCES 2008 does carry via `vote_gen08`).

## What v0 does NOT do — and why

### Issue-attitude items deferred

The spec lists rich year-specific issue items for MAT (`CC16_337_*`,
`CC16_415r`), CD (`CC16_332*` abortion, `CC16_335` gay marriage), CU
(`CC16_331_*` immigration battery), MOR/ZS (refugees, foreign aid,
trade), PRO (election integrity), and ONT_S (institutional trust).

v0 does not decode any of these. Reasons:

1. **Per-year column names differ.** CCES year-specific batteries have
   inconsistent naming across cycles (e.g., CC16 → CC20 → CC24). A
   per-year resolver is required.
2. **Direction-of-effect calibration is non-trivial.** A single item
   typically maps to one node, but several items must be combined to
   localize position on a 1–5 scale — and the combination weights need
   independent validation.
3. **v0's premise is "narrow + honest"** rather than "wide +
   speculative". When v0 ships uniform priors on MAT/CD/CU/etc., the
   smoke's coverage table makes that fact loudly visible. v1 is the
   right place to add issue-item decoders, one node at a time, with
   regression tests.

In v0 these all return:
- `posPosterior` = uniform `[0.2, 0.2, 0.2, 0.2, 0.2]`
- `salPosterior` = `[0.30, 0.45, 0.20, 0.05]` (E[sal] ≈ 1.0, low-medium)
- `provenance.source` = `"fallback"`, `uncertainty: "high"`

### AES uniform — by design

Per spec ADR-003: AES is archetype-label flavor and not load-bearing
for vote prediction. CCES has no items that probe aesthetic preference
without leaking through candidate feeling thermometers (which would be
circular). v0 ships uniform `[1/6 × 6]` AES for everyone with
`uncertainty: "high"`. This is the *honest answer*; do not change in v1
without identifying a non-circular AES proxy.

### EPS broad prior

`[0.20, 0.30, 0.10, 0.15, 0.15, 0.10]` (institutionalist + empiricist
weighted) per spec. v0 does not yet decode `newsint` x media-trust into
a per-respondent EPS dist; that requires year-specific media-trust
columns we have not catalogued. Deferred to v1.

### ANES not used

Loader currently only ships CCES/CES (`src/electorate/cesBacktestLoader.ts`).
ANES coverage in the spec exists for future loader work; nothing in v0
consumes ANES.

## Variables explicitly prohibited as circular

The mapper is contractually forbidden from reading any of these for
ideological / engagement / boundary inputs:

1. **`voteChoiceObserved`** (the outcome variable). Smoke includes a
   *scrubbing spy* that calls the mapper twice — once with the real
   `voteChoiceObserved` and once with it scrubbed to `"Unknown"` — and
   asserts that the two outputs are byte-identical for every node /
   boundary / engagement value. The contract test passes for all 5
   years.
2. **Candidate feeling thermometers** (CC16_410a-related items). Not
   read by any code path.
3. **`pid7` for MAT/CD/CU/MOR/ZS/PRO/COM/ONT_H/ONT_S position.** `pid7`
   appears as input *only* for `moralBoundaries.political_camp`
   salience (with the `partyIdDerived: true` flag set in provenance,
   so any downstream vote-prediction analysis can trivially exclude
   that boundary).
4. **`ideo5` for MAT/CD/CU position.** `ideo5` appears as input *only*
   for `moralBoundaries.ideological` salience (distance from center,
   not direction). Direction of `ideo5` is intentionally discarded by
   the mapper to avoid baking party-ideology correlations into MAT/CD
   estimates.

## Provenance and uncertainty contract

Every target output carries a `provenance: NodeProvenance` with:

- `source`: `"real_signal"` if at least one real survey column
  contributed; `"fallback"` if the target collapsed to a prior.
- `vars`: list of raw column names actually consumed (empty when
  fallback).
- `partyIdDerived`: `true` only when `pid7` contributed (only ever set
  on `moralBoundaries.political_camp` and on `moralBoundaries.intensity`
  if intensity reached a non-fallback path).
- `uncertainty`: `"low"` / `"medium"` / `"high"` per spec.
- `notes`: optional human-readable explanation when relevant.

This makes the mapper output self-documenting: a downstream consumer
(scorer, calibration check, error-attribution audit) can ask
"how confident is the v0 mapper that respondent X has religious
salience 2.4?" by reading the provenance directly.

## Engagement design (real-valued 0..10)

Per ADR canon, engagement is a separate 1D continuous scalar — not an
"activation" and not a binary. v0 derivation:

```
base ← newsint mapping: 1→8.0, 2→6.5, 3→4.5, 4→2.5 (else 5.0 fallback)
+1.5 if turnoutValidated && voted
−2.0 if turnoutValidated && did not vote
+0.7 if !validated && voted (self-report)
−1.2 if !validated && did not vote (self-report)
clamped to [0, 10]
```

This places fully-engaged validated voters near 9.5 and validated
non-voters with low news interest near 0.5. The shape is calibrated to
be easy to map to clearing-bar thresholds in the engine's
abstention-calibration code path (Phase 2.4).

## Coverage triage — what needs codebook work next (v1 priorities)

Ordered by how much downstream backtest coverage each unlocks:

1. **CCES 2008 V###-code mapping.** The 2008 codebook was already
   extracted to `data/cces2008/codebook-extracted.txt` (per resolver
   comment). Adding a 2008-specific column-name resolver inside the
   mapper would let religious/ideological/political_camp/class
   boundaries fire for 2008 just like the modern years. Expected
   coverage lift: 5% → ~30%.
2. **Per-year MAT issue items** (CC16_337_*, CC20_344_*, CC24_*). MAT
   is the highest-coverage spec target with the cleanest direction-of-
   effect mapping ("raise taxes / expand healthcare" → low).
3. **Per-year CD issue items** (abortion + LGBT batteries). Strong
   spec coverage, multiple converging items per cycle.
4. **CU immigration battery** (CC16_331_*). Strong spec coverage; only
   modestly correlated with party so the lift on top of pid7-stripped
   MAT/CD is real.
5. **`moralBoundaries.national`** (national-pride composite) and
   **`moralBoundaries.ethnic_racial`** (race-policy composite). Both
   require composite construction across 3+ items. Spec rates as
   "medium" coverage in CES.
6. **EPS distribution** from media-trust + science-trust + journalism-
   trust composites. Per spec, the 6-way categorical assignment from
   2-3 items has substantial uncertainty — mapper output should be a
   distribution, not a hard category.
7. **`moralBoundaries.gender`** — gender-conscious policy stances
   (Me Too, Planned Parenthood items). 2018+ only.

## What this mapper ships ready for

After this commit, the next step is **not** "use mapper outputs to
predict votes" — that would expose how much of the signature is
fallback. Instead:

- **Phase 2.7** (planned): mapper-backed *aggregate* sanity check.
  Run mapper across all loaded respondents, compute weighted
  population-level expected position on each node, compare to plausible
  population priors. The known-voter aggregate from Phase 2.5 is the
  benchmark target on the vote-choice side.
- **Phase 2.8** (planned): turnout/abstention calibration per the
  Phase 2.4 plan — engagement scalar + clearing-bar threshold
  calibrated against benchmark VEP totals.

v0 mapper is ready to consume in those phases. It is *not* ready to
consume in any pipeline that requires per-respondent ideological
position estimates.

## Files

- `src/electorate/surveyToPrismMapper.ts` — mapper + types + validator
- `src/electorate/surveyToPrismMapperSmoke.ts` — smoke + scrubbing spy
- `results/electorate/mapper/survey-to-prism-mapper-smoke.{json,md}` — coverage report
- `results/electorate/mapper/survey-to-prism-mapper-v0-design.md` — this note

## Terminology check

Engagement is a separate 1D continuous scalar per ADR canon. Compound
moral-circle (`moralBoundaries`) terminology used throughout. Legacy
code identifiers (`pid7`, `ideo5`, `MAT`, `CD`, `CU`, etc.) appear
only as implementation labels for survey columns / engine nodes.
