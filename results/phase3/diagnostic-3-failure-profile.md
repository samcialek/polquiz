# Diagnostic 3 — per-archetype failure profile under the new WTA scorer

**Purpose.** Localize where the Euclidean-WTA scorer is failing. Which
archetypes fail, which confounders dominate, which shape patterns
(broad-salience bias, anti-flag density, categorical-heavy loading)
correlate with failure. Post-mortem for ADR-003; no fix work.

**Sources.**
- `results/phase3/diagnostic-artifacts/diagnostic-1-results.json` — per-run
  winners under each of the four scoring variants.
- `src/config/archetypes.ts` — archetype signatures.
- `results/phase3/diagnostic-artifacts/analyze-failures.py` — parser + stats.
- `results/phase3/diagnostic-artifacts/diagnostic-3-profile.json` — full
  per-archetype cross-reference.

## Outcome decomposition

| outcome | n | notes |
|---|---|---|
| Wins under WTA                              | 55 / 121 | scorer correctly resolves |
| Losses under WTA                            | 66 / 121 | scorer picks a confounder |
| ├─ **WTA-only losses** (old scorer wins)    | **43**   | **the WTA scoring function broke these** |
| └─ deep losses (both scorers miss)          | 23       | node-discrimination signal limit — Stage 4 regardless |
| Cases where WTA wins but old loses          | 0        | no archetype is uniquely WTA-friendly |

The 43 WTA-only losses are the scorer's direct damage. The 23 deep losses
are pre-existing Stage-4 attractor sharpening items that no scorer change
will solve alone.

## Confounder concentration — where the WTA pushes targets

**Top attractors under WTA (WTA-only losses):**

| confounder id | name | # targets pulled | typical profile |
|---|---|---|---|
| 005 | Pluralist Structuralist   | 6 | broad moderate salience, centrist |
| 125 | Reluctant Partisan        | 5 | low-salience, near-uniform signature |
| 103 | Grievance Mobilizer       | 5 | hard-right populist |
| 112 | Engaged Cosmopolitan      | 4 | cosmopolitan moderate |
| 086 | Duty Traditionalist       | 4 | traditional-right moderate |
| 091 | Security Paternalist      | 3 | near-center security-oriented |
| 014 | Activist Progressive      | 2 | progressive centroid |
| 004 | Labor Reformer            | 2 | labor-left centroid |

**Pattern.** The attractors are all **centroid-shape** archetypes — broad
moderate coverage with few anti flags. They are the "flatter" signatures
in the distance landscape, which under weighted Euclidean means they sit
closer to any perturbation-of-respondent-state than the sharper, more
committed archetypes sitting farther out on the axes.

Under the OLD scalar distance (which normalized by total weight and used
both mean-diff and prob-at-pos terms), these centroid archetypes did not
swallow their neighbors because the salience-weighted position probability
at the archetype's pos was load-bearing. Under the new Euclidean WTA, only
squared position difference matters, and that makes centroids win.

## Anti-flag pattern — the smoking gun

| signature metric | WTA wins (target) | WTA-only losses (target) | Δ |
|---|---|---|---|
| Anti flags (continuous anti + categorical antiCats) | **3.95** | **5.23** | +1.28 |
| High-salience nodes (sal ≥ 2)                       | 5.80      | 8.72      | +2.92 |
| Active-salience nodes (sal ≥ 1)                     | 12.75     | 13.09     | +0.34 |

**Losing targets have 32% more anti flags and 50% more high-salience nodes
than winning targets.** The Euclidean WTA with its `+10` fixed anti penalty
disproportionately punishes the sharply-defined archetypes — the ones with
the strongest identity claims.

**For the 43 WTA-only losses: target vs its WTA confounder**

| metric | target mean | confounder mean | skew |
|---|---|---|---|
| Anti flags              | 5.23 | **3.84** | target has MORE anti flags than its confounder |
| High-salience nodes     | 8.72 | **5.14** | target has MANY MORE high-sal nodes than confounder |
| Categorical sal total   | 2.95 | **2.37** | target has more categorical loading |
| Active-sal nodes        | 13.09 | 12.35 | similar |

When the WTA misclassifies, it systematically routes **sharply-defined
targets** to **softer-defined confounders**. This is the Euclidean-with-
anti-penalty scaling problem:

