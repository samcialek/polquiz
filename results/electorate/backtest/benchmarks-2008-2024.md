# Phase 2 Backtest V0 — Ground-Truth Benchmarks (2008-2024)

**Date**: 2026-05-03
**Status**: Documentation only. No engine code touched.
**Updated this pass (Phase 2.1)**: VEP turnout rates verified for all 5 years from UF Election Lab CSV; 2024 VEP, total ballots, and per-state VAP/citizenship/felon data fully verified from UF 2024G CSV; FEC PDFs for all 5 years cached locally under `data/backtest-sources/fec/` (untracked).

**Purpose**: Evaluation targets for the national-level backtest. **Not** for tuning the model. The simulator's predicted weighted popular vote and abstentions are compared against these numbers; benchmarks are read-only.

## Source hierarchy (fixed)

1. **Official presidential vote totals** — FEC official election results (PDFs cached locally; not tracked).
2. **VEP (Voting-Eligible Population)** — U.S. Elections Project (Michael McDonald) / UF Election Lab CSVs (cached locally; not tracked).
3. **CPS Voting and Registration Supplement** — Census secondary validation for turnout and subgroup turnout.
4. **CES/CCES** — primary survey microdata (separate file: `survey-data-inventory.md`).
5. **ANES** — secondary validation, not primary aggregate engine.

## Conventions

- **VEP** is the primary denominator. Direct from UF where available; null+needs_source where not.
- **Vote totals** come from FEC official PDFs. 2024 fully verified by direct PDF read; older years use search-verified D/R + null/needs_source for total/Other (the cached PDFs allow manual verification).
- **Other** = Total presidential votes − D − R, computed only where the FEC total is verified.
- **Abstentions** = VEP − Total presidential votes, computed only where both verified.
- **`turnout_presidential_vep`** = total presidential votes / VEP. **Note**: UF's `TURNOUT_RATE_PRES` is computed as *ballots-counted* / VEP (slightly higher than presidential-only since some voters undervote the presidential race). For 2024 this distinction is 0.63%-pt: ballots-counted-turnout 64.30% vs FEC-presidential-turnout 63.67%.
- This document does **not invent numbers**. Where exact figures cannot be verified locally, the cell is `null` with `needs_source: true` and the gap is flagged for follow-up.

## Cached source files (untracked, under `data/backtest-sources/`)

| File | Size | Source URL |
|---|---|---|
| `fec/federalelections2008.pdf` | 7.5 MB | https://www.fec.gov/resources/cms-content/documents/federalelections2008.pdf |
| `fec/federalelections2012.pdf` | 25.1 MB | https://www.fec.gov/resources/cms-content/documents/federalelections2012.pdf |
| `fec/federalelections2016.pdf` | 11.9 MB | https://www.fec.gov/resources/cms-content/documents/federalelections2016.pdf |
| `fec/federalelections2020.pdf` | 12.5 MB | https://www.fec.gov/resources/cms-content/documents/federalelections2020.pdf |
| `fec/2008pres.pdf` | 280 KB | https://www.fec.gov/documents/1660/2008pres.pdf (per-year presidential summary) |
| `fec/2012pres.pdf` | 904 KB | https://www.fec.gov/resources/cms-content/documents/2012pres.pdf |
| `fec/2020presgeresults.pdf` | 686 KB | https://www.fec.gov/resources/cms-content/documents/2020presgeresults.pdf |
| `fec/2024presgeresults.pdf` | 332 KB | https://www.fec.gov/resources/cms-content/documents/2024presgeresults.pdf |
| `election-lab/US_VEP_Turnout_Rates_v1.2.csv` | 1.6 KB | https://election.lab.ufl.edu/data-downloads/turnoutdata/US_VEP_Turnout_Rates_v1.2.csv |
| `election-lab/Turnout_2024G_v0.4.csv` | 8.4 KB | https://election.lab.ufl.edu/data-downloads/turnoutdata/Turnout_2024G_v0.4.csv |

These files are **not committed to the repo** per global rules. They are cached locally for verification and follow-up data extraction.

