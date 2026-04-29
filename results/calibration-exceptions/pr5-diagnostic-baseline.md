# PR 5 baseline diagnostic — pre-fix

Date: 2026-04-29

Formula in current code (src/global/build-alignment.ts):
  distance = sqrt(Σ(sal × diff²) / Σ(sal))
  support  = 100 × exp(-(distance / 2)²)
  align    = (support / 50 - 1) × 3 × dysFactor   (symmetric — bug under fix in 5.D)


---

## 056 Institutional Leftist

### vs Germany/Prussia | Nazi Germany (1933-1945)

Regime values: MAT=3 CD=5 CU=5 MOR=1 PRO=1 COM=1 ZS=5 ONT_H=1 ONT_S=2

| node | archPos | archSal | regimePos | posDiff | sal × diff² |
|---|---|---|---|---|---|
| MAT | 2 | 2.00 | 3 | 1.00 | 2.000 |
| CD | 4 | 2.00 | 5 | 1.00 | 2.000 |
| CU | 4 | 3.00 | 5 | 1.00 | 3.000 |
| MOR | 4 | 3.00 | 1 | 3.00 | 27.000 |
| PRO | 3 | 2.00 | 1 | 2.20 | 9.680 |
| COM | 4 | 2.00 | 1 | 3.00 | 18.000 |
| ZS | 2 | 3.00 | 5 | 3.90 | 45.630 |
| ONT_H | 4 | 2.00 | 1 | 3.00 | 18.000 |
| ONT_S | 4 | 3.00 | 2 | 2.20 | 14.520 |

**Total weighted sum-sq:** 139.830 · **total sal:** 22.00
**Distance:** 2.521 · **support:** 20.41 · **dys tier:** 5 (factor 0.35)
**Raw alignment (pre-dys):** -1.775 · **Final alignment:** -0.621

### vs Italy | Fascist Italy (1922-1943)

Regime values: MAT=3 CD=5 CU=5 MOR=2 PRO=1 COM=1 ZS=5 ONT_H=2 ONT_S=3

| node | archPos | archSal | regimePos | posDiff | sal × diff² |
|---|---|---|---|---|---|
| MAT | 2 | 2.00 | 3 | 1.00 | 2.000 |
| CD | 4 | 2.00 | 5 | 1.00 | 2.000 |
| CU | 4 | 3.00 | 5 | 1.00 | 3.000 |
| MOR | 4 | 3.00 | 2 | 2.00 | 12.000 |
| PRO | 3 | 2.00 | 1 | 2.20 | 9.680 |
| COM | 4 | 2.00 | 1 | 3.00 | 18.000 |
| ZS | 2 | 3.00 | 5 | 3.90 | 45.630 |
| ONT_H | 4 | 2.00 | 2 | 2.00 | 8.000 |
| ONT_S | 4 | 3.00 | 3 | 1.00 | 3.000 |

**Total weighted sum-sq:** 103.310 · **total sal:** 22.00
**Distance:** 2.167 · **support:** 30.91 · **dys tier:** 4 (factor 0.60)
**Raw alignment (pre-dys):** -1.145 · **Final alignment:** -0.687

### vs France | Vichy France (1940-1944)

Regime values: MAT=4 CD=5 CU=5 MOR=1 PRO=1 COM=1 ZS=5 ONT_H=1 ONT_S=5

| node | archPos | archSal | regimePos | posDiff | sal × diff² |
|---|---|---|---|---|---|
| MAT | 2 | 2.00 | 4 | 2.00 | 8.000 |
| CD | 4 | 2.00 | 5 | 1.00 | 2.000 |
| CU | 4 | 3.00 | 5 | 1.00 | 3.000 |
| MOR | 4 | 3.00 | 1 | 3.00 | 27.000 |
| PRO | 3 | 2.00 | 1 | 2.20 | 9.680 |
| COM | 4 | 2.00 | 1 | 3.00 | 18.000 |
| ZS | 2 | 3.00 | 5 | 3.90 | 45.630 |
| ONT_H | 4 | 2.00 | 1 | 3.00 | 18.000 |
| ONT_S | 4 | 3.00 | 5 | 1.00 | 3.000 |

**Total weighted sum-sq:** 134.310 · **total sal:** 22.00
**Distance:** 2.471 · **support:** 21.73 · **dys tier:** 4 (factor 0.60)
**Raw alignment (pre-dys):** -1.696 · **Final alignment:** -1.018

### vs Austria/Austria-Hungary | Austrofascism/Anschluss (1934-1945)

Regime values: MAT=4 CD=5 CU=5 MOR=1 PRO=1 COM=1 ZS=5 ONT_H=1 ONT_S=5

