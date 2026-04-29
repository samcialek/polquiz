# PR 5 baseline diagnostic — pre-fix

Date: 2026-04-29

Formula in current code (src/global/build-alignment.ts):
  distance = sqrt(Σ(sal × diff²) / Σ(sal))
  support  = 100 × exp(-(distance / 2)²)
  align    = (support / 50 - 1) × 3 × dysFactor   (symmetric — bug under fix in 5.D)


---

## 056 Institutional Leftist

### vs Germany/Prussia | Nazi Germany (1933-1945)

Regime values: MAT=3 CD=5 CU=1 MOR=1 PRO=1 COM=1 ZS=5 ONT_H=1 ONT_S=2

| node | archPos | archSal | regimePos | posDiff | sal × diff² |
|---|---|---|---|---|---|
| MAT | 2 | 2.00 | 3 | 1.00 | 2.000 |
| CD | 4 | 2.00 | 5 | 1.00 | 2.000 |
| CU | 4 | 3.00 | 1 | 3.90 | 45.630 |
| MOR | 4 | 3.00 | 1 | 3.00 | 27.000 |
| PRO | 3 | 2.00 | 1 | 2.20 | 9.680 |
| COM | 4 | 2.00 | 1 | 3.00 | 18.000 |
| ZS | 2 | 3.00 | 5 | 3.90 | 45.630 |
| ONT_H | 4 | 2.00 | 1 | 3.00 | 18.000 |
| ONT_S | 4 | 3.00 | 2 | 2.20 | 14.520 |

**Total weighted sum-sq:** 182.460 · **total sal:** 22.00
**Distance:** 2.880 · **support:** 12.58 · **dys tier:** 5 (factor 0.35)
**Raw alignment (pre-dys):** -2.245 · **Final alignment:** -2.245

### vs Italy | Fascist Italy (1922-1943)

Regime values: MAT=3 CD=5 CU=1 MOR=2 PRO=1 COM=1 ZS=5 ONT_H=2 ONT_S=3

| node | archPos | archSal | regimePos | posDiff | sal × diff² |
|---|---|---|---|---|---|
| MAT | 2 | 2.00 | 3 | 1.00 | 2.000 |
| CD | 4 | 2.00 | 5 | 1.00 | 2.000 |
| CU | 4 | 3.00 | 1 | 3.90 | 45.630 |
| MOR | 4 | 3.00 | 2 | 2.00 | 12.000 |
| PRO | 3 | 2.00 | 1 | 2.20 | 9.680 |
| COM | 4 | 2.00 | 1 | 3.00 | 18.000 |
| ZS | 2 | 3.00 | 5 | 3.90 | 45.630 |
| ONT_H | 4 | 2.00 | 2 | 2.00 | 8.000 |
| ONT_S | 4 | 3.00 | 3 | 1.00 | 3.000 |

**Total weighted sum-sq:** 145.940 · **total sal:** 22.00
**Distance:** 2.576 · **support:** 19.04 · **dys tier:** 4 (factor 0.60)
**Raw alignment (pre-dys):** -1.857 · **Final alignment:** -1.857

### vs France | Vichy France (1940-1944)

Regime values: MAT=4 CD=5 CU=1 MOR=1 PRO=1 COM=1 ZS=5 ONT_H=1 ONT_S=5

| node | archPos | archSal | regimePos | posDiff | sal × diff² |
|---|---|---|---|---|---|
| MAT | 2 | 2.00 | 4 | 2.00 | 8.000 |
| CD | 4 | 2.00 | 5 | 1.00 | 2.000 |
| CU | 4 | 3.00 | 1 | 3.90 | 45.630 |
| MOR | 4 | 3.00 | 1 | 3.00 | 27.000 |
| PRO | 3 | 2.00 | 1 | 2.20 | 9.680 |
| COM | 4 | 2.00 | 1 | 3.00 | 18.000 |
| ZS | 2 | 3.00 | 5 | 3.90 | 45.630 |
| ONT_H | 4 | 2.00 | 1 | 3.00 | 18.000 |
| ONT_S | 4 | 3.00 | 5 | 1.00 | 3.000 |

**Total weighted sum-sq:** 176.940 · **total sal:** 22.00
**Distance:** 2.836 · **support:** 13.39 · **dys tier:** 4 (factor 0.60)
**Raw alignment (pre-dys):** -2.197 · **Final alignment:** -2.197

### vs Austria/Austria-Hungary | Austrofascism/Anschluss (1934-1945)

Regime values: MAT=4 CD=5 CU=1 MOR=1 PRO=1 COM=1 ZS=5 ONT_H=1 ONT_S=5

