// PR 6.C deriver — produces morBoundaries + morIntensity for all 124
// archetypes per the ADR-006 rubric (mechanical first pass).
//
// IMPORTANT: this script reads from dist/config/archetypes.js. After
// modifying src/config/archetypes.ts, run `npm run build` first to
// regenerate dist before re-running this script.
//
// Output: results/calibration-exceptions/pr6c-mor-boundaries-derived.json
//   { "001": { boundaries: {...7 fields...}, intensity: number }, ... }
//
// Heuristic basis:
//   - intensity = max(MOR.sal, (TRB.pos-1)*0.75, (PF.pos-1)*0.75)
//   - political_tribe = (PF.pos - 1) / 4
//   - Other 6 boundaries: BASE_LOW + trb_activation * specificity * (1-BASE_LOW)
//     where trb_activation = (TRB.pos - 1) / 4 and specificity is a
//     per-boundary 0..1 score derived from CD/CU/MAT/MOR/EPS positions.
//
// Identity-primary archetypes (141-146) get explicit overrides per ADR-006
// — their continuous signatures are structurally identical so heuristic
// derivation can't distinguish them.

import { ARCHETYPES } from "../dist/config/archetypes.js";
import { writeFileSync } from "node:fs";

const BASE_LOW = 0.05;

const clamp01 = (x) => Math.max(0, Math.min(1, x));
const round = (x, digits = 2) => Math.round(x * Math.pow(10, digits)) / Math.pow(10, digits);

// ── Per-boundary specificity heuristics ────────────────────────────────────

function specNational(a) {
  let score = 0;
  const cd  = a.nodes.CD?.pos  ?? 3;
  const cu  = a.nodes.CU?.pos  ?? 3;
  const mor = a.nodes.MOR?.pos ?? 3;
  const pf  = a.nodes.PF?.pos  ?? 3;
  if (cd  >= 4) score += 0.4;
  if (cu  <= 2) score += 0.3;
  if (mor <= 2) score += 0.3;
  if (mor >= 4) score -= 0.1;   // weakened from -0.2 — civic nationalism is high-MOR + high-PF
  // US politics is national-scale; high party fusion implies modest national
  // boundary activation regardless of cultural-direction position. Catches
  // civic-nationalist profiles (high PF, progressive CD) the trad-CD branch
  // misses.
  if (pf  >= 4) score += 0.25;
  return clamp01(score);
}

function specEthnicRacial(a) {
  let score = 0;
  const cd  = a.nodes.CD?.pos  ?? 3;
  const cu  = a.nodes.CU?.pos  ?? 3;
  const mor = a.nodes.MOR?.pos ?? 3;
  if (cd === 5)         score += 0.35;
  if (cu === 1)         score += 0.30;
  if (mor === 1)        score += 0.30;
  if (cd >= 4 && cu <= 2 && mor <= 2) score += 0.15; // amplifier when all three align
  if (mor >= 4)         score -= 0.4;
  return clamp01(score);
}

function specReligious(a) {
  let score = 0;
  const cd  = a.nodes.CD?.pos  ?? 3;
  const cu  = a.nodes.CU?.pos  ?? 3;
  const eps = a.nodes.EPS;
  if (cd >= 4) score += 0.30;
  if (cu <= 2) score += 0.20;
  // EPS traditionalist-dominant (probs[2]) is a real religious signal
  if (eps?.kind === "categorical" && eps.probs[2] >= 0.5) score += 0.40;
  return clamp01(score);
}

function specClass(a) {
  let score = 0;
  const mat = a.nodes.MAT?.pos ?? 3;
  const cd  = a.nodes.CD?.pos  ?? 3;
  const zs  = a.nodes.ZS?.pos  ?? 3;
  if (mat <= 2) score += 0.5;
  if (mat === 1 && zs >= 4) score += 0.2; // class-warfare amplifier
  if (mat <= 2 && cd <= 2)  score += 0.1;
  return clamp01(score);
}

function specIdeological(a) {
  let score = 0.10; // baseline — most politically-engaged people have some ideological identity
  const pf  = a.nodes.PF?.pos  ?? 3;
  const com = a.nodes.COM?.pos ?? 3;
  const mat = a.nodes.MAT?.pos ?? 3;
  const cd  = a.nodes.CD?.pos  ?? 3;
  if (pf  >= 4) score += 0.3;
  if (com === 1) score += 0.2;
  // extreme-on-both-axes archetypes are usually ideologically organized
  if ((mat === 1 || mat === 5) && (cd === 1 || cd === 5)) score += 0.15;
  return clamp01(score);
}

function specGender(a) {
  // Without TRB_ANCHOR data, gender-anchored politics is hard to detect from
  // the continuous signature. Default low; identity-primary archetypes
  // (141-146) get explicit overrides above.
  let score = 0.05;
  const mor = a.nodes.MOR?.pos ?? 3;
  const cd  = a.nodes.CD?.pos  ?? 3;
  if (mor === 1 && cd === 5) score += 0.10; // gender-traditionalist hint
  return clamp01(score);
}

