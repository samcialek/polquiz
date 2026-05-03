/**
 * Smoke test for survey-to-PRISM mapper v0.
 *
 * Loads a small sample (rowLimit = 200) per available year, maps each
 * respondent, and asserts:
 *   1. Every required node key is present.
 *   2. Every distribution is finite and normalized.
 *   3. Engagement is in [0, 10] and salience values in [0, 3].
 *   4. Provenance + uncertainty exist for every target.
 *   5. The mapper never reads voteChoiceObserved (contractual spy).
 *   6. Coverage counters report which nodes came from real signal vs fallback.
 *
 * Outputs:
 *   results/electorate/mapper/survey-to-prism-mapper-smoke.json
 *   results/electorate/mapper/survey-to-prism-mapper-smoke.md
 */

import { promises as fs } from "node:fs";
import * as path from "node:path";

import { loadSurveyRespondents } from "./cesBacktestLoader.js";
import type { WeightedSurveyRespondent } from "./surveyBacktestTypes.js";
import { mapSurveyToPrism, validateSignature, type SurveyPrismSignature } from "./surveyToPrismMapper.js";

interface YearTarget {
  year: number;
  filePath: string;
}

const YEARS: YearTarget[] = [
  { year: 2008, filePath: "data/cces2008/cces_2008_common.tab" },
  { year: 2012, filePath: "data/cces2012/CCES12_Common_VV.tab" },
  { year: 2016, filePath: "data/cces2016/CCES16_Common_OUTPUT_Feb2018_VV.tab" },
  { year: 2020, filePath: "data/cces2020/CES20_Common_OUTPUT_vv.csv" },
  { year: 2024, filePath: "data/cces2024/CCES24_Common_OUTPUT_vv_topost_final.csv" },
];

const ROW_LIMIT = 200;

interface NodeCoverage {
  realSignalCount: number;
  fallbackCount: number;
  realSignalShare: number;
}

interface YearReport {
  year: number;
  filePath: string;
  rowsRequested: number;
  rowsMapped: number;
  validationErrors: string[];
  perNodeCoverage: Record<string, NodeCoverage>;
  perBoundaryCoverage: Record<string, NodeCoverage>;
  engagementCoverage: NodeCoverage;
  meanCoverage: { realSignalCount: number; fallbackCount: number; realSignalShare: number };
  voteChoiceContractCheck: { passed: boolean; detail: string };
  sampleSignature: SurveyPrismSignature | null;
}

const NODE_KEYS = ["MAT","CD","CU","MOR","PRO","COM","ZS","ONT_H","ONT_S","EPS","AES"] as const;
const BOUNDARY_KEYS = ["national","ethnic_racial","religious","class","ideological","gender","political_camp"] as const;

function newCoverage(): NodeCoverage { return { realSignalCount: 0, fallbackCount: 0, realSignalShare: 0 }; }

function scrubVoteChoice(r: WeightedSurveyRespondent): WeightedSurveyRespondent {
  // Spy: replace voteChoiceObserved with a sentinel and verify the mapper
  // still produces a valid signature. If the mapper read voteChoiceObserved
  // anywhere, downstream validation would diverge between scrubbed/real.
  const scrubbed: WeightedSurveyRespondent = {
    ...r,
    voteChoiceObserved: "Unknown",
  };
  return scrubbed;
}

function deepEqualSig(a: SurveyPrismSignature, b: SurveyPrismSignature): boolean {
  // Compare every numeric output (positions, salience, distributions,
  // engagement, intensity, boundary saliences). Ignore voteChoiceObserved
  // (which we deliberately differ between the two calls).
  const keys: Array<keyof SurveyPrismSignature> = [
    "MAT","CD","CU","MOR","PRO","COM","ZS","ONT_H","ONT_S","EPS","AES",
  ];
  for (const k of keys) {
    if (JSON.stringify(a[k]) !== JSON.stringify(b[k])) return false;
  }
  if (Math.abs(a.engagement.value - b.engagement.value) > 1e-9) return false;
  if (JSON.stringify(a.moralBoundaries) !== JSON.stringify(b.moralBoundaries)) return false;
  return true;
}

