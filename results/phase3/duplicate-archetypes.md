# Phase 3f — duplicate archetype detection

Ran on all 121 archetypes (active + deactivated) using the
production family-index distance metric (Euclidean sqrt of sum over nodes,
continuous = (ΔP)² · max(sA,sB), categorical = Σ (Δprob)² · max(sA,sB),
ENG-node skipped automatically — no archetype has an ENG template as of 3b).

Family threshold (10th percentile): **5.112**
Total unordered pairs: 7260

## Summary

- **Exact duplicates (d = 0):** 0
- **Near-duplicates (0 < d < 1):** 0
- **Close (1 ≤ d < 2):** 0

## Exact duplicates (d = 0)

*None.*

## Closest 30 pairs

| rank | d | a.id | a.name | b.id | b.name |
|---|---|---|---|---|---|
| 1 | 2.000 | 042 | Localist Progressive | 043 | Quiet Egalitarian |
| 2 | 2.173 | 081 | Heritage Guardian | 084 | Civilizational Conservative |
| 3 | 2.237 | 079 | National Developmentalist | 097 | Authority Pragmatist |
| 4 | 2.277 | 019 | Anarchist Mutualist [INACTIVE] | 020 | Grassroots Autonomist |
| 5 | 2.449 | 046 | Pastoral Leftist | 049 | Moral Egalitarian |
| 6 | 2.449 | 098 | Anti-Elite Populist | 107 | Resentful Localist |
| 7 | 2.449 | 127 | Tribal Loyalist | 129 | Loyal Republican |
| 8 | 2.495 | 103 | Grievance Mobilizer | 105 | Combative Populist |
| 9 | 2.545 | 003 | Consensus Redistributionist | 006 | Fairness Pragmatist |
| 10 | 2.604 | 095 | Emergency Orderist | 101 | Embattled Majoritarian |
| 11 | 2.611 | 101 | Embattled Majoritarian | 104 | National Protector |
| 12 | 2.646 | 082 | Altar-and-Hearth Conservative | 085 | Customary Localist |
| 13 | 2.663 | 144 | LGBTQ Voter | 145 | Feminist Voter |
| 14 | 2.688 | 101 | Embattled Majoritarian | 106 | Militant Partisan |
| 15 | 2.698 | 081 | Heritage Guardian | 092 | Partisan Tribalist |
| 16 | 2.828 | 032 | Hamiltonian Technocrat | 040 | Reform Engineer |
| 17 | 2.828 | 043 | Quiet Egalitarian | 049 | Moral Egalitarian |
| 18 | 2.828 | 046 | Pastoral Leftist | 050 | Traditionalist Moralist |
| 19 | 2.828 | 049 | Moral Egalitarian | 050 | Traditionalist Moralist |
| 20 | 2.828 | 111 | Cosmopolitan Nonconformist | 112 | Engaged Cosmopolitan |
| 21 | 2.828 | 124 | Latent Alarmist | 126 | Uncompromising Activist |
| 22 | 2.829 | 079 | National Developmentalist | 091 | Security Paternalist |
| 23 | 2.835 | 021 | Principled Cosmopolitan | 023 | Rights Cosmopolitan [INACTIVE] |
| 24 | 2.871 | 011 | Jacobin Egalitarian | 013 | Radical Leveler |
| 25 | 2.871 | 011 | Jacobin Egalitarian | 017 | Uncompromising Redistributionist |
| 26 | 2.917 | 003 | Consensus Redistributionist | 037 | Fabian Modernizer |
| 27 | 2.934 | 022 | Pluralist Universalist | 028 | Global Caretaker |
| 28 | 2.970 | 099 | Scarcity Populist | 103 | Grievance Mobilizer |
| 29 | 3.000 | 036 | Institutional Optimizer | 062 | Meritocratic Liberal |
| 30 | 3.000 | 042 | Localist Progressive | 048 | Solidaristic Localist |

## Signature diffs (5 closest non-zero pairs)

### 042 Localist Progressive ↔ 043 Quiet Egalitarian  (d = 2.000)

Identical continuous nodes: 8 / 11
Identical categorical nodes: 1 / 2

**Continuous differences (3):**

| node | aPos | bPos | aSal | bSal |
|---|---|---|---|---|
| MAT | 2 | 1 | 2 | 2 |
| CU | 2 | 2 | 2 | 1 |
| MOR | 3 | 4 | 1 | 2 |

**Categorical differences (1):**

- **AES**: aSal=1 bSal=2
  - a.probs: [0.06, 0.05, 0.62, 0.17, 0.03, 0.07]
  - b.probs: [0.06, 0.05, 0.62, 0.17, 0.03, 0.07]

