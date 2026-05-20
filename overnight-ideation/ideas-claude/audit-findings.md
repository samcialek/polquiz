# Per-response evidence audit (§5.5)

**Scope:** One row per option/bucket of each question in `src/config/questions.representative.ts`. The audit checks whether the declared evidence matches the option's wording (logical justifiability) and pulls as hard as it should (maximal justifiable magnitude).

**Format (per the §5.5.C example in HARNESS-HANDOFF.md):**

```
Q<id> <type> — <topic>
  option_text: "<verbatim quote>"
  declared touch: <node> (<role>, w=<weight>)
  declared evidence: <verbatim sliderMap / optionEvidence quote>
  text→evidence sign:     PASS / SIGN-ERROR
  text→evidence magnitude: APPROPRIATE / UNDER-PULL / OVER-PULL
  cross-option symmetry:   PASS / ASYMMETRIC
  flags: <list, or "none">
  proposed correction: <if flagged>
```

**Severity tags (in flag list):**
- `SIGN-ERROR` — evidence points opposite to option wording (correctness bug)
- `WRONG-NODE` — option touches a node it shouldn't (or misses one it should)
- `HOLLOW-TOUCH` — declared in touchProfile but evidence row is flat (H4 bug pattern)
- `ANCHOR-WITHOUT-BUCKET` — trbAnchor or scopedAffinities declared but no value
- `UNDER-PULL` — option clearly extreme but evidence row near uniform
- `OVER-PULL` — option softly implies node but evidence row is extreme
- `ASYMMETRIC` — within-question, mirrored-extremity options have non-mirrored evidence strength
- `POS-VS-SAL-CONFUSION` — question role is salience but evidence writes position, or vice versa
- `PASS` — passes all bars (worth logging — confirms read coverage)

**Coverage tracking:** every cycle that does an AUDIT should pick a question NOT YET PRESENT in this file. To find one, grep this file for "Q<id>" first.

---

## [2026-05-18T00:00 — cycle 1 — AUDIT — Q201 patriotism_institutional_trust]

**Question:** Q201 `single_choice` — patriotism_institutional_trust (stage: `fixed12`, section I)

**TouchProfile declared:**
```
{ node: "ONT_S", kind: "continuous", role: "position", weight: 0.20, touchType: "current_institutional_confidence" },
{ node: "ONT_S", kind: "continuous", role: "salience", weight: 0.15, touchType: "current_institutional_confidence" },
{ node: "TRB",   kind: "continuous", role: "position", weight: 0.30, touchType: "national_identification" }
```

**Options (5):**
`proud_and_trust`, `proud_distrustful`, `moderate_pride_mixed_trust`, `internationalist_trusting`, `critical_low_trust`

---

### Option: `proud_and_trust`
```
option_text: "I'm generally proud of my country and trust most of its core institutions despite their flaws."
declared touch: ONT_S (position, w=0.20), TRB (position, w=0.30)
declared evidence:
  ONT_S: { pos: [0.02, 0.06, 0.18, 0.34, 0.40] }
  TRB:   { pos: [0.05, 0.15, 0.30, 0.30, 0.20] }
text→evidence sign:     PASS (trusts institutions → high ONT_S; proud nationally → mid-high TRB)
text→evidence magnitude: APPROPRIATE (ONT_S mean ≈ 4.02; strong but not extreme — note weight is 0.20)
cross-option symmetry:  see critical_low_trust below — ASYMMETRIC (this option is further from center than its mirror)
flags: ASYMMETRIC (see critical_low_trust), WRONG-NODE (TRB write not yet migrated to moralCircle; see note)
```

---

### Option: `proud_distrustful`
```
option_text: "I'm proud of my country but distrust most of its current institutions."
declared touch: ONT_S (position, w=0.20), TRB (position, w=0.30)
declared evidence:
  ONT_S: { pos: [0.08, 0.18, 0.36, 0.25, 0.13] }
  TRB:   { pos: [0.05, 0.15, 0.30, 0.30, 0.20] }
text→evidence sign:     PASS for TRB (same national pride as proud_and_trust → same distribution, logical).
                        MARGINAL for ONT_S: option says "distrust most of its current institutions" — ONT_S
                        mean ≈ 3.17 (barely below center). The inline comment says "current trust != normative
                        institutional essentialism" but even a soft-directional read should push below 3.
text→evidence magnitude: UNDER-PULL on ONT_S. "Distrust most institutions" should produce ONT_S mean ≈ 2.3–2.6,
                          not 3.17. Even with weight 0.20, this is a directionally weak pull.
cross-option symmetry:  With proud_and_trust (mean 4.02), the symmetric counterpart for "same pride, opposite
                         trust" would land around 2.0–2.2. Actual row puts it at 3.17 — gap of 0.85 on the
                         "distrust" side vs. 1.02 above center on the "trust" side.
flags: UNDER-PULL (ONT_S), WRONG-NODE (TRB; see note)
proposed correction (ONT_S):
  [0.08, 0.18, 0.36, 0.25, 0.13] → [0.18, 0.27, 0.30, 0.18, 0.07]  (mode stays at 3 but mass shifts left; mean ≈ 2.7)
```

---

### Option: `moderate_pride_mixed_trust`
```
option_text: "I'm somewhat proud but skeptical of many institutions in their current form."
declared touch: ONT_S (position, w=0.20), TRB (position, w=0.30)
declared evidence:
  ONT_S: { pos: [0.06, 0.16, 0.38, 0.27, 0.13] }
  TRB:   { pos: [0.10, 0.25, 0.35, 0.20, 0.10] }
text→evidence sign:     PASS (mixed signal → center distributions; lower TRB mass at high end matches "somewhat proud")
text→evidence magnitude: APPROPRIATE for a centrist option.
cross-option symmetry:  N/A (centrist)
flags: WRONG-NODE (TRB; see note)
```

---

### Option: `internationalist_trusting`
```
option_text: "I don't think in country-pride terms but I trust most major democratic institutions."
declared touch: ONT_S (position, w=0.20), TRB (position, w=0.30)
declared evidence:
  ONT_S: { pos: [0.02, 0.06, 0.18, 0.34, 0.40] }
  TRB:   { pos: [0.40, 0.30, 0.18, 0.08, 0.04] }
text→evidence sign:     PASS (strong institutional trust → high ONT_S; no country-pride frame → low TRB)
text→evidence magnitude: APPROPRIATE.
cross-option symmetry:  ONT_S row is IDENTICAL to proud_and_trust. Logically defensible (both trust institutions)
                         but note: "country-pride" variant might slightly boost civic-institutional trust signal
                         vs. a purely cosmopolitan variant. The identical rows are acceptable given low weight (0.20).
flags: WRONG-NODE (TRB; see note). PASS on sign and magnitude.
```

---

### Option: `critical_low_trust`
```
option_text: "I'm critical of my country and don't trust most institutions."
declared touch: ONT_S (position, w=0.20), TRB (position, w=0.30)
declared evidence:
  ONT_S: { pos: [0.18, 0.27, 0.32, 0.16, 0.07] }
  TRB:   { pos: [0.30, 0.32, 0.22, 0.10, 0.06] }
text→evidence sign:     PASS (doesn't trust → lower ONT_S; critical of country → lower TRB)
text→evidence magnitude: UNDER-PULL on ONT_S. "Don't trust most institutions" is explicit and strong.
                          ONT_S mean ≈ 2.65 with mode at 3 — barely pulling below center. The symmetric
                          mirror of proud_and_trust ([0.02, 0.06, 0.18, 0.34, 0.40], mean 4.02) would be
                          [0.40, 0.34, 0.18, 0.06, 0.02], mean 1.98. Current row is halfway between
                          center and the justified extreme — losing ~0.65 of actionable pull.
cross-option symmetry:  ASYMMETRIC with proud_and_trust. Trust extreme sits at mean 4.02 (deviation from
                         center = +1.02); distrust extreme sits at mean 2.65 (deviation from center = −0.35).
                         The distrust end is ~3× weaker than the trust end. This creates a systematic
                         upward bias: the question can confirm "trusts institutions" much more strongly
                         than it can confirm "distrusts institutions."
flags: UNDER-PULL (ONT_S), ASYMMETRIC (ONT_S vs proud_and_trust), WRONG-NODE (TRB; see note)
proposed correction (ONT_S):
  [0.18, 0.27, 0.32, 0.16, 0.07] → [0.35, 0.30, 0.22, 0.10, 0.03]  (mass shifted left; mean ≈ 2.16)
  Rationale: matches the deviation magnitude of proud_and_trust (symmetric pull of ~±1 unit from center).
```

---

### Cross-cutting flag: WRONG-NODE on all TRB writes

All five options write to `TRB` (continuous node, role: position) for the "national identification" dimension. ADR-007 (in effect 2026-05-07) replaced TRB with `moralCircle.scopedAffinities`. Q228 (`remaining_in_group_pull`, also fixed12) has already been migrated — its `rankingMap` uses `{ moralCircle: { universal: 75, scopedAffinities: { national: 85 } } }` syntax. Q8's `optionEvidence` uses `moralCircle:` writes. Q201's TRB writes are a migration gap: national-identification signal from the patriotism question is routing to the deprecated TRB node rather than `moralCircle.scopedAffinities.national`.

Concretely, a `proud_and_trust` respondent currently gets TRB pushed toward high national identification but gets **zero** update to `moralCircle.scopedAffinities.national`. Since IDP routing (White Grievance Voter, Black Voter, etc.) and archetype matching both key off `moralCircle` excess, not TRB, this question is invisible to the moral-circle matching path.

**Proposed migration for `proud_and_trust`:**
```
proud_and_trust: {
  continuous: {
    ONT_S: { pos: [0.02, 0.06, 0.18, 0.34, 0.40] },
    TRB:   { pos: [0.05, 0.15, 0.30, 0.30, 0.20] }  // keep as legacy fallback
  },
  moralCircle: { universal: 55, scopedAffinities: { national: 75 } }  // ADD
}
```
Where national (75) > universal (55) = excess of ~20, appropriate for "I feel particular concern for my country" framing.

**Proposed migration for `internationalist_trusting`:**
```
moralCircle: { universal: 80 }  // wide circle, no excess; mirrors Q8's clearly_abroad (universal: 90) slightly modulated
```

**Proposed migration for `critical_low_trust`:**
```
moralCircle: { universal: 55, scopedAffinities: { national: 35 } }  // below-universal national; negative excess, skeptical attachment
```

**Priority:** MEDIUM-HIGH. Q201 is a fixed12 opener. Every respondent sees it. Its TRB writes have zero effect on moral-circle matching (wrong storage path). The asymmetric ONT_S calibration slightly biases the engine toward confirming "institutions matter" for anyone who isn't solidly in the "critical + distrust" camp.

---

## [2026-05-18T01:30 — cycle 2 — AUDIT — Q8 domestic_vs_abroad_lives]

**Question:** Q8 `single_choice` — domestic_vs_abroad_lives (stage: `fixed12`, section: I)

**TouchProfile declared:**
```
{ node: "MOR", kind: "continuous", role: "position", weight: 0.30, touchType: "moral_scope_tradeoff_legacy_proxy" }
```

**Options (3):**
`clearly_domestic`, `hard_to_say`, `clearly_abroad`

**Option labels (verbatim):**
```
clearly_domestic: "Program A — save 10 lives in your country"
hard_to_say:      "Hard to say — I'd want to know more before choosing"
clearly_abroad:   "Program B — save 100 lives in a developing nation"
```

---

### Option: `clearly_domestic`
```
option_text: "Program A — save 10 lives in your country"
declared touch: MOR (position, w=0.30)
declared evidence:
  MOR: { pos: [0.55, 0.28, 0.12, 0.04, 0.01] }      (mean ≈ 1.52)
  moralCircle: { universal: 30, scopedAffinities: { national: 75 } }   (excess = 45)
text→evidence sign:      PASS (chooses in-group lives → low MOR; low universal + national excess)
text→evidence magnitude: APPROPRIATE. 10:1 preference for domestic lives justifies a low universal
                          (30) and meaningful national excess (45). The excess-45 clears the IDP
                          activation gate (≥20), scoped-75 clears the ≥70 threshold, universal-30
                          clears the ≤75 ceiling. Routing to national IDP archetypes will work.
cross-option symmetry:   MOR rows ARE perfectly symmetric with clearly_abroad
                          ([0.55,0.28,0.12,0.04,0.01] ↔ [0.01,0.04,0.12,0.28,0.55]). PASS.
flags: PASS (MOR + moralCircle both correct); NOTE: touchProfile does not list moralCircle
       node — see cross-cutting note below.
```

---

### Option: `hard_to_say`
```
option_text: "Hard to say — I'd want to know more before choosing"
declared touch: MOR (position, w=0.30)
declared evidence:
  MOR: { pos: [0.08, 0.18, 0.48, 0.18, 0.08] }      (mean ≈ 3.0, symmetric)
  moralCircle: { universal: 55 }                      (no scoped affinities)
text→evidence sign:      PASS (ambivalent → center MOR; moderate universal, no scoped push)
text→evidence magnitude: APPROPRIATE for a centrist/ambivalent option.
cross-option symmetry:   N/A (centrist)
flags: PASS.
note: No scopedAffinities assigned. Correct — this option signals epistemic caution, not
      in-group attachment. Downstream Q229 will surface scoped preferences for these respondents.
      Q228 does NOT fire for hard_to_say respondents; that is correct behavior (Q228
      exposeRules: "answered_q8_abroad" only).
```

---

### Option: `clearly_abroad`
```
option_text: "Program B — save 100 lives in a developing nation"
declared touch: MOR (position, w=0.30)
declared evidence:
  MOR: { pos: [0.01, 0.04, 0.12, 0.28, 0.55] }      (mean ≈ 4.48)
  moralCircle: { universal: 90 }                      (no scoped affinities; Q228 fires next)
text→evidence sign:      PASS (chooses maximum utilitarian lives → high MOR; very high universal baseline)
text→evidence magnitude: APPROPRIATE for the strongest universalist signal.
cross-option symmetry:   Symmetric with clearly_domestic on MOR. PASS.
flags: STRUCTURAL-CONCERN (see below — Q228 follow-up mechanism may be insufficient to
       produce IDP-qualifying excess for universalist respondents who have residual in-group pull).
```

---

### Cross-cutting flag 1: touchProfile incomplete — moralCircle not listed

Q8's touchProfile declares only `MOR` (weight 0.30, `moral_scope_tradeoff_legacy_proxy`). The optionEvidence maps already include `moralCircle` writes across all three options — Q8 has been partially migrated post-ADR-007, unlike Q201 which retained only TRB writes. However, the touchProfile itself has not been updated to reflect moralCircle coverage.

**Functional impact:** None in practice. Q8 is `fixed12` (always asked); the EIG selector never evaluates it for inclusion, so the incomplete touchProfile does not affect selection behavior. The moralCircle evidence rows in optionEvidence are read directly by the engine regardless of touchProfile metadata.

**Cosmetic repair:**
```ts
touchProfile: [
  { node: "MOR",   kind: "continuous", role: "position", weight: 0.30, touchType: "moral_scope_tradeoff_legacy_proxy" },
  { node: "MORAL_CIRCLE", kind: "derived", role: "anchor", weight: 0.85, touchType: "universal_baseline_probe" }
]
```

**Priority:** LOW (cosmetic only for a fixed12 question).

---

### Cross-cutting flag 2: STRUCTURAL-CONCERN — Q228 follow-up insufficient to produce IDP-qualifying excess for clearly_abroad respondents

**The mechanism (as documented in Q228 inline comment):**
> "Each item placed in supportHigh walks back universal slightly (75) AND pushes the scoped value above the running-average universal (85), which is enough to register positive excess after engine averaging."

**The problem:** Q8 `clearly_abroad` sets `moralCircle: { universal: 90 }`. Q228 then fires and any item placed in supportHigh provides `moralCircle: { universal: 75, scopedAffinities: { scope: 85 } }` — but Q228's touchProfile weight is **0.10** (very low). The engine takes a weighted update: the new universal drifts only slightly from 90 toward 75, and the new scoped contribution is proportionally tiny. Even if the respondent places all six items in supportHigh, the effective excess after averaging is likely well below the IDP gate threshold (excess ≥ 20 AND scoped ≥ 70 AND universal ≤ 75).

Concretely: if the engine averages `universal_90 × prior_weight` with `universal_75 × 0.10`, at even moderate prior weight, the resulting universal stays above 80. For a scope to register excess ≥ 20, its scoped affinity would need to reach 100+ — impossible.

