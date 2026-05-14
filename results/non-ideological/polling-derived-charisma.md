# Polling-derived charisma — methodology + data assembly

**Status:** draft for review (2026-05-14). Not wired into engine yet.

**Goal:** Replace the hand-assigned 1–5 `charisma` field in
`src/historical/non-ideological-data.json` with values derived from public
time-stamped polling data. Removes the subjective lever that's currently
the main overfitting hazard in the non-ideological-modifier system.

**Out of scope:** the formula for the modifier itself
(`0.60·econ + 0.20·incumb + 0.20·charisma`, capped ±0.20) stays unchanged.
Only the **source** of the `charisma` input changes.

---

## Methodology

### Coverage

- **1948–2024:** derive charisma from polling. 20 election cycles, ~50
  major candidates total.
- **Pre-1948:** set `charisma = 3.0` (neutral, no signal claimed). Polling
  is too sparse / inconsistent before Gallup's mid-1930s start to support a
  principled per-cycle value. This is the same "honest unknown" treatment
  the rest of the modifier system applies to pre-1929 economic data.

### Source per candidate

| Candidate type | Source | Notes |
|---|---|---|
| Incumbent president running | Gallup approval rating, 30-day average ending on Election Day | Continuous series since FDR. |
| Sitting VP running for top spot (Nixon '60, Humphrey '68, Bush '88, Gore '00, Biden '20, Harris '24) | Gallup or major-pollster net favorability, last 30 days | Treat as non-incumbent for charisma. |
| Non-incumbent challenger | Net favorability average (favorable − unfavorable) from polling aggregations in last 30 days | FiveThirtyEight, RealClearPolitics, Gallup-direct for pre-2000. |
| Third-party candidate | Net favorability if available; else 3.0 | Many third-party candidates have sparse polling. |

Each value cites its source URL + retrieval date in the data file.

### Normalization to 1–5 scale

The current 1–5 charisma scale enters the modifier as `(charisma − 3) / 4`,
giving a raw component in [−0.5, +0.5]. To preserve that range while
sourcing from polling:

**Incumbent (approval):**
```
charisma_raw = 1 + (approval_pct − 30) / 10
charisma = clamp(charisma_raw, 1.0, 5.0)
```
- approval 30% → charisma 1.0
- approval 50% → charisma 3.0 (neutral)
- approval 70% → charisma 5.0
- Linear in between, clamped at the extremes.

**Non-incumbent (net favorability):**
```
charisma_raw = 3 + net_favorability / 15
charisma = clamp(charisma_raw, 1.0, 5.0)
```
- net −30 → charisma 1.0
- net 0 → charisma 3.0
- net +30 → charisma 5.0

The asymmetric scales reflect the asymmetric meaning of the two metrics:
50% approval is the "neutral" reference for an incumbent (they're approved
of by roughly as many people as not), but net favorability of 0 is the
"neutral" reference for a challenger (favorable and unfavorable balance).

---

## Data assembly — first pass

**Confidence legend:**
- **H** = high confidence (well-documented public figure, value within ±2 pts of common sources)
- **M** = medium (value approximate, needs verification against primary source)
- **L** = low (best-effort estimate, may be off by 5+ pts)

### Incumbents — Gallup approval, last 30 days

| Candidate | Year | Approval % | Derived χ | Conf | Notes |
|---|---|---|---|---|---|
| Truman | 1948 | 37 | 1.7 | M | Final pre-election Gallup ~36-39%; "Dewey Defeats Truman" era. |
| Eisenhower | 1956 | 67 | 4.7 | H | Strong second-term position. |
| Johnson | 1964 | 74 | 5.0 (cap) | H | Post-Kennedy assassination, pre-Vietnam escalation. |
| Nixon | 1972 | 58 | 3.8 | H | Pre-Watergate revelations, post-China opening. |
| Ford | 1976 | 45 | 2.5 | M | Pardoned Nixon, hurt by stagflation. Appointed-incumbent edge case. |
| Carter | 1980 | 37 | 1.7 | H | Iran hostage crisis, stagflation. |
| Reagan | 1984 | 58 | 3.8 | H | "Morning in America." |
| Bush (G.H.W.) | 1992 | 34 | 1.4 | H | Post-Gulf War highs collapsed by recession. |
| Clinton | 1996 | 57 | 3.7 | H | Mid-term recovery, strong economy. |
| Bush (G.W.) | 2004 | 48 | 2.8 | H | 9/11 boost faded by 2004; Iraq War polarizing. |
| Obama | 2012 | 52 | 3.2 | H | Modest positive, post-2010 midterm recovery. |
| Trump | 2020 | 46 | 2.6 | H | COVID-era drag from earlier highs. |

