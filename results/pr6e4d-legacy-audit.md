# PR 6.E.4d — final 6.E legacy-reference audit

**Date:** 2026-05-02
**Branch:** self-cluster-collapse
**HEAD before this commit:** `4905abc` (PR 6.E.4c)
**Audit script:** `scripts/pr6e4d-legacy-audit.mjs`

> **Reproducibility note (PR 6.E.4d hardening, Sam 2026-05-02):** the audit
> script reads file contents from `HEAD` via `git show`, NOT from the
> working tree. This guarantees the same output regardless of dirty /
> staged / unstaged state and matches what a fresh checkout of the
> current commit would see.

## Goal

Confirm every remaining `MOR` / `TRB` / `PF` / `trbAnchor` / `TRB_ANCHOR`
reference in the runtime-build scope is intentional. Fail (exit 1) if any
file lands in Category 5 (unexpected runtime reference). Per Sam's
directive: no behavior changes unless the audit finds a clear bug.

## Method

The audit script uses deterministic file-path + content-pattern rules to
classify each tracked file under `src/` — including
`src/{eval, test, diagnostics, optimize}/**` so the Cat 3 ruleset
actually fires on those dirs (an earlier draft had the rule but excluded
the dirs from the scan; fixed in 6.E.4d hardening per Sam 2026-05-02).
File contents are read from `HEAD`, not the working tree, so the audit
is deterministic across dirty/clean checkouts.

Files are classified into one of five categories:

1. **Intentional bridge / fallback (pre-6.F)** — `state.trbAnchor.dist`
   writes via `addToAnchorDist`, the `mirrorAnchorToBoundaries` mirror,
   coverage scoring in `nextQuestion.ts` / `selectorEIG.ts`, and the
   `TrbAnchor` / `TrbAnchorDist` types still required by every active
   write site. Removable only after 6.F lands native morBoundaries
   question evidence.

2. **Data retained (type/fallback constraints)** — canonical literals
   (`archetypes.ts` post 6.E.4c still has the IDs but no MOR/TRB/PF
   templates; `candidates.ts` and `jurisdictions-*.ts` retain
   `MOR`/`TRB`/`PF` numeric fields because the interfaces mark them
   required), plus the consumer files that actively read those fields
   in their legacy-fallback branches (`respondentVoteChoice.ts`,
   `build-alignment.ts`).

3. **Eval / diagnostic / dead-cluster** — `src/eval`, `src/test`,
   `src/diagnostics`, `src/optimize` directories, plus the unconsumed
   historical tools `simulate.ts`, `regime-alignment.ts`, `validate.ts`
   and the V1/V2 evidence scorers `archetypeDistanceWTA.ts`,
   `archetypeDistanceAvg.ts`, `stateAvg.ts`, `updateAvg.ts`.

4. **Comment-only** — the file's references appear only inside `//`
   line-comments or `/* */` blocks (heuristic). Stale-prose candidates
   to fix opportunistically.

5. **Unexpected runtime reference** — the failure category. Anything
   not matched by 1–4.

## Results

```
total files with legacy references: 44
total reference count:              2801

Cat 1 — INTENTIONAL BRIDGE / FALLBACK (pre-6.F):    13 files
Cat 2 — DATA RETAINED (type/fallback constraints): 18 files
Cat 3 — EVAL / DIAGNOSTIC / DEAD-CLUSTER:           13 files
Cat 4 — COMMENT-ONLY (stale prose candidates):       0 files
Cat 5 — UNEXPECTED RUNTIME REFERENCE (REVIEW):       0 files
```

✅ **PASS** — no Category 5 unexpected runtime references.

### Cat 1 detail (13 files, intentional pre-6.F wiring)

