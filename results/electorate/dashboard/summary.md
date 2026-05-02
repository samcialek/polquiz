# Electorate Simulator — Diagnostics Dashboard

Generated: 2026-05-02T23:40:42.303Z · schema v1

## Architecture

Individual profile first; subgroup checks are external diagnostics, not calibration targets.

```
Pipeline order is individual-profile-first.
  1. Survey respondent → PRISM signature posterior (per-agent, with uncertainty).
  2. Per-agent vote/abstain via respondentVoteChoice.
  3. Aggregate (decomposition) into subgroup views — purely descriptive of per-agent answers.
  4. External diagnostic checks: coalition gate against benchmarks, error report when gate fails.

Subgroup decompositions and the coalition gate are EXTERNAL DIAGNOSTICS over the
per-agent simulation. They do not modify per-agent inference and they are not
calibration targets. Tuning the per-agent layer to match a coalition cell directly
is overfitting.
```

> **Coalition gates are diagnostic only.** Coalition gates and the closed-loop error reporter are diagnostics, not calibration targets. Their job is to surface the most likely failure layer (mapper / candidate signature / vote formula / turnout model / coverage) so a human can decide what to revise. Do not auto-tune the mapper to make a coalition cell pass; that path leads to overfit subgroup totals atop incorrect individual-level reasoning.

## Pipeline status

| Stage | Status | Description | Smoke |
|---|:--:|---|---|
| C0 | ✓ complete | Vote-model smoke: archetypes-as-strawman-population baseline. | n/a |
| C1 | ✓ complete | Weighted-agent simulator scaffold with synthetic agents. | 1/1 |
| C2 | ✓ complete | Coalition decomposition over an electorate simulation result. | 13/13 |
| C3 | ✓ complete | Coalition gate: pass/fail vs benchmark targets, per-subgroup tolerance. | 10/10 |
| C4 | ✓ complete | Closed-loop error reporter: ranked diagnoses + recommendations. | 14/14 |
| C5 | ✓ complete | Diagnostics dashboard (this artifact). | 10/10 |
| A1 | ✓ complete | CES + ANES codebook intake — Terminal Two. | n/a |
| A2 | ✓ complete | Survey-to-PRISM mapping spec v0 — Terminal Two. | n/a |
| A3 | — missing | Coverage gap report — Terminal Two (or this terminal as documentation). | — |
| D1 | ✓ complete | 2024 candidate + activation audit (no edits). | n/a |
| D2 | ✓ complete | 2020 candidate + era-context audit (no edits). | n/a |

**Test health:** 48/48 invariants passing across 5 smokes.

## Data-source roles

| Source | Required | Role |
|---|:--:|---|
| CES / ANES | yes | Individual political measurement. Survey items map into per-respondent PRISM signature posteriors with explicit uncertainty. |
| ACS (Census) | no | Poststratification and geography priors only. Demographic weights, not political content. |
| Esri Tapestry | no | Optional geographic enrichment. Not an individual political mapper. Does not replace survey-derived signatures. |
| Edison / NEP exit polls | no | Subgroup benchmark targets for the coalition gate (diagnostic only, not a fitting target). |

## Measurement risk queue

| Severity | Topic | Description |
|---|---|---|
| high | AES (aesthetic style) coverage | Survey items rarely measure aesthetic-style preferences directly. AES inference is weakest among the 14 nodes; AES is era-elevated for style-driven elections (e.g., 2016/2020/2024) so weak coverage hurts more than it would otherwise. |
| medium | COM (compromise tolerance) coverage | Standard political surveys ask about issues, not about willingness to compromise. COM may need imputation from related items. |
| medium | ONT_H (human malleability) | Worldview about whether character is fixed vs. shaped by environment is rarely surveyed directly. Likely inferred from culturally-coded items. |
| high | Moral-boundary salience / loading | Highest-risk derived inference. The 7-boundary moral-circle module is sensitive to coalition-axis miscalibration; a single mis-loaded boundary can shift the racial / religious / class dimensions of an entire coalition. |
| medium | Engagement dimension separation | Engagement is one-dimensional and separate from policy alignment. Surveys conflate engagement with partisanship; the mapper must keep them disjoint. |
| medium | 2020 / 2024 candidate + era-context audit findings | Open audit flags include 2020 ONT_S not era-activated, 2020 Biden moral-boundary.ethnic_racial likely too low, 2024 inflation absent from era + economy term, 2024 Trump moral-boundary.class likely too low. See results/electorate/audit/. |

