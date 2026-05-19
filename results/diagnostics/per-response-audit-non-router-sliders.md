# Per-Response Evidence Audit — Non-Router Slider Slice (§5.5)

**Phase:** Phase 3b — slice 1 of ~5
**Date:** 2026-05-19
**Spec:** HARNESS-HANDOFF.md §5.5
**Scope:** 17 non-router slider questions (Q2, Q3, Q4, Q12, Q13, Q19, Q35, Q38, Q40, Q44, Q49, Q51, Q69, Q71, Q84, Q230, Q231)
**Total rows audited:** 145

The mechanical audit (per-response-inventory.json) reports 0 hollow rows
and 0 EVIDENCE_NOT_IN_TOUCHPROFILE flags across this slice. This §5.5
pass annotates SIGN / MAGNITUDE / SYMMETRY / SALIENCE-vs-POSITION
judgment per question.

## Per-question status

| Q | Promptshort | Touches | Status |
|---|---|---|---|
| Q2 | political_identity_centrality | PF (0.80), ENG (0.35) | MINOR — low-pole asymmetry; PF/ENG entanglement (residual after Phase 7 P1; coupling not problematic in current battery) |
| Q3 | cultural_social_placement | CD (0.90) | PASS — perfectly symmetric mirror (peak 0.60 both poles) |
| Q4 | cultural_social_salience | CD (0.90), CU (0.45), MOR (0.20) | MINOR — MOR slight under-pull at high pole (0.48 vs 0.50 low); 3-node entanglement |
| Q12 | guess_top_marginal_tax_rate | EPS (0.35) | UNUSUAL — both extreme buckets map to `intuitionist`, middle to `institutionalist`. Quality=0.68 acknowledges weak signal. Likely intentional (knowing-the-right-answer = institutionalist). |
| Q13 | preferred_top_marginal_tax_rate | MAT (0.92) | PASS — clean mirror (peak 0.60 both poles), polarity correctly inverted (high tax slider = MAT low) |
| Q19 | human_progress_salience | ONT_H sal (0.95) | MINOR — reversed asymmetry (high pole 0.60 > low pole 0.55) |
| Q35 | percent_groups_want_best_share_values | TRB (0.80), ZS (0.55) | ENTANGLEMENT — TRB and ZS use **identical** distributions across all 5 buckets. No discrimination between high-tribal-positive-sum vs low-tribal-zero-sum cases. |
| Q38 | rules_procedures_matter_salience | PRO sal (0.95) | MINOR — same reversed-asymmetry shape as Q19/Q49/Q69/Q71 |
| Q40 | opponents_matter_to_identity | PF (0.65), TRB (0.70) | MEDIUM — TRB extreme-pole asymmetry (0.65 low vs 0.50 high — 15pp gap); PF/TRB lock-step entanglement |
| Q44 | views_changed_in_10_years | PF (0.18) | PASS — clean mirror, polarity correctly inverted, very low weight (0.18) so impact is bounded |
| Q49 | social_progress_salience | ONT_H sal (0.95), ONT_S sal (0.20) | MINOR — ONT_H reversed asymmetry; ONT_H/ONT_S lock-step |
| Q51 | immigration_national_identity_salience | CU sal (0.90), CD sal (0.25), TRB_ANCHOR | MINOR — same reversed-asymmetry shape; CU/CD lock-step; TRB anchor distribution shifts sensibly across buckets |
| Q69 | common_ground_salience | COM sal (0.90) | MINOR — same reversed-asymmetry shape (0.55 low, 0.60 high) |
| Q71 | rhetoric_style_importance | AES sal (0.90) | MINOR — same reversed-asymmetry shape |
| Q84 | institutions_harden_into_domination | ZS pos+sal, ONT_H, COM, PRO, EPS — 6 touches | COMPLEX — multi-touch Likert; coherent direction at extremes (institutions-fine end ZS-low / ONT_H-high / COM-trust / PRO-trust / EPS-empiricist; institutions-corrupt end inverted). Heavy entanglement by design (single-slider answer drives 6 dimensions). |
| Q230 | universal_baseline_humanity | MORAL_CIRCLE.affinity (0.10, post-Phase-2) | PASS — scalar writes per bucket: 10/30/50/65/75. Mirror not applicable (universal is one-pole). |
| Q231 | universal_baseline_stranger | MORAL_CIRCLE.affinity (0.10, post-Phase-2) | PASS — same shape as Q230 |

## Cross-cutting findings

### CF1 — Reversed extreme-pole asymmetry on salience sliders

**Five sliders share an identical asymmetry pattern:** low-pole peak 0.55, high-pole peak 0.60. Affects Q19, Q38, Q49, Q69, Q71 — all of which are "how salient is X" sliders. The high pole pulls slightly harder than the low pole.

Compared to Phase 7 P1's router F1 finding (which had **low pole stronger** on position sliders), this is the **reverse** asymmetry on salience sliders. Two distinct calibration patterns:

| Pattern | Where | Effect |
|---|---|---|
| Low-pole stronger (F1 router) | Q97, Q209, Q210, Q214 (single_choice position) | "I don't care / disagree" pulls harder than "I care strongly" |
| High-pole stronger (CF1 sliders) | Q19, Q38, Q49, Q69, Q71 (slider salience) | "Very salient to me" pulls harder than "not salient" |

Each individual gap is 5pp. Cumulative effect on persona signature is small. **Phase 4 batch cleanup candidate** — symmetrize both patterns to 0.55/0.55 or 0.60/0.60 across the bank.

### CF2 — Same-direction multi-touch entanglement on slider questions

Sliders with multiple node touches all share a common pattern: each bucket writes to every touched node in lock-step. A single slider position can't decouple correlated-but-distinct dimensions.

| Question | Coupled nodes | Symptom |
|---|---|---|
| Q35 | TRB + ZS (identical dists) | Cannot distinguish tribal-positive-sum from non-tribal-zero-sum |
| Q40 | PF + TRB (lock-step) | Same — partisan identity and tribal identity always covary |
| Q49 | ONT_H + ONT_S (lock-step) | Human-malleability salience tied to institutional-trust salience |
| Q51 | CU + CD (lock-step) | Cultural-uniformity and cultural-direction salience always together |
| Q84 | ZS + ONT_H + COM + PRO + EPS | 6-node coupling on a Likert; intentional design but limits discrimination |
| Q4 | CD + CU + MOR (3-touch) | All cultural salience touches together |

This is the same family of finding as Phase 7 P1's Q97 PF/ENG coupling — *single-axis UI cannot carry independent multi-dimensional signal*. The fix-paths sketched in Phase 7 P1 generalize:

- **Split into multiple sliders** (one per node) — cleanest, but adds quiz length
- **Per-option decoupling** (Phase 7 Path A: remove one node's emission from one bucket where the coupling is least defensible)
- **Accept as design tradeoff** (most current questions take this stance — the prompt itself bundles signals semantically)

For most of these sliders, the entanglement is **semantically defensible** at the prompt level. E.g., Q40's "opponents matter to identity" really is about both partisan-fusion (PF) and tribal-identification (TRB) — they covary in real respondents. Q35's "% of groups share my values" is genuinely both an out-group estimate (TRB) and a worldview-zero-sumness (ZS) statement.

The exception flagged for review:

- **Q35 TRB+ZS identical distributions** — verbatim same numbers, not just correlated. If TRB and ZS are conceptually distinct (they're separate nodes!), they should at least have *slightly* different distributions. Suggested: weaken ZS's contribution to ~0.35 weight (currently 0.55) so Q35 stays primarily a TRB probe with mild ZS side-touch.

### CF3 — Q40 TRB extreme-pole asymmetry (MEDIUM, not LOW)

Q40 has a 15-percentage-point asymmetry on TRB: low pole peak 0.65, high pole peak 0.50. This is the largest single-question asymmetry in the slider slice. Combined with Q40's PF/TRB lock-step coupling, it means a persona declaring TRB=5 still gets pulled toward TRB=1 by Q40 more than a persona at TRB=1 gets pulled toward 5. Asymmetric prior.

**Suggested:** symmetrize Q40 TRB to 0.55/0.55 or 0.60/0.60 across poles. Verify with battery rerun.

### CF4 — Q12 unusual structure (informational)

Q12 maps 0-20 → intuitionist, 21-40 → empiricist, 41-60 → institutionalist, 61-80 → institutionalist, 81-100 → intuitionist. The doubled-bucket structure (institutionalist appears in both 41-60 and 61-80) reflects the question's design: respondents close to the actual marginal-tax-rate answer (factual knowledge) get scored as institutionalist; extreme guesses get scored as intuitionist (gut). Quality 0.68 acknowledges this is a weak signal — including factual-anchoring questions in PRISM is non-trivial.

Not a calibration issue per se. Documented as informational.

## Severity tally

- 0 SIGN errors
- 0 hollow / missing-touch rows
- 0 SALIENCE-vs-POSITION violations
- 1 MEDIUM (Q40 TRB asymmetry)
- 1 MEDIUM (Q35 TRB+ZS identical-dist redundancy)
- ~8 LOW (extreme-pole asymmetry pattern across CF1/CF2)
- 1 informational (Q12 doubled-bucket structure)

No findings block Phase 3b's next slice. All flagged items are calibration-tightening candidates for a Phase 4-style batch.

## Next slice

Phase 3b continues with **allocations (4 questions)** and **rankings (4 questions)** — narrow scope, ~50 rows total. After that, **priority_sort non-router pair (2 questions)**, **best_worst non-router pair (2 questions)**, **multi/pairwise/conjoint/dual_axis (5 questions)**. Then **single_choice (57 questions)** — the largest slice, split into 3-4 batches.
