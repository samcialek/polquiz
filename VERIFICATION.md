# VERIFICATION.md — Sanity Checks

Run these checks before and after any significant change.

## Quick Checks
```bash
# 1. Archetype count must be 124
grep -c '"id":' src/config/archetypes.ts
# Expected: 124

# 2. Node count must be 14
grep -c 'id:' src/config/nodes.ts
# Expected: 14

# 3. TypeScript compiles
npx tsc --noEmit

# 4. No references to removed archetypes
grep -n '"018"\|"038"\|"044"\|"066"\|"068"\|"113"\|"114"\|"123"' src/config/archetypes.ts
# Expected: empty (these 8 were removed)
```

## Diagnostic Tools
```bash
# Run accuracy simulation (tests quiz convergence)
npx tsx src/accuracyTest.ts

# Run confusion diagnostic (finds archetype pairs that get mixed up)
npx tsx src/confusionDiagnostic.ts

# Run coverage diagnostic (checks all archetypes are reachable)
npx tsx src/coverageDiagnostic.ts

# Run convergence diagnostic
npx tsx src/convergenceDiag.ts
```

## What "Working" Means
1. `tsc --noEmit` passes with no errors
2. All 124 archetypes have valid node signatures (all 14 nodes present)
3. Accuracy simulation achieves >70% top-1 accuracy
4. No archetype is unreachable (coverage = 124/124)
5. Quiz terminates within question budget for >95% of simulated respondents
