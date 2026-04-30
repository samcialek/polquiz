// PR 6.E preflight — read-only enumeration of every remaining
// MOR / TRB / PF / trbAnchor / TRB_ANCHOR / TrbAnchor / TrbAnchorDist
// reference in src/. Categorizes each file by purpose and decides which
// usage falls in PR 6.E (engine cutover) vs PR 6.F (question rewiring)
// vs later or out-of-scope.
//
// No code changes. Output: results/calibration-exceptions/pr6e-preflight.md

import { readFileSync, writeFileSync } from "node:fs";
import { execSync } from "node:child_process";

// Token regexes — each captures field/identifier-like usage of the legacy names.
const TOKENS = [
  { id: "MOR",          regex: '(\\.MOR\\b|"MOR"|\\bMOR:)' },
  { id: "TRB",          regex: '(\\.TRB\\b|"TRB"|\\bTRB:)' },
  { id: "PF",           regex: '(\\.PF\\b|"PF"|\\bPF:)' },
  { id: "trbAnchor",    regex: '(\\btrbAnchor\\b)' },
  { id: "TRB_ANCHOR",   regex: '(\\bTRB_ANCHOR\\b)' },
  { id: "TrbAnchor",    regex: '(\\bTrbAnchor\\b)' },
  { id: "TrbAnchorDist",regex: '(\\bTrbAnchorDist\\b)' },
];

// File-purpose categorizer — assigns each src/ path a category and a
// suggested cutover PR.
// Runtime build = `npm run build` = tsconfig.runtime.json which EXCLUDES
// src/test/, src/eval/, src/optimize/, src/diagnostics/ — those don't
// need to compile clean for 6.E to ship. They DO break under build:all,
// so eventually need updating, but they can lag.
function categorize(path) {
  // Engine — runtime read/write, must be cut over in 6.E
  if (path.startsWith("src/engine/")) return { cat: "engine",        cutover: "6.E" };
  // Browser API — exposes state shape to callers; cuts in 6.E
  if (path.startsWith("src/browser/")) return { cat: "browser-api",  cutover: "6.E" };
  // Election + world-map compute — read regime/candidate fields; cuts in 6.E
  if (path === "src/historical/respondentVoteChoice.ts") return { cat: "election-compute", cutover: "6.E" };
  if (path === "src/global/build-alignment.ts")          return { cat: "world-map-compute", cutover: "6.E" };
  // Identity-primary resolver — staged for 6.G/6.I per ADR. BUT: resolver
  // currently reads `respondentState.trbAnchor.dist`. If 6.E removes that
  // field, resolver breaks. Open design question — see notes section.
  if (path.startsWith("src/identity/")) return { cat: "identity-primary", cutover: "6.E? (see notes — resolver reads trbAnchor.dist; coordinate with 6.G)" };
  // Types — already updated additive (PR 6.B); old field types stay until 6.E removes
  if (path === "src/types.ts") return { cat: "types-additive", cutover: "6.E (cleanup deprecated unions; coordinate with resolver)" };
  // Config — node defs + question evidence maps + normalization factors
  if (path === "src/config/nodes.ts") return { cat: "node-defs", cutover: "6.E (remove MOR/TRB/PF from NODE_DEFS)" };
  if (path === "src/config/categories.ts") return { cat: "categories-additive", cutover: "6.E (remove TRB_ANCHORS export)" };
  if (path === "src/config/normalization.ts") return { cat: "node-norm-factors", cutover: "6.E (remove MOR/TRB/PF entries from NODE_NORM_FACTORS)" };
  if (path.startsWith("src/config/questions")) return { cat: "question-evidence", cutover: "6.F" };
  // Archetype + candidate + regime data — already migrated additive in 6.C/6.D
  if (path === "src/config/archetypes.ts") return { cat: "archetype-data", cutover: "6.E (drop old MOR/TRB/PF fields)" };
  if (path === "src/historical/candidates.ts") return { cat: "candidate-data", cutover: "6.E (drop old MOR/TRB/PF fields)" };
  if (path.startsWith("src/historical/elections-")) return { cat: "candidate-data", cutover: "6.E (drop old MOR/TRB/PF fields)" };
  if (path.startsWith("src/global/jurisdictions-")) return { cat: "regime-data", cutover: "6.E (drop old MOR/TRB/PF fields)" };
  // Historical context — era node-weight + activation maps. They reference
  // MOR/TRB/PF as string keys in nodeWeights / activationNodes. When the
  // 14-node ontology drops those, the era weights for them are orphaned —
  // need to either remove or remap to a morBoundaries entry. 6.E scope.
  if (path.startsWith("src/historical/contexts-")) return { cat: "era-context", cutover: "6.E (strip orphaned MOR/TRB/PF era weights)" };
  // Other historical — simulate, validate, activation, era-activations,
  // regime-alignment — read arch.nodes.MOR/TRB/PF directly. 6.E scope.
  if (path.startsWith("src/historical/")) return { cat: "historical-other", cutover: "6.E (strip arch.nodes.MOR/TRB/PF reads)" };
  // Excluded from runtime build (tsconfig.runtime.json) — these can lag.
  if (path.startsWith("src/eval/"))        return { cat: "eval-diagnostic",   cutover: "lag (excluded from runtime build; update post-6.H)" };
  if (path.startsWith("src/test/"))        return { cat: "test",              cutover: "lag (excluded from runtime build; update post-6.H)" };
  if (path.startsWith("src/diagnostics/")) return { cat: "diagnostics",       cutover: "lag (excluded from runtime build; update post-6.H)" };
  if (path.startsWith("src/optimize/"))    return { cat: "optimize",          cutover: "lag (excluded from runtime build; update post-6.H)" };
  return { cat: "other", cutover: "review" };
}

