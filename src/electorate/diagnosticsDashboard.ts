/**
 * Diagnostics dashboard for the electorate simulator pipeline.
 *
 * Read-only. Scans for known artifacts under results/electorate/ and
 * src/electorate/, builds a status object summarizing pipeline health,
 * smoke counts, data-source roles, measurement risks, and next actions.
 *
 * Architecture preserved by this dashboard:
 *   individual survey respondent
 *     → PRISM signature posterior (uncertainty in)
 *     → vote/abstain simulation (per-agent)
 *     → aggregate decomposition (per-subgroup view OF the per-agent answers)
 *     → coalition gate / error report (DIAGNOSTIC ONLY — not a calibration target)
 *
 * Coalition gates and decomposition are external diagnostics. The model
 * is fitted at the individual-profile layer, not the subgroup layer.
 *
 * Terminology:
 *   - Identity-driven appeal is read through moral-boundary salience and
 *     moral-boundary loading. Legacy PF / TRB fields visible in source
 *     are inert; this dashboard does not refer to them as active concepts.
 *   - Engagement is one-dimensional and separate from policy alignment;
 *     not called activation.
 */

import * as fs from "fs";
import * as path from "path";

export type StageStatus = "complete" | "in_progress" | "missing" | "blocked";
export type RiskSeverity = "high" | "medium" | "low";

export interface SmokeResultParsed {
  passed: number;
  total: number;
  rawOverall: string;
}

export interface PipelineStage {
  id: string;
  description: string;
  status: StageStatus;
  sourceFiles: string[]; // expected file paths (relative to repo)
  artifactFiles: string[]; // expected output paths
  presentSourceFiles: string[];
  presentArtifactFiles: string[];
  smoke?: SmokeResultParsed;
  notes: string[];
}

export interface MeasurementRisk {
  topic: string;
  severity: RiskSeverity;
  description: string;
}

export interface NextAction {
  id: string;
  description: string;
  owner: string;
}

export interface DataSourceRole {
  source: string;
  role: string;
  required: boolean;
}

export interface InputFileCheck {
  path: string;
  present: boolean;
  category: "smoke-summary" | "audit" | "intake" | "mapping" | "plan";
}

export interface DashboardStatus {
  generatedAt: string;
  schemaVersion: 1;
  pipeline: PipelineStage[];
  testHealth: {
    totalChecks: number;
    passing: number;
    failing: number;
    bySource: Record<string, SmokeResultParsed>;
  };
  architectureNote: string;
  coalitionGateWarning: string;
  dataSources: DataSourceRole[];
  measurementRisks: MeasurementRisk[];
  nextActions: NextAction[];
  inputFiles: InputFileCheck[];
  meta: {
    repoRoot: string;
    notes: string[];
  };
}

