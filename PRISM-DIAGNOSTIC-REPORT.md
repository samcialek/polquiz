# PRISM Quiz Diagnostic Report — 28 Missed Archetypes
*Generated 2026-03-31*

## Executive Summary

The question-node mapping IS working — all 14 nodes are covered by 83 questions (11-27 per node). The initial analysis was wrong because the parser couldn't read `touchProfile`. With the correct parsing:

- **0 misses from question gaps** — every discriminating node HAD questions asked about it
- **8 misses from profiles too similar** — no nodes differ by ≥2 (need merge or widen)
- **3 misses from low salience** — discriminator exists but sal ≤ 1
- **17 misses from likelihood issues** — questions asked, salience OK, posterior still lost

**The #1 problem is in the likelihood computation**, not the questions or the profiles.

## Question Coverage Per Node

| Node | Questions | Coverage |
|------|-----------|----------|
| PRO | 27 | ⬛⬛⬛⬛⬛⬛⬛⬛⬛ |
| TRB | 25 | ⬛⬛⬛⬛⬛⬛⬛⬛ |
| COM | 20 | ⬛⬛⬛⬛⬛⬛⬛ |
| ENG | 18 | ⬛⬛⬛⬛⬛⬛ |
| PF | 18 | ⬛⬛⬛⬛⬛⬛ |
| EPS | 18 | ⬛⬛⬛⬛⬛⬛ |
| MOR | 16 | ⬛⬛⬛⬛⬛ |
| ZS | 16 | ⬛⬛⬛⬛⬛ |
| ONT_H | 15 | ⬛⬛⬛⬛⬛ |
| CD | 14 | ⬛⬛⬛⬛⬛ |
| CU | 14 | ⬛⬛⬛⬛⬛ |
| MAT | 14 | ⬛⬛⬛⬛⬛ |
| ONT_S | 11 | ⬛⬛⬛⬛ |
| AES | 11 | ⬛⬛⬛⬛ |

No node is starved for questions. The coverage is solid.

## Failure Mode Breakdown

### 🔴 PROFILES TOO SIMILAR (8 misses) — Need merge or widen

These archetype pairs have NO continuous nodes differing by ≥2 on the 1-5 scale. They are mathematically indistinguishable by the current instrument.

| True Archetype | Misclassified As | Max Δ | Recommendation |
|---|---|---|---|
| 028 Global Caretaker | ISD | all Δ≤1 | **MERGE into ISD** or push AES/ONT_H wider |
| 034 Evidence Reformer | ISD | all Δ≤1 | **MERGE into ISD** or push EPS (empiricist vs institutionalist) |
| 036 Institutional Optimizer | Data-Driven Moderate | all Δ≤1 | **MERGE into DDM** or push MAT/COM wider |
| 046 Pastoral Leftist | Paternal Egalitarian | all Δ≤1 | **MERGE into PE** or push MAT/ENG wider |
| 050 Religious Leftist | Paternal Egalitarian | all Δ≤1 | **MERGE into PE** or push CD wider |
| 070 Burkean Steward | Institutional Conservative | all Δ≤1 | **MERGE into IC** or push CD/ZS/ONT_S wider |
| 080 Chestertonian Trad. | Security Paternalist | all Δ≤1 | **MERGE into SP** or push CD/MOR wider |
| 098 Anti-Elite Populist | Folk Tribune | all Δ≤1 | **MERGE into FT** or push MOR/COM wider |

**If we merge these 8**, that takes us from 130 → 122 archetypes, and the "too similar" failures drop to 0.

### 🟠 LOW SALIENCE (3 misses) — Quick fix

| True Archetype | Discriminator | Issue | Fix |
|---|---|---|---|
| 006 Fairness Pragmatist | ZS(Δ2), ONT_S(Δ2) | Both sal=1 | **Raise to sal=2** |
| 121 Spectator Citizen | CU(Δ2) | sal=1 | **Raise to sal=2** |
| 127 Tribal Loyalist | CU(Δ2) | sal=0 | **Raise to sal=1 minimum** |

### ⚪ LIKELIHOOD ISSUE (17 misses) — The big one

These archetypes have discriminating nodes, questions were asked about them (often 8-17 times!), salience is ≥2, and they STILL lost. The posterior didn't respond to the evidence.

**Key examples:**
- **067 Free-Exchange Modernist → Evidence Reformer**: MAT Δ=3 (sal 3 vs 1), PRO Δ=2 (sal 3 vs 2). Asked 9x and 16x respectively. STILL NOT TOP 5. Something is wrong with how the likelihood function processes these answers.
- **025 World-Minded Reformer → Social Stabilizer**: CU Δ=2 (sal 3 vs 1), ZS Δ=3 (sal 2 vs 1). Asked 7x and 10x. Still lost.
- **012 Class-War Leftist → Uncompromising Redistributionist**: CU Δ=2, TRB Δ=2, both asked 11x and 17x. Still #2.

