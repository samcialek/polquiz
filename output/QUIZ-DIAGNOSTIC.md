# PRISM Quiz Diagnostic Report
## 130-Archetype Accuracy Test — March 31, 2026

### Summary
- **Top-1 Accuracy: 76.7%** (92/120)
- **Top-3 Accuracy: 89.2%** (107/120)
- **Top-5 Accuracy: 95.0%** (114/120)
- **Mean questions: 43.6** | Median: 45 | Range: 27-55
- **Hit 55-question cap: 18 times** (15% of runs)
- **Stopped early (<40Q): 36 times** (30% of runs)

### Stopping Algorithm Assessment
The stopping algorithm is working but conservative. 18/120 runs hit the 55-question hard cap, meaning the posterior threshold (25%) was never reached. These tend to be the harder-to-discriminate archetypes. 

The 27-question minimum is a good sign — when the archetype has a distinctive profile, the engine locks on fast.

### Mismatch Classification

#### Category 1: STRUCTURAL NEIGHBORS (13 mismatches)
These are archetypes whose node profiles differ by ≤2.65 distance (4 or fewer nodes different by 1 point each). The quiz literally cannot distinguish them because their profiles are too similar.

| Expected | Got | Distance | Same/12 | Max Diff |
|----------|-----|----------|---------|----------|
| Jacobin Egalitarian | Uncompromising Redistributionist | 2.00 | 11/12 | ONT_H(2) |
| Burkean Steward | Institutional Conservative | 2.00 | 8/12 | CD(1) |
| Anti-Elite Populist | Folk Tribune | 2.00 | 8/12 | MOR(1) |
| Pastoral Leftist | Paternal Egalitarian | 2.24 | 7/12 | MAT(1) |
| Institutional Optimizer | Data-Driven Moderate | 2.24 | 7/12 | MAT(1) |
| Religious Leftist | Paternal Egalitarian | 2.45 | 6/12 | MAT(1) |
| Chestertonian Trad. | Security Paternalist | 2.45 | 6/12 | CD(1) |
| Rawlsian Reformer | Independent Social Democrat | 2.65 | 8/12 | PRO(2) |
| Moral Firebrand | Insurgent Equalizer | 2.65 | 8/12 | ONT_H(2) |
| Anarchist Mutualist | Horizontalist Dissenter | 2.65 | 8/12 | ZS(2) |
| Class-War Leftist | Uncompromising Redistr. | 3.00 | 9/12 | CU(2) |
| Embattled Majoritarian | Leader-Centered Insurgent | 2.65 | 8/12 | ENG(2) |
| Resentful Localist | Folk Tribune | 2.65 | 8/12 | ENG(2) |

**Diagnosis:** These are NOT quiz bugs. These archetypes are genuinely close in profile space. The quiz needs questions that specifically target the 1-2 differentiating nodes. Most of these are in top-3 already.

**Fix options:**
1. Add discriminator questions targeting the specific differentiating nodes
2. Merge the closest pairs into "families" (display top match + family)
3. Increase prior weights for underrepresented archetypes

#### Category 2: ATTRACTOR PROBLEM (9 mismatches)
These involve Social Stabilizer (4), Independent Social Democrat (5), or Folk Tribune pulling archetypes that are NOT structural neighbors (distance > 3.0).

| Expected | Got | Distance | Key Missing Nodes |
|----------|-----|----------|-------------------|
| Fairness Pragmatist | Social Stabilizer | 3.61 | ZS(2), many 1-diffs |
| World-Minded Reformer | Social Stabilizer | 4.12 | ZS(3) |
| Popperian Liberal | Social Stabilizer | 4.47 | ZS(3), MOR(2) |
| Halifax Moderate | Social Stabilizer | 4.47 | Only 1/12 same! |
| Global Caretaker | Ind. Soc. Democrat | 2.65 | Many small diffs |
| Evidence Reformer | Ind. Soc. Democrat | 2.65 | Many small diffs |
| Institutional Centrist | Ind. Soc. Democrat | 3.32 | CD(2) |
| Good Neighbor | Ind. Soc. Democrat | 3.46 | CD(2) |
| Spectator Citizen | Data-Driven Moderate | 2.65 | CU(2) |

**Diagnosis:** **Social Stabilizer and Independent Social Democrat have "default" profiles** — they sit near the center of the distribution. When the quiz can't differentiate, it falls toward these centrist attractors. This is a genuine structural issue.

**Fix options:**
1. **Population weights** — these attractors probably have too-high priors, pulling uncertain posteriors toward them
2. **Anti-prior mechanism** — penalize archetypes that win too often
3. **Targeted discrimination questions** for ZS, MOR, PRO nodes (the key differentiators Social Stabilizer wins on)

#### Category 3: ANSWER SELECTION FAILURES (6 mismatches)
These are archetypes with enough node distance from the winner that my optimal-answer algorithm should have been able to differentiate, but distance > 3.5 and correct was not in top 3.

| Expected | Got | Distance | Rank |
|----------|-----|----------|------|
| Free-Exchange Modernist | Evidence Reformer | 4.12 | >5 |
| Comfortable Bystander | Rooted Social Reformer | 4.36 | >5 |
| Good Neighbor | Ind. Soc. Democrat | 3.46 | >5 |
| Passive Cynic | Survival Pragmatist | 3.00 | 3 |
| Halifax Moderate | Social Stabilizer | 4.47 | 4 |
| Embattled Majoritarian | Leader-Centered Insurgent | 2.65 | >5 |

