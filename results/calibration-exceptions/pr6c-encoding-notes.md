# PR 6.C — archetype MOR_BOUNDARIES encoding (mechanical first pass)

Date: 2026-04-30

Per ADR-006 PR 6.C: additive re-encoding of all 124 archetypes (121 active +
3 deactivated kept for ID stability) with the new `morBoundaries` 7-vector +
`morIntensity` scalar. **Mechanical first pass — holistic refinement deferred
to follow-up post-6.H.** Old MOR / TRB / PF / TRB_ANCHOR fields kept; engine
still reads them through PR 6.D.

## Heuristic rubric

Implemented in `scripts/pr6c-derive-mor-boundaries.mjs`:

```
intensity = max(MOR.sal, (TRB.pos − 1) × 0.75, (PF.pos − 1) × 0.75)
political_tribe = (PF.pos − 1) / 4
trb_activation = (TRB.pos − 1) / 4

For each non-political-tribe boundary B:
  spec_B = 0..1 score derived from CD/CU/MAT/MOR/EPS/PF positions
  boundaries[B] = BASE_LOW + trb_activation × spec_B × (1 − BASE_LOW)
                  where BASE_LOW = 0.05
```

Per-boundary specificity heuristics:

| boundary | signature triggers |
|---|---|
| national | CD≥4 (+0.4) · CU≤2 (+0.3) · MOR≤2 (+0.3) · MOR≥4 (−0.1) · PF≥4 (+0.25) |
| ethnic_racial | CD=5 (+0.35) · CU=1 (+0.3) · MOR=1 (+0.3) · all-three-align (+0.15) · MOR≥4 (−0.4) |
| religious | CD≥4 (+0.3) · CU≤2 (+0.2) · EPS-traditionalist-dominant (+0.4) |
| class | MAT≤2 (+0.5) · MAT=1 + ZS≥4 (+0.2) · MAT≤2 + CD≤2 (+0.1) |
| ideological | baseline 0.10 · PF≥4 (+0.3) · COM=1 (+0.2) · extreme-on-MAT-and-CD (+0.15) |
| gender | baseline 0.05 · MOR=1 + CD=5 (+0.10) — minimal without TRB_ANCHOR data |

Identity-primary archetypes (141-146) get **explicit overrides** per ADR-006
since their continuous signatures are structurally identical (all MOR=3 sal=0,
TRB=5, PF=5) — heuristic derivation cannot distinguish them.

## Spot-check results

| id | archetype | nat | eth | rel | cls | ide | gen | ptrib | int |
|---|---|---|---|---|---|---|---|---|---|
| 056 | Inst Leftist (Sam authentic) | 0.12 | 0.05 | 0.05 | 0.19 | 0.11 | 0.06 | 0.50 | 3.0 |
| 011 | Jacobin Egalitarian | 0.05 | 0.05 | 0.05 | 0.43 | 0.26 | 0.07 | 0.25 | 2.0 |
| 088 | Gentle Traditionalist | 0.28 | 0.05 | 0.22 | 0.05 | 0.15 | 0.06 | 0.75 | 2.25 |
| 084 | Civilizational Conservative | 0.95 | 0.67 | 0.91 | 0.05 | 0.43 | 0.10 | 0.75 | 3.0 |
| 110 | Principled Abstainer | 0.05 | 0.05 | 0.05 | 0.05 | 0.12 | 0.06 | 0.25 | 3.0 |
| 022 | Pluralist Universalist | 0.05 | 0.05 | 0.05 | 0.19 | 0.07 | 0.06 | 0.25 | 2.0 |
| 134 | Progressive Civic Nationalist | 0.12 | 0.05 | 0.05 | 0.34 | 0.24 | 0.07 | 1.00 | 3.0 |
| 085 | Customary Localist | 0.29 | 0.24 | 0.26 | 0.05 | 0.15 | 0.06 | 0.75 | 2.25 |
| 116 | Quiet Middle | 0.05 | 0.05 | 0.05 | 0.05 | 0.07 | 0.06 | 0.50 | 2.0 |
| 092 | Partisan Tribalist | 1.00 | 0.48 | 0.53 | 0.05 | 0.43 | 0.10 | 1.00 | 3.0 |
| 141 | Black Voter (override) | 0.35 | 0.90 | 0.30 | 0.40 | 0.30 | 0.15 | 0.65 | 3.0 |
| 142 | White Grievance Voter (override) | 0.65 | 0.90 | 0.35 | 0.30 | 0.40 | 0.30 | 0.70 | 3.0 |
| 145 | Feminist Voter (override) | 0.25 | 0.25 | 0.10 | 0.30 | 0.50 | 0.85 | 0.55 | 3.0 |

