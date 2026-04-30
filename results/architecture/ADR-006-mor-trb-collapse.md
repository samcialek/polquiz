# ADR-006: MOR / TRB / PF Collapse into Compound Moral-Circle Module

**Status:** Proposed (2026-04-29). Pending implementation.
**Supersedes:** Partial supersession of ADR-005 — PF and TRB no longer remain SELF activation-only nodes after cutover. ENG remains the only pure SELF activation node.
**Superseded by:** —
**Related:** ADR-002 (ENG migration), ADR-005 (SELF-cluster collapse).

## Context

The current node ontology has four separate fields that all try to describe the structure of a respondent's moral and identity-political circle:

| current node | type | what it tries to capture |
|---|---|---|
| `MOR` (Moral Circle) | continuous 1-5 | breadth: parochial → universalist |
| `TRB` (Tribalism) | continuous 1-5 (post-ADR-005, pos-only) | how identity-fused / us-vs-them |
| `TRB_ANCHOR` | categorical distribution over 9 anchors | which identity category the tribalism attaches to |
| `PF` (Partisan Fusion) | continuous 1-5 (post-ADR-005, pos-only) | how strongly party/team identity fuses with self |

This four-field design has four failure modes:

**1. The continuous MOR scale is structurally lossy.** Moral concern in real life isn't a slider from "parochial" to "universalist." It's identity-bounded: a person cares about co-kin, or co-religionists, or co-class, or fellow citizens, or humanity-as-such. Treating these as positions 1-5 forces national-civic moral concern to land at MOR≈3 — but a national-civic-anchored person isn't halfway between parochial and universalist.

**2. Salience and tribalism are routinely conflated.** The current TRB scalar reads simultaneously as "how identity-organized are your politics" and "how exclusionary toward out-groups." But these come apart: an effective altruist with intense universalist commitment has high moral activation and is not tribal. A Catholic universalist with religious identity but broad moral concern is religiously anchored but inclusive.

**3. Demographic membership is named but not collected.** TRB_ANCHOR can register that "race is central to your politics," but the engine never asks which race. The identity-primary resolver tier (archetypes 141-146) was designed to fire on this kind of match but is functionally inert because the demographic-input mechanism doesn't exist.

**4. PF is stranded as an unanchored intensity node.** PF measures "how much politics is part of who I am" but doesn't attach to *which* in-group. Two people with PF=5 might be fused to opposite teams; the engine sees identical activation. After ADR-005 collapsed PF to position-only, the field carries the magnitude of partisan fusion but loses the object — exactly the same ambiguity TRB_ANCHOR was supposed to solve for tribalism. Party identity belongs in the moral-circle module as one of the boundaries, not as a separate intensity node.

The form-vs-valence problem made concrete: PR 5.F-A's diagnostic showed Sam's authentic Inst Leftist posterior aligns with Orbán's Hungary at -0.44 — meaningfully negative but missing the strong-negative threshold by 0.06. Sam (institutional respect, ONT_S~4.5) and Orbán (institutional capture, ONT_S=4) score the same on form. Most of the residual gap traces to MOR being unable to distinguish "national civic universalism" (Sam) from "national ethnic exclusion" (Orbán) — same MOR scalar, opposite political content.

The categorical-collapse direction was discussed at length across the conversation that followed Sam's three retake dumps (2026-04-29, conversation `22eb1296...`) and the architectural exchange with a separate LLM. Two earlier drafts of this ADR were rejected: one used a normalized-simplex framing (Model A) that couldn't represent universalism cleanly; one omitted PF and left partisan fusion stranded. This third revision absorbs both fixes.

## Decision

Replace `MOR` (continuous), `TRB` (continuous), `TRB_ANCHOR` (categorical), and `PF` (continuous, post-ADR-005 pos-only) with a **compound moral-circle module**: seven independent boundary scores + a single intensity scalar + optional self-reported membership.

This is structurally richer than the pre-collapse four fields combined. **Visible "node count" goes from 14 → 12** if we treat the module as one node, but the module itself contains internal substructure that the prior architecture did not. Only `ENG` remains as a SELF-cluster activation-only node post-cutover.

