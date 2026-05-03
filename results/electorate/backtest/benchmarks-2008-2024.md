# Phase 2 Backtest V0 — Ground-Truth Benchmarks (2008-2024)

**Date**: 2026-05-03
**Status**: Documentation only. No engine code touched.
**Updated this pass (Phase 2.2 follow-on — benchmark completion)**: All four FEC presidential PDFs (2008/2012/2016/2020) directly read; D, R, Other, Total presidential votes filled from FEC official totals. UF Election Lab per-year CSVs added for 2012/2016/2020 — VEP, abstentions, and per-year share-of-VEP metrics now derivable. **2008 VEP filled from US Elections Project (electproject.org/2008g)** — Michael McDonald's per-year 2008G page is authoritative for the pre-UF-archive period. **All 5 years now fully runnable** for all 9 backtest evaluation metrics.

**Purpose**: Evaluation targets for the national-level backtest. **Not** for tuning the model. The simulator's predicted weighted popular vote and abstentions are compared against these numbers; benchmarks are read-only.

## Source hierarchy (fixed)

1. **Official presidential vote totals** — FEC official election results (PDFs cached locally; not tracked).
2. **VEP (Voting-Eligible Population)** — U.S. Elections Project (Michael McDonald) / UF Election Lab CSVs (cached locally; not tracked).
3. **CPS Voting and Registration Supplement** — Census secondary validation for turnout and subgroup turnout.
4. **CES/CCES** — primary survey microdata (separate file: `survey-data-inventory.md`).
5. **ANES** — secondary validation, not primary aggregate engine.

## Conventions

- **VEP** is the primary denominator. Direct from UF where available; null+needs_source where not.
- **Vote totals** come from FEC official PDFs. All five years now FEC-PDF-verified.
- **Other** = Total presidential votes − D − R, computed from FEC-verified totals.
- **Abstentions** = VEP − Total presidential votes, computed where both verified.
- **`turnout_presidential_vep`** = total presidential votes / VEP. **Note**: UF's `VEP_TURNOUT_RATE` is computed as *ballots-counted* / VEP (slightly higher than presidential-only since some voters undervote the presidential race). The benchmark backtest uses the presidential-vote-only rate since the simulator predicts presidential vote choice.
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
| `election-lab/Turnout_2012G_v1.0.csv` | 5.9 KB | https://election.lab.ufl.edu/data-downloads/turnoutdata/Turnout_2012G_v1.0.csv |
| `election-lab/Turnout_2016G_v1.0.csv` | 9.9 KB | https://election.lab.ufl.edu/data-downloads/turnoutdata/Turnout_2016G_v1.0.csv |
| `election-lab/Turnout_2020G_v1.1.csv` | 8.6 KB | https://election.lab.ufl.edu/data-downloads/turnoutdata/Turnout_2020G_v1.1.csv |
| `election-lab/Turnout_2024G_v0.4.csv` | 8.4 KB | https://election.lab.ufl.edu/data-downloads/turnoutdata/Turnout_2024G_v0.4.csv |

These files are **not committed to the repo** per global rules. They are cached locally for verification and follow-up data extraction.

---

## Benchmark table

### 2008

| Field | Value | Source / verification |
|---|---|---|
| D candidate | Barack Obama | confirmed |
| D votes | 69,498,516 | **FEC PDF directly verified** — `fec/federalelections2008.pdf` page 5 (2008 Presidential Popular Vote Summary) |
| D share of total | 52.93% | FEC PDF verified |
| R candidate | John McCain | confirmed |
| R votes | 59,948,323 | **FEC PDF directly verified** — page 5 |
| R share of total | 45.65% | FEC PDF verified |
| Other / third-party votes | 1,866,981 | **FEC PDF directly verified** — page 6 ("All Others" column, Total row, 1.42%) |
| Total presidential votes | 131,313,820 | **FEC PDF directly verified** — page 5 (Total row) |
| VEP | 213,313,508 | **US Elections Project verified** — https://www.electproject.org/2008g (United States row). USEP / Michael McDonald is the authoritative VEP source for the pre-UF-archive period. |
| Highest Office vote (per USEP) | 131,304,731 | USEP 2008G spreadsheet. Differs from FEC's 131,313,820 by 9,089. **For backtest scoring, use FEC total (131,313,820) as numerator and USEP VEP (213,313,508) as denominator.** |
| VEP turnout rate (USEP, ballots-based) | 0.616 (61.6%) | USEP 2008G spreadsheet "VEP Highest Office" column; matches UF aggregate CSV (`US_VEP_Turnout_Rates_v1.2.csv` row YEAR=2008) |
| **VEP turnout rate (presidential, derived)** | **0.6156 (61.56%)** | **derived** = 131,313,820 / 213,313,508 — backtest comparison rate |
| **Abstentions (presidential, derived)** | **81,999,688** | **derived** = 213,313,508 − 131,313,820 |
| EC | Obama 365 / McCain 173 | confirmed |
| Notes | High-turnout cycle. D wins both popular vote and EC. Other includes Nader 739,034; Barr (LBT) 523,715; Baldwin (CON) 199,750; McKinney (GRE) 161,797. | |