### 081 Heritage Guardian ↔ 084 Civilizational Conservative  (d = 2.173)

Identical continuous nodes: 8 / 11
Identical categorical nodes: 1 / 2

**Continuous differences (3):**

| node | aPos | bPos | aSal | bSal |
|---|---|---|---|---|
| MAT | 4 | 3 | 1 | 1 |
| MOR | 2 | 3 | 2 | 2 |
| ZS | 4 | 3 | 1 | 1 |

**Categorical differences (1):**

- **AES**: aSal=1 bSal=1
  - a.probs: [0.16, 0.05, 0.62, 0.07, 0.03, 0.07]
  - b.probs: [0.04, 0.03, 0.04, 0.18, 0.63, 0.08]

### 079 National Developmentalist ↔ 097 Authority Pragmatist  (d = 2.237)

Identical continuous nodes: 5 / 11
Identical categorical nodes: 1 / 2

**Continuous differences (6):**

| node | aPos | bPos | aSal | bSal |
|---|---|---|---|---|
| MAT | 4 | 4 | 2 | 1 |
| CU | 2 | 1 | 1 | 2 |
| MOR | 2 | 1 | 2 | 2 |
| PRO | 4 | 4 | 2 | 1 |
| ONT_H | 2 | 3 | 1 | 1 |
| TRB | 3 | 3 | 2 | 1 |

**Categorical differences (1):**

- **AES**: aSal=1 bSal=1
  - a.probs: [0.60, 0.10, 0.09, 0.06, 0.09, 0.06]
  - b.probs: [0.60, 0.10, 0.04, 0.06, 0.14, 0.06]

### 019 Anarchist Mutualist ↔ 020 Grassroots Autonomist  (d = 2.277)

Identical continuous nodes: 9 / 11
Identical categorical nodes: 1 / 2

**Continuous differences (2):**

| node | aPos | bPos | aSal | bSal |
|---|---|---|---|---|
| ZS | 1 | 2 | 3 | 2 |
| TRB | 2 | 1 | 2 | 2 |

**Categorical differences (1):**

- **AES**: aSal=2 bSal=2
  - a.probs: [0.06, 0.05, 0.62, 0.17, 0.03, 0.07]
  - b.probs: [0.05, 0.05, 0.40, 0.38, 0.04, 0.08]

### 046 Pastoral Leftist ↔ 049 Moral Egalitarian  (d = 2.449)

Identical continuous nodes: 2 / 11
Identical categorical nodes: 1 / 2

**Continuous differences (9):**

| node | aPos | bPos | aSal | bSal |
|---|---|---|---|---|
| MAT | 2 | 1 | 2 | 2 |
| CD | 4 | 4 | 2 | 1 |
| CU | 2 | 2 | 2 | 1 |
| PRO | 3 | 4 | 1 | 1 |
| ZS | 2 | 2 | 2 | 1 |
| ONT_H | 4 | 3 | 2 | 1 |
| ONT_S | 3 | 2 | 1 | 1 |
| PF | 2 | 2 | 2 | 1 |
| TRB | 2 | 2 | 2 | 1 |

**Categorical differences (1):**

- **AES**: aSal=3 bSal=1
  - a.probs: [0.06, 0.05, 0.62, 0.17, 0.03, 0.07]
  - b.probs: [0.06, 0.05, 0.62, 0.17, 0.03, 0.07]

## Interpretation

- The family index uses a 10th-percentile cutoff (5.112), so any
  pair above that line shows up as a family member of both sides at quiz-result
  time. That is working as designed — family detection is about surfacing close
  neighbours in the UI, not flagging duplicates.

- Exact duplicates (d = 0) are the consolidation candidates. They are genuinely
  indistinguishable under the Phase-3 Euclidean scorer on the remaining 13 nodes
  (ENG was removed in 3b). Deactivated archetypes appearing in a d = 0 pair are
  benign — they cannot win MAP — but the active partner in such a pair may want
  a signature edit to keep identifiability.

- Near-duplicates (0 < d < 1) are typically one-salience-or-one-position deltas
  at low weight. Whether these matter depends on whether the current question
  bank actually probes the differing node. Cross-reference with Step 3 confusion
  matrices to decide.

**Next step.** Review the exact-duplicate list with Sam before Stage 4 consolidation.
No action is being taken on duplicates in this phase — Phase 3 is about the
scoring-layer rewrite; duplicate resolution is a content decision that belongs
alongside attractor-pair sharpening in Stage 4.