### Module shape

```
// Compound module — boundaries and intensity nested inside one field.
// (See src/types.ts MorBoundariesNodeState / ArchetypeMorBoundaries.)
respondentState.morBoundaries = {
  boundaries: {
    national:        0..1,    // independent boundedness scores
    ethnic_racial:   0..1,
    religious:       0..1,
    class:           0..1,
    ideological:     0..1,
    gender:          0..1,    // folds gender + sexual_orientation politics
    political_tribe: 0..1,    // party / camp / movement / candidate-faction loyalty
  },
  intensity: 0..3,            // how activated moral-circle concern is in
                              // political judgment (real-valued, not integer)
  touches: { ... },
  touchTypes: Set<string>,
  status: NodeStatus,
}

respondentState.morMembership = {       // optional self-reported group membership
  ethnic_racial?: string,               // null/decline-to-state allowed on each
  religious?: string,
  class?: string,
  gender?: string,
  political_tribe?: "D" | "R" | "independent" | "third" | "none" | string,
}
```

Throughout this ADR, formula shorthand like `morIntensity` and `boundaries[C]`
refers to `morBoundaries.intensity` and `morBoundaries.boundaries[C]`
respectively. Same for archetype-side: `arch.morBoundaries.intensity` and
`arch.morBoundaries.boundaries[i]`.

Boundaries do **not** sum to 1.0. Each score independently asks "how much does this category structure your moral and political loyalties?" — answered without forced trade-off against the others.

