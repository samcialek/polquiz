# Question Rewrite — Draft Replacements

**Date:** 2026-04-27
**Scope:** Six static replacement questions per user spec.
**Out of scope this PR:** Dynamic deterministic conjoints (separate design pass after regression stabilizes), distance-weight-floor scoring changes.

**Correction from survey:** Q102 CD position weight is **0.15**, not 0.4. All Q102 position weights are sub-`MEANINGFUL_POSITION_WEIGHT (0.4)`, so Q102 provides no meaningful position drilling. This makes the Q101 split critical for CD position fidelity. After this PR, CD position drilling will come from Q223 (abortion grid) + Q224 (LGBTQ grid) at meaningful weight.

**Proposed new question IDs:** 219-224. Max existing ID is 218.

---

## 1. Retire Q19 (`human_progress_salience`)

**Old prompt:** *"When you think about the future, how much do you focus on whether humanity as a whole is getting better or worse?"*

**Action:** Delete from `questions.representative.ts` and `questions.full.ts`. ONT_H salience initial measurement is captured by Q103; ONT_H position is captured by Q210 (UNIVERSAL_SCREENERS) and Q207/Q208 (adaptive pool). Q49's replacement (below) will give ONT_H salience reinforcement via concrete tradeoff.

**Risk:** None significant. Pure-salience-only slider whose function is now redundant.

---

## 2. Replace Q49 — `progress_mechanism_tradeoff` (new ID 219)

| | Old (Q49) | New (Q219) |
|---|---|---|
| **Prompt** | "How much do you personally care about the question of whether society is making social progress?" | "Different people think 'progress' means different things. Pick the ONE you think matters MOST and the ONE that matters LEAST for whether a society is genuinely improving." |
| **Format** | slider (low="don't care", high="care deeply") | best_worst maxdiff (6 items, pick best + worst) |
| **Touches** | ONT_H sal 0.95, ONT_S sal 0.20 | ONT_H pos+sal, ONT_S pos+sal, MAT sal, PRO sal, CU pos |

**Items:**
1. `material_now` — *"Improving material conditions right now — jobs, healthcare, housing, food security"*
2. `human_cultivation` — *"Shaping people across generations through education, family, and culture"*
3. `institutional_capacity` — *"Building institutions capable of solving coordinated problems"*
4. `inherited_tradition` — *"Preserving the inherited communities and traditions that have worked"*
5. `rights_procedure` — *"Establishing fair rules and rights that protect everyone equally"*
6. `domination_prevention` — *"Preventing domination and conflict before they take hold"*

**Evidence mapping (best pick → strong; worst pick → opposite-strong):**

| Item | Picking BEST signals | Picking WORST signals |
|---|---|---|
| material_now | MAT sal high, ONT_H pos low (humans fixed → focus present) | MAT sal low |
| human_cultivation | ONT_H pos high + sal high (cultivation works) | ONT_H pos low + sal high (humans fixed) |
| institutional_capacity | ONT_S pos high + sal high | ONT_S pos low + sal high |
| inherited_tradition | CU pos low (uniformity), ONT_H pos high via tradition | CU pos high (pluralism preferred) |
| rights_procedure | PRO sal high, MOR sal high | PRO sal low |
| domination_prevention | ZS sal high, MOR pos high (broad concern) | ZS sal low |

**touchProfile:**
```ts
[
  { node: "ONT_H", kind: "continuous", role: "position", weight: 0.55, touchType: "progress_mechanism" },
  { node: "ONT_H", kind: "continuous", role: "salience", weight: 0.55, touchType: "progress_mechanism" },
  { node: "ONT_S", kind: "continuous", role: "position", weight: 0.50, touchType: "progress_mechanism" },
  { node: "ONT_S", kind: "continuous", role: "salience", weight: 0.50, touchType: "progress_mechanism" },
  { node: "MAT",   kind: "continuous", role: "salience", weight: 0.40, touchType: "progress_mechanism" },
  { node: "PRO",   kind: "continuous", role: "salience", weight: 0.40, touchType: "progress_mechanism" },
  { node: "CU",    kind: "continuous", role: "position", weight: 0.40, touchType: "progress_mechanism" },
]
```

