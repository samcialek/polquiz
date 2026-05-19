# Phase 7 — Gap Analysis Decision Matrix

**Date:** 2026-05-19
**Source:** Phase 6 battery findings (15/15 personas, 139/139 assertions post-P2, exit 0)
**Specs evaluated:** Q240 (anti-establishment frame), Q241 (econ vs cultural primacy), Q242 (party alignment self-assessment), Q243 (legislative compromise threshold)
**Recommended priority:** F2 → F3/F5 → F6 → F1

---

## Six findings — one-line summary

| # | Finding | Severity | Affected personas | Product-visibility |
|---|---|---|---|---|
| F1 | Static-position model can't capture temporal vote evolution | HIGH (architectural) | obama-to-trump, hispanic-d-to-trump, never-trump-republican, triple-switcher, libertarian-republican | Vote prediction is wrong for ~5 of 15 personas in specific years |
| F2 | Q97 PF/ENG coupling forces tradeoff between highly-engaged and 2016-T vote capture | MEDIUM | bernie-progressive, never-trump-republican, libertarian-republican | Personas needing both highly-engaged + protest-vote routing can't have both |
| F3 | Diagnostic top-K includes IDP archetypes even when overlay is `none` | LOW (diagnostic, not user-visible) — RESOLVED Phase 7 P2 | disengaged-centrist top-1 reported as #145 Feminist Voter | Only visible in harness reports; user-facing composed label was always correct |
| F4 | Engagement→abstain doesn't fully suppress Obama-era D votes for centrists | LOW | disengaged-centrist 2008/2012 | Cosmetic mis-prediction at edge of voting threshold |
| F5 | Archetype-space gaps: libertarian, nihilist, centrist-apolitical | MEDIUM | libertarian-republican (→#042), nihilist (→#124), disengaged-centrist (→#042 after P2) | Three personas land at archetypes that don't really own their family |
| F6 | Q102 religion item over-pulls scoped religious affinity for assimilationist Christians | LOW (silent) | obama-to-trump (routes to Evangelical Voter despite cross-pressured framing) | Spurious Evangelical Voter routing for non-religious-frame voters |

---

## Q240-Q243 → does each solve a Phase-6 finding?

### Q240 — `anti_establishment_frame` (single_choice)

**What it does:** Direct elite-capture probe. Writes ONT_S pos + ZS pos. Captures the structural "is the system captured?" axis.

**Solves any Phase-6 finding?** **NO** — not a clean fix for any.

| Finding | Why Q240 doesn't fix it |
|---|---|
| F1 temporal | Q240 captures attitudinal state, not temporal vote evolution. The 2020 D vote misses persist. |
| F2 Q97 coupling | Orthogonal — Q240 doesn't touch PF or ENG. |
| F3 force-route to Feminist Voter | Disengaged centrist would pick `institutional_drift` or `basically_fine` — neither sharpens away from the IDP attractor. |
| F5 archetype gaps | Adds ONT_S/ZS signal but doesn't add a libertarian or nihilist archetype to land at. |
| F6 Q102 religion | Orthogonal — doesn't touch moralCircle scoped affinities. |

**Independent value (not in Phase-6 findings):** Q240 would tighten the realignment-persona family (Abstain→Trump, Obama→Trump, Hispanic D→Trump) discrimination. Currently those personas correctly distinguish but on indirect signal. Q240 would make that distinction first-class.

**Recommendation:** **DEFER.** Strong rationale on its own merits, but doesn't address surfaced findings. Revisit when adding cross-pressured-family granularity (Phase 8+).

---

### Q241 — `economic_vs_cultural_primacy` (single_choice)

**What it does:** Forced-trade-off between MAT-primacy and CD-primacy. Writes MAT salience + CD salience. Position-neutral.

**Solves any Phase-6 finding?** **NO** — not a clean fix for any.

| Finding | Why Q241 doesn't fix it |
|---|---|
| F1 temporal | Q241 establishes relative priority, not temporal change. |
| F2 Q97 coupling | Orthogonal. |
| F3 force-route | Disengaged centrist would pick `probably_abstain` — useful confirmation of low engagement but doesn't fix the archetype lookup. |
| F4 engagement→abstain | Q241's `probably_abstain` option does write low-salience on both MAT and CD; might marginally tighten the abstain decision. Speculative. |
| F5 archetype gaps | No new archetypes. |
| F6 Q102 religion | Orthogonal. |

**Independent value:** Q241 was specifically designed to separate Obama→Trump (culture-wins) from Bernie-progressive (economics-wins). In the current battery these two land at distinct archetype families already (#084 vs #001), so the discrimination is already adequate. Q241 would tighten EIG when MAT and CD are both salient on Q103.

**Recommendation:** **DEFER.** Worthwhile for selector EIG sharpening but not addressing surfaced findings. Revisit if a future persona shows MAT/CD salience confusion.

---

### Q242 — `party_alignment_self_assessment` (single_choice)

**What it does:** Probes whether party attachment is ideologically grounded or tribally reflexive. Writes moralCircle.scopedAffinities.ideological + COM pos + ZS pos. Separates Never-Trump R (selective fit) from MAGA all-in (reluctant partisan).

**Solves any Phase-6 finding?** **PARTIAL — touches F3 indirectly.**

| Finding | Effect of Q242 |
|---|---|
| F1 temporal | Q242 captures current partisan loyalty — could be a *partial* signal for the partisan-loyalty axis F1 calls for. Not a full solution (still single-snapshot). |
| F2 Q97 coupling | Orthogonal. |
| F3 force-route | The persona-eligibility gate `has_declared_party` means Q242 doesn't fire for `partyID: "none"` personas like disengaged-centrist — so it doesn't help that case. |
| F5 archetype gaps | Q242 writes ideological scoped — could push reluctant-partisan personas toward a "Negative Partisan" archetype (#132 exists). Doesn't add libertarian/nihilist. |
| F6 Q102 religion | Orthogonal. |

**Independent value:** Currently Never-Trump R (#053 Consensus Builder) and MAGA all-in (#105 Combative Populist) land at distinct archetypes already — the discrimination is solved. Q242 would tighten it further and could help on the F1 partisan-loyalty axis if extended with a temporal frame.

**Recommendation:** **DEFER, but as a candidate building block for F1.** When we eventually address F1 (partisan-loyalty axis), Q242's `closely_aligned`/`reluctant_partisan` framing is a natural piece of that mechanism.

---

### Q243 — `legislative_compromise_threshold` (slider)

**What it does:** Concrete-scenario COM probe (slider). Designed to break the 021 Principled Cosmopolitan → 001 Rawlsian Reformer attractor that Q7's coalition_vs_principle question fails to resolve. Also discriminates 108 Passive Cynic from 114 Political Nihilist.

**Solves any Phase-6 finding?** **NO** — addresses an attractor problem not surfaced by the harness battery.

The 021→001 attractor was documented in `CLAUDE.md` (Stage 4 deferred), not in Phase-6 findings. None of our 15 personas hit the 021/108/114 archetypes; the cosmopolitan-attractor problem is invisible to the current battery.

**Recommendation:** **DEFER** until either (a) a cosmopolitan persona is added to the battery, or (b) the cosmopolitan-attractor problem becomes load-bearing for a real run.

---

## Summary of Q240-Q243 disposition

| Question | Phase-6 finding solved | Independent value | Verdict |
|---|---|---|---|
| Q240 | None | Realignment-family discrimination (Abstain/Obama/Hispanic) | DEFER |
| Q241 | None | MAT/CD primacy when both salient | DEFER |
| Q242 | Partial F1 building block | Never-Trump R vs MAGA tightening | DEFER (revisit during F1) |
| Q243 | None | 021→001 attractor (out of battery scope) | DEFER |

**No Q240-Q243 should be added now.** They each have an independent rationale, but none addresses the six harness-surfaced findings. Adding them would expand the bank without resolving the observed problems.

---

## Recommended path forward (Sam's priority)

### Priority 1 — F2 (Q97 PF/ENG coupling)

**Scope:** Smallest, most local fix.

**Problem statement:** Q97 emits both PF.pos and ENG.pos from the same option choice. Setting persona.PF and persona.ENG independently is impossible — the answer engine picks one option, which writes both. Affects bernie-progressive, never-trump-republican, libertarian-republican.

**Fix options:**

| Option | Description | Effort | Risk |
|---|---|---|---|
| A | Split Q97 into Q97a (PF position) + Q97b (ENG position) | 1 session | Adds a question — slight quiz lengthening |
| B | Weaken Q97's PF emission to weight 0.30 (currently 0.70); keep ENG as primary | 1 hour | Minimal — PF gets compensating signal from Q2 / Q87 |
| C | Drop Q97's PF touch entirely; route PF via Q2 (already in bank) | 1 hour | PF coverage may drop slightly; Q103 salience screener still picks up high-PF personas |

**Recommended:** **Option B.** Smallest change, preserves Q97's role in the salience-router fixed front door, fixes the harness tradeoff. The PF signal at weight 0.30 is still meaningful but doesn't dominate ENG when they conflict in a persona declaration.

**Verification:** rerun battery — bernie-progressive, never-trump-republican, libertarian-republican should clear highly-engaged AND keep their existing votes (including libertarian's 2016 T capture).

---

### Priority 2 — F3 + F5 (diagnostic-ranking IDP leakage + archetype gaps)

**F3 resolved Phase 7 P2 (2026-05-19):** initial diagnosis was wrong.
`resolveIdentityPrimary` correctly returned `none` for disengaged-
centrist all along. The unwanted #145 Feminist Voter top-1 was coming
from `getTopArchetypesForDiagnostics()` ranking IDP archetypes
(IDs 141-146) against base archetypes by raw distance. Per CLAUDE.md
"Do NOT conflate Identity Primary overlays with base archetypes —
they are a separate layer applied *after* archetype assignment."
Fix: filter IDs 141-146 from the diagnostic ranking by default;
opt-in via `includeIdentityPrimary: true` for debugging. The
user-facing composed label (`Redistributionist Apolitical Voter`)
was always correct.

**Problem statement (F3, post-correction):** Diagnostic top-K
included IDP archetypes that should never appear in base-archetype
rankings. Low impact (diagnostic only) but conceptually clean to fix.

**Problem statement (F5):** Libertarian (#042 Localist Progressive instead of a true libertarian archetype), nihilist (#124 Latent Alarmist instead of a nihilist-specific archetype), and disengaged-centrist (now #042 Localist Progressive after the F3 fix — still imperfect) hit archetype-space gaps.

**F3 was fixed by a small diagnostic-hygiene change, not the originally-proposed resolver gating.** See "F3 resolved" note above.

**Fix options for F5:** Adding new archetypes is a bigger move — 121-archetype count is in CLAUDE.md "DO NOT CHANGE" as a deliberate stability anchor. Don't add archetypes unless an existing one is being replaced. For the libertarian/nihilist/centrist-apolitical gaps, the answer is probably "accept routing via co-located dimensions, document as known semantic gap." P2's diagnostic-ranking fix already removed the false-IDP-routing confusion; the remaining issue (no clean centrist-apolitical home archetype) is a real space-coverage gap, not a routing bug.

**Recommended for F5:** **Document and accept.** The libertarian / nihilist personas land at semantically-related archetypes; they're not catastrophically misrouted. Defer archetype additions until a stronger product case emerges.

---

### Priority 3 — F6 (Q102 religion over-pull)

**Scope:** Question rewrite OR new separator question.

**Problem statement:** Q102's `religion` item writes `moralCircle.scopedAffinities.religious=75` when placed in supportMid. For an assimilationist Christian persona (cultural-conservative but not religiously-organizing), this is enough to push religious excess above national excess, routing to Evangelical Voter IDP — even when the persona was designed as cross-pressured economic, not religious. Affects obama-to-trump.

**Sam's preference:** "separator question over blindly weakening Q102."

**Fix options:**

| Option | Description | Effort | Risk |
|---|---|---|---|
| A | Add Q244 separator question: explicit "is religious tradition a *political* organizing dimension for you, or just a cultural background?" | 1 session | Adds a question; some respondents may find the distinction subtle |
| B | Weaken Q102 religion item: split into two items (`religion_as_cultural_heritage` and `religion_as_political_organizing`) — first emits less religious scoped; second emits the full 75 | 2 hours | Q102 already has 8 items; splitting religion to 2 makes 9 |
| C | Lower Q102 religion's emit value from 75 to 60, so supportMid placements stay below the 70 IDP threshold | 30 min | Affects all personas marking religion in supportMid, not just the cross-pressured one |

**Recommended:** **Option A** (per Sam's preference). The separator question is a clean diagnostic that lets respondents who self-identify as culturally-Christian but politically-secular signal that explicitly. Q102 stays untouched; the new question runs only when religion was placed in supportMid or supportHigh on Q102.

---

### Priority 4 — F1 (temporal vote evolution)

**Scope:** Architectural.

**Problem statement:** Static-position model maps positions → candidate distance → vote. Cycle-to-cycle vote switching driven by salience shocks or partisan loyalty shifts cannot be represented. Affects 5 personas in specific years.

**Sam's framing:** "Worth documenting, not worth rushing."

**Fix options:**

| Option | Description | Effort | Risk |
|---|---|---|---|
| A | Add a partisan-loyalty axis distinct from policy positions; era-context modulates which weights apply per cycle | Multi-session, architectural | High — touches the engine + scoring + archetype signatures |
| B | Salience-shock mechanism: per-cycle salience multipliers that can shift candidate distances year-over-year for the same persona | Multi-session | High — touches respondentVoteChoice.ts + era-activations.json |
| C | Document as known limitation; accept persona-specific voteMatchMin values; build "what would unblock this" tickets for the next architecture review | 1 session | Zero engineering risk; accepts existing 2/5–4/5 misses for affected personas |

**Recommended:** **Option C for now.** F1 is the architectural ceiling on what a static-position model can achieve for temporal voters; addressing it should be a deliberate roadmap project, not a Phase-7 quick win. The voteMatchMin findings already document the gap. When/if a future architecture pass tackles temporal evolution, Q242's `closely_aligned`/`reluctant_partisan` framing is a natural building block (see Q242 disposition above).

---

## Action plan summary

| Priority | Item | Effort | Sequence |
|---|---|---|---|
| 1 | F2 — weaken Q97 PF emission to weight 0.30 | 1 hour | Next |
| 2 | F3 — filter IDP IDs 141-146 from `getTopArchetypesForDiagnostics()` | 30 min | DONE Phase 7 P2 |
| 3 | F6 — design + add Q244 religion-as-organizing separator | 1 session | After P2 verified |
| 4 | F1 — document architectural limitation; ticket for future roadmap | 1 session | Anytime; doesn't block |
| n/a | F4 — minor edge-case; accept current behavior | — | Skip |
| n/a | F5 archetype additions | — | Defer indefinitely (CLAUDE.md count anchor) |
| n/a | Q240–Q243 | — | Defer all four; none solve Phase-6 findings |

After each priority lands: rerun the full battery, confirm assertions still pass, confirm no regression on the personas that weren't affected.

---

## Other potential next moves (out of Phase-7 scope)

- Phase 3b (non-router §5.5 audit) and Phase 4 (router F1 batch cleanup) remain queued. They're parallel work, not blocked by anything above.
- Open micro-decisions (Kirchnerism dysfunction grade, Q243 wording specifics) still anytime.
- Adding new personas to the battery (e.g., a cosmopolitan to test the 021 attractor, or a moderate-Republican to test Q242 directly) is its own scope.