async function runYear(target: YearTarget): Promise<YearReport> {
  const report: YearReport = {
    year: target.year,
    filePath: target.filePath,
    rowsRequested: ROW_LIMIT,
    rowsMapped: 0,
    validationErrors: [],
    perNodeCoverage: Object.fromEntries(NODE_KEYS.map(k => [k, newCoverage()])),
    perBoundaryCoverage: Object.fromEntries(BOUNDARY_KEYS.map(k => [k, newCoverage()])),
    engagementCoverage: newCoverage(),
    meanCoverage: { realSignalCount: 0, fallbackCount: 0, realSignalShare: 0 },
    voteChoiceContractCheck: { passed: true, detail: "" },
    sampleSignature: null,
  };

  const exists = await fs.access(path.join(process.cwd(), target.filePath)).then(() => true).catch(() => false);
  if (!exists) {
    report.validationErrors.push(`source file not present: ${target.filePath}`);
    return report;
  }

  const { respondents } = await loadSurveyRespondents({
    filePath: path.join(process.cwd(), target.filePath),
    year: target.year,
    rowLimit: ROW_LIMIT,
    keepRawVarPayload: true,
  });

  let totalReal = 0;
  let totalFallback = 0;

  for (const r of respondents) {
    const sig = mapSurveyToPrism(r);
    const errors = validateSignature(sig);
    if (errors) {
      // Surface up to 5 errors per year max; truncate the rest.
      for (const e of errors.slice(0, 5)) report.validationErrors.push(`${target.year}/${r.respondentId}: ${e}`);
      continue;
    }
    report.rowsMapped++;
    if (!report.sampleSignature) report.sampleSignature = sig;

    // Per-node + per-boundary + engagement coverage tally.
    for (const k of NODE_KEYS) {
      const c = report.perNodeCoverage[k]!;
      if (sig[k].provenance.source === "real_signal") c.realSignalCount++;
      else c.fallbackCount++;
    }
    for (const b of BOUNDARY_KEYS) {
      const c = report.perBoundaryCoverage[b]!;
      if (sig.moralBoundaries[b].provenance.source === "real_signal") c.realSignalCount++;
      else c.fallbackCount++;
    }
    if (sig.engagement.provenance.source === "real_signal") report.engagementCoverage.realSignalCount++;
    else report.engagementCoverage.fallbackCount++;

    totalReal += sig.coverage.realSignalCount;
    totalFallback += sig.coverage.fallbackCount;
  }

  // Compute shares.
  for (const k of NODE_KEYS) {
    const c = report.perNodeCoverage[k]!;
    const tot = c.realSignalCount + c.fallbackCount;
    c.realSignalShare = tot > 0 ? c.realSignalCount / tot : 0;
  }
  for (const b of BOUNDARY_KEYS) {
    const c = report.perBoundaryCoverage[b]!;
    const tot = c.realSignalCount + c.fallbackCount;
    c.realSignalShare = tot > 0 ? c.realSignalCount / tot : 0;
  }
  {
    const c = report.engagementCoverage;
    const tot = c.realSignalCount + c.fallbackCount;
    c.realSignalShare = tot > 0 ? c.realSignalCount / tot : 0;
  }
  report.meanCoverage = {
    realSignalCount: totalReal,
    fallbackCount: totalFallback,
    realSignalShare: (totalReal + totalFallback) > 0 ? totalReal / (totalReal + totalFallback) : 0,
  };

  // Vote-choice contractual spy: pick first respondent and run through both
  // the original input and a scrubbed copy with voteChoiceObserved=Unknown.
  // Mapper is deterministic and forbidden from reading voteChoiceObserved,
  // so the two calls should produce byte-identical signatures (modulo the
  // voteChoiceObserved field, which the mapper passes through).
  if (respondents.length > 0) {
    const r0 = respondents[0]!;
    const scrubbed = scrubVoteChoice(r0);
    const sigA = mapSurveyToPrism(r0);
    const sigB = mapSurveyToPrism(scrubbed);
    const eq = deepEqualSig(sigA, sigB);
    report.voteChoiceContractCheck = {
      passed: eq,
      detail: eq
        ? "scrub-spy: scrubbing voteChoiceObserved produced byte-identical mapper output (no circular use)"
        : "scrub-spy: scrubbing voteChoiceObserved CHANGED mapper output — mapper is reading the forbidden field",
    };
  }

  return report;
}