**Hypothesis:** The likelihood function may be too flat — the probability distributions for pos=1 vs pos=3 vs pos=5 overlap too much, so even many questions don't accumulate enough evidence to separate archetypes. The simulated "answers" for a pos=5 archetype may not be different enough from a pos=3 archetype to shift the posterior.

**This needs investigation in the engine code:** How does `optionEvidence` translate answers into posterior updates? Are the distributions sharp enough?

## Root Cause: Likelihood Computation Deep-Dive

### How Posteriors Actually Work (NOT standard Bayesian)

The engine does NOT do classic Bayesian P(archetype|answers). Instead:

1. Each answer updates the **respondent's node distributions** (posDist, salDist) via `multiplyAndNormalize`
2. After each answer, `archetypeDistance()` computes a **distance** between the respondent's distributions and each archetype's fixed profile
3. Distance → softmax with adaptive temperature → posterior

```
distance = weighted_average(nodeDist * nodeWeight) across all 14 nodes
likelihood = exp(-(distance - minDistance) / temperature)
posterior ∝ likelihood × prior
```

Temperature cools from 0.12 (early) to 0.04 (by Q40), making it sharper over time.

### Why 17 Archetypes Still Lose Despite Correct Questions

**The weighted average dilution problem:**
- Distance is averaged across ALL 14 nodes
- If an archetype differs from the winner on only 1-2 nodes (even by Δ=3), those nodes contribute only 1-2 out of 14 terms
- The 10+ identical nodes contribute ~0 distance to BOTH archetypes, creating a narrow gap
- With a perfect respondent match, the gap IS enough (94% posterior in simulation)
- But the posDist distributions are **too flat** after only 9 questions on a node

**The evidence sharpness problem:**
- MAT questions have good pos distributions (pos[4] range: 0.31-0.59 — these are decent)
- But `multiplyAndNormalize` starting from uniform [0.2, 0.2, 0.2, 0.2, 0.2] converges slowly
- After 9 MAT questions all selecting the "pos=5" option, the posDist might be something like [0.02, 0.05, 0.15, 0.30, 0.48]
- This gives expectedPos ≈ 4.17, not 5.0
- Distance to archetype with pos=5: |4.17-5|/4 = 0.21
- Distance to archetype with pos=2: |4.17-2|/4 = 0.54
- The 0.33 gap sounds big, but weighted by (nodeWeight / totalWeight) it becomes ~0.033 of total distance
- That 0.033 difference, through softmax at temp=0.04, gives a likelihood ratio of only exp(-0.033/0.04) = 0.44
- With 130 archetypes, that's not enough to dominate

### The Fix Options

**Option A: Sharpen the optionEvidence distributions**
Make pos arrays more extreme: instead of [0.03, 0.07, 0.15, 0.30, 0.45] use [0.01, 0.03, 0.08, 0.23, 0.65]. This makes each answer push the posDist harder toward the correct position.

**Option B: Use distance differently — don't average, accumulate**
Instead of averaging nodeDist across all nodes, use only the nodes where the respondent has enough touches. If a node has 0 questions asked, exclude it from distance. This prevents dilution by untouched nodes.

**Option C: Lower the temperature faster**
Current: 0.12 → 0.04 by Q40. Could go to 0.02 by Q30. Makes small distance differences matter more.

**Option D: Weight by respondent touches**
Nodes with more questions should contribute more to distance. Currently nodeWeight only considers archetype sal and respondent sal — adding touch count would boost the signal from well-measured nodes.

**Option E: Hybrid approach — distance + direct Bayesian**
Keep the current system but add a direct Bayesian component: for each answer, compute P(answer|archetype) directly and multiply into the posterior. This is what the engine *appears* to do but actually doesn't — it updates the respondent state, not the archetype posteriors directly.

## Recommended Action Plan

### Phase 1: Quick wins (salience fixes + merges)
1. Raise salience on the 3 low-sal cases
2. Decide on 8 merges (or widen profiles instead)
3. Re-run the 120-archetype simulation to measure improvement

### Phase 2: Likelihood investigation
4. Trace the posterior update step-by-step for one clear case (e.g., 067 Free-Exchange Modernist)
5. Check if the optionEvidence distributions are sharp enough
6. Check if the simulation is answering questions "correctly" for each archetype — are the simulated answers actually reflecting the node positions?

### Phase 3: Full validation
7. Run all 130 (or 122 post-merge) archetypes
8. Browser-based end-to-end test
9. Target: ≥90% top-1 accuracy
