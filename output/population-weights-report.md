# Population Weights Report

## Methodology
- **Top-down anchoring**: Mapped 130 archetypes to Pew Political Typology 2021 (8 clusters) using Euclidean distance on 12 PRISM nodes
- **Soft clustering**: Each archetype assigned to top-2 nearest Pew clusters via inverse distance weighting
- **Within-cluster distribution**: Population share distributed proportionally to inverse distance from cluster centroid
- **Base weight**: 7% distributed equally as floor for all archetypes
- **Constraint**: No archetype exceeds 8% of population

## Pew Cluster Mapping
| Cluster | Share | Archetypes Mapped |
|---------|-------|-------------------|
| Faith and Flag Conservatives | 10% | 10 |
| Populist Right | 11% | 24 |
| Ambivalent Right | 12% | 22 |
| Stressed Sideliners | 15% | 8 |
| Outsider Left | 10% | 4 |
| Democratic Mainstays | 16% | 33 |
| Establishment Liberals | 13% | 20 |
| Progressive Left | 6% | 9 |

## Validation
- Left-leaning: 27.1%
- Right-leaning: 16.1%
- Centrist: 56.8%
- Max archetype weight: 3.22% (Passive Cynic)
- Min archetype weight: 0.33% (Class-War Leftist)

## Top 10 Archetypes by Weight
- **108** Passive Cynic: 3.22%
- **124** Crisis-Activated Sleeper: 2.89%
- **128** Loyal Democrat: 2.89%
- **133** Sporadic Alarm Voter: 2.46%
- **115** Quietist: 2.05%
- **111** Diogenes Independent: 1.98%
- **118** Survival Pragmatist: 1.96%
- **109** Alienated Outsider: 1.88%
- **116** Quiet Middle: 1.88%
- **043** Neighborly Egalitarian: 1.88%

## Bottom 10 Archetypes by Weight
- **137** Prophetic Revivalist: 0.43%
- **005** Public Guardian: 0.42%
- **063** Enterprise Pluralist: 0.42%
- **099** Scarcity Populist: 0.42%
- **102** Folk Tribune: 0.41%
- **135** Disruptive Cosmopolitan: 0.41%
- **107** Resentful Localist: 0.41%
- **100** Tribal Insurgent: 0.38%
- **140** Market Green Modernist: 0.36%
- **012** Class-War Leftist: 0.33%

## Weight Separation (implemented 2026-03-30)

Two weight sets now coexist:

1. **Election sim weights** (`src/config/population-weights.ts`) — hand-tuned, 15/17 correct (1960-2024). Used ONLY by `src/historical/simulate.ts`. Do not modify without re-running election validation.

2. **Display weights** (`output/live-data/population-weights.json`) — 60/40 blend of hand-tuned + Pew-anchored. Used by `scripts/export-all-data.cjs` → `archetypes.json` → quiz results page. Represents best estimate of actual US population distribution.

3. **Raw Pew weights** (`output/live-data/population-weights-pew-raw.json`) — pure Pew 2021 typology anchoring, preserved for reference.

Blending script: `scripts/blend-population-weights.cjs`

### Why separate?
Pure Pew weights narrowed 2024 (Harris 57.2%→53.3%) but broke 1952 (Eisenhower→Stevenson) and 1980 (Reagan→Carter). Net: 2 misses → 4 misses. The hand-tuned weights encode implicit turnout/salience corrections that the Pew anchoring doesn't capture.

## Notes
- Weights are based on Pew 2021 typology anchoring, not direct survey respondent classification
- Survey microdata (74K CES/ANES/VSG) available for future validation via respondent-to-archetype matching
- The 60/40 blend ratio can be adjusted in `scripts/blend-population-weights.cjs`
