# Phase 6 — Loose Ends

Closes deferred items from candidate audit (Phase 0-5), archetype audit (Phase 4), and dysfunction multiplier work. Date: 2026-04-27.

## Items applied

### Candidate corrections (5 rows total)

**Federalist MOR 1→2 batch** (rubric reserves MOR 1 for klan-tier; Federalist elite-favoring is narrow practiced scope but not max-narrow):

- Adams 1800 (`elections-1789-1852.ts`)
- Pinckney 1804 (`elections-1789-1852.ts`)
- King 1816 (`elections-1789-1852.ts`)
- Scott 1852 (`elections-1789-1852.ts`)
- Dewey 1944 (`candidates.ts`)

**Stevenson MAT 1→2 batch** (off-by-one; rubric MAT 1 anchor is Debs/Norman Thomas/Bernie/FDR 1936/H. Wallace 1948 — Stevenson is Truman/Carter/Mondale band):

- Stevenson 1952 (`candidates.ts`)
- Stevenson 1956 (`candidates.ts`)

**McClellan 1864 platform-vs-persona** (`elections-1856-1888.ts`): MAT 5→4, CD 5→4, MOR 1→2, PRO 5→4. Per rubric, signal = platform + rhetoric + persona + actions. McClellan publicly repudiated the peace plank, ran as a War Democrat, was a former Union general. Personal signal was moderate-conservative Democrat, not max-extreme on every axis. CU=1 retained (party platform genuinely was states-rights peace).

### Archetype corrections (4 rows total)

**PRO=1 reformist sweep** (rubric distinguishes "outcome-focused / bureaucracy-skeptical" PRO 3 from "outright rule-breaking" PRO 1):

- 065 Opportunity Liberal: PRO 1→3
- 067 Free-Exchange Modernist: PRO 1→3
- 135 Disruptive Cosmopolitan: PRO 1→3

**ONT_H-leftist sweep**:

- 017 Uncompromising Redistributionist: ONT_H 1→4 (parallel fix to 012 Class-War Leftist; under malleability framing, max-redistributionists believe humans are reshaped by economic structure → high malleability)

The audit summary mentioned only 012 explicitly, but a sweep of leftist archetypes (MAT 1-2) with ONT_H ≤ 2 surfaced 5 candidates total. Of those, four (099 Scarcity Populist, 100 Tribal Insurgent, 103 Grievance Mobilizer, 118 Survival Pragmatist) were verified to be grievance/scarcity/survival worldviews where low ONT_H is genuinely correct under the new framing (humans-as-trapped, not humans-as-reshapeable). Only 017 was the same artifact as 012.

### Dysfunction multiplier — offline build path (jurisdictions-*.ts)

Generated `src/global/jurisdictions-dysfunction.ts` from `results/dysfunction-coding/dysfunction-codes.json`. 541 / 541 entries matched cleanly between regimes.json and jurisdictions-*.ts (same naming convention). `build-alignment.ts` updated to look up dysfunction by `${jurisdiction}|${regime}|${startYear}` and apply the same factor function as the live `buildPersonalAlignments()` in results-live.html.

Re-ran `build-alignment.ts` to regenerate `global/regime-alignment.csv`, `regime-alignment-long.csv`, `regime-profiles.csv` with dysfunction-multiplied values. 67,084 alignment scores recomputed across 124 archetypes × 541 regime periods.

This means archetype-side analysis CSVs now reflect dysfunction. Live user-facing world alignment continues to use the personal-alignment override path (which already has the multiplier).

## Items deferred

### Pastoral Leftist 046 → Agrarian Populist recode/rename

Per user direction earlier in session: "That is a real archetype-space gap, but recoding 046 would erase a useful pastoral-left slot. If you want Agrarian Populist, do it as a separate design decision, preferably by adding/replacing a vacant slot after count policy is settled."

Holding for separate design discussion on archetype-count policy. The Bryan/Weaver geometry gap remains real but bounded — Bryan post-correction lands close to Closed Traditionalist (1.11) and Pastoral Leftist (1.16) within 0.05 of each other; the misclassification is small.

### Election-alignment dysfunction multiplier

**Decision: do not apply.** Reasoning:

The dysfunction multiplier exists to dampen ideological-match-with-chaos in regime-level comparison. US presidential candidates within a single election cycle all operate inside the same stable institutional context (the US) — there is no inter-candidate dysfunction variance to model. A 1948 Truman vs. Dewey comparison is not noisier in either direction because of "regime dysfunction"; both candidates exist within the same functional democracy.

Where dysfunction *does* matter for elections is the broader era-context (e.g. 1932 Hoover-vs-FDR happened during institutional crisis, 1864 Lincoln-vs-McClellan happened during civil war). But this is already partially captured by `era-activations.json` (which boosts node salience for years where political dimensions polarize) and by `non-ideological-modifiers.ts` (which captures economic/incumbency/charisma context). Adding a third "dysfunction" layer would introduce signal-mixing without clear value.

If a future analysis specifically wants to model "voter willingness to engage when democracy itself is in crisis," that would belong in the engagement / clearing-bar layer (`respondentVoteChoice.ts` CLEARING_BAR), not in the values-distance compute.

## Verification

- All 9 candidate edits verified at runtime (✓ all 9 expected values present).
- All 4 archetype edits verified at runtime.
- TypeScript build clean.
- Browser bundle rebuilt + copied to root.
- `build-alignment.ts` re-run, CSVs regenerated.
- Sam's archetype top-3 stable (none of the Phase 6 changes are within his top-15 closest archetypes).

## Files changed

- `src/historical/candidates.ts` — Stevenson 1952/1956 MAT, Dewey 1944 MOR.
- `src/historical/elections-1789-1852.ts` — Adams 1800 MOR, Pinckney 1804 MOR, King 1816 MOR, Scott 1852 MOR.
- `src/historical/elections-1856-1888.ts` — McClellan 1864 multi-node.
- `src/config/archetypes.ts` — 017 ONT_H, 065 PRO, 067 PRO, 135 PRO.
- `src/global/build-alignment.ts` — dysfunction-aware alignment.
- `src/global/jurisdictions-dysfunction.ts` — NEW (auto-generated lookup).
- `scripts/generate-jurisdictions-dysfunction.cjs` — NEW (lookup generator).
- `global/regime-alignment.csv`, `regime-alignment-long.csv`, `regime-profiles.csv` — regenerated.
- `dist/` — TypeScript + browser bundle rebuilt.
- `prism-engine-bundle.min.js` (root) — copied from dist.
