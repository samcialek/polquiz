# New question proposals

**Scope:** Brand-new questions to close gaps. Each must be fully specified, not a sketch.

**Each entry must include:**
- Working title + proposed Q-ID slot (next available is Q240+ per CLAUDE.md)
- Prompt text (one sentence, ideally one signal)
- UI type: slider / single_choice / best_worst / priority_sort
- `touchProfile` — node(s) + role (position/salience/anchor) + weight
- Evidence map — full sliderMap or optionEvidence
- Expected discrimination — which two personas does this separate?
- Justification — what gap does this close? Reference §6 in HARNESS-HANDOFF.md or specific personas in §3.

**Seed gaps from HARNESS-HANDOFF.md §6 to develop:**
- Anti-establishment salience (distributed across PRO/ONT_S/ZS, undermeasured)
- Cross-pressure self-awareness (partyID vs declared positions)
- Engagement channel (which media; tribal signal)
- Economic-anxiety vs cultural-anxiety priority (separates Obama→Trump from Bernie-curious)
- Authority-style preference (statesman vs fighter — calibration may be off)

---

## [2026-05-18T03:00 — cycle 3 — GENERATE — new-questions.md]

### Q240 — `anti_establishment_frame` (single_choice, stage2)

#### Justification

HARNESS-HANDOFF.md §6 flags "Anti-establishment salience" as the top gap: "Many of the realignment personas (Abstain→Trump, Obama→Trump, Hispanic D→Trump) share a high anti-establishment frame. Currently this signal is distributed across PRO/ONT_S/ZS and is undermeasured."

