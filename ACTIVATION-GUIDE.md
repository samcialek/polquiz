# Guide for Writing Election Activation Contexts

## What You're Writing

For each election, you write an `ElectionContext` with three layers:

### Layer 1: Zeitgeist
- `era`: one of "founding" | "good-feelings" | "jacksonian" | "sectional" | "civil-war" | "reconstruction" | "gilded" | "progressive" | "normalcy" | "new-deal" | "consensus" | "upheaval" | "reagan" | "third-way" | "polarization"
- `nodeWeights`: which nodes are MORE or LESS salient due to macro conditions. Default 1.0. Use 1.5-2.5 for activated, 0.5-0.7 for suppressed.
- `intensity`: how high-stakes does this election feel? 0.7 = boring, 1.0 = normal, 1.3 = high-stakes, 1.5 = existential
- `description`: one-line summary

### Layer 2: Issue Landscape
- `primaryAxis`: 2-3 nodes that define what the election is ABOUT (get 1.5× weight)
- `secondaryAxis`: nodes present but not dominant (1.0× weight)
- `dormant`: nodes that are irrelevant or bipartisan consensus (0.5× weight)
- Every continuous node (MAT, CD, CU, MOR, PRO, COM, ZS, ONT_H, ONT_S, PF, TRB, ENG) should appear in exactly one category
- `description`: one-line summary

### Layer 3: Candidate Activations
For each candidate in the election:
- `candidateName`: must match the name in the candidate profile exactly
- `activationNodes`: which nodes does this candidate uniquely energize? Values > 1.0 activate, < 1.0 suppress
- `novelty`: 1.0 = conventional, 1.3 = fresh, 1.5 = transformational, 1.8 = once-in-generation
- `threatActivation`: (optional) does this candidate scare people into voting AGAINST? Which nodes does the fear activate?

## Node Reference

12 continuous nodes:
- **MAT**: Material/economic (1=redistribution, 5=free-market)
- **CD**: Cultural defense (1=open, 5=traditional)
- **CU**: Cultural universalism (1=assimilationist, 5=pluralist)
- **MOR**: Moral circle (1=narrow, 5=universalist)
- **PRO**: Proceduralism (1=outcome-first, 5=rules-bound)
- **COM**: Compromise (1=never, 5=always)
- **ZS**: Zero-sum thinking (1=positive-sum, 5=zero-sum)
- **ONT_H**: Human nature (1=fixed/pessimistic, 5=perfectible)
- **ONT_S**: System status (1=stable, 5=broken)
- **PF**: Political fusion/party identity (1=independent, 5=party-is-life)
- **TRB**: Tribalism (1=universalist, 5=group-bound)
- **ENG**: Engagement (1=disengaged, 5=politics-is-life)

## TypeScript Format

```typescript
import type { ElectionContext } from "./activation.js";

export const context1860: ElectionContext = {
  year: 1860,
  zeitgeist: {
    era: "sectional",
    nodeWeights: { MOR: 2.0, TRB: 1.8, ONT_S: 2.0, CD: 1.5 },
    intensity: 1.5,
    description: "Nation fracturing over slavery; secession looming",
  },
  issueLandscape: {
    primaryAxis: ["MOR", "TRB", "ONT_S"],
    secondaryAxis: ["CD", "CU", "PRO", "ZS"],
    dormant: ["MAT", "COM", "ONT_H", "PF", "ENG"],
    description: "Slavery expansion is THE issue; economic policy irrelevant",
  },
  candidateActivations: [
    {
      candidateName: "Lincoln",
      activationNodes: { MOR: 1.5, CU: 1.3, PRO: 1.2 },
      novelty: 1.5,
      threatActivation: { TRB: 1.5, CD: 1.3 },
    },
    {
      candidateName: "Douglas",
      activationNodes: { COM: 1.3, PRO: 1.2 },
      novelty: 1.0,
    },
    {
      candidateName: "Breckinridge",
      activationNodes: { TRB: 1.8, CD: 1.5 },
      novelty: 1.2,
    },
    {
      candidateName: "Bell",
      activationNodes: { COM: 1.5, PRO: 1.3 },
      novelty: 0.8,
    },
  ],
};
```

## Key Historical Contexts

### What activates voters?
- **Economic crisis**: MAT, ONT_S spike (1893, 1932, 2008)
- **War/security**: ZS, TRB, ONT_S spike (1812, 1864, 1952, 1968, 2004)
- **Cultural upheaval**: CD, CU, MOR spike (1860, 1928, 1968, 2016)
- **Reform movement**: PRO, ONT_S, ONT_H spike (1912, 1976)
- **Normalcy/exhaustion**: everything drops, intensity low (1920, 1988)
- **Realignment**: PF, TRB spike as coalitions shift (1828, 1860, 1932, 1968, 1980)

### Novelty benchmarks
- 1.8: Washington 1789, Jackson 1828, Lincoln 1860, FDR 1932, Obama 2008, Trump 2016
- 1.5: Jefferson 1800, TR 1904, JFK 1960, Reagan 1980
- 1.3: Polk 1844, Eisenhower 1952, Carter 1976, Clinton 1992
- 1.0: Most conventional nominees (Dewey, Hancock, Taft, Dole, Kerry)
- 0.8: Boring retreads (Scott 1852, Landon 1936)

## Rules
1. Every election MUST have all three layers
2. Every continuous node must appear in exactly one of primaryAxis/secondaryAxis/dormant
3. candidateName must match the election's candidate names exactly
4. Use historically grounded reasoning — don't just make up numbers
5. Export as an array: `export const CONTEXTS_YEAR_YEAR: ElectionContext[] = [...]`