| node | archPos | archSal | regimePos | posDiff | sal × diff² |
|---|---|---|---|---|---|
| MAT | 2 | 2.00 | 4 | 2.00 | 8.000 |
| CD | 4 | 2.00 | 5 | 1.00 | 2.000 |
| CU | 4 | 3.00 | 1 | 3.90 | 45.630 |
| MOR | 4 | 3.00 | 1 | 3.00 | 27.000 |
| PRO | 3 | 2.00 | 1 | 2.20 | 9.680 |
| COM | 4 | 2.00 | 1 | 3.00 | 18.000 |
| ZS | 2 | 3.00 | 5 | 3.90 | 45.630 |
| ONT_H | 4 | 2.00 | 1 | 3.00 | 18.000 |
| ONT_S | 4 | 3.00 | 5 | 1.00 | 3.000 |

**Total weighted sum-sq:** 176.940 · **total sal:** 22.00
**Distance:** 2.836 · **support:** 13.39 · **dys tier:** 4 (factor 0.60)
**Raw alignment (pre-dys):** -2.197 · **Final alignment:** -2.197

### vs Hungary | Orban's Hungary (2010-2026)

Regime values: MAT=3 CD=5 CU=2 MOR=1 PRO=2 COM=1 ZS=4 ONT_H=1 ONT_S=4

| node | archPos | archSal | regimePos | posDiff | sal × diff² |
|---|---|---|---|---|---|
| MAT | 2 | 2.00 | 3 | 1.00 | 2.000 |
| CD | 4 | 2.00 | 5 | 1.00 | 2.000 |
| CU | 4 | 3.00 | 2 | 2.20 | 14.520 |
| MOR | 4 | 3.00 | 1 | 3.00 | 27.000 |
| PRO | 3 | 2.00 | 2 | 1.00 | 2.000 |
| COM | 4 | 2.00 | 1 | 3.00 | 18.000 |
| ZS | 2 | 3.00 | 4 | 2.20 | 14.520 |
| ONT_H | 4 | 2.00 | 1 | 3.00 | 18.000 |
| ONT_S | 4 | 3.00 | 4 | 0.00 | 0.000 |

**Total weighted sum-sq:** 98.040 · **total sal:** 22.00
**Distance:** 2.111 · **support:** 32.82 · **dys tier:** 3 (factor 0.80)
**Raw alignment (pre-dys):** -1.031 · **Final alignment:** -1.031


---

## 085 Customary Localist

### vs Germany/Prussia | Nazi Germany (1933-1945)

Regime values: MAT=3 CD=5 CU=1 MOR=1 PRO=1 COM=1 ZS=5 ONT_H=1 ONT_S=2

| node | archPos | archSal | regimePos | posDiff | sal × diff² |
|---|---|---|---|---|---|
| MAT | 4 | 2.00 | 3 | 1.00 | 2.000 |
| CD | 5 | 2.00 | 5 | 0.00 | 0.000 |
| CU | 1 | 2.00 | 1 | 0.00 | 0.000 |
| MOR | 2 | 2.00 | 1 | 1.00 | 2.000 |
| PRO | 2 | 2.00 | 1 | 1.00 | 2.000 |
| COM | 2 | 2.00 | 1 | 1.00 | 2.000 |
| ZS | 3 | 1.00 | 5 | 2.00 | 4.000 |
| ONT_H | 4 | 1.00 | 1 | 3.00 | 9.000 |
| ONT_S | 3 | 2.00 | 2 | 1.00 | 2.000 |

**Total weighted sum-sq:** 23.000 · **total sal:** 16.00
**Distance:** 1.199 · **support:** 69.81 · **dys tier:** 5 (factor 0.35)
**Raw alignment (pre-dys):** 1.189 · **Final alignment:** 0.416

### vs Italy | Fascist Italy (1922-1943)

Regime values: MAT=3 CD=5 CU=1 MOR=2 PRO=1 COM=1 ZS=5 ONT_H=2 ONT_S=3

| node | archPos | archSal | regimePos | posDiff | sal × diff² |
|---|---|---|---|---|---|
| MAT | 4 | 2.00 | 3 | 1.00 | 2.000 |
| CD | 5 | 2.00 | 5 | 0.00 | 0.000 |
| CU | 1 | 2.00 | 1 | 0.00 | 0.000 |
| MOR | 2 | 2.00 | 2 | 0.00 | 0.000 |
| PRO | 2 | 2.00 | 1 | 1.00 | 2.000 |
| COM | 2 | 2.00 | 1 | 1.00 | 2.000 |
| ZS | 3 | 1.00 | 5 | 2.00 | 4.000 |
| ONT_H | 4 | 1.00 | 2 | 2.00 | 4.000 |
| ONT_S | 3 | 2.00 | 3 | 0.00 | 0.000 |

**Total weighted sum-sq:** 14.000 · **total sal:** 16.00
**Distance:** 0.935 · **support:** 80.35 · **dys tier:** 4 (factor 0.60)
**Raw alignment (pre-dys):** 1.821 · **Final alignment:** 1.093

### vs France | Vichy France (1940-1944)

Regime values: MAT=4 CD=5 CU=1 MOR=1 PRO=1 COM=1 ZS=5 ONT_H=1 ONT_S=5