| node | archPos | archSal | regimePos | posDiff | sal × diff² |
|---|---|---|---|---|---|
| MAT | 2 | 2.00 | 4 | 2.00 | 8.000 |
| CD | 4 | 2.00 | 5 | 1.00 | 2.000 |
| CU | 4 | 3.00 | 5 | 1.00 | 3.000 |
| MOR | 4 | 3.00 | 1 | 3.00 | 27.000 |
| PRO | 3 | 2.00 | 1 | 2.20 | 9.680 |
| COM | 4 | 2.00 | 1 | 3.00 | 18.000 |
| ZS | 2 | 3.00 | 5 | 3.90 | 45.630 |
| ONT_H | 4 | 2.00 | 1 | 3.00 | 18.000 |
| ONT_S | 4 | 3.00 | 5 | 1.00 | 3.000 |

**Total weighted sum-sq:** 134.310 · **total sal:** 22.00
**Distance:** 2.471 · **support:** 21.73 · **dys tier:** 4 (factor 0.60)
**Raw alignment (pre-dys):** -1.696 · **Final alignment:** -1.018

### vs Hungary | Orban's Hungary (2010-2026)

Regime values: MAT=3 CD=5 CU=4 MOR=2 PRO=2 COM=1 ZS=4 ONT_H=1 ONT_S=4

| node | archPos | archSal | regimePos | posDiff | sal × diff² |
|---|---|---|---|---|---|
| MAT | 2 | 2.00 | 3 | 1.00 | 2.000 |
| CD | 4 | 2.00 | 5 | 1.00 | 2.000 |
| CU | 4 | 3.00 | 4 | 0.00 | 0.000 |
| MOR | 4 | 3.00 | 2 | 2.00 | 12.000 |
| PRO | 3 | 2.00 | 2 | 1.00 | 2.000 |
| COM | 4 | 2.00 | 1 | 3.00 | 18.000 |
| ZS | 2 | 3.00 | 4 | 2.20 | 14.520 |
| ONT_H | 4 | 2.00 | 1 | 3.00 | 18.000 |
| ONT_S | 4 | 3.00 | 4 | 0.00 | 0.000 |

**Total weighted sum-sq:** 68.520 · **total sal:** 22.00
**Distance:** 1.765 · **support:** 45.90 · **dys tier:** 3 (factor 0.80)
**Raw alignment (pre-dys):** -0.246 · **Final alignment:** -0.197


---

## 085 Customary Localist

### vs Germany/Prussia | Nazi Germany (1933-1945)

Regime values: MAT=3 CD=5 CU=5 MOR=1 PRO=1 COM=1 ZS=5 ONT_H=1 ONT_S=2

| node | archPos | archSal | regimePos | posDiff | sal × diff² |
|---|---|---|---|---|---|
| MAT | 4 | 2.00 | 3 | 1.00 | 2.000 |
| CD | 5 | 2.00 | 5 | 0.00 | 0.000 |
| CU | 1 | 2.00 | 5 | 5.20 | 54.080 |
| MOR | 2 | 2.00 | 1 | 1.00 | 2.000 |
| PRO | 2 | 2.00 | 1 | 1.00 | 2.000 |
| COM | 2 | 2.00 | 1 | 1.00 | 2.000 |
| ZS | 3 | 1.00 | 5 | 2.00 | 4.000 |
| ONT_H | 4 | 1.00 | 1 | 3.00 | 9.000 |
| ONT_S | 3 | 2.00 | 2 | 1.00 | 2.000 |

**Total weighted sum-sq:** 77.080 · **total sal:** 16.00
**Distance:** 2.195 · **support:** 29.99 · **dys tier:** 5 (factor 0.35)
**Raw alignment (pre-dys):** -1.201 · **Final alignment:** -0.420

### vs Italy | Fascist Italy (1922-1943)

Regime values: MAT=3 CD=5 CU=5 MOR=2 PRO=1 COM=1 ZS=5 ONT_H=2 ONT_S=3

| node | archPos | archSal | regimePos | posDiff | sal × diff² |
|---|---|---|---|---|---|
| MAT | 4 | 2.00 | 3 | 1.00 | 2.000 |
| CD | 5 | 2.00 | 5 | 0.00 | 0.000 |
| CU | 1 | 2.00 | 5 | 5.20 | 54.080 |
| MOR | 2 | 2.00 | 2 | 0.00 | 0.000 |
| PRO | 2 | 2.00 | 1 | 1.00 | 2.000 |
| COM | 2 | 2.00 | 1 | 1.00 | 2.000 |
| ZS | 3 | 1.00 | 5 | 2.00 | 4.000 |
| ONT_H | 4 | 1.00 | 2 | 2.00 | 4.000 |
| ONT_S | 3 | 2.00 | 3 | 0.00 | 0.000 |

**Total weighted sum-sq:** 68.080 · **total sal:** 16.00
**Distance:** 2.063 · **support:** 34.52 · **dys tier:** 4 (factor 0.60)
**Raw alignment (pre-dys):** -0.929 · **Final alignment:** -0.557

