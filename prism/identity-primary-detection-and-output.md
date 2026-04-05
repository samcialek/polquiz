# Identity-Primary Detection & Output Logic

## Purpose
Turn the overlay concept into operational PRISM logic: how to detect, assign, and use identity-primary overlays.

---

## Activation Model: Three States (Not Binary)

Identity-primary is NOT a yes/no. It's a spectrum with three states:

| State | Meaning | Electoral behavior |
|---|---|---|
| **Latent** | Identity structure exists, low political activation | Abstention likely. Weak lean at best. Identity exists socially but doesn't drive voting. |
| **Active** | Identity is politically mobilized, affects choice | Reliable lean. Shows up. Coalition member. |
| **Dominant** | Identity is THE primary driver of electoral behavior | Highly sticky. Votes even against policy interest. Won't defect without threat inversion. |

**ENG mediates movement between states.** Same overlay, different ENG = different electoral behavior:
- Low-ENG LGBTQ overlay → latent. Mild preference, abstains if no salient champion.
- High-ENG LGBTQ overlay → dominant. Strong alignment, reliable turnout, movement-sensitive.

**There is no true N/A.** Even in historical periods previously marked N/A, the identity STRUCTURE may exist — it's just sub-threshold for electoral activation. Pre-Stonewall LGBTQ people had identity but zero political mobilization. Evangelicals in the 1940s had identity but were dormant. The overlay fit is there; the activation isn't.

This also means the 60-election mapping should be revised: replace crude "N/A" with "latent" where identity structure plausibly exists but electoral activation is below threshold.

---

## Step 1: Gate Check (Universal)

All identity-primary overlays share the same gate for ACTIVE or DOMINANT status.

### Gate thresholds
| Node | Threshold | Why |
|---|---|---|
| **TRB** | ≥ 4 (of 5) | Strong in-group orientation required |
| **PF** | ≥ 4 (of 5) | Politics must be fused with identity |
| **ENG** | ≥ 3 (of 5) | Activation threshold — converts identity fit into electoral behavior |

All three must fire for ACTIVE/DOMINANT assignment. But:
- TRB ≥ 3 + PF ≥ 3 + low ENG → LATENT overlay (identity fit exists, low activation)
- TRB ≥ 4 + PF ≥ 4 + ENG = 3 → ACTIVE
- TRB ≥ 4 + PF ≥ 4 + ENG ≥ 4 → DOMINANT

**ENG is not just another gate node — it's the activation/conversion factor.** It determines whether identity fit cashes out into turnout, abstention, weak lean, or strong alignment.

### Gate sources (which questions feed the gate)
- **TRB:** Q60 (identity ranking — primary TRB source), Q81 (partisan identity), plus any questions with TRB in their node signature
- **PF:** Q81 (partisan fusion — primary PF source), Q60 (identity centrality feeds PF), Q44 (views changed — light PF)
- **ENG:** Multiple questions feed engagement scores

### Non-assignment rule
Even if someone passes the gate, they get NO overlay if:
- Their identity attachment is diffuse (no single group dominates Q60 ranking)
- Their TRB/PF is purely partisan (team loyalty without identity content — "I'm a Democrat" without "I'm a Democrat BECAUSE I'm [identity]")
- Demographics contradict the identity claim (see Step 2)

This is the hardest edge case. A pure partisan tribalist (existing archetype: Partisan Tribalist, Tribal Loyalist, Loyal Democrat, Loyal Republican) has high TRB + PF but is NOT identity-primary. The difference: identity-primary voters have a specific identity ANCHOR for their tribalism. Pure partisans are tribal about the party itself.

**How to distinguish:** Q60 ranking. If someone ranks party/ideology highest and demographic identity low → pure partisan, no overlay. If someone ranks a demographic identity highest → overlay candidate.

---

## Step 2: Overlay Assignment

Once the gate fires, determine WHICH overlay based on Q60 ranking + demographics + supporting evidence.

### Q60: Politically Important Identities (Primary Signal)

Q60 asks respondents to rank which identities are most politically important to them. This is the primary overlay selector.

**Q60 → Overlay mapping:**

