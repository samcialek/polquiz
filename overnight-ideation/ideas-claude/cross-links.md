# Cross-links between ideas

**Scope:** When CROSS-LINK mode finds that ideas in different topic files interact, log the interaction here. This is where the highest-leverage observations usually live — patterns that span categories.

**Format per entry:**

```
## [timestamp — cycle N — CROSS-LINK]
**Idea A:** <file>::"<title or quoted phrase>"
**Idea B:** <file>::"<title or quoted phrase>"
**Relationship:** enables / contradicts / strengthens / supersedes / depends-on
**Implication:** <one paragraph — what does this mean for the project?>
```

**Patterns worth watching for:**
- A new question proposal that would make an unreachable archetype reachable
- A persona addition that exposes a question-rewrite need
- A selector improvement that depends on an architectural change
- An audit finding that invalidates a proposed rewrite
- An edge case that motivates a new persona
- Two new-question proposals that touch the same node and would overload it

---

## [2026-05-18T10:30 — cycle 8 — CROSS-LINK]

### Cross-link 1: Q21 COM inflation upstream of Q240 Never-Trump R discrimination

**Idea A:** `audit-findings.md` :: cycle 7 :: Q21 `allow_no_restrictions` COM evidence — WRONG-NODE concern: "The underlying logic of `allow_no_restrictions` is: 'Speech is a protected process right; I won't trade it for outcomes.' That is the definition of HIGH PRO. It says nothing directly about COM." Current evidence: `COM: { pos: [0.10, 0.15, 0.20, 0.25, 0.30] }` (mean ≈ 3.50, deviation +0.50). Proposed fix: null out to near-uniform (mean ≈ 3.10).

**Idea B:** `new-questions.md` :: cycle 3 :: Q240 `basically_fine` option — expected to separate Never-Trump Republican (picks `basically_fine` → ONT_S=3.98, PRO=3.94) from MAGA all-in (picks `elite_capture` → ONT_S=2.0, ZS=4.11).

**Relationship:** weakens — Q21's falsely-elevated COM write for `allow_no_restrictions` distorts the Never-Trump R persona's final archetype match in a dimension that Q240 cannot undo.