---

## Benchmark table

### 2008

| Field | Value | Source / verification |
|---|---|---|
| D candidate | Barack Obama | confirmed |
| D votes | 69,498,516 | FEC search snippet — verify against `fec/federalelections2008.pdf` or `fec/2008pres.pdf` |
| D share of total | 52.93% | FEC search snippet (high confidence) |
| R candidate | John McCain | confirmed |
| R votes | 59,948,323 | FEC search snippet — verify against cached PDF |
| R share of total | 45.65% | FEC search snippet |
| Other / third-party votes | null | `needs_source: true` — extract from cached `fec/2008pres.pdf` Total Vote row |
| Total presidential votes | null | `needs_source: true` — extract from cached PDF |
| VEP | null | `needs_source: true` — UF 1948-2022 CSV provides rate only, not VEP count. Pull from McDonald's per-year archive |
| VEP turnout rate (presidential) | 0.616 (61.6%) | **UF Election Lab CSV verified** (`US_VEP_Turnout_Rates_v1.2.csv` row YEAR=2008) |
| Abstentions | null | derived once VEP + Total verified |
| EC | Obama 365 / McCain 173 | confirmed |
| Notes | Other includes Nader, Barr, Baldwin (Constitution), McKinney (Green); FEC PDF lists ~7 minor candidates plus scattered. | |

### 2012

| Field | Value | Source / verification |
|---|---|---|
| D candidate | Barack Obama | confirmed |
| D votes | 65,915,795 | FEC search snippet — verify against `fec/2012pres.pdf` |
| D share of total | 51.1% | FEC search snippet |
| R candidate | Mitt Romney | confirmed |
| R votes | 60,933,504 | FEC search snippet — verify against cached PDF |
| R share of total | 47.2% | FEC search snippet |
| Other / third-party votes | null | `needs_source: true` |
| Total presidential votes | null | `needs_source: true` — extract from cached PDF |
| VEP | null | `needs_source: true` |
| VEP turnout rate (presidential) | 0.586 (58.6%) | **UF Election Lab CSV verified** (row YEAR=2012). Note: prior search snippet of "58.0%" was approximate; 58.6% is the canonical value |
| Abstentions | null | derived once VEP + Total verified |
| EC | Obama 332 / Romney 206 | confirmed |
| Notes | Lower turnout than 2008. Obama re-election. | |

### 2016

| Field | Value | Source / verification |
|---|---|---|
| D candidate | Hillary Clinton | confirmed |
| D votes | 65,853,514 | FEC search snippet — verify against `fec/federalelections2016.pdf` |
| R candidate | Donald Trump | confirmed |
| R votes | 62,984,828 | FEC search snippet — verify against cached PDF |
| Other / third-party votes | null | `needs_source: true` — derive after verifying total. 2016 had elevated third-party (Johnson L, Stein G, McMullin) |
| Total presidential votes | 136,669,276 | FEC search snippet ("136.7 million per FEC") — verify exact via cached PDF |
| VEP | null | `needs_source: true` |
| VEP turnout rate (presidential) | 0.601 (60.1%) | **UF Election Lab CSV verified** (row YEAR=2016). Prior search snippet of "59.3%" appears to be a different methodology / cycle source; UF's 60.1% is canonical |
| Abstentions | null | derived once VEP + Total verified |
| EC | Trump 304 / Clinton 227 | confirmed (5 faithless electors in EC) |
| Notes | D wins popular vote, R wins EC. Locally available CCES 2016 microdata covers this cycle. | |

### 2020

