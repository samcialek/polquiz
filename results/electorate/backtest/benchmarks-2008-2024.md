# Phase 2 Backtest V0 — Ground-Truth Benchmarks (2008-2024)

**Date**: 2026-05-03
**Status**: Documentation only. No engine code touched.
**Purpose**: Evaluation targets for the national-level backtest. **Not** for tuning the model. The simulator's predicted weighted popular vote and abstentions are compared against these numbers; benchmarks are read-only.

## Source hierarchy (fixed)

1. **Official presidential vote totals** — FEC official election results. PDF or XLSX.
2. **VEP (Voting-Eligible Population)** — U.S. Elections Project (Michael McDonald) / UF Election Lab.
3. **CPS Voting and Registration Supplement** — Census secondary validation for turnout and subgroup turnout.
4. **CES/CCES** — primary survey microdata (separate file: `survey-data-inventory.md`).
5. **ANES** — secondary validation, not primary aggregate engine.

## Conventions

- **VEP** is the primary denominator. If a year's VEP cannot be locally verified from the McDonald source, it is marked `null` with `needs_source: true`.
- **Vote totals** come from FEC official PDFs/spreadsheets where directly read; otherwise cited via authoritative search snippet with `verification` flag.
- **Other** = Total presidential votes − D − R, computed only where the FEC total is locally verified.
- **Abstentions** = VEP − Total presidential votes, computed only where both are verified.
- This document does **not invent numbers**. Where exact figures cannot be verified locally, the cell is `null` with `needs_source: true` and the gap is flagged for follow-up.

---

## Benchmark table

### 2008