### vs France | Vichy France (1940-1944)

Regime values: MAT=4 CD=5 CU=5 MOR=1 PRO=1 COM=1 ZS=5 ONT_H=1 ONT_S=5

| node | archPos | archSal | regimePos | posDiff | sal × diff² |
|---|---|---|---|---|---|
| MAT | 4 | 2.00 | 4 | 0.00 | 0.000 |
| CD | 5 | 2.00 | 5 | 0.00 | 0.000 |
| CU | 1 | 2.00 | 5 | 5.20 | 54.080 |
| MOR | 2 | 2.00 | 1 | 1.00 | 2.000 |
| PRO | 2 | 2.00 | 1 | 1.00 | 2.000 |
| COM | 2 | 2.00 | 1 | 1.00 | 2.000 |
| ZS | 3 | 1.00 | 5 | 2.00 | 4.000 |
| ONT_H | 4 | 1.00 | 1 | 3.00 | 9.000 |
| ONT_S | 3 | 2.00 | 5 | 2.00 | 8.000 |

**Total weighted sum-sq:** 81.080 · **total sal:** 16.00
**Distance:** 2.251 · **support:** 28.17 · **dys tier:** 4 (factor 0.60)
**Raw alignment (pre-dys):** -1.310 · **Final alignment:** -0.786

### vs Austria/Austria-Hungary | Austrofascism/Anschluss (1934-1945)

Regime values: MAT=4 CD=5 CU=5 MOR=1 PRO=1 COM=1 ZS=5 ONT_H=1 ONT_S=5

| node | archPos | archSal | regimePos | posDiff | sal × diff² |
|---|---|---|---|---|---|
| MAT | 4 | 2.00 | 4 | 0.00 | 0.000 |
| CD | 5 | 2.00 | 5 | 0.00 | 0.000 |
| CU | 1 | 2.00 | 5 | 5.20 | 54.080 |
| MOR | 2 | 2.00 | 1 | 1.00 | 2.000 |
| PRO | 2 | 2.00 | 1 | 1.00 | 2.000 |
| COM | 2 | 2.00 | 1 | 1.00 | 2.000 |
| ZS | 3 | 1.00 | 5 | 2.00 | 4.000 |
| ONT_H | 4 | 1.00 | 1 | 3.00 | 9.000 |
| ONT_S | 3 | 2.00 | 5 | 2.00 | 8.000 |

**Total weighted sum-sq:** 81.080 · **total sal:** 16.00
**Distance:** 2.251 · **support:** 28.17 · **dys tier:** 4 (factor 0.60)
**Raw alignment (pre-dys):** -1.310 · **Final alignment:** -0.786

### vs Hungary | Orban's Hungary (2010-2026)

Regime values: MAT=3 CD=5 CU=4 MOR=2 PRO=2 COM=1 ZS=4 ONT_H=1 ONT_S=4

| node | archPos | archSal | regimePos | posDiff | sal × diff² |
|---|---|---|---|---|---|
| MAT | 4 | 2.00 | 3 | 1.00 | 2.000 |
| CD | 5 | 2.00 | 5 | 0.00 | 0.000 |
| CU | 1 | 2.00 | 4 | 3.90 | 30.420 |
| MOR | 2 | 2.00 | 2 | 0.00 | 0.000 |
| PRO | 2 | 2.00 | 2 | 0.00 | 0.000 |
| COM | 2 | 2.00 | 1 | 1.00 | 2.000 |
| ZS | 3 | 1.00 | 4 | 1.00 | 1.000 |
| ONT_H | 4 | 1.00 | 1 | 3.00 | 9.000 |
| ONT_S | 3 | 2.00 | 4 | 1.00 | 2.000 |

**Total weighted sum-sq:** 46.420 · **total sal:** 16.00
**Distance:** 1.703 · **support:** 48.42 · **dys tier:** 3 (factor 0.80)
**Raw alignment (pre-dys):** -0.095 · **Final alignment:** -0.076


---

## 134 Progressive Civic Nationalist

### vs Germany/Prussia | Nazi Germany (1933-1945)

Regime values: MAT=3 CD=5 CU=5 MOR=1 PRO=1 COM=1 ZS=5 ONT_H=1 ONT_S=2

| node | archPos | archSal | regimePos | posDiff | sal × diff² |
|---|---|---|---|---|---|
| MAT | 1 | 3.00 | 3 | 2.20 | 14.520 |
| CD | 2 | 1.00 | 5 | 3.00 | 9.000 |
| CU | 3 | 2.00 | 5 | 2.00 | 8.000 |
| MOR | 4 | 2.00 | 1 | 3.00 | 18.000 |
| PRO | 4 | 2.00 | 1 | 3.00 | 18.000 |
| COM | 4 | 2.00 | 1 | 3.00 | 18.000 |
| ZS | 2 | 1.00 | 5 | 3.00 | 9.000 |
| ONT_H | 4 | 1.00 | 1 | 3.00 | 9.000 |
| ONT_S | 4 | 1.00 | 2 | 2.00 | 4.000 |

