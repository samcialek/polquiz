# PRISM State Ledger

Updated: 2026-04-05

## 1. Base archetypes currently in code

Canonical source:
- `src\config\archetypes.ts`

Status:
- Base archetype system is **in code**.
- Current file contains the canonical PRISM archetype library (115 active archetypes per synced docs/context).

Representative implemented archetypes already in code include:
- `Partisan Tribalist`
- `Tribal Loyalist`
- `Loyal Democrat`
- `Loyal Republican`
- `Grievance Mobilizer`
- `Heritage Guardian`
- `National Protector`
- `Negative Partisan`
- `Spectator Citizen`
- `Civic Minimalist`
- `Good Neighbor`
- `Cosmopolitan Nonconformist`
- `Engaged Cosmopolitan`

Interpretation:
- These are the **actual canonical records** in runtime/source.
- Identity-primary labels like `Black Voter` / `White Grievance Voter` are **not** canonical archetype rows here.

---

## 2. Identity-primary overlays currently documented

Canonical docs now present in repo:
- `prism\identity-primary-60-election-mapping.md`
- `prism\identity-primary-overlay-reference.md`
- `prism\identity-primary-detection-and-output.md`
- `prism\identity-primary-implementation-phasing.md`
- `tmp\prism-implementation-checklist.md`
- `prism\IMPLEMENTATION-ORDER.md`

Documented overlay set:
- `The Black Voter`
- `The White Grievance Voter`
- `The Evangelical Voter`
- `The LGBTQ Voter`
- `The Feminist Voter`
- `The Male Grievance Voter`

Documented architecture:
- Overlay/modifier layer on top of base archetypes
- Three states: `latent`, `active`, `dominant`
- Three outputs: `no overlay`, `resolved overlay`, `unresolved identity-primary fit`
- Demographics are a **disambiguator**, not a standalone assigner
- ENG is an activation factor, not the main gate

---

## 3. Docs-only vs runtime-implemented

### Runtime-implemented / code-backed
- Base archetype library in `src\config\archetypes.ts`
- Core 14-node quiz/scoring system
- TRB / PF / ENG nodes already exist and are scored by the engine
- Q60/Q81 and related base quiz machinery exist per synced docs and codebase references
- Historical election code exists in `src\historical\*`

### Docs-present but not yet proven runtime-implemented
- Identity-primary overlay assignment system
- Overlay gate / unresolved-fit output behavior
- Overlay-specific narrative block on results page
- Election-specific overlay activation logic as a product/runtime feature
- Demographic disambiguation pipeline for overlays
- Full 6-overlay resolution logic in runtime
- Overlay-aware world-map / election-history rendering in runtime

### Best current truth
- Base archetypes = **in code**
- Identity-primary overlays = **documented in canon, but not yet proven as shipped runtime behavior**

---

## 4. What still needs implementation

### Phase 1 (small / next overlay phase, but AFTER core checklist)
- Identity-primary gate detection using existing scores
- `unresolved identity-primary fit` result state
- Q60-based hint logic for overlays that can be tentatively resolved without demographics
- Results-page narrative block for identity-primary output

### Phase 2 (requires demographics)
- Optional demographics collection
  - race / ethnicity
  - gender identity
  - denomination / religion detail
- Full overlay resolution logic
- Per-overlay narrative templates

### Phase 3 (later / richer outputs)
- Full 60-election personalized rendering
- World-map overlay outputs
- Mixed / competing overlay handling
- Overlay-aware archetype descriptions
- Activation dynamics over time

### Locked priority order
From canonical docs / handoff:
1. **Core checklist first**
2. **ONT_S flip first within core checklist**
3. **Overlay phase after core scoring repairs**
4. **Do not rename canonical archetypes based on overlay research alone**

Canonical implementation-order note:
- `prism\IMPLEMENTATION-ORDER.md`