function runGrep(regex) {
  try {
    const out = execSync(
      `grep -rEn "${regex}" src/ --include='*.ts'`,
      { encoding: "utf8", maxBuffer: 50 * 1024 * 1024 },
    );
    return out.split("\n").filter(Boolean);
  } catch (e) {
    // grep returns non-zero if no matches; treat as empty
    return [];
  }
}

const results = {};   // path -> { token -> count }
for (const { id, regex } of TOKENS) {
  const lines = runGrep(regex);
  for (const line of lines) {
    const m = line.match(/^([^:]+):/);
    if (!m) continue;
    const path = m[1].replace(/\\/g, "/");
    if (!results[path]) results[path] = {};
    results[path][id] = (results[path][id] || 0) + 1;
  }
}

const paths = Object.keys(results).sort();

// Group by category
const byCategory = {};
for (const p of paths) {
  const { cat, cutover } = categorize(p);
  if (!byCategory[cat]) byCategory[cat] = { cutover, files: [] };
  byCategory[cat].files.push({ path: p, counts: results[p] });
}

let out = "# PR 6.E preflight — legacy MOR/TRB/PF/trbAnchor usage census\n\n";
out += `Date: 2026-04-30\n\n`;
out += `Read-only enumeration. No code changes. Lists every src/ file that\n`;
out += `still references \`MOR\`, \`TRB\`, \`PF\`, or any TRB_ANCHOR variant\n`;
out += `(\`trbAnchor\`, \`TRB_ANCHOR\`, \`TrbAnchor\`, \`TrbAnchorDist\`),\n`;
out += `with a suggested cutover PR per file category.\n\n`;
out += `**Runtime-build scope vs total scope.** \`npm run build\` uses\n`;
out += `\`tsconfig.runtime.json\` which **excludes** \`src/test/\`,\n`;
out += `\`src/eval/\`, \`src/optimize/\`, and \`src/diagnostics/\`. Those\n`;
out += `categories don't need to compile clean for 6.E to ship; they can\n`;
out += `lag and be cleaned up post-6.H. The actual 6.E hot scope is the\n`;
out += `runtime-included files only (engine + browser + historical + global\n`;
out += `+ config + types + identity).\n\n`;
out += `## Locked design decisions for 6.E\n\n`;
out += `### 1. Identity-primary resolver: direct rewrite to morBoundaries (not shadow field)\n\n`;
out += `\`src/identity/resolveIdentityPrimary.ts\` currently reads\n`;
out += `\`respondentState.trbAnchor.dist\`. Decision: re-encode the resolver\n`;
out += `in 6.E to read \`morBoundaries\` directly. Do NOT keep \`trbAnchor\`\n`;
out += `as a shadow field — that would preserve a half-dead ontology in\n`;
out += `exactly the place we're removing ambiguity. "Resolver stays active\n`;
out += `through 6.G" means the resolver layer stays active, not that it\n`;
out += `keeps reading the old field.\n\n`;
out += `Resolver translation guidance:\n\n`;
out += `- Replace \`topAnchor(state.trbAnchor.dist)\` with top boundary from\n`;
out += `  \`state.morBoundaries.boundaries\`.\n`;
out += `- Collapse old \`sexual\` into \`gender\`. Use \`demo_lgbtq\` before\n`;
out += `  gender-specific feminist / male-grievance routing.\n`;
out += `- Replace old TRB/PF activation gate with \`morIntensity\` +\n`;
out += `  boundary load:\n`;
out += `  - latent:    \`intensity >= ~1.5\`  and top boundary \`>= ~0.45\`\n`;
out += `  - active:    \`intensity >= ~2.25\` and top boundary \`>= ~0.65\` plus engagement active\n`;
out += `  - dominant:  same as active plus highly engaged\n`;
out += `- Keep reason codes stable where possible. \`gate.trb / gate.pf\`\n`;
out += `  becoming \`gate.boundaryLoad / gate.intensity\` is fine; if UI\n`;
out += `  churn is too much, synthesize old-shaped values from the new\n`;
out += `  fields for one PR.\n\n`;
out += `The 141-146 archetypes already have morBoundaries set in 6.C, so\n`;
out += `the resolver just changes its field source. Resolver removal\n`;
out += `still happens in 6.I after 6.H validation.\n\n`;
out += `### 2. era-context weights: max() merge, not sum (and no real rebalancing in 6.E)\n\n`;
out += `\`src/historical/contexts-*.ts\` files (3 files, ~365 references)\n`;
out += `define per-era node weight maps like\n`;
out += `\`{ PRO: 2.0, MAT: 1.5, PF: 1.3, COM: 1.5 }\`. When 6.E removes\n`;
out += `PF/MOR/TRB from the engine's node ontology, these weights become\n`;
out += `dead string keys.\n\n`;
out += `Decision: remap to a single \`morBoundaries\` weight slot using\n`;
out += `**max() not sum**. Raw sum would over-amplify — e.g., 2016 with\n`;
out += `\`TRB: 2.0\` and \`PF: 1.4\` summed gives \`morBoundaries: 3.4\`,\n`;
out += `stronger than any single-node weight intended and would silently\n`;
out += `rescale elections.\n\n`;
out += `Specific rules:\n\n`;
out += `- \`nodeWeights.morBoundaries = max(MOR, TRB, PF)\` if any exist.\n`;
out += `- \`primaryAxis / secondaryAxis / dormant\`: remove old MOR/TRB/PF;\n`;
out += `  add \`morBoundaries\` to the strongest bucket present, with\n`;
out += `  precedence \`primary > secondary > dormant\`.\n`;
out += `- \`candidateActivations\` and \`threatActivation\`: use\n`;
out += `  \`max(old MOR/TRB/PF activation)\`, not sum.\n`;
out += `- Defer real rebalancing to 6.H.\n\n`;
out += `Note on scope: \`contexts-*.ts\` is the older election-context /\n`;
out += `turnout machinery. The live vote-distance path uses\n`;
out += `\`era-activations.json\`. So the 6.E goal here is\n`;
out += `**compile-clean and semantically conservative**, not re-tuning\n`;
out += `elections. Real rebalancing (whether to keep \`morBoundaries\` as\n`;
out += `a single era-weight node or split it into multi-axis weights)\n`;
out += `belongs in 6.H or a follow-up election-pipeline pass.\n\n`;

