# PRISM Quiz World Alignment Map Enhancement

## Context
The PRISM quiz results page (results-live.html) has a world alignment map showing how each of 130 political archetypes aligns with ~47 countries across historical eras. Data is in output/live-data/alignments.json (130 archetypes x 47 countries, each with era-based alignment scores -3 to +3).

Currently the hover tooltip just shows "Country: score". We want to make it much richer.

## Tasks

### 1. Add Taiwan/Republic of China
Add Taiwan (ROC) to alignments.json for all 130 archetypes with appropriate era breakdowns:
- Japanese colony (1895-1945)
- ROC authoritarian/KMT one-party (1945-1987)
- ROC democracy (1987-present)

Compute alignment scores consistent with how other countries are scored. Look at existing archetypes in output/live-data/archetypes.json to understand node values and how they map to alignment scores. Study how other countries like South Korea or Japan are scored for reference.

### 2. Create regimes.json metadata
Create output/live-data/regimes.json with rich metadata for EVERY country and EVERY era already in alignments.json. For each country, look at the era breakdowns in the alignment data and create entries with:
- regime_name: formal name of the government/era
- description: 1-2 sentence description
- key_figures: array of 2-3 notable leaders
- flag_emoji: Unicode flag emoji
- characteristics: brief political characterization

### 3. Enhance hover tooltips in results-live.html  
Replace the basic SVG title tooltip with a rich HTML tooltip div that shows:
- Country name + flag emoji
- Current regime name and date range
- Brief description
- Alignment score with color indicator
- Key figures for that era

Style to match the existing dark theme (uses CSS variables like --bg, --ink, etc.).

### 4. Upload to MoC
Upload updated files to matricesofconfusion.com via FTP:
```
curl -T "filename" "ftp://147.93.42.190/domains/matricesofconfusion.com/public_html/filename" --user "u572923679:MoC_SSH_2026!Sam"
```

Upload: results-live.html (as prism-results.html), and any data files to the data/ subdirectory. Check what path the results page fetches from (it uses DATA_BASE = './data').

## Important
- 47+ countries x multiple eras = hundreds of entries in regimes.json
- Be historically accurate
- The data directory on the server may need to be created
- Test tooltip positioning works at map edges