## Engagement

Engagement is a one-dimensional scalar separate from policy alignment.
It is never referred to as activation. It governs the per-agent
clearing-bar in respondentVoteChoice and lives in its own module
(src/engine/engagementLabel.ts).

## Next actions

- **A3** — Author or import the mapper coverage-gap report — per-PRISM-target coverage rating, gap descriptions, do-not-overfit guidance. *(owner: Terminal Two (or this terminal as documentation if Terminal Two is blocked).)*
- **C5-followup** — Iterate the diagnostics dashboard with richer per-stage summaries (e.g. inline mapper coverage table, per-cluster smoke roll-ups). *(owner: This terminal.)*
- **C6-prep** — Prepare for the first real CES 2020 backtest: define the demographic-tag mapping from CES variables to AgentDemographics, agree on benchmark sources for the coalition gate (Edison / Catalist / Pew validated vote), and set Phase-2 entry conditions. *(owner: Both terminals + human acceptance criteria.)*
- **audit-decisions** — Resolve human-coding-decision flags from the 2020 + 2024 audits before they back-pollute candidate signatures during a backtest revision cycle. *(owner: Human + measurement track.)*

## Input file catalog

| Path | Present | Category |
|---|:--:|---|
| `results/electorate/00-PLAN.md` | ✓ | plan |
| `results/electorate/scaffold/summary.md` | ✓ | smoke-summary |
| `results/electorate/coalition/summary.md` | ✓ | smoke-summary |
| `results/electorate/gate/summary.md` | ✓ | smoke-summary |
| `results/electorate/feedback/summary.md` | ✓ | smoke-summary |
| `results/electorate/audit/2024-candidate-and-activation-review.md` | ✓ | audit |
| `results/electorate/audit/2020-candidate-and-era-context-review.md` | ✓ | audit |
| `results/electorate/intake/ces-anes-codebook-intake.md` | ✓ | intake |
| `results/electorate/intake/acs-esri-geography-intake.md` | ✓ | intake |
| `results/electorate/intake/variable-catalog-v0.json` | ✓ | intake |
| `results/electorate/mapping/survey-to-prism-v0.md` | ✓ | mapping |
| `results/electorate/mapping/survey-to-prism-v0.json` | ✓ | mapping |

## Notes

- Read-only diagnostic. Does not modify any source, candidate, era-context, mapper, or output file.
- Engagement is a one-dimensional scalar separate from policy alignment.
It is never referred to as activation. It governs the per-agent
clearing-bar in respondentVoteChoice and lives in its own module
(src/engine/engagementLabel.ts).
- Identity-driven appeal is read through moral-boundary salience and moral-boundary loading. Legacy PF / TRB fields visible in source are inert and not active model concepts.


---

## Diagnostics smoke (this artifact)

Run at 2026-05-02T23:40:42.305Z.

| # | Check | Pass | Detail |
|---|---|:--:|---|
| 1 | 1: status.json file exists on disk after build | ✓ | path=C:\Users\Sam\Desktop\polmodel-clean\results\electorate\dashboard\status.json |
| 2 | 1: summary.md content prepared | ✓ | markdown chars=7047 |
| 3 | 2: status.json validates with JSON.parse | ✓ | ok |
| 4 | 3: status.json carries all required top-level sections | ✓ | ok |
| 5 | 3: summary.md carries all required ## sections | ✓ | ok |
| 6 | 4: C1/C2/C3/C4 detected as complete (artifacts present) | ✓ | ok |
| 7 | 5: no retired active-model terminology in dashboard prose | ✓ | ok |
| 8 | 6: missing optional inputs reported as missing, not failure | ✓ | probe=n/a buildSurvived=true |
| 9 | 7: dashboard states coalition gates are diagnostic only | ✓ | ok |
| 10 | 8: engagement described as separate and one-dimensional | ✓ | ok |

**Overall: ✓ ALL PASS** (10/10)
