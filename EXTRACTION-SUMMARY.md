# V2 Engine Structure Extraction Summary

## Output File
**File:** `v2-engine-structure.json`
**Size:** 18 KB
**Created:** 2026-03-30

## Extraction Results

### Total Questions: 76

### Question Types Breakdown:
- **single_choice:** 46 questions
- **slider:** 18 questions
- **allocation:** 4 questions
- **ranking:** 4 questions
- **multi:** 2 questions
- **pairwise:** 1 question
- **best_worst:** 1 question

### Total Option Keys: 333

All option keys have been extracted from:
- `optionEvidence` (for single_choice, multi_choice, multi)
- `allocationMap` (for allocation)
- `rankingMap` (for ranking and best_worst)
- `pairMaps` (for pairwise)
- `sliderMap` (for slider)

## Format

Each question in the output file contains:
```json
{
  "promptShort": "string identifier",
  "uiType": "question type",
  "optionKeys": ["array", "of", "option", "keys"]
}
```

## Examples

### Single Choice
```json
{
  "promptShort": "political_content_frequency",
  "uiType": "single_choice",
  "optionKeys": ["never", "few_days", "most_days", "every_day"]
}
```

### Slider
```json
{
  "promptShort": "political_identity_centrality",
  "uiType": "slider",
  "optionKeys": ["0-20", "21-40", "41-60", "61-80", "81-100"]
}
```

### Allocation
```json
{
  "promptShort": "inequality_causes_allocation",
  "uiType": "allocation",
  "optionKeys": ["effort_choices", "family_background", "discrimination_bias", "luck_random"]
}
```

### Ranking
```json
{
  "promptShort": "who_should_shape_a_law",
  "uiType": "ranking",
  "optionKeys": ["researchers", "organized_residents", "elected_officials", "elders_religious", "business_stakeholders"]
}
```

### Multi (Multi-select)
```json
{
  "promptShort": "engagement_motivations_top2",
  "uiType": "multi",
  "optionKeys": ["civic_duty", "protect_values", "help_community", "fight_injustice", "self_interest", "intellectual_challenge"]
}
```

### Pairwise
```json
{
  "promptShort": "child_traits",
  "uiType": "pairwise",
  "optionKeys": ["independence", "respect_for_elders", "obedience", "self_reliance"]
}
```

### Best-Worst
```json
{
  "promptShort": "best_worst_battery",
  "uiType": "best_worst",
  "optionKeys": ["fairness", "procedural_integrity", "national_strength", "community_bonds", "individual_freedom", "tradition_continuity"]
}
```

## Verification

All questions have been successfully extracted with their complete option structures. No questions have empty option key arrays.

## Source File
Extracted from: `src/config/questions.representative.ts`
