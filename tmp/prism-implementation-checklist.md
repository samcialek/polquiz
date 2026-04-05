# PRISM Implementation Checklist
## Post-Question-Audit — Execution Plan

All decisions locked April 3, 2026. This is the implementation order.

## GLOBAL SCORING RULE (applies to all phases)
**Normalization principle:** For any node a question genuinely touches, the set of responses should represent the full meaningful range (0 to ~100) across that node. If a response does NOT implicate a node, it should contribute ZERO — not an arbitrary midpoint. No fake "meh/middle" defaults. Either a response speaks to a node (and spans the real range with other responses), or it doesn't (and contributes nothing).

---

## Files that need changes

### Primary code files (on desktop, polmodel-clean/)
1. **`prism-engine-bundle.js`** (172K chars, minified) — touchProfiles, optionEvidence, question definitions
   - OR the unminified source files that compile into it
2. **`prism-quiz-v2.html`** — question UI, prompt strings, ratio widget wiring
3. **Archetype definition files** — `PRISM_Full_Export.json` or FORKED variant, archetype JS files
4. **Results/display layer** — wherever ONT_S labels and descriptions render

### Key stats
- 74 total questions in engine
- 153 ONT_S references in engine (polarity flip scope)
- 11 questions directly touch ONT_S
- 7 questions to remove from engine
- Ratio widget exists in quiz HTML (49 refs) but extraction underused in engine (19 refs)

---

## PHASE 1: ONT_S Global Polarity Flip
**Risk: HIGH — cascading changes across entire system**
**Do this first because everything else depends on correct ONT_S direction.**

### Step 1.1: Flip ONT_S interpretation
- [ ] In engine scoring logic: reverse what "high" and "low" ONT_S mean
  - OLD: high = system broken, low = system stable
  - NEW: high = system stable/trustworthy, low = system broken
- [ ] Two implementation options:
  - **Option A:** Flip all 153 ONT_S references in engine (bin distributions, touchProfile directions)
  - **Option B:** Flip at the interpretation/display layer only (less invasive but riskier)
  - **Recommendation: Option A** — flip at the source so all downstream is consistent

### Step 1.2: Audit all 11 ONT_S-touching questions
Questions that currently reference ONT_S (verify each still makes sense after flip):
- [ ] political_content_frequency
- [ ] bad_outcomes_blame_allocation (Q20 — being enriched)
- [ ] controversial_speaker
- [ ] immigration_national_identity_salience
- [ ] university_admissions_approach
- [ ] criminal_trial_error_tradeoff (Q25 — being enriched)
- [ ] immigration_enforcement_error_tradeoff (Q33 — being enriched)
- [ ] fda_speed_vs_safety
- [ ] political_membership_criterion_rewrite
- [ ] integration_expectations_rewrite
- [ ] political_frustration (Q64 — already remapped)

### Step 1.3: Flip ONT_S in archetype definitions
- [ ] All 130+ archetypes that have ONT_S values — reverse their ONT_S scores
- [ ] Or flip the interpretation key in the archetype schema

### Step 1.4: Update display/results text
- [ ] Wherever ONT_S is described to users, update labels to match new polarity
- [ ] Node description strings, result cards, etc.

### Step 1.5: Validate
- [ ] Run a known test profile through and verify ONT_S scores make intuitive sense
- [ ] Check that archetype matching still produces sensible results

---

## PHASE 2: Remove 7 Questions
**Risk: LOW — straightforward deletion**
**Do this second to simplify the codebase before enrichment work.**

### Step 2.1: Remove from engine
- [ ] Q26 — vacation_new_vs_familiar
- [ ] Q32 — mainstream_media_accuracy_estimate
- [ ] Q45 — what_changed_minds_through_history
- [ ] Q46 — caregiver_emotional_availability
- [ ] Q53 — parents_politics_growing_up
- [ ] Q57 — parents_political_engagement
- [ ] Q58 — neighborhood_safety_childhood

### Step 2.2: Remove from quiz UI
- [ ] Remove question prompts and response elements from prism-quiz-v2.html
- [ ] Update stage/screen numbering if questions are removed from adaptive pool

### Step 2.3: Verify no dangling references
- [ ] Search for each removed question ID across all files
- [ ] Ensure no scoring path references a deleted question

---

## PHASE 3: Remap Q64 (political_frustration)
**Risk: MEDIUM — changing which nodes a question touches**
**Do this before general enrichment because Q64 is a structural remap, not just weight tuning.**

