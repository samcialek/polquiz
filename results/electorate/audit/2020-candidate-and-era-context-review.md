# 2020 Candidate + Era-Context Audit

**Scope.** Light read of Biden 2020 + Trump 2020 in `src/historical/candidates.ts`, the 2020 entry in `src/historical/era-activations.json`, and the 2020 row in `src/historical/non-ideological-data.json`. No edits; this is a triage list for the measurement track.

**Legend.** ✓ OK · ⚠ suspicious · ❓ likely missing · 👤 needs human coding decision

**Terminology.** Legacy `PF` and `TRB` fields appear in candidate signatures from earlier model versions; they are **not active PRISM concepts** and are noted only as legacy implementation names. Identity-driven appeal is read through **moral-boundary salience / loading**. Engagement is one-dimensional and separate from policy alignment.

---

## Biden 2020 signature

Source: `candidates.ts:1440–1458`.

| Field | Value | Read |
|---|---|---|
| MAT | 2 | ✓ Redistributive (COVID spending, expanded safety net). |
| CD | 2 | ✓ Culturally open, moderate brand. |
| CU | 4 | ✓ Pluralist / multilateral; "America is back." |
| MOR | 4 | ✓ Wide moral circle, empathy-centered. |
| PRO | 5 | ✓ Maximum proceduralist — "restore norms," rule of law. The defining Biden frame. |
| COM | 5 | ✓ Maximum compromise — "I'll work with anyone." |
| ZS | 2 | ✓ Positive-sum — "soul of the nation," unity. |
| ONT_H | 4 | ✓ Optimistic — "America can be defined in one word: possibilities." |
| ONT_S | 5 | ✓ Max institutional capacity belief (ADR-010 fix from 4). Defender of the liberal institutional order. |
| PRO + ONT_S together | 5 / 5 | ✓ The Biden restoration / competence frame is strongly encoded across both procedural and institutional axes. |
| ENG | 4 | ✓ "Engaged but calm" — calm projection captured at the candidate-coding level (engagement is one-dimensional and separate from policy nodes). |
| EPS | 1 (institutionalist) | ✓ "Trust the institutions." |
| **AES** | 2 (pastoral) | 👤 **Borderline.** "Scranton Joe" anecdotes are pastoral, but the overarching 2020 frame ("soul of the nation," return to normalcy) is more statesman-coded. AES=0 (statesman) is plausible. AES is era-elevated in 2020 per `STYLE_DRIVEN_ELECTIONS = 1.7×`, so this isn't free. |
| `PF` legacy = 4 | — | Legacy field; not active in current scoring. |
| `TRB` legacy = 2 | — | Legacy field. |
| morBoundaries.national | 0.45 | ✓ |
| **morBoundaries.ethnic_racial** | **0.20** | ⚠ **Suspicious.** Biden was the explicit candidate of the Black-Latino-Asian Democratic coalition; Black voters went ~87/12 for him; the SC primary win on Black-voter turnout was decisive. 0.20 reads low. For comparison Harris 2024 = 0.40. Plausible re-coding 0.35–0.50. |
| **morBoundaries.religious** | **0.20** | ⚠ Catholic Joe, explicit "soul of the nation" + faith framing throughout. 0.20 reads low. Plausible re-coding 0.30–0.40. |
| morBoundaries.class | 0.30 | ✓ "Scranton Joe" + working-class affect + union vote. Reasonable. |
| morBoundaries.ideological | 0.40 | ✓ Centrist coalition with progressive flank — consistent. |
| morBoundaries.gender | 0.15 | 👤 The "suburban women" coalition gain was material in 2020. 0.15 may undersell. Plausible re-coding 0.25–0.35. |
| morBoundaries.political_tribe | 0.65 | 👤 Biden ran heavily on cross-tribal appeal (anti-Trump Republicans, "for all Americans"). 0.65 is reasonable but on the high end given that framing. |
| intensity | 2.5 | ✓ |

---

## Trump 2020 signature

Source: `candidates.ts:1461–1479`.

