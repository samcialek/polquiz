# Election-Sleeve Impact Rollup to 4 Clusters — Plan

**Date:** 2026-05-04
**Owner:** Terminal One (results prototype + UI)
**Engine touched:** none — same Euclidean math, just aggregated for display.
**Motivation (Sam, 2026-05-04):** the current per-node breakdown is too transparent. Per-row rows expose specific 1–5 codings on individual axes (e.g., MAT 4, CD 5, CU 1) which invites debate over how each candidate has been coded — debate that doesn't help the user understand why the candidate fits or doesn't fit them. Rolling up to the 4 PRISM clusters preserves the *why* (which dimensions are decisive) without putting individual codings on trial.

---

## Scope

Replace the per-node impact breakdown in the election detail sleeve with a 4-row cluster breakdown:

- **ENDS** — what you want
- **MEANS** — how you pursue it
- **REALITY** — how you see the world
- **SELF** — your political identity

Same UX shell as today (left name + subline · middle visual · right impact %). Only the row count and aggregation change. Hover popovers do **not** re-expose individual node positions.

---

## What's NOT changing

- Engine math (`respondentVoteChoice.ts`) — untouched. Cluster rollup is a UI presentation layer over the same Euclidean weighted-RMS sum.
- Phase-1/2 cleanup (no PF/TRB/ENG, EPS/AES style-match) stays — those nodes fold into the cluster aggregations.
- The compound moral-boundary contribution (Phase 3, blocked) will fold into whichever cluster MOR ends up assigned to. No change here.
- The post-distance modifier rows (moral-floor penalty, non-ideological factors, party loyalty, negative partisanship) stay as-is below the cluster rollup.
- The engagement footer note stays.

---

## Cluster → node mapping (open decision)

The engine's `NODE_META.MOR.cluster = 'ENDS'`. The v27 cluster panel layout treats MOR specially: it's rendered as the sunburst inside the SELF cluster panel, not as a row inside ENDS. So MOR has two plausible homes for the impact rollup:

| Mapping | ENDS | MEANS | REALITY | SELF |
|---|---|---|---|---|
| **A. Canonical (engine NODE_META)** | MAT, CD, CU, MOR | PRO, COM, ONT_S, AES | ZS, ONT_H, EPS | (empty — see SELF section below) |
| **B. v27 panel layout** | MAT, CD, CU | PRO, COM, ONT_S, AES | ZS, ONT_H, EPS | MOR (until Phase 3 lands the morBoundaries vector) |

**Recommendation: Option A (canonical).** The user's current cluster panels are a UX layout; the engine's cluster assignment is the analytical truth. Mixing them creates a place where "ENDS" in the impact panel and "ENDS" in the cluster panel mean different things. Better to keep one canonical mapping and accept that SELF is an empty cluster in the impact rollup until Phase 3 brings in moralBoundaries.

If we go with Option A: the SELF row needs an explicit non-contribution treatment (see next section).

---

## SELF cluster — handling the empty case

Under the canonical mapping, SELF currently contributes zero to candidate distance:
- PF: not a direct distance node (residual party-loyalty modifier effect only)
- TRB: not a direct distance node (anchor fallback fires as a non-distance side channel)
- ENG: clearing-bar gate only

Three choices, in increasing order of UX boldness:

1. **Show SELF row with 0% impact and a short explanatory subline.** Honest. Visually stable (always 4 rows). Reads: "SELF · identity · 0% — engagement gates voting; PF/TRB inert; moral-boundaries data not yet in payload." Good for stability; bad for visual weight (user sees a 0% row).
2. **Hide the SELF row when it's 0%.** Three-row breakdown today, four-row when Phase 3 unblocks. Cleaner today; introduces a layout shift later.
3. **Always show four rows; SELF row indicates the gate role rather than a 0%.** Reads: "SELF · identity · *participation gate* (clearing-bar X.XX)." Doesn't pretend to be an impact contributor; reframes what SELF means in the impact context.

**Recommendation: option 3.** Preserves the 4-row visual hierarchy and accurately tells the user *what SELF does in this layer of the math*. Avoids the awkward 0% row of option 1 and avoids the layout flip of option 2. When Phase 3 lands (moralBoundaries), the SELF row becomes a real contribution and the gate-role text moves to the footer.

---

## Aggregation math

The engine's per-candidate distance is:

```
ideologicalDistance = sqrt(Σ effSal × diff² / Σ effSal)        across all scoring nodes
```

For per-cluster rollup, we keep the contribution math identical but partition the sum by cluster:

```
For cluster c:
  cluster_contribution[c]  = Σ_{n ∈ c}  contribution[n]
  cluster_weight[c]        = Σ_{n ∈ c}  effSal[n]

cluster_impact_share[c]    = cluster_contribution[c] / Σ_n contribution[n]   // sums to 100% across clusters

cluster_rms[c]             = sqrt(cluster_contribution[c] / cluster_weight[c])  // optional — comparable to per-node "how big is the gap" in this cluster
```

Where node-level contributions for both continuous and categorical (style match) follow the formulas already documented in `scoring-impact-cleanup-plan.md`. EPS contributes to REALITY (moved from MEANS on 2026-05-12 — engine `nodes.ts`, results dashboard, and audit cluster maps all aligned). AES contributes to MEANS.

Critical detail: the cluster's `effSal`-weighted contribution is what the engine actually uses. Don't show RMS without showing contribution share — RMS hides cluster size and salience differences that drive the actual decision.

---

## Visual — what the cluster row looks like

