# Question Architecture Proposals — Salience-First Restructure

**Date:** 2026-04-27
**Source observation:** Three respondent profiles with deliberately divergent saliencies (hard-left / religious-right / libertarian) produced **85% question overlap** with **zero questions unique to any single profile**. Adaptive selection picks from a shared pool of ~8 questions; the rest is forced.

**Root causes:**
1. `FIXED_OPENER` has grown from its original ~16 to **32 forced questions**, leaving ~5 adaptive picks per session out of ~37 total.
2. `FIXED_OPENER` is **position-heavy** (~23 position questions vs. ~9 salience questions). It forces position drilling on nodes the respondent doesn't care about.
3. `shouldStopEIG` converges quickly after the 32 fixed questions, leaving little adaptive room.
4. EIG, when it does run, picks from a narrow remaining-eligibility pool because most position-drilling questions are already consumed by `FIXED_OPENER`.

## Design principle (from user)

> "Arrive at what is salience to the individual. If something isn't salient we really don't need to know what the position is. If it's very salient we want to hone in on what position is, so more questions should be asked about it. For those questions in the fixed 12 that aren't about salience, get a lot of information out of them about position. If something has a salience of zero, the only questions that touch its position have to be these multi-touch screeners that hit all nodes lightly."

Three proposals follow, ranked by my recommendation.

---

## Proposal A — Two-phase FIXED_OPENER (salience-first, then conditional drilling)

**Recommended.** Cleanest fit to the design principle, lowest implementation risk, preserves coverage where it matters.

**Phase 1 — Salience establishment (always, ~14 questions, fixed order):**

| ID | Question | What it establishes |
|---|---|---|
| 200 | party_identification | partyID metadata (election compute) |
| 103 | issue_salience_screener | MAT/CD/CU/MOR/PRO/COM/ZS/ONT_H/ONT_S salience (priority_sort) |
| 4 | cultural_social_salience | CD/CU/MOR salience |
| 97 | political_thought_frequency | PF position (= activation per ADR-005), ENG position |
| 1 | political_content_frequency | ENG position |
| 60 | trb_anchor | TRB anchor distribution |
| 89 | epistemic_style_battery | EPS category + salience |
| 217 | epistemic_style_ranking | EPS category coverage |
| 22 | source_trust_conflict | EPS tie-breaker + salience |
| 218 | aesthetic_style_ranking | AES category + salience |
| 11 | nyt_headline_click | EPS/AES light touch |
| 84 | slider | (verify what this drives — possibly drop) |
| 211 | strategic_voting | metadata for vote prediction |
| 212 | negative_partisanship | metadata |

By the end of Phase 1, every node has a meaningful salience reading.

**Phase 2 — Conditional position drilling (eligible-only, EIG-ordered, ~10-15 questions):**

These are the position-drilling questions currently in FIXED_OPENER. Each one is gated by whether its dominant target node has activated salience:

```
isPositionEligible(question, state):
  for each touchProfile entry where role == "position":
    nodeId = entry.node
    if state.continuous[nodeId].salDist[0] >= 0.5: continue  // node ruled out
    expectedSal = E[salDist] = 0×p0 + 1×p1 + 2×p2 + 3×p3
    if expectedSal >= 1.5: return true   // active enough to drill
  return false   // no active node touched
```

Questions in this phase, currently all in FIXED_OPENER, become conditional:

- 15 (inequality_causes_allocation) — gated on MAT salience
- 27 (welfare_error_tradeoff) — MAT salience
- 30 (?)
- 33 (?)
- 202 (state_scope_preference) — MAT/PRO/ONT_S
- 214 (institutions_foundational) — ONT_S
- 203 (military_intervention) — MOR/ZS/ONT_H
- 204 (international_engagement) — CU/MOR/TRB
- 205 (trade_nationalism) — MAT/CU/ZS
- 206 (religion_in_public_life) — CD/MOR/PRO
- 207 (emergency_powers) — PRO/ONT_H
- 208 (courts_vs_majority) — PRO/ONT_H
- 209 (zero_sum_economics_view) — ZS
- 210 (human_malleability_view) — ONT_H
- 213 (equal_standing_within_polity) — MOR/CU/PRO

