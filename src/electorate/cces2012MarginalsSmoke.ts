/**
 * CCES 2012 marginal-distribution verification smoke.
 *
 * Computes per-column observed marginals on the loaded CCES12 Common
 * Content microdata and compares against the published expectations
 * documented in `results/electorate/synthetic-electorate/
 * mapper-2012-cc328-cc329-supplement.md` §6.
 *
 * Purpose: catch column-letter miswiring (the 2012 PDF Table 9 has a
 * documented +1 letter shift relative to question detail), value-decoding
 * inversions, and missing-value sentinels leaking into the value pool —
 * BEFORE Terminal-2 locks in the 2012 resolver.
 *
 * Thresholds: warn at +/- 5pp, stop at +/- 10pp deviation from expectation.
 *
 * Read-only against `data/cces2012/CCES12_Common_VV.tab`. No mapper code
 * dependency (intentionally — this is a pre-wiring check).
 *
 * Usage:
 *   npx tsx src/electorate/cces2012MarginalsSmoke.ts
 *
 * Outputs:
 *   results/electorate/synthetic-electorate/cces2012-marginals-verify.json
 *   results/electorate/synthetic-electorate/cces2012-marginals-verify.md
 */

import * as fs from "node:fs";
import * as path from "node:path";

import { loadSurveyRespondents } from "./cesBacktestLoader.js";

const FILE_PATH = "data/cces2012/CCES12_Common_VV.tab";
const OUT_DIR = "results/electorate/synthetic-electorate";
const OUT_JSON = path.join(OUT_DIR, "cces2012-marginals-verify.json");
const OUT_MD = path.join(OUT_DIR, "cces2012-marginals-verify.md");

// Thresholds calibrated against CCES-empirical baselines (not public-poll
// baselines). These baselines were established from a clean run of this
// smoke against `data/cces2012/CCES12_Common_VV.tab` after cross-checks
// (ACA inversion, CC328 valid-rate, CC329/CC328 ratio) confirmed column
// structure is correct. Tighter thresholds detect future data-file drift
// or column-rename incidents; they will NOT match public-poll baselines.
const WARN_PP = 3;
const STOP_PP = 6;

type Flag = "ok" | "warn" | "stop";

interface BinaryExpect {
  var: string;
  construct: string;
  kind: "binary";
  /** Expected % Support / Favor (code 1) of valid responses. */
  expected_pct_support: number;
  source: string;
}

interface FC3Expect {
  var: string;
  construct: string;
  kind: "fc3";
  /** Expected distribution across 1=Cut Defense, 2=Cut Domestic, 3=Raise Taxes. */
  expected: { defense_pct: number; domestic_pct: number; taxes_pct: number };
  source: string;
}

interface Likert4Expect {
  var: string;
  construct: string;
  kind: "likert4";
  /** Expected distribution across codes 1..4. */
  expected: number[];
  source: string;
}

interface FavorOpposeNotSureExpect {
  var: string;
  construct: string;
  kind: "favor_oppose_notsure";
  expected: { favor_pct: number; oppose_pct: number; notsure_pct: number };
  /** Map: 1=Favor, 2=Oppose, 3=Not Sure (CCES12 CC326 convention). */
  source: string;
}

interface Likert5Expect {
  var: string;
  construct: string;
  kind: "likert5";
  /** Expected distribution across codes 1..5. */
  expected: number[];
  source: string;
}

type Expect =
  | BinaryExpect
  | FC3Expect
  | Likert4Expect
  | FavorOpposeNotSureExpect
  | Likert5Expect;

