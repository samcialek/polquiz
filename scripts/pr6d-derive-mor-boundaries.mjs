// PR 6.D deriver — produces morBoundaries + morIntensity for all
// historical candidates and regimes. Same heuristic family as PR 6.C
// (archetypes), with target-specific overrides for prominent named cases
// from ADR-006.
//
// Reads from: dist/historical/candidates.js, dist/historical/elections-*.js,
//             dist/global/jurisdictions-*.js
// Writes:     results/calibration-exceptions/pr6d-mor-boundaries-derived.json
//   { candidates: { "Roosevelt|1940": {...}, ... },
//     regimes:    { "Sweden|Folkhem Peak|1946": {...}, ... } }
//
// IMPORTANT: rerun npm run build before this script after src changes.

import { ELECTIONS as ALL_ELECTIONS } from "../dist/historical/candidates.js";
import { EUROPE_PART1 } from "../dist/global/jurisdictions-europe1.js";
import { EUROPE_PART2 } from "../dist/global/jurisdictions-europe2.js";
import { AMERICAS } from "../dist/global/jurisdictions-americas.js";
import { ASIA } from "../dist/global/jurisdictions-asia.js";
import { MENA_AFRICA } from "../dist/global/jurisdictions-mena.js";
import { writeFileSync } from "node:fs";

const BASE_LOW = 0.05;
const clamp01 = (x) => Math.max(0, Math.min(1, x));
const round = (x, digits = 2) => Math.round(x * Math.pow(10, digits)) / Math.pow(10, digits);

// ── Per-boundary specificity heuristics (mirror PR 6.C archetype rubric) ──

function specNational(c) {
  let score = 0;
  if (c.CD  >= 4) score += 0.4;
  if (c.CU  <= 2) score += 0.3;
  if (c.MOR <= 2) score += 0.3;
  if (c.MOR >= 4) score -= 0.1;
  if (c.PF  >= 4) score += 0.25;
  return clamp01(score);
}
function specEthnicRacial(c) {
  let score = 0;
  if (c.CD === 5) score += 0.35;
  if (c.CU === 1) score += 0.30;
  if (c.MOR === 1) score += 0.30;
  if (c.CD >= 4 && c.CU <= 2 && c.MOR <= 2) score += 0.15;
  if (c.MOR >= 4) score -= 0.4;
  return clamp01(score);
}
function specReligious(c) {
  let score = 0;
  if (c.CD >= 4) score += 0.30;
  if (c.CU <= 2) score += 0.20;
  // EPS index 2 = traditionalist; for candidates it's a single integer
  if (c.EPS === 2) score += 0.40;
  return clamp01(score);
}
function specClass(c) {
  let score = 0;
  if (c.MAT <= 2) score += 0.5;
  if (c.MAT === 1 && c.ZS >= 4) score += 0.2;
  if (c.MAT <= 2 && c.CD <= 2)  score += 0.1;
  return clamp01(score);
}
function specIdeological(c) {
  let score = 0.10;
  if (c.PF  >= 4) score += 0.3;
  if (c.COM === 1) score += 0.2;
  if ((c.MAT === 1 || c.MAT === 5) && (c.CD === 1 || c.CD === 5)) score += 0.15;
  return clamp01(score);
}
function specGender(c) {
  let score = 0.05;
  if (c.MOR === 1 && c.CD === 5) score += 0.10;
  return clamp01(score);
}

function deriveBoundaries(c) {
  // Use TRB.pos as activation magnitude; for candidates/regimes TRB is a number.
  const trbActivation = (c.TRB - 1) / 4;
  const politicalTribe = (c.PF - 1) / 4;
  const apply = (spec) => round(BASE_LOW + trbActivation * spec * (1 - BASE_LOW));
  return {
    national:        apply(specNational(c)),
    ethnic_racial:   apply(specEthnicRacial(c)),
    religious:       apply(specReligious(c)),
    class:           apply(specClass(c)),
    ideological:     apply(specIdeological(c)),
    gender:          apply(specGender(c)),
    political_tribe: round(politicalTribe),
  };
}

function deriveIntensity(c) {
  // Candidates/regimes don't have MOR.sal — use TRB.pos and PF.pos only.
  // (Sanity floor: never below 1.0 for engaged campaigns/regimes;
  // ENG > 3 implies meaningful activation.)
  const fromTrb = (c.TRB - 1) * 0.75;
  const fromPf  = (c.PF  - 1) * 0.75;
  const fromEng = (c.ENG - 1) * 0.5; // weak fallback contribution
  return round(Math.max(fromTrb, fromPf, fromEng), 2);
}

// ── Candidate-specific named overrides (per ADR-006 examples) ─────────────