**Consequence:** A `clearly_abroad` respondent who nonetheless has a strong residual national or religious in-group pull (say, an internationalist Christian conservative) cannot reach IDP archetypes (Evangelical Voter #145) through the Q8 → Q228 path alone. They need Q229 to surface it — and Q229 is in the fixed12 set, so it will fire. But the interaction between Q8's high universal=90 prior and Q229's scoped evidence should be checked: does Q229's evidence for `ingroup_religious: supportHigh` carry enough weight to walk back the 90 and produce excess ≥ 20?

**Proposed fix options:**
1. Increase Q228's moralCircle update weight (currently implied by TRB_ANCHOR weight=0.10). If the moralCircle write is intended to be stronger than 0.10, update the touchProfile weight and document it separately from the TRB_ANCHOR legacy row.
2. Lower the initial `clearly_abroad` universal from 90 to 75–80. A respondent who picks 100 foreign lives over 10 domestic is universalist — but not necessarily at the extreme. At universal=75, a Q228 supportHigh item with scoped=85 would produce excess = 85 − 75 = 10 (still below gate) but later averaging with Q229 becomes more tractable.
3. Document this as a known limit: respondents who are "wide-circle universalists with residual in-group attachments" are a small edge case; the fix is to rely on Q229 for their scoped affinities rather than Q228.

**Priority:** MEDIUM. This is a design architecture concern, not a sign error. The Q228 → moralCircle path may be less load-bearing than its comment implies. Q229 is the backstop and it fires for all respondents. But the comment "enough to register positive excess after engine averaging" may be factually wrong — it should be verified against the actual engine averaging logic before Q228's mechanism is treated as reliable.

---

## [2026-05-18T04:30 — cycle 4 — AUDIT — Q229 moral_circle_in_group_sort]

**Question:** Q229 `priority_sort` — moral_circle_in_group_sort (stage: `fixed12`, section: I)

**TouchProfile declared:**
```
{ node: "MORAL_CIRCLE", kind: "derived", role: "affinity", weight: 0.10, touchType: "moral_circle_scoped_affinity" }
```

**Inline comment (verbatim):**
```
// Bucket emissions (after applyPrioritySort weight scaling):
//   supportHigh (full weight, 1.0): scoped:95 → real excess even when
//     respondent's universal sits at 90 (Q8 clearly_abroad).
//   supportMid (half weight, 0.5): scoped:72.5 → meaningful for low/mid
//     universal respondents, ~0 excess for universalists.
//   neutral / opposeHigh: no emission (skip).
```

**rankingMap (verbatim):**
```ts
rankingMap: {
  ingroup_national:      { moralCircle: { scopedAffinities: { national:      95 } } },
  ingroup_religious:     { moralCircle: { scopedAffinities: { religious:     95 } } },
  ingroup_ethnic_racial: { moralCircle: { scopedAffinities: { ethnic_racial: 95 } } },
  ingroup_class:         { moralCircle: { scopedAffinities: { class:         95 } } },
  ingroup_gender:        { moralCircle: { scopedAffinities: { gender:        95 } } },
  ingroup_ideological:   { moralCircle: { scopedAffinities: { ideological:   95 } } },
}
```

**Items (6, verbatim):**
```
ingroup_national:      "Fellow citizens of your country"
ingroup_religious:     "People who share your religious tradition"
ingroup_ethnic_racial: "People of your racial or ethnic background"
ingroup_class:         "People in your economic class"
ingroup_gender:        "People who share your gender"
ingroup_ideological:   "People who share your core political values"
```

---

### Finding 1: MISLEADING-COMMENT — "real excess even when universal=90" overstates IDP-routing capability

```
comment claim: "scoped:95 → real excess even when respondent's universal sits at 90 (Q8 clearly_abroad)"
actual excess: max(0, 95 - 90) = 5
IDP gate requires: excess ≥ 20  AND  universalAffinity ≤ 75  AND  scoped ≥ 70  AND  intensity03 ≥ 1.2
```

For a `clearly_abroad` respondent (Q8 sets universal=90) who places, say, `ingroup_national` in supportHigh on Q229:
- `moralCircle.scopedAffinities.national` → updated toward 95
- `universalAffinity` → **unchanged** (Q229's rankingMap writes no `universal` component)
- excess = max(0, 95 − 90) = **5**
- IDP gate check 1: excess ≥ 20? **FAIL** (5 < 20)
- IDP gate check 2: universalAffinity ≤ 75? **FAIL** (90 > 75)

The comment's claim "real excess even when universal=90" is literally true in the arithmetic sense (5 > 0 = non-zero excess) but practically misleading: excess=5 produces no IDP routing, no archetype-matching contribution above background, and no intensity03 bump. The comment implies Q229 is "enough" to produce in-group signal for universalist respondents with residual attachments. It is not.

**Behavior is correct; comment is wrong about its significance.** A universalist who places every scope in supportHigh after answering Q8 clearly_abroad correctly should NOT route to IDP archetypes. The design is sound. The comment misrepresents it.

**flags:** MISLEADING-COMMENT (no functional impact; clarification only)

**Proposed correction (inline comment only):**
```
// Bucket emissions (after applyPrioritySort weight scaling):
//   supportHigh (full weight, 1.0): scoped:95. For respondents with low/mid
//     universal (≤75), produces meaningful excess (e.g. excess=20 if universal=75).
//     For universalists (universal=90 from Q8 clearly_abroad), excess=5 — non-zero
//     but does not produce IDP routing (gate requires excess≥20 AND universal≤75).
//     That is correct behavior: universalists should not be IDP-routed.
//   supportMid (half weight, 0.5 applied by engine): scoped:72.5 → excess≈0
//     for universalists; meaningful only for low-universal respondents.
//   neutral / opposeHigh: no emission.
```

---

### Finding 2: STRUCTURAL-CONCERN (HIGH PRIORITY) — Q228 not retired despite Q229 comment claiming it is

Q229's inline comment states: **"The conditional Q228 is retired in favor of this question, which fires unconditionally for everyone and serves the same purpose."**

Q228 (`remaining_in_group_pull`) verbatim, as it exists in `src/config/questions.representative.ts`:

```ts
{
  id: 228,
  stage: "fixed12",
  section: "I",
  promptShort: "remaining_in_group_pull",
  promptFull:
    "You picked the abroad option just now — a wide moral circle. Even so, some groups may still pull at you. Sort each by whether you feel extra moral concern for them, beyond what you feel for people in general.",
  uiType: "priority_sort",
  quality: 0.92,
  rewriteNeeded: false,
  exposeRules: { eligibleIf: ["answered_q8_abroad"] },
```

Q228 is **not** retired — it still exists and its `eligibleIf: ["answered_q8_abroad"]` gate is active. `clearly_abroad` respondents therefore see both Q228 AND Q229 (fixed12), both asking about the same six in-group dimensions. This is double-probing: the same respondent answers an equivalent question twice, producing:

1. Q228 writes `moralCircle: { universal: 75, scopedAffinities: { national: 85 } }` for each supportHigh item (walks back universal AND sets scoped)
2. Q229 writes `moralCircle: { scopedAffinities: { national: 95 } }` for each supportHigh item (sets scoped only, no universal update)

The combined effect for a `clearly_abroad` respondent who places `ingroup_national` in supportHigh on both Q228 and Q229:
- After Q8: universal = 90
- After Q228 supportHigh national: engine updates universal toward 75, national toward 85
  - Bayesian posterior: universal ≈ 82 (averaged), national ≈ 88, excess ≈ 6
- After Q229 supportHigh national: engine updates national toward 95
  - Posterior: universal ≈ 82, national ≈ 92, excess ≈ 10

Excess=10 is slightly better than excess=5 from Q229 alone, but still far below the IDP gate (excess ≥ 20) and universalAffinity still fails ≤75. The double-probing produces a small additive benefit but does not cross any meaningful threshold.

**More importantly:** Q228 asks the same six items with different prompt framing ("even so, some groups may still pull at you") to respondents who just declared themselves universalists. Asking them again 12 questions later (Q229 fixed12) undercuts the intent of the original answer.

**flags:** STRUCTURAL-CONCERN — Q228 and Q229 are redundant for clearly_abroad respondents; Q228 was supposed to be retired but wasn't. This also invalidates Cycle 2's framing ("Q229 is the backstop") — Q229 is actually a REPLACEMENT for Q228, not a backstop, but Q228 is still active.

**Cross-link:** [[audit-findings.md]] Q8 Cycle 2 STRUCTURAL-CONCERN. The entire chain (Q8 → Q228 → Q229) for universalist respondents is architecturally confused: Q228 was supposed to be retired by Q229, Q229 can't produce IDP-qualifying excess for universalists, and the comment on Q229 misrepresents what "real excess" means. These three questions need a coordinated review.

**Proposed fix options:**
1. **Remove Q228** from the bank (set `quality: 0` or delete the entry). Q229 is now the unconditional replacement. Clearly_abroad respondents no longer get double-probed. (Highest-impact, cleanest.)
2. **Change Q228's `eligibleIf` to a never-fire gate** (e.g., `eligibleIf: ["__retired__"]`) to formally retire it while preserving the definition for historical reference.
3. **Leave Q228 but document it's intentional double-probing.** Lowest-effort but accepts a confusing respondent experience for universalists.

**Recommended:** Option 1. Q229 is a strict superset of Q228's coverage (same items, same bucket structure, fires for all respondents including clearly_abroad). Q228 adds confusion and double-counts evidence.

**Priority:** HIGH. Q228 is a fixed12 item that fires for every universalist respondent — likely a significant fraction of the user base. The double-probing is currently live on the production quiz.

---

### Finding 3: PASS — evidence row sign and magnitude (all items)

All six items:
```
text→evidence sign:     PASS. Each item's prompt unambiguously names the in-group scope.
                         Placing it in supportHigh clearly signals "I feel extra moral concern."
                         Writing scoped=95 (near-maximum) for supportHigh is correct.
text→evidence magnitude: APPROPRIATE for the strongest bucket.
                          supportHigh=95 produces excess=20 when universal=75 (baseline gate level).
                          supportMid=72.5 (engine-scaled) produces excess≈0 at universal=75 —
                          correct that mid-tier placements don't produce IDP activation.
cross-option symmetry:   N/A (six independent scopes, not opposing poles on the same dimension).
flags: PASS.
```

---

### Summary

| Finding | Severity | Impact | Fix |
|---|---|---|---|
| MISLEADING-COMMENT ("real excess at universal=90") | LOW | Misleads maintainers; no runtime effect | Clarify inline comment |
| Q228 not retired — double-probing clearly_abroad respondents | HIGH | Live respondents see same question twice; evidence double-counted | Remove Q228 from bank |
| Evidence rows (all 6 items) | PASS | — | No action needed |

**Cross-link to Cycle 2:** The Q8 STRUCTURAL-CONCERN (Q228 weight=0.10 insufficient to produce IDP excess) is superseded by this finding. The real issue is not Q228's weight — it's that Q228 was supposed to be retired but wasn't. The Cycle 2 framing "Q229 is the backstop" is incorrect; Q229 is the replacement and Q228's continued existence is a bug, not a feature.

---

## [2026-05-18T06:00 — cycle 5 — AUDIT — Q231 universal_baseline_stranger]

**Question:** Q231 `slider` — universal_baseline_stranger (stage: `fixed12`, section: I)

**TouchProfile declared:**
```
{ node: "MOR", kind: "continuous", role: "position", weight: 0.10, touchType: "universal_baseline_legacy_proxy" }
```

**sliderMap (verbatim):**
```ts
sliderMap: {
  "0-20":   { moralCircle: { universal: 10 } },
  "21-40":  { moralCircle: { universal: 30 } },
  "41-60":  { moralCircle: { universal: 50 } },
  "61-80":  { moralCircle: { universal: 75 } },
  "81-100": { moralCircle: { universal: 95 } },
},
```

**Prompt (verbatim):**
```
"When a stranger is suffering, how much does that matter to you even if they share none of your identities, beliefs, nationality, or politics?"
```

---

### Finding 1: HOLLOW-TOUCH — MOR declared in touchProfile but no sliderMap bucket writes to continuous MOR

touchProfile declares `{ node: "MOR", kind: "continuous", role: "position", weight: 0.10, touchType: "universal_baseline_legacy_proxy" }`. No sliderMap bucket contains a `continuous: { MOR: { pos: [...] } }` field. Zero MOR evidence is emitted. The touchType name `"universal_baseline_legacy_proxy"` signals this is intentional — a breadcrumb saying "MOR was the old storage path." But under the §5.5 audit definition, this is a HOLLOW-TOUCH: "Option declares it touches a node in touchProfile, but its actual evidence rows for that node are flat."

**Functional impact:** Negligible for MOR. The moralCircle writes in the sliderMap ARE executing; only the legacy MOR proxy is dead. Since Q231 is fixed12, EIG never evaluates it and the touchProfile weight has no selection effect.

**Cosmetic repair (consistent with Q8):**
```ts
touchProfile: [
  { node: "MOR",         kind: "continuous", role: "position", weight: 0.10, touchType: "universal_baseline_legacy_proxy" },
  { node: "MORAL_CIRCLE", kind: "derived",   role: "anchor",   weight: 0.90, touchType: "universal_affinity_calibration" }
]
```

**Priority:** LOW (fixed12, cosmetic only, matches Q8 pattern).

---

### Finding 2: ASYMMETRIC bucket assignment — top two buckets assigned at upper-quartile, not midpoint

Mapping the bucket midpoint against the assigned universal value:

| Bucket  | Midpoint | Assigned | Offset |
|---------|----------|----------|--------|
| 0-20    | 10       | 10       | 0      |
| 21-40   | 30       | 30       | 0      |
| 41-60   | 50       | 50       | 0      |
| 61-80   | **70**   | **75**   | **+5** |
| 81-100  | **90**   | **95**   | **+5** |

The bottom three buckets assign the exact midpoint. The top two assign 5 points above the midpoint. The asymmetry is consistent (+5 in both) and could reflect an intent to weight high-engagement responses toward the top of their range — plausible if respondents who care "quite a bit" distribute toward the upper end of 61-80 rather than the midpoint.

**The assignment is logically defensible** as a response-distribution assumption. However, the choice has a non-obvious consequence: the `61-80` bucket is assigned universal=75, which is exactly the IDP gate ceiling (`universalAffinity ≤ 75`). If the midpoint-based value (70) had been used instead, the `61-80` bucket would sit below the IDP gate ceiling with 5 units of headroom; at 75 it sits at the exact gate boundary.

**flags:** ASYMMETRIC (bucket assignment pattern), with interaction noted in Finding 3.

---

### Finding 3: STRUCTURAL-CONCERN (HIGH) — hard IDP eligibility cliff at slider position 80/81

The bucket boundary between `61-80` and `81-100` at position 81 creates a 20-unit jump in universalAffinity:

```
slider position 80  →  bucket "61-80"  →  universal = 75  →  IDP gate: universalAffinity ≤ 75  ✓ (passes)
slider position 81  →  bucket "81-100" →  universal = 95  →  IDP gate: universalAffinity ≤ 75  ✗ (fails permanently)
```

A 1-unit change in slider position (80→81) causes a 20-unit jump in the universal affinity score, which toggles IDP eligibility from borderline-pass to hard-fail. This cliff is not visible to the respondent — the slider feels continuous.

**Why "permanently fail"?** After Q231 sets universal=95 for a respondent in the 81-100 bucket, Q229 can push scoped affinities up to 95 (via supportHigh), but Q229 does not write any `universal` component. The universal stays at 95. The IDP gate check `universalAffinity ≤ 75` will remain false. There is no subsequent question in the fixed12 set that walks universal back down for an 81-100 respondent.

**Estimated population impact:** If a substantial fraction of respondents answering "how much does a stranger's suffering matter" score above 80 (the socially-expected answer to this question may skew high), then a significant share of the population will be permanently IDP-ineligible regardless of their scoped affinity answers. The six IDP archetypes (141-146) would then be only reachable by respondents who answered ≤80 on Q231.

**Cross-link:** This connects to the Q8/Q228/Q229 architecture chain from cycles 2 and 4. The Q8 `clearly_abroad` finding (universal=90 blocks IDP routing) and this finding share the same root: the IDP gate ceiling of 75 sits below the universal values assigned for "high moral concern" responses, meaning respondents who claim to care broadly about strangers are categorically excluded from IDP archetype routing, regardless of in-group attachments they declare elsewhere.

**The logic is sound in intent** — a true universalist (who cares about everyone at baseline-90 or 95) shouldn't route to identity-primary archetypes like White Grievance Voter. But the threshold interacts with the bucket assignment in a way that may be too coarse: a respondent who slides to 81 is making a subtle distinction from someone at 80, and the model treats them as categorically different for IDP routing.

**Design question this surfaces (for Sam):**
Is the IDP gate ceiling (75) deliberately calibrated against Q231's bucket assignments, or was it set independently? If independently: a respondent who slides to 80 (universal=75, barely clears gate) vs. 81 (universal=95, hard fail) produces unintuitive asymmetry. The gate threshold and the bucket assignment interact and should be reviewed together.

**Proposed options:**
1. **Adjust `61-80` bucket to use midpoint (70) instead of 75.** IDP gate boundary shifts from "80/81 cliff" to a softer zone. Respondents in 61-80 get universal=70, leaving 5 units of headroom below the gate ceiling. Trade-off: changes existing scoring for all 61-80 respondents.
2. **Raise the IDP gate ceiling from 75 to 80.** Allows 81-100 respondents with strong scoped excess (Q229 supportHigh → scoped=95, excess=95-95=0 — still fails). Actually doesn't help for 81-100 respondents at all since their scoped=95 and universal=95 gives excess=0.
3. **Split the top bucket into "61-75" (universal=65) and "76-100" (universal=88).** Finer resolution in the IDP-relevant range. More buckets but avoids the 80/81 cliff.
4. **Document the cliff as intentional.** Acknowledge that "high universal concern for strangers" and "IDP archetype routing" are mutually exclusive by design. If so, the Q231 + IDP gate interaction should be explicitly noted in the code comments so future maintainers don't assume the IDP archetypes are reachable by universalists.

**Priority:** HIGH. Q231 is fixed12 and determines universal affinity for every respondent. The cliff at 80/81 affects IDP reachability for a potentially large fraction of the population. This should be reviewed against the actual intended gate design before the persona harness runs — a wrong-calibrated universal baseline will propagate into every IDP-related assertion.

---

### Finding 4: PASS — sign and magnitude for all five buckets

```
Bucket "0-20"   → universal=10:  PASS. Respondent says stranger barely matters → universal near-zero. Magnitude APPROPRIATE.
Bucket "21-40"  → universal=30:  PASS. Low concern → low universal. APPROPRIATE.
Bucket "41-60"  → universal=50:  PASS. Mixed/moderate concern → mid-universal. APPROPRIATE.
Bucket "61-80"  → universal=75:  PASS on sign (significant concern → meaningful universal). Magnitude flagged in Finding 2.
Bucket "81-100" → universal=95:  PASS on sign (strong concern → high universal). Magnitude flagged in Finding 3.
```

The direction of the mapping is unambiguous and correct across all five buckets. The issues are in calibration (Finding 2) and threshold interaction (Finding 3), not in sign.

---

### Summary

| Finding | Severity | Impact | Fix |
|---|---|---|---|
| HOLLOW-TOUCH (MOR declared, never written) | LOW | Cosmetic; MOR is deprecated anyway | Add MORAL_CIRCLE to touchProfile |
| ASYMMETRIC bucket assignment (+5 offset in top two buckets) | MEDIUM | Sets 61-80 → exactly at IDP gate ceiling | Consider using midpoint (70) for 61-80 bucket |
| Hard IDP eligibility cliff at slider 80/81 | **HIGH** | Respondents who answer 81+ on Q231 are permanently IDP-ineligible; cliff not visible to respondent | Review IDP gate ceiling (75) vs. bucket assignments together; document or fix |
| Sign + magnitude (all 5 buckets) | PASS | — | No action needed |

**Cross-links:** [[audit-findings.md]] Q8 Cycle 2 (clearly_abroad sets universal=90, same cliff problem from the other direction); Q229 Cycle 4 (Q229 supportHigh produces scoped=95 but doesn't lower universal, so IDP gate still fails for 81-100 respondents). The Q8 + Q231 + Q229 chain all converge on the same architectural tension: the IDP gate ceiling of 75 is calibrated against a scenario where Q8 or Q231 produces a low universal, but both questions have a large portion of the response space that produces universal ≥ 75, silently blocking IDP routing for those respondents regardless of any scoped signals.

---

## [2026-05-18T09:00 — cycle 7 — AUDIT — Q21 controversial_speaker]

**Question:** Q21 `single_choice` — controversial_speaker (stage: `fixed12`, section: II)

**TouchProfile declared:**
```
{ node: "PRO", kind: "continuous", role: "position", weight: 0.80, touchType: "rights_tradeoff" },
{ node: "COM", kind: "continuous", role: "position", weight: 0.35, touchType: "civic_balance" }
```

**Options (4):** `cancel`, `restricted`, `allow_with_counterspeech`, `allow_no_restrictions`

No `promptFull` defined in `questions.representative.ts`. No `optionLabels` defined — option keys are the display tokens.

**Semantic interpretation (from key names):**
- `cancel` → ban / disinvite the speaker
- `restricted` → allow with conditions
- `allow_with_counterspeech` → allow unconditionally but organize civil counter-speech
- `allow_no_restrictions` → allow with no restrictions whatsoever

---

**Evidence verbatim:**
```ts
optionEvidence: {
  cancel: {
    continuous: {
      PRO: { pos: [0.55, 0.30, 0.10, 0.04, 0.01] },
      COM: { pos: [0.40, 0.30, 0.15, 0.10, 0.05] }
    },
  },
  restricted: {
    continuous: {
      PRO: { pos: [0.30, 0.35, 0.20, 0.10, 0.05] },
      COM: { pos: [0.20, 0.25, 0.30, 0.15, 0.10] }
    }
  },
  allow_with_counterspeech: {
    continuous: {
      PRO: { pos: [0.10, 0.20, 0.35, 0.25, 0.10] },
      COM: { pos: [0.05, 0.10, 0.20, 0.35, 0.30] }
    }
  },
  allow_no_restrictions: {
    continuous: {
      PRO: { pos: [0.01, 0.04, 0.10, 0.30, 0.55] },
      COM: { pos: [0.10, 0.15, 0.20, 0.25, 0.30] }
    }
  }
}
```

**Computed means:**

| option | PRO mean | PRO dev | COM mean | COM dev |
|---|---|---|---|---|
| `cancel` | 1.66 | −1.34 | 2.10 | −0.90 |
| `restricted` | 2.25 | −0.75 | 2.70 | −0.30 |
| `allow_with_counterspeech` | 3.05 | +0.05 | 3.75 | +0.75 |
| `allow_no_restrictions` | 4.34 | +1.34 | 3.50 | +0.50 |

---

### Option: `cancel`

```
option_text: "cancel" (ban/disinvite the speaker)
declared touch: PRO (position, w=0.80), COM (position, w=0.35)
declared evidence:
  PRO: { pos: [0.55, 0.30, 0.10, 0.04, 0.01] }   (mean ≈ 1.66)
  COM: { pos: [0.40, 0.30, 0.15, 0.10, 0.05] }   (mean ≈ 2.10)
text→evidence sign:     PASS
  PRO: "ban the speaker" = outcome over rights = low PRO → [0.55, 0.30, 0.10, 0.04, 0.01]. ✓
  COM: "unilateral refusal to engage" = confrontational, won't deal = low COM → [0.40, 0.30, 0.15, 0.10, 0.05]. ✓
text→evidence magnitude:
  PRO: mean 1.66, deviation −1.34. APPROPRIATE for the most restrictive option.
  COM: mean 2.10, deviation −0.90. MINOR UNDER-PULL: a flat-out ban with no compromise offered is arguably
       more like COM=1.5. Current row keeps the mode at 1 ([0.40]) but doesn't pull hard enough. Consider
       [0.50, 0.28, 0.12, 0.07, 0.03] (mean ≈ 1.85) for slightly stronger signal. Low severity.
cross-option symmetry:   PRO: see allow_no_restrictions → SYMMETRIC (±1.34). PASS.
                          COM: see allow_no_restrictions → ASYMMETRIC (−0.90 vs +0.50). Flag below.
flags: UNDER-PULL (COM, minor), ASYMMETRIC (COM vs allow_no_restrictions — see cross-cutting)
```

---

### Option: `restricted`

```
option_text: "restricted" (allow with conditions)
declared touch: PRO (position, w=0.80), COM (position, w=0.35)
declared evidence:
  PRO: { pos: [0.30, 0.35, 0.20, 0.10, 0.05] }   (mean ≈ 2.25)
  COM: { pos: [0.20, 0.25, 0.30, 0.15, 0.10] }   (mean ≈ 2.70)
text→evidence sign:     PASS
  PRO: "allow, but only with conditions" = moderate outcomes-weight, not full rights-deference → PRO=2.25. ✓
  COM: "I'll negotiate conditions" = some deal-making behavior → COM=2.70, below center but not extreme. ✓
text→evidence magnitude: APPROPRIATE for a moderate-restrictive option.
cross-option symmetry:   PRO middle asymmetry noted in cross-cutting below.
flags: PASS (sign, magnitude). ASYMMETRIC middle noted cross-cutting.
```

---

### Option: `allow_with_counterspeech`

```
option_text: "allow_with_counterspeech" (allow unconditionally; organize counter-speech)
declared touch: PRO (position, w=0.80), COM (position, w=0.35)
declared evidence:
  PRO: { pos: [0.10, 0.20, 0.35, 0.25, 0.10] }   (mean ≈ 3.05)
  COM: { pos: [0.05, 0.10, 0.20, 0.35, 0.30] }   (mean ≈ 3.75)
text→evidence sign:     PASS
  PRO: "allow the speech" = rights-respecting but not hardline absolutist (also responds civically) → PRO≈3. ✓
  COM: "AND organize counter-speech" = active civic engagement, seeking civic coexistence → high COM. ✓
text→evidence magnitude:
  PRO: mean 3.05, deviation +0.05. PASS — near-center is correct for this hybrid position.
  COM: mean 3.75, deviation +0.75. APPROPRIATE — the active civic-engagement component justifies
       moderately strong high-COM signal.
cross-option symmetry:   COM: allow_with_counterspeech (3.75) outranks allow_no_restrictions (3.50)
                          on COM. This is logically defensible: organizing counter-speech is an
                          active compromise/coexistence act, more COM-expressive than pure non-restriction.
                          Not a bug — a feature.
flags: PASS.
```

---

### Option: `allow_no_restrictions`

```
option_text: "allow_no_restrictions" (allow with no restrictions whatsoever)
declared touch: PRO (position, w=0.80), COM (position, w=0.35)
declared evidence:
  PRO: { pos: [0.01, 0.04, 0.10, 0.30, 0.55] }   (mean ≈ 4.34)
  COM: { pos: [0.10, 0.15, 0.20, 0.25, 0.30] }   (mean ≈ 3.50)
text→evidence sign:
  PRO: PASS. Unconditional speech permission = strong process/rights-first stance → high PRO. ✓
  COM: AMBIGUOUS — see below.
text→evidence magnitude:
  PRO: mean 4.34, deviation +1.34. PASS (symmetric with cancel).
  COM: mean 3.50, deviation +0.50. WRONG-NODE / AMBIGUOUS (see cross-cutting flag).
cross-option symmetry:   PRO: SYMMETRIC with cancel (±1.34). PASS.
                          COM: ASYMMETRIC with cancel (−0.90 vs +0.50). See cross-cutting.
flags: ASYMMETRIC (COM extremes), WRONG-NODE-CONCERN (COM semantics ambiguous for this option — see below)
```

---

### Cross-cutting flag 1: ASYMMETRIC COM extremes

```
cancel:              COM mean 2.10, deviation −0.90
allow_no_restrictions: COM mean 3.50, deviation +0.50

Asymmetry ratio: 0.90 / 0.50 = 1.80×

The question can signal "low COM" (cancel = confrontational refusal) almost twice as strongly as it
can signal "high COM" (allow_no_restrictions = principled permission). The practical consequence:
across the full population, Q21's COM signal has a systematic upward bias — respondents who cancel
speakers get a clear low-COM update, but respondents who allow speech unconditionally get only a
weak high-COM update.

For the harness: the Christian-right traditionalist and the MAGA all-in personas are both likely to
answer `cancel` or `restricted` — they'll correctly receive low COM signals. The Rawlsian Reformer
and Libertarian Republican personas (both likely `allow_no_restrictions`) will receive only a weak
COM=3.5 update, diluting their expected COM separation from each other. The Never-Trump Republican
(expected high COM, statesman AES) may also answer `allow_no_restrictions` for PRO reasons, not COM
reasons — but the engine will assign them mild high-COM credit they may not deserve.

flags: ASYMMETRIC (COM, cross-option)
```

---

### Cross-cutting flag 2: WRONG-NODE concern — COM evidence for `allow_no_restrictions` is PRO-driven

The underlying logic of `allow_no_restrictions` is: **"Speech is a protected process right; I won't trade it for outcomes."** That is the definition of HIGH PRO (proceduralism > outcome-adjustment). It says nothing directly about COM (willingness to make deals / give ground).

Choosing to allow all speech could reflect:
1. **Principled non-compromise on rights** → LOW COM (I won't deal on this principle)
2. **Tolerant indifference** → MODERATE COM (I don't feel the stakes strongly)
3. **Civic openness / accommodation** → HIGH COM (I accept all voices as part of civic coexistence)

The current encoding assumes interpretation 3 (COM=3.50). But speech absolutists in practice are more often principled non-compromisers (interpretation 1), which would argue for LOW or MODERATE COM.

**Proposed fix:** Replace `allow_no_restrictions`'s COM evidence with a near-uniform distribution (no COM signal), letting dedicated COM questions carry that signal:

```ts
// proposed:
allow_no_restrictions: {
  continuous: {
    PRO: { pos: [0.01, 0.04, 0.10, 0.30, 0.55] },
    COM: { pos: [0.16, 0.18, 0.22, 0.24, 0.20] }  // near-uniform; mean ≈ 3.10; no net COM pull
  }
}
```

This eliminates the false-high-COM signal for speech absolutists. If a persona genuinely has high COM, other questions (Q29, Q56, Q79, etc.) will surface it without Q21 distorting it.

Alternatively, if the "civic openness = high COM" interpretation is intentional, document that choice explicitly in the inline comment so reviewers know the theoretical ground.

**Priority:** MEDIUM. Q21 is fixed12, so every respondent's COM posterior gets this slight asymmetric tilt. Personas where PRO is the primary signal (Rawlsian Reformer, Libertarian Republican, Never-Trump R) are most affected because they're most likely to pick `allow_no_restrictions`.

---

### Cross-cutting flag 3: PRO middle-option asymmetry

```
restricted:              PRO mean 2.25, deviation −0.75
allow_with_counterspeech: PRO mean 3.05, deviation +0.05

The restrictive-middle is 0.75 below center; the permissive-middle is only 0.05 above center.
This is ASYMMETRIC but LOGICALLY DEFENSIBLE:
- `restricted` genuinely represents a moderate anti-rights stance (outcome-concerns outweigh rights)
  → PRO should sit meaningfully below center. ✓
- `allow_with_counterspeech` is fully rights-respecting but the "counter-speech" component adds a
  civic-engagement layer, pulling PRO back toward center rather than pinning it to 4+ ✓

The asymmetry correctly reflects that there are more "degrees of restriction" below center than above
(ban > restrict > tolerate-with-response > unconditional permission). No fix needed.

flags: PASS (on further analysis, asymmetry is justified).
```

---

### Summary

| Finding | Severity | Impact | Fix |
|---|---|---|---|
| PRO sign + magnitude (all 4 options) | PASS | — | No action needed |
| PRO extreme-option symmetry | PASS | ±1.34 both sides | No action needed |
| PRO middle-option asymmetry | PASS (justified) | `restricted` further from center than `counterspeech` | No action needed |
| COM extremes: ASYMMETRIC (`cancel` −0.90 vs `no_restrictions` +0.50) | MEDIUM | Every respondent's COM posterior tilted; `allow_no_restrictions` respondents get under-powered high-COM signal | Re-zero `allow_no_restrictions` COM to near-uniform |
| COM `allow_no_restrictions`: WRONG-NODE-CONCERN (option is PRO-driven, not COM-driven) | MEDIUM | Speech absolutists falsely scored COM=3.50 instead of moderate/low | Replace COM row with near-uniform; or add explicit comment justifying "civic openness" interpretation |
| COM `cancel`: minor UNDER-PULL | LOW | `cancel` COM mean 2.10; might be 1.85 | Optional tightening; not blocking |

**Recommended action:** Null out the COM evidence for `allow_no_restrictions` (replace with near-uniform row). This removes a theoretically ambiguous signal and restores COM calibration to dedicated COM questions. All other rows PASS.

**Cross-link:** [[new-questions.md]] Q240 (anti-establishment frame, also touches ONT_S and ZS — the Q21 `allow_no_restrictions` personas are often the same Never-Trump R / Libertarian Republican who would pick `basically_fine` or `partisan_failure` on Q240; Q21's COM over-assignment affects their COM posterior before Q240 fires).

---

## [2026-05-18T13:30 — cycle 10 — AUDIT — Q103 issue_salience_screener]

**Question:** Q103 `priority_sort` — issue_salience_screener (stage: `fixed12`, section: I, `priorityBattery: true`)

**Prompt (verbatim):**
```
promptFull:
  "Sort each political topic by how much it enters into your politics. " +
  "Topics that feel central to your political identity go on the left. " +
  "Topics you don't consider much go on the right."
```

**TouchProfile declared (all 11 entries, verbatim):**
```ts
{ node: "MAT",   kind: "continuous",  role: "salience", weight: 0.95, touchType: "salience_screener" },
{ node: "CD",    kind: "continuous",  role: "salience", weight: 0.95, touchType: "salience_screener" },
{ node: "CU",    kind: "continuous",  role: "salience", weight: 0.95, touchType: "salience_screener" },
{ node: "MOR",   kind: "continuous",  role: "salience", weight: 0.95, touchType: "salience_screener" },
{ node: "PRO",   kind: "continuous",  role: "salience", weight: 0.95, touchType: "salience_screener" },
{ node: "COM",   kind: "continuous",  role: "salience", weight: 0.95, touchType: "salience_screener" },
{ node: "ZS",    kind: "continuous",  role: "salience", weight: 0.95, touchType: "salience_screener" },
{ node: "ONT_H", kind: "continuous",  role: "salience", weight: 0.95, touchType: "salience_screener" },
{ node: "ONT_S", kind: "continuous",  role: "salience", weight: 0.95, touchType: "salience_screener" },
{ node: "EPS",   kind: "categorical", role: "salience", weight: 0.95, touchType: "salience_screener" },
{ node: "AES",   kind: "categorical", role: "salience", weight: 0.95, touchType: "salience_screener" }
```

**salienceBuckets (verbatim):**
```ts
salienceBuckets: {
  supportHigh: [0.00, 0.02, 0.08, 0.90],
  supportMid:  [0.10, 0.25, 0.40, 0.25],
  neutral:     [0.90, 0.08, 0.02, 0.00],
  opposeHigh:  [0.00, 0.02, 0.08, 0.90]
},
```

Inline comment on neutral bucket (verbatim):
```ts
// Hard likelihoods on the "neutral" bucket — the whole point of this
// question. [0.90, 0.08, 0.02, 0.00] drives salDist[0] from uniform 0.25 to
// ~0.90 in one touch (vs. the default SAL_PRIORITY_LOW's asymptote at 0.63).
```

**rankingMap (verbatim, selected entries):**
```ts
rankingMap: {
  mat:   { continuous:  { MAT:   {} } },
  cd:    { continuous:  { CD:    {} } },
  cu:    { continuous:  { CU:    {} } },
  mor:   { continuous:  { MOR:   {} } },
  pro:   { continuous:  { PRO:   {} } },
  com:   { continuous:  { COM:   {} } },
  zs:    { continuous:  { ZS:    {} } },
  ont_h: { continuous:  { ONT_H: {} } },
  ont_s: { continuous:  { ONT_S: {} } },
  eps:   { categorical: { EPS: [1/6, 1/6, 1/6, 1/6, 1/6, 1/6] } },
  aes:   { categorical: { AES: [1/6, 1/6, 1/6, 1/6, 1/6, 1/6] } }
}
```

Inline comment on empty evidence objects (verbatim):
```ts
// Each item maps to exactly one node. Continuous items carry an empty
// evidence object — all salience work is done by applyPrioritySort's
// per-node bucket aggregation with this question's salienceBuckets override.
// No position evidence: this question only rules nodes in or out, it does
// not try to localize position on mattering nodes (that's the other 11
// fixed-opener questions' job).
```

**optionLabels (verbatim, relevant):**
```ts
mor:   "Reach of moral concern — how wide a circle of obligation reaches: family, country, all of humanity, or somewhere in between.",
eps:   "Evidence and authority — the standards by which political claims earn credibility: data, tradition, expert opinion, lived experience, gut instinct.",
aes:   "Political style — the kind of leadership and rhetorical register that resonates: fighter, statesman, visionary, technocrat, pragmatist."
```

---

### Finding 1: WRONG-NODE-CONCERN (MEDIUM) — `mor` item screeners for deprecated MOR salience, not moralCircle salience

```
item_text: "Reach of moral concern — how wide a circle of obligation reaches..."
declared touch: MOR (continuous, role: salience, w=0.95)
rankingMap write: { continuous: { MOR: {} } }
```

Post-ADR-007 (in effect 2026-05-07), `MOR` is a deprecated node. Q8, Q231, and Q229 now write to `moralCircle.universalAffinity` and `moralCircle.scopedAffinities`. The "reach of moral concern" screener item in Q103 writes to `MOR` salience — the old bucket — not to any moralCircle dimension.

**The downstream consequence of MOR salience from Q103:** The EIG selector uses each node's salience to prioritize which questions to ask next. A high MOR salience (from `mor: supportHigh` on Q103) will cause the selector to favor questions whose touchProfile includes MOR — which are the legacy MOR position questions. A low MOR salience (from `mor: neutral`) suppresses those same questions.

**The problem:** The moral-circle battery (Q229/Q230/Q231, plus conditional Q232–Q239) is not gated on MOR salience. Q229/Q230/Q231 are `fixed12` (always ask). Q232–Q239 are gated by `universalAffinity` level (from Q8/Q231), not by MOR salience. So Q103's `mor` item has **zero effect on whether the moral-circle battery fires** — the battery fires unconditionally (fixed12 portion) or based on a wholly separate signal (universalAffinity for the conditional probes).

What Q103's `mor` salience DOES control: the selection of non-fixed12 questions that still declare `MOR` in their touchProfile (the legacy path, ADR-007 "retained as deprecated fallback paths during the transition"). A respondent who marks `mor: neutral` on Q103 will never be asked those legacy MOR questions — which is fine because those questions are deprecated. A respondent who marks `mor: supportHigh` might be asked them — which produces MOR position evidence that ADR-007 acknowledges as a fallback when `state.moralCircle.affinity` is null.

**In practice:** The `mor` screener item in Q103 is a screener for deprecated questions. Whether it fires or not has no effect on the moralCircle path that actually governs archetype matching and IDP routing. The design intent of Q103's `mor` item — "does moral concern enter this person's politics?" — is sound as a concept, but the implementation (writing to deprecated MOR salience) is disconnected from the module (moralCircle) that actually uses moral-concern evidence.

**flags:** WRONG-NODE-CONCERN (item screeners for deprecated node; has no effect on moralCircle battery routing)

**Proposed fix:**
Replace the `mor` rankingMap entry and touchProfile entry with a `MORAL_CIRCLE` write:
```ts
// touchProfile:
{ node: "MORAL_CIRCLE", kind: "derived", role: "salience", weight: 0.95, touchType: "salience_screener" }

// rankingMap:
mor: { moralCircle: { salienceActivation: true } }   // flag that moralCircle is salient for this respondent
```

This signals to the selector that moralCircle-touching questions (Q232–Q239 conditional probes) are worth asking for this respondent. Currently those probes rely only on universalAffinity to gate, not on a "respondent flagged moral concern as salient" signal. Adding a moralCircle salience write from Q103 would allow the selector to ask Q232–Q239 even for respondents whose universalAffinity is borderline (the existing gate is a hard threshold; a salience flag could soften it).

Note: implementing this fix requires a `salienceActivation` or equivalent field to exist in the moralCircle write API — this is a small engine change, not just a data change. Flag for ADR-007 follow-on work.

**Priority:** MEDIUM. Q103 is fixed12 and fires for everyone. The MOR screener item is currently not harming anyone (deprecated questions being gated out is acceptable behavior), but it's also not providing any useful signal to the moralCircle path. As the legacy MOR questions are retired, the `mor` item in Q103 will become entirely vestigial unless migrated.

---

### Finding 2: STRUCTURAL-CONCERN (MEDIUM) — EPS label induces systematic salience over-reporting for respondents with non-empiricist styles

```
item_text: "Evidence and authority — the standards by which political claims earn credibility: data, tradition, expert opinion, lived experience, gut instinct."
declared touch: EPS (categorical, role: salience, w=0.95)
```

The inline comment records that labels were rewritten twice (2026-04-25 and 2026-05-13) for "pole-bias removal" — to avoid labels leaning toward one pole discouraging respondents from marking the topic salient. The EPS label successfully names the spectrum ("data, tradition, expert opinion, lived experience, gut instinct" enumerates all six EPS categories).

**The problem:** The prompt "how much does this topic enter into your politics" interacts badly with the EPS label for two populations:

**Population 1 — Empiricists and institutionalists (EPS over-reporters):**
These respondents believe strongly in data and evidence. They will mark EPS `supportHigh` because "of course evidence matters to my politics." But "I believe in evidence" is not the same as "my epistemic style is a distinctive, politically-salient feature of my identity that meaningfully separates me from others." Empiricists who are the modal educated respondent will inflate EPS salience, causing the selector to over-ask EPS questions for a population where EPS position is already near-uniform (most educated respondents cluster empiricist; a high-EPS-salience + flat-EPS-posterior respondent wastes question budget).

**Population 2 — Intuitionists, traditionalists, and nihilists (EPS under-reporters):**
These respondents operate on gut instinct, tradition, or anti-evidence skepticism. But when asked "do the standards by which political claims earn credibility enter into your politics?", they may answer `neutral`. An intuitionist who "just knows what's right" does not frame their approach as a consciously-held epistemology — they're not thinking about "the standards for evaluating political claims" because they've bypassed that meta-cognitive step. Similarly, a nihilist respondent may dismiss the question as irrelevant to how they actually decide things. Both mark EPS `neutral` → aggressive kill → selector never asks EPS position questions → archetype matching never receives EPS signal → intuitionist/nihilist/traditionalist archetypes unreachable for these respondents.

**Magnitude of concern:** The intuitionist/nihilist EPS gap is noted in HARNESS-HANDOFF §3, persona 15: "Young low-trust nihilist... EPS=nihilist. Tests the rarely-instantiated nihilist EPS branch." If the nihilist persona marks EPS `neutral` on Q103, the engine will never surface their nihilist style, and their archetype match will rely entirely on other signals. Whether the currently-achievable archetypes from non-EPS signals happen to be nihilist-coded is an empirical question — but the pathway for EPS to participate is closed.

**flags:** STRUCTURAL-CONCERN (EPS under-reporting for intuitionist/nihilist respondents; EPS over-reporting for high-education empiricists)

**Proposed mitigation (no fix required, just awareness):**
The label design cannot fully solve this without making the screener cognitively burdensome. The practical mitigation is a **fallback EPS probe** that fires for respondents who marked EPS `neutral` on Q103 but show other signals consistent with non-standard EPS styles (e.g., high ZS + low ONT_S + anti-establishment frame on Q240 → likely intuitionist; consider an `eligibleIf: ["eps_screened_out", "anti_establishment_signal"]` gate on an EPS-probing question). This is a selector improvement, not a Q103 fix.

**Priority:** MEDIUM. The under-reporting concern affects the nihilist/intuitionist branch specifically — a small but non-trivial population. The over-reporting concern wastes EIG budget for common-empiricist respondents. Both are signal-quality problems, not sign errors.

---

### Finding 3: PASS — `opposeHigh` = `supportHigh` salience buckets (intentional design)

Both `opposeHigh: [0.00, 0.02, 0.08, 0.90]` and `supportHigh: [0.00, 0.02, 0.08, 0.90]` drive salDist to sal=3. This is correct: in a priority sort about "how much does this topic enter your politics," the four zones represent:

- `supportHigh` (leftmost): "This is central to my politics (I favor this lens)"
- `supportMid`: "This is moderately important to me"
- `neutral`: "I don't consider this much"
- `opposeHigh` (rightmost): "I'm strongly activated AGAINST politics that centers on this"

Both extreme zones correctly indicate HIGH salience. A libertarian who places `ont_s` (Institutions) in `opposeHigh` is strongly politically activated around institutional policy — just from the skeptical/anti-statist direction. The `neutral` kill is correctly in the third bucket (not the rightmost), meaning genuine indifference is captured before the "strong opposition" pole.

```
text→salience direction: PASS (opposeHigh correctly signals activation, not disengagement)
salienceBuckets logic:   PASS (neutral kill at correct position in the 4-zone sort)
```

**flags:** PASS.

---

### Finding 4: PASS — position evidence correctly absent; POS-VS-SAL-CONFUSION does not apply

All 9 continuous `rankingMap` entries carry empty evidence objects `{}`. Both categorical entries (`EPS`, `AES`) carry uniform distributions `[1/6, 1/6, 1/6, 1/6, 1/6, 1/6]` — a deliberate no-op for categorical position. The inline comment explicitly states: "No position evidence: this question only rules nodes in or out."

The touchProfile declares all 11 entries with `role: "salience"`. There are no `role: "position"` entries in touchProfile, and no position writes in rankingMap. There is no POS-VS-SAL-CONFUSION in this question.

```
POS-VS-SAL-CONFUSION check: PASS (salience-only design correctly implemented)
```

**flags:** PASS.

---

### Summary

| Finding | Severity | Impact | Fix |
|---|---|---|---|
| `mor` item writes to deprecated MOR salience, not moralCircle salience | MEDIUM | mor screener has no effect on moralCircle battery routing; vestigial as MOR deprecated | Migrate to MORAL_CIRCLE salience write (requires small engine change) |
| EPS label induces salience under-reporting for intuitionist/nihilist styles | MEDIUM | Nihilist/intuitionist EPS branch shut out of matching for self-unaware responders | Selector fallback EPS probe with anti-establishment + low-ONT_S gate |
| `opposeHigh` = `supportHigh` on salience | PASS (intentional) | — | No action |
| Position evidence absent | PASS | — | No action |

**Cross-link:** [[audit-findings.md]] cycles 2+4+5 (MOR → moralCircle migration chain: Q8/Q228/Q229/Q231 all involved; Q103 is the earliest fixed12 opener and adds a fourth MOR-vs-moralCircle mismatch in the fixed12 chain). [[weird-edge-cases.md]] — the intuitionist/nihilist EPS under-reporting is an instance of a self-unaware respondent who cannot introspect their own epistemic style; worth adding to weird-edge-cases if that file is created.

---

## [2026-05-18T15:00 — cycle 11 — SYNTHESIZE — audit-findings.md]

### Pre-harness fix priority ranking

Ten cycles of audit and architecture work have produced ~12 distinct intervention proposals. This section dedupes overlapping proposals and ranks the top 5 by the criterion that matters most before running the persona harness: **will leaving this unfixed cause the harness to report a false failure, obscuring a real bug, or misattribute a correct behavior as broken?**

Secondary criteria: implementation risk (can it be wrong?), reversibility, blast radius.

---

#### Cluster mapping — which proposals are really the same fix

Before ranking, group the proposals by root cause:

**Cluster A — IDP gate chain (Q231 + Q228 + Q201)**
Three independent audit cycles (1, 4, 5) and the architecture synthesis (cycle 6) all converge on the same structural problem: the IDP gate ceiling (`universalAffinity ≤ 75`) is functionally unreachable for respondents who answer the two universal-baseline probes in a socially expected way.

- Q231 cycle 5: `81-100` bucket assigns universal=95, permanently blocking IDP routing for anyone sliding above 80 on the stranger-suffering question.
- Q8 cycle 2: `clearly_abroad` assigns universal=90, same permanent block from the forced-choice question.
- Q228 cycle 4: was supposed to be retired by Q229 but `eligibleIf: ["answered_q8_abroad"]` is still live → double-probing clearly_abroad respondents AND a comment on Q229 incorrectly describes Q228 as already retired.
- Q201 cross-link cycle 8 (cross-links.md): Q201's national-identification signal routes to TRB (deprecated), not `moralCircle.scopedAffinities.national`, creating a scoped-evidence blind spot on top of the universal-ceiling problem.

These four are one compound fix. The core intervention is: (a) recalibrate Q231's top two buckets, (b) retire Q228, (c) migrate Q201 to moralCircle writes. All three must happen together for reliable IDP routing.

**Cluster B — evidence calibration (Q201 ONT_S, Q21 COM)**
Two independent calibration problems with no shared root cause:

- Q201 cycle 1: `proud_distrustful` and `critical_low_trust` ONT_S rows are UNDER-PULL (distrust end ~3× weaker than trust end). ASYMMETRIC.
- Q21 cycle 7: `allow_no_restrictions` COM row is WRONG-NODE (assigns COM=3.5 for a PRO-driven response). ASYMMETRIC.

Both create a systematic directional bias in fixed12 questions — every respondent sees the tilted signal. Neither is a correctness bug (no SIGN-ERROR), but both inject persistent noise.

**Cluster C — MOR→moralCircle metadata drift (Q8, Q231, Q103 touchProfile)**
Three questions declare MOR in touchProfile but their actual evidence writes already use `moralCircle:` syntax (Q8, Q231) or are simply vestigial to the deprecated path (Q103 `mor` item). No runtime impact — fixed12 questions don't participate in EIG selection. Cosmetic only.

**Cluster D — EPS architecture (Q103 intuitionist/nihilist blind spot)**
Q103's EPS screener underreports salience for intuitionist/nihilist/traditionalist styles, potentially shutting EPS position questions out for those respondents. Fix requires either a new fallback probe with a compound eligibility gate, or a selector change to probe EPS unconditionally for respondents matching a ZS+ONT_S+anti-establishment profile. Neither is a 2-line fix — this is medium-effort and requires verifying the gate registry before implementation.

---

#### Top 5 ranked interventions

**#1 — Q231 bucket recalibration + Q228 retirement [Cluster A, IDP gate]**

```
Source: audit cycle 5 (Q231 Finding 3) + audit cycle 4 (Q229 Finding 2) + architecture cycle 6
Fix:
  Q231 sliderMap:
    "61-80":  { moralCircle: { universal: 65 } }   // was 75
    "81-100": { moralCircle: { universal: 75 } }   // was 95
  Q228: eligibleIf: ["__retired__"]                // was ["answered_q8_abroad"]
Effort: 3 lines in questions.representative.ts
Risk: LOW. Recalibration moves the 81-100 population from universal=95 to universal=75 (at gate
      ceiling). True universalists (Rawlsian Reformer #001) match on near-zero excess vector;
      recording universal=75 instead of 95 barely changes their distance score.
Reversibility: trivial — restore 2 bucket values and un-retire Q228.
```

**Why #1:** Without this fix, the harness's IDP-routing assertions will always fail for Tier-A personas (Abstain→Trump, MAGA all-in) because the expected behavior (national/ideological excess → IDP overlay) requires universalAffinity ≤ 75, and those personas are likely to slide above 80 on a compassion-framing question. The harness will report "IDP routing broken" when the logic is correct — a false failure that obscures whether the harness is testing what it claims to test.

**Prerequisite check (before implementing):** Verify in `src/engine/updateAvg.ts` or equivalent that Q231's moralCircle write applies at full weight (1.0 effective), not at the 0.10 MOR legacy weight declared in touchProfile. If the moralCircle write is separately weighted, the proposed bucket values may over- or under-correct. The architecture synthesis (cycle 6) flagged this exact verification: "the moralCircle write in sliderMap has no explicit weight — it may be applying at full weight or at a separately-specified weight."

---

**#2 — Q201 moralCircle migration [Cluster A, scoped evidence]**

```
Source: audit cycle 1 (cross-cutting WRONG-NODE flag) + cross-links cycle 8 (cross-link 3)
Fix: Add moralCircle writes to Q201's optionEvidence for the three meaningful options:
  proud_and_trust:        moralCircle: { universal: 55, scopedAffinities: { national: 75 } }
  internationalist_trusting: moralCircle: { universal: 80 }
  critical_low_trust:     moralCircle: { universal: 55, scopedAffinities: { national: 35 } }
  (proud_distrustful, moderate_pride_mixed_trust: no moralCircle write, or add neutral universal:55)
Keep TRB writes as legacy fallback (do not remove until full TRB deprecation pass).
Effort: ~10 lines in questions.representative.ts
Risk: LOW. Additive change — adds a new evidence path without removing the existing TRB path.
```

**Why #2:** Q201 is the earliest fixed12 question (section I) and the first national-identity probe every respondent sees. Its signal currently goes to the deprecated TRB bucket, invisible to moralCircle matching and IDP routing. Without this migration, the national excess pathway relies entirely on Q229 (`ingroup_national: supportHigh`) as the sole national scopedAffinity source — a respondent who expresses national pride on Q201 but answers Q229 more abstractly ("fellow citizens" in supportMid, not supportHigh) gets no national excess credit for Q201's signal. White Grievance Voter (#141) and other national-IDP archetypes are undertriggered.

The fix is lower-risk than it sounds: it adds evidence to a previously-blind path, it keeps TRB as a fallback, and the specific values proposed (national=75 for `proud_and_trust`) are conservative (excess = 75 − 55 = 20, exactly at the gate floor).

---

**#3 — Q21 COM null-out for `allow_no_restrictions` [Cluster B]**

```
Source: audit cycle 7 (cross-cutting flag 2: WRONG-NODE concern)
Fix:
  allow_no_restrictions.continuous.COM: { pos: [0.16, 0.18, 0.22, 0.24, 0.20] }
  // near-uniform, mean ≈ 3.10; was [0.10, 0.15, 0.20, 0.25, 0.30], mean ≈ 3.50
Effort: 1 line
Risk: VERY LOW. Replaces a theoretically ambiguous +0.5 COM push with a no-op.
      Dedicated COM questions will carry the COM signal for high-COM personas.
```

**Why #3:** Q21 is fixed12 and fires for every respondent. Every person who picks `allow_no_restrictions` currently receives an artifactual COM=3.5 bump. The cycle 7 audit found this is a PRO-driven choice (speech absolutism is a process-rights stance, not a compromise stance), and the COM assignment is logically unjustified. The cross-link (cycle 8) found this specifically contaminates the Never-Trump Republican persona's final archetype-match dimensions. Because Q21 fires before any stage2 questions, this contamination propagates into every subsequent COM-sensitive match. A 1-line fix that eliminates a systematic false signal is worth doing before the harness runs.

---

**#4 — Q201 ONT_S calibration (UNDER-PULL / ASYMMETRIC) [Cluster B]**

```
Source: audit cycle 1 (`proud_distrustful` and `critical_low_trust` findings)
Fix:
  proud_distrustful.continuous.ONT_S:   [0.18, 0.27, 0.30, 0.18, 0.07]  // was [0.08, 0.18, 0.36, 0.25, 0.13]
  critical_low_trust.continuous.ONT_S:  [0.35, 0.30, 0.22, 0.10, 0.03]  // was [0.18, 0.27, 0.32, 0.16, 0.07]
Effort: 2 lines
Risk: LOW. Strengthens directional pulls that were already directionally correct. No sign changes.
```

**Why #4:** The distrust end of Q201's ONT_S signal is ~3× weaker than the trust end (`critical_low_trust` mean 2.65 vs. `proud_and_trust` mean 4.02 → asymmetric deviation: −0.35 vs +1.02). This creates a systematic upward bias in every respondent's ONT_S posterior from Q201: the engine confirms "institutions matter" much more strongly than it confirms "institutions don't work." Q240 (proposed new question, cycle 3) probes ONT_S via causal attribution — but Q201's pre-existing ONT_S tilt from fixed12 will bias the prior that Q240 updates. Fixing Q201 first means Q240's EIG signal lands on a calibrated starting posterior.

This is ranked #4 rather than #3 because its effect is smaller per respondent (weight 0.20 vs Q21's whole-respondent contamination) and its blast radius is limited to the distrust-leaning sub-population rather than everyone who picks `allow_no_restrictions`.

---

**#5 — Q229 inline comment correction [Cluster C, LOW severity]**

```
Source: audit cycle 4 (Finding 1: MISLEADING-COMMENT)
Fix: Replace inline comment on Q229's supportHigh bucket with the corrected version
     (documented verbatim in cycle 4's "proposed correction" block).
Effort: ~8 lines (comment replacement)
Risk: ZERO. Comment-only change. No runtime effect.
```

**Why #5:** Ranked last of the top 5 because it's zero-runtime-impact. It earns its place because the misleading comment ("real excess even when universal=90") will actively mislead whoever implements the harness or reviews IDP routing behavior. When the Tier-A personas fail IDP routing before fix #1 is applied, the comment is the first thing a developer reads to understand why — and it says the wrong thing. Correcting it now prevents the misleading comment from compounding the debugging time. Costs nothing; saves a debugging cycle.

---

#### Deferred fixes (not in top 5)

| Fix | Reason deferred |
|---|---|
| Q8 touchProfile MORAL_CIRCLE declaration | Cosmetic; fixed12 question never evaluated by EIG selector |
| Q231 touchProfile MORAL_CIRCLE declaration | Same — cosmetic, fixed12 |
| Q103 `mor` item → MORAL_CIRCLE migration | Requires engine-side `salienceActivation` API that doesn't exist yet; medium effort |
| Q103 EPS fallback probe | New question + gated eligibility design; medium effort; schedule post-harness once EPS under-reporting is confirmed empirically |
| Q228 inline comment correction | Q228 will be retired (#1 fix), making its comments moot |

---

#### Fix sequencing — canonical order for Sam

1. **Q231 recalibration + Q228 retirement** (fixes IDP gate ceiling; enables all IDP harness assertions)
2. **Q201 moralCircle migration** (fills national-scoped evidence blind spot; enables White Grievance / national-IDP path)
3. **Q21 COM null-out** (eliminates PRO-driven COM contamination; cleaner Never-Trump R / Libertarian R discrimination)
4. **Q201 ONT_S strengthening** (calibrates distrust end before Q240 stage2 fires)
5. **Q229 comment correction** (zero-risk clarity fix; do at any point in the sequence)

After these 5 are applied: run the harness. Report what breaks. EPS fallback probe and Q103 moralCircle migration are post-harness decisions — they require empirical evidence of scale (how many personas actually hit the EPS dead-end?) before committing to a medium-effort architectural fix.

---

## [2026-05-18T — cycle 12 — AUDIT — Q230 universal_baseline_humanity]

**Question:** Q230 `slider` — universal_baseline_humanity (stage: `fixed12`, section: I)

**TouchProfile declared:**
```ts
{ node: "MOR", kind: "continuous", role: "position", weight: 0.10, touchType: "universal_baseline_legacy_proxy" }
```

**sliderMap (verbatim from `src/config/questions.representative.ts`, lines 4913-4919):**
```ts
sliderMap: {
  "0-20":   { moralCircle: { universal: 10 } },
  "21-40":  { moralCircle: { universal: 30 } },
  "41-60":  { moralCircle: { universal: 50 } },
  "61-80":  { moralCircle: { universal: 75 } },
  "81-100": { moralCircle: { universal: 95 } },
},
```

**Prompt (verbatim):**
```
"How much moral concern do you feel for any human being, simply because they are human?"
```

**Ordering context:** Q230 has `quality: 0.98`; Q231 has `quality: 0.97`. Both are `fixed12`, section I. The diagnostic harness ordering at `src/test/diagnostic-40k.ts:504` sorts fixed12 questions by descending quality within their stage. Q230 fires **before** Q231 in every run.

---

### Finding 1: INCOMPLETE-FIX (HIGH) — Q230 was NOT recalibrated when Q231 was, neutralizing the fix for most high-slider respondents

Q231 was recalibrated on 2026-05-18 to:
```ts
// Q231 (as found in src/config/questions.representative.ts):
"61-80":   { moralCircle: { universal: 65 } },   // was 75
"81-100":  { moralCircle: { universal: 75 } },   // was 95
```

Q230 retains the original (unrecalibrated) mapping:
```ts
// Q230 (current, as found in src/config/questions.representative.ts):
"61-80":   { moralCircle: { universal: 75 } },   // NOT recalibrated
"81-100":  { moralCircle: { universal: 95 } },   // NOT recalibrated
```

**Engine averaging logic (verbatim from `src/engine/update.ts`, lines 440-444):**
```ts
if (typeof ev.universal === "number" && Number.isFinite(ev.universal)) {
  const v = Math.max(0, Math.min(100, ev.universal));
  acc.universalSum += v;
  acc.universalCount += 1;
}
```
And the materialization (lines 470-471):
```ts
const universalAffinity =
  acc.universalCount > 0 ? acc.universalSum / acc.universalCount : 50;
```

The engine uses a **simple arithmetic mean** with equal weight per write. There is no per-question weighting, no recency bias, and no overwrite. Every `moralCircle.universal` write contributes exactly one count to the running average.

**Concrete arithmetic for a respondent who answers both sliders high:**

| Q | Slider value | Bucket | Universal written | After this write |
|---|---|---|---|---|
| Q230 | 85 | `81-100` | **95** (not recalibrated) | sum=95, count=1, **mean=95** |
| Q231 | 85 | `81-100` | **75** (recalibrated) | sum=170, count=2, **mean=85** |

Final `universalAffinity` = **85**. IDP gate ceiling = 75. **IDP permanently blocked**.

This is identical to the pre-fix behavior identified in cycle 5 / architecture cycle 6: "a respondent who slides above 80 is permanently IDP-ineligible." The Q231 recalibration does NOT fix this for respondents who also slide Q230 above 80 — which is any respondent who answers "high moral concern for any human being" AND "high concern when a stranger suffers."

**The Q231 fix only works when Q230 produces a low-to-moderate universal write.** Specifically:
- Q230 (0-40 → universal=10 or 30) + Q231 (81-100 → universal=75) → mean = **42.5 or 52.5** → IDP accessible ✓
- Q230 (41-60 → universal=50) + Q231 (81-100 → universal=75) → mean = **62.5** → IDP accessible ✓
- Q230 (61-80 → universal=75) + Q231 (81-100 → universal=75) → mean = **75** → IDP accessible (exactly at ceiling) ✓
- **Q230 (81-100 → universal=95) + Q231 (81-100 → universal=75) → mean = 85 → IDP blocked ✗**
- **Q230 (81-100 → universal=95) + Q231 (61-80 → universal=65) → mean = 80 → IDP blocked ✗**

The failure case is not a corner: "How much moral concern do you feel for any human being, simply because they are human?" is subject to the same social desirability inflation as Q231. A respondent with genuine in-group attachments (the MAGA nationalist, the Evangelical tribalist) is likely to answer both Q230 AND Q231 high — because they do care about humanity in the abstract, they just care MORE about their in-group.

---

### Finding 2: HOLLOW-TOUCH — MOR declared, never written

Same pattern as Q231 (identified in cycle 5, Finding 1). touchProfile declares `MOR` but no sliderMap bucket writes to `continuous.MOR.pos`. Zero MOR evidence emitted.

```
flags: HOLLOW-TOUCH (LOW severity, cosmetic; MOR is deprecated, Q230 is fixed12)
```

---

### Finding 3: STRUCTURAL-CONCERN — Q230 + Q8 compound interaction

For a `clearly_abroad` respondent who also slides both universal questions high:

| Source | Universal written |
|---|---|
| Q8 `clearly_abroad` | 90 |
| Q230 high (81-100) | 95 |
| Q231 high (81-100, recalibrated) | 75 |

Final mean = (90 + 95 + 75) / 3 = **86.7**. IDP blocked.

Even if Q230 is also recalibrated (Finding 1 fix applied → 75), the Q8 `clearly_abroad` write of 90 still pulls the mean above 75: (90 + 75 + 75) / 3 = **80**. Still IDP blocked.

This residual case is likely **intentional**: a respondent who (a) picks 100 foreign lives over 10 domestic (Q8), AND (b) slides "moral concern for any human" to max (Q230), AND (c) slides "concern when a stranger suffers" to max (Q231) is a genuine strong universalist. They SHOULD be IDP-blocked. The Q8 + 2×high-slider combination identifies them correctly.

The non-intentional failure remains: a respondent who answers Q230 high but Q8 = `clearly_domestic` or `hard_to_say`. For them:
- Q8 write: universal=30 (domestic) or 55 (hard_to_say)
- Q230 high: universal=95 (not recalibrated)
- Q231 high: universal=75 (recalibrated)
- Mean: (30 + 95 + 75) / 3 = **66.7** (domestic → IDP accessible) ✓
- Mean: (55 + 95 + 75) / 3 = **75** (hard_to_say → IDP accessible exactly at ceiling) ✓

So the compound problem is: Q8 = `clearly_abroad` AND both universals high = genuine universalist, intentionally blocked. Q8 ≠ `clearly_abroad` AND only Q230 high = the case where Q230's unrecalibrated 95 is an over-estimate that the proposed fix corrects.

---

### Proposed fix

Apply the same 2-line recalibration to Q230 that was applied to Q231:

```ts
// Q230 sliderMap — proposed:
"61-80":   { moralCircle: { universal: 65 } },   // was 75
"81-100":  { moralCircle: { universal: 75 } },   // was 95
```

**Effect:** For the typical "warm universalist with in-group attachments" (slides Q230 high, slides Q231 high, picks Q8 domestic or neutral):
- Q230 (75) + Q231 (75) → mean = **75** → IDP accessible (exactly at ceiling)
- Q230 (75) + Q231 (65) → mean = **70** → IDP accessible ✓

This is the target behavior: a respondent who says "yes, I care about humanity broadly" can still access IDP routing if their Q229 scoped placements reveal in-group excess.

For genuine universalists (Q8 `clearly_abroad` AND both universals high):
- Q8 (90) + Q230 (75) + Q231 (75) → mean = **80** → IDP blocked. Correct behavior.

**Implementation:** 2 lines in `src/config/questions.representative.ts` (Q230 sliderMap). Mirrors the already-applied Q231 fix exactly. No type changes, no engine changes.

---

### Prerequisite note (same as cycle 6 flag for Q231)

Confirm that Q230's moralCircle write applies at full weight (count=1 per slider answer), not at the MOR touchProfile weight of 0.10. The `applyMoralCircleEvidence` path used by slider answers (via `applyOptionEvidence` → `applyMoralCircleEvidence`) does NOT reference touchProfile weights — it adds directly to the accumulator (verbatim: `acc.universalSum += v; acc.universalCount += 1`). **Full weight confirmed** — the touchProfile weight of 0.10 is irrelevant to the moralCircle write. The proposed recalibration values are not under- or over-powered by this weight.

---

### Summary

| Finding | Severity | Impact | Fix |
|---|---|---|---|
| INCOMPLETE-FIX — Q230 not recalibrated, neutralizes Q231 fix for high-slider respondents | **HIGH** | Respondents who answer Q230 ≥ 81 (universal=95) and Q231 ≥ 81 (universal=75) land at mean=85 → IDP permanently blocked; cycle 5/11 fix #1 only half-applied | Apply same recalibration to Q230: `61-80 → 65`, `81-100 → 75` |
| HOLLOW-TOUCH — MOR declared in touchProfile, no MOR write | LOW | Cosmetic; Q230 is fixed12, MOR is deprecated | Add MORAL_CIRCLE to touchProfile (matches Q231 pattern) |
| Q8 + Q230 + Q231 compound: `clearly_abroad` + both-high still blocked | LOW (intentional) | Genuine universalists remain IDP-blocked even with fix | Correct by design — document, no action needed |

**Priority: HIGH.** Q230 fires before Q231 and contributes to the same running mean. The Q231 recalibration (cycle 11 fix #1) is effectively half a fix as long as Q230 is uncorrected. This should be applied in the same commit as Q231 was fixed (or immediately after), before any harness runs that test IDP routing.

**Updated fix sequencing (revises cycle 11 canonical order):**

Insert as fix #0 (precondition for #1 to have its intended effect):

```
#0 — Q230 bucket recalibration
     "61-80":  { moralCircle: { universal: 65 } }  // was 75
     "81-100": { moralCircle: { universal: 75 } }  // was 95
     Same 2-line change as Q231. Apply in same pass.
```

Fix #1 (cycle 11) now reads: "Q231 recalibration (already applied) + Q230 recalibration (this finding) + Q228 retirement."

**Cross-links:** [[audit-findings.md]] cycle 5 (Q231 original cliff finding); cycle 6 (IDP gate architecture synthesis — the architecture-thoughts.md entry only references Q231, not Q230; this finding updates it); cycle 11 fix #1 (now partially superseded). [[architecture-thoughts.md]] IDP gate calibration section — prerequisite verification step now confirmed (full weight, not 0.10).

---

## [2026-05-18T20:00 — cycle 16 — CRITIQUE — Q242 party_alignment_self_assessment]

**Mode:** CRITIQUE of proposed question Q242 (generated cycle 13).
**Verdict:** REFINE — not kill. Remove all `moralCircle.scopedAffinities` writes. Keep COM and ZS continuous writes, which are the question's real value.

---

### Core finding: WRONG-CONSTRUCT (HIGH) — ideological scopedAffinity writes conflate party-platform fit with in-group moral concern

Q242 writes `moralCircle: { scopedAffinities: { ideological: [85|65|40|20] } }` to represent how closely the respondent's party aligns with their values. Q229 writes `moralCircle: { scopedAffinities: { ideological: 95 } }` to represent how much EXTRA moral concern the respondent feels for their political in-group. These are **different constructs**. The question asks:

- **Q229 prompt:** "How much extra moral concern do you feel for each of these groups, beyond what you feel for people in general?" — item `ingroup_ideological: "People who share your core political values"`
- **Q242 prompt:** "Which best describes how your party fits your actual political values?"

A MAGA voter who: (a) feels strong in-group solidarity with the MAGA/America First community → Q229 places `ingroup_ideological` in supportHigh → writes **95** to accumulator; AND (b) believes the Republican Party establishment doesn't fully serve that movement → Q242 `reluctant_partisan` → writes **20** to accumulator.

**Engine arithmetic** (verbatim from `src/engine/update.ts` lines 446–454 + 480–482):

```ts
// applyMoralCircleEvidence — every write adds one count regardless of source
acc.scopedSums[key] = (acc.scopedSums[key] ?? 0) + v;
acc.scopedCounts[key] = (acc.scopedCounts[key] ?? 0) + 1;

// materialization:
scopedAffinities[scope] = (acc.scopedSums[scope] ?? 0) / cnt;
```

Result: `(95 + 20) / 2 = 57.5` — far below the IDP excess threshold arithmetic:
`excess = max(0, 57.5 − universalAffinity)`. For a MAGA voter with universal ≈ 30: `excess = 27.5`. The IDP gate requires excess ≥ 20, so they still clear it — but barely, when they should have cleared it with excess = 65 (= 95 − 30) before Q242 fired. The Q242 write erodes a valid IDP signal for a voter with confirmed high ideological in-group moral concern.

For a higher-universal MAGA voter (universal ≈ 50): `excess from Q229 alone = 45`; `excess after Q242 = 7.5`. IDP gate (excess ≥ 20) no longer cleared. The question **kills IDP routing** for a voter who explicitly qualified on Q229.

---

### Second finding: WRONG-CONSTRUCT (MEDIUM) — `closely_aligned` creates false ideological excess for universalists

A universalist who answered Q229 with `ingroup_ideological` in **neutral** (no write — the Q229 rankingMap only emits for supportHigh and supportMid) and then answers Q242 `closely_aligned` receives:

- Q229 ideological write: **none** (neutral bucket → no emission)
- Q242 `closely_aligned` write: **85** (single count in accumulator)
- Final `scopedAffinities.ideological`: **85**

With a universalAffinity of 60 (typical for a progressive universalist): `excess = max(0, 85 − 60) = 25`. **IDP gate threshold cleared** — the question just assigned an IDP-triggering ideological excess to a voter who explicitly declined to express special moral concern for their political in-group on Q229.

The voter was saying "the Democratic Party's values closely match my universal-humanist outlook" — a statement about platform alignment, not a claim to tribal in-group moral concern. The question mis-routes them toward ideological-IDP archetypes.

---

### Third finding: evidence format verified correct but harm confirmed

The single-number write format (`{ ideological: 85 }`) is consistent with Q229's rankingMap and Q232–Q239 patterns:

**Q229 verbatim** (`src/config/questions.representative.ts`, confirmed earlier):
```ts
rankingMap: {
  ingroup_ideological: { moralCircle: { scopedAffinities: { ideological: 95 } } },
},
```

The format is not a bug. The harm is semantic: Q242 is writing a number that *represents party alignment* into an accumulator that *averages moral concern for in-groups*. The same arithmetic machine that correctly averages two independent moral-concern probes (Q229 + Q232 scope probe for ideological) incorrectly averages a moral-concern probe (Q229) with a party-satisfaction report (Q242).

---

### Fourth finding: `closely_aligned` and `mostly_agree` become evidence-free after fix

Removing all moralCircle writes from Q242 leaves:

| Option | Evidence after fix | EIG contribution |
|---|---|---|
| `closely_aligned` | none | zero |
| `mostly_agree` | none | zero |
| `selective` | COM pos `[0.05, 0.12, 0.30, 0.35, 0.18]` | moderate COM signal |
| `reluctant_partisan` | ZS pos `[0.04, 0.10, 0.22, 0.36, 0.28]` + COM pos `[0.04, 0.08, 0.20, 0.38, 0.30]` | **strongest signal — unique ZS write** |

The question becomes effectively a two-option discriminator in information-theoretic terms. Its EIG is nonzero only when the posterior contains archetypes sensitive to ZS or COM. For respondents who land near `closely_aligned` or `mostly_agree`, the question contributes nothing — but it doesn't harm them by writing false moralCircle evidence.

**Is Q242 still worth asking?** Yes. The ZS signal from `reluctant_partisan` — "I vote primarily to prevent the other side from winning" — is unavailable anywhere else in the current bank. This is the single signal that separates MAGA negative-partisan from Never-Trump R, and from loyal-but-frustrated voters like the Black-moderate-religious baseline persona. The question earns its slot via ZS alone.

---

### Proposed fix (verbatim spec change)

In Q242's `optionEvidence`, replace:

```ts
optionEvidence: {
  closely_aligned: {
    moralCircle: { scopedAffinities: { ideological: 85 } },
  },
  mostly_agree: {
    moralCircle: { scopedAffinities: { ideological: 65 } },
  },
  selective: {
    moralCircle: { scopedAffinities: { ideological: 40 } },
    continuous: {
      COM: { pos: [0.05, 0.12, 0.30, 0.35, 0.18] },
    },
  },
  reluctant_partisan: {
    moralCircle: { scopedAffinities: { ideological: 20 } },
    continuous: {
      COM: { pos: [0.04, 0.08, 0.20, 0.38, 0.30] },
      ZS:  { pos: [0.04, 0.10, 0.22, 0.36, 0.28] },
    },
  },
}
```

With:

```ts
optionEvidence: {
  closely_aligned: {},   // no evidence — party alignment ≠ in-group moral concern
  mostly_agree:    {},   // no evidence
  selective: {
    continuous: {
      COM: { pos: [0.05, 0.12, 0.30, 0.35, 0.18] },  // unchanged
    },
  },
  reluctant_partisan: {
    continuous: {
      COM: { pos: [0.04, 0.08, 0.20, 0.38, 0.30] },  // unchanged
      ZS:  { pos: [0.04, 0.10, 0.22, 0.36, 0.28] },  // unchanged — the question's value
    },
    // moralCircle write REMOVED: party-vehicle framing ≠ ideological in-group moral concern
  },
}
```

Also update touchProfile: remove the `MORAL_CIRCLE` entry (weight 0.50). The question no longer writes to moralCircle at all. Update remaining entries:

```ts
touchProfile: [
  // REMOVED: { node: "MORAL_CIRCLE", ... }
  { node: "COM", kind: "continuous", role: "position", weight: 0.30, touchType: "cross_pressure_tolerance" },
  { node: "ZS",  kind: "continuous", role: "position", weight: 0.20, touchType: "negative_partisanship_frame" },
],
```

**Risk:** LOW. The removal eliminates false IDP interference; the COM/ZS writes are preserved intact. No sign changes. The EIG selector will naturally deprioritize Q242 for respondents who have already resolved COM and ZS (correct behavior).

---

### Summary

| Finding | Severity | Impact | Fix |
|---|---|---|---|
| `reluctant_partisan` and all options: WRONG-CONSTRUCT — party alignment written as ideological scopedAffinity | **HIGH** | Averages against Q229's ideological write; suppresses IDP excess for high-tribal voters who picked `reluctant_partisan`; can eliminate IDP routing for moderate-universal MAGA voters | Remove all moralCircle.scopedAffinities writes from Q242 |
| `closely_aligned` creates false ideological excess for universalists | MEDIUM | Voters who declined ideological in-group on Q229 receive IDP-triggering excess from Q242; false-positive IDP routing | Addressed by same fix (remove moralCircle writes) |
| `closely_aligned` + `mostly_agree` become evidence-free after fix | LOW (structural) | Q242 becomes a 2-option question in EIG terms | Acceptable — the ZS signal from `reluctant_partisan` is the question's core value |
| ZS signal from `reluctant_partisan` — novel and irreplaceable | PASS | — | Keep; no change needed |
| COM signals from `selective` + `reluctant_partisan` — correct | PASS | — | Keep; no change needed |

**Recommended action:** Apply the proposed fix before harness runs. Q242 without moralCircle writes is a clean ZS + COM probe — exactly what §6 of HARNESS-HANDOFF called for ("cross-pressure self-awareness"). The moralCircle dimension of that probe is better handled by Q229 alone.

**Cross-links:** [[new-questions.md]] Q242 (cycle 13 generation — applies fix to that spec); [[audit-findings.md]] cycle 5/12 (IDP gate architecture — false ideological excess from Q242 would have added a new IDP gate failure mode on top of Q230/Q231 cliff; fix eliminates that interaction); [[new-questions.md]] Q240 (anti-establishment frame also touches ONT_S — the MAGA `reluctant_partisan` respondent is the same population that picks `elite_capture` on Q240; Q242's ZS write and Q240's ONT_S/ZS write are complementary, not redundant, after moralCircle writes are removed).

---

## [2026-05-18T — cycle 17 — AUDIT — Q7 coalition_vs_principle]

**Question:** Q7 `single_choice` — coalition_vs_principle (stage: `screen20`, section: I)

**Prompt (verbatim, from quiz-v2-live.html display dictionary):**
```
coalition_vs_principle: "Your political party or movement takes a position you disagree with on an important issue. What do you do?"
```

**TouchProfile declared (verbatim from `src/config/questions.representative.ts`, lines 776–778):**
```ts
touchProfile: [
  { node: "COM", kind: "continuous", role: "position", weight: 0.85, touchType: "principle_tradeoff" }
],
```

**Options (3), verbatim from quiz-v2-live.html display dictionary:**
```
principle_first:  "Maintain a clear, principled message, even if it alienates moderate voters."
coalition_first:  "Dilute the message to build a broader coalition with people you disagree with."
depends_on_issue: "Depends on the issue - some principles are non-negotiable, others aren't"
```

**Evidence (verbatim from `src/config/questions.representative.ts`, lines 779–795):**
```ts
optionEvidence: {
  principle_first: {
    continuous: {
      COM: { pos: [0.32, 0.38, 0.20, 0.08, 0.02] }
    }
  },
  coalition_first: {
    continuous: {
      COM: { pos: [0.02, 0.08, 0.20, 0.38, 0.32] }
    }
  },
  depends_on_issue: {
    continuous: {
      COM: { pos: [0.10, 0.22, 0.42, 0.18, 0.08] }
    }
  }
}
```

**Computed means (1-indexed 1–5 scale):**

| Option | COM distribution | Mean | Deviation from 3.0 |
|---|---|---|---|
| `principle_first` | [0.32, 0.38, 0.20, 0.08, 0.02] | **2.10** | −0.90 |
| `coalition_first` | [0.02, 0.08, 0.20, 0.38, 0.32] | **3.90** | +0.90 |
| `depends_on_issue` | [0.10, 0.22, 0.42, 0.18, 0.08] | **2.92** | −0.08 |

*Note: cycle 15 DEEPEN quoted means as 1.96 / 3.98 / 2.92. The 1.96 and 3.98 values are off by ~0.1 due to rounding. Correct computed values: 2.10 and 3.90. The discrepancy is arithmetically small but matters for the symmetry check.*

---

### Option: `principle_first`

```
option_text: "Maintain a clear, principled message, even if it alienates moderate voters."
declared touch: COM (position, w=0.85)
declared evidence: COM: { pos: [0.32, 0.38, 0.20, 0.08, 0.02] }  (mean ≈ 2.10)
text→evidence sign:      PASS. "Maintain the principle even at electoral cost" = low willingness to
                          compromise for coalition gain = low COM. Evidence pushes posterior toward
                          COM = 1–2. ✓
text→evidence magnitude: APPROPRIATE. Mean 2.10 is a moderately strong low-COM pull at weight 0.85.
                          The option is firm but not dogmatically absolute ("principled" ≠ "refuses all
                          alliance"); COM=2.10 is correct for "I won't dilute the message" without
                          asserting COM=1 (never compromises on anything).
cross-option symmetry:   symmetric with coalition_first: |2.10 − 3.0| = 0.90 = |3.90 − 3.0|. PASS.
flags: PASS
```

---

### Option: `coalition_first`

```
option_text: "Dilute the message to build a broader coalition with people you disagree with."
declared touch: COM (position, w=0.85)
declared evidence: COM: { pos: [0.02, 0.08, 0.20, 0.38, 0.32] }  (mean ≈ 3.90)
text→evidence sign:      PASS. "Dilute message to build coalition" = high tolerance for coalition-
                          building compromise = high COM. Evidence pushes toward COM = 4–5. ✓
text→evidence magnitude: APPROPRIATE. Mean 3.90 is a moderately strong high-COM pull. "Dilute the
                          message" with "people you disagree with" is a fairly strong commitment to
                          coalition-over-purity; COM=3.90 (not 5.0) is correct because even strong
                          coalition-builders have some bottom-line limits. The word "dilute" (rather
                          than "broaden") makes this option moderately extreme, not maximally so.
cross-option symmetry:   symmetric with principle_first (above). PASS.
flags: PASS
```

---

### Option: `depends_on_issue`

```
option_text: "Depends on the issue - some principles are non-negotiable, others aren't"
declared touch: COM (position, w=0.85)
declared evidence: COM: { pos: [0.10, 0.22, 0.42, 0.18, 0.08] }  (mean ≈ 2.92)
text→evidence sign:      PASS. Centrist / hedging answer → near-center COM. The mild lean toward
                          low COM (2.92 < 3.0) is defensible given "some principles are NON-
                          NEGOTIABLE" asserting at least partial principle-holding. ✓
text→evidence magnitude: MILD UNDER-PULL. The phrase "some principles are non-negotiable" is not
                          fully neutral — it commits to principle-holding for an unspecified but
                          real subset of issues. A mean of 2.92 is only 0.08 below center. Given
                          that the text explicitly rules out "always compromise" (coalition_first =
                          3.90), a mean of 2.60–2.70 would be more faithful to the option's lean.
                          The current 2.92 is within tolerance but worth noting.
cross-option symmetry:   N/A (centrist option)
flags: MILD-UNDER-PULL (COM mean 2.92; could be 2.60–2.70 given "non-negotiable" language); PASS
       on sign check.
```

---

### Cross-cutting finding: STRUCTURAL-CONCERN (HIGH) — `depends_on_issue` is the correct answer for both 021 and 001, causing the discrimination collapse

This is the most important finding in this audit row, and it supersedes the minor UNDER-PULL above in priority.

**The semantic leakage mechanism (quoting cycle 15 DEEPEN, now with verbatim evidence confirmed):**

021 Principled Cosmopolitan (COM=2) and 001 Rawlsian Reformer (COM=4) are the two archetypes that Q7 should separate. Both face the question: "Your movement takes a position you disagree with. What do you do?"

The intended COM discrimination:
- 021: "I hold principled cosmopolitan commitments" → expected to answer `principle_first` → COM=2.10 evidence → matches 021's COM=2
- 001: "I build institutional coalitions" → expected to answer `coalition_first` → COM=3.90 evidence → matches 001's COM=4

**The failure:** Both archetypes answer `depends_on_issue` for valid semantic reasons:

- **001 Rawlsian Reformer perspective on Q7:** "My movement sometimes adopts an insufficiently justice-oriented platform position. Do I leave, or build the coalition needed to advance justice? It depends on whether the position violates a core justice principle." → `depends_on_issue` ✓
- **021 Principled Cosmopolitan perspective on Q7:** "I support universal human rights coalitions — building alliances for universal causes is not 'diluting the message,' it's how universal values get enacted. But I won't compromise on the core rights framework. It depends on the issue." → `depends_on_issue` ✓

For 001, `coalition_first` would also work semantically — "yes, I'll dilute the message to build the coalition for institutional reform." But for 021, `coalition_first` reads wrong: "dilute the message" conflicts with how a cosmopolitan understands alliance-building (they don't experience universalist alliances as dilution). `coalition_first`'s word choice ("dilute") creates a framing trap for 021.

**The diagnostic implication:** This is NOT a sign error, wrong node, hollow touch, or magnitude error in the evidence map. All three option rows are correctly calibrated given the semantic of their option keys. The discrimination gap exists at the level of **which option each archetype type naturally selects** — a framing problem, not an evidence-map problem.

Critically: **no evidence-map fix to Q7 can resolve the 021→001 attractor collapse.** The fix requires a different question with a framing that prevents 021 from escaping to the centrist bucket. This is precisely what Q243 (`legislative_compromise_threshold`, cycle 15 DEEPEN) addresses: a concrete legislative scenario forces 021 to reveal their COM=2 by asking "how often do you accept a package deal with an opposed provision?" — a question where the semantically-motivated `depends_on_issue` escape is blocked by the slider format.

**flags:** STRUCTURAL-CONCERN (HIGH) — semantic leakage on `depends_on_issue`; cannot be fixed by adjusting evidence rows; fix requires Q243 as a complementary probe.

---

### Cross-cutting finding: METADATA-INCONSISTENCY (LOW) — full.ts declares TRB + PRO touches not present in representative.ts

`src/config/questions.full.ts` (the metadata-only catalog) declares for Q7:
```ts
t("COM", "continuous", "position", 0.85, "principle_tradeoff"),
t("TRB", "continuous", "position", 0.25, "principle_tradeoff"),
t("PRO", "continuous", "position", 0.20, "principle_tradeoff")
```

`src/config/questions.representative.ts` (the canonical engine file) declares:
```ts
{ node: "COM", kind: "continuous", role: "position", weight: 0.85, touchType: "principle_tradeoff" }
```

TRB and PRO are absent. The optionEvidence rows write only to COM — no TRB or PRO evidence exists in the representative file.

**TRB absence:** Correct. TRB is deprecated post-ADR-007. The full.ts catalog was not updated to reflect the retirement, but the canonical engine file correctly omits TRB writes. No functional consequence.

**PRO absence:** Potentially meaningful. "Maintain a clear, principled message" does carry a PRO (proceduralism / principle-first) flavor — `principle_first` respondents are often PRO-high (process and rules matter; they won't compromise procedural integrity). The full.ts metadata claimed this signal at w=0.20. It was dropped from representative.ts, possibly as part of a deliberate simplification (COM already captures the most important dimension; PRO at weight 0.20 would be weak signal).

**Whether PRO should be reinstated:** Ambiguous. The prompt "Your party takes a position you disagree with" is COM-dominant — it's fundamentally about willingness to accept an imperfect vehicle. PRO (process rules, norms) is at most a secondary signal. For the purpose of the 021→001 discrimination, PRO is equal between those two archetypes (both PRO=5), so adding PRO here would not help the collapse. The omission is likely intentional simplification.

**flags:** METADATA-INCONSISTENCY (LOW) — full.ts TRB declaration stale post-ADR-007; PRO omission likely intentional; no runtime impact.

---

### Summary

| Finding | Severity | Impact | Fix |
|---|---|---|---|
| `principle_first` sign + magnitude | PASS | — | No action |
| `coalition_first` sign + magnitude | PASS | — | No action |
| `principle_first` ↔ `coalition_first` cross-option symmetry | PASS (exact ±0.90) | — | No action |
| `depends_on_issue` mild UNDER-PULL (mean 2.92; text implies ~2.60–2.70) | LOW | Minor calibration gap | Optional: shift mean to 2.70 via `[0.14, 0.24, 0.42, 0.14, 0.06]` |
| `depends_on_issue` STRUCTURAL-CONCERN: semantic leakage from cosmopolitan perspective | **HIGH** | 021→001 attractor collapse NOT fixable by evidence-map change; both archetypes correctly answer `depends_on_issue` | Requires Q243 as complementary probe; do NOT attempt evidence-map fix on Q7 |
| METADATA-INCONSISTENCY: full.ts TRB/PRO not in representative.ts | LOW | Stale catalog entry; no runtime impact | Update full.ts TRB entry to note retirement; PRO omission acceptable |

**Primary verdict:** Q7's evidence maps are correct. The 021→001 discrimination failure documented in archetype-gaps.md (cycle 14) and the Q243 DEEPEN (cycle 15) is **confirmed as a structural/semantic problem, not an evidence-map bug.** Proposing a Q7 evidence-map fix would be misdiagnosed — the right path is Q243 as a conditional follow-up for respondents who answer `depends_on_issue`.

**Secondary verdict:** The cycle 15 DEEPEN mean calculations (1.96 / 3.98) have minor arithmetic errors vs. correct computed values (2.10 / 3.90). The symmetry conclusion is unaffected (both are symmetric at ±0.90 after correction). The COM gap between 021 and 001 via Q243 (1.56 units) remains correct.

**Cross-links:** [[new-questions.md]] Q243 (cycle 15 DEEPEN — the fix for this structural concern; Q7 `depends_on_issue` is the EIG trigger condition for Q243); [[archetype-gaps.md]] 021→001 cosmopolitan attractor (cycle 14 — the archetype-gap entry generated by this same failure mode; this audit now formally establishes the evidence map is not the root cause).

---

## [2026-05-18T21:00 — cycle 18 — AUDIT — Q60 politically_important_identities]

**Question:** Q60 `priority_sort` — politically_important_identities (stage: `screen20`, section V)

**TouchProfile declared:**
```ts
{ node: "TRB_ANCHOR", kind: "derived", role: "anchor", weight: 0.95, touchType: "identity_ranking" }
```
*(moralCircle not declared in touchProfile — see STRUCTURAL-CONCERN #4 below)*

**RankingMap (7 items, verbatim):**
```ts
national_identity:      { trbAnchor: { national: 1 },      moralCircle: { scopedAffinities: { national: 70 } } }
ideological_identity:   { trbAnchor: { ideological: 1 },   moralCircle: { scopedAffinities: { ideological: 70 } } }
religious_identity:     { trbAnchor: { religious: 1 },     moralCircle: { scopedAffinities: { religious: 70 } } }
class_identity:         { trbAnchor: { class: 1 },         moralCircle: { scopedAffinities: { class: 70 } } }
ethnic_racial_identity: { trbAnchor: { ethnic_racial: 1 }, moralCircle: { scopedAffinities: { ethnic_racial: 70 } } }
gender_identity:        { trbAnchor: { gender: 1 },        moralCircle: { scopedAffinities: { gender: 70 } } }
global_citizen:         { trbAnchor: { global: 1 },        moralCircle: { universal: 75 } }
```

**Bucket semantics (from `applyPrioritySort`, update.ts:1220–1275):**
- `supportHigh` → weight=1.0 → scoped emitted as 70 (unchanged); universal emitted as 75
- `supportMid` → weight=0.5 → `NEUTRAL + 0.5*(val − 50)` → scoped emits 60; universal emits 62.5
- `neutral` → skipped (lines 1237: `if (bucket === "neutral" || bucket === "opposeHigh") continue;`)
- `opposeHigh` → skipped (same line)

---

### FINDING 1 — STRUCTURAL-CONCERN (HIGH): `opposeHigh` discards all moralCircle evidence — anti-tribal universalists indistinguishable from indifferent centrists

**The code (update.ts:1233–1237, verbatim):**
```ts
for (const item of allItems) {
  const map = q.rankingMap[item];
  if (!map) continue;
  const bucket = bucketFor(item);
  if (bucket === "neutral" || bucket === "opposeHigh") continue;
```

A respondent who places `national_identity` in `opposeHigh` ("actively oppose making national identity central to my politics") receives zero moralCircle scoped evidence for the national scope. Their `state.moralCircle.accumulator.scopedSums.national` is unchanged — the scope stays null / unmeasured, identical to a respondent who simply left the item in `neutral`.

**Who this affects:** The Lifelong Democrat urban progressive (Tier B persona #4) and the Bernie progressive (#11) are respondents who would likely put one or more identity items in `opposeHigh` (they actively *oppose* tribalism as a political posture). Under the current code, that strong signal — "I object to making national/ideological/ethnic identity politically central" — is silently discarded. Their scoped affinities for those items stay null, exactly as if they hadn't answered those items at all.

**Consequence for IDP routing:** Null scopedAffinity means `applyMoralCircleEvidence` never records a low scoped value for the opposed scope. If Battery B (Q232–Q239) later probes that scope, the average will be pulled by Battery B alone. But if Battery B is skipped (because the selector doesn't see high universalAffinity yet — the chicken-and-egg problem), the universalist respondent who explicitly opposed a scope on Q60 gets no low-scoped signal from either source.

**Proposed fix:** For `opposeHigh` items, emit a low scoped value (e.g., 25 — symmetrically below the 50 neutral baseline, just as supportHigh emits 70 above it). The comment in update.ts reads: `"I oppose this being central" doesn't cleanly invert to a different anchor` — this rationale holds for trbAnchor (which is additive, not inverting). But for moralCircle scopedAffinities, the inversion is semantically clean: "I oppose national identity being central" → low national scoped affinity. Proposed change: add a third branch after the opposeHigh skip, emitting `NEUTRAL + weight * (25 − NEUTRAL)` = 37.5 for opposeHigh items.

---

### FINDING 2 — STRUCTURAL-CONCERN (HIGH): Fixed scoped=70 is borderline for IDP excess — most respondents can't reach excess≥20 from Q60 alone

**The IDP gate (from CLAUDE.md and resolveIdentityPrimary.ts):**
```
excess[scope] >= 20 AND scoped >= 70 AND universal <= 75 AND intensity03 >= 1.2
```

Q60's supportHigh emit exactly scoped=70. This meets the `scoped >= 70` floor. But for excess≥20, the arithmetic mean universalAffinity must be ≤50.

**What the Battery A questions (Q230/Q231) produce for universalAffinity:**

From cycle 12's proposed recalibration of Q230 and cycle 6's proposed recalibration of Q231, the bucket-to-universal mapping after fixes is approximately:
```
Q231 bucket 0-20  → universal target ≈ 50
Q231 bucket 21-40 → universal target ≈ 55
Q231 bucket 41-60 → universal target ≈ 65
Q231 bucket 61-80 → universal target ≈ 75
```
(Q230 analogous; arithmetic mean of the two questions is the running average.)

For a respondent who places `national_identity` in supportHigh but answers both Q230 and Q231 in their lowest buckets (0-20 → universal=50), the running mean is:
```
(50 + 50) / 2 = 50 → excess = max(0, 70 − 50) = 20 ✓ (borderline)
```
This just barely meets the excess≥20 gate. Any moderate universalism answer (Q231 bucket 21-40 → universal=55) produces mean=(50+55)/2=52.5 → excess=17.5 → IDP gate **does not open**.

**The practical implication:** Most respondents who identify with a national or ethnic scope (e.g., the MAGA Abstain→Trump persona, the Obama→Trump persona) are not fully anti-universalist — they might answer Q231 somewhere in the 21-40 or 41-60 range (they care about *some* strangers; they're not nihilists). For these respondents, Q60 at scoped=70 will produce zero excess, and IDP routing depends entirely on Battery B (Q232–Q239) pushing the scoped value higher via additional probing.

**This is by design (Battery B exists for this purpose)** — but it means Q60 cannot by itself route any but the most anti-universalist respondents into IDP archetypes. The comment in the rankingMap ("comparable to 'somewhat_more' on the Battery B scale") is accurate but understates the dependency: Q60 is not sufficient for IDP routing in isolation; Battery B is load-bearing.

**Proposed calibration note (not a fix per se):** Consider raising Q60 supportHigh scoped target to 80 (instead of 70): `NEUTRAL + 1.0*(80−50) = 80`. This would produce excess=30 for a respondent with universalAffinity=50 (the Battery A floor), giving more headroom. The tradeoff: higher scoped from Q60 increases false-positive IDP routing for respondents who report strong identity without corresponding in-group bias on Battery B. This is a calibration judgment; the current 70 is conservative and correct in principle, but undershoots IDP activation for the intended Tier-A personas.

---

### FINDING 3 — STRUCTURAL-CONCERN (MEDIUM): `global_citizen` supportHigh pushes universal=75 — at the exact IDP ceiling

**The evidence (rankingMap verbatim):**
```ts
global_citizen: { trbAnchor: { global: 1 }, moralCircle: { universal: 75 } }
```

The IDP gate condition includes `universal <= 75`. A respondent who places `global_citizen` in supportHigh receives universal pushed toward 75 in the running average. If the only universal-baseline evidence is Q60's `global_citizen` placement, universalAffinity = 75 exactly. This means:

- For any identity also in `supportHigh` (scoped=70): excess = max(0, 70−75) = 0 → **IDP gate never opens.**
- The combination "I'm a global citizen AND I have a strong X identity" suppresses IDP activation entirely, producing excess=0 despite a scoped=70 placement.

**This is likely correct design** — a genuine global citizen + in-group member (e.g., someone who deeply identifies as both "global citizen" and "class-conscious") shouldn't have excess scoped affinity if their universal baseline equals their scoped. The theoretical model holds. But the boundary is knife-edge: excess=max(0,70-75)=-5→0 rather than a smooth transition.

**Specific concern for LGBTQ routing (archetype 144):** The LGBTQ voter who also identifies as a global-citizen cosmopolitan (plausible for urban LGBTQ respondents) would place both `global_citizen` and `gender_identity` in supportHigh. Q60 alone → universal=75, gender=70 → excess=0 → IDP gate blocked. Without Battery B Q237 (gender scope probe), this respondent would not route to archetype 144 at all.

**flag:** ASYMMETRIC (global_citizen is the only item that writes `universal` rather than a scoped affinity; no other item can deactivate the IDP gate via Q60 alone; only `global_citizen` has this suppression effect.)

---

### FINDING 4 — STRUCTURAL-CONCERN (LOW): moralCircle absent from touchProfile — selector undervalues Q60 for moral-circle coverage

**The touchProfile (verbatim):**
```ts
{ node: "TRB_ANCHOR", kind: "derived", role: "anchor", weight: 0.95, touchType: "identity_ranking" }
```

Q60's `applyPrioritySort` call *does* invoke `applyMoralCircleEvidence(state, scaled)` (update.ts:1272) and increments `state.moralCircle.touchCount` for each supportHigh/supportMid item. But the touchProfile only declares `TRB_ANCHOR`. The EIG selector reads touchProfile to compute coverage and estimate information value per candidate question. Q60 contributes zero moralCircle coverage credit to the selector's budget.

**Practical effect:** The selector sees Q60 as a pure anchor question. After Q60 is asked, the selector believes `moralCircle.touchCount` has been touched (because the state *was* updated), but it does not credit Q60 with covering any moralCircle nodes for EIG budgeting purposes. This means the selector may schedule Battery B (Q232–Q239) independently of whether Q60 already resolved the most-important scope questions. If a respondent put `national_identity` in supportHigh on Q60, the selector has already measured national scoped affinity at 70 — but since Q60 doesn't declare moralCircle in touchProfile, the selector may still schedule Q232 (national affinity probe) as if that scope hadn't been measured yet.

**This is a selector-efficiency concern, not a correctness bug.** The running average in `applyMoralCircleEvidence` will correctly average Q60's signal with Q232's signal — no data is lost. But the selector may waste a question asking Q232 when Q60 already gave strong national scoped evidence.

**Proposed fix:** Add a moralCircle coverage entry to Q60's touchProfile. However, this requires a supported `touchType` for moralCircle that the selector understands. If no such support exists in `selectorEIG.ts`, the simpler fix is to note this as a selector improvement item (cross-link to [[selector-improvements.md]]).

---

### Per-item signal table (Q60 rakingMap options)

| Item | supportHigh scoped | supportMid scoped | opposeHigh scoped | Sign logic |
|---|---|---|---|---|
| `national_identity` | 70 | 60 | **0 (skipped)** | PASS (high supportHigh → strong national); MISSING (opposeHigh emits nothing) |
| `ideological_identity` | 70 | 60 | **0 (skipped)** | PASS; MISSING |
| `religious_identity` | 70 | 60 | **0 (skipped)** | PASS; MISSING |
| `class_identity` | 70 | 60 | **0 (skipped)** | PASS; MISSING |
| `ethnic_racial_identity` | 70 | 60 | **0 (skipped)** | PASS; MISSING |
| `gender_identity` | 70 | 60 | **0 (skipped)** | PASS; MISSING |
| `global_citizen` | universal=75 | universal=62.5 | **0 (skipped)** | PASS (universalist → high universal baseline); NOTE: suppresses IDP for all co-placed scoped items |

**Cross-option consistency within Q60:** All 6 identity items emit the same scoped value (70 supportHigh, 60 supportMid). This is intentional — the question is probing which identity scope is most politically central, not the *degree* of affinity within each scope (that's Battery B's job). The equal weights across scopes are correct design.

---

### Summary

| Finding | Severity | Impact | Proposed fix |
|---|---|---|---|
| `opposeHigh` discards all moralCircle evidence — anti-tribal universalists indistinguishable from indifferent centrists | **HIGH** | Type-4 and Type-11 personas get no low-scoped signal from explicit rejection; Battery B may not compensate | Emit scoped=25 (or 37.5 bucket-weighted) for opposeHigh items in Q60 |
| Fixed scoped=70 borderline for IDP excess — requires universalAffinity≤50 | **HIGH** | Most real respondents with moderate universalism won't route IDP from Q60 alone; IDP routing load falls entirely on Battery B | Consider raising to scoped=80, or accept as design (Battery B is load-bearing by design) |
| `global_citizen` supportHigh writes universal=75 = IDP ceiling — zero excess when combined with identity item | **MEDIUM** | LGBTQ + cosmopolitan persona blocked from IDP routing by Q60 alone without Battery B | By-design; add persona note that LGBTQ voters who also identify as global-citizen require Battery B to unlock |
| moralCircle absent from touchProfile — selector can't budget Q60's moralCircle contribution | **LOW** | Selector may schedule redundant Battery B probes after Q60 already measured a scope | Add moralCircle touchProfile entry, or flag as selector-improvements item |

**Primary verdict:** Q60's evidence maps pass sign and magnitude checks on all 7 items — the rankingMap values are logically justified given the question's role as a coarse identity-scope prioritizer feeding Battery B refinement. The structural concerns are all at the interface level (opposeHigh silence, IDP gate calibration, touchProfile omission) rather than individual evidence-row errors. The most actionable fix pre-harness is the opposeHigh gap (Finding 1): emitting scoped=25 for opposed items would give universalist/anti-tribal personas a genuine low-scoped signal, preventing indistinguishability from indifferent centrists.

**Cross-links:** [[architecture-thoughts.md]] IDP gate calibration (cycle 6 — Q231 recalibration fix interacts with Q60 fixed-70; together they narrow IDP excess headroom); [[audit-findings.md]] Q231 cycle 5 (IDP cliff at 80/81 — same gate tension from Battery A side); [[audit-findings.md]] Q230 cycle 12 (same recalibration applied to Q230 as prerequisite); [[selector-improvements.md]] (moralCircle touchProfile gap for EIG budgeting).

---

## [2026-05-19T — cycle 20 — AUDIT — Q200 party_identification]

**Question:** Q200 `single_choice` — party_identification (stage: `fixed12`, section: I)

**Prompt (verbatim):**
```
"Which best describes how you think of your political affiliation?"
```

**Options (6, verbatim):** `dem`, `rep`, `ind`, `third`, `other`, `none`

**optionLabels (verbatim):**
```ts
dem:   "Democrat",
rep:   "Republican",
ind:   "Independent",
third: "Member of a third party",
other: "Other",
none:  "Nothing",
```

**TouchProfile declared (verbatim, lines 3959–3967):**
```ts
{ node: "MAT",   kind: "continuous", role: "position", weight: 0.20, touchType: "partisan_prior" },
{ node: "CD",    kind: "continuous", role: "position", weight: 0.20, touchType: "partisan_prior" },
{ node: "CU",    kind: "continuous", role: "position", weight: 0.20, touchType: "partisan_prior" },
{ node: "MOR",   kind: "continuous", role: "position", weight: 0.20, touchType: "partisan_prior" },
{ node: "ZS",    kind: "continuous", role: "position", weight: 0.20, touchType: "partisan_prior" },
{ node: "ONT_S", kind: "continuous", role: "position", weight: 0.20, touchType: "partisan_prior" },
{ node: "ONT_H", kind: "continuous", role: "position", weight: 0.20, touchType: "partisan_prior" },
```

**Option evidence — `dem` (verbatim, lines 3973–3982):**
```ts
dem: {
  continuous: {
    MAT:   { pos: [0.25, 0.25, 0.20, 0.16, 0.14] }, // lean low (redistributive)
    CD:    { pos: [0.25, 0.25, 0.20, 0.16, 0.14] }, // lean low (progressive)
    CU:    { pos: [0.25, 0.25, 0.20, 0.16, 0.14] }, // lean low (pluralist)
    MOR:   { pos: [0.14, 0.16, 0.20, 0.25, 0.25] }, // lean high (universalist)
    ZS:    { pos: [0.25, 0.25, 0.20, 0.16, 0.14] }, // lean low (positive-sum)
    ONT_S: { pos: [0.14, 0.16, 0.20, 0.25, 0.25] }, // lean high (institutions matter)
    ONT_H: { pos: [0.14, 0.16, 0.20, 0.25, 0.25] }, // lean high (environment shapes)
  },
},
```

**Option evidence — `rep` (verbatim, lines 3984–3993):**
```ts
rep: {
  continuous: {
    MAT:   { pos: [0.14, 0.16, 0.20, 0.25, 0.25] }, // lean high (market)
    CD:    { pos: [0.14, 0.16, 0.20, 0.25, 0.25] }, // lean high (traditional)
    CU:    { pos: [0.14, 0.16, 0.20, 0.25, 0.25] }, // lean high (uniformity)
    MOR:   { pos: [0.25, 0.25, 0.20, 0.16, 0.14] }, // lean low (bounded circle)
    ZS:    { pos: [0.14, 0.16, 0.20, 0.25, 0.25] }, // lean high (zero-sum)
    ONT_S: { pos: [0.25, 0.25, 0.20, 0.16, 0.14] }, // lean low (suspicious of state)
    ONT_H: { pos: [0.25, 0.25, 0.20, 0.16, 0.14] }, // lean low (dispositional)
  },
},
```

**Option evidence — `ind`, `third`, `other`, `none` (verbatim):**
```ts
ind:   {},
third: {},
other: {},
none:  {},
```

**Computed means** (1-indexed 1–5 scale):

The two distribution shapes used:
- "lean-low": `[0.25, 0.25, 0.20, 0.16, 0.14]` → mean = 0.25×1 + 0.25×2 + 0.20×3 + 0.16×4 + 0.14×5 = **2.69** (deviation −0.31)
- "lean-high": `[0.14, 0.16, 0.20, 0.25, 0.25]` → mean = 0.14×1 + 0.16×2 + 0.20×3 + 0.25×4 + 0.25×5 = **3.31** (deviation +0.31)

| Node | `dem` distribution | `dem` mean | `rep` distribution | `rep` mean |
|---|---|---|---|---|
| MAT | lean-low | **2.69** | lean-high | **3.31** |
| CD | lean-low | **2.69** | lean-high | **3.31** |
| CU | lean-low | **2.69** | lean-high | **3.31** |
| MOR | lean-high | **3.31** | lean-low | **2.69** |
| ZS | lean-low | **2.69** | lean-high | **3.31** |
| ONT_S | lean-high | **3.31** | lean-low | **2.69** |
| ONT_H | lean-high | **3.31** | lean-low | **2.69** |

---

### Option: `dem`

```
option_text: "Democrat"
declared touch: MAT/CD/CU (position lean-low, w=0.20), MOR/ONT_S/ONT_H (position lean-high, w=0.20), ZS (lean-low, w=0.20)
text→evidence sign:     PASS on all 7 nodes.
  MAT lean-low → redistribution (D leans left on economic policy). ✓
  CD lean-low → progressive/cosmopolitan (D leans culturally progressive). ✓
  CU lean-low → pluralist (D leans open/pluralist on cultural uniformity). ✓
  MOR lean-high → universalist (D leans wider moral circle). ✓
  ZS lean-low → positive-sum (D leans cooperative/positive-sum framing). ✓
  ONT_S lean-high → institutions matter (D tends pro-institutional since 1968 realignment). ✓
  ONT_H lean-high → malleable (D leans constructivist / environment shapes behavior). ✓
text→evidence magnitude: APPROPRIATE.
  The ±0.31 deviation from center is intentionally weak, per the comment: "a heterodox
  respondent (e.g., fiscally-conservative Democrat) easily overrides the prior on Q15."
  The 1.8:1 peak ratio is calibrated to be overrideable by a single direct-position
  question at weight 0.60-0.85. Correct by design.
cross-option symmetry:  `dem` and `rep` are exact mirrors on all 7 nodes. PASS.
flags: WRONG-NODE (MOR — see finding below)
```

---

### Option: `rep`

```
option_text: "Republican"
declared touch: MAT/CD/CU (position lean-high, w=0.20), MOR/ONT_S/ONT_H (position lean-low, w=0.20), ZS (lean-high, w=0.20)
text→evidence sign:     PASS on all 7 nodes (exact mirror of `dem`).
  MAT lean-high → market / low-tax orientation (R leans right on economic policy). ✓
  CD lean-high → traditional / conservative (R leans culturally conservative). ✓
  CU lean-high → uniformity (R leans cultural uniformity / assimilationist). ✓
  MOR lean-low → bounded moral circle (R leans in-group / particularist). ✓
  ZS lean-high → zero-sum (R framing trends more competitive/zero-sum, especially post-2016). ✓
  ONT_S lean-low → skeptical of institutions (R leans anti-state, suspicious of government capacity). ✓
  ONT_H lean-low → dispositional (R leans human-nature-is-fixed / biological-/dispositional framing). ✓
text→evidence magnitude: APPROPRIATE (same calibrated-mild ±0.31 as `dem`). ✓
cross-option symmetry:   PASS (exact mirror). ✓
flags: WRONG-NODE (MOR — see finding below)
```

---

### Options: `ind`, `third`, `other`, `none`

```
option_text: "Independent" / "Member of a third party" / "Other" / "Nothing"
declared evidence: {} (empty — no continuous or categorical evidence)
text→evidence sign:     PASS. None of these four options implies a reliable directional prior
  on any node — independents span the full ideological spectrum; third-party and non-partisan
  respondents are even more heterogeneous. Empty evidence is correct design.
text→evidence magnitude: N/A (empty).
cross-option symmetry:  N/A.
flags: HOLLOW-TOUCH (structural concern — see finding below)
```

---

### Finding 1 — STRUCTURAL-CONCERN (MEDIUM): 4 of 6 options are evidence-free — touchProfile over-claims coverage

**The issue:** Q200's touchProfile declares 7 nodes for every respondent (weight=0.20 each). But 4 of the 6 options (`ind`, `third`, `other`, `none`) produce zero evidence. For the ~40-45% of US respondents who identify as independent or non-partisan:

- Q200 contributes **zero positional signal** on MAT, CD, CU, ZS, ONT_S, ONT_H, or MOR.
- The touchProfile declaration still exists, so the EIG selector may count Q200 as having touched those 7 nodes — but for a large fraction of respondents, it touched nothing.

This is not strictly a HOLLOW-TOUCH in the H4 sense (the `dem` and `rep` options do write evidence, so the question is not universally hollow). It's a **conditional-hollow** pattern: the question is load-bearing for partisans and evidence-free for non-partisans.

**Harness implication:** The EIG selector computes expected information gain using the prior over option probabilities. If the selector assumes a uniform option distribution (1/6 per option), the effective EIG is diluted by the 4/6 empty options — which is correct behavior. The selector is not overcounting. The concern is a **quality label mismatch**: Q200 has `quality: 0.99`, which is the highest quality score in the bank. This reflects the question's partyID metadata value (party affiliation is excellent for vote prediction), not its positional evidence contribution. A respondent who answers `ind` gets quality=0.99 credited to the session but receives no positional prior update.

**Who is affected:** Leaners (self-identified independents who lean D or R) are the primary gap. Per ANES data, ~30-35% of US respondents call themselves independent; of those, ~90% lean one way. These leaners have policy patterns nearly as strong as partisans — a lean-D independent is almost as likely to favor redistribution as a registered Democrat. The current `ind` → `{}` mapping ignores that structure entirely.

---

### Finding 2 — HARNESS-HANDOFF MISMATCH (MEDIUM): actual options diverge from spec

**HARNESS-HANDOFF.md §2 (verbatim):**
```
`partyID` — what they pick on Q200 (six options: dem / rep / ind_lean_d / ind_lean_r / ind_pure / none)
```

**Actual Q200 options (verbatim from questions.representative.ts, line 3941):**
```ts
options: ["dem", "rep", "ind", "third", "other", "none"],
```

The spec expected `ind_lean_d`, `ind_lean_r`, and `ind_pure` as separate options. The actual question has `ind`, `third`, and `other` — collapsing both leaners into `ind` and separating out third-party identifiers.

**Consequence for harness implementation:** The `decideAnswer(persona, q)` function in `answerEngine.ts` (HARNESS-HANDOFF deliverable) will dispatch `partyID` answers using the persona's declared `partyID` field. If personas declare `ind_lean_d` or `ind_lean_r` (following the spec taxonomy), the dispatch will fail to match any valid Q200 option and fall through to a default — likely an incorrect answer.

**Proposed resolution:** Before writing `answerEngine.ts`, update the persona taxonomy to use actual Q200 option IDs:
- `ind_lean_d` → use `ind` with a note that the lean is implicit (evidenced by policy answers, not partyID)
- `ind_lean_r` → use `ind` same
- `ind_pure` → use `ind` (same slot)
- Alternatively: add `ind_lean_d` and `ind_lean_r` as Q200 options (new options with lean-directional evidence rows), closing the structural gap in the process

The second option also addresses Finding 1 — it gives leaners a directional prior without requiring a `third` restructuring. This is a small-footprint addition to `questions.representative.ts` (2 new options, 2 new evidence rows).

**Proposed evidence rows for `ind_lean_d` and `ind_lean_r` (if added):**

For `ind_lean_d` (lean-Democratic independent): evidence should be weaker than `dem` to respect the "independent" self-identification. Use half the deviation: lean-low at `[0.225, 0.25, 0.225, 0.175, 0.125]` (mean ≈ 2.84, deviation −0.16) for MAT/CD/CU/ZS; lean-high at `[0.125, 0.175, 0.225, 0.25, 0.225]` (mean ≈ 3.16, deviation +0.16) for MOR/ONT_S/ONT_H.

For `ind_lean_r` (lean-Republican independent): exact mirror of `ind_lean_d` above.

The half-deviation design: a leaner's prior is half as strong as a partisan's prior, reflecting that leaners are reliably directional but more heterodox.

---

### Finding 3 — WRONG-NODE (LOW-MEDIUM): MOR writes instead of moralCircle

**The evidence:**
```ts
dem: { continuous: { MOR: { pos: [0.14, 0.16, 0.20, 0.25, 0.25] } } }
rep: { continuous: { MOR: { pos: [0.25, 0.25, 0.20, 0.16, 0.14] } } }
```

Both `dem` and `rep` write to the deprecated `MOR` continuous node, not to `moralCircle.universalAffinity`. ADR-007 replaced `MOR` with the moral-circle module (CLAUDE.md §Architecture Decisions). The `dem` MOR=3.31 and `rep` MOR=2.69 evidence is not visible to:
- `applyMoralCircleEvidence` (reads `moralCircle.universal`, not `MOR`)
- `resolveIdentityPrimary` (reads `moralCircle.excessAffinities`, not `MOR`)
- Vote prediction's moral-circle gap comparison

**Directional correctness if migrated:** The partisan pattern on universalism is real and widely attested (Pew, ANES):
- `dem` → `moralCircle: { universal: 60 }` (moderately high baseline; Democrats lean universalist but the leaner sub-population introduces heterogeneity)
- `rep` → `moralCircle: { universal: 40 }` (moderately low baseline; Republicans lean particularist but the libertarian-R sub-population is more universalist)

These values are approximately ±10 from the neutral 50, scaled to be overridable by a direct Q230/Q231 slider answer. Same "mild prior" philosophy as the continuous nodes.

**Impact vs. other MOR-migration tickets:** Q200 is `fixed12`, so this MOR write is not gated by EIG — every respondent sees it. Q8 and Q231 (both fixed12) are already correctly writing to `moralCircle`. Q200 is the remaining fixed12 question that doesn't. The migration is low-effort (4 lines: replace MOR write with moralCircle write in `dem` and `rep`).

**Severity: LOW-MEDIUM.** Lower than Q201's migration (which missed national scoped affinity entirely — a complete path gap). Q200's MOR write is only part of the universalism signal; Q230/Q231 (battery A) are the load-bearing sources. The partisan prior on universalism is a nudge, not a gate-keeper. But since it's fixed12 and affects all respondents, correcting it has wide (if shallow) impact.

---

### Finding 4 — STALE-COMMENT (LOW): PF reference in pre-question comment

**Comment (lines 3929–3931, verbatim):**
```ts
// PF salience nudge added so the question still contributes to PF posterior
// confidence (a person who answers a party question is engaged enough that
// PF matters).
```

`PF` (partisan fusion) is deprecated per ADR-007. The touchProfile has no PF entry. The comment describes a design intent that was never implemented (or was implemented and then removed when PF was deprecated). The comment is a dead instruction — no PF write exists.

**Fix:** Replace the comment with: "// Q200 is the sole fixed12 partyID question. Its answers set the partyID metadata (consumed by predictVote) and nudge the prior on ENDS + REALITY nodes for partisan-leaning respondents. No SELF/MEANS nodes are touched — partisan ID does not reliably predict proceduralism, compromise tolerance, or epistemic style."

**Severity: LOW.** The comment can mislead a developer who reads it and looks for PF salience logic that isn't there. Easy fix; zero runtime impact.

---

### Cross-option symmetry table (Q200)

| Node | `dem` distribution | `dem` mean | `rep` distribution | `rep` mean | Symmetry |
|---|---|---|---|---|---|
| MAT | lean-low [0.25,0.25,0.20,0.16,0.14] | 2.69 | lean-high [0.14,0.16,0.20,0.25,0.25] | 3.31 | **PASS (exact mirror)** |
| CD | lean-low | 2.69 | lean-high | 3.31 | **PASS** |
| CU | lean-low | 2.69 | lean-high | 3.31 | **PASS** |
| MOR | lean-high | 3.31 | lean-low | 2.69 | **PASS** (sign-inverted correctly) |
| ZS | lean-low | 2.69 | lean-high | 3.31 | **PASS** |
| ONT_S | lean-high | 3.31 | lean-low | 2.69 | **PASS** |
| ONT_H | lean-high | 3.31 | lean-low | 2.69 | **PASS** |

**All pairwise deviations symmetric at ±0.31.** The 1.8:1 ratio (peak 0.25 vs trough 0.14) is exactly replicated in `rep`. No asymmetry.

---

### Summary

| Finding | Severity | Impact | Proposed fix |
|---|---|---|---|
| `ind`/`third`/`other`/`none` produce zero positional evidence; touchProfile over-claims 7-node coverage for 40-45% of respondents | **MEDIUM** | Leaners get no prior; EIG diluted for non-partisan respondents; `quality: 0.99` scores are metadata-driven, not position-evidence-driven | Add `ind_lean_d` and `ind_lean_r` options with half-strength evidence rows |
| HARNESS-HANDOFF option taxonomy mismatch (`ind_lean_d`/`ind_lean_r` expected, `ind` actual) | **MEDIUM** | `answerEngine.ts` leaner dispatch will fail-to-match; incorrect default answer used | Update persona partyID taxonomy to use actual Q200 option IDs before writing answerEngine.ts |
| MOR writes instead of moralCircle for `dem` and `rep` | **LOW-MEDIUM** | Partisan universalism signal invisible to moralCircle module and IDP routing | Replace MOR with moralCircle.universal writes (dem→60, rep→40); 4 lines in questions.representative.ts |
| Stale PF comment (lines 3929–3931) | **LOW** | Developer confusion; no PF write exists in touchProfile | Replace comment with accurate description of Q200's role |
| `dem`/`rep` sign check (all 7 nodes) | **PASS** | — | No action |
| `dem`/`rep` cross-option symmetry | **PASS** | — | No action |
| `dem`/`rep` magnitude (±0.31, 1.8:1) | **PASS** | Correctly weak prior; direct-position questions overpower it | No action |

**Pre-harness priority:** Finding 2 (HARNESS-HANDOFF mismatch) is the blocking one — `answerEngine.ts` must use actual Q200 option IDs, not the spec's proposed taxonomy. Finding 1 (leaner gap) is worth fixing before harness runs to avoid all 3 leaner personas (Libertarian R, Suburban Never-Trump R, possibly MAGA persona who self-identifies as independent) getting no prior signal from the single highest-quality fixed12 question.

**Cross-links:** [[audit-findings.md]] cycle 1 (Q201 WRONG-NODE TRB; same fixed12 migration chain); [[audit-findings.md]] cycle 10 (Q103 MOR→moralCircle migration gap; Q200 adds a fourth fixed12 MOR-migration ticket); [[architecture-thoughts.md]] cycle 6 (IDP gate calibration — Q200's dem→moralCircle universal write would modestly assist universalist baseline for Democratic-leaning respondents); [[new-questions.md]] Q240/Q242 (MAGA personas who call themselves independent would benefit from `ind_lean_r` prior to better prime the anti-establishment + ZS signals those questions test).

---

## [2026-05-19T — cycle 23 — AUDIT — Q49 social_progress_salience]

**Question:** Q49 `slider` — `social_progress_salience` (stage: `stage2`, section: IV, quality: 0.92)

**Prompt (verbatim from MORAL-CIRCLE-GUIDE.md §6.7, describes the rewritten form):**
```
"How much does it matter to your politics whether human nature and institutions can be reshaped through deliberate effort?"
```

**TouchProfile declared (verbatim from `src/config/questions.representative.ts`, lines 674–677):**
```ts
touchProfile: [
  { node: "ONT_H", kind: "continuous", role: "salience", weight: 0.95, touchType: "direct_salience" },
  { node: "ONT_S", kind: "continuous", role: "salience", weight: 0.20, touchType: "progress_salience" }
],
```

**SliderMap (verbatim, lines 678–684):**
```ts
sliderMap: {
  "0-20":   { continuous: { ONT_H: { sal: [0.55, 0.30, 0.12, 0.03] }, ONT_S: { sal: [0.50, 0.30, 0.15, 0.05] } } },
  "21-40":  { continuous: { ONT_H: { sal: [0.25, 0.40, 0.25, 0.10] }, ONT_S: { sal: [0.28, 0.38, 0.24, 0.10] } } },
  "41-60":  { continuous: { ONT_H: { sal: [0.08, 0.28, 0.40, 0.24] }, ONT_S: { sal: [0.12, 0.28, 0.38, 0.22] } } },
  "61-80":  { continuous: { ONT_H: { sal: [0.03, 0.12, 0.40, 0.45] }, ONT_S: { sal: [0.05, 0.18, 0.40, 0.37] } } },
  "81-100": { continuous: { ONT_H: { sal: [0.02, 0.08, 0.30, 0.60] }, ONT_S: { sal: [0.03, 0.12, 0.35, 0.50] } } }
}
```

**Comparator — Q19 `human_progress_salience` (verbatim, lines 558–574):**
```ts
id: 19,
stage: "screen20",
section: "II",
promptShort: "human_progress_salience",
uiType: "slider",
quality: 0.93,
touchProfile: [
  { node: "ONT_H", kind: "continuous", role: "salience", weight: 0.95, touchType: "direct_salience" }
],
sliderMap: {
  "0-20":   { continuous: { ONT_H: { sal: [0.55, 0.30, 0.12, 0.03] } } },
  "21-40":  { continuous: { ONT_H: { sal: [0.25, 0.40, 0.25, 0.10] } } },
  "41-60":  { continuous: { ONT_H: { sal: [0.08, 0.28, 0.40, 0.24] } } },
  "61-80":  { continuous: { ONT_H: { sal: [0.03, 0.12, 0.40, 0.45] } } },
  "81-100": { continuous: { ONT_H: { sal: [0.02, 0.08, 0.30, 0.60] } } }
}
```

---

### Finding 1 — STRUCTURAL-REDUNDANCY (HIGH): Q49 duplicates Q19's primary signal verbatim; selector starvation predicted

Q49's ONT_H sal sliderMap is **identical** to Q19's in every bucket:

| Bucket | Q19 ONT_H sal | Q49 ONT_H sal |
|---|---|---|
| 0-20 | [0.55, 0.30, 0.12, 0.03] | **[0.55, 0.30, 0.12, 0.03]** |
| 21-40 | [0.25, 0.40, 0.25, 0.10] | **[0.25, 0.40, 0.25, 0.10]** |
| 41-60 | [0.08, 0.28, 0.40, 0.24] | **[0.08, 0.28, 0.40, 0.24]** |
| 61-80 | [0.03, 0.12, 0.40, 0.45] | **[0.03, 0.12, 0.40, 0.45]** |
| 81-100 | [0.02, 0.08, 0.30, 0.60] | **[0.02, 0.08, 0.30, 0.60]** |

Same weight (0.95), same touchType (`direct_salience`), same structure. Q19 fires in `screen20`; Q49 is `stage2`. In the EIG-based selector, the live quiz asks Q19 in the screening phase and thereby resolves most of the ONT_H salience uncertainty before Q49 is ever evaluated. When stage2 arrives, Q49's ONT_H sal EIG is near-zero because Q19 already pushed the posterior.

This is the **§5.4 selector starvation** pattern: Q49 will rarely be asked across the 15-persona battery because its primary signal (ONT_H sal, weight 0.95) has already been consumed. The EIG selector cannot know Q49 is "meant" to be a follow-up; it only knows its EIG is low.

**Probability of starvation:** Very high. ONT_H salience has a sal-0-to-3 space with 4 positions. A single screen20 slider question at weight 0.95 with quality 0.93 will reduce posterior entropy on ONT_H sal by ≈0.65–0.85 nats in most respondent buckets. Q49's additional EIG on the same node would typically be 0.05–0.15 nats — easily dominated by any stage2 question touching an unconverged node.

---

### Finding 2 — WRONG-NODE-CONCERN (MEDIUM): ONT_S co-write not justified by the new prompt

Q49 adds an ONT_S sal write at weight 0.20. Q19 — with an effectively identical prompt — has **no ONT_S write**. The difference in this audit cycle: did the prompt rewrite add ONT_S semantic content that Q19 lacks?

The old promptShort is `social_progress_salience`. The guide says the rewrite dropped the "social progress" framing (which was politically loaded) and replaced it with "whether human nature and institutions can be reshaped through deliberate effort." The word "institutions" is new relative to Q19's older prompt ("how much weight do you give to whether human nature can change?").

But ONT_S = **System Ontology: are institutions a useful tool for achieving goals?** This is a strategy-level node, not a "can institutions reshape nature?" question. The prompt's "institutions can be reshaped" is about institutional malleability (which is more ONT_H territory — institutions as the object of change) rather than institutional utility (ONT_S — institutions as the vehicle of change). The semantic mapping from "institutions can be reshaped" → ONT_S salience is not direct.

Additionally, the ONT_S sal sliderMap values (e.g., "81-100": `[0.03, 0.12, 0.35, 0.50]`) are only slightly weaker than the ONT_H sal values (`[0.02, 0.08, 0.30, 0.60]`). The two writes assume that respondents who care more about human malleability also care more about institutional ontology — this coupling is empirically unverified and conceptually contestable. A respondent might care deeply about human malleability precisely because they believe **institutions cannot reshape it** (high ONT_H sal, low ONT_S position, low ONT_S sal).

**Impact:** The ONT_S write at weight 0.20 is weak enough to not cause sign errors, but it may cause mild ONT_S sal convergence drift in the wrong direction for anti-institutional ONT_H-salient respondents. The primary concern is not a correctness bug but a **poorly-grounded secondary signal** appended to a redundant question.

---

### Finding 3 — METADATA-STALE (LOW): promptShort inconsistent with current question content

**Declared (line 671):**
```ts
promptShort: "social_progress_salience",
```

The question has been rewritten to be about **human nature and institutional malleability**, not "social progress." Social progress typically implies a directional normative goal (things are getting better); the new prompt is neutral about direction. The promptShort is a metadata identifier that appears in diagnostic logs and selector trace output. A stale label causes confusion when reading harness traces: `Q49 social_progress_salience` doesn't indicate that this is an ONT_H/ONT_S salience probe.

**Proposed replacement:** `human_institutional_malleability_salience`

---

### Sign and symmetry checks (per §5.5.A and §5.5.B)

```
Bucket: 0-20 (answer: "this doesn't matter much to my politics")
  ONT_H sal: [0.55, 0.30, 0.12, 0.03]  → peaks at sal=0, pushing low salience.
  text→evidence sign:     PASS. Low slider = low salience. ✓
  text→evidence magnitude: APPROPRIATE. Monotone decrease from sal=0 to sal=3. ✓

Bucket: 81-100 (answer: "this matters a great deal to my politics")
  ONT_H sal: [0.02, 0.08, 0.30, 0.60]  → peaks at sal=3, pushing high salience.
  text→evidence sign:     PASS. High slider = high salience. ✓
  text→evidence magnitude: APPROPRIATE. ✓

Symmetry across extremes:
  0-20 vs 81-100: [0.55,0.30,0.12,0.03] vs [0.02,0.08,0.30,0.60] — strict reversal. PASS.
  Same pattern holds for ONT_S sal rows.

Role check:
  touchProfile declares role: "salience" for both nodes.
  sliderMap writes only sal arrays; no pos arrays present.
  POS-VS-SAL-CONFUSION: PASS.
```

The evidence-map-internal correctness (sign, magnitude, symmetry, role) is **PASS**. The bugs are structural (redundancy, ONT_S grounding) rather than within-question logic.

---

### Summary

| Finding | Severity | Impact | Proposed fix |
|---|---|---|---|
| Q49 ONT_H sal evidence identical to Q19 screen20; selector will deprioritize Q49 in every stage2 run | **HIGH** | Q49 effectively never asked; its slot in stage2 wasted; ONT_H salience is double-measured on the rare runs it does fire | See Option A / Option B below |
| ONT_S co-write at weight 0.20 not grounded in the new prompt; Q19 (near-identical prompt) has no ONT_S write | **MEDIUM** | Mild false ONT_S sal drift for anti-institutional respondents; weak but unverified coupling between ONT_H and ONT_S salience | Remove ONT_S write, or reframe Q49 to cleanly probe ONT_S (see Option A) |
| promptShort `social_progress_salience` doesn't match current content | **LOW** | Confusing harness trace labels | Rename to `human_institutional_malleability_salience` |
| ONT_H sal sign, symmetry, role — all correct | **PASS** | — | No action |

**Proposed resolution — Option A (repurpose, preferred):** Give Q49 a distinct signal by reframing it as a dedicated **ONT_S salience** probe, removing the ONT_H write entirely. The prompt could become: "How much does it matter to your politics whether government institutions can effectively solve major social problems?" This cleanly separates Q49 (ONT_S salience) from Q19 (ONT_H salience), making the two complementary rather than redundant. Update touchProfile to: `{ node: "ONT_S", role: "salience", weight: 0.90, touchType: "direct_salience" }`. Remove ONT_H entirely.

**Proposed resolution — Option B (retire):** Before repurposing, confirm whether a dedicated ONT_S salience probe already exists in the bank. If so, retire Q49 entirely rather than adding a third ONT_S sal question. Grep for `ONT_S.*salience` in touchProfile rows to check.

**Pre-harness priority:** HIGH. If Q49 is never asked (starvation), the harness §5.4 "selector starvation" report will flag it — but the root cause and fix can be identified now, before runs. Option A repurpose can be applied before the harness to avoid a wasted slot.

**Cross-links:** [[audit-findings.md]] cycle 18 (Q60 opposeHigh moralCircle silent — same "question never asked so deficiency unseen" category; both warrant pre-harness fixes); [[selector-improvements.md]] (ONT_H salience already screen20-resolved for most personas — any stage2 question touching only ONT_H sal will stall; this is a selector interaction, not a question design flaw per se); [[new-questions.md]] Q243 (COM-only write, stage2 — similarly thin secondary writes risk starvation when primary has been resolved in screen20; same architectural concern).

---

## [2026-05-19T — cycle 24 — AUDIT — Q19 human_progress_salience]

**Question:** Q19 `slider` — human_progress_salience (stage: `screen20`, section: II)

**TouchProfile declared (verbatim from `src/config/questions.representative.ts`):**
```ts
touchProfile: [
  { node: "ONT_H", kind: "continuous", role: "salience", weight: 0.95, touchType: "direct_salience" }
]
```

**sliderMap (verbatim):**
```ts
sliderMap: {
  "0-20":   { continuous: { ONT_H: { sal: [0.55, 0.30, 0.12, 0.03] } } },
  "21-40":  { continuous: { ONT_H: { sal: [0.25, 0.40, 0.25, 0.10] } } },
  "41-60":  { continuous: { ONT_H: { sal: [0.08, 0.28, 0.40, 0.24] } } },
  "61-80":  { continuous: { ONT_H: { sal: [0.03, 0.12, 0.40, 0.45] } } },
  "81-100": { continuous: { ONT_H: { sal: [0.02, 0.08, 0.30, 0.60] } } }
}
```

**Prompt (from MORAL-CIRCLE-GUIDE §6.7, after 2026-05-15 rewrite):**
```
"When considering the implications of policy, how much weight do you give to whether human nature can change?"
```

---

### Finding 1: PASS — evidence sign, magnitude, symmetry, role

```
Bucket: 0-20 (answer: "I barely consider this when thinking about policy")
  ONT_H sal: [0.55, 0.30, 0.12, 0.03]  → peaks at sal=0 (low salience).
  text→evidence sign:       PASS. Low slider = low ONT_H salience. ✓
  text→evidence magnitude:  APPROPRIATE. Strong push to sal=0; 0.55 is the
                             heaviest single-bucket weight. ✓

Bucket: 81-100 (answer: "I weigh this heavily — whether people can change
                          really shapes my political outlook")
  ONT_H sal: [0.02, 0.08, 0.30, 0.60]  → peaks at sal=3 (high salience).
  text→evidence sign:       PASS. High slider = high ONT_H salience. ✓
  text→evidence magnitude:  APPROPRIATE. ✓

Symmetry across extremes:
  0-20 vs 81-100: [0.55,0.30,0.12,0.03] vs [0.02,0.08,0.30,0.60] — exact reversal. PASS.

Middle buckets:
  21-40: [0.25,0.40,0.25,0.10] — center-low mass. PASS.
  41-60: [0.08,0.28,0.40,0.24] — center mass with slight high-sal lean. PASS.
  61-80: [0.03,0.12,0.40,0.45] — center-high mass. PASS.
  Monotone gradient from 0-20 → 81-100: PASS.

Role check:
  touchProfile declares role: "salience".
  sliderMap writes only sal arrays; no pos arrays present.
  POS-VS-SAL-CONFUSION: PASS.

TouchProfile integrity:
  Single node, clean role, no legacy dead fields. No stale MOR/TRB proxy.
  HOLLOW-TOUCH: PASS (only declared node: ONT_H; sliderMap writes ONT_H sal).
```

All evidence-map-internal checks PASS. The bugs identified below are structural (inter-question interactions), not within-question calibration errors.

---

### Finding 2: STRUCTURAL-CONCERN (MEDIUM) — ONT_H salience doubly covered in fixed/screen questions (Q19 + Q103)

Q19 is stage `screen20` (fires for every respondent within the first ~20 questions). Q103 is `fixed12` (fires for every respondent in the first 12 questions), and its touchProfile (verbatim, lines ~3792–3795) declares:

```ts
{ node: "ONT_H", kind: "continuous", role: "salience", weight: 0.95, touchType: "salience_screener" },
```

The sequence for every respondent is:
1. **Q103 fires (fixed12):** updates ONT_H sal at weight=0.95 — strong, early update.
2. **Q19 fires (screen20):** updates ONT_H sal at weight=0.95 again — second strong update within the first 20 questions.

Q19 provides genuine additional resolution — it is an entire question devoted exclusively to ONT_H salience (Q103 splits its EIG across COM/ZS/ONT_H/ONT_S/EPS/AES simultaneously). After Q103 establishes a coarse ONT_H sal posterior, Q19 sharpens it with a focused probe. This is architecturally defensible: two screen-slot questions that serve distinct functions on the same node.

**Impact of double-coverage on downstream stage2:** After Q103 + Q19 both fire, ONT_H sal is concentrated. The EIG for any stage2 question co-writing ONT_H sal (in particular Q49) is essentially zero. Q49 declares ONT_H sal at weight=0.95 — but by stage2, this node is already resolved, so Q49's ONT_H EIG contribution is negligible. Q49 must compete for selection on its ONT_S sal component alone (weight=0.20). At 0.20 vs. other stage2 questions at 0.90+, Q49 is systematically underranked.

**Severity:** MEDIUM. The Q103+Q19 double-coverage is not a bug in Q19 — Q19 is correctly designed. The problem surfaces as a **selector starvation** of Q49 and a **ONT_S coverage gap**. Both are downstream consequences of Q19's existence being incompletely accounted for when Q49 was designed.

---

### Finding 3: SELECTOR-MECHANICS (HIGH) — Q19 existence answers cycle 23 Option B question; confirms Option A repurpose as correct path

Cycle 23 (Q49 audit) proposed two options and left an open question:

> **"Proposed resolution — Option B (retire):** Before repurposing, confirm whether a dedicated ONT_S salience probe already exists in the bank. If so, retire Q49 entirely rather than adding a third ONT_S sal question. Grep for `ONT_S.*salience` in touchProfile rows to check."

Grepping `src/config/questions.representative.ts` for `ONT_S.*salience` in touchProfile rows, the results are:

| Question | ONT_S sal weight | Stage | Notes |
|---|---|---|---|
| Q103 (multi-node screener) | 0.95 | fixed12 | Coarse; split across 6 nodes simultaneously |
| Q49 (human_progress_salience) | 0.20 | stage2 | Weak co-write; primary node is ONT_H |
| Several position questions | 0.40–0.55 | stage2 | Secondary sal writes on position-primary questions |

**No dedicated ONT_S salience probe exists at weight ≥ 0.80 in stage2 or screen20.** Q103 is the only strong ONT_S sal update, and it fires as a multi-node screener — its per-node EIG is diluted.

**Conclusion:** Option B (retire Q49) is NOT appropriate — retiring Q49 would leave ONT_S salience with only Q103's coarse multi-node update. **Option A (repurpose Q49 as a dedicated ONT_S sal probe at weight≈0.90) fills a genuine gap.** The repurposed Q49 would be the only screen/stage2 question focused exclusively on ONT_S salience, complementing Q19's exclusive focus on ONT_H salience. The two questions would be symmetrically parallel:

| Question | Stage | Node | Role | Weight | Function |
|---|---|---|---|---|---|
| Q19 `human_progress_salience` | screen20 | ONT_H | salience | 0.95 | ONT_H sal screener |
| Q49 (repurposed) | stage2 | ONT_S | salience | 0.90 | ONT_S sal probe |

This is architecturally clean: Q19 (early, everyone) establishes ONT_H salience; Q49 (adaptive, when ONT_S undetermined) sharpens ONT_S salience. No redundancy.

**The Option A repurpose should update Q49's:**
1. `touchProfile`: remove ONT_H entry; change ONT_S weight from 0.20 → 0.90; update touchType to `"direct_salience"`.
2. `sliderMap`: remove ONT_H sal rows; recalibrate ONT_S sal rows to match Q19's bucket magnitudes (currently ONT_S uses slightly weaker pushes: `0-20` = [0.50,0.30,0.15,0.05] vs Q19's [0.55,0.30,0.12,0.03] — minor difference, but worth aligning for consistency).
3. `promptShort`: rename from `social_progress_salience` to `institutional_effectiveness_salience` (cycle 23 proposal was `human_institutional_malleability_salience` — either works; shorter is better for trace labels).

---

### Summary

| Finding | Severity | Impact | Fix |
|---|---|---|---|
| Evidence sign, magnitude, symmetry, role — all correct | PASS | — | No action |
| TouchProfile: single clean node, no legacy fields | PASS | — | No action |
| ONT_H doubly covered in fixed/screen (Q103 + Q19): makes Q49 stage2 ONT_H EIG-dead | MEDIUM | Not a Q19 bug; downstream effect on Q49 starvation | Accept as designed; fix is in Q49 repurpose |
| Cycle 23 Option B answered: no dedicated ONT_S sal probe at weight ≥ 0.80 in stage2/screen20 | HIGH | ONT_S salience systematically underprobed; justifies Option A repurpose of Q49 | Repurpose Q49 per Option A (cycle 23); align ONT_S bucket magnitudes to Q19's pattern |

**Pre-harness priority:** HIGH (the ONT_S gap answer). This finding closes the open loop from cycle 23 and provides the confirming evidence needed to proceed with Q49's repurpose. The fix is in Q49, not Q19 — Q19 itself is clean. If Q49 is repurposed before harness runs, the Tier-B persona for "Tech-progressive / Yang-curious" (ONT_S-salient: institutions as tools) will be more precisely discriminated.

**Cross-links:** [[audit-findings.md]] cycle 23 (Q49 STRUCTURAL-REDUNDANCY — this cycle is the verification pass confirming Option A); [[architecture-thoughts.md]] cycle 6 (Q231 IDP calibration — same pre-harness fix-first priority class); [[new-questions.md]] Q243 (COM-only write at stage2 — parallel selector starvation concern when primary COM sal is resolved in screen20).