| Field | Value | Read |
|---|---|---|
| MAT | 4 | ⚠ Coded as "populist economics + COVID checks." Tariff/trade-protectionist signal lives here too. Defensible but on the populist edge of "pro-business right." |
| CD | 5 | ✓ Maximum cultural closure — doubled-down. |
| CU | 1 | ✓ Maximum assimilationist / closed. |
| MOR | 2 | ✓ Narrow moral circle, in-group focused. |
| PRO | 1 | ✓ Maximum anti-procedural — challenged the election results, attacked norms. |
| COM | 1 | ✓ Never compromise — more combative than 2016. |
| ZS | 5 | ✓ Maximum zero-sum, "American carnage" continuity. |
| ONT_H | 2 | ✓ Pessimistic — "they're destroying your country." |
| ONT_S | 2 | ✓ System broken / "deep state" / "drain the swamp." Polarity-fixed 2026-04-23. |
| ENG | 5 | ✓ Maximum engagement / saturation. |
| EPS | 3 (intuitionist) | ✓ Gut politics. |
| AES | 4 (fighter) | ✓ Counterpuncher / grievance. |
| `PF` legacy = 3 | — | Legacy field; "MAGA over GOP" framing. |
| `TRB` legacy = 5 | — | Legacy field. |
| morBoundaries.national | 0.85 | ✓ Strong. |
| morBoundaries.ethnic_racial | 0.60 | ✓ "Replacement"-coded rhetoric, immigration-as-identity. |
| morBoundaries.religious | 0.25 | 👤 Borderline. White evangelical Protestant alignment was a massive part of his coalition (~80% support). 0.25 may undersell relative to Bush 2004's religious-anchored coalition. Plausible 0.35–0.45. |
| morBoundaries.class | 0.15 | ⚠ Very low. Trump 2020 had non-college multi-racial appeal (precursor to 2024 realignment). The MAGA-as-class identity reading would push toward 0.30–0.45. |
| morBoundaries.political_tribe | 0.95 | ✓ Floor / ceiling. |
| intensity | 3 | ✓ |

---

## 2020 era activation

Source: `era-activations.json:2020`.

```json
{ "activated": ["PRO"], "super_activated": [], "tier": "C",
  "notes": "Trump referendum; norm-violation framing as primary sort." }
```

| Issue | Read |
|---|---|
| PRO activated | ✓ Norms / rule-of-law was a defining axis. Captures the "restore norms" vs "challenge the election" split. |
| **ONT_S not activated** | ⚠ **Suspicious.** Institutional-trust was the OTHER defining axis — Biden's "restore the institutional order" vs Trump's "deep state / system rigged" was a 3-point gap (5 vs 2) and central to both campaigns. Compare 2016 which DID activate `CU + ONT_S`. 2020 reads more like a 2-issue election than the single-PRO encoding suggests. Suggest re-evaluating ONT_S. |
| **No racial / cultural activation** | ❓ **Likely missing.** Summer 2020 — George Floyd, BLM protests, "defund the police" — was a top-3 campaign issue. Trump CD=5 and Biden CD=2 capture some of this at the candidate level, but the era-context layer doesn't elevate any culture / identity / racial-coalition dimension. CU or MOR or both could plausibly be argued for activation. |
| **No COVID encoding at the era level** | ❓ COVID was THE issue of 2020. The model captures it indirectly via PRO activation (mask / lockdown / institution-deference), via MAT signatures (COVID stimulus checks), and via the non-ideological economy term (GDP collapse). But there is no era-context signal for "pandemic governance" as a coherent axis. The PRO activation alone reads thin for what was effectively a referendum on pandemic management. |
| Tier C confidence | ✓ Honest reflection of the contested call. |
| Only 1 node activated | ⚠ Tied with 2012 + 2024 as the thinnest activation set in the modern era. 2008 had 2; 2016 had 2. 2020's 1-axis encoding compresses what was a multi-axis campaign. |

---

## Non-ideological economy term

Source: `non-ideological-data.json:economy.2020`.

```json
{ "incumbent_party": "Republican", "raw_econ": -0.5,
  "gdp_q2_annualized": -3.4, "inflation_yoy_pct": 1.2, "unemp_delta_pct": 3.0,
  "notes": "COVID recession. GDP and unemployment terms saturate low; low inflation (briefly) a minor offset." }
```

