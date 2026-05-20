# Edge cases the model probably can't handle

**Scope:** Voter shapes, scenarios, or input patterns that expose structural limits of the engine — not bugs to fix, but constraints to document. The triple-switcher (Trump→Biden→Trump in §3 #8) is the canonical example.

**Each entry must include:**
- The case description
- Why the engine structurally can't capture it (cite specific architecture pieces)
- What the engine would do instead (likely behavior)
- Whether this is acceptable (some limits are fine) or worth surfacing in the UI ("the model is uncertain here because...")

**Categories to think about:**
- Non-monotonic voting sequences (triple-switchers)
- Voters who flip on a single salient issue (anti-war 2004→2008, post-Roe 2024)
- Heavy single-event mobilization (9/11, George Floyd, COVID)
- Personalist loyalty (would have voted for Bernie or Trump but Romney or Hillary, no)
- Strategic voting (would prefer X but votes Y because tactical)
- Voters whose self-description contradicts their vote (calls self moderate, votes far-right)
- Locally-driven federal voters (votes federal based on local incumbent dynamics)
- Voters who model their parents' politics with N-year lag
- Religious-conversion or political-conversion mid-sequence
- Voters who change demographics in the window (move, age into different cluster, etc.)

---

## [2026-05-19T — cycle 22 — GENERATE — structural model limits: 4 edge cases]

### Case 1: Non-monotonic voting (triple-switcher: Trump 2016 → Biden 2020 → Trump 2024)

**Case description.** A non-college white working-class voter who voted Trump 2016 (anti-establishment energy, economic anxiety), switched to Biden 2020 (COVID chaos fatigue, desire for stability), then back to Trump 2024 (inflation, cost-of-living anger). The switch to Biden is *reactive* (event-driven) rather than positional — their underlying values didn't change; the 2020 environment was aberrant.

**Why the engine structurally can't capture it.** The engine produces a single static `NodeSignature` for one quiz session. There is no mechanism to say "my ZS was the same in 2016 and 2024 but lower in 2020." The vote-prediction path in `src/historical/respondentVoteChoice.ts` computes weighted-Euclidean distance from *one* signature to each candidate in each year. The same `{ ZS: { pos: 4, sal: 2.3 }, CD: { pos: 4, sal: 2.1 }, ONT_S: { pos: 2, sal: 1.8 } }` vector is used for 2016, 2020, and 2024 — there is no year-conditioned signature state.

**Likely engine behavior.** A MAGA-signature respondent (ZS=4, CD=4, low ONT_S) will be distance-closest to Trump 2016, Trump 2020, and Trump 2024 in all three years. The engine predicts R 2016/2020/2024 — getting 2016 and 2024 right, 2020 wrong. There is no charisma-correction large enough to flip a distance-close R voter to Biden; `WEIGHT_CHARISMA = 0.20` and Trump 2020 has a polling-derived charisma that is below Biden's but not by enough to bridge a substantial ZS/CD gap.

**Acceptable limit?** Yes. The model explicitly captures *values positions* not *event-reactive sentiment*. The 2020 Biden vote from a MAGA-signature voter is a retrospective judgment about governance quality, not a values shift. Documenting the limit is sufficient. Worth noting in the harness report as: "triple-switcher persona correctly fails 2020 prediction; this is a structural ceiling, not a calibration target."

**Harness implication.** See HARNESS-HANDOFF §3 #8: "document it explicitly as a stress test, not a calibration target." The harness should still run this persona and report the failure explicitly — the report format should distinguish "failed because model limits" from "failed because scoring bug."

---

### Case 2: Post-Dobbs CD salience shift (single-issue event raises node salience after many stable cycles)

**Case description.** A suburban Republican woman who voted R 2008–2020 on economic grounds, with abortion as a low-salience background preference (pro-choice but it wasn't driving her vote). After *Dobbs* (June 2022), abortion becomes her highest-salience issue. She switches to D for the first time in 2022 midterms and votes Harris in 2024. She takes the PRISM quiz in late 2024 — after the shift.

**Why the engine structurally can't capture it.** The quiz captures the respondent's position and salience *at quiz time*. Her post-Dobbs signature: `CD = { pos: 2, sal: 3.0 }` (CD=2 = liberal on cultural direction, sal=3 = high). The era-activation system in `src/historical/era-activations.json` applies `getActivationMultiplier(year, node)` to every election year, but CD is **never activated at the US-election level** — it always gets its own archetype salience, multiplier = 1. With `CD.sal = 3.0` constant across all years, the distance model predicts she was close to D candidates in 2008/2012/2016/2020 as well — which is historically wrong.

There is no mechanism to set `CD.sal = 1.0` for years < 2022 and `CD.sal = 3.0` for years ≥ 2022. The era multiplier isn't the right tool here — it amplifies *societal-level context* (1932 MAT super-activated = Depression politics for everyone), not individual-level salience change.

**Likely engine behavior.** The engine routes her to a liberal-CD archetype (CD=2 signals progressive on cultural direction). Her R economic positions (MAT=4) create a cross-pressure; depending on exact signature, she might land on a "suburban moderate Democrat" archetype rather than a "lifelong Republican." The vote predictions will show D for years she voted R — the engine will confidently mis-predict 2008–2020.

**Acceptable limit?** Mostly yes, but worth calling out in the UI: "If your political priorities shifted recently (e.g., due to a major policy change), your historical vote predictions may not match your actual past votes." The PRISM quiz is designed to predict forward from *current* values, not reconstruct past votes from past values. This distinction should be surfaced in the results page, not hidden.

**Harness implication.** The suburban Never-Trump Republican persona (HARNESS-HANDOFF §3 #7) is a related but distinct case — she was always cross-pressured, not post-event shifted. The Dobbs voter is a separate persona worth adding to Tier B if the harness needs to demonstrate this failure mode explicitly.

---

### Case 3: Personalist loyalty (vote for the person, not the position pattern)

**Case description.** Two personas that look nearly identical to the engine but behave differently in the real world:
- Voter A: "I vote for whoever is the progressive populist champion — I voted Obama 2008/2012, Bernie in the primary, and held my nose for Clinton/Biden in generals."
- Voter B: "I would only vote for Bernie Sanders specifically. I sat out 2016 and 2020 because I couldn't stand Clinton/Biden, and I abstained again in 2024."

Both voters have the same position signature (redistributive MAT=1, universalist moralCircle, high-engagement). The engine assigns the same archetype to both (probably something in the democratic-socialist family) and predicts the same vote trajectory. But Voter B's actual vote history is completely different.

**Why the engine structurally can't capture it.** The candidate-distance model in `src/historical/respondentVoteChoice.ts` computes distance from signature to *candidate's values profile*, plus an additive charisma term. Candidate charisma scores are polling-derived and universal — every respondent uses the same charisma term for Clinton 2016. There is no mechanism for respondent-specific candidate-personality affinity: "I find Clinton personally off-putting in a way that outweighs the values alignment." The engine's `charismaAdjustment` is a population-level polling mean, not an individual perception.

**Likely engine behavior.** For both voters, the engine predicts D 2008/2012/2016/2020/2024 (values close to D candidates in all years). Voter B's abstentions (2016, 2020) are completely invisible to the model. The personality-loyalty gap is structurally undetectable.

**Acceptable limit?** Yes. Modelling individual candidate-personality reaction requires either (a) asking the respondent direct questions about candidate perceptions (outside scope) or (b) a richer AES/EPS matching layer that distinguishes "would vote for authentic/fighter AES" from "would vote for statesman AES." The current AES matching goes some distance here — a respondent who scores high on `fighter` AES will be closer to Trump than to Biden — but doesn't capture person-level attachment. Document as a known ceiling and note that AES/EPS indirect evidence is the partial mitigation.

---

### Case 4: Religious or political conversion mid-sequence (values shift between voted elections)

**Case description.** A respondent who converted to evangelical Christianity at age 32 — they voted D in 2008/2012 (pre-conversion), then R 2016/2020/2024 (post-conversion). Or equivalently: a former MAGA voter who became a progressive after 2020 (radicalization → de-radicalization arc). The person takes the quiz in 2026 reflecting their current (post-conversion) values.

**Why the engine structurally can't capture it.** Same root cause as Cases 1 and 2 but at a more fundamental level. The conversion changes *position* (not just salience): pre-conversion CD=2, post-conversion CD=5. The single static signature captures only the current state. The era-activation multiplier is irrelevant here — the issue is that a single quiz session produces one signature, and that signature is used to retrodict all elections, including elections where the respondent held different positions.

Specific architecture point: `src/historical/respondentVoteChoice.ts` calls `predictVote(sig, electionYear, demographics, …)` where `sig` is invariant across `electionYear`. There is no time-varying signature interface.

**Likely engine behavior.** Post-conversion evangelical (CD=5, religious in-group affinity = high, moralCircle.scopedAffinities.religious = 85) → engine predicts R for all years including 2008/2012. The engine will confidently wrong-predict 2008/2012.

**Acceptable limit?** Mostly yes — but this creates a specific UI risk. If PRISM shows "Your predicted vote in 2008: Republican" to a voter who remembers clearly voting for Obama, they may distrust the entire model. The UI should frame historical vote predictions as "what someone with *your current values* would have predicted" rather than "your predicted vote" — the tense matters. This is a presentation fix, not an engine fix.

**Harness implication.** The Christian-right traditionalist persona (HARNESS-HANDOFF §3 #12) may inadvertently test this if they report abstaining in 2008 (which is the "protest from the right" scenario, not conversion). Keep conversion distinct from protest-abstention when building that persona.

---

