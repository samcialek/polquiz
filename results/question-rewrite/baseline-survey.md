# Question Rewrite — Baseline Survey

**Date:** 2026-04-27
**Scope:** Q19, Q38, Q49, Q51, Q69, Q101 — the abstract-salience-slider questions surfaced as weak adaptive picks in the Salience-Router divergence harness.
**Purpose:** Capture current state (text + uiType + node touches + node-coverage implications) before drafting rewrites, so we don't accidentally lose useful node touches.

## Per-question state

### Q19 — `human_progress_salience`

- **Stage:** screen20
- **uiType:** slider
- **Quality:** 0.93
- **Prompt:** *"When you think about the future, how much do you focus on whether humanity as a whole is getting better or worse?"*
- **Slider labels:** low = "rarely think about it" / high = "think about it constantly"
- **Touches:** ONT_H salience (weight 0.95) — pure salience read
- **Critique:** Abstract introspection ("think about humanity") rather than concrete worldview probe. Measures whether the respondent talks/thinks about progress, not what they actually believe about human malleability.

### Q38 — `rules_procedures_matter_salience`

- **Stage:** screen20
- **uiType:** slider
- **Quality:** 0.94
- **Prompt:** *"When evaluating a political outcome, how much do you care about whether the right process was followed, independent of the result?"*
- **Slider labels:** low = "doesn't matter - results are what count" / high = "matters enormously - process is everything"
- **Touches:** PRO salience (weight 0.95) — pure salience read
- **Critique:** The prompt frames it as a procedure-vs-outcome tradeoff but only captures *salience*. A respondent who answers "matters enormously" might be a hard proceduralist OR an outcome-egalitarian who wants procedures to enforce results. No position read.

### Q49 — `social_progress_salience`

