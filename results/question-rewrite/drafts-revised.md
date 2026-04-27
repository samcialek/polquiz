# Question Rewrite — Revised Drafts (post-user-review)

**Date:** 2026-04-27
**Status:** Revised per user sign-off with specific evidence-map corrections.

## Changes from initial draft

User's flagged issues — *"stop smuggling broad MOR, CU, or ONT_H judgments into items that mostly measure issue position or salience"*:

1. **Q219 `material_now`** no longer implies low ONT_H (caring about material today ≠ believing humans are fixed).
2. **Q219 `inherited_tradition`** no longer implies low CU (loving tradition ≠ wanting uniformity, unless wording explicitly says one shared culture). CU dropped from this item.
3. **Q220 `immigration_identity`** split into two opposite-position items: `immigration_restriction` (CU low) and `cultural_pluralism` (CU high). The bundled item was ambiguous.
4. **Q223 (abortion)** MOR dropped entirely. Pro-life logic can be universalist fetal-personhood — abortion position doesn't reliably inform MOR.
5. **Q224 (LGBTQ)** MOR weight reduced from 0.25 to 0.20 (modest, not dominant). CU added at 0.20 (LGBTQ inclusion correlates with pluralism).
6. **Q221 `delayed_total_win`** MOR weight reduced (was implicit "broad future concern"; now light).
7. **Q222** corruption item MOR pos high → MOR sal mid (cares about ethics, not "wide moral circle").

Plus quality scores per user spec, `bestWorstLabels` UI override added.

---

## Q219 — `progress_mechanism_tradeoff` (replaces Q49)

**Prompt:** *"Different people think 'progress' means different things. Pick the ONE you think matters MOST and the ONE that matters LEAST for whether a society is genuinely improving."*

**Format:** best_worst maxdiff (6 items)
**Quality:** 0.90
**bestWorstLabels:** default ("most" / "least") — fits prompt wording

**Items:**
1. `material_now` — *"Improving material conditions right now — jobs, healthcare, housing, food security"*
2. `human_cultivation` — *"Shaping people across generations through education, family, and culture"*
3. `institutional_capacity` — *"Building institutions capable of solving coordinated problems"*
4. `inherited_tradition` — *"Preserving the inherited communities and traditions that have worked"*
5. `rights_procedure` — *"Establishing fair rules and rights that protect everyone equally"*
6. `domination_prevention` — *"Preventing domination and conflict before they take hold"*

**Revised evidence mapping:**

| Item | BEST signal | WORST signal |
|---|---|---|
| material_now | MAT sal high | MAT sal low |
| human_cultivation | ONT_H pos high + sal high | ONT_H pos low + sal high |
| institutional_capacity | ONT_S pos high + sal high | ONT_S pos low + sal high |
| inherited_tradition | CD pos high (traditional) | CD pos low (progressive) |
| rights_procedure | PRO sal high, MOR sal mid | PRO sal low |
| domination_prevention | ZS sal high | ZS sal low |

**touchProfile:**
```ts
[
  { node: "ONT_H", kind: "continuous", role: "position", weight: 0.50, touchType: "progress_mechanism" },
  { node: "ONT_H", kind: "continuous", role: "salience", weight: 0.55, touchType: "progress_mechanism" },
  { node: "ONT_S", kind: "continuous", role: "position", weight: 0.50, touchType: "progress_mechanism" },
  { node: "ONT_S", kind: "continuous", role: "salience", weight: 0.50, touchType: "progress_mechanism" },
  { node: "MAT",   kind: "continuous", role: "salience", weight: 0.40, touchType: "progress_mechanism" },
  { node: "PRO",   kind: "continuous", role: "salience", weight: 0.40, touchType: "progress_mechanism" },
  { node: "CD",    kind: "continuous", role: "position", weight: 0.40, touchType: "progress_mechanism" },
  { node: "ZS",    kind: "continuous", role: "salience", weight: 0.30, touchType: "progress_mechanism" },
  { node: "MOR",   kind: "continuous", role: "salience", weight: 0.20, touchType: "progress_mechanism" },
]
```