| File | Notes |
|---|---|
| `src/types.ts` | `TrbAnchor`, `TrbAnchorDist` types still required by every active write site |
| `src/engine/math.ts` | `addToAnchorDist`, `TRB_ANCHOR_ORDER` (local); read by update + selector |
| `src/engine/update.ts` | Bridge mirror functions + `state.trbAnchor.dist` writes; ~99 references |
| `src/engine/nextQuestion.ts` | `state.trbAnchor.dist` reads for coverage scoring + `TRB_ANCHOR` touch handling |
| `src/engine/selectorEIG.ts` | `trbConverged`, anchor entropy, `TRB_ANCHOR` evidence type |
| `src/engine/archetypeDistance.ts` | `MOR_MODULE_LEGACY` skip set + per-archetype gate; SELF-cluster pos handling for any non-deleted templates (now skipped via `if (!template) continue;`) |
| `src/engine/respondentSignature.ts` | Per-node sig generation iterates `state.continuous` (still has TRB/PF entries) |
| `src/engine/topKDrill.ts` | Per-node iteration |
| `src/engine/config.ts` | Engine config constants referencing node IDs |
| `src/browser/api.ts` | `state.trbAnchor.dist` round-trip in `getRespondentState`/`deepCopyState`/`createInitialState`/`getElectionPredictions` |
| `src/identity/resolveIdentityPrimary.ts` | Reads ZS/CD/MOR/ONT_S via `expectedContinuous` for grievance/feminist signals (legacy per-node path retained alongside the new morBoundaries-driven gate) |
| `src/config/nodes.ts`, `src/config/normalization.ts` | Continuous-node-id lists + per-node norm factors (still includes TRB/PF/MOR) |
| `src/historical/activation.ts`, `src/historical/era-activations.ts/.json` | `getActivationMultiplier(year, "MOR")` proxy for the morBoundaries module's era weight + canonical activation map (ADR-006) |

### Cat 2 detail (18 files, data + consumers)

| File | Notes |
|---|---|
| `src/config/archetypes.ts` | post-6.E.4c the archetype `nodes` blocks have NO MOR/TRB/PF templates; remaining 26 hits are the reference comments at top of file + a few residual descriptions |
| `src/config/questions.full.ts`, `src/config/questions.representative.ts` | `trbAnchor: { ... }` evidence maps that drive the bridge writes — removable only after 6.F |
| `src/historical/candidates.ts` | `cand.MOR/TRB/PF` numeric fields on `CandidateProfile` (interface marks required) |
| `src/global/jurisdictions-{americas,asia,europe1,europe2,mena}.ts` | `regime.MOR/TRB/PF` numeric fields on `RegimePeriod` (interface marks required) |
| `src/historical/contexts-{1789-1852,1856-1916,1920-2024}.ts` | `MOR` references in `nodeWeights` / `primaryAxis` / `secondaryAxis` / `dormant` arrays (post 6.E.3c max-merge); zero TRB/PF |
| `src/historical/elections-*.ts` | Per-election candidate templates; same `cand.MOR/TRB/PF` required fields |
| `src/global/build-alignment.ts` | Reads `regime.MOR` only on the legacy-fallback branch when `useMorModule === false` |
| `src/historical/respondentVoteChoice.ts` | Reads `cand.MOR` in `moralFloorPenalty` legacy fallback + `pfEquivalentFromMorBoundaries` partisan-loyalty derivation |

### Cat 3 detail (13 files: 3 dead-cluster + 10 eval/test/diagnostic)

**Dead-cluster (in `src/historical/`, tsconfig-included but unconsumed
by `api.ts`):**

| File | Notes |
|---|---|
| `src/historical/simulate.ts` | Centroid simulation tool; unconsumed by `api.ts`. Reads `arch.nodes.MOR/TRB/PF` (now undefined post-6.E.4c — defaults to `pos = 3` via existing `tmpl && ... ? ... : 3` fallback) |
| `src/historical/regime-alignment.ts` | Imported only by `simulate.ts`; same dead-cluster status |
| `src/historical/validate.ts` | Imported only by `simulate.ts`; standalone runner |

These three files build clean but their behavior post-6.E.4c is now:
MOR/TRB/PF default to position 3 (graceful fallback), changing the
centroid-simulation outputs. Future cleanup option: move these to
`src/eval/` or add to `tsconfig.runtime`'s exclude list — defer to its
own consciously-reviewed commit.

**Eval / test / diagnostic dirs (excluded from runtime tsconfig):**

