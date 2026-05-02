# Opener redesign — design space + experimental sequence

**Date:** 2026-05-02
**HEAD:** `d542d57`
**Status:** thinking doc, no code/data changes proposed for shipping. Pairs with `q82-routing-audit.md`.

The current fixed opener is `SALIENCE_ROUTER_FIXED` (`src/engine/config.ts:140`) — 15 questions, deterministic order, every respondent answers the same 15 first. After slot 15, the selector enters TOP_K_DRILL → EIG_FILL phases.

This document inventories what those 15 slots actually buy, separates the redundant from the load-bearing, and lays out a sequenced experimental path from low-risk routed-question moves up to a possible Fixed-12 / contract-opener prototype.

---

## 1. Current opener job inventory

### 1.1 Job categories

| Job | What it produces | Required pre-dynamic? |
|---|---|---|
| **Vote-prediction metadata** | `state.partyID`, `state.strategicVoting`, `state.negativeParties` | Yes — `respondentVoteChoice.predictVote` reads these; missing partyID silently degrades partisan multiplier to 1.0 (the bug Sam fixed Apr 28) |
| **Salience routing** | Per-node `salDist` | Yes — downstream `isQuestionEligible` rule-out gate (`salDist[0] ≥ 0.5`) needs salience signal before dynamic phase |
| **Categorical anchors** | EPS / AES `catDist`; TRB anchor distribution | Yes (anchors hard to derive elsewhere); identity-primary resolver gates on TRB anchor |
| **Engagement / partisan-fusion floor** | PF / ENG `posDist` | Useful — engagement-label gate + identity-primary `engagementActive` flag depend on it |
| **Universal position floor** | ≥1 light position touch on every position node (MAT/CD/CU/MOR/PRO/COM/ZS/ONT_H/ONT_S) | **Convention, not strict requirement** — dynamic phase can adapt without it; current design treats it as "be conservative against Q103 mis-routing salience" |
| **Forced coverage** | Specific anti-attractor probes (none currently in fixed; Q207/Q213 etc. fire post-fixed via `FORCED_COVERAGE_PROBES`) | Conditional |

### 1.2 Per-question breakdown

`MEANINGFUL_POSITION_WEIGHT = 0.4` — touches at or above this count toward node-coverage caps (`MAX_POSITION_TOUCHES_TOP_K=4`, `MAX_POSITION_TOUCHES_NON_TOP_K=3`); below it they update posteriors but don't count toward quota.

#### CORE_OPENER (10 slots)

| # | qId | Job | uiType | Touches (meaningful position bolded) | Pre-dynamic required? |
|---|---|---|---|---|---|
| 1 | Q200 | metadata | single_choice | (none — writes `state.partyID`) | **Yes** (election compute) |
| 2 | Q103 | salience routing | priority_sort | salience@0.95 on all 11 topic-facing nodes (MAT/CD/CU/MOR/PRO/COM/ZS/ONT_H/ONT_S/EPS/AES) | **Yes** (sets eligibility for everything downstream) |
| 3 | Q97 | engagement/PF floor | single_choice | **PF/position@0.70**, **ENG/position@0.55** | Strong yes (no other PF probe in opener) |
| 4 | Q1 | engagement reinforcement | single_choice | **ENG/position@0.85** | **Soft** — Q97 already gives ENG@0.55 (meaningful); Q1 is reinforcement, not unique signal |
| 5 | Q60 | TRB anchor | priority_sort | TRB_ANCHOR/anchor@0.95 | **Yes** (only anchor source) |
| 6 | Q89 | EPS categorical | best_worst | EPS/category@0.85, EPS/salience@0.55 | **Yes** (primary EPS source) |
| 7 | Q22 | EPS tie-breaker | single_choice | EPS/category@0.92, EPS/salience@0.40 | **No** — by design, only useful when Q89 leaves EPS posterior bimodal |
| 8 | Q218 | AES categorical | best_worst | AES/category@0.95, AES/salience@0.35 | **Yes** (only AES source) |
| 9 | Q211 | metadata | single_choice | (none — writes `state.strategicVoting`) | **Yes** (election compute) |
| 10 | Q212 | metadata | multi-select | (none — writes `state.negativeParties`) | **Yes** (election compute) |

#### UNIVERSAL_SCREENERS (5 slots)

