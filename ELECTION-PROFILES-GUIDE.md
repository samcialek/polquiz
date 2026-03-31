# Guide for Writing Historical Election Candidate Profiles

## Node Polarity Legend (from src/config/nodes.ts)

All continuous nodes use 1-5 scale:

- **MAT**: 1=high redistribution, 5=free-market
- **CD**: 1=culturally open/progressive, 5=culturally closed/traditional
- **CU**: 1=assimilationist/closed/particularist, 5=pluralist/open/universalist
- **MOR**: 1=particularist (narrow moral circle), 5=universalist (wide moral circle)
- **PRO**: 1=outcome-first/anti-procedural, 5=rules-bound/proceduralist
- **COM**: 1=never compromise, 5=always compromise
- **ZS**: 1=positive-sum, 5=zero-sum
- **ONT_H**: 1=human nature fixed/pessimistic, 5=perfectible/optimistic
- **ONT_S**: 1=system stable/working, 5=system broken/needs overhaul
- **PF**: 1=independent, 5=party-is-identity (political fusion)
- **TRB**: 1=universalist/no tribal, 5=strong tribal/group-bound
- **ENG**: 1=disengaged, 5=politics-is-life

Categorical nodes:
- **EPS**: 0=empiricist, 1=institutionalist, 2=traditionalist, 3=intuitionist, 4=autonomous, 5=nihilist
- **AES**: 0=statesman, 1=technocrat, 2=pastoral, 3=authentic, 4=fighter, 5=visionary

## Key Rules

1. Profile the SIGNAL the candidate sent to voters (platform, rhetoric, persona), not private beliefs
2. Every candidate MUST have all 14 nodes filled — no missing values
3. Use the full 1-5 range. Don't cluster everything at 3.
4. Push Democratic candidates toward extreme left on ENDS (MAT=1, CD=1, CU=5, MOR=5) and Republican candidates toward right (MAT=5, CD=4-5, CU=1-2, MOR=1-2) to properly differentiate
5. For pre-party-system elections (before ~1830), map Federalists as proto-Republican and Democratic-Republicans as proto-Democrat
6. For third parties, code their actual positions

## TypeScript Format

```typescript
const election1920: Election = {
  year: 1920,
  candidates: [
    {
      name: "Harding",
      party: "Republican",
      year: 1920,
      MAT: 5,   // Comment
      CD: 4,    // Comment
      CU: 2,    // Comment
      MOR: 2,   // Comment
      PRO: 4,   // Comment
      COM: 4,   // Comment
      ZS: 3,    // Comment
      ONT_H: 2, // Comment
      ONT_S: 2, // Comment
      PF: 4,    // Comment
      TRB: 3,   // Comment
      ENG: 3,   // Comment
      EPS: 2,   // Comment
      AES: 3,   // Comment
    },
    // ... other candidates
  ],
};
```

## Actual Results Format (for simulate.ts)

```typescript
1920: { winner: "Harding", winnerPct: 60.3, loserPct: 34.1 },
```

## Elections to Add

### Phase 1: 1920-1936
- 1920: Harding (R) vs Cox (D) — "Return to Normalcy"
- 1924: Coolidge (R) vs Davis (D) vs La Follette (Progressive)
- 1928: Hoover (R) vs Smith (D)
- 1932: FDR (D) vs Hoover (R)
- 1936: FDR (D) vs Landon (R)

### Phase 2: 1892-1916
- 1892: Cleveland (D) vs Harrison (R) vs Weaver (Populist)
- 1896: McKinley (R) vs Bryan (D/Populist)
- 1900: McKinley (R) vs Bryan (D)
- 1904: T. Roosevelt (R) vs Parker (D)
- 1908: Taft (R) vs Bryan (D)
- 1912: Wilson (D) vs T. Roosevelt (Progressive) vs Taft (R)
- 1916: Wilson (D) vs Hughes (R)

### Phase 3: 1856-1888
- 1856: Buchanan (D) vs Fremont (R) vs Fillmore (Know-Nothing)
- 1860: Lincoln (R) vs Douglas (Northern D) vs Breckinridge (Southern D) vs Bell (Constitutional Union)
- 1864: Lincoln (R) vs McClellan (D)
- 1868: Grant (R) vs Seymour (D)
- 1872: Grant (R) vs Greeley (Liberal R/D)
- 1876: Hayes (R) vs Tilden (D)
- 1880: Garfield (R) vs Hancock (D)
- 1884: Cleveland (D) vs Blaine (R)
- 1888: Harrison (R) vs Cleveland (D)

### Phase 4: 1824-1852
- 1824: J.Q. Adams vs Jackson vs Crawford vs Clay (no parties, "Era of Good Feelings" ending)
- 1828: Jackson (D) vs J.Q. Adams (National Republican)
- 1832: Jackson (D) vs Clay (National Republican/Whig)
- 1836: Van Buren (D) vs Harrison (Whig) + others
- 1840: Harrison (Whig) vs Van Buren (D)
- 1844: Polk (D) vs Clay (Whig)
- 1848: Taylor (Whig) vs Cass (D) vs Van Buren (Free Soil)
- 1852: Pierce (D) vs Scott (Whig)

### Phase 5: 1789-1820
- 1789: Washington (uncontested)
- 1792: Washington (uncontested)
- 1796: J. Adams (Federalist) vs Jefferson (Democratic-Republican)
- 1800: Jefferson (D-R) vs J. Adams (Federalist)
- 1804: Jefferson (D-R) vs C.C. Pinckney (Federalist)
- 1808: Madison (D-R) vs C.C. Pinckney (Federalist)
- 1812: Madison (D-R) vs Clinton (Federalist)
- 1816: Monroe (D-R) vs King (Federalist)
- 1820: Monroe (D-R) — effectively uncontested