**Important on `political_tribe` membership labels.** `"independent"` and `"none"` are party-ID labels, not inherently high-activation tribes. They tell you *which* party slot the respondent occupies (or doesn't); they do not tell you *how strongly* party-team identity activates them. The strength signal — what populates the `political_tribe` boundary score — comes from PF position, Q97-style partisan-fusion probes, Q211 strategic-voting behavior, and Q212 negative-party identification. So `morMembership.political_tribe = "independent"` paired with high `morBoundaries.political_tribe` is coherent (an independent who fiercely identifies with the third-party / anti-establishment camp); the membership label and the activation level are independent fields.

### Why ideological and political_tribe are both in, and how they differ

This is the load-bearing distinction that justifies adding `political_tribe` rather than letting PF feed only intensity:

- **ideological** = "people who share my ideas, principles, values are my side." A high-ideological respondent feels in-group with anyone who agrees on policy, regardless of party label. Post-2024 Bernie-curious independents who vote third-party in protest are high-ideological, low-political_tribe.
- **political_tribe** = "my party, camp, movement, or candidate faction is my side." A high-political_tribe respondent feels in-group with their party/team specifically, sometimes ahead of pure ideological agreement. Strong-D loyalists who vote D even when a third-party candidate is closer to their values are high-political_tribe, possibly moderate-ideological.

These are correlated but genuinely distinct. A person can be highly ideological but weakly partisan, or strongly party-fused with thin ideology. The PR5 strategic-vote rerouting logic in `respondentVoteChoice.ts` already implicitly distinguishes these (the "ballot vs values" split) — `political_tribe` makes the distinction explicit at the data-model level.

### What the module captures

| profile | boundaries | intensity | reads as |
|---|---|---|---|
| Universalist (EA, secular humanist) | all near 0 | high (2.5+) | active universalism — moral concern generalized outward, not sorted by category |
| Indifference / low political activation | all near 0 | low (~1) | politically low-moral-activation, no in-group structure |
| Single-anchor identity politics | one near 1, rest low | high | concentrated tribalism (e.g., racial, religious, class-war) |
| Multi-anchor (Catholic working-class) | two near 1, rest low | high | broad identity politics across multiple axes |
| Faction-fused voter | political_tribe near 1, others low | high | loyal to a party, movement, candidate faction, or camp |
| Ideological non-partisan | ideological near 1, political_tribe near 0 | high | strong values, weak team attachment |
| Mixed centrist | three or four moderate | moderate | partial activation across several frames |

### Why national is implicit, not asked

The quiz assumes US for all respondents. National identity is a fixed background, not a per-user variable. The `national` boundary score still varies — it captures "how much does being-American structure your political identity" — but the *which-nation* membership is not collected.

### Why ideological has no demographic ask

The rest of the quiz is the ideological measurement. Asking "which political ideology do you identify with?" duplicates the work the substantive nodes already do.

### Why political_tribe membership is sourced from Q200, not a new demographic question

Q200 already collects party identification as part of the live quiz. Q211 (strategic voting behavior) and Q212 (negative party identification) inform how strongly that party identity should weight. No new demographic question needed; the data is already collected. PR 6.F connects existing party-ID metadata to `morMembership.political_tribe` and wires Q97-style partisan-fusion probes to update the `political_tribe` boundary score.

### Demographic membership data collection

| boundary | membership source | demographic ask? |
|---|---|---|
| national | implicit (US) | no |
| ethnic_racial | direct ask near end of quiz | **yes** |
| religious | direct ask | **yes** |
| class | direct ask (origin class, not policy preference) | **yes** |
| ideological | derived from rest of quiz | no |
| gender | direct ask | **yes** |
| political_tribe | Q200 / party-ID metadata (already collected) | no |

So **4 demographic membership questions** are net-new (ethnic_racial, religious, class, gender), asked near the end with explicit decline-to-state. political_tribe comes from existing party-ID flow.

### Engine math

#### Derived measures (display-only, not in distance)

```
boundaryLoad = max(boundaries[i] for i in 1..7)
   // or, slightly more cumulative for v2 if multi-anchor activation needs
   // sharper detection: min(1, sqrt(Σ b_i²))

universalismScore = morIntensity × (1 − boundaryLoad)    // 0..3 scale
boundednessScore  = morIntensity × boundaryLoad          // 0..3 scale

// optional secondary descriptor for narrow-vs-multi-anchor distinction:
boundaryConcentration = HHI applied to active boundaries
                        (those above 0.2 threshold), or 0 if all inactive
```

A respondent with all 7 boundaries near 0.0 + intensity=2.5 → universalismScore=2.5, boundednessScore=0. Direct universalism encoding.

A respondent with all 7 near 0.0 + intensity=0.2 → both scores low. Indifference case.

A respondent with one boundary at 0.9 + intensity=2.5 → boundednessScore=2.25. Concentrated, near-fully-bounded.

Tribalism is **not** a primary metric in v1. Use `boundednessScore` instead. The legacy term "tribalism" can be retained as a display alias.

#### Archetype matching distance

Vector distance over the 7 boundaries plus an intensity-difference term, both scaled to [0, 1]:

```
boundaryDist  = sqrt(Σ (resp.boundaries[i] − arch.boundaries[i])² / 7)
intensityDist = |resp.intensity − arch.intensity| / 3
morModuleDist = 0.7 × boundaryDist + 0.3 × intensityDist
```

The outer scorer applies the standard salience-weighted multiplier pattern from `archetypeDistance.ts`, with weight derived from `arch.intensity` and `resp.intensity` directly (not double-counting intensity inside the boundary-distance sum).

#### Candidate / regime matching distance — Layer 1 (mirror)

Candidates and regimes get **full 7-boundary vectors**, not single dominant buckets. Universalist or low-partisan candidates/regimes can be coded directly without an artificial "universal" target bucket.

```
politicalDist = sqrt(Σ (resp.boundaries[i] − target.boundaries[i])² / 7)
```

A simple single-anchor candidate has one boundary near 1.0, others low. A multi-anchor candidate has multiple elevated. A universalist candidate has all near 0. A pure-partisan candidate (party-loyalty appeal with thin ideology) has political_tribe high, others moderate-low.

#### Candidate matching distance — Layer 2 (membership lock-and-key)

For candidate matching only (not regimes — see Alternatives §). Smooth proportional, no thresholds. Matches reduce distance, mismatches increase distance, normalized by intensity:

```
membership_delta = 0
for each category C in [ethnic_racial, religious, class, gender]:    // 4 categories, NOT political_tribe — see warning below
  if resp.membership[C] && candidate.membership[C]:
    activation = (resp.morIntensity / 3) × resp.boundaries[C]
    weight     = W × activation
    if resp.membership[C] == candidate.membership[C]:
      membership_delta -= weight   // match: reduces distance
    else:
      membership_delta += weight   // mismatch: adds distance

adjustedCandidateDist = max(0, politicalDist + membership_delta)
```

Starting `W = 1.0`. Per-category swing bounded by W; total Layer 2 swing across 4 categories bounded by ±4W (open knob — see "Layer 2 aggregate cap").

**`political_tribe` is included in Layer 1 vector distance but excluded from Layer 2 in v1.** See the partisan double-counting warning below.

### Warning: do not double-count partisanship

The election pipeline already has party-ID / partisan-loyalty machinery — the strategic-vote rerouting in `respondentVoteChoice.ts`, the per-candidate party multiplier, and the abstain logic in `engagementLabel.ts`. If `political_tribe` membership lock-and-key fires in Layer 2 *and* the existing partisan multiplier also fires, party loyalty gets counted twice for the same respondent-candidate pairing.

**Two paths:**

- **Long-term preferred:** migrate the existing partisan multiplier into Layer 2 of the MOR module. Party loyalty becomes `political_tribe` lock-and-key, and `respondentVoteChoice.ts` reads from there instead of computing it separately. Single source of truth.
- **Safer v1 (this ADR):** include `political_tribe` in Layer 1 vector distance only. Exclude it from Layer 2 membership. Existing partisan multiplier stays in place. Defer the migration to a follow-up PR.

This ADR adopts the safer v1. PR 6.E is a tight enough refactor as written; folding in the election-pipeline migration would expand it significantly. The migration is logged as a follow-up.

### Question design

**Per-boundary independent Likerts.** No forced-rank distributions. Each question targets one boundary directly:

| boundary | example question | source |
|---|---|---|
| national | "How much does your sense of being American shape your political loyalties?" | new |
| ethnic_racial | "How much does ethnicity or race factor into how you think about politics?" | new |
| religious | "How much does your religious or spiritual identity shape your political views?" | new |
| class | "How much does your class background shape how you see politics?" | new |
| ideological | "How much do your political/ideological commitments form your sense of in-group?" | new (or rewire from Q97-class) |
| gender | "How much does your gender or sexual identity shape your political views?" | new |
| political_tribe | "How much does belonging to your political party / camp shape who you trust and identify with?" | new + Q97-style partisan-fusion probes rewired |

Each Likert response maps to a 0-1 boundary score via Bayesian-style smooth update (existing convex-mix update primitive applies).

Existing TRB/MOR/PF questions get rewired:
- **Q35, Q60, Q63, Q102, Q213** → boundary-score updates instead of continuous-position updates
- **Q97-style partisan-fusion probes (PF position)** → `political_tribe` boundary updates
- **Q200 (party-ID)** → populates `morMembership.political_tribe`
- **Q211, Q212 (strategic voting, negative parties)** → can inform `political_tribe` boundary score weighting

**4 net-new demographic membership questions** at the end of the quiz with decline-to-state on each (ethnic_racial, religious, class, gender). political_tribe membership is from Q200, no new ask.

### Identity-primary tier dissolution — gated

Archetypes 141-146 currently get matched via `src/identity/resolveIdentityPrimary.ts`. Under MOR_BOUNDARIES they become re-encodable as regular tier-1 archetypes:

```
Feminist Voter        → gender=0.9, ideological=0.4, political_tribe=0.5, others=0.1, intensity=high
White Grievance Voter → ethnic_racial=0.9, national=0.6, political_tribe=0.6, others=0.1, intensity=very high
Evangelical Voter     → religious=0.8, national=0.5, political_tribe=0.5, others=0.1, intensity=high
... etc.
```

Removing the resolver in the same PR as the re-encoding is high blast radius. Staged sequence:

1. **PR 6.G** — re-encode 141-146 with MOR_BOUNDARIES + intensity. Keep `resolveIdentityPrimary.ts` running unchanged.
2. **PR 6.H** — re-baseline persona-replay. Validate that 141-146 still match correctly via pure geometry.
3. **Only if validation passes** — separate small follow-up PR (6.I) removes `resolveIdentityPrimary.ts`.
4. **If validation fails** — keep resolver, OR refine MOR_BOUNDARIES encoding of 141-146 until geometry suffices.

### Re-encoding rubric for 121 archetypes

Per Sam's directive: **ignore archetype names**; encode from the signature.

For each archetype:

1. **Read off existing TRB_ANCHOR distribution** if explicitly set; map to the new 7-boundary form (collapse old 9 anchors: gender + sexual → gender; global → all-low signal; mixed_none → all-low + low intensity).

2. **PF migration to political_tribe boundary**:
   ```
   political_tribe = (oldPF.pos − 1) / 4
   ```
   So old PF.pos=1 → political_tribe=0 (no party fusion), old PF.pos=5 → political_tribe=1 (max party fusion).

3. **Default unset boundaries**: derive from other signature nodes:
   - High CD-traditional + high CU-uniformity → boost national + ethnic_racial + religious
   - Low MAT + high CD-progressive → boost class + ideological
   - High PF + low TRB_ANCHOR specificity → boost political_tribe (party-organized but not anchored to demographic identity)
   - Low TRB / spread distribution → all boundaries low (universalism if intensity high; indifference if low)

4. **MOR_INTENSITY (0-3, real-valued)**: derive from old `MOR.sal` combined with old `TRB.pos` and old `PF.pos` (TRB.sal and PF.sal no longer exist post-ADR-005):
   ```
   intensity = max(
     oldMOR.sal,
     (oldTRB.pos − 1) × 0.75,
     (oldPF.pos − 1) × 0.75
   )
   ```
   So high-intensity universalists with activated TRB or PF but low-salience old-MOR are preserved.

5. **No MOR_MEMBERSHIP fields on archetypes**: archetypes are abstract political shapes only.

6. **No `antiCats` field**: MOR_BOUNDARIES does not use anti-categories in v1.

The rubric output:

```ts
morBoundaries: {
  national: number,         // 0..1
  ethnic_racial: number,    // 0..1
  religious: number,        // 0..1
  class: number,            // 0..1
  ideological: number,      // 0..1
  gender: number,           // 0..1
  political_tribe: number,  // 0..1
},
morIntensity: number        // 0..3, real-valued (not integer-stepped)
```

Old `MOR.pos`, `MOR.sal`, `MOR.anti`, `TRB.pos`, `TRB.anti`, `PF.pos`, `TRB_ANCHOR` distribution kept in archetype data initially — actual removal happens in the engine cutover PR (6.E).

### Candidate codification (all historical candidate profiles)

This is **net-new work** introduced by Layer 2. Across `src/historical/candidates.ts` and the per-era `src/historical/elections-*.ts` files, there are roughly 140 candidate-election profiles spanning 60 elections. Every profile gets:

**Political-coalition boundary vector** (Layer 1 mirror — full 7-vector):

```
Wallace 1968   → ethnic_racial=0.85, national=0.6, religious=0.3, political_tribe=0.7,
                 others=0.1, intensity=very high
Obama 2008     → national=0.5, ideological=0.4, political_tribe=0.4, others=0.2, intensity=mod-high
Bernie 2016    → class=0.8, ideological=0.7, political_tribe=0.3, others=0.1, intensity=high
                 // high ideological, lower political_tribe — anti-establishment posture
Trump          → national=0.85, ethnic_racial=0.6, political_tribe=0.85, others=0.15, intensity=high
                 // strong party-team fusion in addition to ethno-national appeal
JFK            → national=0.5, religious=0.5, ideological=0.4, political_tribe=0.5, others=0.2, intensity=mod-high
Reagan         → national=0.7, religious=0.5, ideological=0.5, political_tribe=0.6, others=0.15, intensity=high
... etc.
```

**Demographic membership** (Layer 2 lock-and-key — 4 fields):

```
ethnic_racial: white | Black | Hispanic | Asian | mixed | (decline)
religious:     Protestant | Catholic | Jewish | Mormon | secular | (decline)
class:         working | middle | upper-middle | upper | (decline)
gender:        male | female | nonbinary | (decline)
```

**Party / camp membership** (Layer 1 metadata — already in candidates.ts in some form):

```
political_tribe: "D" | "R" | "independent" | "third" | string (e.g., "Whig", "Federalist")
```

For ambiguous cases (Lincoln's specific religion, FDR's class origin), use `null` rather than guess.

### Regime codification (~401 historical regime periods)

Every entry in `src/global/jurisdictions-*.ts` gets a `morBoundaries` 7-vector and `morIntensity` scalar. Regimes do **not** get demographic membership fields.

```
Folkhem Peak Sweden    → boundaries=[national:0.4, ethnic:0.1, religious:0.05, class:0.6,
                                      ideological:0.4, gender:0.15, political_tribe:0.5], intensity=2.5
                                      // Social-Democratic dominance but pluralist-parliamentary
Nazi Germany           → boundaries=[national:0.9, ethnic:0.95, religious:0.3, class:0.2,
                                      ideological:0.6, gender:0.2, political_tribe:0.95], intensity=3.0
                                      // single-party total state across multiple bounded axes
Modern Switzerland     → boundaries=[national:0.4, ethnic:0.15, religious:0.1, class:0.2,
                                      ideological:0.2, gender:0.1, political_tribe:0.15], intensity=1.5
                                      // multi-party magic-formula consensus, low partisan-team fusion
Maoist China (Radical) → boundaries=[national:0.3, ethnic:0.2, religious:0.05, class:0.85,
                                      ideological:0.95, gender:0.2, political_tribe:0.95], intensity=3.0
```

Goes in PR 6.D alongside candidate codification.

### Migration policy for old dumps

**Hard cutover.** Old dumps with continuous MOR/TRB/PF and 9-bucket TRB_ANCHOR distribution are not retroactively translated. The three retake dumps (`prism-dump-0cb89086`, `prism-dump-720f5027`, `prism-dump-4901f789`) need to be re-taken on the new engine.

The dump validator (`scripts/validate-dump.cjs`) gains a schema-version check; pre-refactor dumps fail validation against post-refactor engine.

## Open knobs

| knob | initial value | tuning location |
|---|---|---|
| `W` (Layer 2 per-category membership weight) | 1.0 | PR 6.H re-baseline |
| Layer 2 aggregate cap (max total membership swing across 4 categories) | none in v1 — total range is ±4W with W=1.0 → ±4 distance units | flag for 6.H tuning; cap at ±2W if calibration shows membership over-dominating |
| boundaryLoad formula | `max(boundaries)` | swap to `min(1, sqrt(Σ b²))` if multi-anchor activation needs sharper handling |
| boundaryDist / intensityDist split (currently 70/30) | 0.7 / 0.3 | PR 6.H |
| Demographic question UX | salience-gated with always-decline available | PR 6.F |
| Identity-primary resolver removal timing | gated behind PR 6.H validation | PR 6.I (follow-up) |
| Existing partisan multiplier in `respondentVoteChoice.ts` | retained in v1 (avoids double-counting with Layer 2) | follow-up PR for migration into Layer 2 |

## Rollout sequence

Sequencing principle: **archetype data and engine code change atomically with respect to old fields.** PR 6.C and 6.D add new fields alongside old ones; PR 6.E does the engine cutover AND removes old fields atomically.

| PR | scope | effort | dependencies |
|---|---|---|---|
| **6.A** ADR-006 (this) | Architectural lock | ~1 day | TRB_ANCHOR drift fix shipped (commit `948fe05`) |
| **6.B** Type system | `src/types.ts`, `src/engine/math.ts`, `src/config/categories.ts`. Add `morBoundaries` (7-field), `morIntensity`, `morMembership` (5-field including political_tribe) to RespondentState and Archetype as **additive** alongside existing MOR/TRB/TRB_ANCHOR/PF. Mark old fields `@deprecated` in TSDoc. Pure schema; no runtime behavior change. | ~1 day | 6.A |
| **6.C** Re-encode 121 archetypes (additive) | Mechanical pass per rubric. Add `morBoundaries` (7) and `morIntensity` to every archetype. Apply `political_tribe = (PF.pos − 1) / 4` migration. Keep old MOR/TRB/TRB_ANCHOR/PF fields populated. | ~1.5-2 days | 6.B |
| **6.D** Codify candidates + regimes (additive) | All ~140 candidate profiles get 7-vector `morBoundaries` + `morIntensity` + 4-field `morMembership` + `political_tribe` party label. All ~401 regime entries get 7-vector + intensity (no membership). Old MOR/TRB/PF fields kept. | ~1.5-2 days | 6.B |
| **6.E** Engine cutover (atomic field removal) | `src/engine/update.ts` boundary-score update primitive (handles all 7 boundaries); `src/engine/archetypeDistance.ts` morModuleDist computation (7-dim); `src/historical/respondentVoteChoice.ts` candidate distance = mirror (Layer 1 includes political_tribe in vector) + Layer 2 lock-and-key (4 categories, NOT political_tribe — existing partisan multiplier retained). `src/global/build-alignment.ts` regime distance = Layer 1 only. **In this same PR**: remove old MOR/TRB/TRB_ANCHOR/PF fields from all archetype/candidate/regime data. | ~2.5-3 days | 6.B, 6.C, 6.D |
| **6.F** Question bank rewiring + new demographic questions | Q35, Q60, Q63, Q102, Q213 evidence maps remap to MOR_BOUNDARIES; Q97-style PF probes rewire to `political_tribe` boundary updates; Q200 connects to `morMembership.political_tribe`; Q211/Q212 inform political_tribe boundary weight; 7 new boundary-direct probes (one per boundary); 4 new demographic membership questions. | ~2 days | 6.B, 6.E |
| **6.G** UI + identity-primary archetype encoding-validation prep | 141-146 already re-encoded in 6.C; resolver still active in parallel; update `quiz-v2-live.html` and `results-live.html` for any direct MOR/TRB/PF display. | ~1 day | 6.E |
| **6.H** Persona-replay re-baseline + validation | Old baseline INVALIDATED. Establish new floor. Run retake topics through new engine. Validate 141-146 still match correctly (gates 6.I). Validate political_tribe Layer 1 doesn't perturb existing partisan multiplier behavior excessively. Tune `W` and Layer 2 aggregate cap. Update CLAUDE.md. | ~1 day | all above |
| **6.I** (follow-up, gated on 6.H validation) | Remove `resolveIdentityPrimary.ts`. Geometric matching alone now handles 141-146. | ~half day | 6.H validation pass |

**Total: ~10-12 days of careful work.**

Why the additive-then-cutover pattern: keeps every PR independently buildable. After 6.C and 6.D, archetypes/candidates/regimes have both old fields (engine compatibility) and new fields (sitting unused). PR 6.E is the breaking change — engine and data flip together in one reviewable diff.

## Risks and mitigations

| risk | severity | mitigation |
|---|---|---|
| Re-encoding 121 archetypes is judgmental and prone to inconsistency | high | Lock rubric in 6.A; mechanical first pass; holistic refinement deferred |
| Persona-replay baseline invalidates; cannot regression-test against old | medium | 6.H establishes new floor, not preserves old |
| Question-bank rewiring touches many evidence maps | medium | PR 6.F does it incrementally per question family |
| ~140 candidate boundary-vector codification consistency drift | medium | Rubric in 6.D; consistency-check script before commit |
| Backward compat for old dumps | low | Hard cutover + validator schema-version check |
| Demographic question UX may feel intrusive | medium | Decline-to-state on every demographic question; salience-gating; explicit privacy note |
| W (Layer 2 weight) may need significant tuning | low | Smooth proportional avoids cliffs; W=1.0 conservative; max per-category swing is W |
| 141-146 archetypes may not match correctly under pure geometry | medium | Gated dissolution (PR 6.I depends on 6.H validation); resolver stays as fallback |
| **Partisan double-counting** (political_tribe Layer 1 + existing partisan multiplier) | medium | Layer 2 excludes political_tribe in v1; existing multiplier stays; long-term migration logged as follow-up. 6.H validates election outcomes don't shift unexpectedly. |
| Multi-anchor users not cleanly distinguishable in display | low | Optional `boundaryConcentration` HHI descriptor available |

## Alternatives considered

**Alt 1 — Keep continuous MOR + add MOR_BOUNDARIES alongside.** Rejected: leaves lossy continuous MOR; doubles encoding burden; doesn't solve salience-vs-tribalism conflation.

**Alt 2 — Add explicit TRB_VALENCE field.** Rejected: 6 dimensions in the SELF+morality region instead of a compound module; bureaucratizes a region with one underlying object.

**Alt 3 — Model A: Normalized 6-bucket simplex (mirrors EPS/AES).** Rejected: forces every respondent to attribute mass somewhere; can't represent "low across all"; universalism gets coerced into uniform-distribution workaround that conflates "everything matters equally" with "no boundaries should matter much."

**Alt 4 — Single-bucket lock-and-key for candidates (target picks one category).** Rejected: high-intensity universalists end up far from every candidate; multi-anchor candidates can't be coded; vector-to-vector is more accurate.

**Alt 5 — Membership lock-and-key with threshold + binary fire.** Rejected: threshold creates a cliff; smooth proportional with `intensity / 3` normalization auto-gates without thresholds.

**Alt 6 — Apply Layer 2 to regime matching too.** Rejected. Most regimes do not have a single coherent demographic identity. Future addition: explicit "anti-X" tags for genocidal regimes; out of scope.

**Alt 7 — Remove `resolveIdentityPrimary.ts` in PR 6.G alongside re-encoding.** Rejected: high blast radius; can't compare resolver-routed vs geometry-routed users for 141-146 cohort. Gated dissolution in 6.I is safer.

**Alt 8 — Use `Σ b² / 6` as boundaryLoad.** Rejected: severely understates concentration. One boundary at 1.0 with rest at 0 gives 0.167, not 1.0. Use `max(b)` instead.

**Alt 9 — Double-weight intensity inside boundaryDist.** Rejected: intensity already enters via outer salience-weighted scorer; including it inside per-boundary distance double-counts.

**Alt 10 — PF as intensity-only contribution (no political_tribe boundary).** Rejected: PF feeding only `morIntensity` recreates the old TRB ambiguity — high intensity without saying *what* the activation attaches to. Two PF=5 respondents fused to opposite parties would look identical to the engine. Adding `political_tribe` as a 7th boundary keeps the object of partisan fusion explicit.

**Alt 11 — Migrate existing partisan multiplier into Layer 2 in PR 6.E.** Considered but deferred. Cleaner long-term: party loyalty becomes `political_tribe` lock-and-key, single source of truth. But folding the election-pipeline migration into 6.E expands it significantly. Safer v1: Layer 2 excludes political_tribe; existing multiplier retained; migration is a follow-up PR.

## Follow-ups

- **Migrate existing partisan multiplier into Layer 2.** Long-term cleanup. Removes the double-source for party loyalty; `political_tribe` lock-and-key becomes the single source.
- **Holistic archetype re-encoding pass** (post-6.H): refine boundary vectors after seeing real persona-replay results.
- **Identity-primary archetype renames** (post-6.I): once the resolver is gone, names like "White Grievance Voter" imply demographics that the new architecture doesn't require.
- **Candidate boundary-vector consistency audit**: ~140 candidate profiles is a lot of judgment calls; consider a calibration session against historical voter-coalition data.
- **EPS/AES full-ranking improvement**: independent parallel workstream — replace best/worst Q89 + Q218 with full 6-rank priority sort.
- **Anti-X regime tags** (v2 of regime alignment): optional future addition for genocidal regimes; only fires when respondent's MOR_MEMBERSHIP matches the targeted group.
- **Cumulative boundaryLoad variant** (v2): switch to `min(1, sqrt(Σ b²))` if real-world data shows multi-anchor activation needs sharper detection than `max(b)`.
