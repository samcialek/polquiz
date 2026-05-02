# Q82 routing audit — does it spend CD/CU budget well, or should Q3 route earlier?

**Date:** 2026-05-02
**HEAD:** `d542d57`
**No engine code or data edits performed.** This is a read-only sequence + touchProfile audit against the three real dumps.

## TL;DR

Q82 fires once in every dump as the dominant clean **CD-position + CU-position** probe in the EIG-fill / top-K-drill phase (slot 16–21). After the fixed 15-question opener, Q82 is **the only question with a meaningful (≥0.4) CD-position touch** — Q3, the cleaner single-node CD slider, is queued as adaptive but **never selected** because Q82's dual coverage scores higher on EIG.

Q82 currently has one wash-out vector: option D `economics_first` pulls **both CD and CU back toward neutral** (peak ~pos=3 on each), which regressed D1's CD from 4.38 → 4.03 (Sam wanted CD > 4.5). Options A / B / C move CD/CU in directionally correct ways; the post-PR2 civic_assimilation rebalance fixed the D2 CD-direction bug.

**Recommendation: route Q3 earlier under a forced-coverage rule** — leave Q82's evidence map alone (the change Sam held was right to hold), add Q3 as a structural CD-position probe when CD has fewer than N meaningful position touches by some checkpoint. This gives CD a second-line clean read independent of which Q82 option fires, and addresses the D1 wash-out without touching the question that previously drifted D3/011.

---

## 1. Where Q82 lands in each dump's sequence

### Phase mapping

The fixed front door is `SALIENCE_ROUTER_FIXED` (= `CORE_OPENER` 10 + `UNIVERSAL_SCREENERS` 5 = 15 questions, see `src/engine/config.ts:115–143`). Slots 1–15 are deterministic:

```
CORE_OPENER:        200, 103, 97, 1, 60, 89, 22, 218, 211, 212
UNIVERSAL_SCREENERS: 93, 102, 209, 210, 214
```

After slot 15, the selector enters **TOP_K_DRILL** (drill the top-2 or top-3 salience-ranked nodes up to caps `MAX_POSITION_TOUCHES_TOP_K=4`, `MAX_POSITION_TOUCHES_NON_TOP_K=3`, see `src/engine/topKDrill.ts`) → **EIG_FILL** (selectorEIG-driven information gain, see `src/engine/selectorEIG.ts`).

### Per-dump Q82 location

| Dump | Archetype | Q82 slot | Phase context | Q82 answer | CD/CU touches before Q82 | After Q82 |
|---|---|---|---|---|---|---|
| **Dump 1** (fascist play) | 088 Gentle Trad | **#21** | EIG_FILL (after Q6 fired twice + Q51 + Q61) | `economics_first` | CD=6, CU=6 | CD=8, CU=8 |
| **Dump 2** (authentic) | 056 Inst Leftist | **#17** | TOP_K_DRILL/EIG_FILL boundary | `civic_assimilation` | CD=5, CU=6 | CD=6, CU=7 |
| **Dump 3** (Jacobin) | 011 Jacobin Egalitarian | **#16** | First post-fixed slot | `open_pluralist` | CD=5, CU=6 | CD=6, CU=7 |

### Q82's touchProfile

```
Q82 [stage3 single_choice] openness_assimilation_closure
  CD/position@0.90  ← meaningful (≥ 0.4)
  CU/position@0.88  ← meaningful (≥ 0.4)
  MOR/position@0.24 ← side-touch (below threshold)
  MAT/position@0.08 ← side-touch (below threshold)
```

The two side-touches DO update those nodes' posteriors at runtime (the `MEANINGFUL_POSITION_WEIGHT=0.4` threshold gates **counting toward node-coverage caps**, not whether evidence applies — see `src/engine/topKDrill.ts:174` and `selectorEIG.ts:347`).

---

## 2. What's consuming the CD/CU budget after the opener (HEAD)

**Inventory of meaningful CD/CU position probes available to the selector:**

