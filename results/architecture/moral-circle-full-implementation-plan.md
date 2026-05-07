# Moral Circle — Full Implementation Plan (direct rewire)

**Status:** approved by Sam 2026-05-07. In execution by Terminal 2.
**Authority:** ADR-007 (`results/architecture/ADR-007-explicit-moral-circle-affinity.md`)
**Mode:** one focused implementation push. No reviews until done. No bridge, no parallel running, no priors-and-battery combiner. Direct rewire of all code paths from `MOR`/`PF`/`TRB`/`TRB_ANCHOR`/`morBoundaries` to `moralCircleAffinity`.

Out of scope: electorate mapper, Phase 2.7 contract, synthetic-electorate, global / regime alignment, archetype renaming.

---

## Confirmed answers

- **Q1 review cadence** — no internal reviews; surface once at the end.
- **Q2 `political_tribe` → `political_camp`** — yes, renamed during the migration.
- **Q4 `morBoundaries` lifecycle post-migration** — strip entirely. No derivation kept.
- **Q5 era-activations** — does not apply to moral circle. No edits to `era-activations.json`. The existing year-keyed "MOR" entry stops being read for moral-circle purposes; era multipliers continue to apply to belief-axis nodes (MAT/CD/CU/etc.).
- **Q6 scale helpers** — keep linear `pos15ToAffinity100` / `salience03ToAffinity100` as v0. Lower priority since no bridge depends on them mid-flight.
- **Q7 selector heuristic placement** — Terminal 2 picks (planned: separate `src/engine/moralCircleSelector.ts` for clean review surface).

---

## Conceptual model (locked)

- 8 scopes + universal = 9 stored numbers per respondent and per candidate.
- Scopes: `national`, `religious`, `ethnic_racial`, `class`, `gender`, `sexual`, `ideological`, `political_camp`.
- Active signal: `excess[g] = max(0, scoped[g] − universal)`. Only excess drives matching, IDP routing, candidate compare.
- Storage retains all 9 raw values; `null` = "not meaningful to me".
- Demographic membership and affinity are independent axes. Identical excess values route to opposite IDP archetypes when membership differs.
- Quiz start: `state.moralCircle.affinity = null`. Materialized once enough evidence arrives. No zero-default.

---

## Sub-task sequence

12 sub-tasks. Internal commits per sub-task; no reviews until end.

| ID | Name | Files |
|---|---|---|
| T0 | Baseline tag + plan freeze | git tag `baseline-pre-moral-circle-migration` |
| T1 | Types + state shape | `src/types.ts`, `src/moralCircle/affinity.ts` |
| T2 | Archetype templates (124 entries) | `src/config/archetypes.ts` |
| T3 | Question banks rewrite + battery insertion | `src/config/questions.full.ts`, `src/config/questions.representative.ts` |
| T4 | Engine evidence consumer + bridge removal | `src/engine/update.ts`, `src/engine/math.ts` |
| T5 | Selector heuristic | `src/engine/moralCircleSelector.ts` (new) |
| T6 | IDP cutover | `src/identity/resolveIdentityPrimary.ts` |
| T7 | Scoring cutover | `src/engine/archetypeDistance.ts` |
| T8 | U.S. presidential candidate profiles | `src/historical/candidates.ts` |
| T9 | Vote-prediction cutover | `src/historical/respondentVoteChoice.ts` |
| T10 | Browser/api.ts cleanup | `src/browser/api.ts` |
| T11 | Rendering cutover | `results-live.html` |
| T12 | CLAUDE.md + test/smoke updates | `CLAUDE.md`, smoke harnesses |

### Sub-task details

**T0 — Baseline tag.** `git tag baseline-pre-moral-circle-migration` at current HEAD. Plan file written to disk. Trivial.

