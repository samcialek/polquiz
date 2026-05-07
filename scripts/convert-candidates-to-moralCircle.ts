/**
 * One-shot converter: derives `moralCircle` field for every candidate in
 * `src/historical/candidates.ts` from existing MOR (1-5) and morBoundaries
 * (7 boundaries) per ADR-007.
 *
 * Conversion (v0):
 *   universalAffinity = round(20 + (MOR - 1) * 17.5)   // MOR 1→20, MOR 5→90
 *   scoped[g]         = round(boundaries[g] * 100)
 *   scoped.sexual     = round(boundaries.gender * 100) // legacy folded
 *   scoped.political_camp = round(boundaries.political_tribe * 100)
 *
 * For candidates lacking morBoundaries entirely, the script falls back to
 * deriving boundaries from TRB (legacy 1-5). High TRB = high all scopes;
 * low TRB = low all scopes. PF specifically loads political_camp.
 *
 * Run with: npx tsx scripts/convert-candidates-to-moralCircle.ts
 * Writes back to src/historical/candidates.ts in place.
 */

import { readFileSync, writeFileSync } from "node:fs";

const PATH = "src/historical/candidates.ts";
const FILE = readFileSync(PATH, "utf8");
const LINES = FILE.split(/\r?\n/);

interface CandidateMatch {
  morLine: number;       // line containing `MOR: N,`
  morValue: number;
  trbLine: number;
  trbValue: number;
  pfLine: number;
  pfValue: number;
  morBoundariesLine: number; // line containing morBoundaries definition (-1 if absent)
  boundaries: {
    national: number;
    ethnic_racial: number;
    religious: number;
    class: number;
    ideological: number;
    gender: number;
    political_tribe: number;
  } | null;
  /** End of the candidate object body — line containing the closing `},`. */
  endLine: number;
  /** Indentation prefix for inserted moralCircle line. */
  indent: string;
}

function findCandidates(): CandidateMatch[] {
  const out: CandidateMatch[] = [];
  // Match candidate object boundaries by looking for `name: "...",` lines
  // (each candidate has one) and the closing `},` after.
  // For each candidate, we extract MOR, TRB, PF, and morBoundaries.

  let i = 0;
  while (i < LINES.length) {
    const line = LINES[i]!;
    const nameMatch = /^\s*name:\s*"[^"]+"\s*,\s*$/.exec(line);
    if (!nameMatch) { i++; continue; }

    // Search forward up to ~40 lines for MOR/TRB/PF/morBoundaries and the closing
    let mor = -1, trb = -1, pf = -1, mb = -1;
    let morV = NaN, trbV = NaN, pfV = NaN;
    let boundaries: CandidateMatch["boundaries"] = null;
    let end = -1;
    let indent = "      ";
    for (let j = i + 1; j < Math.min(i + 60, LINES.length); j++) {
      const l = LINES[j]!;
      const morM = /^(\s*)MOR:\s*([0-9.]+)\s*,/.exec(l);
      if (morM) { mor = j; morV = parseFloat(morM[2]!); indent = morM[1]!; continue; }
      const trbM = /^\s*TRB:\s*([0-9.]+)\s*,/.exec(l);
      if (trbM) { trb = j; trbV = parseFloat(trbM[1]!); continue; }
      const pfM = /^\s*PF:\s*([0-9.]+)\s*,/.exec(l);
      if (pfM) { pf = j; pfV = parseFloat(pfM[1]!); continue; }
      // morBoundaries: { boundaries: {...}, intensity: N },
      const mbM = /^\s*morBoundaries:\s*\{\s*boundaries:\s*\{\s*national:\s*([0-9.]+),\s*ethnic_racial:\s*([0-9.]+),\s*religious:\s*([0-9.]+),\s*class:\s*([0-9.]+),\s*ideological:\s*([0-9.]+),\s*gender:\s*([0-9.]+),\s*political_tribe:\s*([0-9.]+)\s*\}/.exec(l);
      if (mbM) {
        mb = j;
        boundaries = {
          national: parseFloat(mbM[1]!),
          ethnic_racial: parseFloat(mbM[2]!),
          religious: parseFloat(mbM[3]!),
          class: parseFloat(mbM[4]!),
          ideological: parseFloat(mbM[5]!),
          gender: parseFloat(mbM[6]!),
          political_tribe: parseFloat(mbM[7]!),
        };
        continue;
      }
      // End of candidate object: a line that's just `    },` at the candidate's
      // body indent (2 spaces less than property indent).
      if (/^\s*\},?\s*$/.test(l) && j > (mor !== -1 ? mor : i)) {
        end = j;
        break;
      }
    }

    if (mor !== -1 && end !== -1) {
      out.push({
        morLine: mor,
        morValue: morV,
        trbLine: trb,
        trbValue: trbV,
        pfLine: pf,
        pfValue: pfV,
        morBoundariesLine: mb,
        boundaries,
        endLine: end,
        indent,
      });
      i = end + 1;
    } else {
      i++;
    }
  }
  return out;
}

