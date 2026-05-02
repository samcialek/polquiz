# `survey_to_prism` Mapping Spec — v0

**Created**: 2026-05-02
**Status**: First-pass design spec. No engine code touched. No commits.
**Inputs**: A1 + A1b intake catalogs at `results/electorate/intake/`.
**Output target**: a function that takes one CES/ANES respondent record and produces a PRISM signature with explicit per-target uncertainty.

---

## 1. Scope and conventions

### 1.1 What this spec defines

For each PRISM mapping target, the v0 spec records:

- **Source variables**, broken out by dataset family (CES Cumulative / CES year-specific / ANES Cumulative VCF / ANES year-specific)
- **Mapping direction** — how survey-scale answers translate into the PRISM scale (1-5 position, 0-3 salience, 0-100 engagement, etc.)
- **Output type** — position posterior, salience posterior, category distribution, moral-boundary salience vector, or engagement scalar
- **Coverage quality** — `strong` / `proxy` / `weak` / `missing`, per dataset family
- **Uncertainty level** — `low` / `medium` / `high` (how tight a posterior the mapper can produce per respondent)
- **Fallback prior** — what the mapper emits when source variables are missing
- **Validation notes / known risks** — what to watch for; what could break this mapping

### 1.2 Terminology (canonical)

This spec uses the project's canonical PRISM terminology:

- **Moral-boundary salience** / **moral-boundary loading** — replaces legacy "partisan fusion" and "tribalism" framings. The model is: *universal moral circle is the baseline; each moral boundary (national, ethnic/racial, religious, class, ideological, gender, political-camp) has its own salience above that baseline*. A respondent is characterized by their universal-circle posture (`MOR position`) plus a 7-vector of per-boundary salience (and an optional aggregate intensity).
- **Engagement** is a separate, **continuous one-dimensional scalar** (0-10 or 0-100). It is *not* called activation. It governs participation/abstention propensity but is not itself an "activated" or "non-activated" binary.
- **PF / TRB are NOT mapper outputs.** Legacy code may still reference these field names; if so, they are documented below as compatibility shims only — populated as derivatives of moral-boundary outputs, never as primary mapper concepts.

### 1.3 Output signature shape (v0)

The mapper emits per respondent:

```
PRISMSignature_v0 = {
  // ENDS
  MAT:    { posPosterior: Dist5, salPosterior: Dist4, uncertainty: Confidence }
  CD:     { posPosterior: Dist5, salPosterior: Dist4, uncertainty: Confidence }
  CU:     { posPosterior: Dist5, salPosterior: Dist4, uncertainty: Confidence }
  MOR:    { posPosterior: Dist5, salPosterior: Dist4, uncertainty: Confidence }
                          // ↑ universal-circle posture (1=narrow, 5=universal)

  // Moral-boundary module (replaces partisan-fusion/tribalism framing)
  moralBoundaries: {
    national:        { salience: number 0..3, uncertainty: Confidence }
    ethnic_racial:   { salience: number 0..3, uncertainty: Confidence }
    religious:       { salience: number 0..3, uncertainty: Confidence }
    class:           { salience: number 0..3, uncertainty: Confidence }
    ideological:     { salience: number 0..3, uncertainty: Confidence }
    gender:          { salience: number 0..3, uncertainty: Confidence }
    political_camp:  { salience: number 0..3, uncertainty: Confidence }
    intensity:       { value: number 0..3, uncertainty: Confidence }
                          // ↑ aggregate moral-boundary loading; optional
  }

  // MEANS
  PRO:    { posPosterior: Dist5, salPosterior: Dist4, uncertainty: Confidence }
  COM:    { posPosterior: Dist5, salPosterior: Dist4, uncertainty: Confidence }

  // REALITY
  ZS:     { posPosterior: Dist5, salPosterior: Dist4, uncertainty: Confidence }
  ONT_H:  { posPosterior: Dist5, salPosterior: Dist4, uncertainty: Confidence }
  ONT_S:  { posPosterior: Dist5, salPosterior: Dist4, uncertainty: Confidence }

  // Categorical
  EPS:    { catDistribution: Dist6, salPosterior: Dist4, uncertainty: Confidence }
                          // ↑ 6 categories: empiricist, institutionalist,
                          //   traditionalist, intuitionist, autonomous, nihilist
  AES:    { catDistribution: Dist6, salPosterior: Dist4, uncertainty: Confidence }
                          // ↑ 6 categories: statesman, technocrat, pastoral,
                          //   authentic, fighter, visionary

  // Engagement (continuous scalar, NOT activation)
  engagement: { value: number 0..10, uncertainty: Confidence }
                          // ↑ 0 = apolitical, 10 = highly engaged

  // Optional: legacy compatibility shims
  legacyShims?: {
    PF?: { posPosterior: Dist5, computedFrom: "moralBoundaries.political_camp" }
    TRB?: { posPosterior: Dist5, computedFrom: "moralBoundaries.intensity × dominant_boundary" }
  }
}
```

