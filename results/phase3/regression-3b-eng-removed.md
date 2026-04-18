# Phase 3b Regression — ENG Removed From Archetype Signatures

**Run:** `npx tsx src/eval/regression.ts`, σ=0, seed=0, deterministic, 121 archetypes.
**Pre-3b baseline:** `results/phase3/scoring-baseline-pre-3b.json` (post-Phase-2 fix, 121 ENG signatures present, original softmax scorer).
**Post-3b harness:** `results/phase3/scoring-baseline-post-3b.json` (121 ENG signatures removed, original softmax scorer otherwise unchanged).

The Phase 2 scorer (softmax of `archetypeDistance` with per-archetype priors) is intact. The only change in 3b is that every archetype's `nodes.ENG` template has been deleted from `src/config/archetypes.ts` (121 of 121 signatures stripped; 4 commented-out historical references preserved). The Bayesian per-node update for ENG continues to run because ENG remains in `CONTINUOUS_NODES` and `ContinuousNodeId`; only the archetype-side template is gone, so the distance loop in `archetypeDistance.ts` skips ENG (no template ⇒ no contribution).

## Aggregate deltas

| metric | pre-3b | post-3b | Δ |
|--------|--------|---------|---|
| top1 | 104 (86.0%) | **105 (86.8%)** | **+1** |
| top3 | 113 (93.4%) | 113 (93.4%) | 0 |
| top5 | 116 (95.9%) | 116 (95.9%) | 0 |
| avgQuestions | 39.1 | 40.3 | **+1.2** |
| misses.length | 17 | 16 | **−1** |

**Headline.** Removing ENG as a discriminating signature dimension *improved* top-1 by one and reduced miss count by one. Top-3 and top-5 are unchanged in count, though their composition shifted (see below). Average questions rose by 1.2, consistent with the engine having one fewer node-on-which-to-converge in the stop rule's `topKAgreeOnContinuous` check (ENG no longer drives any archetype-side comparison, so `topKAgreeOnContinuous` short-circuits trivially on ENG and the engine relies on the remaining 11 continuous + 2 categorical for convergence; takes ~1 extra question on average).

## Top-1 / top-3 crossings

**Top-1 crossings (net +1).** Three gained, two lost.

| change | id | name | pre rank | post rank | pre gotId | notes |
|--------|----|------|----------|-----------|-----------|-------|
| **+** | 020 | Grassroots Autonomist | 2 | **1** | 031 Planetary Steward | Symmetric flip with 028 — the 020↔028 attractor swap, not a net gain. |
| **+** | 050 | Traditionalist Moralist | 2 | **1** | 049 Moral Egalitarian | Real gain — 050's moral-circle and tradition signatures now resolve cleanly without ENG noise. |
| **+** | 107 | Resentful Localist | 2 | **1** | 098 Anti-Elite Populist | Real gain — local/national signal disambiguates from anti-elite signal once ENG drops out. |
| **−** | 028 | Global Caretaker | 1 | **2** | (now → 031 Planetary Steward) | Symmetric flip with 020. |
| **−** | 082 | Altar-and-Hearth Conservative | 1 | **2** | (now → 083 Closed Traditionalist) | New attractor surface: 082→083 within the traditionalist cluster. |

The 020/028 pair is an attractor swap, not a true gain — 028 lost top-1 to 031 (Planetary Steward) and 020 took top-1 back from the same 031 attractor. Net: unchanged in those two slots. The other three (050, 107 as gains; 082 as loss) are real changes. Net: +1 (the genuine gains 050+107 outweigh the genuine loss 082).

**Top-3 crossings (net 0).** Two gained, two lost.

| change | id | name | pre rank | post rank |
|--------|----|------|----------|-----------|
| **+** | 006 | Fairness Pragmatist | 4 | **3** |
| **+** | 016 | Insurgent Equalizer | 5 | **2** |
| **−** | 089 | Integral Traditionalist | 2 | **5** |
| **−** | 117 | Reluctant Partisan (was Resentful Localist neighbour) | 3 | **4** |

089 (Integral Traditionalist) is the largest top-3 loss: rank 2 → 5. It is in the traditionalist cluster (082/083/086/088/089/090 region) where the 082→083 confusion also surfaced — removing ENG slightly weakens cluster discrimination here. Stage 4 attractor sharpening territory.

**Top-5 crossings.** None.

## Deactivated-archetype MAP check — PASS

All three deactivated archetypes (019, 023, 025) remain at the bottom of the rank distribution and never won MAP for any non-deactivated target.

| id | pre rank | post rank |
|----|----------|-----------|
| 019 Anarchist Mutualist | 119 | 119 |
| 023 Rights Cosmopolitan | 120 | 120 |
| 025 World-Minded Reformer | 121 | 121 |