**Coverage change vs. old Q49:** Old Q49 was ONT_H/ONT_S salience only (combined weight 1.15). New Q219 hits ONT_H pos+sal, ONT_S pos+sal, MAT sal, PRO sal, CU pos — total touches up from 2 to 7, three of them at meaningful position-drill weight (≥0.4) for ONT_H, ONT_S, CU. Net signal gain.

**Risk:** Maxdiff items must be balanced — no single "obviously correct" answer. The proposed items each have natural constituencies and the user's six categories already encode the design.

---

## 3. Replace Q51 — `priority_domain_tradeoff` (new ID 220)

| | Old (Q51) | New (Q220) |
|---|---|---|
| **Prompt** | "How important is the question of immigration and national identity to you personally?" | "Pick the ONE political topic that matters MOST to your political identity, and the ONE that matters LEAST." |
| **Format** | slider (low="not important", high="extremely important") | best_worst maxdiff (5 items) |
| **Touches** | CU sal 0.90, CD sal 0.25, TRB_ANCHOR via slider buckets | CU sal+pos, MAT sal, PRO sal, ZS sal, MOR sal, TRB_ANCHOR |

**Items:**
1. `immigration_identity` — *"Immigration and national identity — who belongs and on what terms"*
2. `economic_outcomes` — *"Economic policy — taxes, redistribution, jobs, who bears risk"*
3. `cultural_pluralism` — *"Cultural pluralism — protections for minority ways of life"*
4. `procedural_legitimacy` — *"Rule of law and procedural legitimacy — how decisions get made"*
5. `national_security` — *"National security and public order — keeping the country safe"*

**Evidence mapping:**

| Item BEST | Signals |
|---|---|
| immigration_identity | CU pos low (assimilationist) + CU sal high; TRB_ANCHOR national/mixed |
| economic_outcomes | MAT sal high |
| cultural_pluralism | CU pos high (pluralism) + CU sal high; MOR sal high; TRB_ANCHOR global/mixed |
| procedural_legitimacy | PRO sal high |
| national_security | ZS sal high; MOR pos low (in-group focus); TRB_ANCHOR national |

`immigration_identity` and `cultural_pluralism` both signal high CU salience but **opposite CU positions** — the maxdiff disambiguates assimilationist vs. pluralist preference, which the old slider couldn't.

**touchProfile:**
```ts
[
  { node: "CU",  kind: "continuous", role: "position", weight: 0.55, touchType: "domain_priority" },
  { node: "CU",  kind: "continuous", role: "salience", weight: 0.85, touchType: "domain_priority" },
  { node: "MAT", kind: "continuous", role: "salience", weight: 0.55, touchType: "domain_priority" },
  { node: "PRO", kind: "continuous", role: "salience", weight: 0.50, touchType: "domain_priority" },
  { node: "ZS",  kind: "continuous", role: "salience", weight: 0.45, touchType: "domain_priority" },
  { node: "MOR", kind: "continuous", role: "salience", weight: 0.35, touchType: "domain_priority" },
  { node: "TRB_ANCHOR", kind: "derived", role: "anchor", weight: 0.45, touchType: "domain_priority_anchor" },
]
```

**Coverage change:** old Q51 = CU sal + weak CD sal + weak TRB anchor (3 touches). New Q220 = CU pos+sal, MAT sal, PRO sal, ZS sal, MOR sal, TRB_ANCHOR (7 touches), three meaningful (CU pos at 0.55 above threshold). Disambiguates immigration vs. pluralism polarity.

**Risk:** "National security" item could pull MAGA/security-state respondents who actually care more about national identity but answer "security." Mitigated by `immigration_identity` being explicit. Item ordering may matter — randomize on render.

---

## 4. Replace Q69 — `bargain_tradeoff` (new ID 221)

