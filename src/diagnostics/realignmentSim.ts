// Realignment-pattern verification. Tests whether the engine can route
// the four most common Trump-era departures from straight-line party voting:
//
//   1. Suburban college-educated R→D (full Trump-era realignment)
//   2. White working-class Obama→Trump (2016 realignment)
//   3. Hispanic working-class D→Trump (2020/2024 shift)
//   4. Black male D loyalist (stable baseline — no swing)
//
// Plus a 5th: late-realigning Bush voter who tried Trump and left
// (deliberately knife-edge — will likely surface model resolution limit).
//
// Run: `npx tsx src/diagnostics/realignmentSim.ts`

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
  scoped: Partial<Record<"national" | "religious" | "ethnic_racial" | "class" | "gender" | "ideological", number | null>>;
  expected: Record<number, "R" | "D" | "T" | "ABSTAIN">;
}

const NODES = ["MAT", "CD", "CU", "MOR", "PRO", "COM", "ZS", "ONT_H", "ONT_S", "PF"] as const;

function buildSig(p: Persona): NodeSignature {
  const sig: NodeSignature = {};
  for (const n of NODES) {
    const pos = p.pos[n];
    const dist = Array(5).fill(0).map((_, i) => {
      const d = (i + 1) - pos;
      return Math.exp(-(d * d) / (2 * 0.85 * 0.85));
    });
    const sum = dist.reduce((a, b) => a + b, 0);
    sig[n] = { pos, sal: p.sal[n], posDist: dist.map(d => d / sum) } as NodeSignatureEntry;
  }
  sig.AES = { catDist: p.aes, sal: 2.44 } as NodeSignatureEntry;
  sig.EPS = { catDist: p.eps, sal: 1.54 } as NodeSignatureEntry;
  return sig;
}

function classify(party: string): "R" | "D" | "T" {
  if (["Republican", "Federalist", "National Republican", "Whig"].includes(party)) return "R";
  if (["Democratic", "Democratic-Republican", "Free Soil", "Dixiecrat"].includes(party)) return "D";
  return "T";
}

const PERSONAS: Persona[] = [
  {
    name: "1. Suburban college-educated R → D (full Trump-era realignment)",
    blurb: "Voted McCain 2008, Romney 2012, then defected to Clinton 2016, stayed D for Biden/Harris. The 'never-Trump R' archetype.",
    partyID: "I",
    engagement: "engaged",
    strategicVoting: false,
    pos: { MAT: 4.0, CD: 2.5, CU: 3.5, MOR: 3.5, PRO: 4.5, COM: 3.5, ZS: 2.5, ONT_H: 3.5, ONT_S: 4.0, PF: 2.5 },
    sal: { MAT: 2.6, CD: 2.4, CU: 2.4, MOR: 2.4, PRO: 2.8, COM: 2.2, ZS: 2.2, ONT_H: 1.8, ONT_S: 2.8, PF: 1.5 },
    aes: [0.60, 0.15, 0.05, 0.10, 0.05, 0.05],
    eps: [0.20, 0.55, 0.10, 0.05, 0.05, 0.05],
    universal: 65,
    scoped: { national: 60, religious: null, ethnic_racial: null, class: null, gender: null, ideological: null },
    expected: { 2008: "R", 2012: "R", 2016: "D", 2020: "D", 2024: "D" },
  },
  {
    name: "2. White working-class Obama → Trump (2016 realignment)",
    blurb: "Voted Obama 2008/2012 (hope, anti-Romney economics), shifted hard to Trump 2016 and stayed. Classic Macomb County / Rust Belt pattern.",
    partyID: "I",
    engagement: "engaged",
    strategicVoting: false,
    pos: { MAT: 2.5, CD: 4.0, CU: 2.0, MOR: 2.5, PRO: 2.5, COM: 2.5, ZS: 4.0, ONT_H: 3.0, ONT_S: 2.5, PF: 2.8 },
    sal: { MAT: 2.7, CD: 2.5, CU: 2.5, MOR: 2.3, PRO: 2.2, COM: 2.0, ZS: 2.5, ONT_H: 1.8, ONT_S: 2.4, PF: 1.8 },
    aes: [0.10, 0.08, 0.15, 0.35, 0.27, 0.05],
    eps: [0.10, 0.10, 0.15, 0.40, 0.20, 0.05],
    universal: 50,
    scoped: { national: 75, religious: 65, ethnic_racial: null, class: 70, gender: null, ideological: null },
    expected: { 2008: "D", 2012: "D", 2016: "R", 2020: "R", 2024: "R" },
  },
  {
    name: "3. Hispanic working-class D → Trump (2020/2024 shift)",
    blurb: "Voted Obama/Obama/Clinton, then shifted to Trump in 2020 (economic anxiety, anti-socialism messaging, family-values resonance) and stayed for 2024.",
    partyID: "D",
    engagement: "engaged",
    strategicVoting: false,
    pos: { MAT: 2.7, CD: 3.8, CU: 2.8, MOR: 2.5, PRO: 2.8, COM: 2.8, ZS: 3.5, ONT_H: 3.2, ONT_S: 2.7, PF: 2.5 },
    sal: { MAT: 2.5, CD: 2.4, CU: 2.3, MOR: 2.2, PRO: 2.0, COM: 1.8, ZS: 2.3, ONT_H: 1.8, ONT_S: 2.3, PF: 1.5 },
    aes: [0.15, 0.10, 0.20, 0.30, 0.20, 0.05],
    eps: [0.10, 0.15, 0.20, 0.35, 0.15, 0.05],
    universal: 55,
    scoped: { national: 65, religious: 70, ethnic_racial: null, class: 60, gender: null, ideological: null },
    expected: { 2008: "D", 2012: "D", 2016: "D", 2020: "R", 2024: "R" },
  },
  {
    name: "4. Black male moderate D loyalist (stable baseline — no swing)",
    blurb: "Voted D every cycle 2008-2024. Religious, moderately traditional culturally, redistributionist economically, strong D-party loyalty. Tests that the model doesn't over-flip stable D voters.",
    partyID: "D",
    engagement: "engaged",
    strategicVoting: false,
    pos: { MAT: 2.2, CD: 3.3, CU: 2.8, MOR: 3.5, PRO: 3.5, COM: 3.5, ZS: 2.8, ONT_H: 3.5, ONT_S: 3.5, PF: 4.0 },
    sal: { MAT: 2.6, CD: 2.0, CU: 2.0, MOR: 2.5, PRO: 2.4, COM: 2.2, ZS: 2.0, ONT_H: 1.8, ONT_S: 2.4, PF: 2.4 },
    aes: [0.30, 0.10, 0.10, 0.30, 0.15, 0.05],
    eps: [0.20, 0.30, 0.15, 0.25, 0.05, 0.05],
    universal: 60,
    scoped: { national: 60, religious: 75, ethnic_racial: 70, class: 65, gender: null, ideological: 65 },
    expected: { 2008: "D", 2012: "D", 2016: "D", 2020: "D", 2024: "D" },
  },
  {
    name: "5. Bush voter who tried Trump then left (R→R→T→D→D)",
    blurb: "Voted Bush/McCain/Romney/Trump-2016 (gave him a shot), then Biden 2020 and Harris 2024 (saw enough). Knife-edge — stress test of model resolution.",
    partyID: "I",
    engagement: "engaged",
    strategicVoting: false,
    pos: { MAT: 3.7, CD: 3.3, CU: 3.2, MOR: 3.2, PRO: 3.5, COM: 3.5, ZS: 3.0, ONT_H: 3.2, ONT_S: 3.3, PF: 2.3 },
    sal: { MAT: 2.5, CD: 2.4, CU: 2.3, MOR: 2.2, PRO: 2.5, COM: 2.0, ZS: 2.0, ONT_H: 1.8, ONT_S: 2.4, PF: 1.4 },
    aes: [0.40, 0.20, 0.10, 0.15, 0.10, 0.05],
    eps: [0.15, 0.40, 0.15, 0.15, 0.10, 0.05],
    universal: 60,
    scoped: { national: 65, religious: 60, ethnic_racial: null, class: null, gender: null, ideological: null },
    expected: { 2008: "R", 2012: "R", 2016: "R", 2020: "D", 2024: "D" },
  },
];

