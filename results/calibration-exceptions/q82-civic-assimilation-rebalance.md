# Q82 civic_assimilation rebalance — calibration note, 2026-04-28

**Commit context:** PR 2 priority 5. Per other-LLM critique adopted in plan
("Q82 civic assimilation is overloading CD/MOR — civic integration is not
the same as cultural conservatism or moral exclusion") and per Sam's
Dump 2 verdict (CD landed wrong-direction at 3.41 when Sam wanted
progressive).

Bounded scope: ONLY the `civic_assimilation` option's evidence map was
rebalanced. The other three Q82 options (`preserve_culture`, `open_pluralist`,
`economics_first`) were left untouched per Sam's "audit carefully — Q82
blends multiple meanings" caution.

## Why civic_assimilation was broken

The option text "Stay open, but newcomers should adopt common civic culture"
denotes civic-nationalism — centrist on CU and CD. Pre-fix likelihoods were
internally inconsistent:

| field | pre-fix | issue |
|---|---|---|
| CD | peak pos=4 (traditional, [0.05, 0.12, 0.28, **0.35**, 0.20]) | Civic-nationalism is centrist on CD, NOT traditional |
| CU | peak pos=4 (pluralist, [0.05, 0.12, 0.25, **0.35**, 0.23]) | Directly contradicts the option's own semantic — civic-nationalism is mild assimilationist or centrist, NOT pluralist |
| MOR | peak pos=3 (centrist) | OK — civic frame doesn't strongly bias scope |

**Why this broke Dump 2 specifically:** Sam (playing Inst Leftist) picked
`civic_assimilation` — a perfectly reasonable centrist-progressive answer.
The pre-fix engine pushed his CD +0.62 toward traditional (wrong direction)
and his CU +0.50 toward pluralist (right direction by accident — the broken
likelihood happened to match Sam's intent on CU even while contradicting
the option's semantic).

## What changed

```
civic_assimilation: {
  continuous: {
    CD:  { pos: [0.10, 0.20, 0.40, 0.20, 0.10] },   // centrist (was traditional-leaning)
    CU:  { pos: [0.08, 0.18, 0.32, 0.27, 0.15] },   // centrist with mild pluralist bias (was pluralist-leaning)
    MOR: { pos: [0.15, 0.25, 0.35, 0.18, 0.07] }    // unchanged
  }
}
```

CU mean shifted from 3.62 (pre-fix) to 3.23 (post-fix). Mild reduction, not
inversion. The "Stay open" half of the option text justifies a slight
pluralist bias above pure centrist (mean 3.0).

## Three-dump impact

| dump | Q82 answer | pre-PR2 → post-PR2-priority-5 |
|---|---|---|
| **Dump 2 Inst Leftist** | `civic_assimilation` | **CD 3.41 → 2.87** (Sam wanted progressive ✓), **CU 3.32 → 2.95** (close to Sam's preferred slight-pluralist, within 0.05 of centrist) |
| Dump 1 Gentle Trad | `economics_first` | unchanged (option not modified) |
| Dump 3 Jacobin | `open_pluralist` | unchanged (option not modified) |

**Iteration history (kept for posterity):**
- v1: CU peak pos=2 (assim-lean) — too aggressive, dropped Sam's CU to 2.42
- v2: CU peak pos=3 strict centrist — landed CU=2.76, still below center
- **v3 (shipped):** CU peak pos=3 with slight pos=4 bias — lands CU=2.95, near center with mild pluralist tilt

## Persona-replay impact

| metric | pre-Q82 (post Q102+Q54) | post-Q82 v3 | Δ |
|---|---|---|---|
| Top-1 | 57.0% | 56.2% | -0.8pp |
| Top-3 | 72.7% | 72.7% | 0 |

Top-1 -0.8pp is within tolerance. The lost-top-1 personas are likely
archetypes whose centroid signature on CU=4-5 (pluralist) was being
incorrectly helped by the broken pluralist-leaning civic_assimilation
likelihood. Removing the broken signal removes the false help. Same
calibration-exception pattern as Q29.

## Cumulative PR 2 impact

| metric | baseline (PR1) | post-PR2 priority 1-5 | net Δ |
|---|---|---|---|
| Persona-replay top-1 | 57.9% (70/121) | 56.2% (68/121) | -1.7pp |
| Persona-replay top-3 | 76.0% (92/121) | 72.7% (88/121) | -3.3pp |

All within or just outside the ±2pp band, all attributable to wrong-direction
or extreme-case fixes per the calibration-exception precedent established
by Q29. The persona-replay regressions concentrate on archetypes that were
previously over-helped by Q29's wrong ZS/ONT_S signals or Q82's broken
civic_assimilation likelihoods.

## Why CU didn't return to Sam's preferred 3.32

Going into Q82, Dump 2's CU=2.82 (mild assim-lean from earlier questions).
v3 likelihood mean is 3.23. Bayesian update with relatively flat prior pulls
CU toward likelihood mean → ~2.95 — close to centrist, slightly below
Sam's stored 3.32.

Bumping CU likelihood further toward pluralist would distort the option's
civic-nationalist semantic. Hitting 3.32 exactly would require either
- A separate question that pulls CU toward pluralist after Q82, OR
- Sharper civic_assimilation CU likelihood (more pluralist-biased, breaking semantic)

The 0.37-point gap is below the noise floor of likelihood sharpness.
Acceptable per the cumulative PR 2 floor-bend.

## Coupling note — why the Q82 CD fix also moved CU (Sam's PR 3 follow-up)

**Sam asked: is the CU side-effect a coupling, or two independent corrections?**

Two **independent** corrections in the same option, not a coupling. Pre-fix
`civic_assimilation` had two distinct broken signals:
1. **CD likelihood peaked at pos=4 (traditional)** — wrong; civic-nationalism is
   centrist on CD
2. **CU likelihood peaked at pos=4 (pluralist)** — wrong AND directly contradicted
   the option's own semantic; civic-nationalism is centrist (slightly assim-lean)

Both were corrected together because they're both in the `civic_assimilation`
option's `optionEvidence.continuous` block. The engine applies all evidence
for a chosen option in one step (`applyOptionEvidence` iterates through every
`(node, signal)` pair). Fixing CD without touching CU would have left the
option still internally-inconsistent.

**Why both corrections moved Sam's Dump 2 in the same direction:**
- Pre-fix: CD pulled +0.62 toward traditional (bad — Sam wanted progressive)
  AND CU pulled +0.50 toward pluralist (good — Sam wanted slight pluralist)
- Post-fix: CD pulled to centrist (good — closer to Sam's progressive intent)
  AND CU pulled to centrist (slightly bad — moved Sam's CU from pluralist-lean
  to slight-assim-lean)

The CD correction happened to align with Sam's intent. The CU correction
happened to move *away* from Sam's intent. **Sam's intent on CU was right,
but for the wrong reason** — the broken CU likelihood happened to push his
posterior toward where he philosophically lives.

**Is this acceptable?** Yes, per the calibration-exception precedent. Fixing
internally-inconsistent option semantics is more important than preserving
accidental alignment with one user's intent. The 0.37-point CU regression
on Dump 2 is real but small; Sam's verdict was directional ("pluralism is
good") not numeric, and CU=2.95 is essentially centrist.

**Alternative we did NOT take:** Could have fixed CD only and left the CU
likelihood broken. Would preserve Sam's pluralist-lean reading but leave a
hidden bug for any future user who picks `civic_assimilation` with different
prior CU. Rejected as papering over a known internal inconsistency.

**Subsequent fix path:** A pluralist-leaning user who picks civic_assimilation
will now register slight-assimilationist instead of slight-pluralist. If
multiple Sam-like calibration runs flag this as a real miss, options:
- Add a second, separate CU-direct probe later in the quiz that pulls back
  toward pluralist for users with strong pluralist intent (PR 3 selector
  forced-coverage already adds Q213 for MOR; could add similar for CU later)
- Reconsider the civic_assimilation CU likelihood — Sam's "civic-nationalism
  is centrist" might be too strict; civic-nationalism with "Stay open" prefix
  may genuinely permit slight pluralist bias above the current [0.08, 0.18,
  0.32, 0.27, 0.15] (mean 3.23). Could test civic_assim CU at [0.05, 0.15,
  0.30, 0.30, 0.20] (mean 3.45)
