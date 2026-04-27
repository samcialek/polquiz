// Reproduce the Q27 double-ask bug.
// Walk the engine through FIXED_OPENER until Q27, submit answer "fn",
// apply a ratio-boost (which is what the live UI does for "fn" follow-up),
// then check what getNextQuestion returns.

const api = require("../dist/browser/api.js");

api.initQuiz();
console.log("Quiz initialized.");

const seen = [];
let q;
let safety = 50;
while ((q = api.getNextQuestion()) && safety-- > 0) {
  // Answer with the first option key for simplicity, until we hit Q27
  if (q.id === 27) {
    seen.push(q.id);
    console.log(`Q27 served (count: ${seen.filter(x => x === 27).length})`);
    api.submitAnswer(27, "fn");
    console.log("  submitAnswer(27, 'fn') done");
    api.applyRatioBoost(27, 10);
    console.log("  applyRatioBoost(27, 10) done");
    // Now check next question
    const next = api.getNextQuestion();
    console.log(`  Next question after Q27 + boost: Q${next?.id}`);
    if (next?.id === 27) {
      console.log("  *** BUG REPRODUCED: Q27 re-served ***");
    }
    break;
  }
  seen.push(q.id);
  // Pick the first available option key for this question
  let answer;
  if (q.options && q.options.length) answer = q.options[0];
  else if (q.uiType === "slider") answer = 50;
  else if (q.uiType === "allocation") {
    answer = {};
    if (q.allocationBuckets) q.allocationBuckets.forEach((b, i) => answer[b] = i === 0 ? 100 : 0);
  }
  else if (q.uiType === "ranking") answer = (q.rankingItems || []).map(i => i);
  else if (q.uiType === "best_worst") answer = { best: q.bwOptions?.[0] ?? "x", worst: q.bwOptions?.[1] ?? "y" };
  else if (q.uiType === "pairwise") {
    answer = {};
    if (q.pairs) q.pairs.forEach(p => { answer[p.id] = p.optionA; });
  }
  else if (q.uiType === "dual_axis") answer = { x: 0.5, y: 0.5 };
  else if (q.uiType === "single_choice") answer = "skip";
  else if (q.uiType === "priority_sort") answer = { supportHigh: [], supportMid: [], neutral: [], opposeHigh: [] };
  else if (q.uiType === "multi") answer = [];

  try {
    api.submitAnswer(q.id, answer);
  } catch (e) {
    console.log(`Q${q.id} (${q.uiType}): submit failed — ${e.message}`);
    break;
  }
}

console.log("\nQuestions seen:", seen.join(", "));
