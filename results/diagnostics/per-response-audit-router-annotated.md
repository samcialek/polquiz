# Per-Response Evidence Audit — Router Slice §5.5 Annotation

**Date:** 2026-05-19
**Spec:** HARNESS-HANDOFF.md §5.5
**Scope:** 15 router questions (`SALIENCE_ROUTER_FIXED`)
**Mechanical baseline:** `per-response-audit-router-slice.md` (post-`f70762c`, 0 flags in router slice)

## What this annotates

Mechanical audit covers structural correctness (touch declared? hollow distribution? scalar present?). §5.5 adds four human-judgment dimensions:

- **SIGN** — does the evidence direction match the option text?
- **MAGNITUDE** — is each option as strong as it justifiably could be, neither under-pulling nor over-pulling?
- **SYMMETRY** — within a question, are extreme-A and extreme-B options mirror-imaged in pull strength?
- **SALIENCE-vs-POSITION discipline** — do `role: "salience"` evidence rows move sal (not pos), and vice versa?

This pass only flags rows that need attention. Rows not mentioned are calibrated cleanly.

## Findings by question

### Q200 — party_identification (single_choice, 6 options × 7 nodes)

**Status:** PASS — WEAK-BY-DESIGN.

Mild leans (peak 0.25 vs lowest 0.14, ratio 1.8:1) on `dem` and `rep` only; `ind/third/other/none` emit no continuous evidence. Documented inline as a partisan-prior shorthand, easily overridden by a single direct-position touch. Mirror-perfect between `dem` and `rep` on all 7 nodes.

No fix needed.

### Q103 — issue_salience_screener (priority_sort, 11 items)

**Status:** PASS — by-design empty per-item rows.

Per-item rankingMap values are intentionally `{ continuous: { NODE: {} } }`. All work is done by the `salienceBuckets` override (`supportHigh: [0.00, 0.02, 0.08, 0.90]` etc.) in `applyPrioritySort`'s per-node bucket aggregation. The empty per-item rows are correct.

No fix needed.

### Q97 — political_thought_frequency (single_choice, 4 options)

**Status:** MINOR — slight extreme-pole asymmetry.

- `rarely_elections` → PF.pos peak=1 at **0.55**, ENG.pos peak=1 at **0.60**
- `constantly_worldview` → PF.pos peak=5 at **0.45**, ENG.pos peak=5 at **0.53**

The "rarely" pole pulls slightly harder than the "constantly" pole (PF: 0.55 vs 0.45; ENG: 0.60 vs 0.53). Defensible if you believe "constantly" answers are noisier (people in heavy-media bubbles may overstate their attention), but mechanically the mirror is off by 5–10 pp.

**Suggested:** symmetrize to ~0.50/0.50 on PF (e.g., constantly_worldview PF.pos → `[0.02, 0.05, 0.13, 0.30, 0.50]`).

Low priority; PF is one of the soon-to-be-deprecated nodes per ADR-005 anyway, so unlikely to be load-bearing.

### Q60 — politically_important_identities (priority_sort, 7 items)

**Status:** PASS.

Each item routes its trbAnchor key + moralCircle scoped affinity to its semantic scope. All 6 scoped affinities write 70 uniformly; `global_citizen` writes `universal: 75`. Small asymmetry (70 scoped vs 75 universal) is appropriate — universalists are explicitly indicating wide concern; scope picks are elevating one scope above baseline.

No fix needed.

### Q89 — epistemic_style_battery (best_worst, 5 EPS options)

**Status:** PASS by inheritance — uses canonical `EPS_PROTOTYPES`.

All 5 options delegate to `EPS_PROTOTYPES.{empiricist,institutionalist,traditionalist,intuitionist,autonomous}` from `src/config/categories.ts`. The category prototypes are shared across multiple questions — calibration is centralized, not per-question. (Nihilist intentionally dropped from this question per the 2026-04-24 comment; coverage shifts to Q79.)

Note: cross-question categorical-prototype calibration is itself a §5.5 task, but it's slice-wide, not router-specific. Deferred to the categorical prototypes audit (separate item).

### Q218 — aesthetic_style_ranking (best_worst, 6 AES options)

**Status:** PASS by inheritance — uses canonical `AES_PROTOTYPES`.

Same structure as Q89. All 6 AES categories present (`statesman, technocrat, pastoral, authentic, fighter, visionary`).

### Q211 — strategic_voting (single_choice, 4 options)

**Status:** PASS — pure metadata.

`touchProfile: []`, every option `optionEvidence: {}`. The answer is consumed by `predictVote` for lesser-evil routing, not by the Bayesian engine. Correct shape.

### Q212 — negative_partisanship (single_choice, 4 options)

**Status:** PASS — pure metadata. Same shape as Q211.

