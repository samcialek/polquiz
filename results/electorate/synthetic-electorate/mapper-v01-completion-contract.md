# Mapper v0.1 completion contract (CCES-only)

**Date:** 2026-05-04 (Terminal-3, read-only)
**Status:** Documentation only. **No mapper code touched. No engine, selector, browser, dist, output, or generated-smoke edits.**
**Companion file:** `mapper-v01-completion-contract.json`
**Source audits synthesized:**
- `survey-to-prism-mapper-coverage-audit.{md,json}` (Phase 2.7.7) — current real-signal coverage state.
- `mapper-v01-source-directionality-audit.{md,json}` — Pass 1+2 directionality audit (2016/2020 abortion + immigration + economic).
- `mapper-cd-breadth-source-audit.{md,json}` — LGBTQ + gender + rights items.
- `mapper-2024-hold-items-audit.{md,json}` — 2024 hold-item resolution.
- `mapper-hard-node-source-audit.{md,json}` — per-node source viability for the 10 still-blocked nodes.
- `mapper-zs-boundary-implementation-spec.{md,json}` — ZS + boundary composites ready for implementation.

## Purpose

Define what "done" means for the CCES-only mapper v0.1. This contract
synthesizes the prior audit chain into a single ship-readiness
specification: which nodes are covered, which are explicit fallback
(not bugs), which are blocked behind ANES, and which are blocked
behind raw IPUMS/PUMS acquisition.

The contract specifies the **acceptance gates** that the final v0.1
completion smoke must pass and enumerates the **required artifacts**
that constitute the v0.1 ship deliverable.

## v0.1 scope (CCES-only)

v0.1 mapper consumes only CES/CCES per-year microdata via the
existing `cesBacktestLoader.ts`. No ANES path, no IPUMS/PUMS path,
no commercial voter-file path. Every signal must come from a CCES
column whose directionality has been audited.

**Cycles in scope:** 2008, 2012, 2016, 2020, 2024 (the five
McDonald-VEP-benchmarked years).

**Target node set (20 mapper outputs per row):**

- 9 continuous PRISM nodes: `MAT`, `CD`, `CU`, `MOR`, `PRO`, `COM`, `ZS`, `ONT_H`, `ONT_S`.
- 2 categorical PRISM nodes: `EPS`, `AES`.
- `engagement` (1D continuous scalar).
- 7 moral-boundary salience scalars: `national`, `ethnic_racial`, `religious`, `class`, `ideological`, `gender`, `political_camp`.
- `moralBoundaries.intensity` (aggregate scalar derived from per-boundary salience).

## Coverage classification

Each (target × cycle) cell falls into exactly one of four categories:

| Category | Definition |
|---|---|
| **Covered** | At least one audited CCES column delivers a per-respondent signal at ≥ 0.5 weight. Mapper provenance reads `real_signal: true`. |
| **Reduced** | Audited CCES column(s) present but weighted total ≤ 0.5 OR uncertainty class is `high` for the composite. Mapper still flags `real_signal: true` but the posterior is near-uniform. |
| **Explicit fallback** | No safe CCES path exists OR the only path is forbidden (vote choice, candidate thermometer, partisan-camp, pid7 for core position). Mapper provenance reads `real_signal: false`. **Not a bug** — documented unmappability. |
| **ANES-required** | A non-CCES survey source has the canonical item but the loader doesn't read it yet. Mapper provenance reads `real_signal: false` until ANES loader ships. **Not a v0.1 bug**, but a documented v0.2+ work item. |

## Final v0.1 coverage matrix (target × cycle)

After v0.1 implementation lands the ZS + boundary composites from
`mapper-zs-boundary-implementation-spec.md`, the contractual coverage
target is:

| Target | 2008 | 2012 | 2016 | 2020 | 2024 |
|---|:-:|:-:|:-:|:-:|:-:|
| **MAT** | ⚠ resolver | ⚠ resolver | ✅ | ✅ | ✅ |
| **CD** | ⚠ resolver | ⚠ resolver | ✅ | ✅ | ✅ |
| **CU** | ⚠ resolver | ⚠ resolver | ✅ | ✅ | ✅ |
| **MOR** | ❌ ANES | ❌ ANES | ⏳ v0.2 | ⏳ v0.2 | ⏳ v0.2 |
| **PRO** | ❌ ANES | ❌ ANES | ❌ ANES | ❌ ANES | ❌ ANES |
| **COM** | ❌ ANES | ❌ ANES | ❌ ANES | ❌ ANES | ❌ ANES |
| **ZS** | ❌ near-fallback | ❌ resolver | ⚠ near-fallback (CC16_337_3) | ✅ | ✅ |
| **ONT_H** | ❌ ANES | ❌ ANES | ❌ ANES | ❌ ANES | ❌ ANES |
| **ONT_S** | ❌ ANES | ❌ ANES | ❌ ANES | ❌ ANES | ❌ ANES |
| **EPS** | ❌ ANES | ❌ ANES | ❌ ANES | ❌ ANES | ❌ ANES |
| **AES** | ⚪ inherent | ⚪ inherent | ⚪ inherent | ⚪ inherent | ⚪ inherent |
| **engagement** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **mB.national** | ⚠ resolver | ⚠ resolver | ✅ | ✅ | ✅ |
| **mB.ethnic_racial** | ❌ ANES | ❌ ANES | ❌ ANES | ✅ | ❌ ANES |
| **mB.religious** | ⚠ resolver | ✅ | ✅ | ✅ | ✅ |
| **mB.class** | ⚠ resolver | ✅ | ✅ | ✅ | ✅ |
| **mB.ideological** | ⚠ resolver | ✅ (~95%) | ✅ (~95%) | ✅ (~95%) | ✅ (~93%) |
| **mB.gender** | ⚪ fallback | ⚪ fallback | ⚪ fallback | ✅ | ⚠ reduced |
| **mB.political_camp** | ⚠ resolver | ✅ (~98%) | ✅ (~98%) | ✅ (~98%) | ✅ (~98%) |
| **mB.intensity** | ⚪ fallback | ✅ | ✅ | ✅ | ✅ |

Legend: ✅ covered • ⚠ near-fallback / reduced / pending resolver • ❌ ANES-required • ⚪ inherent fallback or out-of-scope • ⏳ v0.2 composite-design work pending

### What the table commits v0.1 to

For 2016/2020/2024, **15 of 20 (target × cycle) cells must read `real_signal: true`** after v0.1 ships:

- 2016: MAT, CD, CU, ZS (near-fallback OK), engagement, mB.{national, religious, class, ideological, political_camp, intensity} = 11 covered.
- 2020: same 11 + ZS + mB.ethnic_racial + mB.gender = 14 covered.
- 2024: same 11 + ZS + mB.gender (reduced) = 13 covered.

For 2008/2012, the V### code resolver and CC12_* code resolver are
separate carry-overs (see "Resolver carry-overs" below); v0.1 ships
2016/2020/2024 at full coverage and 2008/2012 at engagement-only.

### Explicit-fallback nodes (not a bug)

These nodes ship at uniform priors in v0.1 with `real_signal: false`
in mapper provenance. The v0.1 completion smoke must verify the
provenance flag is correctly set, not that the posterior moves off
fallback.

| Node | Fallback prior | Reason |
|---|---|---|
| **PRO** | uniform Dist5 | Every CCES candidate item is partisan-camp-loaded → forbidden as PRO input |
| **COM** | uniform Dist5 | No CCES item exists; ANES has direct compromise Likert |
| **ONT_H** | uniform Dist5 | CCES has no Feldman-Stenner / nature-vs-nurture probe |
| **ONT_S** | uniform Dist5 | CCES proxies are partisan-confounded; clean signal is ANES-only |
| **EPS** | broad prior `[0.20, 0.30, 0.10, 0.15, 0.15, 0.10]` | CCES has no media-trust / science-trust battery |
| **AES** | uniform Dist6 | **Inherent fallback** — no survey item exists; all proxies circular per ADR-003 |
| **MOR** (2008/2012) | uniform Dist5 | No 2008/2012 immigration items are in the existing resolver |
| **MOR** (2016/2020/2024) | uniform Dist5 (until v0.2) | Composite-design work pending: lift existing CU-item cross-loads to primary MOR routing |
| **mB.gender** (2008/2012/2016) | salience = 1.0 fallback | No gender-policy items in 2008/2012/2016 CCES per-year files |
| **mB.ethnic_racial** (2008/2012/2016/2024) | salience = 1.0 fallback | Other cycles lack post-George-Floyd context for police-reform items; need ANES VCF0830 |

## ANES-required nodes (with exact reason)

These nodes cannot reach `real_signal: true` until the ANES loader is
implemented. The contract documents the canonical ANES item per node
so the v0.2 ANES path can be specified directly.

