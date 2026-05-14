// Swing-voter pattern verification. Tests whether the engine can route
// canonical swing-voting archetypes — Trump-mobilization abstainers,
// 2016-Trump/2020-Biden/2024-Trump triple-switchers, Obama-Trump realignment
// voters — to their expected vote patterns when given values consistent with
// those archetypes.
//
// Each persona declares an expected pattern; the script reports match rate
// and flags discrepancies.

import { ELECTIONS } from "../historical/candidates.js";
import { getContext } from "../historical/contexts.js";
import { predictVote } from "../historical/respondentVoteChoice.js";
import { deriveMoralCircleAffinity } from "../moralCircle/affinity.js";
import type { NodeSignature, NodeSignatureEntry } from "../engine/respondentSignature.js";
import type { EngagementLevel } from "../engine/engagementLabel.js";

interface Persona {
  name: string;
  blurb: string;
  partyID: "D" | "R" | "I" | "N";
  engagement: EngagementLevel;
  strategicVoting: boolean;
  pos: Record<string, number>;
  sal: Record<string, number>;
  aes: number[];
  eps: number[];
  universal: number;
  scoped: { national?: number; religious?: number; ethnic_racial?: number; class?: number; gender?: number; ideological?: number };
  expected: Record<number, "R" | "D" | "T" | "ABSTAIN">;
}

const NODES = ["MAT", "CD", "CU", "MOR", "PRO", "COM", "ZS", "ONT_H", "ONT_S", "PF"] as const;

function buildSig(p: Persona): NodeSignature {
  const sig: NodeSignature = {};
  for (const n of NODES) {
    const pos = p.pos[n];
    const dist = Array(5).fill(0).map((_, i) => {
      const sd = 0.85;
      const d = (i + 1) - pos;
      return Math.exp(-(d * d) / (2 * sd * sd));
    });
    const sum = dist.reduce((a, b) => a + b, 0);
    sig[n] = { pos, sal: p.sal[n], posDist: dist.map(d => d / sum) } as NodeSignatureEntry;
  }
  sig.AES = { catDist: p.aes, sal: 2.44 } as NodeSignatureEntry;
  sig.EPS = { catDist: p.eps, sal: 1.54 } as NodeSignatureEntry;
  return sig;
}

const PERSONAS: Persona[] = [
  {
    name: "A. Abstain → Trump (2016 mobilizer)",
    blurb: "Disaffected non-college voter, didn't vote in 2008/2012 (no candidate close), mobilized by Trump's anti-establishment + cultural pitch. Stayed Trump 2020/2024.",
    partyID: "I",
    engagement: "casual",
    strategicVoting: false,
    pos: { MAT: 3.5, CD: 4.7, CU: 1.6, MOR: 2.0, PRO: 1.5, COM: 1.5, ZS: 4.5, ONT_H: 2.5, ONT_S: 1.8, PF: 3.5 },
    sal: { MAT: 2.5, CD: 2.8, CU: 2.8, MOR: 2.5, PRO: 2.3, COM: 2.0, ZS: 2.5, ONT_H: 1.5, ONT_S: 2.5, PF: 2.0 },
    aes: [0.05, 0.05, 0.05, 0.20, 0.55, 0.10],
    eps: [0.05, 0.05, 0.15, 0.50, 0.20, 0.05],
    universal: 40,
    scoped: { national: 85, religious: 70, ethnic_racial: 60, class: 50, gender: 45, ideological: 55 },
    expected: { 2008: "ABSTAIN", 2012: "ABSTAIN", 2016: "R", 2020: "R", 2024: "R" },
  },
  {
    name: "B. Trump → Biden → Trump (true triple-switcher)",
    blurb: "Centrist non-college voter, voted Trump 2016 (change), defected to Biden 2020 (chaos fatigue), back to Trump 2024 (inflation/border). Knife-edge centrist.",
    partyID: "I",
    engagement: "engaged",
    strategicVoting: false,
    // Iteration 3: classic working-class swing — D-leaning economics (MAT
    // moderate-low) but R-leaning culture (CD high, CU low, ZS high). 2008/
    // 2012 should still go R because McCain/Romney are economic moderates
    // and the cultural axis dominates. 2016/2024 Trump natural fit. 2020
    // is the test — Biden has +0.15 modifier vs Trump -0.025 (∆ ≈ 0.175);
    // values need Biden within that distance of Trump on this profile.
    pos: { MAT: 3.0, CD: 3.5, CU: 2.4, MOR: 2.7, PRO: 2.7, COM: 2.8, ZS: 3.3, ONT_H: 2.8, ONT_S: 2.8, PF: 2.0 },
    sal: { MAT: 2.0, CD: 2.5, CU: 2.4, MOR: 2.0, PRO: 2.2, COM: 1.8, ZS: 2.2, ONT_H: 1.8, ONT_S: 2.2, PF: 1.3 },
    aes: [0.15, 0.10, 0.10, 0.30, 0.25, 0.10],
    eps: [0.12, 0.18, 0.15, 0.35, 0.15, 0.05],
    universal: 55,
    scoped: { national: 68, religious: 60, ethnic_racial: null as any, class: 55, gender: null as any, ideological: null as any },
    expected: { 2008: "R", 2012: "R", 2016: "R", 2020: "D", 2024: "R" },
  },
  {
    name: "C. Obama → Trump (2012 realignment voter)",
    blurb: "Working-class voter, voted Obama 2008/2012 (hope/change, economic relief), swung to Trump 2016 (drain swamp, immigration). Stayed Trump.",
    partyID: "I",
    engagement: "engaged",
    strategicVoting: false,
    pos: { MAT: 2.4, CD: 4.0, CU: 2.0, MOR: 2.5, PRO: 2.4, COM: 2.5, ZS: 4.0, ONT_H: 3.0, ONT_S: 2.4, PF: 2.8 },
    sal: { MAT: 2.7, CD: 2.5, CU: 2.5, MOR: 2.3, PRO: 2.2, COM: 2.0, ZS: 2.5, ONT_H: 1.8, ONT_S: 2.4, PF: 1.8 },
    aes: [0.10, 0.08, 0.15, 0.35, 0.27, 0.05],
    eps: [0.10, 0.10, 0.15, 0.40, 0.20, 0.05],
    universal: 50,
    scoped: { national: 75, religious: 65, ethnic_racial: null as any, class: 70, gender: null as any, ideological: null as any },
    expected: { 2008: "D", 2012: "D", 2016: "R", 2020: "R", 2024: "R" },
  },
];

