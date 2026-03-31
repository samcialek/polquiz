# Task: Assign Population Weights to 130 PRISM Archetypes

## Goal
Create `output/live-data/population-weights.json` mapping each archetype ID (e.g., "001", "012") to its estimated share of the US adult population. All weights must sum to 1.0.

## Step 1: Read the Archetypes
- Read `src/config/archetypes.ts` to understand all 130 archetypes
- Each has 14 node positions (1-5 scale), salience (0-3), and categorical probabilities for EPS and AES
- Read `src/config/nodes.ts` for node polarity definitions
- Key nodes and their polarities:
  - MAT: 1=high redistribution, 5=free market
  - CD: 1=progressive, 5=conservative
  - CU: 1=closed/assimilationist, 5=open/pluralist
  - MOR: 1=narrow/particularist, 5=wide/universalist
  - PRO: 1=anti-procedural, 5=rules-bound
  - COM: 1=uncompromising, 5=consensus-seeking
  - ZS: 1=positive-sum, 5=zero-sum
  - ONT_H: 1=pessimistic, 5=optimistic
  - ONT_S: 1=system stable, 5=system broken
  - PF: 1=low personal freedom priority, 5=high
  - TRB: 1=low tribal identity, 5=high tribal
  - ENG: 1=disengaged, 5=highly engaged

## Step 2: Top-Down Anchoring
Use published political typology studies to anchor population shares:

### Pew Political Typology 2021 (8 groups):
- Faith and Flag Conservatives: ~10% (very conservative, religious, traditional values)
- Populist Right: ~11% (economically moderate, culturally conservative, anti-elite)
- Ambivalent Right: ~12% (moderate conservatives, less engaged)
- Stressed Sideliners: ~15% (disengaged, financially stressed, mixed views)
- Outsider Left: ~10% (young, progressive but cynical, low engagement)
- Democratic Mainstays: ~16% (moderate liberals, older, institutionalist)
- Establishment Liberals: ~13% (educated, progressive, high engagement)
- Progressive Left: ~6% (very progressive, highly engaged, young)

### Hidden Tribes 2018 (7 groups):
- Progressive Activists: 8%
- Traditional Liberals: 11%
- Passive Liberals: 15%
- Politically Disengaged: 26%
- Moderates: 15%
- Traditional Conservatives: 19%
- Devoted Conservatives: 6%

### Mapping approach:
1. For each of the 130 archetypes, determine which Pew and Hidden Tribes clusters it best matches based on node profile
2. Group archetypes into these clusters
3. Distribute each cluster's population share across its member archetypes (weighted by how central each archetype is to the cluster)

## Step 3: Bottom-Up Validation
Survey microdata is at: `C:/Users/Sam/Desktop/causal-vae-project/data/harmonized_v2.csv`
- 74K rows, 70 columns
- Key columns: pid7, ideology, auth1-3, rr1-4, news_interest, religion_importance, tipi_0-9, education, age_norm, female, race, income
- Map survey variables to PRISM nodes approximately:
  - pid7/ideology -> MAT + CD
  - auth1-3 -> PRO
  - rr1-4 -> CU + MOR
  - news_interest -> ENG
  - religion_importance -> TRB
- Score each respondent against archetype centroids using available mapped nodes
- Count archetype assignment frequencies as a validation check

## Step 4: Constraints
- No single archetype should exceed 8% of population
- Aggregate left vs right vs centrist split should be roughly 45/35/20
- Weights must sum to 1.0
- Previously, Security Paternalist dominated at 23% of random walks - it should be around 2-4%

## Step 5: Output Files
1. `output/live-data/population-weights.json` - main output
2. `output/population-weights-report.md` - methodology notes and validation
3. Update `scripts/export-all-data.cjs` to include `populationWeight` in each archetype entry

When completely finished, run this exact command:
```
openclaw system event --text "Done: Population weights computed for 130 archetypes" --mode now
```
