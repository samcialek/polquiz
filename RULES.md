# RULES.md — Invariants and Constraints

## Hard Invariants
These are facts. They do not change between sessions.

1. There are exactly **124 archetypes**. Not 132, not 111, not 157. 124.
2. There are exactly **14 nodes**: MAT, CD, CU, MOR, PRO, EPS, AES, COM, ZS, ONT_H, ONT_S, PF, TRB, ENG.
3. Nodes belong to exactly **4 clusters**: ENDS, MEANS, REALITY, SELF.
4. **12 nodes are continuous** (scale 1-5). **2 are categorical** (EPS, AES — 6 categories each).
5. Each archetype has a **prior** (base rate), **node positions**, **salience scores**, and optional **anti-positions**.
6. The question bank targets specific nodes via **touch targets** with weights.
7. The quiz engine uses **Bayesian posterior updating** — not nearest-neighbor or scoring.

## 8 Removed Archetypes (from 132 → 124)
These were collapsed due to node signature overlap:
- 018 Social Avenger → 017 Uncompromising Redistributionist
- 038 Abundance Planner → 037 Fabian Modernizer
- 044 Parish Steward → 045 Rooted Social Reformer
- 066 Entrepreneurial Reformer → 065 Opportunity Liberal
- 068 Inventive Libertarian → 069 Bleeding-Heart Libertarian
- 113 Expressive Libertine → 112 Contrarian Intellectual
- 114 Political Nihilist → 111 Diogenes Independent
- 123 Contented Householder → 122 Civic Minimalist

## File Authority Hierarchy
1. `src/config/archetypes.ts` — THE archetype source of truth
2. `src/config/nodes.ts` — THE node definitions
3. `src/config/categories.ts` — THE categorical definitions
4. `src/types.ts` — THE type system
5. Everything else is derived, diagnostic, or historical

## Anti-Patterns (Things That Go Wrong)
- Counting archetypes from the wrong file and getting 132 or 111
- Regenerating archetype data from scratch instead of reading `archetypes.ts`
- Confusing `gh-dashboard/` outputs with source files
- Looking at `archive/` or backup files for current state
- Treating `prism_archetypes_calibrated.js` (111 archetypes, v157) as current