### 2012

| Field | Value | Source / verification |
|---|---|---|
| D candidate | Barack Obama | confirmed |
| D votes | 65,915,795 | **FEC PDF directly verified** — `fec/2012pres.pdf` page 5 (2012 Presidential Popular Vote Summary) |
| D share of total | 51.06% | FEC PDF verified |
| R candidate | Mitt Romney | confirmed |
| R votes | 60,933,504 | **FEC PDF directly verified** — page 5 |
| R share of total | 47.20% | FEC PDF verified |
| Other / third-party votes | 2,236,111 | **derived** = 129,085,410 − 65,915,795 − 60,933,504 (D, R, Total all FEC-verified) |
| Total presidential votes | 129,085,410 | **FEC PDF directly verified** — page 5 (Total row) |
| VEP | 222,437,494 | **UF Election Lab per-year CSV verified** — `Turnout_2012G_v1.0.csv` "United States" row VEP column |
| Total ballots counted (per UF) | 130,231,296 | UF Election Lab CSV verified — TOTAL_BALLOTS_COUNTED |
| Vote for highest office (per UF) | 129,070,906 | UF Election Lab CSV verified — VOTE_FOR_HIGHEST_OFFICE (note: differs from FEC's 129,085,410 by 14,504; FEC is authoritative for vote totals) |
| VEP turnout rate (per UF, ballots-based) | 0.5857 (58.57%) | UF Election Lab CSV verified — VEP_TURNOUT_RATE column |
| **VEP turnout rate (presidential, derived)** | **0.5803 (58.03%)** | **derived** = 129,085,410 / 222,437,494 — backtest comparison rate |
| **Abstentions (presidential, derived)** | **93,352,084** | **derived** = 222,437,494 − 129,085,410 |
| EC | Obama 332 / Romney 206 | confirmed |
| Notes | Lower turnout than 2008. Obama re-election. | |

### 2016

| Field | Value | Source / verification |
|---|---|---|
| D candidate | Hillary Clinton | confirmed |
| D votes | 65,853,514 | **FEC PDF directly verified** — `fec/federalelections2016.pdf` page 5 (2016 Presidential Popular Vote Summary), 48.18% |
| R candidate | Donald Trump | confirmed |
| R votes | 62,984,828 | **FEC PDF directly verified** — page 5, 46.09% |
| Other / third-party votes | 7,830,934 | **derived** = 136,669,276 − 65,853,514 − 62,984,828 (D, R, Total all FEC-verified). Notable: Johnson (LBT) 4,489,341; Stein (GRE) 1,457,218; McMullin 731,991. |
| Total presidential votes | 136,669,276 | **FEC PDF directly verified** — page 5 (Total row) |
| VEP | 230,780,798 | **UF Election Lab per-year CSV verified** — `Turnout_2016G_v1.0.csv` "United States" row VEP column |
| Total ballots counted (per UF) | 138,747,904 | UF Election Lab CSV verified — TOTAL_BALLOTS_COUNTED |
| Vote for highest office (per UF) | 136,753,936 | UF Election Lab CSV verified — VOTE_FOR_HIGHEST_OFFICE (differs from FEC's 136,669,276 by 84,660; FEC authoritative) |
| VEP turnout rate (per UF, ballots-based) | 0.6012 (60.12%) | UF Election Lab CSV verified |
| **VEP turnout rate (presidential, derived)** | **0.5922 (59.22%)** | **derived** = 136,669,276 / 230,780,798 — backtest comparison rate |
| **Abstentions (presidential, derived)** | **94,111,522** | **derived** = 230,780,798 − 136,669,276 |
| EC | Trump 304 / Clinton 227 | confirmed (5 faithless electors in EC) |
| Notes | D wins popular vote, R wins EC. Locally available CCES 2016 microdata covers this cycle. | |

### 2020

| Field | Value | Source / verification |
|---|---|---|
| D candidate | Joe Biden | confirmed |
| D votes | 81,268,924 | **FEC PDF directly verified** — `fec/2020presgeresults.pdf` page 2 (Total row, 51.31%) |
| D share of total | 51.31% | FEC PDF verified |
| R candidate | Donald Trump | confirmed |
| R votes | 74,216,154 | **FEC PDF directly verified** — page 8 (Total row, 46.86%) |
| R share of total | 46.86% | FEC PDF verified |
| Other / third-party votes | 2,898,325 | **derived** = 158,383,403 − 81,268,924 − 74,216,154 (D, R, Total all FEC-verified). Notable: Jorgensen (LBT) 1,865,724; Hawkins (GRE) 405,035. |
| Total presidential votes | 158,383,403 | **FEC PDF directly verified** — page 8 ("TOTAL VOTES" Total row) |
| VEP | 242,077,783 | **UF Election Lab per-year CSV verified** — `Turnout_2020G_v1.1.csv` "United States" row VEP column |
| Total ballots counted (per UF) | 159,738,337 | UF Election Lab CSV verified — TOTAL_BALLOTS_COUNTED (differs from FEC's 158,383,403 by 1,354,934; downballot-only voters / pres undervotes) |
| VEP turnout rate (per UF, ballots-based) | 0.6599 (65.99%) | UF Election Lab CSV verified |
| **VEP turnout rate (presidential, derived)** | **0.6543 (65.43%)** | **derived** = 158,383,403 / 242,077,783 — backtest comparison rate |
| **Abstentions (presidential, derived)** | **83,694,380** | **derived** = 242,077,783 − 158,383,403 |
| EC | Biden 306 / Trump 232 | confirmed |
| Notes | Highest VEP turnout in over a century. **Note**: prior `US_VEP_Turnout_Rates_v1.2.csv` snippet of 0.6638 differs from `Turnout_2020G_v1.1.csv` (0.6599); the per-year file is the more current/authoritative methodology. | |

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

---

## Cross-year comparison anchors

| Metric | 2008 | 2012 | 2016 | 2020 | 2024 |
|---|---:|---:|---:|---:|---:|
| D votes | 69,498,516 | 65,915,795 | 65,853,514 | 81,268,924 | 75,017,613 |
| R votes | 59,948,323 | 60,933,504 | 62,984,828 | 74,216,154 | 77,302,580 |
| Other votes | 1,866,981 | 2,236,111 | 7,830,934 | 2,898,325 | 2,918,109 |
| Total pres votes | 131,313,820 | 129,085,410 | 136,669,276 | 158,383,403 | 155,238,302 |
| VEP | 213,313,508 | 222,437,494 | 230,780,798 | 242,077,783 | 243,803,423 |
| Abstentions | 81,999,688 | 93,352,084 | 94,111,522 | 83,694,380 | 88,565,121 |
| Turnout (pres / VEP) | 61.56% | 58.03% | 59.22% | 65.43% | 63.67% |
| D share of VEP | 32.58% | 29.63% | 28.54% | 33.57% | 30.77% |
| R share of VEP | 28.10% | 27.39% | 27.29% | 30.66% | 31.71% |
| Other share of VEP | 0.88% | 1.01% | 3.39% | 1.20% | 1.20% |
| Abstain share of VEP | 38.44% | 41.97% | 40.78% | 34.57% | 36.33% |

---

## Verified-vs-needs-source summary (post-Phase 2.2)

| Year | D votes | R votes | Total | Other | VEP | Turnout rate | Abstentions |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| 2008 | **✓ FEC PDF** | **✓ FEC PDF** | **✓ FEC PDF** | **✓ FEC PDF** | **✓ USEP** | **✓ USEP + pres-derived** | **✓ derived** |
| 2012 | **✓ FEC PDF** | **✓ FEC PDF** | **✓ FEC PDF** | **✓ derived** | **✓ UF per-year** | **✓ UF + pres-derived** | **✓ derived** |
| 2016 | **✓ FEC PDF** | **✓ FEC PDF** | **✓ FEC PDF** | **✓ derived** | **✓ UF per-year** | **✓ UF + pres-derived** | **✓ derived** |
| 2020 | **✓ FEC PDF** | **✓ FEC PDF** | **✓ FEC PDF** | **✓ derived** | **✓ UF per-year** | **✓ UF + pres-derived** | **✓ derived** |
| 2024 | **✓ FEC PDF** | **✓ FEC PDF** | **✓ FEC PDF** | **✓ derived** | **✓ UF per-year** | **✓ UF + pres-derived** | **✓ derived** |

**Net change from prior pass**: All FEC vote totals now PDF-verified for all 5 years (replacing search-snippet values). VEP filled for all 5 years (2012/2016/2020 from UF per-year CSVs; 2008 from US Elections Project / electproject.org/2008g). Abstentions and per-year share-of-VEP metrics now computable for **all 5 years**. **All 5 years are now fully runnable** for all 9 backtest evaluation metrics.

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
- UF Election Lab 2012G CSV: https://election.lab.ufl.edu/data-downloads/turnoutdata/Turnout_2012G_v1.0.csv
- UF Election Lab 2016G CSV: https://election.lab.ufl.edu/data-downloads/turnoutdata/Turnout_2016G_v1.0.csv
- UF Election Lab 2020G CSV: https://election.lab.ufl.edu/data-downloads/turnoutdata/Turnout_2020G_v1.1.csv
- UF Election Lab 2024G CSV: https://election.lab.ufl.edu/data-downloads/turnoutdata/Turnout_2024G_v0.4.csv
- UF Election Lab 2024 turnout page: https://election.lab.ufl.edu/2024-general-election-turnout/
- US Elections Project (McDonald): https://www.electproject.org/election-data/voter-turnout-data
- US Elections Project 2008G: https://www.electproject.org/2008g
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

**Comparison runnability**: All 5 years (2008, 2012, 2016, 2020, 2024) are fully runnable for all 9 metrics.

---

## Companion file

- `benchmarks-2008-2024.json` — machine-readable mirror with `needs_source: true` flags on every unverified cell.
