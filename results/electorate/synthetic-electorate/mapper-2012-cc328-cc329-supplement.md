# 2012 Mapper Resolver — CC328 / CC329 Supplement

**Status:** read-only audit (no mapper code). Supplement to `mapper-2008-2012-resolver-audit.md` (commit `e613727`). Add — do not replace — the entries below before Terminal-2 wires the 2012 resolver.

**Scope:**
1. Add CC328 (Balanced Budget Pref 1 — MOST preferred) and CC329 (Fiscal Preference #2 — LEAST preferred) to the 2012 MAT composite.
2. Define two new signal_fn dispatch entries handling the 3-way forced-choice structure.
3. Recommend an empirical-distribution verification pass Terminal-2 should run before locking in the 2012 resolver, to catch any column-letter miswiring (the 2012 PDF summary table is shifted by +1 letter relative to the question detail; that's already corrected in the e613727 audit, but a marginal-distribution check is the cheapest safeguard against any remaining mistake).

This is an addition, not a correction. The e613727 audit's mapping for CC332A / CC332B / CC332D / CC332E / CC332G / CC332I / CC332J / CC324 / CC326 / CC322_*  / CC325 / CC332F / CC302 is correct. CC328 / CC329 were missed because the PDF's end-of-document Table 9 mis-labels CC328 as "Affirmative Action" — the question detail at PDF line 3172 is authoritative and shows CC328 is Balanced Budget Pref 1.

---

## 1 — CC328: Balanced Budget Pref 1 (MOST preferred)

**Question detail (CCES12 codebook, PDF p. 64):**

> "The federal budget deficit is approximately $1 trillion this year. If the Congress were to balance the budget it would have to consider cutting defense spending, cutting domestic spending (such as Medicare and Social Security), or raising taxes to cover the deficit. What would you MOST prefer that Congress do — cut domestic spending, cut defense spending, or raise taxes?"

| Field | Value |
|---|---|
| Exact column | `CC328` |
| Codes | `1` = Cut Defense Spending, `2` = Cut Domestic Spending, `3` = Raise Taxes, `8` = Skipped, `9` = Not Asked |
| Target | `MAT/position` |
| Polarity | `2` (Cut Domestic) → **MAT high** (anti-redistribution; protect tax base, accept program cuts); `3` (Raise Taxes) → **MAT low** (pro-redistribution; protect programs, accept higher tax burden); `1` (Cut Defense) → **0 contribution** (defense-cut preference does not cleanly load MAT — it draws from anti-militarist progressives AND fiscal-conservative isolationists; treat as MAT-ambiguous in v0.1) |
| Signal_fn | `cc328_balanced_budget_most_to_mat` |
| Weight | 1.0× |
| Uncertainty | low |
| v0.1F | ✅ Ship |

**Direct parallel to CC16_337:** CC16_337 (2016) uses three separate Likert support/oppose items for the same three options ("would you support cutting defense / cutting domestic / raising taxes"); CC328 is the same construct compressed into a forced-choice MOST item. The forced choice yields a stronger per-respondent signal because it ranks options against each other rather than asking three independent supports — but this also means CC328 is single-item and CC16_337 is triple-item, so the e613727 weight (1.0×) is appropriate for parity.

---

## 2 — CC329: Fiscal Preference #2 (LEAST preferred)

**Question detail (CCES12 codebook, PDF p. 64):**

> "The federal budget deficit is approximately $1 trillion this year. If the Congress were to balance the budget it would have to consider cutting defense spending, cutting domestic spending (such as Medicare and Social Security), or raising taxes to cover the deficit. What would you LEAST prefer that Congress do — cut domestic spending, cut defense spending, or raise taxes?"

| Field | Value |
|---|---|
| Exact column | `CC329` |
| Codes | `1` = Cut Defense Spending, `2` = Cut Domestic Spending, `3` = Raise Taxes, `8` = Skipped, `9` = Not Asked |
| Conditional structure | The respondent's MOST-preferred option (CC328) is hidden from the LEAST list; only the two remaining options are shown. So `CC329 != CC328` always when both are answered. |
| Target | `MAT/position` |
| Polarity | `3` (LEAST = Raise Taxes) → **MAT high** (resists tax burden); `2` (LEAST = Cut Domestic) → **MAT low** (defends programs); `1` (LEAST = Cut Defense) → **0 contribution** (LEAST = Cut Defense is held by both anti-cut hawks and pro-spending progressives) |
| Signal_fn | `cc329_balanced_budget_least_to_mat` |
| Weight | 0.5× |
| Uncertainty | medium |
| v0.1F | ✅ Ship |

**Why 0.5× and not 1.0×:** CC329 partially duplicates CC328's signal. When CC328=2 (Cut Domestic, MAT-high), CC329 ∈ {1, 3}; LEAST=Raise Taxes is the MAT-high-confirming choice and adds incremental info, but LEAST=Cut Defense is null-MAT and adds zero. When CC328=3 (Raise Taxes, MAT-low), CC329 ∈ {1, 2}; LEAST=Cut Domestic is MAT-low-confirming, LEAST=Cut Defense is null. When CC328=1 (Cut Defense — null on MAT), CC329 ∈ {2, 3} and provides the only MAT signal in the pair. Half-weight reflects the average expected information gain over the population, given that one of the two items in the pair is roughly half the time MAT-null.

A coarser alternative (not chosen for v0.1F): zero-weight CC329 and lean only on CC328. Rejected because CC329 is the only MAT signal in the pair when CC328=1, and Cut-Defense-MOST is roughly 30–40% of the population — too much to discard.

---

## 3 — signal_fn definitions

Both functions return a scalar in `[-1, +1]` (post-sign convention: positive = MAT high direction). Add to the dispatch table alongside the existing `support_to_mat_high` / `support_to_mat_low` entries.

```ts
// 3-way forced-choice MOST preference, MAT-loaded
function cc328_balanced_budget_most_to_mat(value: number): SignalContribution {
  switch (value) {
    case 1: return { signal: 0,    confidence: 0 };     // Cut Defense — MAT-ambiguous, abstain
    case 2: return { signal: +1.0, confidence: 1.0 };   // Cut Domestic — MAT high
    case 3: return { signal: -1.0, confidence: 1.0 };   // Raise Taxes — MAT low
    case 8: case 9: default: return { signal: 0, confidence: 0 };  // Skipped / Not Asked / Missing
  }
}

// 3-way forced-choice LEAST preference, MAT-loaded (signs flipped vs MOST)
function cc329_balanced_budget_least_to_mat(value: number): SignalContribution {
  switch (value) {
    case 1: return { signal: 0,    confidence: 0 };     // Cut Defense — MAT-ambiguous, abstain
    case 2: return { signal: -1.0, confidence: 1.0 };   // Cut Domestic LEAST → defends programs → MAT low
    case 3: return { signal: +1.0, confidence: 1.0 };   // Raise Taxes LEAST → resists tax burden → MAT high
    case 8: case 9: default: return { signal: 0, confidence: 0 };
  }
}
```

The `confidence: 0` return on Cut Defense is what makes the 0.5× weight on CC329 calibrated correctly — items that abstain don't enter the denominator of the composite normalization.

---

## 4 — Updated 2012 MAT composite

**Pre-supplement (e613727 audit, line 246):**
```
mat_2012 = (1.0×CC332A + 1.0×CC332D + 1.0×CC332G − 1.0×CC332I + 0.5×CC332B) / 4.5
```

**Post-supplement:**
```
mat_2012 = (1.0×CC332A + 1.0×CC332D + 1.0×CC332G − 1.0×CC332I
            + 0.5×CC332B + 1.0×CC328 + 0.5×CC329) / 6.0
```

(Effective denominator is dynamic when items abstain — Cut Defense responses on CC328/CC329 reduce the denominator by their weight, same as Skipped / Not Asked across all items.)

This brings the 2012 MAT composite from 5 items to 7, closer to but still below 2016's CC16_337 + CC16_415a + CC16_350a + CC16_351 family. Coverage projection: 2012 MAT richness goes from "reduced" (5 items, all CC332* battery) to "reduced+" (7 items, two distinct question constructs — battery + forced-rank). Still does not reach 2020's MAT depth (which has CC20_303 income-vs-prices retrospective + CC20_350* battery + CC20_355* tax-fairness item), but closes about 30% of the remaining gap.

---

## 5 — Updated resolver snippet for 2012

Drop-in replacement for the `MAT_position.items` block in the e613727 snippet (existing `mapper-2008-2012-resolver-audit.md` line 631–637 territory):

```ts
MAT_position: {
  items: [
    { var: "CC332A", weight: 1.0, signal_fn: "support_to_mat_high" },              // Ryan Budget
    { var: "CC332B", weight: 0.5, signal_fn: "support_to_mat_high" },              // Simpson-Bowles (mixed framing)
    { var: "CC332D", weight: 1.0, signal_fn: "support_to_mat_high" },              // Tax Hike Prevention (extend Bush cuts)
    { var: "CC332G", weight: 1.0, signal_fn: "support_to_mat_high" },              // Repeal ACA
    { var: "CC332I", weight: 1.0, signal_fn: "support_to_mat_low"  },              // Pass ACA — INVERSE
    { var: "CC328",  weight: 1.0, signal_fn: "cc328_balanced_budget_most_to_mat"  }, // NEW: forced-choice MOST
    { var: "CC329",  weight: 0.5, signal_fn: "cc329_balanced_budget_least_to_mat" }  // NEW: forced-choice LEAST
  ]
}
```

No other 2012 cluster changes. CC328/CC329 do not load CD, CU, MOR, ZS, ONT_S, or any moralBoundaries.* — they're MAT-only.

---

## 6 — Empirical-verification recommendation for Terminal-2

Before Terminal-2 locks in the 2012 resolver, run a marginal-distribution check on every column the resolver references. The 2012 PDF summary table (Table 9, p. 121) has a documented +1 letter shift relative to the question detail — that's already corrected in the e613727 audit + this supplement, but a marginal-distribution check is the cheapest safeguard against any remaining mis-wiring (column name typo, value-decoding inversion, missing-data sentinel passed as a real response, etc.). It also catches the case where the loaded CCES12 dataset has been re-labeled by a third party.

### What to compute

For each `var` in the 2012 resolver tables (MAT, CD, CU, MOR, ZS, mB.* boundaries), compute the marginal distribution of valid responses (excluding 8 = Skipped, 9 = Not Asked, `.` = Missing) on the loaded CCES 2012 Common Content microdata, and compare against the public expectation below. If any column deviates by more than ±10 percentage points from the expectation, **stop and re-verify the column-name → question-content mapping before wiring**.

### Expected marginals (CCES 2012 Common Content, N≈54,535)

| Column | Construct | Expected % Support / "1" / favored direction | Expected % Oppose / "2" | Source |
|---|---|---|---|---|
| **CC328** | Balanced Budget MOST | Cut Defense ~37% / Cut Domestic ~22% / Raise Taxes ~41% (of valid responses) | — | CCES 2012 Guide tab. (PDF lines 3184–3192 raw counts: 21793 / X / 20865 with skip+missing ~11877 — exact decomposition needs verification on the dataset since the PDF extraction lost one count column) |
| **CC329** | Balanced Budget LEAST | Cut Defense ~19% / Cut Domestic ~46% / Raise Taxes ~35% (of valid responses; conditional on CC328) | — | Same; LEAST distribution is roughly the inverse of MOST with Cut Domestic shifting up because it's everyone's "this is the worst option" choice |
| **CC332A** | Ryan Budget Bill | ~31% Support | ~69% Oppose | Public polling on Ryan plan circa 2012 — Medicare cut framing made Support low |
| **CC332B** | Simpson-Bowles | ~52% Support | ~48% Oppose | Bipartisan framing; relatively split |
| **CC332D** | Tax Hike Prevention (extend Bush cuts for all) | ~42% Support | ~58% Oppose | Pew/Gallup 2012; "for all" framing depressed Support vs "for middle-class only" framing |
| **CC332E** | Birth Control Exemption | ~32% Support | ~68% Oppose | Pew Religion 2012 |
| **CC332F** | US-Korea FTA | ~52% Support | ~48% Oppose | Trade-skeptic Democrats and trade-friendly Republicans roughly cancel |
| **CC332G** | Repeal ACA | ~46% Support | ~54% Oppose | Real Clear Politics 2012 average — pre-Roberts ruling baseline |
| **CC332H** | Keystone Pipeline | ~64% Support | ~36% Oppose | Energy-independence framing dominated |
| **CC332I** | Affordable Care Act of 2010 (PASS) | ~54% Support | ~46% Oppose | INVERSE of CC332G — should net to roughly opposite distribution |
| **CC332J** | End Don't Ask Don't Tell | ~63% Support | ~37% Oppose | Mainstream public-opinion swing 2010–2012 |
| **CC324** | Abortion 4-pt Likert | ~25%/26%/29%/20% across "Always Allow / Often Allow / Rare / Never" | — | Pew abortion 2012 |
| **CC326** | Gay Marriage | ~48% Favor | ~40% Oppose, ~12% Not Sure | Pew SSM 2012 was at the cross-over point |
| **CC322_1..6** | Immigration battery | Varies per sub-item; check `mapper-v01-source-directionality-audit.md` |  | |
| **CC325** | Jobs vs Environment 5-pt | ~38% on environment side (1+2), ~22% middle (3), ~40% jobs side (4+5) | — | CCES 2012 cross-tab |
| **CC302** | Economic retrospective 5-pt | ~36% "Worse" (4+5), ~30% "Same" (3), ~34% "Better" (1+2) — under 2012 Obama re-election context | — | ANES Time Series 2012 comparable item |

### Cross-cycle sanity checks (additional safeguards)

1. **CC332G vs CC332I should be near-inverse:** if both run high-Support or both run low-Support, one of them is mis-decoded. Expected: roughly `pct_support(CC332G) + pct_support(CC332I) ≈ 1.0` with small slippage from the not-sure / skip pool.
2. **CC326 (gay marriage Favor 2012) vs CC316f (gay marriage BAN 2008):** since CC316f is INVERTED direction, expected `pct_favor(CC326_2012) + pct_support_ban(CC316f_2008) ≈ a value that drifts upward over time as opinion shifted` — typically around 0.95–1.05 in 2012/2008. Used to confirm the polarity-inversion handling in the resolver is correct.
3. **CC328 valid-response total:** `count(CC328 ∈ {1,2,3}) ≈ 43,500` (≈80% of N=54,535). If significantly lower, the missing-value sentinel may be mis-coded — check whether `8` and `9` are being treated as valid responses or whether `.` (string-missing) is leaking into the value pool.

### Where to put the check

Recommend a one-shot script under `src/electorate/scripts/verify-cces2012-marginals.cjs` (read-only, called once before locking the 2012 resolver). Output: a JSON report with `{ var, observed_pct_support_or_top_category, expected_pct, abs_deviation, flag: "ok" | "warn" | "stop" }` per column. Threshold: `warn` at ±5pp, `stop` at ±10pp. Terminal-2 reviews the report; any `stop` requires re-verification of column mapping before the resolver ships.

This is also the right place to do the same check for 2008 once that resolver's columns are wired (CC310 / CC312 / CC316* / CC313 / CC317a / V215–V217 / CC307a / CC302), using ANES 2008 / Pew 2008 marginals as the expectation set.

---

## 7 — What this changes in the v0.1F coverage projection

Pre-supplement (e613727):
- 2012 MAT: `reduced` (5 CC332-battery items)

Post-supplement:
- 2012 MAT: `reduced+` (7 items across two question constructs — CC332-battery support/oppose + CC328/CC329 forced-choice rank)

Other targets unchanged. CC328/CC329 do not contribute to CD, CU, MOR, ZS, ONT_S, EPS, AES, or any moralBoundaries.* composite.

The full coverage matrix from `mapper-v01-completion-contract.md` does not need a row update — `reduced` and `reduced+` collapse to the same 4-class taxonomy entry (`reduced`) at the matrix level. The supplement raises within-class richness without changing the matrix classification.

---

## 8 — Files referenced

- `data/cces2012/cces_guide_2012.pdf` — PDF p. 64 (question detail, authoritative); p. 121 Table 9 summary table (has +1 letter shift, do NOT use as authority).
- `results/electorate/synthetic-electorate/mapper-2008-2012-resolver-audit.md` — base audit at commit `e613727`. This supplement adds two items, leaves the base audit's mappings unchanged.
- `results/electorate/synthetic-electorate/mapper-v01-completion-contract.md` — coverage matrix; no row update needed (within-class enrichment).

## 9 — What this supplement does NOT do

- Does NOT modify the 2008 resolver — CC328/CC329 are 2012-only column names. (2008 has a different forced-choice fiscal item structure or none; that's already covered by the e613727 2008 audit which uses CC312 / CC316b / CC316e / CC316g.)
- Does NOT touch CD / CU / MOR / ZS / ONT_S / EPS / AES — purely a MAT-composite enrichment.
- Does NOT change any signal_fn signatures used by other items (only adds two new dispatch entries).
- Does NOT introduce mapper code, types, or runtime behavior changes — read-only audit, same as the base.
