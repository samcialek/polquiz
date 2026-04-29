# PR 5.F sweep — variant matrix + acceptance criteria

Date: 2026-04-29

Read-only diagnostic. No changes to live scorer. Variant 1 (`current`) reproduces what's live today.

## Variant definitions

| label | nodes | σ | AES | AES scale |
|---|---|---|---|---|
| current | MAT/CD/CU/MOR/PRO/COM/ZS/ONT_H/ONT_S | 2 | no | — |
| new σ2.0 s2 | MAT/CD/CU/MOR/PRO/COM/ONT_S | 2 | yes | 2 |
| new σ2.0 s3 | MAT/CD/CU/MOR/PRO/COM/ONT_S | 2 | yes | 3 |
| new σ1.75 s2 | MAT/CD/CU/MOR/PRO/COM/ONT_S | 1.75 | yes | 2 |
| new σ1.75 s3 | MAT/CD/CU/MOR/PRO/COM/ONT_S | 1.75 | yes | 3 |
| new σ1.5 s2 | MAT/CD/CU/MOR/PRO/COM/ONT_S | 1.5 | yes | 2 |
| new σ1.5 s3 | MAT/CD/CU/MOR/PRO/COM/ONT_S | 1.5 | yes | 3 |
| new σ1.3 s2 | MAT/CD/CU/MOR/PRO/COM/ONT_S | 1.3 | yes | 2 |
| new σ1.3 s3 | MAT/CD/CU/MOR/PRO/COM/ONT_S | 1.3 | yes | 3 |


---

## A — Inst Leftist (authentic)

| regime | bucket | current | new σ2.0 s2 | new σ2.0 s3 | new σ1.75 s2 | new σ1.75 s3 | new σ1.5 s2 | new σ1.5 s3 | new σ1.3 s2 | new σ1.3 s3 |
|---|---|---|---|---|---|---|---|---|---|---|
| West Germany/Bonn Republic (1949) | liberal-democracy | 1.50 | 1.05 | 0.51 | 0.59 | -0.02 | -0.02 | -0.69 | -0.63 | -1.31 |
| Folkhem Peak (1946) | liberal-democracy | 1.19 | 0.96 | 0.45 | 0.49 | -0.08 | -0.13 | -0.75 | -0.75 | -1.38 |
| Modern Switzerland (2011) | liberal-democracy | 1.23 | 0.78 | 0.27 | 0.28 | -0.28 | -0.36 | -0.96 | -0.99 | -1.57 |
| Attlee/Consensus (1946) | liberal-democracy | 2.18 | 1.57 | 0.96 | 1.21 | 0.49 | 0.71 | -0.13 | 0.16 | -0.75 |
| Stalin (1929) | totalitarian | -0.67 | -0.51 | -0.83 | -1.10 | -1.41 | -1.74 | -2.01 | -2.25 | -2.46 |
| Mao Radical (1958) | totalitarian | 0.02 | 0.02 | -0.34 | -0.52 | -0.93 | -1.20 | -1.59 | -1.79 | -2.13 |
| Nazi Germany (1933) | totalitarian | -1.49 | -1.15 | -1.39 | -1.71 | -1.93 | -2.26 | -2.42 | -2.63 | -2.73 |
| Fascist Italy (1922) | totalitarian | -0.69 | -0.53 | -0.85 | -1.12 | -1.43 | -1.76 | -2.03 | -2.27 | -2.47 |
| Orban's Hungary (2010) | modern-illiberal | -0.44 | 0.00 | -0.38 | -0.57 | -0.97 | -1.25 | -1.63 | -1.83 | -2.16 |
| Putin Era (2000) | modern-illiberal | -0.76 | -0.17 | -0.53 | -0.75 | -1.12 | -1.42 | -1.76 | -1.98 | -2.27 |
| Erdogan Era (2002) | modern-illiberal | 0.14 | 0.17 | -0.23 | -0.39 | -0.82 | -1.07 | -1.49 | -1.67 | -2.04 |
| PiS Poland (1998) | modern-illiberal | 1.49 | 1.06 | 0.54 | 0.60 | 0.01 | -0.01 | -0.65 | -0.62 | -1.28 |
| Modi Era (2014) | modern-illiberal | -0.16 | -0.17 | -0.53 | -0.75 | -1.12 | -1.42 | -1.76 | -1.98 | -2.27 |
| New Deal/WWII (1933) | us-eras | 2.53 | 1.96 | 1.33 | 1.74 | 0.97 | 1.42 | 0.48 | 1.05 | -0.05 |
| Cold War Consensus (1953) | us-eras | 2.05 | 1.49 | 0.92 | 1.16 | 0.49 | 0.71 | -0.08 | 0.21 | -0.70 |
| Polarization Era (2008) | us-eras | 1.12 | 1.27 | 0.80 | 0.99 | 0.43 | 0.59 | -0.08 | 0.15 | -0.70 |
| Fifth Republic Modern (1981) | mid-functional | 1.57 | 1.11 | 0.56 | 0.66 | 0.04 | 0.07 | -0.62 | -0.54 | -1.25 |
| Netanyahu/Right Turn (2001) | mid-functional | -0.69 | -0.06 | -0.44 | -0.64 | -1.03 | -1.31 | -1.68 | -1.89 | -2.20 |
| Yeltsin (1992) | failed-chaotic | -0.00 | -0.00 | -0.40 | -0.58 | -0.99 | -1.25 | -1.65 | -1.84 | -2.17 |
| Maduro (2013) | failed-chaotic | 0.09 | 0.21 | 0.05 | 0.03 | -0.42 | -0.58 | -1.10 | -1.20 | -1.70 |