**Total weighted sum-sq:** 107.520 · **total sal:** 15.00
**Distance:** 2.677 · **support:** 16.66 · **dys tier:** 5 (factor 0.35)
**Raw alignment (pre-dys):** -2.000 · **Final alignment:** -0.700

### vs Italy | Fascist Italy (1922-1943)

Regime values: MAT=3 CD=5 CU=5 MOR=2 PRO=1 COM=1 ZS=5 ONT_H=2 ONT_S=3

| node | archPos | archSal | regimePos | posDiff | sal × diff² |
|---|---|---|---|---|---|
| MAT | 1 | 3.00 | 3 | 2.20 | 14.520 |
| CD | 2 | 1.00 | 5 | 3.00 | 9.000 |
| CU | 3 | 2.00 | 5 | 2.00 | 8.000 |
| MOR | 4 | 2.00 | 2 | 2.00 | 8.000 |
| PRO | 4 | 2.00 | 1 | 3.00 | 18.000 |
| COM | 4 | 2.00 | 1 | 3.00 | 18.000 |
| ZS | 2 | 1.00 | 5 | 3.00 | 9.000 |
| ONT_H | 4 | 1.00 | 2 | 2.00 | 4.000 |
| ONT_S | 4 | 1.00 | 3 | 1.00 | 1.000 |

**Total weighted sum-sq:** 89.520 · **total sal:** 15.00
**Distance:** 2.443 · **support:** 22.49 · **dys tier:** 4 (factor 0.60)
**Raw alignment (pre-dys):** -1.650 · **Final alignment:** -0.990

### vs France | Vichy France (1940-1944)

Regime values: MAT=4 CD=5 CU=5 MOR=1 PRO=1 COM=1 ZS=5 ONT_H=1 ONT_S=5

| node | archPos | archSal | regimePos | posDiff | sal × diff² |
|---|---|---|---|---|---|
| MAT | 1 | 3.00 | 4 | 3.90 | 45.630 |
| CD | 2 | 1.00 | 5 | 3.00 | 9.000 |
| CU | 3 | 2.00 | 5 | 2.00 | 8.000 |
| MOR | 4 | 2.00 | 1 | 3.00 | 18.000 |
| PRO | 4 | 2.00 | 1 | 3.00 | 18.000 |
| COM | 4 | 2.00 | 1 | 3.00 | 18.000 |
| ZS | 2 | 1.00 | 5 | 3.00 | 9.000 |
| ONT_H | 4 | 1.00 | 1 | 3.00 | 9.000 |
| ONT_S | 4 | 1.00 | 5 | 1.00 | 1.000 |

**Total weighted sum-sq:** 135.630 · **total sal:** 15.00
**Distance:** 3.007 · **support:** 10.43 · **dys tier:** 4 (factor 0.60)
**Raw alignment (pre-dys):** -2.374 · **Final alignment:** -1.425

### vs Austria/Austria-Hungary | Austrofascism/Anschluss (1934-1945)

Regime values: MAT=4 CD=5 CU=5 MOR=1 PRO=1 COM=1 ZS=5 ONT_H=1 ONT_S=5

| node | archPos | archSal | regimePos | posDiff | sal × diff² |
|---|---|---|---|---|---|
| MAT | 1 | 3.00 | 4 | 3.90 | 45.630 |
| CD | 2 | 1.00 | 5 | 3.00 | 9.000 |
| CU | 3 | 2.00 | 5 | 2.00 | 8.000 |
| MOR | 4 | 2.00 | 1 | 3.00 | 18.000 |
| PRO | 4 | 2.00 | 1 | 3.00 | 18.000 |
| COM | 4 | 2.00 | 1 | 3.00 | 18.000 |
| ZS | 2 | 1.00 | 5 | 3.00 | 9.000 |
| ONT_H | 4 | 1.00 | 1 | 3.00 | 9.000 |
| ONT_S | 4 | 1.00 | 5 | 1.00 | 1.000 |

**Total weighted sum-sq:** 135.630 · **total sal:** 15.00
**Distance:** 3.007 · **support:** 10.43 · **dys tier:** 4 (factor 0.60)
**Raw alignment (pre-dys):** -2.374 · **Final alignment:** -1.425

### vs Hungary | Orban's Hungary (2010-2026)

Regime values: MAT=3 CD=5 CU=4 MOR=2 PRO=2 COM=1 ZS=4 ONT_H=1 ONT_S=4

