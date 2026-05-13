import { REPRESENTATIVE_QUESTIONS } from "../config/questions.representative.js";
const q = REPRESENTATIVE_QUESTIONS.find(x => x.id === 93);
console.log("Q93 uiType:", q.uiType);
const keys = Object.keys(q.rankingMap ?? {});
for (const k of keys) {
    const item = q.rankingMap[k];
    console.log(" ", k, "continuous=", JSON.stringify(item.continuous));
}
//# sourceMappingURL=probe-q93.js.map