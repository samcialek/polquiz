// Defining-elections audit. Validates the 2026-05-14 metric rewrite in
// examples/results-prototype-v27.html:findDefiningElections by replicating the
// logic in Node and running it against a synthetic Institutional Leftist
// persona's predictVote output (60 elections × all candidates).
//
// Tier-3 regression: confirms the metric picks the canonically-defining D
// realignment elections (1932 New Deal, 1964 Great Society, 1948 Truman
// civil-rights pivot) rather than incidentally-close-pairing years like
// Bryan 1908.
//
// Run: `npx tsx src/diagnostics/definingElectionsAudit.ts`

import { ELECTIONS } from "../historical/candidates.js";
import { getContext } from "../historical/contexts.js";
import { predictVote } from "../historical/respondentVoteChoice.js";
import { deriveMoralCircleAffinity } from "../moralCircle/affinity.js";
import type { NodeSignature, NodeSignatureEntry } from "../engine/respondentSignature.js";

const MAJOR_PARTIES = new Set([
  "Democratic",
  "Republican",
  "Federalist",
  "Democratic-Republican",
  "National Republican",
  "Whig",
]);

// Institutional Leftist signature, derived from Sam's actual 2026-05-13 dump.
// MAT 1.61 (redistribute), CD 3.94 (mod traditional), CU 2.61, MOR 3.31,
// PRO 3.47, COM 3.08, ONT_S 4.20 (institutionalist, highest sal 2.93),
// ZS 2.46, ONT_H 3.77, PF 4.62.
const NODES = ["MAT", "CD", "CU", "MOR", "PRO", "COM", "ZS", "ONT_H", "ONT_S", "PF"] as const;
const POS: Record<string, number> = {
  MAT: 1.61, CD: 3.94, CU: 2.61, MOR: 3.31, PRO: 3.47,
  COM: 3.08, ZS: 2.46, ONT_H: 3.77, ONT_S: 4.20, PF: 4.62,
};
const SAL: Record<string, number> = {
  MAT: 2.84, CD: 1.78, CU: 2.67, MOR: 2.43, PRO: 2.27,
  COM: 2.62, ZS: 1.77, ONT_H: 2.36, ONT_S: 2.93, PF: 2.33,
};

function buildSignature(): NodeSignature {
  const sig: NodeSignature = {};
  for (const n of NODES) {
    const dist = Array(5).fill(0).map((_, i) => {
      const sd = 1;
      const d = (i + 1) - POS[n];
      return Math.exp(-(d * d) / (2 * sd * sd));
    });
    const sum = dist.reduce((a, b) => a + b, 0);
    const normalized = dist.map(d => d / sum);
    sig[n] = {
      pos: POS[n],
      sal: SAL[n],
      posDist: normalized,
    } as NodeSignatureEntry;
  }
  sig.AES = { catDist: [0.18, 0.12, 0.08, 0.09, 0.11, 0.41], sal: 2.16 } as NodeSignatureEntry;
  sig.EPS = { catDist: [0.59, 0.40, 0.004, 0.003, 0.009, 0.001], sal: 2.40 } as NodeSignatureEntry;
  return sig;
}

const sig = buildSignature();
const moralCircle = deriveMoralCircleAffinity({
  universalAffinity: 66.5,
  scopedAffinities: { national: 68.3, religious: null, ethnic_racial: null, class: 66.25, gender: null, ideological: 82.5 },
});

const candidateDistances: Array<{ year: number; decision: string; clearingBar: number; candidates: Array<{ name: string; party: string; nia: number; dist: number }>; nearest: { name: string; nia: number } }> = [];

for (const election of ELECTIONS) {
  const ctx = getContext(election.year);
  if (!ctx) continue;
  const pred = predictVote(
    sig,
    election.candidates,
    ctx,
    "highly-engaged",
    "D",
    null,
    null,
    true,
    null,
    null,
    moralCircle,
  );
  candidateDistances.push({
    year: election.year,
    decision: pred.decision,
    clearingBar: pred.clearingBar,
    candidates: pred.candidates.map(c => ({
      name: c.name, party: c.party,
      nia: c.nonIdeologicalAdjustedDistance,
      dist: c.distance,
    })),
    nearest: { name: pred.nearest.name, nia: pred.nearest.nonIdeologicalAdjustedDistance },
  });
}

// Apply new defining-elections metric
const gaps: Array<{ year: number; gap: number; reason: string }> = [];
for (const p of candidateDistances) {
  if (p.decision === "abstain") {
    const gap = p.nearest.nia - p.clearingBar;
    if (gap > 0) gaps.push({ year: p.year, gap, reason: `abstain: ${p.nearest.name} ${p.nearest.nia.toFixed(2)} above bar ${p.clearingBar.toFixed(2)}` });
  } else {
    const majorDists = p.candidates
      .filter(c => MAJOR_PARTIES.has(c.party))
      .map(c => ({ nia: c.nia, name: c.name }))
      .sort((a, b) => a.nia - b.nia);
    if (majorDists.length < 2) continue;
    const gap = majorDists[1].nia - majorDists[0].nia;
    gaps.push({ year: p.year, gap, reason: `${majorDists[0].name} ${majorDists[0].nia.toFixed(2)} vs ${majorDists[1].name} ${majorDists[1].nia.toFixed(2)}` });
  }
}
gaps.sort((a, b) => b.gap - a.gap);

console.log("DEFINING-ELECTIONS AUDIT — Institutional Leftist persona\n");
console.log("Top 10 by major-party values gap (new 2026-05-14 metric):\n");
for (let i = 0; i < 10; i++) {
  const g = gaps[i];
  console.log(`  ${i + 1}. ${g.year}  gap ${g.gap.toFixed(3)}  ${g.reason}`);
}

const expected = [1932, 1964, 1948];
const topThree = gaps.slice(0, 3).map(g => g.year).sort();
const expectedSorted = expected.slice().sort();
const match = JSON.stringify(topThree) === JSON.stringify(expectedSorted);
console.log(`\nTop-3 actual:   ${gaps.slice(0, 3).map(g => g.year).join(", ")}`);
console.log(`Top-3 expected: ${expected.join(", ")}`);
console.log(match ? "PASS — defining elections match expected for Institutional Leftist" : "FAIL — top-3 doesn't match expected");
