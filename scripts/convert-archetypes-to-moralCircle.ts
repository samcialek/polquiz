/**
 * One-shot converter: derives `moralCircle` field for every archetype in
 * `src/config/archetypes.ts` from the existing `morBoundaries` field per
 * ADR-007 §"Identity-Primary Resolver Migration".
 *
 * Conversion rules (v0):
 *   universalAffinity = round((1 - max(boundaries)) * 70 + 30)
 *     range: 30..100; high when no boundary dominates, low when one does
 *   scoped[g]        = round(boundaries[g] * 100)
 *   scoped.sexual    = round(boundaries.gender * 100)  // legacy folded sexual into gender
 *   scoped.political_camp = round(boundaries.political_tribe * 100)
 *
 * IDP archetypes 141-146 get hand-tuned overrides per ADR-007 overlay map.
 *
 * Run with: npx tsx scripts/convert-archetypes-to-moralCircle.ts
 * Writes back to src/config/archetypes.ts in place.
 */

import { readFileSync, writeFileSync } from "node:fs";

const PATH = "src/config/archetypes.ts";

interface LegacyBoundaries {
  national: number;
  ethnic_racial: number;
  religious: number;
  class: number;
  ideological: number;
  gender: number;
  political_tribe: number;
}

interface ParsedArchetype {
  id: string;
  morBoundariesLine: string; // full line text including indent
  morBoundariesLineIndex: number;
  boundaries: LegacyBoundaries;
  intensity: number;
}

const FILE = readFileSync(PATH, "utf8");
const LINES = FILE.split(/\r?\n/);

function findArchetypes(): ParsedArchetype[] {
  const out: ParsedArchetype[] = [];
  // Match: id: "NNN",
  const idRe = /^\s*id:\s*"([^"]+)"\s*,\s*$/;
  // Match: morBoundaries: { boundaries: { ... }, intensity: N },
  const mbRe =
    /^\s*morBoundaries:\s*\{\s*boundaries:\s*\{\s*national:\s*([0-9.]+),\s*ethnic_racial:\s*([0-9.]+),\s*religious:\s*([0-9.]+),\s*class:\s*([0-9.]+),\s*ideological:\s*([0-9.]+),\s*gender:\s*([0-9.]+),\s*political_tribe:\s*([0-9.]+)\s*\},\s*intensity:\s*([0-9.]+)\s*\}\s*,?\s*$/;

  let currentId: string | null = null;
  for (let i = 0; i < LINES.length; i++) {
    const line = LINES[i]!;
    const idMatch = idRe.exec(line);
    if (idMatch) {
      currentId = idMatch[1]!;
      continue;
    }
    const mbMatch = mbRe.exec(line);
    if (mbMatch && currentId) {
      out.push({
        id: currentId,
        morBoundariesLine: line,
        morBoundariesLineIndex: i,
        boundaries: {
          national: parseFloat(mbMatch[1]!),
          ethnic_racial: parseFloat(mbMatch[2]!),
          religious: parseFloat(mbMatch[3]!),
          class: parseFloat(mbMatch[4]!),
          ideological: parseFloat(mbMatch[5]!),
          gender: parseFloat(mbMatch[6]!),
          political_tribe: parseFloat(mbMatch[7]!),
        },
        intensity: parseFloat(mbMatch[8]!),
      });
      currentId = null; // consumed
    }
  }
  return out;
}

function deriveUniversal(b: LegacyBoundaries): number {
  const max = Math.max(b.national, b.ethnic_racial, b.religious, b.class, b.ideological, b.gender, b.political_tribe);
  return Math.round((1 - max) * 70 + 30);
}

function scopedFromBoundaries(b: LegacyBoundaries): {
  national: number;
  religious: number;
  ethnic_racial: number;
  class: number;
  gender: number;
  sexual: number;
  ideological: number;
  political_camp: number;
} {
  return {
    national: Math.round(b.national * 100),
    religious: Math.round(b.religious * 100),
    ethnic_racial: Math.round(b.ethnic_racial * 100),
    class: Math.round(b.class * 100),
    gender: Math.round(b.gender * 100),
    sexual: Math.round(b.gender * 100), // legacy gender folds sexual; mirror as starting point
    ideological: Math.round(b.ideological * 100),
    political_camp: Math.round(b.political_tribe * 100),
  };
}