| # | qId | Job | uiType | Touches (meaningful position bolded) | Pre-dynamic required? |
|---|---|---|---|---|---|
| 11 | Q93 | universal position floor | priority_sort | **MAT/CD/CU/MOR/PRO/COM/position@0.55** (×6), salience@0.85 (×6) | Strong yes (sole multi-node position floor; covers 6 of 9 position nodes) |
| 12 | Q102 | civic-nationalist screen + CU sal | priority_sort | CU/position@0.30 (**below threshold** — does not count toward CU drilling quota), CU/salience@0.80 | **Soft** — position contribution is sub-threshold; the salience contribution duplicates Q93's CU/salience@0.85 |
| 13 | Q209 | ZS direct probe | single_choice | **ZS/position@0.85**, ZS/salience@0.50 | Convention (universal floor); ZS could land via dynamic |
| 14 | Q210 | ONT_H direct probe | single_choice | **ONT_H/position@0.85**, ONT_H/salience@0.40 | Convention (universal floor) |
| 15 | Q214 | ONT_S direct probe | single_choice | **ONT_S/position@0.85**, ONT_S/salience@0.50, PRO/position@0.25 (sub-threshold), ONT_H/position@0.10 (sub-threshold) | Convention (universal floor) |

### 1.3 What's missing

After the fixed 15, here's the meaningful-position-touch coverage:

