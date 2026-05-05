# Moral Circle Affinity Migration — Terminal 2 Work Order

Terminal 1 has written the architecture contract and audit:

- `results/architecture/ADR-007-explicit-moral-circle-affinity.md`
- `results/architecture/ADR-007-explicit-moral-circle-affinity.json`
- `results/architecture/moral-circle-question-audit.md`
- `results/architecture/moral-circle-question-audit.json`

Terminal 2 owns implementation against those files. The ADR is the contract. If a detail below conflicts with ADR-007, follow ADR-007 and pause with a question.

## Scope

Implement additive moral-circle affinity scaffolding through Stages B-E only:

- Stage B: additive types and pure derivation helpers
- Stage C: additive calibration battery specification, not live selector wiring
- Stage D: pure legacy conversion helpers
- Stage E: smoke/audit harness and outputs

Do not implement engine cutover, selector cutover, candidate-distance changes, identity-primary resolver changes, era migration, or electorate mapper cutover in this pass.

## Hard Constraints

- Keep legacy PF/TRB/MOR surfaces unchanged.
- Keep `surveyToPrismMapper.ts` emitting existing legacy fields unchanged.
- Do not remove or rename existing fields.
- Do not edit `src/config/archetypes.ts`, `src/config/nodes.ts`, `src/historical/era-activations.json`, engine scoring, selector/topK, browser/dist, output/live-data, candidate data, era-context data, or raw data.
- No live question-bank insertion yet unless Terminal 1 explicitly approves it later.
- If a conversion or routing rule is not explicitly specified in ADR-007, pause and ask instead of inventing it.

## Stage B — Additive Types And Derivation Helpers

Add the new shape additively in `src/types.ts`:

- `MoralCircleScope`
- `MoralCircleAffinity`
- supporting evidence/prior types if useful, but keep them optional and additive

Create a small pure helper module, preferably `src/moralCircle/affinity.ts` unless repo style strongly points elsewhere. Expected exports:

- `MORAL_CIRCLE_SCOPES`
- `isMoralCircleScope(value)`
- `clampAffinity100(value)`
- `computeExcessAffinities(universalAffinity, scopedAffinities)`
- `computeMoralCircleIntensity(excessAffinities)`
- `deriveMoralCircleAffinity(input)`
- `getActiveMoralCircleBoundaries(excessAffinities, threshold = 5)`
- `coerceScopedAffinityForLegacy(scoped, universalAffinity)`

Core math from ADR-007:

```ts
excessAffinity[group] = max(0, scopedAffinity[group] - universalAffinity)
l2 = sqrt(sum(excessAffinity[group] ** 2))
intensity01 = min(1, l2 / 100)
intensity03 = 3 * intensity01
```

`null` scoped affinity means "not meaningful to me"; it derives zero excess and coerces to `universalAffinity` only for legacy numeric surfaces.

## Stage C — Calibration Battery Spec, Additive Only

Add a non-live battery spec, preferably `src/config/moralCircleCalibrationBattery.ts`.

It should define:

- one universal baseline item on a 0-100 scale
- eight scoped rows on the same 0-100 scale
- the eight scopes exactly: `national`, `religious`, `ethnic_racial`, `class`, `gender`, `sexual`, `ideological`, `political_camp`
- a `not_meaningful_to_me` option per scoped row
- satisficing flags from ADR-007:
  - `all_equal`
  - `low_variance`
  - `round_number_straightline`
  - `all_high_no_excess`
  - `too_fast`

This file is a spec/config artifact only. Do not insert these items into `questions.full.ts` or `questions.representative.ts` in this stage.

## Stage D — Legacy Conversion Helpers

Create pure conversion helpers, preferably `src/moralCircle/legacyConversion.ts`.

Expected exports:

- `pos15ToAffinity100(pos)`
- `salience03ToAffinity100(salience)`
- `convertLegacyTrbAnchorToMoralCirclePrior(...)`
- `convertLegacyPfToPoliticalCampPrior(...)`
- `MORAL_CIRCLE_PRIOR_CAPS`

Rules:

- Q103 universal prior weight is `0`; validation-only.
- PF maps only to `political_camp` as a capped prior.
- TRB anchor maps to scoped prior only when the anchor is explicit.
- `global` is weak universal/no scoped excess evidence.
- `mixed_none` contributes to universal/no-excess evidence and suppresses scoped inference from that item.
- TRB evidence without a scoped anchor is generic boundary intensity only; do not assign it to a scope without per-question review.
- Enforce prior caps from ADR-007.

These helpers must not be called by engine scoring or mapper code yet.

## Stage E — Smoke Harness

Add `src/test/moralCircleAffinitySmoke.ts` and write:

- `results/architecture/moral-circle-affinity-smoke.json`
- `results/architecture/moral-circle-affinity-smoke.md`

Smoke cases must include:

- `universal=60`, `national=80`, `ideological=80`, all others below 60 => active boundaries are national + ideological only.
- all scoped values below universal => zero active boundaries, zero excess.
- `null` scoped value => zero excess and legacy coercion to universal.
- L2 intensity math matches ADR-007.
- all 9 stored values exist: universal + eight scopes.
- active-boundary reporting threshold uses `>= 5`, while mathematical excess remains `> 0`.
- Q103 cap is zero / validation-only.
- PF and TRB conversion helpers respect prior caps.
- `mixed_none` never creates scoped excess.
- satisficing flags fire on at least `all_equal` and `all_high_no_excess` examples.

## Verification

Run at minimum:

```powershell
npx tsx src/test/moralCircleAffinitySmoke.ts
node -e "JSON.parse(require('fs').readFileSync('results/architecture/moral-circle-affinity-smoke.json','utf8')); console.log('JSON valid')"
```

Run the narrow TypeScript check if feasible:

```powershell
npx tsc --noEmit
```

If the broad TypeScript check fails for pre-existing repo noise, report the first relevant error and still run the moral-circle smoke.

Terminology scan:

```powershell
rg -n "<legacy-moral-circle-terminology-regex>" src results/architecture
```

If `rg` is unavailable, use `Select-String` with the same internal legacy-terminology patterns already used in the project smokes. Do not paste the forbidden wording into newly committed docs.

## Commit Boundaries

Use small commits if possible:

1. `moral-circle: add affinity model types`
2. `moral-circle: specify affinity calibration battery`
3. `moral-circle: add legacy affinity conversion helpers`
4. `moral-circle: add affinity smoke harness`

If the work naturally lands as one commit, use:

`moral-circle: add affinity scaffolding`

## Handoff Back To Terminal 1

Report:

- changed files
- exact helper exports
- smoke results
- TypeScript check status
- terminology scan status
- any unresolved ADR questions

Do not proceed to engine cutover until Terminal 1 reviews the implementation against ADR-007.
