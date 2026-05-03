# Local Survey Data Inventory — Phase 2 Backtest V0

**Date**: 2026-05-03
**Status**: Inventory only. No engine code touched. No data downloads attempted.
**Searched**: filesystem-wide (excluding `.git/` and `node_modules`) for files matching `*ces*`, `*cces*`, `*anes*`, `*survey*`, `*voter*`, `*microdata*`, `*pums*`, `*cumulative*`; also enumerated all `.tab .csv .tsv .dta .sav .parquet .rds` files.

---

## Headline

- ✓ **CCES 2016 Common Content** (with voter validation): present locally at `data/cces2016/CCES16_Common_OUTPUT_Feb2018_VV.tab` — 64,601 respondents, 563 columns, 128.5 MB.
- ✗ **CCES 2008 / 2012 / 2020 / 2024**: not present.
- ✗ **ANES**: not present locally. `results/era-weights/anes-acquisition-log.md` documents acquisition as pending Sam's action.

**Phase 2 Backtest V0 is partially unblocked.** The 2016 backtest can proceed end-to-end. The 2008 / 2012 / 2020 / 2024 cycles are blocked on data acquisition (see § 4 and the companion `data-needed-to-run-real-backtest.md`).

---

## 1. Available CCES 2016 microdata

### File

| Field | Value |
|---|---|
| Path | `data/cces2016/CCES16_Common_OUTPUT_Feb2018_VV.tab` |
| Format | tab-delimited text (`.tab`) — header row plus 64,600 data rows |
| Size | 134,761,608 bytes (128.5 MB) |
| Columns | 563 |
| Source | CCES 2016 Common Content Output, February-2018 release with voter validation appended (filename suffix `_VV`) |
| Codebook | `data/cces2016/hcbk0001.htm` … `hcbk0016.htm` plus `hcbkfx0.htm` (alphabetical variable list) and `header.txt`, `sample-rows.txt` |
| Years covered | 2016 (single-cycle file) |
| Vote choice present | ✓ — `CC16_410a` (president, post-election) and `CC16_364b` (president, pre-election); plus `CC16_410a_nv` for non-voter "would have voted for" |
| Turnout / non-voter rows present | ✓ — non-voters are retained in the file. Validated turnout via `CL_matched`, `CL_voterstatus`, and especially `CL_E2016GVM` (general-election validated vote match). `tookpost` flags whether the respondent took the post-election wave at all. |
| Weights present | ✓ — multiple weight columns: `commonweight` (pre), `commonweight_post` (post), `commonweight_vv` (validated voters), `commonweight_vv_post` (validated voters, post-wave), `commonweight_vv_lgbt` (LGBT-balanced) |
| Readable | ✓ — verified by reading header + first two data rows (`sample-rows.txt`) |

### Key columns confirmed present (subset of 563)

**Identification / weights**
- `V101` — respondent ID (CCES per-year naming; cumulative file uses `case_id`)
- `commonweight` / `commonweight_post` — survey weights
- `commonweight_vv` / `commonweight_vv_post` — voter-validation-matched weights
- `tookpost` — binary, took post-election wave

**Vote choice (presidential, post-election wave)**
- `CC16_410a` — president vote choice (post-election; voters only)
- `CC16_410a_nv` — non-voter "would have voted" version (preserves non-voters as data)
- `CC16_410b`, `CC16_412` — senate, house vote choice (post)
- `CC16_316`, `CC16_326` — recall of 2012 vote

**Vote intent (pre-election)**
- `CC16_364` — turnout intent
- `CC16_364b` — president preference (pre)
- `CC16_364c` — preference if undecided

**Validated voter file match**
- `CL_matched` — was the respondent matched to a voter file record at all
- `CL_voterstatus` — registration status from voter file
- `CL_partyaffiliation` — party registration from voter file (where state collects it)
- `CL_state` — voter file state
- `CL_E2016GVM` — **2016 general-election validated turnout** (the gold-standard turnout indicator)
- `CL_E2016PPEP` — primary-election validated turnout

**Party ID / ideology**
- `pid3` — 3-cat party ID
- `pid7` — 7-pt party ID
- `ideo5` — 5-pt ideology self-placement

**Demographics**
- `inputstate` — state of residence
- `birthyr` — year of birth (age computable)
- `gender` — sex
- `educ` — educational attainment
- `race` / `race_other` — race
- `hispanic` / `Hispanic_origin_1..12` — Hispanic origin
- `countyfips`, `cdid113`, `cdid115` — geographic identifiers

**Approval (relevant for engagement / engagement-style proxies)**
- `CC16_320a` (Obama job approval), `CC16_320b` (Congress approval), `CC16_320c` (governor approval), etc.

