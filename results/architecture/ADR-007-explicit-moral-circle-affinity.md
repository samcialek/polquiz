# ADR-007 - Explicit Moral Circle Affinity Model

**Date:** 2026-05-05  
**Status:** Accepted for staged additive migration  
**Supersedes:** the moral-circle representation in ADR-006 where it conflicts with this document  
**Companion audit:** `results/architecture/moral-circle-question-audit.{md,json}`  

## Context

The current repo has several overlapping representations of moral-circle structure:

- `MOR` as a legacy 1-5 continuous node.
- `PF`, `TRB`, and `TRB_ANCHOR` as legacy implementation labels for political identity intensity and anchor evidence.
- `morBoundaries` / `MorBoundaryId` as a seven-boundary additive module from ADR-006.

ADR-006 moved in the right direction by separating moral-boundary evidence from ordinary issue-position nodes. It still has three problems for the model we now want:

1. It has no explicit universal baseline. It encodes universalism as low boundedness across all groups.
2. It stores seven scoped groups, folding `sexual` into `gender`.
3. It does not define excess affinity above universal concern, which is the actual active moral-circle signal.

The new model treats universal human concern as a baseline. Narrower group affinity matters only when it rises above that baseline.

## Decision

Moral circle is represented by **9 stored affinity values**:

1. `universalAffinity`
2. `national`
3. `religious`
4. `ethnic_racial`
5. `class`
6. `gender`
7. `sexual`
8. `ideological`
9. `political_camp`

The last eight are scoped affinities. Universal is not one scope among equals; it is the baseline.

All raw affinities use a 0-100 scale unless otherwise specified.

```ts
type MoralCircleScope =
  | "national"
  | "religious"
  | "ethnic_racial"
  | "class"
  | "gender"
  | "sexual"
  | "ideological"
  | "political_camp";

interface MoralCircleAffinity {
  universalAffinity: number; // 0..100
  scopedAffinities: Record<MoralCircleScope, number | null>; // 0..100, null means not meaningful / not applicable
  excessAffinities: Record<MoralCircleScope, number>; // derived, 0..100
  activeBoundaries: MoralCircleScope[]; // derived
  intensity01: number; // derived, 0..1
  intensity03: number; // derived, 0..3 compatibility scale
}
```

## Raw Storage vs Active Signal

Raw values must be stored even when they do not produce active excess.

Example:

```ts
universalAffinity = 80
national = 70
religious = 20
```

Both `national` and `religious` have zero active excess, but they are not the same raw response. Store the raw values for diagnostics, future modeling, and candidate-distance experiments. Use derived excess for active moral-boundary matching.

The signal-narrowing rule applies only to derived active signal:

```ts
excessAffinities[group] = max(0, scopedAffinities[group] - universalAffinity)
```

If a respondent marks a scoped group as `not meaningful`, store `null` for the raw scoped affinity and derive excess as 0. If a numeric fallback is required for a legacy surface, coerce `null` to `universalAffinity`, not to 0.

## Active Boundary Rule

The mathematical active-boundary rule is:

```ts
activeBoundaries = groups where excessAffinities[group] > 0
```

For reporting and resolver thresholds, use a practical activation threshold of 5 points:

```ts
reportActiveBoundaries = groups where excessAffinities[group] >= 5
```

The 5-point threshold is not a new model parameter; it is a noise guard for UI/reporting and identity-primary gating.

## Intensity Formula

Moral-circle intensity is the L2 norm of excess affinities. This captures both one very strong excess and several moderate excesses without making a broad field of weak excesses explode.

For affinities on a 0-100 scale:

```ts
const l2 = Math.sqrt(sum(Object.values(excessAffinities).map(x => x * x)));
const intensity01 = Math.min(1, l2 / 100);
const intensity03 = 3 * intensity01;
```

`intensity03` exists for compatibility with existing salience-like 0-3 surfaces. New code should prefer `intensity01` or the raw `excessAffinities` vector.

## Category Semantics

| Field | Meaning |
|---|---|
| `universalAffinity` | Moral concern for any human being, independent of group membership. |
| `national` | Extra concern for co-nationals / people inside the national polity. |
| `religious` | Extra concern for co-religionists or people sharing the respondent's sacred worldview. |
| `ethnic_racial` | Extra concern for people sharing the respondent's ethnic/racial group or racialized status. |
| `class` | Extra concern for people sharing the respondent's economic class, material situation, labor position, or status location. |
| `gender` | Extra concern for people sharing the respondent's gender position or gender-linked political identity. |
| `sexual` | Extra concern for people sharing the respondent's sexuality, LGBTQ status, or family-life orientation. |
| `ideological` | Extra concern for people sharing the respondent's core ideology, worldview, principles, or values. |
| `political_camp` | Extra concern for people on the respondent's political side, party, movement, or candidate faction. |

`political_camp` is only one scoped affinity. It must not dominate or stand in for the whole moral-circle system.

Engagement remains separate. Engagement measures political attention, participation, and energy. Moral-circle intensity measures excess in-group moral weighting.