**Implication:** Q21 is fixed12 and fires before Q240 (stage2). The Never-Trump R persona picks `allow_no_restrictions` on Q21 because it is a PRO-driven choice — the same logic that cycle 7 identified as WRONG-NODE for COM. This persona arrives at Q240 already carrying COM≈3.50 (from Q21's weak-high-COM write) even though their actual COM may be lower or near-center. Q240 then correctly writes ONT_S≈3.98 and PRO≈3.94 for that persona's `basically_fine` answer. Final archetype-match COM is distorted by 0.50 units from Q21 noise while ONT_S and PRO are correct.

The practical effect depends on which archetypes the Never-Trump R is being discriminated from. If the relevant competition (e.g., the Urban Progressive persona who also picks `allow_with_counterspeech` on Q21) also receives a COM boost from Q21, both personas get the same directional push and the relative discrimination is unchanged. But if the Never-Trump R's closest archetype competitors are COM-differentiated (high-COM institutionalists like #056 vs. lower-COM libertarians like #089), the Q21 noise may steer the final match in the wrong direction.

**Verdict:** Fixing Q21's COM row (replace with near-uniform, cycle 7 recommendation) is a prerequisite for clean archetype-match calibration of the Never-Trump R persona — not just a minor evidence-quality fix. The Q240 proposal is not self-contained: it depends on Q21 COM not contaminating the dimension space it shares with Never-Trump R's expected archetype.

**Fix sequencing:** Q21 COM null-out → Q240 addition → persona harness run in that order.

---

### Cross-link 2: IDP gate calibration is a prerequisite for meaningful Tier-A harness assertions

**Idea A:** `architecture-thoughts.md` :: cycle 6 :: IDP Gate Calibration, Option A — Q231 `81-100` bucket recalibrated from `universal: 95` to `universal: 75`; Q228 formally retired. Addresses the finding that respondents sliding above 80 on Q231 are permanently IDP-blocked regardless of scoped-affinity answers.

**Idea B:** `new-questions.md` :: cycle 3 :: Q240 `anti_establishment_frame` — targets the three Tier-A personas from HARNESS-HANDOFF.md §3: Abstain→Trump, Obama→Trump, MAGA all-in. Expected ONT_S/ZS discrimination. Personas declared as: high national/religious in-group affinity (`moralCircle: { national: high, ideological: high }`), social desirability risk on Q231 (they may slide 75–90 depending on framing).

**Relationship:** sequenced dependency — both proposals affect the same Tier-A personas. The IDP gate fix must happen before Q240's persona discrimination test can be meaningfully interpreted against IDP archetype expectations.

**Implication:** The Tier-A personas (especially "Abstain→Trump" and "MAGA all-in") are expected to:
1. Route to IDP archetypes (White Grievance Voter #141, ideological excess → populist overlays)
2. Discriminate from Never-Trump R on ONT_S (Q240: `elite_capture` vs. `basically_fine`)

These are two parallel assertions about the same personas. Assertion 1 fails if Q231 miscalibration persists (the Abstain→Trump persona is likely to slide 70–85 on "how much does a stranger's suffering matter," putting many of them in the 75 or 95 universal bucket and gating them out of IDP routing). Assertion 2 is independent of IDP routing — Q240 fires regardless, and ONT_S discrimination works whether or not the IDP overlay fires.

If a harness run is performed before the IDP gate fix:
- Q240 discrimination: **reports correctly** (ONT_S/ZS signal from Q240 is not affected by IDP gate calibration)
- IDP routing: **reports incorrectly** (MAGA/Trump personas fail IDP routing due to universal=75-95 cliff, harness reports "IDP routing broken" even though the logic is correct)
- **The harness produces a mixed result that looks like two separate problems when it's actually one**: miscalibrated Q231 universal blocks IDP routing AND makes it look like the IDP archetypes are unreachable, while Q240's signal is clean. A maintainer reading the harness report could incorrectly conclude that IDP routing is fundamentally broken.

**Verdict:** Implement Option A from architecture-thoughts.md cycle 6 (2 lines in Q231 sliderMap + Q228 retirement) before running the harness at all. The fix is fast, low-risk, and reversible. Without it, the harness's IDP-related assertions are uninterpretable — they'll always fail for the Tier-A personas who have the highest social desirability risk on Q231, regardless of whether their scoped affinity evidence is correctly calibrated.

**Fix sequencing:** Q231 bucket recalibration → Q228 retirement → harness runs. Q240 addition can happen in parallel with either step.

---

### Cross-link 3: Q201 TRB→moralCircle migration gap creates a blind spot in national-excess measurement

**Idea A:** `audit-findings.md` :: cycle 1 :: Q201 `proud_and_trust` — WRONG-NODE: all five Q201 options write to `TRB` (continuous, national identification) but Q201 was never migrated to `moralCircle.scopedAffinities.national` post-ADR-007. "A `proud_and_trust` respondent currently gets TRB pushed toward high national identification but gets zero update to `moralCircle.scopedAffinities.national`."

**Idea B:** `architecture-thoughts.md` :: cycle 6 :: IDP Gate Calibration chain — Q8 + Q229 + Q231 are all being audited as the path to universal and scoped affinity. The chain is described as: "Q8 → Q228 → Q229" with Q231 providing universal baseline.

**Relationship:** strengthens (compound problem) — the IDP gate calibration proposal (cycle 6) focuses on the universal side of the IDP gate (`universalAffinity ≤ 75`). But the scoped-affinity side (`scopedAffinity[national] ≥ 70 AND excess ≥ 20`) depends on questions correctly writing to `moralCircle.scopedAffinities.national`. Q201, as a fixed12 opener that always fires, is the earliest and most authoritative national-identity probe — but it writes to the deprecated TRB node, not to moralCircle. This means the IDP gate's scoped-affinity check is blind to Q201's evidence.

**Implication:** Even after the IDP gate calibration fix (Option A from cycle 6), the national excess pathway has a hole: Q201 fires first for every respondent and declares national identification strength (five options from `proud_and_trust` at TRB=national high to `critical_low_trust` at TRB=national low) — but none of this writes to `moralCircle.scopedAffinities.national`. Downstream, Q229's `ingroup_national` supportHigh item then provides the primary national scopedAffinity write. For respondents who answered Q201 `proud_and_trust` (high national identification) but answered Q229 with `ingroup_national` in a lower bucket (maybe they didn't see it as a moral-concern question), the engine has discarded the Q201 national signal.

**Practical consequence:** The White Grievance Voter (#141) and other national-IDP archetypes depend on `moralCircle.scopedAffinities.national` being populated from early probes. Q201 is the best early probe for this, but its signal is invisible to the moralCircle path. Q229 is the backstop — but Q229 asks a different question ("extra moral concern for fellow citizens") than Q201 ("pride + trust in institutions"). A respondent who answers Q201 `proud_and_trust` + Q229 `ingroup_national: neutral` is telling the engine: "I'm proud of my country and trust its institutions, but I don't feel special moral concern for my fellow citizens above strangers." Those two answers may be coherent — but the engine currently ignores the Q201 signal entirely for national excess purposes, even though `proud_and_trust` is meaningful evidence.

**Verdict:** Q201 migration to moralCircle (cycle 1 proposed fix) and the IDP gate calibration fix (cycle 6) are both necessary for reliable national-IDP routing. Neither is sufficient alone. The priority order: IDP gate calibration first (fixes the structural ceiling problem), then Q201 migration (fills the evidence gap for early national-identification probes).

**Fix sequencing:** (1) IDP gate calibration (Q231 + Q228) → (2) Q201 moralCircle migration → (3) harness runs with both fixes active → (4) Q240 addition.

