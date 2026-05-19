# F1 — Temporal Vote Evolution as Architectural Ceiling

**Phase:** Phase 7 P4 (2026-05-19)
**Status:** DOCUMENTED. No engineering action recommended at this time.
**Scope:** Architectural limit of the static-position PRISM engine; cross-references the 5 personas whose `voteMatchMin` values explicitly accommodate this limit.

---

## What F1 is

The PRISM engine maps a respondent's static position vector (positions on 8 continuous belief axes + 2 categorical + moral-circle affinities + engagement) to a candidate-distance computation per election, and then to a vote / abstain decision. Position state is built up Bayesianly across the quiz and then frozen at quiz end. The persona's vote *for every election year* is derived from that single frozen state.

This architecture **cannot represent**:

- Cycle-to-cycle vote switching driven by short-term salience shocks (e.g., a single bad campaign event)
- Partisan-loyalty shifts that occur over time while ideological positions stay stable (defectors)
- Vote-switching driven by relative-candidate-quality changes (a voter who'd reliably vote R when McCain is the nominee but abstain when Trump is)

The engine *does* have an era-activation map (`src/historical/era-activations.json`) that modulates per-node salience multipliers per election. But that map operates uniformly across all respondents — it can't say "Voter X became more zero-sum after 2008 while Voter Y stayed positive-sum." The per-respondent posterior is single-snapshot.

## Why F1 surfaces as a harness finding

Five of the 15 Phase-6 personas have historical voting patterns that cannot be derived from their declared positions alone. Their `voteMatchMin` values explicitly accommodate the gap.

| Persona | Pattern | Achieved / Expected | What the model misses |
|---|---|---|---|
| `obama-to-trump` | D 2008/2012, R 2016/2020/2024 | 4/5 | 2020 D — engine reads as Biden-leaning by MAT redistributive, can't capture cultural-Trump pull |
| `trump-mobilized-republican` | R 2008/2012/2016/2020/2024 | 4/5 | 2008 ABSTAIN — extreme religious-traditionalist profile too far from McCain's clearing bar |
| `hispanic-d-to-trump` | D 2008/2012/2016, R 2020/2024 | 2/5 | 2008-2016 D — cultural-traditional positions make engine read as R-leaning from the start, missing pre-2020 Hispanic-D affinity |
| `never-trump-republican` | R 2008/2012, D 2016/2020/2024 | 3/5 | 2008/2012 R — current positions are moderate-Democrat by 2024; engine correctly predicts D 2016-2024 but can't recover pre-defection R loyalty |
| `triple-switcher` | ABSTAIN 2008/2012, R 2016, D 2020, R 2024 | 4/5 | 2020 D — non-monotonic switch year, structurally unrepresentable by a static position vector |

These aren't bugs. They're the architectural ceiling.

## Why this stays documented, not patched

Adding a temporal mechanism to the engine is a deliberate architecture pass, not a Phase-7 quick win. Two options exist in the design space:

**(A) Partisan-loyalty axis** — add a node that captures "I vote with my party regardless of current policy alignment." Could be informed by Q242 (`party_alignment_self_assessment`) which currently uses `moralCircle.scopedAffinities.ideological` for similar purposes. Trade-off: introduces a new respondent state dimension that other architectural decisions (archetype signatures, candidate signatures, distance scoring) need to support. Significant blast radius.

**(B) Era-context salience shock** — extend the era-activation map from "uniform multiplier per node per year" to "per-respondent multiplier driven by a salience-shift signal." Trade-off: requires per-respondent historical-context data the engine doesn't currently collect. Possibly impossible without asking respondents about their own voting history (which would conflate self-report with persona inference).

Either option needs:
- A new test methodology (the current battery checks static signature → vote; temporal mechanics need temporal traces)
- Re-validation of all 15 personas' vote-match numbers
- A clear product question about whether PRISM's value-proposition is "what you currently believe" or "what you would have done historically"

The current product orientation, per CLAUDE.md and HARNESS-HANDOFF, is the former. The historical-vote predictions are a *consequence* of the inferred current position, not a target. Sam's Phase 6 framing was: "5 personas hit this; document it as a finding; don't rush a fix."

## Regression markers — what to preserve

The 5 `voteMatchMin` values listed above are the architectural ceiling's regression markers. If a future engine change starts beating these numbers, that's the signal that F1 has been (partially or fully) addressed. The reverse is also true: if a future engine change DROPS these numbers, that's a temporal-regression alarm.

For each persona, the persona file's inline finding documents:
- The declared historical pattern
- The actual engine output
- Which specific year(s) the engine misses and why
- The structural reason (which dimension of the persona is being read incorrectly given static positions)

These should not be edited without a deliberate decision. Edits that paper over the numbers (raising `voteMatchMin` to match a worse engine result, or lowering to inflate the persona's apparent score) would erase the regression markers.

## Q242 as a building block (preserved deferral)

Phase 7 gap-analysis identified Q242 (`party_alignment_self_assessment`) as a natural building block for option (A) — its `closely_aligned` / `reluctant_partisan` framing directly probes the partisan-loyalty axis F1 calls for. Q242 is currently deferred (it doesn't solve any Phase-6 finding alone and the surfaced personas already land at distinct archetypes), but should be revisited when/if F1 is tackled.

## Updated Phase 7 status

| P | Item | Status |
|---|---|---|
| 1 | F2 Q97 PF/ENG decoupling (Path A) | DONE (`bea9257`) |
| 2 | F3 IDP archetype filter in diagnostic top-K | DONE (`91d5586`, doc cleanup `1957682`) |
| 3 | F6 Q244 religion-political-role separator | DONE (`f444c54`) |
| 4 | F1 documented as architectural ceiling | **DONE (this doc)** |

The full battery remains at **15/15 personas clean, 138/138 assertions, exit 0**. The 5 `voteMatchMin` values stay where they are as F1 regression markers.

## Out of Phase 7 scope (preserved queue)

- **Phase 3b** — non-router slice §5.5 evidence audit (the remaining 76 questions outside the router)
- **Phase 4** — router F1 batch cleanup (extreme-pole asymmetry on Q97/Q209/Q210/Q214)
- **Q240/Q241/Q242/Q243** — independently designed questions deferred per Phase 7 gap-analysis matrix
- **F5 archetype-space gaps** — libertarian / nihilist / centrist-apolitical lack clean home archetypes; CLAUDE.md anchor on the 121-archetype count holds for now
- **Open micro-decisions** — Kirchnerism dysfunction grade; Q243 wording specifics