const CANDIDATE_OVERRIDES = {
  // Format: "name|year"
  "Wallace|1968": {
    boundaries: { national: 0.60, ethnic_racial: 0.85, religious: 0.30, class: 0.20, ideological: 0.30, gender: 0.10, political_tribe: 0.70 },
    intensity: 3.0,
  },
  "Trump|2016": {
    boundaries: { national: 0.85, ethnic_racial: 0.60, religious: 0.20, class: 0.15, ideological: 0.40, gender: 0.20, political_tribe: 0.85 },
    intensity: 3.0,
  },
  "Trump|2020": {
    boundaries: { national: 0.85, ethnic_racial: 0.60, religious: 0.25, class: 0.15, ideological: 0.45, gender: 0.20, political_tribe: 0.95 },
    intensity: 3.0,
  },
  "Trump|2024": {
    boundaries: { national: 0.85, ethnic_racial: 0.60, religious: 0.30, class: 0.20, ideological: 0.50, gender: 0.20, political_tribe: 0.95 },
    intensity: 3.0,
  },
  "Obama|2008": {
    boundaries: { national: 0.50, ethnic_racial: 0.20, religious: 0.15, class: 0.20, ideological: 0.40, gender: 0.10, political_tribe: 0.50 },
    intensity: 2.5,
  },
  "Obama|2012": {
    boundaries: { national: 0.50, ethnic_racial: 0.25, religious: 0.15, class: 0.30, ideological: 0.45, gender: 0.15, political_tribe: 0.55 },
    intensity: 2.5,
  },
  "Kennedy|1960": {
    boundaries: { national: 0.50, ethnic_racial: 0.20, religious: 0.50, class: 0.25, ideological: 0.35, gender: 0.10, political_tribe: 0.50 },
    intensity: 2.5,
  },
  "Reagan|1980": {
    boundaries: { national: 0.70, ethnic_racial: 0.30, religious: 0.50, class: 0.20, ideological: 0.50, gender: 0.15, political_tribe: 0.60 },
    intensity: 2.5,
  },
  "Reagan|1984": {
    boundaries: { national: 0.70, ethnic_racial: 0.30, religious: 0.50, class: 0.15, ideological: 0.50, gender: 0.15, political_tribe: 0.65 },
    intensity: 2.5,
  },
  "H. Clinton|2016": { // Hillary
    boundaries: { national: 0.40, ethnic_racial: 0.30, religious: 0.10, class: 0.30, ideological: 0.45, gender: 0.50, political_tribe: 0.70 },
    intensity: 2.5,
  },
  "Biden|2020": {
    boundaries: { national: 0.45, ethnic_racial: 0.20, religious: 0.20, class: 0.30, ideological: 0.40, gender: 0.15, political_tribe: 0.65 },
    intensity: 2.5,
  },
  "Harris|2024": {
    boundaries: { national: 0.40, ethnic_racial: 0.40, religious: 0.10, class: 0.30, ideological: 0.45, gender: 0.45, political_tribe: 0.65 },
    intensity: 2.5,
  },
  "Lincoln|1860": {
    boundaries: { national: 0.85, ethnic_racial: 0.55, religious: 0.40, class: 0.20, ideological: 0.50, gender: 0.10, political_tribe: 0.50 },
    intensity: 3.0,
  },
  "Lincoln|1864": {
    boundaries: { national: 0.90, ethnic_racial: 0.60, religious: 0.40, class: 0.20, ideological: 0.55, gender: 0.10, political_tribe: 0.55 },
    intensity: 3.0,
  },
};

// ── Candidate demographic membership (hard-coded for prominent cases) ─────
// `null` means not coded (Layer 2 lock-and-key skips for that category).

