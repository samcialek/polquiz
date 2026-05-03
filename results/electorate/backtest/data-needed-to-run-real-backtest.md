# Data Needed To Run The Real Multi-Year Backtest

**Date**: 2026-05-03
**Status**: Acquisition checklist. Phase 2 Backtest V0 has produced a working CCES 2016 loader (see `loader-smoke-summary.md`); 4 of 5 backtest years remain blocked on data acquisition.

---

## What's done

- ✓ `data/cces2016/CCES16_Common_OUTPUT_Feb2018_VV.tab` — present locally; loader smoke 7/7 passing.

## What's needed

### CES / CCES microdata for the missing years

| Year | Dataset | Persistent ID | Approx. N | Direct download |
|---|---|---|---|---|
| 2008 | CCES Common Content 2008 | `10.7910/DVN/YUYIVB` | 32,800 | https://dataverse.harvard.edu/dataset.xhtml?persistentId=doi:10.7910/DVN/YUYIVB |
| 2012 | CCES Common Content 2012 | `10.7910/DVN/HQEVPK` | 54,535 | https://dataverse.harvard.edu/dataset.xhtml?persistentId=doi:10.7910/DVN/HQEVPK |
| 2020 | CES Common Content 2020 | `10.7910/DVN/E9N6PH` | 61,000 | https://dataverse.harvard.edu/dataset.xhtml?persistentId=doi:10.7910/DVN/E9N6PH |
| 2024 | CES Common Content 2024 | `10.7910/DVN/X11EP6` | 60,000 | https://dataverse.harvard.edu/dataset.xhtml?persistentId=doi:10.7910/DVN/X11EP6 |

**Preferred format**: `.tab` (tab-delimited) or `.dta` (Stata). The current loader expects tab-delimited but is structured to add a Stata reader later if needed.

**Suggested local placement** (mirrors the 2016 layout):

```
data/cces2008/CCES08_Common_OUTPUT_*.tab + codebook hcbk*.htm
data/cces2012/CCES12_Common_OUTPUT_*.tab + codebook hcbk*.htm
data/cces2020/CES20_Common_OUTPUT_*.tab  + codebook
data/cces2024/CES24_Common_OUTPUT_*.tab  + codebook
```

### Variables required per year

The loader's `RESOLVERS_BY_YEAR` map in `src/electorate/cesBacktestLoader.ts` needs one new entry per year. Each resolver requires column names for:

| Concept | Year-specific column-name conventions |
|---|---|
| Respondent ID | `V101` (per-year file). Cumulative file uses `case_id`. |
| Weight columns (preferred order) | `commonweight_vv_post`, `commonweight_post`, `commonweight_vv`, `commonweight` (some years also have `commonweight_lgbt` and pre-only weights) |
| Validated turnout | `CL_E{YYYY}GVM` for general election (e.g. `CL_E2020GVM`); some years use different validated-turnout column names |
| Took post-election wave | `tookpost` (consistent across years) |
| Presidential vote choice (post) | `CC{yy}_410a` for 2016; `CC{YY}_410a` (uppercase year prefix) for 2018+. 2008 uses `CC*` numbering; 2012 uses `CC12_*`. **Verify the exact column number per year codebook before coding the resolver.** |
| Non-voter "would have voted" | `CC{yy}_410a_nv` (where present — exists in 2016 onward) |
| Demographics | `inputstate`, `birthyr`, `gender`, `educ`, `race`, `hispanic`, `countyfips`, `cdid113`/`cdid115` (matching the cycle's redistricting) |

### Vote-choice code maps per year

The 2016 loader maps `CC16_410a`:
- 1 = Clinton (D)
- 2 = Trump (R)
- 3 = Johnson (Other)
- 4 = Stein (Other)
- 5 = Other / write-in
- 6 = McMullin (Other)
- 7 = "I did not vote in this race" (abstain)
- 8 = Not sure / skipped

Each missing year needs the equivalent code map verified against its codebook:

- 2008: 1 = Obama, 2 = McCain, 3+ = Other / Nader / Barr / etc.
- 2012: 1 = Obama, 2 = Romney, 3+ = Johnson / Stein / Other
- 2020: 1 = Biden, 2 = Trump, 3+ = Jorgensen / Hawkins / Other
- 2024: 1 = Harris, 2 = Trump, 3+ = Kennedy / Stein / West / Oliver / Other

### Alternative: CES Cumulative Common Content

If acquiring per-year files individually is impractical, the **CES Cumulative Common Content** (`10.7910/DVN/II2DB6`, v10, 2006-2024, ~700K respondents, ~1.5GB) covers all five years with harmonized variable names — but **excludes most issue-attitude variables**. The cumulative file gives clean ID/weights/demographics/vote/party/ideology/turnout but not the issue items the survey-to-PRISM mapper needs. So:

- Cumulative file alone is enough for the **loader** to handle five years.
- It is **not enough for the mapper** to produce full PRISM signatures — those need per-year issue items merged in.

A workable hybrid is: cumulative for the loader spine + per-year files merged in via `(year, case_id)` for issue items the mapper needs. This is the path the cumulative codebook explicitly recommends.

### ANES (secondary, not blocking)

`results/era-weights/anes-acquisition-log.md` documents acquisition as pending. ANES is a *secondary* validation source for the Phase 2 backtest, not the primary engine. Acquisition can be deferred without blocking the multi-year CES backtest.

If acquired:
- **ANES Time Series Cumulative File** — https://electionstudies.org/data-center/anes-time-series-cumulative-data-file/
- **ANES 2024 Time Series Study** (full release Aug 2025) — https://electionstudies.org/data-center/2024-time-series-study/

### Benchmark gaps (separate from microdata)

Per `benchmarks-2008-2024.md`, the following benchmark cells are still `null` and need to be filled before national-aggregate comparisons can complete:

- Total presidential votes for 2008, 2012, 2016 — pull from FEC official PDFs cited in benchmarks file
- Other / third-party votes — derive once total verified
- VEP for all five years — pull from US Elections Project / UF Election Lab CSV
- VEP turnout rate for 2020 (66.1 vs 66.6 discrepancy) and 2024 (64.3 vs 62.5 discrepancy) — reconcile against UF Election Lab tables

Without VEP, the comparison side of the backtest cannot complete — predictions can be made but cannot be scored.

---

## Order of operations once data acquired

1. Place CES file under `data/ces{YEAR}/` mirroring the 2016 layout.
2. Open the codebook (HTML or PDF) and verify the year's `CC{yy}_410a` column name + code map.
3. Add a resolver entry to `RESOLVERS_BY_YEAR` in `src/electorate/cesBacktestLoader.ts`.
4. Re-run the loader smoke (with the smoke updated to iterate over years, OR write a new per-year smoke).
5. Verify all 7 invariants pass for the new year.
6. Once at least one new year loads cleanly, the backtest can extend to multi-year.

---

## What this doc explicitly does not require

- Esri Tapestry / ArcGIS Business Analyst (per `decisions/esri-license-decision-v0.md` — defer).
- Voter-file vendor data (L2 / Catalist / TargetSmart) — out of Phase 2 V0 scope.
- ACS microdata (will be needed for poststratification step, but the loader doesn't depend on it).
- GSS / Pew supplementary surveys.
