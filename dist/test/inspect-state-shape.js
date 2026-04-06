import { initQuiz, getRespondentState, getNextQuestion, submitAnswer } from "../browser/api.js";
initQuiz();
// Answer one question to populate state
const q = getNextQuestion();
if (q) {
    const first = q.options?.[0] ?? "never";
    submitAnswer(q.id, first);
}
const state = getRespondentState();
console.log("Continuous node keys shape:");
if (state?.continuous) {
    const c = state.continuous;
    const firstKey = Object.keys(c)[0];
    console.log(`  First node: ${firstKey}`);
    console.log(`  Shape:`, c[firstKey]);
}
console.log();
console.log("Results page reads:  respondentState[code].pos  and  respondentState[code].sal");
console.log("API returns:         expectedPos               and  salience");
console.log();
console.log("Do those fields exist?");
if (state?.continuous) {
    const c = state.continuous;
    const firstNode = c[Object.keys(c)[0]];
    console.log(`  .pos         = ${firstNode.pos}`);
    console.log(`  .sal         = ${firstNode.sal}`);
    console.log(`  .expectedPos = ${firstNode.expectedPos}`);
    console.log(`  .salience    = ${firstNode.salience}`);
}
//# sourceMappingURL=inspect-state-shape.js.map