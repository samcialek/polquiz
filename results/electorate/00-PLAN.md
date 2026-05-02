# PRISM Electorate Simulator — Master Plan

**Last updated:** 2026-05-02
**Status:** Active. Step 0 (vote-model smoke) complete. Step 1 (2024 audit) complete. Steps 2+ pending.
**Tagline:** PRISM is a counterfactual coalition simulator, not a horse-race forecaster.

---

## TL;DR

We are building a system that takes (a) survey-derived PRISM signatures of voters, (b) PRISM-coded candidate signatures, and (c) era-activation context, then simulates election outcomes — both backward (1860–2024 backtest) and forward (2028 scenarios). The headline output is **coalition decomposition**, not popular-vote precision.

The data architecture has three measurement layers:
- **Layer M1 — Individual surveys** (CES, ANES). Politically calibrated; thin sample for sub-state geography.
- **Layer M2 — Geographic-segment psychographics** (Esri Tapestry). High geographic resolution; consumer-calibrated, needs bridge to political behavior.
- **Layer M3 — Demographic poststratification** (ACS, Census 2020). Free, geographically dense, demographically coarse on political content.

These three feed into a single weighted-agent simulator running the existing `respondentVoteChoice` engine, producing per-jurisdiction predictions with uncertainty.

---

## Why three measurement layers (and where Esri fits)

The earlier plan used CES + ANES only. Adding Esri Tapestry meaningfully expands what the simulator can do, with real costs.

| Layer | What it gives | What it lacks | Cost |
|---|---|---|---|
| CES + ANES | Politically-calibrated individual surveys; vote choice; party ID; issue items | Sample sizes thin below state level; no fine geography | Free |
| Esri Tapestry | ~67 lifestyle segments at block-group resolution; annual updates; psychographic richness | No political variables at all; consumer-calibrated; paywalled | Paid (enterprise pricing) |
| ACS + Census | Race, age, income, education at block-group; complete coverage | No political content; only demographics | Free |

**Esri's distinctive contribution** is high-resolution geographic projection. CES has ~50,000 respondents — enough for national popular vote with reasonable precision, marginal for state-level, useless at county/precinct. Esri Tapestry covers ~240,000 block groups with consistent psychographic segmentation. If we can build a *bridge* (Tapestry segment → PRISM signature distribution), the simulator can produce block-group-level predictions, not just national.

**Esri's distinctive limitation** is that it has zero political variables. The bridge to PRISM has to be learned from CES geography overlap or expert coded — Esri itself doesn't tell you how a "Soccer Mom" votes.

