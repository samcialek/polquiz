// PR 6.E.4d — final 6.E legacy-reference audit.
//
// Walks every tracked file under src/ and classifies remaining
// MOR / TRB / PF / trbAnchor / TRB_ANCHOR references into 5 categories per
// Sam's directive (2026-05-02):
//
//   1. Intentional bridge/fallback pre-6.F (state.trbAnchor.dist writes,
//      mirrorAnchorToBoundaries, addToAnchorDist, coverage scoring,
//      TrbAnchor / TrbAnchorDist types still required by active writes)
//   2. Candidate/regime data retained due to type/fallback constraints
//      (cand.MOR/TRB/PF on CandidateProfile, regime.MOR/TRB/PF on
//      RegimePeriod, plus the legacy-fallback branches in
//      respondentVoteChoice.ts / build-alignment.ts that consume them)
//   3. Eval/diagnostic/dead-cluster (src/eval, src/test, src/diagnostics,
//      src/optimize, plus the unconsumed historical tools simulate.ts /
//      regime-alignment.ts / validate.ts and the V1/V2 scorers
//      archetypeDistanceWTA.ts / archetypeDistanceAvg.ts)
//   4. Stale comment/test wording (file's references are all inside
//      comments — no active code / data — and worth fixing now)
//   5. Unexpected runtime reference (FAILS the audit)
//
// The script exits non-zero if any file lands in Category 5.
//
// Reproducibility (PR 6.E.4d, Sam 2026-05-02): file contents are read
// from `HEAD` via `git show`, NOT from the working tree. This makes the
// audit deterministic regardless of dirty/staged/unstaged state and
// matches what would land if the current commit were checked out fresh.

import { statSync } from "node:fs";
import { execSync } from "node:child_process";

// ─── Token regex + scope ────────────────────────────────────────────────
const TOKENS = [
  { name: "MOR",         re: /\bMOR\b/g },
  { name: "TRB",         re: /\bTRB\b/g },
  { name: "PF",          re: /\bPF\b/g },
  { name: "trbAnchor",   re: /trbAnchor/g },
  { name: "TRB_ANCHOR",  re: /TRB_ANCHOR/g },
];

// Audit scope: every tracked file under src/. This explicitly INCLUDES
// eval/test/diagnostics/optimize so the Cat 3 ruleset can categorize
// them (PR 6.E.4d hardening per Sam 2026-05-02 — earlier versions had
// these dirs in the Cat 3 rule but excluded from the scan, so the
// classifier never saw them).
const SCOPE_DIRS = [
  "src/types.ts",
  "src/browser",
  "src/config",
  "src/diagnostics",
  "src/engine",
  "src/eval",
  "src/global",
  "src/historical",
  "src/identity",
  "src/optimize",
  "src/test",
];

// ─── Classifier ruleset ─────────────────────────────────────────────────
//
// Returns { cat: 1|2|3|4|5, why: string }. cat is null for files outside
// the runtime build (skipped silently from the main pass).

const DEAD_CLUSTER_FILES = new Set([
  "src/historical/simulate.ts",
  "src/historical/regime-alignment.ts",
  "src/historical/validate.ts",
  "src/engine/archetypeDistanceWTA.ts",
  "src/engine/archetypeDistanceAvg.ts",
  "src/engine/stateAvg.ts",
  "src/engine/updateAvg.ts",
]);

const BRIDGE_FILES = new Set([
  "src/types.ts",
  "src/engine/math.ts",
  "src/engine/update.ts",
  "src/engine/nextQuestion.ts",
  "src/engine/selectorEIG.ts",
  "src/engine/respondentSignature.ts",
  "src/engine/topKDrill.ts",
  "src/engine/config.ts",
  "src/engine/archetypeDistance.ts",
  "src/browser/api.ts",
  "src/identity/resolveIdentityPrimary.ts",
  "src/config/nodes.ts",
  "src/config/normalization.ts",
  "src/historical/activation.ts",
  "src/historical/era-activations.ts",
  "src/historical/era-activations.json",
]);