const CANDIDATE_MEMBERSHIP = {
  "Trump|2016":      { ethnic_racial: "white",    religious: "Protestant", class: "upper",        gender: "male",   political_tribe: "R" },
  "Trump|2020":      { ethnic_racial: "white",    religious: "Protestant", class: "upper",        gender: "male",   political_tribe: "R" },
  "Trump|2024":      { ethnic_racial: "white",    religious: "Protestant", class: "upper",        gender: "male",   political_tribe: "R" },
  "Obama|2008":      { ethnic_racial: "Black",    religious: "Protestant", class: "middle",       gender: "male",   political_tribe: "D" },
  "Obama|2012":      { ethnic_racial: "Black",    religious: "Protestant", class: "middle",       gender: "male",   political_tribe: "D" },
  "Biden|2020":      { ethnic_racial: "white",    religious: "Catholic",   class: "middle",       gender: "male",   political_tribe: "D" },
  "Harris|2024":     { ethnic_racial: "Black",    religious: "Protestant", class: "middle",       gender: "female", political_tribe: "D" },
  "H. Clinton|2016": { ethnic_racial: "white",    religious: "Protestant", class: "middle",       gender: "female", political_tribe: "D" },
  "Clinton|1992":    { ethnic_racial: "white",    religious: "Protestant", class: "working",      gender: "male",   political_tribe: "D" },
  "Clinton|1996":    { ethnic_racial: "white",    religious: "Protestant", class: "working",      gender: "male",   political_tribe: "D" },
  "Kennedy|1960":    { ethnic_racial: "white",    religious: "Catholic",   class: "upper",        gender: "male",   political_tribe: "D" },
  "Reagan|1980":     { ethnic_racial: "white",    religious: "Protestant", class: "middle",       gender: "male",   political_tribe: "R" },
  "Reagan|1984":     { ethnic_racial: "white",    religious: "Protestant", class: "middle",       gender: "male",   political_tribe: "R" },
  "Romney|2012":     { ethnic_racial: "white",    religious: "Mormon",     class: "upper",        gender: "male",   political_tribe: "R" },
  "Bush|1988":       { ethnic_racial: "white",    religious: "Protestant", class: "upper",        gender: "male",   political_tribe: "R" },
  "Bush|1992":       { ethnic_racial: "white",    religious: "Protestant", class: "upper",        gender: "male",   political_tribe: "R" },
  "Bush|2000":       { ethnic_racial: "white",    religious: "Protestant", class: "upper",        gender: "male",   political_tribe: "R" },
  "Bush|2004":       { ethnic_racial: "white",    religious: "Protestant", class: "upper",        gender: "male",   political_tribe: "R" },
  "Carter|1976":     { ethnic_racial: "white",    religious: "Protestant", class: "middle",       gender: "male",   political_tribe: "D" },
  "Carter|1980":     { ethnic_racial: "white",    religious: "Protestant", class: "middle",       gender: "male",   political_tribe: "D" },
  "Roosevelt|1932":  { ethnic_racial: "white",    religious: "Protestant", class: "upper",        gender: "male",   political_tribe: "D" },
  "Roosevelt|1936":  { ethnic_racial: "white",    religious: "Protestant", class: "upper",        gender: "male",   political_tribe: "D" },
  "Roosevelt|1940":  { ethnic_racial: "white",    religious: "Protestant", class: "upper",        gender: "male",   political_tribe: "D" },
  "Roosevelt|1944":  { ethnic_racial: "white",    religious: "Protestant", class: "upper",        gender: "male",   political_tribe: "D" },
  "Lincoln|1860":    { ethnic_racial: "white",    religious: "Protestant", class: "working",      gender: "male",   political_tribe: "R" },
  "Lincoln|1864":    { ethnic_racial: "white",    religious: "Protestant", class: "working",      gender: "male",   political_tribe: "R" },
  "Wallace|1968":    { ethnic_racial: "white",    religious: "Protestant", class: "middle",       gender: "male",   political_tribe: "third" },
};

// ── Regime-specific named overrides (per ADR-006 examples) ─────────────────

const REGIME_OVERRIDES = {
  // Format: "jurisdiction|regime|startYear"
  "Sweden|Folkhem Peak|1946": {
    boundaries: { national: 0.40, ethnic_racial: 0.10, religious: 0.05, class: 0.60, ideological: 0.40, gender: 0.15, political_tribe: 0.50 },
    intensity: 2.5,
  },
  "Germany/Prussia|Nazi Germany|1933": {
    boundaries: { national: 0.90, ethnic_racial: 0.95, religious: 0.30, class: 0.20, ideological: 0.60, gender: 0.20, political_tribe: 0.95 },
    intensity: 3.0,
  },
  "Switzerland|Modern Switzerland|2011": {
    boundaries: { national: 0.40, ethnic_racial: 0.15, religious: 0.10, class: 0.20, ideological: 0.20, gender: 0.10, political_tribe: 0.15 },
    intensity: 1.5,
  },
  "China|Mao Radical|1958": {
    boundaries: { national: 0.30, ethnic_racial: 0.20, religious: 0.05, class: 0.85, ideological: 0.95, gender: 0.20, political_tribe: 0.95 },
    intensity: 3.0,
  },
};

// ── Run derivations ──────────────────────────────────────────────────────

const candidatesOut = {};
let candidatesTotal = 0;
for (const election of ALL_ELECTIONS) {
  for (const c of election.candidates) {
    candidatesTotal++;
    const key = `${c.name}|${c.year}`;
    const override = CANDIDATE_OVERRIDES[key];
    if (override) {
      candidatesOut[key] = { ...override, _source: "override" };
    } else {
      candidatesOut[key] = {
        boundaries: deriveBoundaries(c),
        intensity: deriveIntensity(c),
        _source: "heuristic",
      };
    }
    candidatesOut[key].membership = CANDIDATE_MEMBERSHIP[key] ?? null;
  }
}

