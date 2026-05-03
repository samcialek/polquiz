# Synthetic Electorate Contract

**Date:** 2026-05-03
**Schema version:** v0.1
**Status:** Contract and invariant smoke only. No population rows generated yet.

## Goal

The target artifact is a voting-eligible adult universe where every represented adult or weighted cell carries demographics, geography, and PRISM node-signature posteriors. Vote probabilities, abstention propensity, candidate distances, and counterfactual outputs are downstream projections of this file.

## Physical Representations

- **Weighted cell table:** the canonical first representation. One row represents many eligible adults in the same demographic/geographic/poststratification cell.
- **Synthetic person table:** optional expansion where each row has `cellWeight = 1`. This is useful for simulation ergonomics but should be derived from weighted cells, not treated as more factual.
- **Multiple draws:** the final system should write many plausible electorates, not one fake-exact electorate, because node signatures are estimated from survey evidence and imputation.

## Required Row Fields

- `year`, `drawId`, `rowKind`, `cellId`, `cellWeight`, `populationSource`, `signatureSource`
- demographics: state, age/age bucket, race/ethnicity, sex, education, income bucket where available, eligibility flag
- position nodes: MAT, CD, CU, MOR, PRO, COM, ZS, ONT_H, ONT_S
- categorical nodes: EPS, AES
- moral-boundary loadings: national, ethnic_racial, religious, class, ideological, gender, political_camp
- engagement: one-dimensional continuous scalar in [0, 10]
- uncertainty and coverage counters

## Invariants

- Every row represents a voting-eligible citizen adult or a weighted cell of such adults.
- Every row carries all position nodes, categorical nodes, moral-boundary loadings, and engagement.
- All posterior distributions are finite and normalized.
- Every node has provenance and uncertainty.
- Weights are finite and positive.
- Vote choice, abstention, candidate distance, and counterfactual outputs are downstream projections, not source fields in the signature contract.
- A synthetic-person table is an expansion of weighted cells, not a more exact source of truth.

## Smoke Checks

| # | Check | Pass | Detail |
|---:|---|:--:|---|
| 1 | example row validates | yes |  |
| 2 | all position nodes listed | yes | MAT,CD,CU,MOR,PRO,COM,ZS,ONT_H,ONT_S |
| 3 | all categorical nodes listed | yes | EPS,AES |
| 4 | all moral-boundary loadings listed | yes | national,ethnic_racial,religious,class,ideological,gender,political_camp |
| 5 | manifest covers five election years | yes | 2008,2012,2016,2020,2024 |
| 6 | contract keeps outcomes downstream | yes | no candidate-distance field on row |

## Sequencing

1. Survey mapper creates PRISM signatures for CES/CCES rows.
2. VEP universe loader creates the eligible-adult population skeleton from ACS/IPUMS/PUMS.
3. Imputation/poststratification maps survey signatures onto VEP cells.
4. Counterfactual simulator reads the synthetic electorate rows and projects outcomes.