**Open decision.** Esri Tapestry licensing is enterprise-priced (we don't know the exact figure but assume $10K–$50K/yr range). Alternatives:
- L2 / Catalist commercial voter file: similar price; includes registration and vote history; politically calibrated. Probably better dollar-for-dollar for *political* prediction; weaker for psychographic segmentation.
- Pew typology: free but coarse (~9 types nationally, no fine geography).
- Stick with CES + ACS only: free; gives national + crude state-level via standard MRP; loses block-group precision.

**Plan position.** Architect for Esri integration as the geographic layer. If Esri is licensed, we use it. If we defer the license, the geographic projection layer falls back to ACS + a coarser segmentation (Pew or homemade). The simulator and survey-mapping work proceed identically either way — the Esri/no-Esri choice is downstream and can be deferred until ~Phase 4.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      Measurement Layers                          │
│                                                                  │
│   M1 (CES/ANES)     M2 (Esri Tapestry)     M3 (ACS/Census)      │
│        │                   │                       │             │
│        ▼                   ▼                       ▼             │
│   Survey-to-PRISM    Tapestry-to-PRISM       Demographic         │
│      Mapper             Bridge               Poststratification  │
│        │                   │                       │             │
│        └─────────┬─────────┴───────────┬───────────┘             │
│                  ▼                     ▼                         │
│         WeightedAgent population (per geography, per year)       │
└─────────────────────────────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                Simulator (existing engine)                       │
│                                                                  │
│   For each agent: posterior samples → respondentVoteChoice      │
│      against (candidates, era activations) → vote/abstain        │
│                                                                  │
│   Aggregate: weighted by survey weights × geographic weights     │
└─────────────────────────────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────────┐
│           Diagnostics (gates simulator output)                   │
│                                                                  │
│   • Coalition decomposition (P1 GATE)                            │
│   • Popular vote (sanity check, not gate)                        │
│   • Subgroup turnout                                             │
│   • Closed-loop error reporter (feeds back to mapper revision)   │
└─────────────────────────────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────────┐
│         Scenario Engine (2028+)                                  │
│                                                                  │
│   matchup × activation environment × candidate-coding uncertainty│
└─────────────────────────────────────────────────────────────────┘
```

---

## Workstreams

### Workstream A — Survey-to-PRISM (other terminal)

**Owner:** another LLM session (Claude.ai or ChatGPT) with web access and document analysis.
**Deliverables:**
- A1. CES + ANES codebook intake → `data/ces-codebook.json`, `data/anes-codebook.json`
- A2. Item-to-node mapping spec → `mapping/survey-to-prism.yaml`
- A3. Coverage gap report → `mapping/coverage-gaps.md`
- A4. Candidate-scoring methodology + v0 signatures for 2008–2024 → `data/candidate-signatures-2008-2024.yaml`
- A5. Era-activation review for 2008–2024 → `mapping/era-activation-review-modern.md`
- A6. Mapper revisions in response to closed-loop error reports

**Format rule:** all spec artifacts machine-readable (YAML/JSON). Long-form analysis lives in Markdown alongside.

---

### Workstream B — Geographic-segment-to-PRISM (NEW with Esri)

**Owner:** another LLM session OR human + LLM, depending on Esri-license decision.
**Decision point:** must resolve Esri license status before B starts in earnest. Until then, B is a sketch.

**Deliverables (assuming Esri is licensed):**
- B1. Esri Tapestry catalog → `data/esri-tapestry-catalog.json` (segment IDs, names, demographic profiles, geographic coverage)
- B2. Tapestry-segment-to-PRISM bridge → `mapping/tapestry-to-prism.yaml`. Each of ~67 segments gets an estimated PRISM signature distribution. Built by either:
  - (a) CES geography overlap: identify Tapestry segment for each CES respondent's address; aggregate PRISM signatures per segment.
  - (b) Expert coding: human + LLM analyze each segment's demographic + psychographic profile and code an inferred PRISM signature with uncertainty.
  - (c) Hybrid: (b) for v0, (a) for revisions when CES-on-Tapestry data is available.
- B3. Geographic projection methodology → `mapping/geo-projection-method.md`. How to combine ACS + Tapestry to produce a state/county/block-group electorate composition for any year.
- B4. Block-group composition snapshots → `data/electorate-composition-{year}.parquet` (or JSON for smaller scope). Per geography: weighted distribution of PRISM signatures.

**Deliverables (no Esri / ACS-only fallback):**
- B1'. ACS variable catalog → `data/acs-catalog.json`
- B2'. Demographic-to-PRISM bridge using only ACS + Pew typology overlay → `mapping/acs-to-prism.yaml`
- B3'. Same as B3, sans Tapestry.
- B4'. Coarser geographic snapshots (state-level, possibly county; sub-county precision degrades).

---

### Workstream C — Simulator + diagnostics (THIS terminal)

**Owner:** Claude Code in this repo.
**Deliverables:**
- C0. Vote-model smoke (Step 0) — **DONE.** `src/electorate/voteModelSmoke.ts`, `results/electorate/smoke/`.
- C1. Simulator scaffolding — `WeightedAgent`, `ElectorateSimulationInput`, `ElectorateSimulationResult`, aggregation, synthetic-agent harness. **NEXT.**
- C2. Coalition decomposition module — `src/electorate/coalitionDecomposition.ts`. Subgroup × candidate × predicted/actual/delta.
- C3. Coalition gate — `src/electorate/coalitionGate.ts`. Pass/fail with configurable tolerance per subgroup.
- C4. Closed-loop error reporter — emits structured JSON to `feedback/coalition-errors-{year}.json` for the measurement track to revise against.
- C5. Diagnostics dashboard — `examples/electorate-dashboard-v0.html`. Renders simulator output: coalition decomposition (headline), pop-vote (sanity), subgroup turnout, mapper provenance.
- C6. Geographic projection module — `src/electorate/geoProjection.ts`. Reads workstream-B segment composition + projects national signatures to state/county.
- C7. Scenario engine — `src/electorate/scenarios.ts`. Matchup × activation × candidate-uncertainty.

---

### Workstream D — Audit + revisions (human + this terminal)

**Owner:** human-led, with this terminal producing audit artifacts.
**Deliverables:**
- D1. 2024 candidate + activation audit — **DONE.** `results/electorate/audit/2024-candidate-and-activation-review.md`.
- D2. 2020 candidate + activation audit — same format, prior to CES 2020 backtest.
- D3. Per-year audits as needed (2016, 2012, 2008).
- D4. Backtest-failure triage — when coalition gate fails, decide whether the issue is mapper / candidate / formula / activation / turnout. Owner of each fix.

---

## Build order (phased)

### Phase 1 — Foundations (parallel tracks)
**Duration estimate:** 2–3 weeks.

| Track | Tasks |
|---|---|
| C (simulator) | C1: scaffold simulator with synthetic agents. C2: coalition decomposition. C3: coalition gate. C5 v0: dashboard. |
| A (CES mapping) | A1: codebook intake. A2: mapping spec v0. A3: coverage gap report. |
| B (decision) | Resolve Esri license status. If licensed, kick off B1 (Tapestry catalog). If not, skip to B1'. |
| D | D2: 2020 audit (mirror the 2024 audit). |

**Phase 1 gate:** simulator runs end-to-end against synthetic CES-shaped agents and produces a populated dashboard. Mapper spec v0 exists and is reviewed.

---

### Phase 2 — First real backtest (CES 2020)
**Duration estimate:** 1–2 weeks.

| Track | Tasks |
|---|---|
| A | A4 partial: produce v0 candidate signatures for 2020 and 2024 (already exist in repo; A4 may revise based on 2024 audit findings). |
| C | C4: closed-loop error reporter. Wire CES 2020 rows into simulator via mapper. |
| D | Run CES 2020 backtest. Produce coalition decomposition. Hit gate. If gate fails: revise mapper (A6) or candidates (A4) or audit (D4). Iterate. |

**Phase 2 gate:** CES 2020 coalition decomposition within ±7 points on each major subgroup (white-college, white-non-college, Black, Latino, 18–29, 65+, evangelical, union if available). Popular vote within ±5 points (sanity check, not gate).

---

### Phase 3 — Expand to 2024 + 2016 + 2012 + 2008
**Duration estimate:** 2–3 weeks.

| Track | Tasks |
|---|---|
| A | A4 complete: v0 signatures for all candidates 2008–2024. A5: era activation review. |
| C | Run all five years. |
| D | Per-year audits as gate failures arise. |

**Phase 3 gate:** Coalition decomposition gate passes for at least 4 of 5 elections (2008, 2012, 2016, 2020, 2024). Years that fail must have a *named* explanation (e.g., "2016 fails on white-non-college because the working-class realignment isn't yet captured") rather than fitness-by-force.

---

### Phase 4 — Geographic projection (Esri or ACS)
**Duration estimate:** 2–3 weeks if Esri licensed, 4–6 weeks otherwise (more bespoke work).

| Track | Tasks |
|---|---|
| B | B1–B4 (or B1'–B4'). |
| C | C6: geo projection module. |
| D | State-level backtest for 2020. Compare to actual state results. |

**Phase 4 gate:** state-level backtest reproduces correct EC winner ≥48 of 50 states for 2020. Margin within ±10 points per state (not all states are equally measurable; battleground states get tighter scrutiny).

---

### Phase 5 — Scenario engine + 2028 forecast
**Duration estimate:** 1–2 weeks.

| Track | Tasks |
|---|---|
| A | Candidate scoring for hypothetical 2028 candidates (Vance, Newsom, Whitmer, etc.). Era-activation forecasts for 2028 scenarios. |
| C | C7: scenario engine. Output: matrix of (matchup × activation environment) → predicted outcome with uncertainty bands. |
| D | Public framing review. Position as counterfactual coalition simulator, not horse-race. |

**Phase 5 gate:** scenario engine produces internally coherent results across multiple matchups; confidence intervals are honest about model uncertainty; outputs are framed as decompositions, not predictions.

---

## Gates (pass/fail criteria)

These are the formal gates that decide whether we proceed to the next phase.

| Gate | Definition | Failure response |
|---|---|---|
| G0 | Vote-model smoke runs without error; same-magnitude bias across years (smoke is internally consistent). | Fix engine bugs before anything else. **PASSED.** |
| G1 | Simulator runs end-to-end against synthetic agents. Dashboard renders. | Fix simulator infrastructure. |
| G2 | CES 2020 coalition decomposition: 8 of 10 subgroups within ±7pt. | Revise mapper (A6) or audit candidates (D4). Iterate. |
| G3 | Coalition gate passes for 4 of 5 elections (2008–2024). | Identify systematic vs. year-specific failures; revise accordingly. |
| G4 | State-level backtest reproduces ≥48 of 50 EC outcomes for 2020. | Revise geographic projection or accept lower precision and document. |
| G5 | Scenario engine produces internally coherent multi-matchup outputs. | Tighten scenario specification; revisit forecast assumptions. |

---

## Open decisions

1. **Esri license — yes/no/defer.**
   Owner: human. Deadline: end of Phase 1 (so Phase 4 can plan accordingly).
   Recommendation: defer the license decision until Phase 3 results are in. CES + ACS gets us through Phase 1–3. Only Phase 4 needs the geographic layer; that's 5–8 weeks out.

2. **L2 / Catalist as alternative to Esri for political-data layer.**
   Owner: human. Deadline: same as #1. If you're going to spend money on commercial data, L2/Catalist may be a better fit for *political* prediction than Esri for *psychographic segmentation*.

3. **Tapestry-to-PRISM bridge methodology.**
   Owner: workstream B leader. Deadline: before B2.
   Options: CES-overlap learned mapping vs. expert-coded vs. hybrid. Hybrid is most defensible.

4. **Coalition gate tolerance.**
   Owner: human + simulator track. Deadline: before G2.
   Default: ±7pt per subgroup. Tighten or loosen based on what's achievable.

5. **State-level granularity threshold.**
   Owner: human. Deadline: before Phase 4.
   How fine do we need to go? National only, state, county, block-group? Each step of granularity adds cost.

---

## Risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Survey mapper underdetermined for PRO/EPS/AES/MOR boundaries | High | High | Coverage gap report (A3) flags this early. Use synthetic priors with high uncertainty for unmeasurable nodes. Don't claim precision the data doesn't support. |
| 2008–2024 too narrow to validate era-activation map | High | Medium | Be honest in writeup. Don't oversell forecast for super-activation scenarios. |
| Esri Tapestry license cost-prohibitive | Medium | Medium | Defer decision; build ACS-fallback path in parallel. |
| Backtest fits 2020 but fails out-of-sample | Medium | High | Reserve 2024 as a held-out year if 2020 work overfits. Consider rolling-window cross-validation. |
| Coalition gate too strict; nothing ever passes | Low–Medium | Medium | Loosen tolerance. Re-frame "pass" as "directional + magnitude reasonable." |
| Project framed as "PRISM 2028 prediction" externally | Low | High | Discipline around the tagline. Public artifact = "counterfactual coalition simulator." Don't ship a horse-race number. |
| Mapper fossilizes at v0 because the simulator becomes the load-bearing artifact | Medium | High | Closed-loop revision protocol (C4). Time-box mapper validation as a separate workstream. |

---

## Tagline (carry forward)

> **PRISM is a measurement-model project first, an election simulator second.**
>
> Public-facing version:
>
> **PRISM is a counterfactual coalition simulator, not a horse-race forecaster.**

---

## Next 10 tasks (ordered)

1. **C1** — Scaffold simulator (synthetic agents) — *this terminal, in progress*
2. **A1** — CES + ANES codebook intake — *other terminal, kick off in parallel*
3. **A2** — Item-to-node mapping spec v0 — *other terminal, after A1*
4. **C2** — Coalition decomposition module — *this terminal, after C1*
5. **C3** — Coalition gate — *this terminal, after C2*
6. **A3** — Coverage gap report — *other terminal, after A2*
7. **C5** v0 — Diagnostics dashboard — *this terminal, after C3*
8. **D2** — 2020 candidate + activation audit — *this terminal, in parallel*
9. **C4** — Closed-loop error reporter — *this terminal, after C5*
10. **(Phase-2 entry)** Run CES 2020 backtest end-to-end — coordinated handoff between A and C tracks

---

## Files this plan creates

```
results/electorate/
├── 00-PLAN.md                              ← this file
├── smoke/
│   ├── 2020-results.json                   ← Step 0 output
│   ├── 2024-results.json                   ← Step 0 output
│   └── summary.md                          ← Step 0 summary
├── audit/
│   ├── 2024-candidate-and-activation-review.md   ← D1, done
│   └── 2020-candidate-and-activation-review.md   ← D2, pending
├── feedback/
│   └── coalition-errors-{year}.json        ← C4 output, populated during backtest
└── backtest/
    └── ces-{year}-coalition.{json,html}    ← Phase 2+ output

src/electorate/
├── voteModelSmoke.ts                       ← C0, done
├── electorateSimulator.ts                  ← C1, in progress
├── coalitionDecomposition.ts               ← C2, pending
├── coalitionGate.ts                        ← C3, pending
├── errorReporter.ts                        ← C4, pending
├── geoProjection.ts                        ← C6, Phase 4
├── scenarios.ts                            ← C7, Phase 5
└── candidates/
    └── 2008-2024.ts                        ← schema + storage for A4 output

mapping/                                     ← workstream A + B output
├── survey-to-prism.yaml                    ← A2
├── coverage-gaps.md                        ← A3
├── era-activation-review-modern.md         ← A5
├── tapestry-to-prism.yaml                  ← B2 (if Esri)
├── acs-to-prism.yaml                       ← B2' (fallback)
└── geo-projection-method.md                ← B3

data/                                        ← raw + cleaned source data
├── ces-codebook.json                       ← A1
├── anes-codebook.json                      ← A1
├── candidate-signatures-2008-2024.yaml     ← A4
├── esri-tapestry-catalog.json              ← B1 (if Esri)
└── electorate-composition-{year}.json      ← B4 (Phase 4)

examples/
└── electorate-dashboard-v0.html            ← C5
```

---

## How to use this plan

- This file is the source of truth for what's planned. Update it whenever scope, gates, or phases change.
- Each workstream has its own changelog inside its deliverables (mapper revisions, candidate revisions, etc.).
- Phase gates are formal — don't proceed until the gate is met or you've explicitly documented a deferral with rationale.
- The next-10-tasks list is rolling — refresh after each phase.
- When in doubt: **measurement-model first, simulator second**.
