# Moral Circle Affinity Smoke (ADR-007, Stages B–E)

**Generated:** 2026-05-05T18:09:04.644Z

**Result:** 25 / 25 passed.

Scopes (8): `national`, `religious`, `ethnic_racial`, `class`, `gender`, `sexual`, `ideological`, `political_camp`

Reporting active threshold: `>= 5` points of excess (mathematical activation remains `> 0`).

Prior caps (ADR-007 §"Existing Questions as Priors"):

- `direct_battery` → max 1
- `q60_identity_ranking` → max 0.35
- `q102_membership_criteria` → max 0.25
- `legacy_pf` → max 0.25
- `legacy_trb_clear_scope` → max 0.25
- `legacy_trb_anchor_clear_scope` → max 0.3
- `policy_proxy` → max 0.1
- `q103_universal` → max 0

## Cases

| # | Name | Result | Detail |
|---:|---|---|---|
| 1 | `9_stored_values_present` | ✅ | universal + 8 scoped = 9 stored values |
| 2 | `excess_formula_and_active_set` | ✅ | active=national,ideological excess[national]=20 excess[religious]=0 |
| 3 | `all_scoped_below_universal_zero_excess` | ✅ | intensity01=0.0000 active=0 |
| 4 | `null_scoped_zero_excess_and_legacy_coercion` | ✅ | null→excess=0; coerced religious/sexual=70/70 (universal=70); gender raw passes through 90 |
| 5 | `l2_intensity_math` | ✅ | single l2=100.0000 i01=1.0000 i03=3.0000 \| triple l2=107.7033 i01=1.0000 i03=3.0000 |
| 6 | `reporting_threshold_separation` | ✅ | math=ideological,national,religious reporting=religious threshold=5 |
| 7 | `clamp_and_validation` | ✅ | clamp=[0,100,0,42] validation issues=2 |
| 8 | `scale_helpers` | ✅ | pos15(1,3,5,2.5)=0,50,100,38 \| sal03(0,1.5,3)=0,50,100 |
| 9 | `q103_universal_prior_zero` | ✅ | cap=0 allowed=false rejection=no_route |
| 10 | `pf_political_camp_with_cap` | ✅ | noSal value=75 weight=0.25; withSal value=84 weight=0.25; overcap clamp=0.25 |
| 11 | `trb_anchor_scoped_routing` | ✅ | religious(2.4)→religious val=80 w=0.3; ethnic_only→ethnic_racial w=0.12 (anchor-only cap < full); sexual(3)→100 |
| 12 | `trb_global_and_mixed_none_universal_only` | ✅ | mixed_none→universal_no_excess universalValue=100 suppress=true; global→universal |
| 13 | `mixed_none_carries_universal_evidence_and_suppression` | ✅ | universalValue=100 weight=0.3 suppress=true |
| 14 | `trb_without_anchor_no_route` | ✅ | Q42 (sal=2) → no_route: TRB salience without anchor on Q42 → per-question review required before scope routing (ADR-007) |
| 15 | `trb_anchor_coverage_exhaustive` | ✅ | routes=9 expected=9 |
| 16 | `satisficing_all_equal_fires` | ✅ | flags=[all_equal,round_number_straightline] |
| 17 | `satisficing_all_high_no_excess_fires` | ✅ | flags=[all_high_no_excess] |
| 18 | `satisficing_too_fast_threshold` | ✅ | fast=[too_fast] slow=[] |
| 19 | `legacy_morBoundaryId_unchanged` | ✅ | legacy MorBoundaryId still has 7 entries incl political_tribe; new MoralCircleScope has 8 (separate, additive) |
| 20 | `battery_spec_shape` | ✅ | version=v0 A.target=universalAffinity B.rows=8 not_meaningful=not_meaningful_to_me |
| 21 | `derive_clamps_inputs` | ✅ | universal=100 national=0 religious=100 |
| 22 | `validation_missing_scope_key_fails` | ✅ | issues=scopedAffinities.political_camp: missing required scope key (incomplete 9-value storage shape) |
| 23 | `validation_explicit_null_passes` | ✅ | issues=0  |
| 24 | `satisficing_all_null_no_all_high_no_excess` | ✅ | flags=[] |
| 25 | `_echo_workorder_canonical_case` | ✅ | excess={"national":20,"religious":0,"ethnic_racial":0,"class":0,"gender":0,"sexual":0,"ideological":20,"political_camp":0} active=national,ideological l2=28.2843 i01=0.2828 |

## What this smoke does NOT do

- Does not run the engine, selector, mapper, or live quiz.
- Does not modify legacy MOR / PF / TRB / TRB_ANCHOR fields, archetypes, era-activations, or electorate outputs.
- Does not insert the calibration battery into `questions.full.ts` / `questions.representative.ts`.
- Does not exercise identity-primary resolver migration, candidate-distance, or era-activation conversion.

Stage F (engine cutover) requires Terminal 1 review of the additive scaffolding before proceeding.