const STAGE_DEFS: Array<{
  id: string;
  description: string;
  sourceFiles: string[];
  artifactFiles: string[];
}> = [
  {
    id: "C0",
    description: "Vote-model smoke: archetypes-as-strawman-population baseline.",
    sourceFiles: ["src/electorate/voteModelSmoke.ts"],
    artifactFiles: ["results/electorate/smoke/summary.md"],
  },
  {
    id: "C1",
    description: "Weighted-agent simulator scaffold with synthetic agents.",
    sourceFiles: ["src/electorate/types.ts", "src/electorate/electorateSimulator.ts", "src/electorate/syntheticAgents.ts"],
    artifactFiles: ["results/electorate/scaffold/summary.md"],
  },
  {
    id: "C2",
    description: "Coalition decomposition over an electorate simulation result.",
    sourceFiles: ["src/electorate/coalitionDecomposition.ts"],
    artifactFiles: ["results/electorate/coalition/summary.md"],
  },
  {
    id: "C3",
    description: "Coalition gate: pass/fail vs benchmark targets, per-subgroup tolerance.",
    sourceFiles: ["src/electorate/coalitionGate.ts"],
    artifactFiles: ["results/electorate/gate/summary.md"],
  },
  {
    id: "C4",
    description: "Closed-loop error reporter: ranked diagnoses + recommendations.",
    sourceFiles: ["src/electorate/errorReporter.ts"],
    artifactFiles: ["results/electorate/feedback/summary.md"],
  },
  {
    id: "C5",
    description: "Diagnostics dashboard (this artifact).",
    sourceFiles: ["src/electorate/diagnosticsDashboard.ts"],
    artifactFiles: ["results/electorate/dashboard/summary.md"],
  },
  {
    id: "A1",
    description: "CES + ANES codebook intake — Terminal Two.",
    sourceFiles: [],
    artifactFiles: [
      "results/electorate/intake/ces-anes-codebook-intake.md",
      "results/electorate/intake/variable-catalog-v0.json",
    ],
  },
  {
    id: "A2",
    description: "Survey-to-PRISM mapping spec v0 — Terminal Two.",
    sourceFiles: [],
    artifactFiles: [
      "results/electorate/mapping/survey-to-prism-v0.json",
      "results/electorate/mapping/survey-to-prism-v0.md",
    ],
  },
  {
    id: "A3",
    description: "Coverage gap report — Terminal Two (or this terminal as documentation).",
    sourceFiles: [],
    artifactFiles: [
      "results/electorate/mapping/coverage-gap-report-v0.md",
      "results/electorate/mapping/coverage-gap-report-v0.json",
    ],
  },
  {
    id: "D1",
    description: "2024 candidate + activation audit (no edits).",
    sourceFiles: [],
    artifactFiles: ["results/electorate/audit/2024-candidate-and-activation-review.md"],
  },
  {
    id: "D2",
    description: "2020 candidate + era-context audit (no edits).",
    sourceFiles: [],
    artifactFiles: ["results/electorate/audit/2020-candidate-and-era-context-review.md"],
  },
];

const DATA_SOURCES: DataSourceRole[] = [
  { source: "CES / ANES", role: "Individual political measurement. Survey items map into per-respondent PRISM signature posteriors with explicit uncertainty.", required: true },
  { source: "ACS (Census)", role: "Poststratification and geography priors only. Demographic weights, not political content.", required: false },
  { source: "Esri Tapestry", role: "Optional geographic enrichment. Not an individual political mapper. Does not replace survey-derived signatures.", required: false },
  { source: "Edison / NEP exit polls", role: "Subgroup benchmark targets for the coalition gate (diagnostic only, not a fitting target).", required: false },
];

const MEASUREMENT_RISKS: MeasurementRisk[] = [
  { topic: "AES (aesthetic style) coverage", severity: "high", description: "Survey items rarely measure aesthetic-style preferences directly. AES inference is weakest among the 14 nodes; AES is era-elevated for style-driven elections (e.g., 2016/2020/2024) so weak coverage hurts more than it would otherwise." },
  { topic: "COM (compromise tolerance) coverage", severity: "medium", description: "Standard political surveys ask about issues, not about willingness to compromise. COM may need imputation from related items." },
  { topic: "ONT_H (human malleability)", severity: "medium", description: "Worldview about whether character is fixed vs. shaped by environment is rarely surveyed directly. Likely inferred from culturally-coded items." },
  { topic: "Moral-boundary salience / loading", severity: "high", description: "Highest-risk derived inference. The 7-boundary moral-circle module is sensitive to coalition-axis miscalibration; a single mis-loaded boundary can shift the racial / religious / class dimensions of an entire coalition." },
  { topic: "Engagement dimension separation", severity: "medium", description: "Engagement is one-dimensional and separate from policy alignment. Surveys conflate engagement with partisanship; the mapper must keep them disjoint." },
  { topic: "2020 / 2024 candidate + era-context audit findings", severity: "medium", description: "Open audit flags include 2020 ONT_S not era-activated, 2020 Biden moral-boundary.ethnic_racial likely too low, 2024 inflation absent from era + economy term, 2024 Trump moral-boundary.class likely too low. See results/electorate/audit/." },
];