| node | archPos | archSal | regimePos | posDiff | sal × diff² |
|---|---|---|---|---|---|
| MAT | 4 | 2.00 | 4 | 0.00 | 0.000 |
| CD | 5 | 2.00 | 5 | 0.00 | 0.000 |
| CU | 1 | 2.00 | 1 | 0.00 | 0.000 |
| MOR | 2 | 2.00 | 1 | 1.00 | 2.000 |
| PRO | 2 | 2.00 | 1 | 1.00 | 2.000 |
| COM | 2 | 2.00 | 1 | 1.00 | 2.000 |
| ZS | 3 | 1.00 | 5 | 2.00 | 4.000 |
| ONT_H | 4 | 1.00 | 1 | 3.00 | 9.000 |
| ONT_S | 3 | 2.00 | 5 | 2.00 | 8.000 |

**Total weighted sum-sq:** 27.000 · **total sal:** 16.00
**Distance:** 1.299 · **support:** 65.58 · **dys tier:** 4 (factor 0.60)
**Raw alignment (pre-dys):** 0.935 · **Final alignment:** 0.561

### vs Austria/Austria-Hungary | Austrofascism/Anschluss (1934-1945)

Regime values: MAT=4 CD=5 CU=1 MOR=1 PRO=1 COM=1 ZS=5 ONT_H=1 ONT_S=5

| node | archPos | archSal | regimePos | posDiff | sal × diff² |
|---|---|---|---|---|---|
| MAT | 4 | 2.00 | 4 | 0.00 | 0.000 |
| CD | 5 | 2.00 | 5 | 0.00 | 0.000 |
| CU | 1 | 2.00 | 1 | 0.00 | 0.000 |
| MOR | 2 | 2.00 | 1 | 1.00 | 2.000 |
| PRO | 2 | 2.00 | 1 | 1.00 | 2.000 |
| COM | 2 | 2.00 | 1 | 1.00 | 2.000 |
| ZS | 3 | 1.00 | 5 | 2.00 | 4.000 |
| ONT_H | 4 | 1.00 | 1 | 3.00 | 9.000 |
| ONT_S | 3 | 2.00 | 5 | 2.00 | 8.000 |

**Total weighted sum-sq:** 27.000 · **total sal:** 16.00
**Distance:** 1.299 · **support:** 65.58 · **dys tier:** 4 (factor 0.60)
**Raw alignment (pre-dys):** 0.935 · **Final alignment:** 0.561

### vs Hungary | Orban's Hungary (2010-2026)

Regime values: MAT=3 CD=5 CU=2 MOR=1 PRO=2 COM=1 ZS=4 ONT_H=1 ONT_S=4

| node | archPos | archSal | regimePos | posDiff | sal × diff² |
|---|---|---|---|---|---|
| MAT | 4 | 2.00 | 3 | 1.00 | 2.000 |
| CD | 5 | 2.00 | 5 | 0.00 | 0.000 |
| CU | 1 | 2.00 | 2 | 1.00 | 2.000 |
| MOR | 2 | 2.00 | 1 | 1.00 | 2.000 |
| PRO | 2 | 2.00 | 2 | 0.00 | 0.000 |
| COM | 2 | 2.00 | 1 | 1.00 | 2.000 |
| ZS | 3 | 1.00 | 4 | 1.00 | 1.000 |
| ONT_H | 4 | 1.00 | 1 | 3.00 | 9.000 |
| ONT_S | 3 | 2.00 | 4 | 1.00 | 2.000 |

**Total weighted sum-sq:** 20.000 · **total sal:** 16.00
**Distance:** 1.118 · **support:** 73.16 · **dys tier:** 3 (factor 0.80)
**Raw alignment (pre-dys):** 1.390 · **Final alignment:** 1.112


---

## 134 Progressive Civic Nationalist

### vs Germany/Prussia | Nazi Germany (1933-1945)

Regime values: MAT=3 CD=5 CU=1 MOR=1 PRO=1 COM=1 ZS=5 ONT_H=1 ONT_S=2

| node | archPos | archSal | regimePos | posDiff | sal × diff² |
|---|---|---|---|---|---|
| MAT | 1 | 3.00 | 3 | 2.20 | 14.520 |
| CD | 2 | 1.00 | 5 | 3.00 | 9.000 |
| CU | 3 | 2.00 | 1 | 2.00 | 8.000 |
| MOR | 4 | 2.00 | 1 | 3.00 | 18.000 |
| PRO | 4 | 2.00 | 1 | 3.00 | 18.000 |
| COM | 4 | 2.00 | 1 | 3.00 | 18.000 |
| ZS | 2 | 1.00 | 5 | 3.00 | 9.000 |
| ONT_H | 4 | 1.00 | 1 | 3.00 | 9.000 |
| ONT_S | 4 | 1.00 | 2 | 2.00 | 4.000 |