function pct(x: number): string { return (100 * x).toFixed(1) + "%"; }

function renderMd(reports: YearReport[]): string {
  const lines: string[] = [];
  lines.push(`# Survey-to-PRISM mapper v0 — smoke summary`);
  lines.push(``);
  lines.push(`**Run at:** ${new Date().toISOString()}`);
  lines.push(`**Years:** ${reports.map(r => r.year).join(", ")}`);
  lines.push(`**Sample size per year:** up to ${ROW_LIMIT} respondents`);
  lines.push(``);
  lines.push(`Each respondent's mapper output was verified against \`validateSignature\` (every distribution finite + normalized, salience values in [0, 3], engagement in [0, 10], provenance present per target). A scrubbing spy verified the mapper does NOT read \`voteChoiceObserved\` for any node.`);
  lines.push(``);

  lines.push(`## Per-year overview`);
  lines.push(``);
  lines.push(`| Year | Rows mapped | Validation errors | Mean real-signal coverage | voteChoice contract |`);
  lines.push(`|---:|---:|---:|---:|:-:|`);
  for (const r of reports) {
    const errStr = r.validationErrors.length === 0 ? "0" : `**${r.validationErrors.length}**`;
    const contract = r.voteChoiceContractCheck.passed ? "✅" : "❌";
    lines.push(`| ${r.year} | ${r.rowsMapped} | ${errStr} | ${pct(r.meanCoverage.realSignalShare)} | ${contract} |`);
  }
  lines.push(``);

  lines.push(`## Per-target real-signal coverage by year`);
  lines.push(``);
  lines.push(`Coverage = share of mapped respondents whose target came from a real survey column (vs. fallback prior).`);
  lines.push(``);
  const allTargets = [
    ...NODE_KEYS,
    ...BOUNDARY_KEYS.map(b => `mb.${b}`),
    "engagement",
  ];
  const headerCells = ["target", ...reports.map(r => String(r.year))];
  lines.push(`| ${headerCells.join(" | ")} |`);
  lines.push(`|${headerCells.map(() => "---").join("|")}|`);
  for (const t of allTargets) {
    const cells = [t];
    for (const r of reports) {
      let cov: NodeCoverage | undefined;
      if (t === "engagement") cov = r.engagementCoverage;
      else if (t.startsWith("mb.")) cov = r.perBoundaryCoverage[t.slice(3)];
      else cov = r.perNodeCoverage[t];
      cells.push(cov ? pct(cov.realSignalShare) : "—");
    }
    lines.push(`| ${cells.join(" | ")} |`);
  }
  lines.push(``);

  lines.push(`## Validation errors (first 20 per year)`);
  lines.push(``);
  let any = false;
  for (const r of reports) {
    if (r.validationErrors.length > 0) {
      any = true;
      lines.push(`### ${r.year}`);
      for (const e of r.validationErrors.slice(0, 20)) lines.push(`- ${e}`);
      lines.push(``);
    }
  }
  if (!any) lines.push(`_(none)_`);
  lines.push(``);

  lines.push(`## Sample signature (first respondent of first year with data)`);
  lines.push(``);
  const sample = reports.find(r => r.sampleSignature)?.sampleSignature ?? null;
  if (sample) {
    lines.push(`Year: ${sample.year}, respondentId: ${sample.respondentId}, weight: ${sample.weight.toFixed(4)}, voteChoiceObserved: ${sample.voteChoiceObserved}`);
    lines.push(``);
    lines.push(`Coverage: ${sample.coverage.realSignalCount} real / ${sample.coverage.fallbackCount} fallback (out of ${sample.coverage.totalTargets} targets)`);
    lines.push(``);
    lines.push(`Engagement: ${sample.engagement.value.toFixed(2)} (${sample.engagement.provenance.source}, vars=${sample.engagement.provenance.vars.join(",")})`);
    lines.push(``);
    lines.push(`Moral boundaries:`);
    for (const b of BOUNDARY_KEYS) {
      const e = sample.moralBoundaries[b];
      lines.push(`- ${b}: salience=${e.salience.toFixed(2)} (${e.provenance.source}${e.provenance.partyIdDerived ? ", party-ID derived" : ""})`);
    }
    lines.push(`- intensity: ${sample.moralBoundaries.intensity.toFixed(2)} (${sample.moralBoundaries.intensityProvenance.source})`);
  } else {
    lines.push(`_(no data files available for any year)_`);
  }
  lines.push(``);

  lines.push(`## Terminology`);
  lines.push(``);
  lines.push(`Engagement is a 1D continuous scalar per ADR canon. Compound moral-circle terminology used throughout. Legacy code identifiers appear only as implementation labels.`);
  return lines.join("\n");
}

