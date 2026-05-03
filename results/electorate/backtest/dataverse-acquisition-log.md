# Harvard Dataverse Acquisition Log — CES/CCES 2008/2012/2020/2024

**Date**: 2026-05-03
**Status**: Acquisition log. Raw microdata (`.tab`, `.csv`, `.dta`) is downloaded under `data/cces{YEAR}/` and remains **untracked** per global rules. Codebooks (small) are also downloaded but kept untracked.

## Method

Dataverse API metadata pulled via:
```
curl -fsS -o data/backtest-sources/dataverse-meta/dv-{YEAR}.json \
  "https://dataverse.harvard.edu/api/datasets/:persistentId/?persistentId=doi:{DOI}"
```

File downloads use:
```
curl -fsSL -o data/cces{YEAR}/{filename} \
  "https://dataverse.harvard.edu/api/access/datafile/{fileId}"
```

All 4 datasets resolved to `versionState: RELEASED`, all listed files `restricted: false` (public). No Dataverse account / API token required.

## Per-dataset summary

### CCES 2008 (`doi:10.7910/DVN/YUYIVB`) — 9 files, all public

| File ID | Filename | Type | Size | Recommended |
|---|---|---|---:|---|
| 2438385 | `cces_2008_common.tab` | text/tab-separated-values | 57.2 MB | **microdata** |
| 2301849 | `CCES 2008 Guide v4.doc` | application/msword | 0.8 MB | **codebook** |
| 1537803 | CCES Election File (House and Senate).csv | text/plain | <0.1 MB | optional |
| 1537805 | CCES Election File (House and Senate Notes).csv | text/plain | <0.1 MB | optional |
| 1537808 | House Roll Call.csv | text/plain | <0.1 MB | optional |
| 1539167 | Prez by State.csv | text/plain | <0.1 MB | optional |
| 1537806 | Senator 1 Roll Call.csv | text/plain | <0.1 MB | optional |
| 1537807 | Senator 2 Roll Call.csv | text/plain | <0.1 MB | optional |
| 1537810 | state legislature party seats.xls | vnd.ms-excel | <0.1 MB | optional |

**Download commands**:
```bash
curl -fsSL -o data/cces2008/cces_2008_common.tab        "https://dataverse.harvard.edu/api/access/datafile/2438385"
curl -fsSL -o data/cces2008/CCES_2008_Guide_v4.doc      "https://dataverse.harvard.edu/api/access/datafile/2301849"
```

### CCES 2012 (`doi:10.7910/DVN/HQEVPK`) — 4 files, all public

| File ID | Filename | Type | Size | Recommended |
|---|---|---|---:|---|
| 2500154 | `CCES12_Common_VV.tab` | text/tab-separated-values | 111.2 MB | **microdata (with voter validation)** |
| 2456347 | `commoncontent2012.tab` | text/tab-separated-values | 105.4 MB | alternate (no VV) |
| 2688939 | `cces_guide_2012.pdf` | application/pdf | 0.5 MB | **codebook** |
| 3036513 | `vote-validation-guide-2012.pdf` | application/pdf | 0.2 MB | **VV codebook** |

**Download commands** (prefer the VV file — matches the 2016 file we already use):
```bash
curl -fsSL -o data/cces2012/CCES12_Common_VV.tab        "https://dataverse.harvard.edu/api/access/datafile/2500154"
curl -fsSL -o data/cces2012/cces_guide_2012.pdf         "https://dataverse.harvard.edu/api/access/datafile/2688939"
curl -fsSL -o data/cces2012/vote-validation-guide-2012.pdf "https://dataverse.harvard.edu/api/access/datafile/3036513"
```

### CES 2020 (`doi:10.7910/DVN/E9N6PH`) — 7 files, all public

| File ID | Filename | Type | Size | Recommended |
|---|---|---|---:|---|
| 4949558 | `CES20_Common_OUTPUT_vv.csv` | text/csv | 179.6 MB | **microdata (CSV format — preferred)** |
| 4949545 | CES20_Common_OUTPUT_vv.dta | application/x-stata-14 | 810.7 MB | Stata (skip — no Stata reader yet) |
| 5793681 | `CCES Guide 2020.pdf` | application/pdf | 0.8 MB | **codebook** |
| 4462965 | `CES20_Common_pre_qx.pdf` | application/pdf | 0.7 MB | **questionnaire (pre)** |
| 4462966 | `CES20_Common_post_qx.pdf` | application/pdf | 0.8 MB | **questionnaire (post)** |
| 5793679 | misidentifiedNCrespondents.tab | text/tab-separated-values | <0.1 MB | NC errata data |
| 5793680 | Technical Memo on NC Respondents...pdf | application/pdf | 0.1 MB | NC errata memo |

