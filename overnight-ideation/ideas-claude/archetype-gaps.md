# Archetype reachability & coverage gaps

**Scope:** The 121 active archetypes. Which ones look hard to reach from any plausible answer sequence? Which ones swallow too many distinct ground-truth personas? What's missing from the set?

**Each entry must include:**
- Archetype ID + label (verbatim from `src/config/archetypes.ts`)
- The reachability concern (over-reached / under-reached / unreachable / mislabeled / missing entirely)
- Evidence: cite specific node signatures or persona scenarios
- Proposed fix: signature edit / new template / merge / split

**Categories to cover:**
- Identity-primary archetypes 141–146 (IDP gate thresholds)
- The 056 attractor (Sam's dump 2 — see `project_dump2_ground_truth.md`)
- The 021→001 cosmopolitan attractor (CLAUDE.md "Known attractor pair")
- Nihilist EPS coverage (3 archetypes were added for this — are they actually reachable?)
- Deactivated 019/023/025 — should any of these come back?
- Missing archetypes for plausible voter shapes (e.g., is there a "tech-utopian Yang-curious" archetype? a "Bernie progressive distinct from institutional leftist"? )

---

## [2026-05-18T18:30 — cycle 14 — GENERATE — 021→001 cosmopolitan attractor]

### Gap 1 — 021 Principled Cosmopolitan: structural collapse into 001 Rawlsian Reformer

**Type:** Over-reached / unreachable — 021 cannot be stably reached; 001 swallows it.

**Evidence from source:**

`001 Rawlsian Reformer` signature (from `src/config/archetypes.ts` lines 37–54):
```ts
MAT: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
CD:  { kind: "continuous", pos: 1, sal: 2 },
CU:  { kind: "continuous", pos: 5, sal: 3, anti: "low" },
PRO: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
COM: { kind: "continuous", pos: 4, sal: 2 },
ZS:  { kind: "continuous", pos: 2, sal: 2, anti: "high" },
ONT_H: { kind: "continuous", pos: 4, sal: 2 },
ONT_S: { kind: "continuous", pos: 3, sal: 1 },
moralCircle: { universalAffinity: 83, scopedAffinities: { national: 5, religious: 5, ethnic_racial: 5, class: 19, gender: 6, ideological: 25 } },
```

`021 Principled Cosmopolitan` signature (lines 421–462):
```ts
MAT: { kind: "continuous", pos: 2, sal: 2 },
CD:  { kind: "continuous", pos: 1, sal: 2, anti: "high" },
CU:  { kind: "continuous", pos: 5, sal: 3, anti: "low" },
PRO: { kind: "continuous", pos: 5, sal: 2, anti: "low" },
COM: { kind: "continuous", pos: 2, sal: 2 },
ZS:  { kind: "continuous", pos: 1, sal: 2, anti: "high" },
ONT_H: { kind: "continuous", pos: 4, sal: 2 },
ONT_S: { kind: "continuous", pos: 4, sal: 2 },  // raised 3→4 per Phase-4 audit
moralCircle: { universalAffinity: 83, scopedAffinities: { national: 5, religious: 5, ethnic_racial: 5, class: 19, gender: 6, ideological: 25 } },
```

**Root cause (two-part):**

1. **Identical moralCircle signatures.** Both archetypes declare `universalAffinity: 83` with near-zero scoped affinities. Under ADR-007, active excess = `max(0, scoped − universal)`. For every scope: `max(0, 5–83) = 0`, `max(0, 19–83) = 0`, etc. Neither archetype has any scoped excess. The moral-circle scoring layer contributes zero discrimination between them — they look identical on the identity axis.

   The structural reason: the 6-scope model (`national, religious, ethnic_racial, class, gender, ideological`) has no `global` scope. A true cosmopolitan who morally loads on humanity rather than any in-group cannot be expressed as *positive excess* on any current scope. Their moral-circle state is simply high universal + low excess everywhere — indistinguishable from a high-universal progressive like 001.

2. **Policy node differences are subtle.** The only material differences are COM (001=4 vs 021=2), ZS (001=2 vs 021=1), and MAT (001=1 vs 021=2). These are 1–2-unit gaps on continuous nodes where measurement uncertainty is ±1 unit. With imperfect question evidence, both profiles receive nearly equal posterior mass. CLAUDE.md notes: "001-vs-021 posterior margin in 021's run is 0.087 (middle zone)."

**What the engine currently does:** Per CLAUDE.md, all three cosmopolitan-family archetypes (021, deactivated 023/025) collapse to 001. "021's and 001's final TRB anchor posteriors both collapse to flat `national`/`ideological` distributions (within 0.02 of each other)." ADR-007 replaced TRB, but the moralCircle layer is similarly flat for both — so the collapse mechanism persists under the new model.

**Proposed fix options:**

*Option A (preferred):* Add a direct COM-discrimination question — "A position you believe in is being offered as part of a legislative compromise that also includes provisions you consider deeply wrong. Do you support it?" — slider from "never compromise" to "always take pragmatic deal." This separates COM=2 (021) from COM=4 (001) on a single dimension without touching the moralCircle architecture. See `new-questions.md` Q240-Q242 queue for implementation pattern.

*Option B (architectural):* Add a `global` scope to `scopedAffinities` for respondents who score "global humanity" distinctly above their universal baseline — the opposite of in-group bias. This would require ADR revision (touching 7→7 scopes, but `global` would be a *universalist excess* rather than an in-group excess). High risk; deferred.

*Option C (signature):* Lower 021's `universalAffinity` from 83 to ~70 and raise `ideological` from 25 to 45, to represent cosmopolitan ideological in-group commitment. This would produce ideological excess = max(0, 45–70) = 0 — still no excess. This doesn't fix the structural problem; don't do it.

**Priority:** HIGH — CLAUDE.md designates this "Stage 4 attractor sharpening." Option A is a 2-cycle effort that produces measurable improvement without architectural risk.

---

### Gap 2 — 108/114 Nihilist Pair: near-identical signatures, insufficient discrimination

**Type:** Over-reached mutual attractor — the two archetypes collapse toward each other under any respondent who shows nihilist EPS + anti-institutional stance.

**Evidence from source (`src/config/archetypes.ts`):**

`108 Passive Cynic` (lines 1980–1996):
```ts
MAT: { kind: "continuous", pos: 3, sal: 0 },
CD:  { kind: "continuous", pos: 3, sal: 0 },
CU:  { kind: "continuous", pos: 3, sal: 0 },
PRO: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
COM: { kind: "continuous", pos: 3, sal: 0 },   // ← indifferent
ZS:  { kind: "continuous", pos: 4, sal: 2 },
ONT_H: { kind: "continuous", pos: 1, sal: 2, anti: "high" },
ONT_S: { kind: "continuous", pos: 1, sal: 3, anti: "high" },
EPS: { kind: "categorical", probs: [0.05, 0.05, 0.05, 0.10, 0.15, 0.60], sal: 2 },
moralCircle: { universalAffinity: 97, scopedAffinities: { national: 5, religious: 5, ethnic_racial: 5, class: 5, gender: 5, ideological: 5 } },
```

`114 Political Nihilist` (lines 2096–2112):
```ts
MAT: { kind: "continuous", pos: 3, sal: 0 },
CD:  { kind: "continuous", pos: 3, sal: 0 },
CU:  { kind: "continuous", pos: 3, sal: 0 },
PRO: { kind: "continuous", pos: 1, sal: 3, anti: "high" },
COM: { kind: "continuous", pos: 1, sal: 2, anti: "high" },  // ← anti-compromise
ZS:  { kind: "continuous", pos: 5, sal: 3, anti: "low" },
ONT_H: { kind: "continuous", pos: 1, sal: 3, anti: "high" },
ONT_S: { kind: "continuous", pos: 1, sal: 3, anti: "high" },
EPS: { kind: "categorical", probs: [0.03, 0.03, 0.03, 0.08, 0.10, 0.73], sal: 3 },
moralCircle: { universalAffinity: 97, scopedAffinities: { national: 5, religious: 5, ethnic_racial: 5, class: 5, gender: 5, ideological: 5 } },
```

**Root cause:**

1. **Identical moralCircle.** Both declare `universalAffinity: 97` with all scoped affinities at 5 — max excess = max(0, 5–97) = 0. The moral-circle layer contributes zero discrimination.

2. **Shared ENDS profiles.** Both have all ENDS nodes (MAT/CD/CU) at pos=3 sal=0. The engine has no ENDS signal to separate them. An apathetic respondent who refuses to stake positions on economic or cultural questions matches both equally on 60% of the signature.

3. **Overlapping MEANS.** PRO=1 sal=2 vs PRO=1 sal=3 (same position, 1-unit salience difference). ONT_S=1 sal=3 identical. ZS=4 sal=2 vs ZS=5 sal=3 (1-unit position difference).

4. **COM is the only clean discriminator.** 108 has COM=3 sal=0 (doesn't care about compromise); 114 has COM=1 sal=2 (anti-compromise). This is a real architectural distinction — the Passive Cynic is apathetic about political process, the Political Nihilist actively rejects it — but it requires a COM-specific question to surface.

5. **EPS salience difference.** 108 has EPS sal=2 (nihilist matters), 114 has EPS sal=3 (nihilist is core identity). But EPS salience isn't directly probed — it's inferred from how strongly respondents push on EPS questions. Subtle to measure.

**What the engine probably does:** A respondent who shows nihilist EPS + anti-institutional ONT_S (the shared signal) will receive nearly equal posterior mass on both 108 and 114. The COM=1 distinction for 114 requires a question that specifically asks "do you oppose political compromise in principle?" rather than "are you pragmatic?" No such question currently exists in the live bank.

**Note on 113 Disaffected Contrarian:** 113 has `moralCircle: { universalAffinity: 83, ... }` (not 97), which gives it some moral-circle discrimination from 108/114. Its policy profile is also differentiated (CD=2, ZS=5 sal=3, COM=1 sal=2). 113 is likely more reachable than 108/114 because its profile is more distinct.

**Proposed fix:** Add a direct COM-role question targeting the nihilist/anti-establishment family — "Political leaders who refuse to compromise are [sign of strength / sign of failure / irrelevant, I don't respect any of them]." The third option captures 108 (indifference); the first captures 114 and 113; the second captures non-nihilist archetypes who prefer compromise. One question, three-way split across the nihilist family.

**Priority:** MEDIUM — 108/114 confusion only affects a specific low-engagement persona (HARNESS-HANDOFF persona #15: "young low-trust nihilist"). The harness should test this explicitly.

---

### Gap 3 — Missing archetype: Tech-progressive / epistemic-empiricist urban moderate

**Type:** Missing — no archetype cleanly captures the HARNESS-HANDOFF persona #13 ("Tech-progressive / Yang-curious: suburban college Democrat, cost-of-living focused, climate-priority, immigration moderate, empiricist EPS, technocrat AES").

**Evidence — closest existing archetypes:**

`056 Institutional Leftist` (lines 1028–1054):
```ts
MAT: pos: 2,  // redistributive
CD:  pos: 4,  // culturally moderate-TRADITIONAL  ← mismatch
CU:  pos: 4, sal: 3,
PRO: pos: 3, sal: 2,
ONT_S: pos: 4, sal: 3,
EPS: probs: [0.25, 0.58, ...], // institutionalist-dominant
AES: probs: [0.60, 0.20, ...], // statesman-dominant
```

`057 Temperate Pluralist` (lines 1056–1072):
```ts
MAT: pos: 3,  // economic moderate  ← mismatch (tech-progressive is MAT≈2)
CD:  pos: 2,  // socially liberal ← match
CU:  pos: 5, sal: 2, // strongly pluralist ← match
PRO: pos: 4, sal: 2,
ONT_S: pos: 4, sal: 2,
EPS: probs: [0.25, 0.58, ...], // institutionalist-dominant ← partial match
AES: probs: [0.60, 0.20, ...], // statesman-dominant  ← mismatch (technocrat is index 1)
```

`059 Public-Minded Moderate` (lines 1075–1086):
```ts
MAT: pos: 3, sal: 2, // moderate economics  ← mismatch
CD:  pos: 3, sal: 1, // center on culture  ← mismatch
```

**The gap:** The tech-progressive voter is:
- Economically progressive (MAT≈2, not centrist)
- Culturally liberal (CD≈2, not traditionalist like 056)
- Highly pluralist (CU≈5)
- Strong institutional trust (ONT_S≈5) — believes good policy design can solve collective action problems
- Very optimistic about human change (ONT_H≈5) — techno-optimist
- Empiricist EPS (index 0, not institutionalist index 1)
- Technocrat AES (index 1, not statesman index 0)

No existing archetype has the combination (MAT≈2, CD≈2, ONT_H≈5, AES=technocrat-dominant). 056 gets the MAT right but gets CD wrong (4 vs 2) and AES wrong (statesman vs technocrat). 057 gets CD right but gets MAT wrong (3 vs 2) and AES wrong.

**Why it matters for the harness:** HARNESS-HANDOFF persona #13 is explicitly listed in the battery. If no archetype maps to this voter shape, the persona will either miss (wrong archetype) or land at 056/057 with a forced match, masking the gap. The harness reachability census (§4.4) should flag this as "no archetype hit."

**Proposed resolution (two options):**

*Option A:* Adjust 057 Temperate Pluralist: lower MAT from 3→2 (sal stays 2), shift AES toward technocrat (currently [0.60, 0.20, ...] statesman-dominant → try [0.20, 0.55, 0.04, 0.10, 0.04, 0.07]). This directly maps to the tech-progressive shape without adding an archetype. Risk: 057 currently captures something (economic moderate, culturally liberal) that would be lost if it becomes redistributive.

*Option B:* Add a new archetype (ID to be assigned in the 058-range gap). Signature suggestion:
```ts
MAT: pos: 2, sal: 2,   // progressive on economics
CD:  pos: 2, sal: 2,   // socially liberal
CU:  pos: 5, sal: 2, anti: "low",
PRO: pos: 4, sal: 2,
COM: pos: 3, sal: 1,   // moderate compromise tolerance
ZS:  pos: 2, sal: 1,
ONT_H: pos: 5, sal: 3, anti: "low",  // techno-optimist: humans ARE malleable
ONT_S: pos: 5, sal: 3, anti: "low",  // strong institutional faith
EPS: probs: [0.55, 0.30, 0.03, 0.04, 0.05, 0.03], sal: 2, antiCats: [2, 3, 5], // empiricist-primary
AES: probs: [0.08, 0.65, 0.07, 0.10, 0.03, 0.07], sal: 2, antiCats: [4],       // technocrat-dominant
moralCircle: { universalAffinity: 80, scopedAffinities: { national: 10, religious: 5, ethnic_racial: 5, class: 15, gender: 8, ideological: 25 } },
```

**Priority:** MEDIUM — worth flagging as a harness deliverable (§4.4 "missing archetypes"), but don't add before harness confirms no existing archetype gets reached. Run persona #13 first; report the result; then decide whether to add.

---

