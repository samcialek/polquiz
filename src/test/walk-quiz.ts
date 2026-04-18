/**
 * Walk the entire quiz programmatically, checking for bugs at each step.
 * Simulates what the browser adapter does.
 */

import { initQuiz, getNextQuestion, submitAnswer, getProgress, isComplete, getResults } from "../browser/api.js";

interface Bug {
  questionNum: number;
  questionId: number;
  promptShort: string;
  uiType: string;
  severity: "CRITICAL" | "WARNING" | "INFO";
  description: string;
}

const bugs: Bug[] = [];
const seenIds = new Set<number>();

// Init
initQuiz();
let step = 0;
const MAX_STEPS = 100; // safety valve

while (!isComplete() && step < MAX_STEPS) {
  step++;
  const q = getNextQuestion();
  if (!q) {
    bugs.push({
      questionNum: step,
      questionId: -1,
      promptShort: "N/A",
      uiType: "N/A",
      severity: "CRITICAL",
      description: "getNextQuestion() returned null but isComplete() is false"
    });
    break;
  }

  // Check for infinite loop
  if (seenIds.has(q.id)) {
    bugs.push({
      questionNum: step,
      questionId: q.id,
      promptShort: q.promptShort,
      uiType: q.uiType,
      severity: "CRITICAL",
      description: `LOOP DETECTED: Question ${q.id} served again (first seen earlier)`
    });
    break;
  }
  seenIds.add(q.id);

  const progress = getProgress();

  // Check question has text
  if (!q.promptShort) {
    bugs.push({
      questionNum: step,
      questionId: q.id,
      promptShort: "(missing)",
      uiType: q.uiType,
      severity: "WARNING",
      description: "Missing promptShort"
    });
  }

  // Check by uiType
  switch (q.uiType) {
    case "single_choice":
    case "multi": {
      if (!q.options || q.options.length === 0) {
        bugs.push({
          questionNum: step, questionId: q.id, promptShort: q.promptShort, uiType: q.uiType,
          severity: "CRITICAL",
          description: "No options to render — empty options array"
        });
        // Can't submit, break
        submitAnswer(q.id, q.options?.[0] || "dummy");
      } else {
        // Check for duplicate option labels
        const labels = q.options.map(o => q.optionLabels?.[o] || o);
        const seen = new Set<string>();
        for (const l of labels) {
          if (seen.has(l)) {
            bugs.push({
              questionNum: step, questionId: q.id, promptShort: q.promptShort, uiType: q.uiType,
              severity: "WARNING",
              description: `Duplicate option label: "${l}"`
            });
          }
          seen.add(l);
        }
        // Submit first option
        submitAnswer(q.id, q.options[0]);
      }
      break;
    }

    case "slider": {
      // Submit middle value
      submitAnswer(q.id, 4);
      break;
    }

    case "allocation": {
      if (!q.allocationBuckets || q.allocationBuckets.length === 0) {
        bugs.push({
          questionNum: step, questionId: q.id, promptShort: q.promptShort, uiType: q.uiType,
          severity: "CRITICAL",
          description: "No allocation buckets to render"
        });
      }
      // Submit equal allocation
      const buckets = q.allocationBuckets || [];
      const alloc: Record<string, number> = {};
      const each = Math.floor(100 / buckets.length);
      buckets.forEach((b, i) => {
        alloc[b] = i === 0 ? 100 - each * (buckets.length - 1) : each;
      });
      submitAnswer(q.id, alloc);
      break;
    }

    case "ranking": {
      if (!q.rankingItems || q.rankingItems.length === 0) {
        bugs.push({
          questionNum: step, questionId: q.id, promptShort: q.promptShort, uiType: q.uiType,
          severity: "CRITICAL",
          description: "No ranking items to render"
        });
      }
      // Submit default order
      submitAnswer(q.id, q.rankingItems || []);
      break;
    }

    case "best_worst": {
      const items = q.bestWorstItems;
      if (!items || items.length === 0) {
        bugs.push({
          questionNum: step, questionId: q.id, promptShort: q.promptShort, uiType: q.uiType,
          severity: "CRITICAL",
          description: "No best/worst items to render — bestWorstItems is empty"
        });
        // Try to submit anyway
        submitAnswer(q.id, { best: "dummy", worst: "dummy2" });
      } else if (items.length < 2) {
        bugs.push({
          questionNum: step, questionId: q.id, promptShort: q.promptShort, uiType: q.uiType,
          severity: "CRITICAL",
          description: `Only ${items.length} best/worst item(s) — need at least 2`
        });
        submitAnswer(q.id, { best: items[0], worst: items[0] });
      } else {
        // Submit first as best, last as worst
        submitAnswer(q.id, { best: items[0], worst: items[items.length - 1] });
      }
      break;
    }

    case "pairwise": {
      if (!q.pairIds || q.pairIds.length === 0) {
        bugs.push({
          questionNum: step, questionId: q.id, promptShort: q.promptShort, uiType: q.uiType,
          severity: "CRITICAL",
          description: "No pair IDs for pairwise question"
        });
      }
      // Submit first option
      const opts = q.options || ["option_a"];
      submitAnswer(q.id, { [q.pairIds?.[0] || "pair"]: opts[0] });
      break;
    }

    default: {
      bugs.push({
        questionNum: step, questionId: q.id, promptShort: q.promptShort, uiType: q.uiType,
        severity: "WARNING",
        description: `Unknown uiType "${q.uiType}" — renderer may not handle this`
      });
      // Try as single choice
      if (q.options && q.options.length > 0) {
        submitAnswer(q.id, q.options[0]);
      } else {
        submitAnswer(q.id, 4);
      }
    }
  }

  // Verify answer was recorded (check progress advanced)
  const newProgress = getProgress();
  if (newProgress.questionsAnswered <= progress.questionsAnswered) {
    bugs.push({
      questionNum: step, questionId: q.id, promptShort: q.promptShort, uiType: q.uiType,
      severity: "CRITICAL",
      description: "Answer NOT recorded — questionsAnswered didn't increment. This will cause an infinite loop!"
    });
    break; // Would loop forever
  }

  console.log(`  Q${step} [${q.uiType}] ${q.promptShort} — OK (${newProgress.questionsAnswered}/${newProgress.estimatedTotal})`);
}