| Issue | Read |
|---|---|
| `incumbent_party = Republican` | ✓ Trump as sitting president. |
| `raw_econ = -0.5` | ✓ COVID-recession fingerprint correctly captured (deep negative). |
| Charisma differential (Trump 4.3 vs Biden 3.0) | ⚠ A 1.3-pt gap favoring Trump. Biden ran a deliberately low-key campaign so 3.0 is defensible, but it's worth verifying this differential isn't doing more lifting than intended in the modifier. |

---

## Cross-cutting findings

1. **Era-activation map encodes 2020 as a 1-axis election (PRO only) when it was at minimum 2-axis (PRO + ONT_S) and arguably 3-axis (+ CU or MOR for racial / cultural).** The single biggest era-context gap surfaced by this audit.

2. **Biden's morBoundaries underweight identity-group anchors** (ethnic_racial 0.20, religious 0.20, possibly gender 0.15). His winning coalition WAS the multi-racial, suburban-women, faith-Catholic-Black-Protestant Democratic coalition. The current encoding describes Biden's *self-presented* universalism more than his *coalition appeal*.

3. **Trump's morBoundaries.class = 0.15 is very low** for a candidate already showing the multi-racial non-college shift that became dominant in 2024. The 2020 → 2024 trajectory is hard to read with class held at this level across both elections.

4. **No "pandemic governance" axis exists in the model.** PRO captures one slice; the rest is distributed across MAT, ONT_S, ONT_H, CU. May be a feature (avoids overfitting to one election) or a bug (under-weights what voters actually said drove the vote). Architecture call, not an audit fix.

5. **No turnout-surge mechanism.** 2020 had record turnout (66.8% vs 60.1% in 2016) driven by both base mobilization and anti-Trump consolidation. Engagement is one-dimensional and per-archetype; the architecture has no per-election turnout boost. Same architecture observation as the 2024 audit.

6. **PRO encoding works as designed.** Biden 5 / Trump 1 + PRO era-activated is the cleanest dimension in the 2020 setup.

---

## Recommended next steps (no edits made)

| Priority | Action | Owner |
|---|---|---|
| **P1** | Decide whether to add ONT_S to 2020 era-activated. Anti-establishment vs institutional-defense was as load-bearing as norm-violation. | 👤 Human + measurement track |
| **P1** | Reconsider Biden 2020 morBoundaries.ethnic_racial (currently 0.20). The Black-coalition centrality of his win argues for 0.35–0.50. | 👤 Human |
| P2 | Re-look Biden 2020 morBoundaries.religious (currently 0.20). Catholic / "soul of the nation" framing argues for 0.30–0.40. | 👤 Human |
| P2 | Decide whether to add a cultural / racial-justice axis to 2020 era-activation (CU or MOR). | 👤 Human + measurement track |
| P3 | Re-look Biden AES (currently 2 pastoral). AES=0 statesman is plausible given the "return to normalcy" frame. AES is era-elevated in 2020. | 👤 Human |
| P3 | Re-look Trump 2020 morBoundaries.class (currently 0.15). The non-college realignment was already underway. Plausible 0.30–0.45. | 👤 Human |
| P3 | Verify charisma differential (Trump 4.3 / Biden 3.0) is being applied as intended in non-ideological modifiers. | Simulator track |
| P4 (architecture) | Pandemic-governance and turnout-surge encodings: separate research projects. Not 2020-specific fixes. | Future |

**None of these is a blocker for CES intake.** They're tagged for the measurement track to consider when it gets to candidate-signature work, instead of being rediscovered.

---

## What this audit does NOT claim

- It does NOT claim the 2020 setup is "broken." Direction, popular vote, and EC outcome should all be reachable without these fixes.
- It does NOT recommend any data edits before the CES 2020 backtest results are in. The backtest may surface different priorities; revise candidates / activations against the evidence the backtest produces, not in advance of it.
- It does NOT propose any change to the legacy `PF` / `TRB` fields visible in the 2020 candidate rows. They are inert in current scoring; identity-driven appeal is read through `morBoundaries`.
