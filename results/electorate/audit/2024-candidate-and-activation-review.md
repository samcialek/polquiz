# 2024 Candidate + Activation Audit

**Scope.** Light read of Trump 2024 + Harris 2024 in `src/historical/candidates.ts`, the 2024 entry in `src/historical/era-activations.json`, and the 2024 row in `src/historical/non-ideological-data.json`. No edits; this is a triage list for the measurement track.

**Legend.** ✓ OK · ⚠ suspicious · ❓ likely missing · 👤 needs human decision

---

## Trump 2024 signature

Source: `candidates.ts:1494–1515`.

| Field | Value | Read |
|---|---|---|
| MAT | 4 | ⚠ Coded as "tax cuts + tariffs, pro-business signal, NOT populist economics." Defensible at face value, but tariffs-as-protectionism is a populist signal in coalition terms. The realignment with non-college multi-racial voters in 2024 happened partly through this. Worth a human decision: 4 reads as "pro-business right" but his coalition behaved like "economic-nationalist populist." |
| CD | 5 | ✓ Floor on cultural closure. Same value as 2020 — model can't distinguish "poisoning the blood" 2024 from 2020. Not fixable without scale change; flag as known. |
| CU | 1 | ✓ Floor on assimilationist. Same as 2020. |
| MOR | 2 | ✓ Narrow moral circle. |
| PRO | 2 | ⚠ Coded "anti-procedural but not maximally — still works through courts/Congress." 2020 had Trump at PRO=1. The 2024 step-up to 2 is justified, but post-Jan-6 + immunity-doctrine context arguably argues 1.5. Borderline. |
| COM | 2 | ✓ |
| ZS | 4 | ⚠ Stepped DOWN from Trump 2020 (ZS=5) on "great again" framing. 2024 rhetoric was more "retribution / vermin / poison" — equal or higher zero-sum than 2020. Worth a re-look. |
| ONT_H | 2 | ✓ |
| ONT_S | 2 | ✓ Institutional distrust encoded. |
| PF | 4 | ✓ |
| TRB | 5 | ✓ Max tribal. |
| ENG | 5 | ✓ |
| EPS | 3 (intuitionist) | ✓ |
| AES | 4 (fighter) | ✓ |
| morBoundaries.class | **0.20** | ❓ **Likely missing.** Trump 2024 made material gains with non-college Latino men, Black men, working-class voters across races. A class-boundary appeal of 0.20 doesn't capture this. Compare to 2020 morBoundaries.class=0.15 — basically unchanged. The realignment narrative would justify class somewhere in the 0.45–0.65 range. |
| morBoundaries.national | 0.85 | ✓ |
| morBoundaries.political_tribe | 0.95 | ✓ |
| morBoundaries.ethnic_racial | 0.6 | 👤 Same as 2020. Reasonable read either way — reduced if you think the multi-racial-coalition gains diluted the white-identity signal, held if you think the "great replacement" rhetoric kept it active. |

---

## Harris 2024 signature

Source: `candidates.ts:1517–1535`.

