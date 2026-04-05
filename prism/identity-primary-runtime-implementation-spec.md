# Identity-Primary Runtime Implementation Spec

Updated: 2026-04-05

## Purpose
Turn the six intended identity-primary archetype targets into a concrete runtime implementation task.

This spec starts only from file-backed current inputs already verified in source.

## Intended six targets
1. Black Voter
2. White Grievance Voter
3. Evangelical Voter
4. LGBTQ Voter
5. Feminist Voter
6. Male Grievance Voter

## Important model distinction
These are intended real archetype targets in the broader model, but they are not currently emitted by runtime.

Current runtime emits the base 115-archetype system. The missing bridge is a resolution layer that combines:
- demographic intake
- identity-anchor evidence
- PF/TRB/ENG structure
- supporting node evidence

---

## 1. File-backed inputs already available

### 1A. Demographics intake
Live quiz page stores demographics in local storage.

File:
- `prism-quiz-v2-live.html`

Verified write:
- `localStorage.setItem('prism-demographics', JSON.stringify(demoData));`

Verified inclusion in results payload:
- `demographics: JSON.parse(localStorage.getItem('prism-demographics') || '{}'),`

Implication:
- the live quiz already collects a demographic object and passes it forward in `prism-results`
- resolver logic does not need a brand-new collection channel for the current live flow

### 1B. Primary tribal-anchor source
Primary source for what tribal attachment is about:

File:
- `src/config/questions.representative.ts`

Question:
- `Q60`
- `promptShort: "politically_important_identities"`
- `uiType: "ranking"`

Verified key touch:
- `{ node: "TRB_ANCHOR", kind: "derived", role: "anchor", weight: 0.95, touchType: "identity_ranking" }`

Verified ranking-map anchors:
- `national_identity`
- `ideological_identity`
- `religious_identity`
- `class_identity`
- `ethnic_racial_identity`
- `global_citizen`

### 1C. Supporting tribal / identity signals
Verified useful question locations:

- `Q40` in `src/config/questions.representative.ts`
  - `promptShort: "opponents_matter_to_identity"`
  - PF salience + TRB salience

- `Q51` in `src/config/questions.representative.ts`
  - `promptShort: "immigration_national_identity_salience"`
  - TRB salience
  - `TRB_ANCHOR` nationality signal

- `Q81` in `src/config/questions.representative.ts`
  - `promptShort: "party_vs_cause_loyalty"`
  - PF position + ENG position + some TRB position

Questions to treat as not yet confirmed active for resolver assumptions:
- `Q65`
- `Q75`

They may be useful, but require separate active-runtime confirmation before they are relied on.

### 1D. Current engine/state exposure
Verified source locations:

- `src/browser/api.ts`
  - `getResults()`
  - `getRespondentState()`

- `src/types.ts`
  - `RespondentState.answers`
  - `RespondentState.continuous`
  - `RespondentState.categorical`
  - `RespondentState.trbAnchor.dist`

### 1E. Anchor vocabulary already in code
Verified source:
- `src/config/categories.ts`
- `src/engine/math.ts`

Current TRB anchor categories in code:
- `national`
- `ideological`
- `religious`
- `class`
- `ethnic_racial`
- `global`
- `mixed_none`

Implication:
- runtime already has a probability distribution over anchor type
- resolver should consume this instead of re-deriving anchor type from scratch

---

## 2. Missing runtime layer

What does NOT currently exist as a proven shipped feature:
- identity-primary resolver function
- resolved/unresolved identity-primary output object in engine results
- runtime mapping from demographics + TRB anchor + node state to one of the six targets
- results-page rendering for identity-primary classification

So the concrete missing component is:

### New runtime module
Recommended new module:
- `src/identity/resolveIdentityPrimary.ts`

Recommended responsibility:
- accept current respondent signals and demographics
- determine whether identity-primary gate fires
- determine whether classification is unresolved / resolved / none
- return one canonical structured payload for downstream rendering

---

## 3. Recommended integration point

## 3A. Compute in browser results assembly, not in scoring core
Best first insertion point:
- `src/browser/api.ts`

Reason:
- this layer already assembles final quiz results
- it already has access to respondent state
- it avoids contaminating base archetype scoring with identity-resolution logic
- it preserves the distinction between base 115 archetype emission and identity-primary overlay/archetype resolution