### Step 3.1: Remove PF from Q64 touchProfile
- [ ] Delete PF node reference from Q64's touchProfile

### Step 3.2: Add per-response node mappings
- [ ] corporate_power_inequality → MAT + ONT_S (low after flip = system broken)
- [ ] government_overreach → ONT_S (low) + light PRO
- [ ] both_sides_broken → ONT_S strong low
- [ ] system_unjust → ONT_S very strong low
- [ ] values_eroding → CD + light ONT_S
- [ ] politics_irrelevant → ENG low

### Step 3.3: Update optionEvidence distributions
- [ ] Build new bin distributions for each response × each node

---

## PHASE 4: Enrich Error-Tradeoff Questions (Q25, Q27, Q30, Q33)
**Risk: MEDIUM — adding salience extraction from ratio widget**
**These four share the same pattern: add ratio → salience.**

### Step 4.1: Implement ratio → salience extraction
- [ ] Build shared logic: ratio value (1.5:1 to 50+:1) → salience multiplier
  - 1.5:1 → low salience (mild preference)
  - 3:1 → moderate
  - 10:1 → high
  - 50+:1 → very high (strong conviction)
- [ ] Wire this into the scoring pipeline so ratio affects salience weight

### Step 4.2: Enrich Q25 (criminal_trial)
- [ ] PRO primary (already there)
- [ ] Add light MOR secondary
- [ ] Drop/minimize ONT_H
- [ ] Connect ratio → PRO salience

### Step 4.3: Enrich Q27 (welfare)
- [ ] MAT + MOR primary (already there)
- [ ] Add light PRO secondary
- [ ] Connect ratio → MAT salience + light PRO salience

### Step 4.4: Enrich Q30 (information control)
- [ ] PRO primary (already there)
- [ ] Keep EPS + COM light/secondary
- [ ] Connect ratio → PRO salience

### Step 4.5: Enrich Q33 (immigration)
- [ ] CU + MOR + PRO primary
- [ ] Add light TRB secondary
- [ ] Connect ratio → CU salience + light PRO salience

---

## PHASE 5: Enrich Allocation Questions (Q15, Q20, Q22)
**Risk: MEDIUM — adding concentration → salience logic**

### Step 5.1: Implement concentration → salience
- [ ] Build shared logic: if one allocation bucket has 80%+ → high salience for corresponding nodes
- [ ] Spread evenly → lower salience
- [ ] Could use Herfindahl index or simpler threshold logic

### Step 5.2: Enrich Q15 (inequality causes)
- [ ] Individual effort → high ONT_H, low MAT, HIGH ONT_S (system works)
- [ ] Systemic/structural → low ONT_H, high MAT, LOW ONT_S (system broken)
- [ ] Discrimination → similar to structural + slight MOR, very light TRB
- [ ] Luck/chance → low ONT_H, moderate ZS, ONT_S-neutral
- [ ] Add concentration → salience

### Step 5.3: Enrich Q20 (bad outcomes blame)
- [ ] Leaders/elites → low ONT_S, high ZS, very light TRB
- [ ] Systemic forces → low ONT_S, low ONT_H
- [ ] Individual citizens → high ONT_H, high ONT_S
- [ ] Bad luck/complexity → low ZS, low ONT_H, ONT_S-neutral
- [ ] Add concentration → salience

### Step 5.4: Enrich Q22 (factual estimates)
- [ ] Scientific research → EPS empiricist, slight PRO
- [ ] Personal experience → EPS autonomous, lighter PRO
- [ ] Religious/moral authority → EPS traditionalist, light CD, slight MOR
- [ ] Expert opinion → EPS institutionalist, light PRO
- [ ] Community/cultural wisdom → EPS traditionalist-adjacent, slight COM
- [ ] Add concentration → EPS salience

---

## PHASE 6: Enrich Remaining Keep Questions
**Risk: LOW-MEDIUM — adding secondary node touches**

### Step 6.1: Q24 (child_traits) — lightweight adjustment
- [ ] EPS primary (keep)
- [ ] ONT_H very modest (reduce weight if currently higher)

### Step 6.2: Q44 (views_changed) — lightweight adjustment
- [ ] Light PF only (high change → lower PF, low change → higher PF)
- [ ] Remove any EPS mapping
- [ ] Keep weight low

