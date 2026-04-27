// Run the engine 3 times with 3 explicitly-different respondent profiles
// (deterministic answer-pickers that simulate hard-left, hard-right, and
// libertarian respondents). Compare question sets to see if adaptive
// selection actually diverges across profiles.
//
// Hypothesis: 32 forced FIXED_OPENER questions force >85% question
// overlap, leaving only ~5 adaptive picks per profile.

const api = require("../dist/browser/api.js");
const { REPRESENTATIVE_QUESTIONS } = require("../dist/config/questions.representative.js");

const QMAP = new Map(REPRESENTATIVE_QUESTIONS.map(q => [q.id, q]));

// Three respondent profiles. Each is a "preferred direction" hint that the
// answer-picker uses to choose options. Hard-left wants MAT-low (redistributive),
// hard-right wants MAT-high, libertarian wants ONT_S-low.
const PROFILES = {
  "hard-left": {
    MAT: 1, CD: 2, CU: 4, MOR: 5, PRO: 3, COM: 2, ZS: 4, ONT_H: 4, ONT_S: 4,
  },
  "religious-right": {
    MAT: 4, CD: 5, CU: 2, MOR: 2, PRO: 4, COM: 2, ZS: 3, ONT_H: 5, ONT_S: 3,
  },
  "libertarian": {
    MAT: 5, CD: 3, CU: 4, MOR: 3, PRO: 5, COM: 4, ZS: 2, ONT_H: 3, ONT_S: 1,
  },
};

// Pick the option key whose evidence best matches the profile.
function pickAnswer(q, profile) {
  // For ranking / dual-axis / priority_sort etc, return a generic plausible
  // answer (won't be the most-discriminating, but won't error).
  if (q.uiType === "priority_sort") {
    // Salience screener: rank top-3 nodes by profile preference
    const items = Object.keys(q.optionLabels || {});
    const sorted = items.map(i => ({ i, score: Math.abs((profile[i.toUpperCase()] ?? 3) - 3) }))
      .sort((a, b) => b.score - a.score);
    return {
      supportHigh: sorted.slice(0, 3).map(x => x.i),
      supportMid: sorted.slice(3, 6).map(x => x.i),
      neutral: sorted.slice(6).map(x => x.i),
      opposeHigh: [],
    };
  }
  if (q.uiType === "ranking" || q.uiType === "best_worst") {
    const items = Object.keys(q.rankingMap || q.optionEvidence || {});
    if (q.uiType === "best_worst") return { best: items[0] || "x", worst: items[items.length - 1] || "y" };
    return items;
  }
  if (q.uiType === "slider") {
    // Pick midpoint biased by relevant node
    const node = (q.touchProfile || []).find(t => t.role === "position")?.node;
    return node && profile[node] ? Math.max(1, Math.min(100, (profile[node] - 1) * 25)) : 50;
  }
  if (q.uiType === "allocation") {
    const buckets = Object.keys(q.allocationMap || {});
    const out = {};
    buckets.forEach(b => out[b] = 100 / buckets.length);
    return out;
  }
  if (q.uiType === "pairwise") {
    const out = {};
    if (q.pairs) q.pairs.forEach(p => out[p.id] = p.optionA);
    return out;
  }
  if (q.uiType === "dual_axis") return { x: 0.5, y: 0.5 };
  if (q.uiType === "multi") return [];
  // single_choice: score each option by evidence vs profile
  if (q.uiType === "single_choice" && q.optionEvidence) {
    let best = { key: null, score: -Infinity };
    for (const [key, ev] of Object.entries(q.optionEvidence)) {
      let s = 0;
      if (ev.continuous) {
        for (const [node, upd] of Object.entries(ev.continuous)) {
          const target = profile[node];
          if (!target || !upd.pos) continue;
          // Higher score if pos peaks near profile target
          s += (upd.pos[target - 1] || 0) * 2;
        }
      }
      if (s > best.score) best = { key, score: s };
    }
    if (best.key) return best.key;
    if (q.options && q.options.length) return q.options[0];
  }
  if (q.options && q.options.length) return q.options[0];
  return null;
}

function runProfile(name, profile) {
  api.initQuiz();
  const seen = [];
  let safety = 80;
  let q;
  while ((q = api.getNextQuestion()) && safety-- > 0) {
    seen.push(q.id);
    const answer = pickAnswer(q, profile);
    if (answer === null) break;
    try {
      api.submitAnswer(q.id, answer);
    } catch (e) {
      console.log(`[${name}] Q${q.id} (${q.uiType}) submit failed: ${e.message}`);
      break;
    }
    if (api.isComplete()) break;
  }
  return seen;
}

// Uses NEW Salience-Router fixed front door (CORE_OPENER + UNIVERSAL_SCREENERS).
const FIXED_OPENER = [
  // CORE_OPENER (10) — salience routers + metadata
  200, 103, 97, 1, 60, 89, 22, 218, 211, 212,
  // UNIVERSAL_SCREENERS (5) — give every node ≥ 1 light position read
  93, 102, 209, 210, 214,
];

const results = {};
for (const [name, profile] of Object.entries(PROFILES)) {
  console.log(`\n=== ${name} ===`);
  const seen = runProfile(name, profile);
  const fxCount = seen.filter(q => FIXED_OPENER.includes(q)).length;
  const adaptiveCount = seen.length - fxCount;
  results[name] = seen;
  console.log(`Total: ${seen.length}, Fixed: ${fxCount}, Adaptive: ${adaptiveCount}`);
  console.log(`Adaptive picks: ${seen.filter(q => !FIXED_OPENER.includes(q)).join(", ")}`);
}

console.log(`\n=== Cross-profile divergence ===`);
const all = Object.values(results).flat();
const intersect = Object.values(results).reduce((acc, s) =>
  acc === null ? new Set(s) : new Set(s.filter(x => acc.has(x)))
, null);
const union = new Set(all);
console.log(`Union (any profile): ${union.size}`);
console.log(`Intersection (all profiles): ${intersect.size}`);
console.log(`Overlap %: ${(intersect.size / union.size * 100).toFixed(1)}%`);

// Per-profile unique adaptive picks
console.log(`\n=== Adaptive picks per profile ===`);
for (const [name, seen] of Object.entries(results)) {
  const adaptive = seen.filter(q => !FIXED_OPENER.includes(q));
  const unique = adaptive.filter(q =>
    !Object.entries(results).some(([n, s]) => n !== name && s.includes(q))
  );
  console.log(`${name}: ${adaptive.length} adaptive (${unique.length} unique to this profile): ${adaptive.join(",")} | unique: ${unique.join(",") || "none"}`);
}
