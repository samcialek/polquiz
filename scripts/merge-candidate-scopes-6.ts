/**
 * 2026-05-07 6-scope revision converter for candidates.
 * Same logic as merge-archetype-scopes-6.ts.
 */

import { readFileSync, writeFileSync } from "node:fs";

const PATH = "src/historical/candidates.ts";
const FILE = readFileSync(PATH, "utf8");
const LINES = FILE.split(/\r?\n/);

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
  const ideologicalOld = parseFloat(m[9]!);
  const political_camp = parseFloat(m[10]!);
  const ideological = Math.max(ideologicalOld, political_camp);

  LINES[i] = `${indent}moralCircle: { universalAffinity: ${Math.round(universal)}, scopedAffinities: { national: ${Math.round(national)}, religious: ${Math.round(religious)}, ethnic_racial: ${Math.round(ethnic_racial)}, class: ${Math.round(klass)}, gender: ${Math.round(gender)}, ideological: ${Math.round(ideological)} } },`;
  changed++;
}

writeFileSync(PATH, LINES.join("\n"), "utf8");
console.log(`Updated ${changed} candidate moralCircle entries (8 scopes → 6).`);