const ARCHITECTURE_NOTE = `
Pipeline order is individual-profile-first.
  1. Survey respondent → PRISM signature posterior (per-agent, with uncertainty).
  2. Per-agent vote/abstain via respondentVoteChoice.
  3. Aggregate (decomposition) into subgroup views — purely descriptive of per-agent answers.
  4. External diagnostic checks: coalition gate against benchmarks, error report when gate fails.

Subgroup decompositions and the coalition gate are EXTERNAL DIAGNOSTICS over the
per-agent simulation. They do not modify per-agent inference and they are not
calibration targets. Tuning the per-agent layer to match a coalition cell directly
is overfitting.
`.trim();

const COALITION_GATE_WARNING = `
Coalition gates and the closed-loop error reporter are diagnostics, not calibration
targets. Their job is to surface the most likely failure layer (mapper / candidate
signature / vote formula / turnout model / coverage) so a human can decide what to
revise. Do not auto-tune the mapper to make a coalition cell pass; that path leads
to overfit subgroup totals atop incorrect individual-level reasoning.
`.trim();

const ENGAGEMENT_NOTE = `
Engagement is a one-dimensional scalar separate from policy alignment.
It is never referred to as activation. It governs the per-agent
clearing-bar in respondentVoteChoice and lives in its own module
(src/engine/engagementLabel.ts).
`.trim();

function fileExists(absRoot: string, rel: string): boolean {
  try {
    return fs.statSync(path.join(absRoot, rel)).isFile();
  } catch {
    return false;
  }
}

const SMOKE_OVERALL_RE = /\*\*Overall:\s*✓\s*ALL PASS\*\*(?:\s*\((\d+)\s*\/\s*(\d+)\))?/;
const SMOKE_FAIL_RE = /\*\*Overall:\s*✗\s*SOME FAILED\*\*\s*\((\d+)\s*\/\s*(\d+)\)/;

function parseSmokeSummary(absRoot: string, summaryPath: string): SmokeResultParsed | undefined {
  const full = path.join(absRoot, summaryPath);
  if (!fileExists(absRoot, summaryPath)) return undefined;
  const text = fs.readFileSync(full, "utf8");
  // Look for the FIRST Overall line — that's the invariant table.
  const lines = text.split(/\r?\n/);
  for (const line of lines) {
    const ok = line.match(SMOKE_OVERALL_RE);
    if (ok) {
      if (ok[1] && ok[2]) {
        const passed = parseInt(ok[1], 10);
        const total = parseInt(ok[2], 10);
        return { passed, total, rawOverall: line.trim() };
      }
      // No explicit count — assume all-pass, count unknown
      return { passed: 1, total: 1, rawOverall: line.trim() };
    }
    const fail = line.match(SMOKE_FAIL_RE);
    if (fail) {
      const passed = parseInt(fail[1], 10);
      const total = parseInt(fail[2], 10);
      return { passed, total, rawOverall: line.trim() };
    }
  }
  return undefined;
}

function buildPipelineStage(absRoot: string, def: typeof STAGE_DEFS[0]): PipelineStage {
  const presentSrc = def.sourceFiles.filter(f => fileExists(absRoot, f));
  const presentArt = def.artifactFiles.filter(f => fileExists(absRoot, f));
  const allSrcPresent = def.sourceFiles.length === 0 || presentSrc.length === def.sourceFiles.length;
  const allArtPresent = def.artifactFiles.length === 0 || presentArt.length === def.artifactFiles.length;

  // Try to find a smoke summary among the artifact files.
  let smoke: SmokeResultParsed | undefined;
  for (const art of presentArt) {
    if (art.endsWith("summary.md")) {
      smoke = parseSmokeSummary(absRoot, art);
      if (smoke) break;
    }
  }

  let status: StageStatus;
  if (def.sourceFiles.length === 0 && def.artifactFiles.length === 0) {
    status = "missing";
  } else if (allSrcPresent && allArtPresent) {
    status = "complete";
  } else if (presentSrc.length > 0 || presentArt.length > 0) {
    status = "in_progress";
  } else {
    status = "missing";
  }

  const notes: string[] = [];
  if (def.sourceFiles.length > 0 && presentSrc.length < def.sourceFiles.length) {
    notes.push(`Missing source: ${def.sourceFiles.filter(f => !presentSrc.includes(f)).join(", ")}`);
  }
  if (def.artifactFiles.length > 0 && presentArt.length < def.artifactFiles.length) {
    notes.push(`Missing artifact: ${def.artifactFiles.filter(f => !presentArt.includes(f)).join(", ")}`);
  }

  return {
    id: def.id,
    description: def.description,
    status,
    sourceFiles: def.sourceFiles,
    artifactFiles: def.artifactFiles,
    presentSourceFiles: presentSrc,
    presentArtifactFiles: presentArt,
    smoke,
    notes,
  };
}

