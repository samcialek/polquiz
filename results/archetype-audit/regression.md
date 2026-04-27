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

### Sam (134 Progressive Civic Nationalist)

| Rank | Before (id name dist) | After (id name dist) |
|---|---|---|
| 1 | 039 Data-Driven Moderate         0.408 | 039 Data-Driven Moderate         0.408 |
| 2 | 134 Progressive Civic Nationalis 0.436 | 134 Progressive Civic Nationalis 0.436 |
| 3 | 004 Labor Reformer               0.521 | 004 Labor Reformer               0.521 |

Top-3 stable (same set, possibly reordered).

## Attractor shifts (across the 5 profiles)

| Archetype | Before share | After share | Δ |
|---|---|---|---|
| 121 Spectator Citizen | 1/4 | 0/4 | -1 |
| 014 Activist Progressive | 0/4 | 1/4 | +1 |

## Personal trace note

Sam's quiz vector is included as a 5th profile above. His top-3 is
stable across Phase 4: 039 Data-Driven Moderate, 134 Progressive Civic
Nationalist (his quiz assignment), 004 Labor Reformer. None of the 13
Phase-4-changed archetypes are within his top-15 closest, so the changes
produce zero displacement in his geometry. Note: this script's distance
metric uses only the 9 continuous scoring nodes; the live quiz engine
additionally weighs EPS / AES / TRB anchor + anti-position penalties,
which is why the live quiz ranks 134 above 039 even though raw 9-node
distance favors 039.