Same 3-column row shell (name | middle | right impact %). The middle visual changes per the trade-off below.

### Option A — drop the position bar

Just impact %, a horizontal bar showing share of total, and a subline. Reads:

```
┌─ ENDS  ────────────────────────────────────────────┐
│ ENDS · what you want                          47%  │
│ Driven by 4 dimensions · weight 22.5 · RMS 1.91  ████████░░░░░  │
└────────────────────────────────────────────────────┘
```

Pros: cleanest. Honors the "less transparency" goal. No "your cluster position is X" arithmetic that's hard to defend.
Cons: loses the visual cue of "you and the candidate are far apart on ENDS" — user has to interpret the impact % to feel the gap.

### Option B — keep a soft position bar, no individual codings

Show a single horizontal bar with a "you" mark and a "candidate" mark, where the marks are placed at the cluster's salience-weighted mean position (or RMS distance from each other). NO 1–5 ticks, NO pole labels — just a relative gap visualization.

Pros: keeps the felt-distance UX from the per-node version.
Cons: the "you mark at position 2.7 in ENDS" calculation requires aggregating individual node positions, which is exactly the granularity Sam wants to avoid. Even without pole labels, someone could ask "why does the model say I'm at 2.7 on ENDS overall?"

**Recommendation: Option A.** The user's stated motivation is to avoid the debate-vector that per-node codings invite. A pure-impact visual sidesteps that completely. The gap is visible through the impact-bar magnitude.

### Option C — hybrid (probably overkill)

Impact % + a small "drivers" tag listing the top 1–2 contributing nodes by name (no positions, no codings). Reads:

```
ENDS · driven by Material + Cultural Direction               47%  ████████░░░░
```

This still names individual nodes but skips the codings and the position arithmetic. Compromise that gives the user some "where is the action" handle without exposing what each node is set to.

**Stretch recommendation:** start with Option A, leave Option C as a later enhancement if the impact bars feel too abstract on their own.

---

## Hover detail (where the granularity goes when it leaves the visible row)

User asked to *not* go into node-level granularity. So the hover popovers on cluster rows should:

- Explain the cluster's role in plain English (e.g., "ENDS measures what you want from politics — material policy, cultural direction, assimilation, and moral circle.")
- Show the cluster's contribution number and weight in math terms ("contribution 22.5 / total 47.8 = 47%")
- Optionally show the contributing node *names* without their codings ("Driven by: Material, Cultural Direction, Assimilation, Moral Circle")
- **NOT** show per-node positions, gaps, or impact percentages

A "Show node-level breakdown" expand affordance can be available for power users via a small toggle in the panel header. Off by default. Off forever for casual users.

---

## Phases

### Phase A — Cluster aggregation + row rendering (1 PR)

- New `BREAKDOWN_CLUSTERS = ['ENDS','MEANS','REALITY','SELF']`
- New `clusterFor(nodeOrCategorical)` mapping (canonical engine NODE_META)
- Update `computeBreakdown` to also return `clusterRows` alongside `rows`
- New cluster-row renderer (Option A visual) replaces the per-node loop
- SELF row renders with the participation-gate treatment (Option 3) when contribution is 0
- Keep per-node `rows` array internally for hover-popover plain-English driver names; drop per-node positions/codings from the rendered output

### Phase B — Optional: power-user expand toggle

- A small "show breakdown" toggle in the panel header surfaces the per-node rows underneath the cluster rollup. Off by default.
- Useful for debugging and for sophisticated users who want to verify the math. Behind a small icon, not in the casual flow.

### Phase C — Re-integrate when Phase 3 (moralBoundaries) unblocks

- Once data pipeline ships morBoundaries on both sides, the morModule contribution lands in whichever cluster owns it (likely SELF if we bring MOR home there, or stays in ENDS canonically).
- The SELF row's gate-role text retires; SELF becomes a real impact contributor.

---

## Open decisions

1. **Cluster mapping.** Option A (canonical engine NODE_META) vs Option B (v27 panel layout). Recommendation: A.
2. **SELF empty handling.** 0%-with-text vs hide vs gate-role-text. Recommendation: gate-role-text.
3. **Visual within row.** Option A (impact bar only) vs Option B (soft position bar) vs Option C (impact + driver names). Recommendation: A; consider C later.
4. **Power-user expand toggle.** Phase B yes/no? Recommendation: Phase A first; add B only if needed.

---

## Files this plan touches

| File | Change | Phase |
|---|---|---|
| `examples/results-prototype-v27.html` (or v28 fork) | New cluster aggregation in `computeBreakdown`; replace per-node row loop with cluster-row renderer | A |
| `results/architecture/cluster-rollup-impact-plan.md` | This plan | — |
| Engine source | (none — engine math unchanged) | — |

---

## Acceptance tests

Phase A passes when:

1. Election sleeve panel shows exactly 4 rows: ENDS, MEANS, REALITY, SELF.
2. Each row's impact % equals the sum of its constituent nodes' impact percentages from the previous v27.x rendering (numerically identical aggregation).
3. ENDS + MEANS + REALITY impact percentages sum to 100% (modulo the SELF row, which is empty under current scoring so contributes 0%).
4. No per-node 1–5 position values appear anywhere in the panel body.
5. No per-node row remains in the default rendering.
6. SELF row renders with non-empty content explaining its role (participation-gate text), not a bare 0%.
7. The total candidate-distance value at the panel header still matches the engine's `focusScore.distance` exactly — cluster rollup is presentation, not recomputation.
