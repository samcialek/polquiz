# PR 5 — acceptance summary

Date: 2026-04-29

Three independent fixes shipped together:

- **5.D asymmetric dysfunction.** `src/global/build-alignment.ts` and `results-live.html`'s `buildPersonalAlignments`. Compress positive alignment only. Negative alignment stays at full magnitude.
- **5.C obvious-case CU sweep.** Recoded `CU: 5 → 1` on 18 forced-uniformity regimes (Nazi Germany, Fascist Italy, Vichy France, Austrofascism, WWII Polish/Czech/Dutch occupation, Royal Dictatorship Romania, Stalin USSR, East Germany/DDR, Stalinist Poland/Hungary/Czechoslovakia, Communist Romania, Ceaușescu, Mao Early/Radical, Saddam Hussein). All clearly totalitarian or wartime-occupation regimes where the CU=5 (mostly-pluralist) coding directly contradicted regime semantic.
- **5.G Orbán recoding.** `src/global/jurisdictions-europe2.ts`: `CU: 4 → 2`, `MOR: 2 → 1`. ONT_S left at 4 — the "uses institutions" form-vs-valence problem is deferred to 5.F.

## Acceptance test (live-map, respondent-posterior numbers)

| archetype × regime | pre-PR5 | post-PR5 | target | hit |
|---|---|---|---|---|
| 056 IL × Nazi Germany | -0.486 | **-1.486** | strong-neg | ✓ |
| 056 IL × Orban's Hungary | -0.016 | **-0.442** | strong-neg | ⚠ moderate — 5.F |
| 085 CL × Nazi Germany | -0.029 | **+0.730** | flipped to positive | ✓ direction; capped by dys |
| 085 CL × Orban's Hungary | +0.594 | **+1.600** | ≥ +1.6 | ✓ exact |
| 134 PCN × Orban's Hungary | -0.620 | -1.502 | strong-neg (bonus) | ✓ |
| 085 CL × Fascist Italy | +0.064 | +1.447 | strong-pos (bonus) | ✓ |

**Note on C × Nazi at +0.730.** Raw alignment is +2.084 — strong ideological affinity.
The visible score is capped to +0.730 by the intentional asymmetric dysfunction
rule (Nazi Germany dys=5 → factor 0.35). This reads correctly under "would you
thrive there" semantics: even a fascist would not thrive in a regime that loses
a world war and ends in ruin. It does NOT read correctly under "ideological
affinity" semantics: +2.084 is the right number for that question. The split is
exactly the affinity-vs-resemblance distinction 5.F is meant to address.
Logged here so future-readers don't mistake the +0.73 for a weak match — the
underlying match is strong, the dysfunction multiplier is doing intended work.

## Attribution per fix

Reading the per-node breakdowns in `pr5-diagnostic-baseline.md` and `pr5-diagnostic-postfix.md`:

- **C × Nazi flip**: dominated by the CU=5→1 fix on Nazi Germany. The pre-fix sumSq had a 47-unit contribution from `CU 1.03 vs 5`; post-fix that drops to ~0.003. Distance 1.70 → 0.81. This is 5.C alone.
- **C × Orbán hits +1.60**: dominated by the Orbán CU=4→2 fix. Pre-fix sumSq had 26.1 from `CU 1.03 vs 4`; post-fix 3.2 from `CU 1.03 vs 2`. Distance 1.37 → 0.85. Asymmetric dysfunction does not fire on positive alignment for tier 3 (still 0.80 multiplier on positives), so this is 5.G alone.
- **A × Nazi from -0.49 to -1.49**: dominated by 5.D. Raw alignment was -1.39 baseline, compressed by 0.35 dysFactor to -0.49. With asymmetric, the negative passes through unmodified at -1.49 (small change from -1.39 because Nazi Germany's other node values shifted slightly with the regenerated CSV path).
- **A × Orbán from -0.02 to -0.44**: 5.G CU 4→2 widens posDiff on CU; 5.G MOR 2→1 widens posDiff on MOR; 5.D doesn't fire (alignment is negative, no compression to remove). Net distance 1.67 → 1.85, raw -0.02 → -0.44. The remaining ~75% of the gap to "strong negative" is the ONT_S form-vs-valence issue (5.F).

## Next step

The 5.F architectural decision now has a clean canonical test case: 056 Inst Leftist × Orbán's Hungary should be strongly negative, but our scorer can only get to -0.44 because Sam's institutionalism (ONT_S=4.49) and Orbán's institutional capture (ONT_S=4) look identical to the form-distance scorer. Defer 5.F to its own design pass.

## Files

- Source edits: `src/global/jurisdictions-europe1.ts`, `jurisdictions-europe2.ts`, `jurisdictions-asia.ts`, `jurisdictions-mena.ts`, `src/global/build-alignment.ts`
- Live-map: `results-live.html` (asymmetric dysfunction, gold-outline + tooltip filter, cluster banner cap-2)
- New pipeline step: `scripts/merge-regime-nodes.cjs` — run after `merge-dysfunction-codes.cjs` to bake `nodes:{}` into each era of `output/live-data/regimes.json` (this had been missing from the build pipeline; the previous regimes.json's nodes were a stale artifact)
- Diagnostics: `pr5-diagnostic-baseline.md`, `pr5-diagnostic-postfix.md`