function classify(party: string): "R" | "D" | "T" {
  if (party === "Republican" || party === "Federalist" || party === "National Republican" || party === "Whig") return "R";
  if (party === "Democratic" || party === "Democratic-Republican" || party === "Free Soil" || party === "Dixiecrat") return "D";
  return "T";
}

for (const p of PERSONAS) {
  console.log("=".repeat(95));
  console.log(p.name);
  console.log("  " + p.blurb);
  console.log("=".repeat(95));
  const sig = buildSig(p);
  const mc = deriveMoralCircleAffinity({
    universalAffinity: p.universal,
    scopedAffinities: {
      national: p.scoped.national ?? null,
      religious: p.scoped.religious ?? null,
      ethnic_racial: p.scoped.ethnic_racial ?? null,
      class: p.scoped.class ?? null,
      gender: p.scoped.gender ?? null,
      ideological: p.scoped.ideological ?? null,
    },
  });

  let modernCorrect = 0;
  let modernTotal = 0;
  console.log(`${"Year".padEnd(6)}${"Predicted".padEnd(34)}${"Expected".padEnd(12)}${"Match"}`);
  console.log("-".repeat(70));
  const yearVotes: Array<{ year: number; pred: string; party: string; dist: number; bar: number; decision: string }> = [];
  for (const e of ELECTIONS) {
    const ctx = getContext(e.year);
    if (!ctx) continue;
    const pred = predictVote(sig, e.candidates, ctx, p.engagement, p.partyID, null, null, p.strategicVoting, null, null, mc);
    yearVotes.push({
      year: e.year, pred: pred.nearest.name, party: pred.nearest.party,
      dist: pred.nearest.distance, bar: pred.clearingBar, decision: pred.decision,
    });
    const expected = p.expected[e.year];
    if (!expected) continue;
    modernTotal++;
    const actual = pred.decision === "abstain" ? "ABSTAIN" : classify(pred.nearest.party);
    const match = actual === expected;
    if (match) modernCorrect++;
    const detail = pred.decision === "abstain"
      ? `abstain (nearest ${pred.nearest.name}/${classify(pred.nearest.party)} ${pred.nearest.distance.toFixed(2)} > bar ${pred.clearingBar.toFixed(2)})`
      : `${pred.nearest.name} (${classify(pred.nearest.party)}) dist ${pred.nearest.distance.toFixed(2)}`;
    console.log(`${String(e.year).padEnd(6)}${detail.padEnd(34)}${expected.padEnd(12)}${match ? "✓" : "✗"}`);
  }
  console.log("-".repeat(70));
  console.log(`Pattern match: ${modernCorrect}/${modernTotal}\n`);

  // Per-candidate 2020 breakdown for the triple-switcher debug
  if (p.name.startsWith("B.")) {
    const ctx2020 = getContext(2020);
    const el2020 = ELECTIONS.find(e => e.year === 2020);
    if (ctx2020 && el2020) {
      const pred = predictVote(sig, el2020.candidates, ctx2020, p.engagement, p.partyID, null, null, p.strategicVoting, null, null, mc);
      console.log("2020 candidate breakdown for Persona B:");
      for (const c of pred.candidates) {
        console.log(`  ${c.name.padEnd(14)} valuesDist ${c.ideologicalDistance.toFixed(2)}  +nonIdeoMod ${c.nonIdeologicalModifier.toFixed(3)}  → adjusted ${c.nonIdeologicalAdjustedDistance.toFixed(2)}  final ${c.distance.toFixed(2)}`);
      }
      console.log("");
    }
  }
  console.log("Full 1996-2024 run (context for sanity-check):");
  for (const v of yearVotes.filter(v => v.year >= 1996)) {
    const c = classify(v.party);
    const dec = v.decision === "abstain" ? "ABSTAIN" : `${v.pred} (${c})`;
    console.log(`  ${v.year}  ${dec.padEnd(28)} dist ${v.dist.toFixed(2)}  bar ${v.bar.toFixed(2)}`);
  }
  console.log("");
}
