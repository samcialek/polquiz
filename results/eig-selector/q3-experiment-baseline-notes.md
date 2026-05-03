# Q3 forced-coverage experiment — baseline notes

**Date:** 2026-05-02 (Terminal-3 autonomous block)
**HEAD at baseline:** `6d46e8a` electorate: add survey-to-prism mapper spec
**Working-tree dirty files NOT under audit control:**
- `src/browser/api.ts` — comment edit + `void shouldStop` removal (parallel session)
- assorted `dist/`, `output/`, `dist-tmp/`, `results-live.html`, `package.json`, electorate dir entries

These dirty files were present at block start; this audit reads engine
contents from working tree (because dump-replay needs to compile against
current source) but does not stage or commit anything outside the EIG
lane.

## Replay / eval harness commands

| Command | Purpose | Output file |
|---|---|---|
| `npx tsx src/test/dump-replay.ts` | Replays D1/D2/D3 prism dumps through current engine; uses recorded answers when available, synthesizes others from a Persona built from each dump's final state | `output/dump-replay.json` |
| `npx tsx src/test/persona-replay.ts` | (auto-fires when dump-replay imports it) — Centroid replay across 121 active archetypes; produces top-1/top-3/avg-Q metrics | `output/persona-replay.json` |
| `npx tsc -p tsconfig.runtime.json` | Build runtime files only (passes clean at HEAD) | n/a |
| `npx tsc -p tsconfig.tests.json` | Build tests dir; **fails at HEAD** due to pre-existing TS errors in `src/diagnostics/questionInfo.ts` and `src/electorate/syntheticAgents.ts` (out of EIG lane). Use `tsx` instead. | n/a |

**Harness gap:** `tsconfig.tests.json` has compile errors in directories
outside the EIG lane (diagnostics/electorate), so the dump-replay
harness cannot be pre-compiled to dist via the tests config. `tsx`
runs directly from source, which sidesteps the issue.

## Baseline run — fresh execution at HEAD `6d46e8a`

Snapshot copies saved to `/tmp/terminal3-baseline-{dump,persona}-replay.json`
for diff use later in this block (NOT staged in repo).

### dump-replay (D1/D2/D3)

| Dump | Target | Final match | Target rank | Total Q | Recorded / Synthesized | Q3 asked? | Q82 asked? |
|---|---|---|---|---|---|---|---|
| **Dump 1** (088 Gentle Trad, fascist-play persona) | 088 | **090 Hobbesian Guardian** d=0.38 | **−1** (not top-3) | 28 | 23 / 5 | NOT ASKED | NOT ASKED |
| **Dump 2** (056 Inst Leftist, authentic) | 056 | 056 d=0.37 | 1 | 33 | 33 / 0 | NOT ASKED | #18 (recorded) |
| **Dump 3** (011 Jacobin, authentic) | 011 | 011 d=0.39 | 1 | 31 | 27 / 4 | NOT ASKED | #16 (recorded) |

**Key per-node final estimates at baseline (current HEAD):**

| Dump | CD | CU | MOR | ZS | ONT_S |
|---|---|---|---|---|---|
| D1 | 4.4 (touches 6) | 1.4 (7) | 1.4 (6) | 4.2 (7) | 3.2 (4) |
| D2 | 2.9 (7) | 3.2 (10) | 3.7 (8) | 2.5 (4) | 4.5 (7) |
| D3 | 1.6 (6) | 4.3 (9) | 4.6 (7) | 4.1 (8) | 2.5 (7) |

### persona-replay (centroid, 121 archetypes)

| Metric | Value |
|---|---|
| Total personas | 121 |
| **Top-1** | 66 / 121 (**54.5%**) |
| **Top-3** | 85 / 121 (**70.2%**) |
| Avg Q answered | 28.55 |

Top attractors at baseline:
- 048 Solidaristic Localist — 11 wrong personas
- 087 Continuity Conservative — 4
- 106 Militant Partisan — 4

## Pre-existing state observations

1. **D1 already regresses to 090 at clean HEAD baseline.** The dump-replay
   from baseline.json (May 2 14:18, parallel session) showed D1=088 rank 1.
   The same harness against current HEAD shows D1=090 rank −1. Something
   between 14:18 and current HEAD (`6d46e8a`) broke D1's classification —
   not part of this work block, but it changes the available pass-gate
   surface: the D1 gate is on CD/CU values (per Sam's spec), not on
   classification, so we can still proceed.

2. **The four parallel-session output snapshots (`dump-replay-baseline.json`,
   `dump-replay-optionA-thr05.json`, `dump-replay-optionA-thr10.json`,
   `dump-replay-pos05{0,5}.json`) were ALL produced before whatever broke
   D1.** The two "Option A" runs are byte-identical to baseline — Q3
   never fires in either. Either the Option A patch wasn't actually
   active in those runs, or the gate condition was too restrictive.

3. **Q82's recorded slot positions are stable** (D1 #23 recorded but
   not asked under current selector; D2 #18; D3 #16). Q82 isn't being
   asked in D1 at current HEAD — explains part of the 088 → 090 drift.

## Pass gates for Q3 experiment (per Sam's spec)

| Gate | Condition |
|---|---|
| **D1 CD** | "moves closer to Sam's CD>4.5 target or at least does not move farther away" — baseline 4.4; gate: post-experiment CD ≥ 4.4 |
| **D1 CU** | "does not get materially worse" — baseline 1.4; gate: post-experiment CU ≤ ~1.6 |
| **D2 CD** | "does not move further wrong vs Sam's progressive intent (Sam wanted < 3)" — baseline 2.9; gate: post-experiment CD ≤ 3.0 |
| **D3** | "011 remains top-1" — baseline rank 1; gate: post-experiment rank 1 |
| **Q82 evidence** | unchanged | n/a (no question-config touch) |
| **Terminology** | no retired model prose | grep check |
| **Broader top-1** | within −2pp of baseline (54.5%) → ≥ 52.5% |
| **Broader top-3** | within −2pp of baseline (70.2%) → ≥ 68.2% |
| **Broader avg Q** | within +1.0 of baseline (28.55) → ≤ 29.55 (unless classification improves materially) |

## Next steps in this block

Step 2: implement Q3 forced-coverage in `src/engine/selectorEIG.ts` only.
Step 3: re-run dump-replay against the patched engine and apply gates above.
Step 4: re-run persona-replay for broader gate.
Step 5: commit if all pass; revert + audit-note if any fail.