### Non-incumbents — net favorability, last 30 days

| Candidate | Year | Net fav | Derived χ | Conf | Notes |
|---|---|---|---|---|---|
| Dewey | 1948 | +10 | 3.7 | L | Pre-polling-modern era. |
| Eisenhower | 1952 | +35 | 5.0 (cap) | H | War hero, broadly liked. |
| Stevenson | 1952 | +5 | 3.3 | M | Intellectual but stiff. |
| Stevenson | 1956 | 0 | 3.0 | M | Rematch fatigue. |
| Kennedy | 1960 | +15 | 4.0 | H | Charismatic, telegenic. |
| Nixon | 1960 | +5 | 3.3 | M | Sweaty debate, less liked than Kennedy. |
| Goldwater | 1964 | −15 | 2.0 | H | "Extremism in defense of liberty" framing hurt him. |
| Nixon | 1968 | +5 | 3.3 | M | New-Nixon comeback, mixed image. |
| Humphrey | 1968 | 0 | 3.0 | M | Tied to LBJ/Vietnam unpopularity. |
| Wallace | 1968 | −10 | 2.3 | M | Segregationist third-party. |
| McGovern | 1972 | −20 | 1.7 | H | Eagleton VP debacle + post-Eagleton recovery failure. |
| Carter | 1976 | +15 | 4.0 | H | Fresh-face outsider post-Watergate. |
| Reagan | 1980 | +15 | 4.0 | H | Strong communicator, Carter-fatigue tailwind. |
| Anderson | 1980 | −5 | 2.7 | L | Third-party. |
| Mondale | 1984 | −5 | 2.7 | M | Reagan dwarfed him. |
| Bush (G.H.W.) | 1988 | +20 | 4.3 | H | Reagan's VP, pre-recession. |
| Dukakis | 1988 | −5 | 2.7 | H | Tank ad, Willie Horton. |
| Clinton | 1992 | +15 | 4.0 | H | "I feel your pain" boomer charisma. |
| Bush (G.H.W.) | 1992 | (use incumbent row) | — | — | Already in incumbent table. |
| Perot | 1992 | +20 | 4.3 | H | Early-summer surge, dropout-rejoin, still net-positive. |
| Dole | 1996 | −5 | 2.7 | M | Stale-image generational mismatch. |
| Perot | 1996 | +5 | 3.3 | M | Diminished from '92. |
| Bush (G.W.) | 2000 | +10 | 3.7 | M | Compassionate-conservative branding. |
| Gore | 2000 | +5 | 3.3 | M | Sigh-debate, stiff. |
| Nader | 2000 | −10 | 2.3 | L | Third-party. |
| Kerry | 2004 | +5 | 3.3 | H | Swift-boating brought his favorability down. |
| Obama | 2008 | +25 | 4.7 | H | Generational-change wave. |
| McCain | 2008 | +5 | 3.3 | M | War-hero respect but economic-crisis drag. |
| Romney | 2012 | −5 | 2.7 | H | "47%" tape, Bain Capital framing. |
| Trump | 2016 | −25 | 1.3 | H | Lowest-favorability major-party nominee in polling era. |
| Clinton (H.) | 2016 | −15 | 2.0 | H | Email-server saga, second-lowest favorability. |
| Johnson | 2016 | −10 | 2.3 | M | Libertarian third-party, "What is Aleppo?" |
| Biden | 2020 | +5 | 3.3 | H | Net-positive, generic-D favorability. |
| Trump | 2024 | −15 | 2.0 | H | Improved from 2016/2020 but still net-negative. |
| Harris | 2024 | −5 | 2.7 | M | Mid-campaign replacement; mixed favorability. |

---

## Comparison: current hand-set vs proposed polling-derived

Snapshot for the cycles most likely to flip on this change:

