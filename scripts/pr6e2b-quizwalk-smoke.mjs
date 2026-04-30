// PR 6.E.2b invariant smoke — a normal quiz path must end with morBoundaries
// meaningfully shifted from {boundaries: 0.5, intensity: 0}.
//
// Sam's review criterion (2026-04-30): once api.ts initializes morBoundaries,
// archetypeDistance.ts's per-archetype gate flips to the new module branch.
// If update.ts has no bridge from legacy MOR/TRB/PF/trbAnchor evidence,
// every respondent ends with the default {0.5, 0} init and the new module
// contributes near-neutrally — "new module active, but mostly neutral."
//
// This walk drives a quiz to completion using a deterministic answering
// strategy and asserts the module shifted in expected directions for three
// answer profiles:
//   A — "first-option always"   → produces SOME shift (smoke: bridge fires)
//   B — "last-option always"    → opposite-direction shift vs A
//   C — "midpoint always"       → smaller shift, but non-trivial
//
// All three must show |boundaries[k] - 0.5| > 0.03 on at least 3 boundaries
// AND/OR intensity > 0.30 by quiz end.

import {
  initQuiz,
  getNextQuestion,
  submitAnswer,
  isComplete,
  getRespondentState,
  getProgress,
  previewIdentityPrimary,
} from "../dist/browser/api.js";

let failures = 0;
function assert(name, cond, info = "") {
  if (cond) {
    console.log(`  ✓ ${name}`);
  } else {
    failures++;
    console.log(`  ✗ ${name} ${info}`);
  }
}

function pickAnswer(q, strategy) {
  const opts = q.options || [];
  switch (q.uiType) {
    case "single_choice":
    case "conjoint":
    case "multi": {
      if (opts.length === 0) return q.options?.[0] ?? "";
      if (strategy === "first") return opts[0];
      if (strategy === "last")  return opts[opts.length - 1];
      return opts[Math.floor(opts.length / 2)];
    }
    case "slider": {
      const min = q.slider?.min ?? 0;
      const max = q.slider?.max ?? 100;
      if (strategy === "first") return min;
      if (strategy === "last")  return max;
      return Math.round((min + max) / 2);
    }
    case "dual_axis": {
      if (strategy === "first") return { x: 0.0, y: 0.5 };
      if (strategy === "last")  return { x: 1.0, y: 1.0 };
      return { x: 0.5, y: 0.5 };
    }
    case "allocation": {
      const buckets = q.allocationBuckets || [];
      const out = {};
      if (buckets.length === 0) return out;
      if (strategy === "first") {
        out[buckets[0]] = 100;
        for (let i = 1; i < buckets.length; i++) out[buckets[i]] = 0;
      } else if (strategy === "last") {
        out[buckets[buckets.length - 1]] = 100;
        for (let i = 0; i < buckets.length - 1; i++) out[buckets[i]] = 0;
      } else {
        const each = Math.floor(100 / buckets.length);
        for (const b of buckets) out[b] = each;
      }
      return out;
    }
    case "ranking": {
      const items = q.rankingItems || [];
      if (strategy === "last") return items.slice().reverse();
      return items.slice();
    }
    case "pairwise": {
      const out = {};
      for (const pid of q.pairIds || []) {
        const opts = q.pairOptions?.[pid] || [];
        if (opts.length === 0) continue;
        if (strategy === "first")      out[pid] = opts[0];
        else if (strategy === "last")  out[pid] = opts[opts.length - 1];
        else                           out[pid] = opts[Math.floor(opts.length / 2)];
      }
      return out;
    }
    case "best_worst": {
      const items = q.bestWorstItems || [];
      if (items.length === 0) return { best: [], worst: [] };
      const n = q.bwMaxPicks ?? 1;
      if (strategy === "first") {
        return { best: items.slice(0, n), worst: items.slice(-n) };
      }
      if (strategy === "last") {
        return { best: items.slice(-n), worst: items.slice(0, n) };
      }
      return { best: items.slice(0, n), worst: items.slice(-n) };
    }
    case "priority_sort": {
      const items = q.bestWorstItems || q.rankingItems || [];
      if (items.length === 0) {
        return { supportHigh: [], supportMid: [], neutral: [], opposeHigh: [] };
      }
      if (strategy === "first") {
        return { supportHigh: items.slice(), supportMid: [], neutral: [], opposeHigh: [] };
      }
      if (strategy === "last") {
        return { supportHigh: [], supportMid: [], neutral: [], opposeHigh: items.slice() };
      }
      const q1 = Math.ceil(items.length / 4);
      return {
        supportHigh: items.slice(0, q1),
        supportMid:  items.slice(q1, 2 * q1),
        neutral:     items.slice(2 * q1, 3 * q1),
        opposeHigh:  items.slice(3 * q1),
      };
    }
    default:
      return opts[0] ?? "";
  }
}

function walkQuiz(strategy) {
  initQuiz();
  let answered = 0;
  while (!isComplete() && answered < 80) {
    const q = getNextQuestion();
    if (!q) break;
    const ans = pickAnswer(q, strategy);
    try {
      submitAnswer(q.id, ans);
    } catch (e) {
      console.log(`    answer error on Q${q.id} (${q.uiType}): ${e.message}`);
      throw e;
    }
    answered++;
  }
  return { answered, state: getRespondentState() };
}