| node | archPos | archSal | regimePos | posDiff | sal × diff² |
|---|---|---|---|---|---|
| MAT | 1 | 3.00 | 3 | 2.20 | 14.520 |
| CD | 2 | 1.00 | 5 | 3.00 | 9.000 |
| CU | 3 | 2.00 | 4 | 1.00 | 2.000 |
| MOR | 4 | 2.00 | 2 | 2.00 | 8.000 |
| PRO | 4 | 2.00 | 2 | 2.00 | 8.000 |
| COM | 4 | 2.00 | 1 | 3.00 | 18.000 |
| ZS | 2 | 1.00 | 4 | 2.00 | 4.000 |
| ONT_H | 4 | 1.00 | 1 | 3.00 | 9.000 |
| ONT_S | 4 | 1.00 | 4 | 0.00 | 0.000 |

**Total weighted sum-sq:** 72.520 · **total sal:** 15.00
**Distance:** 2.199 · **support:** 29.86 · **dys tier:** 3 (factor 0.80)
**Raw alignment (pre-dys):** -1.208 · **Final alignment:** -0.967



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
| CU | 3.23 | 2.87 | 5 | 1.77 | 9.020 |
| MOR | 3.70 | 2.24 | 1 | 2.70 | 16.345 |
| PRO | 3.73 | 1.94 | 1 | 2.73 | 14.445 |
| COM | 2.39 | 1.60 | 1 | 1.39 | 3.093 |
| ZS | 2.51 | 1.67 | 5 | 2.49 | 10.334 |
| ONT_H | 3.96 | 2.58 | 1 | 2.96 | 22.655 |
| ONT_S | 4.49 | 2.95 | 2 | 2.49 | 18.249 |

**Total weighted sum-sq:** 106.981 · **total sal:** 20.36
**Distance:** 2.292 · **support:** 26.88 · **dys tier:** 5 (factor 0.35)
**Raw alignment (pre-dys):** -1.387 · **Final alignment:** -0.486

### vs Fascist Italy

| node | respPos | respSal | regimePos | posDiff | sal × diff² |
|---|---|---|---|---|---|
| MAT | 1.62 | 2.91 | 3 | 1.38 | 5.548 |
| CD | 2.87 | 1.60 | 5 | 2.13 | 7.292 |
| CU | 3.23 | 2.87 | 5 | 1.77 | 9.020 |
| MOR | 3.70 | 2.24 | 2 | 1.70 | 6.489 |
| PRO | 3.73 | 1.94 | 1 | 2.73 | 14.445 |
| COM | 2.39 | 1.60 | 1 | 1.39 | 3.093 |
| ZS | 2.51 | 1.67 | 5 | 2.49 | 10.334 |
| ONT_H | 3.96 | 2.58 | 2 | 1.96 | 9.937 |
| ONT_S | 4.49 | 2.95 | 3 | 1.49 | 6.518 |

**Total weighted sum-sq:** 72.676 · **total sal:** 20.36
**Distance:** 1.889 · **support:** 40.96 · **dys tier:** 4 (factor 0.60)
**Raw alignment (pre-dys):** -0.542 · **Final alignment:** -0.325

### vs Vichy France

| node | respPos | respSal | regimePos | posDiff | sal × diff² |
|---|---|---|---|---|---|
| MAT | 1.62 | 2.91 | 4 | 2.38 | 16.493 |
| CD | 2.87 | 1.60 | 5 | 2.13 | 7.292 |
| CU | 3.23 | 2.87 | 5 | 1.77 | 9.020 |
| MOR | 3.70 | 2.24 | 1 | 2.70 | 16.345 |
| PRO | 3.73 | 1.94 | 1 | 2.73 | 14.445 |
| COM | 2.39 | 1.60 | 1 | 1.39 | 3.093 |
| ZS | 2.51 | 1.67 | 5 | 2.49 | 10.334 |
| ONT_H | 3.96 | 2.58 | 1 | 2.96 | 22.655 |
| ONT_S | 4.49 | 2.95 | 5 | 0.51 | 0.782 |

**Total weighted sum-sq:** 100.459 · **total sal:** 20.36
**Distance:** 2.221 · **support:** 29.12 · **dys tier:** 4 (factor 0.60)
**Raw alignment (pre-dys):** -1.253 · **Final alignment:** -0.752

### vs Austrofascism/Anschluss

| node | respPos | respSal | regimePos | posDiff | sal × diff² |
|---|---|---|---|---|---|
| MAT | 1.62 | 2.91 | 4 | 2.38 | 16.493 |
| CD | 2.87 | 1.60 | 5 | 2.13 | 7.292 |
| CU | 3.23 | 2.87 | 5 | 1.77 | 9.020 |
| MOR | 3.70 | 2.24 | 1 | 2.70 | 16.345 |
| PRO | 3.73 | 1.94 | 1 | 2.73 | 14.445 |
| COM | 2.39 | 1.60 | 1 | 1.39 | 3.093 |
| ZS | 2.51 | 1.67 | 5 | 2.49 | 10.334 |
| ONT_H | 3.96 | 2.58 | 1 | 2.96 | 22.655 |
| ONT_S | 4.49 | 2.95 | 5 | 0.51 | 0.782 |

