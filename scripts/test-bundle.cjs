/**
 * Quick smoke test: load the bundle in a Node.js VM and verify the API.
 */
const fs = require("fs");
const vm = require("vm");

const code = fs.readFileSync("dist/prism-engine-bundle.js", "utf-8");

// Simulate browser environment (enough for the engine, not for DOM)
const ctx = {
  window: {},
  console: console,
  Math: Math,
  Set: Set,
  Map: Map,
  Infinity: Infinity,
  setTimeout: setTimeout,
  document: null, // DOM functions won't run, but we can check they exist
};
vm.createContext(ctx);
vm.runInContext(code, ctx);

const PE = ctx.PrismEngine;
if (!PE) {
  console.error("ERROR: PrismEngine not found on context");
  process.exit(1);
}

const keys = Object.keys(PE).sort();
console.log("PrismEngine API keys:", keys.join(", "));

// Verify expected API surface
const expected = [
  "initQuiz", "getNextQuestion", "submitAnswer",
  "getProgress", "getResults", "isComplete",
  "getQuestionIds", "getQuestionDef", "getArchetypeCount",
  "mountQuiz", "attachToExistingQuiz"
];
for (const fn of expected) {
  if (typeof PE[fn] !== "function") {
    console.error("MISSING function:", fn);
    process.exit(1);
  }
}
console.log("All expected functions present.");

// Test init
PE.initQuiz();
console.log("Archetype count:", PE.getArchetypeCount());
console.log("Question IDs count:", PE.getQuestionIds().length);

// Test getNextQuestion
const q1 = PE.getNextQuestion();
console.log("First question:", JSON.stringify(q1, null, 2));

// Test submitAnswer (for a single_choice question)
if (q1 && q1.options && q1.options.length > 0) {
  PE.submitAnswer(q1.id, q1.options[0]);
  console.log("Submitted answer for Q" + q1.id + ": " + q1.options[0]);
} else if (q1 && q1.uiType === "slider") {
  PE.submitAnswer(q1.id, 50);
  console.log("Submitted slider answer for Q" + q1.id + ": 50");
}

// Test progress
const progress = PE.getProgress();
console.log("Progress:", JSON.stringify(progress, null, 2));

// Test isComplete
console.log("isComplete:", PE.isComplete());

// Answer a few more questions to test the loop
for (let i = 0; i < 5; i++) {
  const q = PE.getNextQuestion();
  if (!q) break;
  if (q.options && q.options.length > 0) {
    PE.submitAnswer(q.id, q.options[0]);
  } else if (q.uiType === "slider") {
    PE.submitAnswer(q.id, 50);
  } else if (q.rankingItems && q.rankingItems.length > 0) {
    PE.submitAnswer(q.id, q.rankingItems);
  } else if (q.allocationBuckets && q.allocationBuckets.length > 0) {
    const alloc = {};
    q.allocationBuckets.forEach(b => alloc[b] = 25);
    PE.submitAnswer(q.id, alloc);
  } else if (q.bestWorstItems && q.bestWorstItems.length >= 2) {
    PE.submitAnswer(q.id, { best: q.bestWorstItems[0], worst: q.bestWorstItems[q.bestWorstItems.length - 1] });
  } else if (q.pairIds && q.pairIds.length > 0) {
    const pairAnswers = {};
    q.pairIds.forEach(p => pairAnswers[p] = "A");
    PE.submitAnswer(q.id, pairAnswers);
  }
}

const progress2 = PE.getProgress();
console.log("\nAfter 6 questions:");
console.log("  Phase:", progress2.phase);
console.log("  Questions answered:", progress2.questionsAnswered);
console.log("  Top archetype:", progress2.topArchetypes[0].name,
  "(" + (progress2.topArchetypes[0].posterior * 100).toFixed(1) + "%)");

// Test getResults
const results = PE.getResults();
console.log("  Top match:", results.match.name, "(posterior:", results.match.posterior.toFixed(4) + ")");
console.log("  Top 5:", results.top5.map(r => r.name).join(", "));

// Test getQuestionDef
const qDef = PE.getQuestionDef(1);
console.log("\ngetQuestionDef(1) promptShort:", qDef ? qDef.promptShort : "NOT FOUND");

console.log("\n=== All tests passed ===");
