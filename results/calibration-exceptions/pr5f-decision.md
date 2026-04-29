# PR 5.F decision — ONT_S audit shipped, σ/AES scorer variant rejected

Date: 2026-04-29

## What shipped (Option A)

Targeted ONT_S audit on 15 liberal-democracy regime entries previously coded
ONT_S=1–3 when their political form is plainly institutionalist. Same
conservative bar as PR5's CU sweep — only obvious errors, defer interpretive
cases.

| regime | ONT_S before → after |
|---|---|
| Sweden / Folkhem Peak (1946–1975) | 1 → 5 |
| Switzerland / Magic Formula Era (1946–1990) | 1 → 5 |
| Japan / High Growth (1960–1989) | 1 → 5 |
| Germany / West Germany / Bonn Republic (1949–1989) | 2 → 4 |
| Germany / Reunified Germany (1990–2026) | 2 → 4 |
| Netherlands / Reconstruction/Consensus (1946–1965) | 2 → 4 |
| Austria / Second Republic Consensus (1945–1986) | 2 → 4 |
| USA / Cold War Consensus (1953–1968) | 2 → 4 |
| Switzerland / Modern Switzerland (2011–2026) | 2 → 4 |
| Belgium / Federal Belgium (1993–2010) | 2 → 4 |
| Canada / Quiet Revolution/Trudeau Sr. (1957–1983) | 2 → 4 |
| Canada / Mulroney/Chretien (1984–2005) | 2 → 4 |
| Sweden / Neoliberal Turn (1976–2005) | 2 → 4 |
| Spain / PSOE/PP Democracy (1983–2007) | 2 → 4 |
| United Kingdom / New Labour/Blair (1991–2009) | 2 → 4 |

**Why these.** The encoder appears to have read ONT_S as "centralized
state-as-actor" / "totalitarian state machinery" rather than "do institutions
matter / are they respected." Folkhem Peak coded ONT_S=1 (no institutions
matter) is impossible to reconcile with the most extensive welfare state in
history. Same logic for Bonn Basic Law, Magic Formula Switzerland's
formalized power-sharing, postwar Japan's MITI/LDP institutional architecture.

**Outcome.** Inst Leftist (Sam authentic posterior) alignments fixed:

| pair | pre-audit | post-audit |
|---|---|---|
| A × Folkhem Peak | -0.28 | +1.14 |
| A × Bonn Republic | +0.63 | +1.50 |
| A × Modern Switzerland | +0.41 | +1.23 |
| A × Cold War Consensus | +1.11 | +2.05 |

These were all substantively-aligned regimes that the bad coding had pushed
into "moderate-positive" or "negative" territory. The audit fixes them.

**Residual.** A × Orbán's Hungary improved from -0.02 (PR5 baseline) to
-0.44 (post-audit) but still misses the AC4 strong-negative threshold of
-0.5 by 0.06. This is the form-vs-valence problem on ONT_S — Sam's
institutional-respect ONT_S~4.5 and Orbán's institutional-capture ONT_S=4
look identical to the geometric scorer. Logged as 5.F-unresolved.

## What did NOT ship (Option D rejected)

A scorer variant was tested that drops ZS and ONT_H, adds AES via
lock-and-key, and tightens σ from 2.0 to 1.765. It would have closed the
A × Orbán gap (to -0.53 with marginal Folkhem cost). Rejected after broad
regression check.

**Diagnostic evidence kept** in:
- `pr5f-aes-readonly.md` — AES distribution analysis on three retake archetypes
- `pr5f-sweep.md` — variant matrix (9 candidates × 3 archetypes × 20 regimes)
- `pr5f-regression.md` — broad regression: 124 archetypes × 401 regimes under
  current vs Option D

**Why rejected.** Option D was not a surgical fix. From pr5f-regression.md:

| metric | result |
|---|---|
| Top-1 stability | 46/124 = 37% (63% of archetypes get a different best-regime) |
| Top-3 perfect-overlap | 16/124 = 13% |
| Top-5 stable (5 of 5) | 7/124 = 5.6% |
| Mean alignment shift | -0.37 → -0.83 (Δ -0.46 across all 49,724 cells) |
| Sign-flips pos→neg | 5,236 cells (10.5%) |
| p95 (strong-positive) | 1.80 → 1.37 (top matches compressed) |

Option D fixes A × Orbán by ~0.8 points but at the cost of globally
rescaling every alignment 0.46 units more negative on average. That is a
new calibration regime, not a precision fix. Substantively-good matches
drop into "barely positive" territory and 10.5% of cells flip sign. The
blast radius is too large for the marginal benefit.

## Next steps logged

1. **TRB_ANCHOR 9-vs-7 drift fix.** `src/types.ts:103` declares 9 anchors
   (national, ideological, religious, class, ethnic_racial, gender, sexual,
   global, mixed_none); `src/engine/math.ts:25` uses the correct 9-anchor
   order; but `src/config/categories.ts:21` still exports 7 anchors (missing
   gender, sexual). Inline 7-anchor types also exist at
   `src/engine/update.ts:337` and `:419`. Standalone fix, prereq for any
   MOR/TRB architectural work.

2. **MOR/TRB categorical-collapse ADR.** Replace continuous MOR + continuous
   TRB + categorical TRB_ANCHOR with: MOR_TYPE (categorical distribution
   over 6 buckets — national, ethnic_racial, religious, class, ideological,
   gender) + MOR_INTENSITY (continuous scalar). Universal is implicit (low
   concentration). Tribalism is derived (intensity × concentration), not a
   node. This is the cleaner architecture-side resolution to the form-vs-
   valence problem. Multi-PR refactor — defer until calibration is stable.

3. **EPS/AES full-ranking improvement.** Independent of the MOR/TRB
   refactor — replace best/worst Q89 + Q218 with full 6-rank priority sort
   for sharper categorical input. Ships standalone whenever convenient.