| Field | Value | Source / verification |
|---|---|---|
| D candidate | Joe Biden | confirmed |
| D votes | 81,268,773 | FEC search snippet — verify against `fec/2020presgeresults.pdf` |
| D share of total | 51.31% | FEC search snippet |
| R candidate | Donald Trump | confirmed |
| R votes | 74,216,728 | FEC search snippet — verify against cached PDF |
| R share of total | 46.86% | FEC search snippet |
| Other / third-party votes | null | `needs_source: true` |
| Total presidential votes | ≈158,400,000 | UF Election Lab snippet citing 158.4M ballots; verify exact via cached `fec/2020presgeresults.pdf` |
| VEP | null | `needs_source: true` — UF 1948-2022 CSV provides rate only |
| VEP turnout rate (presidential) | 0.6638 (66.38%) | **UF Election Lab CSV verified** (row YEAR=2020). **Resolves prior 66.1% vs 66.6% discrepancy** — the canonical value is 66.38% |
| Abstentions | null | derived once VEP + Total verified |
| EC | Biden 306 / Trump 232 | confirmed |
| Notes | Highest VEP turnout in over a century. UF rate now reconciled at 66.38%. | |

### 2024

| Field | Value | Source / verification |
|---|---|---|
| D candidate | Kamala Harris | confirmed |
| D votes | 75,017,613 | **FEC PDF directly verified** — `fec/2024presgeresults.pdf` page 3 |
| D share of total | 48.32% | FEC PDF verified |
| R candidate | Donald Trump | confirmed |
| R votes | 77,302,580 | **FEC PDF directly verified** — page 5 |
| R share of total | 49.80% | FEC PDF verified |
| Other / third-party votes | 2,918,109 | **derived** = 155,238,302 − 75,017,613 − 77,302,580 (all three FEC-verified) |
| Total presidential votes | 155,238,302 | **FEC PDF directly verified** — page 6 "Total Votes" Total row |
| VEP | **243,803,423** | **UF Election Lab CSV verified** — `Turnout_2024G_v0.4.csv` "United States" row |
| Total ballots counted (per UF) | 156,766,239 | UF Election Lab CSV verified. **Note**: UF total ballots (156,766,239) ≠ FEC presidential votes (155,238,302). The 1.5M difference is downballot-only voters / presidential undervotes. |
| VEP turnout rate (per UF, ballots-based) | 0.6430 (64.30%) | UF Election Lab CSV verified |
| **VEP turnout rate (presidential, derived)** | **0.6367 (63.67%)** | **derived** = 155,238,302 / 243,803,423 — **this is the rate to use for the backtest** since the comparison is on FEC presidential votes |
| **Abstentions (presidential, derived)** | **88,565,121** | **derived** = 243,803,423 − 155,238,302 |
| **Abstain share of VEP (derived)** | **0.3633 (36.33%)** | derived |
| EC | Trump 312 / Harris 226 | FEC PDF verified, page 1 |
| Notes | First R popular-vote win since 2004. Notable third-party: Kennedy 756,393, De La Cruz 166,175, Stein, Oliver, etc. | |

#### 2024 backtest comparison anchors (the strongest evaluation row)

| Metric | Value |
|---|---|
| D popular vote count | 75,017,613 |
| R popular vote count | 77,302,580 |
| Other popular vote count | 2,918,109 |
| Total presidential votes | 155,238,302 |
| Abstentions (presidential) | 88,565,121 |
| VEP | 243,803,423 |
| D share of VEP | 30.77% |
| R share of VEP | 31.71% |
| Other share of VEP | 1.20% |
| Turnout share of VEP (presidential) | 63.67% |
| Abstention share of VEP | 36.33% |

---

## Verified-vs-needs-source summary (post-Phase 2.1)

| Year | D votes | R votes | Total | Other | VEP | Turnout rate | Abstentions |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| 2008 | ✓ snippet | ✓ snippet | ⚠ needs source | ⚠ derive | ⚠ needs source | **✓ UF verified** | ⚠ derive |
| 2012 | ✓ snippet | ✓ snippet | ⚠ needs source | ⚠ derive | ⚠ needs source | **✓ UF verified** | ⚠ derive |
| 2016 | ✓ snippet | ✓ snippet | ⚠ snippet (verify exact) | ⚠ derive | ⚠ needs source | **✓ UF verified** | ⚠ derive |
| 2020 | ✓ snippet | ✓ snippet | ⚠ snippet (verify exact) | ⚠ derive | ⚠ needs source | **✓ UF verified (0.6638)** | ⚠ derive |
| 2024 | **✓ FEC PDF** | **✓ FEC PDF** | **✓ FEC PDF** | **✓ derived** | **✓ UF verified** | **✓ UF + derived** | **✓ derived** |