**Total weighted sum-sq:** 107.520 · **total sal:** 15.00
**Distance:** 2.677 · **support:** 16.66 · **dys tier:** 5 (factor 0.35)
**Raw alignment (pre-dys):** -2.000 · **Final alignment:** -2.000

### vs Italy | Fascist Italy (1922-1943)

Regime values: MAT=3 CD=5 CU=1 MOR=2 PRO=1 COM=1 ZS=5 ONT_H=2 ONT_S=3

| node | archPos | archSal | regimePos | posDiff | sal × diff² |
|---|---|---|---|---|---|
| MAT | 1 | 3.00 | 3 | 2.20 | 14.520 |
| CD | 2 | 1.00 | 5 | 3.00 | 9.000 |
| CU | 3 | 2.00 | 1 | 2.00 | 8.000 |
| MOR | 4 | 2.00 | 2 | 2.00 | 8.000 |
| PRO | 4 | 2.00 | 1 | 3.00 | 18.000 |
| COM | 4 | 2.00 | 1 | 3.00 | 18.000 |
| ZS | 2 | 1.00 | 5 | 3.00 | 9.000 |
| ONT_H | 4 | 1.00 | 2 | 2.00 | 4.000 |
| ONT_S | 4 | 1.00 | 3 | 1.00 | 1.000 |

**Total weighted sum-sq:** 89.520 · **total sal:** 15.00
**Distance:** 2.443 · **support:** 22.49 · **dys tier:** 4 (factor 0.60)
**Raw alignment (pre-dys):** -1.650 · **Final alignment:** -1.650

### vs France | Vichy France (1940-1944)

Regime values: MAT=4 CD=5 CU=1 MOR=1 PRO=1 COM=1 ZS=5 ONT_H=1 ONT_S=5

| node | archPos | archSal | regimePos | posDiff | sal × diff² |
|---|---|---|---|---|---|
| MAT | 1 | 3.00 | 4 | 3.90 | 45.630 |
| CD | 2 | 1.00 | 5 | 3.00 | 9.000 |
| CU | 3 | 2.00 | 1 | 2.00 | 8.000 |
| MOR | 4 | 2.00 | 1 | 3.00 | 18.000 |
| PRO | 4 | 2.00 | 1 | 3.00 | 18.000 |
| COM | 4 | 2.00 | 1 | 3.00 | 18.000 |
| ZS | 2 | 1.00 | 5 | 3.00 | 9.000 |
| ONT_H | 4 | 1.00 | 1 | 3.00 | 9.000 |
| ONT_S | 4 | 1.00 | 5 | 1.00 | 1.000 |

**Total weighted sum-sq:** 135.630 · **total sal:** 15.00
**Distance:** 3.007 · **support:** 10.43 · **dys tier:** 4 (factor 0.60)
**Raw alignment (pre-dys):** -2.374 · **Final alignment:** -2.374

### vs Austria/Austria-Hungary | Austrofascism/Anschluss (1934-1945)

Regime values: MAT=4 CD=5 CU=1 MOR=1 PRO=1 COM=1 ZS=5 ONT_H=1 ONT_S=5

| node | archPos | archSal | regimePos | posDiff | sal × diff² |
|---|---|---|---|---|---|
| MAT | 1 | 3.00 | 4 | 3.90 | 45.630 |
| CD | 2 | 1.00 | 5 | 3.00 | 9.000 |
| CU | 3 | 2.00 | 1 | 2.00 | 8.000 |
| MOR | 4 | 2.00 | 1 | 3.00 | 18.000 |
| PRO | 4 | 2.00 | 1 | 3.00 | 18.000 |
| COM | 4 | 2.00 | 1 | 3.00 | 18.000 |
| ZS | 2 | 1.00 | 5 | 3.00 | 9.000 |
| ONT_H | 4 | 1.00 | 1 | 3.00 | 9.000 |
| ONT_S | 4 | 1.00 | 5 | 1.00 | 1.000 |

**Total weighted sum-sq:** 135.630 · **total sal:** 15.00
**Distance:** 3.007 · **support:** 10.43 · **dys tier:** 4 (factor 0.60)
**Raw alignment (pre-dys):** -2.374 · **Final alignment:** -2.374

### vs Hungary | Orban's Hungary (2010-2026)

Regime values: MAT=3 CD=5 CU=2 MOR=1 PRO=2 COM=1 ZS=4 ONT_H=1 ONT_S=4

| node | archPos | archSal | regimePos | posDiff | sal × diff² |
|---|---|---|---|---|---|
| MAT | 1 | 3.00 | 3 | 2.20 | 14.520 |
| CD | 2 | 1.00 | 5 | 3.00 | 9.000 |
| CU | 3 | 2.00 | 2 | 1.00 | 2.000 |
| MOR | 4 | 2.00 | 1 | 3.00 | 18.000 |
| PRO | 4 | 2.00 | 2 | 2.00 | 8.000 |
| COM | 4 | 2.00 | 1 | 3.00 | 18.000 |
| ZS | 2 | 1.00 | 4 | 2.00 | 4.000 |
| ONT_H | 4 | 1.00 | 1 | 3.00 | 9.000 |
| ONT_S | 4 | 1.00 | 4 | 0.00 | 0.000 |