| Field | Value | Source / verification |
|---|---|---|
| D candidate | Barack Obama | confirmed |
| D votes | 69,498,516 | FEC search snippet — verify against [FEC 2008 official results](https://www.fec.gov/resources/cms-content/documents/federalelections2008.pdf) |
| D share of total | 52.93% | FEC search snippet (verification: high confidence; matches widely-cited official number) |
| R candidate | John McCain | confirmed |
| R votes | 59,948,323 | FEC search snippet — verify against [FEC 2008 official results](https://www.fec.gov/resources/cms-content/documents/federalelections2008.pdf) |
| R share of total | 45.65% | FEC search snippet |
| Other / third-party votes | null | `needs_source: true` — derive as Total − D − R after pulling FEC table |
| Total presidential votes | null | `needs_source: true` — pull from FEC PDF "Total Vote" row |
| VEP | null | `needs_source: true` — pull from [UF Election Lab](https://election.lab.ufl.edu/voter-turnout/) |
| VEP turnout rate | 0.616 (61.6%) | UF Election Lab search snippet |
| Abstentions | null | derived = VEP − Total once both verified |
| EC | Obama 365 / McCain 173 | confirmed |
| Notes | High-turnout cycle; D wins both popular vote and EC; "Other" includes Nader, Barr, McKinney | |

### 2012

| Field | Value | Source / verification |
|---|---|---|
| D candidate | Barack Obama | confirmed |
| D votes | 65,915,795 | FEC search snippet — verify against [FEC 2012 official results](https://www.fec.gov/documents/1689/federalelections2012.pdf) |
| D share of total | 51.1% | FEC search snippet |
| R candidate | Mitt Romney | confirmed |
| R votes | 60,933,504 | FEC search snippet — verify against [FEC 2012 official results](https://www.fec.gov/documents/1689/federalelections2012.pdf) |
| R share of total | 47.2% | FEC search snippet |
| Other / third-party votes | null | `needs_source: true` |
| Total presidential votes | null | `needs_source: true` — pull from FEC PDF |
| VEP | null | `needs_source: true` |
| VEP turnout rate | 0.580 (58.0%) | UF Election Lab search snippet |
| Abstentions | null | derived = VEP − Total once both verified |
| EC | Obama 332 / Romney 206 | confirmed |
| Notes | Lower turnout than 2008; Obama re-election | |

### 2016

| Field | Value | Source / verification |
|---|---|---|
| D candidate | Hillary Clinton | confirmed |
| D votes | 65,853,514 | FEC search snippet — verify against [FEC 2016 official results](https://www.fec.gov/introduction-campaign-finance/election-results-and-voting-information/federal-elections-2016/) |
| R candidate | Donald Trump | confirmed |
| R votes | 62,984,828 | FEC search snippet — verify against FEC 2016 official |
| Other / third-party votes | null | `needs_source: true` — 2016 had elevated third-party (Johnson L, Stein G, McMullin); derive as Total − D − R |
| Total presidential votes | 136,669,276 (≈136.7M per FEC search snippet) | FEC search snippet — verify exact |
| VEP | null | `needs_source: true` |
| VEP turnout rate | 0.593 (59.3%) | UF Election Lab search snippet |
| Abstentions | null | derived = VEP − Total once both verified |
| EC | Trump 304 / Clinton 227 | confirmed (5 faithless electors) |
| Notes | D wins popular vote, R wins EC. Locally available CCES 2016 microdata covers this cycle. Elevated third-party share. | |

### 2020

| Field | Value | Source / verification |
|---|---|---|
| D candidate | Joe Biden | confirmed |
| D votes | 81,268,773 | FEC search snippet — verify against [FEC 2020 federal elections](https://www.fec.gov/resources/cms-content/documents/federalelections2020.pdf) |
| D share of total | 51.31% | FEC search snippet |
| R candidate | Donald Trump | confirmed |
| R votes | 74,216,728 | FEC search snippet — verify against [FEC 2020 official](https://www.fec.gov/resources/cms-content/documents/2020presgeresults.pdf) |
| R share of total | 46.86% | FEC search snippet |
| Other / third-party votes | null | `needs_source: true` |
| Total presidential votes | ≈158,400,000 (UF Election Lab "158.4 million ballots cast") | UF Election Lab search snippet — verify exact via FEC |
| VEP | null | `needs_source: true` (UF Election Lab cited 66.6% turnout in one snippet, 66.1% in another — minor inconsistency requires verification) |
| VEP turnout rate | 0.661 OR 0.666 — discrepancy | conflicting search snippets; reconcile against UF Election Lab tables before use |
| Abstentions | null | derived once VEP confirmed |
| EC | Biden 306 / Trump 232 | confirmed |
| Notes | Highest VEP turnout in over a century. Conflicting turnout-rate citations require explicit reconciliation. | |

### 2024

| Field | Value | Source / verification |
|---|---|---|
| D candidate | Kamala Harris | confirmed |
| D votes | 75,017,613 | **FEC PDF directly verified** — [Official 2024 Presidential General Election Results](https://www.fec.gov/resources/cms-content/documents/2024presgeresults.pdf), p. 3 |
| D share of total | 48.32% | FEC PDF directly verified — p. 3 |
| R candidate | Donald Trump | confirmed |
| R votes | 77,302,580 | **FEC PDF directly verified** — p. 5 |
| R share of total | 49.80% | FEC PDF directly verified — p. 5 |
| Other / third-party votes | 2,918,109 | **derived** = 155,238,302 − 75,017,613 − 77,302,580 (D + R both FEC-verified; total FEC-verified) |
| Total presidential votes | 155,238,302 | **FEC PDF directly verified** — p. 6 "Total Votes" Total row |
| VEP | null | `needs_source: true` — pull from UF Election Lab CSV |
| VEP turnout rate | 0.643 OR 0.625 — discrepancy | conflicting search snippets (one source 64.3%, another 62.5%); reconcile against [UF Election Lab 2024 turnout](https://election.lab.ufl.edu/2024-general-election-turnout/) before use |
| Abstentions | null | derived once VEP confirmed |
| EC | Trump 312 / Harris 226 | FEC PDF directly verified — p. 1 |
| Notes | First R popular-vote win since 2004. Notable third-party: Kennedy 756,393, De La Cruz 166,175, Stein (Other column), Oliver, etc. Total Other 2,918,109. | |

---

## Verified-vs-needs-source summary

| Year | D votes | R votes | Total | Other | VEP | Turnout rate | Abstentions |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| 2008 | ✓ snippet | ✓ snippet | ⚠ needs source | ⚠ derive | ⚠ needs source | ✓ snippet | ⚠ derive |
| 2012 | ✓ snippet | ✓ snippet | ⚠ needs source | ⚠ derive | ⚠ needs source | ✓ snippet | ⚠ derive |
| 2016 | ✓ snippet | ✓ snippet | ✓ snippet (verify exact) | ⚠ derive | ⚠ needs source | ✓ snippet | ⚠ derive |
| 2020 | ✓ snippet | ✓ snippet | ✓ snippet (verify exact) | ⚠ derive | ⚠ needs source + reconcile | ⚠ reconcile (66.1 vs 66.6) | ⚠ derive |
| 2024 | **✓ FEC PDF** | **✓ FEC PDF** | **✓ FEC PDF** | **✓ derived** | ⚠ needs source | ⚠ reconcile (64.3 vs 62.5) | ⚠ derive |

**Highest-confidence row**: 2024. **Largest gap**: VEP for every year (no McDonald data tables locally verified; turnout-rate citations are inconsistent for 2020 and 2024).

---

## Source URLs (for follow-up verification)

- FEC 2008 official: https://www.fec.gov/resources/cms-content/documents/federalelections2008.pdf
- FEC 2012 official: https://www.fec.gov/documents/1689/federalelections2012.pdf
- FEC 2016 federal elections page: https://www.fec.gov/introduction-campaign-finance/election-results-and-voting-information/federal-elections-2016/
- FEC 2020 official: https://www.fec.gov/resources/cms-content/documents/federalelections2020.pdf
- FEC 2020 presidential results: https://www.fec.gov/resources/cms-content/documents/2020presgeresults.pdf
- FEC 2024 presidential results (PDF): https://www.fec.gov/resources/cms-content/documents/2024presgeresults.pdf
- FEC 2024 presidential results (XLSX): https://www.fec.gov/documents/5645/2024presgeresults.xlsx
- UF Election Lab voter turnout: https://election.lab.ufl.edu/voter-turnout/
- UF Election Lab 2024 turnout: https://election.lab.ufl.edu/2024-general-election-turnout/
- US Elections Project (McDonald): https://www.electproject.org/election-data/voter-turnout-data
- US Elections Project VAP-vs-VEP methodology: https://www.electproject.org/election-data/faq/vap-v-vap
- Census 2024 voting and registration: per task brief — verify current URL
- CPS Voting and Registration Supplement: census.gov/topics/public-sector/voting

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

Comparison can only be performed once VEP is locally verified for the year in question.

---

## Companion file

- `benchmarks-2008-2024.json` — machine-readable mirror with `needs_source: true` flags on every unverified cell.
