# Phase 3 Plan — ADR-001 + ADR-002 Combined Implementation

**Scope.** Single coordinated migration of the archetype assignment scorer (Euclidean winner-take-all, per-archetype priors eliminated) and the ENG node (removed from archetype signatures, promoted to a separate engagement-label module).

**Pauses.** This document is 3a. The prompt specifies PAUSE here and again after 3f (duplicate detection). Steps 3b–3e run end-to-end after 3a approval; 3g–3h run end-to-end after 3f approval.

---

## 1. File-by-file impact summary

### `src/types.ts`

**Change.** Archetype type loses `prior` and `trbAnchorPrior` (3c). RespondentState loses `archetypePosterior` field; replaced by `archetypeDistances: Record<string, number>` (populated after each answer by the new scorer). `currentLeader` and `consecutiveLeadCount` stay — leader is argmin(distance). `ContinuousNodeId` loses `"ENG"` (3b). New `EngagementLabel` + `EngagementResult` types (3e). New `FamilyMap` type: `Record<string, ReadonlySet<string>>` (3c). New `Phase3QuizResult` shape with `archetype: {id, name, distance}`, `engagement: EngagementResult`, `family?: {partner_id, partner_name}`, `top3: ArchetypeDistanceEntry[]`.

**Why.** ENG drops out of the type system entirely. Priors disappear. Distance-based state and result shape replace posterior-based.

### `src/config/archetypes.ts`

**Change.** Remove the `ENG: { kind: "continuous", ... }` line from all 121 entries (3b). Remove `prior` field from all entries (3c). Remove any `trbAnchorPrior` entries (currently none per Phase 1 diagnosis, so a no-op).

**Why.** Signatures are the source of truth for both dropped concepts.

### `src/engine/archetypeDistance.ts`