| Q60 top-ranked identity | Candidate overlay | Demographic check required |
|---|---|---|
| Race / racial identity | Black OR White Grievance | Yes — race determines which |
| Religion / faith community | Evangelical | Yes — denomination matters |
| Sexual orientation / LGBTQ identity | LGBTQ | Minimal — self-report is sufficient |
| Gender (as women / feminist) | Feminist | Yes — must be female-identified |
| Gender (as men / masculine) | Male Identitarian | Yes — must be male-identified |
| Ethnicity / national origin | None (dropped overlays) | — |
| Class / economic position | None (not identity-primary) | — |
| Party / ideology | None (pure partisan) | — |

### Demographic disambiguation

**Race → Black vs White Grievance:**
This is the most important split. Same Q60 answer ("race is my most important political identity"), opposite overlays.
- **Black overlay:** respondent identifies as Black/African-American
- **White Grievance overlay:** respondent identifies as white AND scores high on threat/loss indicators

The White Grievance overlay has an additional requirement beyond Q60: evidence of STATUS THREAT. A white person who says race is politically important but scores high on MOR (wide) and low on ZS is probably a white anti-racist, not a white grievance voter. The White Grievance gate needs:
- Q60 race = top identity
- White demographic
- ZS ≥ moderate (zero-sum worldview)
- CD ≥ moderate-high (traditional/preservationist)
- ONT_S low (system is broken)

**Religion → Evangelical specifically:**
- Q60 religion = top identity is necessary but not sufficient
- Denomination matters: evangelical/born-again Protestant → overlay. Catholic, mainline Protestant, Jewish, Muslim → no overlay (we dropped those)
- If denomination data unavailable: use EPS = traditionalist as supporting evidence (evangelicals skew hard traditionalist)

**Gender → Feminist vs Male Identitarian:**
- Q60 gender = top identity
- Female-identified → Feminist overlay candidate
- Male-identified → Male Identitarian overlay candidate
- Additional evidence: Feminist needs low CD (progressive) + wide MOR. Male Identitarian needs high ZS + high CD (traditional). Without these, it's just "gender matters to me" without identity-primary activation.

### Assignment confidence levels

| Evidence pattern | State | Confidence | Action |
|---|---|---|---|
| Full gate + Q60 top rank + demographics + supporting nodes | Dominant | High | Assign overlay, full output effects |
| Full gate + Q60 top rank + demographics + ambiguous support | Active | Medium | Assign overlay with qualifier |
| Partial gate (TRB/PF ≥ 3, low ENG) + Q60 top rank + demographics | Latent | Medium | Assign overlay as latent — "identity fit exists, low activation" |
| Q60 top rank + demographics don't match | — | Low | Do NOT assign overlay |
| Q60 moderate rank (not top) + everything else aligns | Latent | Low | Flag as possible latent overlay but don't assign |
| Gate fires but Q60 = party/ideology, not identity | — | None | No overlay — pure partisan |

### Mutual exclusivity
One overlay per person, maximum. If someone ranks BOTH race and gender at the top of Q60, use the higher-ranked one. If exactly tied, flag as ambiguous — don't force.

### Demographics: Necessary Disambiguator, Not Standalone Assigner

**Principle (locked):** No overlay from demographics alone. But some overlays cannot be validly assigned without demographics.

- Being Black does NOT automatically assign Black overlay
- Being male does NOT automatically assign Male Identitarian
- Being evangelical does NOT automatically assign Evangelical overlay

Demographics are used ONLY when the gate + thematic evidence already fire, and disambiguation is needed (Black vs White Grievance, Feminist vs Male Identitarian, Evangelical vs generic traditionalist).

### Three possible output states

| State | Meaning | When |
|---|---|---|
| **No overlay** | Person is not identity-primary | Gate doesn't fire, or Q60 points to party/ideology/class |
| **Resolved overlay** | Specific overlay assigned with confidence | Gate fires + Q60 + demographics disambiguate |
| **Unresolved identity-primary fit** | Identity-primary pattern detected but overlay undetermined | Gate fires + Q60 signals identity, but demographics unavailable or ambiguous |

The "unresolved" state is critical. It prevents hallucinating precision when the data doesn't support a specific overlay assignment. PRISM should say "you show strong identity-primary patterns, but we can't determine the specific identity anchor" rather than guessing.

---

## Step 3: Output Effects

Once an overlay is assigned, it modifies specific PRISM outputs. It does NOT change node scores or archetype classification.

### 3A: Election History Narrative

**Without overlay:**
> "As a Heritage Guardian, your political disposition has historically aligned with conservative coalitions that prioritize cultural continuity and tradition."