## Calibration Battery

Existing questions can provide weak priors and validation, but they cannot fully populate the new model. The bank lacks a clean direct source for `universalAffinity`, and it is sparse for `ethnic_racial`, `gender`, and `sexual`.

Add a new two-part calibration battery. Do not use one large nine-row grid at first; split the task to reduce satisficing.

### Battery A - Universal Baseline

Prompt concept:

> How much moral concern should politics give to any human being, regardless of where they live or which group they belong to?

Response: 0-100 slider.

This is the primary source for `universalAffinity`.

### Battery B - Scoped Affinities

Prompt concept:

> Using the same scale, how much extra moral concern should politics give to each group when decisions affect them?

Rows:

- People in my country.
- People who share my religious tradition or sacred worldview.
- People who share my racial or ethnic background or status.
- People in my economic class or material situation.
- People who share my gender position or gender-linked identity.
- People who share my sexuality or family-life orientation.
- People who share my core ideology or values.
- People on my political side, party, movement, or camp.

Each row uses the same 0-100 scale and may offer `not meaningful to me`.

### Satisficing Flags

Record response-quality flags but do not automatically discard responses:

- `all_equal`: all nine numeric affinities identical.
- `low_variance`: standard deviation across numeric affinities below 5.
- `round_number_straightline`: all numeric responses are 0, 25, 50, 75, or 100 and variance below 10.
- `all_high_no_excess`: all values high but scoped affinities equal to universal.
- `too_fast`: response time below a threshold chosen by UI instrumentation.

If all values equal universal, active excess is zero everywhere. This may be a valid universalist profile or a low-effort response. Keep the values and flag for diagnostics.

## Existing Questions as Priors

Existing questions are priors or validation checks, not the primary measurement layer.

Priority:

1. Direct calibration battery: high weight.
2. Direct identity ranking / membership items: low-to-medium prior.
3. Legacy implementation labels (`PF`, `TRB`, `TRB_ANCHOR`): low-to-medium prior, capped.
4. Policy proxies: validation-only by default, or very low prior if explicitly approved in a later audit.

`Q103` (`issue_salience_screener`) must not be used as a `universalAffinity` prior. It measures political topic salience, not baseline concern for any human being. It may be used as a validation-only signal for whether MOR-like topics matter to the respondent.

Initial prior caps:

| Evidence source | Max prior weight |
|---|---:|
| New direct calibration battery | 1.00 |
| Q60 identity ranking | 0.35 |
| Q102 membership criteria | 0.25 |
| Legacy `PF` direct centrality | 0.25 |
| Legacy `TRB` with clear semantic scope | 0.25 |
| Legacy `TRB_ANCHOR` with clear anchor and rank/salience | 0.30 |
| Policy proxy items | 0.10 or validation-only |
| Q103 for universal | 0.00 |

These caps are deliberately conservative. Terminal work should not raise them without a new audit.

## Legacy Conversion Rules

These rules are for additive migration only. They do not authorize engine cutover.

### Scale Helpers

```ts
function pos15ToAffinity100(expectedPos: number): number {
  return Math.round(((expectedPos - 1) / 4) * 100);
}

function salience03ToAffinity100(expectedSalience: number): number {
  return Math.round((expectedSalience / 3) * 100);
}
```

Clamp both outputs to [0, 100].

### `TRB_ANCHOR` to Scoped Affinity

If a response has a clear `TRB_ANCHOR` and salience/intensity evidence:

```ts
scopedAffinities[anchorScope] += cappedWeight * salience03ToAffinity100(salience)
```

Anchor-only evidence without salience is weak. It can identify which scoped group is plausible, but it should not create a high magnitude by itself.

Anchor mapping:

| Legacy anchor | New target |
|---|---|
| `national` | `national` |
| `religious` | `religious` |
| `ethnic_racial` | `ethnic_racial` |
| `class` | `class` |
| `gender` | `gender` |
| `sexual` | `sexual` |
| `ideological` | `ideological` |
| `global` | weak `universalAffinity` prior; no scoped excess |
| `mixed_none` | universal/no-excess prior; suppresses scoped excess from that item |

### `TRB` Without Anchor

Legacy `TRB` evidence without an anchor is generic boundary intensity, not a scoped affinity. Do not assign it to a specific group unless the question text provides a clear semantic route.

Questions with legacy TRB-like salience and no anchor require per-question review before back-mapping.

### `PF` to `political_camp`

Legacy `PF` is primarily evidence for `political_camp` scoped affinity and overall political identity centrality.

Initial conversion:

```ts
politicalCampPrior = pos15ToAffinity100(expectedPFPosition)
```

If an explicit salience expectation is available, combine position and salience conservatively:

```ts
politicalCampPrior = 0.65 * pos15ToAffinity100(expectedPFPosition)
                   + 0.35 * salience03ToAffinity100(expectedPFSalience)
```

Cap legacy `PF` contribution at 0.25 prior weight unless a later audit approves a higher cap.

### Party Label vs Political-Camp Affinity