function buildNextActions(stages: PipelineStage[]): NextAction[] {
  const out: NextAction[] = [];
  const stageById = (id: string) => stages.find(s => s.id === id);

  if (stageById("A3")?.status !== "complete") {
    out.push({
      id: "A3",
      description: "Author or import the mapper coverage-gap report — per-PRISM-target coverage rating, gap descriptions, do-not-overfit guidance.",
      owner: "Terminal Two (or this terminal as documentation if Terminal Two is blocked).",
    });
  }
  out.push({
    id: "C5-followup",
    description: "Iterate the diagnostics dashboard with richer per-stage summaries (e.g. inline mapper coverage table, per-cluster smoke roll-ups).",
    owner: "This terminal.",
  });
  out.push({
    id: "C6-prep",
    description: "Prepare for the first real CES 2020 backtest: define the demographic-tag mapping from CES variables to AgentDemographics, agree on benchmark sources for the coalition gate (Edison / Catalist / Pew validated vote), and set Phase-2 entry conditions.",
    owner: "Both terminals + human acceptance criteria.",
  });
  out.push({
    id: "audit-decisions",
    description: "Resolve human-coding-decision flags from the 2020 + 2024 audits before they back-pollute candidate signatures during a backtest revision cycle.",
    owner: "Human + measurement track.",
  });
  return out;
}

function buildInputFileCatalog(absRoot: string): InputFileCheck[] {
  const known: { path: string; category: InputFileCheck["category"] }[] = [
    { path: "results/electorate/00-PLAN.md", category: "plan" },
    { path: "results/electorate/scaffold/summary.md", category: "smoke-summary" },
    { path: "results/electorate/coalition/summary.md", category: "smoke-summary" },
    { path: "results/electorate/gate/summary.md", category: "smoke-summary" },
    { path: "results/electorate/feedback/summary.md", category: "smoke-summary" },
    { path: "results/electorate/audit/2024-candidate-and-activation-review.md", category: "audit" },
    { path: "results/electorate/audit/2020-candidate-and-era-context-review.md", category: "audit" },
    { path: "results/electorate/intake/ces-anes-codebook-intake.md", category: "intake" },
    { path: "results/electorate/intake/acs-esri-geography-intake.md", category: "intake" },
    { path: "results/electorate/intake/variable-catalog-v0.json", category: "intake" },
    { path: "results/electorate/mapping/survey-to-prism-v0.md", category: "mapping" },
    { path: "results/electorate/mapping/survey-to-prism-v0.json", category: "mapping" },
  ];
  return known.map(k => ({ ...k, present: fileExists(absRoot, k.path) }));
}

export interface BuildDashboardOptions {
  repoRoot?: string;
}

