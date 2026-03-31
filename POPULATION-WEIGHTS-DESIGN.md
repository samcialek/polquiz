# Population Weights Design

## The Problem
Equal-weight (1/130) means every archetype counts the same.
A "Libertarian Meritocrat" (maybe 0.3% of the population) has the same
electoral weight as a "Duty Voter" (maybe 5% of the population).

This creates the Democratic structural lean — there are more progressive/
institutional archetype *types* than conservative ones, even though in
reality conservatives represent a larger share of the population.

## Approach: Estimate Population Shares

Rather than equal 1/130, assign each archetype a population weight
that reflects roughly what fraction of the US adult population they
represent.

### Tier System

**Large archetypes (3-5% each):**
These are the "normal" Americans — moderate, not very ideological.
- Duty Voter / Legacy Partisan / Civic Moderate types
- Pragmatic Conservative / Responsible Conservative
- Blue-collar Moderate / Working-class Traditionalist
- ~10-15 archetypes at 3-5% = ~50% of population

**Medium archetypes (1-3% each):**
More ideologically defined but still common.
- Libertarians, Evangelicals, Progressive Activists
- Suburban Moderates, Union Democrats, Business Conservatives
- ~30-40 archetypes at 1-3% = ~35-40% of population

**Small archetypes (0.3-1% each):**
Ideological niches, political junkies, extreme types.
- Class-War Leftist, Disruptive Cosmopolitan, Eco-Nihilist
- Accelerationist, Theocratic Nationalist, etc.
- ~80-90 archetypes at 0.3-1% = ~15-25% of population

### Constraints
- All weights must sum to 1.0
- No archetype should be < 0.1% (would be effectively invisible)
- No archetype should be > 6% (would dominate)
- Conservative + moderate archetypes should sum to ~55-60%
  (matching general US electorate lean)

### Calibration Strategy
1. Start with demographic base rates (education, income, urbanization,
   religiosity distributions from Census + ANES)
2. Adjust so 2020 popular vote roughly matches Biden 51.3% vs Trump 46.9%
3. Check that 2016 flips to Trump (or is within 1%)
4. Validate against known subgroup voting patterns:
   - White evangelicals → ~80% Republican
   - College-educated women → ~60% Democrat
   - Rural working class → ~65% Republican
   - Urban professionals → ~70% Democrat

### Implementation
In archetypes.ts, change `prior: 1/130` to calibrated weights.
The simulation already uses these priors in the quiz engine — 
for historical simulation, multiply archetype vote by its weight.

### Effect on Results
- Conservative archetypes get 2-4× their current weight
- Niche progressive archetypes get 0.3-0.5× their current weight
- Moderate/centrist archetypes get 1.5-2× weight
- Net effect: ~5-10% rightward shift in overall results
- Should fix 2024 miss and improve all margins