**T1 — Types + state shape.**
- Drop `MOR`, `TRB`, `PF` from `ContinuousNodeId`.
- Drop `TrbAnchor`, `TrbAnchorDist`, `TouchTarget.node === "TRB_ANCHOR"` literal.
- Drop `MorBoundaryId`, `MorBoundaryVector`, `MorBoundaries`, `MorBoundariesNodeState`, `ArchetypeMorBoundaries`.
- Rename `MorMembership` → `Membership`. Field `political_tribe` → `political_camp`. Add `sexual?: string | null` for LGBTQ membership (currently routed via `demo_lgbtq` in IDP demographics).
- Add `MoralCircleAffinityState = { affinity: MoralCircleAffinity | null; touchCount: number }`.
- `RespondentState`: drop `trbAnchor`, `morBoundaries`, `morMembership`. Add `moralCircle: MoralCircleAffinityState`, `membership: Membership`.
- `Archetype`: drop `morBoundaries`. Add `moralCircle: ArchetypeMoralCircle` (universal + 8 scopes).
- `OptionEvidence`: drop `trbAnchor` field. Drop `MOR`/`TRB`/`PF` continuous entries. Add `moralCircle?: { universal?: number; scopedAffinities?: Partial<Record<MoralCircleScope, number>> }` (per-option contributions to universal and scoped).
- Update `affinity.ts`: handle `null` universal in derivation (returns empty excess vector).

**T2 — Archetype templates.**
- Drop `MOR`/`TRB`/`PF` entries from each archetype's `nodes` field.
- Drop `morBoundaries` field from each entry.
- Add `moralCircle` field to all 124 entries.
- 6 IDP archetypes (141–146): explicit excess profiles per ADR-007 overlay map.
- 118 base + 3 deactivated: derive from current `morBoundaries` + reasonable universalAffinity defaults.
- Names and IDs unchanged.

**T3 — Question banks rewrite + battery.**
- All 31 representative-bank questions touching legacy nodes rewritten to emit `moralCircle` evidence per option (per `moral-circle-question-audit.json` re-routing).
- Full bank rewritten in lockstep.
- Insert `MORAL_CIRCLE_BATTERY_SPEC` items as live questions (Battery A universal, Battery B scoped grid).
- Drop all `MOR`/`PF`/`TRB`/`trbAnchor` references from question evidence.

**T4 — Engine evidence consumer + bridge removal.**
- Drop bridge functions in `update.ts`: `mirrorMorPosToBoundaries`, `mirrorMorSalToIntensity`, `mirrorMorSignalToBoundaries`, `mirrorAnchorToBoundaries`.
- Drop all mirror call sites across `applyOptionEvidence` / allocation / ranking / best_worst / priority-sort / dual-axis / pairwise paths.
- Add new `applyMoralCircleEvidence` that aggregates per-option universal/scoped contributions into `state.moralCircle`.
- `state.moralCircle.touchCount` increments on each touch; `state.moralCircle.affinity` materialized once `touchCount >= MIN_TOUCH_THRESHOLD` (likely 1, but could require both Battery A and at least one scoped touch).
- `registerTouches` no longer special-cases `TRB_ANCHOR`.
- Drop `addToAnchorDist`, `MOR_BOUNDARY_ORDER`, `addToMorBoundary`, `bumpMorIntensity`, `morModuleDistance`, `boundaryLoad` from `math.ts`.

**T5 — Selector heuristic.**
- New `src/engine/moralCircleSelector.ts` exporting helpers for: "is universal baseline established," "which scopes are likely above universal," "skip scoped probe if preliminary signal suggests below universal."
- Hook into `selectorEIG.ts` so the live selector reads these heuristics when picking next questions.
- Battery A scheduled early.

**T6 — IDP cutover.**
- Rewrite `resolveIdentityPrimary` to gate on `excessAffinity[group] >= 20 && scoped >= 70 && universal <= 75 && intensity03 >= 1.2` per ADR-007 seed.
- Top scoped-excess scope drives routing.
- LGBTQ Voter routes on `sexual` excess directly (no more `sexual` → `gender` collapse + `demo_lgbtq` override). `demo_lgbtq` retained as a confidence multiplier.
- Drop `topBoundary` (reads `morBoundaries`); replace with `topExcessScope(state.moralCircle)`.
- Drop `expectedContinuous(state, "MOR")` reads in feminist-signal scoring; replace with `state.moralCircle.affinity.universalAffinity` reads.

**T7 — Scoring cutover.**
- Rewrite `archetypeDistance.ts` to drop morModule branch entirely. No `useMorModule` gate; scoring always uses `moralCircleDistance(state.moralCircle.affinity, archetype.moralCircle)` when available, otherwise skips the moral-circle term defensively.
- New `moralCircleDistance` in `math.ts`: universalAffinity scalar diff + excess-vector L2 + dominant-active-boundary overlap.
- Centrist anti-gate uses `state.moralCircle.affinity?.intensity03 ?? 0`.
- Drop `MOR`/`TRB`/`PF` from `MOR_MODULE_LEGACY` array (delete the array).

