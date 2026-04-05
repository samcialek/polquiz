# PRISM Implementation Order

Canonical handoff note — 2026-04-05

## Core rule
**Fix the measurement instrument before adding the interpretive overlay layer.**

## Locked order
### 1. Core checklist first
Start with the existing PRISM implementation checklist:
1. ONT_S flip
2. question removals
3. remaps
4. enrichments
5. normalization enforcement
6. diagnostics rerun

Primary checklist source:
- `tmp\prism-implementation-checklist.md`

## 2. Overlay phase after core checklist
Only after the core checklist is complete:
- ship identity-primary overlay Phase 1
- unresolved identity-primary fit
- gate logic
- limited hinting / narrative block

Primary overlay phasing source:
- `prism\identity-primary-implementation-phasing.md`

## 3. Do not change canonical archetype naming based on overlay research alone
Current canonical archetype source remains:
- `src\config\archetypes.ts`

Identity-primary labels like:
- Black Voter
- White Grievance Voter
- Evangelical Voter

should be treated as **overlay research/design concepts**, not as automatic canonical archetype renames.

## 4. Next code starting point
If starting PRISM code work from this handoff, begin with:
- **ONT_S flip**
