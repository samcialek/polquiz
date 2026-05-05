# CCES 2012 marginal-distribution verification

**File:** `data/cces2012/CCES12_Common_VV.tab`
**Rows loaded:** 54,535
**Generated:** 2026-05-05T15:17:55.338Z
**Overall flag:** **OK**

Columns: 15 ok / 0 warn / 0 stop. Crosschecks: 3 ok / 0 warn / 0 stop.

## Per-column marginals

| Var | Construct | Kind | Observed | Expected | Max dev (pp) | Flag |
|---|---|---|---|---|---:|:---:|
| `CC332A` | Ryan Budget Bill | binary | {support_pct:18.7,oppose_pct:81.3,valid_n:53240} | {support_pct:18.7} | 0 | ok |
| `CC332B` | Simpson-Bowles Budget Plan | binary | {support_pct:48.7,oppose_pct:51.3,valid_n:53657} | {support_pct:48.7} | 0 | ok |
| `CC332D` | Tax Hike Prevention Act | binary | {support_pct:26.7,oppose_pct:73.3,valid_n:51755} | {support_pct:26.7} | 0 | ok |
| `CC332E` | Birth Control Exemption | binary | {support_pct:39.2,oppose_pct:60.8,valid_n:53340} | {support_pct:39.2} | 0 | ok |
| `CC332F` | US-Korea FTA | binary | {support_pct:50.9,oppose_pct:49.1,valid_n:52265} | {support_pct:50.9} | 0 | ok |
| `CC332G` | Repeal Affordable Care Act | binary | {support_pct:44.6,oppose_pct:55.4,valid_n:52172} | {support_pct:44.6} | 0 | ok |
| `CC332H` | Keystone Pipeline | binary | {support_pct:73.4,oppose_pct:26.6,valid_n:48758} | {support_pct:73.4} | 0 | ok |
| `CC332I` | Affordable Care Act of 2010 (PASS) | binary | {support_pct:56.9,oppose_pct:43.1,valid_n:53766} | {support_pct:56.9} | 0 | ok |
| `CC332J` | End Don't Ask Don't Tell | binary | {support_pct:67.7,oppose_pct:32.3,valid_n:53689} | {support_pct:67.7} | 0 | ok |
| `CC328` | Balanced Budget MOST | fc3 | {defense_pct:40.6,domestic_pct:38.8,taxes_pct:20.6,valid_n:53739} | {defense_pct:40.6,domestic_pct:38.8,taxes_pct:20.6} | 0 | ok |
| `CC329` | Balanced Budget LEAST | fc3 | {defense_pct:19.6,domestic_pct:35.8,taxes_pct:44.6,valid_n:53499} | {defense_pct:19.6,domestic_pct:35.8,taxes_pct:44.6} | 0 | ok |
| `CC324` | Abortion 4-pt Likert (1=never .. 4=always) | likert4 | {code1_pct:10.5,code2_pct:26.1,code3_pct:13.3,code4_pct:50.1,valid_n:54115} | {code1_pct:10.5,code2_pct:26.1,code3_pct:13.3,code4_pct:50.1} | 0 | ok |
| `CC326` | Gay Marriage (binary in 2012; no Not Sure code) | favor_oppose_notsure | {favor_pct:52.1,oppose_pct:47.9,notsure_pct:0,valid_n:53942} | {favor_pct:52.1,oppose_pct:47.9,notsure_pct:0} | 0 | ok |
| `CC325` | Jobs vs Environment 5-pt | likert5 | {code1_pct:12.1,code2_pct:17.7,code3_pct:31.7,code4_pct:24.6,code5_pct:14,valid_n:54300} | {code1_pct:12.1,code2_pct:17.7,code3_pct:31.7,code4_pct:24.6,code5_pct:14} | 0 | ok |
| `CC302` | Economic retrospective 5-pt (1=much better .. 5=much worse) | likert5 | {code1_pct:3.2,code2_pct:29.5,code3_pct:24.3,code4_pct:25.7,code5_pct:17.3,valid_n:53837} | {code1_pct:3.2,code2_pct:29.5,code3_pct:24.3,code4_pct:25.7,code5_pct:17.3} | 0 | ok |

## Cross-checks

| Check | Observed | Expected range | Flag | Notes |
|---|---:|---|:---:|---|
| ACA inversion: pct_support(CC332G) + pct_support(CC332I) near 100 | 101.5 | [85, 115] | ok | CC332G repeals ACA; CC332I passes ACA. Same construct, opposite direction. If both run high or both low, one is mis-decoded. |
| CC328 valid-response rate >= 60% | 98.5 | [60, 100] | ok | If significantly below 70%, missing-value sentinel may be mis-coded (8/9/'.' leaking into value pool). |
| CC329 valid-N / CC328 valid-N ratio | 99.6 | [85, 105] | ok | CC329 is conditional on CC328 being answered. Ratio should be near 100% (mild attrition between MOST and LEAST is normal). |

## Decision rule

- All **ok**: 2012 resolver is safe to lock in. Wire MAT (and other targets per audit).
- Any **warn**: investigate before locking; may indicate sample/weighting drift from public-poll baseline rather than miswiring.
- Any **stop**: do NOT wire. Re-verify column-name → question-content mapping in the audit before proceeding.

**Overall flag: OK**