function deriveUniversal(mor: number): number {
  if (!Number.isFinite(mor)) return 50;
  return Math.round(20 + (mor - 1) * 17.5); // 1→20, 3→55, 5→90
}

function fallbackBoundariesFromTrbPf(trb: number, pf: number): CandidateMatch["boundaries"] {
  // No morBoundaries entry — derive from TRB and PF only.
  // High TRB → moderate national+ideological+religious+class+gender; low TRB → low.
  // High PF → high political_tribe.
  const trbN = Number.isFinite(trb) ? (trb - 1) / 4 : 0.3; // 0..1
  const pfN = Number.isFinite(pf) ? (pf - 1) / 4 : 0.3;
  const base = trbN * 0.6;
  return {
    national: base,
    ethnic_racial: base * 0.7,
    religious: base * 0.7,
    class: base * 0.6,
    ideological: base * 0.8,
    gender: base * 0.5,
    political_tribe: pfN,
  };
}

function deriveScoped(b: NonNullable<CandidateMatch["boundaries"]>): {
  national: number; religious: number; ethnic_racial: number; class: number;
  gender: number; sexual: number; ideological: number; political_camp: number;
} {
  return {
    national: Math.round(b.national * 100),
    religious: Math.round(b.religious * 100),
    ethnic_racial: Math.round(b.ethnic_racial * 100),
    class: Math.round(b.class * 100),
    gender: Math.round(b.gender * 100),
    sexual: Math.round(b.gender * 100), // mirror
    ideological: Math.round(b.ideological * 100),
    political_camp: Math.round(b.political_tribe * 100),
  };
}

function buildLine(c: CandidateMatch): string {
  const universal = deriveUniversal(c.morValue);
  const boundaries = c.boundaries ?? fallbackBoundariesFromTrbPf(c.trbValue, c.pfValue);
  const s = deriveScoped(boundaries);
  return `${c.indent}moralCircle: { universalAffinity: ${universal}, scopedAffinities: { national: ${s.national}, religious: ${s.religious}, ethnic_racial: ${s.ethnic_racial}, class: ${s.class}, gender: ${s.gender}, sexual: ${s.sexual}, ideological: ${s.ideological}, political_camp: ${s.political_camp} } },`;
}

const candidates = findCandidates();
console.log(`Found ${candidates.length} candidates`);
console.log(`  with morBoundaries: ${candidates.filter(c => c.boundaries).length}`);
console.log(`  without morBoundaries (fallback derivation): ${candidates.filter(c => !c.boundaries).length}`);

// Insert from bottom to keep indices valid.
for (let i = candidates.length - 1; i >= 0; i--) {
  const c = candidates[i]!;
  const newLine = buildLine(c);
  // Insert after the morBoundaries line if present; else after the MOR line.
  const insertAfter = c.morBoundariesLine !== -1 ? c.morBoundariesLine : c.morLine;
  LINES.splice(insertAfter + 1, 0, newLine);
}

writeFileSync(PATH, LINES.join("\n"), "utf8");
console.log(`Wrote ${PATH}`);