**Total weighted sum-sq:** 82.520 · **total sal:** 15.00
**Distance:** 2.345 · **support:** 25.28 · **dys tier:** 3 (factor 0.80)
**Raw alignment (pre-dys):** -1.483 · **Final alignment:** -1.483



=================================================================
# Live-map diagnostic — respondent posterior (this is what Sam saw)
=================================================================


---

## A — Inst Leftist (authentic)

runId: 0cb89086-c7c7-4e8e-b61c-9b88d0538131

Posterior: MAT=1.62(sal 2.91), CD=2.87(sal 1.60), CU=3.23(sal 2.87), MOR=3.70(sal 2.24), PRO=3.73(sal 1.94), COM=2.39(sal 1.60), ZS=2.51(sal 1.67), ONT_H=3.96(sal 2.58), ONT_S=4.49(sal 2.95)

### vs Nazi Germany

| node | respPos | respSal | regimePos | posDiff | sal × diff² |
|---|---|---|---|---|---|
| MAT | 1.62 | 2.91 | 3 | 1.38 | 5.548 |
| CD | 2.87 | 1.60 | 5 | 2.13 | 7.292 |
| CU | 3.23 | 2.87 | 1 | 2.23 | 14.193 |
| MOR | 3.70 | 2.24 | 1 | 2.70 | 16.345 |
| PRO | 3.73 | 1.94 | 1 | 2.73 | 14.445 |
| COM | 2.39 | 1.60 | 1 | 1.39 | 3.093 |
| ZS | 2.51 | 1.67 | 5 | 2.49 | 10.334 |
| ONT_H | 3.96 | 2.58 | 1 | 2.96 | 22.655 |
| ONT_S | 4.49 | 2.95 | 2 | 2.49 | 18.249 |

**Total weighted sum-sq:** 112.154 · **total sal:** 20.36
**Distance:** 2.347 · **support:** 25.23 · **dys tier:** 5 (factor 0.35)
**Raw alignment (pre-dys):** -1.486 · **Final alignment:** -1.486

### vs Fascist Italy

| node | respPos | respSal | regimePos | posDiff | sal × diff² |
|---|---|---|---|---|---|
| MAT | 1.62 | 2.91 | 3 | 1.38 | 5.548 |
| CD | 2.87 | 1.60 | 5 | 2.13 | 7.292 |
| CU | 3.23 | 2.87 | 1 | 2.23 | 14.193 |
| MOR | 3.70 | 2.24 | 2 | 1.70 | 6.489 |
| PRO | 3.73 | 1.94 | 1 | 2.73 | 14.445 |
| COM | 2.39 | 1.60 | 1 | 1.39 | 3.093 |
| ZS | 2.51 | 1.67 | 5 | 2.49 | 10.334 |
| ONT_H | 3.96 | 2.58 | 2 | 1.96 | 9.937 |
| ONT_S | 4.49 | 2.95 | 3 | 1.49 | 6.518 |

**Total weighted sum-sq:** 77.849 · **total sal:** 20.36
**Distance:** 1.956 · **support:** 38.44 · **dys tier:** 4 (factor 0.60)
**Raw alignment (pre-dys):** -0.694 · **Final alignment:** -0.694

### vs Vichy France

| node | respPos | respSal | regimePos | posDiff | sal × diff² |
|---|---|---|---|---|---|
| MAT | 1.62 | 2.91 | 4 | 2.38 | 16.493 |
| CD | 2.87 | 1.60 | 5 | 2.13 | 7.292 |
| CU | 3.23 | 2.87 | 1 | 2.23 | 14.193 |
| MOR | 3.70 | 2.24 | 1 | 2.70 | 16.345 |
| PRO | 3.73 | 1.94 | 1 | 2.73 | 14.445 |
| COM | 2.39 | 1.60 | 1 | 1.39 | 3.093 |
| ZS | 2.51 | 1.67 | 5 | 2.49 | 10.334 |
| ONT_H | 3.96 | 2.58 | 1 | 2.96 | 22.655 |
| ONT_S | 4.49 | 2.95 | 5 | 0.51 | 0.782 |

**Total weighted sum-sq:** 105.631 · **total sal:** 20.36
**Distance:** 2.278 · **support:** 27.33 · **dys tier:** 4 (factor 0.60)
**Raw alignment (pre-dys):** -1.360 · **Final alignment:** -1.360

### vs Austrofascism/Anschluss

