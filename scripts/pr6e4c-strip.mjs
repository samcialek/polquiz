// PR 6.E.4c — script-driven legacy data-field deletion.
//
// Deletes the legacy MOR / TRB / PF template entries from archetype `nodes`
// blocks in src/config/archetypes.ts. After 6.E.2a's useMorModule gate,
// these template entries are dead in the live runtime path:
//   - archetypeDistance: skipped via MOR_MODULE_LEGACY (always — every
//     archetype has morBoundaries per 6.E.4a validator)
//   - build-alignment: skipped via MOR_MODULE_LEGACY_NODES (MOR);
//     TRB/PF excluded from CONTINUOUS_NODES
//   - respondentVoteChoice: same gate (MOR via SCORING_NODES + gate;
//     TRB/PF excluded from SCORING_NODES)
//
// Type-safe: Archetype.nodes is Partial<Record<NodeId, ...>>, so missing
// entries are valid. Eval-only V1/V2 scorers (archetypeDistanceAvg /
// archetypeDistanceWTA) and dead-cluster historical tools
// (simulate/regime-alignment/validate, none consumed by api.ts) handle
// undefined templates gracefully (skip-or-default-3).
//
// NOT deleted in this commit (would require type relaxation):
//   - candidate.MOR/TRB/PF (CandidateProfile interface marks required;
//     cand.MOR still read by respondentVoteChoice legacy fallback path)
//   - regime.MOR/TRB/PF (RegimePeriod interface marks required;
//     regime.MOR read by build-alignment legacy fallback)
//
// The transformer is line-targeted: it only removes the three known
// single-line template entry shapes inside `nodes:` blocks (single-space,
// double-space alignment, with optional trailing `// comment`). Lines
// that don't match any shape are left alone — the script does not exit
// nonzero on shape misses; instead it prints a `!! WARNING` summary
// listing any archetype that ended with ≠ 3 deletions, and the operator
// is expected to inspect that warning before committing. Diff-scope
// verification (only target lines changed, no unrelated drift) is also
// performed manually outside the script via `diff -u` against a
// snapshot of the file taken before the run.

import { readFileSync, writeFileSync } from "node:fs";

const FILE = "src/config/archetypes.ts";

// Match template lines like:
//   "      MOR: { kind: \"continuous\", pos: 5, sal: 3, anti: \"low\" },"
//   "      TRB: { kind: \"continuous\", pos: 2, anti: \"high\" },   // kept 019's stronger anti-tribal"
//   "      PF: { kind: \"continuous\", pos: 5 },"
//   "      PF:  { kind: \"continuous\", pos: 5 },"   (double-space alignment)
// Constraints:
//   - exact 6-space leading indent (matches `nodes: { ... }` body)
//   - whole line is the template entry + trailing comma + optional `// trailing comment`
//   - single-line (no continuation)
const TARGET_LINE_RE = /^      (MOR|TRB|PF): {1,2}\{ kind: "continuous"[^}]*\},?(?:\s*\/\/.*)?\s*$/;

const src = readFileSync(FILE, "utf8");
const lines = src.split("\n");

let currentId = "?";
const audit = []; // per-archetype: {id, deleted: [{node, raw}]}
let entryAudit = null;

const newLines = [];
let mode = "outside"; // "outside" | "in_archetype" | "in_nodes"
let bracketDepth = 0;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  const idMatch = line.match(/^\s*id:\s*"([^"]+)",/);
  if (idMatch) {
    if (entryAudit && entryAudit.deleted.length > 0) audit.push(entryAudit);
    currentId = idMatch[1];
    entryAudit = { id: currentId, deleted: [] };
    newLines.push(line);
    continue;
  }

  // Detect target lines and skip them.
  const m = line.match(TARGET_LINE_RE);
  if (m) {
    if (entryAudit) {
      entryAudit.deleted.push({ node: m[1], raw: line.trim() });
    }
    // Don't push — this line is deleted.
    continue;
  }

  newLines.push(line);
}

if (entryAudit && entryAudit.deleted.length > 0) audit.push(entryAudit);

const newSrc = newLines.join("\n");
writeFileSync(FILE, newSrc);

console.log(`=== ${FILE} ===`);
console.log(`  ${audit.length} archetypes touched`);
let totalDeleted = 0;
const byNode = { MOR: 0, TRB: 0, PF: 0 };
for (const a of audit) {
  for (const d of a.deleted) {
    totalDeleted++;
    byNode[d.node]++;
  }
}
console.log(`  ${totalDeleted} template lines deleted (MOR=${byNode.MOR}, TRB=${byNode.TRB}, PF=${byNode.PF})`);
console.log(`  source LOC: ${lines.length} → ${newLines.length} (delta ${newLines.length - lines.length})`);

// Spot-check: print a few sample deletions for the first 3 archetypes.
console.log(`\n--- sample deletions (first 3 archetypes touched) ---`);
for (const a of audit.slice(0, 3)) {
  console.log(`  ${a.id}: ${a.deleted.length} lines`);
  for (const d of a.deleted) {
    console.log(`    [${d.node}] ${d.raw}`);
  }
}

// Sanity assertion: each archetype should have lost exactly 3 lines (one
// each for MOR/TRB/PF), unless one was missing originally (none should be).
const wrongCounts = audit.filter(a => a.deleted.length !== 3);
if (wrongCounts.length > 0) {
  console.log(`\n!! WARNING: ${wrongCounts.length} archetypes had ≠ 3 deletions:`);
  for (const a of wrongCounts) {
    console.log(`     ${a.id}: ${a.deleted.length} (${a.deleted.map(d => d.node).join(",")})`);
  }
}
