# Scoring Experiment Task

## Goal
Implement TWO alternative scoring approaches in `src/engine/archetypeDistance.ts` and test both against the full 120-archetype simulation. Compare accuracy vs the current baseline (76.7% top-1).

## Current Architecture (Baseline)
File: `src/engine/archetypeDistance.ts`

The current `archetypeDistance()` computes a **weighted average** distance across all 14 nodes:
```
totalDist = Σ(nodeDist × nodeWeight) / Σ(nodeWeight)
```

Where:
- `nodeDist = positionDist * 0.65 + salienceDist * 0.35 + antiPenalty`
- `nodeWeight = archSalWeight * respondentSalWeight`
- `archSalWeight = 0.5 + archetype.sal * 0.5` (so sal=0→0.5, sal=3→2.0)

The posterior is then computed in `src/browser/api.ts` (and `src/test/simulation.ts`):
```
distance → softmax with temperature → posterior
```

Temperature: 0.12 → 0.04 by question 40.

## Problem
17 of 28 misses are "likelihood failures" — the right questions are asked, salience is adequate, but the posterior doesn't respond. Root cause: weighted average dilution. When an archetype differs from the winner on only 1-2 of 14 nodes, the signal gets diluted by 12 identical nodes.

## Approach 1: "Salience-Gated Accumulative"
Instead of averaging across all nodes, only compute distance on nodes where the archetype has sal ≥ 1. AND instead of dividing by total weight, use a **log-likelihood accumulation**:

```typescript
export function archetypeDistanceV1(state, archetype): number {
  let logLikelihood = 0;
  
  for each continuous node:
    if archetype.sal === 0: skip entirely
    
    // Position component
    const posProb = state.posDist[archetype.pos - 1];  // probability mass at archetype's position
    const salProb = state.salDist[archetype.sal];
    
    // Weight by archetype salience (higher sal = this node defines the archetype more)
    const salWeight = archetype.sal;  // 1, 2, or 3
    
    // Accumulate log-likelihood (more salient = stronger signal)
    logLikelihood += salWeight * Math.log(posProb + 0.001);
    logLikelihood += 0.5 * salWeight * Math.log(salProb + 0.001);
    
    // Anti-position penalty
    if (template.anti === "high" && expectedPos > 3.8)
      logLikelihood -= 2.0 * salWeight;
    else if (template.anti === "low" && expectedPos < 2.2)
      logLikelihood -= 2.0 * salWeight;

  for each categorical node:
    similar but using dot product of catDist × archetype.probs
    
  return -logLikelihood;  // negate so lower = better (consistent with current API)
}
```

Key difference: **No division by total weight.** Niche archetypes with more salient nodes get MORE signal, not diluted signal. If archetype A matches on 8 salient nodes and B matches on 3, A accumulates more log-likelihood.

## Approach 2: "Touch-Weighted Sharpened"
Keep the current weighted-average structure but fix the dilution with two changes:

1. **Only include nodes with touches > 0** in the distance calculation (don't dilute with unmeasured nodes)
2. **Scale nodeWeight by touch count** — nodes with more questions contribute more
3. **Sharpen the temperature** — cool to 0.02 instead of 0.04
4. **Increase archSalWeight range** — `0.25 + archetype.sal * 0.75` (so sal=0→0.25, sal=3→2.5)

```typescript
export function archetypeDistanceV2(state, archetype): number {
  // Same structure as current, but:
  // 1. Skip nodes where respondent has 0 touches
  // 2. nodeWeight *= Math.log(1 + touches)
  // 3. archSalWeight = 0.25 + template.sal * 0.75
}
```

## Implementation Plan

1. Add `archetypeDistanceV1()` and `archetypeDistanceV2()` as NEW functions in `src/engine/archetypeDistance.ts` (don't modify the original)
2. In `src/test/simulation.ts`, add a CLI flag `--scoring v1|v2|baseline` that switches which distance function is used in `updatePosteriors()`
3. For Approach 2, also change temperature in `updatePosteriors()` when v2 is selected
4. Run all three: `npx tsx src/test/simulation.ts --scoring baseline`, then `--scoring v1`, then `--scoring v2`
5. Write results comparison to `output/scoring-experiment-results.json`

## Files to Modify
- `src/engine/archetypeDistance.ts` — add two new functions
- `src/test/simulation.ts` — add --scoring flag, wire up alternative distance functions, adjust temperature for v2
- The `updatePosteriors()` function in simulation.ts needs to accept an optional distance function parameter

## DO NOT modify
- `src/browser/api.ts` (that's the live quiz — don't touch it yet)
- `src/config/*` (no profile/question changes in this experiment)

## Success Criteria
- Both approaches compile and run without errors
- Each produces a JSON results file
- Print summary: baseline vs v1 vs v2 accuracy (top-1, top-3, top-5)
- Print per-miss improvement table: which of the 28 misses does each approach fix?
