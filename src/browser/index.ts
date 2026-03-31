/**
 * Browser entry point — re-exports the public API
 * and attaches it to window.PrismEngine.
 */

export {
  initQuiz,
  getNextQuestion,
  submitAnswer,
  getProgress,
  getResults,
  isComplete,
  getQuestionIds,
  getQuestionDef,
  getArchetypeCount,
  getRespondentState,
  canGoBack,
  goBack,
} from "./api.js";

export {
  mountQuiz,
  attachToExistingQuiz,
} from "./quiz-adapter.js";

export type {
  QuizQuestion,
  QuizProgress,
  ArchetypeResult,
  QuizResults,
} from "./api.js";
