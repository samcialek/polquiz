# Data Needed To Run The Real Multi-Year Backtest

**Date**: 2026-05-03 (updated post-Phase 2.1)
**Status**: Acquisition checklist. Phase 2.1 acquired CCES/CES microdata for 2008/2012/2020/2024 from Harvard Dataverse and added loader resolvers for 2012/2020/2024. **4 of 5 years now load cleanly with 7/7 invariants passing**; 2008 alone still blocked on codebook deep-dive for V### opaque column naming.

---

## What's done after Phase 2.1

### Microdata acquired locally (untracked)

| Year | File | Size | Loader resolver | Smoke result |
|---|---|---|---|---|
| 2008 | `data/cces2008/cces_2008_common.tab` | 60 MB | ✗ blocked (codebook) | n/a |
| 2012 | `data/cces2012/CCES12_Common_VV.tab` | 117 MB | ✓ added | **7/7 pass** |
| 2016 | `data/cces2016/CCES16_Common_OUTPUT_Feb2018_VV.tab` | 128 MB | ✓ (existing) | **7/7 pass** |
| 2020 | `data/cces2020/CES20_Common_OUTPUT_vv.csv` | 188 MB | ✓ added | **7/7 pass** |
| 2024 | `data/cces2024/CCES24_Common_OUTPUT_vv_topost_final.csv` | 184 MB | ✓ added | **7/7 pass** |

### Codebooks acquired locally (untracked)

- `data/cces2008/CCES_2008_Guide_v4.doc` (Word, 0.8 MB)
- `data/cces2012/cces_guide_2012.pdf` (0.5 MB) + `vote-validation-guide-2012.pdf` (0.2 MB)
- `data/cces2020/CCES_Guide_2020.pdf` (0.8 MB) + pre/post questionnaires (~0.8 MB each)
- `data/cces2024/CES_2024_GUIDE_vv.pdf` (1.1 MB) + pre/post .docx (~0.2 MB total)

### Benchmark data acquired locally (untracked)

- All 5 FEC PDFs cached under `data/backtest-sources/fec/`
- UF Election Lab CSVs (1948-2022 + 2024G) under `data/backtest-sources/election-lab/`
- VEP turnout rates for all 5 years now verified in `benchmarks-2008-2024.{md,json}` from UF source

---

## Remaining blocker: 2008 loader resolver

### Why 2008 is harder than the other years

CCES 2008 uses opaque `V###` column naming (e.g., `V100`, `V201`, `V601`) inherited from the legacy YouGov coding scheme. Subsequent CCES cycles switched to readable column names (`commonweight`, `tookpost`, `CC{year}_410a`, etc.). The 2008 file's structural columns can't be identified by name alone.

### Best-guess column mapping (needs codebook verification)

From data inspection:

| Concept | Best-guess column | Confidence | Notes |
|---|---|---|---|
| Respondent ID | `V100` | high | First column; integer values matching survey-respondent-count expectation |
| Weight | `V201` | medium | First decimal-valued column after V100; values in 0.1-15 range typical for survey weights |
| Tookpost | unknown | low | No "tookpost" column literally present; may be encoded differently or implied by post-wave column NAs |
| Validated turnout | unknown | low | Need to identify which V### family carries voter file match (V501-V521 candidate range from initial scan) |
| Presidential vote choice | `CC410` | high | Column name confirmed; codes likely 1=Obama, 2=McCain, 3+=Other but exact map needs codebook |
| Demographics | `V206`+ family | medium | State, age, gender, race typically in V200-V300 range |

### What's needed to unblock 2008

1. **Read `CCES_2008_Guide_v4.doc`** (Word format — needs LibreOffice / textract / similar to extract). The codebook lists every V### column with its variable name and value codes.
2. Confirm:
   - Weight column name (likely V201 or in V601-V605 family)
   - Tookpost column or equivalent post-wave-takers indicator
   - Validated voter turnout column (or confirm there isn't one and use tookpost+CC410 fallback)
   - CC410 value-code map
3. Add a `CCES_2008` resolver entry in `src/electorate/cesBacktestLoader.ts`.
4. Add 2008 to `YEAR_TARGETS` in `cesBacktestLoaderSmoke.ts`.
5. Re-run smoke; confirm 7/7 pass for 2008.

Estimated effort once codebook is read: ~30 minutes.

---

## Other remaining gaps (separate from 2008)

### Benchmark VEP for 2008/2012/2016/2020

The UF 1948-2022 CSV provides turnout *rates* but not VEP *counts* for these years. To fill VEP:

- Pull McDonald's per-year archive files from the UF Election Lab data downloads (e.g., `Turnout_2020G_*.csv`, `Turnout_2016G_*.csv`)
- These provide per-state and US-total VEP, similar to the 2024 file
- Once VEP is filled per year, derive abstentions and per-state turnout

### ANES (secondary, not blocking)

`results/era-weights/anes-acquisition-log.md` documents acquisition as pending. ANES is a *secondary* validation source for the Phase 2 backtest, not the primary engine. Acquisition can be deferred without blocking the multi-year CES backtest.

### Issue-attitude variable mapping per cycle

Each year's loader produces a `rawVarPayload` carrying all 500-700 columns. The mapper (per A2 spec at `results/electorate/mapping/survey-to-prism-v0.md`) will need cycle-specific issue-attitude column names mapped to each PRISM target. The CCES question numbering shifts each cycle (e.g., `CC16_331` immigration battery → `CC20_331a` etc.); the mapper will need a `RESOLVERS_BY_YEAR`-style structure for issue items, similar to the loader's resolver pattern.

---

## What's NOT needed

Per `decisions/esri-license-decision-v0.md` and `acs-esri-geography-intake.md`:

- Esri Tapestry / ArcGIS Business Analyst (deferred)
- Voter-file vendor data (L2 / Catalist / TargetSmart) — out of Phase 2 V0 scope
- ACS microdata (will be needed for poststratification step downstream of mapper, but the loader doesn't depend on it)
- GSS / Pew supplementary surveys

---

## Status summary

```
Backtest scaffold:            ✓ done (commit 2e136e2)
CCES 2016 loader:             ✓ working, 7/7 smoke pass
Benchmark turnout rates:      ✓ all 5 years verified from UF
2024 benchmark:               ✓ fully runnable (D, R, Other, Total, VEP, abstentions all verified)
CES microdata 2008/12/20/24:  ✓ all 4 acquired (~550 MB total, untracked)
Loader resolvers:             ✓ 2012, 2020, 2024 added; 2016 retained
Multi-year smoke:             ✓ 28/28 invariant checks pass across 4 loaded years
2008 loader resolver:         ✗ blocked on V### codebook deep-dive
2008/12/16/20 benchmark VEP:  ⚠ needs UF per-year archive files
Five-year backtest end-to-end: blocked on 2008 codebook + mapper integration
```
