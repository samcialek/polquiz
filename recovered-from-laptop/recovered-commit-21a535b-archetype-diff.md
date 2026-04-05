# Recovered commit evidence: `21a535b` archetype diff

Source session/source: desktop git history (`polmodel-clean`)
Timestamp recovered: 2026-04-05
Original commit timestamp: 2026-04-03 16:20:40 -0400
Confidence: High
File path: `C:\Users\Sam\Desktop\polmodel-clean\src\config\archetypes.ts`

## Commit summary
Commit: `21a535b7240fa940fbc9b369d45871ef15caa25f`
Message: `Apply PRISM question audit decisions`

This commit changed:
- `src/config/archetypes.ts`
- `src/config/questions.representative.ts`

## Recovered archetype-level changes from this commit
### Explicit merges / renames recorded in diff/comments
- `019 Anarchist Mutualist` → merged into `020 Grassroots Autonomist`
- `020 Horizontalist Dissenter` → renamed/merged into `020 Grassroots Autonomist`
- `021 Kantian Cosmopolitan` + `023 Rights Cosmopolitan` + `025 World-Minded Reformer` → merged into `021 Principled Cosmopolitan`
- `023 Rights Cosmopolitan` deactivated
- `025 World-Minded Reformer` deactivated

## Key exact recovered lines from diff
- `// 019  Anarchist Mutualist      — merged into 020 Grassroots Autonomist (renamed from Horizontalist Dissenter)`
- `// 023  Rights Cosmopolitan      — merged into 021 Principled Cosmopolitan`
- `// 025  World-Minded Reformer    — merged into 021 Principled Cosmopolitan`
- `name: "Grassroots Autonomist"`
- `name: "Principled Cosmopolitan"`

## What this likely means
At least some of the work Sam remembered as "we spent hours on this yesterday" was not adding raw new archetype names, but **consolidating and renaming overlapping archetypes** after semantic audit review.