---

## B — Progressive Civic Nat (tankie)

| regime | bucket | current | new σ2.0 s2 | new σ2.0 s3 | new σ1.75 s2 | new σ1.75 s3 | new σ1.5 s2 | new σ1.5 s3 | new σ1.3 s2 | new σ1.3 s3 |
|---|---|---|---|---|---|---|---|---|---|---|
| West Germany/Bonn Republic (1949) | liberal-democracy | 0.44 | 0.32 | -0.07 | -0.23 | -0.65 | -0.91 | -1.32 | -1.52 | -1.90 |
| Folkhem Peak (1946) | liberal-democracy | 0.45 | 0.80 | 0.35 | 0.30 | -0.20 | -0.34 | -0.88 | -0.97 | -1.49 |
| Modern Switzerland (2011) | liberal-democracy | 0.15 | -0.18 | -0.51 | -0.76 | -1.10 | -1.43 | -1.75 | -2.00 | -2.25 |
| Attlee/Consensus (1946) | liberal-democracy | 1.45 | 1.32 | 0.81 | 0.91 | 0.32 | 0.35 | -0.32 | -0.24 | -0.95 |
| Stalin (1929) | totalitarian | -0.99 | -1.17 | -1.40 | -1.73 | -1.93 | -2.27 | -2.43 | -2.64 | -2.74 |
| Mao Radical (1958) | totalitarian | -0.98 | -1.24 | -1.46 | -1.79 | -1.99 | -2.32 | -2.47 | -2.67 | -2.76 |
| Nazi Germany (1933) | totalitarian | -1.88 | -1.89 | -2.03 | -2.34 | -2.45 | -2.70 | -2.77 | -2.89 | -2.92 |
| Fascist Italy (1922) | totalitarian | -1.35 | -1.53 | -1.71 | -2.04 | -2.19 | -2.51 | -2.61 | -2.78 | -2.84 |
| Orban's Hungary (2010) | modern-illiberal | -1.50 | -1.50 | -1.69 | -2.02 | -2.18 | -2.49 | -2.60 | -2.78 | -2.84 |
| Putin Era (2000) | modern-illiberal | -1.07 | -1.00 | -1.25 | -1.57 | -1.80 | -2.15 | -2.33 | -2.55 | -2.67 |
| Erdogan Era (2002) | modern-illiberal | -0.82 | -1.03 | -1.28 | -1.60 | -1.82 | -2.17 | -2.35 | -2.57 | -2.69 |
| PiS Poland (1998) | modern-illiberal | 0.43 | 0.07 | -0.31 | -0.50 | -0.90 | -1.18 | -1.56 | -1.78 | -2.11 |
| Modi Era (2014) | modern-illiberal | -0.79 | -1.00 | -1.25 | -1.57 | -1.80 | -2.15 | -2.33 | -2.55 | -2.67 |
| New Deal/WWII (1933) | us-eras | 1.84 | 1.45 | 0.96 | 1.12 | 0.54 | 0.65 | -0.03 | 0.15 | -0.64 |
| Cold War Consensus (1953) | us-eras | 1.25 | 0.87 | 0.45 | 0.44 | -0.05 | -0.15 | -0.72 | -0.77 | -1.34 |
| Polarization Era (2008) | us-eras | 0.79 | 0.64 | 0.26 | 0.24 | -0.22 | -0.34 | -0.90 | -0.97 | -1.51 |
| Fifth Republic Modern (1981) | mid-functional | 1.84 | 1.49 | 0.96 | 1.11 | 0.49 | 0.58 | -0.13 | 0.02 | -0.75 |
| Netanyahu/Right Turn (2001) | mid-functional | -1.00 | -0.93 | -1.18 | -1.50 | -1.74 | -2.09 | -2.28 | -2.51 | -2.65 |
| Yeltsin (1992) | failed-chaotic | -0.24 | -0.44 | -0.73 | -1.03 | -1.32 | -1.68 | -1.94 | -2.20 | -2.40 |
| Maduro (2013) | failed-chaotic | -0.08 | -0.26 | -0.60 | -0.84 | -1.18 | -1.51 | -1.82 | -2.06 | -2.31 |


