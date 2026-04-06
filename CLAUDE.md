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
- **7 TRB anchor categories** (national, ideological, religious, class, ethnic_racial, global, mixed_none)

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
- ✅ Adjust archetype priors (the `prior` field)
- ✅ Run diagnostics (`src/*Diagnostic.ts`, `src/optimize/`)
- ✅ Build browser bundle (`src/browser.ts`)