**Total weighted sum-sq:** 100.459 · **total sal:** 20.36
**Distance:** 2.221 · **support:** 29.12 · **dys tier:** 4 (factor 0.60)
**Raw alignment (pre-dys):** -1.253 · **Final alignment:** -0.752

### vs Orban's Hungary

| node | respPos | respSal | regimePos | posDiff | sal × diff² |
|---|---|---|---|---|---|
| MAT | 1.62 | 2.91 | 3 | 1.38 | 5.548 |
| CD | 2.87 | 1.60 | 5 | 2.13 | 7.292 |
| CU | 3.23 | 2.87 | 4 | 0.77 | 1.718 |
| MOR | 3.70 | 2.24 | 2 | 1.70 | 6.489 |
| PRO | 3.73 | 1.94 | 2 | 1.73 | 5.795 |
| COM | 2.39 | 1.60 | 1 | 1.39 | 3.093 |
| ZS | 2.51 | 1.67 | 4 | 1.49 | 3.700 |
| ONT_H | 3.96 | 2.58 | 1 | 2.96 | 22.655 |
| ONT_S | 4.49 | 2.95 | 4 | 0.49 | 0.696 |

**Total weighted sum-sq:** 56.986 · **total sal:** 20.36
**Distance:** 1.673 · **support:** 49.67 · **dys tier:** 3 (factor 0.80)
**Raw alignment (pre-dys):** -0.020 · **Final alignment:** -0.016


---

## B — Progressive Civic Nat (tankie)

runId: 720f5027-f5cd-40a9-8903-87e3d9df37c6

Posterior: MAT=1.54(sal 2.72), CD=1.64(sal 2.50), CU=4.27(sal 2.33), MOR=4.58(sal 2.92), PRO=3.08(sal 2.27), COM=2.21(sal 1.22), ZS=4.15(sal 1.41), ONT_H=3.76(sal 2.05), ONT_S=3.15(sal 1.45)

### vs Nazi Germany

| node | respPos | respSal | regimePos | posDiff | sal × diff² |
|---|---|---|---|---|---|
| MAT | 1.54 | 2.72 | 3 | 1.46 | 5.823 |
| CD | 1.64 | 2.50 | 5 | 3.36 | 28.358 |
| CU | 4.27 | 2.33 | 5 | 0.73 | 1.237 |
| MOR | 4.58 | 2.92 | 1 | 3.58 | 37.416 |
| PRO | 3.08 | 2.27 | 1 | 2.08 | 9.787 |
| COM | 2.21 | 1.22 | 1 | 1.21 | 1.774 |
| ZS | 4.15 | 1.41 | 5 | 0.85 | 1.018 |
| ONT_H | 3.76 | 2.05 | 1 | 2.76 | 15.603 |
| ONT_S | 3.15 | 1.45 | 2 | 1.15 | 1.915 |

**Total weighted sum-sq:** 102.932 · **total sal:** 18.87
**Distance:** 2.336 · **support:** 25.57 · **dys tier:** 5 (factor 0.35)
**Raw alignment (pre-dys):** -1.466 · **Final alignment:** -0.513

### vs Fascist Italy

| node | respPos | respSal | regimePos | posDiff | sal × diff² |
|---|---|---|---|---|---|
| MAT | 1.54 | 2.72 | 3 | 1.46 | 5.823 |
| CD | 1.64 | 2.50 | 5 | 3.36 | 28.358 |
| CU | 4.27 | 2.33 | 5 | 0.73 | 1.237 |
| MOR | 4.58 | 2.92 | 2 | 2.58 | 19.438 |
| PRO | 3.08 | 2.27 | 1 | 2.08 | 9.787 |
| COM | 2.21 | 1.22 | 1 | 1.21 | 1.774 |
| ZS | 4.15 | 1.41 | 5 | 0.85 | 1.018 |
| ONT_H | 3.76 | 2.05 | 2 | 1.76 | 6.340 |
| ONT_S | 3.15 | 1.45 | 3 | 0.15 | 0.032 |

**Total weighted sum-sq:** 73.807 · **total sal:** 18.87
**Distance:** 1.978 · **support:** 37.61 · **dys tier:** 4 (factor 0.60)
**Raw alignment (pre-dys):** -0.743 · **Final alignment:** -0.446

### vs Vichy France