let totalHits = 0;
let totalChecks = 0;

for (const p of PERSONAS) {
  console.log("=".repeat(100));
  console.log(p.name);
  console.log("  " + p.blurb);
  console.log("=".repeat(100));

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

  let hits = 0;
  let checks = 0;
  const allVotes: Array<{ year: number; name: string; party: string; dist: number; bar: number; decision: string }> = [];

  for (const e of ELECTIONS) {
    const ctx = getContext(e.year);
    if (!ctx) continue;
    const pred = predictVote(sig, e.candidates, ctx, p.engagement, p.partyID, null, null, p.strategicVoting, null, null, mc);
    allVotes.push({
      year: e.year, name: pred.nearest.name, party: pred.nearest.party,
      dist: pred.nearest.distance, bar: pred.clearingBar, decision: pred.decision,
    });

    const expected = p.expected[e.year];
    if (!expected) continue;
    checks++;
    const actual = pred.decision === "abstain" ? "ABSTAIN" : classify(pred.nearest.party);
    if (actual === expected) hits++;
  }

  console.log(`${"Year".padEnd(6)}${"Predicted".padEnd(34)}${"Expected"}`);
  console.log("-".repeat(60));
  for (const year of Object.keys(p.expected).map(Number).sort()) {
    const v = allVotes.find(x => x.year === year);
    if (!v) continue;
    const actual = v.decision === "abstain" ? "ABSTAIN" : `${v.name} (${classify(v.party)})`;
    const match = (v.decision === "abstain" ? "ABSTAIN" : classify(v.party)) === p.expected[year];
    console.log(`${String(year).padEnd(6)}${(actual + ` dist ${v.dist.toFixed(2)}`).padEnd(34)}${p.expected[year]}  ${match ? "✓" : "✗"}`);
  }
  console.log(`Pattern match: ${hits}/${checks}\n`);

  console.log("Full 1996-2024 run:");
  for (const v of allVotes.filter(x => x.year >= 1996)) {
    const c = classify(v.party);
    const dec = v.decision === "abstain" ? "ABSTAIN" : `${v.name} (${c})`;
    console.log(`  ${v.year}  ${dec.padEnd(26)} dist ${v.dist.toFixed(2)}  bar ${v.bar.toFixed(2)}`);
  }
  console.log("");

  totalHits += hits;
  totalChecks += checks;
}

console.log("=".repeat(100));
console.log(`AGGREGATE: ${totalHits}/${totalChecks} (${(100 * totalHits / totalChecks).toFixed(0)}%)`);
console.log("=".repeat(100));