---

## C — Customary Localist (fascist)

| regime | bucket | current | new σ2.0 s2 | new σ2.0 s3 | new σ1.75 s2 | new σ1.75 s3 | new σ1.5 s2 | new σ1.5 s3 | new σ1.3 s2 | new σ1.3 s3 |
|---|---|---|---|---|---|---|---|---|---|---|
| West Germany/Bonn Republic (1949) | liberal-democracy | -0.96 | -1.26 | -1.50 | -1.81 | -2.02 | -2.33 | -2.49 | -2.68 | -2.77 |
| Folkhem Peak (1946) | liberal-democracy | -2.22 | -2.18 | -2.30 | -2.56 | -2.64 | -2.83 | -2.87 | -2.95 | -2.96 |
| Modern Switzerland (2011) | liberal-democracy | -0.32 | -0.79 | -1.10 | -1.37 | -1.66 | -1.98 | -2.22 | -2.44 | -2.60 |
| Attlee/Consensus (1946) | liberal-democracy | -0.44 | -0.60 | -0.93 | -1.19 | -1.51 | -1.82 | -2.10 | -2.32 | -2.52 |
| Stalin (1929) | totalitarian | 0.73 | 0.74 | 0.71 | 0.48 | 0.45 | 0.14 | 0.10 | -0.37 | -0.44 |
| Mao Radical (1958) | totalitarian | 0.15 | 0.40 | 0.38 | 0.25 | 0.23 | 0.04 | 0.02 | -0.50 | -0.57 |
| Nazi Germany (1933) | totalitarian | 0.73 | 0.91 | 0.88 | 0.87 | 0.84 | 0.80 | 0.76 | 0.73 | 0.68 |
| Fascist Italy (1922) | totalitarian | 1.45 | 1.55 | 1.51 | 1.48 | 1.43 | 1.37 | 1.30 | 1.24 | 1.15 |
| Orban's Hungary (2010) | modern-illiberal | 1.60 | 1.81 | 1.76 | 1.65 | 1.59 | 1.41 | 1.33 | 1.13 | 1.03 |
| Putin Era (2000) | modern-illiberal | 0.64 | 0.86 | 0.81 | 0.37 | 0.32 | -0.27 | -0.32 | -0.89 | -0.95 |
| Erdogan Era (2002) | modern-illiberal | 2.46 | 2.41 | 2.35 | 2.24 | 2.16 | 1.99 | 1.89 | 1.70 | 1.57 |
| PiS Poland (1998) | modern-illiberal | 1.83 | 1.77 | 1.71 | 1.45 | 1.38 | 0.99 | 0.91 | 0.49 | 0.39 |
| Modi Era (2014) | modern-illiberal | 0.82 | 0.68 | 0.65 | 0.29 | 0.25 | -0.27 | -0.32 | -0.89 | -0.95 |
| New Deal/WWII (1933) | us-eras | 0.08 | -0.22 | -0.60 | -0.80 | -1.19 | -1.47 | -1.83 | -2.03 | -2.32 |
| Cold War Consensus (1953) | us-eras | -0.35 | -0.66 | -0.98 | -1.25 | -1.56 | -1.88 | -2.14 | -2.35 | -2.55 |
| Polarization Era (2008) | us-eras | 0.73 | 0.58 | 0.55 | 0.18 | 0.14 | -0.42 | -0.48 | -1.05 | -1.11 |
| Fifth Republic Modern (1981) | mid-functional | -0.85 | -1.27 | -1.51 | -1.82 | -2.03 | -2.34 | -2.50 | -2.69 | -2.78 |
| Netanyahu/Right Turn (2001) | mid-functional | 1.84 | 2.29 | 2.23 | 2.09 | 2.01 | 1.80 | 1.70 | 1.45 | 1.33 |
| Yeltsin (1992) | failed-chaotic | 0.01 | -0.47 | -0.79 | -1.05 | -1.37 | -1.70 | -1.98 | -2.22 | -2.44 |
| Maduro (2013) | failed-chaotic | 0.21 | 0.19 | 0.17 | 0.00 | -0.04 | -0.65 | -0.70 | -1.28 | -1.33 |