| Node | Meaningful touches in opener | From which Q | Comment |
|---|---|---|---|
| MAT | 1 | Q93 | adequate |
| CD | 1 | Q93 | **bottleneck** — no clean direct CD probe; Q82 in dynamic is sole follow-up |
| CU | 1 | Q93 | **bottleneck** — Q102's CU is sub-threshold; Q82 in dynamic is sole follow-up |
| MOR | 1 | Q93 | **bottleneck** — no clean direct MOR probe in opener; Q213 fires conditionally post-fixed |
| PRO | 1 | Q93 | adequate (Q214's PRO@0.25 sub-threshold; Q207 forced-coverage post-fixed) |
| COM | 1 | Q93 | adequate |
| ZS | 1 | Q209 | adequate |
| ONT_H | 1 | Q210 | adequate |
| ONT_S | 1 | Q214 | adequate |
| PF | 1 | Q97 | adequate |
| ENG | 1–2 | Q97 + Q1 | **over-covered** if Q1 is included |
| TRB | 0 (position) | (Q60 anchor only) | TRB position derives from Q99/Q97 indirectly post-fixed; Sam flagged TRB-broken across all three Apr-29 dumps |

So: **CD, CU, MOR are under-covered** (1 meaningful position touch each); **ENG is over-covered** (potential redundancy); **TRB position has no opener probe** (only anchor).

---

## 2. Low-risk experiments (rank order)

These are surgical: each touches one routing rule and can be tested in isolation.

### 2.1 Q22 conditional on EPS ambiguity

**What:** Move Q22 out of the fixed sequence. Fire it only when Q89's EPS `catDist` posterior is bimodal (e.g., second-highest category prob ≥ 0.20 of top-category prob, or top-category prob < 0.55).

**Why low-risk:** Q22 is by definition an EPS tie-breaker. When Q89 is unambiguous, Q22 adds zero distinguishing signal — it's just a redundant EPS confirmation. For respondents whose Q89 is sharp (most of them), this saves 1 question with no information loss.

**Risk surface:** if the bimodality detector fires too often, EPS coverage degrades for ambiguous respondents. Detector threshold needs calibration.

**Expected savings:** ~0.5 question per respondent on average (conditional on actual Q89 ambiguity rate).

**Selector code change:** add a `conditionalNext` rule between fixed slot 6 (Q89) and slot 7 (current Q22) — if EPS not bimodal, skip Q22 and proceed to slot 8.

### 2.2 Q3 routed clean CD read when CD < 2 meaningful touches

**What:** Add Q3 (CD/position@0.90, single-node slider) to `FORCED_COVERAGE_PROBES` in `src/engine/selectorEIG.ts`. Fire it post-fixed when CD has fewer than 2 meaningful position touches and Q3 hasn't been asked.

**Why low-risk:** Q3 is already in the question bank, never selected by EIG, has a clean single-node touchProfile (no side touches). Adding it to forced-coverage mirrors the precedent set by Q207 PRO forced-coverage in PR 3.D.

**Risk surface:** adds 1 question to ~all respondents (CD has 1 meaningful touch from Q93 after the fixed phase, so the gate fires almost always). Net +1 question, but probably worth it for the CD direct-placement signal.

**Expected impact on dumps:** D1 fascist play CD final ↑ (Sam wants ≥4.5; HEAD is 4.03); D3 Jacobin CD final ↓ (Sam wants <1.5; HEAD is 1.64). Both improved by clean slider lock.

**Selector code change:** one entry in `FORCED_COVERAGE_PROBES`. This is the recommendation from `q82-routing-audit.md`.

### 2.3 Q8 routed clean MOR read when MOR < 2 meaningful touches

**What:** Symmetric to 2.2 for MOR. Add Q8 (MOR/position@0.90, single-node slider, "domestic_vs_abroad_lives") to `FORCED_COVERAGE_PROBES`. Fire when MOR has fewer than 2 meaningful position touches.

**Why low-risk:** Same shape as the CD case. MOR has the same "1 meaningful touch from Q93, then everything is dynamic" bottleneck. Q213 (existing forced-coverage probe) gives MOR position@0.85 but is gated on "within-polity" framing — different conceptual probe than direct moral-circle scope.

**Risk surface:** adds 1 question to most respondents. May overlap with Q213 if both fire — need to verify they're not duplicate signals (Q8 is "domestic vs abroad" framing — pure MOR scope; Q213 is "equal standing within the polity" — within-scope universalism). Probably complementary, not duplicate.

**Expected impact on dumps:** D2 MOR direction (Sam said wrong-direction, should be more universalist — MOR final 2.78, target >3) — Q8 lock-in could push it up if Sam's answer was universalist-leaning on the abroad axis. Need replay to confirm.

### 2.4 Q1 conditionalization or removal after Q97

**What:** Two options:
- **Option A (conditional):** Skip Q1 if Q97's ENG/position posterior is already well-resolved (e.g., expectedPos either ≤ 1.8 or ≥ 4.2 after Q97).
- **Option B (full removal):** Drop Q1 from the fixed sequence entirely. ENG coverage drops from 2 meaningful touches (Q97@0.55 + Q1@0.85) to 1 (Q97@0.55).

**Why this is the lowest priority of the four:** Q97's ENG@0.55 is meaningful but light. Q1's ENG@0.85 carries most of the ENG signal. Removing it could degrade engagement-label assignment, which in turn degrades the `engagementActive` flag in the identity-primary resolver and the abstain/vote clearing-bar in `respondentVoteChoice`.

**Risk surface:** ENG is structurally important (gates voting decisions, identity-primary activation). Don't touch this until 2.1–2.3 are validated.

**Expected savings:** 0–1 question depending on conditional vs full-remove.

---

## 3. Medium-risk opener redesigns

These touch the fixed sequence itself (not just the routing layer), which means they need both live-replay and eval-harness validation per the `CLAUDE.md` Selector / EIG Testing Split.

### 3.1 Merge Q211 + Q212 into a single voting-tendencies multi-select

**What:** Replace Q211 (strategic voting, single-choice) and Q212 (negative partisanship, multi-select) with one multi-select question whose options jointly capture both flags.

**Trade-offs:** Saves 1 question. Risk: a single multi-select with overlapping option semantics may confuse respondents and reduce signal quality on either flag. Both flags feed `respondentVoteChoice.predictVote` — degrading either silently misclassifies modern elections.

**Validation must include:** election-grid spot-check before/after on the three dumps to confirm no per-election vote-prediction regressions.

### 3.2 Replace Q209 + Q210 + Q214 with a 3-slider battery

**What:** Single screen, 3 sliders (ZS / ONT_H / ONT_S), each with the same direct-position semantics as the current Q209/Q210/Q214. UX-cost roughly equal to ONE single-choice question.

**Trade-offs:** Saves 2 questions. Slider-on-3-axes loses the per-question framing prose that Q209/Q210/Q214 currently use ("zero-sum economics view," "human malleability view," "institutions foundational"). Respondent has to internalize 3 semantically distinct dimensions in one screen — risk of order/anchoring bias.

**Validation:** UX prototype + spot-check that the slider battery's per-axis posteriors match what the current 3-question sequence produces.

### 3.3 Convert universal floor into adaptive contract-based opener

**What:** Replace the rigid "every position node gets one direct probe" rule with a **contract**: by end-of-fixed, every position node must have either (a) Q103 ruling it out as low-salience, OR (b) at least 1 meaningful position touch. If both conditions fail for a node, route a forced probe.

**Trade-offs:** Median respondent's opener shrinks (high-salience nodes get drilled by Q93; low-salience nodes get ruled out by Q103; only mid-salience nodes need explicit floor probes). Tail respondents (genuinely high-salience on every node) get longer openers.

**Risk surface:** Substantial logic change in selector. Breaks the "fixed N" contract that downstream code assumes. Wants its own ADR.

**Validation:** would need a population-distribution simulation showing the contract-opener length distribution stays sane (avg ≤ 12, p95 ≤ 16, etc.).

---

## 4. High-risk / future ideas

These need their own ADRs and prototype work. Not actionable without separate scoping.

### 4.1 Slider-first universal floor

Replace Q93 + Q102 + Q209 + Q210 + Q214 (5 slots, two priority sorts + three single-choice/sliders) with **one long-form 9-slider battery** — single screen, one slider per position node (MAT/CD/CU/MOR/PRO/COM/ZS/ONT_H/ONT_S). UX-cost comparable to one priority sort. Each slider gives clean single-node direct-placement evidence.

**Why interesting:** would resolve the CD/CU/MOR direct-placement bottleneck structurally — every node would have a clean direct probe in the opener. Q82's role would shrink to "useful follow-up" instead of "sole CD/CU probe."

**Why high-risk:** UX is unproven (9 sliders on one screen is dense). Slider-only evidence loses the relational signal that priority sorts capture (which-do-you-rank-higher comparisons). Requires UI design work + user-research validation.

### 4.2 Salience from telemetry instead of Q103

Q103 is the most expensive question in the bank (11-item priority sort). Its job is to produce a salience prior. Real salience is also revealed behaviorally — response time, extremity of slider answers, consistency across related questions. A Bayesian model over `(response_time × extremity × consistency)` could derive a salience signal from the first 5–6 substantive answers without requiring the explicit priority sort.

**Why interesting:** drops the heaviest UX item and replaces stated salience (what respondents say matters) with revealed salience (what their behavior shows matters).

**Why high-risk:** big refactor, unproven model, eligibility rule-out (`salDist[0] ≥ 0.5`) becomes harder to define from telemetry. Don't approach without a separate research spike.

### 4.3 Slot-12 calibration check

At the last fixed slot, show the respondent the engine's running estimate (e.g., "based on your answers so far, you're trending toward 'progressive on cultural issues, redistributionist on economics'") and ask **"does this fit?"**

A "no" answer is gold — tells the engine its read is off, and downstream questions weight as corrections. A "yes" answer enables an early-exit confidence path.

**Why interesting:** explicit meta-cognition layer; addresses the "engine over-conservative on extremes" calibration failure Sam flagged across D1/D3.

**Why high-risk:** UX redesign (showing a partial result mid-quiz changes the experience contract). Confirmation bias (respondents may say "yes" to anything that vaguely fits). Needs careful framing study.

### 4.4 Branching opener by Q103 salience profile

After Q103 (slot 2), branch on the salience profile:

- **High-engagement multi-axis** (many high-salience nodes): full 12-question fixed
- **Low-engagement narrow-axis** (most nodes ranked low): 8-question lite fixed → straight to dynamic
- **Single-issue voter** (one node super-high, others flat): 6-question fixed → straight to that node's drill

**Why interesting:** matches actual respondent variation. The current uniform 15-fixed is the conservative average; for 60%+ of respondents it's overkill.

**Why high-risk:** breaks "fixed" contract more deeply than 3.3. Selector logic needs branch-aware state. Needs ADR + simulation.

---

## 5. Recommended experimental sequence

Strict order. Each step gates on the previous step's validation passing.

| Step | Experiment | Type | Why this order |
|---|---|---|---|
| **A** | Q3 routed CD probe | Low-risk routing | Most direct fix to the actual surfaced calibration problem (CD under-extremity in D1/D3, CD-direction confusion in D2 pre-PR2). Doesn't touch Q82. Doesn't change fixed sequence. Smallest reviewable patch. |
| **B** | Q22 conditional EPS tie-breaker | Low-risk routing | Saves 1 question for sharp-EPS respondents. EPS calibration not currently flagged as broken in any dump verdict. Independent of CD work. Can run in parallel with A in principle but easier to review one at a time. |
| **C** | Q8 routed MOR probe | Low-risk routing | Mirrors A for MOR. Wait until A is shipped to confirm the forced-coverage pattern works as expected on a real bottleneck. |
| **D** | Q1 conditional / removal test | Low-risk but structurally sensitive | Touches engagement signal. ENG gates voting decisions and identity-primary activation. Run only after A/B/C show the routing infrastructure is sound and we have replay confidence. |
| **E** | Fixed-12 / contract-opener prototype | Medium-risk redesign | Bundles 3.1 + 3.2 + (compressed version of) 3.3. Only ship after A–D have validated each surgical move and we know which compressions are safe. |

Don't bundle. The temptation is to ship Fixed-12 as one patch (5 slots saved + 3 added). The dump-verdict signal doesn't justify that risk yet — each surgical move can be validated independently and reverted in isolation if it regresses.

---

## 6. Validation plan

For each experiment, the gate before push:

### 6.1 Live-replay (the three real dumps)

1. Replay D1 (`prism-dump-91d0dd27`, 088 Gentle Trad, fascist play)
2. Replay D2 (`prism-dump-aa6e60e8`, 056 Institutional Leftist, authentic)
3. Replay D3 (`prism-dump-e91e2338`, 011 Jacobin, authentic)

Per-dump, assert:
- **Final archetype unchanged** (no top-1 drift)
- **For D3 specifically: 011 stays top-1** (this is the known-fragile case)
- **Per-node final positions** for CD / CU / MOR / ZS / ONT_S move toward Sam's per-node verdicts (or at minimum don't regress)
- **Question count** stays in current envelope (live ~22–35; per-experiment delta within +1 or −2)

