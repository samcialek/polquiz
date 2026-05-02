/**
 * Diagnostics dashboard smoke.
 *
 * Builds the dashboard, writes status.json + summary.md, then runs the
 * 8 invariant assertions specified in the C5 brief:
 *   1. status.json + summary.md created.
 *   2. status.json validates with JSON.parse.
 *   3. Required sections exist in both artifacts.
 *   4. C1/C2/C3/C4 detected as complete when their summaries are present.
 *   5. No retired active-model terminology in dashboard prose.
 *   6. Missing optional inputs are reported as missing, not failure.
 *   7. Dashboard says coalition gates are diagnostic only.
 *   8. Engagement is described as separate and one-dimensional.
 *
 * Writes the invariant table into results/electorate/dashboard/summary.md
 * (appended after the dashboard body).
 *
 * Usage: npx tsx src/electorate/diagnosticsDashboardSmoke.ts
 */

import * as fs from "fs";
import * as path from "path";
import { buildDashboard, type DashboardStatus } from "./diagnosticsDashboard.js";

const RETIRED_TERMS = [
  /partisan fusion/i,
  /tribalism/i,
  /tribal activation/i,
  /\bPF activation\b/,
  /\bTRB activation\b/,
  /engagement activation/i,
];

function main() {
  const outDir = path.resolve("results/electorate/dashboard");
  fs.mkdirSync(outDir, { recursive: true });

  const { status, markdown } = buildDashboard();
  const statusPath = path.join(outDir, "status.json");
  const summaryPath = path.join(outDir, "summary.md");

  fs.writeFileSync(statusPath, JSON.stringify(status, null, 2));

  type Check = { name: string; pass: boolean; detail: string };
  const checks: Check[] = [];

  // Invariant 1 — files exist on disk after build.
  const statusExists = fs.existsSync(statusPath);
  // summary.md will be written below; check we have markdown content to write.
  checks.push({
    name: "1: status.json file exists on disk after build",
    pass: statusExists,
    detail: `path=${statusPath}`,
  });
  checks.push({
    name: "1: summary.md content prepared",
    pass: markdown.length > 100,
    detail: `markdown chars=${markdown.length}`,
  });

  // Invariant 2 — status.json round-trips JSON.parse.
  let reparsed: DashboardStatus | null = null;
  try {
    const raw = fs.readFileSync(statusPath, "utf8");
    reparsed = JSON.parse(raw);
    checks.push({ name: "2: status.json validates with JSON.parse", pass: !!reparsed, detail: "ok" });
  } catch (err) {
    checks.push({
      name: "2: status.json validates with JSON.parse",
      pass: false,
      detail: (err as Error).message,
    });
  }

  // Invariant 3 — required sections exist.
  const requiredJsonKeys = [
    "pipeline", "testHealth", "architectureNote", "coalitionGateWarning",
    "dataSources", "measurementRisks", "nextActions", "inputFiles",
  ];
  const missingKeys = requiredJsonKeys.filter(k => !(reparsed && k in (reparsed as any)));
  checks.push({
    name: "3: status.json carries all required top-level sections",
    pass: missingKeys.length === 0,
    detail: missingKeys.length ? `missing=${missingKeys.join(",")}` : "ok",
  });
  const requiredMarkdownSections = [
    "## Architecture", "## Pipeline status", "## Data-source roles",
    "## Measurement risk queue", "## Engagement", "## Next actions",
    "## Input file catalog", "## Notes",
  ];
  const missingSections = requiredMarkdownSections.filter(s => !markdown.includes(s));
  checks.push({
    name: "3: summary.md carries all required ## sections",
    pass: missingSections.length === 0,
    detail: missingSections.length ? `missing=${missingSections.join(" | ")}` : "ok",
  });

  // Invariant 4 — C1..C4 detected as complete (their smokes are present).
  const cStages = ["C1", "C2", "C3", "C4"];
  const incompleteC = cStages.filter(id => {
    const s = reparsed?.pipeline.find(p => p.id === id);
    return !s || s.status !== "complete";
  });
  checks.push({
    name: "4: C1/C2/C3/C4 detected as complete (artifacts present)",
    pass: incompleteC.length === 0,
    detail: incompleteC.length ? `not-complete=${incompleteC.join(",")}` : "ok",
  });

  // Invariant 5 — no retired active-model terminology in any generated prose.
  const proseBundle = JSON.stringify(reparsed) + "\n" + markdown;
  const hits: string[] = [];
  for (const re of RETIRED_TERMS) {
    if (re.test(proseBundle)) hits.push(re.source);
  }
  checks.push({
    name: "5: no retired active-model terminology in dashboard prose",
    pass: hits.length === 0,
    detail: hits.length ? `hits=${hits.join(",")}` : "ok",
  });

  // Invariant 6 — missing optional inputs are reported as missing, not failure.
  // Look for an obviously-optional file that's likely absent and confirm it's
  // present:false in inputFiles AND the dashboard didn't blow up.
  const optionalProbe = "results/electorate/mapping/coverage-gap-report-v0.json";
  const probeRow = reparsed?.inputFiles.find(f => f.path === optionalProbe);
  // If A3 is present (Terminal 2 produced it), the probe is moot — skip; if absent,
  // we expect present:false AND the build didn't throw.
  const probeOk = !probeRow || probeRow.present === false;
  // Bonus: the testHealth count should still be > 0 (we have other smokes).
  const buildSurvived = (reparsed?.testHealth.totalChecks ?? 0) > 0;
  checks.push({
    name: "6: missing optional inputs reported as missing, not failure",
    pass: probeOk && buildSurvived,
    detail: `probe=${probeRow ? probeRow.present : "n/a"} buildSurvived=${buildSurvived}`,
  });

  // Invariant 7 — dashboard explicitly says coalition gates are diagnostic only.
  const gateWarningOk = (reparsed?.coalitionGateWarning ?? "").toLowerCase().includes("diagnostic")
    && markdown.toLowerCase().includes("coalition gates are diagnostic only");
  checks.push({
    name: "7: dashboard states coalition gates are diagnostic only",
    pass: gateWarningOk,
    detail: gateWarningOk ? "ok" : "phrase missing from markdown or status.json",
  });

  // Invariant 8 — engagement described as separate + one-dimensional.
  const engPhrases = ["one-dimensional", "separate from policy"];
  const engOk = engPhrases.every(p => markdown.toLowerCase().includes(p));
  checks.push({
    name: "8: engagement described as separate and one-dimensional",
    pass: engOk,
    detail: engOk ? "ok" : `markdown missing one of: ${engPhrases.join(" | ")}`,
  });

  const allPass = checks.every(c => c.pass);

  // Append invariant table to summary.md.
  const md: string[] = [];
  md.push(markdown);
  md.push("");
  md.push("---");
  md.push("");
  md.push("## Diagnostics smoke (this artifact)");
  md.push("");
  md.push(`Run at ${new Date().toISOString()}.`);
  md.push("");
  md.push("| # | Check | Pass | Detail |");
  md.push("|---|---|:--:|---|");
  checks.forEach((c, i) => md.push(`| ${i + 1} | ${c.name} | ${c.pass ? "✓" : "✗"} | ${c.detail} |`));
  md.push("");
  md.push(`**Overall: ${allPass ? "✓ ALL PASS" : "✗ SOME FAILED"}** (${checks.filter(c => c.pass).length}/${checks.length})`);
  md.push("");

  fs.writeFileSync(summaryPath, md.join("\n"));

  console.log(md.slice(-checks.length - 8).join("\n"));
  console.log(`\nWrote: ${statusPath}`);
  console.log(`Wrote: ${summaryPath}`);

  if (!allPass) process.exit(1);
}

main();