| QID | CD position weight | CU position weight | Other touches | Status in dumps |
|---|---|---|---|---|
| Q93 | 0.55 | 0.55 | + MAT/MOR/PRO/COM (all @0.55) | **always slot 11** (in fixed UNIVERSAL_SCREENERS) |
| Q102 | — | 0.30 (below threshold) | CU sal @0.80 | always slot 12 (CU contribution is side-only) |
| Q3 | **0.90 (clean, single-node)** | — | none | **never selected in any of 6 dumps** |
| Q4 | — | — | CD/CU/MOR salience only | conditionally selected (D2 only) |
| Q6 | 0.60 | — | + MAT/MOR/ZS/ONT_H | fires in D1 only (twice!) |
| Q51 | — | — | CU sal @0.90, CD sal @0.25 | fires in D1, D2, D3 |
| Q63 | — | — | CD/CU/MOR/MAT salience-only (best_worst) | fires in D1, D2, D3 |
| **Q82** | **0.90** | **0.88** | + MOR @0.24, MAT @0.08 | fires in **all 6 dumps** |
| Q213 | — | 0.30 (below threshold) | MOR pos @0.85 | fires in D3 (and Apr29-A/B/C) |

**Reads from the 6 traces:**

After Q93 + Q102 in the universal screener, the live selector's only **clean meaningful CD-position** option is **Q82** (or Q6 in D1 specifically — selector chose Q6 twice for the fascist-play profile's traditional CD push). **Q3 is never selected.**

Per-dump Q82 impact on CD / CU posteriors (from trace `preState` / `postState`):

| Dump | answer | ΔCD | ΔCU | direction vs Sam's verdict |
|---|---|---|---|---|
| D1 (fascist play) | `economics_first` (D) | **−0.35** (4.38 → 4.03) | +0.09 (2.26 → 2.35) | **wrong on both axes**: Sam wanted CD↑ (>4.5) and CU↓ (toward 1) — option D washes both toward 3 |
| D2 (authentic Inst Left) | `civic_assimilation` (B) | **+0.62** (2.79 → 3.41) | +0.50 (2.82 → 3.32) | **CD wrong direction** (Sam wanted progressive, <3); CU acceptable (civic-nationalist 3.32 was fine) |
| D3 (Jacobin) | `open_pluralist` (C) | **−1.00** (2.64 → 1.64) | +1.06 (3.25 → 4.31) | **right direction on both** (Sam wanted CD even more progressive, CU even more pluralist) |

The PR 2 priority 5 rebalance (commit `1b09c7d`, 2026-04-28) fixed B (`civic_assimilation`) — pre-rebalance it had CD peaking pos=4 (traditional) and CU peaking pos=4 (pluralist), giving D2 a +0.62 CD-traditional drift opposite Sam's progressive intent. Post-rebalance: CD centrist (peak 3), CU assimilationist-lean (peak 2). The trace numbers above are post-rebalance.

D1's wash-out is **not yet addressed** — option D `economics_first` still has CD/CU likelihoods peaking near pos=3, which deflates a respondent who answered the opener with strong cultural extremes. This is the open D1 calibration target (Sam's verdict: CD should be >9, i.e., closer to 5).

---

## 3. Dump 3 / 011 — current sequence vs the held Q82 patch

**Held-patch artifacts:** I could not locate any committed-then-reverted Q82 change in the git history. The two Q82 commits in `git log --all --grep=Q82`:

- `1b09c7d` — PR 2 priority 5 civic_assimilation rebalance (LANDED, currently at HEAD)
- `efc5791` — PR 3.D doc-only update on Q82 CU coupling (LANDED)

So "Q82 was reverted/held" appears to refer to an offline / uncommitted experiment that did not reach the repo. I have no diff to compare against. What I CAN report from current HEAD:

**Dump 3 / 011 current trajectory at Q82 (slot 16):**