`Dist5` = 5-bucket probability distribution (positions 1-5).
`Dist4` = 4-bucket probability distribution (salience levels 0-3).
`Dist6` = 6-bucket probability distribution (categorical).
`Confidence` = `low` | `medium` | `high`.

**Carry uncertainty from day one**: every output field has a `uncertainty` flag derived from how many distinct source items contributed to its inference. A target inferred from a single binary item is `high` uncertainty even if the answer is unambiguous, because unobserved variance is large.

### 1.4 What ACS and Esri can and cannot do here

- **ACS** is poststratification only. It tells the simulator how to weight a sample of survey respondents into a population. It **does not override survey answers** for any individual respondent — a respondent's PRISM signature is built from their reported attitudes, not from their demographic cell averages.
- **ACS-derived weak demographic priors** are allowed only as the fallback when a target's survey variables are entirely missing for a given respondent. Even then, the prior is wide (`high` uncertainty) and never sharper than the survey path would produce.
- **Esri Tapestry** is geography hooks only — it adds neighborhood-segment context for Phase-4 reporting and as an optional MRP covariate. **It is not an individual political mapper.** No PRISM target receives its primary signal from Esri.

---

## 2. Per-target mapping specs

### 2.1 MAT — Material orientation (1=redistribution, 5=free-market)

| Field | Value |
|-------|-------|
| Output type | position (Dist5) + salience (Dist4) |
| Coverage — CES Cumulative | proxy (`economy_retro`, `faminc`, `union`, `investor`, `no_healthins`) |
| Coverage — CES year-specific | strong (e.g., `CC16_337_*` cut spending / raise taxes; `CC16_415r/416r` deficit / tax-type; `CC16_351I` ACA repeal; `CC16_351K` minimum wage) |
| Coverage — ANES Cumulative VCF | strong (`VCF0809` jobs/standard-of-living, `VCF0839` gov services/spending, `VCF0806` gov health insurance) |
| Coverage — ANES year-specific | strong |
| Mapping direction | Liberal-end answers (raise taxes, expand healthcare, support gov jobs) → MAT position low (1-2). Free-market answers → high (4-5). |
| Per-respondent confidence | `low` if 1 item available; `medium` if 2-3; `high` if 4+ converging |
| Fallback prior when missing | uniform position (Dist5 = [0.2, 0.2, 0.2, 0.2, 0.2]); salience prior centered at 1.5 (Dist4 = [0.2, 0.3, 0.3, 0.2]); uncertainty `high` |
| Salience inference | From `economy_retro` × `union` × explicit MAT-issue answer count; respondents who answer many MAT items emphatically get high salience |
| Validation / risks | Direction is unambiguous in modern data. Risk: `pid7` correlates strongly with MAT in modern eras — must NOT use party ID as a MAT input or the mapper becomes circular for vote prediction. Use party ID only for PF/political-camp salience. |

### 2.2 CD — Cultural direction (1=progressive, 5=traditionalist)

