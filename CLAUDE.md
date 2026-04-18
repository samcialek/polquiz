# CLAUDE.md — PRISM Quiz Engine

## What This Project Is
The PRISM (Political Refraction and Identity Spectrum Model) quiz engine assigns users one of **118 political archetypes** based on their responses to ~55–65 dynamically selected questions drawn from a ~74-question representative bank. The quiz uses Bayesian posterior updating across 14 latent nodes to narrow down which archetype best fits the respondent. This includes 6 **identity-primary archetypes** (Black Voter, White Grievance Voter, Evangelical Voter, LGBTQ Voter, Feminist Voter, Male Grievance Voter) — full archetypes activated when tribalism and political fusion dominate the respondent's profile.

## Architecture
- **5 endogenous layers** with 3 exogenous refraction layers between them
- The quiz operates at **Layer 3: Political Disposition** (the 14 nodes below)
- Layers 1-2 are latent (innate temperament → crystallized personality)
- Layer 4 is output (political behavior / vote choice)

## The 14 Nodes (Layer 3)
Organized into 4 clusters:

### ENDS — What you want
| Node | Full Name | Type | Scale |
|------|-----------|------|-------|
| MAT | Material Orientation | continuous | 1-5 |
| CD | Cultural Direction | continuous | 1-5 |
| CU | Cultural Uniformity | continuous | 1-5 |
| MOR | Moral Circle | continuous | 1-5 |

### MEANS — How you pursue it
| Node | Full Name | Type | Scale |
|------|-----------|------|-------|
| PRO | Proceduralism | continuous | 1-5 |
| EPS | Epistemic Style | categorical | 6 categories: empiricist, institutionalist, traditionalist, intuitionist, autonomous, nihilist |
| AES | Aesthetic Style | categorical | 6 categories: statesman, technocrat, pastoral, authentic, fighter, visionary |
| COM | Compromise Tolerance | continuous | 1-5 |

### REALITY — How you see the world
| Node | Full Name | Type | Scale |
|------|-----------|------|-------|
| ZS | Zero-Sum Orientation | continuous | 1-5 |
| ONT_H | Hierarchy Orientation | continuous | 1-5 |
| ONT_S | System Ontology | continuous | 1-5 |

### SELF — Your political identity
| Node | Full Name | Type | Scale |
|------|-----------|------|-------|
| PF | Political Fusion | continuous | 1-5 |
| TRB | Tribe | continuous | 1-5 |
| ENG | Engagement Level | continuous | 1-5 |

## Position vs. Salience — Two Independent Dimensions
Every person has both a **position** and a **salience** on each node:
- **Position** = *where* you fall on a node (e.g., redistributionist vs. free-market on MAT). Scale 1-5.
- **Salience** = *how much that node matters to you* — whether it's activated in your political identity. A person can have a clear MAT position but zero MAT salience because economic issues simply don't define their politics.

These are independent: someone may care deeply about a node they're moderate on, or be extreme on a node they don't care about.

At the **question level**, touch targets have a `role` field:
- `role: "position"` → the response moves the person's estimated position on that node
- `role: "salience"` → the response tells us how much the person *cares about* that node

At the **archetype level**, each archetype is defined by its position (pos 1-5) and salience (sal 0-3) on each node, plus optional anti-positions. Categorical nodes use probability distributions over their 6 categories. The engine matches a respondent to archetypes using both dimensions.