export function buildDashboard(opts?: BuildDashboardOptions): { status: DashboardStatus; markdown: string } {
  const repoRoot = path.resolve(opts?.repoRoot ?? process.cwd());

  const pipeline = STAGE_DEFS.map(d => buildPipelineStage(repoRoot, d));

  const bySource: Record<string, SmokeResultParsed> = {};
  let totalChecks = 0, passing = 0, failing = 0;
  for (const stage of pipeline) {
    if (stage.smoke) {
      bySource[stage.id] = stage.smoke;
      totalChecks += stage.smoke.total;
      passing += stage.smoke.passed;
      failing += stage.smoke.total - stage.smoke.passed;
    }
  }

  const inputFiles = buildInputFileCatalog(repoRoot);
  const nextActions = buildNextActions(pipeline);

  const status: DashboardStatus = {
    generatedAt: new Date().toISOString(),
    schemaVersion: 1,
    pipeline,
    testHealth: { totalChecks, passing, failing, bySource },
    architectureNote: ARCHITECTURE_NOTE,
    coalitionGateWarning: COALITION_GATE_WARNING,
    dataSources: DATA_SOURCES,
    measurementRisks: MEASUREMENT_RISKS,
    nextActions,
    inputFiles,
    meta: {
      repoRoot,
      notes: [
        "Read-only diagnostic. Does not modify any source, candidate, era-context, mapper, or output file.",
        ENGAGEMENT_NOTE,
        "Identity-driven appeal is read through moral-boundary salience and moral-boundary loading. Legacy PF / TRB fields visible in source are inert and not active model concepts.",
      ],
    },
  };

  const markdown = renderMarkdown(status);
  return { status, markdown };
}

function statusEmoji(s: StageStatus): string {
  if (s === "complete") return "✓";
  if (s === "in_progress") return "…";
  if (s === "blocked") return "✗";
  return "—";
}

function renderMarkdown(status: DashboardStatus): string {
  const out: string[] = [];
  out.push("# Electorate Simulator — Diagnostics Dashboard");
  out.push("");
  out.push(`Generated: ${status.generatedAt} · schema v${status.schemaVersion}`);
  out.push("");
  out.push("## Architecture");
  out.push("");
  out.push("Individual profile first; subgroup checks are external diagnostics, not calibration targets.");
  out.push("");
  out.push("```");
  out.push(status.architectureNote);
  out.push("```");
  out.push("");
  out.push("> **Coalition gates are diagnostic only.** " + status.coalitionGateWarning.replace(/\n/g, " "));
  out.push("");
  out.push("## Pipeline status");
  out.push("");
  out.push("| Stage | Status | Description | Smoke |");
  out.push("|---|:--:|---|---|");
  for (const s of status.pipeline) {
    const smokeCol = s.smoke ? `${s.smoke.passed}/${s.smoke.total}` : (s.status === "missing" ? "—" : "n/a");
    out.push(`| ${s.id} | ${statusEmoji(s.status)} ${s.status} | ${s.description} | ${smokeCol} |`);
  }
  out.push("");
  out.push(`**Test health:** ${status.testHealth.passing}/${status.testHealth.totalChecks} invariants passing across ${Object.keys(status.testHealth.bySource).length} smokes.`);
  out.push("");
  out.push("## Data-source roles");
  out.push("");
  out.push("| Source | Required | Role |");
  out.push("|---|:--:|---|");
  for (const d of status.dataSources) {
    out.push(`| ${d.source} | ${d.required ? "yes" : "no"} | ${d.role} |`);
  }
  out.push("");
  out.push("## Measurement risk queue");
  out.push("");
  out.push("| Severity | Topic | Description |");
  out.push("|---|---|---|");
  for (const r of status.measurementRisks) {
    out.push(`| ${r.severity} | ${r.topic} | ${r.description} |`);
  }
  out.push("");
  out.push("## Engagement");
  out.push("");
  out.push(ENGAGEMENT_NOTE);
  out.push("");
  out.push("## Next actions");
  out.push("");
  for (const a of status.nextActions) {
    out.push(`- **${a.id}** — ${a.description} *(owner: ${a.owner})*`);
  }
  out.push("");
  out.push("## Input file catalog");
  out.push("");
  out.push("| Path | Present | Category |");
  out.push("|---|:--:|---|");
  for (const f of status.inputFiles) {
    out.push(`| \`${f.path}\` | ${f.present ? "✓" : "—"} | ${f.category} |`);
  }
  out.push("");
  out.push("## Notes");
  out.push("");
  for (const n of status.meta.notes) out.push(`- ${n}`);
  out.push("");
  return out.join("\n");
}
