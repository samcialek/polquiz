# Comparison against current desktop repo and live PRISM state

Recovered: 2026-04-05
Confidence: High for desktop repo, Medium for semantic intent, High for live deploy-trio equality from prior verification

## Desktop `polmodel-clean` state
Current desktop repo already contains:
- merged/renamed archetypes like `Grassroots Autonomist` and `Principled Cosmopolitan`
- identity-heavy cluster entries including `Tribal Loyalist`, `Loyal Democrat`, `Loyal Republican`, `Negative Partisan`, `Spectator Citizen`, `Civic Minimalist`, etc.
- audit-era additions labeled in-file as new archetypes added from the semantic coverage audit (`135`-`140`)

## Live PRISM state
Previously verified on this session:
- live `prism-quiz-v2.html` matched selected local deploy file after upload
- live `prism-results.html` matched selected local deploy file after upload
- live `prism-engine-bundle.min.js` matched selected local deploy file after upload
- live quiz end-to-end smoke now reaches results after correcting the smoke harness to understand tradeoff UI and demographics interstitial

## What was recovered vs already present
### Recovered and already present in desktop repo
- proof of Apr 3 archetype merge/rename work
- current identity-heavy archetype cluster
- audit artifacts explaining semantic review process

### Recovered but not obviously represented as exact current names
- memory of exact labels like `Black Voter` / `White Grievance Voter` was **not** recovered as current checked-in archetype names

### Not yet recovered
- raw laptop-only transcript or scratch file containing those exact missing names
- direct laptop session artifact proving whether those names existed verbatim and were later renamed or discarded