const DATA_FILES = new Set([
  "src/config/archetypes.ts",
  "src/config/questions.full.ts",
  "src/config/questions.representative.ts",
  "src/historical/candidates.ts",
  "src/historical/contexts-1789-1852.ts",
  "src/historical/contexts-1856-1916.ts",
  "src/historical/contexts-1920-2024.ts",
  "src/historical/elections-1789-1852.ts",
  "src/historical/elections-1856-1888.ts",
  "src/historical/elections-1892-1916.ts",
  "src/historical/elections-1920-1936.ts",
  "src/global/jurisdictions-americas.ts",
  "src/global/jurisdictions-asia.ts",
  "src/global/jurisdictions-europe1.ts",
  "src/global/jurisdictions-europe2.ts",
  "src/global/jurisdictions-mena.ts",
  "src/global/build-alignment.ts",
  "src/historical/respondentVoteChoice.ts",
]);

function classifyFile(path) {
  // Cat 3: any eval/test/diagnostic/optimize dir
  if (path.startsWith("src/eval/") || path.startsWith("src/test/") ||
      path.startsWith("src/diagnostics/") || path.startsWith("src/optimize/")) {
    return { cat: 3, why: "eval/test/diagnostic dir" };
  }
  // Cat 3: dead-cluster historical/eval-only tools
  if (DEAD_CLUSTER_FILES.has(path)) {
    return { cat: 3, why: "dead-cluster (unconsumed by api.ts; tsconfig-included only)" };
  }
  // Cat 1: bridge / runtime-active types / coverage / state round-trip
  if (BRIDGE_FILES.has(path)) {
    return { cat: 1, why: "intentional bridge / type / fallback wiring pre-6.F" };
  }
  // Cat 2: canonical data + the two consumer files that read it
  if (DATA_FILES.has(path)) {
    return { cat: 2, why: "candidate/regime/question data + active fallback consumer" };
  }
  // Anything else is unexpected.
  return { cat: 5, why: "unclassified (review)" };
}

// ─── Token counter ──────────────────────────────────────────────────────
function tokenCounts(text) {
  const counts = {};
  let total = 0;
  for (const tok of TOKENS) {
    const matches = text.match(tok.re);
    counts[tok.name] = matches ? matches.length : 0;
    total += counts[tok.name];
  }
  return { counts, total };
}

// Detect lines where ALL token hits are inside comments (rough heuristic).
// For Category 4: file has token references but every line carrying one is
// a // line-comment or inside /* */ block. This is a heuristic — it doesn't
// parse JS, just checks per-line prefix and rough block-comment state.
function commentOnlyTokenHits(text) {
  const lines = text.split("\n");
  let inBlock = false;
  let totalTokenLines = 0;
  let commentTokenLines = 0;
  for (const line of lines) {
    const trimmed = line.trim();
    let isComment = false;
    if (inBlock) {
      isComment = true;
      if (line.includes("*/")) inBlock = false;
    } else if (trimmed.startsWith("//")) {
      isComment = true;
    } else if (trimmed.startsWith("/*") || trimmed.startsWith("*")) {
      isComment = true;
      if (trimmed.startsWith("/*") && !line.includes("*/")) inBlock = true;
    }
    let hasToken = false;
    for (const tok of TOKENS) {
      if (tok.re.test(line)) { hasToken = true; tok.re.lastIndex = 0; }
    }
    if (hasToken) {
      totalTokenLines++;
      if (isComment) commentTokenLines++;
    }
  }
  return { totalTokenLines, commentTokenLines };
}

// ─── Walk the runtime scope ─────────────────────────────────────────────
function listFiles(pathspec) {
  // Use git to list tracked files for stability (matches what's actually
  // checked in, not stray working-tree files).
  const out = execSync(`git ls-files ${pathspec}`, { encoding: "utf8" });
  return out.split("\n").filter(Boolean);
}

function readAtHead(path) {
  // Read tracked file content from HEAD, not the working tree. Makes the
  // audit deterministic across dirty/staged/unstaged states and matches
  // what a fresh checkout of the current commit would see.
  try {
    return execSync(`git show HEAD:${path}`, {
      encoding: "utf8",
      maxBuffer: 64 * 1024 * 1024,
    });
  } catch {
    // File not in HEAD (newly added, untracked, or renamed); skip.
    return null;
  }
}

const srcFiles = listFiles("src");
const allTrackedFiles = listFiles(""); // empty pathspec → all tracked files
const inScope = srcFiles.filter(f => {
  if (f === "src/types.ts") return true;
  return SCOPE_DIRS.some(d => f.startsWith(d + "/"));
});