### Step 6.3: Q56 (effective_leader_style)
- [ ] AES dominant (keep)
- [ ] Add secondary: PRO differentiation, ENG, ZS, light PF
- [ ] channel_anger: low PRO, high ENG, light ZS high, light PF
- [ ] paint_vision: moderate ENG, light ZS low
- [ ] fight_to_win: low PRO, high ENG, high ZS, light PF
- [ ] master_policy: moderate PRO, EPS empiricist, low ZS
- [ ] build_coalitions: high PRO, EPS institutionalist

### Step 6.4: Q60 (politically_important_identities)
- [ ] Implement full ranking extraction (not just #1)
- [ ] Rank-weighted scoring (top = positive, bottom = negative)
- [ ] PF from ideological identity ranking
- [ ] TRB from national/ethnic/global ranking
- [ ] NO ENG, NO MAT secondaries
- [ ] Add cluster bonuses (ideological+class, national+ethnic, global+bounded-low)
- [ ] Add tribal target vector output (feeds identity-primary archetype system later)

### Step 6.5: Q63 (best_worst_battery)
- [ ] Implement salience as main payload (not just direction)
- [ ] MOST = strong positive salience + moderate direction
- [ ] LEAST = strong negative salience + lighter inverse direction
- [ ] MOST/LEAST asymmetric weighting
- [ ] Add pair interaction bonuses
- [ ] Primary nodes: MAT, PRO, CD, TRB, ZS, COM, maybe MOR

### Step 6.6: Q81 (party_vs_cause_loyalty)
- [ ] PF primary (keep)
- [ ] Add: say_so_publicly → light PRO
- [ ] Add: stick_with_side → light ZS
- [ ] Keep TRB light throughout
- [ ] ENG secondary

### Step 6.7: Q82 (openness_assimilation_closure)
- [ ] CD/CU/MOR primary (keep)
- [ ] Add TRB: preserve_culture → high, civic → moderate, open_pluralist → low
- [ ] economics_first → MAT salience boost + CD/CU salience decrease

### Step 6.8: Q85 (institutional_legitimacy_source)
- [ ] PRO primary (keep)
- [ ] inherited_tradition → high CD, EPS traditionalist, slight high ONT_S
- [ ] procedural_rules → moderate COM, EPS empiricist/autonomous, high ONT_S
- [ ] order_and_results → moderate CD, slight high ZS, mid ONT_S
- [ ] justice_first → very low PRO, don't force COM

---

## PHASE 7: Scaffold Identity-Primary Architecture
**Risk: LOW — additive, doesn't break existing system**
**Do this last — it's new infrastructure, not fixes.**

### Step 7.1: Add tribal target vector to data model
- [ ] Define: tribal_target_national, tribal_target_ethnic, tribal_target_religious, tribal_target_class, tribal_target_ideological, tribal_target_global
- [ ] These are derived from Q60 ranking + demographics, stored alongside 14 nodes

### Step 7.2: Define identity-primary gate
- [ ] If TRB high + PF high + ENG ≥ medium + other nodes low-salience → candidate for identity-primary family

### Step 7.3: Create placeholder archetype family
- [ ] Define the structural concept in archetype schema
- [ ] Leave specific identity archetypes for after research phase

---

## DEPENDENCY MAP

```
Phase 1 (ONT_S flip) ──→ Phase 2 (removals) ──→ Phase 3 (Q64 remap)
                                                        │
                                                        ▼
                                              Phase 4 (error-tradeoffs)
                                              Phase 5 (allocations)
                                              Phase 6 (remaining enrichments)
                                                        │
                                                        ▼
                                              Phase 7 (identity scaffold)
```

- Phase 1 MUST be first (everything depends on correct ONT_S)
- Phases 2-3 should be next (clean up before adding complexity)
- Phases 4-6 can be parallelized or done in any order
- Phase 7 is independent and can start anytime after Phase 1

---

## VALIDATION CHECKPOINTS

After each phase:
- [ ] Run test profiles through engine
- [ ] Verify archetype matching still produces sensible results
- [ ] Check that no scoring paths reference deleted/renamed items
- [ ] Spot-check a few known archetype profiles against expected node signatures

---

## WHO DOES WHAT

- **Desktop** has the polmodel-clean source code and can make direct code changes
- **Laptop** has cached copies for reference but cannot edit source
- **Sam** approves before any phase goes live
- **Coordination:** Desktop implements, laptop reviews/validates logic, Sam spot-checks results
