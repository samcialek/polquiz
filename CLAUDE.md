# CLAUDE.md — PRISM Quiz Engine

## What This Project Is
The PRISM (Political Refraction and Identity Spectrum Model) quiz engine assigns users one of **124 political archetypes** based on their responses to ~65 dynamically selected questions. The quiz uses Bayesian posterior updating across 14 latent nodes to narrow down which archetype best fits the respondent.

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

## Archetype Node Signatures
Each archetype is defined by its position (pos 1-5) and salience (sal 0-3) on each node, plus optional anti-positions. Categorical nodes use probability distributions over their 6 categories.

## Key Numbers — DO NOT CHANGE
- **124 archetypes** (reduced from 132 — 8 removed for signature overlap)
- **14 nodes** (12 continuous + 2 categorical)
- **4 clusters** (ENDS, MEANS, REALITY, SELF)
- **~65 questions** in the question bank
- **6 EPS categories**, **6 AES categories**

## Canonical Files
| File | What It Contains | Authority |
|------|-----------------|-----------|
| `src/config/archetypes.ts` | All 124 archetype definitions with node signatures | **CANONICAL — do not regenerate** |
| `src/config/nodes.ts` | 14 node definitions with cluster assignments | **CANONICAL** |
| `src/config/categories.ts` | EPS/AES category names, prototypes, cost matrices | **CANONICAL** |
| `src/config/questions.full.ts` | Full question bank | **CANONICAL** |
| `src/config/questions.representative.ts` | Representative question subset | **CANONICAL** |
| `src/types.ts` | All TypeScript type definitions | **CANONICAL** |

## What NOT to Do
- ❌ Do NOT regenerate or "discover" the archetype count — it is 124, period
- ❌ Do NOT reference old files (prism_archetypes_calibrated.js, archetype_132_data.json, etc.)
- ❌ Do NOT change node definitions or add/remove nodes
- ❌ Do NOT look in `archive/` for current data — those are old versions
- ❌ Do NOT use files from `gh-dashboard/` or `docs/quiz/` as source of truth — those are built outputs

## What You CAN Do
- ✅ Modify quiz logic in `src/engine/`
- ✅ Add/modify questions in `src/config/questions.*.ts`
- ✅ Adjust archetype priors (the `prior` field)
- ✅ Run diagnostics (`src/*Diagnostic.ts`, `src/optimize/`)
- ✅ Build browser bundle (`src/browser.ts`)