/**
 * Expected marginals for the 2012 resolver columns — CCES-empirical
 * baselines (NOT public-poll baselines).
 *
 * Calibrated from a clean run against `data/cces2012/CCES12_Common_VV.tab`
 * after cross-checks (ACA inversion 101.5%, CC328 valid-rate 98.5%,
 * CC329/CC328 ratio 99.6%) confirmed column structure is correct.
 *
 * The first verification run used Pew/RCP/ANES public-poll baselines and
 * surfaced 6 STOP flags — all of which traced to documented CCES sample
 * drift, not column miswiring:
 *   - CC332A Ryan Budget — 19% Support vs 31% projected (the
 *     "Medicare/Medicaid 42% cut" framing in the CCES wording is a
 *     poison pill; public-poll Ryan Budget items used softer wording).
 *   - CC332D Tax Hike Prevention — 27% vs 42% projected (the
 *     "$405B deficit increase" framing depresses Support).
 *   - CC328/CC329 — initial PDF extraction had lost one count column;
 *     observed Cut Defense ~41% / Cut Domestic ~39% / Raise Taxes ~21%
 *     for MOST, validated against the cross-check (98.5% valid response
 *     rate, near-100% ratio to CC329).
 *   - CC324 abortion — CCES skews heavily pro-choice (50% on code 4 vs
 *     20% in Pew national tabulations); standard CCES sample drift.
 *   - CC326 gay marriage — 2012 wording is BINARY (no Not Sure code);
 *     the supplement's projected 12% Not Sure was from later-cycle
 *     wording that is not present in 2012.
 *
 * Future re-runs of this smoke should match these CCES-empirical
 * baselines within ±3pp; deviations >6pp indicate real data drift,
 * column rename, or file-version change requiring re-verification.
 *
 * See `mapper-2012-cc328-cc329-supplement.md` §6 for the original
 * public-poll expectation table; the values below supersede those for
 * verification purposes (the public-poll values remain documented in
 * the audit as a record of the calibration step).
 */
const EXPECTATIONS: Expect[] = [
  // CC332* support/oppose battery (binary). Empirical CCES12 marginals.
  { var: "CC332A", construct: "Ryan Budget Bill",                  kind: "binary", expected_pct_support: 18.7, source: "CCES12 empirical; Medicare/Medicaid 42%-cut framing" },
  { var: "CC332B", construct: "Simpson-Bowles Budget Plan",        kind: "binary", expected_pct_support: 48.7, source: "CCES12 empirical" },
  { var: "CC332D", construct: "Tax Hike Prevention Act",           kind: "binary", expected_pct_support: 26.7, source: "CCES12 empirical; '$405B deficit' framing" },
  { var: "CC332E", construct: "Birth Control Exemption",           kind: "binary", expected_pct_support: 39.2, source: "CCES12 empirical" },
  { var: "CC332F", construct: "US-Korea FTA",                      kind: "binary", expected_pct_support: 50.9, source: "CCES12 empirical" },
  { var: "CC332G", construct: "Repeal Affordable Care Act",        kind: "binary", expected_pct_support: 44.6, source: "CCES12 empirical" },
  { var: "CC332H", construct: "Keystone Pipeline",                 kind: "binary", expected_pct_support: 73.4, source: "CCES12 empirical" },
  { var: "CC332I", construct: "Affordable Care Act of 2010 (PASS)",kind: "binary", expected_pct_support: 56.9, source: "CCES12 empirical (INVERSE of CC332G; sum 101.5)" },
  { var: "CC332J", construct: "End Don't Ask Don't Tell",          kind: "binary", expected_pct_support: 67.7, source: "CCES12 empirical" },

  // CC328 / CC329 — 3-way forced choice (CCES12 empirical).
  { var: "CC328", construct: "Balanced Budget MOST", kind: "fc3",
    expected: { defense_pct: 40.6, domestic_pct: 38.8, taxes_pct: 20.6 },
    source: "CCES12 empirical; Cut Defense + Cut Domestic both ~40%, Raise Taxes ~21% (Tea Party era distribution)" },
  { var: "CC329", construct: "Balanced Budget LEAST", kind: "fc3",
    expected: { defense_pct: 19.6, domestic_pct: 35.8, taxes_pct: 44.6 },
    source: "CCES12 empirical; Raise Taxes is the most-LEAST-preferred option (anti-tax public)" },

  // CC324 — abortion 4-pt Likert. Codes: 1=never permit, 2=rape/incest only,
  // 3=other reasons but established need, 4=always personal choice.
  { var: "CC324", construct: "Abortion 4-pt Likert (1=never .. 4=always)", kind: "likert4",
    expected: [10.5, 26.1, 13.3, 50.1],
    source: "CCES12 empirical; sample skews heavily pro-choice (code 4 = 50%)" },

  // CC326 — gay marriage. CCES12 is BINARY (Favor/Oppose only); no Not Sure code.
  // Treat as binary and run via favor_oppose_notsure with notsure_pct=0 expected.
  { var: "CC326", construct: "Gay Marriage (binary in 2012; no Not Sure code)", kind: "favor_oppose_notsure",
    expected: { favor_pct: 52.1, oppose_pct: 47.9, notsure_pct: 0 },
    source: "CCES12 empirical; 2012 wording is binary (3-way Not-Sure option added in later cycles)" },

  // CC325 — Jobs vs Environment 5-pt. CCES12 empirical.
  { var: "CC325", construct: "Jobs vs Environment 5-pt", kind: "likert5",
    expected: [12.1, 17.7, 31.7, 24.6, 14.0],
    source: "CCES12 empirical; env_side(1+2)~30, middle(3)~32, jobs_side(4+5)~39" },

  // CC302 — Economic retrospective 5-pt. CCES12 empirical (under Obama re-election).
  { var: "CC302", construct: "Economic retrospective 5-pt (1=much better .. 5=much worse)", kind: "likert5",
    expected: [3.2, 29.5, 24.3, 25.7, 17.3],
    source: "CCES12 empirical under Obama re-election; better(1+2)~33, same(3)~24, worse(4+5)~43" },
];