| Candidate | Current χ | Proposed χ | Δ | Likely engine effect |
|---|---|---|---|---|
| Truman 1948 | 4 | 1.7 | −2.3 | Truman loses charisma boost — could hurt his vote count for institutionalist personas. |
| Eisenhower 1952 | 5 | 5.0 | 0 | Unchanged at cap. |
| Eisenhower 1956 | 4.5 | 4.7 | +0.2 | Slight bump. |
| Kennedy 1960 | 5 | 4.0 | −1.0 | Modest drop. |
| Johnson 1964 | 3 | 5.0 | +2.0 | Major bump — but Johnson was already winning landslides. |
| Nixon 1968 | 3.5 | 3.3 | −0.2 | Minor. |
| McGovern 1972 | 2 | 1.7 | −0.3 | Already losing badly. |
| Carter 1976 | 3.5 | 4.0 | +0.5 | Small boost. |
| Reagan 1980 | 5 | 4.0 | −1.0 | Reagan was charismatic but pre-election favorability wasn't 5/5. |
| Reagan 1984 | 5 | 3.8 | −1.2 | Big drop — could hurt his persona-suite Republican-vote counts. |
| Bush 1988 | 3 | 4.3 | +1.3 | Bush was a VP riding Reagan's tailwind. |
| Clinton 1992 | 4.5 | 4.0 | −0.5 | Small drop. |
| Bush 2004 | 4 | 2.8 | −1.2 | **The 2004 regression test.** Bush's late-2004 approval was ~48%, hurt by Iraq. The polling-derived value REDUCES his charisma — so the institutionalist-R archetype might still flip to Kerry. |
| Obama 2008 | 5 | 4.7 | −0.3 | Minor. |
| Obama 2012 | 4 | 3.2 | −0.8 | Drop reflects mid-term fatigue. |
| Trump 2016 | 4.3 | 1.3 | −3.0 | Big drop. Trump won despite terrible favorability — the engine will need to route him via values, not charisma. |
| Trump 2020 | 4.3 | 2.6 | −1.7 | Big drop. This was the original 2020-modifier concern. |
| Biden 2020 | 3 | 3.3 | +0.3 | Minor bump. |
| Trump 2024 | 4.3 | 2.0 | −2.3 | Big drop. |
| Harris 2024 | 3 | 2.7 | −0.3 | Minor. |

**Caution flags:**

1. **2004 Bush regression may not be saved.** Bush's late-2004 approval was ~48% — polling-derived χ ~2.8. Hand-set is 4. So the polling change *reduces* Bush's charisma, which would likely cause the same regression we saw when we dropped charisma entirely. **If preserving the 2004 Bush call is non-negotiable, the polling approach won't save it.** This needs to be confirmed by re-running the never-Trump R sim with the polling values before commit.

2. **Trump charisma drops across all three cycles** (2016/2020/2024). Hand-set values had Trump at 4.3 (high rally energy). Polling-based has him at 1.3–2.6 (favorability was always net-negative). The model will route Trump-voters less through charisma, more through values (CD/CU/ZS/MOR). For most MAGA-aligned personas this is fine — values already drive the match. For the **2016 mobilizer** persona (Abstain → Trump), Trump's lower charisma might push his distance above the bar, causing a 2016 abstention rather than a vote. Needs validation.

3. **Reagan 1984 drops** from 5 to 3.8. Reagan won 49 states. The model relying on charisma to deliver that landslide will see weaker numbers. Probably fine — Reagan's MAT/CD/CU/ONT_S values are already R-coded — but persona-suite Republicans might see slight 1984 D shifts.

---

## Next steps

1. **Validate values against primary sources.** Replace L-confidence rows with cited figures. Spot-check H-confidence rows.
   - Primary: Gallup historical approval (https://news.gallup.com/poll/116677/presidential-approval-ratings-gallup-historical-statistics-trends.aspx).
   - Pollster aggregations: FiveThirtyEight archives (favorability), RealClearPolitics historical averages.

2. **Build the JSON migration.** Replace `charisma: N` per-candidate entries in `non-ideological-data.json` with polling-derived values + source citations. Mark pre-1948 entries with `charisma: 3.0, source: "neutral_pre_polling"`.

3. **Pre-flight diagnostic.** Re-run persona suite + never-Trump R sim + swing-voter sim with the new charisma values. Report deltas.

4. **Ship decision.** If 2004 Bush call regresses, that's the same regression we saw with charisma-drop. Two options:
   - Accept it as an honest outcome (the values + economic + incumbency model says Kerry is closer; Bush won in real life because of 9/11-residual, Iraq sentiment, Ohio ballot initiative — factors outside the engine's measurement set).
   - Add a separately-tagged "9/11_effect" boost specific to Bush_2004, traceable to documented post-9/11 approval persistence. This re-introduces a per-cycle special case but with citation.

5. **Document.** Add to `results/architecture/` describing the change and the reasoning.

---

## Open questions for Sam

1. **2004 Bush call:** is preserving it a hard requirement, or acceptable as documented regression?
2. **Pre-1948 treatment:** neutral (χ=3) for all, or retain current hand-set values as a "legacy historical period" exception?
3. **Polling-cutoff window:** 30-day average ending on Election Day is the proposal. Alternative would be 60-day average, or "final polling release before the election." 30-day is what FiveThirtyEight uses for their averages, which is the most-cited source.
4. **Treatment of Perot 1992:** he peaked in summer at +20 net favorability, dropped to ~+5 after his July dropout, recovered to ~+15 by November. The proposal uses ~+20 (high end). Alternative: use the late-October value (~+15). Affects only one election.