**With White Grievance overlay:**
> "As a Heritage Guardian with strong racial/cultural identity activation, your political disposition maps onto the trajectory of white identity voters: Democratic through the Solid South era, shifting Republican after the Civil Rights Act (1964), and fully activated under Trump. Your attachment to this coalition is driven more by identity protection than by policy agreement."

**With Evangelical overlay:**
> "As a Heritage Guardian whose political identity is anchored in evangelical faith community, your disposition maps onto the evangelical trajectory: politically dormant from the 1920s through the 1970s, then reactivated by the Moral Majority in 1980. Your bloc has stayed Republican even when the policy platform shifted dramatically under Trump — a sign that identity, not ideology, drives the attachment."

The overlay adds SPECIFICITY to the historical narrative without changing the archetype.

### 3B: World Map Layer

**Without overlay:**
> Standard geopolitical and structural affinity based on node signature.

**With overlay:**
> Additional identity-specific lens. E.g., Evangelical overlay adds: "You likely feel warmth toward regimes that honor Christianity in public life (Poland, Hungary) and hostility toward regimes that persecute Christians (China) or are structured around a competing religion (Iran). Interestingly, Islamic theocracies share your structural logic — religion in public life — but with opposite identity content."

Each overlay has its own world-map profile (already built in `identity-primary-world-map.md`).

### 3C: Coalition Alignment Story

The overlay explains WHY someone is in a coalition, not just THAT they are.

**Without overlay:**
> "Your node signature is consistent with the Republican coalition."

**With overlay:**
> "Your identity-primary attachment to [evangelical community / white cultural identity / masculine identity] is the binding agent. You would likely stay in this coalition even if the policy platform changed dramatically — because the attachment is to the group, not the platform."

### 3D: Activation-Dependent Behavior

| State | Turnout | Coalition stickiness | Defection risk |
|---|---|---|---|
| **Latent** | Low — abstains if no salient champion | Weak — lean exists but won't overcome apathy | High — not behaviorally committed |
| **Active** | Reliable | Moderate-high — votes coalition, shows up | Moderate — policy disappointment can erode |
| **Dominant** | Very high | Very high — votes coalition even against policy interest | Low — only threat inversion triggers defection |

### 3E: Stickiness / Volatility Indicator

Identity-primary voters (Active/Dominant) are STICKIER than ideological voters. The overlay should flag:
- "This person is unlikely to switch coalitions based on policy disagreement"
- "A party switch would require a threat-inversion event — the protecting coalition would have to become the threatening one"
- "The most likely defection scenario for [this overlay] is: [specific threat inversion]"

### 3F: Tension/Contradiction Callouts

When overlay and archetype create tension, name it:
- Evangelical + high PRO (process/rules) = tension with Trump's norm-breaking
- Black + low MAT = tension with Democratic economic platform
- White Grievance + high MOR (wide) = unusual combination, flag for review
- LGBTQ + high CD (traditional) = identity-ideology tension

---

## Step 4: Edge Cases & Ambiguity Rules

### 4A: When NOT to assign

| Scenario | Rule |
|---|---|
| Gate fires, Q60 = party/ideology | No overlay. Pure partisan. |
| Gate fires, Q60 = class/economic | No overlay. Material-interest voter, not identity-primary. |
| Gate fires, Q60 = diffuse (no single identity dominates) | No overlay. Tribalism exists but isn't identity-anchored. |
| Gate fires, Q60 = race, but white + wide MOR + low ZS | No overlay. Likely white anti-racist, not white grievance. |
| Gate fires, Q60 = religion, but Catholic/Jewish/Muslim | No overlay. We dropped those. |
| Gate fires, Q60 = gender, but no supporting node evidence | No overlay. Gender matters but not identity-PRIMARY. |

### 4B: Confidence thresholds for display

| Confidence | Display behavior |
|---|---|
| High | Show overlay prominently in results |
| Medium | Show overlay with qualifier ("Your results suggest identity-primary attachment to...") |
| Low | Don't show overlay. Insufficient evidence. |

### 4C: What if someone SHOULD get an overlay but doesn't pass the gate?

Example: A Black voter who scores moderate TRB (3/5) and moderate PF (3/5). They might be identity-primary in reality but the quiz didn't capture it strongly enough.

Rule: Don't assign. The gate exists to prevent false positives. It's better to miss some identity-primary voters than to falsely label ideological voters as identity-primary. The cost of a false positive (telling someone "your politics is about your identity, not your ideas") is higher than the cost of a false negative (not flagging their identity attachment).

### 4D: Overlay without archetype tension