if (step >= MAX_STEPS) {
  bugs.push({
    questionNum: step, questionId: -1, promptShort: "N/A", uiType: "N/A",
    severity: "CRITICAL",
    description: `Hit MAX_STEPS (${MAX_STEPS}) — quiz never completed`
  });
}

// Results
console.log(`\n=== QUIZ WALKTHROUGH COMPLETE ===`);
console.log(`Questions answered: ${step}`);
console.log(`Bugs found: ${bugs.length}\n`);

const critical = bugs.filter(b => b.severity === "CRITICAL");
const warnings = bugs.filter(b => b.severity === "WARNING");
const info = bugs.filter(b => b.severity === "INFO");

if (critical.length > 0) {
  console.log(`🔴 CRITICAL (${critical.length}):`);
  for (const b of critical) {
    console.log(`  Q${b.questionNum} [${b.uiType}] ${b.promptShort}: ${b.description}`);
  }
  console.log();
}

if (warnings.length > 0) {
  console.log(`🟡 WARNING (${warnings.length}):`);
  for (const b of warnings) {
    console.log(`  Q${b.questionNum} [${b.uiType}] ${b.promptShort}: ${b.description}`);
  }
  console.log();
}

if (bugs.length === 0) {
  console.log("✅ No bugs found — quiz completes cleanly!");
}

if (isComplete()) {
  const results = getResults();
  console.log(`\nTop result: ${results.match.name} (d=${results.match.distance.toFixed(2)})`);
}