**T8 — Candidate profiles.**
- Drop `Candidate.MOR`, `Candidate.PF`, `Candidate.TRB`, `Candidate.morBoundaries` from `candidates.ts`.
- Add `Candidate.moralCircle: CandidateMoralCircle`.
- Profile ~60 U.S. presidential candidates as **campaign signal / coalition appeal** (not private psychology).
- Era-activations remain as-is for belief-axis nodes; not consulted for moral-circle distance.
- New smoke `src/test/candidateMoralCircleSmoke.ts` for coalition clustering.

**T9 — Vote-prediction cutover.**
- Rewrite `respondentVoteChoice.ts`:
  - `pfEquivalentFromMoralCircle` reads `political_camp` excess + `intensity03`. Drop `pfEquivalentFromMorBoundaries`.
  - Moral floor reads `universalAffinity` + scoped excess vs candidate's. Drop legacy `cand.MOR`/`sig.MOR` reads.
  - `ideologicalDistance` uses `moralCircleDistance` for moral-circle-relevant nodes. Drop trbAnchor side-channel.
  - Era multiplier no longer reads "MOR" key for moral-circle distance (per Sam: era-activations don't apply).
  - Active-boundary overlap as positive matching signal.

**T10 — Browser/api.ts cleanup.**
- State initializer: `state.moralCircle = { affinity: null, touchCount: 0 }`, `state.membership = {}`. Drop `state.trbAnchor`, `state.morBoundaries`, `state.morMembership`.
- Drop `mkInitialMorBoundaries` and related init helpers.
- Drop `applyStoredRatioBoost` MOR salience mirror call.
- Snapshot deep-copy: copy new fields, drop old ones.
- Debug view exposes `moralCircle` state with provenance + active-boundary list.
- Update IDP call signature to match T6.

**T11 — Rendering cutover.**
- `results-live.html`: replace `MOR`/`PF`/`TRB` row definitions (lines 600/606/607) with a single moral-circle module row. Drop retired terminology labels.
- Update `ALIGNMENT_NODES`, `continuousNodes`, `SELF_CODES` arrays.
- `results-render-1984-smoke` updated to expect new shape.

**T12 — CLAUDE.md + test/smoke updates.**
- Update node count and topology in CLAUDE.md.
- Correct stale "118 active archetypes" → 121 active + 3 deactivated = 124 total.
- Drop references to MOR/TRB/PF cluster assignments and MorBoundary architecture.
- Update test smokes: drop assertions about legacy fields; add assertions about new field shape.
- Update `moralCircleAffinitySmoke.ts` Case 18 (was "legacy MorBoundaryId unchanged") to assert legacy types are gone.

---

## Acceptance criteria at end of T12

A quiz response produces:
- universal affinity X (or null with provenance)
- active moral-circle scopes (only those above universal)
- which memberships those scopes map onto
- whether identity-primary routing fires and which archetype
- vote prediction same or improved on historical-sanity 10/11
- full type/test/lint suite green
- no remaining `MOR`/`TRB`/`PF`/`TRB_ANCHOR`/`morBoundaries`/`mirrorMor*`/`MorBoundaryId`/`trbAnchor` references in `src/`

---

## No-go criteria

- Eval harness top-1 drops more than 2 pp vs `baseline-pre-moral-circle-migration`.
- Persona replay produces wrong-direction per-node verdict on Dumps 1, 2, 3.
- Identity-primary smoke fails on a known-correct IDP resolution from baseline.
- Historical-sanity 10/11 elections regresses to 9/11 or worse.
- Q103 assigned non-zero universalAffinity prior weight.
- `state.moralCircle.affinity` ever defaulted to a non-null value at quiz start.
- `sexual` quietly folded back into `gender`.
- `political_camp` treated as standing in for the whole moral-circle module.
- Engagement (ENG) treated as part of moral-circle intensity.
- Archetype IDs or names changed.
- Electorate / Phase 2.7 / global regime alignment touched.
- `era-activations.json` modified.

This plan is the contract. Execution begins immediately after this commit.