CU dropped (was inferred from `inherited_tradition` low CU; per user note that's overreach).

---

## Q220 — `priority_domain_tradeoff` (replaces Q51)

**Prompt:** *"Pick the ONE political topic that matters MOST to your political identity, and the ONE that matters LEAST."*

**Format:** best_worst maxdiff (5 items)
**Quality:** 0.88
**bestWorstLabels:** default

**Items (revised — split `immigration_identity` into two opposite-position items):**
1. `immigration_restriction` — *"Restricting immigration and protecting national identity"*
2. `cultural_pluralism` — *"Cultural pluralism and protections for minority ways of life"*
3. `economic_outcomes` — *"Economic policy — taxes, redistribution, jobs, who bears risk"*
4. `procedural_legitimacy` — *"Rule of law and procedural legitimacy — how decisions get made"*
5. `national_security` — *"National security and public order — keeping the country safe"*

**Revised evidence:**

| Item BEST | Signal |
|---|---|
| immigration_restriction | CU pos low (assimilationist) + CU sal high; TRB_ANCHOR national |
| cultural_pluralism | CU pos high (pluralism) + CU sal high; TRB_ANCHOR global/mixed |
| economic_outcomes | MAT sal high |
| procedural_legitimacy | PRO sal high |
| national_security | ZS sal high; TRB_ANCHOR national |

The two CU-related items now clearly disambiguate: picking immigration_restriction → CU low; picking cultural_pluralism → CU high. Both signal high CU salience.

**touchProfile:**
```ts
[
  { node: "CU",  kind: "continuous", role: "position", weight: 0.55, touchType: "domain_priority" },
  { node: "CU",  kind: "continuous", role: "salience", weight: 0.85, touchType: "domain_priority" },
  { node: "MAT", kind: "continuous", role: "salience", weight: 0.55, touchType: "domain_priority" },
  { node: "PRO", kind: "continuous", role: "salience", weight: 0.50, touchType: "domain_priority" },
  { node: "ZS",  kind: "continuous", role: "salience", weight: 0.45, touchType: "domain_priority" },
  { node: "TRB_ANCHOR", kind: "derived", role: "anchor", weight: 0.45, touchType: "domain_priority_anchor" },
]
```

MOR dropped (was 0.35; user warned against smuggling MOR into security-frame items).

---

## Q221 — `bargain_tradeoff` (replaces Q69)

**Prompt:** *"When a major political battle reaches a decision point and your side can't get everything it wants, which outcome do you prefer?"*

**Format:** single_choice (4 options)
**Quality:** 0.92

**Options:**
- `partial_win_now` — *"A partial win now that locks in 60% of what your side wanted, even if it disappoints the base"*
- `delayed_total_win` — *"A pure loss today that mobilizes future support for a complete win in 5-10 years"*
- `principled_loss` — *"Lose on principle today — compromising the issue's integrity is worse than losing"*
- `tactical_package_pass` — *"Whatever package can pass — political reality means you take what's available"*

**Revised evidence (MOR weight reduced):**

| Option | COM pos | COM sal | MOR pos | PRO pos |
|---|---|---|---|---|
| partial_win_now | 4 | mid-high | mid (3) | 4 |
| delayed_total_win | 2 | high | mid (3) | mid |
| principled_loss | 1 | high | mid (3) | mid |
| tactical_package_pass | 5 | low | mid (3) | low |

**touchProfile:**
```ts
[
  { node: "COM", kind: "continuous", role: "position", weight: 0.85, touchType: "bargain_tradeoff" },
  { node: "COM", kind: "continuous", role: "salience", weight: 0.50, touchType: "bargain_tradeoff" },
  { node: "PRO", kind: "continuous", role: "position", weight: 0.30, touchType: "bargain_tradeoff" },
  { node: "MOR", kind: "continuous", role: "position", weight: 0.20, touchType: "bargain_tradeoff" },
]
```

---

## Q222 — `procedure_outcome_tradeoff` (replaces Q38)

**Prompt:** *"When public-policy decisions go badly, which outcome bothers you MOST and which bothers you LEAST?"*

**Format:** best_worst maxdiff (5 items)
**Quality:** 0.90
**bestWorstLabels:** `{ mostLabel: "bothers most", leastLabel: "bothers least" }`

**Items:**
1. `due_process_violated_for_right_reason` — *"Due process being violated, even when the result was clearly the right one"*
2. `wrong_result_via_proper_process` — *"A genuinely wrong result reached through proper, fair procedures"*
3. `expert_override_for_speed` — *"Experts overriding the legislative process for speed in a crisis"*
4. `populist_bypass_of_courts` — *"Popular majorities bypassing courts to get the outcome the public wanted"*
5. `corruption_in_good_outcome` — *"Bribes, deals, or quiet pressure in the path to an otherwise good outcome"*

**Revised evidence (MOR position high → sal mid only):**

| WORST item | Signals |
|---|---|
| due_process_violated_for_right_reason | PRO pos high, PRO sal high |
| wrong_result_via_proper_process | PRO pos low, PRO sal high |
| expert_override_for_speed | ONT_S pos low, PRO pos mid-high |
| populist_bypass_of_courts | PRO pos high, ONT_S pos high |
| corruption_in_good_outcome | PRO pos mid-high, MOR sal mid (cares about ethics, no MOR position inferred) |

**touchProfile:**
```ts
[
  { node: "PRO",   kind: "continuous", role: "position", weight: 0.75, touchType: "procedure_outcome_tradeoff" },
  { node: "PRO",   kind: "continuous", role: "salience", weight: 0.50, touchType: "procedure_outcome_tradeoff" },
  { node: "ONT_S", kind: "continuous", role: "position", weight: 0.40, touchType: "procedure_outcome_tradeoff" },
  { node: "ONT_S", kind: "continuous", role: "salience", weight: 0.30, touchType: "procedure_outcome_tradeoff" },
  { node: "MOR",   kind: "continuous", role: "salience", weight: 0.25, touchType: "procedure_outcome_tradeoff" },
]
```

---

## Q223 — `abortion_position_grid` (split #1 from Q101)

**Prompt:** *"Which best describes your view on abortion access in your country?"*

**Format:** single_choice (5 options)
**Quality:** 0.90

**Options:**
- `abortion_legal_unrestricted` — *"Legal in all cases without legislative restrictions"*
- `abortion_legal_with_limits` — *"Legal in most cases with reasonable limits — for example, later-term restrictions or parental involvement for minors"*
- `abortion_restricted_health_exceptions` — *"Generally restricted, with exceptions for rape, incest, and serious health risks"*
- `abortion_restricted_life_only` — *"Heavily restricted; legal only when the mother's life is at risk"*
- `abortion_illegal_all_cases` — *"Illegal in all cases"*

**Revised evidence (MOR REMOVED):**

| Option | CD pos | PRO pos |
|---|---|---|
| legal_unrestricted | 1 (max-progressive) | mid |
| legal_with_limits | 2 | 4 (procedural balance) |
| restricted_health_exceptions | 4 | 4 |
| restricted_life_only | 5 | 4 |
| illegal_all_cases | 5 | 4 |

**touchProfile:**
```ts
[
  { node: "CD",  kind: "continuous", role: "position", weight: 0.65, touchType: "abortion_position" },
  { node: "PRO", kind: "continuous", role: "position", weight: 0.20, touchType: "abortion_position" },
]
```

MOR dropped per user: pro-life can be universalist fetal-personhood logic, not narrow moral circle. Abortion position doesn't reliably inform MOR.

---

## Q224 — `lgbtq_position_grid` (split #2 from Q101)

**Prompt:** *"Which best describes your view on LGBTQ+ rights and gender identity?"*

**Format:** single_choice (5 options)
**Quality:** 0.88

**Options:**
- `lgbtq_full_inclusion_with_gender` — *"Full inclusion in marriage, employment, healthcare, housing, military — including legal recognition of gender identity and gender-affirming care"*
- `lgbtq_marriage_yes_gender_complex` — *"Marriage equality and anti-discrimination yes; but gender identity questions deserve more cautious or case-by-case treatment"*
- `lgbtq_marriage_yes_no_special_protections` — *"Marriage equality yes; but no laws granting special protections beyond ordinary anti-discrimination"*
- `lgbtq_civil_unions_only` — *"Civil unions yes, but the term 'marriage' should be reserved for traditional definitions"*
- `lgbtq_traditional_only` — *"Traditional definitions of marriage and gender should be preserved in law and culture"*

**Revised evidence (CU added at 0.20 weak, MOR reduced to 0.20):**

| Option | CD pos | CU pos | MOR pos |
|---|---|---|---|
| full_inclusion_with_gender | 1 | 5 (pluralism — different family forms) | 4 |
| marriage_yes_gender_complex | 2-3 | 4 | 3-4 |
| marriage_yes_no_special | 3-4 | 3 | 3 |
| civil_unions_only | 4 | 2 | 3 |
| traditional_only | 5 | 1 (uniformity) | 2 |

**touchProfile:**
```ts
[
  { node: "CD",  kind: "continuous", role: "position", weight: 0.70, touchType: "lgbtq_position" },
  { node: "CU",  kind: "continuous", role: "position", weight: 0.20, touchType: "lgbtq_position" },
  { node: "MOR", kind: "continuous", role: "position", weight: 0.20, touchType: "lgbtq_position" },
]
```

---

## Final summary

| ID | Title | Format | Quality | Primary nodes |
|---|---|---|---|---|
| Q19 | RETIRE | — | — | — |
| Q219 | progress_mechanism_tradeoff | best_worst | 0.90 | ONT_H, ONT_S, MAT, PRO, CD, ZS, MOR |
| Q220 | priority_domain_tradeoff | best_worst | 0.88 | CU, MAT, PRO, ZS, TRB_ANCHOR |
| Q221 | bargain_tradeoff | single_choice | 0.92 | COM, PRO, MOR |
| Q222 | procedure_outcome_tradeoff | best_worst | 0.90 | PRO, ONT_S, MOR |
| Q223 | abortion_position_grid | single_choice | 0.90 | CD, PRO |
| Q224 | lgbtq_position_grid | single_choice | 0.88 | CD, CU, MOR |

All `stage: "stage2"`, `rewriteNeeded: false` (with inline comment noting first-pass replacement pending regression).

**Q4 stays adaptive (NOT promoted into UNIVERSAL_SCREENERS) per user direction.**