### Q93 — priority_sort_opener (priority_sort, 12 pole items)

**Status:** PASS.

6 nodes × 2 poles each = 12 items. Every pole pair is a perfect mirror — `mat_low [0.45, 0.30, 0.15, 0.07, 0.03]` vs `mat_high [0.03, 0.07, 0.15, 0.30, 0.45]`, and identical across all 6 nodes (MAT/CD/CU/MOR/PRO/COM). Magnitude moderate-strong (peak 0.45). Clean.

### Q102 — membership_criteria_priority_sort (priority_sort, 8 items)

**Status:** PASS — one-pole design is intentional.

8 items all on the assimilationist (CU low) side; no opposing-pole items. By design — the question asks which criteria *count* for membership; not-picking is the pluralist signal. CU pos distributions correctly graded:

- `ancestry` peak=1 at 0.55 — strongest assimilationist signal ✓
- `born_here`, `religion` peak=1 at 0.50/0.55 — strong ✓
- `speak_lang`, `cultural` peak=2 at 0.32 — mild ✓
- `shared_values`, `civic_part` peak=3 at 0.40 — neutral (civic-pluralist compatible) ✓
- `economic` peak=3 at 0.32 — neutral ✓

`moralCircle.scopedAffinities` values graded by tribalism intensity (`ancestry: 80` > `born_here: 75` > `religion: 75 + religious:75` > `cultural: 65` > `speak_lang: 60` > `economic: 55`). Civic items write `universal: 65` (mild civic-universalist lean).

No fix needed.

### Q209 — zero_sum_economics_view (single_choice, 4 options)

**Status:** MINOR — slight extreme-pole asymmetry.

- `pie_grows_for_all` → ZS.pos peak=1 at **0.55**
- `rigged_against_most` → ZS.pos peak=5 at **0.46**

Same pattern as Q97 — the "low" pole pulls harder. The salience evidence is differently asymmetric: `rigged.sal = [0.02, 0.10, 0.30, 0.58]` is heavier than `pie.sal = [0.05, 0.20, 0.40, 0.35]`, which is reasonable (the extreme-conflict picker is more salience-loaded). It's only the **position** dist asymmetry that's the artifact.

**Suggested:** symmetrize ZS.pos to ~0.50/0.50 (e.g., `rigged.ZS.pos → [0.02, 0.05, 0.13, 0.30, 0.50]`).

### Q210 — human_malleability_view (single_choice, 4 options)

**Status:** MINOR — extreme-pole asymmetry + 4-options-on-5-bucket spacing.

- `largely_fixed` → ONT_H.pos peak=1 at **0.50**
- `mostly_made_by_environment` → ONT_H.pos peak=5 at **0.46**

Same minor extreme asymmetry as Q97/Q209. Additionally: with 4 options mapping to a 5-bucket distribution, the spacing is `peak=1, peak=2, peak=4, peak=5` — the center (peak=3) is split between `modest_shaping` and `substantial_shaping`. Acceptable, but a tighter mapping could be `peak=1, peak=2.5, peak=3.5, peak=5` or similar.

**Suggested:** symmetrize extreme peaks; consider whether 5 options would map more naturally to 5 buckets (adds friction, may not be worth it).

### Q214 — institutions_foundational (single_choice, 5 options)

**Status:** MINOR — reversed asymmetry vs Q97/Q209/Q210.

- `foundational_essential` → ONT_S.pos peak=5 at **0.50**
- `obstacles_to_progress` → ONT_S.pos peak=1 at **0.55**

Here the institution-essential pole is *weaker* and the anti-institutional pole is *stronger* — opposite direction of Q97/Q209/Q210. So the "weak high pole" pattern isn't universal across the bank; it's calibration noise rather than a systemic bias.

**Suggested:** symmetrize to 0.50/0.50.

### Q8 — domestic_vs_abroad_lives (single_choice, 3 options)

**Status:** PASS — universal-scalar asymmetry is intentional.

- `clearly_domestic`: MOR.pos peak=1 at 0.55; universal=30; national_scoped=75
- `hard_to_say`: MOR.pos peak=3 at 0.48; universal=55
- `clearly_abroad`: MOR.pos peak=5 at 0.55; universal=75

MOR.pos extremes are mirror-perfect (0.55 both). Universal scalar asymmetry (30 vs 75) is intentional per the 2026-05-18 comment — `clearly_abroad` caps at the IDP gate ceiling (75) so universalist respondents can still route to identity-primary archetypes when an orthogonal scope produces excess ≥ 20. Documented and defensible.

No fix needed.

### Q229 — moral_circle_in_group_sort (priority_sort, 6 items)

**Status:** PASS.