Party ID labels identify direction or membership label. They do not by themselves imply high `political_camp` affinity.

Store party label separately from magnitude. A respondent can have a label and low camp affinity, or no major-party label and high anti-establishment camp affinity.

## Identity-Primary Resolver Migration

Identity-primary overlays should eventually gate on scoped excess, not legacy anchor evidence.

Initial migration rule:

```ts
eligibleForBoundaryOverlay(group) =
  excessAffinities[group] >= 20
  && scopedAffinities[group] >= 70
  && universalAffinity <= 75
  && intensity03 >= 1.2
```

These thresholds are seed values for calibration. They must be tested against existing correct identity-primary resolutions before engine cutover.

Group mapping:

| Overlay family | Primary scope |
|---|---|
| Black voter | `ethnic_racial` plus matching membership label |
| White grievance voter | `ethnic_racial` plus matching membership label and grievance evidence from existing nodes |
| Evangelical voter | `religious` plus matching membership label |
| LGBTQ voter | `sexual` plus matching membership label |
| Feminist voter | `gender` plus matching membership label or feminist-policy evidence |
| Male grievance voter | `gender` plus matching membership label and grievance evidence from existing nodes |

Do not treat high universal affinity plus high scoped affinity as the same pattern as a narrow identity-primary overlay. The `universalAffinity <= 75` ceiling prevents that collapse.

## Era-Activation Migration

`src/historical/era-activations.json` is canonical and must not be regenerated.

Legacy `MOR` activation slots temporarily map to moral-circle breadth / universal-affinity emphasis in compatibility layers. They do not automatically imply a specific scoped boundary.

If a historical year clearly activates a specific scoped moral boundary, that requires a deliberate human edit pass in the era map or a versioned companion map. Do not auto-derive scoped era activations from legacy `MOR`.

## Electorate / Phase 2.7 Transition

During migration, survey and electorate code should emit both shapes where possible:

- Legacy `MOR`, `PF`, `TRB`, and existing `moralBoundaries` remain unchanged until cutover.
- New `moralCircleAffinity` is additive and optional.
- Aggregates may report both legacy boundary salience and new affinity/excess summaries.
- No Phase 2.7 synthetic-electorate output should drop existing fields as part of ADR-007 scaffolding.

The electorate mapper must not expand old salience-only boundary wiring further until this ADR's additive shape exists.

## Candidate Matching Direction

Candidate/voter moral-circle matching should eventually compare:

- `universalAffinity` distance.
- `excessAffinities` vector distance.
- dominant active-boundary overlap.
- group membership lock-and-key where membership is known and ethically appropriate.
- `political_camp` as one lane only, not as the whole moral-circle profile.

This ADR does not implement candidate matching. It defines the data model needed for it.

## Required Staged Work

Terminal 2 and any implementation agent must keep these stages in separate commits.

### Stage A - Spec

Create this ADR and a machine-readable JSON mirror. No code changes.

### Stage B - Additive Types and Helpers

Add type-only structures and pure helper functions:

- `MoralCircleScope`
- `MoralCircleAffinity`
- `deriveExcessAffinities`
- `deriveMoralCircleIntensity`
- scale conversion helpers
- validation helper for 0-100/null values

No engine cutover.

### Stage C - Additive Question Spec

Add the calibration battery specification, either as documentation or disabled/additive question definitions. It must not alter current quiz routing until reviewed.

### Stage D - Legacy Conversion Helpers

Add pure conversion helpers from legacy `PF`, `TRB`, and `TRB_ANCHOR` evidence to low-weight moral-circle priors. Keep them unused by scoring until reviewed.

### Stage E - Smoke / Audit Harness

Add a smoke that proves:

- nine raw values are present where expected;
- excess values equal `max(0, scoped - universal)`;
- intensity uses L2 norm;
- `not meaningful` derives zero excess;
- Q103 does not feed `universalAffinity`;
- legacy outputs are unchanged.

### Stage F - Engine Cutover

Only after Terminal 1 review of Stages B-E:

- integrate moral-circle affinity into respondent state;
- migrate identity-primary overlay gates;
- update candidate-matching experiments;
- update aggregate reports.

Stage F is explicitly out of scope until prior stages are reviewed.

## Consequences

Positive:

- Universal concern is measurable rather than inferred from low group boundaries.
- Most respondents will have sparse active boundaries after excess derivation.
- Sexual and gender boundaries can be modeled separately.
- Political camp no longer consumes the entire identity/moral-circle concept.
- Existing question evidence can be reused conservatively without pretending it directly measures the new construct.

Costs:

- Requires a new calibration battery.
- Requires compatibility code during transition.
- Requires identity-primary resolver recalibration.
- Requires a deliberate era-activation migration pass later.

## Non-Goals

- No regeneration of archetypes.
- No automatic edit to `era-activations.json`.
- No immediate engine/scoring cutover.
- No removal of legacy fields in Phase 2.7 outputs.
- No use of vote choice, candidate thermometers, or downstream prediction outputs to populate moral-circle affinity.