| Field | Value |
|-------|-------|
| Output type | position (Dist5) + salience (Dist4) |
| Coverage — CES Cumulative | weak (only `relig_imp`, `relig_church` as crude proxies) |
| Coverage — CES year-specific | strong (`CC16_332a-f` abortion battery; `CC16_335` gay marriage; LGBTQ / gender-identity items in 2018+) |
| Coverage — ANES Cumulative VCF | strong (`VCF0837/0838` abortion, `VCF0834` women's role, `VCF0876/0877` gay rights) |
| Coverage — ANES year-specific | strong (recent waves add trans rights, gender-identity, religious-accommodation items) |
| Mapping direction | Progressive answers (always allow abortion, support gay marriage, support equal women's role) → CD low (1-2). Traditionalist answers → high (4-5). |
| Per-respondent confidence | `medium` for any 2-item CES year-specific; `high` for full battery |
| Fallback prior when missing | uniform position; salience prior derived from `relig_imp` (high relig importance → CD salience above average) |
| Salience inference | From `relig_imp`, `relig_church`, and number of explicit social-issue answers; cultural-conservative respondents tend high CD salience |
| Validation / risks | Era-specific items: trans-rights items are CD-loaded only 2020+. Mapper needs era-specific item selection. Respondents who selectively answer some social items but not others (e.g., supports gay marriage AND restricts abortion) need posterior smoothing rather than a single point estimate. |

### 2.3 CU — Cultural uniformity / pluralism (1=one shared way, 5=different ways side-by-side)

| Field | Value |
|-------|-------|
| Output type | position (Dist5) + salience (Dist4) |
| Coverage — CES Cumulative | weak (no direct items) |
| Coverage — CES year-specific | strong (`CC16_331_*` 8-item immigration battery covers Muslim-ban / DACA / refugees / English-civic) |
| Coverage — ANES Cumulative VCF | proxy (`VCF0879` immigration levels — single item) |
| Coverage — ANES year-specific | strong (`V202232/233/234` levels/jobs/refugees in 2020; analogous in 2024) |
| Mapping direction | Pluralist / pro-immigration / multi-culture answers → CU high (4-5). Restrictionist / one-shared-way answers → CU low (1-2). |
| Per-respondent confidence | `medium` from CES year-specific; `low` from ANES VCF alone |
| Fallback prior when missing | uniform position; weak ACS-derived prior available (foreign-born status, language at home) but should not be trusted to override missing survey answers |
| Salience inference | Number of immigration items engaged with + emphasis level on those items; single-issue immigration voters get high CU salience |
| Validation / risks | CU and CD often co-vary in survey data — joint factor analysis preferred over independent fits. National-identity items (where available) load on both CU and `moralBoundaries.national`; the mapper must split that signal carefully. |

### 2.4 MOR — Moral circle position (universal moral-circle posture; 1=narrow/in-group, 5=universal)

| Field | Value |
|-------|-------|
| Output type | position (Dist5) + salience (Dist4) — the *universal-circle posture* axis |
| Coverage — CES Cumulative | weak (`relig_*` items inform the religious-boundary side only) |
| Coverage — CES year-specific | derived (refugee + Muslim-ban items; foreign aid items where present) |
| Coverage — ANES Cumulative VCF | derived (`VCF0830` aid to Black Americans + immigration items; in-group/out-group thermometer differentials) |
| Coverage — ANES year-specific | derived (group-empathy battery in 2020; foreign-aid items; refugee items) |
| Mapping direction | Universalist answers (support refugees, support foreign aid, narrow in-group/out-group thermometer gap) → MOR high (4-5). Narrow-circle answers → low (1-2). |
| Per-respondent confidence | `medium` when 3+ items contribute; `high` only with thermometer-gap signal (ANES path) |
| Fallback prior when missing | uniform position; uncertainty `high` |
| Salience inference | Foreign-aid prioritization + refugee-admission stance + thermometer-spread; universalists with high salience are distinctive |
| Validation / risks | MOR position and *moral-boundary salience* are conceptually orthogonal: someone can have a narrow moral circle (low MOR pos) AND high overall moral-boundary loading (a tribal nationalist), or wide circle AND low loading (a chill cosmopolitan). The mapper must not collapse these. |

### 2.5 Moral-boundary module (the highest-risk derived inference)

This module replaces the legacy MOR-only / TRB-anchor / PF framing. Each respondent gets a salience value (0-3) per boundary, plus an aggregate intensity scalar. Mapping principle: **universal moral circle is the baseline; each per-boundary salience is the *loading above that baseline* on that specific identity-political dimension.**

For all seven boundaries, output type is `salience` (number 0-3, not a Dist5 of position).

#### 2.5.1 `moralBoundaries.national` — national-identity loading

| Field | Value |
|-------|-------|
| Output type | salience scalar 0-3 |
| Coverage — CES Cumulative | weak (no direct item) |
| Coverage — CES year-specific | proxy (immigration restrictiveness composite + national-pride items where present) |
| Coverage — ANES Cumulative VCF | strong (national-identity items where available; `VCF0879` immigration as proxy) |
| Coverage — ANES year-specific | strong (national-pride battery; flag/anthem items in some waves) |
| Mapping direction | High national-pride + immigration restrictionism + "America first" framing → high salience (2.5-3). Globalist / anti-nationalist answers → low (0-0.5). |
| Per-respondent confidence | `medium` typically; `high` when 4+ items converge |
| Fallback prior when missing | salience = 1.0 (mid-low default); uncertainty `high` |
| Validation / risks | National-pride items vary across waves and surveys. ANES has more consistent items than CES. |

#### 2.5.2 `moralBoundaries.ethnic_racial` — ethnic/racial-identity loading

| Field | Value |
|-------|-------|
| Output type | salience scalar 0-3 |
| Coverage — CES Cumulative | proxy (respondent's `race` × `race_h` provides demographic context only) |
| Coverage — CES year-specific | derived (race-policy items; Black Lives Matter items in 2020+; affirmative-action items where present) |
| Coverage — ANES Cumulative VCF | strong (own-race vs other-race thermometer differential; `VCF0830` aid to Black Americans) |
| Coverage — ANES year-specific | strong (full feeling-thermometer battery for racial groups) |
| Mapping direction | Wide thermometer gap between own-race and other-race + race-conscious policy stance → high salience. Symmetric thermometers + race-blind framing → low salience. |
| Per-respondent confidence | `medium` for CES path; `high` for ANES with thermometers |
| Fallback prior when missing | salience = 1.0; uncertainty `high` |
| Validation / risks | This is one of the most sensitive inferences. The mapper must not conflate *being a racial-minority respondent* with *high ethnic-racial salience* — that's a common error. Salience is about how much a boundary structures political reasoning, not group membership. |

#### 2.5.3 `moralBoundaries.religious` — religious-identity loading

| Field | Value |
|-------|-------|
| Output type | salience scalar 0-3 |
| Coverage — CES Cumulative | strong (`relig_imp` × `relig_church` × `relig_bornagain` is a clean composite) |
| Coverage — CES year-specific | strong (religion-in-public-life items where present) |
| Coverage — ANES Cumulative VCF | strong (church attendance + religious importance items long-running) |
| Coverage — ANES year-specific | strong |
| Mapping direction | High `relig_imp` + frequent `relig_church` + `relig_bornagain=Yes` → high salience. Atheist/never-attends → low (0-0.5). |
| Per-respondent confidence | `medium` to `high` for most respondents |
| Fallback prior when missing | salience = 1.0; uncertainty `high` |
| Validation / risks | Best-covered moral boundary. Risk: respondents who self-identify with a religion but rarely attend may still have high *political* religious salience (cultural Christians, identity Catholics) — a single-item `relig_imp` won't catch this. |

#### 2.5.4 `moralBoundaries.class` — class-identity loading

| Field | Value |
|-------|-------|
| Output type | salience scalar 0-3 |
| Coverage — CES Cumulative | proxy (`union` + `union_hh` + `faminc` × `educ` interaction) |
| Coverage — CES year-specific | derived (economic-conflict framing items; "people like me" wording) |
| Coverage — ANES Cumulative VCF | derived (rich-vs-poor thermometer gap; class-conflict items) |
| Coverage — ANES year-specific | proxy (rural-urban identity items added in 2020) |
| Mapping direction | Rich-vs-poor thermometer gap + economic-conflict salience + union household → high salience. Detached-from-class-framing → low salience. |
| Per-respondent confidence | `low` to `medium` |
| Fallback prior when missing | salience = 1.0; uncertainty `high` |
| Validation / risks | Class is the most *implicit* moral boundary in US surveys — Americans rarely self-describe class identity even when their politics is class-organized. The mapper must rely on derived inference and accept low confidence. |

#### 2.5.5 `moralBoundaries.ideological` — ideological-identity loading

| Field | Value |
|-------|-------|
| Output type | salience scalar 0-3 |
| Coverage — CES Cumulative | strong (`ideo5` strength + `pid7` strength; ideology-extremity composite) |
| Coverage — CES year-specific | strong |
| Coverage — ANES Cumulative VCF | strong (`VCF0803` 7-pt ideology + `VCF0810` strength + liberal-vs-conservative thermometer gap `VCF0211/0212`) |
| Coverage — ANES year-specific | strong |
| Mapping direction | Strong ideological self-placement (1 or 5 on `ideo5`; 1 or 7 on VCF0803) + wide liberal-conservative thermometer gap → high salience. Centrist/non-ideological → low salience. |
| Per-respondent confidence | `high` for most respondents |
| Fallback prior when missing | salience = 1.0; uncertainty `high` |
| Validation / risks | Strong coverage. Risk: ideology strength is correlated with engagement; the mapper must not double-count engagement signal here. |

#### 2.5.6 `moralBoundaries.gender` — gender-identity loading

| Field | Value |
|-------|-------|
| Output type | salience scalar 0-3 |
| Coverage — CES Cumulative | proxy (`gender` × political behavior interaction; `sexuality` for LGBTQ) |
| Coverage — CES year-specific | derived (gender-identity policy items in 2018+; Me Too / sexual-harassment items in 2018+) |
| Coverage — ANES Cumulative VCF | proxy (`VCF0834` women's role; gender-thermometer differential where available) |
| Coverage — ANES year-specific | strong (Me Too / Planned Parenthood thermometers in 2020 — `V202183`, `V202185`) |
| Mapping direction | Gender-conscious policy stance + wide men-vs-women thermometer gap + Me Too engagement → high salience. Gender-blind framing → low salience. |
| Per-respondent confidence | `low` to `medium` |
| Fallback prior when missing | salience = 1.0; uncertainty `high` |
| Validation / risks | Asymmetric: gender salience as a moral boundary is much higher among women in modern data, but the mapper must not assume "respondent is woman → gender salience is high" — it depends on whether their politics is *organized* around gender. |

#### 2.5.7 `moralBoundaries.political_camp` — political-camp boundary loading

This boundary replaces the legacy "political fusion" framing. It captures how strongly a respondent's politics is *organized around partisan camp identity itself* — distinct from issue position.

| Field | Value |
|-------|-------|
| Output type | salience scalar 0-3 |
| Coverage — CES Cumulative | proxy (`pid7` strength alone — strong but blunt) |
| Coverage — CES year-specific | derived (out-party feeling thermometers where collected; partisan-conflict framing items) |
| Coverage — ANES Cumulative VCF | strong (`VCF0201 - VCF0202` Dem-vs-Rep thermometer gap × `VCF0301` party-ID 7-pt strength — the canonical affective-polarization measure) |
| Coverage — ANES year-specific | strong (full thermometer battery each cycle) |
| Mapping direction | Wide party-thermometer gap + strong partisan ID + high political-camp consciousness → high salience. Independent / split-ticket / cross-party-warm respondents → low salience. |
| Per-respondent confidence | `medium` for CES path (relies on `pid7` strength alone); `high` for ANES with thermometers |
| Fallback prior when missing | salience = 1.0; uncertainty `high` |
| Validation / risks | This is where ANES dramatically beats CES. The mapper's confidence on this boundary is much higher when ANES thermometers are available. CES-only path needs to flag the elevated uncertainty. **Do not call this "partisan fusion"** — that's a legacy framing. |

#### 2.5.8 `moralBoundaries.intensity` — aggregate moral-boundary loading

| Field | Value |
|-------|-------|
| Output type | scalar 0-3 |
| Mapping | Composite of the seven per-boundary salience values; e.g., `intensity = max(per_boundary) × 0.6 + mean(per_boundary) × 0.4`, capped at 3 |
| Coverage | Inherits the *worst* coverage across the contributing boundaries |
| Per-respondent confidence | The minimum confidence across the contributing boundaries (intensity is no more reliable than its weakest input) |
| Fallback prior | If 5+ boundaries are at fallback prior, intensity also falls back to 1.0 with `high` uncertainty |
| Validation / risks | Optional output for engine consumers that need a single scalar (older code paths). Should not be used as a primary signal — the per-boundary breakdown is richer. |

### 2.6 PRO — Proceduralism (1=results, 5=rules)

| Field | Value |
|-------|-------|
| Output type | position (Dist5) + salience (Dist4) |
| Coverage — CES Cumulative | missing |
| Coverage — CES year-specific | weak (election-integrity items in 2020/2024; willingness-to-break-norms items sporadic) |
| Coverage — ANES Cumulative VCF | proxy (`VCF0604` trust in government; `VCF0606` who-government-benefits — captures procedural confidence indirectly) |
| Coverage — ANES year-specific | weak / derived (democracy-norms battery in 2020+; election-legitimacy items 2020+) |
| Mapping direction | High norm-respect + procedural trust → PRO high (4-5). Willing to break rules / "results matter" framing → low (1-2). |
| Per-respondent confidence | `low` to `medium` even with best inputs |
| Fallback prior when missing | uniform position; uncertainty `high` |
| Validation / risks | **Weak survey coverage.** Mapper must accept that PRO will be the highest-uncertainty continuous node. Vote-formula sensitivity to PRO needs to be checked at the engine level — if the engine relies heavily on PRO, this is a model-coverage risk. |

### 2.7 COM — Compromise tolerance (1=principled, 5=dealmaker)

| Field | Value |
|-------|-------|
| Output type | position (Dist5) + salience (Dist4) |
| Coverage — CES Cumulative | missing |
| Coverage — CES year-specific | missing — surveys rarely ask "do you prefer compromise" directly |
| Coverage — ANES Cumulative VCF | weak (sporadic indirect items on partisan-conflict tolerance) |
| Coverage — ANES year-specific | weak / derived ("politicians should compromise" Likert items appear in 2016, 2020) |
| Mapping direction | When items exist: pro-compromise → COM high; principled / no-deals → low |
| Per-respondent confidence | `low` for nearly all respondents — most cycles have no direct item |
| Fallback prior when missing | uniform position (Dist5 = [0.2 × 5]); salience prior derived weakly from `pid7` strength × `ideo5` strength (strong partisans tend low-COM); uncertainty `high` |
| Validation / risks | **Weakest-covered continuous node.** v0 mapper output for COM should be near-uniform-prior across most of the electorate. Engine consumers must be aware that COM is not a high-signal field. |

### 2.8 ZS — Zero-sum orientation (1=positive-sum, 5=zero-sum)

| Field | Value |
|-------|-------|
| Output type | position (Dist5) + salience (Dist4) |
| Coverage — CES Cumulative | weak (`economy_retro` only) |
| Coverage — CES year-specific | derived (trade items: "other countries' gain = our loss"; inter-group economic competition items) |
| Coverage — ANES Cumulative VCF | derived (race-aid items + immigration-takes-jobs items; pre-2008 limited) |
| Coverage — ANES year-specific | strong (`V202233` immigration-takes-jobs in 2020; analogous in 2024) |
| Mapping direction | "Their gain is our loss" framing across trade/immigration/economic items → ZS high (4-5). Positive-sum / "rising tide" framing → ZS low (1-2). |
| Per-respondent confidence | `medium` when 3+ items converge |
| Fallback prior when missing | uniform position; uncertainty `high` |
| Salience inference | Number of zero-sum-framed answers + emphasis; rare for a respondent to have high ZS salience in isolation |
| Validation / risks | ZS often correlates with `moralBoundaries.national` and `moralBoundaries.ethnic_racial` — joint estimation prevents double-counting. |

### 2.9 ONT_H — Human malleability (1=fixed, 5=shaped by environment)

| Field | Value |
|-------|-------|
| Output type | position (Dist5) + salience (Dist4) |
| Coverage — CES Cumulative | missing |
| Coverage — CES year-specific | missing — not standard survey content |
| Coverage — ANES Cumulative VCF | derived (Feldman-Stenner authoritarian-parenting battery when present) |
| Coverage — ANES year-specific | proxy (Feldman-Stenner items in 2008+ ANES; e.g. V162267-V162272 in 2016 — verify) |
| Mapping direction | Authoritarian-parenting answers (obedience > self-reliance; respect-for-elders > independence) → ONT_H low (1-2; humans fixed). Permissive-parenting answers → ONT_H high (4-5; humans shaped by environment). |
| Per-respondent confidence | `medium` from full Feldman-Stenner battery; `low` otherwise |
| Fallback prior when missing | uniform position; uncertainty `high` |
| Validation / risks | **CES-only mapper path has effectively no ONT_H signal.** Decision needed: either (a) accept ONT_H = uniform prior for CES electorates, or (b) impute from demographics (risky — turns demographic correlates into political content). v0 spec recommends (a). |

### 2.10 ONT_S — System ontology (1=rigged, 5=institutions can produce good change)

| Field | Value |
|-------|-------|
| Output type | position (Dist5) + salience (Dist4) |
| Coverage — CES Cumulative | weak (`approval_pres`, `approval_rep` are situational not structural) |
| Coverage — CES year-specific | derived ("system rigged" items in 2016+) |
| Coverage — ANES Cumulative VCF | strong (`VCF0604` trust in government, `VCF0606` benefits-few-vs-many) |
| Coverage — ANES year-specific | strong (trust-in-institutions battery: gov, courts, media, science — V162310-series in 2016; analogous 2020/2024) |
| Mapping direction | High trust in institutions (gov, courts, science) + belief that institutions can produce good change → ONT_S high (4-5). "System is rigged" / institutional nihilism → low (1-2). |
| Per-respondent confidence | `high` for ANES path with trust battery; `medium` for CES |
| Fallback prior when missing | uniform position; salience prior centered at 1.5; uncertainty `high` |
| Validation / risks | **Beware of partisan situational confound**: under a co-partisan administration, partisans of the in-party report higher institutional trust than they "really" hold. ANES asks separately about specific institutions (some partisan, some less); the mapper should weight those that don't switch with administration (courts, scientists) over presidential approval. |

### 2.11 EPS — Epistemic style distribution (categorical: 6 categories)

Categories: `empiricist, institutionalist, traditionalist, intuitionist, autonomous, nihilist`.

| Field | Value |
|-------|-------|
| Output type | category distribution (Dist6) + salience (Dist4) |
| Coverage — CES Cumulative | missing |
| Coverage — CES year-specific | derived (`newsint` + media-trust items 2018+; trust-in-experts items where present) |
| Coverage — ANES Cumulative VCF | derived (trust-in-media + science-trust items long-running) |
| Coverage — ANES year-specific | proxy (faith-in-experts/science battery in 2020; analogous 2024) |
| Mapping direction | High science-trust + media-trust + journalism-trust → empiricist or institutionalist weight. Religious-authority preference → traditionalist. Personal-experience-only → autonomous. Distrust of all sources → nihilist. |
| Per-respondent confidence | `low` to `medium` — categorical 6-way assignment from 2-3 items has substantial uncertainty |
| Fallback prior when missing | broad prior centered on institutionalist + empiricist (Dist6 ≈ [0.20, 0.30, 0.10, 0.15, 0.15, 0.10]); uncertainty `high` |
| Validation / risks | v0 mapper should *output a probability distribution over the 6 categories*, not a hard categorical assignment. Most respondents will land on a mixture rather than a clean bucket. |

### 2.12 AES — Aesthetic style distribution (categorical: 6 categories)

Categories: `statesman, technocrat, pastoral, authentic, fighter, visionary`.

| Field | Value |
|-------|-------|
| Output type | category distribution (Dist6) + salience (Dist4) |
| Coverage — all sources | **missing** — surveys do not directly probe aesthetic preference. |
| Mapping direction | n/a |
| Per-respondent confidence | `high` uncertainty by construction |
| Fallback prior when missing (i.e., default for all respondents) | **uniform prior** (Dist6 = [1/6 × 6]); salience prior centered at 1.0 (Dist4 = [0.25 × 4]); uncertainty `high` |
| Validation / risks | Per the project's own ADR-003, AES is archetype-label flavor and not load-bearing for vote prediction. v0 mapper outputs uniform AES for everyone — this is the honest answer. **Do NOT infer AES from candidate-feeling-thermometer differentials**: that would be circular for vote prediction (you'd be using the dependent variable to infer the predictor). If a non-circular AES proxy is later identified, this field is the right place to add it. |

### 2.13 Engagement — continuous scalar (NOT activation)

| Field | Value |
|-------|-------|
| Output type | continuous scalar 0-10 (`engagement.value`) + uncertainty flag |
| Coverage — CES Cumulative | strong (`newsint` 4-pt news interest; `intent_turnout_self`, `voted_turnout_self`, `vv_turnout_gvm` validated) |
| Coverage — CES year-specific | strong (plus political-discussion items in some cycles) |
| Coverage — ANES Cumulative VCF | strong (interest-in-campaign + follow-politics + past-vote items) |
| Coverage — ANES year-specific | strong (plus social-media political activity 2016+) |
| Mapping direction | Validated turnout = 1 + `newsint` = "most of the time" + multiple past-cycles voted + political-discussion-frequent → engagement near 10. Validated turnout = 0 + `newsint` = "hardly at all" + no past-cycles voted → engagement near 0. |
| Per-respondent confidence | `high` when `vv_turnout_gvm` available; `medium` from self-report only |
| Fallback prior when missing | engagement = 5.0 (mid-scale); uncertainty `high` |
| **NOT** | activation. Engagement is not a binary. The mapper outputs a real-valued scalar — engine consumers should treat it as such. |
| Validation / risks | `vv_turnout_gvm` is the gold-standard component; weight it heavily. `intent_turnout_self` (pre-election) overstates actual turnout — discount it relative to validated. Self-report bias is asymmetric (over-reporting voting much more common than under-reporting). |

### 2.14 Legacy compatibility shims (optional output, NOT primary)

If engine code currently expects `PF` or `TRB` fields:

- **`PF` (legacy)**: derive as `posPosterior` reflecting `moralBoundaries.political_camp.salience` mapped to a 1-5 scale (salience 0 → pos 1; salience 3 → pos 5). Document that this is a derivation, not an independent inference. Sunset when engine no longer reads `PF` directly.
- **`TRB` (legacy)**: derive as `posPosterior` reflecting `moralBoundaries.intensity × dominant_boundary_indicator` mapped to 1-5. Document as derivation. Sunset on schedule.

These shims exist *only* for backward compatibility with existing engine fields. They are not separate mapper concepts. New consumers should read the moral-boundary module directly.

---

## 3. Coverage / uncertainty matrix (summary)

Per target × dataset family, marking `S` = strong, `P` = proxy, `W` = weak, `M` = missing, `D` = derived (composite).

| Target | CES Cum | CES year | ANES VCF | ANES year | Inherent uncertainty (best path) |
|--------|---------|----------|----------|-----------|----------------------------------|
| MAT | P | S | S | S | low |
| CD | W | S | S | S | low |
| CU | W | S | P | S | medium |
| MOR position | W | D | D | D | medium |
| moralBoundaries.national | W | P | S | S | medium |
| moralBoundaries.ethnic_racial | P | D | S | S | medium |
| moralBoundaries.religious | S | S | S | S | low |
| moralBoundaries.class | P | D | D | P | high |
| moralBoundaries.ideological | S | S | S | S | low |
| moralBoundaries.gender | P | D | P | S | medium |
| moralBoundaries.political_camp | P | D | S | S | medium |
| moralBoundaries.intensity | (composite) | (composite) | (composite) | (composite) | inherits worst input |
| PRO | M | W | P | W | high |
| COM | M | M | W | W | high |
| ZS | W | D | D | S | medium |
| ONT_H | M | M | D | P | high (CES path: floor) |
| ONT_S | W | D | S | S | low (ANES) / medium (CES) |
| EPS distribution | M | D | D | P | high |
| AES distribution | M | M | M | M | high (uniform prior) |
| Engagement | S | S | S | S | low |

---

## 4. Mapper Revision Protocol

When a coalition gate fails (output of C3 / C4), how should the mapper be revised? The goal is to fix the right thing without overfitting a single election.

### 4.1 Five-way classification of gate failures

When a `CoalitionGateResult` flags failures, the C4 reporter classifies them into five categories. Mapper revisions are appropriate **only for category (a)**:

(a) **Mapper error** — survey-to-PRISM mapping is miscalibrated for the failing subgroup. Revise this spec.

(b) **Candidate signature error** — the candidate's PRISM coding (in `src/historical/candidates.ts`) is off. Revise the candidate signature, not the mapper.

(c) **Turnout/engagement error** — the mapper's engagement scalar mis-estimates participation for the subgroup. May involve mapper *or* the engagement-to-turnout function in the engine. Investigate engagement coverage first; only revise mapper if engagement inputs are clearly under-utilized.

(d) **Vote-formula error** — the engine's distance / weighting / clearing-bar logic produces wrong outputs even with correct mapper outputs. Engine-side issue; mapper unchanged.

(e) **Benchmark or coverage error** — benchmark missing, subgroup tag mis-spelled, or population not in scope. Fix benchmarks or the demographic tagger; mapper unchanged.

### 4.2 Mapper-error decision rules

A failure is a mapper-error candidate **only if all the following hold**:

1. The candidate signature for that election has been independently audited and looks reasonable
2. Engagement/turnout for the failing subgroup tracks reported levels (no gross over- or under-estimation)
3. The engine vote-formula has been validated against other-cycle predictions for similar subgroups
4. The failing subgroup's per-target uncertainty was *not* already flagged `high` (high-uncertainty targets are *expected* to mispredict; that's not a mapper bug, it's a coverage gap)

If all four hold, the mapper is the prime suspect. Revise this spec — but follow the no-overfit guardrails below.

### 4.3 No-overfit guardrails

Mapper revisions are tempting after a single-cycle failure because the failing subgroup's behavior is fresh and concrete. Resist:

- **One-cycle rule**: do NOT revise a mapping based on a single year's coalition gate failure. Hold the proposed change against ≥2 cycles' coalition gates. If the change improves fit in the failing year but worsens fit in another year by ≥1 severity bucket, reject.
- **Subgroup-symmetric check**: if a revision improves fit for white-college, run the same revision against white-non-college and ≥3 other realignment cells. A revision that helps one subgroup at the cost of another is usually a coverage problem, not a mapper problem.
- **Direction-of-effect sanity**: a revision must have a defensible *theoretical* direction-of-effect, not just an empirical one. "Setting `relig_imp`'s contribution to MOR salience to 0.7 instead of 0.5 fits 2020 better" is weak; "the 2020 cycle elevated `moralBoundaries.religious` more than typical because [specific election context], and 0.7 better reflects that" is acceptable only as a per-cycle override, not a permanent change.
- **Document every revision** at the bottom of this spec under "Revision history" with: failing year, failing subgroup, gate-output severity, hypothesized cause, the proposed change, the cross-cycle holdout result, and the decision (accept / reject / per-cycle override).

### 4.4 Per-cycle vs structural revisions

Two flavors of mapper revision are allowed:

- **Structural revision** — changes the mapping for all cycles equally (e.g., adjusting how `relig_imp` weights into `moralBoundaries.religious`). Requires holdout validation across ≥3 cycles and an entry in the revision history.
- **Per-cycle override** — a documented adjustment for a specific year, applied only to that year's electorate (e.g., 1968 had an unusually salient national-identity boundary because of Vietnam). Fine to do, but each override is a *coverage gap acknowledged*, not a fix — it should be flagged as a known gap until a structural revision absorbs it.

### 4.5 What should NEVER trigger a mapper revision

- A single year's popular-vote-share miss without coalition decomposition
- Pressure from a candidate-signature debate (different problem)
- Pressure from engine knob debates (different problem)
- An election that surprised pundits (an election surprising pundits is not, by itself, evidence the mapper is wrong)

---

## 5. Open issues for v1

- **Joint vs independent posterior fitting**: v0 spec treats each target's posterior as independently inferred from its own evidence. v1 should explore joint fitting — e.g., MAT and CD have known joint structure (libertarians: high MAT + low CD; populists: low MAT + high CD); fitting them jointly may improve coverage without over-constraining.
- **morBoundaries inference order**: should the seven boundaries be fit in parallel or sequentially? Sequential fitting risks early-boundary inferences pre-conditioning later ones; parallel fitting risks over-explaining shared variance. v0 treats them as parallel; v1 should test.
- **Engagement → turnout function**: the spec defines engagement as a continuous scalar but does not specify how engine's clearing-bar consumes it. That's an engine-side decision, but the mapper's choice of 0-10 scale is calibrated to be easy to map to clearing-bar thresholds.
- **Era-specific item availability**: the per-target coverage labels assume *modern* CES/ANES coverage. Pre-2008 mappings will need different (mostly thinner) coverage labels — out of v0 scope.
- **Verifying ANES VCF codes**: the variable codes drawn from training-data knowledge in A1 should be verified against the actual codebooks before any of the ANES-VCF mappings here are coded.

---

## 6. Files in this spec

- `survey-to-prism-v0.md` (this file)
- `survey-to-prism-v0.json` — machine-readable companion (per-target structured spec)

No engine code modified. No commits made.

---

## 7. Revision history

(Empty at v0. Each future revision logged with: date, failing year, failing subgroup, gate severity, hypothesized cause, change applied, cross-cycle holdout result, decision.)