| node | respPos | respSal | regimePos | posDiff | sal × diff² |
|---|---|---|---|---|---|
| MAT | 1.54 | 2.72 | 4 | 2.46 | 16.490 |
| CD | 1.64 | 2.50 | 5 | 3.36 | 28.358 |
| CU | 4.27 | 2.33 | 5 | 0.73 | 1.237 |
| MOR | 4.58 | 2.92 | 1 | 3.58 | 37.416 |
| PRO | 3.08 | 2.27 | 1 | 2.08 | 9.787 |
| COM | 2.21 | 1.22 | 1 | 1.21 | 1.774 |
| ZS | 4.15 | 1.41 | 5 | 0.85 | 1.018 |
| ONT_H | 3.76 | 2.05 | 1 | 2.76 | 15.603 |
| ONT_S | 3.15 | 1.45 | 5 | 1.85 | 4.960 |

**Total weighted sum-sq:** 116.644 · **total sal:** 18.87
**Distance:** 2.486 · **support:** 21.32 · **dys tier:** 4 (factor 0.60)
**Raw alignment (pre-dys):** -1.721 · **Final alignment:** -1.032

### vs Austrofascism/Anschluss

| node | respPos | respSal | regimePos | posDiff | sal × diff² |
|---|---|---|---|---|---|
| MAT | 1.54 | 2.72 | 4 | 2.46 | 16.490 |
| CD | 1.64 | 2.50 | 5 | 3.36 | 28.358 |
| CU | 4.27 | 2.33 | 5 | 0.73 | 1.237 |
| MOR | 4.58 | 2.92 | 1 | 3.58 | 37.416 |
| PRO | 3.08 | 2.27 | 1 | 2.08 | 9.787 |
| COM | 2.21 | 1.22 | 1 | 1.21 | 1.774 |
| ZS | 4.15 | 1.41 | 5 | 0.85 | 1.018 |
| ONT_H | 3.76 | 2.05 | 1 | 2.76 | 15.603 |
| ONT_S | 3.15 | 1.45 | 5 | 1.85 | 4.960 |

**Total weighted sum-sq:** 116.644 · **total sal:** 18.87
**Distance:** 2.486 · **support:** 21.32 · **dys tier:** 4 (factor 0.60)
**Raw alignment (pre-dys):** -1.721 · **Final alignment:** -1.032

### vs Orban's Hungary

| node | respPos | respSal | regimePos | posDiff | sal × diff² |
|---|---|---|---|---|---|
| MAT | 1.54 | 2.72 | 3 | 1.46 | 5.823 |
| CD | 1.64 | 2.50 | 5 | 3.36 | 28.358 |
| CU | 4.27 | 2.33 | 4 | 0.27 | 0.173 |
| MOR | 4.58 | 2.92 | 2 | 2.58 | 19.438 |
| PRO | 3.08 | 2.27 | 2 | 1.08 | 2.631 |
| COM | 2.21 | 1.22 | 1 | 1.21 | 1.774 |
| ZS | 4.15 | 1.41 | 4 | 0.15 | 0.032 |
| ONT_H | 3.76 | 2.05 | 1 | 2.76 | 15.603 |
| ONT_S | 3.15 | 1.45 | 4 | 0.85 | 1.048 |

**Total weighted sum-sq:** 74.879 · **total sal:** 18.87
**Distance:** 1.992 · **support:** 37.08 · **dys tier:** 3 (factor 0.80)
**Raw alignment (pre-dys):** -0.775 · **Final alignment:** -0.620


---

## C — Customary Localist (fascist)

runId: 4901f789-e3bd-4985-badd-3bb6385dff39

Posterior: MAT=2.85(sal 1.67), CD=4.42(sal 2.94), CU=1.03(sal 2.97), MOR=1.32(sal 2.85), PRO=1.58(sal 2.49), COM=1.96(sal 1.50), ZS=3.71(sal 1.98), ONT_H=2.51(sal 2.66), ONT_S=2.73(sal 1.98)

### vs Nazi Germany

| node | respPos | respSal | regimePos | posDiff | sal × diff² |
|---|---|---|---|---|---|
| MAT | 2.85 | 1.67 | 3 | 0.15 | 0.037 |
| CD | 4.42 | 2.94 | 5 | 0.58 | 0.991 |
| CU | 1.03 | 2.97 | 5 | 3.97 | 46.741 |
| MOR | 1.32 | 2.85 | 1 | 0.32 | 0.292 |
| PRO | 1.58 | 2.49 | 1 | 0.58 | 0.829 |
| COM | 1.96 | 1.50 | 1 | 0.96 | 1.381 |
| ZS | 3.71 | 1.98 | 5 | 1.29 | 3.278 |
| ONT_H | 2.51 | 2.66 | 1 | 1.51 | 6.070 |
| ONT_S | 2.73 | 1.98 | 2 | 0.73 | 1.053 |

**Total weighted sum-sq:** 60.672 · **total sal:** 21.04
**Distance:** 1.698 · **support:** 48.63 · **dys tier:** 5 (factor 0.35)
**Raw alignment (pre-dys):** -0.082 · **Final alignment:** -0.029

