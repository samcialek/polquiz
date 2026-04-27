# Phase 4 archetype-audit regression note

Method: salience² weighted Euclidean distance from each profile to
all 121 active archetypes, before vs. after the 13 priority-node changes.
Pre-Phase-4 values reverted in memory (the source files carry the new values).

## Top-3 movement per profile

### Jeffersonian-libertarian

| Rank | Before (id name dist) | After (id name dist) |
|---|---|---|
| 1 | 060 Hinge Citizen                0.492 | 060 Hinge Citizen                0.492 |
| 2 | 125 Reluctant Partisan           0.620 | 125 Reluctant Partisan           0.620 |
| 3 | 086 Duty Traditionalist          0.745 | 086 Duty Traditionalist          0.745 |

Top-3 stable (same set, possibly reordered).

### Left-populist

| Rank | Before (id name dist) | After (id name dist) |
|---|---|---|
| 1 | 042 Localist Progressive         0.894* | 014 Activist Progressive         0.850* |
| 2 | 043 Quiet Egalitarian            0.894* | 042 Localist Progressive         0.894* |
| 3 | 121 Spectator Citizen            0.959* | 043 Quiet Egalitarian            0.894* |

Lost top-3: 121 Spectator Citizen
Gained top-3: 014 Activist Progressive

### Religious-conservative

| Rank | Before (id name dist) | After (id name dist) |
|---|---|---|
| 1 | 129 Loyal Republican             0.655 | 129 Loyal Republican             0.655 |
| 2 | 071 Constitutional Conservative  0.658 | 071 Constitutional Conservative  0.658 |
| 3 | 081 Heritage Guardian            0.724 | 081 Heritage Guardian            0.724 |

Top-3 stable (same set, possibly reordered).

### Institutional-progressive

| Rank | Before (id name dist) | After (id name dist) |
|---|---|---|
| 1 | 037 Fabian Modernizer            0.594 | 037 Fabian Modernizer            0.594 |
| 2 | 057 Temperate Pluralist          0.628 | 057 Temperate Pluralist          0.628 |
| 3 | 035 Administrative Liberal       0.645 | 035 Administrative Liberal       0.645 |

Top-3 stable (same set, possibly reordered).

## Attractor shifts (across the 4 profiles)

| Archetype | Before share | After share | Δ |
|---|---|---|---|
| 121 Spectator Citizen | 1/4 | 0/4 | -1 |
| 014 Activist Progressive | 0/4 | 1/4 | +1 |

## Personal trace placeholder

Sam's quiz vector from 2026-04-26 not captured in session output. To
populate this section: paste the post-quiz NodeSignature into PROFILES as
a 5th entry in scripts/archetype-audit-regression.cjs and re-run the script
with `node scripts/archetype-audit-regression.cjs > results/archetype-audit/regression.md`.
The script will compute the same before/after table for that profile.

