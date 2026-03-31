/**
 * UI Completeness Check
 * 
 * Walks every question in REPRESENTATIVE_QUESTIONS and verifies that
 * the browser adapter (toQuizQuestion) would produce a renderable
 * question for the quiz-adapter UI.
 */

import { REPRESENTATIVE_QUESTIONS } from "../config/questions.representative.js";
import type { QuestionDef } from "../types.js";

interface Issue {
  questionId: number;
  promptShort: string;
  uiType: string;
  problem: string;
}

const issues: Issue[] = [];

for (const q of REPRESENTATIVE_QUESTIONS) {
  // Skip questions with no touch profile (filtered out in api.ts)
  if (q.touchProfile.length === 0) continue;

  switch (q.uiType) {
    case "single_choice":
    case "multi": {
      if (!q.optionEvidence || Object.keys(q.optionEvidence).length === 0) {
        issues.push({
          questionId: q.id,
          promptShort: q.promptShort,
          uiType: q.uiType,
          problem: "No optionEvidence → no options to render",
        });
      }
      break;
    }

    case "slider": {
      if (!q.sliderMap || Object.keys(q.sliderMap).length === 0) {
        issues.push({
          questionId: q.id,
          promptShort: q.promptShort,
          uiType: q.uiType,
          problem: "No sliderMap → slider will use defaults but no evidence mapping",
        });
      }
      break;
    }

    case "allocation": {
      if (!q.allocationMap || Object.keys(q.allocationMap).length === 0) {
        issues.push({
          questionId: q.id,
          promptShort: q.promptShort,
          uiType: q.uiType,
          problem: "No allocationMap → no buckets to render",
        });
      }
      break;
    }

    case "ranking": {
      if (!q.rankingMap || Object.keys(q.rankingMap).length === 0) {
        issues.push({
          questionId: q.id,
          promptShort: q.promptShort,
          uiType: q.uiType,
          problem: "No rankingMap → no items to drag/rank",
        });
      }
      break;
    }

    case "best_worst": {
      const hasBestWorst = q.bestWorstMap && Object.keys(q.bestWorstMap).length > 0;
      const hasRankingFallback = q.rankingMap && Object.keys(q.rankingMap).length > 0;
      if (!hasBestWorst && !hasRankingFallback) {
        issues.push({
          questionId: q.id,
          promptShort: q.promptShort,
          uiType: q.uiType,
          problem: "No bestWorstMap and no rankingMap fallback → no items to render",
        });
      } else if (!hasBestWorst && hasRankingFallback) {
        // This is the Q63 pattern — now handled by the fix, but flag as FYI
        console.log(`  [INFO] Q${q.id} (${q.promptShort}): best_worst using rankingMap fallback (OK after fix)`);
      }
      break;
    }

    case "pairwise": {
      if (!q.pairMaps || Object.keys(q.pairMaps).length === 0) {
        issues.push({
          questionId: q.id,
          promptShort: q.promptShort,
          uiType: q.uiType,
          problem: "No pairMaps → no pairs to compare",
        });
      }
      break;
    }

    default: {
      // Unknown uiType — would fall through to the default case in the renderer
      if (!q.optionEvidence || Object.keys(q.optionEvidence).length === 0) {
        issues.push({
          questionId: q.id,
          promptShort: q.promptShort,
          uiType: q.uiType,
          problem: `Unknown uiType "${q.uiType}" and no optionEvidence for fallback`,
        });
      }
    }
  }

  // Check that promptFull exists (otherwise users see raw promptShort)
  if (!q.promptFull) {
    issues.push({
      questionId: q.id,
      promptShort: q.promptShort,
      uiType: q.uiType,
      problem: "No promptFull → users see raw snake_case promptShort as question text",
    });
  }

  // Check optionLabels coverage
  if (q.uiType === "single_choice" || q.uiType === "multi") {
    const optionKeys = q.optionEvidence ? Object.keys(q.optionEvidence) : [];
    const labelKeys = q.optionLabels ? Object.keys(q.optionLabels) : [];
    const missing = optionKeys.filter(k => !labelKeys.includes(k));
    if (missing.length > 0) {
      issues.push({
        questionId: q.id,
        promptShort: q.promptShort,
        uiType: q.uiType,
        problem: `Missing optionLabels for: ${missing.join(", ")} → users see raw keys`,
      });
    }
  }

  // Check ranking/best_worst/allocation optionLabels
  if (q.uiType === "ranking" || q.uiType === "best_worst") {
    const itemKeys = q.rankingMap ? Object.keys(q.rankingMap) : (q.bestWorstMap ? Object.keys(q.bestWorstMap) : []);
    const labelKeys = q.optionLabels ? Object.keys(q.optionLabels) : [];
    const missing = itemKeys.filter(k => !labelKeys.includes(k));
    if (missing.length > 0) {
      issues.push({
        questionId: q.id,
        promptShort: q.promptShort,
        uiType: q.uiType,
        problem: `Missing optionLabels for ranking/bw items: ${missing.join(", ")} → users see raw keys`,
      });
    }
  }

  if (q.uiType === "allocation") {
    const bucketKeys = q.allocationMap ? Object.keys(q.allocationMap) : [];
    const labelKeys = q.optionLabels ? Object.keys(q.optionLabels) : [];
    const missing = bucketKeys.filter(k => !labelKeys.includes(k));
    if (missing.length > 0) {
      issues.push({
        questionId: q.id,
        promptShort: q.promptShort,
        uiType: q.uiType,
        problem: `Missing optionLabels for allocation buckets: ${missing.join(", ")} → users see raw keys`,
      });
    }
  }
}

// Summary
console.log(`\n=== PRISM Quiz UI Completeness Check ===`);
console.log(`Questions scanned: ${REPRESENTATIVE_QUESTIONS.filter(q => q.touchProfile.length > 0).length}`);
console.log(`Issues found: ${issues.length}\n`);

if (issues.length === 0) {
  console.log("✅ All questions have proper UI data!");
} else {
  // Group by severity
  const critical = issues.filter(i => 
    i.problem.includes("no options") || 
    i.problem.includes("no items") || 
    i.problem.includes("no buckets") || 
    i.problem.includes("no pairs")
  );
  const cosmetic = issues.filter(i => 
    i.problem.includes("optionLabels") || 
    i.problem.includes("promptFull")
  );

  if (critical.length > 0) {
    console.log(`🔴 CRITICAL (broken UI - ${critical.length}):`);
    for (const i of critical) {
      console.log(`  Q${i.questionId} [${i.uiType}] ${i.promptShort}: ${i.problem}`);
    }
    console.log();
  }

  if (cosmetic.length > 0) {
    console.log(`🟡 COSMETIC (ugly but functional - ${cosmetic.length}):`);
    for (const i of cosmetic) {
      console.log(`  Q${i.questionId} [${i.uiType}] ${i.promptShort}: ${i.problem}`);
    }
  }
}