**Phase 3 — Adaptive EIG drilling on highest-salience nodes (variable, ~5-15 questions):**

EIG selector continues until `shouldStopEIG` fires. Heavily weights questions touching nodes with `expectedSal ≥ 2.0` (high-salience drilling). Forces minimum 3 position touches per top-2 node by salience.

**Universal-touch screeners (forced regardless of salience, in Phase 1 or Phase 2):**

These multi-node questions extract some signal from every node even when individual saliences are low. Worth keeping unconditional:

- 93 (priority_sort_opener) — touches MAT/CD/CU/MOR/PRO/COM positions+saliences
- 99 (cross_partisan_priority_sort) — TRB position
- 101 (cultural_social_placement_dual) — CD position+salience
- 102 (membership_criteria_priority_sort) — CU/MOR/TRB/CD/MAT/ZS/PRO positions
- 98 (group_solidarity_feeling) — TRB+MOR positions

**Total session estimate:** 14 (Phase 1) + 0–15 (Phase 2 conditional) + 5–15 (Phase 3 EIG) + 5 (universal screeners) = **24–49 questions**, with HIGH variance across profiles. A salience-flat respondent gets ~24; a salience-spiky respondent gets ~45+ on their top nodes.

**Implementation effort:** Medium. Modify `getNextQuestion()` in `api.ts` to track three phases. Add `isPositionEligible()` helper. Modify EIG scorer to prefer high-salience drilling. Estimate 200-300 LOC + tests.

**Behavior changes:**
- A respondent who marks economic issues as their only salient concern gets MAT/COM/ZS drilled deep, never sees foreign-policy block.
- A respondent with high MOR/CU salience gets the religion + universalism block, skips state-scope drilling.
- Adaptive room becomes 15+ questions per session in many cases.

**Risks:**
- Some respondents' archetypes depend on subtle position differences on nodes they "don't care about" (e.g., a moderate ONT_S signal that distinguishes 070 Burkean Steward from 056 Institutional Leftist). Conditional drilling drops that signal.
- Compensate via the universal-touch screeners in Phase 1.

---

## Proposal B — Lean opener + EIG with salience-weighting

**Architecturally simpler.** Trim FIXED_OPENER to bare essentials and trust EIG to pick the rest, with salience as the dominant scoring weight.

**FIXED_OPENER (12 questions, fixed order):**

200, 103, 4, 97, 1, 60, 89, 217, 218, 211, 212 — all salience/metadata.

(11 listed; pick a 12th from {Q22, Q11, Q84} or include none.)

**Modify `scoreQuestionEIG`:**

```
score = current_eig_score × salience_weight(question, state)

salience_weight(q, state):
  weight = 0
  for each touchProfile entry:
    nodeId = entry.node
    expectedSal = E[state.continuous[nodeId].salDist]
    weight += expectedSal × entry.weight
  return weight / numTouches
```

This makes EIG strongly prefer questions touching high-salience nodes. Low-salience nodes' position questions become unreachable in practice (their score is multiplied by ~0).

**Behavior:**
- After 12 fixed questions, EIG runs adaptively for 15-25 more questions.
- High-salience nodes get drilled hard.
- Low-salience nodes get little or no position drilling.
- Universal-touch screeners (Q93, Q102, etc.) compete in the EIG pool naturally.

**Implementation effort:** Low. Modify `selectorEIG.ts:scoreQuestionEIG`, trim FIXED_OPENER. ~50 LOC.

**Risks:**
- EIG behavior is harder to predict than explicit phase logic.
- Coverage of nodes the respondent didn't mark salient drops to near-zero. May lose archetype-discriminating signal on neighboring archetypes that differ on weakly-salient nodes.
- "What if Q103 mismeasures salience" — without the broad fixed coverage, an under-measured node never gets touched again.