function summarizeMor(mb) {
  const ks = ["national", "ethnic_racial", "religious", "class", "ideological", "gender", "political_tribe"];
  return {
    intensity: mb.intensity,
    load: mb.boundaryLoad,
    universalism: mb.universalismScore,
    boundedness: mb.boundednessScore,
    boundaries: Object.fromEntries(ks.map(k => [k, mb.boundaries[k]])),
  };
}

function shiftedBoundaryCount(mb, threshold = 0.03) {
  let n = 0;
  for (const v of Object.values(mb.boundaries)) {
    if (Math.abs(v - 0.5) > threshold) n++;
  }
  return n;
}

console.log("=== Initial state check ===");
initQuiz();
const init = getRespondentState();
assert("initial state has morBoundaries", init.morBoundaries !== null && init.morBoundaries !== undefined);
if (init.morBoundaries) {
  console.log(`  init: intensity=${init.morBoundaries.intensity}, all boundaries 0.5? ${
    Object.values(init.morBoundaries.boundaries).every(v => v === 0.5)
  }`);
  assert("initial intensity = 0", init.morBoundaries.intensity === 0);
  assert("initial all boundaries = 0.5",
    Object.values(init.morBoundaries.boundaries).every(v => v === 0.5));
}

const profiles = ["first", "last", "mid"];
const results = {};
for (const strategy of profiles) {
  console.log(`\n=== Walk strategy: ${strategy.toUpperCase()} ===`);
  const r = walkQuiz(strategy);
  console.log(`  answered ${r.answered} questions`);
  if (!r.state.morBoundaries) {
    console.log(`  ✗ getRespondentState returned null morBoundaries`);
    failures++;
    continue;
  }
  const mb = r.state.morBoundaries;
  console.log(`  intensity=${mb.intensity.toFixed(3)}, load=${mb.boundaryLoad.toFixed(3)}, ` +
              `universalism=${mb.universalismScore.toFixed(3)}, boundedness=${mb.boundednessScore.toFixed(3)}`);
  const bs = mb.boundaries;
  console.log(`  boundaries: nat=${bs.national.toFixed(2)}, eth=${bs.ethnic_racial.toFixed(2)}, ` +
              `rel=${bs.religious.toFixed(2)}, cls=${bs.class.toFixed(2)}, ` +
              `ide=${bs.ideological.toFixed(2)}, gen=${bs.gender.toFixed(2)}, ` +
              `pt=${bs.political_tribe.toFixed(2)}`);
  const shiftedCount = shiftedBoundaryCount(mb);
  console.log(`  boundaries shifted >0.03 from 0.5: ${shiftedCount} of 7`);
  results[strategy] = summarizeMor(mb);

  const meaningfulShift = shiftedCount >= 3 || mb.intensity > 0.30;
  assert(`${strategy}: morBoundaries meaningfully shifted (≥3 boundaries OR intensity>0.30)`,
    meaningfulShift);
}

console.log(`\n=== Resolver gate snapshots (via previewIdentityPrimary) ===`);
// `getResults().identityPrimary` only surfaces active/dominant states; deterministic
// walks here don't push intensity high enough (>2.25) to clear that threshold.
// previewIdentityPrimary returns the raw resolver result so we can verify the
// gate fields are populated from morBoundaries (intensity + load), not from
// legacy TRB/PF state.
for (const strategy of profiles) {
  walkQuiz(strategy);
  const ip = previewIdentityPrimary();
  if (!ip) {
    console.log(`  ${strategy}: previewIdentityPrimary returned null`);
    failures++;
    continue;
  }
  console.log(`  ${strategy}: state=${ip.state}, anchor=${ip.anchor ?? "(none)"}, ` +
              `int=${ip.gate.intensity.toFixed(2)}, load=${ip.gate.load.toFixed(2)}, ` +
              `latent=${ip.gate.passedLatent}, active=${ip.gate.passedActive}, ` +
              `reasons=[${ip.reasonCodes.join(",")}]`);
  assert(`${strategy}: gate.intensity is finite number from morBoundaries`,
    typeof ip.gate.intensity === "number" && Number.isFinite(ip.gate.intensity));
  assert(`${strategy}: gate.load is finite number from morBoundaries`,
    typeof ip.gate.load === "number" && Number.isFinite(ip.gate.load));
  // Resolver consistency: gate.intensity should match getRespondentState's morBoundaries.intensity.
  const stateNow = getRespondentState();
  assert(`${strategy}: resolver gate.intensity matches state.morBoundaries.intensity`,
    Math.abs(ip.gate.intensity - stateNow.morBoundaries.intensity) < 1e-9);
}

console.log(`\n=== Cross-profile sanity ===`);
if (results.first && results.last) {
  const f = results.first.boundaries;
  const l = results.last.boundaries;
  let oppositeDirCount = 0;
  for (const k of Object.keys(f)) {
    const fSign = Math.sign(f[k] - 0.5);
    const lSign = Math.sign(l[k] - 0.5);
    if (fSign !== 0 && lSign !== 0 && fSign !== lSign) oppositeDirCount++;
  }
  console.log(`  boundaries pulled in OPPOSITE directions between first/last: ${oppositeDirCount} of 7`);
  assert("first and last strategies pull at least 1 boundary in opposite directions", oppositeDirCount >= 1);
  console.log(`  intensity: first=${results.first.intensity.toFixed(3)}, ` +
              `last=${results.last.intensity.toFixed(3)}, ` +
              `mid=${results.mid?.intensity.toFixed(3) ?? "n/a"}`);
}

console.log(`\n${failures === 0 ? "✅ ALL PASS" : `❌ ${failures} FAILURES`}`);
process.exit(failures === 0 ? 0 : 1);
