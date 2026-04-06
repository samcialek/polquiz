# Identity-Primary Overlay — Implementation Phasing

## What exists now (research stack)
- Overlay architecture (6 overlays, three-state model, gate logic)
- 60-election mapping (latent/active/dominant per election)
- Node signatures (reference profiles)
- World-map profiles (geopolitical + structural affinity)
- Detection & output logic (gate, assignment, disambiguation, unresolved state)
- Compact reference doc

## What exists in PRISM codebase now
- 115 archetypes with 14-node signatures
- ~74 questions including Q60 (identity ranking) and Q81 (partisan identity)
- TRB, PF, ENG already scored by the engine
- No demographics collection
- No overlay system

---

## Phase 1: Ship Now (No new questions, no demographics)

### 1A: Gate detection
**What:** After quiz scoring, check if TRB ≥ 4 AND PF ≥ 4. Flag the person as "identity-primary pattern detected."

**Effort:** Small. It's a conditional check on existing node scores.

**Output:** Boolean flag + activation level (ENG determines latent/active/dominant).

### 1B: Unresolved identity-primary fit
**What:** If gate fires but no demographics exist, return "unresolved identity-primary fit" state. Don't guess which overlay.

**Output:** Results page says something like: *"Your responses show a strong identity-primary pattern — your politics appears driven more by group identity than by ideology. Without additional context, we can't determine the specific identity anchor."*

**Effort:** Small. One conditional block + one text template.

### 1C: Q60-based overlay HINT (no demographics)
**What:** If gate fires AND Q60 top-ranked identity is unambiguous (e.g., "sexual orientation/LGBTQ" or "religion/faith"), assign overlay tentatively. These don't need demographic disambiguation:
- **LGBTQ** — Q60 "sexual orientation" = top → assign (self-report is sufficient)
- **Evangelical** — Q60 "religion/faith" = top → assign as "religious identity-primary" (can't confirm evangelical specifically without denomination, but still useful)

**Cannot resolve without demographics:**
- Black vs White Grievance (both = Q60 "race")
- Feminist vs Male Grievance (both = Q60 "gender")

**Effort:** Medium. Requires reading Q60 ranking output + mapping logic.

### 1D: Identity-primary narrative block
**What:** Add an optional section to results page: "Identity & Coalition" that appears only when gate fires. Contains:
- Statement about identity-primary pattern
- If overlay resolved: historical coalition path, stickiness indicator
- If unresolved: general identity-primary explanation

**Effort:** Medium. Template writing + conditional display logic.

**Phase 1 total effort:** Small-medium. No new questions, no schema changes, no demographic collection.

---

## Phase 2: Add Demographics (Unlocks full overlay resolution)

### 2A: Add optional demographics question(s)
**What:** After main quiz, optional demographic screen:
- Race/ethnicity (multiple choice)
- Gender identity (multiple choice)
- Religious denomination (multiple choice or text)

**Design decision:** Make it optional and explain why: *"These help us contextualize your results. They don't affect your archetype score."*

**Effort:** Medium. New question UI + storage. But no scoring changes — demographics don't feed node scores.

### 2B: Full overlay resolution
**What:** With demographics + gate + Q60, resolve all 6 overlays:
- Race + Q60 race top → Black or White Grievance (+ ZS/CD/ONT_S check for White Grievance)
- Gender + Q60 gender top → Feminist or Male Grievance (+ supporting node check)
- Denomination + Q60 religion top → Evangelical (or not)
- Q60 sexual orientation top → LGBTQ (no demographic needed)

**Effort:** Medium. Assignment logic per detection-and-output.md spec.

### 2C: Overlay-specific narrative templates
**What:** Write 6 narrative blocks (one per overlay) covering:
- Coalition history summary
- Stickiness assessment
- Tension/contradiction callouts if archetype conflicts with overlay

**Effort:** Medium. Content writing, not code.

**Phase 2 total effort:** Medium. The demographics question is the main new feature.

---

## Phase 3: Later / Research-Only (Don't build yet)

### 3A: Full historical election rendering
**What:** Show the user their overlay's full 60-election path with latent/active/dominant states.

**Why later:** Cool but not essential for MVP. The compact summary from Phase 2C is sufficient.

**Blocked on:** Nothing technical — just prioritization.

### 3B: World-map visualization
**What:** Render geopolitical alignment + structural affinity layers for their overlay on an interactive map.

**Why later:** High effort (map UI), medium value (interesting but not core to the quiz experience).

**Blocked on:** Map component, country-level data, visualization design.

### 3C: Mixed/ambiguous overlay handling
**What:** Handle edge cases: people who score high on multiple identity anchors, intersectional identities (Black + feminist), overlays that conflict.

**Why later:** Rare cases. Phase 1-2 handles the clean majority. Edge cases can be flagged as "unresolved" until we have data on how common they are.

### 3D: Overlay-aware archetype descriptions
**What:** Rewrite archetype descriptions to incorporate overlay context. E.g., "Heritage Guardian + Evangelical overlay" gets a different description than plain "Heritage Guardian."

**Why later:** 115 archetypes × 6 overlays × 3 states = combinatorial explosion. Not worth writing until we know which combinations actually occur in real users.

### 3E: Activation dynamics over time
**What:** Model how overlays transition between states over a person's lifetime (not just historically). E.g., someone whose evangelical identity intensifies after a life event.

**Why later:** Research question, not product feature. Interesting but speculative.

---

## Dependency Map

```
Phase 1A (gate) ← nothing, ship immediately
Phase 1B (unresolved) ← 1A
Phase 1C (Q60 hint) ← 1A + Q60 output access
Phase 1D (narrative block) ← 1A + 1B + 1C

Phase 2A (demographics) ← product decision to add questions
Phase 2B (full resolution) ← 2A + 1A
Phase 2C (narrative templates) ← 2B

Phase 3A-3E ← 2B + design/prioritization decisions
```

---

## Recommendation

**Ship Phase 1 with the next PRISM update.** It requires no new questions, no demographics, no schema changes. Just:
1. Check TRB + PF after scoring
2. If high, check Q60
3. Show identity-primary narrative if detected
4. If overlay resolvable (LGBTQ, maybe evangelical), resolve it
5. If not, show "unresolved identity-primary fit"

That gets the overlay system into production with zero risk and real user-facing value.

**Phase 2 is the real unlock** but requires the demographics decision. That's a product question for Sam: does PRISM ask demographics?

---

## Open Questions for Sam

1. **Demographics:** Add optional demographic questions to PRISM? (Required for Phase 2)
2. **Q60 access:** Can the engine expose Q60 ranking output to the results layer? (Required for Phase 1C)
3. **Results page:** Is there space/design for an "Identity & Coalition" section? (Required for Phase 1D)
4. **Priority:** Is overlay worth shipping before the other implementation checklist items (ONT_S flip, question removals, enrichments)?