| Node | ANES item(s) | Why CCES alone is insufficient |
|---|---|---|
| **PRO** | VCF0604 trust in government + 2020+ democracy-norms battery | Every CCES PRO candidate (Kavanaugh, ACB, impeachment items) cross-loads with `political_camp` → forbidden |
| **COM** | "Do you think it is more important that political leaders compromise to get things done, or stand up for their principles?" (2016, 2020 ANES) | CCES has no compromise-Likert items |
| **ONT_H** | Feldman-Stenner authoritarian-parenting battery (V162267-V162272 in 2016) | CCES per-year batteries do not contain nature-vs-nurture probes |
| **ONT_S** | VCF0604 + trust-in-courts + trust-in-science items | CCES per-year files lack approval items; cumulative-file approvals are partisan-confounded |
| **EPS** | Science-trust + media-trust + journalism-trust + religious-authority-trust battery | CCES `newsint` is engagement signal only, not category distribution |
| **mB.ethnic_racial** (2008/2012/2016/2024) | VCF0830 (aid to Black Americans) + Black/white feeling thermometer differential | Only 2020 has a CCES proxy via the post-George-Floyd CC20_334 battery |

**5 nodes are 100% ANES-blocked.** No CCES-only path exists for these
without injecting circularity. They are explicit fallbacks in v0.1 by
design and remain so until the ANES loader ships.

## Resolver carry-overs (separate from v0.1 completion)

The 2008 and 2012 cycles have their own resolver gaps that are
**out of scope for the v0.1 completion contract** but documented here
so they don't get conflated with mapper bugs:

- **2008**: V### opaque variable names (V100, V201, etc.) require a per-cycle resolver entry distinct from the standard `pid7`/`ideo5` names used 2012+. Most issue items in 2008 are at column-name carryover positions that need explicit decoding. Estimated coverage lift if 2008 resolver lands: 11 of 20 cells from fallback to covered.
- **2012**: Standard column names exist (`pid7`, `ideo5`, etc.) but the CC12 issue-item batteries (CC12_332 abortion, CC12_331 immigration, etc.) are not yet wired into the resolver. Estimated coverage lift if 2012 resolver lands: 7 of 20 cells.

These are separate v0.1F-and-onward implementation work, not v0.1
acceptance gates.

## Acceptance gates for v0.1 completion smoke

The v0.1 completion smoke (`syntheticElectorateAggregateSmoke.ts` or
equivalent — exact script TBD by Terminal 2) must verify:

### Gate 1: Provenance correctness per node × cycle

For every (target × cycle) cell:
- Mapper provenance `real_signal` flag matches the contract table above.
- For "covered" cells: weighted real-signal share ≥ 90%.
- For "reduced" cells: weighted real-signal share ≥ 50% AND uncertainty class is ≥ medium.
- For "fallback" / "ANES" / "inherent" cells: weighted fallback share ≥ 95% AND `real_signal: false` for all rows.

### Gate 2: Vote-choice scrubbing spy

The mapper must produce **byte-identical** signatures when
`voteChoiceObserved` is scrubbed to `"Unknown"` for every respondent.
Any divergence → fail. (This gate has been preserved across all
prior smoke tests; v0.1 must continue to pass.)

### Gate 3: pid7 routing isolation

`pid7` may contribute only to `moralBoundaries.political_camp`
salience. For every other target, the mapper must produce identical
output when `pid7` is scrubbed to a neutral value (4 = Independent).
Any divergence → fail.

### Gate 4: Forbidden-input scrub

The following columns must not affect any node's output (verified by
scrubbing each to a neutral value and confirming byte-identical
non-political_camp output):
- Vote-choice columns (`CC*_410*`)
- Candidate feeling thermometers (`CC*_320*`)
- Validated-turnout columns (`CL_*`, `vv_turnout_*`)
- Self-reported election-eve vote intent

### Gate 5: Direction-correctness sanity

For 2016/2020 cycles where ground truth is most stable:
- D-leaning respondents (per validated voter file in 2020 + CCES self-report in 2016) should average `MAT < 3.0` and `CD < 3.0` (progressive direction).
- R-leaning respondents should average `MAT > 3.0` and `CD > 3.0` (conservative direction).
- The directional gap between D and R should be ≥ 0.5 pos-units on each of MAT, CD.

This gate verifies the mapper isn't producing direction-flipped
output despite high coverage shares. It uses observed vote choice
*as ground truth for partition*, NOT as input to the mapper — there's
no circularity because the mapper has been independently verified
not to read `voteChoiceObserved` (Gate 2).

### Gate 6: Distribution invariants

Every emitted row must satisfy the existing `validateSurveyPrismSignature` invariants:
- All position distributions sum to 1 within ±1e-6.
- All categorical distributions sum to 1.
- All salience values in `[0, 3]`.
- engagement value in `[0, 10]`.
- `provenance.uncertainty` ∈ `{low, medium, high}` for every target.

### Gate 7: Cycle 2008/2012 acceptance