- Target has 5 anti flags. Probability that ≥1 anti fires on residual
  respondent-state noise (pR > 3.8 or pR < 2.2) is non-trivial. Each
  fired anti adds `+10` pre-sqrt — ~3.2 post-sqrt.
- Confounder has 3 anti flags. Lower fire-rate by simple odds.
- A single anti misfire can move 3+ distance units, dwarfing real
  node-level position differences (which are in the `(Δp)² · w = 0…16`
  range per continuous node pre-sqrt, typically 0-4 post-sqrt).

**The anti penalty of 10 was not calibrated against the rest of the
distance.** It biases every high-commitment archetype toward its
lower-commitment neighbor.

## Rank-drop severity on WTA-only losses

Where does the true target land under WTA?

| rank under WTA | count |
|---|---|
| 2              | 12 |
| 3              | 7  |
| 4–5            | 7  |
| 6–10           | 10 |
| 11–20          | 2  |
| **21+**        | **5** |

12 of 43 losses are rank-2 (target was close). 17 are rank ≥ 6. Five fall
beyond rank 20 — these are the catastrophic scrambles:

| target | name | WTA rank | OLD rank | WTA confounder |
|---|---|---|---|---|
| 029 | Liberationist Progressive | **48** | 1 | 043 Quiet Egalitarian |
| 015 | Moral Firebrand            | **34** | 1 | 014 Activist Progressive |
| 120 | Good Neighbor              | **33** | 1 | 074 Responsible Conservative |
| 062 | Meritocratic Liberal       | **25** | 1 | 125 Reluctant Partisan |
| 144 | LGBTQ Voter                | **23** | 1 | 004 Labor Reformer |

These are not near-miss family-pair confusions. These are targets the old
scorer identifies at rank 1 but WTA dumps to mid-pack or worse. The node
discrimination signal is intact; the scorer is routing it wrong.

Additional high-rank drops in the top-10 list:
- 001 Rawlsian Reformer → 005 Pluralist Structuralist (rank 20) — the 021/001
  attractor documented in `attractor-021-resolved.md` is the mirror image
  of this (001 now lands on 005).
- 036, 028, 118, 146 — all drop to rank 10 or worse. All have multiple
  anti flags.

## Categorical loading

Targets that lose under WTA have marginally higher categorical salience
(2.95 vs 2.37 for confounders) — consistent with the anti-flag finding.
Categorical anti-coverage is 82% (EPS) and 40% (AES) for active archetypes;
categorical anti contributions are `Σ p_R[antiCat] * max(s^A, s^R)`. Not
catastrophic individually but additive with continuous anti penalties.

## Deep losses — Stage 4 territory

23 targets lose under both scorers. These are **scoring-function-
independent** — the node-discrimination signal at ~28 representative-bank
questions is not enough to resolve them.

**Top deep-loss attractors:**
- 126 Uncompromising Activist — 4 deep losses
- 091 Security Paternalist    — 4 deep losses
- 004 Labor Reformer          — 3 deep losses

These remain Stage 4 attractor-sharpening candidates. The rollback to the
old scalar scorer does not fix them, but also does not make them worse.

## Verdict

1. **43 of 66 WTA losses are scorer-induced** (recoverable by rollback).
2. **The anti penalty is the primary mechanism.** WTA-only-loss targets
   have 36% more anti flags than their confounders on average. Misfire
   rates on anti = moving targets to softer neighbors.
3. **Centroid archetypes are dominant confounders.** 005 / 125 / 103 /
   112 / 086 account for 24 of 43 WTA-only losses (56%). These are the
   low-commitment signatures the Euclidean metric treats as the nearest
   everything-in-general.
4. **The Euclidean-WTA scaling was not calibrated.** `+10` anti penalty
   vs `(Δp)²·w` position contribution (max ~16 per continuous node pre-
   sqrt, typically 0–4 post-sqrt) means one anti misfire dominates
   5+ nodes of real position signal.
5. **23 deep losses are independent of scoring.** These go to Stage 4
   regardless.

Rolling back to the old scalar-distance scorer (variant B per Diagnostic
1) recovers the 43 WTA-only losses and leaves the 23 deep losses where
they were. Projected post-rollback top-1: **98 / 121 = 81.0%**, up from
55 (45.5%) under the current production scorer.

Artifacts:
- `results/phase3/diagnostic-artifacts/diagnostic-3-profile.json` — full
  per-row data: 43 WTA-only losses + 23 deep losses with signature stats.