// IDP archetype hand-tuned profiles per ADR-007 §"Identity-Primary Resolver
// Migration". Seed values; calibrated pre-T6 commit.
//
// Threshold reminders from ADR-007: gate fires when
//   excess >= 20  AND  scoped >= 70  AND  universal <= 75  AND  intensity03 >= 1.2
// We pick scoped >= 80 on the primary scope, secondary scopes lower, universal
// 30-50 to keep the universal-ceiling gate firing.
const IDP_OVERRIDES: Record<string, {
  universalAffinity: number;
  scopedAffinities: Record<string, number>;
}> = {
  // 141 Black Voter — primary ethnic_racial; matched via demo_ethnicity=black
  "141": {
    universalAffinity: 45,
    scopedAffinities: {
      national: 35,
      religious: 35,
      ethnic_racial: 85,
      class: 50,
      gender: 30,
      sexual: 25,
      ideological: 50,
      political_camp: 60,
    },
  },
  // 142 White Grievance Voter — primary ethnic_racial; matched via demo_ethnicity=white + grievance signals
  "142": {
    universalAffinity: 30,
    scopedAffinities: {
      national: 75,
      religious: 50,
      ethnic_racial: 80,
      class: 45,
      gender: 35,
      sexual: 20,
      ideological: 55,
      political_camp: 55,
    },
  },
  // 143 Evangelical Voter — primary religious; matched via demo_religion=christian
  "143": {
    universalAffinity: 35,
    scopedAffinities: {
      national: 60,
      religious: 90,
      ethnic_racial: 30,
      class: 30,
      gender: 35,
      sexual: 15,
      ideological: 55,
      political_camp: 50,
    },
  },
  // 144 LGBTQ Voter — primary sexual (split out from gender); matched via demo_lgbtq=yes
  "144": {
    universalAffinity: 55,
    scopedAffinities: {
      national: 30,
      religious: 20,
      ethnic_racial: 35,
      class: 45,
      gender: 65,
      sexual: 85,
      ideological: 60,
      political_camp: 55,
    },
  },
  // 145 Feminist Voter — primary gender; matched via demo_gender=female + feminist signals
  "145": {
    universalAffinity: 55,
    scopedAffinities: {
      national: 30,
      religious: 25,
      ethnic_racial: 40,
      class: 50,
      gender: 85,
      sexual: 55,
      ideological: 65,
      political_camp: 50,
    },
  },
  // 146 Male Grievance Voter — primary gender; matched via demo_gender=male + grievance signals
  "146": {
    universalAffinity: 30,
    scopedAffinities: {
      national: 60,
      religious: 35,
      ethnic_racial: 45,
      class: 50,
      gender: 80,
      sexual: 30,
      ideological: 55,
      political_camp: 50,
    },
  },
};

function buildMoralCircleLine(indent: string, p: ParsedArchetype): string {
  if (IDP_OVERRIDES[p.id]) {
    const o = IDP_OVERRIDES[p.id]!;
    const s = o.scopedAffinities;
    return `${indent}moralCircle: { universalAffinity: ${o.universalAffinity}, scopedAffinities: { national: ${s.national}, religious: ${s.religious}, ethnic_racial: ${s.ethnic_racial}, class: ${s.class}, gender: ${s.gender}, sexual: ${s.sexual}, ideological: ${s.ideological}, political_camp: ${s.political_camp} } },`;
  }
  const universalAffinity = deriveUniversal(p.boundaries);
  const s = scopedFromBoundaries(p.boundaries);
  return `${indent}moralCircle: { universalAffinity: ${universalAffinity}, scopedAffinities: { national: ${s.national}, religious: ${s.religious}, ethnic_racial: ${s.ethnic_racial}, class: ${s.class}, gender: ${s.gender}, sexual: ${s.sexual}, ideological: ${s.ideological}, political_camp: ${s.political_camp} } },`;
}

function getIndent(line: string): string {
  const m = /^(\s*)/.exec(line);
  return m ? m[1]! : "    ";
}

function transform(): string {
  const archs = findArchetypes();
  console.log(`Found ${archs.length} archetypes with morBoundaries`);
  const idpCount = archs.filter(a => IDP_OVERRIDES[a.id]).length;
  console.log(`IDP overrides applied to ${idpCount} archetypes`);

  // Insert moralCircle line after each morBoundaries line, walking from
  // the bottom so indices stay valid.
  for (let i = archs.length - 1; i >= 0; i--) {
    const a = archs[i]!;
    const indent = getIndent(LINES[a.morBoundariesLineIndex]!);
    const newLine = buildMoralCircleLine(indent, a);
    LINES.splice(a.morBoundariesLineIndex + 1, 0, newLine);
  }
  return LINES.join("\n");
}

const out = transform();
writeFileSync(PATH, out, "utf8");
console.log(`Wrote ${PATH}`);