**Change.** Rewrite the default export `archetypeDistance` to the new weighted Euclidean formula:
```
For each of the 13 nodes (11 continuous + 2 categorical):
  w_i = max(s_i^A, s_i^R)
  Continuous nodes (11):
    base_i = (p^A_i - p^R_i)² * w_i
    anti_i = 10.0 if anti triggered else 0
    d_i    = base_i + anti_i
  Categorical nodes (2):
    d_i_unweighted = (preferred-present ? (1 - p_R[preferred]) : 0)
                   + (anti-present      ? Σ_{c∈antiCats} p_R[c] : 0)
    d_i = d_i_unweighted * w_i
D(A,R) = sqrt(sum_i d_i)
```
- Continuous: `p^A = template.pos` (1-5). `p^R = sum(posDist[k]·(k+1))`. `Δp = p^A - p^R`. `s^A = template.sal` (0-3). `s^R = sum(salDist[k]·k)`. Contribution `base_i = (Δp)² * max(s^A, s^R)`, plus anti penalty as below.
- Categorical (FINAL — replaces earlier argmax draft): operates directly on the respondent's posterior `p_R` over the 6 categories. The archetype's state on this node is one of three:
  - **Preferred-present:** `max(template.probs) ≥ 0.30` → `preferred = argmax(template.probs)`. Contributes `(1 - p_R[preferred])` to the unweighted distance.
  - **Anti-present:** `template.antiCats` is non-empty. Contributes `Σ_{c ∈ antiCats} p_R[c]` to the unweighted distance.
  - **Silent:** neither preferred nor anti → contributes `0` on this node (the archetype simply doesn't constrain this categorical).

  An archetype may be both preferred-present AND anti-present on the same node — both terms are summed. The unweighted contribution is then multiplied by salience weight: `d_i = d_i_unweighted * max(s_i^A, s_i^R)`. No separate anti-penalty for categorical (anti is folded into the distance via the `Σ p_R[antiCat]` term, scaled by salience).

  The `0.30` "preferred" threshold is a defensible default and explicitly a Stage 4 calibration item — not a placeholder. The implementation uses 0.30 concretely; revisit only if 3g regression motivates change.

- Anti triggering for **continuous nodes** (per spec, fixed 10 pre-sqrt):
  - anti=="high" triggers when `p^R > 3.8`; anti=="low" when `p^R < 2.2`. Per node, anti fires at most once (`+10`).
  - `d_i_continuous = base_i + (10 if anti triggered else 0)`.

Keep `archetypeDistanceV1` and `archetypeDistanceV2` exactly as today per constraint. Remove `viableArchetypes` — it reads `state.archetypePosterior` which no longer exists. Its consumers migrate to `viableByDistance(state, archetypes, ratio)` which returns archetypes within `(1 + ratio) * d_min`.

**Why.** This is the scorer swap itself.

### `src/engine/archetypeFamilies.ts` (NEW)

**Purpose.** Pre-compute the 118×118 pairwise archetype-to-archetype distance matrix and derive the family-membership set per archetype.

**API.**
```ts
export interface ArchetypeFamilyIndex {
  pairwise: Record<string, Record<string, number>>; // distances
  familyOf: Record<string, ReadonlySet<string>>;    // the family set
  threshold: number;                                 // the 10th-percentile cut
}
export function buildArchetypeFamilies(archetypes: Archetype[]): ArchetypeFamilyIndex;
```

**Method.** For each pair (A, B), compute Euclidean distance using the SAME 13-node formula but with BOTH archetypes supplying position+salience (no respondent state). Per node: `(p^A - p^B)² · max(s^A, s^B)`, no anti penalty (anti is a respondent concept). Over all `118·117/2 = 6,903` non-self pairs, take the 10th percentile → `threshold`. For each archetype A, `familyOf[A] = {B ≠ A : pairwise[A][B] ≤ threshold}`.

Deactivated archetypes (019, 023, 025): include them in the pair computation but flag the result. Since they cannot win MAP under the new scorer either (see §6), their family membership matters only for symmetric-lookup consistency when a winning archetype lists them as neighbors. Concretely: a non-deactivated archetype A's family set may include 019/023/025, which is fine because at result time they can't win anyway.

Called once at load (in `browser/api.ts:initQuiz()` and equivalents). Cached for the session.

### `src/engine/nextQuestion.ts`

**Change.** Adaptive selectors currently consume `state.archetypePosterior` in 5 places. Rework (3d):
- `topCandidateArchetypes(state, archetypes, K)` → sort ascending by `state.archetypeDistances[a.id]`, take first K.
- Replace posterior closeness with distance closeness (see §3 below).
- `scoreInformationGain` entropy proxy: compute normalized inverse-distance weights over top-8, entropy of that distribution (see §3).
- `scorePairwiseDiscrimination` Phase 4 override: gap test `(d_2 - d_1) / d_1 < 0.05` replaces `posterior gap < 0.02`. Placeholder threshold.
- `viableArchetypes` consumers migrate to `viableByDistance`.

Phase 1 (`scoreSaliencePhase`) and the fixed-16 path do not read posteriors — unchanged.

**Why.** Selectors are the second-biggest consumer of the posterior. Migrating them is what makes the new state shape viable.

### `src/engine/stopRule.ts`

**Change.** Rewrite `shouldStop` around distance-based conditions (3d). See §4 for proposed conditions with concrete thresholds. Retire the cosine-similarity cache (`ensureSimilarityCache`, `resetSimilarityCache` as used for margin multipliers) — family detection is now pre-computed at load. The `resetSimilarityCache` export stays as a no-op for call-site compatibility, or we remove it and update call sites (cleaner — I'll choose this unless it ripples further than browser/api.ts).

`topKAgreeOnContinuous` / `topKAgreeOnCategorical` continue to exist but feed from the distance-ranked top-K instead of posterior-ranked.

Hard cap at 55 preserved. Minimum 25 questions preserved.

**Why.** Stop rule is the primary gate for when the quiz ends. Distance-native conditions are cleaner and eliminate dependence on the removed posterior.

### `src/browser/api.ts`

**Change.**
- `createInitialState` drops `archetypePosterior` init from priors (priors are gone); inits `archetypeDistances` as empty `{}` — the first `updateDistances` call populates it (3c).
- Remove `updatePosteriors`. Replace with `updateDistances(state, archetypes)`: loop over archetypes, write `state.archetypeDistances[a.id] = archetypeDistance(state, a)`, update `currentLeader` / `consecutiveLeadCount` based on argmin.
- `deepCopyState` (line 144) migrates from copying `archetypePosterior` to copying `archetypeDistances`.
- `getProgress` (line 443) rewrites the top-archetype listing around distances; `topArchetypes` items now have `distance` instead of `posterior`.
- `getResults` (line 499) rewrites family detection to consult the pre-computed `ArchetypeFamilyIndex` instead of gap<0.03. Top-3 (down from top-5 per spec) ordered by ascending distance. Call the ENG module (3e) and attach the engagement label.
- `isComplete` unchanged structurally — calls `shouldStop`.

**Why.** This is the orchestration layer. Distance is now the canonical score.

### `src/identity/resolveIdentityPrimary.ts`

**Change.** (3e) Accept an `engagementLabel: EngagementLabel` parameter alongside state + demographics. Replace `eng >= 3` with `label === "engaged" || label === "highly-engaged"`. Replace `eng >= 4` with `label === "highly-engaged"`. The `expectedContinuous(state, "ENG")` call is removed (ENG no longer exists on state.continuous).

The `gate.eng` field in the returned result changes from a number to the label string. Callers that read `gate.eng` will see a type change — only `test/identity-primary-smoke.ts`, `test/identity-wiring-smoke.ts`, and `test/browser-identity-e2e.ts` read this based on the grep scan.

**Why.** IP must not read a field that no longer exists. The label is the authoritative engagement signal going forward.

### `src/engine/engagementLabel.ts` (NEW)

**Purpose.** Compute the engagement label from the respondent's final ENG node state. ENG is no longer in archetype signatures, but it remains a node in the per-node Bayesian layer (the ENG-touching questions still update `state.continuous.ENG`).

**API.**
```ts
export type EngagementLabel = "apolitical" | "casual" | "engaged" | "highly-engaged";
export type EngagementSalienceLevel = "low" | "medium" | "high";
export interface EngagementResult {
  label: EngagementLabel;
  salienceLevel: EngagementSalienceLevel;
  expectedPos: number;    // 1-5
  expectedSal: number;    // 0-3
}
export function computeEngagementLabel(state: RespondentState): EngagementResult;
```

**Thresholds** (per spec):
- `expectedPos < 2.0` → apolitical
- `2.0 ≤ expectedPos < 3.0` → casual
- `3.0 ≤ expectedPos < 4.0` → engaged
- `4.0 ≤ expectedPos` → highly-engaged

Salience level (for the dual-label annotation; does NOT change the label):
- `expectedSal < 1.0` → low
- `1.0 ≤ expectedSal < 2.0` → medium
- `expectedSal ≥ 2.0` → high

Final dual label for output: `"<archetype_name>, <engagement_label>"`.

### `src/config/nodes.ts`

**Change.** (3b) Remove `ENG` from the `CONTINUOUS_NODES` const export. ENG still exists as a type in `ContinuousNodeId`? No — we also remove it from `types.ts`. The ENG-touching questions update state via the update.ts machinery, which iterates `CONTINUOUS_NODES` for initialization. After removal, `state.continuous.ENG` will not exist.

**Gotcha.** If we remove ENG from `ContinuousNodeId` and `CONTINUOUS_NODES`, then `state.continuous.ENG` is no longer a valid access path, and the ENG module cannot read it. **Resolution:** keep ENG in `ContinuousNodeId` and `CONTINUOUS_NODES` so the per-node Bayesian layer still tracks ENG state; only remove ENG from the archetype signature iteration in `archetypeDistance.ts` and from the set of nodes used by the pairwise family pre-compute. The Archetype type still accepts optional `ENG` in `nodes` but our signatures simply won't provide it, and the new distance function skips absent templates (existing behavior).

I will propose this in the plan and the 3c implementation enforces it: **ENG stays in `CONTINUOUS_NODES`, is removed from every archetype signature's `nodes` map, and the distance function iterates `CONTINUOUS_NODES` but no archetype contributes an ENG template so ENG never enters any distance.** This is clean and the ENG module reads `state.continuous.ENG` as before.

### `src/config/questions.full.ts` and `src/config/questions.representative.ts`

**No change** in 3b–3h. ENG-touching questions remain — they feed the per-node Bayesian layer which feeds the ENG module. Per the prompt: "ENG-touching questions remain in the bank. They feed the per-node Bayesian update for ENG (which the ENG module reads) but do not influence archetype distance since ENG is excluded from the distance function."

### `src/eval/harness.ts`

**Change.** (3c) Migrate the internal posterior update to use the new Euclidean scorer and drop the temperature/softmax block. Initial state drops `archetypePosterior`, adds `archetypeDistances`. `stopFired` attribution logic needs its thresholds updated to the new stop-rule conditions.

**Why.** regression.ts runs harness; harness must compute under the new scorer for the Phase 3 regression to be meaningful.

### `src/eval/regression.ts`

**Change.** (3g preparation) `scoring-baseline-fresh.json` is a byte-compare baseline frozen against `src/test/simulation.ts`, which uses the old scorer with priors. Under Phase 3 the byte-compare becomes meaningless. **Recommendation:** repurpose `regression.ts` to emit `results/phase3/scoring-baseline-phase3.json` (new post-Phase-3 baseline) and drop the deep-compare step. The old Phase-2 baseline stays on disk for historical comparison.

This isn't a blocker for 3b (we keep the Phase 2 scorer during 3b and can still do a byte-compare then). The repurposing happens at 3c.

### Test and eval scripts that stub `RespondentState` with `archetypePosterior: {}`

**Files.** `test/identity-primary-smoke.ts`, `test/resolver-smoke.ts`, `eval/analyzeFaceValidity.ts`, `eval/analyzeStagnancy.ts`, `eval/runAudit.ts`.

**Change.** Rename the stub field to `archetypeDistances: {}`. Pure rename — these scripts don't otherwise depend on the field.

**Why.** TypeScript compile would fail otherwise.

### Diagnostic scripts with their own local scorer

**Files.** `test/full-diagnostic.ts`, `test/diagnostic-40k.ts`, `test/question-discrimination.ts`.

**Plan.** These reimplement posterior updates inline. Each uses `a.prior` and computes a softmax. Under Phase 3, these would either need to be migrated OR frozen as historical artifacts.

**Recommendation.** Freeze them as historical — add a top-of-file comment noting they run under the pre-Phase-3 scorer and may not compile against the new type signature. They are not on the CI path. If compilation errors block the 3c build, we stub them with `// @ts-nocheck` and a TODO. This is the cleanest migration given these files are not in production or CI use.

### `src/test/simulation.ts`

**No change.** Frozen baseline per constraint. After 3c it will no longer compile against the new types (priors gone, field renamed). I will add `// @ts-nocheck` at the top of simulation.ts if needed, with a comment explaining it is the pre-Phase-3 historical baseline.

**Alternate resolution**, if `@ts-nocheck` is unacceptable: move simulation.ts to `src/archive/simulation-phase2.ts` and exclude it from typecheck. Will confirm with you in 3c if this arises.

---

## 2. New files

1. **`src/engine/archetypeFamilies.ts`** — pairwise archetype distance matrix + family set per archetype (loaded once).
2. **`src/engine/engagementLabel.ts`** — ENG module: four-level label + salience level, consumed by browser/api.ts and resolveIdentityPrimary.ts.
3. **`results/phase3/plan.md`** (this file) — Step 3a output.
4. **`results/phase3/regression-3b-eng-removed.md`** — Step 3b output.
5. **`results/phase3/duplicate-archetypes.md`** — Step 3f output.
6. **`results/phase3/regression-3g-full.md`** — Step 3g output.
7. **`results/phase3/scoring-baseline-phase3.json`** — new post-Phase-3 baseline from regression.ts (3g).
8. **`results/phase3/step3-new-baseline.json`** — reduced Step-3 aggregate stats (3g).
9. **`results/phase3/step5-h2-recheck.md`** — H2 per-touch TRB anchor JSD recheck (3g).

---

## 3. Adaptive selector rework (Phase 3+ selectors in `nextQuestion.ts`)

**Proposed replacement for posterior-based signals.**

Given `state.archetypeDistances`, compute once per call:
1. Sort archetypes ascending by distance.
2. Take top-8 as the candidate set `C`. (Symmetric with current `topK=8` in `scoreInformationGain`.)
3. For each `a ∈ C`, compute normalized-inverse-distance weight:
   ```
   d_min = C[0].distance
   d_max = C[7].distance
   w(a) = (d_max - d(a) + ε) / (d_max - d_min + ε)        // ε = 1e-6
   w(a) ∈ [0, 1], leader gets 1, worst gets 0.
   ```
4. Normalize `w` to a proper distribution: `p(a) = w(a) / Σ w`.

This `p(a)` replaces `state.archetypePosterior[a.id]` in every entropy, closeness, and pair-weighting computation in `nextQuestion.ts`.

**Rationale.**
- Preserves the existing signal shape: concentrated when one archetype is much closer than the next 7, flat when distances are bunched.
- Entropy of `p` is bounded by `log(8) ≈ 2.08`. The existing code normalizes by `log(8)` — no change needed.
- "Closeness" between two candidates: use `min(p_i, p_j) / max(p_i, p_j, ε)` (same form as current). Works identically.
- Phase 4 gap test: `(C[1].distance - C[0].distance) / C[0].distance < 0.05` replaces `p1 - p2 < 0.02`. Both express "top-2 are within 5%/2% of each other" but in the natural scale of their respective spaces. Calibration is a Stage 4 item.

This treatment is consistent with the prompt's "rank-based top-K proxy (top-8 by minimum distance), with 'closeness' weight derived from normalized inverse-distance among the top-K."

---

## 4. Stop-rule rework

Current stop rule has four positive conditions OR'd together plus a hard cap. Each is characterized by `(top_posterior_threshold, margin_threshold, consecutive_leader_threshold, min_questions)`. Under Euclidean WTA, `top_posterior` has no direct analog, so each condition translates to `(leader_distance_threshold, distance_gap_ratio, consecutive, min_q)` where `gap_ratio = (d_second - d_leader) / d_leader`.

**Proposed conditions** (placeholders — to be calibrated against 3g regression):

| Condition | Min Q | Leader distance | Gap ratio | Consecutive | Notes |
|-----------|-------|-----------------|-----------|-------------|-------|
| primaryStop | 25 | `d_leader ≤ 8.0` | `≥ 0.10` | `≥ 3` | Default; plus `!anyBlocking` (unchanged node-agreement gating) |
| secondaryStop | 35 | `d_leader ≤ 10.0` | `≥ 0.05` | `≥ 6` | Looser, for slow converters |
| ultraConfStop | 20 | `d_leader ≤ 6.0` | `≥ 0.25` | `≥ 8` | Fast exit when signal is unambiguous |
| lateGameStop | 45 | `d_leader ≤ 12.0` | `≥ 0.03` | `≥ 4` | Nearly-any-signal at late stages |
| hardCapStop | 55 | any | any | any | Unchanged |

**Expected distance scale** (for these thresholds to be roughly right):
- Perfect match: distance ≈ 0–2.
- Typical converged match at Q40: distance ≈ 4–8.
- Runner-up in a well-resolved case: distance ≈ 9–15 (gap_ratio ≥ 0.10 implies second ≥ 1.10×first).
- Anti-triggered node: +10 pre-sqrt → adds ~sqrt(10) ≈ 3.2 to total distance even with no positional mismatch.

The gap_ratio thresholds (0.10, 0.05, 0.25, 0.03) preserve the SHAPE of the existing rule (primary is stricter than late-game, ultra-conf is the most strict). The absolute distance thresholds are empirical placeholders — Stage 4 calibration.

**ENG sensitivity.** No condition above uses ENG. `topKAgreeOnContinuous` / `topKAgreeOnCategorical` iterate over `CONTINUOUS_NODES` / `CATEGORICAL_NODES` — ENG is still in `CONTINUOUS_NODES` per §1, but no archetype signature provides an ENG template (all templates are undefined for ENG), so the agreement check short-circuits on "fewer than 2 templates" → returns `true`. ENG does not drive any stop-rule decision. This satisfies the spec requirement "Stop rule must not trigger on ENG convergence."

---

## 5. Duplicate-archetype-detection approach

Run in 3f as a surfacing exercise (no merges). Emits `results/phase3/duplicate-archetypes.md`.

**Exact-equality scan.** For each pair (A, B):
- Same `nodes` key set.
- For every continuous node: identical `{pos, sal, anti?}`.
- For every categorical node: identical `{sal, antiCats?}` AND `probs` vectors equal to 6 decimals.

**Near-equality scan.** For each pair (A, B): compute pairwise archetype distance under the new Euclidean function (from `archetypeFamilies.ts`); flag if `< 0.5`.

`0.5` is chosen because even a single-node position gap of 1 at archetype salience 1 contributes `(1)² · 1 = 1` pre-sqrt, so `sqrt(1) = 1` post-sqrt — a pair with distance `< 0.5` must have either fractionally-small position differences across many nodes or identical-on-all-but-one-low-salience-node. Anything at `< 0.5` is effectively a duplicate. This is an empirical threshold, flagged for review.

**Report format.** Each flagged pair: `{id_A, name_A, id_B, name_B, distance, differing_nodes: [{node, A, B}]}`. Exact-equality pairs get `distance = 0, differing_nodes = []`.

---

## 6. Backward compatibility — callers of `archetypePosterior`

| File | Usage | Migration plan |
|------|-------|----------------|
| `src/types.ts:193` | Field declaration | Rename to `archetypeDistances`. |
| `src/engine/stopRule.ts:58` | Reads for margin calculation | Rewritten entirely in 3d — distance-based. |
| `src/engine/nextQuestion.ts` (5 reads) | `topCandidateArchetypes` + EIG + pairwise + Phase-4 gap | Rewritten in 3d per §3. |
| `src/engine/archetypeDistance.ts:352` (`viableArchetypes`) | Reads posteriors to filter | Replaced by `viableByDistance` in 3c. |
| `src/browser/api.ts` (many refs) | State init, updatePosteriors, deepCopy, getProgress, getResults | Migrated in 3c; see §1 bullet. |
| `src/eval/harness.ts` (several refs) | Regression harness | Migrated in 3c to match `browser/api.ts`. |
| `src/test/simulation.ts` (several refs) | Pre-Phase-3 baseline | **Frozen**. Add `@ts-nocheck` or move to archive. Will confirm choice in 3c. |
| `src/test/full-diagnostic.ts`, `diagnostic-40k.ts`, `question-discrimination.ts` | Diagnostic scripts | **Frozen**. `@ts-nocheck` + TODO. Not on CI path. |
| `src/test/identity-primary-smoke.ts`, `resolver-smoke.ts` | Stub state for IP tests | Rename stub field to `archetypeDistances: {}`. |
| `src/eval/analyzeFaceValidity.ts`, `analyzeStagnancy.ts`, `runAudit.ts` | Stub states | Rename stub field to `archetypeDistances: {}`. |
| `src/eval/diagnoseTrb.ts` (uses trbAnchorPrior) | Trb diagnostic | Remove references to `archetype.trbAnchorPrior` (the field no longer exists). |
| `src/eval/regression.ts` | Byte-compare baseline | Repurpose in 3c (emits Phase-3 baseline, drops deep-compare). |

**No caller requires a backward-compat shim.** All migrations are either clean renames (stub states), direct rewrites (production engine code), or freezing historical artifacts (simulation.ts, the three diagnostic scripts). Per the prompt's constraint, no shim is added.

**One flagged item** for your decision: should `src/test/simulation.ts` get `@ts-nocheck` or be moved to `src/archive/simulation-phase2.ts` and excluded from tsconfig? Moving is cleaner but changes import paths (nothing imports simulation.ts — it's a standalone script, so the import-path issue is minimal). I will apply `@ts-nocheck` by default in 3c unless you'd prefer the archive move.

---

## Open questions before 3b

1. **simulation.ts fate** (§6 flagged item) — `@ts-nocheck` vs archive move. My default is `@ts-nocheck`. Approve or flip.
2. **ENG kept in `CONTINUOUS_NODES`** (§1 gotcha) — the ENG node stays in the per-node Bayesian substrate so the ENG module can read it; it's only dropped from archetype signatures. Approve.
3. **Anti penalty strength** (constraint: fixed 10 in Phase 3) — acknowledged. Flagged as a Stage 4 calibration risk if 3g shows anti-flagged archetypes becoming unreachable or the penalty not biting.
4. ~~**Categorical argmax-vs-cost-matrix**~~ — **Resolved.** Categorical distance is the explicit posterior-mass formulation specified in §1 / `archetypeDistance.ts`: preferred-present contributes `(1 - p_R[preferred])`, anti-present contributes `Σ p_R[antiCat]`, silent contributes 0, all multiplied by `max(s^A, s^R)`. The `0.30` "preferred" threshold is a Stage 4 calibration item but used concretely in implementation.

If any of items 1–3 require revision, adjust here before 3b. Otherwise, ready to proceed on approval.