// ── Identity-primary overrides (per ADR-006) ──────────────────────────────

const IDENTITY_PRIMARY_OVERRIDES = {
  "141": { // Black Voter
    boundaries: { national: 0.35, ethnic_racial: 0.90, religious: 0.30, class: 0.40, ideological: 0.30, gender: 0.15, political_tribe: 0.65 },
    intensity: 3.0,
  },
  "142": { // White Grievance Voter
    boundaries: { national: 0.65, ethnic_racial: 0.90, religious: 0.35, class: 0.30, ideological: 0.40, gender: 0.30, political_tribe: 0.70 },
    intensity: 3.0,
  },
  "143": { // Evangelical Voter
    boundaries: { national: 0.55, ethnic_racial: 0.30, religious: 0.85, class: 0.15, ideological: 0.40, gender: 0.30, political_tribe: 0.60 },
    intensity: 3.0,
  },
  "144": { // LGBTQ Voter
    boundaries: { national: 0.20, ethnic_racial: 0.20, religious: 0.10, class: 0.20, ideological: 0.45, gender: 0.90, political_tribe: 0.55 },
    intensity: 3.0,
  },
  "145": { // Feminist Voter
    boundaries: { national: 0.25, ethnic_racial: 0.25, religious: 0.10, class: 0.30, ideological: 0.50, gender: 0.85, political_tribe: 0.55 },
    intensity: 3.0,
  },
  "146": { // Male Grievance Voter
    boundaries: { national: 0.45, ethnic_racial: 0.40, religious: 0.25, class: 0.25, ideological: 0.45, gender: 0.85, political_tribe: 0.55 },
    intensity: 3.0,
  },
};

// ── Per-archetype derivation ──────────────────────────────────────────────

function deriveOne(a) {
  if (IDENTITY_PRIMARY_OVERRIDES[a.id]) {
    return IDENTITY_PRIMARY_OVERRIDES[a.id];
  }

  const morSal = a.nodes.MOR?.sal ?? 0;
  const trbPos = a.nodes.TRB?.pos ?? 1;
  const pfPos  = a.nodes.PF?.pos  ?? 1;

  const intensity = Math.max(
    morSal,
    (trbPos - 1) * 0.75,
    (pfPos  - 1) * 0.75,
  );

  const trbActivation = (trbPos - 1) / 4; // 0..1
  const politicalTribe = (pfPos - 1) / 4; // 0..1

  const apply = (spec) => round(BASE_LOW + trbActivation * spec * (1 - BASE_LOW));

  return {
    boundaries: {
      national:        apply(specNational(a)),
      ethnic_racial:   apply(specEthnicRacial(a)),
      religious:       apply(specReligious(a)),
      class:           apply(specClass(a)),
      ideological:     apply(specIdeological(a)),
      gender:          apply(specGender(a)),
      political_tribe: round(politicalTribe),
    },
    intensity: round(intensity, 2),
  };
}

// ── Run + write output ────────────────────────────────────────────────────

const out = {};
for (const a of ARCHETYPES) {
  out[a.id] = deriveOne(a);
}

writeFileSync(
  "results/calibration-exceptions/pr6c-mor-boundaries-derived.json",
  JSON.stringify(out, null, 2),
);

console.log(`Wrote ${Object.keys(out).length} archetype derivations to results/calibration-exceptions/pr6c-mor-boundaries-derived.json`);

// ── Spot-check canonical archetypes ──────────────────────────────────────

console.log("\n=== Canonical spot checks ===");
const SPOT_CHECK = [
  ["056", "Institutional Leftist (Sam authentic)"],
  ["011", "Jacobin Egalitarian"],
  ["088", "Gentle Traditionalist"],
  ["084", "Civilizational Conservative"],
  ["110", "Principled Abstainer"],
  ["022", "Pluralist Universalist"],
  ["134", "Progressive Civic Nationalist"],
  ["085", "Customary Localist"],
  ["116", "Quiet Middle"],
  ["092", "Partisan Tribalist"],
  ["141", "Black Voter (identity-primary)"],
  ["142", "White Grievance Voter (identity-primary)"],
  ["145", "Feminist Voter (identity-primary)"],
];

for (const [id, label] of SPOT_CHECK) {
  const d = out[id];
  if (!d) {
    console.log(`  ${id} ${label}: NOT FOUND`);
    continue;
  }
  const b = d.boundaries;
  console.log(`  ${id.padEnd(4)} ${label.padEnd(40)} intensity=${d.intensity.toFixed(2)}`);
  console.log(`       nat=${b.national.toFixed(2)} eth=${b.ethnic_racial.toFixed(2)} rel=${b.religious.toFixed(2)} cls=${b.class.toFixed(2)} ide=${b.ideological.toFixed(2)} gen=${b.gender.toFixed(2)} ptrib=${b.political_tribe.toFixed(2)}`);
}