Most cases: overlay and archetype will be consistent (e.g., White Grievance + Heritage Guardian). But sometimes they'll be surprising (e.g., Black + Heritage Guardian — a culturally conservative Black voter whose primary political identity is racial solidarity). These surprising combinations are FEATURES, not bugs — they reveal the complexity of real political identity.

---

## Voter Activation Model

Voting is not "best fit always votes." Three separable components determine electoral behavior:

### The Three Layers

| Layer | Type | What it captures |
|---|---|---|
| **A. Overlay/archetype fit** | Stable trait | Person's ideological + identity structure. Doesn't change per election |
| **B. Election-specific activation** | State variable | How much THIS candidate/election speaks to that structure. Varies per election |
| **C. Baseline engagement (ENG)** | Stable trait | General political activation propensity. How likely to convert preference into action |

### Decision Rule

For a given election:

1. **Compute candidate activation scores** — for each candidate, how much do they activate this person's overlay/archetype? (Function of fit + election-specific factors: rhetoric, threat, policy salience, identity entrepreneur effects)

2. **Threshold check:** Does the top candidate's score clear `threshold(ENG)`?
   - Low ENG = high threshold (need a LOT of activation to bother voting)
   - High ENG = low threshold (votes in almost every election)
   - If NO candidate clears → **abstain**

3. **Margin check:** Does the top candidate beat the runner-up by a minimum margin?
   - If both candidates are weak (barely clearing threshold) or very close → **abstain**
   - Prevents forced turnout when both options are bad

4. **If both conditions met → vote for top candidate**

### Three Real Outcomes

| Outcome | When |
|---|---|
| **Vote** | Top candidate clears threshold AND beats runner-up by margin |
| **Abstain (nobody clears)** | No candidate activates this person enough given their ENG |
| **Abstain (too close)** | Candidates are too similar or both too weak — preference exists but not enough to act |

### Why This Matters

- **Same overlay, different ENG, different behavior:** A low-ENG Black voter might abstain in a boring midterm. A high-ENG Black voter with identical fit votes every time.
- **Same overlay, different election, different activation:** The Evangelical overlay is maximally activated in 2004 (gay marriage bans on ballot) and minimally activated in 1996 (no identity-salient issue).
- **Abstention is identity-consistent:** An LGBTQ voter who abstains when neither candidate is clearly pro-LGBTQ is still an LGBTQ overlay voter — they just didn't get activated this cycle.
- **Historical latency explained:** Evangelical dormancy (1928-1976) = the identity structure existed but election-specific activation was near zero for decades. No candidate spoke to it. Falwell + Reagan finally produced enough activation to cross the threshold.

### Formal Expression (Pseudocode)

```
for each candidate c in election:
    activation[c] = f(overlay_fit, candidate_rhetoric, threat_level, policy_salience)

top = max(activation)
runner_up = second_max(activation)
threshold = g(ENG)  // decreasing function: high ENG → low threshold

if top.score < threshold:
    return ABSTAIN  // nobody clears

if (top.score - runner_up.score) < margin_minimum:
    return ABSTAIN  // too close / both weak

return VOTE(top.candidate)
```

### Open Design Questions (for code phase)
- What's the functional form of `threshold(ENG)`? Linear? Step function?
- What's the margin minimum? Fixed or ENG-dependent?
- How do you compute election-specific activation? (Requires per-election candidate profiles — big data requirement)
- Does third-party candidacy affect the margin check?

---

## Implementation Priority

1. **Q60 must be preserved and enriched** — it's the primary overlay selector. The rank-weighted scoring already approved (PF + TRB primary) feeds directly into overlay detection.
2. **Demographics question needed** — PRISM currently may not ask race/ethnicity/denomination directly. If not, overlay assignment for Black/White Grievance/Evangelical becomes impossible without it. This is a design decision: ask demographics, or infer from Q60 + supporting nodes only?
3. **Gate computation** — straightforward: check TRB ≥ 4, PF ≥ 4, ENG ≥ 3 after quiz scoring.
4. **Output templates** — write identity-specific narrative templates for each overlay × output section.
5. **Confidence scoring** — implement the evidence-stacking logic for assignment confidence.

### Open question for Sam
**Does PRISM currently collect demographics (race, gender, religion)?**
- If yes → overlay assignment is straightforward
- If no → need to decide: add demographics questions, or rely on Q60 self-report + node inference only?

This is the single biggest implementation dependency.