| | Old (Q69) | New (Q221) |
|---|---|---|
| **Prompt** | "How important is it to you to find common ground with political opponents?" | "When a major political battle reaches a decision point and your side can't get everything it wants, which outcome do you prefer?" |
| **Format** | slider (low="stand on principle", high="compromise is essential") | single_choice (4 options) |
| **Touches** | COM sal 0.90 | COM pos+sal, MOR pos, PRO pos |

**Options:**
- `partial_win_now` — *"A partial win now that locks in 60% of what your side wanted, even if it disappoints the base"*
- `delayed_total_win` — *"A pure loss today that mobilizes future support for a complete win in 5-10 years"*
- `principled_loss` — *"Lose on principle today — compromising the issue's integrity is worse than losing"*
- `tactical_package_pass` — *"Whatever package can pass — political reality means you take what's available"*

**Evidence mapping:**

| Option | COM pos | COM sal | MOR pos | PRO pos |
|---|---|---|---|---|
| partial_win_now | 4 (compromiser) | mid-high | mid | mid-high |
| delayed_total_win | 2 (uncompromising long-game) | high (it matters) | high (broad future concern) | mid |
| principled_loss | 1 (max-uncompromising) | high | mid | mid |
| tactical_package_pass | 5 (max-compromiser) | low (it doesn't matter) | mid | low (outcome-focused) |

**touchProfile:**
```ts
[
  { node: "COM", kind: "continuous", role: "position", weight: 0.85, touchType: "bargain_tradeoff" },
  { node: "COM", kind: "continuous", role: "salience", weight: 0.50, touchType: "bargain_tradeoff" },
  { node: "MOR", kind: "continuous", role: "position", weight: 0.30, touchType: "bargain_tradeoff" },
  { node: "PRO", kind: "continuous", role: "position", weight: 0.30, touchType: "bargain_tradeoff" },
]
```

**Coverage change:** old Q69 = COM salience only (1 touch, weight 0.90). New Q221 = COM pos+sal, MOR pos, PRO pos (4 touches, COM pos at 0.85 strongly meaningful). Net gain: COM position read.

**Risk:** `delayed_total_win` and `principled_loss` are close in COM position (both uncompromising). The MOR/PRO side-touches help disambiguate — long-game vs. principled-loss. Wording should differentiate them clearly.

---

## 5. Replace Q38 — `procedure_outcome_tradeoff` (new ID 222)

| | Old (Q38) | New (Q222) |
|---|---|---|
| **Prompt** | "When evaluating a political outcome, how much do you care about whether the right process was followed, independent of the result?" | "When public-policy decisions go badly, which outcome bothers you MOST and which bothers you LEAST?" |
| **Format** | slider | best_worst maxdiff (5 items) |
| **Touches** | PRO sal 0.95 | PRO pos+sal, ONT_S pos+sal, MOR pos |

**Items:**
1. `due_process_violated_for_right_reason` — *"Due process being violated, even when the result was clearly the right one"*
2. `wrong_result_via_proper_process` — *"A genuinely wrong result reached through proper, fair procedures"*
3. `expert_override_for_speed` — *"Experts overriding the legislative process for speed in a crisis"*
4. `populist_bypass_of_courts` — *"Popular majorities bypassing courts to get the outcome the public wanted"*
5. `corruption_in_good_outcome` — *"Bribes, deals, or quiet pressure in the path to an otherwise good outcome"*

**Evidence mapping (worst pick = strongest signal):**

| WORST item | Signals |
|---|---|
| due_process_violated_for_right_reason | PRO pos high (max-procedural), PRO sal high |
| wrong_result_via_proper_process | PRO pos low (outcome-focused), PRO sal high |
| expert_override_for_speed | ONT_S pos low (institutional skepticism), PRO pos mid-high |
| populist_bypass_of_courts | PRO pos high, ONT_S pos high (institution-trusting) |
| corruption_in_good_outcome | PRO pos mid-high, MOR pos high |

**touchProfile:**
```ts
[
  { node: "PRO",   kind: "continuous", role: "position", weight: 0.75, touchType: "procedure_outcome_tradeoff" },
  { node: "PRO",   kind: "continuous", role: "salience", weight: 0.50, touchType: "procedure_outcome_tradeoff" },
  { node: "ONT_S", kind: "continuous", role: "position", weight: 0.40, touchType: "procedure_outcome_tradeoff" },
  { node: "ONT_S", kind: "continuous", role: "salience", weight: 0.30, touchType: "procedure_outcome_tradeoff" },
  { node: "MOR",   kind: "continuous", role: "position", weight: 0.30, touchType: "procedure_outcome_tradeoff" },
]
```

**Coverage change:** old Q38 = PRO sal only (1 touch, weight 0.95). New Q222 = PRO pos+sal, ONT_S pos+sal, MOR pos (5 touches, two meaningful: PRO pos 0.75, ONT_S pos 0.40). Net gain: PRO position + ONT_S extras.

**Risk:** `populist_bypass_of_courts` and `due_process_violated_for_right_reason` both signal high PRO when picked WORST. Disambiguating signal: ONT_S — populist-bypass-worst implies institution-trusting (ONT_S high); due-process-worst is procedural-purist regardless of ONT_S.

---

## 6. Split Q101 — `abortion_position` + `lgbtq_position` (new IDs 223 + 224)

Q101 currently bundles 6 distinct CD-content axes (reproductive rights / LGBTQ rights / gender identity / marriage / religious accommodation / pace-of-change) into one collapsed dual_axis. Splitting into two grids preserves CD signal AND lets respondents whose positions diverge across the bundled axes (e.g., progressive on LGBTQ + restrictive on abortion) be measured correctly.

Religious accommodation is already covered by Q206 (`religion_in_public_life`) in the adaptive pool. Pace-of-change is meta-position correlated with CD; we don't separately probe it.

### Q223 — `abortion_position_grid`

**Prompt:** *"Which best describes your view on abortion access in your country?"*

**Format:** single_choice (5 options)

**Options:**
- `abortion_legal_unrestricted` — *"Legal in all cases without legislative restrictions"*
- `abortion_legal_with_limits` — *"Legal in most cases with reasonable limits — for example, later-term restrictions or parental involvement for minors"*
- `abortion_restricted_health_exceptions` — *"Generally restricted, with exceptions for rape, incest, and serious health risks"*
- `abortion_restricted_life_only` — *"Heavily restricted; legal only when the mother's life is at risk"*
- `abortion_illegal_all_cases` — *"Illegal in all cases"*

**Evidence:**

| Option | CD pos | MOR pos | PRO pos |
|---|---|---|---|
| legal_unrestricted | 1 (max-progressive) | 4 (broad concern) | 2 (anti-procedural restriction) |
| legal_with_limits | 2 | 3-4 | 4 (procedural balance) |
| restricted_health_exceptions | 4 | 3 | 4 |
| restricted_life_only | 5 | 2 | 4 |
| illegal_all_cases | 5 | 1 (narrow scope) | 4 |

**touchProfile:**
```ts
[
  { node: "CD",  kind: "continuous", role: "position", weight: 0.65, touchType: "abortion_position" },
  { node: "MOR", kind: "continuous", role: "position", weight: 0.30, touchType: "abortion_position" },
  { node: "PRO", kind: "continuous", role: "position", weight: 0.20, touchType: "abortion_position" },
]
```

### Q224 — `lgbtq_position_grid`

**Prompt:** *"Which best describes your view on LGBTQ+ rights and gender identity?"*

**Format:** single_choice (5 options)

**Options:**
- `lgbtq_full_inclusion_with_gender` — *"Full inclusion in marriage, employment, healthcare, housing, military — including legal recognition of gender identity and gender-affirming care"*
- `lgbtq_marriage_yes_gender_complex` — *"Marriage equality and anti-discrimination yes; but gender identity questions deserve more cautious or case-by-case treatment"*
- `lgbtq_marriage_yes_no_special_protections` — *"Marriage equality yes; but no laws granting special protections beyond ordinary anti-discrimination"*
- `lgbtq_civil_unions_only` — *"Civil unions yes, but the term 'marriage' should be reserved for traditional definitions"*
- `lgbtq_traditional_only` — *"Traditional definitions of marriage and gender should be preserved in law and culture"*

**Evidence:**

| Option | CD pos | MOR pos |
|---|---|---|
| full_inclusion_with_gender | 1 | 5 (broad universalist) |
| marriage_yes_gender_complex | 2-3 | 4 |
| marriage_yes_no_special | 3-4 | 3 |
| civil_unions_only | 4 | 2 |
| traditional_only | 5 | 2 |

**touchProfile:**
```ts
[
  { node: "CD",  kind: "continuous", role: "position", weight: 0.70, touchType: "lgbtq_position" },
  { node: "MOR", kind: "continuous", role: "position", weight: 0.25, touchType: "lgbtq_position" },
]
```

**Coverage change vs. old Q101:** old Q101 = CD pos 0.80 + CD sal 0.75 (2 touches, one node). New Q223 + Q224 = CD pos 0.65 + 0.70, MOR pos 0.30 + 0.25, PRO pos 0.20 (5 touches). CD position weight per question is slightly lower than old Q101 (0.65/0.70 vs. 0.80) but two questions instead of one — and they correctly disambiguate the bundled issues.

CD salience reinforcement is lost (0.75 from old Q101). Compensate by:
- Q103 already establishes CD salience initial measurement
- Q4 (currently conditional) could be promoted to fixed if CD salience reinforcement matters
- The new questions are eligible only when CD salience is non-zero (per the position-question salience-floor gate), so they're self-gating — no need to re-establish salience first

**Risk:** Two questions for one cluster doubles the budget cost when both fire. Mitigated by salience-floor gate: low-CD-salience respondents won't see either. Higher-CD-salience respondents see both — exactly when we want detailed read.

---

## Summary table

| ID | Old | New | uiType | Primary nodes |
|---|---|---|---|---|
| Q19 | human_progress_salience | **RETIRED** | — | — |
| Q49 → Q219 | social_progress_salience | progress_mechanism_tradeoff | best_worst | ONT_H, ONT_S, MAT, PRO, CU |
| Q51 → Q220 | immigration_national_identity_salience | priority_domain_tradeoff | best_worst | CU, MAT, PRO, ZS, MOR, TRB_ANCHOR |
| Q69 → Q221 | common_ground_salience | bargain_tradeoff | single_choice | COM, MOR, PRO |
| Q38 → Q222 | rules_procedures_matter_salience | procedure_outcome_tradeoff | best_worst | PRO, ONT_S, MOR |
| Q101 → Q223 | cultural_social_placement_dual (bundle) | abortion_position_grid | single_choice | CD, MOR, PRO |
| Q101 → Q224 | (split #2) | lgbtq_position_grid | single_choice | CD, MOR |

**Net node-coverage delta:**
- ONT_H pos: gain (was 0 meaningful, now Q219 at 0.55) — fixes a real gap
- ONT_S pos: gain (Q219 at 0.50 + Q222 at 0.40)
- COM pos: gain (was 0, now Q221 at 0.85)
- PRO pos: gain (Q222 at 0.75)
- CD pos: net even (Q223 at 0.65 + Q224 at 0.70 vs. old Q101 at 0.80 — slightly more dispersed but not bundled)
- CD sal reinforcement: small loss (Q101 had 0.75); compensated by Q103 priorityBattery
- CU pos: gain via Q220 disambiguation
- MOR pos: gain across all six replacements

## Open questions before drafting source code

1. **Wording approval.** Each prompt and item needs your eyes — any phrasing you'd reject?
2. **Stage assignment.** All six should be `stage2` or `stage3` (adaptive-eligible), not `fixed12`. They should fire only when their primary node is salient enough (handled by Phase 3 salience-floor gate). OK?
3. **Quality scores.** Defaults of 0.92-0.95. OK or any of these you'd rate lower?
4. **`rewriteNeeded: false`** on the new ones. OK?
5. **Q4 (`cultural_social_salience`) handling.** Currently excluded from CORE_OPENER. Given Q101 retirement loses CD salience reinforcement, do you want Q4 promoted into UNIVERSAL_SCREENERS (would make 16 fixed front-door questions), or keep it adaptive?