**Download commands**:
```bash
curl -fsSL -o data/cces2020/CES20_Common_OUTPUT_vv.csv  "https://dataverse.harvard.edu/api/access/datafile/4949558"
curl -fsSL -o data/cces2020/CCES_Guide_2020.pdf         "https://dataverse.harvard.edu/api/access/datafile/5793681"
curl -fsSL -o data/cces2020/CES20_Common_pre_qx.pdf     "https://dataverse.harvard.edu/api/access/datafile/4462965"
curl -fsSL -o data/cces2020/CES20_Common_post_qx.pdf    "https://dataverse.harvard.edu/api/access/datafile/4462966"
```

### CES 2024 (`doi:10.7910/DVN/X11EP6`) — 5 files, all public

| File ID | Filename | Type | Size | Recommended |
|---|---|---|---:|---|
| 12050325 | `CCES24_Common_OUTPUT_vv_topost_final.csv` | text/csv | 175.2 MB | **microdata (CSV format — preferred)** |
| 12050327 | CCES24_Common_OUTPUT_vv_topost_final.dta | application/x-stata-14 | 947.5 MB | Stata (skip — no Stata reader yet) |
| 12050326 | `CES_2024_GUIDE_vv.pdf` | application/pdf | 1.1 MB | **codebook** |
| 11049825 | `CCES24_Common_post.docx` | docx | 0.1 MB | questionnaire (post) |
| 11032062 | `CCES24_Common_pre.docx` | docx | 0.2 MB | questionnaire (pre) |

**Download commands**:
```bash
curl -fsSL -o data/cces2024/CCES24_Common_OUTPUT_vv_topost_final.csv "https://dataverse.harvard.edu/api/access/datafile/12050325"
curl -fsSL -o data/cces2024/CES_2024_GUIDE_vv.pdf       "https://dataverse.harvard.edu/api/access/datafile/12050326"
curl -fsSL -o data/cces2024/CCES24_Common_post.docx     "https://dataverse.harvard.edu/api/access/datafile/11049825"
curl -fsSL -o data/cces2024/CCES24_Common_pre.docx      "https://dataverse.harvard.edu/api/access/datafile/11032062"
```

## Acquisition status (updated post-Step 3 attempt)

See `dataverse-acquisition-log.json` for the per-file `downloaded_this_run` boolean and on-disk size after Step 3 download attempt.

## Notes on file format choice

- **CSV vs TAB**: 2008 and 2012 use `.tab` (tab-delimited); 2020 and 2024 use `.csv` (comma-separated). The loader currently splits on `\t` for the existing CCES 2016 path. The loader's resolver will need a per-year delimiter setting to handle both.
- **DTA (Stata)**: Skip for v0. Repo has no Stata reader. Re-evaluate if csv/tab is somehow unavailable in a future cycle.
- **VV (Voter Validation)**: Prefer the `_vv` files where they exist. They include the `CL_E*` validated-turnout columns the loader uses for gold-standard turnout classification. CCES 2008's `cces_2008_common.tab` does not have a separate VV variant in this DOI listing — verify against the 2008 codebook whether VV columns are inline or in a separate file.

## File-format implications for the loader

The Phase 2 loader's tab-split logic (`line.split("\t")`) handles 2008/2012/2016 cleanly. For 2020/2024 the loader needs:
- A delimiter override (CSV with quoted strings + commas)
- Quoted-string handling (CSV often quotes fields containing commas or quotes themselves)

Recommended next-step structure: extend `RESOLVERS_BY_YEAR` entries with a `delimiter` field (`"\t"` vs `","`) and a `quoteChar` field (none vs `"`). The smoke runs per-year as it does today.

## Companion file

- `dataverse-acquisition-log.json` — machine-readable mirror with file IDs, sizes, restrictions, download commands, and post-attempt status.