| Node | preState | Q82 evidence applied | postState | Final state | Sam's target |
|---|---|---|---|---|---|
| CD | 2.64 | `open_pluralist` peaks pos=1 (CD=[0.50, 0.30, 0.13, 0.05, 0.02]) | **1.64** | 1.64 | even lower (>9, i.e., toward 1.0) |
| CU | 3.25 | `open_pluralist` peaks pos=5 (CU=[0.03, 0.05, 0.14, 0.28, 0.50]) | **4.31** | 4.27 | even higher (>9, i.e., toward 5.0) |
| MOR | 3.00 | side-touch peaks pos=5 (MOR=[0.05, 0.10, 0.20, 0.30, 0.35]) | drifts up | 4.58 | already correct |
| MAT | 3.00 | (no MAT evidence on `open_pluralist`) | unchanged | 2.03 | correct |

For 011 specifically, Q82 is a **net-positive** contribution: it moves all 4 nodes in directions Sam endorsed. So any Q82 change that softens or reverses these directions for 011 would regress that classification.

**Plausible mechanism for the "Q82 patch drifted Dump 3":** if the held change tightened `civic_assimilation` to be even more directional (e.g., CU peak shifted from pos=2 to pos=1 to fix D1's wash-out OR to sharpen D2's calibration), then for D3 the trajectory through Q82's `open_pluralist` would be unaffected — but selector budget might have shifted (a more-informative Q82 might raise its EIG and pull it earlier, or change downstream questions). Without the actual patch I can't confirm; what's clear from the data is **D3's current Q82 contribution is correct and any change that reduces the magnitude of D3's CD−1.00 / CU+1.06 push would worsen 011's final ranking**.

---

## 4. Q3 as an alternative

### Q3's profile

```
Q3 [fixed12 slider] cultural_social_placement
  CD/position@0.90 (single touch, "direct_placement")
  sliderMap: 5 buckets, peaked likelihoods (0-20 → CD=[0.60,0.25,...,0.01], 81-100 → CD=[0.01,...,0.60])
```

Q3 is a **clean single-node CD-position slider** — the cleanest CD probe in the bank.

### Eligibility & why it never fires

Q3 has `stage: "fixed12"` in the question file, but the **Salience-Router refactor (2026-04-27) replaced the 32-question FIXED_OPENER with the 15-question SALIENCE_ROUTER_FIXED** (`config.ts:140`). Q3 was deliberately excluded. Per the comment at `config.ts:106`:

> Items deliberately excluded from fixed and queued as conditional/adaptive:
>   - Q4 (cultural_social_salience): conditional on uncertain CD/CU/MOR sal.
>   - …

Q3 is not in that exclusion list explicitly, but it shares the same "fixed12" legacy stage label and the same outcome: it's queued as adaptive but the EIG selector never picks it because **Q82's dual CD+CU coverage scores higher**: one question covering both nodes when both are top-K dominates a single-node probe.

**Quantitative case for Q3 over Q82 for CD only:**

- Q3: 1 meaningful touch (CD pos @0.90), no side-touches, slider UI (forced direct self-placement)
- Q82: 2 meaningful touches (CD pos @0.90, CU pos @0.88) + 2 side-touches, 4-option pick