| node | respPos | respSal | regimePos | posDiff | sal × diff² |
|---|---|---|---|---|---|
| MAT | 1.62 | 2.91 | 4 | 2.38 | 16.493 |
| CD | 2.87 | 1.60 | 5 | 2.13 | 7.292 |
| CU | 3.23 | 2.87 | 1 | 2.23 | 14.193 |
| MOR | 3.70 | 2.24 | 1 | 2.70 | 16.345 |
| PRO | 3.73 | 1.94 | 1 | 2.73 | 14.445 |
| COM | 2.39 | 1.60 | 1 | 1.39 | 3.093 |
| ZS | 2.51 | 1.67 | 5 | 2.49 | 10.334 |
| ONT_H | 3.96 | 2.58 | 1 | 2.96 | 22.655 |
| ONT_S | 4.49 | 2.95 | 5 | 0.51 | 0.782 |

**Total weighted sum-sq:** 105.631 · **total sal:** 20.36
**Distance:** 2.278 · **support:** 27.33 · **dys tier:** 4 (factor 0.60)
**Raw alignment (pre-dys):** -1.360 · **Final alignment:** -1.360

### vs Orban's Hungary

| node | respPos | respSal | regimePos | posDiff | sal × diff² |
|---|---|---|---|---|---|
| MAT | 1.62 | 2.91 | 3 | 1.38 | 5.548 |
| CD | 2.87 | 1.60 | 5 | 2.13 | 7.292 |
| CU | 3.23 | 2.87 | 2 | 1.23 | 4.304 |
| MOR | 3.70 | 2.24 | 1 | 2.70 | 16.345 |
| PRO | 3.73 | 1.94 | 2 | 1.73 | 5.795 |
| COM | 2.39 | 1.60 | 1 | 1.39 | 3.093 |
| ZS | 2.51 | 1.67 | 4 | 1.49 | 3.700 |
| ONT_H | 3.96 | 2.58 | 1 | 2.96 | 22.655 |
| ONT_S | 4.49 | 2.95 | 4 | 0.49 | 0.696 |

**Total weighted sum-sq:** 69.429 · **total sal:** 20.36
**Distance:** 1.847 · **support:** 42.63 · **dys tier:** 3 (factor 0.80)
**Raw alignment (pre-dys):** -0.442 · **Final alignment:** -0.442


---

## B — Progressive Civic Nat (tankie)

runId: 720f5027-f5cd-40a9-8903-87e3d9df37c6

Posterior: MAT=1.54(sal 2.72), CD=1.64(sal 2.50), CU=4.27(sal 2.33), MOR=4.58(sal 2.92), PRO=3.08(sal 2.27), COM=2.21(sal 1.22), ZS=4.15(sal 1.41), ONT_H=3.76(sal 2.05), ONT_S=3.15(sal 1.45)

### vs Nazi Germany

| node | respPos | respSal | regimePos | posDiff | sal × diff² |
|---|---|---|---|---|---|
| MAT | 1.54 | 2.72 | 3 | 1.46 | 5.823 |
| CD | 1.64 | 2.50 | 5 | 3.36 | 28.358 |
| CU | 4.27 | 2.33 | 1 | 3.27 | 24.996 |
| MOR | 4.58 | 2.92 | 1 | 3.58 | 37.416 |
| PRO | 3.08 | 2.27 | 1 | 2.08 | 9.787 |
| COM | 2.21 | 1.22 | 1 | 1.21 | 1.774 |
| ZS | 4.15 | 1.41 | 5 | 0.85 | 1.018 |
| ONT_H | 3.76 | 2.05 | 1 | 2.76 | 15.603 |
| ONT_S | 3.15 | 1.45 | 2 | 1.15 | 1.915 |

**Total weighted sum-sq:** 126.691 · **total sal:** 18.87
**Distance:** 2.591 · **support:** 18.67 · **dys tier:** 5 (factor 0.35)
**Raw alignment (pre-dys):** -1.880 · **Final alignment:** -1.880

### vs Fascist Italy

| node | respPos | respSal | regimePos | posDiff | sal × diff² |
|---|---|---|---|---|---|
| MAT | 1.54 | 2.72 | 3 | 1.46 | 5.823 |
| CD | 1.64 | 2.50 | 5 | 3.36 | 28.358 |
| CU | 4.27 | 2.33 | 1 | 3.27 | 24.996 |
| MOR | 4.58 | 2.92 | 2 | 2.58 | 19.438 |
| PRO | 3.08 | 2.27 | 1 | 2.08 | 9.787 |
| COM | 2.21 | 1.22 | 1 | 1.21 | 1.774 |
| ZS | 4.15 | 1.41 | 5 | 0.85 | 1.018 |
| ONT_H | 3.76 | 2.05 | 2 | 1.76 | 6.340 |
| ONT_S | 3.15 | 1.45 | 3 | 0.15 | 0.032 |

**Total weighted sum-sq:** 97.566 · **total sal:** 18.87
**Distance:** 2.274 · **support:** 27.46 · **dys tier:** 4 (factor 0.60)
**Raw alignment (pre-dys):** -1.353 · **Final alignment:** -1.353

### vs Vichy France