## Key Numbers — DO NOT CHANGE
- **118 active archetypes** (+3 deactivated with prior=0 kept in array for ID stability: 019, 023, 025). 112 base archetypes + 6 identity-primary archetypes (IDs 141-146). Priors are uniform at 1/118. History: 132 → 124 → 122 → 115 → 118 (added identity-primary archetypes).
- **14 nodes** (12 continuous + 2 categorical)
- **4 clusters** (ENDS, MEANS, REALITY, SELF)
- **~74 representative questions** (71 in full bank); engine adaptively selects ~55–65 per respondent, hard cap 55 in current stop rule
- **6 EPS categories**, **6 AES categories**
- **6 identity-primary archetypes** (IDs 141-146: Black Voter, White Grievance, Evangelical, LGBTQ, Feminist, Male Grievance)
- **9 TRB anchor categories** (national, ideological, religious, class, ethnic_racial, gender, sexual, global, mixed_none) — see TRB Anchor section below. Earlier "7 anchor" references in this repo are drift from an older version.

## Canonical Files
| File | What It Contains | Authority |
|------|-----------------|-----------|
| `src/config/archetypes.ts` | All 115 archetype definitions with node signatures | **CANONICAL — do not regenerate** |
| `src/config/nodes.ts` | 14 node definitions with cluster assignments | **CANONICAL** |
| `src/config/categories.ts` | EPS/AES category names, prototypes, cost matrices | **CANONICAL** |
| `src/config/questions.full.ts` | Full question bank | **CANONICAL** |
| `src/config/questions.representative.ts` | Representative question subset | **CANONICAL** |
| `src/identity/resolveIdentityPrimary.ts` | Identity Primary overlay resolver | **CANONICAL** |
| `src/historical/candidates.ts` | 60 US elections (1789–2024) with candidate node profiles | **CANONICAL** |
| `src/global/jurisdictions-*.ts` | 368 regime periods across 47 jurisdictions (1789–2026) | **CANONICAL** |
| `src/types.ts` | All TypeScript type definitions | **CANONICAL** |

## What NOT to Do
- ❌ Do NOT regenerate or "discover" the archetype count — it is 118 (112 base + 6 identity-primary), period
- ❌ Do NOT reference old files (prism_archetypes_calibrated.js, archetype_132_data.json, etc.)
- ❌ Do NOT change node definitions or add/remove nodes
- ❌ Do NOT look in `archive/` for current data — those are old versions
- ❌ Do NOT use files from `gh-dashboard/` or `docs/quiz/` as source of truth — those are built outputs
- ❌ Do NOT conflate Identity Primary overlays with base archetypes — they are a separate layer applied *after* archetype assignment

## What You CAN Do
- ✅ Modify quiz logic in `src/engine/`
- ✅ Add/modify questions in `src/config/questions.*.ts`
- ✅ Run diagnostics (`src/*Diagnostic.ts`, `src/optimize/`)
- ✅ Build browser bundle (`src/browser.ts`)

(Note: the `prior` field was removed from `Archetype` in Phase 3 and stays removed post-ADR-003 rollback — Diagnostic 1 established priors were always uniform and did not contribute to ranking.)

## TRB Anchor

**9 anchors** (not 7): `national, ideological, religious, class, ethnic_racial, gender, sexual, global, mixed_none`. The "7 anchor" count seen elsewhere in this repo was drift from an earlier version; corrected 2026-04-17.

**Step 1 diagnosis** (`results/trb-fix/diagnosis.md`) findings:
- **H3 confirmed.** `archetypes.ts` contains zero `trbAnchorPrior` entries. Every ranking scorer returns 0 on the prior product; every run lands on `national` by stable-sort artifact. The identity-primary resolution layer (141-146) has been gating on constant input.
- **H4 confirmed.** Q51/Q52/Q54/Q63 declare `TRB_ANCHOR` in `touchProfile` but have empty anchor evidence maps. The adaptive selector's TRB coverage counter is overcounting 5×; actual coverage is Q60 only.
- **H2 deferred.** Q60 per-touch JSD of 0.0178 nats is weak, but this cannot be meaningfully measured until H3/H4 are fixed.