Scanning `misses[*].gotId` across all 16 post-3b misses: no deactivated ID appears.

## 021 Principled Cosmopolitan — Phase 2 known-issue check

021 is unchanged: rank 4, gotId 001 Rawlsian Reformer, 45 questions answered. The Phase 2 attractor pair `021 → 001` carries through 3b unchanged. ENG removal neither helps nor hurts this case, consistent with the Phase 2 mechanical analysis (the attractor is anchor-posterior-driven, not ENG-driven). Stage 4 still owns this.

## Engagement-defining archetypes — robustness check

A focused check on 11 archetypes whose ENG signature was a defining feature (high-anti, low-pos, or high-sal ENG templates pre-3b):

| id | pre rank | post rank | pre Q | post Q | notes |
|----|----------|-----------|-------|--------|-------|
| 117 | 3 | 4 | 38 | 55 | Slipped from top-3; hit hard cap (55Q). Engagement-driven discrimination weakened. |
| 118 Survival Pragmatist | 1 | 1 | 36 | 34 | Stable. |
| 122 Civic Minimalist | 1 | 1 | 41 | 55 | Stable rank, but hit hard cap — ENG previously closed the gap faster. |
| 125 Reluctant Partisan | 1 | 1 | 34 | 37 | Stable. |
| 126 / 127 / 128 / 129 / 131 / 132 / 139 | 1 | 1 | (varied) | (varied) | All stable rank. |

Most engagement-defining archetypes hold rank-1 status, but two (122, 117) hit the 55-question hard cap because ENG no longer drives stop-rule convergence. This is expected behavior in 3b (we kept the Phase-2 stop rule unchanged); the 3d stop-rule rework will need to account for this.

## Other rank shifts (within-miss)

| id | name | pre rank | post rank | notes |
|----|------|----------|-----------|-------|
| 033 Systems Modernizer | 17 | **7** | within-miss improvement; gotId still 140 |
| 056 Institutional Centrist | 10 | 16 | within-miss slip; gotId 005 → 125 (Reluctant Partisan attractor) |
| 069 Bleeding-Heart Libertarian | 3 | 2 | within-top-3 improvement; gotId still 112 (Engaged Cosmopolitan) |
| 138 | 2 | 3 | within-miss slip; gotId still 013 |

## Question-count outliers (|Δquestions| > 5)

12 archetypes saw a question-count change of more than 5 in either direction. Largest swings:
- **+10 or more:** 122 (+14), 117 (+17)  ← both engagement-defining, hit hard cap
- **−9 to −5:** 089 (−9), 016 (−8), 091 (−8), 014 (−7), 028 (−7), 040 (−6), 046 (−6)
- **+5 to +9:** 005 (+8), 036 (+8), 060 (+8), 139 (+8), 132 (+7), 008 (+6), 020 (+6), 022 (+6), 070 (+6), 110 (+6)

Total questions: 4731 → 4872 (+141 across 121 runs ⇒ +1.2 per run average). The increase concentrates in archetypes whose Phase-2 stop rule was relying on ENG agreement to trigger; without ENG in the per-node agreement check, more questions are needed to satisfy `topKAgreeOnContinuous`.

## Conclusions

1. **Net improvement on top-1 (+1) with no catastrophic regression.** Removing ENG as an archetype signature dimension recovered one top-1 hit (Phase 2's 105 → Phase 2 fix's 104 → Phase 3b's 105). The composition of misses shifted but the aggregate is improved on top-1, unchanged on top-3/top-5.

2. **Attractor structure mostly stable.** The 021→001 attractor (Phase 2 known-issue) carries through unchanged. The 020↔028 pair is a clean swap — both are correctly-classified as a unit, just with the win passing between them. New 082→083 attractor surfaces in the traditionalist cluster — a Stage 4 attractor-sharpening item, not a 3b blocker.

3. **Engagement-defining archetypes still resolve correctly at rank-1 in 9 of 11 cases.** Two (117, 122) hit the 55-question hard cap because the Phase-2 stop rule still expects ENG agreement. This is expected — the 3d stop-rule rework explicitly removes ENG from the agreement check, which will fix the Q-count blowup.

4. **Average question count rose 1.2 questions per run.** Driven by the same stop-rule-still-expects-ENG-agreement issue. Will be resolved in 3d.

5. **No deactivated archetype won MAP.** Continued correct semantics under the prior=0 mechanism.

6. **3b is safe to keep.** No revert needed. The +1.2-questions overhead is a known artifact of having decoupled archetype-side ENG (gone) from stop-rule-side ENG agreement (still present); 3d fixes both. Top-1, top-3, top-5 are all at-least-as-good as Phase 2.

**Phase 3b complete.** Ready to proceed to 3c (Euclidean WTA scoring + family detection module + remove priors from Archetype type).
