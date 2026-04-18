# ADR-002 — ENG Migration Out of Archetype Signatures

**Status:** Proposed, awaiting validation.

## Context

ENG (engagement) is structurally different from the other 13 nodes. A high-engagement and low-engagement respondent can share all other ideological features — same positions on MAT, CD, CU, MOR, PRO, EPS, AES, COM, ZS, ONT_H, ONT_S, PF, TRB — yet appear as different archetypes under the current schema. Encoding engagement as an archetype dimension inflates the taxonomy and creates spurious confusions between otherwise-identical ideological profiles.

Some of the 36 never-top-1 archetypes surfaced in Step 4 are suspected engagement-variant duplicates whose existence is an artifact of this encoding rather than a real distinction in political disposition.

Engagement is useful downstream for voting-prediction / turnout applications, but not as a classifier input at the archetype layer.

## Decision

ENG leaves archetype signatures. Build a separate participation/abstention module that computes an engagement label alongside the archetype assignment. Output surfaces both as a dual label: `<archetype>, <engagement level>`.

## Consequences

- 121 archetype signature edits to remove ENG touch targets.
- Review of ENG-touching questions (Q9, Q46, Q64, and others): some remain as inputs to the ENG module, some get re-scoped for non-ENG signal they also carry, some removed.
- Stop rule must not trigger on ENG convergence — ENG no longer discriminates archetypes.
- Identity-primary resolution in `src/identity/resolveIdentityPrimary.ts` currently gates on ENG and must be reworked under the new architecture.
- Expected consolidation of engagement-variant archetype pairs. Pairs will be flagged during implementation; merges are not executed in this ADR.

## Rejected alternatives

- **Keep ENG in signatures, accept inflated taxonomy.** Status quo. Rejected because the attractor and non-identifiability problems from Step 4 trace partly to engagement-variant confusion; fixing the taxonomy without removing the confound would leave the underlying problem intact.
- **Delete ENG entirely.** Rejected — engagement is needed for voting-prediction (Layer 4). The architectural correction is to isolate ENG to its own module, not discard it.

## Open questions

- Discrete engagement labels (apolitical / casual / engaged / highly-engaged) vs continuous score.
- Whether the ENG module has its own stop rule or ties to the main quiz stop rule.
- Exact output format for the dual label.
- Interaction with identity-primary: does IP still require high engagement as a gating condition under the new architecture, or is IP engagement-agnostic and ENG merely a co-label?
