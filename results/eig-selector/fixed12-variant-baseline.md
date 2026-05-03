# Fixed-12 variant matrix — baseline

**Date:** 2026-05-03 (Terminal-3)
**HEAD at baseline:** `2e136e2` electorate: add phase 2 backtest scaffold
(includes Q3 top-K probe `0fdf0e1` + D1 attribution audit `1de4ad4`)

## Baseline opener (15)

`CORE_OPENER` (10): `200, 103, 97, 1, 60, 89, 22, 218, 211, 212`
`UNIVERSAL_SCREENERS` (5): `93, 102, 209, 210, 214`
`SALIENCE_ROUTER_FIXED` length: **15**, dynamic phase starts at slot **16**.

## Dump-replay (3 dumps)

| Dump | Target | Matched | Target rank | Q total | Q3 slot | Q82 slot |
|---|---|---|---|---|---|---|
| D1 | 088 | 090 | **−1** | 29 | 16 | NOT |
| D2 | 056 | 056 | 1 | 33 | NOT | 18 |
| D3 | 011 | 011 | 1 | 32 | 16 | 18 |

## Per-node final estimates

| Dump | CD pos/sal | CU pos/sal | MOR pos/sal | PRO pos/sal | ONT_H pos/sal | ONT_S pos/sal |
|---|---|---|---|---|---|---|
| D1 | 4.46 / 2.94 | 1.40 / 2.65 | 1.40 / 2.86 | 3.14 / 1.50 | 1.80 / 2.66 | 3.22 / 2.20 |
| D2 | 2.87 / 1.60 | 3.23 / 2.87 | 3.70 / 2.24 | 3.73 / 1.94 | 3.96 / 2.58 | 4.49 / 2.95 |
| D3 | 1.53 / 2.50 | 4.27 / 2.33 | 4.58 / 2.92 | 2.62 / 1.94 | 2.88 / 1.86 | 2.49 / 2.13 |

## Persona-replay (centroid, 121 archetypes)

| Metric | Value |
|---|---|
| Top-1 | 66 / 121 (54.5%) |
| Top-3 | 85 / 121 (70.2%) |
| Avg Q answered | 28.55 |

## Acceptance gates (for variants)

| Gate | Threshold |
|---|---|
| Fixed opener length | = 12 |
| Dynamic phase starts at | slot 13 |
| D2 target rank | 1 |
| D3 target rank | 1 |
| D1 CD pos | ≥ baseline 4.46 (no regression) |
| D1 CU pos | ≤ baseline 1.40 (no regression toward neutral) |
| Persona top-1 | ≥ 52.5% (≤ −2pp) |
| Persona top-3 | ≥ 68.2% (≤ −2pp) |
| Avg Q | ≤ 28.55 (no increase) |
| No high-sal node exits under-drilled | qualitative |
| No retired terminology | grep clean |