| node | respPos | respSal | regimePos | posDiff | sal × diff² |
|---|---|---|---|---|---|
| MAT | 1.54 | 2.72 | 4 | 2.46 | 16.490 |
| CD | 1.64 | 2.50 | 5 | 3.36 | 28.358 |
| CU | 4.27 | 2.33 | 1 | 3.27 | 24.996 |
| MOR | 4.58 | 2.92 | 1 | 3.58 | 37.416 |
| PRO | 3.08 | 2.27 | 1 | 2.08 | 9.787 |
| COM | 2.21 | 1.22 | 1 | 1.21 | 1.774 |
| ZS | 4.15 | 1.41 | 5 | 0.85 | 1.018 |
| ONT_H | 3.76 | 2.05 | 1 | 2.76 | 15.603 |
| ONT_S | 3.15 | 1.45 | 5 | 1.85 | 4.960 |

**Total weighted sum-sq:** 140.403 · **total sal:** 18.87
**Distance:** 2.728 · **support:** 15.57 · **dys tier:** 4 (factor 0.60)
**Raw alignment (pre-dys):** -2.066 · **Final alignment:** -2.066

### vs Austrofascism/Anschluss

| node | respPos | respSal | regimePos | posDiff | sal × diff² |
|---|---|---|---|---|---|
| MAT | 1.54 | 2.72 | 4 | 2.46 | 16.490 |
| CD | 1.64 | 2.50 | 5 | 3.36 | 28.358 |
| CU | 4.27 | 2.33 | 1 | 3.27 | 24.996 |
| MOR | 4.58 | 2.92 | 1 | 3.58 | 37.416 |
| PRO | 3.08 | 2.27 | 1 | 2.08 | 9.787 |
| COM | 2.21 | 1.22 | 1 | 1.21 | 1.774 |
| ZS | 4.15 | 1.41 | 5 | 0.85 | 1.018 |
| ONT_H | 3.76 | 2.05 | 1 | 2.76 | 15.603 |
| ONT_S | 3.15 | 1.45 | 5 | 1.85 | 4.960 |

**Total weighted sum-sq:** 140.403 · **total sal:** 18.87
**Distance:** 2.728 · **support:** 15.57 · **dys tier:** 4 (factor 0.60)
**Raw alignment (pre-dys):** -2.066 · **Final alignment:** -2.066

### vs Orban's Hungary

| node | respPos | respSal | regimePos | posDiff | sal × diff² |
|---|---|---|---|---|---|
| MAT | 1.54 | 2.72 | 3 | 1.46 | 5.823 |
| CD | 1.64 | 2.50 | 5 | 3.36 | 28.358 |
| CU | 4.27 | 2.33 | 2 | 2.27 | 12.052 |
| MOR | 4.58 | 2.92 | 1 | 3.58 | 37.416 |
| PRO | 3.08 | 2.27 | 2 | 1.08 | 2.631 |
| COM | 2.21 | 1.22 | 1 | 1.21 | 1.774 |
| ZS | 4.15 | 1.41 | 4 | 0.15 | 0.032 |
| ONT_H | 3.76 | 2.05 | 1 | 2.76 | 15.603 |
| ONT_S | 3.15 | 1.45 | 4 | 0.85 | 1.048 |

**Total weighted sum-sq:** 104.738 · **total sal:** 18.87
**Distance:** 2.356 · **support:** 24.97 · **dys tier:** 3 (factor 0.80)
**Raw alignment (pre-dys):** -1.502 · **Final alignment:** -1.502


---

## C — Customary Localist (fascist)

runId: 4901f789-e3bd-4985-badd-3bb6385dff39

Posterior: MAT=2.85(sal 1.67), CD=4.42(sal 2.94), CU=1.03(sal 2.97), MOR=1.32(sal 2.85), PRO=1.58(sal 2.49), COM=1.96(sal 1.50), ZS=3.71(sal 1.98), ONT_H=2.51(sal 2.66), ONT_S=2.73(sal 1.98)

### vs Nazi Germany

| node | respPos | respSal | regimePos | posDiff | sal × diff² |
|---|---|---|---|---|---|
| MAT | 2.85 | 1.67 | 3 | 0.15 | 0.037 |
| CD | 4.42 | 2.94 | 5 | 0.58 | 0.991 |
| CU | 1.03 | 2.97 | 1 | 0.03 | 0.004 |
| MOR | 1.32 | 2.85 | 1 | 0.32 | 0.292 |
| PRO | 1.58 | 2.49 | 1 | 0.58 | 0.829 |
| COM | 1.96 | 1.50 | 1 | 0.96 | 1.381 |
| ZS | 3.71 | 1.98 | 5 | 1.29 | 3.278 |
| ONT_H | 2.51 | 2.66 | 1 | 1.51 | 6.070 |
| ONT_S | 2.73 | 1.98 | 2 | 0.73 | 1.053 |