Reads:

- **110 Principled Abstainer** correctly captures the active-universalism case
  Sam wanted: all boundaries near 0.05 + intensity 3.0 → high
  universalismScore (= 3.0 × (1 − 0.12) = 2.64), low boundednessScore.
- **116 Quiet Middle** captures the low-non-party / moderate-party-fusion
  case: non-party boundaries all near 0.05, but political_tribe=0.50 (modest
  party-team activation, derived from PF) and intensity=2.0. Reads as
  someone who isn't bounded by ethnic / religious / class / etc. identity
  politics but still has some default party-team belonging — not pure
  indifference.
- **084 Civilizational Conservative** registers as hyper-bounded across
  multiple identity axes (national 0.95, religious 0.91, ethnic 0.67) —
  matches the archetype's signature.
- **011 Jacobin Egalitarian** lands class-anchored with low partisan fusion
  (political_tribe 0.25) — matches the revolutionary-leftist-with-anti-
  establishment-posture reading.
- Identity-primary overrides preserve the demographic-anchor profile that
  the now-inert resolver was supposed to fire on.

## Known mechanical-pass limitations

These are documented for the holistic refinement pass that follows 6.H:

1. **Civic-nationalist profiles undershoot national.** 134 Progressive Civic
   Nationalist gets national=0.12 — present but modest. The heuristic
   inferred-national bump on PF≥4 is partially canceled by the MOR≥4
   universalist penalty. Civic nationalism is exactly the high-MOR + high-PF
   + national-bound combination the simple signature can't fully express.
   Holistic pass should review high-PF archetypes for under-coded national.
2. **Gender-anchored archetypes besides 145/146 cannot be inferred from the
   continuous signature.** No way to detect "this archetype is organized
   around gender politics" from CD/CU/MAT/MOR/PF positions without
   TRB_ANCHOR data. All non-141-146 archetypes get gender~0.05-0.10.
3. **Religious-universalist archetypes (Catholic social democrat shape) get
   moderate religious + low everywhere else** — close to "indifferent" by
   intensity formula even though they should register as universalists with
   religious-anchored worldview. The intensity formula derives from
   max(MOR.sal, TRB.pos, PF.pos), and a Catholic social democrat with
   moderate-low TRB / low PF will land at moderate intensity, not high.
4. **No anti-categories.** Archetypes that actively reject specific
   identity boundaries (e.g., "principled cosmopolitan rejects all
   national-anchored politics") are encoded as low-on-that-boundary, not
   negative-on-that-boundary. The boundary-distance formula handles this
   correctly via vector geometry — no `antiCats` field needed in v1 per
   ADR-006.

## Files changed

- `src/config/archetypes.ts` — added `morBoundaries` field to all 124
  archetype literals (additive; old MOR/TRB/PF/TRB_ANCHOR fields kept)
- `scripts/pr6c-derive-mor-boundaries.mjs` — derivation script (reproducible)
- `scripts/pr6c-inject-mor-boundaries.mjs` — text-injection script
- `results/calibration-exceptions/pr6c-mor-boundaries-derived.json` —
  per-archetype derived values (124 entries)
- `results/calibration-exceptions/pr6c-encoding-notes.md` — this doc
- `dist/config/archetypes.{js,js.map}` — regenerated. (`.d.ts` unchanged
  because the `Archetype` type already had `morBoundaries?` from PR 6.B;
  adding the field to the data does not change the declaration file.)

Typecheck passes (`npm run build`).

Engine still reads old MOR/TRB/PF/TRB_ANCHOR — no runtime behavior change.
Cutover lands in PR 6.E.
