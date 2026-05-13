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
  getRespondentState,
  getIdentityPrimaryResult,
  canGoBack,
  goBack,
  applyRatioBoost,
  getElectionPredictions,
  composeArchetypeLabel,
  composeArchetypeDescription,
  composeAtomFallback,
  tokenizeRespondent,
  LABEL_DESCRIPTIONS,
  BUNDLE_VERSION,
} from "./api.js";

export {
  mountQuiz,
  attachToExistingQuiz,
} from "./quiz-adapter.js";

export type {
  QuizQuestion,
  QuizProgress,
  QuizResults,
  IdentityPrimaryDemographics,
  IdentityPrimaryResult,
  ElectionPrediction,
} from "./api.js";