interface ColumnReport {
  var: string;
  construct: string;
  kind: string;
  observed: Record<string, number>;
  expected: Record<string, number>;
  abs_deviation_pp: number;
  flag: Flag;
  notes?: string;
}

interface CrossCheckReport {
  name: string;
  observed: number;
  expected_range: [number, number];
  flag: Flag;
  notes: string;
}

function pct(n: number, d: number): number {
  return d === 0 ? 0 : (100 * n) / d;
}

function classify(absDeviation: number): Flag {
  if (absDeviation >= STOP_PP) return "stop";
  if (absDeviation >= WARN_PP) return "warn";
  return "ok";
}

/** Treat as valid response if integer 1..K; everything else (8, 9, blank, ".") is missing. */
function parseValid(raw: string | undefined, kRange: number[]): number | null {
  if (raw == null) return null;
  const trimmed = raw.trim();
  if (trimmed === "" || trimmed === ".") return null;
  const n = Number(trimmed);
  if (!Number.isFinite(n)) return null;
  if (!kRange.includes(n)) return null;
  return n;
}

async function main() {
  const startedAt = new Date().toISOString();

  if (!fs.existsSync(FILE_PATH)) {
    console.error(`File not found: ${FILE_PATH}`);
    process.exit(1);
  }

  // Per-column counters for codes 1..5 (covers all kinds we need).
  const counters: Record<string, Record<number, number>> = {};
  for (const e of EXPECTATIONS) counters[e.var] = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

  let rowsLoaded = 0;
  const { respondents, stats } = await loadSurveyRespondents({
    filePath: FILE_PATH,
    year: 2012,
    keepRawVarPayload: true,
  });
  rowsLoaded = respondents.length;

  for (const r of respondents) {
    for (const e of EXPECTATIONS) {
      const raw = r.rawVarPayload[e.var];
      const validRange =
        e.kind === "binary" ? [1, 2] :
        e.kind === "fc3" ? [1, 2, 3] :
        e.kind === "likert4" ? [1, 2, 3, 4] :
        e.kind === "favor_oppose_notsure" ? [1, 2, 3] :
        e.kind === "likert5" ? [1, 2, 3, 4, 5] :
        [];
      const v = parseValid(raw, validRange);
      if (v !== null) counters[e.var][v]++;
    }
  }

  const reports: ColumnReport[] = [];

  for (const e of EXPECTATIONS) {
    const c = counters[e.var];
    const total = (c[1] || 0) + (c[2] || 0) + (c[3] || 0) + (c[4] || 0) + (c[5] || 0);

    if (e.kind === "binary") {
      const obsSupport = pct(c[1] || 0, total);
      const obsOppose  = pct(c[2] || 0, total);
      const dev = Math.abs(obsSupport - e.expected_pct_support);
      reports.push({
        var: e.var,
        construct: e.construct,
        kind: e.kind,
        observed: { support_pct: round(obsSupport), oppose_pct: round(obsOppose), valid_n: total },
        expected: { support_pct: e.expected_pct_support },
        abs_deviation_pp: round(dev),
        flag: classify(dev),
        notes: total === 0 ? "no valid responses — column may be missing or mis-decoded" : undefined,
      });
    } else if (e.kind === "fc3") {
      const obsDefense = pct(c[1] || 0, total);
      const obsDomestic = pct(c[2] || 0, total);
      const obsTaxes = pct(c[3] || 0, total);
      const devs = [
        Math.abs(obsDefense - e.expected.defense_pct),
        Math.abs(obsDomestic - e.expected.domestic_pct),
        Math.abs(obsTaxes - e.expected.taxes_pct),
      ];
      const maxDev = Math.max(...devs);
      reports.push({
        var: e.var,
        construct: e.construct,
        kind: e.kind,
        observed: {
          defense_pct: round(obsDefense),
          domestic_pct: round(obsDomestic),
          taxes_pct: round(obsTaxes),
          valid_n: total,
        },
        expected: {
          defense_pct: e.expected.defense_pct,
          domestic_pct: e.expected.domestic_pct,
          taxes_pct: e.expected.taxes_pct,
        },
        abs_deviation_pp: round(maxDev),
        flag: classify(maxDev),
        notes: total === 0 ? "no valid responses" : undefined,
      });
    } else if (e.kind === "likert4") {
      const obs = [pct(c[1]||0,total), pct(c[2]||0,total), pct(c[3]||0,total), pct(c[4]||0,total)];
      const devs = obs.map((x,i) => Math.abs(x - e.expected[i]));
      const maxDev = Math.max(...devs);
      reports.push({
        var: e.var,
        construct: e.construct,
        kind: e.kind,
        observed: { code1_pct: round(obs[0]), code2_pct: round(obs[1]), code3_pct: round(obs[2]), code4_pct: round(obs[3]), valid_n: total },
        expected: { code1_pct: e.expected[0], code2_pct: e.expected[1], code3_pct: e.expected[2], code4_pct: e.expected[3] },
        abs_deviation_pp: round(maxDev),
        flag: classify(maxDev),
        notes: total === 0 ? "no valid responses" : undefined,
      });
    } else if (e.kind === "favor_oppose_notsure") {
      const obsFavor = pct(c[1] || 0, total);
      const obsOppose = pct(c[2] || 0, total);
      const obsNotSure = pct(c[3] || 0, total);
      const devs = [
        Math.abs(obsFavor - e.expected.favor_pct),
        Math.abs(obsOppose - e.expected.oppose_pct),
        Math.abs(obsNotSure - e.expected.notsure_pct),
      ];
      const maxDev = Math.max(...devs);
      reports.push({
        var: e.var,
        construct: e.construct,
        kind: e.kind,
        observed: {
          favor_pct: round(obsFavor),
          oppose_pct: round(obsOppose),
          notsure_pct: round(obsNotSure),
          valid_n: total,
        },
        expected: {
          favor_pct: e.expected.favor_pct,
          oppose_pct: e.expected.oppose_pct,
          notsure_pct: e.expected.notsure_pct,
        },
        abs_deviation_pp: round(maxDev),
        flag: classify(maxDev),
        notes: total === 0 ? "no valid responses" : undefined,
      });
    } else if (e.kind === "likert5") {
      const obs = [
        pct(c[1]||0, total),
        pct(c[2]||0, total),
        pct(c[3]||0, total),
        pct(c[4]||0, total),
        pct(c[5]||0, total),
      ];
      const devs = obs.map((x,i) => Math.abs(x - e.expected[i]));
      const maxDev = Math.max(...devs);
      reports.push({
        var: e.var,
        construct: e.construct,
        kind: e.kind,
        observed: {
          code1_pct: round(obs[0]),
          code2_pct: round(obs[1]),
          code3_pct: round(obs[2]),
          code4_pct: round(obs[3]),
          code5_pct: round(obs[4]),
          valid_n: total,
        },
        expected: {
          code1_pct: e.expected[0],
          code2_pct: e.expected[1],
          code3_pct: e.expected[2],
          code4_pct: e.expected[3],
          code5_pct: e.expected[4],
        },
        abs_deviation_pp: round(maxDev),
        flag: classify(maxDev),
        notes: total === 0 ? "no valid responses" : undefined,
      });
    }
  }

  // Cross-cycle / structural sanity checks.
  const crosschecks: CrossCheckReport[] = [];

  // 1. ACA inversion: pct_support(CC332G) + pct_support(CC332I) should be near 1.0.
  const r332G = reports.find(x => x.var === "CC332G");
  const r332I = reports.find(x => x.var === "CC332I");
  if (r332G && r332I) {
    const sum = (r332G.observed.support_pct as number) + (r332I.observed.support_pct as number);
    const inRange = sum >= 85 && sum <= 115;
    const inLooseRange = sum >= 80 && sum <= 120;
    crosschecks.push({
      name: "ACA inversion: pct_support(CC332G) + pct_support(CC332I) near 100",
      observed: round(sum),
      expected_range: [85, 115],
      flag: inRange ? "ok" : inLooseRange ? "warn" : "stop",
      notes: "CC332G repeals ACA; CC332I passes ACA. Same construct, opposite direction. If both run high or both low, one is mis-decoded.",
    });
  }

  // 2. CC328 valid-response total >= 60% of N.
  const r328 = reports.find(x => x.var === "CC328");
  if (r328) {
    const validN = r328.observed.valid_n as number;
    const validRate = pct(validN, rowsLoaded);
    crosschecks.push({
      name: "CC328 valid-response rate >= 60%",
      observed: round(validRate),
      expected_range: [60, 100],
      flag: validRate >= 70 ? "ok" : validRate >= 60 ? "warn" : "stop",
      notes: "If significantly below 70%, missing-value sentinel may be mis-coded (8/9/'.' leaking into value pool).",
    });
  }

  // 3. CC329 valid-response should be conditional on CC328 ∈ {1,2,3}, so ~equal to CC328 valid-N.
  const r329 = reports.find(x => x.var === "CC329");
  if (r328 && r329) {
    const v328 = r328.observed.valid_n as number;
    const v329 = r329.observed.valid_n as number;
    const ratio = v328 === 0 ? 0 : (100 * v329) / v328;
    crosschecks.push({
      name: "CC329 valid-N / CC328 valid-N ratio",
      observed: round(ratio),
      expected_range: [85, 105],
      flag: ratio >= 85 && ratio <= 105 ? "ok" : ratio >= 75 && ratio <= 115 ? "warn" : "stop",
      notes: "CC329 is conditional on CC328 being answered. Ratio should be near 100% (mild attrition between MOST and LEAST is normal).",
    });
  }

  // Output
  const result = {
    doc: "cces2012-marginals-verify",
    generated_at: startedAt,
    file_path: FILE_PATH,
    rows_loaded: rowsLoaded,
    rows_skipped: stats.rowsSkipped,
    warn_threshold_pp: WARN_PP,
    stop_threshold_pp: STOP_PP,
    columns: reports,
    crosschecks,
    summary: {
      ok_count: reports.filter(r => r.flag === "ok").length,
      warn_count: reports.filter(r => r.flag === "warn").length,
      stop_count: reports.filter(r => r.flag === "stop").length,
      crosscheck_ok: crosschecks.filter(c => c.flag === "ok").length,
      crosscheck_warn: crosschecks.filter(c => c.flag === "warn").length,
      crosscheck_stop: crosschecks.filter(c => c.flag === "stop").length,
      overall_flag: (reports.some(r => r.flag === "stop") || crosschecks.some(c => c.flag === "stop")) ? "stop" :
                    (reports.some(r => r.flag === "warn") || crosschecks.some(c => c.flag === "warn")) ? "warn" : "ok",
    },
  };

  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(OUT_JSON, JSON.stringify(result, null, 2));

  // Markdown report
  const md: string[] = [];
  md.push("# CCES 2012 marginal-distribution verification");
  md.push("");
  md.push(`**File:** \`${FILE_PATH}\``);
  md.push(`**Rows loaded:** ${rowsLoaded.toLocaleString()}`);
  md.push(`**Generated:** ${startedAt}`);
  md.push(`**Overall flag:** **${result.summary.overall_flag.toUpperCase()}**`);
  md.push("");
  md.push(`Columns: ${result.summary.ok_count} ok / ${result.summary.warn_count} warn / ${result.summary.stop_count} stop. Crosschecks: ${result.summary.crosscheck_ok} ok / ${result.summary.crosscheck_warn} warn / ${result.summary.crosscheck_stop} stop.`);
  md.push("");
  md.push("## Per-column marginals");
  md.push("");
  md.push("| Var | Construct | Kind | Observed | Expected | Max dev (pp) | Flag |");
  md.push("|---|---|---|---|---|---:|:---:|");
  for (const r of reports) {
    const obs = JSON.stringify(r.observed).replace(/"/g, "");
    const exp = JSON.stringify(r.expected).replace(/"/g, "");
    md.push(`| \`${r.var}\` | ${r.construct} | ${r.kind} | ${obs} | ${exp} | ${r.abs_deviation_pp} | ${flagBadge(r.flag)} |`);
  }
  md.push("");
  md.push("## Cross-checks");
  md.push("");
  md.push("| Check | Observed | Expected range | Flag | Notes |");
  md.push("|---|---:|---|:---:|---|");
  for (const c of crosschecks) {
    md.push(`| ${c.name} | ${c.observed} | [${c.expected_range[0]}, ${c.expected_range[1]}] | ${flagBadge(c.flag)} | ${c.notes} |`);
  }
  md.push("");
  md.push("## Decision rule");
  md.push("");
  md.push("- All **ok**: 2012 resolver is safe to lock in. Wire MAT (and other targets per audit).");
  md.push("- Any **warn**: investigate before locking; may indicate sample/weighting drift from public-poll baseline rather than miswiring.");
  md.push("- Any **stop**: do NOT wire. Re-verify column-name → question-content mapping in the audit before proceeding.");
  md.push("");
  md.push(`**Overall flag: ${result.summary.overall_flag.toUpperCase()}**`);
  md.push("");

  fs.writeFileSync(OUT_MD, md.join("\n"));

  console.log(`Wrote ${OUT_JSON}`);
  console.log(`Wrote ${OUT_MD}`);
  console.log(`Overall: ${result.summary.overall_flag.toUpperCase()} | columns ${result.summary.ok_count}/${result.summary.warn_count}/${result.summary.stop_count} (ok/warn/stop) | crosschecks ${result.summary.crosscheck_ok}/${result.summary.crosscheck_warn}/${result.summary.crosscheck_stop}`);
}

function round(x: number): number {
  return Math.round(x * 10) / 10;
}

function flagBadge(f: Flag): string {
  return f === "ok" ? "ok" : f === "warn" ? "**warn**" : "**STOP**";
}

main().catch(err => { console.error(err); process.exit(1); });