const totalFiles = paths.length;
const totalRefs = Object.values(results).reduce((s, c) => s + Object.values(c).reduce((a, b) => a + b, 0), 0);
out += `**Total: ${totalFiles} files, ${totalRefs} legacy references.**\n\n`;

// Category summary
out += `## Per-category summary\n\n`;
out += `| category | files | refs | cutover |\n|---|---|---|---|\n`;
const categoryOrder = [
  "types-additive",
  "categories-additive",
  "node-defs",
  "node-norm-factors",
  "engine",
  "browser-api",
  "election-compute",
  "world-map-compute",
  "era-context",
  "historical-other",
  "archetype-data",
  "candidate-data",
  "regime-data",
  "question-evidence",
  "identity-primary",
  "eval-diagnostic",
  "test",
  "diagnostics",
  "optimize",
  "other",
];
for (const cat of categoryOrder) {
  if (!byCategory[cat]) continue;
  const grp = byCategory[cat];
  const refs = grp.files.reduce((s, f) => s + Object.values(f.counts).reduce((a, b) => a + b, 0), 0);
  out += `| ${cat} | ${grp.files.length} | ${refs} | ${grp.cutover} |\n`;
}
out += "\n";

// Per-file detail by category
for (const cat of categoryOrder) {
  if (!byCategory[cat]) continue;
  const grp = byCategory[cat];
  out += `\n## ${cat} — cutover: ${grp.cutover}\n\n`;
  out += `| file | MOR | TRB | PF | trbAnchor | TRB_ANCHOR | TrbAnchor | TrbAnchorDist |\n`;
  out += `|---|---|---|---|---|---|---|---|\n`;
  for (const f of grp.files.sort((a, b) =>
    Object.values(b.counts).reduce((s, x) => s + x, 0) -
    Object.values(a.counts).reduce((s, x) => s + x, 0)
  )) {
    const cells = TOKENS.map(t => f.counts[t.id] || 0);
    if (cells.every(c => c === 0)) continue;
    out += `| ${f.path} | ${cells.map(c => c || "—").join(" | ")} |\n`;
  }
}

writeFileSync("results/calibration-exceptions/pr6e-preflight.md", out);
console.log(`Wrote results/calibration-exceptions/pr6e-preflight.md`);
console.log(`Total: ${totalFiles} files, ${totalRefs} legacy references.`);

// Console summary by category
console.log("\nBy category:");
for (const cat of categoryOrder) {
  if (!byCategory[cat]) continue;
  const grp = byCategory[cat];
  const refs = grp.files.reduce((s, f) => s + Object.values(f.counts).reduce((a, b) => a + b, 0), 0);
  console.log(`  ${cat.padEnd(28)} files=${String(grp.files.length).padStart(3)}  refs=${String(refs).padStart(5)}  cutover=${grp.cutover}`);
}
