// PR 6.E.3c — era-context max-merge transformer.
//
// Mechanical cutover under ADR-006: every legacy {MOR, TRB, PF} era-weight
// cluster across the contexts-*.ts triplet collapses into ONE morBoundaries
// slot keyed under "MOR" (the engine already reads "MOR" as the moral-circle
// proxy via getActivationMultiplier in respondentVoteChoice + build-alignment
// after PR 6.E.3a/6.E.3b).
//
// Transformation rules (NO summing, NO unrelated node-weight drift):
//   For each ElectionContext entry:
//     - zeitgeist.nodeWeights:
//         { ..., MOR: x, TRB: y, PF: z, ... } → { ..., MOR: max(x,y,z), ... }
//         (TRB and PF entries are dropped; MOR stays in the source position
//         of the first-encountered M/T/P key; missing keys treated as 0)
//     - issueLandscape.primaryAxis / secondaryAxis / dormant:
//         Collapse {MOR, TRB, PF} to a single MOR placed in the HIGHEST tier
//         any of the three appeared in (primary > secondary > dormant).
//         TRB and PF removed from all three arrays.
//     - candidateActivations[].activationNodes / .threatActivation:
//         Same max-merge as nodeWeights.
//
// All other node weights / array memberships are untouched. Audit summary
// printed per file: # entries modified, before/after fragment for each
// modified election.

import { readFileSync, writeFileSync } from "node:fs";

const MOR_KEYS = new Set(["MOR", "TRB", "PF"]);
const FILES = [
  "src/historical/contexts-1789-1852.ts",
  "src/historical/contexts-1856-1916.ts",
  "src/historical/contexts-1920-2024.ts",
];

// ─── Parse a single-line numeric map literal: "{ K: v, K: v, ... }" ─────
function parseNumericMap(literal) {
  const trimmed = literal.trim();
  if (!trimmed.startsWith("{") || !trimmed.endsWith("}")) return null;
  const inner = trimmed.slice(1, -1).trim();
  if (inner === "") return { entries: [], trailingComma: false };
  const parts = inner.split(",").map(s => s.trim()).filter(Boolean);
  const entries = [];
  for (const p of parts) {
    const m = p.match(/^(\w+)\s*:\s*(-?[\d.eE+-]+)$/);
    if (!m) return null; // unparseable entry; caller logs + skips field, file processing continues
    entries.push([m[1], m[2]]);
  }
  return { entries };
}

function serializeNumericMap(entries) {
  if (entries.length === 0) return "{}";
  return "{ " + entries.map(([k, v]) => `${k}: ${v}`).join(", ") + " }";
}

// ─── Apply max-merge to a parsed entries list ──────────────────────────
function maxMergeEntries(entries) {
  const morEntries = entries.filter(([k]) => MOR_KEYS.has(k));
  if (morEntries.length === 0) return null; // unchanged
  const maxVal = Math.max(...morEntries.map(([, v]) => parseFloat(v)));
  // Format the merged value, preserving 1 decimal if input had decimals:
  const fmt = morEntries.some(([, v]) => v.includes(".")) ? maxVal.toFixed(1) : String(maxVal);
  // Find the source position of the first MOR/TRB/PF — that's where merged MOR goes.
  const firstMorIdx = entries.findIndex(([k]) => MOR_KEYS.has(k));
  const result = [];
  let placedMor = false;
  for (let i = 0; i < entries.length; i++) {
    const [k] = entries[i];
    if (i === firstMorIdx) {
      result.push(["MOR", fmt]);
      placedMor = true;
    } else if (MOR_KEYS.has(k)) {
      // skip — merged into MOR slot above
    } else {
      result.push(entries[i]);
    }
  }
  return { result, mergedValue: fmt, originalCluster: morEntries };
}

// ─── Parse and transform a single-line array literal: ["A", "B", ...] ──
function parseStringArray(literal) {
  const trimmed = literal.trim();
  if (!trimmed.startsWith("[") || !trimmed.endsWith("]")) return null;
  const inner = trimmed.slice(1, -1).trim();
  if (inner === "") return [];
  return inner.split(",").map(s => s.trim().replace(/^"|"$/g, ""));
}