### vs Fascist Italy

| node | respPos | respSal | regimePos | posDiff | sal × diff² |
|---|---|---|---|---|---|
| MAT | 2.85 | 1.67 | 3 | 0.15 | 0.037 |
| CD | 4.42 | 2.94 | 5 | 0.58 | 0.991 |
| CU | 1.03 | 2.97 | 5 | 3.97 | 46.741 |
| MOR | 1.32 | 2.85 | 2 | 0.68 | 1.318 |
| PRO | 1.58 | 2.49 | 1 | 0.58 | 0.829 |
| COM | 1.96 | 1.50 | 1 | 0.96 | 1.381 |
| ZS | 3.71 | 1.98 | 5 | 1.29 | 3.278 |
| ONT_H | 2.51 | 2.66 | 2 | 0.51 | 0.693 |
| ONT_S | 2.73 | 1.98 | 3 | 0.27 | 0.144 |

**Total weighted sum-sq:** 55.412 · **total sal:** 21.04
**Distance:** 1.623 · **support:** 51.77 · **dys tier:** 4 (factor 0.60)
**Raw alignment (pre-dys):** 0.106 · **Final alignment:** 0.064

### vs Vichy France

| node | respPos | respSal | regimePos | posDiff | sal × diff² |
|---|---|---|---|---|---|
| MAT | 2.85 | 1.67 | 4 | 1.15 | 2.201 |
| CD | 4.42 | 2.94 | 5 | 0.58 | 0.991 |
| CU | 1.03 | 2.97 | 5 | 3.97 | 46.741 |
| MOR | 1.32 | 2.85 | 1 | 0.32 | 0.292 |
| PRO | 1.58 | 2.49 | 1 | 0.58 | 0.829 |
| COM | 1.96 | 1.50 | 1 | 0.96 | 1.381 |
| ZS | 3.71 | 1.98 | 5 | 1.29 | 3.278 |
| ONT_H | 2.51 | 2.66 | 1 | 1.51 | 6.070 |
| ONT_S | 2.73 | 1.98 | 5 | 2.27 | 10.192 |

**Total weighted sum-sq:** 71.975 · **total sal:** 21.04
**Distance:** 1.850 · **support:** 42.52 · **dys tier:** 4 (factor 0.60)
**Raw alignment (pre-dys):** -0.449 · **Final alignment:** -0.269

### vs Austrofascism/Anschluss

| node | respPos | respSal | regimePos | posDiff | sal × diff² |
|---|---|---|---|---|---|
| MAT | 2.85 | 1.67 | 4 | 1.15 | 2.201 |
| CD | 4.42 | 2.94 | 5 | 0.58 | 0.991 |
| CU | 1.03 | 2.97 | 5 | 3.97 | 46.741 |
| MOR | 1.32 | 2.85 | 1 | 0.32 | 0.292 |
| PRO | 1.58 | 2.49 | 1 | 0.58 | 0.829 |
| COM | 1.96 | 1.50 | 1 | 0.96 | 1.381 |
| ZS | 3.71 | 1.98 | 5 | 1.29 | 3.278 |
| ONT_H | 2.51 | 2.66 | 1 | 1.51 | 6.070 |
| ONT_S | 2.73 | 1.98 | 5 | 2.27 | 10.192 |

**Total weighted sum-sq:** 71.975 · **total sal:** 21.04
**Distance:** 1.850 · **support:** 42.52 · **dys tier:** 4 (factor 0.60)
**Raw alignment (pre-dys):** -0.449 · **Final alignment:** -0.269

### vs Orban's Hungary

| node | respPos | respSal | regimePos | posDiff | sal × diff² |
|---|---|---|---|---|---|
| MAT | 2.85 | 1.67 | 3 | 0.15 | 0.037 |
| CD | 4.42 | 2.94 | 5 | 0.58 | 0.991 |
| CU | 1.03 | 2.97 | 4 | 2.97 | 26.138 |
| MOR | 1.32 | 2.85 | 2 | 0.68 | 1.318 |
| PRO | 1.58 | 2.49 | 2 | 0.42 | 0.446 |
| COM | 1.96 | 1.50 | 1 | 0.96 | 1.381 |
| ZS | 3.71 | 1.98 | 4 | 0.29 | 0.162 |
| ONT_H | 2.51 | 2.66 | 1 | 1.51 | 6.070 |
| ONT_S | 2.73 | 1.98 | 4 | 1.27 | 3.191 |

**Total weighted sum-sq:** 39.734 · **total sal:** 21.04
**Distance:** 1.374 · **support:** 62.37 · **dys tier:** 3 (factor 0.80)
**Raw alignment (pre-dys):** 0.742 · **Final alignment:** 0.594

