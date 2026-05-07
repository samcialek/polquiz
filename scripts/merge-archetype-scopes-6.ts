/**
 * 2026-05-07 6-scope revision converter.
 *
 * Updates each archetype's `moralCircle.scopedAffinities` field:
 *   - drop `sexual` (folded into `gender` already in any IDP overrides; data loss minimal)
 *   - drop `political_camp` after merging max(ideological, political_camp) → ideological
 *
 * Operates on the line-formatted moralCircle entries that the original T2
 * converter produced. Each archetype has exactly one such line.
 *
 * Run: npx tsx scripts/merge-archetype-scopes-6.ts
 */

import { readFileSync, writeFileSync } from "node:fs";

const PATH = "src/config/archetypes.ts";
const FILE = readFileSync(PATH, "utf8");
const LINES = FILE.split(/\r?\n/);

// Match the canonical 8-scope moralCircle line:
//   moralCircle: { universalAffinity: N, scopedAffinities: { national: N, religious: N, ethnic_racial: N, class: N, gender: N, sexual: N, ideological: N, political_camp: N } },
const RE = /^(\s*)moralCircle:\s*\{\s*universalAffinity:\s*([0-9.]+),\s*scopedAffinities:\s*\{\s*national:\s*([0-9.]+),\s*religious:\s*([0-9.]+),\s*ethnic_racial:\s*([0-9.]+),\s*class:\s*([0-9.]+),\s*gender:\s*([0-9.]+),\s*sexual:\s*([0-9.]+),\s*ideological:\s*([0-9.]+),\s*political_camp:\s*([0-9.]+)\s*\}\s*\}\s*,?\s*$/;

let changed = 0;
for (let i = 0; i < LINES.length; i++) {
  const m = RE.exec(LINES[i]!);
  if (!m) continue;
  const indent = m[1]!;
  const universal = parseFloat(m[2]!);
  const national = parseFloat(m[3]!);
  const religious = parseFloat(m[4]!);
  const ethnic_racial = parseFloat(m[5]!);
  const klass = parseFloat(m[6]!);
  const gender = parseFloat(m[7]!);
  // sexual = parseFloat(m[8]) — dropped
  const ideologicalOld = parseFloat(m[9]!);
  const political_camp = parseFloat(m[10]!);

  const ideological = Math.max(ideologicalOld, political_camp);

  LINES[i] = `${indent}moralCircle: { universalAffinity: ${Math.round(universal)}, scopedAffinities: { national: ${Math.round(national)}, religious: ${Math.round(religious)}, ethnic_racial: ${Math.round(ethnic_racial)}, class: ${Math.round(klass)}, gender: ${Math.round(gender)}, ideological: ${Math.round(ideological)} } },`;
  changed++;
}

writeFileSync(PATH, LINES.join("\n"), "utf8");
console.log(`Updated ${changed} archetype moralCircle entries (8 scopes → 6).`);