function serializeStringArray(items) {
  if (items.length === 0) return "[]";
  return "[" + items.map(s => `"${s}"`).join(", ") + "]";
}

// ─── Transform a whole ElectionContext block ───────────────────────────
function transformContextsFile(srcPath) {
  const src = readFileSync(srcPath, "utf8");
  let changed = src;
  const audit = [];

  // We iterate election contexts by finding `year: NNNN,` headers and the
  // surrounding context-object braces. But since each interesting line is
  // self-contained (single-line map / array literal), we can use line-based
  // regex rewrites and report the year context separately.

  // Track current year for audit (set when we see a year: line).
  const lines = changed.split("\n");
  let currentYear = "?";
  let modifiedThisEntry = false;
  const entryAudits = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    const yearMatch = line.match(/^\s*year:\s*(\d+),/);
    if (yearMatch) {
      if (modifiedThisEntry) {
        audit.push({ year: currentYear, changes: entryAudits.slice() });
      }
      currentYear = yearMatch[1];
      modifiedThisEntry = false;
      entryAudits.length = 0;
      continue;
    }

    // ── Numeric maps: nodeWeights, activationNodes, threatActivation ──
    for (const fieldName of ["nodeWeights", "activationNodes", "threatActivation"]) {
      const re = new RegExp(`^(\\s*${fieldName}:\\s*)(\\{[^}]*\\})(,?\\s*)$`);
      const m = line.match(re);
      if (m) {
        const parsed = parseNumericMap(m[2]);
        if (!parsed) {
          console.error(`!! could not parse ${fieldName} at ${srcPath}:${i+1}: ${m[2]}`);
          continue;
        }
        const merged = maxMergeEntries(parsed.entries);
        if (merged === null) break; // no MOR/TRB/PF in this map
        const newLine = `${m[1]}${serializeNumericMap(merged.result)}${m[3]}`;
        if (newLine !== line) {
          modifiedThisEntry = true;
          entryAudits.push({
            field: fieldName,
            before: m[2],
            after: serializeNumericMap(merged.result),
            cluster: merged.originalCluster.map(([k, v]) => `${k}=${v}`).join(","),
            merged: merged.mergedValue,
          });
          lines[i] = newLine;
        }
        break;
      }
    }

    // ── Tier arrays handled per-block below; line-level not enough ──
  }

  // ── Issue-landscape array tier-promotion (per ElectionContext block) ──
  // Each ElectionContext has primaryAxis, secondaryAxis, dormant on three
  // adjacent lines inside `issueLandscape: { ... }`. Find each triplet,
  // apply max-merge, and rewrite all three lines together so we know which
  // tier the merged MOR lands in.
  for (let i = 0; i < lines.length; i++) {
    const pmatch = lines[i].match(/^(\s*primaryAxis:\s*)(\[[^\]]*\])(,?\s*)$/);
    if (!pmatch) continue;
    // Find secondaryAxis / dormant within next ~6 lines.
    let secondaryIdx = -1, dormantIdx = -1;
    for (let j = i + 1; j < Math.min(i + 8, lines.length); j++) {
      if (/^\s*secondaryAxis:/.test(lines[j])) secondaryIdx = j;
      else if (/^\s*dormant:/.test(lines[j])) dormantIdx = j;
    }
    if (secondaryIdx < 0 || dormantIdx < 0) continue;
    const smatch = lines[secondaryIdx].match(/^(\s*secondaryAxis:\s*)(\[[^\]]*\])(,?\s*)$/);
    const dmatch = lines[dormantIdx].match(/^(\s*dormant:\s*)(\[[^\]]*\])(,?\s*)$/);
    if (!smatch || !dmatch) continue;

    const primary = parseStringArray(pmatch[2]);
    const secondary = parseStringArray(smatch[2]);
    const dormant = parseStringArray(dmatch[2]);
    if (!primary || !secondary || !dormant) continue;

    const morOrigPrimary = primary.filter(x => MOR_KEYS.has(x));
    const morOrigSecondary = secondary.filter(x => MOR_KEYS.has(x));
    const morOrigDormant = dormant.filter(x => MOR_KEYS.has(x));
    const totalMorMembers = morOrigPrimary.length + morOrigSecondary.length + morOrigDormant.length;
    if (totalMorMembers === 0) continue; // no change

    const inPrimary = morOrigPrimary.length > 0;
    const inSecondary = morOrigSecondary.length > 0;

    // Strip TRB/PF from all tiers; strip MOR from non-target tiers.
    const newPrimary = primary.filter(x => !MOR_KEYS.has(x));
    const newSecondary = secondary.filter(x => !MOR_KEYS.has(x));
    const newDormant = dormant.filter(x => !MOR_KEYS.has(x));

    // Place merged MOR in the highest tier any member appeared in.
    // To minimize cosmetic churn, insert MOR in the position of the first
    // M/T/P member of that tier.
    let targetTier, originalTierArray, newTierArray;
    if (inPrimary) {
      targetTier = "primary";
      originalTierArray = primary;
      newTierArray = newPrimary;
    } else if (inSecondary) {
      targetTier = "secondary";
      originalTierArray = secondary;
      newTierArray = newSecondary;
    } else {
      targetTier = "dormant";
      originalTierArray = dormant;
      newTierArray = newDormant;
    }
    const firstMorPos = originalTierArray.findIndex(x => MOR_KEYS.has(x));
    // newTierArray index where to insert: count non-M/T/P items before firstMorPos
    let insertAt = 0;
    for (let k = 0; k < firstMorPos; k++) {
      if (!MOR_KEYS.has(originalTierArray[k])) insertAt++;
    }
    newTierArray.splice(insertAt, 0, "MOR");

    const newLineP = `${pmatch[1]}${serializeStringArray(targetTier === "primary" ? newTierArray : newPrimary)}${pmatch[3]}`;
    const newLineS = `${smatch[1]}${serializeStringArray(targetTier === "secondary" ? newTierArray : newSecondary)}${smatch[3]}`;
    const newLineD = `${dmatch[1]}${serializeStringArray(targetTier === "dormant" ? newTierArray : newDormant)}${dmatch[3]}`;
    if (newLineP !== lines[i] || newLineS !== lines[secondaryIdx] || newLineD !== lines[dormantIdx]) {
      modifiedThisEntry = true;
      entryAudits.push({
        field: "issueLandscape (tier arrays)",
        cluster: [
          ...morOrigPrimary.map(x => `${x}@primary`),
          ...morOrigSecondary.map(x => `${x}@secondary`),
          ...morOrigDormant.map(x => `${x}@dormant`),
        ].join(","),
        merged: `MOR@${targetTier}`,
      });
      lines[i] = newLineP;
      lines[secondaryIdx] = newLineS;
      lines[dormantIdx] = newLineD;
    }
  }

  // Flush final entry's audit if pending.
  if (modifiedThisEntry) {
    audit.push({ year: currentYear, changes: entryAudits.slice() });
  }

  const newSrc = lines.join("\n");
  writeFileSync(srcPath, newSrc);
  return { changed: newSrc !== src, audit };
}

// ─── Main ──────────────────────────────────────────────────────────────
let totalEntriesModified = 0;
const allAudit = [];
for (const f of FILES) {
  const { changed, audit } = transformContextsFile(f);
  console.log(`\n=== ${f} ===`);
  console.log(`  ${audit.length} election contexts modified`);
  totalEntriesModified += audit.length;
  allAudit.push({ file: f, audit });
}

// Per-entry audit
console.log(`\n========================================`);
console.log(`AUDIT: ${totalEntriesModified} election contexts modified across ${FILES.length} files`);
console.log(`========================================`);
for (const { file, audit } of allAudit) {
  if (audit.length === 0) continue;
  console.log(`\n${file}:`);
  for (const { year, changes } of audit) {
    console.log(`  ${year}:`);
    for (const c of changes) {
      console.log(`    ${c.field}: cluster {${c.cluster}} → MOR=${c.merged ?? "(see arrays)"}`);
    }
  }
}