**Status.** The Q51/Q52/Q63 evidence-map fix and Q54 cleanup proceeded as **Stage 1** of the roadmap (affects the per-node Bayesian layer, retained post-rollback) and have been **applied** to `src/config/questions.representative.ts` and `src/config/questions.full.ts`. The `trbAnchorPrior` specification effort remains **obsolete** — Diagnostic 1 showed priors were always uniform and cancel under softmax normalization; priors were never load-bearing. Post-ADR-003 rollback, the `prior` and `trbAnchorPrior` fields stay dead (not reinstated). The archived proposal lives at `results/archive/proposed-priors-SUPERSEDED.csv` for historical reference only.

**Applied changes (2026-04-17).** Regression diff in `results/trb-fix/regression-phase2.md`. Aggregate: top-1 86.8% → 86.0% (-1), top-3 94.2% → 93.4% (-1), top-5 unchanged, 0 deactivated-archetype MAP wins, 5 rank-shifts within miss territory (006, 016, 021, 056, 069). Stage-1 applied changes:
- Q51 `sliderMap` — 5 buckets populated with `trbAnchor` signal (global/mixed_none/ideological/national gradient by immigration-national-identity salience).
- Q52 `optionEvidence` — 4 options populated with `trbAnchor` (civic_participation, shared_values, cultural_heritage, born_here).
- Q63 `rankingMap` — 6 items populated with `trbAnchor` (fairness, procedural_integrity, national_strength, community_bonds, individual_freedom, tradition_continuity).
- Q54 cleanup — dropped hollow TRB position + TRB_ANCHOR rows from `touchProfile`; simplified `eligibleIf` to `["background_prior_only"]` (verified standalone predicate in the gate registry).

**Known attractor pair — deferred to Stage 4, not a Phase 2 regression.** `021 Principled Cosmopolitan → 001 Rawlsian Reformer`. Surfaced (not caused) by the Phase 2 TRB evidence-map fix: 021 was the only cosmopolitan archetype that baseline happened to resolve correctly — its cousins 023 Rights Cosmopolitan and 025 World-Minded Reformer were already collapsed into 001 pre-fix (baseline ranks 120 and 121). Post-fix, all three cosmopolitans share the 001 attractor. Mechanical cause identified: 021's and 001's final TRB anchor posteriors both collapse to flat `national`/`ideological` distributions (within 0.02 of each other in both runs) rather than concentrating 021 on `global`. 001-vs-021 posterior margin in 021's run is 0.087 (middle zone — not knife's edge <0.05, not substantive >0.15). Deferred to **Stage 4 attractor sharpening**; do not revert Phase 2.

## Architecture Decisions

Full ADRs in `results/architecture/`.

- **ADR-001 — scoring layer. SUPERSEDED** by ADR-003 on 2026-04-17. Proposed a Euclidean winner-take-all scorer on the premise that per-archetype priors were load-bearing. Diagnostic 1 rejected that premise: priors were always uniform in the codebase and cancel under softmax normalization. See `results/architecture/ADR-001-scoring-layer.md` (superseded).
- **ADR-002 — ENG migration.** In effect. ENG left archetype signatures and became a separate participation/abstention module in `src/engine/engagementLabel.ts`. Output surfaces as a dual label `<archetype>, <engagement level>`. See `results/architecture/ADR-002-eng-migration.md`.
- **ADR-003 — rollback of ADR-001 scoring layer.** In effect. Scoring restored to the pre-Phase-3 weighted scalar scorer at `src/engine/archetypeDistance.ts`; the Phase-3 Euclidean WTA is preserved as evidence at `src/engine/archetypeDistanceWTA.ts`. Post-rollback top-1: 105/121 = 86.8% (`results/phase3/regression-post-rollback.md`). Selector + stop-rule rework, ENG migration, hollow-touch drops, signature-distance family detection, and engagementLabel module are all **retained**. `prior` and `trbAnchorPrior` fields stay dead — not reinstated. See `results/architecture/ADR-003-rollback-scoring.md`.

Six-stage rollout sequence: `results/architecture/roadmap.md` (Stage 2 completed as rollback).