- **Stage:** stage2
- **uiType:** slider
- **Quality:** 0.92
- **Prompt:** *"How much do you personally care about the question of whether society is making social progress?"*
- **Slider labels:** low = "don't care much" / high = "care deeply"
- **Touches:** ONT_H salience (weight 0.95) + ONT_S salience side (weight 0.2)
- **Critique:** Compounds two ambiguities — "social progress" is content-progressive-coded (vs. ONT_H's malleability-via-cultivation framing post-ADR-010), and the prompt asks how much you "care" rather than what you believe.

### Q51 — `immigration_national_identity_salience`

- **Stage:** screen20
- **uiType:** slider
- **Quality:** 0.93
- **Prompt:** *"How important is the question of immigration and national identity to you personally?"*
- **Slider labels:** low = "not important to me" / high = "extremely important to me"
- **Touches:** CU salience (weight 0.9) + CD salience side (weight 0.25) + TRB_ANCHOR via slider buckets (global / mixed_none / ideological / national)
- **Critique:** Single-domain salience slider. A respondent who marks immigration high-salience could be on either pole (open vs. closed). The TRB anchor signal is weak because slider-bucket evidence is rough.

### Q69 — `common_ground_salience`

- **Stage:** stage2
- **uiType:** slider
- **Quality:** 0.91
- **Prompt:** *"How important is it to you to find common ground with political opponents?"*
- **Slider labels:** low = "not important - stand on principle" / high = "extremely important - compromise is essential"
- **Touches:** COM salience (weight 0.9) — pure salience
- **Critique:** Salience-only slider on a node where COM position (uncompromising vs. compromise-seeking) is the meaningful dimension. The prompt wording arguably leaks position into salience: marking "extremely important" implies a compromise-seeking position.

### Q101 — `cultural_social_placement_dual`

- **Stage:** fixed12 (no longer in fixed front door post-Salience-Router; `priorityBattery` removed)
- **uiType:** dual_axis
- **Quality:** 0.88, **rewriteNeeded:** true
- **Prompt:** *"Place yourself on the social-direction spectrum — covering reproductive rights, LGBTQ rights, gender identity, marriage, religious accommodation, and how fast (or whether) social conventions should change. The horizontal axis is your position. The vertical axis is how much these issues matter to you."*
- **Touches:** CD position (weight 0.8) + CD salience (weight 0.75)
- **Critique:** User-flagged as the worst offender. Bundles **6 distinct issues** (reproductive rights, LGBTQ rights, gender identity, marriage equality, religious accommodation, speed of change) into one collapsed CD axis. A respondent whose progressive position on LGBTQ rights coexists with traditional position on abortion is forced to a single point on a single axis.

## Node-coverage implications of removing/replacing these

### What we lose if Q19/Q38/Q49/Q51/Q69 are deleted outright

| Node | Salience signal lost | Replacement available? |
|---|---|---|
| ONT_H | Q19, Q49 (both pure salience) | Q103 establishes initial; Q210 (UNIVERSAL_SCREENERS) is direct position; ONT_H direct probes Q207/Q208 in adaptive pool |
| PRO | Q38 (pure salience) | Q103 initial; Q207/Q208/Q21 in adaptive pool give PRO position; **gap: no PRO salience reinforcement** |
| ONT_S | Q49 side (weak) | Q103 initial; Q214 (UNIVERSAL_SCREENERS) is direct position |
| CU | Q51 (pure salience) | Q103 initial; Q102 (UNIVERSAL_SCREENERS) gives CU position; Q205 in adaptive |
| CD | Q51 side (weak) | Q103 initial; Q102 + Q4 (conditional) give CD; Q206 in adaptive |
| TRB anchor | Q51 slider buckets (weak) | Q60 (CORE_OPENER) is the canonical TRB anchor measure |
| COM | Q69 (pure salience) | Q103 initial; Q93 (UNIVERSAL_SCREENERS) gives COM position |

**Key takeaway:** the *initial* salience for every node is captured by Q103 (priorityBattery, weight ~0.9 across all 9 scoring nodes). The current Q19/Q38/Q49/Q51/Q69 sliders mostly reinforce salience that Q103 already established. Their loss leaves a salience-reinforcement gap, not an initial-measurement gap.

The *position* signal currently muddled inside these salience sliders is the real opportunity: a procedure-vs-outcome maxdiff (replacing Q38) gives PRO position evidence that the slider didn't deliver.

### What Q101 currently gates

- CD position (weight 0.8) — the strongest CD position touch in the bank
- CD salience reinforcement (weight 0.75)

If Q101 is removed without replacement, CD position drops to:
- Q102 weight 0.4 (meaningful threshold) — multi-touch, modest signal
- Q4 weight 0.85 (conditional, not currently in fixed front door)
- Q206 (religion in public life) weight ~0.5 — adaptive
- Q93 weight ~0.5 — meaningful but bundled with five other nodes

Replacing Q101 with **two separate grids** (abortion + LGBTQ) preserves the strong CD position signal *and* lets the geometry differentiate respondents whose positions diverge across the bundled axes (e.g., progressive LGBTQ + restrictive abortion).

## Priority order for rewrites (per user)

1. **Q101** — split into abortion grid + LGBTQ grid (or micro-conjoints), adaptive when CD high-salience or unresolved. Clearest conceptual flaw.
2. **Q51** — immigration salience → maxdiff against economics / pluralism / procedure / security. Multi-axis tradeoff captures both salience and position.
3. **Q69** — compromise salience → concrete bargain tradeoffs (partial win vs. pure loss vs. delayed victory).
4. **Q38** — procedure salience → procedure-vs-outcome maxdiff.
5. **Q19 / Q49** — retire or replace with concrete ONT_H/ONT_S tradeoffs (not "humanity better/worse" abstractions).

## Note on 024 → 031 misclassification

**024 Ethical Internationalist** persona dropped from top-3 entirely after Salience-Router (was → 022 Pluralist Universalist before; now → 031 Planetary Steward). This isn't an EIG issue alone — it's geometry: after Phase 4 archetype audits, both 024 and 031 received `ONT_S 3 → 4`, converging them.

Differentiating 024 from 031 likely needs:
- Sharper distinction on AES (024 has visionary 0.57; 031 has pastoral 0.62)
- Sharper distinction on EPS (024 institutionalist; 031 empiricist)
- Or: stronger MOR / domain-salience differentiation in the question bank

**Recommendation:** address as part of the rewrite pass rather than via scoring-floor changes. Better questions on foreign-policy / MOR / CU / MAT distinctions should give 024 stronger differentiating signal vs. 031.

## Open questions for you

1. **Replace vs. retire.** For Q19/Q49 (the "humanity progress" abstractions), do we **rewrite** them to concrete ONT_H/ONT_S tradeoffs, or **retire** entirely and rely on Q210/Q214 (UNIVERSAL_SCREENERS) + adaptive ONT_H/ONT_S probes?
2. **Conjoint library scope.** Your spec — "deterministic conjoints, vetted attribute-snippet library, assembled from top-K salience pairings" — implies an attribute library. Want this in the same workstream, or a separate design pass first?
3. **Drafting cadence.** I can draft rewrites in priority order one at a time (you review each before next), or draft all six and you review as a batch. Per-question-review is safer but slower.