All 6 in-group items write `scopedAffinities: { [scope]: 95 }` uniformly. Symmetric, high-magnitude, single-scope per item. The supportHigh anchor at 95 lets respondents with strong in-group affinity produce excess ≥ 20 above the IDP gate's universal ceiling of 75.

No fix needed.

## Cross-cutting findings

### F1 — Extreme-pole asymmetry pattern (Q97 + Q209 + Q210, opposite in Q214)

Four router questions exhibit a 5–10 pp asymmetry between their extreme-pole position peaks:

| Question | Low-pole peak | High-pole peak | Direction |
|---|---|---|---|
| Q97 PF.pos | 0.55 | 0.45 | low pulls harder |
| Q97 ENG.pos | 0.60 | 0.53 | low pulls harder |
| Q209 ZS.pos | 0.55 | 0.46 | low pulls harder |
| Q210 ONT_H.pos | 0.50 | 0.46 | low pulls harder |
| Q214 ONT_S.pos | 0.50 | 0.55 | **high** pulls harder (reversed) |

Three questions match a "low-pole-stronger" pattern; one (Q214) reverses it. Most likely just hand-tuning drift rather than a deliberate bias — but if there's a deliberate design principle in the asymmetry (e.g., "salient-affirmation answers are noisier than salient-rejection answers"), it should be documented. Otherwise, normalize to symmetric peaks (~0.50/0.50 each).

**Impact:** Each individual asymmetry is small; cumulative effect on archetype matching is probably 1–3 pp. Phase 4 cleanup item, not blocking.

### F2 — Cross-question categorical prototype calibration not audited here

Q89 and Q218 delegate evidence entirely to `EPS_PROTOTYPES` and `AES_PROTOTYPES` from `src/config/categories.ts`. Those prototypes are reused across multiple questions; an audit of their internal calibration (e.g., does `EPS_PROTOTYPES.empiricist` represent that category at the right distribution shape?) is a separate, slice-wide audit task. Deferred.

### F3 — Q103's empty per-item evidence is correct but unusual

The audit script reports 0 evidence rows for Q103 because its rankingMap items are `{ continuous: { MAT: {} } }` — empty inner objects. The actual evidence emission comes from `salienceBuckets` aggregation in `applyPrioritySort`, not from the rankingMap. This is by design (per the 2026-04-23 comment) but it means Q103 is invisible to row-level audits. Future audits should special-case priority_sort questions with `salienceBuckets` and emit a virtual row per bucket per node.

**Suggested:** extend `audit-per-response.mjs` to read `salienceBuckets` and emit synthesized rows for the four bucket × N nodes covered by the rankingMap items. Would surface 11 nodes × 4 buckets = 44 virtual rows for Q103. Deferred to a follow-up audit-script enhancement.

## Phase 3 router-slice summary

**Total router-slice rows examined manually:** 112 (per inventory) + Q103's effectively-empty rows.

**Fixes proposed:** 0 sign errors, 0 hollow rows, 4 minor symmetry adjustments (Q97/Q209/Q210/Q214 extreme peaks), 0 SALIENCE-vs-POSITION violations.

**Severity:** All findings LOW. None block harness work or require an immediate fix. The structural bug fixed in Phase 2 (missing MORAL_CIRCLE touches) was the high-impact finding; the §5.5 manual annotation surfaces only minor calibration adjustments.

**Recommendation:** treat F1 as a Phase 4 batch cleanup (sweep all single_choice extreme-pole pairs to symmetric 0.50/0.50, document the design choice). Address F3 by extending the audit script. Move forward to Phase 5 (harness skeleton) — the manual annotation confirmed there's no structural calibration bug in the router slice that would corrupt harness results.

## What's next (revised contingency tree)

1. **Phase 5 (harness skeleton) is unblocked.** No structural calibration bug in the router slice; harness data will surface where calibration matters empirically.

2. **Phase 4 (batch fix) becomes a follow-up cleanup**, not a prerequisite. Specifically:
   - Symmetrize extreme-pole peaks on Q97/Q209/Q210/Q214 (4 single_choice questions, ~8 dist edits).
   - Extend `audit-per-response.mjs` to emit virtual rows for priority_sort `salienceBuckets`.

3. **Phase 3 expansion to non-router questions** can run in parallel with Phase 5 — but most non-router questions either (a) use the same patterns as router questions (single_choice with extreme-pole pairs), so F1 findings extend naturally, or (b) are conditional / late-stage, so misfires are bounded by their eligibility gates.

4. **Categorical prototype calibration audit** (F2) is its own slice-wide task. Deferred until the harness shows whether EPS/AES landings deviate from persona ground truth.

5. **Open micro-decisions** (Kirchnerism dysfunction grade; Q243 wording) — still parallel anytime.