const regimesOut = {};
const ALL_REGIMES = [...EUROPE_PART1, ...EUROPE_PART2, ...AMERICAS, ...ASIA, ...MENA_AFRICA];
let regimesTotal = 0;
for (const r of ALL_REGIMES) {
  regimesTotal++;
  const key = `${r.jurisdiction}|${r.regime}|${r.startYear}`;
  const override = REGIME_OVERRIDES[key];
  if (override) {
    regimesOut[key] = { ...override, _source: "override" };
  } else {
    regimesOut[key] = {
      boundaries: deriveBoundaries(r),
      intensity: deriveIntensity(r),
      _source: "heuristic",
    };
  }
}

writeFileSync(
  "results/calibration-exceptions/pr6d-mor-boundaries-derived.json",
  JSON.stringify({ candidates: candidatesOut, regimes: regimesOut }, null, 2),
);

console.log(`Wrote derivations: ${candidatesTotal} candidates, ${regimesTotal} regimes`);

// Warn about unused override / membership keys — catches typos and dead
// aliases (e.g., "JFK|1960" when the actual candidate name is "Kennedy",
// or primary-only candidates like Sanders that aren't in the general-
// election candidate list).
const candidateKeysUsed = new Set();
for (const election of ALL_ELECTIONS) {
  for (const c of election.candidates) candidateKeysUsed.add(`${c.name}|${c.year}`);
}
const unusedOverrides = Object.keys(CANDIDATE_OVERRIDES).filter(k => !candidateKeysUsed.has(k));
const unusedMemberships = Object.keys(CANDIDATE_MEMBERSHIP).filter(k => !candidateKeysUsed.has(k));
if (unusedOverrides.length > 0) {
  console.warn(`\n⚠ Unused override keys (no matching candidate-year in ALL_ELECTIONS): ${unusedOverrides.join(", ")}`);
}
if (unusedMemberships.length > 0) {
  console.warn(`⚠ Unused membership keys (no matching candidate-year in ALL_ELECTIONS): ${unusedMemberships.join(", ")}`);
}
const regimeKeysUsed = new Set();
for (const r of ALL_REGIMES) regimeKeysUsed.add(`${r.jurisdiction}|${r.regime}|${r.startYear}`);
const unusedRegimeOverrides = Object.keys(REGIME_OVERRIDES).filter(k => !regimeKeysUsed.has(k));
if (unusedRegimeOverrides.length > 0) {
  console.warn(`⚠ Unused regime override keys: ${unusedRegimeOverrides.join(", ")}`);
}

// ── Spot checks ──────────────────────────────────────────────────────────

console.log("\n=== Candidate spot checks ===");
const CAND_SPOT = ["Trump|2016", "Obama|2008", "Kennedy|1960", "Reagan|1984", "Lincoln|1860", "Roosevelt|1940", "Wallace|1968", "H. Clinton|2016", "Harris|2024", "Carter|1976"];
for (const k of CAND_SPOT) {
  const d = candidatesOut[k];
  if (!d) { console.log(`  ${k}: NOT FOUND`); continue; }
  const b = d.boundaries;
  const m = d.membership;
  console.log(`  ${k.padEnd(20)} [${d._source.padEnd(9)}] nat=${b.national.toFixed(2)} eth=${b.ethnic_racial.toFixed(2)} rel=${b.religious.toFixed(2)} cls=${b.class.toFixed(2)} ide=${b.ideological.toFixed(2)} gen=${b.gender.toFixed(2)} ptrib=${b.political_tribe.toFixed(2)} int=${d.intensity.toFixed(2)}`);
  if (m) console.log(`       membership: ethnic=${m.ethnic_racial} religious=${m.religious} class=${m.class} gender=${m.gender} ptrib=${m.political_tribe}`);
}

console.log("\n=== Regime spot checks ===");
const REG_SPOT = [
  "Sweden|Folkhem Peak|1946",
  "Germany/Prussia|Nazi Germany|1933",
  "Hungary|Orban's Hungary|2010",
  "Russia/USSR|Stalin|1929",
  "China|Mao Radical|1958",
  "Switzerland|Modern Switzerland|2011",
  "Germany/Prussia|West Germany/Bonn Republic|1949",
  "USA|Polarization Era|2008",
  "USA|Cold War Consensus|1953",
];
for (const k of REG_SPOT) {
  const d = regimesOut[k];
  if (!d) { console.log(`  ${k}: NOT FOUND`); continue; }
  const b = d.boundaries;
  console.log(`  ${k.padEnd(45)} [${d._source.padEnd(9)}] nat=${b.national.toFixed(2)} eth=${b.ethnic_racial.toFixed(2)} rel=${b.religious.toFixed(2)} cls=${b.class.toFixed(2)} ide=${b.ideological.toFixed(2)} gen=${b.gender.toFixed(2)} ptrib=${b.political_tribe.toFixed(2)} int=${d.intensity.toFixed(2)}`);
}