For the 2008 and 2012 cycles, the smoke does NOT require any
covered targets beyond engagement. Pass criterion: every row has
`engagement` provenance `real_signal: true`, and every other target
has `real_signal: false` with a documented reason in `provenance.notes`.

## Required final artifacts

The v0.1 ship deliverable must include:

| Artifact | Location | Purpose |
|---|---|---|
| Mapper source | `src/electorate/surveyToPrismMapper.ts` | Implementation |
| Mapper smoke source | `src/electorate/surveyToPrismMapperSmoke.ts` | Per-respondent shape + scrub-spy verification |
| Coverage smoke source | `src/electorate/syntheticElectorateAggregateSmoke.ts` (or equivalent) | Per-cycle aggregate coverage report |
| **Completion smoke source** | `src/electorate/mapperV01CompletionSmoke.ts` (new — Terminal 2 to add) | Asserts every gate above |
| Coverage smoke output | `results/electorate/synthetic-electorate/survey-to-prism-mapper-coverage-audit.json` | Refreshed after v0.1 lands |
| Completion smoke output | `results/electorate/synthetic-electorate/mapper-v01-completion-smoke.json` | Acceptance-gate pass/fail report |
| Completion smoke MD | `results/electorate/synthetic-electorate/mapper-v01-completion-smoke.md` | Human-readable summary |
| **This contract** | `results/electorate/synthetic-electorate/mapper-v01-completion-contract.{md,json}` | Frozen ship spec |

The completion smoke (`mapperV01CompletionSmoke.ts`) is the single
authoritative pass/fail check for v0.1 ship readiness. It must run
all 7 gates and produce a single JSON report with per-gate pass/fail
+ a top-level `v01_complete: boolean`.

## What v0.1 does NOT cover (raw-data acquisition blockers)

The following remain blocked behind external data acquisition (gated
behind explicit user approval):

### IPUMS/PUMS universe loader

The synthetic-electorate population skeleton (`VepUniverseRow[]` per
the type contract in `vepUniverseTypes.ts`) is currently a fixture
only. Real PUMS extracts (~12 GB across 5 cycles) are gated behind
the acquisition checklist in `ipums-pums-extract-manifest.md`. v0.1
mapper output can be fed to the v0 mock bridge for testing, but the
actual production bridge requires the IPUMS extracts to be downloaded
and the loader to be implemented.

**Mapper v0.1 is independent of this blocker.** The mapper can ship
v0.1-complete without the IPUMS path; the bridge / aggregate / vote
prediction phases that consume mapper output are the ones gated.

### ANES loader

ANES microdata loader is unimplemented. 5 mapper nodes (PRO, COM,
ONT_H, ONT_S, EPS) cannot reach `real_signal: true` until this
loader exists. v0.1 mapper ships these as explicit fallbacks; v0.2
adds ANES routing.

### Cumulative CES file

The CES Cumulative file (`weight_cumulative`, `economy_retro`, etc.
columns) is locally cached but not wired into the per-year resolver.
Specific items like `economy_retro` (2008–2024 series) could
strengthen the 2016 ZS composite from near-fallback to medium
confidence. Treated as a v0.1F enhancement; not a v0.1-completion
blocker.

## What "shipping v0.1 mapper" means operationally

The v0.1 mapper is **shippable** when:

1. The completion smoke (Gate 1–7) passes with `v01_complete: true`.
2. The coverage matrix in this contract matches the smoke's reported coverage exactly.
3. The vote-choice scrub spy and pid7 isolation invariants are preserved across all 5 cycles.
4. Every explicit-fallback node has its reason documented in mapper provenance `notes` (e.g., `"PRO: ANES-required (VCF0604)"` for every PRO row).
5. The `mapper-v01-completion-smoke.{json,md}` artifacts are committed.

After shipping, the mapper is **frozen** for v0.1 — subsequent
changes route through v0.1F (ZS + boundary composites going live),
v0.2 (MOR composite-promotion + ANES path), and v0.3 (ANES nodes
landing).

## What this contract deliberately does NOT do

- No mapper code modifications.
- No engine / selector / topK / browser / dist / output / live-data / candidate / era-context edits.
- No raw-data downloads.
- No edits to generated smoke outputs.

## Files

- `results/electorate/synthetic-electorate/mapper-v01-completion-contract.md` (this file)
- `results/electorate/synthetic-electorate/mapper-v01-completion-contract.json` (machine-readable mirror)

## Terminology check

`moralBoundaries.*` and `engagement` are canonical per ADR-006/ADR
canon. Engagement is referenced as a separate 1D continuous scalar.
Legacy code identifiers (`pid7`, `ideo5`, `CC*_*`, `VCF0604`, `V###`)
appear only as CCES / ANES variable names.