| File | Token counts |
|---|---|
| `src/diagnostics/questionInfo.ts` | trbAnchor=16, TRB_ANCHOR=5 |
| `src/eval/analyze.ts` | TRB=1, TRB_ANCHOR=2 |
| `src/eval/cces2016-electorate-bridge.ts` | MOR=35, TRB=14, PF=22, TRB_ANCHOR=15 |
| `src/eval/diagnostic1-shadow.ts` | trbAnchor=3 |
| `src/eval/harness.ts` | trbAnchor=13, TRB_ANCHOR=1 |
| `src/test/full-diagnostic.ts` | trbAnchor=11 |
| `src/test/identity-primary-smoke.ts` | MOR=1, TRB=1, PF=1, trbAnchor=1 |
| `src/test/resolver-smoke.ts` | MOR=6, TRB=16, PF=16, trbAnchor=1 |
| `src/test/review-node-signatures.py` | TRB=2, PF=6 |
| `src/test/simulation.ts` | trbAnchor=11 |

The V1/V2 evidence scorers (`archetypeDistanceWTA.ts`,
`archetypeDistanceAvg.ts`) and the averaging-state pair
(`stateAvg.ts`, `updateAvg.ts`) are runtime-scope-only-by-tsconfig but
consumed exclusively by `src/eval/` — also Cat 3 per the dead-cluster
rule.

## Tracked dist-tmp / bundle leftovers

| Path | Tracked files | mtime | Notes |
|---|---|---|---|
| `dist-tmp/` | 63 files | (varies) | Parallel build output dir. Likely stale; cleanup candidate. Never imported by runtime entry points. |
| `dist/bundle.js` | 1 | 2026-04-08 | Old bundle; superseded by `dist/prism-engine-bundle.*`. Cleanup candidate. |
| `dist/prism-engine-bundle.{js, js.map, min.js}` | 3 | 2026-04-29 | Active browser bundle |
| `prism-engine-bundle.min.js` (root) | 1 | 2026-04-29 | Top-level copy; serving artifact, intentional |

**Recommendation:** queue a follow-up cleanup to evaluate whether
`dist-tmp/` (63 files) and `dist/bundle.js` (1 file) can be deleted.
Not in scope for 6.E.4d (no audit hits, no behavior risk).

## Behavior changes in 6.E.4d

**None.** The audit script itself is read-only; the results doc is
documentation. No source files modified beyond adding the script + this
report.

## Verification

```
$ npx tsc -p tsconfig.runtime.json
(clean)

$ for s in pr6e2a-archetypeDistance-smoke pr6e2a-archetypeDistance-livepath-smoke \
           pr6e2b-quizwalk-smoke pr6e2b-bridge-units-smoke \
           pr6e3a-1984-vote-smoke pr6e3b-world-alignment-smoke \
           pr6e3c-contexts-audit-smoke pr6e4a-validator-smoke; do ... done
  pr6e2a-archetypeDistance-smoke:           ✅ ALL PASS
  pr6e2a-archetypeDistance-livepath-smoke:  ✅ ALL PASS
  pr6e2b-quizwalk-smoke:                    ✅ ALL PASS
  pr6e2b-bridge-units-smoke:                ✅ ALL PASS
  pr6e3a-1984-vote-smoke:                   ✅ ALL PASS
  pr6e3b-world-alignment-smoke:             ✅ ALL PASS
  pr6e3c-contexts-audit-smoke:              ✅ ALL PASS
  pr6e4a-validator-smoke:                   ✅ ALL PASS
  resolver-smoke:                           8 passed, 0 failed (8 total)

$ git diff origin/self-cluster-collapse -- global/regime-*.csv
(empty — CSVs unchanged)

$ find output/live-data -newer scripts/pr6e4d-legacy-audit.mjs -type f
(empty — no live-data writes during this session)
```

`output/live-data/*.json` shows 126-file drift vs origin, but these
were modified before this session began (mtimes Apr 30) by parallel
sessions — not by any 6.E.* commit or smoke run. They are NOT staged
in 6.E.4d.

## Open follow-ups (not 6.E.4d scope)

- **6.F** — native morBoundaries question evidence; allows deletion
  of `trbAnchor: {...}` blocks in `questions.*.ts`, the bridge in
  `update.ts`, and the related types/exports.
- **Dead-cluster relocation** — move `simulate.ts`,
  `regime-alignment.ts`, `validate.ts` out of runtime build OR delete
  if unused. Once gone, candidate/regime `MOR/TRB/PF` data fields
  become deletable.
- **dist-tmp cleanup** — 63 tracked files of stale parallel build
  output.
- **`dist/bundle.js`** (Apr 8) — older serving artifact; verify
  unused, then delete.