### Inferred backtest readiness for 2016

The CCES 2016 file contains everything needed for both backtest modes:

- **`oracle_turnout_mode`** (use observed turnout, predict candidate choice): use `CL_E2016GVM` (validated) as the canonical turnout flag; fall back to `tookpost` × `CC16_410a` non-null for self-report. Compute D/R/Other shares among voters using `CC16_410a` weighted by `commonweight_vv_post`.
- **`model_turnout_mode`** (predict turnout AND candidate choice): use the survey-to-PRISM mapper (per A2 spec) to produce engagement scalar + node signature; let the PRISM engine's clearing-bar gate decide voter vs abstainer; aggregate up to weighted shares.

Aggregation to VEP follows § 3 of `backtest-v0-architecture.md`: weighted survey share × benchmark VEP count.

---

## 2. Other survey-style files surfaced by the search (not CES/ANES microdata)

| Path | Source guess | Years | Format | Notes |
|---|---|---|---|---|
| `data/glp1-synthetic-panel.csv` | synthetic — unrelated to political surveys | n/a | CSV | not a political survey; appears unrelated to this project |
| `output/respondent-classifications.csv` | PRISM internal output | n/a | CSV | downstream artifact, not source microdata |
| `results/cces2016-bridge/*.csv` | derived outputs from the existing `src/eval/cces2016-electorate-bridge.ts` pipeline | 2016 | CSV | derived audit/calibration artifacts; not raw microdata |
| `imported-transcripts/jeff-beck-research/*` | research notes | n/a | MD | not survey microdata |

None of these add to the CES/ANES inventory. They are derived artifacts or unrelated data.

---

## 3. Existing prior work using CCES 2016

For situational awareness only — these files exist and should not be modified by this Phase 2 work, per global rules ("Do not modify ... existing mapper specs"):

- `src/eval/cces2016-electorate-bridge.ts` — existing diagnostic pipeline that streams CCES 2016, maps survey items into PRISM node posteriors, and validates against reported/validated presidential vote. Includes Clinton → Sanders counterfactual.
- `dist/eval/cces2016-electorate-bridge.{js,d.ts,js.map}` — built artifacts of the above.
- `results/cces2016-bridge/` — calibration alphas, candidate profile grid, coalition diagnostics, counterfactual EV/national/state, crosswalk audit, node distribution, robustness report, turnout bootstrap/calibration/validation tables, validation-national/state.
- `results/counterfactuals/cces2016-metadata.json`

The Phase 2 Backtest V0 loader (Step 4) is intentionally a **thin, mapper-agnostic file reader** — it normalizes raw rows into a typed structure for downstream consumption. It does not duplicate the bridge's mapping logic. The mapper itself (per A2 spec) is owned elsewhere and remains untouched.

---

## 4. Missing data — what blocks the multi-year backtest

| Year | CES microdata | ANES microdata | Blocker |
|---|---|---|---|
| 2008 | ✗ missing | ✗ missing | acquire CCES 2008 Common Content from Harvard Dataverse (`10.7910/DVN/YUYIVB`) |
| 2012 | ✗ missing | ✗ missing | acquire CCES 2012 Common Content (`10.7910/DVN/HQEVPK`) |
| 2016 | ✓ present | ✗ missing | none for the CES path; ANES 2016 needed only as secondary validation |
| 2020 | ✗ missing | ✗ missing | acquire CES 2020 Common Content (`10.7910/DVN/E9N6PH`); 61K respondents |
| 2024 | ✗ missing | ✗ missing | acquire CES 2024 Common Content (`10.7910/DVN/X11EP6`); 60K respondents |

**Recommended cumulative file** (replaces per-year acquisition for CES side): `Cumulative CES Common Content` at `10.7910/DVN/II2DB6`, v10 covers 2006-2024 with harmonized variable names. ~700K respondents; ~1.5GB depending on format. **However**, the cumulative file deliberately excludes most issue-attitude variables (the harmonized subset is ID/weights/demographics/vote/party/ideology/turnout only). For PRISM mapping work, **per-year files are still required** to merge in issue-attitude items.

ANES Time Series Cumulative File (1948-2024) and per-year studies are documented in `results/era-weights/anes-acquisition-log.md` as pending Sam's download action.

See `data-needed-to-run-real-backtest.md` (companion file) for exact placement and download instructions.

---

## 5. Decision

**Step 4 path** (loader + smoke against CCES 2016) — proceeds.

**Multi-year backtest** (2008, 2012, 2020, 2024) — blocked. Loader will be year-parameterized so the same code path covers additional years once microdata is acquired.

---

## 6. Companion file

- `survey-data-inventory.json` — machine-readable mirror of this inventory
