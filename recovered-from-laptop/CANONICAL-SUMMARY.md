# Canonical PRISM status summary

Created: 2026-04-05
Purpose: short source-of-truth summary after laptop forensic recovery

## 1. Current canonical archetype set
The **current canonical archetype set** is the one in:
- `C:\Users\Sam\Desktop\polmodel-clean\src\config\archetypes.ts`

This desktop repo should be treated as the current source of truth.

## 2. Names that were merged / renamed / pruned
High-confidence examples recovered from git history and in-file comments:

### Merged / renamed
- `019 Anarchist Mutualist` → merged into `020 Grassroots Autonomist`
- `020 Horizontalist Dissenter` → renamed/merged into `020 Grassroots Autonomist`
- `021 Kantian Cosmopolitan` + `023 Rights Cosmopolitan` + `025 World-Minded Reformer` → merged into `021 Principled Cosmopolitan`
- `130 Habitual Partisan` → merged into `131 Duty Voter`
- `080 Chestertonian Traditionalist` → merged into `091 Security Paternalist`
- `108 Passive Cynic` → merged into `118 Survival Pragmatist` (per current file comments), though older artifacts still preserve `Passive Cynic` as a visible prior state

### Older artifact names that differ from current HEAD
Recovered from `output\population-weights-comparison.html`:
- `092 Disciplined Majoritarian` → current HEAD likely `092 Partisan Tribalist`
- `106 Leader-Centered Insurgent` → current HEAD likely `106 Militant Partisan`
- `111 Diogenes Independent` → current HEAD likely `111 Cosmopolitan Nonconformist`
- `112 Contrarian Intellectual` → current HEAD likely `112 Engaged Cosmopolitan`
- `124 Crisis-Activated Sleeper` → current HEAD likely `124 Latent Alarmist`
- `126 Single-Issue Activator` → current HEAD likely `126 Uncompromising Activist`

## 3. Remembered names that are unverified / absent
These were **not recovered as exact current checked-in archetype names**:
- `Black Voter`
- `White Grievance Voter`
- `Grievance Voter`

Interpretation:
- they may have been provisional labels
- they may have existed only in laptop-local or conversational work
- or they may have been renamed before landing in the checked-in desktop repo

## 4. Live deploy vs desktop
Previously verified in this session:
- live `prism-quiz-v2.html` matched the selected local desktop deploy file after upload
- live `prism-results.html` matched the selected local desktop deploy file after upload
- live `prism-engine-bundle.min.js` matched the selected local desktop deploy file after upload
- the live PRISM v2 smoke test now reaches results end-to-end

So the practical status is:
- **desktop repo = canonical source of truth**
- **live deploy matches selected desktop deploy files**
- **some remembered names remain unverified and should not overwrite current canonical names based on memory alone**
