/**
 * Browser entry point — re-exports the public API
 * and attaches it to window.PrismEngine.
 */
export { initQuiz, getNextQuestion, submitAnswer, getProgress, getResults, isComplete, getQuestionIds, getQuestionDef, getArchetypeCount, getRespondentState, getIdentityPrimaryResult, canGoBack, goBack, applyRatioBoost, getElectionPredictions, BUNDLE_VERSION, } from "./api.js";
export { mountQuiz, attachToExistingQuiz, } from "./quiz-adapter.js";
export type { QuizQuestion, QuizProgress, ArchetypeResult, QuizResults, IdentityPrimaryDemographics, IdentityPrimaryResult, ElectionPrediction, } from "./api.js";
