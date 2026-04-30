# PR 6.D — candidate + regime MOR_BOUNDARIES encoding (mechanical first pass)

Date: 2026-04-30

Per ADR-006 PR 6.D: additive encoding of all 141 historical candidate
profiles and all 401 regime entries with `morBoundaries` (7-vector +
intensity). Candidates also get `morMembership` (4 demographic categories
+ political_tribe label) where coded; regimes do **not** get membership
per ADR-006. **Mechanical first pass — holistic refinement deferred to
follow-up post-6.H.** Old MOR / TRB / PF fields kept; engine still reads
them through PR 6.E.

## Heuristic rubric

Same family as PR 6.C archetypes, in `scripts/pr6d-derive-mor-boundaries.mjs`:

```
intensity       = max((TRB.pos − 1) × 0.75, (PF.pos − 1) × 0.75, (ENG.pos − 1) × 0.5)
political_tribe = (PF.pos − 1) / 4
trb_activation  = (TRB.pos − 1) / 4

For each non-political-tribe boundary B:
  spec_B = 0..1 score derived from CD/CU/MAT/MOR/EPS/PF positions
  boundaries[B] = 0.05 + trb_activation × spec_B × 0.95
```

Per-boundary heuristic identical to PR 6.C. Candidates and regimes don't
have `MOR.sal` (it's a respondent/archetype-only concept), so intensity
falls back to TRB/PF/ENG-derived values. ENG is weighted weakest (0.5
multiplier vs 0.75 for TRB/PF) — engagement is necessary but not
sufficient for high moral-circle activation.

## Hard overrides

### Candidates (12 prominent named cases that landed)

Per ADR-006 examples and additional well-known coalition-organized
campaigns where heuristic derivation under-codes the political-coalition
shape. All entries listed below have a matching `name|year` in the
141-candidate dataset and were applied at injection time.

| candidate-year | dominant boundaries |
|---|---|
| Wallace 1968 | ethnic_racial 0.85, national 0.6, religious 0.3, political_tribe 0.7 |
| Trump 2016 / 2020 / 2024 | national 0.85, ethnic_racial 0.6, political_tribe 0.85+ |
| Obama 2008 / 2012 | national 0.5, ideological 0.4, political_tribe 0.5 |
| Kennedy 1960 | national 0.5, religious 0.5 (Catholic), political_tribe 0.5 |
| Reagan 1980 / 1984 | national 0.7, religious 0.5, political_tribe 0.6 |
| H. Clinton 2016 | gender 0.5, political_tribe 0.7, ideological 0.45 |
| Harris 2024 | gender 0.45, ethnic_racial 0.4, political_tribe 0.65 |
| Biden 2020 | national 0.45, religious 0.2 (Catholic), political_tribe 0.65 |
| Lincoln 1860 / 1864 | national 0.85+, ethnic_racial 0.55+, political_tribe 0.5 |

**Not coded in this pass:** Sanders 2016 / 2020 are primary-only —
they don't appear in the 141 general-election candidate dataset, so
overrides for them would be dead keys. The deriver script's unused-
override warning would surface them if a future contributor adds them
without a matching candidate entry. JFK is not a separate alias —
the candidate is named "Kennedy" in the data (1960). When primary-
only candidates get integrated in a future PR, Sanders coalition
encoding can be added then.

### Regimes (4 named cases per ADR-006)

| regime | encoding |
|---|---|
| Sweden / Folkhem Peak (1946) | class 0.6, national 0.4, ideological 0.4, intensity 2.5 |
| Germany / Nazi Germany (1933) | national 0.9, ethnic_racial 0.95, political_tribe 0.95, intensity 3.0 |
| Switzerland / Modern Switzerland (2011) | low-everywhere, political_tribe 0.15, intensity 1.5 |
| China / Mao Radical (1958) | class 0.85, ideological 0.95, political_tribe 0.95, intensity 3.0 |

## Demographic membership (candidates only)

27 of 141 candidates have explicit demographic membership coded —
prominent candidates where the data is widely known and Layer 2
lock-and-key would actually fire for typical respondents:

- All recent (1960+) major-party nominees with reliable demographic data
- Lincoln 1860/1864, FDR 1932-1944 (anchored historical examples)
- Wallace 1968 (ethnic-racial coalition test case)

Other 114 candidates have `morMembership` undefined / null. Layer 2
lock-and-key skips silently for those after PR 6.E cutover.

For ambiguous cases (Lincoln's specific religion, FDR's class origin),
fields are `null` rather than guessed.

**Not coded:** religious-coalition Layer 2 test cases (Bernie Jewish,
non-mainstream-Protestant candidates) deferred to a future pass that
also integrates primary-only candidates.

## Spot checks

| candidate / regime | nat | eth | rel | cls | ide | gen | ptrib | int | source |
|---|---|---|---|---|---|---|---|---|---|
| Trump 2016 | 0.85 | 0.60 | 0.20 | 0.15 | 0.40 | 0.20 | 0.85 | 3.0 | override |
| Obama 2008 | 0.50 | 0.20 | 0.15 | 0.20 | 0.40 | 0.10 | 0.50 | 2.5 | override |
| Kennedy 1960 | 0.50 | 0.20 | 0.50 | 0.25 | 0.35 | 0.10 | 0.50 | 2.5 | override |
| Reagan 1984 | 0.70 | 0.30 | 0.50 | 0.15 | 0.50 | 0.15 | 0.65 | 2.5 | override |
| Harris 2024 | 0.40 | 0.40 | 0.10 | 0.30 | 0.45 | 0.45 | 0.65 | 2.5 | override |
| H. Clinton 2016 | 0.40 | 0.30 | 0.10 | 0.30 | 0.45 | 0.50 | 0.70 | 2.5 | override |
| Carter 1976 | 0.05 | 0.05 | 0.05 | 0.29 | 0.10 | 0.07 | 0.50 | 1.5 | heuristic |
| Wallace 1968 | 0.60 | 0.85 | 0.30 | 0.20 | 0.30 | 0.10 | 0.70 | 3.0 | override |
| Folkhem Peak SE | 0.40 | 0.10 | 0.05 | 0.60 | 0.40 | 0.15 | 0.50 | 2.5 | override |
| Nazi Germany | 0.90 | 0.95 | 0.30 | 0.20 | 0.60 | 0.20 | 0.95 | 3.0 | override |
| Orbán's Hungary | 1.00 | 0.81 | 0.53 | 0.05 | 0.62 | 0.19 | 1.00 | 3.0 | heuristic |
| Modern Switzerland | 0.40 | 0.15 | 0.10 | 0.20 | 0.20 | 0.10 | 0.15 | 1.5 | override |
| West Germany Bonn | 0.09 | 0.05 | 0.05 | 0.05 | 0.15 | 0.06 | 0.75 | 2.25 | heuristic |
| Polarization Era US | 0.23 | 0.05 | 0.05 | 0.05 | 0.48 | 0.09 | 1.00 | 3.0 | heuristic |

## Known mechanical-pass weak spots

Documented for the holistic refinement pass that follows PR 6.H:

1. **Carter 1976 lands as low-intensity universalist** (intensity 1.5,
   all boundaries near 0.05). Real Carter was Southern-Baptist,
   peanut-farmer, Plains-Georgia identity-rich — the heuristic doesn't
   capture this because his TRB/PF are coded modest. Holistic pass
   should bump religious + class for him.
2. **Heuristic-derived candidates from 19th century get sparse
   non-political_tribe boundaries** because TRB.pos in those era
   profiles is often coded low-moderate. Era differences in how
   identity politics worked aren't captured by simple TRB scaling.
   Particularly affects Whigs, antebellum Democrats, Reconstruction-
   era candidates.
3. **Civic-nationalist / progressive-PF profiles undershoot national**
   (same limitation as PR 6.C archetypes). E.g., Wilson, Truman,
   Mondale — high-PF Democrats with progressive cultural views — get
   national ~0.12-0.23 when 0.4-0.5 might be more accurate.
4. **Religious coalition coding is sparse outside named overrides.**
   The EPS-traditionalist heuristic only fires at EPS=2; many religious-
   coalition candidates have EPS=1 (institutionalist) and don't trigger
   the +0.4 religious bump. Bryan, McKinley, Eisenhower-era candidates
   with strong religious identity coalitions get under-coded.
5. **Regime political_tribe coding is mechanical from PF.pos and may
   undershoot for single-party regimes** that the heuristic doesn't
   recognize. Worth a sweep in the holistic pass to ensure single-party
   states (USSR, Maoist China, modern China, etc.) read political_tribe
   ≥ 0.9.

## Files changed

- `src/historical/candidates.ts` — interface gained `morBoundaries?` +
  `morMembership?` fields; 52 candidate profiles got morBoundaries
  injected
- `src/historical/elections-1789-1852.ts`, `elections-1856-1888.ts`,
  `elections-1892-1916.ts`, `elections-1920-1936.ts` — 89 candidate
  profiles got morBoundaries injected
- `src/global/jurisdictions-europe1.ts` — `RegimePeriod` interface
  gained `morBoundaries?` field; 107 regime entries got morBoundaries
  injected
- `src/global/jurisdictions-europe2.ts`, `jurisdictions-americas.ts`,
  `jurisdictions-asia.ts`, `jurisdictions-mena.ts` — 294 regime
  entries got morBoundaries injected (73+90+80+51)
- `scripts/pr6d-derive-mor-boundaries.mjs` — derivation (reproducible;
  reads from dist, requires `npm run build` after src edits)
- `scripts/pr6d-inject-mor-boundaries.mjs` — text injection
  (idempotent; CRLF-aware; comma-aware)
- `scripts/pr6d-validate.mjs` — post-injection validation
- `results/calibration-exceptions/pr6d-mor-boundaries-derived.json`
- `results/calibration-exceptions/pr6d-encoding-notes.md` — this doc
- `dist/historical/*.{js,d.ts,js.map}` — regenerated
- `dist/global/jurisdictions-*.js` — regenerated

Engine still reads old MOR/TRB/PF fields — no runtime behavior change.
Cutover lands in PR 6.E.

## Validation summary

- All 141 candidate profiles have valid `morBoundaries` (7 boundaries
  in [0, 1] each, intensity in [0, 3])
- All 401 regime entries (in dist) have valid `morBoundaries`
- 27 of 141 candidates have `morMembership` populated (the prominent
  cases); the rest have `null` / undefined for that field
- 0 of 401 regimes have membership fields (correct — regimes don't get
  membership per ADR-006)
- `npm run build` passes