const findings = [];
for (const f of inScope) {
  const text = readAtHead(f);
  if (text === null) continue;
  const { counts, total } = tokenCounts(text);
  if (total === 0) continue;
  const { totalTokenLines, commentTokenLines } = commentOnlyTokenHits(text);
  const cls = classifyFile(f);
  // Promote to Cat 4 if file is otherwise Cat 5 AND all token-bearing
  // lines are comments (heuristic).
  let { cat, why } = cls;
  if (cat === 5 && commentTokenLines === totalTokenLines && totalTokenLines > 0) {
    cat = 4;
    why = "all token references inside comments (potential stale prose)";
  }
  findings.push({ file: f, counts, total, totalTokenLines, commentTokenLines, cat, why });
}

// ─── Print the audit table ──────────────────────────────────────────────
const byCat = { 1: [], 2: [], 3: [], 4: [], 5: [] };
for (const r of findings) byCat[r.cat].push(r);

const CAT_LABEL = {
  1: "Cat 1 — INTENTIONAL BRIDGE / FALLBACK (pre-6.F)",
  2: "Cat 2 — DATA RETAINED (type/fallback constraints)",
  3: "Cat 3 — EVAL / DIAGNOSTIC / DEAD-CLUSTER",
  4: "Cat 4 — COMMENT-ONLY (stale prose candidates)",
  5: "Cat 5 — UNEXPECTED RUNTIME REFERENCE (REVIEW)",
};

console.log("================================================================");
console.log("PR 6.E.4d — final legacy-reference audit");
console.log("================================================================\n");

const colKey = ["MOR", "TRB", "PF", "trbAnchor", "TRB_ANCHOR"];
function rowFor(r) {
  const counts = colKey.map(k => String(r.counts[k]).padStart(4));
  return `  [${counts.join(" ")}]  ${r.file}  — ${r.why}`;
}

let totalRefs = 0;
for (const cat of [1, 2, 3, 4, 5]) {
  const rows = byCat[cat];
  console.log(CAT_LABEL[cat]);
  if (rows.length === 0) {
    console.log("  (none)");
  } else {
    console.log(`  ${"MOR".padStart(4)} ${"TRB".padStart(4)} ${"PF".padStart(4)} ${"trbA".padStart(4)} ${"T_A".padStart(4)}   file  — why`);
    for (const r of rows) {
      console.log(rowFor(r));
      totalRefs += r.total;
    }
  }
  console.log("");
}

// ─── Tracked dist-tmp / bundle inventory ────────────────────────────────
console.log("================================================================");
console.log("Tracked dist-tmp / bundle leftovers (informational)");
console.log("================================================================\n");

const distTmp = allTrackedFiles.filter(f => f.startsWith("dist-tmp/"));
const bundles = allTrackedFiles.filter(f =>
  f === "dist/bundle.js" ||
  f.startsWith("dist/prism-engine-bundle") ||
  /^prism-engine-bundle(\.|$)/.test(f)
);
console.log(`  dist-tmp/: ${distTmp.length} tracked files`);
if (distTmp.length > 0) {
  console.log(`    sample: ${distTmp.slice(0, 3).join(", ")}${distTmp.length > 3 ? ", …" : ""}`);
  console.log(`    note: parallel build output dir, likely stale; cleanup candidate`);
}
console.log(`  prism-engine-bundle / dist/bundle.js leftovers: ${bundles.length} tracked files`);
for (const b of bundles) {
  let mtime = "?";
  try { mtime = statSync(b).mtime.toISOString().slice(0, 10); } catch {}
  console.log(`    ${b}  (mtime ${mtime})`);
}

// ─── Summary + exit code ────────────────────────────────────────────────
console.log("\n================================================================");
console.log("Summary");
console.log("================================================================\n");
console.log(`  total files with legacy references: ${findings.length}`);
console.log(`  total reference count:              ${totalRefs}`);
for (const cat of [1, 2, 3, 4, 5]) {
  console.log(`  ${CAT_LABEL[cat]}: ${byCat[cat].length} files`);
}
console.log(`  dist-tmp/ tracked:        ${distTmp.length} files`);
console.log(`  bundle leftovers tracked: ${bundles.length} files`);

if (byCat[5].length > 0) {
  console.log(`\n❌ FAIL — ${byCat[5].length} file(s) in Cat 5 (unexpected runtime reference)`);
  process.exit(1);
}
console.log(`\n✅ PASS — no Cat 5 unexpected runtime references`);