---

## Acceptance criteria summary

Definitions:
- **AC1**: C × Orban's Hungary > +0.5 (fascist play stays clearly positive)
- **AC2**: C × Nazi Germany > 0 (positive after dys cap)
- **AC3**: C × Fascist Italy > +0.5
- **AC4**: A × Orban's Hungary < -0.5 (Inst Leftist clearly opposes)
- **AC5**: B × Orban's Hungary < -0.5 (tankie play clearly opposes)
- **AC6**: A × {Folkhem Peak, Attlee, New Deal/WWII} all > +0.5
- **AC7**: A × fighter regimes average < 0

| variant | AC1 | AC2 | AC3 | AC4 | AC5 | AC6 | AC7 (avg) | passes? |
|---|---|---|---|---|---|---|---|---|
| current | ✓ | ✓ | ✓ | ✗ | ✓ | ✓ | ✓ (-0.07) | fail |
| new σ2.0 s2 | ✓ | ✓ | ✓ | ✗ | ✓ | ✓ | ✗ (0.07) | fail |
| new σ2.0 s3 | ✓ | ✓ | ✓ | ✗ | ✓ | ✗ | ✓ (-0.28) | fail |
| new σ1.75 s2 | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ✓ (-0.42) | fail |
| new σ1.75 s3 | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ✓ (-0.83) | fail |
| new σ1.5 s2 | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ✓ (-1.04) | fail |
| new σ1.5 s3 | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ✓ (-1.45) | fail |
| new σ1.3 s2 | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ✓ (-1.58) | fail |
| new σ1.3 s3 | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ✓ (-1.97) | fail |

---

## Recommendation

**No variant passes all 7 acceptance criteria.** Need to reconsider node set or thresholds.