**Net change from prior pass**: 5 turnout rates + 1 VEP + 1 abstention chain are now fully verified. Largest remaining gap: VEP for 2008/2012/2016/2020 (UF 1948-2022 CSV provides rates only, not VEP counts). VEP back-derivation from rate × total-ballots is feasible once total-ballots-counted is extracted from the cached UF / FEC sources.

## Suggested follow-up (when ready)

1. Extract the "Total Vote" row from each cached FEC presidential summary PDF (`fec/2008pres.pdf`, `fec/2012pres.pdf`, `fec/2020presgeresults.pdf`) — typically in a single-line summary table after the per-state breakdown.
2. Pull McDonald's per-year historical files (`Turnout_2020G_*.csv`, `Turnout_2016G_*.csv`, etc.) from UF Election Lab's data archive to get authoritative VEP counts for 2008-2020.
3. Once Total + VEP are filled per year, derive Other, abstentions, and turnout rates as specified above.

## Source URLs (for follow-up verification)

- FEC 2008 official: https://www.fec.gov/resources/cms-content/documents/federalelections2008.pdf
- FEC 2008 presidential summary: https://www.fec.gov/documents/1660/2008pres.pdf
- FEC 2012 official: https://www.fec.gov/resources/cms-content/documents/federalelections2012.pdf
- FEC 2012 presidential summary: https://www.fec.gov/resources/cms-content/documents/2012pres.pdf
- FEC 2016 federal elections page: https://www.fec.gov/introduction-campaign-finance/election-results-and-voting-information/federal-elections-2016/
- FEC 2016 official: https://www.fec.gov/resources/cms-content/documents/federalelections2016.pdf
- FEC 2020 official: https://www.fec.gov/resources/cms-content/documents/federalelections2020.pdf
- FEC 2020 presidential results: https://www.fec.gov/resources/cms-content/documents/2020presgeresults.pdf
- FEC 2024 presidential results (PDF): https://www.fec.gov/resources/cms-content/documents/2024presgeresults.pdf
- FEC 2024 presidential results (XLSX): https://www.fec.gov/documents/5645/2024presgeresults.xlsx
- UF Election Lab voter turnout: https://election.lab.ufl.edu/voter-turnout/
- UF Election Lab 1948-2022 CSV: https://election.lab.ufl.edu/data-downloads/turnoutdata/US_VEP_Turnout_Rates_v1.2.csv
- UF Election Lab 2024G CSV: https://election.lab.ufl.edu/data-downloads/turnoutdata/Turnout_2024G_v0.4.csv
- UF Election Lab 2024 turnout page: https://election.lab.ufl.edu/2024-general-election-turnout/
- US Elections Project (McDonald): https://www.electproject.org/election-data/voter-turnout-data
- US Elections Project VAP-vs-VEP methodology: https://www.electproject.org/election-data/faq/vap-v-vap

---

## Backtest comparison metrics (per year)

The simulator's predicted national-aggregate output should be compared on:

1. **Democratic popular vote count** — predicted vs benchmark D votes
2. **Republican popular vote count** — predicted vs benchmark R votes
3. **Other / third-party popular vote count** — predicted vs benchmark Other
4. **Abstentions** — predicted vs benchmark (VEP − total)
5. **D share of VEP** — D votes / VEP
6. **R share of VEP** — R votes / VEP
7. **Other share of VEP** — Other / VEP
8. **Turnout share of VEP** — Total presidential votes / VEP
9. **Abstention share of VEP** — Abstentions / VEP

Comparison can only be performed once VEP is verified for the year in question. **2024 is fully runnable** (all 9 metrics computable from this benchmark).

---

## Companion file

- `benchmarks-2008-2024.json` — machine-readable mirror with `needs_source: true` flags on every unverified cell.