**Diagnosis:** These might be my answer-selection algorithm failing to properly embody these archetypes. The Free-Exchange Modernist (MAT=5, libertarian) ended up as Evidence Reformer (MAT=2, centrist) — a 3-point MAT difference that the quiz should catch. My scoring function may be weighting nodes incorrectly, or the archetype's categorical nodes (EPS, AES) aren't being leveraged well.

**Fix options:**
1. Improve the answer selection heuristic (weight salience more, handle categorical nodes better)
2. Rerun these specific archetypes with improved scoring to verify

### Key Findings

#### The Stopping Algorithm
- **Working well for distinctive archetypes** — 30% stop before 40 questions
- **Conservative for similar archetypes** — 15% hit the 55 cap
- The hard cap at 55 is appropriate — these are cases where more questions wouldn't help

#### The Big Three Attractors
1. **Independent Social Democrat** (5 misassignments) — centrist-left attractor
2. **Social Stabilizer** (4 misassignments) — centrist attractor
3. **Folk Tribune** (2 misassignments) — populist attractor

These three share a common trait: **moderate/centrist profiles that many archetypes converge toward when the discriminating nodes haven't been sufficiently measured.**

#### The Root Cause: Population Weights
All 130 archetypes currently have **equal priors** (1/130 each). In reality:
- Social Stabilizer and Independent Social Democrat represent ~3-5% of the population each
- Rare archetypes (Emergency Orderist, Anarchist Mutualist) represent <0.5%
- Equal priors mean centrist archetypes have a structural advantage — they're "close enough" to many profiles

**TESTED: Population weights as priors WORSENED accuracy** — centrist archetypes (Ind. Social Democrat, Social Stabilizer) have moderate weights (1.2%, 0.8%) that compound with their structural advantage, pulling even more misassignments. Reverted to uniform priors. The fix needs to be in the **question bank and distance function**, not the priors.

#### Question Bank Gaps
The quiz has 76 questions across 14 nodes. Key gaps:
- **ZS (Zeitgeist Salience)** — only a few questions target this, yet it's the key differentiator for Social Stabilizer mismatches
- **ONT_H (Ontological Humanism)** — distinguishes Jacobin vs Uncompromising Redistributionist
- **CD (Creative Destruction)** — distinguishes Institutional Centrist vs Independent Social Democrat
- **Pairwise questions** — only 1 in the bank. More pairwise comparisons would help discriminate close neighbors

### The 6 Worst Mismatches (Not in Top 5)

Analysis of the completely-missed archetypes reveals a **salience pattern**:

| Archetype | Nodes at sal=1 | Key Issue |
|-----------|---------------|-----------|
| Institutional Optimizer | 0/12 (all s2) | Centrist profile (3-4 on everything), invisible |
| Chestertonian Traditionalist | 6/12 at s1 | Engine can't see what's distinctive |
| Embattled Majoritarian | 3/12 at s1 | Centrist + low salience = absorbed |
| Comfortable Bystander | 8/12 at s1 | Almost invisible — doesn't care about politics |
| Good Neighbor | 3/12 at s1, many s1-s2 | Centrist positions |
| Free-Exchange Modernist | 1/12 at s1 | **ANSWER SELECTION FAILURE** — MAT=5 but quiz gave MAT=2 result |

**Free-Exchange Modernist is the only true algorithm bug** — extreme libertarian profile (MAT=5, PRO=1, CU=5) should be unmistakable, but my answer selection mapped it to centrist/reform territory. The others are structural: the archetypes are genuinely hard to distinguish with these questions.

### Root Cause Analysis

**The distance function doesn't weight by salience.** The engine uses Euclidean distance across all 12 continuous nodes equally. An archetype with sal=1 on 8 nodes contributes as much noise from those irrelevant nodes as the 4 high-salience ones contribute signal. This means:
- Distinctive archetypes (high salience on key nodes) identify well
- "Background" archetypes (low salience, centrist) absorb uncertainty

**The answer selection heuristic works for 76.7% of cases** but fails when:
1. Many nodes are near-centrist (3) — the scoring can't differentiate options
2. Extreme positions on ONE node (MAT=5) should dominate but get diluted by many moderate nodes

### Recommendations (Priority Order)
1. **Salience-weighted distance function** — highest-impact structural fix. Weight each node's contribution by `(salience/3)^2` so sal=3 counts 1x, sal=2 counts 0.44x, sal=1 counts 0.11x
2. **Family display** — show "family" for top-2 when posterior gap < 5% (13 of 28 mismatches are structural neighbors)
3. **Add 5-8 discriminator questions** targeting ZS, ONT_H, CD nodes
4. **Fix answer selection for extreme profiles** — when an archetype has pos=1 or pos=5 with sal=3, that node should dominate answer choice
5. ~~Population weights~~ **TESTED AND REJECTED** — worsened accuracy by strengthening attractor archetypes
6. **Consider merging** the 3 pairs with distance < 2.0 (Jacobin/Uncompromising, Burkean/Institutional, Anti-Elite/Folk Tribune)

### What's NOT Broken
- **Stopping algorithm**: 30% stop early (< 40Q), median 45Q, mean 43.6Q — appropriate
- **55-question hard cap**: Correct to have — prevents infinite loops on undecidable cases
- **Categorical node handling**: EPS and AES questions contribute correctly
- **The quiz itself**: 76.7% top-1, 89.2% top-3, 95.0% top-5 is strong for 130 archetypes on 76 questions