### Recommended change shape
Add a new exported helper in browser/api flow:
- `getIdentityPrimaryResult(demographics?)`

Or extend `getResults()` to include:
- `identityPrimary: ...`

But safest first design is:
- keep `getResults()` backward-compatible if possible
- add a new resolver function and include its output only in the live-page payload assembly

## 3B. Live quiz payload insertion point
Verified insertion point in:
- `prism-quiz-v2-live.html`

Current payload includes:
- archetype info
- top5
- respondentState
- demographics

Recommended addition:
- `identityPrimary: PrismEngine.getIdentityPrimaryResult ? PrismEngine.getIdentityPrimaryResult(demographics) : null`

This is the most direct path to getting resolver output into `localStorage['prism-results']` without first rewriting the whole results stack.

## 3C. Results rendering target
A file-backed deployed-style results page exists at:
- `output/prism-results.html`

That page already reads:
- `localStorage.getItem('prism-results')`
- `respondentState`

Recommended later rendering target:
- add an `Identity & Coalition` section driven by `prism.identityPrimary`

---

## 4. Resolver output contract

Recommended TypeScript shape:

```ts
export type IdentityPrimaryLabel =
  | "Black Voter"
  | "White Grievance Voter"
  | "Evangelical Voter"
  | "LGBTQ Voter"
  | "Feminist Voter"
  | "Male Grievance Voter";

export type IdentityPrimaryState = "none" | "unresolved" | "latent" | "active" | "dominant";

export interface IdentityPrimaryResult {
  state: IdentityPrimaryState;
  label?: IdentityPrimaryLabel;
  confidence?: "low" | "medium" | "high";
  reasonCodes: string[];
  anchor?: "national" | "ideological" | "religious" | "class" | "ethnic_racial" | "global" | "mixed_none";
  gate: {
    trb: number;
    pf: number;
    eng: number;
    passedLatent: boolean;
    passedActive: boolean;
    passedDominant: boolean;
  };
}
```

Important principle:
- resolver output must never mutate base archetype match
- it is an additional interpretation/output layer

---

## 5. Gate logic to implement first

Use current docs unless changed later:

### Latent threshold
- TRB >= 3
- PF >= 3
- low or moderate ENG

### Active threshold
- TRB >= 4
- PF >= 4
- ENG >= 3

### Dominant threshold
- TRB >= 4
- PF >= 4
- ENG >= 4

Expected value source:
- read expected node values from `respondentState.continuous`

Recommended helper:
- `expectedContinuousNode(state, nodeId)`

---

## 6. Resolution logic by intended target

## 6A. Black Voter
Required inputs:
- demographics indicates Black / African-American identity
- Q60 / TRB anchor strongly points to `ethnic_racial`
- gate passes at latent/active/dominant level

Useful supporting signals:
- PF high
- TRB high
- identity enemy / in-group salience from Q40

Minimum runtime rule:
- if demographics.race indicates Black
- and anchor top is `ethnic_racial`
- and gate fires
- => Black Voter

## 6B. White Grievance Voter
Required inputs:
- demographics indicates white identity
- Q60 / TRB anchor strongly points to `ethnic_racial`
- gate fires

Supporting evidence needed:
- ZS moderate-high
- CD moderate-high
- ONT_S low / system-broken direction

Minimum runtime rule:
- do NOT assign from white + race-anchor alone
- require at least one or two threat-preservation signals to avoid misclassifying white anti-racist respondents

## 6C. Evangelical Voter
Required inputs:
- Q60 / TRB anchor strongly points to `religious`
- gate fires
- demographics.religion or denomination indicates evangelical / born-again / equivalent

Supporting fallback if denomination unavailable:
- EPS traditionalist leaning

Minimum runtime rule:
- if religion demographic is absent, downgrade to unresolved rather than overclaiming “Evangelical” from religious anchor alone

## 6D. LGBTQ Voter
Required inputs:
- Q60 top identity meaningfully indicates sexuality / LGBTQ identity
- gate fires

Important note:
- current verified Q60 ranking-map values in source do not explicitly show a sexuality-specific anchor bucket
- this is a likely implementation gap between intended overlay logic and current active anchor taxonomy

