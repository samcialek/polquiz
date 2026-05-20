# Architectural / structural ideas

**Scope:** Bigger structural moves. New nodes, new clusters, scoring algorithm changes, signature representation, IDP gate restructuring, score-decomposition surfaces. Things that would warrant a new ADR if pursued.

**Each entry must include:**
- The proposed change (specific enough to be implementable)
- The motivation (what's wrong with current state? cite specific files/lines/personas)
- The downstream impact (which files change, which assumptions break)
- The ADR-relationship (extends? contradicts? supersedes? Don't propose contradicting ADRs without strong reason — read the ADR first)
- Estimated effort: small / medium / large
- Reversibility: easy / hard / one-way

**Areas worth exploring:**
- Should there be a separate `LOYALTY` node distinct from moral-circle scopedAffinities?
- Is the salience squaring (`SAL_POWER = 2`) the right exponent? When does it under/overweight?
- Should the score decomposition be made user-visible (the donut shows clusters but not contribution sources)?
- Engagement as scalar — should there be sub-types (issue engagement vs. partisan engagement)?
- Is the 4-way TV distance still the right calibration target for backtest (electorate refit)?
- Cross-pressure as a first-class concept vs. emergent property of the posterior
- IDP overlay vs. IDP-as-base-archetype — current model has both; is the boundary clean?

**Out of scope (don't propose):**
- New jurisdictions (368 regime periods are canonical)
- New historical elections (60 US elections are canonical)
- Activation map edits (CLAUDE.md explicitly forbids regenerating it)
- Reinstating `prior` or `trbAnchorPrior` fields (ADR-003 — they stay dead)

---

## [2026-05-18T07:30 — cycle 6 — DEEPEN — architecture-thoughts.md]

### IDP Gate Calibration: The Universal Baseline Over-Estimation Problem

---

#### The Problem — one-line statement

The IDP gate correctly requires `universalAffinity ≤ 75` to filter true universalists from in-group-motivated archetypes, but Q231 and Q8 assign universal values **above** the gate ceiling in response to the socially-expected "high empathy" answers — permanently IDP-blocking a large fraction of respondents who likely have real in-group attachments.

---

#### Evidence base (from four audit cycles)

Every finding below was read verbatim from `src/config/questions.representative.ts` and documented in `overnight-ideation/ideas-claude/audit-findings.md`.

**Q231 `slider` — `universal_baseline_stranger` (fixed12):**
```ts
sliderMap: {
  "0-20":   { moralCircle: { universal: 10 } },
  "21-40":  { moralCircle: { universal: 30 } },
  "41-60":  { moralCircle: { universal: 50 } },
  "61-80":  { moralCircle: { universal: 75 } },  // at gate ceiling
  "81-100": { moralCircle: { universal: 95 } },  // 20 points ABOVE gate ceiling
},
```

Respondents sliding above 80 are assigned `universal=95`. The IDP gate ceiling is 75. Gap: **20 points**. No downstream question in the fixed12 set writes a `universal` component that could lower it. Result: anyone whose mouse lands above 80 on "how much does a stranger's suffering matter to you" is **permanently IDP-ineligible**, regardless of any scoped-affinity signals they provide on Q229 or Q232–Q239.

**Q8 `single_choice` — `domestic_vs_abroad_lives` (fixed12):**
```ts
clearly_abroad: {
  moralCircle: { universal: 90 }  // no scoped affinities
},
```

Respondents who pick "save 100 foreign lives" are assigned `universal=90`. Gap from gate ceiling: **15 points**. Same permanent block.

**Q229 `priority_sort` — `moral_circle_in_group_sort` (fixed12):**
```ts
rankingMap: {
  ingroup_national:      { moralCircle: { scopedAffinities: { national:      95 } } },
  ingroup_religious:     { moralCircle: { scopedAffinities: { religious:     95 } } },
  // ... all six scopes: scoped=95, no universal write
}
```

Q229 writes `scoped=95` for each supportHigh scope — but writes **no `universal` component**. A clearly_abroad respondent (universal=90) who places, e.g., `ingroup_religious` in supportHigh gets `excess = max(0, 95 − 90) = 5`. IDP gate requires `excess ≥ 20` AND `universal ≤ 75`: both fail. Q229 cannot rescue a high-universal respondent.

**Q228 `priority_sort` — `remaining_in_group_pull` (fixed12):**
Q228 was designed to walk universal back from 90 to 75 for clearly_abroad respondents by writing `moralCircle: { universal: 75, scopedAffinities: { scope: 85 } }` on each supportHigh item. But as found in audit cycle 4: Q228 was supposed to be **retired** by Q229 (Q229's inline comment says "The conditional Q228 is retired in favor of this question") but `eligibleIf: ["answered_q8_abroad"]` is still live. Result: clearly_abroad respondents are double-probed AND the walk-back mechanism produces only `excess ≈ 10` after Bayesian averaging — still far below the `excess ≥ 20` gate (see cycle 4 arithmetic).

---

#### Root cause

The IDP gate was designed with a specific respondent model in mind: someone who reports **low** universal concern (≤75) but **high** concern for specific in-groups. This is the White Grievance Voter, the MAGA nationalist, the Evangelical tribalist. The gate makes sense for them.

What the gate design did not account for: the Q231 prompt ("When a stranger is suffering, how much does that matter to you...") is subject to **social desirability inflation**. The socially expected answer is "it matters a lot." If even 30–40% of respondents slide above 80 (plausible for a compassion-framed question), then 30–40% of all respondents are permanently IDP-blocked by Q231 alone, including:

- A devout Evangelical who genuinely cares about humanity AND identifies strongly with their faith community (Q229 `ingroup_religious: supportHigh`)
- A White nationalist who intellectually endorses universal human rights but viscerally prioritizes co-ethnics — and is aware of the first, so slides to 85 on Q231
- A Black voter with high racial solidarity who also answers "strangers matter" at 82 because they do — they're just more motivated by their in-group

All of these respondents should potentially route to IDP archetypes (145, 141, 142 respectively). None of them can, because Q231's top bucket assigns universal=95 and no downstream question lowers it.

The **behavioral vs. self-report** asymmetry is the deeper issue: Q8 is a forced-choice (behavioral reveal — you must sacrifice one group to save another), while Q231 is a self-report scale (how much does it *matter* to you). Behavioral reveals are epistemically stronger for true universal concern; self-report scales on socially sensitive items inflate. Currently both write to the same `universalAffinity` variable without any mechanism to weight their epistemic quality differently. If Q231 is answered after Q8 (both are fixed12, ordered by section), a clearly_domestic respondent (Q8→universal=30) who then slides to 85 on Q231 (moral concern question) walks their universal back up to a level that may partially undo the behavioral Q8 signal.

---

#### Three fix options

**Option A — Bucket recalibration (minimal invasiveness)**

Adjust Q231's two highest buckets:

| Bucket | Current | Proposed |
|--------|---------|----------|
| `61-80` | `universal: 75` | `universal: 65` |
| `81-100` | `universal: 95` | `universal: 75` |

Effect: the top half of the Q231 scale now lands at or below the IDP gate ceiling. An 81-100 respondent gets universal=75 (exactly at ceiling), making IDP routing possible if their scoped affinity hits 95 via Q229 supportHigh (excess = 95 − 75 = 20, clears gate).

**Trade-off:** The `81-100` bucket loses its ability to produce a "confirmed high universalist" classification. Respondents who genuinely sit at universal=90–100 (e.g., Rawlsian Reformer #001, World-Minded Reformer) would be under-estimated. This matters for archetype matching against universalist archetypes — if their universal is recorded as 75 instead of 95, their distance from high-universal archetypes increases slightly.

**Magnitude of trade-off:** Low. Universal affinity feeds IDP routing and candidate comparison (MORAL-CIRCLE-GUIDE §5). Archetype matching uses the `excessAffinities` vector, not raw universal. The universalist archetypes (#001, #023, #025) have low expected excess (near-zero across all scopes), so their distance score is driven by the excess vector being flat — which it will still be for true universalists even if universal is recorded as 75 rather than 95.

**Implementation:** 2 lines in `src/config/questions.representative.ts` (Q231 sliderMap). No type changes, no engine changes.

---

**Option B — Q228 retirement + universal-dampening in Q229 (medium invasiveness)**

Two changes:
1. Formally retire Q228 (change `eligibleIf: ["answered_q8_abroad"]` to `eligibleIf: ["__retired__"]`). This eliminates double-probing.
2. Add a universal-dampening write to Q229 for respondents who place ≥3 scopes in supportHigh:

```ts
// In Q229 rankingMap or as a post-processing hook:
// If respondent places 3+ scopes in supportHigh, dampen universal toward max(current − 15, 55)
// Rationale: behavioral evidence of load-bearing in-group preferences rebuts inflated self-report
```

This addresses the social desirability bias directly: a respondent who demonstrates real in-group prioritization behavior (sorting multiple scopes to supportHigh) gets a behavioral correction to their self-reported universal score.

**Trade-off:** Mixing self-report (Q231) and behavioral (Q229 placement) evidence in the same `universalAffinity` field makes the variable's meaning less clean. Q229 becomes a dual-purpose question (probe scoped + modulate universal), which is closer to the "one signal per item" violation Sam has flagged.

---

**Option C — Raise the IDP gate ceiling (deep invasiveness)**

Change `universalAffinity ≤ 75` to `universalAffinity ≤ 85` in `src/identity/resolveIdentityPrimary.ts`.

**Why this doesn't fully work:** The Q231 `81-100` bucket is still assigned universal=95 under the current scheme. A gate ceiling of 85 helps respondents in the 61-80 bucket (universal=75 → now clearly below ceiling with headroom), but still blocks every respondent who slid above 80 on Q231 (universal=95 > 85).

Option C only fixes the problem partially without also fixing the Q231 bucket assignments. If the gate ceiling is raised AND the buckets are adjusted (hybrid of A + C), it works — but that's more invasive than Option A alone.

---

#### Recommended approach

**Option A (bucket recalibration) + Q228 formal retirement.**

Rationale:
- Option A is a 2-line change that restores IDP access for the 81-100 slider population
- Q228 retirement is independently correct (Q229 supersedes it, as its own comment states) and should happen regardless of the calibration fix
- Together these are the minimum-footprint solution: no gate logic changes, no type changes, no downstream archetype edits
- Reversibility is trivial: restore the two original bucket values

**Before implementing:** Verify the actual `applySliderAnswer` and `applyPrioritySort` averaging logic in the engine to confirm that Q231 writes are direct overwrites vs. Bayesian averages. If Q231 is a weighted average (not a direct overwrite), the proposed bucket values need to be calibrated against the actual averaging math — because `{ universal: 75 }` from Q231 at weight 0.10 produces a very different posterior than at weight 1.0. The audit found that Q231's touchProfile declares `weight: 0.10` on MOR (legacy), but the moralCircle write in sliderMap has no explicit weight — it may be applying at full weight or at a separately-specified weight. **This should be verified before editing bucket values.**

---

#### Downstream impact

| Surface | Impact of Option A |
|---|---|
| `src/config/questions.representative.ts` | 2 lines changed (Q231 sliderMap top 2 buckets) |
| `src/identity/resolveIdentityPrimary.ts` | No change (gate logic preserved) |
| IDP archetype routing (141–146) | More respondents become eligible — intended fix |
| Archetype distance scoring | Negligible: universalist archetypes (#001, #021, #023, #025) match on excess vector, not raw universal |
| Candidate comparison | Negligible for most elections; minor recalibration for elections where MOR/moral-circle is activated (none: MORAL-CIRCLE-GUIDE §1 notes MOR/TRB/PF never receive era activation boost) |
| Q228 retirement | Q228 double-probing eliminated; clearly_abroad respondents see one fewer question; net quiz length for universalists drops by 1 |

---

#### ADR relationship

- **ADR-007 (moral circle module):** Option A is consistent with ADR-007. The gate logic (`excess ≥ 20 AND scoped ≥ 70 AND universal ≤ 75 AND intensity03 ≥ 1.2`) in `resolveIdentityPrimary.ts` is unchanged. Only the *measurement* of universal is being recalibrated — not the gate architecture.
- **No new ADR needed** for Option A: it's a calibration fix within the existing framework, not a conceptual/architectural change. A one-paragraph commit message is sufficient.
- **A new ADR would be needed** for Option B (changing Q229's semantic role to include universal-dampening changes what the variable means, which crosses into architectural territory).

---

#### Effort and reversibility

- **Effort:** Small (Option A alone: 2 lines + retirement of Q228). Medium if verification of averaging-vs-overwrite semantics requires reading the engine path.
- **Reversibility:** Easy — restore 2 bucket values in Q231 sliderMap and un-retire Q228.

---

#### Priority

**HIGH — fix before harness runs.** The harness will test personas against IDP archetypes (Tier-A: Abstain→Trump has national excess; Tier-B: Christian-right traditionalist has religious excess). If Q231 miscalibration permanently gates them out, the harness will report IDP routing as broken even though the routing logic is correct. This produces a false failure signal and invalidates the harness's IDP-related assertions. Fixing the calibration first means the harness tests what it claims to test.

**Cross-links:** [[audit-findings.md]] cycles 2, 4, 5 (Q8/Q229/Q231 IDP gate findings); [[new-questions.md]] Q240 (persona discrimination after calibration fix).

---

## [2026-05-18T — cycle 19 — DEEPEN — architecture-thoughts.md]

### opposeHigh moralCircle Inversion — `applyPrioritySort` engine fix

**Source:** audit-findings.md cycle 18, Finding 1 (HIGH — opposeHigh discards all moralCircle evidence).

---

#### Problem in one sentence

`applyPrioritySort` (update.ts:1237) skips `opposeHigh` items entirely in the moralCircle section, meaning a respondent who actively opposes a scope (e.g., "national identity should NOT be central to my politics") is recorded with the same null scoped affinity as a respondent who is simply indifferent — making active anti-tribalists indistinguishable from disengaged centrists.

---

#### Exact location of the change

**File:** `src/engine/update.ts`

**Current lines 1236–1273 (verbatim):**

```ts
    const bucket = bucketFor(item);
    if (bucket === "neutral" || bucket === "opposeHigh") continue;   // ← line 1237
    const weight = bucket === "supportHigh" ? 1.0 : 0.5;

    if (map.trbAnchor) {
      const scaled: Partial<Record<TrbAnchor, number>> = {};
      for (const [k, v] of Object.entries(map.trbAnchor)) {
        scaled[k as TrbAnchor] = v * weight;
      }
      state.trbAnchor.dist = addToAnchorDist(state.trbAnchor.dist, scaled);
      mirrorAnchorToBoundaries(state, scaled, 1.0);
      anchorApplied = true;
    }

    if (map.moralCircle) {
      // Bucket-weighted moral-circle emission. supportHigh emits the declared
      // value as-is; supportMid blends toward the universal-baseline neutral
      // point (50) by `weight` so a mid-supported item produces a weaker
      // signal in the running average than a fully-supported one. Without
      // this, a single supportMid touch raises a scope's average to the same
      // level as a single supportHigh touch — which the bucket distinction
      // is meant to prevent (the trbAnchor branch above already weights this
      // way; this brings moralCircle into alignment).
      const NEUTRAL = 50;
      const scaled: typeof map.moralCircle = {};
      if (typeof map.moralCircle.universal === "number") {
        scaled.universal = NEUTRAL + weight * (map.moralCircle.universal - NEUTRAL);
      }
      if (map.moralCircle.scopedAffinities) {
        const out: NonNullable<typeof map.moralCircle.scopedAffinities> = {};
        for (const [k, v] of Object.entries(map.moralCircle.scopedAffinities)) {
          if (v === null || v === undefined) continue;
          out[k as keyof typeof out] = NEUTRAL + weight * (v - NEUTRAL);
        }
        scaled.scopedAffinities = out;
      }
      applyMoralCircleEvidence(state, scaled);
    }
```

---

#### Proposed replacement

```ts
    const bucket = bucketFor(item);
    if (bucket === "neutral") continue;                              // ← removed "|| opposeHigh"
    const isOppose = bucket === "opposeHigh";                       // ← new
    const weight = bucket === "supportMid" ? 0.5 : 1.0;            // ← opposeHigh now uses weight=1.0

    if (map.trbAnchor && !isOppose) {                               // ← trbAnchor still skips opposeHigh
      const scaled: Partial<Record<TrbAnchor, number>> = {};
      for (const [k, v] of Object.entries(map.trbAnchor)) {
        scaled[k as TrbAnchor] = v * weight;
      }
      state.trbAnchor.dist = addToAnchorDist(state.trbAnchor.dist, scaled);
      mirrorAnchorToBoundaries(state, scaled, 1.0);
      anchorApplied = true;
    }

    if (map.moralCircle) {
      // Bucket-weighted moral-circle emission.
      //   supportHigh: emits declared value at full weight
      //     (NEUTRAL + 1.0 * (v - NEUTRAL) = v)
      //   supportMid:  blends toward NEUTRAL at half weight
      //     (NEUTRAL + 0.5 * (v - NEUTRAL))
      //   opposeHigh:  mirrors supportHigh but on the LOW side
      //     (NEUTRAL - 1.0 * (v - NEUTRAL) = 2*NEUTRAL - v)
      //     "I oppose this being central" → scoped affinity below neutral,
      //     symmetrically opposite to supportHigh.
      //   neutral: skipped (no evidence about the scope)
      //
      // trbAnchor keeps the existing skip for opposeHigh — additive anchor
      // scoring has no clean inversion; moralCircle's continuous scale does.
      const NEUTRAL = 50;
      const sign = isOppose ? -1 : 1;                               // ← new: sign controls direction
      const scaled: typeof map.moralCircle = {};
      if (typeof map.moralCircle.universal === "number") {
        scaled.universal = NEUTRAL + sign * weight * (map.moralCircle.universal - NEUTRAL);
      }
      if (map.moralCircle.scopedAffinities) {
        const out: NonNullable<typeof map.moralCircle.scopedAffinities> = {};
        for (const [k, v] of Object.entries(map.moralCircle.scopedAffinities)) {
          if (v === null || v === undefined) continue;
          out[k as keyof typeof out] = NEUTRAL + sign * weight * ((v as number) - NEUTRAL);
        }
        scaled.scopedAffinities = out;
      }
      applyMoralCircleEvidence(state, scaled);
    }
```

**Net diff: 4 changed lines.** The existing comment block is replaced with the updated explanation. No type changes. No function signature changes. `applyMoralCircleEvidence` at line 1272 is called identically — only the `scaled` values differ.

---

#### Arithmetic for Q60's current rankingMap

Q60's rankingMap values (verbatim from `src/config/questions.representative.ts`, lines 351–359):

```ts
national_identity:      { trbAnchor: { national: 1 },      moralCircle: { scopedAffinities: { national: 70 } } }
global_citizen:         { trbAnchor: { global: 1 },        moralCircle: { universal: 75 } }
// (other identity items: all moralCircle.scopedAffinities at v=70)
```

With `NEUTRAL = 50`:

| Item | Bucket | isOppose | weight | v | Emitted value | Formula |
|---|---|---|---|---|---|---|
| `national_identity` | supportHigh | false | 1.0 | 70 | **70** | `50 + 1 * 1.0 * (70−50) = 70` |
| `national_identity` | supportMid | false | 0.5 | 70 | **60** | `50 + 1 * 0.5 * (70−50) = 60` |
| `national_identity` | neutral | — | — | 70 | **(skipped)** | — |
| `national_identity` | opposeHigh | true | 1.0 | 70 | **30** | `50 + (−1) * 1.0 * (70−50) = 30` |
| `global_citizen` | supportHigh | false | 1.0 | 75 | **75** (universal) | `50 + 1 * 1.0 * (75−50) = 75` |
| `global_citizen` | opposeHigh | true | 1.0 | 75 | **25** (universal) | `50 + (−1) * 1.0 * (75−50) = 25` |

The pattern: opposeHigh emits the reflection of supportHigh around NEUTRAL=50. `supportHigh: 70 → opposeHigh: 30`. `supportHigh universal: 75 → opposeHigh universal: 25`.

---

#### IDP routing consequences — before vs. after fix, for each key persona

All calculations use engine arithmetic from `src/engine/update.ts` lines 440–471 (arithmetic mean over all writes; verbatim from cycle 12 audit):

```ts
acc.universalSum += v; acc.universalCount += 1;
// ...
const universalAffinity = acc.universalCount > 0 ? acc.universalSum / acc.universalCount : 50;
```

**Inputs assumed per persona:**
- Q230 and Q231 both in `61-80` range (post-recalibration from cycle 11/12): write `universal = 65` each.
- IDP gate: `excess ≥ 20 AND scoped ≥ 70 AND universal ≤ 75 AND intensity03 ≥ 1.2`

---

**Persona A — MAGA nationalist (Tier-A Abstain→Trump):**

Q60 placement:
- `national_identity` → supportHigh → national scoped = 70
- `global_citizen` → opposeHigh → **universal = 25** (NEW; was: skipped)
- Other items → neutral or opposeHigh → scoped = 30 each (NEW; was: skipped)

Universal affinity calculation:

| Source | Write | Before fix | After fix |
|---|---|---|---|
| Q230 (61-80, recalibrated) | 65 | included | included |
| Q231 (61-80, recalibrated) | 65 | included | included |
| Q60 `global_citizen` opposeHigh | 25 | **skipped** | **included** |

Before fix: universalAffinity = (65+65)/2 = **65** → excess = max(0, 70−65) = 5 → IDP gate **FAILS** (excess < 20)

After fix: universalAffinity = (65+65+25)/3 = **51.7** → excess = max(0, 70−51.7) = **18.3** → IDP gate **still fails** (18.3 < 20), but much closer

Edge variant (MAGA who slides Q230/Q231 lower, say 21-40 → universal=30 each):
- After fix: universalAffinity = (30+30+25)/3 = **28.3** → excess = max(0, 70−28.3) = **41.7** → IDP gate **PASSES** ✓

**Key insight:** The `global_citizen opposeHigh → universal=25` write helps MAGA personas reach IDP routing whenever Q230/Q231 are answered in the low-to-mid range (as MAGA respondents typically would, since they don't heavily identify with "universal compassion for strangers"). The fix improves IDP access for this population.

For MAGA respondents who slide Q230/Q231 high (61-80 range): the three-way average after fix = 51.7, meaning national excess = 18.3 → just below gate. **Battery B (Q232 national probe) is still load-bearing** for this sub-population. Battery B writes `national scoped ≈ 80-90` via a targeted scope probe; that higher scoped value will push excess above 20 even at universal=51.7. So the fix narrows the gap, reducing Battery B's corrective burden.

---

**Persona B — Urban progressive universalist (Tier-B #4 Lifelong Democrat):**

Q60 placement:
- `global_citizen` → supportHigh → **universal = 75**
- `national_identity`, `ideological_identity`, `ethnic_racial_identity` → opposeHigh → **scoped = 30 each** (NEW; was: skipped)
- Other items → neutral

Before fix: All scoped affinities null (nothing written for opposeHigh items). The universalist persona looked identical to a disengaged centrist who left everything in neutral.

After fix:
- universalAffinity = (65 + 65 + 75) / 3 = **68.3** (Q230 recal + Q231 recal + Q60 global_citizen)
- national scoped = 30, excess = max(0, 30−68.3) = **0** → no IDP routing ✓ (correct)
- ideological scoped = 30, excess = 0 ✓
- ethnic_racial scoped = 30, excess = 0 ✓

The universalist now has concrete low scoped values (30) rather than null. This correctly distinguishes them from:
- Indifferent centrist (all null — no Q60 opposeHigh placements) → scoped stays null
- Active universalist (all opposeHigh + global_citizen supportHigh) → scoped = 30 → excess = 0

Both end up with no IDP routing, but the active universalist now has a positive identity signal (low-scoped = 30, meaning "I explicitly do NOT want these scopes to load my politics") that the archetype matching layer can use.

---

**Persona C — Evangelical tribalist (Tier-B #12 Christian-right traditionalist):**

Q60 placement:
- `religious_identity` → supportHigh → **religious scoped = 70**
- `global_citizen` → neutral → no universal write (not opposeHigh, not supportHigh)

Q230/Q231: assume 21-40 range (moderately low universalism framing for religious conservative).
Universal writes: (30 + 30) / 2 = **30**.

After fix: religious excess = max(0, 70−30) = **40** → IDP gate: excess≥20 ✓, scoped=70≥70 ✓, universal=30≤75 ✓, intensity03 check depends on vector — likely passes. **IDP routing to Evangelical Voter (#145)** ✓.

The fix doesn't affect this persona: they put global_citizen in neutral (no opposeHigh write), so the new code path isn't triggered. They were already correctly IDP-routable (if Q230/Q231 are answered in the low range). The fix is purely additive for this population.

---

**Persona D — Centrist disengaged (Tier-B #14):**

Q60 placement:
- All items → neutral (nothing salient)

Before and after fix: identical. `neutral` is skipped in both the old code and the new code. No moralCircle writes from Q60. The disengaged centrist's moralCircle state is determined only by Q230/Q231 — likely giving universalAffinity ≈ 50 (mid-range slider). Correctly not IDP-routed.

---

#### Edge case: `global_citizen` in `opposeHigh` but all identity scopes in `supportHigh`

A hypothetical MAGA respondent who puts *all* identity scopes in supportHigh AND opposes global_citizen:

- 6 identity scopes (supportHigh) → scoped = 70 each
- global_citizen (opposeHigh) → universal = 25
- Q230, Q231 both in 21-40 → universal = 30 each

universalAffinity = (30 + 30 + 25) / 3 = **28.3**

For each scope: excess = max(0, 70−28.3) = **41.7** → all IDP gates open.

`intensity03` (derived: sum of excess vectors normalized) will be very high (all 6 scopes at excess=41.7). The IDP gate `intensity03 ≥ 1.2` will easily pass.

**Result:** Respondent routes to ALL six IDP overlay checks (one per scope). This is the multi-scope tribalist — which archetype wins depends on the Membership dimension. The fix correctly enables this routing path.

---

#### Edge case: `global_citizen` in `opposeHigh`, nothing else in `opposeHigh`, Q230/Q231 high

A cynical "America-first" respondent who opposes global citizenship AND slides high on abstract compassion questions:

- global_citizen (opposeHigh) → universal = 25
- national_identity (supportHigh) → national scoped = 70
- Q230 (81-100, post-recal) → universal = 75
- Q231 (81-100, post-recal) → universal = 75

universalAffinity = (75 + 75 + 25) / 3 = **58.3**

national excess = max(0, 70−58.3) = **11.7** → IDP gate fails (excess < 20).

**Without the fix:** universalAffinity = (75+75)/2 = 75 → excess = max(0,70−75) = 0 → also fails.

The fix marginally improves excess (from 0 to 11.7) but still doesn't cross the gate. Battery B (Q232 national scope probe) would need to push national scoped to ≥79 to clear the gate (excess = 79−58.3 = 20.7 ≥ 20). This is a realistic Battery B output, so the fix enables this respondent to route IDP via Battery B where previously they could not.

**The fix is not a magic gate-unlocker for high-slider respondents** — it narrows the gap, reduces Battery B's burden, and enables routing for the moderate-universal sub-population. True universalists (all three universal questions answered high) will still be correctly excluded.

---

#### Interaction with trbAnchor (preserved skip — why it's right)

The trbAnchor section retains `if (map.trbAnchor && !isOppose)` — opposeHigh items still skip trbAnchor. Reason (from existing code comment, verbatim):

```ts
//   opposeHigh  → skip         (same skip rationale as best_worst's `worst`:
//                               "I oppose this being central" doesn't cleanly
//                               invert to a different anchor)
```

For trbAnchor, this is correct: the anchor is an additive categorical vote. A respondent who opposes national identity politics has not declared any *other* anchor as dominant. There's no sensible "inverse national = global" mapping (global is a separate anchor that must be explicitly placed). Inverting trbAnchor would corrupt the anchor distribution without a clean destination.

For moralCircle scopedAffinities, inversion IS semantically clean: "I oppose national identity being central" → my national scoped affinity is below my universal baseline → exact arithmetic: `2*NEUTRAL - supportHighValue = 30`. The moralCircle scale is continuous and symmetric around the NEUTRAL point; the trbAnchor is categorical and additive.

---

#### Interaction with `applyMoralCircleEvidence` clamp

The called function already clamps inputs to [0, 100] (verbatim from `src/engine/update.ts` line 443):

```ts
const v = Math.max(0, Math.min(100, ev.universal));
```

All proposed opposeHigh values (25, 30) are safely within [0, 100]. No changes needed to `applyMoralCircleEvidence`.

---

#### Open question: null vs. 30 in archetype matching

Before the fix: opposed scopes have `scopedAffinity = null` (accumulator never incremented).
After the fix: opposed scopes have `scopedAffinity ≈ 30` (one count in the accumulator).

The downstream behavior depends on how `resolveIdentityPrimary.ts` and `archetypeDistance.ts` handle `null` vs. a low numeric value:

- If null is treated as "scope not relevant — skip distance computation" and `30` is treated as "scope measured, low value — include in distance" → the fix changes the matching geometry for anti-tribal personas. Universalist archetype (#001) may get a slightly better distance score now that their scoped affinities are explicitly low (30) rather than null.

- If null is treated the same as 50 (neutral) in the distance computation → before fix, opposed scopes contributed nothing to distance; after fix, they contribute a mild low-scoped signal (30). The universalist persona's distance from nationalist archetypes improves slightly (correctly).

**Sam should verify how null is handled in `archetypeDistance.ts` before landing the fix.** The fix is almost certainly an improvement, but knowing whether it changes the null-vs-30 semantics at the matching layer determines whether the improvement is negligible or material.

---

#### ADR relationship

This fix is consistent with **ADR-007** (moral circle module). ADR-007 defines the moralCircle as `universalAffinity + 6 × scopedAffinities`, where excess drives behavior. The fix adds more signal paths to compute those values — it does not change the definition, the gate logic, or the downstream use.

**No new ADR needed.** The change is a calibration fix within the existing framework. A commit message noting "opposeHigh moralCircle inversion in applyPrioritySort" is sufficient.

---

#### Downstream impact

| Surface | Impact |
|---|---|
| `src/engine/update.ts` | 4 lines changed in `applyPrioritySort` (lines ~1237–1268) |
| `src/config/questions.representative.ts` | No changes needed — Q60's rankingMap values are reused correctly |
| IDP routing (resolveIdentityPrimary.ts) | More respondents reach the gate floor; Battery B less burdened |
| Archetype matching (archetypeDistance.ts) | Anti-tribal personas get explicit low-scoped values (30) instead of null; verify null-vs-number handling |
| trbAnchor | No change — opposeHigh still skipped for anchor computation |
| Q229, Q230, Q231 | Unaffected — different code paths |

---

#### Effort and reversibility

- **Effort:** Small. 4 lines of change. No type changes. No schema changes. Behavior is easily unit-testable by comparing the `moralCircle` accumulator before/after for a Q60 opposeHigh input.
- **Reversibility:** Easy — revert the 4-line diff, restore the original comment.

---

#### Priority

**MEDIUM–HIGH** (just below the Q230/Q231 recalibration). The Q230/Q231 fix (#0 and #1 in the canonical fix sequence from cycle 12) addresses IDP gate access for the entire respondent population — it's a prerequisite. This fix is secondary: it improves the quality of the moralCircle state *once the gate is accessible*, and it distinguishes active anti-tribalists from passive centrists. Worth doing in the same pass as the Q230/Q231 fix, but can follow immediately after without a re-run if the gate fix is applied first.

**Should precede harness runs** — the Tier-B urban progressive persona (#4) will otherwise have an unexplained moralCircle signature (null scoped instead of explicitly low), potentially routing to an archetype that relies on undefined scoped affinities.

---

**Cross-links:** [[audit-findings.md]] cycle 18 (Q60 Finding 1 — source of this DEEPEN); [[architecture-thoughts.md]] cycle 6 (IDP gate calibration — prerequisite fix; must apply Q230/Q231 recalibration before or alongside this engine change); [[audit-findings.md]] cycle 5 (Q231 IDP cliff — same gate tension, different entry point); [[new-questions.md]] Q240 (anti-establishment probe — MAGA nationalist reaching IDP routing enables Q240 to separate them from Never-Trump R post-IDP-assignment).