---

## Proposal C — Three-tier with explicit depth-on-top-k drilling

**Most sophisticated.** Adds explicit "drill the top-K salient nodes deeper" logic.

**Tier 1 — Core fixed (12 questions):** Same as Proposal B (salience establishers + metadata).

**Tier 2 — Universal-touch screeners (5 questions, forced):** Q93, Q99, Q101, Q102, Q98. These extract some signal from EVERY node regardless of salience. Solves the "low-salience node still needs *some* position read" problem from Proposal A.

**Tier 3 — Salience-gated adaptive drilling (variable):**

EIG selector runs with two passes:

**Pass 3a — Mandatory top-K depth.** For each of the top-2 nodes by `expectedSal`, force at least 3 position-touch questions before moving on. This is the "high-salience nodes get drilled deeper" requirement explicit.

**Pass 3b — Standard EIG for remaining capacity.** EIG with salience-weighting fills remaining slots up to MAX_QUESTIONS or `shouldStopEIG`.

**Eligibility gate:** position questions only eligible if their dominant node has `expectedSal ≥ 1.5`.

**Total session:** 12 + 5 + 6 (top-2 × 3) + 5-12 (Tier 3b) = **28-35 questions**. Tighter range than Proposal A; more predictable.

**Implementation effort:** Medium-High. Need top-K tracker + minimum-touch counter per node. Modify `selectorEIG.ts` to enforce mandatory drilling order. ~300-400 LOC.

**Behavior:**
- Strong guarantee: top-2 salient nodes get ≥3 position questions each.
- Universal screeners always run (≥1 light touch per node).
- Low-salience nodes' positions known only via screeners — that's the design intent.

**Risks:**
- More moving parts; harder to debug.
- Top-2 might be wrong: if Q103 ranks MAT highest but the respondent's "true" priority is CD, mandatory MAT drilling wastes 3 questions.
- Stop-rule interaction: if archetype converges before Tier 3b, the universal screener guarantee may not be reached.

---

## Comparison matrix

| Aspect | Proposal A | Proposal B | Proposal C |
|---|---|---|---|
| Implementation effort | Medium | Low | Medium-High |
| Predictability | Moderate (3 phases) | Low (EIG-driven) | High (explicit guarantees) |
| Adaptive room per session | 5-15 | 15-25 | 5-12 |
| Universal-touch coverage | Phase 1 forced | EIG decides | Tier 2 forced |
| High-salience drilling | EIG-weighted | EIG-weighted | Top-K mandatory |
| Low-salience signal | Only from screeners | Near-zero | Only from screeners |
| Risk of under-measuring | Low | Medium | Low |
| Risk of wasted question budget | Low | Low | Medium (mandatory top-K) |

## My recommendation

**Proposal A.** Lowest complexity-per-benefit ratio. Phase 1 forces salience establishment cleanly. Phase 2's conditional drilling is the simplest implementation of "skip position drilling on low-salience nodes." Phase 3 lets EIG handle the top-end. Universal screeners stay forced as a safety net.

If you want stronger guarantees on "more drilling for higher-salience nodes," Proposal C adds that explicitly at higher implementation cost. If you want pure simplicity, Proposal B trusts EIG to do everything but loses predictability.

**Open questions before any implementation:**

1. What threshold defines "active enough to drill"? Currently `salDist[0] ≥ 0.5` rules out, but a positive threshold (e.g., `expectedSal ≥ 1.5`) is needed to gate drilling.
2. Should `shouldStopEIG` be loosened to give adaptive selection more room? Currently fires after 4-8 adaptive picks.
3. Should the 5 universal-touch screeners be Phase 1 or Phase 2 in Proposal A? (Probably late Phase 1 — they help establish position before drilling decides which nodes to deepen.)

Pick a proposal and I'll implement it as a separate phase with regression testing.