Consequence:
- resolver likely needs either:
  1. demographic field support for LGBTQ identity, and/or
  2. an additional question-output mapping not yet verified in current source

This is currently the clearest unresolved data-path issue.

## 6E. Feminist Voter
Required inputs:
- gender identity demographic indicates woman / female-identifying
- gate fires
- identity evidence that politics is organized through gendered group attachment

Supporting evidence:
- low CD
- wider MOR
- potentially relevant explicit gender identity question output if present in current demographics form

Important note:
- current verified Q60 anchors do not include a dedicated `gender` anchor category in the active ranking map excerpt we pulled
- this is another likely implementation gap between intended resolver design and currently exposed anchor taxonomy

## 6F. Male Grievance Voter
Required inputs:
- gender identity demographic indicates male-identifying
- gate fires
- supporting grievance/preservation structure

Supporting evidence:
- higher ZS
- higher CD
- group-threat or status-loss orientation

Important note:
- same current gap as Feminist: no verified dedicated gender anchor category in active Q60 anchor map excerpt

---

## 7. Key implementation risk discovered in source audit

The docs describe resolution using race / religion / gender / LGBTQ identity as separate disambiguation paths.

But the currently verified active Q60 ranking map only exposes these anchor buckets:
- national
n- ideological
- religious
- class
- ethnic_racial
- global

That means:
- religion is clearly supported
- race is clearly supported
- gender is not yet clearly visible in the active anchor map we verified
- LGBTQ / sexuality is not yet clearly visible in the active anchor map we verified

So before shipping full resolver logic, one thing must be checked:

### Required verification task
Verify whether current live Q60 UI/options and answer serialization include:
- gender identity anchor
- sexuality / LGBTQ anchor

If not, full six-way runtime resolution is impossible without extending either:
- Q60 options
- demographics interpretation rules
- or both

This is the most important implementation risk discovered in this pass.

---

## 8. Minimal phased implementation plan

### Phase A — Resolver skeleton + unresolved state
- add `src/identity/resolveIdentityPrimary.ts`
- compute gate values from respondentState
- read top TRB anchor from `trbAnchor.dist`
- emit:
  - `none`
  - `unresolved`
  - resolved `Black / White Grievance / Evangelical` where inputs are sufficient

Why these first:
- these are most clearly supported by currently verified source inputs

### Phase B — Live quiz payload wiring
- expose resolver through `src/browser/api.ts`
- inject result into `prism-quiz-v2-live.html` `prismResults` payload

### Phase C — Results display
- update results page source to render `Identity & Coalition`
- show unresolved state when evidence is strong but disambiguation is insufficient

### Phase D — Taxonomy reconciliation
- verify and, if needed, extend active Q60 / demographics support for:
  - Feminist Voter
  - Male Grievance Voter
  - LGBTQ Voter

These three appear to require additional source verification or taxonomy extension before honest runtime emission.

---

## 9. Exact next coding tasks

1. Verify actual demographic field names in `prism-quiz-v2-live.html`
2. Verify actual Q60 live answer options and serialization labels
3. Add typed resolver module in `src/identity/resolveIdentityPrimary.ts`
4. Expose resolver from `src/browser/api.ts`
5. Add resolver output into `prism-quiz-v2-live.html` payload
6. Add narrow tests for:
   - Black Voter resolution
   - White Grievance non-false-positive behavior
   - Evangelical resolution
   - unresolved state when data insufficient
7. Only after that, extend to Feminist / Male Grievance / LGBTQ if verified source inputs support them

---

## 10. Current best truth

### Verified
- demographics channel exists in live quiz
- respondent state is already available at results assembly time
- TRB anchor distribution already exists in engine state
- race and religion anchoring have clear current source support

### Likely but not yet verified
- current live flow has enough structure to support a first resolver pass without touching core scoring

### Unverified / likely incomplete
- full six-way resolution is not yet justified by currently verified Q60 anchor taxonomy alone
- gender and LGBTQ branches may require source extension or additional interpretation logic

## Conclusion
The missing runtime bridge is now concrete.

The safest first implementation is:
- resolver module
- unresolved state support
- race/religion-backed branches first
- then taxonomy verification for gender/LGBTQ branches before claiming full six-way runtime support