async function main() {
  const reports: YearReport[] = [];
  for (const target of YEARS) {
    console.log(`\n=== ${target.year} ===`);
    try {
      const r = await runYear(target);
      reports.push(r);
      console.log(`  rowsMapped=${r.rowsMapped} validationErrors=${r.validationErrors.length} meanCoverage=${(100 * r.meanCoverage.realSignalShare).toFixed(1)}% voteChoiceContract=${r.voteChoiceContractCheck.passed}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`  ERROR: ${msg}`);
      reports.push({
        year: target.year,
        filePath: target.filePath,
        rowsRequested: ROW_LIMIT,
        rowsMapped: 0,
        validationErrors: [`runtime error: ${msg}`],
        perNodeCoverage: Object.fromEntries(NODE_KEYS.map(k => [k, newCoverage()])),
        perBoundaryCoverage: Object.fromEntries(BOUNDARY_KEYS.map(k => [k, newCoverage()])),
        engagementCoverage: newCoverage(),
        meanCoverage: { realSignalCount: 0, fallbackCount: 0, realSignalShare: 0 },
        voteChoiceContractCheck: { passed: false, detail: msg },
        sampleSignature: null,
      });
    }
  }

  const outDir = path.join(process.cwd(), "results/electorate/mapper");
  await fs.mkdir(outDir, { recursive: true });
  const out = {
    schema_version: "v0",
    generator: "src/electorate/surveyToPrismMapperSmoke.ts",
    runAt: new Date().toISOString(),
    rowLimitPerYear: ROW_LIMIT,
    reports,
  };
  await fs.writeFile(path.join(outDir, "survey-to-prism-mapper-smoke.json"), JSON.stringify(out, null, 2));
  await fs.writeFile(path.join(outDir, "survey-to-prism-mapper-smoke.md"), renderMd(reports));
  console.log(`\nWrote ${path.join(outDir, "survey-to-prism-mapper-smoke.json")}`);
  console.log(`Wrote ${path.join(outDir, "survey-to-prism-mapper-smoke.md")}`);

  // Final pass/fail summary line for the runner.
  const allValid = reports.every(r => r.validationErrors.length === 0 && r.voteChoiceContractCheck.passed && r.rowsMapped > 0);
  console.log(`\nOVERALL: ${allValid ? "✅ ALL PASS" : "❌ FAILED"}`);
  if (!allValid) process.exitCode = 1;
}

main().catch(err => { console.error(err); process.exit(1); });