| Field | Value | Read |
|---|---|---|
| MAT | 2 | ✓ "Opportunity economy." |
| CD | 2 | ✓ |
| CU | 4 | ✓ Pluralist, not floor. |
| MOR | 4 | ✓ |
| PRO | 4 | ✓ Prosecutor / rule-of-law. |
| COM | 4 | ✓ |
| ZS | 2 | ✓ "Joyful warrior." |
| ONT_H | 4 | ✓ |
| ONT_S | 4 | ✓ Institutional capacity belief. |
| PF | 5 | ✓ |
| TRB | 3 | 👤 Coded "coalition Democratic identity without max tribal appeal." Could argue 4 — the first-Black/South-Asian-woman framing was central to her launch and turnout pitch. Borderline. |
| ENG | 5 | ✓ |
| EPS | 1 (institutionalist) | ✓ Prosecutor / AG / Senator. |
| **AES** | **1 (technocrat)** | ⚠ **Suspicious.** The Harris 2024 campaign was explicitly NOT technocrat — "joy" + "we're not going back" + emotional vibes-based, light on policy detail. AES=5 (visionary) or possibly AES=3 (intuitionist) reads closer. AES=0 (statesman) is a third candidate. Technocrat fits her 2020 primary persona, not her 2024 general-election persona. |
| morBoundaries.class | 0.30 | ⚠ Low, given how central economic anxiety was. But Harris's *campaign* didn't lead with class — it led with reproductive rights + democracy + identity. So coding to her *coalition appeal* (rather than her response to the actual electorate's concerns) might justify the low value. Tension between "what she signaled" and "what voters cared about." |
| morBoundaries.gender | 0.45 | ✓ Reasonable. |
| morBoundaries.national | 0.40 | 👤 Could argue higher — the "we're not going back" / "fight for our democracy" frame is national-civic. Borderline. |

---

## 2024 era activation

Source: `era-activations.json:2024`.

```json
{ "activated": ["CU"], "super_activated": [], "tier": "B",
  "notes": "Immigration and national-identity; inflation secondary and omitted from consensus." }
```

| Issue | Read |
|---|---|
| CU activated | ✓ Immigration-as-axis is correct for 2024. |
| MAT not activated | ⚠ **The notes themselves admit "inflation secondary and omitted from consensus."** Every 2024 exit poll put inflation/economy as the top issue. Tier B with this note is honest but the call deserves a re-look. Suggest adding MAT as activated (not super-activated). |
| ONT_S not activated | 👤 Anti-establishment / institutional-trust was a major axis (cf. 2016 had ONT_S activated). Trump's "deep state" framing was central. Defensible to omit if "institutional trust" is downstream of CU/national-identity, but worth a human decision. |
| Only 1 node activated | ⚠ Thinnest activation set in modern history except 2012 (also 1) and 2020 (also 1). Compare 2008 (MAT+ONT_S), 2016 (CU+ONT_S). 2024 reads more like 2-issue (immigration + economy) than 1-issue. |
| Tier B confidence | ✓ Honest. |

---

## Non-ideological modifier (incumbent-party economy term)

Source: `non-ideological-data.json:economy.2024`.

```json
{ "incumbent_party": "Democratic", "raw_econ": 0.0,
  "gdp_q2_annualized": 2.8, "inflation_yoy_pct": 2.6, "unemp_delta_pct": 0.3,
  "notes": "Formula near zero — growth fine, inflation returned to near-target, unemployment ticking up slightly. Doesn't capture 2021-23 cumulative price-level fatigue that hurt Harris. Known limitation of YoY-spot inflation measure." }
```

| Issue | Read |
|---|---|
| `incumbent_party = Democratic` | ✓ |
| `raw_econ = 0.0` | ❓ **Known limitation, codebase admits it.** YoY-spot inflation in Nov 2024 was ~2.6%, but the *cumulative* price level was up ~20% over the term and that's what voters punished. The non-ideological modifier doesn't see this. Result: Harris gets no incumbent-party penalty for inflation in the model. This is the single most likely cause of the 2024 strawman miss. |
| Charisma differential | ⚠ Trump 2024 charisma=4.3 vs Harris=3.0. A 1.3-point gap favoring Trump exists. This applies in `non-ideological-modifiers.ts`. Worth verifying it's actually being applied for 2024 (and not just stored). |

---

## Cross-cutting findings

1. **Inflation isn't anywhere.** Era-activation map omits MAT for 2024 ("inflation secondary"). Non-ideological economy term is ~0 ("known limitation, doesn't capture cumulative price-level fatigue"). The single biggest issue voters cited has zero impact in the model. This is the clearest single-source bias.

2. **Working-class realignment is structurally invisible.** No node directly encodes "non-college / multi-racial working-class shift." The closest proxies (morBoundaries.class on Trump = 0.20, MAT = 4 = pro-business right) actively code in the OPPOSITE direction from the observed coalition shift.

3. **Harris AES = technocrat is the most concrete probable miscoding** — it doesn't match the actual 2024 campaign aesthetic. Easy to revise; effect on prediction is real because AES gets era-elevated weight in 2024 (style-driven elections multiplier).

4. **The 2020-vs-2024 Trump deltas are too small.** PRO 1→2, ZS 5→4 — both moves are *toward the center* from 2020. Real 2024-Trump rhetoric was equal or more extreme on both axes. The signature implies a softer Trump than was on the ballot.

5. **No abstention-asymmetry mechanism exists.** The clearing-bar drives individual-engagement abstention, but doesn't model differential party-coalition mood. If 2024 was partly won by soft Dems sitting out, no part of the current architecture captures that. This is a model-architecture issue, not a 2024 audit issue — flagging because it interacts with everything else here.

---

## Recommended next steps (no edits made)

| Priority | Action | Owner |
|---|---|---|
| **P1** | Decide whether to add MAT to 2024 era-activated. The codebase's own note flags this as a known omission. | 👤 Human + measurement track |
| **P1** | Fix Harris 2024 AES coding. Technocrat doesn't fit. Likely visionary or intuitionist. | 👤 Human |
| P2 | Reconsider Trump 2024 morBoundaries.class — current 0.20 contradicts the realignment evidence. | 👤 Human |
| P2 | Fix the cumulative-inflation gap in `non-ideological-data.json`. Either add a cumulative-price-level term or override `raw_econ` for 2024 with a manual penalty reflecting price-level fatigue. | Measurement track |
| P3 | Re-look Trump 2024 ZS (currently 4, arguably 5). | 👤 Human |
| P3 | Verify charisma differential is actually being applied for 2024. | Simulator track |
| P4 (architecture) | Differential-coalition-mood abstention: separate research project. Not 2024-specific. | Future |

**None of these is a blocker for CES intake.** They're things the measurement track will want to revisit when it gets to candidate-signature work; tagging them now so they're not rediscovered from scratch.

---

## What this audit does NOT claim

- It does NOT claim the model is "broken" for 2024.
- It does NOT claim fixing these will close the strawman's structural Dem skew (that's a population-weighting issue, separate).
- It does NOT recommend any data edits before CES 2020/2024 backtest results are in. The CES backtest may surface different priorities; we revise candidates/activations against the evidence the backtest produces, not in advance of it.