### 6.2 Apr-29 retake replay (if artifacts available)

Same gates against:
- Apr-29-A (`prism-dump-0cb89086`, 056 authentic)
- Apr-29-B (`prism-dump-720f5027`, 134 tankie play)
- Apr-29-C (`prism-dump-4901f789`, 085 fascist play)

These dumps post-date the PR 1+2+3 fixes, so any regression here is more recent and more diagnostic.

### 6.3 Eval harness regression

Run `src/eval/harness.ts` against the broader synthetic-population test suite. Gate:
- **Top-1** within −2pp of the current baseline (or improved)
- **Top-3** within −2pp of the current baseline (or improved)
- **Mean question count** within ±1.5

This catches population-level regressions that the 3 dumps alone miss.

### 6.4 Per-node final-position deltas (focus list)

For each dump replay, capture:

```
node    | HEAD   | post-experiment | delta | Sam's target direction
CD      | (val)  | (val)           | (Δ)   | (D1 ↑, D2 ↓, D3 ↓)
CU      | (val)  | (val)           | (Δ)   | (D1 ↓, D2 ~, D3 ↑)
MOR     | (val)  | (val)           | (Δ)   | (D2 ↑)
ZS      | (val)  | (val)           | (Δ)   | (D2 ↓)
ONT_S   | (val)  | (val)           | (Δ)   | (D2 ↑)
```

Any delta moving away from Sam's target direction is a flag for review.

### 6.5 D3/011 stays top-1 — explicit gate

Sam called out: "Q82 was reverted/held because its attempted change caused Dump 3 / archetype 011 drift." This is the known fragile case. EVERY experiment in the sequence above must explicitly assert D3 still resolves to 011 with confidence in the current band (cluster, ~3.96%). Margin loosening to "uncertain" band is a fail.

---

## Recommended first experiment

**Run experiment A: route Q3 as a forced-coverage CD probe.**

Why this first:
- Smallest reviewable patch (single entry added to `FORCED_COVERAGE_PROBES`).
- Targets the actual bottleneck identified in `q82-routing-audit.md` — CD under-coverage post-fixed, with Q82 the sole follow-up + a wash-out vector on its option D.
- Doesn't touch Q82's evidence map (so the held Q82 patch's D3/011 drift mechanism doesn't replay).
- Mirrors a known-working precedent (Q207 PRO forced-coverage in PR 3.D).
- Validation criteria are concrete and the per-dump replay can finish in one session.

If experiment A passes its validation gates, proceed to B (Q22 conditional). If A regresses any dump, hold and inspect — do not move to B/C/D until the routing infrastructure for A is sound.