The current bank captures this belief *obliquely*:
- Q201 `proud_distrustful` touches ONT_S — but mixes patriotism with institutional trust, so a MAGA voter and a Never-Trump R might both pick it
- Q214/Q215/Q216 probe "normative institutional essentialism" — but a populist who WANTS institutions to work (just believes they've been captured) can answer Q214 at a moderate level and look indistinguishable from an institutionalist
- Q20 `powerful_selfish` touches ZS + ONT_H — but many respondents attribute dysfunction to "complex forces," which produces a flat ONT_S signal even if they privately believe in elite capture

What's missing is a *direct frame probe*: "**do you believe the system itself is captured by elites?**" This is the axis that separates:
- Abstain→Trump and MAGA all-in (believe elite capture is real, defining)
- Obama→Trump (believe it on economic terms — trade deals, corporate capture)
- Bernie progressive (believe it — but elites are corporations, not immigrants)
- Never-Trump Republican (parties are broken, but institutions still legitimate)
- Urban progressive (parties are broken, but in the other direction)
- Disengaged centrist (system is drifting, no one is in control — not zero-sum)

The question deliberately avoids naming parties, demographics, or policy directions, so it captures the structural belief without partisan loading. Both left-populists and right-populists will pick `elite_capture`; downstream CD/MAT/ZS questions separate them.

---

#### Proposed question

```ts
{
  id: 240,
  stage: "stage2",
  section: "III",
  promptShort: "dysfunction_causal_frame",
  promptFull:
    "When you think about why political outcomes in this country keep disappointing, which frame fits you best?",
  uiType: "single_choice",
  quality: 0.91,
  rewriteNeeded: false,
  touchProfile: [
    { node: "ONT_S", kind: "continuous", role: "position", weight: 0.55, touchType: "system_capture_vs_legitimacy" },
    { node: "ZS",    kind: "continuous", role: "position", weight: 0.40, touchType: "elite_vs_people_frame" },
    { node: "PRO",   kind: "continuous", role: "position", weight: 0.20, touchType: "process_legitimacy_weak_signal" },
  ],
  optionEvidence: {
    elite_capture: {
      continuous: {
        ONT_S: { pos: [0.40, 0.32, 0.18, 0.08, 0.02] },
        ZS:    { pos: [0.02, 0.06, 0.14, 0.35, 0.43] },
      }
    },
    partisan_failure: {
      continuous: {
        ONT_S: { pos: [0.12, 0.22, 0.38, 0.22, 0.06] },
        ZS:    { pos: [0.05, 0.15, 0.30, 0.35, 0.15] },
      }
    },
    institutional_drift: {
      continuous: {
        ONT_S: { pos: [0.08, 0.18, 0.40, 0.25, 0.09] },
        ZS:    { pos: [0.15, 0.30, 0.35, 0.15, 0.05] },
      }
    },
    basically_fine: {
      continuous: {
        ONT_S: { pos: [0.02, 0.06, 0.18, 0.40, 0.34] },
        ZS:    { pos: [0.25, 0.30, 0.25, 0.15, 0.05] },
        PRO:   { pos: [0.02, 0.06, 0.20, 0.38, 0.34] },
      }
    },
  }
}
```

---

#### Option wording (verbatim)

| key | display text |
|---|---|
| `elite_capture` | "Wealthy interests and credentialed elites have captured the institutions and use them for their own benefit at everyone else's expense." |
| `partisan_failure` | "The parties themselves are the main problem — one or both have blocked progress through bad priorities and self-interest." |
| `institutional_drift` | "It's more drift and dysfunction than any particular group's fault — complex incentives and misaligned actors, nobody really steering." |
| `basically_fine` | "The institutions basically function; the disagreements are about which values and priorities to follow, not about whether the system is broken or captured." |

---

#### Evidence commentary

**ONT_S (weight 0.55 — primary)**

`elite_capture`: pos `[0.40, 0.32, 0.18, 0.08, 0.02]` — mean ≈ 2.0. Deliberately strong. "The institutions are captured" is an explicit institutional-legitimacy rejection; logically maps to ONT_S = 1–2 (institutions are not a neutral tool for the public good).

`basically_fine`: pos `[0.02, 0.06, 0.18, 0.40, 0.34]` — mean ≈ 3.98. Symmetric counterpart. Deviation from center (3.0): `elite_capture` −1.0, `basically_fine` +0.98 → **PASS on symmetry**.

`partisan_failure`: pos mean ≈ 2.88. Softer than `elite_capture` because "parties are broken" ≠ "system is captured" — a respondent might believe institutions could work if parties were reformed.

`institutional_drift`: pos mean ≈ 3.09. Barely below center. "Drift and dysfunction" implies no villain and no structural capture — the system isn't delegitimized, just underperforming.

**ZS (weight 0.40 — secondary)**

`elite_capture`: pos mean ≈ 4.11 (high zero-sum). The elite-vs-people framing is inherently zero-sum — what elites gain, ordinary people lose.

`basically_fine`: pos mean ≈ 2.45. Not strongly non-zero-sum (that would be overclaiming), just "not primarily a zero-sum fight."

`elite_capture` vs `basically_fine` ZS gap: 4.11 vs 2.45, deviation +1.11 vs −0.55. **INTENTIONAL ASYMMETRY**: a "basically_fine" voter need not be a positive-sum idealist — they just don't see politics as a zero-sum battle. Forcing symmetric ZS here would be OVER-PULL for `basically_fine`.

**PRO (weight 0.20 — minor, `basically_fine` only)**

Only touches `basically_fine` because only that option implies "process matters, the system is legitimate." For `elite_capture`, declining to push PRO is intentional: a populist might want to *restore* proceduralism (via outsider disruption), not abandon it. Conflating anti-establishment with anti-process is a WRONG-NODE risk.

---

#### Expected discrimination value

| Persona pair | Expected answers | Discrimination site |
|---|---|---|
| MAGA all-in vs. Never-Trump Republican | `elite_capture` vs. `basically_fine` or `partisan_failure` | ONT_S position (−1 vs. +1 deviation from center) |
| Obama→Trump vs. Lifelong Democrat | Both pick `elite_capture`, but from different policy directions | This question **does not** separate them — downstream CD/MAT do |
| Abstain→Trump vs. Disengaged centrist | `elite_capture` vs. `institutional_drift` | ZS (4.11 vs. 2.65) |
| Bernie progressive vs. Libertarian Republican | Both likely `elite_capture` | This is correct — the structural belief is shared; CD/MAT separate them |
| Suburban Never-Trump R vs. Christian-right traditionalist | `partisan_failure` vs. `basically_fine` | ONT_S (2.88 vs. 3.98) |

---

#### Selector notes

- **EIG will be high** when ONT_S and ZS salience are both confirmed (both mid-salient after Q103), because the four options spread across both nodes simultaneously.
- **No eligibleIf needed** — the question is semantically safe to ask any respondent. The EIG selector will naturally deprioritize it if ONT_S and ZS are already well-resolved.
- **Interaction with Q201**: Q201 also touches ONT_S (institutional trust frame). Q240 is not redundant because Q201 conflates patriotism + trust, while Q240 asks directly about *causal attribution* (who/what is responsible for dysfunction). A proud-and-trusting respondent (Q201 `proud_and_trust`) might still pick `partisan_failure` on Q240 — they trust institutions in general but think the current parties are to blame.
- **Does not replace Q214/Q215/Q216**: Those ask about normative essentialism ("do institutions fundamentally shape outcomes?"). Q240 asks about capture/legitimacy ("are current institutions serving the public?"). These are different questions; both are worth asking.

---

#### Open question for Sam

The `partisan_failure` option is intentionally party-neutral. But in practice, respondents may map it onto one side. A D voter might read "one or both parties have blocked progress" as pointing at Republicans; an R voter might read it as Democrats. This could introduce partisan loading without being detectable from the wording. **Alternative**: add a fifth option `cross_partisan_failure` — "Both parties have captured the agenda for their donor bases at ordinary voters' expense" — which would separate the Bernie/MAGA overlap from the standard partisan.

Adding a 5th option is a non-trivial UI change; flag for consideration but not blocking.

---

## [2026-05-18T12:00 — cycle 9 — GENERATE — new-questions.md]

### Q241 — `economic_vs_cultural_primacy` (single_choice, stage2)

#### Justification

HARNESS-HANDOFF.md §6 lists "Economic-anxiety vs cultural-anxiety priority" as a named gap: "A direct trade-off question separates Obama→Trump (cultural-driven) from Bernie-curious (economic-driven) — currently both populations look similar on MAT alone."

The problem is structural. MAT position questions probe *where* you fall on redistribution (MAT=1 vs MAT=5). They say nothing about *whether economic policy is your primary driver* versus cultural change. Two of the most important cross-pressured personas in the Tier-A/B battery share nearly identical MAT positions:

- **Obama→Trump**: redistributive MAT (1–2), culturally-conservative CD (4), national affinity high. Defected to Trump on culture, not economics. Primary driver: **cultural**.  
- **Bernie-curious**: redistributive MAT (1–2), progressive CD (1–2), universalist. Stays Democratic in generals but frustrated the party won't go further on economics. Primary driver: **economic**.

On the existing salience screener (Q103), both personas are likely to place both `mat` and `cd` in `supportHigh` — their salience on both nodes is real. The screener registers "both are active" but cannot say which one *governs the vote when they conflict*. No current question in the live bank addresses that conflict directly.

The correct format is a **behavioral forced-trade-off** (cf. Q8 for moral circle): ask the respondent which candidate they'd prefer when the two domains conflict. This elicits a latent priority, not a self-described position.

---

#### Proposed question

```ts
{
  id: 241,
  stage: "stage2",
  section: "III",
  promptShort: "economic_vs_cultural_primacy",
  promptFull:
    "Imagine two candidates: one completely shares your economic views but is on the wrong side of the cultural debate for you; the other shares your cultural values but is at odds with your economic views. Which are you more likely to vote for?",
  uiType: "single_choice",
  quality: 0.92,
  rewriteNeeded: false,
  touchProfile: [
    { node: "MAT", kind: "continuous", role: "salience", weight: 0.75, touchType: "economic_vs_cultural_primacy" },
    { node: "CD",  kind: "continuous", role: "salience", weight: 0.75, touchType: "economic_vs_cultural_primacy" },
  ],
  optionEvidence: {
    economics_wins: {
      continuous: {
        MAT: { sal: [0.02, 0.08, 0.30, 0.60] },
        CD:  { sal: [0.30, 0.38, 0.24, 0.08] },
      }
    },
    culture_wins: {
      continuous: {
        MAT: { sal: [0.30, 0.38, 0.24, 0.08] },
        CD:  { sal: [0.02, 0.08, 0.30, 0.60] },
      }
    },
    neither_accept: {
      continuous: {
        MAT: { sal: [0.05, 0.20, 0.40, 0.35] },
        CD:  { sal: [0.05, 0.20, 0.40, 0.35] },
      }
    },
    probably_abstain: {
      continuous: {
        MAT: { sal: [0.40, 0.35, 0.18, 0.07] },
        CD:  { sal: [0.40, 0.35, 0.18, 0.07] },
      }
    },
  }
}
```

---

#### Option wording (verbatim)

| key | display text |
|---|---|
| `economics_wins` | "The candidate who agrees with me on the economy. Economic policy is where the real stakes are; I can tolerate some cultural disagreement." |
| `culture_wins` | "The candidate who shares my cultural values. The cultural direction of the country matters more to me than the economic platform." |
| `neither_accept` | "Neither, honestly — if a candidate is badly wrong on either dimension, that's disqualifying. I want both." |
| `probably_abstain` | "I'd probably disengage rather than vote for either. I don't see this kind of candidate as worth choosing between." |

---

#### Evidence commentary

**MAT and CD salience — the only writes in this question**

This question is intentionally **position-neutral**. It tells the engine nothing about whether the respondent is MAT=1 or MAT=5, or CD=1 or CD=5. It only tells the engine *which dimension governs the vote when both are activated simultaneously.* Position evidence comes from dedicated position questions; mixing position into this question would be OVER-PULL (a low-CD respondent who picks `culture_wins` would erroneously receive both a CD salience boost AND a CD position signal — but their position was already established by Q101/Q82/etc.).

**`economics_wins` — MAT high, CD reduced:**
- MAT `sal: [0.02, 0.08, 0.30, 0.60]` → E[sal] ≈ 2.48. Strong. "Economics is my tiebreaker" is a near-maximal MAT salience signal.
- CD `sal: [0.30, 0.38, 0.24, 0.08]` → E[sal] ≈ 1.10. Reduced but not zero. The respondent cares about culture; they just subordinate it when forced to choose. Setting CD to near-zero would be OVER-PULL — they said "primary driver," not "only thing that matters."

**`culture_wins` — CD high, MAT reduced:**
- Perfect mirror of `economics_wins`. CD = [0.02, 0.08, 0.30, 0.60], MAT = [0.30, 0.38, 0.24, 0.08].
- Cross-option symmetry: `economics_wins` and `culture_wins` are exact mirrors on their respective nodes. **PASS on symmetry.**

**`neither_accept` — both highly salient:**
- MAT `sal: [0.05, 0.20, 0.40, 0.35]` → E[sal] ≈ 2.05. High-ish.
- CD `sal: [0.05, 0.20, 0.40, 0.35]` → E[sal] ≈ 2.05. Same.
- Semantics: this respondent treats BOTH dimensions as non-negotiable thresholds. That's a high-salience signal on both nodes. The MAGA all-in persona and the Bernie-hardliner are both candidates for this option — they want ideological purity on multiple axes simultaneously.

**`probably_abstain` — both low-salience:**
- MAT and CD both `sal: [0.40, 0.35, 0.18, 0.07]` → E[sal] ≈ 0.92. Low.
- Semantics: a respondent who disengages rather than choose between the two cross-pressured candidates is telling us neither domain is strong enough to pull them to the polls. This is consistent with the disengaged centrist persona (low salience on all nodes, abstains rather than votes for "the lesser evil").

**No PRO, COM, ZS, or ONT_S writes:**
The question could plausibly invoke PRO (process-over-substance logic) for `neither_accept`, but that would be OVER-PULL — refusing cross-pressured candidates is better explained by high absolute salience on both dimensions than by proceduralism. COM (compromise tolerance) could also seem relevant, but `neither_accept` isn't really about refusing compromise — it's about refusing to accept a candidate who is *wrong* on a dimension you care about, which is a salience statement. One signal per item: keep it MAT/CD salience only.

---

#### Expected discrimination value

| Persona pair | Expected answer | Discrimination site |
|---|---|---|
| Obama→Trump vs. Bernie-curious | `culture_wins` vs. `economics_wins` | MAT sal 2.48→1.10 vs 1.10→2.48; CD sal 1.10→2.48 vs 2.48→1.10 — **clean four-corner separation** |
| MAGA all-in vs. Disengaged centrist | `neither_accept` or `culture_wins` vs. `probably_abstain` | Both-high sal vs. both-low sal |
| Bernie-curious vs. Lifelong D urban progressive | `economics_wins` vs. possibly `neither_accept` | The urban progressive may be more comfortable accepting the economic-weak candidate if they're culturally aligned — lower relative MAT salience than Bernie-curious |
| Never-Trump R vs. Suburban D | `neither_accept` (process-first) or `culture_wins` | Never-Trump R values *both* market economics and moderation; they might reject either cross-pressured extreme |
| Libertarian R vs. Christian-right traditionalist | `economics_wins` vs. `culture_wins` | Both are conservatives but the axis of primary salience differs sharply |

The single clearest diagnostic pair is **Obama→Trump vs. Bernie-curious** — this is exactly the pair HARNESS-HANDOFF §6 named. Q241 produces maximum EIG precisely when Q103 has already shown both MAT and CD salient, which is the cross-pressure configuration both of those personas exemplify.

---

#### Interaction with Q103 (salience screener, fixed12)

Q103 fires first and establishes which nodes are active. For cross-pressured respondents who mark both `mat` and `cd` as `supportHigh` on Q103, Q103's posterior will show both nodes highly salient — but because they're both in `supportHigh`, Q103 provides **no relative ordering** between them. Q241's EIG will therefore be high specifically in that configuration (two equally-salient nodes with no tiebreaker). For respondents who put only one in `supportHigh`, Q241's EIG drops — the relative priority is already implied by the salience screener.

This makes Q241 a precise complement to Q103, not a redundant question. Q103 tells the engine "this person has two active nodes." Q241 tells the engine "and this is the primary one."

---

#### Selector notes

- **Stage2** placement is correct. Must fire after Q103 (fixed12). Before heavy position probing begins.
- **No `eligibleIf` required** — the EIG selector naturally deprioritizes this question when one of MAT/CD is already low-salience (because the relative priority is then unambiguous). An optional optimization would be `eligibleIf: ["mat_salient", "cd_salient"]`, but only if that gate predicate exists in the gate registry — do not add it without verifying.
- **Does not replace Q103**: Q103 is a node-coverage screener; Q241 is a within-pair tiebreaker. Complementary, not substitutable.
- **Does not replace MAT or CD position questions**: Q241 says nothing about where the respondent falls on redistribution or cultural direction. Those still require dedicated position probes.

---

#### Open question for Sam

The forced trade-off assumes the respondent CAN imagine a candidate who is "wrong" on one dimension. For some respondents, position is so strongly bundled — "real conservatives ARE culturally conservative AND pro-market" — that the question feels incoherent. This is most likely for MAGA all-in and for very ideologically consistent archetypes (the Jacobin Egalitarian who expects both economic and cultural progressivism).

These respondents will likely pick `neither_accept`, which is the correct signal: both nodes are non-negotiable, cross-pressured candidates are disqualifying. The question handles this case appropriately.

Second concern: "on the wrong side of the cultural debate for you" is underspecified — a progressive and a traditionalist might both read "wrong side" differently when applying it to a hypothetical. This is intentional (the question is designed to be applicable across the whole spectrum), but it means the question does not probe the *direction* of cultural concern — only whether it's primary or secondary.

---

## [2026-05-18T18:00 — cycle 13 — GENERATE — new-questions.md]

### Q242 — `party_alignment_self_assessment` (single_choice, stage2)

#### Justification

HARNESS-HANDOFF.md §6 lists "Cross-pressure self-awareness" as an explicit gap: "'Does your party take positions you disagree with?' → measures the gap between partyID and ideology."

The current bank captures party attachment through one path only: Q200 (party-ID, a weak Bayes prior). What it does **not** capture is whether that party attachment is *ideologically grounded* or *tribally reflexive*. This distinction drives the two hardest defection cases in the Tier-A/B battery:

- **Suburban Never-Trump Republican**: Republican party-ID + genuinely agrees with much of GOP policy (MAT=4, moderate CD) + deeply committed to institutional norms → defects on CHARACTER grounds. This respondent is *selectively cross-pressured*: party platform mostly OK, specific nominee disqualifying.
- **MAGA all-in populist**: Republican party-ID + agrees with party platform on culture/immigration + is motivated primarily by defeating the opposition (negative partisanship) → never defects. This respondent is *reluctant_partisan* on a structural-ideological basis — they'd vote R even if they privately disagreed on tariffs or entitlements.

Both voters share nearly identical Q200 answers ("rep") and overlapping CD/CU positions. The defection behavior differences are not captured by position questions alone. What separates them is:

1. **Ideological excess on the `ideological` scope**: MAGA voter identifies strongly with "our political camp"; Never-Trump R identifies with "Republican policy values" but not with the MAGA camp specifically. One has high `ideological` scopedAffinity (partisan identity IS part of their moral circle); the other has lower ideological scoped affinity (party is a vehicle, not an in-group).

2. **Negative-partisanship frame** (ZS-adjacent): MAGA voter votes to *defeat the other side*, not just to *elect the right side*. This is a distinct signal from institutional trust (ONT_S) or cultural direction (CD) — it's a structural zero-sum view of politics as an enemy-defeat contest.

No current question isolates these two signals together. Q240 (anti-establishment frame) captures "is the system captured?" — but both MAGA and Never-Trump R can answer `elite_capture` there. Q201 (patriotism/institutional trust) captures "do you trust institutions?" — both might land on `proud_distrustful`. Q242 breaks the degeneracy by directly probing **partisan identity loyalty**: are you with your party because you *agree with them*, or because you *need them to win*?

---

#### Proposed question

```ts
{
  id: 242,
  stage: "stage2",
  section: "III",
  promptShort: "party_alignment_self_assessment",
  promptFull:
    "Which best describes how your party fits your actual political values?",
  uiType: "single_choice",
  quality: 0.89,
  rewriteNeeded: false,
  touchProfile: [
    { node: "MORAL_CIRCLE", kind: "derived",   role: "anchor",   weight: 0.50, touchType: "ideological_scope_affinity" },
    { node: "COM",          kind: "continuous", role: "position", weight: 0.30, touchType: "cross_pressure_tolerance" },
    { node: "ZS",           kind: "continuous", role: "position", weight: 0.20, touchType: "negative_partisanship_frame" },
  ],
  exposeRules: { eligibleIf: ["has_declared_party"] },  // see selector notes
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
}
```

---

#### Option wording (verbatim)

| key | display text |
|---|---|
| `closely_aligned` | "My party's positions closely match my own — I rarely find myself disagreeing with its direction." |
| `mostly_agree` | "I broadly agree with my party's platform and accept that minor disagreements come with the territory." |
| `selective` | "I agree on some major issues but part ways with my party on others — it's an imperfect fit I've decided to work within." |
| `reluctant_partisan` | "My party is mostly a vehicle to prevent the other side from winning. I don't endorse much of its platform; I just need them to beat the opposition." |

---

#### Evidence commentary

**`moralCircle.scopedAffinities.ideological` — the primary write**

No `universal` component is written. The question probes the *partisan identity* scope, not universal moral concern. The engine uses the already-established universal baseline from Q8/Q231 to compute excess. This is correct: a respondent who answered Q8 `clearly_abroad` (universal ≈ 90) and now picks `closely_aligned` (ideological = 85) produces excess = max(0, 85 − 90) = 0. That is the correct result — a universalist who agrees with their party is not displaying in-group ideological bias; they just happen to be politically consistent.

| Option | ideological scopedAffinity | Behavior at universal=30 (domestic voter) | Behavior at universal=90 (universalist) |
|---|---|---|---|
| `closely_aligned` | 85 | excess=55 (strong partisan identity) | excess=0 (consistent but not tribal) |
| `mostly_agree` | 65 | excess=35 (moderate partisan identity) | excess=0 |
| `selective` | 40 | excess=10 (weak partisan identity) | excess=0 |
| `reluctant_partisan` | 20 | excess=0 (no partisan identity; negative partisanship is ZS-driven) | excess=0 |

The table reveals an important asymmetry: for universalist respondents, Q242 contributes zero ideological excess regardless of option. This is correct! A universalist who votes reluctantly against the other side is not tribally motivated — they're procedurally unhappy. The ZS signal from `reluctant_partisan` still fires (correct, because even universalists can hold zero-sum political views). For non-universalists, the ideological excess gradient across the four options cleanly tracks partisan identity strength.

**COM — the cross-pressure tolerance signal**

COM is only written for the two cross-pressured options where the respondent explicitly acknowledges accepting an imperfect party alignment:

- `selective` COM: `[0.05, 0.12, 0.30, 0.35, 0.18]` → E[COM] ≈ 3.49. Moderate-high. "I accept significant disagreements and stay" = demonstrated COM. Not pushed to maximum because "selective" could mean "I disagree on minor platform planks," which isn't a maximal tolerance signal.
- `reluctant_partisan` COM: `[0.04, 0.08, 0.20, 0.38, 0.30]` → E[COM] ≈ 3.82. High. "I vote for my party even though I don't endorse much of its platform" = near-maximal COM — this respondent is accepting a deeply imperfect vehicle. Not pushed to absolute extreme because they might abstain in certain races even if they vote the party line generally.

`closely_aligned` and `mostly_agree` write **no COM**. Knowing that someone agrees with their party tells the engine nothing about their willingness to accept an imperfect candidate — they've never been in that position. Any COM write here would be OVER-PULL.

Cross-option COM symmetry: `reluctant_partisan` (+0.82 above center) vs no COM write for `closely_aligned` — intentional asymmetry. The question is not symmetric across the scale: "I agree" is COM-uninformative; "I disagree but stay" is COM-demonstrating. The asymmetry is logical, not a calibration error.

**ZS — the negative partisanship signal (reluctant_partisan only)**

`reluctant_partisan` ZS: `[0.04, 0.10, 0.22, 0.36, 0.28]` → E[ZS] ≈ 3.74.

Motivation: "I vote my party mainly to prevent the other side from winning" is a near-canonical statement of zero-sum political framing. The respondent is explicitly framing politics as a defeat-the-enemy contest rather than a values-alignment exercise. This is distinct from general cynicism (which would push ONT_S down) — it's specifically about the competitive structure of politics.

ZS is written only for `reluctant_partisan` because no other option implies a zero-sum frame. `selective` could be zero-sum ("the other side is worse than my party, so I tolerate my party's flaws") — but that's speculative; the option text doesn't assert it. One signal per item: only write ZS where the option text directly implies the zero-sum frame.

**Why no ONT_S write?**

Tempting: `reluctant_partisan` might correlate with low institutional trust (ONT_S). But the correlation is not logically necessary. A respondent can believe parties are failing (negative partisanship) while still believing institutions broadly work — that's the Never-Trump R stance. Writing ONT_S here would conflate Q240's signal (institutional capture belief) with this question's signal (partisan loyalty type). These should stay orthogonal.

**Why no PRO write?**

Same reasoning: "I vote to defeat the other side" doesn't say anything about whether you believe in procedural rules-first politics. A MAGA voter with high PRO loyalty (obeys the rules as long as their side makes the rules) and a Never-Trump R with high PRO loyalty (rules matter independently of outcome) might both give similar answers here. PRO is better probed by dedicated PRO questions.

---

#### Expected discrimination value

| Persona pair | Expected answers | Discrimination site |
|---|---|---|
| MAGA all-in vs. Never-Trump Republican | `reluctant_partisan` or `closely_aligned` vs. `selective` | ZS (3.74 vs neutral) + ideological excess (20 vs 40) — but also COM (3.82 vs 3.49). Both will produce distinct posterior clusters because MAGA writes ZS while Never-Trump R writes mild COM |
| Suburban Never-Trump R vs. Lifelong Democrat | Both likely `selective` or `mostly_agree` | Low discrimination on this question — both are ideologically uncomfortable in their parties (R defects right→left; D accepts left-of-center). Expected: similar ideological excess (40–65). Better separated by CD/MAT position |
| Obama→Trump vs. MAGA all-in | Both likely `closely_aligned` or `mostly_agree` for Trump-era R affiliation | Low discrimination here too — Obama→Trump now agrees with Republican direction on culture. The differentiation is via MAT position (Obama→Trump stays redistributive) not via party alignment self-assessment |
| Lifelong D urban progressive vs. Bernie-curious | `mostly_agree` vs. `selective` or `reluctant_partisan` | Moderate discrimination: urban progressive is more comfortable within the Democratic party; Bernie-curious is actively cross-pressured economically. ideological excess gap: 65 vs 40 |
| Disengaged centrist | `mostly_agree` or `selective` (if they answer at all) | Will likely not see this question if `eligibleIf: ["has_declared_party"]` is enforced — they answered Q200 `ind_pure` or `none` |

**The clearest discrimination pair**: MAGA all-in vs. Suburban Never-Trump R. Both are Republicans on Q200. Both may give similar CD/CU answers (culturally-right). They separate sharply on this question: MAGA picks `reluctant_partisan` (negative partisanship ZS + low ideological excess) or `closely_aligned` (high ideological excess if party IS identity); Never-Trump R picks `selective` (moderate ideological excess + moderate COM). The ZS write from `reluctant_partisan` is a signal available nowhere else in the current bank.

A note on the MAGA answer: MAGA all-in might paradoxically answer `closely_aligned` (party IS identity — high excess) OR `reluctant_partisan` (I vote to defeat the enemy — ZS frame). Both are empirically plausible MAGA stances. The question handles both correctly: `closely_aligned` produces high ideological excess → routes toward nationalist IDP archetypes; `reluctant_partisan` produces high ZS + low ideological excess → routes toward populist but non-tribal archetypes. These are genuinely different archetypes, and the question correctly discriminates them.

---

#### Interaction with Q200 (party-ID)

Q200 fires early (fixed12) and establishes party affiliation. Q242 builds on that foundation. For respondents who declared `dem` or `rep`, Q242 produces maximum EIG — the ideological excess signal is meaningful because there's an established party to be aligned with or against. For `ind_lean_d`/`ind_lean_r`, Q242 is still informative (lean-Democrats who see their party as an imperfect vehicle are `reluctant_partisan`; those who genuinely agree with most Democratic positions are `mostly_agree`). For `ind_pure`/`none`, the question is semantically moot and EIG will be low — the selector will naturally deprioritize it, making the `eligibleIf` gate an optimization (not a correctness requirement).

---

#### Selector notes

- **`eligibleIf: ["has_declared_party"]`**: Recommended. Requires a predicate "answered Q200 with dem/rep/ind_lean_d/ind_lean_r" in the gate registry. If the predicate doesn't exist, omit and rely on EIG — a non-partisan respondent answering Q242 will pick `reluctant_partisan` or `selective` (both plausible for independent voters), and the signal will be somewhat accurate even without the gate. Verify before adding the eligibleIf.
- **Stage2 placement**: correct. Fires after Q200 (fixed12) and after Q103 (fixed12 salience screener). Before heavy node-specific probing.
- **EIG will be highest** when Q200 has established a party affiliation AND Q103 has confirmed both MAT and CD as active (cross-pressured respondent with confirmed dual-node salience). For single-node respondents who are clearly on-party, EIG will be moderate.
- **Does not replace Q240**: Q240 asks about structural belief (is the system captured?); Q242 asks about partisan identity (does your party represent you?). Orthogonal signals. Both MAGA and Never-Trump R might answer `elite_capture` on Q240; they diverge on Q242.

---

#### Open question for Sam

**The MAGA `closely_aligned` vs. `reluctant_partisan` ambiguity.** The MAGA all-in persona might plausibly pick either option — some MAGA voters see the party as a genuine expression of their identity (high ideological excess → `closely_aligned`); others see themselves as using the Republican vehicle to defeat the left (low ideological excess + high ZS → `reluctant_partisan`). These are real sub-archetypes within the MAGA coalition. The question correctly routes them to different places in archetype space. But this means Q242 does *not* unify the "MAGA" signal — it splits it. Whether MAGA should be one archetype or two (identity-driven vs. enemy-defeat-driven) is a question for Sam about archetype design, not about this question's evidence map.

**The "has_declared_party" predicate.** If this gate doesn't exist in the registry, options: (a) add it as a simple `state.Q200_answer in [dem, rep, ind_lean_d, ind_lean_r]` predicate, (b) use the EIG fallback, or (c) add a `no_party` option ("I don't identify with a party strongly enough for this to apply"). Option (c) would degrade the question's signal by turning it into a party-identification re-check rather than a loyalty-intensity probe.

---

## [2026-05-18T — cycle 15 — DEEPEN — new-questions.md — Q243: legislative compromise threshold]

### Q243 — `legislative_compromise_threshold` (slider, stage2)

#### Why Q7 doesn't already solve this — the prerequisite finding

Before specifying Q243, the reason for a *new* COM question must be justified against the existing COM probe. Reading `src/config/questions.representative.ts` lines 767–795:

```ts
// Q7 — coalition_vs_principle
{
  id: 7,
  stage: "screen20",
  section: "I",
  promptShort: "coalition_vs_principle",
  uiType: "single_choice",
  quality: 0.88,
  touchProfile: [
    { node: "COM", kind: "continuous", role: "position", weight: 0.85, touchType: "principle_tradeoff" }
  ],
  optionEvidence: {
    principle_first: {
      continuous: { COM: { pos: [0.32, 0.38, 0.20, 0.08, 0.02] } }  // mean ≈ 1.96
    },
    coalition_first: {
      continuous: { COM: { pos: [0.02, 0.08, 0.20, 0.38, 0.32] } }  // mean ≈ 3.98
    },
    depends_on_issue: {
      continuous: { COM: { pos: [0.10, 0.22, 0.42, 0.18, 0.08] } }  // mean ≈ 2.92
    }
  }
}
```

Q7 already provides a COM probe at weight 0.85 that would — in theory — push a `principle_first` answer to COM≈1.96 (matches 021 Principled Cosmopolitan COM=2) and `coalition_first` to COM≈3.98 (matches 001 Rawlsian Reformer COM=4). This should resolve the 021→001 collapse.

**Why it doesn't resolve it: the `depends_on_issue` absorption problem.**

The issue is not the evidence map. The issue is that `depends_on_issue` is the philosophically *correct* answer for a Principled Cosmopolitan:

- 021 Principled Cosmopolitan's defining view: "Universal rights and cosmopolitan principles should govern political choices — but HOW you pursue those principles can and should be strategically adaptive." A cosmopolitan intellectual doesn't reflexively refuse all coalitions; they're pragmatic about coalition-building *when it serves universal values*. "Depends on the issue" is a precise self-description for 021.
- Yet `depends_on_issue` maps to COM=2.92 — right between 021's true COM=2 and 001's COM=4. The discrimination collapses.

This is a semantic leakage problem, not an evidence-map problem. The word "coalition" activates a different schema for cosmopolitan vs. institutionalist respondents:
- For 001 Rawlsian Reformer: "coalition" = "the political coalition to enact my reform agenda." Supporting coalition-building means accepting imperfect allies. COM=4 answer is `coalition_first`.
- For 021 Principled Cosmopolitan: "coalition" = "building alliances for universal causes, which I strongly support." They also want coalitions! "Coalition vs. principle" doesn't map onto their COM=2 reluctance to accept policy compromises — that reluctance is about *substantive outcomes*, not about whether to build alliances.

The result: both 001 and 021 respondents plausibly answer `coalition_first` (institutionalist correctly; cosmopolitan mis-assigned), OR both answer `depends_on_issue` (both plausible), OR cosmopolitan correctly answers `principle_first` only when the "coalition" frame clicks as "accepting bad policy partners."

**The fix:** A COM probe that replaces "coalition vs. principle" framing with a *concrete legislative outcome scenario* that unambiguously targets "will you accept a deal that includes things you oppose?" A slider format eliminates the middle-option absorption by forcing degree rather than category.

---

#### Justification for Q243

This question closes two gaps simultaneously:

1. **Gap 1 (cosmopolitan attractor, archetype-gaps.md):** Replaces Q7's ambiguous "coalition" framing with a concrete scenario that 021 respondents cannot answer as `depends_on_issue`. The scenario — a compromise package containing an opposed provision — directly invokes 021's COM=2 unwillingness to endorse mixed-signal legislation. 001's COM=4 acceptance of imperfect deals is equally well-expressed.

2. **Gap 2 (nihilist pair, archetype-gaps.md):** Also provides discrimination for 108 Passive Cynic (COM=3, sal=0 — will gravitate toward the middle of the slider, not out of conviction but out of indifference) vs. 114 Political Nihilist (COM=1, sal=2 — actively anti-compromise, will anchor near 0). See §"Nihilist pair application" below.

---

#### Proposed question

```ts
{
  id: 243,
  stage: "stage2",
  section: "III",
  promptShort: "legislative_compromise_threshold",
  promptFull:
    "A policy you support is only passable as part of a package deal that also funds or authorizes something you strongly oppose. The opposed provision passes either way — only the supported policy depends on your backing. How often do you accept that deal?",
  uiType: "slider",
  quality: 0.91,
  rewriteNeeded: false,
  sliderAnchorLow:  "Almost never — endorsing a mixed package legitimizes the bad provision and weakens the case against it.",
  sliderAnchorHigh: "Almost always — a real gain today beats a purer loss. Positions can be revisited; missed windows often can't.",
  touchProfile: [
    { node: "COM", kind: "continuous", role: "position", weight: 0.90, touchType: "legislative_compromise_threshold" }
  ],
  sliderMap: {
    "0-20":  { continuous: { COM: { pos: [0.55, 0.30, 0.12, 0.02, 0.01] } } },   // mean ≈ 1.62
    "21-40": { continuous: { COM: { pos: [0.25, 0.40, 0.25, 0.08, 0.02] } } },   // mean ≈ 2.22
    "41-60": { continuous: { COM: { pos: [0.08, 0.22, 0.40, 0.22, 0.08] } } },   // mean ≈ 3.00
    "61-80": { continuous: { COM: { pos: [0.02, 0.08, 0.25, 0.40, 0.25] } } },   // mean ≈ 3.78
    "81-100":{ continuous: { COM: { pos: [0.01, 0.02, 0.12, 0.30, 0.55] } } },   // mean ≈ 4.36
  }
}
```

---

#### Evidence commentary

**COM — the only write in this question (weight 0.90 — direct probe)**

The five-bucket COM evidence map is symmetric around the neutral bucket (41-60):

| Bucket | Mean COM | Deviation from 3.0 |
|---|---|---|
| 0-20   | 1.62 | −1.38 |
| 21-40  | 2.22 | −0.78 |
| 41-60  | 3.00 |  0.00 |
| 61-80  | 3.78 | +0.78 |
| 81-100 | 4.36 | +1.36 |

Symmetry check: |−1.38| vs |+1.36| (0.02 off), |−0.78| vs |+0.78| (exact). **PASS on symmetry.**

For 001/021 discrimination:
- 001 Rawlsian Reformer (COM=4): slides to 61-80 → posterior mean ≈ 3.78. Pushes toward pos=4. Match.
- 021 Principled Cosmopolitan (COM=2): slides to 21-40 → posterior mean ≈ 2.22. Pushes toward pos=2. Match.
- Gap: 3.78 − 2.22 = **1.56 units**, vs. Q7's effective gap (both landing on `depends_on_issue` gives 0-unit separation). This question produces a 1.56-unit posterior gap where Q7 was producing near-zero.

**Why no other node writes?**

Tempting additions and why they're rejected:

- *PRO (proceduralism)*: "Endorsing a mixed package legitimizes the bad provision" sounds like a PRO (rules/integrity) concern. But the question is specifically about whether you'll accept an imperfect *outcome*, not about whether the legislative process was fair. 001 and 021 both have PRO=5 — if PRO were written, both would suppress it equally and the discrimination would collapse. Keep COM pure.

- *ZS (zero-sum)*: "The opponent passes either way" could invoke a zero-sum frame. But the question stipulates this to make the scenario concrete, not to activate zero-sum thinking. Writing ZS here would be OVER-PULL — refusing a compromise deal is not inherently zero-sum (a Rawlsian might refuse if the bad provision violates lexical priority rules, which is PRO not ZS).

- *ONT_H (human malleability)*: Optimism about future reform might correlate with accepting a half-measure now. But this is speculative — pessimists might also accept half-measures as the best available. No clean directional link. Omit.

One signal per item: COM only.

**The PRO-COM interaction risk — and why the scenario neutralizes it**

Q7's failure was partly because "principle" evokes PRO (procedural integrity) as readily as COM (compromise tolerance). The legislative package scenario in Q243 sidesteps this: the question stipulates that the bad provision passes regardless, and only asks whether you support the good policy as part of the deal. There's no procedure to defend — the only question is whether you co-sign the mixed outcome. This decouples PRO from the answer almost entirely.

Residual risk: a high-PRO respondent might still answer near 0 ("I shouldn't be seen endorsing this package in any form — my integrity requires keeping my fingerprints off the bad provision"). If so, this answer is PRO-adjacent, and the PRO write from PRO-dedicated questions must be trusted to absorb that signal. The COM inference from a 0-20 answer remains valid as a *lower bound* — the person refuses the deal for some reason, and COM is the canonical dimension for that. Mis-attribution risk is low.

---

#### Nihilist pair application

For 108 Passive Cynic (COM=3, sal=0) vs. 114 Political Nihilist (COM=1, sal=2):

- 108 Passive Cynic: "All political deals are equally meaningless." Slider lands near 41-60 (pure indifference) → COM mean 3.0, COM sal=0 confirms "doesn't care." The middle of the slider is correct for a respondent whose stance is not anti-compromise but simply disengaged.
- 114 Political Nihilist: "Compromise is capitulation; the system is corrupt beyond redemption." Slider anchors near 0-20 → COM mean 1.62, COM sal boosted by the question (high-salience answer pattern). Match to COM=1.

The distinction is real but requires COM sal to fire this question via EIG. 108's COM sal=0 means the EIG selector may deprioritize Q243 for Passive Cynic respondents — Q243 won't help if it's never asked. This is a structural limit: Q243 provides COM discrimination, but its EIG depends on COM being a registered salient node. For 108, it may not be.

**Mitigation**: The nihilist pair distinction is primarily on ZS (108=4 vs 114=5), ONT_H (both=1), and COM (3 vs 1). If ZS-targeted questions already differentiate them somewhat, Q243 adds precision rather than primary signal. The nihilist pair is MEDIUM priority (per archetype-gaps.md); Q243's contribution there is secondary to Gap 1.

---

#### Expected discrimination value

| Persona pair | Expected slider region | COM posterior gap |
|---|---|---|
| 021 Principled Cosmopolitan vs. 001 Rawlsian Reformer | 21-40 vs. 61-80 | **+1.56 units** — primary use case |
| 021 vs. universal progressives (CD=1, COM=3+) | 21-40 vs. 41-60 | +0.78 units |
| 114 Political Nihilist vs. 108 Passive Cynic | 0-20 vs. 41-60 | +1.38 units — secondary use case |
| Never-Trump Republican vs. MAGA all-in | 41-60 or 61-80 vs. 21-40 | Moderate (Never-Trump R is deal-making; MAGA is more ideologically rigid on core issues) |
| Bernie-curious (COM=2-3) vs. Lifelong Democrat (COM=3-4) | 21-40 vs. 41-60 | +0.78 units — consistent with hardliner vs. pragmatist distinction |
| Disengaged centrist | 41-60 (indifferent) | Near-zero COM update — correct behavior, COM isn't salient |

The clearest discrimination pair remains **021 vs. 001**. Q243 does not overlap with Q241 (which is about salience priority) or Q242 (which is about party alignment loyalty). All three new questions in the Q240-243 block probe orthogonal signals. EIG will be non-zero for all of them simultaneously when the posterior is concentrated in the progressive/institutionalist region.

---

#### Interaction with Q7 (coalition_vs_principle)

Q7 and Q243 are **not redundant** despite both touching COM at high weight:

- Q7 asks *whether* you prioritize coalition-building over principles as a political strategy. A cosmopolitan who supports universal coalitions might answer `coalition_first` even with COM=2, because the word "coalition" doesn't evoke policy compromise for them.
- Q243 asks *how often* you accept a policy deal that includes an opposed provision. This is unambiguous: if you're in the 21-40 bucket, you're telling the engine "rarely" regardless of how you feel about political alliance-building.

In the rare case both are asked for the same respondent (EIG might drop for one after the other fires), they should converge toward the same COM posterior if the framing worked correctly. Divergence between Q7 and Q243 answers (e.g., `coalition_first` on Q7 but 21-40 on Q243) would be diagnostic evidence that Q7's framing is causing leakage — exactly the failure mode identified above. The harness should flag respondents where Q7 and Q243 produce opposite COM evidence directions.

---

#### Selector notes

- **Stage2 placement**: correct. Fires after Q103 (fixed12 salience screener) and Q7 (screen20 COM probe). By the time Q243 is eligible, the engine will have a prior COM estimate from Q7. Q243's EIG will be highest when Q7's answer was `depends_on_issue` (COM≈2.92 — ambiguous; Q243 resolves whether that ambiguity tilts toward 001 or 021).
- **No `eligibleIf` required**: semantically appropriate for any respondent with political views. The EIG selector will naturally deprioritize Q243 when COM is already well-resolved by Q7 (i.e., when Q7 answer was `principle_first` or `coalition_first`, not `depends_on_issue`). **This makes Q243 effectively a conditional follow-up to Q7's ambiguous option**, even without an explicit gate.
- **EIG is maximal** when the posterior posterior is spread across 001-type (COM=4) and 021-type (COM=2) archetypes. This is the exact configuration where Q7 produced `depends_on_issue`.
- **Slider format advantage**: eliminates the middle-bucket absorption problem entirely by forcing degree rather than category. A respondent who answers "sometimes" on Q7 is forced to locate themselves somewhere from 0 to 100, producing a meaningful COM update rather than a 2.92 flat.

---

#### Open question for Sam

**Should Q7 be retired or reworded?** Now that Q243 provides a more direct COM probe, Q7's value may be primarily historical. Two options:
- (a) Keep Q7 at screen20 and use its answer as a lightweight prior — `principle_first` and `coalition_first` still produce useful signal; `depends_on_issue` just means Q243 fires later with high EIG. This is the low-disruption path.
- (b) Reword Q7's `depends_on_issue` option to something more forcing: "It depends — but I lean toward principle even when it means losing" vs. "It depends — but I lean toward coalition even when it's impure." This turns Q7's three options into four, eliminates the COM-neutral bucket, and might make Q243 less necessary. Risk: a rewrite is a question-bank change that affects personas who answered Q7 historically.

Option (a) is preferred for continuity. Q243 and Q7 are complementary in a well-defined way: Q7 fires early and either resolves COM clearly or flags ambiguity; Q243 resolves the ambiguity precisely when Q7 fails to.

---

## [2026-05-19T — cycle 21 — GENERATE — new-questions.md — Q244: nihilist pair COM-salience discriminator]

### Q244 — `compromise_rejection_valuation` (single_choice, stage2)

#### Primary purpose

Close **archetype-gaps.md Gap 2** — the 108/114 nihilist pair collapse. Both archetypes share ONT_S=1, PRO=1, COM low, EPS=nihilist. The only clean architectural discriminator is COM:

- **108 Passive Cynic**: COM=3 sal=0 — doesn't hold a position on compromise; the whole political-process dimension is below their engagement threshold
- **114 Political Nihilist**: COM=1 sal=2 — actively opposes political compromise as a value, with moderate salience

No question in the current bank writes COM *salience* directly. Q7 (coalition_vs_principle) and Q243 (legislative_compromise_threshold) both write COM position — but if a respondent is simply *apathetic* about compromise debates, they land in Q7's `depends_on_issue` bucket or Q243's mid-slider range for reasons of indifference, not conviction. The engine can't tell "I'm moderately tolerant of compromise" from "I don't think about this at all." Q244 provides exactly that signal via a third option that writes very low COM sal rather than a mid-range COM pos.

#### Why Q243 is insufficient for the nihilist pair

Q243 (DEEPEN, cycle 15) is a **slider** — it forces the respondent to locate a position on the "never accept deal → always accept deal" spectrum. The slider format cannot express "I don't have a view on this axis." A 108 Passive Cynic filling a slider will place somewhere near 40-60 out of inertia or indifference, generating COM pos ≈ 3.0 — identical to any genuinely moderate respondent. The result is the same posterior mass for 108 as for a genuinely centrist archetype (e.g., 059 Public-Minded Moderate, COM=3 sal=1). Q244's `dont_follow` option is the only mechanism that produces a *low-salience COM update*, which is the structurally distinct property of 108.

#### Proposed question

```ts
{
  id: 244,
  stage: "stage2",
  section: "III",
  promptShort: "compromise_rejection_valuation",
  promptFull:
    "A politician who systematically refuses to negotiate or make concessions — even when doing so would advance their stated agenda — is, in your view...",
  uiType: "single_choice",
  quality: 0.91,
  rewriteNeeded: false,
  touchProfile: [
    { node: "COM", kind: "continuous", role: "position", weight: 0.70, touchType: "compromise_valuation" },
    { node: "COM", kind: "continuous", role: "salience", weight: 0.55, touchType: "compromise_salience" },
  ],
  optionEvidence: {
    // "Refusing to deal is principled leadership."
    principled_refusal: {
      continuous: {
        COM: {
          pos: [0.55, 0.30, 0.10, 0.04, 0.01],   // mean ≈ 1.66 — strongly anti-compromise
          sal: [0.05, 0.18, 0.42, 0.35],          // E[sal] ≈ 2.07 — respondent cares about COM axis
        }
      }
    },
    // "Refusing to deal is governance failure."
    governance_failure: {
      continuous: {
        COM: {
          pos: [0.01, 0.04, 0.10, 0.30, 0.55],   // mean ≈ 4.34 — strongly pro-compromise
          sal: [0.05, 0.18, 0.42, 0.35],          // E[sal] ≈ 2.07 — same moderate-high salience
        }
      }
    },
    // "I don't follow or form views on deal-making in politics."
    dont_follow: {
      continuous: {
        COM: {
          pos: [0.17, 0.20, 0.26, 0.22, 0.15],   // mean ≈ 2.98 — near-uniform, no COM pos update
          sal: [0.60, 0.30, 0.08, 0.02],          // E[sal] ≈ 0.52 — very low salience (COM apathy)
        }
      }
    },
  }
}
```

#### Option wording (verbatim)

| key | display text |
|---|---|
| `principled_refusal` | "...principled leadership. Compromising on core values surrenders what the public elected you to fight for." |
| `governance_failure` | "...poor governance. Getting things done requires working through imperfect agreements, not walking away from the table." |
| `dont_follow` | "...not really something I have a view on. Whether politicians hold firm or make deals isn't something I track or think about." |

#### Evidence commentary

**COM position — symmetric, two-sided probe**

| option | pos array | E[pos] | deviation from 3.0 |
|---|---|---|---|
| `principled_refusal` | [0.55, 0.30, 0.10, 0.04, 0.01] | 1.66 | −1.34 |
| `governance_failure` | [0.01, 0.04, 0.10, 0.30, 0.55] | 4.34 | +1.34 |
| `dont_follow` | [0.17, 0.20, 0.26, 0.22, 0.15] | 2.98 | −0.02 |

Cross-option symmetry: |−1.34| = |+1.34|. **PERFECT SYMMETRY** on the two polar options. `dont_follow` is near-neutral by design — it should not move COM pos in either direction, only salience.

**COM salience — the structurally unique write in this question**

| option | sal array | E[sal] | semantic meaning |
|---|---|---|---|
| `principled_refusal` | [0.05, 0.18, 0.42, 0.35] | 2.07 | "I have a position on this and it matters to me" |
| `governance_failure` | [0.05, 0.18, 0.42, 0.35] | 2.07 | same — position held with engagement |
| `dont_follow` | [0.60, 0.30, 0.08, 0.02] | 0.52 | "I don't engage with this dimension" |

The `principled_refusal` and `governance_failure` sal arrays are **identical**. This is intentional: both options require the respondent to hold and express a view on compromise, signaling engagement with COM regardless of direction. The discriminating signal is pos, not sal. Only `dont_follow` departs on sal, and that departure is the entire point of the question.

**Why no other node writes?**

- *ZS (zero-sum)*: `principled_refusal` contains "fight for" framing that could invoke zero-sum thinking. But the question is about COM specifically — a respondent could refuse compromise for non-zero-sum reasons (principled idealism, not enemy-defeat framing). Writing ZS would conflate 114 Political Nihilist (ZS=5) with 021 Principled Cosmopolitan (ZS=1), both of whom might pick `principled_refusal`. Keep COM pure.

- *PRO (proceduralism)*: "Refusing to deal maintains principled integrity" sounds PRO-adjacent. But 114 Political Nihilist has PRO=1 sal=3 (anti-rules), while Never-Trump Republicans have PRO=4+ — both might pick `principled_refusal` for opposite PRO reasons. PRO is not a clean signal here; COM is.

- *ENG (engagement)*: `dont_follow` implies low political engagement. But ENG and COM are independent — a high-ENG voter could still be COM-apathetic (they care intensely about cultural debates but simply don't think about deal-making dynamics). Writing ENG in `dont_follow` would conflate COM disengagement with general political disengagement. No ENG write.

- *ONT_S (institutional trust)*: Tempting for `dont_follow` because 108 Passive Cynic has ONT_S=1 sal=3. But the option text "I don't track or think about" is specifically about COM engagement, not about whether institutions are legitimate. ONT_S should be probed by dedicated questions (Q201, Q240), not as a side-write here. One signal per item.

#### Archetype routing table

| Archetype | Expected option | COM pos posterior | COM sal posterior | Correct? |
|---|---|---|---|---|
| 108 Passive Cynic (COM=3 sal=0) | `dont_follow` | near-uniform (2.98) | 0.52 — very low | ✓ low sal matches sal=0 |
| 114 Political Nihilist (COM=1 sal=2) | `principled_refusal` | 1.66 — low | 2.07 — moderate-high | ✓ both match |
| 113 Disaffected Contrarian (COM=1 sal=2) | `principled_refusal` | 1.66 — low | 2.07 — moderate-high | ✓ both match |
| 001 Rawlsian Reformer (COM=4 sal=2) | `governance_failure` | 4.34 — high | 2.07 — moderate-high | ✓ both match |
| 021 Principled Cosmopolitan (COM=2 sal=2) | `governance_failure` or `principled_refusal`? | — | — | See note |
| 059 Public-Minded Moderate (COM=3 sal=1) | `governance_failure` or `dont_follow` | — | — | See note |

**Note on 021 Principled Cosmopolitan (COM=2):** 021 has COM=2 (low-ish — won't often take imperfect legislative deals). Yet their political philosophy is pro-democratic-process and universalist. The `principled_refusal` option text ("fight for" populist framing) is semantically mis-aligned with cosmopolitan values; 021 respondents are more likely to pick `governance_failure` even with COM=2, because their COM=2 comes from principled *substantive* limits rather than blanket refusal-to-deal. The result: Q244 doesn't cleanly separate 021 from 001 (both pick `governance_failure`). This is expected — Q243 handles the 021/001 discrimination; Q244's job is the nihilist pair.

**Note on 059 Public-Minded Moderate (COM=3 sal=1):** A centrist who picks `governance_failure` would receive COM pos 4.34 (overclaim for COM=3) and COM sal 2.07 (overclaim for sal=1). The overclaim is real but bounded: Q244's `governance_failure` is an extreme option (strong high-COM signal), and a true centrist may instead pick the `dont_follow` option if they have low COM salience. The selector should show this question after Q7 and Q243 have established COM confidence — by then, genuine COM=3 respondents will have already produced a well-resolved posterior, and Q244's EIG will drop accordingly. Overclaim risk is low in practice.

#### Why this is the correct primary Q244 design vs. alternatives

**Alternative considered:** A 4-option question adding `context_dependent` ("Refusing to compromise can be right or wrong depending on the issue"). This mirrors Q7's `depends_on_issue` absorption problem — cosmopolitan and moderate respondents alike would pick it, collapsing the signal. Rejected.

**Alternative considered:** Expanding `dont_follow` into two low-engagement options: "I don't pay attention to politics generally" (ENG-general) vs. "I pay attention to politics but deal-making bores me" (COM-specific). The split might improve precision, but it pushes toward four options and violates the HARNESS-HANDOFF principle of keeping questions short and targeted. The current `dont_follow` text ("I don't track or think about") is specific enough to COM that it won't capture high-ENG respondents who simply find other issues more salient.

#### Expected discrimination value

| Persona pair | Expected answers | Key signal produced |
|---|---|---|
| 108 Passive Cynic vs. 114 Political Nihilist | `dont_follow` vs. `principled_refusal` | COM sal 0.52 vs. 2.07 — **primary use case; cleanest separation** |
| 113 Disaffected Contrarian vs. 108 | `principled_refusal` vs. `dont_follow` | same — 113 actively values non-compromise |
| Young nihilist (HARNESS-HANDOFF #15) — 4chan-right variant | `principled_refusal` | routes toward 114/113 family; COM pos 1.66 |
| Young nihilist — TikTok-left variant | `dont_follow` | routes toward 108; COM sal 0.52 |
| 001 Rawlsian Reformer vs. 114 Political Nihilist | `governance_failure` vs. `principled_refusal` | COM pos gap: 4.34 − 1.66 = **2.68 units** |
| MAGA all-in vs. Never-Trump Republican | `principled_refusal` vs. `governance_failure` | COM pos gap: 1.66 vs. 4.34 — good secondary discrimination |

#### Interaction with Q7 and Q243

Q7 (coalition_vs_principle, screen20) and Q243 (legislative_compromise_threshold, stage2) both write COM position. Q244 is **not redundant** with either:

- Q7 and Q243 cannot write COM salience. Any COM sal signal in the model comes from implicit question-encounter patterns (e.g., if the respondent answers COM questions consistently, the engine infers salience). Q244 makes COM sal explicit and direct.
- Q244's `dont_follow` option has no analogue in Q7 or Q243. It is the only option in the bank that can produce a low COM sal update.
- For respondents who answered Q7 `depends_on_issue` and Q243 mid-range (41-60): Q244 is the tiebreaker that determines whether that mid-range answer reflects genuine moderation (→ `governance_failure` or `principled_refusal`, COM sal 2.07) or indifference (→ `dont_follow`, COM sal 0.52). The EIG for Q244 is maximal in exactly this post-Q7-Q243 configuration.

**Recommended selector behavior:** fire Q244 after Q7 and Q243 have both been seen, when the COM posterior is unresolved (spread across the 1–3 range, spanning 108/114/113/021/001 family archetypes). For respondents whose COM is already well-established in the 4–5 range (Rawlsian Reformer, institutionalist), Q244's EIG will be low and the selector should skip it.

#### Selector notes

- **Stage2, section III** — same section as Q243; fires in the MEANS probing phase
- **No `eligibleIf` required** — COM discrimination is universally relevant; EIG gates naturally
- **Mutual information with Q243**: after Q243, the COM pos posterior will have updated. Q244's additional value is primarily in the `dont_follow` → COM sal pathway, which Q243 cannot produce. Even after Q243 fires, Q244's EIG is non-trivial for respondents who answered Q243 in the 41-60 bucket.
- **Does not replace Q7 or Q243** — operates at a different level (COM salience vs. COM position thresholds). The three questions form a layered COM measurement stack: Q7 (early screen, COM position direction), Q243 (mid-game, COM position threshold), Q244 (targeted at ambiguous + nihilist cases, COM position + salience).

#### Open question for Sam

**Three-option limit:** The current design has 3 options. A 4th option, "It's unavoidable — all productive politics requires compromise eventually," would be a high-COM statement (COM pos 4.5+) with even stronger salience. But this overlaps heavily with `governance_failure`. If `governance_failure` is already providing COM pos 4.34, adding a stronger option would shift `governance_failure` to COM≈3.8 and the new option to COM≈4.8 — this gains granularity at the top end but weakens the primary nihilist discrimination (108/114 separation only needs the `dont_follow` option to work, independent of what happens at the top end). Add the 4th option only if harness runs show the 4.0–5.0 COM range is underprobed.

**Stage2 vs. screen20 placement:** Q7 is in screen20 (early, before first major thinning). Q244 could be moved to screen20 as well if COM salience is identified as an early-discriminating signal (e.g., if the harness shows 108 Passive Cynic is being consistently mis-classified by the engine before any COM question fires). The default is stage2 to avoid cluttering the early experience for respondents who don't need COM probing.

---

## [2026-05-19T09:00 — cycle 25 — SYNTHESIZE — new-questions.md]

### Top-5 ranking of Q240–Q244, implementation batching, and cross-question flags

**Scope:** Five new questions generated across cycles 3, 9, 13, 15, 21 (plus cycle 16 critique of Q242). None have been ranked against each other. This synthesis ranks them by implementation priority, surfaces cross-question interactions, and proposes a 3-batch implementation order for Sam.

---

#### Deduplication check

No true duplicates — each question probes a distinct signal:

| Q | Primary signal | Unique to this question? |
|---|---|---|
| Q240 | ONT_S pos + ZS pos (institutional capture frame) | Yes — no other question asks *causal attribution* for dysfunction |
| Q241 | MAT sal vs CD sal (primacy tiebreaker) | Yes — only mechanism for distinguishing economic-primary from culture-primary when Q103 shows both active |
| Q242 | ZS pos (negative partisanship) + COM pos (cross-pressure tolerance) | ZS overlaps Q240 for the MAGA persona (see flag below); COM partially overlaps Q244 |
| Q243 | COM pos via slider (threshold probe, anti-absorption) | Overlaps Q7 and Q244 on COM pos, but slider format is structurally distinct (see COM stack flag below) |
| Q244 | COM pos + **COM sal** (only COM salience write in bank) | The `dont_follow` → COM sal path exists nowhere else |

**No deletions needed.** All five survive deduplication. Two cross-question flags are documented below.

---

#### Ranking: highest-value → lowest-value

**#1 — Q241 `economic_vs_cultural_primacy`**

- **Gap closed:** Obama→Trump vs. Bernie-curious separation — the single most important Tier-A cross-pressured pair in HARNESS-HANDOFF §3. Named explicitly in §6.
- **Signal:** MAT sal vs CD sal (salience primacy, pure). Position-neutral — no interference with existing position probes.
- **Implementation risk:** LOW. No gate dependency. EIG naturally fires after Q103 shows both MAT and CD active. Single-choice, 4 options.
- **Uniqueness:** No other question in the bank produces a MAT/CD salience *ordering*. Q103 confirms both are active but gives no relative priority. Q241 fills exactly this gap.
- **Verdict:** Ship first. Closes the most structurally important gap with the cleanest implementation.

---

**#2 — Q240 `anti_establishment_frame`**

- **Gap closed:** Anti-establishment signal isolation. HARNESS-HANDOFF §6 names this as the top named gap: "distributed across PRO/ONT_S/ZS and undermeasured."
- **Signal:** ONT_S pos (institutional legitimacy) + ZS pos (elite-vs-people frame). The only direct causal-attribution probe in the bank.
- **Implementation risk:** LOW. No gate dependency. No eligibleIf required. Single-choice, 4 options.
- **Key discrimination pair:** MAGA all-in vs. Never-Trump Republican (both may answer Q201 similarly; Q240 separates them on ONT_S direction + ZS magnitude). Also: Abstain→Trump vs. disengaged centrist via ZS (4.11 vs. 2.65).
- **Uniqueness:** Q201 `proud_distrustful` also touches ONT_S but conflates patriotism with institutional trust. Q240 asks the causal question directly: *who or what is responsible?* The two questions are orthogonal; both are worth asking.
- **Verdict:** Ship with Q241 (same batch). Two independent questions, no dependencies.

---

**#3 — Q243 `legislative_compromise_threshold`**

- **Gap closed:** 021 Principled Cosmopolitan → 001 Rawlsian Reformer attractor collapse. Per CLAUDE.md: "Stage 4 attractor sharpening — HIGH priority." archetype-gaps.md Gap 1.
- **Signal:** COM pos via slider. Eliminates the Q7 `depends_on_issue` middle-bucket absorption problem by forcing degree (0–100) rather than category.
- **Implementation risk:** MEDIUM. Slider format requires sliderMap integration. Selector must recognize that Q243's EIG is highest specifically when Q7 produced `depends_on_issue` (COM posterior ambiguous at ~2.92). This conditional EIG behavior is correct automatically but should be verified against actual EIG scores in harness runs.
- **Key discrimination pair:** 021 Principled Cosmopolitan vs. 001 Rawlsian Reformer — 1.56-unit COM posterior gap (21-40 bucket → 2.22 vs. 61-80 bucket → 3.78). Also separates 114 Political Nihilist from 108 Passive Cynic as secondary use case.
- **Uniqueness:** Q7 (screen20) and Q244 (stage2) also touch COM. Q243 is not redundant — it specifically produces the position *threshold* probe that Q7 loses to middle-bucket absorption, and it produces COM pos rather than COM sal (unlike Q244).
- **Verdict:** Ship in Batch 2 with Q244 (they form a COM stack; test together).

---

**#4 — Q244 `compromise_rejection_valuation`**

- **Gap closed:** 108 Passive Cynic vs. 114 Political Nihilist discrimination. archetype-gaps.md Gap 2. The only mechanism in the bank for writing COM *salience* directly.
- **Signal:** COM pos + COM sal. The `dont_follow` option is structurally unique — it produces COM sal ≈ 0.52 (very low salience), distinguishing the passive/apathetic nihilist from the actively anti-compromise nihilist.
- **Implementation risk:** LOW. 3-option single_choice. No gate dependency.
- **Uniqueness:** Every other COM probe in the bank (Q7, Q243) writes COM pos only. Q244's `dont_follow` is the single option in the entire bank that can write very-low COM sal. Without it, 108 Passive Cynic always produces a mid-range COM pos from Q7/Q243 that's indistinguishable from a genuinely moderate respondent.
- **EIG timing:** Highest value after Q7 + Q243 have both fired and COM remains unresolved (posterior spread across 1–3). For high-COM respondents (Rawlsian Reformer, institutionalist), EIG will be low and the selector should skip it.
- **Verdict:** Ship with Q243 (Batch 2). Together they form a 3-layer COM stack: Q7 (direction, early), Q243 (threshold, stage2), Q244 (salience + ambiguity resolution, stage2).

---

**#5 — Q242 `party_alignment_self_assessment`**

- **Gap closed:** Cross-pressure self-awareness (HARNESS-HANDOFF §6). ZS negative-partisanship signal for MAGA voter; COM tolerance signal for Never-Trump R.
- **Signal post-critique (cycle 16):** ZS pos (reluctant_partisan only: E[ZS] ≈ 3.74) + COM pos (selective and reluctant_partisan). **All `moralCircle.scopedAffinities.ideological` writes removed** — party-platform fit is not ideological in-group moral concern, and averaging with Q229's national/religious scoped=95 would incorrectly suppress IDP excess for truly tribal voters.
- **Implementation risk:** MEDIUM-HIGH. Requires a `has_declared_party` gate predicate in the registry ("answered Q200 with dem/rep/ind_lean_d/ind_lean_r"). If the predicate doesn't exist, the question must rely on EIG fallback — which is functionally safe but semantically suboptimal (independent voters answering Q242 produce imprecise signal).
- **Key discrimination pair:** MAGA all-in `reluctant_partisan` (ZS 3.74 write) vs. Never-Trump Republican `selective` (COM 3.49 write). Signal also separates Bernie-curious from Lifelong D urban progressive on ideological comfort within the Democratic party.
- **Reduced scope note:** After removing the moralCircle writes, Q242's value dropped from "closes the partisan identity gap" to "provides ZS negative-partisanship signal unavailable elsewhere." That's still valuable — ZS for the MAGA persona would receive double coverage from Q240 (elite capture frame) and Q242 (enemy-defeat frame), which is two independent mechanisms for the same psychological dimension. But Q242 is no longer the gap-closer it was originally scoped to be.
- **Verdict:** Ship in Batch 3 after confirming `has_declared_party` predicate exists or adding it. Defer if gate implementation is costly.

---

#### Implementation batches

| Batch | Questions | Why together | Dependencies |
|---|---|---|---|
| **1** | Q241 + Q240 | Independent; both stage2; no gate dependencies; close the two highest-priority named gaps | None |
| **2** | Q243 + Q244 | Form a COM probe stack; each amplifies the other's signal when COM is unresolved after Q7 | None (but verify sliderMap integration for Q243) |
| **3** | Q242 | Requires `has_declared_party` gate predicate; lower priority after critique reduction | Confirm gate predicate in registry before shipping |

**Do not mix Batch 1 and Batch 2 into the same harness run** without first verifying that Q241 + Q240 don't shift COM-related archetype posteriors in ways that change Q243/Q244's EIG. They shouldn't (Q241 writes MAT/CD sal; Q240 writes ONT_S/ZS pos; neither touches COM), but confirming this is a 1-cycle harness check.

---

#### Cross-question flags (do not discard)

**Flag A — ZS double-write for MAGA persona**

Both Q240 and Q242 write ZS pos for the MAGA all-in persona:
- Q240 `elite_capture`: E[ZS] ≈ 4.11 (system is an elite-vs-people zero-sum contest)
- Q242 `reluctant_partisan`: E[ZS] ≈ 3.74 (I vote to defeat the enemy — negative partisanship)

These are two *different psychological mechanisms* that both produce high ZS (structural elite capture vs. partisan enemy-defeat framing). Writing ZS from both questions is not an evidence-map error — it reflects genuine dual-mechanism ZS loading in the MAGA voter. The posterior product will be ZS ≈ 4.5+ for a MAGA respondent who answers `elite_capture` + `reluctant_partisan`, which is appropriate (MAGA archetype candidates have ZS ≈ 4–5).

**Action:** No fix needed. Flag for harness monitoring: if ZS overshoots 5.0 (impossible — the scale is 1–5) or if non-MAGA personas receive spurious ZS amplification, investigate whether Q240 and Q242 are being asked to the wrong respondents.

---

**Flag B — COM 3-layer stack**

Q7 (screen20) + Q243 (stage2) + Q244 (stage2) all write COM pos. Q244 also writes COM sal. For respondents who see all three, the COM posterior will be heavily concentrated. The EIG selector should naturally reduce Q243 and Q244's priority after Q7 resolves COM clearly — but when Q7 produces `depends_on_issue` (COM posterior ≈ 2.92, ambiguous), both Q243 and Q244 will have high EIG simultaneously.

In the worst case, the selector asks all three COM questions sequentially to the same respondent (never-Trump Republican or Political Nihilist who answered Q7 ambiguously). This is technically correct behavior (three COM questions produce a sharper posterior than one), but may feel redundant to the respondent. Three COM questions in one quiz is borderline on the "one dimension per pass" principle.

**Action:** If harness shows all three COM questions firing for the same persona, add a soft gate: Q244 should only fire if Q243 was asked and produced a 41-60 bucket answer (ambiguous threshold). This keeps the COM stack from running all three on clearly-resolved COM respondents. Do not add this gate until harness confirms the problem is real — premature optimization.

---

#### What's missing from the new-questions pile (gaps not yet addressed)

For future GENERATE cycles, these gaps remain open after Q240–Q244:

1. **ENG/media channel** (HARNESS-HANDOFF §6) — which media a respondent consumes is a tribal signal. No question currently probes this. Low-risk: even a 4-option single_choice (cable news / podcasts / online-independent / mostly-not) would add signal.

2. **Authority-style calibration** (HARNESS-HANDOFF §6) — "statesman vs. fighter" is in AES, but the current probing may be miscalibrated. A direct "a leader who…" prompt with 2–3 style anchors could sharpen AES without touching the categorical distribution directly.

3. **IDP overlap question for LGBTQ Voter (#144)** — the gender excess path for the LGBTQ Voter routes through `gender` scope, but no question directly asks about in-group solidarity with the LGBTQ community as distinct from gender broadly. Q229's `ingroup_gender` item covers this only approximately. A more targeted probe (`ingroup_lgbtq` as distinct from `ingroup_gender`) would require scope-set expansion — which is an architectural change. Flag for architecture-thoughts.md.