For CD specifically: Q3 is **strictly cleaner** (no side-touches on MOR / MAT, no option-deflection vector like Q82's `economics_first`). For CD+CU together: Q82 is more efficient.

### Would Q3 fire earlier under a structural rule?

A forced-coverage probe (similar to Q207 PRO forced-coverage added in PR 3.D, see `selectorEIG.ts:426–439 FORCED_COVERAGE_PROBES`) for CD would lock in Q3 at a deterministic slot when CD has fewer than N meaningful position touches at checkpoint M. Concretely: after the fixed 15, CD has exactly **1 meaningful position touch** (from Q93 @0.55). If the threshold is `< 2 meaningful CD touches by slot 17`, Q3 fires at slot 16 or 17, before Q82.

This would deterministically lock CD before Q82's `economics_first` gets a chance to wash it out (D1 case), and provide a CD-direction sanity check that a single Q82 option choice can't reverse (D2 pre-rebalance case).

### Cleaner than Q82 for the unresolved CD/CU budget?

For **CD alone**, yes. For **CU alone**, no — Q3 doesn't touch CU at all. But the live selector's CU position coverage is already adequate via Q93 (slot 11) + Q82 (which wouldn't be removed, just preceded). Adding Q3 doesn't subtract anything from CU coverage; it only adds one clean CD lock-in.

---

## 5. Recommendation

**Route Q3 earlier under a structural rule** (option 3 in Sam's list).

### Why not the other options

| Option | Verdict | Reason |
|---|---|---|
| Leave Q82 held, do nothing | **Insufficient** | D1 fascist play's `economics_first` wash-out (CD 4.38 → 4.03) is unaddressed and visible in calibration. Q82 alone has no second-line CD probe to absorb a bad option choice. |
| Restore a narrower Q82 change | **Cannot evaluate** | No artifact of the held change. Any Q82 evidence-map edit risks the same D3/011 drift Sam already saw. The asymmetric impact across D1/D2/D3 makes Q82 evidence tuning fragile. |
| **Route Q3 earlier under a structural rule** | **Recommended** | Adds a clean CD-only lock-in via the existing forced-coverage mechanism. Doesn't touch Q82's evidence map (so D3/011 stays put). Mirrors the precedent set by Q207 PRO forced-coverage in PR 3.D. |
| Adjust touch weights / `MEANINGFUL_POSITION_WEIGHT` threshold | **Avoid** | Lowering the 0.4 threshold to e.g. 0.3 would reclassify side-touches across the entire question bank as "meaningful" — broad knock-on effects, hard to isolate. |
| Other | — | None obvious. |

### Exact next-patch recommendation (engine code; do not apply in this commit)

Add Q3 to `FORCED_COVERAGE_PROBES` in `src/engine/selectorEIG.ts`:

```ts
const FORCED_COVERAGE_PROBES: Array<{ qid: number; node: ContinuousNodeId }> = [
  // existing probes (Q7, Q213, Q18, Q207) ...
  { qid: 3, node: "CD" }, // CD position lock-in (clean single-node slider) —
                          // fires when CD has < 2 meaningful position touches
                          // by slot N; addresses D1's `economics_first` wash-out
                          // by ensuring Q82's option D can't reverse a strong
                          // cultural placement set in Q3.
];
```

Plus a check function (mirroring the existing forced-coverage pattern) that fires when:
- CD has < `MIN_POSITION_TOUCHES_PER_TOP_K` (= 2) meaningful position touches; AND
- Q3 has not been asked yet; AND
- `isQuestionEligible(state, q3Def)` returns true (CD not Q103-ruled-out).

### Validation gates before shipping

Per the *Selector / EIG Testing Split* note in `CLAUDE.md`:

1. **Live-style dump replay** — replay D1, D2, D3 through the patched selector. Assert:
   - D1 final CD ≥ 4.5 (Sam's target was >4.5; HEAD is 4.03)
   - D2 final CD ≤ 3.0 (Sam's target was progressive-side; HEAD is 3.41 — Q82 alone bumped it from 2.79)
   - D3 final 011 still wins (don't regress what we've got)
   - Question count delta within +1 (forced-coverage adds 1 question)
2. **Eval harness** — `src/eval/harness.ts` top-1 / top-3 movement; ≤ 2pp regression budget per the project's question-rewrite gate.

If both pass, the change ships. If only one passes, hold pending the other side's analysis.

### Open observations not in the recommendation

- **Q82's `economics_first` option** (option D) is the residual D1 wash-out vector. A separate, narrower follow-up could sharpen D's likelihoods to deflect rather than overwrite (e.g., reduce CD/CU update magnitude, add MAT salience boost since "economics_first" is fundamentally a MAT-priority signal). This is the kind of "narrower Q82 change" option 2 from Sam's list could pursue — but given the held-patch drift on D3/011, I'd defer this until after the Q3 forced-coverage is in.
- **Q4** (CD/CU/MOR salience slider, also stage="fixed12") is similarly excluded from the fixed opener and only fires conditionally. If salience under-reads on CD/CU become an issue, Q4 is the parallel structural-routing candidate for the salience side.