**Total weighted sum-sq:** 13.935 · **total sal:** 21.04
**Distance:** 0.814 · **support:** 84.74 · **dys tier:** 5 (factor 0.35)
**Raw alignment (pre-dys):** 2.084 · **Final alignment:** 0.730

### vs Fascist Italy

| node | respPos | respSal | regimePos | posDiff | sal × diff² |
|---|---|---|---|---|---|
| MAT | 2.85 | 1.67 | 3 | 0.15 | 0.037 |
| CD | 4.42 | 2.94 | 5 | 0.58 | 0.991 |
| CU | 1.03 | 2.97 | 1 | 0.03 | 0.004 |
| MOR | 1.32 | 2.85 | 2 | 0.68 | 1.318 |
| PRO | 1.58 | 2.49 | 1 | 0.58 | 0.829 |
| COM | 1.96 | 1.50 | 1 | 0.96 | 1.381 |
| ZS | 3.71 | 1.98 | 5 | 1.29 | 3.278 |
| ONT_H | 2.51 | 2.66 | 2 | 0.51 | 0.693 |
| ONT_S | 2.73 | 1.98 | 3 | 0.27 | 0.144 |

**Total weighted sum-sq:** 8.675 · **total sal:** 21.04
**Distance:** 0.642 · **support:** 90.21 · **dys tier:** 4 (factor 0.60)
**Raw alignment (pre-dys):** 2.412 · **Final alignment:** 1.447

### vs Vichy France

| node | respPos | respSal | regimePos | posDiff | sal × diff² |
|---|---|---|---|---|---|
| MAT | 2.85 | 1.67 | 4 | 1.15 | 2.201 |
| CD | 4.42 | 2.94 | 5 | 0.58 | 0.991 |
| CU | 1.03 | 2.97 | 1 | 0.03 | 0.004 |
| MOR | 1.32 | 2.85 | 1 | 0.32 | 0.292 |
| PRO | 1.58 | 2.49 | 1 | 0.58 | 0.829 |
| COM | 1.96 | 1.50 | 1 | 0.96 | 1.381 |
| ZS | 3.71 | 1.98 | 5 | 1.29 | 3.278 |
| ONT_H | 2.51 | 2.66 | 1 | 1.51 | 6.070 |
| ONT_S | 2.73 | 1.98 | 5 | 2.27 | 10.192 |

**Total weighted sum-sq:** 25.238 · **total sal:** 21.04
**Distance:** 1.095 · **support:** 74.09 · **dys tier:** 4 (factor 0.60)
**Raw alignment (pre-dys):** 1.445 · **Final alignment:** 0.867

### vs Austrofascism/Anschluss

| node | respPos | respSal | regimePos | posDiff | sal × diff² |
|---|---|---|---|---|---|
| MAT | 2.85 | 1.67 | 4 | 1.15 | 2.201 |
| CD | 4.42 | 2.94 | 5 | 0.58 | 0.991 |
| CU | 1.03 | 2.97 | 1 | 0.03 | 0.004 |
| MOR | 1.32 | 2.85 | 1 | 0.32 | 0.292 |
| PRO | 1.58 | 2.49 | 1 | 0.58 | 0.829 |
| COM | 1.96 | 1.50 | 1 | 0.96 | 1.381 |
| ZS | 3.71 | 1.98 | 5 | 1.29 | 3.278 |
| ONT_H | 2.51 | 2.66 | 1 | 1.51 | 6.070 |
| ONT_S | 2.73 | 1.98 | 5 | 2.27 | 10.192 |

**Total weighted sum-sq:** 25.238 · **total sal:** 21.04
**Distance:** 1.095 · **support:** 74.09 · **dys tier:** 4 (factor 0.60)
**Raw alignment (pre-dys):** 1.445 · **Final alignment:** 0.867

### vs Orban's Hungary

| node | respPos | respSal | regimePos | posDiff | sal × diff² |
|---|---|---|---|---|---|
| MAT | 2.85 | 1.67 | 3 | 0.15 | 0.037 |
| CD | 4.42 | 2.94 | 5 | 0.58 | 0.991 |
| CU | 1.03 | 2.97 | 2 | 0.97 | 2.770 |
| MOR | 1.32 | 2.85 | 1 | 0.32 | 0.292 |
| PRO | 1.58 | 2.49 | 2 | 0.42 | 0.446 |
| COM | 1.96 | 1.50 | 1 | 0.96 | 1.381 |
| ZS | 3.71 | 1.98 | 4 | 0.29 | 0.162 |
| ONT_H | 2.51 | 2.66 | 1 | 1.51 | 6.070 |
| ONT_S | 2.73 | 1.98 | 4 | 1.27 | 3.191 |

**Total weighted sum-sq:** 15.340 · **total sal:** 21.04
**Distance:** 0.854 · **support:** 83.34 · **dys tier:** 3 (factor 0.80)
**Raw alignment (pre-dys):** 2.000 · **Final alignment:** 1.600

